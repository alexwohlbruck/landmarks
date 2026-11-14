/**
 * Karlstor, Karlsplatz (Stachus), Munich: the western gate of the second
 * town wall, first built c. 1302 as the Neuhauser Tor; the middle tower
 * was blown up in 1857 (powder explosion) and Arnold Zenetti rebuilt what
 * was left in 1861-62 in neo-Gothic form: one great pointed arch between
 * the two flanking towers, a small pointed pedestrian arch through each
 * tower, all crenellated. Original procedural geometry, CC0-1.0.
 * bun generators/munich-karlstor.ts
 *
 * Map frame of this model: x across the gate (the passage direction, +x
 * east-south-east to Neuhauser Straße, -x the Stachus side), y along the
 * gate (+y north-north-east), z up, metres; origin at the anchor on the
 * ground. Catalog bearing 23.2: the gate's long sides in OSM run at
 * 23.1-23.3 degrees. Anchor = area centroid of way/52103816, 48.139010,
 * 11.566763. The gate is symmetric about y = 0 and about x = 0.
 *
 * Identity, in order: two square crenellated towers with five merlons a
 * face and red tile roofs showing between them; the lower crenellated
 * centre between them with the big pointed arch rising almost to its
 * parapet; a small pointed passage through each tower under a square label
 * moulding; the pale grey-white render; the inscription plaques and the
 * two round coats of arms in the arch's spandrels.
 *
 * Evidence:
 *  - plan: OSM outline way/52103816, read in the turned frame: a clean
 *    rectangle x -2.6..3.0, y -11.7..11.9 (5.6 x 23.6 m); the parts inside
 *    it give the towers (roof parts 379998304/305, y 5.0..11.1 and
 *    -10.9..-4.8 inside the merlon ring) and the centre (380096805, y
 *    -4.1..4.3). Drawn: towers 7.6 m wide (|y| 4.2..11.8), centre 8.4 m.
 *  - heights: OSM parts give tower merlons 16.5, crenels 15, roof 17;
 *    centre merlons 12.5, crenels 11, roof ridge 13. Measured on Jensens'
 *    near-frontal photo (scaled from the 23.6 m OSM width, 0.0257 m/px):
 *    tower merlon tops 17.2, crenel sills 15.6 (drawn 17.0 / 15.5); tower
 *    string course 13.5; centre merlon tops 12.9, sill 11.6 (drawn 12.8 /
 *    11.5); the big arch springs at 4.6 m (the corbels) and peaks at 10.0
 *    m, 7.5 m wide: a pointed arch of radius 1.54 half-spans; the side
 *    arches 4.0 m wide, springing 3.6, apex 5.9 (drawn springing 3.3, apex
 *    6.1, so they read as pointed as in the photos); the label moulding at 7.0
 *    m dropping to 5.9; plaques 7.6-9.1 m; medallions centred 10.0 m,
 *    +-3.2 m off the axis, ~1.3 m across; the paired slit windows 14.0 m,
 *    the arched niches 12.6 m.
 *  - colours from the daylight photos: the warm cream-sand render (about
 *    #e3cfa3 in the sunlit photos, pulled to the palette), lighter mouldings, red-brown tile roofs, the painted arms (gold and
 *    blue-white, drawn as one gold).
 *  - night: no licensed night photo was found; the gate is floodlit in
 *    reality, drawn so (estimated).
 *  - elevation 0: flat pedestrian zone. No lidar in Germany; no Bavarian 3D
 *    city model used.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Karlstor_night.jpg (Jensens, public domain; a late-afternoon photo
 *    despite the name): west face, near frontal; the main measuring photo.
 *  - Munich,_the_Karlstor.JPG (Dguendel, CC BY 4.0): west face.
 *  - Karlstor_Munich.jpg (Rob Faulkner, CC BY 2.0): west face, low.
 *  - Karlstor_2021-06-27.jpg (Strubbl, CC0): east face from Neuhauser Str.
 *  - 20180113_Karlstor.jpg (Flocci Nivis, CC BY 4.0): east face.
 *  - Karlsplatz_Karlstor_Stachus_München.jpg (böhringer friedrich, CC BY-SA
 *    2.5): from Stachus, the gate between the Rondell buildings.
 * No commercial imagery, no 3D city models. No look-only sources.
 *
 * Left out: the corbels under the big arch, the round loopholes, the
 * mosaic medallions of the east face (drawn as the same flat discs), the
 * tracery in the spandrels, the plaques' lettering.
 *
 * Doubts: the towers' outer faces (y = +-11.8) are hidden by the Rondell
 * buildings and not photographed; drawn plain. The roofs inside the
 * parapets are seen only between the merlons; their pitch is estimated.
 * The brief called the flanking towers round with caps; every photo shows
 * square towers with crenellations and low tiled roofs, drawn as photographed.
 *
 * This file also holds the kit shared by this builder's other munich-
 * generators (isartor, siegestor, friedensengel, bavaria); merge it first.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { triangulate, type XY } from './chi-aon-center'

// ===========================================================================
// Kit

export type { XY }
export const TAU = Math.PI * 2
export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
export const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
export const len = (a: V3) => Math.hypot(a[0], a[1], a[2])
export const unit = (a: V3): V3 => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
export const smooth = (t: number) => { const c = clamp(t, 0, 1); return c * c * (3 - 2 * c) }
export const v3 = (xy: XY, z: number): V3 => [xy[0], xy[1], z]

/** A triangle wound so it faces n. */
export function triN(p: Part, a: V3, b: V3, c: V3, n: V3) {
  if (dot(cross(sub(b, a), sub(c, a)), n) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
/** A flat quad wound so it faces n. */
export function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  triN(p, a, b, c, n)
  triN(p, a, c, d, n)
}
/** A smooth quad: corner normals given, wound to agree with them. */
export function quadS(p: Part, P: V3[], N: V3[]) {
  p.tri(P[0], P[1], P[2], undefined, undefined, undefined, [N[0], N[1], N[2]])
  p.tri(P[0], P[2], P[3], undefined, undefined, undefined, [N[0], N[2], N[3]])
}

export const ringArea = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
export const ccw = (r: XY[]): XY[] => (ringArea(r) < 0 ? [...r].reverse() : r)
export const ngon = (cx: number, cy: number, r: number, n: number, a0 = 0): XY[] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos(a0 + (i * TAU) / n), cy + r * Math.sin(a0 + (i * TAU) / n)] as XY)
export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
/** Offset a counter-clockwise ring outward by d (negative: inward), mitred. */
export function offset(r: XY[], d: number): XY[] {
  const n = r.length
  return r.map((p, i) => {
    const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]
    const e1 = unit([p[0] - a[0], p[1] - a[1], 0]), e2 = unit([b[0] - p[0], b[1] - p[1], 0])
    const n1: XY = [e1[1], -e1[0]], n2: XY = [e2[1], -e2[0]]
    const m: XY = [n1[0] + n2[0], n1[1] + n2[1]]
    const k = d / (1 + n1[0] * n2[0] + n1[1] * n2[1])
    return [p[0] + m[0] * k, p[1] + m[1] * k] as XY
  })
}

