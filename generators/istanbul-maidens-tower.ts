/**
 * Maiden's Tower (Kız Kulesi), Istanbul: procedural, CC0-1.0.
 *   bun generators/istanbul-maidens-tower.ts
 *
 * The 18th-century stone tower on its islet off Salacak, as restored in
 * 2021-2023: the square rubble-stone shaft with the black steel X-bracing
 * exposed by the restoration, the cantilevered balcony, the cream lantern
 * storey, the lead bell dome with its little top gallery and the flagpole;
 * the low crenellated stone hall with its red hipped roof west of the tower,
 * the white single-storey pavilion east of it, the small lighthouse at the
 * north-west corner, and the quay the whole group stands on.
 *
 * This file also exports the small geometry kit the other Istanbul Bosphorus
 * models of this builder use (Rumeli Hisarı, Anadolu Hisarı, Yedikule,
 * Kuleli, Beylerbeyi). Its own build runs only under `import.meta.main`, so
 * merge this generator before those.
 *
 * Frame: x east, y north, z up in the turned frame (bearing 351, the islet's
 * and the buildings' grid), metres; origin on the water at the centroid of
 * the attraction outline (way/103821246). Sea level is z = 0.
 *
 * Sources
 * - OSM (ODbL): the islet (way/24792159, natural=coastline place=islet), the
 *   bare-rock rim (way/1408133074), the attraction outline (way/103821246,
 *   relation/4429796, wikidata Q848397), the tower shaft (way/398210643,
 *   height 17), balcony (way/398303494, 17-18), lantern and dome
 *   (way/398219280, 16-25, dome), the stone hall (way/103821245, roof red,
 *   gabled), the west wall (way/398303919, 5), the east pavilion
 *   (way/398210642, red roof), the flagpole (node/4010729196, 25-33) and the
 *   light (node/1578813531, 7 m).
 * - Photos (all EVIDENCE):
 *   Matti Blume, "Maiden tower, Istanbul (P1100207).jpg" and "(P1100204)",
 *     CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Maiden_tower,_Istanbul_(P1100207).jpg
 *     (from the south-west, after the 2023 restoration: the main ruler).
 *   OkanKeskin, "İstanbul Kız Kulesi.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:%C4%B0stanbul_K%C4%B1z_Kulesi.jpg (from the east).
 *   HuseynAZE99, "Maiden's Tower (Istanbul) - May 22, 2023.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Maiden%27s_Tower_(Istanbul)_-_May_22,_2023.jpg
 *   muhammad ali baloch, "Kız-Kulesi-01.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:K%C4%B1z-Kulesi-01.jpg
 * - Published: tr.wikipedia "Kız Kulesi" (restoration 2021 to May 2023; 1763
 *   stone tower, 1832 rebuilding). No published height of the parts.
 *
 * Numbers
 * - Plan: OSM, measured. Bearing 351 from the tower and hall edges (8.9 deg).
 * - Quay deck 1.5 m above the water: estimated from the photos. OSM maps the
 *   islet as land (coastline/islet), so the map draws ground here; the quay
 *   is still a built revetment standing 1.5 m proud of that ground, so the
 *   model draws its walls and deck. Elevation 0.
 * - Heights, photo-scaled from Blume P1100207 with the OSM shaft width
 *   (6.4 m) as ruler, checked against OSM's 25 m dome top and 33 m flagpole:
 *   shaft to 14.6 m, balcony rail 15.7, lantern 14.6-18.9, dome 19.4-23.4,
 *   top gallery to 24.6, flagpole 32 (OSM 33). The stone hall's parapet 7.0,
 *   ridge 9.2; the east pavilion eave 5.4, ridge 7.4; the light 7 m (OSM).
 * - Colours from the daylight photos, pulled to the palette.
 *
 * Doubts
 * - OSM's 17 m for the shaft reads high against the photos (about 13 m above
 *   the quay); the photos win. The north side of the hall is seen only far
 *   off. The steel bracing is drawn bolder and simpler than real (two X per
 *   face, one band).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

// ---------------------------------------------------------------------------
// Kit. Map frame: x east, y north, z up. Faces are given outward normals;
// Part.tri winds each face to agree.

export const TAU = Math.PI * 2
export type P2 = [number, number]
export const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}
export const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]

export function tri(p: Part, a: V3, b: V3, c: V3, n: V3 | V3[]) {
  const ns = Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3]
  p.tri(a, b, c, [0, 0], [0, 0], [0, 0], ns)
}
export function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3 | V3[]) {
  const ns = Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3, n as V3]
  tri(p, a, b, c, [ns[0], ns[1], ns[2]])
  tri(p, a, c, d, [ns[0], ns[2], ns[3]])
}
/** A convex planar polygon, fanned from its first corner. */
export function face(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) tri(p, pts[0], pts[i], pts[i + 1], n)
}
const planeN = (a: V3, b: V3, c: V3): V3 => norm([
  (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]),
  (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]),
  (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])])

