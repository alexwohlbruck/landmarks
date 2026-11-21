/**
 * Hopi House, Grand Canyon Village, South Rim (1905, Mary Colter for Fred
 * Harvey) — original procedural geometry, CC0-1.0.
 * bun generators/grand-canyon-hopi-house.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of OSM way/144433041 (-112.136779, 36.057828).
 * Bearing 41.4: the model's +x runs along the long axis (131.4°, toward the
 * south-east), +y toward the rim (41.4°). Geometry follows the lidar, about
 * 1 m south-east of the OSM rectangle and 2 m deeper front to back.
 *
 * Identity: a stepped pueblo of red sandstone laid in thin courses. A
 * three-storey block at the back, stepping down through two-storey and
 * one-storey terraces to the front; flat roofs behind low parapets with
 * stepped, raised corners; peeled log vigas poking out of the walls under
 * every roof; the ladders rising from the terraces past the top; small deep
 * windows and plank doors.
 *
 * Evidence:
 *  - plan: OSM way/144433041 (29.6 × 15.4 m); USGS 3DEP lidar
 *    AZ_GrandCanyonNP_1_2019 (1 m grid) for the terraces.
 *  - heights (measured, lidar, on flat ground at 2109 m): back block 8.5–9
 *    (three storeys), middle and west terraces 6–6.5, front terraces
 *    3.5–4, the east front tower 8. Parapets, stepped corners, vigas,
 *    ladders, windows and doors: estimated from the photos.
 *  - colour (photos, pulled light): red-brown sandstone; earth roofs; grey-
 *    brown weathered wood.
 *
 * Photos (Wikimedia Commons, evidence): Hopi_House_2021.jpg — Austin Smith,
 * CC BY-SA 4.0; Grand_Canyon_Village_-_Hopi_House_(34933475853).jpg —
 * Jared from Clermont, CC BY 2.0; Grand_Canyon_Hopi_House_0216_
 * (5953038542).jpg — Grand Canyon National Park, CC BY 2.0. No look-only
 * sources. No commercial imagery.
 *
 * Doubts: the rim-side (north-east) face is drawn from lidar only; the
 * terrace edges are simplified to rectangles; the pots, chimneys, the
 * pergola at the south-east end and the low garden walls are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, onWall, rect, save, walls, type XY } from './chi-museum-of-science-industry'
import { face, parapet, prism } from './grand-canyon-el-tovar'

const stone = new Part(), top = new Part(), wood = new Part(), win = new Part()

type Box = [number, number, number, number, number]
// x0, x1, y0, y1, roof height
const blocks: Box[] = [
  [-9, 14.5, 3, 10.5, 9.0],    // back block, three storeys
  [14.5, 15.6, 3, 10.5, 6.2],
  [-12.7, 12.5, -3, 3, 6.5],   // middle terrace, two storeys
  [-12.7, -9, 3, 10.5, 6.2],   // west end
  [-10, -4, -9, -3, 3.8],      // front terraces
  [-1.5, 5, -9.5, -3, 6.5],
  [5, 9, -9, -3, 3.6],
  [9, 15.6, -10, 3, 8.0],      // east tower
]

for (const [x0, x1, y0, y1, h] of blocks) {
  const r = rect(x0, y0, x1, y1)
  prism(stone, r, 0, h - 0.05, null)
  cap(top, r, h - 0.05)
  parapet(stone, r, h - 0.05, h + 0.45, 0.3)
  // Stepped corners: raised blocks at each corner of the parapet.
  for (const [cx, cy, sx, sy] of [[x0, y0, 1, 1], [x1, y0, -1, 1], [x1, y1, -1, -1], [x0, y1, 1, -1]]) {
    const a = Math.min(cx, cx + sx * 1.3), b = Math.max(cx, cx + sx * 1.3)
    const c = Math.min(cy, cy + sy * 1.3), d = Math.max(cy, cy + sy * 1.3)
    prism(stone, rect(a, c, b, d), h + 0.45, h + 1.05)
    const a2 = Math.min(cx, cx + sx * 0.6), b2 = Math.max(cx, cx + sx * 0.6)
    const c2 = Math.min(cy, cy + sy * 0.6), d2 = Math.max(cy, cy + sy * 0.6)
    prism(stone, rect(a2, c2, b2, d2), h + 1.05, h + 1.55)
  }
}

/** Viga ends: short square logs out of wall a→b, just under the roof at z. */
function vigas(a: XY, b: XY, z: number, s0: number, s1: number, step = 1.6) {
  const { u, n, P } = onWall(a, b)
  const N: V3 = [n[0], n[1], 0], U: V3 = [u[0], u[1], 0]
  for (let s = s0; s <= s1 + 1e-6; s += step) {
    const r = 0.14, d = 0.7
    face(wood, [P(s - r, z - r, d), P(s + r, z - r, d), P(s + r, z + r, d), P(s - r, z + r, d)], N)
    face(wood, [P(s - r, z + r, 0), P(s + r, z + r, 0), P(s + r, z + r, d), P(s - r, z + r, d)], [0, 0, 1])
    face(wood, [P(s - r, z - r, 0), P(s - r, z - r, d), P(s - r, z + r, d), P(s - r, z + r, 0)], [-U[0], -U[1], 0])
    face(wood, [P(s + r, z - r, 0), P(s + r, z - r, d), P(s + r, z + r, d), P(s + r, z + r, 0)], U)
  }
}
/** A small flush panel on wall a→b. */
function opening(p: Part, a: XY, b: XY, s: number, w: number, z0: number, z1: number) {
  const { n, P } = onWall(a, b)
  face(p, [P(s - w / 2, z0, 0.06), P(s + w / 2, z0, 0.06), P(s + w / 2, z1, 0.06), P(s - w / 2, z1, 0.06)], [n[0], n[1], 0])
}

