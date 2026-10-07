/**
 * Preview a landmark GLB the way the map lights it, without a browser.
 *
 *   bun run preview <model.glb|id> [out-dir] [photo.png ...]
 *
 * Writes a standard set of views: front (south), side (west), a high
 * three-quarter from the south-west (the usual phone view), its reverse, top,
 * and phone-size 200 px and 80 px versions, plus a contact sheet. Any PNG
 * photos given are put beside the three-quarter view in `compare-N.png`.
 * The out dir defaults to `preview/<id>/`, which git ignores.
 *
 * A development tool for authoring models; the release build never runs it.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { encodePng } from '../generators/mesh'
import { blit, canvas, decodePng, loadScene, render, resample, type Bitmap } from './render'

const [arg, outArg, ...photos] = process.argv.slice(2)
if (!arg) {
  console.error('usage: bun run preview <model.glb|id> [out-dir] [photo.png ...]')
  process.exit(1)
}
// A bare id is a model in models/.
const source = arg.endsWith('.glb') ? arg : join(import.meta.dir, '../models', `${arg}.glb`)
const id = basename(source, '.glb')
const out = outArg ?? join(import.meta.dir, '../preview', id)
mkdirSync(out, { recursive: true })

const bytes = readFileSync(source)
const scene = loadScene(new Uint8Array(bytes))
const save = (name: string, bmp: Bitmap) => {
  writeFileSync(join(out, `${name}.png`), encodePng(bmp.w, bmp.h, bmp.data))
  return bmp
}
const view = (name: string, w: number, h: number, az: number, el: number, ss = 2) => save(name, render(scene, w, h, az, el, ss))

const views = [
  view('front-south', 600, 600, 270, 4),
  view('side-west', 600, 600, 180, 4),
  view('three-quarter-sw', 600, 600, 225, 35),
  view('three-quarter-ne', 600, 600, 45, 35),
  view('top', 600, 600, 270, 89.5),
]
const phone200 = view('phone-200', 200, 200, 225, 35, 4)
view('phone-80', 80, 80, 225, 35, 6)

// Contact sheet: the five views in a row of three over two, then the phone view.
{
  const cw = 600, ch = 600, cols = 3
  const sheet = canvas(cw * cols, ch * 2)
  ;[...views, phone200].forEach((im, i) => {
    blit(sheet, im, ((i % cols) * cw + (cw - im.w) / 2) | 0, (Math.floor(i / cols) * ch + (ch - im.h) / 2) | 0)
  })
  save('contact', sheet)
}
photos.forEach((p, i) => {
  const im = decodePng(new Uint8Array(readFileSync(p)))
  const scaled = resample(im, [0, 0, im.w, im.h], Math.round((im.w * 600) / im.h), 600)
  const pair = canvas(scaled.w + views[2].w + 60, Math.max(scaled.h, views[2].h) + 40)
  blit(pair, scaled, 20, 20)
  blit(pair, views[2], scaled.w + 40, 20)
  save(`compare-${i + 1}`, pair)
})
let triangles = 0
for (const p of scene.primitives) triangles += p.ix.length / 3
const summary = { triangles, bytes: bytes.length, bounds: { min: scene.lo, max: scene.hi }, materials: scene.gltf.materials.map((m: any) => m.name) }
writeFileSync(join(out, 'summary.json'), JSON.stringify(summary, null, 2))
console.log(JSON.stringify(summary))
console.log(`views in ${out}`)
