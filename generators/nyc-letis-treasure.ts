/**
 * Leti's Treasure (the "Super Flume"; Zamperla log flume, 2023), Luna Park,
 * Coney Island: procedural, CC0-1.0.
 * bun generators/nyc-letis-treasure.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Coordinates are in
 * the park frame shared with the Cyclone, the Thunderbolt and Tony's
 * Express: metres east and north of lon -73.9778, lat 40.575. The model's
 * origin is the middle of the flume's footprint (ANCHOR), on the ground.
 * Luna Park is level beach fill here, so the ground is flat.
 *
 * Sources. Wikipedia "Luna Park, Coney Island (2010)": a 40-foot (12 m) log
 * flume called the Super Flume, built with the family coaster on the lot by
 * the Thunderbolt and named Leti's Treasure in 2022 (OSM still has "Super
 * Flume"). Plan: the two OSM `attraction=water_slide` ways (way/1483353309,
 * way/1483353310) and the station roof way/1483353311, checked against the
 * New York State orthoimagery of spring 2024 (NYS ITS GIS program, public):
 * the pale aqua troughs, the meander north of the station, the two loops by
 * the boardwalk, and the teal roofs sit on the trace. The entrance gate on
 * the boardwalk is from the photos.
 *
 * The ride as modelled, along the OSM circuit read against its drawn
 * direction (s from the south end of the station; heights of the trough
 * floor):
 *   station, east block of the roof, 0.3 m; the south-east loop at grade
 *   the lift, up the east straight to the published 12.2 m (s 40-94)
 *   the top turn at the north end, 12.2 m
 *   down the long straight south: a chute falling to 8.5 m, carried over
 *     the coaster's station, then the big drop round the start of the
 *     south-west loop (s 178-194)
 *   at grade round the south-west loop, north up the west side, round the
 *     north end and back down the meander into the station
 * Reading the ways in their drawn direction instead would put a lift up the
 * long straight through Tony's Express's station at grade, and the second
 * one under its lift; this order is the one that keeps the two rides apart.
 * Every height but the 12.2 m top is estimated.
 * Heights are above the map's ground (Mapterhorn, GRID): the troughs at
 * grade sit on it, the station on the park's level (GRADE) and the gate on
 * the boardwalk's, about 0.8 m higher.
 *
 * The station: two gabled teal roofs on maroon posts with a maroon frieze
 * (the Victorian station in the photos), over the parts of way/1483353311
 * that Tony's Express doesn't draw (its west wing is the coaster's
 * station). The gate: two white towers under teal pyramids, a pale gold arch
 * between them, three red starburst wheels and the maroon sign band
 * ("LETI'S TREASURE & TONY'S EXPRESS", drawn as a plain band: it is not a
 * landmark sign).
 *
 * Lidar (USGS NY_NewYorkCity, 2017) predates the ride and isn't used.
 *
 * Photos (EVIDENCE):
 *   "Coney Island Brooklyn July 2024 031", "032", "033", "035", "041",
 *     Kidfly182, Wikimedia Commons, CC BY 4.0 (the gate, the station roof
 *     and frame, the troughs at grade)
 *   "Luna Park" (flickr 53159273620), Roller Coaster Philosophy, CC BY 2.0
 *     (2023, the troughs and the station from the south-west)
 * Look-only: none.
 *
 * Style: the troughs are broad open U channels in the photos' pale aqua,
 * drawn a little wider than the real ones, on dark-teal posts where they are
 * raised; the lift has a dark belt. The gate's wheels are `neon` red: they
 * are lined with bulbs that are lit at night.
 *
 * Doubts: the direction of travel (above); where the lift and the big drop
 * are along the circuit; heights of the chute; the gate's exact place on
 * the boardwalk.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const LON0 = -73.9778, LAT0 = 40.575
const MX = 111320 * Math.cos((LAT0 * Math.PI) / 180), MY = 110574
const ANCHOR: [number, number] = [-399, -183]

// The OSM circuit (way/1483353310 then way/1483353309, read backwards), from
// the south end of the station heading south.
const CHAIN: [number, number][] = [
  [-391.3, -203.6], [-391.1, -206.7], [-391.7, -209.5], [-392.5, -211.5], [-392.6, -213.7], [-392.1, -215.7], [-390.7, -217.5],
  [-388.7, -219.2], [-386.3, -219.9], [-383.6, -219.8], [-381.0, -218.7], [-379.2, -217.0], [-378.1, -215.3], [-377.6, -213.1],
  [-377.8, -210.3], [-378.8, -206.6], [-386.1, -149.8], [-386.8, -145.7], [-388.8, -142.8], [-391.7, -141.1], [-395.5, -141.0],
  [-398.2, -142.3], [-401.1, -145.9], [-411.8, -203.2], [-411.7, -206.0], [-410.8, -208.3], [-409.3, -210.0], [-407.8, -211.7],
  [-406.5, -213.8], [-406.2, -216.0], [-406.3, -219.6], [-407.1, -221.4], [-408.7, -222.8], [-411.1, -223.8], [-413.9, -224.2],
  [-416.6, -223.5], [-418.7, -221.9], [-419.8, -219.8], [-420.5, -217.6], [-420.2, -214.0], [-419.2, -208.2], [-409.4, -153.8],
  [-409.0, -151.3], [-409.2, -150.2], [-409.1, -149.2], [-408.7, -148.1], [-408.0, -146.7], [-407.0, -145.5], [-405.8, -144.6],
  [-404.4, -143.6], [-403.1, -143.0], [-401.7, -143.0], [-400.2, -143.1], [-398.9, -143.8], [-397.5, -144.7], [-396.5, -145.6],
  [-395.7, -146.6], [-394.6, -148.4], [-394.3, -150.3], [-394.4, -151.9], [-394.8, -153.7], [-395.2, -155.9], [-394.6, -157.9],
  [-394.1, -159.1], [-393.2, -161.1], [-392.7, -163.1], [-392.6, -164.8], [-393.3, -166.7], [-394.0, -168.1], [-395.2, -169.8],
  [-395.7, -170.9], [-396.0, -172.1], [-396.1, -173.5], [-395.9, -174.9], [-395.5, -177.8],
]
// Trough floor height by polyline s (see the header), eased between keys.
const PROFILE: [number, number][] = [
  [0, 0.25], [40, 0.25], [94, 12.2], [132, 12.2], [150, 8.5], [178, 8.5], [194, 0.25], [400, 0.25],
]
const LIFT: [number, number] = [40, 94]

// The map's ground (Mapterhorn, `bun tools/terrain.ts grid -73.9825189
// 40.573345 45 5`): metres above the lowest point under the model, rows
// north to south (z -45..45 m, south +), columns west to east (x -45..45 m),
// every 5 m, in the model frame. The park reads about 1.5 m over pits in
// the DEM by the Thunderbolt; the troughs at grade sit on this ground, and
// the raised ones and the buildings are measured from it too.
const GRID: number[][] = [
  [1.6, 1.5, 1.4, 1.3, 1.5, 1.4, 1.4, 1.4, 1.2, 1.0, 1.6, 2.5, 2.2, 0.2, 0.0, 0.0, 1.6, 1.5, 1.7],
  [1.7, 1.5, 1.4, 1.4, 1.5, 1.4, 1.4, 1.4, 1.2, 1.0, 1.9, 2.3, 2.0, 0.3, 0.1, 0.8, 1.6, 1.5, 1.6],
  [1.7, 1.5, 1.4, 1.5, 1.5, 1.5, 1.3, 1.4, 1.4, 1.2, 1.4, 1.7, 1.8, 0.5, 0.4, 0.4, 1.1, 1.5, 1.6],
  [1.5, 1.5, 1.5, 1.5, 1.5, 1.6, 1.5, 1.4, 1.6, 1.3, 1.1, 1.5, 2.1, 0.5, 0.4, 0.4, 1.0, 1.4, 1.5],
  [1.5, 1.5, 1.5, 1.5, 1.5, 1.6, 1.5, 1.4, 1.6, 1.4, 1.2, 1.3, 1.7, 0.6, 0.4, 0.4, 0.8, 1.4, 1.5],
  [1.5, 1.5, 1.6, 1.5, 1.6, 1.5, 1.5, 1.4, 1.4, 1.3, 1.3, 1.4, 1.8, 0.9, 0.4, 0.4, 0.6, 1.4, 1.5],
  [1.4, 1.4, 1.5, 1.5, 1.6, 1.5, 1.5, 1.4, 1.4, 1.3, 1.1, 1.6, 2.2, 1.4, 0.5, 0.5, 0.5, 1.5, 1.4],
  [1.4, 1.4, 1.5, 1.5, 1.5, 1.6, 1.6, 1.4, 1.4, 1.3, 1.1, 1.4, 1.9, 1.4, 0.5, 0.5, 0.5, 1.4, 1.3],
  [1.4, 1.3, 1.4, 1.5, 1.5, 1.6, 1.6, 1.4, 1.3, 1.2, 1.4, 1.7, 1.7, 1.5, 0.5, 0.6, 1.0, 1.4, 1.3],
  [1.4, 1.3, 1.4, 1.5, 1.5, 1.6, 1.6, 1.4, 1.4, 1.3, 2.2, 1.7, 1.8, 1.6, 1.4, 1.4, 1.4, 1.6, 1.3],
  [1.4, 1.4, 1.4, 1.5, 1.4, 1.5, 1.5, 1.3, 1.5, 1.4, 1.6, 1.3, 1.3, 1.6, 1.5, 1.4, 1.4, 1.8, 1.3],
  [1.4, 1.4, 1.5, 1.4, 1.5, 1.5, 1.5, 1.5, 1.5, 1.6, 1.3, 1.3, 1.3, 1.1, 0.9, 0.6, 0.5, 1.2, 1.3],
  [1.6, 1.6, 1.5, 1.5, 1.5, 1.5, 1.6, 1.5, 1.5, 1.5, 1.4, 1.4, 1.5, 1.3, 0.3, 0.4, 0.4, 0.6, 1.3],
  [2.2, 1.8, 1.5, 1.6, 1.5, 1.5, 1.8, 1.9, 1.8, 1.7, 1.2, 1.4, 1.5, 1.3, 0.4, 0.4, 0.4, 0.6, 1.6],
  [3.0, 2.1, 1.5, 1.5, 1.5, 1.5, 1.9, 2.0, 1.9, 1.6, 1.1, 1.5, 1.6, 1.4, 0.9, 0.3, 0.3, 0.4, 2.2],
  [3.1, 2.4, 1.5, 1.5, 1.4, 1.5, 1.9, 2.0, 1.8, 1.5, 1.2, 1.1, 1.3, 1.3, 1.0, 0.3, 0.3, 0.3, 2.8],
  [3.1, 2.7, 1.8, 1.5, 1.4, 1.5, 2.1, 2.2, 1.9, 1.7, 1.5, 1.6, 1.6, 1.6, 1.5, 0.4, 0.4, 0.4, 1.0],
  [3.1, 2.9, 2.1, 1.5, 1.9, 2.0, 2.3, 2.4, 2.3, 2.4, 2.4, 2.5, 2.5, 2.4, 1.6, 0.9, 1.1, 0.8, 1.1],
  [3.1, 3.1, 2.6, 1.4, 2.1, 2.3, 2.2, 2.5, 2.7, 2.6, 2.6, 2.6, 2.6, 2.6, 1.9, 1.4, 1.6, 1.3, 1.5],
]
function ground(x: number, y: number) {
  const fx = Math.max(0, Math.min((x + 45) / 5, 17.999)), fz = Math.max(0, Math.min((-y + 45) / 5, 17.999))
  const i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j
  return (GRID[j][i] * (1 - u) + GRID[j][i + 1] * u) * (1 - v) + (GRID[j + 1][i] * (1 - u) + GRID[j + 1][i + 1] * u) * v
}
/** The ground the station and gate stand on: the park's level. */
const GRADE = 1.5

