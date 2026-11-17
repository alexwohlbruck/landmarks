/**
 * Giant Dipper, Belmont Park, Mission Beach, San Diego: procedural, CC0-1.0.
 * bun generators/sd-giant-dipper.ts   (REPORT=1 for the element table and energy check)
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The park frame's
 * origin is the placement anchor, lon -117.25160, lat 32.77125 (`origin`),
 * and the model's origin is that point too (anchor [0, 0]), at the lowest
 * ground under the track. Built with ./coaster-kit.ts and its wooden
 * trestle, as carowinds-hurler.ts and dal-new-texas-giant.ts are.
 *
 * The ride: a 1925 Prior & Church wooden "twister" / double out-and-back,
 * rebuilt 1990 (National Historic Landmark; ACE Coaster Landmark).
 * Published: RCDB 203 (2,600 ft = 792 m, 73 ft = 22.3 m, 55 mph),
 * Coasterpedia (73 ft, 60 ft drop, 1:45, "Bordeaux track with white
 * supports"; elements: chain lift, tunnel, twisted hill, twisted hill,
 * hills), Wikipedia "Giant Dipper (Belmont Park)" (75 ft, 60 ft drop, max
 * 40° at the bottom of the first drop, 2,800 ft, 48 mph).
 *
 * Plan: the five OSM `roller_coaster=track` ways, chained in ride order
 * (way/1272436473 tunnel, way/1272436474, way/1272436475, way/1272436476,
 * way/1272436477 culvert), 742 m in plan from the station; the station
 * building is way/1272436478. Laid over USGS NAIP (public domain): the
 * trace sits on the structure everywhere, including the two concentric
 * turnarounds at each end. The ways aren't oneway; the direction is taken
 * from the ride order (station, the dark tunnel loop at the north, the long
 * straight lift south along the middle) and from the lidar, which puts the
 * highest structure (23-26 m with railings) on that straight at its south
 * end, y -50 to -57.
 *
 * Profile, polyline s (m) and heights above the ground:
 *   tunnel loop, north of the station       s 8-62, low
 *   lift (straight, south)                  s 74-132, crest 22.3 m (published)
 *   first drop, turning right round the     s 140-185, foot 2 m (60 ft drop,
 *     south inner turnaround                  published)
 *   hill north along the west side          s 210, 16 m (lidar 17-19 incl. rail)
 *   north inner turnaround, twisted hill    s 298, 14.5 m (lidar 13-16)
 *   hills down the middle                   s 352, 405: 11 m, 10 m (lidar 12)
 *   south outer turnaround, twisted hill    s 458, 11 m (lidar 11-12)
 *   hills north along the east side         s 520, 570
 *   north outer turnaround                  s 612, 7 m (the low fan in the
 *                                             NE-corner photo)
 *   last hill, turn round the station, brakes from s 690
 * Lidar: USGS 3DEP CA_SanDiegoQL2_2014 (flown 2014), 1 m grid; sparse on the
 * open lattice, so it gave the crest and the rough height of each stretch,
 * not the hill shapes. Hill heights other than the lift and the drop are
 * estimated from the lidar and the energy left, and checked against the
 * photos below.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *   "Giant Dipper Roller Coaster-10.jpg", Visitor7, CC BY-SA 3.0 (from the
 *     Mission Blvd / W Mission Bay Dr corner, the north fans)
 *     https://commons.wikimedia.org/wiki/File:Giant_Dipper_Roller_Coaster-10.jpg
 *   "Giant Dipper Roller Coaster-7.jpg", Visitor7, CC BY-SA 3.0 (east side)
 *     https://commons.wikimedia.org/wiki/File:Giant_Dipper_Roller_Coaster-7.jpg
 *   "Giant Dipper Roller Coaster.jpg", Visitor7, CC BY-SA 3.0 (night lights)
 *     https://commons.wikimedia.org/wiki/File:Giant_Dipper_Roller_Coaster.jpg
 *   "Giant Dipper Roller Coaster-2.jpg", Visitor7, CC BY-SA 3.0 (night lights)
 *     https://commons.wikimedia.org/wiki/File:Giant_Dipper_Roller_Coaster-2.jpg
 *   "MissionBayByPhilKonstantin.jpg", Phil Konstantin, CC BY-SA 3.0 (aerial
 *     from the west: the whole ride, tall south end, lower north end)
 *     https://commons.wikimedia.org/wiki/File:MissionBayByPhilKonstantin.jpg
 *   "MissionBeachRollercoaster 640pixels.JPG", Greg Bulla, public domain (night)
 *     https://commons.wikimedia.org/wiki/File:MissionBeachRollercoaster_640pixels.JPG
 *   "Mission Beach Roller Coaster 002.JPG", Bignoisybird, CC BY-SA 3.0 (colours)
 *     https://commons.wikimedia.org/wiki/File:Mission_Beach_Roller_Coaster_002.JPG
 *
 * Style (reworked after review): the white lattice is the dominant mass. The
 * track is narrow (2.3 m), its deck pale, nearly white, with the red fascia
 * as a 0.55 m band along each side, so the red reads as lines over white as
 * in the photos. The lattice is drawn here, not by the kit (see lattice()):
 * a bent every 2.7 m, ledgers every 3.2 m of height, alternating diagonal
 * braces, and cross ties between neighbouring tracks. The station is the
 * OSM building as a low white shed with a red roof (pulled light: the
 * real roofs are red-and-white striped), 4.5 m to the roof
 * (estimated from the station photos, Giant Dipper Roller Coaster-3/-4/-5).
 * Night: the strings of bulbs that outline the structure along the top of
 * the track are `lamp-dipper` beads, one every 10 m on the outside of each
 * curve, and the white timber is floodlit.
 *
 * The lattice stands on the ground at y = 0, as the Cyclone's trestle does
 * (the kit's own trestle, which sinks 1 m, is not used), so the lowest
 * vertex is y = 0. Terrain check: ok.
 *
 * Doubts: the ride direction rests on the ride order and the lidar crest,
 * not on a oneway tag. Heights of the later hills are estimates. The tunnel
 * shed over the first loop is drawn as the kit's cover; no photo shows it
 * clearly from outside. The catwalks, handrails and the lift's chain are left
 * out (too thin).
 */
