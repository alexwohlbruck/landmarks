/**
 * Palm House, Royal Botanic Gardens, Kew — original procedural geometry,
 * CC0-1.0. Decimus Burton and Richard Turner, 1844-48.
 * bun generators/london-kew-palm-house.ts
 *
 * Writes models/london-kew-palm-house.glb (low) and .detail.glb
 * (detailZoom 17) in one frame. The identity is the translucent glass: a
 * `glass` material at opacity 0.3, double-sided, tinted clear blue
 * (#7fc4de), with what is seen through it modelled — the palms' trunks and
 * crowns (simple green masses), the gallery walkway round the clerestory at
 * 10 m and its two spiral stairs. The curvilinear shell is carried by bold
 * white wrought-iron ribs as real 3D members (half the real density in the
 * low model, ~3.6 m in the detail), rails along the eaves, the clerestory
 * foot and the vents, the lantern's cresting, and a Portland stone plinth.
 *   - the wings: curvilinear vaults (near-vertical, then turning over in a
 *     quarter-curve to a ridge vent) with semicircular ends;
 *   - the central block: an aisle of the same section, bow-ended at the
 *     wing junctions, round a taller bow-ended (semicircular-ended)
 *     clerestory with a curved roof, flat glazed top and a ridge lantern;
 *     the arched doorways in the middle of both long sides.
 *
 * Frame: +y along the long axis (bearing 341.3), +x toward the pond
 * (east-north-east), z up, metres. Origin: area centroid of OSM way/4803632
 * (-0.2927483, 51.4790564) on the ground (level: lidar ground 2.0-2.2 m over
 * the whole box). elevation 0. The house is symmetric about both axes.
 *
 * Evidence
 * - OSM (measured): way/4803632 (building=greenhouse, wikidata Q17528039),
 *   111 m long; wings ±8 m wide (OSM ±7.7-8.3), from y ±21 to semicircular
 *   ends centred on y ±47.6; central block ±15.5 x ±21.
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (via the batch's ealidar.py; flights ~2010s-2022). The glass
 *   passes much of the pulse, so the readings mix glass, ribs and plants:
 *   wings to ~8.5-9 m; central aisle to ~8; clerestory above 10 m over
 *   ±10 x ±14 and above 15 m over ±6 x ±11; peak 19.0 (21.1 above
 *   ground_min, ground 2.1).
 * - Published: 110 m long (362 ft); central block 19 m (62 ft) high
 *   (Wikipedia "Palm House, Kew Gardens"; Kew).
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "Rear of Palm House, Kew Gardens.jpg", Daniel Case, CC BY-SA 3.0 — the
 *     west side broadside: wing and aisle sections, heights (wings ~8.8,
 *     clerestory wall 8.6-12.6, curved roof to ~16, lantern 16.5 m long to
 *     ~18.4), rib rhythm, the central arched doorway;
 *   "Kew Gardens Palm House, London - July 2009.jpg", Diliff, CC BY-SA 3.0;
 *   "Palm House, Kew - geograph.org.uk - 3086137.jpg", Colin Smith, CC BY-SA
 *     2.0 — the pond (east) side and its doorway;
 *   "London - Kew Gardens - Palm House Pond - Broad Walk - View West on Palm
 *     House 1848 by Decimus Burton & Richard Turner.jpg", Txllxt TxllxT,
 *     CC BY-SA 4.0;
 *   "Kew Gardens Palm House 2025-05-14.jpg", Andy Li, CC0 — end on;
 *   "Kew Garden from the air - geograph.org.uk - 4262100.jpg" and "Kew
 *     Gardens from the air - geograph.org.uk - 6080455.jpg", Thomas Nugent,
 *     CC BY-SA 2.0 — the plan: semicircular wing ends, the bow-ended
 *     clerestory, the white ribs from above;
 *   "View to roof in center of Palm House, Kew Gardens.jpg", Daniel Case,
 *     CC BY-SA 3.0 — the clerestory roof, the gallery and the palms inside.
 *   No look-only sources were used.
 *
 * Estimated from the photos: the wall section (0.7 m plinth, glass near
 *   vertical to 3 m, turning over to 8.6 m at 5.6 m in from the eaves line,
 *   vent band to 9.3); the aisle's flat top 8.45-8.6; the clerestory ±10 x
 *   ±14.5 with semicircular ends, wall to 12.6, curved roof to 16.2 over 4 m;
 *   lantern ±2.6 x ±8 to 18.4, cresting to 19.0; the aisle's plan corners
 *   rounded at r 7 (OSM draws a plain rectangle); the doorway arches.
 * Invented: the palms' positions and sizes (a representative planting:
 *   tall crowns 11-15 m under the clerestory, 6 m in the wings), the
 *   gallery's width.
 *
 * Doubts: OSM's rectangular central block versus the photos' rounded
 *   (bow-ended) aisle corners — drawn rounded inside the OSM outline; rib
 *   count is half the real one in the low model (STYLE: thin members at no
 *   more than half density).
 *
 * Night: the glass stays dark (`glass`); the white ironwork carries a
 *   little `_FLOODLIGHT`.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'

// ---------------------------------------------------------------------------
// Small geometry kit (map frame: x east-ish, y along the model's north, z up).
// Every face is emitted with an explicit normal, so Part.tri winds it to face
// that way: nothing here depends on vertex order.

type XY = [number, number]
const norm = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const sb = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const ad = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sc = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const UP: V3 = [0, 0, 1], DN: V3 = [0, 0, -1]

/** A flat convex polygon facing n. */
function poly(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n])
}
/** A flat polygon whose normal is chosen to agree with `dir`. */
function polyDir(p: Part, pts: V3[], dir: V3) {
  let n = norm(crs(sb(pts[1], pts[0]), sb(pts[2], pts[0])))
  if (Math.hypot(...n) < 0.5 && pts.length > 3) n = norm(crs(sb(pts[2], pts[0]), sb(pts[3], pts[0])))
  if (dot(n, dir) < 0) n = sc(n, -1)
  poly(p, pts, n)
}
/** Ear-clipping triangulation of a simple counter-clockwise ring. */
function triangulate(ring: XY[]): [number, number, number][] {
  const idx = ring.map((_, i) => i), out: [number, number, number][] = []
  const area2 = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (q: XY, a: XY, b: XY, c: XY) => area2(a, b, q) > 1e-9 && area2(b, c, q) > 1e-9 && area2(c, a, q) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 100000) {
    let clipped = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = ring[i0], b = ring[i1], c = ring[i2], ar = area2(a, b, c)
      if (ar <= 1e-9) { if (Math.abs(ar) <= 1e-9) { idx.splice(k, 1); clipped = true; break } continue }
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(ring[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); clipped = true; break
    }
    if (!clipped) throw new Error('triangulation failed')
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
const ccw = (ring: XY[]) => { let a = 0; for (let i = 0; i < ring.length; i++) { const p = ring[i], q = ring[(i + 1) % ring.length]; a += p[0] * q[1] - q[0] * p[1] } return a > 0 ? ring : [...ring].reverse() }
function cap(p: Part, ring: XY[], z: number, up: boolean) {
  for (const [a, b, c] of triangulate(ring)) poly(p, [[...ring[a], z], [...ring[b], z], [...ring[c], z]], up ? UP : DN)
}
const outN = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l] }
/** Mitred offset of a counter-clockwise ring, outward by d (negative insets). */
function offset(ring: XY[], d: number): XY[] {
  const n = ring.length
  return ring.map((q, i) => {
    const a = ring[(i + n - 1) % n], c = ring[(i + 1) % n]
    const n0 = outN(a, q), n1 = outN(q, c), k = 1 + n0[0] * n1[0] + n0[1] * n1[1]
    return [q[0] + (d * (n0[0] + n1[0])) / k, q[1] + (d * (n0[1] + n1[1])) / k]
  })
}
/** Vertical walls of a CCW ring between z0 and z1, facing out (or in). */
function walls(p: Part, ring: XY[], z0: number, z1: number, inward = false) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], o = outN(a, b), s = inward ? -1 : 1
    poly(p, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], [s * o[0], s * o[1], 0])
  }
}
function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false, topPart?: Part) {
  walls(p, ring, z0, z1)
  if (top) cap(topPart ?? p, ring, z1, true)
  if (bottom) cap(p, ring, z0, false)
}
const rect = (x0: number, x1: number, y0: number, y1: number, c = 0): XY[] =>
  c > 0
    ? [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
    : [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, c = 0, bottom = false, topPart?: Part) {
  prism(p, rect(x0, x1, y0, y1, c), z0, z1, true, bottom, topPart)
}
const circle = (cx: number, cy: number, r: number, seg: number, ph = 0): XY[] =>
  Array.from({ length: seg }, (_, i) => { const a = ph + (2 * Math.PI * i) / seg; return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as XY })

/** A surface of revolution through (r, z) profile points (smooth within a band). */
function lathe(p: Part, cx: number, cy: number, prof: [number, number][], seg: number, ph = 0, a0 = 0, a1 = 2 * Math.PI, smooth = false) {
  if (!smooth && prof.length > 2) {
    for (let k = 0; k < prof.length - 1; k++) lathe(p, cx, cy, [prof[k], prof[k + 1]], seg, ph, a0, a1, true)
    return
  }
  const pn = prof.map((_, k) => {
    const a = prof[Math.max(0, k - 1)], b = prof[Math.min(prof.length - 1, k + 1)]
    const dr = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dr, dz) || 1
    return [dz / l, -dr / l] as XY
  })
  const angs = Array.from({ length: seg + 1 }, (_, i) => a0 + ph + ((a1 - a0) * i) / seg)
  for (let i = 0; i < seg; i++) {
    const t0 = angs[i], t1 = angs[i + 1]
    for (let k = 0; k < prof.length - 1; k++) {
      const P = (t: number, q: number): V3 => [cx + prof[q][0] * Math.cos(t), cy + prof[q][0] * Math.sin(t), prof[q][1]]
      const N = (t: number, q: number): V3 => norm([pn[q][0] * Math.cos(t), pn[q][0] * Math.sin(t), pn[q][1]])
      const A = P(t0, k), B = P(t1, k), C = P(t1, k + 1), D = P(t0, k + 1)
      if (prof[k][0] > 1e-6) p.tri(A, B, C, undefined, undefined, undefined, [N(t0, k), N(t1, k), N(t1, k + 1)])
      if (prof[k + 1][0] > 1e-6) p.tri(A, C, D, undefined, undefined, undefined, [N(t0, k), N(t1, k + 1), N(t0, k + 1)])
    }
  }
}
/** A smooth round column shaft. */
function cyl(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, seg: number, top = false, ph = 0) {
  lathe(p, cx, cy, [[r, z0], [r, z1]], seg, ph)
  if (top) cap(p, circle(cx, cy, r, seg, ph), z1, true)
}
/** An ellipsoid, smooth. */
function ellipsoid(p: Part, cx: number, cy: number, cz: number, rx: number, rz: number, seg: number, rows: number) {
  const prof: [number, number][] = []
  for (let k = 0; k <= rows; k++) { const t = -Math.PI / 2 + (Math.PI * k) / rows; prof.push([rx * Math.cos(t), cz + rz * Math.sin(t)]) }
  prof[0][0] = 0; prof[rows][0] = 0
  lathe(p, cx, cy, prof, seg, 0, 0, 2 * Math.PI, true)
}
/**
 * A straight member from a to b: an n-sided prism of radius r0 at a and r1
 * at b (smooth sides when n > 4), with optional end caps.
 */
