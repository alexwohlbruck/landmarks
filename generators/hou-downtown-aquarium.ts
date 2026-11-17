/**
 * Downtown Aquarium, 410 Bagby Street, Houston (Landry's, opened 2003 on
 * the site of Fire Station No. 1 and the Central Waterworks): the main
 * aquarium building and its Ferris wheel, the Diving Bell wheel, which is
 * what the site is known by from the freeways and from above.
 * Procedural, CC0-1.0, no textures. bun generators/hou-downtown-aquarium.ts
 *
 * OSM maps the two apart: the building as way/378253051 (tourism=aquarium,
 * building=civic) and the wheel as its own small building, way/383573689
 * ("Diving Ball Farris Wheel"), 75 m to the south-west, inside the theme
 * park (way/383573690, not a building). The model holds both; it replaces
 * both outlines. The carousel, the drop tower, the train depot and the
 * kiosks stay the map's.
 *
 * Frame: x, y in the building's own axes (turned to bearing 34.5, the
 * outline's long edges), z up, metres; glTF +Y up. The anchor is the area
 * centroid of way/378253051, -95.3674077 29.7642737. The wheel's plane runs
 * along bearing 99.8 (the OSM wheel outline's long side, and NAIP), 65.3
 * degrees round from the building's axis, so the wheel is authored in its
 * own basis (u along the plane, n along the axle).
 *
 * Ground: y = 0 is the lowest ground under the model, at the wheel (the
 * site falls about 2.4 m from the building to the wheel, toward the bayou;
 * lidar ground 9.2 m at the wheel, 11.6 m round the building). Each part
 * is built up from its own ground at y = 0 and the map's drape lifts the
 * building onto its higher ground. Elevation 0.
 *
 * The wheel. Measured, USGS 3DEP lidar TX_Coastal_B1_2018 (2018 flight),
 * 0.5 m grid in the wheel's plane: the top 26.7 m above its ground, the
 * circle 25-26 m across, centred 1.5 m east of the OSM outline's centroid
 * along the plane. So the rim is 12.8 m in radius on an axle 13.8 m up. The
 * aquarium and travel sites call it a 100 ft wheel; the lidar's 26.7 m is
 * used (the 100 ft is likely a rounded marketing figure).
 * Estimated from p5 (face on, from Bagby Street): 18 gondolas, blue cabins
 * with white roofs hanging inside the rim between its two faces; white
 * spokes, drawn as 18 bold spokes per face (the real wheel has many thin
 * tangential ones, a texture at map scale); a blue hub disc; the two blue
 * A-frames, their feet about 8 m either side along the plane and 2.3 m out
 * from it (OSM outline 24.6 by 4.6 m).
 * It turns (STYLE "Moving rides"): the wheel is a node at the axle and each
 * gondola a child node turned back so it hangs plumb, 90 s a turn (the real
 * wheel is slower; livelier to read on a map). Frame 0 is the static model.
 * Night: the spokes and rim carry LED strips (p6, p7: blue and green
 * spokes, a lit rim). The steel is white by day (p5, #e8eef2), so it is not
 * `neon` (which would glow white, or read blue by day); the lights are
 * `lamp-aquarium-wheel` beads, one on every spoke and 18 round each rim,
 * which Parchment draws as lit points at night and leaves out by day.
 * Doubt: the map lights lamps warm white; the real LEDs show blue and
 * green, which no material name here can carry.
 *
 * The building. Measured, the same lidar at 1 m, read in this frame, above
 * the ground round it: the main roof 21.1 m, its wavy parapet crests up to
 * 24.4 m (26.6 m at the south end's crest, read as 24.4 + the sign's
 * frame); the lower facade with its curved bays 18.3 m; the west terrace
 * wing and the north wing about 5.2 m. Plan: the OSM outline, which the
 * lidar matches within a metre.
 * From the photos (p3): grey stucco with a heavy cornice at the top of the
 * lower facade, a row of round blue porthole windows under it, the upper
 * walls set back and finished in a wavy parapet like a breaking wave, two
 * blue "AQUARIUM" signs on the crests of the street front, a glazed ground
 * floor under a canopy band. The signs are plain neon boxes (they are not
 * the landmark; STYLE "Famous signs"). Colours sampled from p3 (stucco
 * #b9bcbe to #bebebe in sun, lifted to the palette's lightness; the signs
 * #3a70a2 to #5195c2) and p5 (cabins #4d92c6, legs #6496be).
 *
 * Photos (Wikimedia Commons), compared against the renders:
 * - p3 "Houston, Downtown Aquarium 2012.JPG", Another Believer, CC BY-SA
 *   3.0: the building from Bagby Street;
 * - p5 "Houston, Downtown Aquarium, ferris wheel.JPG", Another Believer,
 *   CC BY-SA 3.0: the wheel face on;
 * - p6, p7 "Dusk shot of Houston, taken from the Downtown Aquarium..."
 *   (LCCN2014632547, LCCN2014632548), Carol M. Highsmith, public domain:
 *   the wheel lit at dusk, its A-frame legs;
 * - p1 "Downtown Houston Aquarium in 2012.jpg", Katie Haugland Bowen, CC
 *   BY 2.0, p2 "Downtown Houston from Downtown Aquarium 2.JPG", Agsftw, CC
 *   BY-SA 3.0: the plaza (no building faces shown well).
 * NAIP 2022 (USGS, public domain): the plan, the pale grey roof, the
 * wheel's thin shadow and line on bearing 100.
 *
 * Left out: the old fire station and waterworks inside the complex (not
 * separable in the OSM outline or the photos), the canopies, the lettering,
 * the rides and kiosks of the park, the shark-voyage train.
 * Doubts: only the street (east) front is photographed; the west and
 * north faces are drawn plain from the lidar, with the portholes carried
 * round as on the east. Which face p3 shows is read from the street signs
 * in it (Bagby, Memorial). The gondola count (18) is counted from p5 over
 * half the wheel.
 */
