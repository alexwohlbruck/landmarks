/**
 * Sixth and Guadalupe, 400 West 6th Street, Austin (2023, Gensler) —
 * original procedural geometry, CC0-1.0.
 * bun generators/atx-sixth-and-guadalupe.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 17.9: the model's axes follow Austin's street grid
 * (the outline's edges run at 18.0 and 107.8). Anchor = area centroid of
 * OSM way/972654803 ("Sixth and Guadalupe", 66 levels), -97.7467036,
 * 30.2696429. The model is the whole block: the tower, the 55 m podium on
 * its west and the 42 m parking garage on the north half.
 *
 * Identity (from the photos):
 *  1. A tall, slender glass tower in two stacked shafts: offices below,
 *     residences above, split at about 140 m by a dark recessed amenity
 *     floor with a ledge.
 *  2. The residential shaft's dark balcony field (concrete columns, a slab
 *     edge every floor) set between flush glass columns; on the north face
 *     the east glass column runs the full height beside it.
 *  3. A pale silver-glass crown band (~14 m) with a glass parapet, square on
 *     top, lit white at night.
 *  4. The north-west corner cut by a diagonal face that runs the full
 *     height, steeper on the residences than on the offices, so the upper
 *     shaft overhangs the lower slightly there (the "shift"); at its top a
 *     notch of balconies wraps the corner.
 *  5. A vertical slot of stacked terraces in the office shaft's north face,
 *     a pale vertical fin on its south face, and a sloped glass roof at the
 *     foot of the diagonal, over the garage.
 *
 * Evidence and numbers:
 *  - Not in the lidar: USGS 3DEP USGS_LPC_TX_Central_B1_2017 was flown in
 *    2017, before construction. No lidar heights.
 *  - published: 66 storeys, completed 2023 (Wikipedia, "Sixth and
 *    Guadalupe"; about 875 ft); OSM part way/972654806 height 268 m (55
 *    levels), way/972654804 55.2 m (14 levels), way/972654805 42.1 m (12
 *    levels). The top of the parapet is drawn at 268 m above the street,
 *    which stands ~3 m above the model's lowest ground (Mapterhorn: the
 *    block rises ~5 m from west to east), so 271 m in the model.
 *  - measured from "drone24" (the drone's EXIF GPS puts it 280 m NNE,
 *    bearing 25 deg; Mavic 3 at 24 mm equivalent, the image a straight
 *    crop, so ~3660 px focal, ~0.074 m/px at the north face, which gives
 *    3.3 m per residential floor): the amenity floor 136.5-141 m, the
 *    residences to 252 m, the crown band 252-266 m, the parapet 266-268 m;
 *    the north face's east glass column (30% of the face), the balcony
 *    field, the diagonal's balcony notch (top 23 m, first 40% of it); the
 *    office slot 14.5-22.5 m from the east end.
 *  - plan: OSM's outline and parts for the block, the podium and the
 *    tower's south-east corner (x 45.6, y -38 in the frame). The tower's
 *    west end and its diagonal are estimated from the photos, not OSM: in
 *    "drone24" the office shaft is ~59 m wide seen from the north and the
 *    residential ~56 m, where OSM's part (west end at x -31.4) would be
 *    ~74 m; so the shaft's west face is drawn at x -14.1 and the rest of
 *    OSM's part as the 55 m podium. The diagonal's angle comes from three
 *    readings that agree: its vanishing point and its width against the
 *    north face in "drone24" (0.30 residential, 0.46 office), and its
 *    width against the north face in "drone22" (0.8): about 50 deg off the
 *    north face on the offices and 55 deg on the residences, where OSM's
 *    diagonal is 33 deg.
 *  - the south fin from "lily" (46-53% along the south face); the south and
 *    east balcony stacks from "skyline23", a distant view from the ESE.
 *  - colours from the daylight photos: blue reflective glass (pulled
 *    lighter), dark slate balcony fields, pale silver crown band, grey and
 *    white garage panels.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  drone24   "ATX Tower under construction from the North (2024).jpeg" /
 *            "Sixth and Guadalupe, Austin, TX.jpg", TerraFrost, CC BY 4.0
 *            (completed tower from the NNE, 2024-09-29)
 *            https://commons.wikimedia.org/wiki/File:Sixth_and_Guadalupe,_Austin,_TX.jpg
 *  drone22   "Sixth and Guadalupe - Dec 2022.jpg", TerraFrost, CC BY-SA 4.0
 *            (from above, NNW, under construction)
 *            https://commons.wikimedia.org/wiki/File:Sixth_and_Guadalupe_-_Dec_2022.jpg
 *  lily      "Sixth and Gudalupe from the Southwest.png", Lily Wilkerson,
 *            CC BY-SA 4.0 (street level, SW, cladding unfinished at the top)
 *            https://commons.wikimedia.org/wiki/File:Sixth_and_Gudalupe_from_the_Southwest.png
 *  larry     "Sixth and Guadalupe Construction Austin Texas Nov 2022.jpg",
 *            Larry D. Moore, CC BY 4.0
 *            https://commons.wikimedia.org/wiki/File:Sixth_and_Guadalupe_Construction_Austin_Texas_Nov_2022.jpg
 *  skyline23 "Austin Texas skyline, December 2023 - Day.jpg" and "- Night.jpg",
 *            Steve, CC BY-SA 2.0 (from ~8 km ESE; the crown lit white)
 *            https://commons.wikimedia.org/wiki/File:Austin_Texas_skyline,_December_2023_-_Day.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: no photo of the finished tower from the south, east or west
 * close up; those faces' balcony stacks are placed from one distant view
 * and the under-construction "lily", and the residential shaft is drawn
 * flush with the offices on the south and east. In "skyline23" a lower
 * volume appears beside the crown on the north-east; the close "drone24"
 * shows the crown running unbroken over the whole north face, so it is
 * taken as a building behind. The tower's west end and diagonal are photo
 * estimates (a few metres either way) and differ from OSM's part. The
 * garage's and podium's facades are drawn plainly.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { prism, capPoly, wall, ledge, offset, save, type XY } from './atl-flatiron-building'

const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function triOut(p: Part, a: V3, b: V3, c: V3, out: V3) {
  if (dot3(cross3(sub3(b, a), sub3(c, a)), out) < 0) p.tri(a, c, b)
  else p.tri(a, b, c)
}
function quadOut(p: Part, a: V3, b: V3, c: V3, d: V3, out: V3) {
  triOut(p, a, b, c, out)
  triOut(p, a, c, d, out)
}
/** A flat band standing `o` off a wall from a to b (outside to the right of a→b), z0..z1, from s0 to s1 metres along it. */
function band(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, o = 0.06) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [t[1], -t[0], 0]
  const A: XY = [a[0] + t[0] * s0 + n[0] * o, a[1] + t[1] * s0 + n[1] * o]
  const B: XY = [a[0] + t[0] * s1 + n[0] * o, a[1] + t[1] * s1 + n[1] * o]
  quadOut(p, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1], n)
}
/** A small box standing out of a wall (a fin or a slab edge), d deep, from s0 to s1 along it. */
function fin(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, d: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const P = (s: number, o: number): XY => [a[0] + t[0] * s + n[0] * o, a[1] + t[1] * s + n[1] * o]
  prism(p, [P(s0, -0.05), P(s1, -0.05), P(s1, d), P(s0, d)].reverse() as XY[], z0, z1, p, Math.min(0.2, d / 3), true)
}

