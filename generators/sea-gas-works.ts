/**
 * Gas Works Park: the Seattle Gas Light Company's gasification plant
 * (1906-1956), kept as ruins when the park was made (Richard Haag, 1975):
 * procedural, CC0-1.0.
 * bun generators/sea-gas-works.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * middle of the generator towers' cluster. y = 0 is the lowest ground under
 * the model, by the Play Barn (7.8 m NAVD88); the towers stand on ground
 * 2.7 m higher, so their bases run down into it.
 *
 * Form: two groups of rusted generator towers in a north-south line. The
 * north group is four squat domed generators in a row on a deck, with slim
 * scrubber cylinders beside them and a tall tower standing in front (west);
 * the south group is two taller domed towers in a steel frame with their
 * stacks. Overhead pipes at 4-9 m tie them together and run west and south.
 * East of them stand a tall column and smaller vessels joined by a sloping
 * pipe, and beyond those the two long gabled sheds of the old exhauster and
 * boiler houses (now the Play Barn and picnic shelter).
 *
 * Measured (USGS 3DEP WA_KingCo_1_2021, 0.5 m surface model): every
 * vessel's position, diameter and top (generators: shells to 10.6 m above
 * their ground, domes to 14.2 m and their hatches to 15.3 m; the south
 * towers' domes to 20.5-22 m, their frame to 17 m, the stacks to 22, 22.7
 * and 27.3 m; the tall west tower 22.2 m; the east column 25 m); the pipes' runs and heights; the sheds' eaves and ridges
 * (south shed ridge 12.6 m, north shed 10.2 m with its 14 m west end).
 * OSM: the vessels' footprints (ways 191328724-736, 449626306-315), the
 * pipelines (191328710-727, 1418097788, 406480504-506), the sheds
 * (52137309, 52137316); OSM sits about 2 m west of the lidar at the pipes,
 * so the lidar positions are used.
 * Published: plant built 1906, closed 1956; NRHP 2013 (Wikipedia, "Gas
 * Works Park").
 * From photos: the dark weathered rust (#6b4a3e) and darker iron (#594640)
 * colours, kept above charcoal, the domes, the frames round
 * the south towers, the decks between the generators, the pipe runs.
 * Estimated: frame and deck layout (bold simplified), pipe diameters
 * (1.4-1.5 m, a little over the real ones so they read), the sheds' walls
 * and openings (from one aerial only). A thin stack north-west of the
 * generators in older photos does not show in the 2021 lidar and is left
 * out.
 * Left out: ladders, railings, catwalk grating, valves, graffiti, the
 * fence, Kite Hill and the ground (the map's).
 *
 * Photos: /tmp/city/sea/work/sea-gas-works/credits.txt.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const rust = new Part(), iron = new Part(), wall = new Part(), roof = new Part(), win = new Part()

// Positions below are in the survey frame used for the lidar; shift to the
// model's origin (the towers' middle).
const OX = 5, OY = -8
const L = (x: number, y: number): XY => [x - OX, y - OY]

function poly(p: Part, P: V3[], n: V3) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const Q = dot(f, n) >= 0 ? P : [...P].reverse()
  for (let i = 1; i < Q.length - 1; i++) p.tri(Q[0], Q[i], Q[i + 1])
}
/** A smooth upright cylinder; `top` caps it flat. */
function cyl(p: Part, sx: number, sy: number, r: number, z0: number, z1: number, top = true, seg = 14) {
  const [cx, cy] = L(sx, sy)
  for (let k = 0; k < seg; k++) {
    const a0 = (k / seg) * 2 * Math.PI, a1 = ((k + 1) / seg) * 2 * Math.PI
    const P = (a: number, z: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
    const N = (a: number): V3 => [Math.cos(a), Math.sin(a), 0]
    p.tri(P(a0, z0), P(a1, z0), P(a1, z1), undefined, undefined, undefined, [N(a0), N(a1), N(a1)])
    p.tri(P(a0, z0), P(a1, z1), P(a0, z1), undefined, undefined, undefined, [N(a0), N(a1), N(a0)])
    if (top) p.tri([cx, cy, z1], P(a0, z1), P(a1, z1))
  }
}
/** A shallow dome (spherical cap) of height h on a cylinder of radius r. */
function dome(p: Part, sx: number, sy: number, r: number, z0: number, h: number, seg = 14) {
  const [cx, cy] = L(sx, sy)
  const R = (r * r + h * h) / (2 * h), zc = z0 + h - R
  const rings = 3
  const ring = (j: number) => {
    const t = Math.asin(r / R) * (1 - j / rings)
    return { rr: R * Math.sin(t), z: zc + R * Math.cos(t) }
  }
  for (let j = 0; j < rings; j++) {
    const a = ring(j), b = ring(j + 1)
    for (let k = 0; k < seg; k++) {
      const a0 = (k / seg) * 2 * Math.PI, a1 = ((k + 1) / seg) * 2 * Math.PI
      const P = (q: { rr: number; z: number }, t: number): V3 => [cx + q.rr * Math.cos(t), cy + q.rr * Math.sin(t), q.z]
      const N = (q: { rr: number; z: number }, t: number): V3 => {
        const v: V3 = [q.rr * Math.cos(t), q.rr * Math.sin(t), q.z - zc]
        const l = Math.hypot(...v); return [v[0] / l, v[1] / l, v[2] / l]
      }
      if (j < rings - 1) {
        p.tri(P(a, a0), P(a, a1), P(b, a1), undefined, undefined, undefined, [N(a, a0), N(a, a1), N(b, a1)])
        p.tri(P(a, a0), P(b, a1), P(b, a0), undefined, undefined, undefined, [N(a, a0), N(b, a1), N(b, a0)])
      } else p.tri(P(a, a0), P(a, a1), P(b, 0), undefined, undefined, undefined, [N(a, a0), N(a, a1), [0, 0, 1]])
    }
  }
}
/** A box between two survey corners, chamfered. */
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const [a, b] = [L(x0, y0), L(x1, y1)]
  const c = Math.min(0.3, (b[0] - a[0]) * 0.25, (b[1] - a[1]) * 0.25)
  const r: XY[] = [[a[0] + c, a[1]], [b[0] - c, a[1]], [b[0], a[1] + c], [b[0], b[1] - c], [b[0] - c, b[1]], [a[0] + c, b[1]], [a[0], b[1] - c], [a[0], a[1] + c]]
  for (let i = 0; i < r.length; i++) {
    const u = r[i], v = r[(i + 1) % r.length]
    p.quad([u[0], u[1], z0], [v[0], v[1], z0], [v[0], v[1], z1], [u[0], u[1], z1])
  }
  poly(p, r.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  poly(p, r.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
/** A round pipe (8 sides) along survey points [x, y, z], smooth-shaded. */
function pipe(p: Part, pts: V3[], r = 0.75) {
  const Q = pts.map(([x, y, z]) => [...L(x, y), z] as V3)
  for (let i = 0; i < Q.length - 1; i++) {
    const a = Q[i], b = Q[i + 1]
    const d = sub(b, a), l = Math.hypot(...d), t: V3 = [d[0] / l, d[1] / l, d[2] / l]
    const up: V3 = Math.abs(t[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
    let u = cross(t, up); const ul = Math.hypot(...u); u = [u[0] / ul, u[1] / ul, u[2] / ul]
    const w = cross(u, t)
    // extend each segment by r at both ends so bends close up
    const A: V3 = [a[0] - t[0] * r * 0.5, a[1] - t[1] * r * 0.5, a[2] - t[2] * r * 0.5]
    const B: V3 = [b[0] + t[0] * r * 0.5, b[1] + t[1] * r * 0.5, b[2] + t[2] * r * 0.5]
    const S = 8
    for (let k = 0; k < S; k++) {
      const a0 = (k / S) * 2 * Math.PI, a1 = ((k + 1) / S) * 2 * Math.PI
      const n0: V3 = [u[0] * Math.cos(a0) + w[0] * Math.sin(a0), u[1] * Math.cos(a0) + w[1] * Math.sin(a0), u[2] * Math.cos(a0) + w[2] * Math.sin(a0)]
      const n1: V3 = [u[0] * Math.cos(a1) + w[0] * Math.sin(a1), u[1] * Math.cos(a1) + w[1] * Math.sin(a1), u[2] * Math.cos(a1) + w[2] * Math.sin(a1)]
      const P = (c: V3, n: V3): V3 => [c[0] + n[0] * r, c[1] + n[1] * r, c[2] + n[2] * r]
      p.tri(P(A, n0), P(B, n0), P(B, n1), undefined, undefined, undefined, [n0, n0, n1])
      p.tri(P(A, n0), P(B, n1), P(A, n1), undefined, undefined, undefined, [n0, n1, n1])
    }
  }
}

// ---------------------------------------------------- the north group ---
// Heights are above y = 0; the towers' own ground is at 2.7 m.
const G = 2.7
for (const [y, r] of [[-7.6, 3.45], [1.75, 3.45], [15.75, 3.45], [25.1, 3.1]]) {
  cyl(rust, 11, y, r, 0, 13.3, false)
  dome(rust, 11, y, r, 13.3, 3.6)
  cyl(iron, 11, y, 0.75, 16.5, 18.0)
  // a band where the shell meets the deck
  cyl(iron, 11, y, r + 0.25, 11.6, 12.4, true)
}
// the deck between the generators, on posts
for (const [y0, y1] of [[-4.3, -1.6], [5.0, 12.4], [19.0, 22.2]]) {
  box(iron, 6.5, y0, 16.5, y1, 12.0, 13.1)
  for (const x of [7, 16]) box(iron, x - 0.35, (y0 + y1) / 2 - 0.35, x + 0.35, (y0 + y1) / 2 + 0.35, 0, 12)
}
// the long pipe on the generators' east side
pipe(iron, [[15.4, 28.4, 11.8], [15.2, -13.9, 11.8], [15.2, -13.9, 7.4], [11, -14, 7.4], [11, -29.7, 7.4]])
// slim scrubbers beside the row, and the tall tower in front of it
cyl(rust, 0.7, -2.5, 1.45, 0, 16.8)
cyl(rust, 1.1, 20.4, 1.4, 0, 16.8)
cyl(iron, -11, 9, 1.8, 0, 24.3)
box(iron, -12.6, 7.4, -9.4, 10.6, 23.9, 24.9)
cyl(rust, -19.65, 13.5, 1.45, 0, 10.3)
cyl(rust, -19.75, 18.3, 1.45, 0, 10.3)

// ---------------------------------------------------- the south group ---
cyl(rust, 6.25, -39.5, 3.4, 0, 22.3, false)
dome(rust, 6.25, -39.5, 3.4, 22.3, 2.2)
cyl(iron, 6.25, -39.5, 0.75, 24.2, 25.2)
cyl(rust, 6.2, -31.75, 3.2, 0, 21.3, false)
dome(rust, 6.2, -31.75, 3.2, 21.3, 2.2)
// the steel frame round them: corner posts and two decks
{
  const x0 = 1.8, x1 = 13.6, y0 = -44.2, y1 = -27.6
  for (const x of [x0, x1]) for (const y of [y0, (y0 + y1) / 2, y1]) box(iron, x - 0.45, y - 0.45, x + 0.45, y + 0.45, 0, 19)
  for (const z of [9, 16.5]) {
    box(iron, x0 - 0.5, y0 - 0.5, x1 + 0.5, y0 + 1.0, z, z + 0.9)
    box(iron, x0 - 0.5, y1 - 1.0, x1 + 0.5, y1 + 0.5, z, z + 0.9)
    box(iron, x0 - 0.5, y0 + 1.0, x0 + 1.0, y1 - 1.0, z, z + 0.9)
    box(iron, x1 - 1.0, y0 + 1.0, x1 + 0.5, y1 - 1.0, z, z + 0.9)
  }
  box(iron, x0 - 0.5, y0 - 0.5, x1 + 0.5, y1 + 0.5, 19, 19.6)
}
// stacks
cyl(iron, 11.6, -31.7, 0.9, 0, 25.4)
cyl(iron, 11.5, -39.6, 0.95, 0, 30)
cyl(iron, -2.7, -31.6, 1.4, 0, 24.5)
// small vessels on the west side
cyl(rust, -0.5, -35.6, 1.45, 0, 14.3)
cyl(rust, -3.5, -39.5, 1.2, 0, 14.3)

// ------------------------------------------------ the pipes to the west ---
pipe(iron, [[-25.3, 28, 0], [-25.3, 28, 7.0], [-20.3, 13.9, 7.0], [-20.3, -11.9, 7.0], [-8.4, -24, 7.0], [-7.3, -28.5, 7.0], [-3.5, -28.6, 7.0], [-3.5, -34.2, 7.0], [0.4, -34.3, 7.0]])
pipe(iron, [[-1.7, 18.3, 7.9], [-1.8, 11.7, 7.9], [-2.1, -1.8, 7.9], [-2.1, -1.8, 0]])
pipe(iron, [[-1.8, 11.7, 7.9], [-14.3, 12.2, 7.9]])
pipe(iron, [[-14.3, 8.2, 8.3], [-14.3, 12.2, 8.3], [-14.3, 23.8, 8.3], [-15.2, 25.5, 8.3], [-23, 25.5, 8.3], [-23, 25.5, 0]])
pipe(iron, [[-1.7, 18.3, 7.9], [7.5, 18.3, 7.9]])
pipe(iron, [[-2.1, -1.8, 7.9], [7.5, -1.8, 7.9]])

// --------------------------------------------- the east column and vessels ---
cyl(rust, 71.4, 49.4, 1.95, 0, 27.2)
cyl(rust, 50.9, 34.7, 1.7, 0, 14.6)
cyl(rust, 69.7, 67.6, 1.7, 0, 11.7)
cyl(rust, 61.2, 68.0, 1.75, 0, 11.6)
cyl(rust, 44.2, 41.5, 1.6, 0, 6.2)
pipe(iron, [[52.2, 35.9, 12], [68.6, 50.5, 6]], 0.75)
pipe(iron, [[45.9, 40.8, 0], [45.9, 40.8, 8.2], [50.4, 40.5, 8.2], [70.1, 47.9, 8.2]], 0.7)
pipe(iron, [[62.6, 68.6, 8], [68.0, 67.8, 8]], 0.7)

// ------------------------------------------------------- the two sheds ---
/** A gabled shed along x: walls in `wall`, roof in `roof`, openings. */
function shed(x0: number, x1: number, y0: number, y1: number, eave0: number, eave1: number, ridge: number, yr: number) {
  const [a, b] = [L(x0, y0), L(x1, y1)]
  const yR = yr - OY, O = 0.6
  // walls
  wall.quad([a[0], a[1], 0], [b[0], a[1], 0], [b[0], a[1], eave0], [a[0], a[1], eave0])
  wall.quad([b[0], b[1], 0], [a[0], b[1], 0], [a[0], b[1], eave1], [b[0], b[1], eave1])
  for (const [x, s] of [[a[0], -1], [b[0], 1]] as XY[]) {
    poly(wall, [[x, a[1], 0], [x, b[1], 0], [x, b[1], eave1], [x, yR, ridge], [x, a[1], eave0]], [s, 0, 0])
  }
  // roof planes with a small overhang
  const sl0 = (ridge - eave0) / (yR - a[1]), sl1 = (ridge - eave1) / (b[1] - yR)
  poly(roof, [[a[0] - O, a[1] - O, eave0 - sl0 * O], [b[0] + O, a[1] - O, eave0 - sl0 * O], [b[0] + O, yR, ridge], [a[0] - O, yR, ridge]], [0, -1, 1])
  poly(roof, [[a[0] - O, b[1] + O, eave1 - sl1 * O], [b[0] + O, b[1] + O, eave1 - sl1 * O], [b[0] + O, yR, ridge], [a[0] - O, yR, ridge]], [0, 1, 1])
  // broad openings along the long sides, one per 6 m bay
  const n = Math.round((b[0] - a[0]) / 6), w = (b[0] - a[0]) / n
  for (let k = 0; k < n; k++) {
    const xc = a[0] + w * (k + 0.5)
    poly(win, [[xc - w * 0.33, a[1] - 0.06, 1.2], [xc + w * 0.33, a[1] - 0.06, 1.2], [xc + w * 0.33, a[1] - 0.06, eave0 - 1.2], [xc - w * 0.33, a[1] - 0.06, eave0 - 1.2]], [0, -1, 0])
    poly(win, [[xc - w * 0.33, b[1] + 0.06, 1.2], [xc + w * 0.33, b[1] + 0.06, 1.2], [xc + w * 0.33, b[1] + 0.06, eave1 - 1.2], [xc - w * 0.33, b[1] + 0.06, eave1 - 1.2]], [0, 1, 0])
  }
}
shed(90, 137.5, 70.6, 86.5, 7.3, 7.3, 12.6, 78.5)
shed(97.3, 141, 89.6, 104.8, 7.1, 6.0, 10.2, 96)
shed(89.1, 97.3, 88.2, 100.4, 11, 11, 13.9, 94.3)
// the low annexes at the south shed's ends, flat-roofed
box(wall, 85.4, 73.1, 90, 82.8, 0, 7.8)
box(wall, 137.5, 73.3, 140.1, 82.3, 0, 7)
void G

// ---------------------------------------------------------------- output ---
const parts = [
  { part: rust, material: finish('gasworks-rust', 0x6b4a3e) },
  { part: iron, material: finish('gasworks-iron', 0x594640) },
  { part: wall, material: PALETTE.stone },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Gas Works Park', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 30,
})
await Bun.write(new URL('../models/sea-gas-works.glb', import.meta.url), glb)
console.log(`sea-gas-works.glb: ${triangles} triangles, ${glb.length} bytes`)
