/**
 * Washington National Cathedral (Cathedral Church of Saint Peter and Saint
 * Paul) — procedural, CC0-1.0, no textures. bun generators/dc-national-cathedral.ts
 *
 * Also the small kit for the church group (dc-national-cathedral,
 * dc-national-shrine, dc-st-matthews, dc-washington-temple): the helpers
 * below are exported and the model is only built when this file is run
 * directly. They sit on the President's Park kit in dc-white-house.ts and
 * the Smithsonian kit in dc-smithsonian-castle.ts.
 *
 * Map frame: x along the church's axis towards the altar, y to its left
 * (liturgical north), z up, metres. The axis runs at 70° (the nave's long
 * walls in OSM, 69.5–71.2°), so the placement bearing is 340°. The anchor is
 * the area centroid of the OSM outline relation/2682714 (lng -77.0707911,
 * lat 38.9306103); the central vessel's axis sits at y = −7.4 in this frame.
 *
 * What it is: George Bodley and Henry Vaughan's English Decorated Gothic
 * cathedral (1907–1990, completed by Philip Frohman) in buff Indiana
 * limestone under light grey metal roofs. A cruciform church: nine-bay nave
 * with wide aisles, six-bay transept, five-bay choir ending in a polygonal
 * apse; flying buttresses down both sides; the Gloria in Excelsis tower over
 * the crossing; the twin towers of St Peter and St Paul on the west front
 * with the west rose between them; rose windows in both transept fronts.
 *
 * Covers and replaces relation/2682714, the outline (outer way/67829238;
 * the inner way/199784167 is the cloister garth, left open), and its four
 * building:parts: way/1176354412 (nave), way/1176354409 (transept),
 * way/1176354410 (Gloria in Excelsis Tower), way/1176354411 (choir). The
 * outline takes in the low ranges round the garth to the north (the north
 * porch, cloister walks and the administration range) and two low annexes
 * beside the west towers; they are modelled as plain low blocks so the
 * outline can be hidden.
 *
 * Evidence
 * - OSM (measured): outline 155 × 100 m; central vessel 14.3 m wide
 *   (y −14.6…−0.2), nave x −75…3.4, crossing x 3.4…18.3, choir to the apse
 *   tip at x 70.6; transept y −38.7…24.9; aisle walls at y −27.6 and 13.8
 *   with buttresses every 6.9 m (x −53.3 … −11.9); the west front at
 *   x −77, 39 m wide; north porch to y 35; garth x 25…56, y 9…42.
 * - Published (Wikipedia, "Washington National Cathedral"): central tower
 *   301 ft (92 m) above the ground, its top 676 ft (206 m) above sea level;
 *   west towers 234 ft (71 m) (cathedral fact sheets, via the lead's brief).
 * - USGS 3DEP ground (measured): 117.5 m at the west front, 114.3 m at the
 *   north porch and choir, 111.2 m at the administration range, the lowest
 *   point. So y = 0 is 111.2 m; the church floor datum D is 6 m up, and the
 *   central tower's top lands at 206 − 111.2 = 94.8 m.
 * - Photos (Wikimedia Commons): "Washington National Cathedral Looking
 *   SE.jpg" (Duane Lempke, CC0; aerial from the north-west);
 *   "NWDCcathedral.jpg" (Duane Lempke, CC0; telephoto from the west-south-
 *   west); "Washington National Cathedral facade.jpg" (APK, CC BY 4.0; the
 *   west front square on); "National Cathedral, Washington, D.C
 *   LCCN2011631148.tif" (Carol M. Highsmith, public domain; west front);
 *   "National Cathedral in DC.jpg" (Siubo11A, CC BY-SA 3.0; north side);
 *   "Washington National Cathedral 2008.jpg" (Martin Künzel, CC BY 3.0;
 *   north transept). USGS NAIP orthophoto for the plan and roof colour.
 * - Read off the photos (estimated, against the published heights): west
 *   gallery parapet D+34, west tower parapets D+60.5, belfry lancets
 *   D+38…50; nave and choir eaves D+31, ridge D+40.5 (the west gable's
 *   cross just clears the gallery); aisles D+20, choir aisles D+18; central
 *   tower parapet 78 m with corner pinnacles to 94.8 m, lancets in two tiers
 *   48.6–55 m and 64–74 m; transept front turrets to D+48; rose windows
 *   about 7.5–8.5 m across.
 * - Simplified: flying buttresses are one sloping slab per bay each side;
 *   tracery, gables over the portals, statues and crockets are left out;
 *   the low ranges round the garth are one 13 m block with the
 *   administration range on it. The central tower is drawn without the
 *   repair scaffolding it carried in 2014–2024.
 */
import { Part, cross, len, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, gable, grow, qf, rect, tf, type Rect, type Side } from './dc-white-house'
import { ngon, ngonPrism, roundWin, spire } from './dc-smithsonian-castle'

export { cbox, gable, grow, qf, rect, tf, ngon, ngonPrism, roundWin, spire }
export type { Rect, Side }

