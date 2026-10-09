/**
 * Oracle Park, San Francisco: the Giants' ballpark on McCovey Cove, with its
 * green steel stands, red-brick streets fronts and twin clock towers, the
 * arcade along the cove, the centre-field scoreboard, and the Coca-Cola bottle
 * and four-fingered glove behind the left-field bleachers. Original
 * procedural geometry, CC0-1.0.
 * bun generators/sf-oracle-park.ts
 *
 * Stadium rule (STYLE.md "Ground"): the model is the stands, roofs, towers and
 * the buildings round them. The field, the warning track and the cove are the
 * map's; nothing is drawn inside the field outline.
 *
 * Frame: BEARING 315, so the model's +y points north-west at King Street and
 * +x runs north-east along it towards 2nd Street; -y is McCovey Cove and -x
 * 3rd Street. x, y, z metres. Origin = area centroid of the stadium building's
 * outer ring (relation/7330762, way/24352572). y = 0 is the lowest ground under
 * that ring, 3.5 m NAVD88 (the field and the cove promenade); King Street runs
 * about 1 m higher.
 *
 * Evidence
 * - OSM: relation/7325085 (leisure=stadium, "Oracle Park", no building tag),
 *   relation/7330762 (building=stadium, height 30: outer way/24352572 round the
 *   whole block with the 3rd Street buildings, the field and a service yard as
 *   inner rings) and the building:parts inside it: way/499568642 (upper deck),
 *   499568643 and 499568644 (the two corner towers), 499568645 (3rd Street
 *   wing), 499568646, 499568647, 499568648 (light banks), 499568649
 *   (scoreboard), 499568652 (the Coke bottle), 368215207, 368215208 (3rd
 *   Street buildings), 368214736, 368214737 (centre-field kiosks). OSM's part
 *   heights (60-70 m) are wrong; the lidar sets every height.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 1 m, sampled in this
 *   frame (/tmp/city/sf/work/sf-oracle-park): the stands are one deep L with a
 *   chamfered corner behind home plate. Their back (the canopy's outer edge)
 *   runs at y 87.5 along King Street, bowing in to 77 at the left-field end,
 *   and at x -99.5 to -87 along 3rd Street. Across it, measured from the back:
 *   canopy roof 38 for 8 m, then the upper deck from 30.5 down to 20.5 over
 *   16 m, its fascia, the club-level roof at 10.8 for 5 m, then the lower bowl
 *   from 4.9 down to the field wall. Light banks: 34 m long at y 86.5 on King
 *   Street, 36 m long further east, a 48 m one along 3rd Street, all topping
 *   out at 56.6; a short bank stepping up from 62.7 to 75 at the left-field end
 *   of the King Street stand. The two brick towers (3rd and King, 2nd and King)
 *   are each 14 x 14 m, eaves 31.6, pyramid roofs to 38, finials 44.6. The
 *   arcade along the cove is 7.4-8.6 high; the left-field bleachers rise from
 *   2.6 to 7.4 onto a deck at 7.4. The scoreboard: two towers 62 m apart on the
 *   south-east diagonal, light banks to 55.6, the board to 34.6 with its
 *   centre (clock and sign) to 47-49. The Coke bottle reaches 22, the glove
 *   14.7. The 3rd Street buildings: 15 m (the outer block), 24 m and 13 m
 *   nearer the stand, 9 m to the south; the corner building at 3rd and King
 *   23 m; a 15 m strip along King Street east of the stand; 22 m along 2nd
 *   Street.
 * - Published (Wikipedia): opened 2000, HOK Sport; the right-field wall is
 *   brick, 24 ft (7.3 m), with archways to the cove; the Coca-Cola bottle is
 *   80 ft (24 m) long with playground slides; the 1927-style four-fingered
 *   glove (steel and fibreglass) stands behind the 501 ft sign, to the bottle's
 *   right as seen from home plate.
 * - Photos (Wikimedia Commons): "Aerial photograph of AT&T Park, home of the
 *   San Francisco Giants.jpg" (Grant.gibson, CC BY 2.5, from over the cove:
 *   the whole bowl, the arcade, the bottle and glove); "AT&T Park SW side
 *   1.JPG" and "AT&T Park western side 5.JPG" (BrokenSphere, CC BY-SA 3.0, the
 *   clock tower at 3rd and King, the brick base with tall windows under the
 *   green steel); "CocaCola bottle and glove in the AT&T Park (TK1).JPG" and
 *   "Willie Mays Gate at AT&T Park (TK).JPG" (Tobias Kleinlercher, CC BY-SA
 *   3.0); "Oracle Park 1 2024-04-23.jpg" and "Oracle Park 2 2024-04-23.jpg"
 *   (Fastily, CC BY-SA 4.0, from across the cove: the arcade's ~30 arches, the
 *   light banks, the scoreboard tower); "Oracle Park 2025-07-12 1.jpg"
 *   (Yelderberry, CC BY-SA 4.0, the 3rd Street end of the stands over the
 *   cove); "AT&T Park - panoramio.jpg" (Javier Branas, CC BY 3.0, from above
 *   King Street: the clock tower, the brick fronts); "McCovey Cove AT^T Park -
 *   panoramio.jpg" (Noah_Loverbear, CC BY-SA 3.0, the scoreboard and clock);
 *   "Oracle Park - August 2025 - Sarah Stierch - 01.jpg" (Missvain, CC0, the
 *   2nd Street gate).
 *
 * Estimated from the photos: the storey lines of the brick base (stone plinth
 * to 2.2, brick to 14) and its arched windows, the steel columns above it,
 * the arcade's arch size and spacing, the towers' clock faces and cornices,
 * the light banks' legs, the scoreboard board and crown proportions, the
 * bottle's contour (from the published 24 m length and the lidar's 22 m top)
 * and the glove's fingers. The seats are drawn as plain green rakes; the
 * centre-field wall is drawn as tall as the deck behind it.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { arched, inset, panel, walls, type XY } from './sf-opera-house'
import { beam, ccw, earcut, lathe, report } from './sf-de-young'

const BEARING = 315
const ANCHOR = { lng: -122.38951278, lat: 37.77843769 }

const brick = new Part(), green = new Part(), stone = new Part(), win = new Part(), red = new Part(), roof = new Part()

// ---------------------------------------------------------------------------
// Small helpers

const sub2 = (a: XY, b: XY): XY => [a[0] - b[0], a[1] - b[1]]
const nrm2 = (a: XY): XY => { const l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l] }
const add2 = (a: XY, b: XY, s = 1): XY => [a[0] + b[0] * s, a[1] + b[1] * s]

/** Right-hand normals of an open polyline, mitred at the joints (length 1/cos of the half angle). */
function mitres(B: XY[]): XY[] {
  return B.map((p, i) => {
    const segN = (a: XY, b: XY): XY => { const d = nrm2(sub2(b, a)); return [d[1], -d[0]] }
    if (i === 0) return segN(B[0], B[1])
    if (i === B.length - 1) return segN(B[i - 1], B[i])
    const n1 = segN(B[i - 1], p), n2 = segN(p, B[i + 1])
    const m = nrm2([n1[0] + n2[0], n1[1] + n2[1]]), c = m[0] * n1[0] + m[1] * n1[1]
    return [m[0] / c, m[1] / c]
  })
}

