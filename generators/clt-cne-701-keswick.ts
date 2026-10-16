/**
 * Camp North End: 701 Keswick Avenue — procedural, CC0-1.0.
 * bun generators/clt-cne-701-keswick.ts
 *
 * One bay of the Army Quartermaster Corps' Building No. 5 (1941–43), cut
 * free of its neighbours in the 2021 renovation: `clt-cne-201-camp-road` is
 * the warehouse's north-east half, beyond a passage cut through it, and the
 * parking garage and Kinship East stand on its south-west end. Shops and
 * restaurants. A tall red-brick block 55 × 38 m with one corrugated-metal
 * clerestory monitor across it and a slightly lower annex on the
 * north-west side; north-east of it, on the slab of the bay removed for the
 * passage, a low brick wing and a curved canopy.
 *
 * Identity: the tall brick block with its single silver monitor, between
 * 201 Camp Road and the garage.
 *
 * Evidence:
 *  - OSM: the outline way/702547987 and its parts: the monitor
 *    way/835808943 (height 10.4), the roofs 835808944 and 1108280895 (8.2),
 *    the north-west annex 835808946 (8), the low wing relation/14759154
 *    (4.2), the curved canopy 1109057437 (5.2, roof:shape round) and the
 *    slab 1109057438 (1).
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m (measured, NAVD88):
 *    ground 227.9–228.7 (y = 0 is 227.9); deck 237.3 (9.4 m); the monitor
 *    240.1 (12.2 m); the annex 236.4 (8.5 m). The flight predates the cut:
 *    it still shows the warehouse running on north-east over the passage,
 *    so the wing (4.2 m) and the canopy (5.2 m) take OSM's heights.
 *  - C-M Historic Landmarks Commission survey report (2017,
 *    landmarkscommission.org/wp-content/uploads/2017/06/Ford-Motor-Co-Plant-SR.pdf),
 *    Buildings Nos. 4–6 (published): brick, 180 ft wide, corrugated-metal
 *    monitors across the width; No. 5 has ten.
 *  - Mecklenburg County tax parcel 07903C99: built 1943, face brick.
 *    Camp North End leasing brochure (2021, camp.nc): "701 Keswick Avenue",
 *    38,000 sq ft, retail.
 *  - Photo (EVIDENCE): its end wall at the left of
 *    https://commons.wikimedia.org/wiki/File:Free_Range_Brewing_Camp_North_End_in_the_301_Camp_building_Early_June_2025.jpg
 *    (City Dweller 2, CC BY-SA 4.0): orange-red brick, black-framed windows
 *    in two tiers, a storefront row and a row high in the wall.
 *  - USGS NAIP orthophoto (public domain): white roofs.
 *
 * Estimated: window sizes and counts (from the one partial photo, applied
 * to every face); the curved canopy's form (a barrel vault from OSM's
 * roof:shape, springing at 3.6 m), its posts; the wing's walls.
 *
 * Frame and kit: `clt-cne-301-camp-road.ts`. y along the long axis (bearing
 * 39.67°), placement bearing 39.67; origin at the outline's centroid,
 * lng −80.8333009, lat 35.2454296.
 */
import { box, quad, type XY } from './clt-cne-ford-plant'
import { write } from './clt-cne-hercules-south'
import { mass, mats, monitor, out, platform, plinth, rect, windows } from './clt-cne-301-camp-road'

const TOP = 9.8, DECK = 9.4, MON = 12.2, ANNEX = 8.5, WING = 4.2, PLINTH = 1.2
const X0 = -25.2, X1 = 29.5, Y0 = -31.4, Y1 = 6.4

export function build701() {
  const m = mats()
  mass(m, rect(X0, X1, Y0, Y1), TOP, TOP - DECK)
  mass(m, rect(-35.3, X0, -14.6, 12.9), ANNEX)
  monitor(m, X0, X1, -19.8, -5.7, DECK, MON)

  // North-east, on the old floor slab: the low wing and the curved canopy.
  platform(m, X0, 30.2, Y1, 31.7, 0.9)
  mass(m, rect(-23.8, 30.2, Y1, 15.4), WING, 0.3)
  {
    const x0 = -10.4, x1 = 16.9, y0 = 22.1, y1 = 31.6, spring = 3.6, crown = 5.2, n = 8
    const yc = (y0 + y1) / 2, r = (y1 - y0) / 2, k = (crown - spring) / r
    for (let i = 0; i < n; i++) {
      const a = Math.PI * i / n, b = Math.PI * (i + 1) / n
      const pa: [number, number] = [yc - r * Math.cos(a), spring + k * r * Math.sin(a)], pb: [number, number] = [yc - r * Math.cos(b), spring + k * r * Math.sin(b)]
      quad(m.metal, [x0, pa[0], pa[1]], [x1, pa[0], pa[1]], [x1, pb[0], pb[1]], [x0, pb[0], pb[1]], [0, -Math.cos((a + b) / 2), Math.sin((a + b) / 2)])
    }
    for (const x of [x0 + 0.3, (x0 + x1) / 2, x1 - 0.3]) for (const y of [y0 + 0.3, y1 - 0.3]) box(m.dark, x - 0.15, x + 0.15, y - 0.15, y + 0.15, 0.9, spring, null)
  }

  // Plinth and two tiers of windows on the main block; the annex and wing.
  const faces: [XY, XY, number][] = [[[X1, Y0], [X1, Y1], 4], [[X0, Y0], [X1, Y0], 6], [[X0, -14.6], [X0, Y0], 2]]
  for (const [A, B, n] of faces) {
    plinth(m, A, B, PLINTH)
    windows(m, A, B, { a0: 1.5, a1: Math.hypot(B[0] - A[0], B[1] - A[1]) - 1.5, n, w: 3.2, z0: PLINTH + 0.3, z1: 4.6, awning: 1.5 })
    windows(m, A, B, { a0: 1.5, a1: Math.hypot(B[0] - A[0], B[1] - A[1]) - 1.5, n, w: 3.2, z0: 5.8, z1: 8.4 })
  }
  windows(m, [-35.3, 12.9], [-35.3, -14.6], { n: 3, w: 3.2, z0: PLINTH + 0.3, z1: 4.6, awning: 1.5 })
  windows(m, [X1, Y1], [X0, Y1], { a0: 2, a1: 52, n: 6, w: 3.2, z0: 5.6, z1: 8.4 })
  windows(m, [30.2, 15.4], [-23.8, 15.4], { n: 6, w: 3.2, z0: 1.3, z1: 3.5 })

  return out(m, 'clt-cne-701-keswick', '701 Keswick Avenue, Camp North End', MON, 39.67)
}

if (import.meta.main) await write(build701())
