/**
 * Hotel Valley Ho, Scottsdale, Arizona (Edward L. Varney, 1956; tower
 * remodelled and raised in 2008 by Allen + Philp) — original procedural
 * geometry, CC0-1.0.
 * bun generators/phx-hotel-valley-ho.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin on the
 * ground at the area centroid of OSM way/554797665 (building=yes,
 * tourism=hotel; -111.933818, 33.493376), the one outline OSM draws for
 * the whole hotel, which it replaces.
 *
 * What is drawn: the whole outline: the tower; the 1956 two-storey guest
 * wings, the curved one round the pool and the diagonal one to the
 * north-east; the low lobby, restaurant and porte-cochère blocks to the
 * west and south. Left out: the separate hotel buildings to the north and
 * north-east (way/554797662, way/554797664), and the pool court (ground).
 *
 * Identity (photos below):
 *  1. The tower: a tall plain white end wall facing south (with the
 *     "Valley Ho" script sign), and the long block behind it with deep
 *     cantilevered balconies whose glass panels are tiled in orange, blue,
 *     green and yellow mosaics in vertical runs.        (dawn, dru, m1)
 *  2. The 1956 wings: two storeys, white, a thin projecting roof slab, deep
 *     white fin walls and the upper walkway's brown cast-concrete railing
 *     blocks.                                            (east, dru, m1)
 *  3. The low porte-cochère with its brown scalloped fascia.        (dawn)
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020), 1 m grid
 * in this frame; z = lidar - 0.6 (the lowest ground under the footprint,
 * at the south-east). Measured (lidar): the tower's balcony block 24.3–25.9
 * over x -28..-8, y -42..34; its south end 28.5–28.9 (x -22..-14, y -42..-28);
 * a plant room at the north end 28–31.5; the 1956 wings 7.5; the lobby
 * block 4.7–5.6; the restaurant block to the south-west 6.7–7.9; the
 * porte-cochère 4.3–5.3; ground 0.6–1.4.
 * Estimated: the tower's floor count and slab spacing (seven floors over a
 * lobby storey, from dawn and dru), the balcony depth (3 m), the panel runs
 * (one in about three bays), the wings' fins and railing band.
 *
 * Photos (evidence):
 *  dawn "HotelValleyHo-at-dawn.jpg", Binksternet, CC BY-SA 3.0
 *       https://commons.wikimedia.org/wiki/File:HotelValleyHo-at-dawn.jpg
 *  dru  "Valley Ho Hotel.jpg", Dru Bloomfield, CC BY 2.0
 *       https://commons.wikimedia.org/wiki/File:Valley_Ho_Hotel.jpg
 *  east "Valley Ho Hotel east wing.jpg", Dru Bloomfield, CC BY 2.0
 *       https://commons.wikimedia.org/wiki/File:Valley_Ho_Hotel_east_wing.jpg
 *  m1   "Scottsdale-Hotel Valley Ho-1956-1.JPG", Marine 69-71, CC BY-SA 4.0
 *       https://commons.wikimedia.org/wiki/File:Scottsdale-Hotel_Valley_Ho-1956-1.JPG
 * USGS NAIP orthophoto (public domain) for the plan. No look-only sources.
 * No commercial imagery.
 *
 * Doubts: the "Valley Ho" script sign is not drawn (it would need tracing
 * with lettering.ts); the west side of the tower and the lobby blocks are
 * not photographed here and are drawn plain; the wings' fins are drawn as
 * one fin every 4.5 m.
 *
 * Night: the tower's windows and the wings' windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, ccw, prism, save, type XY } from './atl-flatiron-building'

const white = new Part(), roof = new Part(), win = new Part(), orange = new Part(), teal = new Part(), brown = new Part()
const z = (H: number) => H - 0.6

function face(p: Part, q: V3[], want: V3) {
  const b = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], c = [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]]
  const g = [b[1] * c[2] - b[2] * c[1], b[2] * c[0] - b[0] * c[2], b[0] * c[1] - b[1] * c[0]]
  const r = g[0] * want[0] + g[1] * want[1] + g[2] * want[2] < 0 ? [...q].reverse() : q
  if (r.length === 3) p.tri(r[0], r[1], r[2])
  else p.quad(r[0], r[1], r[2], r[3])
}
const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = p, bev = 0.25) =>
  prism(p, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, top, bev)

// ── the low west and south blocks (lobby, restaurant, porte-cochère) ──
const L: XY[] = ccw([
  [-12.1, 37.9], [-8.5, 35.0], [-8.5, -44.4], [-9.4, -52.6], [-13.1, -54.9], [-18.9, -48.3], [-22.6, -43.9], [-25.3, -50.1], [-26.8, -55.9],
  [-27.6, -63.8], [-27.3, -72.2], [-55.5, -72.2], [-55.7, -14.4], [-47.3, -14.4], [-46.8, -10.2], [-41.5, -5.2], [-41.8, -0.8], [-44.3, -0.8],
  [-46.8, 2.0], [-47.5, 7.4], [-54.5, 7.7], [-54.6, 15.1], [-31.4, 15.0], [-31.6, 22.1], [-50.7, 22.1], [-51.0, 32.5], [-37.8, 32.5],
  [-50.5, 44.2], [-40.0, 54.1], [-17.9, 32.5],
])
prism(white, L, 0, z(5.2), roof, 0.3)
box(white, -55.5, -28.5, -72.2, -42, z(5.2) - 0.3, z(7.2), roof)
// the porte-cochère's brown scalloped fascia, along its south and east edges
for (const [a, b] of [[[-27.3, -55.9], [-13.1, -54.9]], [[-13.1, -54.9], [-8.5, -44.4]]] as [XY, XY][]) {
  const ex = b[0] - a[0], ey = b[1] - a[1], l = Math.hypot(ex, ey), n: XY = [ey / l, -ex / l]
  const P = (t: number, zz: number, o = 0.3): V3 => [a[0] + ex * t + n[0] * o, a[1] + ey * t + n[1] * o, zz]
  face(brown, [P(0, z(4.0)), P(1, z(4.0)), P(1, z(5.3)), P(0, z(5.3))], [n[0], n[1], 0])
}

// ── the tower ──
const TX0 = -28.5, TX1 = -8.5, TY0 = -42, TY1 = 34, BAL = 3.0
const CX0 = TX0 + BAL, CX1 = TX1 - BAL // the core between the balconies
const TOP = z(24.6), FL = 3.05, F0 = z(5.2) // floors above the lobby storey
box(white, CX0, CX1, TY0, TY1, 0, TOP, roof, 0.35)
// the south end: a plain white slab, taller, full width
box(white, TX0, TX1, TY0, TY0 + 12, 0, z(28.6), roof, 0.4)
// the north plant room
box(white, -22, -10, 26, 33, TOP, z(28.5), roof, 0.3)
// glass behind the balconies, in two-floor panels between white piers
for (const [xf, d] of [[CX1, 1], [CX0, -1]] as [number, number][]) {
  for (let f = 0; f < 6; f += 2) {
    const z0 = F0 + f * FL + 0.4, z1 = F0 + (f + 2) * FL - 0.2
    for (let y = TY0 + 13; y + 5 <= TY1; y += 6) {
      const xx = xf + d * 0.05
      face(win, [[xx, y + 0.4, z0], [xx, y + 5.6, z0], [xx, y + 5.6, z1], [xx, y + 0.4, z1]], [d, 0, 0])
    }
  }
}
// the balcony slabs and the mosaic glass panels on their fronts
const panel = (p: Part, x: number, d: number, y0: number, y1: number, z0: number, z1: number) =>
  face(p, [[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]], [d, 0, 0])
for (let f = 0; f <= 6; f++) {
  const zs = F0 + f * FL
  box(white, TX0, CX0 + 0.1, TY0 + 12, TY1, zs - 0.35, zs, white, 0.1)
  box(white, CX1 - 0.1, TX1, TY0 + 12, TY1, zs - 0.35, zs, white, 0.1)
}
{
  // runs of mosaic panels, each a vertical stack the height of the block
  const runs: [number, Part][] = [[TY0 + 13, orange], [TY0 + 25, teal], [TY0 + 37, orange], [TY0 + 49, teal], [TY0 + 61, orange]]
  for (const [y, p] of runs) {
    panel(p, TX1 + 0.02, 1, y, y + 4.5, F0 + 0.3, F0 + 6 * FL - 0.4)
    panel(p, TX0 - 0.02, -1, y + 6, y + 10.5, F0 + 0.3, F0 + 6 * FL - 0.4)
  }
  // the end walls' shallow balconies seen on the west (dawn)
}
// the lobby storey's glass on the east
face(win, [[TX1 + 0.05, TY0 + 14, 0.6], [TX1 + 0.05, TY1 - 2, 0.6], [TX1 + 0.05, TY1 - 2, F0 - 0.5], [TX1 + 0.05, TY0 + 14, F0 - 0.5]], [1, 0, 0])

// ── the 1956 wings: two storeys, a thin roof slab, fins, brown railings ──
const W1: XY[] = ccw([
  [-8.5, -31.8], [12.8, -31.0], [23.0, -29.2], [33.2, -27.3], [52.4, -21.4], [70.8, -10.7], [81.2, -3.5], [88.5, 3.2], [96.7, 11.6], [94.4, 12.9],
  [97.2, 16.6], [92.2, 21.3], [88.2, 18.3], [52.6, 54.8], [43.6, 46.6], [77.2, 10.9], [68.8, 3.7], [58.8, -3.5], [47.6, -9.2], [36.4, -13.2],
  [21.7, -16.9], [9.0, -18.4], [-2.7, -18.4], [-8.5, -12.9],
])
const W2: XY[] = ccw([[-8.5, 18.8], [-2.2, 13.6], [63.6, 79.4], [55.1, 87.8], [-3.4, 31.2], [-8.5, 35.0]])
const WT = z(7.5)
for (const W of [W1, W2]) {
  prism(white, W, 0, WT - 0.5, null, 0)
  // the roof slab, overhanging 1.2 m
  const n = W.length
  const big = W.map((q, i) => {
    const a = W[(i - 1 + n) % n], b = W[(i + 1) % n]
    const e1 = [q[0] - a[0], q[1] - a[1]], e2 = [b[0] - q[0], b[1] - q[1]]
    const l1 = Math.hypot(e1[0], e1[1]), l2 = Math.hypot(e2[0], e2[1])
    const n1 = [e1[1] / l1, -e1[0] / l1], n2 = [e2[1] / l2, -e2[0] / l2]
    const m = [n1[0] + n2[0], n1[1] + n2[1]], ml = Math.hypot(m[0], m[1]) || 1
    const k = 1.2 / Math.max(0.5, (m[0] * n1[0] + m[1] * n1[1]) / ml)
    return [q[0] + (m[0] / ml) * k, q[1] + (m[1] / ml) * k] as XY
  })
  prism(white, big, WT - 0.5, WT, roof, 0.12, true)
  // each long face: two window bands, the brown railing, fins
  for (let i = 0; i < n; i++) {
    const a = W[i], b = W[(i + 1) % n], ex = b[0] - a[0], ey = b[1] - a[1], l = Math.hypot(ex, ey)
    if (l < 7 || (a[0] < -8 && b[0] < -8)) continue
    const t: XY = [ex / l, ey / l], nn: XY = [t[1], -t[0]]
    const P = (s: number, zz: number, o: number): V3 => [a[0] + t[0] * s + nn[0] * o, a[1] + t[1] * s + nn[1] * o, zz]
    const want: V3 = [nn[0], nn[1], 0]
    face(win, [P(0.8, 0.6, 0.05), P(l - 0.8, 0.6, 0.05), P(l - 0.8, 2.9, 0.05), P(0.8, 2.9, 0.05)], want)
    face(win, [P(0.8, 3.9, 0.05), P(l - 0.8, 3.9, 0.05), P(l - 0.8, WT - 0.9, 0.05), P(0.8, WT - 0.9, 0.05)], want)
    // the upper walkway slab and its railing, 1.2 m out
    const k = Math.max(1, Math.round(l / 4.5))
    face(white, [P(0, 3.4, 1.2), P(l, 3.4, 1.2), P(l, 3.4, 0), P(0, 3.4, 0)], [0, 0, 1])
    face(white, [P(0, 3.1, 1.2), P(l, 3.1, 1.2), P(l, 3.4, 1.2), P(0, 3.4, 1.2)], want)
    face(brown, [P(0.2, 3.4, 1.25), P(l - 0.2, 3.4, 1.25), P(l - 0.2, 4.5, 1.25), P(0.2, 4.5, 1.25)], want)
    face(brown, [P(0.2, 3.4, 1.15), P(l - 0.2, 3.4, 1.15), P(l - 0.2, 4.5, 1.15), P(0.2, 4.5, 1.15)], [-nn[0], -nn[1], 0])
    for (let j = 1; j < k; j++) {
      const s = (l * j) / k
      face(white, [P(s, 0, 0), P(s, 0, 1.2), P(s, WT - 0.5, 1.2), P(s, WT - 0.5, 0)], [t[0], t[1], 0])
      face(white, [P(s, 0, 0), P(s, 0, 1.2), P(s, WT - 0.5, 1.2), P(s, WT - 0.5, 0)], [-t[0], -t[1], 0])
    }
  }
}
void capPoly

await save('phx-hotel-valley-ho', 'Hotel Valley Ho', [
  { part: white, material: finish('vh-white', 0xf1eee8) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: orange, material: finish('vh-mosaic-orange', 0xcf7a50) },
  { part: teal, material: finish('vh-mosaic-teal', 0x77a8b8) },
  { part: brown, material: finish('vh-railing-brown', 0x9a6a55) },
], { height: z(28.6), anchor: [33.493376, -111.933818], bearing: 0 }, 6500)
