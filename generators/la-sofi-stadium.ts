/**
 * SoFi Stadium, Inglewood (2020, HKS) — procedural, CC0-1.0.
 * bun generators/la-sofi-stadium.ts
 *
 * What makes it SoFi from above and from the street: one huge leaf-shaped
 * canopy over the stadium, the American Airlines Plaza and the YouTube
 * Theater, with a sharp point at the north-east and a long one over the plaza
 * to the south-east; the pale translucent ETFE field over the bowl in broad
 * panels, ringed by the oval of the compression ring; the white aluminium rim
 * around it, which on the west side rolls down into a skirt that meets the
 * ground at the south-west; and the tall white columns the canopy floats on,
 * with the bowl's concourses visible between them. The bowl itself is sunk
 * 100 ft below grade, so only its top storeys stand above ground.
 *
 * Map frame: x east, y north before the turn; built in a frame turned to
 * bearing 336°, the long axis of the bowl (OSM way/860635712, fitted). The
 * anchor is the area centroid of OSM way/748790321 (building=stadium, the
 * outline of the stadium, its roof parts and the theater). Data below are in
 * metres east/north of the bowl's centroid (-118.33900, 33.95341) and are
 * shifted and turned to the anchor frame at the end.
 *
 * Ground: y = 0 is 38.0 m, the lowest grade under the canopy (a plane fitted
 * to USGS 3DEP outside the excavation: 41.38 + 0.00795 x + 0.01627 y, mean
 * residual 1.2 m), at the south edge. The site rises to 45 m at the north-east
 * point, so every height below is added to the plane's rise over 38.0 m and
 * the lower walls on the uphill side sink into the ground. 3DEP's current
 * bare earth also holds the bowl's excavation (30.5 m); if the map's terrain
 * has that hole the model will sit up to 7.5 m low.
 *
 * Sources:
 * - Plan: USGS NAIP orthophoto (0.25 m/px export, EPSG:3857): the canopy
 *   outline, the edge of the translucent ETFE field, the compression-ring
 *   oval and the panel grid's direction. OSM: way/860635712 (bowl,
 *   building:part=stadium), way/860635710 and way/860635711 (ETFE roof parts,
 *   whose outer edges are the ETFE field's edge in NAIP), way/963712167
 *   (YouTube Theater). OSM does not map the opaque rim, so the canopy outline
 *   is traced from NAIP; it is not true-ortho, and at 30-50 m up the edges may
 *   be a few metres out.
 * - Heights: no lidar. LA County's 2020 LARIAC footprints and its surface
 *   model both predate the stadium (they show the graded site, 34-40 m), so
 *   heights are published figures and photo proportions. Published: roof
 *   275 ft above the field and the field 100 ft below grade, so the canopy's
 *   top is about 175 ft (53 m) above grade (HKS, Walter P Moore, SGH); 37
 *   primary columns; 302 ETFE panels; a 12 ft seismic moat between bowl and
 *   canopy. Estimated from photos: the rim's height round the edge (26-27 m
 *   along the east and south, 32-34 m on the north and at the north-east
 *   point, falling to the ground at the south-west and to 3 m at the
 *   south-east point), the 3.5 m fascia, columns 2.8 m across, the theater
 *   16 m and the bowl's above-grade storeys 16 m.
 * - Photos (Wikimedia Commons): "SoFi Stadium 2021" and "SoFi Stadium 2023"
 *   (Troutfarm27, CC BY-SA 4.0; from the lake, south), "Aerial view of SoFi
 *   Stadium (July 2022)" (Benoît Prieur, CC0; from the north-west), "Aerial
 *   Photos of Los Angeles for SB56" 52272789545 and 52272561694 (usicegov,
 *   public domain; from the south and from the west), "SoFi Stadium
 *   (51162010487)" (Thank You (21 Millions+) views, CC BY 2.0; from the
 *   south-south-east), "SoFi Stadium East facade" (Redspork02, CC BY-SA 4.0),
 *   "SoFi (52372640610)" (Ron Reiring, CC BY 2.0; from the south-east),
 *   "So-Fi Stadium Exterior, Los Angeles" (Revisorius, CC BY-SA 4.0).
 * - Left out: the cable net and its lights, the Infinity Screen (hung inside,
 *   under the roof), the lettering on the roof and fascia, the plaza, lake,
 *   paving and planting, the seats in the bowl below grade.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const BEARING = 336
const ANCHOR: XY = [38.56, -33.13] // OSM outline centroid, from the bowl centroid
const G0 = 38.0
const ground = ([x, y]: XY) => 41.378 + 0.00795 * x + 0.01627 * y - G0

const etfe = new Part(), panel = new Part(), rim = new Part()
const stone = new Part(), grey = new Part(), win = new Part()

// ---------------------------------------------------------------------------
// Geometry helpers. Everything is authored in the north-up frame and turned
// once at the end (see `toModel`).

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

const B = (BEARING * Math.PI) / 180
/** North-up metres from the bowl centroid → model frame at the anchor. */
const toModel = ([x, y, z]: V3): V3 => {
  const dx = x - ANCHOR[0], dy = y - ANCHOR[1]
  return [dx * Math.cos(B) - dy * Math.sin(B), dx * Math.sin(B) + dy * Math.cos(B), z]
}
const rotN = ([x, y, z]: V3): V3 => [x * Math.cos(B) - y * Math.sin(B), x * Math.sin(B) + y * Math.cos(B), z]
/**
 * A quad wound to face `hint` (north-up frame); degenerate halves skipped.
 * `ns` gives smooth per-corner normals, so neighbouring quads share vertices.
 */
