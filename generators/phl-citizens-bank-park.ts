/**
 * Citizens Bank Park, Philadelphia (MLB, Philadelphia Phillies; 2004,
 * EwingCole with HOK Sport and Agoos Lovera) — procedural, CC0-1.0, no
 * textures.  bun generators/phl-citizens-bank-park.ts
 *
 * Map frame: x across the park (first-base side +x), y from home plate
 * towards centre field, z up, metres. Placed at bearing 9°, the bisector of
 * the foul lines (OSM pitch way/92483441: the left-field corner at -35.6°,
 * the right-field corner at 54.6° from home plate). The anchor is the area
 * centroid of the outline (building=stadium relation/1348884, outer
 * way/255489463): -75.166491, 39.905950. Home plate is at (-2.4, -41) in
 * this frame; the bowl is lofted round C = (-2, -20), near the mound.
 *
 * z = 0 is the field, sunk below the streets: the lidar puts the field
 * surface 6.4 m below the street and plaza round the park (1.6 m against
 * 8.0 m above the box's lowest return, on all four sides), and the
 * photos from the concourse look down onto the field. But the map's own
 * terrain (Mapterhorn) already has the dig: its 7 x 7 grid over the plan
 * puts the field 7.3-8.9 m below the street grid points, and the map puts
 * y = 0 on that lowest point. So `elevation` is 0: the field lands on the
 * terrain's field and the outer walls rise from the dig past the street.
 * `bun tools/terrain.ts check phl-citizens-bank-park --lng -75.166491
 * --lat 39.905950 --bearing 9 --elevation 0` prints ok; at -6.4 it buries
 * the lower bowl 5.9 m deep (9,805 m^2), as the depth would be counted
 * twice. The pitch, the warning track and the infield are the map's
 * (STYLE.md, "Don't model the ground").
 *
 * What makes it read as itself, from the photos: the navy seats in three
 * levels wrapped from the left-field line round home plate to right field,
 * under dark steel roofs over the upper deck (a lower roof on the
 * right-field stand); the dark brown-red steel lattice light towers on the
 * roofs and in the outfield; the big left-field video board with the red
 * "Phillies" script on top; the open outfield with its low brick buildings
 * and Ashburn Alley at street level; and the Liberty Bell sign in
 * right-centre field, a neon outline of the bell on its own steel tower,
 * the park's mark at night (it lights and swings after home runs).
 *
 * Evidence
 * - OSM: outline relation/1348884 (outer way/255489463, inner pitch
 *   way/92483441); buildings inside the outline that the model draws:
 *   way/92483436 (left-field bleacher block), way/92483440 (first-base stair
 *   tower), way/255596565 (stair tower behind home), way/255596566 and
 *   way/255596569 (gate canopies). The parking garage way/101102918 is
 *   outside and left to the map.
 * - Measured, lidar: USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown
 *   2015), 1 m grid, read along rays from C every 5° (table SECTIONS):
 *   the lower bowl rising to 5 m, a suite face to 14 m, the second level
 *   to 22 m, the upper deck rising to 29.5 m under its roof at 40.3-40.7 m
 *   (35.5 m and 25 m on the right-field stand, 30°-90°), the roofs 11-14 m
 *   deep, the concourse blocks behind them at 18-34 m, the outer walls;
 *   the left-field bleachers rising to 17 m; six light towers with lamp
 *   banks topping out at 59.6 m (the left-field one, behind the video board,
 *   at 71 m); the Liberty Bell tower at (33, 113), 38.5 m.
 * - Measured, USGS NAIP orthophoto (0.40 m): plan, roof colours.
 * - Published (Wikipedia, "Citizens Bank Park"): opened 2004; EwingCole
 *   with HOK Sport and Agoos Lovera; the Liberty Bell sign 52 ft tall by
 *   35 ft wide (16 x 10.7 m), 102 ft (31 m) above the street, lit and
 *   "ringing" after home runs and wins; the PhanaVision board (2023)
 *   152 x 86 ft (46 x 26 m).
 * - Photos (Wikimedia Commons):
 *   Chris6d, "Citizens Bank Park 2021" (CC BY-SA 4.0, from the first-base
 *     upper deck: the bowl, roofs, board, towers)
 *     https://commons.wikimedia.org/wiki/File:Citizens_Bank_Park_2021.jpg
 *   Caleb Spicer, "Citizens Bank Park - Wide View" (CC BY 4.0, 2024, the
 *     2023 board and its script, the third-base stand, at dusk)
 *     https://commons.wikimedia.org/wiki/File:Citizens_Bank_Park_-_Wide_View.jpg
 *   Bruce C. Cooper, "Citizens Bank Park, May 2009" (CC BY-SA 3.0, the
 *     third-base stand and its roof)
 *     https://commons.wikimedia.org/wiki/File:Citizens_Bank_Park,_May_2009.jpg
 *   redlegsfan21, "Citizens Bank Park (20878675372)" (CC BY-SA 2.0, from
 *     behind home)
 *     https://commons.wikimedia.org/wiki/File:Citizens_Bank_Park_(20878675372).jpg
 *   Peetlesnumber1, "Phillies vs Dodgers 2017 23" (CC BY-SA 4.0, the
 *     Liberty Bell sign) and "Ashburn" (CC BY-SA 3.0)
 *     https://commons.wikimedia.org/wiki/File:Phillies_vs_Dodgers_2017_23.jpg
 *   Peter Bond, "Citizens Bank Park (2371206461)" (CC BY-SA 2.0, the bell
 *     and its tower), "Center Field at Citizens Bank Park (2372061626)",
 *     "Left Field at Citizens Bank Park (2371218993)" (CC BY-SA 2.0)
 *     https://commons.wikimedia.org/wiki/File:Citizens_Bank_Park_(2371206461).jpg
 *   minimoniotaku, "S8000749" (CC BY 2.0, the bell at dusk)
 *     https://commons.wikimedia.org/wiki/File:S8000749.JPG
 *   Hello32020, "Phillies vs. Red Sox 5-18-12" (CC BY-SA 3.0, the bell lit
 *     at night)
 *     https://commons.wikimedia.org/wiki/File:Phillies_vs._Red_Sox_5-18-12.JPG
 *   Jon Gudorf, "Citizens Bank Park-125 (36913506654)" (CC BY-SA 2.0, the
 *     brick outside and the light towers)
 *     https://commons.wikimedia.org/wiki/File:Citizens_Bank_Park-125_(36913506654).jpg
 * Estimated: everything under the roofs (the upper deck's back at about
 * 37 m), the glass bands on the suite faces, the outer walls' brick and
 * window bands (the outside is barely photographed), the light towers'
 * legs and lamp banks (lidar gives their tops and places), the 2023 board's
 * place and height (it is newer than the lidar: drawn where the old board
 * stood, at its published size, 22-48 m, the script above it), the bell's
 * outline, traced from the photos at its published size.
 * The bell's neon is drawn 1.6 m wide (the real tubes are much finer) so
 * it reads at 200 px at night; the lamp banks glow warm (window), leaving
 * the bell the park's only white light.
 * Simplified: the "Phillies" script is a red bar (the board is not the
 * landmark); the green "Citizens Bank Park" signs, flags, the ivy and the
 * bullpens are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { Pen, strokes } from './lettering'
import { quad, box, loftSections, rayHit, type XY, type SectionPt } from './dc-nationals-park'
import { beam, save } from './phl-lincoln-financial-field'

const seats = new Part(), brick = new Part(), stone = new Part(), steel = new Part(), win = new Part(), neon = new Part()
const C: XY = [-2, -20]
const H: XY = [-2.4, -41]
const dirOf = (a: number): XY => [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)]
const at = (a: number, r: number, z: number): V3 => { const d = dirOf(a); return [C[0] + d[0] * r, C[1] + d[1] * r, z] }

// OSM in this frame: the pitch (field wall) and the outline.
const PITCH: XY[] = [[-53.62, 16.58], [-68.28, 37.51], [-67.36, 44.78], [-58.11, 51.28], [-20.41, 77.78], [-11.94, 76.41], [-4.42, 82.84], [-1.85, 85.05], [32.04, 74.36], [34.29, 71.14], [72.81, 16.12], [50.6, 0.2], [48.99, -7.77], [37.08, -26.88], [32.27, -30.07], [31.13, -28.02], [-5.98, -55.09], [-19.5, -52.59], [-47.21, -12.77], [-49.27, -13.91], [-50.53, -12.03], [-55.1, 9.53]]
const wallR = (a: number) => rayHit(PITCH.map(([x, y]) => [x - C[0], y - C[1]] as XY), [0, 0], dirOf(a))

/**
 * The grandstand, from the lidar every 5°: [angle, r2 (the suite face),
 * rR0 and rR1 (the roof's front and back), rb (the outer wall), zb (the
 * concourse block behind the roof)]. Radii from C.
 */
