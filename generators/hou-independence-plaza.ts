/**
 * Independence Plaza, Space Center Houston: NASA 905, the Boeing 747-100
 * Shuttle Carrier Aircraft, with the shuttle replica Independence mounted
 * on its back, and the seven-storey access tower beside its nose.
 * Procedural, CC0-1.0, no textures.
 *   bun generators/hou-independence-plaza.ts
 *
 * Map frame: x right, y forward, z up, metres. Placed at bearing 187.3:
 * the model's +y is the aircraft's nose, which points 7.3 degrees west of
 * south, so +x is the aircraft's right (starboard) wing, toward the west,
 * where the tower stands. Anchor (-95.097210, 29.552121): the centroid of
 * OSM way/894077621 moved 0.9 m onto the fuselage axis as the lidar shows
 * it (the OSM outline sits about 0.9 m to starboard of the lidar returns,
 * an imagery offset).
 *
 * The aircraft stands on its own landing gear on the plaza (opened 2014).
 * The tower is not mapped in OSM.
 *
 * Evidence
 * - OSM way/894077621 (building=museum, "Shuttle Carrier Aircraft",
 *   aircraft:type Boeing 747), a traced plan of the whole aircraft: length
 *   70.6 m and span 59.4 m, as published; the wing, tailplane and engine
 *   pylon positions here are read from it. way/894077622 (layer 2, "Shuttle
 *   Independence"): the orbiter's plan, 35.4 m long and 23.7 m across.
 * - Lidar: USGS 3DEP TX_Coastal_B1_2018 (flown 2018), 0.5 m grid in
 *   work/hou-independence-plaza/lidar.json. Heights above the plaza (2.9 m
 *   above the grid's ground_min, which is a ditch to the north-east):
 *   747 fuselage top 9.1 m aft (upper-deck hump 9.9 m in lidar, but
 *   drawn 11.4 m from photos, see the upper deck below), fin tip 19.1 m;
 *   tailplane 7.9-8.1 m; wing top 5.0 m at the root, 6.0 m at the tips;
 *   nacelle tops 4.8 m inboard; orbiter fuselage top 16.4 m, crew cabin
 *   16.6 m, nose 14 m at 2 m from its tip, orbiter wing top 11.2-12.4 m,
 *   OMS pods 17.0-17.4 m, orbiter fin tip 24.0 m (the model's highest
 *   point), fin tip chord y -7.5 to -10; tower 15 x 12 m, parapet 20.8 m,
 *   roof 19.4 m, rooftop box 22.2 m.
 * - Published: Boeing 747-100 length 70.6 m, span 59.6 m, height 19.3 m,
 *   fuselage 6.5 m wide, tailplane span 22.2 m, inboard and outboard engines
 *   at 11.9 and 21.0 m from the centreline (also OSM's pylons); orbiter
 *   length 37.2 m, span 23.8 m, fin 45 degree sweep (Wikipedia, "Boeing 747",
 *   "Space Shuttle orbiter", "Shuttle Carrier Aircraft").
 * - NAIP (USDA, public domain): the plan of the aircraft and of the tower
 *   at the starboard side of the nose.
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   q1 "Independence Space Shuttle on Boeing 747 - Johnson Space Center -
 *      Houston - Texas - USA (20201977469).jpg", Adam Jones, CC BY-SA 2.0
 *      (port side, tower behind)
 *   q4 "Shuttle Independence and NASA 905 at Space Center Houston.jpg",
 *      Romain2k, CC BY-SA 4.0 (port bow, tower's open frame)
 *   q7 "Space Center Houston March 2022 01 (Space Shuttle replica
 *      Independence and Shuttle Carrier Aircraft 905).jpg", Michael Barera,
 *      CC BY-SA 4.0 (port bow, tower front)
 *   q3 "Space Center Houston Shuttle atop Carrler.jpg", Pi3.124, CC BY-SA 4.0
 *      (port quarter, tailplane endplates)
 *   q2 "Space Shuttle Independence.jpg", Naomi Persephone Amethyst,
 *      CC BY-SA 4.0 (orbiter nose and port side)
 *   q5 "Shuttle Carrier Aircraft N905NA at Space Center Houston.jpg",
 *      DatraxMada, CC BY-SA 4.0 (port side from afar)
 *   p5, p11 "NASA 905 Shuttle Carrier Aircraft Independence Plaza Johnson
 *      Space Center JSC NASA Houston Space City (24627699352).jpg" and
 *      "(24652041651).jpg", Bryan SJS (bryansjs), CC BY-SA 2.0 (port side,
 *      engine, tower)
 *
 * Numbers
 * - Measured (lidar, OSM): as above.
 * - Published: as above.
 * - Estimated: fuselage belly 1.8 m above the plaza (hidden from lidar;
 *   from photos against the 6.5 m width) and so the barrel's 7.3 m depth;
 *   the nose and tail-cone profiles (photos); the cheatline at 5.55-6.55 m (drawn a little broad so it reads);
 *   nacelle size (JT9D: 2.6 m across, 7.5 m long with its plug); the
 *   orbiter's belly 10.8 m (its wing top less its root thickness), so the
 *   1.7 m attach struts; SSME bells 2.3 m across; the tailplane endplate fins
 *   (photos: about 3 m above and 1 m below the tip); the tower's open
 *   frame, landings and glass strip (q4, q7), and its back faces, which no
 *   photo shows, drawn plain.
 * - Left out: windows (the cheatline stands for them), doors, the NASA
 *   logo, lettering, landing-gear detail (drawn as dark blocks), the stairs
 *   and bridges into the aircraft and orbiter, the shade canopies.
 *
 * Night: the tower's glass strip is `window`; the aircraft and orbiter are
 * floodlit from the plaza (a `_FLOODLIGHT` wash on the white).
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

// ------------------------------------------------------------- materials ---
const white = new Part()   // fuselage, orbiter upper surfaces, fins
const blue = new Part()    // the NASA cheatline
const silver = new Part()  // wings, tailplane, nacelles, tower panels
const black = new Part()   // orbiter tiles, gear, tower's open frame
const win = new Part()     // tower glazing

/** A flat triangle or quad, wound to face away from `inside`. */
function polyOut(p: Part, P: V3[], inside: V3) {
  const n = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const c = mul(P.reduce(add, [0, 0, 0] as V3), 1 / P.length)
  const flip = dot(n, sub(c, inside)) < 0
  const Q = flip ? [...P].reverse() : P
  for (let i = 1; i < Q.length - 1; i++) p.tri(Q[0], Q[i], Q[i + 1])
}

