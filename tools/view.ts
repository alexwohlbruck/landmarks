/**
 * Render a model from any side, to match a photo's viewpoint.
 *
 *   bun tools/view.ts <id|model.glb> <out.png> <from> [elevation=15] [--bearing <deg>] [--size <px>]
 *
 * <from> is the compass direction from the landmark to the camera, in degrees
 * clockwise from north: 180 stands south of it looking north. That is the
 * same number `tools/mapillary.py` puts in its file names (m180.jpg), so a
 * render and a street photo pair up directly. Elevation is degrees above the
 * horizon: about 5-15 for a street photo, 30-45 for a view from a tower.
 *
 * An id is looked up in catalog.json, as a landmark or a model, and drawn
 * turned to its placement's bearing, so <from> is a real compass direction.
 * A .glb path is drawn in its own frame unless --bearing is given.
 *
 * `bun run preview` renders the fixed review views; this is for the photo
 * that doesn't match any of them. Pair the result with the photo using
 * `bun tools/montage.ts`.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { encodePng } from '../generators/mesh'
import type { Catalog } from '../src/catalog'
import { bakePlacement } from '../src/glb'
import { loadScene, render } from './render'

const ROOT = join(import.meta.dir, '..')
const args = process.argv.slice(2)
const option = (name: string) => {
  const at = args.indexOf(name)
  return at < 0 ? undefined : args.splice(at, 2)[1]
}
const bearingArg = option('--bearing')
const size = Number(option('--size') ?? 700)
const [what, out, from, elevation = '15'] = args
if (!what || !out || from === undefined) {
  console.error('usage: bun tools/view.ts <id|model.glb> <out.png> <from-deg> [elevation-deg] [--bearing <deg>] [--size <px>]')
  process.exit(1)
}

let file = what
let bearing = Number(bearingArg ?? 0)
if (!what.endsWith('.glb')) {
  const catalog = JSON.parse(readFileSync(join(ROOT, 'catalog.json'), 'utf8')) as Catalog
  const placed = catalog.landmarks.find((l) => l.id === what) ?? catalog.landmarks.find((l) => l.model === what)
  const model = catalog.models.find((m) => m.id === (placed?.model ?? what))
  file = join(ROOT, model?.file ?? `models/${what}.glb`)
  if (bearingArg === undefined) bearing = placed?.bearing ?? 0
}

const glb = bakePlacement(new Uint8Array(readFileSync(file)), { bearing })
// render() takes the camera's azimuth counter-clockwise from east.
const bmp = render(loadScene(glb), size, size, 90 - Number(from), Number(elevation), 2)
writeFileSync(out, encodePng(bmp.w, bmp.h, bmp.data))
console.log(out)