const SECTIONS: [number, number, number, number, number, number][] = [
  [30, 96, 113, 121, 121, 25], [35, 94, 111, 121, 116, 25], [40, 93, 109, 122, 122, 25], [45, 92, 109, 122, 129, 23],
  [50, 93, 109, 122, 150, 23], [55, 94, 111, 123, 150, 24], [60, 91, 110, 124, 148, 25], [65, 87, 106, 118, 146, 22],
  [70, 83, 101, 114, 142, 24], [75, 82, 98, 111, 139, 24], [80, 80, 97, 109, 136, 24], [85, 79, 95, 108, 134, 24],
  [90, 78, 96, 107, 134, 26], [95, 76, 94, 105, 130, 24],
  [100, 72, 91, 100, 128, 22], [105, 68, 89, 98, 120, 22], [110, 66, 84, 96, 104, 25], [115, 62, 80, 93, 95, 24],
  [120, 61, 79, 91, 93, 26], [125, 60, 77, 89, 91, 26], [130, 60, 75, 88, 90, 24], [135, 59, 76, 88, 90, 26],
  [140, 59, 76, 88, 90, 24], [145, 60, 77, 89, 92, 24], [150, 61, 78, 91, 112, 25], [155, 63, 80, 93, 114, 26],
  [160, 64, 83, 96, 119, 30], [165, 66, 84, 96, 116, 28], [170, 65, 82, 94, 113, 30], [175, 64, 81, 93, 112, 31],
  [180, 64, 81, 92, 111, 33], [185, 64, 80, 93, 112, 31], [190, 65, 81, 94, 113, 31], [195, 66, 83, 95, 115, 28],
  [200, 64, 83, 97, 118, 30], [205, 63, 81, 93, 122, 30], [210, 61, 78, 91, 122, 29], [215, 60, 77, 89, 110, 24],
  [220, 59, 76, 88, 98, 22], [225, 58, 76, 87, 94, 25], [230, 59, 75, 88, 94, 25], [235, 59, 76, 88, 94, 26],
  [240, 60, 78, 90, 96, 26], [245, 62, 80, 93, 99, 25], [250, 64, 83, 96, 106, 28], [255, 67, 86, 101, 118, 28],
  [260, 70, 90, 105, 129, 30], [265, 76, 96, 107, 128, 30], [270, 78, 95, 107, 127, 30], [275, 78, 95, 107, 128, 32],
  [280, 79, 96, 108, 130, 32], [285, 81, 98, 109, 133, 28], [290, 83, 100, 103, 137, 22],
]
const row = (a: number) => SECTIONS.find((s) => s[0] === a)!

