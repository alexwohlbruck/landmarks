/**
 * Carolina Theatre, 230 North Tryon Street, Charlotte (1927 movie palace,
 * restored and reopened in 2025 behind the new Belk Place lobby) —
 * procedural, CC0-1.0, no textures.
 * bun generators/carolina-theatre.ts
 *
 * Map frame: x east, y north, z up, metres, placed at bearing 47.3°, the
 * street grid's axis: the model's +y runs north-east along North Tryon Street
 * toward 6th Street, +x runs south-east along 6th Street toward College
 * Street. So the Tryon front is the model's west face and 6th Street its
 * north face. The anchor is the metre-based area centroid of the theatre's
 * OSM outline, way/502725466.
 *
 * What stands there today. The theatre's 1927 Tryon Street lobby building
 * is long gone (the 2016 lidar shows an empty lot and an older block where
 * it stood), so there is no historic brick facade on Tryon any more. The
 * Tryon front is the glass Belk Place pavilion (2024-25): a two-tier glass
 * box with the vertical CAROLINA blade sign beside its door. The 1927
 * brick shows on 6th Street: the auditorium's long wall, the stage house,
 * and the low annexes with three round-arched windows. The InterContinental
 * hotel planned with Belk Place is not in OSM and stands outside this
 * outline (its site is across 6th Street), so it is not modelled and
 * `replaces` does not touch it.
 *
 * Parts follow OSM's building:parts of way/502725466:
 * - the pavilion (1410822079-085, 091; OSM 23-29 m): a lower lobby of clear
 *   glass inside a pale frame that stands proud on Tryon and turns 9 m onto
 *   6th Street (1410822091, 16 m), white piers and a mezzanine beam showing
 *   through it; above, two floors of reflective blue glass, a dark louvre
 *   strip and a white coping band at 27 m;
 * - the auditorium (1410822084): red brick, eaves 17 m and a low gable ridge
 *   at 21.5 m along its length (lidar);
 * - the stage house (1410822086): 24.5 m (lidar);
 * - the annexes along 6th Street (1410822087, 088, 090): 8, 5.5 and 8 m
 *   (lidar), the two-storey one with its three round-arched windows;
 * - the back-of-house blocks on the south side (1410822092-095): 27, 25 and
 *   23 m (lidar).
 *
 * Evidence:
 * - OSM way/502725466 and parts (plan; pavilion heights).
 * - Lidar: USGS 3DEP NC Phase 4 Mecklenburg 2016 (flown before the
 *   pavilion), heights above the lowest ground: auditorium eaves 17 /
 *   ridge 21.5, stage house 24.5, back blocks 27/25/23, annexes 8/5.5/8.
 *   The ground falls about 1.4 m from Tryon to the College Street end, so
 *   y = 0 is the College Street end and each block sits on its own ground.
 * - Photos (Wikimedia Commons, all CC BY-SA 4.0): City Dweller 2,
 *   "Carolina Theater entrance Late March 2025" (from across Tryon at 6th,
 *   day), "Intercontinental Hotel at Belk Place site before construction
 *   Late December 2024" and "... Early June 2024" (same corner, day),
 *   "Carolina Theater December 26, 2025" (from across 6th Street, night),
 *   "Carolina Theater along North Tryon St December 26, 2025" (Tryon,
 *   night); Fortibus, "Carolina Theatre Charlotte 1" and "2" (6th Street
 *   side, before restoration). USGS NAIP orthoimagery (public domain).
 * - Read off the photos (estimated, ±1 m): lobby frame top 16 m, mezzanine
 *   beam 11 m, door portal 10 m tall, blade sign 3.8-11 m, coping band
 *   1.8 m, louvre strip 1.3 m.
 * - Not seen in any licensed photo: the College Street end and the south
 *   blocks' faces; drawn plain, with one band of windows on the stage-house
 *   block's College face as before.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const brick = new Part(), trim = new Part(), roof = new Part()
const win = new Part(), glass = new Part(), lit = new Part()

type XY = [number, number]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n?: V3[]) {
  p.tri(a, b, c, undefined, undefined, undefined, n && [n[0], n[1], n[2]])
  p.tri(a, c, d, undefined, undefined, undefined, n && [n[0], n[2], n[3]])
}

// ---------------------------------------------------------------------------
// Polygon helpers: rings counter-clockwise from above.

function triangulate(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 5000) {
    for (let i = 0; i < idx.length; i++) {
      const a = idx[(i + idx.length - 1) % idx.length], b = idx[i], c = idx[(i + 1) % idx.length]
      if (cr(r[a], r[b], r[c]) <= 1e-9) continue
      if (idx.some((j) => j !== a && j !== b && j !== c && inside(r[j], r[a], r[b], r[c]))) continue
      out.push([a, b, c]); idx.splice(i, 1); break
    }
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}
function offset(r: XY[], d: number): XY[] {
  const n = r.length
  return r.map((p, i) => {
    const a = r[(i + n - 1) % n], b = r[(i + 1) % n]
    const e1 = unit([p[0] - a[0], p[1] - a[1], 0]), e2 = unit([b[0] - p[0], b[1] - p[1], 0])
    const n1: XY = [e1[1], -e1[0]], n2: XY = [e2[1], -e2[0]]
    const m = unit([n1[0] + n2[0], n1[1] + n2[1], 0]), cos = m[0] * n1[0] + m[1] * n1[1]
    const k = d / Math.max(cos, 0.3)
    return [p[0] + m[0] * k, p[1] + m[1] * k]
  })
}
function ccw(r: XY[]): XY[] {
  let a = 0
  r.forEach((p, i) => { const q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1] })
  return a < 0 ? [...r].reverse() : r
}
const edgeN = (a: XY, b: XY): V3 => unit([b[1] - a[1], -(b[0] - a[0]), 0])
function walls(p: Part, r: XY[], z0: number, z1: number, skip: number[] = []) {
  for (let i = 0; i < r.length; i++) {
    if (skip.includes(i)) continue
    const j = (i + 1) % r.length, a = r[i], b = r[j], N = edgeN(a, b)
    quadN(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [N, N, N, N])
  }
}
function cap(p: Part, r: XY[], z: number) {
  const N: V3 = [0, 0, 1]
  for (const [a, b, c] of triangulate(r))
    p.tri([r[a][0], r[a][1], z], [r[b][0], r[b][1], z], [r[c][0], r[c][1], z], undefined, undefined, undefined, [N, N, N])
}
/** A solid with a chamfered top edge of size b (in `edge`); the top goes to `top`. */
function prism(p: Part, r: XY[], z0: number, z1: number, b: number, top: Part | null = p, edge: Part = p) {
  r = ccw(r)
  walls(p, r, z0, z1 - b)
  const r2 = offset(r, -b)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length, N = edgeN(r[i], r[j]), M = unit([N[0], N[1], 1])
    quadN(edge, [r[i][0], r[i][1], z1 - b], [r[j][0], r[j][1], z1 - b], [r2[j][0], r2[j][1], z1], [r2[i][0], r2[i][1], z1], [M, M, M, M])
  }
  if (top) cap(top, r2, z1)
}
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
/** A flat panel on a vertical wall, from p to q along it (outside on the right), pushed out by o. */
function panel(part: Part, p: XY, q: XY, z0: number, z1: number, o = 0.04) {
  const N = edgeN(p, q), a: XY = [p[0] + N[0] * o, p[1] + N[1] * o], b: XY = [q[0] + N[0] * o, q[1] + N[1] * o]
  quadN(part, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [N, N, N, N])
}
/** A round-headed window on a wall running along +x at y (facing +y), flush. */
function archNorth(part: Part, xc: number, y: number, w: number, z0: number, zs: number, o = 0.04) {
  const r = w / 2, N: V3 = [0, 1, 0], pts: XY[] = [[xc + r, z0], [xc + r, zs]]
  for (let k = 1; k < 8; k++) { const t = k * Math.PI / 8; pts.push([xc + r * Math.cos(t), zs + r * Math.sin(t)]) }
  pts.push([xc - r, zs], [xc - r, z0])
  for (let i = 1; i < pts.length - 1; i++)
    part.tri([pts[0][0], y + o, pts[0][1]], [pts[i + 1][0], y + o, pts[i + 1][1]], [pts[i][0], y + o, pts[i][1]], undefined, undefined, undefined, [N, N, N])
}

