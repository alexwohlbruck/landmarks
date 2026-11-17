/**
 * Beylerbeyi Palace, Istanbul: procedural, CC0-1.0.
 *   bun generators/istanbul-beylerbeyi-palace.ts
 *
 * Sarkis Balyan's white marble summer palace of 1861-65 on the Asian shore
 * below the Bosphorus Bridge: a two-storey block on a low basement, 63 m
 * along the water, with two projecting pavilions and a recessed columned
 * centre on the sea front, a pavilion in the middle of each short side (the
 * entrance stairs), shallow projections on the land side; paired pilasters
 * dividing every bay, big arched windows between rectangular ones, a heavy
 * cornice and an attic with lattice panels, raised over the pavilions, and
 * small segmental crowns over the end bays. The flat roof is hidden.
 *
 * The two little sea pavilions (Yalı Köşkleri, way/61736405 and
 * way/61736406) stand 100 m off along the quay, are not mapped as buildings
 * and are left out.
 *
 * Uses the kit exported by istanbul-maidens-tower.ts.
 *
 * Frame: x east, y north, z up in the turned frame (bearing 323.4: the
 * model's north is the sea front, facing north-west), metres. Origin at the
 * outline's centroid, on the garden level.
 *
 * Sources
 * - OSM (ODbL): way/61736367 (building, "Beylerbeyi Sarayı", wikidata
 *   Q794349), part of relation/16362131 (the palace complex site).
 * - Photos (EVIDENCE):
 *   Nedim Ardoğa, "Beylerbeyi Palace a.jpg", CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Beylerbeyi_Palace_a.jpg (sea front, square on: the main ruler).
 *   Dosseman, "Beylerbeyi Palace Exterior in 2014 8916.jpg" and "8933", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Beylerbeyi_Palace_Exterior_in_2014_8916.jpg (entrance side, stairs).
 *   José Luiz, "Exterior view of Beylerbeyi Palace (1).jpg" and "(3)", CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Exterior_view_of_Beylerbeyi_Palace_(3).jpg
 *   Stegop, "Beylerbeyi Palace 106-1.jpg", CC BY-SA 4.0, and Eusebius,
 *     "Beylerbeyi Palace - wide.jpg", CC BY 3.0 (from across the water).
 *   KalafatElif, "Beylerbeyi Sarayı uzaktan bakış.jpg", CC BY-SA 4.0.
 *
 * Numbers
 * - Plan: OSM, measured: 63.4 x 40.5 m; sea pavilions 11.8 m wide, 3.2 m
 *   proud; short-side pavilions 21 m wide, 5.3 m proud.
 * - Heights photo-scaled from Ardoğa's sea front with the 63.4 m length as
 *   ruler: basement 1.6 m, ground storey to 9.4, upper storey to 16.6,
 *   cornice 18.3, attic 19.6 (21.0 over the pavilions).
 * - Colours: weathered white-grey marble from the daylight photos.
 *
 * Doubts
 * - The land (south-east) side is seen only obliquely; its windows repeat
 *   the sea front's rhythm. Carved ornament, balustrades and the lattice of
 *   the attic are reduced to panels.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, panel, quad, norm, tri } from './istanbul-maidens-tower'

const marble = new Part(), trimP = new Part(), roofP = new Part(), glaze = new Part(), lattice = new Part()
const PL = 1.6, G1 = 9.0, CORN = 17.6, ATT = 19.6, ATT2 = 21.0

// Main block and its projections (turned frame, metres; OSM).
const MB = { x0: -32.1, x1: 31.4, y0: -20.2, y1: 20.3 }
const seaPav = [[-18.3, -6.5], [5.7, 17.4]]
const landPav = [[-14.9, -6.4], [5.7, 14.1]]
const endPav = { y0: -11.8, y1: 9.4, d: 5.3 }

function mass(x0: number, x1: number, y0: number, y1: number, att: number) {
  box(trimP, null, x0, x1, y0, y1, 0, PL, 0.25)
  box(marble, null, x0 + 0.1, x1 - 0.1, y0 + 0.1, y1 - 0.1, PL, CORN - 1.0, 0.3)
  box(trimP, null, x0 - 0.35, x1 + 0.35, y0 - 0.35, y1 + 0.35, CORN - 1.0, CORN, 0.25) // entablature
  box(marble, roofP, x0 + 0.1, x1 - 0.1, y0 + 0.1, y1 - 0.1, CORN, att, 0.2) // attic
  box(trimP, null, x0 - 0.15, x1 + 0.15, y0 - 0.15, y1 + 0.15, att - 0.35, att, 0.15) // attic coping
}
mass(MB.x0, MB.x1, MB.y0, MB.y1, ATT)
for (const [a, b] of seaPav) mass(a, b, MB.y1 - 0.5, MB.y1 + 3.2, ATT2)
for (const [a, b] of landPav) mass(a, b, MB.y0 - 2.7, MB.y0 + 0.5, ATT2)
mass(MB.x0 - endPav.d, MB.x0 + 0.5, endPav.y0, endPav.y1, ATT2)
mass(MB.x1 - 0.5, MB.x1 + endPav.d, endPav.y0, endPav.y1, ATT2)

// A run of bays on a face: `at(s, z)` is the face point s metres along it,
// `n` its outward normal; each bay gets paired pilasters at its edges, an
// arched or square window on each storey, and a lattice panel in the attic.
type Face = { at: (s: number, z: number) => V3; n: V3; L: number }
const faceY = (x0: number, x1: number, y: number, out: number): Face => out > 0
  ? { at: (s, z) => [x1 - s, y, z], n: [0, 1, 0], L: x1 - x0 }
  : { at: (s, z) => [x0 + s, y, z], n: [0, -1, 0], L: x1 - x0 }
const faceX = (y0: number, y1: number, x: number, out: number): Face => out > 0
  ? { at: (s, z) => [x, y0 + s, z], n: [1, 0, 0], L: y1 - y0 }
  : { at: (s, z) => [x, y1 - s, z], n: [-1, 0, 0], L: y1 - y0 }
function bays(f: Face, pattern: ('a' | 'r' | 'A')[], o: { att?: number; crown?: boolean; lattices?: boolean } = {}) {
  const w = f.L / pattern.length
  const pil = (s: number) => {
    for (const d of [-0.45, 0.45]) {
      const p = f.at(s + d, PL), q = f.at(s + d, CORN - 1.0), r: V3 = [f.n[1] * -1, f.n[0], 0]
      const P = (pp: V3, k: number, z: number): V3 => [pp[0] + r[0] * k + f.n[0] * 0.35, pp[1] + r[1] * k + f.n[1] * 0.35, z]
      quad(trimP, P(p, -0.25, PL), P(p, 0.25, PL), P(q, 0.25, CORN - 1.0), P(q, -0.25, CORN - 1.0), f.n)
      void P
    }
  }
  for (let i = 0; i <= pattern.length; i++) if (i > 0 && i < pattern.length) pil(i * w)
  pil(0.6); pil(f.L - 0.6)
  pattern.forEach((k, i) => {
    const s = (i + 0.5) * w, ww = Math.min(w * 0.6, k === 'r' ? 1.6 : k === 'A' ? 2.7 : 2.4)
    const arch = k !== 'r'
    panel(glaze, f.at(s, PL + 1.3), f.n, ww, k === 'A' ? 6.2 : 5.4, arch, 6)
    panel(glaze, f.at(s, G1 + 1.4), f.n, ww, k === 'A' ? 5.4 : 4.8, arch, 6)
    if (o.lattices !== false) panel(lattice, f.at(s, CORN + 0.25), f.n, Math.min(w * 0.55, 2.2), (o.att ?? ATT) - CORN - 0.75, false, 1, 0.12)
  })
  if (o.crown) {
    // A segmental crown over the middle bay, a slab standing on the attic.
    const z = o.att ?? ATT, c = f.at(f.L / 2, z), rr: V3 = [-f.n[1], f.n[0], 0], R = 2.4, H = 1.5, T = 0.8
    const P = (t: number, d: number): V3 => [c[0] + rr[0] * R * Math.cos(t) - f.n[0] * d, c[1] + rr[1] * R * Math.cos(t) - f.n[1] * d, z + H * Math.sin(t)]
    const back: V3 = [-f.n[0], -f.n[1], 0]
    for (let i = 0; i < 8; i++) {
      const t0 = (Math.PI * i) / 8, t1 = (Math.PI * (i + 1)) / 8, tm = (t0 + t1) / 2
      tri(marble, [c[0] - f.n[0] * 0.3, c[1] - f.n[1] * 0.3, z], P(t0, 0.3), P(t1, 0.3), f.n)
      tri(marble, [c[0] - f.n[0] * (0.3 + T), c[1] - f.n[1] * (0.3 + T), z], P(t1, 0.3 + T), P(t0, 0.3 + T), back)
      quad(trimP, P(t0, 0.3), P(t0, 0.3 + T), P(t1, 0.3 + T), P(t1, 0.3), norm([rr[0] * Math.cos(tm) * H, rr[1] * Math.cos(tm) * H, Math.sin(tm) * R]))
    }
  }
}
// The pavilions' return faces: one window per storey.
for (const [a, b] of seaPav) { bays(faceX(MB.y1, MB.y1 + 3.2, a, -1), ['r'], { lattices: false }); bays(faceX(MB.y1, MB.y1 + 3.2, b, 1), ['r'], { lattices: false }) }
for (const [y0, y1, x, out] of [[endPav.y1, endPav.y1, MB.x0 - endPav.d, -1], [endPav.y1, endPav.y1, MB.x1 + endPav.d, 1]] as number[][]) {
  void y0; void y1
  bays(faceY(Math.min(x, x - out * endPav.d), Math.max(x, x - out * endPav.d), endPav.y1, 1), ['r'], { lattices: false })
  bays(faceY(Math.min(x, x - out * endPav.d), Math.max(x, x - out * endPav.d), endPav.y0, -1), ['r'], { lattices: false })
}
// Sea front (north): end bays, pavilions, the recessed centre.
bays(faceY(MB.x0, seaPav[0][0], MB.y1, 1), ['r', 'a', 'r'], { crown: true })
bays(faceY(seaPav[0][0], seaPav[0][1], MB.y1 + 3.2, 1), ['r', 'A', 'r'], { att: ATT2 })
bays(faceY(seaPav[0][1], seaPav[1][0], MB.y1, 1), ['a', 'A', 'a'])
bays(faceY(seaPav[1][0], seaPav[1][1], MB.y1 + 3.2, 1), ['r', 'A', 'r'], { att: ATT2 })
bays(faceY(seaPav[1][1], MB.x1, MB.y1, 1), ['r', 'a', 'r'], { crown: true })
// Land front (south).
bays(faceY(MB.x0, landPav[0][0], MB.y0, -1), ['r', 'a', 'r'], { crown: true })
bays(faceY(landPav[0][0], landPav[0][1], MB.y0 - 2.7, -1), ['r', 'A', 'r'], { att: ATT2 })
bays(faceY(landPav[0][1], landPav[1][0], MB.y0, -1), ['a', 'a', 'a'])
bays(faceY(landPav[1][0], landPav[1][1], MB.y0 - 2.7, -1), ['r', 'A', 'r'], { att: ATT2 })
bays(faceY(landPav[1][1], MB.x1, MB.y0, -1), ['r', 'a', 'r'], { crown: true })
// Short sides: the entrance pavilions and the bays either side.
for (const [x, xo, out] of [[MB.x0, MB.x0 - endPav.d, -1], [MB.x1, MB.x1 + endPav.d, 1]] as [number, number, number][]) {
  bays(faceX(endPav.y0, endPav.y1, xo, out), ['a', 'A', 'a'], { att: ATT2 })
  bays(faceX(MB.y0, endPav.y0, x, out), ['r', 'a'], {})
  bays(faceX(endPav.y1, MB.y1, x, out), ['a', 'r'], {})
  // The entrance stair: three broad marble steps before the pavilion.
  for (let k = 0; k < 3; k++) {
    const d = 4.5 - k * 1.3, z = 0.55 * (k + 1)
    const xa = out > 0 ? xo : xo - d, xb = out > 0 ? xo + d : xo
    box(trimP, trimP, xa, xb, endPav.y0 + 3 + k * 0.6, endPav.y1 - 3 - k * 0.6, 0, z, 0.1)
  }
}

const lit = (p: V3, n: V3): number => (n[2] > 0.85 ? 0.3 : 0.95)
const parts = [
  { part: marble, material: { ...finish('beylerbeyi-marble', 0xdcd8cf), floodlight: lit } },
  { part: trimP, material: { ...PALETTE.trim, color: 0xebe7de, floodlight: lit } },
  { part: roofP, material: { ...PALETTE.roof, color: 0xa3a9ad } },
  { part: glaze, material: PALETTE.window },
  { part: lattice, material: { ...PALETTE.window, name: 'window-2', color: 0x7f8b94 } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name, part.triangles)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Beylerbeyi Palace', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 323.4, osm: 'way/61736367', height: ATT2 + 1.4,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/istanbul-beylerbeyi-palace.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