// The lower bowl all round: the field wall, seats up to the concourse at
// the suite face (5 m) in the grandstand; in the outfield, seats up to the
// street (6.4 m) and a short back wall.
const STREET = 6.4
{
  const angles: number[] = []
  for (let a = 0; a <= 360; a += 5) angles.push(a)
  loftSections(C, angles, angles.map((a): SectionPt[] => {
    const s = SECTIONS.find((q) => q[0] === a)
    const rw = wallR(a)
    const rTop = s ? s[1] - 0.5 : rw + 16, zTop = s ? 5 : STREET
    return [
      { r: rw, z: 0, part: stone },
      { r: rw, z: 1.2, part: seats },
      { r: rTop, z: zTop, part: stone },
      { r: rTop + 1, z: zTop, part: brick },
      { r: rTop + 1, z: 0, part: null },
    ]
  }), null)
}

// The grandstand, in two blocks: right field (30°-95°: roof 35.5 m, deck
// to 25 m) and the main stand from first base round home to the
// left-field line (100°-290°: roof 40.4 m, deck to 29.5 m).
function stand(a0: number, a1: number, zRoof: number, zDeck: number, ledge: number) {
  const angles = SECTIONS.map((s) => s[0]).filter((a) => a >= a0 && a <= a1)
  const sec = (a: number): SectionPt[] => {
    const [, r2, rR0, rR1, rb, zb] = row(a)
    const back = Math.max(rb, rR1 + 2)
    return [
      { r: r2 - 0.5, z: 5, part: stone }, // the suite face, glazed below
      { r: r2 - 0.5, z: 14, part: seats }, // the second level's club seats
      { r: r2 + ledge, z: 14, part: stone }, // second-level face
      { r: r2 + ledge, z: 22, part: seats }, // the upper deck, on into the roof's shade
      { r: rR1 - 2, z: zRoof - 3.5, part: stone }, // back wall up to the roof
      { r: rR1 - 2, z: zRoof - 1.6, part: stone }, // under the roof's back
      { r: rR1, z: zRoof - 1.6, part: stone },
      { r: rR1, z: zb, part: stone }, // the concourse block's roof
      { r: back, z: zb, part: brick }, // its brick outer wall
      { r: back, z: 0, part: null },
    ]
  }
  loftSections(C, angles, angles.map(sec), stone)
  // The roof: a flat slab with a dark steel fascia and underside.
  loftSections(C, angles, angles.map((a): SectionPt[] => {
    const [, , rR0, rR1] = row(a)
    return [
      { r: rR0, z: zRoof - 3, part: steel }, // the deep trussed fascia
      { r: rR0, z: zRoof, part: stone },
      { r: rR1 + 0.5, z: zRoof, part: steel },
      { r: rR1 + 0.5, z: zRoof - 1.6, part: steel },
      { r: rR0, z: zRoof - 3, part: null },
    ]
  }), steel)
  // Glass bands on the two suite faces and windows in the brick walls,
  // one panel per 5° bay.
  for (let k = 0; k < angles.length - 1; k++) {
    const A = row(angles[k]), B = row(angles[k + 1])
    const band = (ra: number, rb: number, z0: number, z1: number, out: number) => {
      const p = [at(A[0], ra + out, z0), at(B[0], rb + out, z0), at(B[0], rb + out, z1), at(A[0], ra + out, z1)]
      const m = (i: number, j: number, t: number): V3 => [p[i][0] + (p[j][0] - p[i][0]) * t, p[i][1] + (p[j][1] - p[i][1]) * t, p[i][2] + (p[j][2] - p[i][2]) * t]
      quad(win, [m(0, 1, 0.08), m(0, 1, 0.92), m(3, 2, 0.92), m(3, 2, 0.08)], [Math.sign(out) * (p[0][0] - C[0]), Math.sign(out) * (p[0][1] - C[1]), 0])
    }
    band(A[1] - 0.5, B[1] - 0.5, 7.5, 12.5, -0.06)
    band(A[1] + ledge, B[1] + ledge, 15.5, 20.5, -0.06)
    const ba = Math.max(A[4], A[3] + 2), bb = Math.max(B[4], B[3] + 2)
    if (Math.abs(ba - bb) < 6 && Math.min(A[5], B[5]) > 20) {
      band(ba, bb, STREET + 3, STREET + 8, 0.06)
      band(ba, bb, STREET + 11, Math.min(A[5], B[5]) - 3, 0.06)
    }
  }
}
stand(30, 95, 35.5, 25, 8)
stand(100, 290, 40.4, 29.5, 4)

