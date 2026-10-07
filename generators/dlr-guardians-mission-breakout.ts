/**
 * Guardians of the Galaxy – Mission: Breakout! (the Collector's fortress; the
 * Twilight Zone Tower of Terror until 2017), Avengers Campus, Disney
 * California Adventure — procedural, CC0-1.0, no textures.
 * bun generators/dlr-guardians-mission-breakout.ts
 *
 * Map frame: x along the tower's long side (+x towards 48°), y towards the
 * front (+y towards 318°, the entrance side), z up, metres. Placed at
 * bearing 318°, so model north (+y) points north-west. The anchor is the
 * vertex centroid of the outline way/313039853.
 *
 * Evidence
 * - OSM (measured): outline way/313039853 and the buildings mapped inside it,
 *   all square to a 48°/138° grid:
 *     way/237074300 the tower, 31.6 × 14.1 m (no height);
 *     way/237074610 its back half, 54.2 m; way/237074302 a block at its
 *       south-west end, 55.3 m; way/123423748 a round crown turret, 55.8 m;
 *     way/243895847 the tower plus the block in front of it (no height);
 *     way/243895850 the whole hotel mass, 18 m;
 *     way/123423749 and way/123423747, two small round turrets at the front.
 * - Published: 183 ft (55.8 m) to the top (Wikipedia, "Guardians of the
 *   Galaxy – Mission: Breakout!"), matching OSM's crown turret.
 * - Photos (Wikimedia Commons), heights scaled off the 55.8 m top:
 *     "Guardians of the Galaxy Mission Breakout.jpg", Contributor19, CC BY 4.0 — front, from the north-west
 *     "Disney California Adventure (46839185762).jpg", Jeremy Thompson, CC BY 2.0 — front and entrance
 *     "Disney California Adventure (51241246031).jpg", Jeremy Thompson, CC BY 2.0 — the tower's end and front
 *     "Disney California Adventure (51241246141).jpg", Jeremy Thompson, CC BY 2.0 — front, wide
 *     "Disney California Adventure (51241446518).jpg", Jeremy Thompson, CC BY 2.0 — the tower's end, from below
 *     "Disney California Adventure (51241447658).jpg", Jeremy Thompson, CC BY 2.0 — from Avengers Campus
 *     "GOTG ride (34404621430).jpg", Alex, CC BY 2.0 — front, 2017
 *
 * Read from the photos: the block in front of the tower stands about 24 m
 * with a gold picket parapet; the entrance pavilion in front of it about
 * 13 m under a dark roof (OSM's 18 m is for the whole hotel mass); the
 * queue buildings and back show building about 10 m under dark roofs. The tower's
 * front carries the Collector's gold triangle emblem high on a copper-red
 * field, a dark slot right of centre, stacked balcony bays, big blue pipes
 * and an overhanging box at each end of the crown, under a jagged gold
 * crown with spires.
 *
 * Estimated: the front block's height (24 m); the blue dome on way/123423749;
 * the gold-dish turret, placed from the photos in front of the tower's right
 * half rather than on OSM's small way/123423747; the crown overhangs and spires;
 * the back faces, which no licensed photo shows well and which repeat the
 * front's treatment more plainly. The facade's pipework, conduits and
 * panelling are far too fine to model and are reduced to large copper
 * panels, gold frames, window bays and a few pipes.
 */
import { Part, cross, len, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const gold = new Part(), copper = new Part(), sand = new Part()
const steel = new Part(), blue = new Part(), win = new Part()

const unit = (v: V3): V3 => { const l = len(v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A triangle whose winding is fixed to face `n` (flat) or its corner normals. */
function tri(p: Part, a: V3, b: V3, c: V3, n?: V3 | V3[]) {
  const f = cross(sub(b, a), sub(c, a))
  if (len(f) < 1e-9) return
  const N = n === undefined ? undefined : Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3]
  const ref = N ? unit([N[0][0] + N[1][0] + N[2][0], N[0][1] + N[1][1] + N[2][1], N[0][2] + N[1][2] + N[2][2]]) : f
  if (dot(f, ref) >= 0) p.tri(a, b, c, undefined, undefined, undefined, N)
  else p.tri(a, c, b, undefined, undefined, undefined, N && [N[0], N[2], N[1]])
}
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n?: V3 | V3[]) {
  const N = n === undefined ? undefined : Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3, n as V3]
  tri(p, a, b, c, N && [N[0], N[1], N[2]])
  tri(p, a, c, d, N && [N[0], N[2], N[3]])
}