function rod(p: Part, a: V3, b: V3, r0: number, r1 = r0, n = 4, caps = false, ph = Math.PI / 4, smooth = n > 4) {
  const ax = norm(sb(b, a))
  const ref: V3 = Math.abs(ax[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const u = norm(crs(ax, ref)), v = crs(ax, u)
  const dirs = Array.from({ length: n }, (_, i) => { const t = ph + (2 * Math.PI * i) / n; return ad(sc(u, Math.cos(t)), sc(v, Math.sin(t))) })
  const A = dirs.map((d) => ad(a, sc(d, r0))), B = dirs.map((d) => ad(b, sc(d, r1)))
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    if (smooth) p.tri(A[i], A[j], B[j], undefined, undefined, undefined, [dirs[i], dirs[j], dirs[j]]), p.tri(A[i], B[j], B[i], undefined, undefined, undefined, [dirs[i], dirs[j], dirs[i]])
    else polyDir(p, [A[i], A[j], B[j], B[i]], ad(dirs[i], dirs[j]))
  }
  if (caps) { polyDir(p, [...A].reverse(), sc(ax, -1)); polyDir(p, B, ax) }
}
/** A sphere, smooth. */
const sphere = (p: Part, c: V3, r: number, seg = 8, rows = 5) => ellipsoid(p, c[0], c[1], c[2], r, r, seg, rows)
/** An ellipsoid along an arbitrary axis from a to b, of radius r (smooth). */
function spindle(p: Part, a: V3, b: V3, r: number, seg = 8, rows = 6, rB = r) {
  const ax = norm(sb(b, a)), L = Math.hypot(...sb(b, a))
  const ref: V3 = Math.abs(ax[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const u = norm(crs(ax, ref)), v = crs(ax, u)
  const ring = (k: number) => {
    const t = -Math.PI / 2 + (Math.PI * k) / rows, rr = Math.cos(t) * r, h = (Math.sin(t) + 1) / 2
    return Array.from({ length: seg }, (_, i) => {
      const th = (2 * Math.PI * i) / seg, d = ad(sc(u, Math.cos(th)), sc(v, Math.sin(th) * (rB / r)))
      const pos = ad(ad(a, sc(ax, h * L)), sc(d, rr))
      const nn = norm(ad(sc(d, Math.cos(t)), sc(ax, Math.sin(t) * (r / (L / 2)))))
      return [pos, nn] as [V3, V3]
    })
  }
  const rings = Array.from({ length: rows + 1 }, (_, k) => ring(k))
  for (let k = 0; k < rows; k++) for (let i = 0; i < seg; i++) {
    const j = (i + 1) % seg, A = rings[k][i], B = rings[k][j], C = rings[k + 1][j], D = rings[k + 1][i]
    if (k > 0) p.tri(A[0], B[0], C[0], undefined, undefined, undefined, [A[1], B[1], C[1]])
    if (k < rows - 1) p.tri(A[0], C[0], D[0], undefined, undefined, undefined, [A[1], C[1], D[1]])
  }
}

// ---------------------------------------------------------------------------
// Frame: bearing 341.3 (the long axis), +y to the north-north-west end,
// +x to the pond side (east-north-east), origin at the OSM centroid on the
// ground. The house is symmetric about both axes, as built.

const ID = 'london-kew-palm-house'
const BEARING = 341.3
const ANCHOR = { lng: -0.2927483, lat: 51.4790564 }

type Mat = { part: Part; material: MaterialSpec }
type Prof = [number, number][] // (inset d from the outer line, z)

// Sections (heights: lidar ground 2.1 above ground_min; wings ~8.8, aisle
// ~8.3, clerestory roof ~16.2, top 18.6-19; published 19 m centre).
const PLINTH = 0.7
// the curvilinear wall: near-vertical, then turning over in a quarter-curve
const WALL: Prof = [[0, PLINTH], [0.05, 3.0], [0.4, 4.6], [1.0, 5.9], [1.9, 7.0], [3.1, 7.9], [4.4, 8.4], [5.6, 8.6]]
const WALL_LO: Prof = [[0, PLINTH], [0.1, 3.4], [0.8, 5.5], [2.1, 7.3], [3.8, 8.3], [5.6, 8.6]]
const VENT = 9.3 // the wings' ridge vent band top
const AISLE = 8.6 // the central aisle's flat top, at the clerestory wall
const CLER_WALL = 12.6, CLER_TOP = 16.2, LANT_TOP = 18.4, CREST = 19.0
const CLER: Prof = [[0, AISLE], [0, CLER_WALL], [0.6, 14.0], [1.6, 15.1], [2.9, 15.9], [4.0, 16.2]]
const CLER_LO: Prof = [[0, AISLE], [0, CLER_WALL], [1.1, 14.6], [4.0, 16.2]]

/** A rounded rectangle, CCW from +x, sampled with fixed counts per side and arc. */
function rrect(a: number, b: number, r: number, K: number, sx: number, sy: number): XY[] {
  const pts: XY[] = []
  r = Math.max(0.05, Math.min(r, a - 0.01, b - 0.01))
  const corners: [number, number, number][] = [[a - r, b - r, 0], [-(a - r), b - r, Math.PI / 2], [-(a - r), -(b - r), Math.PI], [a - r, -(b - r), (3 * Math.PI) / 2]]
  // start on the +x side at y = -(b - r), go up the +x side
  for (let c = 0; c < 4; c++) {
    const [cx, cy, a0] = corners[c]
    // the straight side leading into this corner
    const prev = corners[(c + 3) % 4]
    const p0: XY = [prev[0] + r * Math.cos(a0), prev[1] + r * Math.sin(a0)], p1: XY = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)]
    const ns = c % 2 === 0 ? sy : sx
    for (let i = 0; i < ns; i++) pts.push([p0[0] + ((p1[0] - p0[0]) * i) / ns, p0[1] + ((p1[1] - p0[1]) * i) / ns])
    for (let k = 0; k < K; k++) { const t = a0 + ((Math.PI / 2) * k) / K; pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]) }
  }
  return pts
}

