/**
 * Los Angeles City Hall — procedural, CC0-1.0, no textures.
 *
 *   bun generators/la-city-hall.ts
 *
 * Also the small kit the other B2 Civic Center models import
 * (`la-union-station`, `la-cathedral`): softened prisms with bevelled tops,
 * ear-clipped caps, wall panels and arched panels, hip and gable roofs,
 * stepped pyramids. Importing this file builds nothing; City Hall is only
 * written when it is run directly.
 *
 * Frame: x toward Main Street (south-east), y toward Temple Street
 * (north-east), z up, metres; placed at bearing 37.8°, the long axis of the
 * OSM outline. Origin is the centre of the tower, 0.25 m from the outline's
 * area centroid, so the model is symmetrical about both axes where the
 * building is.
 *
 * Evidence
 * - OSM relation/6333145 (outline with five courtyards as inner rings) and
 *   building:parts way/443103746 (wings, 46.5 m, gabled red tile,
 *   roof:height 4), way/443103747 (tower, 110 m), way/443103748 (tower,
 *   98.5 m), way/443103750 (top square, 121.6 m), way/443103749 (pyramid,
 *   138.4 m, roof:height 11). All transformed to this frame and used as
 *   given, mirrored about the tower where the plan is symmetrical.
 * - LA County LARIAC 2020 lidar footprint 202000039849: 138.62 m above the
 *   lowest ground (its ELEV is the roof top, 226.71 m; the lowest ground
 *   under the footprint is 88.1 m). Published: 138 m / 454 ft, 32 floors
 *   (Wikipedia). OSM part heights agree with the lidar top.
 * - USGS 3DEP bare earth (EPSG:3857 getSamples): Spring Street side 94.1 m,
 *   Main Street side 88.3–89.4 m, so the ground falls ~6 m from west to
 *   east; y = 0 is the Main Street side. The Spring Street front (west)
 *   starts its detail 6 m up.
 * - USGS NAIP ortho: red tile hip roofs on the two long wings either side of
 *   the tower, flat roofs elsewhere, courtyards.
 * - Photos (Wikimedia Commons):
 *   - "Los Angeles City Hall dllu.jpg", Daniel L. Lu, CC BY-SA 4.0 — west
 *     (Spring St) front, head-on: tower widths, shoulders, colonnade,
 *     lantern, pyramid, wings, loggia with five arches.
 *   - "Los Angeles City Hall (from the West).jpg", Tim Ahem, CC BY 3.0 —
 *     high oblique from the west: corner buttresses, colonnade on two faces.
 *   - "Los Angeles City Hall 2008.jpg", Andreas Praefcke, CC BY 3.0 — west
 *     front from the south-west.
 *   - "Looking north on Main St from 1st St, Los Angeles 2020 ...", Keizers,
 *     CC BY-SA 4.0 — south and east faces of the tower from the south-east.
 *   - "Los Angeles City Hall 2013.jpg", Michael J Fromholtz, public domain —
 *     tower and wings from the south-west.
 *   - "Los Angeles City Hall 08.jpg", Visitor7, CC BY-SA 3.0 — podium
 *     elevation: granite base, tall arched windows, cornice.
 *
 * Measured: outline, courtyards, part plans and heights (OSM + lidar),
 * ground slope (3DEP). Published: overall height. Estimated from photos:
 * podium height (23.5 m), wing eave (42.5 m; OSM gives the 46.5 m ridge and
 * the 4 m roof), the corner buttresses' size and stepped tops, the
 * colonnade's depth, lantern/pyramid split, window bay counts and groups,
 * the loggia's arches. Doubt: OSM gives the Spring/Main arm 110 m and the
 * Temple/1st arm 98.5 m, but photos from the west and from the south-east
 * both show the outer arms stopping at the same shoulder with a 20 m core
 * carrying on, so the tower is modelled four-way symmetrical: arms to
 * 98.5 m, core to 121.6 m. Courtyard floors (z 9) are invented.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'

export type XY = [number, number]

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
export const rot = ([x, y]: XY, deg: number): XY => {
  const a = (deg * Math.PI) / 180
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]
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
  for (const [a, b, c] of triangulate(r)) {
    const A: V3 = [r[a][0], r[a][1], z], B: V3 = [r[b][0], r[b][1], z], C: V3 = [r[c][0], r[c][1], z]
    if (up) p.tri(A, B, C); else p.tri(A, C, B)
  }
}

/** A cap with rectangular-ish holes: each hole joined to the outline by a slit. */
export function capHoles(p: Part, r: XY[], holes: XY[][], z: number) {
  let ring = ccw(r)
  for (const h0 of holes) {
    const h = area(h0) > 0 ? h0.slice().reverse() : h0.slice()
    let best = [0, 0], d = Infinity
    for (let i = 0; i < ring.length; i++) for (let k = 0; k < h.length; k++) {
      const e = Math.hypot(ring[i][0] - h[k][0], ring[i][1] - h[k][1])
      if (e < d) { d = e; best = [i, k] }
    }
    const [i, k] = best, hk = [...h.slice(k), ...h.slice(0, k), h[k]]
    ring = [...ring.slice(0, i + 1), ...hk, ...ring.slice(i)]
  }
  cap(p, ring, z)
}

