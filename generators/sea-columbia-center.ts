/**
 * Columbia Center (1985, Chester Lindsey Architects), Seattle — original
 * procedural geometry, CC0-1.0.
 * bun generators/sea-columbia-center.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the OSM
 * outline's centroid) on the lowest ground under the footprint, the corner
 * of 4th Avenue and Columbia Street (34.75 m NAVD88). Placed at bearing 0:
 * the plan has no single axis, so it is drawn straight from OSM's local
 * coordinates.
 *
 * Form: three dark-glass towers of 43, 61 and 76 storeys locked together.
 * The plan alternates three concave curved faces (west, south-east,
 * north-east) with three flat faces (north-north-west, south-south-west,
 * east), and each flat face is split by a notch where one tower meets the
 * next. The tallest tower is the western one; the 61-storey tower wraps its
 * south-south-west face and the 43-storey tower wraps the north-east, so the
 * building steps down in a spiral. The concave faces read as horizontal
 * bands (pale spandrels between dark glass); the flat faces as a square
 * grid. A terraced granite podium fills the block, at grade on 5th Avenue
 * and a storey or so above 4th Avenue.
 *
 * Sources
 * - OSM: outline way/107124288; tower parts way/418132525 (west, 76 floors),
 *   way/418132520 (south-east, 61 floors), way/331293871 (north-east, 43
 *   floors) and the roof steps way/418132517, way/418132515. Their plans are
 *   used as they are: they agree with the lidar edges to about a metre.
 * - Lidar (measured): USGS 3DEP WA_KingCo_1_2021 surface model, heights above
 *   the lowest ground under the footprint: west tower edge 282 m with a roof
 *   step inset ~4 m to 286 m; south-east tower 225 m, step to 229 m;
 *   north-east tower 162 m. Podium deck ~17 m above the 4th Avenue corner
 *   (flush with 5th Avenue), a raised west wing ~26 m, an open stepped plaza
 *   at the south corner (left as ground).
 * - Published: 284 m to the roof, 76 storeys, setbacks at floors 43 and 61
 *   (Wikipedia, "Columbia Center").
 * - Photos (Wikimedia Commons): see the batch report; colours are from them.
 * Estimated: the podium's terrace outlines (traced from the lidar at 1 m),
 * the storey grouping of the window panels (four floors of 3.74 m).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'

export type XY = [number, number]

// ---------------------------------------------------------------- helpers
// Shared by the sea- downtown towers (F5, Municipal Tower, Smith Tower).

export const area2 = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
/** Counter-clockwise from above, without a repeated closing point. */
export function ccw(r: XY[]): XY[] {
  let pts = r.slice()
  const a = pts[0], z = pts[pts.length - 1]
  if (Math.hypot(a[0] - z[0], a[1] - z[1]) < 1e-6) pts.pop()
  // drop repeated points
  pts = pts.filter((p, i) => { const q = pts[(i + 1) % pts.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.05 })
  return area2(pts) < 0 ? pts.reverse() : pts
}
export function inside(p: XY, r: XY[]) {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j]
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < xi + ((p[1] - yi) * (xj - xi)) / (yj - yi)) c = !c
  }
  return c
}
const nrm2 = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
/** Outward normal of a counter-clockwise edge. */
export const outward = (a: XY, b: XY): XY => nrm2([b[1] - a[1], a[0] - b[0]])
/** Turn at vertex i, degrees; positive is convex for a counter-clockwise ring. */
export function turn(r: XY[], i: number) {
  const p = r[(i - 1 + r.length) % r.length], q = r[i], s = r[(i + 1) % r.length]
  const a = Math.atan2(q[1] - p[1], q[0] - p[0]), b = Math.atan2(s[1] - q[1], s[0] - q[0])
  let d = ((b - a) * 180) / Math.PI
  while (d > 180) d -= 360
  while (d < -180) d += 360
  return d
}