/**
 * Loft a grid of rings (rings[i][j]) into a smooth surface. `pick(i, j)`
 * chooses the part for the face between ring i and i+1, points j and j+1
 * (null skips it). Normals come from the grid's neighbours, turned outward
 * from each ring's centre, so the surface shades smooth.
 */
function smoothLoft(rings: V3[][], pick: (i: number, j: number) => Part | null, closed = true) {
  const n = rings.length, m = rings[0].length
  const centre = rings.map((r) => mul(r.reduce(add, [0, 0, 0] as V3), 1 / r.length))
  const N: V3[][] = rings.map((r, i) => r.map((pt, j) => {
    const a = rings[Math.min(i + 1, n - 1)][j], b = rings[Math.max(i - 1, 0)][j]
    const c = r[closed ? (j + 1) % m : Math.min(j + 1, m - 1)], d = r[closed ? (j - 1 + m) % m : Math.max(j - 1, 0)]
    let nn = unit(cross(sub(a, b), sub(c, d)))
    if (dot(nn, sub(pt, centre[i])) < 0) nn = mul(nn, -1)
    if (Math.hypot(...sub(pt, centre[i])) < 1e-6) nn = unit(sub(a, b)) // a collapsed tip
    return nn
  }))
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < (closed ? m : m - 1); j++) {
      const part = pick(i, j)
      if (!part) continue
      const k = (j + 1) % m
      const q = [rings[i][j], rings[i][k], rings[i + 1][k], rings[i + 1][j]]
      const qn = [N[i][j], N[i][k], N[i + 1][k], N[i + 1][j]]
      const degenerate = (u: V3, v: V3) => Math.hypot(...sub(u, v)) < 1e-6
      if (!degenerate(q[0], q[1])) part.tri(q[0], q[1], q[2], undefined, undefined, undefined, [qn[0], qn[1], qn[2]])
      if (!degenerate(q[2], q[3])) part.tri(q[0], q[2], q[3], undefined, undefined, undefined, [qn[0], qn[2], qn[3]])
    }
  }
}

