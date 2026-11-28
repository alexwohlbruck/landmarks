/**
 * St. Francis Xavier College Church, Saint Louis University, 3628 Lindell
 * Blvd at Grand Blvd, St. Louis (1884–1898; Thomas Waryng Walsh; tower and
 * spire completed 1914) — original procedural geometry, CC0-1.0.
 * bun generators/stl-college-church.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 285: the model's +y runs from the Grand Blvd front
 * (y = -32) west to the apse; +x is the Lindell Blvd (north) side, where
 * the tower stands. Anchor = the centroid of OSM way/202545486,
 * -90.2334678, 38.6370488.
 *
 * Identity (from the photos below):
 *  1. The tall stone tower on the Lindell corner of the front: a stage of
 *     two-light lancets, a band of small lancets, a belfry of two tall
 *     louvred lancets under gablets, a clock stage with corner pinnacles,
 *     and an octagonal stone spire with a cross.               (p1, p2)
 *  2. The nave gable with a great rose window in a pointed arch, an arcade
 *     of small lancets in the gable, and the main portal under a steep
 *     gabled hood; an octagonal stair turret with a spirelet on its south
 *     side, and a lower gabled south aisle front with a portal.   (p1, p2)
 *  3. A long steep slate roof with a row of gabled wall dormers over tall
 *     lancets down each flank, transepts, a polygonal apse.          (p1)
 *  4. Pale grey rock-faced limestone, dark slate roofs.             (all)
 *
 * Plan: OSM way/202545486 turned to bearing 285 (agrees with the lidar):
 * nave and aisles x ±13.4 from y -30.4 to 27.6, the front projection to
 * y -32, transepts to x ±18.2 from y 11.8 to 24.6, the polygonal apse
 * y 27.6–32.2; the tower about (8.6, -26.6), 10 m square with buttresses
 * to the outline at x 15.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018 (flown 2017),
 * 0.5 m grid (class 18 kept), read with tools/lidar_frame.py. y = 0 is the
 * areaway along the south wall, 0.2 m over the box's ground_min, which is
 * the lowest ground the footprint touches (the Mapterhorn grid agrees); the
 * Grand Blvd pavement is 2.8 m up, Lindell 3.3. Measured: flank eaves
 * 15.2, nave ridge 30.3, transept ridges 19.4, apse roof 27.4, the tower's
 * corner pinnacles 42.5–45.3, spire 56.5–59 at r 1 and ~50 at r 2. The
 * cloud has no point above 223.0 m elevation here or at St. Francis de
 * Sales; the flight's tiles reach higher downtown, so the sparse cloud
 * simply missed the slender spire top:
 * estimated 66 m to the stone tip by carrying the lidar's cone up, which
 * agrees with p1 (the spire 3.3 times as tall as its foot is wide), and
 * 69.5 to the top of the cross (p1: finial and cross ~0.53 of the foot's
 * width). An earlier fit to the cut-off 64.3 is superseded. The tower's stages are
 * read off p1 by a quadratic height scale fitted to the lidar's pinnacles,
 * the pavement and a 64.3 m top (so they may sit up to ~1 m low): two-light lancets 16–19.9, small lancets
 * 25.8–28.4, belfry lancets 30.1–37, gablets 40.1, clock stage to 43.5.
 * Estimated from p1 and p2: the rose window (centre 17.7, r 2.9), the gable
 * arcade, the portals (main arch to 10.1, hood 14.3; floors 4.6 m up the
 * front stairs), the stair turret (to 24, spirelet 29.5), the south aisle
 * front (gable 13.8), the wall dormers, the flank bays (~5 m).
 * Doubts: the lidar is sparse on the roofs and reads the north slope lower
 * than the south; the roof is drawn symmetric. The west end and the
 * transept fronts are not in any photo used here; they are kept plain.
 * Left out: statues, crockets, the small pinnacles on the buttresses, the
 * copper crosses on the gables, the Parish Center (way/202545465).
 *
 * Night: the front and tower are floodlit; windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  p1  "Saint Francis Xavier College Church (St. Louis, MO) - exterior.jpg",
 *      Nheyob, CC BY-SA 3.0 (from Grand and Lindell, north-east)
 *  p2  "St. Francis Xavier College Church - St. Louis 01.jpg", Farragutful,
 *      CC BY-SA 4.0 (the front, from Grand Blvd)
 *  p4  "St. Francis Xavier College Church - St. Louis 02.jpg", Farragutful,
 *      CC BY-SA 4.0
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, cornice, gableRoof, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { discShape, mullions, pointedShape, rose } from './stl-cathedral-basilica'

const stone = new Part(), slate = new Part(), win = new Part(), door = new Part(), dark = new Part()
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const S = (x0: number, x1: number, y: number): [XY, XY] => [[x0, y], [x1, y]]
const N = (x0: number, x1: number, y: number): [XY, XY] => [[x1, y], [x0, y]]
const E = (x: number, y0: number, y1: number): [XY, XY] => [[x, y0], [x, y1]]
const W = (x: number, y0: number, y1: number): [XY, XY] => [[x, y1], [x, y0]]
/** A triangle wound to face `out`. */
const tri = (p: Part, a: V3, b: V3, c: V3, out: V3) => {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}
const lancet = (f: [XY, XY], s: number, w: number, z0: number, zs: number, part = win, out = 0.05) => onWall(part, f[0], f[1], pointedShape(s, w, z0, zs, 4), out)

