/**
 * Bulgarian St. Stephen Church ("the Iron Church"), Balat, Istanbul
 * (prefabricated cast iron, Vienna 1893-96, consecrated 1898): procedural,
 * CC0-1.0.
 * bun generators/istanbul-bulgarian-church.ts
 *
 * Frame: built along the church's axis and placed at bearing 47.4 (the
 * outline's long sides), so +y runs from the bell tower to the altar end
 * (north-east, toward the Golden Horn; tr.wikipedia: the apse faces the
 * Horn) and +x is the south-east side. Origin: the centroid of the OSM
 * outline (way/175519383, 15.1 x 26.9 m with a chamfered north-east end).
 *
 * Ground: the flat shore park. Mapterhorn has no z15 terrain here (404), so
 * `terrain.ts check` could not run. Elevation 0.
 *
 * Published (en/tr.wikipedia "Bulgarian St. Stephen Church" / "Sveti Stefan
 * Kilisesi"): a cross-shaped basilica of prefabricated iron, "three-domed";
 * a 40 m bell tower over the narthex; the dome gilded. The three domes are
 * inside: every exterior photo shows pitched metal roofs with transept gables
 * and only the tower's gilt dome outside, so that is what is drawn (the
 * brief's "central dome" is not visible outside).
 * Estimated from the photos (scaled by the published 40 m tower): grey
 * plinth 2.2 m, main cornice 12.9, parapet 14.4, roof ridge 17.4, transept
 * gables (centred 60% along the nave, as in "Sveti Stefan Kilisesi") to
 * 19.7, tower stage to 19.0, open belfry to 27, tower cornice 29.6, gilt
 * dome to 35.3, cross to 40. Tower 8 m square, projecting 0.5 m.
 *
 * Simplified: the cast ornament, colonnettes and tracery; the many small
 * pinnacles are drawn at about one per bay, each as a white shaft and a
 * gilt onion, bold enough to read; the stairs are left out (ground).
 *
 * Colours: pale grey-green paint and white trim over a grey plinth, from the
 * 2018-2022 daylight photos after the restoration; gilt onions and dome.
 *
 * Night: floodlit; walls, trim and gilt carry a `_FLOODLIGHT` wash.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - "St. Stephen Church in Istanbul from the upstream side of the Golden Horn.jpg", Michael Kam Barngrover, CC BY-SA 4.0 (north-west)
 * - "St. Stephen Church in Istanbul near the entrance.jpg", Michael Kam Barngrover, CC BY-SA 4.0 (west corner, tower)
 * - "Sveti Stefan Kilisesi.jpg", Sadrettin, CC BY-SA 4.0 (south-east side)
 * - "Sveti Stefan Kilisesi 2022.jpg", Afurkanakin, CC BY 4.0 (side bays)
 * - "DEMİR KİLİSE (Sveti Stefan Kilisesi).jpg", ERHAN ALICI, CC BY-SA 3.0 (west corner, wide)
 * - "The Bulgarian St Stephen Church was made of cast iron in Istanbul - panoramio.jpg", Laima Gūtmane, CC BY-SA 3.0 (from the Golden Horn)
 * Look-only: none.
 *
 * Doubts: heights are photo estimates except the tower's 40 m; the apse end
 * is drawn on the OSM chamfer, which no photo shows head-on.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

// ---------------------------------------------------------------------------
// Helpers. Map frame: x, y horizontal (y along the model's axis), z up.
// Every face is given its outward normal; Part.tri then winds it to agree.

const TAU = Math.PI * 2
const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
const Z: V3 = [0, 0, 1]

function tri(p: Part, a: V3, b: V3, c: V3, n: V3 | V3[]) {
  const ns = Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3]
  p.tri(a, b, c, [0, 0], [0, 0], [0, 0], ns)
}
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3 | V3[]) {
  const ns = Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3, n as V3]
  tri(p, a, b, c, [ns[0], ns[1], ns[2]])
  tri(p, a, c, d, [ns[0], ns[2], ns[3]])
}
/** A convex planar polygon, fanned from its first corner. */
function face(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) tri(p, pts[0], pts[i], pts[i + 1], n)
}