function quad(p: Part, P: V3[], hint: V3, ns?: V3[]) {
  const f = add(cross(sub(P[1], P[0]), sub(P[2], P[0])), cross(sub(P[2], P[0]), sub(P[3], P[0])))
  const o = dot(f, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const t = (a: number, b: number, c: number) => {
    const A = P[o[a]], Bp = P[o[b]], C = P[o[c]]
    if (Math.hypot(...cross(sub(Bp, A), sub(C, A))) < 1e-6) return
    p.tri(toModel(A), toModel(Bp), toModel(C), undefined, undefined, undefined, ns && [rotN(ns[o[a]]), rotN(ns[o[b]]), rotN(ns[o[c]])])
  }
  t(0, 1, 2)
  t(0, 2, 3)
}
function tri(p: Part, A: V3, Bp: V3, C: V3, hint: V3) {
  if (dot(cross(sub(Bp, A), sub(C, A)), hint) >= 0) p.tri(toModel(A), toModel(Bp), toModel(C))
  else p.tri(toModel(A), toModel(C), toModel(Bp))
}

/** A closed polyline resampled to n points evenly along its length, starting at poly[0]. */
function resampleClosed(poly: XY[], n: number): XY[] {
  const pts = [...poly, poly[0]]
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const L = cum[cum.length - 1]
  const out: XY[] = []
  let j = 0
  for (let k = 0; k < n; k++) {
    const s = (k / n) * L
    while (j < pts.length - 2 && cum[j + 1] < s) j++
    const f = (s - cum[j]) / (cum[j + 1] - cum[j] || 1)
    out.push([pts[j][0] + (pts[j + 1][0] - pts[j][0]) * f, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * f])
  }
  return out
}
/** Resample a closed polygon keeping its corner vertices: each span gets points by length. */
function resampleCorners(poly: XY[], corners: number[], n: number): { pts: XY[]; at: number[] } {
  const seg = (a: number, b: number) => {
    const out: XY[] = []
    for (let i = a; i !== b; i = (i + 1) % poly.length) out.push(poly[i])
    out.push(poly[b])
    return out
  }
  const lenOf = (s: XY[]) => s.slice(1).reduce((t, p, i) => t + Math.hypot(p[0] - s[i][0], p[1] - s[i][1]), 0)
  const spans = corners.map((c, i) => seg(c, corners[(i + 1) % corners.length]))
  const total = spans.reduce((t, s) => t + lenOf(s), 0)
  const pts: XY[] = [], at: number[] = []
  for (const s of spans) {
    const m = Math.max(2, Math.round((lenOf(s) / total) * n))
    const cum = [0]
    for (let i = 1; i < s.length; i++) cum.push(cum[i - 1] + Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]))
    at.push(pts.length)
    let j = 0
    for (let k = 0; k < m; k++) {
      const d = (k / m) * cum[cum.length - 1]
      while (j < s.length - 2 && cum[j + 1] < d) j++
      const f = (d - cum[j]) / (cum[j + 1] - cum[j] || 1)
      pts.push([s[j][0] + (s[j + 1][0] - s[j][0]) * f, s[j][1] + (s[j + 1][1] - s[j][1]) * f])
    }
  }
  return { pts, at }
}
function inside(poly: XY[], [x, y]: XY) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
function distToPoly(poly: XY[], [x, y]: XY): { d: number; seg: number; t: number } {
  let best = { d: Infinity, seg: 0, t: 0 }
  for (let i = 0; i < poly.length; i++) {
    const [ax, ay] = poly[i], [bx, by] = poly[(i + 1) % poly.length]
    const ex = bx - ax, ey = by - ay
    const t = Math.max(0, Math.min(1, ((x - ax) * ex + (y - ay) * ey) / (ex * ex + ey * ey || 1)))
    const d = Math.hypot(ax + ex * t - x, ay + ey * t - y)
    if (d < best.d) best = { d, seg: i, t }
  }
  return best
}
/** Where the ray from c through p first meets a closed polygon (beyond c). */
function rayHit(poly: XY[], c: XY, p: XY): XY {
  const dx = p[0] - c[0], dy = p[1] - c[1]
  let bt = Infinity
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i], [x2, y2] = poly[(i + 1) % poly.length]
    const ex = x2 - x1, ey = y2 - y1, den = dx * ey - dy * ex
    if (Math.abs(den) < 1e-12) continue
    const qx = x1 - c[0], qy = y1 - c[1]
    const t = (qx * ey - qy * ex) / den, s = (qx * dy - qy * dx) / den
    if (t > 1e-6 && s >= -1e-9 && s <= 1 + 1e-9 && t < bt) bt = t
  }
  if (!isFinite(bt)) throw new Error('ray missed')
  return [c[0] + dx * bt, c[1] + dy * bt]
}