/**
 * The model frame for a placement: local metres (east, north) from the
 * anchor turned by the bearing, so the model's own north is `bearing`.
 */
export function frame(lng0: number, lat0: number, bearing: number) {
  const k = Math.cos((lat0 * Math.PI) / 180) * 111320, m = 111132
  const b = (bearing * Math.PI) / 180, c = Math.cos(b), s = Math.sin(b)
  const en = (e: number, n: number): P2 => [e * c - n * s, e * s + n * c]
  return { en, ll: (lng: number, lat: number): P2 => en((lng - lng0) * k, (lat - lat0) * m) }
}

/**
 * A surface of revolution about the vertical axis at (cx, cy): `prof` runs
 * bottom to top as [r, z]. `smooth` averages normals along the profile;
 * `facet` gives each segment one flat normal (a polygonal drum).
 */
export function lathe(p: Part, cx: number, cy: number, prof: [number, number][], n: number,
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
export function domeProfile(rb: number, zb: number, rise: number, rings: number): [number, number][] {
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

/**
 * A vertical prism over a convex ring (counter-clockwise from above). `z0`
 * and `z1` may be per-corner arrays, for walls on a slope.
 */
export function prism(side: Part, top: Part | null, ring: P2[], z0: number | number[], z1: number | number[], bottom = false) {
  const zb = (i: number) => (Array.isArray(z0) ? z0[i] : z0)
  const zt = (i: number) => (Array.isArray(z1) ? z1[i] : z1)
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length
    const [ax, ay] = ring[i], [bx, by] = ring[j]
    const n = norm([by - ay, -(bx - ax), 0])
    if (Math.hypot(bx - ax, by - ay) < 1e-6) continue
    quad(side, [ax, ay, zb(i)], [bx, by, zb(j)], [bx, by, zt(j)], [ax, ay, zt(i)], n)
  }
  if (top) {
    const pts = ring.map(([x, y], i) => [x, y, zt(i)] as V3)
    for (let i = 1; i < pts.length - 1; i++) {
      let n = planeN(pts[0], pts[i], pts[i + 1])
      if (n[2] < 0) n = [-n[0], -n[1], -n[2]]
      tri(top, pts[0], pts[i], pts[i + 1], n)
    }
  }
  if (bottom) face(side, ring.map(([x, y], i) => [x, y, zb(i)] as V3).reverse(), [0, 0, -1])
}
/** Chamfer the corners of a convex ring by b metres. */
export function bevel(ring: P2[], b: number): P2[] {
  if (b <= 0) return ring
  const out: P2[] = []
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], a = ring[(i + ring.length - 1) % ring.length], c = ring[(i + 1) % ring.length]
    const la = Math.hypot(a[0] - p[0], a[1] - p[1]), lc = Math.hypot(c[0] - p[0], c[1] - p[1])
    const ba = Math.min(b, la / 3), bc = Math.min(b, lc / 3)
    out.push([p[0] + ((a[0] - p[0]) * ba) / la, p[1] + ((a[1] - p[1]) * ba) / la])
    out.push([p[0] + ((c[0] - p[0]) * bc) / lc, p[1] + ((c[1] - p[1]) * bc) / lc])
  }
  return out
}
/** Offset a convex counter-clockwise ring outward by d (inward if negative). */
export function offset(ring: P2[], d: number): P2[] {
  const n = ring.length
  return ring.map((p, i) => {
    const a = ring[(i + n - 1) % n], c = ring[(i + 1) % n]
    const e1 = norm([p[0] - a[0], p[1] - a[1], 0]), e2 = norm([c[0] - p[0], c[1] - p[1], 0])
    const n1: P2 = [e1[1], -e1[0]], n2: P2 = [e2[1], -e2[0]]
    const m = norm([n1[0] + n2[0], n1[1] + n2[1], 0]), cos = m[0] * n1[0] + m[1] * n1[1]
    return [p[0] + (m[0] * d) / cos, p[1] + (m[1] * d) / cos] as P2
  })
}
/** Ear-clipping triangulation of a simple counter-clockwise ring; index triples. */
export function earcut(ring: P2[]): [number, number, number][] {
  const idx = ring.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: P2, a: P2, b: P2, c: P2) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = ring[i0], b = ring[i1], c = ring[i2]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(ring[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
/** A vertical prism over any simple ring (made counter-clockwise), heights per corner allowed. */
export function solid(side: Part, top: Part | null, ring0: P2[], z0: number | ((p: P2) => number), z1: number | ((p: P2) => number)) {
  const ring = ccw(ring0).filter((p, i, r) => Math.hypot(p[0] - r[(i + 1) % r.length][0], p[1] - r[(i + 1) % r.length][1]) > 0.05)
  const zb = ring.map((p) => (typeof z0 === 'function' ? z0(p) : z0)), zt = ring.map((p) => (typeof z1 === 'function' ? z1(p) : z1))
  prism(side, null, ring, zb, zt)
  if (top) for (const [a, b, c] of earcut(ring)) {
    const A: V3 = [ring[a][0], ring[a][1], zt[a]], B: V3 = [ring[b][0], ring[b][1], zt[b]], C: V3 = [ring[c][0], ring[c][1], zt[c]]
    let n = planeN(A, B, C); if (n[2] < 0) n = [-n[0], -n[1], -n[2]]
    tri(top, A, B, C, n)
  }
}
/** A box with chamfered vertical edges; sides to `side`, top to `top`. */
export function box(side: Part, top: Part | null, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0) {
  prism(side, top, bevel([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], b), z0, z1)
}
/** A box turned to horizontal direction u, centred on (cx, cy). */
export function obox(side: Part, top: Part | null, cx: number, cy: number, u: P2, hu: number, hv: number, z0: number | number[], z1: number | number[]) {
  const v: P2 = [-u[1], u[0]]
  const c = (su: number, sv: number): P2 => [cx + u[0] * su + v[0] * sv, cy + u[1] * su + v[1] * sv]
  prism(side, top, [c(-hu, -hv), c(hu, -hv), c(hu, hv), c(-hu, hv)], z0, z1)
}
/**
 * A straight wall from a to b, `th` thick, standing from z = 0 with its top at
 * za at a and zb at b (a slope); `ext` lengthens it past both ends to close
 * joints with the next segment.
 */
export function wall(side: Part, top: Part | null, a: P2, b: P2, th: number, za: number, zb: number, ext = 0, z0 = 0) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const v: P2 = [-u[1], u[0]], h = th / 2
  const s = (t: number) => za + ((zb - za) * (t + ext)) / (L + 2 * ext)
  const P = (t: number, w: number): P2 => [a[0] + u[0] * t + v[0] * w, a[1] + u[1] * t + v[1] * w]
  prism(side, top, [P(-ext, -h), P(L + ext, -h), P(L + ext, h), P(-ext, h)], z0, [s(-ext), s(L + ext), s(L + ext), s(-ext)])
}
/**
 * Merlons along the top of a wall from a to b: blocks `w` long, `h` tall and
 * `th` thick, every `pitch` metres, standing on a top that runs from za to
 * zb. `side` gets the faces, `cap` the tops. `face` > 0 puts them on the
 * left-hand (outer) edge of the wall instead of its middle.
 */
export function merlons(side: Part, cap: Part | null, a: P2, b: P2, za: number, zb: number, o: { w: number; h: number; th: number; pitch: number; shift?: number; end?: number }) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < o.w) return
  const u: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], v: P2 = [-u[1], u[0]]
  const n = Math.max(1, Math.floor((L - 2 * (o.end ?? 0) + o.pitch - o.w) / o.pitch))
  const span = (n - 1) * o.pitch, t0 = (L - span) / 2
  for (let i = 0; i < n; i++) {
    const t = t0 + i * o.pitch, z = za + ((zb - za) * t) / L
    const c: P2 = [a[0] + u[0] * t + v[0] * (o.shift ?? 0), a[1] + u[1] * t + v[1] * (o.shift ?? 0)]
    obox(side, cap, c[0], c[1], u, o.w / 2, o.th / 2, z - 0.3, z + o.h)
  }
}
/** Merlons round a circle of radius r at height z. */
export function ringMerlons(side: Part, cap: Part | null, cx: number, cy: number, r: number, z: number, n: number, o: { w: number; h: number; th: number; phase?: number }) {
  for (let i = 0; i < n; i++) {
    const t = (TAU * (i + 0.5)) / n + (o.phase ?? 0), u: P2 = [-Math.sin(t), Math.cos(t)]
    obox(side, cap, cx + r * Math.cos(t), cy + r * Math.sin(t), u, o.w / 2, o.th / 2, z - 0.3, z + o.h)
  }
}
/** A hipped roof over an axis-aligned rectangle, eave at z0, ridge rise h. */
export function hipRoof(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, h: number) {
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
export const rightOf = (n: V3): V3 => [-n[1], n[0], 0]
/**
 * A flat panel on a wall: centred at `at` (on the wall, at its bottom), `w`
 * wide and `h` tall, with a semicircular top when `arch`.
 */
export function panel(p: Part, at: V3, n: V3, w: number, h: number, arch = false, segs = 6, off = 0.05) {
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
/** A flat band (strip) on a wall from point a to b (both on the wall face), w wide. */
export function strip(p: Part, a: V3, b: V3, n: V3, w: number, off = 0.06) {
  const d = norm([b[0] - a[0], b[1] - a[1], b[2] - a[2]]), s: V3 = norm([n[1] * d[2] - n[2] * d[1], n[2] * d[0] - n[0] * d[2], n[0] * d[1] - n[1] * d[0]])
  const A = add(add(a, n, off), s, -w / 2), B = add(add(b, n, off), s, -w / 2), C = add(add(b, n, off), s, w / 2), D = add(add(a, n, off), s, w / 2)
  quad(p, A, B, C, D, n)
}
export const centroid = (ring: P2[]): P2 => {
  let A = 0, cx = 0, cy = 0
  for (let i = 0; i < ring.length; i++) {
    const [x0, y0] = ring[i], [x1, y1] = ring[(i + 1) % ring.length], c = x0 * y1 - x1 * y0
    A += c; cx += (x0 + x1) * c; cy += (y0 + y1) * c
  }
  return [cx / (3 * A), cy / (3 * A)]
}
/** Counter-clockwise from above. */
export const ccw = (ring: P2[]): P2[] => {
  let A = 0
  for (let i = 0; i < ring.length; i++) { const [x0, y0] = ring[i], [x1, y1] = ring[(i + 1) % ring.length]; A += x0 * y1 - x1 * y0 }
  return A < 0 ? [...ring].reverse() : ring
}

// ---------------------------------------------------------------------------
// Maiden's Tower.

function build() {
  // OSM rings in metres east/north of 29.00413, 41.02105 (geom of the ways).
  const LNG = 29.00413, LAT = 41.02105, K = Math.cos((LAT * Math.PI) / 180) * 111320
  const A0: P2 = [-1.12, 4.27] // centroid of way/103821246, the anchor
  const F = frame(LNG + A0[0] / K, LAT + A0[1] / 111132, 351)
  const R = (pts: number[][]): P2[] => ccw(pts.map(([e, n]) => F.en(e - A0[0], n - A0[1])))
  const deck = R([[-19.3, 18.8], [-18.7, -9.8], [-16.5, -12.3], [-12.7, -14.9], [20.6, -8.4], [17.9, 8.1], [16.2, 11.4], [14.2, 14.4], [8.1, 23.9], [-17.9, 20.2]])
  const shaft = R([[-7.0, 3.5], [-0.7, 4.5], [0.3, -1.5], [-6.1, -2.5]])
  const hall = R([[-16.3, 14.3], [-13.3, -3.7], [-6.1, -2.5], [-7.0, 3.5], [-0.7, 4.5], [-2.6, 16.4], [-11.4, 15.0]])
  const east = R([[-2.6, 16.4], [-0.7, 4.5], [0.3, -1.5], [7.8, -0.4], [4.5, 17.8]])
  const light0 = F.ll(29.003896, 41.021249) // node/1578813531, on the rock rim
  const light: P2 = [light0[0] + 1.6, light0[1] - 2.4] // set onto the deck corner, where the photos show it

  const stone = new Part(), cream = new Part(), lead = new Part(), tile = new Part(), glaze = new Part(), steel = new Part()
  const Q = 1.5 // quay deck

  // Quay: the revetment and deck (a built platform 1.5 m proud of the islet).
  prism(lead, lead, bevel(deck, 0.6), 0, Q)

  // Axis-aligned bounds in the turned frame.
  const bb = (r: P2[]) => ({ x0: Math.min(...r.map((p) => p[0])), x1: Math.max(...r.map((p) => p[0])), y0: Math.min(...r.map((p) => p[1])), y1: Math.max(...r.map((p) => p[1])) })
  const S = bb(shaft), H = bb(hall), E = bb(east)
  const cx = (S.x0 + S.x1) / 2, cy = (S.y0 + S.y1) / 2, hx = (S.x1 - S.x0) / 2, hy = (S.y1 - S.y0) / 2
  console.log('shaft', S, 'hall', H, 'east', E)

  // --- The tower shaft.
  const TOP = 14.6
  box(stone, null, S.x0, S.x1, S.y0, S.y1, Q - 0.1, TOP, 0.35)
  // Steel frame of the 2023 restoration: corner posts from the hall roof up,
  // a mid post, two beams, two X per face.
  const faces: { n: V3; o: (s: number, z: number) => V3; half: number }[] = [
    { n: [0, -1, 0], o: (s, z) => [cx + s, S.y0, z], half: hx },
    { n: [1, 0, 0], o: (s, z) => [S.x1, cy + s, z], half: hy },
    { n: [0, 1, 0], o: (s, z) => [cx - s, S.y1, z], half: hx },
    { n: [-1, 0, 0], o: (s, z) => [S.x0, cy - s, z], half: hy },
  ]
  const B0 = 10.0, B1 = 12.4
  for (const f of faces) {
    const h = f.half - 0.2
    for (const s of [-h, 0, h]) strip(steel, f.o(s, 7.2), f.o(s, TOP - 0.1), f.n, 0.42)
    for (const z of [B0, B1]) strip(steel, f.o(-h, z), f.o(h, z), f.n, 0.36, 0.07)
    for (const [s0, s1] of [[-h, 0], [0, h]]) {
      strip(steel, f.o(s0, B0), f.o(s1, B1), f.n, 0.24, 0.08)
      strip(steel, f.o(s1, B0), f.o(s0, B1), f.n, 0.24, 0.08)
    }
    // Small arched windows: one high on each face, a door on the south.
    panel(glaze, f.o(-1.2, 12.9), f.n, 0.7, 1.3, true, 4)
    panel(glaze, f.o(1.2, 12.9), f.n, 0.7, 1.3, true, 4)
  }
  panel(glaze, faces[0].o(1.4, Q), faces[0].n, 1.0, 2.2)

  // --- Balcony: a tapering cream corbel to an octagon, dark railing.
  const oct = (r: number): P2[] => Array.from({ length: 8 }, (_, i) => [cx + r * Math.cos((TAU * (i + 0.5)) / 8), cy + r * Math.sin((TAU * (i + 0.5)) / 8)] as P2)
  const BAL = Math.max(hx, hy) / Math.cos(Math.PI / 8) + 0.55
  lathe(cream, cx, cy, [[Math.hypot(hx, hy) * 0.98, TOP - 1.6], [BAL, TOP - 0.05], [BAL, TOP + 0.2], [BAL - 0.2, TOP + 0.2]], 8, { phase: TAU / 16, facet: true })
  lathe(steel, cx, cy, [[BAL - 0.1, TOP + 0.2], [BAL - 0.1, TOP + 1.25], [BAL - 0.22, TOP + 1.25], [BAL - 0.22, TOP + 0.2]], 8, { phase: TAU / 16, facet: true })

  // --- Lantern storey: cream octagon with pilasters, windows, cornice.
  const LR = 3.2, L1 = 18.9
  lathe(cream, cx, cy, [[LR, TOP + 0.2], [LR, L1]], 8, { phase: TAU / 16, facet: true })
  for (let i = 0; i < 8; i++) {
    const t = (TAU * i) / 8, n: V3 = [Math.cos(t), Math.sin(t), 0], r = LR * Math.cos(Math.PI / 8)
    panel(glaze, [cx + r * n[0], cy + r * n[1], TOP + 1.0], n, 1.15, 2.2)
  }
  lathe(cream, cx, cy, [[LR, L1], [LR + 0.35, L1 + 0.25], [LR + 0.35, L1 + 0.5], [LR, L1 + 0.5]], 8, { phase: TAU / 16, facet: true })
  // --- Dome: lead bell, slightly swelling, to the top gallery.
  const D0 = L1 + 0.5, D1 = 23.4
  lathe(lead, cx, cy, [[LR + 0.05, D0], [LR + 0.05, D0 + 0.5], [LR - 0.15, D0 + 1.6], [LR - 0.75, D0 + 2.6], [LR - 1.6, D0 + 3.3], [1.1, D1]], 8, { phase: TAU / 16, smooth: true })
  // Four small dormer oculi on the dome.
  for (let i = 0; i < 4; i++) {
    const t = (TAU * i) / 4 + Math.PI / 2, n: V3 = [Math.cos(t), Math.sin(t), 0.35]
    panel(glaze, [cx + (LR - 0.45) * Math.cos(t), cy + (LR - 0.45) * Math.sin(t), D0 + 1.5], norm(n), 0.6, 0.8, true, 3, 0.12)
  }
  // Top gallery: a small drum and its railing, the cap and the flagpole.
  lathe(lead, cx, cy, [[1.1, D1], [1.55, D1 + 0.1], [1.55, D1 + 0.25], [0.8, D1 + 0.25]], 8, { phase: TAU / 16 })
  lathe(steel, cx, cy, [[1.5, D1 + 0.25], [1.5, D1 + 1.2], [1.4, D1 + 1.2], [1.4, D1 + 0.25]], 8, { phase: TAU / 16 })
  lathe(cream, cx, cy, [[0.8, D1 + 0.25], [0.8, D1 + 1.4], [0.55, D1 + 1.8], [0.18, D1 + 2.0]], 8)
  lathe(steel, cx, cy, [[0.28, D1 + 1.9], [0.16, 32.0], [0, 32.1]], 6)
  lathe(lead, cx, cy, [[0.15, 31.9], [0.32, 32.5], [0.18, 33.2], [0.1, 34.2], [0, 34.4]], 6, { smooth: true })

  // --- The stone hall west of the tower: walls to a crenellated parapet,
  // a red hipped roof, and a row of low arches along the quay.
  const HP = 7.0
  const hallRing = [[H.x0, H.y0], [S.x0, H.y0], [S.x0, S.y1], [H.x1, S.y1], [H.x1, H.y1], [H.x0, H.y1]] as P2[]
  // Two boxes cover the L (south part beside the tower, north part).
  box(stone, null, H.x0, S.x0 + 0.05, H.y0, H.y1, Q - 0.1, HP, 0.3)
  box(stone, null, S.x0, H.x1, S.y1 - 0.05, H.y1, Q - 0.1, HP, 0.3)
  void hallRing
  // Roof: one hip over the west block, one over the north block.
  hipRoof(tile, H.x0 + 0.5, S.x0 + 0.05, H.y0 + 0.5, H.y1 - 0.5, HP - 0.4, 2.6)
  hipRoof(tile, S.x0 - 1, H.x1 - 0.5, S.y1 + 0.5, H.y1 - 0.5, HP - 0.4, 2.2)
  // Parapet merlons on the outer edges.
  const mo = { w: 0.75, h: 0.7, th: 0.5, pitch: 1.75 }
  const edge = (a: P2, b: P2, n: P2) => merlons(stone, tile, [a[0] + n[0] * 0.25, a[1] + n[1] * 0.25], [b[0] + n[0] * 0.25, b[1] + n[1] * 0.25], HP, HP, mo)
  edge([H.x0, H.y0], [S.x0, H.y0], [0, 1])
  edge([H.x0, H.y1], [H.x0, H.y0], [1, 0])
  edge([H.x1, H.y1], [H.x0, H.y1], [0, -1])
  edge([H.x1, S.y1], [H.x1, H.y1], [-1, 0])
  // Arched openings along the quay (south and west faces).
  for (let s = H.x0 + 1.4; s < S.x0 - 0.8; s += 1.9) panel(glaze, [s, H.y0, Q], [0, -1, 0], 1.1, 1.6, true, 4)
  for (let s = H.y0 + 1.6; s < H.y1 - 0.8; s += 2.1) panel(glaze, [H.x0, s, Q], [-1, 0, 0], 1.1, 1.6, true, 4)
  for (let s = H.y0 + 2.0; s < H.y1 - 1; s += 4.2) panel(glaze, [H.x0, s, 4.2], [-1, 0, 0], 0.5, 1.2, true, 3)
  for (let s = S.x0 + 1.2; s < H.x1 - 0.8; s += 2.2) panel(glaze, [s, H.y1, Q], [0, 1, 0], 1.1, 1.6, true, 4)

  // --- The white pavilion east of the tower.
  const EE = 5.4
  box(cream, null, S.x1 - 0.05, E.x1, E.y0 + 0.4, E.y1, Q - 0.1, EE, 0.25)
  hipRoof(tile, S.x1 - 0.3, E.x1 + 0.35, E.y0 + 0.05, E.y1 + 0.35, EE, 2.0)
  for (let s = E.y0 + 1.6; s < E.y1 - 1; s += 2.3) panel(glaze, [E.x1, s, Q + 0.9], [1, 0, 0], 1.0, 2.1, true, 4)
  for (let s = S.x1 + 1.3; s < E.x1 - 0.8; s += 2.2) panel(glaze, [s, E.y0 + 0.4, Q + 0.9], [0, -1, 0], 1.0, 2.1, true, 4)
  // The gabled entrance porch on the east face.
  const pm = (E.y0 + E.y1) / 2
  box(cream, null, E.x1, E.x1 + 1.2, pm - 1.5, pm + 1.5, Q - 0.1, EE + 0.2)
  {
    const x0 = E.x1 - 0.2, x1 = E.x1 + 1.45, z = EE + 0.2, zr = EE + 1.4
    quad(tile, [x1, pm - 1.75, z], [x1, pm, zr], [x0, pm, zr], [x0, pm - 1.75, z], norm([0, -1.2, 1.75]))
    quad(tile, [x0, pm + 1.75, z], [x0, pm, zr], [x1, pm, zr], [x1, pm + 1.75, z], norm([0, 1.2, 1.75]))
    tri(cream, [x1 - 0.05, pm - 1.5, z], [x1 - 0.05, pm + 1.5, z], [x1 - 0.05, pm, zr - 0.15], [1, 0, 0])
    panel(glaze, [E.x1 + 1.2, pm, Q], [1, 0, 0], 1.3, 2.4, true, 4)
  }

  // --- The little lighthouse: white tapering cylinder, red band, lamp.
  lathe(cream, light[0], light[1], [[1.0, Q - 0.1], [0.75, 5.6]], 10)
  lathe(tile, light[0], light[1], [[0.87, 3.7], [0.82, 4.7]], 10)
  lathe(steel, light[0], light[1], [[0.8, 5.6], [0.8, 5.75], [0.45, 5.75], [0.45, 6.6], [0.5, 6.6], [0.2, 7.0], [0, 7.1]], 10)

  const lit = (p: V3, n: V3): number => (n[2] > 0.85 ? 0.3 : 0.95)
  const parts = [
    { part: stone, material: { ...finish('kiz-stone', 0xd2c3ad), floodlight: lit } },
    { part: cream, material: { ...PALETTE.trim, color: 0xf4ead4, floodlight: lit } },
    { part: lead, material: { ...PALETTE.roof, color: 0x9ea6ad } },
    { part: tile, material: { ...PALETTE.terracotta, color: 0xb0624e } },
    { part: glaze, material: PALETTE.window },
    { part: steel, material: finish('steel', 0x4f555d, 0.6) },
  ]
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  for (const { part, material } of parts) console.log(material.name, part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb("Maiden's Tower", parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 351, osm: 'way/103821246', height: 34.4,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  return { glb, triangles }
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = new URL('../models/istanbul-maidens-tower.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
