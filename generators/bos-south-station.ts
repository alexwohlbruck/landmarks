/**
 * South Station headhouse, Boston (1899, Shepley, Rutan & Coolidge): the
 * curved granite Classical Revival front on Dewey Square, where Atlantic
 * Avenue and Summer Street meet, with its Ionic colonnades, the pediment and
 * the clock attic crowned by an eagle — original procedural geometry,
 * CC0-1.0.
 * bun generators/bos-south-station.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 345: +y is the axis of the curved front (compass
 * 345, toward Dewey Square), so the clock stands on x = 3.7 and the two
 * wings run back from the curve: -x along Atlantic Avenue, +x along Summer
 * Street. Anchor -71.05517, 42.35196 = the area centroid of the headhouse's
 * two OSM building:parts, way/241933476 (the stone V of the headhouse) and
 * way/241933504 (the concourse inside the V).
 *
 * Not modelled: the train shed, the bus terminal and South Station Tower
 * (way/1253315804). The station's OSM outline way/29742438 covers all of
 * those as well, so it is not in `replaces`; only the two headhouse parts
 * are.
 *
 * Identity (from the photos below):
 *  1. The front is one curve (the OSM outline fits a circle of radius 40.1 m
 *     to 0.5 m, centre (3.7, -7.0), from 40.8° to 139°), on a rusticated
 *     two-storey base.
 *  2. Giant Ionic columns stand three storeys tall in front of a recessed
 *     wall: in the centre, two single columns, a pair, the central bay, a
 *     pair and two single columns; then a pavilion pier each side rising
 *     above the balustrade; then four columns on each curving side; then an
 *     end pier where the wings begin.
 *  3. A low pediment over the central bay and, behind it, the tall clock
 *     attic with its round-topped centre, the clock, and the eagle on top.
 *  4. Three big round-arched entrances in the base under the centre.
 *  5. Pinkish-tan Stony Creek granite all over; plain wings with paired
 *     windows and round-arched ground-floor windows.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021 flight), 1 m
 * grid, read with tools/lidar_frame.py at bearing 345; the street is 4.8 m
 * above the grid's ground_min. Measured above the street: roof 29.2;
 * pavilion piers 32.7; pediment apex 31.5; clock attic shoulders 37.0; the
 * round crest about 39.5; the eagle's top 43.2; the concourse roof 16.9.
 * The lidar's front edge sits 1–2 m beyond the OSM curve (lidar/OSM
 * registration); the OSM curve is used.
 *
 * Ground: the map's terrain (Mapterhorn) is about 1.5 m higher at the
 * Dewey Square front than at the wing ends and the concourse's south side
 * (lidar ground is flat within 0.6 m; Mapterhorn is coarse there). The
 * model's base is the low wing ends, so every lidar height is raised by
 * Z0 = 1.2 and the front's doors and arches start at z = 1.4. Elevation 0.
 *
 * Estimated from the photos (South Station from 45 High Street, scaled to
 * the lidar's 29.2 m roof and checked against the Atlantic Avenue view):
 * base 12.5 m; columns 12.5–25.5 (1.4 m across); entablature to 28.5;
 * balustrade to about 31; the column positions along the curve (centre
 * pairs at ±4.3/±6.1 m of arc, singles ±10.2/±13.8, pavilion piers ±16–19.5,
 * side columns ±21.2…31.4); the recess depth (2.6 m); the arches (5.6 m
 * wide, springing at 8.6); the clock (radius 1.8 m, centre 36 m); the
 * window bays on the wings (about 4.3 m).
 *
 * Night: the front is floodlit (the CC0 night photo below), the windows
 * and the arched entrances glow, and the clock face is lit (`neon-clock`).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - South Station from 45 High Street, June 2012.JPG, Pi.1415926535,
 *    CC BY-SA 3.0 (the front from above, square on)
 *    https://commons.wikimedia.org/wiki/File:South_Station_from_45_High_Street,_June_2012.JPG
 *  - South Station from Atlantic Avenue, September 2010.jpg, Michael Hicks,
 *    CC BY 2.0 (the curve and the Atlantic Avenue wing)
 *    https://commons.wikimedia.org/wiki/File:South_Station_from_Atlantic_Avenue,_September_2010.jpg
 *  - South Station from Dewey Square, November 2019.jpg, Another Believer,
 *    CC BY-SA 4.0 (the front at dusk, lit windows)
 *    https://commons.wikimedia.org/wiki/File:South_Station_from_Dewey_Square,_November_2019.jpg
 *  - South Station top.jpg, Beyond My Ken, CC BY-SA 4.0 (the clock attic and
 *    eagle close up)
 *    https://commons.wikimedia.org/wiki/File:South_Station_top.jpg
 *  - Bus lane on Summer Street at South Station, December 2019.JPG,
 *    Pi.1415926535, CC BY-SA 3.0 (the Summer Street wing)
 *    https://commons.wikimedia.org/wiki/File:Bus_lane_on_Summer_Street_at_South_Station,_December_2019.JPG
 *  - South Station headhouse at night, January 2017 (Unsplash xKQIz 5XjY).jpg,
 *    Osman Rana, CC0 (night)
 *    https://commons.wikimedia.org/wiki/File:South_Station_headhouse_at_night,_January_2017_(Unsplash_xKQIz_5XjY).jpg
 * No commercial imagery. Published: architect and date from the National
 * Register listing via Wikipedia (South Station).
 *
 * Doubts: the concourse's walls (glass toward the tracks) are drawn plain
 * from OSM's tags only; the wings' window rhythm is simplified to one bay
 * pattern; the balustrade is a solid band; the eagle and the attic's
 * carving are reduced to bold masses; the red awnings are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, band, onWall, rectShape, revolve } from './atl-tech-tower'
import { ccw, circle, offset, prism, save, smoothWall, wall, type XY } from './atl-flatiron-building'

const gran = new Part(), roof = new Part(), win = new Part(), glass = new Part(), clock = new Part(), door = new Part()

const Z0 = 1.2 // lidar heights above the front street → model z (see header)
const CX = 3.68, CY = -7.04, R = 40.1, D = 2.6
const T1 = (40.8 * Math.PI) / 180, T2 = (139.0 * Math.PI) / 180, TM = (T1 + T2) / 2
// arc length s from the axis, + toward Summer Street (smaller angles)
const th = (s: number) => TM - s / R
const S_END = ((T2 - T1) / 2) * R // 34.3
const P = (s: number, r: number): XY => [CX + r * Math.cos(th(s)), CY + r * Math.sin(th(s))]

const BASE = 13.7, COL0 = 13.7, COL1 = 27.2, ENT = 31.0, ROOF = 30.4, BAL = 33.1

// ── helpers ──
/** An annular sector between radii r0 < r1 and arc lengths s0 < s1, as a solid. */
function arcBand(p: Part, top: Part | null, r0: number, r1: number, s0: number, s1: number, z0: number, z1: number, bev = 0.2) {
  const n = Math.max(2, Math.ceil((s1 - s0) / 3))
  const outer: XY[] = [], inner: XY[] = []
  for (let i = 0; i <= n; i++) {
    const s = s1 - ((s1 - s0) * i) / n // decreasing s = increasing angle = CCW
    outer.push(P(s, r1)); inner.push(P(s, r0))
  }
  prism(p, ccw([...outer, ...inner.reverse()]), z0, z1, top, bev)
}
/** A curved panel on the face of radius r between s0 and s1 (facing out). */
function arcPanel(p: Part, r: number, s0: number, s1: number, z0: number, z1: number) {
  const n = Math.max(1, Math.ceil((s1 - s0) / 3))
  for (let i = 0; i < n; i++) {
    const a = s1 - ((s1 - s0) * i) / n, b = s1 - ((s1 - s0) * (i + 1)) / n
    const A = P(a, r), B = P(b, r)
    p.quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1])
  }
}
/** A flat shape on the tangent plane of the curve at s, `out` beyond radius r; pts are [ds, z]. */
function onArc(p: Part, s: number, r: number, pts: [number, number][], out: number) {
  const t = th(s)
  const n: XY = [Math.cos(t), Math.sin(t)], ts: XY = [Math.sin(t), -Math.cos(t)] // +s direction
  const c = P(s, r + out)
  // onWall's wall runs a→b with its outside to the right; a→b along -s puts the outside at +n.
  const a: XY = [c[0] + ts[0] * 50, c[1] + ts[1] * 50], b: XY = [c[0] - ts[0] * 50, c[1] - ts[1] * 50]
  onWall(p, a, b, pts.map(([d, z]) => [50 - d, z] as [number, number]), 0)
  void n
}
const sag = (w: number, r: number) => (w * w) / (8 * r)

