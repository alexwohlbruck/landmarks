/**
 * Duke Energy Plaza (525 S Tryon St, 2023, Childress Klein; Goettsch
 * Partners), Charlotte — original procedural geometry, CC0-1.0.
 * bun generators/clt-duke-energy-plaza.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the
 * centroid of the OSM outline way/1332536425) on the lowest ground. Placed at
 * bearing 48.7, square to Uptown's grid: -x faces South Tryon Street, +y faces
 * St. Peter's Catholic Church, -y faces the Gantt Center and Brooklyn
 * Village Avenue.
 *
 * Identity, in order:
 *  - a sheer 40-storey tower of blue reflective glass, a near-square shaft
 *    with clipped corners, on the Tryon half of the block;
 *  - each face split by a dark recessed slot into a wide and a narrow
 *    panel, the slots turning round the tower like a pinwheel, so the shaft
 *    reads as four glass prisms locked together;
 *  - the prisms stop at different heights, their glass running past the roof
 *    as screens, which gives the jagged top seen from every side;
 *  - silver-white fins on the corners and the slot edges;
 *  - a lower podium behind (south-east), 10 to 37 m.
 *
 * Evidence:
 *  - OSM: outline way/1332536425 (192 m, 40 levels); parts way/1332536426
 *    (the tower, 184 m skillion, a 52 x 49 m plan with clipped corners),
 *    way/1332536429 (37 m), way/1332536447 (25 m), way/1332536446 and
 *    way/1332536448 (10 m). Plan measured from these.
 *  - Published: 629 ft / 191.7 m, 40 floors, completed 2023 (CTBUH,
 *    https://www.skyscrapercenter.com/building/duke-energy-plaza/35102;
 *    Wikipedia "Duke Energy Plaza"). Taken as the top of the tallest prism.
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17) predates the
 *    tower; not used.
 *  - Terrain (Mapterhorn): the site falls about 5 m from Tryon (west) to the
 *    south-east corner; elevation 0.
 *  - Photos (Wikimedia Commons, daylight, all by City Dweller 2, CC BY-SA 4.0):
 *    "Duke Energy Plaza January 2023.jpg" (from the north across Tryon, over
 *    St. Peter's: the slots, the stepped top, the logo panel,
 *    https://commons.wikimedia.org/wiki/File:Duke_Energy_Plaza_January_2023.jpg);
 *    "Duke Energy Plaza November 2022.jpg" (from the north-east, the slot full
 *    height and the screens,
 *    https://commons.wikimedia.org/wiki/File:Duke_Energy_Plaza_November_2022.jpg);
 *    "Duke Energy Plaza September 2022.jpg" (from Brooklyn Village Avenue,
 *    south: two faces, their slots and the corner fins,
 *    https://commons.wikimedia.org/wiki/File:Duke_Energy_Plaza_September_2022.jpg).
 *    No commercial imagery. No look-only sources.
 *
 * Estimated: the pinwheel's split (60/40 on each face) and the slots (about
 * 2.4 m wide in the photos, drawn 4 m wide and 0.6 m deep in near-black blue
 * so they still read as dark bands at 200 px; checked against the January
 * and September 2022 photos over three passes); the prisms' tops (192, 189,
 * 186 and 184 m: published top, OSM's 184 m skillion low end, and the order
 * the photos show, the logo panel lower than its neighbour); the glass
 * screens 4 m above each roof; a pale line every three storeys standing in
 * for the fine mullion grid; the 3 m corner clips (OSM).
 * Doubts: the podium (37, 25 and 10 m parts) is not well photographed; it is
 * drawn plainly in pale grey with two-storey window bands. The Duke Energy
 * logo is left out (a small sign). OSM's part way/1332536427 (28 m) lies on
 * the Gantt Center and is not drawn.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, inset, onWall, panel, save, walls, type XY } from './chi-aon-center'

const BEARING = 48.7
const ANCHOR: [number, number] = [35.2232334, -80.8474495]

const glass = new Part(), slot = new Part(), fin = new Part(), roof = new Part(), pod = new Part(), podWin = new Part()

// --- Tower plan (OSM way/1332536426, squared): x -54.4..-2.4, y -24.3..24.6.
const X0 = -54.4, X1 = -2.4, Y0 = -24.3, Y1 = 24.6
const W = X1 - X0, H = Y1 - Y0
const G = 2.0 // half the slot's width (bolder than the real 2.4 m slot so it reads at phone size)
const DEPTH = 0.6 // the slot's glass sits this far behind the faces
const CLIP = 3.0
const LOBBY = 12, STOREY = 4.2

/** Pinwheel: four prisms round a core, a slot between each pair on the face. */
const xa = X0 + 0.4 * W, xb = X0 + 0.6 * W, ya = Y0 + 0.4 * H, yb = Y0 + 0.6 * H
type Prism = { r: XY[]; top: number }
// Each ring is counter-clockwise; the corner at index `c` is the tower's corner and is clipped.
const prisms: Prism[] = [
  { r: chamferAt([[X0, Y0], [xb - G, Y0], [xb - G, ya - G], [X0, ya - G]], 0), top: 186 }, // south-west
  { r: chamferAt([[xb + G, Y0], [X1, Y0], [X1, yb - G], [xb + G, yb - G]], 1), top: 192 }, // south-east
  { r: chamferAt([[xa + G, yb + G], [X1, yb + G], [X1, Y1], [xa + G, Y1]], 2), top: 184 }, // north-east (logo panel)
  { r: chamferAt([[X0, ya + G], [xa - G, ya + G], [xa - G, Y1], [X0, Y1]], 3), top: 189 }, // north-west
]
function chamferAt(r: XY[], c: number): XY[] {
  const out: XY[] = []
  r.forEach((p, i) => {
    if (i !== c) { out.push(p); return }
    const a = r[(i + r.length - 1) % r.length], b = r[(i + 1) % r.length]
    const ua = [(a[0] - p[0]), (a[1] - p[1])], la = Math.hypot(ua[0], ua[1])
    const ub = [(b[0] - p[0]), (b[1] - p[1])], lb = Math.hypot(ub[0], ub[1])
    out.push([p[0] + ua[0] / la * CLIP, p[1] + ua[1] / la * CLIP], [p[0] + ub[0] / lb * CLIP, p[1] + ub[1] / lb * CLIP])
  })
  return out
}

