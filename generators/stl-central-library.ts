/**
 * St. Louis Central Public Library, 1301 Olive St (1907–1912; Cass Gilbert)
 * — original procedural geometry, CC0-1.0.
 * bun generators/stl-central-library.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 14.9, the building's own axis: -y is the Olive St
 * front with the entrance stairs. Anchor = the centroid of the outer ring of
 * OSM relation/18049260, -90.1994667, 38.6307616.
 *
 * Identity (from the photos below):
 *  1. A long pale granite block on a rusticated base, its main floor a
 *     row of tall round-arched windows in arched surrounds, an attic of
 *     small square windows over a deep modillion cornice, a low hipped
 *     tile roof behind a parapet.                                 (p1, p3)
 *  2. The centre of the Olive St front: three tall arched doorways in a
 *     taller attic block, reached by a broad flight of steps.          (p1)
 *  3. End pavilions with a single great arched panel (an inscription)
 *     and a raised attic over each corner; balustraded terraces and
 *     stairs along the sides.                                          (p3)
 *  4. The reading-room block in the middle, standing over the ranges,
 *     between light courts.                                    (lidar, OSM)
 *
 * Plan: OSM relation/18049260 (outer way/108704951 and five courts) turned
 * to bearing 14.9: the block x ±36.7, y -28 to 28, the corner pavilions
 * projecting to x ±39.6 for y -25..-17.4, the entrance x ±10 out to y -32,
 * the north wing x ±22 to y 31.3. The courts are drawn as the lidar shows
 * them, as wells x ±(15.7..24), y -14..17.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018 (flown 2017),
 * 1 m grid with class 18 kept, measured from the pavement round the
 * building (4.7 m over the box's ground_min). y = 0 is 4.6 m lower, the
 * bottom of the areaway and of the Mapterhorn dip the footprint takes in
 * (the terrain check puts the base there), so the model stands on a 4.6 m
 * plinth and every height below is +4.6 in the GLB. Measured: the
 * ranges' parapets 16.4, their roof ridges 17.8, the corner pavilions'
 * attics 18.5, the centre (reading room and the entrance attic) 21.3 at its
 * ridge, the light courts' floors 7.3, the entrance landing 3.5 (the
 * stairs at 0.3–3.5).
 * Estimated from p1 and p3: the base (to 4.2), the main floor's arched
 * windows (1.9 m wide, sill 5.2, springing 9.4), the cornice (12.4–13.6),
 * the attic windows, the entrance arches (2.6 m wide, to 10.2), the end
 * panels, the terraces (3.0 m, balustrades left out).
 * Left out: the carved names, the medallions, the balustrades, the lamps.
 *
 * Night: the Olive St front is floodlit; windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  p1  "STLCentrallibrary.jpg", Garfield226, CC BY-SA 3.0 (the Olive St front)
 *  p2  "St. Louis Central Public Library, Olive Street, St. Louis, MO.jpg", w_lemay, CC BY-SA 2.0
 *  p3  "St. Louis Central Public Library, Olive Street, St. Louis, MO - 53125463731.jpg", w_lemay,
 *      CC BY-SA 2.0 (the south-east corner pavilion and the east side)
 *  p4  "St. Louis Central Public Library, Olive Street, St. Louis, MO - 53125949663.jpg", w_lemay, CC BY-SA 2.0
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, cornice, hipRoof, onWall, rectShape, save, type XY } from './atl-tech-tower'
import { edgePanels } from './atl-flatiron-building'

const gran = new Part(), win = new Part(), tile = new Part(), door = new Part()
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const faces = (x0: number, x1: number, y0: number, y1: number): [XY, XY][] => [[[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]]]
const BASE = 4.2, COR = 12.4, PAR = 16.4, RIDGE = 17.8

// a range: the block to the parapet, a cornice, a low hipped roof
function range(x0: number, x1: number, y0: number, y1: number, top = PAR, ridge = RIDGE) {
  box(gran, x0, x1, y0, y1, 0, top, null, 0)
  cornice(gran, rect(x0, x1, y0, y1), COR, 1.2, 0.7, null)
  cornice(gran, rect(x0, x1, y0, y1), BASE - 0.5, 0.5, 0.2, null)
  hipRoof(tile, x0 + 0.6, x1 - 0.6, y0 + 0.6, y1 - 0.6, top, ridge, 0)
}
/** Main-floor arched windows and attic windows along a face, `n` bays. */
function bays(a: XY, b: XY, n: number, skip: (k: number) => boolean = () => false) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), w = L / n
  for (let k = 0; k < n; k++) {
    if (skip(k)) continue
    const c = (k + 0.5) * w
    onWall(gran, a, b, archShape(c, 2.9, 4.8, 9.4, 10), 0.08) // the arched surround
    onWall(win, a, b, archShape(c, 1.9, 5.2, 9.4, 10), 0.12)
    onWall(win, a, b, rectShape(c - 0.6, c + 0.6, 14.3, 15.6), 0.06) // attic
    onWall(win, a, b, rectShape(c - 0.6, c + 0.6, 1.2, 3.2), 0.06) // base
  }
}

