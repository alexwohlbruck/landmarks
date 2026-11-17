/**
 * Contact sheets for reviewing a batch of models in a pull request.
 *
 *   bun run sheet <id ...>                  these landmarks (placement or model ids)
 *   bun run sheet --branch-diff [base]      every landmark this branch adds or changes
 *                                           against base (default origin/main),
 *                                           uncommitted work included
 *   options: --out <dir>  (default preview/sheets)   --per <n>  (models per image, default 8)
 *            --from <deg>  view every landmark from this compass direction
 *
 * Each landmark gets a card: its name, id, triangles, size and height, and
 * one high three-quarter view drawn by day and by night side by side, as
 * the map lights it. The model is turned to its catalog bearing, so the
 * view's compass direction is real and can be checked against a photo.
 * Unless --from is given, the view is taken from whichever diagonal shows
 * the most of the model lit at night (south-west on a tie), so a sign is
 * seen from its face, not its back. Images are written as sheet-1.png,
 * sheet-2.png, ... two cards wide.
 */
import { mkdirSync, readFileSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'
import sharp, { type OverlayOptions } from 'sharp'
import type { Catalog, CatalogLandmark } from '../src/catalog'
import { bakePlacement, triangleCount } from '../src/glb'
import { BACKGROUND, NIGHT_BACKGROUND, loadScene, render, type Bitmap, type Scene } from './render'

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
const fromArg = option('--from', '')
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

// Layout, in px.
const VIEW_W = 440 // each of the day and night views
const VIEW_H = 400
const GAP = 12 // between the two views
const PAD = 24 // inside a card
const HEAD = 70 // card title block
const MARGIN = 28 // around and between cards
const RADIUS = 14
const CHIP = 40 // band at the top of a view kept clear for its Day/Night chip
const CARD_W = PAD + VIEW_W + GAP + VIEW_W + PAD
const CARD_H = PAD + HEAD + VIEW_H + PAD
const COLS = Math.min(2, picked.length)
const ELEVATION = 25
const RENDER = 900 // square render before cropping to the model
const PAGE = '#efebe3'
const FONT = `'Geist', 'Inter', 'Helvetica Neue', 'Noto Sans', 'DejaVu Sans', Arial, sans-serif`

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
/** Compass bearing (clockwise from north) to the renderer's azimuth (counter-clockwise from east). */
const azimuth = (bearing: number) => 90 - bearing
const lum = (d: Uint8Array, i: number) => 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]

/** The diagonal that shows the most lit surface at night; south-west unless another is clearly better. */
function bestBearing(scene: Scene): number {
  const score = (b: number) => {
    const im = render(scene, 120, 120, azimuth(b), ELEVATION, 1, true)
    let lit = 0
    for (let i = 0; i < im.data.length; i += 4) if (lum(im.data, i) > 90) lit++
    return lit
  }
  const scores = [225, 135, 315, 45].map((b) => [b, score(b)] as const)
  const sw = scores[0][1]
  const [b, best] = scores.reduce((a, c) => (c[1] > a[1] ? c : a))
  return best > sw * 1.25 ? b : 225
}

