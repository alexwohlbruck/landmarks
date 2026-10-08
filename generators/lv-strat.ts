/**
 * The STRAT tower (Stratosphere Tower), Las Vegas — procedural, CC0-1.0.
 * bun generators/lv-strat.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * centroid of OSM way/135457469 (building=tower, man_made=tower,
 * height=350), a 51 m circle, taken as the tower's axis.
 *
 * Published (Wikipedia, "The Strat", citing the Las Vegas Review-Journal and
 * Las Vegas Sun):
 * - 1,149 ft (350.2 m) to the top of the antenna;
 * - three concrete legs rise 264 ft (80 m) before meeting the core;
 * - the pod starts at about 775 ft (236 m) and has 12 storeys;
 * - the 108th-floor indoor deck is at 855 ft (261 m);
 * - a 149 ft (45 m) steel needle stands on the pod;
 * - Big Shot rides the needle to 1,081 ft (329 m); X-Scream (866 ft) is a
 *   see-saw track overhanging the rim; Insanity (900 ft) is an arm that
 *   swings riders out over the edge.
 *
 * Measured:
 * - pod diameter 51 m from the OSM circle; it matches the widest pod ring
 *   in the photos when 350 m is used for the vertical scale;
 * - pod tiers (cream ring, lattice drum, white band, flared restaurant band,
 *   rim, dark roof cap, white plant box, needle) scaled from Commons
 *   photos "Stratosphere Tower attractions LAS 09 2017 4908.jpg"
 *   (Mariordo, CC BY-SA 4.0) and "Stratosphere Tower 4.jpg" (Noah Wulf,
 *   CC BY-SA 4.0): about 0.16 m per pixel at the pod;
 * - shaft widths from "Stratosphere Las Vegas.JPG" (Laslovarga,
 *   CC BY-SA 3.0) and "Stratosphere from Sahara Las Vegas.jpg"
 *   (Mikerussell, CC BY-SA 3.0): ~47 m across the feet, ~18 m at the
 *   waist (~200 m), flaring to the ~31 m cream ring under the pod.
 *
 * Colour: the pod's glass, deck and cap are charcoal #4a4f57 (the STYLE's
 * darkest tone), since the real pod reads near-black against the white
 * ring and lattice. Big Shot's lattice is white with a red stripe up the
 * middle of each face from the plant box to ~320 m (one red band, per
 * the Mariordo and Noah Wulf photos); white above to 338.5 m; antenna.
 *
 * Estimated:
 * - leg directions (118°, 238°, 358°): one leg faces Las Vegas Boulevard,
 *   which carries the old sign in "Stratosphere Tower (40714248821).jpg"
 *   (Mike McBey, CC BY 2.0), taken from across the boulevard;
 * - ride directions from a USGS NAIP orthophoto (public domain): X-Scream
 *   points south-east (~124°), Insanity's green arm north-north-east
 *   (~25°). Both are small at that resolution;
 * - leg width (~8 m), core radius (7 m), the gaps between legs and core
 *   below 60 m;
 * - the round glass base with its red cornice, from the photos only;
 * - the rides are static, bold shapes in a plausible resting pose.
 *
 * The resort's hotel towers are separate OSM buildings (way/135456188 does
 * not contain the tower) and are not modelled. Replaces the tower and its
 * "Thrill Rides" building:part (way/503324066).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const TAU = Math.PI * 2
const deg = Math.PI / 180
/** Bearing (clockwise from north) → maths angle (counter-clockwise from east). */
const dirOf = (bearing: number) => (90 - bearing) * deg

const concrete = new Part() // the cream shaft
const white = new Part() // bands, lattice, plant box, needle
const glass = new Part() // pod glazing
const baseGlass = new Part() // the base drum's lighter glazing
// The dark pod deck and cap, X-Scream and Big Shot's seats share the pod
// glass's charcoal window material, to stay within six materials.
const grey = glass
const red = new Part() // Big Shot's red mast, the base cornice
const green = new Part() // Insanity

const P = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]
const ring = (r: number, z: number, n: number, phase = 0): V3[] =>
  Array.from({ length: n }, (_, i) => P(r, phase + (i / n) * TAU, z))

/** A surface of revolution through (r, z) profile points, bottom to top. */
function lathe(p: Part, profile: [number, number][], n: number, phase = 0) {
  p.loft(profile.map(([r, z]) => ring(r, z, n, phase)))
}

// ---------------------------------------------------------------- shaft

const LEGS = [118, 238, 358]
// Outer radius of the legs, from the feet to the pod. Concave taper with the
// waist near 200 m and a quick flare into the cream ring at 236 m.
const LEG_R: [number, number][] = [
  [0, 25.5], [20, 22.5], [40, 20], [60, 17.8], [80, 16], [110, 13.8], [140, 12.2],
  [170, 11.1], [192, 10.6], [206, 10.9], [216, 11.8], [224, 13], [230, 14.3], [236, 15.6],
]
const CORE = 7
const legW = (z: number) => 8.6 - (z / 236) * 1.4
// Below 60 m the legs stand clear of the core, opening slots up to ~3 m wide.
const legInner = (z: number) => CORE - 1 + Math.max(0, (60 - z) / 60) * 4

