/**
 * JFK Airport air traffic control tower, Queens — procedural, CC0-1.0, no textures.
 * bun generators/nyc-jfk-control-tower.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing −29.2°, the grid of the tower's base building (OSM way/284907735's
 * walls) and of the airport's central terminal area. Anchor: area centroid of
 * that outline.
 *
 * Identifying features (photos): a tall square shaft of pale concrete; at the
 * top, a big glazed cab bulging out to one side as a rounded "bowl" with
 * three bands of glass over a tapering soffit, balanced by a plain box
 * cantilevered the other way; a small octagonal glass cab with a white
 * radome above both; a second, one-storey glazed ramp-control cab half way up,
 * on the bowl's side; a low grey base building round its foot, with a
 * walkway bridge running off to Terminal 4.
 *
 * Evidence
 * - OSM: way/284907735 (base building and the walkway, tagged 84.9 m),
 *   node/5561856349 (JFK Control Tower, height 98.45 m).
 * - Lidar: USGS 3DEP NY_NewYorkCity, flown 2017, 0.5 m, heights above the
 *   apron (4.2 m NAVD88), read in this frame
 *   (work/nyc-jfk-control-tower/lidar.json): main cab roof 85.5–86.5 m over
 *   x −9…14, y −21…10 (the bowl on −y, the box on +y, x −1…8); upper cab and
 *   radome 92–97 m centred (2, −6); mid cab roof 38–39 m on −y, to y −21;
 *   base 14.3 m over x −13…16, y −26…−6, 10 m to its south end, 5–7 m on its
 *   north part; the walkway 13.8 m.
 * - Published: 1994, Pei Cobb Freed & Partners; 321 ft (98 m) (Wikipedia,
 *   "John F. Kennedy International Airport"; OSM node height agrees).
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:ControlTowerJFK-July2012-01.JPG
 *     (Rehman Abubakr, CC BY-SA 4.0) the whole tower and base, bowl side;
 *   https://commons.wikimedia.org/wiki/File:JFK_Airport_Tower_02.JPG
 *     (Ad Meskens, CC BY-SA 3.0) box side, upper cab, mid cab;
 *   https://commons.wikimedia.org/wiki/File:JFK_Airport_Tower_and_Terminal.jpg
 *     (Eheik, public domain);
 *   https://commons.wikimedia.org/wiki/File:JFK_Control_Tower.jpg
 *     (Pat Guiney, CC BY 2.0) from the apron, far.
 *
 * Estimated from the photos (scaled against the lidar's 86 m cab roof and
 * 14 m base): the shaft's 12 m square (hidden from the lidar under the cab),
 * the bowl's soffit (from 68 m) and its three glass bands, the box's depth
 * and its glazed underside, the mid cab's glass (32–37 m), the upper cab's
 * octagon and glass, the radome. Rails, antennas and the base building's
 * plant are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, capPoly, finishModel, area, unit, quadN, facade, type Facade } from './nyc-570-lexington'

const conc = new Part(), win = new Part(), trim = new Part(), panel = new Part(), roof = new Part()
const SX = 2, SY = -5, S = 6 // shaft centre and half-width

const ccw = (r: XY[]) => (area(r) < 0 ? r.slice().reverse() : r)
/** A "D" in plan: straight back at yBack, a squarish rounded front reaching `depth` towards −y. */
function dShape(cx: number, yBack: number, rx: number, depth: number, n = 14): XY[] {
  const pts: XY[] = []
  for (let i = 0; i <= n; i++) {
    const t = Math.PI + (i / n) * Math.PI // π…2π: the −y half
    const c = Math.cos(t), s = Math.sin(t)
    const e = 2.6 // superellipse exponent: rounded-square
    pts.push([cx + rx * Math.sign(c) * Math.abs(c) ** (2 / e), yBack + depth * Math.sign(s) * Math.abs(s) ** (2 / e)])
  }
  return ccw(pts)
}
const scaleAbout = (r: XY[], cx: number, cy: number, k: number): XY[] => r.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k])
/** Smooth-sided loft between two rings of equal count, z0 → z1. */
function band(p: Part, r0: XY[], z0: number, r1: XY[], z1: number, closed = true) {
  const n = r0.length
  const nrm = (r: XY[], i: number): V3 => {
    const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]
    return unit([b[1] - a[1], a[0] - b[0], (z1 - z0) > 0 ? 0 : 0])
  }
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const j = (i + 1) % n
    const tilt = (r0[i][0] - r1[i][0]) ** 2 + (r0[i][1] - r1[i][1]) ** 2 > 0.01
    if (tilt) p.quad([r0[i][0], r0[i][1], z0], [r0[j][0], r0[j][1], z0], [r1[j][0], r1[j][1], z1], [r1[i][0], r1[i][1], z1])
    else quadN(p, [r0[i][0], r0[i][1], z0], [r0[j][0], r0[j][1], z0], [r1[j][0], r1[j][1], z1], [r1[i][0], r1[i][1], z1], [nrm(r0, i), nrm(r0, j), nrm(r0, j), nrm(r0, i)])
  }
}