import { Part, axisAngle, cross, sub, writeGlb, type ChannelSpec, type MaterialSpec, type NodeSpec, type Quat, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A triangle whose winding follows its normals, whatever order it came in. */
function tri(p: Part, v: V3[], n: V3[]) {
  const face = cross(sub(v[1], v[0]), sub(v[2], v[0]))
  if (dot(face, add(add(n[0], n[1]), n[2])) >= 0) p.tri(v[0], v[1], v[2], undefined, undefined, undefined, n)
  else p.tri(v[0], v[2], v[1], undefined, undefined, undefined, [n[0], n[2], n[1]])
}
/** A flat quad wound to face `n`. */
function face(p: Part, q: V3[], n: V3) {
  tri(p, [q[0], q[1], q[2]], [n, n, n])
  tri(p, [q[0], q[2], q[3]], [n, n, n])
}

type Profile = [number, number][]
const rect = (a: number, b: number, c = 0): Profile => c
  ? [[-a + c, -b], [a - c, -b], [a, -b + c], [a, b - c], [a - c, b], [-a + c, b], [-a, b - c], [-a, -b + c]]
  : [[-a, -b], [a, -b], [a, b], [-a, b]]
const circle = (r: number, n: number): Profile => Array.from({ length: n }, (_, i) => [r * Math.cos(i / n * TAU), r * Math.sin(i / n * TAU)])

/** Sweep a cross-section along a path (as in wonder-wheel.ts). */
function sweep(p: Part, path: V3[], frames: { N: V3; B: V3 }[], profiles: Profile[], closed = false, caps = false) {
  const m = profiles[0].length
  const at = (i: number, k: number) => {
    const [a, b] = profiles[i][k]
    return add(path[i], add(mul(frames[i].N, a), mul(frames[i].B, b)))
  }
  const normal = (i: number, k: number) => {
    const [a, b] = profiles[i][k], [c, d] = profiles[i][(k + 1) % m]
    return unit(add(mul(frames[i].N, d - b), mul(frames[i].B, -(c - a))))
  }
  const last = closed ? path.length : path.length - 1
  for (let i = 0; i < last; i++) {
    const j = (i + 1) % path.length
    for (let k = 0; k < m; k++) {
      const l = (k + 1) % m
      const ni = normal(i, k), nj = normal(j, k)
      tri(p, [at(i, k), at(i, l), at(j, l)], [ni, ni, nj])
      tri(p, [at(i, k), at(j, l), at(j, k)], [ni, nj, nj])
    }
  }
  if (caps && !closed) {
    const n = path.length - 1
    const fan = (ring: V3[], nn: V3) => { for (let i = 1; i < ring.length - 1; i++) tri(p, [ring[0], ring[i], ring[i + 1]], [nn, nn, nn]) }
    fan(profiles[0].map((_, k) => at(0, k)), unit(sub(path[0], path[1])))
    fan(profiles[n].map((_, k) => at(n, k)), unit(sub(path[n], path[n - 1])))
  }
}
/** A straight member from a to b, tapering from section s0 to s1. */
function beam(p: Part, a: V3, b: V3, s0: Profile, s1: Profile, side: V3 = [0, 0, 1], caps = true) {
  const T = unit(sub(b, a))
  let N = cross(side, T)
  if (Math.hypot(...N) < 1e-6) N = cross([1, 0, 0], T)
  N = unit(N)
  const B = unit(cross(T, N))
  sweep(p, [a, b], [{ N, B }, { N, B }], [s0, s1], false, caps)
}

// =============================================================================
// The building
// =============================================================================
const WHITE = finish('aquarium-white', 0xe8eef2)
const stucco = new Part(), trim = new Part(), glazing = new Part(), sign = new Part()

const OUTLINE: [number, number][] = [
  [-20.0, -10.0], [-17.5, 5.2], [-14.5, 19.2], [-13.6, 23.6], [-13.7, 39.4], [-8.0, 39.3], [-8.1, 43.3], [12.3, 43.4],
  [12.9, 14.6], [17.2, 14.4], [18.7, 13.4], [20.0, 11.1], [20.3, 8.1], [19.6, 5.5], [17.7, 3.4], [19.0, 0.8], [18.8, -1.6],
  [17.9, -3.7], [16.9, -5.6], [20.0, -5.7], [20.9, -6.3], [21.7, -7.5], [22.2, -8.7], [22.1, -10.3], [20.9, -11.8],
  [19.5, -12.5], [18.3, -12.6], [18.2, -14.1], [17.4, -15.4], [18.8, -18.8], [18.7, -21.9], [17.4, -25.1], [16.3, -26.5],
  [16.6, -33.9], [15.8, -36.0], [13.8, -38.3], [9.8, -39.7], [6.6, -39.0], [5.0, -37.6], [4.5, -36.3], [1.0, -36.3],
  [-1.8, -35.9], [-3.8, -37.3], [-6.5, -37.9], [-9.0, -37.4], [-10.8, -36.2], [-12.1, -34.4], [-12.4, -33.3],
  [-16.1, -32.4], [-18.3, -31.2], [-19.7, -29.2], [-20.4, -27.6], [-20.2, -12.2],
]
/** The lower facade: the outline east of the west terrace and south of the north wing's line, closed along them. */
const LOWER: [number, number][] = [[-9.0, 28.0], [12.6, 28.0], ...OUTLINE.slice(8, 45)]

const PODIUM = 5.2 // west terrace and north wing, lidar
const FACADE = 18.3 // lower facade with its bays, lidar
const ROOF = 21.1 // main roof, lidar
const CREST = 24.4 // wavy parapet crests, lidar
const UP = { x0: -7.5, x1: 13.0, y0: -31.0, y1: 26.5 } // the set-back upper walls, lidar

const area = (P: [number, number][]) => P.reduce((s, [x, y], i) => { const [u, v] = P[(i + 1) % P.length]; return s + x * v - u * y }, 0) / 2
const ccw = (P: [number, number][]) => (area(P) < 0 ? [...P].reverse() : P)

/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
function earcut(P: [number, number][]): [number, number, number][] {
  const idx = P.map((_, i) => i), out: [number, number, number][] = []
  const crossz = (a: number[], b: number[], c: number[]) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: number[], a: number[], b: number[], c: number[]) => crossz(a, b, p) > 1e-9 && crossz(b, c, p) > 1e-9 && crossz(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i = idx[(k + idx.length - 1) % idx.length], j = idx[k], l = idx[(k + 1) % idx.length]
      if (crossz(P[i], P[j], P[l]) <= 1e-9) continue
      if (idx.some((m) => m !== i && m !== j && m !== l && inside(P[m], P[i], P[j], P[l]))) continue
      out.push([i, j, l]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** Walls round a polygon from z0 to z1, split every `seg` m so the drape can bend them. */
function walls(p: Part, P: [number, number][], z0: number, z1: number, seg = 5) {
  P = ccw(P)
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.max(1, Math.ceil(L / seg)), nn: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]
    for (let k = 0; k < n; k++) {
      const t0 = k / n, t1 = (k + 1) / n
      const A: [number, number] = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0]
      const B: [number, number] = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]
      face(p, [[A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1]], nn)
    }
  }
}
function capPoly(p: Part, P: [number, number][], z: number, up = true) {
  P = ccw(P)
  for (const [i, j, k] of earcut(P)) face(p, [[...P[i], z], [...P[j], z], [...P[k], z], [...P[k], z]] as V3[], [0, 0, up ? 1 : -1])
}
/** A polygon pushed out by d (a rough offset along each vertex's bisector). */
function grow(P: [number, number][], d: number): [number, number][] {
  P = ccw(P)
  return P.map((c, i) => {
    const a = P[(i + P.length - 1) % P.length], b = P[(i + 1) % P.length]
    const n1 = unit([c[1] - a[1], -(c[0] - a[0]), 0]), n2 = unit([b[1] - c[1], -(b[0] - c[0]), 0])
    const m = unit(add(n1, n2)), k = d / Math.max(0.5, dot(m, n1))
    return [c[0] + m[0] * k, c[1] + m[1] * k]
  })
}

