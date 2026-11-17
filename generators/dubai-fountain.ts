/**
 * The Dubai Fountain (WET Design, 2009), the choreographed fountain in the
 * Burj Khalifa Lake between the Dubai Mall, Souk Al Bahar and the Burj
 * Khalifa. Original procedural geometry, CC0-1.0.
 * bun generators/dubai-fountain.ts
 *
 * What this is: the water itself can't be drawn (STYLE.md: the lake is the
 * map's), and the nozzles are under water, so the model is a static pose of
 * the jets in mid-show, laid out on the fountain's real plan: two arcs and
 * five rings. The pose is a representative one, not a frame of a real show:
 * - the long arc throws a row of jets 24-44 m high leaning out from its
 *   convex side, over a low curtain of spray 12 m high;
 * - the short arc a row of 20-30 m jets over a 9 m curtain;
 * - each of the three large rings a crown of 14 jets leaning out 15 degrees and arching further out
 *   (28 m), an inner ring of 8 upright jets (40 m) and one tall central
 *   "shooter" (120, 95 and 75 m);
 * - each of the two small rings a crown of 11 jets leaning out (22 m);
 * - a ring of white foam 3 m high where each ring's jets boil up.
 * The jets are drawn about twice their real thickness and as simple
 * flaring plumes, so they read as water at phone size.
 *
 * Frame: BEARING 63.8 (the principal axis of the long arc), so +y runs along
 * it from its south-west end to its north-east end. Origin = area centroid of
 * the seven member polygons of OSM relation/15670582. y = 0 is the water.
 *
 * Evidence
 * - OSM relation/15670582 (amenity=fountain, name The Dubai Fountain,
 *   wikidata Q2384491): outer members way/241316529 (long arc, 322 m along its
 *   centre line), way/489689877 (short arc, 133 m), and the rings
 *   way/241316875 (r 24.0 m), way/503468425 (r 20.9), way/503468423 (r 19.0),
 *   way/503468424 (r 13.6), way/503468426 (r 13.5). Centre lines and radii
 *   measured from them.
 * - "Nozzle distribution of Dubai Fountain.svg" (Toby3169, vector by Sarang,
 *   CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Nozzle_distribution_of_Dubai_Fountain.svg):
 *   the same two arcs and five circles; the three large circles are double
 *   rings, the two small ones single.
 * - Published (Wikipedia "The Dubai Fountain"; WET Design): 275 m long,
 *   jets up to 152 m (500 ft) high, about 6,600 lights and 25 colour
 *   projectors, shows every 30 minutes in the evening.
 * - Photos (Wikimedia Commons):
 *   * "Dubai fountain show.jpg", Amzexplorersfamily, CC BY-SA 4.0, 2021
 *     (night, from the Burj Khalifa straight down): the pose: each ring a
 *     sunburst of jets leaning outward, the arcs rows of leaning jets.
 *   * "Dubai Fountain show (Pexels 692105).jpg", Aleksandar Pasaric, CC0,
 *     2017 (night, from the Waterfront promenade): upright jets, the tall
 *     shooters about three times the height of the rest.
 *   * "DUBAI WATER FOUNTAIN.jpg", Smilesnmore Digital Photography,
 *     CC BY-SA 4.0, 2023: a ring's jets as a crown of plumes.
 *   * "The huge fountain view from KhalifaBurj - panoramio.jpg", patano,
 *     CC BY-SA 3.0, and "Dubai Fountain from Burj Khalifa (15795939749).jpg",
 *     edward stojakovic, CC BY 2.0 (daylight from above): the plan, matching
 *     OSM.
 *
 * Numbers: plan measured (OSM); the 120 m shooter is under the published
 * 152 m maximum; every other height, lean and count is invented for the
 * pose, guided by the photos.
 *
 * Material: one pale blue-white translucent water finish (#dceff7, opacity 0.72,
 * double-sided) and a denser foam; both floodlit (_FLOODLIGHT 1), since the
 * jets are lit white from below at night.
 *
 * Doubts: a fountain at rest is just the lake, so on the map this stands for
 * the show at all hours. Terrain could not be checked (no Mapterhorn tiles
 * here).
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { writeModel } from './dubai-opera'
import { type XY } from './sf-de-young'

const BEARING = 63.8
const ANCHOR = { lng: 55.2756455, lat: 25.1954088 }

const LONG_ARC: XY[] = [[48.7, 129.9], [42.6, 119.7], [33.5, 109.6], [25.2, 99.0], [17.4, 87.9], [10.2, 76.4], [3.7, 64.6], [-2.0, 52.3], [-7.1, 39.8], [-11.6, 27.0], [-15.5, 14.0], [-18.7, 0.9], [-21.1, -12.4], [-23.0, -25.8], [-23.7, -39.4], [-22.1, -52.8], [-19.4, -66.0], [-15.0, -78.8], [-9.1, -91.0], [-1.9, -102.4], [6.5, -113.0], [16.5, -122.1], [28.0, -129.2], [40.4, -134.6], [51.5, -139.7]]
const SHORT_ARC: XY[] = [[-61.2, 67.8], [-57.1, 65.9], [-52.6, 62.6], [-47.7, 59.7], [-42.5, 57.5], [-37.0, 56.5], [-31.3, 56.5], [-25.7, 57.3], [-20.3, 59.0], [-15.1, 61.2], [-10.2, 63.9], [-5.4, 67.0], [-0.9, 70.5], [3.0, 74.5], [6.6, 78.8], [9.7, 83.6], [12.6, 88.4], [15.5, 93.3], [17.6, 98.5], [19.2, 103.9], [20.3, 109.5], [20.7, 115.1], [20.9, 120.8], [21.0, 126.4], [22.5, 130.8]]
// [centre, radius, shooter height (0 = none), double ring]
const RINGS: [XY, number, number, boolean][] = [
  [[5.9, -57.0], 24.0, 120, true],
  [[-8.0, 96.2], 20.9, 95, true],
  [[-3.5, -133.7], 19.0, 75, true],
  [[-23.8, 40.8], 13.6, 0, false],
  [[35.4, 135.9], 13.5, 0, false],
]

const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const crossV = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

/**
 * One jet: a column rising from `base` along `dir` for `h` metres, curving
 * by `bend` (metres per metre of height, times the height fraction squared)
 * as a real arcing jet does, staying slim and widening a little into a soft, blunt plume at its head.
 */
