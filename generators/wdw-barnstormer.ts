/**
 * The Barnstormer, Storybook Circus, Magic Kingdom: the junior coaster, its
 * red and white checkered stunt tower, the blue-roofed station and the Great
 * Goofini maintenance barn. Procedural, CC0-1.0.
 * bun generators/wdw-barnstormer.ts   (REPORT=1 for the element table)
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The park frame is
 * equirectangular about 28.4195 N, 81.5800 W (`origin`); the model's origin
 * is the anchor below, on the ground. Built with ./coaster-kit.ts.
 *
 * Plan. OSM chains the circuit in ride order from the station
 * (way/296370637, building=roof, 8 m, gabled): way/989772770 through the
 * station, way/989772772 round to the lift, the lift way/989772771 west to
 * the tower, way/989772767, then way/989772765 (the drop and the turn round
 * the south-west), way/655715819 (the east loop and the figure eight under
 * the lift) and way/655715820 (the north loop) back to the station: 239 m,
 * against the published 794 ft (242 m). Laid over the USGS NAIP orthophoto
 * (public domain) it follows the track's shadow. The transfer sidings to the
 * maintenance barn (way/323947497, 746810916, 746810917) are not drawn.
 *
 * Profile: Vekoma junior coaster (RCDB 274), a chain lift to 30 ft (9.1 m),
 * 25 mph (40 km/h), one minute. Positions are metres along the OSM polyline:
 *
 *   station, the turn south onto the lift                   s 0-25 (0-11%)
 *   lift west, to 9.1 m, through the checkered tower        s 25-51 (11-21%)
 *   drop, the turn round the south-west, under the lift     s 51-96 (21-40%)
 *   up round the east loop, over the lift's foot            s 96-118 (40-49%)
 *   the figure eight, under the lift again                  s 118-190 (49-79%)
 *   north loop, brakes, station                             s 190-239 (79-100%)
 *
 * Where the circuit crosses itself the heights are set to clear (CLEARANCE=1
 * reports any near miss): it passes over the lift's foot and twice under the
 * lift. Published: lift height, speed, length. Estimated: every other height;
 * the tower (14 m, from the photos against the train at the lift's top; its
 * footprint from NAIP); the station's and barn's heights (the station's 8 m
 * is OSM's).
 *
 * Photos: "The Barnstormer 2012" (Martin Lewison, CC BY-SA 2.0) for the
 * tower and the blue roof; "WDW Magic Kingdom Storybook Circus" (zannaland,
 * CC BY-SA 2.0); Flickr via Openverse: "Magic Kingdom 132" to "138" (Roller
 * Coaster Philosophy, CC BY 2.0) for the track, columns and station, and
 * "Barnstormer" 14249389995 and 14226243526 (HarshLight, CC BY 2.0). Plan:
 * USGS NAIP (public domain).
 *
 * Style: silver-grey track on green columns, as painted; the tower is white
 * with bold red checks; the station has red gables under a blue roof, the barn a blue roof.
 */
import { buildCoaster } from './coaster-kit'
import { Part, type V3 } from './mesh'
import { finish } from './palette'

type XY = [number, number]

const CHAIN: XY[] = [
  [159.4, 130.1], [169.7, 121.2], [170.4, 120.2], [170.9, 118.5], [170.9, 116.5], [170.1, 114.4], [168.2, 112.9], [166.1, 112.1],
  [145.7, 107.6], [141.0, 106.4], [137.3, 105.2], [136.1, 103.4], [135.1, 99.9], [135.6, 97.2], [137.1, 95.5], [140.4, 94.5],
  [143.6, 94.5], [147.2, 96.2], [149.7, 99.5], [150.9, 102.5], [155.0, 114.0], [156.5, 116.3], [158.4, 118.0], [160.8, 118.9],
  [163.6, 118.5], [165.7, 117.1], [166.8, 114.6], [166.6, 112.0], [164.9, 109.5], [156.2, 99.8], [153.4, 97.9], [150.3, 97.9],
  [147.4, 99.8], [146.8, 101.5], [146.8, 104.8], [150.4, 112.7], [151.1, 115.4], [150.9, 118.5], [149.8, 120.4], [148.0, 121.5],
  [146.1, 122.0], [143.9, 121.6], [142.0, 120.8], [140.8, 118.9], [140.4, 116.6], [141.1, 114.6], [142.9, 112.7], [145.3, 111.9],
  [147.7, 112.2], [150.1, 113.9], [151.8, 118.6], [151.3, 123.1], [149.3, 126.9], [143.0, 132.3], [141.7, 134.7], [141.7, 137.3],
  [142.8, 139.8], [145.4, 140.9], [148.3, 140.6], [151.0, 138.4],
]
// The station roof (way/296370637).
const STATION: XY[] = [
  [163.4, 132.8], [162.2, 131.6], [161.5, 132.3], [159.4, 130.1], [156.7, 127.1], [161.2, 123.0], [160.5, 122.2], [161.6, 121.2],
  [162.7, 120.2], [163.2, 120.8], [165.5, 118.8], [166.5, 119.8], [167.5, 118.9], [169.7, 121.2], [170.7, 122.4], [172.7, 124.6],
  [171.3, 125.8], [170.2, 126.8], [171.1, 127.8], [168.2, 130.4], [167.2, 129.4], [165.3, 131.1], [164.6, 131.7],
]
// The Great Goofini maintenance barn (way/296366631).
const BARN: XY[] = [
  [171.8, 80.9], [171.1, 81.2], [170.3, 78.6], [170.1, 78.7], [164.5, 80.3], [165.3, 83.0], [162.0, 83.9], [167.4, 102.2],
  [168.8, 101.8], [170.5, 101.3], [173.9, 100.2], [175.3, 99.8], [176.5, 99.4], [176.8, 99.4], [177.3, 99.2],
]
// The stunt tower at the lift's top: centre, size along and across the lift, height (NAIP, photos).
const TOWER = { at: [143.4, 107.2] as XY, along: 6, across: 7.5, height: 14 }

