/**
 * Oratory of St. Francis de Sales ("Cathedral of South St. Louis"), 2653
 * Ohio Ave at Gravois, St. Louis (1907–1908; Viktor Klutho, Klutho & Ranft)
 * — original procedural geometry, CC0-1.0.
 * bun generators/stl-st-francis-de-sales.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 290: the model's +y runs from the tower front
 * (y = -37.6, facing Gravois Ave to the east-south-east) to the apse; +x is
 * the north-north-east side. Anchor = the centroid of OSM way/139761891,
 * -90.2262123, 38.6041749.
 *
 * Identity (from the photos below):
 *  1. The single front tower with angle buttresses: portal under a gable,
 *     a big pointed window, an arcade band, the mosaic roundel, a tall
 *     louvred lancet under the clock, gablets with corner pinnacles, and the
 *     very tall dark slate spire banded in green copper, with a copper top
 *     and cross (after Ulm).                                    (p1, p2)
 *  2. A German hall church: one huge steep slate roof over nave and aisles,
 *     a cross-gabled transept, a slim copper flèche over the crossing, very
 *     tall traceried windows between buttresses.                     (p1)
 *  3. An octagonal stair turret with a slate cone beside the tower, a
 *     polygonal side chapel with a pyramid roof.                 (p1, p2)
 *  4. Brown-red brick (darkened), buff stone trim, slate, green copper.
 *
 * Plan: OSM way/139761891 turned to bearing 290: tower x -4.2 to 5.2 from
 * the front to y -26.4; nave x -12 to 12.6 from y -31.7 (the aisle fronts)
 * to 27.6; transepts x -17.9 to 18.9 from y -0.6 to 13.3; a side chapel at
 * x -16.6..-11.9, y -18..-12.4; the apse to y 31.2 and sacristies behind.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018 (flown 2017),
 * 0.5 m grid with every class kept. y = 0 is the ground behind the church
 * (0.8 m over the box's ground_min, the footprint's lowest; the Gravois
 * front pavement is 2.2 m up). Measured: flank eaves 20.7, nave and
 * transept ridges 33.0, sacristies ~10, tower top cornice 49.7, gablets
 * ~53.6. The cloud has no point anywhere above 222.84 m (64.5 m over
 * ground_min), here or at the College Church; the flight reaches higher
 * downtown, so the sparse cloud simply missed the slender spire. Published: the spire is 300 ft / 91.4 m (Wikipedia,
 * the National Register); taken from the front pavement, the cross top
 * is at 93.6. Estimated from p1 (a telephoto view, ~12 px/m, scaled
 * between the lidar ridge and the published top): the spire's profile
 * (r 3.0 at 49.7, 2.7 at 57, 1.65 at 73.6, 0.85 at 80), its copper bands
 * and top (82.5–90.4), the clock (centre 42.6), the louvred lancet
 * (35–41), the flèche (to 53.8), the stair turret (shaft 26, cone 36.3).
 * From p2: the portal, the window over it, the roundel. The window bays
 * and the transept and chapel heights are read off p1. The west end has
 * no photo here; it is kept plain.
 * Left out: buttress pinnacles, roof dormers, the mosaic's image,
 * crockets, the rectory and hall (separate OSM buildings, not replaced).
 *
 * Night: the tower is floodlit; windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  p1  "Saint Francis de Sales Oratory.jpg", Phillip B. Roussin,
 *      CC BY-SA 4.0 (telephoto from the south-west)
 *  p2  "St Francis De Sales facade 23.jpg", Parker Botanical, CC BY-SA 3.0
 *      (the tower front, from Gravois and Ohio)
 * Published: en.wikipedia.org/wiki/St._Francis_de_Sales_Oratory.
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, cornice, gableRoof, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { discShape, mullions, pointedShape } from './stl-cathedral-basilica'

const brick = new Part(), trim = new Part(), slate = new Part(), copper = new Part(), win = new Part(), door = new Part()
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const S = (x0: number, x1: number, y: number): [XY, XY] => [[x0, y], [x1, y]]
const N = (x0: number, x1: number, y: number): [XY, XY] => [[x1, y], [x0, y]]
const E = (x: number, y0: number, y1: number): [XY, XY] => [[x, y0], [x, y1]]
const W = (x: number, y0: number, y1: number): [XY, XY] => [[x, y1], [x, y0]]
const tri = (p: Part, a: V3, b: V3, c: V3, out: V3) => {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}
const lancet = (f: [XY, XY], s: number, w: number, z0: number, zs: number, part = win, out = 0.05) => onWall(part, f[0], f[1], pointedShape(s, w, z0, zs, 4), out)
/** A tall traceried window: pale surround, glass, mullions. */
const bigWindow = (f: [XY, XY], s: number, w: number, z0: number, zs: number, lights: number) => {
  onWall(trim, f[0], f[1], pointedShape(s, w + 0.7, z0 - 0.35, zs, 5), 0.04)
  lancet(f, s, w, z0, zs, win, 0.07)
  mullions(trim, f[0], f[1], s, w, z0, zs + 0.2, lights, 0.18, 0.1)
}

