/**
 * The Tickler (Zamperla Twister Coaster, 2010), Luna Park, Coney Island:
 * procedural, CC0-1.0.
 * bun generators/nyc-tickler.ts   (REPORT=1 for the element table, PLAN=1 for the plan)
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The park frame's
 * origin is the centroid of the OSM ride area (way/631706787), and so is the
 * model's origin. Coney Island is level beach fill here: a flat ground.
 * Built with ./coaster-kit.ts, the plan with ./nyc-luna-plan.ts.
 *
 * Sources. Ride data: Coasterpedia "The Tickler (Luna Park; opened 2010)",
 * CoasterBuzz, Ultimate Rollercoaster (Zamperla Twister Coaster 420 M, a
 * spinning wild mouse; 1,377.9 ft / 420 m of track, 42.7 ft / 13 m high,
 * 29.1 mph / 47 km/h, no inversions; 62.3 ft x 137.8 ft / 19 m x 42 m; single
 * four-seat spinning cars). OSM maps the ride only as an area (way/631706787,
 * 24 m x 45 m): no track ways. The plan is traced over the USGS lidar
 * (NY_NewYorkCity, 2017, public domain, 0.5 m grid of first returns), which
 * shows it plainly: the straight lift up the east side (3 m returns at its
 * foot, 13-14 m at its head), the stack of switchback rows across the north
 * half falling from 13 m to 8 m, a run down the west side at 5-7 m, a turn
 * across the south end at 7-8 m, and lower loops at 3-4 m inside it. The
 * "Tickler (Coney Island, New York) 001" photo from the Wonder Wheel and the
 * view from the Wonder Wheel ("The Tickler Luna Park Coney Island 2") show
 * the same plan: the lift beside the walkway on the east, the hairpins
 * across the width of the ride, the sign at the north end.
 *
 * The ride as modelled (rail heights above the ground): station on the east
 * side at the south end, the lift north to the 12.5 m head, five switchback
 * rows with a hairpin at each end, each a little lower, down the west side,
 * the climbing turn across the south end, the lower loops, and the final
 * run east along the south end into the station. Track 219 m drawn against
 * the published 420 m: the photo from the Wonder Wheel shows more hairpins
 * than the lidar separates, at the lower levels especially, and these are
 * left out rather than invented.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *   "The Tickler Luna Park Coney Island" and "... 2", Eliedion, CC BY-SA 3.0
 *   "Tickler (Coney Island, New York) 001", Leonard J. DeFrancisci, CC BY-SA 3.0
 *   "Coney Island Brooklyn Jul 2019 97", Epicgenius, CC BY-SA 4.0
 * They show red ladder track (faded to a darker red by 2019), pale yellow
 * columns and A-frames, and THE TICKLER boards with the Tillie face, one over
 * the north end and one over the lift.
 *
 * Style: one red ribbon drawn wider than the real track; pale yellow columns;
 * the cream catwalk beside the lift; the yellow A-frame portal across the
 * south end with its round Tillie boards (plain discs, drawn as squares); the station a roof on posts; THE
 * TICKLER board over the north-west corner as a plain red board (lit at
 * night, so `neon`), not lettered: the ride, not its sign, is the landmark.
 * The spinning cars are left out.
 *
 * Doubts: the lower loops are hard to read in the lidar and are simplified;
 * the switchback rows' heights are lidar first returns rounded down about
 * 0.5 m for the rail tops.
 */
import { buildCoaster, type CoasterKit } from './coaster-kit'
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { turtle, reportPlan, type Seg } from './nyc-luna-plan'

// Lon/lat of the OSM ride area's centroid (way/631706787).
const ORIGIN: [number, number] = [-73.9786354, 40.5748823]

const ROW = 12.3
const SEGS: Seg[] = [
  ['S', 6],            //  0 station, east side, heading north
  ['S', 30],           //  1 lift
  ['L', 2.5, 90],      //  2 head of the lift
  ['S', ROW],          //  3 row 1, west
  ['L', 2, 180],       //  4 hairpin
  ['S', ROW],          //  5 row 2, east
  ['R', 1.75, 180],    //  6 hairpin
  ['S', ROW],          //  7 row 3, west
  ['L', 1.75, 180],    //  8 hairpin
  ['S', ROW],          //  9 row 4, east
  ['R', 1.75, 180],    // 10 hairpin
  ['S', ROW],          // 11 row 5, west
  ['L', 2.5, 90],      // 12 down the west side
  ['S', 16],           // 13
  ['L', 6, 90],        // 14 the turn across the south end
  ['S', 6],            // 15
  ['L', 2, 90],        // 16 lower loops
  ['S', 11],           // 17
  ['L', 3, 90],        // 18
  ['S', 4],            // 19
  ['L', 3, 90],        // 20
  ['S', 12.5],         // 21
  ['L', 2, 90],        // 22
  ['S', 9.3],          // 23 final run east along the south end, brakes
  ['L', 2, 90],        // 24 into the station
]
// The last two straights close the circuit (solved).
const PLAN = turtle([6.8, -21], 0, SEGS)
await reportPlan('The Tickler', PLAN, SEGS)

