/**
 * New Texas Giant, Six Flags Over Texas, Arlington: procedural, CC0-1.0.
 * bun generators/dal-new-texas-giant.ts   (REPORT=1 for the element table and energy check)
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The park frame's
 * origin is lon -97.07302, lat 32.75637 (`origin`, the OSM attraction node
 * node/1207178486); the model's origin is the middle of the track's
 * footprint (anchor [9, 70], printed as -97.0729239, 32.7570031), at the
 * lowest ground under the track. Built with ./coaster-kit.ts and its wooden
 * trestle: an RMC I-Box steel track (2011) on the 1990 Dinn timber
 * structure of the original Texas Giant.
 *
 * Plan: the six untagged OSM `roller_coaster=track` ways that form the
 * circuit (way/603559513, way/603559514, way/104655706, way/603559507,
 * way/603559508, way/104655708), chained in ride order from the station
 * exit; 957 m in plan. Checked over USGS NAIP (public domain): the trace
 * lies on the timber structure to within a few metres, the long blue-roofed
 * tunnel on the east side and the station are where OSM has them. Ride
 * direction from Wikipedia ("a right turn out of the station leads directly
 * to the lift"): out of the south end of the station, right round the south
 * turnaround, up the long NNE straight (the lift).
 *
 * Profile. Published (RCDB, Wikipedia "New Texas Giant"): 153 ft (46.6 m)
 * lift, 147 ft (44.8 m) drop at 79°, 4,200 ft (1,280 m), 65 mph (105 km/h);
 * elements in order: lift, 79° drop, a double up into a 90° overbanked
 * turn, a dip and a 95° overbanked turn, a dip and rise into a 115°
 * overbanked turn, a small airtime hill, the mid-course brakes, then low
 * airtime hills and direction changes through three tunnels to the final
 * brakes. The 540° helix after the mid-course brakes became a 180°
 * turnaround (Wikipedia), which is the turn by the station (s 500-544).
 * Element heights other than the lift and drop are estimated from the
 * photos and the energy left. Positions (polyline s, m):
 *
 *   lift                         s 72-141, crest 46.6 m
 *   79° drop                     foot at s 188
 *   double up (one hill here)    crest 26 m at s 236
 *   90° overbanked turn, NE      20 m, s 264
 *   95° overbanked turn, NW      18 m, s 333
 *   115° overbanked turn, W      12 m, s 398
 *   airtime hill                 10 m, s 444
 *   mid-course brakes            11 m, s 484-498
 *   180° turnaround              s 505-540, low
 *   low hills and turns          s 560-862, 6-7 m
 *   tunnels                      s 797-820 (east side, NAIP) and 880-930
 *                                (blue-roofed, NAIP); the third is not
 *                                drawn (not found in the aerial)
 *   final brakes                 from s 905
 *
 * Checks (REPORT=1): top speed 107 km/h (published 105); losses 3.5 % of
 * the lift height per 100 m; no stall (lowest head 1 m over the lift
 * crest); smoothness 4.4°/m pitch, 5.3°/m roll (the 115° overbank's exit
 * into the right turn to the brakes). Track 1,027 m against the published
 * 1,280 m: the OSM trace, which matches the aerial, is 957 m in plan, so
 * the shortfall is in the published figure or in detail the trace and the
 * aerial don't show; the model follows the aerial.
 *
 * Terrain: Mapterhorn (tools/terrain.ts), 10 m grid; the site has 4.5 m of
 * relief with a creek bed under the north loop. `bun tools/terrain.ts
 * check` prints ok. The kit stands the timber 1 m into the ground, so the
 * lowest vertex is y = -1, as on the other kit coasters.
 *
 * Photos (Wikimedia Commons, evidence):
 * - "New Texas Giant 05.jpg", "07.jpg", "lift hill.jpg", "station and lift
 *   hill.jpg", "track.jpg", Martin Lewison, CC BY-SA 2.0 (from the queue on
 *   the east side: lift, drop, double up; the red I-Box track).
 *   https://commons.wikimedia.org/wiki/File:New_Texas_Giant_05.jpg (etc.)
 * - "SFOT Giant 2 Edit.jpg", Cstrs101, CC BY-SA 4.0 (lift and station from
 *   the south-east). https://commons.wikimedia.org/wiki/File:SFOT_Giant_2_Edit.jpg
 * - "The NEW Texas Giant.jpg", SFOTPR, CC BY-SA 3.0 (track and timber colours).
 *   https://commons.wikimedia.org/wiki/File:The_NEW_Texas_Giant.jpg
 * - "New Texas Giant 2023 1.jpg", Jeremy Thompson, CC BY 2.0 (lift from the
 *   south, outside the park).
 *
 * Style: the track is a broad ribbon in the red the photos show (crimson
 * #9e2b35 overcast to #c8323c in sun, pulled light), deck and spine one
 * colour. The timber is weathered tan-brown (the SSE photo; #bfa98a, pulled
 * to the palette's lightness), drawn as the kit's trestle walls of bents and
 * ledgers with large openings. Under the lift and the first drop, where the
 * photos show a near-solid timber mass, a wall plane in a darker timber
 * (#9a8670) fills the triangle behind the bents, so the gaps read as shaded
 * openings in a dense wall. Where the track stands over 14 m up,
 * raking batter posts and ledgers each side (the real bents spread far wider
 * at the foot than the track). A timber portal stands over the lift crest.
 * The station is the OSM building with dark blue-grey walls (the SSE photo),
 * a flat roof at 6 m and a gabled roof along the platform with blue-grey
 * gable ends and trim on the rakes; the tunnels are roofed boxes.
 *
 * Doubts: heights after the drop are estimates; the double up is drawn as
 * one hill (its step does not fit between the drop's pull-out and the turn
 * without kinks); the crest portal's sign is not drawn; the station's
 * blue-grey walls and the timber gable front are simplified; the third
 * tunnel's place is unknown.
 */