const X0 = -12.0, X1 = 12.6, Y0 = -26.4, Y1 = 27.6, EAVE = 20.7, RIDGE = 33.0, XM = (X0 + X1) / 2, HW = (X1 - X0) / 2
const TY0 = -0.6, TY1 = 13.3, TX0 = -17.9, TX1 = 18.9

// ── The hall: nave and aisles under one steep roof ──
box(brick, X0, X1, Y0, Y1, 0, EAVE, null, 0)
cornice(trim, rect(X0, X1, Y0, Y1), EAVE - 0.7, 0.7, 0.35, null)
gableRoof(slate, brick, X0, X1, Y0, Y1, EAVE, RIDGE, 'y', 0.5, 0.25)
// the aisle fronts either side of the tower (OSM: out to y -31.7)
box(brick, X0, -4.2, -31.7, Y0, 0, EAVE, null, 0)
box(brick, 5.2, X1, -31.7, Y0, 0, EAVE, null, 0)
cornice(trim, rect(X0, -4.2, -31.7, Y0 + 0.5), EAVE - 0.7, 0.7, 0.35, slate)
cornice(trim, rect(5.2, X1, -31.7, Y0 + 0.5), EAVE - 0.7, 0.7, 0.35, slate)
for (const [x0, x1] of [[X0, -4.2], [5.2, X1]]) {
  const f = S(x0, x1, -31.7), L = x1 - x0
  bigWindow(f, L / 2, 2.6, 7.0, 15.0, 2)
  onWall(door, f[0], f[1], pointedShape(L / 2, 1.8, 2.2, 4.6, 4), 0.06)
}
// flank bays: very tall three-light windows between buttresses
const bays = [-22.5, -16.2, -9.9, -4.0, 17.5, 23.0]
for (const sx of [-1, 1]) {
  const x = sx > 0 ? X1 : X0, f = sx > 0 ? E(X1, Y0, Y1) : W(X0, Y0, Y1)
  for (const y of bays) {
    if (sx < 0 && y > -19 && y < -11) continue // the side chapel
    const s = sx > 0 ? y - Y0 : Y1 - y
    bigWindow(f, s, 3.2, 6.0, 16.5, 3)
  }
  for (const y of [-26.4, -19.3, -13.0, -6.9, 14.6, 20.3, 27.0]) box(brick, sx > 0 ? x : x - 1.0, sx > 0 ? x + 1.0 : x, y - 0.55, y + 0.55, 0, EAVE - 2.5, trim, 0.25)
}

