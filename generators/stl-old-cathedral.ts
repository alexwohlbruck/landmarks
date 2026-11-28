/**
 * Basilica of Saint Louis, King of France ("Old Cathedral"), 209 Walnut St,
 * St. Louis (1831–1834; Joseph Laveille and George Morton) — original
 * procedural geometry, CC0-1.0.  bun generators/stl-old-cathedral.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 17.2: the model's +y runs from the Walnut St front
 * (y = -21.9) to the back, along the long walls of OSM way/42645792.
 * Anchor = the outline's centroid, -90.1872854, 38.6240535.
 *
 * Identity (from the photos below):
 *  1. The tall square stone tower over the front: a clock stage, a belfry
 *     with a round-headed louvred opening a face, a cornice, a small
 *     louvred plinth and a tall dark bronze spire with a gilt ball and
 *     cross.                                               (p1, p2, p3)
 *  2. The Greek Revival front: four plain Doric columns in antis under an
 *     entablature ("DEO UNI ET TRINO") and a low pediment; a flat-topped
 *     frontispiece with a stepped attic either side of the tower.  (p1, p2)
 *  3. Three doors behind the columns, the middle one under a lunette; three
 *     square windows above; a fan lunette in each outer bay.        (p1)
 *  4. Long side walls with tall round-headed windows under a low gabled
 *     roof.                                                     (p2, p4)
 *  5. Pale buff limestone, dark spire, gilt ball and cross.         (all)
 *
 * Plan: OSM way/42645792 turned to bearing 17.2 (agrees with the lidar):
 * body 24.2–25.6 m wide, front block x ±12.65 from y -20.1 to -13, the
 * portico projection x -7.1 to 6.7 out to -21.9, a slightly wider back bay
 * from y 14 to 21.1.
 *
 * Heights: USGS 3DEP lidar IL_HicksDome_FluorsparDist_3_2019 (flown 2019;
 * it covers the riverfront and is denser than MO_StLouis_2017), 0.5 m grid
 * read with tools/lidar_frame.py (class 18 kept), above the Walnut St
 * pavement (5.4 m over the box's ground_min; the ground to the west is
 * 0.5 m higher). Measured: side eaves 11.0, roof ridge 15.4, front block
 * 13.4, the attic round the tower 14.9, pediment apex 12.9, the tower's
 * top cornice 26.9, the spire's plinth 29.3, cross top 43.6.
 * Estimated from p1 (front 25.3 m = 1240 px, ~49 px/m at the base; upper
 * stages scaled between the lidar's 14.9 and 26.9): the clock stage's
 * cornice 20.3; columns 1.4 m across at x ±2.1 and ±6.2, 9.4 m tall from
 * the 1 m podium; the entablature 1.6 m; doors, windows and lunettes; the
 * spire 3.1 m across at its foot, the ball 40.4–41.4, the cross above.
 * The tower's plan (5.8 m square) from p1 and the lidar's 32.3 m returns.
 * OSM's roof:shape=hipped is not borne out: the lidar ridge runs to the
 * back wall, so the roof is gabled. Left out: the inscriptions, the
 * railings, the rustication and the low parish building at the back
 * (way/1127330563, not replaced).
 *
 * Night: the front and tower are floodlit (St. Louis riverfront); windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  p1  "Basilica of St. Louis 2025a.jpg", Antony-22, CC BY-SA 4.0 (front)
 *  p2  "Basilica of St. Louis 2025c.jpg", Antony-22, CC BY-SA 4.0 (south-west)
 *  p3  "Basilica of St. Louis 2025b.jpg", Antony-22, CC BY-SA 4.0 (south-east)
 *  p5  "Cathedral-Basilica of Saint Louis, King of France IMG 6121.jpg",
 *      Don McCulley, CC0
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, cornice, gableRoof, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { discShape } from './stl-cathedral-basilica'

const lime = new Part(), roof = new Part(), win = new Part(), bronze = new Part(), gilt = new Part()
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const S = (x0: number, x1: number, y: number): [XY, XY] => [[x0, y], [x1, y]]
const N = (x0: number, x1: number, y: number): [XY, XY] => [[x1, y], [x0, y]]
const E = (x: number, y0: number, y1: number): [XY, XY] => [[x, y0], [x, y1]]
const W = (x: number, y0: number, y1: number): [XY, XY] => [[x, y1], [x, y0]]
/** A half-disc lunette on a wall: centre s, springing z, radius r. */
const lunette = (r: number, s: number, z: number): [number, number][] => Array.from({ length: 9 }, (_, i) => [s + r * Math.cos((i / 8) * Math.PI), z + r * Math.sin((i / 8) * Math.PI)] as [number, number])

