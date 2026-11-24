/**
 * Steeplechase (Zamperla Motocoaster, 2011), Luna Park, Coney Island:
 * procedural, CC0-1.0.
 * bun generators/nyc-steeplechase.ts   (REPORT=1 for the element table, PLAN=1 for the plan)
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The park frame's
 * origin is the centroid of the OSM ride area (way/952516012), and so is the
 * model's origin. Coney Island is level beach fill here: a flat ground.
 * Built with ./coaster-kit.ts, the plan with ./nyc-luna-plan.ts.
 *
 * Sources. Ride data: Coasterpedia "Steeplechase (Luna Park)", coaster.cloud,
 * Captain Coaster (Zamperla Motocoaster, flywheel launch 0-40 mph / 64 km/h in
 * 2 s, 65 ft / 19.8 m to the top of the structure, 1,194 ft / 363 m of track,
 * no inversions; two trains of six motorbike cars, horses on the bikes).
 * OSM maps the ride only as an area (way/952516012, 20 m x 49 m) with the
 * station canopy (way/355345474, amenity=shelter) inside its south end: no
 * track ways. The plan is traced over the USGS lidar (NY_NewYorkCity, 2017,
 * public domain, 0.5 m grid of first returns), which shows the ride as stacked
 * ovals: a low run up the east side (3-4 m returns), the north turn peaking at
 * 17 m over the north-east corner and falling west along the north end
 * (13 m to 8 m), the west side at 7-8 m, the south end at 12-12.5 m, the
 * east side at 10-12 m, and a long diagonal at 13 m from the north-east to
 * the south-west across the middle. The station canopy's roof is at 6 m.
 *
 * The ride as modelled (rail heights above the ground): station heading
 * east under the canopy, a left turn into the launch, launched north up the
 * east side, the climbing north turn to the 17 m crest (the published 19.8 m
 * is the top of its columns), down the west side, the south turn climbing
 * back to 12 m, north up the inner east side, a left turn of 162° at the
 * north end onto the 13 m diagonal, down to the brakes and a left turn into
 * the station. Track 201 m drawn against the published 363 m: the lidar
 * shows more stacked runs than this one lap (a second lap on the inner
 * ovals), which can't be followed level by level in a 2017 point cloud of
 * thin white steel.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *   "Luna Park - Steeplechase - side view", "... - underneath", "... - train
 *     closeup", Larry Syverson, CC BY-SA 2.0
 *   "Steeplechase Scream Zone Luna Park Coney Island", Eliedion, CC BY-SA 3.0
 *   "Steeplechase Amusement Park", Kidfly182, CC BY-SA 4.0
 * They show the whole ride in one cream colour (ladder track, tubular
 * columns with flanged joints and portal frames), the STEEPLECHASE board
 * with its racing-horses panel over the north-east turn, and the station's
 * red-brown hipped roof.
 *
 * Style: one broad cream ribbon (track and columns are the same cream in the
 * photos, the ribbon a shade darker so the plan reads against the columns),
 * drawn wider than the real track; chunky cream columns; the station canopy
 * with its red-brown roof on posts; the STEEPLECHASE board as a plain board
 * (lit at night, so `neon`), not lettered: it is not the landmark.
 *
 * Doubts: the plan rests on the 2017 lidar alone; the order of the runs
 * after the launch is read from heights, and the second lap is left out.
 * Heights other than the crest are read from lidar first returns, rounded
 * down about 0.5 m for the rail tops.
 */
import { buildCoaster, type CoasterKit } from './coaster-kit'
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { turtle, reportPlan, type Seg } from './nyc-luna-plan'

// Lon/lat of the OSM ride area's centroid (way/952516012).
const ORIGIN: [number, number] = [-73.9799239, 40.5737376]

const SEGS: Seg[] = [
  ['S', 7.86],       // 0 station, heading east under the canopy
  ['L', 4, 90],      // 1 into the launch
  ['S', 29.5],       // 2 launch, north up the east side
  ['L', 8.5, 180],   // 3 north turn, climbing to the crest
  ['S', 22],         // 4 west side
  ['L', 8, 180],     // 5 south turn
  ['S', 20],         // 6 inner east side
  ['L', 5, 162],     // 7 north turn onto the diagonal
  ['S', 25.11],      // 8 the diagonal, then the brakes
  ['L', 7, 108],     // 9 into the station
]
// The station's and the diagonal's lengths close the circuit (solved).
const PLAN = turtle([-2.4, -11.5], 90, SEGS)
await reportPlan('Steeplechase', PLAN, SEGS)