for (const b of LEGS) {
  const a = dirOf(b)
  const u: V3 = [Math.cos(a), Math.sin(a), 0], v: V3 = [-Math.sin(a), Math.cos(a), 0]
  const at = (s: number, t: number, z: number): V3 => [u[0] * s + v[0] * t, u[1] * s + v[1] * t, z]
  const c = 0.6 // bevel on the outer edges
  const sections = LEG_R.map(([z, R]) => {
    const w = legW(z) / 2, i = legInner(z)
    return [at(i, -w, z), at(R - c, -w, z), at(R, -w + c, z), at(R, w - c, z), at(R - c, w, z), at(i, w, z)]
  })
  concrete.loft(sections)
  concrete.cap(sections[0], false)
}
// Core: a 12-sided column, visible between the legs.
lathe(concrete, [[CORE, 0], [CORE, 236]], 12, dirOf(LEGS[0]) + TAU / 24)

// Round glass base around the feet, with the red cornice.
lathe(baseGlass, [[21, 0], [21, 10.5]], 24)
lathe(red, [[21, 10.5], [21.6, 11], [21.6, 13.6], [21, 14]], 24)
concrete.cap(ring(21, 14, 24), true)

// ---------------------------------------------------------------- pod

const N = 24
const ph = 0
// Cream ring under the pod, with its soffit.
concrete.cap(ring(15.6, 236, N, ph), false)
lathe(concrete, [[15.6, 236], [16.2, 236.6], [16.2, 240.4], [16, 240.8]], N, ph)
// Lower glass drum with its diamond lattice.
const D0: [number, number] = [16, 240.8], D1: [number, number] = [18.6, 251.6]
lathe(glass, [D0, D1], N, ph)
{
  const lift = 0.05, half = 0.38
  const pt = (k: number, t: number): V3 => {
    const r = D0[0] + (D1[0] - D0[0]) * t + lift, z = D0[1] + (D1[1] - D0[1]) * t
    return P(r, ph + (k / N) * TAU, z)
  }
  // Zigzags between facet corners: bottom k → middle k+1 → top k+2, and the
  // mirror, so every segment lies flat on one facet.
  const strip = (a: V3, b: V3) => {
    const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
    const l = Math.hypot(...d)
    const n: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0]
    const nl = Math.hypot(n[0], n[1])
    // in-surface perpendicular: n × d, normalised
    const s: V3 = [(n[1] * d[2]) / nl / l, (-n[0] * d[2]) / nl / l, (n[0] * d[1] - n[1] * d[0]) / nl / l]
    const sl = Math.hypot(...s)
    const o: V3 = [(s[0] / sl) * half, (s[1] / sl) * half, (s[2] / sl) * half]
    const q = [
      [a[0] - o[0], a[1] - o[1], a[2] - o[2]], [b[0] - o[0], b[1] - o[1], b[2] - o[2]],
      [b[0] + o[0], b[1] + o[1], b[2] + o[2]], [a[0] + o[0], a[1] + o[1], a[2] + o[2]],
    ] as V3[]
    white.quad(q[0], q[1], q[2], q[3])
    white.quad(q[3], q[2], q[1], q[0])
  }
  for (let k = 0; k < N; k += 2) {
    strip(pt(k, 0), pt(k + 1, 0.5)); strip(pt(k + 1, 0.5), pt(k + 2, 1))
    strip(pt(k + 2, 0), pt(k + 1, 0.5)); strip(pt(k + 1, 0.5), pt(k, 1))
  }
}
// White band between the drums.
lathe(white, [D1, [19, 252], [19, 253.4]], N, ph)
white.cap(ring(18.6, 251.6, N, ph), false)
// The flared restaurant band: dark glass, an inverted cone to the full 51 m,
// with one pale floor line.
lathe(glass, [[19, 253.4], [22.1, 259]], N, ph)
lathe(white, [[22.1, 259], [22.4, 259.6]], N, ph)
lathe(glass, [[22.4, 259.6], [25.5, 265]], N, ph)
// Rim and roof deck.
lathe(white, [[25.5, 265], [25.6, 265.1], [25.6, 266.8], [25.2, 267]], N, ph)
{
  const outer = ring(25.2, 267, N, ph), inner = ring(14.5, 267, N, ph)
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    grey.quad(inner[i], outer[i], outer[j], inner[j])
  }
}
// The roof cap: a dark parapet, a broad band of glass (the outdoor
// deck's enclosure) and a dark domed top.
lathe(grey, [[14.5, 267], [14.3, 268.6]], N, ph)
lathe(glass, [[14.3, 268.6], [12.9, 274.4]], N, ph)
lathe(grey, [[12.9, 274.4], [11.4, 276.8], [9.2, 278.2], [7.5, 278.6]], N, ph)
grey.cap(ring(7.5, 278.6, N, ph), true)

