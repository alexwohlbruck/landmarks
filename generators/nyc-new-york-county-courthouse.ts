/**
 * New York County Courthouse (New York State Supreme Court), 60 Centre
 * Street, Foley Square, Manhattan (1913-1927, Guy Lowell) — original
 * procedural geometry, CC0-1.0.
 * bun generators/nyc-new-york-county-courthouse.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 15: the
 * model's north runs along the portico front, so +x points 105 degrees
 * (east-south-east) and the portico faces the model's -x, west-north-west
 * onto Foley Square. Anchor = the area centroid of OSM relation/3696430's
 * outer way, -74.0015420, 40.7142864. y = 0 is the street (Centre Street
 * and Foley Square, lidar 6.6 m above the box's ground_min, flat to
 * +-0.3 m round the building).
 *
 * Identity (from the photos below):
 *  1. A regular hexagon, about 99 m across the corners, with six light
 *     courts and a round central rotunda: the plan that reads from above.
 *                                                        (OSM, lidar)
 *  2. The huge Corinthian portico on Foley Square: ten columns across,
 *     three deep at the ends, a plain entablature with the inscription
 *     band, a low pediment with sculpture and three statues on it, over
 *     a broad flight of steps between granite cheeks.     (west, sw, axel)
 *  3. Pale grey granite, a ground storey, a giant engaged colonnade over
 *     three storeys in the middle of each face with tall window bays, an
 *     entablature band, two upper storeys, a deep main cornice and an
 *     attic.                                               (sw, ajay)
 *  4. Small green copper-roofed bulkheads on the roof.     (west, ajay)
 *
 * Plan: OSM relation/3696430 (outer way/278106032, six inner courts
 * way/278106026-031) turned to bearing 15. The outer way is a regular
 * hexagon to within a metre: centre (3.7, 0), apothem 43, corners
 * chamfered about 1.2 m, so it is drawn as one, symmetrical; the portico
 * x -52.5 to -39.3, y +-20.5 (OSM -19.9 to 21.1); courts as OSM draws
 * them. The courts' inner ends follow a 17.5 m circle about the centre.
 *
 * Heights: USGS 3DEP lidar NY_NewYorkCity (2017 flight), 1 m grid, read in
 * the model frame. Measured above the street: wall and cornice 39.1 (OSM
 * says 44 overall); attic, set back about 3.5 m from the cornice edge,
 * 44.0; portico entablature top 25.9, pediment apex 31.5, the apex statue
 * to about 37; the stair rising 3.4 m over about 12 m to the portico
 * floor; the cheek blocks 5.5; the rotunda: a ring at 37-40 round a
 * sunken well with a low dome, about 18 m at its edge to 30 m at the
 * centre; bulkheads 47, a penthouse east of the rotunda 50.5. The light
 * courts read about 6 m below the street (they are drawn to the street).
 *
 * From photos (scaled from the lidar's entablature and podium heights in
 * "west"): column tops 20.9, columns about 1.9 m thick on a 4.1 m
 * spacing, the colonnade bands on the faces (6.5-24 m), the window rows,
 * the doors. Estimated: bay counts on the faces nobody photographed square
 * on (the east and north-east faces are drawn like the south-west one),
 * the attic windows, the rotunda dome's colour (not seen in any photo;
 * drawn as roof grey), the statues as plain blocks.
 *
 * Portico contrast (lead review): the porch's back wall, its ceiling and the
 * recessed tympanum are a shadow colour (`nycc-shade`) so the columns
 * (2.1 m thick on the 4.1 m bay, from "west") and the pediment read at
 * phone size; the steps are the palest stone, wider than the podium. The
 * great door is drawn in `window` (it is bronze and glass, and glows at
 * night), which frees the material slot for the shade.
 *
 * Night: the portico is floodlit (`_FLOODLIGHT` on the front); the rest
 * of the stone gets a faint wash; windows and doors glow by name.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  west   "New York State Supreme Courthouse 60 Centre Street from west.jpg",
 *         Beyond My Ken, CC BY-SA 4.0, 2013.
 *  sw     "New York State Supreme Courthouse 60 Centre Street from
 *         southwest.jpg", Beyond My Ken, CC BY-SA 4.0, 2013.
 *  ajay   "New York County Courthouse - Angle Shot (48129112547).jpg",
 *         Ajay Suresh, CC BY 2.0, 2019 — from the north-west.
 *  axel   "New York County Supreme Court 2021-06-25 11-35.jpg", Axel
 *         Tschentscher, CC BY-SA 4.0 — the portico's south side, the steps.
 *  foley  "Courthouses on Foley Square.jpg", Beyond My Ken, CC BY-SA 4.0.
 *  zuck   "Neo-Classical - New York, NY - New York County Courthouse (4).jpg",
 *         Bmzuckerman, CC BY 4.0.
 * No look-only sources. No commercial imagery. Style match:
 * nyc-tweed-courthouse.ts, a block away.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { revolve, onWall, rectShape, archShape, save } from './atl-tech-tower'
import { along, box, capPoly, ccw, circle, column, cornice, ledge, offset, prism, wall, type XY } from './atl-flatiron-building'

const granite = new Part(), trim = new Part(), roof = new Part(), win = new Part(), shade = new Part(), copper = new Part()
const D2R = Math.PI / 180

// ── Plan ──
const C: XY = [3.7, 0], APO = 43, CR = APO / Math.cos(30 * D2R), CH = 1.2
const V: XY[] = Array.from({ length: 6 }, (_, k) => [C[0] + CR * Math.cos((30 + 60 * k) * D2R), C[1] + CR * Math.sin((30 + 60 * k) * D2R)] as XY)
/** The outline: the hexagon with its corners chamfered, counter-clockwise. */
const HEX: XY[] = V.flatMap((v, k) => [along(v, V[(k + 5) % 6], CH), along(v, V[(k + 1) % 6], CH)])
const COURTS: XY[][] = [
  [[-12.3, 5.9], [-11.6, 7.4], [-10.7, 9.1], [-9.4, 11.0], [-8.1, 12.3], [-6.4, 13.8], [-11.0, 22.5], [-21.4, 16.5], [-22.8, 14.4], [-23.2, 4.3], [-12.8, 4.2]],
  [[-7.1, -13.7], [-9.0, -11.9], [-10.3, -10.4], [-11.2, -9.2], [-11.9, -7.7], [-12.6, -5.8], [-13.0, -3.9], [-23.2, -3.8], [-23.2, -14.4], [-21.8, -16.2], [-18.6, -18.2], [-11.7, -21.9]],
  [[-1.9, 16.3], [-0.0, 16.8], [1.2, 17.1], [3.1, 17.3], [4.5, 17.3], [6.5, 17.3], [7.7, 17.1], [9.6, 16.6], [11.0, 16.1], [16.1, 24.5], [6.1, 30.5], [3.6, 30.6], [-6.6, 24.9]],
  [[10.7, -16.6], [9.0, -17.1], [7.4, -17.6], [5.6, -17.9], [3.4, -17.8], [1.1, -17.5], [-0.8, -17.1], [-2.6, -16.4], [-7.7, -24.7], [2.6, -30.8], [5.1, -30.6], [15.3, -25.1]],
  [[20.9, -6.4], [19.9, -8.3], [18.9, -10.0], [17.3, -12.1], [15.3, -14.0], [19.9, -22.4], [30.0, -17.0], [31.4, -14.7], [31.5, -3.2], [21.7, -3.1], [21.4, -4.7]],
  [[15.6, 13.4], [16.8, 12.2], [17.7, 11.2], [19.0, 9.6], [19.7, 8.5], [20.5, 6.8], [21.4, 4.4], [21.8, 2.2], [31.5, 2.0], [31.8, 13.7], [30.7, 15.8], [20.7, 21.8]],
].map((r) => ccw(r as XY[]))

