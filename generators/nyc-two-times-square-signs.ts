/**
 * The sign stack of Two Times Square (the Renaissance New York Times Square
 * hotel tower, 714 Seventh Avenue), at the north end of Times Square behind
 * the TKTS stairs, with the Coca-Cola sign. Procedural, CC0-1.0.
 *   bun generators/nyc-two-times-square-signs.ts
 *
 * Host check (the brief asked to confirm it): Wikipedia's "Coca-Cola sign"
 * puts the 2017 3-D robotic sign "on the Two Times Square building", and
 * Commons' category "Coca-Cola sign (Two Times Square)" holds photos of it
 * on the narrow tower that closes the view up the square, right behind the
 * TKTS red stairs (c4, c5, c8, c9). In OSM that is building way/266149351
 * (start_date 1991) on the block between 47th and 48th Streets, Broadway
 * and Seventh Avenue, with parts way/258619249 (the tower, height 94.5,
 * 26 levels), way/258619245 (the low podium in front, 18 m) and
 * way/258619251 (the 18 m base behind). Not the DoubleTree/TSX building at
 * 1568 Broadway (way/266170615), across Seventh Avenue; the id stays.
 *
 * Signage only: replaces nothing. The host stays the map's OSM extrusion.
 * Lettering: STYLE.md's "Famous signs" exception. The Coca-Cola script is
 * a long-standing named sign: the white Spencerian script stands as
 * physical letters across the top of the red Coca-Cola screen in every
 * photo since 2017 (c1, c3, c4, c5, c7, c8, c9), whatever the screen
 * shows below it. It is traced letter by letter from c1 (a 1600 px crop,
 * 4x, of the sign's top) with `lettering.ts`: the two big capitals with
 * their heads, the first C's long tail under "oca", the second C's top
 * swash running out over "ola", the small "o c a", the hyphen, "o l a".
 * The screens' own content rotates and gets no lettering.
 *
 * Map frame: x east, y north, z up, metres, built in the turned frame: +y
 * is the tower's long axis, bearing 22.0 (OSM way/258619249's long sides),
 * so the signs face -y, bearing 202, straight down the square. The origin
 * (-73.9847453, 40.7594686) is the middle of the tower's south face. In
 * this frame the tower's south face runs from (-9.14, -0.05) to
 * (9.20, 0.03), and the podium's south face from (-7.69, -9.94) to
 * (3.77, -11.37), 7.1 degrees off the tower's; the podium covers
 * x -7.7..5.8 in front of the tower up to 18 m.
 *
 * Decoration rules: every sign's back plane is 0.35 m outside the host
 * outline (0.31-0.37 m on the tower face, which leans 0.08 m over its
 * width; 0.3 m on the podium face). Everything stays under the tower's OSM
 * height (94.5 m) except the top sign, which really stands above the roof
 * on a frame (c5, c7, c9): its frame is drawn, on the roof.
 *
 * Heights, from c9 (a long-lens view from 43rd Street, nearly orthographic;
 * scaled by the Coca-Cola screen, published 68 x 42 ft, 20.7 x 12.8 m,
 * Wikipedia), which puts the shaft's roof at 95 m, as OSM's 94.5:
 * - the top sign 85.7-98.4 m on a frame to 99.8 m (PGIM in 2023, Xinhua
 *   and others before), 11.6 m wide;
 * - the upper screen 63.6-83.8 m, 12.2 m wide;
 * - the Samsung screen 42.3-62.3 m, 11.6 m wide;
 * - the Coca-Cola sign 20.0-40.7 m, 12.8 m wide (published);
 * - on the podium front, a screen 12.8-17.9 m and one 4.4-10.0 m, with
 *   the glazed band between them (c3, c8, c9).
 * Lidar (USGS NY CMPG 2017) is mostly empty over the dark screens; it
 * shows the podium roof at 16.6-17.8 m and returns at ~100 m that fit the
 * top sign's frame. Its tower roof (83-88 m) is lower than OSM's 94.5;
 * the model keeps OSM's, which c9 supports.
 * Estimated: the cabinets' depth (0.9 m; 1.2 m for the Coca-Cola sign,
 * whose cubes move in and out), their dark borders (0.3 m), the frame
 * above the roof.
 *
 * Colours: the screens are lit colour blocks, `neon-*`, glowing in their
 * own colour at night (c2, night): Coca-Cola red with its white script,
 * the top sign pale (PGIM, c7, c9), the upper screen warm amber (FRYE,
 * c4, c9), the Samsung screen Samsung blue, the podium screens teal and
 * blue. Cabinets and frames dark `sign-frame`.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - c1 "2017 Coke Sign.jpg", Primary686, CC BY-SA 3.0: the new sign being
 *   finished, straight on; the script trace.
 *   https://commons.wikimedia.org/wiki/File:2017_Coke_Sign.jpg
 * - c2 "Times Square New York City November 25, 2018.jpg", Jaggerhornik,
 *   CC BY-SA 4.0: the stack at night.
 *   https://commons.wikimedia.org/wiki/File:Times_Square_New_York_City_November_25,_2018.jpg
 * - c3 "Times Square, New York 2019 11.jpg", dconvertini, CC BY-SA 2.0:
 *   from below; the script's standing letters, the podium screens.
 *   https://commons.wikimedia.org/wiki/File:Times_Square,_New_York_2019_11.jpg
 * - c4 "Times Square, New York City, 20231003 1238 1920.jpg" and c9 "...1922.jpg",
 *   Jakub Halun, CC BY 4.0: the whole stack from 43rd Street.
 *   https://commons.wikimedia.org/wiki/File:Times_Square,_New_York_City,_20231003_1238_1922.jpg
 * - c5 "New York, 2019 (48621790642).jpg", Sergiy Galyonkin, CC BY-SA 2.0:
 *   from the south, behind the TKTS stairs.
 *   https://commons.wikimedia.org/wiki/File:New_York,_2019_(48621790642).jpg
 * - c7 "Good Riddance Day 2024 15.jpg", SWinxy, CC BY 4.0: from 46th Street.
 *   https://commons.wikimedia.org/wiki/File:Good_Riddance_Day_2024_15.jpg
 * - c8 "2025-10-19 02.41.42 Choi Kwang-mo Nongshim Shin Ramyun Light Ups
 *   New York Times Square with KPop Demon Hunters.jpg", Choikwangmo25, CC0.
 *   https://commons.wikimedia.org/wiki/File:2025-10-19_02.41.42_Choi_Kwang-mo_Nongshim_Shin_Ramyun_Light_Ups_New_York_Times_Square_with_KPop_Demon_Hunters.jpg
 *
 * Doubts: the screens change; the stack's order and sizes are 2023-25's.
 * The podium's upper screen is wider than the podium's face in c3 (2019,
 * ~21 m) and c8 (2025, ~15.7 m); it is drawn on the face, 11 m, rather than
 * hanging past its corner. c4 and c9 (2023) show two narrow screens
 * flanking the Coca-Cola sign whose mounting no photo shows; left out. The
 * script is traced from one oblique-free photo at 4x; its strokes are of
 * even weight, so the Spencerian swell is only approximated.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { Pen, strokes, type Pt } from './lettering'

const red = new Part(), white = new Part(), blue = new Part(), amber = new Part(), teal = new Part(), frame = new Part()

/** A box between two corners, in the model frame. */
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
  const r = (z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  p.loft([r(z0), r(z1)])
  p.cap(r(z1), true)
  p.cap(r(z0), false)
}
/** A box in a turned frame: origin o, along unit u (in plan), outward unit n; s along u, d out along n. */
function obox(p: Part, o: [number, number], u: [number, number], n: [number, number], s0: number, s1: number, d0: number, d1: number, z0: number, z1: number) {
  const at = (s: number, d: number, z: number): V3 => [o[0] + u[0] * s + n[0] * d, o[1] + u[1] * s + n[1] * d, z]
  // counter-clockwise from above: depends on the handedness of (u, n)
  const ccw = u[0] * n[1] - u[1] * n[0] > 0
  const r = (z: number): V3[] => {
    const q = [at(s0, d0, z), at(s1, d0, z), at(s1, d1, z), at(s0, d1, z)]
    return ccw ? q : q.reverse()
  }
  p.loft([r(z0), r(z1)])
  p.cap(r(z1), true)
  p.cap(r(z0), false)
}