// ===========================================================================
// Kit for the church group.

export type XY = [number, number]
const NRM: Record<Side, V3> = { n: [0, 1, 0], s: [0, -1, 0], e: [1, 0, 0], w: [-1, 0, 0] }

/** Map (along, z) on a wall plane to a point lifted d off it. */
function wallMap(side: Side, at: number, d: number) {
  const n = NRM[side], ns = side === 'n' || side === 's'
  const off = at + (ns ? n[1] : n[0]) * d
  return { n, P: (a: number, z: number): V3 => (ns ? [a, off, z] : [off, a, z]) }
}

/** A flat convex outline (a fan from its first point) on a wall. */
function wallFan(p: Part, side: Side, at: number, pts: XY[], d: number) {
  const { n, P } = wallMap(side, at, d)
  for (let i = 1; i < pts.length - 1; i++) tf(p, P(...pts[0]), P(...pts[i]), P(...pts[i + 1]), n)
}

/**
 * A Gothic lancet: a flat panel up to the springing line and an
 * equilateral pointed head (two arcs of radius = the width), so the whole
 * window is z0..z1 tall. On the wall plane `at`, spanning a0..a1.
 */
export function lancet(p: Part, side: Side, at: number, a0: number, a1: number, z0: number, z1: number, d = 0.05, seg = 3) {
  const w = a1 - a0, h = (w * Math.sqrt(3)) / 2, spring = Math.max(z0, z1 - h)
  const pts: XY[] = [[a0, z0], [a1, z0], [a1, spring]]
  for (let k = 1; k <= seg; k++) { const t = (Math.PI / 3) * (k / seg); pts.push([a0 + w * Math.cos(t), spring + w * Math.sin(t)]) }
  for (let k = seg - 1; k >= 0; k--) { const t = (Math.PI / 3) * (k / seg); pts.push([a1 - w * Math.cos(t), spring + w * Math.sin(t)]) }
  wallFan(p, side, at, pts, d)
}

/** A round-headed (semicircular) window or door, z0..z1 overall. */
export function roundArch(p: Part, side: Side, at: number, a0: number, a1: number, z0: number, z1: number, d = 0.05, seg = 6) {
  const r = (a1 - a0) / 2, spring = Math.max(z0, z1 - r), am = (a0 + a1) / 2
  const pts: XY[] = [[a0, z0], [a1, z0]]
  for (let k = 0; k <= seg; k++) { const t = (Math.PI * k) / seg; pts.push([am + r * Math.cos(t), spring + r * Math.sin(t)]) }
  wallFan(p, side, at, pts, d)
}

/** A pinnacle: an n-sided shaft z0..z1 and a spirelet to the tip. */
export function pinnacle(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, tip: number, n = 8) {
  ngonPrism(p, cx, cy, r, n, z0, z1, { top: false })
  spire(p, ngon(cx, cy, r, n, z1), [cx, cy, tip])
}

const unit = (v: V3): V3 => { const l = len(v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const add = (a: V3, b: V3, s = 1): V3 => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s]

/**
 * A straight beam between two centre points, w wide across (horizontal)
 * and t deep (vertical), with closed ends: a flying buttress or a brace.
 */
export function beam(p: Part, A: V3, B: V3, w: number, t: number) {
  const ax = unit(sub(B, A))
  const side = unit(cross(ax, [0, 0, 1]))
  const up = unit(cross(side, ax))
  const corners = (C: V3) => [add(add(C, side, w / 2), up, t / 2), add(add(C, side, -w / 2), up, t / 2), add(add(C, side, -w / 2), up, -t / 2), add(add(C, side, w / 2), up, -t / 2)]
  const a = corners(A), b = corners(B)
  const mid: V3 = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, (A[2] + B[2]) / 2]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const c: V3 = [(a[i][0] + a[j][0]) / 2, (a[i][1] + a[j][1]) / 2, (a[i][2] + a[j][2]) / 2]
    qf(p, a[i], a[j], b[j], b[i], sub(c, mid))
  }
  qf(p, a[0], a[1], a[2], a[3], [-ax[0], -ax[1], -ax[2]])
  qf(p, b[0], b[1], b[2], b[3], ax)
}

/** Douglas–Peucker on a closed ring: drops buttress bumps under `tol`. */
export function simplify(ring: XY[], tol: number): XY[] {
  const dp = (pts: XY[]): XY[] => {
    if (pts.length < 3) return pts
    const [a, b] = [pts[0], pts[pts.length - 1]]
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1
    let best = -1, bi = 0
    for (let i = 1; i < pts.length - 1; i++) {
      const d = Math.abs((pts[i][0] - a[0]) * dy - (pts[i][1] - a[1]) * dx) / L
      if (d > best) { best = d; bi = i }
    }
    if (best < tol) return [a, b]
    const l = dp(pts.slice(0, bi + 1)), r = dp(pts.slice(bi))
    return [...l.slice(0, -1), ...r]
  }
  // Split at the point farthest from the first, so the ring has two anchors.
  let far = 0, fd = 0
  ring.forEach((q, i) => { const d = Math.hypot(q[0] - ring[0][0], q[1] - ring[0][1]); if (d > fd) { fd = d; far = i } })
  const a = dp(ring.slice(0, far + 1)), b = dp([...ring.slice(far), ring[0]])
  return [...a.slice(0, -1), ...b.slice(0, -1)]
}

