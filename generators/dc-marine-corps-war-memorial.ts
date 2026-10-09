/**
 * Marine Corps War Memorial (Iwo Jima Memorial), Arlington, Virginia —
 * procedural, CC0-1.0.
 *
 *   bun generators/dc-marine-corps-war-memorial.ts
 *
 * Map frame: x east, y north, z up, metres. The origin is the centre of the
 * base's OSM outline (way/45297440; lng -77.0697239, lat 38.8904362), on the
 * lawn. Bearing 0: the base's long axis runs north-south, as OSM draws it.
 *
 * Felix de Weldon's bronze (1954) of the six Marines raising the flag on
 * Mount Suribachi, from Joe Rosenthal's photograph, on a polished black
 * granite base. The pole is planted at the south end of the bronze rock pile
 * and leans up toward the north-east; the men lean into it toward its foot,
 * the leading one bent double at the bottom, the last with his legs flung
 * back to the north. A real cloth flag flies from it.
 *
 * Evidence
 *  - OSM (measured): way/45297440, historic=monument, the base's elongated
 *    octagon, 13.3 m east-west by 19.4 m north-south. Not a building, so the
 *    model replaces nothing.
 *  - Published (Wikipedia, NPS): figures 32 ft (9.8 m) tall, a 60 ft (18 m)
 *    flagpole, a cloth flag flown day and night.
 *  - Photos (Wikimedia Commons, HALS VA-9, Jack E. Boucher, public domain):
 *    the west, south and east elevations and the close elevated views from
 *    south and north. The pose, the pole's lean and every height below are
 *    measured off those, scaled by the base's OSM length.
 *
 * Measured from the elevations: base top 2.9 m with a 0.4 m step; the rock
 * pile about 1.4 m above it; the pole leaning 65° from the horizontal, to
 * the north-east; the men's hands round it at 11.8 m; helmets from 8.3 m
 * (the bent leader) to 11 m. Estimated: the
 * limb sizes (helmets 0.9 m across in the elevations, so the bronze men are about
 * 3.5 times life where they crouch), how the six bodies sit in depth where
 * they hide each other, and the flag (2.5 × 4.6 m, flown to the north-east as
 * the elevations show it, with one ripple so it never shows edge-on), drawn with seven broad stripes rather than
 * thirteen thin ones, which would only shimmer at map distance. Rifles,
 * hands and the inscriptions are left out.
 */
import { Part, cross, type V3 } from './mesh'
import { finish } from './palette'
import { ellipsoid, plus, prism, scale, save, tube, unit, type XY } from './dc-wwii-memorial'

const bronze = new Part()
const granite = new Part()
const red = new Part()
const white = new Part()
const blue = new Part()

// ---- the base -----------------------------------------------------------------
// OSM's octagon, made symmetric: long east and west faces, short chamfered
// ends. The outline includes the step; the polished block sits inside it.
const oct = (hx: number, hy: number, ex: number, sy: number): XY[] =>
  [[-ex, -hy], [ex, -hy], [hx, -sy], [hx, sy], [ex, hy], [-ex, hy], [-hx, sy], [-hx, -sy]]
const BASE_TOP = 2.9
prism(granite, oct(6.6, 9.7, 3.0, 3.5), 0, 0.4, 0.06)
prism(granite, oct(6.1, 9.2, 2.75, 3.3), 0.4, BASE_TOP, 0.08)

// ---- the rock pile --------------------------------------------------------------
// Chunky bronze slabs heaped on the middle of the base, highest under the
// men; turned and tipped so they read as broken rock.
function rock(c: V3, [a, b, h]: V3, yaw: number, tip: number) {
  const ex: V3 = [Math.cos(yaw), Math.sin(yaw), 0]
  const ey0: V3 = [-Math.sin(yaw), Math.cos(yaw), 0]
  const ey: V3 = plus(scale(ey0, Math.cos(tip)), [0, 0, Math.sin(tip)])
  const ez = cross(ex, ey)
  const P = (i: number, j: number, k: number) => plus(c, plus(scale(ex, i * a), plus(scale(ey, j * b), scale(ez, k * h))))
  const v = [P(-1, -1, -1), P(1, -1, -1), P(1, 1, -1), P(-1, 1, -1), P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1)]
  // Top shrunk a little so each slab is a wedge, not a brick.
  for (let k = 4; k < 8; k++) v[k] = plus(c, scale(plus(v[k], scale(c, -1)), 0.82))
  bronze.loft([[v[0], v[1], v[2], v[3]], [v[4], v[5], v[6], v[7]]])
  bronze.cap([v[4], v[5], v[6], v[7]], true)
}
const Z = BASE_TOP
// Low: the pile rises about 1.4 m over the base and the men hide most of it.
const ROCKS: [V3, V3, number, number][] = [
  [[0, 0, Z + 0.25], [2.4, 5.4, 0.45], 0.05, 0],
  [[0.2, -0.4, Z + 0.7], [1.7, 3.6, 0.4], -0.15, 0.05],
  [[1.5, -3.6, Z + 0.5], [0.9, 1.1, 0.55], 0.7, 0.2],
  [[-1.4, -3.0, Z + 0.45], [1.0, 0.9, 0.5], -0.5, -0.15],
  [[-1.6, 3.4, Z + 0.4], [0.9, 1.1, 0.45], 0.3, 0.2],
  [[1.5, 3.6, Z + 0.4], [1.0, 0.9, 0.45], -0.6, -0.2],
  [[0.1, -5.2, Z + 0.35], [1.2, 0.8, 0.4], 0.2, 0.25],
]
for (const [c, s, yaw, tip] of ROCKS) rock(c, s, yaw, tip)
const ROCK_TOP = Z + 1.4

