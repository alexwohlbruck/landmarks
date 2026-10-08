/**
 * The Getty Center museum (1997, Richard Meier & Partners), Brentwood, Los
 * Angeles: the Museum Entrance Hall and its rotunda, and the North, East,
 * South and West pavilions, the Exhibitions Pavilion and the Family Room
 * round the museum courtyard — original procedural geometry, CC0-1.0. The
 * Research Institute, the auditorium, the Conservation Institute and the
 * restaurant are left to the map.
 *
 *   bun generators/la-getty-center.ts
 *
 * Also the small kit the other B10 Westside models import
 * (la-century-plaza-towers, la-fox-plaza, la-la-temple, la-royce-hall):
 * frames, softened prisms, panels and arched panels, hip roofs, cylinders,
 * half-plane clipping. Importing this file builds nothing; the Getty is
 * only written when it is run directly.
 *
 * Frame: x east, y north, z up, metres; bearing 0 (the campus is laid out
 * on two grids 22.5° apart, so no single axis fits). Origin at the area
 * centroid of the museum outlines, on the lowest bare ground under them:
 * 248.1 m, where the Entrance Hall steps down to the arrival side. The
 * courtyard deck is at 273.5 m; the pavilion roofs at 293.2 m.
 *
 * The museum reads as a cluster of cubic pavilions in rough cream
 * travertine, linked by white enamel-panelled halls, with the round white
 * drum of the Entrance Hall rotunda at the north. Those, the courtyard
 * between them and the flat white roofs are the identity.
 *
 * Evidence
 * - Plans: OSM ways as listed in `replaces` (the pavilions, three
 *   building:parts of the South Pavilion, three building=roof canopies and a
 *   lift tower), used as given. The rotunda: a circle fitted to the Entrance
 *   Hall's arc, centre (-42.9, 52.6) from (-118.47401, 34.07702), r 11.5 m.
 * - Heights: LA County lidar surface model (LACounty_Dynamic/Elevation
 *   layer 8, 2.5 m grid, 7,134 samples) per outline over 248.1 m: North and
 *   East pavilions 45.1, Family Room 42.2, Exhibitions 42.2 with its
 *   south-west half 45.1, West 42.1 with its east half 45.1, South 33.4 with
 *   parts at 45.1 and 37.8, Entrance Hall 39.4, rotunda 45.1, canopies
 *   37.8–39.1, courtyard deck 25.4. USGS 3DEP bare earth: 248–268 under the
 *   outlines, 260–261 in the courtyard (the deck is missing from it, so it
 *   is modelled; see below).
 * - Photos (Wikimedia Commons), compared with renders from the same side:
 *   g1 "Aerial Getty Museum" (Jelson25, public domain) — from the south,
 *      the whole campus from the air;
 *   g2 "Getty Center (4343388113)" (Chris M Morris, CC BY 2.0) — the
 *      courtyard looking south-west, travertine cubes and the fountain;
 *   g3 "Brentwood ... panoramio (13)" and "(11)" (Mickey Løgitmark, CC BY
 *      3.0) — the Entrance Hall's enamel front and the rotunda's tiers;
 *   g4 "Getty Center, Los Angeles, California (6)" (Ken Lund, CC BY-SA
 *      2.0) — the rotunda from the courtyard;
 *   g5 "Inner Courtyard of Getty Museum" (Freier Denker, CC0);
 *   g6 "Getty Center from Central Garden" (Robert F. Tobler, CC BY-SA 4.0)
 *      — the West Pavilion over the garden, from the west.
 *   USGS NAIP orthophoto for the plan and the white roofs.
 * - Colour: the photos (cream travertine, white enamel panels, white
 *   roofs), pulled to the palette's lightness.
 *
 * The courtyard deck: the plaza between the pavilions stands over lower
 * floors and is absent from the bare-earth model, 12–13 m below it, so
 * without it the courtyard would read as a pit on the map. It is drawn as
 * a travertine podium to the deck level, not as paving.
 *
 * Estimated: which faces are enamel and which travertine (per building,
 * from the photos), window panels (one broad window per face above the
 * deck, a band of the lower floors on the outside faces), the rotunda's
 * glazed tiers, the canopies' thickness. Left out: the fountains, gardens,
 * stairs, the cactus garden promontory, the tram station.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { type Swatch } from './palette'

export type XY = [number, number]

// ---------------------------------------------------------------------------
// Frames

/** Local metres (x east, y north) of a lng/lat around an origin. */
export function local(lng: number, lat: number, lng0: number, lat0: number): XY {
  const R = 6378137
  return [((lng - lng0) * Math.PI / 180) * R * Math.cos((lat0 * Math.PI) / 180), ((lat - lat0) * Math.PI / 180) * R]
}
/** The lng/lat of local metres (x east, y north) around an origin. */
export function lngLat(p: XY, lng0: number, lat0: number): [number, number] {
  const R = 6378137
  return [lng0 + (p[0] / (R * Math.cos((lat0 * Math.PI) / 180))) * 180 / Math.PI, lat0 + (p[1] / R) * 180 / Math.PI]
}
export const rot = ([x, y]: XY, deg: number): XY => {
  const a = (deg * Math.PI) / 180
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]
}
/**
 * World (x east, y north, about the anchor) → model frame for a placement at
 * `bearing` (clockwise from north): the model's +y is the bearing direction.
 */
