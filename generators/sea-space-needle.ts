/**
 * Space Needle, Seattle Center: procedural, CC0-1.0.
 * bun generators/sea-space-needle.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation. The origin is the axis of the top house, found from the 2021
 * King County lidar (USGS 3DEP WA_KingCo_1_2021) as the centre of the
 * saucer's returns; OSM's parts sit about 1.8 m west of it, an imagery
 * offset, so their shapes are used centred on the lidar axis. y = 0 is the
 * lowest lidar ground return under the saucer (41.4 m NAVD88).
 *
 * Built in 1962 (John Graham & Co., Victor Steinbrueck); the top house as
 * renovated in 2018 (outward-leaning glass barrier on the open deck, glass
 * Loupe level). Three pairs of legs pinch in to an hourglass waist and flare
 * out under the saucer round a dark central core.
 *
 * Published (Wikipedia; ASCE Civil Engineering, July 2024):
 * - 605 ft (184.4 m) to the spire tip; 138 ft (42 m) wide.
 * - legs on a 102 ft (31 m) circle at the base, waist at about 373 ft
 *   (113.7 m), a 50 ft spire.
 * - SkyLine level at 100 ft (30 m); tie level at 200 ft (61 m).
 * - paint: "Astronaut White" legs and top house; the roof's "Galaxy Gold"
 *   was a 1962/2012 anniversary scheme. 2023-25 photos show the roof white,
 *   so it is white here.
 *
 * Measured (lidar, heights above y = 0). The 0.5 m surface model gives the
 * top house; the raw returns, which the scanner's slant carries in under
 * the saucer, give the legs, the core and the lower levels:
 * - spire tip 184.8 m (the model uses 184.6, between this and the
 *   published 184.4);
 * - halo rim 157.4 m; its returns reach r 21.5, which half a 0.5 m cell
 *   inflates, so the published 42 m (r 21.0) is used;
 * - roof: eave 161.2 m at r 16, a straight shallow cone to 163.9 m at
 *   r 8; the spool's flange top 168.2 m at r 7; the dark machine band to
 *   170 m at r 5.5; the cap 171.9 m;
 * - legs at bearings 60, 180 and 300 (as OSM has them). Their outer faces
 *   run straight from r 14.1 at 20 m to r 6.7 at 85 m, ease into the waist
 *   (r 5.0 from about 95 to 115 m), and are hidden by the saucer above.
 *   Each pair spans 6 m along the tangent below 75 m, narrowing to 4.4 m
 *   where the two columns merge at about 90 m;
 * - the SkyLine level's plan (wings to r 15, corners to r 16.5) and the
 *   200 ft level, a triangle with its corners just outside the legs;
 * - the core: returns out to r 3.5-4.5, which includes the elevator rails.
 *
 * From photos (heights scaled between the lidar levels; radii from the
 * halo's 42 m):
 * - restaurant (Loupe) glass r 15.8, 152.3-155.3 m; observation deck
 *   floor 157.6 m, indoor glass wall r 15.6, glass barrier r 18.2-18.8 up
 *   to 160.9 m; the spool, a bowl under a flange, waist r 5.2 at 165.7 m.
 * - the underside dish from the leg ring (r 9.6, 149.6 m) to its rim
 *   (r 17.2, 152.3 m), with about 36 white radial fins.
 * - the legs: ladders of two columns with rungs below the merge, one flat
 *   column through the waist, a Y opening from about 123 m to the ring
 *   (photos from the south-east, 2023 and 2025, and from Elliott Bay, 2019,
 *   overlaid on renders from the same bearings).
 *
 * OSM: way/12903132 (outline, circle 38 m), building:parts for the
 * levels: SkyLine (30.5-36.6 m: a clipped triangle plus three 16.4 x 7.8 m
 * wings), the 200 ft level (61-64 m), the 6.5 m core, the 19 m glass base
 * (6.1 m), the legs. All within the outline, so all are replaced.
 *
 * Estimated: the legs' depth (1.5 m, 2 m through the waist) and the Y's
 * spread at the ring, rung spacing, the SkyLine underside's depth, fin
 * count and depth, the halo's thickness, the core drawn 5.8 m across
 * (photos read it narrower than lidar's rails).
 * Left out: elevator cars, railings, the stair, the lattice of the core
 * (drawn solid and dark), the Pavilion ring outside the outline.
 *
 * Photos (Wikimedia Commons):
 * - "Space Needle - Oct, 2023.jpg", Davidralphhughes, CC BY-SA 4.0 (south-east, telephoto)
 * - "Space Needle on January 12, 2019.jpg", Ron Clausen, CC BY-SA 4.0 (Elliott Bay)
 * - "Space Needle 2025.jpg", Antony-22, CC BY-SA 4.0 (base, SkyLine)
 * - "Space Needle, Seattle, Washington, 2024.jpg", Another Believer, CC BY-SA 4.0
 * - "Sunny Day for Space Needle Standing.jpg", Rozulafi, CC BY-SA 4.0
 * - "Space Needle-2021.jpg", Sandgrounder1974, CC BY-SA 4.0 (underside, legs)
 * - "Space Needle (4-27-24) 3086.jpg", Chris Light, CC BY-SA 4.0
 * - "Aerial Space Needle and EMP - November 2011.JPG", Jelson25, CC BY-SA 3.0
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

// ------------------------------------------------------------- materials ---
const white = new Part()   // top house, roof, fins: Astronaut White
const cream = new Part()   // legs and platforms, a shade warmer
const dark = new Part()    // core, dish, machine band
const win = new Part()     // Loupe, deck barrier, SkyLine and base glazing (lit)
const gold = new Part()    // the halo

/** A quad whose winding is chosen so it faces `out`, with per-corner normals. */
function face(p: Part, P: V3[], N: V3[]) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const avg = N.reduce(add, [0, 0, 0] as V3)
  const [a, b, c, d] = dot(f, avg) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(P[a], P[b], P[c], undefined, undefined, undefined, [N[a], N[b], N[c]])
  p.tri(P[a], P[c], P[d], undefined, undefined, undefined, [N[a], N[c], N[d]])
}
/** A flat quad facing `n`. */
const flat = (p: Part, P: V3[], n: V3) => face(p, P, [n, n, n, n])

