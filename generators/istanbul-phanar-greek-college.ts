/**
 * Phanar Greek Orthodox College ("the Red Castle"), Fener, Istanbul
 * (Konstantinos Dimadis, 1881-83): procedural, CC0-1.0.
 * bun generators/istanbul-phanar-greek-college.ts
 *
 * A long battlemented red-brick range on the hillside above the Golden
 * Horn, with the domed octagonal tower (the "observatory") behind a taller
 * central pavilion, and turreted end pavilions.
 *
 * Frame: placed at bearing 40, so +y faces the Golden Horn (north-east,
 * downhill) and +x runs along the front toward the south-east. Origin: the
 * centroid of the OSM outline (way/330352317). That outline is crude (26
 * nodes, irregular back); the model takes its extent (63 m along the front,
 * about 20 m deep, the central projection 12 m wide to 14 m out) and draws a
 * symmetric range about the tower's axis (x = 1.5), as every front photo
 * shows. Behind, the real building has wings OSM barely draws; they are
 * not modelled.
 *
 * Ground: a steep hillside. y = 0 is the downhill front street level; the
 * back walls run down into the hill (STYLE.md "Ground"); window detail on
 * the back starts at 5.9 m. Mapterhorn has no z15 terrain here (404), so
 * `terrain.ts check` could not run. Elevation 0.
 *
 * Heights: OSM height 40 (taken as the spike over the lantern), 6 levels.
 * Estimated from the near-level view from the Golden Horn ("2025-03-13
 * 09.59.58", 18.1 px/m on a 4x crop, scaled by OSM's 63 m front): front
 * cornice 21.4 m, end pavilions 22.2, central pavilion 22.6 with its crest
 * to 24.8, tower walls to 30.0 under a corbelled crown with merlons, dome
 * to 34.6, lantern to 38, spike to 40. Tower 12.4 m across the flats
 * (photo, against the 12 m central pavilion), octagonal ("Phanar Greek
 * Orthodox college", Canercangul). Low hipped tile roofs behind the
 * battlements ("Fener Rum Erkek Lisesi", Ykarabulak, from afar).
 *
 * Simplified: the polychrome brick patterns, string courses and pilaster
 * strips (a few kept), the inscriptions and the clock's detail; windows are
 * one panel per window column per storey group.
 *
 * Night: floodlit (the night view from the Horn); brick and trim carry a
 * `_FLOODLIGHT` wash, windows glow.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - "Fener Rum Erkek Lisesi 2025-03-13 09.59.58 1793127025.jpg", Mary Mavier, CC BY-SA 4.0 (from the Golden Horn, north-east; main ruler)
 * - "Phanar Greek Orthodox college from Halic.jpg", Canercangul, CC BY-SA 4.0 (north-east)
 * - "Phanar Greek Orthodox college.jpg", Canercangul, CC BY-SA 4.0 (the dome tower)
 * - "20111225 Phanar Greek Orthodox College Fenar Istanbul Turkey Panoramic.jpg", User:Ggia, CC BY-SA 3.0 (from below)
 * - "Fener Rum Erkek Lisesi 2018-08-23 14.40.37 1791800411.jpg", Antonina Vyshnevska, CC BY-SA 4.0 (from the hill, west)
 * - "Fener Rum Erkek Lisesi.jpg", Ykarabulak, CC BY-SA 4.0 (far, roofs)
 * Look-only: none.
 *
 * Doubts: the plan (OSM outline is rough; no aerial); the back and the
 * hillside ground; the roofs behind the battlements; heights are photo
 * estimates against OSM's 40 m.
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

const brick = new Part() // red brick walls
const trim = new Part() // the pale terracotta corbel bands, string courses, frames
const tile = new Part() // hipped tile roofs behind the battlements
const lead = new Part() // the dome and lantern roof
const glaze = new Part() // windows

/** A run of merlons along a wall top from a to b (outer face toward n). */
function merlons(a: [number, number], b: [number, number], z: number, h = 1.1, step = 2.0, w = 0.85, d = 0.6) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.round(L / step))
  const u: [number, number] = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  for (let i = 0; i <= k; i++) {
    const s = (L * i) / k, x = a[0] + u[0] * s, y = a[1] + u[1] * s
    obox(brick, brick, x, y, u, w / 2, d / 2, z, z + h)
  }
}
/** A parapet ring of merlons round an axis-aligned rectangle, set in by `inset`. */
function battlements(x0: number, x1: number, y0: number, y1: number, z: number, inset = 0.3, h = 1.1) {
  const a = x0 + inset, b = x1 - inset, c = y0 + inset, d = y1 - inset
  merlons([a, c], [b, c], z, h)
  merlons([b, c], [b, d], z, h)
  merlons([b, d], [a, d], z, h)
  merlons([a, d], [a, c], z, h)
}
/** A block: brick walls, a corbelled band near the top, a flat top. */
function block(x0: number, x1: number, y0: number, y1: number, top: number, band = true) {
  box(brick, brick, x0, x1, y0, y1, 0, top, 0.3)
  if (band) box(trim, null, x0 - 0.45, x1 + 0.45, y0 - 0.45, y1 + 0.45, top - 1.3, top - 0.3, 0.3)
  box(trim, null, x0 - 0.15, x1 + 0.15, y0 - 0.15, y1 + 0.15, 5.2, 5.6, 0.3)
}

