/**
 * Central Library, Brooklyn Public Library, Grand Army Plaza — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-brooklyn-public-library.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built straight from
 * the OSM coordinates. Anchor: area centroid of the OSM outline
 * way/250229992 (-73.9681095, 40.6722383).
 *
 * What it is: Githens & Keally's Art Deco central library of 1938–41, in
 * buff limestone, planned like an open book on the corner of Flatbush
 * Avenue and Eastern Parkway. Its spine faces Grand Army Plaza as a tall,
 * blank, concave wall whose middle holds a 50-foot entrance portal: bronze
 * doors under a screen of figures, between two gilded pylons carved in
 * relief. Lower blocks stand at both ends of the curve, each with one tall
 * window slot; the two wings run down Flatbush Avenue and Eastern Parkway
 * with ranks of tall window slots between plain piers. Behind the street
 * ranges stand taller ranges (the "pages"), and lower stack and service
 * blocks fill the angle between them round a service court.
 *
 * Covers and replaces: way/250229992, the only building part there. The
 * entrance steps stand outside it, on the plaza, as in reality.
 *
 * Evidence
 * - OSM (measured): the outline; its concave front is a true circular arc,
 *   radius 37.8 m about (-59.13, 48.85), from -70.5° to 4.9° (fitted to its
 *   18 vertices within 2 cm); Flatbush Avenue face 93.6 m, Eastern Parkway
 *   face 71.8 m; height=29.3; wikidata Q5061358.
 * - USGS lidar NY_NewYorkCity (2017). y = 0 is the street (45.3 m). Measured
 *   above it: the street ranges 18.4–19.5 m, about 8 m deep along Flatbush
 *   and 6 m along Eastern Parkway; the tall ranges behind them and the
 *   concave front 24.9–25.4 m, about 12 m deep, the Flatbush one ending
 *   near y = -16; the inner blocks 16.6 m; the stack and court roofs
 *   10.9 m; the rear blocks 18.4–19.7 m (west) and 15–16.7 m (east, with
 *   the half-round end); the north-east block 18.4–19.5 m.
 * - Photos (Wikimedia Commons): "Brooklyn Public Library (48291925691).jpg"
 *   and "Brooklyn Public Library - Central Library (48292030712).jpg" (Ajay
 *   Suresh, CC BY 2.0), the front and the Flatbush wing; "Brooklyn Public
 *   Library (93880p).jpg" (Rhododendrites, CC BY-SA 4.0), the front square
 *   on; "Brooklyn Public Library Jan 2010.jpg" (Chris Pruitt, CC BY-SA 2.0);
 *   "Brooklyn Public Library (2625883748).jpg" (David Berkowitz, CC BY 2.0);
 *   "Brooklyn Public Library by DS.JPG" (David Shankbone, CC BY-SA 3.0), the
 *   Eastern Parkway wing; "Brooklyn Public Library, central branch.jpg"
 *   (Davidwtucker77, CC BY-SA 4.0); "Brooklyn Public Library sunset jeh.JPG"
 *   (Jim.henderson, public domain); "BPL Central Library 001/002/003.jpg"
 *   (Kidfly182, CC BY-SA 4.0), the portal; "Brooklyn Library side photo
 *   Chris Elias 02.png" (Mobyblu, CC BY-SA 3.0).
 * - Published (Wikipedia, "Central Library (Brooklyn Public Library)"):
 *   1941; Art Deco; the entrance portal 50 ft (15 m) high, its gilded
 *   bronze figures by Thomas Hudson Jones.
 * - From the photos: the portal: a black screen 8 m wide and 16.5 m
 *   high (about two thirds of the curve's height), gilded pylons 2.2 m wide
 *   either side, BPL near its top; with its pylons about 12.4 m wide, set in the middle of the curve; the flanking blocks' single
 *   window slots; the wings' window slots (about 4.6 m apart, 2 m wide,
 *   2.5–16.5 m); the steps, about 2 m up to a terrace across the curve;
 *   the stone's buff colour.
 *
 * Estimated: where the tall ranges stop and the inner blocks start (lidar
 * steps rounded to whole metres); the steps' depth (7 m); the window slots
 * on the rear and court sides are left off, as no photo shows them.
 *
 * Doubts: the rear (south and east) faces and the service court are not in
 * any licensed photo; they are drawn plain from the lidar's heights.
 *
 * Simplified: the portal's relief figures are flat gilded pylons and a
 * dark screen; no lettering, lamps or railings.
 */