/** Distance along the ray p + t*d to the nearest crossing of closed ring F, or null. */
function rayHit(p: XY, d: XY, F: XY[], tmin: number): number | null {
  let best: number | null = null
  for (let i = 0; i < F.length; i++) {
    const a = F[i], b = F[(i + 1) % F.length], e = sub2(b, a)
    const den = d[0] * e[1] - d[1] * e[0]
    if (Math.abs(den) < 1e-9) continue
    const w = sub2(a, p), t = (w[0] * e[1] - w[1] * e[0]) / den, s = (w[0] * d[1] - w[1] * d[0]) / den
    if (s >= 0 && s <= 1 && t > tmin && (best === null || t < best)) best = t
  }
  return best
}

/** A prism over any simple ring: walls on `wall`, lid on `top`, both facing out. */
function prismAny(wall: Part, top: Part | null, ring0: XY[], z0: number, z1: number) {
  const r = ccw(ring0)
  walls(wall, r, z0, z1)
  if (top) for (const [i, j, k] of earcut(r)) top.tri([r[i][0], r[i][1], z1], [r[j][0], r[j][1], z1], [r[k][0], r[k][1], z1])
}

/** A brick block with a stone cornice band and a roof. */
function block(ring: XY[], h: number) {
  const r = ccw(ring)
  walls(brick, r, 0, h - 1.1)
  // the cornice: 0.35 m proud, with its underside
  const o = inset(r, -0.35)
  walls(stone, o, h - 1.1, h)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    stone.quad([o[i][0], o[i][1], h - 1.1], [r[i][0], r[i][1], h - 1.1], [r[j][0], r[j][1], h - 1.1], [o[j][0], o[j][1], h - 1.1])
  }
  for (const [i, j, k] of earcut(o)) roof.tri([o[i][0], o[i][1], h], [o[j][0], o[j][1], h], [o[k][0], o[k][1], h])
}