/** Vertical walls of a ring between two heights, each face flat, facing out. */
export function walls(p: Part, r: XY[], z0: number, z1: number, r1: XY[] = r) {
  const R = ccw(r) === r ? [r, r1] : [[...r].reverse(), [...r1].reverse()]
  const [a0, a1] = R
  for (let i = 0; i < a0.length; i++) {
    const j = (i + 1) % a0.length
    const A = v3(a0[i], z0), B = v3(a0[j], z0), C = v3(a1[j], z1), D = v3(a1[i], z1)
    const out: V3 = [B[1] - A[1], A[0] - B[0], 0]
    quadN(p, A, B, C, D, len(out) > 1e-9 ? out : [D[1] - C[1], C[0] - D[0], 0])
  }
}
/** A flat horizontal cap over a ring (any simple ring), up or down. */
export function cap(p: Part, r: XY[], z: number, up = true) {
  const R = ccw(r)
  for (const [a, b, c] of triangulate(R)) triN(p, v3(R[a], z), v3(R[b], z), v3(R[c], z), [0, 0, up ? 1 : -1])
}
/** A prism over a ring. */
export function prism(p: Part, r: XY[], z0: number, z1: number, top: Part | null = p, bottom = false) {
  walls(p, r, z0, z1)
  if (top) cap(top, r, z1, true)
  if (bottom) cap(p, r, z0, false)
}
/** A prism whose top edge is chamfered by b (the top ring inset by b). */
export function bevelPrism(p: Part, r: XY[], z0: number, z1: number, b = 0.25, top: Part | null = p) {
  const ins = offset(ccw(r), -b)
  walls(p, ccw(r), z0, z1 - b)
  walls(p, ccw(r), z1 - b, z1, ins)
  if (top) cap(top, ins, z1, true)
}
/** A box about (cx, cy) turned by ang, half sizes hx, hy, with chamfered vertical edges (c) and top edge (b). */
export function boxAt(p: Part, cx: number, cy: number, hx: number, hy: number, z0: number, z1: number, ang = 0, c = 0, b = 0, top: Part | null = p) {
  let r: XY[] = c > 0
    ? [[-hx + c, -hy], [hx - c, -hy], [hx, -hy + c], [hx, hy - c], [hx - c, hy], [-hx + c, hy], [-hx, hy - c], [-hx, -hy + c]]
    : rect(-hx, -hy, hx, hy)
  const ca = Math.cos(ang), sa = Math.sin(ang)
  r = r.map(([x, y]) => [cx + x * ca - y * sa, cy + x * sa + y * ca] as XY)
  if (b > 0) bevelPrism(p, r, z0, z1, b, top)
  else prism(p, r, z0, z1, top)
}
/** A pyramid (or hipped tent) from a ring at z0 to an apex. */
export function pyramid(p: Part, r: XY[], z0: number, apex: V3) {
  const R = ccw(r)
  for (let i = 0; i < R.length; i++) {
    const a = v3(R[i], z0), b = v3(R[(i + 1) % R.length], z0)
    const n = cross(sub(b, a), sub(apex, a))
    triN(p, a, b, apex, n[2] >= 0 ? n : mul(n, -1))
  }
}
/** A hipped roof over an axis-aligned rectangle, ridge along the longer side; overhang o. */
export function hipRoof(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, o = 0.3, ridgeK = 1) {
  x0 -= o; y0 -= o; x1 += o; y1 += o
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, hx = (x1 - x0) / 2, hy = (y1 - y0) / 2
  const along = hx >= hy
  const rh = Math.max(0, (along ? hx - hy : hy - hx)) * ridgeK
  const A: V3 = along ? [cx - rh, cy, z1] : [cx, cy - rh, z1], B: V3 = along ? [cx + rh, cy, z1] : [cx, cy + rh, z1]
  const c00: V3 = [x0, y0, z0], c10: V3 = [x1, y0, z0], c11: V3 = [x1, y1, z0], c01: V3 = [x0, y1, z0]
  const up = (a: V3, b: V3, c: V3) => { const n = cross(sub(b, a), sub(c, a)); return n[2] >= 0 ? n : mul(n, -1) }
  if (along) {
    quadN(p, c00, c10, B, A, up(c00, c10, B))
    quadN(p, c11, c01, A, B, up(c11, c01, A))
    triN(p, c10, c11, B, up(c10, c11, B))
    triN(p, c01, c00, A, up(c01, c00, A))
  } else {
    quadN(p, c10, c11, B, A, up(c10, c11, B))
    quadN(p, c01, c00, A, B, up(c01, c00, A))
    triN(p, c00, c10, A, up(c00, c10, A))
    triN(p, c11, c01, B, up(c11, c01, B))
  }
  cap(p, rect(x0, y0, x1, y1), z0, false)
}