// ------------------------------------------------------------ the tower face
const BACK = -0.35 // back plane of the tower-face signs (the face is y ~ 0)
const BORDER = 0.3
/** A screen hung on the tower face: a dark cabinet and its lit face, x0..x1, z0..z1. */
function towerScreen(face: Part, x0: number, x1: number, z0: number, z1: number, depth = 0.9) {
  const yf = BACK - depth
  box(frame, x0, yf, z0, x1, BACK, z1)
  box(face, x0 + BORDER, yf - 0.08, z0 + BORDER, x1 - BORDER, yf, z1 - BORDER)
}
const CW = 12.8 / 2 // the Coca-Cola sign's half-width (published 42 ft)
const COKE0 = 20.0, COKE1 = 40.7
{
  // the Coca-Cola sign: a red cabinet, its sides red too (the striped
  // returns in c1), a dark back
  const D = 1.2, yf = BACK - D
  box(frame, -CW, BACK - 0.3, COKE0, CW, BACK, COKE1)
  box(red, -CW, yf, COKE0, CW, BACK - 0.3, COKE1)
}
towerScreen(blue, -5.8, 5.8, 42.3, 62.3) // Samsung
towerScreen(amber, -6.1, 6.1, 63.6, 83.8) // the upper screen
// the top sign, standing above the roof (94.5) on a frame
const ROOF = 94.5
towerScreen(white, -5.8, 5.8, 85.7, 98.4)
box(frame, -5.8, BACK - 0.9, 98.4, 5.8, BACK, 99.8) // its crown rail
for (const x of [-4.6, -1.5, 1.5, 4.6]) {
  // posts behind it on the roof, and raking struts back to the roof
  box(frame, x - 0.18, BACK, ROOF, x + 0.18, 0.6, 99.6)
  const s0: V3 = [x, 0.4, 99.2], s1: V3 = [x, 5.0, ROOF + 0.15]
  const h = 0.14
  const ring = (P: V3): V3[] => [[P[0] - h, P[1], P[2] - h], [P[0] + h, P[1], P[2] - h], [P[0] + h, P[1], P[2] + h], [P[0] - h, P[1], P[2] + h]]
  const a = ring(s0), b = ring(s1)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    frame.quad(a[i], a[j], b[j], b[i])
  }
}