// The podium: the whole outline to the terrace height.
walls(stucco, OUTLINE, 0, PODIUM)
capPoly(stucco, OUTLINE, PODIUM)
// The lower facade, its cornice, and the canopy band over the glazed ground floor.
walls(stucco, LOWER, PODIUM, FACADE - 1.2)
walls(trim, grow(LOWER, 0.5), FACADE - 1.2, FACADE)
capPoly(trim, grow(LOWER, 0.5), FACADE)
capPoly(trim, grow(LOWER, 0.5), FACADE - 1.2, false)
walls(trim, grow(LOWER, 0.35), PODIUM + 3.6, PODIUM + 4.4)
capPoly(trim, grow(LOWER, 0.35), PODIUM + 4.4)
// The upper walls and the roof.
{
  const { x0, x1, y0, y1 } = UP
  const box: [number, number][] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  walls(stucco, box, FACADE, ROOF, 6)
  capPoly(stucco, box, ROOF) // the roof reads pale grey in NAIP, like the walls
  // The wavy parapet: a 0.5 m wall round the upper walls' edge, its top
  // rising and falling like a breaking wave (p3), crests 3.3 m over the roof.
  const per = (L: number) => Math.max(1, Math.round(L / 19))
  const sides: [[number, number], [number, number]][] = [[[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]]]
  for (const [a, b] of sides) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), waves = per(L), N = waves * 6
    const dir: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0], out: V3 = [dir[1], -dir[0], 0]
    const top = (t: number) => ROOF + 0.4 + (CREST - ROOF - 0.4) * Math.pow(Math.sin(Math.PI * t * waves), 2)
    for (let k = 0; k < N; k++) {
      const t0 = k / N, t1 = (k + 1) / N
      const P = (t: number, o: number, z: number): V3 => [a[0] + dir[0] * L * t + out[0] * o, a[1] + dir[1] * L * t + out[1] * o, z]
      face(stucco, [P(t0, 0, ROOF), P(t1, 0, ROOF), P(t1, 0, top(t1)), P(t0, 0, top(t0))], out)
      face(stucco, [P(t1, -0.5, ROOF), P(t0, -0.5, ROOF), P(t0, -0.5, top(t0)), P(t1, -0.5, top(t1))], mul(out, -1))
      const up = unit(add([0, 0, 1], mul(dir, -(top(t1) - top(t0)) / (L / N))))
      face(trim, [P(t0, 0, top(t0)), P(t1, 0, top(t1)), P(t1, -0.5, top(t1)), P(t0, -0.5, top(t0))], up)
    }
  }
  // Two "AQUARIUM" signs on the street front's crests: plain blue neon boxes.
  for (const yc of [-12.0, 7.0]) {
    const x = x1 + 0.05, w = 5.5, z0 = ROOF + 0.6, z1 = CREST + 0.6, d = 0.5
    const q = (xx: number, y: number, z: number): V3 => [xx, y, z]
    face(sign, [q(x + d, yc - w, z0), q(x + d, yc + w, z0), q(x + d, yc + w, z1), q(x + d, yc - w, z1)], [1, 0, 0])
    face(sign, [q(x, yc - w, z1), q(x + d, yc - w, z1), q(x + d, yc + w, z1), q(x, yc + w, z1)], [0, 0, 1])
    face(sign, [q(x, yc - w, z0), q(x + d, yc - w, z0), q(x + d, yc - w, z1), q(x, yc - w, z1)], [0, -1, 0])
    face(sign, [q(x + d, yc + w, z0), q(x, yc + w, z0), q(x, yc + w, z1), q(x + d, yc + w, z1)], [0, 1, 0])
    face(sign, [q(x, yc + w, z0), q(x, yc - w, z0), q(x, yc - w, z1), q(x, yc + w, z1)], [-1, 0, 0])
    face(sign, [q(x, yc - w, z0), q(x, yc + w, z0), q(x + d, yc + w, z0), q(x + d, yc - w, z0)], [0, 0, -1])
  }
}

