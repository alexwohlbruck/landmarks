/**
 * Zifeng Tower (紫峰大厦, Greenland Square Zifeng Tower / Nanjing Greenland
 * Financial Center), Gulou, Nanjing — original procedural geometry, CC0-1.0.
 * bun generators/nanjing-zifeng-tower.ts   (writes the low model and the detail LOD)
 *
 * Also the shared kit for this builder's towers (nanjing-, suzhou-, ningbo-,
 * nanning-): rounded polygons, half-plane clipping, offsets, lofted walls.
 *
 * Frame: bearing 0. Origin = area centroid of the complex outline
 * way/1567789358 (118.7778115 E, 32.0628836 N), on the ground; the tower
 * stands in the outline's south-east part, the podium fills the rest.
 * Elevation 0.
 *
 * Form, as read from OSM and the photos (SOM, Adrian Smith, 2010):
 * - a triangular plan with rounded corners (west, south, north-east): the
 *   south-west and east faces straight, the north face bowed out;
 * - the main body in two stages: a lower block to the sky lobby at ~150 m,
 *   then a dark recessed sky-lobby band with columns (150-164 m), then the
 *   narrower upper block to the main roof at ~311 m (the setback is on the
 *   north and west, the east face runs straight through);
 * - a separate rounded column (the "ridge") wraps the south corner from the
 *   ground to ~335 m, standing above the main roof, set apart from the body
 *   by a dark slot crossed by zig-zag steel braces;
 * - on the roof a wide glass drum (to ~333 m) and a narrower glass cylinder
 *   (to the 381 m roof), and beside them the mast, with collars and a thick
 *   antenna section, to 450 m;
 * - the "dragon scale" glass: every panel tilts out at its top, so the walls
 *   read as stacked rows of scales; drawn as tiers whose tops stand proud of
 *   their feet, with an up-facing ledge between rows (the detail model at
 *   two floors a row, the low model at five).
 *
 * Evidence
 * - OSM, fetched 2026-11-27 with tools/osm.py: outline way/1567789358
 *   (紫峰大厦, wikidata Q382121; the Wikidata id checked on the OSM way) and its
 *   parts way/1567789343-1567789357 (podium 0-22-34-45 m, a west block to
 *   81 m, the tower in stepped parts: 137-150-164 m at the sky lobby, the main
 *   roof 311 m, a drum and a south-corner strip to 333 m, the cylinder to
 *   369 m, the mast to 450.9 m at 118.77812 E 32.06260 N).
 * - Published: 450 m to the top of the spire, roof 381 m, 89 floors (66 above
 *   ground in the main block, offices then hotel), SOM, completed 2010
 *   (Wikipedia "Zifeng Tower"; CTBUH Skyscraper Center).
 * - Photos (Wikimedia Commons):
 *   "Zifeng Tower in 2017.jpg", Haha169, CC BY-SA 4.0, from the west at height:
 *   the stages, crown, ridge and mast heights (scaled from 450 m and 381 m);
 *   https://commons.wikimedia.org/wiki/File:Zifeng_Tower_in_2017.jpg
 *   "Zifeng Tower 2017.jpg", Haha169, CC BY-SA 4.0, the same side: check;
 *   https://commons.wikimedia.org/wiki/File:Zifeng_Tower_2017.jpg
 *   "Zifeng Tower 8.jpg" and "Zifeng Tower 1.jpg", 钉钉, CC BY-SA 4.0, from the
 *   street (north-west): the scales, the braced slot, the ridge, the podium;
 *   https://commons.wikimedia.org/wiki/File:Zifeng_Tower_8.jpg
 *   https://commons.wikimedia.org/wiki/File:Zifeng_Tower_1.jpg
 *   "Zifeng Tower (Shot from Metro Mansion), Aug 18 2023.jpg", A Chinese ID,
 *   CC BY-SA 4.0, distant: the silhouette;
 *   https://commons.wikimedia.org/wiki/File:Zifeng_Tower_(Shot_from_Metro_Mansion),_Aug_18_2023.jpg
 *   "Nanjing Zifeng Tower 紫峰大厦2.jpg", _大面, CC BY 2.5, skyline at sunset;
 *   https://commons.wikimedia.org/wiki/File:Nanjing_Zifeng_Tower_%E7%B4%AB%E5%B3%B0%E5%A4%A7%E5%8E%A62.jpg
 * - No lidar, NAIP or Mapillary used (none open here). Look-only references: none.
 *
 * Numbers
 * - Published: 450 m mast top, 381 m cylinder roof.
 * - Measured (OSM): the outline, the podium parts and heights, the tower's
 *   plan corners (lower block W -15,-2 / S 32,-49.5 / NE 48,19; upper W
 *   -9.5,-7.6 / NE 47,11.5), the sky lobby at 150-164 m, main roof 311 m,
 *   ridge and drum 333 m, the mast position.
 * - Measured (photo, from the west, scaled): drum ~25 m wide, cylinder ~17 m,
 *   the ridge ~15 m wide on the south-west face, ridge top ~335 m.
 * - Estimated: the slot (3 m wide, 2 m deep), the scale tilt (0.45 m), mast
 *   collars and antenna section, colours sampled from the photos (glass
 *   #5d7ea1-#82a0b6, podium #a39f8f-#a7a491), pulled to the palette.
 *
 * Doubts
 * - OSM's west block (81 m) inside the outline is drawn as OSM has it; no
 *   photo shows it clearly.
 * - The ridge's split from the body on the east face is from OSM's 311-333 m
 *   strip; the east side is seen only obliquely in the photos.
 *
 * Night: the glass glows as windows (`window`; the crown glass `window-3`;
 * the sky-lobby band and slot `window-2`); the mast is floodlit.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { saveLods, bar, face, prism, type Layer, type XY } from './auckland-sky-tower'
import { grid, flat } from './shenzhen-ping-an-finance-centre'

// ---- Kit (shared by this builder's towers) ----------------------------------------------------------------

const qb = (a: XY, c: XY, b: XY, t: number): XY => [
  (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
  (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1],
]
export const area2 = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
export const ccwXY = (r: XY[]) => (area2(r) < 0 ? [...r].reverse() : r)

/**
 * A convex polygon with rounded corners and bowed edges. `corners` counter-clockwise;
 * `sag[i]` bows edge i (corner i to i+1) outward by that many metres at its middle;
 * `rad[i]` is how far back from corner i its fillet starts along each edge.
 */