// ------------------------------------------------------------ the podium face
{
  const P0: [number, number] = [-7.69, -9.94], P1: [number, number] = [3.77, -11.37]
  const L = Math.hypot(P1[0] - P0[0], P1[1] - P0[1])
  const u: [number, number] = [(P1[0] - P0[0]) / L, (P1[1] - P0[1]) / L]
  const n: [number, number] = [u[1], -u[0]] // outward, toward the square
  const OFF = 0.3, D = 0.9
  const screen = (face: Part, s0: number, s1: number, z0: number, z1: number) => {
    obox(frame, P0, u, n, s0, s1, OFF, OFF + D, z0, z1)
    obox(face, P0, u, n, s0 + BORDER, s1 - BORDER, OFF + D, OFF + D + 0.08, z0 + BORDER, z1 - BORDER)
  }
  screen(blue, 0.25, L - 0.25, 12.8, 17.9)
  screen(teal, 0.25, L - 0.25, 4.4, 10.0)
  // the lower cabinet's frame comes down to the sidewalk at both ends as
  // dark posts beside the storefront (c3, c5)
  for (const s of [0.25, L - 0.65]) obox(frame, P0, u, n, s, s + 0.4, OFF, OFF + 0.5, 0, 4.4)
}

// ------------------------------------------------------------ the script
// Centre-lines traced in a 4x crop of c1 (pixels; u right, v down): crop
// origin at c1 (420, 150). c1's sign spans x 335-945 (12.8 m) and y
// 145-1195 (20.7 m).
const KX = 4 * (610 / 12.8), KZ = 4 * (1050 / 20.7)
const toM = (u: number, v: number): [number, number] => [(420 + u / 4 - 640) * 4 / KX, COKE1 - (150 + v / 4 - 145) * 4 / KZ]
const SCRIPT_Y = BACK - 1.2 // the red face
const place = (u: number, v: number, w: number): V3 => {
  const [x, z] = toM(u, v)
  return [x, SCRIPT_Y - w, z]
}
const heavy = new Pen(), light = new Pen()
const oval = (cx: number, cy: number, rx: number, ry: number, slant: number) => {
  const path: Pt[] = []
  for (let i = 0; i <= 14; i++) {
    const t = (2 * Math.PI * i) / 14, y = ry * Math.sin(t)
    path.push([cx + rx * Math.cos(t) - y * slant, cy + y])
  }
  light.paths.push(path)
}
// First C: the head's curl, over the top and down the long slanted bowl,
// round the foot and away to the right as the tail under "oca".
heavy.moveTo([338, 256]).cubicTo([398, 258], [432, 214], [408, 194]).cubicTo([390, 180], [356, 188], [330, 202])
  .cubicTo([258, 240], [152, 400], [118, 500]).cubicTo([100, 580], [150, 612], [240, 598])
  .cubicTo([380, 575], [520, 525], [700, 545])