// ── The ranges round the courts ──
range(-36.7, 36.7, -28.3, -14.0) // the Olive St range
range(-36.7, -24.2, -14.0, 28.0) // west range
range(24.1, 36.7, -14.0, 28.0) // east range
range(-36.7, 36.7, 17.0, 28.0) // the north range
range(-22.1, 22.1, 28.0, 31.3, PAR, RIDGE - 0.6) // the north wing's projection
// the reading-room block between the courts, standing over the ranges
range(-15.7, 15.7, -14.0, 17.0, 19.6, 21.3)
// the court floors (wells to 7.3)
for (const [x0, x1] of [[-24.2, -15.7], [15.7, 24.1]]) box(gran, x0, x1, -14.0, 17.0, 0, 7.3, tile, 0)

// ── The corner pavilions of the Olive St front: a raised attic, a great arched panel ──
for (const s of [-1, 1]) {
  const x0 = s < 0 ? -39.6 : 26.4, x1 = s < 0 ? -26.4 : 39.6
  box(gran, x0, x1, -28.6, -13.9, 0, 18.5, null, 0)
  cornice(gran, rect(x0, x1, -28.6, -13.9), COR, 1.2, 0.7, null)
  cornice(gran, rect(x0, x1, -28.6, -13.9), 18.5 - 0.6, 0.6, 0.3, tile)
  const end: [XY, XY] = s < 0 ? [[-39.6, -13.9], [-39.6, -28.6]] : [[39.6, -28.6], [39.6, -13.9]]
  onWall(gran, end[0], end[1], archShape(7.35, 5.0, 4.8, 10.0, 12), 0.08)
  onWall(win, end[0], end[1], archShape(7.35, 3.8, 5.2, 10.0, 12), 0.12)
  for (const d of [-1.2, 0, 1.2]) onWall(win, end[0], end[1], rectShape(7.35 + d - 0.45, 7.35 + d + 0.45, 14.8, 16.8), 0.06)
  // the pavilion's Olive St face: two arched bays
  bays([x0, -28.6], [x1, -28.6], 2)
}
// the Olive St range between the pavilions and the entrance: four bays a side
bays([-26.4, -28.3], [-10.1, -28.3], 4)
bays([10.1, -28.3], [26.4, -28.3], 4)
// the long sides: seven bays north of the pavilions; the north front
bays([36.7, -13.9], [36.7, 28.0], 7)
bays([-36.7, 28.0], [-36.7, -13.9], 7)
bays([36.7, 28.0], [22.1, 28.0], 2)
bays([-22.1, 28.0], [-36.7, 28.0], 2)
edgePanels(win, [22.1, 31.3], [-22.1, 31.3], 5.2, 15.6, { group: 4.4, gap: 1.2, bay: 4.4, pier: 1.8, margin: 1.4, out: 0.06 })

// ── The entrance: a taller attic block, three arched doorways, the stairs ──
box(gran, -10.1, 10.1, -32.1, -28.0, 0, 21.0, null, 0)
cornice(gran, rect(-10.1, 10.1, -32.1, -28.0), COR, 1.2, 0.7, null)
cornice(gran, rect(-10.1, 10.1, -32.1, -28.0), 20.4, 0.6, 0.3, tile)
{
  const a: XY = [-10.1, -32.1], b: XY = [10.1, -32.1], L = 20.2
  for (const d of [-4.6, 0, 4.6]) {
    onWall(gran, a, b, archShape(L / 2 + d, 3.6, 3.5, 9.3, 12), 0.08)
    onWall(door, a, b, archShape(L / 2 + d, 2.6, 3.5, 9.3, 12), 0.12)
    onWall(win, a, b, rectShape(L / 2 + d - 0.8, L / 2 + d + 0.8, 14.8, 16.0), 0.06)
  }
  onWall(gran, a, b, rectShape(1.6, L - 1.6, 17.0, 19.6), 0.1) // the inscription panel
}
for (let k = 0; k < 8; k++) {
  const y0 = -32.1 - 6.4 + k * 0.8
  box(gran, -12.5 + k * 0.2, 12.5 - k * 0.2, y0, -32.1, 0, 0.44 * (k + 1), gran, 0.02)
}
// side terraces along the Olive St front
for (const s of [-1, 1]) box(gran, s < 0 ? -26.4 : 10.1, s < 0 ? -10.1 : 26.4, -31.0, -28.3, 0, 3.0, gran, 0.05)

// ── Lift onto the street: everything above was built from the pavement; y = 0
// is the bottom of the areaway the footprint takes in (lidar ground_min, the
// map's terrain too), 4.6 m below. A plain granite plinth fills the gap.
const G = 4.6
for (const part of [gran, win, tile, door]) for (let i = 1; i < part.pos.length; i += 3) part.pos[i] += G
box(gran, -39.6, 39.6, -32.1, 31.3, 0, G, null, 0)
for (let k = 0; k < 8; k++) box(gran, -12.5 + k * 0.2, 12.5 - k * 0.2, -38.5 - 6 + k * 0.8, -32.1, 0, G - 0.2, gran, 0)

const lit = (p: V3, n: V3) => (n[1] < -0.7 && n[2] < 0.5 ? 0.85 : n[2] > 0.8 ? 0 : 0.3)
await save('stl-central-library', 'St. Louis Central Public Library', [
  { part: gran, material: { ...finish('stl-library-granite', 0xe9e6de), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: tile, material: PALETTE.roof },
  { part: door, material: finish('stl-library-bronze', 0x4f5a52) },
], { height: 21.3 + 4.6, anchor: [38.6307616, -90.1994667], bearing: 14.9 }, 6500)