const WALL = 38.2, CORN = 39.5, ATTIC = 44.0, SET = 3.5, BAND = 23.8, PLINTH = 6.0
const ROT_R = 11, ROT = circle(C, ROT_R, 16)

/** A quad wound to face `want`. */
function face(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}

/**
 * Merge holes into an outer ring with bridge cuts, so capPoly can cap a
 * polygon with holes. Each hole joins the nearest ring vertex it can see.
 */
function keyhole(outer: XY[], holes: XY[][]): XY[] {
  const crosses = (p1: XY, p2: XY, q1: XY, q2: XY) => {
    const d = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    const same = (a: XY, b: XY) => Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-6
    if (same(p1, q1) || same(p1, q2) || same(p2, q1) || same(p2, q2)) return false
    return d(p1, p2, q1) * d(p1, p2, q2) < 0 && d(q1, q2, p1) * d(q1, q2, p2) < 0
  }
  let ring = ccw(outer).slice()
  const hs = holes.map((h) => [...ccw(h)].reverse()).sort((a, b) => Math.max(...b.map((p) => p[0])) - Math.max(...a.map((p) => p[0])))
  hs.forEach((h, hi) => {
    const mi = h.reduce((best, p, i) => (p[0] > h[best][0] ? i : best), 0), M = h[mi]
    const edges: [XY, XY][] = [...ring.map((p, i) => [p, ring[(i + 1) % ring.length]] as [XY, XY]),
      ...hs.slice(hi).flatMap((g) => g.map((p, i) => [p, g[(i + 1) % g.length]] as [XY, XY]))]
    const order = ring.map((_, i) => i).sort((a, b) => Math.hypot(ring[a][0] - M[0], ring[a][1] - M[1]) - Math.hypot(ring[b][0] - M[0], ring[b][1] - M[1]))
    const vi = order.find((i) => !edges.some(([a, b]) => crosses(M, ring[i], a, b)))
    if (vi === undefined) throw new Error('keyhole: no bridge')
    const loop = [...h.slice(mi), ...h.slice(0, mi), M]
    ring = [...ring.slice(0, vi + 1), ...loop, ring[vi], ...ring.slice(vi + 1)]
  })
  return ring
}

