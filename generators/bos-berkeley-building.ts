/**
 * Berkeley Building (the Old John Hancock Building), 200 Berkeley Street,
 * Back Bay, Boston (1947, Cram and Ferguson) — original procedural
 * geometry, CC0-1.0.
 * bun generators/bos-berkeley-building.ts
 *
 * Map frame: x, y, z up, metres; origin at the anchor on the lowest ground.
 * Bearing 339.6: +y runs up Berkeley Street (north-north-west), +x along
 * St James Avenue (east-north-east), so the block's walls are square to
 * the axes. Anchor = the centroid of OSM way/29650724 ("The Berkeley
 * Building", the outline of the whole block), -71.0735263, 42.3497020.
 *
 * Identity (from the photos below):
 *  1. A pale Berea-sandstone slab tower, narrow end on to Berkeley Street,
 *     with lower wings on its long sides, so the narrow faces step in once.
 *     Close vertical bands of windows between stone piers.
 *  2. A stepped pyramid roof: six setbacks with dark slate-blue treads and
 *     pale risers.
 *  3. On top, the weather beacon: a square stone stage with corner
 *     buttresses, a windowed lantern shaft that lights up blue or red, a
 *     cornice and a top stage, and a tall thin mast.
 *  4. An eight-storey base filling the block, with the entrance court and
 *     its granite colonnade on Berkeley Street, and on the Clarendon Street
 *     end the 1922 Hancock building's red tile cross roof among skylights.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021), 1 m grid over
 * the block and 0.5 m over the crown, read with tools/lidar_frame.py.
 * y = 0 is the street at the Clarendon Street (west) end; Berkeley Street is
 * 1.3 m higher. Measured: tower parapet 107.0; wings 89.2; the pyramid's
 * six steps 112.7, 117.2, 119.7, 121.2, 123.6, 126.4, set in 1.5–11.5 m on
 * the long faces and 2.5–12.5 m on the ends; the beacon's base 128.1–134.1,
 * its lantern shaft to 143.8 and its top stage to 147.5 (Wikipedia gives
 * 495 ft, 151 m, which fits the beacon's top above the lidar's lowest
 * ground); the mast tip 166.5 in the lidar (a thin mast is under-sampled)
 * and about 169 scaled from the dusk photo: drawn to 168. The base: 31.5 on
 * the Clarendon end, 33.5 elsewhere; the 1922 block's roof to 49.5; the
 * entrance hall 17.5 and the colonnade 13.
 *
 * Plan: the tower and wings from the lidar (core x -0.5..57, y -18.3..17.7;
 * OSM's building:parts draw it about 3 m east and 2 m north on the west and
 * south sides; the east and north edges agree within 0.4 m); the block from
 * OSM's outline; the entrance court (x 57..77, y -21.3..17.7) and the
 * colonnade's front (x 70.5) from the lidar.
 *
 * Estimated from the photos: bay counts (nine on the tower's ends, one on
 * each wing end — ajay_suresh), fifteen bays on the long faces (from the
 * same pitch: no photo shows a long face square on), the beacon's widths
 * and stages (Kilby, scaled to the lidar's 128.1 and 147.5), the
 * colonnade's ten piers (ajay_suresh), the 1922 roof's cross shape (Kilby;
 * heights from the lidar).
 *
 * Night: the windows glow; the beacon's lantern is neon, drawn steady blue
 * ("steady blue, clear view"), as in the dusk photo.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Old Hancock Building.jpg, Eric Kilby, CC BY-SA 2.0 (from 200
 *    Clarendon, the west end, the pyramid and the beacon close up)
 *    https://commons.wikimedia.org/wiki/File:Old_Hancock_Building.jpg
 *  - Berkeley Building (54954549480).jpg, ajay_suresh, CC BY 4.0 (the
 *    Berkeley Street end square on, the colonnade)
 *    https://commons.wikimedia.org/wiki/File:Berkeley_Building_(54954549480).jpg
 *  - Back Bay Skyline at Dusk.jpg, EgorovaSvetlana, CC BY-SA 4.0 (from the
 *    Charles River, the beacon lit blue)
 *    https://commons.wikimedia.org/wiki/File:Back_Bay_Skyline_at_Dusk.jpg
 *  - Old John Hancock Building (Berkeley Building) (8610213324).jpg, City
 *    of Boston Archives, CC BY 2.0 (dusk, from the south-east)
 *    https://commons.wikimedia.org/wiki/File:Old_John_Hancock_Building_(Berkeley_Building)_(8610213324).jpg
 *  - Boston - Old and New John Hancock Buildings (4724927067).jpg, Roger W,
 *    CC BY-SA 2.0 (from the river, the north side)
 *    https://commons.wikimedia.org/wiki/File:Boston_-_Old_and_New_John_Hancock_Buildings_(4724927067).jpg
 *  - 2017 John Hancock Tower 2.jpg, Beyond My Ken, CC BY-SA 4.0 (the crown
 *    from Copley Square)
 *    https://commons.wikimedia.org/wiki/File:2017_John_Hancock_Tower_2.jpg
 * Published: Wikipedia, "Berkeley Building": 26 floors, 495 ft, 1947,
 * Cram and Ferguson, Berea sandstone, the beacon's colour code.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the long (St James Avenue and Stuart Street) faces of the tower
 * and the base are not photographed square on; their bays follow the ends'
 * pitch. The base's shopfronts, the tower's carved top-floor panels, the
 * beacon's railing and the mast's lattice are left out. The 1922 roof is
 * simplified to a cross of hips with a central pyramid.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { box, edgePanels, save, type XY } from './atl-flatiron-building'
import { hipRoof, onWall, pyramid, rectShape, revolve } from './atl-tech-tower'

const stone = new Part(), win = new Part(), slate = new Part(), roof = new Part(), tile = new Part(), neon = new Part()

type F = [XY, XY]
/** The faces of a box, each running with the outside on its right. */
const faces = (x0: number, x1: number, y0: number, y1: number): Record<'s' | 'e' | 'n' | 'w', F> => ({
  s: [[x0, y0], [x1, y0]], e: [[x1, y0], [x1, y1]], n: [[x1, y1], [x0, y1]], w: [[x0, y1], [x0, y0]],
})
/** Window bays on part of a face: `n` bays between s0 and s1, grouped `g` metres high. */
function bays(f: F, s0: number, s1: number, n: number, z0: number, z1: number, g: number, fill = 0.48) {
  const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1]), t: XY = [(f[1][0] - f[0][0]) / L, (f[1][1] - f[0][1]) / L]
  const a: XY = [f[0][0] + t[0] * s0, f[0][1] + t[1] * s0], b: XY = [f[0][0] + t[0] * s1, f[0][1] + t[1] * s1]
  const pitch = (s1 - s0) / n
  edgePanels(win, a, b, z0, z1, { group: g, gap: 1.3, bay: pitch, pier: pitch * (1 - fill), margin: pitch * (1 - fill) / 2, out: 0.05, min: 1 })
}

