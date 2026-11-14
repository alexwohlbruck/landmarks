/**
 * National Theatre (Národní divadlo), Prague: procedural, CC0-1.0.
 *   bun generators/prague-national-theatre.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/prague-national-theatre.glb, the low model (no stars);
 * - models/prague-national-theatre.detail.glb, drawn from zoom 17: pilasters,
 *   window hoods, balusters, more and finer stars, the dome's dormers with
 *   their oval lights, and the sculpture drawn rounder.
 *
 * Uses the kit exported by generators/prague-dancing-house.ts, and exports a
 * few helpers of its own (statue, blob, archPanel, pane, insetPoly, hipRoof)
 * that generators/prague-municipal-house.ts uses, so it merges before that.
 *
 * Frame: not turned (BEARING 0): +x east, +y north, z up, metres. Origin =
 * the anchor 14.41357 E, 50.08086 N (OSM way/7649971, within a few metres
 * of its centroid); y = 0 is the street. The loggia faces north onto Národní,
 * the long arcaded fronts face the river (west) and Divadelní (east), the
 * stage is to the south.
 *
 * Evidence
 * - OSM way/7649971 (Národní divadlo, building=civic, height 26, Josef
 *   Zítek, 1881-1883, building:colour #947a58), its outline used as drawn;
 *   way/379386264 (the loggia block on Národní, 25 x 7 m, height 22);
 *   way/379386266 (the low annex on the river side, height 9); parts:
 *   way/454893462 (the auditorium's dome, its base a quadrilateral 28 m
 *   wide and 45 m long, height 38, roof colour #333231), relation/16202318
 *   (the gilded crest on its top, 13 x 30 m, height 39), way/481972519 and
 *   way/565056632 (hipped roofs over the stage and between, 31 and 29 m),
 *   way/481972520 (the south end, pyramidal, 28 m), way/565056633 (a low
 *   corner part, 9 m).
 * - Published (cs/en.wikipedia "Národní divadlo"): neo-Renaissance, Josef
 *   Zítek, rebuilt after the 1881 fire by Josef Schulz (1883); the dome
 *   blue with gold stars; Bohuslav Schnirch's two trigas (three-horse
 *   chariots driven by Victories) on the loggia's pylons; the loggia's
 *   attic and the attics over the river carry statues (Muses, Apollo and
 *   others).
 * - Commons photos (EVIDENCE):
 *   "Národní divadlo z Kampy.jpg" (Tadeáš Gregor, CC BY-SA 4.0; a telephoto
 *   from Kampa, north-west across the river: the dome's profile, its
 *   dormers, gold hips and star pattern, the drum, the crest and spires,
 *   both trigas, the attic statues; the heights above the cornice are
 *   measured on it); "National Theatre, Prague (189067931).jpg" (Luca
 *   Florio, CC BY-SA 3.0; from the north-west: the loggia's five bays of
 *   paired columns, the corner pylon and its triga, the river front);
 *   "Lascar Národní Divadlo (National Theatre in Prague) (4504575648).jpg"
 *   (Jorge Láscar, CC BY 2.0; from the north-east: the east front's ground
 *   arcade, piano nobile and oculi, the loggia's attic statues);
 *   "Národní divadlo Praha, Nové Město 20170907 001/002/003.jpg" (Tilman2007,
 *   CC BY-SA 4.0; night: the floodlit stone, the dome's gilding and oculi);
 *   "Národní divadlo-Prague-2.jpg" (Yair Haklai, CC BY-SA 3.0; dusk across
 *   the river); "Národní divadlo, Škoda 15T.jpg" (Honza Groh, CC BY-SA 3.0;
 *   night, the east front at street level).
 *
 * Terrain: Mapterhorn here is coarse (z14, ~7 m cells) and dips up to
 * about 4.5 m toward the river at the plan's south-west corner, outside
 * the outline's narrow south end; the street round the building is level.
 * If the map seats y = 0 on that dip the building sinks up to ~4 m: check
 * it on the map. Elevation 0, the model true to the photos.
 *
 * Heights (Kampa photo scaled to OSM's 38 m dome top and 6 m dome rise,
 * checked against Florio's storeys): ground floor and its arcade 0-8 m,
 * the piano nobile to 15.5, an upper storey to 19.5, frieze and main
 * cornice to 21.8, attic balustrade to 23.5; the auditorium's drum (with a
 * row of windows) set on the dome's base polygon to 30.5 with its own
 * balustrade to 31.5; the dome 31.5-37.5, its four curved faces meeting at
 * gilded hips; the crest's railing to 39 with gilded spires to 42. The
 * stage's hipped roofs from OSM. The loggia: five bays of paired columns
 * over a five-arched ground floor, entablature at 19.5-21.5, attic to 23.5
 * with eight statues; the pylons are the main block's north corners, rising
 * to 25 m with the trigas on them.
 * Estimated: the bay rhythm (3.7 m) and window sizes, the stars (small
 * and dense on the real roof: in the detail model 0.5 m across, about 1.4
 * m apart; the low model leaves them out and keeps the gilded hips),
 * the statues along the long fronts' attic (3.8 m, drawn bold; one a bay in the detail model,
 * every other bay in the low), the dormers' places, the statues' poses (one
 * generic robed figure, varied), the trigas (three rearing horses, a
 * chariot and a winged Victory, about 5 m high). Both trigas face east, as
 * the three photos show them (horses to the left from the north-west and
 * from the north-east).
 *
 * Left out: the reliefs in the frieze, the lunette paintings, the lamps,
 * the Nová scéna next door (its own OSM buildings).
 *
 * Doubts: whether the loggia block projects in front of the pylons (OSM)
 * or stands flush with them (Florio's photo is ambiguous); the stage roofs'
 * colour (OSM says green, Kampa shows a green roof beyond the dome), drawn
 * copper green; the south
 * front is not photographed and repeats the long fronts' bays.
 *
 * Night: the whole building is floodlit warm (Tilman2007), the dome's gold
 * glints; windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  TAU, add, mul, sub, unit, cross, dot, lathe, loftSmooth, tube, rod, box, prism, triN, quadN, saveLods, triangulate, jitter,
  type PartList, type XY,
} from './prague-dancing-house'

export type Lod = { detail: boolean }
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// --- plan (OSM) ---
const MAIN: XY[] = [
  [12.3, 45.5], [13.1, 39.1], [13.7, 39.1], [16.3, 16.4], [18.2, -3.7], [18.0, -7.3], [18.6, -7.3], [19.2, -28.3], [19.8, -39.2],
  [20.3, -46.6], [12.9, -48.1], [7.8, -49.1], [0.4, -50.5], [-2.4, -43.4], [-6.8, -31.0], [-8.5, -27.2], [-10.3, -23.9],
  [-11.5, -21.2], [-12.6, -17.8], [-13.6, -13.9], [-14.8, -8.9], [-17.1, -2.7], [-18.4, 3.5], [-22.7, 25.5], [-23.5, 31.9],
  [-24.4, 38.3], [-25.0, 44.9], [-18.2, 45.0], [6.6, 45.6],
].reverse() as XY[] // OSM runs clockwise; this is counter-clockwise
const LOGGIA = { a: [-18.3, 45.0] as XY, b: [6.6, 45.6] as XY, depth: 6.75 } // its back on the main front, the front 6.75 m out
const ANNEX: XY[] = [[-22.7, 25.5], [-24.4, 38.3], [-27.6, 37.6], [-30.5, 37.0], [-28.0, 24.5], [-25.1, 25.1]]
const DOME_BASE: XY[] = [[-10.5, -7.3], [12.7, -3.3], [7.4, 40.4], [-20.9, 39.4]] // counter-clockwise, from the south-west corner
const CREST: XY[] = [[-6.9, 1.8], [4.1, 3.0], [0.3, 33.0], [-13.1, 32.6]]
const STAGE: XY[] = [[-12.5, -13.5], [-6.2, -31.2], [18.0, -28.8], [17.4, -8.2], [-9.8, -12.4]]
const SOUTH: XY[] = [[-6.2, -31.2], [1.3, -49.7], [19.0, -46.1], [18.0, -28.8]]
const MIDDLE: XY[] = [[-9.8, -12.4], [17.4, -8.2], [12.7, -3.3], [-10.5, -7.3]]

const CORNICE = 21.8, ATTIC = 23.5, DRUM = 30.0, DOME0 = 31.0, DOME1 = 38.0

/** Inset a convex counter-clockwise polygon by d. */
export function insetPoly(r: XY[], d: number): XY[] {
  const n = r.length
  const lines = r.map((a, i) => {
    const b = r[(i + 1) % n], l = Math.hypot(b[0] - a[0], b[1] - a[1])
    const nn: XY = [-(b[1] - a[1]) / l, (b[0] - a[0]) / l] // inward for ccw
    return { p: [a[0] + nn[0] * d, a[1] + nn[1] * d] as XY, d: [(b[0] - a[0]) / l, (b[1] - a[1]) / l] as XY }
  })
  return lines.map((L1, i) => {
    const L0 = lines[(i - 1 + n) % n]
    const den = L0.d[0] * L1.d[1] - L0.d[1] * L1.d[0]
    if (Math.abs(den) < 1e-6) return L1.p
    const t = ((L1.p[0] - L0.p[0]) * L1.d[1] - (L1.p[1] - L0.p[1]) * L1.d[0]) / den
    return [L0.p[0] + L0.d[0] * t, L0.p[1] + L0.d[1] * t] as XY
  })
}