// ---------------------------------------------------------------------------
// Ground: 1.4 m higher on Tryon than at the College Street end.
const g = (x: number) => Math.max(0, 1.4 * (30.5 - x) / 61)

/** A flat band or strip on a wall, on several faces at once. */
const strips = (part: Part, faces: [XY, XY][], z0: number, z1: number, o = 0.05) => faces.forEach(([p, q]) => panel(part, p, q, z0, z1, o))
/** Points along p→q at fraction t. */
const along = (p: XY, q: XY, t: number): XY => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]

// ---------------------------------------------------------------------------
// The Belk Place pavilion on the Tryon corner.

const PX0 = -30.1, PX1 = -9.0, PY0 = -9.4, PY1 = 19.6
const GP = g(-20)
const Z_LOBBY = GP + 16        // top of the lower lobby's frame (OSM strip, 16 m; photos)
const Z_TOP = GP + 27          // pavilion coping (OSM 27 m)
const Z_BAND = Z_TOP - 1.8     // the white coping band
const Z_LOUVRE = Z_BAND - 1.3  // the dark louvre strip under it
const Z_FLOOR = (Z_LOBBY + Z_LOUVRE) / 2 // the one floor line in the upper glass

// The box: reflective glass up to the louvre strip, the strip, then the
// white coping band with a soft top edge.
{
  const r = rect(PX0, PX1, PY0, PY1)
  walls(glass, r, 0, Z_LOUVRE)
  walls(roof, r, Z_LOUVRE, Z_BAND)
  prism(trim, offset(ccw(r), 0.3), Z_BAND, Z_TOP, 0.45, roof)
  // The back extension over the auditorium's front (1410822081, 26 m) and
  // the plant screen on the roof (1410822080, 29 m).
  const back = rect(PX1, -4.9, -2.2, 12.2)
  walls(glass, back, 0, Z_TOP - 1.6, [3])
  prism(trim, back, Z_TOP - 1.6, Z_TOP - 0.9, 0.25, roof)
  prism(roof, rect(-16.1, -9.6, 2.4, 12.2), Z_TOP - 0.2, Z_TOP + 1.4, 0.35)
}
// Upper glass: the floor line between its two storeys, and mullions in
// groups, pale trim on the reflective glass.
{
  const lines = (p: XY, q: XY, z0: number, n: number) => {
    panel(trim, p, q, Z_FLOOR - 0.2, Z_FLOOR + 0.2, 0.05)
    panel(trim, p, q, z0 - 0.35, z0, 0.05)
    for (let k = 1; k < n; k++) {
      const L = Math.hypot(q[0] - p[0], q[1] - p[1]), d = 0.16 / L
      panel(trim, along(p, q, k / n - d), along(p, q, k / n + d), z0, Z_LOUVRE, 0.05)
    }
  }
  lines([PX0, PY1], [PX0, PY0], Z_LOBBY, 6)          // Tryon
  lines([PX1, PY1], [PX0, PY1], Z_LOBBY, 4)          // 6th Street
  lines([PX0, PY0], [PX1, PY0], 20.6, 4)             // over the Foundation building
}