/** Fan-cap a ring about its centre, facing `dir`. */
function capRing(p: Part, ring: V3[], dir: V3) {
  const c = mul(ring.reduce(add, [0, 0, 0] as V3), 1 / ring.length)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const n = cross(sub(a, c), sub(b, c))
    if (dot(n, dir) >= 0) p.tri(c, a, b)
    else p.tri(c, b, a)
  }
}

// --------------------------------------------------------------- fuselage ---
/**
 * A fuselage section at station y: width w, belly zb, crown zt, and the
 * z levels (absolute) at which the ring carries extra points on each side,
 * so materials can change there. The section is a superellipse, boxy like
 * the 747's and the orbiter's.
 */
type Section = { y: number; w: number; zb: number; zt: number; x0?: number }
function ring(s: Section, levels: number[], ex = 2.6): V3[] {
  const zc = (s.zb + s.zt) / 2, hh = (s.zt - s.zb) / 2, x0 = s.x0 ?? 0
  const half = (t: number) => (s.w / 2) * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(t), ex)), 1 / ex)
  const right: V3[] = levels.map((z) => {
    const t = clamp((z - zc) / (hh || 1), -0.999, 0.999)
    return [x0 + half(t), s.y, zc + t * hh]
  })
  // counter-clockwise seen from the nose (+y): bottom, right side up, top, left side down
  const left = [...right].reverse().map(([x, y, z]) => [2 * x0 - x, y, z] as V3)
  return [[x0, s.y, s.zb], ...right, [x0, s.y, s.zt], ...left]
}
/** Interpolate a section table at y. */
function sectionAt(tab: Section[], y: number): Section {
  for (let i = 0; i < tab.length - 1; i++) {
    const a = tab[i], b = tab[i + 1]
    if ((y - a.y) * (y - b.y) <= 0) {
      const t = (y - a.y) / (b.y - a.y || 1)
      return { y, w: lerp(a.w, b.w, t), zb: lerp(a.zb, b.zb, t), zt: lerp(a.zt, b.zt, t) }
    }
  }
  return tab[tab.length - 1]
}

