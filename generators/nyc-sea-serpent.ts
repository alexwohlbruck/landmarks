/**
 * Sea Serpent (E&F Miler), Deno's Wonder Wheel Amusement Park, Coney Island:
 * procedural, CC0-1.0.
 * bun generators/nyc-sea-serpent.ts   (REPORT=1 for the element table, CLEARANCE=1 for near misses)
 *
 * Map frame: x east, y north, z up, metres; bearing 0, so the frame is true
 * north. The park frame is metres east and north of lon -73.9778, lat 40.575
 * (the Thunderbolt's and the Cyclone's); the model's origin is the middle of
 * the ride's footprint (see anchor), on the ground. Coney Island is level
 * beach fill here, so the ground is flat. Built with ./coaster-kit.ts.
 *
 * Sources. Ride data: RCDB 672 (E&F Miler Industries family coaster, custom
 * layout, a chain lift, one train of six cars, two across). RCDB gives no
 * height or length. OSM: the ride (node/8816101533) and its two
 * `roller_coaster=track` ways, way/952516017 and the short way/1065967700,
 * tagged layer 1, which closes the circuit over the outer loop: 87 m round.
 * Plan checked against New York State orthoimagery (NYS ITS GIS Program
 * Office, wms/2022 and wms/2024, public): the inner ring, the outer loop and
 * the long straight along the station canopy sit on the trace.
 *
 * Direction. The ways are tagged oneway in node order, but in that order the
 * train would reach its highest point, the layer-1 bridge over the outer
 * loop, at the end of the ride with no lift before it. Reversed, the ride
 * reads as E&F Miler's family coasters do: out of the station along the
 * straight (south-east), round the south end, up the chain lift on the east
 * side, over the bridge at the crest, down round the inner ring and under the
 * bridge, round the outer loop and back along the north side into the
 * station. So the circuit is drawn reversed, and the trace is otherwise as
 * mapped.
 *
 * The ride as modelled (s along the polyline, heights of the rails):
 *   station on the straight, s 0-11, 0.7 m (a deck at a child's step)
 *   chain lift up the east side, s 21-31, to 4.2 m at the crest on the bridge
 *   the inner ring, falling, s 34-57
 *   under the bridge, 1 m, s 60
 *   the outer loop and the north side, 1.5-1.8 m, back to the station
 * Every height is estimated: from the photos (the lift reaches a little over
 * twice a grown-up's height; the low runs a knee's height off the ground)
 * and E&F Miler's family coasters of this size, 4 to 5 m high.
 *
 * Photos (Flickr, EVIDENCE): "Sea Serpent" (3960757287 and 7917653006) and
 * "Sabena & Eden" (7917607510), edenpictures, CC BY 2.0: the mauve tubular
 * track with its ladder ties, the charcoal A-frame supports, the green
 * serpent train with its head, the timber station deck.
 * Look-only: "Coney Island 2003 - Wonder Wheel & Sea Serpent", Spatch,
 * CC BY-NC 2.0 (not used for any shape or colour).
 *
 * Style: the track as a narrow mauve ribbon over its spine, on charcoal
 * columns, a knee's height off the ground on the low runs; the station a
 * timber canopy on posts over the deck. The green serpent train stands in the
 * station, its head at the front: it is what people know the ride by.
 *
 * Night: no lit sign or lights on the ride in the photos; it stays unlit.
 *
 * Doubts: the direction (above) and every height; the photos are from 2009
 * and 2012, and the track's colour in the 2022-2024 orthophotos is a faded
 * mauve-grey that agrees with them, but it may have been repainted.
 */
import { buildCoaster, type CoasterKit } from './coaster-kit'
import { Part, type V3 } from './mesh'
import { finish } from './palette'

const ORIGIN: [number, number] = [-73.9778, 40.575]

// The OSM circuit (way/952516017 and way/1065967700) reversed, node by node in
// the direction of travel, from the north-west end of the station straight.
const CHAIN: [number, number][] = [
  [-111.4, -131.3], [-108.5, -136.7], [-106.1, -141.2], [-105.0, -143.3], [-103.8, -144.8], [-101.8, -145.9], [-99.8, -145.8], [-98.4, -145.0],
  [-97.8, -143.3], [-97.7, -140.8], [-98.1, -137.8], [-99.0, -132.9], [-99.5, -130.3], [-100.9, -129.0], [-103.5, -128.6], [-105.9, -129.2],
  [-107.3, -130.8], [-107.7, -133.2], [-107.0, -135.9], [-105.3, -137.0], [-103.4, -137.5], [-100.9, -137.1], [-99.4, -136.1], [-96.8, -133.9],
  [-96.1, -131.8], [-96.3, -129.7], [-97.6, -127.6], [-99.8, -126.7], [-102.1, -126.6], [-105.0, -126.1], [-108.1, -125.9], [-110.4, -126.9],
  [-111.6, -129.1],
]