import { buildCoaster, type CoasterKit } from './coaster-kit'
import { finish } from './palette'
import { Part, type V3 } from './mesh'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

/** A closed box bar from a to b, `w` across along `side`, `d` deep; faces wound outward. */
function bar(p: Part, a: V3, b: V3, w: number, d: number, side: V3) {
  const ax = unit(sub(b, a))
  const s0 = unit(sub(side, mul(ax, side[0] * ax[0] + side[1] * ax[1] + side[2] * ax[2])))
  const n = unit(crs(ax, s0))
  const c = (o: V3, i: number): V3 => {
    const [u, v] = [[1, 1], [-1, 1], [-1, -1], [1, -1]][i]
    return add(o, add(mul(s0, (u * w) / 2), mul(n, (v * d) / 2)))
  }
  const A = [0, 1, 2, 3].map((i) => c(a, i)), B = [0, 1, 2, 3].map((i) => c(b, i)), ctr = mul(add(a, b), 0.5)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, mid = mul(add(add(A[i], A[j]), add(B[i], B[j])), 0.25)
    const out = sub(mid, ctr), g = crs(sub(A[j], A[i]), sub(B[i], A[i]))
    if (g[0] * out[0] + g[1] * out[1] + g[2] * out[2] > 0) p.quad(A[i], A[j], B[j], B[i])
    else p.quad(A[j], A[i], B[i], B[j])
  }
}

/**
 * The tall trestle's batter: where the track stands more than 14 m up, the
 * real bents spread wider at the foot than the track (photos: the lift and
 * the double up stand on broad sloping walls). Every `every` m a raking
 * post each side from under the track to a foot 0.28 x the height out, and
 * ledgers between them every 7 m of height, drawn into the kit's timber.
 */