// Left-field bleachers behind the lower seats, rising to 17 m, and the
// bleacher block at the end of them (OSM way/92483436).
loftSections(C, [300, 305, 310, 315, 320, 325, 330, 335], [300, 305, 310, 315, 320, 325, 330, 335].map((a): SectionPt[] => [
  { r: 100, z: STREET, part: stone },
  { r: 100, z: 11, part: seats },
  { r: 114, z: 17, part: stone },
  { r: 116, z: 17, part: brick },
  { r: 116, z: 0, part: null },
]), brick)
box(brick, [-47.6, 106.2, 8.3], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [6.4, 3.2, 8.3])

// Centre field: the low brick buildings of Ashburn Alley behind the
// batter's eye and the bullpens, 4-13 m above the street (lidar).
const blk = (p: Part, c: XY, hw: number, hd: number, h: number, ang = 0) => {
  const t = (ang * Math.PI) / 180
  box(p, [c[0], c[1], h / 2], [[Math.cos(t), -Math.sin(t), 0], [Math.sin(t), Math.cos(t), 0], [0, 0, 1]], [hw, hd, h / 2])
}
blk(brick, [-28, 106], 11, 6, 13, -20)
blk(brick, [-6, 116], 9, 5, 19, 0)
blk(brick, [12, 117], 8, 6, 13, 10)
blk(brick, [52, 108], 9, 7, 19, 30)
blk(brick, [63, 96], 7, 6, 23, 45)
// The stair towers and gate canopies inside the outline (OSM).
blk(brick, [102.6, -41.9], 5.5, 4.5, 29, 45)
blk(brick, [60, -88.3], 3.5, 3.5, 22, 45)
blk(stone, [91.4, -96.3], 8.8, 2.6, 11.3, 0)
blk(stone, [-104.6, -90.5], 8.5, 2.5, 11.3, -47)

