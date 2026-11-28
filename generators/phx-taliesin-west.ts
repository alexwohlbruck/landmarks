/**
 * Taliesin West, Scottsdale, Arizona (Frank Lloyd Wright, from 1937) —
 * original procedural geometry, CC0-1.0.
 * bun generators/phx-taliesin-west.ts
 *
 * Map frame: x along the main axis (bearing 124.3, to the south-east),
 * y across it (bearing 34.3, to the north-east, up the hill), z up, metres.
 * Origin on the ground at the area centroid of the main building's OSM
 * ways (-111.845123, 33.606322). Bearing 34.3 (the drafting studio's walls
 * run at 124.3 / 34.3 in OSM).
 *
 * What is drawn: the main building, one continuous run of desert-masonry
 * walls and redwood-and-canvas roofs from the drafting studio at the
 * north-west to Wright's quarters at the south-east (OSM ways, all touching):
 * 1498897839 Drafting Studio, 1498906503 its pergola, 1498902780 and
 * 1498910891 (the kitchen and dining block), 1498902779 Breezeway,
 * 1498902781 Dining Cove, 1498906504, 1498906505 Kiva, 1498902778 (the
 * living wing), 1498897834 Garden Room, 1498902782, 1498897833.
 * Left to the map: 905468509 (the apprentice wing north of the kiva, a
 * separate outline 1.4 m away), the Cabaret 905468508 (20 m away), Wright's
 * Office 1498886747 (13 m away), the store and the outlying sheds. The
 * triangular terrace and pool in front of the studio are lawn, paving and
 * water at ground level, so they are the map's (STYLE.md, Ground).
 *
 * Identity (photos below):
 *  1. The drafting studio: a low battered rubble-stone base under a row of
 *     Cherokee-red redwood frames that slope down to the south-west, with
 *     white translucent panels between them.              (swpano, south)
 *  2. Desert masonry: battered walls of desert stones set in concrete,
 *     ochre with orange and violet stones.            (2010, swpano, south)
 *  3. The long, low centre with red fascias and a clerestory band, the
 *     tall stone pylon at the entrance and the red angled bell tower top
 *     rising over the roofs.                            (south, swpano, fowler)
 *  4. The garden room and the south-east wing with their own sloping
 *     red-framed canvas roofs.                                 (fowler, 2010)
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020), 0.5 m grid
 * read in this frame, above ground_min 484.64; the model's base G0 = 2.0
 * (the lowest ground under the footprint, at the south-east end). Measured
 * (lidar, above 484.64): studio roof 6.2 at its south-west edge rising to
 * 8.6 at the north-east; the pergola 6.8–7.0; the kitchen/dining block 6.5
 * in front and 9.2 behind; the stone pylon 9.6; the breezeway roof 9.1; the
 * dining cove 7.2–7.7; the kiva 7.4; the bell tower 12.2; the living wing
 * 6.6–7.8 with a raised part to 10.8; the garden room 5.5–7.5; the
 * south-east wing 7–8. Ground: 5.5 north of the studio, 3.3 on the terrace
 * south-west of it, 2–3 at the south-east end. A 13.9 blob over the
 * south-east wing is a tree (NAIP), not drawn.
 * Estimated: the stone base heights (photos: about 1.5 m of stone under the
 * studio frames on the terrace side); the frame spacing (about 3.3 m, ten
 * frames over the studio, from swpano); the clerestory band; the bell
 * tower's angled top (from the south photo).
 *
 * Photos (evidence, Wikimedia Commons):
 *  swpano "SW Main Building Pano Taliesin West Mar23 R16 07189-90 Pano.jpg",
 *         Timothy A. Gonsa, CC BY-SA 4.0
 *         https://commons.wikimedia.org/wiki/File:SW_Main_Building_Pano_Taliesin_West_Mar23_R16_07189-90_Pano.jpg
 *  south  "Taliesin West, view of the southside.jpg", Bigmacthealmanac, CC0
 *         https://commons.wikimedia.org/wiki/File:Taliesin_West,_view_of_the_southside.jpg
 *  fowler "Taliesin West (4297337555).jpg", John Fowler, CC BY 2.0
 *         https://commons.wikimedia.org/wiki/File:Taliesin_West_(4297337555).jpg
 *  2010   "TaliesinWest2010.JPG", AndrewHorne, public domain
 *         https://commons.wikimedia.org/wiki/File:TaliesinWest2010.JPG
 * USGS NAIP orthophoto (public domain) for the plan and roof colours.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the north-east (uphill) side is unphotographed here and drawn
 * plain; the living wing's and south-east wing's roofs are simplified to
 * flat red-edged roofs and one canvas slope; OSM's building:part split of
 * the centre is followed loosely. Elevation 0: the uphill walls sink into
 * the slope.
 *
 * Night: the canvas roofs glow (window-2), as the studio does lit from
 * inside; the window bands glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { capPoly, ccw, prism, save, type XY } from './atl-flatiron-building'

const stone = new Part(), red = new Part(), canvas = new Part(), win = new Part(), roof = new Part()
const G0 = 2.0
const h = (H: number) => H - G0 // lidar height above 484.64 to model z

function face(p: Part, q: V3[], want: V3) {
  const b = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], c = [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]]
  const g = [b[1] * c[2] - b[2] * c[1], b[2] * c[0] - b[0] * c[2], b[0] * c[1] - b[1] * c[0]]
  const r = g[0] * want[0] + g[1] * want[1] + g[2] * want[2] < 0 ? [...q].reverse() : q
  if (r.length === 3) p.tri(r[0], r[1], r[2])
  else p.quad(r[0], r[1], r[2], r[3])
}

/** A battered (inward-leaning) stone mass: the top inset by `bat`. */
function battered(p: Part, x0: number, x1: number, y0: number, y1: number, z1: number, bat = 0.35, top: Part | null = p) {
  const B: V3[] = [[x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0]]
  const T: V3[] = [[x0 + bat, y0 + bat, z1], [x1 - bat, y0 + bat, z1], [x1 - bat, y1 - bat, z1], [x0 + bat, y1 - bat, z1]]
  const out: V3[] = [[0, -1, 0], [1, 0, 0], [0, 1, 0], [-1, 0, 0]]
  for (let i = 0; i < 4; i++) face(p, [B[i], B[(i + 1) % 4], T[(i + 1) % 4], T[i]], out[i])
  if (top) face(top, T, [0, 0, 1])
}