const NX = 13.4, Y0 = -30.4, Y1 = 27.6, EAVE = 15.2, RIDGE = 30.3, FLOOR = 4.6

// ── Nave and aisles under one steep roof ──
box(stone, -NX, NX, Y0, Y1, 0, EAVE, null, 0)
cornice(stone, rect(-NX, NX, Y0, Y1), EAVE - 0.6, 0.6, 0.3, null)
gableRoof(slate, stone, -NX, NX, Y0, Y1, EAVE, RIDGE, 'y', 0.5, 0.2)
// flank bays: a tall two-light lancet under a gabled wall dormer
const bays = [-17.5, -12.5, -7.5, -2.5, 2.5, 7.5]
for (const sx of [-1, 1]) {
  const f = sx > 0 ? E(NX, Y0, Y1) : W(-NX, Y0, Y1)
  for (const y of bays) {
    if (sx > 0 && y < -20) continue // the tower
    const s = sx > 0 ? y - Y0 : Y1 - y
    lancet(f, s, 2.4, 6.0, 13.0)
    mullions(stone, f[0], f[1], s, 2.4, 6.0, 13.2, 2)
    // the dormer: a gable standing on the eave, its roof running back into the slope
    const x = sx * NX, hw = 1.9
    const top: V3 = [x, y, EAVE + 3.4], e0: V3 = [x, y - hw, EAVE - 0.6], e1: V3 = [x, y + hw, EAVE - 0.6]
    const back: V3 = [x - sx * 3.4, y, EAVE + ((RIDGE - EAVE) * 3.4) / NX]
    tri(stone, e0, e1, top, [sx, 0, 0])
    tri(slate, e0, top, back, [sx * 0.3, -1, 1])
    tri(slate, e1, top, back, [sx * 0.3, 1, 1])
    lancet(f, s, 1.0, EAVE - 0.3, EAVE + 0.9, win, 0.07)
  }
}