// ---------------------------------------------------------------------------
// Dimensions (metres). Frame: +y toward the Golden Horn (north-east, the
// downhill front), +x along the front toward the south-east. The design is
// symmetric about x = XC, the dome tower's axis.

const XC = 1.5
const HALF = 31.0 // half length of the front
const YF = 9.5, YB = -10.0 // front and back walls of the main range
const TOP = 21.4 // main cornice
const END = 10.0 // end pavilion width
const PT = 22.2 // end pavilions' cornice
const CW = 6.0, CYF = 13.6, CT = 22.6 // central pavilion: half width, front, cornice
const TR = 6.7, TY = 3.6, TT = 30.0 // dome tower: circumradius (12.4 m across flats), centre, wall top

// The main range between the pavilions.
for (const s of [-1, 1]) {
  const xa = XC + s * CW, xb = XC + s * (HALF - END)
  block(Math.min(xa, xb), Math.max(xa, xb), YB, YF, TOP)
  merlons([Math.min(xa, xb) + 0.3, YF - 0.3], [Math.max(xa, xb) - 0.3, YF - 0.3], TOP, 1.0)
  merlons([Math.min(xa, xb) + 0.3, YB + 0.3], [Math.max(xa, xb) - 0.3, YB + 0.3], TOP, 1.0)
  hipRoof(tile, Math.min(xa, xb) + 0.6, Math.max(xa, xb) - 0.6, YB + 0.6, YF - 0.6, TOP, 2.0)
  // Front windows: two tall arched tiers and a row of small ones under the
  // corbels, in pairs between pilaster strips.
  for (const x of [8.8, 12.0, 16.2, 19.4].map((d) => XC + s * d)) {
    panel(glaze, [x, YF, 5.9], [0, 1, 0], 1.5, 4.2, true, 4)
    panel(glaze, [x, YF, 11.4], [0, 1, 0], 1.5, 4.6, true, 4)
    panel(glaze, [x, YF, 17.2], [0, 1, 0], 1.0, 1.4)
    panel(glaze, [x, YB, 5.9], [0, -1, 0], 1.5, 4.2, true, 4)
    panel(glaze, [x, YB, 11.4], [0, -1, 0], 1.5, 4.6, true, 4)
  }
  for (const d of [10.4, 17.8, 14.1]) box(trim, null, XC + s * d - 0.35, XC + s * d + 0.35, YF - 0.1, YF + 0.35, 5.6, TOP - 1.3)
}

