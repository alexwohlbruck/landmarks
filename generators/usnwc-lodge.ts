/**
 * U.S. National Whitewater Center, main building — procedural, CC0-1.0.
 * bun generators/usnwc-lodge.ts
 *
 * Map frame: x east, y north, z up, metres; placed at bearing 0. The origin is
 * the area centroid of the OSM outline (way/223914934), and the footprint
 * below is that outline's 44 vertices in metres from it.
 *
 * The building sits on the east bank of the competition channel. Seen from
 * the channel (Commons "USNWC River Center") it is three masses under one
 * gesture:
 * - the south block: a cream concrete ground floor (Guest Services) under two
 *   storeys of orange cedar-look cladding with tall punched windows;
 * - the north wing: two storeys of the same cladding, lower, its upper floor
 *   broken into bays under shallow silver eaves, the restaurant terrace at
 *   its foot;
 * - between them a board-formed concrete stair core and a glazed hall, under
 *   a long, thin, nearly flat canopy roof held over the plaza on tall slender
 *   steel columns.
 *
 * Rework (2026-10), massing changes and their evidence:
 * - Heights from USGS 3DEP lidar (2016, Mecklenburg County), above the
 *   lowest ground under the footprint (the west plaza; the east side is a
 *   bank about 4 m higher): north wing 11.8 m (was 11), the middle 12 m (was
 *   14.5), the south block 12 m for 14 m south-west of the canopy and 10.3 m
 *   at its Guest Services end (was 13 throughout).
 * - The canopy: lidar reads a strip 8 m wide and about 37 m long at a bearing
 *   of 121.7°, 14 m at its north-east edge and 13 m at its south-west edge,
 *   reaching out over the plaza at its north-west end; the NAIP aerial shows
 *   the same pale strip. The earlier canopy ran the other way (at 30°) over
 *   the whole south block and stood 15.4 to 19.4 m, which lidar rules out.
 * - The concrete stair core moved from (-10.8, -4.2), where lidar reads a
 *   12 m roof, to the bay jutting from the south block's plaza front at its
 *   north-west end, under the canopy, as the River Center photo shows it; it
 *   now stops just under the canopy (12.7 m, was 16.6).
 * - Colour: the cladding is a more orange cedar, from the evening and
 *   daylight photos, pulled to palette lightness.
 *
 * Photos: Commons "USNWC River Center.jpg" and "Featured Photo of the
 * USNWC.jpg" (US National Whitewater Center, CC BY-SA 4.0), "US National
 * Whitewater Center.jpg" (Doug Letterman, CC BY 2.0), "Charlotte Whitewater
 * 03.jpg" (HowardMorland, public domain), "US National Whitewater Center (10
 * March 2007).jpg" (Dunnce, public domain).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const cedar = new Part(), concrete = new Part(), roof = new Part(), win = new Part(), trim = new Part()

// OSM way/223914934, metres from its centroid. OSM winds it clockwise.
const FP: XY[] = [
  [1.4, 32.7], [30.7, 23.1], [26.7, 11.3], [32.1, 9.5], [27.8, -2.9], [29.1, -3.4], [28.6, -8.5], [9.2, -6.7],
  [8.2, -9.1], [6.5, -20.8], [6.2, -22.5], [4.6, -25.2], [2.6, -28.4], [0.6, -27.3], [-3.1, -25.3], [-3.8, -30.7],
  [-11.9, -43.5], [-20.2, -39.5], [-31.6, -32.1], [-20.7, -13.5], [-25.9, -10.3], [-21.8, -3.6], [-10.7, -10.6],
  [-9.7, -8.9], [-11.6, -6.7], [-11.6, -4.3], [-10.2, -2.1], [-8.4, -0.7], [-7.5, 1.1], [-14.2, 3.0], [-12.4, 9.0],
  [-15.5, 10.5], [-14.5, 13.6], [-16.7, 14.1], [-16.2, 17.0], [-17.2, 17.3], [-15.5, 20.4], [-14.2, 31.7],
  [-13.8, 35.4], [-11.6, 37.8], [-6.1, 37.3], [-1.7, 36.8], [-2.5, 29.8], [0.2, 28.8],
]
/** A block from outline indices, turned counter-clockwise. */
const block = (idx: number[]): XY[] => idx.map((i) => FP[i]).reverse()
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, k) => a + k)

