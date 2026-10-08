/**
 * The Fremont Street Experience canopy (Jon Jerde, 1995; Viva Vision LED
 * screen 2004, renewed 2019): the barrel vault over four blocks of Fremont
 * Street on its rows of white columns. Only the canopy and its supports;
 * the street and the casinos under it are the map's. Procedural, CC0-1.0.
 * bun generators/lv-fremont-canopy.ts
 *
 * Map frame: x east, y north, z up, metres, built turned: the vault runs
 * along the model's y axis, and the placement bearing of 117.8° lays it
 * along Fremont Street, +y towards Las Vegas Boulevard. The origin is the
 * area centroid of OSM way/1428180251 (building=roof, the canopy outline).
 *
 * Ground: Fremont Street falls about 3.7 m from Main Street down to Las
 * Vegas Boulevard (USGS 3DEP, via the EPQS service: 616.5 m at the west
 * end, 614.6 m mid-way, 612.8 m at the east end). y = 0 is the low east
 * end, so the vault and the columns' branches rise with the street towards
 * the west, and the columns run down to y = 0 everywhere, sinking into the
 * slope at the uphill end.
 *
 * Measured, from OSM way/1428180251: 422 m long and 26 m wide, straight to
 * within a metre; it narrows to 24.5 m at its ends.
 *
 * Published (Wikipedia, "Fremont Street Experience"): "a barrel vault
 * canopy, 90 ft (27 m) high at the peak and four blocks, or about 1,375 ft
 * (419 m), in length"; space frames erected in 1995 on support poles set
 * into the street.
 *
 * From photos: the vault's lower edges meet the casino fronts three or four
 * storeys up (about 14 m, the vault's springing); a pair of white columns
 * every bay, standing in from the shop fronts, each branching about 15 m up
 * into struts that carry the screen; white arched trusses riding over the
 * screen's back.
 *
 * Photos (Wikimedia Commons):
 * - day1 "Fremont street during daytime.jpg", Ypsilon from Finland, CC0:
 *   the vault, the columns' branches and the trusses on top, by day;
 * - fam2 "2015-11-04 11 10 42 View southeast down the Fremont Street
 *   Experience from Casino Center Boulevard…", Famartin, CC BY-SA 4.0:
 *   the vault's section and the column rows;
 * - mader "Fremont Experience, Saturday morning in downtown Las Vegas
 *   08.2020.jpg", Ron Mader, CC BY-SA 2.0: the column pairs and their
 *   spacing under the new screen;
 * - fse "The Fremont Street Experience.jpg", Julian Lupyan, CC0, and zappa
 *   "Fremont Street Experience March 2020 1.jpg", ZappaOMatic, CC BY-SA
 *   4.0: the screen lit.
 *
 * Estimated: the springing (14 m) and the section (a semicircle of 13 m
 * radius, which lands on the published 27 m crown), the column spacing (30
 * m), the trusses' size and spacing (one every 15 m; the aerial shows a closer
 * grid, too fine to draw), the depth of the screen and its frame
 * (1 m). The underside, the screen itself, is `window-2` so it glows at
 * night as Viva Vision does. Left out: the speaker rings, the cross
 * gantries, the zip-line cables, the canopy's bump-outs at the cross
 * streets.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, windowVariant } from './palette'
import { save } from './lv-wynn'

const top = new Part() // the back of the screen and its space frame
const screen = new Part() // the LED underside
const white = new Part() // trusses, columns, branches

const Y0 = -209.9, Y1 = 211.8 // the outline's ends
const R = 13 // half the span
const SPRING = 14 // where the vault meets the casino fronts
const DEPTH = 1.0 // screen plus frame
const FALL = 3.7 // the street's fall from the west end to the east
/** Street level above the model's y = 0, the low east end. */
const ground = (y: number) => FALL * (Y1 - y) / (Y1 - Y0)