// --- walls pierced by real arches -------------------------------------------

/** An arch opening on a wall: centre c along the wall, half width hw, springing zs, k = radius in half-spans (1 round, 2 equilateral pointed), from floor z0. */
export type Opening = { c: number; hw: number; zs: number; k?: number; z0?: number }
/** The arch's apex height. */
export const apex = (o: Opening) => o.zs + o.hw * Math.sqrt(2 * (o.k ?? 1) - 1)
/** Points [s, z] along the arch from the left springer to the right, and the in-plane normal pointing into the opening. */
export function archCurve(o: Opening, seg = 10): { s: number; z: number; ns: number; nz: number }[] {
  const k = o.k ?? 1, r = k * o.hw
  const out: { s: number; z: number; ns: number; nz: number }[] = []
  if (k <= 1.0001) {
    for (let i = 0; i <= seg; i++) {
      const t = Math.PI - (i / seg) * Math.PI
      out.push({ s: o.c + o.hw * Math.cos(t), z: o.zs + o.hw * Math.sin(t), ns: -Math.cos(t), nz: -Math.sin(t) })
    }
    return out
  }
  // Two arcs of radius r centred on the opposite side's springing line.
  const half = Math.ceil(seg / 2)
  const tTop = Math.acos((o.hw - r) / r) // the apex angle on the left arc
  const cx = o.c - o.hw + r // the left arc's centre
  for (let i = 0; i <= half; i++) {
    const t = Math.PI - (i / half) * (Math.PI - tTop)
    out.push({ s: cx + r * Math.cos(t), z: o.zs + r * Math.sin(t), ns: -Math.cos(t), nz: -Math.sin(t) })
  }
  for (let i = half - 1; i >= 0; i--) {
    const q = out[i]
    out.push({ s: 2 * o.c - q.s, z: q.z, ns: -q.ns, nz: q.nz })
  }
  return out
}

/**
 * A wall face in the plane through origin o along unit u, facing n (both
 * horizontal), from s0 to s1 along u and z0 to z1, pierced by openings.
 * `d` shifts it along n.
 */