// The station canopy (way/355345474).
const STATION: [number, number][] = [[5.5, -8.9], [-5.3, -8.9], [-5.3, -14.0], [5.7, -14.0], [5.5, -11.7]]

const CREAM = 0xe2d6b8

/** A box centred at c with half sizes h, axis-aligned. */
function box(p: Part, c: V3, h: V3) {
  const P = (i: number, j: number, k: number): V3 => [c[0] + h[0] * i, c[1] + h[1] * j, c[2] + h[2] * k]
  const f = (a: V3, b: V3, cc: V3, d: V3) => { p.tri(a, b, cc); p.tri(a, cc, d) }
  f(P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1))
  f(P(-1, -1, -1), P(-1, 1, -1), P(1, 1, -1), P(1, -1, -1))
  f(P(1, -1, -1), P(1, 1, -1), P(1, 1, 1), P(1, -1, 1))
  f(P(-1, -1, -1), P(-1, -1, 1), P(-1, 1, 1), P(-1, 1, -1))
  f(P(-1, 1, -1), P(-1, 1, 1), P(1, 1, 1), P(1, 1, -1))
  f(P(-1, -1, -1), P(1, -1, -1), P(1, -1, 1), P(-1, -1, 1))
}

function extras(kit: CoasterKit) {
  // The STEEPLECHASE board over the north-east turn, facing east to the
  // walkway: a red-brown board with a cream face, on two cream posts.
  const sign = new Part()
  const white = kit.parts.supports
  const [sx, sy] = kit.toModel([11.2, 19])
  box(white, [sx, sy - 2.6, 8.5], [0.25, 0.25, 8.5])
  box(white, [sx, sy + 2.6, 8.5], [0.25, 0.25, 8.5])
  box(sign, [sx, sy, 16.4], [0.25, 3.3, 1.2])
  box(white, [sx + 0.28, sy, 16.4], [0.05, 2.9, 0.85])
  return [{ part: sign, material: finish('neon-steeplechase', 0xb0533f) }]
}

await buildCoaster({
  name: 'Steeplechase',
  out: '../models/nyc-steeplechase.glb',
  origin: ORIGIN,
  chain: PLAN.pts,
  anchor: [0, 0],
  ground: { x0: -100, y0: -100, step: 100, rows: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], base: 2 },
  // Heights of the rails above the ground; s along the plan (180 m round),
  // from the west end of the station.
  profile: [
    { name: 'station', s: 0, z: 1.5 },
    { name: 'launch', s: 15, z: 1.8 },
    { name: 'end of the launch', s: 38, z: 2.5, r: 14 },
    { name: 'crest, north turn', s: 57, z: 16.5, r: 9 },
    { name: 'west side', s: 82, z: 8, r: 12 },
    { name: 'valley, west side', s: 93, z: 7 },
    { name: 'south turn', s: 113, z: 12.2, r: 10 },
    { name: 'inner east side', s: 133, z: 10.5 },
    { name: 'onto the diagonal', s: 150, z: 12.8, r: 9 },
    { name: 'diagonal', s: 160, z: 12, r: 9 },
    { name: 'brakes', s: 182, z: 1.5 },
  ],
  lift: [186, 15],
  liftHead: 0.4,
  launches: [{ from: 15, to: 36, z: 1.8, head: 16.8, name: 'flywheel launch' }],
  banks: [{ from: 12, to: 38, deg: 0, name: 'launch' }, { from: 180, to: 14, deg: 0, name: 'brakes and station' }],
  brakes: [{ from: 182, to: 186, z: 1.5, head: 0.4 }],
  losses: [0.02, 0.001],
  track: { W: 2.0, RAIL: 0.45, DEPTH: 0.9, SPINE: 0.7 }, // drawn wider than the real track so it reads at map scale
  station: { ring: STATION, posts: [[5.1, -9.3], [-4.9, -9.3], [-4.9, -13.6], [5.3, -13.6], [0, -9.3], [0, -13.6]], roofZ: 5.6 },
  colours: { deck: ['steeplechase-cream', CREAM], spine: 'deck', supports: 'trim', stationRoof: ['steeplechase-roof', 0xb0645a] },
  supportR: [0.4, 0.46, 0.52],
  supportEvery: 7,
  sampleDeg: 12,
  meta: { height: 19.8, trackLength: 363 },
  extras,
})