// ---- the pole -----------------------------------------------------------------
// Measured on the west elevation (VA-9-4), scaled 28 px/m off the base's OSM
// length: foot at 4.6 m south of centre among the rocks, the men's hands
// round it at 11.8 m, the top at 20 m, 1.8 m north of centre; and on the
// south one it leans east 0.28 m per metre of rise. That is 65° from the
// horizontal, steeper than the photograph it copies.
const POLE_BASE: V3 = [-0.3, -4.6, ROCK_TOP]
const POLE_TOP: V3 = [4.0, 1.8, 20.0]
const POLE_DIR = unit([POLE_TOP[0] - POLE_BASE[0], POLE_TOP[1] - POLE_BASE[1], POLE_TOP[2] - POLE_BASE[2]])
const POLE_LEN = 18
const onPole = (s: number) => plus(POLE_BASE, scale(POLE_DIR, s))
/** The point on the pole at height z. */
const poleAt = (z: number) => onPole((z - POLE_BASE[2]) / POLE_DIR[2])
tube(bronze, [POLE_BASE, onPole(POLE_LEN)], [0.15, 0.12], [0.15, 0.12], 6)

// ---- the six Marines --------------------------------------------------------------
// Each from his feet, hips and shoulders, with the head carried on the line
// of the back and the hands on the pole. Proportions are a man scaled to
// about 4.2 times life (helmets 0.9 m across in the elevations): legs 3.8 m,
// back 2.2 m, round helmeted head, broad shoulders.
type Man = { hip: V3; sh: V3; feet: [V3, V3]; hands: [V3, V3] }
const mid3 = (a: V3, b: V3, push: V3): V3 => plus(scale(plus(a, b), 0.5), push)
const side: V3 = [1, 0, 0]
function marine({ hip, sh, feet, hands }: Man) {
  const up = unit([sh[0] - hip[0], sh[1] - hip[1], sh[2] - hip[2]])
  // Torso: hips, waist, a broad chest.
  tube(bronze, [plus(hip, scale(up, -0.2)), mid3(hip, sh, [0, 0, 0]), sh], [0.76, 0.8, 0.95], [0.56, 0.6, 0.62], 8, { ref: side })
  // Shoulders rounded off, then neck, head and the helmet's brim over it.
  ellipsoid(bronze, plus(sh, scale(up, 0.12)), [0.95, 0.6, 0.42], 8, 4)
  const head = plus(sh, scale(up, 0.78))
  ellipsoid(bronze, head, [0.44, 0.46, 0.48], 8, 5)
  ellipsoid(bronze, plus(head, scale(up, 0.16)), [0.62, 0.64, 0.4], 10, 4)
  // Legs: a lunge. The front leg steps toward the pole, knee high and bent;
  // the back leg is driven out straight behind. Boots at the ends.
  feet.forEach((f0, i) => {
    const h = plus(hip, [(i ? 1 : -1) * 0.42, 0, 0])
    const front = i === 0
    const f: V3 = front ? [f0[0], f0[1] - 1.7, f0[2]] : f0
    const knee = front ? mid3(h, f, [0, -0.7, 1.1]) : mid3(h, f, [0, -0.15, 0.25])
    tube(bronze, [h, knee, f], [0.46, 0.38, 0.28], [0.46, 0.38, 0.28], 8)
    ellipsoid(bronze, plus(f, [0, -0.2, 0.05]), [0.24, 0.42, 0.2], 6, 3)
  })
  // Arms up to the pole, elbows out.
  hands.forEach((hd, i) => {
    const s0 = plus(sh, [(i ? 1 : -1) * 0.8, 0, 0])
    const elbow = mid3(s0, hd, [(i ? 1 : -1) * 0.3, 0.2, -0.2])
    tube(bronze, [s0, elbow, hd], [0.31, 0.27, 0.22], [0.31, 0.27, 0.22], 6)
    ellipsoid(bronze, hd, [0.27, 0.27, 0.27], 6, 3)
  })
}
const zf = ROCK_TOP
// Positions from the west and south elevations: heads in a band 8–11 m, feet
// on the pile from 4.3 m north to 4.5 m south of centre, all leaning south
// into the pole's foot.
const MEN: Man[] = [
  // The leader, bent double at the foot, planting it.
  { hip: [0.5, -2.6, 7.2], sh: [0.4, -4.4, 8.0], feet: [[0.9, -0.6, zf], [0.1, 0.0, zf]], hands: [poleAt(6.0), poleAt(6.8)] },
  // Standing more upright on the west side, facing south.
  { hip: [-1.7, -1.6, 7.9], sh: [-1.6, -2.4, 10.0], feet: [[-2.0, 0.2, zf], [-1.3, -0.4, zf]], hands: [poleAt(9.0), poleAt(9.6)] },
  // Second from the front, leaning hard.
  { hip: [-0.5, -0.6, 7.5], sh: [-0.4, -2.3, 9.3], feet: [[-0.9, 2.0, zf], [-0.2, 1.6, zf]], hands: [poleAt(10.6), poleAt(11.2)] },
  // The middle pair, reaching highest.
  { hip: [0.7, 0.9, 7.7], sh: [0.7, -0.8, 9.8], feet: [[1.0, 3.0, zf], [0.3, 2.7, zf]], hands: [poleAt(11.6), poleAt(12.2)] },
  { hip: [-0.8, 2.4, 7.3], sh: [-0.7, 0.7, 9.4], feet: [[-1.2, 4.4, zf], [-0.5, 4.0, zf]], hands: [poleAt(11.2), poleAt(11.9)] },
  // The last, on the east, crouched and pushing.
  { hip: [1.7, 2.0, 7.0], sh: [1.7, 0.3, 8.9], feet: [[2.0, 4.2, zf], [1.3, 3.8, zf]], hands: [poleAt(10.2), poleAt(10.9)] },
]
MEN.forEach(m => marine(m))