// Windows on the lower facade: portholes in a row under the cornice, and the
// glazed ground floor between piers, on every face longer than 5 m.
{
  const P = ccw(LOWER)
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 3) continue
    const dir: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0], out: V3 = [dir[1], -dir[0], 0]
    const at = (s: number, z: number, o = 0.06): V3 => [a[0] + dir[0] * s + out[0] * o, a[1] + dir[1] * s + out[1] * o, z]
    // Portholes: a large one (1.1 m) every 7.5 m, small ones (0.5 m) between (p3).
    const n = Math.max(1, Math.floor(L / 7.5))
    const holes: [number, number][] = []
    for (let k = 0; k < n; k++) {
      const c = (L * (k + 0.5)) / n
      holes.push([c, 1.1])
      if (L / n > 6) holes.push([c - 2.6, 0.45], [c + 2.6, 0.45])
    }
    for (const [s, r] of holes) {
      const zc = FACADE - 3.6, seg = r > 1 ? 10 : 6
      for (let j = 0; j < seg; j++) {
        const t0 = (j / seg) * TAU, t1 = ((j + 1) / seg) * TAU
        tri(glazing, [at(s, zc), at(s + r * Math.cos(t0), zc + r * Math.sin(t0)), at(s + r * Math.cos(t1), zc + r * Math.sin(t1))], [out, out, out])
      }
    }
    if (L < 5) continue
    // Ground floor: glass panels 0.4 to 3.4 m above the terrace, 1 m piers between.
    const m = Math.max(1, Math.round(L / 6))
    for (let k = 0; k < m; k++) {
      const s0 = (L * k) / m + 0.5, s1 = (L * (k + 1)) / m - 0.5
      face(glazing, [at(s0, PODIUM + 0.4), at(s1, PODIUM + 0.4), at(s1, PODIUM + 3.4), at(s0, PODIUM + 3.4)], out)
    }
  }
}

