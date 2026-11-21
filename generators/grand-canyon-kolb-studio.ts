/**
 * Kolb Studio, Grand Canyon Village (South Rim): procedural, CC0-1.0.
 * bun generators/grand-canyon-kolb-studio.ts
 *
 * Emery and Ellsworth Kolb's photographic studio and home at the head of the
 * Bright Angel Trail, built 1904 and enlarged to 1926. What makes it read:
 * - a dark brown shingle-and-log house of several storeys clinging to the
 *   rim, short on the street side and four storeys tall toward the canyon;
 * - stacked front gables on the canyon side and a street gable, under grey
 *   shingle roofs, with cream-trimmed windows;
 * - a red-brown rubble-stone lower storey and a tall stone chimney.
 *
 * Uses the shared kit in grand-canyon-bright-angel-lodge.ts.
 *
 * Frame: x east, y north, z up, metres, bearing 0 (the walls run east-west
 * and north-south). Anchor (-112.142548, 36.057989): the centroid of OSM
 * way/171147866 (Kolb Studio, Q6427106).
 *
 * Plan: OSM for the canyon-side lower storeys (y 1 to 8); USGS 3DEP lidar
 * (AZ_GrandCanyonNP_1_2019, flown 2019, 0.5 m grid) for the main roof, which
 * runs x -18..12, y -9.5..1, about 2 to 5 m south of where the OSM outline
 * puts the house's street side (the OSM outline is narrower than the roof
 * on its west half).
 *
 * Heights above y = 0 = the lowest ground under the footprint (2072.3 m, at
 * the foot of the canyon-side storeys; the street on the south side is
 * about 12 m higher):
 * - main ridge 18.2 m (lidar 39.4 over ground_min 2051.12), its west part
 *   16.2 m (lidar 37.4), the canyon cross-gable ridge 17.6 m (lidar 38.4):
 *   measured; eaves 14.8 m: measured at the roof edges (lidar 35.8-36);
 * - canyon-side lower storeys 8 m: lidar 28-30 over their roofs, measured;
 *   the rubble-stone lowest storey 3.5 m: estimated from photo 0617 08;
 * - chimney 19.5 m: estimated from photo 0617 01 (about a metre over
 *   the street gable's peak).
 *
 * Photos (EVIDENCE):
 * - "4856 Grand Canyon Kolb Studio at Bright Angel Trailhead (2011)",
 *   Grand Canyon NPS, CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:4856_Grand_Canyon_Kolb_Studio_at_Bright_Angel_Trailhead_(2011)_(5676550817).jpg
 *   (canyon side from the trail);
 * - "0617 01 Grand Canyon National Park Kolb Studio (2010)", Grand Canyon
 *   NPS, CC BY 2.0 (street side, gable, chimney, entrance);
 * - "Grand Canyon National Park, Kolb Studio (2006 photo) 0617 08",
 *   "0617 13" and "0237", Grand Canyon NPS, public domain (stone storey,
 *   bay window, porches, cream trim);
 * - "Kolb Studio Replacement Project 2024", Grand Canyon NPS, public domain
 *   (the roofs under replacement, from the street);
 * - "06629F Grand Canyon Historic Aerial of Bright Angel Lodge Area 1976",
 *   Grand Canyon NPS, CC BY 2.0 (the whole house from above).
 *
 * Doubts: the roof colour (the 2024 replacement photos show only the
 * underlayment; the model keeps the weathered cedar of 4856); the west end and the exact spread of the canyon-side porches are
 * simplified; the many small balconies and stairs are dropped.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { at, face, gable, hip, panelAt, panels, post, prism, rect, save, type Frame, type XY } from './grand-canyon-bright-angel-lodge'
import type { V3 } from './mesh'

const wall = new Part(), stone = new Part(), roof = new Part(), trim = new Part(), win = new Part()

/** Cream-framed windows: a trim panel just behind each window panel. */
function framed(A: XY, B: XY, count: number, w: number, z0: number, z1: number, margin = 1) {
  panels(trim, A, B, count, w + 0.4, z0 - 0.2, z1 + 0.2, margin - 0.2, 0.04)
  panels(win, A, B, count, w, z0, z1, margin, 0.07)
}

/**
 * The cream bargeboards on both ends of a gable built with the same
 * arguments as gable(): a 0.45 m band under each rake, just proud of the
 * roof's end, the brightest lines on the house in every photo.
 */
function barge(f: Frame, hu: number, hv: number, zE: number, zR: number, o: number, ends: number[] = [-1, 1]) {
  const s = (zR - zE) / hv, U = hu + o + 0.03, V = hv + o, ze = zE - o * s, d = 0.45
  const ax: V3 = [Math.cos(f.a), Math.sin(f.a), 0]
  const P = (u: number, v: number, z: number): V3 => { const q = at(f, u, v); return [q[0], q[1], z] }
  for (const su of ends) {
    const n: V3 = [ax[0] * su, ax[1] * su, 0]
    for (const sv of [-1, 1]) face(trim, [P(su * U, sv * V, ze), P(su * U, 0, zR), P(su * U, 0, zR - d), P(su * U, sv * V, ze - d)], n)
  }
}

const EAVE = 14.8

// Canyon-side lower storeys (OSM): a rubble-stone storey, shingle above.
const LOW: XY[] = [[-14, 1], [12, 1], [12, 8.2], [3.9, 8.1], [4, 6.1], [-6.6, 6], [-6.6, 4], [-14, 3.9]]
prism(stone, LOW, 0, 3.5, 0, null)
prism(wall, LOW, 3.5, 8, 0.2, roof)
framed([12, 8.2], [3.9, 8.1], 2, 1.4, 4.8, 6.8)
framed([4, 6.1], [-6.6, 6], 3, 1.4, 4.8, 6.8)
framed([-6.6, 4], [-14, 3.9], 2, 1.4, 4.8, 6.8)
framed([12, 1], [12, 8.2], 2, 1.4, 4.8, 6.8)

