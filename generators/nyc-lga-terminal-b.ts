/**
 * LaGuardia Airport Terminal B (headhouse and its two pedestrian bridges) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-lga-terminal-b.ts
 *
 * Map frame: x = east, y = north, z up, metres; bearing 0 (the headhouse is a
 * long curve, so there is no single axis). Anchor: area centroid of the OSM
 * headhouse outline way/644536343.
 *
 * Identifying features: the long curving headhouse (HOK, opened 2018–2020)
 * with its glass upper storeys under a deep, thin roof edge on the landside;
 * the two glazed pedestrian bridges that leave its airside and cross the
 * taxiway high enough for aircraft to pass under, to the Eastern and Western
 * concourses. The concourses themselves and the parking garage are left to
 * the map (not replaced).
 *
 * Evidence
 * - OSM: way/644536343 (Terminal B, 4 levels, no height), way/664461080 (East
 *   Pedestrian Bridge) and way/701356157 (West Pedestrian Bridge), both
 *   min_height 20.12 m (66 ft), height 29.57 m (97 ft). Footprints used as
 *   mapped, in this frame.
 * - Published: two pedestrian bridges over an active taxiway, about 450 ft
 *   long, letting aircraft up to a Boeing 737 pass beneath; headhouse opened
 *   in stages 2018–2020 (Wikipedia, "LaGuardia Airport").
 * - Photos (Wikimedia Commons, daylight, landside only):
 *   https://commons.wikimedia.org/wiki/File:Grand_Central_Pkwy_td_(2022-01-14)_043_-_LaGuardia_Airport_Terminal_B_Tower.jpg
 *   https://commons.wikimedia.org/wiki/File:Grand_Central_Pkwy_td_(2022-01-14)_044_-_LaGuardia_Airport_Terminal_B.jpg
 *   https://commons.wikimedia.org/wiki/File:Grand_Central_Pkwy_td_(2022-01-14)_041_-_LaGuardia_Airport_Terminal_B_Tower.jpg
 *     (Tdorante10, CC BY-SA 4.0): the landside front, a band of glass over
 *     the roadway viaducts under a flat roof whose thin edge cantilevers out
 *     with an up-tilted soffit; pale grey panels.
 *   https://commons.wikimedia.org/wiki/File:LGA_Airport_Terminal_B_Departures.jpg
 *     (JakeTheFanner, CC BY-SA 4.0): the departures canopy and white columns.
 * - Lidar: USGS NY_NewYorkCity was flown in 2017, during construction, so it
 *   is not used for any height.
 *
 * Estimated: the headhouse roof at 25 m (scaled in the 043 photo from the
 * upper roadway deck, taken as ~9 m), the glass band from 12 to 23 m, the
 * eave 4 m deep; the west strip towards the garage at 12 m; the bridges'
 * glazing bands; their piers (two pairs near each end; their real positions
 * are not photographed).
 * Doubts: no licensed photo shows the airside, the bridges or the roof from
 * above. The brief describes the roof as wavy and the bridges as arched;
 * neither could be checked, so the roof is flat and the bridges are drawn as
 * straight glazed boxes on OSM's footprints and heights, with a shallow arched
 * roof as the only nod to their shape. Treat the bridges as plain massing
 * until photos confirm their form.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, windowVariant } from './palette'
import { type XY, capPoly, finishModel, facade, area, unit, quadN, type Facade } from './nyc-570-lexington'

const wall = new Part(), win = new Part(), roof = new Part(), trim = new Part(), bglass = new Part()

// OSM way/644536343 in this frame (centroid origin, bearing 0).
const HEAD: XY[] = [[-110.5, -26.5], [-127.5, -27.8], [-146.7, -30.1], [-165.1, -32.9], [-181.6, -36.3], [-201.1, -41.1], [-202.7, -33.9], [-204.1, -27.8], [-165.7, -17.3], [-136.4, -9.5], [-112.1, -8.3], [-116.9, 100.5], [-115.8, 102.2], [-113.2, 106.1], [-111.7, 108.3], [-108.0, 107.9], [-102.9, 107.1], [-90.7, 104.8], [-93.7, 99.7], [-67.8, 97.0], [-61.0, 96.2], [-59.4, 103.1], [-53.9, 102.2], [-36.6, 97.3], [-14.7, 87.8], [-2.5, 80.1], [12.3, 68.0], [76.5, 9.6], [72.0, 5.1], [77.0, 0.0], [92.0, -13.3], [95.7, -7.8], [135.6, -41.9], [206.3, -103.5], [225.5, -118.2], [215.0, -132.1], [211.1, -137.1], [175.4, -111.4], [142.1, -90.6], [117.5, -77.8], [71.7, -60.1], [63.8, -57.7], [48.3, -52.9], [37.2, -50.0], [33.0, -49.0], [21.5, -45.9], [19.1, -45.3], [1.2, -41.9], [-10.6, -39.6], [-13.9, -39.0], [-17.1, -38.7], [-42.0, -36.1], [-45.4, -35.7], [-56.4, -35.2], [-60.5, -35.0], [-76.9, -34.2], [-86.4, -34.3], [-91.5, -34.4], [-110.3, -34.6], [-110.4, -28.5]]
const BRIDGE_E: XY[] = [[72.0, 5.1], [76.5, 9.6], [98.7, 28.7], [117.2, 44.6], [136.8, 61.5], [139.4, 63.9], [141.7, 66.3], [143.3, 68.4], [145.4, 71.2], [148.9, 76.5], [152.5, 82.5], [165.5, 102.5], [184.6, 85.3], [178.3, 80.0], [154.2, 59.5], [127.4, 36.4], [124.0, 33.3], [121.1, 30.2], [118.9, 27.8], [116.3, 24.5], [112.6, 19.0], [106.1, 8.7], [95.7, -7.8], [92.0, -13.3], [77.0, 0.0]]
const BRIDGE_W: XY[] = [[-46.6, 236.0], [-45.3, 241.7], [-20.1, 236.6], [-36.9, 208.5], [-51.7, 139.2], [-59.4, 103.1], [-60.9, 96.2], [-67.8, 97.0], [-93.7, 99.7], [-90.7, 104.8], [-64.7, 152.7]]

const H = 25, H_STRIP = 12, GLASS0 = 12, GLASS1 = 23
const ccw = (r: XY[]) => (area(r) < 0 ? r.slice().reverse() : r)

// --- The headhouse: split at x = −110 into the main body and the low west strip ---
const glassFacade: Facade = { bay: 6, ratio: 0.92, floor: 5.5, group: 2, spandrel: 0.9, sill: 0, head: 0, ground: 0, minLength: 3 }
const lowFacade: Facade = { bay: 8, ratio: 0.85, floor: 4, group: 1, spandrel: 0, sill: 1.2, head: 6.8, ground: 1.2, minLength: 6 }
function clipX(ring: XY[], x0: number, keepRight: boolean): XY[] {
  const ins = (p: XY) => (keepRight ? p[0] >= x0 : p[0] <= x0)
  const out: XY[] = []
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (ins(a)) out.push(a)
    if (ins(a) !== ins(b)) { const t = (x0 - a[0]) / (b[0] - a[0]); out.push([x0, a[1] + (b[1] - a[1]) * t]) }
  }
  return out
}
const main = ccw(clipX(HEAD, -110.45, true)), strip = ccw(clipX(HEAD, -110.45, false))
// Edges on the bridges' roots are left open where the bridges meet (they are drawn by the bridges).
for (let i = 0; i < main.length; i++) {
  const a = main[i], b = main[(i + 1) % main.length]
  if (Math.abs(a[0] + 110.45) < 0.01 && Math.abs(b[0] + 110.45) < 0.01) { // the cut against the low strip: plain wall above it
    facade(wall, null, a, b, H_STRIP, H - 0.4, null); continue
  }
  // lower storeys: plain panels with punched window bands; upper: the glass band
  facade(wall, win, a, b, 0, GLASS0, lowFacade)
  facade(wall, win, a, b, GLASS0, GLASS1, glassFacade)
  facade(wall, null, a, b, GLASS1, H - 0.4, null)
}
capPoly(roof, main, H)
for (let i = 0; i < strip.length; i++) {
  const a = strip[i], b = strip[(i + 1) % strip.length]
  if (Math.abs(a[0] + 110.45) < 0.01 && Math.abs(b[0] + 110.45) < 0.01) continue
  facade(wall, win, a, b, 0, H_STRIP - 0.4, lowFacade)
}
capPoly(roof, strip, H_STRIP)
// Coping lips round both roofs.
function lipRing(p: Part, ring: XY[], z0: number, z1: number, d: number) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1e-6) continue
    const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    const A: XY = [a[0] + n[0] * d, a[1] + n[1] * d], B: XY = [b[0] + n[0] * d, b[1] + n[1] * d]
    p.quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1])
    p.quad([A[0], A[1], z1], [B[0], B[1], z1], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}
lipRing(trim, main, H - 0.4, H + 0.05, 0.15)
lipRing(trim, strip, H_STRIP - 0.4, H_STRIP + 0.05, 0.15)

// --- The landside roof edge: a thin cantilever along the curved front, soffit tilting up ---
{
  // the front: from the east tip (211.1, −137.1) west to (−110.3, −34.6)
  const i0 = HEAD.findIndex(([x, y]) => x === 211.1 && y === -137.1), i1 = HEAD.findIndex(([x, y]) => x === -110.3 && y === -34.6)
  const front = HEAD.slice(i0, i1 + 1) // runs westward; the outside is to its left
  const D = 6, zT = H + 0.05, zB0 = H - 2.2, zB1 = H - 0.7
  const off = front.map((p, k) => {
    const a = front[Math.max(0, k - 1)], b = front[Math.min(front.length - 1, k + 1)]
    const t = unit([b[0] - a[0], b[1] - a[1], 0]) // westward tangent
    const n: XY = [-t[1], t[0]] // left of travel = outward (south)
    return [p[0] - n[0] * -D, p[1] - n[1] * -D] as XY
  })
  for (let k = 0; k < front.length - 1; k++) {
    const a = front[k], b = front[k + 1], A = off[k], B = off[k + 1]
    // top (faces up): wall edge to outer edge
    trim.quad([b[0], b[1], zT], [a[0], a[1], zT], [A[0], A[1], zT], [B[0], B[1], zT])
    // outer fascia (faces out)
    const n = unit([A[0] - a[0], A[1] - a[1], 0])
    quadN(trim, [A[0], A[1], zB1], [B[0], B[1], zB1], [B[0], B[1], zT], [A[0], A[1], zT], [n, n, n, n])
    // soffit: from the wall at zB0 up to the fascia at zB1 (faces down and out)
    trim.quad([a[0], a[1], zB0], [b[0], b[1], zB0], [B[0], B[1], zB1], [A[0], A[1], zB1])
  }
  // end caps
  for (const k of [0, front.length - 1]) {
    const a = front[k], A = off[k]
    const P = [[a[0], a[1], zB0], [A[0], A[1], zB1], [A[0], A[1], zT], [a[0], a[1], zT]] as V3[]
    trim.quad(P[0], P[1], P[2], P[3]); trim.quad(P[3], P[2], P[1], P[0])
  }
}

// --- The pedestrian bridges: OSM footprints, 20.1–29.6 m, glazed, on piers near each end ---
const B0 = 20.12, B1 = 29.57, BG0 = 21.4, BG1 = 27.6
function bridge(ring0: XY[], piers: XY[]) {
  const ring = ccw(ring0)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    // skip the edges against the headhouse (inside its outline)
    const q = (p: Part, z0: number, z1: number) => p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
    if (HEAD_INSIDE(m)) { q(trim, H, B1 - 0.3); continue } // the end standing above the headhouse roof
    q(trim, B0, BG0); q(bglass, BG0, BG1); q(trim, BG1, B1 - 0.3)
  }
  capPoly(trim, ring, B0, false)
  capPoly(roof, ring, B1 - 0.3)
  lipRing(trim, ring, B1 - 0.5, B1, 0.12)
  for (const [x, y] of piers) {
    const r = 1.1, n = 10
    const ringAt = (z: number, rr: number): V3[] => Array.from({ length: n }, (_, k) => { const t = (2 * Math.PI * k) / n; return [x + rr * Math.cos(t), y + rr * Math.sin(t), z] as V3 })
    const lo = ringAt(0, r), hi = ringAt(B0, r * 0.85)
    for (let k = 0; k < n; k++) {
      const j = (k + 1) % n
      const na = unit([Math.cos((2 * Math.PI * k) / n), Math.sin((2 * Math.PI * k) / n), 0]), nb = unit([Math.cos((2 * Math.PI * j) / n), Math.sin((2 * Math.PI * j) / n), 0])
      quadN(trim, lo[k], lo[j], hi[j], hi[k], [na, nb, nb, na])
    }
  }
}
function HEAD_INSIDE(pt: XY) {
  let hit = false
  for (let i = 0, j = HEAD.length - 1; i < HEAD.length; j = i++) {
    const a = HEAD[i], b = HEAD[j]
    if ((a[1] > pt[1]) !== (b[1] > pt[1]) && pt[0] < ((b[0] - a[0]) * (pt[1] - a[1])) / (b[1] - a[1]) + a[0]) hit = !hit
  }
  return hit
}
bridge(BRIDGE_E, [[101, 18], [111, 12], [160, 82], [168, 75]])
bridge(BRIDGE_W, [[-74, 120], [-58, 117], [-44, 222], [-31, 220]])

finishModel('LaGuardia Airport Terminal B', 'nyc-lga-terminal-b', [
  { part: wall, material: PALETTE.stone },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: trim, material: PALETTE.trim },
  { part: bglass, material: windowVariant(2, 0xa9bfd1) },
], { bearing: 0, osm: 'way/644536343', height: B1 }, 5000)