// The light towers: lattice legs in the Phillies' dark red-brown steel, a
// lamp bank on top facing the field. Lidar places and tops.
function lightTower(c: XY, z0: number, top: number, w = 13) {
  const f: V3 = [H[0] - c[0] + (C[0] - H[0]) * 0, H[1] + 60 - c[1], 0] // towards the infield
  const n = Math.hypot(f[0], f[1]), fx = f[0] / n, fy = f[1] / n
  const t: V3 = [fy, -fx, 0], nrm: V3 = [fx, fy, 0]
  for (const s of [-1, 1]) for (const b of [-1.4, 1.4])
    beam(steel, [c[0] + t[0] * s * (w / 2 - 1) - fx * b, c[1] + t[1] * s * (w / 2 - 1) - fy * b, z0], [c[0] + t[0] * s * (w / 2 - 1) - fx * b, c[1] + t[1] * s * (w / 2 - 1) - fy * b, top - 9], 1.1, 1.1)
  for (const z of [z0 + (top - 9 - z0) * 0.5, top - 9.5]) beam(steel, [c[0] - t[0] * (w / 2 - 1), c[1] - t[1] * (w / 2 - 1), z], [c[0] + t[0] * (w / 2 - 1), c[1] + t[1] * (w / 2 - 1), z], 0.8, 0.8)
  box(steel, [c[0], c[1], top - 4.5], [t, nrm, [0, 0, 1]], [w / 2, 1.2, 4.5], true)
  box(win, [c[0] + fx * 1.25, c[1] + fy * 1.25, top - 4.5], [t, nrm, [0, 0, 1]], [w / 2 - 0.6, 0.06, 4], false) // lamps: warm at night, so the bell is the only white glow
}
lightTower([-88, -50], 40, 59.6)
lightTower([84, -50], 40, 59.6)
lightTower([-60, -77], 40, 59.6)
lightTower([57, -77], 40, 59.6)
lightTower([69, 72], 35, 59.6)
lightTower([-68, 82], 20, 71)

// The left-field video board (2023, 152 x 86 ft) on its frame, facing
// home, with the red "Phillies" script on top as a bar.
{
  const c: XY = [-82, 66]
  const f = [H[0] - c[0], H[1] - c[1]], n = Math.hypot(f[0], f[1])
  const nrm: V3 = [f[0] / n, f[1] / n, 0], t: V3 = [nrm[1], -nrm[0], 0]
  box(steel, [c[0], c[1], 35], [t, nrm, [0, 0, 1]], [24, 1.6, 13.6], true)
  box(win, [c[0] + nrm[0] * 1.66, c[1] + nrm[1] * 1.66, 35.4], [t, nrm, [0, 0, 1]], [22.6, 0.05, 12.2])
  for (const s of [-1, 1]) box(steel, [c[0] + t[0] * s * 16, c[1] + t[1] * s * 16, 11], [t, nrm, [0, 0, 1]], [1.6, 1.6, 11])
  box(brick, [c[0] + nrm[0] * 0.4, c[1] + nrm[1] * 0.4, 51.5], [t, nrm, [0, 0, 1]], [12, 0.5, 2.8], true)
}