// ---------------------------------------------------------------------------
// Plan (NAIP, OSM). The canopy outline, clockwise from the north-east point,
// with the rim's height above local grade at each traced point.

const EDGE: [number, number, number][] = [
  [89, 203.5, 40], // north-east point
  [85, 170, 41], [87.5, 135, 41], [95, 90, 41], [102.5, 60, 41], [115, 20, 41], [130, -20, 40.5],
  [153, -55, 40], [170, -87, 38.5], [190, -124, 36], [215, -168, 29], [241, -211, 20], [265, -242, 11],
  [290, -268.5, 4], // south-east point, over the plaza
  [250, -255, 15], [200, -242.5, 27], [150, -230, 36], [100, -217.5, 41], [50, -202.5, 42], [0, -185, 40],
  [-35, -170, 33], [-65, -150, 14], [-90, -127.5, 1.5], // the south-west end of the skirt
  // the west side is one skirt, rolled down to the ground (NAIP, and the
  // photos from the north, west and south-south-east)
  [-110, -100, 1], [-130, -60, 1], [-145, -10, 1], [-150, 40, 1], [-150, 90, 1.5],
  [-148, 115, 4], // north-west corner, where the skirt's lip turns up into the north edge
  [-120, 135, 26], [-62, 162.5, 40], [0, 180, 40], [50, 195, 40],
]
const OUT: XY[] = EDGE.map(([x, y]) => [x, y])
const CORNERS = [0, 13, 28] // the two points and the north-west corner

