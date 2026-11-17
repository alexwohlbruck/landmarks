/**
 * National Center for Civil and Human Rights (2014, Freelon Group with
 * HOK; Phil Freelon) — original procedural geometry, CC0-1.0.
 * bun generators/atl-civil-and-human-rights.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Anchor = centroid
 * of OSM way/317976752, 33.764038, -84.393050.
 *
 * Identity: two great curved walls clad in bronze-toned metal panels,
 * leaning outward, that face each other like two cupped hands (the
 * "interlocking arms" of the design). In plan each is an arc of a circle
 * of about 36 m radius, the pair point-symmetric, enclosing a lens. Their
 * ends rise past the building as sharp leaning prows. Between them, at the
 * south-west end, a tall flat glass curtain wall with horizontal mullions
 * (the main entrance, facing Pemberton Place's lawn); at the north-east
 * end, a recessed dark brown wall with a glass band near the top. The
 * bronze is scattered with tall slot windows in clusters.
 *
 * Evidence:
 *  - plan: OSM way/317976752 (the walls' top edges). Circles fitted to its
 *    points: the north-west wall centre (11.13, -16.77) r 35.57, from 175°
 *    (west tip) to 88.8° (north tip); the south-east wall centre (-10.21,
 *    19.04) r 36.56, from -17.2° (east tip) to -82.4° (south end). The
 *    2018 lidar's roof matches the outline to a metre.
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 0.5 m
 *    grid. The walls' tops stand 23-24 m over ground_min (294.09 m), the
 *    roof between them 20-21 m, the south-west facade's top 21-22 m. The
 *    site slopes: Mapterhorn's lowest ground under the footprint (the
 *    north side) is about 1.4 m over ground_min, the south-west front 6 m
 *    higher. So here: wall tops 22.3 m, roof 20.3 m
 *    (the glass front's top, so the walls stand only 2 m above it, as in
 *    Merlin's photo); the glass front stands
 *    on ground about 6 m up and its lower part sinks into the slope.
 *  - lean: the walls lean outward 7 m over their height (about 17°,
 *    estimated from LeMay's north-east photo, where the tops stand well
 *    past the feet); each end is cut on a diagonal from its foot up to a
 *    pointed tip that overhangs it by 5-18 m along the wall, the
 *    north-east ends most (the same photos). The outline is the walls' top
 *    edge, so the feet stand 7 m inside it; the glass front and
 *    the north-east wall stand on the line between the feet.
 *  - colours: bronze panels (a mix of tan, rose and brown, averaged), dark
 *    tinted glass, the dark brown north-east wall, a planted roof (NAIP).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Atlanta's Center for Civil and Human Rights on a quiet Sunday
 *    morning.jpg, Marc Merlin, CC BY-SA 4.0 (the glass front, face on)
 *    https://commons.wikimedia.org/wiki/File:Atlanta%E2%80%99s_Center_for_Civil_and_Human_Rights_on_a_quiet_Sunday_morning.jpg
 *  - Atlanta August 2016 08 (National Center for Civil and Human
 *    Rights).jpg, Michael Barera, CC BY-SA 4.0 (the front, from the lawn)
 *    https://commons.wikimedia.org/wiki/File:Atlanta_August_2016_08_(National_Center_for_Civil_and_Human_Rights).jpg
 *  - The Center for Civil and Human Rights, Atlanta, GA (40508038973).jpg,
 *    Warren LeMay, CC0 (north-east end, the prows)
 *    https://commons.wikimedia.org/wiki/File:The_Center_for_Civil_and_Human_Rights,_Atlanta,_GA_(40508038973).jpg
 *  - The Center for Civil and Human Rights, Atlanta, GA (47474203191).jpg,
 *    Warren LeMay, CC0 (north-east end)
 *    https://commons.wikimedia.org/wiki/File:The_Center_for_Civil_and_Human_Rights,_Atlanta,_GA_(47474203191).jpg
 *  - The Center for Civil and Human Rights, Atlanta, GA (32532264677).jpg,
 *    Warren LeMay, CC0 (the north-west wall and its slots)
 *    https://commons.wikimedia.org/wiki/File:The_Center_for_Civil_and_Human_Rights,_Atlanta,_GA_(32532264677).jpg
 *  - The Center for Civil and Human Rights, Atlanta, GA (47421270912).jpg,
 *    Warren LeMay, CC0 (the south-east wall)
 *    https://commons.wikimedia.org/wiki/File:The_Center_for_Civil_and_Human_Rights,_Atlanta,_GA_(47421270912).jpg
 *  - NAIP orthophoto (USGS, public domain): plan and the planted roof.
 * No look-only sources. No commercial imagery.
 *
 * Night: the glass front and the slot windows are `window` (lit inside
 * at night); the bronze is unlit.
 *
 * Doubts: the panels' tan/rose/brown mix is one averaged bronze; the slot
 * clusters are placed after the photos, not counted one by one; the
 * glass-fin water sculpture by the north-east door is left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, type XY } from './atl-westin-peachtree-plaza'

const bronze = new Part(), win = new Part(), brown = new Part(), roof = new Part(), trim = new Part()

const D = Math.PI / 180
const HT = 22.3      // wall tops (lidar)
const ROOF = 20.3    // roof at the glass front's top (lidar)
const LEAN = 7.0     // outward lean over the full height (about 17°)
const T = 1.0        // wall thickness

type Wall = { c: XY; r: number; top0: number; top1: number; base0: number; base1: number }
/** Outer radius at height z: the outline is the top edge; the base is LEAN further in. */
const R = (w: Wall, z: number) => w.r - LEAN * (1 - z / HT)
const P = (w: Wall, th: number, z: number, d = 0): V3 => [w.c[0] + (R(w, z) + d) * Math.cos(th), w.c[1] + (R(w, z) + d) * Math.sin(th), z]
const nOut = (th: number): V3 => {
  const l = Math.hypot(HT, LEAN)
  return [Math.cos(th) * HT / l, Math.sin(th) * HT / l, -LEAN / l]
}

