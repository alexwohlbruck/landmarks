/**
 * Old Royal Naval College (Greenwich Hospital), Greenwich — original
 * procedural geometry, CC0-1.0.
 * bun generators/london-old-royal-naval-college.ts
 *
 * One placement for all four courts of Wren's hospital, symmetric about the
 * axis from the Queen's House to the river:
 *   King William Court (south-west, Painted Hall, dome) and Queen Mary Court
 *     (south-east, Chapel, dome): U-shaped ranges round their courts, the
 *     domed towers at their inner north corners, and the long colonnades of
 *     paired columns along the axis with their returns (porticoes) in front
 *     of the towers; King William's west and south ranges are red brick
 *     with stone pavilions and giant porticoes (Hawksmoor; photos).
 *   King Charles Court (north-west) and Queen Anne Court (north-east), on
 *     the river: ranges round narrow courts, the river and south ranges with
 *     their attic storey, giant-order porticoes with pediments on the river
 *     fronts and on the faces to the axis (end pavilions and the long
 *     ranges' centres), chimney stacks.
 * Writes models/london-old-royal-naval-college.glb (low: every column of the
 *   colonnades, porticoes, drums and lanterns as a real round shaft with real
 *   gaps; court-side windows dropped) and .detail.glb (detailZoom 17: the
 *   inner column row and arched recesses of the colonnade walks, column bases
 *   and capitals on the drums, 16 dome ribs, court-side windows, full
 *   chimney stacks, rounder shafts).
 *
 * Frame: +y toward the river along the axis (bearing 333), +x east, z up,
 * metres. Origin (-0.0055263, 51.4832213) on the axis, midway between the
 * south front of the domed courts and the river front (the centre of the
 * four courts' combined outline). y = 0 is the riverside ground (lowest
 * under the footprint, 2.8 m above the lidar box's ground_min); the ground
 * rises ~1 m to the south and the central terrace between the colonnades is
 * 2.2 m up. elevation 0. Built as the west half and mirrored: OSM and the
 * lidar agree the plan is symmetric to ±2 m.
 *
 * Evidence
 * - OSM (measured, read in this frame): relations 3206882 King William
 *   Court (Grade I, NHLE 1211426), 14291264 Queen Mary Court (1211384),
 *   14291263 King Charles Court (1211337), 3206883 Queen Anne Court
 *   (1290044), and their building:parts (colonnade roofs 1105881559/60,
 *   drum squares 1125965432/34 (12.2 m) and domes 1125965433/39 (Ø11),
 *   ranges 1125965428-38, 1183675921-24). way/35535194 is the attraction
 *   outline of the whole site (not a building, not replaced). Plan used:
 *   domed courts |x| 16.5-84, y -102..-2.5 (inner courts |x| 24-71,
 *   y -80..-23); colonnades |x| 16.5-24; river courts |x| 40-94, y 10-101
 *   (inner courts |x| 58-74, y 22-87); dome centres (±28.5, -13).
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (via the batch's ealidar.py; flights ~2010s-2022), heights above
 *   y = 0: domed-court ranges 20.5-21.5 to the roofs; colonnade roofs 11.4;
 *   river and south ranges of the river courts 18-20.5 (attics), their long
 *   ranges 14.7-16.5; dome profile r 4 -> 36.8, r 5 -> 35.9, r 6 -> 33.7,
 *   r 7 -> 31.5; lantern top 41.0 (the finial is too thin to show).
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "Old Royal Naval College 2017-08-06 cropped.jpg", Colin, CC BY-SA 4.0
 *     — the river front: both domes, the colonnade returns, the river
 *     courts' giant orders, pediments, attics and chimneys;
 *   "Royal Naval College Greenwich view from the Thames.jpg", Dmitry
 *     Tonkonog, CC BY-SA 3.0;
 *   "Greenwich - Grand Square - View SSE on King William Court Dome &
 *     Painted Hall - Old Royal Naval College.jpg", Txllxt TxllxT, CC BY-SA
 *     4.0 — the tower stack: pedimented stage with its arched window,
 *     square plinth, drum of coupled columns, clock attic, ribbed lead dome
 *     with lucarnes, lantern, gilt ball and vane; the colonnade return on
 *     its plinth; the giant Corinthian pavilion of King Charles Court;
 *   "Dome, Old Royal Naval College - geograph.org.uk - 2599903.jpg", Jim
 *     Osley, CC BY-SA 2.0 — the drum and dome;
 *   "Greenwich - Old Royal Naval College 1712 Sir Christopher Wren - Queen
 *     Mary Court - View NW on Dome & Chapel.jpg", Txllxt TxllxT, CC BY-SA 4.0;
 *   "Old Royal Naval College, Greenwich, colonnade - 2022-04-24.jpg", The
 *     wub, CC BY-SA 4.0 — the colonnade walk (paired columns, back wall);
 *   "Old Royal Naval College (January 2024) 06.jpg", DiscoA340, CC BY-SA
 *     4.0 — King William Court's brick west range and north range end;
 *   "Greenwich - Romney Road - View North on Old Royal Naval College 1712
 *     by Sir Christopher Wren.jpg", Txllxt TxllxT, CC BY-SA 4.0 — King
 *     William Court's brick south front with stone pavilions;
 *   "HE1290044 Royal Naval College North East Building Queen Anne's
 *     Quarter.jpg", Katie Chan, CC BY-SA 4.0 — Queen Anne Court's axis face;
 *   "Greenwich - Royal Observatory - View NNW on Queen's House, Old Royal
 *     Naval College, Canary Wharf Docklands & Millennium Dome.jpg" and
 *     "London, Greenwich, Blick vom Hügel des Royal Greenwich Observatory --
 *     2016 -- 4736-8.jpg" (Txllxt TxllxT; Dietmar Rabich), CC BY-SA 4.0 —
 *     the plan and roofs from the hill.
 *   No look-only sources were used.
 *
 * Estimated from the photos between the lidar datums: the tower stack
 *   (cornice 21.8, pediment apex 25.2, square plinth to 25.4, drum columns
 *   25.4-31.0 on r 6.5 in eight coupled pairs, entablature to 32.2, clock
 *   attic to 34.6, dome r 6.3 rising 5.0 to 39.6, lantern to 42.3, gilt ball
 *   and vane to 45.3; photo ratios checked against the lidar lantern top);
 *   colonnade plinth 2.2 (the terrace), columns to 9.0, entablature 10.6,
 *   balustrade 11.4, pairs every ~5 m (15 in the low model, 19 in the detail
 *   — the real pairs are closer, ~4 m); river-court main order 13-14.5 with
 *   the attic to 18.6; window sizes and bays; portico widths.
 * Invented/simplified: roofs are hipped lead over each range (real roofs
 *   mix hipped and flat with balustrades); statues, the pediment sculpture,
 *   lucarnes, the Painted Hall's interior steps; the brick-or-stone finish
 *   of King William Court's inner court faces (drawn brick on the brick
 *   ranges); the two river courts are drawn as mirror images, though King
 *   Charles (Webb) and Queen Anne differ in detail.
 *
 * Drawn heights, checked against the lidar (lead review, pass 2): domed-court
 *   ranges parapet 18.8, roofs to 21.0 (lidar 20.5-21.5); river and south
 *   ranges of the river courts parapet 18.6, roofs to 20.4 (lidar 19-20.8);
 *   their long ranges parapet 13.6, roofs to 15.2 (lidar 14.7-16.5); the
 *   first pass had the river courts 1.2-2 m and the long ranges 2 m too
 *   high. The dome stack is unchanged (lantern 42.3 against the lidar's
 *   41.0 at the lantern, ball and vane to 45.3), so the towers now rise
 *   about twice the river courts' parapets, as in the river photo.
 *   Diameters are not enlarged: OSM gives the drum square 12.2 m and the
 *   dome Ø11, and the photo from the Grand Square puts the drum at ~0.87
 *   and the dome at ~0.75 of the tower stage's width; the model's drum
 *   (entablature Ø14.5) and dome (Ø12.6) are already at or over that.
 *
 * Materials: Portland stone (walls and the former `trim` merged, so the
 *   dome lead can have its own slot), roof (lead roofs; also the shade
 *   behind porticoes and in the colonnade walks, and the dome ribs),
 *   dome-lead (a darker blue-grey, as the domes read in the photos),
 *   window, red brick, gilt.
 *
 * Doubts: the domes are drawn at their measured size, so at 80 px they
 *   read small against four large courts; the north range of King William
 *   Court is drawn stone with its west end on the brick west range.
 *
 * Night: Portland stone carries `_FLOODLIGHT` (the college is
 *   floodlit), the gilt finials too; windows glow.
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
// Frame: bearing 333 (the axis from the Queen's House to the river), +y
// toward the river, +x east (Queen Mary / Queen Anne), origin on the axis
// midway between the domes and the river front. Built as the west half
// (King William and King Charles Courts, x < 0) and mirrored for the east
// half (Queen Mary and Queen Anne Courts); the real plan is symmetric to ±2 m
// in OSM and the lidar.

const ID = 'london-old-royal-naval-college'
const BEARING = 333
const ANCHOR = { lng: -0.0055263, lat: 51.4832213 }

type Mat = { part: Part; material: MaterialSpec }
type Parts = { stone: Part; trim: Part; roof: Part; win: Part; brick: Part; gilt: Part; lead: Part; dark: Part }

/** Window panels on a vertical face from (x0,y0) to (x1,y1), outward normal n. */
let ARCH_SEG = 6
function panels(p: Part, a: XY, b: XY, n: XY, bays: number, rows: [number, number][], w: number, inset = 0.4, arch = false) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const span = L - 2 * inset, step = span / bays
  for (let i = 0; i < bays; i++) {
    const c = inset + step * (i + 0.5)
    for (const [z0, z1] of rows) {
      const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * 0.06, a[1] + u[1] * s + n[1] * 0.06, z]
      const pts: V3[] = [P(c - w / 2, z0), P(c + w / 2, z0)]
      if (arch) {
        const r = w / 2, zs = z1 - r
        for (let k = 0; k <= ARCH_SEG; k++) { const t = (Math.PI * k) / ARCH_SEG; pts.push(P(c + r * Math.cos(t), zs + r * Math.sin(t))) }
      } else pts.push(P(c + w / 2, z1), P(c - w / 2, z1))
      poly(p, pts, [n[0], n[1], 0])
    }
  }
}

