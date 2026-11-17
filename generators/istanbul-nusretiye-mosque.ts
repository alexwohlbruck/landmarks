/**
 * Nusretiye Mosque, Tophane, Istanbul (Krikor Balyan, 1823-26; Ottoman
 * Baroque): procedural, CC0-1.0.
 * bun generators/istanbul-nusretiye-mosque.ts
 *
 * A square hall under a tall single dome on a window drum ringed with gilt
 * finials, four big Baroque arched gables, domed corner turrets, a
 * half-domed apse to the qibla, two very slender minarets at the front
 * corners, the two-storey pavilions and three-arched portico of the front,
 * and the sultan's pavilion on the south-west side.
 *
 * Frame: built along the qibla axis and placed at bearing 146.3 (the
 * outline's sides), +y from the portico to the apse (south-east), +x the
 * south-west side. Origin: the centroid of the OSM outline (way/498861882);
 * the design is centred on the apse arc's centre (x = -1.6).
 *
 * Ground: level (Tophane shore). Mapterhorn has no z15 terrain here (404),
 * so `terrain.ts check` could not run. Elevation 0.
 *
 * Published (tr.wikipedia "Nusretiye Camii"): a square plan 15.5 x 15.5 m
 * (inside, drawn as a 20 m outer square); dome 15 m across, 29 m high
 * inside; two minarets with two şerefes each, very slender and fluted. The
 * lead's brief said one şerefe each; the tr.wikipedia text and every photo
 * ("Nusretiye Mosque in 2007 8489", the Cihangir overview) show two, so two
 * are drawn. Plan from OSM: the apse arc (radius 8.9), front pavilions,
 * portico recess, the sultan's pavilion (14.6 x 8.6 m) and the low north-east
 * wing.
 * Estimated from the qibla-side photo "8489" (scaled by the published dome,
 * about 14.8 px/m): apse cornice 11.8 m and half-dome to 15.8, gable
 * springing 13.4 and crowns 21.6, corner turrets to 23.7, drum 19.4-26.6,
 * dome crown 31.8, alem to 35.9; minaret şerefes at 22.7 and 29.6, shaft
 * top 35.7, cap tip 44; front pavilions 10.6 m, the sultan's pavilion 10 m.
 * Minarets 28.4 m apart, behind the outer ends of the front pavilions (the
 * overview from Cihangir shows them about 2.3 dome widths apart, the qibla
 * view 1.7); their bases stand up to 2.4 m outside the OSM outline.
 *
 * Simplified: the Baroque carving, the fluting of the minarets, the sebils
 * and muvakkithane, the courtyard. Minarets drawn about 1.5 times their real
 * girth, balconies a little wider.
 *
 * Night: floodlit; stone and lead carry a `_FLOODLIGHT` wash, windows glow.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - "Nusretiye Mosque in 2007 8489.jpg", Dosseman, CC BY-SA 4.0 (south-east, qibla side; main ruler)
 * - "Nusretiye mosque 8491.jpg", Dosseman, CC BY-SA 4.0 (south, dome and apse)
 * - "Nusretiye Mosque - March 2022.jpg", Maurice Flesier, CC BY-SA 4.0 (south-west)
 * - "Nusretiye Mosque- panoramio.jpg", Mister No, CC BY 3.0 (north-east)
 * - "07 Nusretiye Camii.jpg", Ali Osman Dilekoğlu, CC BY-SA 4.0 (front portico)
 * - "Overview of Galataport from Cihangir ... Nusretiye Mosque on right ....jpg", Ealinggirl1954, CC BY-SA 4.0 (from above, north-west)
 * Look-only: none.
 *
 * Doubts: all heights are photo estimates; the minaret positions (no OSM
 * minaret features); the extent of the side annexes and the sultan's
 * pavilion's roof.
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

const stone = new Part() // marble-faced walls, drum, turrets, minarets
const trim = new Part() // the Baroque arch mouldings, cornices, şerefe
const lead = new Part() // dome, half-dome, roofs
const glaze = new Part() // windows
const gilt = new Part() // the gilt finials round the drum, alems

/** Round arches on columns, the face toward `n`, bays to the right from `o`. */
function arcade(o: V3, n: V3, bays: number, bw: number, zs: number, zt: number, t = 0.7) {
  const u = rightOf(n), cw = 0.35, k = 4
  const P = (s: number, z: number, d = 0): V3 => [o[0] + u[0] * s - n[0] * d, o[1] + u[1] * s - n[1] * d, z]
  for (let b = 0; b < bays; b++) {
    const s0 = b * bw, s1 = s0 + bw, a = (bw - 2 * cw) / 2, sc = s0 + bw / 2
    const arc: [number, number][] = []
    for (let i = 0; i <= 2 * k; i++) {
      const th = Math.PI - (Math.PI * i) / (2 * k)
      arc.push([sc + a * Math.cos(th), zs + a * Math.sin(th)])
    }
    const TL = P(s0, zt), TR = P(s1, zt)
    tri(stone, TL, P(s0, zs), P(arc[0][0], arc[0][1]), n)
    for (let i = 0; i < k; i++) tri(stone, TL, P(arc[i][0], arc[i][1]), P(arc[i + 1][0], arc[i + 1][1]), n)
    tri(stone, TL, P(arc[k][0], arc[k][1]), TR, n)
    for (let i = k; i < 2 * k; i++) tri(stone, TR, P(arc[i][0], arc[i][1]), P(arc[i + 1][0], arc[i + 1][1]), n)
    tri(stone, TR, P(arc[2 * k][0], arc[2 * k][1]), P(s1, zs), n)
    for (let i = 0; i < 2 * k; i++) {
      const q0 = arc[i], q1 = arc[i + 1]
      const nrm = (q: [number, number]): V3 => { const ds = sc - q[0], dz = zs - q[1], l = Math.hypot(ds, dz); return norm([u[0] * ds / l, u[1] * ds / l, dz / l]) }
      quad(stone, P(q0[0], q0[1]), P(q1[0], q1[1]), P(q1[0], q1[1], t), P(q0[0], q0[1], t), [nrm(q0), nrm(q1), nrm(q1), nrm(q0)])
    }
  }
  for (let b = 0; b <= bays; b++) {
    const c = P(b * bw, 0, t / 2)
    lathe(stone, c[0], c[1], [[0.32, 0], [0.32, zs]], 8)
  }
}

