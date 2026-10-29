import { addProtocol, removeProtocol, type Map as LibreMap, type VectorTileSource } from 'maplibre-gl'
import type { Asset } from '../src/release'
import footprints from './replacement-footprints.json'
import { replaceBuildingTile, type Footprint } from './building-geometry'
import type { MultiPolygon } from 'polygon-clipping'

const shapes = footprints.assets as unknown as Record<string, MultiPolygon>
const protocol = 'landmark-buildings'

/** A separate building source lets us split merged polygons without touching
 * the basemap's roads, labels, or the third-party tile service. Runs entirely
 * in the browser; raw tiles are cached across model/LOD changes. */
export class BuildingTiles {
  private revision = 0
  private snapshots = new Map<number, Footprint[]>([[0, []]])
  private cache = new Map<string, Promise<Uint8Array>>()
  private timer?: ReturnType<typeof setTimeout>
  private active: Asset[] = []
  private disposed = false
  private loadedTiles = new Set<string>()
  readonly sourceId = 'landmark-buildings'

  constructor(private map: LibreMap, private ids: (asset: Asset) => number[]) {
    const basemap = map.getSource('openmaptiles') as VectorTileSource
    const template = basemap.tiles[0]
    addProtocol(protocol, async (params, controller) => {
      const url = new URL(params.url)
      const [z, x, y] = url.pathname.slice(1).replace('.pbf', '').split('/').map(Number)
      const rawUrl = template.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y))
      let raw = this.cache.get(rawUrl)
      if (!raw) {
        raw = fetch(rawUrl).then(async response => {
          if (!response.ok) throw new Error(`Buildings: HTTP ${response.status}`)
          return new Uint8Array(await response.arrayBuffer())
        }).catch(error => { this.cache.delete(rawUrl); throw error })
        this.cache.set(rawUrl, raw)
        if (this.cache.size > 64) this.cache.delete(this.cache.keys().next().value!)
      }
      const bytes = await raw
      if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError')
      const masks = this.snapshots.get(Number(url.searchParams.get('v'))) ?? []
      const output = replaceBuildingTile(bytes, { z, x, y }, masks)
      if (Number(url.searchParams.get('v')) === this.revision) {
        this.loadedTiles.add(`${z}/${x}/${y}`)
        map.getCanvas().dataset.buildingTiles = String(this.loadedTiles.size)
      }
      return { data: output.buffer as ArrayBuffer }
    })
    map.addSource(this.sourceId, { type: 'vector', tiles: [this.template()], minzoom: 14,
      maxzoom: basemap.maxzoom })
    // Keep the basemap's original flat buildings below the model zoom. Above
    // it, use the rewritten polygons for both the ground fill and extrusion.
    for (const layer of map.getStyle().layers) {
      if ('source-layer' in layer && layer['source-layer'] === 'building' && layer.source === 'openmaptiles') {
        if (layer.type === 'fill-extrusion') map.removeLayer(layer.id)
        else {
          map.setLayerZoomRange(layer.id, layer.minzoom ?? 0, 14)
          map.addLayer({ ...layer, id: `${layer.id}-replaced`, source: this.sourceId, minzoom: 14 }, layer.id)
        }
      }
    }
  }

  private template() { return `${protocol}://tiles/{z}/{x}/{y}.pbf?v=${this.revision}` }

  setAssets(assets: Asset[]) {
    this.active = assets
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      if (this.disposed) return
      this.revision++
      this.loadedTiles.clear()
      this.map.getCanvas().dataset.buildingTiles = '0'
      this.snapshots.set(this.revision, this.active.map(a => ({ geometry: a.replacementFootprint ? (a.replacementFootprint.type === 'Polygon' ? [a.replacementFootprint.coordinates] : a.replacementFootprint.coordinates) as MultiPolygon : shapes[a.id] ?? [], ids: this.ids(a) })))
      while (this.snapshots.size > 4) this.snapshots.delete(this.snapshots.keys().next().value!)
      ;(this.map.getSource(this.sourceId) as VectorTileSource).setTiles([this.template()])
    }, 150)
  }

  dispose() {
    this.disposed = true
    clearTimeout(this.timer)
    removeProtocol(protocol)
    this.cache.clear()
  }
}