function jet(p: Part, base: V3, dir: V3, h: number, r: number, sides = 4, bend: V3 = [0, 0, 0]) {
  const d = unit(dir), s = unit(crossV(Math.abs(d[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1], d)), t = crossV(d, s)
  // slim column, widening into a soft plume, closed by a low blunt dome (no point)
  const prof: [number, number][] = [[r, 0], [r * 0.7, 0.6], [r * 1.2, 0.92], [r * 1.0, 0.985], [0, 1.015]]
  const ring = (rr: number, f: number) => Array.from({ length: sides }, (_, i) => {
    const a = (2 * Math.PI * i) / sides + Math.PI / 4
    const c: V3 = [base[0] + (d[0] * f + bend[0] * f * f) * h, base[1] + (d[1] * f + bend[1] * f * f) * h, base[2] + (d[2] * f + bend[2] * f * f) * h]
    return [c[0] + (s[0] * Math.cos(a) + t[0] * Math.sin(a)) * rr, c[1] + (s[1] * Math.cos(a) + t[1] * Math.sin(a)) * rr, f === 0 ? base[2] : c[2] + (s[2] * Math.cos(a) + t[2] * Math.sin(a)) * rr] as V3
  })
  const rings = prof.map(([rr, f]) => ring(rr, f))
  // smooth radial normals, so the corners weld and the plume shades round
  const nr = (i: number): V3 => {
    const a = (2 * Math.PI * i) / sides + Math.PI / 4
    return [s[0] * Math.cos(a) + t[0] * Math.sin(a), s[1] * Math.cos(a) + t[1] * Math.sin(a), s[2] * Math.cos(a) + t[2] * Math.sin(a)]
  }
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < sides; i++) {
      const j = (i + 1) % sides
      const a = rings[k][i], b = rings[k][j], c = rings[k + 1][j], e = rings[k + 1][i]
      if (prof[k + 1][0] === 0) p.tri(a, b, c, undefined, undefined, undefined, [nr(i), nr(j), d])
      else {
        p.tri(a, b, c, undefined, undefined, undefined, [nr(i), nr(j), nr(j)])
        p.tri(a, c, e, undefined, undefined, undefined, [nr(i), nr(j), nr(i)])
      }
    }
}

/** Points every `step` metres along a polyline, with the unit normal to its left. */
function along(line: XY[], step: number): { p: XY; n: XY; u: number }[] {
  const seg = line.slice(1).map((b, i) => Math.hypot(b[0] - line[i][0], b[1] - line[i][1]))
  const L = seg.reduce((a, b) => a + b, 0), N = Math.round(L / step), out: { p: XY; n: XY; u: number }[] = []
  for (let q = 0; q <= N; q++) {
    let s = (L * q) / N, i = 0
    while (i < seg.length - 1 && s > seg[i]) { s -= seg[i]; i++ }
    const a = line[i], b = line[i + 1], f = s / seg[i]
    const dx = (b[0] - a[0]) / seg[i], dy = (b[1] - a[1]) / seg[i]
    out.push({ p: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f], n: [-dy, dx], u: q / N })
  }
  return out
}