// ── The base: eight storeys over the block ──
const BX0 = -76.9, BX1 = 77.0, BY0 = -39.0, BY1 = 39.0
const CY0 = -21.3, CY1 = 17.7 // the entrance court on Berkeley Street
const HW = 31.5, HE = 33.5
box(stone, BX0, -12, BY0, BY1, 0, HW, roof, 0.4)
box(stone, -12, BX1, CY1, BY1, 0, HE, roof, 0.4)
box(stone, -12, BX1, BY0, CY0, 0, HE, roof, 0.4)
box(stone, -12, 57, CY0, CY1, 0, HE, roof, 0.4)
{
  const W = faces(BX0, -12, BY0, BY1)
  bays(W.w, 2, BY1 - BY0 - 2, 17, 3.5, HW - 1.5, 9.3)
  bays(W.n, 2, 62, 14, 3.5, HW - 1.5, 9.3)
  bays(W.s, 3, 63, 14, 3.5, HW - 1.5, 9.3)
  const N = faces(-12, BX1, CY1, BY1), S = faces(-12, BX1, BY0, CY0)
  bays(N.n, 2, 87, 20, 3.5, HE - 1.5, 9.3)
  bays(S.s, 2, 87, 20, 3.5, HE - 1.5, 9.3)
  bays(N.e, 2, BY1 - CY1 - 2, 4, 3.5, HE - 1.5, 9.3)
  bays(S.e, 2, CY0 - BY0 - 2, 4, 3.5, HE - 1.5, 9.3)
  // the court's side walls, beside the colonnade
  bays([[57, CY1], [BX1, CY1]], 14, 19.5, 1, 3.5, HE - 1.5, 9.3)
  bays([[BX1, CY0], [57, CY0]], 0.5, 6, 1, 3.5, HE - 1.5, 9.3)
  bays([[57, CY0], [57, CY1]], 2, CY1 - CY0 - 2, 8, 19, HE - 1.5, 13)
}

