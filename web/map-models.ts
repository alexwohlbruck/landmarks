import { MercatorCoordinate, type CustomLayerInterface, type CustomRenderMethodInput, type Map as LibreMap, type MapMouseEvent } from 'maplibre-gl'
import { AnimationMixer, AmbientLight, Box3, Camera, DirectionalLight, Group, InstancedMesh, Matrix4, Mesh, Raycaster, Scene, Vector2, Vector3, Vector4, WebGLRenderer,
  type AnimationClip, type Material, type Object3D } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import type { Asset } from '../src/release'
import { nightGlb } from './night-model'
import { BuildingTiles } from './building-tiles'
import { baseSink, elevationDrape, GROUND_STRIDE, groundContacts, groundLifts, modelGround, type Contact, type Footprint, type ModelGround } from './landmark-ground'

/** OpenFreeMap uses Planetiler IDs: OSM ID * 10 + node/way/relation type. */
export function replacementIds(asset: Asset): number[] {
  return [asset.osm, ...asset.additionalOsm].flatMap(ref => {
    if (!ref) return []
    const kind = { node: 1, way: 2, relation: 3 }[ref.type]
    return kind ? [ref.id * 10 + kind] : []
  })
}

export function isInView(asset: Asset, bounds: [number, number, number, number], zoom: number, selectedId?: string) {
  return zoom >= (asset.id === selectedId ? 13 : Math.max(13, asset.minZoom)) &&
    asset.bounds[0] <= bounds[2] && asset.bounds[2] >= bounds[0] &&
    asset.bounds[1] <= bounds[3] && asset.bounds[3] >= bounds[1]
}

/** A point `x` metres east and `z` south of an anchor, as a placement's frame puts it. */
export function modelToLngLat(anchor: [number, number], x: number, z: number): [number, number] {
  const at = MercatorCoordinate.fromLngLat(anchor)
  const unit = at.meterInMercatorCoordinateUnits()
  const p = new MercatorCoordinate(at.x + x * unit, at.y + z * unit, 0).toLngLat()
  return [p.lng, p.lat]
}

/** The GROUND_GRID² points the ground is read at over a model's plan extent, row by row from its north-west corner. */
export function groundGrid({ minX, maxX, minZ, maxZ }: Footprint): [number, number, number][] {
  const n = GROUND_GRID - 1
  const points: [number, number, number][] = []
  for (let j = 0; j <= n; j++)
    for (let i = 0; i <= n; i++) points.push([minX + ((maxX - minX) * i) / n, 0, minZ + ((maxZ - minZ) * j) / n])
  return points
}

/** Points per side of the grid the ground under a model is read on, as Parchment reads it. */
const GROUND_GRID = 7

/** Metres over its own ground a vertex fades from following the terrain to the model's mean lift; Parchment's GROUND_BLEND. */
const GROUND_BLEND = 25

/**
 * Parchment's drape (`GROUND` in its `landmark-layer.ts`), around three.js's
 * own projection. A vertex is read in the model's frame, `u_root` being where
 * the model's origin is in the scene and its scale, and only ever moves up or
 * down: by the terrain's rise under it near its own ground, by the mean rise
 * higher up. See `landmark-ground.ts`.
 */
const DRAPE = `
uniform vec2 u_ground[${GROUND_GRID * GROUND_GRID}];
uniform float u_ground_mean;
uniform vec4 u_bounds;
uniform float u_blend;
uniform float u_rigid;
uniform float u_ground_at;
uniform vec2 u_sink;
uniform vec4 u_root;
vec2 groundAt(int i, int j) { return u_ground[j * ${GROUND_GRID} + i]; }
vec2 groundUnder(vec2 xz) {
  vec2 span = max(u_bounds.zw - u_bounds.xy, vec2(1e-3));
  vec2 g = clamp((xz - u_bounds.xy) / span, 0.0, 1.0) * float(${GROUND_GRID - 1});
  ivec2 c = min(ivec2(floor(g)), ivec2(${GROUND_GRID - 2}));
  vec2 f = g - vec2(c);
  return mix(
    mix(groundAt(c.x, c.y), groundAt(c.x + 1, c.y), f.x),
    mix(groundAt(c.x, c.y + 1), groundAt(c.x + 1, c.y + 1), f.x),
    f.y);
}
float drapeLift(vec3 p) {
  vec2 g = groundUnder(p.xz);
  float above = p.y - g.y - u_ground_at;
  float follow = (1.0 - u_rigid) * (1.0 - clamp(above / u_blend, 0.0, 1.0));
  float base = (1.0 - u_rigid) * step(above, u_sink.y) * u_sink.x;
  return mix(u_ground_mean, g.x - g.y, follow) - base;
}
`