// ── Transepts: cross gables to the ridge, a great window in each end ──
for (const sx of [-1, 1]) {
  const xa = sx > 0 ? X1 : TX0, xb = sx > 0 ? TX1 : X0
  box(brick, xa, xb, TY0, TY1, 0, EAVE, null, 0)
  cornice(trim, rect(xa, xb, TY0, TY1), EAVE - 0.7, 0.7, 0.35, null)
  gableRoof(slate, brick, sx > 0 ? XM : TX0, sx > 0 ? TX1 : XM, TY0, TY1, EAVE, RIDGE, 'x', 0.4, 0.25)
  const f = sx > 0 ? E(TX1, TY0, TY1) : W(TX0, TY0, TY1), L = TY1 - TY0
  bigWindow(f, L / 2, 5.0, 6.0, 18.5, 4)
  onWall(win, f[0], f[1], discShape(L / 2, 25.5, 1.4, 12), 0.05)
}
// the copper flèche over the crossing
{
  const c: XY = [XM, (TY0 + TY1) / 2]
  revolve(copper, c, [[1.3, RIDGE - 2], [1.3, 39.0], [1.5, 39.2], [1.5, 39.6], [1.1, 39.7], [0.05, 53.8]], 8, Math.PI / 8, true, false)
}

// ── The side chapel, the apse and the sacristies ──
{
  const c: XY = [-11.9, -15.2], r = 3.6
  const pts: XY[] = [0, 1, 2, 3, 4].map((k) => [c[0] - r * Math.sin((k / 4) * Math.PI), c[1] - r * Math.cos((k / 4) * Math.PI)] as XY)
  const ap: V3 = [c[0] - 0.8, c[1], 14.6]
  for (let i = 0; i < 4; i++) {
    const a = pts[i], b = pts[i + 1], o: V3 = [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1], 0]
    tri(brick, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], 10.0], o)
    tri(brick, [a[0], a[1], 0], [b[0], b[1], 10.0], [a[0], a[1], 10.0], o)
    tri(slate, [a[0], a[1], 10.0], [b[0], b[1], 10.0], ap, [o[0], o[1], 2])
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    onWall(win, b, a, pointedShape(L / 2, 1.1, 3.5, 7.4, 4), 0.05)
  }
}
{
  const c: XY = [0.2, Y1 - 0.2], pts: XY[] = [0, 1, 2, 3, 4].map((k) => [c[0] + 5.6 * Math.cos((k / 4) * Math.PI), c[1] + 3.6 * Math.sin((k / 4) * Math.PI)] as XY)
  const ap: V3 = [c[0], Y1 - 1.2, 27.0]
  for (let i = 0; i < 4; i++) {
    const a = pts[i], b = pts[i + 1], o: V3 = [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1], 0]
    tri(brick, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], EAVE - 3], o)
    tri(brick, [a[0], a[1], 0], [b[0], b[1], EAVE - 3], [a[0], a[1], EAVE - 3], o)
    tri(slate, [a[0], a[1], EAVE - 3], [b[0], b[1], EAVE - 3], ap, [o[0], o[1], 2])
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    lancet([b, a], L / 2, 1.4, 6.0, 13.0)
  }
}
for (const [x0, x1, y0, y1] of [[-16.4, -9.0, Y1, 29.6], [9.7, 16.6, 19.3, 30.2]]) {
  box(brick, x0, x1, y0, y1, 0, 8.6, null, 0)
  gableRoof(slate, brick, x0, x1, y0, y1, 8.6, 10.2, 'x', 0.3, 0.2)
}

