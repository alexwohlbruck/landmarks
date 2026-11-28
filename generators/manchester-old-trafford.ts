/**
 * Old Trafford, Manchester: original procedural geometry, CC0-1.0, no
 * textures.  bun generators/manchester-old-trafford.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/manchester-old-trafford.glb, the low model (<= 6,500 triangles):
 *   the stands as raked tiers, roofs, facades, the corner fins, and every
 *   roof truss as a few chunky tubes;
 * - models/manchester-old-trafford.detail.glb, drawn from zoom 16
 *   (<= 40,000): the exposed roof trusses as space trusses (paired top
 *   chords, bottom chord, posts and diagonals on both faces, purlins), the
 *   backstays down the facades, the floodlight rows.
 *
 * This file also exports the small stadium kit used by this builder's
 * liverpool-anfield, london-emirates-stadium and london-stamford-bridge
 * (vector helpers, oriented quads, rods, trusses, the station/section
 * sweep for stands, end caps, smoothing, writeLods); its own build runs
 * only under `import.meta.main`.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 70.8: model
 * +y runs along the pitch toward the East Stand (east-north-east), +x
 * across it toward the Sir Bobby Charlton (South) Stand. Anchor = area
 * centroid of the leisure=stadium outline way/99403577, lng -2.2914024,
 * lat 53.4631537. Bearing 70.8 = the pitch's long edges (OSM
 * way/165256230, 105 x 67.4 m, edges at 70.7) and the Sir Alex Ferguson
 * Stand's principal axis (70.9). y = 0 is the pitch.
 *
 * Identity, in order: the exposed white tubular cantilever trusses
 * standing up over every roof: on the Sir Alex Ferguson Stand a long box
 * truss along the back with radial trusses tapering to the leading edge and
 * backstays raking down the facade, three great trusses over the Stretford
 * End and over the East Stand, radial ones fanning over the two filled
 * north quadrants; the three-tier North Stand and the two quadrants with
 * their domed white roof edges over teal glass drums and the pairs of tall
 * silver fins at their diagonals; the red upper facades on grey stair
 * towers over white concourse bands; the low single-tier Sir Bobby Charlton
 * Stand wrapping the two south corners; red seats; floodlight rows under
 * every leading edge.
 *
 * Evidence
 *  - OSM (measured in this frame): outline way/99403577 (leisure=stadium,
 *    wikidata Q83457) x -96.5..100.4, y -123.7..126.2; pitch way/165256230
 *    x -23.9..43.6, y -52.4..53.1. Stands: Sir Alex Ferguson Stand
 *    way/351220227 (building=stadium) with parts way/351208267 (height 42,
 *    x -96..-29.3) and way/351220228 (height 36, the outer 6 m strip
 *    x -96.5..-89.7); the quadrant fins way/351208273 (NW) and
 *    way/351208274 (NE), height 52, 26 x 5 m tangent to the quadrant
 *    facade at its diagonal; West Stand way/351220229 with parts
 *    way/351208270 (height 37, front y -56.9, back y -118.8) and
 *    way/351209222 (height 24, the outer strip to y -123.7); East Stand
 *    way/351220231 with way/351208268 (37, y 56.6..116.7), way/351208271
 *    (24, outer strip to y 126.2) and way/351208272 (24, a stair block at
 *    the south-east end); Sir Bobby Charlton Stand way/351220232 with
 *    way/351208269 (height 18, front x 50.8..52.6, back x 100.4, wrapping
 *    both south corners at about 38 m from the pitch corner) and
 *    way/351220230 (3 m, a low lean-to on its south-east corner). The
 *    quadrant facades are circles of radius 60-63 m about the pitch-front
 *    corners: the model sweeps the quadrants about those corners and takes
 *    every facade line by ray-casting the outline.
 *  - Published (Wikipedia, "Old Trafford", retrieved 2026-11): capacity
 *    74,158; pitch 105 x 68 m; North Stand (1996, Atherden Fuller, three
 *    tiers, ~26,000) with the cantilever roof "58.5 m from the back wall to
 *    the front edge"; second tiers added to the north-west and north-east
 *    quadrants in 2005-06; East and West Stands two tiers; Sir Bobby
 *    Charlton Stand single tier, the railway behind it.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - "2023 07 31 arne mueseler 00052-Verbessert-RR (53106449339).jpg",
 *      Arne Müseler, CC BY-SA 2.0: aerial from the north-north-west: the
 *      North Stand's trusses, the NE quadrant's fins, glass and white
 *      roof, the East and West trusses, the low South Stand;
 *    - "2023 07 31 arne mueseler 00056-Verbessert-RR (53106240431).jpg",
 *      Arne Müseler, CC BY-SA 2.0: from the north over the canal: the whole
 *      North facade, both quadrants and fins;
 *    - "2023 07 31 arne mueseler 00060-Verbessert-RR (53106651455).jpg" and
 *      "Manchester United Old Trafford.jpg", Arne Müseler, CC BY-SA 2.0 /
 *      3.0 de: aerials from the west: the NW quadrant, the Stretford End
 *      facade, the south corners, the roofs from above;
 *    - "2023 07 31 arne mueseler 00057/00058", Arne Müseler, CC BY-SA 2.0:
 *      aerials from the north-west;
 *    - "Old Trafford december 2023.jpg", Joris van Rooden, CC BY-SA 4.0:
 *      the North facade from Wharfside Way: red blocks on grey towers, the
 *      truss box and its raking legs, the NE fins;
 *    - "Old Trafford stadium - panoramio.jpg", Alexander
 *      Kachkaev, CC BY 3.0: the North facade close up: red cladding, grey
 *      stair drums, the truss over the roof;
 *    - "Bridgewater Canal and Old Trafford football stadium.jpg", Parr,
 *      public domain; "Old Trafford Football Stadium from Salford Quays -
 *      geograph.org.uk - 2693717", Steve Daniels, CC BY-SA 2.0;
 *    - "The Stretford End, Old Trafford Stadium - geograph.org.uk -
 *      2433352", Richard Humphrey, CC BY-SA 2.0: the West Stand's two tiers
 *      and its three great roof trusses;
 *    - "East stand at Old Trafford football stadium - geograph.org.uk -
 *      2433326", Richard Humphrey, CC BY-SA 2.0: the East Stand's teal glass
 *      wall and the truss ends;
 *    - "Inside Old Trafford Football Stadium - geograph.org.uk - 1777320",
 *      Anthony Parkes, CC BY-SA 2.0; "Sir Bobby Charlton Stand (South
 *      Stand).jpg", WDM10, CC BY-SA 4.0; "The Sir Bobby Charlton Stand -
 *      Old Trafford Stadium - geograph.org.uk - 5670089", Anthony Parkes,
 *      CC BY-SA 2.0: the single South tier, its low roof and the
 *      floodlight row along its leading edge, the curved south corners;
 *    - "Manchester , Trafford - Old Trafford Stadium - geograph.org.uk -
 *      3724146", Lewis Clarke, CC BY-SA 2.0: by night, the lit glass and
 *      sign.
 *  - Terrain (Mapterhorn, `terrain.ts grid`): the pitch 1.4 m above the
 *    lowest cell, the streets round the stadium 2-3 m; the railway cutting
 *    behind the South Stand is the low ground. Elevation 0: the pitch is
 *    about at street level.
 *
 * Measured (OSM): every plan line. Published: the tier counts, the North
 * roof's 58.5 m cantilever (modelled 60 m to the facade). OSM heights:
 * North 42 (roof leading edge, modelled 42) and 36 (its facade, modelled
 * 36.5), quadrant fins 52, West/East 37 (leading edge 37.5) and 24 (outer
 * strips), South 18 (modelled 19.5 at the leading edge with the floodlight
 * fascia, 16.5 at the back). Estimated from the photos: the tier
 * profiles (rake, the box fascias between tiers), the truss heights over
 * the roofs (North box truss 50 m, the quadrant and end trusses 46-47 m,
 * scaled from the fins and facades in the north and west views), the
 * quadrant drums (glass to 19 m, grey to 30 m, then the white roof
 * rising), the facade bands, the trusses' spacing (nine radial trusses on
 * the North Stand, three on each end stand, three per quadrant, simplified
 * from the aerials), the floodlights' spacing.
 * Look-only: none.
 * Doubts: no licensed photo shows the South Stand's outer (railway) facade
 * squarely; it is drawn red over grey like the rest. The truss geometry is
 * simplified to a common type per stand; the real North Stand trusses
 * are deeper space frames with more members. Lettering on seats and the
 * "MANCHESTER UNITED" signs are left out.
 */