function batter(kit: CoasterKit, from: number, to: number, every = 11) {
  const P = kit.parts.supports, W = kit.track.W, D = kit.track.DEPTH
  let prev: { top: V3; foot: V3 }[] | null = null
  for (let ps = from; ps <= to; ps += every) {
    const f = kit.at(ps), u = add(f.p, mul(f.up, -D))
    const h = u[2] - kit.ground(u[0], u[1])
    if (h < 14) { prev = null; continue }
    const L = unit([f.left[0], f.left[1], 0]), T = unit([f.t[0], f.t[1], 0])
    const cur = [1, -1].map((sg) => {
      const top = add(u, add(mul(L, sg * (W / 2 - 0.4)), [0, 0, -0.4]))
      const fx = add(u, mul(L, sg * (W / 2 + 0.22 * h)))
      const foot: V3 = [fx[0], fx[1], kit.ground(fx[0], fx[1]) - 0.5]
      bar(P, foot, top, 1.4, 1.0, T)
      return { top, foot }
    })
    if (prev) for (let k = 0; k < 2; k++) {
      const a = prev[k], b = cur[k]
      for (let z = 6; z < Math.min(a.top[2], b.top[2]) - 4; z += 7) {
        const at = (q: { top: V3; foot: V3 }): V3 => add(q.foot, mul(sub(q.top, q.foot), (z - q.foot[2]) / (q.top[2] - q.foot[2])))
        bar(P, at(a), at(b), 1.2, 0.6, [0, 0, 1])
      }
    }
    prev = cur
  }
  return []
}

/**
 * Under the overbanked turns the kit's bents slope their tops to the bank,
 * which at 90° and more throws a spike far above the track. Clamp every
 * timber vertex to the highest track within 4 m of it in plan (plus 0.3 m).
 */
/**
 * The two features the photos show that the kit doesn't draw: the timber
 * portal over the lift crest (the frame that carries the ride's sign), and
 * the station's gabled roof, a ridge along the platform over the kit's flat
 * roof (station roof at `roofZ` above the highest ground under it).
 */
function crestAndGable(kit: CoasterKit, roofZ: number) {
  const f = kit.at(141), T = kit.parts.supports
  const L = unit([f.left[0], f.left[1], 0]), dir = unit([f.t[0], f.t[1], 0])
  const half = kit.track.W / 2 + 0.9, H = 5.5
  const base = add(f.p, [0, 0, -kit.track.DEPTH])
  const pl = add(base, mul(L, half)), pr = add(base, mul(L, -half))
  bar(T, pl, add(pl, [0, 0, H]), 1.0, 1.0, dir)
  bar(T, pr, add(pr, [0, 0, H]), 1.0, 1.0, dir)
  bar(T, add(pl, [0, 0, H - 1.6]), add(pr, [0, 0, H - 1.6]), 2.2, 0.6, [0, 0, 1])
  // Gable: the hall over the platform, 24 x 13 m, ridge 5.5 m over the flat roof, gable ends in the walls' blue-grey with a pale trim.
  const toM = kit.toModel
  const ring = STATION.map((q) => toM(q))
  const g = Math.max(...ring.map(([x, y]) => kit.ground(x, y)))
  const z0 = g + roofZ, zr = z0 + 5.5
  const c = toM([-1.6, -1.8]), ax = unit([2.9 - -5.4, 7.4 - -12.5, 0]), nx: V3 = [-ax[1], ax[0], 0]
  const P = (u: number, v: number, z: number): V3 => [c[0] + ax[0] * u + nx[0] * v, c[1] + ax[1] * u + nx[1] * v, z]
  const R = kit.parts.roof, A = 12, B = 6.5
  R.quad(P(-A, B, z0), P(-A, 0, zr), P(A, 0, zr), P(A, B, z0))
  R.quad(P(A, -B, z0), P(A, 0, zr), P(-A, 0, zr), P(-A, -B, z0))
  // Gable ends in the wall colour, with a pale trim band along the rakes.
  const S = kit.parts.stone
  S.tri(P(A, B, z0), P(A, 0, zr), P(A, -B, z0))
  S.tri(P(-A, -B, z0), P(-A, 0, zr), P(-A, B, z0))
  for (const e of [A + 0.05, -A - 0.05]) for (const sg of [1, -1]) {
    bar(T, P(e, sg * B, z0 + 0.2), P(e, 0, zr + 0.2), 0.5, 0.25, [0, 0, 1])
  }
}