const NORTH = block([...range(0, 7), ...range(28, 43)])
const MIDDLE = block([...range(7, 14), ...range(22, 28)])
const SOUTH = block(range(14, 22))

// The canopy's high (north-east) edge, from lidar: a straight line at a
// bearing of 121.7° through these two points. `perp` is the distance from it,
// negative to the south-west.
const EDGE_A: XY = [-23, -4.4], EDGE_B: XY = [8.5, -23.8]
const EDGE_U: XY = (() => { const l = Math.hypot(EDGE_B[0] - EDGE_A[0], EDGE_B[1] - EDGE_A[1]); return [(EDGE_B[0] - EDGE_A[0]) / l, (EDGE_B[1] - EDGE_A[1]) / l] })()
const SW: XY = [-0.525, -0.851] // the unit normal to that edge, south-west
const perp = (p: XY) => (p[0] - EDGE_A[0]) * SW[0] * -1 + (p[1] - EDGE_A[1]) * SW[1] * -1
/** Clip a ring to the side of a line where f >= 0 (f linear). */
function clip(ring: XY[], f: (p: XY) => number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], fa = f(a), fb = f(b)
    if (fa >= 0) out.push(a)
    if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]) }
  }
  return out
}
// Lidar: the south block's roof is 12 m for about 14 m south-west of the
// canopy's high edge and 10.3 m beyond (Guest Services' end).
const SPLIT = -14
const SOUTH_N = clip(SOUTH, (p) => perp(p) - SPLIT)
const SOUTH_S = clip(SOUTH, (p) => SPLIT - perp(p))

// ---------------------------------------------------------------------------
// Geometry helpers.

const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n?: V3) {
  const N = n ? [n, n, n] : undefined
  p.tri(a, b, c, undefined, undefined, undefined, N)
  p.tri(a, c, d, undefined, undefined, undefined, N)
}