/** A hipped roof: the polygon at z0, lofted in to an inset flat top at z1. */
export function hipRoof(p: Part, r: XY[], z0: number, z1: number, inset: number) {
  const top = insetPoly(r, inset)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    const a: V3 = [r[i][0], r[i][1], z0], b: V3 = [r[j][0], r[j][1], z0], c: V3 = [top[j][0], top[j][1], z1], d: V3 = [top[i][0], top[i][1], z1]
    const n = unit(cross(sub(b, a), sub(d, a)))
    quadN(p, a, b, c, d, n[2] < 0 ? mul(n, -1) : n)
  }
  for (const [i, j, k] of triangulate(top)) triN(p, [top[i][0], top[i][1], z1], [top[j][0], top[j][1], z1], [top[k][0], top[k][1], z1], [0, 0, 1])
}

/** An arched panel (a rectangle under a true semicircle) on a wall: c the centre of the springing line. */
export function archPanel(p: Part, c: V3, u: V3, w: V3, half: number, below: number, out: number, seg: number) {
  const P = (s: number, z: number): V3 => add(add(add(c, mul(u, s)), [0, 0, z]), mul(w, out))
  const ring: V3[] = [P(-half, -below), P(half, -below)]
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI
    ring.push(P(half * Math.cos(a), half * Math.sin(a)))
  }
  const ctr = P(0, 0)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    triN(p, ctr, a, b, w)
  }
  quadN(p, P(-half, -below), P(half, -below), P(half, 0), P(-half, 0), w)
}

