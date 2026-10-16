/**
 * Camp North End: the gabled shed by The Crossroad — procedural, CC0-1.0.
 * bun generators/clt-cne-crossroad-shed.ts
 *
 * A small one-storey outbuilding of the Army depot on the east side of the
 * campus, where The Crossroad meets the railway: a gabled hall with a lower
 * lean-to along its east side, under a pale metal roof. Its name and use are
 * not recorded; OSM gives it the address 1836 Statesville Avenue.
 *
 * Evidence:
 *  - OSM: way/324608641 (height 6) and its parts way/835850905 (gabled,
 *    height 6, roof height 2) and way/835850906 (skillion, height 4, roof
 *    height 1).
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 0.5 m (measured, NAVD88):
 *    ground about 226.5 round it (y = 0); the ridge 233.0 (6.5 m) running
 *    along the hall's length; the west eaves 231.6 (5.1 m); the east slope
 *    falling to 231.3 (4.8 m) at the lean-to, which falls on to 230.4
 *    (3.9 m) at its outer wall.
 *  - Mecklenburg County tax parcel 07903101 (CAMP LANDOWNER LP): improvements
 *    dated 1943 and 1987; which is this building's is not recorded.
 *  - USGS NAIP orthophoto (public domain): the pale grey metal roof, the
 *    plan.
 *
 * No licensed photo was found (Commons, Openverse, Mapillary). The brick
 * walls (the campus brick), the windows and the door are invented. Built
 * because the lead's list named it (298 m², at the survey's size limit).
 *
 * Frame: the building's own grid; x along bearing 121.8°, y along 31.8°;
 * placement bearing 31.8. The origin is the outline's centroid,
 * lng −80.8305513, lat 35.2480828.
 */
import { Part } from './mesh'
import { PALETTE } from './palette'
import { box, quad, tri } from './clt-cne-ford-plant'
import { BRICK, gableRoof, onWall, write, type Built } from './clt-cne-hercules-south'

export function buildCrossroadShed(): Built {
  const wall = new Part(), trim = new Part(), win = new Part(), roof = new Part()
  const X0 = -8.0, XR = 2.0, X1 = 8.0, Y0 = -9.4, Y1 = 9.4
  const EAVE = 5.0, RIDGE = 6.5, LEAN = 3.9

  // The hall: brick walls to the eaves, its gable ends, the ridge along y.
  box(wall, X0, XR, Y0, Y1, 0, EAVE, null)
  gableRoof(roof, wall, X0, XR, Y0, Y1, EAVE, RIDGE, false, 0.4)
  // The lean-to on the east, its roof continuing the slope more gently.
  box(wall, XR, X1, Y0, Y1, 0, LEAN, null)
  const hi = EAVE - 0.3
  quad(roof, [XR, Y0 - 0.4, hi], [X1 + 0.4, Y0 - 0.4, LEAN], [X1 + 0.4, Y1 + 0.4, LEAN], [XR, Y1 + 0.4, hi])
  quad(roof, [XR, Y1 + 0.4, hi], [X1 + 0.4, Y1 + 0.4, LEAN], [X1 + 0.4, Y0 - 0.4, LEAN], [XR, Y0 - 0.4, hi], [0, 0, -1])
  for (const [y, s] of [[Y0, -1], [Y1, 1]] as [number, number][]) tri(wall, [XR, y, LEAN], [X1, y, LEAN], [XR, y, hi], [0, s, 0])

  // Windows along the hall's west side, a pair in each end; the door on the south.
  {
    const f = onWall([X0, Y1], [X0, Y0])
    for (const a of [2.0, 7.1, 12.2]) f.panel(win, a, a + 3.6, 1.4, 3.8)
  }
  for (const [A, B] of [[[X0, Y0], [XR, Y0]], [[XR, Y1], [X0, Y1]]] as [[number, number], [number, number]][]) {
    const f = onWall(A, B)
    f.panel(win, 1.2, 3.6, 1.6, 3.8)
    f.panel(win, f.L - 3.6, f.L - 1.2, 1.6, 3.8)
  }
  onWall([XR, Y0], [X1, Y0]).panel(trim, 1.2, 4.6, 0, 3.2)

  return {
    id: 'clt-cne-crossroad-shed', name: 'Crossroad shed, Camp North End', height: RIDGE, bearing: 31.8,
    parts: [
      { part: wall, material: BRICK },
      { part: trim, material: PALETTE.trim },
      { part: win, material: PALETTE.window },
      { part: roof, material: PALETTE.roof },
    ],
  }
}

if (import.meta.main) await write(buildCrossroadShed())
