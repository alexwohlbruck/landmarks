/**
 * Texas Star, Fair Park, Dallas — procedural, CC0-1.0.
 * bun generators/dal-texas-star.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground under the
 * axle. The wheel is built turning in the x–z plane, its axle along y.
 * Placed at bearing 90: the wheel's plane runs north–south (lidar: the
 * points above 25 m fit a line at 0.4° from north), so the model's x is
 * south and its y east.
 *
 * A 1985 Ferris wheel (built by Mondial for the State Fair of Texas), 212 ft
 * (64.6 m) to the top, the tallest in North America when it opened, with 44
 * gondolas. Pale sky-blue steel: a rim truss of an outer and an inner ring,
 * a third ring at mid-radius carrying the lit letters TEXAS STAR, and a
 * dense web of spokes from a wide hub, carried on two A-frames of broad box
 * legs. The hub is a ball painted as the Texas flag.
 *
 * The rim truss's lattice and the doubled spokes are far too fine to model
 * (STYLE.md: no thin ribs), so each face of the wheel has two broad rings,
 * the letter ring and 22 spokes, the two faces' spokes offset so the wheel
 * shows 44 spoke lines face on, as the real one does.
 *
 * It turns (experimental; see "Animation" in STYLE.md), as the Wonder Wheel
 * does: the wheel is a node at the axle, each gondola a child node at its
 * pivot turned back by as much as the wheel turns, so it hangs plumb. The
 * hub ball and its flag stay still, as on the real wheel. Everything else
 * is the static root node. At t = 0 the model is the static one, with the
 * letters reading as in the photos (TEXAS over the top, STAR under it).
 *
 * Evidence:
 *  - OSM node/5205613509 (attraction=big_wheel, height=64.6, start_date
 *    1985, wikidata Q1318837). It replaces nothing: OSM maps no building.
 *  - USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018 flight), 0.5 m grid: the
 *    wheel's plane at 0.4°, 0.75 m east and 3.5 m south of the OSM node, so
 *    the anchor is moved there (measured); the returns span 61.5 m north to
 *    south, gondolas included (measured), giving the rim radius 30 m; the
 *    returns stop at 52 m (the cloud has nothing higher), so the height is
 *    the published 64.6 m, which puts the axle at 34.3 m. The A-frame feet
 *    stand about 14 m either side of the axle along the plane and 10 m out
 *    from it (lidar image and NAIP, measured to ~1 m).
 *  - USGS NAIP (2022): the plane's line and the legs.
 *  - Published: 212 ft, 44 gondolas, 1985 (Wikipedia, "Texas Star (Ferris
 *    wheel)"; OSM height tag).
 *  - photos for proportions: hub ball ~4.6 m across (1/13 of the wheel);
 *    the letter ring at ~0.57 of the rim radius, letters ~3.4 m tall,
 *    nine letters 40° apart; inner rim ring 3 m inside the outer; legs
 *    ~1.6 m broad (estimated from Kelly DeLay's and Shamrocks's views).
 *  - colour: the steel is sky blue in every daylight photo: pale in the
 *    2007-2010 ones (sunlit #cbe1ef), a richer blue in the 2026 aerial
 *    (sunlit #6bbce9, shade #225a7a); drawn #86c1e4, the current paint at
 *    the palette's lightness; flag red #c23a44, flag blue
 *    #24479a, white #f2efe8; gondolas red, yellow, sky blue and royal blue
 *    in turn (the real cars have been repainted several times: green and
 *    purple in 2007, pink, yellow and cyan in 2026; four of the colours fit
 *    the material budget).
 *  - night: LED strings along the spokes, rings and chords, in changing
 *    colours (blue in Kairos14's photo, red and white in John Griffiths's);
 *    the letters and the flag ball are lit. The wheel's members are
 *    `neon-texas-star-steel` and glow sky blue; letters, flag and gondolas
 *    are neon in their own colours; the legs are floodlit (_FLOODLIGHT).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Texas_Star_ferris_wheel_in_Fair_Park_Dallas_2026.png, IcedCowboyCoffee,
 *    CC0 (aerial from the south-west)
 *  - Texas_Star_(2937752973).jpg, Kelly DeLay, CC BY 2.0 (letters, hub, legs)
 *  - Texas_Star,_Fair_Park.jpg, 17Shamrocks, CC BY-SA 4.0 (legs from below)
 *  - Texas_State_Fair_Texas_Star.jpg, Andreas Praefcke, CC BY 3.0 (whole
 *    wheel, side on)
 *  - Fair_Park_ferris_wheel.jpg, Joe Mabel, CC BY-SA 3.0 (letters, gondolas)
 *  - Texas-Star-4146.jpg, Loadmaster (David R. Tribble), CC BY-SA 3.0
 *  - Texas_Star_-_Texas_State_Fair.JPG, Kairos14, CC BY-SA 3.0 (night)
 *  - Texas_Star_at_night.jpg, John Griffiths, CC BY-SA 2.0 (night)
 * No look-only sources. No commercial imagery or 3D tiles.
 *
 * Doubts: the faces' spacing (±1.2 m at the rim, ±2.4 m at the hub) and the
 * gondola size (1.9 m across, 2.6 m tall) are estimated from the photos; the
 * lit chords that make a star at night are left out; the boarding platform
 * and the service mast under the hub are left out.
 *
 * Lettering: the letters are the sign of the landmark (STYLE.md, famous
 * signs). Traced from Kelly DeLay's photo: bold slab-serif capitals.
 */
