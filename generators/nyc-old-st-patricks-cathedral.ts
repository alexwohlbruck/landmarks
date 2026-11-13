/**
 * Basilica of St. Patrick's Old Cathedral, Mulberry Street, Nolita —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-old-st-patricks-cathedral.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Model north is
 * the Mulberry Street front (the 1868 Gothic facade, liturgical west, WNW);
 * the 1815 stuccoed Mott Street end is at −y. +x is the north (Houston)
 * side, −x the south (Prince Street) side. Placed at bearing 288.5°, the
 * outline's long axis. Anchor: area centroid of OSM way/247845702.
 *
 * Evidence
 * - OSM way/247845702 (outline) and its parts: the body 381206140 (24.8 m,
 *   gabled, 8 m roof), the belfry 381206139 (3.3 × 3 m square at the front
 *   south corner, pyramidal), the low south porch 381206138 (5 m, gabled)
 *   and the low strip along the north side 381206137 (5 m). The churchyard
 *   wall is barrier=wall way/36882465 (Mott, Prince and Mulberry sides).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017) in the model frame, heights above
 *   the Mulberry Street sidewalk (3.9 m above the grid's ground_min; Mott
 *   Street is ~1.2 m higher): ridge 26.2, eaves 16.3 on both sides, belfry
 *   top 22.2 (a 24.5 return at its cap), the strips along both sides 3.9,
 *   the south porch 4.7, the churchyard wall on Mulberry 3.1.
 * - Published: 1809–15, Joseph-François Mangin; gutted by fire 1866 and
 *   rebuilt by Henry Engelbert (1868), whose Gothic front this is. Outer
 *   dimensions 120 × 80 ft, vault 85 ft (Wikipedia; NRHP 77000964; NYC
 *   landmark 1966). OSM measures 47 × 24.6 m: the length includes the
 *   sanctuary and sacristy under the same roof (lidar shows one ridge).
 * - Photos (Wikimedia Commons, in /tmp/nyc-old-st-patricks-cathedral/photos):
 *   Mulberry front from the north-west, "Saint Pats Old Cathedral Manh jeh"
 *   (Jim.henderson, public domain) and "St. Patrick's Old Cathedral Mulberry
 *   Street facade" (Beyond My Ken, CC BY-SA 4.0); front and south side from
 *   Mulberry/Prince, "Basilica of Saint Patrick's Old Cathedral, Manhattan,
 *   New York (7237381612)" and "(7237381996)" (Ken Lund, CC BY-SA 2.0); the
 *   south side and belfry, "Old Saint Patrick's Cathedral - now a simple
 *   basilica. - panoramio" (olekinderhook, CC BY 3.0); the Mott Street end,
 *   "Old St Pats Mott St East door jeh" (Jim.henderson, CC BY-SA 3.0) and
 *   "St. Patrick's Old Cathedral 020" (Kidfly182, CC BY 4.0); the corner,
 *   "St. Patrick's Old Cathedral 001" (Kidfly182, CC BY-SA 4.0); the
 *   churchyard wall, "Basilica of Saint Patrick's Old Cathedral 06"
 *   (Farragutful, CC BY-SA 4.0).
 *
 * Colour: the side and front walls are grey-brown Manhattan schist rubble,
 * drawn as a light warm grey; the dressings (pilasters, arches, cornices),
 * the belfry and the whole Mott Street end are pink-brown brownstone and
 * stucco; slate roof; red brick churchyard wall.
 *
 * Estimated: the front's openings (portal, great window, blind arches,
 * oculus, string course) scaled from the Ken Lund and Beyond My Ken photos
 * to the 16.3 m eaves and 26.2 m apex; seven bays on each side (the photos
 * show five on the south side before the trees); the side windows' sizes;
 * the belfry drawn 4 m square (OSM 3.3 × 3; the photos read wider), its
 * louvres and cross; the south porch from OSM alone (no photo shows it
 * above the wall); the little north doorway mirrors the south one (Ken
 * Lund's 7237381996 shows its gable); the Mott Street doors and pilasters from
 * the Jim.henderson photo; the north side, which no photo shows, mirrors the
 * south; the churchyard wall's height on Prince and Mott Streets (3.2 m
 * above the local ground, which rises 1.2 m toward Mott). The wall across
 * the two church ends is an iron railing in the photos and is left out, as
 * is the railing. The window tracery, the dentil cornices and the small
 * finials are left out.
 *
 * Night: the stained glass glows (`window`), the doors are `entrance`, and
 * the Mulberry front and belfry carry a soft `floodlight` from the street.
 * No open night photo was found; the floodlighting is an assumption.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, type XY } from './nyc-570-lexington'
import { block, wallFrame, discPanel } from './nyc-city-hall'

const rubble = new Part(), dress = new Part(), roof = new Part(), win = new Part(), brick = new Part(), door = new Part()

type P2 = [number, number]

/** A flat convex face; winding follows the outward normal n. */
function face(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n])
}

