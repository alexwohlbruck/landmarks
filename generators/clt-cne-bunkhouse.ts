/**
 * Camp North End: the Bunkhouse — procedural, CC0-1.0.
 * bun generators/clt-cne-bunkhouse.ts
 *
 * A small gabled house among the depot's buildings, 270 Camp Road, beside
 * the north-west corner of `clt-cne-201-camp-road`; Camp North End calls it
 * the Bunkhouse (3,400 sq ft). Probably the "dwelling for Army staff" the
 * 2019 designation report lists among the depot's smaller buildings; that
 * identification is not confirmed. A one-storey house 11 × 28 m under a
 * slate-grey gabled roof running along its length, a narrower gabled
 * extension at the north-east end, a cross-gabled wing on the west side and
 * a small flat-roofed porch on the east.
 *
 * Identity: the only pitched-roof house on the campus, its dark roof among
 * the white flat roofs.
 *
 * Evidence:
 *  - OSM: the outline way/324608458 ("Bunkhouse at Camp North End", height
 *    5) and its parts way/901294559 (gabled, height 5) and way/835852293
 *    (gabled, height 4.5, the west wing).
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m (measured, NAVD88):
 *    ground 228.3–229.0 (y = 0 is 228.3); ridge 233.6 (5.3 m), running
 *    along the long axis on its centre line; eaves 232.0–232.5 (about
 *    3.8 m). A tree over its north-west side clutters the returns there.
 *  - USGS NAIP orthophoto (public domain): the slate-grey roof, its plan.
 *  - Camp North End leasing brochure (2021, camp.nc): "Bunkhouse",
 *    3,400 sq ft. Mecklenburg County tax parcel 07903102 (CAMP LANDOWNER
 *    LP), 1943–55.
 *
 * No licensed photo was found. The wall finish (drawn in the campus brick),
 * the windows and doors are estimated; the wing's and extension's roof
 * heights are from OSM's 4.5 m, scaled to the lidar.
 *
 * Frame: the south warehouses' grid, y along bearing 39.13° (the outline's
 * axis), placement bearing 39.13; origin at the outline's centroid,
 * lng −80.8332717, lat 35.2462969. Kit: `clt-cne-301-camp-road.ts`.
 */
import { finish } from './palette'
import { box } from './clt-cne-ford-plant'
import { gableRoof, write } from './clt-cne-hercules-south'
import { mats, out, windows } from './clt-cne-301-camp-road'

const SLATE = finish('cne-slate', 0x7d868f)
const EAVE = 3.8, RIDGE = 5.3

export function buildBunkhouse() {
  const m = mats()
  // Main house, x −5.4..5.7, y −15.7..12.3, ridge along y.
  box(m.wall, -5.4, 5.7, -15.7, 12.3, 0, EAVE, null)
  gableRoof(m.metal, m.wall, -5.4, 5.7, -15.7, 12.3, EAVE, RIDGE, false, 0.5)
  // North-east extension, narrower and lower.
  box(m.wall, 0.1, 5.6, 12.3, 16.8, 0, 3.3, null)
  gableRoof(m.metal, m.wall, 0.1, 5.6, 12.3, 16.8, 3.3, 4.5, false, 0.4)
  // West wing, cross-gabled.
  box(m.wall, -8.9, -5.4, 3.2, 9.7, 0, 3.3, null)
  gableRoof(m.metal, m.wall, -8.9, -5.2, 3.2, 9.7, 3.3, 4.6, true, 0.4)
  // East porch.
  box(m.wall, 5.7, 7.7, -3.1, -0.1, 0, 3.0, m.roof)

  windows(m, [5.7, -15.7], [5.7, 12.3], { n: 6, w: 1.4, z0: 1.0, z1: 2.6 })
  windows(m, [-5.4, 12.3], [-5.4, -15.7], { a0: 9, a1: 28, n: 4, w: 1.4, z0: 1.0, z1: 2.6 })
  windows(m, [-5.4, -15.7], [5.7, -15.7], { n: 2, w: 1.4, z0: 1.0, z1: 2.6 })
  windows(m, [5.6, 16.8], [0.1, 16.8], { n: 1, w: 1.4, z0: 1.0, z1: 2.4 })
  windows(m, [-8.9, 9.7], [-8.9, 3.2], { n: 2, w: 1.4, z0: 1.0, z1: 2.4 })
  windows(m, [7.7, -3.1], [7.7, -0.1], { n: 1, w: 1.2, z0: 0.3, z1: 2.4, pane: m.dark })

  return out(m, 'clt-cne-bunkhouse', 'Bunkhouse, Camp North End', RIDGE, 39.13, undefined, SLATE)
}

if (import.meta.main) await write(buildBunkhouse())
