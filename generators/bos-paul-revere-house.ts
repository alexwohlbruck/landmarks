/**
 * Paul Revere House, 19 North Square, North End, Boston (about 1680) —
 * original procedural geometry, CC0-1.0.
 * bun generators/bos-paul-revere-house.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 292: the North Square front of OSM way/240376785
 * runs at 22°, so x runs along the front (north end +x, against the tall
 * brick neighbour) and the front faces -y (east-south-east, onto North
 * Square). Anchor = the outline's centroid, -71.0536900, 42.3637345.
 *
 * Identity (from the photos below):
 *  1. A small two-storey timber house in dark grey-brown clapboard, the
 *     upper storey overhanging the lower on the front (the jetty).
 *  2. A steep, plain gable roof of weathered grey shingle, its south gable
 *     end open to the side yard; the tall brick chimney at the north end.
 *  3. Diamond-pane leaded casements, four upstairs and three downstairs on
 *     the front, the lower ones with plank shutters; a plain board door.
 *  4. Behind, a rear ell with its own steep gable, facing the courtyard.
 *
 * Plan: OSM way/240376785 in the turned frame, squared up: main block
 * x -5.55..4.6, y -4.97..1.75; rear ell x -2.1..4.4, y 1.75..6.5.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021), 0.5 m grid,
 * read in this frame with tools/lidar_frame.py; y = 0 is the lowest ground
 * (1.0 above the grid's ground_min); North Square in front is 0.2–0.6 up.
 * Measured: front eaves 5.6, main ridge 9.2, ell ridge about 8.8, the
 * chimney 13.3. The lidar outline sits about 1 m south-west of OSM's; the
 * OSM plan is used.
 *
 * Estimated from the photos (scaled from the 10.1 m front): the jetty
 * (0.45 m, at 2.7), window sizes and positions, the door, the shutters, the
 * stone underpinning (0.35 m).
 *
 * Ground: Mapterhorn and lidar show the site nearly flat (0.6 m); elevation 0.
 *
 * Diamond panes: drawn as one pale cross of bars (an X) per casement, the
 * most STYLE.md allows on a small window; it reads as leaded diamonds close
 * up and as a plain panel at map distance.
 *
 * Night: windows glow; the house is not floodlit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - 2017 Paul Revere House from east.jpg, Beyond My Ken, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:2017_Paul_Revere_House_from_east.jpg
 *  - 2017 Paul Revere House from south.jpg, Beyond My Ken, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:2017_Paul_Revere_House_from_south.jpg
 *  - Paul Revere House 1 front.jpg, Rhonda McCloughan, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Paul_Revere_House_1_front.jpg
 *  - Paul Revere House 2 back side.jpg, Rhonda McCloughan, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Paul_Revere_House_2_back_side.jpg
 *  - Paul Revere House, Boston, 2023-02-21.jpg, Crisco 1492, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Paul_Revere_House,_Boston,_2023-02-21.jpg
 *  - Paul Revere House in Boston (rear elevation).jpg, Education Prof, CC0
 *    https://commons.wikimedia.org/wiki/File:Paul_Revere_House_in_Boston_(rear_elevation).jpg
 *  - Paul Revere House, 2012-06-28.jpg, Cbaile19, CC0
 *    https://commons.wikimedia.org/wiki/File:Paul_Revere_House,_2012-06-28.jpg
 *  - Paul Revere House.jpg, Sabisteb, public domain (rear, in snow)
 *    https://commons.wikimedia.org/wiki/File:Paul_Revere_House.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the ell's ridge is drawn centred; the lidar shows its roof
 * rising toward the brick neighbour, so it may be a salt-box. The north
 * end wall is hidden by the neighbour and drawn plain.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, gableRoof, onWall, rectShape, save, type XY } from './atl-tech-tower'

const wall = new Part(), roof = new Part(), win = new Part(), brick = new Part(), trim = new Part(), door = new Part()

const X0 = -5.55, X1 = 4.6, YF = -4.97, YB = 1.75
const JET = 2.7, EAVE = 5.6, RIDGE = 9.2, J = 0.45
const EX0 = -2.1, EX1 = 4.4, EY1 = 6.5, EEAVE = 5.4, ERIDGE = 8.8

// ── Walls: lower storey set back under the jetty, upper storey to the line ──
box(trim, X0 + 0.05, X1, YF + J - 0.05, YB - 0.05, 0, 0.35, null, 0) // stone underpinning
box(wall, X0, X1, YF + J, YB, 0.35, JET, null, 0.05)
box(wall, X0, X1, YF, YB, JET, EAVE, null, 0.1, true)
box(trim, X0 - 0.05, X1 + 0.02, YF - 0.06, YF + 0.1, JET - 0.25, JET, null, 0.05) // the jetty's girt
gableRoof(roof, wall, X0, X1, YF, YB, EAVE, RIDGE, 'x', 0.35, 0.3)
// Rear ell, its ridge running back from the main roof.
box(trim, EX0 + 0.05, EX1, YB - 0.2, EY1 - 0.05, 0, 0.35, null, 0)
box(wall, EX0, EX1, YB - 0.2, EY1, 0.35, EEAVE, null, 0.1)
gableRoof(roof, null, EX0, EX1, -1.0, EY1, EEAVE, ERIDGE, 'y', 0.3, 0.3)
{ const xm = (EX0 + EX1) / 2; wall.tri([EX1, EY1, EEAVE], [EX0, EY1, EEAVE], [xm, EY1, ERIDGE - 0.05]) }

// ── The chimney at the north end ──
box(brick, 3.3, 4.55, -2.4, -0.8, 6, 13.3, brick, 0.15)
box(brick, 3.2, 4.65, -2.5, -0.7, 12.6, 12.9, brick, 0.05)

// ── Casements: dark frame, slate panel, a pale X of leading ──
type F = [XY, XY]
const FRONT_UP: F = [[X0, YF], [X1, YF]], FRONT_LO: F = [[X0, YF + J], [X1, YF + J]]
const SOUTH: F = [[X0, YB], [X0, YF]], BACK: F = [[X1, YB], [EX1, YB]], ELL_W: F = [[EX0, YB], [EX0, EY1]]
const ELL_N: F = [[EX1, EY1], [EX0, EY1]], BACK_W: F = [[EX0, YB], [X0, YB]]
function casement(f: F, s: number, z0: number, w: number, h: number, shutters = false) {
  onWall(trim, f[0], f[1], rectShape(s - w / 2 - 0.1, s + w / 2 + 0.1, z0 - 0.1, z0 + h + 0.1), 0.04)
  onWall(win, f[0], f[1], rectShape(s - w / 2, s + w / 2, z0, z0 + h), 0.08)
  const b = 0.07, x0 = s - w / 2, x1 = s + w / 2, z1 = z0 + h
  onWall(trim, f[0], f[1], [[x0, z0], [x0 + b, z0], [x1, z1 - b], [x1, z1], [x1 - b, z1], [x0, z0 + b]], 0.11)
  onWall(trim, f[0], f[1], [[x1 - b, z0], [x1, z0], [x1, z0 + b], [x0 + b, z1], [x0, z1], [x0, z1 - b]], 0.11)
  if (shutters) for (const k of [-1, 1]) onWall(wall, f[0], f[1], rectShape(s + k * (w / 2 + 0.12), s + k * (w / 2 + 0.12 + w * 0.48), z0 - 0.05, z0 + h + 0.05), 0.09)
}
// Front: four upstairs, three downstairs and the door.
for (const s of [1.6, 3.9, 6.3, 8.6]) casement(FRONT_UP, s, 3.65, 1.1, 1.05)
for (const s of [1.3, 3.5, 5.7]) casement(FRONT_LO, s, 1.0, 1.0, 1.0, true)
onWall(trim, FRONT_LO[0], FRONT_LO[1], rectShape(7.75, 9.05, 0.2, 2.35), 0.04)
onWall(door, FRONT_LO[0], FRONT_LO[1], rectShape(7.9, 8.9, 0.2, 2.25), 0.08)
// South gable end: one each floor and one small in the gable.
casement(SOUTH, 3.4, 3.65, 1.0, 1.0)
casement(SOUTH, 3.4, 1.0, 1.0, 1.0)
casement(SOUTH, 3.4, 6.3, 0.7, 0.7)
// Back of the main block (south of the ell) and the ell.
casement(BACK_W, 1.7, 3.65, 0.9, 1.0)
casement(BACK_W, 1.7, 1.0, 0.9, 1.0)
casement(ELL_W, 2.2, 3.4, 1.0, 1.05)
onWall(trim, ELL_W[0], ELL_W[1], rectShape(0.4, 1.4, 0.2, 2.3), 0.04)
onWall(door, ELL_W[0], ELL_W[1], rectShape(0.5, 1.3, 0.2, 2.2), 0.08)
casement(ELL_W, 3.5, 1.0, 1.0, 1.0, true)
casement(ELL_N, 3.25, 3.4, 1.0, 1.05)
casement(ELL_N, 3.25, 6.1, 0.7, 0.8)
casement(ELL_N, 3.25, 1.0, 1.0, 1.0)
void BACK

await save('bos-paul-revere-house', 'Paul Revere House', [
  { part: wall, material: finish('revere-clapboard', 0x67625a) },
  { part: roof, material: finish('revere-shingle', 0x8f8981) },
  { part: trim, material: finish('revere-trim', 0x9a948a) },
  { part: win, material: PALETTE.window },
  { part: brick, material: finish('revere-brick', 0xa0604c) },
  { part: door, material: finish('revere-door', 0x574e45) },
], { height: 13.3, anchor: [42.3637345, -71.05369], bearing: 292 })