const EAVE = 11.0, RIDGE = 15.4, FB = 13.4, ATTIC = 14.9
const BX = 12.1, FY0 = -20.1, FY1 = -13.0, BACK = 21.1

// ── The body: side walls with tall round-headed windows, gabled roof ──
box(lime, -BX, BX, FY1, 14.0, 0, EAVE, null, 0)
box(lime, -12.85, 12.85, 14.0, BACK, 0, EAVE, null, 0)
cornice(lime, rect(-BX, BX, FY1, 14.0), EAVE - 0.7, 0.7, 0.35, null)
cornice(lime, rect(-12.85, 12.85, 14.0, BACK), EAVE - 0.7, 0.7, 0.35, null)
gableRoof(roof, lime, -12.85, 12.85, FY1, BACK, EAVE, RIDGE, 'y', 0.5, 0.3)
for (const [f, L] of [[E(BX, FY1, 14.0), 27], [W(-BX, FY1, 14.0), 27]] as [[XY, XY], number][]) {
  for (const k of [-2, -1, 0, 1, 2]) {
    const s = L / 2 + k * 5.2
    onWall(win, f[0], f[1], archShape(s, 1.9, 2.6, 8.0, 8), 0.05)
  }
}
for (const f of [E(12.85, 14.0, BACK), W(-12.85, 14.0, BACK)]) onWall(win, f[0], f[1], archShape(3.5, 1.6, 3.0, 7.6, 8), 0.05)
{ const f = N(-12.85, 12.85, BACK); onWall(win, f[0], f[1], discShape(12.85, 13.0, 0.9, 10), 0.05) }

// ── The frontispiece: a flat-topped block, the attic stepped up round the tower ──
box(lime, -12.65, 12.65, FY0, FY1, 0, FB, null, 0)
cornice(lime, rect(-12.65, 12.65, FY0, FY1), 9.6, 0.9, 0.35, null) // the entablature band at the eaves line
box(lime, -12.65 + 0.3, 12.65 - 0.3, FY0 + 0.3, FY1, FB - 0.4, FB, roof, 0.15)
box(lime, -7.2, 7.0, FY0 + 0.6, FY1 + 0.5, FB - 0.4, ATTIC, roof, 0.25)
// the outer bays: a fan lunette over a recessed panel, a door-height plaque panel
for (const [s0] of [[0], [19.75]]) {
  const f = S(-12.65, 12.65, FY0), s = s0 + 2.9
  onWall(win, f[0], f[1], lunette(1.3, s, 7.3), 0.05)
  onWall(lime, f[0], f[1], rectShape(s - 1.5, s + 1.5, 2.2, 6.4), 0.08)
}

// ── The portico: four Doric columns in antis, entablature, low pediment ──
const PY = -21.9, PLAT = 1.0, CTOP = 9.6
box(lime, -7.1, 6.7, PY - 0.6, FY0, 0, PLAT, lime, 0.05) // podium
box(lime, -3.0, 2.6, PY - 1.8, PY - 0.6, 0, 0.5, lime, 0.04) // steps
box(lime, -3.0, 2.6, PY - 1.2, PY - 0.6, 0.5, PLAT, lime, 0.04)
for (const x of [-6.3, -2.2, 1.9, 5.9]) {
  revolve(lime, [x, PY + 0.8], [[0.72, PLAT], [0.72, CTOP - 0.7], [0.62, CTOP - 0.6], [0.95, CTOP - 0.25], [0.95, CTOP]], 12, 0, false, false)
}
box(lime, -7.1, 6.7, PY, FY0, CTOP, CTOP + 1.7, null, 0)
lime.quad([-7.1, PY, CTOP], [-7.1, FY0, CTOP], [6.7, FY0, CTOP], [6.7, PY, CTOP]) // the porch ceiling
cornice(lime, rect(-7.1, 6.7, PY, FY0 + 0.3), CTOP + 1.2, 0.5, 0.3, null)
gableRoof(roof, lime, -7.1, 6.7, PY, FY0 + 0.3, CTOP + 1.7, 12.9, 'x', 0.3, 0.3)
{
  // behind the columns: three doors, a lunette over the middle one, three square windows over them
  const f = S(-7.1, 6.7, FY0), m = 7.1 - 0.2
  for (const d of [-4.1, 0, 4.1]) {
    onWall(bronze, f[0], f[1], rectShape(m + d - 0.95, m + d + 0.95, PLAT, PLAT + 3.0), 0.05)
    onWall(win, f[0], f[1], rectShape(m + d - (d === 0 ? 1.4 : 1.1), m + d + (d === 0 ? 1.4 : 1.1), 5.6, 8.0), 0.05)
  }
  onWall(win, f[0], f[1], lunette(0.95, m, PLAT + 3.15), 0.05)
}