const RED = finish('barnstormer-red', 0xc85a50)

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]

/** A gabled roof over a footprint's principal-axis box: eaves at z0, ridge at z1, overhang `o`; gable ends into `ends`. */
function gableRoof(roof: Part, ends: Part, ring: XY[], z0: number, z1: number, o: number) {
  const cx = ring.reduce((s, p) => s + p[0], 0) / ring.length, cy = ring.reduce((s, p) => s + p[1], 0) / ring.length
  let sxx = 0, syy = 0, sxy = 0
  for (const [x, y] of ring) { sxx += (x - cx) ** 2; syy += (y - cy) ** 2; sxy += (x - cx) * (y - cy) }
  const th = 0.5 * Math.atan2(2 * sxy, sxx - syy), u: XY = [Math.cos(th), Math.sin(th)], v: XY = [-u[1], u[0]]
  const pu = ring.map(([x, y]) => (x - cx) * u[0] + (y - cy) * u[1]), pv = ring.map(([x, y]) => (x - cx) * v[0] + (y - cy) * v[1])
  const u0 = Math.min(...pu) - o, u1 = Math.max(...pu) + o, v0 = Math.min(...pv) - o, v1 = Math.max(...pv) + o, vm = (v0 + v1) / 2
  const P = (a: number, b: number, z: number): V3 => [cx + u[0] * a + v[0] * b, cy + u[1] * a + v[1] * b, z]
  // The ridge runs along u, the long axis.
  roof.quad(P(u0, v0, z0), P(u1, v0, z0), P(u1, vm, z1), P(u0, vm, z1))
  roof.quad(P(u1, v1, z0), P(u0, v1, z0), P(u0, vm, z1), P(u1, vm, z1))
  roof.quad(P(u0, v1, z0), P(u1, v1, z0), P(u1, v0, z0), P(u0, v0, z0))
  const i = o + 0.05
  ends.tri(P(u1 - i, v0 + o, z0), P(u1 - i, v1 - o, z0), P(u1 - i, vm, z1 - 0.3))
  ends.tri(P(u0 + i, v1 - o, z0), P(u0 + i, v0 + o, z0), P(u0 + i, vm, z1 - 0.3))
}