// ── Plan, in the model frame (x east, y north along the street grid, bearing 17.9) ──
// The block: OSM way/972654803, squared to the grid.
const X0 = -37.5, X1 = 45.6, Y0 = -38, Y1 = 43.2
// The tower's office shaft: OSM part way/972654806's south-east corner,
// its north face (y 11) and a diagonal NW face; the west end cut back to
// x -14.1 (see the header: the photos show the shaft about 59 m wide).
const DIAG: XY = [-0.6428, -0.766] // the office's diagonal face, NE→SW, 50° off the north face
const OFF: XY[] = [[-14.1, Y0], [X1, Y0], [X1, 11], [6, 11], [-14.1, -13]]
// The residential shaft: flush on the south, east and north, 1.5 m in on the diagonal and west.
const RES: XY[] = [[-12.6, Y0], [X1, Y0], [X1, 11], [3, 11], [-12.6, -11.3]]
// The west podium (OSM part way/972654804's west end, 55 m) and the parking garage (way/972654805, 42 m).
const PODW: XY[] = [[-31.4, Y0], [-14.1, Y0], [-14.1, -13], [-3.4, -0.2], [-31.4, -0.2]]
const GAR: XY[] = [[X0, Y0], [-31.4, Y0], [-31.4, -0.2], [-3.4, -0.2], [6, 11], [X1, 11], [X1, 21.1], [20.3, 21.1], [20.3, Y1], [X0, Y1]]

