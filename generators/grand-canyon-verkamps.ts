/**
 * Verkamp's Curio Store (now Verkamp's Visitor Center), Grand Canyon
 * Village, South Rim (1906, Frederick Hamilton Hard and others for John
 * Verkamp) — original procedural geometry, CC0-1.0.
 * bun generators/grand-canyon-verkamps.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of OSM way/144433047 (-112.135698, 36.057630).
 * Bearing 344.3: the model's +y points to the rim (the arcaded front), +x
 * along the front (74.3°). Geometry follows the lidar, which puts the
 * building about 1.5 m east of the OSM square and 2 m deeper.
 *
 * Identity: a dark brown shingle-clad store in stepped flat-roofed blocks
 * with white copings: the one-storey arcade across the rim front (four
 * round arches and the arched entry), the second storey set back over it
 * with the timber pergola above the door, a three-storey block rising
 * behind, lower blocks at the back; a sandstone base where the ground
 * falls away to the west. (The 1906 store had a gabled front; the building
 * today, and this model, is flat-roofed.)
 *
 * Evidence:
 *  - plan: OSM way/144433047 (18.5 × 18.1 m); USGS 3DEP lidar
 *    AZ_GrandCanyonNP_1_2019 (0.5 m grid) for every block.
 *  - heights (measured, lidar, z above the lowest ground, on the west side
 *    at 2125 m): arcade front 6.2, second storey 7.4, three-storey block
 *    10.3, back blocks 9.8 and 7. Ground rises about 1.5 m to the front and
 *    2 m to the east; the walls run down to z 0 and sink in there.
 *  - arches, windows, pergola, stone base: estimated from the photos.
 *  - colour (photos, pulled light): dark brown shingles, white copings and
 *    window frames, tan sandstone.
 *
 * Photos (Wikimedia Commons, evidence): Verkamp's_Curio_Store.jpg —
 * Upstateherd, CC BY-SA 4.0; 0048_Verkamps_Visitor_Center_Grand_Canyon_NP_
 * (5575458581).jpg and 0546_0113_Verkamp's_Visitor_Center_(4761248791).jpg
 * — Grand Canyon National Park, CC BY 2.0. No look-only sources. No
 * commercial imagery.
 *
 * Doubts: the back (south) and east faces are drawn from lidar only; the
 * outside stair and the signs are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, onWall, rect, save, type XY } from './chi-museum-of-science-industry'
import { face, parapet, post, prism, windowRow } from './grand-canyon-el-tovar'

const shingle = new Part(), stone = new Part(), trim = new Part(), roof = new Part(), win = new Part()

type Box = [number, number, number, number, number]
const blocks: Box[] = [
  [-6.5, 10.5, 6.5, 10.5, 6.2],   // arcade front
  [-6.5, 10.5, 1, 6.5, 7.4],      // second storey
  [-6.5, 10.5, -5.5, 1, 10.3],    // three-storey block
  [-3.5, 6.5, -11.5, -5.5, 9.8],  // back
  [6.5, 10.5, -11.5, -5.5, 7.0],
  [10.5, 13, -11, -3, 7.0],       // east annex
]
prism(stone, rect(-6.6, -11.6, 10.6, 10.6), 0, 1.8, null)
prism(stone, rect(-3.6, -11.6, 13.1, -5.4), 0, 1.8, null)
for (const [x0, x1, y0, y1, h] of blocks) {
  const r = rect(x0, y0, x1, y1)
  prism(shingle, r, 1.8, h - 0.25, null)
  cap(roof, r, h - 0.25)
  parapet(trim, rect(x0 - 0.12, y0 - 0.12, x1 + 0.12, y1 + 0.12), h - 0.25, h + 0.05, 0.3)
}

/** A round-headed opening on wall a→b: jambs s ± w/2 from z0, springing at zs. */
function arch(p: Part, a: XY, b: XY, s: number, w: number, z0: number, zs: number) {
  const { n, P } = onWall(a, b)
  const N: V3 = [n[0], n[1], 0], r = w / 2, o = 0.07
  face(p, [P(s - r, z0, o), P(s + r, z0, o), P(s + r, zs, o), P(s - r, zs, o)], N)
  const seg = 10
  for (let k = 0; k < seg; k++) {
    const t0 = (k * Math.PI) / seg, t1 = ((k + 1) * Math.PI) / seg
    face(p, [P(s, zs, o), P(s + r * Math.cos(t0), zs + r * Math.sin(t0), o), P(s + r * Math.cos(t1), zs + r * Math.sin(t1), o)], N)
  }
}
// The rim front: four arches and the arched entry in the middle.
const F: [XY, XY] = [[10.5, 10.5], [-6.5, 10.5]]
for (const s of [1.9, 5.1, 11.9, 15.1]) arch(win, ...F, s, 2.6, 2.3, 3.9)
arch(win, ...F, 8.5, 2.2, 1.5, 4.1)
// White sill band under the arches.
face(trim, [[10.5, 10.58, 2.15], [-6.5, 10.58, 2.15], [-6.5, 10.58, 2.35], [10.5, 10.58, 2.35]], [0, 1, 0])
// Second storey: windows over the arcade.
windowRow(win, [10.5, 6.5], [-6.5, 6.5], [[6.4, 7.0]], 1.4, 3.4, 2.5, 14.5)
windowRow(win, [10.5, 1], [-6.5, 1], [[8.3, 9.4]], 1.3, 4.5, 3.5, 13.5)
// West side: big shop windows, the side arch, the tower's windows.
arch(win, [-6.5, 10.5], [-6.5, 6.5], 2.0, 2.2, 2.6, 4.4)
windowRow(win, [-6.5, 6.5], [-6.5, -11.5], [[3.0, 4.4]], 1.8, 3.0, 1.6, 7.4)
windowRow(win, [-6.5, 6.5], [-6.5, -11.5], [[8.0, 9.3]], 1.3, 3.0, 8.6, 8.6)
windowRow(win, [-3.5, -5.5], [-3.5, -11.5], [[5.0, 6.0], [7.5, 8.5]], 1.2, 3.0, 2.5, 3.5)
// East side and back.
windowRow(win, [10.5, -5.5], [10.5, 10.5], [[3.6, 4.8], [8.0, 9.2]], 1.3, 3.4, 8, 14)
windowRow(win, [13, -11], [13, -3], [[3.6, 4.8]], 1.3, 3.0, 2, 6)
windowRow(win, [-3.5, -11.5], [6.5, -11.5], [[3.6, 4.8], [6.8, 8.0]], 1.3, 3.0, 2.5, 7.5)

// The pergola over the entry on the second-storey roof.
const wood = shingle
for (const [x, y] of [[1.2, 2.0], [4.2, 2.0], [1.2, 6.8], [4.2, 6.8]] as XY[]) post(wood, x, y, 7.15, 9.2, 0.13)
prism(wood, rect(0.9, 1.8, 1.4, 7.4), 9.2, 9.5)
prism(wood, rect(4.0, 1.8, 4.5, 7.4), 9.2, 9.5)
for (const y of [2.2, 3.4, 4.6, 5.8, 7.0]) prism(wood, rect(0.6, y - 0.1, 4.8, y + 0.1), 9.5, 9.7)

await save('grand-canyon-verkamps', "Verkamp's", [
  { part: shingle, material: finish('verkamps-shingle', 0x6c5b4e) },
  { part: stone, material: finish('verkamps-sandstone', 0xcdb08e) },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
], { height: 10.3 })