import { writeFileSync } from 'node:fs'
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish, PALETTE } from './palette'

// ------------------------------------------------------------------ kit
export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
export const scl = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
export const nrm = (a: V3): V3 => scl(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
export const rad = (d: number) => (d * Math.PI) / 180
export const UP: V3 = [0, 0, 1]

/** A quad wound so its normal points along `hint`. */
export function oq(p: Part, a: V3, b: V3, c: V3, d: V3, hint: V3) {
  const n = crs(sub(b, a), sub(c, a)), n2 = crs(sub(c, a), sub(d, a))
  if (dot(add(n, n2), hint) >= 0) p.quad(a, b, c, d)
  else p.quad(a, d, c, b)
}
export function ot(p: Part, a: V3, b: V3, c: V3, hint: V3) {
  if (dot(crs(sub(b, a), sub(c, a)), hint) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}

/** A closed box from a base quad (counter-clockwise from above) extruded up to per-corner heights. */
export function prism(p: Part, base: [number, number][], z0: number, z1: number | number[]) {
  const n = base.length
  const top = (i: number) => (Array.isArray(z1) ? z1[i] : z1)
  const cx = base.reduce((s, q) => s + q[0], 0) / n, cy = base.reduce((s, q) => s + q[1], 0) / n
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a: V3 = [base[i][0], base[i][1], z0], b: V3 = [base[j][0], base[j][1], z0]
    const out: V3 = [(base[i][0] + base[j][0]) / 2 - cx, (base[i][1] + base[j][1]) / 2 - cy, 0]
    oq(p, a, b, [b[0], b[1], top(j)], [a[0], a[1], top(i)], out)
  }
  for (let i = 1; i < n - 1; i++) {
    ot(p, [base[0][0], base[0][1], top(0)], [base[i][0], base[i][1], top(i)], [base[i + 1][0], base[i + 1][1], top(i + 1)], UP)
    if (z0 > 0.01) ot(p, [base[0][0], base[0][1], z0], [base[i][0], base[i][1], z0], [base[i + 1][0], base[i + 1][1], z0], [0, 0, -1])
  }
}

/** A round rod between two points, smooth-shaded, no caps. */
export function rod(p: Part, a: V3, b: V3, r: number, sides = 6) {
  const t = nrm(sub(b, a))
  const s = nrm(Math.abs(t[2]) > 0.9 ? crs(t, [1, 0, 0]) : crs(t, UP))
  const u = crs(s, t)
  const ring = (c: V3) => Array.from({ length: sides }, (_, k) => {
    const an = (2 * Math.PI * (k + 0.5)) / sides
    const d = add(scl(s, Math.cos(an)), scl(u, Math.sin(an)))
    return { p: add(c, scl(d, r)), n: d }
  })
  const A = ring(a), B = ring(b)
  for (let k = 0; k < sides; k++) {
    const j = (k + 1) % sides
    p.tri(A[k].p, B[k].p, B[j].p, undefined, undefined, undefined, [A[k].n, B[k].n, B[j].n])
    p.tri(A[k].p, B[j].p, A[j].p, undefined, undefined, undefined, [A[k].n, B[j].n, A[j].n])
  }
}
/** Rods along a polyline. */
export function rods(p: Part, pts: V3[], r: number, sides = 6) {
  for (let i = 0; i < pts.length - 1; i++) rod(p, pts[i], pts[i + 1], r, sides)
}
/** A small solid bead (octahedron), for lamps. */
export function bead(p: Part, c: V3, r: number) {
  const X: V3[] = [[r, 0, 0], [0, r, 0], [-r, 0, 0], [0, -r, 0]]
  for (let i = 0; i < 4; i++) {
    const a = add(c, X[i]), b = add(c, X[(i + 1) % 4])
    ot(p, a, b, add(c, [0, 0, r]), add(sub(add(a, b), scl(c, 2)), [0, 0, r]))
    ot(p, a, b, add(c, [0, 0, -r]), add(sub(add(a, b), scl(c, 2)), [0, 0, -r]))
  }
}

/**
 * A plane truss between two chords sampled at the same count: chords,
 * posts at every sample and alternating (warren) diagonals.
 */
export function truss(p: Part, top: V3[], bot: V3[], r: number, sides: number, opt: { posts?: boolean; diags?: boolean; rd?: number } = {}) {
  rods(p, top, r, sides)
  rods(p, bot, r, sides)
  const rd = opt.rd ?? r * 0.7
  for (let i = 0; i < top.length; i++) {
    if (opt.posts !== false && i > 0 && i < top.length - 1) rod(p, bot[i], top[i], rd, sides)
    if (opt.diags !== false && i < top.length - 1) rod(p, i % 2 ? top[i] : bot[i], i % 2 ? bot[i + 1] : top[i + 1], rd, sides)
  }
}
/**
 * A triangular space truss: two top chords `w` apart (horizontal offset
 * `side`), one bottom chord, posts and diagonals on both faces, and
 * cross ties between the top chords.
 */
export function spaceTruss(p: Part, top: V3[], bot: V3[], side: V3, w: number, r: number, sides: number) {
  const tA = top.map((q) => add(q, scl(side, w / 2))), tB = top.map((q) => add(q, scl(side, -w / 2)))
  truss(p, tA, bot, r, sides)
  // the second face shares the bottom chord: only its top chord, posts and diagonals
  rods(p, tB, r, sides)
  for (let i = 0; i < top.length; i++) {
    if (i > 0 && i < top.length - 1) rod(p, bot[i], tB[i], r * 0.7, sides)
    if (i < top.length - 1) rod(p, i % 2 ? tB[i] : bot[i], i % 2 ? bot[i + 1] : tB[i + 1], r * 0.7, sides)
  }
  for (let i = 0; i < top.length; i += 2) rod(p, tA[i], tB[i], r * 0.6, sides)
}
export const sample = (a: V3, b: V3, n: number): V3[] => Array.from({ length: n + 1 }, (_, i) => lerp3(a, b, i / n))

/**
 * Smooth a part's shading where faces meet at less than `deg`, and drop
 * the (unused) UVs, so coincident corners merge into one vertex.
 */
export function smooth(p: Part, deg = 30) {
  const cos = Math.cos((deg * Math.PI) / 180)
  const groups = new Map<string, number[]>()
  const n = p.pos.length / 3
  for (let i = 0; i < n; i++) {
    const k = `${Math.round(p.pos[3 * i] * 100)},${Math.round(p.pos[3 * i + 1] * 100)},${Math.round(p.pos[3 * i + 2] * 100)}`
    const g = groups.get(k)
    if (g) g.push(i)
    else groups.set(k, [i])
  }
  const out = p.nrm.slice()
  for (const g of groups.values())
    for (const i of g) {
      let x = 0, y = 0, z = 0
      for (const j of g) {
        const d = p.nrm[3 * i] * p.nrm[3 * j] + p.nrm[3 * i + 1] * p.nrm[3 * j + 1] + p.nrm[3 * i + 2] * p.nrm[3 * j + 2]
        if (d >= cos) { x += p.nrm[3 * j]; y += p.nrm[3 * j + 1]; z += p.nrm[3 * j + 2] }
      }
      const l = Math.hypot(x, y, z) || 1
      out[3 * i] = Math.round((x / l) * 1e4) / 1e4; out[3 * i + 1] = Math.round((y / l) * 1e4) / 1e4; out[3 * i + 2] = Math.round((z / l) * 1e4) / 1e4
    }
  p.nrm = out
  p.uv = p.uv.map(() => 0)
}

// ---------------------------------------------------------- the sweep
/** A station on a stand: its front point (at z = 0) and its horizontal outward unit normal. */
export type St = { o: V3; n: V3 }
export const at = (s: St, d: number, z: number): V3 => [s.o[0] + s.n[0] * d, s.o[1] + s.n[1] * d, z]
/** Stations along a straight front line from a to b, outward n. */
export function line(a: [number, number], b: [number, number], n: [number, number], count = 1): St[] {
  return Array.from({ length: count + 1 }, (_, i) => ({ o: [lerp(a[0], b[0], i / count), lerp(a[1], b[1], i / count), 0] as V3, n: [n[0], n[1], 0] as V3 }))
}
/** Stations fanning about a corner point c, from bearing-like angle a0 to a1 (degrees, 0 = +y, 90 = +x), front radius r. */
export function fan(c: [number, number], a0: number, a1: number, count: number, r = 0): St[] {
  return Array.from({ length: count + 1 }, (_, i) => {
    const a = rad(lerp(a0, a1, i / count)), n: V3 = [Math.sin(a), Math.cos(a), 0]
    return { o: [c[0] + n[0] * r, c[1] + n[1] * r, 0] as V3, n }
  })
}
/** A profile point: distance out from the front line, height, and the part drawing the segment that starts here. */
export type PP = [number, number, Part | null]
/**
 * Sweep a profile (front-to-back / bottom-to-top, faces toward the pitch
 * and up) between consecutive stations. `prof(i)` gives station i's
 * points; all must have the same count.
 */
export function sweep(sts: St[], prof: (i: number) => PP[], flip = false) {
  for (let i = 0; i < sts.length - 1; i++) {
    const A = prof(i), B = prof(i + 1), sA = sts[i], sB = sts[i + 1]
    const nm = nrm(add(sA.n, sB.n))
    for (let k = 0; k < A.length - 1; k++) {
      const part = A[k][2]
      if (!part) continue
      const dd = (A[k + 1][0] - A[k][0] + B[k + 1][0] - B[k][0]) / 2, dz = (A[k + 1][1] - A[k][1] + B[k + 1][1] - B[k][1]) / 2
      let hint = add(scl(nm, -dz), scl(UP, dd))
      if (flip) hint = scl(hint, -1)
      const a = at(sA, A[k][0], A[k][1]), b = at(sB, B[k][0], B[k][1]), c = at(sB, B[k + 1][0], B[k + 1][1]), d = at(sA, A[k + 1][0], A[k + 1][1])
      if (Math.hypot(...sub(a, d)) < 1e-6 && Math.hypot(...sub(b, c)) < 1e-6) continue
      oq(p0(part), a, b, c, d, hint)
    }
  }
}
const p0 = (p: Part) => p
/**
 * Close the end of a stand at station s: the region under the top chain
 * `top` (d increasing, steps allowed) down to z = 0, facing `face`.
 */
export function cap(part: Part, s: St, top: [number, number][], face: V3) {
  for (let i = 0; i < top.length - 1; i++) {
    const [d0, z0] = top[i], [d1, z1] = top[i + 1]
    if (d1 - d0 < 1e-3) continue
    oq(part, at(s, d0, 0), at(s, d1, 0), at(s, d1, z1), at(s, d0, z0), face)
  }
}
/** Cap a thin roof slab's end: the quad strip between top and underside chains. */
export function capSlab(part: Part, s: St, top: [number, number][], under: [number, number][], face: V3) {
  for (let i = 0; i < top.length - 1; i++)
    oq(part, at(s, under[i][0], under[i][1]), at(s, under[i + 1][0], under[i + 1][1]), at(s, top[i + 1][0], top[i + 1][1]), at(s, top[i][0], top[i][1]), face)
}

/** Distance from point c along horizontal direction n to the farthest crossing of a closed outline. */
export function rayOutline(outline: [number, number][], c: [number, number], n: V3) {
  let best = 0
  for (let i = 0; i < outline.length; i++) {
    const [x0, y0] = outline[i], [x1, y1] = outline[(i + 1) % outline.length]
    const ex = x1 - x0, ey = y1 - y0, wx = x0 - c[0], wy = y0 - c[1]
    const den = n[0] * ey - n[1] * ex
    if (Math.abs(den) < 1e-9) continue
    const t = (wx * ey - wy * ex) / den, s = (wx * n[1] - wy * n[0]) / den
    if (t > 0 && s >= 0 && s <= 1) best = Math.max(best, t)
  }
  return best
}

/** Interpolate z along a (d, z) polyline at d (clamped). */
export function zAt(pl: [number, number, ...unknown[]][], d: number) {
  if (d <= pl[0][0]) return pl[0][1]
  for (let i = 0; i < pl.length - 1; i++) {
    const [d0, z0] = pl[i], [d1, z1] = pl[i + 1]
    if (d <= d1 && d1 > d0) return lerp(z0, z1, (d - d0) / (d1 - d0))
  }
  return pl[pl.length - 1][1]
}
/**
 * A rectangular stand's seating block: the seat profile swept along the
 * stations (front wall, tiers, box fascias, back wall up to `prof`'s last
 * point), and both ends closed down to the ground, out to the facade at D
 * under the roof underside `under(d)`.
 */
export function seatBlock(sts: St[], prof: PP[], D: number, under: (d: number) => number, capPart: Part, caps: [boolean, boolean] = [true, true]) {
  sweep(sts, () => prof)
  const chain: [number, number][] = [...prof.slice(1).map(([d, z]) => [d, z] as [number, number]), [D, under(D)]]
  const ends: [number, number][] = [[0, 1], [sts.length - 1, sts.length - 2]]
  ends.forEach(([i, j], k) => {
    if (!caps[k]) return
    cap(capPart, sts[i], chain, nrm(sub(sts[i].o, sts[j].o)))
  })
}
/**
 * A roof slab: `top` runs from the leading fascia's foot (d0, zFoot) up to
 * the leading edge (d0, zF), then across the roof to the back edge; the
 * underside follows the top `th` lower (from the fascia's foot). Both
 * ends closed.
 */
export function roofBlock(sts: St[], top: PP[], th: number, underPart: Part, capPart: Part, caps: [boolean, boolean] = [true, true]) {
  sweep(sts, () => top)
  const under: PP[] = [[top[0][0], top[0][1], underPart], ...top.slice(2).map(([d, z]) => [d, z - th, underPart] as PP)]
  under[under.length - 1][2] = null
  sweep(sts, () => under, true)
  const t: [number, number][] = top.slice(1).map(([d, z]) => [d, z])
  const u: [number, number][] = [[top[0][0], top[0][1]], ...top.slice(2).map(([d, z]) => [d, z - th] as [number, number])]
  const ends: [number, number][] = [[0, 1], [sts.length - 1, sts.length - 2]]
  ends.forEach(([i, j], k) => {
    if (!caps[k]) return
    capSlab(capPart, sts[i], t, u, nrm(sub(sts[i].o, sts[j].o)))
  })
}
/** A lattice tower of four legs from the ground to height h, braced, centred at c. */
export function latticeTower(p: Part, c: [number, number], w: number, h: number, r: number, sides: number, panels: number) {
  const L: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [c[0] + (a * w) / 2, c[1] + (b * w) / 2])
  for (const [x, y] of L) rod(p, [x, y, 0], [x, y, h], r, sides)
  for (let k = 0; k < panels; k++) {
    const z0 = Math.max(r, (h * k) / panels), z1 = (h * (k + 1)) / panels
    for (let i = 0; i < 4; i++) {
      const [x0, y0] = L[i], [x1, y1] = L[(i + 1) % 4]
      rod(p, [x0, y0, k % 2 ? z0 : z1], [x1, y1, k % 2 ? z1 : z0], r * 0.6, sides)
      if (k > 0) rod(p, [x0, y0, z0], [x1, y1, z0], r * 0.5, sides)
    }
  }
}