/** The box around everything that isn't background in either view, padded. */
function contentBox(views: Bitmap[]): { left: number; top: number; width: number; height: number } {
  let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1
  for (const [im, bg] of views.map((v, i) => [v, i ? NIGHT_BACKGROUND : BACKGROUND] as const)) {
    for (let y = 0; y < im.h; y++) for (let x = 0; x < im.w; x++) {
      const i = (y * im.w + x) * 4
      if (Math.abs(im.data[i] - bg[0]) + Math.abs(im.data[i + 1] - bg[1]) + Math.abs(im.data[i + 2] - bg[2]) > 9) {
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
    }
  }
  if (x1 < 0) return { left: 0, top: 0, width: RENDER, height: RENDER }
  // Fit the model into the view below the Day/Night chip, with a margin, and
  // frame day and night the same. The box may run past the render's edges;
  // `view` pads the render with its background to cover it.
  const w = x1 - x0 + 1, h = y1 - y0 + 1
  const s = Math.min((VIEW_W * 0.9) / w, ((VIEW_H - CHIP) * 0.9) / h)
  const width = Math.round(VIEW_W / s), height = Math.round(VIEW_H / s)
  const left = Math.round((x0 + x1) / 2 - width / 2)
  const top = Math.round((y0 + y1) / 2 - (CHIP + (VIEW_H - CHIP) / 2) / s)
  return { left, top, width, height }
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
const rounded = (w: number, h: number, r: number) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" ry="${r}" fill="#fff"/></svg>`)

/** One view, cropped to `box`, scaled into the view frame with rounded corners and a Day/Night chip. */
async function view(im: Bitmap, box: ReturnType<typeof contentBox>, night: boolean): Promise<Buffer> {
  const bg = night ? NIGHT_BACKGROUND : BACKGROUND
  const pad = { top: Math.max(0, -box.top), left: Math.max(0, -box.left),
    bottom: Math.max(0, box.top + box.height - im.h), right: Math.max(0, box.left + box.width - im.w) }
  const padded = await sharp(Buffer.from(im.data), { raw: { width: im.w, height: im.h, channels: 4 } })
    .extend({ ...pad, background: { r: bg[0], g: bg[1], b: bg[2], alpha: 1 } }).raw().toBuffer()
  const scaled = await sharp(padded, { raw: { width: im.w + pad.left + pad.right, height: im.h + pad.top + pad.bottom, channels: 4 } })
    .extract({ left: box.left + pad.left, top: box.top + pad.top, width: box.width, height: box.height }).resize(VIEW_W, VIEW_H, { fit: 'fill', kernel: 'lanczos3' }).png().toBuffer()
  const label = night ? 'Night' : 'Day'
  const chip = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${VIEW_W}" height="${VIEW_H}">
    <rect x="10" y="10" width="${label.length * 8 + 22}" height="24" rx="12" fill="${night ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.07)'}"/>
    <text x="21" y="27" font-family="${FONT}" font-size="13" font-weight="600" fill="${night ? '#e8e6f0' : '#4a463f'}">${label}</text>
  </svg>`)
  return sharp(scaled)
    .composite([{ input: chip }, { input: rounded(VIEW_W, VIEW_H, RADIUS - 4), blend: 'dest-in' }])
    .png().toBuffer()
}

async function card(l: CatalogLandmark): Promise<Buffer> {
  const model = catalog.models.find((m) => m.id === l.model)!
  const glb = bakePlacement(new Uint8Array(readFileSync(join(ROOT, model.file))), { bearing: l.bearing ?? 0 })
  const scene = loadScene(glb)
  const bearing = fromArg ? Number(fromArg) : bestBearing(scene)
  const az = azimuth(bearing)
  const day = render(scene, RENDER, RENDER, az, ELEVATION, 2, false)
  const night = render(scene, RENDER, RENDER, az, ELEVATION, 2, true)
  const box = contentBox([day, night])
  const kb = Math.round(glb.length / 1024)
  const height = `${Math.round(scene.hi[2] - scene.lo[2])} m · `
  const from = COMPASS[Math.round((((bearing % 360) + 360) % 360) / 45) % 8]
  const meta = `${l.id}   ·   ${triangleCount(glb).toLocaleString('en-US')} tris · ${kb} KB · ${height}from ${from}`
  const head = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_W}" height="${PAD + HEAD}">
    <text x="${PAD}" y="${PAD + 24}" font-family="${FONT}" font-size="22" font-weight="700" fill="#1f1d1a">${esc(l.name)}</text>
    <text x="${PAD}" y="${PAD + 50}" font-family="${FONT}" font-size="14" fill="#7a7468">${esc(meta)}</text>
  </svg>`)
  const border = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_W}" height="${CARD_H}">
    <rect x="0.5" y="0.5" width="${CARD_W - 1}" height="${CARD_H - 1}" rx="${RADIUS}" ry="${RADIUS}" fill="#fff" stroke="#ddd6c9"/>
  </svg>`)
  const layers: OverlayOptions[] = [
    { input: head, left: 0, top: 0 },
    { input: await view(day, box, false), left: PAD, top: PAD + HEAD },
    { input: await view(night, box, true), left: PAD + VIEW_W + GAP, top: PAD + HEAD },
  ]
  return sharp(border).composite(layers).png().toBuffer()
}

rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })
const pages = Math.ceil(picked.length / per)
for (let page = 0; page < pages; page++) {
  const batch = picked.slice(page * per, (page + 1) * per)
  const rows = Math.ceil(batch.length / COLS)
  const width = MARGIN + COLS * (CARD_W + MARGIN), height = MARGIN + rows * (CARD_H + MARGIN)
  const layers: OverlayOptions[] = []
  for (const [i, l] of batch.entries()) {
    process.stdout.write(`${l.id} `)
    layers.push({ input: await card(l), left: MARGIN + (i % COLS) * (CARD_W + MARGIN), top: MARGIN + Math.floor(i / COLS) * (CARD_H + MARGIN) })
  }
  const file = join(out, `sheet-${page + 1}.png`)
  await sharp({ create: { width, height, channels: 3, background: PAGE } }).composite(layers).png({ compressionLevel: 9 }).toFile(file)
  console.log(`\n${file}`)
}
