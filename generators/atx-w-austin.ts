/**
 * W Austin Hotel & Residences and ACL Live at the Moody Theater, Block 21,
 * 200 Lavaca Street, Austin (2010, Andersson-Wise / BOKA Powell) —
 * original procedural geometry, CC0-1.0.
 * bun generators/atx-w-austin.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 17.9: Austin's street grid (2nd and 3rd Streets
 * run along x, Lavaca and Guadalupe along y). Anchor = area centroid of OSM
 * way/134807228 ("W Austin", the whole of Block 21), -97.746953, 30.2656381.
 *
 * Identity (from the photos): a broad blue glass slab along 3rd Street,
 * its long faces framed by darker grey-blue edges and split by four
 * columns of recessed balconies; its lower third (the hotel floors) in
 * horizontal window bands under a dark band; the upper storeys opened up
 * in the balcony columns; all on a dark charcoal podium that fills the
 * block, the Moody Theater's taller box on the 2nd Street half.
 *
 * Evidence and numbers:
 *  - lidar: USGS 3DEP USGS_LPC_TX_Central_B1_2017 (2017 flight), 1 m grid
 *    read in the frame. Ground 3.3-4.4 m over the grid's ground_min, lowest
 *    at the south (2nd Street); every height here = lidar - 3.3. Measured:
 *    the tower x -43..22, y 13..40, roof 142 (a lower middle 140, a
 *    mechanical block to 145 at x 1..13); a low wing east of the tower,
 *    x 22..39, 19 m; the podium's middle strip (x -43..12, y -2..13) 20 m;
 *    the theater block (x -43..10, y -43..-2) 26.5 m; the east block
 *    (x 12..39, y -24..13) 19 m; the south-east corner 7 m.
 *  - OSM: the outline way/134807228; part way/516289346 (the tower, height
 *    145, 37 levels), whose east end (x 26) runs ~4 m past the lidar's; the
 *    lidar's end kept, the rest of the part is the 19 m wing.
 *  - published: 37 storeys, completed 2010 (OSM; Wikipedia "W Austin
 *    Hotel & Residences"; the brief's ~120 m is below the lidar's 142 m
 *    roof, and the lidar is used).
 *  - estimated from the photos ("lsm2" chiefly): the hotel band 27% of the
 *    tower above the podium; the balcony columns' widths and positions;
 *    the open top storeys; the podium's window bands.
 *
 * Photos:
 *  lsm1  "WHotelAustin-Jun2010.JPG", LoneStarMike, CC BY-SA 3.0 (from the
 *        south-west, the long south face) https://commons.wikimedia.org/wiki/File:WHotelAustin-Jun2010.JPG
 *  lsm2  "WHotelAustin-Jun2010-2.JPG", LoneStarMike, CC BY-SA 3.0 (from the
 *        south, the long face and the podium) https://commons.wikimedia.org/wiki/File:WHotelAustin-Jun2010-2.JPG
 *  wtm   "WHOtelDowntownAustin.JPG", WhisperToMe, CC0 (the dark podium and
 *        the tower from the street) https://commons.wikimedia.org/wiki/File:WHOtelDowntownAustin.JPG
 *  htN   "W Austin Hotel & Residences From North", ATXHarrisonTran (Flickr),
 *        CC BY-SA 2.0 https://www.flickr.com/photos/61343559@N05/5635857471
 * Look-only (seen, not relied on): wallyg's Flickr set "W Austin Hotel &
 * Residences" (CC BY-NC-ND 2.0). No commercial imagery.
 *
 * Doubts: no good open photo of the north face or of the theater's 2nd
 * Street front, so the north face mirrors the south and the theater box is
 * plain with a window band; the lidar's 142 m is well above the brief's
 * ~120 m. The podium colour is from shaded photos.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, windowVariant, finish } from './palette'
import { prism, ccw, box, edgePanels, save, type XY } from './atl-flatiron-building'

// ── Heights (m above the lowest ground; lidar - 3.3) ──
const TOP = 142, MECH = 145
const HOTEL0 = 21, HOTEL1 = 52 // the hotel floors' band on the tower
const POD_MID = 20, THEATER = 26.5, EAST = 19, SE = 7, WING = 19

// ── Plan ──
const TX0 = -42.9, TX1 = 22, TY0 = 13.2, TY1 = 40

const frame = new Part(), glassP = new Part(), win = new Part(), pod = new Part(), roof = new Part(), trim = new Part()

/** A flush panel on a face from a to b (outside to the right), s0..s1 along it, z0..z1. */
function face(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out = 0.06) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const P = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * out, a[1] + t[1] * s + n[1] * out, z]
  p.quad(P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1))
}
const faceLen = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])