/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
function earcut(pts: XY[]): [number, number, number][] {
  const idx = pts.map((_, i) => i), out: [number, number, number][] = []
  const cz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cz(a, b, p) > 0 && cz(b, c, p) > 0 && cz(c, a, p) > 0
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      if (cz(pts[i0], pts[i1], pts[i2]) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(pts[j], pts[i0], pts[i1], pts[i2]))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** Move every edge of a counter-clockwise ring inward by d (mitred). */
function inset(pts: XY[], d: number): XY[] {
  const n = pts.length
  return pts.map((p, i) => {
    const a = pts[(i + n - 1) % n], b = pts[(i + 1) % n]
    const e0 = unit([p[0] - a[0], p[1] - a[1], 0]), e1 = unit([b[0] - p[0], b[1] - p[1], 0])
    const n0: XY = [-e0[1], e0[0]], n1: XY = [-e1[1], e1[0]] // inward normals
    const m = unit([n0[0] + n1[0], n0[1] + n1[1], 0]), k = d / Math.max(0.5, m[0] * n0[0] + m[1] * n0[1])
    return [p[0] + m[0] * k, p[1] + m[1] * k]
  })
}

/** A point `u` along bearing `ang` and `v` to its right, from `c`. */
const frame = (c: XY, ang: number, u: number, v: number): XY =>
  [c[0] + Math.sin(ang) * u + Math.cos(ang) * v, c[1] + Math.cos(ang) * u - Math.sin(ang) * v]
const rect = (c: XY, ang: number, hu: number, hv: number): XY[] =>
  [frame(c, ang, -hu, -hv), frame(c, ang, -hu, hv), frame(c, ang, hu, hv), frame(c, ang, hu, -hv)]

type Z = (p: XY) => number
const flat = (z: number): Z => () => z

/**
 * A prism over a counter-clockwise ring from z0 up to a (possibly sloping)
 * top, with a 45° bevel of `b` round the top edge and the lid in `lid`.
 */
function prism(p: Part, ring: XY[], bottom: number | Z, top: Z, b: number, lid: Part | null = p, bottomLid: Part | null = null) {
  const n = ring.length, inner = b > 0 ? inset(ring, b) : ring
  const zb: Z = typeof bottom === 'number' ? flat(bottom) : bottom
  for (let i = 0; i < n; i++) {
    const A = ring[i], B = ring[(i + 1) % n]
    const out = unit([B[1] - A[1], A[0] - B[0], 0])
    quadN(p, [A[0], A[1], zb(A)], [B[0], B[1], zb(B)], [B[0], B[1], top(B) - b], [A[0], A[1], top(A) - b], out)
    if (b > 0) {
      const a2 = inner[i], b2 = inner[(i + 1) % n]
      quadN(p, [A[0], A[1], top(A) - b], [B[0], B[1], top(B) - b], [b2[0], b2[1], top(b2)], [a2[0], a2[1], top(a2)], unit([out[0], out[1], 1]))
    }
  }
  if (lid) for (const [i, j, k] of earcut(inner)) {
    const P = (q: XY): V3 => [q[0], q[1], top(q)]
    lid.tri(P(inner[i]), P(inner[j]), P(inner[k]))
  }
  if (bottomLid) for (const [i, j, k] of earcut(ring)) {
    const P = (q: XY): V3 => [q[0], q[1], zb(q)]
    bottomLid.tri(P(ring[i]), P(ring[k]), P(ring[j]))
  }
}

/**
 * Window panels on wall edge A→B of a counter-clockwise ring, 0.05 m proud:
 * `count` windows of width `w` spread evenly, each from z0 to z1.
 */
function windows(A: XY, B: XY, count: number, w: number, z0: number, z1: number, mat = win, margin = 1.2) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1])
  if (L < w + 2 * margin) return
  const u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], n: V3 = [u[1], -u[0], 0]
  const step = (L - 2 * margin) / count
  for (let k = 0; k < count; k++) {
    const c = margin + step * (k + 0.5), s0 = c - w / 2, s1 = c + w / 2
    const P = (s: number, z: number): V3 => [A[0] + u[0] * s + n[0] * 0.05, A[1] + u[1] * s + n[1] * 0.05, z]
    quadN(mat, P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1), n)
  }
}
/** Punched windows on every exposed edge of a block, skipping shared walls. */
function punch(ring: XY[], rows: [number, number][], skip: (a: XY, b: XY) => boolean, pitch = 5, w = 1.5) {
  for (let i = 0; i < ring.length; i++) {
    const A = ring[i], B = ring[(i + 1) % ring.length]
    if (skip(A, B)) continue
    const L = Math.hypot(B[0] - A[0], B[1] - A[1])
    const count = Math.floor((L - 1.5) / pitch)
    if (count < 1) continue
    for (const [z0, z1] of rows) windows(A, B, count, w, z0, z1)
  }
}
const same = (p: XY, q: XY) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 0.01
const shared = (pairs: [XY, XY][]) => (a: XY, b: XY) => pairs.some(([p, q]) => (same(a, p) && same(b, q)) || (same(a, q) && same(b, p)))
const SHARED = shared([[FP[7], FP[28]], [FP[14], FP[22]]])
// The south block's walls between the core and the glazed hall: kept clear
// for the tall glazing.
const nearCore = (a: XY, b: XY) => SHARED(a, b) || [a, b].every((p) => p[0] > -12.5 && p[0] < -7 && p[1] > -11 && p[1] < 1.5)

// ---------------------------------------------------------------------------
// Masses.

// Heights from USGS 3DEP lidar (2016), above the lowest ground under the
// footprint (the west plaza side; the east side is a bank about 4 m higher).
const H_SOUTH = 10.3, H_SOUTH_N = 12.0, H_MID = 12.0, H_NORTH = 11.8, BASE = 4.2

