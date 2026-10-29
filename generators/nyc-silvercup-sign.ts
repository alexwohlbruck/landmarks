/**
 * The Silvercup sign (c. 1961-62), on the roof of the old Silvercup Bakery,
 * now Silvercup Studios, Long Island City, Queens. Procedural, CC0-1.0.
 *   bun generators/nyc-silvercup-sign.ts
 *
 * Lettering: STYLE.md's "Famous signs" exception. The sign is the landmark,
 * so it carries SILVERCUP and the small STUDIOS under it as geometry, traced
 * from a straight-on licensed photo (s1) with `lettering.ts`: tall condensed
 * capitals with wedge serifs whose tops run level while their feet hang on
 * a smile, the S and the P longest, the E and R shortest in the middle; the
 * L's foot kicks up, the R's leg, the C's lower terminal and the P's stem
 * end in points. Centre-lines are traced in s1's pixels (24.6 px per metre
 * across, 22.0 px per metre up, from the lidar length and height below) and
 * stroked 1.5-1.6 m wide, about the photo's stroke weight.
 * Night: SILVERCUP and STUDIOS are `neon-*` materials and glow red-orange
 * after dark, as in the night photos (s4 "Silvercup Studios.jpg",
 * Brooklyn4083, CC BY-SA 4.0; s8 "Arkaden at Silvercup Studios.jpg", Dynamiiclabel, CC BY-SA 4.0);
 * the frame stays dark.
 *
 * Only the sign is modelled, with its steel frame down to the roof it stands
 * on. The roof belongs to OSM way/281332373 (building, height 23.2 m), which
 * the map draws itself, so the model replaces nothing and stands on that
 * roof with `elevation` 23.1: the lidar roof (28.5 m) above the street
 * beside it (5.4 m). y = 0 is the roof.
 *
 * Map frame: x east, y north, z up, metres. Built with the sign facing -y
 * and read along +x; bearing 124.7 turns the face to 304.7 (north-west, to
 * Queens Plaza, the Queensboro Bridge and Manhattan) and the reading
 * direction to 214.7. The origin is the middle of the sign as the lidar
 * shows it (-73.9436986, 40.7513395).
 *
 * Measured (USGS NY_NewYorkCity lidar, 2017, 0.5 m grid): the sign runs at
 * 34.7 degrees for 45.6 m, about 3 m deep; the letters' tops 19.9 m above
 * the roof. Letter shapes, the feet's smile, the STUDIOS line and the
 * frame's look from s1, scaled to those numbers.
 * Estimated: the frame's members (a front and a back plane 2.6 m apart,
 * uprights about 5.7 m apart, four rails, cross-braces in the open bottom
 * bays), its colour (pale grey in s1 and s2; it reads darker against the
 * sky in others); the letters' depth (0.6 m).
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - s1 "Silvercup sign 20190519 130130.jpg", CaptJayRuffins, CC BY-SA 4.0:
 *   straight on, the trace.
 *   https://commons.wikimedia.org/wiki/File:Silvercup_sign_20190519_130130.jpg
 * - s2 "Silvercup Studios 21 St & QPS jeh.JPG", Jim.henderson, CC BY 3.0:
 *   from the street to the north-west, the sign on its roof.
 *   https://commons.wikimedia.org/wiki/File:Silvercup_Studios_21_St_%26_QPS_jeh.JPG
 * - s3 "Silvercup Studios sign.jpg", MacdaddyCk, CC BY-SA 4.0: oblique from
 *   below, the frame's depth.
 *   https://commons.wikimedia.org/wiki/File:Silvercup_Studios_sign.jpg
 * - s5 "Silvercup Studios and Citicorp Building from Queensboro Bridge.jpg",
 *   AAK, CC BY 3.0: from the bridge, north-west, the whole frame.
 *   https://commons.wikimedia.org/wiki/File:Silvercup_Studios_and_Citicorp_Building_from_Queensboro_Bridge.jpg
 * - s7 "Silvercup.jpg", public domain: the building and sign from 21st St.
 *   https://commons.wikimedia.org/wiki/File:Silvercup.jpg
 *
 * Doubts: s1 is taken from a little below, so the vertical scale comes from
 * the lidar top rather than the photo. The back of the sign (south-east) is
 * drawn as the frame behind the letters' plain backs.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { Pen, strokes, type Pt } from './lettering'

const red = new Part(), dark = new Part(), frame = new Part()

const SX = 24.6, SZ = 22.0, U0 = 632, VROOF = 722
const FRONT = -1.2
const place = (u: number, v: number, w: number): V3 => [(u - U0) / SX, FRONT - w, (VROOF - v) / SZ]

// ------------------------------------------------------------ SILVERCUP (s1 px, y down)
const big = new Pen()
// S: the top terminal, over, the spine down, round the bottom to the lower terminal
big.moveTo([188, 328]).lineTo([186, 304]).cubicTo([170, 284], [112, 282], [98, 318])
  .cubicTo([86, 352], [110, 380], [142, 404]).cubicTo([180, 432], [190, 470], [178, 500])
  .cubicTo([164, 534], [104, 536], [86, 508]).lineTo([84, 486])
// I
big.moveTo([253, 290]).lineTo([253, 496])
// L: stem, and the foot kicking up to the right
big.moveTo([338, 290]).lineTo([338, 450]).lineTo([396, 424])
// V
big.moveTo([418, 292]).lineTo([462, 432])
big.moveTo([510, 292]).lineTo([466, 432])
// E
big.moveTo([572, 290]).lineTo([572, 420])
big.moveTo([572, 300]).lineTo([634, 300]).lineTo([636, 328])
big.moveTo([572, 356]).lineTo([618, 356])
big.moveTo([572, 410]).lineTo([638, 410]).lineTo([640, 384])
// R
big.moveTo([684, 290]).lineTo([684, 424])
big.moveTo([684, 298]).lineTo([724, 298]).cubicTo([756, 298], [758, 356], [724, 356]).lineTo([690, 356])
big.moveTo([712, 360]).lineTo([776, 428])
// C: the top terminal, round the left, to the pointed lower terminal
big.moveTo([896, 330]).lineTo([892, 302]).cubicTo([862, 284], [818, 292], [816, 340])
  .lineTo([816, 404]).cubicTo([818, 452], [870, 452], [902, 446])
// U: down the left, round the bottom and up the right
big.moveTo([950, 290]).lineTo([950, 420]).cubicTo([950, 486], [1026, 486], [1026, 420]).lineTo([1026, 290])
// P: stem to its pointed foot, and the bowl
big.moveTo([1100, 290]).lineTo([1100, 520]).lineTo([1112, 540])
big.moveTo([1100, 298]).lineTo([1150, 298]).cubicTo([1196, 298], [1196, 436], [1150, 436]).lineTo([1106, 436])

// the wedge serifs that widen the stems' tops (I, L, E, R, U, P)
const serif = new Pen()
for (const x of [253, 338, 572, 684, 950, 1026, 1100]) serif.moveTo([x - 26, 294]).lineTo([x + 26, 294])

// STUDIOS: small spaced capitals under VERC (s1 x 485-785, y 512-555)
const small = new Pen()
const sx = (i: number) => 492 + i * 44
{
  const t = 516, b = 552, m = 534
  const S = (x: number) => small.moveTo([x + 20, t + 4]).cubicTo([x + 14, t - 2], [x, t], [x + 2, t + 8])
    .cubicTo([x + 4, m - 2], [x + 22, m], [x + 22, b - 8]).cubicTo([x + 22, b], [x + 4, b + 2], [x, b - 4])
  S(sx(0))
  small.moveTo([sx(1), t]).lineTo([sx(1) + 24, t]); small.moveTo([sx(1) + 12, t]).lineTo([sx(1) + 12, b])
  small.moveTo([sx(2), t]).lineTo([sx(2), b - 10]).cubicTo([sx(2), b + 2], [sx(2) + 22, b + 2], [sx(2) + 22, b - 10]).lineTo([sx(2) + 22, t])
  small.moveTo([sx(3), t]).lineTo([sx(3), b]).lineTo([sx(3) + 10, b]).cubicTo([sx(3) + 28, b], [sx(3) + 28, t], [sx(3) + 10, t]).lineTo([sx(3), t])
  small.moveTo([sx(4) + 10, t]).lineTo([sx(4) + 10, b])
  small.circle([sx(5) + 12, m], 12, 18, 12)
  S(sx(6))
}

const W = 38
strokes(red, big.paths, { width: W, depth: 0.6, place, back: true })
strokes(red, serif.paths, { width: 14, depth: 0.6, place, back: true })
strokes(dark, small.paths, { width: 8, depth: 0.3, place, back: true })

// ------------------------------------------------------------ the frame
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
  const r = (z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  p.loft([r(z0), r(z1)])
  p.cap(r(z1), true)
}
function strut(p: Part, A: V3, B: V3, h: number) {
  const d: V3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], L = Math.hypot(...d)
  const u: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const ref: V3 = Math.abs(u[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]
  const cr = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  let s = cr(u, ref); const ls = Math.hypot(...s); s = [s[0] / ls, s[1] / ls, s[2] / ls]
  const t = cr(u, s)
  const ring = (P: V3) => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([a, b]) => [P[0] + (s[0] * a + t[0] * b) * h, P[1] + (s[1] * a + t[1] * b) * h, P[2] + (s[2] * a + t[2] * b) * h] as V3)
  p.loft([ring(A), ring(B)])
}
const X0 = -22.8, X1 = 22.8, TOP = 20.0
const YF = FRONT + 0.6, YK = FRONT + 3.2
const xs = Array.from({ length: 9 }, (_, i) => X0 + ((X1 - X0) * i) / 8)
for (const x of xs) {
  for (const y of [YF, YK]) box(frame, x - 0.14, y - 0.14, 0, x + 0.14, y + 0.14, y === YF ? TOP : TOP - 1.5)
  box(frame, x - 0.1, YF, TOP - 1.7, x + 0.1, YK, TOP - 1.4) // tie at the top
  box(frame, x - 0.1, YF, 0.2, x + 0.1, YK, 0.45) // sill tie on the roof
  strut(frame, [x, YF, TOP - 1.6], [x, YK, 7.5], 0.09) // raking brace
}
for (const z of [0.3, 7.0, 13.6]) for (const y of [YF, YK]) box(frame, X0 - 0.2, y - 0.1, z, X1 + 0.2, y + 0.1, z + 0.22)
box(frame, X0 - 0.2, YF - 0.1, TOP - 0.25, X1 + 0.2, YF + 0.1, TOP)
// cross-braces in the open bays under the letters, front plane (s1, s5)
for (let i = 0; i < xs.length - 1; i++) {
  strut(frame, [xs[i], YF + 0.05, 0.45], [xs[i + 1], YF + 0.05, 7.0], 0.07)
  strut(frame, [xs[i + 1], YF + 0.05, 0.45], [xs[i], YF + 0.05, 7.0], 0.07)
}

const parts = [
  { part: red, material: finish('neon-silvercup-red', 0xd0583f) },
  { part: dark, material: finish('neon-studios-red', 0x9c4237) },
  { part: frame, material: finish('sign-frame', 0xb3b8bc) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
let top = 0
for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) top = Math.max(top, part.pos[i])
const glb = writeGlb('Silvercup Sign', parts, {
  license: 'CC0-1.0', bearing: 124.7, elevation: 23.1, height: top,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the roof',
  replaces: [],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-silvercup-sign.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${top.toFixed(1)} m`)