// =============================================================================
// The wheel
// =============================================================================
const BEARING = 34.5
const WHEEL_BEARING = 99.8
const ALONG = ((WHEEL_BEARING - BEARING) * Math.PI) / 180
const U: V3 = [Math.sin(ALONG), Math.cos(ALONG), 0] // along the wheel's plane
const N: V3 = [Math.cos(ALONG), -Math.sin(ALONG), 0] // along the axle
const Z: V3 = [0, 0, 1]
const CENTRE: [number, number] = [-62.8 + 1.5 * U[0], -64.3 + 1.5 * U[1]] // OSM centroid + the lidar's 1.5 m
const H = 13.8 // axle height, lidar
const R = 12.8 // rim radius: top 26.6 m, lidar 26.7
const FACE = 1.25 // each face from the mid-plane
const CARS = 18
const R_CAR = 10.3 // gondola pivots sit at R_CAR + 0.6, so the lowest cabin clears the ground by 0.3 m

/** A point on the wheel at radius r, angle t (0 along U, π/2 up), s along the axle; relative to the axle. */
const wheel = (r: number, t: number, s: number): V3 => add(add(mul(U, r * Math.cos(t)), mul(Z, r * Math.sin(t))), mul(N, s))

const neon = new Part(), lamps = new Part(), blueW = new Part(), white = new Part(), legs = new Part()