/** Ear-clipping triangulation of a simple counter-clockwise ring. */
export function triangulate(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k - 1 + idx.length) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = r[i0], b = r[i1], c = r[i2]
      if (cr(a, b, c) <= 1e-9) continue
      let ok = true
      for (const j of idx) {
        if (j === i0 || j === i1 || j === i2) continue
        const p = r[j]
        if (cr(a, b, p) >= -1e-9 && cr(b, c, p) >= -1e-9 && cr(c, a, p) >= -1e-9) { ok = false; break }
      }
      if (!ok) continue
      out.push([i0, i1, i2])
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
export function capRing(part: Part, r: XY[], z: number, up = true) {
  for (const [a, b, c] of triangulate(r)) {
    const A: V3 = [r[a][0], r[a][1], z], B: V3 = [r[b][0], r[b][1], z], C: V3 = [r[c][0], r[c][1], z]
    if (up) part.tri(A, B, C)
    else part.tri(A, C, B)
  }
}

/** Cut every convex corner sharper than `minTurn` with a chamfer of `c`. */
export function chamfer(r: XY[], c: number, minTurn = 35): XY[] {
  const out: XY[] = []
  r.forEach((q, i) => {
    const t = turn(r, i)
    if (t < minTurn) { out.push(q); return }
    const p = r[(i - 1 + r.length) % r.length], s = r[(i + 1) % r.length]
    const lp = Math.hypot(p[0] - q[0], p[1] - q[1]), ls = Math.hypot(s[0] - q[0], s[1] - q[1])
    const k1 = Math.min(c, lp / 3), k2 = Math.min(c, ls / 3)
    out.push([q[0] + ((p[0] - q[0]) / lp) * k1, q[1] + ((p[1] - q[1]) / lp) * k1])
    out.push([q[0] + ((s[0] - q[0]) / ls) * k2, q[1] + ((s[1] - q[1]) / ls) * k2])
  })
  return out
}

/** A vertex normal: the mean of its two edges' where the ring turns gently, else undefined. */
export function vertexNormal(r: XY[], i: number, smooth = 35): XY | undefined {
  if (Math.abs(turn(r, i)) >= smooth) return undefined
  const p = r[(i - 1 + r.length) % r.length], q = r[i], s = r[(i + 1) % r.length]
  const a = outward(p, q), b = outward(q, s)
  return nrm2([a[0] + b[0], a[1] + b[1]])
}

/** A wall quad over edge i of ring r, smooth-shaded across gentle turns. */
export function wallEdge(part: Part, r: XY[], i: number, z0: number, z1: number, smooth = 35) {
  const a = r[i], b = r[(i + 1) % r.length], n = outward(a, b)
  const na = vertexNormal(r, i, smooth) ?? n, nb = vertexNormal(r, (i + 1) % r.length, smooth) ?? n
  const A0: V3 = [a[0], a[1], z0], B0: V3 = [b[0], b[1], z0], B1: V3 = [b[0], b[1], z1], A1: V3 = [a[0], a[1], z1]
  const N = (v: XY): V3 => [v[0], v[1], 0]
  part.tri(A0, B0, B1, undefined, undefined, undefined, [N(na), N(nb), N(nb)])
  part.tri(A0, B1, A1, undefined, undefined, undefined, [N(na), N(nb), N(na)])
}

/**
 * A stack of prisms from a shared base. Each edge's wall starts where the
 * neighbouring prism (the one just outside that edge) ends, so faces hidden
 * inside a taller neighbour are not drawn.
 */