import { Part, type V3 } from './mesh'
import { arcWall } from './dc-white-house'
import { PALETTE, finish } from './palette'
import { edgeFrame, edgePanel, pslab, saveModel, type XY } from './nyc-dime-savings-bank'

const stone = new Part(), roof = new Part(), win = new Part(), gold = new Part(), door = new Part()

// ---- Plan (OSM way/250229992), counter-clockwise from the arc's north end.
const O: XY = [-59.134, 48.848], R = 37.801
const arcPt = (deg: number, r = R): XY => [O[0] + r * Math.cos((deg * Math.PI) / 180), O[1] + r * Math.sin((deg * Math.PI) / 180)]
const A0 = -70.5, A1 = 4.9
const arc = (a0: number, a1: number, n: number, r = R): XY[] => Array.from({ length: n + 1 }, (_, k) => arcPt(a0 + ((a1 - a0) * k) / n, r))

const REAR: XY[] = [
  [-1.17, -68.70], [-0.68, -68.44], [-0.02, -69.93], [0.40, -70.63], [1.39, -71.93], [3.14, -73.54], [5.36, -74.73],
  [7.73, -75.38], [9.36, -75.50], [11.00, -75.37], [12.58, -74.99], [14.10, -74.38], [15.15, -73.85], [16.15, -73.05],
  [17.33, -71.91], [18.32, -70.60], [19.39, -68.41], [19.63, -67.63], [19.93, -66.03], [20.64, -65.95], [27.59, -37.57],
  [4.66, -31.38], [3.31, -36.44], [0.05, -38.24],
]
/** The outline as mapped, clockwise. */
const FOOT: XY[] = [[48.74, 30.03], [38.89, 30.86], [38.93, 31.34], [22.37, 32.72], [21.52, 22.56], [25.75, 22.21], [23.69, 13.42], [31.86, 10.69], [30.51, 6.85], [28.91, 3.11], [27.08, -0.54], [25.03, -4.06], [22.75, -7.43], [20.27, -10.66], [17.58, -13.72], [16.16, -15.19], [13.20, -17.99], [11.65, -19.32], [6.37, -13.03], [0.44, -17.22], [-1.74, -13.29], [-10.96, -18.37], [0.05, -38.24], [3.31, -36.44], [4.66, -31.38], [27.59, -37.57], [20.64, -65.95], [19.93, -66.03], [19.63, -67.63], [19.39, -68.41], [18.73, -69.91], [18.32, -70.60], [17.33, -71.91], [16.15, -73.05], [14.82, -73.99], [14.10, -74.38], [12.58, -74.99], [11.00, -75.37], [9.36, -75.50], [7.73, -75.38], [6.93, -75.21], [5.36, -74.73], [3.14, -73.54], [1.95, -72.52], [1.39, -71.93], [0.40, -70.63], [-0.02, -69.93], [-0.68, -68.44], [-1.17, -68.70], [-46.53, 13.20], [-43.63, 14.37], [-40.84, 15.77], [-37.65, 17.77], [-35.65, 19.22], [-33.29, 21.26], [-31.10, 23.48], [-29.29, 25.66], [-27.32, 28.43], [-26.55, 29.73], [-25.74, 31.11], [-24.40, 33.92], [-23.28, 36.83], [-22.42, 39.82], [-21.81, 42.87], [-21.44, 45.96], [-21.33, 49.07], [-21.48, 52.05], [50.10, 46.22], [49.41, 38.08]]