// ── Massing ──
// Outer walls with the plinth band, the entablature band and the main cornice.
wall(granite, HEX, 0, WALL)
cornice(trim, HEX, PLINTH, 0.6, 0.3, null)
ledge(trim, offset(HEX, 0.05), HEX, PLINTH + 0.6) // narrow sill on the band
cornice(trim, HEX, BAND, 2.0, 0.5, null)
ledge(trim, offset(HEX, 0.25), HEX, BAND + 2.0)
cornice(trim, HEX, WALL, CORN - WALL, 1.0, null)
// The cornice's top runs back to the attic: a terrace ring in roof.
const ATT = offset(HEX, -SET)
ledge(roof, offset(HEX, 0.75), ATT, CORN)
wall(granite, ATT, CORN, ATTIC - 0.5)
cornice(trim, ATT, ATTIC - 0.5, 0.5, 0.3, null)
// The roof, holed for the six courts and the rotunda well.
capPoly(roof, keyhole(offset(ATT, 0.05), [...COURTS, ROT]), ATTIC, true)
// The courts' walls, facing in, from the street to the roof.
for (const c of COURTS) wall(granite, [...c].reverse(), 0, ATTIC)

// The rotunda: a round well with a low dome in it.
wall(granite, [...ROT].reverse(), 18, ATTIC)
revolve(roof, C, [[ROT_R, 18], [8.5, 18], [8.5, 19.5], [7.5, 23], [5, 27.5], [2.5, 29.6], [0, 30]], 16, 0, false, false)

// Bulkheads and the penthouse on the roof, copper-capped.
for (const [x, y, w, d, h] of [[-33, 16, 4.5, 4, 47], [-33, -16, 4.5, 4, 47], [17.5, -2, 5, 7, 50.5]] as [number, number, number, number, number][]) {
  box(granite, x - w / 2, x + w / 2, y - d / 2, y + d / 2, ATTIC, h - 1.2, null, 0)
  prism(copper, ccw([[x - w / 2 - 0.3, y - d / 2 - 0.3], [x + w / 2 + 0.3, y - d / 2 - 0.3], [x + w / 2 + 0.3, y + d / 2 + 0.3], [x - w / 2 - 0.3, y + d / 2 + 0.3]]), h - 1.2, h, copper, 0.5)
}

// ── Faces ──
const L = Math.hypot(V[1][0] - V[0][0], V[1][1] - V[0][1])
const PAV = [3.8, 7.3, L - 7.3, L - 3.8] // the corner pavilions' two bays each
const COL0 = 11.2, COL1 = L - 11.2, NB = 7, BW = (COL1 - COL0) / NB
const MIDB = Array.from({ length: NB }, (_, i) => COL0 + (i + 0.5) * BW)
const win_ = (a: XY, b: XY, s: number, w: number, z0: number, z1: number, out = 0.06) => onWall(win, a, b, rectShape(s - w / 2, s + w / 2, z0, z1), out)