/** Loft a profile around a closed family of rings: ring(d) gives the ring inset by d. */
function loftRing(p: Part, ring: (d: number) => XY[], prof: Prof, closed = true) {
  for (let i = 0; i < prof.length - 1; i++) {
    const [d0, z0] = prof[i], [d1, z1] = prof[i + 1]
    const A = ring(d0), B = ring(d1), n = A.length
    for (let j = 0; j < (closed ? n : n - 1); j++) {
      const k = (j + 1) % n
      const out = norm([A[j][0] + A[k][0] - B[j][0] - B[k][0], A[j][1] + A[k][1] - B[j][1] - B[k][1], (d1 - d0) * 0.0 + (z1 - z0 < 0.3 ? 2 : 0.4)])
      polyDir(p, [[...A[j], z0], [...A[k], z0], [...B[k], z1], [...B[j], z1]], out)
    }
  }
}
/** Ribs: rods up the profile at the chosen ring indices, set just outside the glass. */
function ribs(p: Part, ring: (d: number) => XY[], prof: Prof, idx: number[], r: number, sides: number, out = 0.08) {
  const R = prof.map(([d]) => ring(Math.max(0, d - out)))
  for (const j of idx) {
    for (let i = 0; i < prof.length - 1; i++) {
      const a: V3 = [...R[i][j], prof[i][1]], b: V3 = [...R[i + 1][j], prof[i + 1][1]]
      rod(p, a, b, r, r, sides, false, Math.PI / 2, true)
    }
  }
}
/** A horizontal rail round a ring at inset d and height z. */
function rail(p: Part, pts: XY[], z: number, r: number, sides: number, closed = true) {
  for (let j = 0; j < (closed ? pts.length : pts.length - 1); j++) {
    const k = (j + 1) % pts.length
    rod(p, [...pts[j], z], [...pts[k], z], r, r, sides, false, Math.PI / 2, true)
  }
}