export const toModel = (p: XY, anchor: XY, bearing: number): XY => rot([p[0] - anchor[0], p[1] - anchor[1]], bearing)

// ---------------------------------------------------------------------------
// Polygons

export const area = (r: XY[]) => {
  let s = 0
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    s += a[0] * b[1] - b[0] * a[1]
  }
  return s / 2
}
export const ccw = (r: XY[]) => (area(r) < 0 ? r.slice().reverse() : r.slice())
export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
export function centroid(r: XY[]): XY {
  let a = 0, cx = 0, cy = 0
  for (let i = 0; i < r.length; i++) {
    const [x0, y0] = r[i], [x1, y1] = r[(i + 1) % r.length]
    const c = x0 * y1 - x1 * y0
    a += c; cx += (x0 + x1) * c; cy += (y0 + y1) * c
  }
  return [cx / (3 * a), cy / (3 * a)]
}
/** A regular polygon (or circle) ring, counter-clockwise. */
export function circle(cx: number, cy: number, r: number, n: number, a0 = 0): XY[] {
  return Array.from({ length: n }, (_, i) => {
    const a = a0 + (2 * Math.PI * i) / n
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as XY
  })
}
/** Drop points closer than `tol` to the previous one and collinear points. */
export function simplify(r: XY[], tol = 0.3): XY[] {
  let out = r.filter((p, i) => Math.hypot(p[0] - r[(i + r.length - 1) % r.length][0], p[1] - r[(i + r.length - 1) % r.length][1]) > tol)
  let changed = true
  while (changed && out.length > 3) {
    changed = false
    for (let i = 0; i < out.length; i++) {
      const a = out[(i + out.length - 1) % out.length], b = out[i], c = out[(i + 1) % out.length]
      const cr = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
      const l = Math.hypot(c[0] - a[0], c[1] - a[1]) || 1
      if (Math.abs(cr / l) < tol * 0.5) { out.splice(i, 1); changed = true; break }
    }
  }
  return out
}

/** Offset a counter-clockwise ring inwards by d (outwards if negative), mitred. */
export function inset(r: XY[], d: number): XY[] {
  const n = r.length
  const nrm = (a: XY, b: XY): XY => {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l]
  }
  return r.map((c, i) => {
    const n1 = nrm(r[(i - 1 + n) % n], c), n2 = nrm(c, r[(i + 1) % n])
    const k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    let ox = (n1[0] + n2[0]) / Math.max(k, 0.2), oy = (n1[1] + n2[1]) / Math.max(k, 0.2)
    const l = Math.hypot(ox, oy)
    if (l > 2.5) { ox *= 2.5 / l; oy *= 2.5 / l }
    return [c[0] + ox * d, c[1] + oy * d] as XY
  })
}

/** Ear clipping for a simple counter-clockwise ring. */
export function triangulate(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i)
  const out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 20000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i - 1 + idx.length) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const a = r[ia], b = r[ib], c = r[ic]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inside(r[j], a, b, c))) continue
      out.push([ia, ib, ic]); idx.splice(i, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

export function cap(p: Part, r: XY[], z: number, up = true) {
  const R = ccw(r)
  for (const [a, b, c] of triangulate(R)) {
    const A: V3 = [R[a][0], R[a][1], z], B: V3 = [R[b][0], R[b][1], z], C: V3 = [R[c][0], R[c][1], z]
    if (up) p.tri(A, B, C); else p.tri(A, C, B)
  }
}

/** Plain flat-shaded walls of a ring, facing out (or in, for a hole). */
export function walls(p: Part, r0: XY[], z0: number, z1: number, inward = false) {
  const r = ccw(r0)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    const a: V3 = [r[i][0], r[i][1], z0], b: V3 = [r[j][0], r[j][1], z0], c: V3 = [r[j][0], r[j][1], z1], d: V3 = [r[i][0], r[i][1], z1]
    if (inward) p.quad(b, a, d, c); else p.quad(a, b, c, d)
  }
}

// ---------------------------------------------------------------------------
// Solids

const UP: V3 = [0, 0, 1]
const unit3 = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
export function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: [V3, V3, V3, V3]) {
  p.tri(a, b, c, undefined, undefined, undefined, [n[0], n[1], n[2]])
  p.tri(a, c, d, undefined, undefined, undefined, [n[0], n[2], n[3]])
}

/**
 * A softened ring: convex corners cut by `r` and shaded round, concave
 * corners left sharp. Each point carries the normal of the edge arriving at
 * it and of the edge leaving it. `smooth` shades every corner round (for
 * polygonal circles).
 */