for (let k = 0; k < 6; k++) {
  const a = V[k], b = V[(k + 1) % 6]
  const aa = ATT[(2 * k + 1) % 12], ab = ATT[(2 * k + 2) % 12] // the attic's face over this one
  const LA = Math.hypot(ab[0] - aa[0], ab[1] - aa[1])
  const atticW = (s: number) => win_(aa, ab, s - (L - LA) / 2, 1.2, 40.6, 42.7, 0.05)
  if (k === 2) {
    // The west front: the portico covers s 4.3-45.3; strips either side and the wall over the pediment.
    for (const s of [2.4, L - 2.4]) {
      for (const [z0, z1] of [[1.6, 5.0], [7.4, 11.2], [12.8, 16.6], [18.4, 22.2], [27, 30.6], [32.2, 35.8]]) win_(a, b, s, 1.3, z0, z1)
    }
    for (const s of [7.2, 11.8, 16.4, L - 16.4, L - 11.8, L - 7.2]) win_(a, b, s, 1.5, 32.4, 35.8)
    for (const s of [3.2, 8, 12.8, 17.6, L - 17.6, L - 12.8, L - 8, L - 3.2]) atticW(s)
    continue
  }
  // Ground storey: a window per bay.
  for (const s of [...PAV, ...MIDB]) win_(a, b, s, 1.6, 1.6, 5.0)
  // The corner pavilions: punched windows, a storey each.
  for (const s of PAV) for (const [z0, z1] of [[7.4, 11.2], [12.8, 16.6], [18.4, 22.2]]) win_(a, b, s, 1.5, z0, z1)
  // The colonnade: engaged columns at the bay edges, a tall window bay between.
  for (let i = 0; i <= NB; i++) {
    const s = COL0 + i * BW, c = along(a, b, s, 0.25)
    column(granite, c, 0.8, PLINTH + 0.6, BAND - 1.1, 10)
    const p = along(a, b, s - 1.0, 0), q = along(a, b, s + 1.0, 1.25)
    prism(trim, ccw([p, along(a, b, s + 1.0, 0), q, along(a, b, s - 1.0, 1.25)]), BAND - 1.1, BAND, trim, 0.15) // capital
  }
  for (const s of MIDB) win_(a, b, s, BW - 2.0, 7.4, 22.4)
  // The two upper storeys and the attic.
  for (const s of [...PAV, ...MIDB]) {
    win_(a, b, s, 1.5, 27.0, 30.6)
    win_(a, b, s, 1.5, 32.2, 35.8)
    atticW(s)
  }
}