// The translucent ETFE field: OSM's outline (way/748790321) with the theater
// cut back out, its west side, which OSM draws on the bowl, moved out the
// 10 m NAIP shows, and its east side moved in.
const ETFE_FIELD: XY[] = [
  [-60, -116], [-47, -128], [-31, -141], [-15, -154], [3, -166], [22, -177], [43, -188], [66, -197], [92, -205], [119, -213],
  [128, -216], [143, -214], [156, -209], [168, -201], [178, -191], [185, -182], [190, -172], [193, -157], [186, -140],
  // east: 11 m in from the canopy's edge, as NAIP shows (OSM puts it on the edge)
  [180.5, -129.5], [160, -92], [143.5, -60.5], [120, -24], [104.6, 16.5], [91.8, 57], [84, 88], [76.6, 133], [73, 152], [70, 166],
  [65, 177], [59, 182], [47, 181],
  [29, 176], [-6, 165], [-40, 151], [-63, 139],
  // west: the bowl's oval, 10 m out
  [-82, 132], [-98, 119], [-112, 101], [-123, 79], [-131, 55], [-135, 28], [-134, -2], [-130, -24], [-122, -47], [-112, -66],
  [-99, -84], [-84, -100], [-70, -112],
]
// The bowl (OSM way/860635712), its centroid at the origin.
const BOWL: XY[] = [
  [-62.5, 138.9], [-72.7, 133.6], [-80.4, 128.2], [-87.6, 122.4], [-94.1, 116.0], [-101.2, 107.8], [-107.7, 97.0], [-112.8, 86.1],
  [-118.1, 73.5], [-121.6, 61.0], [-123.7, 49.3], [-124.9, 38.1], [-125.3, 27.8], [-125.2, 17.6], [-124.3, 7.8], [-122.9, -1.9],
  [-121.4, -11.0], [-119.2, -20.0], [-116.5, -28.8], [-113.3, -37.4], [-109.8, -46.0], [-105.9, -54.3], [-101.8, -62.3], [-97.2, -70.3],
  [-92.2, -78.2], [-87.0, -85.9], [-81.0, -93.5], [-74.9, -100.5], [-67.7, -108.2], [-60.2, -115.6], [-43.9, -126.4], [-26.7, -136.1],
  [-2.5, -145.6], [7.4, -147.2], [17.6, -148.4], [27.4, -148.2], [37.2, -147.4], [46.0, -145.5], [54.9, -143.1], [63.5, -139.5],
  [71.7, -135.1], [78.8, -130.7], [86.8, -124.3], [94.9, -116.4], [100.4, -109.9], [105.3, -102.5], [111.1, -92.8], [115.6, -79.6],
  [120.1, -66.3], [122.1, -57.2], [123.6, -48.0], [124.2, -37.8], [124.4, -27.6], [123.7, -17.8], [122.8, -7.9], [121.1, 1.3],
  [119.0, 10.5], [114.7, 28.5], [107.9, 45.9], [99.6, 62.2], [95.1, 70.1], [90.0, 77.9], [84.6, 85.5], [78.6, 92.9],
  [72.1, 100.9], [66.1, 107.1], [58.4, 113.6], [50.3, 119.7], [40.7, 126.4], [30.5, 132.4], [18.6, 138.0], [6.1, 142.3],
  [-5.6, 145.0], [-17.6, 146.4], [-27.9, 146.5], [-38.1, 145.7], [-47.2, 144.1], [-56.0, 141.3],
]
// The YouTube Theater (OSM way/963712167).
const THEATER: XY[] = [
  [128, -216], [143, -214], [156, -209], [168, -201], [178, -191], [185, -182], [190, -172], [193, -157], [194, -142], [190, -124],
  [241, -211], [246, -223], [248, -231], [246, -237], [240, -240], [226, -239], [204, -234], [170, -226],
]