export function roundedPoly(corners: XY[], sag: number[], rad: number[], nEdge = 4, nFil = 3): XY[] {
  const n = corners.length, out: XY[] = []
  const edge = (i: number) => {
    const a = corners[i], b = corners[(i + 1) % n]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L
    const c: XY = [(a[0] + b[0]) / 2 + nx * 2 * sag[i], (a[1] + b[1]) / 2 + ny * 2 * sag[i]]
    return { a, b, c, L }
  }
  for (let i = 0; i < n; i++) {
    const e = edge(i), en = edge((i + 1) % n)
    const t0 = rad[i] / e.L, t1 = 1 - rad[(i + 1) % n] / e.L
    for (let k = 0; k < nEdge; k++) out.push(qb(e.a, e.c, e.b, t0 + ((t1 - t0) * k) / nEdge))
    // fillet at corner i+1, from this edge's end to the next edge's start
    const p0 = qb(e.a, e.c, e.b, t1), p1 = qb(en.a, en.c, en.b, rad[(i + 1) % n] / en.L)
    for (let k = 0; k < nFil; k++) out.push(qb(p0, e.b, p1, k / nFil))
  }
  return out
}

/** A polygon vertex, with whether the edge from it to the next one lies on a clip line. */
export type CV = { p: XY; cut: boolean }

/** Keep the part of a convex polygon where dot(p, n) >= c (Sutherland-Hodgman), marking the new edge. */
export function clipHalf(poly: CV[] | XY[], n: XY, c: number): CV[] {
  const P: CV[] = (poly as (CV | XY)[]).map((v) => (Array.isArray(v) ? { p: v as XY, cut: false } : v))
  const f = (p: XY) => p[0] * n[0] + p[1] * n[1] - c
  const out: CV[] = []
  for (let i = 0; i < P.length; i++) {
    const A = P[i], B = P[(i + 1) % P.length], fa = f(A.p), fb = f(B.p)
    if (fa >= 0) out.push({ p: A.p, cut: A.cut })
    if ((fa >= 0) !== (fb >= 0)) {
      const t = fa / (fa - fb), q: XY = [A.p[0] + (B.p[0] - A.p[0]) * t, A.p[1] + (B.p[1] - A.p[1]) * t]
      // entering the kept side: the new vertex starts an original edge; leaving: it starts the cut edge
      out.push({ p: q, cut: fa >= 0 ? true : A.cut })
    }
  }
  return out
}