// The Liberty Bell: a neon outline of the bell, 16 x 10.7 m, its top
// 31 m above the street, on a lattice tower in right-centre field.
{
  const c: XY = [33, 113]
  const f = [H[0] - c[0], H[1] - c[1]], n = Math.hypot(f[0], f[1])
  const nrm: V3 = [f[0] / n, f[1] / n, 0], t: V3 = [nrm[1], -nrm[0], 0]
  // the tower: four legs, braced, up behind the bell
  for (const [a, b] of [[-2.6, -2.6], [2.6, -2.6], [2.6, 2.6], [-2.6, 2.6]])
    beam(steel, [c[0] + t[0] * a + nrm[0] * b, c[1] + t[1] * a + nrm[1] * b, 0], [c[0] + t[0] * a + nrm[0] * b, c[1] + t[1] * a + nrm[1] * b, 36], 0.7, 0.7)
  for (const z of [10, 21, 30]) for (const s of [-1, 1])
    beam(steel, [c[0] - t[0] * 2.6 + nrm[0] * s * 2.6, c[1] - t[1] * 2.6 + nrm[1] * s * 2.6, z], [c[0] + t[0] * 2.6 + nrm[0] * s * 2.6, c[1] + t[1] * 2.6 + nrm[1] * s * 2.6, z], 0.5, 0.5)
  // the bell, traced from the photos: yoke, shoulder, flared sides, lip, crack
  const pen = new Pen()
  pen.moveTo([-5.35, 13.2]).lineTo([5.35, 13.2]).lineTo([5.35, 14.7]).lineTo([1.9, 14.7]).lineTo([1.9, 16]).lineTo([-1.9, 16]).lineTo([-1.9, 14.7]).lineTo([-5.35, 14.7]).lineTo([-5.35, 13.2])
  pen.moveTo([0, 12.4]).lineTo([0, 13.2])
  pen.moveTo([-5.2, 0.4]).lineTo([-5.2, 1.4]).cubicTo([-4.0, 2.2], [-3.2, 4.0], [-3.1, 7.6]).cubicTo([-3.0, 10.6], [-2.2, 12.3], [0, 12.4])
    .cubicTo([2.2, 12.3], [3.0, 10.6], [3.1, 7.6]).cubicTo([3.2, 4.0], [4.0, 2.2], [5.2, 1.4]).lineTo([5.2, 0.4]).lineTo([-5.2, 0.4])
  pen.moveTo([-4.6, 1.8]).lineTo([4.6, 1.8])
  pen.moveTo([-0.6, 0.4]).lineTo([0.3, 2.2]).lineTo([-0.5, 3.8]).lineTo([0.4, 5.4]).lineTo([-0.1, 7])
  const o: V3 = [c[0] + nrm[0] * 3.3, c[1] + nrm[1] * 3.3, 21.5]
  strokes(neon, pen.paths, {
    width: 1.6, depth: 1.2, back: true, // bolder than the real tubes, to read at phone size
    place: (u, v, w) => [o[0] + t[0] * -u + nrm[0] * w, o[1] + t[1] * -u + nrm[1] * w, o[2] + v],
  })
}

if (import.meta.main) {
  await save('phl-citizens-bank-park', 'Citizens Bank Park', [
    { part: seats, material: finish('cbp-navy', 0x4a5a7e) },
    { part: brick, material: finish('cbp-brick', 0xae5f4c) },
    { part: stone, material: finish('cbp-precast', 0xc6cbc6) },
    { part: steel, material: finish('cbp-steel', 0x5a4a4a) },
    { part: win, material: PALETTE.window },
    { part: neon, material: finish('neon-liberty-bell', 0xf2f3f0) },
  ], { bearing: 9, osm: 'relation/1348884', height: 71, elevation: 0 }, 6500)
}