import { Part, axisAngle, writeGlb, type ChannelSpec, type MaterialSpec, type NodeSpec, type Quat, type V3 } from './mesh'
import { Pen, strokes } from './lettering'

const ANCHOR: [number, number] = [32.7767472, -96.7592587]
const BEARING = 90

const TAU = Math.PI * 2
const H = 34.3 // axle height: 64.6 m to the rim's top
const R_RIM = 30 // outer rim ring's centre line
const R_IN = 27 // inner rim ring
const R_LET = 17 // the letter ring
const FACE = 1.2 // each face's distance from the mid-plane at the rim
const HUB_FACE = 2.4 // ...and at the hub
const BALL = 2.3 // the flag ball's radius (4.6 m across, 1/13 of the wheel)
const SPOKES = 22 // per face

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A point on the wheel at radius r, angle t (0 = +x, π/2 = up), face y — relative to the axle. */
const wheel = (r: number, t: number, y: number): V3 => [r * Math.cos(t), y, r * Math.sin(t)]

/** A triangle whose winding follows its normals. */
function tri(p: Part, v: V3[], n: V3[]) {
  p.tri(v[0], v[1], v[2], undefined, undefined, undefined, n)
}
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3[]) {
  tri(p, [a, b, c], [n[0], n[1], n[2]])
  tri(p, [a, c, d], [n[0], n[2], n[3]])
}

type Profile = [number, number][]
const rect = (a: number, b: number): Profile => [[-a, -b], [a, -b], [a, b], [-a, b]]

/** Sweep a profile (in the frame N, B) along a path; flat across, smooth along. */
function sweep(p: Part, path: V3[], frames: { N: V3; B: V3 }[], prof: Profile, closed = false, caps = false) {
  const m = prof.length
  const at = (i: number, k: number) => add(path[i], add(mul(frames[i].N, prof[k][0]), mul(frames[i].B, prof[k][1])))
  const normal = (i: number, k: number) => {
    const [a, b] = prof[k], [c, d] = prof[(k + 1) % m]
    return unit(add(mul(frames[i].N, d - b), mul(frames[i].B, -(c - a))))
  }
  const last = closed ? path.length : path.length - 1
  for (let i = 0; i < last; i++) {
    const j = (i + 1) % path.length
    for (let k = 0; k < m; k++) {
      const l = (k + 1) % m, ni = normal(i, k), nj = normal(j, k)
      quad(p, at(i, k), at(i, l), at(j, l), at(j, k), [ni, ni, nj, nj])
    }
  }
  if (caps && !closed) {
    for (const [i, o] of [[0, 1], [path.length - 1, path.length - 2]]) {
      const n = unit(sub(path[i], path[o])), ring = prof.map((_, k) => at(i, k))
      for (let k = 1; k < m - 1; k++) tri(p, [ring[0], ring[k], ring[k + 1]], [n, n, n])
    }
  }
}