/** Which side of a polyline is convex: the normal pointing away from its chord's midpoint. */
function outward(line: XY[], pt: XY, n: XY): XY {
  const a = line[0], b = line[line.length - 1], m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  return (pt[0] - m[0]) * n[0] + (pt[1] - m[1]) * n[1] >= 0 ? n : [-n[0], -n[1]]
}

const water = new Part(), foam = new Part()

/** A row of jets over a curtain of spray along an arc. */
function arc(line: XY[], step: number, lo: number, hi: number, curtain: number) {
  const pts = along(line, step)
  pts.forEach(({ p, n, u }, k) => {
    const o = outward(line, p, n)
    // a slow wave along the arc, alternating a little, for a mid-show pose
    const h = lo + (hi - lo) * (0.5 + 0.5 * Math.sin(u * Math.PI * 3)) * (k % 2 ? 0.85 : 1)
    const lean = 0.12
    jet(water, [p[0], p[1], 0], [o[0] * lean, o[1] * lean, 1], h, 1.9, 4, [o[0] * 0.25, o[1] * 0.25, 0])
  })
  // the curtain: a ribbon of spray, thicker at the foot, leaning outward
  const cs = along(line, step / 2)
  for (let k = 0; k < cs.length - 1; k++) {
    const A = cs[k], B = cs[k + 1]
    const oa = outward(line, A.p, A.n), ob = outward(line, B.p, B.n)
    const ha = curtain * (0.8 + 0.2 * Math.sin(k * 1.7)), hb = curtain * (0.8 + 0.2 * Math.sin((k + 1) * 1.7))
    const lean = 0.25
    const a0: V3 = [A.p[0], A.p[1], 0], b0: V3 = [B.p[0], B.p[1], 0]
    const a1: V3 = [A.p[0] + oa[0] * ha * lean, A.p[1] + oa[1] * ha * lean, ha], b1: V3 = [B.p[0] + ob[0] * hb * lean, B.p[1] + ob[1] * hb * lean, hb]
    water.quad(a0, b0, b1, a1)
    foam.quad([A.p[0] - oa[0] * 1.2, A.p[1] - oa[1] * 1.2, 0], [B.p[0] - ob[0] * 1.2, B.p[1] - ob[1] * 1.2, 0], [B.p[0] + ob[0] * 0.6, B.p[1] + ob[1] * 0.6, 2.6], [A.p[0] + oa[0] * 0.6, A.p[1] + oa[1] * 0.6, 2.6])
  }
}

arc(LONG_ARC, 8.5, 24, 44, 12)
arc(SHORT_ARC, 8, 20, 30, 9)

for (const [c, r, shooter, dbl] of RINGS) {
  const n = dbl ? 14 : 11, lean = Math.tan((15 * Math.PI) / 180)
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * (i + 0.5)) / n, ca = Math.cos(a), sa = Math.sin(a)
    jet(water, [c[0] + ca * r, c[1] + sa * r, 0], [ca * lean, sa * lean, 1], dbl ? 28 : 22, 1.9, 4, [ca * 0.45, sa * 0.45, 0])
  }
  if (dbl) for (let i = 0; i < 8; i++) {
    const a = (2 * Math.PI * i) / 8
    jet(water, [c[0] + Math.cos(a) * r * 0.5, c[1] + Math.sin(a) * r * 0.5, 0], [Math.cos(a) * 0.08, Math.sin(a) * 0.08, 1], 40, 2)
  }
  if (shooter) jet(water, [c[0], c[1], 0], [0, 0, 1], shooter, 3.2, 6)
  // the foam ring where the crown boils up: a short double-sided band
  const m = dbl ? 20 : 14
  for (let i = 0; i < m; i++) {
    const a0 = (2 * Math.PI * i) / m, a1 = (2 * Math.PI * (i + 1)) / m
    const P = (a: number, rr: number, z: number): V3 => [c[0] + Math.cos(a) * rr, c[1] + Math.sin(a) * rr, z]
    foam.quad(P(a0, r - 1.5, 0), P(a1, r - 1.5, 0), P(a1, r + 1.2, 3), P(a0, r + 1.2, 3))
  }
}

const lit = () => 1
await writeModel('dubai-fountain', 'The Dubai Fountain', [
  { part: water, material: { ...finish('fountain-water', 0xdceff7, 0.3), opacity: 0.72, doubleSided: true, floodlight: lit } },
  { part: foam, material: { ...finish('fountain-foam', 0xf7fafb, 0.5), opacity: 0.85, doubleSided: true, floodlight: lit } },
], { bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 120, replaces: [] })
