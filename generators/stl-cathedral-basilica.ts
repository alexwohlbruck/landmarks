/**
 * Cathedral Basilica of Saint Louis ("New Cathedral"), 4431 Lindell Blvd,
 * St. Louis (1907–1914; Barnett, Haynes & Barnett) — original procedural
 * geometry, CC0-1.0.  bun generators/stl-cathedral-basilica.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 15: the model's +y runs up the nave from the
 * Lindell Blvd front (south-south-west end, y = -46) to the choir. Anchor =
 * the centroid of OSM way/477985197, -90.2546541, 38.6425276.
 *
 * Identity (from the photos below):
 *  1. The great green-tiled dome on a round drum ringed with gabled
 *     aedicules and arched windows, a small lantern and cross.  (ant-a, ant-m)
 *  2. Two square west towers: a stage of paired windows, a belfry of three
 *     arched openings a face, corner turrets with little pyramids, gablets,
 *     and a steep green pyramid spire.               (ant-h, quarter, star)
 *  3. The front: a gable over a big arch round the rose window, between
 *     two octagonal stair turrets with conical caps; three round-arched
 *     portals under small gables.                                 (ant-h)
 *  4. Rounded transept apses: two storeys of arched windows and a low
 *     green half-dome; an octagonal crossing base under the drum.  (ant-m)
 *  5. Grey granite everywhere, green tile roofs.                (all)
 *
 * Plan: OSM way/477985197 and its parts turned to bearing 15 (they agree
 * with the lidar within a metre): towers 7.7 x 8.8 m at x ±16.2–23.9,
 * y -46.3 to -37.4; nave ±13; aisles to ±19; crossing octagon
 * way/617120622; drum way/617120623 (r ≈ 14.8); transept apses r 12.2
 * about (±19, 1.7); north choir and low apse to y 55.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018 (flown 2017),
 * 0.5 m grid read with tools/lidar_frame.py, above the ground round the
 * building (2.6 m over the box's ground_min; the site is flat). Measured:
 * aisles 10, nave walls 26.5, nave ridge 31.7, front gable 29.5, crossing
 * octagon 33, drum cornice 44.4 at r 12.5–14.5, the aedicule gables to 43
 * at r 15–16, dome 51.3 at r 11, 54 at r 8, 55.6 at r 5, 56.2 at r 3,
 * lantern 60.6–62, cross top 65.7; apse half-domes 20.9 at the rim, 24.3
 * at r 9, 25.6 at r 6, 27.8 at the crown; crossing corner blocks 29.5;
 * tower tops 39 over the whole tower (turrets and gablets), corners 34.4.
 * Published: outer dome 227 ft / 69 m (Wikipedia), "220 ft" (city of St.
 * Louis); the lidar's 65.7 m to the cross top is used (the published
 * figures likely count from the crypt floor or include more of the cross).
 * Estimated: the tower spires. The 2017 cloud is sparse (about 1–2 points
 * a m²) and has no return above 39.6 m on either tower, even with class 18
 * kept; the spire is drawn from 38.5 to 46 m: base 5 m wide, height 1.5
 * times its base from ant-h and quarter, which agrees with OSM's 47 m for
 * the tower parts (way/617120626, way/617120627). Window, door and turret
 * sizes are read off ant-h at ~21 px/m (front 47.8 m wide); the belfry,
 * paired-window stage and portal heights likewise; the north apse turrets
 * (16 m) from lidar only.
 * Review round 1 (front and apses reworked): the rose (6 m of glass in a
 * 7 m stone ring, centre 17.6, eight spokes and an inner ring) and its arch
 * (12.9 m, springing 19.2) are rescaled off ant-h between the pavement and
 * the lidar's 29.5 m gable top (~17.5 px/m); the three portals are stone
 * porches under stone gables (centre 6 m wide, door 3 m, arch to 8.6,
 * gable 12.6; sides 4.4, 2.2, 8.0, 11.1) with stepped arches; the apse
 * drums rise to a stone parapet at 22.9 with a low green saucer behind it
 * (NAIP 0.15 m: green, ribbed, pale rim) to the lidar's 27.4 crown; the
 * belfry openings sit in a pale arcade frame.
 * Left out: the dome's ribs, the arcaded corbel tables, the colonnettes,
 * the side portal on the east aisle, the rectory and other buildings.
 *
 * Night: the front, towers and dome are floodlit; windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  ant-h   "St. Louis Cathedral exterior 2026h.jpg", Antony-22, CC BY-SA 4.0
 *          (the front, from Lindell Blvd)
 *  ant-a   "St. Louis Cathedral exterior 2026a.jpg", Antony-22, CC BY-SA 4.0
 *          (from the north-west: dome, apse, a tower)
 *  ant-m   "St. Louis Cathedral exterior 2026m.jpg", Antony-22, CC BY-SA 4.0
 *          (north-east: the nave flank, crossing, east apse, dome)
 *  quarter "Cathedral Basilica of Saint Louis (St. Louis, MO) - exterior,
 *          quarter view.jpg", Nheyob, CC BY-SA 3.0 (south-west)
 *  star    "Cathedral Basilica of Saint Louis.JPG", Starfire1118,
 *          CC BY-SA 3.0 (south-east)
 * Published: en.wikipedia.org/wiki/Cathedral_Basilica_of_Saint_Louis;
 * dynamic.stlouis-mo.gov/history/structdetail.cfm?Master_ID=1345.
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, cornice, gableRoof, onWall, prism, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { smoothWall } from './atl-flatiron-building'

// ───────────────────────── shared church kit (exported) ─────────────────────────

/** The outline of a pointed (equilateral-ish) arch: width w centred at s, from z0, springing at zs. */
export function pointedShape(s: number, w: number, z0: number, zs: number, seg = 5, k = 1): [number, number][] {
  // two arcs of radius k·w, each struck from the opposite springing line
  const r = k * w, cR = s + w / 2 - r, cL = s - w / 2 + r
  const top = Math.acos((s - cR) / r)
  const pts: [number, number][] = [[s - w / 2, z0], [s + w / 2, z0]]
  for (let i = 0; i <= seg; i++) { const a = (top * i) / seg; pts.push([cR + r * Math.cos(a), zs + r * Math.sin(a)]) }
  for (let i = seg - 1; i >= 0; i--) { const a = (top * i) / seg; pts.push([cL - r * Math.cos(a), zs + r * Math.sin(a)]) }
  return pts
}

