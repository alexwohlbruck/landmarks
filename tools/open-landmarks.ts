/**
 * Write our landmarks into an Open Landmarks checkout as submissions.
 *
 *   bun tools/open-landmarks.ts <open-landmarks> [--only id,id] [--cache dir]
 *
 * For each placement in catalog.json that Open Landmarks doesn't already
 * have, writes collection/<id>/ with asset.json, low.glb, detail.glb and
 * spatial-source.json, and adds the finishes the models need to their
 * materials.json. Prints what it skipped and why. Then, for the ids it wrote:
 *
 *   blender -b --factory-startup --python tools/open-landmarks-blend.py -- <open-landmarks>/collection <id ...>
 *   cd <open-landmarks> && node tools/render-previews.mjs <id ...>   # open it, click Render
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { execSync } from 'node:child_process'
import type { Catalog, CatalogLandmark } from '../src/catalog'
import { convert } from '../src/open-landmarks/convert'
import type { Library } from '../src/open-landmarks/materials'
import { Osm } from '../src/open-landmarks/osm'
import { citedFiles, Commons, header } from '../src/open-landmarks/references'
import { submission } from '../src/open-landmarks/submission'

const args = process.argv.slice(2)
const flag = (name: string) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined)
const target = resolve(args[0] ?? '')
if (!existsSync(join(target, 'materials.json'))) throw new Error('usage: bun tools/open-landmarks.ts <open-landmarks checkout>')
const only = flag('--only')?.split(',')
const cache = resolve(flag('--cache') ?? join(import.meta.dir, '../.cache/open-landmarks'))
mkdirSync(cache, { recursive: true })

const root = join(import.meta.dir, '..')
const catalog: Catalog = JSON.parse(readFileSync(join(root, 'catalog.json'), 'utf8'))
const library: Library = JSON.parse(readFileSync(join(target, 'materials.json'), 'utf8'))
const anyOurs = (name: string) => catalog.models.some((m) => name.startsWith(`${m.id}-`))
// Models convert against their library alone, so one of ours never takes another's finish.
const theirLibrary: Library = {
  ...library,
  materials: Object.fromEntries(Object.entries(library.materials).filter(([n]) => !anyOurs(n))),
  windowSupportMaterials: library.windowSupportMaterials.filter((n) => !anyOurs(n)),
}
// A rerun drops the finishes of the models it exports; the rest stay as they are.
const selected = catalog.models.filter((m) => !only || catalog.landmarks.some((l) => l.model === m.id && only.includes(l.id)))
const exporting = (name: string) => selected.some((m) => name.startsWith(`${m.id}-`))
for (const name of Object.keys(library.materials)) if (exporting(name)) delete library.materials[name]
library.windowSupportMaterials = library.windowSupportMaterials.filter((n) => !exporting(n))
// The last commit that touched the models, so a link to a generator doesn't move with unrelated work.
const commit = execSync('git log -1 --format=%H -- generators models catalog.json', { cwd: root }).toString().trim()
const osm = new Osm(join(cache, 'osm.json'))
const commons = new Commons(join(cache, 'commons.json'))

/** Their assets: what each replaces and where it stands, to skip landmarks they already have. */
const theirs = readdirSync(join(target, 'collection')).flatMap((dir) => {
  const file = join(target, 'collection', dir, 'asset.json')
  if (!existsSync(file)) return []
  const a = JSON.parse(readFileSync(file, 'utf8'))
  if (a.authors?.includes('Alex Wohlbruck')) return []
  const refs = new Set([a.osm, ...(a.additionalOsm ?? [])].filter(Boolean).map((o: any) => `${o.type}/${o.id}`))
  return [{ id: a.id as string, refs, wikidata: a.wikidata as string | undefined, anchor: a.anchor as [number, number], bounds: a.boundsBlenderM as number[][] }]
})

function duplicateOf(l: CatalogLandmark): string | undefined {
  for (const t of theirs) {
    if (l.replaces?.some((r) => t.refs.has(r)) || (t.wikidata && t.wikidata === l.wikidata)) return t.id
    const east = (l.lng - t.anchor[0]) * Math.cos((l.lat * Math.PI) / 180) * 111_320
    const north = (l.lat - t.anchor[1]) * 110_574
    if (east >= t.bounds[0][0] && east <= t.bounds[1][0] && north >= t.bounds[0][1] && north <= t.bounds[1][1]) return t.id
  }
}

/** Where a landmark is, for ids and grouping: its park by prefix, else the nearest city. */
const PARK: Record<string, string> = { carowinds: 'carowinds', wdw: 'walt-disney-world', dlr: 'disneyland' }
const CITIES: Array<[string, number, number]> = [
  ['charlotte', -80.84, 35.23], ['new-york', -73.98, 40.74], ['chicago', -87.63, 41.88], ['washington-dc', -77.03, 38.9],
  ['los-angeles', -118.25, 34.05], ['san-francisco', -122.42, 37.77], ['seattle', -122.33, 47.6], ['las-vegas', -115.17, 36.12],
]
const cityOf = (l: CatalogLandmark) =>
  PARK[l.id.split('-')[0]] ??
  CITIES.reduce((best, c) => (Math.hypot(c[1] - l.lng, c[2] - l.lat) < Math.hypot(best[1] - l.lng, best[2] - l.lat) ? c : best))[0]