// ── Transepts and the apse ──
for (const sx of [-1, 1]) {
  const x0 = sx > 0 ? NX : -18.2, x1 = sx > 0 ? 18.2 : -NX
  box(stone, x0, x1, 11.8, 24.6, 0, EAVE - 2, null, 0)
  gableRoof(slate, stone, sx > 0 ? NX - 3 : -18.2, sx > 0 ? 18.2 : -NX + 3, 11.8, 24.6, EAVE - 2, 19.4, 'x', 0.4, 0.3)
  const f = sx > 0 ? E(18.2, 11.8, 24.6) : W(-18.2, 11.8, 24.6)
  lancet(f, 6.4, 4.2, 5.0, 11.2)
  mullions(stone, f[0], f[1], 6.4, 4.2, 5.0, 11.6, 3)
}
{
  // the polygonal apse (OSM: x -6.5 to 5.3, out to y 32.2): walls, a hipped roof to 27.4
  const c: XY = [-0.6, Y1 - 0.4], poly: XY[] = [0, 1, 2, 3, 4].map((k) => [c[0] + 6.0 * Math.cos((k / 4) * Math.PI), c[1] + 5.0 * Math.sin((k / 4) * Math.PI)] as XY)
  const ap: V3 = [c[0], Y1 - 1.0, 27.4]
  for (let i = 0; i < poly.length - 1; i++) {
    const a = poly[i], b = poly[i + 1], mx = (a[0] + b[0]) / 2 - c[0], my = (a[1] + b[1]) / 2 - c[1]
    tri(stone, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], EAVE - 1], [mx, my, 0])
    tri(stone, [a[0], a[1], 0], [b[0], b[1], EAVE - 1], [a[0], a[1], EAVE - 1], [mx, my, 0])
    tri(slate, [a[0], a[1], EAVE - 1], [b[0], b[1], EAVE - 1], ap, [mx, my, 2])
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    lancet([b, a], L / 2, 1.5, 6.0, 11.5)
  }
}

// ── The front ──
const FY = -32.0
// the front wall and its gable, at the roof's own pitch (the right part runs into the tower)
box(stone, -NX, 3.8, FY, Y0, 0, EAVE, null, 0)
tri(stone, [-NX - 0.2, FY, EAVE], [NX, FY, EAVE], [0, FY, RIDGE + 0.4], [0, -1, 0])
tri(stone, [-NX - 0.2, FY, EAVE], [0, FY, RIDGE + 0.4], [-NX - 0.2, Y0, EAVE], [-1, 0, 1])
tri(stone, [0, FY, RIDGE + 0.4], [0, Y0, RIDGE + 0.4], [-NX - 0.2, Y0, EAVE], [-1, 0, 1])
{
  const f = S(-NX, 3.8, FY), m = NX // s of x = 0
  // great rose in a pointed arch, the arcade in the gable, the main portal
  onWall(stone, f[0], f[1], pointedShape(m, 8.4, 14.6, 18.6, 6), 0.06)
  rose(win, stone, f[0], f[1], m, 18.0, 2.9, 8)
  for (const d of [-1.8, -0.6, 0.6, 1.8]) lancet(f, m + d, 0.8, 24.4, 25.8, win, 0.06)
  onWall(stone, f[0], f[1], [[m - 4.0, 9.0], [m + 4.0, 9.0], [m, 14.3]], 0.12) // the portal's gabled hood
  onWall(stone, f[0], f[1], pointedShape(m, 4.6, FLOOR, 8.0, 6), 0.16)
  onWall(door, f[0], f[1], rectShape(m - 1.5, m + 1.5, FLOOR, 7.6), 0.2)
  onWall(win, f[0], f[1], pointedShape(m, 3.0, 7.6, 8.4, 5), 0.2)
}
// the south aisle front: a lower gable with a portal and a lancet over it
box(stone, -NX, -6.8, FY - 0.6, FY, 0, 11.0, null, 0)
gableRoof(stone, stone, -NX, -6.8, FY - 0.6, FY, 11.0, 13.8, 'y', 0.2, 0.0)
{
  const f = S(-NX, -6.8, FY - 0.6), m = 3.3
  onWall(stone, f[0], f[1], pointedShape(m, 3.4, FLOOR, 6.8, 6), 0.08)
  onWall(door, f[0], f[1], rectShape(m - 1.1, m + 1.1, FLOOR, 7.0), 0.12)
  lancet(f, m, 1.6, 8.0, 10.4)
}
// the octagonal stair turret with its spirelet
revolve(stone, [-7.2, FY - 0.2], [[1.45, 0], [1.45, 24.0], [1.7, 24.2], [1.7, 24.7], [1.4, 24.8]], 8, Math.PI / 8, true, false)
revolve(stone, [-7.2, FY - 0.2], [[1.3, 24.7], [0.05, 29.5]], 8, Math.PI / 8, true, false)
// the front stairs to the portals (the pavement is 2.8 m up the slope)
for (const [x0, x1] of [[-3.4, 3.4], [-12.6, -7.6], [5.6, 11.6]]) {
  for (let k = 0; k < 4; k++) box(stone, x0, x1, FY - 4.4 + k * 1.1, FY, 0, 2.8 + (k + 1) * 0.45, stone, 0.03)
}

