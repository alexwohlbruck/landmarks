/**
 * Clark County Government Center, Las Vegas (C. W. Fentress, J. H. Bradburn
 * and Associates, 1995): stepped red-sandstone office blocks wrapped round
 * a sloped lawn amphitheatre, the six-storey administration block on its
 * two-storey colonnade, the cylindrical rotunda with its sliced top and
 * tilted beam, the low pyramid of the cafeteria, the sawtooth skylights of
 * the commission chambers and the shaded circular arcade. Procedural,
 * CC0-1.0.
 * bun generators/lv-clark-county-government-center.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the plan is radial,
 * with no one main axis). The origin is the area centroid of the OSM
 * outline, relation/19293385 (outer way/226508856, inner way/1410015395).
 *
 * Published (Wikipedia, "Clark County Government Center"): a six-story
 * administration building, one-story commission chambers, a pyramid-shaped
 * cafeteria and a cylindrical six-story reception hall (the rotunda); "the
 * shaded, circular arcade" round an amphitheatre 280 ft (85 m) across.
 *
 * Measured:
 * - OSM: the outline and its 44 building:parts, used as drawn for the plan
 *   of every block, the pyramid (a square 41 m on a side, turned 45°, 12 m
 *   tall), the rotunda (a circle 23.6 m across), the stepped south-east and
 *   east wings (15, 10 and 5 m), the arcade roofs (building=roof, 5 m);
 * - USGS NAIP orthophoto (public domain): the plan again, the penthouses
 *   (from their shadows), the rotunda's round skylight and the beam across
 *   it, the sawtooth roof south of the amphitheatre;
 * - heights from the photos, where OSM disagrees with them: the north-west
 *   wing has three storeys (13 m, OSM 10), the administration block south-
 *   east of the rotunda six (26 m; OSM leaves it untagged), on a two-storey
 *   colonnade facing the amphitheatre; the rotunda rises above it, its top
 *   cut on a slope from about 29 m to 36 m.
 *
 * Photos (Wikimedia Commons):
 * - g2 "Clark County Government Center aerial view.png" and g4/g6 (the
 *   pyramid and Lou Ruvo), Carol M. Highsmith, public domain: from the
 *   south-west, above, and the pyramid from the north;
 * - g5 "Clarkcountygovernmentcenter.jpg", Coolcaesar, CC BY-SA 3.0: the
 *   same view from the Stratosphere;
 * - g3 "Clark County Government Center Amphitheater.jpg", Coolcaesar,
 *   CC BY-SA 4.0: the rotunda and the administration block from the west;
 * - g1 "Clark County Government Center - panoramio.jpg", Alen Ištoković,
 *   CC BY 3.0: the pyramid and its skylight slots.
 *
 * Estimated: the storey height (4.2 m), the window rhythm (two windows to a
 * panel), the penthouses' size, the slope and peak of the rotunda's top and
 * the beam's angle, the sawtooth's rows (four, standing for OSM's sixteen
 * small skillion parts), the arcades' column spacing. The plaza, the lawn
 * and the stage are the map's.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, cap, ccw, type XY } from './lv-wynn'
import { lathe } from './lv-mgm-grand'

const stone = new Part() // the red sandstone walls
const roof = new Part() // flat roofs, a shade darker
const win = new Part()
const glass = new Part()

const lift = (r: XY[], z: number) => r.map(([x, y]): V3 => [x, y, z])

/** Vertical walls round a ring from z0 to z1, with a flat roof; optionally a floor. */
function block(poly: XY[], z0: number, z1: number, top: Part | null = roof, bottom = false) {
  const r = ccw(poly)
  stone.loft([lift(r, z0), lift(r, z1)])
  if (top) cap(top, r, z1)
  if (bottom) cap(stone, r, z0, false)
}

/**
 * Window panels on every edge of a ring, per storey: `pitch` apart along
 * each edge, `w` wide, kept `margin` in from the corners.
 */