/** A box beam between two points (along its length), w wide and d deep. */
function beam(p: Part, a: V3, b: V3, w: number, d: number) {
  const L: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const ll = Math.hypot(...L)
  const t: V3 = [L[0] / ll, L[1] / ll, L[2] / ll]
  // side vector: horizontal, perpendicular to the beam
  let s: V3 = [-t[1], t[0], 0]
  const sl = Math.hypot(...s) || 1
  s = sl < 1e-6 ? [1, 0, 0] : [s[0] / sl, s[1] / sl, 0]
  const u: V3 = [s[1] * t[2] - s[2] * t[1], s[2] * t[0] - s[0] * t[2], s[0] * t[1] - s[1] * t[0]]
  const P = (q: V3, i: number, j: number): V3 => [q[0] + s[0] * w / 2 * i + u[0] * d / 2 * j, q[1] + s[1] * w / 2 * i + u[1] * d / 2 * j, q[2] + s[2] * w / 2 * i + u[2] * d / 2 * j]
  const cs: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  for (let k = 0; k < 4; k++) {
    const [i0, j0] = cs[k], [i1, j1] = cs[(k + 1) % 4]
    const n: V3 = [s[0] * (i0 + i1) + u[0] * (j0 + j1), s[1] * (i0 + i1) + u[1] * (j0 + j1), s[2] * (i0 + i1) + u[2] * (j0 + j1)]
    face(p, [P(a, i0, j0), P(a, i1, j1), P(b, i1, j1), P(b, i0, j0)], n)
  }
  face(p, cs.map(([i, j]) => P(a, i, j)), [-t[0], -t[1], -t[2]])
  face(p, cs.map(([i, j]) => P(b, i, j)), t)
}

/** A flat roof slab with a red fascia edge, z0..z1, overhanging by `o`. */
function flatRoof(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, o = 0.6) {
  prism(red, [[x0 - o, y0 - o], [x1 + o, y0 - o], [x1 + o, y1 + o], [x0 - o, y1 + o]], z0, z1, roof, 0.15, true)
}

/** A flush window band on a wall face at y = yf, facing ny. */
function band(x0: number, x1: number, yf: number, ny: number, z0: number, z1: number) {
  const y = yf + ny * 0.05
  face(win, [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], [0, ny, 0])
}