// --- Base building: 7 m overall, the south block to 14.3 m (10 m at its far end) ---
const BASE: XY[] = [[7.6, 10.6], [7.5, 6.4], [21.3, 6.4], [21.5, -4.7], [19.8, -4.7], [19.7, -31.6], [9.4, -31.6], [9.5, -38.8], [-3.5, -38.5], [-3.6, -31.8], [-13.5, -31.4], [-13.5, -5.8], [-15.1, -5.8], [-15.2, 6.5], [-2.3, 6.5], [-2.1, 10.7]]
const baseFacade: Facade = { bay: 5, ratio: 0.85, floor: 1.8, group: 1, spandrel: 0, sill: 3.4, head: 1.2, ground: 3.4, minLength: 4 }
function block(ring0: XY[], z1: number, f: Facade | null) {
  const ring = ccw(ring0)
  for (let i = 0; i < ring.length; i++) facade(panel, f ? win : null, ring[i], ring[(i + 1) % ring.length], 0, z1 - 0.4, f)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    trim.quad([a[0] + n[0] * 0.1, a[1] + n[1] * 0.1, z1 - 0.4], [b[0] + n[0] * 0.1, b[1] + n[1] * 0.1, z1 - 0.4], [b[0] + n[0] * 0.1, b[1] + n[1] * 0.1, z1], [a[0] + n[0] * 0.1, a[1] + n[1] * 0.1, z1])
  }
  capPoly(roof, ring, z1)
}
block(BASE, 7, baseFacade)
block([[-13.2, -26], [19.4, -26], [19.4, -6.1], [-13.2, -6.1]], 14.3, { ...baseFacade, sill: 9.2, ground: 9.2, head: 1.6 })
block([[-13.2, -31.3], [19.4, -31.3], [19.4, -26], [-13.2, -26]], 10, null)

// --- The walkway to Terminal 4: 8.8–13.8 m on piers ---
{
  const x0 = 0.7, x1 = 5.1, y0 = 10.7, y1 = 61.7, z0 = 8.8, z1 = 13.8
  const ring: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  for (let i = 0; i < 4; i++) {
    const a = ring[i], b = ring[(i + 1) % 4]
    panel.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
    if (i % 2 === 1) win.quad(...([[a, 9.9], [b, 9.9], [b, 12.6], [a, 12.6]] as [XY, number][]).map(([p, z]) => [p[0] + (i === 1 ? 0.05 : -0.05), p[1], z] as V3) as [V3, V3, V3, V3])
  }
  capPoly(roof, ring, z1); capPoly(panel, ring, z0, false)
  for (const y of [24, 40, 56]) for (const x of [x0 + 0.6, x1 - 0.6]) {
    const r = 0.45
    const sq: V3[] = [[x - r, y - r, 0], [x + r, y - r, 0], [x + r, y + r, 0], [x - r, y + r, 0]]
    conc.loft([sq, sq.map(([a, b]) => [a, b, z0] as V3)])
  }
}

// --- The shaft: a 10 m square with softened corners, base roof to the cab ---
{
  const c = 0.6
  const sq: XY[] = [[SX - S + c, SY - S], [SX + S - c, SY - S], [SX + S, SY - S + c], [SX + S, SY + S - c], [SX + S - c, SY + S], [SX - S + c, SY + S], [SX - S, SY + S - c], [SX - S, SY - S + c]]
  band(conc, sq, 13.9, sq, 86.3)
}

