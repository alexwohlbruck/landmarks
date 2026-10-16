/**
 * Camp North End: 1701 N. Graham Street — procedural, CC0-1.0.
 * bun generators/clt-cne-1701-n-graham.ts
 *
 * The original 1941–43 part of the Army Quartermaster Corps' Building No. 6,
 * the easternmost of the depot's three south warehouses, between the
 * railway and North Graham Street; the building's pre-1955 metal-sided
 * extension north-east of it is `clt-cne-gama-goat`. A one-storey box
 * 56 × 121 m, its brick painted pale grey, three corrugated-metal clerestory
 * monitors across its width (the survey counts four on No. 6 before the
 * extension), a loading platform under a canopy along the railway side, a
 * dock recess and a lower wing on the street side, and storefronts under
 * black steel canopies on the south-west end on Keswick Avenue.
 *
 * Identity: the long pale-grey box with three silver monitors across its
 * white roof.
 *
 * Evidence:
 *  - OSM: the multipolygon relation/8793520 ("1701 N. Graham", height 9)
 *    and its 9 parts: monitors way/835812866, 835812868, 835842061
 *    (height 9), the main roof 835812865, 835812867, 835812869, 835812872
 *    (6.9), the street-side wing 835812871 (5.8), the railway platform
 *    835812864 (1); and way/836225484 (height 1), an outer member of the
 *    relation also tagged building:part, the strip along the north-east
 *    end.
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m (measured, NAVD88):
 *    ground 227.9–228.7 (y = 0 is 227.9); deck 235.3 (7.4 m); monitors
 *    238.1 (10.2 m); wing and platform canopy 234.0 (6.1 m).
 *  - C-M Historic Landmarks Commission survey report (2017,
 *    landmarkscommission.org/wp-content/uploads/2017/06/Ford-Motor-Co-Plant-SR.pdf),
 *    Buildings Nos. 4–6 (published): the matched set, 180 ft wide, brick,
 *    corrugated-metal monitors across the width, four on No. 6, whose
 *    windows "have been covered over".
 *  - Mecklenburg County tax parcel 07903C99 (CAMP GAMA GOAT PROPERTY OWNER
 *    LP): built 1943, face brick.
 *  - Camp North End leasing brochure (2021, camp.nc): "1701 N. Graham
 *    Street", 75,000 sq ft.
 *  - Mapillary 360° photo 353699656976831 (cbreedlove, 2022-06-10, CC BY-SA
 *    4.0), 31 m south of the south-west end: the end wall painted light
 *    grey over a white base, a flat parapet with a dark coping line, two
 *    storefronts under flat black canopies.
 *  - USGS NAIP orthophoto (public domain): white roofs.
 *
 * Measured from the photo (its camera 20.4 m from the wall): the storefronts at
 * 18–31 m and 46–50 m from the west corner. Estimated: the grey's exact value (one photo, partly in shade); window
 * and canopy sizes on the south-west end; the long faces' openings, which no
 * licensed photo shows (drawn as a few windows and the dock doors).
 *
 * Frame and kit: `clt-cne-301-camp-road.ts`. y along the long axis (bearing
 * 39.45°), placement bearing 39.45; origin at the outline's centroid,
 * lng −80.8327981, lat 35.2447076.
 */
import { finish } from './palette'
import { onWall, write } from './clt-cne-hercules-south'
import { awningOn, mass, mats, monitor, out, platform, plinth, rect, shed, windows } from './clt-cne-301-camp-road'

const PAINT = finish('cne-grey-paint', 0xc6c5c0)
const TOP = 7.8, DECK = 7.4, MON = 10.2, WING = 6.1, DOCK = 1.1
const X0 = -25.8, X1 = 30.8, Y0 = -59.6, Y1 = 61.5

export function build1701() {
  const m = mats()
  mass(m, [[X0, Y0], [X1, Y0], [X1, 12.8], [18.5, 12.8], [18.5, 49.4], [X1, 49.4], [X1, Y1], [X0, Y1]], TOP, TOP - DECK)
  mass(m, rect(18.5, X1, 37.2, 49.4), WING)
  monitor(m, X0, X1, -48.6, -34.9, DECK, MON)
  monitor(m, X0, X1, -12.0, 1.4, DECK, MON)
  monitor(m, X0, 18.5, 24.2, 37.8, DECK, MON)

  // Railway side: the platform the full length under a canopy, doors.
  platform(m, -29.0, X0, -54.4, Y1, DOCK)
  shed(m, -29.6, X0, -54.4, Y1, WING, -29.3)
  {
    const f = onWall([X0, Y1], [X0, Y0])
    for (let a = 9; a < f.L - 8; a += 12.2) f.panel(m.dark, a - 1.7, a + 1.7, DOCK, DOCK + 3.2)
  }
  // Street side: the dock recess with doors, windows along the rest.
  platform(m, 18.5, X1, 12.8, 37.2, DOCK)
  {
    const f = onWall([18.5, 12.8], [18.5, 37.2])
    for (const a of [6, 12.2, 18.4]) f.panel(m.dark, a - 1.7, a + 1.7, DOCK, DOCK + 3.2)
  }
  windows(m, [X1, Y0], [X1, 12.8], { a0: 6, a1: 70, n: 5, w: 3.2, z0: 1.8, z1: 4.8 })
  windows(m, [X1, 49.4], [X1, Y1], { n: 1, w: 3.2, z0: 1.8, z1: 4.8 })
  for (const [A, B] of [[[X1, Y0], [X1, 12.8]], [[X1, 49.4], [X1, Y1]], [[X1, 37.2], [X1, 49.4]], [[X0, Y0], [X1, Y0]], [[X1, Y1], [X0, Y1]]] as [number, number][][]) {
    plinth(m, A as [number, number], B as [number, number], DOCK)
  }
  // South-west end on Keswick Avenue: two storefronts under black canopies.
  {
    const f = onWall([X0, Y0], [X1, Y0])
    f.panel(m.win, 18.3, 31.0, DOCK + 0.2, 4.4)
    awningOn(m.dark, f, 17.8, 31.5, 4.7, 2.0)
    f.panel(m.win, 45.6, 50.0, DOCK + 0.2, 4.4)
    awningOn(m.dark, f, 45.1, 50.5, 4.7, 2.0)
  }
  windows(m, [X1, Y1], [X0, Y1], { n: 4, w: 3.2, z0: 1.8, z1: 4.8 })

  return out(m, 'clt-cne-1701-n-graham', '1701 N. Graham Street, Camp North End', MON, 39.45, PAINT)
}

if (import.meta.main) await write(build1701())