// The two walls. Angles run from the end at the glass front to the end at
// the north-east wall; `base` angles pull each end back by its prow.
const prow = (w: { r: number }, m: number) => m / w.r
const A0 = { c: [11.13, -16.77] as XY, r: 35.57 }
const B0 = { c: [-10.21, 19.04] as XY, r: 36.56 }
const A: Wall = { ...A0, top0: 175 * D, top1: 88.8 * D, base0: 175 * D - prow(A0, 5), base1: 88.8 * D + prow(A0, 18) }
const B: Wall = { ...B0, top0: -82.4 * D, top1: -17.2 * D, base0: -82.4 * D + prow(B0, 9), base1: -17.2 * D - prow(B0, 18) }

/** One leaning wall: outer and inner cone faces, top, and the two slanted ends. */
function wall(w: Wall) {
  const N = 40
  const th = (u: number, z: number) => {
    const f = z / HT
    return (w.base0 + (w.base1 - w.base0) * u) * (1 - f) + (w.top0 + (w.top1 - w.top0) * u) * f
  }
  for (let i = 0; i < N; i++) {
    const u0 = i / N, u1 = (i + 1) / N
    for (const [d, s] of [[0, 1], [-T, -1]] as [number, number][]) {
      const a = P(w, th(u0, 0), 0, d), b = P(w, th(u1, 0), 0, d), c = P(w, th(u1, HT), HT, d), e = P(w, th(u0, HT), HT, d)
      const n = (t: number): V3 => nOut(t).map((v) => v * s) as V3
      bronze.tri(a, b, c, undefined, undefined, undefined, [n(th(u0, 0)), n(th(u1, 0)), n(th(u1, HT))])
      bronze.tri(a, c, e, undefined, undefined, undefined, [n(th(u0, 0)), n(th(u1, HT)), n(th(u0, HT))])
    }
    // Top edge.
    const up: V3 = [0, 0, 1], q = [P(w, th(u0, HT), HT, -T), P(w, th(u0, HT), HT, 0), P(w, th(u1, HT), HT, 0), P(w, th(u1, HT), HT, -T)]
    bronze.tri(q[0], q[1], q[2], undefined, undefined, undefined, [up, up, up])
    bronze.tri(q[0], q[2], q[3], undefined, undefined, undefined, [up, up, up])
  }
  // The ends, cut along the line from base end to top end.
  for (const u of [0, 1]) {
    const a = P(w, th(u, 0), 0, 0), b = P(w, th(u, 0), 0, -T), c = P(w, th(u, HT), HT, -T), e = P(w, th(u, HT), HT, 0)
    // Wound to face away from the wall's middle.
    const mid = P(w, th(0.5, HT / 2), HT / 2, -T / 2)
    const nn = crossV(sub3(b, a), sub3(e, a)), out = sub3(a, mid)
    if (nn[0] * out[0] + nn[1] * out[1] + nn[2] * out[2] > 0) bronze.quad(a, b, c, e)
    else bronze.quad(a, e, c, b)
  }
  return th
}
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crossV = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