// The 747's sections, tail (y -33.5) to nose (y 37.1). Crown from lidar; blunt rounded nose (q4);
// belly, nose and tail-cone profiles from photos.
const SCA: Section[] = [
  { y: -33.5, w: 0.5, zb: 7.0, zt: 7.4 },
  { y: -32.5, w: 1.6, zb: 6.7, zt: 7.7 },
  { y: -30.5, w: 3.0, zb: 6.2, zt: 8.1 },
  { y: -27.5, w: 4.4, zb: 5.3, zt: 8.6 },
  { y: -24, w: 5.4, zb: 4.3, zt: 8.95 },
  { y: -20, w: 6.1, zb: 3.2, zt: 9.1 },
  { y: -16, w: 6.45, zb: 2.25, zt: 9.1 },
  { y: -12, w: 6.5, zb: 1.85, zt: 9.1 },
  { y: 0, w: 6.5, zb: 1.8, zt: 9.1 },
  { y: 30, w: 6.5, zb: 1.8, zt: 9.1 },
  { y: 32, w: 6.35, zb: 1.9, zt: 9.0 },
  { y: 33.8, w: 6.0, zb: 2.1, zt: 8.7 },
  { y: 35.2, w: 5.5, zb: 2.45, zt: 8.1 },
  { y: 36.15, w: 4.6, zb: 2.95, zt: 7.25 },
  { y: 36.7, w: 3.4, zb: 3.45, zt: 6.45 },
  { y: 36.95, w: 1.8, zb: 4.05, zt: 5.65 },
  { y: 37.1, w: 0.0, zb: 4.8, zt: 4.9 },
]
const CHEAT_LO = 5.55, CHEAT_HI = 6.55
{
  const ys = [-33.5, -32.5, -30.5, -27.5, -24, -20, -16, -12, -6, 0, 6, 12, 20, 30, 32, 33.8, 35.2, 36.15, 36.7, 36.95, 37.1]
  const rings = ys.map((y) => {
    const s = sectionAt(SCA, y)
    const zc = (s.zb + s.zt) / 2, hh = (s.zt - s.zb) / 2
    const lv = (t: number) => zc + t * hh
    // The cheatline holds its height; where the section is too small for
    // it (the tail cone) it closes up to nothing.
    const lo = clamp(CHEAT_LO, lv(-0.35), lv(0.6)), hi = clamp(CHEAT_HI, lo, lv(0.7))
    return ring(s, [lv(-0.85), lv(-0.6), lv(-0.35), lo, hi, lv(0.72), lv(0.9)])
  })
  // ring: 0 bottom, 1..7 right, 8 top, 9..15 left. Bands 3-4 and 11-12 are
  // the cheatline (right lo->hi and left hi->lo).
  smoothLoft(rings, (_i, j) => (j === 4 || j === 11 ? blue : white))
  capRing(white, rings[0], [0, -1, 0])
}
// The upper deck: a narrower lobe riding on the barrel from the nose back
// to the wing's leading edge, its crown 2.3 m above the barrel's (photo-
// scaled from q1/q4 and 747-100 profile drawings; the 2018 lidar reads only
// 0.8 m, likely smoothing a 0.5 m grid over the lobe's rounded top). Its
// lower half stays hidden inside the barrel. The windscreen is a dark band.
{
  const LOBE: Section[] = [
    { y: 11.5, w: 3.0, zb: 7.2, zt: 9.0 },
    { y: 14.5, w: 4.4, zb: 6.9, zt: 9.9 },
    { y: 17.5, w: 4.9, zb: 6.8, zt: 10.9 },
    { y: 20.5, w: 5.0, zb: 6.8, zt: 11.35 },
    { y: 29, w: 5.0, zb: 6.8, zt: 11.4 },
    { y: 31.5, w: 4.9, zb: 6.8, zt: 11.2 },
    { y: 33.2, w: 4.6, zb: 6.7, zt: 10.6 },
    { y: 34.3, w: 4.2, zb: 6.6, zt: 9.6 },
    { y: 35.4, w: 3.4, zb: 6.4, zt: 8.5 },
    { y: 35.95, w: 2.0, zb: 6.3, zt: 7.4 },
  ]
  const rings = LOBE.map((s) => {
    const zc = (s.zb + s.zt) / 2, hh = (s.zt - s.zb) / 2, lv = (t: number) => zc + t * hh
    return ring(s, [lv(-0.85), lv(-0.6), lv(-0.3), lv(0), lv(0.3), lv(0.6), lv(0.85)])
  })
  // windscreen: the upper side bands between y 33.2 and 34.3
  smoothLoft(rings, (i, j) => (i === 6 && (j === 5 || j === 6 || j === 9 || j === 10) ? black : white))
  capRing(white, rings[0], [0, -1, 0])
  capRing(white, rings[rings.length - 1], [0, 1, 0])
}

// ------------------------------------------------------------ lifting surfaces ---
/**
 * A wing-like surface lofted through stations. Each station is a leading-
 * edge point, a trailing-edge point, a thickness and the surface's "up".
 * The profile is a six-point section. `pick(face)` picks the material for
 * each of the six faces round the profile (0: leading edge top, 1-2: top,
 * 3-4: bottom, 5: leading edge bottom). The far end is capped.
 */
type Station = { le: V3; te: V3; t: number; up: V3 }
const PROFILE: [number, number][] = [[0, 0], [0.12, 0.42], [0.5, 0.5], [1, 0], [0.5, -0.42], [0.12, -0.36]]
function surface(st: Station[], pick: (face: number) => Part, mirror = false, capStart = false) {
  const M = (p: V3): V3 => (mirror ? [-p[0], p[1], p[2]] : p)
  const rings = st.map(({ le, te, t, up }) => PROFILE.map(([f, h]) => M(add(add(le, mul(sub(te, le), f)), mul(up, h * t)))))
  for (let i = 0; i < rings.length - 1; i++) {
    const inside = mul(add(rings[i].reduce(add, [0, 0, 0] as V3), rings[i + 1].reduce(add, [0, 0, 0] as V3)), 1 / 12)
    for (let j = 0; j < 6; j++) {
      const k = (j + 1) % 6
      polyOut(pick(j), [rings[i][j], rings[i][k], rings[i + 1][k], rings[i + 1][j]], inside)
    }
  }
  const last = rings[rings.length - 1], prev = rings[rings.length - 2]
  const inner = mul(prev.reduce(add, [0, 0, 0] as V3), 1 / 6)
  polyOut(pick(2), last.slice(0, 4), inner)
  polyOut(pick(4), [last[3], last[4], last[5], last[0]], inner)
  if (capStart) {
    const first = rings[0], inner2 = mul(rings[1].reduce(add, [0, 0, 0] as V3), 1 / 6)
    polyOut(pick(2), first.slice(0, 4), inner2)
    polyOut(pick(4), [first[3], first[4], first[5], first[0]], inner2)
  }
}
const UP: V3 = [0, 0, 1]