/** A point at radius r, angle a (counter-clockwise from east), height z. */
const P = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]

/**
 * A surface of revolution from a profile of [r, z] points. The profile runs
 * so that its left-hand side is the outside (walls go up, roofs go inward,
 * undersides go outward). Each profile point's normal is the average of
 * the bands either side when they meet at under `smooth` degrees, so curves
 * and bevels shade smooth and real corners stay crisp. `pick(band)` chooses
 * each band's part.
 */
function lathe(profile: [number, number][], pick: (band: number) => Part | null, k: number, smooth = 40) {
  const bandN = profile.slice(0, -1).map(([r0, z0], b) => {
    const [r1, z1] = profile[b + 1]
    const er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez) || 1
    return [ez / l, -er / l] as [number, number]
  })
  const cosLim = Math.cos((smooth * Math.PI) / 180)
  const vn = (b: number, end: 0 | 1): [number, number] => {
    const own = bandN[b], j = b + (end ? 1 : -1)
    const other = bandN[j]
    if (!other || own[0] * other[0] + own[1] * other[1] < cosLim) return own
    const s = [own[0] + other[0], own[1] + other[1]], l = Math.hypot(s[0], s[1])
    return [s[0] / l, s[1] / l]
  }
  for (let b = 0; b < profile.length - 1; b++) {
    const part = pick(b)
    if (!part) continue
    const [r0, z0] = profile[b], [r1, z1] = profile[b + 1]
    if (r0 === 0 && r1 === 0) continue
    const n0 = vn(b, 0), n1 = vn(b, 1)
    const N = (n: [number, number], a: number): V3 => unit([n[0] * Math.cos(a), n[0] * Math.sin(a), n[1]])
    for (let s = 0; s < k; s++) {
      const a0 = (s / k) * TAU, a1 = ((s + 1) / k) * TAU
      const q = [P(r0, a0, z0), P(r0, a1, z0), P(r1, a1, z1), P(r1, a0, z1)]
      const nn = [N(n0, a0), N(n0, a1), N(n1, a1), N(n1, a0)]
      if (r0 === 0) part.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nn[0], nn[2], nn[3]])
      else if (r1 === 0) part.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nn[0], nn[1], nn[2]])
      else face(part, q, nn)
    }
  }
}

