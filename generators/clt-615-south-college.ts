/**
 * 615 South College (Regions 615, 2017, John Portman & Associates),
 * Charlotte — original procedural geometry, CC0-1.0.
 * bun generators/clt-615-south-college.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the
 * centroid of the OSM outline way/713125795) on the lowest ground. Placed at
 * bearing 49.3, square to Uptown's grid: -y faces south-west to I-277 and the
 * South Tryon bridge, +y faces The Westin.
 *
 * Identity, in order:
 *  - a 19-storey box of blue glass in pale silver bands, strongly
 *    horizontal;
 *  - two notches cut into its corners: a low one at the south (-x, -y)
 *    corner and a high one at the east (+x, -y) corner, each a two-storey
 *    void with dark glass deep inside;
 *  - a wide, thin, pale flat roof canopy floating over a glassy top floor,
 *    overhanging every face.
 *
 * Evidence:
 *  - OSM: outline way/713125795 (91 m, 19 levels); parts way/1351490869 (the
 *    tower, 82 m, 43 x 55 m), way/1351490870 (12 m strip on the north-east
 *    side), way/1351490871 (10 m wing on the south-east side). Plan from
 *    these.
 *  - Published: 19 floors, 79.1 m to the roof (CTBUH, "615 South College",
 *    https://www.skyscrapercenter.com/building/615-south-college/29961);
 *    completed spring 2017 (Portman, https://www.portmanholdings.com/portfolio/615-south-college/).
 *    Roof taken at 78 m, the canopy's top at 81.5 m (OSM's 82 m tower part);
 *    OSM's 91 m on the outline matches nothing in the photos and is not used.
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17), while the
 *    tower was being built; not used.
 *  - Terrain (Mapterhorn): about 2 m of fall across the site; elevation 0.
 *  - Photos (Wikimedia Commons, daylight):
 *    "615 S College building.jpg" (Jt12081988, CC BY-SA 4.0, from the
 *    south-west on completion: both notches, the bands, the canopy,
 *    https://commons.wikimedia.org/wiki/File:615_S_College_building.jpg);
 *    "615 Regions viewed from South Tryon St bridge Mid-September 2025.jpg"
 *    (City Dweller 2, CC BY-SA 4.0, from the south: the high notch, the
 *    canopy, the glassy top floor,
 *    https://commons.wikimedia.org/wiki/File:615_Regions_viewed_from_South_Tryon_St_bridge_Mid-September_2025.jpg).
 *    No commercial imagery. No look-only sources.
 *
 * Estimated: the lobby 6 m and the floors 4.0 m (78 m over 19 storeys);
 * window panels grouped two storeys deep with a pale band between (the real
 * bands come every storey: grouped per STYLE.md); the notches' size (the low one 24 m,
 * about half the south-west face, the high one 11 m, a quarter; both 8 m
 * round the corner, two storeys, 3 m deep glass) and heights (storeys 4-5
 * and 11-12, z 14-22 and 46-54), scaled and counted in Jt12081988's photo
 * (corrected on the second pass from 14 m / 15 m and storeys 13-14); the
 * canopy's 2.5 m overhang and 1 m edge.
 * OSM's parking deck way/1351490868 (5 m, a separate building) is drawn
 * under the 10 m wing; the model covers 36 % of it and does not replace it.
 * Doubts: the north-east and north-west faces are unphotographed and drawn
 * plain; the low wing's facades are not photographed.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, onWall, panel, save, walls, inset, type XY } from './chi-aon-center'

const BEARING = 49.3
const ANCHOR: [number, number] = [35.221516, -80.8480876]

const band = new Part(), glass = new Part(), deep = new Part(), roof = new Part(), topGlass = new Part()

const X0 = -27.8, X1 = 15.5, Y0 = -28.5, Y1 = 26.7
const LOBBY = 6, GROUP = 8, ROOF = 78
const rows: [number, number][] = [[0.6, LOBBY - 0.6]]
for (let z = LOBBY; z + GROUP <= ROOF + 0.01; z += GROUP) rows.push([z + 0.7, z + GROUP - 0.6])

/** A layer of the tower from z0 to z1 with plan ring r: walls and ribbon windows. */
function layer(r: XY[], z0: number, z1: number) {
  walls(band, r, z0, z1)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], { L } = onWall(a, b)
    if (L < 4) continue
    for (const [q0, q1] of rows) {
      const lo = Math.max(q0, z0 + 0.3), hi = Math.min(q1, z1 - 0.3)
      if (hi - lo > 1) panel(glass, a, b, 0.6, L - 0.6, lo, hi)
    }
  }
}
const full: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
// notches: low at (-x, -y), storeys 4-5 (14..22); high at (+x, -y), storeys 11-12 (46..54)
const LOW: [number, number] = [14, 22], HIGH: [number, number] = [46, 54]
const lowR: XY[] = [[X0 + 24, Y0], [X1, Y0], [X1, Y1], [X0, Y1], [X0, Y0 + 8], [X0 + 24, Y0 + 8]]
const highR: XY[] = [[X0, Y0], [X1 - 11, Y0], [X1 - 11, Y0 + 8], [X1, Y0 + 8], [X1, Y1], [X0, Y1]]
layer(full, 0, LOW[0])
layer(lowR, LOW[0], LOW[1])
layer(full, LOW[1], HIGH[0])
layer(highR, HIGH[0], HIGH[1])
layer(full, HIGH[1], ROOF)