// 747 wing, from OSM's plan (moved onto the lidar axis): root chord from
// y 15.6 to 0.6, the trailing-edge kink at x 12.6, tips at x 29.6.
// Heights from lidar: top 5.0 at the root, 5.4 at the kink, 6.05 at the tip.
const leY = (x: number) => 15.6 - 0.852 * (x - 3.3)
for (const m of [false, true]) {
  surface([
    { le: [2.6, leY(2.6), 4.15], te: [2.6, 0.7, 4.1], t: 1.7, up: UP },
    { le: [12.6, leY(12.6), 4.85], te: [12.6, -0.9, 4.8], t: 1.05, up: UP },
    { le: [29.6, leY(29.6), 5.9], te: [29.6, -10.8, 5.9], t: 0.35, up: UP },
  ], () => silver, m)
}

// Tailplane (span 22.2 m) on the tail cone, with 7 degree dihedral, and the
// SCA's endplate fins at its tips.
for (const m of [false, true]) {
  surface([
    { le: [1.0, -20.9, 7.7], te: [1.0, -31.2, 7.7], t: 0.85, up: UP },
    { le: [11.1, -30.0, 8.6], te: [11.1, -32.6, 8.6], t: 0.3, up: UP },
  ], () => silver, m)
  // endplate: a swept vertical fin through the tip, 3 m up and 1 m down
  const s = m ? -1 : 1, side: V3 = [s, 0, 0]
  surface([
    { le: [s * 11.15, -30.1, 7.4], te: [s * 11.15, -32.9, 7.4], t: 0.35, up: side },
    { le: [s * 11.15, -31.6, 11.4], te: [s * 11.15, -33.6, 11.4], t: 0.25, up: side },
  ], () => white, false, true)
}

// Fin: root on the tail cone from y -17.6 to -32, tip at 19.4 m
// (published 19.3 m; lidar 19.1 m on its sparse returns).
surface([
  { le: [0, -17.6, 8.6], te: [0, -32.6, 8.0], t: 1.1, up: [1, 0, 0] },
  { le: [0, -23.0, 12.5], te: [0, -32.9, 12.5], t: 0.8, up: [1, 0, 0] },
  { le: [0, -29.2, 19.4], te: [0, -33.1, 19.4], t: 0.4, up: [1, 0, 0] },
], () => white)

// ---------------------------------------------------------------- engines ---
/**
 * A JT9D nacelle on its pylon: a lathe about a fore-aft axis, intake at
 * `front`, its dark fan face set in, the fan cowl, the core cowl and plug.
 */
function nacelle(cx: number, front: number, cz: number, wingZ: number) {
  const K = 14
  const prof: [number, number][] = [ // [r, y back from the front]
    [1.05, 0], [1.28, 0.25], [1.32, 1.4], [1.25, 3.6], [1.05, 4.3], // fan cowl
    [0.85, 4.35], [0.82, 5.8], [0.55, 6.6], // core cowl
    [0.4, 6.65], [0.0, 7.6], // plug
  ]
  const rings = prof.map(([r, d]) => Array.from({ length: K }, (_, k) => {
    const a = (k / K) * Math.PI * 2
    return [cx + r * Math.cos(a), front - d, cz + r * Math.sin(a)] as V3
  }))
  smoothLoft(rings, (i) => (i < 4 ? silver : i < 7 ? white : black))
  // the fan face, set 0.4 m into the intake
  const fan = rings[0].map(([x, y, z]) => [x, y - 0.4, z] as V3)
  smoothLoft([rings[0], fan], () => black)
  capRing(black, fan, [0, 1, 0])
  // pylon: a thin blade from the cowl top up into the wing
  const top = cz + 1.2
  polyBox(silver, cx, front - 4.6, front - 0.6, top - 0.1, wingZ, 0.32)
}
/** A thin fore-aft blade box: x ± hw, y from y0 to y1, z0..z1. */
function polyBox(p: Part, cx: number, y0: number, y1: number, z0: number, z1: number, hw: number) {
  box(p, [cx - hw, y0, z0], [cx + hw, y1, z1])
}
/** An axis-aligned box. */
function box(p: Part, a: V3, b: V3, skipBottom = true) {
  const [x0, y0, z0] = a, [x1, y1, z1] = b
  const c: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]
  const faces: V3[][] = [
    [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]],
    [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]],
    [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]],
    [[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]],
    [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]],
  ]
  if (!skipBottom) faces.push([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]])
  for (const f of faces) polyOut(p, f, c)
}
// Inboard at 11.9 m, outboard at 21.0 m (published; OSM's pylons agree).
// Intakes 2.0 m ahead of the leading edge; the outboard pair sits higher
// with the wing's dihedral.
for (const s of [1, -1]) {
  nacelle(s * 11.9, leY(11.9) + 4.6, 3.5, 4.4)
  nacelle(s * 21.0, leY(21.0) + 4.4, 4.05, 4.95)
}

