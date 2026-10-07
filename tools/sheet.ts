/**
 * Contact sheets for reviewing a batch of models in a pull request.
 *
 *   bun run sheet <id ...>                  these landmarks (placement or model ids)
 *   bun run sheet --branch-diff [base]      every landmark this branch adds or changes
 *                                           against base (default origin/main),
 *                                           uncommitted work included
 *   options: --out <dir>  (default preview/sheets)   --per <n>  (models per image, default 8)
 *
 * Each landmark gets a high three-quarter view from the south-west and the
 * same view at phone size (200 px), labelled with its id, name, anchor and
 * size. The model is drawn turned to its catalog bearing, so "south-west" is
 * the real south-west and the view can be checked against a photo. Images
 * are written as sheet-1.png, sheet-2.png, ... two columns wide.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { encodePng } from '../generators/mesh'
import type { Catalog, CatalogLandmark } from '../src/catalog'
import { bakePlacement, triangleCount } from '../src/glb'
import { drawText } from './font'
import { blit, canvas, loadScene, render } from './render'

const ROOT = join(import.meta.dir, '..')
const args = process.argv.slice(2)
const option = (name: string, fallback: string) => {
  const at = args.indexOf(name)
  if (at < 0) return fallback
  const [value] = args.splice(at, 2).slice(1)
  return value
}
const out = resolve(option('--out', join(ROOT, 'preview/sheets')))
const per = Math.max(1, Number(option('--per', '8')))
const catalog = JSON.parse(readFileSync(join(ROOT, 'catalog.json'), 'utf8')) as Catalog

function git(...cmd: string[]): string {
  const r = Bun.spawnSync(['git', ...cmd], { cwd: ROOT })
  if (r.exitCode !== 0) throw new Error(`git ${cmd.join(' ')}: ${r.stderr.toString().trim()}`)
  return r.stdout.toString()
}

/** Landmarks whose placement, model file or generator differs from `base`. */
function branchDiff(base: string): CatalogLandmark[] {
  const since = git('merge-base', base, 'HEAD').trim()
  const changed = new Set([
    ...git('diff', '--name-only', since).split('\n'),
    ...git('ls-files', '--others', '--exclude-standard').split('\n'),
  ].filter(Boolean))
  const before = (() => {
    try {
      return JSON.parse(git('show', `${since}:catalog.json`)) as Catalog
    } catch {
      return { models: [], landmarks: [] } as Catalog
    }
  })()
  const was = new Map(before.landmarks.map((l) => [l.id, JSON.stringify(l)]))
  const models = new Set(catalog.models.filter((m) => changed.has(m.file) || (m.source && changed.has(m.source))).map((m) => m.id))
  return catalog.landmarks.filter((l) => models.has(l.model) || was.get(l.id) !== JSON.stringify(l))
}

let picked: CatalogLandmark[]
if (args[0] === '--branch-diff') picked = branchDiff(args[1] ?? 'origin/main')
else {
  const wanted = new Set(args)
  picked = catalog.landmarks.filter((l) => wanted.has(l.id) || wanted.has(l.model))
  const found = new Set(picked.flatMap((l) => [l.id, l.model]))
  const missing = [...wanted].filter((id) => !found.has(id))
  if (missing.length) {
    console.error(`not in the catalog: ${missing.join(', ')}`)
    process.exit(1)
  }
}
if (!picked.length) {
  console.error(args.length ? 'nothing to draw' : 'usage: bun run sheet <id ...> | --branch-diff [base]')
  process.exit(1)
}

const BIG = 400
const PHONE = 200
const PAD = 20
const LINE = 22
const CELL_W = PAD + BIG + PAD + PHONE + PAD
const CELL_H = PAD + 3 * LINE + 8 + BIG + PAD
const COLS = Math.min(2, picked.length)

function cell(l: CatalogLandmark) {
  const model = catalog.models.find((m) => m.id === l.model)!
  const glb = bakePlacement(new Uint8Array(readFileSync(join(ROOT, model.file))), { bearing: l.bearing ?? 0 })
  const scene = loadScene(glb)
  const im = canvas(CELL_W, CELL_H, [250, 248, 243])
  drawText(im, l.id, PAD, PAD, 2, [20, 20, 20])
  drawText(im, l.name, PAD, PAD + LINE, 2, [70, 70, 70])
  const kb = Math.round(glb.length / 1024)
  drawText(im, `${l.lng.toFixed(5)}, ${l.lat.toFixed(5)}   ${triangleCount(glb)} tris, ${kb} KB`, PAD, PAD + 2 * LINE, 2, [110, 110, 110])
  const top = PAD + 3 * LINE + 8
  blit(im, render(scene, BIG, BIG, 225, 35), PAD, top)
  blit(im, render(scene, PHONE, PHONE, 225, 35, 4), PAD + BIG + PAD, top + BIG - PHONE)
  return im
}

rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })
const pages = Math.ceil(picked.length / per)
for (let page = 0; page < pages; page++) {
  const batch = picked.slice(page * per, (page + 1) * per)
  const rows = Math.ceil(batch.length / COLS)
  const sheet = canvas(COLS * CELL_W + (COLS + 1) * 4, rows * CELL_H + (rows + 1) * 4, [200, 196, 188])
  batch.forEach((l, i) => {
    process.stdout.write(`${l.id} `)
    blit(sheet, cell(l), 4 + (i % COLS) * (CELL_W + 4), 4 + Math.floor(i / COLS) * (CELL_H + 4))
  })
  const file = join(out, `sheet-${page + 1}.png`)
  writeFileSync(file, encodePng(sheet.w, sheet.h, sheet.data))
  console.log(`\n${file}`)
}