// ---------------------------------------------------------------------------
// The canopy's surface: the rim's height at the edge, rolling up over a
// quarter ellipse into a shallow dome over the bowl. Heights above local grade.

const C: XY = [8, -12] // centre the rings close on
const edgeH = (p: XY) => {
  const { seg, t } = distToPoly(OUT, p)
  return EDGE[seg][2] + (EDGE[(seg + 1) % EDGE.length][2] - EDGE[seg][2]) * t
}
/**
 * The ETFE dome: 53 m over the bowl's centre, about 49 m at its oval, easing
 * smoothly towards 40 m over the plaza (no kink, so flat panels lie on it).
 */
const dome = ([x, y]: XY) => {
  const u = x * Math.cos(B) - y * Math.sin(B), v = x * Math.sin(B) + y * Math.cos(B)
  return 40 + 13 * Math.exp(-((u / 118) ** 2 + (v / 153) ** 2) / 2.6)
}
/** The horizontal run of the roll from rim to roof: wide where the drop is big. */
const rollRun = (drop: number) => Math.min(26, Math.max(6, 0.55 * drop))
/** Height of the canopy's top surface above y = 0 at plan point p. */
function canopyZ(p: XY) {
  const e = edgeH(p), top = Math.max(dome(p), e + 2)
  const s = Math.min(1, distToPoly(OUT, p).d / rollRun(top - e))
  return e + (top - e) * Math.sqrt(1 - (1 - s) ** 2) + ground(p)
}
const TH = 4 // fascia depth / shell thickness

// Rings: the outline, sampled with its corners kept, and for each sample the
// point where the ray from C meets the ETFE field.
const N = 120
const { pts: P } = resampleCorners(OUT, CORNERS, N)
const Q = P.map(p => rayHit(ETFE_FIELD, C, p))
for (let k = 0; k < N; k++) {
  const dp = Math.hypot(P[k][0] - C[0], P[k][1] - C[1]), dq = Math.hypot(Q[k][0] - C[0], Q[k][1] - C[1])
  if (dq > dp - 2) throw new Error(`ETFE field reaches the edge at sample ${k}`)
}
const lerpXY = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
/** Rim rings between the edge and the ETFE field: denser by the edge, where it rolls. */
const RIM_T = [0, 0.04, 0.12, 0.25, 0.45, 0.7, 1]
const rimRing = (t: number) => P.map((p, k) => {
  const e = edgeH(p), drop = Math.max(dome(p), e + 2) - e
  const run = Math.hypot(Q[k][0] - p[0], Q[k][1] - p[1])
  // Spend the rings on the roll first, then on the rest of the rim.
  const r = rollRun(drop)
  const d = run <= r ? t * run : t < 0.7 ? (t / 0.7) * r : r + ((t - 0.7) / 0.3) * (run - r)
  return lerpXY(p, Q[k], d / run)
})
const FIELD_T = [1, 0.78, 0.56, 0.34, 0.14]
const fieldRing = (t: number) => Q.map(q => lerpXY(C, q, t))

const rimRings = RIM_T.map(rimRing)
const fieldRings = FIELD_T.map(fieldRing)
const up: V3 = [0, 0, 1], down: V3 = [0, 0, -1]
const P3 = (p: XY, dz = 0): V3 => [p[0], p[1], Math.max(0, canopyZ(p) + dz)]

