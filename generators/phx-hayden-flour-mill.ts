/**
 * Hayden Flour Mill, Tempe, Arizona (1918 concrete mill on the site of
 * Charles Trumbull Hayden's 1874 mill) — original procedural geometry,
 * CC0-1.0. The grain silos beside it stand apart (about 20 m east, not
 * touching) and are their own model, phx-hayden-flour-mill-silos.
 * bun generators/phx-hayden-flour-mill.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * centroid of OSM way/544822355 (-111.9395548, 33.4289801). Bearing 0.
 *
 * Identity (from the photos below):
 *  1. A tall, plain whitewashed concrete block, its north end the highest,
 *     stepping down in two stages to a long lower wing to the south. (o3)
 *  2. Small punched windows, irregular on the tall block and in regular
 *     rows on the lower wing; a darker grey ground storey; the ghost of a
 *     painted "Hayden's Flour" sign high on the north wall.      (o3, ht1)
 *  3. The site falls to Mill Avenue on the west: the east side stands on a
 *     yard about 3.7 m higher, at the foot of Tempe Butte.   (lidar, o3)
 *
 * Plan: OSM way/544822355, matching the lidar footprint. Heights: USGS 3DEP
 * lidar AZ_MaricopaPinal_1_2020 (flown 2020), 0.5 m grid. y = 0 is the
 * lowest ground under the footprint, the Mill Avenue side at 355.05 m; the
 * east yard is 3.7 m higher. Measured: the north block's roof 20.5 (from
 * y 4.5 north), the middle step 17.0 (y -1 to 4.5), the south wing 12.0;
 * the low north-east annex 4.5. OSM's height tag (17.2) is a mean.
 *
 * Estimated: storey lines and windows (from o3: 3.4 m storeys, the tall
 * block six storeys), window sizes and counts; the sign panel's place;
 * the parapets. Left out: the rooftop railings and fire escapes.
 *
 * Photos (evidence, Wikimedia Commons):
 *  o3   "Hayden Flour Mill Tempe 03.jpg", Olaf2, CC BY-SA 4.0 (from the
 *       north-west: north and west faces, silos behind)
 *       https://commons.wikimedia.org/wiki/File:Hayden_Flour_Mill_Tempe_03.jpg
 *  ht1  "231029-1 Hayden Flour Mill.jpg", Hunter Trick (TrickHunter),
 *       CC BY-SA 4.0 (from across Tempe Town Lake, with the silos)
 *       https://commons.wikimedia.org/wiki/File:231029-1_Hayden_Flour_Mill.jpg
 *  o1   "Hayden Flour Mill Tempe 01.jpg", Olaf2, CC BY-SA 4.0 (the silos
 *       from Tempe Butte)
 *       https://commons.wikimedia.org/wiki/File:Hayden_Flour_Mill_Tempe_01.jpg
 * USGS NAIP orthophoto (public domain; it predates the site's 2019 work).
 * No look-only sources. No commercial imagery.
 *
 * Terrain: the walls run down to y = 0 on the east too, into the yard, and
 * the east faces' windows start at the yard's height. Elevation 0.
 * Night: windows glow; the walls are floodlit faintly, as now.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ccw, prism, save, type XY } from './atl-flatiron-building'

const wallP = new Part(), base = new Part(), win = new Part(), roofP = new Part()

function face(p: Part, q: V3[], want: V3) {
  const b = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], c = [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]]
  const g = [b[1] * c[2] - b[2] * c[1], b[2] * c[0] - b[0] * c[2], b[0] * c[1] - b[1] * c[0]]
  const r = g[0] * want[0] + g[1] * want[1] + g[2] * want[2] < 0 ? [...q].reverse() : q
  if (r.length === 3) p.tri(r[0], r[1], r[2])
  else p.quad(r[0], r[1], r[2], r[3])
}
/** A rectangle on an axis-aligned wall: side 'w','e','n','s' at coordinate c, from s0..s1 along it, z0..z1. */
function onWall(p: Part, side: 'w' | 'e' | 'n' | 's', c: number, s0: number, s1: number, z0: number, z1: number, out = 0.06) {
  const o = side === 'w' || side === 's' ? -out : out
  if (side === 'w' || side === 'e') face(p, [[c + o, s0, z0], [c + o, s1, z0], [c + o, s1, z1], [c + o, s0, z1]], [o, 0, 0])
  else face(p, [[s0, c + o, z0], [s1, c + o, z0], [s1, c + o, z1], [s0, c + o, z1]], [0, o, 0])
}
/** A block with a grey ground storey, white walls above, a low parapet and a flat roof. */
function block(x0: number, x1: number, y0: number, y1: number, top: number) {
  const ring: XY[] = ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
  prism(base, ring, 0, 3.0, null, 0)
  prism(wallP, ring, 3.0, top, null, 0)
  // parapet: a 0.35 m wall round a roof 0.8 m down
  const inner: XY[] = ccw([[x0 + 0.35, y0 + 0.35], [x1 - 0.35, y0 + 0.35], [x1 - 0.35, y1 - 0.35], [x0 + 0.35, y1 - 0.35]])
  prism(roofP, inner, top - 0.8, top - 0.8 + 0.01, roofP, 0)
  for (let i = 0; i < 4; i++) {
    const a = ring[i], b = ring[(i + 1) % 4], ia = inner[i], ib = inner[(i + 1) % 4]
    face(wallP, [[ia[0], ia[1], top - 0.8], [ib[0], ib[1], top - 0.8], [ib[0], ib[1], top], [ia[0], ia[1], top]], [(ia[0] + ib[0]) / 2 - (x0 + x1) / 2, (ia[1] + ib[1]) / 2 - (y0 + y1) / 2, 0].map((v) => -v) as V3)
    face(wallP, [[a[0], a[1], top], [b[0], b[1], top], [ib[0], ib[1], top], [ia[0], ia[1], top]], [0, 0, 1])
  }
}