function windows(poly: XY[], floors: [number, number][], pitch = 5.2, w = 2.6, margin = 1.6, skip?: (mid: XY) => boolean) {
  const r = ccw(poly)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < w + 2 * margin) continue
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
    if (skip && skip([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2])) continue
    const k = Math.max(1, Math.floor((L - 2 * margin) / pitch))
    const step = (L - 2 * margin) / k
    for (let j = 0; j < k; j++) {
      const s = margin + step * (j + 0.5)
      const P = (u: number, z: number): V3 => [a[0] + t[0] * u + n[0] * 0.06, a[1] + t[1] * u + n[1] * 0.06, z]
      for (const [z0, z1] of floors) win.quad(P(s - w / 2, z0), P(s + w / 2, z0), P(s + w / 2, z1), P(s - w / 2, z1))
    }
  }
}
const storeys = (n: number, from = 0, h = 4.2, sill = 1.3, head = 0.9): [number, number][] =>
  Array.from({ length: n }, (_, k) => [from + k * h + sill, from + (k + 1) * h - head] as [number, number])

/** A round column. */
const column = (c: XY, r: number, z0: number, z1: number) => lathe(stone, c, [[r, z0], [r, z1]], 8)

// ------------------------------------------------------------------ plan
// The OSM parts, as drawn (metres from the origin).
const NW_WING: XY[] = [[-52.0, 23.9], [-48.6, 24.4], [-44.3, 24.7], [-40.3, 24.8], [-35.5, 24.5], [-31.0, 23.7], [-26.8, 23.0], [-23.0, 22.0], [-18.8, 20.3], [-15.3, 18.7], [-11.7, 16.6], [-1.3, 36.1], [15.9, 46.2], [10.8, 54.9], [-0.2, 73.4], [-16.7, 63.6], [-20.2, 69.5], [-23.3, 74.7], [-26.3, 72.9], [-50.8, 58.6], [-57.0, 55.0], [-57.4, 54.8], [-56.2, 48.8], [-54.0, 35.5], [-52.5, 26.6]]
const NORTH_BLOCK: XY[] = [[23.8, 4.1], [37.9, 10.0], [49.4, -9.5], [55.0, -6.2], [43.5, 12.6], [39.4, 19.9], [28.3, 38.5], [22.6, 34.9], [15.9, 46.2], [-1.3, 36.1], [-11.7, 16.6], [-12.3, 15.5], [-9.9, 14.2], [-5.9, 11.4], [-2.8, 8.7], [1.3, 5.0], [2.5, 3.9], [4.5, 6.4], [6.5, 8.4], [8.9, 9.8], [11.7, 10.6], [14.5, 10.7], [17.3, 10.1], [19.8, 8.8], [22.0, 6.9]]
// The administration block, south-east of the rotunda: OSM part
// way/1410021784 (over the walkway) and the untagged rest of the outline.
const COLONNADE_FACE: XY[] = [[3.0, -60.8], [5.8, -55.8], [7.7, -52.1], [9.5, -45.7], [11.1, -37.3], [11.1, -30.9], [10.4, -24.3], [9.0, -19.0], [10.6, -11.3]]
const ADMIN: XY[] = [[6.8, -63.4], [8.6, -64.5], [26.2, -75.6], [31.1, -72.4], [61.2, -54.4], [51.3, -37.7], [57.1, -34.7], [62.2, -30.3], [52.5, -14.8], [49.4, -9.5], [37.9, 10.0], [23.8, 4.1], [24.5, 2.0], [24.8, -0.9], [24.4, -3.7], [23.2, -6.3], [21.5, -8.5], [19.3, -10.2], [16.6, -11.4], [13.8, -11.8], ...[...COLONNADE_FACE].reverse()]
const SE_WING_15: XY[] = [[31.1, -72.4], [61.2, -54.4], [51.3, -37.7], [57.1, -34.7], [58.8, -37.4], [69.9, -56.5], [38.0, -75.4]]
const SE_WING_10: XY[] = [[38.0, -75.4], [69.9, -56.5], [73.0, -61.9], [67.4, -65.1], [70.8, -70.8], [59.7, -77.1], [63.2, -82.8], [51.3, -90.1], [48.2, -84.6], [44.5, -79.7], [40.8, -76.8]]
const EAST_LOW: XY[] = [[52.5, -14.8], [62.2, -30.3], [66.0, -28.2], [72.9, -24.9], [78.8, -21.6], [66.0, 0.1], [60.5, -3.0], [68.6, -16.5], [63.0, -19.8], [58.1, -11.5]]
const E_STEP: { poly: XY[]; h: number }[] = [
  { poly: [[39.4, 19.9], [28.3, 38.5], [33.6, 41.8], [44.5, 23.8]], h: 15 },
  { poly: [[44.5, 23.8], [33.6, 41.8], [39.0, 45.2], [49.4, 27.8]], h: 10 },
  { poly: [[43.5, 12.6], [55.0, -6.2], [60.5, -3.0], [49.6, 15.4]], h: 15 },
  { poly: [[60.5, -3.0], [66.0, 0.1], [55.6, 17.7], [49.6, 15.4]], h: 10 },
  { poly: [[44.5, 23.8], [39.4, 19.9], [43.5, 12.6], [49.6, 15.4], [47.1, 19.6]], h: 10 },
  { poly: [[55.0, -6.2], [49.4, -9.5], [52.5, -14.8], [58.1, -11.5]], h: 10 },
]
const PYRAMID = { c: [-93.05, 25.75] as XY, corners: [[-95.1, -2.9], [-63.7, 23.9], [-91.2, 54.3], [-122.2, 27.7]] as XY[], h: 12 }
const PYR_LINK: XY[] = [[-86.1, 36.5], [-77.8, 26.8], [-69.6, 30.6], [-64.5, 32.2], [-59.5, 33.5], [-53.9, 34.8], [-56.1, 48.4], [-58.4, 48.2], [-63.9, 47.0], [-69.4, 45.2], [-74.6, 43.0], [-79.3, 40.9]]
// The curved two-storey arcade along the amphitheatre's north side (OSM
// way/1410020942, 4 to 10 m).
const N_ARCADE: XY[] = [[1.3, 5.0], [-2.8, 8.7], [-5.9, 11.4], [-9.9, 14.2], [-12.3, 15.5], [-15.3, 18.7], [-18.8, 20.3], [-23.0, 22.0], [-26.8, 23.0], [-31.0, 23.7], [-35.5, 24.5], [-40.3, 24.8], [-44.3, 24.7], [-48.6, 24.4], [-52.0, 23.9], [-51.1, 18.1], [-46.4, 18.8], [-41.8, 19.1], [-35.2, 18.9], [-30.9, 18.3], [-26.3, 17.2], [-19.0, 14.1], [-12.0, 10.3], [-4.3, 4.2], [-0.9, 1.1]]
const CHAMBERS: XY[] = [[-24.8, -56.5], [-13.3, -39.7], [9.5, -45.7], [7.7, -52.1], [5.8, -55.8], [3.0, -60.8], [0.3, -65.0], [-2.4, -68.6], [-6.5, -72.8], [-9.7, -75.5], [-12.3, -75.1], [-19.3, -64.7]]
// The shaded arcades' roofs (building=roof, 5 m).
const ARCADES: XY[][] = [
  [[-62.7, -80.8], [-64.9, -86.0], [-72.2, -82.3], [-77.0, -79.1], [-81.3, -75.4], [-85.4, -70.9], [-89.6, -65.7], [-92.0, -61.4], [-95.4, -54.4], [-97.4, -48.0], [-98.8, -41.6], [-99.3, -35.5], [-99.2, -28.4], [-98.3, -21.1], [-96.7, -15.1], [-94.9, -10.4], [-92.6, -5.7], [-88.9, 0.0], [-85.8, 4.1], [-81.6, 8.4], [-77.7, 4.5], [-80.8, 1.2], [-83.2, -1.7], [-85.9, -5.4], [-87.9, -9.1], [-89.7, -12.7], [-91.3, -16.7], [-92.4, -21.0], [-93.0, -24.5], [-93.6, -29.0], [-93.6, -33.5], [-93.3, -38.3], [-92.8, -42.8], [-91.7, -47.2], [-90.7, -50.5], [-88.8, -54.9], [-87.6, -57.4], [-85.8, -60.6], [-83.7, -63.7], [-81.5, -66.6], [-78.1, -70.3], [-75.1, -72.9], [-70.9, -76.2], [-66.0, -79.0]],
  [[-73.8, 7.9], [-75.8, 10.3], [-77.4, 12.4], [-72.9, 15.4], [-68.8, 17.9], [-64.9, 20.0], [-59.4, 22.2], [-53.9, 23.7], [-52.0, 23.9], [-51.1, 18.1], [-53.5, 17.6], [-55.1, 17.2], [-59.9, 15.9], [-64.8, 13.8], [-68.9, 11.3]],
  [[-11.6, -76.1], [-9.2, -80.0], [-10.9, -81.0], [-13.2, -82.5], [-17.2, -84.8], [-21.6, -86.7], [-26.1, -88.2], [-31.9, -89.6], [-32.7, -84.7], [-28.5, -83.9], [-24.2, -82.6], [-18.8, -80.5], [-13.7, -77.5]],
]
// The walkway's arcade from the rotunda south-west (OSM way/1410021783).
const WALK_ARCADE: XY[] = [[10.6, -11.3], [5.2, -8.1], [3.2, -10.8], [-0.4, -15.8], [2.2, -19.3], [4.6, -21.1], [7.2, -21.7], [9.0, -19.0], [10.4, -24.3], [11.1, -30.9], [11.1, -37.3], [9.5, -45.7], [7.7, -52.1], [5.8, -55.8], [3.0, -60.8], [0.3, -65.0], [-2.4, -68.6], [-6.5, -72.8], [-11.3, -76.7], [-9.2, -80.0], [-3.5, -75.7], [1.4, -70.8], [5.4, -65.7], [6.8, -63.4], [11.1, -56.7], [13.6, -50.3], [15.1, -43.8], [15.8, -33.7], [15.0, -26.1], [13.6, -19.0], [11.9, -14.3]]

