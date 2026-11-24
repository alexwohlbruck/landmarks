/**
 * The Phoenix (Vekoma, 2021), Deno's Wonder Wheel Amusement Park, Coney
 * Island: procedural, CC0-1.0.
 * bun generators/nyc-phoenix-coaster.ts   (REPORT=1 for the element table, CLEARANCE=1 for near misses)
 *
 * Map frame: x east, y north, z up, metres; bearing 0, so the frame is true
 * north. The park frame is metres east and north of lon -73.9778, lat 40.575
 * (the Thunderbolt's and the Cyclone's); the model's origin is the middle of
 * the ride's footprint (see anchor), on the ground. Coney Island is level
 * beach fill here, so the ground is flat. Built with ./coaster-kit.ts.
 *
 * Sources. Ride data: RCDB 18886 (Vekoma Suspended Family Coaster, 375 m
 * model; 1220.5 ft / 372 m of track, 68 ft / 20.7 m high, 34 mph, a
 * booster-wheel lift, one train of ten cars hanging under the rails);
 * Wikipedia "Deno's Wonder Wheel Amusement Park" (a Vekoma Suspended Family
 * Coaster, opened 26 June 2021 on the old West 12th Street lot). OSM maps the
 * ride only as an area (way/1025732072), with no track ways and no station.
 *
 * Plan: traced from New York State orthoimagery (NYS ITS GIS Program Office,
 * wms/2022 and wms/2024, public), where the red track stands out against the
 * asphalt: a red-pixel mask of each year, a hand-drawn chain snapped to the
 * mask's centreline, checked against the other year. The two years agree to
 * about half a metre, so the lean of the tall parts is small. 351 m of plan;
 * the drawn track with its climbs is 358 m against the published 372;
 * top speed 57 km/h against the published 34 mph (55 km/h).
 * The 2019 NAIP predates the ride.
 *
 * The ride as read from the plan and the photos (s along the plan polyline):
 *   station under the timber roof at the north-west, train heading north, s 0-14
 *   180° left turn at the Bowery end onto the lift, s 17-27
 *   booster-wheel lift south along West 12th Street, s 34-80, rails 19 m up
 *   at the crest near the Wonder Wheel (photos 009-011: the lift and its
 *   catwalk climb towards the wheel)
 *   the high 360° right turn at the south end, falling to 13 m, crossing
 *   under the crest where it closes, s 88-119
 *   the drop east to 5.4 m at s 141
 *   north along the east side and round the north-east turnaround, 12 m
 *   a clockwise helix, about one and a half turns, around (-131, -63),
 *     from 12.6 m down to 7 m, s 205-262
 *   a left-hand 360° turn under the south end of the lift, crossing itself,
 *     s 276-325
 *   the brake run north along the west of the helix into the station, s 330-351
 * Heights are estimated from the photos (RCDB gives only the 20.7 m total):
 * the crest from the published height less the spine, the south turn's top
 * from photo "The Phoenix Roller Coaster.jpg" (it reaches about two thirds of
 * the lift), the rest from the photos and the clearances the crossings need
 * for a hanging train (about 4 m between the rails of two crossing tracks).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *   "The Phoenix Roller Coaster.jpg" and "... 001"-"011", Kidfly182, CC BY-SA 4.0
 *   "Phoenix Rollercoaster.jpg", Kidfly182, CC BY-SA 4.0
 *   "PHOENIX Roller Coaster 2021.jpg" (from the Wonder Wheel), Wil540 art, CC BY-SA 4.0
 *   "Phoenix (Deno's Wonder Wheel Amusement Park) 1.jpg", Eden, Janine and Jim, CC BY 2.0
 * Look-only: none.
 *
 * Style: the track as one red ribbon with its red box spine above (rails and
 * spine are the same red in the photos), on chunky yellow columns with an arm
 * over the track, portals where it is high. The lift carries its catwalk on
 * the West 12th Street side, drawn as a yellow walkway with a solid rail. The
 * station is its timber roof on posts.
 *
 * Night: the ride has no lit sign or track lighting in the photos; it stays
 * unlit.
 *
 * Doubts: the direction of travel is read from the lift (it must climb
 * south); the order of the helix and the left turn, and every height but the
 * crest, are estimates; the station track under the roof is hidden in the
 * orthophotos and drawn along the roof's west edge.
 */
import { buildCoaster, type CoasterKit } from './coaster-kit'
import { Part, cross, sub, type V3 } from './mesh'

const ORIGIN: [number, number] = [-73.9778, 40.575]

