/**
 * Los Angeles Central Library (1926, Bertram Goodhue; Tom Bradley wing 1993,
 * Hardy Holzman Pfeiffer), Los Angeles — original procedural geometry,
 * CC0-1.0.
 * bun generators/la-central-library.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the outline's centroid
 * on the lowest ground under it (the Grand Ave side). Placed at bearing
 * 38.5°, so the block is square to this frame: +x faces Grand Avenue, −x
 * Flower Street, +y 5th Street.
 *
 * What makes it the library: Goodhue's cream concrete block, stepping up in
 * setbacks to a central square tower whose shaft is cut by tall window
 * bays, crowned by a tiled pyramid (gold sun mosaic) carrying a hand
 * holding a torch. East of it, sharing its outline, the Tom Bradley wing: a
 * plain cream block of the same height with a glazed atrium in its roof.
 *
 * Sources:
 * - Plan: OSM way/428021732 (both buildings in one outline), its parts
 *   way/495571355 (the central block under the tower) and way/1106887040
 *   (the Bradley wing).
 * - Heights: LA County LARIAC 2006 lidar surface model (Elevation MapServer
 *   layer 8, 3 m grid) over the bare-earth low point 85.4 m at the Grand Ave
 *   side: Goodhue's main block 24 m (≈ 18 m over 5th St and Flower St, which
 *   stand ≈ 6 m higher), the central block 30–33 m, the shaft's top ≈ 46 m,
 *   the pyramid ≈ 51 m on a 3 m grid; LARIAC 2020 footprint 484322840870
 *   gives the top (torch) at 142.2 m, 56.8 m over y = 0. Bradley wing's roof
 *   24–26 m, its north terraces 14–20 m.
 * - Proportions of the tower, pyramid and finial, the window bays, colours:
 *   photos (Wikimedia Commons) — "Los-angeles-central-library" (Mfield, GFDL
 *   1.2, the 5th St front, square on); HABS CAL,19-LOSAN,65-7 "General view,
 *   west elevation" and 65-2 "Looking SW from across West Fifth St.", 65-4
 *   "Distant view, east side" (Marvin Rand, public domain); "Los Angeles
 *   Central Library 08" (Visitor7, CC BY-SA 3.0).
 * - Estimated: the shaft's width (15 m, lidar and photo), the stage's steps, the
 *   pyramid's pitch (7 m high on a 14.6 m base) and its two-tone sun pattern, from the photos scaled by the lidar heights; the window bays'
 *   heights; the torch is drawn as a gilded post and flame.
 * - Left out: the sculpture, inscriptions, the Maguire Gardens and the
 *   stairs.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const conc = new Part(), roof = new Part(), win = new Part(), tile = new Part(), glass = new Part(), sun = new Part()
const band = tile

const BEARING = 38.5
const PROUD = 0.05
const at = (p: XY, z: number): V3 => [p[0], p[1], z]

/** An axis-aligned box with a bevelled top lip; walls `wall`, top `top`. */
function box(u0: number, u1: number, v0: number, v1: number, z0: number, z1: number, top = roof, wall = conc, lip = 0.4) {
  const r: XY[] = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]
  const ri: XY[] = [[u0 + lip, v0 + lip], [u1 - lip, v0 + lip], [u1 - lip, v1 - lip], [u0 + lip, v1 - lip]]
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4], ai = ri[i], bi = ri[(i + 1) % 4]
    wall.quad(at(a, z0), at(b, z0), at(b, z1 - lip), at(a, z1 - lip))
    wall.quad(at(a, z1 - lip), at(b, z1 - lip), at(bi, z1), at(ai, z1))
  }
  top.quad(at(ri[0], z1), at(ri[1], z1), at(ri[2], z1), at(ri[3], z1))
}

/**
 * Window panels along one face of a box: `n` bays across [s0, s1], each a
 * panel `w` wide from z0 to z1, set just proud of the wall. face: 'n' | 's'
 * | 'e' | 'w' at coordinate c.
 */
function bays(face: 'n' | 's' | 'e' | 'w', c: number, s0: number, s1: number, n: number, w: number, z0: number, z1: number, part = win) {
  const step = (s1 - s0) / n
  for (let i = 0; i < n; i++) {
    const m = s0 + (i + 0.5) * step, a = m - w / 2, b = m + w / 2
    if (face === 'n') part.quad([b, c + PROUD, z0], [a, c + PROUD, z0], [a, c + PROUD, z1], [b, c + PROUD, z1])
    if (face === 's') part.quad([a, c - PROUD, z0], [b, c - PROUD, z0], [b, c - PROUD, z1], [a, c - PROUD, z1])
    if (face === 'e') part.quad([c + PROUD, a, z0], [c + PROUD, b, z0], [c + PROUD, b, z1], [c + PROUD, a, z1])
    if (face === 'w') part.quad([c - PROUD, b, z0], [c - PROUD, a, z0], [c - PROUD, a, z1], [c - PROUD, b, z1])
  }
}

