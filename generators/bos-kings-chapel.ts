/**
 * King's Chapel, 58 Tremont Street at School Street, Boston (1749–54, Peter
 * Harrison; portico 1785–87) — original procedural geometry, CC0-1.0.
 * bun generators/bos-kings-chapel.ts
 *
 * Map frame: x, y, z up, metres; origin at the anchor on the lowest ground.
 * Bearing 20.8: +x runs east-south-east along School Street (-y side),
 * from the tower and portico on Tremont Street (-x) to the chancel end;
 * the burying ground is on the +y side. Anchor = the centroid of OSM
 * way/29551954 ("Kings Chapel"), -71.0600301, 42.3580349.
 *
 * Identity (from the photos below):
 *  1. A squat, square Quincy-granite tower with a round-headed louvred
 *     opening in each face, a bold cornice and a low copper cap — the stump
 *     of the steeple that was never built.
 *  2. The wooden Ionic colonnade, painted stone grey, wrapped round the
 *     tower's base on three sides, with a deep entablature and a balustrade
 *     on top.
 *  3. A plain, heavy granite box with two tiers of round-headed windows,
 *     Ionic pilasters at its front corners and a hipped grey slate roof.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021), 0.5 m grid,
 * read with tools/lidar_frame.py. y = 0 is the lowest ground, at the east
 * end on School Street; Tremont Street at the portico is 2.0 m higher (the
 * Mapterhorn terrain agrees). Measured: the eaves 12.2, the hip ridge 19.1;
 * the portico's balustrade 12.2; the tower's cornice 21.5 and its cap 22.7
 * (20.7 above Tremont Street). OSM tags the outline height=13 (the eaves).
 *
 * Plan: the lidar, which sits about 2 m south of OSM's outline: the body
 * x -9.5..17.6, y -13..8.7; the tower x -17..-7.5, y -6.5..2.8; the
 * portico x -19.5..-7.5, y -8.5..4.5.
 *
 * Estimated from the photos: the louvred openings (2.1 m wide, 14.0–19.0),
 * the columns (0.9 m across, 6.2 m shafts, the entablature 2 m and the balustrade 1.8 m, scaled from Ajay Suresh's photo to the lidar's 12.2 m top; six on the front, three on
 * each side), the entablature and balustrade, the windows (six bays on
 * School Street, upper tall and lower short, both round-headed), the
 * pilasters.
 *
 * Night: the windows glow; the tower and the portico are floodlit, as in
 * the evening photo.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Kings chapel boston 2009h.JPG, Chensiyuan, CC BY-SA 4.0 (from the
 *    corner of Tremont and School Streets)
 *    https://commons.wikimedia.org/wiki/File:Kings_chapel_boston_2009h.JPG
 *  - Boston - King's Chapel (48718908106).jpg, Ajay Suresh, CC BY 2.0 (the
 *    same corner, the School Street side)
 *    https://commons.wikimedia.org/wiki/File:Boston_-_King%27s_Chapel_(48718908106).jpg
 *  - King's Chapel aerial 2024.jpg, Seasider53, CC BY 4.0 (from above, the
 *    south-west: the tower's copper cap, the portico roof, the hipped roof)
 *    https://commons.wikimedia.org/wiki/File:King%27s_Chapel_aerial_2024.jpg
 *  - King's Chapel Evening.jpg, Diegolpzir, CC BY-SA 4.0 (dusk)
 *    https://commons.wikimedia.org/wiki/File:King%27s_Chapel_Evening.jpg
 * Published: Wikipedia, "King's Chapel": 1749–54, Peter Harrison, Quincy
 * granite, the wooden portico of 1785–87, the steeple never built.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the north side (on the burying ground) and the east end are seen
 * only from above through trees; they repeat the School Street side. The
 * ridge vents, the railings and the balusters are left out; the balustrade
 * is drawn as a solid parapet with its rail.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, capPoly, save, split, wall, type XY } from './atl-flatiron-building'
import { archShape, band, hipRoof, onWall, rectShape, revolve } from './atl-tech-tower'

const granite = new Part(), paint = new Part(), slate = new Part(), cu = new Part(), win = new Part()

type F = [XY, XY]
const faces = (x0: number, x1: number, y0: number, y1: number): Record<'s' | 'e' | 'n' | 'w', F> => ({
  s: [[x0, y0], [x1, y0]], e: [[x1, y0], [x1, y1]], n: [[x1, y1], [x0, y1]], w: [[x0, y1], [x0, y0]],
})
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// ── The chapel ──
const X0 = -9.5, X1 = 17.6, Y0 = -13, Y1 = 8.7, EAVE = 12.2, RIDGE = 19.1
const TREMONT = 2.0
// walls with a vertex every 1.5 m along their foot, so every plan cell touches y = 0
wall(granite, split(rect(X0, X1, Y0, Y1), 1.5), 0, EAVE - 0.8)
band(paint, rect(X0, X1, Y0, Y1), EAVE - 0.8, 0.8, 0.35) // the wooden cornice
hipRoof(slate, X0, X1, Y0, Y1, EAVE, RIDGE, 0.4)
{
  const B = faces(X0, X1, Y0, Y1)
  // School Street and the burying ground: six bays, the street falling 1.7 m to the east
  for (const f of [B.s, B.n]) {
    for (let k = 0; k < 6; k++) {
      const s = 4.2 + k * 3.9, x = f === B.s ? X0 + s : X1 - s
      const g = TREMONT - (x - X0) / (X1 - X0) * 1.7 // the street under this bay
      onWall(win, f[0], f[1], archShape(s, 1.5, g + 6.0, g + 9.3, 10), 0.05)
      onWall(win, f[0], f[1], archShape(s, 1.2, g + 1.4, g + 3.2, 10), 0.05)
    }
    // Ionic pilasters at the front corner and the east corner
    for (const s of [0.6, X1 - X0 - 0.6]) onWall(paint, f[0], f[1], rectShape(s - 0.5, s + 0.5, 0.5, EAVE - 0.8), 0.1)
  }
  for (const s of [5.5, 10.85, 16.2]) {
    onWall(win, B.e[0], B.e[1], archShape(s, 1.6, 6.0, 9.8, 10), 0.05)
    onWall(win, B.e[0], B.e[1], archShape(s, 1.2, 1.4, 3.2, 10), 0.05)
  }
  // the front wall either side of the tower, inside the colonnade's sides
  for (const s of [2.3, 19.4]) onWall(win, B.w[0], B.w[1], archShape(s, 1.4, TREMONT + 5.4, TREMONT + 7.8, 10), 0.05)
}

// ── The tower ──
const TX0 = -17, TX1 = -7.5, TY0 = -6.5, TY1 = 2.8, CORN = 21.5
wall(granite, split(rect(TX0, TX1, TY0, TY1), 1.5), 0, CORN - 0.9)
band(granite, rect(TX0, TX1, TY0, TY1), CORN - 0.9, 0.9, 0.45, granite)
{
  // the copper cap: a low hip over the cornice
  const o = 0.45
  hipRoof(cu, TX0 - o + 0.25, TX1 + o - 0.25, TY0 - o + 0.25, TY1 + o - 0.25, CORN, 22.7, 0)
  const T = faces(TX0, TX1, TY0, TY1)
  for (const f of [T.s, T.e, T.n, T.w]) {
    const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1]), m = L / 2
    onWall(granite, f[0], f[1], archShape(m, 2.6, 13.7, 18.2, 10), 0.06) // the stone surround
    onWall(slate, f[0], f[1], archShape(m, 2.1, 14.0, 18.0, 10), 0.1) // the louvres
    onWall(granite, f[0], f[1], rectShape(m - 1.2, m + 1.2, 13.6, 13.85), 0.12) // the sill
  }
  // the front door behind the colonnade
  onWall(slate, T.w[0], T.w[1], rectShape((TY1 - TY0) / 2 - 1.0, (TY1 - TY0) / 2 + 1.0, TREMONT, TREMONT + 3.6), 0.05)
  onWall(win, T.w[0], T.w[1], rectShape((TY1 - TY0) / 2 - 0.8, (TY1 - TY0) / 2 + 0.8, TREMONT + 5.0, TREMONT + 7.4), 0.05)
}

// ── The colonnade ──
const PX0 = -19.5, PY0 = -8.5, PY1 = 4.5
const SHAFT = TREMONT + 6.2, ENT = SHAFT + 2.0, BAL = 12.4
function column(c: XY) {
  revolve(paint, c, [[0.6, 0], [0.6, TREMONT + 0.5], [0.54, TREMONT + 0.55], [0.54, TREMONT + 0.8], [0.48, TREMONT + 0.9], [0.42, SHAFT - 0.3], [0.56, SHAFT - 0.15], [0.66, SHAFT]], 10, 0, false, false)
  box(paint, c[0] - 0.62, c[0] + 0.62, c[1] - 0.62, c[1] + 0.62, SHAFT, SHAFT + 0.35, null, 0.05) // the abacus
}
for (let k = 0; k < 6; k++) column([PX0 + 0.75, PY0 + 0.75 + k * ((PY1 - PY0 - 1.5) / 5)]) // the Tremont Street front
for (const y of [PY0 + 0.75, PY1 - 0.75]) for (const x of [-16.0, -13.2, -10.4]) column([x, y]) // the sides
// the entablature: a ring round three sides, the tower behind it
{
  const ring: XY[] = [[PX0, PY0], [X0, PY0], [X0, PY1], [PX0, PY1]]
  // an outer band, faced outward, and its soffit
  const lo = SHAFT + 0.35
  wall(paint, ring, lo, ENT)
  // soffit: the strips between the entablature and the tower
  for (const [a, b] of [[[PX0, PY0], [TX0, PY1]], [[TX0, PY0], [X0, TY0]], [[TX0, TY1], [X0, PY1]]] as [XY, XY][]) {
    const A: V3 = [a[0], a[1], lo], B: V3 = [b[0], a[1], lo], C: V3 = [b[0], b[1], lo], D: V3 = [a[0], b[1], lo]
    paint.quad(A, D, C, B)
  }
  band(paint, ring, ENT, 0.45, 0.3, null) // the cornice
  // the roof, a flat deck round the tower, and the balustrade
  for (const r of [rect(PX0, TX0, PY0, PY1), rect(TX0, X0, PY0, TY0), rect(TX0, X0, TY1, PY1)]) capPoly(slate, r, ENT + 0.45, true)
  const o = 0.05
  wall(paint, [[PX0 + o, PY0 + o], [X0, PY0 + o], [X0, PY1 - o], [PX0 + o, PY1 - o]], ENT + 0.45, BAL - 0.25)
  band(paint, [[PX0 + o, PY0 + o], [X0, PY0 + o], [X0, PY1 - o], [PX0 + o, PY1 - o]], BAL - 0.25, 0.25, 0.12)
  // the balusters' shadow, a dark band between the dies
  const sides: F[] = [[[PX0, PY1], [PX0, PY0]], [[PX0, PY0], [X0, PY0]], [[X0, PY1], [PX0, PY1]]]
  for (const f of sides) {
    const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1]), n = Math.round(L / 2.4)
    for (let k = 0; k < n; k++) {
      const s0 = (k * L) / n + 0.35, s1 = ((k + 1) * L) / n - 0.35
      onWall(slate, f[0], f[1], rectShape(s0, s1, ENT + 0.75, BAL - 0.45), 0.06)
    }
  }
}

const lit = (p: V3) => (p[0] < X0 + 0.5 ? (p[2] > 12 ? 0.6 : 0.9) : 0)
await save('bos-kings-chapel', "King's Chapel", [
  { part: granite, material: { ...finish('kc-granite', 0x8c877f), floodlight: lit } },
  { part: paint, material: { ...finish('kc-portico', 0xaaa49b), floodlight: lit } },
  { part: slate, material: finish('kc-slate', 0x6a6f76) },
  { part: cu, material: PALETTE.patina },
  { part: win, material: PALETTE.window },
], { height: 22.7, anchor: [42.3580349, -71.0600301], bearing: 20.8 })
