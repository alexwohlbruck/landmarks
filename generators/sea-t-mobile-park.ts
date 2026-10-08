/**
 * T-Mobile Park (1999, NBBJ), Seattle: procedural, CC0-1.0.
 * bun generators/sea-t-mobile-park.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built straight in
 * the lidar's frame. The origin is the point given for the stadium in the
 * batch plan (-122.33251, 47.59140), near the middle of the field; y = 0
 * is the street level around the ballpark (5.0 m NAVD88). The field sits
 * 1.4 m below it.
 *
 * A stadium is its stands, roofs and towers, so the field is left to the
 * map. Form: a grandstand wrapping the field from the left-field corner
 * round home plate (south-west) to right field, its upper deck under a
 * steel canopy; a low brick block and the big scoreboard behind left field
 * (north); low stands in right field. The retractable roof is shown open,
 * as in most daylight aerials: its three panels parked one above another
 * over the railway east of right field, a shallow barrel 66 m high crossed
 * by four great arched trusses that run north-south and stand on tall legs
 * at each end, rolling on elevated runways along the north and south.
 *
 * Measured (USGS 3DEP WA_KingCo_1_2021, 1 m surface model, heights above
 * y = 0; the 2021 flight caught the roof open):
 * - the parked roof: from y -107 to 97, its west and east edges skewed 7.4
 *   degrees east of north (x = 81 and 164.5 m at y = 0, plus 0.13 m per
 *   metre north); its skin 66 m at the crown falling to 48-49 m at the
 *   ends (a circular arc fits within a metre at 60 m out); curved skirts
 *   bulging up to 13 m beyond its east side and 5 m beyond its west at
 *   mid-length, dropping to 44 m;
 * - the four trusses at x = 86, 112, 139 and 164 at y = 0 (the same skew),
 *   their top chords 81 m at the crown and 54 m at the ends;
 * - the runways under the roof's ends at 10-17 m;
 * - the grandstand: outer concourse roof 23 m, the upper deck's canopy
 *   37-41 m over the band OSM maps as way/1451834523, the suite level 20 m
 *   in front of it, the lower deck down to the field wall;
 * - the left-field block 18 m; the scoreboard's top 41 m; right-field
 *   stands about 16 m (OSM's 20 m steps).
 * Published: roof 9 acres, 22 million lb, three panels (Wikipedia,
 * "T-Mobile Park").
 * From photos: the arched lattice trusses on the roof and their legs, the
 * dark steel, the tan-grey roof membrane, the red brick and dark green
 * steel of the grandstand, the canopy over the upper deck, the dark green
 * seats.
 * Estimated: the stand cross-section between the lidar's levels; the
 * trusses drawn as a top chord with bold diagonals rather than the full
 * lattice; the legs' and runways' sections; the right-field stands under
 * the roof (no view from above); the skirts' outline.
 * Left out: the field (the map's), the lettering on the roof (signage),
 * light towers, the garage south of the ballpark (another building).
 *
 * Photos: /tmp/city/sea/work/sea-t-mobile-park/credits.txt (brewbooks,
 * CC BY-SA 2.0, the closed roof from above; TheConduqtor, CC BY-SA 3.0, the
 * parked roof from the east; Ron Clausen, CC BY-SA 4.0; Visitor7, CC BY-SA
 * 3.0; MyName (Cacophony), CC BY-SA 3.0, the roof's edge from inside).
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

const brick = new Part(), steel = new Part(), roof = new Part(), seats = new Part(), trim = new Part(), win = new Part()

function poly(p: Part, P: V3[], n: V3) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const Q = dot(f, n) >= 0 ? P : [...P].reverse()
  for (let i = 1; i < Q.length - 1; i++) p.tri(Q[0], Q[i], Q[i + 1])
}
function box(p: Part, cx: number, cy: number, hx: number, hy: number, z0: number, z1: number, bottom = false) {
  const r: XY[] = [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]]
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  poly(p, r.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, r.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
/** A square bar from A to B, `h` its half width, capped. */
function bar(p: Part, A: V3, B: V3, h: number) {
  const ax = unit(sub(B, A))
  const up: V3 = Math.abs(ax[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const u = unit(cross(ax, up)), v = cross(u, ax)
  const c = (P: V3, a: number, b: number): V3 => [P[0] + u[0] * a + v[0] * b, P[1] + u[1] * a + v[1] * b, P[2] + u[2] * a + v[2] * b]
  const sq: [number, number][] = [[-h, -h], [h, -h], [h, h], [-h, h]]
  for (let i = 0; i < 4; i++) {
    const [a0, b0] = sq[i], [a1, b1] = sq[(i + 1) % 4]
    poly(p, [c(A, a0, b0), c(A, a1, b1), c(B, a1, b1), c(B, a0, b0)], unit([u[0] * (a0 + a1) + v[0] * (b0 + b1), u[1] * (a0 + a1) + v[1] * (b0 + b1), u[2] * (a0 + a1) + v[2] * (b0 + b1)]))
  }
  poly(p, sq.map(([a, b]) => c(B, a, b)), ax)
  poly(p, sq.map(([a, b]) => c(A, a, b)), [-ax[0], -ax[1], -ax[2]])
}

// -------------------------------------------------------- the grandstand ---
// The upper deck's band from OSM way/1451834523, from the left-field corner
// round home plate to right field: its outer and inner edges.
const OUTER: XY[] = [[-60, 86], [-70.7, 77.3], [-88.0, 35.7], [-95.0, 6.6], [-97.4, -10.2], [-98.8, -28.2], [-97.7, -45.9], [-95.0, -57.1],
  [-86.4, -70.7], [-77.6, -79.4], [-66.1, -87.6], [-53.7, -94.7], [-39.5, -99.1], [-31.4, -99.5], [20.2, -99.5], [55.9, -90.2],
  [77.6, -82.7], [91.5, -71.2], [107.4, 8.4]]
const INNER: XY[] = [[-45, 74], [-56.6, 61.4], [-63.4, 46.0], [-71.7, 24.6], [-76.6, 1.0], [-79.9, -20.9], [-81.3, -34.4], [-80.7, -44.6],
  [-77.2, -54.7], [-68.4, -67.3], [-57.8, -76.8], [-30.0, -85.2], [19.8, -83.8], [39.9, -78.7], [62.3, -72.9], [70.4, -65.1],
  [77.0, -58.6], [80.1, -49.2], [82.7, -41.6], [92.3, 7.8]]
function resample(P: XY[], n: number): XY[] {
  const L = [0]
  for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]))
  const out: XY[] = []
  for (let k = 0; k < n; k++) {
    const s = (L[L.length - 1] * k) / (n - 1)
    let i = 1
    while (i < L.length - 1 && L[i] < s) i++
    const t = (s - L[i - 1]) / (L[i] - L[i - 1] || 1)
    out.push([P[i - 1][0] + (P[i][0] - P[i - 1][0]) * t, P[i - 1][1] + (P[i][1] - P[i - 1][1]) * t])
  }
  // Two passes of smoothing so OSM's corners read as the curve they are.
  for (let pass = 0; pass < 2; pass++)
    for (let k = 1; k < n - 1; k++) out[k] = [(out[k - 1][0] + 2 * out[k][0] + out[k + 1][0]) / 4, (out[k - 1][1] + 2 * out[k][1] + out[k + 1][1]) / 4]
  return out
}
{
  const M = 56
  const O = resample(OUTER, M), I = resample(INNER, M)
  // A cross-section at each sample, outside to field: [point, height].
  const sections = O.map((o, k) => {
    const i = I[k]
    const d: XY = [i[0] - o[0], i[1] - o[1]], dl = Math.hypot(...d), n: XY = [d[0] / dl, d[1] / dl]
    const at = (s: number): XY => [o[0] + n[0] * s, o[1] + n[1] * s] // s from the deck's outer edge, inwards
    return {
      facade: at(-10), deck0: at(0), deck1: at(dl), suite: at(dl + 7), field: at(dl + 22),
      n,
    }
  })
  const ZC = 23, ZU = 38.5, ZS = 20, ZF = -1.4
  for (let k = 0; k < M - 1; k++) {
    const a = sections[k], b = sections[k + 1]
    const out: V3 = [-(a.n[0] + b.n[0]), -(a.n[1] + b.n[1]), 0]
    const P3 = (p: XY, z: number): V3 => [p[0], p[1], z]
    // Facade: brick to the concourse roof.
    poly(brick, [P3(a.facade, 0), P3(b.facade, 0), P3(b.facade, ZC), P3(a.facade, ZC)], out)
    // The concourse roof out to the upper deck.
    poly(roof, [P3(a.facade, ZC), P3(b.facade, ZC), P3(b.deck0, ZC), P3(a.deck0, ZC)], [0, 0, 1])
    // The upper deck's back wall, brick up to its canopy.
    poly(brick, [P3(a.deck0, ZC), P3(b.deck0, ZC), P3(b.deck0, ZU), P3(a.deck0, ZU)], out)
    // The canopy: a flat roof over the deck, its front edge in steel.
    poly(roof, [P3(a.deck0, ZU), P3(b.deck0, ZU), P3(b.deck1, ZU), P3(a.deck1, ZU)], [0, 0, 1])
    poly(steel, [P3(a.deck1, ZU - 1.6), P3(b.deck1, ZU - 1.6), P3(b.deck1, ZU), P3(a.deck1, ZU)], [-out[0], -out[1], 0])
    poly(steel, [P3(a.deck0, ZU - 1.6), P3(b.deck0, ZU - 1.6), P3(b.deck1, ZU - 1.6), P3(a.deck1, ZU - 1.6)], [0, 0, -1])
    // Upper deck seats under it, down to the suite level's front.
    poly(seats, [P3(a.deck0, ZU - 5), P3(b.deck0, ZU - 5), P3(b.deck1, ZS + 1.5), P3(a.deck1, ZS + 1.5)], [-out[0], -out[1], 2])
    poly(trim, [P3(a.deck1, ZS), P3(b.deck1, ZS), P3(b.deck1, ZS + 1.5), P3(a.deck1, ZS + 1.5)], [-out[0], -out[1], 0])
    // The suite level's roof, then the lower deck to the field wall.
    poly(roof, [P3(a.deck1, ZS), P3(b.deck1, ZS), P3(b.suite, ZS), P3(a.suite, ZS)], [0, 0, 1])
    poly(seats, [P3(a.suite, ZS), P3(b.suite, ZS), P3(b.field, 1.6), P3(a.field, 1.6)], [-out[0], -out[1], 2])
    poly(brick, [P3(a.field, ZF), P3(b.field, ZF), P3(b.field, 1.6), P3(a.field, 1.6)], [-out[0], -out[1], 0])
    // Glazed bays in the facade, every other section.
    if (k % 2 === 0) {
      const m: XY = [(a.facade[0] + b.facade[0]) / 2, (a.facade[1] + b.facade[1]) / 2]
      const t: XY = [b.facade[0] - a.facade[0], b.facade[1] - a.facade[1]], tl = Math.hypot(...t)
      const u: XY = [t[0] / tl, t[1] / tl], no = unit(out)
      const w = Math.min(6, tl * 0.75)
      const W = (s: number, z: number): V3 => [m[0] + u[0] * s + no[0] * 0.06, m[1] + u[1] * s + no[1] * 0.06, z]
      poly(win, [W(-w / 2, 4), W(w / 2, 4), W(w / 2, 19), W(-w / 2, 19)], [no[0], no[1], 0])
    }
  }
  // Close both ends of the C with the cross-section's outline.
  for (const [s, sign] of [[sections[0], -1], [sections[M - 1], 1]] as const) {
    const nb = sections[sign < 0 ? 1 : M - 2]
    const ax = unit([s.deck0[0] - nb.deck0[0], s.deck0[1] - nb.deck0[1], 0])
    const prof: [XY, number][] = [[s.facade, ZC], [s.deck0, ZC], [s.deck0, ZU], [s.deck1, ZU], [s.deck1, ZS], [s.suite, ZS], [s.field, 1.6]]
    for (let i = 0; i < prof.length - 1; i++) {
      const [p0, z0] = prof[i], [p1, z1] = prof[i + 1]
      if (Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) < 0.01) continue
      poly(brick, [[p0[0], p0[1], 0], [p1[0], p1[1], 0], [p1[0], p1[1], z1], [p0[0], p0[1], z0]], ax)
    }
  }
}

