/**
 * Seven Dwarfs Mine Train, Fantasyland, Magic Kingdom: the rockwork mountain
 * with its waterfall and trestle bridges, the exposed track, the mine
 * entrance and the Dwarfs' cottage. Procedural, CC0-1.0.
 * bun generators/wdw-seven-dwarfs-mine-train.ts   (REPORT=1 for the element table)
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The park frame is
 * equirectangular about 28.4195 N, 81.5800 W (`origin`); the model's origin
 * is the anchor below, on the ground. Built with ./coaster-kit.ts.
 *
 * Plan. OSM chains the ride as one circuit, in ride order from the station
 * under the rockwork (building way/1313344974, track way/1351675202):
 * way/346646028 (tunnel) out to the south loop way/295016221, the first lift
 * way/989772764 north to the trestle bridge at its top (way/989772763, over
 * the lower track), the swooping double loop way/989772769 round the east
 * mound, way/346646029 back west under the bridge into the mine, the second
 * lift way/989772773 inside the mountain, the drop and north loop
 * way/295016225 and way/989772768, the north bridge way/295038738, and the
 * west loop way/295038729 past the cottage to the station: 588 m against the
 * published 2,001 ft (610 m). Laid over the USGS NAIP orthophoto (public
 * domain) every stretch sits in its rock channel, so the plan is OSM's.
 *
 * Profile: Vekoma family mine train (RCDB 9720): two chain lifts, the first
 * with a 31 ft (9.4 m) drop, the second with a 41 ft (12.5 m) drop; 34 mph
 * (55 km/h). Positions are metres along the OSM polyline (588 m):
 *
 *   station and tunnel out under the mine building           s 0-57 (0-10%)
 *   south loop at grade                                     s 57-100 (10-17%)
 *   lift 1, north beside the waterfall, to 10.5 m           s 100-131 (17-22%)
 *   the trestle bridge over the lower track, the 9.4 m drop s 131-160 (22-27%)
 *   swooping turns round the east mound                     s 160-288 (27-49%)
 *   back under the bridge into the mine; lift 2 to 13.5 m   s 288-361 (49-61%)
 *   the 12.5 m drop out of the mountain's flank             s 361-388 (61-66%)
 *   the north loop climbing to the north bridge at 9.5 m    s 388-456 (66-78%)
 *   down round the west loop, brakes by the cottage         s 456-588 (78-100%)
 *
 * Rockwork. The rock areas are traced over NAIP: the main mountain on the
 * diagonal from the north bridge to the mine building (OSM natural=hill
 * way/1313344975 is its core), the mound inside the east loop and the rocks
 * inside the north loop (OSM natural=bare_rock way/345136751). Each is a
 * height field of fused rounded boulders over a dome, cut down into a channel
 * wherever the track runs open and built up over the tunnels and lifts that
 * run inside it. Conifers stand on the tops, as in every photo; the
 * waterfall falls beside the first lift into the pool under the bridge.
 *
 * Published: the lifts, drops, speed, length. Estimated: every height (from
 * the published drops and the photos), the mountain's (about 14 m of rock,
 * 17 m over the second lift's top), the mine building's (roof at 6 m, OSM
 * says three levels) and the cottage's (OSM says two levels). Invented: the
 * boulder layout and the trees' positions, beyond what NAIP shows.
 *
 * Photos (Wikimedia Commons, Category:Seven Dwarfs Mine Train at Magic
 * Kingdom): "Seven Dwarfs Mine Train (14004242576)", "(14024173001)",
 * "(14027806154)" and others (Josh Hallett, CC BY-SA 2.0) for the bridge,
 * waterfall and lift; "(16629618021)", "(23318405812)", "(16443704050)" and
 * others (Theme Park Tourist, CC BY 2.0) for the lift, drop and rock colour;
 * "(24626877046)" (Jennifer Lynn, CC BY 2.0). Plan: USGS NAIP (public domain).
 */
import { buildCoaster, type TrackFrame } from './coaster-kit'
import { Part, type V3 } from './mesh'
import { finish } from './palette'

type XY = [number, number]