/** A flat panel on a wall: centre c, along u, half-sizes hu and hv, `out` in front. */
export function pane(p: Part, c: V3, u: V3, w: V3, hu: number, hv: number, out = 0.05) {
  const P = (a: number, b: number): V3 => add(add(add(c, mul(u, a * hu)), [0, 0, b * hv]), mul(w, out))
  quadN(p, P(-1, -1), P(1, -1), P(1, 1), P(-1, 1), w)
}

/** A five-pointed star lying on a surface: centre c, normal n, outer radius r. */
function star(p: Part, c: V3, n: V3, r: number, spin: number) {
  let u = cross(n, [0, 0, 1])
  if (Math.hypot(...u) < 1e-3) u = [1, 0, 0]
  u = unit(u)
  const v = unit(cross(n, u))
  const pts: V3[] = []
  for (let i = 0; i < 10; i++) {
    const a = spin + (i / 10) * TAU, rr = i % 2 ? r * 0.42 : r
    pts.push(add(add(c, mul(u, rr * Math.cos(a))), mul(v, rr * Math.sin(a))))
  }
  for (let i = 0; i < 10; i++) triN(p, c, pts[i], pts[(i + 1) % 10], n)
}

/** A robed standing figure on a small plinth: base at b, facing f (horizontal unit), height h. */
export function statue(p: Part, b: V3, f: V3, h: number, L: Lod, pose: number) {
  const s = h / 2.8
  const side: V3 = [-f[1], f[0], 0]
  const seg = L.detail ? 10 : 5
  // plinth
  if (L.detail) box(p, add(b, [0, 0, 0.2 * s]), side, [0, 0, 1], f, 0.42 * s, 0.2 * s, -0.42 * s, 0.42 * s, false)
  const z0 = b[2] + (L.detail ? 0.4 * s : 0)
  // robe, waist, chest and shoulders: a turned profile
  const prof: XY[] = L.detail
    ? [[0.36, 0], [0.34, 0.5], [0.27, 1.1], [0.24, 1.35], [0.29, 1.75], [0.3, 1.95], [0.16, 2.08], [0.0, 2.1]].map(([r, z]) => [r * s, z * s] as XY)
    : [[0.34, 0], [0.24, 1.3], [0.3, 1.9], [0.0, 2.08]].map(([r, z]) => [r * s, z * s] as XY)
  lathe(p, b[0], b[1], prof.map(([r, z]) => [r, z0 + z] as XY), seg)
  // head
  const hc = add(b, [0, 0, z0 - b[2] + 2.28 * s])
  const hr = 0.16 * s
  lathe(p, hc[0], hc[1], (L.detail ? [[0, -1], [0.7, -0.75], [1, -0.1], [0.92, 0.45], [0.55, 0.85], [0, 1]] : [[0, -1], [1, 0], [0, 1]]).map(([r, z]) => [r * hr, hc[2] + z * hr * 1.15] as XY), seg)
  // arms: one at the side, one raised holding an attribute (a lyre, a wreath, a mask...)
  const sh = (sx: number): V3 => add(b, add(mul(side, sx * 0.27 * s), [0, 0, z0 - b[2] + 1.9 * s]))
  const ar = 0.07 * s
  if (L.detail) tube(p, [sh(-1), add(sh(-1), add(mul(side, -0.08 * s), add(mul(f, 0.12 * s), [0, 0, -0.55 * s]))), add(sh(-1), add(mul(f, 0.22 * s), [0, 0, -0.95 * s]))], ar, 6)
  const up = pose % 2 === 0
  const hand = up ? add(sh(1), add(mul(side, 0.25 * s), add(mul(f, 0.2 * s), [0, 0, 0.62 * s]))) : add(sh(1), add(mul(f, 0.45 * s), [0, 0, -0.35 * s]))
  tube(p, [sh(1), add(sh(1), add(mul(side, 0.18 * s), add(mul(f, 0.15 * s), [0, 0, up ? 0.2 : -0.3 * s]))), hand], ar, L.detail ? 6 : 3, L.detail)
  if (L.detail) lathe(p, hand[0], hand[1], [[0, hand[2] - 0.12 * s], [0.13 * s, hand[2]], [0, hand[2] + 0.14 * s]], 6)
}