// ------------------------------------------- left field: block, scoreboard ---
box(brick, 18, 92, 76, 6, 0, 18)
box(brick, 26, 81, 19, 1.6, 18, 41, true)
poly(seats, [[8, 79.35, 21], [44, 79.35, 21], [44, 79.35, 40], [8, 79.35, 40]], [0, -1, 0])
// Bleachers in front of the block, down to the outfield wall.
poly(seats, [[-40, 86, 15], [94, 86, 15], [94, 74, 1.6], [-40, 74, 1.6]], [0, -1, 1])
poly(brick, [[-40, 74, -1.4], [94, 74, -1.4], [94, 74, 1.6], [-40, 74, 1.6]], [0, -1, 0])
// ------------------------------------------------- right field stands ---
poly(seats, [[94, 74, 16], [94, 10, 16], [70, 10, 1.6], [70, 74, 1.6]], [-1, 0, 1])
box(brick, 98, 42, 4, 32, 0, 16)
poly(brick, [[70, 74, 0], [94, 74, 0], [94, 74, 16], [70, 74, 1.6]], [0, 1, 0])

// --------------------------------------------------- the parked roof ---
const SK = 0.13                             // the skew: x per metre of y
const S0 = 81, S1 = 164.5                   // west and east edges at y = 0
const YN = 97, YS = -107, YC = (YN + YS) / 2, HALF = (YN - YS) / 2
const ZCROWN = 66, ZEND = 48.5
const RR = (HALF * HALF + (ZCROWN - ZEND) ** 2) / (2 * (ZCROWN - ZEND))
const zSkin = (y: number) => ZCROWN - RR + Math.sqrt(Math.max(0, RR * RR - (y - YC) ** 2))
const X = (s: number, y: number) => s + SK * y
{
  const NY = 20, NS = 6
  const ys = Array.from({ length: NY + 1 }, (_, j) => YS + ((YN - YS) * j) / NY)
  const nrm = (y: number): V3 => unit([0, -(y - YC) / Math.sqrt(RR * RR - (y - YC) ** 2), 1])
  for (let j = 0; j < NY; j++) for (let k = 0; k < NS; k++) {
    const s0 = S0 + ((S1 - S0) * k) / NS, s1 = S0 + ((S1 - S0) * (k + 1)) / NS
    const y0 = ys[j], y1 = ys[j + 1]
    const P: V3[] = [[X(s0, y0), y0, zSkin(y0)], [X(s1, y0), y0, zSkin(y0)], [X(s1, y1), y1, zSkin(y1)], [X(s0, y1), y1, zSkin(y1)]]
    const N = [nrm(y0), nrm(y0), nrm(y1), nrm(y1)]
    roof.tri(P[0], P[1], P[2], undefined, undefined, undefined, [N[0], N[1], N[2]])
    roof.tri(P[0], P[2], P[3], undefined, undefined, undefined, [N[0], N[2], N[3]])
    poly(roof, P.map((p) => [p[0], p[1], p[2] - 3] as V3), [0, 0, -1])
  }
  // The deep edge band along both ends, in steel.
  for (const y of [YN, YS]) {
    const sgn = y > 0 ? 1 : -1
    poly(steel, [[X(S0, y), y, zSkin(y) - 6], [X(S1, y), y, zSkin(y) - 6], [X(S1, y), y, zSkin(y)], [X(S0, y), y, zSkin(y)]], [0, sgn, 0])
  }
  // Curved skirts on both long sides, sloping down to 44 m.
  for (const [edge, bulge, sgn] of [[S1, 13, 1], [S0, 5, -1]] as const) {
    const NB = 12, y0 = -67, y1 = 63
    for (let j = 0; j < NB; j++) {
      const ya = y0 + ((y1 - y0) * j) / NB, yb = y0 + ((y1 - y0) * (j + 1)) / NB
      const b = (y: number) => bulge * Math.sqrt(Math.max(0, 1 - ((y - (y0 + y1) / 2) / ((y1 - y0) / 2)) ** 2))
      const top = (y: number): V3 => [X(edge, y), y, zSkin(y)]
      const foot = (y: number): V3 => [X(edge + sgn * b(y), y), y, 44]
      poly(roof, [top(ya), top(yb), foot(yb), foot(ya)], [sgn, 0, 1])
      poly(steel, [foot(ya), foot(yb), [foot(yb)[0], yb, 44 - 3], [foot(ya)[0], ya, 44 - 3]], [sgn, 0, 0])
    }
  }
  // Below the sides outside the skirts, a steel edge band.
  for (const [edge, sgn] of [[S1, 1], [S0, -1]] as const) {
    for (const [ya, yb] of [[YS, -67], [63, YN]]) {
      const NB = 4
      for (let j = 0; j < NB; j++) {
        const y0 = ya + ((yb - ya) * j) / NB, y1 = ya + ((yb - ya) * (j + 1)) / NB
        poly(steel, [[X(edge, y0), y0, zSkin(y0) - 6], [X(edge, y1), y1, zSkin(y1) - 6], [X(edge, y1), y1, zSkin(y1)], [X(edge, y0), y0, zSkin(y0)]], [sgn, 0, 0])
      }
    }
  }
}
// The trusses: an arched top chord over the skin, bold diagonals between.
{
  const TC = 81, TE = 54
  const RT = (HALF * HALF + (TC - TE) ** 2) / (2 * (TC - TE))
  const zTop = (y: number) => TC - RT + Math.sqrt(Math.max(0, RT * RT - (y - YC) ** 2))
  for (const s of [86, 112, 139, 163.5]) {
    const NSEG = 16
    const ys = Array.from({ length: NSEG + 1 }, (_, j) => YS + ((YN - YS) * j) / NSEG)
    for (let j = 0; j < NSEG; j++) {
      const a: V3 = [X(s, ys[j]), ys[j], zTop(ys[j])], b: V3 = [X(s, ys[j + 1]), ys[j + 1], zTop(ys[j + 1])]
      bar(steel, a, b, 1.4)
      // A diagonal from the chord down to the skin, alternating.
      const yl = j % 2 === 0 ? ys[j + 1] : ys[j]
      const yh = j % 2 === 0 ? ys[j] : ys[j + 1]
      bar(steel, [X(s, yh), yh, zTop(yh) - 0.8], [X(s, yl), yl, zSkin(yl) + 0.3], 0.75)
    }
    // Legs at both ends, from the runways up to the roof's ends.
    for (const y of [YN - 1.5, YS + 1.5]) {
      bar(steel, [X(s, y), y, 13], [X(s, y), y, zTop(y)], 1.8)
    }
  }
  // The runways: elevated girders across the north and south ends.
  for (const y of [YN - 1.5, YS + 1.5]) {
    bar(steel, [X(60, y), y, 11.5], [X(186, y), y, 11.5], 1.8)
    for (const s of [64, 96, 128, 160, 184]) bar(steel, [X(s, y), y, 0], [X(s, y), y, 11.5], 1.2)
  }
}

// ---------------------------------------------------------------- output ---
// Colours from the daylight photos: red-brown brick pulled light; the dark
// green-grey steel kept dark as it is the roof's identity, but no darker
// than charcoal; the tan-grey roof membrane; dark green seats.
const parts = [
  { part: brick, material: finish('tmp-brick', 0xb67a66) },
  { part: steel, material: finish('tmp-steel', 0x5a6466) },
  { part: roof, material: finish('tmp-roof', 0xb3b2aa) },
  { part: seats, material: finish('tmp-seats', 0x5a6f69) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('T-Mobile Park', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 81,
})
await Bun.write(new URL('../models/sea-t-mobile-park.glb', import.meta.url), glb)
console.log(`sea-t-mobile-park.glb: ${triangles} triangles, ${glb.length} bytes`)