export type Prism = { ring: XY[]; z1: number; z0?: number; wall: Part; roof: Part; kind: string }
export function coverAt(prisms: Prism[], p: XY, self: Prism) {
  // Climb the neighbours stacked outside this point: one covers the wall
  // only from its own bottom, so a cornice hung higher up hides nothing below.
  let h = self.z0 ?? 0, moved = true
  while (moved) {
    moved = false
    for (const q of prisms)
      if (q !== self && (q.z0 ?? 0) <= h + 0.01 && q.z1 > h && inside(p, q.ring)) { h = q.z1; moved = true }
  }
  return h
}
export function edgeBase(prisms: Prism[], P: Prism, i: number) {
  const r = P.ring, a = r[i], b = r[(i + 1) % r.length], n = outward(a, b)
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  // the highest neighbour at three points along the edge, so an edge that
  // only partly meets a neighbour is still drawn where it is exposed
  let h = Infinity
  for (const t of [0.2, 0.5, 0.8]) {
    const m: XY = [a[0] + (b[0] - a[0]) * t + n[0] * 0.6, a[1] + (b[1] - a[1]) * t + n[1] * 0.6]
    h = Math.min(h, coverAt(prisms, m, P))
  }
  if (L < 0.01) return P.z1
  return Math.max(P.z0 ?? 0, h)
}

/**
 * Window panels over edge i of ring r. Groups of storeys, counted from the
 * ground so they line up across faces; `bays` > 0 splits a flat face with
 * piers, 0 makes a continuous band that runs on into the next edge across
 * gentle turns (a curved face).
 */
export type Grid = { group: number; spandrel: number; proud?: number; pier?: number; bayW?: number; head?: number; foot?: number; inset?: number }
export function edgePanels(part: Part, r: XY[], i: number, z0: number, z1: number, g: Grid, band: boolean) {
  const proud = g.proud ?? 0.05, pier = g.pier ?? 1.2, bayW = g.bayW ?? 6, inset = g.inset ?? 0.8
  const j = (i + 1) % r.length, a = r[i], b = r[j], n = outward(a, b)
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const lo0 = z0 + (g.foot ?? 1), hi0 = z1 - (g.head ?? 2)
  const runs: [XY, XY, XY, XY][] = [] // start, end, start normal, end normal
  if (band) {
    const na = vertexNormal(r, i), nb = vertexNormal(r, j)
    const s0 = na ? 0 : inset, s1 = na === undefined && nb === undefined ? inset : nb ? 0 : inset
    if (L - s0 - s1 < 1) return
    const A: XY = [a[0] + t[0] * s0, a[1] + t[1] * s0], B: XY = [b[0] - t[0] * s1, b[1] - t[1] * s1]
    runs.push([A, B, na ?? n, nb ?? n])
  } else {
    if (L < 2 * inset + 1.5) return
    const bays = Math.max(1, Math.round((L - 2 * inset) / bayW)), w = (L - 2 * inset) / bays
    for (let k = 0; k < bays; k++) {
      const s = inset + k * w + (k ? pier / 2 : 0), e = inset + (k + 1) * w - (k < bays - 1 ? pier / 2 : 0)
      runs.push([[a[0] + t[0] * s, a[1] + t[1] * s], [a[0] + t[0] * e, a[1] + t[1] * e], n, n])
    }
  }
  for (let k = Math.floor(lo0 / g.group); k * g.group < hi0; k++) {
    const lo = Math.max(k * g.group + g.spandrel / 2, lo0), hi = Math.min((k + 1) * g.group - g.spandrel / 2, hi0)
    if (hi - lo < 2.5) continue
    for (const [A, B, nA, nB] of runs) {
      // offset along the vertex normal, scaled so the panel stays `proud` off both facets
      const off = (p: XY, m: XY): XY => { const c = Math.max(0.5, m[0] * n[0] + m[1] * n[1]); return [p[0] + (m[0] * proud) / c, p[1] + (m[1] * proud) / c] }
      const P = off(A, nA), Q = off(B, nB)
      const N = (v: XY): V3 => [v[0], v[1], 0]
      part.tri([P[0], P[1], lo], [Q[0], Q[1], lo], [Q[0], Q[1], hi], undefined, undefined, undefined, [N(nA), N(nB), N(nB)])
      part.tri([P[0], P[1], lo], [Q[0], Q[1], hi], [P[0], P[1], hi], undefined, undefined, undefined, [N(nA), N(nB), N(nA)])
    }
  }
}