// ── The portico ──
const PX0 = -52.5, PX1 = -39.3, PY = 20.5, FLOOR = 3.4, CAPT = 20.9, ENT = 25.9, APEX = 31.5
box(granite, PX0, PX1 + 0.5, -PY, PY, 0, FLOOR, granite, 0.1) // the podium
const COLS: XY[] = Array.from({ length: 10 }, (_, i) => [PX0 + 1.3, -18.45 + i * 4.1] as XY)
for (const y of [-18.45, 18.45]) for (const x of [-47.3, -43.3]) COLS.push([x, y])
for (const c of COLS) {
  box(trim, c[0] - 1.15, c[0] + 1.15, c[1] - 1.15, c[1] + 1.15, FLOOR, FLOOR + 0.7, trim, 0.1) // base
  column(granite, c, 1.05, FLOOR + 0.7, CAPT - 1.4, 14)
  box(trim, c[0] - 1.25, c[0] + 1.25, c[1] - 1.25, c[1] + 1.25, CAPT - 1.4, CAPT, null, 0) // Corinthian capital, as a block
}
box(trim, PX0, PX1 + 0.5, -PY - 0.1, PY + 0.1, CAPT, ENT - 1.6, trim, 0, true) // architrave and inscription frieze
box(trim, PX0 - 0.6, PX1 + 0.5, -PY - 0.6, PY + 0.6, ENT - 1.6, ENT, null, 0.15, true) // cornice
{
  // The pediment, its roof running back into the main block.
  const f = PX0 - 0.6, back = PX1 + 0.5, w = PY + 0.6
  const A: V3 = [f, -w, ENT], B: V3 = [f, w, ENT], T: V3 = [f, 0, APEX]
  const A2: V3 = [back, -w, ENT], B2: V3 = [back, w, ENT], T2: V3 = [back, 0, APEX]
  // The pediment's face: a raking cornice in trim framing the recessed tympanum.
  const k = 1.5, slope = (APEX - ENT) / w, ti = 0.9
  const Ai: V3 = [f, -w + k / slope + k, ENT + k * 0.6], Bi: V3 = [f, w - k / slope - k, ENT + k * 0.6], Ti: V3 = [f, 0, APEX - k * 1.3]
  const back3 = (q: V3): V3 => [q[0] + ti, q[1], q[2]]
  face(trim, A, Ai, Ti, T, [-1, 0, 0]); face(trim, T, Ti, Bi, B, [-1, 0, 0]); face(trim, A, B, Bi, Ai, [-1, 0, 0])
  face(trim, Ai, back3(Ai), back3(Ti), Ti, [0, 1, -0.3]); face(trim, Ti, back3(Ti), back3(Bi), Bi, [0, -1, -0.3])
  face(trim, Ai, Bi, back3(Bi), back3(Ai), [0, 0, 1])
  shade.tri(back3(Ai), back3(Ti), back3(Bi)) // the tympanum, recessed and in shadow
  face(roof, A2, A, T, T2, [0, -1, 1])
  face(roof, B, B2, T2, T, [0, 1, 1])
  // Statues on pedestals at the apex and the two ends.
  for (const [y, z] of [[0, APEX - 0.4], [-w + 1.2, ENT], [w - 1.2, ENT]] as [number, number][]) {
    box(trim, f + 0.4, f + 2.2, y - 0.9, y + 0.9, z, z + 1.4, trim, 0.1)
    box(granite, f + 0.8, f + 1.8, y - 0.55, y + 0.55, z + 1.4, z + 4.6, granite, 0.3)
  }
}
// The back wall of the portico: the great door, arched openings at the ends, windows.
{
  const a = V[2], b = V[3], sc = L / 2
  // The porch: its back wall and ceiling in the shadow colour, so the columns stand out.
  onWall(shade, a, b, rectShape(sc - 20.4, sc + 20.4, FLOOR, CAPT), 0.03)
  face(shade, [PX0 + 0.05, -PY + 0.05, CAPT - 0.02], [PX1, -PY + 0.05, CAPT - 0.02], [PX1, PY - 0.05, CAPT - 0.02], [PX0 + 0.05, PY - 0.05, CAPT - 0.02], [0, 0, -1])
  // The great bronze door (glazed; drawn in window so it glows at night).
  onWall(win, a, b, rectShape(sc - 1.7, sc + 1.7, FLOOR, FLOOR + 7.2), 0.08)
  win_(a, b, sc, 3.4, FLOOR + 7.8, FLOOR + 10.4, 0.08)
  for (const s of [sc - 14.3, sc + 14.3]) onWall(win, a, b, archShape(s, 4.2, FLOOR, FLOOR + 8.5, 8), 0.08)
  for (const s of [sc - 9.6, sc - 4.9, sc + 4.9, sc + 9.6]) {
    win_(a, b, s, 1.6, FLOOR + 1.6, FLOOR + 5.4, 0.08)
    win_(a, b, s, 1.6, 12.4, 15.6, 0.08)
  }
}
// The steps: from the street up to the portico floor, between granite cheeks.
const STEPS = 12, RUN = 12, SW = PY + 2
for (let k = 0; k < STEPS; k++) {
  const x0 = PX0 - (RUN * (k + 1)) / STEPS, z = FLOOR * (1 - k / STEPS)
  box(trim, x0, PX0, -SW, SW, 0, z, trim, 0)
}
for (const s of [-1, 1]) {
  const y0 = s * SW, y1 = s * (SW + 3)
  box(granite, PX0 - RUN + 2, PX0, Math.min(y0, y1), Math.max(y0, y1), 0, 5.5, trim, 0.2)
}

// Night: the portico is floodlit from the plaza; the rest of the stone catches a little light.
const lit = (p: V3, n: V3) => (p[0] < -36 && n[2] < 0.7 ? 0.85 : n[2] > 0.7 ? 0.05 : 0.1)
await save('nyc-new-york-county-courthouse', 'New York County Courthouse', [
  { part: granite, material: { ...finish('nycc-granite', 0xd3d0c8), floodlight: lit } },
  { part: trim, material: { ...finish('nycc-trim', 0xe6e4dd), floodlight: lit } },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: shade, material: finish('nycc-shade', 0x7d7b76) },
  { part: copper, material: PALETTE.copper },
], { height: 50.5, anchor: [40.7142864, -74.001542], bearing: 15 }, 6500)