/** The surface normal of the canopy at plan point p, from its slope. */
const normalAt = (p: XY, sign = 1): V3 => {
  const h = 0.4
  const gx = (canopyZ([p[0] + h, p[1]]) - canopyZ([p[0] - h, p[1]])) / (2 * h)
  const gy = (canopyZ([p[0], p[1] + h]) - canopyZ([p[0], p[1] - h])) / (2 * h)
  return mul(unit([-gx, -gy, 1]), sign)
}
function bandTop(part: Part, a: XY[], b: XY[]) {
  for (let k = 0; k < N; k++) {
    const j = (k + 1) % N
    quad(part, [P3(a[k]), P3(a[j]), P3(b[j]), P3(b[k])], up, [a[k], a[j], b[j], b[k]].map(p => normalAt(p)))
  }
}
function bandUnder(part: Part, a: XY[], b: XY[]) {
  for (let k = 0; k < N; k++) {
    const j = (k + 1) % N
    quad(part, [P3(a[k], -TH), P3(a[j], -TH), P3(b[j], -TH), P3(b[k], -TH)], down, [a[k], a[j], b[j], b[k]].map(p => normalAt(p, -1)))
  }
}
// Top: aluminium rim, then the ETFE field closing on C.
for (let i = 0; i < rimRings.length - 1; i++) bandTop(rim, rimRings[i], rimRings[i + 1])
for (let i = 0; i < fieldRings.length - 1; i++) bandTop(etfe, fieldRings[i], fieldRings[i + 1])
{
  const last = fieldRings[fieldRings.length - 1], c3 = P3(C)
  for (let k = 0; k < N; k++) {
    const a = last[k], b = last[(k + 1) % N]
    quad(etfe, [P3(a), P3(b), c3, c3], up, [normalAt(a), normalAt(b), normalAt(C), normalAt(C)])
  }
}
// Fascia round the edge, facing out.
for (let k = 0; k < N; k++) {
  const j = (k + 1) % N
  const out: V3 = [P[k][0] - Q[k][0] + P[j][0] - Q[j][0], P[k][1] - Q[k][1] + P[j][1] - Q[j][1], 0]
  quad(rim, [P3(P[k], -TH), P3(P[j], -TH), P3(P[j]), P3(P[k])], out)
}
// Underside: the rim's soffit follows the top; under the ETFE field the cable
// net is drawn as one shallow grey cone.
const UNDER = [0, 1, 3, RIM_T.length - 1] // the soffit needs fewer rings
for (let i = 0; i < UNDER.length - 1; i++) bandUnder(rim, rimRings[UNDER[i]], rimRings[UNDER[i + 1]])
{
  const q = fieldRings[0], c3 = P3(C, -TH - 3)
  for (let k = 0; k < N; k++) tri(grey, P3(q[k], -TH), P3(q[(k + 1) % N], -TH), c3, down)
}

// ---------------------------------------------------------------------------
// The ETFE panels: the roof reads from above as rows of broad panels across
// the bowl's axis, so every other 24 m row is a shade lighter, set just on
// the surface. Low contrast: a faint grid in the photos, not a pattern.

{
  const ROW = 24, SEG = 15
  const ux: XY = [Math.cos(B), -Math.sin(B)], vy: XY = [Math.sin(B), Math.cos(B)]
  const at = (u: number, v: number): XY => [ux[0] * u + vy[0] * v, ux[1] * u + vy[1] * v]
  // Only where the roof is the dome itself, clear of the rim's roll, so a flat
  // panel can lie on it.
  const ok = (c: XY) => inside(ETFE_FIELD, c) && distToPoly(ETFE_FIELD, c).d > 2 && distToPoly(OUT, c).d > 30
  for (let j = -16; j < 16; j += 2) {
    const v0 = j * ROW + 1, v1 = (j + 1) * ROW - 1
    let lo = Infinity, hi = -Infinity
    for (let u = -200; u <= 200; u += 1) if (ok(at(u, v0)) && ok(at(u, v1))) { lo = Math.min(lo, u); hi = Math.max(hi, u) }
    if (hi - lo < 10) continue
    const n = Math.ceil((hi - lo) / SEG)
    for (let i = 0; i < n; i++) {
      const u0 = lo + ((hi - lo) * i) / n, u1 = lo + ((hi - lo) * (i + 1)) / n
      const cs: XY[] = [at(u0, v0), at(u1, v0), at(u1, v1), at(u0, v1)]
      quad(panel, cs.map(c => P3(c, 0.3)), up, cs.map(c => normalAt(c)))
    }
  }
}