export function piercedFace(p: Part, o: V3, u: V3, n: V3, s0: number, s1: number, z0: number, z1: number, ops: Opening[], d = 0, seg = 10) {
  const P = (s: number, z: number): V3 => add(add(add(o, mul(u, s)), mul(n, d)), [0, 0, z])
  const sorted = [...ops].sort((a, b) => a.c - b.c)
  let s = s0
  const rectF = (a: number, b: number, za: number, zb: number) => { if (b - a > 1e-6 && zb - za > 1e-6) quadN(p, P(a, za), P(b, za), P(b, zb), P(a, zb), n) }
  for (const op of sorted) {
    const f = op.z0 ?? z0
    rectF(s, op.c - op.hw, z0, z1)
    if (f > z0) rectF(op.c - op.hw, op.c + op.hw, z0, f)
    const cv = archCurve(op, seg)
    for (let i = 0; i < cv.length - 1; i++) {
      const a = cv[i], b = cv[i + 1]
      if (Math.abs(b.s - a.s) < 1e-6) continue
      quadN(p, P(a.s, a.z), P(b.s, b.z), P(b.s, z1), P(a.s, z1), n)
    }
    s = op.c + op.hw
  }
  rectF(s, s1, z0, z1)
}
/** The inner surfaces of openings (jambs and soffit) between offsets d0 and d1 along n. */
export function tunnel(p: Part, o: V3, u: V3, n: V3, d0: number, d1: number, ops: Opening[], z0: number, seg = 10, smoothSoffit = true) {
  const P = (s: number, z: number, d: number): V3 => add(add(add(o, mul(u, s)), mul(n, d)), [0, 0, z])
  for (const op of ops) {
    const f = op.z0 ?? z0
    quadN(p, P(op.c - op.hw, f, d0), P(op.c - op.hw, f, d1), P(op.c - op.hw, op.zs, d1), P(op.c - op.hw, op.zs, d0), u)
    quadN(p, P(op.c + op.hw, f, d0), P(op.c + op.hw, f, d1), P(op.c + op.hw, op.zs, d1), P(op.c + op.hw, op.zs, d0), mul(u, -1))
    const cv = archCurve(op, seg)
    for (let i = 0; i < cv.length - 1; i++) {
      const a = cv[i], b = cv[i + 1]
      const na = add(mul(u, a.ns), [0, 0, a.nz]), nb = add(mul(u, b.ns), [0, 0, b.nz])
      const Q = [P(a.s, a.z, d0), P(b.s, b.z, d0), P(b.s, b.z, d1), P(a.s, a.z, d1)]
      if (smoothSoffit) quadS(p, Q, [na, nb, nb, na])
      else quadN(p, Q[0], Q[1], Q[2], Q[3], unit(add(na, nb)))
    }
  }
}
/**
 * A straight wall of thickness t centred on the line from o along u (n is
 * the side the "front" faces), length L, z0..z1, pierced right through by
 * the openings. Ends and top optional.
 */
export function archWall(p: Part, o: V3, u: V3, n: V3, L: number, t: number, z0: number, z1: number, ops: Opening[], o2: { ends?: boolean; top?: Part | null; seg?: number } = {}) {
  const seg = o2.seg ?? 10
  piercedFace(p, o, u, n, 0, L, z0, z1, ops, t / 2, seg)
  piercedFace(p, o, u, mul(n, -1), 0, L, z0, z1, ops, -t / 2, seg)
  tunnel(p, o, u, n, t / 2, -t / 2, ops, z0, seg)
  const P = (s: number, z: number, d: number): V3 => add(add(add(o, mul(u, s)), mul(n, d)), [0, 0, z])
  if (o2.ends !== false) {
    quadN(p, P(0, z0, -t / 2), P(0, z0, t / 2), P(0, z1, t / 2), P(0, z1, -t / 2), mul(u, -1))
    quadN(p, P(L, z0, -t / 2), P(L, z0, t / 2), P(L, z1, t / 2), P(L, z1, -t / 2), u)
  }
  const top = o2.top === undefined ? p : o2.top
  if (top) quadN(top, P(0, z1, -t / 2), P(L, z1, -t / 2), P(L, z1, t / 2), P(0, z1, t / 2), [0, 0, 1])
}
/** A raised moulding following an arch on a face: band width w outside the opening edge, standing out by `out`. */
export function archBand(p: Part, o: V3, u: V3, n: V3, op: Opening, w: number, out: number, d = 0, seg = 10, inner = 0) {
  const P = (s: number, z: number, dd: number): V3 => add(add(add(o, mul(u, s)), mul(n, d + dd)), [0, 0, z])
  const cv = archCurve(op, seg)
  const ring = (k: number) => cv.map((c) => ({ s: c.s - c.ns * k, z: c.z - c.nz * k }))
  const ins = ring(-inner), outs = ring(w)
  for (let i = 0; i < cv.length - 1; i++) {
    const a0 = ins[i], a1 = ins[i + 1], b0 = outs[i], b1 = outs[i + 1]
    quadN(p, P(a0.s, a0.z, out), P(a1.s, a1.z, out), P(b1.s, b1.z, out), P(b0.s, b0.z, out), n)
    const nIn = mul(add(mul(u, cv[i].ns + cv[i + 1].ns), [0, 0, cv[i].nz + cv[i + 1].nz]), 1)
    quadN(p, P(a0.s, a0.z, 0), P(a1.s, a1.z, 0), P(a1.s, a1.z, out), P(a0.s, a0.z, out), nIn)
    quadN(p, P(b0.s, b0.z, 0), P(b1.s, b1.z, 0), P(b1.s, b1.z, out), P(b0.s, b0.z, out), mul(nIn, -1))
  }
  // ends at the springers
  for (const [i, sg] of [[0, -1], [cv.length - 1, 1]] as [number, number][]) {
    const a = ins[i], b = outs[i]
    quadN(p, P(a.s, a.z, 0), P(b.s, b.z, 0), P(b.s, b.z, out), P(a.s, a.z, out), [0, 0, -1])
    void sg
  }
}
/** A flat panel (window, plaque) on a face: s0..s1, z0..z1, standing `out` proud. With `arch`, a round head. */
export function panelOn(p: Part, o: V3, u: V3, n: V3, s0: number, s1: number, z0: number, z1: number, out = 0.05, d = 0, roundTop = false, seg = 6) {
  const P = (s: number, z: number): V3 => add(add(add(o, mul(u, s)), mul(n, d + out)), [0, 0, z])
  quadN(p, P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1), n)
  if (roundTop) {
    const c = (s0 + s1) / 2, r = (s1 - s0) / 2
    for (let i = 0; i < seg; i++) {
      const a = (i / seg) * Math.PI, b = ((i + 1) / seg) * Math.PI
      triN(p, P(c, z1), P(c + r * Math.cos(a), z1 + r * Math.sin(a)), P(c + r * Math.cos(b), z1 + r * Math.sin(b)), n)
    }
  }
}
/** A disc on a face. */
export function discOn(p: Part, o: V3, u: V3, n: V3, s: number, z: number, r: number, out = 0.06, d = 0, seg = 12) {
  const P = (ss: number, zz: number): V3 => add(add(add(o, mul(u, ss)), mul(n, d + out)), [0, 0, zz])
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * TAU, b = ((i + 1) / seg) * TAU
    triN(p, P(s, z), P(s + r * Math.cos(a), z + r * Math.sin(a)), P(s + r * Math.cos(b), z + r * Math.sin(b)), n)
  }
}
/** A band (string course) around a ring, standing out by `out`, from z0 to z1. */
export function band(p: Part, r: XY[], z0: number, z1: number, out = 0.12) {
  const o = offset(ccw(r), out)
  walls(p, o, z0, z1)
  // top and bottom lips
  const R = ccw(r)
  for (let i = 0; i < R.length; i++) {
    const j = (i + 1) % R.length
    quadN(p, v3(R[i], z1), v3(R[j], z1), v3(o[j], z1), v3(o[i], z1), [0, 0, 1])
    quadN(p, v3(R[i], z0), v3(R[j], z0), v3(o[j], z0), v3(o[i], z0), [0, 0, -1])
  }
}
/**
 * Merlons along one straight parapet from a to b (2D), each `w` wide and
 * `t` deep (inward from the line, toward `inward`), z0..z1; n merlons
 * spaced evenly with the end ones flush with the ends.
 */