/** Arched windows along a wall A-B (plan), facing n: width w, sill z0, crown zc, at most every `step` m. */
function archRow(part: Part, A: XY, B: XY, n: XY, step: number, w: number, z0: number, zc: number, margin = 2) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u = nrm2(sub2(B, A))
  const k = Math.floor((L - 2 * margin) / step)
  if (k < 1) return
  const s0 = (L - (k - 1) * step) / 2
  for (let i = 0; i < k; i++) {
    const c = add2(A, u, s0 + i * step)
    arched(part, add2(c, u, -w / 2), add2(c, u, w / 2), n, z0, zc, 0.06, 6)
  }
}

/** A box between two plan points (a slab of thickness t across the line), z0..z1. */
function slab(part: Part, a: XY, b: XY, t: number, z0: number, z1: number, za1 = z0, zb1 = z1) {
  const u = nrm2(sub2(b, a)), n: XY = [-u[1] * t / 2, u[0] * t / 2]
  const ring: XY[] = [add2(a, n, -1), add2(b, n, -1), add2(b, n), add2(a, n)]
  // bottom z0 at a, za1 at b; top z1 at a, zb1 at b (lets a slab tilt along its length)
  const bot = [z0, za1, za1, z0], top = [z1, zb1, zb1, z1]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    part.quad([ring[i][0], ring[i][1], bot[i]], [ring[j][0], ring[j][1], bot[j]], [ring[j][0], ring[j][1], top[j]], [ring[i][0], ring[i][1], top[i]])
  }
  part.quad([ring[0][0], ring[0][1], top[0]], [ring[1][0], ring[1][1], top[1]], [ring[2][0], ring[2][1], top[2]], [ring[3][0], ring[3][1], top[3]])
  part.quad([ring[3][0], ring[3][1], bot[3]], [ring[2][0], ring[2][1], bot[2]], [ring[1][0], ring[1][1], bot[1]], [ring[0][0], ring[0][1], bot[0]])
}

// ---------------------------------------------------------------------------
// The stands: one profile swept along the back of the canopy, from the 3rd
// Street end (right field) round the chamfered corner behind home plate,
// along King Street and round into the short 2nd Street wing (left field).

const BACK: XY[] = [
  [-87, -62], [-91, -40], [-96, -16], [-98.5, 0], [-99.5, 20], [-97, 38], [-89, 54.5], [-74, 70], [-60, 80.5],
  [-46, 86.5], [-30, 87.8], [20, 87.8], [36, 85.5], [52, 82.5], [68, 80], [84, 77], [96, 73], [104.5, 65], [108.5, 55], [109, 30],
]
const M = mitres(BACK)

/** The field outline (inner ring way/98224507), where the lower bowl stops. */
const FIELD: XY[] = [
  [-40.6, 27.2], [-44.6, 18.7], [-44.4, 14], [-35.2, -44.9], [-25.8, -55.9], [-23.3, -73.5], [7.7, -84.3], [33.7, -89.3],
  [44.1, -90.4], [57.6, -71.4], [71.2, -83], [86.9, -65.4], [73.3, -53.6], [79.7, -46], [76.5, -43.3], [76.2, 20.5],
  [97.3, 21], [97.1, 25.8], [76, 24.2], [71.1, 29.9], [56.5, 27.9], [22.3, 34.8], [-25.2, 33.2], [-35.6, 31.1],
]