/** Loft closed horizontal rings (counter-clockwise from above), flat-shaded. */
function loftRings(p: Part, rings: V3[][]) {
  for (let k = 0; k < rings.length - 1; k++) {
    const a = rings[k], b = rings[k + 1], n = a.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      p.quad(a[i], a[j], b[j], b[i])
    }
  }
}
/** Fan-cap a star-shaped ring about its centroid. */
function fanCap(p: Part, ring: V3[], up: boolean) {
  const c = mul(ring.reduce(add, [0, 0, 0] as V3), 1 / ring.length)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (up) p.tri(c, a, b)
    else p.tri(c, b, a)
  }
}
const ccw = (ring: V3[]) => {
  let s = 0
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    s += a[0] * b[1] - b[0] * a[1]
  }
  return s > 0 ? ring : [...ring].reverse()
}
/** A horizontal box from corner offsets in a (d, e) frame, z0..z1. */
function box(p: Part, c: V3, d: V3, e: V3, hd: number, he: number, z0: number, z1: number) {
  const at = (u: number, v: number, z: number): V3 => add(add(add(c, mul(d, u)), mul(e, v)), [0, 0, z])
  const ring = (z: number) => ccw([at(-hd, -he, z), at(hd, -he, z), at(hd, he, z), at(-hd, he, z)])
  loftRings(p, [ring(z0), ring(z1)])
  p.cap(ring(z1), true)
  p.cap(ring(z0), false)
}

// -------------------------------------------------------------- the legs ---
/** Cubic Hermite between (p0, m0) and (p1, m1), slopes per unit z. */
const hermite = (z: number, z0: number, z1: number, p0: number, p1: number, m0: number, m1: number) => {
  const h = z1 - z0, t = (z - z0) / h, t2 = t * t, t3 = t2 * t
  return (2 * t3 - 3 * t2 + 1) * p0 + (t3 - 2 * t2 + t) * m0 * h + (-2 * t3 + 3 * t2) * p1 + (t3 - t2) * m1 * h
}
const WAIST_Z0 = 100, WAIST_Z1 = 112, WAIST_R = 4.3, RING_Z = 149.6, RING_R = 9.6
/**
 * Radius of a leg pair's centreline, from the lidar returns off the legs'
 * outer faces (less half the column's depth): a straight taper from 15.8 m
 * at the ground to 6.2 m at 80 m, easing into the waist, which holds at
 * 4.3 m from 100 to 112 m, then the flare out to the ring under the dish.
 */
function legR(z: number) {
  if (z <= 80) return 15.8 - 0.12 * z
  if (z <= WAIST_Z0) return hermite(z, 80, WAIST_Z0, 15.8 - 0.12 * 80, WAIST_R, -0.12, 0)
  if (z <= WAIST_Z1) return WAIST_R
  return hermite(Math.min(z, RING_Z), WAIST_Z1, RING_Z, WAIST_R, RING_R, 0, 0.25) + Math.max(0, z - RING_Z) * 0.25
}
const MERGE_Z = 90, SPLIT_Z = 123
/** Each column's depth along the radius: deepest through the merged waist. */
const legD = (z: number) => (z <= 60 ? 1.5 : z <= MERGE_Z ? hermite(z, 60, MERGE_Z, 1.5, 2.0, 0, 0) : z <= SPLIT_Z ? 2.0 : hermite(Math.min(z, RING_Z), SPLIT_Z, RING_Z, 2.0, 1.6, 0, 0))
/** Each column's width along the tangent: the merged waist is 4.4 m across (lidar). */
function legW(z: number) {
  if (z <= 60) return 1.5
  if (z <= MERGE_Z) return hermite(z, 60, MERGE_Z, 1.5, 2.2, 0, 0)
  if (z <= SPLIT_Z) return 2.2
  return hermite(Math.min(z, RING_Z), SPLIT_Z, RING_Z, 2.2, 1.6, 0, 0)
}
/**
 * Each column's offset from the pair's centreline, along the tangent: the
 * pair spans 6 m below 60 m (lidar), closes to touching at 90 m, and opens
 * into the Y from 123 m.
 */