/** Local metres of lon/lat about an anchor (equirectangular; fine over a block). */
export function localizer(lng0: number, lat0: number) {
  const kx = 111320 * Math.cos((lat0 * Math.PI) / 180), ky = 110574
  return (p: [number, number]): XY => [(p[0] - lng0) * kx, (p[1] - lat0) * ky]
}

export function finishGlb(id: string, name: string, parts: { part: Part; material: Swatch }[], extras: Record<string, unknown>, maxTri = 5000) {
  const live = parts.filter((p) => p.part.triangles)
  const triangles = live.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > maxTri) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(name, live, { license: 'CC0-1.0', elevation: 0, frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground', ...extras })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  return { glb, triangles }
}

// ---------------------------------------------------------------- the model

function build() {
  // Parts in local metres, as fetched, about a point 1.8 m off the outline's
  // area centroid; SHIFT moves them onto the anchor, the true centroid
  // (-122.3307466, 47.6045019).
  const SHIFT: XY = [1.56, -0.9]
  const S = (r: XY[]): XY[] => r.map(([x, y]) => [x + SHIFT[0], y + SHIFT[1]])
  const WEST: XY[] = S([[-20.3, -10.6], [-13.5, -14.2], [1.9, -22.2], [3.2, -19.7], [4.3, -17.7], [6.4, -12.7], [7.9, -7.5], [8.9, -2.2], [9.3, 3.1], [9.1, 8.5], [9.0, 9.1], [8.7, 11.4], [8.3, 13.9], [7.0, 19.1], [5.1, 24.1], [2.3, 28.8], [-0.9, 34.0], [-23.0, 20.4], [-20.2, 16.0], [-18.3, 13.0], [-17.0, 9.7], [-16.2, 6.3], [-15.9, 2.7], [-16.3, -0.8], [-17.2, -4.2], [-18.7, -7.4]])
  const WEST_TOP: XY[] = S([[0.6, -18.6], [2.4, -14.8], [3.9, -10.8], [5.0, -6.7], [5.7, -2.6], [6.0, 1.6], [5.9, 5.8], [5.5, 10.0], [4.6, 14.1], [3.4, 18.2], [1.8, 22.1], [-0.1, 25.8], [-2.8, 23.6], [-19.0, 19.5], [-16.8, 16.3], [-15.1, 12.8], [-13.9, 9.1], [-13.3, 5.3], [-13.2, 1.4], [-13.7, -2.5], [-14.7, -6.2], [-16.3, -9.8]])
  const SOUTHEAST: XY[] = S([[9.1, 8.5], [9.3, 3.1], [8.9, -2.2], [7.9, -7.5], [6.4, -12.7], [4.3, -17.7], [1.9, -22.2], [-13.5, -14.2], [-15.5, -17.8], [3.7, -27.6], [6.2, -23.1], [7.9, -20.0], [10.0, -17.2], [12.7, -14.8], [15.7, -12.8], [18.9, -11.4], [22.4, -10.5], [25.9, -10.2], [29.5, -10.0], [29.2, -1.3], [28.7, 14.8], [23.6, 14.8], [18.2, 14.1], [12.9, 12.8], [8.7, 11.4]])
  const SE_TOP: XY[] = S([[5.4, -16.6], [8.0, -13.7], [11.1, -11.3], [14.5, -9.3], [18.1, -7.8], [21.9, -6.9], [25.8, -6.5], [25.2, 12.5], [20.9, 12.2], [16.7, 11.5], [12.6, 10.4], [9.0, 9.1], [9.1, 8.5], [9.3, 3.1], [8.9, -2.2], [7.9, -7.5], [6.4, -12.7], [4.3, -17.7]])
  const NORTHEAST: XY[] = S([[29.2, -1.3], [33.1, -1.2], [32.6, 19.0], [27.2, 18.8], [23.9, 18.7], [20.6, 19.1], [17.5, 20.0], [14.5, 21.4], [11.8, 23.2], [9.4, 25.4], [7.3, 27.9], [5.6, 30.7], [2.3, 28.8], [5.1, 24.1], [7.0, 19.1], [8.3, 13.9], [8.7, 11.4], [12.9, 12.8], [18.2, 14.1], [23.6, 14.8], [28.7, 14.8]])
  // The block outline, and the podium's raised west wing traced from the lidar.
  const OUTLINE: XY[] = S([[5.6, 30.7], [7.3, 27.9], [9.4, 25.4], [11.8, 23.2], [14.5, 21.4], [17.5, 20.0], [20.6, 19.1], [23.9, 18.7], [27.2, 18.8], [32.6, 19.0], [35.9, 18.3], [51.2, -6.1], [10.0, -31.75], [-21.5, -29.0], [-50.0, 16.9], [-26.7, 31.4], [-3.8, 45.7]])
  const WING: XY[] = S([[-50.0, 16.9], [-32.0, -12.0], [-20.3, -10.6], [-18.7, -7.4], [-17.2, -4.2], [-16.3, -0.8], [-15.9, 2.7], [-16.2, 6.3], [-17.0, 9.7], [-18.3, 13.0], [-20.2, 16.0], [-23.0, 20.4], [-0.9, 34.0], [-10.0, 41.3], [-26.7, 31.4]])

  const glass = new Part(), frame = new Part(), spandrel = new Part(), roof = new Part(), granite = new Part()
  const H = { west: 282, westTop: 286, se: 225, seTop: 229, ne: 162, podium: 17, wing: 26 }
  const CH = 0.5
  const prisms: Prism[] = [
    { ring: ccw(OUTLINE), z1: H.podium, wall: granite, roof: granite, kind: 'podium' },
    { ring: ccw(WING), z1: H.wing, wall: granite, roof: granite, kind: 'podium' },
    { ring: chamfer(ccw(WEST), CH), z1: H.west, wall: frame, roof: roof, kind: 'tower' },
    { ring: chamfer(ccw(SOUTHEAST), CH), z1: H.se, wall: frame, roof: roof, kind: 'tower' },
    { ring: chamfer(ccw(NORTHEAST), CH), z1: H.ne, wall: frame, roof: roof, kind: 'tower' },
    { ring: chamfer(ccw(WEST_TOP), CH), z1: H.westTop, z0: H.west, wall: frame, roof: roof, kind: 'step' },
    { ring: chamfer(ccw(SE_TOP), CH), z1: H.seTop, z0: H.se, wall: frame, roof: roof, kind: 'step' },
  ]
  // A storey is 284 m / 76 = 3.74 m; panels span four storeys, so the
  // concave faces' bands stay broad rather than pinstriped.
  const grid: Grid = { group: 4 * 3.74, spandrel: 2.6, pier: 1.3, bayW: 6.5, head: 2.2, foot: 1 }
  for (const P of prisms) {
    const r = P.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = edgeBase(prisms, P, i)
      if (z0 >= P.z1 - 0.01) continue
      const curved = vertexNormal(r, i) !== undefined || vertexNormal(r, (i + 1) % r.length) !== undefined
      if (P.kind !== 'tower') { wallEdge(P.wall, r, i, z0, P.z1); continue }
      // curved faces carry the pale spandrel bands, flat faces the dark grid
      wallEdge(curved ? spandrel : frame, r, i, z0, P.z1)
      edgePanels(glass, r, i, z0, P.z1, grid, curved)
    }
    capRing(P.roof, r, P.z1)
  }
  return finishGlb('sea-columbia-center', 'Columbia Center', [
    { part: frame, material: finish('columbia-black', 0x4a4f57, 0.5) },
    { part: glass, material: { ...PALETTE.window, color: 0x4b5767 } },
    { part: spandrel, material: finish('columbia-spandrel', 0x60676f, 0.5) },
    { part: roof, material: PALETTE.roof },
    { part: granite, material: finish('columbia-granite', 0xcdb8aa) },
  ], { bearing: 0, height: H.westTop, replaces: ['way/107124288', 'way/418132525', 'way/418132517', 'way/418132520', 'way/418132515', 'way/331293871'] })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/sea-columbia-center.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