// ── Heights (m above the lowest ground; the street at the tower is ~3 m up) ──
const G = 3
const GAR_TOP = 42 + G - 1 // the garage, OSM 42 m (its ground is a little lower, on the west)
const POD_TOP = 55 + G - 1
const OFF_TOP = 136.5 + G // the office shaft's top band
const AMEN_TOP = 141 + G // the open amenity floor
const RES_TOP = 252 + G // balconies end; the crown band starts
const CROWN_TOP = 266 + G
const TOP = 268 + G // glass parapet

const glass = new Part(), balc = new Part(), trim = new Part(), roof = new Part(), crown = new Part(), gar = new Part()

const edges = (ring: XY[]) => ring.map((a, i) => [a, ring[(i + 1) % ring.length]] as [XY, XY])
const len = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])

// ── The garage and the west podium ──
prism(gar, GAR, 0, GAR_TOP, roof, 0.4)
prism(roof, PODW, 0, POD_TOP, roof, 0.4)
// garage: grey louvre bands, grouped (open parking: unlit at night)
for (const [a, b] of edges(GAR)) {
  const L = len(a, b)
  if (L < 8) continue
  for (let z = 8; z < GAR_TOP - 4; z += 9) band(roof, a, b, 1.2, L - 1.2, z, z + 4.5)
}
// podium: grey louvred walls, a few horizontal lines
for (const [a, b] of edges(PODW)) {
  const L = len(a, b)
  if (L < 6) continue
  for (let z = GAR_TOP + 3; z < POD_TOP - 2; z += 6) band(trim, a, b, 0.6, L - 0.6, z, z + 0.5)
}
// the sloped glass roof in front of the diagonal face, over the garage
{
  const A: XY = [6, 11], B: XY = [-14.1, -13], n: XY = [DIAG[1], -DIAG[0]] // outward (NW) normal
  const A2: XY = [A[0] + n[0] * 9, A[1] + n[1] * 9], B2: XY = [B[0] + n[0] * 9, B[1] + n[1] * 9]
  const zt = POD_TOP + 1, zb = GAR_TOP + 0.3
  quadOut(roof, [A2[0], A2[1], zb], [B2[0], B2[1], zb], [B[0], B[1], zt], [A[0], A[1], zt], [n[0], n[1], 1])
  triOut(roof, [A[0], A[1], zb], [A2[0], A2[1], zb], [A[0], A[1], zt], [-DIAG[0], -DIAG[1], 0])
  triOut(roof, [B[0], B[1], zb], [B2[0], B2[1], zb], [B[0], B[1], zt], [DIAG[0], DIAG[1], 0])
}

// ── The office shaft ──
prism(glass, OFF, 0, OFF_TOP - 3.5, null, 0)
prism(roof, OFF, OFF_TOP - 3.5, OFF_TOP, roof, 0.3)
// the amenity floor, set in 1.5 m, then the residential shaft
const AMEN: XY[] = offset(OFF, -1.5)
prism(balc, AMEN, OFF_TOP, AMEN_TOP, null, 0)
// office curtain wall: floor lines every three storeys (12.6 m) and mullions every ~9.5 m
for (const [a, b] of edges(OFF)) {
  const L = len(a, b)
  for (let z = 12.6; z < OFF_TOP - 6; z += 12.6) band(trim, a, b, 0.3, L - 0.3, z, z + 0.45)
  const n = Math.max(1, Math.round(L / 9.5))
  for (let k = 1; k < n; k++) band(trim, a, b, (L * k) / n - 0.22, (L * k) / n + 0.22, 1, OFF_TOP - 3.5)
}
// the office's vertical slot on the north face (stacked terraces) and the pale fin on the south
{
  const a: XY = [X1, 11], b: XY = [6, 11]
  band(balc, a, b, 14.5, 22.5, GAR_TOP, OFF_TOP - 3.5, 0.08)
  for (let z = GAR_TOP + 4.2; z < OFF_TOP - 4; z += 8.4) fin(trim, a, b, 14.5, 22.5, z, z + 0.6, 0.9)
  band(trim, [-14.1, Y0], [X1, Y0], 27.4, 31.4, 1, OFF_TOP - 3.5, 0.1)
}