function build(D: boolean): Mat[] {
  const glass = new Part(), iron = new Part(), stone = new Part(), leaf = new Part(), trunk = new Part()
  const K = D ? 8 : 4 // segments per quarter-circle
  const RS = D ? 4 : 3 // rib sides
  const RR = D ? 0.13 : 0.21 // rib radius: drawn bolder than the real ribs
  const wallP = D ? WALL : WALL_LO, clerP = D ? CLER : CLER_LO

  // --- the central block: a bow-ended aisle round the clerestory ----------
  // outer line: OSM way/4803632, ±15.5 × ±21; its corners are rounded
  const CA = 15.5, CB = 21.0, CR = 7.0
  const aisleRing = (d: number) => rrect(CA - d, CB - d, CR - d, K, D ? 6 : 3, D ? 8 : 4)
  const aisleP: Prof = [...wallP.filter(([d]) => d < 4.4), [4.5, 8.45]]
  loftRing(glass, aisleRing, aisleP)
  // the clerestory: bow-ended (semicircular ends), ±10 × ±14.5
  const QA = 10.0, QB = 14.5
  const clerRing = (d: number) => rrect(QA - d, QB - d, QA - d, K, D ? 6 : 3, D ? 8 : 4)
  loftRing(glass, clerRing, clerP)
  // the aisle's flat glazed top between the two
  {
    const A = aisleRing(4.5), B = clerRing(0)
    // both rings have the same count per corner and per side: pair them up
    for (let j = 0; j < A.length; j++) {
      const k = (j + 1) % A.length
      polyDir(glass, [[...A[j], 8.45], [...A[k], 8.45], [...B[k], AISLE], [...B[j], AISLE]], UP)
    }
  }
  // the clerestory roof's flat top round the lantern, and the lantern
  const lanRing = (d: number) => rrect(2.6 - d, 8.0 - d, 2.6 - d, K, D ? 6 : 3, D ? 8 : 4)
  {
    const A = clerRing(4.0), B = lanRing(0)
    for (let j = 0; j < A.length; j++) {
      const k = (j + 1) % A.length
      polyDir(glass, [[...A[j], CLER_TOP], [...A[k], CLER_TOP], [...B[k], CLER_TOP], [...B[j], CLER_TOP]], UP)
    }
    loftRing(glass, lanRing, [[0, CLER_TOP], [0, LANT_TOP]])
    cap(iron, ccw(lanRing(0)), LANT_TOP, true)
    // cresting along the lantern's ridge
    rail(iron, [[0, -6.5], [0, 6.5]], LANT_TOP + 0.3, 0.12, 4, false)
    for (const y of D ? [-6.5, -3.25, 0, 3.25, 6.5] : [-6.5, 0, 6.5]) rod(iron, [0, y, LANT_TOP], [0, y, CREST], 0.1, 0.06, 4, true)
  }

  // --- the wings: curvilinear vaults with semicircular ends ----------------
  const WW = 8.0, Y0 = CB - 0.3, YE = 47.6 // wing half-width; it starts inside the aisle; end-arc centre
  for (const s of [1, -1]) {
    const wingPath = (d: number): XY[] => {
      const w = WW - d, pts: XY[] = []
      const ns = D ? 8 : 2
      for (let i = 0; i < ns; i++) pts.push([w, Y0 + ((YE - Y0) * i) / ns])
      for (let k = 0; k <= 2 * K; k++) { const t = (Math.PI * k) / (2 * K); pts.push([w * Math.cos(t), YE + w * Math.sin(t)]) }
      for (let i = 1; i <= ns; i++) pts.push([-w, YE - ((YE - Y0) * i) / ns])
      return pts.map(([x, y]) => [x * s, y * s] as XY)
    }
    loftRing(glass, wingPath, wallP, false)
    // the ridge vent band and the flat top
    loftRing(glass, wingPath, [[5.6, 8.6], [5.6, VENT]], false)
    const top = wingPath(5.6)
    cap(glass, ccw(top), VENT, true)
    rail(iron, top, VENT, 0.14, 4, false)
    rail(iron, top, 8.6, 0.12, 3, false)
    // ribs: every ~4.4 m on the sides (half the real density), at each end facet
    const Pn = wingPath(0).length
    const idx: number[] = []
    for (let i = 0; i < Pn; i++) idx.push(i)
    // on the straight runs add intermediate ribs by inserting extra stations
    ribs(iron, wingPath, wallP, idx.filter((i) => i > 0 && i < Pn - 1), RR, RS)
    const extra = D ? [] : [1, 2, 3, 5, 6, 7].map((i) => i / 8)
    for (const f of extra) {
      const yy = Y0 + (YE - Y0) * f
      const pth = (d: number): XY[] => [[(WW - d) * s, yy * s], [-(WW - d) * s, yy * s]]
      ribs(iron, pth, wallP, [0, 1], RR, RS)
    }
    // the stone plinth
    const base = wingPath(-0.15), inner = wingPath(0.35)
    for (let j = 0; j < base.length - 1; j++) {
      polyDir(stone, [[...base[j], 0], [...base[j + 1], 0], [...base[j + 1], PLINTH], [...base[j], PLINTH]], [base[j][0] + base[j + 1][0] - inner[j][0] - inner[j + 1][0], base[j][1] + base[j + 1][1] - inner[j][1] - inner[j + 1][1], 0])
      polyDir(stone, [[...base[j], PLINTH], [...base[j + 1], PLINTH], [...inner[j + 1], PLINTH], [...inner[j], PLINTH]], UP)
    }
  }
  // central block ribs, rails, plinth
  {
    const A0 = aisleRing(0), n = A0.length
    const idx = Array.from({ length: n }, (_, i) => i).filter((i) => {
      const [x, y] = A0[i]
      // no ribs where the wings join (|x| < 8 at the ends)
      if (Math.abs(x) < WW + 0.5 && Math.abs(y) > CB - 4) return false
      return D || i % 1 === 0
    })
    ribs(iron, aisleRing, aisleP, idx, RR, RS)
    rail(iron, aisleRing(4.5), 8.5, 0.13, 3)
    const C0 = clerRing(0)
    ribs(iron, clerRing, clerP, C0.map((_, i) => i).filter((i) => D || i % 1 === 0), RR, RS)
    rail(iron, clerRing(-0.05), CLER_WALL, 0.14, 3)
    rail(iron, clerRing(-0.05), AISLE + 0.15, 0.13, 3)
    rail(iron, clerRing(4.0), CLER_TOP + 0.05, 0.13, 3)
    const base = aisleRing(-0.15), inner = aisleRing(0.35)
    for (let j = 0; j < base.length; j++) {
      const k = (j + 1) % base.length
      polyDir(stone, [[...base[j], 0], [...base[k], 0], [...base[k], PLINTH], [...base[j], PLINTH]], [base[j][0] + base[k][0], base[j][1] + base[k][1], 0])
      polyDir(stone, [[...base[j], PLINTH], [...base[k], PLINTH], [...inner[k], PLINTH], [...inner[j], PLINTH]], UP)
    }
    // the doorways: white-framed porches in the middle of both long sides
    for (const s of [1, -1]) {
      // posts and a round arch over the doors, carried up into the curve
      const x = s * (CA + 0.15), r = 1.7, zs = 5.6
      for (const y of [-r, r]) rod(iron, [x, y, 0], [x, y, zs], 0.22, 0.22, 4, true)
      const arc: V3[] = Array.from({ length: (D ? 8 : 5) + 1 }, (_, k) => { const t = (Math.PI * k) / (D ? 8 : 5); return [x, r * Math.cos(t), zs + r * Math.sin(t)] as V3 })
      for (let k = 0; k < arc.length - 1; k++) rod(iron, arc[k], arc[k + 1], 0.2, 0.2, 4, false, Math.PI / 4, true)
      rod(iron, [x, -r, 2.9], [x, r, 2.9], 0.12, 0.12, 4)
    }
  }

  // --- inside: the gallery walkway round the clerestory, two spiral stairs,
  //     and the palms whose crowns fill the house -----------------------------
  {
    const G = 10.0 // gallery level
    const go = rrect(QA - 0.4, QB - 0.4, QA - 0.4, K, 2, 2), gi = rrect(QA - 1.6, QB - 1.6, QA - 1.6, K, 2, 2)
    for (let j = 0; j < go.length; j++) {
      const k = (j + 1) % go.length
      polyDir(iron, [[...go[j], G], [...go[k], G], [...gi[k], G], [...gi[j], G]], UP)
      polyDir(iron, [[...go[j], G - 0.35], [...go[k], G - 0.35], [...go[k], G], [...go[j], G]], [go[j][0], go[j][1], 0])
      polyDir(iron, [[...gi[j], G - 0.35], [...gi[k], G - 0.35], [...gi[k], G], [...gi[j], G]], [-gi[j][0], -gi[j][1], 0])
    }
    if (D) rail(iron, rrect(QA - 1.5, QB - 1.5, QA - 1.5, K, 2, 2), G + 1.0, 0.05, 4)
    for (const s of [1, -1]) cyl(iron, 0, s * (QB - 2.2), 0.9, 0.7, G, D ? 10 : 6, true)
  }
  // palms: trunk and crown (a fan of fronds as a broad flattened mass)
  const palm = (x: number, y: number, h: number, r: number) => {
    rod(trunk, [x, y, 0.5], [x, y, h - r * 0.3], D ? 0.28 : 0.32, D ? 0.2 : 0.24, D ? 6 : 4)
    ellipsoid(leaf, x, y, h, r, r * 0.55, D ? 10 : 7, D ? 5 : 3)
  }
  const PALMS: [number, number, number, number][] = [
    [0, 0, 15.0, 4.2], [-4.5, 6.5, 13.0, 3.4], [4.8, -6.0, 13.5, 3.6], [5.0, 7.5, 11.0, 3.2], [-5.2, -7.0, 11.5, 3.2],
    [-10.5, 1.0, 6.4, 2.6], [10.8, -1.5, 6.3, 2.6], [-11.0, 9.5, 6.0, 2.4], [11.0, -10.0, 6.0, 2.4], [0.5, -9.5, 12.0, 3.2], [-0.5, 10.0, 12.5, 3.2], [-8.5, -15.0, 6.0, 2.4], [8.5, 15.0, 6.0, 2.4],
    [1.0, 27.0, 6.2, 2.6], [-1.5, 35.0, 5.8, 2.5], [1.0, 43.0, 6.0, 2.6], [-1.0, -27.0, 6.2, 2.6], [1.5, -35.0, 5.8, 2.5], [-1.0, -43.0, 6.0, 2.6],
  ]
  for (const [x, y, h, r] of D ? PALMS : PALMS.filter((_, i) => i !== 10 && i !== 13)) palm(x, y, h, r)
  if (D) {
    // lower planting: broad green masses on the beds
    for (const [x, y, r] of [[-3, 24, 2.0], [3, 31, 2.0], [-3, 39, 2.0], [3, -24, 2.0], [-3, -31, 2.0], [3, -39, 2.0], [-9, 9, 2.2], [9, -9, 2.2], [9, 10, 2.0], [-9, -10, 2.0]] as XY3[])
      ellipsoid(leaf, x, y, r * 0.6, r, r * 0.6, 8, 4)
  }

  return [
    { part: glass, material: { name: 'glass', color: 0x7fc4de, roughness: 0.2, opacity: 0.3, doubleSided: true } },
    { part: iron, material: { ...finish('painted-iron', 0xf4f2ec, 0.6), floodlight: (p) => (p[2] < 2 ? 0.6 : 0.35) } },
    { part: stone, material: PALETTE.stone },
    { part: leaf, material: finish('palm-green', 0x7ea566) },
    { part: trunk, material: finish('palm-trunk', 0x9a8466) },
  ]
}
type XY3 = [number, number, number]

const REPLACES = ['way/4803632']

if (import.meta.main) {
  for (const [file, D, maxTri, maxBytes] of [
    [`${ID}.glb`, false, 6500, 256000],
    [`${ID}.detail.glb`, true, 40000, 1536 * 1024],
  ] as [string, boolean, number, number][]) {
    const parts = build(D)
    const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
    const glb = writeGlb('Palm House, Kew', parts, {
      license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: CREST,
      frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', replaces: REPLACES,
    })
    const out = new URL(`../models/${file}`, import.meta.url).pathname
    await Bun.write(out, glb)
    console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
    if (triangles > maxTri) console.error(`${file}: triangle budget exceeded: ${triangles}`)
    if (glb.length > maxBytes) console.error(`${file}: file budget exceeded: ${glb.length}`)
  }
}