// ---- the flag -------------------------------------------------------------------
// About a quarter of the pole long, as on the west elevation (4.6 m), hung
// from its top and flown out to the north-east. Both faces are drawn.
{
  const top = onPole(POLE_LEN - 0.1), foot = onPole(POLE_LEN - 2.6)
  // The cloth ripples: the first half flies north-north-east, the second
  // east-north-east, so the flag shows from every side, as cloth does.
  const fly1 = unit([0.45, 0.88, -0.1]), fly2 = unit([0.92, 0.38, -0.14])
  const L = 4.6, STRIPES = 7
  const quad = (p: Part, a: V3, b: V3, c: V3, d: V3) => { p.quad(a, b, c, d); p.quad(a, d, c, b) }
  const along = (u: number): V3 => u <= 0.5 ? scale(fly1, u * L) : plus(scale(fly1, 0.5 * L), scale(fly2, (u - 0.5) * L))
  const at = (u: number, v: number) => plus(plus(foot, scale(plus(top, scale(foot, -1)), v)), along(u))
  const strip = (p: Part, u0: number, u1: number, v0: number, v1: number) => {
    // Split at the fold so each piece stays flat.
    const cuts = [u0, ...(u0 < 0.5 && u1 > 0.5 ? [0.5] : []), u1]
    for (let i = 0; i < cuts.length - 1; i++) quad(p, at(cuts[i], v0), at(cuts[i + 1], v0), at(cuts[i + 1], v1), at(cuts[i], v1))
  }
  for (let k = 0; k < STRIPES; k++) {
    const v0 = k / STRIPES, v1 = (k + 1) / STRIPES
    // The canton covers the top four stripes' first 40%.
    strip(k % 2 === 0 ? red : white, k >= STRIPES - 4 ? 0.4 : 0, 1, v0, v1)
  }
  strip(blue, 0, 0.4, (STRIPES - 4) / STRIPES, 1)
}

await save('dc-marine-corps-war-memorial', 'Marine Corps War Memorial', [
  // Dark bronze, a warm brown-olive, held lighter than charcoal.
  { part: bronze, material: finish('iwo-bronze', 0x6a5d4a) },
  // The polished black granite base, pulled to a deep grey.
  { part: granite, material: finish('iwo-black-granite', 0x55585c) },
  { part: red, material: finish('flag-red', 0xb4444a) },
  { part: white, material: finish('flag-white', 0xf2efe8) },
  { part: blue, material: finish('flag-blue', 0x3e4e78) },
], { bearing: 0 })