// --- Blocks with chamfered corners and a rolled top edge ---------------------
type Rect = { x0: number; x1: number; y0: number; y1: number }
function ring(r: Rect, d: number, z: number, c: number) {
  const x0 = r.x0 - d, x1 = r.x1 + d, y0 = r.y0 - d, y1 = r.y1 + d
  const k = Math.max(0.02, c + d * 0.414)
  const pts: V3[] = [[x0 + k, y0, z], [x1 - k, y0, z], [x1, y0 + k, z], [x1, y1 - k, z],
    [x1 - k, y1, z], [x0 + k, y1, z], [x0, y1 - k, z], [x0, y0 + k, z]]
  const nrm: V3[] = [[0, -1, 0], [0, -1, 0], [1, 0, 0], [1, 0, 0], [0, 1, 0], [0, 1, 0], [-1, 0, 0], [-1, 0, 0]]
  return { pts, nrm }
}
type XY = [number, number]
function band(p: Part, r: Rect, c: number, d0: number, z0: number, d1: number, z1: number, n0: XY, n1: XY) {
  const a = ring(r, d0, z0, c), b = ring(r, d1, z1, c)
  const at = (h: V3, n: XY): V3 => unit([h[0] * n[0], h[1] * n[0], n[1]])
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    quad(p, a.pts[i], a.pts[j], b.pts[j], b.pts[i], [at(a.nrm[i], n0), at(a.nrm[j], n0), at(a.nrm[j], n1), at(a.nrm[i], n1)])
  }
}
function lid(p: Part, r: Rect, d: number, z: number, c: number, up = true) {
  const { pts } = ring(r, d, z, c)
  const n: V3 = [0, 0, up ? 1 : -1]
  for (let i = 1; i < 7; i++) tri(p, pts[0], pts[i], pts[i + 1], n)
}
const OUT: XY = [1, 0], UP: XY = [0, 1], DOWN: XY = [0, -1]
function block(p: Part, r: Rect, z0: number, z1: number, o: { c?: number; bt?: number; top?: Part | null; bottom?: boolean } = {}) {
  const c = o.c ?? 0.4, bt = o.bt ?? 0.35
  band(p, r, c, 0, z0, 0, z1 - bt, OUT, OUT)
  if (bt) band(p, r, c, 0, z1 - bt, -bt, z1, OUT, UP)
  if (o.top !== null) lid(o.top ?? p, r, -bt, z1, c)
  if (o.bottom) lid(p, r, 0, z0, c, false)
}
/** A projecting cornice slab: rolled under-edge, face, rolled top. */
function cornice(p: Part, r: Rect, z0: number, z1: number, out: number, top: Part = p) {
  const c = 0.4
  band(p, r, c, 0, z0, out, z0 + out, DOWN, OUT)
  band(p, r, c, out, z0 + out, out, z1 - 0.2, OUT, OUT)
  band(p, r, c, out, z1 - 0.2, out - 0.2, z1, OUT, UP)
  lid(top, r, out - 0.2, z1, c)
}

// --- Polygons: walls and an ear-clipped roof ------------------------------------
const signedArea = (p: XY[]) => p.reduce((s, a, i) => s + a[0] * p[(i + 1) % p.length][1] - p[(i + 1) % p.length][0] * a[1], 0) / 2
const ccw = (p: XY[]) => (signedArea(p) < 0 ? [...p].reverse() : p)
function earClip(poly: XY[]): [XY, XY, XY][] {
  const p = ccw(poly), idx = p.map((_, i) => i), out: [XY, XY, XY][] = []
  const cr = (o: XY, a: XY, b: XY) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i - 1 + idx.length) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const A = p[ia], B = p[ib], C = p[ic]
      if (cr(A, B, C) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && cr(A, B, p[j]) >= -1e-9 && cr(B, C, p[j]) >= -1e-9 && cr(C, A, p[j]) >= -1e-9)) continue
      out.push([A, B, C]); idx.splice(i, 1); cut = true
      break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([p[idx[0]], p[idx[1]], p[idx[2]]])
  return out
}
/** Walls round a polygon from z0 to z1 and a flat roof; `fascia` paints the top `fh` metres of wall. */
function prism(walls: Part, top: Part, poly: XY[], z0: number, z1: number, fascia?: Part, fh = 0) {
  const p = ccw(poly)
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length]
    const n = unit([b[1] - a[1], -(b[0] - a[0]), 0])
    const zf = fascia ? z1 - fh : z1
    quad(walls, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], zf], [a[0], a[1], zf], n)
    if (fascia) quad(fascia, [a[0], a[1], zf], [b[0], b[1], zf], [b[0], b[1], z1], [a[0], a[1], z1], n)
  }
  for (const [A, B, C] of earClip(p)) tri(top, [A[0], A[1], z1], [B[0], B[1], z1], [C[0], C[1], z1], [0, 0, 1])
}