/** A ring in a face of the wheel. */
function ring(p: Part, r: number, y: number, seg: number, a: number, b: number) {
  const path = Array.from({ length: seg }, (_, i) => wheel(r, (i / seg) * TAU, y))
  const frames = path.map((q) => ({ N: unit([q[0], 0, q[2]]), B: [0, 1, 0] as V3 }))
  sweep(p, path, frames, rect(a, b), true)
}

/** A straight member from a to b with a rectangular section, `side` fixing its turn. */
function beam(p: Part, a: V3, b: V3, s0: [number, number], s1: [number, number] = s0, side: V3 = [0, 1, 0], caps = true) {
  const T = unit(sub(b, a))
  let N = cross(side, T)
  if (Math.hypot(...N) < 1e-6) N = cross([1, 0, 0], T)
  N = unit(N)
  const B = unit(cross(T, N))
  const m = 4, P0 = rect(...s0), P1 = rect(...s1)
  const at = (c: V3, P: Profile, k: number) => add(c, add(mul(N, P[k][0]), mul(B, P[k][1])))
  for (let k = 0; k < m; k++) {
    const l = (k + 1) % m
    const n = unit(add(mul(N, P0[l][1] - P0[k][1]), mul(B, -(P0[l][0] - P0[k][0]))))
    quad(p, at(a, P0, k), at(a, P0, l), at(b, P1, l), at(b, P1, k), [n, n, n, n])
  }
  if (caps) {
    const na = mul(T, -1)
    tri(p, [at(a, P0, 0), at(a, P0, 1), at(a, P0, 2)], [na, na, na]); tri(p, [at(a, P0, 0), at(a, P0, 2), at(a, P0, 3)], [na, na, na])
    tri(p, [at(b, P1, 0), at(b, P1, 1), at(b, P1, 2)], [T, T, T]); tri(p, [at(b, P1, 0), at(b, P1, 2), at(b, P1, 3)], [T, T, T])
  }
}

// --- Materials ----------------------------------------------------------------
const STEEL_COLOR = 0x86c1e4
const NEON_STEEL: MaterialSpec = { name: 'neon-texas-star-steel', color: STEEL_COLOR, roughness: 0.6 }
const STEEL: MaterialSpec = {
  name: 'texas-star-steel', color: STEEL_COLOR, roughness: 0.6,
  // The legs are lit from spotlights at their feet (night photos): bright
  // low down, fading up the legs.
  floodlight: (p, n) => (n[2] > 0.7 ? 0 : Math.max(0, 0.7 - 0.012 * p[2])),
}
const WHITE: MaterialSpec = { name: 'neon-texas-star-white', color: 0xf2efe8, roughness: 0.5 }
const RED: MaterialSpec = { name: 'neon-texas-star-red', color: 0xc23a44, roughness: 0.5 }
const BLUE: MaterialSpec = { name: 'neon-texas-star-blue', color: 0x24479a, roughness: 0.5 }
const YELLOW: MaterialSpec = { name: 'neon-texas-star-yellow', color: 0xe3c33c, roughness: 0.5 }

// --- The wheel (turns) -----------------------------------------------------------
const frame = new Part(), letters = new Part()
for (const s of [-1, 1]) {
  ring(frame, R_RIM, s * FACE, 32, 0.42, 0.2)
  ring(frame, R_IN, s * FACE, 24, 0.3, 0.18)
  ring(frame, R_LET, s * (FACE + 0.5), 16, 0.28, 0.16)
  // Spokes from the hub flange to the outer ring; the two faces offset by
  // half a step, so the wheel shows 44 spoke lines face on.
  for (let k = 0; k < SPOKES; k++) {
    const t = ((k + (s > 0 ? 0 : 0.5)) / SPOKES) * TAU
    beam(frame, wheel(1.6, t, s * HUB_FACE), wheel(R_RIM, t, s * FACE), [0.22, 0.16], [0.22, 0.16], [0, 1, 0], false)
  }
}
// Hub flanges.
for (const s of [-1, 1]) {
  const path = Array.from({ length: 12 }, (_, i) => wheel(1.7, (i / 12) * TAU, s * HUB_FACE))
  sweep(frame, path, path.map((q) => ({ N: unit([q[0], 0, q[2]]), B: [0, 1, 0] as V3 })), rect(0.35, 0.35), true)
}