/**
 * Stand a model built on a level field over sloping ground: lift every
 * vertex above the ground by `zp` (the field's height over the lowest
 * ground under the footprint) and leave the ground vertices at 0, so
 * every wall runs down to the lowest ground.
 */
export function liftField(parts: Array<{ part: Part }>, zp: number) {
  for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) if (part.pos[i] > 0.01) part.pos[i] += zp
}

export type Lod = { file: string; parts: Array<{ part: Part; material: MaterialSpec }> }
/** Write each LOD's GLB; print triangles and bytes. */
export function writeLods(name: string, lods: Lod[]) {
  for (const l of lods) {
    const used = l.parts.filter(({ part }) => part.triangles > 0)
    for (const { part } of used) smooth(part)
    const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; ground anchor' })
    writeFileSync(new URL(`../models/${l.file}`, import.meta.url).pathname, glb)
    const tris = used.reduce((s, { part }) => s + part.triangles, 0)
    console.log(`models/${l.file}: ${tris} triangles, ${glb.length} bytes, ${used.length} materials`)
  }
}

// ------------------------------------------------------- Old Trafford
const ID = 'manchester-old-trafford'

/** OSM way/99403577 in this frame. */
const OUTLINE: [number, number][] = [[-96.2,-59.8],[-96.2,-41.1],[-93.0,-41.1],[-93.1,-20.7],[-96.3,-20.8],[-96.4,17.9],[-93.2,17.9],[-93.3,36.1],[-96.4,36.1],[-96.5,57.9],[-89.7,58.1],[-89.7,60.6],[-89.0,60.6],[-88.4,68.5],[-86.7,77.5],[-83.4,85.1],[-80.9,89.2],[-84.0,92.3],[-66.4,110.8],[-63.3,107.7],[-59.6,110.0],[-52.3,113.6],[-43.6,115.8],[-34.6,116.6],[-33.1,116.7],[-24.4,116.7],[-24.5,123.0],[-15.1,123.1],[-3.3,125.3],[8.7,126.2],[20.8,125.4],[32.7,123.5],[43.1,123.6],[43.2,117.3],[51.9,117.4],[52.2,114.7],[56.4,114.8],[56.4,106.8],[52.3,106.7],[52.3,104.3],[52.3,101.5],[57.5,100.1],[64.1,97.6],[70.4,94.2],[75.9,89.6],[74.6,88.2],[79.3,82.9],[82.9,77.4],[86.0,71.1],[87.0,71.5],[89.0,64.6],[86.3,63.7],[87.0,58.9],[92.0,59.5],[97.5,60.1],[99.2,58.9],[100.4,-57.0],[99.1,-63.8],[97.2,-70.2],[91.0,-68.0],[86.7,-66.6],[85.9,-68.4],[87.4,-69.0],[83.4,-76.7],[82.0,-76.0],[77.3,-82.1],[71.4,-87.4],[65.4,-91.6],[62.8,-93.0],[64.5,-97.1],[59.0,-99.4],[58.4,-98.1],[53.2,-99.8],[53.2,-102.8],[53.3,-118.0],[53.3,-122.7],[34.1,-122.9],[34.0,-119.7],[14.7,-119.9],[14.7,-123.1],[5.4,-123.3],[5.4,-120.1],[-13.7,-120.3],[-13.7,-123.5],[-33.3,-123.7],[-33.3,-118.8],[-42.6,-118.1],[-51.6,-115.9],[-58.8,-113.0],[-61.9,-111.1],[-65.3,-114.5],[-84.0,-95.5],[-80.5,-92.0],[-82.5,-88.9],[-86.2,-81.3],[-88.3,-72.7],[-89.2,-63.0],[-90.1,-63.0],[-90.1,-59.8]]