/** An ellipsoid with axes along f (forward), s (side) and z, pitched by `pitch` about s. */
export function blob(p: Part, c: V3, f: V3, s: V3, rf: number, rs: number, rz: number, pitch: number, seg: number, rings: number) {
  const fu = add(mul(f, Math.cos(pitch)), [0, 0, Math.sin(pitch)])
  const zu = add(mul(f, -Math.sin(pitch)), [0, 0, Math.cos(pitch)])
  const grid: V3[][] = []
  for (let k = 0; k <= rings; k++) {
    const ph = -Math.PI / 2 + (k / rings) * Math.PI
    grid.push(Array.from({ length: seg }, (_, i) => {
      const th = (i / seg) * TAU
      return add(c, add(add(mul(s, rs * Math.cos(ph) * Math.cos(th)), mul(zu, rz * Math.cos(ph) * Math.sin(th))), mul(fu, rf * Math.sin(ph))))
    }))
  }
  // rings run back-to-front along fu; corners turn from s to zu: outward when s x zu = fu... decide by the first face
  const a = grid[1][0], b = grid[1][1], d = grid[2][0]
  const nrm = cross(sub(b, a), sub(d, a)), out = sub(a, c)
  loftSmooth(p, grid, true, dot(nrm, out) < 0)
}

/**
 * Schnirch's triga: three horses abreast rearing, a two-wheeled chariot and
 * a winged Victory driving, on a plinth. b the plinth's centre on the pylon
 * top, f the way the horses face.
 */
function triga(out: Part, b: V3, f: V3, L: Lod, k = 1) {
  const p = new Part()
  const s: V3 = [-f[1], f[0], 0]
  const seg = L.detail ? 12 : 5, rings = L.detail ? 7 : 3
  const at = (x: number, y: number, z: number): V3 => add(add(add(b, mul(f, x)), mul(s, y)), [0, 0, z])
  box(p, at(0, 0, 0.45), s, [0, 0, 1], f, 1.7, 0.45, -2.4, 2.4, false)
  const top = 0.9
  for (const y of [-1.0, 0, 1.0]) {
    const lift = y === 0 ? 0.15 : 0
    // body, pitched up as it rears
    blob(p, at(0.6, y, top + 1.75 + lift), f, s, 1.15, 0.36, 0.48, 0.42, seg, rings)
    // neck and head
    tube(p, [at(1.35, y, top + 2.3 + lift), at(1.75, y, top + 3.0 + lift), at(1.95, y, top + 3.35 + lift)], (i) => [0.3, 0.24, 0.2][i], L.detail ? 8 : 4, L.detail)
    blob(p, at(2.15, y, top + 3.2 + lift), f, s, 0.38, 0.15, 0.17, -0.6, seg, rings)
    // forelegs raised and bent, hind legs planted, tail
    for (const sy of [-0.17, 0.17]) {
      tube(p, [at(1.2, y + sy, top + 1.9 + lift), at(1.75, y + sy, top + 1.55 + lift), at(1.65, y + sy, top + 1.0 + lift)], 0.1, L.detail ? 6 : 3, L.detail)
      tube(p, [at(-0.15, y + sy, top + 1.3 + lift), at(-0.35, y + sy, top + 0.55), at(-0.2, y + sy, top + 0.0)], (i) => [0.14, 0.1, 0.1][i], L.detail ? 6 : 3, L.detail)
    }
    if (L.detail) tube(p, [at(-0.4, y, top + 1.45 + lift), at(-0.75, y, top + 0.9), at(-0.8, y, top + 0.4)], 0.09, 5)
  }
  // the chariot behind: a rounded box on a pair of wheels
  box(p, at(-1.6, 0, top + 1.0), s, [0, 0, 1], f, 0.8, 0.45, -0.6, 0.6, true)
  for (const y of [-0.95, 0.95]) {
    const ws = L.detail ? 14 : 6
    const ring = Array.from({ length: ws }, (_, i) => add(at(-1.6, y, top + 0.6), add(mul(f, 0.6 * Math.cos((i / ws) * TAU)), [0, 0, 0.6 * Math.sin((i / ws) * TAU)])))
    const ring2 = ring.map((q) => add(q, mul(s, y > 0 ? 0.12 : -0.12)))
    loftSmooth(p, y > 0 ? [ring, ring2] : [ring2, ring], true)
    const ctr = at(-1.6, y + (y > 0 ? 0.12 : -0.12), top + 0.6)
    for (let i = 0; i < ws; i++) triN(p, ctr, ring2[i], ring2[(i + 1) % ws], mul(s, y > 0 ? 1 : -1))
  }
  // Victory: robe, torso, head, arms forward to the reins, wings up and back
  const v0 = at(-1.6, 0, top + 1.4)
  lathe(p, v0[0], v0[1], [[0.42, v0[2]], [0.3, v0[2] + 1.0], [0.34, v0[2] + 1.5], [0.18, v0[2] + 1.7], [0, v0[2] + 1.72]], seg)
  lathe(p, v0[0], v0[1], [[0, v0[2] + 1.72], [0.17, v0[2] + 1.85], [0.14, v0[2] + 2.05], [0, v0[2] + 2.12]], seg)
  for (const sy of [-1, 1]) {
    tube(p, [at(-1.6, 0.28 * sy, top + 3.0), at(-1.1, 0.35 * sy, top + 3.1), at(-0.6, 0.3 * sy, top + 3.45)], 0.07, L.detail ? 6 : 3, L.detail)
    // a wing: a curved feathered sheet, root at the shoulder, tip up and back
    const root = at(-1.75, 0.15 * sy, top + 2.9)
    const span = L.detail ? 6 : 3
    const lead: V3[] = [], trail: V3[] = []
    for (let i = 0; i <= span; i++) {
      const t = i / span
      lead.push(add(root, add(mul(f, -0.3 - 0.9 * t), add(mul(s, sy * (0.25 + 0.75 * t)), [0, 0, 0.3 + 1.6 * t - 0.4 * t * t]))))
      trail.push(add(root, add(mul(f, -0.6 - 1.2 * t), add(mul(s, sy * (0.1 + 0.55 * t)), [0, 0, -0.5 + 1.2 * t]))))
    }
    for (let i = 0; i < span; i++) {
      const n = unit(cross(sub(lead[i + 1], lead[i]), sub(trail[i], lead[i])))
      quadN(p, lead[i], lead[i + 1], trail[i + 1], trail[i], n)
      quadN(p, lead[i], trail[i], trail[i + 1], lead[i + 1], mul(n, -1))
    }
  }
  // scale the group about its base (Part stores glTF-frame positions: x, z, -y)
  const g = [b[0], b[2], -b[1]]
  for (let q = 0; q < p.pos.length; q++) out.pos.push(g[q % 3] + (p.pos[q] - g[q % 3]) * k)
  out.nrm.push(...p.nrm)
  out.uv.push(...p.uv)
}