// ── The residential shaft ──
prism(glass, RES, AMEN_TOP, RES_TOP, null, 0)
capPoly(roof, RES, AMEN_TOP, false) // its underside, where it overhangs the office's diagonal
// balcony fields: [face start, face end, s0, s1, z0, z1]
const RE = edges(RES) // 0 south, 1 east, 2 north, 3 diagonal, 4 west
const FIELDS: [number, number, number, number, number][] = [
  [2, 12.8, 42.4, AMEN_TOP, RES_TOP], // north: all but the east glass column
  [3, 0, 10.5, 229 + G, RES_TOP], // the diagonal's top, next to the north corner
  [4, 2, 24.7, AMEN_TOP, RES_TOP], // west
  [0, 26.6, 46.4, AMEN_TOP, RES_TOP], // south, the middle stack
  [1, 15.6, 26, AMEN_TOP, RES_TOP], // east, a narrow stack
]
for (const [e, s0, s1, z0, z1] of FIELDS) {
  const [a, b] = RE[e]
  band(balc, a, b, s0, s1, z0, z1, 0.06)
  // balcony slab edges every two storeys (6.6 m) and the concrete columns between bays
  for (let z = z0 + 6.6; z < z1 - 1; z += 6.6) fin(trim, a, b, s0, s1, z - 0.35, z + 0.35, 1.0)
  const n = Math.max(1, Math.round((s1 - s0) / 7.5))
  for (let k = 1; k < n; k++) {
    const s = s0 + ((s1 - s0) * k) / n
    band(trim, a, b, s - 0.4, s + 0.4, z0, z1, 0.1)
  }
}
// residential glass: floor lines every three storeys (~10 m) on the glass columns
for (const [a, b] of RE) {
  const L = len(a, b)
  for (let z = AMEN_TOP + 9.9; z < RES_TOP - 3; z += 9.9) band(trim, a, b, 0.3, L - 0.3, z - 0.2, z + 0.2, 0.04)
}
// the east glass column on the north face stands a little proud, with its terrace rail at the top
fin(glass, RE[2][0], RE[2][1], 0, 12.8, AMEN_TOP, RES_TOP, 0.8)

// ── The crown: a pale silver glass band over the whole plan, a glass parapet over it ──
prism(crown, RES, RES_TOP, CROWN_TOP, null, 0)
for (const [a, b] of RE) band(trim, a, b, 0.1, len(a, b) - 0.1, RES_TOP - 0.25, RES_TOP + 0.6, 0.12)
{
  const inner = offset(RES, -0.5)
  wall(glass, RES, CROWN_TOP, TOP)
  wall(glass, [...inner].reverse(), CROWN_TOP + 0.4, TOP)
  ledge(trim, RES, inner, TOP, true)
  capPoly(roof, inner, CROWN_TOP + 0.4, true)
}

if (import.meta.main) {
  await save('atx-sixth-and-guadalupe', 'Sixth and Guadalupe', [
    { part: glass, material: { ...PALETTE.window, color: 0x88a5c3 } },
    { part: balc, material: windowVariant(2, 0x5f7284) },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: crown, material: finish('neon-sixth-guadalupe-crown', 0xc3cfda, 0.4) },
    { part: gar, material: finish('sixth-guadalupe-podium', 0xd3d6d6) },
  ], { bearing: 17.9, height: TOP, replaces: ['way/972654803', 'way/972654804', 'way/972654805', 'way/972654806'] }, 6500)
}