// The circuit from OSM, node by node in ride order, from the station.
const CHAIN: XY[] = [
  [-25.2, 132.7], [-24.8, 132.4], [4.3, 115.2], [12.9, 110.2], [14.1, 109.4], [14.5, 109.1], [15.2, 108.6], [15.3, 108.5], [15.5,
  108.2], [15.6, 108.0], [15.7, 107.7], [15.8, 107.1], [15.9, 106.5], [16.0, 105.9], [16.0, 105.3], [16.1, 104.4], [16.1, 103.5],
  [15.8, 101.1], [15.3, 99.4], [11.8, 95.3], [10.3, 93.6], [9.1, 91.6], [8.5, 90.0], [8.5, 88.1], [8.8, 86.0], [9.9, 83.4], [10.7,
  82.2], [11.4, 81.5], [11.9, 81.1], [13.8, 80.3], [15.9, 79.9], [17.8, 80.0], [19.3, 80.5], [20.4, 80.9], [21.4, 81.5], [22.4,
  82.8], [23.4, 84.5], [23.7, 86.2], [23.8, 87.9], [23.6, 91.1], [23.5, 92.8], [20.6, 123.4], [20.5, 124.7], [20.2, 125.9], [19.9,
  127.8], [19.9, 129.6], [20.3, 131.1], [21.2, 132.9], [22.5, 134.4], [24.2, 135.5], [26.1, 136.3], [27.7, 136.4], [29.4, 136.1],
  [31.6, 135.5], [32.8, 134.9], [34.0, 133.8], [34.5, 133.1], [34.8, 132.7], [35.3, 131.5], [36.0, 130.0], [37.1, 127.3], [38.0,
  125.5], [38.9, 123.7], [39.6, 122.4], [40.7, 120.3], [41.3, 118.7], [41.7, 117.6], [41.9, 116.0], [41.8, 114.5], [41.4, 112.9],
  [40.6, 111.4], [40.0, 110.3], [39.2, 109.1], [36.8, 106.1], [35.5, 104.6], [34.2, 103.2], [31.9, 100.8], [30.2, 98.6], [28.9,
  96.9], [28.6, 96.4], [28.1, 95.7], [27.8, 94.7], [27.6, 94.0], [27.3, 93.0], [27.2, 91.9], [27.1, 91.0], [27.2, 90.0], [27.4,
  89.0], [27.7, 88.3], [27.9, 87.7], [28.3, 87.0], [28.8, 86.2], [29.3, 85.7], [29.8, 85.3], [30.5, 84.8], [31.3, 84.4], [32.3,
  84.0], [33.8, 83.9], [34.9, 84.0], [36.2, 84.1], [37.4, 84.3], [38.6, 84.8], [39.3, 85.1], [40.0, 85.7], [40.6, 86.2], [41.3,
  87.1], [41.9, 88.1], [42.5, 89.2], [42.7, 90.0], [42.9, 90.8], [42.9, 91.4], [43.0, 92.3], [42.9, 93.5], [42.8, 94.6], [42.7,
  95.3], [42.6, 95.8], [42.5, 96.6], [42.3, 98.0], [41.7, 100.9], [41.6, 101.9], [41.5, 103.3], [41.5, 104.8], [41.5, 105.4], [41.6,
  106.4], [41.9, 107.5], [42.3, 108.6], [42.8, 109.5], [43.3, 110.5], [43.9, 111.2], [46.6, 113.5], [49.9, 115.8], [52.4, 117.6],
  [54.1, 119.0], [55.0, 119.8], [55.7, 120.6], [56.5, 121.7], [57.2, 123.0], [57.5, 124.5], [57.5, 125.7], [57.3, 127.4], [56.8,
  128.6], [56.2, 129.6], [55.3, 130.6], [53.7, 131.5], [52.2, 132.1], [48.6, 132.5], [42.9, 132.5], [29.5, 133.1], [25.6, 132.9],
  [23.8, 132.5], [22.6, 131.4], [22.2, 129.8], [21.6, 123.4], [21.1, 122.4], [20.0, 121.7], [18.6, 121.4], [16.0, 121.5], [12.2,
  122.8], [-18.0, 137.1], [-31.1, 143.7], [-36.6, 148.5], [-40.1, 155.5], [-40.1, 158.9], [-39.5, 162.0], [-38.0, 164.9], [-35.5,
  167.5], [-33.2, 169.0], [-30.2, 170.0], [-27.2, 170.2], [-24.5, 169.3], [-21.9, 167.8], [-20.1, 165.7], [-19.3, 163.4], [-19.1,
  161.4], [-19.5, 158.7], [-20.4, 156.7], [-22.2, 155.0], [-25.4, 153.3], [-30.2, 152.3], [-42.2, 149.7], [-51.1, 148.0], [-52.8,
  147.6], [-54.2, 146.8], [-55.6, 145.9], [-56.8, 144.9], [-57.7, 143.7], [-58.3, 142.8], [-58.8, 141.5], [-59.0, 140.3], [-59.1,
  138.6], [-59.1, 137.3], [-58.9, 135.5], [-58.8, 133.6], [-58.7, 131.2], [-58.9, 129.1], [-59.6, 127.5], [-60.4, 126.1], [-61.0,
  125.1], [-61.6, 124.1], [-62.1, 123.3], [-62.9, 122.6], [-64.0, 121.6], [-64.8, 120.5], [-65.5, 119.0], [-66.1, 117.7], [-66.4,
  116.4], [-66.7, 115.3], [-66.7, 113.9], [-66.6, 112.5], [-66.3, 111.0], [-65.6, 109.7], [-64.6, 108.7], [-63.5, 108.0], [-62.6,
  107.6], [-61.7, 107.3], [-61.0, 107.1], [-60.3, 106.9], [-59.7, 106.8], [-58.4, 106.8], [-57.5, 106.9], [-56.8, 107.2], [-55.6,
  107.7], [-54.7, 108.2], [-53.8, 108.7], [-53.1, 109.3], [-52.3, 110.2], [-51.9, 111.0], [-51.6, 111.8], [-51.3, 112.7], [-51.2,
  113.6], [-51.2, 114.5], [-51.3, 116.4], [-51.7, 119.4], [-53.5, 137.9], [-53.5, 138.4], [-53.5, 139.0], [-53.5, 139.5], [-53.4,
  140.0], [-53.2, 140.9], [-52.9, 141.7], [-52.5, 142.4], [-51.7, 143.3], [-50.9, 144.0], [-50.0, 144.5], [-48.6, 144.8], [-47.3,
  145.0], [-46.2, 144.9], [-45.2, 144.7], [-44.4, 144.4], [-41.5, 142.8], [-38.8, 141.3], [-33.7, 138.1], [-30.9, 136.4], [-29.0,
  135.3], [-27.5, 134.2], [-25.9, 133.1],
]
// The mine building over the station's exit (way/296781876): drawn as the kit's station.
const MINE: XY[] = [
  [-10.8, 103.0], [-5.0, 107.7], [-1.9, 105.5], [-1.0, 102.9], [-1.3, 102.6], [0.5, 101.6], [0.9, 103.9], [3.5, 103.9],
  [5.4, 103.9], [8.5, 101.2], [5.4, 92.0], [0.6, 91.5], [-2.0, 93.8], [-1.2, 96.3], [-5.7, 98.8], [-6.9, 97.3],
  [-8.6, 98.0], [-10.1, 99.4],
]
// The Dwarfs' cottage (way/295016219).
const COTTAGE: XY[] = [
  [-30.4, 134.3], [-31.8, 130.3], [-32.6, 128.3], [-39.1, 130.6], [-39.9, 128.4], [-44.2, 130.0], [-43.2, 133.0], [-43.6, 133.1],
  [-42.5, 136.3], [-42.2, 136.2], [-40.9, 139.8], [-36.4, 138.2], [-37.0, 136.6],
]
// Rock areas traced over NAIP, with their dome heights (edge, peak).
// `crags` are tall boulders set by hand (x, y, radius, top): the rocks either side of the first bridge and the lift.
const ROCKS: { ring: XY[]; edge: number; peak: number; crags?: [number, number, number, number][] }[] = [
  {
    // The mountain.
    ring: [
      [-37.5, 148], [-31, 149.5], [-23, 148], [-16, 145], [-10, 141], [-3, 138], [5, 136], [11, 134], [17, 131], [20.5, 126],
      [21, 120], [20, 114], [19.5, 108], [18, 102], [14.5, 98.5], [10.5, 100], [8.5, 103.5], [3, 108], [-3, 109], [-8, 111],
      [-13, 114], [-17, 117], [-22, 122], [-27, 128], [-32, 134], [-36, 139], [-38.5, 144],
    ],
    edge: 5, peak: 17,
    crags: [[15.5, 124.5, 4.5, 14], [16.5, 117, 4, 12.5], [16, 130, 4, 13]],
  },
  // The mound inside the east loop, run north over the tunnel.
  { ring: [[24, 136.5], [31, 137.5], [38, 137], [43, 135], [41, 126], [38, 118], [33, 113], [27, 114], [24, 120], [23.5, 128]], edge: 3.5, peak: 11, crags: [[27.5, 131, 4, 13.5], [26.5, 120, 3.5, 10]] },
  // The rocks inside the north loop.
  { ring: [[-37, 166], [-29, 167], [-23, 163], [-22, 156], [-27, 153], [-35, 153], [-38, 158]], edge: 2.5, peak: 6 },
]
// Tunnels, polyline s: the station run, the run west under the mound, and from the mine's portal up lift 2.
const TUNNELS: [number, number][] = [[0, 57], [288, 302], [322, 361]]

