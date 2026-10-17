/**
 * Camp North End: 200 Camp Road — procedural, CC0-1.0.
 * bun generators/clt-cne-200-camp-road.ts
 *
 * A small one-storey depot building of the 1940s–50s at the east end of
 * Camp Road, beside the railway, now retail (Camp North End's "200 Camp Rd,
 * 3,200 sq ft"). A flat-roofed box with a lower flat-roofed wing on its west
 * side.
 *
 * Evidence:
 *  - OSM: way/324612144 (height 5) and its parts way/835850352 (the box,
 *    height 5) and way/835850353 (the west wing, min_height 4.9: a roof).
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 0.5 m (measured, NAVD88):
 *    ground 226.5 on the west (y = 0), 227.7 on the east; the box's roof
 *    231.7 (5.2 m), flat; the wing 231.2 (4.7 m).
 *  - Mecklenburg County tax parcel 07903102 (CAMP LANDOWNER LP): one storey,
 *    improvements dated 1943–1955, concrete block, face brick and aluminium
 *    siding; which is this building's is not recorded.
 *  - USGS NAIP orthophoto (public domain): the dark grey roof of the box, the
 *    plan.
 *
 * No licensed photo was found (Commons, Openverse, Mapillary). The brick
 * walls are estimated (the parcel lists face brick among its finishes); the
 * windows (one broad panel per bay on the long sides), the end doors and the
 * wing's posts are invented. Built because the lead's list named it; at its size
 * it reads little more than the map's own extrusion.
 *
 * Frame: the building's own grid; x along bearing 129.2°, y along 39.2°;
 * placement bearing 39.2. The origin is the outline's centroid,
 * lng −80.8310415, lat 35.2473435.
 */
import { Part } from './mesh'
import { PALETTE } from './palette'
import { box } from './clt-cne-ford-plant'
import { BRICK, DARK_ROOF, block, canopy, onWall, write, type Built } from './clt-cne-hercules-south'

export function build200Camp(): Built {
  const wall = new Part(), trim = new Part(), win = new Part(), roof = new Part(), grey = new Part()
  const X0 = -4.1, X1 = 7.6, Y0 = -13.5, Y1 = 11.5, TOP = 5.4

  block({ wall, coping: trim, deck: roof }, [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]], 0, TOP, 0.3)
  // The west wing: a roof on posts over x −12.7…−4.1, y 1.0…8.2.
  canopy(grey, grey, -12.7, X0, 1.0, 8.2, 4.7, null)
  for (const y of [1.3, 4.6, 7.9]) box(grey, -12.6, -12.3, y - 0.15, y + 0.15, 0, 4.3, null)

  // Windows: a broad panel per bay on the long sides, a door bay on each end.
  for (const [A, B] of [[[X1, Y0], [X1, Y1]], [[X0, Y1], [X0, Y0]]] as [[number, number], [number, number]][]) {
    const f = onWall(A, B), n = 4, w = f.L / n
    for (let k = 0; k < n; k++) f.panel(win, k * w + 0.8, (k + 1) * w - 0.8, 1.0, 3.6)
  }
  for (const [A, B] of [[[X0, Y0], [X1, Y0]], [[X1, Y1], [X0, Y1]]] as [[number, number], [number, number]][]) {
    const f = onWall(A, B)
    f.panel(grey, f.L / 2 - 1.6, f.L / 2 + 1.6, 0.0, 3.4)
  }

  return {
    id: 'clt-cne-200-camp-road', name: '200 Camp Road, Camp North End', height: TOP, bearing: 39.2,
    parts: [
      { part: wall, material: BRICK },
      { part: trim, material: PALETTE.trim },
      { part: win, material: PALETTE.window },
      { part: roof, material: DARK_ROOF },
      { part: grey, material: PALETTE.roof },
    ],
  }
}

if (import.meta.main) await write(build200Camp())