export function soften(ring: XY[], r = 0.45, smooth = false) {
  const R = ccw(ring)
  const pts: XY[] = [], nin: V3[] = [], nout: V3[] = []
  for (let i = 0; i < R.length; i++) {
    const a = R[(i + R.length - 1) % R.length], b = R[i], c = R[(i + 1) % R.length]
    const l0 = Math.hypot(b[0] - a[0], b[1] - a[1]), l1 = Math.hypot(c[0] - b[0], c[1] - b[1])
    const u: XY = [(b[0] - a[0]) / l0, (b[1] - a[1]) / l0], v: XY = [(c[0] - b[0]) / l1, (c[1] - b[1]) / l1]
    const n0: V3 = [u[1], -u[0], 0], n1: V3 = [v[1], -v[0], 0]
    if (smooth) {
      const m = unit3([n0[0] + n1[0], n0[1] + n1[1], 0])
      pts.push(b); nin.push(m); nout.push(m); continue
    }
    const turn = u[0] * v[1] - u[1] * v[0]
    const rr = Math.min(r, l0 * 0.3, l1 * 0.3)
    if (turn > 1e-4 && rr > 0.02) {
      pts.push([b[0] - u[0] * rr, b[1] - u[1] * rr], [b[0] + v[0] * rr, b[1] + v[1] * rr])
      nin.push(n0, n1); nout.push(n0, n1)
    } else {
      pts.push(b); nin.push(n0); nout.push(n1)
    }
  }
  return { pts, nin, nout }
}

export type Prism = { ring: XY[]; top: XY[] }
/**
 * An upright block: softened corners, walls from z0, and a bevelled top edge
 * rolling onto a flat top at z1. Returns the softened outline and the top.
 */
export function prism(wall: Part, top: Part | null, ring: XY[], z0: number, z1: number, o: { corner?: number; bevel?: number; bottom?: Part; smooth?: boolean } = {}): Prism {
  const corner = o.corner ?? 0.45, bevel = Math.min(o.bevel ?? 0.4, (z1 - z0) * 0.4)
  const s = soften(ring, corner, o.smooth)
  const P = s.pts, n = P.length
  const zb = z1 - bevel
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    if (Math.hypot(P[j][0] - P[i][0], P[j][1] - P[i][1]) < 1e-6) continue
    const ni = s.nout[i], nj = s.nin[j]
    quadN(wall, [P[i][0], P[i][1], z0], [P[j][0], P[j][1], z0], [P[j][0], P[j][1], zb], [P[i][0], P[i][1], zb], [ni, nj, nj, ni])
  }
  const T = bevel > 0 ? inset(P, bevel) : P
  if (bevel > 0) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    if (Math.hypot(P[j][0] - P[i][0], P[j][1] - P[i][1]) < 1e-6) continue
    const ni = unit3([s.nout[i][0], s.nout[i][1], 0.35]), nj = unit3([s.nin[j][0], s.nin[j][1], 0.35])
    quadN(wall, [P[i][0], P[i][1], zb], [P[j][0], P[j][1], zb], [T[j][0], T[j][1], z1], [T[i][0], T[i][1], z1], [ni, nj, UP, UP])
  }
  if (top) cap(top, T, z1)
  if (o.bottom) cap(o.bottom, P, z0, false)
  return { ring: P, top: T }
}

/** A flat-topped band standing proud of a wall line by `out`: a cornice or string course. */
export function band(p: Part, ring: XY[], z0: number, z1: number, out = 0.35, top: Part | null = null) {
  prism(p, top, inset(ccw(ring), -out), z0, z1, { corner: 0.3, bevel: Math.min(0.3, (z1 - z0) / 2) })
}

/** A parapet: a wall ring `t` thick from z0 to z1 inside the outline, with its top. */
export function parapet(wall: Part, ring: XY[], z0: number, z1: number, t = 0.5) {
  const R = ccw(ring), I = inset(R, t)
  walls(wall, I, z0, z1, true)
  for (let i = 0; i < R.length; i++) {
    const j = (i + 1) % R.length
    wall.quad([I[i][0], I[i][1], z1], [R[i][0], R[i][1], z1], [R[j][0], R[j][1], z1], [I[j][0], I[j][1], z1])
  }
}

/** A smooth cylinder (or frustum) wall from z0 to z1; optional caps. */
export function cylinder(wall: Part, cx: number, cy: number, r0: number, z0: number, z1: number, seg = 16, o: { r1?: number; top?: Part | null; bottom?: Part | null } = {}) {
  const r1 = o.r1 ?? r0
  const slope = (r0 - r1) / (z1 - z0)
  for (let i = 0; i < seg; i++) {
    const a0 = (2 * Math.PI * i) / seg, a1 = (2 * Math.PI * (i + 1)) / seg
    const n0 = unit3([Math.cos(a0), Math.sin(a0), slope]), n1 = unit3([Math.cos(a1), Math.sin(a1), slope])
    const p = (a: number, r: number, z: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
    quadN(wall, p(a0, r0, z0), p(a1, r0, z0), p(a1, r1, z1), p(a0, r1, z1), [n0, n1, n1, n0])
  }
  if (o.top) cap(o.top, circle(cx, cy, r1, seg), z1)
  if (o.bottom) cap(o.bottom, circle(cx, cy, r0, seg), z0, false)
}

/** The point at distance s along wall a→b, `out` in front of it, at height z. */
export function onWall(a: XY, b: XY, s: number, z: number, out = 0.05): V3 {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  return [a[0] + u[0] * s + u[1] * out, a[1] + u[1] * s - u[0] * out, z]
}
export const wallLen = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])

/** A flat rectangle on the outside of wall a→b (a counter-clockwise ring edge). */
export function panel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out = 0.05) {
  p.quad(onWall(a, b, s0, z0, out), onWall(a, b, s1, z0, out), onWall(a, b, s1, z1, out), onWall(a, b, s0, z1, out))
}

