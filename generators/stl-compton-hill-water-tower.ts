/**
 * Compton Hill Water Tower, Reservoir Park, St. Louis (1898, Harvey Ellis
 * and George I. Barnett; a Romanesque Revival casing round a standpipe,
 * retired 1929) — procedural, CC0-1.0, no textures.
 * bun generators/stl-compton-hill-water-tower.ts
 *
 * Map frame: x east, y north, turned 8° (bearing 8, the walls of OSM
 * way/201356010), z up, metres. Anchor -90.2389743, 38.6149923: the
 * outline's vertex centroid.
 *
 * The tower (photos): a rock-faced limestone base, about 10 m square with
 * rounded corners and a carved frieze under its cornice; a round turret
 * on three of its corners, capped by a small stone dome; a square shaft of
 * tan brick with stone quoins and slit windows; a top stage with arched
 * windows and corner pinnacles; an octagonal observation gallery with a
 * green copper cornice; a ribbed stone beehive dome; and, rising from the
 * base on the north-west corner of the shaft, a round stair turret running
 * past the dome to a tall conical spire.
 *
 * Measured (USGS lidar USGS_LPC_MO_StLouis_2017_LAS_2018, flown 2017–18,
 * 0.5 m grid, read in this frame, above the ground at the base): the base
 * x -4.1..5.8, y -5.1..5.0 (OSM), its top 13.0; the base turrets' domes
 * 16–17.5; the shaft x -2.5..4.5, y -4.3..2.7, cornice 41–42; the pinnacles
 * and gallery 44–45; the dome to 50.8 (centre (1.0, -0.8)); the stair
 * turret's returns at (-2.0, 2.2), its cone's to 53. The lidar's shaft
 * (x -2.5..4.5) includes the top stage's overhang; the shaft itself is drawn
 * 6 m square (the photos give it 0.55–0.68 of the base's width).
 * Published: 179 ft / 55 m to the spire's tip (OSM height 55; St. Louis
 * Cultural Resources Office), drawn so.
 * Estimated from the photos (scaled from the lidar's base and shaft):
 * the base's frieze (11.2–12.5) and balcony cornice (13.0–13.6), the top
 * stage's arched windows, the turret radius (1.3 m) and its cone (from
 * 48.5), the shaft's slit windows and quoin bands.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   - "Compton Hill Water Tower.jpg", Millbrooky, CC BY 3.0,
 *     https://commons.wikimedia.org/wiki/File:Compton_Hill_Water_Tower.jpg
 *     (from the south-east: the base and its turrets, the shaft, the stair
 *     turret and spire, the gallery and dome);
 *   - "Compton Hill Water Tower and \"The Naked Truth\".jpg", Hparmer,
 *     CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Compton_Hill_Water_Tower_and_%22The_Naked_Truth%22.jpg
 *     (from the south-west);
 *   - "Compton Hill Water Tower from Grand.jpg", Maria E. Brown, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Compton_Hill_Water_Tower_from_Grand.jpg.
 * Doubts: the base turrets are drawn on three corners (the photos show the
 * south-west and south-east ones and one at the north-east; the north-west
 * corner carries the stair turret). The OSM roof:shape=cone tag describes
 * the stair turret's spire; the main roof is the beehive dome.
 *
 * Night: the tower is floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, ccw, cornice, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'

const stone = new Part(), brick = new Part(), dome = new Part(), copper = new Part(), win = new Part()
const R = (x0: number, x1: number, y0: number, y1: number): XY[] => ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])

// ── The base ────────────────────────────────────────────────────────────────
const BX0 = -4.1, BX1 = 5.8, BY0 = -5.1, BY1 = 5.0, BTOP = 13.0
box(stone, BX0, BX1, BY0, BY1, 0, 11.2, null, 0.6)
box(stone, BX0 + 0.15, BX1 - 0.15, BY0 + 0.15, BY1 - 0.15, 11.2, 12.5, null, 0.2) // the carved frieze
cornice(stone, R(BX0, BX1, BY0, BY1), 12.5, 1.1, 0.55, null)
box(stone, BX0 + 0.3, BX1 - 0.3, BY0 + 0.3, BY1 - 0.3, 12.5, BTOP, stone, 0.1) // the balcony floor round the shaft
cornice(stone, R(BX0, BX1, BY0, BY1), 0.4, 0.6, 0.35, null) // the plinth
// an arched window in each face of the base (photos)
const BXM = (BX0 + BX1) / 2, BYM = (BY0 + BY1) / 2
onWall(win, [BX0, BY0], [BX1, BY0], archShape(BX1 - BXM, 1.4, 4.2, 6.8, 8), 0.06)
onWall(win, [BX1, BY1], [BX0, BY1], archShape(BX1 - BXM, 1.4, 4.2, 6.8, 8), 0.06)
onWall(win, [BX1, BY0], [BX1, BY1], archShape(BYM - BY0, 1.4, 4.2, 6.8, 8), 0.06)
onWall(win, [BX0, BY1], [BX0, BY0], archShape(BY1 - BYM, 1.4, 4.2, 6.8, 8), 0.06)
// the turrets on three of the base's corners, each a drum and a stone dome
for (const [x, y] of [[BX1 - 1.1, BY0 + 1.1], [BX0 + 1.1, BY0 + 1.1], [BX1 - 1.1, BY1 - 1.1]] as XY[]) {
  revolve(stone, [x, y], [[1.4, 10.5], [1.4, 15.2], [1.55, 15.2], [1.55, 15.6], [1.35, 15.8], [1.25, 16.5], [0.9, 17.2], [0.4, 17.55], [0.15, 17.9], [0.01, 17.9]], 12)
}

// ── The shaft ───────────────────────────────────────────────────────────────
const SX0 = -2.0, SX1 = 4.0, SY0 = -3.8, SY1 = 2.2, SC: XY = [(SX0 + SX1) / 2, (SY0 + SY1) / 2]
box(brick, SX0, SX1, SY0, SY1, BTOP - 0.2, 37.4, null, 0)
// stone quoins on the corners (bold strips), the string course, the top stage
for (const [x, y] of [[SX0, SY0], [SX1, SY0], [SX1, SY1]] as XY[]) {
  box(stone, x - 0.45, x + 0.45, y - 0.45, y + 0.45, BTOP - 0.2, 37.4, null, 0.1)
}
cornice(stone, R(SX0, SX1, SY0, SY1), 37.4, 0.7, 0.3, null)
box(brick, SX0 - 0.3, SX1 + 0.3, SY0 - 0.3, SY1 + 0.3, 38.1, 41.2, null, 0) // the top stage, a little wider
cornice(stone, R(SX0 - 0.3, SX1 + 0.3, SY0 - 0.3, SY1 + 0.3), 41.2, 0.9, 0.45, stone)
// slit windows up the shaft, three on each face, and the top stage's arched windows
const faces: [XY, XY][] = [[[SX0, SY0], [SX1, SY0]], [[SX1, SY0], [SX1, SY1]], [[SX1, SY1], [SX0, SY1]], [[SX0, SY1], [SX0, SY0]]]
for (const [a, b] of faces) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  for (const z of [19, 25.5, 32]) onWall(win, a, b, rectShape(L / 2 - 0.3, L / 2 + 0.3, z, z + 2.2), 0.06)
  onWall(win, a, b, archShape(L / 2, 1.5, 38.6, 40.0, 8), 0.06)
}
// corner pinnacles on the top stage
for (const [x, y] of [[SX0, SY0], [SX1, SY0], [SX1, SY1]] as XY[]) {
  revolve(stone, [x, y], [[0.7, 42.0], [0.7, 43.2], [0.45, 44.2], [0.01, 44.8]], 8, Math.PI / 8)
}

// ── The gallery and the dome ────────────────────────────────────────────────
const DC: XY = [1.0, -0.8]
revolve(stone, DC, [[3.3, 41.9], [3.3, 43.6]], 8, Math.PI / 8, true, false) // the gallery's wall
for (let i = 0; i < 8; i++) { // its openings, dark
  const a0 = (i / 8) * 2 * Math.PI + Math.PI / 8, a1 = ((i + 1) / 8) * 2 * Math.PI + Math.PI / 8
  const p0: XY = [DC[0] + Math.cos(a0) * 3.3, DC[1] + Math.sin(a0) * 3.3], p1: XY = [DC[0] + Math.cos(a1) * 3.3, DC[1] + Math.sin(a1) * 3.3]
  const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1])
  onWall(win, p1, p0, rectShape(0.35, L - 0.35, 42.3, 43.4), 0.05)
}
revolve(copper, DC, [[3.3, 43.6], [3.75, 44.0], [3.75, 44.6], [3.1, 44.8], [0.01, 44.8]], 16, 0, false, false) // the green cornice
revolve(dome, DC, [[2.8, 44.8], [2.8, 45.9], [2.7, 47.2], [2.45, 48.4], [2.0, 49.5], [1.35, 50.3], [0.65, 50.7], [0.01, 50.8]], 16) // the beehive dome
for (const z of [46.3, 47.7, 48.9, 49.8]) { // its ribs (horizontal courses), bold
  const r = z < 47 ? 2.79 : z < 48.5 ? 2.48 : z < 49.5 ? 2.03 : 1.4
  revolve(stone, DC, [[r, z - 0.12], [r + 0.12, z], [r, z + 0.12]], 16, 0, false, false)
}
revolve(copper, DC, [[0.25, 50.75], [0.25, 51.6], [0.01, 52.0]], 8) // the finial

// ── The stair turret and its spire ──────────────────────────────────────────
const TC: XY = [-1.6, 1.8] // on the shaft's north-west corner
revolve(stone, TC, [[1.4, BTOP - 0.2], [1.4, 47.6], [1.6, 47.8], [1.6, 48.5], [1.45, 48.5], [1.0, 51.3], [0.5, 53.5], [0.15, 54.6], [0.01, 55.0]], 12)
for (let k = 0; k < 6; k++) { // slit windows up the turret, facing out (north-west)
  const z = 16 + k * 5.2, a = (135 * Math.PI) / 180 + 0.14, d: XY = [Math.cos(a), Math.sin(a)], t: XY = [-d[1], d[0]]
  const P = (u: number, zz: number): V3 => [TC[0] + d[0] * 1.43 + t[0] * u, TC[1] + d[1] * 1.43 + t[1] * u, zz]
  win.quad(P(0.22, z), P(-0.22, z), P(-0.22, z + 1.4), P(0.22, z + 1.4))
}
for (let i = 0; i < 6; i++) { // the turret's top ring of small openings
  const a = (i / 6) * 2 * Math.PI, d: XY = [Math.cos(a), Math.sin(a)], t: XY = [-d[1], d[0]]
  const P = (u: number, zz: number): V3 => [TC[0] + d[0] * 1.43 + t[0] * u, TC[1] + d[1] * 1.43 + t[1] * u, zz]
  win.quad(P(0.25, 45.4), P(-0.25, 45.4), P(-0.25, 46.6), P(0.25, 46.6))
}

const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.1 : p[2] < 13.5 ? 0.6 : 0.8)
await save('stl-compton-hill-water-tower', 'Compton Hill Water Tower', [
  { part: stone, material: { ...finish('compton-limestone', 0xe7e3d8), floodlight: lit } },
  { part: brick, material: { ...finish('compton-tan-brick', 0xcda874), floodlight: lit } },
  { part: dome, material: { ...finish('compton-dome', 0xeeeae1), floodlight: lit } },
  { part: copper, material: PALETTE.patina },
  { part: win, material: PALETTE.window },
], { height: 55, anchor: [38.6149923, -90.2389743], bearing: 8, osm: 'way/201356010' }, 5000)