// ── The entrance hall and the colonnade ──
const PX0 = 66, PX1 = 70.5
box(stone, 57, PX0, CY0, CY1, 0, 17.5, roof, 0.3)
box(stone, PX0 - 0.1, PX1, CY0, CY1, 10.6, 13.2, roof, 0.3, true)
{
  const n = 10, w = 1.5, span = CY1 - CY0, pitch = (span - w) / (n - 1)
  for (let k = 0; k < n; k++) {
    const y = CY0 + w / 2 + k * pitch
    box(stone, PX1 - 1.6, PX1, y - w / 2, y + w / 2, 0, 10.6, null, 0.2)
  }
  // the doors and the tall glazed screens behind the colonnade
  const E: F = [[PX0, CY0], [PX0, CY1]]
  for (let k = 0; k < n - 1; k++) {
    const s = w / 2 + k * pitch + pitch / 2
    const mid = k === 3 || k === 4 || k === 5
    onWall(win, E[0], E[1], rectShape(s - (pitch - w) / 2 + 0.6, s + (pitch - w) / 2 - 0.6, 1.3, mid ? 9.6 : 9.0), 0.05)
  }
}

// ── The tower ──
const TX0 = -0.5, TX1 = 57, TY0 = -18.3, TY1 = 17.7, TOP = 107.0, WING = 89.2
const WY0 = -24.3, WY1 = 23.7
box(stone, TX0, TX1, TY0, TY1, 0, TOP, null, 0.4)
box(stone, TX0 + 1, TX1, TY1 - 0.2, WY1, 0, WING, roof, 0.4)
box(stone, TX0 + 1, TX1, WY0, TY0 + 0.2, 0, WING, roof, 0.4)
{
  const T = faces(TX0, TX1, TY0, TY1)
  const g = (WING - HE - 2) / 4.5 // groups of about three floors
  // the ends: nine bays above the base, to the carved top floor
  for (const f of [T.e, T.w]) bays(f, 2.2, TY1 - TY0 - 2.2, 9, HE + 2, TOP - 4.5, g)
  // the long faces above the wings
  for (const f of [T.n, T.s]) bays(f, 2.2, TX1 - TX0 - 2.2, 15, WING + 1.5, TOP - 4.5, 12)
  // the wings: one bay on each end, fifteen along
  const WN = faces(TX0 + 1, TX1, TY1, WY1), WS = faces(TX0 + 1, TX1, WY0, TY0)
  bays(WN.n, 2.2, TX1 - TX0 - 3.2, 15, HE + 2, WING - 3, g)
  bays(WS.s, 2.2, TX1 - TX0 - 3.2, 15, HE + 2, WING - 3, g)
  for (const f of [WN.e, WN.w, WS.e, WS.w]) bays(f, 1.2, 4.8, 1, HE + 2, WING - 3, g, 0.55)
  // a cornice at the parapet
  box(stone, TX0 - 0.3, TX1 + 0.3, TY0 - 0.3, TY1 + 0.3, TOP - 1.2, TOP - 0.4, null, 0.2)
}

