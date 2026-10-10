/**
 * Put photos and renders side by side, for comparing a model with its evidence.
 *
 *   bun tools/montage.ts <out.png> [--cols <n>] [--height <px>] <image[=label]> ...
 *
 * Takes PNG or JPEG. Every image is trimmed of flat borders (the renders'
 * background), scaled to the same height (default 520 px), and laid out in
 * rows of --cols (default: all in one row), each with its label (default: the
 * file name) underneath. Typical uses:
 *
 *   bun tools/montage.ts cmp-south.png photo-south.jpg=photo preview/<id>/front-south.png=model
 *   bun tools/montage.ts sides.png --cols 4 work/<id>/m*.jpg
 */
import sharp, { type OverlayOptions } from 'sharp'
import { basename } from 'node:path'

const args = process.argv.slice(2)
const option = (name: string) => {
  const at = args.indexOf(name)
  return at < 0 ? undefined : args.splice(at, 2)[1]
}
const H = Number(option('--height') ?? 520)
const [out, ...files] = args
if (!out || !files.length) {
  console.error('usage: bun tools/montage.ts <out.png> [--cols <n>] [--height <px>] <image[=label]> ...')
  process.exit(1)
}
const cols = Number(option('--cols') ?? files.length)
const GAP = 20, LABEL = 28, BG = '#e9e5dc'
const escape = (s: string) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`)

const tiles = await Promise.all(
  files.map(async (spec) => {
    const [path, label = basename(path)] = spec.split('=')
    const trimmed = await sharp(path).trim({ threshold: 6 }).toBuffer()
    const { data, info } = await sharp(trimmed).resize({ height: H, width: Math.round(H * 1.6), fit: 'inside' }).toBuffer({ resolveWithObject: true })
    return { data, w: info.width, h: info.height, label }
  }),
)

const rows: (typeof tiles)[] = []
for (let i = 0; i < tiles.length; i += cols) rows.push(tiles.slice(i, i + cols))
const width = Math.max(...rows.map((r) => r.reduce((s, t) => s + t.w + GAP, GAP)))
const rowH = H + LABEL + GAP
const layers: OverlayOptions[] = []
rows.forEach((row, r) => {
  let x = GAP
  for (const t of row) {
    const top = GAP + r * rowH
    layers.push({ input: t.data, left: x, top: top + H - t.h })
    const svg = `<svg width="${t.w}" height="${LABEL}" xmlns="http://www.w3.org/2000/svg"><text x="0" y="20" font-family="sans-serif" font-size="16" fill="#333">${escape(t.label)}</text></svg>`
    layers.push({ input: Buffer.from(svg), left: x, top: top + H + 2 })
    x += t.w + GAP
  }
})
await sharp({ create: { width, height: GAP + rows.length * rowH, channels: 3, background: BG } }).composite(layers).png().toFile(out)
console.log(out)
