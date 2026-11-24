/**
 * Tony's Express (Zamperla, 2023), Luna Park, Coney Island: procedural, CC0-1.0.
 * bun generators/nyc-tonys-express.ts   (REPORT=1 for the element table and energy check)
 *
 * Map frame: x east, y north, z up, metres; bearing 0, so the frame is true
 * north. Coordinates are in the park frame shared with the Cyclone and the
 * Thunderbolt: metres east and north of lon -73.9778, lat 40.575. The
 * model's origin is the middle of the track's footprint (see anchor), on the
 * ground. Luna Park is level beach fill, but the map's terrain under it
 * rises about 1.5 m from pits by the Thunderbolt, so the ground is that grid.
 * Built with ./coaster-kit.ts.
 *
 * Sources. Ride data: RCDB 17674 (Zamperla Junior Coaster, J2SK 400 m
 * Combo; 1312.3 ft / 400 m of track, 49.9 ft / 15.2 m high, 26.1 mph /
 * 42 km/h, no inversions, a booster-wheel lift). Wikipedia "Luna Park, Coney
 * Island (2010)": the family coaster and the log flume were built together
 * on the lot by the Thunderbolt and named Tony's Express and Leti's Treasure
 * in 2022. Plan: the four OSM `roller_coaster=track` ways (way/1483353313,
 * way/1483353314, way/1483353315, way/1483353316), chained in their drawn
 * direction, which is the ride's: out of the station south, a tight left
 * turn, the lift north-north-west to the tower. Checked against the New York
 * State orthoimagery of spring 2024 (NYS ITS GIS program, public): the
 * dark-green track with its rows of bulbs, the helix around the tower at the
 * north-west corner, the two 360° helices at the south-east and north-east,
 * and the station under the west wing of the teal roof sit on the trace.
 * Drawn track 398 m (published 400).
 *
 * The ride as modelled (s along the polyline from the north end of the
 * station, heights of the running surface; all estimated from the photos
 * against the published 15.2 m, except the lift top):
 *   station, 1.2 m, s 0-24, under the west wing of the shared station roof
 *   lift, s 36-76, to the published 15.2 m at the tower
 *   a descending right-hand helix round the tower, s 80-112, out at 6 m
 *     under the lift
 *   up the west side to a 10.5 m crest (the long high run in the photo from
 *     the south-west), the drop at the south-west corner to 2.5 m, along the
 *     boardwalk, up to 7 m
 *   the south-east helix, descending to 1.8 m, s 188-232
 *   a hill up the east side, 7 m, s 255
 *   the north-east helix, climbing from 2 to 7.2 m, s 285-330
 *   the north turn at 7.2 m, then the brake run down the long straight back
 *     into the station
 * Heights are above the map's ground (Mapterhorn), which is the park's level
 * about 1.5 m over pits in the DEM by the Thunderbolt (see `ground`).
 * Every crossing of the plan is at least 4.5 m apart in height; two
 * side-by-side runs pass 2.6-2.8 m apart in plan with 3.7-4.4 m between them.
 *
 * The tower: a white open frame of four corner posts, an arch on each face
 * at every stage, under a teal pyramid roof with a gold pennant, about 25 m
 * to the pennant's tip; it stands on the navy show building at its foot
 * (way/1483353312, 14.5 x 5.2 m, about 5.5 m high), round which the first
 * helix winds. A row of gold arches lined with bulbs spans the lift. All
 * from the photos; the tower's height is estimated against the 15.2 m track.
 *
 * Lidar (USGS NY_NewYorkCity, 2017) predates the ride and isn't used.
 *
 * Photos (EVIDENCE):
 *   "Coney Island Brooklyn July 2024 031", "032", "033", "035", "041",
 *     Kidfly182, Wikimedia Commons, CC BY 4.0 (the tower, the arches over the
 *     lift, the track and its supports from the boardwalk, the gate)
 *   "Luna Park" (flickr 53159273620), Roller Coaster Philosophy, CC BY 2.0
 *     (2023, the ride from the south-west at dusk, bulbs lit)
 * Look-only: none.
 *
 * Style: one broad dark-green ribbon (rails and spine in the photos' green,
 * pulled to the palette's lightness), drawn bolder than the real 0.9 m track,
 * on chunky dark-teal columns. The station is a teal roof on posts. The
 * arches over the lift and the tower's pennant are `neon` gold: they are
 * lined with bulbs that are lit at night.
 *
 * Doubts: every height but the lift's top is estimated (no open photo shows
 * the whole ride from the side); the ride's direction comes from the OSM
 * ways and the lift's place in the photos; modelled top speed is 54 km/h
 * against the published 42 km/h (the drops are probably shallower than
 * drawn, or the ride brakes more).
 */