const AQUA = 0x76c7cb, TEAL_ROOF = 0x63b3a6, MAROON = 0x8a4b4b, TEAL_DARK = 0x2f6a66, RED = 0xd85a4a

const trough = new Part(), posts = new Part(), roof = new Part(), maroon = new Part(), white = new Part(), wheels = new Part()
const M = (x: number, y: number, z: number): V3 => [x - ANCHOR[0], y - ANCHOR[1], z]

// ------------------------------------------------------------- helpers ----
function tube(p: Part, a: V3, b: V3, r: number, sides = 4) {
  const ax = sub(b, a), L = Math.hypot(...ax), n: V3 = [ax[0] / L, ax[1] / L, ax[2] / L]
  const ref: V3 = Math.abs(n[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  let u = cross(n, ref); const ul = Math.hypot(...u); u = [u[0] / ul, u[1] / ul, u[2] / ul]
  const v = cross(n, u)
  const ring = (c: V3, k: number): [V3, V3] => {
    const t = (k / sides) * 2 * Math.PI + Math.PI / sides, d: V3 = [u[0] * Math.cos(t) + v[0] * Math.sin(t), u[1] * Math.cos(t) + v[1] * Math.sin(t), u[2] * Math.cos(t) + v[2] * Math.sin(t)]
    return [[c[0] + d[0] * r, c[1] + d[1] * r, c[2] + d[2] * r], d]
  }
  for (let k = 0; k < sides; k++) {
    const [a0, n0] = ring(a, k), [a1, n1] = ring(a, k + 1), [b0] = ring(b, k), [b1] = ring(b, k + 1)
    p.tri(a0, a1, b1, undefined, undefined, undefined, [n0, n1, n1])
    p.tri(a0, b1, b0, undefined, undefined, undefined, [n0, n1, n0])
  }
}
/** A box with its long axis along plan direction (ux, uy), centred at c, half sizes [along, across, up]. */
function box(p: Part, c: V3, ux: number, uy: number, h: [number, number, number]) {
  const A: V3 = [ux * h[0], uy * h[0], 0], C: V3 = [-uy * h[1], ux * h[1], 0], Z: V3 = [0, 0, h[2]]
  const P = (i: number, j: number, k: number): V3 => [c[0] + A[0] * i + C[0] * j + Z[0] * k, c[1] + A[1] * i + C[1] * j + Z[1] * k, c[2] + A[2] * i + C[2] * j + Z[2] * k]
  const f = (a: V3, b: V3, cc: V3, d: V3) => { p.tri(a, b, cc); p.tri(a, cc, d) }
  f(P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1))
  f(P(-1, -1, -1), P(-1, 1, -1), P(1, 1, -1), P(1, -1, -1))
  f(P(1, -1, -1), P(1, 1, -1), P(1, 1, 1), P(1, -1, 1))
  f(P(-1, -1, -1), P(-1, -1, 1), P(-1, 1, 1), P(-1, 1, -1))
  f(P(-1, 1, -1), P(-1, 1, 1), P(1, 1, 1), P(1, 1, -1))
  f(P(-1, -1, -1), P(1, -1, -1), P(1, -1, 1), P(-1, -1, 1))
}

// ---------------------------------------------------------------- plan ----
const pts = CHAIN.map(([x, y]) => [x - ANCHOR[0], y - ANCHOR[1]] as [number, number])
const n = pts.length
const polyS = [0]
for (let i = 1; i <= n; i++) polyS.push(polyS[i - 1] + Math.hypot(pts[i % n][0] - pts[i - 1][0], pts[i % n][1] - pts[i - 1][1]))
const POLY = polyS[n]
// Dense centripetal Catmull-Rom through the nodes (closed), every ~0.5 m,
// carrying the polyline s through each span.
const dense: { x: number; y: number; ps: number }[] = []
for (let i = 0; i < n; i++) {
  const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n]
  const d = (a: number[], b: number[]) => Math.max(Math.hypot(a[0] - b[0], a[1] - b[1]) ** 0.5, 1e-3)
  const t0 = 0, t1 = t0 + d(p0, p1), t2 = t1 + d(p1, p2), t3 = t2 + d(p2, p3)
  const SUB = Math.max(4, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 0.5))
  for (let k = 0; k < SUB; k++) {
    const t = t1 + ((t2 - t1) * k) / SUB
    const L = (a: number[], b: number[], ta: number, tb: number) => [0, 1].map((c) => ((tb - t) * a[c] + (t - ta) * b[c]) / (tb - ta))
    const A1 = L(p0, p1, t0, t1), A2 = L(p1, p2, t1, t2), A3 = L(p2, p3, t2, t3)
    const C = L(L(A1, A2, t0, t2), L(A2, A3, t1, t3), t1, t2)
    dense.push({ x: C[0], y: C[1], ps: polyS[i] + ((polyS[i + 1] - polyS[i]) * k) / SUB })
  }
}
const ease = (t: number) => t * t * (3 - 2 * t)
function floorZ(ps: number) {
  for (let i = 0; i + 1 < PROFILE.length; i++) {
    const [s0, z0] = PROFILE[i], [s1, z1] = PROFILE[i + 1]
    if (ps >= s0 && ps <= s1) return z0 + (z1 - z0) * ease((ps - s0) / (s1 - s0))
  }
  return PROFILE[0][1]
}
// Ground under the path, smoothed over ±6 m so raised troughs don't follow
// the DEM's bumps; at grade the floor sits 0.25 m over the larger of it and
// the raw ground under the trough.
const gRaw = dense.map((q) => ground(q.x, q.y))
const gSmooth = gRaw.map((_, i) => {
  let s = 0, k = 0
  for (let d = -12; d <= 12; d++) { s += gRaw[(i + d + gRaw.length) % gRaw.length]; k++ }
  return s / k
})
const path: V3[] = dense.map((q, i) => [q.x, q.y, floorZ(q.ps) + Math.max(gSmooth[i], gRaw[i] - 0.1)])
// Keep a section wherever the heading or pitch has turned 8° since the last
// one kept, or every 6 m.
const keep: number[] = [0]
{
  const dir = (i: number) => { const a = path[i], b = path[(i + 1) % path.length]; return [Math.atan2(b[1] - a[1], b[0] - a[0]), Math.atan2(b[2] - a[2], Math.hypot(b[0] - a[0], b[1] - a[1]))] }
  let [h0, p0] = dir(0), run = 0
  for (let i = 1; i < path.length; i++) {
    const [h, p] = dir(i)
    let dh = Math.abs(h - h0); if (dh > Math.PI) dh = 2 * Math.PI - dh
    run += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1])
    if (dh > (8 * Math.PI) / 180 || Math.abs(p - p0) > (4 * Math.PI) / 180 || run > 6) { keep.push(i); h0 = h; p0 = p; run = 0 }
  }
}