oval(285, 388, 30, 76, 0.3) // o
light.moveTo([440, 300]).cubicTo([405, 262], [352, 320], [347, 420]).cubicTo([344, 480], [400, 495], [432, 470]) // c
oval(512, 395, 40, 78, 0.3) // a, bowl, closed by the stem
light.moveTo([592, 268]).lineTo([548, 462]).quadTo([552, 494], [596, 482]) // a, stem
light.moveTo([622, 298]).lineTo([684, 262]) // hyphen
// Second C: up the right side of its head loop, then down the big bowl
// and round the foot; the loop; the top swash out over "ola".
heavy.moveTo([1020, 250]).quadTo([1010, 120], [1090, 92]).cubicTo([980, 100], [850, 230], [800, 380])
  .cubicTo([770, 490], [820, 555], [900, 540])
light.circle([1040, 172], 20, 68, 12)
heavy.moveTo([1092, 92]).cubicTo([1200, 80], [1350, 85], [1450, 60]).quadTo([1530, 40], [1575, 22])
oval(935, 400, 32, 78, 0.3) // o
light.moveTo([1140, 492]).cubicTo([1220, 380], [1320, 220], [1310, 120]).quadTo([1300, 90], [1262, 118])
  .cubicTo([1200, 200], [1150, 380], [1152, 470]).quadTo([1156, 502], [1190, 494]) // l, a narrow loop
oval(1350, 395, 46, 78, 0.3) // a, bowl, closed by the stem
light.moveTo([1480, 240]).lineTo([1432, 470]).quadTo([1436, 500], [1478, 486]) // a, stem
strokes(white, heavy.paths, { width: 64, depth: 0.4, place })
strokes(white, light.paths, { width: 50, depth: 0.4, place })

const parts = [
  { part: red, material: finish('neon-coke-red', 0xdc2f2f) },
  { part: white, material: finish('neon-coke-white', 0xf3efe9) },
  { part: blue, material: finish('neon-screen-blue', 0x3f68c8) },
  { part: amber, material: finish('neon-screen-amber', 0xe0a048) },
  { part: teal, material: finish('neon-screen-teal', 0x3aa99c) },
  { part: frame, material: finish('sign-frame', 0x4a4f57) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
let top = 0, bottom = Infinity
for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) { top = Math.max(top, part.pos[i]); bottom = Math.min(bottom, part.pos[i]) }
const glb = writeGlb('Two Times Square signs', parts, {
  license: 'CC0-1.0', bearing: 22, elevation: 0, height: top,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: [],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-two-times-square-signs.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${bottom.toFixed(1)}-${top.toFixed(1)} m`)
