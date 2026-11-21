/**
 * Yavapai Geology Museum (Yavapai Observation Station), South Rim, Grand
 * Canyon: procedural, CC0-1.0.
 * bun generators/grand-canyon-yavapai-geology-museum.ts
 *
 * Herbert Maier's 1928 observation station on the rim east of Grand Canyon
 * Village: a low building of rough buff Kaibab limestone that grows out of
 * the rim rock. What makes it read:
 * - the observation room on the canyon end, a band of big plate-glass view
 *   windows between stone piers under a thin flat roof with a log fascia,
 *   its north-east corner rounded, on a stone base that drops to the rock;
 * - the plaza side: a rubble wall whose top steps up to a taller centre,
 *   with log viga ends under the top, a plank door at the west end;
 * - the entrance in the inside corner at the east end, under a flat log
 *   canopy carried on a stone pillar;
 * - the pale flat roofs (NAIP).
 *
 * Uses the shared kit in grand-canyon-bright-angel-lodge.ts.
 *
 * Frame: x, y, z up, metres, turned to bearing 15 (the building's walls in
 * NAIP and lidar), so +y faces the canyon (north-north-east) and +x runs
 * east-south-east. Anchor (-112.11763, 36.06606), on OSM way/126467052.
 * The OSM outline sits about 6 m west of the building in lidar and NAIP
 * (both agree); the model follows lidar and NAIP, so the building lies at
 * x -3.8..17.3, y -5..14 in this frame.
 *
 * Sources:
 * - OSM way/126467052, ODbL (name, alt_name, identity; the plan is offset).
 * - USGS 3DEP lidar AZ_GrandCanyonNP_1_2019 (flown 2019), 0.5 m grid, read
 *   in the model's frame (heights over ground_min 2048.96 m): plaza ground
 *   106.5; ground under the observation room 101.5-103.5; observation room
 *   roof 109.8; plaza-side roofs 110.4; top of the south wall 112-113 (the
 *   juniper in front of it also returns there).
 * - USGS NAIP aerial (public domain): the plan, the rounded north-east
 *   corner, the east wing and the pale roofs.
 * - Photos (EVIDENCE):
 *   - "Yavapai Geology Museum.jpg", Michael Quinn (NPS), public domain,
 *     https://commons.wikimedia.org/wiki/File:Yavapai_Geology_Museum.jpg
 *     (from the west along the rim: the observation room and its windows);
 *   - "Yavapai Geology Museum - south-facing exterior.jpg", Grand Canyon
 *     NPS, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Yavapai_Geology_Museum_-_south-facing_exterior.jpg
 *     (the plaza side: stepped rubble wall, vigas, door, entrance);
 *   - "09431 Yavapai Geology Museum Grand Canyon (5590084543).jpg", Grand
 *     Canyon NPS, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:09431_Yavapai_Geology_Museum_Grand_Canyon_(5590084543).jpg
 *     (the observation room on its stone base over the rock, from the west).
 *
 * Numbers, above y = 0 = 101.5 m over ground_min (the lowest ground under
 * the footprint, at the observation room's north-west corner):
 * - plaza 5.1, observation room roof 8.3, plaza-side roofs 8.9: lidar;
 * - the stepped wall top 10.0 and 10.9: lidar 112-113 and the south photo
 *   (the centre about 2.5 door heights over the plaza), estimated;
 * - view windows 5.5-7.65, doors 2.3 m: estimated from the photos;
 * - the plan: NAIP, read on a 2 m grid in the model's frame (about 0.5 m).
 *
 * Rework (lead review: "too pale and plain"): the stone is now the photos'
 * warm grey-buff limestone (#c9b99f, pulled to the palette's lightness)
 * with flush darker rubble stones laid over every stone face; the stepped
 * plaza wall's tops are broken into rubble blocks (to 11.4); the log
 * fascia under the observation room's roof is deeper and dark, the viga
 * ends are round dark logs. Stone placement and block heights are
 * invented (seeded) within the photos' ranges. Plan, anchor, bearing,
 * roofs and the window band are unchanged.
 *
 * Not modelled: the railed overlook terraces round the building, the flag
 * pole and antenna, the stone steps.
 *
 * Doubts: the entrance's place in plan is read from the south photo and the
 * NAIP inside corner, not measured. The east wing's walls are seen in no
 * photo; they are drawn plain with one window band.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, face, panels, post, prism, rect, save, type XY } from './grand-canyon-bright-angel-lodge'

const stone = new Part(), rubble = new Part(), log = new Part(), roof = new Part(), win = new Part()

// Seeded random numbers, so the rubble is the same on every build.
let seed = 1928
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
const lerp = (a: number, b: number) => a + (b - a) * rnd()

/** A rubble wall along x whose top steps in blocks 0.8-1.6 m long between zLo and zHi. */
function ragged(x0: number, x1: number, y0: number, y1: number, z0: number, zLo: number, zHi: number) {
  let a = x0, z = lerp(zLo, zHi)
  while (a < x1 - 1e-6) {
    let b = Math.min(x1, a + lerp(0.8, 1.6))
    if (x1 - b < 0.6) b = x1
    box(stone, a, b, y0, y1, z0, z, 0.1)
    z = Math.min(zHi, Math.max(zLo, z + lerp(-0.5, 0.5) * (zHi - zLo)))
    a = b
  }
}