// --- The main cab: the glazed bowl on −y, the plain box on +y, one roof over both ---
const BOWL = dShape(SX + 0.5, SY - 2, 11.5, 13) // reaches y −21, x −9…14
const ctr: XY = [SX + 0.5, SY - 2]
{
  const z = [67.5, 71.5, 75.8, 76.3, 80.3, 80.8, 85.0]
  const k = [0.62, 0.97, 1.0, 1.0, 1.02, 1.02, 1.04]
  const R = k.map((kk) => scaleAbout(BOWL, ctr[0], ctr[1], kk))
  capPoly(trim, R[0], z[0], false)
  band(trim, R[0], z[0], R[1], z[1], false) // soffit, closed along the back by the shaft
  band(win, R[1], z[1], R[2], z[2], false)
  band(trim, R[2], z[2], R[3], z[3], false)
  band(win, R[3], z[3], R[4], z[4], false)
  band(trim, R[4], z[4], R[5], z[5], false)
  band(win, R[5], z[5], R[6], z[6], false)
  const top = scaleAbout(BOWL, ctr[0], ctr[1], 1.06)
  band(trim, R[6], z[6], top, 85.4, false)
  band(trim, top, 85.4, top, 86.3, false)
  capPoly(roof, top, 86.3)
  // the back of the bowl where it leaves the shaft's sides (flat walls, concrete)
  for (const side of [0, R[6].length - 1]) {
    const p0 = R[0][side], p1 = top[side]
    const sx = side === 0 ? -1 : 1
    void sx
    conc.quad([p0[0], p0[1], z[0]], [p0[0], SY - S + 0.01, z[0]], [p1[0], SY - S + 0.01, 86.3], [p1[0], p1[1], 86.3])
    conc.quad([p1[0], p1[1], 86.3], [p1[0], SY - S + 0.01, 86.3], [p0[0], SY - S + 0.01, z[0]], [p0[0], p0[1], z[0]])
  }
  // The box: x −1…8, from the shaft to y 10, 70–86.3 m, glass under its belly.
  const bx0 = -2.2, bx1 = 9.2, by0 = SY + S, by1 = 10
  const sides: [XY, XY][] = [[[bx1, by0], [bx1, by1]], [[bx1, by1], [bx0, by1]], [[bx0, by1], [bx0, by0]]]
  for (const [a, b] of sides) {
    win.quad([a[0], a[1], 70], [b[0], b[1], 70], [b[0], b[1], 73.2], [a[0], a[1], 73.2])
    conc.quad([a[0], a[1], 73.2], [b[0], b[1], 73.2], [b[0], b[1], 85.7], [a[0], a[1], 85.7])
    trim.quad([a[0], a[1], 85.7], [b[0], b[1], 85.7], [b[0], b[1], 86.3], [a[0], a[1], 86.3])
  }
  const bring: XY[] = [[bx0, by0], [bx1, by0], [bx1, by1], [bx0, by1]]
  capPoly(conc, bring, 70, false)
  capPoly(roof, bring, 86.3)
}

// --- The mid (ramp control) cab: one band of glass, 31–38.6 m, bowl side ---
{
  const D = dShape(SX + 0.5, SY - 2, 10.5, 13)
  const z = [31.0, 33.0, 37.4]
  const k = [0.7, 0.98, 1.02]
  const R = k.map((kk) => scaleAbout(D, ctr[0], ctr[1], kk))
  capPoly(trim, R[0], z[0], false)
  band(trim, R[0], z[0], R[1], z[1], false)
  band(win, R[1], z[1], R[2], z[2], false)
  const top = scaleAbout(D, ctr[0], ctr[1], 1.04)
  band(trim, R[2], z[2], top, 38.0, false)
  band(trim, top, 38.0, top, 38.6, false)
  capPoly(roof, top, 38.6)
  for (const side of [0, R[2].length - 1]) {
    const p0 = R[0][side], p1 = top[side]
    conc.quad([p0[0], p0[1], z[0]], [p0[0], SY - S + 0.01, z[0]], [p1[0], SY - S + 0.01, 38.6], [p1[0], p1[1], 38.6])
    conc.quad([p1[0], p1[1], 38.6], [p1[0], SY - S + 0.01, 38.6], [p0[0], SY - S + 0.01, z[0]], [p0[0], p0[1], z[0]])
  }
}

// --- The upper cab: an octagon of glass leaning out, a white roof and radome ---
{
  const oct = (r: number): XY[] => Array.from({ length: 8 }, (_, i) => { const t = Math.PI / 8 + (i * Math.PI) / 4; return [SX + r * Math.cos(t), SY + r * Math.sin(t)] as XY })
  band(conc, oct(4.6), 86.3, oct(4.6), 87.6)
  band(win, oct(4.4), 87.6, oct(5.3), 92.4)
  band(trim, oct(5.3), 92.4, oct(5.5), 93.3)
  capPoly(trim, oct(5.5), 93.3)
  // radome
  const n = 12, rings: [number, number][] = [[1.9, 93.3], [1.9, 94.8], [1.65, 95.9], [1.0, 96.7], [0.01, 97.1]]
  for (let j = 0; j < rings.length - 1; j++) for (let i = 0; i < n; i++) {
    const a0 = (i / n) * 2 * Math.PI, a1 = ((i + 1) / n) * 2 * Math.PI
    const P = ([r, z]: [number, number], a: number): V3 => [SX + r * Math.cos(a), SY + r * Math.sin(a), z]
    const N = (jj: number, a: number): V3 => unit([Math.cos(a), Math.sin(a), jj / 2])
    quadN(trim, P(rings[j], a0), P(rings[j], a1), P(rings[j + 1], a1), P(rings[j + 1], a0), [N(j, a0), N(j, a1), N(j + 1, a1), N(j + 1, a0)])
  }
}

finishModel('JFK Airport Air Traffic Control Tower', 'nyc-jfk-control-tower', [
  { part: conc, material: finish('jfk-tower-concrete', 0xe6e2da) },
  { part: win, material: PALETTE.window },
  { part: trim, material: PALETTE.trim },
  { part: panel, material: finish('jfk-tower-panel', 0xbfc1c2) },
  { part: roof, material: PALETTE.roof },
], { bearing: -29.2, osm: 'way/284907735', height: 97.1 }, 5000)