const X0 = -14.9, X1 = 0.3 // the mill's west and east walls (OSM)
const YARD = 3.7 // the east yard's height above y = 0
block(X0, X1, 4.5, 22.6, 20.5) // the tall north block
block(X0, X1, -1, 4.5, 17.0) // the middle step
block(X0, X1, -19.3, -1, 12.0) // the long south wing
// the north-east annex: a low loading block on the east yard
prism(base, ccw([[X1, 11.5], [6.45, 11.5], [6.45, 16.5], [X1, 16.5]]), 0, 4.5, roofP, 0.15)

// ── windows ──
const W = (side: 'w' | 'e' | 'n' | 's', c: number, centres: number[], w: number, z0: number, z1: number) => centres.forEach((s) => onWall(win, side, c, s - w / 2, s + w / 2, z0, z1))
const span = (a: number, b: number, n: number) => Array.from({ length: n }, (_, i) => a + ((b - a) * (i + 0.5)) / n)
// south wing, west face: three storeys of regular windows (o3, right)
for (const z of [1.0, 4.6, 8.0]) W('w', X0, span(-19.3, -1, 8), 1.1, z, z + 1.9)
// middle step, west face: four storeys of pairs
for (const z of [4.6, 8.0, 11.4, 14.4]) W('w', X0, span(-1, 4.5, 2), 1.0, z, z + 1.7)
// tall block, west face: irregular, three bays (o3)
for (const z of [4.6, 8.0, 11.4]) W('w', X0, [9.5, 13.5], 1.2, z, z + 2.1)
for (const z of [14.8, 17.6]) W('w', X0, [8, 11], 0.8, z, z + 1.0)
// tall block, north face: two small openings high up, two doors at the foot
W('n', 22.6, [-10.5], 0.9, 17.4, 18.8)
W('n', 22.6, [-11.8, -7.3], 1.6, 0, 2.6)
// the painted sign's ghost: a grey panel high on the north wall
onWall(base, 'n', 22.6, -9.2, -3.2, 11.5, 17.2, 0.04)
// the east faces, above the yard
for (const z of [YARD + 1.0, YARD + 4.2]) W('e', X1, span(-19.3, -1, 6), 1.1, z, z + 1.8)
for (const z of [YARD + 1.0, YARD + 4.4, YARD + 7.8, YARD + 11.2]) W('e', X1, [6.5, 20], 1.1, z, z + 1.9)
// the south end
for (const z of [1.0, 4.6, 8.0]) W('s', -19.3, [-11.5, -7.3, -3.2], 1.1, z, z + 1.9)

await save('phx-hayden-flour-mill', 'Hayden Flour Mill', [
  { part: wallP, material: { ...finish('hayden-whitewash', 0xe7e6e0), floodlight: (_p, n) => (n[2] < 0.5 ? 0.35 : 0) } },
  { part: base, material: finish('hayden-grey', 0xb7b4ad) },
  { part: win, material: { ...PALETTE.window, color: 0x5f6870 } },
  { part: roofP, material: PALETTE.roof },
], { height: 20.5, anchor: [33.4289801, -111.9395548], bearing: 0 }, 5000)