// -------------------------------------------------------------- trough ----
// An open U channel: outer walls and underside, the lips, inner walls and
// the floor. Section corners in (across, up) from the floor's centreline,
// clockwise, so each edge's outward normal is (-dv, du).
const B = 1.2, T = 0.22, D = 0.8, U = 0.3
const SEC: [number, number][] = [[-B, -U], [-B, D], [-B + T, D], [-B + T, 0], [B - T, 0], [B - T, D], [B, D], [B, -U]]
const frames = keep.map((i, k) => {
  const a = path[keep[(k - 1 + keep.length) % keep.length]], b = path[keep[(k + 1) % keep.length]], p = path[i]
  const t = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], tl = Math.hypot(t[0], t[1], t[2])
  const tt: V3 = [t[0] / tl, t[1] / tl, t[2] / tl]
  const pl = Math.hypot(tt[0], tt[1])
  const left: V3 = [-tt[1] / pl, tt[0] / pl, 0]
  const up = cross(tt, left)
  return { p, left, up, ps: dense[i].ps }
})
for (let k = 0; k < frames.length; k++) {
  const f0 = frames[k], f1 = frames[(k + 1) % frames.length]
  const at = (f: typeof f0, [u, v]: [number, number]): V3 => [f.p[0] + f.left[0] * u + f.up[0] * v, f.p[1] + f.left[1] * u + f.up[1] * v, f.p[2] + f.left[2] * u + f.up[2] * v]
  for (let e = 0; e < SEC.length; e++) {
    const s0 = SEC[e], s1 = SEC[(e + 1) % SEC.length]
    const du = s1[0] - s0[0], dv = s1[1] - s0[1], l = Math.hypot(du, dv)
    const nn = (f: typeof f0): V3 => { const a = -dv / l, b = du / l; return [f.left[0] * a + f.up[0] * b, f.left[1] * a + f.up[1] * b, f.left[2] * a + f.up[2] * b] }
    const N0 = nn(f0), N1 = nn(f1)
    trough.tri(at(f0, s0), at(f0, s1), at(f1, s1), undefined, undefined, undefined, [N0, N0, N1])
    trough.tri(at(f0, s0), at(f1, s1), at(f1, s0), undefined, undefined, undefined, [N0, N1, N1])
  }
  // The lift's belt: a dark strip on the floor.
  const mid = (f0.ps + f1.ps) / 2
  if (mid > LIFT[0] + 1 && mid < LIFT[1] - 1 && f1.ps > f0.ps) {
    const a = at(f0, [-0.6, 0.12]), b = at(f0, [0.6, 0.12]), c = at(f1, [0.6, 0.12]), d = at(f1, [-0.6, 0.12])
    posts.tri(a, b, c); posts.tri(a, c, d)
  }
}
// Posts under the raised troughs, about every 5 m of plan.
{
  let run = 99
  for (let i = 1; i < path.length; i++) {
    run += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1])
    const z = path[i][2]
    if (z - gRaw[i] < 1.5 || run < 5) continue
    run = 0
    tube(posts, [path[i][0], path[i][1], -0.5], [path[i][0], path[i][1], z - U], 0.22)
  }
}