const thA = wall(A), thB = wall(B)

// ── The core between the walls: two vertical facades and the roof. ──
// The glass front and the dark north-east wall are vertical planes through
// the walls' feet, 1.5 m in from each foot's end, so they meet the leaning
// walls' inner faces at every height (the walls overhang them above).
const m = (w: Wall) => 1.5 / w.r
const foot = (w: Wall, th: number): XY => { const p = P(w, th, 0, -T); return [p[0], p[1]] }
const aSW = A.base0 - m(A), bSW = B.base0 + m(B), aNE = A.base1 + m(A), bNE = B.base1 - m(B)
const SW: [XY, XY] = [foot(A, aSW), foot(B, bSW)]
const NE: [XY, XY] = [foot(B, bNE), foot(A, aNE)]
/** Where the line p meets the wall's inner face at height z, as an angle. */
function meet(w: Wall, p: [XY, XY], z: number, near: number) {
  const r = R(w, z) - T + 0.05
  const [x0, y0] = [p[0][0] - w.c[0], p[0][1] - w.c[1]], dx = p[1][0] - p[0][0], dy = p[1][1] - p[0][1]
  const a = dx * dx + dy * dy, b = 2 * (x0 * dx + y0 * dy), c = x0 * x0 + y0 * y0 - r * r
  const s = Math.sqrt(Math.max(0, b * b - 4 * a * c))
  const ts = [(-b - s) / (2 * a), (-b + s) / (2 * a)]
  const ths = ts.map((t) => Math.atan2(y0 + t * dy, x0 + t * dx))
  const dist = (t: number) => Math.abs(Math.atan2(Math.sin(t - near), Math.cos(t - near)))
  return dist(ths[0]) < dist(ths[1]) ? ths[0] : ths[1]
}
/** The core's outline at height z, counter-clockwise: B's arc, the NE wall, A's arc, the glass front. */
function ring(z: number, n = 10): V3[] {
  const b0 = meet(B, SW, z, bSW), b1 = meet(B, NE, z, bNE)
  const a0 = meet(A, NE, z, aNE), a1 = meet(A, SW, z, aSW)
  const pts: V3[] = []
  for (let i = 0; i <= n; i++) pts.push(P(B, b0 + (b1 - b0) * i / n, z, -T + 0.05))
  for (let i = 0; i <= n; i++) pts.push(P(A, a0 + (a1 - a0) * i / n, z, -T + 0.05))
  return pts
}
const r0 = ring(0), r1 = ring(ROOF)
const K = r0.length, nb = 11
for (let i = 0; i < K; i++) {
  const j = (i + 1) % K
  const face = i === nb - 1 ? 'ne' : i === K - 1 ? 'sw' : 'side'
  // Under the south-east wall's overhanging prow at the glass front, the
  // entrance glazing (Merlin's photo); elsewhere the core is dark brown.
  const part = face === 'sw' || i < 3 ? win : brown
  part.quad(r0[i], r0[j], r1[j], r1[i])
  if (face === 'ne') {
    // The north-east wall: ground-floor glazing and the glass band high up.
    const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
    const nx = r0[j][1] - r0[i][1], ny = -(r0[j][0] - r0[i][0]), l = Math.hypot(nx, ny), o: V3 = [nx / l * 0.06, ny / l * 0.06, 0]
    for (const [za, zb] of [[0.3, 4.2], [12.6, 16.6]]) {
      const ra = ring(za), rb = ring(zb)
      const q = (r: V3[], t: number): V3 => { const p = lerp3(r[i], r[j], t); return [p[0] + o[0], p[1] + o[1], p[2]] }
      win.quad(q(ra, 0.04), q(ra, 0.96), q(rb, 0.96), q(rb, 0.04))
    }
  }
  if (face === 'sw') {
    // Four pale transom lines across the glass front, as in Merlin's
    // photo, spanning it wall to wall at their height.
    const nx = r0[j][1] - r0[i][1], ny = -(r0[j][0] - r0[i][0]), l = Math.hypot(nx, ny), o = [nx / l * 0.08, ny / l * 0.08]
    for (const zz of [8.5, 11.5, 14.5, 17.5]) {
      const ra = ring(zz), rb = ring(zz + 0.6)
      const e = (r: V3[], k: number): V3 => [r[k][0] + o[0], r[k][1] + o[1], r[k][2]]
      trim.quad(e(ra, i), e(ra, j), e(rb, j), e(rb, i))
    }
  }
}
// Roof: a convex lens, fanned from its middle.
{
  const c = r1.reduce<V3>((s, p) => [s[0] + p[0] / K, s[1] + p[1] / K, ROOF], [0, 0, ROOF])
  for (let i = 0; i < K; i++) roof.tri(c, r1[i], r1[(i + 1) % K])
}