function legS(z: number) {
  if (z <= 60) return 2.25
  if (z <= MERGE_Z) return hermite(z, 60, MERGE_Z, 2.25, legW(MERGE_Z) / 2, 0, 0)
  if (z <= SPLIT_Z) return legW(z) / 2
  return hermite(Math.min(z, RING_Z), SPLIT_Z, RING_Z, legW(SPLIT_Z) / 2, 2.8, 0, 0.12)
}
const LEG_BEARINGS = [60, 180, 300]
const LEG_Z = [0, 60, 67, 74, 80, 85, 90, 95, 100, 112, 118, 123, 128, 132, 136, 139.5, 142.5, 145.5, 148, 150.4]
const RUNG_Z = [8, 17, 24, 41, 49, 55, 70, 77]
for (const bd of LEG_BEARINGS) {
  const b = (bd * Math.PI) / 180
  const d: V3 = [Math.sin(b), Math.cos(b), 0]   // outward
  const e: V3 = [Math.cos(b), -Math.sin(b), 0]  // along the tangent
  for (const side of [-1, 1]) {
    // A column section with the two outer corners chamfered, so the leg's
    // face catches a highlight down both edges.
    const ch = 0.3
        const ring = (z: number) => {
      const c = add(mul(d, legR(z)), mul(e, side * legS(z))), hw = legW(z) / 2, hd = legD(z) / 2
      const sect: [number, number][] = [[-hd, -hw], [hd - ch, -hw], [hd, -hw + ch], [hd, hw - ch], [hd - ch, hw], [-hd, hw]]
      return ccw(sect.map(([u, v]) => add(add(c, mul(d, u)), add(mul(e, v), [0, 0, z]))))
    }
    const rings = LEG_Z.map(ring)
    loftRings(cream, rings)
    cream.cap(rings[rings.length - 1], true)
  }
  // Ladder rungs between the two columns, below the merge.
  for (const z of RUNG_Z) {
    const s = legS(z), gap = s - legW(z) / 2
    box(cream, mul(d, legR(z)), d, e, legD(z) * 0.35, gap + 0.05, z - 0.45, z + 0.45)
  }
}

// -------------------------------------------------------------- the core ---
// Hexagonal, 6 m across (OSM maps 6.5 m; photos show it narrower than
// the merged legs either side of it), dark: the open steel frame and elevator
// shafts read as one dark mass between the legs.
{
  const R = 2.9
  const ring = (z: number) => Array.from({ length: 6 }, (_, i) => P(R, (i / 6) * TAU, z))
  loftRings(dark, [ring(0), ring(150.5)])
}