const slug = (s: string) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

/**
 * Their ids name the landmark, not our batch: "coit-tower". A ride, a
 * one-word name or a clash takes its park or city, since the catalogue is global.
 */
function assignIds(landmarks: CatalogLandmark[]): Map<string, string> {
  const taken = new Set(theirs.map((t) => t.id))
  const base = landmarks.map((l) => slug(l.name))
  const counts = new Map<string, number>()
  for (const b of base) counts.set(b, (counts.get(b) ?? 0) + 1)
  const ids = new Map<string, string>()
  landmarks.forEach((l, i) => {
    let id = base[i]
    const vague = l.id.split('-')[0] in PARK || !id.includes('-')
    if (vague || counts.get(id)! > 1 || taken.has(id)) id = `${id}-${cityOf(l)}`
    if (taken.has(id) || [...ids.values()].includes(id)) id = `${base[i]}-${slug(l.id)}`
    ids.set(l.id, id)
    taken.add(id)
  })
  return ids
}

const skipped: Array<{ id: string; reason: string }> = []
const fresh = catalog.landmarks.filter((l) => {
  const dup = duplicateOf(l)
  if (dup && (!only || only.includes(l.id))) skipped.push({ id: l.id, reason: `already in Open Landmarks as ${dup}` })
  return !dup
})
// Ids come from the whole catalogue, so exporting a few never renames one.
const ids = assignIds(fresh)
const candidates = fresh.filter((l) => !only || only.includes(l.id))
const models = new Map(catalog.models.map((m) => [m.id, m]))
await osm.load(candidates.flatMap((l) => l.replaces ?? []))

const finishes: Library['materials'] = {}
const supports = new Set<string>()
const written: Array<{ id: string; ours: string; name: string; folds: string[]; detachedM2: number; city: string }> = []

for (const l of candidates) {
  const model = models.get(l.model)!
  const id = ids.get(l.id)!
  let converted
  try {
    converted = convert(id, model.id, new Uint8Array(readFileSync(join(root, model.file))), { bearing: l.bearing, scale: l.scale }, theirLibrary)
  } catch (err) {
    skipped.push({ id: l.id, reason: (err as Error).message })
    continue
  }
  let refs = (l.replaces ?? []).filter((r) => { try { osm.get(r); return true } catch { return false } })
  if (!refs.length) {
    const found = await osm.locate(l.id, l.lng, l.lat, l.name, l.wikidata)
    if (!found) {
      skipped.push({ id: l.id, reason: 'no OSM element replaces or names it' })
      continue
    }
    refs = [found]
  }
  const source = model.source ? readFileSync(join(root, model.source), 'utf8') : ''
  const references = await commons.resolve(citedFiles(source))
  const { asset, spatial } = submission({
    id,
    landmark: l,
    model: model.id,
    generator: model.source ?? '',
    generatorUrl: `https://github.com/alexwohlbruck/landmarks/blob/${commit}/${model.source}`,
    converted,
    osmRefs: refs,
    osm,
    notes: header(source),
    references,
  })
  const dir = join(target, 'collection', id)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'detail.glb'), converted.detail.glb)
  writeFileSync(join(dir, 'low.glb'), converted.low.glb)
  writeFileSync(join(dir, 'asset.json'), `${JSON.stringify(asset, null, 2)}\n`)
  writeFileSync(join(dir, 'spatial-source.json'), `${JSON.stringify(spatial, null, 2)}\n`)
  Object.assign(finishes, converted.finishes)
  for (const s of converted.supports) supports.add(s)
  written.push({
    id, ours: l.id, name: l.name, city: cityOf(l),
    folds: converted.merged.map((m) => `${m.from} → ${m.into} (ΔE ${m.deltaE})`),
    detachedM2: Math.round(converted.report.detachedM2),
  })
}

// Theirs first in their order, then ours sorted, so a full and a partial export write the same file.
const merged = { ...library.materials, ...finishes }
const names = Object.keys(merged)
library.materials = Object.fromEntries([...names.filter((n) => !anyOurs(n)), ...names.filter(anyOurs).sort()].map((n) => [n, merged[n]]))
const walls = [...new Set([...library.windowSupportMaterials, ...supports])]
library.windowSupportMaterials = [...walls.filter((n) => !anyOurs(n)), ...walls.filter(anyOurs).sort()]
writeFileSync(join(target, 'materials.json'), `${JSON.stringify(library, null, 2)}\n`)
writeFileSync(join(cache, 'report.json'), JSON.stringify({ commit, written, skipped }, null, 2))
console.log(`wrote ${written.length} submissions, ${Object.keys(finishes).length} finishes; skipped ${skipped.length}:`)
for (const s of skipped) console.log(`  ${s.id}: ${s.reason}`)