/** A flat cap over an axis-aligned rectangle less axis-aligned rectangular holes. */
export function capRects(p: Part, outer: [number, number, number, number], holes: [number, number, number, number][], z: number) {
  const xs = [...new Set([outer[0], outer[2], ...holes.flatMap((h) => [h[0], h[2]])])].filter((x) => x >= outer[0] && x <= outer[2]).sort((a, b) => a - b)
  const ys = [...new Set([outer[1], outer[3], ...holes.flatMap((h) => [h[1], h[3]])])].filter((y) => y >= outer[1] && y <= outer[3]).sort((a, b) => a - b)
  const open = (x: number, y: number) => holes.some((h) => x > h[0] && x < h[2] && y > h[1] && y < h[3])
  for (let j = 0; j < ys.length - 1; j++) {
    const y0 = ys[j], y1 = ys[j + 1], ym = (y0 + y1) / 2
    let start = -1
    for (let i = 0; i <= xs.length - 1; i++) {
      const solid = i < xs.length - 1 && !open((xs[i] + xs[i + 1]) / 2, ym)
      if (solid && start < 0) start = i
      if (!solid && start >= 0) {
        p.quad([xs[start], y0, z], [xs[i], y0, z], [xs[i], y1, z], [xs[start], y1, z])
        start = -1
      }
    }
  }
}

/** Plain flat-shaded walls of a counter-clockwise ring, facing out (or in, for a hole). */
export function walls(p: Part, r: XY[], z0: number, z1: number, inward = false) {
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
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: [V3, V3, V3, V3]) {
  p.tri(a, b, c, undefined, undefined, undefined, [n[0], n[1], n[2]])
  p.tri(a, c, d, undefined, undefined, undefined, [n[0], n[2], n[3]])
}

/**
 * A softened ring: convex corners cut by `r` and shaded round, concave
 * corners left sharp. Each point carries the normal of the edge arriving at
 * it and of the edge leaving it.
 */
