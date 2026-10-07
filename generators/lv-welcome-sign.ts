/**
 * The Welcome to Fabulous Las Vegas sign (1959, Betty Willis for Western
 * Neon): the stretched diamond with its yellow rim, the seven silver dollars
 * spelling WELCOME, the red eight-pointed star between the two blue posts.
 * Procedural, CC0-1.0.
 * bun generators/lv-welcome-sign.ts
 *
 * Lettering: STYLE.md's "Famous signs" exception. The sign is the landmark,
 * so it carries its words as extruded block letters on the panel: WELCOME,
 * TO FABULOUS, LAS VEGAS and NEVADA on the south face, and DRIVE CAREFULLY,
 * COME BACK SOON on the north. The real "to Fabulous" and "Come Back" are
 * script; here they are the same block capitals as the rest.
 *
 * Map frame: x east, y north, z up, metres. The model's front faces -y;
 * the placement's bearing of 355° turns it to face 175°, the direction OSM
 * gives (node/1485974042, direction=175). The origin is that node, under the
 * middle of the panel. There is no OSM building, so it replaces nothing.
 *
 * Published (Wikipedia, "Welcome to Fabulous Las Vegas sign", and its NRHP
 * listing): 25 ft (7.6 m) tall, "mounted offset on two flat poles which are
 * joined by a cross piece at the top"; "a horizontally stretched diamond
 * shape, with the top and bottom angles pointed while the side angles are
 * rounded"; white circles for silver dollars, each with a red letter of
 * WELCOME; "an eight-pointed, red-painted metal star" between the poles
 * under the cross piece; the back reads "Drive Carefully / Come Back Soon".
 *
 * Measured, from p5 (straight on from the south), scaled so the posts are
 * 7.6 m: the diamond 6.3 m wide and 3.2 m tall from 3.15 to 6.36 m, its
 * rounded sides at 4.8 m; posts 0.39 m square, 1.73 m and 0.42 m west of the
 * middle; the dollars 0.69 m across at 5.8 m; the star 1.9 m across,
 * centred 1.08 m west at 6.9 m; the lines of lettering.
 *
 * Photos (Wikimedia Commons):
 * - p5 "Las Vegas 2016 Welcome to Fabulous Las Vegas sign.jpg", Pierre
 *   André Leclercq, CC BY-SA 4.0: the front, square on;
 * - p4 "Las Vegas Welcome Sign P4230733.jpg", Alexander Migl, CC BY-SA 4.0,
 *   and p3 "Side View of Fabulous Las Vegas Sign.jpg", Beckettphotographer1,
 *   CC BY-SA 4.0: from the south-west, the panel's depth and the posts;
 * - p1 "2012.10.05.175758 Welcome sign Las Vegas Nevada.jpg", Hermann
 *   Luyken, CC0: the sign in the median, Mandalay Bay behind.
 *
 * Estimated: the panel's depth (0.5 m) and the dollars' (0.6 m), the north
 * face's layout (no licensed photo of it was found), the colours, pulled
 * towards the palette's lightness. The bulbs round the rim are left out.
 * The white face is `window-2` so it glows at night, as the real cabinet
 * is lit from inside.
 */
import { Part, type V3 } from './mesh'
import { finish, windowVariant } from './palette'
import { save, type XY } from './lv-wynn'
import { extrude, planeAt, triTo } from './lv-mgm-grand'

const face = new Part()
const rim = new Part() // the yellow border
const red = new Part()
const blue = new Part()
const silver = new Part()

// The plane: profile x runs east, profile z up, w points south (w = -y).
const PL = planeAt([0, 0], 90)
const P = (x: number, z: number, w: number): V3 => [x, -w, z]

// ------------------------------------------------------------------ shape

/** The diamond, a ccw ring in (x, z): pointed top and bottom, rounded sides. */
function diamond(inset = 0): XY[] {
  const top = 6.36 - inset * 2.2, bot = 3.15 + inset * 2.2
  const sideX = 3.16 - inset, sideZ = 4.8
  const pts: XY[] = [[0, bot]]
  // Right side: the lower edge, a rounded corner, the upper edge.
  const corner = (sx: number): XY[] => {
    const out: XY[] = []
    for (let k = 0; k <= 6; k++) {
      const a = -Math.PI / 2.6 + (k / 6) * (Math.PI / 1.3) // −69° to +69°
      out.push([sx * (sideX - 0.42 + 0.42 * Math.cos(a)), sideZ + 0.62 * Math.sin(a)])
    }
    return out
  }
  pts.push(...corner(1))
  pts.push([0, top])
  pts.push(...corner(-1).reverse())
  return pts
}