// ── The podium: charcoal blocks over Block 21, each with a long glass ribbon ──
const PODS: [number, number, number, number, number][] = [
  [-42.75, 10.3, -43.0, -2, THEATER], // the Moody Theater box
  [-42.8, 12, -2, TY0 + 0.5, POD_MID],
  [12, 39.0, -23.7, TY0 + 0.5, EAST],
  [10.3, 27.1, -37.8, -23.7, SE],
  [TX1 - 0.5, 38.9, TY0, TY1, WING],
]
for (const [x0, x1, y0, y1, h] of PODS) {
  box(pod, x0, x1, y0, y1, 0, h, roof, 0.45)
  const c: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  for (let k = 0; k < 4; k++) {
    const a = c[k], b = c[(k + 1) % 4], L = faceLen(a, b)
    if (L < 4) continue
    // the ground-floor glazing, and the long glass ribbon near the top
    face(win, a, b, 1, L - 1, 0, 4)
    if (h > 12) face(glassP, a, b, 0.6, L - 0.6, h - 8, h - 3.6)
  }
}
// the W corner: a charcoal box cantilevered at the south-east corner of the
// east block, its pale W plaque on the corner (a plain sign panel)
box(pod, 32, 40.2, -25, -17, 8, EAST + 1.2, roof, 0.4, true)
face(trim, [32, -25], [40.2, -25], 4.2, 7.6, 11.5, 15.5, 0.08)
face(trim, [40.2, -25], [40.2, -17], 0.6, 4, 11.5, 15.5, 0.08)
face(glassP, [32, -25], [40.2, -25], 0.4, 3.8, 9.2, 11.2, 0.08)

// ── The tower: deep blue glass in grouped panels ──
const NOTCH_Z = TOP - 16, RIM = TOP - 1.6, NX = 10, NY = 6 // the open top corners
// lower body, full plan
prism(frame, ccw([[TX0, TY0], [TX1, TY0], [TX1, TY1], [TX0, TY1]]), 0, NOTCH_Z, null, 0)
// upper body: the plan with its four corners cut away, open (dark) storeys in the notches
const CROSS: XY[] = ccw([
  [TX0 + NX, TY0], [TX1 - NX, TY0], [TX1 - NX, TY0 + NY], [TX1, TY0 + NY], [TX1, TY1 - NY], [TX1 - NX, TY1 - NY],
  [TX1 - NX, TY1], [TX0 + NX, TY1], [TX0 + NX, TY1 - NY], [TX0, TY1 - NY], [TX0, TY0 + NY], [TX0 + NX, TY0 + NY],
])
prism(frame, CROSS, NOTCH_Z, TOP, roof, 0.4)
// the notches' floors (roof of the lower body) and their inner faces glazed dark
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  const xc = sx < 0 ? TX0 : TX1, yc = sy < 0 ? TY0 : TY1
  const xi = xc - sx * NX, yi = yc - sy * NY
  box(roof, Math.min(xc, xi), Math.max(xc, xi), Math.min(yc, yi), Math.max(yc, yi), NOTCH_Z - 0.6, NOTCH_Z, roof, 0)
  // the frame carries on round the cut corner: a corner post and the top rim
  box(frame, xc - (sx > 0 ? 1.4 : 0), xc + (sx < 0 ? 1.4 : 0), yc - (sy > 0 ? 1.4 : 0), yc + (sy < 0 ? 1.4 : 0), NOTCH_Z, RIM, null, 0)
  box(frame, Math.min(xc, xi), Math.max(xc, xi), yc - (sy > 0 ? 1.4 : 0), yc + (sy < 0 ? 1.4 : 0), RIM, TOP, roof, 0.3, true)
  box(frame, xc - (sx > 0 ? 1.4 : 0), xc + (sx < 0 ? 1.4 : 0), Math.min(yc, yi), Math.max(yc, yi), RIM, TOP, roof, 0.3, true)
  // a pale balcony slab line across each notch, every three storeys
  for (let z = NOTCH_Z + 4.8; z < RIM - 2; z += 4.8)
    box(trim, Math.min(xc, xi), Math.max(xc, xi), Math.min(yc, yi), Math.max(yc, yi), z - 0.25, z + 0.25, trim, 0, true)
}
box(roof, 1, 13, 22, 34, TOP, MECH, roof, 0.4)
// the notches' inner walls: dark open storeys
for (let k = 0; k < CROSS.length; k++) {
  const a = CROSS[k], b = CROSS[(k + 1) % CROSS.length]
  const onEdge = (q: XY) => Math.abs(q[0] - TX0) < 1e-6 || Math.abs(q[0] - TX1) < 1e-6 || Math.abs(q[1] - TY0) < 1e-6 || Math.abs(q[1] - TY1) < 1e-6
  const inner = !(onEdge(a) && onEdge(b) && (Math.abs(a[0] - b[0]) < 1e-6 ? Math.abs(a[0] - TX0) < 1e-6 || Math.abs(a[0] - TX1) < 1e-6 : Math.abs(a[1] - TY0) < 1e-6 || Math.abs(a[1] - TY1) < 1e-6))
  if (inner) face(win, a, b, 0.3, faceLen(a, b) - 0.3, NOTCH_Z + 0.3, RIM - 0.4)
}

