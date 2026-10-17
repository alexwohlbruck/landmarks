/**
 * Camp North End: the Gama Goat Building — procedural, CC0-1.0.
 * bun generators/clt-cne-gama-goat.ts
 *
 * The extension the Army added to its Building No. 6 some time before 1955,
 * running north-east from `clt-cne-1701-n-graham` between the railway and
 * North Graham Street; 1801 N. Graham Street. Unlike the brick warehouses it
 * is a steel shed clad in corrugated metal, here painted charcoal, with one
 * long clerestory monitor down its spine instead of monitors across it. A
 * box 41 × 183 m; along the street its wall stands back under the deep
 * eaves of the roof on steel posts and braces; a loading platform under a
 * canopy along the railway side; open canopies over platforms at both ends,
 * the north-east end cut on the diagonal.
 *
 * Identity: the long charcoal shed with its raised spine monitor and the
 * deep dark eaves along North Graham Street.
 *
 * Evidence:
 *  - OSM: the outline way/632256525 ("Gama Goat Building", height 8) and its
 *    13 parts: the spine monitor in two lengths way/835812875, 835812880
 *    (gabled, height 10.1/10.2), the side roofs 835812876, 835812878,
 *    835812879, 835812881 (7.2), the railway platform 835812877, the
 *    end platforms 835812873, 836935996 and the strip between the monitor
 *    lengths 835812885 (1), the north-east canopy 835812883 (min_height
 *    4.9), the small blocks 835812874 (4) and 835842063 (2).
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m (measured, NAVD88):
 *    ground 228.0–228.7 (y = 0 is 228.0); side roofs 235.9–236.4 (8.1 m);
 *    the monitor 238.8–239.0 (10.9 m), flat to within 0.2 m, so drawn with a
 *    flat lid; the strip between its two lengths 236.4 (no monitor there);
 *    the south-west canopy 235.3 (7.3 m); the railway canopy 234.3 (6.3 m);
 *    the north-east canopy 234.1 (6.1 m).
 *  - C-M Historic Landmarks Commission survey report (2017,
 *    landmarkscommission.org/wp-content/uploads/2017/06/Ford-Motor-Co-Plant-SR.pdf),
 *    Buildings Nos. 4–6 (published): No. 6 "expanded some time before
 *    1955; this new addition contains the same steel framing and concrete
 *    floors, but ... is sided with aluminum or vinyl and has a 6-foot
 *    single monitor that runs the rest of the length".
 *  - Mecklenburg County tax parcel 07903C99 (CAMP GAMA GOAT PROPERTY OWNER
 *    LP). Camp North End leasing brochure (2021, camp.nc): "Gama Goat
 *    Building", 85,000 sq ft. OSM name and address.
 *  - Mapillary photos 337256698419883 and 296443739342389 (aftcpics471,
 *    2022-04-21, CC BY-SA 4.0), from North Graham Street looking north-east
 *    along the street front: charcoal corrugated walls with tall windows,
 *    set back under deep eaves with a pale grey fascia, carried on dark steel
 *    posts and knee braces,
 *    the framing open at the north-east end, a pale concrete base.
 *  - USGS NAIP orthophoto (public domain): white side roofs, the grey spine.
 *
 * Estimated: the eaves' depth (3.5 m, the street wall drawn at x = 20.5
 * inside OSM's 24.1 outline), the post spacing, window sizes and spacing
 * (photo-scaled); the railway and end faces, unphotographed, are given
 * doors and a few windows. The wall colour is pulled to charcoal #5b6067
 * from the photos' near-black.
 *
 * Frame and kit: `clt-cne-301-camp-road.ts`. y along the long axis (bearing
 * 39.62°), placement bearing 39.62; origin at the outline's centroid,
 * lng −80.8316634, lat 35.2459136.
 */
import { finish } from './palette'
import { box, type XY } from './clt-cne-ford-plant'
import { onWall, write } from './clt-cne-hercules-south'
import { mass, mats, out, platform, plinth, shed, windows, type Mats } from './clt-cne-301-camp-road'

const SIDING = finish('cne-charcoal-siding', 0x5b6067)
const EAVE = 8.1, PARA = 0.3, MON = 10.9, DOCK = 1.0
const X0 = -20.4, X1 = 20.5, XO = 24.0, Y0 = -82.0, Y1 = 100.8

