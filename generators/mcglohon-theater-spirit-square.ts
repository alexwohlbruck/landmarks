/**
 * Spirit Square and the McGlohon Theater, North Tryon Street, Charlotte: the
 * former First Baptist Church (J. M. McMichael, 1909), a domed neoclassical
 * sanctuary, now the McGlohon Theater, with the church's education wing
 * behind it — procedural, CC0-1.0, no textures.
 * bun generators/mcglohon-theater-spirit-square.ts
 *
 * Map frame: x east, y north, z up, metres, placed at bearing 48.7°, the
 * street grid's axis and the outline's short edges: the model's +x runs
 * south-east from North Tryon Street toward College Street, +y north-east
 * toward East 7th Street. So the church's front faces Tryon on the model's
 * west face. The anchor is the metre-based area centroid of way/131139724,
 * the one OSM outline that covers the sanctuary and the wing.
 *
 * Identity, in order: the pale verdigris dome on a brick drum ringed with
 * arched windows, with its lantern; the three-part Tryon front, a
 * pedimented centre with the great arched rose window over a balustrade
 * and two arched doors, between corner pavilions each under a small dome;
 * the walls of rose-brown brick with cream stone trim, the ground storey
 * banded in cream stone; tall arched windows on the transept gables. The
 * education wing behind is a plainer brick block under a red hipped roof.
 *
 * Dimensions:
 * - Plan: OSM way/131139724, except the sanctuary's north wall. The 2016
 *   lidar (USGS 3DEP NC Phase 4, Mecklenburg) puts it at y = 12.6, not
 *   OSM's 10.0, and centres the dome and the front's gable on y = 0.6; the
 *   south wall (-11.4) and the Tryon front (-30.5) agree with OSM. So the
 *   sanctuary is drawn 24 m wide, symmetric about its real axis, and stands
 *   2.6 m past OSM's north edge over open ground.
 * - Heights, lidar (above the lowest ground): dome drum cornice 21, dome
 *   crown 24.2, lantern 27; front pediment apex 18.3 and nave ridge 18;
 *   transept ridge 18; side walls 12.8; wing 13.5 with its hip to 16.5.
 * - Read off the photos, scaled by the 24 m front: pavilions 7.2 m wide and
 *   centre bay 9.6 m (recessed 1 m, as the lidar shows); banded ground
 *   storey to 7 m; pavilion and side cornice 12.8 m, centre cornice 15.4 m; rose
 *   window radius 3.3 m springing at 10.2 m; small domes 2.5 m in radius
 *   rising to 14.9 m.
 * - Colours: the brick is rose-brown, not buff (the old postcard is
 *   hand-tinted; the photos and the 2025 restoration show brown brick and
 *   cream stone); the domes pale verdigris and the wing's hipped roof red,
 *   as in USGS NAIP.
 * The ground falls about 1 m from Tryon to the wing's far end, so y = 0 is
 * the low end and the front starts at its own ground level.
 *
 * Photos: "Mcglohon.jpg" (Rschoneman, en.wikipedia, public domain; the
 * Tryon front, about 2005); Dclemens1971, "Former First Baptist Church",
 * "Main Library and former First Baptist Church 01" and "02" (Commons, CC BY
 * 4.0; the 2025 restoration, under scaffolding); Mapillary image
 * 3391392104465461 (2022, CC BY-SA 4.0, the south side from Tryon);
 * "First Baptist Church, Charlotte, N.C." (linen postcard, UNC Libraries
 * Commons, public domain; form only, its colours are tinted); USGS NAIP
 * (public domain). Not seen in any licensed photo: the wing's College
 * Street end and its windows, drawn as plain rows.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const brick = new Part(), trim = new Part(), copper = new Part()
const roof = new Part(), win = new Part(), tile = new Part()

type XY = [number, number]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n?: V3[]) {
  p.tri(a, b, c, undefined, undefined, undefined, n && [n[0], n[1], n[2]])
  p.tri(a, c, d, undefined, undefined, undefined, n && [n[0], n[2], n[3]])
}
/** A flat convex polygon wound to face `hint`. */
function poly(p: Part, pts: V3[], hint: V3) {
  const N = unit(hint)
  for (let i = 1; i < pts.length - 1; i++) {
    let a = pts[0], b = pts[i], c = pts[i + 1]
    const n = cross3(sub3(b, a), sub3(c, a))
    if (Math.hypot(...n) < 1e-9) continue
    if (dot3(n, hint) < 0) [b, c] = [c, b]
    p.tri(a, b, c, undefined, undefined, undefined, [N, N, N])
  }
}