const PROJECT = `
vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
  mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
  mvPosition = instanceMatrix * mvPosition;
#endif
vec4 draped = modelMatrix * mvPosition;
draped.y += drapeLift((draped.xyz - u_root.xyz) / u_root.w) * u_root.w;
mvPosition = viewMatrix * draped;
gl_Position = projectionMatrix * mvPosition;
`

function drapeUniforms() {
  return {
    u_ground: { value: Array.from({ length: GROUND_GRID * GROUND_GRID }, () => new Vector2()) },
    u_ground_mean: { value: 0 },
    u_bounds: { value: new Vector4() },
    u_blend: { value: GROUND_BLEND },
    u_rigid: { value: 0 },
    u_ground_at: { value: 0 },
    u_sink: { value: new Vector2() },
    u_root: { value: new Vector4(0, 0, 0, 1) },
  }
}

type Drape = ReturnType<typeof drapeUniforms>

/**
 * What the drape needs of a model, read once from its geometry in its own
 * frame: its plan extent and the lowest vertex across it (see
 * `groundContacts`), leaving out the parts its animation moves.
 */
function groundOf(scene: Object3D, animations: readonly AnimationClip[]): { footprint: Footprint; contacts: Contact[] } {
  scene.updateMatrixWorld(true)
  const box = new Box3().setFromObject(scene)
  const footprint = { minX: box.min.x, maxX: box.max.x, minZ: box.min.z, maxZ: box.max.z }
  const moving = new Set(animations.flatMap(clip => clip.tracks.map(track => track.name.split('.')[0])))
  const primitives: { position: Float32Array; node: number }[] = []
  const v = new Vector3()
  const instance = new Matrix4()
  scene.traverse(object => {
    if (!(object instanceof Mesh)) return
    for (let o: Object3D | null = object; o; o = o.parent) if (moving.has(o.name) || moving.has(o.uuid)) return
    const attribute = object.geometry.getAttribute('position')
    const matrices = object instanceof InstancedMesh
      ? Array.from({ length: object.count }, (_, i) => { object.getMatrixAt(i, instance); return instance.clone().premultiply(object.matrixWorld) })
      : [object.matrixWorld]
    for (const matrix of matrices) {
      const position = new Float32Array(attribute.count * 3)
      for (let i = 0; i < attribute.count; i++) v.fromBufferAttribute(attribute, i).applyMatrix4(matrix).toArray(position, i * 3)
      primitives.push({ position, node: -1 })
    }
  })
  return { footprint, contacts: groundContacts(primitives, footprint) }
}

type Model = {
  asset: Asset; url: string; root: Group; mixer?: AnimationMixer; size: Vector3
  footprint: Footprint; contacts: Contact[]; own?: ModelGround; drape: Drape; base: number
}
type Pending = { url: string; controller: AbortController }

/** Shared-depth Three.js layer. Published GLBs already contain bearing and scale. */
export class LandmarkModels implements CustomLayerInterface {
  readonly id = 'landmark-models'
  readonly type = 'custom' as const
  readonly renderingMode = '3d' as const
  private map!: LibreMap
  private renderer!: WebGLRenderer
  private scene = new Scene()
  private camera = new Camera()
  private loader = new GLTFLoader()
  private models = new Map<string, Model>()
  private pending = new Map<string, Pending>()
  private failures = new Map<string, number>()
  private wanted: Asset[] = []
  private assets: Asset[] = []
  private night = false
  private selectedId?: string
  private focusId?: string
  private origin = MercatorCoordinate.fromLngLat([0, 0])
  private frame = new Matrix4()
  private lastFrame = 0
  private removed = false
  private buildings!: BuildingTiles
  private frameRequest?: number
  private replacementKey?: string

  constructor(private url: (path: string) => string, private onSelect: (asset: Asset) => void,
    private onError: (message: string) => void, private onActive?: (assets: Asset[]) => void) {}