/** A convex polygon drawn in the x–z plane, extruded along y from y0 to y1. */
function slabY(p: Part, poly: P2[], y0: number, y1: number) {
  const cx = poly.reduce((s, q) => s + q[0], 0) / poly.length, cz = poly.reduce((s, q) => s + q[1], 0) / poly.length
  face(p, poly.map(([x, z]) => [x, y1, z] as V3), [0, 1, 0])
  face(p, poly.map(([x, z]) => [x, y0, z] as V3), [0, -1, 0])
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    let nx = b[1] - a[1], nz = -(b[0] - a[0])
    const l = Math.hypot(nx, nz) || 1
    nx /= l; nz /= l
    if (nx * ((a[0] + b[0]) / 2 - cx) + nz * ((a[1] + b[1]) / 2 - cz) < 0) { nx = -nx; nz = -nz }
    face(p, [[a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]]], [nx, 0, nz])
  }
}

/** A pointed (equilateral) arch panel on a wall a→b: two true arcs over a rectangle. */
function pointed(p: Part, a: XY, b: XY, s: number, w: number, z0: number, zTop: number, d = 0.05, segs = 5) {
  const f = wallFrame(a, b, d), h = w * Math.sqrt(3) / 2, spring = zTop - h
  const pts: [number, number][] = [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, spring]]
  for (let i = 1; i <= segs; i++) { const t = (i / segs) * (Math.PI / 3); pts.push([s - w / 2 + w * Math.cos(t), spring + w * Math.sin(t)]) }
  for (let i = segs - 1; i >= 0; i--) { const t = (i / segs) * (Math.PI / 3); pts.push([s + w / 2 - w * Math.cos(t), spring + w * Math.sin(t)]) }
  const c: [number, number] = [s, (z0 + spring) / 2]
  for (let i = 0; i < pts.length; i++) {
    const A = pts[i], B = pts[(i + 1) % pts.length]
    if (Math.hypot(A[0] - B[0], A[1] - B[1]) < 1e-6) continue
    p.tri(f.at(c[0], c[1]), f.at(A[0], A[1]), f.at(B[0], B[1]))
  }
}

/** A pyramid cap over a rectangle. */
function pyramid(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, tip: number) {
  const q: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], t: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, tip]
  for (let i = 0; i < 4; i++) p.tri(q[i], q[(i + 1) % 4], t)
}

// --- The body: one gabled hall (OSM 381206140; lidar eaves 16.3, ridge 26.2) ---
const X0 = -12.2, X1 = 12.4, Y0 = -23.8, Y1 = 23.1, XC = (X0 + X1) / 2
const EAVE = 16.3, RIDGE = 26.2, K = (RIDGE - EAVE) / (XC - X0)
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const rake = (x: number) => EAVE + K * (XC - Math.abs(x - XC) - X0) // the gable line over x

// Rubble walls, and the stuccoed Mott Street end (its first 0.8 m wraps the corners).
prism({ wall: rubble, win: null, roof: null, ring: rect(X0, Y0 + 0.8, X1, Y1), z0: 0, z1: EAVE, facade: null, bevel: 0.3 })
prism({ wall: dress, win: null, roof: null, ring: rect(X0, Y0, X1, Y0 + 0.8), z0: 0, z1: EAVE, facade: null, bevel: 0.3 })
slabY(rubble, [[X0, EAVE], [X1, EAVE], [XC, RIDGE]], Y1 - 0.6, Y1)
slabY(dress, [[X0, EAVE], [X1, EAVE], [XC, RIDGE]], Y0, Y0 + 0.6)

