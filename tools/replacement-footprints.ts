/** Refresh the demo's OSM replacement footprints. Never runs during a static build.
 * bun tools/replacement-footprints.ts [--input saved-overpass.json]
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import clipping, { type MultiPolygon, type Pair, type Ring } from 'polygon-clipping'
import type { Catalog } from '../src/catalog'

type Coord = { lon: number; lat: number }
type Element = { type: string; id: number; tags?: Record<string, string>; geometry?: Coord[];
  members?: { type: string; ref: number; role: string; geometry?: Coord[] }[] }
const root = join(import.meta.dir, '..')
const catalog: Catalog = JSON.parse(readFileSync(join(root, 'catalog.json'), 'utf8'))
const inputAt = process.argv.indexOf('--input')
let data: { osm3s: { timestamp_osm_base: string }; elements: Element[]; remark?: string }
if (inputAt >= 0) data = JSON.parse(readFileSync(process.argv[inputAt + 1], 'utf8'))
else {
  const refs = [...new Set(catalog.landmarks.flatMap(a => a.replaces ?? []))]
  const query = ['[out:json][timeout:90];(', ...['way', 'relation'].map(type =>
    `${type}(id:${refs.filter(r => r.startsWith(`${type}/`)).map(r => r.split('/')[1]).join(',')});`), ');out geom;'].join('')
  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST', body: new URLSearchParams({ data: query }),
    headers: { 'User-Agent': 'Landmarks-demo (https://github.com/alexwohlbruck/landmarks)' },
  })
  if (!response.ok) throw new Error(`Overpass: HTTP ${response.status}`)
  data = await response.json()
}
if (data.remark) throw new Error(data.remark)
const equal = (a: Pair, b: Pair) => a[0] === b[0] && a[1] === b[1]
const ring = (coords?: Coord[]): Ring => (coords ?? []).map(c => [c.lon, c.lat])
function stitch(segments: Ring[]): Ring[] {
  const pending = segments.filter(r => r.length > 1).map(r => [...r])
  const rings: Ring[] = []
  while (pending.length) {
    const chain = pending.shift()!
    while (!equal(chain[0], chain.at(-1)!)) {
      const at = pending.findIndex(r => equal(chain.at(-1)!, r[0]) || equal(chain.at(-1)!, r.at(-1)!))
      if (at < 0) break
      const next = pending.splice(at, 1)[0]
      if (!equal(chain.at(-1)!, next[0])) next.reverse()
      chain.push(...next.slice(1))
    }
    if (chain.length >= 4 && equal(chain[0], chain.at(-1)!)) rings.push(chain)
  }
  return rings
}
const geometries = new Map<string, MultiPolygon>()
for (const e of data.elements) {
  if (!e.tags?.building && !e.tags?.['building:part']) continue
  let geometry: MultiPolygon = []
  if (e.type === 'way') {
    const r = ring(e.geometry)
    if (r.length >= 4 && equal(r[0], r.at(-1)!)) geometry = [[r]]
  } else if (e.type === 'relation') {
    const outer = stitch((e.members ?? []).filter(m => ['', 'outer', 'outline'].includes(m.role)).map(m => ring(m.geometry)))
    const inner = stitch((e.members ?? []).filter(m => m.role === 'inner').map(m => ring(m.geometry)))
    if (outer.length) {
      geometry = clipping.union(outer.map(r => [r]))
      if (inner.length) geometry = clipping.difference(geometry, inner.map(r => [r]))
    }
  }
  if (geometry.length) geometries.set(`${e.type}/${e.id}`, geometry)
}
const assets: Record<string, MultiPolygon> = {}
for (const a of catalog.landmarks) {
  const shapes = (a.replaces ?? []).flatMap(ref => geometries.get(ref) ?? [])
  if (shapes.length) assets[a.id] = clipping.union(shapes)
}
writeFileSync(join(root, 'web/replacement-footprints.json'), JSON.stringify({
  schemaVersion: 1, source: 'OpenStreetMap', license: 'ODbL-1.0',
  timestamp: data.osm3s.timestamp_osm_base, assets,
}))
console.log(`${Object.keys(assets).length} landmark footprints from ${geometries.size} OSM building geometries`)