import { buildCoaster, type CoasterKit } from './coaster-kit'
import { Part, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'

// The OSM circuit, node by node, metres east/north of the origin, from the
// station (first node of way/1272436473) in the direction of travel.
const CHAIN: [number, number][] = [
  [-7.7, 6.1], [-3.3, 12.0], [0.7, 13.6], [4.7, 18.1], [7.4, 22.8], [8.3, 26.3], [8.9, 29.4], [8.1, 32.5], [7.4, 33.7], [4.5, 35.5],
  [1.4, 34.7], [-1.2, 33.1], [-3.1, 30.6], [-3.2, 28.4], [-3.1, 26.3], [-2.7, 20.1], [-2.4, 13.5], [0.4, -63.3], [-0.4, -67.9],
  [-3.2, -71.0], [-6.6, -71.6], [-11.1, -71.1], [-14.4, -68.4], [-15.6, -64.1], [-16.1, -58.8], [-12.3, -49.6], [-8.1, -43.6],
  [-5.2, -37.9], [-3.6, -32.2], [-3.6, -25.3], [-3.9, -14.3], [-4.4, -4.7], [-4.5, 2.0], [-3.1, 7.2], [3.7, 19.6], [11.6, 35.5],
  [18.1, 46.6], [19.4, 53.2], [18.5, 59.8], [16.8, 62.4], [13.9, 64.3], [8.5, 65.1], [4.8, 63.6], [1.4, 59.4], [0.6, 54.5],
  [1.6, 48.9], [4.7, 42.2], [5.9, 36.7], [6.3, 31.7], [2.8, 21.6], [-1.6, 14.3], [-3.6, 10.4], [-5.8, 3.6], [-6.9, -5.1],
  [-6.7, -15.7], [-5.7, -28.0], [-5.9, -33.4], [-9.2, -40.7], [-14.1, -49.3], [-16.8, -56.0], [-18.1, -61.0], [-17.7, -67.1],
  [-15.8, -69.8], [-14.2, -72.1], [-11.3, -73.4], [-9.0, -74.3], [-6.1, -74.2], [-2.3, -72.6], [0.8, -69.1], [2.8, -64.8],
  [2.8, -59.7], [2.4, -45.9], [1.7, -35.6], [1.4, -26.3], [0.9, -15.5], [0.5, -7.6], [0.5, 2.3], [1.4, 8.7], [3.7, 14.4],
  [7.4, 21.3], [10.7, 28.0], [16.7, 38.3], [20.2, 45.6], [21.7, 50.6], [22.3, 55.6], [21.6, 59.8], [19.7, 63.2], [18.1, 64.9],
  [15.7, 67.2], [10.9, 68.0], [6.7, 67.2], [1.6, 64.2], [-1.0, 61.1], [-2.2, 56.8], [-1.5, 52.5], [-1.2, 50.4], [0.0, 47.2],
  [1.0, 43.3], [2.8, 39.0], [3.3, 35.9], [3.2, 32.5], [1.1, 27.6], [-1.0, 23.8], [-4.7, 18.9], [-19.6, 2.6], [-21.5, 0.1],
  [-22.4, -2.2], [-21.9, -4.7], [-19.0, -7.2], [-14.9, -8.2], [-13.0, -7.5], [-10.1, -5.8], [-8.9, -2.9], [-8.4, 0.9], [-8.6, 4.4],
]
// The station building (way/1272436478).
const STATION: [number, number][] = [
  [-11.0, 21.5], [-4.0, 15.1], [-9.2, 9.3], [-8.0, 8.2], [-10.7, 5.2], [-11.9, 5.8], [-19.9, -2.5], [-23.4, -3.1], [-27.1, -0.1], [-26.3, 4.9],
]
// Terrain (Mapterhorn, tools/terrain.ts): the lot is flat beach fill, within
// about a metre under the whole ride, so the ground is taken as level.
const GROUND = Array.from({ length: 4 }, () => [0, 0, 0, 0])

const STATION_ROOF = 4.5
const WHITE: MaterialSpec = {
  name: 'dipper-white', color: 0xf6f4ef, roughness: 0.85, doubleSided: true,
  floodlight: (_p, n) => (Math.abs(n[2]) > 0.7 ? 0.2 : 0.75),
}
const LAMP = finish('lamp-dipper', 0xf3e6c4)
const STEP_BULB = 10

/**
 * The white timber lattice, drawn as coney-island-cyclone.ts draws its
 * trestle but denser, as the Dipper's photos show: a bent every 3 m of track
 * (wooden coasters stand on bents 2.5-3 m apart; 2.7 m here), horizontal ledgers every
 * 3.2 m of height running continuously from bent to bent, and a diagonal
 * brace in every bay between two ledgers, alternating in direction from bay
 * to bay so the bracing reads as the zigzag/X pattern of the real structure.
 * Each member is a flat board in a double-sided material, seen from both
 * sides of the track, which is how the walls are seen; that keeps the dense
 * lattice inside the file budget. At night the white timber is floodlit, as
 * the night photos show (`_FLOODLIGHT`, stronger on the lower structure). Bents stand on the ground (y = 0, as the
 * Cyclone's do) or on a lower stretch of track passing underneath.
 */
const BENT = 2.7, LEVEL = 3.2, POST_W = 0.75, LEDGER_H = 0.65, BRACE_W = 0.45
const LATTICE = new Part()
function lattice(kit: CoasterKit, length: number) {
  const p = LATTICE
  const D = kit.track.DEPTH
  // Dense centreline for "what is under me".
  const probe: { s: number; x: number; y: number; z: number }[] = []
  for (let s = 0; s < length; s += 1) { const q = kit.at(s); probe.push({ s, x: q.p[0], y: q.p[1], z: q.p[2] }) }
  type B = { x: number; y: number; n: [number, number]; t: [number, number]; top: number; floor: number }
  const bents: B[] = []
  for (let s = 0; s < length; s += BENT) {
    const q = kit.at(s)
    const ln = Math.hypot(q.left[0], q.left[1]) || 1, n: [number, number] = [q.left[0] / ln, q.left[1] / ln]
    const tl = Math.hypot(q.t[0], q.t[1]) || 1, t: [number, number] = [q.t[0] / tl, q.t[1] / tl]
    // The deck's underside where it is lowest across a banked track.
    const top = q.p[2] - D - Math.abs(q.left[2]) * kit.track.W / 2 + 0.1
    let floor = kit.ground(q.p[0], q.p[1])
    for (const o of probe) {
      const ds = Math.abs(o.s - s)
      if (Math.min(ds, length - ds) < 10 || o.z > top - 1.5) continue
      if (Math.hypot(o.x - q.p[0], o.y - q.p[1]) < kit.track.W * 0.7) floor = Math.max(floor, o.z)
    }
    bents.push({ x: q.p[0], y: q.p[1], n, t, top, floor })
  }
  /** A flat board in the wall plane through (x, y) with normal n: corners as [along, z] pairs from a and b. */
  const board = (n: [number, number], q: V3[]) => {
    // One face: the material is double-sided, so it shows from both sides.
    const N: V3 = [n[0], n[1], 0]
    p.tri(q[0], q[1], q[2], undefined, undefined, undefined, [N, N, N])
    p.tri(q[0], q[2], q[3], undefined, undefined, undefined, [N, N, N])
  }
  let tris = 0
  for (const b of bents) {
    if (b.top - b.floor < 0.6) continue
    const h = POST_W / 2
    board(b.n, [[b.x - b.t[0] * h, b.y - b.t[1] * h, b.floor], [b.x + b.t[0] * h, b.y + b.t[1] * h, b.floor], [b.x + b.t[0] * h, b.y + b.t[1] * h, b.top], [b.x - b.t[0] * h, b.y - b.t[1] * h, b.top]])
    tris += 2
  }
  for (let k = 0; k < bents.length; k++) {
    const a = bents[k], b = bents[(k + 1) % bents.length]
    if (Math.hypot(b.x - a.x, b.y - a.y) > BENT * 1.6) continue
    const n: [number, number] = [(a.n[0] + b.n[0]) / 2, (a.n[1] + b.n[1]) / 2]
    const lo = Math.max(a.floor, b.floor), hi = Math.min(a.top, b.top)
    const levels: number[] = []
    for (let z = Math.ceil((lo + 1.2) / LEVEL) * LEVEL; z < hi - 0.9; z += LEVEL) levels.push(z)
    // Ledgers.
    for (const z of levels) {
      board(n, [[a.x, a.y, z - LEDGER_H / 2], [b.x, b.y, z - LEDGER_H / 2], [b.x, b.y, z + LEDGER_H / 2], [a.x, a.y, z + LEDGER_H / 2]])
      tris += 2
    }
    // Braces in the bays between the floor, the ledgers and the deck.
    const marks = [lo + 0.2, ...levels, hi - 0.2]
    for (let i = 0; i + 1 < marks.length; i++) {
      const z0 = marks[i], z1 = marks[i + 1]
      if (z1 - z0 < 1.6) continue
      const up = (k + i) % 2 === 0
      const A: V3 = [a.x, a.y, up ? z0 : z1], Bv: V3 = [b.x, b.y, up ? z1 : z0]
      // Offset perpendicular to the brace, in the wall plane.
      const dx = Bv[0] - A[0], dy = Bv[1] - A[1], dz = Bv[2] - A[2], L = Math.hypot(dx, dy, dz) || 1
      const hor = Math.hypot(dx, dy) || 1
      const w = BRACE_W / 2, ox = (-dz / L) * (dx / hor) * w, oy = (-dz / L) * (dy / hor) * w, oz = (hor / L) * w
      board(n, [[A[0] - ox, A[1] - oy, A[2] - oz], [Bv[0] - ox, Bv[1] - oy, Bv[2] - oz], [Bv[0] + ox, Bv[1] + oy, Bv[2] + oz], [A[0] + ox, A[1] + oy, A[2] + oz]])
      tris += 2
    }
  }
  // Cross ties: neighbouring stretches of track (side by side on the
  // straights, concentric in the fans) are one structure, tied across by
  // ledgers at the same levels, so the fans read filled as in the photos.
  const done = new Set<string>()
  for (let k = 0; k < bents.length; k += 2) {
    const a = bents[k]
    let best = -1, bd = Infinity
    for (let j = 0; j < bents.length; j++) {
      const dk = Math.abs(j - k), dist = Math.min(dk, bents.length - dk) * BENT
      if (dist < 30) continue
      const d = Math.hypot(bents[j].x - a.x, bents[j].y - a.y)
      if (d > 2.4 && d < 8 && d < bd) { bd = d; best = j }
    }
    if (best < 0) continue
    const key = `${Math.min(k, best) >> 1}-${Math.max(k, best) >> 1}`
    if (done.has(key)) continue
    done.add(key)
    const b = bents[best], dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy)
    const n: [number, number] = [-dy / l, dx / l]
    const lo = Math.max(a.floor, b.floor), hi = Math.min(a.top, b.top)
    for (let z = Math.ceil((lo + 1.2) / LEVEL) * LEVEL; z < hi - 0.9; z += LEVEL) {
      board(n, [[a.x, a.y, z - LEDGER_H / 2], [b.x, b.y, z - LEDGER_H / 2], [b.x, b.y, z + LEDGER_H / 2], [a.x, a.y, z + LEDGER_H / 2]])
      tris += 2
    }
  }
  console.log(`lattice: ${tris} triangles`)
}