// ── The tower ──
const TC: XY = [-0.2, -15.6], TH = 2.9
const T0 = ATTIC, CLOCK = 20.3, BELL = 26.9, PLINTH = 29.3
const tfaces = (h: number): [XY, XY][] => [S(TC[0] - h, TC[0] + h, TC[1] - h), E(TC[0] + h, TC[1] - h, TC[1] + h), N(TC[0] - h, TC[0] + h, TC[1] + h), W(TC[0] - h, TC[1] - h, TC[1] + h)]
box(lime, TC[0] - TH, TC[0] + TH, TC[1] - TH, TC[1] + TH, T0 - 1, CLOCK, null, 0)
cornice(lime, rect(TC[0] - TH, TC[0] + TH, TC[1] - TH, TC[1] + TH), CLOCK - 0.5, 0.6, 0.3, lime)
box(lime, TC[0] - TH + 0.15, TC[0] + TH - 0.15, TC[1] - TH + 0.15, TC[1] + TH - 0.15, CLOCK + 0.1, BELL, null, 0)
cornice(lime, rect(TC[0] - TH + 0.15, TC[0] + TH - 0.15, TC[1] - TH + 0.15, TC[1] + TH - 0.15), BELL - 0.7, 0.8, 0.45, roof)
for (const f of tfaces(TH)) {
  onWall(bronze, f[0], f[1], discShape(TH, 17.6, 0.75, 12), 0.05) // clock face
  onWall(lime, f[0], f[1], discShape(TH, 17.6, 0.32, 8), 0.08)
}
for (const f of tfaces(TH - 0.15)) {
  onWall(lime, f[0], f[1], archShape(TH - 0.15, 2.0, 21.6, 24.3, 8), 0.04) // surround
  onWall(win, f[0], f[1], archShape(TH - 0.15, 1.5, 21.8, 24.3, 8), 0.07) // louvres (green-grey)
}
// the louvred plinth under the spire
box(lime, TC[0] - 1.9, TC[0] + 1.9, TC[1] - 1.9, TC[1] + 1.9, BELL + 0.1, PLINTH - 0.3, null, 0.1)
box(lime, TC[0] - 2.1, TC[0] + 2.1, TC[1] - 2.1, TC[1] + 2.1, PLINTH - 0.3, PLINTH, lime, 0.1)
for (const f of tfaces(1.9)) onWall(bronze, f[0], f[1], rectShape(1.9 - 0.5, 1.9 + 0.5, BELL + 0.5, PLINTH - 0.6), 0.05)
// the spire: an octagonal needle of dark bronze, a gilt ball and cross
revolve(bronze, TC, [[1.65, PLINTH], [1.45, PLINTH + 1.0], [0.12, 40.4]], 8, Math.PI / 8, true, false)
revolve(gilt, TC, [[0.01, 40.3], [0.42, 40.5], [0.55, 40.9], [0.42, 41.3], [0.01, 41.5]], 8, 0, false, false)
box(gilt, TC[0] - 0.11, TC[0] + 0.11, TC[1] - 0.11, TC[1] + 0.11, 41.4, 43.6, gilt, 0)
box(gilt, TC[0] - 0.7, TC[0] + 0.7, TC[1] - 0.11, TC[1] + 0.11, 42.5, 42.75, gilt, 0)

const lit = (p: V3, n: V3) => (n[2] > 0.85 ? 0.1 : p[1] < -12.5 ? 1 : 0.35)
await save('stl-old-cathedral', 'Basilica of Saint Louis, King of France (Old Cathedral)', [
  { part: lime, material: { ...finish('stl-buff-limestone', 0xe7dbc0), floodlight: lit } },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: bronze, material: finish('stl-bronze', 0x6c5d4f) },
  { part: gilt, material: finish('stl-gilt', 0xc9a24a) },
], { height: 43.6, anchor: [38.6240535, -90.1872854], bearing: 17.2 })