// ---------------------------------------------------------------------------
// Polygon helpers: rings counter-clockwise from above.

function ccw(r: XY[]): XY[] {
  let a = 0
  r.forEach((p, i) => { const q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1] })
  return a < 0 ? [...r].reverse() : r
}
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
const edgeN = (a: XY, b: XY): V3 => unit([b[1] - a[1], -(b[0] - a[0]), 0])
function walls(p: Part, r: XY[], z0: number, z1: number, smooth = false) {
  const n = r.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, a = r[i], b = r[j], N = edgeN(a, b)
    let na = N, nb = N
    if (smooth) { na = unit(sub3(edgeN(r[(i + n - 1) % n], a), [-N[0], -N[1], 0])); nb = unit(sub3(edgeN(b, r[(j + 1) % n]), [-N[0], -N[1], 0])) }
    quadN(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [na, nb, nb, na])
  }
}
function cap(p: Part, r: XY[], z: number) {
  const N: V3 = [0, 0, 1]
  for (const [a, b, c] of triangulate(r))
    p.tri([r[a][0], r[a][1], z], [r[b][0], r[b][1], z], [r[c][0], r[c][1], z], undefined, undefined, undefined, [N, N, N])
}
/** A solid with a chamfered top edge of size b; the top goes to `top`. */
function prism(p: Part, r: XY[], z0: number, z1: number, b: number, top: Part | null = p, smooth = false) {
  r = ccw(r)
  walls(p, r, z0, z1 - b, smooth)
  const r2 = offset(r, -b)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length, N = edgeN(r[i], r[j]), M = unit([N[0], N[1], 1])
    quadN(p, [r[i][0], r[i][1], z1 - b], [r[j][0], r[j][1], z1 - b], [r2[j][0], r2[j][1], z1], [r2[i][0], r2[i][1], z1], [M, M, M, M])
  }
  if (top) cap(top, r2, z1)
}
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const circle = (c: XY, R: number, n: number, a0 = 0): XY[] =>
  Array.from({ length: n }, (_, k) => { const t = a0 + 2 * Math.PI * k / n; return [c[0] + R * Math.cos(t), c[1] + R * Math.sin(t)] as XY })

/**
 * A wall face from A to B (outside on the right), on which shapes are drawn
 * in (s, z) — s metres along the wall from A — just proud of it.
 */
function face(A: XY, B: XY) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
  const n = edgeN(A, B)
  const at = (s: number, z: number, o: number): V3 => [A[0] + u[0] * s + n[0] * o, A[1] + u[1] * s + n[1] * o, z]
  return {
    L,
    rect(p: Part, s0: number, s1: number, z0: number, z1: number, o = 0.04) { poly(p, [at(s0, z0, o), at(s1, z0, o), at(s1, z1, o), at(s0, z1, o)], n) },
    /** A round-headed opening: a semicircle on top of a rectangle. */
    arch(p: Part, sc: number, w: number, z0: number, zs: number, o = 0.04) {
      const r = w / 2, pts: V3[] = [at(sc - r, z0, o), at(sc + r, z0, o)]
      for (let k = 0; k <= 10; k++) { const t = Math.PI * k / 10; pts.push(at(sc + r * Math.cos(t), zs + r * Math.sin(t), o)) }
      poly(p, pts, n)
    },
    /** A pediment: a triangle from s0 to s1 between z0 and its apex at zp. */
    gable(p: Part, s0: number, s1: number, z0: number, zp: number, o = 0) { poly(p, [at(s0, z0, o), at(s1, z0, o), at((s0 + s1) / 2, zp, o)], n) },
  }
}