// ── The tower ──
const TC: XY = [0.5, -31.6], TH = 4.7, TOP = 49.7, FLOOR = 2.6
const tfaces = (h: number): [XY, XY][] => [S(TC[0] - h, TC[0] + h, TC[1] - h), E(TC[0] + h, TC[1] - h, TC[1] + h), N(TC[0] - h, TC[0] + h, TC[1] + h), W(TC[0] - h, TC[1] - h, TC[1] + h)]
box(brick, TC[0] - TH, TC[0] + TH, TC[1] - TH, TC[1] + TH, 0, TOP, null, 0)
cornice(trim, rect(TC[0] - TH, TC[0] + TH, TC[1] - TH, TC[1] + TH), TOP - 0.8, 0.8, 0.35, slate)
for (const z of [14.2, 27.2]) cornice(trim, rect(TC[0] - TH, TC[0] + TH, TC[1] - TH, TC[1] + TH), z, 0.45, 0.2, trim)
// angle buttresses in stone-capped steps
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  const cx = TC[0] + sx * (TH + 0.1), cy = TC[1] + sy * (TH + 0.1)
  if (sy > 0) continue // the back corners are inside the nave
  box(brick, cx - 1.0, cx + 1.0, cy - 1.0, cy + 1.0, 0, 18.0, trim, 0.35)
  box(brick, cx - 0.75, cx + 0.75, cy - 0.75, cy + 0.75, 18.0, 34.0, trim, 0.3)
  box(brick, cx - 0.5, cx + 0.5, cy - 0.5, cy + 0.5, 34.0, 45.5, trim, 0.25)
}
for (const [i, f] of tfaces(TH).entries()) {
  const m = TH
  if (i === 0) {
    // the front: portal under a gable, the big window, the arcade, the roundel
    box(trim, TC[0] - 2.6, TC[0] + 2.6, TC[1] - TH - 0.9, TC[1] - TH, 0, 7.4, trim, 0.2)
    const g: [XY, XY] = S(TC[0] - 2.6, TC[0] + 2.6, TC[1] - TH - 0.9)
    onWall(trim, g[0], g[1], [[0, 7.4], [5.2, 7.4], [2.6, 11.0]], 0.0)
    tri(slate, [TC[0] - 2.6, TC[1] - TH - 0.9, 7.4], [TC[0], TC[1] - TH - 0.9, 11.0], [TC[0], TC[1] - TH, 11.0], [-1, 0, 1])
    tri(slate, [TC[0] - 2.6, TC[1] - TH - 0.9, 7.4], [TC[0], TC[1] - TH, 11.0], [TC[0] - 2.6, TC[1] - TH, 7.4], [-1, 0, 1])
    tri(slate, [TC[0] + 2.6, TC[1] - TH - 0.9, 7.4], [TC[0], TC[1] - TH, 11.0], [TC[0], TC[1] - TH - 0.9, 11.0], [1, 0, 1])
    tri(slate, [TC[0] + 2.6, TC[1] - TH - 0.9, 7.4], [TC[0] + 2.6, TC[1] - TH, 7.4], [TC[0], TC[1] - TH, 11.0], [1, 0, 1])
    onWall(door, g[0], g[1], rectShape(1.5, 3.7, FLOOR, 5.6), 0.06)
    onWall(win, g[0], g[1], pointedShape(2.6, 2.2, 5.6, 5.7, 4), 0.06)
    bigWindow(f, m, 3.0, 12.6, 17.6, 2)
    for (const d of [-2.4, -1.2, 0, 1.2, 2.4]) lancet(f, m + d, 0.8, 21.0, 22.4)
    onWall(trim, f[0], f[1], discShape(m, 25.2, 1.45, 14), 0.05)
    onWall(copper, f[0], f[1], discShape(m, 25.2, 1.2, 14), 0.08) // the mosaic
  } else {
    lancet(f, m, 1.6, 12.6, 18.0)
    lancet(f, m, 1.6, 21.0, 25.0)
  }
  // the tall louvred lancet under the clock, the clock, the gablet over it
  onWall(trim, f[0], f[1], pointedShape(m, 2.6, 28.5, 38.6, 5), 0.04)
  onWall(copper, f[0], f[1], pointedShape(m, 2.0, 28.8, 38.6, 5), 0.07)
  mullions(trim, f[0], f[1], m, 2.0, 28.8, 38.8, 2, 0.18, 0.1)
  onWall(trim, f[0], f[1], discShape(m, 42.6, 1.6, 14), 0.05)
  onWall(win, f[0], f[1], discShape(m, 42.6, 1.35, 14), 0.08)
}
// gablets above the cornice, their roofs running into the spire, and corner pinnacles
for (const [a, b] of tfaces(TH - 0.25)) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const p = (s: number, d: number, z: number): V3 => [a[0] + t[0] * s + n[0] * d, a[1] + t[1] * s + n[1] * d, z]
  const m = L / 2
  tri(brick, p(m - 3.2, 0, TOP), p(m + 3.2, 0, TOP), p(m, 0, 54.0), [n[0], n[1], 0])
  tri(slate, p(m - 3.2, 0, TOP), p(m, 0, 54.0), p(m, -3.0, 54.0), [-t[0] + n[0], -t[1] + n[1], 1])
  tri(slate, p(m + 3.2, 0, TOP), p(m, -3.0, 54.0), p(m, 0, 54.0), [t[0] + n[0], t[1] + n[1], 1])
  lancet([p(m - 3.2, 0, 0) as unknown as XY, p(m + 3.2, 0, 0) as unknown as XY], 3.2, 1.0, 50.3, 52.0, win, 0.05)
}
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  const c: XY = [TC[0] + sx * (TH - 0.5), TC[1] + sy * (TH - 0.5)]
  revolve(trim, c, [[0.55, TOP - 0.2], [0.55, 52.0], [0.05, 56.2]], 6, 0, true, false)
}
// the spire: octagonal slate, copper bands, a copper top and the cross
const sp: [number, number][] = [[3.0, TOP], [2.7, 57], [2.15, 65.5], [1.65, 73.6], [0.85, 80.0], [0.55, 82.5]]
revolve(slate, TC, sp, 8, Math.PI / 8, true, false)
for (const [z, r] of [[59.8, 2.53], [71.4, 1.79]] as [number, number][]) revolve(copper, TC, [[r + 0.12, z], [r + 0.12, z + 0.7], [r - 0.05, z + 0.75]], 8, Math.PI / 8, true, false)
revolve(copper, TC, [[0.6, 82.4], [0.62, 84.5], [0.4, 86.5], [0.05, 90.4]], 8, Math.PI / 8, true, false)
box(copper, TC[0] - 0.12, TC[0] + 0.12, TC[1] - 0.12, TC[1] + 0.12, 90.0, 93.6, copper, 0)
box(copper, TC[0] - 0.8, TC[0] + 0.8, TC[1] - 0.12, TC[1] + 0.12, 92.0, 92.3, copper, 0)

