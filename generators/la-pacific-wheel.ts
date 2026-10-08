/**
 * Pacific Wheel, Pacific Park, Santa Monica Pier (2008, solar-powered;
 * repainted and relit since) — procedural, CC0-1.0.
 * bun generators/la-pacific-wheel.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the pier deck under
 * the axle. The wheel is built turning in the x–z plane, its axle along y,
 * and placed at bearing 91°, which turns that plane to run north–south
 * (181°/1°) as the OSM outline and the lidar show.
 *
 * What makes it the Pacific Wheel: a white wheel with a slim silver rim on
 * each face and a dense web of white spokes; twenty open octagonal
 * gondolas, alternately red and yellow, each under an octagonal canopy
 * (dark grey underneath and round its edge, pale on top, as the orthophoto
 * shows), hanging between the two faces; the white "Pacific Park" disc on
 * the hub; and the broad white box-section A-frame legs splayed in the
 * wheel's plane. (Those legs, not lattice towers, are what the photos show.)
 *
 * Sources:
 * - Plan: OSM way/742372514 (attraction=big_wheel, building=yes), a 2.4 x
 *   25.3 m outline whose long axis runs 0.8° east of north; its centroid is
 *   the anchor. USGS NAIP orthophoto confirms the plane runs north–south
 *   over the pier.
 * - Heights (LA County 2020 lidar surface model, 1.5 m grid in the wheel's
 *   plane, /tmp/city/la/work/la-pacific-wheel/dsm.json): pier deck 7.5–7.6 m
 *   all round (NAVD88), wheel top 33.1 m, so 25.6 m above the deck; the
 *   rim at axle height reaches 12.0–12.5 m either side of the anchor.
 *   Hence rim radius 12.5 m and axle 13.1 m above the deck.
 * - Published: 85 ft (25.9 m) tall, 20 gondolas of six riders, the first
 *   solar-powered Ferris wheel (Pacific Park; Wikipedia "Pacific Park").
 * - Photos (Wikimedia Commons): "Santa Monica Wheel in Pier" (John Salatas,
 *   CC BY-SA 4.0; from the pier's north side, face on, whole wheel);
 *   "Santa Monica Pier Ferrish Wheel, August 2026" (Alexis Doine, CC0; face
 *   on, legs and hub sign); "Ferris wheel at Santa Monica Pier" (Luis
 *   Ochea, CC BY 4.0; hub sign and legs close up); "Ferris Wheel Profile,
 *   Santa Monica (3668253296)" (Sharon Mollerus, CC BY 2.0; edge on: the
 *   gondolas hang between the two rim faces); "Ferris Wheel - Santa Monica
 *   Pier - panoramio" (tmastro, CC BY-SA 3.0; gondolas and canopies);
 *   "Pacific Park Ferris Wheel. (22009437548)" (Ian D. Keating, CC BY 2.0;
 *   leg from below).
 * - Estimated from photos, scaled by the lidar rim: the depth between the
 *   faces (3.2 m), gondola size (tub 2.3 m across, canopy 2.7 m), the legs'
 *   splay (feet 6.4 m either side of the axle) and section, the hub sign
 *   (3.6 m across).
 * - Simplified: the real wheel has about 40 spokes a face and a truss of
 *   ties between the faces; here 32 bold spokes a face and 20 ties.
 *
 * elevation: 7.5 m. The pier deck stands over the surf; USGS 3DEP gives
 * 0.0 m (sea level) under the whole outline, the lidar surface model 7.5 m
 * on the open deck round the wheel, so the model's y = 0 (the deck) sits
 * 7.5 m above the terrain the map knows.
 *
 * It turns (experimental; see "Animation" in STYLE.md): the wheel is a node
 * at the axle and each gondola a child node at its pivot, turned back by as
 * much as the wheel so it hangs plumb. One turn every 120 s; the real wheel
 * turns about once in two to three minutes, near enough to keep. Frame 0 is
 * the static model. It replaces OSM way/742372514, the wheel's outline.
 */