export function soften(ring: XY[], r = 0.45) {
  const R = ccw(ring)
  const pts: XY[] = [], nin: V3[] = [], nout: V3[] = []
  for (let i = 0; i < R.length; i++) {
    const a = R[(i + R.length - 1) % R.length], b = R[i], c = R[(i + 1) % R.length]
    const l0 = Math.hypot(b[0] - a[0], b[1] - a[1]), l1 = Math.hypot(c[0] - b[0], c[1] - b[1])
    const u: XY = [(b[0] - a[0]) / l0, (b[1] - a[1]) / l0], v: XY = [(c[0] - b[0]) / l1, (c[1] - b[1]) / l1]
    const n0: V3 = [u[1], -u[0], 0], n1: V3 = [v[1], -v[0], 0]
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
export function prism(wall: Part, top: Part | null, ring: XY[], z0: number, z1: number, o: { corner?: number; bevel?: number; bottom?: Part } = {}): Prism {
  const corner = o.corner ?? 0.45, bevel = Math.min(o.bevel ?? 0.4, (z1 - z0) * 0.4)
  const s = soften(ring, corner)
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

/** A flat-topped ring band standing proud of a wall line by `out`: a cornice or string course. */
export function band(p: Part, ring: XY[], z0: number, z1: number, out = 0.35) {
  prism(p, null, inset(ccw(ring), -out), z0, z1, { corner: 0.3, bevel: Math.min(0.3, (z1 - z0) / 2) })
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
 * A hip roof over a rectangle given by its four corners (counter-clockwise),
 * eaves at z, rising `rise` to a ridge along the longer side. `hips`
 * chooses which ends are hipped ([start, end] of the long axis); an
 * unhipped end is a gable, and its triangle is drawn in `gable`.
 */
export function hipRoof(p: Part, c: XY[], z: number, rise: number, o: { hips?: [boolean, boolean]; gable?: Part } = {}) {
  let [A, B, C, D] = ccw(c)
  if (wallLen(A, B) < wallLen(B, C)) [A, B, C, D] = [B, C, D, A]
  // A→B and C→D are the long sides.
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
}

/** A stepped pyramid: `steps` risers from half-size h0 at z0 to h1 at z1, square about (cx, cy). */
export function steppedPyramid(riser: Part, tread: Part, cx: number, cy: number, h0: number, h1: number, z0: number, z1: number, steps: number) {
  const dz = (z1 - z0) / steps, dh = (h0 - h1) / steps
  for (let k = 0; k < steps; k++) {
    const h = h0 - k * dh, za = z0 + k * dz, zb = za + dz
    const sq = rect(cx - h, cy - h, cx + h, cy + h)
    walls(riser, sq, za, zb)
    const inner = rect(cx - h + dh, cy - h + dh, cx + h - dh, cy + h - dh)
    if (k < steps - 1) for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      tread.quad([sq[i][0], sq[i][1], zb], [sq[j][0], sq[j][1], zb], [inner[j][0], inner[j][1], zb], [inner[i][0], inner[i][1], zb])
    } else cap(tread, sq, zb)
  }
}

// ---------------------------------------------------------------------------
// Output

export function save(id: string, name: string, parts: Array<{ part: Part; material: Swatch }>, extras: Record<string, unknown>, maxTris = 5000) {
  const used = parts.filter((p) => p.part.triangles > 0)
  if (used.length > 6) throw new Error(`${id}: ${used.length} materials`)
  const triangles = used.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${id}: ${triangles} triangles`)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...extras })
  if (glb.length > 250 * 1024) throw new Error(`${id}: ${glb.length} bytes`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

// ---------------------------------------------------------------------------
// City Hall

function build() {
  const stone = new Part(), granite = new Part(), win = new Part(), roof = new Part(), tile = new Part(), door = new Part()

  /** Ground falls from Spring St (west, z 6) to Main St (east, z 0). */
  const ground = (x: number) => Math.max(0, Math.min(6, (6 * (38.2 - x)) / 76.4))

  // --- Podium: the whole block at 23.5 m, five courtyards open to the sky.
  const PX = 38.2, PY = 65.5, PODIUM = 25, COURT = 9
  const podium: XY[] = rect(-PX, -PY, PX, PY)
  const courts: XY[][] = [
    rect(-21.3, 22.5, -9.9, 49.3),
    rect(-20.0, -49.0, -9.9, -22.4),
    rect(-35.3, -11.5, -16.5, 11.9),
    rect(9.9, -26.1, 21.3, -10.6),
    rect(9.9, 10.9, 21.7, 26.1),
  ]
  // Walls: granite base, then stone to a bevelled cornice.
  const base = soften(podium, 0.45)
  {
    const P = base.pts, n = P.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      if (wallLen(P[i], P[j]) < 1e-6) continue
      const ni = base.nout[i], nj = base.nin[j]
      const zg = Math.max(ground(P[i][0]), ground(P[j][0])) + 3.2
      quadN(granite, [P[i][0], P[i][1], 0], [P[j][0], P[j][1], 0], [P[j][0], P[j][1], zg], [P[i][0], P[i][1], zg], [ni, nj, nj, ni])
      quadN(stone, [P[i][0], P[i][1], zg], [P[j][0], P[j][1], zg], [P[j][0], P[j][1], PODIUM - 0.5], [P[i][0], P[i][1], PODIUM - 0.5], [ni, nj, nj, ni])
    }
    const T = inset(P, 0.5)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      if (wallLen(P[i], P[j]) < 1e-6) continue
      const ni = unit3([base.nout[i][0], base.nout[i][1], 0.35]), nj = unit3([base.nin[j][0], base.nin[j][1], 0.35])
      quadN(stone, [P[i][0], P[i][1], PODIUM - 0.5], [P[j][0], P[j][1], PODIUM - 0.5], [T[j][0], T[j][1], PODIUM], [T[i][0], T[i][1], PODIUM], [ni, nj, UP, UP])
    }
  }
  // Podium roof: the outline less the courtyards and less what the wings
  // and tower stand on (they cap themselves higher up).
  const wingRect = rect(-9.9, -50.2, 9.9, 50.2)
  capRects(roof, [-PX + 0.5, -PY + 0.5, PX - 0.5, PY - 0.5], courts.map((c) => [c[0][0], c[0][1], c[2][0], c[2][1]] as [number, number, number, number]), PODIUM)
  for (const c of courts) {
    walls(stone, ccw(c), COURT, PODIUM, true)
    cap(roof, ccw(c), COURT)
  }

  // Podium elevations: tall arched windows on the main floor, a row of
  // square windows above, one panel per real opening, bay 4.6 m.
  const podiumWalls: [XY, XY, number][] = [
    [[-PX, -PY], [PX, -PY], 0], // 1st St (south end)
    [[PX, -PY], [PX, PY], 0], // Main St (east)
    [[PX, PY], [-PX, PY], 0], // Temple St (north end)
    [[-PX, PY], [-PX, 17.4], 0], // Spring St, north of the loggia
    [[-PX, -17.4], [-PX, -PY], 0], // Spring St, south of the loggia
  ]
  for (const [a, b] of podiumWalls) {
    const L = wallLen(a, b)
    const n = Math.max(1, Math.round((L - 4) / 4.6))
    const g = Math.max(ground(a[0]), ground(b[0]))
    bays(win, a, b, { n, margin: 2, fill: 0.5, arch: true, rows: [[g + 4.4, g + 11.6]] })
    bays(win, a, b, { n, margin: 2, fill: 0.42, rows: rows(g + 13.2, PODIUM - 1.2, 2.2, 1.8) })
  }

  // Spring Street loggia: five round arches across the entrance pavilion,
  // which stands a little above the podium.
  {
    const a: XY = [-41.1, 17.4], b: XY = [-41.1, -17.4]
    prism(stone, roof, rect(-41.1, -17.4, -35.3, 17.4), 0, 25.2, { bevel: 0.5 })
    // Five arches 4.3 m wide on a 5.2 m rhythm, centred on the front.
    for (let k = -2; k <= 2; k++) {
      const s = 17.4 + k * 5.2
      archPanel(door, a, b, s - 2.15, s + 2.15, 6.2, 16.2, 0.06)
    }
    bays(win, a, b, { n: 5, s0: 17.4 - 13, s1: 17.4 + 13, fill: 0.36, rows: [[18.6, 21.4]] })
    // Plain flanks at each end of the pavilion, as in the photos.
  }

  // --- Wings: ten storeys on the long axis either side of the tower, red
  // tile hip roofs. The east arm behind the tower is flat-roofed.
  const EAVE = 45, RIDGE = 48.5
  prism(stone, roof, wingRect, 0, EAVE, { bevel: 0.6 })
  prism(stone, roof, rect(9.9, -10.15, 27.4, 10.15), 0, EAVE, { bevel: 0.6 })
  for (const sgn of [-1, 1]) {
    const y0 = sgn * 17.2, y1 = sgn * 48.9
    hipRoof(tile, rect(-8.6, Math.min(y0, y1), 8.6, Math.max(y0, y1)), EAVE, RIDGE - EAVE)
  }
  // Wing windows above the podium: two-storey groups, bays of two windows.
  for (const sgn of [-1, 1]) {
    const yA = sgn * 15.75, yB = sgn * 50.2
    const lo = Math.min(yA, yB), hi = Math.max(yA, yB)
    const wrows = [[26.8, 33.4], [35, 41.6]] as [number, number][]
    bays(win, [-9.9, hi], [-9.9, lo], { n: 7, margin: 0.8, fill: 0.62, rows: wrows })
    bays(win, [9.9, lo], [9.9, hi], { n: 7, margin: 0.8, fill: 0.62, rows: sgn > 0 ? [[26.8, 33.4], [35, 41.6]] : wrows })
    // The wing ends, over the courtyards and podium roof.
    if (sgn > 0) bays(win, [9.9, 50.2], [-9.9, 50.2], { n: 4, margin: 1.2, fill: 0.6, rows: wrows })
    else bays(win, [-9.9, -50.2], [9.9, -50.2], { n: 4, margin: 1.2, fill: 0.6, rows: wrows })
  }
  bays(win, [27.4, 10.15], [15.75, 10.15], { n: 2, margin: 0.8, fill: 0.62, rows: [[26.8, 33.4], [35, 41.6]] })
  bays(win, [15.75, -10.15], [27.4, -10.15], { n: 2, margin: 0.8, fill: 0.62, rows: [[26.8, 33.4], [35, 41.6]] })
  bays(win, [27.4, -10.15], [27.4, 10.15], { n: 4, margin: 1.2, fill: 0.6, rows: [[26.8, 33.4], [35, 41.6]] })

  // --- Tower. Cross-shaped shaft (arms 20.3 m wide, 31.5 m across) with
  // its re-entrant corners stepped by corner buttresses, to the shoulders.
  const A = 15.75, C = 10.15, K = 12.95
  const shaft: XY[] = []
  for (let q = 0; q < 4; q++) {
    // From the +x arm round to the +y arm; each quadrant is the same turned.
    const quarter: XY[] = [[A, C], [K, C], [K, K], [C, K], [C, A]]
    for (const p of quarter) shaft.push(rot(p, q * 90))
  }
  const SHOULDER = 101, CORE = 112, CORNICE = 125.5, LANTERN = 130, TOP = 138.4
  prism(stone, roof, shaft, 0, SHOULDER, { bevel: 0.5 })
  // Corner buttresses carry on above the shoulders beside the core, in two
  // steps, as the photos show them flanking the colonnade.
  for (let q = 0; q < 4; q++) {
    const sq = rect(C - 0.01, C - 0.01, K, K).map((p) => rot(p, q * 90))
    prism(stone, roof, sq, SHOULDER - 0.5, 116.5, { bevel: 0.4 })
    const sq2 = rect(C - 0.01, C - 0.01, C + 1.5, C + 1.5).map((p) => rot(p, q * 90))
    prism(stone, roof, sq2, 116, 119.5, { bevel: 0.35 })
  }
  // Core: frieze storey and windows, then the recessed colonnade under a
  // full-width entablature.
  prism(stone, roof, rect(-C, -C, C, C), SHOULDER - 0.5, CORE, { bevel: 0.01, corner: 0.3 })
  prism(stone, null, rect(-9.35, -9.35, 9.35, 9.35), CORE - 0.1, 121.6, { bevel: 0.01, corner: 0.2 })
  prism(stone, roof, rect(-C, -C, C, C), 121.5, CORNICE, { bevel: 0.45, corner: 0.3 })
  // Lantern and the stepped pyramid.
  prism(stone, null, rect(-7.3, -7.3, 7.3, 7.3), CORNICE - 0.1, LANTERN, { bevel: 0.3, corner: 0.3 })
  steppedPyramid(roof, roof, 0, 0, 7.3, 2.3, LANTERN, TOP, 10)

  // Tower windows: five bays in the middle of each arm face between broad
  // plain piers, grouped two storeys to a panel.
  for (let q = 0; q < 4; q++) {
    const a = rot([A, -C], q * 90), b = rot([A, C], q * 90)
    const from = q === 2 ? 26.5 : 47 // west face over the forecourt courtyard; the others over the wings
    bays(win, a, b, { n: 5, s0: 3.2, s1: 2 * C - 3.2, fill: 0.68, rows: rows(from, SHOULDER - 1.8, 6.3, 1.5) })
    // Core: a row of windows over the frieze, and the colonnade: five tall
    // openings between four columns.
    const ca = rot([C, -C], q * 90), cb = rot([C, C], q * 90)
    bays(win, ca, cb, { n: 5, s0: 3.2, s1: 2 * C - 3.2, fill: 0.55, rows: [[107, 110.6]] })
    const pa = rot([9.35, -9.35], q * 90), pb = rot([9.35, 9.35], q * 90)
    bays(win, pa, pb, { n: 5, s0: 2.6, s1: 18.7 - 2.6, fill: 0.7, rows: [[113.2, 121]] })
    // Lantern: a band of five small windows.
    const la = rot([7.3, -7.3], q * 90), lb = rot([7.3, 7.3], q * 90)
    bays(win, la, lb, { n: 5, s0: 3.4, s1: 14.6 - 3.4, fill: 0.6, rows: [[126.6, 128.8]] })
  }

  save('la-city-hall', 'Los Angeles City Hall', [
    { part: stone, material: PALETTE.stone },
    { part: granite, material: finish('granite', 0xd8d2c6) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: tile, material: PALETTE.terracotta },
    { part: door, material: PALETTE.entrance },
  ], { bearing: 37.8, anchor: [34.0536925, -118.2427693], height: TOP, osm: 'relation/6333145' }, 6500)
}

if (import.meta.main) build()