// ------------------------------------------------------------ landing gear ---
// Dark blocks for the wheels: the nose gear, two body gears and two wing
// gears (four-wheel trucks), each on a short leg.
function gear(cx: number, cy: number, w: number, l: number, legTop: number) {
  box(black, [cx - w / 2, cy - l / 2, 0], [cx + w / 2, cy + l / 2, 1.25])
  box(silver, [cx - 0.25, cy - 0.25, 1.25], [cx + 0.25, cy + 0.25, legTop])
}
gear(0, 31.0, 1.3, 1.3, 2.4)
for (const s of [1, -1]) {
  gear(s * 1.8, -3.6, 1.6, 2.6, 1.9)
  gear(s * 5.5, 0.6, 1.6, 2.6, 3.9)
}

// ---------------------------------------------------------------- orbiter ---
// Sections from the lidar's crown (16.4 m, cabin 16.6 m, nose falling to
// 14 m) and an estimated 10.8 m belly. Nose tip at y 26.5, aft face at -7.5.
const ORB: Section[] = [
  { y: -7.5, w: 5.4, zb: 10.95, zt: 16.5 },
  { y: -5, w: 5.4, zb: 10.8, zt: 16.45 },
  { y: 8, w: 5.2, zb: 10.8, zt: 16.4 },
  { y: 15.5, w: 5.2, zb: 10.85, zt: 16.45 },
  { y: 18.5, w: 5.0, zb: 10.95, zt: 16.6 },
  { y: 20.5, w: 4.6, zb: 11.1, zt: 16.2 },
  { y: 22.5, w: 4.0, zb: 11.35, zt: 15.1 },
  { y: 24.5, w: 3.0, zb: 11.75, zt: 14.0 },
  { y: 25.8, w: 1.8, zb: 12.15, zt: 13.3 },
  { y: 26.5, w: 0.0, zb: 12.6, zt: 12.65 },
]
{
  const ys = [-7.5, -5, 2, 8, 15.5, 18.5, 20.5, 22.5, 24.5, 25.8, 26.5]
  // The chine: black tiles up to about a third of the side aft, rising to
  // the windows at the nose.
  const chine = (y: number) => (y < 12 ? -0.4 : y < 23 ? lerp(-0.4, 0.15, (y - 12) / 11) : 0.15)
  const rings = ys.map((y) => {
    const s = sectionAt(ORB, y)
    const zc = (s.zb + s.zt) / 2, hh = (s.zt - s.zb) / 2, lv = (t: number) => zc + t * hh
    const c = chine(y)
    return ring(s, [lv(-0.8), lv(-0.6), lv(c), lv(c + 0.15), lv(0.35), lv(0.75), lv(0.92)])
  })
  // Bands: 0-3 and 13-15 below the chine (black); faces of the windscreen
  // (stations 20.5-22.5, upper bands) black; the nose cap black.
  smoothLoft(rings, (i, j) => {
    const y = ys[i]
    if (y >= 24.5) return black
    if (j <= 3 || j >= 12) return black
    if (y >= 20.5 && y < 22.5 && j >= 5 && j <= 10) return black
    return white
  })
  capRing(black, rings[0], [0, -1, 0])
}
// Orbiter wings: double delta from OSM's plan (45 degree main leading edge,
// glove to the chine), black below and along the leading edge.
for (const m of [false, true]) {
  surface([
    { le: [2.5, 16.5, 11.45], te: [2.5, -6.6, 11.45], t: 1.3, up: UP },
    { le: [4.6, 6.5, 11.45], te: [4.6, -6.3, 11.45], t: 1.15, up: UP },
    { le: [10.5, 0.7, 11.7], te: [10.5, -5.1, 11.7], t: 0.55, up: UP },
    { le: [11.9, -1.4, 11.8], te: [11.9, -4.8, 11.8], t: 0.35, up: UP },
  ], (f) => (f === 1 || f === 2 ? white : black), m)
}
// Fin: 45 degree leading edge from the crown at y 0 to the tip at 24.0 m
// (lidar), tip chord y -7.4 to -10.
surface([
  { le: [0, 0.4, 16.2], te: [0, -9.3, 16.2], t: 1.0, up: [1, 0, 0] },
  { le: [0, -7.4, 24.0], te: [0, -10.0, 24.0], t: 0.4, up: [1, 0, 0] },
], (f) => (f === 0 || f === 5 ? black : white))
// OMS pods, either side of the fin: lofted ovals from a point at y 1.0.
for (const s of [1, -1]) {
  const K = 10
  const pod = (y: number, r: number, cz: number) => Array.from({ length: K }, (_, k) => {
    const a = (k / K) * Math.PI * 2
    return [s * 1.9 + r * 1.05 * Math.cos(a), y, cz + r * 0.85 * Math.sin(a)] as V3
  })
  const rings = [pod(1.2, 0.01, 16.0), pod(-0.5, 0.75, 16.15), pod(-2.5, 1.15, 16.25), pod(-7.9, 1.2, 16.25)]
  smoothLoft(rings, () => white)
  capRing(white, rings[3], [0, -1, 0])
}
// SSMEs: three bells (one high, two low) behind the aft face, and the body
// flap under them.
for (const [ex, ez] of [[0, 15.0], [-1.35, 12.9], [1.35, 12.9]] as [number, number][]) {
  const K = 12
  const bell = (y: number, r: number) => Array.from({ length: K }, (_, k) => {
    const a = (k / K) * Math.PI * 2
    return [ex + r * Math.cos(a), y, ez + r * Math.sin(a)] as V3
  })
  const rings = [bell(-7.5, 0.55), bell(-8.4, 0.75), bell(-9.6, 1.05), bell(-10.4, 1.15)]
  smoothLoft(rings, () => black)
  // the inside of the bell, seen from behind
  capRing(black, bell(-10.0, 1.1), [0, -1, 0])
}
box(black, [-2.9, -9.6, 10.95], [2.9, -7.5, 11.5], false)