const area2 = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
export const ccw = (r: XY[]) => (area2(r) < 0 ? [...r].reverse() : r)

/**
 * Ear clipping that tolerates the doubled vertices of a keyhole bridge, so
 * a ring with a courtyard can be capped as one polygon.
 */
export function earcut(ring0: XY[]): [number, number, number][] {
  const P = ring0
  const idx = P.map((_, i) => i)
  if (area2(P) < 0) idx.reverse()
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const same = (u: XY, v: XY) => Math.abs(u[0] - v[0]) < 1e-7 && Math.abs(u[1] - v[1]) < 1e-7
  const inTri = (q: XY, a: XY, b: XY, c: XY) => cr(a, b, q) >= -1e-9 && cr(b, c, q) >= -1e-9 && cr(c, a, q) >= -1e-9
  const out: [number, number, number][] = []
  let guard = 0
  while (idx.length > 3 && guard++ < 100000) {
    let best = -1, bestScore = -Infinity
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const a = P[ia], b = P[ib], c = P[ic]
      const c2 = cr(a, b, c)
      if (c2 <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && !same(P[j], a) && !same(P[j], b) && !same(P[j], c) && inTri(P[j], a, b, c))) continue
      const e = Math.max(Math.hypot(a[0] - b[0], a[1] - b[1]), Math.hypot(b[0] - c[0], b[1] - c[1]), Math.hypot(a[0] - c[0], a[1] - c[1]))
      const score = c2 / (e * e)
      if (score > bestScore) { bestScore = score; best = i }
    }
    if (best < 0) throw new Error('earcut: polygon is not simple')
    out.push([idx[(best + idx.length - 1) % idx.length], idx[best], idx[(best + 1) % idx.length]])
    idx.splice(best, 1)
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}

/** A flat polygon at z (any winding, may be a keyhole), facing up or down. */
export function capPoly(p: Part, ring: XY[], z: number, up = true) {
  const n: V3 = [0, 0, up ? 1 : -1]
  for (const [a, b, c] of earcut(ring)) tf(p, [...ring[a], z] as V3, [...ring[b], z] as V3, [...ring[c], z] as V3, n)
}

/** Walls round a ring (any winding), facing out; skips zero-length edges. */
export function wallsPoly(p: Part, ring0: XY[], z0: number, z1: number, skip?: (a: XY, b: XY) => boolean) {
  const ring = ccw(ring0)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-6 || skip?.(a, b)) continue
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}

/** Polygon ring offset (inward when d < 0), mitred. */
export function offsetPoly(ring0: XY[], d: number): XY[] {
  const ring = ccw(ring0), n = ring.length
  const nz = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
  return ring.map((q, i) => {
    const a = ring[(i + n - 1) % n], b = ring[(i + 1) % n]
    const e1 = nz([q[0] - a[0], q[1] - a[1]]), e2 = nz([b[0] - q[0], b[1] - q[1]])
    const n1: XY = [e1[1], -e1[0]], n2: XY = [e2[1], -e2[0]]
    const m = nz([n1[0] + n2[0], n1[1] + n2[1]])
    const k = Math.max(0.5, m[0] * n1[0] + m[1] * n1[1])
    return [q[0] + (m[0] * d) / k, q[1] + (m[1] * d) / k] as XY
  })
}

/** A hipped roof over a convex ring rising to a ridge segment (or point). */
export function ridgeRoof(p: Part, ring: V3[], top: V3[]) {
  // Each eave edge rises to the nearest point of the ridge; a gable-less hip.
  const n = ring.length
  const c = top.length === 1 ? top[0] : [(top[0][0] + top[1][0]) / 2, (top[0][1] + top[1][1]) / 2, top[0][2]] as V3
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    const m: V3 = [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1], 0.5]
    const near = (q: V3) => top.reduce((best, t) => (Math.hypot(t[0] - q[0], t[1] - q[1]) < Math.hypot(best[0] - q[0], best[1] - q[1]) ? t : best))
    const ta = near(a), tb = near(b)
    if (ta === tb) tf(p, a, b, ta, m)
    else qf(p, a, b, tb, ta, m)
  }
}

/** Budgets and the write, shared by the group. */
export async function save(id: string, name: string, parts: Array<{ part: Part; material: { name: string; color: number; roughness?: number } }>, extras: Record<string, unknown>, maxTris = 5000) {
  const used = parts.filter(({ part }) => part.triangles)
  const triangles = used.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${id}: triangle budget exceeded: ${triangles}`)
  if (used.length > 6) throw new Error(`${id}: ${used.length} materials`)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...extras })
  if (glb.length > 250 * 1024) throw new Error(`${id}: file budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}