export function merlons(p: Part, a: XY, b: XY, inward: XY, n: number, w: number, t: number, z0: number, z1: number, bev = 0.08) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const ang = Math.atan2(u[1], u[0])
  for (let i = 0; i < n; i++) {
    const s = n === 1 ? L / 2 : w / 2 + (i * (L - w)) / (n - 1)
    const cx = a[0] + u[0] * s + inward[0] * t / 2, cy = a[1] + u[1] * s + inward[1] * t / 2
    boxAt(p, cx, cy, w / 2, t / 2, z0, z1, ang, 0, bev)
  }
}

// --- smooth sculpture -------------------------------------------------------

/**
 * A smooth surface from a grid of rows (grid[k][i]): normals from the
 * grid's own neighbours, turned away from `inside(p)`. Each row is closed
 * when `closed`.
 */
export function surface(p: Part, grid: V3[][], closed: boolean, inside: (q: V3) => V3) {
  const K = grid.length, N = grid[0].length
  const at = (k: number, i: number) => grid[clamp(k, 0, K - 1)][closed ? ((i % N) + N) % N : clamp(i, 0, N - 1)]
  const nrm = grid.map((row, k) => row.map((q, i) => {
    let nn = cross(sub(at(k, i + 1), at(k, i - 1)), sub(at(k + 1, i), at(k - 1, i)))
    if (len(nn) < 1e-9) nn = sub(q, inside(q))
    nn = unit(nn)
    return dot(nn, sub(q, inside(q))) < 0 ? mul(nn, -1) : nn
  }))
  const M = closed ? N : N - 1
  for (let k = 0; k < K - 1; k++)
    for (let i = 0; i < M; i++) {
      const j = (i + 1) % N
      const a = grid[k][i], b = grid[k][j], c = grid[k + 1][j], d = grid[k + 1][i]
      const na = nrm[k][i], nb = nrm[k][j], nc = nrm[k + 1][j], nd = nrm[k + 1][i]
      if (len(sub(a, b)) > 1e-6 && len(sub(b, c)) > 1e-6) p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
      if (len(sub(c, d)) > 1e-6 && len(sub(a, d)) > 1e-6) p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
    }
}
/** Two unit vectors perpendicular to d. */
export function basis(d: V3, up: V3 = [0, 0, 1]): [V3, V3] {
  const u = unit(d)
  const ref: V3 = Math.abs(dot(u, unit(up))) < 0.95 ? up : [1, 0, 0]
  const e1 = unit(cross(ref, u)), e2 = cross(u, e1)
  return [e1, e2]
}
/**
 * A limb: a smooth tube through the points, with a radius (or [rx, ry]
 * elliptical radii, rx along the side vector) at each, rounded shut at both
 * ends. `up` orients the ellipses.
 */