// Slate roof, its overhang at the eaves.
{
  const o = 0.5, zr = (x: number) => rake(x) + 0.15, ya = Y0 - 0.25, yb = Y1 - 0.3
  for (const s of [-1, 1]) {
    const xe = s < 0 ? X0 - o : X1 + o, ze = EAVE + 0.15 - K * o
    const n: V3 = [s * K, 0, 1]
    face(roof, [[xe, ya, ze], [XC, ya, zr(XC)], [XC, yb, zr(XC)], [xe, yb, ze]], n)
  }
}

// Eaves cornices along both sides, and raking cornices on both gables.
block(dress, X0 - 0.4, Y0, X0 + 0.2, Y1, EAVE - 0.9, EAVE + 0.1)
block(dress, X1 - 0.2, Y0, X1 + 0.4, Y1, EAVE - 0.9, EAVE + 0.1)
function rakingCornice(y0: number, y1: number, below: number, above: number) {
  const lo = (x: number) => rake(x) - below, hi = (x: number) => rake(x) + above
  for (const xe of [X0 - 0.4, X1 + 0.4]) slabY(dress, [[xe, lo(xe)], [XC, lo(XC)], [XC, hi(XC)], [xe, hi(xe)]], y0, y1)
}
rakingCornice(Y1 - 1.2, Y1 + 0.4, 0.75, 0.55)
rakingCornice(Y0 - 0.3, Y0 + 1.0, 0.45, 0.45)

// --- The Mulberry Street front ---
const W = { a: [X1, Y1] as XY, b: [X0, Y1] as XY, s: (x: number) => X1 - x }
const Wp = { a: [X1, Y1 + 0.35] as XY, b: [X0, Y1 + 0.35] as XY } // on the portal's face
// Corner piers, with small gabled caps above the cornice.
for (const [x0, x1] of [[X0 - 0.15, X0 + 1.5], [X1 - 1.5, X1 + 0.15]]) {
  block(dress, x0, Y1 - 1.6, x1, Y1 + 0.3, 0, EAVE + 0.6)
  slabY(dress, [[x0, EAVE + 0.6], [x1, EAVE + 0.6], [(x0 + x1) / 2, EAVE + 1.5]], Y1 - 1.6, Y1 + 0.3)
}
// Paired pilasters either side of the central bay, up into the raking cornice.
for (const s of [-1, 1]) for (const [d0, d1] of [[4.4, 5.1], [5.8, 6.5]]) {
  const xa = XC + s * d0, xb = XC + s * d1
  block(dress, Math.min(xa, xb), Y1 - 0.1, Math.max(xa, xb), Y1 + 0.25, 0, rake(XC + s * d0) - 0.5)
}
// Outer bays: string course and two tiers of blind pointed arches.
for (const s of [-1, 1]) {
  const xc = XC + s * 8.65
  block(dress, Math.min(XC + s * 6.5, XC + s * 10.8), Y1 - 0.1, Math.max(XC + s * 6.5, XC + s * 10.8), Y1 + 0.2, 8.9, 9.4)
  pointed(dress, W.a, W.b, W.s(xc), 2.5, 1.6, 7.4, 0.06)
  pointed(dress, W.a, W.b, W.s(xc), 2.5, 9.5, 14.4, 0.06)
}
// Central bay: the portal (three pointed openings) and the great window.
block(dress, XC - 2.8, Y1 - 0.1, XC + 2.8, Y1 + 0.35, 0, 7.6)
pointed(door, Wp.a, Wp.b, W.s(XC), 2.0, 0.9, 6.3, 0.05)
for (const s of [-1, 1]) pointed(win, Wp.a, Wp.b, W.s(XC + s * 1.65), 0.75, 1.2, 5.8, 0.05)
pointed(dress, W.a, W.b, W.s(XC), 5.4, 7.6, 19.4, 0.05)
pointed(win, W.a, W.b, W.s(XC), 4.3, 8.0, 18.7, 0.1)
// Oculus in the gable.
discPanel(dress, W.a, W.b, W.s(XC), 22.7, 1.35, 0.05, 14)
discPanel(win, W.a, W.b, W.s(XC), 22.7, 0.9, 0.1, 14)