// --------------------------------------------------------------- blocks
const H_ADMIN = 28 // six storeys
const H_COL = 11.2 // the colonnade, as tall as two and a half storeys
// The administration block: six storeys over the full plan from the
// colonnade's top; below it the ground floors stand 3.5 m back behind a row
// of round columns along the face to the amphitheatre.
{
  const back = (p: XY, k: number): XY => {
    // step each face vertex back (east-south-east, into the block)
    const a = COLONNADE_FACE[Math.max(0, k - 1)], b = COLONNADE_FACE[Math.min(COLONNADE_FACE.length - 1, k + 1)]
    const t = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(t[0], t[1])
    return [p[0] + (t[1] / l) * 3.5, p[1] - (t[0] / l) * 3.5]
  }
  const faceBack = COLONNADE_FACE.map(back)
  const lower: XY[] = ADMIN.map((p) => {
    const k = COLONNADE_FACE.findIndex((q) => q[0] === p[0] && q[1] === p[1])
    return k < 0 ? p : faceBack[k]
  })
  block(lower, 0, H_COL, null)
  block(ADMIN, H_COL, H_ADMIN, roof, true)
  windows(ADMIN, storeys(4, H_COL), 5.2, 2.6, 1.6, ([x, y]) => Math.hypot(x - 12.65, y + 0.55) < 13)
  windows(lower, storeys(2, 0, 5.6), 5.2, 2.6, 1.6, ([x, y]) => Math.hypot(x - 12.65, y + 0.55) < 13 || x < 16)
  // Behind the columns the recessed wall is glazed and in shade: dark.
  for (let k = 0; k < faceBack.length - 1; k++) {
    const a = faceBack[k], b = faceBack[k + 1]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n: XY = [-(b[1] - a[1]) / L, (b[0] - a[0]) / L] // west, out of the recess
    const P = (p: XY, z: number): V3 => [p[0] + n[0] * 0.06, p[1] + n[1] * 0.06, z]
    win.quad(P(b, 0), P(a, 0), P(a, H_COL - 0.4), P(b, H_COL - 0.4))
  }
  // the columns, along the face's line
  for (let k = 0; k < COLONNADE_FACE.length - 1; k++) {
    const a = COLONNADE_FACE[k], b = COLONNADE_FACE[k + 1]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.max(1, Math.round(L / 6.5))
    for (let j = k === 0 ? 0 : 1; j <= n; j++) {
      const t = j / n, inset = 0.9
      const p = back(a, k), q = back(b, k + 1)
      const s = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      const f = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]
      column([s[0] + (f[0] - s[0]) * (inset / 3.5), s[1] + (f[1] - s[1]) * (inset / 3.5)], 0.8, 0, H_COL)
    }
  }
  // The penthouse over the block, near the rotunda.
  const ph = rectAt([33, -28], 28, 17, 15)
  block(ph, H_ADMIN, H_ADMIN + 4.5)
}
block(NORTH_BLOCK, 0, 20)
windows(NORTH_BLOCK, storeys(4), 5.2, 2.6, 1.6, ([x, y]) => Math.hypot(x - 12.65, y + 0.55) < 13)
block(NW_WING, 0, 13)
windows(NW_WING, storeys(3))
block(rectAt([-33, 44], 19, 19, 30), 13, 17) // its penthouse
block(SE_WING_15, 0, 15)
windows(SE_WING_15, storeys(3))
block(SE_WING_10, 0, 10)
windows(SE_WING_10, storeys(2))
block(EAST_LOW, 0, 5)
for (const s of E_STEP) {
  block(s.poly, 0, s.h)
  windows(s.poly, storeys(Math.round(s.h / 5)))
}
block(PYR_LINK, 0, 5)
// The small pavilion on the amphitheatre's south-east side (OSM 1410027349).
block([[-28.4, -52.4], [-36.8, -40.0], [-34.7, -38.2], [-32.7, -33.3], [-17.1, -37.7]], 0, 5)
// The two-storey arcade on the amphitheatre's north side: a gallery from
// 4 to 10 m on columns along its inner edge.
{
  block(N_ARCADE, 4, 10, roof, true)
  windows(N_ARCADE, [[5.5, 8.6]], 4.2, 2.2, 1.0)
  const inner = N_ARCADE.slice(15) // the amphitheatre side, west to east
  for (let k = 0; k < inner.length - 1; k += 1) {
    const [a, b] = [inner[k], inner[k + 1]]
    column([a[0] + (b[0] - a[0]) * 0.5, a[1] + (b[1] - a[1]) * 0.5 + 0.9], 0.55, 0, 4)
  }
}
// The commission chambers: one storey under four rows of sawtooth
// skylights, their glazed faces to the north.
{
  block(CHAMBERS, 0, 6)
  windows(CHAMBERS, [[1.2, 4.4]], 6, 3, 1.5)
  for (const [c, len] of [[[-9, -50.5], 22], [[-9.5, -56.5], 26], [[-8.5, -62.5], 22], [[-8, -68.5], 12]] as [XY, number][]) {
    const u: XY = [Math.cos(0.26), Math.sin(0.26)] // the rows run a little north of east
    const v: XY = [-u[1], u[0]]
    const depth = 5, h = 3.6
    const P = (s: number, d: number, z: number): V3 => [c[0] + u[0] * s + v[0] * d, c[1] + u[1] * s + v[1] * d, z]
    const s0 = -len / 2, s1 = len / 2
    // glazed north face, sloping roof to the south, the two ends
    glass.quad(P(s1, depth / 2, 6), P(s0, depth / 2, 6), P(s0, depth / 2, 6 + h), P(s1, depth / 2, 6 + h))
    roof.quad(P(s0, -depth / 2, 6), P(s1, -depth / 2, 6), P(s1, depth / 2, 6 + h), P(s0, depth / 2, 6 + h))
    stone.tri(P(s0, -depth / 2, 6), P(s0, depth / 2, 6 + h), P(s0, depth / 2, 6))
    stone.tri(P(s1, -depth / 2, 6), P(s1, depth / 2, 6), P(s1, depth / 2, 6 + h))
  }
}
// Small pieces at the rotunda's foot (OSM 1410028575, 1410028576).
block([[-0.4, -15.8], [-2.0, -12.0], [-2.4, -8.8], [1.3, -7.5], [3.2, -10.8]], 0, 10)
block([[0.5, -3.3], [-2.1, -2.3], [-0.9, 1.1], [0.4, 3.9], [1.3, 5.0], [2.5, 3.9], [0.7, -0.4]], 0, 17.5)

