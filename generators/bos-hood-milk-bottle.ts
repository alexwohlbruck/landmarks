/**
 * Hood Milk Bottle, Children's Wharf, Boston (1933, Arthur Gagner; moved
 * here by barge in 1977) — original procedural geometry, CC0-1.0.
 * bun generators/bos-hood-milk-bottle.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * plaza. Bearing 0 (it is round). Anchor = the bottle's axis in the lidar,
 * -71.0501920, 42.3516582 (0.6 m south and 0.2 m east of the centre of OSM
 * way/244444290, which is drawn a touch large).
 *
 * Identity (from the photos below): a giant white milk bottle of vertical
 * boards: a straight body, a rounded shoulder, a short neck, and a bright
 * red cap flaring out over the neck. A red oval "Hood" logo on the body, and
 * a ring of little red awnings over the sales windows at the bottom.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021), 0.5 m grid: the
 * cap's top 12.0 over the plaza (OSM height 12.2; published 40 ft), the cap
 * 4.5 m across, the shoulder ring 6–7.5, the awnings 2.7–3.0 standing out to
 * about 3.4 m from the axis. Published (Wikipedia, Hood Milk Bottle): 40 ft
 * tall, 18 ft across. The body is drawn 5.6 m across (OSM outline 5.8).
 *
 * Estimated from the photos (Hood Milk Bottle (54960892944), square on;
 * scaled from the 12 m height and the 5.6 m body): the profile (body
 * straight to 6.0, shoulder to the neck at 9.5–10.1, cap 10.0–12.0), the
 * logo oval (3.8 m wide, z 4.2–6.0) and its letters (cap height 0.8 m),
 * ten awnings and windows round the base (z 1.0–2.25 windows, awnings
 * 2.35–3.05).
 *
 * Famous sign: the "Hood" logo is part of the landmark's identity (STYLE.md,
 * Famous signs), so its letters are drawn with generators/lettering.ts,
 * traced from the photo: a bold geometric sans, capital H then round
 * "ood", white on the red oval. It is drawn on the south side (facing
 * Congress Street, as in the June 2026 photo) and on the north.
 *
 * Ground: the plaza is flat (lidar within 0.3 m); elevation 0.
 * Night: the windows glow; the bottle is lit white.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Hood Milk Bottle (54960892944).jpg, ajay_suresh, CC BY 4.0
 *    https://commons.wikimedia.org/wiki/File:Hood_Milk_Bottle_(54960892944).jpg
 *  - Boston Hood Milk Bottle June 2026.jpg, 4300streetcar, CC BY 4.0 (from
 *    across Congress Street)
 *    https://commons.wikimedia.org/wiki/File:Boston_Hood_Milk_Bottle_June_2026.jpg
 *  - Boston, Museum Wharf, Hood Milk Bottle.jpg, openroads.com, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Boston,_Museum_Wharf,_Hood_Milk_Bottle.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: whether the logo is repeated on the north side (no photo of that
 * side); the door at the back is left out; the board joints are not drawn.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { Pen, strokes } from './lettering'
import { revolve } from './atl-tech-tower'
import { save } from './atl-flatiron-building'

const body = new Part(), red = new Part(), win = new Part()
const R = 2.8, N = 16

// ── The bottle and its cap ──
revolve(body, [0, 0], [[R, 0], [R, 6.0], [2.68, 7.0], [2.4, 7.9], [2.0, 8.8], [1.7, 9.5], [1.6, 9.9], [1.58, 10.15]], N, Math.PI / N, false, true)
revolve(red, [0, 0], [[1.5, 9.95], [1.9, 10.3], [2.2, 11.1], [2.28, 11.7], [2.18, 11.92], [1.4, 12.0], [0, 12.05]], N, Math.PI / N, false, true)

// ── Windows and awnings round the base: ten bays ──
const at = (a: number, r: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]
for (let k = 0; k < 10; k++) {
  const a = (k + 0.5) * (Math.PI / 5), dw = 0.31 / R, ro = R + 0.04
  // the window's white frame is the wall itself; the glass a dark panel
  win.quad(at(a - dw, ro, 1.0), at(a + dw, ro, 1.0), at(a + dw, ro, 2.25), at(a - dw, ro, 2.25))
  // the awning: a sloped red hood with cheeks
  const aw = 0.62 / R, r0 = R + 0.02, r1 = R + 0.7, zt = 3.05, zb = 2.55
  const A = at(a - aw, r0, zt), B = at(a + aw, r0, zt), C = at(a + aw, r1, zb), D = at(a - aw, r1, zb)
  red.quad(D, C, B, A)
  red.quad(A, B, C, D)
  red.quad(at(a - aw, r1, zb - 0.22), at(a + aw, r1, zb - 0.22), C, D)
  red.tri(at(a - aw, r0, zb), A, D)
  red.tri(at(a + aw, r0, zb), C, B)
}

// ── The logo: a red oval on the body with white "Hood" ──
function logo(phi0: number) {
  const SA = 1.9, ZC = 5.1, HZ = 0.9, n = 12, r = R + 0.03
  for (let i = 0; i < n; i++) {
    const s0 = -SA + (2 * SA * i) / n, s1 = -SA + (2 * SA * (i + 1)) / n
    const h = (s: number) => HZ * Math.sqrt(Math.max(0, 1 - (s / SA) ** 2))
    const p = (s: number, z: number) => at(phi0 + s / r, r, z)
    red.quad(p(s0, ZC - h(s0)), p(s1, ZC - h(s1)), p(s1, ZC + h(s1)), p(s0, ZC + h(s0)))
  }
  const pen = new Pen(), xo = 0.36, ox = 0.38
  // H
  pen.moveTo([0, 0]).lineTo([0, 1])
  pen.moveTo([0.66, 0]).lineTo([0.66, 1])
  pen.moveTo([0, 0.5]).lineTo([0.66, 0.5])
  // o, o
  pen.circle([1.24, ox], xo, xo, 12)
  pen.circle([2.1, ox], xo, xo, 12)
  // d
  pen.circle([2.96, ox], xo, xo, 12)
  pen.moveTo([3.34, 0]).lineTo([3.34, 1])
  const S = 0.8, W = 3.34
  strokes(body, pen.paths, {
    width: 0.2, depth: 0.05,
    place: (u, v, w) => at(phi0 + ((u - W / 2) * S) / (R + 0.05), R + 0.05 + w, ZC - 0.42 + v * S),
  })
}
logo(-Math.PI / 2)
logo(Math.PI / 2)

const lit = (p: V3) => (p[2] > 3 ? 0.6 : 0.3)
await save('bos-hood-milk-bottle', 'Hood Milk Bottle', [
  { part: body, material: { ...finish('hood-white', 0xf3f0ea), floodlight: lit } },
  { part: red, material: { ...finish('hood-red', 0xc9473f), floodlight: lit } },
  { part: win, material: PALETTE.window },
], { height: 12.05, anchor: [42.3516582, -71.050192], bearing: 0 })