/**
 * Flush darker rubble stones on a wall face from A to B (outward to the
 * right of A→B), between z0 and z1, skipping the spans in `gaps` (metres
 * along the face, with heights), so the wall reads as laid rubble.
 */
function stones(A: XY, B: XY, z0: number, z1: number, n: number, gaps: [number, number, number, number][] = []) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
  const nrm: V3 = [u[1], -u[0], 0]
  for (let k = 0, tries = 0; k < n && tries < n * 6; tries++) {
    const w = Math.min(lerp(0.6, 1.3), L - 0.3), h = lerp(0.3, 0.5)
    const s = lerp(0.15, L - 0.15 - w), z = lerp(z0, z1 - h)
    if (gaps.some(([g0, g1, h0, h1]) => s < g1 && s + w > g0 && z < h1 && z + h > h0)) continue
    const P = (t: number, zz: number): V3 => [A[0] + u[0] * t + nrm[0] * 0.03, A[1] + u[1] * t + nrm[1] * 0.03, zz]
    face(rubble, [P(s, z), P(s + w, z), P(s + w, z + h), P(s, z + h)], nrm)
    k++
  }
}

const PLAZA = 5.1

// The observation room on the canyon end: stone from the rock to its roof,
// the north-east corner rounded (NAIP).
const arc: XY[] = []
for (let i = 0; i <= 6; i++) {
  const a = (Math.PI / 2) * (i / 6)
  arc.push([7 + 4 * Math.cos(a), 10 + 4 * Math.sin(a)])
}
const ROOM: XY[] = [[-3.8, 4], [11, 4], ...arc, [-3.8, 14]]
prism(stone, ROOM, 0, 8.0, 0.1, null)
// Its thin flat roof, overhanging, with a log fascia under the lip.
{
  const arcO: XY[] = []
  for (let i = 0; i <= 6; i++) {
    const a = (Math.PI / 2) * (i / 6)
    arcO.push([7 + 4.5 * Math.cos(a), 10 + 4.5 * Math.sin(a)])
  }
  const ROOF: XY[] = [[-4.3, 3.5], [11.5, 3.5], ...arcO, [-4.3, 14.5]]
  prism(log, ROOF, 7.6, 8.05, 0)
  prism(roof, ROOF, 8.05, 8.3, 0.05)
}
// The view windows, big panes between stone piers.
panels(win, [-3.8, 14], [-3.8, 4], 3, 2.8, 5.5, 7.65, 0.3)
panels(win, [7, 14], [-3.8, 14], 3, 3.1, 5.5, 7.65, 0.3)
for (let i = 0; i < 6; i++) panels(win, arc[i], arc[i + 1], 1, 0.85, 5.5, 7.65, 0)
panels(win, [11, 4], [11, 10], 1, 3.0, 5.5, 7.65, 2.0)