/** A hipped roof over an axis-aligned rectangle, ridge along the long side. */
function hipRoof(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, h: number) {
  const along = x1 - x0 >= y1 - y0
  const k = Math.min(x1 - x0, y1 - y0) / 2
  const A: V3 = [x0, y0, z0], B: V3 = [x1, y0, z0], C: V3 = [x1, y1, z0], Dd: V3 = [x0, y1, z0]
  if (along) {
    const r0: V3 = [x0 + k, (y0 + y1) / 2, z0 + h], r1: V3 = [x1 - k, (y0 + y1) / 2, z0 + h]
    polyDir(p, [A, B, r1, r0], [0, -1, 1]); polyDir(p, [C, Dd, r0, r1], [0, 1, 1])
    polyDir(p, [B, C, r1], [1, 0, 1]); polyDir(p, [Dd, A, r0], [-1, 0, 1])
  } else {
    const r0: V3 = [(x0 + x1) / 2, y0 + k, z0 + h], r1: V3 = [(x0 + x1) / 2, y1 - k, z0 + h]
    polyDir(p, [B, C, r1, r0], [1, 0, 1]); polyDir(p, [Dd, A, r0, r1], [-1, 0, 1])
    polyDir(p, [A, B, r0], [0, -1, 1]); polyDir(p, [C, Dd, r1], [0, 1, 1])
  }
}

