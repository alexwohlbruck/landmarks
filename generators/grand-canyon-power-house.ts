/**
 * Grand Canyon Power House, Grand Canyon Village (South Rim): procedural,
 * CC0-1.0. bun generators/grand-canyon-power-house.ts
 *
 * The Santa Fe Railway's 1926 power plant (National Register 87001411,
 * Wikidata Q5594359), dressed as a rustic chalet so it would sit quietly in
 * the village. What makes it read:
 * - a tall ground storey of shaggy rubble stone, opened on its long sides
 *   and east end by tall factory windows between stone piers, solid stone
 *   toward the lower west wing;
 * - a dark timber balcony band round the top of the stone;
 * - a set-back upper storey of pale stucco with a band of windows under a
 *   very low-pitched roof with a deep, bracketed eave;
 * - the lower stone west wing under its own low roof.
 *
 * Identity: the assignment named way/199053260 (wikidata Q5594362), which
 * is the Grand Canyon South Rim Ranger's Dormitory (1921), not the power
 * house. The power house is OSM way/122426184, tagged wikidata Q5594359
 * ("Grand Canyon Power House"; Wikidata's point -112.140647, 36.055764 sits
 * inside it), south of Bright Angel Lodge across the railway. This model is
 * that building.
 *
 * Uses the shared kit in grand-canyon-bright-angel-lodge.ts.
 *
 * Frame: x east, y north, z up, metres, turned to bearing 8.3 (the OSM
 * walls run at 8.3 and 98.3 degrees). Anchor (-112.140666, 36.055703): the
 * middle of the lidar footprint. USGS 3DEP lidar (AZ_GrandCanyonNP_1_2019,
 * flown 2019, 0.5 m grid) puts the building 3.9 m east of the OSM rectangle,
 * which has the right size (39.4 x 28.8 m); the model follows lidar.
 *
 * Heights above y = 0 = the lowest ground under the footprint (2088.8 m;
 * the ground rises 1.6 m to the south):
 * - main roof ridge 15.8 m, roof edge 13.8 m (lidar 18.0 and 16.0 over
 *   ground_min 2086.57 m, measured); the ridge runs east-west and the roof
 *   ends are flat in lidar, so it is drawn as a very low gable;
 * - west wing ridge 10.1 m, edge 8.2 m (lidar 12.3, 10.4, measured);
 * - top of the stone 8.0 m, the balcony band 8.0-9.2 m, the upper storey
 *   set back about 1.2 m: estimated from photo 8314 against the measured
 *   eave (stone about 0.56 of the eave height).
 *
 * Photos (EVIDENCE):
 * - "Grand Canyon National Park- Powerhouse (2014) 8314 (13204265764).jpg",
 *   Grand Canyon NPS, public domain,
 *   https://commons.wikimedia.org/wiki/File:Grand_Canyon_National_Park-_Powerhouse_(2014)_8314_(13204265764).jpg
 *   (long side and the west wing);
 * - "Grand Canyon National Park - Powerhouse Southeast Exposure.jpg" and
 *   "... East Exposure.jpg", Grand Canyon NPS, CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:Grand_Canyon_National_Park_-_Powerhouse_Southeast_Exposure.jpg;
 * - "Grand Canyon Village-Grand Canyon Power House-1926.jpg", Marine 69-71,
 *   CC BY-SA 4.0.
 *
 * Doubts: the roof's top surface is in no photo; it is drawn the dark
 * brown of its eave. Which long side photo 8314 shows is not certain, so its bays are
 * mirrored onto both long sides; the eave brackets and the balcony's
 * cut-out boards are dropped as too fine.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { box, face, gable, panels, prism, rect, save, type Frame, type XY } from './grand-canyon-bright-angel-lodge'
import type { V3 } from './mesh'

const stones = new Part(), rubble = new Part(), timber = new Part(), stucco = new Part(), roof = new Part(), win = new Part()

// Seeded random numbers, so the stones are the same on every build.
let seed = 1926
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
const lerp = (a: number, b: number) => a + (b - a) * rnd()
/**
 * Flush darker boulders on a stone face A→B (outward to the right) between
 * z0 and z1, skipping spans `gaps` [s0, s1] along the face, so the shaggy
 * rubble reads from a distance (photos 8314, Southeast Exposure).
 */
function boulders(A: XY, B: XY, z0: number, z1: number, n: number, gaps: [number, number][] = [], off = 0.03) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
  const nrm: V3 = [u[1], -u[0], 0]
  for (let k = 0, t = 0; k < n && t < n * 6; t++) {
    const w = lerp(0.5, 1.0), h = lerp(0.4, 0.7), s0 = lerp(0.1, L - 0.1 - w), z = lerp(z0, z1 - h)
    if (gaps.some(([g0, g1]) => s0 < g1 && s0 + w > g0)) continue
    const P = (q: number, zz: number): V3 => [A[0] + u[0] * q + nrm[0] * off, A[1] + u[1] * q + nrm[1] * off, zz]
    face(stones, [P(s0, z), P(s0 + w, z), P(s0 + w, z + h), P(s0, z + h)], nrm)
    k++
  }
}