// Profile across the stand: (depth from the back, height) and the material of
// the strip that ends at each point. The last two points are the lower bowl's
// front, at a depth found per station by casting into the field outline.
type Prof = { d: number; h: number; m: Part }
const PROFILE: Prof[] = [
  { d: 0, h: 0, m: stone },
  { d: 0, h: 2.2, m: stone }, // stone plinth
  { d: 0, h: 14, m: brick }, // the brick base
  { d: 1.2, h: 14, m: stone }, // its cap
  { d: 1.2, h: 36.8, m: roof }, // behind the steel frame: the concourse and the seat undersides
  { d: 0, h: 36.8, m: green },
  { d: 0, h: 38.3, m: green }, // canopy fascia
  { d: 8, h: 38, m: green }, // canopy roof
  { d: 8, h: 30.5, m: green }, // its front
  { d: 24.5, h: 20.5, m: green }, // upper deck seats
  { d: 24.5, h: 10.8, m: green }, // upper deck fascia
  { d: 29.5, h: 10.8, m: roof }, // club level roof
  { d: 29.5, h: 4.9, m: green }, // club front
  { d: -1, h: 0.9, m: green }, // lower bowl seats, to the field wall
  { d: -1, h: 0, m: green }, // the field wall
]
const DEPTH = BACK.map((p, i) => {
  const ml = Math.hypot(M[i][0], M[i][1]), dir = nrm2(M[i])
  const t = rayHit(p, dir, FIELD, 32)
  return Math.min(62, Math.max(38, t === null ? 49 : t)) / ml
})
const rings: V3[][] = PROFILE.map((q) => BACK.map((p, i) => {
  const d = q.d < 0 ? DEPTH[i] : q.d
  return [p[0] + M[i][0] * d, p[1] + M[i][1] * d, q.h] as V3
}))
for (let k = 0; k < PROFILE.length - 1; k++) {
  const A = rings[k], Bq = rings[k + 1], part = PROFILE[k + 1].m
  for (let i = 0; i < BACK.length - 1; i++) part.quad(A[i + 1], A[i], Bq[i], Bq[i + 1])
}
// End caps: the cross-section polygon at each end of the sweep.
for (const [i, dir] of [[0, -1], [BACK.length - 1, 1]] as [number, number][]) {
  const pts = rings.map((r) => r[i])
  const t: XY = nrm2(sub2(BACK[i + (dir < 0 ? 1 : -1)], BACK[i])) // pointing back along the sweep
  const n2 = nrm2(M[i])
  const flat2: XY[] = pts.map((p) => [(p[0] - BACK[i][0]) * n2[0] + (p[1] - BACK[i][1]) * n2[1], p[2]])
  const r = ccw(flat2), rev = r !== flat2
  for (const [a, b, c] of earcut(r)) {
    const ia = rev ? pts.length - 1 - a : a, ib = rev ? pts.length - 1 - b : b, ic = rev ? pts.length - 1 - c : c
    const P = pts[ia], Q = pts[ib], R = pts[ic]
    const nz = (Q[0] - P[0]) * (R[1] - P[1]) - (Q[1] - P[1]) * (R[0] - P[0]) // not used: orient by the 3D normal below
    void nz
    const cr: V3 = [
      (Q[1] - P[1]) * (R[2] - P[2]) - (Q[2] - P[2]) * (R[1] - P[1]),
      (Q[2] - P[2]) * (R[0] - P[0]) - (Q[0] - P[0]) * (R[2] - P[2]),
      0,
    ]
    const out = cr[0] * -t[0] + cr[1] * -t[1] > 0
    if (out) green.tri(P, Q, R)
    else green.tri(P, R, Q)
  }
}

// The brick base along King Street: arched windows between the piers.
for (let i = 9; i < 13; i++) {
  const a = BACK[i], b = BACK[i + 1], m = M[i]
  archRow(win, a, b, nrm2([-m[0], -m[1]]), 9, 3.6, 3, 11.8, 3)
}
// The exposed green steel frame above it, all round the back of the stands:
// a column every bay (about 9 m) and a chevron of braces in each bay.
for (let i = 0; i < BACK.length - 1; i++) {
  const a = BACK[i], b = BACK[i + 1], m = M[i], out = nrm2([-m[0], -m[1]])
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = nrm2(sub2(b, a))
  const bays = Math.max(1, Math.round(L / 9)), bw = L / bays
  const at = (s: number, z: number): V3 => { const p = add2(add2(a, u, s), out, -1.2 + 0.3); return [p[0], p[1], z] }
  for (let k = 0; k <= bays; k++) {
    if (k === bays && i < BACK.length - 2) continue // the next segment's first column stands here
    beam(green, at(k * bw, 14), at(k * bw, 36.8), 1.1, 0.6)
  }
  for (let k = 0; k < bays; k++) {
    beam(green, at(k * bw + 0.5, 14.6), at((k + 0.5) * bw, 36.2), 0.9, 0.5)
    beam(green, at((k + 1) * bw - 0.5, 14.6), at((k + 0.5) * bw, 36.2), 0.9, 0.5)
  }
}

// ---------------------------------------------------------------------------
// Buildings round the stands

// 3rd and King: the corner building under the clock tower
block([[-124, 57], [-89, 54.5], [-74, 70], [-60, 80.5], [-52, 87.8], [-81.6, 87.8], [-81.6, 74.5], [-93.6, 74], [-93.4, 71.4], [-98.2, 70.6], [-98, 65.2], [-124, 60.6]], 23)
// along 3rd Street, north to south
block([[-151.8, 55.8], [-151.5, 8.1], [-117.6, 13.9], [-124.1, 57]], 15)
block([[-117.6, 13.9], [-99.4, 11.8], [-99.5, 20], [-97, 38], [-89.5, 54.4], [-124.1, 57]], 24)
block([[-121.6, 8.5], [-115.1, -23.9], [-103.2, -21.9], [-101.5, -31.3], [-91.4, -29.6], [-99.2, 11.8]], 13)
block([[-118.9, -24.6], [-114.8, -47.5], [-98.8, -52.8], [-87.9, -51.3], [-91.4, -29.6], [-101.5, -31.3], [-103.2, -21.9]], 9)
block([[-101, -52], [-90, -52], [-90, -41], [-101, -41]], 22) // stair tower at the end of the stand
// King Street east of the stand, and the 2nd Street building
block([[36, 85.5], [52, 82.5], [68, 80], [84, 77], [96, 73], [100.2, 75.5], [100.2, 88.6], [36, 88.6]], 15)
block([[108.8, 28], [118.5, 28], [118.5, 88.6], [100.2, 88.6], [100.2, 75.5], [104.5, 65], [108.5, 55]], 22)

