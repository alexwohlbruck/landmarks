/**
 * One South at The Plaza (101 S Tryon St; built 1974 as NCNB Plaza, long
 * known as Bank of America Plaza), Charlotte — original procedural geometry,
 * CC0-1.0.
 * bun generators/clt-101-south-tryon.ts
 *
 * Name: Wikipedia's article "One South at The Plaza" (formerly the Bank of
 * America Plaza): 503 ft / 153 m, 40 storeys, the city's tallest 1974-1987.
 * City Dweller 2's 2023 Commons photo is filed under the new name too.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the
 * centroid of the OSM outline way/90480712, "One South") on the lowest
 * ground. Placed at bearing 46.55, square to Uptown's grid: +y runs up
 * Tryon toward Trade Street, +x toward College Street.
 *
 * Identity:
 *  - a plain dark glass shaft, 40 storeys, flat-topped, its curtain wall a
 *    fine bronze grid (every photo);
 *  - its plan, a square with two opposite corners cut off: lidar shows a
 *    35 m chamfer on the north-east corner (OSM has it too) and a 33 m one
 *    on the south-west corner, where a sloping glass atrium roof fills the
 *    corner of the lot (OSM draws the corner square);
 *  - the low glass atrium at the Tryon/plaza corner and the cream retail
 *    base of the 2020s renovation, capped by a projecting cream canopy band
 *    (Jt12081988's photo; Algorhythms' photo from the Square).
 *
 * Evidence:
 *  - OSM way/90480712 (building=office, "One South", height=78: wrong).
 *    The tagged sliver way/985168244 next to it is not this building.
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17), 1 m grid.
 *    Street 2.6 m above the box's lowest return. Parapet 155.4 → 152.8 m
 *    above the street (published 153 m: Wikipedia); roof 151.9 m; a
 *    plant box over the middle to 157 m. Atrium roof: 14.9 m along the
 *    chamfer, falling about 0.4 m per metre to ~6.5 m at the lot corner.
 *  - Photos (Wikimedia Commons, daylight, all CC BY-SA 4.0 or CC BY 2.0):
 *    "One South at The Plaza December 2023.jpg" (City Dweller 2, CC BY-SA
 *    4.0, from the south-east on Tryon,
 *    https://commons.wikimedia.org/wiki/File:One_South_at_The_Plaza_December_2023.jpg);
 *    "BofA plaza.jpg" (Jt12081988 at English Wikipedia, CC BY-SA 4.0, the
 *    grid and the cream base, https://commons.wikimedia.org/wiki/File:BofA_plaza.jpg);
 *    "Bank of America Plaza with Bank of America Corporate Center
 *    reflection.jpg" (Ron Miguel, CC BY 2.0, the top and the chamfer,
 *    https://commons.wikimedia.org/wiki/File:Bank_of_America_Plaza_with_Bank_of_America_Corporate_Center_reflection.jpg);
 *    "Independence Square—Intersection of Trade and Tryon Streets.jpg"
 *    (Algorhythms, CC BY-SA 4.0, the base at the Square,
 *    https://commons.wikimedia.org/wiki/File:Independence_Square%E2%80%94Intersection_of_Trade_and_Tryon_Streets.jpg).
 *    No commercial imagery or 3D tiles; no look-only sources.
 *
 * Estimated: the grid (3.3 m bays, three storeys a panel, from the photos'
 * 1.5 m mullions doubled); the base band 9 m (two storeys, photos); the
 * plant box's plan (lidar, coarse). Colours: the glass reads dark blue-grey
 * with bronze mullions; pulled to the palette's lightness.
 *
 * Doubts: the atrium's outer walls are read only from lidar (trees cover
 * them in every photo); the plaza and the Overstreet Mall bridges are left
 * out.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { bays, cap, inset, panel, parapetRoof, rect, rows, save, walls, type XY } from './chi-aon-center'

const BEARING = 46.55
const ANCHOR: [number, number] = [35.2265277, -80.8433515]

const frame = new Part(), glass = new Part(), base = new Part(), roof = new Part(), atrium = new Part()

const TOP = 152.8, BASE = 9, FLOOR = 3.8
// Tower plan (lidar, OSM where they agree), counter-clockwise.
const T: XY[] = [[-23, 5], [5, -24.5], [30.3, -24.5], [30.2, 0.7], [25.2, 5.5], [0.7, 31.5], [-22.8, 30.8]]

// --- The shaft: bronze frame wall, glass panels three storeys high.
walls(base, T, 0, BASE)
walls(frame, T, BASE, TOP)
parapetRoof(frame, roof, T, TOP, 0.5, 0.9)
// Groups of about three storeys filling the shaft to just under the
// parapet: the real glass runs to the roof line with no band above it.
const NG = Math.round((TOP - 0.7 - BASE) / (3 * FLOOR))
const groups: [number, number][] = rows(BASE + 0.2, TOP - 0.5, NG, 0.4)
bays(glass, T, groups, { bay: 3.3, gap: 0.3, end: 0.4, minLen: 2 })
// Base: tall shopfronts between cream piers.
bays(glass, T, [[0.6, BASE - 1.4]], { bay: 5.5, gap: 1.4, end: 1.2, minLen: 6 })

// The cream canopy band capping the renovated base (Jt12081988's photo):
// a 0.9 m deep projecting slab, 1.4 m thick.
{
  const C = inset(T, -0.9)
  walls(base, C, BASE - 1.4, BASE)
  cap(base, C, BASE)
  cap(base, C, BASE - 1.4, false)
}

// --- Plant box on the roof.
{
  const P: XY[] = rect(-4, -2, 12, 8)
  walls(roof, P, TOP - 0.9, TOP + 4.2)
  cap(roof, P, TOP + 4.2)
}

// --- The atrium in the south-west corner: a sloping glass roof from the
// shaft down to the lot corner, glass walls on the two street sides.
{
  const A: XY = [-24.2, 5], B: XY = [-25.5, -24.5], C: XY = [5, -24.5]
  const hi = 14.9, lo = 6.5
  const h = (p: XY) => {
    // height falls with distance from the chamfer line A–C
    const d = Math.abs((p[0] - A[0]) * (C[1] - A[1]) - (p[1] - A[1]) * (C[0] - A[0])) / Math.hypot(C[0] - A[0], C[1] - A[1])
    return hi - (hi - lo) * d / 21.6
  }
  // roof (A, B, C counter-clockwise from above? A→B→C turns left)
  atrium.tri([A[0], A[1], h(A)], [B[0], B[1], h(B)], [C[0], C[1], h(C)])
  // street walls: frame mullions every 4 m over glass
  for (const [p, q] of [[A, B], [B, C]] as [XY, XY][]) {
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]), n = Math.round(L / 4)
    for (let k = 0; k < n; k++) {
      const s0 = k / n, s1 = (k + 1) / n
      const P0: XY = [p[0] + (q[0] - p[0]) * s0, p[1] + (q[1] - p[1]) * s0], P1: XY = [p[0] + (q[0] - p[0]) * s1, p[1] + (q[1] - p[1]) * s1]
      glass.quad([P0[0], P0[1], 0], [P1[0], P1[1], 0], [P1[0], P1[1], h(P1)], [P0[0], P0[1], h(P0)])
      const m: XY = P0, w = 0.25 / L
      const M1: XY = [m[0] + (q[0] - p[0]) * w, m[1] + (q[1] - p[1]) * w]
      // a pale mullion at each joint, just proud of the glass
      panel(base, m, M1, 0, Math.hypot(M1[0] - m[0], M1[1] - m[1]), 0, Math.min(h(P0), h(M1)) - 0.05, 0.06)
    }
  }
}

if (import.meta.main) {
  await save('clt-101-south-tryon', 'One South at The Plaza', ANCHOR, BEARING, [
    { part: frame, material: finish('one-south-bronze', 0x766e63) },
    { part: glass, material: { ...PALETTE.window, color: 0x667c91 } },
    { part: base, material: finish('one-south-base', 0xe7dfd2) },
    { part: roof, material: PALETTE.roof },
    { part: atrium, material: { ...PALETTE.glass, color: 0x8fb0c6 } },
  ])
}