/** A gable roof whose ridge runs along x (axis 'x') or y, over a rectangle. */
function gableRoof(p: Part, x0: number, x1: number, y0: number, y1: number, ze: number, zr: number, axis: 'x' | 'y', over = 0.35) {
  if (axis === 'x') {
    const yc = (y0 + y1) / 2, a = y0 - over, b = y1 + over, k = (zr - ze) / (yc - y0), zl = ze - over * k
    const nS = unit([0, -(zr - ze), yc - y0]), nN = unit([0, zr - ze, yc - y0])
    quadN(p, [x0, a, zl], [x1, a, zl], [x1, yc, zr], [x0, yc, zr], [nS, nS, nS, nS])
    quadN(p, [x1, b, zl], [x0, b, zl], [x0, yc, zr], [x1, yc, zr], [nN, nN, nN, nN])
  } else {
    const xc = (x0 + x1) / 2, a = x0 - over, b = x1 + over, k = (zr - ze) / (xc - x0), zl = ze - over * k
    const nW = unit([-(zr - ze), 0, xc - x0]), nE = unit([zr - ze, 0, xc - x0])
    quadN(p, [a, y1, zl], [a, y0, zl], [xc, y0, zr], [xc, y1, zr], [nW, nW, nW, nW])
    quadN(p, [b, y0, zl], [b, y1, zl], [xc, y1, zr], [xc, y0, zr], [nE, nE, nE, nE])
  }
}

/** A dome: a spherical cap over a circle of radius R at z0 rising `rise`, smooth-shaded. */
function dome(p: Part, c: XY, z0: number, R: number, rise: number, seg = 16, rings = 5, a0 = 0) {
  const rho = (R * R + rise * rise) / (2 * rise), zc = z0 + rise - rho, phi0 = Math.asin(R / rho)
  const pt = (i: number, k: number): [V3, V3] => {
    const phi = phi0 * (1 - k / rings), t = a0 + 2 * Math.PI * i / seg
    const n: V3 = [Math.sin(phi) * Math.cos(t), Math.sin(phi) * Math.sin(t), Math.cos(phi)]
    return [[c[0] + rho * n[0], c[1] + rho * n[1], zc + rho * n[2]], n]
  }
  for (let k = 0; k < rings; k++) for (let i = 0; i < seg; i++) {
    const [a, na] = pt(i, k), [b, nb] = pt(i + 1, k), [d, nd] = pt(i, k + 1), [e, ne] = pt(i + 1, k + 1)
    if (k === rings - 1) p.tri(a, b, e, undefined, undefined, undefined, [na, nb, ne])
    else quadN(p, a, b, e, d, [na, nb, ne, nd])
  }
}

// ---------------------------------------------------------------------------
// Dimensions.

const g = (x: number) => Math.max(0, 0.95 * (29.5 - x) / 60)
const XF = -30.5, XR = 1.6          // the sanctuary's front (the pavilions' faces) and back
const XC = XF + 1.0                 // the recessed centre bay's face
const YS = -11.4, YN = 12.6         // its south and north sides (lidar)
const YC = (YS + YN) / 2            // the axis
const GF = g(XF)                    // ground at the front
const P = 7.2                       // corner pavilions' width (and depth)
const CY0 = YS + P, CY1 = YN - P    // the centre bay
const Z_BAND = GF + 7.0             // top of the banded ground storey
const Z_SIDE = 12.8                 // side walls' cornice
const Z_PAV = Z_SIDE                // the corner pavilions' cornice
const Z_COR = 15.4                  // centre bay and transept cornice
const Z_PED = 18.3                  // pediment apex
const TX0 = -18.0, TX1 = -8.0       // the transept
const DC: XY = [-13.0, YC]          // the dome's centre, on the crossing
const R_DRUM = 5.5, Z_DRUM1 = 21.0, Z_DOME = 24.2

/** A pale band all round a ring, just proud of its walls. */
function band(ring: XY[], z0: number, z1: number, o = 0.08, b = 0.06) {
  prism(trim, offset(ccw(ring), o), z0, z1, b, null)
}

// ---------------------------------------------------------------------------
// The sanctuary: low side bays and pavilions, a taller centre bay and
// transept with gables, the drum and dome over the crossing.