// Attach struts: one forward, two aft (q4, q9).
box(silver, [-0.3, 15.5, 9.4], [0.3, 16.3, 11.0])
for (const s of [1, -1]) box(silver, [s * 1.6 - 0.3, -5.6, 8.9], [s * 1.6 + 0.3, -4.6, 11.0])

// ------------------------------------------------------------------ tower ---
// 15 x 12 m in plan (lidar), beside the nose to starboard. A closed box of
// pale metal panels (x 9.5-16.5) with a glass strip on its forward face;
// toward the aircraft an open steel frame (dark inside) with landings at
// the 747's upper deck and the orbiter's crew hatch; a solid band across
// the top, 17.4-20.8 m, reaching out over the aircraft to x 2.2.
{
  const Y0 = 14.2, Y1 = 26.0, X1 = 16.5, XB = 9.5, XF = 3.4, XT = 2.2
  const ch = 0.4
  /** A box with chamfered vertical edges. */
  const cbox = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top = true) => {
    const plan: [number, number][] = [
      [x0 + ch, y0], [x1 - ch, y0], [x1, y0 + ch], [x1, y1 - ch], [x1 - ch, y1], [x0 + ch, y1], [x0, y1 - ch], [x0, y0 + ch],
    ]
    const c: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]
    for (let i = 0; i < plan.length; i++) {
      const [ax, ay] = plan[i], [bx, by] = plan[(i + 1) % plan.length]
      polyOut(p, [[ax, ay, z0], [bx, by, z0], [bx, by, z1], [ax, ay, z1]], c)
    }
    if (top) polyOut(p, plan.map(([x, y]) => [x, y, z1] as V3), [c[0], c[1], z1 - 1])
    polyOut(p, plan.map(([x, y]) => [x, y, z0] as V3), [c[0], c[1], z0 + 1])
  }
  // closed box and the top band
  cbox(silver, XB, X1, Y0, Y1, 0, 17.4, false)
  cbox(silver, XT, X1, Y0, Y1, 17.4, 20.8, false)
  // the roof, set 1.4 m below the parapet, and the rooftop box
  const roofZ = 19.4, pIn = 0.5
  polyOut(silver, [[XT + pIn, Y0 + pIn, roofZ], [X1 - pIn, Y0 + pIn, roofZ], [X1 - pIn, Y1 - pIn, roofZ], [XT + pIn, Y1 - pIn, roofZ]], [9, 20, 0])
  for (const [a, b] of [[[XT + pIn, Y0 + pIn], [X1 - pIn, Y0 + pIn]], [[X1 - pIn, Y0 + pIn], [X1 - pIn, Y1 - pIn]], [[X1 - pIn, Y1 - pIn], [XT + pIn, Y1 - pIn]], [[XT + pIn, Y1 - pIn], [XT + pIn, Y0 + pIn]]] as [number, number][][]) {
    polyOut(silver, [[a[0], a[1], roofZ], [b[0], b[1], roofZ], [b[0], b[1], 20.8], [a[0], a[1], 20.8]], [9.4, 20.1, 25])
  }
  {
    // parapet top as a ring between the chamfered outline and the inner edge
    const outer: V3[] = [[XT, Y0, 20.8], [X1, Y0, 20.8], [X1, Y1, 20.8], [XT, Y1, 20.8]]
    const inner: V3[] = [[XT + pIn, Y0 + pIn, 20.8], [X1 - pIn, Y0 + pIn, 20.8], [X1 - pIn, Y1 - pIn, 20.8], [XT + pIn, Y1 - pIn, 20.8]]
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      polyOut(silver, [outer[i], outer[j], inner[j], inner[i]], [9, 20, 0])
    }
  }
  box(silver, [8.6, 18.2, roofZ], [12.6, 21.2, 22.2])
  // underside of the top band where it overhangs the open frame
  polyOut(silver, [[XT, Y0, 17.4], [XB, Y0, 17.4], [XB, Y1, 17.4], [XT, Y1, 17.4]], [6, 20, 19])
  // the open frame: a dark core set back, corner columns, landings
  box(black, [XF + 1.6, Y0 + 0.9, 0], [XB, Y1 - 0.9, 17.4])
  for (const y of [Y0 + 0.35, Y1 - 0.35]) {
    box(silver, [XF, y - 0.35, 0], [XF + 0.7, y + 0.35, 17.4])
    box(silver, [(XF + XB) / 2 - 0.3, y - 0.3, 0], [(XF + XB) / 2 + 0.3, y + 0.3, 17.4])
  }
  for (const z of [6.8, 10.2, 13.6]) box(silver, [XF - 0.2, Y0, z - 0.45], [XB, Y1, z], false)
  // glass strip on the forward face of the closed box, next to the frame
  const gy = Y1 + 0.05
  polyOut(win, [[XB + 0.5, gy, 2.6], [XB + 3.6, gy, 2.6], [XB + 3.6, gy, 16.6], [XB + 0.5, gy, 16.6]], [12, Y1 - 1, 9])
  // and a narrower one on the aft face
  const gy2 = Y0 - 0.05
  polyOut(win, [[XB + 0.5, gy2, 2.6], [XB + 3.6, gy2, 2.6], [XB + 3.6, gy2, 16.6], [XB + 0.5, gy2, 16.6]], [12, Y0 + 1, 9])
}

// ---------------------------------------------------------------- output ---
// Colours from daylight photos: NASA white (a touch cool), the cheatline's
// mid blue pulled to the palette's lightness, the wings' and tower's pale
// metal, the orbiter's black tiles at the style's darkest charcoal.
const floodWhite = (p: V3, n: V3): number => (n[2] > 0.8 ? 0.3 : 0.75) * (p[2] < 18 ? 1 : 0.7)
const parts = [
  { part: white, material: { ...finish('sca-white', 0xf1f2ef), floodlight: floodWhite } },
  { part: blue, material: finish('sca-cheatline', 0x3f78b5) },
  { part: silver, material: finish('sca-silver', 0xc3c8cc) },
  { part: black, material: finish('orbiter-tile', 0x4a4f57) },
  { part: win, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Independence Plaza', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 187.3, elevation: 0, height: 24.0,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/hou-independence-plaza.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