// Arched windows on the street fronts of those buildings
archRow(win, [-151.5, 8.1], [-151.8, 55.8], [-1, 0], 8, 3.2, 2.5, 10.5)
archRow(win, [36, 88.6], [100.2, 88.6], [0, 1], 9, 3.6, 3, 11.8, 3)
archRow(win, [-81.6, 87.8], [-52, 87.8], [0, 1], 9, 3.6, 3, 11.8)
archRow(win, [118.5, 28], [118.5, 75], [1, 0], 9, 3.6, 3, 11.8)
archRow(win, [-124.1, 60.6], [-98, 65.2], [-0.17, 0.98], 8, 3.2, 3, 11.8)

// The two brick towers: 3rd and King (the clock tower at the Willie Mays gate)
// and 2nd and King, alike.
for (const [cx, cy] of [[-88, 81], [107.5, 81.5]] as XY[]) {
  const h = 7, EAVE = 31.6
  prismAny(brick, null, [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]], 0, EAVE - 1.6)
  // stone band under the clock stage and the cornice
  prismAny(stone, stone, [[cx - h - 0.3, cy - h - 0.3], [cx + h + 0.3, cy - h - 0.3], [cx + h + 0.3, cy + h + 0.3], [cx - h - 0.3, cy + h + 0.3]], 19.5, 20.3)
  prismAny(stone, null, [[cx - h - 0.5, cy - h - 0.5], [cx + h + 0.5, cy - h - 0.5], [cx + h + 0.5, cy + h + 0.5], [cx - h - 0.5, cy + h + 0.5]], EAVE - 1.6, EAVE)
  // the pyramid roof, from the cornice to 38, with a short finial
  const r0: XY[] = [[cx - h - 0.5, cy - h - 0.5], [cx + h + 0.5, cy - h - 0.5], [cx + h + 0.5, cy + h + 0.5], [cx - h - 0.5, cy + h + 0.5]]
  for (let i = 0; i < 4; i++) {
    const a = r0[i], b = r0[(i + 1) % 4]
    green.tri([a[0], a[1], EAVE], [b[0], b[1], EAVE], [cx, cy, 38])
  }
  prismAny(green, green, [[cx - 0.35, cy - 0.35], [cx + 0.35, cy - 0.35], [cx + 0.35, cy + 0.35], [cx - 0.35, cy + 0.35]], 37.5, 44.6)
  // clock faces on all four sides, and a tall arched window under each
  for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as XY[]) {
    const c: XY = [cx + nx * h, cy + ny * h], t: XY = [-ny, nx]
    const seg = 14, R = 2.4, zc = 25.3
    for (let i = 0; i < seg; i++) {
      const a0 = (2 * Math.PI * i) / seg, a1 = (2 * Math.PI * (i + 1)) / seg
      const P = (a: number, r: number): V3 => [c[0] + nx * 0.1 + t[0] * Math.cos(a) * r, c[1] + ny * 0.1 + t[1] * Math.cos(a) * r, zc + Math.sin(a) * r]
      stone.tri([c[0] + nx * 0.1, c[1] + ny * 0.1, zc], P(a0, R), P(a1, R))
    }
    arched(win, add2(c, t, -1.4), add2(c, t, 1.4), [nx, ny], 6, 17.5, 0.06, 6)
  }
}

// ---------------------------------------------------------------------------
// The outfield: the arcade along the cove, the centre-field deck and the
// left-field deck behind the bleachers, all at the arcade's height.