// --- The letters TEXAS STAR ------------------------------------------------------
// Slab-serif capitals in letter units (cap height 1), centre-lines traced
// from Kelly DeLay's photo; each letter is set with its baseline centred at
// the origin.
const SERIF = 0.16
function glyph(c: string): Pen {
  const p = new Pen()
  const serif = (x: number, y: number) => p.moveTo([x - SERIF, y]).lineTo([x + SERIF, y])
  switch (c) {
    case 'T':
      p.moveTo([-0.38, 0.95]).lineTo([0.38, 0.95])
      p.moveTo([0, 0.95]).lineTo([0, 0])
      serif(0, 0.03)
      p.moveTo([-0.38, 0.95]).lineTo([-0.38, 0.8])
      p.moveTo([0.38, 0.95]).lineTo([0.38, 0.8])
      break
    case 'E':
      p.moveTo([0.3, 0.95]).lineTo([-0.3, 0.95]).lineTo([-0.3, 0.05]).lineTo([0.32, 0.05])
      p.moveTo([-0.3, 0.5]).lineTo([0.16, 0.5])
      p.moveTo([0.3, 0.95]).lineTo([0.3, 0.82])
      p.moveTo([0.32, 0.05]).lineTo([0.32, 0.2])
      break
    case 'X':
      p.moveTo([-0.34, 0.95]).lineTo([0.34, 0.05])
      p.moveTo([0.34, 0.95]).lineTo([-0.34, 0.05])
      serif(-0.34, 0.95); serif(0.34, 0.95); serif(-0.34, 0.03); serif(0.34, 0.03)
      break
    case 'A':
      p.moveTo([-0.38, 0.03]).lineTo([0, 0.97]).lineTo([0.38, 0.03])
      p.moveTo([-0.2, 0.35]).lineTo([0.2, 0.35])
      serif(-0.38, 0.03); serif(0.38, 0.03)
      break
    case 'S':
      p.moveTo([0.3, 0.8]).cubicTo([0.22, 1.0], [-0.34, 1.0], [-0.3, 0.72], 5)
        .cubicTo([-0.26, 0.48], [0.32, 0.52], [0.32, 0.26], 5)
        .cubicTo([0.32, -0.04], [-0.26, -0.04], [-0.32, 0.2], 5)
      break
    case 'R':
      p.moveTo([-0.3, 0.03]).lineTo([-0.3, 0.95]).lineTo([0.08, 0.95])
        .cubicTo([0.4, 0.95], [0.4, 0.5], [0.08, 0.5], 5).lineTo([-0.3, 0.5])
      p.moveTo([0.02, 0.5]).lineTo([0.36, 0.03])
      serif(-0.3, 0.03)
      break
  }
  return p
}
// Nine letters 40° apart: TEXAS clockwise over the top with their tops out,
// STAR under it reading left to right with their tops in, as on the wheel.
const LETTER_H = 3.4
const word: [string, number, boolean][] = [
  ['T', 0, true], ['E', 40, true], ['X', 80, true], ['A', 120, true], ['S', 160, true],
  ['S', -40, false], ['T', -80, false], ['A', -120, false], ['R', -160, false],
]
for (const [c, deg, out] of word) {
  // Clockwise from the top, seen from +y... the wheel's angle runs the
  // other way, so map compass-like degrees to the wheel's t.
  const t = Math.PI / 2 - (deg * Math.PI) / 180
  const radial: V3 = [Math.cos(t), 0, Math.sin(t)]
  const up = out ? radial : mul(radial, -1)
  // Reading direction: up turned a quarter clockwise as seen from +y.
  const right: V3 = cross(up, [0, -1, 0])
  const base = wheel(R_LET - (out ? LETTER_H / 2 : -LETTER_H / 2), t, FACE + 0.5)
  const place = (u: number, v: number, w: number): V3 => add(base, add(mul(right, u * LETTER_H), add(mul(up, v * LETTER_H), [0, w, 0])))
  strokes(letters, glyph(c).paths, { width: 0.22, depth: 0.12, place, back: true })
}