// The plaza-side block and the east wing, flat-roofed (lidar 110.4).
prism(stone, rect(0, 14, -5, 4.2), 0, 8.9, 0.25)
prism(stone, rect(10.8, 17.3, 3.75, 9), 0, 8.9, 0.25)
// The rubble wall along the plaza, its top stepping up to a taller centre.
box(stone, 2, 12, -5, -1.5, 8.6, 10.0, 0.35)
box(stone, 4.5, 9.5, -5, -2.5, 9.8, 10.9, 0.35)
// Their tops broken into stepped rubble blocks (south photo).
ragged(2, 4.5, -5, -4.2, 9.7, 9.8, 10.4)
ragged(4.5, 9.5, -5, -4.2, 10.7, 10.8, 11.4)
ragged(9.5, 12, -5, -4.2, 9.7, 9.8, 10.3)
// Viga ends under the wall top, round logs standing well out.
for (const x of [5, 6.3, 7.6, 8.9]) post(log, [x, -5.35], 0.28, 8.5, 9.05, 6)
// The plank door at the west end of the plaza wall.
box(log, 1.0, 2.3, -5.06, -5, PLAZA, PLAZA + 2.3, 0)
// The plaza wall's small high windows and the east wing's window band.
panels(win, [14, -5], [14, 4.2], 1, 1.6, PLAZA + 0.9, PLAZA + 2.3, 3)
panels(win, [17.3, 3.75], [17.3, 9], 2, 1.6, PLAZA + 0.9, PLAZA + 2.4, 0.8)
panels(win, [17.3, 9], [11, 9], 1, 3.0, PLAZA + 0.6, PLAZA + 2.5, 1.2)

// The entrance in the inside corner: glazed doors on the east wing's south
// face, a flat roof on a log lintel, carried on a stone pillar.
panels(win, [14, 3.75], [17.3, 3.75], 1, 2.2, PLAZA, PLAZA + 2.6, 0.5)
box(log, 14, 17.6, 0.6, 1.0, PLAZA + 2.8, PLAZA + 3.2, 0)
box(roof, 13.9, 17.7, 0.4, 3.75, PLAZA + 3.2, PLAZA + 3.45, 0.05)
prism(stone, rect(16.3, 17.6, -0.4, 1.0), 0, PLAZA + 3.2, 0.2)
post(log, [14.4, 0.8], 0.18, PLAZA, PLAZA + 2.8, 6)

// Laid rubble: flush darker stones over the stone faces, round the openings.
stones([0, -5], [14, -5], PLAZA, 8.6, 30, [[0.9, 2.4, 5, 7.5], [4.7, 9.3, 8.4, 9.1]])
stones([2, -5], [12, -5], 8.7, 9.7, 6)
stones([4.5, -5], [9.5, -5], 9.8, 10.7, 4)
stones([0, 4.2], [0, -5], 2, 8.6, 10)
stones([14, -5], [14, 4.2], 3, 8.6, 10, [[3.7, 5.5, 5.9, 7.5]])
stones([-3.8, 14], [-3.8, 4], 0.3, 5.3, 16)
stones([7, 14], [-3.8, 14], 0.3, 5.3, 16)
stones([11, 4], [11, 10], 0.3, 7.5, 10, [[1.4, 4.6, 5.4, 7.75]])
stones([17.3, 3.75], [17.3, 9], 2, 8.6, 10, [[0.8, 2.6, 5.9, 7.6], [2.6, 4.4, 5.9, 7.6]])
stones([17.3, 9], [10.8, 9], 2, 8.6, 10, [[1.7, 4.8, 5.6, 7.7]])
stones([16.3, -0.4], [17.6, -0.4], 2, 8.2, 4)
for (let i = 0; i < 6; i++) stones(arc[i], arc[i + 1], 0.3, 5.3, 2)

await save('grand-canyon-yavapai-geology-museum', 'Yavapai Geology Museum', [
  // Warm grey-buff Kaibab limestone rubble and its darker stones, dark
  // log fascia, vigas and door, the pale flat roofs.
  { part: stone, material: finish('yavapai-stone', 0xc9b99f) },
  { part: rubble, material: finish('yavapai-rubble', 0xab9b80) },
  { part: log, material: finish('yavapai-log', 0x5c4232) },
  { part: roof, material: finish('yavapai-roof', 0xd6d2c9) },
  { part: win, material: PALETTE.window },
], { bearing: 15, elevation: 0, height: 11.4 })