// --- Faces: flat panels laid on a wall -----------------------------------------------
type Face = { o: V3; u: V3; n: V3 }
/** The four walls of a rectangle, each running left to right as seen from outside. */
const faces = (r: Rect) => ({
  front: { o: [r.x1, r.y1, 0], u: [-1, 0, 0], n: [0, 1, 0] } as Face,
  back: { o: [r.x0, r.y0, 0], u: [1, 0, 0], n: [0, -1, 0] } as Face,
  east: { o: [r.x1, r.y0, 0], u: [0, 1, 0], n: [1, 0, 0] } as Face,
  west: { o: [r.x0, r.y1, 0], u: [0, -1, 0], n: [-1, 0, 0] } as Face,
})
const on = (f: Face, s: number, z: number, d = 0.04): V3 =>
  [f.o[0] + f.u[0] * s + f.n[0] * d, f.o[1] + f.u[1] * s + f.n[1] * d, z]
function panel(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d = 0.04) {
  quad(p, on(f, s0, z0, d), on(f, s1, z0, d), on(f, s1, z1, d), on(f, s0, z1, d), f.n)
}
/** A raised box on a face: front, top, bottom and two sides. */
function boss(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d0: number, d1: number) {
  const A = (s: number, z: number, d: number) => on(f, s, z, d)
  const u: V3 = f.u, nu: V3 = [-u[0], -u[1], -u[2]]
  quad(p, A(s0, z0, d1), A(s1, z0, d1), A(s1, z1, d1), A(s0, z1, d1), f.n)
  quad(p, A(s0, z1, d0), A(s0, z1, d1), A(s1, z1, d1), A(s1, z1, d0), [0, 0, 1])
  quad(p, A(s0, z0, d0), A(s1, z0, d0), A(s1, z0, d1), A(s0, z0, d1), [0, 0, -1])
  quad(p, A(s1, z0, d0), A(s1, z1, d0), A(s1, z1, d1), A(s1, z0, d1), u)
  quad(p, A(s0, z0, d0), A(s0, z0, d1), A(s0, z1, d1), A(s0, z1, d0), nu)
}
/** A vertical pipe standing off a face: an octagonal column with a rounded look. */
function pipe(p: Part, f: Face, s: number, z0: number, z1: number, r: number, off = 0.25) {
  const c = on(f, s, 0, r + off), seg = 8
  for (let k = 0; k < seg; k++) {
    const a = (k / seg) * 2 * Math.PI, b = ((k + 1) / seg) * 2 * Math.PI
    const na: V3 = [Math.cos(a), Math.sin(a), 0], nb: V3 = [Math.cos(b), Math.sin(b), 0]
    const pa = (z: number): V3 => [c[0] + r * na[0], c[1] + r * na[1], z], pb = (z: number): V3 => [c[0] + r * nb[0], c[1] + r * nb[1], z]
    quad(p, pa(z0), pb(z0), pb(z1), pa(z1), [na, nb, nb, na])
  }
}
/** A round turret: an n-gon drum, smooth-shaded. */
function drum(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, seg = 12) {
  for (let k = 0; k < seg; k++) {
    const a = (k / seg) * 2 * Math.PI, b = ((k + 1) / seg) * 2 * Math.PI
    const na: V3 = [Math.cos(a), Math.sin(a), 0], nb: V3 = [Math.cos(b), Math.sin(b), 0]
    quad(p, [cx + r * na[0], cy + r * na[1], z0], [cx + r * nb[0], cy + r * nb[1], z0], [cx + r * nb[0], cy + r * nb[1], z1], [cx + r * na[0], cy + r * na[1], z1], [na, nb, nb, na])
  }
}
/** A dome (or, with `flat`, a shallow dish) over a circle, smooth-shaded. */
function dome(p: Part, cx: number, cy: number, r: number, z0: number, h: number, seg = 12, rings = 4, under = false) {
  const P = (i: number, k: number): V3 => {
    const t = (i / rings) * (Math.PI / 2), a = (k / seg) * 2 * Math.PI
    return [cx + r * Math.cos(t) * Math.cos(a), cy + r * Math.cos(t) * Math.sin(a), z0 + h * Math.sin(t)]
  }
  const N = (i: number, k: number): V3 => {
    const t = (i / rings) * (Math.PI / 2), a = (k / seg) * 2 * Math.PI
    return unit([Math.cos(t) * Math.cos(a) / r, Math.cos(t) * Math.sin(a) / r, Math.sin(t) / h])
  }
  for (let i = 0; i < rings; i++) for (let k = 0; k < seg; k++)
    quad(p, P(i, k), P(i, k + 1), P(i + 1, k + 1), P(i + 1, k), [N(i, k), N(i, k + 1), N(i + 1, k + 1), N(i + 1, k)])
  if (under) for (let k = 1; k < seg - 1; k++) tri(p, P(0, 0), P(0, k + 1), P(0, k), [0, 0, -1])
}
/** A slim spire: a square pyramid on a short shaft, gold. */
function spike(p: Part, cx: number, cy: number, z0: number, h: number, w = 0.45) {
  const q: V3[] = [[cx - w, cy - w, z0], [cx + w, cy - w, z0], [cx + w, cy + w, z0], [cx - w, cy + w, z0]]
  const top: V3 = [cx, cy, z0 + h]
  for (let i = 0; i < 4; i++) tri(p, q[i], q[(i + 1) % 4], top, unit(cross(sub(q[(i + 1) % 4], q[i]), sub(top, q[i]))))
}
/** A row of pointed pickets along a line, as on the parapets: triangular teeth, front and back. */
function pickets(p: Part, a: XY, b: XY, z: number, h: number, pitch: number, t = 0.3) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / pitch))
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: V3 = [u[1], -u[0], 0]
  for (let i = 0; i < n; i++) {
    const s0 = (i / n) * L, s1 = ((i + 1) / n) * L, sm = (s0 + s1) / 2
    for (const side of [-1, 1]) {
      const P = (s: number, zz: number): V3 => [a[0] + u[0] * s + nn[0] * side * t / 2, a[1] + u[1] * s + nn[1] * side * t / 2, zz]
      tri(p, P(s0 + 0.15, z), P(s1 - 0.15, z), P(sm, z + h), [nn[0] * side, nn[1] * side, 0])
    }
  }
}

