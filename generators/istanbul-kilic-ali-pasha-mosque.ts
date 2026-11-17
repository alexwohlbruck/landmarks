/**
 * Kılıç Ali Pasha Mosque, Tophane, Istanbul (Mimar Sinan, 1580-87):
 * procedural, CC0-1.0.
 * bun generators/istanbul-kilic-ali-pasha-mosque.ts
 *
 * Sinan's small "Hagia Sophia" scheme: a central dome on a window drum over
 * a lead-clad block with big arched tympana, a semi-dome toward the qibla,
 * side galleries under small domes, one minaret, and a double portico (an
 * inner arcade of five domed bays, an outer one under a sloping lead roof).
 * The hamam, medrese and tomb of the complex are separate OSM buildings and
 * stay on the map.
 *
 * Frame: built along the qibla axis and placed at bearing 131 (the outline's
 * long sides run 128-131), so +y runs from the portico to the qibla wall
 * (south-east) and +x is the south-west side. Origin: the centroid of the
 * OSM outline (way/165574748, 29 x 40 m incl. the inner portico).
 *
 * Ground: level (Tophane flats). Mapterhorn has no z15 terrain here (404),
 * so `terrain.ts check` could not run. Elevation 0.
 *
 * Published (en.wikipedia "Kılıç Ali Pasha Complex"): central dome 12.70 m
 * across, on pendentives; one minaret with one gallery; 24 windows in the
 * dome's drum. Plan from OSM: hall ±13.3 m by 28.6 m, the inner portico to
 * 8.3 m in front, the mihrab apse 8.8 m wide.
 * Estimated from photos (scaled by the published dome): hall cornice 16.2 m,
 * lead-clad block to 24.6, drum 24.6-27.2, dome crown 32.0 (a shallow
 * dome, as in the elevated view), the semi-dome on a window drum 16.2-19.6
 * rising to 24, corner domes to 20, portico heights (inner 9.4 / domes 12.6,
 * outer eave 5.8), minaret şerefe 31 m and cap tip 43.6 m (no published
 * height found; from the street views). The outer portico projects 6.3 m
 * beyond the OSM outline (photos "esterno 01", "DSCF5119").
 * The minaret stands at the south-west corner by the portico (the elevated
 * view from the hamam and the street view from the north-west agree); the
 * small OSM notch on the north-east side is not a minaret.
 *
 * Simplified: the drum shows 16 windows (24 real), the flying buttress
 * arches on the lateral facades, the lattice windows, the courtyard and its
 * fountain, and the window grilles are left out. Only the qibla semi-dome is
 * modelled (the photos show the north-west side as a tympanum). Minaret
 * drawn about 1.5 times its real girth.
 *
 * Night: floodlit; stone and lead carry a `_FLOODLIGHT` wash, windows glow.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - "Kılıç Ali Paşa Camii.jpg", Alicembasli, CC BY-SA 4.0 (elevated, from the hamam, south-west)
 * - "Kilic Ali Pasha Mosque DSCF5119.jpg", R Prazeres, CC BY-SA 4.0 (north-west, portico)
 * - "Istanbul, moschea di Kılıç Ali Pasha, di sinan, 1580-87, esterno 01.jpg", Francesco Bini, CC BY-SA 4.0 (north-east)
 * - "Kilic Ali Pasha Mosque 8462b.jpg", Dosseman, CC BY-SA 4.0 (from Hamam Sokağı, front block)
 * - "Kılıç Ali Pasha Complex.jpg", Metuboy, CC BY-SA 4.0 (south-west side)
 * Look-only: none.
 *
 * Doubts: all heights are photo estimates (no lidar, no published section);
 * the minaret's height; whether a second half-dome exists over the portico
 * side (the published text says two half-domes on the qibla axis; the
 * photos show a tympanum on the north-west face, which is what is drawn).
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

const stone = new Part() // limestone walls, drums, minaret
const trim = new Part() // cornices, arch bands, şerefe
const lead = new Part() // lead domes and roofs
const clad = new Part() // the lead-clad upper walls round the dome
const glaze = new Part() // windows
const gilt = new Part() // alem finials

/**
 * One side of an arcade: pointed arches on columns, the face toward `n`.
 * `o` is where the side starts; bays run to the right as seen from outside.
 */