/**
 * Remove from a convex polygon the region where dot(p, n1) >= c1 and dot(p, n2) >= c2 (a corner
 * quadrant), leaving a notched polygon; the notch's two sides are marked as cut.
 */
export function notch(poly: XY[], n1: XY, c1: number, n2: XY, c2: number): CV[] {
  const f = (p: XY) => Math.min(p[0] * n1[0] + p[1] * n1[1] - c1, p[0] * n2[0] + p[1] * n2[1] - c2)
  const det = n1[0] * n2[1] - n1[1] * n2[0]
  const corner: XY = [(c1 * n2[1] - c2 * n1[1]) / det, (n1[0] * c2 - n2[0] * c1) / det]
  const cross = (a: XY, b: XY): XY => {
    let lo = 0, hi = 1
    for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2, q: XY = [a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m]; if ((f(q) >= 0) === (f(a) >= 0)) lo = m; else hi = m }
    return [a[0] + (b[0] - a[0]) * lo, a[1] + (b[1] - a[1]) * lo]
  }
  const out: CV[] = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], ina = f(a) >= 0, inb = f(b) >= 0
    if (!ina) out.push({ p: a, cut: false })
    if (!ina && inb) { out.push({ p: cross(a, b), cut: true }); out.push({ p: corner, cut: true }) }
    if (ina && !inb) out.push({ p: cross(a, b), cut: false })
  }
  return out
}

/** Miter offset of a convex counter-clockwise polygon (d > 0 grows it). */
export function offsetPoly(poly: XY[], d: number): XY[] {
  const n = poly.length
  return poly.map((p, i) => {
    const a = poly[(i - 1 + n) % n], b = poly[(i + 1) % n]
    const e0 = norm2([p[0] - a[0], p[1] - a[1]]), e1 = norm2([b[0] - p[0], b[1] - p[1]])
    const n0: XY = [e0[1], -e0[0]], n1: XY = [e1[1], -e1[0]]
    const m = norm2([n0[0] + n1[0], n0[1] + n1[1]]), cs = Math.max(0.3, m[0] * n1[0] + m[1] * n1[1])
    return [p[0] + (m[0] * d) / cs, p[1] + (m[1] * d) / cs] as XY
  })
}
export const norm2 = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/** Whether vertex i of a ring is a smooth (shallow) turn, so normals may be shared across it. */
export const smoothAt = (poly: XY[], deg = 28) => (i: number) => {
  const n = poly.length, a = poly[(i - 1 + n) % n], p = poly[i % n], b = poly[(i + 1) % n]
  const e0 = norm2([p[0] - a[0], p[1] - a[1]]), e1 = norm2([b[0] - p[0], b[1] - p[1]])
  return e0[0] * e1[0] + e0[1] * e1[1] > Math.cos((deg * Math.PI) / 180)
}

/**
 * Walls of a vertical body whose plan is `poly` (counter-clockwise), lofted through
 * `levels`: [z, offset] pairs bottom to top (offset grows the plan by that many metres).
 * `pick(i, k)` picks the part for edge i, row k.
 */
export function walls(poly: XY[], levels: [number, number][], pick: (i: number, k: number) => Part | null, deg = 28) {
  const g: V3[][] = levels.map(([z, o]) => offsetPoly(poly, o).map(([x, y]) => [x, y, z] as V3))
  grid(g, true, pick, smoothAt(poly, deg))
}

/** Scale tiers: rows `h` tall from z0 to z1, each row's foot inset `a` and its top flush, with up-facing ledges. */
export function scaleLevels(z0: number, z1: number, h: number, a: number): [number, number][] {
  const n = Math.max(1, Math.round((z1 - z0) / h)), out: [number, number][] = []
  for (let k = 0; k < n; k++) {
    const za = z0 + ((z1 - z0) * k) / n, zb = z0 + ((z1 - z0) * (k + 1)) / n
    out.push([za, -a], [zb, 0])
    if (k < n - 1) out.push([zb, -a])
  }
  return out
}