const DECK = 7.6
const COVE_W: XY = [-87, -61.5], COVE_E: XY = [75.6, -116.5]
const outfield: XY[] = [
  COVE_W, COVE_E, [94.6, -94.6], [104.2, -96.5], [117.8, -92.8], [118.5, -90], [118.5, 28], [100, 28], [100, -46],
  [79.7, -46], [73.3, -53.6], [86.9, -65.4], [71.2, -83], [57.6, -71.4], [44.1, -90.4], [33.7, -89.3], [7.7, -84.3],
  [-23.3, -73.5], [-25.8, -55.9], [rings[PROFILE.length - 1][0][0], rings[PROFILE.length - 1][0][1]],
]
{
  const r = ccw(outfield)
  // walls: stone on the cove face (the arcade), brick elsewhere (the right-field wall and the outer walls)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const cove = (a === COVE_W && b === COVE_E) || (a === COVE_E && b === COVE_W)
    ;(cove ? stone : brick).quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], DECK], [a[0], a[1], DECK])
  }
  for (const [i, j, k] of earcut(r)) roof.tri([r[i][0], r[i][1], DECK], [r[j][0], r[j][1], DECK], [r[k][0], r[k][1], DECK])
  // the arcade's parapet along the cove, and its arches
  const u = nrm2(sub2(COVE_E, COVE_W)), out: XY = [u[1], -u[0]]
  slab(stone, add2(COVE_W, out, -0.3), add2(COVE_E, out, -0.3), 1.0, DECK, DECK + 1.1)
  archRow(win, COVE_W, COVE_E, out, 5.6, 4.3, 1.0, 6.6, 3)
  // archways in the brick right-field wall, facing the field
  const RF: [XY, XY][] = [[[-23.3, -73.5], [7.7, -84.3]], [[7.7, -84.3], [33.7, -89.3]]]
  for (const [a, b] of RF) {
    const t = nrm2(sub2(b, a))
    archRow(win, a, b, [t[1], -t[0]].map((v) => -v) as XY, 6, 3.4, 0.8, 5.6, 2)
  }
}

// Left-field bleachers: a green rake from the 2.6 m wall up to the deck.
{
  const x0 = 76.3, x1 = 100, y0 = -46, y1 = 26
  green.quad([x0, y0, 2.6], [x1, y0, DECK], [x1, y1, DECK], [x0, y1, 2.6])
  green.quad([x0, y0, 0], [x0, y0, 2.6], [x0, y1, 2.6], [x0, y1, 0])
  green.tri([x0, y0, 0], [x1, y0, 0], [x1, y0, DECK]); green.tri([x0, y0, 0], [x1, y0, DECK], [x0, y0, 2.6])
  green.tri([x1, y1, 0], [x0, y1, 0], [x0, y1, 2.6]); green.tri([x1, y1, 0], [x0, y1, 2.6], [x1, y1, DECK])
}

// ---------------------------------------------------------------------------
// Light banks: green frames with a pale lamp face towards the field, on legs
// from the canopy roof.

function lightBank(a: XY, b: XY, zb: number, zt: number, zLeg: number, legs: number[], faceN: XY, zbB = zb, ztB = zt) {
  slab(green, a, b, 1.6, zb, zt, zbB, ztB)
  // lamp face: a panel just proud of the field side
  const u = nrm2(sub2(b, a)), L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const fa = add2(add2(a, faceN, 0.86), u, 0.6), fb = add2(add2(b, faceN, 0.86), u, -0.6)
  const pa: V3 = [fa[0], fa[1], zb + 0.6], pb: V3 = [fb[0], fb[1], zbB + 0.6], qb: V3 = [fb[0], fb[1], ztB - 0.6], qa: V3 = [fa[0], fa[1], zt - 0.6]
  const nn = (pb[0] - pa[0]) * faceN[1] - (pb[1] - pa[1]) * faceN[0]
  if (nn < 0) roof.quad(pa, pb, qb, qa)
  else roof.quad(pb, pa, qa, qb)
  for (const s of legs) {
    const c = add2(a, u, s * L), zt0 = zb + (zbB - zb) * s
    prismAny(green, null, [[c[0] - 0.8, c[1] - 0.8], [c[0] + 0.8, c[1] - 0.8], [c[0] + 0.8, c[1] + 0.8], [c[0] - 0.8, c[1] + 0.8]], zLeg, zt0)
  }
}
lightBank([-23.3, 86.4], [11.1, 86.4], 50.6, 56.6, 38, [0.15, 0.5, 0.85], [0, -1])
lightBank([34.7, 83.2], [70.8, 78.4], 50.6, 56.6, 38, [0.15, 0.5, 0.85], [-0.13, -0.99])
lightBank([71.4, 73.2], [80, 64.4], 56.4, 62.7, 38, [0.2, 0.8], [-0.72, -0.7], 68.5, 75)
lightBank([-93.2, 1.6], [-86.2, -46.5], 50.6, 56.6, 38, [0.15, 0.5, 0.85], [0.99, 0.14])