// ---------------------------------------------------------------------------------------
// Plan (model frame; see header).

const T: Rect = { x0: -17.4, x1: 14.2, y0: -22.5, y1: -8.4 }   // the tower
const ROOF = 52                                                // the tower's main roof
// The block in front of the tower, about 28 m, and the 18 m front wing.
const MID: XY[] = [[-17.6, -8.4], [14.1, -8.4], [14.1, 1.6], [7.5, 1.7], [7.5, 6.9], [-17.6, 7.2]]
const MID_H = 24
const WING: XY[] = [[14.1, 1.6], [14.0, 9.5], [8.9, 9.6], [9.0, 23.4], [5.2, 23.4], [5.2, 21.6], [-2.6, 21.6],
  [-7.2, 21.3], [-7.2, 17.1], [-3.5, 17.0], [-3.7, 8.7], [-17.5, 9.0], [-17.6, 7.2], [7.5, 6.9], [7.5, 1.7]]
const WING_H = 13   // OSM says 18 for the whole hotel mass; the photos show the entrance pavilion's dark roof at about 13 m
// The whole outline, way/313039853: the entrance pavilion, queue and the
// show building behind, all about 10 m under dark roofs.
const OUTLINE: XY[] = [[-16.9, 11.6], [-14.8, 11.6], [-14.7, 19.9], [-10.8, 19.8], [-10.7, 22.6], [-2.4, 22.4], [-2.4, 21.7],
  [5.2, 21.6], [5.2, 23.4], [9.0, 23.4], [8.9, 16.9], [8.9, 9.6], [10.6, 9.5], [14.0, 9.5], [15.6, 9.5], [23.0, 9.6], [22.9, 12.1],
  [28.4, 12.2], [28.5, 5.9], [24.9, 5.8], [25.0, 1.0], [25.0, -0.7], [24.6, -13.0], [20.6, -12.9], [20.2, -27.0], [15.6, -26.8],
  [15.7, -25.3], [11.3, -25.2], [11.3, -26.6], [11.2, -32.0], [-12.0, -31.5], [-11.9, -22.5], [-13.7, -22.4], [-17.2, -22.5],
  [-17.2, -16.7], [-23.2, -16.6], [-23.1, -5.8], [-21.7, -5.8], [-21.6, -3.6], [-21.3, -3.6], [-21.3, -0.3], [-17.6, -0.4],
  [-17.6, 3.5], [-17.6, 7.2], [-19.8, 7.2], [-19.8, 11.6]]