/**
 * The station's walls: the kit draws its roof slab at roofZ; these are the
 * white walls under it, down to the ground, in the kit's station material.
 */
function stationWalls(kit: CoasterKit, ring: [number, number][], roofZ: number) {
  const p = kit.parts.stone
  const pts = ring.map((q) => kit.toModel(q))
  let area = 0
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; area += a[0] * b[1] - b[0] * a[1] }
  const r = area > 0 ? pts : [...pts].reverse()
  const z1 = roofZ - 0.9
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const N: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
    const l = Math.hypot(N[0], N[1]) || 1
    const nn: V3 = [N[0] / l, N[1] / l, 0]
    p.tri([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], z1], undefined, undefined, undefined, [nn, nn, nn])
    p.tri([a[0], a[1], 0], [b[0], b[1], z1], [a[0], a[1], z1], undefined, undefined, undefined, [nn, nn, nn])
  }
}

/** Bulb strings: a bead every 6 m along the top of the track, on the outside of each curve. */
function bulbs(kit: CoasterKit, length: number) {
  const p = new Part()
  const r = 0.3
  const W = kit.track.W
  for (let s = 3, k = 0; s < length; s += STEP_BULB, k++) {
    const q = kit.at(s), a = kit.at(s - 3), b = kit.at(s + 3)
    const turn = a.t[0] * b.t[1] - a.t[1] * b.t[0] // > 0 turning left
    const side = Math.abs(turn) > 0.02 ? (turn > 0 ? -1 : 1) : k % 2 ? 1 : -1
    const c: V3 = [q.p[0] + q.left[0] * side * (W / 2 + 0.15), q.p[1] + q.left[1] * side * (W / 2 + 0.15), q.p[2] + 1.0]
    // A tetrahedron: the smallest solid bead.
    const v: V3[] = [[r, r, r], [r, -r, -r], [-r, r, -r], [-r, -r, r]].map((d) => [c[0] + d[0], c[1] + d[1], c[2] + d[2]] as V3)
    const tris = [[0, 1, 2], [0, 3, 1], [0, 2, 3], [1, 3, 2]]
    for (const [i, j, l] of tris) {
      // Outward normal: from the bead's centre through the face's centre.
      const m: V3 = [0, 1, 2].map((k) => (v[i][k] + v[j][k] + v[l][k]) / 3 - c[k]) as V3
      p.tri(v[i], v[j], v[l], undefined, undefined, undefined, [m, m, m])
    }
  }
  return p
}