/**
 * A surface of revolution about the vertical axis at (cx, cy): `prof` runs
 * from bottom to top as [r, z]. `smooth` averages normals along the profile
 * (domes); `facet` gives each segment one flat normal (polygonal drums).
 */
function lathe(p: Part, cx: number, cy: number, prof: [number, number][], n: number,
  o: { smooth?: boolean; a0?: number; a1?: number; phase?: number; facet?: boolean } = {}) {
  const a0 = o.a0 ?? 0, a1 = o.a1 ?? TAU, ph = o.phase ?? 0
  const segN = prof.slice(0, -1).map((q, k) => {
    const dr = prof[k + 1][0] - q[0], dz = prof[k + 1][1] - q[1]
    const l = Math.hypot(dr, dz) || 1
    return [dz / l, -dr / l] as [number, number]
  })
  const vN = (k: number, seg: number): [number, number] => {
    if (!o.smooth) return segN[seg]
    const a = segN[Math.max(0, k - 1)], b = segN[Math.min(segN.length - 1, k)]
    const r = a[0] + b[0], z = a[1] + b[1], l = Math.hypot(r, z) || 1
    return [r / l, z / l]
  }
  const at = (r: number, z: number, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
  const nn = (q: [number, number], t: number): V3 => norm([q[0] * Math.cos(t), q[0] * Math.sin(t), q[1]])
  for (let i = 0; i < n; i++) {
    const t0 = ph + a0 + ((a1 - a0) * i) / n, t1 = ph + a0 + ((a1 - a0) * (i + 1)) / n
    const tm = (t0 + t1) / 2
    for (let k = 0; k < prof.length - 1; k++) {
      const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
      if (Math.abs(r0 - r1) < 1e-9 && Math.abs(z0 - z1) < 1e-9) continue
      const A = at(r0, z0, t0), B = at(r0, z0, t1), C = at(r1, z1, t1), D = at(r1, z1, t0)
      let nA = nn(vN(k, k), t0), nB = nn(vN(k, k), t1), nC = nn(vN(k + 1, k), t1), nD = nn(vN(k + 1, k), t0)
      if (o.facet) nA = nB = nC = nD = nn(segN[k], tm)
      if (r0 < 1e-6) tri(p, A, C, D, [nA, nC, nD])
      else if (r1 < 1e-6) tri(p, A, B, C, [nA, nB, nC])
      else quad(p, A, B, C, D, [nA, nB, nC, nD])
    }
  }
}

/** A spherical cap: base radius rb at zb, crown at zb + rise. */
function domeProfile(rb: number, zb: number, rise: number, rings: number): [number, number][] {
  const R = (rb * rb + rise * rise) / (2 * rise), zc = zb + rise - R
  const t0 = Math.asin(Math.min(1, rb / R))
  const out: [number, number][] = []
  for (let k = 0; k <= rings; k++) {
    const t = t0 * (1 - k / rings)
    out.push([R * Math.sin(t), zc + R * Math.cos(t)])
  }
  out[rings][0] = 0
  return out
}
function dome(p: Part, cx: number, cy: number, rb: number, zb: number, rise: number, n: number, rings: number, phase = 0) {
  lathe(p, cx, cy, domeProfile(rb, zb, rise, rings), n, { smooth: true, phase })
}

/** A vertical prism over a convex ring (counter-clockwise from above). */
function prism(side: Part, top: Part | null, ring: [number, number][], z0: number, z1: number | number[], bottom = false) {
  const zt = (i: number) => (Array.isArray(z1) ? z1[i] : z1)
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length
    const [ax, ay] = ring[i], [bx, by] = ring[j]
    const n = norm([by - ay, -(bx - ax), 0])
    quad(side, [ax, ay, z0], [bx, by, z0], [bx, by, zt(j)], [ax, ay, zt(i)], n)
  }
  if (top) {
    const pts = ring.map(([x, y], i) => [x, y, zt(i)] as V3)
    const a = pts[0], b = pts[1], c = pts[2]
    const n = norm([(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])])
    face(top, pts, n[2] < 0 ? [-n[0], -n[1], -n[2]] : n)
  }
  if (bottom) face(side, ring.map(([x, y]) => [x, y, z0] as V3).reverse(), [0, 0, -1])
}
/** A box with chamfered vertical edges; sides to `side`, top to `top`. */
function box(side: Part, top: Part | null, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0) {
  const ring: [number, number][] = b > 0
    ? [[x0 + b, y0], [x1 - b, y0], [x1, y0 + b], [x1, y1 - b], [x1 - b, y1], [x0 + b, y1], [x0, y1 - b], [x0, y0 + b]]
    : [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  prism(side, top, ring, z0, z1)
}
/** A box turned to a horizontal direction u, centred on (cx, cy). */
function obox(side: Part, top: Part | null, cx: number, cy: number, u: [number, number], hu: number, hv: number, z0: number, z1: number | number[]) {
  const v: [number, number] = [-u[1], u[0]]
  const c = (su: number, sv: number): [number, number] => [cx + u[0] * su + v[0] * sv, cy + u[1] * su + v[1] * sv]
  prism(side, top, [c(-hu, -hv), c(hu, -hv), c(hu, hv), c(-hu, hv)], z0, z1)
}
/** A hipped roof over an axis-aligned rectangle, eave at z0, ridge rise h. */
function hipRoof(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, h: number) {
  const w = x1 - x0, d = y1 - y0, hw = Math.min(w, d) / 2
  const along = w >= d
  const r0: V3 = along ? [x0 + hw, (y0 + y1) / 2, z0 + h] : [(x0 + x1) / 2, y0 + hw, z0 + h]
  const r1: V3 = along ? [x1 - hw, (y0 + y1) / 2, z0 + h] : [(x0 + x1) / 2, y1 - hw, z0 + h]
  const A: V3 = [x0, y0, z0], B: V3 = [x1, y0, z0], C: V3 = [x1, y1, z0], D: V3 = [x0, y1, z0]
  const nz = hw, s = h
  if (along) {
    quad(p, A, B, r1, r0, norm([0, -s, nz]))
    quad(p, C, D, r0, r1, norm([0, s, nz]))
    tri(p, B, C, r1, norm([s, 0, nz]))
    tri(p, D, A, r0, norm([-s, 0, nz]))
  } else {
    quad(p, B, C, r1, r0, norm([s, 0, nz]))
    quad(p, D, A, r0, r1, norm([-s, 0, nz]))
    tri(p, A, B, r0, norm([0, -s, nz]))
    tri(p, C, D, r1, norm([0, s, nz]))
  }
}

/** The horizontal direction to the right of a viewer facing a wall with outward normal n. */
const rightOf = (n: V3): V3 => [-n[1], n[0], 0]

/**
 * A flat panel on a wall: centred at `at` (on the wall, at its bottom), `w`
 * wide and `h` tall, with a round (semicircular) top when `arch`.
 */
function panel(p: Part, at: V3, n: V3, w: number, h: number, arch = false, segs = 6, off = 0.06) {
  const u = rightOf(n), o = add(at, n, off)
  const P = (s: number, z: number): V3 => [o[0] + u[0] * s, o[1] + u[1] * s, o[2] + z]
  const r = w / 2, zs = arch ? h - r : h
  quad(p, P(-r, 0), P(r, 0), P(r, zs), P(-r, zs), n)
  if (arch) {
    for (let i = 0; i < segs; i++) {
      const t0 = (Math.PI * i) / segs, t1 = (Math.PI * (i + 1)) / segs
      tri(p, P(0, zs), P(r * Math.cos(t0), zs + r * Math.sin(t0)), P(r * Math.cos(t1), zs + r * Math.sin(t1)), n)
    }
  }
}

/**
 * An arched band (a semicircular moulding) flush on a wall: centre `c` (on
 * the wall at the springing), radius r to r + w, standing `d` proud.
 */
function archBand(p: Part, c: V3, n: V3, r: number, w: number, d: number, segs = 10) {
  const u = rightOf(n)
  const P = (t: number, rr: number, dd: number): V3 => [c[0] + u[0] * rr * Math.cos(t) + n[0] * dd, c[1] + u[1] * rr * Math.cos(t) + n[1] * dd, c[2] + rr * Math.sin(t)]
  for (let i = 0; i < segs; i++) {
    const t0 = (Math.PI * i) / segs, t1 = (Math.PI * (i + 1)) / segs, tm = (t0 + t1) / 2
    quad(p, P(t0, r, d), P(t1, r, d), P(t1, r + w, d), P(t0, r + w, d), n)
    quad(p, P(t0, r, 0), P(t1, r, 0), P(t1, r, d), P(t0, r, d), norm([-u[0] * Math.cos(tm), -u[1] * Math.cos(tm), -Math.sin(tm)]))
    quad(p, P(t1, r + w, 0), P(t0, r + w, 0), P(t0, r + w, d), P(t1, r + w, d), norm([u[0] * Math.cos(tm), u[1] * Math.cos(tm), Math.sin(tm)]))
  }
}

/**
 * A minaret: square base to zb, a round shaft, şerefe balconies (corbel and
 * parapet), a conical lead cap and a gilt alem. Drawn bolder than real.
 */
function minaret(stone: Part, trim: Part, lead: Part, gilt: Part, x: number, y: number,
  o: { base: number; baseHalf: number; SR: number; BR: number; balconies: number[]; shaftTop: number; capTop: number; n?: number; topR?: number }) {
  const n = o.n ?? 12, SR = o.SR, BR = o.BR, topR = o.topR ?? SR * 0.85
  if (o.base > 0) {
    box(stone, trim, x - o.baseHalf, x + o.baseHalf, y - o.baseHalf, y + o.baseHalf, 0, o.base, 0.25)
    lathe(trim, x, y, [[o.baseHalf * 0.9, o.base], [SR, o.base + 1.4]], n, { phase: 0.2 })
  }
  const z0 = o.base > 0 ? o.base + 1.4 : 0
  lathe(stone, x, y, [[SR, z0], [SR * 0.97, o.balconies[0]]], n, { phase: 0.2 })
  for (let i = 0; i < o.balconies.length; i++) {
    const zb = o.balconies[i], zn = i + 1 < o.balconies.length ? o.balconies[i + 1] : o.shaftTop
    const r0 = i === 0 ? SR * 0.97 : SR * 0.92, r1 = i + 1 < o.balconies.length ? SR * 0.92 : topR
    lathe(trim, x, y, [[r0, zb], [BR, zb + 1.5], [BR, zb + 2.7], [r1, zb + 2.7]], n, { phase: 0.2 })
    lathe(stone, x, y, [[r1, zb + 2.7], [r1, zn]], n, { phase: 0.2 })
  }
  const ch = o.capTop - o.shaftTop
  lathe(lead, x, y, [[topR, o.shaftTop], [topR + 0.15, o.shaftTop + 0.35], [topR * 0.7, o.shaftTop + 0.3 * ch], [0, o.capTop]], n, { phase: 0.2 })
  lathe(gilt, x, y, [[0.18, o.capTop - 0.3], [0.38, o.capTop + 0.5], [0.12, o.capTop + 1.0], [0, o.capTop + 2.0]], 6, { smooth: true })
}

/** An alem: bulbs on a rod. */
function alem(gilt: Part, x: number, y: number, z: number, s = 1) {
  lathe(gilt, x, y, [[0.45 * s, z], [0.7 * s, z + 0.7 * s], [0.4 * s, z + 1.4 * s], [0.22 * s, z + 1.7 * s], [0.5 * s, z + 2.4 * s], [0.16 * s, z + 3.1 * s], [0.1 * s, z + 4.2 * s], [0, z + 4.35 * s]], 8, { smooth: true })
}

// ---------------------------------------------------------------------------
// Parts, one per material.

const paint = new Part() // the painted cast-iron walls, pale grey-green
const trim = new Part() // white cornices, parapets, mouldings
const plinth = new Part() // the grey base course
const roof = new Part() // metal roofs
const glaze = new Part() // windows
const gilt = new Part() // the gilt onion pinnacles, the tower dome, crosses

/** A round flat window, centred at `at` on a wall with normal n. */
function disc(p: Part, at: V3, n: V3, r: number, segs = 10) {
  const u = rightOf(n), o = add(at, n, 0.06)
  for (let i = 0; i < segs; i++) {
    const t0 = (TAU * i) / segs, t1 = (TAU * (i + 1)) / segs
    const P = (t: number): V3 => [o[0] + u[0] * r * Math.cos(t), o[1] + u[1] * r * Math.cos(t), o[2] + r * Math.sin(t)]
    tri(p, o, P(t0), P(t1), n)
  }
}

/** A white pinnacle with a gilt onion and cross, standing on (x, y, z). */
function pinnacle(x: number, y: number, z: number, h = 1.9, s = 1) {
  box(trim, trim, x - 0.42 * s, x + 0.42 * s, y - 0.42 * s, y + 0.42 * s, z, z + h, 0.1)
  // A little gablet on each face, then the onion.
  lathe(gilt, x, y, [[0.38 * s, z + h], [0.55 * s, z + h + 0.35 * s], [0.45 * s, z + h + 0.75 * s], [0.12 * s, z + h + 1.15 * s], [0.07 * s, z + h + 1.8 * s], [0, z + h + 1.85 * s]], 6, { smooth: true })
}

/**
 * A wall pierced by one round-headed opening: the face toward n from s = 0
 * to s = w (to the right of `o`), the opening from s0 to s1, floor zb,
 * springing zs, top zt; jambs and soffit run d deep.
 */
function openArch(p: Part, o: V3, n: V3, w: number, s0: number, s1: number, zb: number, zs: number, zt: number, d: number) {
  const u = rightOf(n), k = 4, a = (s1 - s0) / 2, sc = s0 + a
  const P = (s: number, z: number, dd = 0): V3 => [o[0] + u[0] * s - n[0] * dd, o[1] + u[1] * s - n[1] * dd, z]
  quad(p, P(0, zb), P(s0, zb), P(s0, zt), P(0, zt), n)
  quad(p, P(s1, zb), P(w, zb), P(w, zt), P(s1, zt), n)
  const arc: [number, number][] = []
  for (let i = 0; i <= 2 * k; i++) {
    const th = Math.PI - (Math.PI * i) / (2 * k)
    arc.push([sc + a * Math.cos(th), zs + a * Math.sin(th)])
  }
  const TL = P(s0, zt), TR = P(s1, zt)
  for (let i = 0; i < k; i++) tri(p, TL, P(arc[i][0], arc[i][1]), P(arc[i + 1][0], arc[i + 1][1]), n)
  tri(p, TL, P(arc[k][0], arc[k][1]), TR, n)
  for (let i = k; i < 2 * k; i++) tri(p, TR, P(arc[i][0], arc[i][1]), P(arc[i + 1][0], arc[i + 1][1]), n)
  for (let i = 0; i < 2 * k; i++) {
    const q0 = arc[i], q1 = arc[i + 1]
    const nrm = (q: [number, number]): V3 => { const ds = sc - q[0], dz = zs - q[1], l = Math.hypot(ds, dz); return norm([u[0] * ds / l, u[1] * ds / l, dz / l]) }
    quad(p, P(q0[0], q0[1]), P(q1[0], q1[1]), P(q1[0], q1[1], d), P(q0[0], q0[1], d), [nrm(q0), nrm(q1), nrm(q1), nrm(q0)])
  }
  quad(p, P(s0, zb), P(s0, zb, d), P(s0, zs, d), P(s0, zs), [u[0], u[1], 0])
  quad(p, P(s1, zb, d), P(s1, zb), P(s1, zs), P(s1, zs, d), [-u[0], -u[1], 0])
}

// ---------------------------------------------------------------------------
// Dimensions (metres). Frame: +y along the axis toward the altar (north-east,
// the Golden Horn), +x the south-east side. Plan from the OSM outline.

const X = 7.55, Y0 = -13.05, Y1 = 11.0, YA = 13.8, XA = 3.2 // walls; apse end chamfered
const PL = 2.2 // the grey plinth
const CORN = 12.9 // main cornice
const PAR = 14.4 // parapet top
const EAVE = 13.6, RIDGE = 17.4
const TY = 3.1, TW = 3.4 // transept gables: centre and half width
const T = 4.0, TY0 = Y0 - 0.5, TY1 = Y0 + 7.5 // the tower: half width, front, back

const ring: [number, number][] = [[-X, Y0], [X, Y0], [X, Y1], [XA, YA], [-XA, YA], [-X, Y1]]
prism(plinth, null, ring, 0, PL)
prism(paint, null, ring, PL, CORN)
const ringO: [number, number][] = [[-X - 0.3, Y0 - 0.3], [X + 0.3, Y0 - 0.3], [X + 0.3, Y1 + 0.12], [XA + 0.12, YA + 0.3], [-XA - 0.12, YA + 0.3], [-X - 0.3, Y1 + 0.12]]
prism(trim, null, ringO, CORN, CORN + 0.6)
prism(trim, null, ring, CORN + 0.6, PAR)
// Roof behind the parapet: a ridge along the axis, hipped at the apse.
{
  const xi = X - 0.6, yb = Y0 + 0.4, ye = Y1 - 0.2
  const ns = (s: number) => norm([s * (RIDGE - EAVE), 0, xi])
  for (const s of [-1, 1]) {
    quad(roof, [s * xi, yb, EAVE], [s * xi, ye, EAVE], [0, ye, RIDGE], [0, yb, RIDGE], ns(s))
    tri(roof, [s * xi, ye, EAVE], [s * XA * 0.8, YA - 0.5, EAVE], [0, ye, RIDGE], norm([s * 0.6, 0.6, 0.8]))
  }
  tri(roof, [XA * 0.8, YA - 0.5, EAVE], [-XA * 0.8, YA - 0.5, EAVE], [0, ye, RIDGE], norm([0, RIDGE - EAVE, 2.8]))
  // The transept roofs, crossing the nave roof, ridge at the gable crown.
  for (const s of [-1, 1]) {
    const gx = s * X
    quad(roof, [gx, TY - TW, EAVE + 1.4], [0, TY - TW, EAVE + 1.4], [0, TY, RIDGE + 1.6], [gx, TY, RIDGE + 1.6], norm([0, -(RIDGE + 0.2 - EAVE), TW]))
    quad(roof, [0, TY + TW, EAVE + 1.4], [gx, TY + TW, EAVE + 1.4], [gx, TY, RIDGE + 1.6], [0, TY, RIDGE + 1.6], norm([0, RIDGE + 0.2 - EAVE, TW]))
  }
}

// Transept gables, flush with the side walls: a white gable with a rose.
for (const s of [-1, 1]) {
  const n: V3 = [s, 0, 0], gx = s * X
  const A: V3 = [gx, TY - TW - 0.4, PAR], B: V3 = [gx, TY + TW + 0.4, PAR], Cr: V3 = [gx, TY, RIDGE + 2.3]
  face(trim, [A, B, Cr], n)
  face(trim, [add(B, n, -0.6), add(A, n, -0.6), add(Cr, n, -0.6)], [-s, 0, 0])
  quad(trim, A, add(A, n, -0.6), add(Cr, n, -0.6), Cr, norm([0, -(Cr[2] - A[2]), TW]))
  quad(trim, Cr, add(Cr, n, -0.6), add(B, n, -0.6), B, norm([0, Cr[2] - B[2], TW]))
  disc(glaze, [gx, TY, PAR + 1.3], n, 1.25, 10)
  for (const y of [TY - TW - 0.2, TY + TW + 0.2]) pinnacle(gx - s * 0.2, y, PAR, 1.6, 1.1)
  pinnacle(gx - s * 0.3, TY, RIDGE + 2.0, 0.6, 0.9)
  // The transept bay: a tall triple window under a rose.
  for (const d of [-1.05, 1.05]) panel(glaze, [gx, TY + d, PL + 1.2], n, 1.0, 6.4, true, 4)
  disc(glaze, [gx, TY, PL + 8.4], n, 1.2, 10)
  archBand(trim, [gx, TY, PL + 6.6], n, 2.4, 0.4, 0.25, 8)
}

// Side bays: tall paired windows under a round window, framed by an arch;
// the door bay near the front.
for (const s of [-1, 1]) {
  const n: V3 = [s, 0, 0], gx = s * X
  for (const y of [-5.4, -1.0, 7.6]) {
    for (const d of [-0.6, 0.6]) panel(glaze, [gx, y + d, PL + 1.5], n, 0.95, 5.6, true, 4)
    disc(glaze, [gx, y, PL + 7.6], n, 0.85, 8)
    archBand(trim, [gx, y, PL + 6.6], n, 1.55, 0.35, 0.2, 8)
  }
  panel(trim, [gx, -10.2, 0], n, 1.8, PL + 3.6, true, 6, 0.04)
  panel(glaze, [gx, -10.2, PL], n, 1.3, 3.0, true, 6, 0.1)
  disc(glaze, [gx, -10.2, PL + 7.0], n, 0.85, 8)
  for (const y of [Y0 + 0.3, -7.8, -3.2, 1.2, 5.0, 10.4]) pinnacle(gx - s * 0.3, y, PAR, 1.5)
}
// Apse windows.
for (const [x, y, nx, ny] of [[-5.4, 12.4, -0.55, 0.83], [5.4, 12.4, 0.55, 0.83], [0, YA, 0, 1]] as number[][]) {
  panel(glaze, [x, y, PL + 1.5], [nx, ny, 0], 1.0, 5.4, true, 4)
}
for (const [x, y] of [[-XA, YA], [XA, YA]]) pinnacle(x, y - 0.3, PAR, 1.5)

// ---------------------------------------------------------------------------
// The bell tower over the narthex: a square lower stage with pinnacled
// corners to 19 m, an open belfry to 28 m, a gilt dome and cross to 40 m
// (published height).

const TS1 = 19.0, BEL0 = 19.6, BEL1 = 27.0, BTOP = 29.6, BT = 2.9
box(plinth, null, -T, T, TY0, TY1, 0, PL, 0.2)
box(paint, null, -T, T, TY0, TY1, PL, TS1, 0.2)
box(trim, trim, -T - 0.35, T + 0.35, TY0 - 0.35, TY1 + 0.35, TS1, TS1 + 0.6, 0.3)
// The portal and its windows.
panel(trim, [0, TY0, 0], [0, -1, 0], 3.2, 7.6, true, 6, 0.06)
panel(glaze, [0, TY0, PL], [0, -1, 0], 2.0, 4.6, true, 6, 0.12)
disc(glaze, [0, TY0, 12.4], [0, -1, 0], 1.3, 10)
for (const d of [-1, 1]) panel(glaze, [d * 0.75, TY0, 14.6], [0, -1, 0], 1.0, 3.0, true, 4)
// Front wings either side of the tower, with windows.
for (const s of [-1, 1]) {
  panel(glaze, [s * 5.8, Y0, PL + 1.5], [0, -1, 0], 1.3, 5.6, true, 4)
  disc(glaze, [s * 5.8, Y0, PL + 7.9], [0, -1, 0], 0.8, 8)
  pinnacle(s * (X - 0.3), Y0 + 0.3, PAR, 1.6)
}
for (const sx of [-1, 1]) for (const y of [TY0, TY1]) pinnacle(sx * (T - 0.2), y + (y === TY0 ? 0.2 : -0.2), TS1 + 0.6, 2.0, 1.2)
for (const sx of [-1, 1]) pinnacle(sx * (T - 0.2), (TY0 + TY1) / 2, TS1 + 0.6, 1.5, 1.0)
// The belfry: four open round arches.
const BC = (TY0 + TY1) / 2
{
  const faces4: { o: V3; n: V3 }[] = [
    { o: [-BT, BC - BT, 0], n: [0, -1, 0] }, { o: [BT, BC - BT, 0], n: [1, 0, 0] },
    { o: [BT, BC + BT, 0], n: [0, 1, 0] }, { o: [-BT, BC + BT, 0], n: [-1, 0, 0] },
  ]
  for (const { o, n } of faces4) openArch(paint, o, n, 2 * BT, 1.1, 2 * BT - 1.1, TS1 + 0.6, BEL1 - (BT - 1.1), BEL1, 1.1)
  box(paint, trim, -BT, BT, BC - BT, BC + BT, BEL1, BTOP, 0)
  box(trim, null, -BT - 0.4, BT + 0.4, BC - BT - 0.4, BC + BT + 0.4, BTOP - 0.1, BTOP + 0.6, 0.25)
  for (const { o, n } of faces4) { const u = rightOf(n); disc(glaze, [o[0] + u[0] * BT, o[1] + u[1] * BT, BEL1 + 1.3], n, 0.75, 8) }
  // Inner core, so the belfry does not read as hollow from above.
  box(paint, null, -1.6, 1.6, BC - 1.6, BC + 1.6, TS1 + 0.6, BEL1)
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) pinnacle(sx * (BT - 0.1), BC + sy * (BT - 0.1), BTOP + 0.6, 1.1, 0.9)
}
// The gilt dome on an octagonal drum, a lantern and the cross.
lathe(trim, 0, BC, [[2.5, BTOP + 0.6], [2.5, BTOP + 1.9], [2.7, BTOP + 2.2]], 8, { facet: true, phase: Math.PI / 8 })
lathe(gilt, 0, BC, [[2.7, BTOP + 2.2], [2.75, BTOP + 3.0], [2.45, BTOP + 4.0], [1.8, BTOP + 4.9], [0.9, BTOP + 5.5], [0.45, BTOP + 5.7]], 8, { smooth: true, phase: Math.PI / 8 })
lathe(gilt, 0, BC, [[0.45, BTOP + 5.7], [0.5, BTOP + 6.4], [0.75, BTOP + 6.9], [0.35, BTOP + 7.6], [0.15, BTOP + 8.0]], 6, { smooth: true })
box(gilt, gilt, -0.12, 0.12, BC - 0.12, BC + 0.12, BTOP + 8.0, 40.0)
box(gilt, gilt, -0.75, 0.75, BC - 0.12, BC + 0.12, 38.7, 39.0)

// ---------------------------------------------------------------------------

const lit = (base: number) => (p: V3, n: V3): number => (n[2] > 0.85 ? 0.4 : 1) * base
const parts = [
  { part: paint, material: { ...finish('iron-paint', 0xd5dcd8), floodlight: lit(0.9) } },
  { part: trim, material: { ...PALETTE.trim, color: 0xf2f4f0, floodlight: lit(0.9) } },
  { part: plinth, material: finish('plinth-grey', 0xa3abb2) },
  { part: roof, material: { ...PALETTE.roof, color: 0xa9b0b5 } },
  { part: glaze, material: PALETTE.window },
  { part: gilt, material: { ...finish('gilt', 0xcfa34a, 0.5), floodlight: lit(0.8) } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name, part.triangles)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Bulgarian St. Stephen Church', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 47.4, osm: 'way/175519383', height: 40,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/istanbul-bulgarian-church.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
