/**
 * Circus Coaster (Zamperla, 2010), Luna Park, Coney Island: procedural, CC0-1.0.
 * bun generators/nyc-circus-coaster.ts   (REPORT=1 for the element table, PLAN=1 for the plan)
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The park frame's
 * origin is the centroid of the OSM ride area (way/952516015), and so is the
 * model's origin. Coney Island is level beach fill here: a flat ground.
 * Built with ./coaster-kit.ts, the plan with ./nyc-luna-plan.ts.
 *
 * Sources. Ride data: RCDB 9254 (Zamperla family coaster, "Speedy Coaster";
 * 574.2 ft / 175 m of track, 29.5 ft / 9 m high, 18.6 mph / 30 km/h, chain
 * lift, no inversions; one train of six cars), CoasterBuzz (same figures,
 * opened 2010). OSM maps the ride only as an area (way/952516015, 13.5 m x
 * 30 m): no track ways. The plan is traced over the USGS lidar
 * (NY_NewYorkCity, 2017, public domain; 0.5 m grid of first returns), which
 * shows the circuit clearly: the lift up the west side (8 to 11 m returns
 * at its top), the turn round the north end (about 10 m), the drop down the
 * east side to 3.5-4.5 m, and the figure of eight's south loop at 4.5-5 m,
 * crossing the middle on the diagonal. The 13-16 m returns over the north
 * turn are read as the sign and its lamps, and the 23-32 m streak to the
 * west as a crane or a bird, not the ride (published height 9 m).
 *
 * The ride as modelled (rail heights above the ground): station on the west
 * side, chain lift north to the 9 m crest over the north turn (a right turn),
 * the drop down the east side, a right-hand swing across the middle, the
 * south loop (a left turn of 270°), back across the middle under the first
 * crossing, a left turn into the station. Track 88 m drawn against the
 * published 175 m. The drawn figure of eight sits on the lidar's loops, so
 * the missing length is track the 2017 point cloud doesn't separate (the
 * 3.5-4.5 m returns along the east side may be a second, lower run); it is
 * left out rather than invented.
 *
 * Photos (EVIDENCE): "Circus Coaster at Luna Park Coney Island" and "Circus
 * Coaster at Luna Park Coney Island 2010", milst1 (Flickr 4860625078 and
 * 4860004489), CC BY-SA 2.0: the red triangular-truss track, the cream goal-post
 * supports, the blue station roof. Look-only (CC BY-NC-ND, Luna Park's own
 * Flickr): "The Circus Coaster" (8725605991), "The Circus Coaster and Brooklyn
 * Flyer at Luna Park" (10519265416); not used for any shape or colour.
 *
 * Style: one red ribbon, rails and truss spine in one colour as in the photos,
 * drawn wider than the real 1 m track so it reads at map scale; cream
 * columns; the station a dark blue roof on posts. The cars (tan circus
 * wagons) are left out, as on every coaster here.
 *
 * Doubts: no photo shows the plan; it rests on the lidar, which is from 2017.
 * The south loop's radius and where the two diagonals cross are estimated.
 * Heights other than the published 9 m crest are read from the lidar returns,
 * which catch the top of the track and its truss, so they are rounded down
 * about 0.5 m.
 */
import { buildCoaster } from './coaster-kit'
import { turtle, reportPlan, type Seg } from './nyc-luna-plan'

// Lon/lat of the OSM ride area's centroid (way/952516015).
const ORIGIN: [number, number] = [-73.9788216, 40.5739101]

const SEGS: Seg[] = [
  ['S', 9],          // 0 chain lift, up the west side
  ['R', 5, 180],     // 1 north turn, the crest
  ['S', 1.5],        // 2 drop down the east side
  ['R', 5, 34],      // 3 swing to the south-west
  ['S', 19.35],      // 4 first diagonal across the middle
  ['L', 5, 248],     // 5 south loop
  ['S', 10.3],       // 6 second diagonal, under the first: brakes and station
  ['R', 5, 34],      // 7 foot of the lift
]
// Starts at the foot of the lift's straight; the straights' lengths close the
// circuit (solved, not measured).
const PLAN = turtle([-4.5, 4], 0, SEGS)
await reportPlan('Circus Coaster', PLAN, SEGS)

// The station: a platform and canopy along the first 6.5 m of the second
// diagonal (west side, where the queue is), out of the south loop.
const ST0 = turtle([-4.5, 4], 0, SEGS.slice(0, 6)).end
const ST_H = ((180 + 34 - 248) * Math.PI) / 180 // heading of the second diagonal
const along = (d: number, side: number): [number, number] => [
  ST0[0] + Math.sin(ST_H) * d - Math.cos(ST_H) * side,
  ST0[1] + Math.cos(ST_H) * d + Math.sin(ST_H) * side,
]
const STATION: [number, number][] = [along(0.5, -1.2), along(7, -1.2), along(7, 3.6), along(0.5, 3.6)]
const POSTS: [number, number][] = [along(0.9, -0.9), along(6.6, -0.9), along(6.6, 3.3), along(0.9, 3.3)]

await buildCoaster({
  name: 'Circus Coaster',
  out: '../models/nyc-circus-coaster.glb',
  origin: ORIGIN,
  chain: PLAN.pts,
  anchor: [0, 0],
  ground: { x0: -100, y0: -100, step: 100, rows: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], base: 2 },
  // Heights of the rails above the ground; s along the plan (83 m round),
  // from the foot of the lift's straight.
  profile: [
    { name: 'on the lift', s: 0, z: 3.2 },
    { name: 'crest, north turn', s: 14, z: 9, r: 6 },
    { name: 'north turn, east side', s: 22, z: 8.4, r: 6 },
    { name: 'foot of the drop', s: 31, z: 3.2, r: 6 },
    { name: 'first crossing, over', s: 40, z: 5.4, r: 6 },
    { name: 'south loop', s: 56, z: 4.5 },
    { name: 'out of the loop', s: 66, z: 2.5 },
    { name: 'station', s: 71, z: 1.2 },
    { name: 'foot of the lift', s: 79, z: 1.2, r: 9 },
  ],
  lift: [79, 14],
  liftHead: 1.0,
  banks: [{ from: 67, to: 80, deg: 0, name: 'brakes and station' }],
  brakes: [{ from: 68, to: 79, z: 1.2, head: 0.3 }],
  losses: [0.035, 0.002],
  track: { W: 1.8, RAIL: 0.4, DEPTH: 0.9, SPINE: 0.6 }, // drawn wider than the real track so it reads at map scale
  station: { ring: STATION, posts: POSTS, roofZ: 3.6 },
  // Colours from the photos, pulled to the palette's lightness: red track,
  // cream supports, a dark blue station roof.
  colours: { deck: ['circus-red', 0xd2453f], spine: 'deck', supports: 'trim', stationRoof: ['circus-blue', 0x4f6fa3] },
  supportR: [0.34, 0.38, 0.42],
  supportEvery: 5,
  supportMinZ: 1.4,
  sampleDeg: 12,
  meta: { height: 9, trackLength: 175 },
})