// ── plan ──
const A1: XY = P(-S_END, R), S1: XY = P(S_END, R)
const inset: XY[] = []
for (let i = 0; i <= 24; i++) inset.push(P(S_END - (2 * S_END * i) / 24, R - D))
const HH: XY[] = ccw([
  S1, ...inset, A1,
  [-53.9, -19.5], [-56.25, -21.35], [-57.01, -23.17], [-57.06, -25.35], [-55.82, -27.1], [-52.34, -29.69],
  [-39.15, -39.52], [-7.17, 2.99], [18.09, 4.15], [49.96, -35.84], [67.77, -21.01],
])
const CONC: XY[] = ccw([
  [-39.15, -39.52], [-19.27, -39.04], [-17.35, -39.01], [-17.46, -35.18], [-7.38, -20.7], [-1.68, -18.32], [5.15, -17.06],
  [11.86, -18.34], [17.31, -21.0], [28.42, -34.84], [29.16, -36.62], [34.19, -36.43], [49.96, -35.84], [18.09, 4.15], [-7.17, 2.99],
])

// ── the headhouse body ──
prism(gran, HH, 0, ROOF, roof, 0)
// parapet round the wings' roofs (the front's balustrade is drawn on the curve)
{
  const o = HH, i = offset(HH, -0.45)
  wall(gran, o, ROOF, BAL - 0.2)
  wall(gran, [...i].reverse(), ROOF, BAL - 0.2)
  const n = o.length
  for (let k = 0; k < n; k++) {
    const l = (k + 1) % n
    gran.quad([i[k][0], i[k][1], BAL - 0.2], [o[k][0], o[k][1], BAL - 0.2], [o[l][0], o[l][1], BAL - 0.2], [i[l][0], i[l][1], BAL - 0.2])
  }
}
// rusticated base and the main cornice round the straight faces
band(gran, HH, 0, BASE - 0.5, 0.25, gran)
band(gran, HH, BASE - 0.5, 0.6, 0.55, gran)
band(gran, HH, ENT - 0.7, 0.8, 0.6, gran)