/**
 * A canvas-and-redwood roof: frames every `step` along x from x0 to x1,
 * sloping from (y0, zl) up to (y1, zh), extended `ext` past each end; white
 * panels between them.
 */
function canvasRoof(x0: number, x1: number, y0: number, y1: number, zl: number, zh: number, n: number, ext = 1.6) {
  const dz = (zh - zl) / (y1 - y0)
  const panel: V3[] = [[x0, y0, zl + 0.05], [x1, y0, zl + 0.05], [x1, y1, zh + 0.05], [x0, y1, zh + 0.05]]
  face(canvas, panel, [0, -dz, 1])
  face(canvas, panel, [0, dz, -1])
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n
    beam(red, [x, y0 - ext, zl - ext * dz + 0.25], [x, y1 + 0.6, zh + 0.6 * dz + 0.3], 0.6, 0.85)
  }
  // the ridge and eaves beams
  beam(red, [x0 - 0.4, y1, zh + 0.15], [x1 + 0.4, y1, zh + 0.15], 0.5, 0.5)
  beam(red, [x0 - 0.4, y0, zl + 0.05], [x1 + 0.4, y0, zl + 0.05], 0.4, 0.4)
}

// ── 1. The drafting studio (x -56.6..-26.8, y -3.3..7.6) ──
// Battered stone base: higher on the uphill north-east side.
battered(stone, -56.6, -26.8, -3.3, -1.6, h(4.9), 0.3, stone) // the south-west wall, ~1.6 m over the terrace
battered(stone, -56.6, -26.8, 5.6, 7.6, h(6.4), 0.3, stone) // the north-east wall
battered(stone, -56.6, -54.6, -1.6, 5.6, h(5.4), 0.3, stone)
// stone piers at each frame on the terrace side
for (let i = 0; i <= 9; i++) {
  const x = -56 + (29 * i) / 9
  battered(stone, x - 0.7, x + 0.7, -4.6, -3.0, h(4.3), 0.25, stone)
}
// the window band under the canvas, and the studio's interior volume
band(-55, -28, -1.6, -1, h(4.9), h(6.0))
prism(stone, [[-56.2, -1.6], [-27.2, -1.6], [-27.2, 5.6], [-56.2, 5.6]], 0, h(5.9), null, 0)
canvasRoof(-56.6, -26.8, -2.4, 7.6, h(6.2), h(8.6), 9)

// ── the pergola north-east of the studio (1498906503) ──
for (let i = 0; i <= 8; i++) {
  const x = -55 + (25.6 * i) / 8
  beam(red, [x, 7.6, h(7.0)], [x, 17.0, h(7.0)], 0.35, 0.45)
}
beam(red, [-55.4, 16.6, h(6.6)], [-28.9, 16.6, h(6.6)], 0.4, 0.45)
for (const x of [-55, -46.5, -38, -29.3]) battered(stone, x - 0.5, x + 0.5, 16.1, 17.1, h(6.4), 0.15, stone)

// ── 2. The kitchen and dining block (1498902780, 1498910891) ──
battered(stone, -26.9, -4.6, -12.8, -1.0, h(6.0), 0.35, null)
flatRoof(-26.9, -4.6, -12.8, -1.0, h(6.1), h(6.7))
battered(stone, -26.9, -4.6, -1.0, 8.1, h(7.0), 0.3, null)
band(-26, -6, -1.0 + 0.3, -1, h(7.0), h(8.4))
prism(stone, [[-26.4, -0.6], [-5.2, -0.6], [-5.2, 7.6], [-26.4, 7.6]], h(7.0), h(8.5), null, 0)
flatRoof(-26.9, -4.6, -1.0, 8.1, h(8.5), h(9.2))
band(-25, -20, -12.8 - 0.05, -1, h(3.4), h(5.6))
band(-15, -7, -12.8 - 0.05, -1, h(3.4), h(5.6))
// the tall stone pylon by the entrance
battered(stone, -6.2, -1.2, -14.4, -8.2, h(9.6), 0.6, stone)