// End pavilions: taller, projecting, with octagonal corner turrets.
for (const s of [-1, 1]) {
  const xa = XC + s * (HALF - END), xb = XC + s * HALF
  const x0 = Math.min(xa, xb), x1 = Math.max(xa, xb)
  block(x0, x1, YB - 0.8, YF + 0.8, PT)
  battlements(x0, x1, YB - 0.8, YF + 0.8, PT, 0.3, 1.1)
  hipRoof(tile, x0 + 0.7, x1 - 0.7, YB, YF, PT, 1.8)
  for (const [x, y] of [[x0, YF + 0.8], [x1, YF + 0.8], [x0, YB - 0.8], [x1, YB - 0.8]]) {
    lathe(brick, x, y, [[1.35, 0], [1.35, PT - 1.4], [1.75, PT - 0.4], [1.75, PT + 1.4], [0, PT + 1.4]], 8, { facet: true, phase: Math.PI / 8 })
    for (let i = 0; i < 8; i++) {
      const t = Math.PI / 8 + (TAU * i) / 8
      obox(brick, brick, x + 1.45 * Math.cos(t), y + 1.45 * Math.sin(t), [Math.cos(t), Math.sin(t)], 0.3, 0.38, PT + 1.4, PT + 2.4)
    }
  }
  // Front, back and end windows in groups of three and four.
  const xm = (x0 + x1) / 2
  for (const d of [-2.7, -0.9, 0.9, 2.7]) {
    for (const [y, n] of [[YF + 0.8, [0, 1, 0]], [YB - 0.8, [0, -1, 0]]] as [number, V3][]) {
      panel(glaze, [xm + d, y, 5.9], n, 1.3, 4.2, true, 4)
      panel(glaze, [xm + d, y, 11.4], n, 1.3, 4.6, true, 4)
      panel(glaze, [xm + d, y, 17.4], n, 0.9, 2.2, true, 4)
    }
  }
  const xe = s > 0 ? x1 : x0
  for (const y of [-6.4, -3.2, 0, 3.2, 6.4]) {
    panel(glaze, [xe, y, 5.9], [s, 0, 0], 1.3, 4.2, true, 4)
    panel(glaze, [xe, y, 11.4], [s, 0, 0], 1.3, 4.6, true, 4)
    panel(glaze, [xe, y, 17.4], [s, 0, 0], 0.9, 2.2, true, 4)
  }
}

// The central pavilion: three tall portals, the clock, a stepped crest.
{
  const x0 = XC - CW, x1 = XC + CW
  block(x0, x1, YF - 2, CYF, CT)
  box(brick, brick, XC - 2.8, XC + 2.8, CYF - 1.2, CYF, CT, CT + 1.8, 0.2)
  box(trim, null, XC - 3.1, XC + 3.1, CYF - 1.4, CYF + 0.25, CT + 1.8, CT + 2.2, 0.2)
  battlements(x0, x1, YF - 2, CYF, CT, 0.3, 1.1)
  for (const s of [-1, 1]) {
    // Corner piers rising above the cornice.
    box(brick, brick, XC + s * CW - 0.9, XC + s * CW + 0.9, CYF - 1.8, CYF + 0.3, 0, CT + 1.4, 0.2)
  }
  const n: V3 = [0, 1, 0]
  for (const d of [-3.0, 0, 3.0]) {
    panel(trim, [XC + d, CYF, 0.6], n, 2.4, 6.8, true, 6, 0.04)
    panel(glaze, [XC + d, CYF, 0.9], n, 1.8, 6.0, true, 6, 0.08)
    panel(glaze, [XC + d, CYF, 9.4], n, 1.5, 5.4, true, 4)
    panel(glaze, [XC + d, CYF, 16.2], n, 1.3, 3.6, true, 4)
  }
  for (const x of [XC - 1.5, XC + 1.5]) box(trim, null, x - 0.3, x + 0.3, CYF, CYF + 0.3, 5.6, CT - 1.3)
  // The clock face.
  const o: V3 = [XC, CYF + 0.08, 19.9]
  for (let i = 0; i < 12; i++) {
    const t0 = (TAU * i) / 12, t1 = (TAU * (i + 1)) / 12
    tri(trim, o, [XC + 0.9 * Math.cos(t0), CYF + 0.08, 19.9 + 0.9 * Math.sin(t0)], [XC + 0.9 * Math.cos(t1), CYF + 0.08, 19.9 + 0.9 * Math.sin(t1)], n)
  }
}