// ---------------------------------------------------------------------------
// The scoreboard: two lattice towers on the south-east diagonal with light
// banks on top, the board between them facing home plate, a clock over it.
{
  const A: XY = [64, -103.3], B: XY = [104, -56.6]
  const u = nrm2(sub2(B, A)), n: XY = [-u[1], u[0]] // n faces the field (north-west)
  const L = Math.hypot(B[0] - A[0], B[1] - A[1])
  for (const s of [0, L]) {
    const c = add2(A, u, s)
    slab(green, add2(c, u, -2.6), add2(c, u, 2.6), 3.2, DECK, 48.6)
    lightBank(add2(c, u, -4.6), add2(c, u, 4.6), 48.6, 55.6, 48.6, [], n)
  }
  const P = (s: number, o: number): XY => add2(add2(A, u, s), n, o)
  slab(green, P(5.5, 0), P(L - 5.5, 0), 3, 12, 34.6) // the board
  slab(green, P(L / 2 - 9, 0), P(L / 2 + 9, 0), 3, 34.6, 47) // its crown
  // the screen and the clock on the field side
  const scr = (s0: number, s1: number, z0: number, z1: number) => panel(win, P(s0, 1.5), P(s1, 1.5), n, z0, z1)
  scr(7.5, L - 7.5, 14, 33)
  const cc = P(L / 2, 1.56), R = 3.2, zc = 40.6
  for (let i = 0; i < 16; i++) {
    const a0 = (2 * Math.PI * i) / 16, a1 = (2 * Math.PI * (i + 1)) / 16
    const Q = (a: number): V3 => [cc[0] + u[0] * Math.cos(a) * R, cc[1] + u[1] * Math.cos(a) * R, zc + Math.sin(a) * R]
    stone.tri([cc[0], cc[1], zc], Q(a1), Q(a0))
  }
  // posts under the board
  for (const s of [L * 0.3, L * 0.7]) slab(green, P(s - 0.8, 0), P(s + 0.8, 0), 1.6, DECK, 12)
}

// ---------------------------------------------------------------------------
// The Coca-Cola bottle: 24 m long, lying on the left-field deck at 28 degrees,
// its neck up towards the cove. Green (the real one is an open green steel
// lattice) with the red label band.
{
  const base: V3 = [108.6, -10.8, 9.8], tip: V3 = [115.6, -30.6, 21]
  const ax: V3 = [tip[0] - base[0], tip[1] - base[1], tip[2] - base[2]]
  const Lb = Math.hypot(...ax), w: V3 = [ax[0] / Lb, ax[1] / Lb, ax[2] / Lb]
  // a frame round the axis
  const e1n = Math.hypot(w[1], w[0]), e1: V3 = [-w[1] / e1n, w[0] / e1n, 0]
  const e2: V3 = [w[1] * e1[2] - w[2] * e1[1], w[2] * e1[0] - w[0] * e1[2], w[0] * e1[1] - w[1] * e1[0]]
  const S = Lb / 24
  const prof: [number, number][] = [[0, 0], [2.6, 0], [3.2, 0.5], [3.3, 3.5], [2.85, 7], [3.2, 9.3], [3.45, 10.6]]
  const label: [number, number][] = [[3.45, 10.6], [3.55, 11.1], [3.55, 15.1], [3.45, 15.6]]
  const top: [number, number][] = [[3.45, 15.6], [3.1, 16.5], [2.2, 18.8], [1.4, 20.8], [1.3, 22.8], [1.6, 23.1], [1.55, 24], [0, 24]]
  // lathe in a local frame (x, y radial, z along the axis), then transform
  const place = (p: Part, pr: [number, number][]) => {
    const tmp = new Part()
    lathe(tmp, pr.map(([r, s]) => [r, s * S]), 14)
    for (let i = 0; i < tmp.pos.length; i += 9) {
      const corner = (k: number): V3 => {
        // tmp stores glTF frame (x, z, -y): undo to map frame first
        const x = tmp.pos[i + k * 3], y = -tmp.pos[i + k * 3 + 2], z = tmp.pos[i + k * 3 + 1]
        return [base[0] + e1[0] * x + e2[0] * y + w[0] * z, base[1] + e1[1] * x + e2[1] * y + w[1] * z, base[2] + e1[2] * x + e2[2] * y + w[2] * z]
      }
      const nrm = (k: number): V3 => {
        const x = tmp.nrm[i + k * 3], y = -tmp.nrm[i + k * 3 + 2], z = tmp.nrm[i + k * 3 + 1]
        return [e1[0] * x + e2[0] * y + w[0] * z, e1[1] * x + e2[1] * y + w[1] * z, e1[2] * x + e2[2] * y + w[2] * z]
      }
      p.tri(corner(0), corner(1), corner(2), undefined, undefined, undefined, [nrm(0), nrm(1), nrm(2)])
    }
  }
  place(green, prof)
  place(red, label)
  place(green, top)
  // the frame it rests on: two legs from the deck
  for (const s of [3, 13]) {
    const c: V3 = [base[0] + w[0] * s * S, base[1] + w[1] * s * S, base[2] + w[2] * s * S]
    prismAny(green, null, [[c[0] - 0.7, c[1] - 0.7], [c[0] + 0.7, c[1] - 0.7], [c[0] + 0.7, c[1] + 0.7], [c[0] - 0.7, c[1] + 0.7]], DECK, c[2] - 2.6)
  }
}