// ── the curved front ──
// base, projecting a little, its cornice, the entablature, cornice and balustrade
arcBand(gran, gran, R - D, R + 0.25, -S_END, S_END, 0, BASE - 0.5, 0)
arcBand(gran, gran, R - D, R + 0.55, -S_END, S_END, BASE - 0.5, BASE + 0.1, 0.2)
arcBand(gran, gran, R - D, R + 0.2, -S_END, S_END, COL1, ENT - 0.5, 0)
arcBand(gran, gran, R - D, R + 0.7, -S_END, S_END, ENT - 0.5, ENT + 0.2, 0.25)
arcBand(gran, gran, R - D, R - 0.1, -S_END, S_END, ENT + 0.2, BAL, 0.12)
// piers: the pavilion piers flanking the centre rise above the balustrade
for (const sg of [-1, 1]) {
  const [a, b] = sg > 0 ? [16, 19.5] : [-19.5, -16]
  arcBand(gran, gran, R - D, R + 0.35, a, b, BASE, BAL + 0.8, 0.3)
  const [c, d] = sg > 0 ? [32.6, S_END] : [-S_END, -32.6]
  arcBand(gran, null, R - D, R + 0.05, c, d, BASE, COL1, 0)
}
// columns: shaft, capital and base
const COLS = [4.3, 6.1, 10.2, 13.8, 21.2, 24.6, 28.0, 31.4]
for (const s0 of COLS) for (const s of [-s0, s0]) {
  const c = P(s, R - 1.05)
  smoothWall(gran, circle(c, 0.75, 10), COL0 + 0.6, COL1 - 0.8)
  revolve(gran, c, [[0.75, COL1 - 0.8], [1.0, COL1 - 0.45], [1.05, COL1]], 8, 0, false, false)
  revolve(gran, c, [[1.0, COL0], [1.0, COL0 + 0.35], [0.75, COL0 + 0.6]], 8, 0, false, false)
}
// windows on the recessed wall between the columns, two storey groups
for (const [s, w] of [[-2.1, 1.5], [0, 1.5], [2.1, 1.5], [8.15, 2.6], [12.0, 2.1], [14.9, 1.4], [22.9, 2.4], [26.3, 2.4], [29.7, 2.4]] as [number, number][]) {
  for (const ss of s <= 2.1 && s >= -2.1 ? [s] : [-s, s]) {
    arcPanel(win, R - D + 0.06, ss - w / 2, ss + w / 2, COL0 + 0.9, COL0 + 6.2)
    arcPanel(win, R - D + 0.06, ss - w / 2, ss + w / 2, COL0 + 7.1, COL1 - 0.7)
  }
}
// the base: three great arches under the centre, two rows of windows elsewhere
const GF = 1.4
for (const s of [-10.0, 0, 10.0]) {
  const rb = R + 0.25
  onArc(gran, s, rb, archShape(0, 6.6, GF, 8.6, 10), sag(6.6, rb) + 0.03)
  onArc(win, s, rb, archShape(0, 5.6, 5.6, 8.6, 10), sag(6.6, rb) + 0.08)
  onArc(door, s, rb, rectShape(-2.6, 2.6, GF, 5.4), sag(6.6, rb) + 0.08)
}
for (const s0 of [5.2, 15.0, 17.75, 22.9, 26.3, 29.7]) for (const s of [-s0, s0]) {
  const rb = R + 0.25
  const w = s0 === 17.75 ? 1.6 : 2.0
  onArc(win, s, rb, rectShape(-w / 2, w / 2, 2.6, 5.6), sag(w, rb) + 0.04)
  onArc(win, s, rb, rectShape(-w / 2, w / 2, 7.4, 10.6), sag(w, rb) + 0.04)
}