/** A range: walls to the cornice, a cornice band, a parapet, a hipped roof. */
function range(P: Parts, wall: Part, x0: number, x1: number, y0: number, y1: number, top: number, roofH: number, D: boolean) {
  box(wall, x0, x1, y0, y1, 0, top - 1.0, 0.3, false, P.roof)
  // cornice: a projecting band
  box(P.trim, x0 - 0.45, x1 + 0.45, y0 - 0.45, y1 + 0.45, top - 1.0, top - 0.3, 0, true, P.roof)
  // parapet / balustrade band, set back on the cornice, with the roof inside
  const r = rect(x0 - 0.15, x1 + 0.15, y0 - 0.15, y1 + 0.15)
  walls(P.trim, r, top - 0.3, top + 0.6)
  if (D) walls(P.trim, rect(x0 + 0.25, x1 - 0.25, y0 + 0.25, y1 - 0.25), top - 0.3, top + 0.6, true)
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4], ri = rect(x0 + 0.25, x1 - 0.25, y0 + 0.25, y1 - 0.25), c = ri[(i + 1) % 4], d = ri[i]
    poly(P.trim, [[...a, top + 0.6], [...b, top + 0.6], [...c, top + 0.6], [...d, top + 0.6]], UP)
  }
  hipRoof(P.roof, x0 + 0.25, x1 - 0.25, y0 + 0.25, y1 - 0.25, top - 0.3, roofH)
}

/** A row of round columns from a to b (centres), n of them, pairs when `pair` > 0. */
function columnRow(p: Part, a: XY, b: XY, n: number, r: number, z0: number, z1: number, seg: number, pair = 0) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1)
    const c: XY = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
    const offs = pair > 0 ? [-pair / 2, pair / 2] : [0]
    for (const o of offs) cyl(p, c[0] + u[0] * o, c[1] + u[1] * o, r, z0, z1, seg)
  }
}