// ---------------------------------------------------------------------------
// The glove: an old four-fingered mitt 8 m tall standing on the deck, its palm
// to home plate. Leather brown is close enough to the brick to share it.
{
  const C: XY = [113.5, -48.5], f: XY = nrm2([-148.5, 73.5]) // facing home plate
  const s: XY = [f[1], -f[0]] // across the glove, to its right as seen from the field
  const z0 = DECK
  const at = (a: number, b: number, z: number): V3 => [C[0] + s[0] * a + f[0] * b, C[1] + s[1] * a + f[1] * b, z]
  // a smooth rounded lobe from (a,b,za) to (a2,b2,zb), radius r, squashed to `sq` across the glove's depth
  const lobe = (a: number, b: number, za: number, a2: number, b2: number, zb: number, r: number, sq = 1) => {
    const P = at(a, b, za), Q = at(a2, b2, zb)
    const tmp = new Part()
    const len = Math.hypot(Q[0] - P[0], Q[1] - P[1], Q[2] - P[2])
    lathe(tmp, [[0, -r * 0.25], [r * 0.75, 0], [r, r * 0.55], [r, len - r * 0.55], [r * 0.7, len], [0, len + r * 0.3]], 10)
    const w: V3 = [(Q[0] - P[0]) / len, (Q[1] - P[1]) / len, (Q[2] - P[2]) / len]
    // e1 across the glove, e2 through its depth (towards the field)
    const sx: V3 = [s[0], s[1], 0], dn = sx[0] * w[0] + sx[1] * w[1] + sx[2] * w[2]
    const e1 = ((v: V3) => { const l = Math.hypot(...v); return [v[0] / l, v[1] / l, v[2] / l] as V3 })([sx[0] - w[0] * dn, sx[1] - w[1] * dn, sx[2] - w[2] * dn])
    const e2: V3 = [w[1] * e1[2] - w[2] * e1[1], w[2] * e1[0] - w[0] * e1[2], w[0] * e1[1] - w[1] * e1[0]]
    const map = (x: number, y: number, z: number, n: boolean): V3 => {
      const yy = n ? y / sq : y * sq
      const v: V3 = [e1[0] * x + e2[0] * yy + w[0] * z, e1[1] * x + e2[1] * yy + w[1] * z, e1[2] * x + e2[2] * yy + w[2] * z]
      return n ? v : [P[0] + v[0], P[1] + v[1], P[2] + v[2]]
    }
    for (let i = 0; i < tmp.pos.length; i += 9) {
      const c = (k: number) => map(tmp.pos[i + k * 3], -tmp.pos[i + k * 3 + 2], tmp.pos[i + k * 3 + 1], false)
      const nn = (k: number) => map(tmp.nrm[i + k * 3], -tmp.nrm[i + k * 3 + 2], tmp.nrm[i + k * 3 + 1], true)
      brick.tri(c(0), c(1), c(2), undefined, undefined, undefined, [nn(0), nn(1), nn(2)])
    }
  }
  // the palm and heel: a broad pad, flattened front to back
  lobe(0, 0, z0 + 0.3, 0, 0, z0 + 4.8, 4.9, 0.55)
  // four fat fingers side by side, leaning back a little
  for (const a of [-3.75, -1.25, 1.25, 3.75]) lobe(a * 0.85, -0.3, z0 + 3.4, a, -1.1, z0 + 8.0, 1.35, 0.85)
  // the thumb, out to one side and forward
  lobe(4.2, 0.4, z0 + 1.4, 6.4, 1.8, z0 + 5.6, 1.25, 0.85)
}

const parts = [
  { part: brick, material: finish('oracle-brick', 0xbb735f) },
  { part: green, material: finish('giants-green', 0x67827b) },
  { part: stone, material: PALETTE.stone },
  { part: win, material: PALETTE.window },
  { part: red, material: finish('coke-red', 0xc24a3f) },
  { part: roof, material: PALETTE.roof },
]
const glb = writeGlb('Oracle Park', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 75,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: REPLACES(),
})
function REPLACES() {
  return ['relation/7330762', 'relation/7325085', 'way/499568642', 'way/499568643', 'way/499568644', 'way/499568645', 'way/499568646', 'way/499568647',
    'way/499568648', 'way/499568649', 'way/499568652', 'way/368215207', 'way/368215208', 'way/368214736', 'way/368214737']
}
const tris = report('Oracle Park', parts, glb, 6500)
const out = new URL('../models/sf-oracle-park.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