// The compression ring: a flush pale band on the bowl's oval (NAIP shows it
// just inside OSM's bowl outline), kept inside the ETFE field on the east,
// where the field's edge comes in over the bowl.
{
  const ring = resampleClosed(BOWL, 72).map(([x, y]): XY => {
    let s = 0.975
    while (s > 0.8 && (!inside(ETFE_FIELD, [x * s, y * s]) || distToPoly(ETFE_FIELD, [x * s, y * s]).d < 4)) s -= 0.005
    return [x * s, y * s]
  })
  const W = 3.2
  const inner = ring.map(([x, y]): XY => {
    const r = Math.hypot(x, y)
    return [x * (r - W) / r, y * (r - W) / r]
  })
  for (let k = 0; k < ring.length; k++) {
    const j = (k + 1) % ring.length
    quad(rim, [P3(inner[k], 0.3), P3(inner[j], 0.3), P3(ring[j], 0.3), P3(ring[k], 0.3)], up, [inner[k], inner[j], ring[j], ring[k]].map(p => normalAt(p)))
  }
}

// ---------------------------------------------------------------------------
// Columns: 37, the published count, under the canopy about 8 m in from its
// edge, evenly along it wherever the soffit is high enough to stand under
// and clear of the bowl and the theater.

function column(c: XY, z1: number, r = 1.4) {
  const n = 8, z0 = 0
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * 2 * Math.PI, a1 = ((i + 1) / n) * 2 * Math.PI
    const p0: XY = [c[0] + r * Math.cos(a0), c[1] + r * Math.sin(a0)], p1: XY = [c[0] + r * Math.cos(a1), c[1] + r * Math.sin(a1)]
    const nm: V3 = [Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2), 0]
    const n0: V3 = [Math.cos(a0), Math.sin(a0), 0], n1: V3 = [Math.cos(a1), Math.sin(a1), 0]
    quad(rim, [[p0[0], p0[1], z0], [p1[0], p1[1], z0], [p1[0], p1[1], z1], [p0[0], p0[1], z1]], nm, [n0, n1, n1, n0])
  }
}
{
  const bowlOut = resampleClosed(BOWL, 96).map(([x, y]): XY => {
    const r = Math.hypot(x, y)
    return [x * (r + 4) / r, y * (r + 4) / r]
  })
  const cand: { c: XY; z: number }[] = []
  const M = 37 * 6
  const ring = resampleClosed(OUT, M)
  const inset = (i: number): XY => {
    const a = ring[(i + M - 1) % M], b = ring[(i + 1) % M]
    const t: XY = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(...t)
    // the outline runs clockwise, so the inward normal is to the right
    return [ring[i][0] + (t[1] / l) * 8, ring[i][1] - (t[0] / l) * 8]
  }
  for (let i = 0; i < M; i++) {
    const c = inset(i), z = canopyZ(c) - TH
    if (z - ground(c) < 12 || inside(bowlOut, c) || inside(THEATER, c)) continue
    cand.push({ c, z })
  }
  // Even spacing along the usable stretches: 37 picks.
  const step = cand.length / 37
  for (let k = 0; k < 37; k++) {
    const { c, z } = cand[Math.floor(k * step + step / 2)]
    column(c, z + 0.2)
  }
}

// ---------------------------------------------------------------------------
// The bowl above grade: its top storeys, 16 m over the local grade, white
// concourse levels with a broad band of glazing and the back of the upper
// deck in grey, closed on top by the seating seen from under the canopy.