const SCREEN = 4 // glass carried past the roof as a screen
for (const { r, top } of prisms) {
  walls(glass, r, 0, top)
  // screen: a thin inner face and a lip, roof sunk SCREEN below the top
  const inner = inset(r, 0.5)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    fin.quad([r[i][0], r[i][1], top], [r[j][0], r[j][1], top], [inner[j][0], inner[j][1], top], [inner[i][0], inner[i][1], top])
    glass.quad([inner[j][0], inner[j][1], top], [inner[i][0], inner[i][1], top], [inner[i][0], inner[i][1], top - SCREEN], [inner[j][0], inner[j][1], top - SCREEN])
  }
  cap(roof, inner, top - SCREEN)
  // fins on every vertical edge of the prism's outer faces, and a pale line every three storeys
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], { L } = onWall(a, b)
    if (L < 2) { panel(fin, a, b, 0, L, 0, top, 0.05); continue } // the clipped corner is all fin
    panel(fin, a, b, 0, 0.45, 0, top, 0.05)
    panel(fin, a, b, L - 0.45, L, 0, top, 0.05)
    for (let z = LOBBY + 3 * STOREY; z < top - SCREEN - 2; z += 3 * STOREY) panel(fin, a, b, 0.45, L - 0.45, z - 0.18, z + 0.18, 0.04)
    panel(fin, a, b, 0.45, L - 0.45, LOBBY - 0.3, LOBBY + 0.3, 0.04)
  }
}
// Core, filling behind the slots up to the lowest prism.
{
  const C: XY[] = [[xa - G - 0.1, ya - G - 0.1], [xb + G + 0.1, ya - G - 0.1], [xb + G + 0.1, yb + G + 0.1], [xa - G - 0.1, yb + G + 0.1]]
  walls(slot, C, 0, 180)
  cap(roof, C, 180)
}
// The slots: dark glass DEPTH behind each face, between two prisms.
{
  const S: [XY[], number][] = [
    [[[xb - G, Y0 + DEPTH], [xb + G, Y0 + DEPTH], [xb + G, ya], [xb - G, ya]], Math.min(186, 192)],
    [[[X1 - DEPTH, yb - G], [X1 - DEPTH, yb + G], [xb, yb + G], [xb, yb - G]], Math.min(192, 184)],
    [[[xa - G, yb], [xa + G, yb], [xa + G, Y1 - DEPTH], [xa - G, Y1 - DEPTH]], Math.min(184, 189)],
    [[[X0 + DEPTH, ya - G], [xa, ya - G], [xa, ya + G], [X0 + DEPTH, ya + G]], Math.min(189, 186)],
  ]
  for (const [r, top] of S) {
    walls(slot, r, 0, top - SCREEN)
    cap(roof, r, top - SCREEN)
  }
}

// --- Podium (OSM parts), pale grey with two-storey window bands.
const podium: [XY[], number][] = [
  // way/1332536429, 37 m
  [[[-3.1, -22.1], [-5.8, -24.7], [-5.8, -32.2], [51.4, -32.2], [51.7, 31.7], [49.0, 31.6], [6.6, 30.8], [6.1, 23.4], [-4.1, 23.8], [-1.7, 20.8]], 37],
  // way/1332536447, 25 m
  [[[-4.1, 23.8], [6.1, 23.4], [6.6, 30.8], [49.0, 31.6], [49.1, 38.2], [-4.1, 37.1]], 25],
  // way/1332536446, 10 m
  [[[-23.3, 30.4], [-23.1, 24.3], [-4.1, 23.8], [-4.2, 31.0]], 10],
  // way/1332536448, 10 m
  [[[-55.0, -13.6], [-61.3, -13.2], [-61.6, -28.4], [-60.4, -32.2], [-5.8, -31.4], [-5.8, -24.7], [-52.5, -24.1], [-55.3, -20.9]], 10],
]
for (const [r0, h] of podium) {
  const area = r0.reduce((s, a, i) => { const b = r0[(i + 1) % r0.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
  const r = area < 0 ? [...r0].reverse() : r0
  walls(pod, r, 0, h)
  cap(roof, r, h)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], { L } = onWall(a, b)
    if (L < 6) continue
    const n = Math.max(1, Math.round(L / 7)), w = (L - (n + 1) * 1.2) / n
    for (let k = 0; k < n; k++) {
      const s0 = 1.2 + k * (w + 1.2)
      for (let z = 1; z + 6 <= h; z += 8) panel(podWin, a, b, s0, s0 + w, z, z + 5.6)
    }
  }
}

if (import.meta.main) {
  await save('clt-duke-energy-plaza', 'Duke Energy Plaza', ANCHOR, BEARING, [
    { part: glass, material: { ...PALETTE.window, color: 0x6f9bcc } },
    { part: slot, material: windowVariant(2, 0x2c4868) },
    { part: fin, material: finish('duke-plaza-fin', 0xe4e8ea) },
    { part: roof, material: PALETTE.roof },
    { part: pod, material: finish('duke-plaza-podium', 0xcfd0cc) },
    { part: podWin, material: windowVariant(3, 0x6f8799) },
  ])
}