const BODY: XY[] = [[XF, YS], [XR, YS], [XR, YN], [XF, YN], [XF, CY1], [TX0, CY1], [TX0, CY0], [XF, CY0]]
prism(brick, BODY, 0, Z_SIDE, 0, null)
cap(roof, offset(ccw(BODY), 0.1), Z_SIDE + 0.25)
prism(trim, offset(ccw(BODY), 0.3), Z_SIDE - 0.7, Z_SIDE + 0.3, 0.25, null)
// The corner pavilions are the front ends of the side ranges.
const PAVS: [number, number][] = [[YS, CY0], [CY1, YN]]
// The centre bay, recessed 1 m between them, and the nave behind it to the
// crossing, at the main cornice; the transept across at the same height.
const CBAY = ccw(rect(XC, TX0, CY0, CY1))
prism(brick, CBAY, 0, Z_COR, 0, null)
prism(trim, [[XC - 0.35, CY0 - 0.15], [TX0, CY0 - 0.15], [TX0, CY1 + 0.15], [XC - 0.35, CY1 + 0.15]], Z_COR - 0.9, Z_COR + 0.3, 0.25, null)
const TRANS = ccw(rect(TX0, TX1, YS, YN))
prism(brick, TRANS, Z_SIDE, Z_COR, 0, null)
prism(trim, offset(TRANS, 0.3), Z_COR - 0.9, Z_COR + 0.3, 0.25, null)
// Gable roofs: the nave along x from the front to the back, the transept along y.
gableRoof(roof, XC, XR, CY0, CY1, Z_COR, Z_PED, 'x')
gableRoof(roof, TX0, TX1, YS, YN, Z_COR, Z_PED - 0.3, 'y')
{
  // Pediments: the front, both transept ends, with pale raking cornices; a plain brick gable at the back.
  const peds: [XY, XY, number][] = [
    [[XC, CY1], [XC, CY0], Z_PED],
    [[TX0, YS], [TX1, YS], Z_PED - 0.3],
    [[TX1, YN], [TX0, YN], Z_PED - 0.3],
    [[XR, CY0], [XR, CY1], Z_PED],
  ]
  for (const [A, B, zp] of peds) {
    const f = face(A, B), L = f.L, z0 = Z_COR + 0.3
    f.gable(brick, 0, L, z0, zp)
    const k = (zp - z0) / (L / 2), h = 0.55
    poly(trim, [[0, z0], [L / 2, zp], [L / 2, zp + h], [-0.35, z0 + h - 0.35 * k]].map(([s, z]) => fpt(A, B, s, z, 0.12)), edgeN(A, B))
    poly(trim, [[L, z0], [L + 0.35, z0 + h - 0.35 * k], [L / 2, zp + h], [L / 2, zp]].map(([s, z]) => fpt(A, B, s, z, 0.12)), edgeN(A, B))
  }
}
function fpt(A: XY, B: XY, s: number, z: number, o: number): V3 {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], n = edgeN(A, B)
  return [A[0] + u[0] * s + n[0] * o, A[1] + u[1] * s + n[1] * o, z]
}

// The banded ground storey, drawn as three broad cream courses (the stone
// base, one mid course and the belt course) so it reads at phone size
// rather than shimmering as the real dozen thin bands would.
{
  const z = GF + 3.2
  band(BODY, z, z + 0.7, 0.05, 0.05)
  band(CBAY, z, z + 0.7, 0.05, 0.05)
}
band(BODY, Z_BAND - 0.6, Z_BAND, 0.18, 0.12)
band(CBAY, Z_BAND - 0.6, Z_BAND, 0.18, 0.12)
band(BODY, 0, GF + 0.9, 0.1, 0.08) // the stone base
band(CBAY, 0, GF + 0.6, 0.1, 0.08)

// The drum, ringed with arched windows, its cornice, the dome and the lantern.
{
  const N = 16
  prism(brick, circle(DC, R_DRUM, N, Math.PI / N), Z_COR, Z_DRUM1 - 0.6, 0, null, true)
  prism(trim, circle(DC, R_DRUM + 0.35, N, Math.PI / N), Z_DRUM1 - 0.8, Z_DRUM1, 0.25, null, true)
  dome(copper, DC, Z_DRUM1, R_DRUM + 0.15, Z_DOME - Z_DRUM1, 16, 5, Math.PI / N)
  const ring = circle(DC, R_DRUM, N, Math.PI / N)
  for (let i = 0; i < N; i += 2) {
    const f = face(ring[i], ring[(i + 1) % N])
    f.arch(trim, f.L / 2, 1.75, 17.4, 19.2, 0.03)
    f.arch(win, f.L / 2, 1.25, 17.6, 19.2, 0.07)
  }
  // The lantern: a cream drum, a little dome and a finial.
  prism(trim, circle(DC, 1.1, 12), Z_DOME - 0.4, Z_DOME + 1.8, 0.15, null, true)
  for (let i = 0; i < 12; i += 3) {
    const r = circle(DC, 1.1, 12), f = face(r[i], r[(i + 1) % 12])
    f.arch(win, f.L / 2, 0.45, Z_DOME + 0.3, Z_DOME + 1.2, 0.03)
  }
  dome(copper, DC, Z_DOME + 1.8, 1.3, 0.8, 12, 3)
  prism(trim, circle(DC, 0.14, 6), Z_DOME + 2.5, Z_DOME + 2.8, 0, trim)
}