// South-west front (y = −9..−10, faces −y): the terraces step down.
vigas([-10, -9], [-4, -9], 3.3, 0.8, 5.2)
vigas([-1.5, -9.5], [5, -9.5], 6.0, 0.8, 5.6)
vigas([-1.5, -9.5], [5, -9.5], 3.0, 1.2, 5.2, 2.0)
vigas([5, -9], [9, -9], 3.1, 0.8, 3.2)
vigas([9, -10], [15.6, -10], 7.5, 0.8, 5.8)
vigas([9, -10], [15.6, -10], 4.2, 1.0, 5.8, 1.6)
vigas([-12.7, -3], [9, -3], 6.0, 2.2, 21, 1.8)
vigas([-9, 3], [14.5, 3], 8.5, 1.0, 22.5, 1.8)
// North-west end and south-east end.
vigas([-12.7, 10.5], [-12.7, -3], 5.7, 0.8, 13, 1.6)
vigas([-12.7, 10.5], [-12.7, -3], 2.8, 0.8, 13, 2.2)
vigas([15.6, -10], [15.6, 10.5], 7.5, 0.8, 12.6, 1.6)
vigas([15.6, -10], [15.6, 10.5], 4.0, 0.8, 19.6, 2.0)
// Rim side (north-east).
vigas([15.6, 10.5], [-12.7, 10.5], 8.5, 1.2, 27, 2.0)

