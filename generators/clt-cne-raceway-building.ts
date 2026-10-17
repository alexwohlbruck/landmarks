/**
 * Camp North End: the Raceway Building — procedural, CC0-1.0.
 * bun generators/clt-cne-raceway-building.ts
 *
 * The long, low brick building on the Ford plant's parcel between the
 * Boileryard and Hercules South (`clt-cne-hercules-south.ts`), 1824
 * Statesville Avenue, Suite 100; Camp North End's "Raceway Bldg"
 * (17,000 sq ft), now small shops and a bar along The Raceway. It stands on
 * the edge of the old rail yard: its south front is a single storey at the
 * level of the Boileryard, its north side drops some four metres to the
 * tracks' level, where it had loading doors on a raised dock. Four roof
 * lengths at slightly different heights, a white membrane roof with a short
 * overhang on the south.
 *
 * Evidence:
 *  - OSM: way/324611745 (height 5, named "Camp North End Boileryard
 *    Building" in OSM; the brochure and the county address name it the
 *    Raceway Building). The shops mapped along its south face (Canteen,
 *    Thrift Pony, Wily, galleries) are nodes, not parts.
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m (measured, NAVD88):
 *    ground 224.7–225.1 along the south front, 220.7–220.9 on the north
 *    (the rail level; y = 0 is 220.8), with an earth bank rising to 224.7
 *    against the north wall's middle third; roofs, west to east, 229.8
 *    (x −70…−54, parapet 230.2), 229.3 (−54…−14), 230.4 (−14…34), 229.6
 *    (34…67); the roof reaching about 1.7 m past the OSM south wall at
 *    230.3–230.9.
 *  - Mecklenburg County tax parcel 07903105 (the Ford parcel): improvements
 *    dated 1924, 1939 and 1956, face brick, one storey; which date is this
 *    building's is not recorded.
 *  - Camp North End leasing brochures (2021, 2023, camp.nc): "Raceway
 *    Building 17,000 sq ft"; the 2023 site rendering places "Raceway Bldg"
 *    here (look-only; name only).
 *  - USGS NAIP orthophoto (public domain): the white roof and its steps.
 *
 * No licensed photo was found (Commons, Openverse, Mapillary). Estimated:
 * the brick (the campus Kahn brick), the shopfront bays (one glazed bay per
 * 6.1 m between brick piers, sill at the south grade), the north loading
 * doors (one per 12.2 m where the wall stands clear of the bank), the overhang's
 * depth. Invented: the high window over each north door and the window pairs
 * in the end walls. The
 * building's date and original use are unknown; it is modelled as it stands.
 *
 * Frame: the Ford plant's grid (`clt-cne-hercules-south.ts`); placement
 * bearing 6.3. The origin is the outline's centroid, lng −80.8327406,
 * lat 35.2476582.
 */
import { Part } from './mesh'
import { PALETTE } from './palette'
import { type XY } from './clt-cne-ford-plant'
import { BRICK, WHITE_ROOF, block, canopy, onWall, write, type Built } from './clt-cne-hercules-south'

/** The south front's grade above y = 0 (lidar 224.8 m). */
const SOUTH = 4.0
const Y0 = -6.3, Y1 = 5.9, RECESS = -3.3
/** Roof lengths: x from, x to, parapet top above y = 0 (lidar). */
const LENGTHS: [number, number, number][] = [[-70.4, -54.0, 9.4], [-54.0, -14.0, 8.8], [-14.0, 34.0, 9.9], [34.0, 66.8, 9.1]]

export function buildRaceway(): Built {
  const wall = new Part(), trim = new Part(), win = new Part(), white = new Part(), grey = new Part()

  for (const [x0, x1, top] of LENGTHS) {
    // The south recess (OSM) between x −45.7 and −17.1.
    const ring: XY[] = x0 === -54.0
      ? [[x0, Y0], [-45.7, Y0], [-45.7, RECESS], [-17.1, RECESS], [-17.1, Y0], [x1, Y0], [x1, Y1], [x0, Y1]]
      : [[x0, Y0], [x1, Y0], [x1, Y1], [x0, Y1]]
    block({ wall, coping: trim, deck: white }, ring, 0, top, 0.4)
    // The overhang on the south, over the shopfronts.
    if (x0 !== -54.0) canopy(white, grey, x0, x1, Y0 - 1.7, Y0, top - 0.1, null)
  }

  // South front: shopfront glazing between brick piers, from the grade up.
  const south: [XY, XY][] = [[[-70.4, Y0], [-45.7, Y0]], [[-45.7, RECESS], [-17.1, RECESS]], [[-17.1, Y0], [66.8, Y0]]]
  for (const [A, B] of south) {
    const f = onWall(A, B), n = Math.max(1, Math.round(f.L / 6.1)), w = f.L / n
    for (let k = 0; k < n; k++) f.panel(win, k * w + 0.7, (k + 1) * w - 0.7, SOUTH + 0.4, SOUTH + 3.4)
  }
  // North side: loading doors where the wall stands clear of the bank, and
  // a high band of windows over them.
  {
    const f = onWall([66.8, Y1], [-70.4, Y1])
    for (let a = 6.1; a < f.L - 3; a += 12.2) {
      const x = 66.8 - a
      if (x > -14 && x < 34) continue
      f.panel(grey, a - 1.8, a + 1.8, 1.4, 4.8)
      f.panel(win, a - 1.8, a + 1.8, 5.6, 7.4)
    }
  }
  // End walls: a window pair high on each.
  for (const [A, B] of [[[66.8, Y0], [66.8, Y1]], [[-70.4, Y1], [-70.4, Y0]]] as [XY, XY][]) {
    const f = onWall(A, B)
    f.panel(win, 1.6, f.L / 2 - 0.6, 5.0, 7.4)
    f.panel(win, f.L / 2 + 0.6, f.L - 1.6, 5.0, 7.4)
  }

  return {
    id: 'clt-cne-raceway-building', name: 'Raceway Building, Camp North End', height: 9.9, bearing: 6.3,
    parts: [
      { part: wall, material: BRICK },
      { part: trim, material: PALETTE.trim },
      { part: win, material: PALETTE.window },
      { part: white, material: WHITE_ROOF },
      { part: grey, material: PALETTE.roof },
    ],
  }
}

if (import.meta.main) await write(buildRaceway())