// ------------------------------------------------------------- rotunda
{
  const C: XY = [12.65, -0.55], R = 11.8, N = 24
  const dir: XY = [1, 0] // the top rises to the east, its blade there (g3)
  const zTop = (p: XY) => 32.5 + 3.5 * (((p[0] - C[0]) * dir[0] + (p[1] - C[1]) * dir[1]) / R)
  const ring: XY[] = Array.from({ length: N }, (_, i) => [C[0] + R * Math.cos((i / N) * 2 * Math.PI), C[1] + R * Math.sin((i / N) * 2 * Math.PI)])
  for (let i = 0; i < N; i++) {
    const a = ring[i], b = ring[(i + 1) % N]
    const na: V3 = [(a[0] - C[0]) / R, (a[1] - C[1]) / R, 0], nb: V3 = [(b[0] - C[0]) / R, (b[1] - C[1]) / R, 0]
    stone.tri([...a, 0], [...b, 0], [...b, zTop(b)], undefined, undefined, undefined, [na, nb, nb])
    stone.tri([...a, 0], [...b, zTop(b)], [...a, zTop(a)], undefined, undefined, undefined, [na, nb, na])
  }
  // The sloping roof: a sandstone ring round a round skylight.
  const r2 = 6.0
  const inner: XY[] = ring.map(([x, y]) => [C[0] + (x - C[0]) * (r2 / R), C[1] + (y - C[1]) * (r2 / R)])
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    roof.quad([...inner[i], zTop(inner[i]) - 0.4], [...ring[i], zTop(ring[i])], [...ring[j], zTop(ring[j])], [...inner[j], zTop(inner[j]) - 0.4])
  }
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    glass.tri([...C, zTop(C) - 0.4], [...inner[i], zTop(inner[i]) - 0.4], [...inner[j], zTop(inner[j]) - 0.4])
  }
  // The tilted beam across the skylight, along the walkway's line (NAIP),
  // rising from the north-east side to the south-west (g3).
  {
    const a: V3 = [C[0] + 6, C[1] + 6, 34.5]
    const b: V3 = [C[0] - 7.5, C[1] - 7.5, 43]
    const w = 0.7
    const ax: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
    const side: V3 = [Math.SQRT1_2 * w, -Math.SQRT1_2 * w, 0]
    const L = Math.hypot(ax[0], ax[1], ax[2])
    const upv: V3 = [-(ax[0] * ax[2]) / L / L * w * 1.4, -(ax[1] * ax[2]) / L / L * w * 1.4, ((ax[0] ** 2 + ax[1] ** 2) / L / L) * w * 1.4]
    const sec = (p: V3): V3[] => [
      [p[0] - side[0] - upv[0], p[1] - side[1] - upv[1], p[2] - upv[2]],
      [p[0] + side[0] - upv[0], p[1] + side[1] - upv[1], p[2] - upv[2]],
      [p[0] + side[0] + upv[0], p[1] + side[1] + upv[1], p[2] + upv[2]],
      [p[0] - side[0] + upv[0], p[1] - side[1] + upv[1], p[2] + upv[2]],
    ]
    stone.sweep([sec(a), sec(b)])
    const e = sec(b)
    stone.quad(e[0], e[1], e[2], e[3])
    stone.quad(e[3], e[2], e[1], e[0])
  }
  // The blade standing on the high east rim.
  {
    const u: XY = [0, 1] // along the rim there
    const m: XY = [C[0] + dir[0] * (R - 1.2), C[1] + dir[1] * (R - 1.2)]
    const ring: XY[] = [[-4, -0.8], [4, -0.8], [4, 0.8], [-4, 0.8]].map(([s, t]) => [m[0] + u[0] * s + dir[0] * t, m[1] + u[1] * s + dir[1] * t])
    block(ring, 30, 40.5, stone)
  }
  // The tall glazed slot on the amphitheatre side, and small punched windows.
  for (const deg of [200, 215]) {
    const a = (deg * Math.PI) / 180, a2 = ((deg + 8) * Math.PI) / 180
    const P = (t: number, z: number): V3 => [C[0] + (R + 0.06) * Math.cos(t), C[1] + (R + 0.06) * Math.sin(t), z]
    win.quad(P(a, 4.5), P(a2, 4.5), P(a2, 15), P(a, 15))
  }
  for (const deg of [140, 165, 240, 265, 290, 315]) {
    const a = (deg * Math.PI) / 180, a2 = ((deg + 4) * Math.PI) / 180
    const P = (t: number, z: number): V3 => [C[0] + (R + 0.06) * Math.cos(t), C[1] + (R + 0.06) * Math.sin(t), z]
    for (const z of [17, 22]) win.quad(P(a, z), P(a2, z), P(a2, z + 1.6), P(a, z + 1.6))
  }
}