// ── The stair turret beside the tower, its slate cone ──
{
  const c: XY = [-6.4, -31.2]
  revolve(brick, c, [[1.6, 0], [1.6, 26.0]], 8, Math.PI / 8, true, false)
  revolve(trim, c, [[1.6, 25.6], [1.85, 25.8], [1.85, 26.3], [1.5, 26.4]], 8, Math.PI / 8, true, false)
  revolve(slate, c, [[1.75, 26.3], [0.05, 36.3]], 8, Math.PI / 8, true, false)
  for (const z of [6, 12, 18]) onWall(win, [c[0] - 0.66, c[1] - 1.6], [c[0] + 0.66, c[1] - 1.6], pointedShape(0.66, 0.5, z, z + 1.2, 3), 0.05)
}

const lit = (p: V3, n: V3) => (n[2] > 0.85 ? 0.1 : p[1] < -25 ? 1 : 0.25)
await save('stl-st-francis-de-sales', 'Oratory of St. Francis de Sales', [
  { part: brick, material: { ...finish('stl-sfds-brick', 0xa48b7a), floodlight: lit } },
  { part: trim, material: { ...finish('stl-buff-stone', 0xe3d7bf), floodlight: lit } },
  { part: slate, material: finish('stl-sfds-slate', 0x6f757b) },
  { part: copper, material: PALETTE.copper },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('stl-sfds-door', 0x7a4a3c) },
], { height: 93.6, anchor: [38.6041749, -90.2262123], bearing: 290 }, 6500)