function arcade(o: V3, n: V3, bays: number, bw: number, zs: number, za: number, zt: number, t = 0.8) {
  const u = rightOf(n), cw = 0.4, k = 2
  const P = (s: number, z: number, d = 0): V3 => [o[0] + u[0] * s - n[0] * d, o[1] + u[1] * s - n[1] * d, z]
  for (let b = 0; b < bays; b++) {
    const s0 = b * bw, s1 = s0 + bw, sL = s0 + cw, sR = s1 - cw, a = (sR - sL) / 2, H = za - zs
    const rho = (a * a + H * H) / (2 * a), ta = Math.acos((a - rho) / rho)
    const L: [number, number][] = [], R: [number, number][] = []
    for (let i = 0; i <= k; i++) {
      const th = Math.PI - ((Math.PI - ta) * i) / k
      L.push([sL + rho + rho * Math.cos(th), zs + rho * Math.sin(th)])
      R.push([sR - rho - rho * Math.cos(th), zs + rho * Math.sin(th)])
    }
    const TL = P(s0, zt), TR = P(s1, zt)
    tri(stone, TL, P(s0, zs), P(L[0][0], L[0][1]), n)
    for (let i = 0; i < k; i++) tri(stone, TL, P(L[i][0], L[i][1]), P(L[i + 1][0], L[i + 1][1]), n)
    tri(stone, TL, P(L[k][0], L[k][1]), TR, n)
    for (let i = k; i > 0; i--) tri(stone, TR, P(R[i][0], R[i][1]), P(R[i - 1][0], R[i - 1][1]), n)
    tri(stone, TR, P(R[0][0], R[0][1]), P(s1, zs), n)
    for (const [arc, cs] of [[L, sL + rho], [R, sR - rho]] as [[number, number][], number][]) {
      for (let i = 0; i < k; i++) {
        const nrm = (q: [number, number]): V3 => {
          const ds = cs - q[0], dz = zs - q[1], l = Math.hypot(ds, dz)
          return norm([u[0] * ds / l, u[1] * ds / l, dz / l])
        }
        const q0 = arc[i], q1 = arc[i + 1]
        quad(stone, P(q0[0], q0[1]), P(q1[0], q1[1]), P(q1[0], q1[1], t), P(q0[0], q0[1], t), [nrm(q0), nrm(q1), nrm(q1), nrm(q0)])
      }
    }
  }
  for (let b = 0; b <= bays; b++) {
    const s = b * bw, c = P(s, 0, t / 2)
    lathe(stone, c[0], c[1], [[0.38, 0], [0.38, zs]], 6, { phase: Math.PI / 6 })
  }
}

// ---------------------------------------------------------------------------
// Dimensions (metres). Frame: +y along the qibla axis (south-east), +x the
// south-west side. See the header for where each comes from.

const HX = 13.3, HY0 = -11.0, HY1 = 17.6 // prayer hall walls
const WALL = 15.4, CORN = 16.2 // wall top, cornice and flat roofs
const YD = 1.6 // centre of the dome
const BK = 8.4 // half-size of the lead-clad central block
const BLK = 24.6 // block top
const DRUM_R = 7.5, DRUM0 = BLK, LIP = 27.2, DOME_R = 7.0, CROWN = 32.0
const PY0 = -19.3 // inner portico front
const OY0 = -25.6 // outer portico front

// ---------------------------------------------------------------------------
// Prayer hall body, cornice and its flat lead roof.

box(stone, null, -HX, HX, HY0, HY1, 0, WALL, 0.4)
box(trim, lead, -HX - 0.3, HX + 0.3, HY0 - 0.3, HY1 + 0.3, WALL, CORN, 0.5)