/**
 * The lift and first-drop structure reads in every photo as a near-solid
 * timber wall. Behind the kit's bents and ledgers, a double-sided wall
 * plane runs along the track's centreline from the ground to the underside
 * of the track, in a darker timber, so the bents and ledgers stand proud of
 * it and the gaps between them read as the shaded openings of a dense wall.
 */
function liftWall(kit: CoasterKit, from: number, to: number, step = 3) {
  const P = new Part(), D = kit.track.DEPTH
  let prev: { top: V3; bot: V3 } | null = null
  for (let ps = from; ps <= to; ps += step) {
    const f = kit.at(ps), u = add(f.p, mul(f.up, -D - 0.2))
    const g = kit.ground(u[0], u[1])
    const cur = { top: u, bot: [u[0], u[1], g - 0.5] as V3 }
    if (prev && u[2] - g > 2 && prev.top[2] - kit.ground(prev.top[0], prev.top[1]) > 2) {
      P.quad(prev.bot, cur.bot, cur.top, prev.top)
      P.quad(cur.bot, prev.bot, prev.top, cur.top)
    }
    prev = cur
  }
  return P
}

function clampSpikes(kit: CoasterKit, length: number) {
  const pts: V3[] = []
  for (let ps = 0; ps < length; ps += 0.75) pts.push(kit.at(ps).p)
  const P = kit.parts.supports.pos
  let n = 0
  for (let i = 0; i < P.length; i += 3) {
    // Part stores glTF (x, z, -y).
    const x = P[i], y = -P[i + 2], z = P[i + 1]
    let top = -Infinity
    for (const q of pts) if (Math.abs(q[0] - x) < 4 && Math.abs(q[1] - y) < 4 && Math.hypot(q[0] - x, q[1] - y) < 4) top = Math.max(top, q[2])
    if (top > -Infinity && z > top + 0.3) { P[i + 1] = top + 0.3; n++ }
  }
  if (n) console.log(`clamped ${n} timber vertices under overbanked track`)
}