function inPlane(path: V3[], closed: boolean) {
  return path.map((_, i) => {
    const prev = path[closed ? (i + path.length - 1) % path.length : Math.max(0, i - 1)]
    const next = path[closed ? (i + 1) % path.length : Math.min(path.length - 1, i + 1)]
    const T = unit(sub(next, prev)), B = N
    return { N: unit(cross(T, B)), B }
  })
}

for (const s of [-FACE, FACE]) {
  // The rim: a bold band, and a thinner inner ring where the gondolas hang.
  const rim = Array.from({ length: 24 }, (_, i) => wheel(R, (i / 24) * TAU, s))
  sweep(white, rim, inPlane(rim, true), rim.map(() => rect(0.45, 0.22)), true)
  for (let k = 0; k < CARS; k++) {
    const t = ((k + 0.5) / CARS) * TAU
    beam(white, wheel(1.6, t, s), wheel(R - 0.3, t, s), rect(0.26, 0.18), rect(0.22, 0.16), N, false)
  }
}
/** A lamp bead: a small octahedron, a little larger than the real fitting. */
function bead(c: V3, k = 0.38) {
  const P: V3[] = [add(c, mul(U, k)), add(c, mul(N, k)), add(c, mul(U, -k)), add(c, mul(N, -k))]
  const top = add(c, [0, 0, k]), bot = add(c, [0, 0, -k])
  const n = (p: V3) => unit(sub(p, c)) // smooth: six shared corners, a round bead
  for (let i = 0; i < 4; i++) {
    const a = P[i], b = P[(i + 1) % 4]
    tri(lamps, [a, b, top], [n(a), n(b), n(top)])
    tri(lamps, [b, a, bot], [n(b), n(a), n(bot)])
  }
}
// The LED lights (p6, p7): beads along every spoke and round the rim, on
// the outer side of each face. Parchment draws them as lit points at night.
for (const s of [-FACE, FACE]) {
  const o = Math.sign(s) * 0.3
  for (let k = 0; k < CARS; k++) {
    const t = ((k + 0.5) / CARS) * TAU
    bead(wheel(7.5, t, s + o))
  }
  for (let k = 0; k < CARS; k++) bead(wheel(R, (k / CARS) * TAU, s + o * 1.2))
}
// Cross ties at the rim between the faces, where the gondolas hang.
for (let k = 0; k < CARS; k++) {
  const t = (k / CARS) * TAU
  beam(white, wheel(R - 0.25, t, -FACE), wheel(R - 0.25, t, FACE), rect(0.16, 0.16), rect(0.16, 0.16), U, false)
}
// Hub and axle: a blue drum with the aquarium's disc on each face.
beam(blueW, wheel(0, 0, -FACE - 0.6), wheel(0, 0, FACE + 0.6), circle(1.6, 16), circle(1.6, 16), U)
beam(white, wheel(0, 0, -FACE - 0.75), wheel(0, 0, FACE + 0.75), circle(0.9, 12), circle(0.9, 12), U)

// Gondolas: a blue cabin under a white roof, hanging from a pivot.
const cabin = new Part(), roof = new Part()
{
  const w = 0.95, d = 0.8, h = 2.1, c = 0.25
  const ring = (z: number, inset: number): V3[] => rect(w - inset, d - inset, c - inset * 0.6).map(([a, b]) => add(add(mul(U, a), mul(N, b)), [0, 0, z]))
  const top = -0.5, bot = top - h
  const body = [ring(bot, 0.15), ring(bot + c, 0), ring(top, 0)]
  cabin.loft(body); cabin.cap(body[0], false)
  const rr = [ring(top, -0.1), ring(top + 0.25, -0.1), ring(top + 0.5, 0.45)]
  roof.loft(rr); roof.cap(rr[2], true); roof.cap(rr[0], false)
  beam(roof, [0, 0, top + 0.5], [0, 0, 0.1], rect(0.12, 0.12), rect(0.12, 0.12), U, false)
}