// Windows: three tiers on the lateral walls, in four bays.
for (const s of [-1, 1]) {
  const n: V3 = [s, 0, 0]
  for (const y of [-6.5, 0.5, 7.5, 14.0]) {
    panel(glaze, [s * HX, y - 1.2, 1.8], n, 1.5, 2.4)
    panel(glaze, [s * HX, y + 1.2, 1.8], n, 1.5, 2.4)
    panel(glaze, [s * HX, y - 1.25, 6.4], n, 1.9, 4.0, true, 5); panel(glaze, [s * HX, y + 1.25, 6.4], n, 1.9, 4.0, true, 5)
    panel(glaze, [s * HX, y, 11.4], n, 2.4, 3.2, true, 5)
  }
}
// Qibla wall, three tiers either side of the mihrab apse.
for (const x of [-9.5, -6.0, 6.8, 10.2]) {
  panel(glaze, [x, HY1, 1.8], [0, 1, 0], 1.5, 2.4)
  panel(glaze, [x, HY1, 6.4], [0, 1, 0], 2.0, 3.6, true, 5)
}
for (const x of [-7.6, 8.4]) panel(glaze, [x, HY1, 11.4], [0, 1, 0], 3.2, 3.2, true, 5)
// Mihrab apse with a lead roof.
box(stone, null, -3.9, 4.9, HY1 - 0.2, 20.6, 0, 12.0, 0.3)
box(trim, lead, -4.1, 5.1, HY1 - 0.2, 20.8, 12.0, 12.6, 0.3)
panel(glaze, [0.5, 20.6, 7.0], [0, 1, 0], 2.0, 3.4, true, 5)
// North-west wall above the portico.
for (const x of [-9.5, -4.5, 4.5, 9.5]) panel(glaze, [x, HY0, 11.0], [0, -1, 0], 1.8, 2.8, true, 5)

// ---------------------------------------------------------------------------
// The lead-clad central block round the dome, its tympanum arches, corner
// weight turrets; the drum with its window ring and the dome.

box(clad, clad, -BK, BK, YD - BK, YD + BK, CORN, BLK, 0.3)
for (const s of [-1, 1]) {
  const n: V3 = [s, 0, 0], xf = s * BK
  archBand(trim, [xf, YD, 16.6], n, 6.4, 0.7, 0.3, 10)
  for (const d of [-4.2, -1.4, 1.4, 4.2]) panel(glaze, [xf, YD + d, 17.0], n, 1.6, Math.abs(d) > 3 ? 2.6 : 4.4, true, 4)
  for (const d of [-2.1, 0, 2.1]) panel(glaze, [xf, YD + d, Math.abs(d) > 1 ? 21.6 : 22.0], n, 1.2, 1.8, true, 4)
}
{
  const n: V3 = [0, -1, 0], yf = YD - BK
  archBand(trim, [0, yf, 16.6], n, 6.4, 0.7, 0.3, 10)
  for (const d of [-4.2, -1.4, 1.4, 4.2]) panel(glaze, [d, yf, 17.0], n, 1.6, Math.abs(d) > 3 ? 2.6 : 4.4, true, 4)
  for (const d of [-2.1, 0, 2.1]) panel(glaze, [d, yf, Math.abs(d) > 1 ? 21.6 : 22.0], n, 1.2, 1.8, true, 4)
}
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const cx = sx * (BK - 0.6), cy = YD + sy * (BK - 0.6)
  box(clad, clad, cx - 1.6, cx + 1.6, cy - 1.6, cy + 1.6, BLK, BLK + 1.8, 0.3)
}
lathe(stone, 0, YD, [[DRUM_R, DRUM0], [DRUM_R, LIP]], 16, { facet: true })
for (let i = 0; i < 16; i++) {
  const t = (TAU * i) / 16, u: [number, number] = [Math.cos(t), Math.sin(t)]
  obox(stone, stone, u[0] * (DRUM_R + 0.5), YD + u[1] * (DRUM_R + 0.5), u, 0.7, 0.45, DRUM0, [26.4, LIP, LIP, 26.4])
  const tm = t + Math.PI / 16, r = DRUM_R * Math.cos(Math.PI / 16)
  panel(glaze, [Math.cos(tm) * r, YD + Math.sin(tm) * r, DRUM0 + 0.5], [Math.cos(tm), Math.sin(tm), 0], 1.5, 2.2, true, 4)
}
lathe(trim, 0, YD, [[DRUM_R + 0.35, LIP], [DRUM_R + 0.35, LIP + 0.45], [DOME_R, LIP + 0.45]], 24)
dome(lead, 0, YD, DOME_R, LIP + 0.45, CROWN - LIP - 0.45, 24, 5)
alem(gilt, 0, YD, CROWN - 0.2, 0.95)