// ---------- Goodhue's building ----------
const T: XY = [-40.5, 4.5] // the tower's axis
// main block, and the entrance bays on Flower St and 5th St
box(-76, -4, -25, 32, 0, 24)
box(-81, -76, 0.7, 6.8, 0, 17)
box(-52, -29, 32, 36, 0, 17)
// tall windows between piers on the two street fronts (5th St, Flower St)
// and on the south: one panel per bay, two storeys tall
bays('n', 32, -74, -6, 9, 4.2, 11, 20)
bays('w', -76, -23, 30, 7, 4.2, 11, 20)
bays('s', -25, -74, -6, 9, 4.2, 6, 15)
// the stage: one broad block standing above the main roof (lidar 27–31 m
// round the shaft; 5th St photo: ≈ 0.42 of the facade's width)
box(T[0] - 15, T[0] + 15, T[1] - 13, T[1] + 13, 0, 28)
// the shaft (lidar: the 40–51 m returns span ≈ 15 m), one broad window
// panel a face in two storey groups, blank wall either side
const SH = 7.5, SHAFT_TOP = 46
box(T[0] - SH, T[0] + SH, T[1] - SH, T[1] + SH, 0, SHAFT_TOP, roof, conc, 0.3)
for (const [z0, z1] of [[30.5, 37], [38, 44.5]]) {
  bays('n', T[1] + SH, T[0] - 2.8, T[0] + 2.8, 1, 5.2, z0, z1)
  bays('s', T[1] - SH, T[0] - 2.8, T[0] + 2.8, 1, 5.2, z0, z1)
  bays('e', T[0] + SH, T[1] - 2.8, T[1] + 2.8, 1, 5.2, z0, z1)
  bays('w', T[0] - SH, T[1] - 2.8, T[1] + 2.8, 1, 5.2, z0, z1)
}

// the tiled pyramid: a band of patterned tile at its foot, then steep
// faces (height ≈ 0.48 of the base, as steep as the lidar's 56.8 m top
// allows with the finial on it), each with the gold sun drawn as a
// broad lighter triangle on the ochre tile; the hand and torch on top
{
  const B = SH - 0.2, z0 = SHAFT_TOP, z1 = SHAFT_TOP + 1.6, apex = z1 + 2 * B * 0.48
  const sq = (h: number, z: number): V3[] => [[T[0] - h, T[1] - h, z], [T[0] + h, T[1] - h, z], [T[0] + h, T[1] + h, z], [T[0] - h, T[1] + h, z]]
  const lo = sq(B, z0), hi = sq(B, z1), A: V3 = [T[0], T[1], apex]
  const mix = (p: V3, q: V3, t: number): V3 => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    band.quad(lo[i], lo[j], hi[j], hi[i])
    // ochre face, with the sun as an inner triangle in light gold
    const a = mix(hi[i], hi[j], 0.16), b = mix(hi[i], hi[j], 0.84), c = mix(mix(hi[i], hi[j], 0.5), A, 0.72)
    tile.tri(hi[i], a, A); tile.tri(b, hi[j], A); tile.tri(a, c, A); tile.tri(c, b, A)
    tile.quad(hi[i], hi[j], b, a)
    sun.tri(a, b, c)
  }
  // the finial: a bold gilded post, the hand, and the flame
  const post = (h: number, za: number, zb: number) => {
    const p = sq(h, za), q = sq(h, zb)
    for (let i = 0; i < 4; i++) tile.quad(p[i], p[(i + 1) % 4], q[(i + 1) % 4], q[i])
    tile.quad(q[0], q[1], q[2], q[3])
  }
  post(0.6, apex - 1, apex + 0.7)
  post(0.95, apex + 0.7, apex + 1.3)
  const f0 = sq(0.85, apex + 1.3)
  for (let i = 0; i < 4; i++) sun.tri(f0[i], f0[(i + 1) % 4], [T[0], T[1], 56.8])
}

// ---------- the Tom Bradley wing ----------
box(-4, 71, -25, 17.6, 0, 25.5)
box(-4, 71, -36, -25, 0, 16.5)
box(24.4, 71, 17.6, 37, 0, 20)
box(-4, 24.4, 17.6, 32, 0, 14)
// its glazed atrium, a long skylight down the middle of the roof
glass.quad([8, -8, 25.5 + PROUD], [62, -8, 25.5 + PROUD], [62, 4, 25.5 + PROUD], [8, 4, 25.5 + PROUD])
// its windows: bands of panels on the Grand and 5th St sides
bays('e', 71, -24, 16, 6, 4.2, 15, 23)
bays('n', 37, 26, 69, 6, 4.2, 12, 18)

// ---------- write ----------
const parts = [
  { part: conc, material: finish('lapl-concrete', 0xece2cb) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: tile, material: finish('lapl-tile', 0xc9955a) },
  { part: glass, material: PALETTE.glass },
  { part: sun, material: finish('lapl-sun', 0xf3dc9c) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Los Angeles Central Library', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, height: 56.8,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/428021732', 'way/495571355', 'way/1106887040'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/la-central-library.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