/** Walls along a footprint from the ground to z, outward-facing. */
function walls(part: Part, ring: XY[], z: number) {
  const area = ring.reduce((s, a, i) => { const b = ring[(i + 1) % ring.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const A0: V3 = [a[0], a[1], -0.3], B0: V3 = [b[0], b[1], -0.3], A1: V3 = [a[0], a[1], z], B1: V3 = [b[0], b[1], z]
    if (area > 0) part.quad(A0, B0, B1, A1)
    else part.quad(B0, A0, A1, B1)
  }
}

await buildCoaster({
  name: 'The Barnstormer',
  out: '../models/wdw-barnstormer.glb',
  origin: [-81.58, 28.4195],
  chain: CHAIN,
  anchor: [155, 112],
  // Magic Kingdom's grade is level here.
  ground: { x0: 100, y0: 50, step: 50, rows: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], base: 30 },
  profile: [
    { name: 'station', s: 0, z: 1 },
    { name: 'turn onto the lift', s: 14, z: 1 },
    { name: 'lift, foot', s: 25.5, z: 1 },
    { name: 'lift, top', s: 46.4, z: 9.1, r: 9 },
    { name: 'through the tower', s: 51, z: 9.1, r: 10 },
    { name: 'drop, turning', s: 63, z: 4.5 },
    { name: 'round the south-west', s: 75, z: 2.4 },
    { name: 'under the lift', s: 92, z: 1.2 },
    { name: 'east loop, climbing', s: 105, z: 4.8 },
    { name: 'over the lift\'s foot', s: 115, z: 5.6 },
    { name: 'figure eight, south', s: 128, z: 3.2 },
    { name: 'over the south-west turn', s: 140, z: 5.4 },
    { name: 'under the lift again', s: 149, z: 3.4 },
    { name: 'under its own track', s: 159, z: 1.0 },
    { name: 'turn', s: 175, z: 2.4 },
    { name: 'over its own track', s: 191, z: 5.6 },
    { name: 'north loop, down', s: 205, z: 1.2 },
    { name: 'brakes', s: 220, z: 1 },
  ],
  lift: [2, 46.4],
  liftHead: 1.1,
  brakes: [{ from: 212, to: 2, z: 1, head: 0.4 }],
  losses: [0.012, 0.0008],
  track: { W: 1.6, RAIL: 0.35, DEPTH: 0.8, SPINE: 0.7 },
  station: { ring: STATION, posts: [[157.8, 127.3], [161.5, 121.6], [165.8, 119.5], [171.9, 125.2], [167.9, 129.9], [162.4, 131.8]], roofZ: 4.5 },
  colours: {
    deck: ['barnstormer-track', 0xbfc6cc], spine: 'deck', supports: ['barnstormer-green', 0x7f9a7c],
    station: ['barnstormer-white', 0xf4f0e8], stationRoof: ['barnstormer-blue', 0x5b80b4],
  },
  supportR: [0.28, 0.32, 0.36],
  supportEvery: 7,
  supportMinZ: 1.4,
  sampleDeg: 11,
  meta: { height: 13, trackLength: 242 },
  extras: (kit) => {
    const red = new Part(), white = kit.parts.stone, blue = kit.parts.roof
    // The station: a gabled blue roof over the kit's eaves, with red gable ends.
    gableRoof(blue, red, STATION.map((q) => kit.toModel(q)), 4.5, 8, 0.4)
    // The maintenance barn: plain walls under a blue corrugated gabled roof (NAIP; its walls are not in any photo).
    {
      const ring = BARN.map((q) => kit.toModel(q))
      walls(white, ring, 5)
      gableRoof(blue, white, ring, 5, 8, 0.5)
    }
    // The stunt tower: a white box with bold red checks on every face, set
    // square to the lift, which runs into it at the top.
    {
      const f = kit.at(48)
      const t: XY = (() => { const l = Math.hypot(f.t[0], f.t[1]); return [f.t[0] / l, f.t[1] / l] })(), n: XY = [-t[1], t[0]]
      const [cx, cy] = kit.toModel(TOWER.at), A = TOWER.along / 2, C = TOWER.across / 2, H = TOWER.height
      const P = (a: number, c: number, z: number): V3 => [cx + t[0] * a + n[0] * c, cy + t[1] * a + n[1] * c, z]
      const corners: [number, number][] = [[-A, -C], [A, -C], [A, C], [-A, C]]
      for (let k = 0; k < 4; k++) {
        const [a0, c0] = corners[k], [a1, c1] = corners[(k + 1) % 4]
        white.quad(P(a0, c0, -0.3), P(a1, c1, -0.3), P(a1, c1, H), P(a0, c0, H))
        // Checks: squares about 2 m, red on alternate squares.
        const w = Math.hypot(a1 - a0, c1 - c0), cols = Math.max(3, Math.round(w / 1.9)), rows = Math.round(H / 2)
        const nx = ((a1 - a0) * t[0] + (c1 - c0) * n[0]) / w, ny = ((a1 - a0) * t[1] + (c1 - c0) * n[1]) / w
        const on: V3 = [ny * 0.04, -nx * 0.04, 0]
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          if ((r + c + k) % 2) continue
          const f0 = c / cols, f1 = (c + 1) / cols, z0 = (r * H) / rows, z1 = ((r + 1) * H) / rows
          const Q = (fr: number, z: number) => add(P(a0 + (a1 - a0) * fr, c0 + (c1 - c0) * fr, z), on)
          red.quad(Q(f0, z0), Q(f1, z0), Q(f1, z1), Q(f0, z1))
        }
      }
      // A red cap.
      red.quad(P(-A, -C, H), P(A, -C, H), P(A, C, H), P(-A, C, H))
    }
    return [{ part: red, material: RED }]
  },
})