// The qibla semi-dome on its half drum of windows, against the block.
{
  const yc = YD + BK, r = 6.6, zw = 19.6, a0 = 0
  lathe(clad, 0, yc, [[r, CORN], [r, zw]], 6, { a0, a1: Math.PI, facet: true })
  lathe(lead, 0, yc, [[r, zw], [r - 0.4, zw + 0.3]], 6, { a0, a1: Math.PI, facet: true })
  lathe(lead, 0, yc, domeProfile(r - 0.4, zw + 0.3, 4.2, 3), 10, { smooth: true, a0, a1: Math.PI })
  for (let i = 0; i < 6; i++) {
    const t = a0 + (Math.PI * (i + 0.5)) / 6, rr = r * Math.cos(Math.PI / 12)
    panel(glaze, [rr * Math.cos(t), yc + rr * Math.sin(t), 17.2], [Math.cos(t), Math.sin(t), 0], 1.5, 2.0, true, 4)
  }
}

// Small domes at the four corners of the hall, over the galleries.
for (const sx of [-1, 1]) for (const y of [-7.6, 13.6]) {
  const x = sx * 10.6
  lathe(stone, x, y, [[2.5, CORN], [2.5, 18.0]], 8, { facet: true, phase: Math.PI / 8 })
  for (let i = 0; i < 4; i++) {
    const t = Math.PI / 8 + (Math.PI / 4) * (2 * i + (sx > 0 ? 0 : 1)), rr = 2.5 * Math.cos(Math.PI / 8)
    panel(glaze, [x + rr * Math.cos(t), y + rr * Math.sin(t), CORN + 0.3], [Math.cos(t), Math.sin(t), 0], 0.9, 1.3, true, 3)
  }
  dome(lead, x, y, 2.5, 18.0, 2.2, 8, 3, Math.PI / 8)
  alem(gilt, x, y, 20.1, 0.35)
}

// ---------------------------------------------------------------------------
// The double portico: an inner arcade of five domed bays, and the outer
// portico under a sloping lead roof between two domed end bays.