import { buildCoaster, type CoasterKit } from './coaster-kit'
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const ORIGIN: [number, number] = [-73.9778, 40.575]

// The OSM circuit, node by node in the direction of travel, from the north
// end of the station (way/1483353316's last stretch) heading south.
const CHAIN: [number, number][] = [
  [-411.0, -181.0], [-410.9, -183.9], [-410.7, -185.4], [-408.4, -205.3], [-408.2, -206.7], [-408.5, -207.6], [-409.3, -209.0],
  [-410.7, -209.9], [-412.1, -209.7], [-413.5, -207.8], [-416.2, -198.9], [-425.4, -170.9], [-426.5, -167.7], [-426.9, -165.9],
  [-427.0, -164.9], [-426.2, -162.3], [-424.9, -160.6], [-423.2, -159.5], [-421.4, -159.3], [-419.9, -159.5], [-418.3, -160.2],
  [-417.2, -161.3], [-416.2, -162.8], [-415.7, -164.6], [-415.9, -166.3], [-416.2, -168.0], [-417.3, -169.7], [-418.6, -171.6],
  [-421.4, -174.7], [-422.7, -176.5], [-424.1, -179.0], [-424.7, -181.6], [-424.9, -184.1], [-424.8, -186.9], [-424.3, -190.3],
  [-423.1, -198.6], [-422.5, -205.5], [-421.8, -210.4], [-420.9, -213.0], [-419.6, -216.1], [-418.4, -217.7], [-416.8, -218.6],
  [-414.7, -219.0], [-411.1, -219.2], [-408.5, -219.1], [-404.9, -218.3], [-403.4, -217.3], [-394.7, -210.4], [-391.9, -208.4],
  [-389.5, -207.0], [-386.4, -206.1], [-383.8, -205.6], [-381.6, -205.7], [-379.6, -206.3], [-377.7, -207.0], [-376.3, -208.5],
  [-375.2, -210.5], [-375.0, -212.6], [-375.5, -215.1], [-376.3, -216.9], [-377.8, -218.2], [-379.8, -219.3], [-380.9, -219.5],
  [-383.8, -219.4], [-385.8, -218.5], [-387.4, -216.8], [-388.8, -214.3], [-389.3, -211.6], [-389.2, -208.9], [-388.9, -207.5],
  [-388.0, -204.5], [-386.8, -201.4], [-385.5, -197.7], [-384.7, -194.7], [-384.6, -192.3], [-384.9, -190.2], [-385.8, -187.4],
  [-387.1, -185.1], [-388.7, -182.5], [-389.9, -180.3], [-390.7, -178.3], [-391.4, -176.4], [-391.7, -174.3], [-391.3, -171.6],
  [-388.9, -162.3], [-388.2, -158.6], [-388.6, -156.1], [-389.1, -154.1], [-390.1, -152.4], [-391.5, -150.6], [-392.7, -149.8],
  [-393.8, -149.1], [-395.9, -148.5], [-397.3, -148.5], [-398.4, -148.7], [-399.5, -148.9], [-400.9, -149.6], [-401.9, -150.8],
  [-402.0, -152.3], [-401.9, -154.5], [-401.6, -158.2], [-400.5, -159.8], [-399.2, -160.7], [-397.7, -161.0], [-395.7, -161.0],
  [-394.3, -160.6], [-392.2, -159.4], [-390.9, -158.3], [-389.9, -156.8], [-389.4, -155.6], [-388.5, -153.2], [-388.2, -150.5],
  [-389.1, -145.8], [-391.6, -143.0], [-394.3, -141.9], [-400.1, -141.7], [-401.4, -142.4], [-402.9, -144.1], [-404.1, -146.3],
  [-404.8, -149.2], [-407.8, -165.5], [-410.8, -178.6],
]