const BASE_H = 10

// --- Low base, wing and front block -----------------------------------------------------
prism(sand, steel, OUTLINE, 0, BASE_H, steel, 2.2)
prism(sand, steel, WING, 0, WING_H, steel, 2.6)
prism(sand, steel, MID, 0, MID_H, gold, 1.0)
// Gold picket parapets along the front block's exposed edges and the wing's front.
pickets(gold, [-17.6, 7.2], [7.5, 6.9], MID_H, 1.6, 1.2)
pickets(gold, [-17.6, -8.4], [-17.6, 7.2], MID_H, 1.6, 1.2)
pickets(gold, [14.1, -8.4], [14.1, 1.6], MID_H, 1.6, 1.2)

// --- The tower -------------------------------------------------------------------------------
block(gold, T, 0, ROOF, { c: 0.5, bt: 0, top: steel })
// The crown steps up at the back: the back half to 54.2 m (way/237074610),
// the south-west block to 55.3 m (way/237074302), under the round turret.
block(gold, { x0: -13.8, x1: 14.2, y0: -22.5, y1: -14.4 }, ROOF, 54.2, { c: 0.3, bt: 0.3, top: steel })
block(gold, { x0: -13.8, x1: -6.5, y0: -22.5, y1: -14.4 }, ROOF, 55.3, { c: 0.3, bt: 0.3, top: steel })
drum(copper, -9.8, -18.4, 2.6, 55.3, 55.8)
dome(gold, -9.8, -18.4, 2.6, 55.8, 1.0, 10, 2)
// The overhanging boxes at each end of the crown, corbelled out past the
// tower's ends, as in the photos of both ends.
for (const [x0, x1] of [[10.6, 15.7], [-18.9, -13.8]] as [number, number][]) {
  const R: Rect = { x0, x1, y0: T.y0 - 0.6, y1: T.y1 + 0.6 }
  band(gold, R, 0.3, -1.0, 40, 0, 42, DOWN, OUT)
  block(gold, R, 42, 53, { c: 0.3, bt: 0.3, top: steel })
  // Its ends: a copper field with stacked balcony bays.
  const F = faces(R)
  const E = x0 > 0 ? F.east : F.west
  panel(copper, E, 1.2, 14.1, 43, 52, 0.04)
  for (const z of [44, 47, 50]) panel(win, E, 2.2, 13.1, z, z + 1.6, 0.08)
}
// Gold crown pickets and spires.
pickets(gold, [-13.8, T.y1], [10.6, T.y1], ROOF, 2.4, 1.5)
pickets(gold, [-13.8, -14.4], [14.2, -14.4], 54.2, 1.2, 1.4)
for (const [x, y, h] of [[-4.5, -9.4, 4.6], [-1.0, -9.4, 3.2], [2.0, -9.4, 4.0], [5.0, -9.4, 3.0], [7.5, -9.4, 4.4], [-11.5, -9.6, 3.4], [12.5, -9.6, 3.4], [-16.2, -9.6, 2.6], [-9.8, -18.4, 1.6]] as [number, number, number][])
  spike(gold, x, y, x === -9.8 ? 56.8 : ROOF, h)