// ── the pediment, the clock attic and the eagle ──
{
  const yF = CY + R + 0.75, yB = yF - 3.6, hw = 7.6, z0 = ENT + 0.2, z1 = ENT + 3.1
  const L: V3 = [CX - hw, yF, z0], Rr: V3 = [CX + hw, yF, z0], Tp: V3 = [CX, yF, z1]
  const Lb: V3 = [CX - hw, yB, z0], Rb: V3 = [CX + hw, yB, z0], Tb: V3 = [CX, yB, z1]
  gran.tri(L, Rr, Tp)
  gran.quad(Rr, Rb, Tb, Tp)
  gran.quad(Lb, L, Tp, Tb)
  // the tympanum's raking cornice, a thin lip standing proud of the face
  for (const sg of [-1, 1]) {
    const e: V3 = [CX + sg * (hw + 0.3), yF + 0.25, z0 - 0.1], t: V3 = [CX, yF + 0.25, z1 + 0.15]
    const e2: V3 = [e[0], yF - 0.3, e[2]], t2: V3 = [t[0], yF - 0.3, t[2]]
    const lo = (v: V3): V3 => [v[0], v[1], v[2] - 0.45]
    const f = sg > 0 ? [t, e, lo(e), lo(t)] : [e, t, lo(t), lo(e)]
    gran.quad(f[0], f[1], f[2], f[3])
    gran.quad(sg > 0 ? e2 : t2, sg > 0 ? t2 : e2, sg > 0 ? t : e, sg > 0 ? e : t)
  }
  // the attic: shoulders to 38.2, a round-topped centre framing the clock
  const aF = CY + R - 0.6, aB = aF - 3.2, ah = 6.6, ZS = 38.6
  prism(gran, [[CX - ah, aB], [CX + ah, aB], [CX + ah, aF], [CX - ah, aF]], ENT, ZS, gran, 0.3)
  prism(gran, [[CX - ah - 0.35, aB - 0.35], [CX + ah + 0.35, aB - 0.35], [CX + ah + 0.35, aF + 0.35], [CX - ah - 0.35, aF + 0.35]], ZS - 0.7, ZS - 0.1, gran, 0.2)
  // the round crest: a semicircle of radius 3.3 over a 6.6 m centre panel
  const cr = 3.0, cz = ZS + 0.2, seg = 12
  const prof: XY[] = [[-cr, ENT + 3.2]]
  for (let i = 0; i <= seg; i++) { const a = Math.PI - (i / seg) * Math.PI; prof.push([cr * Math.cos(a), cz + cr * Math.sin(a)]) }
  prof.push([cr, ENT + 3.2])
  const cF = aF + 0.45, cB = aB + 0.4
  const ring: XY[] = prof.map(([u, z]) => [CX + u, z])
  // extrude the (x, z) outline along y: front, back and the edges
  for (let i = 1; i < ring.length - 1; i++) {
    gran.tri([ring[0][0], cF, ring[0][1]], [ring[i + 1][0], cF, ring[i + 1][1]], [ring[i][0], cF, ring[i][1]])
    gran.tri([ring[0][0], cB, ring[0][1]], [ring[i][0], cB, ring[i][1]], [ring[i + 1][0], cB, ring[i + 1][1]])
  }
  for (let i = 0; i < ring.length - 1; i++) {
    const a = ring[i], b = ring[i + 1]
    gran.quad([a[0], cF, a[1]], [b[0], cF, b[1]], [b[0], cB, b[1]], [a[0], cB, a[1]])
  }
  // the clock: a dark ring and the lit face
  const cc: XY = [CX, 37.5]
  onWall(win, [CX + 10, cF], [CX - 10, cF], circle([10, cc[1]], 2.15, 16), 0.04)
  onWall(clock, [CX + 10, cF], [CX - 10, cF], circle([10, cc[1]], 1.75, 16), 0.09)
  // hands at ten to two, dark
  const hand = (ang: number, l: number, w: number) => {
    const ux = Math.cos(ang), uz = Math.sin(ang)
    onWall(win, [CX + 10, cF], [CX - 10, cF], [[10 - uz * w, cc[1] + ux * w], [10 + uz * w, cc[1] - ux * w], [10 + ux * l + uz * w, cc[1] + uz * l - ux * w], [10 + ux * l - uz * w, cc[1] + uz * l + ux * w]], 0.13)
  }
  hand((50 * Math.PI) / 180, 1.15, 0.12)
  hand((150 * Math.PI) / 180, 1.45, 0.09)
  // the eagle on its pedestal over the crest: a bold body, head and raised wings
  const ez = cz + cr - 0.3, ey = (cF + cB) / 2
  prism(gran, [[CX - 1.0, ey - 0.8], [CX + 1.0, ey - 0.8], [CX + 1.0, ey + 0.8], [CX - 1.0, ey + 0.8]], ez - 0.4, ez + 0.9, gran, 0.15)
  const b0 = ez + 0.9
  revolve(gran, [CX, ey + 0.1], [[0.0, b0], [0.7, b0 + 0.25], [0.78, b0 + 0.9], [0.55, b0 + 1.6], [0.32, b0 + 2.0], [0.36, b0 + 2.35], [0.22, b0 + 2.65], [0, b0 + 2.8]], 10)
  for (const sg of [-1, 1]) {
    const root0: V3 = [CX + sg * 0.45, ey - 0.15, b0 + 0.5], root1: V3 = [CX + sg * 0.45, ey - 0.15, b0 + 1.8]
    const tip0: V3 = [CX + sg * 1.55, ey - 0.65, b0 + 1.0], tip1: V3 = [CX + sg * 1.3, ey - 0.75, b0 + 2.75]
    const q = sg > 0 ? [root0, tip0, tip1, root1] : [tip0, root0, root1, tip1]
    gran.quad(q[0], q[1], q[2], q[3])
    const back = (v: V3): V3 => [v[0], v[1] - 0.3, v[2]]
    gran.quad(back(q[1]), back(q[0]), back(q[3]), back(q[2]))
    gran.quad(q[1], back(q[1]), back(q[2]), q[2])
  }
}

