/**
 * Camp North End: 1720 Statesville Avenue — procedural, CC0-1.0.
 * bun generators/clt-cne-1720-statesville.ts
 *
 * The south-west end of the Army Quartermaster Corps' Building No. 4
 * (1941–43); the building's middle was taken down for Kinship West and its
 * north-east end is `clt-cne-301-camp-road`. A one-storey red-brick box
 * 56 × 74 m, two corrugated-metal clerestory monitors across its width, a
 * lower wing on its north-west side, and on the south-east side a loading
 * dock under a deep flat steel canopy.
 *
 * Identity: the red brick box with its two silver-and-glass monitors, and the
 * dock canopy on the south-east side.
 *
 * Evidence:
 *  - OSM: the outline way/1017983351 (no height) and its 6 parts: the
 *    monitors way/1017983346, 1017983348 (height 9), the main roof
 *    1017983345, 1017983347, 1017983349 (6.9) and the low north-west wing
 *    1017983350 (5.8).
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m (measured, NAVD88):
 *    ground 228.1–228.3 (y = 0 is 228.1); deck 235.4 (7.3 m); monitors
 *    238.2 (10.1 m); wing 234.0 (5.9 m).
 *  - C-M Historic Landmarks Commission survey report (2017,
 *    landmarkscommission.org/wp-content/uploads/2017/06/Ford-Motor-Co-Plant-SR.pdf),
 *    Buildings Nos. 4–6 (published): brick in common bond, corrugated-metal
 *    clerestory monitors crossing the width, 180 ft wide.
 *  - Mecklenburg County tax parcel 07903102 (CAMP LANDOWNER LP): 1943 face
 *    brick among the parcel's buildings.
 *  - Mapillary 360° photo 585774473263517 (cbreedlove, 2022-06-10, CC BY-SA
 *    4.0), taken 24 m south-east of the south-east face: red brick, the
 *    dock under a flat steel canopy with loading doors, the south monitor
 *    clad in silver corrugated metal over a tall glazed band.
 *  - USGS NAIP orthophoto (public domain): white roofs.
 *
 * Estimated: the canopy's extent (y −31..9, 5.5 m deep, 5.6 m high) and the
 * door spacing, from the one photo; window sizes. The north-west face (on
 * Statesville Avenue) and both ends are unphotographed and kept plain: a few
 * windows, guessed. The photo predates the 2022–24 renovation's finish; no
 * name is published for the building, so it takes its address.
 *
 * Frame and kit: `clt-cne-301-camp-road.ts`. y along the long axis (bearing
 * 39.47°), placement bearing 39.47; origin at the outline's centroid,
 * lng −80.8351307, lat 35.2447837.
 */
import { onWall, write } from './clt-cne-hercules-south'
import { mass, mats, monitor, out, platform, plinth, rect, shed, windows } from './clt-cne-301-camp-road'

const TOP = 7.7, DECK = 7.3, MON = 10.1, WING = 5.9, DOCK = 1.2
const X0 = -27.8, X1 = 27.7, Y0 = -36.6, Y1 = 37.0, WX = -15.3, WY = -0.2

export function build1720() {
  const m = mats()
  mass(m, [[X0, Y0], [X1, Y0], [X1, Y1], [WX, Y1], [WX, WY], [X0, WY]], TOP, TOP - DECK)
  mass(m, rect(X0, WX, WY, Y1 - 0.3), WING)
  monitor(m, X0, X1, -25.2, -11.6, DECK, MON)
  monitor(m, WX, X1, 12.3, 25.6, DECK, MON)

  // South-east: the loading dock under its canopy, doors along it.
  platform(m, X1, X1 + 4.6, -31, 9, DOCK)
  shed(m, X1, X1 + 5.5, -31, 9, 5.6, X1 + 5.2)
  {
    const f = onWall([X1, Y0], [X1, Y1])
    for (let a = 8.5; a < 44; a += 7.5) f.panel(m.dark, a - 1.6, a + 1.6, DOCK, DOCK + 3.0)
  }
  windows(m, [X1, Y0], [X1, Y1], { a0: 47, a1: 72, n: 3, w: 3.2, z0: 1.8, z1: 4.6 })
  plinth(m, [X1, Y0], [X1, Y1], DOCK, 46, 73.6)
  // North-west (Statesville Avenue) and the ends: plinth and a few windows.
  for (const [A, B] of [[[X0, WY], [X0, Y0]], [[X0, Y1 - 0.3], [X0, WY]], [[X0, Y0], [X1, Y0]], [[X1, Y1], [WX, Y1]], [[WX, Y1 - 0.3], [X0, Y1 - 0.3]]] as [number, number][][]) {
    plinth(m, A as [number, number], B as [number, number], DOCK)
  }
  windows(m, [X0, Y1 - 0.3], [X0, WY], { n: 4, w: 3.0, z0: 1.8, z1: 4.4 })
  windows(m, [X0, WY], [X0, Y0], { n: 4, w: 3.0, z0: 1.8, z1: 5.0 })
  windows(m, [X0, Y0], [X1, Y0], { n: 5, w: 3.4, z0: 1.8, z1: 5.0 })
  windows(m, [X1, Y1], [WX, Y1], { n: 4, w: 3.4, z0: 1.8, z1: 5.0 })

  return out(m, 'clt-cne-1720-statesville', '1720 Statesville Avenue, Camp North End', MON, 39.47)
}

if (import.meta.main) await write(build1720())