// ── Slot windows: tall narrow panels in clusters, on the outer faces. ──
function slots(w: Wall, th: (u: number, z: number) => number, list: [number, number, number][], width = 1.15) {
  for (const [u, z0, z1] of list) {
    const tm = th(u, (z0 + z1) / 2), dth = width / 2 / R(w, (z0 + z1) / 2)
    const a = P(w, tm - dth, z0, 0.06), b = P(w, tm + dth, z0, 0.06), c = P(w, tm + dth, z1, 0.06), e = P(w, tm - dth, z1, 0.06)
    // Outward-facing whichever way the angles run.
    const n = crossV(sub3(b, a), sub3(e, a)), o = nOut(tm)
    if (n[0] * o[0] + n[1] * o[1] + n[2] * o[2] > 0) win.quad(a, b, c, e)
    else win.quad(a, e, c, b)
  }
}
// North-west wall (photos from the north and west): a long scatter in the
// middle and toward the north end.
slots(A, thA, [
  [0.30, 9, 15], [0.34, 11, 18], [0.38, 7, 13],
  [0.52, 10, 17], [0.56, 6, 12], [0.60, 12, 19], [0.63, 8, 15], [0.67, 11, 17],
  [0.74, 7, 14], [0.78, 10, 18], [0.82, 6, 12],
])
// South-east wall: the cluster near the glass front (Merlin's photo) and
// one toward the north-east prow.
slots(B, thB, [
  [0.12, 11, 18], [0.16, 9, 16], [0.20, 12, 19], [0.24, 10, 15], [0.28, 13, 18], [0.32, 9, 14],
  [0.62, 10, 16], [0.70, 12, 19], [0.78, 9, 15],
])

await save('atl-civil-and-human-rights', 'National Center for Civil and Human Rights', [
  { part: bronze, material: finish('cchr-bronze', 0xbf9d80) },
  { part: win, material: PALETTE.window },
  { part: brown, material: finish('cchr-brown', 0x6e5a4b) },
  { part: roof, material: finish('cchr-roof', 0x9c9a86) },
  { part: trim, material: PALETTE.trim },
], { height: HT, anchor: [33.764038, -84.39305], bearing: 0 })