// ===========================================================================
// The cathedral.

/** OSM outline relation/2682714 (outer way/67829238), in the model frame. */
const OUTLINE: XY[] = [[61.1,40.0],[59.8,27.0],[58.3,11.3],[58.6,11.3],[58.6,8.5],[60.1,8.5],[60.0,4.2],[66.3,4.1],[68.0,7.4],[70.0,6.3],[68.4,3.4],[73.1,-1.4],[76.6,-0.2],[77.3,-2.2],[73.7,-3.6],[73.6,-10.0],[77.3,-11.5],[76.5,-13.5],[72.4,-11.9],[68.7,-16.7],[70.5,-20.1],[68.4,-21.2],[66.4,-17.6],[61.0,-17.6],[60.9,-22.4],[58.4,-22.4],[58.4,-18.6],[56.0,-18.6],[53.8,-18.6],[53.8,-23.1],[47.5,-23.0],[47.4,-26.8],[45.2,-26.7],[45.3,-23.1],[41.0,-23.0],[40.7,-27.1],[38.2,-26.9],[38.5,-23.0],[33.1,-23.0],[33.1,-27.9],[33.8,-27.9],[35.0,-28.8],[34.8,-30.3],[33.9,-31.3],[32.3,-31.1],[31.5,-30.4],[31.5,-29.7],[27.2,-29.6],[27.2,-35.0],[30.3,-35.2],[30.2,-38.5],[19.6,-38.4],[19.6,-40.4],[21.4,-41.8],[21.2,-43.7],[20.1,-45.0],[19.4,-45.0],[19.4,-46.1],[17.4,-46.1],[17.4,-45.0],[11.3,-45.0],[5.1,-45.0],[5.1,-46.2],[3.1,-46.2],[3.1,-44.9],[2.3,-44.9],[0.6,-43.6],[0.8,-41.2],[1.7,-40.4],[1.7,-39.1],[-3.4,-39.1],[-3.4,-40.8],[-5.1,-40.8],[-5.0,-38.6],[-8.6,-38.6],[-8.5,-36.3],[-5.0,-36.3],[-5.0,-30.7],[-8.4,-30.7],[-8.4,-30.0],[-12.2,-30.0],[-12.2,-27.6],[-18.0,-27.6],[-18.1,-29.3],[-19.8,-29.3],[-19.7,-27.6],[-24.7,-27.6],[-24.7,-29.2],[-26.4,-29.2],[-26.4,-27.6],[-32.0,-27.6],[-32.0,-29.1],[-33.4,-29.1],[-33.4,-27.6],[-38.6,-27.6],[-38.7,-28.9],[-40.2,-28.9],[-40.2,-27.6],[-45.6,-27.6],[-45.6,-28.8],[-47.3,-28.8],[-47.2,-27.6],[-53.1,-27.3],[-53.1,-39.2],[-59.1,-39.2],[-59.1,-43.1],[-65.6,-43.0],[-65.5,-44.3],[-71.6,-44.3],[-71.6,-28.9],[-76.1,-28.8],[-77.5,-27.4],[-77.4,-26.1],[-79.4,-26.1],[-79.4,-23.4],[-77.4,-23.4],[-77.2,-15.9],[-79.5,-15.9],[-79.5,-13.2],[-77.1,-13.2],[-77.0,-6.3],[-76.8,0.1],[-79.3,0.1],[-79.2,2.8],[-76.8,2.7],[-76.6,10.0],[-79.2,10.0],[-79.2,13.0],[-76.5,12.9],[-75.4,14.6],[-74.5,14.6],[-74.6,17.6],[-71.2,17.7],[-71.2,31.1],[-64.7,31.0],[-64.7,30.3],[-58.5,30.1],[-58.5,26.2],[-50.6,26.0],[-50.6,17.1],[-52.4,17.1],[-52.4,14.6],[-46.7,14.5],[-46.7,15.3],[-45.0,15.2],[-45.0,14.4],[-39.8,14.3],[-39.7,15.2],[-38.1,15.1],[-38.1,14.2],[-33.0,14.1],[-33.0,15.1],[-31.2,15.0],[-31.2,14.1],[-26.4,13.9],[-26.4,15.1],[-24.4,15.0],[-24.4,13.9],[-19.2,13.8],[-19.1,15.0],[-17.4,14.9],[-17.4,13.7],[-12.5,13.6],[-12.5,14.9],[-10.5,14.8],[-10.6,13.6],[-8.5,13.5],[-8.5,15.8],[-5.6,15.8],[-5.6,21.6],[-8.5,21.5],[-8.6,24.0],[-5.6,24.0],[-5.6,26.1],[-3.6,26.1],[-3.6,24.0],[1.7,24.0],[1.7,24.6],[3.0,25.9],[3.2,35.4],[11.6,35.2],[18.6,35.0],[18.6,34.4],[21.6,34.1],[22.1,39.0],[31.3,43.5],[39.7,47.7],[44.1,47.2],[45.0,56.1],[72.3,53.3],[71.3,43.4],[62.4,44.3],[62.0,40.0]]
/** The cloister garth, inner way/199784167, left open. */
const GARTH: XY[] = [[24.8,23.2],[26.1,32.3],[26.5,35.1],[33.6,39.0],[40.9,42.6],[43.8,42.3],[43.2,37.0],[48.2,36.6],[48.9,41.7],[56.2,40.9],[54.8,27.5],[53.0,11.4],[52.0,11.4],[51.9,9.2],[46.7,9.1],[46.6,13.0],[44.8,13.0],[44.9,11.7],[40.0,11.6],[40.0,12.6],[38.3,12.6],[38.4,9.1],[33.0,9.0],[33.1,14.7],[32.6,14.8],[32.6,16.9],[31.3,17.0],[31.3,14.8],[28.6,15.0],[28.5,23.1]]