// Street lines: Flatbush Avenue (A→B) and Eastern Parkway (C→D), each with an
// inward unit normal.
const FA: XY = [-1.17, -68.70], FB: XY = [-46.53, 13.20]
const EC: XY = [-21.48, 52.05], ED: XY = [50.10, 46.22]
const unitv = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / l, (b[1] - a[1]) / l] }
const uF = unitv(FA, FB), nF: XY = [uF[1], -uF[0]] // right of A→B: east, inward
const uE = unitv(EC, ED), nE: XY = [uE[1], -uE[0]] // right of C→D: south, inward
/** The point on Flatbush offset d inward, at northing y. */
const fAt = (d: number, y: number): XY => { const t = (y - (FA[1] + nF[1] * d)) / uF[1]; return [FA[0] + nF[0] * d + uF[0] * t, y] }
/** The point on Eastern Parkway offset d inward, at easting x. */
const eAt = (d: number, x: number): XY => { const t = (x - (EC[0] + nE[0] * d)) / uE[0]; return [x, EC[1] + nE[1] * d + uE[1] * t] }
/** Where a line (point p, direction u) meets the arc, as an angle in degrees. */
function arcHit(p: XY, u: XY, r = R): number {
  const dx = p[0] - O[0], dy = p[1] - O[1]
  const b = dx * u[0] + dy * u[1], c = dx * dx + dy * dy - r * r
  const disc = Math.sqrt(b * b - c)
  const hits = [-b - disc, -b + disc].map((t) => Math.atan2(p[1] + u[1] * t - O[1], p[0] + u[0] * t - O[0]) * 180 / Math.PI)
  return hits.find((a) => a >= A0 - 25 && a <= A1 + 25)!
}
/** Where two lines meet. */
function cross(p: XY, u: XY, q: XY, v: XY): XY {
  const den = u[0] * v[1] - u[1] * v[0]
  const t = ((q[0] - p[0]) * v[1] - (q[1] - p[1]) * v[0]) / den
  return [p[0] + u[0] * t, p[1] + u[1] * t]
}

const F8 = 8, F20 = 20, E6 = 6, E18 = 18, YT = -16, XT = 14
const a1 = arcHit([FA[0] + nF[0] * F8, FA[1] + nF[1] * F8], uF) // tall front starts
const a2 = arcHit([EC[0] + nE[0] * E6, EC[1] + nE[1] * E6], uE) // and ends
// The tall ranges' back: the two inner lines would only meet out on the plaza
// (the wings open at 64°), so they are joined by an arc 12 m behind the front.
const RB = R + 12
const b1 = arcHit([FA[0] + nF[0] * F20, FA[1] + nF[1] * F20], uF, RB)
const b2 = arcHit([EC[0] + nE[0] * E18, EC[1] + nE[1] * E18], uE, RB)
const BACK = arc(b2, b1, 8, RB)

// Heights above the street (lidar).
const H_LOW = 10.9, H_INNER = 16.6, H_RANGE = 19.3, H_REAR_E = 15.8, H_TALL = 25.1

// ---- Masses.
pslab(stone, FOOT, 0, H_LOW, 0.3, roof)
pslab(stone, REAR, 0, H_REAR_E, 0.3, roof)
// Flatbush range and the west rear block, ending in the flanking block on the curve.
const flatbush: XY[] = [FA, [0.05, -68.4], [0.05, YT], fAt(F8, YT), arcPt(a1), ...arc(a1, A0, 3).slice(1, -1), FB]
pslab(stone, flatbush, 0, H_RANGE, 0.35, roof)
// Eastern Parkway range and the north-east block, with its flanking block.
const eastern: XY[] = [EC, ...arc(A1, a2, 3).slice(1, -1), arcPt(a2), eAt(E6, XT), [XT, 33.4], [22.37, 32.72], [38.89, 30.86], [48.74, 30.03], [49.41, 38.08], ED]
pslab(stone, eastern, 0, H_RANGE, 0.35, roof)
// The inner blocks.
pslab(stone, [fAt(F20, YT), [0.05, YT], [0.05, 12], [12, 12], eAt(E18, 12), ...BACK], 0, H_INNER, 0.3, roof)
// The tall ranges and the concave front: the "book".
const tall: XY[] = [...arc(a1, a2, 32), eAt(E6, XT), eAt(E18, XT), ...BACK, fAt(F20, YT), fAt(F8, YT)]
pslab(stone, tall, 0, H_TALL, 0.35, roof)
// the concave front again, smooth-shaded, a hair in front of the faceted wall
arcWall(stone, O[0], O[1], R - 0.02, a1, a2, 32, 0, H_TALL - 0.35, false)