// Main house: the eastern, taller part and the western, lower part.
const A1: Frame = { c: [1, -4.25], a: 0 }
prism(wall, rect(-10, 12, -9.5, 1), 0, EAVE, 0, null)
gable(roof, wall, A1, 11, 5.25, EAVE, 18.2, 0.7)
barge(A1, 11, 5.25, EAVE, 18.2, 0.7, [1])
const A2: Frame = { c: [-14, -4.25], a: 0 }
prism(wall, rect(-18, -10, -9.5, 1), 0, 13.6, 0, null)
gable(roof, wall, A2, 4, 5.25, 13.6, 16.2, 0.7)
barge(A2, 4, 5.25, 13.6, 16.2, 0.7, [-1])
// West wing (OSM x -21.5..-18), low hip.
prism(wall, rect(-21.5, -18, -4.1, 1.3), 0, 10.2, 0, null)
hip(roof, { c: [-19.75, -1.4], a: Math.PI / 2 }, 2.7, 1.75, 10.2, 11.3, 0.5)

// Upper canyon-side windows above the lower storeys.
framed([-3, 1], [-10, 1], 2, 1.5, 9.4, 11.6)
framed([-10, 1], [-18, 1], 2, 1.5, 9.4, 11.6)
framed([12, -9.5], [12, 1], 2, 1.5, 9.6, 11.8)
framed([12, -9.5], [12, 1], 2, 1.5, 12.4, 14.2)
framed([-18, 1], [-18, -9.5], 2, 1.4, 10.2, 12.2)

// The big canyon gable over the east end (lidar ridge 38.4), its face at y=7.
const C: Frame = { c: [7, 1.5], a: Math.PI / 2 }
prism(wall, rect(3, 11, -4, 7), 0, EAVE, 0, null)
gable(roof, wall, C, 5.5, 4, EAVE, 17.6, 0.7)
barge(C, 5.5, 4, EAVE, 17.6, 0.7, [1])
framed([11, 7], [3, 7], 2, 1.6, 9.2, 11.6, 1.2)
framed([11, 7], [3, 7], 2, 1.4, 12.2, 14.0, 1.6)
framed([11, 7], [3, 7], 1, 1.2, 15.0, 16.2, 3)

// The smaller canyon gable lower down to the west (photo 4856).
const D: Frame = { c: [-6, 3.25], a: Math.PI / 2 }
prism(wall, rect(-9, -3, 1, 5.5), 8, 10.5, 0, null)
gable(roof, wall, D, 2.25, 3, 10.5, 12.4, 0.5)
barge(D, 2.25, 3, 10.5, 12.4, 0.5, [1])
framed([-3, 5.5], [-9, 5.5], 1, 2.4, 8.6, 10.2)

// Street gable over the entrance (photo 0617 01); the street is about 12 m
// above y = 0 here.
const E: Frame = { c: [-0.5, -8.5], a: Math.PI / 2 }
prism(wall, rect(-4.5, 3.5, -11.5, -5.5), 0, EAVE, 0, null)
gable(roof, wall, E, 3, 4, EAVE, 18.0, 0.6)
barge(E, 3, 4, EAVE, 18.0, 0.6, [-1])
panelAt(trim, [-4.5, -11.5], [3.5, -11.5], 5.6, 2.0, 12.2, 14.5, 0.04)
panelAt(win, [-4.5, -11.5], [3.5, -11.5], 5.6, 1.6, 12.4, 14.3, 0.07)
framed([-4.5, -11.5], [3.5, -11.5], 1, 1.1, 15.2, 16.3, 3)
framed([3.5, -9.5], [12, -9.5], 2, 1.6, 12.6, 14.2, 1.6)
framed([-10, -9.5], [-4.5, -9.5], 1, 1.6, 12.6, 14.2, 1.6)

// The entrance porch (photo 0617 01): a small open gable on log posts in
// front of the street gable's west half, the door under it at the street.
const P: Frame = { c: [-2.4, -12.5], a: Math.PI / 2 }
gable(roof, null, P, 1.0, 1.8, 14.7, 15.9, 0.3, 0.25)
barge(P, 1.0, 1.8, 14.7, 15.9, 0.3, [-1])
post(wall, [-4.0, -13.3], 0.16, 0, 14.6)
post(wall, [-0.8, -13.3], 0.16, 0, 14.6)
panelAt(trim, [-4.5, -11.5], [3.5, -11.5], 2.1, 1.6, 12.0, 14.5, 0.04)
panelAt(win, [-4.5, -11.5], [3.5, -11.5], 2.1, 1.2, 12.0, 14.3, 0.07)

// The broad rubble-stone chimney on the street side, west of the gable.
prism(stone, rect(-7.8, -6.0, -10.6, -9.0), 0, 19.5, 0.15)

await save('grand-canyon-kolb-studio', 'Kolb Studio', [
  // Dark brown shingles and logs, held no darker than the palette allows;
  // red-brown rubble stone; weathered cedar-shingle roofs (grey-brown in
  // 4856, fresher orange in 0617 01); cream trim and bargeboards.
  { part: wall, material: finish('kolb-shingle', 0x65513f) },
  { part: stone, material: finish('kolb-stone', 0xbb8e70) },
  { part: roof, material: finish('kolb-roof', 0x9a8f84) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
], { bearing: 0, elevation: 0, height: 19.5 })