// A-frames: two splayed legs each side, from the bearings to the ground.
for (const s of [-1, 1]) {
  const C: V3 = [CENTRE[0], CENTRE[1], 0]
  const apex = add(add(mul(N, s * (FACE + 1.0)), [0, 0, H]), C)
  for (const e of [-1, 1]) {
    const foot = add(add(mul(U, e * 8.2), mul(N, s * 2.3)), C)
    beam(legs, [foot[0], foot[1], 0], [apex[0] + U[0] * e * 0.6, apex[1] + U[1] * e * 0.6, H - 0.4], rect(0.55, 0.4, 0.12), rect(0.35, 0.3, 0.08), Z)
    beam(legs, [foot[0], foot[1], 0], [foot[0], foot[1], 0.6], rect(0.9, 0.9, 0.2), rect(0.85, 0.85, 0.2), U)
  }
  // A brace between the legs a third of the way up.
  const at = (e: number, z: number): V3 => {
    const t = z / (H - 0.4)
    const f = add(add(mul(U, e * 8.2), mul(N, s * 2.3)), C), a = add(add(mul(N, s * (FACE + 1.0)), mul(U, e * 0.6)), C)
    return [f[0] + (a[0] - f[0]) * t, f[1] + (a[1] - f[1]) * t, z]
  }
  beam(legs, at(-1, 4.5), at(1, 4.5), rect(0.25, 0.25), rect(0.25, 0.25), Z)
  beam(legs, apex, add(apex, mul(N, -s * 0.9)), rect(0.8, 0.8, 0.15), rect(0.8, 0.8, 0.15), Z)
}

// --- Motion: one turn every 90 s, gondolas hanging plumb ---------------------
const LOOP = 90
const KEYS = 48
const times = Array.from({ length: KEYS + 1 }, (_, i) => (i / KEYS) * LOOP)
const turned = times.map((_, i) => (i / KEYS) * TAU)
const wheelTurn: Quat[] = turned.map((a) => axisAngle(N, a))
const plumb: Quat[] = turned.map((a) => axisAngle(N, -a))

const LAMP: MaterialSpec = { name: 'lamp-aquarium-wheel', color: 0xeef2f4, roughness: 0.5 }
const BLUE: MaterialSpec = { name: 'aquarium-blue', color: 0x4f93c8, roughness: 0.6 }
const nodes: NodeSpec[] = [{
  name: 'wheel',
  translation: [CENTRE[0], CENTRE[1], H],
  parts: [{ part: lamps, material: LAMP }, { part: blueW, material: BLUE }, { part: white, material: WHITE }],
}]
const channels: ChannelSpec[] = [{ node: 0, path: 'rotation', values: wheelTurn }]
for (let k = 0; k < CARS; k++) {
  const t = -Math.PI / 2 + (k / CARS) * TAU
  nodes.push({ name: `gondola-${k + 1}`, parent: 0, translation: wheel(R_CAR + 0.6, t, 0), parts: [{ part: cabin, material: BLUE }, { part: roof, material: WHITE }] })
  channels.push({ node: nodes.length - 1, path: 'rotation', values: plumb })
}

const parts = [
  { part: stucco, material: finish('aquarium-stucco', 0xd5d6d4) },
  { part: trim, material: WHITE },
  { part: glazing, material: finish('window', 0x4f86b0, 0.35) },
  { part: sign, material: finish('neon-aquarium-sign', 0x3d7fc0, 0.5) },
  { part: legs, material: BLUE },
]
const drawn = new Map<string, number>()
for (const { part, material } of [...parts, ...nodes.flatMap((n) => n.parts)]) drawn.set(material.name, (drawn.get(material.name) ?? 0) + part.triangles)
const triangles = [...drawn.values()].reduce((a, b) => a + b, 0)
console.log([...drawn].map(([name, n]) => `${name}: ${n}`).join('\n'))
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Downtown Aquarium', parts, {
  license: 'CC0-1.0', bearing: BEARING, anchor: [29.7642737, -95.3674077], height: CREST + 0.6,
  frame: 'Y up, -Z along bearing 34.5, metres; origin on the ground at the anchor; y = 0 at the wheel\'s lower ground',
  replaces: ['way/378253051', 'way/383573689'],
}, { nodes, animation: { name: 'turn', times, channels } })
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/hou-downtown-aquarium.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${LOOP} s a turn`)