/** A disc on a wall: centre (s, z), radius r. */
export const discShape = (s: number, z: number, r: number, n = 14): [number, number][] =>
  Array.from({ length: n }, (_, i) => [s + r * Math.cos((i / n) * Math.PI * 2), z + r * Math.sin((i / n) * Math.PI * 2)] as [number, number])

/** Bold tracery bars over a window: `lights` lights, a mullion between each, stopped at zTop. */
export function mullions(p: Part, a: XY, b: XY, s: number, w: number, z0: number, zTop: number, lights: number, bar = 0.16, out = 0.09) {
  for (let k = 1; k < lights; k++) {
    const x = s - w / 2 + (w * k) / lights
    onWall(p, a, b, rectShape(x - bar / 2, x + bar / 2, z0, zTop), out)
  }
}

/** A rose window: a glazed disc with `spokes` bold bars and a hub. */
export function rose(win: Part, bars: Part, a: XY, b: XY, s: number, z: number, r: number, spokes = 8, bar = 0.2) {
  onWall(win, a, b, discShape(s, z, r, 16), 0.06)
  for (let k = 0; k < spokes / 2; k++) {
    const t = (k / spokes) * Math.PI * 2, c = Math.cos(t), d = Math.sin(t)
    const e = bar / 2
    onWall(bars, a, b, [[s - r * c + e * d, z - r * d - e * c], [s + r * c + e * d, z + r * d - e * c], [s + r * c - e * d, z + r * d + e * c], [s - r * c - e * d, z - r * d + e * c]], 0.09)
  }
  onWall(bars, a, b, discShape(s, z, r * 0.3, 10), 0.1)
}

/** A partial solid of revolution about c from angle a0 to a1 (radians, CCW from +x): `prof` [r, z] bottom to top. Smooth. */
export function revolveArc(p: Part, c: XY, prof: [number, number][], n: number, a0: number, a1: number) {
  const ang = (i: number) => a0 + ((a1 - a0) * i) / n
  const segN = prof.slice(0, -1).map(([r0, z0], k) => {
    const [r1, z1] = prof[k + 1]
    const nr = z1 - z0, nz = -(r1 - r0), l = Math.hypot(nr, nz) || 1
    return [nr / l, nz / l] as [number, number]
  })
  const vN = prof.map((_, k) => {
    const a = segN[Math.max(0, k - 1)], b = segN[Math.min(segN.length - 1, k)]
    const r = a[0] + b[0], z = a[1] + b[1], l = Math.hypot(r, z) || 1
    return [r / l, z / l] as [number, number]
  })
  const P = (k: number, i: number): V3 => [c[0] + prof[k][0] * Math.cos(ang(i)), c[1] + prof[k][0] * Math.sin(ang(i)), prof[k][1]]
  const N = (k: number, i: number): V3 => [vN[k][0] * Math.cos(ang(i)), vN[k][0] * Math.sin(ang(i)), vN[k][1]]
  for (let k = 0; k < prof.length - 1; k++) for (let i = 0; i < n; i++) {
    const A = P(k, i), B = P(k, i + 1), C = P(k + 1, i + 1), D = P(k + 1, i)
    if (prof[k][0] > 1e-6) p.tri(A, B, C, undefined, undefined, undefined, [N(k, i), N(k, i + 1), N(k + 1, i + 1)])
    if (prof[k + 1][0] > 1e-6) p.tri(A, C, D, undefined, undefined, undefined, [N(k, i), N(k + 1, i + 1), N(k + 1, i)])
  }
}