// Where segment i starts along the plan, for the profile.
const at = (i: number) => (i ? PLAN.marks[i - 1] : 0)
const S_BRAKES = at(23)
// Rail heights above the ground (lidar first returns, rounded down 0.5 m).
// The rows fall about 0.9 m each, as a wild mouse's do, between flat hairpins.
const PROFILE = [
  { name: 'station', s: 0, z: 1.5 },
  { name: 'foot of the lift', s: 6, z: 1.5, r: 6 },
  { name: 'head of the lift', s: 36, z: 12.5, r: 4 },
  { name: 'row 1', s: at(3), z: 12.5 },
  { name: 'row 2', s: at(5), z: 11.6 },
  { name: 'row 3', s: at(7), z: 10.7 },
  { name: 'row 4', s: at(9), z: 9.8 },
  { name: 'row 5', s: at(11), z: 8.9 },
  { name: 'top of the west side', s: at(13), z: 8.2, r: 8 },
  { name: 'foot of the west side', s: at(13) + 14, z: 4.6, r: 8 },
  { name: 'turn across the south end', s: at(15), z: 6.8, r: 8 },
  { name: 'lower loops', s: at(17), z: 4 },
  { name: 'lower loops, west', s: at(21), z: 2.8 },
  { name: 'brakes', s: S_BRAKES, z: 1.5 },
]

const STATION: [number, number][] = [[5, -22.5], [9, -22.5], [9, -14.5], [5, -14.5]]
const RED = 0xc8463f, YELLOW = 0xe8dfa0

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

/** A slab between two points (its centreline), `w` wide and `t` thick, level across. */
function slab(p: Part, a: V3, b: V3, w: number, t: number) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy)
  const cx = (-dy / L) * (w / 2), cy = (dx / L) * (w / 2)
  const P = (q: V3, j: number, k: number): V3 => [q[0] + cx * j, q[1] + cy * j, q[2] + k * t]
  const f = (a1: V3, b1: V3, c1: V3, d1: V3) => { p.tri(a1, b1, c1); p.tri(a1, c1, d1) }
  f(P(a, -1, 0), P(b, -1, 0), P(b, 1, 0), P(a, 1, 0))
  f(P(a, -1, -1), P(a, 1, -1), P(b, 1, -1), P(b, -1, -1))
  f(P(a, 1, -1), P(a, 1, 0), P(b, 1, 0), P(b, 1, -1))
  f(P(a, -1, -1), P(b, -1, -1), P(b, -1, 0), P(a, -1, 0))
  f(P(a, -1, -1), P(a, -1, 0), P(a, 1, 0), P(a, 1, -1))
  f(P(b, -1, -1), P(b, 1, -1), P(b, 1, 0), P(b, -1, 0))
}

function extras(kit: CoasterKit) {
  // THE TICKLER board over the north-west corner, where the photo from the
  // Wonder Wheel shows it, facing south over the ride: a red board on two
  // yellow posts.
  const sign = new Part()
  const posts = kit.parts.supports
  const [sx, sy] = kit.toModel([-5.5, 20.4])
  box(posts, [sx - 2.6, sy, 8.4], [0.22, 0.22, 8.4])
  box(posts, [sx + 2.6, sy, 8.4], [0.22, 0.22, 8.4])
  box(sign, [sx, sy, 15.9], [3.6, 0.22, 0.9])
  // The cream catwalk up the east side of the lift, as pale as the photos show it.
  const [ax, ay] = kit.toModel([8.3, -14.5]), [bx, by] = kit.toModel([8.3, 15])
  slab(kit.parts.stone, [ax, ay, 1.6], [bx, by, 12.6], 1.1, 0.25)
  // The yellow A-frame portal across the south end, carrying the turn there
  // (7 m) on its beam, with a round Tillie-face board on each leg facing the
  // walkway ("Tickler (Coney Island, New York) 001"): two A-shaped legs, each
  // a pair of raked struts, and the beam.
  const yellow = kit.parts.supports
  for (const lx of [-9.8, 2.6]) {
    const [px, py] = kit.toModel([lx, -21.5])
    slab(yellow, [px, py - 2.4, 0], [px, py, 6.4], 0.45, 0.45)
    slab(yellow, [px, py + 2.4, 0], [px, py, 6.4], 0.45, 0.45)
    box(sign, [px, py - 1.45, 4.3], [0.15, 0.9, 0.9])
  }
  const [qa, qb] = [kit.toModel([-10.2, -21.5]), kit.toModel([3, -21.5])]
  box(yellow, [(qa[0] + qb[0]) / 2, qa[1], 6.15], [(qb[0] - qa[0]) / 2, 0.3, 0.3])
  return [{ part: sign, material: finish('neon-tickler', 0xc8463f) }]
}

await buildCoaster({
  name: 'The Tickler',
  out: '../models/nyc-tickler.glb',
  origin: ORIGIN,
  chain: PLAN.pts,
  anchor: [0, 0],
  ground: { x0: -100, y0: -100, step: 100, rows: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], base: 2 },
  // Heights of the rails above the ground; s along the plan, from the south
  // end of the station. Set from the marks PLAN=1 prints.
  profile: PROFILE,
  lift: [6, 36],
  liftHead: 0.9,
  banks: [{ from: 34, to: 140, deg: 0, name: 'flat switchbacks (a wild mouse runs its hairpins unbanked)' }, { from: S_BRAKES, to: 8, deg: 0, name: 'brakes and station' }],
  brakes: [{ from: S_BRAKES, to: 6, z: 1.5, head: 0.3 }],
  losses: [0.02, 0.0015],
  track: { W: 1.6, RAIL: 0.36, DEPTH: 0.8, SPINE: 0.55 }, // drawn wider than the real track so it reads at map scale
  station: { ring: STATION, posts: [[5.3, -22.2], [8.7, -22.2], [8.7, -14.8], [5.3, -14.8]], roofZ: 4.2 },
  colours: { deck: ['tickler-red', RED], spine: 'deck', supports: ['tickler-yellow', YELLOW], stationRoof: ['tickler-roof', 0x5b7fbf] },
  supportR: [0.34, 0.38, 0.42],
  supportEvery: 5,
  sampleDeg: 12,
  meta: { height: 13, trackLength: 420 },
  extras,
})