function build() {
  const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part(), shade = new Part()

  const YC = -7.4 // the central vessel's axis
  const Y = (v: number) => YC + v
  const D = 6 // church floor datum above the lowest ground (USGS)
  const HW = 7.2 // half-width of nave, choir and transept vessels
  const EAVE = D + 31, RIDGE = D + 40.5
  const AISLE = D + 20, CAISLE = D + 18
  const PODIUM = 13

  // ---- Low ranges: the outline (buttress bumps dropped, pulled 0.3 m in
  // so its walls never sit on the church's own) with the garth cut out by
  // a keyhole bridge, as one 13 m block.
  {
    const outer = offsetPoly(simplify(OUTLINE, 1.8), -0.3)
    const inner = ccw(simplify(GARTH, 1.2)).reverse() // clockwise: a hole
    // Bridge from the outer vertex nearest the garth's first point.
    const g0 = inner[0]
    let bi = 0, bd = Infinity
    outer.forEach((q, i) => { const d = Math.hypot(q[0] - g0[0], q[1] - g0[1]); if (d < bd) { bd = d; bi = i } })
    const ring: XY[] = [...outer.slice(0, bi + 1), ...inner, inner[0], outer[bi], ...outer.slice(bi + 1)]
    wallsPoly(stone, outer, 0, PODIUM)
    // The garth's walls face into the courtyard.
    for (let i = 0; i < inner.length; i++) {
      const a = inner[i], b = inner[(i + 1) % inner.length]
      stone.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], PODIUM], [a[0], a[1], PODIUM])
    }
    capPoly(roof, ring, PODIUM, true)
  }
  // The administration range north of the garth: three storeys, slate hip.
  {
    const r: XY[] = [[44.4, 47.4], [45.2, 55.8], [72.0, 53.0], [71.1, 43.7]]
    wallsPoly(stone, r, PODIUM - 0.5, 15)
    const ring = r.map(([x, y]) => [x, y, 15] as V3)
    const top: V3[] = [[50, 50.8, 20], [66, 49.1, 20]]
    ridgeRoof(roof, ring, top)
  }
  // The north porch in front of the north transept.
  cbox(stone, rect(3.4, 18.2, 24.9, 35.0), 0, D + 13, { b: 0.4, top: roof })
  // The south porch.
  cbox(stone, rect(1.8, 19.8, -45.2, -38.7), 0, D + 10, { b: 0.4, top: roof })

  // ---- Aisles: nave, transept arms, choir.
  const NAVE_X0 = -61, CROSS0 = 3.4, CROSS1 = 18.3, CHOIR_X1 = 63.5
  cbox(stone, rect(NAVE_X0, CROSS0, Y(-20.2), Y(-HW)), 0, AISLE, { b: 0.4, top: roof })
  cbox(stone, rect(NAVE_X0, CROSS0, Y(HW), Y(21.2)), 0, AISLE, { b: 0.4, top: roof })
  cbox(stone, rect(-5.0, 27.0, -38.6, Y(-15.5)), 0, AISLE - 1, { b: 0.4, top: roof })
  cbox(stone, rect(-5.6, 27.0, Y(15.5), 24.9), 0, AISLE - 1, { b: 0.4, top: roof })
  cbox(stone, rect(CROSS1, 61, Y(-15.6), Y(-HW)), 0, CAISLE, { b: 0.4, top: roof })
  cbox(stone, rect(CROSS1, 61, Y(HW), Y(16.5)), 0, CAISLE, { b: 0.4, top: roof })
  // Aisle parapets.
  for (const [r, z] of [[rect(NAVE_X0, CROSS0, Y(-20.2), Y(-HW)), AISLE], [rect(NAVE_X0, CROSS0, Y(HW), Y(21.2)), AISLE],
    [rect(CROSS1, 61, Y(-15.6), Y(-HW)), CAISLE], [rect(CROSS1, 61, Y(HW), Y(16.5)), CAISLE]] as Array<[Rect, number]>) {
    cbox(trim, grow(r, 0.25), z - 1.2, z, { b: 0.3, top: false, bottom: true })
  }

  // ---- The three vessels: walls to the eaves, steep metal roofs.
  const nave = rect(-63, CROSS0, Y(-HW), Y(HW))
  const choir = rect(CROSS1, CHOIR_X1, Y(-HW), Y(HW))
  const trans = rect(CROSS0, CROSS1, -38.7, 24.9)
  for (const r of [nave, choir]) {
    cbox(stone, r, 0, EAVE, { top: false })
    cbox(trim, grow(r, 0.3, 0.3), EAVE - 1.0, EAVE, { b: 0.3, bottom: true, top: false })
  }
  cbox(stone, trans, 0, EAVE, { top: false })
  cbox(trim, grow(trans, 0.3), EAVE - 1.0, EAVE, { b: 0.3, bottom: true, top: false })
  gable(roof, stone, grow(nave, 0, 0.3), EAVE, RIDGE, false, [false, false])
  gable(roof, stone, grow(trans, 0.3, 0), EAVE, RIDGE, true)
  // The choir's gable runs into a hipped apse: a half-octagon to x 70.7.
  const apse: XY[] = [0, 1, 2, 3, 4].map((k) => {
    const t = -Math.PI / 2 + (k * Math.PI) / 4
    return [CHOIR_X1 + HW * Math.cos(t), Y(HW * Math.sin(t))] as XY
  })
  {
    const ring: XY[] = [[CROSS1, Y(-HW)], ...apse, [CROSS1, Y(HW)]]
    wallsPoly(stone, ring, 0, EAVE, (a, b) => a[0] === CROSS1 && b[0] === CROSS1)
    const ga = rect(CROSS1, CHOIR_X1, Y(-HW - 0.3), Y(HW + 0.3))
    gable(roof, stone, ga, EAVE, RIDGE, false, [false, false])
    const r = HW + 0.3
    const ap: V3[] = [0, 1, 2, 3, 4].map((k) => { const t = -Math.PI / 2 + (k * Math.PI) / 4; return [CHOIR_X1 + r * Math.cos(t), Y(r * Math.sin(t)), EAVE] as V3 })
    for (let k = 0; k < 4; k++) tf(roof, ap[k], ap[k + 1], [CHOIR_X1, YC, RIDGE], [ap[k][0] + ap[k + 1][0] - 2 * CHOIR_X1, ap[k][1] + ap[k + 1][1] - 2 * YC, 4])
    // The apse's ambulatory chapels sit in the low block round it.
    apse.forEach((q, k) => { if (k > 0 && k < 4) pinnacle(trim, q[0] + (q[0] - CHOIR_X1) * 0.06, q[1] + (q[1] - YC) * 0.06, 0.8, EAVE - 2, EAVE + 1, EAVE + 5, 6) })
  }

  // ---- Buttresses and flying buttresses, one per bay each side.
  const flyer = (x: number, sgn: number, pierY: number, pierTop: number, clerZ: number) => {
    const py = Y(sgn * pierY)
    cbox(stone, rect(x - 1.0, x + 1.0, Math.min(py - sgn * 1.2, py + sgn * 2.4), Math.max(py - sgn * 1.2, py + sgn * 2.4)), 0, pierTop, { b: 0.3, top: trim })
    pinnacle(trim, x, py + sgn * 0.6, 0.85, pierTop, pierTop + 2.5, pierTop + 7.5, 6)
    beam(trim, [x, py - sgn * 1.0, pierTop - 1.6], [x, Y(sgn * (HW + 0.2)), clerZ], 1.1, 1.8)
  }
  const navePiers = [-53.3, -46.4, -39.5, -32.6, -25.7, -18.8, -11.9]
  for (const x of navePiers) for (const s of [-1, 1]) flyer(x, s, s < 0 ? 20.2 : 21.2, D + 26, EAVE - 2.5)
  const choirPiers = [32.6, 39.5, 46.3, 53.1, 59.6]
  for (const x of choirPiers) for (const s of [-1, 1]) flyer(x, s, s < 0 ? 15.6 : 16.5, D + 24, EAVE - 2.5)

  // ---- Windows: aisle lancets and clerestory lancets between the piers.
  const bays = (piers: number[], first: number) => [first, ...piers].slice(0, -1).map((x, i) => (x + [first, ...piers][i + 1]) / 2)
  const naveBays = [...bays(navePiers, -60), (navePiers[navePiers.length - 1] + -5) / 2]
  for (const cx of naveBays) {
    lancet(win, 's', Y(-20.2), cx - 1.4, cx + 1.4, D + 6, D + 15.5)
    lancet(win, 'n', Y(21.2), cx - 1.4, cx + 1.4, D + 6, D + 15.5)
    lancet(win, 's', Y(-HW), cx - 1.5, cx + 1.5, AISLE + 1.6, EAVE - 2)
    lancet(win, 'n', Y(HW), cx - 1.5, cx + 1.5, AISLE + 1.6, EAVE - 2)
  }
  const choirBays = [(CROSS1 + 6 + 32.6) / 2, ...bays(choirPiers.slice(1), 32.6)]
  for (const cx of choirBays) {
    lancet(win, 's', Y(-15.6), cx - 1.3, cx + 1.3, D + 5, D + 13.5)
    lancet(win, 'n', Y(16.5), cx - 1.3, cx + 1.3, D + 5, D + 13.5)
    lancet(win, 's', Y(-HW), cx - 1.4, cx + 1.4, CAISLE + 2.5, EAVE - 2)
    lancet(win, 'n', Y(HW), cx - 1.4, cx + 1.4, CAISLE + 2.5, EAVE - 2)
  }
  // The apse's tall east windows, one per face.
  for (let k = 0; k < 4; k++) {
    const a = apse[k], b = apse[k + 1]
    const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const t: XY = [(b[0] - a[0]) / Math.hypot(b[0] - a[0], b[1] - a[1]), (b[1] - a[1]) / Math.hypot(b[0] - a[0], b[1] - a[1])]
    const nrm: V3 = [t[1], -t[0], 0]
    const P = (u: number, z: number): V3 => [m[0] + t[0] * u + nrm[0] * 0.05, m[1] + t[1] * u + nrm[1] * 0.05, z]
    const w = 1.3, z0 = PODIUM + 2, z1 = EAVE - 2, h = w * 2 * Math.sqrt(3) / 2
    qf(win, P(-w, z0), P(w, z0), P(w, z1 - h), P(-w, z1 - h), nrm)
    tf(win, P(-w, z1 - h), P(w, z1 - h), P(0, z1), nrm)
  }

  // ---- Transept fronts: gable, rose, flanking turrets, portal.
  for (const [side, at] of [['n', 24.9], ['s', -38.7]] as Array<[Side, number]>) {
    roundWin(win, side, at + (side === 'n' ? 0.01 : -0.01), (CROSS0 + CROSS1) / 2, D + 23, 4.2, 14, 0.05)
    lancet(win, side, at, 7.4, 9.6, D + 12.5, D + 17.5)
    lancet(win, side, at, 12.1, 14.3, D + 12.5, D + 17.5)
    for (const x of [CROSS0, CROSS1]) {
      const y = at + (side === 'n' ? 0.6 : -0.6)
      ngonPrism(stone, x, y, 1.9, 8, 0, D + 42, { top: false })
      pinnacle(trim, x, y, 1.6, D + 42, D + 44, D + 49, 8)
    }
  }
  // South portal under the rose (the north one sits in the porch).
  lancet(door, 's', -45.2, 8.6, 13.0, D, D + 7.5)

  // ---- West front: the towers' block, gallery, rose and portals.
  const WX0 = -77.0, WX1 = -61.0
  const front = rect(WX0, WX1, Y(-19.4), Y(19.4))
  cbox(stone, front, 0, D + 34, { b: 0.4, top: roof })
  cbox(trim, grow(rect(WX0, WX1, Y(-6.6), Y(6.6)), 0.25, 0), D + 32.5, D + 34, { b: 0.3, bottom: true, top: false })
  // The west gable rises behind the gallery and carries the cross.
  tf(stone, [WX0 + 1.5, Y(-6), D + 34], [WX0 + 1.5, Y(6), D + 34], [WX0 + 1.5, YC, D + 39.5], [-1, 0, 0])
  // Rose window inside its great arch, and the gallery's arcade above.
  lancet(shade, 'w', WX0, Y(-5.6), Y(5.6), D + 12, D + 29.5, 0.03, 4)
  roundWin(win, 'w', WX0 - 0.01, YC, D + 22.5, 3.9, 14, 0.06)
  for (const c of [-5, -3, -1, 1, 3, 5]) lancet(win, 'w', WX0, Y(c - 0.7), Y(c + 0.7), D + 30, D + 33, 0.06)
  // Three portals: the central one tallest.
  lancet(door, 'w', WX0, Y(-2.6), Y(2.6), D, D + 10)
  for (const c of [-12.8, 12.8]) {
    lancet(door, 'w', WX0, Y(c - 1.9), Y(c + 1.9), D, D + 8.5)
    // Two tall blind arches over each side portal, deep enough to read dark.
    for (const k of [-1, 1]) lancet(shade, 'w', WX0, Y(c + k * 2.3 - 1.7), Y(c + k * 2.3 + 1.7), D + 15, D + 29.5, 0.03)
  }
  for (const [side, at] of [['s', Y(-19.4)], ['n', Y(19.4)]] as Array<[Side, number]>) for (const k of [-1, 1]) lancet(shade, side, at, -70.4 + k * 2.6 - 1.7, -70.4 + k * 2.6 + 1.7, D + 15, D + 29.5, 0.03)
  // Buttress strips between portals and towers, full height of the block.
  for (const c of [-19.4, -6.2, 6.2, 19.4]) {
    const sgn = Math.sign(c), y0 = Y(c) - (sgn > 0 ? 1.4 : 0), y1 = Y(c) + (sgn < 0 ? 1.4 : 0)
    cbox(stone, rect(WX0 - 1.0, WX0 + 1.2, Math.min(y0, y1 - 0.01), Math.max(y1, y0 + 0.01)), 0, D + 36, { b: 0.35, top: trim })
  }

  // The towers of St Peter and St Paul, square, with corner pinnacles.
  const TP = D + 60.5, TT = D + 71.6
  for (const c of [-12.8, 12.8]) {
    const ty = Y(c), h = 6.6
    const r = rect(WX0 + 0.6, WX0 + 0.6 + 2 * h, ty - h, ty + h)
    cbox(stone, r, D + 33, TP, { c: 0.8, top: roof })
    cbox(trim, grow(r, 0.3), TP - 1.3, TP, { b: 0.3, bottom: true, top: false })
    const cxm = (r.x0 + r.x1) / 2
    // Belfry: two tall lancets per face.
    for (const k of [-1, 1]) {
      lancet(win, 'w', r.x0, ty + k * 2.4 - 1.2, ty + k * 2.4 + 1.2, D + 43.5, D + 56)
      lancet(win, 'e', r.x1, ty + k * 2.4 - 1.2, ty + k * 2.4 + 1.2, D + 43.5, D + 56)
      lancet(win, 'n', r.y1, cxm + k * 2.4 - 1.2, cxm + k * 2.4 + 1.2, D + 43.5, D + 56)
      lancet(win, 's', r.y0, cxm + k * 2.4 - 1.2, cxm + k * 2.4 + 1.2, D + 43.5, D + 56)
    }
    // Corner pinnacles (big octagonal turrets) and one in the middle of each face.
    for (const [x, y] of [[r.x0, r.y0], [r.x1, r.y0], [r.x1, r.y1], [r.x0, r.y1]]) {
      ngonPrism(stone, x, y, 1.75, 8, D + 33, TP + 2.5, { top: false })
      pinnacle(trim, x, y, 1.55, TP + 2.5, TP + 4.5, TT, 8)
    }
    for (const [x, y] of [[cxm, r.y0], [cxm, r.y1], [r.x0, ty], [r.x1, ty]]) pinnacle(trim, x, y, 0.95, TP - 1, TP + 2, TT - 2.5, 6)
  }

  // ---- The Gloria in Excelsis tower over the crossing.
  {
    const cx = (CROSS0 + CROSS1) / 2, H = 8.6
    const r = rect(cx - H, cx + H, YC - H, YC + H)
    const TOP = 78.0, TIP = 94.8
    cbox(stone, r, EAVE - 2, TOP, { c: 1.0, top: roof })
    cbox(trim, grow(r, 0.35), TOP - 1.6, TOP, { b: 0.35, bottom: true, top: false })
    // A string course between the two tiers of lancets.
    cbox(trim, grow(r, 0.15), 57.5, 58.3, { c: 1.0, bottom: true, top: true })
    for (const k of [-1, 0, 1]) {
      const a = k * 4.4
      for (const [z0, z1, w] of [[48.6, 55.6, 1.3], [62.5, 74.6, 1.4]]) {
        lancet(win, 'w', r.x0, YC + a - w, YC + a + w, z0, z1)
        lancet(win, 'e', r.x1, YC + a - w, YC + a + w, z0, z1)
        lancet(win, 's', r.y0, cx + a - w, cx + a + w, z0, z1)
        lancet(win, 'n', r.y1, cx + a - w, cx + a + w, z0, z1)
      }
    }
    // Corner buttress-turrets running up to the big pinnacles.
    for (const [x, y] of [[r.x0, r.y0], [r.x1, r.y0], [r.x1, r.y1], [r.x0, r.y1]]) {
      ngonPrism(stone, x, y, 2.0, 8, EAVE, TOP + 3.5, { top: false })
      pinnacle(trim, x, y, 1.8, TOP + 3.5, TOP + 5.5, TIP, 8)
    }
    for (const k of [-1, 1]) {
      const a = k * 2.9
      for (const [x, y] of [[cx + a, r.y0], [cx + a, r.y1], [r.x0, YC + a], [r.x1, YC + a]]) pinnacle(trim, x, y, 0.85, TOP - 0.5, TOP + 2.5, TOP + 10, 6)
    }
  }

  return [
    { part: stone, material: PALETTE.stone },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
    // The west front's great arch is a deep recess; a shade of the stone
    // stands in for its shadow, as on the Capitol's portico.
    { part: shade, material: finish('cathedral-recess', 0xcdc2b1) },
  ]
}

if (import.meta.main) {
  await save('dc-national-cathedral', 'Washington National Cathedral', build(), {
    source: 'generators/dc-national-cathedral.ts',
  }, 6500)
}