// --- The long sides: seven bays of tall pointed windows between pilasters ---
const S = { a: [X0, Y1] as XY, b: [X0, Y0] as XY, s: (y: number) => Y1 - y }
const N = { a: [X1, Y0] as XY, b: [X1, Y1] as XY, s: (y: number) => y - Y0 }
const BAYS = 7, B0 = Y0 + 0.8, B1 = Y1 - 1.6, P = (B1 - B0) / BAYS
for (let i = 1; i < BAYS; i++) {
  const y = B0 + i * P
  block(dress, X0 - 0.3, y - 0.45, X0 + 0.1, y + 0.45, 0, EAVE - 0.9)
  block(dress, X1 - 0.1, y - 0.45, X1 + 0.3, y + 0.45, 0, EAVE - 0.9)
}
for (let i = 0; i < BAYS; i++) {
  const y = B0 + (i + 0.5) * P
  for (const f of [S, N]) {
    pointed(dress, f.a, f.b, f.s(y), 3.7, 4.5, 14.6, 0.05)
    pointed(win, f.a, f.b, f.s(y), 2.9, 4.9, 14.0, 0.1)
  }
}

// --- The Mott Street end (stucco): clustered pilasters, three doors ---
const E = { a: [X0, Y0] as XY, b: [X1, Y0] as XY, s: (x: number) => x - X0 }
for (const s of [-1, 1]) block(dress, XC + s * 3.3 - 0.55, Y0 - 0.35, XC + s * 3.3 + 0.55, Y0 + 0.1, 0, 12.5)
block(dress, XC - 1.9, Y0 - 0.25, XC + 1.9, Y0 + 0.1, 0, 8.6)
const Ep = { a: [X0, Y0 - 0.25] as XY, b: [X1, Y0 - 0.25] as XY }
pointed(door, Ep.a, Ep.b, E.s(XC), 2.3, 0.4, 6.4, 0.05)
for (const s of [-1, 1]) {
  const xc = XC + s * 8.4
  block(dress, xc - 1.9, Y0 - 0.4, xc + 1.9, Y0 + 0.1, 4.8, 5.6)
  pointed(door, E.a, E.b, E.s(xc), 2.1, 0.4, 4.8, 0.05)
}

// --- The belfry (OSM 381206139; lidar top 22.2) on the front south corner ---
{
  const bx0 = -12.0, bx1 = -8.0, by0 = 18.3, by1 = 22.3, top = 22.0
  block(dress, bx0, by0, bx1, by1, 15, top)
  block(dress, bx0 - 0.25, by0 - 0.25, bx1 + 0.25, by1 + 0.25, top, top + 0.6)
  pyramid(roof, bx0 - 0.25, by0 - 0.25, bx1 + 0.25, by1 + 0.25, top + 0.6, top + 1.4)
  const cx = (bx0 + bx1) / 2, cy = (by0 + by1) / 2
  block(dress, cx - 0.14, cy - 0.14, cx + 0.14, cy + 0.14, top + 1.2, top + 3.4)
  block(dress, cx - 0.6, cy - 0.12, cx + 0.6, cy + 0.12, top + 2.5, top + 2.8)
  // Two louvred openings on each face.
  const faces: [XY, XY][] = [[[bx1, by1], [bx0, by1]], [[bx0, by0], [bx1, by0]], [[bx1, by0], [bx1, by1]], [[bx0, by1], [bx0, by0]]]
  for (const [a, b] of faces) {
    const f = wallFrame(a, b, 0.05)
    for (const s of [f.L / 2 - 0.75, f.L / 2 + 0.75]) roof.quad(f.at(s - 0.3, top - 2.3), f.at(s + 0.3, top - 2.3), f.at(s + 0.3, top - 0.7), f.at(s - 0.3, top - 0.7))
  }
}