// --- The hub ball: the Texas flag, standing still ----------------------------------
// Each end of the axle carries a flag-painted dome standing proud of the
// bearings, so the flag ball reads face on from either side (photos: the
// ball sits in front of the spokes and the legs' heads).
const flagBlue = new Part(), flagWhite = new Part(), flagRed = new Part()
const BALL_Y = 4.6, BALL_D = 1.3 // the domes' centres and their depth along the axle
for (const s of [-1, 1]) {
  const nu = 14, nv = 8
  const P = (i: number, j: number): V3 => {
    const a = (i / nu) * TAU, b = -Math.PI / 2 + (j / nv) * Math.PI
    return [BALL * Math.cos(b) * Math.cos(a), s * BALL_Y + BALL_D * Math.cos(b) * Math.sin(a), H + BALL * Math.sin(b)]
  }
  const N = (q: V3): V3 => unit([q[0] / (BALL * BALL), (q[1] - s * BALL_Y) / (BALL_D * BALL_D), (q[2] - H) / (BALL * BALL)])
  /** The flag, seen from this side: the hoist to the viewer's left. */
  const paint = (q: V3) => {
    const u = s > 0 ? -q[0] : q[0]
    if (u < -BALL / 3) return flagBlue
    return q[2] >= H ? flagWhite : flagRed
  }
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
    const a = P(i, j), b = P(i + 1, j), c = P(i + 1, j + 1), d = P(i, j + 1)
    const part = paint(mul(add(add(a, b), add(c, d)), 0.25))
    if (j > 0) tri(part, [a, b, c], [N(a), N(b), N(c)])
    if (j < nv - 1) tri(part, [a, c, d], [N(a), N(c), N(d)])
  }
  // The lone star, flat on the blue.
  const cu = -BALL * 0.66, r0 = 0.66, r1 = 0.27
  const yy = s * (BALL_Y + BALL_D * Math.sqrt(1 - (cu / BALL) ** 2) + 0.05)
  const n: V3 = [0, s, 0]
  const pt = (k: number): V3 => {
    const r = k % 2 ? r1 : r0, a = Math.PI / 2 + (k * Math.PI) / 5
    const u = cu + r * Math.cos(a)
    return [s > 0 ? -u : u, yy, H + r * Math.sin(a)]
  }
  const c: V3 = [s > 0 ? -cu : cu, yy, H]
  for (let k = 0; k < 10; k++) tri(flagWhite, [c, pt(k), pt(k + 1)], [n, n, n])
}

// --- Axle and A-frames (static) ------------------------------------------------------
const legs = new Part()
beam(legs, [0, -3.6, H], [0, 3.6, H], [0.8, 0.8], [0.8, 0.8], [1, 0, 0])
const FOOT_X = 14, FOOT_Y = 10
for (const s of [-1, 1]) {
  const apex: V3 = [0, s * 3.4, H - 0.4]
  for (const x of [-FOOT_X, FOOT_X]) {
    const foot: V3 = [x, s * FOOT_Y, 0]
    // Broad box legs, 1.6 m across the face at the foot, tapering upward.
    beam(legs, foot, apex, [0.8, 0.55], [0.55, 0.45], [0, 1, 0])
    beam(legs, [x, s * FOOT_Y, 0], [x, s * FOOT_Y, 0.9], [1.3, 1.1], [1.2, 1.0], [1, 0, 0])
  }
  // The bearing block at the apex.
  beam(legs, [0, s * 2.6, H], [0, s * 4.2, H], [1.3, 1.1], [1.3, 1.1], [1, 0, 0])
}

