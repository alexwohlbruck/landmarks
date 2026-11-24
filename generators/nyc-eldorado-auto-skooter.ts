/**
 * Eldorado Auto Skooter, the bumper-car hall on Surf Avenue, Coney Island —
 * procedural, CC0-1.0, no textures. A plain model: see "Doubts".
 * bun generators/nyc-eldorado-auto-skooter.ts
 *
 * Map frame: x = east, y = north, z up, metres; bearing 0 (the Surf
 * Avenue front runs east–west). Anchor: area centroid of OSM
 * way/405892190 ("Eldorado Plaza"), which holds the attraction's node
 * (node/9393413600, attraction=bumper_car, name Eldorado Auto Skooter).
 * The hall runs through the block from Surf Avenue (north) to the Bowery
 * (south), between 1220 Surf Avenue (west) and the Shooting Gallery at
 * 1214 (east).
 *
 * Evidence
 * - OSM: way/405892190 (building=retail, building:levels 2), about
 *   15.6 × 61 m, with a narrow strip along its east side south of the
 *   Shooting Gallery.
 * - NYC lidar (USGS 3DEP NY_NewYorkCity, 2017), read at 0.5 m: the front
 *   half of the hall roofed at about 4.6 m, the back half at about 6.6 m,
 *   the Surf Avenue sign front rising to about 7 m. Flat ground.
 * - Photos (open licences):
 *   - "2008-05-17 Coney Island, Long Island 008 Coney Island, Surf Avenue",
 *     Allie_Caulfield, CC BY 2.0 (Flickr 2677827799 / Wikimedia Commons):
 *     Surf Avenue looking east; at its right edge the hall's east pier, a
 *     red panel with "BUMPER CARS" in white, under the yellow bulb-studded
 *     frame of the sign front.
 *   - "Bump Your Ass Off.JPG", Dane Unknoen, CC BY-SA 3.0 (Wikimedia
 *     Commons, 2008): the sign front's hot-pink face, yellow bulb-studded
 *     frames, a bulb letter, a black panel with yellow lettering.
 * - Look-only (CC BY-NC / NC-ND Flickr photos by wallyg, kenyee, Shawn
 *   Hoke, jackszwergoldarchives): the full sign front, a pink board with
 *   "Eldorado" in red script and "AUTO SKOOTER" in bulb letters, a red
 *   "ELDORADO" canopy over the sidewalk and a round bumper-car sign on a
 *   pole. These may not shape the model and nothing below rests on them.
 *
 * Doubts
 * - No open photo shows the sign front whole, so it is drawn plain: a pink
 *   board in a yellow frame across the full front at 3.0–7.2 m (height
 *   estimated from the lidar and the 2008 photos), with no lettering. The
 *   canopy and the pole sign, seen only in look-only photos, are left out.
 * - The Bowery front, the side walls and the roof are not photographed and
 *   are drawn plain.
 * - The open front is drawn as one lit opening (window) under the board;
 *   the Bowery front, unphotographed, is a plain wall.
 *
 * Night: the pink board and the yellow bulb frame glow (neon), as does
 * the red BUMPER CARS pier; the open hall front is lit (window).
 */
import { Part, type V3, sub, cross } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, area, type XY } from './nyc-570-lexington'

const wall = new Part(), roof = new Part(), pink = new Part(), yellow = new Part(), red = new Part(), glaze = new Part()

// OSM way/405892190, metres east/north of (-73.98147, 40.57522); recentred
// on the area centroid below.
const RAW: XY[] = [
  [101.86, 19.31], [117.10, 18.75], [117.23, -7.86], [119.11, -8.06],
  [118.04, -41.61], [101.30, -41.43], [101.55, -17.69], [101.68, -5.72],
]
function centroid(r: XY[]): XY {
  let a = 0, cx = 0, cy = 0
  for (let i = 0; i < r.length; i++) {
    const [x0, y0] = r[i], [x1, y1] = r[(i + 1) % r.length], k = x0 * y1 - x1 * y0
    a += k; cx += (x0 + x1) * k; cy += (y0 + y1) * k
  }
  return [cx / (3 * a), cy / (3 * a)]
}
const C = centroid(RAW)
if (import.meta.main) console.log('centroid offset (m):', C.map((v) => v.toFixed(2)).join(', '), 'area', area(RAW).toFixed(1))
const ring: XY[] = RAW.map(([x, y]) => [x - C[0], y - C[1]])
const [NW, NE] = ring
const SPLIT = -7.9 - C[1] // where the lower front hall meets the taller back hall
const FRONT_ROOF = 4.6, BACK_ROOF = 6.6, BOARD0 = 3.0, BOARD1 = 7.2

