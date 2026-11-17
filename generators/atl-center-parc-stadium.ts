/**
 * Center Parc Stadium (Centennial Olympic Stadium 1996, Turner Field
 * 1997-2016, Georgia State Stadium 2017-2020), Summerhill, Atlanta —
 * Georgia State Panthers football. Procedural, CC0-1.0, no textures.
 *   bun generators/atl-center-parc-stadium.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 356° so the
 * football field's sidelines run along y (the west field wall measures as a
 * straight line at x = -54 in the lidar in this frame). The anchor is the
 * area centroid of the stadium outline (relation/3421244, outer
 * way/255488090).
 *
 * What stands today (2017 conversion, second phase 2018): the 1996-97
 * Turner Field grandstand, a horseshoe from the old third-base line (now
 * the west sideline of the football field) round the old home plate in the
 * south to the old first-base line in the east, kept with its upper deck
 * and its roof canopy (the upper-deck seats are covered, blue with "GEORGIA
 * STATE" in NAIP). The football field lies over the old left field, north
 * to south; its west lower bowl was reoriented to the sideline, new seats
 * curve round the south end zone, a long low aluminium bleacher stands on
 * the east sideline, and the old outfield entry building closes the north
 * end, with the old Turner Field video board standing in the north-east
 * (Southernkeith's 2017 photo shows the north end and the board as built).
 * Wikipedia: "much of the north end of the stadium was removed",
 * "reorienting the lower bowl, covering upper deck seating"; 24,333 seats.
 *
 * z = 0 is the lowest ground under the model, the car park inside the
 * south-east of the outline, about 2 m below the field, so the field is at
 * z = 2 (F below); the west street is at field level and the north street
 * 6 m above it (lidar and Mapterhorn agree). elevation 0.
 *
 * How it is built: the grandstand is lofted round C = (0, -10) from
 * per-angle sections measured in the 2018 lidar (table MAIN, 6° steps,
 * 78°-294°, clockwise from north): the front of the lower bowl (rw), the
 * front of the upper deck (rj, first point over 12 m), the canopy front and
 * back (cf, cb) and the outer edge of the 24 m concourse roof (ro). Each
 * section: the lower bowl rising to 7 m; the club and suite face with its
 * glass band up to the upper deck's lip at 22 m; the upper deck rising to
 * 36 m under the canopy; the canopy, a thin plate sloping from 43 m at the
 * front to 40 m at the back (lidar), its top the grey-green steel of NAIP,
 * dark underneath; behind it the 24 m outer concourse roof and the red
 * brick outer wall with its glass bands. The north end (294°-366°) is a
 * second loft: the open lower stand, then the 24-28 m entry building to
 * the outline. The east bleachers, the video board (42 m wide, top 38 m,
 * facing the old home plate) and the two north-west light rigs (45 m) are
 * boxes.
 *
 * Evidence
 * - OSM: relation/3421244 (outer way/255488090, inner way/751362892).
 * - Lidar: USGS 3DEP GA_Statewide_B2_2018, 1 m grid: every radius and
 *   height above. The flight is from 2018, during the second phase; the
 *   form agrees with NAIP (current) except where noted under doubts.
 * - NAIP (USGS): plan, blue seats and tarps, the grey-green canopy, the
 *   east bleachers.
 * - Photos (Wikimedia Commons):
 *   Southernkeith, "Georgia State Stadium field.jpg" (CC BY-SA 4.0, 2017;
 *     north end building, video board, east bleachers, blue seats);
 *   Andrew nyr, "Turner Field exterior from the parking lot.jpg" (CC BY-SA
 *     4.0, 2013; brick and precast arches of the north building);
 *   Steviedpeele, "Turner field exterior.jpg" (public domain; the same);
 *   Mark Larson, "Turner Field exterior.jpg" (CC BY-SA 2.0, 2012);
 *   Zpb52, "Turner Field Panorama From Outfield.jpg" (CC BY-SA 3.0, 2013;
 *     the grandstand, upper deck and canopy);
 *   Amy K Posner, "Turner Field 9-15-14.jpg" (CC BY-SA 4.0; canopy);
 *   Nate Shivar, "Turner Field with Downtown Atlanta in Background"
 *     (CC BY 2.0, 2013; the video board).
 * Doubts: no open photo of the grandstand's outer walls after 2017 was
 * found; the outer wall is drawn as brick with glass bands like the north
 * building (Turner-era photos), and the outer concourse roof as precast.
 * The heights of the glass bands are estimated. The upper deck under the
 * canopy is not seen by lidar (32° rake assumed). The 2026 state of the
 * east bleachers and of any later changes is unchecked; NAIP shows them.
 * Left out: the GEORGIA STATE lettering on the tarps, the light rigs on the
 * canopy, the north plaza's ticket buildings (separate OSM buildings).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { add, box, loftSections, mul, quad, unit, type SectionPt, type XY } from './dc-nationals-park'

const F = 2 // the field, above z = 0
const C: XY = [0, -10]
const dirOf = (a: number): XY => [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)]
const at = (a: number, r: number, z: number): V3 => { const d = dirOf(a); return [C[0] + d[0] * r, C[1] + d[1] * r, z] }

const seats = new Part(), brick = new Part(), stone = new Part(), canopy = new Part(), steel = new Part(), glass = new Part()
const S = (r: number, z: number, part: Part | null): SectionPt => ({ r, z: z + F, part })

// [θ, rw, rj, cf, cb, ro], lidar, smoothed.
type Row = [number, number, number, number, number, number]
const MAIN: Row[] = [
  [78, 74.5, 94.5, 109, 124, 130.5], [84, 72.5, 92, 105, 121, 130], [90, 71, 91.5, 104, 119.5, 127], [96, 72, 90.5, 103.5, 118, 125.5],
  [102, 75, 87.5, 100.5, 116, 125], [108, 75, 85, 97.5, 112.5, 124], [114, 72, 83.5, 96.5, 111, 120], [120, 69.5, 78.5, 92, 110, 115],
  [126, 66.5, 74, 86.5, 104, 109], [132, 60, 71, 84.5, 100.5, 104.5], [138, 55, 68, 82.5, 95, 101], [144, 53, 67.5, 80, 93.5, 99.5],
  [150, 50, 66.5, 79.5, 94, 99], [156, 45, 67.5, 80, 95, 100], [162, 42, 68, 79, 94.5, 100], [168, 41.5, 68, 79.5, 95, 104],
  [174, 42, 69.5, 79.5, 96, 106], [180, 43.5, 70.5, 81.5, 98, 108], [186, 44.5, 73.5, 85.5, 102, 108.5], [192, 45, 76, 89, 106, 109.5],
  [198, 47, 81.5, 93, 110, 111.5], [204, 54, 85.5, 96, 112.5, 117], [210, 62, 87, 98, 113.5, 119.5], [216, 65, 88.5, 99.5, 114.5, 121],
  [222, 66, 89, 100.5, 115.5, 121], [228, 65, 89, 102, 114.5, 119.5], [234, 62, 86, 99, 113.5, 117.5], [240, 56, 83, 96.5, 111.5, 115.5],
  [246, 54.5, 79, 93, 106, 113], [252, 53, 78.5, 88.5, 106, 112.5], [258, 52.5, 77, 87.5, 105.5, 114], [264, 52.5, 77, 87.5, 105, 115],
  [270, 53, 78, 91, 103.5, 115], [276, 54, 80, 92, 106.5, 114], [282, 54.5, 79.5, 93, 108.5, 115], [288, 55.5, 80.5, 95, 109.5, 117],
  [294, 57.5, 84, 98, 111, 122],
]
const ANG = MAIN.map((r) => r[0])
// The canopy's underside height at radius r between its front (42) and back (38.6).
const under = (cf: number, cb: number, r: number) => 42 + ((38.6 - 42) * (r - cf)) / (cb - cf)

loftSections(C, ANG, MAIN.map(([, rw, rj, cf, cb, ro]) => [
  S(rw, -F, seats), // field wall
  S(rw, 1.2, seats), // lower bowl
  S(rj - 2, 7, stone), // cross aisle
  S(rj, 7, stone), // club level face
  S(rj, 9.5, glass), // suites
  S(rj, 18.5, stone),
  S(rj, 21, steel), // upper deck lip, dark as in the photos
  S(rj, 22, seats), // upper deck
  S(cb - 3, 36, steel), // back wall under the canopy
  S(cb - 3, under(cf, cb, cb - 3), null),
  S(cb - 1, under(cf, cb, cb - 1), steel), // the canopy's back framing, outside
  S(cb - 1, 24, stone), // outer concourse roof, precast
  S(ro, 24, brick), // outer wall
  S(ro, -F, null),
]), brick)

// The canopy plate.
loftSections(C, ANG, MAIN.map(([, , , cf, cb]) => [
  S(cf, 42, steel), // front edge
  S(cf, 44, canopy), // top
  S(cb + 0.5, 40.4, canopy), // back edge
  S(cb + 0.5, 38.6, steel), // underside
  S(cf, 42, null),
]), steel)

// Glass bands on the outer wall, one panel per bay.
for (let i = 0; i < MAIN.length - 1; i++) {
  const [a0, , , , , r0] = MAIN[i], [a1, , , , , r1] = MAIN[i + 1]
  const p0 = at(a0, r0 + 0.06, 0), p1 = at(a1, r1 + 0.06, 0)
  const L = (u: number, z: number): V3 => [p0[0] + (p1[0] - p0[0]) * u, p0[1] + (p1[1] - p0[1]) * u, z + F]
  const d = dirOf((a0 + a1) / 2)
  quad(glass, [L(0.15, 10), L(0.85, 10), L(0.85, 19), L(0.15, 19)], [d[0], d[1], 0])
}

// ---------------------------------------------------------------------------
// The north end: [θ, rw, a1, z1, z2, a2, z3, z4, ro] — the open lower
// stand from the wall up to (a1, z1), a face to z2, a step to (a2, z3),
// a face to the roof z4, which runs out to ro. Lidar.
type NRow = [number, number, number, number, number, number, number, number, number]
const NORTH: NRow[] = [
  [294, 57.5, 84, 7, 22, 98, 30, 24, 122],
  [300, 59, 86, 7, 14, 95, 17, 24, 128],
  [306, 63, 92, 7, 14, 101, 17, 24, 133],
  [312, 68, 98, 7, 14, 107, 16, 24, 133],
  [318, 101, 103.5, 2, 15, 108, 16, 24, 144],
  [324, 94, 100, 6, 14, 108, 16, 24, 140],
  [330, 94, 100, 6, 14, 108, 16, 24, 134],
  [336, 89, 101, 7, 15, 107, 16, 24, 146],
  [342, 89, 98, 6, 28, 98.5, 28, 27, 146],
  [348, 87, 97, 5.5, 28, 97.5, 28, 26, 146],
  [354, 87, 96, 5.5, 28, 96.5, 28, 26, 146],
  [360, 86, 95, 5.5, 28, 95.5, 28, 26, 145],
  [366, 86, 95, 5.5, 28, 95.5, 28, 26, 132],
]
loftSections(C, NORTH.map((r) => r[0]), NORTH.map(([, rw, a1, z1, z2, a2, z3, z4, ro]) => [
  S(rw, -F, seats),
  S(rw, 1.2, seats),
  S(a1, z1, glass), // the stand's back, or the building's glass club level
  S(a1, Math.min(z2, Math.max(z1, 17)), steel), // the building's dark upper box (ad band)
  S(a1, z2, z2 > 20 ? steel : seats), // its roof edge, or a second tier
  S(a2, z3, z3 > z4 ? brick : glass),
  S(a2, z4, stone), // roof
  S(ro, z4, brick), // outer wall
  S(ro, -F, null),
]), brick)
// The north building's arched windows on its street (north) face.
for (let a = 330; a < 366; a += 6) {
  const r0 = NORTH.find((r) => r[0] === a)![8], r1 = NORTH.find((r) => r[0] === a + 6)![8]
  const p0 = at(a, r0 + 0.06, 0), p1 = at(a + 6, r1 + 0.06, 0)
  const L = (u: number, z: number): V3 => [p0[0] + (p1[0] - p0[0]) * u, p0[1] + (p1[1] - p0[1]) * u, z + F]
  const d = dirOf(a + 3)
  quad(glass, [L(0.2, 12), L(0.8, 12), L(0.8, 21), L(0.2, 21)], [d[0], d[1], 0])
}

// East sideline bleachers: aluminium, x 28 to 47, y -48 to 62, rising to
// 7 m (lidar 2-7 m; grey in NAIP).
{
  const y0 = -48, y1 = 62, x0 = 28, x1 = 47
  const P = (x: number, y: number, z: number): V3 => [x, y, z + F]
  quad(canopy, [P(x0, y0, 1.2), P(x1, y0, 7), P(x1, y1, 7), P(x0, y1, 1.2)], [-0.3, 0, 1])
  quad(steel, [P(x0, y0, -F), P(x0, y1, -F), P(x0, y1, 1.2), P(x0, y0, 1.2)], [-1, 0, 0])
  quad(steel, [P(x1, y0, -F), P(x1, y0, 7), P(x1, y1, 7), P(x1, y1, -F)], [1, 0, 0])
  quad(steel, [P(x0, y0, -F), P(x0, y0, 1.2), P(x1, y0, 7), P(x1, y0, -F)], [0, -1, 0])
  quad(steel, [P(x0, y1, -F), P(x1, y1, -F), P(x1, y1, 7), P(x0, y1, 1.2)], [0, 1, 0])
  // the press and camera box along its top
  box(stone, [x1 - 2, (y0 + y1) / 2 + 5, 9.5 + F], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [2, 22, 2.5], false)
}

// The video board (the old Turner Field board) in the north-east, facing
// the old home plate: lidar (34, 95)-(71, 74), top 38 m.
{
  const A: XY = [34, 95], B: XY = [71, 74]
  const e = unit([B[0] - A[0], B[1] - A[1], 0]), n0: V3 = [-e[1], e[0], 0]
  const n = n0[0] * (0 - A[0]) + n0[1] * (-80 - A[1]) > 0 ? n0 : mul(n0, -1) // toward the old home plate
  const m: V3 = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, 0]
  const ax: [V3, V3, V3] = [e, n, [0, 0, 1]]
  box(steel, add(m, [0, 0, 26 + F]), ax, [21, 2.2, 12], true) // 42 × 24 m
  box(glass, add(m, add(mul(n, 2.25), [0, 0, 26.5 + F])), ax, [12, 0.05, 10.5]) // the main screen
  for (const u of [-16.5, 16.5]) box(seats, add(add(m, mul(e, u)), add(mul(n, 2.25), [0, 0, 26 + F])), ax, [3.6, 0.05, 10.5]) // blue ad panels
  for (const u of [-12, 0, 12]) box(steel, add(add(m, mul(e, u)), [0, 0, 7 + F]), ax, [1.2, 1.2, 7], false) // legs to the plaza
}

// Two light rigs at the north end of the west stand (lidar 45 m).
for (const [x, y] of [[-86.6, 52.9], [-84, 66]] as XY[]) {
  const toField = unit([-20 - x, 20 - y, 0]), t: V3 = [toField[1], -toField[0], 0]
  box(steel, [x, y, 34 + F], [t, toField, [0, 0, 1]], [0.9, 0.9, 10], false)
  box(steel, [x, y, 43 + F], [t, toField, [0, 0, 1]], [3.5, 1, 2.2], true)
  box(stone, add([x, y, 43 + F], mul(toField, 1.05)), [t, toField, [0, 0, 1]], [3.2, 0.05, 1.9])
}

// ---------------------------------------------------------------------------
const parts = [
  { part: seats, material: finish('gsu-seat-blue', 0x4a68aa) },
  { part: brick, material: finish('center-parc-brick', 0xb06a58) },
  { part: stone, material: PALETTE.stone },
  { part: canopy, material: finish('center-parc-canopy', 0x8a9893) },
  { part: steel, material: finish('center-parc-steel', 0x4d555c) },
  { part: glass, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Center Parc Stadium', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 356, osm: 'relation/3421244', height: 47,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/atl-center-parc-stadium.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