// --- Low additions along the sides ---
// The brick passage walls along both sides (OSM 381206137 on the north,
// lidar 3.9 m on both), each entered by a little gabled stone doorway at
// the front corner (photos: Jim.henderson, Ken Lund).
for (const [xw, o] of [[X0, -1], [X1, 1]] as const) {
  const xa = Math.min(xw, xw + o * 1.4), xb = Math.max(xw, xw + o * 1.4)
  block(brick, xa, 7.4, xb, 21.4, 0, 3.9)
  block(dress, Math.min(xw, xw + o * 1.5), 7.4, Math.max(xw, xw + o * 1.5), 21.4, 3.9, 4.15)
  const ga = Math.min(xw, xw + o * 2.6), gb = Math.max(xw, xw + o * 2.6), gm = (ga + gb) / 2
  block(dress, ga, 21.4, gb, 23.2, 0, 3.7)
  slabY(dress, [[ga - 0.15, 3.6], [gb + 0.15, 3.6], [gm, 4.9]], 21.3, 23.35)
  pointed(door, [gb, 23.2], [ga, 23.2], gb - gm, 1.1, 0.3, 2.9, 0.05)
}
// The south porch (OSM 381206138, lidar 4.7).
prism({ wall: rubble, win: null, roof: null, ring: rect(-16.7, 1.4, X0, 7.3), z0: 0, z1: 3.9, facade: null, bevel: 0.2 })
{
  const xm = (-16.7 + X0) / 2
  face(roof, [[-16.85, 1.25, 3.9], [xm, 1.25, 4.9], [xm, 7.45, 4.9], [-16.85, 7.45, 3.9]], [-1, 0, 1])
  face(roof, [[X0, 1.25, 3.9], [X0, 7.45, 3.9], [xm, 7.45, 4.9], [xm, 1.25, 4.9]], [1, 0, 1])
  for (const y of [1.4, 7.3]) slabY(rubble, [[-16.7, 3.9], [X0, 3.9], [xm, 4.9]], y - 0.01, y + 0.01)
}

// --- The brick churchyard wall (OSM way/36882465) ---
// The ground rises ~1.2 m from Mulberry to Mott; the wall stands 3.2 m on it.
// Split into ≤5 m pieces so it follows the terrain.
function wall(a: XY, b: XY, h0: number, h1: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / 5)), t = 0.3
  const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy * t, ny = -ux * t
  for (let i = 0; i < n; i++) {
    const p = (k: number): XY => [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]
    const p0 = p(i), p1 = p(i + 1), h = h0 + (h1 - h0) * (i + 0.5) / n
    const ring: V3[] = [[p0[0] - nx, p0[1] - ny, 0], [p1[0] - nx, p1[1] - ny, 0], [p1[0] + nx, p1[1] + ny, 0], [p0[0] + nx, p0[1] + ny, 0]]
    const top = ring.map(([x, y]) => [x, y, h] as V3)
    brick.loft([ring, top]); brick.cap(top, true)
    // brownstone coping
    const cr: V3[] = [[p0[0] - nx * 1.3, p0[1] - ny * 1.3, h], [p1[0] - nx * 1.3, p1[1] - ny * 1.3, h], [p1[0] + nx * 1.3, p1[1] + ny * 1.3, h], [p0[0] + nx * 1.3, p0[1] + ny * 1.3, h]]
    const ct = cr.map(([x, y]) => [x, y, h + 0.25] as V3)
    dress.loft([cr, ct]); dress.cap(ct, true)
  }
}
const MUL = 3.2, MOTT = 4.4
// Mulberry side, south of the church, and north of it to the chancery.
wall([-29.0, 25.6], [-14.9, 24.8], MUL, MUL)
wall([X1 + 2.7, 24.3], [33.5, 23.6], MUL, MUL)
// Prince Street side.
wall([-40.2, -34.6], [-29.0, 25.6], MOTT, MUL)
// Mott Street side, either side of the railing before the Mott Street door.
wall([-40.2, -34.6], [-13.5, -34.3], MOTT, MOTT)
wall([13.8, -34.1], [41.0, -33.8], MOTT, MOTT)

// The Mulberry front and the belfry are lit from the street; the sides and
// Mott Street end only faintly; faces looking up catch little.
const lit = (p: V3, n: V3): number => {
  const up = n[2] > 0.7 ? 0.3 : 1
  if (p[1] > Y1 - 2 || (p[0] < -8 && p[1] > 18 && p[2] > 15)) return up * 0.8
  return 0
}
finishModel("St. Patrick's Old Cathedral", 'nyc-old-st-patricks-cathedral', [
  { part: rubble, material: { ...finish('osp-schist', 0x9d978d), floodlight: lit } },
  { part: dress, material: { ...finish('osp-brownstone', 0xc99f8f), floodlight: lit } },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: brick, material: finish('osp-brick', 0xa9634f) },
  { part: door, material: { ...PALETTE.entrance, color: 0x8e4a4c } },
], { bearing: 288.5, osm: 'way/247845702', height: 26.8 }, 5000)
