/**
 * Camp North End: 201 Camp Road — procedural, CC0-1.0.
 * bun generators/clt-cne-201-camp-road.ts
 *
 * The north-east half of the Army Quartermaster Corps' Building No. 5
 * (1941–43), the longest of the depot's south warehouses (1,200 ft and ten
 * monitors when whole, as the 2016 lidar still shows it); its middle bay is
 * `clt-cne-701-keswick` and its south-west end was taken down for Kinship
 * East and the parking garage. Renovated as offices in 2021. A one-storey
 * red-brick box 55 × 184 m, taller than its neighbours (9.8 m to the deck),
 * five corrugated-metal clerestory monitors across its width at 36.6 m
 * spacing, low brick annexes and a canopy in the recesses of its north-west
 * side, a loading platform under a canopy along the railway on the
 * south-east.
 *
 * Identity: the long red brick box with five evenly spaced monitors across
 * its white roof, the tallest of the south warehouses.
 *
 * Evidence:
 *  - OSM: the outline way/324608496 and its 17 parts: monitors
 *    way/835808920, 835808923, 835808925, 835808928, 835808931 (height
 *    10.4); main roof 835808919, 835808922, 835808924, 835808927,
 *    835808930, 835808932 (8.2); the west bump 835808926 (7.5); annexes and
 *    canopy 835808918, 835808929, 835844005, 1108286803 (5.2); the
 *    railway platform 835808921 (1).
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m (measured, NAVD88):
 *    ground 227.5–228.6, mostly 228.1 (y = 0 is 227.5, at the north-east
 *    end); deck 237.3 (9.8 m); monitors 240.1 (12.6 m), each 14 m wide;
 *    annexes, canopy and the railway canopy 234.0 (6.5 m); the bump 235.1
 *    (7.6 m). OSM's heights are each about 1.5 m low; the lidar is followed.
 *  - C-M Historic Landmarks Commission survey report (2017,
 *    landmarkscommission.org/wp-content/uploads/2017/06/Ford-Motor-Co-Plant-SR.pdf),
 *    Buildings Nos. 4–6 (published): brick in common bond, 180 ft wide,
 *    corrugated-metal clerestory monitors across the width, "ten monitors on
 *    building No. 5", which "sprawls back 1200 feet".
 *  - Mecklenburg County tax parcel 07903C99 (CAMP 201 PROPERTY OWNER LP):
 *    built 1943, face brick. Camp North End leasing brochure (2021,
 *    camp.nc): "201 Camp Road", 115,000 sq ft, Phase 2.
 *  - USGS NAIP orthophoto (public domain): the white roofs, rust-streaked,
 *    the dark annex roofs and canopies on the north-west side.
 *
 * No licensed photo of this building was found (Commons, Openverse and
 * Mapillary have nothing inside the campus). So:
 *  - the brick, the monitors' cladding and glazing and the plinth are taken
 *    from its siblings, 301 Camp Road (Commons photos) and 1720 Statesville
 *    Avenue (Mapillary) — estimated;
 *  - the windows are invented: two tiers on the north-west and north-east
 *    faces, as on 701 Keswick's end wall (the one partial photo of
 *    Building No. 5, in File:Free_Range_Brewing_Camp_North_End_in_the_301_Camp_building_Early_June_2025.jpg,
 *    City Dweller 2, CC BY-SA 4.0), loading doors along the railway;
 *  - the annexes' walls are drawn in the same brick.
 *
 * Frame and kit: `clt-cne-301-camp-road.ts`. y along the long axis (bearing
 * 39.34°), placement bearing 39.34; origin at the outline's centroid,
 * lng −80.8323195, lat 35.2463603.
 */
import { type XY } from './clt-cne-ford-plant'
import { onWall, write } from './clt-cne-hercules-south'
import { mass, mats, monitor, out, platform, plinth, rect, shed, windows } from './clt-cne-301-camp-road'

const TOP = 10.2, DECK = 9.8, MON = 12.6, LOW = 6.5, PLINTH = 1.2
const X0 = -29.3, X1 = 25.6, Y0 = -93.1, Y1 = 90.5

export function build201() {
  const m = mats()
  mass(m, [[-17.9, Y0], [X1, Y0], [X1, Y1], [X0, Y1], [X0, 53.2], [-16.8, 53.2], [-16.8, 16.8], [X0, 16.8], [X0, -57.3], [-17.9, -57.3]], TOP, TOP - DECK)
  mass(m, rect(-33.6, X0, -37.7, -4.2), 7.6)
  mass(m, rect(X0, -17.9, Y0, -57.3), LOW)
  mass(m, rect(X0, -16.8, 38.8, 53.2), LOW)
  shed(m, -23.8, -16.8, 16.8, 38.8, LOW, -23.5)

  for (const [x0, y0, y1] of [[-17.9, -81.6, -70.4], [X0, -44.6, -30.6], [X0, -8.1, 6.1], [-16.8, 28.5, 42.1], [X0, 65.3, 79.0]]) monitor(m, x0, X1, y0, y1, DECK, MON)

  // Railway side: the platform and its canopy, a loading door per bay.
  platform(m, X1, 29.8, Y0, Y1, PLINTH)
  platform(m, -10.4, 29.8, Y1, 95.1, PLINTH)
  shed(m, X1, 31.5, Y0, Y1, LOW, 31.2)
  {
    const f = onWall([X1, Y0], [X1, Y1])
    for (let a = 6.1; a < f.L - 3; a += 12.2) f.panel(m.dark, a - 1.8, a + 1.8, PLINTH, PLINTH + 3.4)
  }

  // Plinth and windows on the other faces: two tiers (storefronts, then a
  // row high in the tall wall), awnings over the lower tier on the fronts.
  const tiers = (A: XY, B: XY, n: number, awning = 0) => {
    windows(m, A, B, { a0: 2, a1: Math.hypot(B[0] - A[0], B[1] - A[1]) - 2, n, w: 3.6, z0: PLINTH + 0.3, z1: 4.6, awning })
    windows(m, A, B, { a0: 2, a1: Math.hypot(B[0] - A[0], B[1] - A[1]) - 2, n, w: 3.6, z0: 6.0, z1: 8.6 })
  }
  for (const [A, B] of [[[X1, Y1], [X0, Y1]], [[X0, Y1], [X0, 53.2]], [[-16.8, 38.8], [-16.8, 16.8]], [[X0, 16.8], [X0, -4.2]], [[X0, -37.7], [X0, -57.3]], [[-17.9, Y0], [X1, Y0]]] as [XY, XY][]) plinth(m, A, B, PLINTH)
  tiers([X1, Y1], [X0, Y1], 7, 1.8)
  tiers([X0, Y1], [X0, 53.2], 3, 1.6)
  tiers([-16.8, 38.8], [-16.8, 16.8], 2)
  tiers([X0, 16.8], [X0, -4.2], 2, 1.6)
  tiers([X0, -37.7], [X0, -57.3], 2, 1.6)
  tiers([-17.9, Y0], [X1, Y0], 5, 1.8)
  windows(m, [X0, -57.3], [X0, Y0], { a0: 4, a1: 32, n: 3, w: 3.2, z0: PLINTH + 0.3, z1: 4.4 })
  // The west bump: a door.
  { const f = onWall([-33.6, -4.2], [-33.6, -37.7]); f.panel(m.dark, 14.9, 18.6, 0.2, 3.8) }

  return out(m, 'clt-cne-201-camp-road', '201 Camp Road, Camp North End', MON, 39.34)
}

if (import.meta.main) await write(build201())