/** A pediment on a face: triangle from s0..s1 along the edge a->b, base z0, rise h, depth d out from the face. */
function pedimentOn(P: Parts, a: XY, b: XY, n: XY, s0: number, s1: number, z0: number, h: number, d: number, back = 0) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const at = (s: number, z: number, o: number): V3 => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o, z]
  const sm = (s0 + s1) / 2
  poly(P.trim, [at(s0, z0, d), at(s1, z0, d), at(sm, z0 + h, d)], [n[0], n[1], 0])
  const half = (s1 - s0) / 2, l = Math.hypot(half, h)
  polyDir(P.roof, [at(s0, z0, -back), at(s0, z0, d), at(sm, z0 + h, d), at(sm, z0 + h, -back)], [-u[0] * h / l, -u[1] * h / l, half / l])
  polyDir(P.roof, [at(sm, z0 + h, -back), at(sm, z0 + h, d), at(s1, z0, d), at(s1, z0, -back)], [u[0] * h / l, u[1] * h / l, half / l])
  polyDir(P.trim, [at(s0, z0, -back), at(s1, z0, -back), at(s1, z0, d), at(s0, z0, d)], DN)
}

/**
 * A giant-order portico on a face: n columns standing proud of the wall, an
 * entablature, a pediment. s0..s1 along a->b; outward n.
 */
function portico(P: Parts, a: XY, b: XY, n: XY, s0: number, s1: number, cols: number, zb: number, zc: number, D: boolean, ped = true, depth = 2.2, pair = 0, shade = true, pedS0 = s0, pedS1 = s1) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const at = (s: number, o: number): XY => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o]
  const r = D ? 0.55 : 0.6
  // the wall behind reads darker, so the columns stand out
  const w0 = at(s0 + 0.3, 0.02), w1 = at(s1 - 0.3, 0.02)
  if (shade) poly(P.dark, [[...w0, zb], [...w1, zb], [...w1, zc], [...w0, zc]], [n[0], n[1], 0])
  columnRow(P.trim, at(s0 + 0.9, depth - 0.8), at(s1 - 0.9, depth - 0.8), cols, r, zb, zc, D ? 10 : 6, pair)
  // entablature block
  const e0 = at(s0, 0), e1 = at(s1, 0), e2 = at(s1, depth), e3 = at(s0, depth)
  const ring = ccw([e0, e1, e2, e3])
  prism(P.trim, ring, zc, zc + 1.5, true, true)
  if (ped) pedimentOn(P, a, b, n, pedS0, pedS1, zc + 1.5, Math.min(4.0, (pedS1 - pedS0) * 0.22), depth, 0)
  // plinth under the columns
  prism(P.stone, ring, 0, zb, true)
}