  onAdd(map: LibreMap, gl: WebGL2RenderingContext) {
    this.map = map
    this.renderer = new WebGLRenderer({ canvas: map.getCanvas(), context: gl })
    this.renderer.autoClear = false
    this.scene.add(new AmbientLight(0xffffff, 1.5))
    const sun = new DirectionalLight(0xfff4df, 2.5)
    sun.position.set(-500, 1000, 500)
    this.scene.add(sun)
    this.buildings = new BuildingTiles(map, replacementIds)
    const before = map.getStyle().layers.find(l => l.type === 'symbol')?.id
    map.addLayer({
      id: 'buildings-3d', type: 'fill-extrusion', source: this.buildings.sourceId, 'source-layer': 'building', minzoom: 14,
      filter: ['!=', ['get', 'hide_3d'], true],
      paint: {
        'fill-extrusion-color': '#d1cec4',
        'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 5],
        'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
        'fill-extrusion-opacity': 1,
      },
    }, before)
    map.on('moveend', this.schedule)
    map.on('zoomend', this.schedule)
    map.on('terrain', this.schedule)
    map.on('sourcedata', this.terrainLoaded)
    map.on('click', this.pick)
    map.on('dragstart', this.cancelFocus)
    this.sync()
  }

  setAssets(assets: Asset[], selectedId?: string) {
    this.assets = assets
    this.selectedId = selectedId
    if (this.map) this.schedule()
  }

  setNight(night: boolean) {
    if (this.night === night) return
    this.night = night
    if (this.map) this.schedule()
  }

  focus(asset: Asset) {
    this.focusId = asset.id
    const model = this.models.get(asset.id)
    if (model) this.frameModel(model)
    else this.map.flyTo({ center: asset.anchor, elevation: this.map.queryTerrainElevation(asset.anchor) ?? 0, zoom: 16, pitch: 60, bearing: -25,
      duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 800 })
  }

  private cancelFocus = () => { this.focusId = undefined }

  /** Models are re-set on the ground as the terrain's tiles arrive. */
  private terrainLoaded = (event: { sourceId?: string; tile?: unknown }) => {
    if (event.tile && event.sourceId === this.map.getTerrain()?.source) this.schedule()
  }

  /** The terrain's height at a point in a model's frame, 0 where its tile has not loaded. */
  private terrainAt(asset: Asset, [x, , z]: readonly number[]) {
    return this.map.queryTerrainElevation(modelToLngLat(asset.anchor, x, z)) ?? 0
  }

  private frameModel(model: Model) {
    if (this.focusId !== model.asset.id) return
    this.focusId = undefined
    const extent = Math.max(model.size.x, model.size.y, model.size.z, 30)
    const pixels = Math.min(this.map.getCanvas().clientWidth, this.map.getCanvas().clientHeight) * 0.4
    const metersPerPixel = 40_075_016.686 * Math.cos(model.asset.anchor[1] * Math.PI / 180) / 512
    const zoom = Math.max(14, Math.min(18, Math.log2(metersPerPixel * pixels / extent)))
    this.map.flyTo({ center: model.asset.anchor, elevation: model.base + model.size.y * 0.4 + (model.asset.elevation ?? 0),
      zoom, pitch: 60, bearing: -25, duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 700 })
  }

  private schedule = () => {
    if (this.removed || this.frameRequest !== undefined) return
    this.frameRequest = requestAnimationFrame(() => { this.frameRequest = undefined; this.sync() })
  }

