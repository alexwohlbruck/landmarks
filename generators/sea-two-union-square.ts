/**
 * Two Union Square (1989, NBBJ), Seattle — original procedural geometry, CC0-1.0.
 * bun generators/sea-two-union-square.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the OSM
 * outline's area centroid, -122.3320767, 47.6104347) on the lowest ground
 * under the footprint (48.5 m NAVD88, on the north-west side; the east side
 * is about 3.5 m higher). Built in the street grid's frame: the model's x
 * axis runs along Union Street (ENE), y up the avenues (NNW); placement
 * bearing 328.8°.
 *
 * Form: a glass core with a convex curved east end, wrapped on three sides
 * by lower slabs of white bands and dark ribbon windows that bow outward:
 * north and south slabs to 200 m, a west one to 188 m. Where a slab stops
 * short of the core's corner the glass shows full height, the notched
 * corners. The core's glass rises to 211 m; on top, a white drum with a
 * round west end (217 m) and a white box (to 226 m) whose east face follows
 * the curve. The curved east face is banded for its lowest dozen storeys.
 * The glass carries a coarse copper grid; drawn as a faint band every eight
 * storeys.
 *
 * Sources
 * - OSM: outline way/331281880; parts way/491467380 (the core),
 *   way/491467379 and way/491467381 (south and north slabs),
 *   way/494784395 (west slab), way/456870610 (drum), way/456870609 (box).
 *   Plans from OSM, smoothed into arcs through its points.
 * - Lidar (measured, USGS 3DEP WA_KingCo_1_2021, above 48.5 m NAVD88): core
 *   roof 211 m; north and south slabs 199-200 m; west slab 188-189 m; drum
 *   215-218 m; box 221.5 m on its west side rising to 224-226 m on the east.
 *   OSM's 214 m slabs and 202 m west slab are 12-14 m high; lidar used.
 * - Published: 226 m (741 ft), 56 storeys (Wikipedia, "Two Union Square").
 * - Photos (Wikimedia Commons): Cumulus Clouds 2008 x2 (from the east: curved
 *   glass face, banded foot, white south slab), Atomic Taco 2009 (from
 *   Columbia Center: drum, box, slab tops, notched corner), Joe Mabel (from
 *   the north-west, overcast), Atomic Taco "The two tallest" (crown from the
 *   west).
 * Estimated: storey grouping of the bands (three storeys per ribbon), the
 *   height of the banded foot on the east face (42 m), the box's plan inside
 *   the curve, colours pulled to the palette.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant, type Swatch } from './palette'

// ---------------------------------------------------------------- helpers
// Copied from sea-rainier-square-tower.ts (another builder's file) and
// extended; shared by my sea-westin-towers and sea-amazon-spheres.

export type XY = [number, number]
export const area2 = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
/** Counter-clockwise from above, without a repeated closing point. */
export function ccw(r: XY[]): XY[] {
  let pts = r.slice()
  const a = pts[0], z = pts[pts.length - 1]
  if (Math.hypot(a[0] - z[0], a[1] - z[1]) < 1e-6) pts.pop()
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
export function capRing(part: Part, r: XY[], z: number | ((p: XY) => number), up = true) {
  const Z = typeof z === 'number' ? () => z : z
  for (const [a, b, c] of triangulate(r)) {
    const A: V3 = [r[a][0], r[a][1], Z(r[a])], B: V3 = [r[b][0], r[b][1], Z(r[b])], C: V3 = [r[c][0], r[c][1], Z(r[c])]
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
/** The same wall pushed `d` off the face along the (smooth) vertex normals: bands standing proud. */
export function wallEdgeOff(part: Part, r: XY[], i: number, z0: number, z1: number, d: number, inset = 0) {
  const j = (i + 1) % r.length, a = r[i], b = r[j], n = outward(a, b)
  const na = vertexNormal(r, i) ?? n, nb = vertexNormal(r, j) ?? n
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  // pull the ends in at sharp corners so a band never pokes past an edge
  const s0 = vertexNormal(r, i) ? 0 : inset, s1 = vertexNormal(r, j) ? 0 : inset
  const off = (p: XY, m: XY, s: number): XY => { const c = Math.max(0.5, m[0] * n[0] + m[1] * n[1]); return [p[0] + t[0] * s + (m[0] * d) / c, p[1] + t[1] * s + (m[1] * d) / c] }
  const P = off(a, na, s0), Q = off(b, nb, -s1)
  const N = (v: XY): V3 => [v[0], v[1], 0]
  part.tri([P[0], P[1], z0], [Q[0], Q[1], z0], [Q[0], Q[1], z1], undefined, undefined, undefined, [N(na), N(nb), N(nb)])
  part.tri([P[0], P[1], z0], [Q[0], Q[1], z1], [P[0], P[1], z1], undefined, undefined, undefined, [N(na), N(nb), N(na)])
}
/** The walls between two rings with the same corners, flat-shaded. */
export function loftRings(part: Part, bot: XY[], top: XY[], z0: number, z1: number) {
  for (let i = 0; i < bot.length; i++) {
    const j = (i + 1) % bot.length
    part.quad([bot[i][0], bot[i][1], z0], [bot[j][0], bot[j][1], z0], [top[j][0], top[j][1], z1], [top[i][0], top[i][1], z1])
  }
}
/**
 * A stack of prisms from a shared base. Each edge's wall starts where the
 * neighbouring prism (the one just outside that edge) ends, so faces hidden
 * inside a taller neighbour are not drawn.
 */
export type Prism = { ring: XY[]; z1: number; z0?: number; kind: string }
export function coverAt(prisms: Prism[], p: XY, self: Prism) {
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
  if (L < 0.01) return P.z1
  let h = Infinity
  for (const t of [0.2, 0.5, 0.8]) {
    const m: XY = [a[0] + (b[0] - a[0]) * t + n[0] * 0.6, a[1] + (b[1] - a[1]) * t + n[1] * 0.6]
    h = Math.min(h, coverAt(prisms, m, P))
  }
  return Math.max(P.z0 ?? 0, h)
}
/** n + 1 points on the circle through a, m, b, from a to b by way of m. */
export function arc3(a: XY, m: XY, b: XY, n: number): XY[] {
  const d = 2 * (a[0] * (m[1] - b[1]) + m[0] * (b[1] - a[1]) + b[0] * (a[1] - m[1]))
  const s = (p: XY) => p[0] * p[0] + p[1] * p[1]
  const cx = (s(a) * (m[1] - b[1]) + s(m) * (b[1] - a[1]) + s(b) * (a[1] - m[1])) / d
  const cy = (s(a) * (b[0] - m[0]) + s(m) * (a[0] - b[0]) + s(b) * (m[0] - a[0])) / d
  const R = Math.hypot(a[0] - cx, a[1] - cy)
  const ang = (p: XY) => Math.atan2(p[1] - cy, p[0] - cx)
  let t0 = ang(a), t1 = ang(b), tm = ang(m)
  // go the way that passes m
  const norm = (x: number) => ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
  const ccwPass = norm(tm - t0) < norm(t1 - t0)
  const sweep = ccwPass ? norm(t1 - t0) : -norm(t0 - t1)
  return Array.from({ length: n + 1 }, (_, k) => {
    const t = t0 + (sweep * k) / n
    return [cx + R * Math.cos(t), cy + R * Math.sin(t)] as XY
  })
}
/** Local metres of lon/lat about an anchor, turned into a frame at `bearing` (degrees). */
export function framer(lng0: number, lat0: number, bearing: number) {
  const kx = 111320 * Math.cos((lat0 * Math.PI) / 180), ky = 110574, b = (bearing * Math.PI) / 180
  return (p: [number, number]): XY => {
    const E = (p[0] - lng0) * kx, N = (p[1] - lat0) * ky
    return [E * Math.cos(b) - N * Math.sin(b), E * Math.sin(b) + N * Math.cos(b)]
  }
}
export function finishGlb(name: string, parts: { part: Part; material: Swatch }[], extras: Record<string, unknown>, maxTri = 5000) {
  const live = parts.filter((p) => p.part.triangles)
  const triangles = live.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > maxTri) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(name, live, { license: 'CC0-1.0', elevation: 0, frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground', ...extras })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  return { glb, triangles }
}
export async function emit(id: string, built: { glb: Uint8Array; triangles: number }) {
  const out = process.argv[2] ?? new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, built.glb)
  console.log(`${out}: ${built.triangles} triangles, ${built.glb.length} bytes (${(built.glb.length / 1024).toFixed(1)} KiB)`)
}

// ---------------------------------------------------------------- the model

function build() {
  const glass = new Part(), white = new Part(), ribbon = new Part(), roof = new Part(), copper = new Part()
  const H = { foot: 6, slab: 200, west: 188.5, core: 211, drum: 217, boxW: 221.5, boxE: 225.5, bandedFoot: 42 }
  const FLOOR = 3.72, GROUP = 3 * FLOOR

  // ---- plans (model frame, from OSM, smoothed)
  const YS = -18.2, YN = 15.0, XW = -25.3
  // the core's curved east end, from its south-east corner round to the north-east one
  const EAST = arc3([16.2, YS], [27.3, -0.9], [29.1, YN], 10)
  const core: XY[] = ccw([[XW, YS], [-19.0, YS], [11.2, YS], ...EAST, [24.0, YN], [-23.0, YN], [XW, YN], [XW, 7.9], [XW, -11.5]])
  // bowed slabs: inner edge on the core, outer face an arc
  const south: XY[] = ccw([[-19.0, YS], ...arc3([-19.0, -21.9], [-4.0, -23.5], [11.2, -21.3], 8), [11.2, YS]])
  const north: XY[] = ccw([[24.0, YN], ...arc3([23.8, 19.6], [0.5, 20.6], [-23.0, 17.5], 10), [-23.0, YN]])
  const west: XY[] = ccw([[XW, -11.5], [XW, 7.9], ...arc3([-28.1, 7.9], [-29.2, -1.8], [-27.8, -11.5], 6)])

  const prisms: (Prism & { banded: boolean })[] = [
    { ring: chamfer(core, 0.5), z1: H.core, kind: 'core', banded: false },
    { ring: chamfer(south, 0.5), z1: H.slab, kind: 'slab', banded: true },
    { ring: chamfer(north, 0.5), z1: H.slab, kind: 'slab', banded: true },
    { ring: chamfer(west, 0.5), z1: H.west, kind: 'slab', banded: true },
  ]
  // the east face's arc vertices, for its banded foot
  const onEast = (p: XY) => p[0] > 16 && EAST.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 0.6)

  /** White wall with dark ribbon windows, three storeys per ribbon. */
  const banded = (r: XY[], i: number, z0: number, z1: number) => {
    wallEdge(white, r, i, z0, z1)
    for (let k = 0; ; k++) {
      const lo = Math.max(z0, H.foot + k * GROUP + 2.0), hi = Math.min(z1 - 1.2, H.foot + (k + 1) * GROUP - 2.4)
      if (H.foot + k * GROUP >= z1) break
      if (hi - lo > 2) wallEdgeOff(ribbon, r, i, lo, hi, 0.05, 0.5)
    }
  }
  for (const P of prisms) {
    const r = P.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = edgeBase(prisms, P, i)
      if (z0 >= P.z1 - 0.01) continue
      if (P.banded) { banded(r, i, z0, P.z1); continue }
      const east = onEast(r[i]) && onEast(r[(i + 1) % r.length])
      let g0 = z0
      if (east && z0 < H.bandedFoot) { banded(r, i, z0, H.bandedFoot); g0 = H.bandedFoot }
      wallEdge(glass, r, i, g0, P.z1)
      // the copper grid, as a faint band every eight storeys, and a coping line
      for (let z = H.foot + 8 * FLOOR * 2; z < P.z1 - 4; z += 8 * FLOOR) if (z > g0 + 1) wallEdgeOff(copper, r, i, z, z + 0.7, 0.05)
      wallEdgeOff(copper, r, i, P.z1 - 0.9, P.z1, 0.05)
    }
    capRing(roof, r, P.z1)
  }

  // ---- crown: the drum (round west end) and the box behind it
  const drum: XY[] = chamfer(ccw([[2.0, 9.6], ...arc3([-9.0, 9.6], [-21.1, -2.3], [-9.0, -14.3], 10), [2.0, -14.3]]), 0.4)
  // the box's east face follows the curve, 4.5 m in from the glass
  const boxEast = arc3([13.6, -13.6], [22.7, -1.0], [24.4, 11.6], 8)
  const box: XY[] = chamfer(ccw([[-10.5, -13.6], ...boxEast, [-10.5, 11.6]]), 0.4)
  const crown: Prism[] = [
    { ring: drum, z0: H.core, z1: H.drum, kind: 'drum' },
    { ring: box, z0: H.core, z1: H.boxE, kind: 'box' },
  ]
  const boxTop = (p: XY) => H.boxW + ((H.boxE - H.boxW) * (p[0] + 10.5)) / 35
  for (let i = 0; i < drum.length; i++) {
    const z0 = edgeBase(crown, crown[0], i)
    if (z0 < H.drum - 0.01) wallEdge(white, drum, i, z0, H.drum)
  }
  capRing(roof, drum, H.drum)
  for (let i = 0; i < box.length; i++) {
    const a = box[i], b = box[(i + 1) % box.length], n = outward(a, b)
    const A0: V3 = [a[0], a[1], H.core], B0: V3 = [b[0], b[1], H.core]
    const A1: V3 = [a[0], a[1], boxTop(a)], B1: V3 = [b[0], b[1], boxTop(b)]
    const na = vertexNormal(box, i) ?? n, nb = vertexNormal(box, (i + 1) % box.length) ?? n
    const N = (v: XY): V3 => [v[0], v[1], 0]
    white.tri(A0, B0, B1, undefined, undefined, undefined, [N(na), N(nb), N(nb)])
    white.tri(A0, B1, A1, undefined, undefined, undefined, [N(na), N(nb), N(na)])
  }
  capRing(roof, box, boxTop)

  return finishGlb('Two Union Square', [
    { part: glass, material: windowVariant(2, 0xa3b8bb) },
    { part: ribbon, material: { ...PALETTE.window, color: 0x667b85 } },
    { part: white, material: finish('tus-white', 0xf0ede6) },
    { part: copper, material: finish('tus-copper', 0xc9ab8e) },
    { part: roof, material: { ...PALETTE.roof, color: 0xb7bcbf } },
  ], { bearing: 328.8, height: H.boxE, replaces: REPLACES })
}

const REPLACES = ['way/331281880', 'way/491467380', 'way/491467379', 'way/491467381', 'way/494784395', 'way/456870610', 'way/456870609']

if (import.meta.main) await emit('sea-two-union-square', build())