// The station straight runs south-east, (U); the deck and canopy are on its
// north-east side (V), the riders' left, as in the photos.
const S0: [number, number] = [-111.4, -131.3], S1: [number, number] = [-106.1, -141.2]
const SL = Math.hypot(S1[0] - S0[0], S1[1] - S0[1])
const U: [number, number] = [(S1[0] - S0[0]) / SL, (S1[1] - S0[1]) / SL], V: [number, number] = [-U[1], U[0]]
const st = (a: number, b: number): [number, number] => [S0[0] + U[0] * a + V[0] * b, S0[1] + U[1] * a + V[1] * b]
const STATION: [number, number][] = [st(0.3, -0.9), st(9.3, -0.9), st(9.3, 2.4), st(0.3, 2.4)]

const LIFT: [number, number] = [21.4, 31]

/** The green serpent train, standing in the station with its head to the south-east. */
function extras(kit: CoasterKit) {
  const green = new Part()
  const quad = (a: V3, b: V3, c: V3, d: V3) => { green.tri(a, b, c); green.tri(a, c, d) }
  // A box along the station straight: centre (a along U, b along V), half sizes, from z0 to z1.
  const block = (a: number, b: number, ha: number, hb: number, z0: number, z1: number) => {
    const [cx, cy] = kit.toModel(st(a, b))
    const P = (i: number, j: number, z: number): V3 => [cx + U[0] * ha * i + V[0] * hb * j, cy + U[1] * ha * i + V[1] * hb * j, z]
    quad(P(-1, -1, z1), P(1, -1, z1), P(1, 1, z1), P(-1, 1, z1))
    quad(P(-1, -1, z0), P(-1, 1, z0), P(1, 1, z0), P(1, -1, z0))
    quad(P(1, -1, z0), P(1, 1, z0), P(1, 1, z1), P(1, -1, z1))
    quad(P(-1, -1, z0), P(-1, -1, z1), P(-1, 1, z1), P(-1, 1, z0))
    quad(P(-1, 1, z0), P(-1, 1, z1), P(1, 1, z1), P(1, 1, z0))
    quad(P(-1, -1, z0), P(1, -1, z0), P(1, -1, z1), P(-1, -1, z1))
  }
  const RAIL = 0.75, CAR = 1.32
  // Six cars, two across, a sculpted green body each; the lead car at the front.
  for (let k = 0; k < 6; k++) {
    const a = 9.0 - k * (CAR + 0.08)
    block(a - CAR / 2, 0, CAR / 2 - 0.04, 0.58, RAIL + 0.15, RAIL + 0.95)
  }
  // The serpent's neck and head over the front of the lead car.
  block(9.75, 0, 0.18, 0.28, RAIL + 0.6, RAIL + 1.75)
  block(10.0, 0, 0.42, 0.3, RAIL + 1.5, RAIL + 2.05)
  return [{ part: green, material: finish('serpent-green', 0x62ad4c) }]
}

await buildCoaster({
  name: 'Sea Serpent',
  out: '../models/nyc-sea-serpent.glb',
  origin: ORIGIN,
  chain: CHAIN,
  anchor: [-104, -136],
  // Coney Island is level beach fill under the ride: a flat ground.
  ground: { x0: -300, y0: -300, step: 200, rows: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], base: 2 },
  // Heights of the rails above the ground; s along the polyline (87 m round).
  profile: [
    { name: 'station', s: 0, z: 0.7 },
    { name: 'station, south-east end', s: 11, z: 0.7 },
    { name: 'foot of the lift', s: 21, z: 0.8, r: 5 },
    { name: 'crest, on the bridge', s: 31.5, z: 4.2, r: 5 },
    { name: 'inner ring, north', s: 41, z: 3.2 },
    { name: 'inner ring, west', s: 48, z: 2.4 },
    { name: 'inner ring, south', s: 54.7, z: 1.7 },
    { name: 'under the bridge', s: 60.5, z: 0.8, r: 6 },
    { name: 'outer loop, north-east', s: 68.5, z: 1.8, r: 6 },
    { name: 'north side', s: 77, z: 1.5 },
    { name: 'brakes', s: 83, z: 0.8 },
  ],
  lift: LIFT,
  brakes: [{ from: 83, to: 21, z: 0.7, head: 0.3 }],
  losses: [0.015, 0.001],
  track: { W: 0.9, RAIL: 0.22, DEPTH: 0.42, SPINE: 0.3 },
  station: { ring: STATION, posts: [st(0.6, 2.2), st(9.0, 2.2), st(4.8, 2.2)], roofZ: 3.2 },
  // Colours from the photos, pulled to the palette's lightness: mauve rails,
  // charcoal supports, timber station.
  colours: {
    deck: ['serpent-mauve', 0xb47c9e], spine: ['serpent-mauve-2', 0x9c6b8a], supports: ['serpent-charcoal', 0x4f545b],
    station: ['serpent-timber', 0xa98058], stationRoof: ['serpent-roof', 0xb88d63],
  },
  supportR: [0.13, 0.15, 0.17],
  supportEvery: 4,
  supportMinZ: 0.8,
  sampleDeg: 12,
  meta: { height: 4.6, trackLength: 87 },
  extras,
})