const SEG = 16
/** A point on the vault's underside at angle a (0 = east springing, π = west), station y. */
const arcAt = (a: number, y: number, r = R): V3 => [r * Math.cos(a), y, ground(y) + SPRING + r * Math.sin(a)]
const nrm = (a: number): V3 => [Math.cos(a), 0, Math.sin(a)]
const neg = (v: V3): V3 => [-v[0], -v[1], -v[2]]

// ------------------------------------------------------------------ the vault

// Smooth-shaded, one quad per arc segment along the whole length: the vault
// is straight and the street's fall is even, so two stations suffice.
for (let i = 0; i < SEG; i++) {
  const a0 = (Math.PI * i) / SEG, a1 = (Math.PI * (i + 1)) / SEG
  const n0 = nrm(a0), n1 = nrm(a1)
  // Back of the screen, facing up and out.
  const t00 = arcAt(a0, Y0, R + DEPTH), t01 = arcAt(a0, Y1, R + DEPTH), t10 = arcAt(a1, Y0, R + DEPTH), t11 = arcAt(a1, Y1, R + DEPTH)
  top.tri(t00, t10, t11, [0, 0], [0, 0], [0, 0], [n0, n1, n1])
  top.tri(t00, t11, t01, [0, 0], [0, 0], [0, 0], [n0, n1, n0])
  // The screen underneath, facing down and in.
  const s00 = arcAt(a0, Y0), s01 = arcAt(a0, Y1), s10 = arcAt(a1, Y0), s11 = arcAt(a1, Y1)
  screen.tri(s00, s11, s10, [0, 0], [0, 0], [0, 0], [neg(n0), neg(n1), neg(n1)])
  screen.tri(s00, s01, s11, [0, 0], [0, 0], [0, 0], [neg(n0), neg(n0), neg(n1)])
  // The two open ends: the frame's edge, a band DEPTH deep.
  white.quad(s10, s00, t00, t10)
  white.quad(s01, s11, t11, t01)
}
// The long lower edges along the casino fronts.
for (const a of [0, Math.PI]) {
  const p = [arcAt(a, Y0), arcAt(a, Y1), arcAt(a, Y1, R + DEPTH), arcAt(a, Y0, R + DEPTH)]
  if (a === 0) white.quad(p[0], p[3], p[2], p[1])
  else white.quad(p[0], p[1], p[2], p[3])
}

// ------------------------------------------------------------------ trusses on top

/** A box swept along an arc just above the vault: a white arched truss at station y. */
function truss(y: number, w: number, h: number) {
  const r0 = R + DEPTH, r1 = R + DEPTH + h
  for (let i = 0; i < SEG; i++) {
    const a0 = (Math.PI * i) / SEG, a1 = (Math.PI * (i + 1)) / SEG
    const P = (a: number, r: number, dy: number) => arcAt(a, y + dy, r)
    // Outer face, the two sides.
    white.quad(P(a0, r1, -w), P(a0, r1, w), P(a1, r1, w), P(a1, r1, -w))
    white.quad(P(a0, r0, -w), P(a0, r1, -w), P(a1, r1, -w), P(a1, r0, -w))
    white.quad(P(a0, r0, w), P(a1, r0, w), P(a1, r1, w), P(a0, r1, w))
  }
  for (const a of [0, Math.PI]) {
    const P = (r: number, dy: number) => arcAt(a, y + dy, r)
    const q = [P(r0, -w), P(r0, w), P(r1, w), P(r1, -w)]
    if (a === 0) white.quad(q[0], q[1], q[2], q[3])
    else white.quad(q[0], q[3], q[2], q[1])
  }
}

// ------------------------------------------------------------------ columns

const COL_X = 10.2 // in from the shop fronts
const BRANCH = 15 // where the columns branch, above the street