// The lower lobby: a pale frame standing 0.6 m proud on Tryon and turning
// the corner onto 6th Street, clear glass within, the white piers and the
// mezzanine beam behind it showing through.
const O = 0.6, F = 0.6, XF = PX0 - O, YF = PY1 + O
{
  prism(trim, [[XF, PY0 + 0.3], [PX0, PY0 + 0.3], [PX0, PY1], [XF, PY1]], 0, Z_LOBBY, 0.3, trim)
  prism(trim, [[XF, PY1], [-21.0, PY1], [-21.0, YF], [XF, YF]], 0, Z_LOBBY, 0.3, trim)
  // Glass within the frame: Tryon, then 6th Street.
  const yA = YF - F, yB = PY0 + 0.3 + F
  panel(win, [XF, yA], [XF, yB], GP + 0.3, Z_LOBBY - F, 0.03)
  panel(win, [-21 - F, YF], [XF + F, YF], g(-25) + 0.3, Z_LOBBY - F, 0.03)
  // The piers and mezzanine beam seen through the glass.
  for (const y of [3.0, 11.2]) panel(trim, [XF, y + 0.75], [XF, y - 0.75], GP, Z_LOBBY - F, 0.06)
  panel(trim, [XF, yA], [XF, yB], GP + 10.6, GP + 11.4, 0.06)
  panel(trim, [-21 - F, YF], [XF + F, YF], GP + 10.6, GP + 11.4, 0.06)
  // A pier where the frame's return ends on 6th Street.
  panel(trim, [-24.2, YF], [-25.4, YF], g(-25), Z_LOBBY - F, 0.06)
  // The door: a tall pale portal with lit glass doors at its foot.
  panel(trim, [XF, -1.9], [XF, -5.9], GP, GP + 10, 0.08)
  panel(lit, [XF, -2.7], [XF, -5.1], GP, GP + 3.4, 0.12)
  panel(win, [XF, -2.7], [XF, -5.1], GP + 3.9, GP + 9.2, 0.12)
}
// The CAROLINA blade sign: a tall dark box standing off the frame just
// south of the door, lit letters down both faces.
{
  const y0 = -7.85, y1 = -6.85, x0 = XF - 2.2, x1 = XF, z0 = GP + 3.8, z1 = GP + 11
  prism(roof, rect(x0, x1, y0, y1), z0, z1, 0.15, roof)
  quadN(roof, [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [[0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]])
  panel(lit, [x0 + 0.35, y1], [x1 - 0.35, y1], z0 + 0.45, z1 - 0.45, 0.03)
  panel(lit, [x1 - 0.35, y0], [x0 + 0.35, y0], z0 + 0.45, z1 - 0.45, 0.03)
  panel(lit, [x0, y0 + 0.2], [x0, y1 - 0.2], z0 + 0.45, z1 - 0.45, 0.03)
}

// ---------------------------------------------------------------------------
// The 1927 theatre in red brick.

// Auditorium: brick walls to the eaves with a slim parapet on the long
// sides, a low gable roof whose ridge runs back from Tryon.
const AX0 = -9.6, AX1 = 20.7, AY0 = -9.3, AY1 = 16.4, AYC = (AY0 + AY1) / 2
const ZE = 17, ZR = 21.5
{
  walls(brick, rect(AX0, AX1, AY0, AY1), 0, ZE)
  prism(brick, rect(AX0, AX1, AY1 - 0.6, AY1), ZE, ZE + 0.9, 0.25)
  prism(brick, rect(AX0, AX1, AY0, AY0 + 0.6), ZE, ZE + 0.9, 0.25)
  const nS = unit([0, -(ZR - ZE), AYC - AY0]), nN = unit([0, ZR - ZE, AYC - AY0])
  quadN(roof, [AX0, AY0 + 0.6, ZE + 0.5], [AX1, AY0 + 0.6, ZE + 0.5], [AX1, AYC, ZR], [AX0, AYC, ZR], [nS, nS, nS, nS])
  quadN(roof, [AX1, AY1 - 0.6, ZE + 0.5], [AX0, AY1 - 0.6, ZE + 0.5], [AX0, AYC, ZR], [AX1, AYC, ZR], [nN, nN, nN, nN])
  // Brick gable ends, a little above the roof.
  for (const [x, s] of [[AX0, -1], [AX1, 1]] as [number, number][]) {
    const N: V3 = [s, 0, 0], A: V3 = [x, AY0, ZE + 0.9], B: V3 = [x, AY1, ZE + 0.9], C: V3 = [x, AYC, ZR + 0.6]
    if (s > 0) brick.tri(A, B, C, undefined, undefined, undefined, [N, N, N])
    else brick.tri(B, A, C, undefined, undefined, undefined, [N, N, N])
  }
}
// Stage house at the College Street end, taller than the auditorium.
prism(brick, rect(20.7, 30.5, -4.0, 14.7), 0, 24.5, 0.4, roof)

// The annexes along 6th Street.
const ZA = g(-4.5) + 8
prism(brick, rect(-8.9, -0.1, 16.3, 19.5), 0, ZA, 0.35, roof)
prism(brick, rect(-0.1, 20.8, 16.3, 19.5), 0, g(10) + 5.5, 0.35, roof)
prism(brick, rect(20.7, 30.6, 14.7, 19.6), 0, 8, 0.35, roof)
// Pale stone sills and a coping line on the two-storey annex.
panel(trim, [-0.1, 19.5], [-8.9, 19.5], ZA - 0.6, ZA - 0.2, 0.06)
panel(trim, [-0.4, 19.5], [-8.6, 19.5], g(-4.5) + 3.4, g(-4.5) + 3.75, 0.06)
// Its three round-arched windows, in a pale brick arch surround.
for (const xc of [-6.5, -4.5, -2.5]) {
  archNorth(trim, xc, 19.5, 1.75, g(-4.5) + 3.75, g(-4.5) + 5.9, 0.05)
  archNorth(glass, xc, 19.5, 1.25, g(-4.5) + 3.75, g(-4.5) + 5.9, 0.09)
}
// The one-storey annex: two big grid windows and the old side door.
for (const [a, b] of [[1.0, 5.6], [6.4, 11.0]]) panel(glass, [b, 19.5], [a, 19.5], g(3) + 0.9, g(3) + 3.9)
panel(lit, [16.4, 19.5], [14.6, 19.5], g(15), g(15) + 2.8)
for (const xc of [23.2, 25.6, 28.0]) panel(glass, [xc + 0.6, 19.6], [xc - 0.6, 19.6], 1.4, 3.4)

// The back-of-house blocks on the south side.
prism(brick, [[-12.0, -20.9], [-5.6, -21.4], [-5.1, -9.3], [-11.5, -9.3]], 0, 27, 0.4, roof)
prism(brick, [[-12.2, -26.1], [-3.5, -26.7], [-3.0, -21.5], [-5.6, -21.4], [-12.0, -20.9]], 0, 27, 0.4, roof)
prism(brick, rect(7.2, 15.0, -14.0, -9.3), 0, 25, 0.4, roof)
prism(brick, [[7.2, -14.0], [15.0, -14.0], [14.7, -19.3], [18.5, -19.3], [18.5, -28.2], [15.5, -28.0], [-3.5, -26.7], [-3.0, -21.5], [-5.6, -21.4], [-5.1, -9.3], [7.2, -9.3]], 0, 23, 0.4, roof)
// Two bands of windows on the stage-house block's College Street face.
for (const z of [7, 13]) panel(glass, [18.5, -27.4], [18.5, -20.0], z, z + 2.6)

// ---------------------------------------------------------------------------

// Colours from the daylight photos: the orange-red brick pulled light; the
// pavilion's pale frame, piers and coping as trim; the lobby's clear glass,
// white-lit inside, as a pale window; the upper floors' reflective blue
// glass as a light sky slate (window-2, so it still glows at night); the
// door, its lit glass and the sign's letters as entrance.
const parts = [
  { part: brick, material: finish('carolina-brick', 0xc07a62) },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: win, material: { ...PALETTE.window, color: 0xc3d1db } },
  { part: glass, material: windowVariant(2, 0x8fa9bd) },
  { part: lit, material: PALETTE.entrance },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name}: ${part.triangles}`).join(', '))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Carolina Theatre', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 47.3, osm: 'way/502725466', height: Z_TOP + 1.4,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const outFile = new URL('../models/carolina-theatre.glb', import.meta.url).pathname
await Bun.write(outFile, glb)
console.log(`${outFile}: ${triangles} triangles, ${glb.length} bytes`)