import { Part, axisAngle, cross, sub, writeGlb, type ChannelSpec, type MaterialSpec, type NodeSpec, type Quat, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

// --- Shared sweep helpers (also used by the other la- coast generators) ------
export const TAU = Math.PI * 2
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
export const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A triangle whose winding follows its normals, whatever order it came in. */
export function tri(p: Part, v: V3[], n: V3[]) {
  const face = cross(sub(v[1], v[0]), sub(v[2], v[0]))
  if (dot(face, add(add(n[0], n[1]), n[2])) >= 0) p.tri(v[0], v[1], v[2], undefined, undefined, undefined, n)
  else p.tri(v[0], v[2], v[1], undefined, undefined, undefined, [n[0], n[2], n[1]])
}
export function fan(p: Part, ring: V3[], n: V3) {
  for (let i = 1; i < ring.length - 1; i++) tri(p, [ring[0], ring[i], ring[i + 1]], [n, n, n])
}
export type Profile = [number, number][]
/** A chamfered rectangle, counter-clockwise: half-widths a (along N), b (along B). */
export const rect = (a: number, b: number, c = 0): Profile => c
  ? [[-a + c, -b], [a - c, -b], [a, -b + c], [a, b - c], [a - c, b], [-a + c, b], [-a, b - c], [-a, -b + c]]
  : [[-a, -b], [a, -b], [a, b], [-a, b]]
export const circle = (r: number, n: number): Profile =>
  Array.from({ length: n }, (_, i) => [r * Math.cos(i / n * TAU), r * Math.sin(i / n * TAU)])

/** Sweep a cross-section along a path; flat across the section, smooth along it. */
export function sweep(p: Part, path: V3[], frames: { N: V3; B: V3 }[], profiles: Profile[], closed = false, caps = false) {
  const m = profiles[0].length
  const at = (i: number, k: number) => {
    const [a, b] = profiles[i][k]
    return add(path[i], add(mul(frames[i].N, a), mul(frames[i].B, b)))
  }
  const normal = (i: number, k: number) => {
    const [a, b] = profiles[i][k], [c, d] = profiles[i][(k + 1) % m]
    return unit(add(mul(frames[i].N, d - b), mul(frames[i].B, -(c - a))))
  }
  const last = closed ? path.length : path.length - 1
  for (let i = 0; i < last; i++) {
    const j = (i + 1) % path.length
    for (let k = 0; k < m; k++) {
      const l = (k + 1) % m
      const ni = normal(i, k), nj = normal(j, k)
      tri(p, [at(i, k), at(i, l), at(j, l)], [ni, ni, nj])
      tri(p, [at(i, k), at(j, l), at(j, k)], [ni, nj, nj])
    }
  }
  if (caps && !closed) {
    const n = path.length - 1
    fan(p, profiles[0].map((_, k) => at(0, k)), unit(sub(path[0], path[1])))
    fan(p, profiles[n].map((_, k) => at(n, k)), unit(sub(path[n], path[n - 1])))
  }
}

/** Frames for a path lying in a plane whose normal is `B`. */
export function inPlane(path: V3[], closed: boolean, B: V3 = [0, 1, 0]) {
  return path.map((_, i) => {
    const prev = path[closed ? (i + path.length - 1) % path.length : Math.max(0, i - 1)]
    const next = path[closed ? (i + 1) % path.length : Math.min(path.length - 1, i + 1)]
    const T = unit(sub(next, prev))
    return { N: unit(cross(T, B)), B }
  })
}

/** A straight member from a to b, tapering from section s0 to s1. */
export function beam(p: Part, a: V3, b: V3, s0: Profile, s1: Profile = s0, side: V3 = [0, 0, 1], caps = true) {
  const T = unit(sub(b, a))
  let N = cross(side, T)
  if (Math.hypot(...N) < 1e-6) N = cross([1, 0, 0], T)
  N = unit(N)
  const B = unit(cross(T, N))
  sweep(p, [a, b], [{ N, B }, { N, B }], [s0, s1], false, caps)
}

/** A vertical prism with chamfer-free faces from a convex/any ring (CCW from above), capped. */
export function prism(p: Part, ring: [number, number][], z0: number, z1: number, top = true, bottom = true) {
  const r0 = ring.map(([x, y]) => [x, y, z0] as V3), r1 = ring.map(([x, y]) => [x, y, z1] as V3)
  p.loft([r0, r1])
  if (top) p.cap(r1, true)
  if (bottom) p.cap(r0, false)
}

/** Sum and print triangles drawn per material, counting shared meshes once per node. */
export function countDrawn(parts: Array<{ part: Part; material: MaterialSpec }>, nodes: NodeSpec[] = []) {
  const drawn = new Map<string, number>()
  for (const { part, material } of [...parts, ...nodes.flatMap((n) => n.parts)])
    drawn.set(material.name, (drawn.get(material.name) ?? 0) + part.triangles)
  console.log([...drawn].map(([name, n]) => `${name}: ${n}`).join('\n'))
  return [...drawn.values()].reduce((a, b) => a + b, 0)
}

// --- Plan helpers: footprints, blocks and wall panels -------------------------
export type XY = [number, number]
export const area2 = (P: XY[]) => P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
/** Counter-clockwise from above, without a closing duplicate. */
export function ccw(P: XY[]): XY[] {
  const Q = P.slice()
  const a = Q[0], b = Q[Q.length - 1]
  if (a[0] === b[0] && a[1] === b[1]) Q.pop()
  return area2(Q) < 0 ? Q.reverse() : Q
}
/** Ear clipping for a simple counter-clockwise polygon. */
export function earcut(P: XY[]): [number, number, number][] {
  const idx = P.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  while (idx.length > 3) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i = idx[(k + idx.length - 1) % idx.length], j = idx[k], l = idx[(k + 1) % idx.length]
      if (cr(P[i], P[j], P[l]) <= 1e-9) continue
      if (idx.some((m) => m !== i && m !== j && m !== l && inside(P[m], P[i], P[j], P[l]))) continue
      out.push([i, j, l]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) { for (let k = 1; k < idx.length - 1; k++) out.push([idx[0], idx[k], idx[k + 1]]); return out }
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}
const n2 = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
/** Move each vertex of a CCW ring inward by `d`, mitred. */
export function offset(P: XY[], d: number): XY[] {
  const n = P.length
  return P.map((p, i) => {
    const a = P[(i + n - 1) % n], b = P[(i + 1) % n]
    const e1 = n2([p[0] - a[0], p[1] - a[1]]), e2 = n2([b[0] - p[0], b[1] - p[1]])
    const m = n2([-e1[1] - e2[1], e1[0] + e2[0]])
    const c = Math.max(0.35, -m[0] * e1[1] + m[1] * e1[0])
    return [p[0] + m[0] * d / c, p[1] + m[1] * d / c] as XY
  })
}
export function capRing(part: Part, R: XY[], z: number, up: boolean) {
  const at = (p: XY): V3 => [p[0], p[1], z]
  for (const [i, j, k] of earcut(R)) up ? part.tri(at(R[i]), at(R[j]), at(R[k])) : part.tri(at(R[k]), at(R[j]), at(R[i]))
}
/**
 * A vertical block over a CCW footprint from z0 to z1, its top edge
 * chamfered by `bevel`, capped (roof on `top`, or `wall` if none given).
 */
export function block(wall: Part, R: XY[], z0: number, z1: number, bevel = 0.4, top?: Part, bottom = false) {
  const ring = (P: XY[], z: number) => P.map(([x, y]) => [x, y, z] as V3)
  const inner = bevel > 0 ? offset(R, bevel) : R
  wall.loft([ring(R, z0), ring(R, z1 - bevel)])
  if (bevel > 0) wall.loft([ring(R, z1 - bevel), ring(inner, z1)])
  capRing(top ?? wall, inner, z1, true)
  if (bottom) capRing(wall, R, z0, false)
}
/**
 * A flat panel on the outside of wall segment a→b (a CCW footprint edge, so
 * outward is to its right), from along-edge s0 to s1 metres and z0 to z1,
 * standing `out` proud of the wall.
 */
export function wallPanel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out = 0.05) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o: XY = [t[1], -t[0]]
  const P = (s: number, z: number): V3 => [a[0] + t[0] * s + o[0] * out, a[1] + t[1] * s + o[1] * out, z]
  p.quad(P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1))
}

