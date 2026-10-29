import { MercatorCoordinate, type CustomLayerInterface, type CustomRenderMethodInput, type Map as LibreMap, type MapMouseEvent } from 'maplibre-gl'
import { AnimationMixer, AmbientLight, Box3, Camera, DirectionalLight, Group, Matrix4, Mesh, Raycaster, Scene, Vector3, WebGLRenderer, type Material } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import type { Asset } from '../src/release'
import { nightGlb } from './night-model'
import { BuildingTiles } from './building-tiles'

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

type Model = { asset: Asset; url: string; root: Group; mixer?: AnimationMixer; size: Vector3 }
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
    else this.map.flyTo({ center: asset.anchor, elevation: 0, zoom: 16, pitch: 60, bearing: -25,
      duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 800 })
  }

  private cancelFocus = () => { this.focusId = undefined }

  private frameModel(model: Model) {
    if (this.focusId !== model.asset.id) return
    this.focusId = undefined
    const extent = Math.max(model.size.x, model.size.y, model.size.z, 30)
    const pixels = Math.min(this.map.getCanvas().clientWidth, this.map.getCanvas().clientHeight) * 0.4
    const metersPerPixel = 40_075_016.686 * Math.cos(model.asset.anchor[1] * Math.PI / 180) / 512
    const zoom = Math.max(14, Math.min(18, Math.log2(metersPerPixel * pixels / extent)))
    this.map.flyTo({ center: model.asset.anchor, elevation: model.size.y * 0.4 + (model.asset.elevation ?? 0),
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
      const model: Model = { asset, url, root, size: new Box3().setFromObject(root).getSize(new Vector3()) }
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

  private position(model: Model) {
    const anchor = MercatorCoordinate.fromLngLat(model.asset.anchor, model.asset.elevation ?? 0)
    const unit = this.origin.meterInMercatorCoordinateUnits()
    model.root.position.set((anchor.x - this.origin.x) / unit, anchor.z / unit, (anchor.y - this.origin.y) / unit)
    model.root.scale.setScalar(anchor.meterInMercatorCoordinateUnits() / unit)
    model.root.updateMatrixWorld(true)
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
    this.map.off('click', this.pick)
    this.map.off('dragstart', this.cancelFocus)
    this.pending.forEach(p => p.controller.abort())
    this.models.forEach(model => this.dispose(model))
    this.buildings.dispose()
    this.renderer.dispose()
  }
}