// ------------------------------------------------------------- station ----
/** A gabled roof on posts with a frieze: centre c, long axis (ux, uy), half length L, half width W. */
function shed(cx: number, cy: number, ux: number, uy: number, L: number, W: number, eave: number, ridge: number) {
  const vx = -uy, vy = ux
  const P = (i: number, j: number, z: number): V3 => M(cx + ux * L * i + vx * W * j, cy + uy * L * i + vy * W * j, z)
  const O = 0.6 // overhang
  const R = (i: number, j: number, z: number): V3 => M(cx + ux * (L + O) * i + vx * (W + O) * j, cy + uy * (L + O) * i + vy * (W + O) * j, z)
  const ra = M(cx - ux * (L + O), cy - uy * (L + O), ridge), rb = M(cx + ux * (L + O), cy + uy * (L + O), ridge)
  // Slopes, gable ends, soffit.
  roof.quad(R(-1, -1, eave), R(1, -1, eave), rb, ra)
  roof.quad(R(1, 1, eave), R(-1, 1, eave), ra, rb)
  roof.tri(R(1, -1, eave), R(1, 1, eave), rb)
  roof.tri(R(-1, 1, eave), R(-1, -1, eave), ra)
  maroon.quad(R(-1, -1, eave), R(-1, 1, eave), R(1, 1, eave), R(1, -1, eave))
  // Frieze under the eaves and posts.
  const c = M(cx, cy, eave - 0.45)
  box(maroon, [c[0] + vx * W, c[1] + vy * W, c[2]], ux, uy, [L, 0.12, 0.45])
  box(maroon, [c[0] - vx * W, c[1] - vy * W, c[2]], ux, uy, [L, 0.12, 0.45])
  box(maroon, [c[0] + ux * L, c[1] + uy * L, c[2]], -uy, ux, [W, 0.12, 0.45])
  box(maroon, [c[0] - ux * L, c[1] - uy * L, c[2]], -uy, ux, [W, 0.12, 0.45])
  const nPost = Math.round((2 * L) / 5)
  for (let k = 0; k <= nPost; k++) for (const j of [-1, 1]) {
    const i = -1 + (2 * k) / nPost
    tube(maroon, P(i, j, 0), P(i, j, eave - 0.9), 0.18)
  }
}
// The east block (the flume's station) and the south block (queue and
// entrance) of way/1483353311.
shed(-394.75, -190.95, 0.157, -0.988, 12.7, 4.0, GRADE + 5.2, GRADE + 7.0)
shed(-399.8, -206.7, 0.135, -0.991, 14.8, 4.0, GRADE + 4.8, GRADE + 6.6)