/** The spine monitor along y: clad, glazed down both long sides, white lid. */
function spine(m: Mats, x0: number, x1: number, y0: number, y1: number, deck: number, top: number) {
  box(m.metal, x0, x1, y0, y1, deck, top - 0.3, null)
  box(m.metal, x0 - 0.3, x1 + 0.3, y0 - 0.3, y1 + 0.3, top - 0.4, top, m.roof)
  for (const [A, B] of [[[x1, y0], [x1, y1]], [[x0, y1], [x0, y0]]] as [XY, XY][]) {
    const f = onWall(A, B), n = Math.round(f.L / 7), g = 0.7, pw = (f.L - g * (n + 1)) / n
    for (let k = 0; k < n; k++) f.panel(m.win, g + k * (pw + g), g + k * (pw + g) + pw, deck + 0.5, top - 0.7)
  }
}

export function buildGamaGoat() {
  const m = mats()
  mass(m, [[X0, Y0], [X1, Y0], [X1, 76.0], [3.5, Y1], [X0, Y1]], EAVE, PARA)

  // The street eaves: the roof carried out to OSM's outline on posts.
  box(m.metal, X1 + 0.05, XO, Y0, 74.2, EAVE - 0.9, EAVE - 0.02, m.roof)
  for (let y = Y0 + 0.6; y <= 74.2 - 0.5; y += 9.15) {
    box(m.dark, XO - 0.55, XO - 0.2, y - 0.18, y + 0.18, 0, EAVE - 0.9, null)
    box(m.dark, X1, XO - 0.2, y - 0.15, y + 0.15, EAVE - 1.8, EAVE - 0.9, null)
  }

  spine(m, -8.0, 11.0, Y0 + 0.4, 3.8, EAVE - PARA, MON)
  spine(m, -8.3, 11.1, 10.4, 90.0, EAVE - PARA, MON)

  // Railway side: platform and canopy the full length, loading doors.
  platform(m, -24.2, X0, Y0, Y1, DOCK)
  shed(m, -24.6, X0, Y0, Y1, 6.3, -24.3)
  {
    const f = onWall([X0, Y1], [X0, Y0])
    for (let a = 8; a < f.L - 6; a += 12.2) f.panel(m.dark, a - 1.7, a + 1.7, DOCK, DOCK + 3.2)
  }
  // Street front under the eaves: tall windows over the concrete base.
  plinth(m, [X1, Y0], [X1, 76.0], 0.9)
  windows(m, [X1, Y0], [X1, 76.0], { a0: 3, a1: 155, n: 17, w: 2.6, z0: 1.4, z1: 4.6 })
  // South-west end: the platform under an open canopy, a small block on it.
  platform(m, -21.0, 35.0, -96.6, Y0, DOCK)
  shed(m, -21.0, 35.0, -96.6, Y0, 7.3, null)
  for (const x of [-20.6, -6.6, 7.4, 21.2, 34.6]) box(m.dark, x - 0.2, x + 0.2, -96.4, -96.0, DOCK, 6.9, null)
  mass(m, [[-14.4, -88.0], [21.5, -88.0], [21.5, Y0], [-14.4, Y0]], 4.2, 0.3)
  windows(m, [X0, Y0], [-14.4, Y0], { n: 1, w: 3.2, z0: 1.4, z1: 4.6 })
  // North-east end: the diagonal wall, an open canopy past it.
  shed(m, X0, 4.6, Y1, 107.0, 6.1, null)
  for (const x of [-19.7, -7.6, 4.0]) box(m.dark, x - 0.2, x + 0.2, 106.5, 106.9, 0, 5.7, null)
  windows(m, [3.5, Y1], [X0, Y1], { n: 3, w: 3.0, z0: 1.4, z1: 4.6 })
  windows(m, [X1, 76.0], [3.5, Y1], { n: 3, w: 2.6, z0: 1.4, z1: 4.6 })

  return out(m, 'clt-cne-gama-goat', 'Gama Goat Building, Camp North End', MON, 39.62, SIDING)
}

if (import.meta.main) await write(buildGamaGoat())