/** A circle (or arc) of plan points. */
export const arcPts = (c: XY, r: number, a0: number, a1: number, n: number): XY[] =>
  Array.from({ length: n + 1 }, (_, i) => [c[0] + r * Math.cos(a0 + ((a1 - a0) * i) / n), c[1] + r * Math.sin(a0 + ((a1 - a0) * i) / n)] as XY)

/** The wall segment of a ring edge i (outside to the right). */
export const edgeOf = (ring: XY[], i: number): [XY, XY] => [ring[i], ring[(i + 1) % ring.length]]

/** A square-based pyramid over a box x0..x1, y0..y1 from z0 to apex z1 (any rectangle). */
export function rectPyramid(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const ap: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, z1]
  const a: V3 = [x0, y0, z0], b: V3 = [x1, y0, z0], c: V3 = [x1, y1, z0], d: V3 = [x0, y1, z0]
  p.tri(a, b, ap); p.tri(b, c, ap); p.tri(c, d, ap); p.tri(d, a, ap)
  p.quad(a, d, c, b)
}

/** A lean-to roof over a rectangle, low edge on side `low` ('x0' | 'x1' | 'y0' | 'y1'). */
export function leanTo(p: Part, x0: number, x1: number, y0: number, y1: number, zLow: number, zHigh: number, low: 'x0' | 'x1' | 'y0' | 'y1', over = 0.3) {
  const z = (x: number, y: number) => {
    if (low === 'x0') return zLow + ((zHigh - zLow) * (x - x0)) / (x1 - x0)
    if (low === 'x1') return zLow + ((zHigh - zLow) * (x1 - x)) / (x1 - x0)
    if (low === 'y0') return zLow + ((zHigh - zLow) * (y - y0)) / (y1 - y0)
    return zLow + ((zHigh - zLow) * (y1 - y)) / (y1 - y0)
  }
  const X0 = x0 - (low === 'x0' ? over : 0), X1 = x1 + (low === 'x1' ? over : 0)
  const Y0 = y0 - (low === 'y0' ? over : 0), Y1 = y1 + (low === 'y1' ? over : 0)
  const A: V3 = [X0, Y0, z(X0, Y0)], B: V3 = [X1, Y0, z(X1, Y0)], C: V3 = [X1, Y1, z(X1, Y1)], D: V3 = [X0, Y1, z(X0, Y1)]
  p.quad(A, B, C, D)
  p.quad(A, D, C, B)
}

// ─────────────────────────────── the cathedral ───────────────────────────────