// ── The stepped pyramid: pale risers, slate-blue treads ──
const STEPS: [number, number, number][] = [ // inset from the ends, from the long faces, top
  [1.5, 2.5, 112.7], [3.5, 4.5, 117.2], [5.5, 6.5, 119.7], [7.5, 8.5, 121.2], [9.5, 10.5, 123.6], [11.5, 12.5, 126.4],
]
{
  let z = TOP
  // the parapet walk at the base of the pyramid
  box(slate, TX0 + 0.4, TX1 - 0.4, TY0 + 0.4, TY1 - 0.4, TOP - 0.4, TOP, slate, 0)
  for (const [ix, iy, top] of STEPS) {
    box(stone, TX0 + ix, TX1 - ix, TY0 + iy, TY1 - iy, z - 0.4, top - 0.6, null, 0)
    box(slate, TX0 + ix - 0.2, TX1 - ix + 0.2, TY0 + iy - 0.2, TY1 - iy + 0.2, top - 0.6, top, slate, 0.25)
    z = top
  }
}

// ── The weather beacon ──
const C: XY = [28.25, -0.3]
const sq = (h: number, z0: number, z1: number, p: Part, top: Part | null = p, bev = 0.2) => box(p, C[0] - h, C[0] + h, C[1] - h, C[1] + h, z0, z1, top, bev)
sq(4.5, 126.3, 128.1, stone)
sq(3.5, 128.1, 131.7, stone)
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const cx = C[0] + sx * 2.85, cy = C[1] + sy * 2.85
  box(stone, cx - 0.8, cx + 0.8, cy - 0.8, cy + 0.8, 128.1, 134.1, stone, 0.15)
  box(stone, cx - 0.5, cx + 0.5, cy - 0.5, cy + 0.5, 134.1, 135.3, stone, 0.12)
}
sq(2.3, 131.7, 143.8, stone)
{
  const Bf = faces(C[0] - 2.3, C[0] + 2.3, C[1] - 2.3, C[1] + 2.3)
  for (const f of [Bf.s, Bf.e, Bf.n, Bf.w]) onWall(neon, f[0], f[1], rectShape(0.75, 3.85, 132.6, 143.2), 0.05)
}
sq(2.75, 143.8, 144.7, stone)
sq(2.0, 144.7, 147.5, stone)
sq(1.5, 147.5, 148.1, stone)
sq(0.8, 148.1, 150.2, slate, slate, 0.1)
revolve(slate, C, [[0.45, 150.2], [0.4, 156], [0.3, 162], [0.2, 168]], 8, Math.PI / 8)

// ── The 1922 Hancock building: skylights round a red tile cross roof ──
box(stone, -62.3, -12.0, -23.4, 25.0, HW - 0.5, 35.6, null, 0.3)
hipRoof(roof, -62.3, -12.0, -23.4, 25.0, 35.6, 40.0, 0)
hipRoof(tile, -60, -16, -7, 5, 38.6, 45.2, 0.3)
hipRoof(tile, -45, -33, -14, 12, 38.6, 45.2, 0.3)
pyramid(tile, [-39, -1], 4.2, 44.0, 49.5)

const height = 168
await save('bos-berkeley-building', 'Berkeley Building', [
  { part: stone, material: finish('berkeley-sandstone', 0xd6cbb8) },
  { part: win, material: PALETTE.window },
  { part: slate, material: finish('berkeley-slate', 0x5d6b7c) },
  { part: roof, material: PALETTE.roof },
  { part: tile, material: PALETTE.terracotta },
  { part: neon, material: finish('neon-beacon-blue', 0x6f93c6) },
], { height, anchor: [42.349702, -71.0735263], bearing: 339.6 })