// South block: concrete ground floor, cedar above, parapet bevel, pale roof.
prism(concrete, SOUTH, 0, flat(BASE), 0, null)
prism(cedar, SOUTH_S, BASE, flat(H_SOUTH), 0.45, roof)
prism(cedar, SOUTH_N, BASE, flat(H_SOUTH_N), 0.45, roof)
// Upper-floor windows — tall single panes, as the photos show — and glazed
// shopfronts in the concrete base.
const notSplit = (a: XY, b: XY) => SHARED(a, b) || (Math.abs(perp(a) - SPLIT) < 0.05 && Math.abs(perp(b) - SPLIT) < 0.05)
punch(SOUTH_S, [[5.6, 9.0]], notSplit, 4.6, 1.4)
punch(SOUTH_N, [[5.6, 9.6]], notSplit, 4.6, 1.4)
punch(SOUTH, [[0.9, 3.3]], SHARED, 7, 3.2)

// The middle: the glazed hall between core and south block.
prism(cedar, MIDDLE, 0, flat(H_MID), 0.45, roof)
punch(MIDDLE, [[1.0, 3.6], [6.0, 10.4]], nearCore, 5, 1.5)
// The tall curtain wall of the hall, facing the plaza beside the core (photo:
// the glazed strip right of the concrete tower).
{
  const A = FP[21], B = FP[22] // south block's north-west face toward the core
  // CCW order runs B→A for this face (outline is clockwise).
  windows(B, A, 2, 3.2, 4.8, 10.8)
}

// North wing: a ground floor and a first floor of bays along the plaza front,
// each bay under its own low hipped silver roof, with the upper mass of the
// wing set back behind them and rising to the parapet (photo: left half).
const H_BAYS = 7.6
prism(cedar, NORTH, 0, flat(H_BAYS), 0.3, roof)
// The upper mass: the wing's outline with its jagged plaza front replaced by a
// straight wall about 3 m behind the bays.
const UP_WEST: Record<number, XY> = { [-1]: [-4.0, 0.2], [-2]: [-10.0, 4.6], [-3]: [-10.6, 32.6], [-4]: [-6.4, 33.6] }
const extra2 = (i: number) => UP_WEST[i]
const NORTH_UP = [0, 1, 2, 3, 4, 5, 6, 7, -1, -2, -3, -4, 42, 43].map((i) => (i < 0 ? UP_WEST[i] : FP[i])).reverse()
prism(cedar, NORTH_UP, H_BAYS - 0.3, flat(H_NORTH), 0.45, roof)
{
  const west = (a: XY, b: XY) => SHARED(a, b) || (a[0] < -11 && b[0] < -11 && a[1] > 2 && b[1] > 2 && a[1] < 36 && b[1] < 36)
  punch(NORTH, [[1.0, 3.8], [4.7, 6.9]], west, 5, 1.6)
  // Clerestory windows in the set-back upper wall, over the bay roofs.
  windows(extra2(-3), extra2(-2), 5, 2.4, 8.7, 10.2)
  // West front: shopfront glazing on the terrace, a wide window in each bay
  // above, and the bay's hipped roof.
  for (const [i, j] of [[29, 30], [32, 33], [34, 35], [36, 37]] as [number, number][]) {
    const A = FP[j], B = FP[i] // the ring is the outline reversed, so j→i runs counter-clockwise
    const L = Math.hypot(B[0] - A[0], B[1] - A[1])
    if (L < 2.5) continue
    windows(A, B, 1, Math.min(L - 1.2, 4.5), 1.0, 3.8, win, 0.6)
    if (L > 4) windows(A, B, 1, Math.min(L - 1.6, 4.0), 4.6, 6.9, win, 0.6)
    const u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], n: XY = [u[1], -u[0]]
    // From 0.7 m out over the wall to 3 m back, rising 2.1 m to a ridge.
    const o = 0.7, back = 3.0, e = 0.4
    const P = (s: number, d: number): XY => [A[0] + u[0] * s + n[0] * d, A[1] + u[1] * s + n[1] * d]
    const base: XY[] = [P(-e, o), P(-e, -back), P(L + e, -back), P(L + e, o)].reverse()
    const ridge: XY[] = [P(1.0, -1.2), P(1.0, -back), P(L - 1.0, -back), P(L - 1.0, -1.2)].reverse()
    const z0 = H_BAYS - 0.2, z1 = H_BAYS + 1.9
    const b3 = base.map((q): V3 => [q[0], q[1], z0]), r3 = ridge.map((q): V3 => [q[0], q[1], z1])
    roof.loft([b3, r3])
    roof.cap(r3, true)
    trim.cap(b3, false)
  }
}
// Rooftop plant on the south block, east of the canopy (Featured photo).
prism(concrete, rect([-14.6, -36.2], (30 * Math.PI) / 180, 1.8, 3.6), H_SOUTH - 0.5, flat(H_SOUTH + 1.4), 0.25, roof)
// Rooftop plant on the north wing, low and set back, as seen over the parapet.
prism(concrete, [[8, 8], [18, 5], [20, 11], [10, 14]], H_NORTH - 0.5, flat(H_NORTH + 1.6), 0.25, roof)