function half(D: boolean, west: boolean): Parts {
  ARCH_SEG = D ? 8 : 3
  const roof = new Part()
  // the shade under porticoes and the colonnade walks shares the lead colour
  const P: Parts = { stone: new Part(), trim: new Part(), roof, win: new Part(), brick: new Part(), gilt: new Part(), lead: new Part(), dark: roof }
  const brick = west ? P.brick : P.stone
  let last = 0
  const mark = (l: string) => { const t = [P.stone, P.trim, P.roof, P.win, P.brick, P.gilt].reduce((n, q) => n + q.triangles, 0); if (process.env.DEBUG && west) console.log(l.padEnd(14), t - last); last = t }
  const SEG = D ? 10 : 5

  // =========================================================================
  // King William Court (west, domed): heights from lidar above the riverside
  // ground: ranges 20.5-21.5 to the roofs, cornice ~19.
  // =========================================================================
  const RT = 18.8, RH = 2.2 // range parapet top, roof rise
  // north range (the Painted Hall), x -84..-24, y -23..-2
  range(P, P.stone, -84, -35, -23, -2.5, RT, RH, D)
  // outer (west) range, brick (Hawksmoor), x -84..-71
  range(P, brick, -84, -71, -80, -23, RT, RH, D)
  // south range, brick, x -84..-16.5, y -102..-80
  range(P, brick, -84, -16.5, -102, -80, RT, RH, D)
  // inner court faces of the west and south ranges and the outer faces
  {
    const rows: [number, number][] = [[2.0, 7.4], [9.2, 15.6]]
    // north range: north front (faces the river courts) and court side
    panels(P.win, [-84, -2.5], [-38, -2.5], [0, 1], 9, rows, 1.9, 0.8, true)
    if (D) panels(P.win, [-38, -23], [-84, -23], [0, -1], 8, rows, 1.9, 1.5, true)
    // west range: outer face (King William Walk) and court face
    panels(P.win, [-84, -23], [-84, -80], [-1, 0], 11, rows, 1.6, 1.0)
    if (D) panels(P.win, [-71, -80], [-71, -23], [1, 0], 10, rows, 1.6, 1.0)
    // south range: outer face (Romney Road) and court face
    panels(P.win, [-16.5, -102], [-84, -102], [0, -1], 13, rows, 1.6, 1.0)
    if (D) panels(P.win, [-71, -80], [-24, -80], [0, 1], 8, rows, 1.6, 1.0)
    // brick ranges: stone quoins and a central pedimented stone frontispiece
    if (west) {
      for (const [x, y] of [[-84, -23], [-84, -80], [-84, -102], [-16.5, -102]] as XY[]) box(P.stone, x - 0.35, x + 2.2, y - 0.35, y + 2.2, 0, RT - 1.0, 0, false)
    }
    portico(P, [-84, -23], [-84, -80], [-1, 0], 22, 35, 4, 1.2, 14.8, D, true, 1.6)
    portico(P, [-16.5, -102], [-84, -102], [0, -1], 27.5, 40, 4, 1.2, 14.8, D, true, 1.6)
  }
  mark('kw-ranges')
  // the north front's pedimented centre over the Painted Hall
  pedimentOn(P, [-84, -2.5], [-36, -2.5], [0, 1], 14, 34, RT - 0.3, 3.2, 0.9)

  mark('kw-front')
  // --- the dome tower, centre (-28.5, -13) -----------------------------------
  const TX = -28.5, TY = -13
  // tower body: square, to the cornice; pediments north and south (photos)
  const T0 = -35, T1 = -23.9
  box(P.stone, T0, T1, -23, -2.5, 0, 21.8, 0.3, false, P.roof)
  box(P.trim, T0 - 0.4, T1 + 0.4, -23.4, -2.1, 21.0, 21.8, 0, true, P.roof)
  for (const sgn of [1, -1]) {
    const yy = sgn > 0 ? -2.5 : -23
    const a: XY = sgn > 0 ? [T0, yy] : [T1, yy], b: XY = sgn > 0 ? [T1, yy] : [T0, yy]
    pedimentOn(P, a, b, [0, sgn], 0.2, T1 - T0 - 0.2, 21.8, 3.4, 0.6, 0)
    // the great arched window under it
    panels(P.win, a, b, [0, sgn], 1, [[11.0, 20.0]], 3.6, 0, true)
  }
  mark('tower')
  // square stage under the drum, then the drum
  const DX = TX, DY = TY
  box(P.stone, DX - 6.0, DX + 6.0, DY - 6.0, DY + 6.0, 21.8, 25.0, 0.6, false, P.roof)
  box(P.trim, DX - 6.3, DX + 6.3, DY - 6.3, DY + 6.3, 24.8, 25.4, 0.8, true, P.trim)
  const RING = D ? 32 : 16
  // drum core (dark between the columns: the windows) and the coupled columns
  lathe(P.dark, DX, DY, [[5.3, 25.4], [5.3, 31.0]], RING) // the drum wall reads dark behind its columns
  const nWin = 8
  for (let k = 0; k < nWin; k++) {
    const t = ((k + 0.5) * 2 * Math.PI) / nWin
    const c: XY = [DX + 5.36 * Math.cos(t), DY + 5.36 * Math.sin(t)], tn: XY = [-Math.sin(t), Math.cos(t)]
    const pts: V3[] = [[c[0] - tn[0] * 0.7, c[1] - tn[1] * 0.7, 26.2], [c[0] + tn[0] * 0.7, c[1] + tn[1] * 0.7, 26.2], [c[0] + tn[0] * 0.7, c[1] + tn[1] * 0.7, 30.2], [c[0] - tn[0] * 0.7, c[1] - tn[1] * 0.7, 30.2]]
    poly(P.win, pts, [Math.cos(t), Math.sin(t), 0])
  }
  for (let k = 0; k < 8; k++) {
    const t = (k * 2 * Math.PI) / 8, tn: XY = [-Math.sin(t), Math.cos(t)]
    const c: XY = [DX + 6.5 * Math.cos(t), DY + 6.5 * Math.sin(t)]
    for (const o of [-0.62, 0.62]) cyl(P.trim, c[0] + tn[0] * o, c[1] + tn[1] * o, 0.38, 25.4, 31.0, D ? SEG : 5)
    if (D) for (const o of [-0.62, 0.62]) {
      // bases and capitals
      cyl(P.trim, c[0] + tn[0] * o, c[1] + tn[1] * o, 0.5, 25.4, 25.75, 8, true)
      cyl(P.trim, c[0] + tn[0] * o, c[1] + tn[1] * o, 0.52, 30.65, 31.0, 8, true)
    }
  }
  mark('drum')
  // entablature ring, the clock attic, the dome, ribs, lantern, finial
  lathe(P.trim, DX, DY, [[7.25, 31.0], [7.25, 32.2]], RING)
  lathe(P.trim, DX, DY, [[7.25, 32.2], [6.1, 32.2]], RING)
  lathe(P.stone, DX, DY, D ? [[6.1, 32.2], [6.1, 34.3], [6.45, 34.6], [6.3, 34.6]] : [[6.1, 32.2], [6.1, 34.6]], RING)
  // clock dials on the attic, the four faces
  for (let k = 0; k < 4; k++) {
    const t = BEARING_DIALS[k]
    const c: V3 = [DX + 6.14 * Math.cos(t), DY + 6.14 * Math.sin(t), 33.4]
    const nn: V3 = [Math.cos(t), Math.sin(t), 0], tn: V3 = [-Math.sin(t), Math.cos(t), 0]
    const pts = Array.from({ length: D ? 12 : 8 }, (_, i) => { const a = (2 * Math.PI * i) / (D ? 12 : 8); return ad(c, ad(sc(tn, 0.85 * Math.cos(a)), [0, 0, 0.85 * Math.sin(a)])) as V3 })
    poly(P.gilt, pts.reverse(), nn)
    poly(P.dark, Array.from({ length: 8 }, (_, i) => { const a = -(2 * Math.PI * i) / 8; return ad(ad(c, sc(nn, 0.02)), ad(sc(tn, 0.62 * Math.cos(a)), [0, 0, 0.62 * Math.sin(a)])) as V3 }), nn)
  }
  mark('attic-clock')
  // the lead dome: a raised semi-ellipse r 5.95, rise 4.5
  const domeProf: [number, number][] = []
  const DR = D ? 8 : 5
  for (let k = 0; k <= DR; k++) { const a = (Math.PI / 2) * (k / DR); domeProf.push([6.3 * Math.cos(a), 34.6 + 5.0 * Math.sin(a)]) }
  domeProf[DR][0] = 1.4
  lathe(P.lead, DX, DY, domeProf, RING, 0, 0, 2 * Math.PI, true)
  mark('dome')
  // ribs (raised), 16 in the detail model, 8 in the low one
  const NR = D ? 16 : 8
  for (let k = 0; k < NR; k++) {
    const t = (k * 2 * Math.PI) / NR + Math.PI / NR
    const pts: V3[] = []
    const RS = D ? DR : 3
    for (let j = 0; j <= RS; j++) { const a = (Math.PI / 2) * (j / RS) * 0.92; const o = D ? 0.12 : 0.3; pts.push([DX + (6.3 * Math.cos(a) + o) * Math.cos(t), DY + (6.3 * Math.cos(a) + o) * Math.sin(t), 34.6 + (5.0 + o) * Math.sin(a) + 0.05]) }
    for (let j = 0; j < pts.length - 1; j++) rod(P.roof, pts[j], pts[j + 1], 0.18, 0.15, D ? 4 : 3, false, Math.PI / 2)
  }
  mark('ribs')
  // lantern: six columns round a core, cornice, a little dome, gilt ball and vane
  const LS = D ? 12 : 8
  lathe(P.trim, DX, DY, [[1.9, 39.5], [1.9, 40.0], [1.2, 40.0]], LS)
  lathe(P.dark, DX, DY, [[0.9, 40.0], [0.9, 41.6]], D ? 8 : 6)
  for (let k = 0; k < 6; k++) { const t = (k * 2 * Math.PI) / 6; cyl(P.trim, DX + 1.45 * Math.cos(t), DY + 1.45 * Math.sin(t), 0.22, 40.0, 41.6, D ? 8 : 4) }
  lathe(P.lead, DX, DY, D ? [[0.9, 41.6], [1.95, 41.6], [1.95, 42.0], [1.5, 42.0], [0.2, 43.0]] : [[1.95, 41.6], [1.95, 42.0], [0.2, 43.0]], LS)
  sphere(P.gilt, [DX, DY, 43.45], 0.5, D ? 8 : 6, D ? 4 : 3)
  rod(P.gilt, [DX, DY, 43.8], [DX, DY, 45.3], 0.12, 0.08, 4, true)
  box(P.gilt, DX - 0.05, DX + 0.05, DY - 0.9, DY + 0.5, 44.7, 45.1, 0, true) // the vane

  mark('lantern')
  // --- the colonnade along the axis: paired Doric columns on a plinth, a
  //     back wall to the court, entablature and balustrade -----------------
  const CB = 2.2, CT = 9.0, CE = 10.6, CP = 11.4 // plinth top, column top, entablature, parapet
  const CX0 = -24, CX1 = -16.5
  box(P.stone, CX0, CX1, -80, -3, 0, CB, 0, false)
  box(P.stone, CX0, CX0 + 1.0, -80, -3, CB, CE, 0, false) // back wall
  // dark band of the walk behind the columns (the shade under the roof)
  poly(P.dark, [[CX0 + 1.04, -80, CB], [CX0 + 1.04, -3, CB], [CX0 + 1.04, -3, CT], [CX0 + 1.04, -80, CT]], [1, 0, 0])
  // the colonnade's walk ceiling seen from the axis is the entablature's underside
  box(P.trim, CX0, CX1 + 0.3, -80.3, -3, CT, CE, 0, true, P.roof)
  // balustrade along the outer edge and a lead roof behind
  walls(P.trim, rect(CX1 - 0.6, CX1 + 0.3, -80.3, -3), CE, CP)
  cap(P.trim, rect(CX1 - 0.6, CX1 + 0.3, -80.3, -3), CP, true)
  const pairs = D ? 19 : 15
  columnRow(P.trim, [CX1 - 0.4, -78.5], [CX1 - 0.4, -6.0], pairs, D ? 0.42 : 0.45, CB, CT, SEG, 1.15)
  if (D) {
    // the inner row of columns along the walk (single columns opposite each pair)
    columnRow(P.trim, [CX0 + 2.0, -78.5], [CX0 + 2.0, -6.0], pairs, 0.38, CB, CT, 8)
    // the back wall's arched recesses
    panels(P.dark, [CX0 + 1.0, -80], [CX0 + 1.0, -3], [1, 0], 18, [[CB + 0.6, CT - 0.8]], 1.8, 1.0, true)
  }
  mark('colonnade')
  // the colonnade's north return in front of the tower: a portico facing the river
  box(P.stone, -40, CX1, -3, 2.0, 0, CB, 0, false)
  box(P.trim, -40, CX1 + 0.3, -3, 2.3, CT, CE, 0, true, P.roof)
  walls(P.trim, rect(-40, CX1 + 0.3, 1.4, 2.3), CE, CP)
  cap(P.trim, rect(-40, CX1 + 0.3, 1.4, 2.3), CP, true)
  poly(P.dark, [[-40, -2.4, CB], [CX1, -2.4, CB], [CX1, -2.4, CT], [-40, -2.4, CT]], [0, 1, 0])
  columnRow(P.trim, [-38.8, 1.4], [CX1 - 0.4, 1.4], 6, D ? 0.42 : 0.45, CB, CT, SEG, 1.15)
  if (D) columnRow(P.trim, [-38.8, -1.0], [CX1 - 0.4, -1.0], 6, 0.38, CB, CT, 8)
  // steps up to the terrace at the north end
  box(P.stone, -40, CX1, 2.0, 3.6, 0, 1.1, 0, false)

  // =========================================================================
  mark('return')
  // King Charles Court (river, west): ranges round a court; heights from
  // lidar: river and south ranges with an attic to ~19.6-20.5, long ranges
  // to ~15-16.5; giant order porticoes with pediments (photos).
  // =========================================================================
  const KX0 = -94, KX1 = -40, KY0 = 10, KY1 = 101, CXa = -74, CXb = -58, CY0 = 22, CY1 = 87
  const LT = 13.6 // long ranges' parapet (lidar: roofs to 14.7-16.5)
  // long ranges (west and east of the court)
  range(P, P.stone, KX0, CXa, CY0, CY1, LT, 1.6, D)
  range(P, P.stone, CXb, KX1, CY0, CY1, LT, 1.6, D)
  // river (north) and south ranges, with their attic storey
  for (const [y0, y1] of [[CY1, KY1], [KY0, CY0]] as [number, number][]) {
    range(P, P.stone, KX0, KX1, y0, y1, 18.6, 1.8, D) // lidar: 19-20.8 to the roof
    // the attic's set-back cornice line at the main order (14 m)
    box(P.trim, KX0 - 0.4, KX1 + 0.4, y0 - 0.4, y1 + 0.4, 13.6, 14.3, 0, true, P.roof)
  }
  mark('kc-ranges')
  {
    const rows: [number, number][] = [[2.4, 6.4], [8.2, 12.0]]
    const attic: [number, number][] = [[15.0, 16.9]]
    // river front: centre portico, windows either side
    panels(P.win, [KX1, KY1], [-56, KY1], [0, 1], 3, [...rows, ...attic], 1.3, 0.8)
    panels(P.win, [-78, KY1], [KX0, KY1], [0, 1], 3, [...rows, ...attic], 1.3, 0.8)
    portico(P, [KX1, KY1], [KX0, KY1], [0, 1], 16.5, 37.5, 4, 1.0, 13.0, D, true, 2.0)
    // the south range's face to Romney Road side (to the domed court)
    panels(P.win, [KX0, KY0], [KX1, KY0], [0, -1], 10, [...rows, ...attic], 1.3, 1.5)
    // the axis faces (x = -40): end pavilions with giant columns and pediments
    // (photos: the river court pavilions facing the Grand Square), and the
    // long range between with its own pedimented centre
    portico(P, [KX1, KY0], [KX1, CY0], [1, 0], 0.4, 11.6, 5, 1.0, 13.0, D, true, 1.4, 0, false, 2.6, 9.4)
    portico(P, [KX1, CY1], [KX1, KY1], [1, 0], 0.4, 13.6, 6, 1.0, 13.0, D, true, 1.4, 0, false, 2.8, 11.2)
    portico(P, [KX1, CY0], [KX1, CY1], [1, 0], 25.5, 39.5, 4, 1.0, 11.4, D, true, 1.6)
    panels(P.win, [KX1, CY0], [KX1, 46.5], [1, 0], 5, rows, 1.6, 1.0)
    panels(P.win, [KX1, 62.5], [KX1, CY1], [1, 0], 5, rows, 1.6, 1.0)
    // the west face (to the town) and the court faces
    panels(P.win, [KX0, KY1], [KX0, KY0], [-1, 0], 18, rows, 1.6, 1.5)
    if (D) panels(P.win, [CXa, CY0], [CXa, CY1], [1, 0], 12, rows, 1.6, 1.0)
    if (D) panels(P.win, [CXb, CY1], [CXb, CY0], [-1, 0], 12, rows, 1.6, 1.0)
  }
  mark('kc-front')
  // chimney stacks along the attic ranges (photos)
  for (const y of [94, 16]) for (const x of D ? [-90, -80, -54, -44] : [-86, -48]) box(P.stone, x - 0.9, x + 0.9, y - 0.6, y + 0.6, 18.6, 21.4, 0, false, P.stone)
  mark('chimneys')
  return P
}