// Long faces, as seen from outside left to right (lsm2): frame edge, then
// glass piers and four balcony columns.
const LONG: [number, number, 'g' | 'r'][] = []
{
  let s = 2
  for (const [w, k] of [[8, 'g'], [5, 'r'], [7, 'g'], [5, 'r'], [10.9, 'g'], [5, 'r'], [7, 'g'], [5, 'r'], [7, 'g']] as [number, 'g' | 'r'][]) {
    LONG.push([s, s + w, k]); s += w
  }
}
const longFaces: [XY, XY][] = [[[TX0, TY0], [TX1, TY0]], [[TX1, TY1], [TX0, TY1]]]
const shortFaces: [XY, XY][] = [[[TX1, TY0], [TX1, TY1]], [[TX0, TY1], [TX0, TY0]]]
const RES0 = HOTEL1 + 3, LEN = faceLen(longFaces[0][0], longFaces[0][1]), WID = TY1 - TY0
/** Glass in groups of three storeys from z0 to z1, skipping the notched ends above NOTCH_Z. */
function grouped(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, cut: number, L: number, step = 9.6, gap = 0.9) {
  for (let z = z0; z + 2 < z1; z += step) {
    const zb = Math.min(z + step - gap, z1)
    let u0 = s0, u1 = s1
    if (zb > NOTCH_Z) { u0 = Math.max(s0, cut); u1 = Math.min(s1, L - cut) }
    if (z < NOTCH_Z && zb > NOTCH_Z) { face(p, a, b, s0, s1, z, NOTCH_Z - 0.4); if (u1 - u0 > 0.5) face(p, a, b, u0, u1, NOTCH_Z, zb); continue }
    if (u1 - u0 > 0.5) face(p, a, b, u0, u1, z, zb)
  }
}
for (const [a, b] of longFaces) {
  // the hotel floors: wide horizontal bands, two storeys each, frame between
  for (let z = HOTEL0 + 1; z + 5 < HOTEL1; z += 6.4) face(glassP, a, b, 2, LEN - 2, z, z + 4.4)
  for (const [s0, s1, k] of LONG) {
    if (k === 'g') grouped(glassP, a, b, s0 + 0.2, s1 - 0.2, RES0, RIM, NX + 0.3, LEN)
    else grouped(trim, a, b, s0 + 0.3, s1 - 0.3, RES0, RIM, NX + 0.3, LEN, 9.6, 1.6) // the balcony columns: pale breaks
  }
}
for (const [a, b] of shortFaces) {
  for (let z = HOTEL0 + 1; z + 5 < HOTEL1; z += 6.4) face(glassP, a, b, 2, WID - 2, z, z + 4.4)
  grouped(glassP, a, b, 2, 10, RES0, RIM, NY + 0.3, WID)
  grouped(trim, a, b, 10.6, 16.2, RES0, RIM, NY + 0.3, WID, 9.6, 1.6)
  grouped(glassP, a, b, 16.8, WID - 2, RES0, RIM, NY + 0.3, WID)
}

if (import.meta.main) {
  await save('atx-w-austin', 'W Austin and ACL Live', [
    { part: glassP, material: windowVariant(2, 0x7193c0) },
    { part: win, material: PALETTE.window },
    { part: frame, material: finish('w-frame', 0x56709a) },
    { part: pod, material: finish('podium-charcoal', 0x4a4f57) },
    { part: trim, material: { ...PALETTE.trim, color: 0xd5dde5 } },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 17.9, height: MECH, replaces: ['way/134807228', 'way/516289346'] }, 5000)
}