/** A vertical cylinder (n sides, smooth), optional top cap. */
export function cyl(p: Part, c: XY, r: number, z0: number, z1: number, n = 16, top = true, r1 = r) {
  const ring = (z: number, rr: number) => Array.from({ length: n }, (_, i) => [c[0] + rr * Math.cos((i / n) * 2 * Math.PI), c[1] + rr * Math.sin((i / n) * 2 * Math.PI), z] as V3)
  grid([ring(z0, r), ring(z1, r1)], true, () => p, () => true)
  if (top && r1 > 0.01) face(p, ring(z1, r1), [0, 0, 1])
}

// ---- Zifeng Tower ---------------------------------------------------------------------------------------

const H_ROOF = 311, H_LOBBY0 = 150, H_LOBBY1 = 164, H_RIDGE = 335
const H_DRUM = 333, H_CYL = 381, H_TOP = 450
const LOWER_C: XY[] = [[-15, -2], [32, -49.5], [48, 19]] // W, S, NE (counter-clockwise)
const UPPER_C: XY[] = [[-9.5, -7.6], [32, -49.5], [47, 11.5]]
const SAG = [0, 0.6, 8] // SW straight, E slightly bowed, N bowed out
const SAG_U = [0, 0.5, 7]
const RAD = [6, 9, 6]
// the ridge: the south corner east of x = 25.5 and south of y = -23 (OSM's 311-333 m strip); the slot between it and the body
const RX = 23, RY = -22
const GAP = 1.5 // half the slot width
const MAST: XY = [19.5, -29]
const DRUM_C: XY = [13, -10], DRUM_R = 12, CYL_C: XY = [15, -14], CYL_R = 7.8

type Set = { glass: Part; dark: Part; crown: Part; pod: Part; roof: Part; steel: Part }
const mk = (): Set => ({ glass: new Part(), dark: new Part(), crown: new Part(), pod: new Part(), roof: new Part(), steel: new Part() })

/** Podium parts from OSM, in the frame (metres about the outline centroid). */
const POD: [XY[], number, number][] = [
  // way/1567789357, 0-22 m
  [[[38.5, -47.4], [40.9, -44.7], [42.2, -41.4], [45.2, -15.6], [58.8, -11.1], [69.7, 41.5], [69.6, 47.3], [-36.7, 47.3], [-61.3, 25.3], [-76.5, 11.8], [-78.0, 9.2], [-78.8, 6.3], [-79.0, 3.3], [-78.5, 0.3], [-76.4, -3.7], [-8.6, -72.8], [15.1, -49.9], [25.2, -47.0], [28.2, -48.8], [31.8, -49.6], [35.3, -49.0]], 0, 22],
  // way/1567789356, 22-34 m
  [[[-64.0, -16.4], [-42.5, 4.5], [-19.5, -20.9], [-10.6, -9.1], [25.2, -47.0], [31.8, -49.6], [37.0, -48.3], [39.8, -46.1], [42.2, -41.4], [45.2, -15.6], [58.8, -11.1], [69.7, 41.5], [69.6, 47.3], [-36.7, 47.3], [-61.3, 25.3], [-76.5, 11.8], [-78.0, 9.2], [-78.8, 6.3], [-79.0, 3.3], [-78.5, 0.3], [-77.2, -2.4]], 22, 34],
  // way/1567789354 then way/1567789352: the west block, 34-81 m
  [[[-64.0, -16.4], [-42.5, 4.5], [-61.3, 25.3], [-76.5, 11.8], [-78.0, 9.2], [-79.0, 4.8], [-78.5, 0.3], [-76.4, -3.7]], 34, 81],
]