// The circuit in the park frame, in the direction of travel, from the south
// end of the station (heading north).
const CHAIN: [number, number][] = [
  [-139.6, -54.0], [-139.2, -49.0], [-138.9, -44.0], [-138.8, -40.0], [-139.2, -37.2], [-140.6, -35.4], [-142.3, -35.7], [-143.2, -36.4],
  [-144.1, -37.7], [-144.6, -41.0], [-144.6, -46.0], [-144.6, -52.0], [-144.4, -58.0], [-144.5, -64.0], [-144.4, -70.0], [-144.2, -76.0],
  [-144.2, -82.0], [-144.3, -87.0], [-143.7, -91.4], [-141.9, -94.8], [-140.6, -97.3], [-138.6, -98.8], [-138.6, -100.5], [-137.1, -103.2],
  [-136.4, -106.6], [-137.1, -110.0], [-139.9, -112.0], [-142.3, -111.8], [-143.8, -110.7], [-144.7, -108.7], [-145.1, -106.0], [-144.2, -103.6],
  [-142.6, -101.6], [-140.3, -99.9], [-138.0, -98.8], [-135.1, -97.8], [-131.7, -96.7], [-128.0, -96.2], [-125.3, -94.6], [-123.4, -92.2],
  [-122.6, -89.2], [-121.8, -85.9], [-121.1, -82.0], [-120.9, -78.0], [-120.9, -73.9], [-120.5, -69.9], [-120.1, -65.9], [-119.3, -62.0],
  [-118.5, -58.0], [-118.1, -54.0], [-117.7, -50.2], [-118.5, -46.4], [-120.9, -43.7], [-124.4, -43.3], [-126.7, -44.7], [-128.0, -46.7],
  [-128.5, -49.2], [-128.3, -52.1], [-127.8, -54.9], [-127.4, -57.8], [-126.0, -60.0], [-125.1, -62.6], [-125.9, -65.1], [-126.7, -67.4],
  [-128.4, -69.0], [-130.8, -69.6], [-133.8, -68.6], [-136.2, -65.9], [-137.1, -62.6], [-137.1, -59.6], [-136.4, -56.6], [-133.4, -56.4],
  [-130.5, -57.1], [-127.5, -56.9], [-125.6, -58.9], [-124.2, -61.0], [-123.2, -63.6], [-122.9, -66.2], [-123.5, -68.8], [-125.2, -72.0],
  [-128.4, -74.3], [-131.5, -75.8], [-134.4, -76.6], [-137.4, -77.5], [-140.0, -78.4], [-142.4, -79.8], [-144.0, -82.0], [-144.6, -85.0],
  [-143.9, -88.2], [-141.8, -91.0], [-138.6, -91.7], [-135.8, -92.6], [-132.9, -92.4], [-130.1, -90.9], [-128.6, -88.2], [-128.8, -84.9],
  [-130.5, -82.1], [-132.5, -79.3], [-134.3, -76.8], [-136.6, -74.0], [-138.8, -71.0], [-140.8, -67.8], [-141.6, -64.4], [-141.4, -61.0],
  [-140.6, -57.6],
]

// The station's timber roof, from the orthophotos.
const STATION: [number, number][] = [[-140.6, -38.3], [-130.6, -38.7], [-130.6, -54.0], [-140.6, -54.0]]

const LIFT: [number, number] = [32, 80]