// ----------------------------------------------------------- the levels ---
/**
 * SkyLine (100 ft): a triangle clipped at the legs, with a 16.4 x 7.8 m
 * wing on each face (OSM), so the plan is a three-armed star. A band of
 * windows along the top of the wings, a cream fascia, and an underside that
 * sweeps in to the core.
 */
{
  const WING_HALF = 8.2, WING_IN = 6.8, WING_OUT = 14.6
  const plan: [number, number][] = []
  for (const bd of [0, 120, 240]) {
    const b = (bd * Math.PI) / 180
    const d = [Math.sin(b), Math.cos(b)], e = [Math.cos(b), -Math.sin(b)]
    const at = (u: number, v: number): [number, number] => [d[0] * v + e[0] * u, d[1] * v + e[1] * u]
    // Clockwise from above within a wing; the ring is reversed below.
    plan.push(at(-WING_HALF, WING_IN), at(-WING_HALF, WING_OUT), at(WING_HALF, WING_OUT), at(WING_HALF, WING_IN))
  }
  const ringAt = (k: number, z: number) => ccw(plan.map(([x, y]) => [x * k, y * k, z] as V3))
  const Z_TOP = 36.6, Z_FASCIA = 33.6
  const top = ringAt(1, Z_TOP), fas = ringAt(1, Z_FASCIA)
  loftRings(cream, [fas, top])
  fanCap(white, top, true)
  // The underside: a concave sweep in to the core.
  loftRings(cream, [ringAt(0.42, 27.6), ringAt(0.72, 31.0), ringAt(0.93, 33.0), fas])
  fanCap(cream, ringAt(0.42, 27.6), false)
  // Window band on every vertical face of the wings, just proud of it.
  for (let i = 0; i < top.length; i++) {
    const a = top[i], b = top[(i + 1) % top.length]
    const t = unit(sub(b, a)), n: V3 = [t[1], -t[0], 0]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4) continue // the short clipped faces at the legs stay plain
    const inset = 0.6
    const p0 = add(add(a, mul(t, inset)), mul(n, 0.04)), p1 = add(add(b, mul(t, -inset)), mul(n, 0.04))
    flat(win, [[p0[0], p0[1], 34.3], [p1[0], p1[1], 34.3], [p1[0], p1[1], 36.0], [p0[0], p0[1], 36.0]], n)
  }
}
/** The 200 ft level: a slab tying the legs, a triangle clipped at them. */
{
  const ring = (z: number) => {
    const pts: V3[] = []
    for (const bd of LEG_BEARINGS) {
      const b = (bd * Math.PI) / 180, r = legR(62) + 1.4
      const d: V3 = [Math.sin(b), Math.cos(b), 0], e: V3 = [Math.cos(b), -Math.sin(b), 0]
      pts.push(add(add(mul(d, r), mul(e, -2.0)), [0, 0, z]), add(add(mul(d, r), mul(e, 2.0)), [0, 0, z]))
    }
    return ccw(pts)
  }
  // A shallow flared underside, in the style of the SkyLine's.
  const under = ccw(ring(58.8).map(([x, y, z]) => [x * 0.55, y * 0.55, z] as V3))
  loftRings(cream, [under, ring(61.0), ring(63.4)])
  fanCap(white, ring(63.4), true)
  fanCap(cream, under, false)
}
/** The base: OSM's round glass building, 18.9 m across and 6.1 m tall. */
lathe([[9.4, 0], [9.4, 5.3]], () => win, 32)
lathe([[9.4, 5.3], [9.9, 5.4], [9.9, 6.1], [9.6, 6.3], [0, 6.3]], (b) => (b === 3 ? white : cream), 32)

// ------------------------------------------------------------ top house ---
const K = 48 // the saucer is the identity; 48 segments keep its rims round
// The leg ring and the underside dish, dark between the fins.
lathe([[RING_R + 0.6, 150.6], [RING_R - 0.6, 150.6], [RING_R - 0.6, 149.3], [RING_R + 0.6, 149.3], [RING_R + 0.6, 150.6]], () => cream, 24)
lathe([[RING_R + 0.6, 150.2], [17.2, 151.6]], () => dark, K)
// The dish rim, restaurant (Loupe) glass, and the halo above it.
lathe([
  [17.2, 151.6], [17.35, 151.85], [17.35, 152.15], [17.1, 152.35], [15.85, 152.35], // rim lip
], () => white, K)
lathe([[15.85, 152.35], [16.0, 155.3]], () => win, K)
lathe([
  [16.0, 155.3], [20.7, 156.75], [21.0, 156.95], [21.0, 157.25], [20.8, 157.4], [18.8, 157.6],
], () => gold, K)
// The open deck: floor inside the barrier, the outward-leaning glass.
lathe([[18.8, 157.6], [15.6, 157.6]], () => gold, K)
// It reads in photos as a dark band, the lit deck seen through it, so it
// is drawn as window, like the Loupe below, and glows with it at night.
lathe([[18.15, 157.6], [18.8, 160.9], [18.65, 160.95], [18.0, 157.65]], () => win, K, 10)
// The indoor observation level's glass wall, and the roof's eave over it.
lathe([[15.6, 157.6], [15.6, 160.7]], () => win, K)
lathe([
  [15.6, 160.7], [16.4, 160.75], [16.5, 161.0], [16.3, 161.25], [5.7, 164.8],
], () => white, K, 50)
// The spool: a white drum pinched at the middle, under a broad flange.
// Its upper half is a rounded bowl, as broad as the flange, curving in to
// the waist: the teacup shape that crowns the roof in every photo.
lathe([
  [5.7, 164.8], [5.3, 165.1], [5.2, 165.7], [5.45, 166.25], [6.05, 166.75], [6.7, 167.1],
  [7.1, 167.5], [7.1, 167.85], [6.9, 168.1], [5.6, 168.15],
], () => white, 36, 50)
// The machine band (dark, windowed), its cap and the spire.
lathe([[5.6, 168.15], [5.5, 168.25], [5.5, 169.6], [5.3, 169.75], [1.4, 169.75]], (b) => (b === 1 ? dark : white), 32)
lathe([[1.4, 169.75], [1.4, 171.4], [1.2, 171.6], [0.65, 171.6]], (b) => (b === 0 ? dark : white), 12)
// The spire is a dark steel lattice against the sky in every photo.
lathe([[0.65, 171.6], [0.45, 176], [0.15, 184.6], [0, 184.6]], () => dark, 8, 60)