const ROCK = finish('dwarfs-rock', 0xd9b694)
const PINE = finish('dwarfs-pine', 0x5e8268)

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const subv = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crossv = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const smooth = (u: number) => { const t = Math.max(0, Math.min(1, u)); return t * t * (3 - 2 * t) }

/** A seeded random stream, so the boulders come out the same every run. */
function rng(seed: number) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32) }

function inside(p: XY, poly: XY[]) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
function distToRing(p: XY, ring: XY[]) {
  let best = Infinity
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy || 1
    const u = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2))
    best = Math.min(best, Math.hypot(a[0] + dx * u - p[0], a[1] + dy * u - p[1]))
  }
  return best
}

/** Bowyer–Watson Delaunay triangulation; returns index triples. */
function delaunay(P: XY[]): [number, number, number][] {
  const xs = P.map((p) => p[0]), ys = P.map((p) => p[1])
  const mx = Math.min(...xs), my = Math.min(...ys), d = Math.max(Math.max(...xs) - mx, Math.max(...ys) - my) * 20
  const pts: XY[] = [...P, [mx - d, my - d], [mx + 2 * d, my - d], [mx - d, my + 2 * d]]
  const n = P.length
  type T = { a: number; b: number; c: number; x: number; y: number; r2: number }
  const circ = (a: number, b: number, c: number): T => {
    const [ax, ay] = pts[a], [bx, by] = pts[b], [cx, cy] = pts[c]
    const D = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
    const ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / D
    const uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / D
    return { a, b, c, x: ux, y: uy, r2: (ax - ux) ** 2 + (ay - uy) ** 2 }
  }
  let tris: T[] = [circ(n, n + 1, n + 2)]
  for (let i = 0; i < n; i++) {
    const [px, py] = pts[i]
    const bad: T[] = [], keep: T[] = []
    for (const t of tris) ((px - t.x) ** 2 + (py - t.y) ** 2 < t.r2 ? bad : keep).push(t)
    const edges = new Map<string, [number, number]>()
    for (const t of bad) for (const [u, v] of [[t.a, t.b], [t.b, t.c], [t.c, t.a]]) {
      const k = u < v ? `${u},${v}` : `${v},${u}`
      if (edges.has(k)) edges.delete(k)
      else edges.set(k, [u, v])
    }
    for (const [u, v] of edges.values()) keep.push(circ(u, v, i))
    tris = keep
  }
  return tris.filter((t) => t.a < n && t.b < n && t.c < n).map((t) => [t.a, t.b, t.c])
}

