/**
 * Several landmarks on one patch of the map's terrain, in one picture.
 *
 *   bun tools/scene.ts <out.png> <id ...> [--from <deg>] [--elevation <deg>] [--size <px>] [--step <m>] [--margin <m>] [--night]
 *
 * Every landmark is stood on Mapterhorn as the map stands it (the same drape,
 * fill, base sink and catalog elevation as `bun run sheet --terrain`), turned
 * to its bearing and moved to its anchor, so neighbours that share a site (a
 * dam, its spillways and its bridge) can be checked against each other and
 * against a photo of the whole place. The ground is one surface over all of
 * them, `--margin` metres past their plans (default 60), sampled every
 * `--step` metres (default 4). `--from` is the compass direction from the
 * site to the camera (default 200); textures are drawn flat.
 *
 * A development tool for reviewing models; the release build never runs it.
 */
import { readFileSync } from 'node:fs'
import sharp from 'sharp'
import { join } from 'node:path'
import { encodePng, readGlb } from '../generators/mesh'
import { bakePlacement } from '../src/glb'
import { readCatalog } from '../src/catalog-files'
import { BACKGROUND, NIGHT_BACKGROUND, loadScene, render, type Scene } from './render'
import { height, placeOnTerrain, toLngLat } from './terrain'

const ROOT = join(import.meta.dir, '..')
const args = process.argv.slice(2)
const option = (name: string, fallback: string) => {
  const at = args.indexOf(name)
  return at < 0 ? fallback : args.splice(at, 2)[1]
}
const from = Number(option('--from', '200'))
const elevation = Number(option('--elevation', '35'))
const size = Number(option('--size', '1400'))
const step = Number(option('--step', '4'))
const margin = Number(option('--margin', '60'))
const night = args.includes('--night')
if (night) args.splice(args.indexOf('--night'), 1)
const [out, ...ids] = args
if (!out || !ids.length) {
  console.error('usage: bun tools/scene.ts <out.png> <id ...> [--from <deg>] [--elevation <deg>] [--size <px>] [--step <m>] [--margin <m>] [--night]')
  process.exit(1)
}

const catalog = readCatalog(ROOT)
const landmarks = ids.map((id) => {
  const l = catalog.landmarks.find((l) => l.id === id) ?? catalog.landmarks.find((l) => l.model === id)
  if (!l) throw new Error(`no landmark ${id}`)
  return l
})
// The scene's origin: the first landmark's anchor. x east, z south, metres.
const origin = { lng: landmarks[0].lng, lat: landmarks[0].lat, bearing: 0, elevation: 0 }
const kx = Math.cos((origin.lat * Math.PI) / 180) * 111320, kz = 110574
const offset = (lng: number, lat: number) => [(lng - origin.lng) * kx, -(lat - origin.lat) * kz]

const primitives: Scene['primitives'] = []
let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity
for (const l of landmarks) {
  const model = catalog.models.find((m) => m.id === l.model)!
  const placed = bakePlacement(new Uint8Array(readFileSync(join(ROOT, model.file))), { bearing: 0, scale: l.scale ?? 1 })
  const place = { lng: l.lng, lat: l.lat, bearing: l.bearing ?? 0, elevation: l.elevation ?? 0 }
  const { lift, lowest } = await placeOnTerrain(readGlb(placed), place)
  const scene = loadScene(placed)
  const t = ((l.bearing ?? 0) * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t)
  const [ox, oz] = offset(l.lng, l.lat)
  for (const pr of scene.primitives) {
    for (let k = 0; k < pr.p.length; k += 3) {
      const x = pr.p[k], y = pr.p[k + 1], z = pr.p[k + 2]
      pr.p[k] = x * c - z * s + ox
      pr.p[k + 1] = lift(x, y, z) + lowest
      pr.p[k + 2] = x * s + z * c + oz
      minX = Math.min(minX, pr.p[k]), maxX = Math.max(maxX, pr.p[k])
      minZ = Math.min(minZ, pr.p[k + 2]), maxZ = Math.max(maxZ, pr.p[k + 2])
    }
    for (let k = 0; k < pr.n.length; k += 3) {
      const x = pr.n[k], z = pr.n[k + 2]
      pr.n[k] = x * c - z * s
      pr.n[k + 2] = x * s + z * c
    }
    const pbr = { ...pr.mat.pbrMetallicRoughness }
    delete pbr.baseColorTexture
    primitives.push({ ...pr, mat: { ...pr.mat, pbrMetallicRoughness: pbr } })
  }
  console.log(`${l.id}: placed`)
}

// One ground under all of them: the bare Mapterhorn surface.
const x0 = minX - margin, z0 = minZ - margin
const cols = Math.ceil((maxX - minX + 2 * margin) / step), rows = Math.ceil((maxZ - minZ + 2 * margin) / step)
const rx = cols + 1, h = new Float64Array(rx * (rows + 1))
for (let k = 0; k < h.length; k += 256)
  await Promise.all(Array.from({ length: Math.min(256, h.length - k) }, async (_, i) => {
    h[k + i] = await height(...toLngLat(origin, x0 + ((k + i) % rx) * step, z0 + Math.floor((k + i) / rx) * step))
  }))
const p = new Float32Array(h.length * 3), nrm = new Float32Array(h.length * 3)
for (let k = 0; k < h.length; k++) {
  const i = k % rx, j = Math.floor(k / rx)
  p.set([x0 + i * step, h[k], z0 + j * step], k * 3)
  const dx = (h[j * rx + Math.min(i + 1, cols)] - h[j * rx + Math.max(i - 1, 0)]) / (2 * step)
  const dz = (h[Math.min(j + 1, rows) * rx + i] - h[Math.max(j - 1, 0) * rx + i]) / (2 * step)
  const l = Math.hypot(dx, 1, dz)
  nrm.set([-dx / l, 1 / l, -dz / l], k * 3)
}
const ix = new Uint32Array(cols * rows * 6)
for (let j = 0, t = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
  const a = j * rx + i, b = a + 1, c = a + rx, d = c + 1
  ix.set([a, c, b, b, c, d], t); t += 6
}
const mat = { name: 'terrain', doubleSided: true, pbrMetallicRoughness: { baseColorFactor: [0.37, 0.42, 0.31, 1], roughnessFactor: 1 } }
primitives.unshift({ p, n: nrm, uv: null, ix, mat, flood: null })

const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity]
for (const pr of primitives) for (let k = 0; k < pr.p.length; k += 3) {
  const v = [pr.p[k], -pr.p[k + 2], pr.p[k + 1]]
  for (let i = 0; i < 3; i++) { lo[i] = Math.min(lo[i], v[i]); hi[i] = Math.max(hi[i], v[i]) }
}
const scene: Scene = {
  primitives, textures: [], gltf: { textures: [] }, lo, hi,
  centre: lo.map((v, i) => (v + hi[i]) / 2),
  radius: Math.hypot(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]) / 2,
}
// `render` takes the camera's azimuth counter-clockwise from east; `from` is clockwise from north.
const bmp = render(scene, size, Math.round(size * 0.7), 90 - from, elevation, 2, night)
// Cropped to the drawing, with a margin of the background around it.
const [r, g, b] = night ? NIGHT_BACKGROUND : BACKGROUND
await sharp(Buffer.from(encodePng(bmp.w, bmp.h, bmp.data))).trim({ threshold: 4 })
  .extend({ top: 32, bottom: 32, left: 32, right: 32, background: { r, g, b } }).png().toFile(out)
console.log(out)
