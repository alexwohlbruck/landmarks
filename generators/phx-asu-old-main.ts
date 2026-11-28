/**
 * Old Main, Arizona State University, Tempe AZ (1898, James M. Creighton;
 * restored 2006, with a modern stair-and-glass annex on the south side).
 * Procedural, CC0-1.0, no textures.
 *   bun generators/phx-asu-old-main.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0 (the walls run
 * north-south and east-west). Anchor -111.933959, 33.420566, the centroid of
 * OSM way/30406665 ("Old Main"), the only building the model covers; its
 * outline includes the south annex and the walled east patio, both drawn.
 *
 * Identity (photos below):
 *  1. Red Romanesque-Victorian brick on a rusticated red sandstone basement,
 *     three storeys, under a red tile roof.                     (p1, p3, p5)
 *  2. Two steep front-gabled pavilions flanking a recessed centre, both on
 *     the north (main) front and the south; triple round-arched windows in
 *     each gable, a round-arched row on the second floor, copper finials.
 *  3. The centre: a two-storey wooden veranda (red posts, balcony) over a
 *     grand sandstone stair, two arched doors; a dormer above with three
 *     arched windows and a green copper hipped cap.             (p1, p3, p5)
 *  4. Set-back end wings east and west under low hips.
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020), 0.5 m grid,
 * read with tools/lidar_frame.py; ground_min 355.79 m, the site flat at 0.7
 * above it (y = 0 here). Measured (model z): eaves 13.5; the pavilion gable
 * ridges 19.4-19.8 at x -14 and x 10, running the full depth (so both fronts
 * have gables); the central roof deck 19.7 (x -14..14, y -2..4, flat, pale
 * in NAIP); the dormer ridges 18.4-19.1 at x -2 on both fronts; the south
 * annex 13.5 (glass box) and 15 (its stair core); the east patio wall 2.5.
 * Estimated (from p5, scaled to the lidar eaves, 25.9 px/m): the basement
 * height (2.4), the storey lines, every window's width and head, the
 * veranda floors (2.4, 7.6) and posts, the stair (4 m wide, 5 m run), the
 * dormer size, the finials (1.7 m). The south front has no photo: drawn as
 * the north's pavilions and dormer, without the veranda and stair (the
 * lidar eave line is straight there). The annex is drawn from p2 only: a
 * tile-clad core and a pale glass box on red steel posts.
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 *   p1  "ASU Old Main.jpg", Tito (en.wikipedia), CC BY-SA 3.0,
 *       https://commons.wikimedia.org/wiki/File:ASU_Old_Main.jpg (north front)
 *   p5  "2021 Arizona State University, Tempe Campus, Old Main.jpg",
 *       Beyond My Ken, CC BY-SA 4.0,
 *       https://commons.wikimedia.org/wiki/File:2021_Arizona_State_University,_Tempe_Campus,_Old_Main.jpg
 *       (north front, square on)
 *   p3  "Old Main - daylight.jpg", CC BY-SA 4.0,
 *       https://commons.wikimedia.org/wiki/File:Old_Main_-_daylight.jpg
 *       Landon Wiggs (Wiggsphoto); (north front from the north-west)
 *   p2  "Old Main - Arizona State University - Tempe, AZ - DSC05889.JPG",
 *       Daderot, CC0,
 *       https://commons.wikimedia.org/wiki/File:Old_Main_-_Arizona_State_University_-_Tempe,_AZ_-_DSC05889.JPG
 *       (the south annex)
 *   USGS NAIP orthophoto: plan, the red tile and the pale central deck.
 * No look-only sources. No commercial imagery.
 * Left out: the balcony railings, lattice panels, the chimneys, string
 * courses finer than the water table, the annex's external steel stair.
 * Night: windows glow, the doors are `entrance`; the north front is
 * floodlit (assumed from its lamps; no night photo checked).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, prism, save } from './atl-flatiron-building'
import { archShape, gableRoof, hipRoof, onWall, rectShape } from './atl-tech-tower'

const brick = new Part(), stone = new Part(), tile = new Part(), win = new Part(), copper = new Part(), door = new Part()

const BASE = 2.4, EAVE = 13.5, RIDGE = 19.7
const N = 14.2, S = -10.4 // the fronts
const PAV: [number, number][] = [[-20, -8], [4, 16]] // pavilions (x), ridges at -14 and 10
const CX = -2 // the centre bay's axis

// Openings on a face: 'N' y = N, 'S' y = S, 'E'/'W' at x; shapes in (world
// coordinate along the face, z).
type Face = 'N' | 'S' | 'E' | 'W'
function on(p: Part, f: Face, c: number, pts: [number, number][], out = 0.05) {
  if (f === 'N') onWall(p, [100, c], [-100, c], pts.map(([u, z]) => [100 - u, z]), out)
  else if (f === 'S') onWall(p, [-100, c], [100, c], pts.map(([u, z]) => [u + 100, z]), out)
  else if (f === 'E') onWall(p, [c, -100], [c, 100], pts.map(([u, z]) => [u + 100, z]), out)
  else onWall(p, [c, 100], [c, -100], pts.map(([u, z]) => [100 - u, z]), out)
}

// ── Masses ──
// centre block between the pavilions, recessed on the north behind the veranda
const VER = 11.6
prism(stone, [[-8, S], [4, S], [4, VER], [-8, VER]], 0, BASE, null, 0)
prism(brick, [[-8, S], [4, S], [4, VER], [-8, VER]], BASE, EAVE, null, 0)
// the pavilions stand 0.4 m proud of both fronts
for (const [x0, x1] of PAV) {
  prism(stone, [[x0, S - 0.4], [x1, S - 0.4], [x1, N + 0.4], [x0, N + 0.4]], 0, BASE, null, 0)
  prism(brick, [[x0, S - 0.4], [x1, S - 0.4], [x1, N + 0.4], [x0, N + 0.4]], BASE, EAVE, null, 0)
  gableRoof(tile, brick, x0, x1, S - 0.4, N + 0.4, EAVE, RIDGE, 'y', 0.45, 0.35)
  // copper finials on both gable apexes
  for (const y of [S - 0.75, N + 0.75]) {
    const xm = (x0 + x1) / 2
    box(copper, xm - 0.25, xm + 0.25, y - 0.25, y + 0.25, RIDGE - 0.4, RIDGE + 0.7, copper, 0.1)
    hipRoof(copper, xm - 0.18, xm + 0.18, y - 0.18, y + 0.18, RIDGE + 0.7, RIDGE + 1.7, 0.04)
  }
}
// set-back end wings under low hips
const WINGS: [number, number, number, number][] = [[-22.7, -20, -7.3, 12.2], [16, 19.6, -9.2, 13]]
for (const [x0, x1, y0, y1] of WINGS) {
  prism(stone, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 0, BASE, null, 0)
  prism(brick, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], BASE, EAVE - 0.3, null, 0)
  hipRoof(tile, x0, x1 + (x1 > 0 ? 0 : 0.5), y0, y1, EAVE - 0.3, EAVE + 2.6, 0.45)
}
// the main roof: a hip from the eaves to the flat central deck
{
  const x0 = -20.45, x1 = 16.45, y0 = S - 0.45, y1 = N + 0.45, z0 = EAVE - 0.2
  const tx0 = -14, tx1 = 10, ty0 = -2, ty1 = 4
  const o: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const t: V3[] = [[tx0, ty0, RIDGE], [tx1, ty0, RIDGE], [tx1, ty1, RIDGE], [tx0, ty1, RIDGE]]
  for (let i = 0; i < 4; i++) tile.quad(o[i], o[(i + 1) % 4], t[(i + 1) % 4], t[i])
  stone.cap(t, true) // the pale deck
  tile.quad(o[0], o[3], o[2], o[1]) // soffit
}
// the dormers over the centre bay, north and south
for (const [y0, y1, f] of [[VER - 3.2, N, 'N'], [S, S + 4, 'S']] as const) {
  box(brick, CX - 2.6, CX + 2.6, y0, y1, EAVE - 1.5, 17.6, null, 0.15)
  hipRoof(copper, CX - 2.6, CX + 2.6, y0, y1, 17.6, 19.2, 0.35)
  const fy = f === 'N' ? y1 : y0
  for (const dx of [-1.4, 0, 1.4]) on(win, f, fy, archShape(CX + dx, 0.95, 14.6, 16.4, 6))
  box(copper, CX - 0.2, CX + 0.2, (y0 + y1) / 2 - 0.2, (y0 + y1) / 2 + 0.2, 19.0, 20.3, copper, 0.08)
}

// ── The north veranda and the grand stair ──
// floors at the main and second storeys, a roof slab under the eaves, posts
for (const z of [BASE, 7.6]) box(stone, -8, 4, VER, N, z - 0.45, z, stone, 0.1, true)
box(brick, -8, 4, VER, N, 12.3, 12.9, brick, 0.1, true)
for (const x of [-7.6, -4.6, 0.6, 3.6]) box(brick, x - 0.25, x + 0.25, N - 0.6, N - 0.1, BASE, 12.3, null, 0.05)
// balcony fronts (solid bands standing for the railings)
box(brick, -8, 4, N - 0.4, N - 0.15, 7.6, 8.6, brick, 0.05)
box(brick, -8, -4.1, N - 0.4, N - 0.15, BASE, BASE + 1, brick, 0.05)
box(brick, 0.1, 4, N - 0.4, N - 0.15, BASE, BASE + 1, brick, 0.05)
// doors and windows on the recessed wall
on(door, 'N', VER, archShape(-5.6, 1.7, BASE, 4.9, 6))
on(door, 'N', VER, archShape(1.6, 1.7, BASE, 4.9, 6))
on(door, 'N', VER, archShape(CX, 1.3, BASE, 4.9, 6))
for (const x of [-5.6, CX, 1.6]) on(win, 'N', VER, rectShape(x - 0.7, x + 0.7, 8.2, 11.4))
// the stair: six broad steps and its sandstone cheeks
for (let i = 0; i < 6; i++) box(stone, CX - 2, CX + 2, N, N + 5.2 - i * 0.87, 0, 0.55 + ((BASE - 0.55) * i) / 5, stone, 0.05)
for (const x of [CX - 2.5, CX + 2.5]) prism(stone, [[x - 0.35, N], [x + 0.35, N], [x + 0.35, N + 5.6], [x - 0.35, N + 5.6]], 0, BASE + 0.6, stone, 0.1)

// ── Windows on the pavilions (both fronts) ──
for (const [x0, x1] of PAV) {
  const xm = (x0 + x1) / 2
  for (const [f, y] of [['N', N + 0.4], ['S', S - 0.4]] as const) {
    for (const dx of [-4.4, -1.5, 1.5, 4.4]) {
      on(win, f, y, rectShape(xm + dx - 0.55, xm + dx + 0.55, 0.6, 1.9))
      on(win, f, y, rectShape(xm + dx - 0.6, xm + dx + 0.6, 3.3, 6.3))
      on(win, f, y, archShape(xm + dx, 1.2, 8.2, 10.9, 6))
    }
    on(win, f, y, archShape(xm, 1.3, 14.0, 16.2, 6))
    for (const dx of [-1.6, 1.6]) on(win, f, y, archShape(xm + dx, 1.0, 14.0, 15.6, 6))
  }
}
// the south centre bay: plain rows
for (const x of [-6, -2, 2]) for (const [z0, z1] of [[0.6, 1.9], [3.3, 6.3], [8.2, 11.4]]) on(win, 'S', S, rectShape(x - 0.65, x + 0.65, z0, z1))
// the side walls of the pavilions and the wings: rows of tall windows
for (const [f, x, y0, y1] of [['W', -22.7, -6, 11], ['E', 19.6, -8, 12]] as const) {
  for (let y = y0; y <= y1; y += 3.4) for (const [z0, z1] of [[0.6, 1.9], [3.3, 6.3], [8.2, 11.4]]) on(win, f, x, rectShape(y - 0.6, y + 0.6, z0, z1))
}
for (const [f, x] of [['W', -20], ['E', 16]] as const) {
  for (const y of [-9.4, 13.4]) for (const [z0, z1] of [[3.3, 6.3], [8.2, 11.4]]) on(win, f, x, rectShape(y - 0.5, y + 0.5, z0, z1))
}
// the wings' own fronts
for (const [x0, x1, y0, y1] of WINGS) {
  const xm = (x0 + x1) / 2
  for (const [f, y] of [['N', y1], ['S', y0]] as const) for (const [z0, z1] of [[3.3, 6.3], [8.2, 11.4]]) on(win, f, y, rectShape(xm - 0.55, xm + 0.55, z0, z1))
}

// ── The walled east patio and the south annex ──
prism(stone, [[19.6, -10.4], [24.1, -10.4], [24.1, 0.4], [19.6, 0.4]], 0, 2.5, stone, 0.1)
// the annex: a tile-clad stair core, a covered link, a pale glass box on posts
prism(brick, [[-5.1, -21.4], [-0.4, -21.4], [-0.4, -16], [-5.1, -16]], 0, 15, brick, 0.2)
prism(brick, [[-0.4, -16], [3.6, -16], [3.6, S], [-0.4, S]], 0, 3, brick, 0.1)
prism(door, [[-0.4, -21.4], [9.2, -21.4], [9.2, -15.9], [-0.4, -15.9]], 3.6, 13.0, null, 0, true)
box(brick, -0.4, 9.2, -21.4, -15.9, 13.0, 13.5, brick, 0.1)
box(brick, -0.4, 9.2, -21.4, -15.9, 3.2, 3.6, null, 0.05, true)
for (const [x, y] of [[9, -21.2], [9, -16.1], [3.6, -21.2]] as const) box(brick, x - 0.2, x + 0.2, y - 0.2, y + 0.2, 0, 13.0, null, 0)

const fl = (p: V3, n: V3) => (n[1] > 0.5 && p[1] > 10 ? 0.6 : 0)
await save('phx-asu-old-main', 'Old Main', [
  { part: brick, material: { ...finish('oldmain-brick', 0xc27b63), floodlight: fl } },
  { part: stone, material: { ...finish('oldmain-sandstone', 0xc9a08c), floodlight: fl } },
  { part: tile, material: finish('oldmain-tile', 0xc0685a) },
  { part: win, material: PALETTE.window },
  { part: copper, material: PALETTE.patina },
  { part: door, material: PALETTE.entrance },
], { height: RIDGE + 1.7, anchor: [33.420566, -111.933959], bearing: 0 })

