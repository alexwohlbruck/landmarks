/**
 * Christian Science Center: the Administration Building, 177 Huntington
 * Avenue, Boston (1972, Araldo Cossutta of I. M. Pei & Associates; 26
 * storeys, cast-in-place concrete) — original procedural geometry, CC0-1.0.
 * bun generators/bos-christian-science-center.ts
 *
 * Scope: only the tower. The Center's other two Cossutta buildings stand
 * apart from it: the Colonnade Building lies across the plaza (about 80 m),
 * and in OSM it is part of way/29715441, merged with the Publishing House;
 * Reflection Hall (the former Sunday School, way/29650777) is at the far
 * end of the reflecting pool, about 200 m away. They are left to separate
 * placements if wanted.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Anchor = the centroid of OSM way/29551225, -71.08279,
 * 42.34494. Bearing 313: +x runs along the slab (compass 43); the +y long
 * face looks north-west over the reflecting pool and plaza, the -y face
 * south-east onto Huntington Avenue.
 *
 * Plan: OSM way/29551225 in the frame: the slab x -22.2..20.4,
 * y -10.7..10.4, with a rounded service shaft at opposite corners of the
 * ends: radius 6.25 about (-23.0, -4.5) at the south-west end and radius
 * 6.65 about (21.6, 3.7) at the north-east end. The lidar footprint agrees
 * within about 2 m.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021 flight), 0.5 m
 * grid, read with tools/lidar_frame.py at bearing 313; y = 0 is the plaza
 * (4.1 m above the grid's ground_min; the site is flat). Measured: roof
 * 106.8, parapet 108.1 (OSM's height 102 is low), a sunken roof court about
 * 101 (not drawn).
 *
 * Estimated from the photos (Ha'Eri, Nichols; scaled from the lidar
 * height): the ground storey of tall piers to 10 m, the egg-crate grid from
 * 10 to 96 m; the real grid is about 12 bays by 26 storeys of square
 * cells, drawn coarser as 9 bays by 16 bands (cells about 4.2 x 5.4 m) so
 * it keeps its square egg-crate look without shimmering; the solid attic from 96 m, the solid end
 * strips about 2.5 m wide, the recessed window slot in each end wall beside
 * the shaft, and its notch in the parapet.
 *
 * Night: the office windows glow; the concrete is not floodlit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - 2023-0322-Christian Science Administration Building-02.jpg, Bobak
 *    Ha'Eri, CC BY 3.0 (long face and end from the pool, south-west)
 *    https://commons.wikimedia.org/wiki/File:2023-0322-Christian_Science_Administration_Building-02.jpg
 *  - Christian Science administration building, Boston, 19 July 2011.jpg,
 *    Sarah Nichols, CC BY-SA 2.0 (from the Mother Church side, west)
 *    https://commons.wikimedia.org/wiki/File:Christian_Science_administration_building,_Boston,_19_July_2011.jpg
 *  - USA 09562 Boston Luca Galuzzi 2007.jpg, Luca Galuzzi, CC BY-SA 2.5
 *    (from the Massachusetts Avenue end of the pool)
 *    https://commons.wikimedia.org/wiki/File:USA_09562_Boston_Luca_Galuzzi_2007.jpg
 *  - Christian Science plazas from Prudential Centre.jpeg, ifly6, CC BY-SA
 *    3.0 (from above, north-east: plan, roof, the far long face)
 *    https://commons.wikimedia.org/wiki/File:Christian_Science_plazas_from_Prudential_Centre.jpeg
 * No commercial imagery.
 *
 * Doubts: the south-east (Huntington Avenue) long face is seen only from
 * above and is drawn like the plaza face. The grid is coarsened to two
 * storeys a band. The roof court, rooftop plant and the ground storey's
 * glazing details are left out or plain.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { box, onWall, rectShape, save, type XY } from './atl-tech-tower'
import { capPoly, ccw, prism } from './atl-flatiron-building'

const conc = new Part(), win = new Part(), roof = new Part(), lobby = new Part()

const X0 = -22.2, X1 = 20.4, Y0 = -10.7, Y1 = 10.4
const TOP = 108.1, ROOF = 106.8, GRID0 = 10, GRID1 = 96, BASE = 10
const D = 0.9 // depth of the grid's cells behind the frame
const END = 2.5 // the solid strips at the ends of each long face

// ── Core behind the grid, recessed by the cell depth on both long faces ──
box(conc, X0 + END, X1 - END, Y0 + D, Y1 - D, BASE, TOP, roof, 0)
// the ground storey: a recessed lobby behind the piers
box(lobby, X0 + END, X1 - END, Y0 + 2.6, Y1 - 2.6, 0, BASE, null, 0)

// ── The frame: end strips full height, the attic, the parapet ──
for (const [a, b] of [[X0, X0 + END], [X1 - END, X1]]) box(conc, a, b, Y0, Y1, 0, TOP, roof, 0.3)
box(conc, X0, X1, Y0, Y1, GRID1, TOP, null, 0)
box(roof, X0 + 0.8, X1 - 0.8, Y0 + 0.8, Y1 - 0.8, ROOF, ROOF + 0.05, null, 0)
// the parapet's inner faces read as roof from above; the top is the core's cap
capPoly(roof, ccw([[X0 + 0.8, Y0 + 0.8], [X1 - 0.8, Y0 + 0.8], [X1 - 0.8, Y1 - 0.8], [X0 + 0.8, Y1 - 0.8]]), TOP + 0.02, true)

// ── The egg-crate grid on both long faces ──
const BAYS = 9, BANDS = 16
const gx0 = X0 + END, gx1 = X1 - END, bw = (gx1 - gx0) / BAYS, bh = (GRID1 - GRID0) / BANDS
for (const side of [-1, 1]) {
  const yo = side < 0 ? Y0 : Y1, yi = side < 0 ? Y0 + D : Y1 - D
  const f: [XY, XY] = side < 0 ? [[gx0, yi], [gx1, yi]] : [[gx1, yi], [gx0, yi]]
  // the glazing, one panel per bay and band, set on the core
  for (let i = 0; i < BAYS; i++) for (let j = 0; j < BANDS; j++) {
    const s0 = i * bw + 0.3, s1 = (i + 1) * bw - 0.3, z0 = GRID0 + j * bh + 0.35, z1 = GRID0 + (j + 1) * bh - 0.35
    const s = side < 0 ? [s0, s1] : [gx1 - gx0 - s1, gx1 - gx0 - s0]
    onWall(win, f[0], f[1], rectShape(s[0], s[1], z0, z1), 0.05)
  }
  // vertical fins between bays and horizontal slabs between bands
  const ya = Math.min(yo, yi), yb = Math.max(yo, yi)
  for (let i = 1; i < BAYS; i++) {
    const x = gx0 + i * bw
    box(conc, x - 0.3, x + 0.3, ya, yb, GRID0, GRID1, conc, 0)
  }
  for (let j = 0; j <= BANDS; j++) {
    const z = GRID0 + j * bh
    box(conc, gx0, gx1, ya, yb, z - (j === 0 ? 0.8 : 0.35), z + 0.35, conc, 0)
  }
  // the ground storey's piers, carried down from the fins
  for (let i = 0; i <= BAYS; i++) {
    const x = gx0 + i * bw
    box(conc, x - 0.35, x + 0.35, side < 0 ? Y0 : Y1 - 2.6, side < 0 ? Y0 + 2.6 : Y1, 0, BASE, null, 0)
  }
}

// ── The rounded service shafts at the ends ──
function shaft(c: XY, r: number, a0: number, a1: number, xc: number) {
  const n = 12
  const pts: XY[] = Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] as XY
  })
  // close the ring along the end wall's line
  pts[0] = [xc, pts[0][1]]
  pts[n] = [xc, pts[n][1]]
  prism(conc, ccw(pts), 0, TOP, roof, 0.3)
}
// south-west: from (-22.2, 1.7) round the west to (-22.3, -10.7)
shaft([-23.0, -4.5], 6.25, Math.atan2(6.2, 0.8), Math.atan2(-6.2, 0.7) + Math.PI * 2, X0 + 0.6)
// north-east: from (20.4, -2.8) round the east to (20.5, 10.2)
shaft([21.6, 3.7], 6.65, Math.atan2(-6.5, -1.2), Math.atan2(6.5, -1.1), X1 - 0.6)

// ── End walls: the recessed window slot beside each shaft, notching the parapet ──
{
  // south-west end, the flat wall from y 1.7 to 10.4 faces -x
  const fw: [XY, XY] = [[X0, Y1], [X0, 1.7]]
  onWall(win, fw[0], fw[1], rectShape(8.7 - 2.0, 8.7 - 0.6, BASE, TOP - 0.01), 0.04)
  // north-east end, the flat wall from y -10.7 to -2.8 faces +x
  const fe: [XY, XY] = [[X1, Y0], [X1, -2.8]]
  onWall(win, fe[0], fe[1], rectShape(7.9 - 2.0, 7.9 - 0.6, BASE, TOP - 0.01), 0.04)
}

await save('bos-christian-science-center', 'Christian Science Center Administration Building', [
  { part: conc, material: finish('csc-concrete', 0xddd3c2) },
  { part: win, material: PALETTE.window },
  { part: lobby, material: PALETTE.entrance },
  { part: roof, material: PALETTE.roof },
], { height: TOP, anchor: [42.34494, -71.08279], bearing: 313 }, 5000)