export function limb(p: Part, pts: V3[], radii: (number | [number, number])[], k = 8, up: V3 = [0, 0, 1], caps: boolean | 'start' | 'end' = true) {
  k = Math.max(4, Math.round(k))
  const n = pts.length
  const rings: V3[][] = []
  const R = (i: number): [number, number] => { const r = radii[i]; return typeof r === 'number' ? [r, r] : r }
  // Parallel-transported frame.
  let [e1] = basis(sub(pts[1], pts[0]), up)
  for (let i = 0; i < n; i++) {
    const d = unit(sub(pts[Math.min(n - 1, i + 1)], pts[Math.max(0, i - 1)]))
    e1 = unit(sub(e1, mul(d, dot(e1, d))))
    const e2 = cross(d, e1)
    const [rx, ry] = R(i)
    rings.push(Array.from({ length: k }, (_, j) => {
      const t = (j / k) * TAU
      return add(pts[i], add(mul(e1, rx * Math.cos(t)), mul(e2, ry * Math.sin(t))))
    }))
  }
  const grid = [...rings]
  if (caps) {
    // Domed ends: two shrinking rings and a point.
    const dome = (i: number, dir: number): V3[][] => {
      const d = unit(sub(pts[i], pts[i - dir]))
      const [rx, ry] = R(i), r = Math.min(rx, ry)
      const rows: [number, number][] = k <= 5 ? [[0.7, 0.6]] : [[0.7, 0.72], [0.98, 0.3]]
      return rows.map(([f, sh]) => rings[i].map((q) => add(add(pts[i], mul(sub(q, pts[i]), sh)), mul(d, r * f * 0.9))))
    }
    const tip = (i: number, dir: number): V3[] => { const d = unit(sub(pts[i], pts[i - dir])); const [rx, ry] = R(i); return rings[i].map(() => add(pts[i], mul(d, Math.min(rx, ry) * 0.92))) }
    if (caps !== 'end') { grid.unshift(...dome(0, -1).reverse()); grid.unshift(tip(0, -1)) }
    if (caps !== 'start') grid.push(...dome(n - 1, 1), tip(n - 1, 1))
  }
  // Inside: the nearest spine point.
  const inside = (q: V3) => {
    let best = pts[0], bd = Infinity
    for (let i = 0; i < n - 1; i++) {
      const a = pts[i], b = pts[i + 1], ab = sub(b, a)
      const t = clamp(dot(sub(q, a), ab) / (dot(ab, ab) || 1), 0, 1)
      const c = add(a, mul(ab, t)), dd = len(sub(q, c))
      if (dd < bd) { bd = dd; best = c }
    }
    return best
  }
  surface(p, grid, true, inside)
}
/** An ellipsoid about c with radii r (along x, y, z after turning by yaw about z). */
export function ellipsoid(p: Part, c: V3, r: V3, nu = 12, nv = 8, yaw = 0, pitch = 0) {
  nu = Math.max(5, Math.round(nu)); nv = Math.max(3, Math.round(nv))
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch)
  const grid: V3[][] = []
  for (let k = 0; k <= nv; k++) {
    const v = -Math.PI / 2 + (k / nv) * Math.PI
    grid.push(Array.from({ length: nu }, (_, i) => {
      const t = (i / nu) * TAU
      let x = r[0] * Math.cos(v) * Math.cos(t), y = r[1] * Math.cos(v) * Math.sin(t), z = r[2] * Math.sin(v)
      // pitch about y (tilts x toward z), then yaw about z
      const x1 = x * cp - z * sp, z1 = x * sp + z * cp
      x = x1; z = z1
      return [c[0] + x * cy - y * sy, c[1] + x * sy + y * cy, c[2] + z] as V3
    }))
  }
  surface(p, grid, true, () => c)
}
/** A surface of revolution about a vertical axis through (cx, cy): profile [r, z] bottom to top; smooth. */
export function lathe(p: Part, cx: number, cy: number, prof: [number, number][], seg = 16, a0 = 0) {
  seg = Math.max(4, Math.round(seg))
  const grid = prof.map(([r, z]) => Array.from({ length: seg }, (_, i) => {
    const t = a0 + (i / seg) * TAU
    return [cx + r * Math.cos(t), cy + r * Math.sin(t), z] as V3
  }))
  surface(p, grid, true, (q) => [cx, cy, q[2]])
}
/** A lathe with hard edges between bands (each band flat-normal'd around but faceted along the profile). */
export function latheHard(p: Part, cx: number, cy: number, prof: [number, number][], seg = 16, a0 = 0) {
  for (let b = 0; b < prof.length - 1; b++) lathe(p, cx, cy, [prof[b], prof[b + 1]], seg, a0)
}