// ── the wings' straight faces ──
type F = [XY, XY]
const flen = (f: F) => Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])
const wingFaces: F[] = [
  [A1, [-53.9, -19.5]], // Atlantic Avenue
  [[67.77, -21.01], S1], // Summer Street
]
const endFaces: F[] = [
  [[-52.34, -29.69], [-39.15, -39.52]], // Atlantic wing end
  [[49.96, -35.84], [67.77, -21.01]], // Summer wing end
]
function bays(f: F, m0: number, m1: number, step: number) {
  const L = flen(f), n = Math.max(1, Math.round((L - m0 - m1) / step)), w = (L - m0 - m1) / n
  return Array.from({ length: n }, (_, k) => m0 + (k + 0.5) * w)
}
for (const f of [...wingFaces, ...endFaces]) {
  const isWing = wingFaces.includes(f)
  const ss = isWing ? (f === wingFaces[0] ? bays(f, 3.0, 2.5, 4.3) : bays(f, 2.5, 3.0, 4.3)) : bays(f, 2.0, 2.0, 4.0)
  for (const s of ss) {
    // base: round-arched ground floor windows and the mezzanine row, on the rustication
    onWall(win, f[0], f[1], archShape(s, 2.2, 1.6, 5.2, 8), 0.3)
    onWall(win, f[0], f[1], rectShape(s - 0.85, s + 0.85, 7.6, 10.8), 0.3)
    // upper storeys in two groups of two, paired windows per bay
    for (const d of [-0.75, 0.75]) {
      onWall(win, f[0], f[1], rectShape(s + d - 0.5, s + d + 0.5, COL0 + 0.9, COL0 + 7.2), 0.06)
      onWall(win, f[0], f[1], rectShape(s + d - 0.5, s + d + 0.5, COL0 + 8.0, ENT - 1.4), 0.06)
    }
  }
}
// the inner faces of the V, above the concourse roof
const CONC_H = 18.1
for (const f of [[[-39.15, -39.52], [-7.17, 2.99]], [[18.09, 4.15], [49.96, -35.84]]] as F[]) {
  for (const s of bays(f, 3, 3, 4.3)) for (const d of [-0.75, 0.75]) onWall(win, f[0], f[1], rectShape(s + d - 0.5, s + d + 0.5, CONC_H + 1.6, ENT - 1.4), 0.06)
}