/** A point in a track frame: `a` along, `l` to the left, `u` up. */
const local = (f: TrackFrame, a: number, l: number, u: number): V3 => add(add(f.p, mul(f.t, a)), add(mul(f.left, l), mul(f.up, u)))

/** A box between two points (a beam or post), `w` by `h` across, flat-shaded. */
function beam(part: Part, a: V3, b: V3, w: number, h: number) {
  const ax = unit(subv(b, a)), ref: V3 = Math.abs(ax[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const u = mul(unit(crossv(ax, ref)), w / 2), v = mul(unit(crossv(u, ax)), h / 2)
  const c = (p: V3, su: number, sv: number) => add(p, add(mul(u, su), mul(v, sv)))
  const A = [c(a, 1, 1), c(a, -1, 1), c(a, -1, -1), c(a, 1, -1)], B = [c(b, 1, 1), c(b, -1, 1), c(b, -1, -1), c(b, 1, -1)]
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; part.quad(A[i], B[i], B[j], A[j]) }
}

await buildCoaster({
  name: 'Seven Dwarfs Mine Train',
  out: '../models/wdw-seven-dwarfs-mine-train.glb',
  origin: [-81.58, 28.4195],
  chain: CHAIN,
  anchor: [-12, 125],
  // Magic Kingdom's grade is level here.
  ground: { x0: -100, y0: 50, step: 50, rows: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], base: 30 },
  profile: [
    { name: 'station', s: 0, z: 0.8 },
    { name: 'tunnel out under the mine', s: 44, z: 0.8 },
    { name: 'portal', s: 57, z: 1 },
    { name: 'south loop', s: 80, z: 1.4 },
    { name: 'lift 1, foot', s: 100, z: 1 },
    { name: 'lift 1, top', s: 131, z: 10.5, r: 10 },
    { name: 'the bridge over the lower track', s: 138, z: 10.5, r: 10 },
    { name: 'foot of the 9.4 m drop', s: 162, z: 1.1, r: 15 },
    { name: 'swoop round the mound', s: 186, z: 3.2 },
    { name: 'dip', s: 205, z: 1.4 },
    { name: 'swoop', s: 226, z: 3.4 },
    { name: 'dip', s: 248, z: 1.4 },
    { name: 'swoop', s: 268, z: 3 },
    { name: 'into the tunnel under the mound', s: 288, z: 1 },
    { name: 'under the bridge', s: 315, z: 1 },
    { name: 'lift 2, foot (in the mine)', s: 328, z: 1 },
    { name: 'lift 2, top', s: 361, z: 13.5, r: 10 },
    { name: 'over the brink', s: 365, z: 13.5, r: 12 },
    { name: 'foot of the 12.5 m drop', s: 388, z: 1.1, r: 18 },
    { name: 'north loop, climbing', s: 412, z: 5 },
    { name: 'north loop, east side', s: 430, z: 8.5 },
    { name: 'north bridge', s: 446, z: 9.5 },
    { name: 'north bridge, west end', s: 456, z: 9.5 },
    { name: 'west loop, turning', s: 476, z: 4.5 },
    { name: 'west loop, low', s: 495, z: 1.6 },
    { name: 'hairpin', s: 507, z: 2.4 },
    { name: 'dip', s: 520, z: 1.2 },
    { name: 'straight north', s: 540, z: 2.4 },
    { name: 'brakes by the cottage', s: 560, z: 0.9 },
    { name: 'station, in', s: 586, z: 0.8 },
  ],
  lift: [100, 131],
  extraLifts: [[328, 361], [586, 99]],
  liftHead: 1,
  brakes: [{ from: 560, to: 586, z: 0.9, head: 0.6 }],
  losses: [0.012, 0.0008],
  track: { W: 1.9, RAIL: 0.4, DEPTH: 1.0, SPINE: 0.9 },
  station: { ring: MINE, posts: [], roofZ: 6 },
  colours: {
    deck: ['dwarfs-track', 0x86634a], spine: 'deck', supports: ['dwarfs-timber', 0x6e5646],
    stationRoof: ['dwarfs-shingle', 0x8c7a6a],
  },
  supportR: [0.35, 0.4, 0.45],
  supportEvery: 9,
  sampleDeg: 12,
  meta: { height: 13.5, trackLength: 610 },
  extras: (kit) => {
    const rock = new Part(), pine = new Part(), timber = kit.parts.supports, stone = kit.parts.stone, roof = kit.parts.roof
    const rand = rng(7)
    // The track in plan, with its height and whether it runs in a tunnel.
    const inTunnel = (s: number) => TUNNELS.some(([a, b]) => s >= a && s <= b)
    const track: { p: V3; tunnel: boolean; s: number }[] = []
    for (let s = 0; s < 588; s += 0.75) track.push({ p: kit.at(s).p, tunnel: inTunnel(s), s })
    const W = kit.track.W

    const heights: ((p: XY) => number)[] = []
    for (const R of ROCKS) {
      const ring = R.ring.map((q) => kit.toModel(q))
      const xs = ring.map((p) => p[0]), ys = ring.map((p) => p[1])
      let maxD = 1
      for (let x = Math.min(...xs); x < Math.max(...xs); x += 1) for (let y = Math.min(...ys); y < Math.max(...ys); y += 1) if (inside([x, y], ring)) maxD = Math.max(maxD, distToRing([x, y], ring))
      const dome = (p: XY) => R.edge + (R.peak - R.edge) * smooth(distToRing(p, ring) / maxD)
      // Boulders on a jittered 4 m grid.
      const boulders: { c: XY; r: number; top: number }[] = []
      for (let x = Math.min(...xs) - 1; x < Math.max(...xs) + 1; x += 4) for (let y = Math.min(...ys) - 1; y < Math.max(...ys) + 1; y += 4) {
        const c: XY = [x + (rand() - 0.5) * 2.4, y + (rand() - 0.5) * 2.4]
        if (!inside(c, ring) && distToRing(c, ring) > 1.5) continue
        boulders.push({ c, r: 3 + rand() * 1.8, top: dome(c) + (rand() - 0.4) * 4 })
      }
      for (const [x, y, r, top] of R.crags ?? []) boulders.push({ c: kit.toModel([x, y]), r, top })
      const H = (p: XY) => {
        let h = -1
        for (const b of boulders) {
          const d = Math.hypot(p[0] - b.c[0], p[1] - b.c[1])
          if (d < b.r) h = Math.max(h, b.top - b.r * 1.5 + Math.sqrt(b.r * b.r - d * d) * 1.5)
        }
        if (h < 0) h = dome(p) - 2
        for (const t of track) {
          const q = Math.hypot(t.p[0] - p[0], t.p[1] - p[1])
          if (q > 7) continue
          if (t.tunnel) { if (q < W / 2 + 1.6) h = Math.max(h, t.p[2] + 3.2) }
          else h = Math.min(h, t.p[2] - 1.5 + Math.max(0, q - W / 2 - 0.9) * 3)
        }
        return h
      }
      heights.push(H)
      // Mesh: the outline every 1.5 m and a 1.5 m grid inside.
      const P: XY[] = []
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.round(L / 1.5))
        for (let j = 0; j < k; j++) P.push([a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k])
      }
      const nB = P.length
      for (let x = Math.min(...xs) + 0.5; x < Math.max(...xs); x += 1.5) for (let y = Math.min(...ys) + 0.5; y < Math.max(...ys); y += 1.5) {
        const p: XY = [x + ((Math.round(y / 1.5) % 2) * 1.5) / 2, y]
        if (inside(p, ring) && distToRing(p, ring) > 0.8) P.push(p)
      }
      const V: V3[] = P.map((p) => [p[0], p[1], H(p)])
      const tris = delaunay(P).filter(([a, b, c]) => inside([(P[a][0] + P[b][0] + P[c][0]) / 3, (P[a][1] + P[b][1] + P[c][1]) / 3], ring))
        // The channel floors are the map's ground.
        .filter(([a, b, c]) => Math.max(V[a][2], V[b][2], V[c][2]) > 0.4)
        .map(([a, b, c]) => (crossv(subv(V[b], V[a]), subv(V[c], V[a]))[2] >= 0 ? [a, b, c] : [a, c, b]))
      // Smooth within a boulder, creased between them: normals averaged only over faces turned less than 50° apart.
      const fn = tris.map(([a, b, c]) => unit(crossv(subv(V[b], V[a]), subv(V[c], V[a]))))
      const around: number[][] = V.map(() => [])
      tris.forEach((t, i) => t.forEach((k) => around[k].push(i)))
      for (const [i, [a, b, c]] of tris.entries()) {
        const nrm = [a, b, c].map((k) => unit(around[k].map((j) => fn[j]).filter((f) => f[0] * fn[i][0] + f[1] * fn[i][1] + f[2] * fn[i][2] > 0.64).reduce(add, [0, 0, 0] as V3)))
        rock.tri(V[a], V[b], V[c], undefined, undefined, undefined, nrm)
      }
      // The outer faces down to the ground.
      const area = ring.reduce((s, a, i) => { const b = ring[(i + 1) % ring.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
      for (let i = 0; i < nB; i++) {
        const a = V[i], b = V[(i + 1) % nB]
        if (a[2] <= 0.4 && b[2] <= 0.4) continue
        const A0: V3 = [a[0], a[1], -0.3], B0: V3 = [b[0], b[1], -0.3]
        if (area > 0) rock.quad(A0, B0, b, a)
        else rock.quad(B0, A0, a, b)
      }
      // Conifers on the tops, clear of the track.
      const tops = P.map((p, k) => ({ p, z: V[k][2] })).filter((q) => q.z > R.edge + 0.45 * (R.peak - R.edge) && distToRing(q.p, ring) > 2.5)
      const placed: XY[] = []
      for (const q of tops.sort(() => rand() - 0.5)) {
        if (placed.length >= Math.round(maxD * 1.7)) break
        if (placed.some((o) => Math.hypot(o[0] - q.p[0], o[1] - q.p[1]) < 4.6)) continue
        if (track.some((t) => !t.tunnel && Math.hypot(t.p[0] - q.p[0], t.p[1] - q.p[1]) < 4)) continue
        placed.push(q.p)
        const h = 7 + rand() * 3.5, r = 2.1 + rand() * 0.6, z0 = q.z - 0.8
        // Two tiers of a six-sided cone.
        for (const [zb, zt, rb] of [[z0 + h * 0.15, z0 + h * 0.7, r], [z0 + h * 0.45, z0 + h, r * 0.7]]) {
          for (let k = 0; k < 6; k++) {
            const a0 = (k / 6) * 2 * Math.PI, a1 = ((k + 1) / 6) * 2 * Math.PI
            const P0: V3 = [q.p[0] + Math.cos(a0) * rb, q.p[1] + Math.sin(a0) * rb, zb], P1: V3 = [q.p[0] + Math.cos(a1) * rb, q.p[1] + Math.sin(a1) * rb, zb]
            const n0 = unit([Math.cos(a0), Math.sin(a0), 0.6]), n1 = unit([Math.cos(a1), Math.sin(a1), 0.6])
            pine.tri(P0, P1, [q.p[0], q.p[1], zt], undefined, undefined, undefined, [n0, n1, [0, 0, 1]])
            pine.tri(P1, P0, [q.p[0], q.p[1], zb], undefined, undefined, undefined, [[0, 0, -1], [0, 0, -1], [0, 0, -1]])
          }
        }
      }
    }

    // The trestle bridges: deep timber parapets either side of the deck, and
    // X-braced bents down into the chasm.
    for (const [a, b] of [[129, 150], [440, 458]]) {
      for (let s = a; s < b; s += 2.5) {
        const f0 = kit.at(s), f1 = kit.at(Math.min(b, s + 2.5))
        for (const sg of [1, -1]) {
          const p0 = local(f0, 0, sg * (W / 2 + 0.15), 0.35), p1 = local(f1, 0, sg * (W / 2 + 0.15), 0.35)
          beam(timber, p0, p1, 0.25, 1.1)
        }
      }
      for (let s = a + 3; s < b; s += 6) {
        const f = kit.at(s), top = local(f, 0, 0, -kit.track.DEPTH)
        const g = 0
        if (top[2] - g < 3) continue
        const across = unit([f.left[0], f.left[1], 0])
        const L = add(top, mul(across, 1.6)), Rr = add(top, mul(across, -1.6))
        const Lg: V3 = [L[0] + across[0] * 1.2, L[1] + across[1] * 1.2, g], Rg: V3 = [Rr[0] - across[0] * 1.2, Rr[1] - across[1] * 1.2, g]
        beam(timber, Lg, L, 0.45, 0.45)
        beam(timber, Rg, Rr, 0.45, 0.45)
        beam(timber, add(Lg, [0, 0, 0.5]), add(Rr, [0, 0, -0.5]), 0.3, 0.3)
        beam(timber, add(Rg, [0, 0, 0.5]), add(L, [0, 0, -0.5]), 0.3, 0.3)
        beam(timber, L, Rr, 0.4, 0.5)
      }
    }

    // The waterfall beside lift 1: a white sheet falling down the channel's
    // west face, from the rock top beside the lift's upper half into the pool
    // under the bridge.
    {
      const H = heights[0]
      for (let ps = 114; ps < 127; ps += 3) {
        const f0 = kit.at(ps), f1 = kit.at(ps + 3)
        const side = (f: TrackFrame): V3 => { const l = unit([f.left[0], f.left[1], 0]); return [f.p[0] + l[0] * 2.4, f.p[1] + l[1] * 2.4, 0] }
        const a = side(f0), b = side(f1)
        const za = Math.max(2, H([a[0], a[1]]) + 0.2), zb = Math.max(2, H([b[0], b[1]]) + 0.2)
        stone.quad([a[0], a[1], 0.2], [b[0], b[1], 0.2], [b[0], b[1], zb], [a[0], a[1], za])
        stone.quad([b[0], b[1], 0.2], [a[0], a[1], 0.2], [a[0], a[1], za], [b[0], b[1], zb])
      }
    }

    // The mine building: timber walls up to the kit's roof slab, and a hip over its bounds rising from 6 m.
    {
      const ring = MINE.map((q) => kit.toModel(q))
      const area = ring.reduce((s, a, i) => { const b = ring[(i + 1) % ring.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i], b = ring[(i + 1) % ring.length]
        const A0: V3 = [a[0], a[1], -0.3], B0: V3 = [b[0], b[1], -0.3], A1: V3 = [a[0], a[1], 5.2], B1: V3 = [b[0], b[1], 5.2]
        if (area > 0) timber.quad(A0, B0, B1, A1)
        else timber.quad(B0, A0, A1, B1)
      }
      hipRoof(ring, 6, 10, 0.8)
    }
    // The cottage: stone walls to 4.5 m and a steep hipped roof to 10 m.
    {
      const ring = COTTAGE.map((q) => kit.toModel(q))
      const area = ring.reduce((s, a, i) => { const b = ring[(i + 1) % ring.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i], b = ring[(i + 1) % ring.length]
        const A0: V3 = [a[0], a[1], -0.3], B0: V3 = [b[0], b[1], -0.3], A1: V3 = [a[0], a[1], 4.5], B1: V3 = [b[0], b[1], 4.5]
        if (area > 0) stone.quad(A0, B0, B1, A1)
        else stone.quad(B0, A0, A1, B1)
      }
      hipRoof(ring, 4.5, 10, 0.7)
    }
    /** A hipped roof over a footprint's principal-axis box, eaves at z0, ridge at z1, overhang `o`. */
    function hipRoof(ring: XY[], z0: number, z1: number, o: number) {
      const cx = ring.reduce((s, p) => s + p[0], 0) / ring.length, cy = ring.reduce((s, p) => s + p[1], 0) / ring.length
      let sxx = 0, syy = 0, sxy = 0
      for (const [x, y] of ring) { sxx += (x - cx) ** 2; syy += (y - cy) ** 2; sxy += (x - cx) * (y - cy) }
      const th = 0.5 * Math.atan2(2 * sxy, sxx - syy), u: XY = [Math.cos(th), Math.sin(th)], v: XY = [-u[1], u[0]]
      const pu = ring.map(([x, y]) => (x - cx) * u[0] + (y - cy) * u[1]), pv = ring.map(([x, y]) => (x - cx) * v[0] + (y - cy) * v[1])
      const u0 = Math.min(...pu) - o, u1 = Math.max(...pu) + o, v0 = Math.min(...pv) - o, v1 = Math.max(...pv) + o
      const P = (a: number, b: number, z: number): V3 => [cx + u[0] * a + v[0] * b, cy + u[1] * a + v[1] * b, z]
      const half = (v1 - v0) / 2, vm = (v0 + v1) / 2
      const ra = u0 + half * 0.8, rb = u1 - half * 0.8
      const c = [P(u0, v0, z0), P(u1, v0, z0), P(u1, v1, z0), P(u0, v1, z0)], r0 = P(Math.min(ra, (u0 + u1) / 2), vm, z1), r1 = P(Math.max(rb, (u0 + u1) / 2), vm, z1)
      roof.quad(c[0], c[1], r1, r0)
      roof.quad(c[2], c[3], r0, r1)
      roof.tri(c[1], c[2], r1)
      roof.tri(c[3], c[0], r0)
      // Soffit.
      roof.quad(c[3], c[2], c[1], c[0])
    }
    return [{ part: rock, material: ROCK }, { part: pine, material: PINE }]
  },
})