// ------------------------------------------------------------- pyramid
{
  const { c, corners, h } = PYRAMID
  const apex: V3 = [c[0], c[1], h]
  const k = ccw(corners)
  for (let i = 0; i < 4; i++) {
    const a = k[i], b = k[(i + 1) % 4]
    stone.tri([...a, 0], [...b, 0], apex)
    // a glazed band of skylight slots across each face, two-thirds of the way up
    const at = (p: XY, f: number): V3 => [p[0] + (c[0] - p[0]) * f, p[1] + (c[1] - p[1]) * f, h * f + 0.05]
    const m0 = 0.55, m1 = 0.66, e0 = 0.3, e1 = 0.7
    const lerp2 = (p: V3, q: V3, t: number): V3 => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t]
    const A0 = at(a, m0), B0 = at(b, m0), A1 = at(a, m1), B1 = at(b, m1)
    win.quad(lerp2(A0, B0, e0), lerp2(A0, B0, e1), lerp2(A1, B1, e1), lerp2(A1, B1, e0))
    // the dark cap of louvres at the apex
    win.tri(at(a, 0.88), at(b, 0.88), [apex[0], apex[1], apex[2] + 0.05])
  }
}

// ------------------------------------------------------------- arcades
/** A shade roof on columns: a slab from 4.2 to 5 m, columns down both edges. */
function arcade(poly: XY[], every = 7) {
  block(poly, 4.2, 5.0, roof, true)
  // the long edges: the ring's two halves
  const n = poly.length, half = Math.floor(n / 2)
  for (const run of [poly.slice(0, half), poly.slice(half)]) {
    let acc = 0
    for (let i = 0; i < run.length - 1; i++) {
      const a = run[i], b = run[i + 1]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      acc += L
      if (acc >= every) {
        acc = 0
        const c: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
        // pull the column 0.8 m inside the slab, toward the ring's middle
        const m = poly.reduce((s, p) => [s[0] + p[0] / n, s[1] + p[1] / n], [0, 0])
        const d = Math.hypot(m[0] - c[0], m[1] - c[1])
        column([c[0] + ((m[0] - c[0]) / d) * 0.8, c[1] + ((m[1] - c[1]) / d) * 0.8], 0.45, 0, 4.2)
      }
    }
  }
}
for (const a of ARCADES) arcade(a)
arcade(WALK_ARCADE, 8)

// --------------------------------------------------------------- helpers
function rectAt(c: XY, w: number, d: number, deg: number): XY[] {
  const a = (deg * Math.PI) / 180, u: XY = [Math.cos(a), Math.sin(a)], v: XY = [-u[1], u[0]]
  return ([[-1, -1], [1, -1], [1, 1], [-1, 1]] as XY[]).map(([s, t]) => [c[0] + u[0] * s * w / 2 + v[0] * t * d / 2, c[1] + u[1] * s * w / 2 + v[1] * t * d / 2])
}

const parts = [
  { part: stone, material: finish('sandstone', 0xcf9a82) },
  { part: roof, material: finish('sandstone-roof', 0xb98f80) },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
]
if (import.meta.main) {
  await save('lv-clark-county-government-center', 'Clark County Government Center', parts, 43.8, 'Y up, -Z north, +X east, metres, origin at ground', 6500)
}
