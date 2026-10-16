/**
 * Camp North End: The General's Office — procedural, CC0-1.0.
 * bun generators/clt-cne-generals-office.ts
 *
 * A small one-storey office of the Army depot, 300 Camp Road, standing
 * against the east end of `clt-cne-330-camp-road`, named The General's
 * Office by Camp North End (the origin of the name is not published). A flat-roofed
 * brick box 14 × 12 m with a small raised block on its roof.
 *
 * Evidence:
 *  - OSM: way/672998898 ("The General's Office", height 5.5, addr 300 Camp
 *    Road), its part way/835851711 (height 5.5) and the multipolygon part
 *    relation/18229983 (height 4.5) that covers the rest.
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m (measured, NAVD88):
 *    roof 231.6–231.7; the raised block 232.7; ground 227.1 on the north,
 *    228.3 on the south (y = 0 is 227.1: the roof is 4.6 m above it, the
 *    block 5.6 m).
 *  - Camp North End leasing brochure (2021, camp.nc): "300 Camp Road",
 *    2,000 sq ft. Mecklenburg County tax parcel 07903102 (CAMP LANDOWNER
 *    LP), 1943–55.
 *
 * No licensed photo was found. The brick, the windows and the door are
 * estimated; the raised block's purpose (a skylight or plant) is unknown.
 * Under the 300 m² floor for small buildings, built because it is named and
 * historic.
 *
 * Frame: the Ford plant's grid, placement bearing 6.3; origin at the
 * outline's centroid, lng −80.8334231, lat 35.2464367. Kit:
 * `clt-cne-301-camp-road.ts`.
 */
import { write } from './clt-cne-hercules-south'
import { mass, mats, out, rect, windows } from './clt-cne-301-camp-road'

const TOP = 4.6, BLOCK = 5.6

export function buildGenerals() {
  const m = mats()
  mass(m, [[-7.0, -6.1], [7.25, -6.1], [7.25, 5.5], [1.7, 5.5], [1.7, 6.7], [-3.8, 6.7], [-3.8, 5.5], [-7.0, 5.5]], TOP, 0.35)
  mass(m, rect(2.3, 5.4, 0.6, 3.5), BLOCK, 0.2)
  windows(m, [-7.0, -6.1], [7.25, -6.1], { n: 3, w: 1.8, z0: 1.3, z1: 3.1 })
  windows(m, [7.25, -6.1], [7.25, 5.5], { n: 1, w: 2.2, z0: 1.3, z1: 3.5, pane: m.dark, awning: 1.2 })
  windows(m, [7.25, 5.5], [1.7, 5.5], { n: 1, w: 1.6, z0: 2.0, z1: 3.6 })
  windows(m, [1.7, 6.7], [-3.8, 6.7], { n: 2, w: 1.6, z0: 2.0, z1: 3.6 })
  return out(m, 'clt-cne-generals-office', "The General's Office, Camp North End", BLOCK, 6.3)
}

if (import.meta.main) await write(buildGenerals())