// Windows: small deep openings, a few per wall and storey.
for (const s of [1.6, 4.4]) opening(win, [-10, -9], [-4, -9], s, 0.6, 1.4, 2.3)
opening(wood, [-1.5, -9.5], [5, -9.5], 2.0, 1.1, 0, 2.2) // plank door
for (const s of [4.6]) opening(win, [-1.5, -9.5], [5, -9.5], s, 0.6, 1.3, 2.2)
for (const s of [1.5, 4.8]) opening(win, [-1.5, -9.5], [5, -9.5], s, 0.6, 4.3, 5.2)
opening(win, [5, -9], [9, -9], 2.0, 0.6, 1.4, 2.3)
for (const s of [1.6, 4.6]) { opening(win, [9, -10], [15.6, -10], s, 0.6, 1.3, 2.2); opening(win, [9, -10], [15.6, -10], s, 0.6, 4.6, 5.5) }
for (const s of [3, 7, 11, 15, 19]) opening(win, [-12.7, -3], [9, -3], s, 0.6, 4.2, 5.1)
for (const s of [3, 8, 13, 18]) opening(win, [-9, 3], [14.5, 3], s, 0.7, 6.9, 7.9)
opening(wood, [-12.7, 10.5], [-12.7, -3], 6.8, 1.1, 0, 2.2)
for (const s of [2.5, 10.5]) { opening(win, [-12.7, 10.5], [-12.7, -3], s, 0.6, 1.4, 2.3); opening(win, [-12.7, 10.5], [-12.7, -3], s, 0.6, 4.0, 4.9) }
for (const s of [4, 9, 14]) { opening(win, [15.6, -10], [15.6, 10.5], s, 0.6, 1.4, 2.3); opening(win, [15.6, -10], [15.6, 10.5], s, 0.6, 4.3, 5.2) }
opening(wood, [15.6, -10], [15.6, 10.5], 17.5, 1.1, 0, 2.2)
for (const s of [3, 8, 13, 18, 23]) { opening(win, [15.6, 10.5], [-12.7, 10.5], s, 0.6, 1.4, 2.3); opening(win, [15.6, 10.5], [-12.7, 10.5], s, 0.6, 4.3, 5.2); opening(win, [15.6, 10.5], [-12.7, 10.5], s, 0.6, 7.0, 7.9) }

/** A ladder: two poles leaning from (x, y0, z0) to (x, y1, z1), with rungs. */
function ladder(x: number, y0: number, z0: number, y1: number, z1: number) {
  const r = 0.11, w = 0.45
  const bar = (ax: number, ay: number, az: number, bx: number, by: number, bz: number) => {
    // A square bar along a→b in the y–z plane (or along x for rungs).
    const along: V3 = [bx - ax, by - ay, bz - az]
    const L = Math.hypot(...along), t: V3 = [along[0] / L, along[1] / L, along[2] / L]
    const s1: V3 = Math.abs(t[0]) > 0.9 ? [0, 0, 1] : [1, 0, 0]
    const s2: V3 = [t[1] * s1[2] - t[2] * s1[1], t[2] * s1[0] - t[0] * s1[2], t[0] * s1[1] - t[1] * s1[0]]
    const c = (p: V3, i: number): V3 => {
      const a = [[-1, -1], [1, -1], [1, 1], [-1, 1]][i]
      return [p[0] + (s1[0] * a[0] + s2[0] * a[1]) * r, p[1] + (s1[1] * a[0] + s2[1] * a[1]) * r, p[2] + (s1[2] * a[0] + s2[2] * a[1]) * r]
    }
    const A: V3 = [ax, ay, az], B: V3 = [bx, by, bz]
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      const mid: V3 = [(c(A, i)[0] + c(A, j)[0]) / 2 - ax, (c(A, i)[1] + c(A, j)[1]) / 2 - ay, (c(A, i)[2] + c(A, j)[2]) / 2 - az]
      face(wood, [c(A, i), c(A, j), c(B, j), c(B, i)], mid)
    }
    face(wood, [c(B, 0), c(B, 1), c(B, 2), c(B, 3)], t)
  }
  for (const dx of [-w, w]) bar(x + dx, y0, z0, x + dx, y1, z1)
  for (let k = 1; k <= 4; k++) {
    const f = k / 5, y = y0 + (y1 - y0) * f, z = z0 + (z1 - z0) * f
    bar(x - w - 0.1, y, z, x + w + 0.1, y, z)
  }
}
// From the middle terrace up past the back block, and up from the front.
ladder(-1.0, 0.6, 6.5, 2.4, 11.0)
ladder(1.8, -6.0, 6.5, -4.4, 9.8)
ladder(-7.0, -6.2, 3.8, -4.4, 7.4)

await save('grand-canyon-hopi-house', 'Hopi House', [
  { part: stone, material: finish('hopi-sandstone', 0xa86a54) },
  { part: top, material: finish('hopi-earth-roof', 0xb39582) },
  { part: wood, material: finish('hopi-wood', 0x6f5a48) },
  { part: win, material: PALETTE.window },
], { height: 11.0 })