const X0 = -10.4, X1 = 18.0, HY = 13.6 // the main block's stone walls
const STONE = 8.0, BAND = 9.2, EAVE = 14.1

// Ground storey of rubble stone.
prism(rubble, rect(X0, X1, -HY, HY), 0, STONE, 0, null)
// Tall factory windows in bays between proud stone piers: four on each long
// side at the east end, three on the east end (photos 8314, East Exposure).
function bays(A: XY, B: XY, from: number, to: number, n: number) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], nrm: XY = [u[1], -u[0]]
  const step = (to - from) / n
  const P = (s: number, d: number): XY => [A[0] + u[0] * s + nrm[0] * d, A[1] + u[1] * s + nrm[1] * d]
  for (let k = 0; k <= n; k++) {
    const s = from + k * step, a = P(s - 0.6, 0), b = P(s + 0.6, 0), c = P(s + 0.6, 0.55), d = P(s - 0.6, 0.55)
    prism(rubble, [a, d, c, b], 0, STONE, 0.15)
  }
  for (let k = 0; k < n; k++) {
    const c = from + (k + 0.5) * step, w = step - 1.6
    panels(win, P(c - w / 2 - 0.01, 0), P(c + w / 2 + 0.01, 0), 1, w, 0.9, 2.5, 0)
    panels(win, P(c - w / 2 - 0.01, 0), P(c + w / 2 + 0.01, 0), 1, w, 3.2, 7.2, 0)
  }
}
bays([X0, -HY], [X1, -HY], 13.2, 27.6, 4) // south side, east part
bays([X1, HY], [X0, HY], 0.8, 15.2, 4) // north side, east part
bays([X1, -HY], [X1, HY], 3.6, 23.6, 3) // east end
// Boulders on the solid stone and the piers' faces.
boulders([X0, -HY], [X1, -HY], 0.2, 7.8, 40, [[12.6, 28.4]])
boulders([X1, HY], [X0, HY], 0.2, 7.8, 40, [[0, 15.8]])
boulders([-18.0, -HY], [X0, -HY], 0.2, 8.2, 18)
boulders([X0, HY], [-18.0, HY], 0.2, 8.2, 18)
boulders([-18.0, HY], [-18.0, -HY], 0.2, 8.2, 40, [[2.5, 7], [10.8, 16.3], [19.2, 24.6]])
// Doors in the solid stone toward the wing (photo 8314).
panels(win, [X0, -HY], [X1, -HY], 2, 2.4, 0, 3.4, 4)

// The dark timber balcony band, a little proud of the stone.
prism(timber, rect(X0, X1 + 0.5, -HY - 0.5, HY + 0.5), STONE, BAND, 0.1)
// The upper storey, set back, pale stucco with its window band.
const UX1 = X1 - 1.1, UY = HY - 1.2
prism(stucco, rect(X0, UX1, -UY, UY), BAND, EAVE, 0, null)
panels(win, [X0, -UY], [UX1, -UY], 9, 1.7, 10.0, 12.6, 1.4)
panels(win, [UX1, UY], [X0, UY], 9, 1.7, 10.0, 12.6, 1.4)
panels(win, [UX1, -UY], [UX1, UY], 5, 1.7, 10.0, 12.6, 1.6)
// Dark posts at the stucco corners.
for (const [x, y] of [[X0, -UY], [UX1, -UY], [UX1, UY], [X0, UY]] as XY[]) box(timber, x - 0.3, x + 0.3, y - 0.3, y + 0.3, BAND, EAVE - 0.4)
// The very low gable roof with its deep eave (lidar: edge 13.8, ridge 15.8).
const MAIN: Frame = { c: [(X0 + UX1) / 2, 0], a: 0 }
gable(roof, timber, MAIN, (UX1 - X0) / 2, UY, EAVE, 15.8, 2.0, 0.8)

// The lower west wing: stone to its eave, its own low roof.
const WX0 = -18.0
prism(rubble, rect(WX0, X0, -HY, HY), 0, 8.4, 0, null)
gable(roof, rubble, { c: [(WX0 + X0) / 2, 0], a: 0 }, (X0 - WX0) / 2, HY, 8.4, 10.1, 1.2, 0.6)
panels(win, [WX0, -HY], [X0, -HY], 1, 2.4, 0, 3.4, 2)
panels(win, [X0, HY], [WX0, HY], 1, 2.4, 0, 3.4, 2)
panels(win, [WX0, HY], [WX0, -HY], 3, 1.6, 4.0, 6.6, 3)

await save('grand-canyon-power-house', 'Grand Canyon Power House', [
  // Red-tan rubble with darker boulders, dark brown timber, pale
  // grey-beige stucco, a dark brown roof (its deep eave is what shows).
  { part: rubble, material: finish('power-house-rubble', 0xc9a07c) },
  { part: stones, material: finish('power-house-boulder', 0xa27a5c) },
  { part: timber, material: finish('power-house-timber', 0x6e5544) },
  { part: stucco, material: finish('power-house-stucco', 0xdcd2c2) },
  { part: roof, material: finish('power-house-roof', 0x7a6a5e) },
  { part: win, material: PALETTE.window },
], { bearing: 8.3, elevation: 0, height: 15.8 })