const D = 0.25 // half the cabinet's depth
extrude(PL, diamond(), -D, D, () => rim, rim)
// The white faces, flush shapes just proud of the rim's ends.
for (const s of [1, -1]) {
  const r = diamond(0.17)
  const pts = r.map(([x, z]) => P(x, z, s * (D + 0.01)))
  for (let k = 1; k < pts.length - 1; k++) triTo(face, pts[0], pts[k], pts[k + 1], [0, -s, 0])
}

// The posts and the cross piece, west of the middle.
const POSTS = [-1.73, -0.42], PW = 0.195, PTOP = 7.6
for (const px of POSTS) {
  extrude(PL, [[px - PW, 0], [px + PW, 0], [px + PW, PTOP], [px - PW, PTOP]], -PW - D, PW - D + 0.1, () => blue, blue)
}
extrude(PL, [[POSTS[0] - PW, PTOP - 0.25], [POSTS[1] + PW, PTOP - 0.25], [POSTS[1] + PW, PTOP], [POSTS[0] - PW, PTOP]], -PW - D, PW - D + 0.1, () => blue, blue)

// The star: eight points, the upright and level ones long, wrapping the frame.
{
  const c: XY = [-1.08, 6.9], ring: XY[] = []
  for (let k = 0; k < 16; k++) {
    const a = (k * Math.PI) / 8
    const r = k % 4 === 0 ? 0.95 : k % 2 === 0 ? 0.6 : 0.24
    ring.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r])
  }
  extrude(PL, ring, -0.12 - D + 0.05, 0.12 - D + 0.05, () => red, red)
}

// The silver dollars along the top edge.
const DOLLAR_R = 0.345, DOLLAR_Z = 5.8, DOLLAR_W = 0.3
const DOLLARS = [-2.21, -1.5, -0.77, -0.06, 0.65, 1.36, 2.07]
const disc = (cx: number, cz: number, r: number): XY[] =>
  Array.from({ length: 16 }, (_, k) => [cx + Math.cos((k * Math.PI) / 8) * r, cz + Math.sin((k * Math.PI) / 8) * r] as XY)
for (const x of DOLLARS) extrude(PL, disc(x, DOLLAR_Z, DOLLAR_R), -DOLLAR_W, DOLLAR_W, () => silver, silver)

// ------------------------------------------------------------------ letters

/** Block capitals as strokes on a 0.6 × 1 grid. */
const GLYPHS: Record<string, number[][]> = {
  A: [[0, 0, 0.3, 1], [0.3, 1, 0.6, 0], [0.13, 0.38, 0.47, 0.38]],
  B: [[0, 0, 0, 1], [0, 1, 0.45, 1], [0, 0.5, 0.45, 0.5], [0, 0, 0.5, 0], [0.5, 0.97, 0.5, 0.53], [0.55, 0.47, 0.55, 0.03]],
  C: [[0.6, 1, 0, 1], [0, 1, 0, 0], [0, 0, 0.6, 0]],
  D: [[0, 0, 0, 1], [0, 1, 0.35, 1], [0.35, 1, 0.6, 0.72], [0.6, 0.72, 0.6, 0.28], [0.6, 0.28, 0.35, 0], [0.35, 0, 0, 0]],
  E: [[0, 0, 0, 1], [0, 1, 0.6, 1], [0, 0.5, 0.45, 0.5], [0, 0, 0.6, 0]],
  F: [[0, 0, 0, 1], [0, 1, 0.6, 1], [0, 0.5, 0.45, 0.5]],
  G: [[0.6, 1, 0, 1], [0, 1, 0, 0], [0, 0, 0.6, 0], [0.6, 0, 0.6, 0.45], [0.6, 0.45, 0.3, 0.45]],
  I: [[0.3, 0, 0.3, 1]],
  K: [[0, 0, 0, 1], [0, 0.42, 0.6, 1], [0.17, 0.57, 0.6, 0]],
  L: [[0, 1, 0, 0], [0, 0, 0.6, 0]],
  M: [[0, 0, 0, 1], [0, 1, 0.3, 0.45], [0.3, 0.45, 0.6, 1], [0.6, 1, 0.6, 0]],
  N: [[0, 0, 0, 1], [0, 1, 0.6, 0], [0.6, 0, 0.6, 1]],
  O: [[0, 0, 0, 1], [0, 1, 0.6, 1], [0.6, 1, 0.6, 0], [0.6, 0, 0, 0]],
  R: [[0, 0, 0, 1], [0, 1, 0.6, 1], [0.6, 1, 0.6, 0.5], [0.6, 0.5, 0, 0.5], [0.22, 0.5, 0.6, 0]],
  S: [[0.6, 1, 0, 1], [0, 1, 0, 0.5], [0, 0.5, 0.6, 0.5], [0.6, 0.5, 0.6, 0], [0.6, 0, 0, 0]],
  T: [[0, 1, 0.6, 1], [0.3, 1, 0.3, 0]],
  U: [[0, 1, 0, 0], [0, 0, 0.6, 0], [0.6, 0, 0.6, 1]],
  V: [[0, 1, 0.3, 0], [0.3, 0, 0.6, 1]],
  W: [[0, 1, 0.14, 0], [0.14, 0, 0.3, 0.6], [0.3, 0.6, 0.46, 0], [0.46, 0, 0.6, 1]],
  Y: [[0, 1, 0.3, 0.5], [0.6, 1, 0.3, 0.5], [0.3, 0.5, 0.3, 0]],
}