function build(L: Lod): PartList {
  const stone = new Part(), win = new Part(), blue = new Part(), gold = new Part(), roof = new Part(), bronze = new Part()

  // --- the main block ---
  prism(stone, MAIN, 0, CORNICE, roof)
  // plinth and belt course, main cornice and attic, all round the outline (and the annex)
  const bands = (r: XY[], z0: number, z1: number, out: number) => {
    const o = insetPoly(r, -out)
    prism(stone, o, z0, z1, null, stone)
    for (let i = 0; i < r.length; i++) {
      const a = o[i], b = o[(i + 1) % o.length], c = r[(i + 1) % r.length], d = r[i]
      quadN(stone, [a[0], a[1], z1], [b[0], b[1], z1], [c[0], c[1], z1], [d[0], d[1], z1], [0, 0, 1])
    }
  }
  bands(MAIN, 0, 1.2, 0.35)
  bands(MAIN, 8.0, 8.7, 0.45)
  bands(MAIN, CORNICE - 0.9, CORNICE, 0.85)
  // the attic: a balustraded parapet over the cornice
  {
    const o = insetPoly(MAIN, 0.1), i = insetPoly(MAIN, 0.6)
    for (let k = 0; k < MAIN.length; k++) {
      const a = o[k], b = o[(k + 1) % o.length], c = i[(k + 1) % i.length], d = i[k]
      const l = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (l < 0.01) continue
      const n: V3 = [(b[1] - a[1]) / l, -(b[0] - a[0]) / l, 0]
      quadN(stone, [a[0], a[1], CORNICE], [b[0], b[1], CORNICE], [b[0], b[1], ATTIC], [a[0], a[1], ATTIC], n)
      quadN(stone, [a[0], a[1], ATTIC], [b[0], b[1], ATTIC], [c[0], c[1], ATTIC], [d[0], d[1], ATTIC], [0, 0, 1])
      quadN(stone, [c[0], c[1], CORNICE], [d[0], d[1], CORNICE], [d[0], d[1], ATTIC], [c[0], c[1], ATTIC], mul(n, -1))
    }
  }

  // windows: bays along every long-enough wall
  const isLoggiaFront = (a: XY, b: XY) => a[1] > 44.5 && b[1] > 44.5 && Math.min(a[0], b[0]) > -18.5 && Math.max(a[0], b[0]) < 7
  const isAnnex = (a: XY, b: XY) => a[0] < -22.5 && b[0] < -22.5 && Math.min(a[1], b[1]) > 25 && Math.max(a[1], b[1]) < 38.5
  for (let i = 0; i < MAIN.length; i++) {
    const a = MAIN[i], b = MAIN[(i + 1) % MAIN.length]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (len < 3.2 || isLoggiaFront(a, b)) continue
    const u: V3 = [(b[0] - a[0]) / len, (b[1] - a[1]) / len, 0], w: V3 = [u[1], -u[0], 0]
    const n = Math.max(1, Math.round(len / 3.7)), bay = len / n
    for (let k = 0; k < n; k++) {
      const s = (k + 0.5) * bay
      const c = (z: number): V3 => [a[0] + u[0] * s, a[1] + u[1] * s, z]
      // ground floor: the arcade (and the annex's wall keeps its own)
      if (!isAnnex(a, b)) archPanel(win, c(5.6), u, w, Math.min(1.25, bay * 0.33), 4.4, 0.05, L.detail ? 8 : 3)
      // piano nobile, with a hood over it
      pane(win, c(12.0), u, w, Math.min(0.85, bay * 0.24), 2.2)
      if (L.detail) box(stone, c(14.6), u, [0, 0, 1], w, Math.min(1.15, bay * 0.31), 0.22, -0.05, 0.3)
      // the upper storey and the oculus in the frieze
      pane(win, c(17.6), u, w, Math.min(0.7, bay * 0.2), 1.25)
      if (L.detail) {
        const oc = c(20.2), rr = 0.42, m = 10
        const ring = Array.from({ length: m }, (_, q) => add(add(oc, mul(u, rr * 1.25 * Math.cos((q / m) * TAU))), add([0, 0, rr * Math.sin((q / m) * TAU)], mul(w, 0.05))))
        const cc = add(oc, mul(w, 0.05))
        for (let q = 0; q < m; q++) triN(win, cc, ring[q], ring[(q + 1) % m], w)
        // pilasters between the bays, over the belt course
        if (k > 0) box(stone, [a[0] + u[0] * k * bay, a[1] + u[1] * k * bay, 14.3], u, [0, 0, 1], w, 0.32, 5.6, -0.05, 0.22)
        // the balcony balustrade under the piano nobile
        box(stone, c(9.3), u, [0, 0, 1], w, Math.min(1.1, bay * 0.3), 0.5, -0.05, 0.35)
      }
    }
  }

  // --- the low annex on the river side ---
  prism(stone, ANNEX, 0, 9, roof)
  bands(ANNEX, 8.2, 9.0, 0.3)
  for (let i = 0; i < ANNEX.length; i++) {
    const a = ANNEX[i], b = ANNEX[(i + 1) % ANNEX.length]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (len < 4) continue
    const u: V3 = [(b[0] - a[0]) / len, (b[1] - a[1]) / len, 0], w: V3 = [u[1], -u[0], 0]
    const n = Math.round(len / 3.6)
    for (let k = 0; k < n; k++) {
      const s = ((k + 0.5) * len) / n
      archPanel(win, [a[0] + u[0] * s, a[1] + u[1] * s, 5.2], u, w, 1.2, 4.2, 0.05, L.detail ? 8 : 3)
    }
  }

  // --- the loggia on Národní ---
  {
    const A = LOGGIA.a, B = LOGGIA.b
    const len = Math.hypot(B[0] - A[0], B[1] - A[1])
    const u: V3 = [(B[0] - A[0]) / len, (B[1] - A[1]) / len, 0], w: V3 = [-u[1], u[0], 0] // w: north, out
    const W = (s: number, t: number, z: number): V3 => [A[0] + u[0] * s + w[0] * t, A[1] + u[1] * s + w[1] * t, z]
    const D = LOGGIA.depth
    const quad = (s0: number, s1: number, t0: number, t1: number): XY[] => [W(s0, t0, 0), W(s1, t0, 0), W(s1, t1, 0), W(s0, t1, 0)].map((p) => [p[0], p[1]] as XY).reverse() as XY[]
    const ccw = (r: XY[]) => {
      const area = r.reduce((acc, p, i) => { const q = r[(i + 1) % r.length]; return acc + p[0] * q[1] - q[0] * p[1] }, 0)
      return area >= 0 ? r : [...r].reverse()
    }
    // ground storey: a solid block with five arches; the loggia's floor over it
    prism(stone, ccw(quad(0, len, 0, D)), 0, 8.7, stone)
    // the loggia's back wall, set 2.6 m behind the columns
    prism(stone, ccw(quad(0, len, 0, D - 2.6)), 8.7, 19.5, null)
    // entablature, attic
    prism(stone, ccw(quad(-0.2, len + 0.2, -0.2, D + 0.4)), 19.5, CORNICE, stone, stone)
    prism(stone, ccw(quad(0, len, 0, D)), CORNICE, ATTIC, stone)
    const bays = 5, bw = len / bays
    for (let k = 0; k < bays; k++) {
      const sc = (k + 0.5) * bw
      archPanel(win, W(sc, D, 5.4), u, w, 1.5, 4.2, 0.05, L.detail ? 8 : 5)
      // the arched openings in the loggia's back wall
      archPanel(win, W(sc, D - 2.6, 16.0), u, w, 1.4, 6.2, 0.05, L.detail ? 8 : 5)
    }
    // the paired columns at the six divisions
    for (let k = 0; k <= bays; k++) {
      const sk = k * bw
      for (const ds of [-0.55, 0.55]) {
        const s = Math.min(len - 0.5, Math.max(0.5, sk + ds))
        const p = W(s, D - 0.55, 0)
        const r = 0.42
        lathe(stone, p[0], p[1], L.detail
          ? [[0.6, 8.7], [0.6, 9.2], [r, 9.4], [r, 18.6], [0.55, 18.9], [0.62, 19.5]]
          : [[0.5, 8.7], [r, 9.2], [r, 19.5]], L.detail ? 12 : 5)
      }
    }
    // balustrade between the columns
    box(stone, W(len / 2, D - 0.55, 9.2), u, [0, 0, 1], w, len / 2 - 0.4, 0.5, -0.3, 0.3)
    // the eight statues on the attic
    for (let k = 0; k < 8; k++) {
      const s = 1.6 + (k * (len - 3.2)) / 7
      statue(stone, W(s, D - 0.6, ATTIC), w, 3.0, L, k)
    }
  }

  // --- the pylons at the main front's corners, with the trigas ---
  for (const [x0, x1] of [[-25.0, -18.3], [6.6, 12.3]]) {
    const r: XY[] = [[x0, 40.3], [x1, 40.3], [x1, 45.4], [x0, 45.2]]
    prism(stone, r, ATTIC, 25.2, stone)
    prism(stone, insetPoly(r, -0.3), 25.2, 25.7, stone, stone)
    triga(bronze, [(x0 + x1) / 2, 42.8, 25.7], [1, 0, 0], L, 1.3)
  }

  // statues over the long fronts: pairs at the pavilions
  const groups: [XY, XY][] = [[[-19.6, 15.0], [-1, 0.2]], [[-12.2, -15.0], [-1, -0.25]], [[17.4, 10.0], [1, 0.1]], [[18.4, -18.0], [1, 0.02]], [[-22.4, 30.0], [-1, 0.12]]]
  groups.forEach(([p, f], gi) => {
    const fu = unit([f[0], f[1], 0])
    const side: V3 = [-fu[1], fu[0], 0]
    for (const d of L.detail ? [-1.1, 1.1] : [0]) statue(stone, [p[0] + side[0] * d, p[1] + side[1] * d, ATTIC], fu, 2.8, L, gi + (d > 0 ? 1 : 0))
  })

  // statues standing along the attic of the long fronts, as in Láscar's photo
  for (let i = 0; i < MAIN.length; i++) {
    const a = MAIN[i], b = MAIN[(i + 1) % MAIN.length]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (len < 9 || isLoggiaFront(a, b) || Math.min(a[1], b[1]) > 40) continue
    const u: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len], w: V3 = [u[1], -u[0], 0]
    const step = L.detail ? 4.6 : 7.4, n = Math.floor(len / step)
    for (let k = 0; k < n; k++) {
      const s = (len - (n - 1) * step) / 2 + k * step
      statue(stone, [a[0] + u[0] * s - w[0] * 0.35, a[1] + u[1] * s - w[1] * 0.35, ATTIC], w, 3.8, L, k + i)
    }
  }

  // --- roofs over the stage and the south end ---
  hipRoof(roof, STAGE, CORNICE, 31, 5.5)
  hipRoof(roof, SOUTH, CORNICE, 28, 5.0)
  hipRoof(roof, MIDDLE, CORNICE, 29, 2.0)

  // --- the drum, the dome, its gilding, stars and dormers, and the crest ---
  {
    const base = insetPoly(DOME_BASE, 0.4)
    prism(stone, base, CORNICE, DRUM, null)
    // the drum's windows
    for (let i = 0; i < 4; i++) {
      const a = base[i], b = base[(i + 1) % 4]
      const len = Math.hypot(b[0] - a[0], b[1] - a[1])
      const u: V3 = [(b[0] - a[0]) / len, (b[1] - a[1]) / len, 0], w: V3 = [u[1], -u[0], 0]
      const n = Math.round(len / 3.2)
      for (let k = 0; k < n; k++) {
        const s = ((k + 0.5) * len) / n
        pane(win, [a[0] + u[0] * s, a[1] + u[1] * s, 27.3], u, w, 0.6, 0.85)
      }
    }
    // cornice and balustrade on the drum
    const lip = insetPoly(DOME_BASE, -0.2)
    prism(stone, lip, DRUM, DOME0, stone, stone)

    // the dome: four curved faces, each its own grid so the hips stay crisp
    const top = CREST
    const bot = insetPoly(DOME_BASE, -0.3)
    const M = L.detail ? 14 : 7, K = L.detail ? 10 : 5
    const surf = (f: number, sv: number, ph: number): V3 => {
      const j = (f + 1) % 4
      const t = 1 - Math.cos(ph)
      const B0 = bot[f], B1 = bot[j], T0 = top[f], T1 = top[j]
      const x = lerp(lerp(B0[0], B1[0], sv), lerp(T0[0], T1[0], sv), t)
      const y = lerp(lerp(B0[1], B1[1], sv), lerp(T0[1], T1[1], sv), t)
      return [x, y, DOME0 + (DOME1 - DOME0) * Math.sin(ph)]
    }
    const normalAt = (f: number, sv: number, ph: number): V3 => {
      const e = 1e-3
      const a = sub(surf(f, Math.min(1, sv + e), ph), surf(f, Math.max(0, sv - e), ph))
      const b = sub(surf(f, sv, Math.min(Math.PI / 2, ph + e)), surf(f, sv, Math.max(0, ph - e)))
      let n = unit(cross(a, b))
      if (n[2] < 0) n = mul(n, -1)
      return n
    }
    for (let f = 0; f < 4; f++) {
      const rings: V3[][] = []
      for (let k = 0; k <= K; k++) {
        const ph = (k / K) * (Math.PI / 2)
        rings.push(Array.from({ length: M + 1 }, (_, i) => surf(f, i / M, ph)))
      }
      loftSmooth(blue, rings, false)
      // gilded hip and the gilded edge at the dome's foot
      const hip = Array.from({ length: K + 1 }, (_, k) => add(surf(f, 0, (k / K) * (Math.PI / 2)), [0, 0, 0.12]))
      tube(gold, hip, 0.24, L.detail ? 6 : 4, false)
      tube(gold, [add(surf(f, 0, 0), [0, 0, 0.1]), add(surf(f, 1, 0), [0, 0, 0.1])], 0.2, 4, false)
      // stars, in rows up the face
      const faceLen = Math.hypot(bot[(f + 1) % 4][0] - bot[f][0], bot[(f + 1) % 4][1] - bot[f][1])
      const rows = L.detail ? 11 : 0
      for (let r = 0; r < rows; r++) {
        const ph = ((r + 0.7) / (rows + 0.4)) * (Math.PI / 2) * 0.92
        const sp = 1.45
        const n = Math.max(2, Math.round((faceLen * (1 - 0.3 * (1 - Math.cos(ph)))) / sp))
        for (let q = 0; q < n; q++) {
          const sv = (q + 0.5 + (r % 2) * 0.5) / (n + 0.5)
          if (sv > 0.96) continue
          const c = surf(f, sv, ph), nn = normalAt(f, sv, ph)
          star(gold, add(c, mul(nn, 0.06)), nn, 0.26, 0.3 * f)
        }
      }
      // dormers: aedicules with an oval light, on the lower slope
      const nd = faceLen > 30 ? 4 : 2
      for (let d = 0; d < nd; d++) {
        const sv = (d + 0.5) / nd
        const c = surf(f, sv, 0.32)
        const nn = normalAt(f, sv, 0.32)
        const out: V3 = unit([nn[0], nn[1], 0])
        const u: V3 = [-out[1], out[0], 0]
        box(stone, add(c, [0, 0, 0.6]), u, [0, 0, 1], out, 0.9, 1.25, -1.2, 0.35, false)
        const oc = add(c, add([0, 0, 0.6], mul(out, 0.37)))
        const m = L.detail ? 12 : 6
        const ring = Array.from({ length: m }, (_, q) => add(oc, add(mul(u, 0.45 * Math.cos((q / m) * TAU)), [0, 0, 0.62 * Math.sin((q / m) * TAU)])))
        for (let q = 0; q < m; q++) triN(win, oc, ring[q], ring[(q + 1) % m], out)
        if (L.detail) {
          const g = Array.from({ length: m + 1 }, (_, q) => add(oc, add(mul(u, 0.55 * Math.cos((q / m) * TAU)), add([0, 0, 0.74 * Math.sin((q / m) * TAU)], mul(out, 0.03)))))
          tube(gold, g, 0.07, 4, false)
          lathe(gold, c[0], c[1], [[0.25, c[2] + 1.85], [0.0, c[2] + 2.5]], 6)
        }
      }
    }
    // the crest: a flat top, a gilded railing and gilded spires
    for (const [i, j, k] of triangulate(top)) triN(blue, [top[i][0], top[i][1], DOME1], [top[j][0], top[j][1], DOME1], [top[k][0], top[k][1], DOME1], [0, 0, 1])
    const rail = top.map(([x, y]) => [x, y] as XY)
    for (let i = 0; i < 4; i++) {
      const a = rail[i], b = rail[(i + 1) % 4]
      const len = Math.hypot(b[0] - a[0], b[1] - a[1])
      const u: V3 = [(b[0] - a[0]) / len, (b[1] - a[1]) / len, 0], w: V3 = [u[1], -u[0], 0]
      // the railing as an open band: a base rail, a top rail and posts with a ring between each
      tube(gold, [[a[0], a[1], DOME1 + 0.25], [b[0], b[1], DOME1 + 0.25]], 0.14, 4, false)
      tube(gold, [[a[0], a[1], DOME1 + 1.5], [b[0], b[1], DOME1 + 1.5]], 0.12, 4, false)
      const n = Math.round(len / (L.detail ? 0.9 : 3.5))
      for (let k = 0; k <= n; k++) {
        const p: XY = [a[0] + u[0] * (len * k) / n, a[1] + u[1] * (len * k) / n]
        rod(gold, [p[0], p[1], DOME1], [p[0], p[1], DOME1 + 1.5], 0.07, 4, false)
        if (L.detail && k < n) {
          const q: V3 = [p[0] + u[0] * len / n / 2, p[1] + u[1] * len / n / 2, DOME1 + 0.9]
          const ring = Array.from({ length: 9 }, (_, m) => add(q, add(mul(u, 0.3 * Math.cos((m / 8) * TAU)), [0, 0, 0.3 * Math.sin((m / 8) * TAU)])))
          tube(gold, ring, 0.05, 3, false)
        }
      }
      void w
      // a spire at each corner, and one midway on the long sides
      const spire = (p: XY, h: number) => lathe(gold, p[0], p[1], [[0.32, DOME1], [0.32, DOME1 + 1.2], [0.18, DOME1 + 1.5], [0.22, DOME1 + 1.8], [0.08, DOME1 + h], [0, DOME1 + h + 0.01]], L.detail ? 8 : 5)
      spire(a, 4.6)
      if (len > 20) spire([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], 3.4)
    }
  }

  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.35 : p[2] < 32 ? 0.85 : 0.4)
  return [
    { part: stone, material: { ...finish('theatre-sandstone', 0xa98a63), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: blue, material: { ...finish('theatre-dome-blue', 0x23304a), floodlight: () => 0.15 } },
    { part: gold, material: { ...finish('theatre-gold', 0xd6ae4f, 0.45), floodlight: () => 0.7 } },
    { part: roof, material: PALETTE.copper },
    { part: bronze, material: { ...finish('theatre-bronze', 0x5f7268), floodlight: () => 0.6 } },
  ]
}
void jitter; void TAU

if (import.meta.main) {
  await saveLods('prague-national-theatre', 'National Theatre', build({ detail: false }), build({ detail: true }), {
    anchor: [50.08086, 14.41357], bearing: 0, height: 42.1,
  })
}