// Tower faces above the front block: copper fields in gold frames, the
// Collector's triangle, the dark slot, balcony bays and blue pipes.
{
  const F = faces(T)
  const front = F.front  // s runs from x = 14.2 (left, seen from the front) to -17.4
  const sOf = (x: number) => 14.2 - x
  // Copper fields between gold pilasters, left of the slot and right of it.
  panel(copper, front, sOf(10.3), sOf(-5.6), MID_H + 1.5, ROOF - 1.2)
  panel(copper, front, sOf(13.7), sOf(11.2), 33, 46)
  panel(copper, front, sOf(-9.4), sOf(-13.6), MID_H + 1.5, ROOF - 4.5)
  // The dark slot, full height above the front block.
  boss(steel, front, sOf(-5.8), sOf(-9.2), MID_H + 0.5, ROOF - 0.3, -0.6, 0.02)
  // Balcony bays: dark window recesses with gold sills.
  for (const z of [32, 37]) {
    panel(win, front, sOf(9.5), sOf(3.5), z, z + 2.2, 0.08)
    panel(win, front, sOf(1.5), sOf(-5), z, z + 2.2, 0.08)
    panel(win, front, sOf(-10), sOf(-13), z, z + 2.2, 0.08)
    boss(gold, front, sOf(9.8), sOf(-5.3), z - 0.4, z, 0.04, 0.9)
  }
  // The Collector's emblem: a gold triangle on a gold-framed copper field,
  // with a copper diamond in it.
  {
    const cx = sOf(1.2), z0 = 42.5, w = 2.6, h = 4.8
    tri(gold, on(front, cx - w, z0, 0.1), on(front, cx + w, z0, 0.1), on(front, cx, z0 + h, 0.1), front.n)
    const zc = z0 + 1.7
    quad(copper, on(front, cx, zc - 1.0, 0.14), on(front, cx + 0.8, zc, 0.14), on(front, cx, zc + 1.0, 0.14), on(front, cx - 0.8, zc, 0.14), front.n)
  }
  // Gold pilasters framing the fields.
  for (const x of [10.6, -4.9, -14.4]) boss(gold, front, sOf(x + 0.45), sOf(x - 0.45), MID_H, ROOF + 0.5, 0, 0.5)
  // Blue pipes: one down the left of the front into the front block's roof,
  // one right of the slot, and one down each end.
  pipe(blue, front, sOf(11.9), MID_H, ROOF - 1, 0.55)
  pipe(blue, front, sOf(-10.6), MID_H + 2, ROOF - 6, 0.45)
  pipe(blue, F.east, 3.5, BASE_H, 42, 0.55)
  pipe(blue, F.west, 10.5, MID_H, 42, 0.5)

  // The ends of the tower: stacked balconies under the overhanging boxes.
  for (const E of [F.east, F.west]) {
    panel(copper, E, 1.5, 12.6, MID_H + 1, 39)
    for (let z = 20; z < 39; z += 3.6) {
      if (E === F.west && z < MID_H) continue
      panel(win, E, 2.4, 11.7, z, z + 1.8, 0.08)
      boss(gold, E, 2.0, 12.1, z - 0.4, z, 0.04, 1.0)
    }
  }
  // The back: copper fields with window bays, a plainer echo of the front.
  const B = F.back // s runs from x = -17.4 to 14.2
  panel(copper, B, 3, 28.6, BASE_H + 4, ROOF - 3)
  for (let z = 16; z < ROOF - 4; z += 8) for (const [s0, s1] of [[5, 10], [14, 18], [22, 27]]) panel(win, B, s0, s1, z, z + 2.4, 0.08)
  for (const s of [2.2, 12, 20, 29.4]) boss(gold, B, s - 0.45, s + 0.45, BASE_H, ROOF + 0.5, 0, 0.5)
}