// ── the concourse inside the V ──
prism(glass, CONC, 0, CONC_H, roof, 0)
band(roof, CONC, CONC_H - 0.5, 0.6, 0.25, roof)
for (let i = 0; i < CONC.length; i++) {
  const a = CONC[i], b = CONC[(i + 1) % CONC.length]
  // mullion piers on the glass, every 4.5 m, so it reads as a framed wall
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 6) continue
  const n = Math.round(L / 4.5)
  for (let k = 1; k < n; k++) onWall(roof, a, b, rectShape((k * L) / n - 0.2, (k * L) / n + 0.2, 0, CONC_H - 0.5), 0.05)
}

// ── night: the curved front floodlit ──
const lit = (p: V3, n: V3) => {
  if (n[2] > 0.7) return 0.1
  const dx = p[0] - CX, dy = p[1] - CY, r = Math.hypot(dx, dy)
  const front = r > R - D - 0.5 && dy > 10 && (dx * n[0] + dy * n[1]) / r > 0.3
  return front ? 0.85 : 0.15
}
await save('bos-south-station', 'South Station', [
  { part: gran, material: { ...finish('south-station-granite', 0xdcc6b0), floodlight: lit } },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
  { part: clock, material: finish('neon-clock', 0xf4efe2) },
  { part: door, material: { ...PALETTE.entrance, color: 0x7d6a52 } },
], { height: 44.4, anchor: [42.35196, -71.05517], bearing: 345 }, 6500)