// ---- Window slots on the street fronts, between plain piers.
function slots(a: XY, b: XY, s0: number, s1: number, pitch: number, z0 = 2.5, z1 = 16.5, w = 1.9) {
  const n = Math.max(1, Math.round((s1 - s0) / pitch)), step = (s1 - s0) / n
  for (let k = 0; k < n; k++) {
    const s = s0 + step * (k + 0.5)
    edgePanel(win, a, b, s - w / 2, s + w / 2, z0, z1)
  }
}
// Flatbush runs A→B, its outward side to the west: draw on B→A.
{
  const L = edgeFrame(FB, FA).L
  slots(FB, FA, 14, L - 4, 4.6)
}
// Eastern Parkway: outward is north, so draw on D→C.
{
  const L = edgeFrame(ED, EC).L
  slots(ED, EC, 3, L - 12, 4.6)
}
// One tall slot on the face of each flanking block on the curve.
for (const [s0, s1] of [[A0, a1], [a2, A1]]) {
  const m = (s0 + s1) / 2, p = arcPt(m, R - 0.06), t: XY = [-Math.sin((m * Math.PI) / 180), Math.cos((m * Math.PI) / 180)]
  const q = (s: number, z: number): V3 => [p[0] + t[0] * s, p[1] + t[1] * s, z]
  // faces the arc's centre: wind so the normal points inward
  win.quad(q(1.0, 3.0), q(-1.0, 3.0), q(-1.0, 16.0), q(1.0, 16.0))
}

// ---- The portal in the middle of the curve.
{
  const m = (a1 + a2) / 2, rad = (m * Math.PI) / 180
  const n: XY = [-Math.cos(rad), -Math.sin(rad)] // toward the plaza
  const t: XY = [-Math.sin(rad), Math.cos(rad)]
  const c = arcPt(m)
  // across the tangent at the middle; the wall curves forward by s²/2R either side
  const P = (s: number, d: number, z: number): V3 => {
    const dd = d + (s * s) / (2 * R)
    return [c[0] + t[0] * s + n[0] * dd, c[1] + t[1] * s + n[1] * dd, z]
  }
  const face = (p: Part, s0: number, s1: number, z0: number, z1: number, d: number) => p.quad(P(s1, d, z0), P(s0, d, z0), P(s0, d, z1), P(s1, d, z1))
  const TERRACE = 2.0, TOP = 16.5, SW = 4.0, PW = 2.2, PD = 0.25
  // the black screen and doors: a dark recessed field across the middle
  face(door, -SW, SW, TERRACE, TOP, 0.05)
  // the stone reveal round it reads as a shallow recess
  face(stone, -SW - 0.01, -SW + 0.35, TERRACE, TOP, 0.08)
  face(stone, SW - 0.35, SW + 0.01, TERRACE, TOP, 0.08)
  // "BPL" near the top of the screen: three gilt blocks
  for (const sx of [-2.2, 0, 2.2]) face(gold, sx - 0.65, sx + 0.65, TOP - 2.6, TOP - 1.0, 0.1)
  // a gilt band across the screen over the doors
  face(gold, -SW + 0.35, SW - 0.35, 7.6, 8.1, 0.1)
  // the gilded pylons either side, standing the screen's full height, nearly flush
  for (const sg of [-1, 1]) {
    const s0 = sg * SW, s1 = sg * (SW + PW)
    const [lo, hi] = sg < 0 ? [s1, s0] : [s0, s1]
    face(gold, lo, hi, TERRACE, TOP, PD)
    gold.quad(P(lo, 0, TERRACE), P(lo, PD, TERRACE), P(lo, PD, TOP), P(lo, 0, TOP))
    gold.quad(P(hi, PD, TERRACE), P(hi, 0, TERRACE), P(hi, 0, TOP), P(hi, PD, TOP))
    gold.quad(P(lo, 0, TOP), P(lo, PD, TOP), P(hi, PD, TOP), P(hi, 0, TOP))
  }
}

// ---- Steps from the plaza to a terrace across the curve.
{
  const N = 6, DEPTH = 7, TERR = 2.0
  for (let k = 0; k < N; k++) {
    const r = R - DEPTH + (k * (DEPTH - 3)) / N
    const outer = arc(a1 + 1.5, a2 - 1.5, 24, R)
    const inner = arc(a2 - 1.5, a1 + 1.5, 24, r)
    pslab(stone, [...outer, ...inner], 0, (TERR * (k + 1)) / N, 0.05, true)
  }
}

await saveModel('nyc-brooklyn-public-library', 'Central Library, Brooklyn Public Library', [
  { part: stone, material: finish('bpl-limestone', 0xe3d2b9) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: gold, material: finish('bpl-gilt', 0xd2aa52) },
  { part: door, material: { ...PALETTE.entrance, color: 0x5b5046 } },
], { source: 'generators/nyc-brooklyn-public-library.ts', bearing: 0, osm: 'way/250229992', height: H_TALL }, 6500)
