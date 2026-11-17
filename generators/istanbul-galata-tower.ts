/**
 * Galata Tower, Istanbul (Genoese, 1348; upper storeys and cap rebuilt
 * 1832 and 1965-67; restored 2020 and 2023): procedural, CC0-1.0.
 * bun generators/istanbul-galata-tower.ts
 *
 * Frame: a round tower, built at bearing 0 (+y north, +x east). Origin: the
 * centroid of the OSM outline (way/23236783, a 17.3 m circle).
 *
 * Ground: the tower stands on a terraced hilltop at about 35 m; the street
 * falls steeply on the south-west, below a retaining wall (photo "Galata
 * Kulesi Museum"). Published heights are from the entrance level; the shaft
 * is drawn 2.0 m deeper (G, estimated) so the downhill foot is not left
 * floating. Mapterhorn has no z15 terrain here (404), so `terrain.ts check`
 * could not run. Elevation 0.
 *
 * Published (en/tr.wikipedia "Galata Tower" / "Galata Kulesi", citing
 * Anadol and Sağlam): 62.59 m from the ground to the tip of the roof; outer
 * diameter 16.45 m at the base (inner 8.95, walls 3.75 m), the wall battered
 * outward; brick bands at 13.20 and 17.17 m; a conical lead-clad roof with
 * four dormer windows at the cardinal points, their tops at 50.29 m; a gilt
 * bronze finial 6.75-7.41 m tall. OSM: height 62.59, roof:height 10.94 (not
 * used: the level photo shows a much taller cone).
 * Measured from the near-level telephoto "Istanbul Galata Tower IMG 8211"
 * (scaled by the finial and the published diameter, about 21.5 px/m on a 3x
 * crop): main cornice 32.1-33.5 m, arcade storey to 40.1, balcony ring
 * 9.35 m radius, top storey radius 7.45 to 45.3, cone base radius 5.6.
 * Estimated: the shaft radius at the cornice (7.85), fourteen niches in the
 * arcade storey (from the arch spacing in two photos), their depth, window
 * counts and sizes; dormers placed a little higher than published to match
 * the photo.
 *
 * Simplified: the iron railing of the balcony is drawn as a thin solid band
 * (it reads as a dark ring of railing and visitors in every photo); the
 * pilasters of the top storey, the time-ball mast and lantern, the entrance
 * and its plaque are left out. Finial drawn a little bolder than real.
 *
 * Colours: rubble shaft from the 2023 daylight photos (warm grey-buff),
 * the upper storeys pale limestone after the 2020 restoration, the cap blue-grey lead
 * ("Galata Kulesi 2026"), brick-red niche heads.
 *
 * Night: the tower is floodlit warm; stone carries a `_FLOODLIGHT` wash,
 * the niche and top-storey windows glow.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - "Istanbul Galata Tower IMG 8211 1920.jpg", Alexxx1979, CC BY-SA 4.0 (from the old city, south-west, level; main ruler)
 * - "Galata tower 01 23.jpg", GrandEscogriffe, CC BY-SA 4.0 (south, 2023)
 * - "Galata Kulesi - 01.jpg", Carlos Delgado, CC BY-SA 3.0 (close, upper storeys)
 * - "Galata Kulesi (07052023).jpg", HuseynAZE99, CC BY-SA 4.0 (2023, cap colour)
 * - "Galata Kulesi Museum.jpg", Thehiddenphotographer, CC BY-SA 4.0 (below the retaining wall)
 * - "Galata Kulesi 2026.jpg", Chromehoney, CC BY-SA 4.0 (from the Golden Horn, cap colour)
 * Look-only: none.
 *
 * Doubts: the niche count (14) is read from photos, not published; the
 * ground offset G; OSM's roof:height (10.94) disagrees with the photos and
 * was not used.
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

const rubble = new Part() // the rubble-stone shaft
const lime = new Part() // the pale limestone upper storeys and cornices
const lead = new Part() // the conical cap, dormer roofs, balcony rail
const glaze = new Part() // windows
const gilt = new Part() // the finial
const brick = new Part() // niche heads and soffits, the two brick bands

// ---------------------------------------------------------------------------
// Dimensions (metres). G is the entrance level above y = 0 (the lowest
// ground, on the downhill south-west side). Published heights are measured
// from the entrance level.

const G = 2.0
const R0 = 8.22, R1 = 7.85 // shaft radius at the foot (16.45 m published) and at the cornice
const CORN0 = G + 32.1, CORN1 = G + 33.5 // main cornice
const ARC_TOP = G + 40.1 // arcade storey top, balcony floor
const BAL_R = 9.35 // balcony edge
const DRUM_R = 7.45, DRUM_TOP = G + 45.3 // top storey behind the balcony
const CAP_R = 5.6, CAP_TOP = G + 62.59 // cone base and tip (published 62.59 m)
const N = 28 // segments round the tower; 14 bays of 2

// ---------------------------------------------------------------------------
// Shaft, with its slight batter; the two brick bands (published at 13.20 m
// and 17.17 m).

lathe(rubble, 0, 0, [[R0, 0], [R1, CORN0]], N)
const rAt = (z: number) => R0 + ((R1 - R0) * z) / CORN0
for (const zb of [G + 13.2, G + 17.17]) lathe(brick, 0, 0, [[rAt(zb) + 0.04, zb], [rAt(zb + 0.45) + 0.04, zb + 0.45]], N)

// Small arched windows high on the shaft: a ring of six and four larger
// ones below, as in the photos.
for (let i = 0; i < 6; i++) {
  const t = (TAU * (i + 0.3)) / 6, z = G + 28.3, r = rAt(z) * Math.cos(Math.PI / N)
  panel(glaze, [r * Math.cos(t), r * Math.sin(t), z], [Math.cos(t), Math.sin(t), 0], 0.9, 1.7, true, 4)
}
for (let i = 0; i < 4; i++) {
  const t = (TAU * (i + 0.75)) / 4, z = G + 24.6, r = rAt(z) * Math.cos(Math.PI / N)
  panel(glaze, [r * Math.cos(t), r * Math.sin(t), z], [Math.cos(t), Math.sin(t), 0], 1.3, 2.3, true, 4)
}

// Main cornice: a bold corbelled ring.
lathe(lime, 0, 0, [[R1, CORN0 - 0.6], [R1 + 0.35, CORN0], [R1 + 0.75, CORN0 + 0.7], [R1 + 0.8, CORN1], [7.95, CORN1]], N)

// ---------------------------------------------------------------------------
// The arcade storey: fourteen deep round-arched niches between piers, each
// with a window at the back (brick arch heads, as in the photos).

const AR = 7.95, AD = 0.95 // outer face radius, niche depth
const BAYS = 14, BW = (TAU * AR) / BAYS // bay width along the face
const HALF = 1.42 // niche half width; piers are BW - 2 HALF wide
const ZS = ARC_TOP - 1.5 - HALF // springing of the niche arches
const ZB = CORN1 // niche floor
{
  // Point on the face: s along the arc from the bay centre, z, depth d.
  const P = (tc: number, s: number, z: number, d = 0): V3 => {
    const t = tc + s / AR, r = AR - d
    return [r * Math.cos(t), r * Math.sin(t), z]
  }
  const nO = (tc: number, s: number): V3 => { const t = tc + s / AR; return [Math.cos(t), Math.sin(t), 0] }
  const K = 5
  for (let b = 0; b < BAYS; b++) {
    const tc = (TAU * (b + 0.5)) / BAYS
    const sL = -BW / 2, sR = BW / 2
    // Piers, full height, in two strips each.
    for (const [a, c] of [[sL, -HALF], [HALF, sR]]) {
      quad(lime, P(tc, a, ZB), P(tc, c, ZB), P(tc, c, ARC_TOP), P(tc, a, ARC_TOP), [nO(tc, a), nO(tc, c), nO(tc, c), nO(tc, a)])
    }
    // Spandrel over the arch, fanned from the two top corners.
    const arc: [number, number][] = []
    for (let i = 0; i <= K * 2; i++) {
      const th = Math.PI - (Math.PI * i) / (K * 2)
      arc.push([HALF * Math.cos(th), ZS + HALF * Math.sin(th)])
    }
    const TL = P(tc, -HALF, ARC_TOP), TR = P(tc, HALF, ARC_TOP)
    for (let i = 0; i < K; i++) tri(lime, TL, P(tc, arc[i][0], arc[i][1]), P(tc, arc[i + 1][0], arc[i + 1][1]), nO(tc, 0))
    tri(lime, TL, P(tc, arc[K][0], arc[K][1]), TR, nO(tc, 0))
    for (let i = K; i < 2 * K; i++) tri(lime, TR, P(tc, arc[i][0], arc[i][1]), P(tc, arc[i + 1][0], arc[i + 1][1]), nO(tc, 0))
    // Soffit of the arch (brick) and the jambs (stone).
    for (let i = 0; i < 2 * K; i++) {
      const [s0, z0] = arc[i], [s1, z1] = arc[i + 1]
      const nm = (s: number, z: number): V3 => {
        const o = nO(tc, s), l = Math.hypot(s, z - ZS) || 1
        const tg: V3 = [-Math.sin(tc + s / AR), Math.cos(tc + s / AR), 0]
        return norm([-tg[0] * s / l, -tg[1] * s / l, -(z - ZS) / l])
      }
      quad(brick, P(tc, s0, z0), P(tc, s1, z1), P(tc, s1, z1, AD), P(tc, s0, z0, AD), [nm(s0, z0), nm(s1, z1), nm(s1, z1), nm(s0, z0)])
    }
    for (const s of [-HALF, HALF]) {
      const tg: V3 = [-Math.sin(tc + s / AR), Math.cos(tc + s / AR), 0]
      const n: V3 = s < 0 ? tg : [-tg[0], -tg[1], 0]
      quad(lime, P(tc, s, ZB), P(tc, s, ZB, AD), P(tc, s, ZS, AD), P(tc, s, ZS), n)
    }
    // Niche back: stone below the springing, a brick half-disc above.
    const nb = nO(tc, 0)
    quad(lime, P(tc, -HALF, ZB, AD), P(tc, HALF, ZB, AD), P(tc, HALF, ZS, AD), P(tc, -HALF, ZS, AD), nb)
    for (let i = 0; i < 2 * K; i++) tri(brick, P(tc, 0, ZS, AD), P(tc, arc[i][0], arc[i][1], AD), P(tc, arc[i + 1][0], arc[i + 1][1], AD), nb)
    // The window in the niche.
    const pc = P(tc, 0, ZB + 0.5, AD)
    panel(glaze, pc, nb, 1.35, ZS - ZB + 0.35, true, 5)
    // Floor of the niche.
    quad(lime, P(tc, -HALF, ZB), P(tc, -HALF, ZB, AD), P(tc, HALF, ZB, AD), P(tc, HALF, ZB), Z)
  }
}

// ---------------------------------------------------------------------------
// The balcony: a broad corbelled ring, a lead-grey rail on posts.

lathe(lime, 0, 0, [[AR, ARC_TOP - 0.7], [AR + 0.5, ARC_TOP - 0.3], [BAL_R, ARC_TOP + 0.15], [BAL_R, ARC_TOP + 0.7], [DRUM_R, ARC_TOP + 0.7]], N)
const RAIL = ARC_TOP + 0.7 + 1.15
// The iron railing, crowded with visitors: drawn as a thin dark band so it
// holds at phone size, with a rail on top.
lathe(lead, 0, 0, [[BAL_R - 0.12, ARC_TOP + 0.7], [BAL_R - 0.12, RAIL], [BAL_R - 0.2, RAIL], [BAL_R - 0.2, ARC_TOP + 0.7]], N)

// ---------------------------------------------------------------------------
// The top storey behind the balcony, its small windows and the eave.

lathe(lime, 0, 0, [[DRUM_R, ARC_TOP + 0.7], [DRUM_R, DRUM_TOP - 0.5]], N)
for (let i = 0; i < 14; i++) {
  const t = (TAU * (i + 0.5)) / 14, r = DRUM_R * Math.cos(Math.PI / N)
  panel(glaze, [r * Math.cos(t), r * Math.sin(t), ARC_TOP + 1.5], [Math.cos(t), Math.sin(t), 0], 1.0, 1.9, true, 4)
}
lathe(lime, 0, 0, [[DRUM_R, DRUM_TOP - 0.5], [DRUM_R + 0.55, DRUM_TOP], [DRUM_R + 0.55, DRUM_TOP + 0.4], [CAP_R + 0.35, DRUM_TOP + 0.4]], N)

// ---------------------------------------------------------------------------
// The cap: a tall lead cone with a slight bell at its foot, four dormers at
// the cardinal points (tops published at 50.29 m), and the gilt finial
// (published 6.75-7.41 m), drawn a little bolder than real.

const CZ = DRUM_TOP + 0.4
lathe(lead, 0, 0, [[CAP_R + 0.3, CZ], [CAP_R, CZ + 0.5], [CAP_R * 0.62, CZ + 0.5 + 0.38 * (CAP_TOP - CZ - 0.5)], [0.3, CAP_TOP - 0.2], [0, CAP_TOP]], N, { smooth: false })
const coneR = (z: number) => {
  const z1 = CZ + 0.5, z2 = CZ + 0.5 + 0.38 * (CAP_TOP - CZ - 0.5)
  return z < z2 ? CAP_R + ((CAP_R * 0.62 - CAP_R) * (z - z1)) / (z2 - z1) : CAP_R * 0.62 * (1 - (z - z2) / (CAP_TOP - z2))
}
for (let i = 0; i < 4; i++) {
  // Cardinal points in the map frame: +y north, +x east.
  const t = (Math.PI / 2) * i, u: [number, number] = [Math.cos(t), Math.sin(t)]
  const zb = G + 48.6, zt = G + 50.9, hw = 0.6, rf = coneR(zb) + 0.35, rb = coneR(zt + 0.9) - 0.2
  const v: [number, number] = [-u[1], u[0]]
  const at = (r: number, s: number, z: number): V3 => [u[0] * r + v[0] * s, u[1] * r + v[1] * s, z]
  const nf: V3 = [u[0], u[1], 0]
  quad(lime, at(rf, -hw, zb), at(rf, hw, zb), at(rf, hw, zt), at(rf, -hw, zt), nf)
  tri(lime, at(rf, -hw, zt), at(rf, hw, zt), at(rf, 0, zt + 0.6), nf)
  for (const s of [-1, 1]) {
    quad(lime, at(rb, s * hw, zb), at(rf, s * hw, zb), at(rf, s * hw, zt), at(rb, s * hw, zt), [v[0] * s, v[1] * s, 0])
    const rn = norm([v[0] * s * 0.6, v[1] * s * 0.6, 0.6])
    quad(lead, at(rf + 0.1, s * (hw + 0.1), zt - 0.05), at(rb, s * (hw + 0.1), zt - 0.05), at(rb, 0, zt + 0.62), at(rf + 0.1, 0, zt + 0.62), rn)
  }
  panel(glaze, at(rf, 0, zb + 0.35), nf, 0.75, 1.5, false)
}
lathe(gilt, 0, 0, [[0.32, CAP_TOP - 0.3], [0.85, CAP_TOP + 0.6], [0.9, CAP_TOP + 1.05], [0.55, CAP_TOP + 1.75], [0.3, CAP_TOP + 2.0], [0.55, CAP_TOP + 2.9], [0.32, CAP_TOP + 4.0], [0.16, CAP_TOP + 4.6], [0.1, CAP_TOP + 6.8], [0, CAP_TOP + 7.0]], 8, { smooth: true })

// ---------------------------------------------------------------------------

const lit = (base: number) => (p: V3, n: V3): number => (n[2] > 0.85 ? 0.35 : 1) * base * (p[2] > CAP_TOP - 12 ? 0.5 : 1)
const parts = [
  { part: rubble, material: { ...finish('galata-rubble', 0xcfc2ab), floodlight: lit(0.95) } },
  { part: lime, material: { ...PALETTE.trim, color: 0xeee8dc, floodlight: lit(0.95) } },
  { part: lead, material: { ...PALETTE.roof, color: 0xa1abb6 } },
  { part: glaze, material: PALETTE.window },
  { part: gilt, material: finish('gilt', 0xcaa452, 0.5) },
  { part: brick, material: finish('brick', 0xb87a62) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name, part.triangles)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Galata Tower', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 0, osm: 'way/23236783', height: CAP_TOP + 7,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/istanbul-galata-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