/**
 * Copy a part's triangles into another through a transform: M moves
 * points, R turns normals (both in the map frame). Mirroring is fine: the
 * winding follows the normals.
 */
export function place(dst: Part, src: Part, M: (q: V3) => V3, R: (n: V3) => V3) {
  const P = src.pos, N = src.nrm
  for (let t = 0; t < P.length / 9; t++) {
    const q: V3[] = [], m: V3[] = []
    for (let c = 0; c < 3; c++) {
      const o = t * 9 + c * 3
      q.push(M([P[o], -P[o + 2], P[o + 1]]))
      m.push(unit(R([N[o], -N[o + 2], N[o + 1]])))
    }
    dst.tri(q[0], q[1], q[2], undefined, undefined, undefined, m)
  }
}
/** A similarity: scale s, turn by yaw (radians, about z), mirror x if `mirror`, then move by t. */
export function similarity(s: number, yaw: number, t: V3, mirror = false): [(q: V3) => V3, (n: V3) => V3] {
  const c = Math.cos(yaw), sn = Math.sin(yaw), mx = mirror ? -1 : 1
  const rot = (q: V3): V3 => [q[0] * mx * c - q[1] * sn, q[0] * mx * sn + q[1] * c, q[2]]
  return [(q) => add(mul(rot(q), s), t), (n) => rot(n)]
}

// --- output ------------------------------------------------------------------

