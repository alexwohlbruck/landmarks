/**
 * Camp North End: 330 Camp Road — procedural, CC0-1.0.
 * bun generators/clt-cne-330-camp-road.ts
 *
 * A one-storey flat-roofed outbuilding of the Army depot, between the Ford
 * plant's south-west corner and the south warehouses, set square to the Ford
 * plant's grid rather than the warehouses'; restaurants since the 2019
 * renovation. Its little neighbour at the east end is
 * `clt-cne-generals-office`. A plain brick box 49 × 26 m with a bump on its
 * south side, a pale coping, a white roof.
 *
 * Identity: none beyond being one of the campus's original low brick
 * buildings; it is modelled because the campus set is wanted whole.
 *
 * Evidence:
 *  - OSM: way/324608444 (building=commercial, height 4, addr 330 Camp
 *    Road). No parts.
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m (measured, NAVD88):
 *    roof 232.0 across the whole footprint; ground 228.0–228.4 on the south
 *    and west, falling to 227.0 along the north wall (y = 0 is 227.0, so the
 *    south wall stands 3.8 m and the north 5.0 m).
 *  - Mecklenburg County tax parcel 07903102 (CAMP LANDOWNER LP): its
 *    buildings date 1943–1955 (face brick, concrete block); which year is
 *    this one's is not recorded per building.
 *  - Camp North End leasing brochure (2021, camp.nc): "330 Camp Road",
 *    10,000 sq ft.
 *  - 2019 C-M Historic Landmarks designation report (MacRostie): the depot
 *    added "an assortment of smaller buildings, including a free-standing
 *    cafeteria and a dwelling for Army staff"; whether this is the cafeteria
 *    is not confirmed.
 *  - USGS NAIP orthophoto (public domain): the white roof, a dark recess at
 *    the west end.
 *
 * No licensed photo was found (Mapillary has nothing inside the campus).
 * Estimated or invented: the brick (the campus's), the windows and their
 * spacing, the plinth; kept plain.
 *
 * Frame: the Ford plant's grid (x along bearing 96.3°, y along 6.3°),
 * placement bearing 6.3; origin at the outline's centroid, lng −80.8337665,
 * lat 35.2464025. Kit: `clt-cne-301-camp-road.ts`.
 */
import { write } from './clt-cne-hercules-south'
import { mass, mats, out, plinth, windows } from './clt-cne-301-camp-road'

const TOP = 5.0
const RING: [number, number][] = [[23.5, -2.7], [20.4, -2.7], [20.4, -14.8], [6.2, -14.8], [6.2, -10.6], [-20.1, -10.6], [-20.1, -4.6], [-25.4, -4.6], [-25.4, 11.2], [23.5, 11.2]]

export function build330() {
  const m = mats()
  mass(m, RING, TOP, 0.4)
  // South face (the plaza side): windows over a low plinth.
  windows(m, [-20.1, -10.6], [6.2, -10.6], { a0: 1, a1: 25, n: 5, w: 3.0, z0: 1.4, z1: 3.6, awning: 1.4 })
  windows(m, [6.2, -14.8], [20.4, -14.8], { a0: 1, a1: 13, n: 3, w: 3.0, z0: 1.4, z1: 3.6, awning: 1.4 })
  windows(m, [-25.4, -4.6], [-20.1, -4.6], { n: 1, w: 2.6, z0: 1.4, z1: 3.6 })
  // West end: the recess NAIP shows, drawn as a dark opening.
  windows(m, [-25.4, 11.2], [-25.4, -4.6], { a0: 3, a1: 13, n: 1, w: 7.0, z0: 1.4, z1: 3.8, pane: m.dark })
  // North (towards the Ford plant): a row of windows, the wall taller here.
  windows(m, [23.5, 11.2], [-25.4, 11.2], { a0: 2, a1: 47, n: 7, w: 2.4, z0: 2.4, z1: 4.2 })
  windows(m, [20.4, -2.7], [23.5, -2.7], { n: 1, w: 1.6, z0: 1.4, z1: 3.4 })
  for (const [A, B] of [[[-20.1, -10.6], [6.2, -10.6]], [[6.2, -14.8], [20.4, -14.8]], [[-25.4, -4.6], [-20.1, -4.6]], [[23.5, 11.2], [-25.4, 11.2]]] as [number, number][][]) plinth(m, A as [number, number], B as [number, number], 1.0)
  return out(m, 'clt-cne-330-camp-road', '330 Camp Road, Camp North End', TOP, 6.3)
}

if (import.meta.main) await write(build330())