{
  const ring = resampleClosed(BOWL, 64)
  const n = ring.length
  const zs = (p: XY) => ground(p)
  const levels: [number, number, Part][] = [[-8, 4, stone], [4, 8.5, win], [8.5, 10.5, stone], [10.5, 16, grey]]
  for (let k = 0; k < n; k++) {
    const j = (k + 1) % n
    const a = ring[k], b = ring[j]
    const o: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0]
    for (const [z0, z1, part] of levels) {
      const za0 = Math.max(0, zs(a) + z0), zb0 = Math.max(0, zs(b) + z0)
      quad(part, [[a[0], a[1], za0], [b[0], b[1], zb0], [b[0], b[1], zs(b) + z1], [a[0], a[1], zs(a) + z1]], o)
    }
  }
  // The seating, raked down towards the field, as a shallow grey cone.
  const c3: V3 = [0, 0, ground([0, 0]) + 2]
  for (let k = 0; k < n; k++) {
    const a = ring[k], b = ring[(k + 1) % n]
    tri(grey, [a[0], a[1], ground(a) + 16], [b[0], b[1], ground(b) + 16], c3, up)
  }
}

// ---------------------------------------------------------------------------
// The YouTube Theater under the canopy's south-east point: a white block with
// one broad band of glazing on its outer, plaza-facing walls.

{
  const n = THEATER.length
  // 26 m, or 2 m under the canopy's soffit where its point comes down.
  const tH = (p: XY) => Math.min(26, canopyZ(p) - TH - 2 - ground(p))
  let cx = 0, cy = 0
  THEATER.forEach(([x, y]) => { cx += x / n; cy += y / n })
  for (let k = 0; k < n; k++) {
    const a = THEATER[k], b = THEATER[(k + 1) % n]
    const e: XY = [b[0] - a[0], b[1] - a[1]]
    const o: V3 = [e[1], -e[0], 0] // outward for a clockwise ring
    const sgn = dot(o, [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0]) >= 0 ? 1 : -1
    const nrm = mul(o, sgn)
    const plaza = k >= 9 // the walls facing the plaza and the canopy's point
    const ha = tH(a), hb = tH(b)
    const bands: [number, number, Part][] = plaza ? [[-8, 0.56, stone], [0.56, 0.81, win], [0.81, 1, stone]] : [[-8, 1, stone]]
    const zf = (p: XY, h: number, f: number) => (f < 0 ? Math.max(0, ground(p) + f) : ground(p) + h * f)
    for (const [f0, f1, part] of bands)
      quad(part, [[a[0], a[1], zf(a, ha, f0)], [b[0], b[1], zf(b, hb, f0)], [b[0], b[1], zf(b, hb, f1)], [a[0], a[1], zf(a, ha, f1)]], nrm)
  }
  // Flat roof, fanned from the centre (the plan is star-shaped about it).
  const c3: V3 = [cx, cy, ground([cx, cy]) + tH([cx, cy])]
  for (let k = 0; k < n; k++) {
    const a = THEATER[k], b = THEATER[(k + 1) % n]
    tri(stone, [a[0], a[1], ground(a) + tH(a)], [b[0], b[1], ground(b) + tH(b)], c3, up)
  }
}

// ---------------------------------------------------------------------------
// Palette, from daylight photos and NAIP. The ETFE reads a pale near-white
// grey with a touch of blue, a step darker than the rim; its panel rows a
// shade lighter again. The rim
// and columns are white aluminium, a cool white rather than the warm `trim`.
// The bowl's concrete is `stone`, its glazing `window`, the back of the
// upper deck and the cable net seen from below `roof` grey.
const parts = [
  { part: etfe, material: { name: 'glass', color: 0xd3d9dd, roughness: 0.3 } },
  { part: panel, material: finish('sofi-etfe-panel', 0xd8dde0, 0.3) },
  { part: rim, material: finish('sofi-aluminium', 0xecebe7) },
  { part: stone, material: PALETTE.stone },
  { part: win, material: PALETTE.window },
  { part: grey, material: PALETTE.roof },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('SoFi Stadium', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: BEARING, osm: 'way/748790321',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const outFile = new URL('../models/la-sofi-stadium.glb', import.meta.url).pathname
await Bun.write(outFile, glb)
console.log(`${outFile}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