export type Layer = { part: Part; material: MaterialSpec }
/** Check the budget and write models/<file>. */
export async function save(file: string, name: string, parts: Layer[], extras: Record<string, unknown>, maxTri = 5000, maxBytes = 250_000) {
  const used = parts.filter((x) => x.part.triangles > 0)
  const triangles = used.reduce((s, x) => s + x.part.triangles, 0)
  if (used.length > 6) throw new Error(`${file}: ${used.length} materials`)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', ...extras })
  if (triangles > maxTri || glb.length > maxBytes) throw new Error(`${file}: budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

/** Floodlit walls: faces looking up barely lit, the rest fully. */
export const floodWalls = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.9)

// ===========================================================================
// Karlstor

function build() {
  const wall = new Part(), trim = new Part(), roof = new Part(), win = new Part(), arms = new Part()

  const X = 2.8 // half depth (x)
  const TC = 4.2, TO = 11.8 // tower inner and outer y
  const TW = 15.5, TM = 17.0 // tower parapet sill, merlon top
  const CW = 11.5, CM = 12.8 // centre parapet sill, merlon top
  const big: Opening = { c: 0, hw: 3.75, zs: 4.6, k: 1.54 }
  const side = (c: number): Opening => ({ c, hw: 2.0, zs: 3.3, k: 1.5 })
  const yT = (TC + TO) / 2

  // Faces: front (-x, Stachus) and back (+x, Neuhauser Str.). u = +y along
  // the face; the openings are placed by their y.
  const front: V3 = [-X, 0, 0], back: V3 = [X, 0, 0]
  const U: V3 = [0, 1, 0], NF: V3 = [-1, 0, 0], NB: V3 = [1, 0, 0]
  for (const [o, n] of [[front, NF], [back, NB]] as [V3, V3][]) {
    // Centre below its parapet, towers to theirs.
    piercedFace(wall, o, U, n, -TC, TC, 0, CW, [big], 0, 12)
    piercedFace(wall, o, U, n, -TO, -TC, 0, TW, [side(-yT)], 0, 10)
    piercedFace(wall, o, U, n, TC, TO, 0, TW, [side(yT)], 0, 10)
  }
  // Passages right through.
  tunnel(wall, front, U, NF, 0, -2 * X, [big, side(-yT), side(yT)], 0, 12)
  // Tower ends and the tower faces above the centre.
  for (const s of [-1, 1]) {
    quadN(wall, [-X, s * TO, 0], [X, s * TO, 0], [X, s * TO, TW], [-X, s * TO, TW], [0, s, 0])
    quadN(wall, [-X, s * TC, CW], [X, s * TC, CW], [X, s * TC, TW], [-X, s * TC, TW], [0, -s, 0])
  }
  // Wall-walk tops.
  cap(wall, rect(-X, -TC, X, TC), CW)
  for (const s of [-1, 1]) cap(wall, rect(-X, s > 0 ? TC : -TO, X, s > 0 ? TO : -TC), TW)

  // Merlons: five a face on the towers, four on the ends; six on the centre.
  const MW = 1.0, MT = 0.6
  for (const s of [-1, 1]) {
    const y0 = s * TC, y1 = s * TO
    merlons(wall, [-X, y0], [-X, y1], [1, 0], 5, MW, MT, TW, TM)
    merlons(wall, [X, y0], [X, y1], [-1, 0], 5, MW, MT, TW, TM)
    merlons(wall, [-X + MT, y1], [X - MT, y1], [0, -s], 3, MW, MT, TW, TM)
    merlons(wall, [-X + MT, y0], [X - MT, y0], [0, s], 3, MW, MT, TW, TM)
    // Roofs: low hips inside the merlon ring.
    hipRoof(roof, -X + MT, Math.min(y0, y1) + MT, X - MT, Math.max(y0, y1) - MT, TW - 0.2, TM + 0.45, 0.0, 0.6)
  }
  merlons(wall, [-X, -TC], [-X, TC], [1, 0], 6, 0.85, MT, CW, CM)
  merlons(wall, [X, -TC], [X, TC], [-1, 0], 6, 0.85, MT, CW, CM)
  // The centre's roof: a gable along y between the merlon rows, ridge 13.
  {
    const x0 = -X + MT, x1 = X - MT, z0 = CW - 0.2, zr = CM + 0.3
    quadN(roof, [x0, -TC, z0], [0, -TC, zr], [0, TC, zr], [x0, TC, z0], [-1, 0, 1.5])
    quadN(roof, [x1, -TC, z0], [0, -TC, zr], [0, TC, zr], [x1, TC, z0], [1, 0, 1.5])
  }

  // Mouldings.
  for (const s of [-1, 1]) {
    // Tower string course at 13.5, round the tower's exposed faces.
    band(trim, rect(-X, s > 0 ? TC : -TO, X, s > 0 ? TO : -TC), 13.35, 13.65, 0.12)
    // The centre's string under the parapet.
    for (const xx of [-X, X]) boxAt(trim, xx, 0, 0.1, TC, 11.0, 11.3)
  }
  for (const [o, n] of [[front, NF], [back, NB]] as [V3, V3][]) {
    archBand(trim, o, U, n, big, 0.45, 0.14, 0, 12)
    for (const s of [-1, 1]) {
      const op = side(s * yT)
      archBand(trim, o, U, n, op, 0.25, 0.1, 0, 10)
      // Label moulding over the side arch: a horizontal at 7.0 with drops to 5.9.
      const a = s * yT - 3.0, b = s * yT + 3.0
      panelOn(trim, o, U, n, Math.min(a, b), Math.max(a, b), 6.85, 7.15, 0.12)
      panelOn(trim, o, U, n, Math.min(a, b), Math.min(a, b) + 0.3, 5.9, 6.85, 0.12)
      panelOn(trim, o, U, n, Math.max(a, b) - 0.3, Math.max(a, b), 5.9, 6.85, 0.12)
      if (n === NF) {
        // West: inscription plaques on the towers, painted arms in the spandrels.
        panelOn(trim, o, U, n, s * yT - 0.8, s * yT + 0.8, 7.6, 9.1, 0.1)
        discOn(arms, o, U, n, s * 3.2, 10.0, 0.62, 0.1, 0, 14)
        discOn(trim, o, U, n, s * 3.2, 10.0, 0.78, 0.06, 0, 14)
      } else {
        // East: square frames holding round mosaic portraits, plain spandrels.
        panelOn(trim, o, U, n, s * yT - 0.75, s * yT + 0.75, 8.0, 9.5, 0.08)
        discOn(trim, o, U, n, s * yT, 8.75, 0.55, 0.12, 0, 12)
      }
      // Paired slit windows above the string course, arched niches below it.
      for (const dy of [-1.7, 1.7]) {
        panelOn(win, o, U, n, s * yT + dy - 0.22, s * yT + dy + 0.22, 13.8, 14.4, 0.04, 0, true, 4)
        panelOn(win, o, U, n, s * yT + dy * 1.25 - 0.32, s * yT + dy * 1.25 + 0.32, 12.2, 12.7, 0.04, 0, true, 4)
      }
    }
  }
  // A low plinth band on the tower faces either side of the passages.
  for (const s of [-1, 1]) for (const xx of [-X - 0.08, X + 0.08]) {
    const ya = s * TC, yb = s * (yT - 2.0), yc = s * (yT + 2.0), yd = s * TO
    boxAt(trim, xx, (ya + yb) / 2, 0.1, Math.abs(yb - ya) / 2, 0, 0.6)
    boxAt(trim, xx, (yc + yd) / 2, 0.1, Math.abs(yd - yc) / 2, 0, 0.6)
  }

  const plaster = finish('karlstor-plaster', 0xe4d2aa)
  return [
    { part: wall, material: { ...plaster, floodlight: floodWalls } },
    { part: trim, material: { ...finish('karlstor-trim', 0xeee0c0), floodlight: floodWalls } },
    { part: roof, material: finish('karlstor-tile', 0xb5654c) },
    { part: win, material: PALETTE.window },
    { part: arms, material: finish('karlstor-arms', 0xc9a54e) },
  ] as Layer[]
}

if (import.meta.main) {
  await save('munich-karlstor.glb', 'Karlstor', build(), { bearing: 23.2, elevation: 0, height: 17.0, osm: 'way/52103816' })
}