/** A round-headed panel on wall a→b: semicircular top, as wide as it is round. */
export function archPanel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out = 0.05, seg = 8) {
  const r = (s1 - s0) / 2, sc = (s0 + s1) / 2, spring = z1 - r
  if (spring > z0) panel(p, a, b, s0, s1, z0, spring, out)
  const c = onWall(a, b, sc, Math.max(spring, z0), out)
  for (let k = 0; k < seg; k++) {
    const t0 = (k / seg) * Math.PI, t1 = ((k + 1) / seg) * Math.PI
    p.tri(c, onWall(a, b, sc + r * Math.cos(t0), spring + r * Math.sin(t0), out), onWall(a, b, sc + r * Math.cos(t1), spring + r * Math.sin(t1), out))
  }
}

/**
 * Window bays on wall a→b: `n` panels evenly spaced between end margins,
 * each `fill` of its bay wide, one per row band [z0, z1].
 */
export function bays(p: Part, a: XY, b: XY, o: { n: number; rows: [number, number][]; margin?: number; fill?: number; arch?: boolean; s0?: number; s1?: number; out?: number }) {
  const L = wallLen(a, b)
  const s0 = (o.s0 ?? 0) + (o.margin ?? 0), s1 = (o.s1 ?? L) - (o.margin ?? 0)
  const bay = (s1 - s0) / o.n, w = bay * (o.fill ?? 0.6)
  for (let k = 0; k < o.n; k++) {
    const c = s0 + bay * (k + 0.5)
    for (const [z0, z1] of o.rows) {
      if (o.arch) archPanel(p, a, b, c - w / 2, c + w / 2, z0, z1, o.out)
      else panel(p, a, b, c - w / 2, c + w / 2, z0, z1, o.out)
    }
  }
}

/** Rows of `h`-tall bands from z0 up to z1, `gap` apart. */
export function rows(z0: number, z1: number, h: number, gap: number): [number, number][] {
  const out: [number, number][] = []
  for (let z = z0; z + h <= z1 + 1e-6; z += h + gap) out.push([z, z + h])
  return out
}

/**
 * A hip roof over a rectangle given by its four corners, eaves at z, rising
 * `rise` to a ridge along the longer side. `hips` chooses which ends are
 * hipped ([start, end] of the long axis); an unhipped end is a gable, drawn
 * in `gable`.
 */
export function hipRoof(p: Part, c: XY[], z: number, rise: number, o: { hips?: [boolean, boolean]; gable?: Part; eave?: number } = {}) {
  let [A, B, C, D] = ccw(c)
  if (o.eave) [A, B, C, D] = inset([A, B, C, D], -o.eave) as [XY, XY, XY, XY]
  if (wallLen(A, B) < wallLen(B, C)) [A, B, C, D] = [B, C, D, A]
  const W = wallLen(B, C), L = wallLen(A, B)
  const u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
  const m0: XY = [(A[0] + D[0]) / 2, (A[1] + D[1]) / 2], m1: XY = [(B[0] + C[0]) / 2, (B[1] + C[1]) / 2]
  const [h0, h1] = o.hips ?? [true, true]
  const k = Math.min(W / 2, L / 2 - 0.01)
  const r0: V3 = [m0[0] + u[0] * (h0 ? k : 0), m0[1] + u[1] * (h0 ? k : 0), z + rise]
  const r1: V3 = [m1[0] - u[0] * (h1 ? k : 0), m1[1] - u[1] * (h1 ? k : 0), z + rise]
  const P = (q: XY): V3 => [q[0], q[1], z]
  p.quad(P(A), P(B), r1, r0)
  p.quad(P(C), P(D), r0, r1)
  if (h0) p.tri(P(D), P(A), r0); else (o.gable ?? p).tri(P(D), P(A), r0)
  if (h1) p.tri(P(B), P(C), r1); else (o.gable ?? p).tri(P(B), P(C), r1)
  if (o.eave) cap(p, [A, B, C, D], z, false)
}

/** A pyramid roof over a convex ring, apex over its centroid at z + rise. */
export function pyramid(p: Part, ring: XY[], z: number, rise: number) {
  const R = ccw(ring), c = centroid(R)
  for (let i = 0; i < R.length; i++) {
    const j = (i + 1) % R.length
    p.tri([R[i][0], R[i][1], z], [R[j][0], R[j][1], z], [c[0], c[1], z + rise])
  }
}

// ---------------------------------------------------------------------------
// Output

