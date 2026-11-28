/**
 * Harry Elkins Widener Memorial Library, Harvard Yard, Cambridge (1913–1915,
 * Horace Trumbauer) — original procedural geometry, CC0-1.0.
 * bun generators/bos-widener-library.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 13: the plan is OSM's outline turned 13° so its
 * walls are square to the axes; +y is the north front on Tercentenary
 * Theatre (facing Memorial Church), with the portico and the steps.
 * Anchor = the centroid of OSM way/29725638, -71.1164893, 42.3734629.
 *
 * Identity (from the photos below):
 *  1. The monumental north portico: a row of twelve unfluted Corinthian
 *     columns, about 11 m tall, in front of a recessed wall, under a deep
 *     limestone entablature with the inscription frieze and a plain brick
 *     attic with stone pilaster strips.
 *  2. The broad flight of steps the full width of the portico, between two
 *     big stone cheek blocks.
 *  3. A square red-brick block with limestone trim: a stone cornice all
 *     round at the portico's entablature, a brick attic over it, slightly
 *     projecting corner pavilions with framed tall windows.
 *
 * Plan: OSM way/29725638 as drawn (at bearing 13 its walls run within 0.3°
 * of the axes): 65 × 81 m with corner pavilions. The 1915 second-floor
 * plan (Trumbauer, public domain) gives the portico: the columns stand on
 * OSM's north line (y 40.6), the wall behind them about 3.6 m back; the two
 * light courts it shows were roofed in the 1999–2004 renovation, and the
 * 2021 lidar shows a continuous roof there.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021), 1 m grid, above
 * the Yard (9.0 m): the parapet 22.3 all round; the roof behind it rises to
 * 24.9 over the old courts and 26.9 over a band across the centre; the
 * steps' top about 3.2–3.5. Estimated from the Zirkel and chensiyuan
 * photos (frontal, scaled from the 22.3 m parapet): the column bases 3.5,
 * capitals 14.3–15.3, entablature to 17.2, cornice 17.9; the window tiers.
 *
 * Ground: the Yard is nearly flat round the building (lidar), but the
 * Mapterhorn terrain has a pit inside the footprint, 4–4.5 m below the Yard
 * (bare-earth interpolation under the building), and the map stands the
 * model on its lowest point. So y = 0 is the pit and the Yard is put 4.5 m
 * up (Mapterhorn round the building, so the foot of the steps meets it);
 * the walls run down to 0, hidden under the drawn ground. elevation 0. If
 * the terrain is ever corrected, the model will stand 4.5 m too high: the
 * constant G below is the one number to change. The steps are built down
 * onto the Yard from the portico platform.
 *
 * Night: the windows glow; the portico's columns and entablature are
 * floodlit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Widener Library, Harvard University.jpg, Kenneth C. Zirkel, CC BY 4.0
 *    (the north front square on)
 *    https://commons.wikimedia.org/wiki/File:Widener_Library,_Harvard_University.jpg
 *  - Widener library 2009.JPG, chensiyuan, CC BY-SA 4.0 (the portico from
 *    the steps) https://commons.wikimedia.org/wiki/File:Widener_library_2009.JPG
 *  - Widener Memorial Library - Harvard University (54941110519).jpg,
 *    ajay_suresh, CC BY 4.0 (north-east)
 *    https://commons.wikimedia.org/wiki/File:Widener_Memorial_Library_-_Harvard_University_(54941110519).jpg
 *  - Cambridge - USA - Harvard University - Harry Elkins Widener Memorial
 *    Library - panoramio.jpg, giggel, CC BY 3.0 (north-west)
 *    https://commons.wikimedia.org/wiki/File:Cambridge_-_USA_-_Harvard_University_-_Harry_Elkins_Widener_Memorial_Library_-_panoramio.jpg
 *  - HarvardUniversity WidenerLibrary SecondFloorPlan SneadIronWorks.jpg,
 *    Horace Trumbauer & Associates, public domain (the plan)
 *    https://commons.wikimedia.org/wiki/File:HarvardUniversity_WidenerLibrary_SecondFloorPlan_SneadIronWorks.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the south, east and west sides are not in the photos used; their
 * window rhythm (a bay every 3.4 m, three tiers) is drawn from the plan's
 * window openings and the pavilions' windows. The roof behind the parapet
 * is drawn as flat terraces at the lidar's heights.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { onWall, rectShape, revolve, type XY } from './atl-tech-tower'
import { box, ccw, column, cornice, ledge, offset, prism, save, wall } from './atl-flatiron-building'

const brick = new Part(), stone = new Part(), roof = new Part(), win = new Part(), door = new Part()
const G = 4.5 // the Yard above y = 0, which the map takes from the terrain pit inside the footprint
const h = (z: number) => G + z

// OSM way/29725638 in the frame (bearing 13), with the portico's front
// line pulled back to the wall behind the columns (y 37.0).
const YW = 37.0, PX0 = -20.9, PX1 = 21.4
const OUT = ccw([[22.5, -40.7], [-22.8, -40.7], [-22.8, -40.3], [-24.0, -40.3], [-24.0, -38.2], [-31.6, -38.2], [-31.6, -37.1], [-32.4, -37.1], [-32.3, -22.5], [-30.4, -22.5], [-30.2, 20.8], [-31.1, 20.8], [-31.1, 22.0], [-32.6, 22.0], [-32.6, 36.1], [-31.7, 36.1], [-31.6, 37.1], [-30.6, 37.1], [-30.6, 39.2], [-22.2, 39.2], [-22.2, 39.6], [PX0, 39.6], [PX0, YW], [PX1, YW], [PX1, 38.5], [30.6, 38.5], [30.6, 36.3], [31.6, 36.3], [31.6, 35.3], [32.6, 35.3], [32.6, 21.5], [31.6, 21.5], [31.6, 20.6], [30.5, 20.6], [30.4, -22.6], [31.4, -22.5], [31.4, -23.7], [32.2, -23.7], [32.2, -37.3], [31.3, -37.3], [31.3, -38.3], [23.7, -38.4], [23.7, -40.4], [22.5, -40.4]])

const CORN = h(16.9), ATTIC = h(17.9), TOP = h(21.7), COPE = h(22.3)
prism(brick, OUT, 0, TOP, roof, 0)
cornice(stone, OUT, h(0), 1.6, 0.12, null) // the stone base course
cornice(stone, OUT, h(3.3), 0.4, 0.1, null)
cornice(stone, OUT, CORN, 1.0, 0.55, stone) // the main cornice, all round
// the parapet's coping: a ring standing 0.6 m over the roof
{
  const IN = offset(OUT, -0.5)
  wall(stone, OUT, TOP - 0.01, COPE)
  wall(stone, [...IN].reverse(), TOP, COPE)
  ledge(stone, offset(OUT, 0.15), IN, COPE)
}

// ── Windows on every face, in the bays the plan shows ──
type F = [XY, XY]
const framed = (f: F, s: number, w: number, z0: number, z1: number, fr = 0.3) => {
  onWall(stone, f[0], f[1], rectShape(s - w / 2 - fr, s + w / 2 + fr, z0 - fr, z1 + fr * 0.6), 0.03)
  onWall(win, f[0], f[1], rectShape(s - w / 2, s + w / 2, z0, z1), 0.06)
}
for (let i = 0; i < OUT.length; i++) {
  const a = OUT[i], b = OUT[(i + 1) % OUT.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 6) continue
  const f: F = [a, b]
  const isPortico = Math.abs(a[1] - YW) < 0.01 && Math.abs(b[1] - YW) < 0.01
  if (isPortico) continue
  const pavilion = L < 14
  if (pavilion) {
    // a pavilion face: one tall framed window, one below, one in the attic
    const ws = L > 9 ? [L / 2] : [L / 2]
    for (const s of ws) {
      framed(f, s, 2.0, h(9.4), h(13.6), 0.4)
      onWall(stone, f[0], f[1], rectShape(s - 1.6, s + 1.6, h(13.9), h(14.4)), 0.05) // the cornice over it
      framed(f, s, 1.6, h(4.6), h(6.8), 0.25)
      framed(f, s, 1.4, h(18.6), h(20.6), 0.2)
    }
    continue
  }
  const n = Math.max(1, Math.round((L - 3) / 3.4)), sp = (L - 3) / n
  for (let k = 0; k < n; k++) {
    const s = 1.5 + sp * (k + 0.5)
    onWall(win, f[0], f[1], rectShape(s - 0.75, s + 0.75, h(4.4), h(7.2)), 0.05)
    onWall(win, f[0], f[1], rectShape(s - 0.75, s + 0.75, h(9.0), h(14.6)), 0.05)
    onWall(win, f[0], f[1], rectShape(s - 0.6, s + 0.6, h(18.6), h(20.6)), 0.05)
  }
}

// ── The portico ──
// the platform under the columns, the entablature and attic over them
box(stone, PX0, PX1, YW, 40.6, 0, h(3.5), stone, 0.1)
const ENT0 = h(15.3), ENT1 = h(17.2)
box(stone, PX0, PX1, YW, 40.6, ENT0, ENT1, null, 0, true)
cornice(stone, ccw([[PX0, YW], [PX1, YW], [PX1, 40.6], [PX0, 40.6]]), ENT1 - 0.3, 1.0, 0.55, stone)
box(brick, PX0, PX1, YW, 40.6, ATTIC, TOP, roof, 0)
const FRONT: F = [[PX1, 40.6], [PX0, 40.6]], PL = PX1 - PX0
onWall(roof, FRONT[0], FRONT[1], rectShape(1.5, PL - 1.5, h(15.8), h(16.4)), 0.04) // the inscription's shadow line
for (let k = 0; k <= 10; k++) {
  const s = 1.0 + (k * (PL - 2.0)) / 10
  onWall(stone, FRONT[0], FRONT[1], rectShape(s - 0.4, s + 0.4, ATTIC, TOP), 0.06) // the attic's pilaster strips
}
// twelve Corinthian columns
const COLS = Array.from({ length: 12 }, (_, k) => -18.7 + k * 3.4)
for (const x of COLS) {
  const c: XY = [x, 39.6]
  box(stone, x - 0.95, x + 0.95, c[1] - 0.95, c[1] + 0.95, h(3.5), h(4.2), stone, 0.1)
  revolve(stone, c, [[0.84, h(4.2)], [0.8, h(9)], [0.72, h(14.2)], [0.68, h(14.2)], [1.0, h(15.3)], [0, h(15.3)]], 12, 0, false, false)
}
// the wall behind: tall windows, three bronze doors in the middle
const BACK: F = [[PX1, YW], [PX0, YW]]
for (let k = 0; k < 11; k++) {
  const s = PX1 - (COLS[k] + COLS[k + 1]) / 2
  if (k >= 4 && k <= 6) {
    onWall(stone, BACK[0], BACK[1], rectShape(s - 1.2, s + 1.2, h(3.5), h(8.6)), 0.03)
    onWall(door, BACK[0], BACK[1], rectShape(s - 0.85, s + 0.85, h(3.5), h(8.2)), 0.06)
  } else onWall(win, BACK[0], BACK[1], rectShape(s - 0.75, s + 0.75, h(5.2), h(7.6)), 0.05)
  onWall(win, BACK[0], BACK[1], rectShape(s - 0.85, s + 0.85, h(9.6), h(13.4)), 0.05)
}
onWall(stone, BACK[0], BACK[1], rectShape(0, PL, h(8.6), h(9.0)), 0.04) // the string course
// ── The steps and their cheek blocks ──
const N = 9, SY1 = 48.0
for (let k = 0; k < N; k++) {
  box(stone, -17.0, 18.0, 40.6, 40.6 + ((SY1 - 40.6) * (k + 1)) / N, 0, h((3.5 * (N - k)) / N), stone, 0)
}
for (const [x0, x1] of [[-19.8, -17.0], [18.0, 20.8]]) {
  prism(stone, ccw([[x0, 40.6], [x1, 40.6], [x1, 46.5], [x0, 46.5]]), 0, h(4.3), stone, 0.15)
}

// ── The roof behind the parapet (lidar) ──
for (const [x0, x1, y0, y1] of [[-26, -10, -33, 33], [8, 27, -33, 33], [-10, 8, -33, -24], [-10, 8, 9, 33]])
  box(roof, x0, x1, y0, y1, TOP, h(23.9), roof, 0.3)
box(roof, -10, 11, 12, 21, TOP, h(26.6), roof, 0.3)

const lit = (p: V3) => (p[1] > YW - 0.1 && p[2] > h(3.4) && p[2] < h(18) ? 0.8 : 0)
await save('bos-widener-library', 'Widener Library', [
  { part: brick, material: finish('widener-brick', 0x9a5b4b) },
  { part: stone, material: { ...finish('widener-limestone', 0xece3d1), floodlight: lit } },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('widener-bronze', 0x5d5246) },
], { height: h(26.6), anchor: [42.3734629, -71.1164893], bearing: 13 })
void column