// The OSM circuit in ride order, node by node, in the park frame: metres east
// and north of lon -97.07302, lat 32.75637 (the OSM attraction node
// node/1207178486). From the station exit (south end of the station) along
// way/603559513 (reversed), way/603559514 (reversed), way/104655706
// (reversed), way/603559507 (reversed), way/603559508 and way/104655708
// (through the station).
const CHAIN: [number, number][] = [
  [-5.4, -12.5], [-12.4, -28.4], [-13.7, -31.1], [-15.2, -33.9], [-16.5, -35.1], [-18.4, -36.6], [-20.8, -37.4], [-23.0, -37.6],
  [-25.4, -37.4], [-27.4, -36.7], [-29.3, -35.2], [-30.6, -33.4], [-31.7, -31.3], [-32.0, -29.0], [-31.9, -26.5], [-31.2, -24.3],
  [-27.2, -13.4], [-23.9, -2.8], [-3.5, 60.7], [-2.3, 64.6], [23.4, 108.7], [26.4, 113.4], [30.6, 119.3], [47.8, 146.6],
  [49.0, 149.4], [49.9, 152.8], [50.4, 155.5], [50.5, 159.2], [50.1, 161.7], [48.9, 164.3], [46.6, 166.5], [42.5, 169.4],
  [39.6, 170.8], [36.4, 171.8], [31.4, 172.3], [26.6, 171.9], [-5.1, 170.0], [-10.9, 169.8], [-14.3, 168.7], [-17.8, 166.5],
  [-20.3, 164.1], [-22.4, 160.7], [-23.8, 157.3], [-25.5, 153.4], [-26.1, 150.3], [-26.9, 136.5], [-27.7, 117.9], [-28.1, 110.6],
  [-27.9, 106.1], [-27.1, 101.6], [-25.4, 96.7], [-22.9, 92.0], [-20.4, 89.1], [-1.8, 68.6], [0.6, 66.1], [4.1, 61.8],
  [6.2, 58.4], [7.7, 55.5], [8.7, 52.4], [9.5, 49.0], [9.9, 45.8], [9.9, 43.1], [9.7, 40.7], [9.3, 38.3],
  [8.5, 35.5], [7.4, 33.1], [1.2, 19.6], [-2.8, 12.9], [-4.5, 11.1], [-6.4, 9.5], [-8.5, 8.5], [-10.7, 7.6],
  [-13.5, 6.9], [-16.1, 6.8], [-18.4, 7.1], [-22.0, 8.0], [-24.7, 9.8], [-26.8, 11.8], [-28.7, 14.1], [-30.0, 17.0],
  [-30.8, 20.2], [-31.0, 22.8], [-30.4, 26.5], [-25.6, 49.1], [-23.8, 57.5], [-21.7, 65.7], [-21.0, 70.9], [-21.5, 76.7],
  [-23.1, 81.0], [-25.5, 85.3], [-29.7, 92.2], [-31.2, 95.8], [-32.4, 99.4], [-32.6, 103.0], [-31.9, 120.9], [-31.0, 144.6],
  [-30.3, 150.2], [-29.4, 155.2], [-28.6, 158.9], [-26.9, 163.1], [-25.7, 165.6], [-24.0, 167.8], [-21.7, 169.9], [-19.6, 171.4],
  [-17.3, 172.6], [-14.7, 173.7], [-10.1, 175.2], [-3.4, 176.4], [4.8, 177.0], [29.1, 178.0], [32.9, 177.5], [35.9, 176.8],
  [40.1, 175.3], [42.8, 173.8], [46.1, 171.6], [47.8, 169.0], [48.7, 166.3], [48.6, 162.7], [48.0, 159.4], [46.9, 155.2],
  [44.6, 148.3], [33.5, 116.9], [31.6, 112.9], [30.3, 108.6], [29.3, 104.7], [28.5, 100.9], [25.0, 72.8], [24.3, 68.5],
  [23.2, 64.1], [22.3, 61.1], [4.6, 11.7], [2.9, 7.4], [-0.0, 0.5],
]
// Terrain (Mapterhorn z15, tools/terrain.ts), 10 m cells from (-130, -49);
// rows south to north, columns west to east; metres above 155.88 m.
const GROUND = [
  [3.0, 2.9, 3.4, 3.6, 3.0, 3.0, 2.9, 2.7, 2.6, 3.1, 2.7, 2.6, 2.6, 3.8, 2.2, 1.4, 2.1, 2.8, 4.1, 3.0, 2.9, 2.8, 3.6, 5.1, 5.7, 5.5, 5.8],
  [3.0, 2.8, 2.9, 2.9, 2.8, 2.8, 2.6, 2.6, 2.7, 2.8, 2.4, 2.1, 2.6, 3.1, 3.6, 2.0, 1.5, 2.1, 3.6, 2.9, 3.2, 3.4, 3.6, 4.5, 4.9, 5.5, 5.9],
  [3.0, 2.8, 2.8, 2.8, 2.9, 2.6, 2.5, 1.2, 2.3, 2.3, 1.8, 1.8, 2.4, 2.7, 4.2, 2.5, 1.3, 1.6, 2.1, 1.4, 2.9, 2.7, 3.8, 4.4, 4.9, 5.2, 5.8],
  [3.1, 2.8, 2.8, 2.8, 2.9, 1.9, 1.9, 2.0, 0.8, 1.9, 1.7, 1.7, 2.0, 2.3, 3.8, 2.5, 1.2, 1.2, 1.2, 1.3, 1.3, 2.1, 4.1, 4.6, 4.8, 5.4, 5.8],
  [3.1, 2.4, 2.7, 2.6, 2.2, 2.1, 2.3, 2.3, 1.9, 0.4, 1.6, 1.8, 2.0, 2.6, 3.0, 2.2, 2.2, 1.9, 1.3, 1.2, 1.2, 1.2, 3.2, 4.7, 5.1, 5.7, 5.8],
  [0.0, 1.5, 2.8, 2.6, 2.1, 2.2, 2.6, 2.6, 0.6, 1.9, 1.6, 1.9, 2.0, 2.7, 3.7, 4.0, 3.1, 2.8, 2.8, 3.2, 2.7, 1.2, 1.2, 2.0, 5.1, 5.7, 5.9],
  [0.0, 0.1, 0.3, 2.6, 2.6, 2.6, 2.8, 0.6, 2.1, 1.9, 1.8, 1.8, 1.9, 2.4, 3.5, 4.3, 4.3, 4.3, 4.3, 4.2, 4.2, 3.3, 1.6, 1.2, 4.5, 5.7, 5.9],
  [0.0, 0.0, 0.0, 0.0, 1.7, 2.6, 2.8, 0.3, 2.1, 1.9, 1.6, 1.8, 1.9, 2.2, 3.0, 4.4, 4.4, 4.5, 4.5, 4.3, 4.4, 4.4, 3.2, 1.2, 2.4, 5.6, 5.6],
  [2.3, 0.1, 0.0, 0.0, 0.1, 0.4, 1.9, 0.2, 2.1, 2.0, 1.6, 1.7, 1.8, 2.1, 2.6, 4.1, 4.5, 4.6, 4.5, 4.4, 4.3, 3.8, 1.9, 1.2, 1.7, 5.5, 5.6],
  [4.2, 3.6, 2.6, 2.0, 0.9, 0.1, 0.1, 0.2, 2.3, 2.0, 1.8, 1.6, 1.7, 1.9, 2.2, 3.7, 4.3, 4.6, 4.6, 4.7, 4.7, 4.7, 2.2, 1.2, 2.4, 5.3, 5.5],
  [4.4, 4.2, 3.6, 3.1, 2.5, 1.0, 0.1, 0.1, 0.9, 2.1, 1.9, 1.6, 1.6, 1.7, 2.0, 3.1, 4.3, 4.6, 4.6, 4.3, 4.3, 3.9, 1.4, 1.2, 4.2, 4.9, 4.8],
  [4.6, 4.3, 4.1, 3.6, 3.3, 2.7, 2.3, 0.0, 0.2, 1.2, 1.7, 1.5, 1.4, 1.5, 1.7, 2.3, 4.2, 4.6, 3.4, 1.8, 1.7, 1.6, 1.2, 1.7, 3.6, 4.5, 4.6],
  [5.2, 4.9, 4.6, 4.3, 4.1, 3.6, 2.7, 2.3, 0.3, 0.1, 1.4, 1.3, 1.3, 1.4, 1.6, 2.0, 3.9, 4.2, 2.2, 1.9, 1.7, 1.2, 1.3, 2.5, 3.3, 3.9, 4.0],
  [5.6, 5.3, 4.9, 4.5, 4.3, 3.8, 3.3, 2.5, 2.3, 0.1, 0.2, 0.5, 1.1, 1.3, 1.5, 1.8, 2.8, 4.1, 2.3, 1.9, 1.5, 1.2, 2.0, 2.3, 3.1, 3.5, 3.6],
  [7.1, 6.1, 5.1, 4.5, 4.2, 4.1, 3.6, 3.3, 2.5, 2.2, 0.1, 0.2, 1.2, 1.1, 1.3, 1.6, 1.6, 3.9, 2.3, 1.8, 1.3, 1.2, 2.1, 2.3, 3.0, 3.4, 3.3],
  [8.2, 7.9, 7.0, 5.4, 4.3, 4.2, 3.9, 3.5, 2.9, 2.4, 1.5, 0.7, 0.1, 0.8, 1.2, 1.6, 1.4, 2.4, 2.2, 1.8, 1.2, 1.4, 2.1, 2.4, 2.6, 2.4, 2.9],
  [8.2, 8.1, 8.0, 7.5, 5.3, 4.3, 4.1, 3.8, 3.5, 2.9, 2.3, 1.8, 0.2, 0.1, 0.9, 1.4, 1.4, 1.4, 1.4, 1.7, 1.5, 1.9, 2.4, 2.4, 2.3, 2.7, 2.9],
  [8.3, 8.2, 8.0, 7.4, 5.3, 4.6, 4.2, 3.8, 3.4, 3.1, 2.5, 2.3, 1.5, 0.1, 0.2, 1.3, 1.3, 1.5, 1.4, 1.5, 1.7, 2.0, 2.3, 2.3, 2.6, 2.8, 2.8],
  [8.2, 8.2, 7.6, 6.4, 4.9, 4.5, 4.4, 4.1, 3.4, 3.1, 2.9, 2.5, 2.4, 1.3, 0.2, 0.1, 1.3, 1.1, 1.4, 1.8, 1.7, 2.1, 2.4, 2.3, 2.5, 2.7, 2.6],
  [8.1, 8.1, 6.0, 5.3, 4.8, 4.6, 4.6, 4.1, 3.7, 3.1, 2.9, 2.5, 0.7, 2.1, 0.5, 0.1, 1.1, 1.3, 1.8, 3.4, 1.7, 2.2, 2.3, 2.3, 2.3, 2.5, 2.4],
  [8.4, 7.2, 5.8, 5.2, 4.9, 4.7, 4.4, 4.0, 3.6, 2.9, 2.9, 2.6, 2.4, 1.6, 1.5, 0.1, 0.4, 1.8, 1.7, 4.0, 2.2, 1.9, 2.1, 2.3, 2.1, 2.4, 2.4],
  [8.3, 6.5, 5.8, 5.3, 5.0, 4.7, 4.2, 4.0, 3.5, 3.1, 2.9, 2.8, 2.9, 2.4, 2.1, 0.3, 0.1, 1.7, 1.5, 2.4, 3.4, 1.8, 2.3, 2.3, 2.3, 2.4, 2.4],
  [7.8, 6.5, 5.9, 5.5, 5.2, 4.8, 4.2, 3.9, 3.6, 3.4, 3.1, 3.0, 2.9, 2.8, 2.3, 0.5, 0.1, 1.0, 1.5, 1.7, 2.6, 3.2, 1.8, 2.2, 2.1, 2.4, 2.4],
  [7.3, 6.5, 5.9, 5.4, 5.1, 4.7, 4.2, 4.0, 3.1, 3.9, 3.5, 3.1, 3.1, 3.1, 3.0, 2.4, 0.3, 0.2, 0.9, 1.8, 1.8, 2.0, 3.3, 1.9, 1.7, 2.2, 2.3],
  [8.0, 6.4, 5.9, 5.5, 5.1, 4.5, 3.3, 3.2, 4.0, 4.0, 4.0, 4.1, 4.2, 3.6, 3.2, 3.2, 3.1, 0.9, 0.1, 0.2, 1.9, 1.8, 1.8, 2.7, 2.5, 1.7, 1.6],
  [7.4, 6.2, 6.1, 5.8, 5.4, 3.3, 3.6, 4.1, 4.3, 4.4, 4.7, 5.1, 5.2, 5.6, 4.1, 3.4, 3.3, 3.1, 1.4, 0.5, 0.2, 1.7, 2.2, 1.8, 1.8, 2.6, 2.4],
  [6.7, 6.2, 6.0, 5.8, 4.8, 4.1, 5.0, 4.9, 4.5, 4.6, 5.0, 5.4, 5.7, 6.0, 5.1, 3.8, 3.4, 3.5, 3.2, 1.9, 0.2, 0.2, 1.5, 2.8, 1.6, 2.2, 2.8],
]
// The station building (way/104655707).
const STATION: [number, number][] = [
  [-11.1, 5.9], [-18.1, -10.3], [-13.6, -12.3], [-11.1, -13.4], [-10.8, -12.8], [-9.5, -10.5], [-1.5, -14.0], [0.8, -8.8],
  [2.3, -9.5], [5.3, -2.8], [3.5, -2.0], [7.2, 6.5], [2.7, 8.5], [-0.3, 9.8], [-3.5, 2.6],
]