export function save(id: string, name: string, parts: Array<{ part: Part; material: Swatch }>, extras: Record<string, unknown>, maxTris = 5000) {
  const used = parts.filter((p) => p.part.triangles > 0)
  if (used.length > 6) throw new Error(`${id}: ${used.length} materials`)
  const names = new Set(used.map((u) => u.material.name))
  if (names.size !== used.length) throw new Error(`${id}: duplicate material names`)
  const triangles = used.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${id}: ${triangles} triangles`)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the lowest ground', ...extras })
  if (glb.length > 250 * 1024) throw new Error(`${id}: ${glb.length} bytes`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

/** Clip a ring to the half-plane where (p - o)·n >= 0 (Sutherland–Hodgman). */
export function clipHalf(ring: XY[], o: XY, n: XY): XY[] {
  const f = (p: XY) => (p[0] - o[0]) * n[0] + (p[1] - o[1]) * n[1]
  const out: XY[] = []
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], fa = f(a), fb = f(b)
    if (fa >= 0) out.push(a)
    if ((fa >= 0) !== (fb >= 0)) {
      const t = fa / (fa - fb)
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
    }
  }
  return out
}
/** A unit vector toward a compass bearing (degrees clockwise from north). */
export const toward = (deg: number): XY => [Math.sin((deg * Math.PI) / 180), Math.cos((deg * Math.PI) / 180)]

/** A curved band on a cylinder wall: angles a0→a1 (radians, counter-clockwise), z0→z1, standing `out` proud. */
export function cylBand(p: Part, cx: number, cy: number, r: number, a0: number, a1: number, z0: number, z1: number, seg = 12, out = 0.06) {
  const R = r + out
  for (let i = 0; i < seg; i++) {
    const t0 = a0 + ((a1 - a0) * i) / seg, t1 = a0 + ((a1 - a0) * (i + 1)) / seg
    const n0: V3 = [Math.cos(t0), Math.sin(t0), 0], n1: V3 = [Math.cos(t1), Math.sin(t1), 0]
    const q = (t: number, z: number): V3 => [cx + R * Math.cos(t), cy + R * Math.sin(t), z]
    quadN(p, q(t0, z0), q(t1, z0), q(t1, z1), q(t0, z1), [n0, n1, n1, n0])
  }
}

// ===========================================================================
// The Getty Center museum
// ===========================================================================

/** OSM way/481417416 (West Pavilion) */
const G_WEST: XY[] = [[20.3,-45.7],[20.7,-46.4],[37.0,-69.5],[35.2,-70.8],[34.7,-71.2],[32.8,-72.4],[28.6,-75.5],[25.3,-77.8],[24.0,-78.8],[18.8,-71.3],[14.9,-74.0],[9.5,-66.3],[2.7,-71.1],[-3.4,-62.4],[-10.7,-63.9],[-15.5,-40.9],[-6.4,-39.0],[-6.1,-40.6],[0.8,-39.0],[2.9,-38.6],[3.4,-38.4],[6.3,-37.8],[8.9,-37.5],[11.6,-38.1],[14.0,-39.4],[16.0,-41.4],[19.1,-46.5]]
/** OSM way/481417418 */
const G_SOUTH_HIGH: XY[] = [[55.5,-33.3],[56.2,-34.2],[61.1,-41.3],[65.2,-38.4],[66.1,-39.5],[66.8,-40.7],[71.5,-37.5],[74.5,-35.4],[74.9,-36.1],[76.2,-37.8],[78.3,-41.0],[78.7,-41.6],[70.5,-47.3],[68.3,-44.2],[64.8,-46.6],[68.7,-52.2],[70.2,-54.5],[71.8,-56.9],[60.0,-65.1],[52.5,-70.3],[48.5,-73.0],[47.8,-72.0],[46.4,-70.0],[45.4,-68.5],[44.1,-66.5],[43.2,-65.3],[32.2,-49.4],[40.4,-43.8]]
/** OSM way/481417420 */
const G_SOUTH_MID: XY[] = [[62.5,-68.7],[54.1,-74.6],[53.2,-75.2],[52.8,-75.7],[52.7,-76.3],[52.7,-77.0],[52.5,-77.5],[51.4,-77.9],[50.8,-78.4],[50.0,-79.8],[47.3,-82.7],[45.9,-84.1],[44.3,-84.3],[42.7,-84.0],[41.5,-83.7],[40.1,-84.2],[38.8,-84.2],[38.0,-83.5],[32.8,-75.6],[34.3,-74.6],[32.8,-72.4],[34.7,-71.2],[35.2,-70.8],[37.0,-69.5],[39.9,-67.6],[43.2,-65.3],[44.1,-66.5],[45.4,-68.5],[38.6,-73.1],[40.0,-75.0],[41.0,-76.6],[47.8,-72.0],[48.5,-73.0],[52.5,-70.3],[60.0,-65.1]]
/** OSM way/481417422 (East Pavilion) */
const G_EAST: XY[] = [[44.0,28.1],[57.5,8.9],[63.9,-0.3],[62.1,-1.6],[54.8,-6.8],[53.5,-7.7],[34.8,-20.8],[29.2,-12.4],[39.0,-5.5],[49.7,2.1],[48.4,4.0],[41.5,14.2],[32.6,8.0],[30.4,10.9],[26.9,15.9],[31.1,19.1],[34.9,21.7]]
/** OSM way/481417423 (Family Room) */
const G_FAMILY: XY[] = [[25.5,9.8],[25.8,8.6],[27.5,0.5],[28.5,-4.1],[14.9,-7.0],[11.9,6.9]]
/** OSM way/481417424 (North Pavilion) */
const G_NORTH: XY[] = [[11.3,64.0],[27.3,40.8],[23.8,38.4],[19.9,35.6],[14.9,31.9],[13.6,31.0],[13.0,30.5],[4.0,24.8],[-6.2,39.5],[-8.5,42.9],[-10.6,46.0],[-12.0,47.9],[-10.7,48.8],[-12.7,51.6],[-13.1,53.3],[-12.6,54.9],[-9.4,59.8],[-8.1,60.9],[-6.5,61.2],[-5.1,60.6],[-3.8,59.5],[-2.9,60.1],[-2.1,60.7],[-0.2,57.9],[0.6,56.7],[3.7,58.8]]
/** OSM way/481417426 */
const G_CANOPY_1: XY[] = [[13.0,30.5],[17.1,24.7],[14.2,22.7],[19.6,15.0],[22.3,16.8],[24.3,14.0],[27.4,9.7],[25.8,8.6],[27.5,0.5],[30.9,-4.1],[32.0,-5.8],[27.0,-9.3],[29.2,-12.4],[39.0,-5.5],[49.7,2.1],[48.4,4.0],[43.3,0.5],[42.5,1.5],[38.9,-1.1],[39.5,-2.0],[36.0,-4.5],[29.5,4.6],[33.1,7.2],[32.6,8.0],[30.4,10.9],[26.9,15.9],[26.4,15.5],[20.9,23.2],[22.0,24.0],[22.9,25.3],[23.0,27.0],[22.4,28.2],[21.4,29.1],[20.0,29.4],[18.4,29.4],[17.3,28.5],[14.9,31.9],[13.6,31.0]]
/** OSM way/481417428 */
const G_CANOPY_2: XY[] = [[76.2,-37.8],[85.7,-31.1],[77.3,-19.2],[66.4,-3.8],[64.3,-0.9],[63.9,-0.3],[62.1,-1.6],[64.5,-5.1],[75.5,-20.6],[77.9,-24.0],[72.0,-27.8],[76.8,-34.7],[74.9,-36.1]]
/** OSM way/481417431 (Exhibitions Pavilion) */
const G_EXHIBITIONS: XY[] = [[-60.1,25.9],[-50.1,32.9],[-46.7,35.2],[-18.5,-5.8],[-16.2,-9.2],[-17.5,-10.4],[-19.1,-13.2],[-19.6,-14.2],[-21.1,-16.7],[-21.6,-17.6],[-22.9,-19.1],[-24.5,-19.9],[-25.6,-20.0],[-26.4,-20.0],[-29.9,-19.2],[-32.2,-18.8],[-32.5,-17.6],[-51.5,-21.6],[-55.9,-1.2],[-53.2,-0.7],[-54.4,4.9],[-54.3,7.0],[-53.4,8.2],[-52.3,8.9],[-61.6,22.5],[-59.0,24.3]]
/** OSM way/481451917 (Museum Entrance Hall) */
const G_HALL: XY[] = [[-57.3,100.2],[-56.6,96.9],[-55.3,91.3],[-55.3,88.2],[-56.2,84.6],[-58.3,81.2],[-61.5,78.2],[-64.9,77.1],[-81.9,73.5],[-83.4,72.4],[-84.2,71.2],[-84.2,67.8],[-84.5,66.4],[-87.7,63.8],[-88.3,62.6],[-88.3,60.9],[-87.1,58.6],[-82.5,52.0],[-76.6,43.7],[-70.2,34.7],[-66.8,29.7],[-61.5,29.6],[-56.5,35.1],[-57.7,37.0],[-54.4,39.1],[-51.0,41.5],[-53.5,45.0],[-52.3,45.7],[-50.0,43.8],[-47.2,42.3],[-43.0,41.7],[-39.6,42.2],[-36.8,43.4],[-33.9,45.8],[-32.2,48.9],[-31.5,52.0],[-31.7,55.9],[-33.2,59.1],[-34.1,60.5],[-33.4,61.0],[-32.3,61.9],[-29.1,64.0],[-23.6,68.0],[-21.7,65.4],[-14.6,70.4],[-18.6,76.0],[-15.2,78.3],[-14.6,78.8],[-14.1,79.1],[-13.9,82.5],[-16.7,82.7],[-16.5,86.2],[-19.8,86.4],[-19.6,89.7],[-22.3,89.9],[-22.0,93.9],[-25.1,94.1],[-24.9,97.7],[-27.8,97.9],[-30.2,101.5],[-27.3,103.5],[-32.5,111.2],[-34.9,114.6],[-35.3,115.3],[-53.0,103.2],[-56.6,100.8]]
/** OSM way/481451918 */
const G_LIFT: XY[] = [[-51.0,41.5],[-46.7,35.2],[-50.1,32.9],[-54.4,39.1]]
/** OSM way/481451919 */
const G_CANOPY_3: XY[] = [[-6.2,39.5],[-10.7,36.5],[-9.9,35.2],[-15.7,31.4],[-17.8,34.4],[-20.1,39.3],[-21.0,41.9],[-21.3,43.7],[-21.2,45.5],[-32.3,61.9],[-29.1,64.0],[-14.8,43.0],[-12.9,39.9],[-8.5,42.9]]
/** OSM way/481509203 */
const G_SOUTH_LOW: XY[] = [[53.5,-7.7],[58.5,-14.8],[55.6,-16.7],[54.7,-17.8],[54.7,-19.6],[55.1,-23.0],[55.9,-25.4],[56.9,-27.3],[58.0,-29.0],[58.6,-29.7],[59.3,-30.8],[55.5,-33.3],[56.2,-34.2],[61.1,-41.3],[65.2,-38.4],[66.1,-39.5],[66.8,-40.7],[71.5,-37.5],[74.5,-35.4],[74.9,-36.1],[76.2,-37.8],[78.3,-41.0],[78.7,-41.6],[85.1,-37.1],[88.1,-34.9],[89.8,-32.9],[90.2,-30.7],[90.2,-28.0],[87.5,-12.7],[86.3,-9.2],[85.0,-7.1],[83.4,-5.2],[81.1,-3.4],[69.2,3.4],[63.9,-0.3],[62.1,-1.6],[54.8,-6.8]]
/** OSM way/1153949919 (South Pavilion) */
const G_SOUTH: XY[] = [[55.5,-33.3],[40.4,-43.8],[32.2,-49.4],[43.2,-65.3],[45.4,-68.5],[46.4,-70.0],[47.8,-72.0],[48.5,-73.0],[52.5,-70.3],[60.0,-65.1],[71.8,-56.9],[68.7,-52.2],[64.8,-46.6],[68.3,-44.2],[70.5,-47.3],[78.7,-41.6],[85.1,-37.1],[88.1,-34.9],[89.8,-32.9],[90.2,-30.7],[90.2,-28.0],[87.5,-12.7],[86.3,-9.2],[85.0,-7.1],[83.4,-5.2],[81.1,-3.4],[69.2,3.4],[63.9,-0.3],[62.1,-1.6],[54.8,-6.8],[53.5,-7.7],[58.5,-14.8],[55.6,-16.7],[54.7,-17.8],[54.7,-19.6],[55.1,-23.0],[55.9,-25.4],[56.9,-27.3],[58.0,-29.0],[58.6,-29.7],[59.3,-30.8]]

function buildGetty() {
  const O = [-118.47401, 34.07702] as const
  const BASE = 248.1 // the lowest bare ground under the museum outlines (3DEP)
  const PLAZA = 273.5 - BASE // the courtyard deck
  const trav = new Part(), enamel = new Part(), win = new Part(), roofP = new Part(), glassP = new Part()

  // Anchor: area centroid of the museum outlines.
  const outlines = [G_WEST, G_EAST, G_FAMILY, G_NORTH, G_EXHIBITIONS, G_HALL, G_SOUTH]
  let A = 0, CX = 0, CY = 0
  for (const r of outlines) { const a = Math.abs(area(r)), c = centroid(r); A += a; CX += c[0] * a; CY += c[1] * a }
  const C: XY = [CX / A, CY / A]
  const M = (r: XY[]): XY[] => ccw(r.map((p) => [p[0] - C[0], p[1] - C[1]] as XY))
  const Mp = (p: XY): XY => [p[0] - C[0], p[1] - C[1]]

  // the courtyard deck: the plaza between the pavilions stands over lower
  // floors and is missing from the bare-earth model, which sits 12–13 m
  // lower; drawn as a travertine podium so the courtyard is not a pit.
  const COURT: XY[] = [[-18.5, -5.8], [-46.7, 35.2], [-36.8, 43.4], [-23.6, 68.0], [-10.6, 46.0], [4.0, 24.8], [26.9, 15.9], [29.2, -12.4], [34.8, -20.8], [32.2, -49.4], [20.3, -45.7], [8.9, -37.5], [-6.4, -39.0], [-15.5, -40.9]]
  prism(trav, trav, M(COURT), 0, PLAZA, { corner: 0.3, bevel: 0.3 })

  const inCourt = (p: XY) => {
    const r = COURT
    let c = false
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      if ((r[i][1] > p[1]) !== (r[j][1] > p[1]) && p[0] < ((r[j][0] - r[i][0]) * (p[1] - r[i][1])) / (r[j][1] - r[i][1]) + r[i][0]) c = !c
    }
    return c
  }

  /**
   * A pavilion: walls from the ground to `h` (above BASE), travertine or
   * enamel above the plaza, a flat roof inside a thin lip; windows: on
   * faces looking onto the courtyard one broad window above the plaza,
   * on outside faces also a band of the lower floors.
   */
  function pavilion(ringW: XY[], h: number, skin: 'trav' | 'enamel', o: { windows?: boolean; from?: number } = {}) {
    const r = M(ringW), z0 = o.from ?? 0
    const top = skin === 'trav' ? trav : enamel
    if (z0 < PLAZA && skin === 'enamel') {
      prism(trav, null, r, z0, PLAZA, { corner: 0.3, bevel: 0 })
      prism(enamel, null, r, PLAZA, h, { corner: 0.3, bevel: 0.35 })
    } else prism(top, null, r, z0, h, { corner: 0.3, bevel: 0.35 })
    const lip = inset(r, 0.7)
    cap(roofP, lip, h - 0.5)
    walls(top, lip, h - 0.5, h, true)
    const ti = inset(r, 0.35)
    for (let i = 0; i < r.length; i++) {
      const j = (i + 1) % r.length
      top.quad([ti[i][0], ti[i][1], h], [ti[j][0], ti[j][1], h], [lip[j][0], lip[j][1], h], [lip[i][0], lip[i][1], h])
    }
    if (o.windows === false) return
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], L = wallLen(a, b)
      if (L < 7) continue
      const mid: XY = [(a[0] + b[0]) / 2 + C[0], (a[1] + b[1]) / 2 + C[1]]
      const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
      const outside: XY = [mid[0] + n[0] * 4, mid[1] + n[1] * 4]
      const court = inCourt(outside)
      const up0 = Math.max(PLAZA, z0) + 3.5, up1 = Math.min(h - 3.5, up0 + 8)
      if (up1 - up0 > 3) {
        if (skin === 'enamel') panel(win, a, b, 1.2, L - 1.2, up0, up1, 0.06)
        else if (L >= 12) panel(win, a, b, L * 0.3, L * 0.7, up0, up1, 0.06)
      }
      // the lower floors show on the outside of the hill
      if (!court && z0 === 0 && L >= 12) panel(win, a, b, L * 0.2, L * 0.8, 14.0, 21.5, 0.06)
    }
  }

  // heights over BASE from the LA County lidar surface model (see header)
  pavilion(G_NORTH, 45.1, 'trav')
  pavilion(G_EAST, 45.1, 'trav')
  pavilion(G_FAMILY, 42.2, 'enamel')
  pavilion(G_EXHIBITIONS, 42.2, 'trav')
  pavilion(clipHalf(clipHalf(G_EXHIBITIONS, [-35, 5], toward(215)), [-38, -5], toward(305)), 45.1, 'trav', { from: 42.0, windows: false })
  pavilion(G_WEST, 42.1, 'trav')
  pavilion(clipHalf(G_WEST, [0, -55], toward(125)), 45.1, 'trav', { from: 42.0, windows: false })
  pavilion(G_SOUTH, 33.4, 'enamel')
  pavilion(G_SOUTH_HIGH, 45.1, 'trav', { from: 33.2 })
  pavilion(G_SOUTH_MID, 37.8, 'enamel', { from: 33.2 })
  pavilion(G_HALL, 39.4, 'enamel')
  pavilion(G_LIFT, 39.2, 'enamel', { windows: false })

  // canopies (OSM building=roof): thin enamel slabs on slim columns
  for (const [ring, h] of [[G_CANOPY_1, 39.1], [G_CANOPY_2, 37.8], [G_CANOPY_3, 39.1]] as [XY[], number][]) {
    const r = M(ring)
    prism(enamel, enamel, r, h - 1.0, h, { corner: 0.2, bevel: 0.2, bottom: enamel })
  }

  // the rotunda: a white enamel drum over the entrance hall, glazed in
  // two tiers on the courtyard side, with a ribbon window round its top
  {
    const [cx, cy] = Mp([-42.9, 52.6]), R = 11.5
    cylinder(enamel, cx, cy, R, 0, 45.1, 24)
    cap(enamel, circle(cx, cy, R - 0.6, 24), 44.6) // a white roof, so the drum reads as one white disc from above
    walls(enamel, circle(cx, cy, R - 0.6, 24), 44.6, 45.1, true)
    {
      const ring = circle(cx, cy, R, 24), ti = circle(cx, cy, R - 0.6, 24)
      for (let i = 0; i < 24; i++) {
        const j = (i + 1) % 24
        enamel.quad([ring[i][0], ring[i][1], 45.1], [ring[j][0], ring[j][1], 45.1], [ti[j][0], ti[j][1], 45.1], [ti[i][0], ti[i][1], 45.1])
      }
    }
    // a skylight in the middle of the roof
    cap(glassP, circle(cx, cy, 4.5, 16), 44.75)
    const a0 = (-120 * Math.PI) / 180, a1 = (38 * Math.PI) / 180
    cylBand(win, cx, cy, R, a0, a1, PLAZA + 0.6, PLAZA + 5.0, 12)
    cylBand(win, cx, cy, R, a0, a1, PLAZA + 7.0, PLAZA + 11.6, 12)
    cylBand(win, cx, cy, R, 0, Math.PI * 2, 40.2, 43.4, 24)
  }

  const [lng, lat] = lngLat(C, O[0], O[1])
  console.log(`anchor ${lng.toFixed(7)}, ${lat.toFixed(7)} (centroid ${C[0].toFixed(2)}, ${C[1].toFixed(2)})`)
  save('la-getty-center', 'Getty Center', [
    { part: trav, material: { name: 'getty-travertine', color: 0xefeae0, roughness: 0.9 } },
    { part: enamel, material: { name: 'getty-enamel', color: 0xf8f8f6, roughness: 0.7 } },
    { part: win, material: { name: 'window', color: 0x6f8394, roughness: 0.35 } },
    { part: roofP, material: { name: 'roof', color: 0xd2d5d6, roughness: 0.85 } },
    { part: glassP, material: { name: 'glass', color: 0xa4c4d9, roughness: 0.24 } },
  ], {
    bearing: 0, elevation: 0, height: 45.7,
    replaces: ['way/481451917', 'way/481417424', 'way/481417422', 'way/1153949919', 'way/481417416', 'way/481417431', 'way/481417423',
      'way/481417418', 'way/481417420', 'way/481509203', 'way/481417426', 'way/481417428', 'way/481451919', 'way/481451918'],
  }, 6500)
}

if (import.meta.main) buildGetty()