/** A square tube from a to b, `h` half-width, for columns and their branches. */
function tube(a: V3, b: V3, h: number) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const l = Math.hypot(...d)
  const u: V3 = [d[0] / l, d[1] / l, d[2] / l]
  // Two directions across the tube.
  const ref: V3 = Math.abs(u[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]
  const c1: V3 = [u[1] * ref[2] - u[2] * ref[1], u[2] * ref[0] - u[0] * ref[2], u[0] * ref[1] - u[1] * ref[0]]
  const l1 = Math.hypot(...c1), e1: V3 = [c1[0] / l1 * h, c1[1] / l1 * h, c1[2] / l1 * h]
  const c2: V3 = [u[1] * e1[2] - u[2] * e1[1], u[2] * e1[0] - u[0] * e1[2], u[0] * e1[1] - u[1] * e1[0]]
  const ring = (p: V3): V3[] => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([s, t]) => [p[0] + e1[0] * s + c2[0] * t, p[1] + e1[1] * s + c2[1] * t, p[2] + e1[2] * s + c2[2] * t] as V3)
  const ra = ring(a), rb = ring(b)
  for (let k = 0; k < 4; k++) {
    const m = (k + 1) % 4
    const mid: V3 = [(ra[k][0] + ra[m][0]) / 2 - a[0], (ra[k][1] + ra[m][1]) / 2 - a[1], (ra[k][2] + ra[m][2]) / 2 - a[2]]
    const n = [(ra[m][1] - ra[k][1]) * (rb[k][2] - ra[k][2]) - (ra[m][2] - ra[k][2]) * (rb[k][1] - ra[k][1]),
      (ra[m][2] - ra[k][2]) * (rb[k][0] - ra[k][0]) - (ra[m][0] - ra[k][0]) * (rb[k][2] - ra[k][2]),
      (ra[m][0] - ra[k][0]) * (rb[k][1] - ra[k][1]) - (ra[m][1] - ra[k][1]) * (rb[k][0] - ra[k][0])]
    if (n[0] * mid[0] + n[1] * mid[1] + n[2] * mid[2] >= 0) white.quad(ra[k], ra[m], rb[m], rb[k])
    else white.quad(ra[k], rb[k], rb[m], ra[m])
  }
}

/** One column: a round-ish shaft (an octagon) to its branching point, then three struts up to the screen. */
function column(x: number, y: number) {
  const g = ground(y), seg = 8, r = 0.75
  const ring = (z: number, rr: number): V3[] => Array.from({ length: seg }, (_, k) => [x + Math.cos((k / seg) * 2 * Math.PI) * rr, y + Math.sin((k / seg) * 2 * Math.PI) * rr, z] as V3)
  white.loft([ring(0, r), ring(g + BRANCH - 1.5, r), ring(g + BRANCH, r * 0.75)])
  const s = Math.sign(x)
  const from: V3 = [x, y, g + BRANCH]
  // Struts to the screen: out to the springing side, up, and in towards the crown.
  for (const deg of [22, 48, 78]) {
    const a = s > 0 ? (deg * Math.PI) / 180 : Math.PI - (deg * Math.PI) / 180
    const p = arcAt(a, y, R - 0.1)
    tube(from, p, 0.3)
  }
}

const BAYS = 14
const STEP = (Y1 - Y0) / BAYS
for (let i = 0; i < BAYS; i++) {
  const y = Y0 + STEP * (i + 0.5)
  column(COL_X, y)
  column(-COL_X, y)
}
// Trusses every half bay, over the columns and between them, and at the
// two ends: the transverse arches the aerial shows as a close grid.
for (let i = 0; i <= 2 * BAYS; i++) {
  const y = i === 0 ? Y0 + 0.6 : i === 2 * BAYS ? Y1 - 0.6 : Y0 + (STEP / 2) * i
  truss(y, 0.6, 1.4)
}

await save('lv-fremont-canopy', 'Fremont Street Experience canopy', [
  { part: top, material: PALETTE.roof },
  { part: screen, material: windowVariant(2, 0x7f8c99) },
  { part: white, material: PALETTE.trim },
], FALL + SPRING + R + DEPTH + 1.4, 'Y up, -Z north, +X east, metres; origin at the centroid of way/1428180251; the vault runs along Y before the bearing', 5000)