// The corner pavilions' small domes on low square bases.
for (const [y0, y1] of PAVS) {
  const c: XY = [XF + P / 2, (y0 + y1) / 2]
  prism(brick, rect(c[0] - 2.6, c[0] + 2.6, c[1] - 2.6, c[1] + 2.6), Z_PAV, Z_PAV + 0.5, 0.15, null)
  dome(copper, c, Z_PAV + 0.5, 2.55, 1.9, 12, 4)
}

// The Tryon front.
{
  // The centre bay: two arched doors in cream frames, a column between,
  // the balustrade, the great arch with its rose window.
  const f = face([XC, CY1], [XC, CY0]), sc = f.L / 2
  for (const d of [-2.15, 2.15]) {
    f.arch(trim, sc + d, 2.5, GF + 0.6, GF + 4.0, 0.03)
    f.arch(win, sc + d, 1.8, GF + 0.6, GF + 4.0, 0.07)
  }
  f.rect(trim, sc - 0.35, sc + 0.35, GF + 0.6, Z_BAND - 0.6, 0.12)
  f.rect(trim, 0.3, f.L - 0.3, GF + 8.1, GF + 8.9, 0.14)       // the balustrade
  f.arch(trim, sc, 2 * 4.0, GF + 8.9, 10.2, 0.03)               // the archivolt
  f.arch(win, sc, 2 * 3.3, GF + 8.9, 10.2, 0.07)                // the rose window
  for (const k of [-1, 1]) f.rect(trim, sc + k * 1.1 - 0.12, sc + k * 1.1 + 0.12, GF + 8.9, 10.2 + Math.sqrt(3.3 * 3.3 - 1.21) - 0.1, 0.1)
  f.rect(trim, sc - 3.3, sc + 3.3, 10.05, 10.35, 0.1)            // its transom
  // A frieze band under the main cornice.
  f.rect(trim, 0, f.L, Z_COR - 1.6, Z_COR - 1.2, 0.05)
  // The pavilions' fronts: three arched windows above, one below.
  const pf = face([XF, YN], [XF, YS])
  for (const pc of [P / 2, pf.L - P / 2]) {
    for (const d of [-1.7, 0, 1.7]) {
      pf.arch(trim, pc + d, 1.45, GF + 8.3, GF + 9.9, 0.03)
      pf.arch(win, pc + d, 1.05, GF + 8.4, GF + 9.9, 0.07)
    }
    pf.rect(trim, pc - 2.6, pc + 2.6, GF + 7.9, GF + 8.3, 0.1)
    pf.rect(trim, pc - 1.0, pc + 1.0, GF + 2.3, GF + 5.3, 0.06)
    pf.rect(win, pc - 0.7, pc + 0.7, GF + 2.5, GF + 5.1, 0.1)
  }
}