// --- Front block and wing facades ---------------------------------------------------------------
{
  // Front block: tall window slots in gold frames on its front (y = 7), and
  // on its two ends.
  const M: Rect = { x0: -17.6, x1: 7.5, y0: -8.4, y1: 7.05 }
  const F = faces(M).front, sOf = (x: number) => 7.5 - x
  for (const x of [4.5, 0.5, -3.5, -12.5, -16]) {
    boss(gold, F, sOf(x + 0.9), sOf(x - 0.9), WING_H, MID_H - 1.5, 0, 0.3)
    panel(win, F, sOf(x + 0.5), sOf(x - 0.5), WING_H + 1.5, MID_H - 3, 0.34)
  }
  // The copper strip of the Collector's machinery across the block's middle.
  panel(copper, F, sOf(-5.5), sOf(-11), WING_H, MID_H - 1.2, 0.04)
  const W = faces({ x0: -17.6, x1: 14.1, y0: -8.4, y1: 7.2 }).west
  for (const s of [3, 7, 11]) panel(win, W, s, s + 2, BASE_H + 2, MID_H - 3)
  const E = faces({ x0: -17.6, x1: 14.1, y0: -8.4, y1: 1.6 }).east
  for (const s of [2, 6]) panel(win, E, s, s + 2, WING_H + 1, MID_H - 3)
  // Front wing: window slots on its front faces.
  const WF = faces({ x0: 5.2, x1: 9.0, y0: 9.6, y1: 23.4 }).front
  panel(win, WF, 1.0, 2.8, BASE_H + 1.5, WING_H - 2)
  const WF2 = faces({ x0: -2.6, x1: 5.2, y0: 9, y1: 21.6 }).front
  for (const s of [1.2, 4.2, 6.2]) panel(win, WF2, s, s + 1.2, BASE_H + 1.5, WING_H - 2)
}

// --- Front turrets ---------------------------------------------------------------------------------
// The domed turret with the gold dish, in front of the tower's right half.
// OSM maps a small round turret, way/123423747, further forward; the photos
// put this one against the front block, so it is placed from them.
{
  const R: Rect = { x0: -12.6, x1: -5.4, y0: 2.5, y1: 10 }
  block(sand, R, 0, 28, { c: 0.4, bt: 0, top: null })
  cornice(gold, R, 27.4, 28.4, 0.3)
  const F = faces(R).front
  panel(copper, F, 0.6, 6.6, WING_H, 20, 0.04)
  panel(win, F, 2.9, 4.3, 15, 26, 0.08)
  dome(sand, -9.0, 6.2, 3.0, 28.4, 2.4, 12, 3)
  drum(gold, -9.0, 6.2, 0.35, 30.6, 31.4, 6)
  dome(gold, -9.0, 6.2, 3.6, 32.1, -0.8, 12, 2, true)   // the dish, opening upward
  drum(gold, -9.0, 6.2, 3.6, 31.8, 32.1, 12)
}
// way/123423749: the small blue dome by the tower's front corner.
drum(sand, 11.0, 6.2, 2.5, WING_H, MID_H + 1.5, 12)
dome(blue, 11.0, 6.2, 2.5, MID_H + 1.5, 2.6, 12, 3)

// --- Entrance: the Collector's gate, a dark opening in the front wing ----------------------------
panel(win, faces({ x0: -2.6, x1: 5.2, y0: 9, y1: 21.65 }).front, 2.3, 5.6, 0, 4.5, 0.05)

// ---------------------------------------------------------------------------------------------------
// Colours from the daylight photos, muted to the palette: the fortress's
// industrial gold frames and copper-red fields, the tan-pink walls below,
// the grey of its slot and roofs, the blue pipes and dome.
const parts = [
  { part: gold, material: finish('gotg-gold', 0xd2b585) },
  { part: copper, material: finish('gotg-copper', 0xc4826c) },
  { part: sand, material: finish('gotg-sand', 0xe3c8ae) },
  { part: steel, material: finish('gotg-steel', 0x6e737c) },
  { part: blue, material: finish('gotg-blue', 0x5b7db4) },
  { part: win, material: PALETTE.window },
]
const triangles = parts.reduce((sum, { part }) => sum + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name}: ${part.triangles}`).join('\n'))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Guardians of the Galaxy – Mission: Breakout!', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 318, elevation: 0, height: 58.4,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
await Bun.write(new URL('../models/dlr-guardians-mission-breakout.glb', import.meta.url), glb)
console.log(`dlr-guardians-mission-breakout.glb: ${triangles} triangles, ${glb.length} bytes`)