  private sync() {
    const b = this.map.getBounds()
    const bounds: [number, number, number, number] = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]
    const zoom = this.map.getZoom()
    this.origin = MercatorCoordinate.fromLngLat(this.map.getCenter())
    const s = this.origin.meterInMercatorCoordinateUnits()
    // Local scene: X east, Y up, Z south. Mercator: X east, Y south, Z up.
    this.frame.makeTranslation(this.origin.x, this.origin.y, 0)
      .multiply(new Matrix4().makeScale(s, -s, s))
      .multiply(new Matrix4().makeRotationX(Math.PI / 2))
    this.wanted = this.assets.filter(a => isInView(a, bounds, zoom, this.selectedId))
      .sort((a, b) => Number(b.id === this.selectedId) - Number(a.id === this.selectedId))
    const wantedIds = new Set(this.wanted.map(a => a.id))
    for (const [id, p] of this.pending) {
      if (!wantedIds.has(id) || p.url !== this.lodUrl(this.wanted.find(a => a.id === id)!)) p.controller.abort()
    }
    for (const [id, model] of this.models) {
      model.root.visible = wantedIds.has(id)
      if (model.root.visible) this.position(model)
    }
    // Evict offscreen GPU resources; visible models are never capped.
    for (const [id, model] of this.models) {
      if (this.models.size <= 100) break
      if (!model.root.visible) { this.dispose(model); this.models.delete(id) }
    }
    this.updateBuildings()
    this.pump()
    this.map.triggerRepaint()
  }

  private lodUrl(asset: Asset) {
    return this.url((this.map.getZoom() >= (asset.detailZoom ?? 17) && asset.lods.detail ? asset.lods.detail : asset.lods.low).url) + (this.night ? '#night' : '')
  }

  private pump() {
    if (this.removed) return
    for (const asset of this.wanted) {
      if (this.pending.size >= 4) break
      const url = this.lodUrl(asset)
      if (this.models.get(asset.id)?.url === url || this.pending.has(asset.id)) continue
      if ((this.failures.get(url) ?? 0) > Date.now()) continue
      const controller = new AbortController()
      this.pending.set(asset.id, { url, controller })
      void this.load(asset, url, controller)
    }
  }

  private async load(asset: Asset, url: string, controller: AbortController) {
    try {
      const response = await fetch(url, { signal: controller.signal })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const original = new Uint8Array(await response.arrayBuffer())
      const bytes = url.endsWith('#night') ? nightGlb(original) : original
      const gltf = await this.loader.parseAsync(bytes.buffer as ArrayBuffer, new URL('.', url).href)
      const root = new Group()
      root.add(gltf.scene)
      root.userData.asset = asset
      // The map supplies a composed projection/view matrix, so Three's own
      // frustum extraction is unsuitable; visibility is determined geographically.
      root.traverse(object => { object.frustumCulled = false })
      const drape = drapeUniforms()
      root.traverse(object => {
        if (!(object instanceof Mesh)) return
        for (const material of (Array.isArray(object.material) ? object.material : [object.material]) as Material[]) {
          material.onBeforeCompile = shader => {
            Object.assign(shader.uniforms, drape)
            shader.vertexShader = DRAPE + shader.vertexShader.replace('#include <project_vertex>', PROJECT)
          }
          material.customProgramCacheKey = () => 'drape'
        }
      })
      const model: Model = { asset, url, root, size: new Box3().setFromObject(root).getSize(new Vector3()),
        ...groundOf(gltf.scene, gltf.animations), drape, base: 0 }
      if (gltf.animations.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        model.mixer = new AnimationMixer(gltf.scene)
        gltf.animations.forEach(clip => model.mixer!.clipAction(clip).play())
      }
      if (controller.signal.aborted || this.removed) { this.dispose(model); return }
      const old = this.models.get(asset.id)
      if (old) this.dispose(old)
      this.models.set(asset.id, model)
      this.scene.add(root)
      this.position(model)
      this.frameModel(model)
      this.updateBuildings()
      this.map.triggerRepaint()
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error(`Map model ${asset.id}:`, error)
        this.failures.set(url, Date.now() + 30_000)
        this.onError(`Could not load ${asset.name} on the map. Its original building is retained.`)
      }
    } finally {
      this.pending.delete(asset.id)
      this.pump()
    }
  }

  /**
   * Stands a model on the terrain the way Parchment does (its `place`): its
   * base on the lowest ground across its plan extent, the drape lifting the
   * rest over the slope. Without the terrain, or before any of it has loaded,
   * it stands flat at its anchor.
   */
  private position(model: Model) {
    const { asset, drape } = model
    const elevation = asset.elevation ?? 0
    const terrain = !!this.map.getTerrain()
    model.base = 0
    if (terrain) {
      const at = (p: readonly number[]) => this.terrainAt(asset, p)
      if (!model.own) {
        // Unloaded ground reads 0, as does the sea, so the model's ground is
        // judged for good only once the terrain has loaded.
        const loaded = this.map.isSourceLoaded(this.map.getTerrain()!.source)
        const raw = model.contacts.map(at).map(h => (h === 0 && !loaded ? NaN : h))
        const own = modelGround(model.contacts, raw, 1)
        if (loaded) model.own = own
      }
      const lifts = groundLifts(groundGrid(model.footprint).map(at), 1, model.own ?? { follows: false }, 1)
      model.base = lifts.lowest
      // The fill's depth, the third value, is 0: the site draws the terrain unfilled.
      drape.u_ground.value.forEach((g, i) => g.set(lifts.lifts[i * GROUND_STRIDE], lifts.lifts[i * GROUND_STRIDE + 1]))
      drape.u_ground_mean.value = lifts.mean
    } else {
      drape.u_ground.value.forEach(g => g.set(0, 0))
      drape.u_ground_mean.value = 0
    }
    const { minX, minZ, maxX, maxZ } = model.footprint
    drape.u_bounds.value.set(minX, minZ, maxX, maxZ)
    const sink = baseSink(model.own ?? { follows: false }, 1, terrain)
    drape.u_sink.value.set(sink.depth, sink.band)
    const lift = elevationDrape(elevation, 1, terrain)
    drape.u_rigid.value = lift.rigid ? 1 : 0
    drape.u_ground_at.value = lift.groundAt
    const anchor = MercatorCoordinate.fromLngLat(asset.anchor, model.base + elevation)
    const unit = this.origin.meterInMercatorCoordinateUnits()
    model.root.position.set((anchor.x - this.origin.x) / unit, anchor.z / unit, (anchor.y - this.origin.y) / unit)
    model.root.scale.setScalar(anchor.meterInMercatorCoordinateUnits() / unit)
    model.root.updateMatrixWorld(true)
    drape.u_root.value.set(model.root.position.x, model.root.position.y, model.root.position.z, model.root.scale.x)
  }

  private updateBuildings() {
    const active = [...this.models.values()].filter(m => m.root.visible).map(m => m.asset)
    const key = active.map(a => a.id).sort().join(',')
    if (key === this.replacementKey) return
    this.replacementKey = key
    this.onActive?.(active)
    this.buildings.setAssets(active)
    if (this.map.getLayer('landmark-points')) {
      this.map.setFilter('landmark-points', ['all', ['!', ['has', 'point_count']],
        ['!', ['in', ['get', 'id'], ['literal', active.map(a => a.id)]]]])
    }
    // Machine-readable state also makes smoke checks possible without a global debug API.
    this.map.getCanvas().dataset.models = String(active.length)
  }

  render(_gl: WebGL2RenderingContext, options: CustomRenderMethodInput) {
    this.camera.projectionMatrix.fromArray(options.defaultProjectionData.mainMatrix).multiply(this.frame)
    this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert()
    const now = performance.now()
    const delta = this.lastFrame ? Math.min((now - this.lastFrame) / 1000, 0.1) : 0
    this.lastFrame = now
    let animate = false
    for (const model of this.models.values()) {
      if (model.root.visible && model.mixer) { model.mixer.update(delta); animate = true }
    }
    this.renderer.resetState()
    this.renderer.render(this.scene, this.camera)
    this.renderer.resetState()
    if (animate) this.map.triggerRepaint()
  }

  private pick = (event: MapMouseEvent) => {
    const canvas = this.map.getCanvas()
    const x = event.point.x / canvas.clientWidth * 2 - 1
    const y = 1 - event.point.y / canvas.clientHeight * 2
    const near = new Vector3(x, y, -1).applyMatrix4(this.camera.projectionMatrixInverse)
    const far = new Vector3(x, y, 1).applyMatrix4(this.camera.projectionMatrixInverse)
    const ray = new Raycaster(near, far.sub(near).normalize())
    const visible = [...this.models.values()].filter(m => m.root.visible).map(m => m.root)
    const hit = ray.intersectObjects(visible, true)[0]
    if (!hit) return
    let object = hit.object
    while (!object.userData.asset && object.parent) object = object.parent
    if (object.userData.asset) this.onSelect(object.userData.asset)
  }

  private dispose(model: Model) {
    model.mixer?.stopAllAction()
    model.mixer?.uncacheRoot(model.root.children[0])
    this.scene.remove(model.root)
    model.root.traverse(object => {
      if (!(object instanceof Mesh)) return
      object.geometry.dispose()
      const materials = Array.isArray(object.material) ? object.material : [object.material]
      materials.forEach((material: Material) => material.dispose())
    })
  }

  onRemove() {
    this.removed = true
    if (this.frameRequest !== undefined) cancelAnimationFrame(this.frameRequest)
    this.map.off('moveend', this.schedule)
    this.map.off('zoomend', this.schedule)
    this.map.off('terrain', this.schedule)
    this.map.off('sourcedata', this.terrainLoaded)
    this.map.off('click', this.pick)
    this.map.off('dragstart', this.cancelFocus)
    this.pending.forEach(p => p.controller.abort())
    this.models.forEach(model => this.dispose(model))
    this.buildings.dispose()
    this.renderer.dispose()
  }
}