const BEARING_DIALS = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]

/** Mirror every triangle of `src` across x = 0 into `dst` (winding kept). */
function mirrorInto(src: Part, dst: Part) {
  const p = src.pos, n = src.nrm
  for (let t = 0; t < p.length / 9; t++) {
    const v = (k: number): V3 => [-p[t * 9 + k * 3], -p[t * 9 + k * 3 + 2], p[t * 9 + k * 3 + 1]] // glTF -> map, mirrored x
    const m = (k: number): V3 => [-n[t * 9 + k * 3], -n[t * 9 + k * 3 + 2], n[t * 9 + k * 3 + 1]]
    dst.tri(v(0), v(2), v(1), undefined, undefined, undefined, [m(0), m(2), m(1)])
  }
}

function build(D: boolean): Mat[] {
  const W = half(D, true), E = half(D, false)
  for (const k of Object.keys(W) as (keyof Parts)[]) if (k !== 'dark') mirrorInto(E[k], W[k])
  // stone and trim are one Portland stone (the slot goes to the dome lead)
  W.stone.pos.push(...W.trim.pos); W.stone.nrm.push(...W.trim.nrm); W.stone.uv.push(...W.trim.uv)
  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : p[2] < 24 ? 0.85 : 0.6)
  return [
    { part: W.stone, material: { ...finish('portland-stone', 0xeee4d2), floodlight: lit } },
    { part: W.lead, material: { ...finish('dome-lead', 0x66727f, 0.6), floodlight: (p, n) => (n[2] > 0.8 ? 0.1 : 0.35) } },
    { part: W.roof, material: PALETTE.roof },
    { part: W.win, material: PALETTE.window },
    { part: W.brick, material: { ...finish('red-brick', 0xb67760), floodlight: (p, n) => (n[2] > 0.7 ? 0 : 0.4) } },
    { part: W.gilt, material: { ...finish('gilt', 0xd6ad4e, 0.5), floodlight: () => 0.7 } },
  ]
}

const REPLACES = [
  'relation/3206882', 'relation/14291264', 'relation/14291263', 'relation/3206883',
  ...'1105881559 1105881560 1125965428 1125965429 1125965430 1125965431 1125965432 1125965433 1125965434 1125965435 1125965436 1125965437 1125965438 1125965439 1183675921 1183675922 1183675923 1183675924'
    .split(' ').map((n) => `way/${n}`),
]

if (import.meta.main) {
  for (const [file, D, maxTri, maxBytes] of [
    [`${ID}.glb`, false, 6500, 256000],
    [`${ID}.detail.glb`, true, 40000, 1536 * 1024],
  ] as [string, boolean, number, number][]) {
    const parts = build(D)
    const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
    const glb = writeGlb('Old Royal Naval College', parts, {
      license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 45.3,
      frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', replaces: REPLACES,
    })
    const out = new URL(`../models/${file}`, import.meta.url).pathname
    await Bun.write(out, glb)
    console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
    if (triangles > maxTri) console.error(`${file}: triangle budget exceeded: ${triangles}`)
    if (glb.length > maxBytes) console.error(`${file}: file budget exceeded: ${glb.length}`)
  }
}