// ── The tower ──
const TC: XY = [8.6, -26.6], TH = 4.2
const T0 = 0, STAGE1 = 21.0, STAGE2 = 29.4, BEL = 40.1, CLK = 43.5
const tface = (h: number): [XY, XY][] => [S(TC[0] - h, TC[0] + h, TC[1] - h), E(TC[0] + h, TC[1] - h, TC[1] + h), N(TC[0] - h, TC[0] + h, TC[1] + h), W(TC[0] - h, TC[1] - h, TC[1] + h)]
box(stone, TC[0] - TH, TC[0] + TH, TC[1] - TH, TC[1] + TH, T0, STAGE1, null, 0)
// the tower's portal on Grand Blvd, and the traceried window over it
{
  const f = S(TC[0] - TH, TC[0] + TH, TC[1] - TH)
  onWall(stone, f[0], f[1], [[TH - 3.2, 8.6], [TH + 3.2, 8.6], [TH, 12.6]], 0.14)
  onWall(stone, f[0], f[1], pointedShape(TH, 3.8, FLOOR, 7.2, 6), 0.18)
  onWall(door, f[0], f[1], rectShape(TH - 1.2, TH + 1.2, FLOOR, 6.8), 0.22)
  onWall(win, f[0], f[1], pointedShape(TH, 2.4, 6.8, 7.4, 4), 0.22)
}
// angle buttresses, stepping in up the tower
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  const cx = TC[0] + sx * (TH + 0.2), cy = TC[1] + sy * (TH + 0.2)
  box(stone, cx - 0.9, cx + 0.9, cy - 0.9, cy + 0.9, 0, 14.0, stone, 0.3)
  box(stone, cx - 0.65, cx + 0.65, cy - 0.65, cy + 0.65, 14.0, BEL - 3, stone, 0.3)
}
box(stone, TC[0] - TH + 0.3, TC[0] + TH - 0.3, TC[1] - TH + 0.3, TC[1] + TH - 0.3, STAGE1, BEL, null, 0)
cornice(stone, rect(TC[0] - TH + 0.3, TC[0] + TH - 0.3, TC[1] - TH + 0.3, TC[1] + TH - 0.3), STAGE2 - 0.5, 0.5, 0.25, null)
box(stone, TC[0] - TH + 0.55, TC[0] + TH - 0.55, TC[1] - TH + 0.55, TC[1] + TH - 0.55, BEL, CLK, null, 0)
cornice(stone, rect(TC[0] - TH + 0.55, TC[0] + TH - 0.55, TC[1] - TH + 0.55, TC[1] + TH - 0.55), CLK - 0.5, 0.6, 0.3, slate)
for (const f of tface(TH - 0.3)) {
  const m = TH - 0.3
  // two-light lancets
  for (const d of [-1.3, 1.3]) { lancet(f, m + d, 1.4, 16.0, 19.0); mullions(stone, f[0], f[1], m + d, 1.4, 16.0, 19.2, 2) }
  // the band of small lancets
  for (const d of [-2.1, -0.7, 0.7, 2.1]) lancet(f, m + d, 0.85, 25.8, 27.9)
  // the belfry: two tall louvred lancets, each under a gablet
  for (const d of [-1.25, 1.25]) {
    onWall(dark, f[0], f[1], pointedShape(m + d, 1.8, 30.1, 36.0, 5), 0.06)
    onWall(stone, f[0], f[1], [[m + d - 1.2, 37.0], [m + d + 1.2, 37.0], [m + d, BEL]], 0.08)
  }
}
for (const f of tface(TH - 0.55)) {
  onWall(stone, f[0], f[1], [[0.6, CLK - 0.4], [2 * (TH - 0.55) - 0.6, CLK - 0.4], [TH - 0.55, CLK + 2.6]], 0.02) // gable over the clock
  onWall(win, f[0], f[1], discShape(TH - 0.55, 42.0, 0.95, 14), 0.06) // clock face (lit at night)
}
// corner pinnacles of the clock stage
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  const c: XY = [TC[0] + sx * (TH - 0.4), TC[1] + sy * (TH - 0.4)]
  revolve(stone, c, [[0.6, BEL - 3], [0.6, CLK + 0.3], [0.05, 45.3]], 8, Math.PI / 8, true, false)
}
// the octagonal spire: a straight cone fitted to the lidar below its cut-off (r 2 at ~50,
// r 1 at ~57.5) and to p1's spire, 3.3 times as tall as its foot is wide; four gabled
// louvred lucarnes on the cardinal faces; a finial and cross
revolve(stone, TC, [[3.2, CLK], [0.12, 66.0]], 8, Math.PI / 8, true, false)
for (let k = 0; k < 4; k++) {
  const a = (k * Math.PI) / 2, u: XY = [Math.cos(a), Math.sin(a)], v: XY = [-u[1], u[0]]
  const q = (s: number, d: number): XY => [TC[0] + u[0] * d + v[0] * s, TC[1] + u[1] * d + v[1] * s]
  const ring: XY[] = [q(-0.9, 1.6), q(-0.9, 3.5), q(0.9, 3.5), q(0.9, 1.6)]
  const ccwRing = ((r: XY[]) => { let A = 0; for (let i = 0; i < r.length; i++) { const p0 = r[i], p1 = r[(i + 1) % r.length]; A += p0[0] * p1[1] - p1[0] * p0[1] } return A < 0 ? [...r].reverse() : r })(ring)
  for (let i = 0; i < 4; i++) {
    const p0 = ccwRing[i], p1 = ccwRing[(i + 1) % 4]
    stone.quad([p0[0], p0[1], CLK], [p1[0], p1[1], CLK], [p1[0], p1[1], 49.0], [p0[0], p0[1], 49.0])
  }
  const g0 = q(-0.9, 3.5), g1 = q(0.9, 3.5), b0 = q(-0.9, 1.6), b1 = q(0.9, 1.6), ap: V3 = [q(0, 3.5)[0], q(0, 3.5)[1], 51.0], apb: V3 = [q(0, 1.6)[0], q(0, 1.6)[1], 51.0]
  tri(stone, [g0[0], g0[1], 49.0], [g1[0], g1[1], 49.0], ap, [u[0], u[1], 0])
  tri(stone, [g0[0], g0[1], 49.0], ap, apb, [-v[0], -v[1], 1]); tri(stone, [g0[0], g0[1], 49.0], apb, [b0[0], b0[1], 49.0], [-v[0], -v[1], 1])
  tri(stone, [g1[0], g1[1], 49.0], apb, ap, [v[0], v[1], 1]); tri(stone, [g1[0], g1[1], 49.0], [b1[0], b1[1], 49.0], apb, [v[0], v[1], 1])
  onWall(dark, g0, g1, pointedShape(0.9, 1.0, 45.0, 48.0, 3), 0.05)
}
revolve(dark, TC, [[0.01, 65.6], [0.3, 66.0], [0.3, 66.6], [0.01, 67.0]], 6, 0, false, false)
box(dark, TC[0] - 0.12, TC[0] + 0.12, TC[1] - 0.12, TC[1] + 0.12, 66.8, 69.5, dark, 0)
box(dark, TC[0] - 0.7, TC[0] + 0.7, TC[1] - 0.12, TC[1] + 0.12, 68.2, 68.5, dark, 0)

const lit = (p: V3, n: V3) => (n[2] > 0.85 ? 0.1 : p[1] < -20 ? 1 : 0.3)
await save('stl-college-church', 'St. Francis Xavier College Church', [
  { part: stone, material: { ...finish('stl-grey-limestone', 0xe2e0d9), floodlight: lit } },
  { part: slate, material: finish('stl-slate', 0x7f878e) },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('stl-church-door', 0x6a5444) },
  { part: dark, material: finish('stl-louvre', 0x5b6168) },
], { height: 69.5, anchor: [38.6370488, -90.2334678], bearing: 285 })