/**
 * One stroke, `t` wide, from (x0, z0) to (x1, z1) in the face's plane, an
 * extruded bar standing from w0 to w1 off the panel (`s` = +1 south, −1
 * north): its front and four sides.
 */
function bar(p: Part, x0: number, z0: number, x1: number, z1: number, t: number, s: number, w0: number, w1: number) {
  const L = Math.hypot(x1 - x0, z1 - z0) || 1
  const ux = (x1 - x0) / L, uz = (z1 - z0) / L, nx = -uz * (t / 2), nz = ux * (t / 2)
  const ex = ux * (t / 2), ez = uz * (t / 2) // run past the ends so joints close
  const q: XY[] = [[x0 - ex + nx, z0 - ez + nz], [x0 - ex - nx, z0 - ez - nz], [x1 + ex - nx, z1 + ez - nz], [x1 + ex + nx, z1 + ez + nz]]
  const at = (k: number, w: number) => P(q[k][0], q[k][1], s * w)
  const out: V3 = [0, -s, 0]
  triTo(p, at(0, w1), at(1, w1), at(2, w1), out)
  triTo(p, at(0, w1), at(2, w1), at(3, w1), out)
  const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4, mx = (q[k][0] + q[l][0]) / 2 - cx, mz = (q[k][1] + q[l][1]) / 2 - cz
    const want: V3 = [mx, 0, mz]
    triTo(p, at(k, w0), at(l, w0), at(l, w1), want)
    triTo(p, at(k, w0), at(l, w1), at(k, w1), want)
  }
}

/**
 * A line of text centred on x = cx with its baseline at z, cap height h, on
 * the south face (s = +1) or the north (s = −1, mirrored so it reads from
 * behind). `adv` is the advance per character as a fraction of h.
 */
function text(p: Part, str: string, cx: number, z: number, h: number, s: number, adv = 0.82, w0 = D + 0.01, depth = 0.05) {
  const step = h * adv, width = step * str.length - step + 0.6 * h
  let x = -width / 2
  for (const ch of str) {
    for (const [a, b, c, d] of GLYPHS[ch] ?? []) {
      const X = (u: number) => s * (x + u * h) + cx
      bar(p, X(a), z + b * h, X(c), z + d * h, h * 0.17, s, w0, w0 + depth)
    }
    x += step
  }
}

// South face.
DOLLARS.forEach((x, i) => text(red, 'WELCOME'[i], x, DOLLAR_Z - 0.2, 0.4, 1, 0.82, DOLLAR_W, 0.04))
text(blue, 'TO FABULOUS', -0.15, 4.97, 0.3, 1, 0.95)
text(red, 'LAS VEGAS', -0.05, 4.17, 0.72, 1, 0.74)
text(blue, 'NEVADA', -0.15, 3.78, 0.24, 1, 1.2)
// North face, read from the north.
text(red, 'DRIVE', 0, 5.2, 0.4, -1)
text(red, 'CAREFULLY', 0, 4.45, 0.6, -1, 0.74)
text(blue, 'COME BACK', 0, 3.98, 0.3, -1, 0.85)
text(blue, 'SOON', 0, 3.55, 0.26, -1, 0.95)

await save('lv-welcome-sign', 'Welcome to Fabulous Las Vegas sign', [
  { part: face, material: windowVariant(2, 0xf6f1e8) },
  { part: rim, material: finish('sign-yellow', 0xecc958) },
  { part: red, material: finish('sign-red', 0xd65a4e) },
  { part: blue, material: finish('sign-blue', 0x6596c8) },
  { part: silver, material: finish('sign-silver', 0xdcdcd6, 0.5) },
], 7.85, 'Y up, -Z north, +X east, metres; origin at node/1485974042; the front faces -Y (south) before the bearing', 6500)