// The canopy: one long, thin, nearly flat roof between the north wing and
// the south block, its high edge to the north-east (lidar 14 m) falling to
// 13 m at its south-west edge, which reaches out over the plaza at its north-
// west end on tall slender steel columns. Lidar and the NAIP aerial both show
// it as a strip 8 m wide and 37 m long at 121.7°; the earlier model had it
// running the other way, over the whole south block, and 4 to 5 m too high.
const CAN_W = 8, CAN_T = 0.7
const canTop: Z = (p) => 14 - Math.min(CAN_W, Math.max(0, -perp(p))) / CAN_W
{
  const ring: XY[] = [EDGE_A, [EDGE_A[0] + SW[0] * CAN_W, EDGE_A[1] + SW[1] * CAN_W], [EDGE_B[0] + SW[0] * CAN_W, EDGE_B[1] + SW[1] * CAN_W], EDGE_B]
  prism(trim, ring, (p) => canTop(p) - CAN_T, canTop, 0.3, roof, roof)
  // Columns in front of the core and the hall, along the south-west edge.
  for (const along of [1.5, 8, 14.5]) {
    const c: XY = [EDGE_A[0] + EDGE_U[0] * along + SW[0] * (CAN_W - 0.8), EDGE_A[1] + EDGE_U[1] * along + SW[1] * (CAN_W - 0.8)]
    prism(roof, rect(c, (121.7 * Math.PI) / 180, 0.3, 0.3), 0, (p) => canTop(p) - CAN_T, 0, null)
  }
}

// The stair core: board-formed concrete, the bay that juts from the south
// block's plaza front at its north-west end (OSM outline nodes 19-21), under
// the canopy, which passes over it with its columns in front (photo). The
// earlier model stood it 16.6 m tall at (-10.8, -4.2), where lidar reads a
// 12 m roof and nothing taller, so it was moved to the bay and brought just
// under the canopy.
prism(concrete, rect([-21.45, -8.4], (31.5 * Math.PI) / 180, 4.1, 3.2), 0, flat(12.7), 0.35)

// ---------------------------------------------------------------------------

// Colours from the daylight photos. The cladding is a warm cedar orange,
// pulled to the palette's lightness; concrete is the palette stone; roofs,
// canopy and columns the palette roof grey; eaves and fascias trim.
const parts = [
  { part: cedar, material: finish('usnwc-cedar', 0xdc8a58) },
  { part: concrete, material: PALETTE.stone },
  { part: roof, material: PALETTE.roof },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
]
const triangles = parts.reduce((sum, { part }) => sum + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('U.S. National Whitewater Center', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 14,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/usnwc-lodge.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