// ---------------------------------------------------------------------------
// Dimensions (metres). Frame: +y along the qibla axis (south-east), +x the
// south-west side. C is the hall's axis (OSM's apse centre).

const C = -1.6
const H = 10.0 // half-size of the square hall (15.5 m inside, published)
const HY0 = -11.4, HY1 = 8.6, YC = (HY0 + HY1) / 2
const SPR = 13.4 // springing of the four arched gables
const GR = 8.2 // their radius (crown 21.6)
const DRUM_R = 8.2, DRUM0 = 19.4, LIP = 26.6, DOME_R = 7.9, CROWN = 31.8
const LOW = 11.8 // cornice of the apse, side annexes

// ---------------------------------------------------------------------------
// The square hall, its four arched gables with Baroque mouldings.

box(stone, null, C - H, C + H, HY0, HY1, 0, SPR)
box(stone, lead, C - H + 1.2, C + H - 1.2, HY0 + 1.2, HY1 - 1.2, SPR, DRUM0)
const faces: { c: V3; n: V3 }[] = [
  { c: [C, HY0, SPR], n: [0, -1, 0] }, { c: [C, HY1, SPR], n: [0, 1, 0] },
  { c: [C - H, YC, SPR], n: [-1, 0, 0] }, { c: [C + H, YC, SPR], n: [1, 0, 0] },
]
for (const { c, n } of faces) {
  const u = rightOf(n), seg = 12, th = 1.2
  const P = (t: number, r: number, d: number): V3 => [c[0] + u[0] * r * Math.cos(t) - n[0] * d, c[1] + u[1] * r * Math.cos(t) - n[1] * d, c[2] + r * Math.sin(t)]
  // The gable: a half disc, 1.2 m thick, its rim leaded.
  for (let i = 0; i < seg; i++) {
    const t0 = (Math.PI * i) / seg, t1 = (Math.PI * (i + 1)) / seg, tm = (t0 + t1) / 2
    tri(stone, P(0, 0, 0), P(t0, GR, 0), P(t1, GR, 0), n)
    tri(stone, P(0, 0, th), P(t1, GR, th), P(t0, GR, th), [-n[0], -n[1], 0])
    quad(lead, P(t0, GR, 0), P(t0, GR, th), P(t1, GR, th), P(t1, GR, 0), norm([u[0] * Math.cos(tm), u[1] * Math.cos(tm), Math.sin(tm)]))
  }
  archBand(trim, c, n, GR - 1.0, 0.9, 0.35, seg)
  // Windows in the gable and in the wall below it.
  for (const d of [-3.3, 0, 3.3]) panel(glaze, add(c, [u[0] * d, u[1] * d, d === 0 ? 1.8 : 1.0] as V3), n, 1.5, d === 0 ? 3.0 : 2.6, true, 4)
  for (const d of [-2.4, 2.4]) panel(glaze, add(c, [u[0] * d, u[1] * d, -4.9] as V3), n, 1.7, 3.2, true, 4)
  panel(glaze, add(c, [0, 0, -5.1]), n, 1.8, 3.6, true, 4)
}