await buildCoaster({
  name: 'New Texas Giant',
  out: '../models/dal-new-texas-giant.glb',
  origin: [-97.07302, 32.75637],
  chain: CHAIN,
  anchor: [9, 70],
  ground: { x0: -130, y0: -49, step: 10, rows: GROUND, base: 155.88 },
  // Heights above the local ground; s along the OSM polyline (957 m round).
  profile: [
    { name: 'station', s: 0, z: 1.5 },
    { name: 'foot of the lift', s: 72, z: 1.5, r: 20 },
    { name: 'lift crest (153 ft), 79° drop', s: 141, z: 46.6, r: 17, pitch: 79 },
    { name: 'first drop, foot (147 ft)', s: 188, z: 1.8, r: 35 },
    { name: 'double up, crest', s: 236, z: 26, r: 30 },
    { name: '90° overbanked turn (north-east)', s: 264, z: 20 },
    { name: 'dip', s: 298, z: 4 },
    { name: '95° overbanked turn (north-west)', s: 333, z: 18 },
    { name: 'dip', s: 368, z: 3.5 },
    { name: '115° overbanked turn (west)', s: 398, z: 12, r: 18 },
    { name: 'valley', s: 422, z: 6, r: 30 },
    { name: 'airtime hill', s: 444, z: 10 },
    { name: 'valley', s: 464, z: 6 },
    { name: 'mid-course brakes', s: 484, z: 11 },
    { name: 'mid-course brakes, end', s: 498, z: 11, r: 22 },
    { name: '180° turnaround (south)', s: 522, z: 3, r: 25 },
    { name: 'turnaround, end', s: 540, z: 3, r: 20 },
    { name: 'hill', s: 560, z: 7, r: 20 },
    { name: 'valley', s: 580, z: 3, r: 20 },
    { name: 'hill', s: 601, z: 6.5, r: 20 },
    { name: 'valley', s: 622, z: 3, r: 20 },
    { name: 'hill', s: 645, z: 6, r: 20 },
    { name: 'valley', s: 668, z: 3, r: 20 },
    { name: 'banked turn (north-west)', s: 695, z: 6, r: 20 },
    { name: 'valley', s: 720, z: 2.5, r: 20 },
    { name: 'hill', s: 738, z: 6.5, r: 20 },
    { name: 'banked turn (north-east), low', s: 768, z: 3, r: 20 },
    { name: 'tunnel (east)', s: 805, z: 1.5 },
    { name: 'tunnel, end', s: 818, z: 1.5, r: 20 },
    { name: 'hill', s: 840, z: 5.5, r: 20 },
    { name: 'valley', s: 862, z: 2, r: 20 },
    { name: 'final tunnel', s: 882, z: 1.5 },
  ],
  lift: [72, 141],
  brakes: [
    { from: 484, to: 498, z: 11, head: 4 },
    { from: 905, to: 72, z: 1.5, head: 0.5 },
  ],
  losses: [0.007, 0.0003],
  track: { W: 3.0, RAIL: 0.5, DEPTH: 1.1, SPINE: 2.6 },
  station: { ring: STATION, posts: [], roofZ: 6 },
  stationWalls: true,
  covers: [{ from: 797, to: 820 }, { from: 880, to: 930 }],
  trestle: { every: 6, along: 2.2, levelStep: 4.2, ledgerH: 1.2 },
  rolls: [
    { from: 252, to: 272, deg: 90, ease: 28, name: '90° overbanked turn' },
    { from: 324, to: 342, deg: 95, ease: 28, name: '95° overbanked turn' },
    { from: 388, to: 400, deg: 115, ease: 44, name: '115° overbanked turn' },
  ],
  colours: {
    deck: ['ntg-red', 0xb4444a], spine: 'deck', supports: ['ntg-timber', 0xbfa98a],
    station: ['ntg-station', 0x5f6878],
  },
  supportR: [0.5, 0.6, 0.7],
  meta: { height: 46.6, trackLength: 1280 },
  sampleDeg: 12,
  extras: (kit) => (clampSpikes(kit, 957), crestAndGable(kit, 6), batter(kit, 64, 420),
    [{ part: liftWall(kit, 66, 200), material: finish('ntg-timber-2', 0x9a8670) }]),
})