/** A tube of `sides` faces from a to b. */
function tube(p: Part, a: V3, b: V3, r: number, sides = 8) {
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

/**
 * The lift's own structure, as photos 009-011 show it: a yellow portal every
 * 7 m (a column either side and a beam over the spine, the train hanging
 * between), and the catwalk on the West 12th Street side (riders' right),
 * at the train's level, with a solid outer rail. The kit's own supports are
 * left out over the lift (`bents` with no bents).
 */
function extras(kit: CoasterKit) {
  const yellow = kit.parts.supports
  const quad = (p: Part, a: V3, b: V3, c: V3, d: V3) => { p.tri(a, b, c); p.tri(a, c, d) }
  const box = (p: Part, A: V3[], B: V3[]) => {
    for (let k = 0; k < 4; k++) quad(p, A[k], A[(k + 1) % 4], B[(k + 1) % 4], B[k])
    quad(p, A[3], A[2], A[1], A[0]); quad(p, B[0], B[1], B[2], B[3])
  }
  const right = (f: { t: V3 }) => { const h = Math.hypot(f.t[0], f.t[1]); return [f.t[1] / h, -f.t[0] / h] as const }
  const { DEPTH } = kit.track
  // Portals.
  for (let s = LIFT[0] + 3; s <= LIFT[1] + 4; s += 7) {
    const f = kit.at(s), [rx, ry] = right(f)
    const top = f.p[2] + DEPTH + 0.5
    const at = (o: number, z: number): V3 => [f.p[0] + rx * o, f.p[1] + ry * o, z]
    const g = kit.ground(f.p[0], f.p[1])
    tube(yellow, at(3.1, g - 0.5), at(3.1, top + 0.3), 0.45)
    tube(yellow, at(-1.7, g - 0.5), at(-1.7, top + 0.3), 0.45)
    tube(yellow, at(-2.1, top), at(3.5, top), 0.38)
  }
  // Catwalk.
  const STEP = 3
  for (let s = LIFT[0] + 2; s < LIFT[1] - 1; s += STEP) {
    const ends = [kit.at(s), kit.at(Math.min(s + STEP, LIFT[1] - 1))].map((f) => {
      const [rx, ry] = right(f)
      return { c: [f.p[0] + rx * 1.9, f.p[1] + ry * 1.9, f.p[2] - 1.7] as V3, rx, ry }
    })
    const slab = (o0: number, o1: number, z0: number, z1: number) => ends.map(({ c, rx, ry }) => [
      [c[0] + rx * o0, c[1] + ry * o0, c[2] + z0], [c[0] + rx * o1, c[1] + ry * o1, c[2] + z0],
      [c[0] + rx * o1, c[1] + ry * o1, c[2] + z1], [c[0] + rx * o0, c[1] + ry * o0, c[2] + z1],
    ] as V3[])
    const deck = slab(-0.5, 0.5, -0.3, 0), rail = slab(0.38, 0.52, 0, 1.1)
    box(yellow, deck[0], deck[1])
    box(yellow, rail[0], rail[1])
  }
  return []
}

await buildCoaster({
  name: 'The Phoenix',
  out: '../models/nyc-phoenix-coaster.glb',
  origin: ORIGIN,
  chain: CHAIN,
  anchor: [-131, -74],
  // Coney Island is level beach fill under the ride: a flat ground.
  ground: { x0: -300, y0: -250, step: 200, rows: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], base: 2 },
  // Heights of the rails above the ground; s along the plan polyline (351 m round).
  profile: [
    { name: 'station', s: 0, z: 3.6 },
    { name: 'station, north end', s: 14, z: 3.6 },
    { name: 'foot of the lift', s: 32, z: 3.8, r: 12 },
    { name: 'lift crest, by the Wonder Wheel', s: 80, z: 19, r: 14 },
    { name: 'over the south turn', s: 88, z: 17.6 },
    { name: 'south turn, out (under the crest)', s: 120, z: 12.6 },
    { name: 'foot of the drop east', s: 141, z: 5.4, r: 12 },
    { name: 'east side', s: 165, z: 9 },
    { name: 'north-east turnaround', s: 192, z: 12 },
    { name: 'into the helix', s: 207, z: 12.6 },
    { name: 'helix, second turn under the first', s: 249, z: 7.0 },
    { name: 'out of the helix', s: 262, z: 7.2 },
    { name: 'into the left turn (over its exit)', s: 276, z: 8.6 },
    { name: 'under the lift', s: 290, z: 6.6 },
    { name: 'left turn, south side', s: 306, z: 5 },
    { name: 'left turn, out (under its entry)', s: 325, z: 3.8 },
    { name: 'brakes', s: 333, z: 3.7 },
  ],
  lift: LIFT,
  brakes: [{ from: 333, to: 32, z: 3.7, head: 0.5 }],
  losses: [0.02, 0.001],
  inverted: { clear: 3, reach: 2 },
  track: { W: 1.3, RAIL: 0.3, DEPTH: 0.9, SPINE: 0.65 }, // a little bolder than the real track, to read at map scale
  station: { ring: STATION, posts: [[-140.3, -38.6], [-130.9, -38.9], [-130.9, -53.7], [-140.3, -53.7], [-135.7, -38.8], [-135.7, -53.7]], roofZ: 6.2 },
  // Colours from the photos, pulled to the palette's lightness: red rails and
  // spine, yellow supports, the timber station roof.
  colours: {
    deck: ['phoenix-red', 0xd4473c], spine: 'deck', supports: ['phoenix-yellow', 0xeac844],
    station: ['phoenix-timber', 0xa98058], stationRoof: ['phoenix-roof', 0xb88d63],
  },
  supportR: [0.42, 0.5, 0.58],
  supportEvery: 7,
  bents: [{ from: LIFT[0], to: LIFT[1] + 6, at: [] }],
  sampleDeg: 12,
  meta: { height: 20.7, trackLength: 372 },
  extras,
})