// Corner turrets: octagonal, open little lanterns with domed caps.
for (const sx of [-1, 1]) for (const y of [HY0, HY1]) {
  const x = C + sx * H
  lathe(stone, x, y, [[2.3, 0], [2.3, 18.6], [2.6, 18.9], [2.6, 19.3], [2.0, 19.3]], 8, { facet: true, phase: Math.PI / 8 })
  for (let i = 0; i < 8; i++) {
    const t = Math.PI / 8 + (TAU * i) / 8, u: [number, number] = [Math.cos(t), Math.sin(t)]
    obox(stone, null, x + u[0] * 1.75, y + u[1] * 1.75, u, 0.25, 0.3, 19.3, 21.6)
  }
  lathe(trim, x, y, [[2.2, 21.6], [2.5, 22.0], [2.0, 22.0]], 8, { facet: true, phase: Math.PI / 8 })
  lathe(stone, x, y, [[1.25, 19.3], [1.25, 21.6]], 8, { facet: true, phase: Math.PI / 8 })
  dome(lead, x, y, 2.0, 22.0, 1.9, 8, 3, Math.PI / 8)
  alem(gilt, x, y, 23.7, 0.4)
}

// The drum: windows between buttress piers, each pier topped by a gilt
// finial at the dome's foot (the mosque's signature).
lathe(stone, C, YC, [[DRUM_R, DRUM0], [DRUM_R, LIP]], 16, { facet: true })
for (let i = 0; i < 16; i++) {
  const t = (TAU * i) / 16, u: [number, number] = [Math.cos(t), Math.sin(t)]
  const px = C + u[0] * (DRUM_R + 0.4), py = YC + u[1] * (DRUM_R + 0.4)
  obox(stone, trim, px, py, u, 0.5, 0.4, DRUM0, LIP + 0.6)
  lathe(gilt, px, py, [[0.3, LIP + 0.6], [0.5, LIP + 1.0], [0.3, LIP + 1.5], [0.12, LIP + 2.0], [0, LIP + 2.3]], 6, { smooth: true })
  const tm = t + Math.PI / 16, r = DRUM_R * Math.cos(Math.PI / 16)
  panel(glaze, [C + Math.cos(tm) * r, YC + Math.sin(tm) * r, 22.6], [Math.cos(tm), Math.sin(tm), 0], 1.7, 3.2, true, 4)
}
lathe(trim, C, YC, [[DRUM_R + 0.3, LIP], [DRUM_R + 0.3, LIP + 0.5], [DOME_R, LIP + 0.5]], 24)
dome(lead, C, YC, DOME_R, LIP + 0.5, CROWN - LIP - 0.5, 24, 6)
alem(gilt, C, YC, CROWN - 0.2, 1.0)

// ---------------------------------------------------------------------------
// The qibla apse: half-round walls on the OSM arc, a lead half-dome.

{
  const ya = 11.45, ra = 8.9
  box(stone, null, C - ra, C + ra, HY1 - 0.2, ya, 0, LOW)
  lathe(stone, C, ya, [[ra, 0], [ra, LOW]], 8, { a0: 0, a1: Math.PI, facet: true })
  box(trim, lead, C - ra - 0.3, C + ra + 0.3, HY1 - 0.2, ya, LOW, LOW + 0.6)
  lathe(trim, C, ya, [[ra, LOW], [ra + 0.3, LOW], [ra + 0.3, LOW + 0.6], [7.0, LOW + 0.6]], 8, { a0: 0, a1: Math.PI, facet: true })
  lathe(lead, C, ya - 0.8, domeProfile(7.0, LOW + 0.6, 3.4, 4), 10, { smooth: true, a0: 0, a1: Math.PI })
  quad(lead, [C - 7.0, ya - 0.8, LOW + 0.6], [C + 7.0, ya - 0.8, LOW + 0.6], [C + 7.0, ya, LOW + 0.6], [C - 7.0, ya, LOW + 0.6], Z)
  for (let i = 0; i < 8; i++) {
    const t = (Math.PI * (i + 0.5)) / 8, rr = ra * Math.cos(Math.PI / 16)
    const at = (z: number): V3 => [C + rr * Math.cos(t), ya + rr * Math.sin(t), z]
    panel(glaze, at(2.4), [Math.cos(t), Math.sin(t), 0], 1.5, 2.6, true, 4)
    panel(glaze, at(6.8), [Math.cos(t), Math.sin(t), 0], 1.5, 2.8, true, 4)
  }
}