// --- Gondolas --------------------------------------------------------------------------
/**
 * A gondola hanging from a pivot at the origin: a six-sided cabin 1.9 m
 * across and 2.6 m tall with a domed roof, narrow enough to hang between
 * the rim's faces.
 */
function gondola(p: Part) {
  const sides = 6
  const at = (r: number, z: number) => Array.from({ length: sides }, (_, i) => {
    const a = ((i + 0.5) / sides) * TAU
    return [r * Math.cos(a), r * 0.85 * Math.sin(a), z] as V3
  })
  const rings = [at(0.7, -2.75), at(0.95, -2.45), at(0.95, -0.9), at(0.5, -0.35)]
  for (let k = 0; k < rings.length - 1; k++) for (let i = 0; i < sides; i++) {
    const j = (i + 1) % sides
    const a = rings[k][i], b = rings[k][j], c = rings[k + 1][j], d = rings[k + 1][i]
    const n = unit(cross(sub(b, a), sub(d, a)))
    quad(p, a, b, c, d, [n, n, n, n])
  }
  const top = rings[3], bot = rings[0]
  for (let i = 1; i < sides - 1; i++) {
    tri(p, [top[0], top[i], top[i + 1]], [[0, 0, 1], [0, 0, 1], [0, 0, 1]])
    tri(p, [bot[0], bot[i + 1], bot[i]], [[0, 0, -1], [0, 0, -1], [0, 0, -1]])
  }
}
const cabin = new Part()
gondola(cabin)
// One parts array per colour, so the gondolas of a colour share one mesh.
const kinds = [RED, YELLOW, NEON_STEEL, BLUE].map((material) => [{ part: cabin, material }])

// --- Motion ------------------------------------------------------------------------------
/**
 * One turn every 120 s. The real wheel takes several minutes a turn; at
 * that rate the motion is invisible on a map, so this is a livelier loop.
 */
const LOOP = 120
const KEYS = 24 // 15° apart; LINEAR slerp is exact for a steady turn
const times = Array.from({ length: KEYS + 1 }, (_, i) => (i / KEYS) * LOOP)
const turned = times.map((_, i) => (i / KEYS) * TAU)
const AXLE: V3 = [0, 1, 0]
const wheelTurn: Quat[] = turned.map((a) => axisAngle(AXLE, a))
const plumb: Quat[] = turned.map((a) => axisAngle(AXLE, -a))

const nodes: NodeSpec[] = [{
  name: 'wheel',
  translation: [0, 0, H],
  parts: [{ part: frame, material: NEON_STEEL }, { part: letters, material: WHITE }],
}]
const channels: ChannelSpec[] = [{ node: 0, path: 'rotation', values: wheelTurn }]
for (let k = 0; k < 44; k++) {
  const t = Math.PI / 2 + (k / 44) * TAU
  nodes.push({ name: `gondola-${k + 1}`, parent: 0, translation: wheel(R_RIM + 0.3, t, 0), parts: kinds[k % kinds.length] })
  channels.push({ node: nodes.length - 1, path: 'rotation', values: plumb })
}

const parts = [
  { part: legs, material: STEEL },
  { part: flagBlue, material: BLUE },
  { part: flagWhite, material: WHITE },
  { part: flagRed, material: RED },
]
const drawn = new Map<string, number>()
for (const { part, material } of [...parts, ...nodes.flatMap((n) => n.parts)])
  drawn.set(material.name, (drawn.get(material.name) ?? 0) + part.triangles)
const triangles = [...drawn.values()].reduce((a, b) => a + b, 0)
console.log([...drawn].map(([name, n]) => `${name}: ${n}`).join('\n'))
if (drawn.size > 6) throw new Error(`Too many materials: ${drawn.size}`)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Texas Star', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: 64.6, anchor: ANCHOR, bearing: BEARING,
}, { nodes, animation: { name: 'turn', times, channels } })
await Bun.write(new URL('../models/dal-texas-star.glb', import.meta.url), glb)
console.log(`dal-texas-star.glb: ${triangles} triangles, ${glb.length} bytes, ${LOOP} s a turn`)
void dot
