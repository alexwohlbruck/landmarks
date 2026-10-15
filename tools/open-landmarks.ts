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
// Rerunning starts from their library alone, so one model never matches another's finish.
const ours = (name: string) => catalog.models.some((m) => name.startsWith(`${m.id}-`))
for (const name of Object.keys(library.materials)) if (ours(name)) delete library.materials[name]
library.windowSupportMaterials = library.windowSupportMaterials.filter((n) => !ours(n))
const commit = execSync('git rev-parse HEAD', { cwd: root }).toString().trim()
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

const CITY: Record<string, string> = {
  sf: 'san-francisco', chi: 'chicago', nyc: 'new-york', la: 'los-angeles', lv: 'las-vegas', dc: 'washington-dc',
  sea: 'seattle', clt: 'charlotte', wdw: 'walt-disney-world', dlr: 'disneyland', carowinds: 'carowinds',
}
const slug = (s: string) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const cityOf = (l: CatalogLandmark) => CITY[l.id.split('-')[0]] ?? 'charlotte'

const PARKS = new Set(['carowinds', 'wdw', 'dlr'])

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
    const vague = PARKS.has(l.id.split('-')[0]) || !id.includes('-')
    if (vague || counts.get(id)! > 1 || taken.has(id)) id = `${id}-${cityOf(l)}`
    if (taken.has(id) || [...ids.values()].includes(id)) id = `${base[i]}-${slug(l.id)}`
    ids.set(l.id, id)
    taken.add(id)
  })
  return ids
}

const skipped: Array<{ id: string; reason: string }> = []
const candidates = catalog.landmarks.filter((l) => !only || only.includes(l.id)).filter((l) => {
  const dup = duplicateOf(l)
  if (dup) skipped.push({ id: l.id, reason: `already in Open Landmarks as ${dup}` })
  return !dup
})
const ids = assignIds(candidates)
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
    converted = convert(id, model.id, new Uint8Array(readFileSync(join(root, model.file))), { bearing: l.bearing, scale: l.scale }, library)
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

for (const [name, entry] of Object.entries(finishes).sort(([a], [b]) => (a < b ? -1 : 1))) library.materials[name] = entry
library.windowSupportMaterials = [...new Set([...library.windowSupportMaterials, ...[...supports].sort()])]
writeFileSync(join(target, 'materials.json'), `${JSON.stringify(library, null, 2)}\n`)
writeFileSync(join(cache, 'report.json'), JSON.stringify({ commit, written, skipped }, null, 2))
console.log(`wrote ${written.length} submissions, ${Object.keys(finishes).length} finishes; skipped ${skipped.length}:`)
for (const s of skipped) console.log(`  ${s.id}: ${s.reason}`)
