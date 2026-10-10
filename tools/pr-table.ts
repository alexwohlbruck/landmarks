/**
 * The model table for a batch pull request, as Markdown.
 *
 *   bun tools/pr-table.ts [--notes notes.json] [--prefix <p>] [id ...]
 *
 * One row per landmark: name, id, anchor (linked to openstreetmap.org),
 * height, how many OSM elements it replaces, the evidence used and the
 * doubts. Pick landmarks by id, or every landmark whose id starts with
 * --prefix (e.g. `chi-`), in catalog order.
 *
 * notes.json maps an id to [evidence, doubts], written by the lead while
 * reviewing, e.g. {"sea-space-needle": ["Lidar tip 184.8 m, 8 photos", "Waist height estimated"]}.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Catalog } from '../src/catalog'
import { glbBounds } from '../src/glb'

const ROOT = join(import.meta.dir, '..')
const args = process.argv.slice(2)
const option = (name: string) => {
  const at = args.indexOf(name)
  return at < 0 ? undefined : args.splice(at, 2)[1]
}
const notesFile = option('--notes')
const prefix = option('--prefix')
const notes: Record<string, [string, string]> = notesFile ? JSON.parse(readFileSync(notesFile, 'utf8')) : {}
const catalog = JSON.parse(readFileSync(join(ROOT, 'catalog.json'), 'utf8')) as Catalog
const picked = prefix ? catalog.landmarks.filter((l) => l.id.startsWith(prefix)) : args.map((id) => catalog.landmarks.find((l) => l.id === id)!)
if (!picked.length || picked.some((l) => !l)) {
  console.error('usage: bun tools/pr-table.ts [--notes notes.json] [--prefix <p>] [id ...]   (every id must be a landmark in catalog.json)')
  process.exit(1)
}

console.log('| Name | id | lat, lng | Height | Replaces | Evidence | Doubts |')
console.log('|---|---|---|---|---|---|---|')
for (const l of picked) {
  const model = catalog.models.find((m) => m.id === l.model)!
  const height = glbBounds(new Uint8Array(readFileSync(join(ROOT, model.file)))).height * (l.scale ?? 1)
  const [evidence, doubts] = notes[l.id] ?? notes[l.model] ?? ['', '']
  const at = `${l.lat.toFixed(5)}, ${l.lng.toFixed(5)}`
  const osm = `https://www.openstreetmap.org/#map=18/${l.lat.toFixed(5)}/${l.lng.toFixed(5)}`
  console.log(`| ${l.name} | \`${l.id}\` | [${at}](${osm}) | ${Math.round(height)} m | ${(l.replaces ?? []).length} | ${evidence} | ${doubts || '—'} |`)
}