if (import.meta.main) {
  const gran = new Part(), tile = new Part(), win = new Part(), trim = new Part(), door = new Part(), gilt = new Part()
  const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const S = (x0: number, x1: number, y: number): [XY, XY] => [[x0, y], [x1, y]] // a south face, left to right
  const N = (x0: number, x1: number, y: number): [XY, XY] => [[x1, y], [x0, y]]
  const E = (x: number, y0: number, y1: number): [XY, XY] => [[x, y0], [x, y1]]
  const W = (x: number, y0: number, y1: number): [XY, XY] => [[x, y1], [x, y0]]
  const arch = (f: [XY, XY], s: number, w: number, z0: number, zs: number, part = win, out = 0.05) => onWall(part, f[0], f[1], archShape(s, w, z0, zs, 6), out)

  const FRONT = -46.3, TB = -37.4 // the front plane, the towers' back
  const NAVE = 13, AISLE = 19, NAVE_N = 41.3
  const NAVE_EAVE = 26.5, NAVE_RIDGE = 31.7, AISLE_EAVE = 9.0, AISLE_TOP = 11.2

  // ── Nave and choir (one long body, the crossing octagon stands over its middle) ──
  box(gran, -NAVE, NAVE, TB, NAVE_N, 0, NAVE_EAVE, null, 0)
  cornice(gran, rect(-NAVE, NAVE, TB, NAVE_N), NAVE_EAVE - 1.0, 1.0, 0.45, null)
  gableRoof(tile, gran, -NAVE, NAVE, TB, NAVE_N, NAVE_EAVE, NAVE_RIDGE, 'y', 0.5, 0.2)
  // clerestory: in each long bay a big blind arch with an oculus and a row of three arched windows
  for (const [y0, y1] of [[-31, -17], [20.4, 34.8]]) {
    const m = (y0 + y1) / 2
    for (const [f, s] of [[E(NAVE, TB, NAVE_N), m - TB], [W(-NAVE, TB, NAVE_N), NAVE_N - m]] as [[XY, XY], number][]) {
      onWall(trim, f[0], f[1], archShape(s, 11.6, AISLE_TOP + 0.6, 18.6, 12), 0.04)
      onWall(gran, f[0], f[1], archShape(s, 10.4, AISLE_TOP + 0.6, 18.6, 12), 0.07)
      onWall(win, f[0], f[1], discShape(s, 20.0, 2.0, 14), 0.1)
      for (const d of [-2.4, 0, 2.4]) arch(f, s + d, 1.3, 12.6, 16.0, win, 0.1)
    }
  }
  // the north gable wall and the low choir apse with its two little towers
  box(gran, -14.1, 13.7, NAVE_N, 47.7, 0, 6.4, gran, 0.3)
  prism(gran, arcPts([-0.8, 47.7], 6.6, 0, Math.PI, 8), 0, 6.4, gran, 0.3)
  for (const x of [-7.6, 6.4]) { box(gran, x - 1.4, x + 1.4, 42.2, 45.4, 0, 15.2, gran, 0.3); rectPyramid(tile, x - 1.6, x + 1.6, 42.0, 45.6, 15.2, 16.4) }
  { // north gable rose
    const f = N(-NAVE, NAVE, NAVE_N)
    rose(win, trim, f[0], f[1], NAVE, 18.5, 2.6, 8)
  }

  // ── Aisles: lean-tos along the nave, front and back of the transept ──
  for (const sx of [-1, 1]) {
    const x0 = sx > 0 ? NAVE : -AISLE, x1 = sx > 0 ? AISLE : -NAVE
    for (const [y0, y1] of [[-37.4, -11], [14, 41.3]]) {
      box(gran, x0, x1, y0, y1, 0, AISLE_EAVE, null, 0)
      cornice(gran, rect(x0, x1, y0, y1), AISLE_EAVE - 0.6, 0.6, 0.3, null)
      leanTo(tile, x0, x1, y0, y1, AISLE_EAVE, AISLE_TOP, sx > 0 ? 'x1' : 'x0', 0.4)
      const f = sx > 0 ? E(AISLE, y0, y1) : W(-AISLE, y0, y1)
      const L = y1 - y0
      for (let k = 0; k < Math.floor(L / 4.2); k++) {
        const s = L / 2 + (k - (Math.floor(L / 4.2) - 1) / 2) * 4.2
        arch(f, s, 1.2, 3.0, 6.6)
      }
    }
    // the corner bays between the aisles and the towers (to 10.6)
    const bx0 = sx > 0 ? AISLE : -23.9, bx1 = sx > 0 ? 23.9 : -AISLE
    box(gran, bx0, bx1, -37.4, -31, 0, 10.6, tile, 0.3)
  }

  // ── Transept: arms out to the apses, and the rounded apses with half-domes ──
  const AC: XY = [19, 1.7], AR = 12.2
  for (const sx of [-1, 1]) {
    box(gran, sx > 0 ? 12 : -19, sx > 0 ? 19 : -12, -11, 14.4, 0, 27.4, null, 0)
    box(tile, sx > 0 ? 12 : -19.3, sx > 0 ? 19.3 : -12, -11.3, 14.7, 27.4, 28.2, tile, 0.3)
    const c: XY = [sx * AC[0], AC[1]]
    const a0 = sx > 0 ? -Math.PI / 2 : Math.PI / 2, a1 = a0 + Math.PI
    const ring = arcPts(c, AR, a0, a1, 12)
    smoothWall(gran, ring, 0, 22.4, false)
    // string course between the storeys, cornice and a stone parapet round the rim
    revolveArc(gran, c, [[AR, 9.6], [AR + 0.35, 9.9], [AR + 0.35, 10.4], [AR, 10.4]], 12, a0, a1)
    revolveArc(gran, c, [[AR, 19.6], [AR + 0.5, 20.1], [AR + 0.5, 20.7], [AR, 20.8]], 12, a0, a1)
    revolveArc(gran, c, [[AR, 22.4], [AR + 0.2, 22.5], [AR + 0.2, 22.9], [AR - 0.45, 22.9], [AR - 0.45, 21.4]], 12, a0, a1)
    // the low green saucer behind the parapet (NAIP: green, ribbed), to the lidar's crown
    revolveArc(tile, c, [[AR - 0.45, 21.4], [10, 22.5], [8, 23.6], [6, 24.6], [3, 26.2], [0.01, 27.4]], 12, a0, a1)
    // two storeys of arched windows: three big lights up, small paired ones below
    for (let k = 0; k < 12; k++) {
      const t0 = a0 + (Math.PI * k) / 12, t1 = a0 + (Math.PI * (k + 1)) / 12
      const p0: XY = [c[0] + AR * Math.cos(t0), c[1] + AR * Math.sin(t0)], p1: XY = [c[0] + AR * Math.cos(t1), c[1] + AR * Math.sin(t1)]
      const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1])
      if (k >= 1 && k <= 10) arch([p0, p1], L / 2, 1.5, 12.0, 16.6)
      if (k >= 2 && k <= 9 && k % 2 === 0) { arch([p0, p1], L / 2 - 0.5, 0.75, 3.2, 6.2); arch([p0, p1], L / 2 + 0.5, 0.75, 3.2, 6.2) }
    }
  }
  // the transept faces above the half-domes: a big arched window each
  for (const sx of [-1, 1]) {
    const f = sx > 0 ? E(19, -11, 14.4) : W(-19, -11, 14.4)
    arch(f, 12.7, 4.0, 21.5, 24.4, trim, 0.04)
    arch(f, 12.7, 3.4, 21.8, 24.4, win, 0.07)
    mullions(trim, f[0], f[1], 12.7, 3.4, 21.8, 24.4, 3)
  }

  // ── The crossing: corner blocks, octagon, drum, aedicules, dome, lantern ──
  for (const sx of [-1, 1]) for (const [y0, y1] of [[-17.1, -10.2], [13.5, 20.4]]) {
    const x0 = sx > 0 ? 12.8 : -18.2, x1 = sx > 0 ? 18.2 : -12.8
    box(gran, x0, x1, y0, y1, 0, 29.4, null, 0.3)
    cornice(gran, rect(x0, x1, y0, y1), 28.6, 0.8, 0.35, null)
    rectPyramid(tile, x0 - 0.3, x1 + 0.3, y0 - 0.3, y1 + 0.3, 29.4, 31.2)
    const f = sx > 0 ? E(x1, y0, y1) : W(x0, y0, y1)
    arch(f, (y1 - y0) / 2, 1.2, 22.5, 26.0)
  }
  const C: XY = [0, 1.7]
  const OCT: XY[] = [[-16.3, -5.6], [-7.0, -15.1], [6.5, -15.0], [15.6, -6.4], [15.4, 9.1], [7.0, 18.6], [-7.3, 18.4], [-16.5, 9.1]].map(([x, y]) => [x, y] as XY)
  const OCTccw = OCT.slice().reverse()
  prism(gran, OCTccw, 20, 32.2, null, 0)
  cornice(gran, OCTccw, 31.4, 0.8, 0.4, tile)
  // arcade of small arched windows on the four diagonal faces
  for (let i = 0; i < 8; i++) {
    const [a, b] = edgeOf(OCTccw, i), L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (const d of [-2.2, -0.7, 0.8, 2.3]) if (L > 11) arch([a, b], L / 2 + d, 0.9, 28.2, 30.0)
  }
  const DR = 14.0
  revolve(gran, C, [[DR + 0.4, 32.2], [DR, 32.6], [DR, 41.6], [DR + 0.6, 42.0], [DR + 0.6, 42.8], [12.9, 43.0], [12.9, 45.0], [12.6, 45.0]], 20, 0, false, false)
  // twelve aedicules: a gabled frame round an arched window
  for (let k = 0; k < 12; k++) {
    const t = ((k + 0.5) / 12) * Math.PI * 2, u: XY = [Math.cos(t), Math.sin(t)], v: XY = [-u[1], u[0]]
    const c0: XY = [C[0] + u[0] * (DR - 0.2), C[1] + u[1] * (DR - 0.2)]
    const hw = 1.6, dep = 1.1
    const q = (s: number, d: number): XY => [c0[0] + v[0] * s + u[0] * d, c0[1] + v[1] * s + u[1] * d]
    prism(gran, [q(-hw, 0), q(-hw, dep), q(hw, dep), q(hw, 0)].reverse() as XY[], 33.4, 41.2, gran, 0.15)
    // the gable over it
    const g0 = q(-hw - 0.15, dep + 0.15), g1 = q(hw + 0.15, dep + 0.15), b0 = q(-hw - 0.15, -0.2), b1 = q(hw + 0.15, -0.2)
    const ap: V3 = [(g0[0] + g1[0]) / 2, (g0[1] + g1[1]) / 2, 43.4], apb: V3 = [(b0[0] + b1[0]) / 2, (b0[1] + b1[1]) / 2, 43.4]
    gran.tri([g0[0], g0[1], 41.2], [g1[0], g1[1], 41.2], ap)
    tile.quad([g1[0], g1[1], 41.2], [b1[0], b1[1], 41.2], apb, ap)
    tile.quad([b0[0], b0[1], 41.2], [g0[0], g0[1], 41.2], ap, apb)
    // window between the aedicules, and one in each
    const f: [XY, XY] = [q(-hw, dep), q(hw, dep)]
    arch(f, hw, 1.4, 35.0, 38.8, win, 0.05)
    const t2 = ((k + 1) / 12) * Math.PI * 2
    const m: XY = [C[0] + Math.cos(t2) * DR, C[1] + Math.sin(t2) * DR], tv: XY = [-Math.sin(t2), Math.cos(t2)]
    arch([[m[0] - tv[0] * 1.2, m[1] - tv[1] * 1.2], [m[0] + tv[0] * 1.2, m[1] + tv[1] * 1.2]], 1.2, 1.1, 36.0, 39.4, win, 0.06)
  }
  // the dome, fitted to the lidar profile
  revolve(tile, C, [[12.6, 45.0], [12.5, 47.4], [12.1, 49.4], [11.3, 51.0], [10, 52.4], [9, 53.3], [8, 54.0], [7, 54.6], [5.6, 55.4], [4, 56.0], [2.2, 56.4]], 20, 0, false, false)
  // the lantern
  revolve(gran, C, [[2.0, 56.2], [2.0, 59.6], [2.3, 59.8], [2.3, 60.4], [1.9, 60.5]], 8, Math.PI / 8, true, false)
  for (let i = 0; i < 8; i++) {
    const t0 = Math.PI / 8 + (i / 8) * Math.PI * 2, t1 = t0 + Math.PI / 4, r = 2.0 / Math.cos(Math.PI / 8)
    const p0: XY = [C[0] + r * Math.cos(t0), C[1] + r * Math.sin(t0)], p1: XY = [C[0] + r * Math.cos(t1), C[1] + r * Math.sin(t1)]
    arch([p0, p1], Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / 2, 0.75, 57.0, 58.8, win, 0.04)
  }
  revolve(tile, C, [[1.9, 60.5], [1.6, 61.3], [0.9, 61.9], [0.3, 62.1], [0.01, 62.2]], 8, Math.PI / 8, false, false)
  revolve(gilt, C, [[0.01, 62.1], [0.35, 62.3], [0.35, 62.7], [0.01, 62.9]], 6, 0, false, false)
  box(gilt, C[0] - 0.14, C[0] + 0.14, C[1] - 0.14, C[1] + 0.14, 62.8, 65.7, gilt, 0)
  box(gilt, C[0] - 0.9, C[0] + 0.9, C[1] - 0.14, C[1] + 0.14, 64.3, 64.6, gilt, 0)

  // ── The front ──
  // the gabled centre between the stair turrets, and the lower side bays
  box(gran, -10.2, 10.2, FRONT, TB, 0, 23.6, null, 0)
  cornice(gran, rect(-10.2, 10.2, FRONT, TB), 22.8, 0.8, 0.35, null)
  gableRoof(tile, gran, -10.2, 10.2, FRONT, TB, 23.6, 29.3, 'y', 0.3, 0.45)
  for (const sx of [-1, 1]) {
    const x0 = sx > 0 ? 10.2 : -16.2, x1 = sx > 0 ? 16.2 : -10.2
    box(gran, x0, x1, FRONT, TB, 0, 19.2, null, 0)
    cornice(gran, rect(x0, x1, FRONT, TB), 18.6, 0.6, 0.3, null)
    leanTo(tile, x0, x1, FRONT, TB, 19.2, 21.6, sx > 0 ? 'x1' : 'x0', 0.2)
    // an arcade of three arched windows over a pair of small ones
    const f = S(x0, x1, FRONT), m = 3.0
    for (const d of [-1.3, 0, 1.3]) arch(f, m + d, 0.85, 10.6, 12.6)
    for (const d of [-1.2, 1.2]) arch(f, m + d, 0.8, 2.4, 4.4)
    arch(f, m, 1.0, 14.6, 16.6)
  }
  {
    const f = S(-10.2, 10.2, FRONT), m = 10.2
    // the great round arch, and the rose filling it (ant-h, scaled between the
    // pavement and the lidar's 29.5 m gable top, ~17.5 px/m: arch 12.9 m across,
    // springing ~19.2, top ~25.6; rose 6 m of glass in a 7 m stone ring, centre ~17.6)
    onWall(trim, f[0], f[1], archShape(m, 12.9, 13.6, 19.2, 16), 0.04)
    onWall(gran, f[0], f[1], archShape(m, 11.3, 13.6, 19.2, 16), 0.07)
    onWall(trim, f[0], f[1], discShape(m, 17.6, 3.5, 16), 0.1) // the stone ring
    onWall(win, f[0], f[1], discShape(m, 17.6, 3.0, 16), 0.13) // the glass
    for (let k = 0; k < 8; k++) { // eight bold spokes
      const t = (k / 8) * Math.PI * 2, c = Math.cos(t), d = Math.sin(t), e = 0.11
      const p0: [number, number] = [m + 1.05 * c, 17.6 + 1.05 * d], p1: [number, number] = [m + 3.0 * c, 17.6 + 3.0 * d]
      onWall(trim, f[0], f[1], [[p0[0] + e * d, p0[1] - e * c], [p1[0] + e * d, p1[1] - e * c], [p1[0] - e * d, p1[1] + e * c], [p0[0] - e * d, p0[1] + e * c]], 0.16)
    }
    onWall(trim, f[0], f[1], discShape(m, 17.6, 1.2, 14), 0.16) // the inner ring
    onWall(win, f[0], f[1], discShape(m, 17.6, 0.85, 12), 0.18)
    onWall(trim, f[0], f[1], discShape(m, 17.6, 0.3, 8), 0.2) // the hub
    for (const d of [-7.4, 7.4]) arch(f, m + d, 0.75, 16.0, 18.6, win, 0.05)
    // three deep round-arched portals, each in a porch under its own gable
    // (ant-h: centre 6 m across, door 3 m, arch to 8.6, gable 12.6; sides 4.4 m,
    // door 2.2 m, arch to 8.0, gables 11.1)
    const P0 = FRONT - 1.2
    for (const [x, W, dw, spring, top, apex] of [[0, 6.0, 3.0, 7.1, 9.8, 12.6], [-6.4, 4.4, 2.2, 6.9, 9.4, 11.1], [6.4, 4.4, 2.2, 6.9, 9.4, 11.1]]) {
      box(gran, x - W / 2, x + W / 2, P0, FRONT + 0.1, 0, top, null, 0)
      gableRoof(trim, gran, x - W / 2, x + W / 2, P0, FRONT + 0.1, top, apex, 'x', 0.25, 0.15)
      // the gable's own face, standing a little proud, with a pale coping
      const g = S(x - W / 2, x + W / 2, P0)
      onWall(trim, g[0], g[1], [[0, top], [W, top], [W / 2, apex]], 0.12)
      onWall(gran, g[0], g[1], [[0.5, top + 0.1], [W - 0.5, top + 0.1], [W / 2, apex - 0.45]], 0.15)
      // the stepped arches round the door, the door, its tympanum
      onWall(trim, g[0], g[1], archShape(W / 2, dw + 1.6, 1.75, spring, 12), 0.04)
      onWall(gran, g[0], g[1], archShape(W / 2, dw + 0.9, 1.75, spring, 12), 0.07)
      onWall(trim, g[0], g[1], archShape(W / 2, dw + 0.4, 1.75, spring, 12), 0.1)
      onWall(door, g[0], g[1], archShape(W / 2, dw, 1.75, spring, 12), 0.13)
      onWall(trim, g[0], g[1], rectShape(W / 2 - dw / 2, W / 2 + dw / 2, spring - 0.15, spring + 0.1), 0.15) // lintel under the tympanum
    }
    for (let k = 0; k < 11; k++) arch(f, m - 8.0 + k * 1.6, 0.75, 12.4, 13.2, win, 0.06)
    // steps up to the portals
    // (the ground in front stands ~0.8 m over the footprint's lowest point, Mapterhorn grid)
    box(gran, -10.2, 10.2, FRONT - 4.4, P0, 0, 0.95, gran, 0.05)
    box(gran, -10.2, 10.2, FRONT - 3.4, P0, 0.95, 1.35, gran, 0.05)
    box(gran, -10.2, 10.2, FRONT - 2.4, P0, 1.35, 1.75, gran, 0.05)
  }
  // octagonal stair turrets with conical caps either side of the gable
  for (const sx of [-1, 1]) {
    const c: XY = [sx * 10.2, FRONT + 0.3]
    revolve(gran, c, [[1.55, 0], [1.55, 23.4], [1.8, 23.6], [1.8, 24.3], [1.45, 24.4]], 8, Math.PI / 8, true, false)
    revolve(tile, c, [[1.55, 24.3], [0.01, 28.6]], 8, Math.PI / 8, true, false)
    revolve(gilt, c, [[0.2, 28.5], [0.01, 29.4]], 6, 0, true, false)
  }

  // ── The towers ──
  for (const sx of [-1, 1]) {
    const x0 = sx > 0 ? 16.2 : -23.9, x1 = sx > 0 ? 23.9 : -16.2, y0 = FRONT, y1 = TB, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
    const BEL0 = 26.4, BEL1 = 33.6, TOP = 34.4
    box(gran, x0, x1, y0, y1, 0, BEL0, null, 0)
    // buttress steps at the lower corners
    for (const [px, py] of [[x0, y0], [x1, y0]]) box(gran, px - 0.6, px + 0.6, py - 0.6, py + 0.6, 0, 20.4, gran, 0.3)
    cornice(gran, rect(x0, x1, y0, y1), BEL0 - 0.6, 0.6, 0.35, null)
    box(gran, x0 + 0.25, x1 - 0.25, y0 + 0.25, y1 - 0.25, BEL0, BEL1, null, 0)
    cornice(gran, rect(x0 + 0.25, x1 - 0.25, y0 + 0.25, y1 - 0.25), BEL1, TOP - BEL1, 0.55, tile)
    const faces: [XY, XY, number][] = [[...S(x0, x1, y0), x1 - x0], [...E(x1, y0, y1), y1 - y0], [...N(x0, x1, y1), x1 - x0], [...W(x0, y0, y1), y1 - y0]] as [XY, XY, number][]
    for (const [a, b, L] of faces) {
      // belfry: three tall arched openings with bold colonnettes between
      // a pale arcade frame round the three openings, so the belfry reads from the street
      onWall(trim, a, b, rectShape(L / 2 - 3.05, L / 2 + 3.05, BEL0 + 0.4, BEL1 - 0.5), 0.27)
      for (const d of [-1.9, 0, 1.9]) {
        onWall(win, a, b, archShape(L / 2 + d, 1.55, BEL0 + 0.7, BEL1 - 1.75, 8), 0.31)
      }
      for (const d of [-0.95, 0.95]) onWall(trim, a, b, rectShape(L / 2 + d - 0.18, L / 2 + d + 0.18, BEL0 + 0.6, BEL1 - 1.4), 0.34)
      // the stage below: a pair of tall arched windows
      for (const d of [-1.1, 1.1]) arch([a, b], L / 2 + d, 1.2, 18.8, 22.9)
      // small windows lower down
      arch([a, b], L / 2, 0.9, 9.8, 12.6)
      if (b[1] !== y1 || a[1] !== y1) arch([a, b], L / 2, 0.8, 2.6, 4.6)
    }
    // corner turrets with little pyramids
    for (const [px, py] of [[x0 + 0.7, y0 + 0.7], [x1 - 0.7, y0 + 0.7], [x1 - 0.7, y1 - 0.7], [x0 + 0.7, y1 - 0.7]] as XY[]) {
      revolve(gran, [px, py], [[0.75, TOP], [0.75, 36.4]], 8, Math.PI / 8, true, true)
      revolve(tile, [px, py], [[0.85, 36.4], [0.01, 38.4]], 8, Math.PI / 8, true, false)
    }
    // the gableted stage under the spire
    const h = 2.4
    box(gran, cx - h, cx + h, cy - h, cy + h, TOP, 37.2, null, 0)
    gableRoof(tile, gran, cx - h, cx + h, cy - h, cy + h, 37.2, 39.4, 'y', 0.15, 0.15)
    gableRoof(tile, gran, cx - h, cx + h, cy - h, cy + h, 37.2, 39.4, 'x', 0.15, 0.15)
    for (const [a, b] of [S(cx - h, cx + h, cy - h), N(cx - h, cx + h, cy + h), E(cx + h, cy - h, cy + h), W(cx - h, cy - h, cy + h)]) arch([a, b], h, 0.9, 35.2, 37.0)
    // the spire
    revolve(tile, [cx, cy], [[2.5 / Math.cos(Math.PI / 4), 38.6], [0.01, 46.0]], 4, Math.PI / 4, true, false)
    revolve(gilt, [cx, cy], [[0.22, 45.6], [0.01, 46.8]], 6, 0, true, false)
  }

  const lit = (p: V3, n: V3) => {
    if (n[2] > 0.85) return 0.1
    if (p[1] < -36) return 1 // the front and towers
    if (p[2] > 30 && Math.hypot(p[0] - C[0], p[1] - C[1]) < 16) return 0.9 // the drum and dome
    return 0.3
  }
  await save('stl-cathedral-basilica', 'Cathedral Basilica of Saint Louis', [
    { part: gran, material: { ...finish('stl-granite', 0xd6d3cc), floodlight: lit } },
    { part: trim, material: { ...finish('stl-granite-trim', 0xe9e6df), floodlight: lit } },
    { part: tile, material: { ...finish('stl-green-tile', 0x6f9c6e), floodlight: (p, n) => (p[2] > 44 ? 0.8 : 0.1 * (n[2] < 0.9 ? 1 : 0)) } },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('stl-cathedral-door', 0x6a5444) },
    { part: gilt, material: finish('stl-gilt', 0xc9a24a) },
  ], { height: 65.7, anchor: [38.6425276, -90.2546541], bearing: 15 }, 6500)
}