// ---------------------------------------------------------------------------
// The dome tower (the observatory): an octagon of red brick, a band of
// triple arched windows on every face, a corbelled crown with merlons, a
// grey ribbed dome and its lantern.

lathe(brick, XC, TY, [[TR, 0], [TR, TT - 1.6]], 8, { facet: true, phase: Math.PI / 8 })
lathe(trim, XC, TY, [[TR, TT - 1.6], [TR + 0.6, TT - 0.6], [TR + 0.6, TT], [TR - 0.4, TT]], 8, { facet: true, phase: Math.PI / 8 })
for (let i = 0; i < 8; i++) {
  const t = (TAU * i) / 8 + Math.PI / 8 + Math.PI / 8, u: [number, number] = [Math.cos(t), Math.sin(t)]
  const ap = TR * Math.cos(Math.PI / 8)
  const n: V3 = [u[0], u[1], 0], c: V3 = [XC + u[0] * ap, TY + u[1] * ap, 0]
  const rt = rightOf(n)
  for (const d of [-1.45, 0, 1.45]) panel(glaze, [c[0] + rt[0] * d, c[1] + rt[1] * d, 22.4], n, 1.0, 4.0, true, 4)
  panel(glaze, [c[0], c[1], 18.0], n, 2.2, 2.0, false)
  panel(trim, [c[0], c[1], 21.6], n, 4.7, 0.4, false, 4, 0.08)
  // Merlons: two per face, set on the crown.
  for (const d of [-1.3, 1.3]) {
    const m = TR * Math.cos(Math.PI / 8) + 0.3
    obox(brick, brick, XC + u[0] * m + rt[0] * d, TY + u[1] * m + rt[1] * d, [rt[0], rt[1]], 0.45, 0.3, TT, TT + 1.1)
  }
}
lathe(lead, XC, TY, [[TR - 0.5, TT], [TR - 0.9, TT + 0.3]], 16)
dome(lead, XC, TY, TR - 0.9, TT + 0.3, 4.3, 16, 5)
lathe(trim, XC, TY, [[1.15, TT + 4.2], [1.15, TT + 6.1], [1.4, TT + 6.4], [0.9, TT + 6.4]], 8, { facet: true })
dome(lead, XC, TY, 1.4, TT + 6.4, 1.2, 8, 3)
lathe(lead, XC, TY, [[0.1, TT + 7.5], [0.06, TT + 10.0], [0, TT + 10.1]], 4)

// ---------------------------------------------------------------------------

const lit = (base: number) => (p: V3, n: V3): number => (n[2] > 0.85 ? 0.4 : 1) * base
const parts = [
  { part: brick, material: { ...finish('red-brick', 0xb7614c), floodlight: lit(0.9) } },
  { part: trim, material: { ...finish('terracotta-trim', 0xd9a68c), floodlight: lit(0.9) } },
  { part: tile, material: PALETTE.terracotta },
  { part: lead, material: { ...PALETTE.roof, color: 0xa7b0b7, floodlight: lit(0.6) } },
  { part: glaze, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name, part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Phanar Greek Orthodox College', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 40, osm: 'way/330352317', height: TT + 10.1,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/istanbul-phanar-greek-college.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