// The tower stands in the middle of the first helix, on the show building.
const TOWER: [number, number] = [-421.6, -165.4]
const SHOW = [[-429.9, -160.9], [-425.9, -157.6], [-414.8, -170.7], [-418.8, -174.0]] as [number, number][]

const GREEN = 0x3f8a73, TEAL_DARK = 0x2f6a66, TEAL_ROOF = 0x63b3a6, NAVY = 0x34508f, GOLD = 0xd8b25c

function tube(p: Part, a: V3, b: V3, r: number, sides = 6) {
  const ax = sub(b, a), L = Math.hypot(...ax), n: V3 = [ax[0] / L, ax[1] / L, ax[2] / L]
  const ref: V3 = Math.abs(n[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  let u = cross(n, ref); const ul = Math.hypot(...u); u = [u[0] / ul, u[1] / ul, u[2] / ul]
  const v = cross(n, u)
  const ring = (c: V3, k: number): [V3, V3] => {
    const t = (k / sides) * 2 * Math.PI, d: V3 = [u[0] * Math.cos(t) + v[0] * Math.sin(t), u[1] * Math.cos(t) + v[1] * Math.sin(t), u[2] * Math.cos(t) + v[2] * Math.sin(t)]
    return [[c[0] + d[0] * r, c[1] + d[1] * r, c[2] + d[2] * r], d]
  }
  for (let k = 0; k < sides; k++) {
    const [a0, n0] = ring(a, k), [a1, n1] = ring(a, k + 1), [b0] = ring(b, k), [b1] = ring(b, k + 1)
    p.tri(a0, a1, b1, undefined, undefined, undefined, [n0, n1, n1])
    p.tri(a0, b1, b0, undefined, undefined, undefined, [n0, n1, n0])
  }
}
/** A closed prism over a convex plan ring (any winding), from z0 to z1. */
function prism(p: Part, ring: [number, number][], z0: number, z1: number, top = true) {
  const area = ring.reduce((s, q, i) => s + q[0] * ring[(i + 1) % ring.length][1] - ring[(i + 1) % ring.length][0] * q[1], 0)
  const r = area < 0 ? [...ring].reverse() : ring
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (top) for (let i = 1; i + 1 < r.length; i++) p.tri([r[0][0], r[0][1], z1], [r[i][0], r[i][1], z1], [r[i + 1][0], r[i + 1][1], z1])
}
/** A pyramid roof over a square, half size h, eaves at z0, tip at z1, with a band of eave depth `t`. */
function pyramid(p: Part, c: [number, number], h: number, z0: number, z1: number) {
  const cs: [number, number][] = [[-h, -h], [h, -h], [h, h], [-h, h]]
  for (let i = 0; i < 4; i++) {
    const a = cs[i], b = cs[(i + 1) % 4]
    p.tri([c[0] + a[0], c[1] + a[1], z0], [c[0] + b[0], c[1] + b[1], z0], [c[0], c[1], z1])
  }
  for (let i = 1; i < 3; i++) p.tri([c[0] + cs[0][0], c[1] + cs[0][1], z0], [c[0] + cs[i + 1][0], c[1] + cs[i + 1][1], z0], [c[0] + cs[i][0], c[1] + cs[i][1], z0])
}
/** A semicircular arch of square section `w`, springing from a and b (same height), bowed up. */
function arch(p: Part, a: V3, b: V3, w: number, n = 8, rise?: number) {
  const c: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]
  const half: V3 = [(b[0] - a[0]) / 2, (b[1] - a[1]) / 2, (b[2] - a[2]) / 2]
  const R = Math.hypot(...half), up = rise ?? R
  const u: V3 = [half[0] / R, half[1] / R, half[2] / R]
  const side = cross(u, [0, 0, 1]); const sl = Math.hypot(...side) || 1
  const s: V3 = [side[0] / sl, side[1] / sl, side[2] / sl]
  const secs: V3[][] = []
  for (let k = 0; k <= n; k++) {
    const t = Math.PI - (Math.PI * k) / n
    const q: V3 = [c[0] + half[0] * Math.cos(t), c[1] + half[1] * Math.cos(t), c[2] + half[2] * Math.cos(t) + up * Math.sin(t)]
    // radial direction in the arch's plane
    const rd: V3 = [u[0] * Math.cos(t) * R, u[1] * Math.cos(t) * R, up * Math.sin(t)]
    const rl = Math.hypot(...rd) || 1, r: V3 = [rd[0] / rl, rd[1] / rl, rd[2] / rl]
    const o = (i: number, j: number): V3 => [q[0] + r[0] * i * w / 2 + s[0] * j * w / 2, q[1] + r[1] * i * w / 2 + s[1] * j * w / 2, q[2] + r[2] * i * w / 2 + s[2] * j * w / 2]
    secs.push([o(-1, -1), o(1, -1), o(1, 1), o(-1, 1)])
  }
  p.sweep(secs)
}

function extras(kit: CoasterKit) {
  const white = new Part(), gold = new Part()
  const navy = kit.parts.stone, roof = kit.parts.roof
  const m = (q: [number, number]) => kit.toModel(q)

  // The show building at the tower's foot (way/1483353312): a navy box
  // under a teal roof.
  const [gx0, gy0] = m(TOWER), G0 = kit.ground(gx0, gy0)
  const SHOW_H = G0 + 5.5
  const show = SHOW.map(m)
  prism(navy, show, -0.5, SHOW_H - 0.4, false)
  prism(roof, show, SHOW_H - 0.4, SHOW_H)

  // The tower: four white corner posts on the show building's roof, a band
  // and an arch on each face at every stage, a cornice and a teal pyramid.
  const [tx, ty] = m(TOWER)
  const H = 2.5, STAGES = [SHOW_H, G0 + 10.0, G0 + 14.6, G0 + 19.2], TOP = G0 + 19.2
  const cs: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  const P = (c: [number, number], z: number): V3 => [tx + c[0] * H, ty + c[1] * H, z]
  for (const c of cs) tube(white, P(c, SHOW_H - 0.2), P(c, TOP + 0.2), 0.3, 4)
  for (let k = 0; k < STAGES.length; k++) {
    const z = STAGES[k]
    for (let i = 0; i < 4; i++) {
      const a = cs[i], b = cs[(i + 1) % 4]
      if (k > 0) tube(white, P(a, z), P(b, z), 0.2, 4)
      if (k + 1 < STAGES.length) {
        // An arch spanning the face just under the next band.
        const z1 = STAGES[k + 1] - H - 0.3
        arch(white, P(a, z1), P(b, z1), 0.3, 6)
      }
    }
  }
  // Cornice and the teal pyramid with its gold pennant.
  prism(white, cs.map((c) => [tx + c[0] * (H + 0.35), ty + c[1] * (H + 0.35)] as [number, number]), TOP, TOP + 0.7)
  pyramid(roof, [tx, ty], H + 0.7, TOP + 0.7, TOP + 4.6)
  tube(gold, [tx, ty, TOP + 4.4], [tx, ty, TOP + 6.4], 0.1, 4)
  gold.tri([tx, ty, TOP + 6.4], [tx, ty, TOP + 5.5], [tx + 1.6, ty, TOP + 5.95])
  gold.tri([tx, ty, TOP + 6.4], [tx + 1.6, ty, TOP + 5.95], [tx, ty, TOP + 5.5])

  // The gold arches over the lift: hoops springing from either side of the
  // track, one every 4 m of the lift.
  for (let ps = 40; ps <= 74; ps += 4) {
    const q = kit.at(ps)
    const l: V3 = [q.left[0], q.left[1], 0], ll = Math.hypot(...l) || 1
    const L: V3 = [l[0] / ll * 2.2, l[1] / ll * 2.2, 0]
    const base = q.p[2] + 0.4
    const a: V3 = [q.p[0] + L[0], q.p[1] + L[1], base], b: V3 = [q.p[0] - L[0], q.p[1] - L[1], base]
    arch(gold, a, b, 0.32, 6, 3.0)
  }
  return [
    { part: white, material: PALETTE.trim },
    { part: gold, material: finish('neon-tony-bulbs', GOLD) },
  ]
}

await buildCoaster({
  name: "Tony's Express",
  out: '../models/nyc-tonys-express.glb',
  origin: ORIGIN,
  chain: CHAIN,
  anchor: [-401, -180],
  // The map's ground (Mapterhorn, `bun tools/terrain.ts grid -73.9825189
  // 40.573345 45 5`, the same grid as Leti's Treasure), averaged over 3 x 3
  // cells to take out the DEM's bumps: rows south to north from y -228,
  // columns west to east from x -444, every 5 m, metres above its lowest point.
  ground: {
    x0: -444, y0: -228, step: 5, base: 1.11,
    rows: [
      [3.0, 2.8, 2.3, 1.9, 1.9, 2.1, 2.3, 2.4, 2.5, 2.5, 2.5, 2.5, 2.5, 2.3, 1.8, 1.4, 1.2, 1.2, 1.2],
      [3.0, 2.7, 2.2, 1.8, 1.7, 2.0, 2.2, 2.3, 2.3, 2.2, 2.2, 2.2, 2.2, 2.0, 1.6, 1.2, 0.9, 1.0, 1.0],
      [2.9, 2.5, 2.0, 1.6, 1.6, 1.8, 2.0, 2.1, 2.0, 1.9, 1.8, 1.7, 1.8, 1.6, 1.2, 0.8, 0.5, 0.9, 1.1],
      [2.7, 2.4, 1.8, 1.5, 1.5, 1.6, 1.8, 2.0, 1.8, 1.6, 1.4, 1.4, 1.4, 1.4, 1.0, 0.6, 0.3, 0.9, 1.2],
      [2.4, 2.1, 1.7, 1.5, 1.5, 1.6, 1.8, 1.9, 1.8, 1.5, 1.4, 1.3, 1.4, 1.2, 0.8, 0.5, 0.4, 1.0, 1.3],
      [2.0, 1.9, 1.6, 1.5, 1.5, 1.6, 1.7, 1.8, 1.7, 1.5, 1.4, 1.4, 1.4, 1.1, 0.7, 0.4, 0.4, 0.9, 1.1],
      [1.7, 1.6, 1.5, 1.5, 1.5, 1.5, 1.6, 1.6, 1.6, 1.5, 1.4, 1.4, 1.3, 1.1, 0.7, 0.5, 0.6, 0.9, 1.1],
      [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.4, 1.4, 1.3, 1.2, 1.0, 0.8, 0.9, 1.1, 1.2],
      [1.4, 1.4, 1.4, 1.5, 1.5, 1.5, 1.5, 1.5, 1.4, 1.5, 1.5, 1.5, 1.4, 1.4, 1.3, 1.2, 1.3, 1.3, 1.4],
      [1.4, 1.4, 1.4, 1.5, 1.5, 1.5, 1.5, 1.4, 1.4, 1.5, 1.5, 1.6, 1.6, 1.4, 1.3, 1.2, 1.3, 1.4, 1.5],
      [1.4, 1.4, 1.4, 1.5, 1.5, 1.6, 1.5, 1.5, 1.3, 1.4, 1.5, 1.7, 1.6, 1.4, 1.0, 0.9, 1.1, 1.2, 1.4],
      [1.4, 1.4, 1.4, 1.5, 1.5, 1.6, 1.5, 1.4, 1.3, 1.3, 1.3, 1.6, 1.6, 1.3, 0.8, 0.6, 0.9, 1.1, 1.4],
      [1.4, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.4, 1.4, 1.3, 1.3, 1.5, 1.6, 1.2, 0.7, 0.5, 0.8, 1.1, 1.4],
      [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.4, 1.3, 1.3, 1.5, 1.4, 1.1, 0.6, 0.5, 0.8, 1.2, 1.4],
      [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.4, 1.4, 1.3, 1.5, 1.3, 1.0, 0.5, 0.5, 0.9, 1.2, 1.4],
      [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.4, 1.4, 1.3, 1.5, 1.3, 0.9, 0.4, 0.6, 0.9, 1.3, 1.5],
      [1.6, 1.5, 1.5, 1.5, 1.5, 1.5, 1.4, 1.4, 1.3, 1.3, 1.5, 1.8, 1.4, 0.9, 0.4, 0.7, 1.1, 1.4, 1.5],
      [1.6, 1.5, 1.4, 1.4, 1.4, 1.4, 1.4, 1.3, 1.2, 1.3, 1.6, 1.9, 1.5, 0.8, 0.3, 0.7, 1.1, 1.5, 1.6],
      [1.6, 1.5, 1.4, 1.4, 1.4, 1.4, 1.4, 1.3, 1.2, 1.3, 1.7, 2.1, 1.6, 0.8, 0.2, 0.7, 1.2, 1.6, 1.6],
    ],
  },
  profile: [
    { name: 'station', s: 0, z: 1.2 },
    { name: 'station, south end', s: 24, z: 1.2 },
    { name: 'foot of the lift', s: 36, z: 1.2, r: 8 },
    { name: 'top of the lift', s: 76, z: 15.2, r: 6 },
    { name: 'into the tower helix', s: 80, z: 15.0 },
    { name: 'tower helix, out under the lift', s: 112, z: 6.0 },
    { name: 'west run, crest', s: 132, z: 10.5 },
    { name: 'west run', s: 145, z: 9.0 },
    { name: 'foot of the drop at the south-west corner', s: 160, z: 2.5 },
    { name: 'along the boardwalk', s: 168, z: 2.5 },
    { name: 'south-east helix, in', s: 188, z: 7.0 },
    { name: 'south-east helix, out', s: 232, z: 1.8 },
    { name: 'east hill', s: 255, z: 7.0 },
    { name: 'valley', s: 276, z: 2.0 },
    { name: 'north-east helix, in', s: 285, z: 2.0 },
    { name: 'north-east helix, out', s: 330, z: 7.2 },
    { name: 'north turn', s: 352, z: 7.2 },
    { name: 'brake run', s: 362, z: 6.0 },
    { name: 'into the station', s: 386, z: 1.2 },
  ],
  lift: [36, 76],
  liftHead: 1.0,
  brakes: [{ from: 362, to: 36, z: 1.2, head: 0.5 }],
  losses: [0.012, 0.0008],
  track: { W: 1.9, RAIL: 0.35, DEPTH: 0.9, SPINE: 0.7 }, // drawn bolder than the real track so it reads at map scale
  station: {
    // The west wing of the shared station roof (way/1483353311); the rest is Leti's Treasure's.
    ring: [[-412.3, -189.3], [-406.3, -188.4], [-405.7, -192.6], [-404.6, -205.6], [-409.6, -206.4]],
    posts: [[-411.9, -190.2], [-406.6, -189.4], [-405.3, -204.8], [-409.4, -205.5]],
    roofZ: 6,
  },
  colours: { deck: ['tony-green', GREEN], spine: 'deck', supports: ['tony-teal', TEAL_DARK], station: ['tony-navy', NAVY], stationRoof: ['tony-teal-roof', TEAL_ROOF] },
  supportR: [0.28, 0.34, 0.42],
  supportEvery: 10,
  meta: { height: 25.6, trackLength: 400 },
  extras,
})