// The sides: the pavilion bay, a nave bay, the transept's great window and
// paired windows, and the rear bays — all three-arched above, one below.
for (const [A, B] of [[[XF, YS], [XR, YS]], [[XR, YN], [XF, YN]]] as [XY, XY][]) {
  const f = face(A, B), south = A[1] === YS
  const s = (x: number) => (south ? x - XF : XR - x)
  const pc = XF + P / 2
  for (const d of [-1.7, 0, 1.7]) {
    f.arch(trim, s(pc) + d, 1.45, g(pc) + 8.3, g(pc) + 9.9, 0.03)
    f.arch(win, s(pc) + d, 1.05, g(pc) + 8.4, g(pc) + 9.9, 0.07)
  }
  for (const x of [-21.3, -4.6, -0.6]) {
    f.arch(trim, s(x), 2.0, g(x) + 7.7, g(x) + 10.6, 0.03)
    f.arch(win, s(x), 1.5, g(x) + 7.8, g(x) + 10.6, 0.07)
    f.rect(win, s(x) - 0.65, s(x) + 0.65, g(x) + 2.4, g(x) + 5.1, 0.1)
  }
  const xt = (TX0 + TX1) / 2
  f.arch(trim, s(xt), 4.4, g(xt) + 7.3, g(xt) + 11.6, 0.03)
  f.arch(win, s(xt), 3.6, g(xt) + 7.4, g(xt) + 11.6, 0.07)
  for (const d of [-2.4, 2.4]) {
    f.arch(trim, s(xt) + d, 1.7, g(xt) + 1.6, g(xt) + 4.6, 0.03)
    f.arch(win, s(xt) + d, 1.2, g(xt) + 1.7, g(xt) + 4.6, 0.07)
  }
}

// ---------------------------------------------------------------------------
// The education wing behind: a plainer brick block, a cream cornice, a red
// hipped roof over its middle (NAIP).

{
  const WING: XY[] = [[XR, YS], [23.0, YS], [23.0, -8.5], [29.4, -8.5], [29.5, 12.9], [XR, 12.9]]
  const ZW = 13.5
  prism(brick, WING, 0, ZW, 0, null)
  prism(trim, offset(ccw(WING), 0.25), ZW - 0.6, ZW + 0.2, 0.2, null)
  cap(roof, offset(ccw(WING), 0.05), ZW + 0.15)
  band(WING, 0, g(15) + 0.9, 0.08, 0.06)
  const x0 = 6.0, x1 = 22.0, y0 = -5.5, y1 = 11.0, zb = ZW + 0.15, zr = 16.5, inset = 3.6
  const r0: V3[] = [[x0, y0, zb], [x1, y0, zb], [x1, y1, zb], [x0, y1, zb]]
  const r1: V3[] = [[x0 + inset, y0 + inset, zr], [x1 - inset, y0 + inset, zr], [x1 - inset, y1 - inset, zr], [x0 + inset, y1 - inset, zr]]
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; poly(tile, [r0[i], r0[j], r1[j], r1[i]], cross3(sub3(r0[j], r0[i]), sub3(r1[i], r0[i]))) }
  poly(tile, r1, [0, 0, 1])
  // Its windows: a panel per bay for each of the three storeys.
  const rows = [[1.8, 4.2], [5.6, 8.0], [9.4, 11.8]]
  const sides: [XY, XY][] = [[[XR, YS], [23.0, YS]], [[23.0, -8.5], [29.4, -8.5]], [[29.4, -8.5], [29.5, 12.9]], [[29.5, 12.9], [XR, 12.9]]]
  for (const [A, B] of sides) {
    const f = face(A, B), n = Math.max(1, Math.floor((f.L - 1.2) / 3.4)), pitch = (f.L - 1.2) / n
    for (let k = 0; k < n; k++) {
      const sc = 0.6 + pitch * (k + 0.5), xm = A[0] + (B[0] - A[0]) * sc / f.L
      if ((A[0] === XR || B[0] === XR) && Math.abs(xm - XR) < 3) continue
      for (const [z0, z1] of rows) f.rect(win, sc - 0.85, sc + 0.85, g(xm) + z0, g(xm) + z1, 0.06)
    }
  }
}

// ---------------------------------------------------------------------------

// Colours from the photos: the rose-brown brick pulled light; cream stone
// trim; pale verdigris domes (NAIP); grey flat and slate roofs; the wing's
// red hipped roof; slate windows (the doors' and rose window's glazing
// included, so the front glows at night).
const parts = [
  { part: brick, material: finish('fbc-brick', 0xb0907f) },
  { part: trim, material: PALETTE.trim },
  { part: copper, material: finish('pale-verdigris', 0xa8c5bb) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: tile, material: PALETTE.terracotta },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name}: ${part.triangles}`).join(', '))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('McGlohon Theater at Spirit Square', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 48.7, osm: 'way/131139724', height: Z_DOME + 2.8,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const outFile = new URL('../models/mcglohon-theater-spirit-square.glb', import.meta.url).pathname
await Bun.write(outFile, glb)
console.log(`${outFile}: ${triangles} triangles, ${glb.length} bytes`)