// The seats' front line (OSM stand fronts): north x -29.5, south x 51.5, west y -56.9, east y 56.7.
const XN = -29.5, XS = 51.5, YW = -56.9, YE = 56.7

const M = {
  red: { ...finish('mufc-red', 0xc8463f), floodlight: (q: V3, n: V3) => (Math.abs(n[2]) < 0.4 && q[2] > 4 && q[2] < 37 ? 0.35 : 0) } as MaterialSpec,
  grey: finish('cladding-grey', 0xaab0b5, 0.6),
  white: finish('truss-white', 0xf2f2ee, 0.5),
  roof: { ...finish('roof-sheeting', 0xcdd0d2, 0.7), doubleSided: true } as MaterialSpec,
  glass: { ...PALETTE.window, color: 0x5e8c8a } as MaterialSpec,
  lamp: finish('lamp-floodlight', 0xd9dad6, 0.5),
}

function build(detail: boolean) {
  const red = new Part(), grey = new Part(), white = new Part(), roof = new Part(), glass = new Part(), lamp = new Part()
  const RS = detail ? 6 : 4 // rod sides
  const QN = detail ? 16 : 8 // stations per quadrant
  const CN = detail ? 12 : 6 // stations per south corner

  type Stand = {
    sts: St[]
    D: (i: number) => number // facade distance
    seats: (D: number) => PP[] // seat profile (front low wall .. back wall top), ends under the roof
    zF: (i: number) => number // roof top at leading edge
    zB: number // roof top at the facade (= facade top)
    d0: (i: number) => number // leading edge distance (negative bulges into the pitch corner)
    th: number
    facade: (i: number, s: St, D: number) => void // facade drawing for segment i..i+1 (draws itself)
    dome?: boolean // the quadrants' white roof edge over the drum
  }
  const roofTop = (zF: number, zB: number, d0: number, D: number, d: number) => lerp(zF, zB, (d - d0) / (D - d0))

  // Seat profiles: [d, z, part of the segment starting here].
  const N3 = (D: number): PP[] => [[0, 0, red], [0, 1.3, red], [0, 1.3, red], [23, 11, glass], [23, 14.2, red], [33, 20.5, glass], [33, 24.5, red], [56, 35, grey], [56, 36.4, null]]
  const Q2 = (D: number): PP[] => [[0, 0, red], [0, 1.3, red], [0, 1.3, red], [23, 11, glass], [23, 14.2, red], [33, 19.5, red], [33, 19.5, red], [52, 29, grey], [52, 30.6, null]]
  const W2 = (D: number): PP[] => [[0, 0, red], [0, 1.3, red], [0, 1.3, red], [26, 12.5, glass], [26, 16, red], [36, 21.8, red], [36, 21.8, red], [52, 31, grey], [52, 33.2, null]]
  const S1 = (D: number): PP[] => [[0, 0, red], [0, 1.5, red], [0, 1.5, red], [17, 8, red], [17, 8, red], [34, 14.5, glass], [34, 16.3, null]]

  const stands: Stand[] = []
  const nullFacade = () => {}

  // Facade bands on a straight stand between stations a and b, at distance D.
  // kinds: 'std' red base, white concourse with two window bands, red top;
  // 'glass' glazed to 22 m; 'grey' grey lower.
  const bands = (sA: St, sB: St, D: number, top: number, kind: 'std' | 'glass' | 'grey' | 'drum' | 'low') => {
    const out = sA.n
    const q = (part: Part, z0: number, z1: number, off = 0) => oq(part, at(sA, D + off, z0), at(sB, D + off, z0), at(sB, D + off, z1), at(sA, D + off, z1), out)
    if (kind === 'drum') {
      q(glass, 0, 14); q(grey, 14, top)
      return
    }
    q(red, 0, 3)
    if (kind === 'low') {
      q(grey, 3, 11.5); q(glass, 5.5, 9, 0.05); q(red, 11.5, top)
    } else if (kind === 'std') {
      q(white, 3, 17)
      q(grey, 5.5, 8.5, 0.05); q(grey, 11, 14.5, 0.05) // grey louvre bands on the white (cmp3; lead review)
      q(red, 17, top)
    } else if (kind === 'glass') {
      q(glass, 3, 22); q(red, 22, top)
    } else {
      q(grey, 3, 22)
      q(glass, 8, 11.5, 0.05); q(glass, 15, 18.5, 0.05)
      q(red, 22, top)
    }
  }
  // A stair tower on a facade: grey drum to 24 m, red cap to the top, projecting 2.4 m.
  const tower = (s: St, along: V3, D: number, w: number, top: number) => {
    const c = at(s, D, 0)
    const u = along, n = s.n
    const P = (a: number, b: number): [number, number] => [c[0] + u[0] * a + n[0] * b, c[1] + u[1] * a + n[1] * b]
    const base: [number, number][] = [P(-w / 2, -0.5), P(w / 2, -0.5), P(w / 2, 1.6), P(w * 0.3, 2.4), P(-w * 0.3, 2.4), P(-w / 2, 1.6)]
    prism(grey, base, 0, 20)
    prism(red, base, 20, top + 0.6)
  }

  // --- North Stand (Sir Alex Ferguson), three tiers.
  {
    const ys = [YW, -48, -41, -34, -22.5, -14.5, -6, 6, 13.5, 21.5, 34, 41, 48, YE]
    const sts: St[] = ys.map((y) => ({ o: [XN, y, 0] as V3, n: [-1, 0, 0] as V3 }))
    const D = 63.5
    stands.push({
      sts, D: () => D, seats: N3, zF: () => 42, zB: 36.5, d0: () => -1.5, th: 1.4,
      facade: (i, s, DD) => {
        const y0 = ys[i], y1 = ys[i + 1], ym = (y0 + y1) / 2
        const kind = Math.abs(ym) < 6 ? 'glass' : 'std'
        bands(sts[i], sts[i + 1], DD, 36.5, kind)
      },
    })
    for (const y of [-41, -18.5, 17.5, 41]) tower({ o: [XN, y, 0], n: [-1, 0, 0] }, [0, 1, 0], D, 7, 36.5)
  }
  // --- quadrants: fans about the North front corners, two tiers, domed roof edge.
  for (const [c, a0, a1] of [[[XN, YW], 270, 180], [[XN, YE], 270, 360]] as [[number, number], number, number][]) {
    const sts = fan(c, a0, a1, QN, 0.01)
    const Dq = sts.map((s) => {
      const t = rayOutline(OUTLINE, c, s.n)
      return Math.min(64, t)
    })
    // the fins jut 2-3 m past the drum: keep the drum on its circle
    const Dc = Dq.map((d, i) => {
      const f = i / QN
      return Math.min(d, lerp(63.5, c[1] < 0 ? 62 : 60, f) + 0.5)
    })
    const end = c[1] < 0 ? 37.5 : 37.5
    stands.push({
      sts, D: (i) => Dc[i], seats: Q2, dome: true,
      zF: (i) => lerp(42, end, Math.pow(i / QN, 1.5)), zB: 30,
      d0: (i) => -1.5 - 4.5 * Math.sin(Math.PI * (i / QN)),
      th: 1.4,
      facade: (i, s, DD) => {
        const sA = sts[i], sB = sts[i + 1], Da = Dc[i], Db = Dc[i + 1]
        oq(glass, at(sA, Da, 0), at(sB, Db, 0), at(sB, Db, 19), at(sA, Da, 19), nrm(add(sA.n, sB.n)))
        oq(grey, at(sA, Da, 19), at(sB, Db, 19), at(sB, Db, 30), at(sA, Da, 30), nrm(add(sA.n, sB.n)))
      },
    })
    // the pair of fins at the diagonal, flanking a glass stair slot
    const mid = fan(c, (a0 + a1) / 2, (a0 + a1) / 2, 1)[0]
    const Dm = lerp(63.5, c[1] < 0 ? 62 : 60, 0.5)
    const tang: V3 = [mid.n[1], -mid.n[0], 0]
    const P = (a: number, b: number): [number, number] => [c[0] + mid.n[0] * (Dm + b) + tang[0] * a, c[1] + mid.n[1] * (Dm + b) + tang[1] * a]
    for (const sgn of [-1, 1]) {
      const a0f = sgn * 3, a1f = sgn * 12.5
      // wedge: knife top rising from 44 m at the outer side to 52 m at the slot
      const base: [number, number][] = sgn > 0
        ? [P(a0f, -3), P(a1f, -3), P(a1f, 3.6), P(a0f, 2.6)]
        : [P(a1f, -3), P(a0f, -3), P(a0f, 2.6), P(a1f, 3.6)]
      const zs = sgn > 0 ? [52, 43, 43, 52] : [43, 52, 52, 43]
      prism(grey, base, 0, zs)
    }
    prism(glass, [P(-3, -2.5), P(3, -2.5), P(3, 1.5), P(-3, 1.5)], 0, 47)
  }
  // --- West (Stretford End) and East Stands, two tiers.
  for (const [y, sgn] of [[YW, -1], [YE, 1]] as [number, number][]) {
    const xs = [XN, -20, -10, 0, 10, 20, 32, 42, XS]
    const sts: St[] = xs.map((x) => ({ o: [x, y, 0] as V3, n: [0, sgn, 0] as V3 }))
    const D = sgn < 0 ? 61.9 : 60.0
    stands.push({
      sts, D: () => D, seats: W2, zF: () => 37.5, zB: 34, d0: () => -1.5, th: 1.3,
      facade: (i) => {
        const xm = (xs[i] + xs[i + 1]) / 2
        const kind = sgn > 0 ? (xm > -2 && xm < 32 ? 'glass' : 'grey') : 'std'
        bands(sts[i], sts[i + 1], D, 34, kind)
      },
    })
    for (const x of sgn < 0 ? [-24, 4, 30, 47] : [-24, -6, 40]) tower({ o: [x, y, 0], n: [0, sgn, 0] }, [1, 0, 0], D, 6.5, 34)
    // the outer 24 m strip (OSM way/351209222, way/351208271)
    const x0 = sgn < 0 ? -33.3 : -24.4, x1 = sgn < 0 ? 53.3 : 43.2
    const yb = y + sgn * D, yo = yb + sgn * (sgn < 0 ? 4.6 : 7.2)
    const base: [number, number][] = sgn < 0 ? [[x0, yo], [x1, yo], [x1, yb], [x0, yb]] : [[x0, yb], [x1, yb], [x1, yo], [x0, yo]]
    prism(sgn < 0 ? white : grey, base, 0, 24)
    const fs: St = { o: [x0, yo, 0], n: [0, sgn, 0] }, fe: St = { o: [x1, yo, 0], n: [0, sgn, 0] }
    oq(glass, at(fs, 0.05, 8), at(fe, 0.05, 8), at(fe, 0.05, 11.5), at(fs, 0.05, 11.5), [0, sgn, 0])
    oq(glass, at(fs, 0.05, 15), at(fe, 0.05, 15), at(fe, 0.05, 18.5), at(fs, 0.05, 18.5), [0, sgn, 0])
    oq(red, at(fs, 0.06, 19.8), at(fe, 0.06, 19.8), at(fe, 0.06, 24), at(fs, 0.06, 24), [0, sgn, 0])
    oq(red, at(fs, 0.06, 0), at(fe, 0.06, 0), at(fe, 0.06, 3), at(fs, 0.06, 3), [0, sgn, 0])
  }
  // --- Sir Bobby Charlton (South) Stand, one tier, wrapping both south corners.
  {
    const ys = [YW, -40, -20, 0, 20, 40, YE]
    const sts: St[] = ys.map((y) => ({ o: [XS, y, 0] as V3, n: [1, 0, 0] as V3 }))
    stands.push({
      sts, D: () => 48.7, seats: S1, zF: () => 19.5, zB: 16.5, d0: () => -1.5, th: 1.2,
      facade: (i) => bands(sts[i], sts[i + 1], 48.7, 16.5, 'low'),
    })
  }
  for (const [c, a0, a1] of [[[XS, YW], 90, 180], [[XS, YE], 90, 0]] as [[number, number], number, number][]) {
    const sts = fan(c, a0, a1, CN, 0.01)
    const Dq = sts.map((s) => Math.max(34.5, Math.min(48.7, rayOutline(OUTLINE, c, s.n) - 0.3)))
    stands.push({
      sts, D: (i) => Dq[i], seats: S1, zF: () => 19.5, zB: 16.5,
      d0: (i) => -1.5 - 3 * Math.sin(Math.PI * (i / CN)), th: 1.2,
      facade: (i) => {
        const sA = sts[i], sB = sts[i + 1], o = nrm(add(sA.n, sB.n))
        oq(red, at(sA, Dq[i], 0), at(sB, Dq[i + 1], 0), at(sB, Dq[i + 1], 3), at(sA, Dq[i], 3), o)
        oq(grey, at(sA, Dq[i], 3), at(sB, Dq[i + 1], 3), at(sB, Dq[i + 1], 12), at(sA, Dq[i], 12), o)
        oq(red, at(sA, Dq[i], 12), at(sB, Dq[i + 1], 12), at(sB, Dq[i + 1], 16.5), at(sA, Dq[i], 16.5), o)
      },
    })
  }

  // --- sweep every stand: seats, roof, facade, end caps
  for (const st of stands) {
    const { sts } = st
    const roofAt = (i: number, d: number) => roofTop(st.zF(i), st.zB, st.d0(i), st.D(i), d)
    // seats: profile ends at the back wall top, which meets the roof underside
    sweep(sts, (i) => {
      const pr = st.seats(st.D(i))
      const last = pr[pr.length - 1]
      last[1] = roofAt(i, last[0]) - st.th
      return pr
    })
    // roof: leading fascia, top, underside (from the back wall to the leading edge)
    sweep(sts, (i) => {
      const d0 = st.d0(i), D = st.D(i), zF = st.zF(i)
      if (st.dome) return [[d0, zF - 2.6, white], [d0, zF + 0.3, roof], [D - 15, roofAt(i, D - 15), white], [D, st.zB, null]]
      return [[d0, zF - 2.6, white], [d0, zF + 0.3, roof], [D - 15, roofAt(i, D - 15), roof], [D, st.zB, null]]
    })
    sweep(sts, (i) => {
      const d0 = st.d0(i), D = st.D(i), zF = st.zF(i)
      const back = st.seats(D).slice(-1)[0][0]
      return [[d0, zF - 2.6, roof], [back, roofAt(i, back) - st.th, null]]
    }, true)
    // concourse between the back wall and the facade is under the roof; the facade
    for (let i = 0; i < sts.length - 1; i++) st.facade(i, sts[i], st.D(i))
    // floodlights under the leading edge
    const step = detail ? 4.5 : 9
    for (let i = 0; i < sts.length - 1; i++) {
      const a = at(sts[i], st.d0(i) + 0.8, st.zF(i) - 3.2), b = at(sts[i + 1], st.d0(i + 1) + 0.8, st.zF(i + 1) - 3.2)
      const n = Math.max(1, Math.round(Math.hypot(...sub(b, a)) / step))
      for (let k = 0; k < n; k++) bead(lamp, lerp3(a, b, (k + 0.5) / n), detail ? 0.6 : 0.9)
    }
    // caps at both ends
    for (const [i, face] of [[0, -1], [sts.length - 1, 1]] as [number, number][]) {
      const s = sts[i]
      const j = i === 0 ? 1 : sts.length - 2
      const along = nrm(sub(sts[i].o, sts[j].o))
      const dir: V3 = Math.hypot(...along) > 1e-6 ? along : nrm(crs(UP, s.n))
      const hint: V3 = Math.hypot(...sub(sts[i].o, sts[j].o)) > 1e-6 ? dir : scl(nrm(crs(face > 0 ? UP : [0, 0, -1], s.n)), i === 0 ? 1 : 1)
      // fans: the cap faces along the rotation direction
      const fanHint: V3 = (() => {
        const t = nrm(sub(sts[j].n, sts[i].n))
        return scl(t, -1)
      })()
      const h = Math.hypot(...sub(sts[i].o, sts[j].o)) > 1e-3 ? hint : fanHint
      const pr = st.seats(st.D(i)).map(([d, z]) => [d, z] as [number, number]).filter((_, k) => k > 0)
      const D = st.D(i), back = pr[pr.length - 1][0]
      pr[pr.length - 1][1] = roofAt(i, back) - st.th
      const chain: [number, number][] = [[0, 1.3], ...pr.slice(1), [D, st.zB - st.th]]
      cap(grey, s, chain, h)
      // roof slab end
      const d0 = st.d0(i), zF = st.zF(i)
      capSlab(roof, s, [[d0, zF + 0.3], [D, st.zB]], [[d0, zF - 2.6], [D, st.zB - st.th]], h)
    }
  }

  // ------------------------------------------------- the roof trusses
  const r = detail ? 0.5 : 0.95
  type Tr = { peak: V3; foot: V3; tip: V3 }
  /** A cantilever truss on station s: peak at dp (height zp) over the roof, tapering to the tip; backstay to the facade. */
  const cantilever = (s: St, roofZ: (d: number) => number, dTip: number, zTip: number, dp: number, zp: number, D: number, zLeg: number, main = true): Tr => {
    const tip = at(s, dTip, zTip + 0.4)
    const peak = at(s, dp, zp)
    const foot = at(s, dp, roofZ(dp) + 0.4)
    if (detail) spaceTruss(white, sample(peak, tip, 8), sample(foot, tip, 8), crs(UP, s.n), 2.4, r, RS)
    else {
      // low: chords, the post at the peak and two diagonals
      rod(white, peak, tip, r, RS); rod(white, foot, tip, r * 0.8, RS); rod(white, foot, peak, r * 0.9, RS)
      const b1 = lerp3(foot, tip, 0.4), t1 = lerp3(peak, tip, 0.4)
      rod(white, peak, b1, r * 0.7, RS); rod(white, b1, t1, r * 0.7, RS)
    }
    // backstay: from the peak down past the facade
    if (main) {
      rod(white, peak, at(s, D + 1.2, zLeg), r * 1.1, RS)
      if (detail) rod(white, foot, at(s, D + 1.2, roofZ(D) + 0.2), r * 0.8, RS)
    }
    return { peak, foot, tip }
  }
  /** The box truss along the peaks and purlins across the top chords between neighbouring trusses. */
  const tie = (ts: Tr[], fr: number[]) => {
    for (let i = 0; i < ts.length - 1; i++) {
      const a = ts[i], b = ts[i + 1]
      rod(white, a.peak, b.peak, r * 1.1, RS)
      rod(white, a.foot, b.foot, r * 0.8, RS)
      rod(white, i % 2 ? a.peak : a.foot, i % 2 ? b.foot : b.peak, r * 0.75, RS)
      for (const f of fr) rod(white, lerp3(a.peak, a.tip, f), lerp3(b.peak, b.tip, f), r * 0.7, RS)
      if (detail) rod(white, lerp3(a.peak, a.tip, 0.97), lerp3(b.peak, b.tip, 0.97), r * 0.7, RS)
    }
  }
  const fr = detail ? [0.2, 0.4, 0.6, 0.8] : [0.33, 0.66]
  // North: radial trusses every 7 m (14 m in the low model) on the box truss along the back.
  const nRoof = (d: number) => roofTop(42, stands[0].zB, -1.5, 63.5, d)
  const nN = detail ? 17 : 9
  const nYs = Array.from({ length: nN }, (_, i) => lerp(-56, 56, i / (nN - 1)))
  const nT = nYs.map((y) => cantilever({ o: [XN, y, 0], n: [-1, 0, 0] }, nRoof, -1.5, 42, 49.5, 47.5, 63.5, 23, !detail || Math.round(y) % 14 === 0))
  tie(nT, fr)
  // Quadrants: radial trusses fanning, chained on to the North box truss.
  for (const [c, endT] of [[[XN, YW], 0], [[XN, YE], nT.length - 1]] as [[number, number], number][]) {
    const q = stands.find((s) => s.sts.length === QN + 1 && Math.abs(s.sts[0].o[1] - c[1]) < 1 && Math.abs(s.sts[0].o[0] - c[0]) < 1)!
    const ts: Tr[] = [nT[endT]]
    const fs = detail ? [0.17, 0.33, 0.5, 0.67, 0.83] : [0.25, 0.5, 0.75]
    for (const f of fs) {
      const i = Math.round(f * QN)
      const D = q.D(i)
      const rz = (d: number) => roofTop(q.zF(i), q.zB, q.d0(i), D, d)
      ts.push(cantilever(q.sts[i], rz, q.d0(i), q.zF(i), D - 17, lerp(47.5, 46, f), D, 26))
    }
    tie(ts, fr)
  }
  // West and East: the great trusses, the tallest at the south ends where the roofs are cut off.
  for (const [y, sgn] of [[YW, -1], [YE, 1]] as [number, number][]) {
    const D = sgn < 0 ? 61.9 : 60.0
    const rz = (d: number) => roofTop(37.5, 34, -1.5, D, d)
    const xs = detail ? [-26, -14, -2, 10, 22, 35, 48.5] : [-26, -2, 22, 48.5]
    const ts = xs.map((x) => cantilever({ o: [x, y, 0], n: [0, sgn, 0] }, rz, -1.5, 37.5, D - 15, x > 40 ? 49 : 46, D, 21, [-26, -2, 22, 48.5].includes(x)))
    tie(ts, fr)
    // the cut end at the south corner: a raking leg from the end truss's peak down to the corner
    const e = ts[ts.length - 1]
    rod(white, e.peak, [XS + 1.5, y + sgn * (D - 6), 17.5], r * 1.2, RS)
    rod(white, e.peak, [XS + 1.5, y + sgn * 4, 20.5], r * 1.0, RS)
  }
  // South: a light truss along the roof, short radial trusses.
  {
    const rz = (d: number) => roofTop(19.5, 16.5, -1.5, 48.7, d)
    const tops: V3[] = [], bots: V3[] = []
    const ys = detail ? [-56, -42, -28, -14, 0, 14, 28, 42, 56] : [-56, -28, 0, 28, 56]
    for (const y of ys) {
      const s: St = { o: [XS, y, 0], n: [1, 0, 0] }
      tops.push(at(s, 26, 24)); bots.push(at(s, 26, rz(26) + 0.3))
      rod(white, at(s, 26, 24), at(s, -1.5, 19.9), r * 0.8, RS)
      rod(white, at(s, 26, 24), at(s, 46, rz(46) + 0.3), r * 0.8, RS)
    }
    truss(white, tops, bots, r * 0.8, RS)
  }

  return [
    { part: red, material: M.red },
    { part: grey, material: M.grey },
    { part: white, material: M.white },
    { part: roof, material: M.roof },
    { part: glass, material: M.glass },
    { part: lamp, material: M.lamp },
  ]
}

if (import.meta.main) {
  writeLods('Old Trafford', [
    { file: `${ID}.glb`, parts: build(false) },
    { file: `${ID}.detail.glb`, parts: build(true) },
  ])
}
