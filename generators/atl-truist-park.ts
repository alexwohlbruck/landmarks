/**
 * Truist Park (former SunTrust Park), Cumberland, Atlanta (MLB, Atlanta
 * Braves), 2017, Populous — procedural, CC0-1.0, no textures.
 *   bun generators/atl-truist-park.ts
 *
 * Map frame: x across the park (first-base / right-field side +x), y from
 * home plate toward centre field, z up, metres. Placed at bearing 158°, the
 * line from home plate to centre field (OSM pitch way/559996049 and the
 * NAIP infield; the home-plate apex of the pitch lies at x = -6 in this
 * frame). The anchor is the area centroid of the stadium outline
 * (building=stadium relation/9051237, outer way/483842488).
 *
 * The stands only: the field is the map's (STYLE.md, "Ground"). z = 0 is
 * the lowest ground under the outline, at the centre-field edge, about 1 m
 * below the playing field (lidar: field 294.1 m, ground beyond the
 * centre-field wall 293.1-293.5 m; Mapterhorn shows the same 1 m), so the
 * field is at z = 1 (F below). The field is not sunk below the outfield
 * ground, so elevation stays 0; the street and plaza behind home plate
 * stand about 11 m above the field (lidar 17-18 m above ground_min), so on
 * that side the uphill wall runs into the hill and the facade detail starts
 * at about 13 m.
 *
 * How it is built (all radii from a centre C = (-6, -35) near the mound,
 * angles clockwise from centre field):
 *   - The main grandstand, 72°-300° (round from the right-field corner
 *     past home to the left-field corner), lofted from per-angle sections
 *     measured in the 2018 lidar (table MAIN): the field wall (rw), the
 *     front of the middle deck (rj, first point over 9 m), the canopy front
 *     (cf) and back (cb, the OSM outline). Each section: the low lower bowl
 *     (1.5 m at the wall to 4.5 m, as measured), the club fascia with its
 *     glass band to 11 m, the middle deck rising 11-15 m, the suite glass
 *     band, the upper deck from 21.5 m to 37 m under the canopy, a dark
 *     steel back wall up to the canopy, and outside the red-brick facade
 *     with its cream precast cap at 26-30 m and the dark steel truss zone
 *     between that cap and the canopy.
 *   - The canopy: a thin plate 44-46.2 m above the field, 27-36 m deep
 *     (lidar 44-45 m flat; Wikipedia "90 ft wide canopy" covering about 60%
 *     of the seats), white on top as in NAIP, dark steel underneath and on
 *     the front edge, with the raised light rack along its front edge and
 *     lamp beads in it (the "hundreds of LED lights along the edge of the
 *     canopy", Wikipedia).
 *   - The outfield corners, 300°-324° (left field) and 54°-72° (right
 *     field): three open tiers rising to 27 m and a 31 m roof behind them,
 *     to the outline (lidar).
 *   - Centre field, 324°-54°: low outfield seats rising from the wall to
 *     5-11 m, and a deck at 7-14 m behind them (lidar), the big video board
 *     in dead centre (lidar: 38 m wide, 5 m deep, top 48 m with the TRUIST
 *     PARK letters), the Chop House in right field (OSM part way/561604015,
 *     18 m in the lidar) and the 31 m right-field club block behind it.
 *   - Four light towers in the outfield, 62-63 m (lidar), two each side.
 *
 * Evidence
 * - OSM: relation/9051237 (outer way/483842488, inner pitch
 *   way/559996049), Chop House building:part way/561604015.
 * - Lidar: USGS 3DEP GA_Statewide_B2_2018 (flown 2018, after the 2017
 *   opening), 1 m grid; every radius and height above is measured from it.
 * - NAIP (USGS) for the plan, the white canopy top and dark green seats.
 * - Published (Wikipedia, "Truist Park"): opened 2017, Populous, 41,084
 *   seats; 90 ft (27 m) canopy over about 60% of the seats; brick and
 *   precast exterior; LED lights along the canopy edge; southeast
 *   orientation.
 * - Photos (Wikimedia Commons):
 *   Thomson200, "Suntrust Park viewed from Circle 75 Parkway, May 2017"
 *     (CC0; brick outfield wall, light towers, video board back);
 *   Thomson200, "SunTrust Park viewed from outfield, May 2017" (CC0;
 *     tiers and canopy from centre field);
 *   Thomson200, "SunTrust Park viewed from upper decks behind home plate,
 *     May 2017" (CC0; outfield, board, Chop House);
 *   Thomson200, "Suntrust Park 3B gate, May 2017" and "Suntrust Park LF
 *     gate, May 2017" (CC0; brick and precast facade under the canopy);
 *   Thomson200, "SunTrust Park near 3B, May 2017" (CC0; the stands);
 *   Andrew nyr, "Truist Park.jpg" (CC BY-SA 4.0; interior from 3B);
 *   TarheelBornBred, "Truist Park 2025.jpg" (CC0; whole bowl, canopy
 *     underside and light rack, board, Chop House);
 *   BullDawg2021, "Truist Park on May 25, 2023.jpg" (CC BY-SA 4.0;
 *     outfield, board, light towers);
 *   Tyler Lahti, "Truist Park - 50588486371.jpg" (CC BY-SA 2.0; aerial
 *     at dusk from the west, the facade and lit canopy);
 *   Freekhou5, "Suntrust Park in July 2019.jpg" (CC BY-SA 4.0; night,
 *     canopy lights).
 * Estimated: the lower bowl's rake is the lidar's (lower than it looks in
 * photos); the heights of the glass bands and the brick/precast split on
 * the facade (from the gate photos); the upper deck under the canopy (not
 * seen by lidar; from the photos and a 32° rake); the board's screen and
 * base proportions from the 2025 photo. Colours: seats the Braves' dark
 * green (photos, NAIP), red brick and cream precast pulled to the palette's
 * lightness, the canopy top white, steel charcoal.
 * Left out: the Delta, Coca-Cola and Home Depot signs, the water feature,
 * the LED colour ribbon under the canopy.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { add, box, loftSections, mul, prism, quad, rayHit, unit, type SectionPt, type XY } from './dc-nationals-park'

const F = 1 // the playing field, above z = 0
const C: XY = [-6, -35]

const OUTLINE: XY[] = [[-64.7, -97.6], [-59.6, -104.7], [-49.3, -113.1], [-40.0, -119.1], [-30.9, -122.6], [-20.1, -125.2], [-8.6, -126.0], [3.4, -125.1], [14.7, -122.1], [26.5, -116.5], [35.5, -111.5], [44.7, -103.9], [63.8, -82.2], [102.7, -35.8], [105.8, -26.8], [116.7, -15.5], [121.4, -19.9], [130.4, -11.2], [129.9, -10.7], [131.1, -9.6], [132.4, -11.0], [140.6, -2.9], [140.1, -2.4], [141.1, -1.4], [142.5, -2.7], [150.7, 5.6], [153.2, 3.1], [161.0, 11.5], [147.3, 24.7], [133.1, 38.5], [108.8, 62.0], [100.3, 70.3], [93.6, 68.2], [88.9, 73.1], [84.1, 78.1], [88.2, 79.7], [82.7, 84.8], [76.5, 90.5], [70.1, 96.3], [62.3, 87.3], [14.8, 111.3], [-22.5, 111.0], [-28.2, 110.9], [-38.9, 106.4], [-69.7, 92.5], [-100.4, 72.6], [-105.4, 76.4], [-125.2, 29.5], [-129.2, 29.8], [-129.2, 28.5], [-130.0, 17.9], [-125.9, 17.3], [-126.2, 11.6], [-127.3, -5.6], [-117.2, -37.8], [-97.2, -59.5], [-77.6, -83.6]]
const CHOP: XY[] = [[68.1, 58.2], [54.9, 53.4], [74.2, 28.5], [77.5, 31.2], [79.4, 30.2], [81.7, 32.1], [77.1, 38.5], [78.9, 39.8], [75.6, 44.5], [77.6, 46.1]]

const dirOf = (a: number): XY => [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)]
const outR = (a: number) => rayHit(OUTLINE, C, dirOf(a))
const at = (a: number, r: number, z: number): V3 => { const d = dirOf(a); return [C[0] + d[0] * r, C[1] + d[1] * r, z] }

const seats = new Part(), brick = new Part(), trim = new Part(), steel = new Part(), glass = new Part(), roof = new Part()
const S = (r: number, z: number, part: Part | null): SectionPt => ({ r, z: z + F, part })

// ---------------------------------------------------------------------------
// The main grandstand and canopy, 72°-300°. [θ, rw, rj, cf, cb] from the
// lidar (wall smoothed over the dugouts and camera wells).
type Row = [number, number, number, number, number]
const MAIN: Row[] = [
  [72, 65, 80.5, 97.5, 119], [78, 55, 72, 87.5, 121], [84, 50.5, 64, 78, 114], [90, 45, 58, 71, 108.5],
  [96, 41.5, 54, 65, 101], [102, 38.5, 49.5, 61.5, 94.5], [108, 37, 48, 59, 90], [114, 36.5, 46.5, 56.5, 87],
  [120, 36, 46, 56, 85], [126, 36, 45, 55, 83.5], [132, 35.5, 45, 55, 83.5], [138, 35.5, 45, 55.5, 84],
  [144, 36, 45.5, 56, 85.5], [150, 36.5, 46.5, 58, 86.5], [156, 37, 48, 59.5, 87], [162, 38, 49, 60, 88],
  [168, 38.5, 49.5, 61, 89.5], [174, 39, 50, 61.5, 90.5], [180, 39.5, 50, 62, 90.5], [186, 39.5, 50.5, 62, 90.5],
  [192, 39, 50.5, 61.5, 90.5], [198, 38.5, 49.5, 60.5, 90.5], [204, 38, 48.5, 60.5, 90], [210, 37, 47.5, 59, 89],
  [216, 36, 47, 57, 87.5], [222, 35.5, 46, 56, 86], [228, 35, 45.5, 55, 85.5], [234, 35, 46, 56, 86],
  [240, 35, 47, 56.5, 87], [246, 35.5, 47.5, 57.5, 89], [252, 36, 49, 60, 92], [258, 38, 51, 63.5, 97],
  [264, 41, 54, 67, 104], [270, 46.5, 60, 73, 112], [276, 52, 65.5, 81, 116.5], [282, 58.5, 75, 89, 122.5],
  [288, 67, 81, 97, 126.5], [294, 74, 88, 103, 129.5], [300, 80.5, 91.5, 109, 135.5],
]
const ANG = MAIN.map((r) => r[0])

loftSections(C, ANG, MAIN.map(([, rw, rj, cf, cb]) => [
  S(rw, -1, seats), // the padded field wall, dark green
  S(rw, 1.5, seats), // lower bowl, as low as the lidar has it
  S(rj - 1.2, 4.5, trim), // cross aisle
  S(rj, 4.5, glass), // club level glass under the middle deck
  S(rj, 9.6, trim), // the middle deck's fascia
  S(rj, 11, seats), // middle deck
  S(cf + 1, 15, glass), // suite glass
  S(cf + 1, 20, trim), // upper deck fascia
  S(cf + 1, 21.5, seats), // upper deck under the canopy
  S(cb - 4, 37, steel), // back wall under the canopy
  S(cb - 4, 44, null),
  S(cb - 1.5, 44, steel), // truss zone above the facade, set back
  S(cb - 1.5, 30, trim), // cream precast cap
  S(cb, 30, trim),
  S(cb, 26, brick), // red brick facade
  S(cb, -1, null),
]), brick)

// The canopy plate with its light rack.
loftSections(C, ANG, MAIN.map(([, , , cf, cb]) => [
  S(cf, 44, steel), // front edge
  S(cf, 47.6, steel), // light rack
  S(cf + 1.8, 47.6, steel),
  S(cf + 1.8, 46.2, trim), // white roof deck
  S(cb + 0.3, 45.6, trim), // back edge
  S(cb + 0.3, 44.6, steel), // underside
  S(cf, 44, null),
]), steel)

// Lamp beads in the rack, facing the field.
const interp = (rows: Row[], a: number, col: number) => {
  for (let i = 0; i < rows.length - 1; i++) if (a >= rows[i][0] && a <= rows[i + 1][0]) {
    const f = (a - rows[i][0]) / (rows[i + 1][0] - rows[i][0])
    return rows[i][col] + (rows[i + 1][col] - rows[i][col]) * f
  }
  return rows[rows.length - 1][col]
}
for (let a = 75; a <= 297; a += 3) {
  const cf = interp(MAIN, a, 3), d = dirOf(a)
  const n: V3 = [d[0], d[1], 0], t: V3 = [d[1], -d[0], 0]
  box(glass, at(a, cf - 0.35, 46.6 + F), [t, n, [0, 0, 1]], [1.1, 0.45, 0.6], true)
}

// Facade glass: a broad panel per 6° bay between brick piers, above the
// street behind home plate.
for (let i = 0; i < MAIN.length - 1; i++) {
  const [a0, , , , r0] = MAIN[i], [a1, , , , r1] = MAIN[i + 1]
  const p0 = at(a0, r0 + 0.06, 0), p1 = at(a1, r1 + 0.06, 0)
  const L = (u: number, z: number): V3 => [p0[0] + (p1[0] - p0[0]) * u, p0[1] + (p1[1] - p0[1]) * u, z + F]
  const am = (a0 + a1) / 2, d = dirOf(am)
  quad(glass, [L(0.18, 14), L(0.82, 14), L(0.82, 23), L(0.18, 23)], [d[0], d[1], 0])
}

// ---------------------------------------------------------------------------
// The outfield. A three-tier section, any tier collapsible:
// [θ, rw, a1, z1, z2, a2, z3, z4, a3, z5, zr] — tier 1 from the wall (1.5 m)
// to (a1, z1), a riser to z2, tier 2 to (a2, z3), a riser to z4, tier 3 to
// (a3, z5), a riser to the roof zr, which runs out to the outline.
type ORow = [number, number, number, number, number, number, number, number, number, number, number]
function outfieldLoft(rows: ORow[], roofEnd?: (a: number) => number) {
  loftSections(C, rows.map((r) => r[0]), rows.map(([a, rw, a1, z1, z2, a2, z3, z4, a3, z5, zr]) => {
    const ro = roofEnd ? roofEnd(a) : outR(a % 360)
    const riser = (lo: number, hi: number) => (hi >= lo ? glass : brick)
    return [
      S(rw, -1, seats),
      S(rw, 1.5, seats),
      S(a1, z1, riser(z1, z2)),
      S(a1, z2, seats),
      S(a2, z3, riser(z3, z4)),
      S(a2, z4, seats),
      S(a3, z5, z5 >= zr ? brick : trim),
      S(a3, zr, roof), // roof deck
      S(ro, zr, brick), // outer wall
      S(ro, -1, null),
    ]
  }), brick)
}
// Left-field corner (lidar, 6° steps).
outfieldLoft([
  [300, 80.5, 91.5, 4, 11, 103, 15, 20, 125, 28, 31],
  [306, 83.5, 96, 4.5, 12, 106, 16, 20, 127, 27, 31],
  [312, 93.5, 99.5, 3, 12, 109, 15, 20, 121, 27, 31],
  [318, 97.5, 103, 3, 12, 113, 14, 20, 128, 26, 31],
  [324, 101.5, 131, 7, 12, 131.2, 12, 12, 131.4, 12, 12],
])
// Centre field: low outfield seats and a deck behind (the board sits in it).
outfieldLoft([
  [324, 101.5, 131, 7, 12, 131.2, 12, 12, 131.4, 12, 12],
  [330, 102, 131, 7, 12, 131.2, 12, 12, 131.4, 12, 12],
  [336, 102.5, 134, 7, 12, 134.2, 12, 12, 134.4, 12, 12],
  [342, 103, 134, 7, 12, 134.2, 12, 12, 134.4, 12, 12],
  [348, 105, 128, 6, 12, 128.2, 12, 12, 128.4, 12, 12],
  [354, 105, 118, 5, 12, 118.2, 12, 12, 118.4, 12, 12],
  [360, 105.5, 118, 5, 12, 118.2, 12, 12, 118.4, 12, 12],
  [366, 106, 118, 5, 12, 118.2, 12, 12, 118.4, 12, 12],
  [372, 102.5, 124, 11, 14, 133, 14, 14, 133.2, 14, 14],
  [378, 100, 122, 11, 14, 131, 14, 14, 131.2, 14, 14],
  [384, 99, 116, 9, 9, 116.2, 9, 9, 116.4, 9, 9],
  [390, 96, 106, 7, 7, 106.2, 7, 7, 106.4, 7, 7],
  [396, 91.5, 105, 7, 7, 105.2, 7, 7, 105.4, 7, 7],
  [402, 89.5, 100, 7, 7, 100.2, 7, 7, 100.4, 7, 7],
  [408, 88, 99, 7, 7, 99.2, 7, 7, 99.4, 7, 7],
  [414, 83.5, 96, 6, 12, 104, 13, 20, 113, 22, 28],
])
// Right-field corner.
outfieldLoft([
  [414, 83.5, 96, 6, 12, 104, 13, 20, 113, 22, 28],
  [420, 79, 90, 4, 11, 100, 14, 18, 110, 28, 31],
  [426, 73, 87, 4, 11, 98, 15, 20, 108, 30, 31],
  [432, 65, 80.5, 4, 11, 95, 15, 20, 115, 30, 31],
])

// The right-field club block behind the Chop House, 31 m (lidar), between
// 40° and 54° from 123 m out to the outline.
{
  const ring: XY[] = []
  for (let a = 40; a <= 54; a += 2) { const d = dirOf(a); ring.push([C[0] + d[0] * 123, C[1] + d[1] * 123]) }
  for (let a = 54; a >= 40; a -= 2) { const d = dirOf(a), r = outR(a) - 0.3; ring.push([C[0] + d[0] * r, C[1] + d[1] * r]) }
  prism(ring, 0, 31 + F, brick, roof)
}
// The Chop House: two storeys of brick with glass, 18 m above the field.
prism(CHOP, 0, 17 + F, brick, null)
prism(CHOP, 17 + F, 18 + F, trim, roof) // cream cornice
{
  // its glass front facing the field (the long edge (54.9, 53.4)-(74.2, 28.5))
  const a: XY = [54.9, 53.4], b: XY = [74.2, 28.5]
  const e = unit([b[0] - a[0], b[1] - a[1], 0]), n: V3 = [-e[1], e[0], 0]
  const toField = n[0] * (C[0] - a[0]) + n[1] * (C[1] - a[1]) > 0 ? n : mul(n, -1)
  const P = (u: number, z: number): V3 => add([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, z + F], mul(toField, 0.06))
  quad(glass, [P(0.06, 9), P(0.94, 9), P(0.94, 15), P(0.06, 15)], toField)
}

// The video board in dead centre, facing home plate (lidar: x -26..12,
// y 86-91, top 48 m with the letters).
{
  const cx = -7, cy = 89
  const X: [V3, V3, V3] = [[1, 0, 0], [0, -1, 0], [0, 0, 1]] // facing home (-y)
  box(steel, [cx, cy, 35.5 + F], X, [19, 2.2, 9.5], true) // the board, 38 × 19 m
  box(glass, [cx, cy - 2.25, 35.5 + F], X, [17.6, 0.06, 8.4]) // the screen
  box(trim, [cx, cy, 46.6 + F], X, [12, 1, 1.6], true) // TRUIST PARK letters, as one white bar
  box(seats, [cx, cy + 2, 19 + F], X, [9, 3.5, 7], false) // dark green base structure
}

// The left-field board hung between the two left-field towers (lidar: a thin
// slab from (-82, 72) to (-67, 84), top 34 m), its screen toward home.
{
  const A: XY = [-82, 72], B: XY = [-67, 84]
  const e = unit([B[0] - A[0], B[1] - A[1], 0]), n0: V3 = [-e[1], e[0], 0]
  const n = n0[0] * (C[0] - A[0]) + n0[1] * (C[1] - A[1]) > 0 ? n0 : mul(n0, -1)
  const m: V3 = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, 28 + F]
  box(steel, m, [e, n, [0, 0, 1]], [9, 1, 6], true)
  box(glass, add(m, mul(n, 1.05)), [e, n, [0, 0, 1]], [8.2, 0.05, 5.2])
}

// Light towers: square steel masts with a white lamp head facing the field.
for (const [x, y] of [[-83, 70], [-65, 84], [44, 79], [62, 64]] as XY[]) {
  const toField = unit([C[0] - x, C[1] - y, 0]), t: V3 = [toField[1], -toField[0], 0]
  box(steel, [x, y, 28 + F], [t, toField, [0, 0, 1]], [1.1, 1.1, 28], false)
  box(steel, [x, y, 59 + F], [t, toField, [0, 0, 1]], [4.2, 1.4, 3.5], true)
  box(trim, add([x, y, 59 + F], mul(toField, 1.45)), [t, toField, [0, 0, 1]], [3.9, 0.06, 3.2])
}

// ---------------------------------------------------------------------------
const parts = [
  { part: seats, material: finish('braves-seat-green', 0x3f5f4c) },
  { part: brick, material: finish('truist-brick', 0xb0685a) },
  { part: trim, material: PALETTE.trim },
  { part: steel, material: finish('truist-steel', 0x4f565f) },
  { part: glass, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Truist Park', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 158, osm: 'relation/9051237', height: 64,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/atl-truist-park.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