/** The void in a notch: its floor (terrace), soffit, and dark glass 3 m in. */
function notch(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const R: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  cap(roof, R, z0)
  cap(band, R, z1, false)
  // dark glass: a box 3 m inside the notch's open faces
  const g: XY[] = [[x0 + (x0 === X0 ? 3 : 0), y0 + 3], [x1 - (x1 === X1 ? 3 : 0), y0 + 3], [x1 - (x1 === X1 ? 3 : 0), y1], [x0 + (x0 === X0 ? 3 : 0), y1]]
  walls(deep, g, z0, z1)
  // the notch's inner corner walls behind the glass are left out: hidden
}
notch(X0, X0 + 24, Y0, Y0 + 8, LOW[0], LOW[1])
notch(X1 - 11, X1, Y0, Y0 + 8, HIGH[0], HIGH[1])

// --- Roof: glassy top floor set in 2.5 m, and the floating canopy.
cap(roof, full, ROOF)
{
  const T = inset(full, 2.5)
  walls(topGlass, T, ROOF, 80.5)
  const C: XY[] = [[X0 - 2.5, Y0 - 2.5], [X1 + 2.5, Y0 - 2.5], [X1 + 2.5, Y1 + 2.5], [X0 - 2.5, Y1 + 2.5]]
  const Cl = inset(C, 2.0) // the soffit tapers up to a thin edge
  walls(band, C, 81.0, 81.5)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    band.quad([Cl[i][0], Cl[i][1], 80.5], [Cl[j][0], Cl[j][1], 80.5], [C[j][0], C[j][1], 81.0], [C[i][0], C[i][1], 81.0])
  }
  cap(band, Cl, 80.5, false)
  cap(roof, C, 81.5)
}

// --- Low parts: the 12 m strip (way/1351490870) and the 10 m wing (way/1351490871).
for (const [r, h] of [
  [[[-23.0, 26.7], [15.6, 26.7], [15.4, 29.5], [13.1, 29.5], [13.1, 30.7], [-23.0, 30.8]] as XY[], 12],
  [[[15.5, -28.5], [29.1, -28.5], [29.0, 22.2], [15.5, 22.2]] as XY[], 10],
] as [XY[], number][]) {
  walls(band, r, 0, h)
  cap(roof, r, h)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], { L } = onWall(a, b)
    if (L < 6) continue
    panel(glass, a, b, 1.0, L - 1.0, 1.0, h - 1.6)
  }
}

if (import.meta.main) {
  await save('clt-615-south-college', '615 South College', ANCHOR, BEARING, [
    { part: band, material: finish('regions-615-band', 0xd6dcdf) },
    { part: glass, material: { ...PALETTE.window, color: 0x7d9cb8 } },
    { part: deep, material: windowVariant(2, 0x56687a) },
    { part: topGlass, material: windowVariant(3, 0xa3bdd0) },
    { part: roof, material: PALETTE.roof },
  ])
}