// ---------------------------------------------------------------------------
// Helpers.
// ---------------------------------------------------------------------------
type Frame = { at: (s: number, z: number, d?: number) => V3; u: V3; n: V3; L: number }
function along(a: XY, b: XY): Frame {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  return { at: (s, z, d = 0) => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z], u: [u[0], u[1], 0], n: [n[0], n[1], 0], L }
}
const neg = (v: V3): V3 => [-v[0], -v[1], -v[2]]
function face(p: Part, pts: V3[], want: V3) {
  const g = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const q = g[0] * want[0] + g[1] * want[1] + g[2] * want[2] >= 0 ? pts : [...pts].reverse()
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}
function slab(p: Part, F: Frame, s0: number, s1: number, z0: number, z1: number, d0: number, d1: number) {
  const P = F.at
  face(p, [P(s0, z0, d1), P(s1, z0, d1), P(s1, z1, d1), P(s0, z1, d1)], F.n)
  face(p, [P(s0, z0, d0), P(s1, z0, d0), P(s1, z1, d0), P(s0, z1, d0)], neg(F.n))
  face(p, [P(s0, z0, d0), P(s0, z0, d1), P(s0, z1, d1), P(s0, z1, d0)], neg(F.u))
  face(p, [P(s1, z0, d0), P(s1, z0, d1), P(s1, z1, d1), P(s1, z1, d0)], F.u)
  face(p, [P(s0, z1, d0), P(s1, z1, d0), P(s1, z1, d1), P(s0, z1, d1)], [0, 0, 1])
  if (z0 > 0.01) face(p, [P(s0, z0, d0), P(s1, z0, d0), P(s1, z0, d1), P(s0, z0, d1)], [0, 0, -1])
}
/** The part of a ring on one side of a horizontal line. */
function clipY(r: XY[], y: number, keepAbove: boolean): XY[] {
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const ia = keepAbove ? a[1] >= y : a[1] <= y, ib = keepAbove ? b[1] >= y : b[1] <= y
    if (ia) out.push(a)
    if (ia !== ib) { const t = (y - a[1]) / (b[1] - a[1]); out.push([a[0] + t * (b[0] - a[0]), y]) }
  }
  return out
}

// ---------------------------------------------------------------------------
// The two halls (lidar heights).
// ---------------------------------------------------------------------------
prism({ wall, win: null, roof, ring: clipY(ring, SPLIT, true), z0: 0, z1: FRONT_ROOF, facade: null, bevel: 0 })
prism({ wall, win: null, roof, ring: clipY(ring, SPLIT, false), z0: 0, z1: BACK_ROOF, facade: null, bevel: 0 })

// ---------------------------------------------------------------------------
// The Surf Avenue front: the lit open front, the pink sign board in its
// yellow bulb frame across the full width, the red BUMPER CARS pier.
// ---------------------------------------------------------------------------
const F = along(NE, NW) // seen from Surf Avenue, east on the left
slab(glaze, F, 1.2, F.L - 0.5, 0.0, BOARD0 - 0.1, 0.0, 0.08)
slab(yellow, F, 0.0, F.L, BOARD0 - 0.25, BOARD1 + 0.25, 0.0, 0.45)
slab(pink, F, 0.35, F.L - 0.35, BOARD0, BOARD1, 0.3, 0.6)
// The yellow frame's bulb bands, standing proud of the pink across the
// board, top and bottom, and a middle band as on the 2008 photo.
for (const z of [BOARD0 + 0.25, (BOARD0 + BOARD1) / 2, BOARD1 - 0.25]) slab(yellow, F, 0.35, F.L - 0.35, z - 0.14, z + 0.14, 0.55, 0.72)
// The east pier, red with its white BUMPER CARS (lettering left off).
slab(red, F, 0.0, 1.1, 0.0, BOARD0 - 0.25, 0.0, 0.2)

finishModel('Eldorado Auto Skooter, Coney Island', 'nyc-eldorado-auto-skooter', [
  { part: wall, material: PALETTE.stone },
  { part: roof, material: PALETTE.roof },
  { part: pink, material: finish('neon-eldorado-pink', 0xd9558f) },
  { part: yellow, material: finish('neon-eldorado-yellow', 0xe3c03c) },
  { part: red, material: finish('neon-eldorado-red', 0xc23a33) },
  { part: glaze, material: PALETTE.window },
], { bearing: 0, osm: 'way/405892190', height: BOARD1 + 0.25 })