// Lower side annexes along both lateral walls.
for (const s of [-1, 1]) {
  const x0 = s > 0 ? C + H : C - H - 3.65, x1 = s > 0 ? C + H + 3.65 : C - H
  box(stone, null, x0, x1, HY0 + 2.3, HY1 - 2.3, 0, LOW - 1.0)
  box(trim, lead, x0 - 0.2, x1 + 0.2, HY0 + 2.1, HY1 - 2.1, LOW - 1.0, LOW - 0.4)
  for (const y of [-6.0, -1.4, 3.2]) {
    panel(glaze, [s > 0 ? x1 : x0, y, 1.8], [s, 0, 0], 1.6, 2.6, true, 4)
    panel(glaze, [s > 0 ? x1 : x0, y, 6.0], [s, 0, 0], 1.6, 2.6, true, 4)
  }
}

// ---------------------------------------------------------------------------
// The front: two-storey pavilions either side of a three-arched portico.

const FY0 = -16.5
for (const s of [-1, 1]) {
  const x0 = s > 0 ? C + 6.5 : C - 13.65, x1 = s > 0 ? C + 13.65 : C - 6.5
  box(stone, null, x0, x1, FY0, HY0 + 0.2, 0, 10.6, 0.3)
  box(trim, null, x0 - 0.25, x1 + 0.25, FY0 - 0.25, HY0 + 0.2, 10.6, 11.1)
  hipRoof(lead, x0 - 0.25, x1 + 0.25, FY0 - 0.25, HY0 + 0.2, 11.1, 2.0)
  const xm = (x0 + x1) / 2
  for (const d of [-2.2, 0, 2.2]) {
    panel(glaze, [xm + d, FY0, 1.4], [0, -1, 0], 1.6, 3.8, true, 4)
    panel(glaze, [xm + d, FY0, 6.6], [0, -1, 0], 1.4, 2.6)
  }
  const xo = s > 0 ? x1 : x0
  for (const y of [-14.9, -12.9]) panel(glaze, [xo, y, 6.6], [s, 0, 0], 1.2, 2.6)
}
arcade([C - 6.5, FY0, 0], [0, -1, 0], 3, 13 / 3, 6.4, 10.0)
box(trim, lead, C - 6.5, C + 6.5, FY0, HY0, 10.0, 10.6)
panel(trim, [C, HY0, 0], [0, -1, 0], 3.4, 7.2, true, 6)
panel(glaze, [C, HY0, 0.4], [0, -1, 0], 2.1, 4.4, true, 6, 0.1)

// The sultan's pavilion on the south-west side and the low wing opposite.
box(stone, null, 12.05, 26.7, -7.1, 1.5, 0, 10.0, 0.3)
box(trim, null, 11.8, 26.95, -7.35, 1.75, 10.0, 10.5)
hipRoof(lead, 11.8, 26.95, -7.35, 1.75, 10.5, 2.2)
for (const y of [-4.6, -1.1]) for (const z of [1.4, 6.0]) panel(glaze, [26.7, y, z], [1, 0, 0], 1.6, z < 2 ? 3.6 : 2.6, z < 2, 4)
for (const x of [15.0, 18.4, 21.8, 25.0]) {
  panel(glaze, [x, -7.1, 1.4], [0, -1, 0], 1.8, 3.6, true, 4)
  panel(glaze, [x, -7.1, 6.0], [0, -1, 0], 1.4, 2.6)
  panel(glaze, [x, 1.5, 6.0], [0, 1, 0], 1.4, 2.6)
}
box(stone, lead, -19.97, C - H - 3.6, -11.7, 1.8, 0, 7.0, 0.3)

// ---------------------------------------------------------------------------
// Two very slender minarets at the front corners, two şerefes each.
// Drawn about 1.5 times their real girth.

for (const s of [-1, 1]) minaret(stone, trim, lead, gilt, C + s * 14.2, -13.2, { base: 11.6, baseHalf: 1.5, SR: 1.15, BR: 1.85, balconies: [22.7, 29.6], shaftTop: 35.7, capTop: 44.0, topR: 1.0 })

// ---------------------------------------------------------------------------

const lit = (base: number) => (p: V3, n: V3): number => (n[2] > 0.85 ? 0.4 : 1) * base * (p[2] > 36 ? 0.85 : 1)
const parts = [
  { part: stone, material: { ...finish('marble', 0xe3e0d7), floodlight: lit(0.9) } },
  { part: trim, material: { ...PALETTE.trim, color: 0xf3efe6, floodlight: lit(0.9) } },
  { part: lead, material: { ...PALETTE.roof, color: 0xa9b3bd, floodlight: lit(0.75) } },
  { part: glaze, material: PALETTE.window },
  { part: gilt, material: finish('gilt', 0xcaa452, 0.5) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name, part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Nusretiye Mosque', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 146.3, osm: 'way/498861882', height: 46,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/istanbul-nusretiye-mosque.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