// ---------------------------------------------------------------- gate ----
{
  // Across the south end of the south block, on the boardwalk.
  const ux = 0.991, uy = 0.135 // along the gate, west to east
  const c: [number, number] = [-397.8, -224.0]
  const HALF = 4.6, TW = 1.25, TH = 8.0, GG = 2.3 // the boardwalk, over the park
  for (const sg of [-1, 1]) {
    const tc = M(c[0] + ux * HALF * sg, c[1] + uy * HALF * sg, 0)
    box(white, [tc[0], tc[1], GG + TH / 2 - 0.4], ux, uy, [TW, TW, TH / 2 + 0.4])
    box(maroon, [tc[0], tc[1], GG + TH + 0.3], ux, uy, [TW + 0.25, TW + 0.25, 0.3])
    // The teal pyramid.
    const z0 = GG + TH + 0.6, z1 = GG + TH + 3.4, h = TW + 0.35
    const cs: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
    const q = (k: number): V3 => [tc[0] + (ux * cs[k][0] - uy * cs[k][1]) * h, tc[1] + (uy * cs[k][0] + ux * cs[k][1]) * h, z0]
    for (let k = 0; k < 4; k++) roof.tri(q(k), q((k + 1) % 4), [tc[0], tc[1], z1])
    roof.tri(q(0), q(2), q(1)); roof.tri(q(0), q(3), q(2))
    if (sg < 0) {
      tube(white, [tc[0], tc[1], z1 - 0.2], [tc[0], tc[1], z1 + 1.8], 0.08)
      wheels.tri([tc[0], tc[1], z1 + 1.8], [tc[0], tc[1], z1 + 1.1], [tc[0] + ux * 1.4, tc[1] + uy * 1.4, z1 + 1.45])
      wheels.tri([tc[0], tc[1], z1 + 1.8], [tc[0] + ux * 1.4, tc[1] + uy * 1.4, z1 + 1.45], [tc[0], tc[1], z1 + 1.1])
    }
  }
  const g = M(c[0], c[1], 0)
  // The sign band over the opening, and the pale gold arch above it.
  box(maroon, [g[0], g[1], GG + 4.2], ux, uy, [HALF - TW, 0.3, 0.45])
  const R = HALF - TW, secs: V3[][] = []
  for (let k = 0; k <= 10; k++) {
    const a = Math.PI - (Math.PI * k) / 10, x = Math.cos(a) * R, z = GG + 4.7 + Math.sin(a) * R * 0.95
    const o = (dx: number, dz: number, dy: number): V3 => [g[0] + ux * (x + dx * Math.cos(a)) - uy * dy, g[1] + uy * (x + dx * Math.cos(a)) + ux * dy, z + dz * Math.sin(a) + dz * 0]
    const w = 0.22
    secs.push([o(-w, -w, -w), o(w, w, -w), o(w, w, w), o(-w, -w, w)])
  }
  white.sweep(secs)
  // Three red starburst wheels: thin twelve-sided discs facing the boardwalk.
  for (const [dx, z, r] of [[-1.9, GG + 5.9, 1.15], [0, GG + 6.6, 1.45], [1.9, GG + 5.9, 1.15]] as [number, number, number][]) {
    const cx = g[0] + ux * dx, cy = g[1] + uy * dx
    const ring = (y: number) => Array.from({ length: 12 }, (_, k) => {
      const a = (k / 12) * 2 * Math.PI
      return [cx + ux * Math.cos(a) * r - uy * y, cy + uy * Math.cos(a) * r + ux * y, z + Math.sin(a) * r] as V3
    })
    const f = ring(-0.45), b = ring(-0.2)
    for (let k = 1; k < 11; k++) { wheels.tri(f[0], f[k + 1], f[k]); wheels.tri(b[0], b[k], b[k + 1]) }
    for (let k = 0; k < 12; k++) { const l = (k + 1) % 12; wheels.quad(f[k], f[l], b[l], b[k]) }
  }
}

// -------------------------------------------------------------- output ----
const parts = [
  { part: trough, material: finish('letis-aqua', AQUA) },
  { part: posts, material: finish('letis-teal', TEAL_DARK) },
  { part: roof, material: finish('letis-teal-roof', TEAL_ROOF) },
  { part: maroon, material: finish('letis-maroon', MAROON) },
  { part: white, material: PALETTE.trim },
  { part: wheels, material: finish('neon-letis-wheels', RED) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb("Leti's Treasure", parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 12.2, osm: 'way/1483353309',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-letis-treasure.glb', import.meta.url).pathname
await Bun.write(out, glb)
let len3 = 0
for (let i = 1; i <= path.length; i++) len3 += Math.hypot(...sub(path[i % path.length], path[i - 1]))
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes; trough ${len3.toFixed(0)} m (${POLY.toFixed(0)} m in plan), ${frames.length} sections`)
console.log(parts.map(({ part, material }) => `  ${material.name}: ${part.triangles}`).join('\n'))
console.log(`anchor ${(LON0 + ANCHOR[0] / MX).toFixed(7)}, ${(LAT0 + ANCHOR[1] / MY).toFixed(7)}`)