// --- The wheel ---------------------------------------------------------------
function build() {
  const H = 13.4            // axle above the deck (lidar: top 25.9 m)
  const R = 12.3            // rim centre line; outer edge 12.5 m
  const R_IN = 6.0          // the polygonal inner ring of the truss
  const FACE = 1.8          // each face's distance from the mid-plane
  const FOOT = 6.2          // leg feet either side of the axle, in the plane
  const PIVOT = R - 1.45    // gondola pivots on the rim truss's inner chord
  const N = 20              // gondolas, and ties between the faces

  const wheelP = new Part()   // white rims, spokes, ties, hub
  const legs = new Part()     // white A-frames (root node)
  const sign = new Part()     // the hub's sign disc

  const at = (r: number, t: number, y: number): V3 => [r * Math.cos(t), y, r * Math.sin(t)]

  // Rims: a slim band on each face. The real wheel's faces are a dense web
  // of about forty spokes leaving the hub flange off-centre, so they cross;
  // here 32 a face, alternately leaning each way, as bold members.
  for (const y of [-FACE, FACE]) {
    const rim = Array.from({ length: 32 }, (_, i) => at(R, i / 32 * TAU, y))
    sweep(wheelP, rim, inPlane(rim, true), rim.map(() => rect(0.3, 0.16)), true)
    const ring = Array.from({ length: N }, (_, i) => at(R_IN, (i + 0.5) / N * TAU, y))
    sweep(wheelP, ring, inPlane(ring, true), ring.map(() => rect(0.14, 0.12)), true)
    for (let k = 0; k < 32; k++) {
      const t = (k + 0.5) / 32 * TAU
      const lean = k % 2 ? 0.55 : -0.55
      beam(wheelP, at(1.1, t + lean, y * 0.5), at(R - 0.25, t, y), rect(0.13, 0.11), rect(0.12, 0.1), [0, 1, 0], false)
    }
  }
  // Ties across the faces on the truss's inner chord, where the gondolas hang.
  for (let k = 0; k < N; k++) {
    const t = (k + 0.5) / N * TAU
    beam(wheelP, at(PIVOT, t, -FACE), at(PIVOT, t, FACE), rect(0.12, 0.12), rect(0.12, 0.12), [Math.cos(t), 0, Math.sin(t)], false)
  }
  // Hub drum and the sign discs on both faces.
  beam(wheelP, [0, -FACE * 0.7, 0], [0, FACE * 0.7, 0], circle(1.1, 12), circle(1.1, 12), [1, 0, 0])
  for (const s of [-1, 1]) beam(sign, [0, s * (FACE * 0.7), 0], [0, s * (FACE * 0.7 + 0.35), 0], circle(1.45, 16), circle(1.45, 16), [1, 0, 0])

  // Gondolas: an open octagonal tub under an octagonal canopy, hung
  // from a pivot on the rim's tie by a central post.
  const oct = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => {
    const a = (i + 0.5) / 8 * TAU
    return [r * Math.cos(a), r * Math.sin(a), z] as V3
  })
  function gondola(tub: Part, canopy: Part, roofTop: Part) {
    // Tub: tapered bottom, straight sides, open top shown by a sunken floor.
    const rings = [oct(0.65, -2.75), oct(1.3, -2.3), oct(1.3, -1.6), oct(1.2, -1.5)]
    tub.loft(rings)
    tub.cap(rings[0], false)
    tub.cap(oct(1.2, -1.8), true)
    tub.loft([oct(1.2, -1.5), oct(1.2, -1.8)])
    // Canopy: a low octagonal pyramid with a thick edge.
    const c0 = oct(1.55, -0.45), c1 = oct(1.55, 0), apex: V3 = [0, 0, 0.35]
    canopy.loft([c0, c1])
    canopy.cap(c0, false)
    for (let i = 0; i < 8; i++) tri(roofTop, [c1[i], c1[(i + 1) % 8], apex], [[0, 0, 1], [0, 0, 1], [0, 0, 1]].map((n) => n as V3))
    // Post from canopy to tub.
    beam(canopy, [0, 0, -0.45], [0, 0, -1.55], rect(0.1, 0.1), rect(0.1, 0.1), [1, 0, 0], false)
  }

  const WHITE = finish('wheel-white', 0xf1eee6, 0.6)
  const SIGN = { ...PALETTE.trim }
  const RED = finish('gondola-red', 0xd0524c, 0.5)
  const YELLOW = finish('gondola-yellow', 0xe9c84b, 0.5)
  const CANOPY = finish('canopy-grey', 0x6c7179, 0.6)

  // The canopies are dark grey underneath and round the edge, as seen from
  // the pier, but pale on top: the orthophoto shows the wheel white from above.
  const redTub = new Part(), yellowTub = new Part(), canopy = new Part(), canopyTop = new Part()
  gondola(redTub, canopy, canopyTop)
  gondola(yellowTub, new Part(), new Part())

  const LOOP = 120, KEYS = 48
  const times = Array.from({ length: KEYS + 1 }, (_, i) => (i / KEYS) * LOOP)
  const turned = times.map((_, i) => (i / KEYS) * TAU)
  const AXLE: V3 = [0, 1, 0]
  const wheelTurn: Quat[] = turned.map((a) => axisAngle(AXLE, a))
  const plumb: Quat[] = turned.map((a) => axisAngle(AXLE, -a))

  const nodes: NodeSpec[] = [{
    name: 'wheel', translation: [0, 0, H],
    parts: [{ part: wheelP, material: WHITE }, { part: sign, material: SIGN }],
  }]
  const channels: ChannelSpec[] = [{ node: 0, path: 'rotation', values: wheelTurn }]
  for (let k = 0; k < N; k++) {
    const t = (k + 0.5) / N * TAU
    const parts = [{ part: k % 2 ? yellowTub : redTub, material: k % 2 ? YELLOW : RED }, { part: canopy, material: CANOPY }, { part: canopyTop, material: WHITE }]
    nodes.push({ name: `gondola-${k + 1}`, parent: 0, translation: at(PIVOT, t, 0), parts })
    channels.push({ node: nodes.length - 1, path: 'rotation', values: plumb })
  }

  // A-frames: two broad white box legs on each side, outside the faces,
  // from feet on the deck up to a bearing block on the axle.
  for (const s of [-1, 1]) {
    for (const x of [-FOOT, FOOT]) {
      beam(legs, [x * 0.985, s * 2.7, 0.35], [Math.sign(x) * 0.5, s * (FACE + 0.55), H - 0.3], rect(0.6, 0.42, 0.12), rect(0.45, 0.3, 0.1), [0, 1, 0])
      beam(legs, [x, s * 2.7, 0], [x, s * 2.7, 0.6], rect(0.95, 0.7, 0.2), rect(0.9, 0.65, 0.2), [1, 0, 0])
    }
    beam(legs, [0, s * (FACE + 0.3), H], [0, s * (FACE + 1.0), H], rect(0.85, 0.75, 0.2), rect(0.85, 0.75, 0.2), [0, 0, 1])
  }

  const parts = [{ part: legs, material: WHITE }]
  const triangles = countDrawn(parts, nodes)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Pacific Wheel', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: 25.6, bearing: 91,
  }, { nodes, animation: { name: 'turn', times, channels } })
  return { glb, triangles }
}

if (import.meta.main) {
  const { glb, triangles } = build()
  await Bun.write(new URL('../models/la-pacific-wheel.glb', import.meta.url), glb)
  console.log(`la-pacific-wheel.glb: ${triangles} triangles, ${glb.length} bytes`)
}