// ── 3. The breezeway (1498902779): a red roof on stone piers ──
for (const [x, y] of [[-4.2, -4.0], [1.6, -4.0], [-4.2, 4.9], [1.6, 4.9]] as XY[]) battered(stone, x - 0.6, x + 0.6, y - 0.6, y + 0.6, h(8.6), 0.15, null)
flatRoof(-4.6, 2.0, -4.4, 5.3, h(8.6), h(9.2), 0.4)

// ── the dining cove (1498902781) ──
battered(stone, 0.2, 10.6, -10.7, 6.1, h(7.0), 0.35, null)
flatRoof(0.2, 10.6, -10.7, 6.1, h(7.0), h(7.6))
band(1, 8, -10.7 - 0.05, -1, h(3.6), h(5.8))

// ── the kiva (1498906505): a windowless stone room ──
battered(stone, 4.9, 15.1, 11.7, 23.3, h(7.4), 0.4, roof)
battered(stone, 12.0, 13.5, 4.4, 11.7, h(7.2), 0.2, roof)

// ── the bell tower: stone shaft, red angled top ──
battered(stone, 13.5, 17.5, 4.4, 9.2, h(10.4), 0.3, null)
{
  const zb = h(10.4), x0 = 13.2, x1 = 17.8, y0 = 4.1, y1 = 9.5, zt = h(12.4)
  // a red roof sloping up to the north-east
  const A: V3 = [x0, y0, zb], B: V3 = [x1, y0, zb], C: V3 = [x1, y1, zt], D: V3 = [x0, y1, zt]
  face(red, [A, B, C, D], [0, -1, 1.5])
  face(red, [A, B, C, D], [0, 1, -1.5])
  face(red, [B, C, [x1, y1, zb]], [1, 0, 0])
  face(red, [A, D, [x0, y1, zb]], [-1, 0, 0])
  face(red, [[x0, y1, zb], [x1, y1, zb], C, D], [0, 1, 0])
}

// ── 4. The living wing (1498902778) and the south-east block (1498902782) ──
battered(stone, 10.6, 42.0, -2.6, 4.4, h(6.6), 0.35, null)
battered(stone, 17.5, 42.0, 4.4, 8.4, h(6.6), 0.3, null)
flatRoof(10.6, 42.0, -2.6, 4.4, h(6.6), h(7.2))
flatRoof(17.5, 42.0, 4.4, 8.4, h(6.6), h(7.2))
band(12, 40, -2.6 - 0.05, -1, h(4.3), h(6.0))
// its raised clerestory
battered(stone, 23.5, 31.5, 0.0, 8.0, h(9.8), 0.2, null)
band(24, 31, 0.2, -1, h(7.6), h(9.4))
flatRoof(23.5, 31.5, 0.0, 8.0, h(9.8), h(10.6), 0.5)
battered(stone, 37.0, 55.2, -6.7, 9.0, h(6.9), 0.35, null)
flatRoof(37.0, 55.2, -6.7, 9.0, h(6.9), h(7.6))
band(38, 52, -6.7 - 0.05, -1, h(3.2), h(5.4))

// ── the garden room (1498897834) and the south-east wing (1498897833) ──
battered(stone, 6.2, 16.2, -20.6, -16.8, h(4.6), 0.3, stone)
battered(stone, 6.2, 16.2, -16.8, -10.7, h(5.4), 0.3, stone)
battered(stone, 8.6, 16.2, -10.7, -5.8, h(6.4), 0.3, stone)
band(7, 15.5, -16.8 - 0.05, -1, h(4.6), h(5.4))
canvasRoof(6.2, 16.2, -19.6, -5.8, h(5.5), h(7.7), 3, 1.2)
battered(stone, 36.9, 56.8, -23.4, -8.5, h(4.9), 0.35, stone)
band(38, 51, -23.4 - 0.05, -1, h(2.6), h(4.6))
canvasRoof(36.9, 56.8, -22.4, -8.5, h(6.2), h(8.0), 6, 1.2)

await save('phx-taliesin-west', 'Taliesin West', [
  { part: stone, material: finish('tw-desert-masonry', 0xc9a98a) },
  { part: red, material: finish('tw-cherokee-red', 0xb25a4c) },
  { part: canvas, material: windowVariant(2, 0xf2ede3) },
  { part: win, material: PALETTE.window },
  { part: roof, material: finish('tw-roof', 0xd8c8b2) },
], { height: h(12.4), anchor: [33.606322, -111.845123], bearing: 34.3 }, 5000)
void ccw; void capPoly