// Plant room: a white drum and the square box Big Shot rises from.
lathe(white, [[6.5, 278.4], [6.5, 281]], 16)
white.cap(ring(6.5, 281, 16), true)
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const b: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const t: V3[] = b.map(([x, y]) => [x, y, z1])
  p.loft([b, t]); p.cap(t, true); p.cap(b, false)
}
box(white, -4.6, 4.6, -4.6, 4.6, 281, 289)

// ---------------------------------------------------------------- needle

// Big Shot: the seat ring at the bottom, the red lattice mast to ~320 m,
// white above to 338 m, then the thin antenna to 350.2 m.
lathe(grey, [[3, 289], [3, 291.2]], 12)
grey.cap(ring(3, 291.2, 12), true)
grey.cap(ring(3, 289, 12), false)
// The red runs up the middle of each face of the white lattice, leaving
// white edges, as in the photos: one red band from the plant box to ~320 m.
// A slender 2 m mast, as the lattice reads in the close-ups.
box(white, -1, 1, -1, 1, 289, 320)
for (const [ux, uy] of [[1, 0], [0, 1], [-1, 0], [0, -1]] as const) {
  const n = (s: number, z: number): V3 => [ux * 1.05 - uy * s, uy * 1.05 + ux * s, z]
  red.quad(n(-0.62, 290.2), n(0.62, 290.2), n(0.62, 319.6), n(-0.62, 319.6))
}
box(white, -1, 1, -1, 1, 320, 338.5)
box(white, -0.45, 0.45, -0.45, 0.45, 338.5, 350.2)

// ---------------------------------------------------------------- rides

/** A rectangular beam from a to b, `w` wide and `h` deep, horizontal sides. */
function beam(p: Part, a: V3, b: V3, w: number, h: number) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const hl = Math.hypot(d[0], d[1]) || 1
  const s: V3 = [(-d[1] / hl) * (w / 2), (d[0] / hl) * (w / 2), 0]
  const sec = (c: V3): V3[] => [
    [c[0] - s[0], c[1] - s[1], c[2] - h / 2], [c[0] + s[0], c[1] + s[1], c[2] - h / 2],
    [c[0] + s[0], c[1] + s[1], c[2] + h / 2], [c[0] - s[0], c[1] - s[1], c[2] + h / 2],
  ]
  const A = sec(a), B = sec(b)
  // ring order must be counter-clockwise looking from b back towards a
  p.loft([A.slice().reverse(), B.slice().reverse()])
  p.cap(B.slice().reverse(), true)
  p.cap(A.slice().reverse(), false)
}

// X-Scream: a straight see-saw track off the south-east rim, its car at the
// overhanging end.
{
  const a = dirOf(124)
  beam(grey, P(12, a, 268.6), P(33, a, 266.4), 2.4, 1)
  beam(grey, P(13, a, 268.2), P(13.2, a, 267), 1.6, 1.6)
  beam(grey, P(30.5, a, 267.6), P(33, a, 267.3), 2.8, 1.8)
}

// Insanity: a green arm arching out over the north-north-east rim, its seat
// spokes hanging from the tip.
{
  const a = dirOf(25)
  const arc: [number, number][] = [[10, 275.5], [14, 280], [19, 282.6], [24.5, 283.2], [29, 281.6], [32.2, 278.4], [33.6, 275]]
  for (let i = 0; i < arc.length - 1; i++)
    beam(green, P(arc[i][0], a, arc[i][1]), P(arc[i + 1][0], a, arc[i + 1][1]), 1.8, 1.8)
  for (const da of [-0.16, 0, 0.16]) beam(green, P(33.6, a, 275.2), P(33.6, a + da, 270.5), 1.2, 1.2)
  beam(green, P(32, a - 0.17, 270.4), P(32, a + 0.17, 270.4), 1.4, 1.4)
}

// ---------------------------------------------------------------- write

const parts = [
  // Warm cream concrete, sampled from the sunlit shaft and pulled to the
  // palette's stone lightness.
  { part: concrete, material: finish('strat-cream', 0xefe3c4) },
  { part: white, material: PALETTE.trim },
  // The pod reads near-black in every photo: its glass and its deck and cap
  // take the STYLE's darkest allowed tone, charcoal, so the dark pod, the
  // white ring and the white lattice keep their contrast.
  // Charcoal pod glass; the deck, cap and ride steel are in it too, so they
  // light with the pod at night.
  { part: glass, material: { ...PALETTE.window, color: 0x4a4f57 } },
  { part: baseGlass, material: windowVariant(2, 0xa9bfd1) },
  { part: red, material: finish('big-shot-red', 0xc66a5e) },
  { part: green, material: finish('insanity-green', 0x7fa88c) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('The STRAT tower', parts, {
  license: 'CC0-1.0',
  height: 350.2,
  frame: 'Y up, -Z north, +X east, metres; origin at the tower axis on the ground',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/lv-strat.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