function build(s: Set, d: boolean) {
  const nE = d ? 7 : 3, nF = d ? 4 : 3
  const lower = roundedPoly(LOWER_C, SAG, RAD, nE, nF)
  const upper = roundedPoly(UPPER_C, SAG_U, RAD, nE, nF)
  const row = d ? 8.2 : 20.5, tilt = d ? 0.4 : 0.22

  // ---- the body: everything north-west of the slot
  const bodyOf = (poly: XY[]) => notch(poly, [1, 0], RX - GAP, [0, -1], -(RY + GAP))
  const ridgeOf = (poly: XY[]) => clipHalf(clipHalf(poly, [1, 0], RX + GAP), [0, -1], -(RY - GAP))
  const body = (cv: CV[], z0: number, z1: number, top: boolean, inset = 0, mat: Part = s.glass, rows = true) => {
    const poly = cv.map((v) => v.p)
    const lv = rows ? scaleLevels(z0, z1, row, tilt).map(([z, o]) => [z, o - inset] as [number, number]) : [[z0, -inset], [z1, -inset]] as [number, number][]
    walls(poly, lv, (i) => (cv[i].cut ? s.dark : mat))
    if (top) flat(s.roof, offsetPoly(poly, -inset), z1)
  }
  body(bodyOf(lower), 0, H_LOBBY0, true)
  // the sky-lobby band, recessed and dark, with its columns
  const ub = bodyOf(upper)
  body(ub, H_LOBBY0, H_LOBBY1, false, 1.8, s.dark, false)
  {
    const poly = ub.map((v) => v.p)
    const step = d ? 7 : 10.5
    for (let i = 0; i < poly.length; i++) {
      if (ub[i].cut) continue
      const a = poly[i], b = poly[(i + 1) % poly.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const t = norm2([b[0] - a[0], b[1] - a[1]]), nn: XY = [t[1], -t[0]]
      const m = Math.max(1, Math.round(L / step))
      for (let k = 0; k < m; k++) {
        if (L < 3) break
        const u = (k + 0.5) / m, c: XY = [a[0] + (b[0] - a[0]) * u - nn[0] * 0.7, a[1] + (b[1] - a[1]) * u - nn[1] * 0.7]
        bar(s.steel, [c[0], c[1], H_LOBBY0], [c[0], c[1], H_LOBBY1], 1.3, 1.4, [nn[0], nn[1], 0])
      }
    }
  }
  body(ub, H_LOBBY1, H_ROOF, true)

  // ---- the ridge: the rounded south-corner column, to 335 m
  body(ridgeOf(upper), 0, H_RIDGE, true)

  // ---- the slot between them: an L of dark back wall, 2 m in from the faces, with zig-zag braces at its mouths
  {
    const inner = offsetPoly(upper, -2.2)
    const g = GAP + 0.3
    const legW = clipHalf(clipHalf(clipHalf(inner, [1, 0], RX - g), [-1, 0], -(RX + g)), [0, -1], -(RY + g)).map((v) => v.p)
    const legS = clipHalf(clipHalf(clipHalf(inner, [0, -1], -(RY + g)), [0, 1], RY - g), [1, 0], RX - g).map((v) => v.p)
    for (const leg of [legW, legS]) if (leg.length > 2) prism(s.dark, leg, 0, H_ROOF, { top: true })
    if (d) {
      // the mouths: where x = RX meets the south-west face, and where y = RY meets the east face
      const mouths: [XY, XY][] = []
      // the x = RX line meets the outline twice; take the southern crossing for the SW mouth
      const sw = upper.map((a, i) => [a, upper[(i + 1) % upper.length]] as [XY, XY]).filter(([a, b]) => (a[0] - RX >= 0) !== (b[0] - RX >= 0))
        .map(([a, b]) => { const t = (a[0] - RX) / (a[0] - b[0]); return [RX, a[1] + (b[1] - a[1]) * t] as XY }).sort((p, q) => p[1] - q[1])[0]
      const ea = upper.map((a, i) => [a, upper[(i + 1) % upper.length]] as [XY, XY]).filter(([a, b]) => (a[1] - RY >= 0) !== (b[1] - RY >= 0))
        .map(([a, b]) => { const t = (a[1] - RY) / (a[1] - b[1]); return [a[0] + (b[0] - a[0]) * t, RY] as XY }).sort((p, q) => q[0] - p[0])[0]
      mouths.push([[sw[0] - GAP, sw[1] + 0.6], [sw[0] + GAP, sw[1] + 0.6]], [[ea[0] - 0.6, ea[1] + GAP], [ea[0] - 0.6, ea[1] - GAP]])
      for (const [L, R] of mouths) {
        const t = norm2([R[0] - L[0], R[1] - L[1]])
        const h = 14
        for (let z = 20, k = 0; z + h <= H_ROOF; z += h, k++) {
          const [p0, p1] = k % 2 ? [L, R] : [R, L]
          bar(s.steel, [p0[0], p0[1], z], [p1[0], p1[1], z + h], 0.7, 0.7, [-t[1], t[0], 0])
          bar(s.steel, [L[0], L[1], z + h], [R[0], R[1], z + h], 0.6, 0.6, [0, 0, 1])
        }
      }
    }
  }

  // ---- the crown: the wide drum and the cylinder, horizontally banded grey glass
  const seg = d ? 32 : 16
  if (d) {
    // banded: thin recessed joints every ~4.5 m
    for (const [c, r, z0, z1] of [[DRUM_C, DRUM_R, H_ROOF, H_DRUM], [CYL_C, CYL_R, H_DRUM, H_CYL]] as [XY, number, number, number][]) {
      const n = Math.round((z1 - z0) / 4.5)
      for (let k = 0; k < n; k++) {
        const za = z0 + ((z1 - z0) * k) / n, zb = z0 + ((z1 - z0) * (k + 1)) / n
        cyl(s.crown, c, r - 0.35, za, za + 0.6, seg, false)
        cyl(s.crown, c, r, za + 0.6, zb, seg, k === n - 1)
      }
    }
  } else {
    cyl(s.crown, DRUM_C, DRUM_R, H_ROOF, H_DRUM, seg)
    cyl(s.crown, CYL_C, CYL_R, H_DRUM, H_CYL, seg)
  }
  // a rim on the cylinder top
  cyl(s.steel, CYL_C, CYL_R + 0.4, H_CYL - 1.2, H_CYL + 0.4, seg, true)

  // ---- the mast
  const ms = d ? 12 : 8
  cyl(s.steel, MAST, 1.5, 300, 383, ms, false)
  for (const z of [318, 336, 352, 368]) cyl(s.steel, MAST, 2.6, z, z + 2.2, ms)
  // the antenna section: stacked discs in the detail, one drum in the low model
  if (d) {
    for (let z = 383; z < 419; z += 2.4) cyl(s.steel, MAST, 2.5, z, z + 1.6, ms, true, 2.5), cyl(s.steel, MAST, 1.7, z + 1.6, z + 2.4, ms, false)
  } else cyl(s.steel, MAST, 2.3, 383, 419, ms)
  cyl(s.steel, MAST, 1.0, 419, 432, ms, false, 0.8)
  cyl(s.steel, MAST, 0.6, 432, H_TOP, ms, false, 0.25)

  // ---- the podium (OSM parts)
  for (const [poly, z0, z1] of POD) {
    const pp = ccwXY(poly)
    prism(z1 > 50 ? s.dark : s.pod, pp, z0, z1, { top: false })
    flat(s.roof, pp, z1)
  }
}

// ---- Materials and output ----------------------------------------------------------------------------------

const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x6c8bab }
const DARK: MaterialSpec = windowVariant(2, 0x50687f)
const CROWN: MaterialSpec = windowVariant(3, 0x8a98a6)
const POD_M: MaterialSpec = finish('zifeng-podium', 0xc2bdae)
const ROOF: MaterialSpec = PALETTE.roof
const STEEL: MaterialSpec = { ...finish('zifeng-steel', 0xc3c8ce, 0.5), floodlight: (p) => (p[2] > 300 ? 0.9 : 0.3) }
const layers = (s: Set): Layer[] => [
  { part: s.glass, material: GLASS },
  { part: s.dark, material: DARK },
  { part: s.crown, material: CROWN },
  { part: s.pod, material: POD_M },
  { part: s.roof, material: ROOF },
  { part: s.steel, material: STEEL },
]

if (import.meta.main) {
  const low = mk(), det = mk()
  build(low, false)
  build(det, true)
  await saveLods('nanjing-zifeng-tower', 'Zifeng Tower', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM outline centroid, on the ground',
    bearing: 0, height: H_TOP,
  }, 5000)
}