await buildCoaster({
  name: 'Giant Dipper',
  out: '../models/sd-giant-dipper.glb',
  origin: [-117.2516, 32.77125],
  chain: CHAIN,
  anchor: [0, 0],
  ground: { x0: -100, y0: -100, step: 100, rows: GROUND, base: 1.6 },
  // Heights above the ground; s along the OSM polyline (742 m round).
  profile: [
    { name: 'station', s: 0, z: 1.5 },
    { name: 'tunnel loop', s: 40, z: 1.3 },
    { name: 'foot of the lift', s: 72, z: 1.6, r: 18 },
    { name: 'lift crest (73 ft)', s: 132, z: 22.3, r: 14 },
    { name: 'turn on top', s: 146, z: 20.5, r: 16, pitch: 40 },
    { name: 'first drop, foot (60 ft)', s: 183, z: 2, r: 22 },
    { name: 'hill, west side', s: 210, z: 16 },
    { name: 'valley', s: 240, z: 4 },
    { name: 'hop', s: 256, z: 7.5 },
    { name: 'valley', s: 274, z: 3 },
    { name: 'north inner turnaround', s: 298, z: 14.5 },
    { name: 'valley', s: 328, z: 3.5 },
    { name: 'hill', s: 352, z: 12 },
    { name: 'valley', s: 380, z: 3 },
    { name: 'hill', s: 405, z: 11 },
    { name: 'valley', s: 428, z: 3 },
    { name: 'south outer turnaround', s: 458, z: 11 },
    { name: 'valley', s: 495, z: 3 },
    { name: 'hill, east side', s: 520, z: 8.5 },
    { name: 'valley', s: 545, z: 3 },
    { name: 'hill', s: 568, z: 6 },
    { name: 'valley', s: 586, z: 2.5 },
    { name: 'north outer turnaround', s: 612, z: 7 },
    { name: 'valley', s: 642, z: 2.5 },
    { name: 'last hill', s: 662, z: 5 },
    { name: 'brakes', s: 690, z: 1.8, r: 16 },
  ],
  lift: [72, 132],
  brakes: [{ from: 690, to: 72, z: 1.6, head: 0.5 }],
  losses: [0.012, 0.0005],
  // A narrower track than the kit's default: the red reads as the rails and
  // ledger band over the white lattice, not a broad ribbon.
  track: { W: 2.3, RAIL: 0.15, DEPTH: 0.7, SPINE: 2.0 },
  station: { ring: STATION, posts: [], roofZ: STATION_ROOF },
  // No kit supports: the lattice above replaces them.
  supportEvery: 1e6,
  supportMinZ: 1e6,
  // Colours from the daylight photos, pulled to the palette's lightness:
  // the running deck and catwalks pale, nearly white (they read pale from above in the
  // aerial), the red fascia along both sides of the track, the white timber;
  // the station's white walls and red roof.
  colours: {
    deck: ['dipper-deck', 0xe3ddd3], spine: ['dipper-red', 0xbd544b], supports: ['dipper-support', 0xf6f4ef],
    station: ['dipper-station', 0xf1ece4], stationRoof: ['dipper-roof', 0xcf8a80],
  },
  supportR: [0.5, 0.6, 0.7],
  meta: { height: 22.3, trackLength: 792 },
  extras: (kit) => (lattice(kit, 742), stationWalls(kit, STATION, STATION_ROOF), [{ part: LATTICE, material: WHITE }, { part: bulbs(kit, 742), material: LAMP }]),
  sampleDeg: 12,
})