{
  const PX = 12.6, bw = (2 * PX) / 5
  box(stone, null, -PX - 0.6, -PX, PY0, HY0, 0, 9.4)
  box(stone, null, PX, PX + 0.6, PY0, HY0, 0, 9.4)
  arcade([-PX, PY0, 0], [0, -1, 0], 5, bw, 5.4, 8.0, 9.4)
  box(trim, lead, -PX - 0.6, PX + 0.6, PY0 - 0.2, HY0, 9.4, 10.0)
  for (let i = 0; i < 5; i++) {
    const x = -PX + bw * (i + 0.5), y = (PY0 + HY0) / 2
    lathe(stone, x, y, [[2.35, 10.0], [2.35, 10.6]], 8, { facet: true, phase: Math.PI / 8 })
    dome(lead, x, y, 2.35, 10.6, 2.0, 8, 3, Math.PI / 8)
    alem(gilt, x, y, 12.5, 0.3)
  }
  // Doorway in the middle bay.
  panel(trim, [0, HY0, 0], [0, -1, 0], 3.2, 6.6, true, 6)
  panel(glaze, [0, HY0, 0.4], [0, -1, 0], 1.8, 4.4, true, 6, 0.1)
  for (const x of [-7.6, -2.6, 2.6, 7.6]) if (Math.abs(x) > 3) panel(glaze, [x, HY0, 1.8], [0, -1, 0], 1.5, 2.4)

  // Outer portico: closed domed end bays, columns, a sloping roof.
  const EX = 3.2
  for (const s of [-1, 1]) {
    const x0 = s > 0 ? PX - EX : -PX - 0.6, x1 = s > 0 ? PX + 0.6 : -PX + EX
    box(stone, null, x0, x1, OY0, PY0, 0, 6.6, 0.3)
    box(trim, lead, x0 - 0.2, x1 + 0.2, OY0 - 0.2, PY0, 6.6, 7.1, 0.3)
    const cx = (x0 + x1) / 2, cy = (OY0 + PY0) / 2
    dome(lead, cx, cy, 2.7, 7.1, 2.4, 8, 3, Math.PI / 8)
    alem(gilt, cx, cy, 9.4, 0.35)
    panel(trim, [cx, OY0, 0], [0, -1, 0], 2.6, 4.8, true, 6, 0.04)
    panel(glaze, [cx, OY0, 2.0], [0, -1, 0], 1.3, 1.8, false, 6, 0.1)
  }
  const ox0 = -PX + EX, ox1 = PX - EX, ye = OY0 - 0.8, ze = 5.8, zr = 8.4
  const nr = norm([0, -(zr - ze), PY0 - ye])
  quad(lead, [ox0, ye, ze], [ox1, ye, ze], [ox1, PY0, zr], [ox0, PY0, zr], nr)
  quad(lead, [ox1, ye, ze], [ox0, ye, ze], [ox0, ye, ze - 0.35], [ox1, ye, ze - 0.35], [0, -1, 0])
  quad(lead, [ox0, ye, ze - 0.35], [ox1, ye, ze - 0.35], [ox1, PY0, zr - 0.35], [ox0, PY0, zr - 0.35], norm([0, (zr - ze), -(PY0 - ye)]))
  for (let i = 0; i <= 6; i++) {
    const x = ox0 + ((ox1 - ox0) * i) / 6
    lathe(stone, x, OY0 + 0.4, [[0.3, 0], [0.3, ze - 0.3]], 6)
  }
}

// ---------------------------------------------------------------------------
// The single minaret, at the south-west corner of the hall by the portico: one şerefe.
// Drawn about 1.5 times its real girth.

minaret(stone, trim, lead, gilt, 14.9, -8.6, { base: 17.0, baseHalf: 2.0, SR: 1.55, BR: 2.6, balconies: [31.0], shaftTop: 36.6, capTop: 43.6 })

// ---------------------------------------------------------------------------

const lit = (base: number) => (p: V3, n: V3): number => (n[2] > 0.85 ? 0.4 : 1) * base * (p[2] > 37 ? 0.85 : 1)
const parts = [
  { part: stone, material: { ...finish('limestone', 0xe4e0d5), floodlight: lit(0.9) } },
  { part: trim, material: { ...PALETTE.trim, color: 0xf1ede3, floodlight: lit(0.9) } },
  { part: lead, material: { ...PALETTE.roof, color: 0xa7b1bc, floodlight: lit(0.75) } },
  { part: clad, material: { ...finish('lead-cladding', 0x8d97a2), floodlight: lit(0.7) } },
  { part: glaze, material: PALETTE.window },
  { part: gilt, material: finish('gilt', 0xcaa452, 0.5) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name, part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Kılıç Ali Pasha Mosque', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 131, osm: 'way/165574748', height: 45.6,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/istanbul-kilic-ali-pasha-mosque.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