/**
 * Radial fins under the dish: thin plates hanging from the dish from the
 * leg ring to the rim, deepest at mid-span, the sunburst seen from below
 * and from the side.
 */
{
  const N_FINS = 36, T = 0.22
  for (let i = 0; i < N_FINS; i++) {
    const a = ((i + 0.5) / N_FINS) * TAU
    const d: V3 = [Math.cos(a), Math.sin(a), 0], e: V3 = [-Math.sin(a), Math.cos(a), 0]
    const dishZ = (r: number) => 150.2 + ((r - (RING_R + 0.6)) / (17.2 - RING_R - 0.6)) * 1.4
    const r0 = RING_R + 0.5, r1 = 17.25
    const pts: [number, number, number][] = [ // [r, top z, bottom z]
      [r0, dishZ(r0) + 0.05, 149.4], [13.5, dishZ(13.5) + 0.05, 150.0], [r1, dishZ(r1) + 0.15, 151.55],
    ]
    for (let k = 0; k < pts.length - 1; k++) {
      const [ra, ta, ba] = pts[k], [rb, tb, bb] = pts[k + 1]
      const A = (r: number, z: number, s: number): V3 => add(add(mul(d, r), mul(e, s * T)), [0, 0, z])
      flat(white, [A(ra, ba, 1), A(rb, bb, 1), A(rb, tb, 1), A(ra, ta, 1)], e)
      flat(white, [A(ra, ba, -1), A(ra, ta, -1), A(rb, tb, -1), A(rb, bb, -1)], mul(e, -1))
      const nb = unit(cross(sub(A(rb, bb, 1), A(ra, ba, 1)), e))
      flat(white, [A(ra, ba, -1), A(rb, bb, -1), A(rb, bb, 1), A(ra, ba, 1)], dot(nb, [0, 0, -1]) > 0 ? nb : mul(nb, -1))
    }
    const [rl, tl, bl] = pts[pts.length - 1]
    const A = (z: number, s: number): V3 => add(add(mul(d, rl), mul(e, s * T)), [0, 0, z])
    flat(white, [A(bl, -1), A(bl, 1), A(tl, 1), A(tl, -1)], d)
  }
}

// ---------------------------------------------------------------- output ---
// Colours from daylight photos: the legs a warm white, pulled a touch
// darker than the top house so the two read apart; the core charcoal (its
// real black-brown steel, at the style's darkest); the halo's brass rim and
// deck pulled to the palette's lightness.
const parts = [
  { part: white, material: PALETTE.trim },
  { part: cream, material: PALETTE.stone },
  { part: dark, material: finish('needle-core', 0x4a4f57) },
  { part: win, material: PALETTE.window },
  { part: gold, material: finish('needle-halo', 0xc4ad82) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Space Needle', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 184.6,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/sea-space-needle.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
