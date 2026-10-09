/**
 * MetLife Building (200 Park Avenue, the former Pan Am Building) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-metlife-building.ts
 *
 * Map frame: x = model east (Lexington side), y = model north (up Park
 * Avenue), z up, metres. Placed at bearing 29°, the Manhattan grid. Anchor:
 * area centroid of the OSM outline way/137564642. The tower's long axis runs
 * across Park Avenue, east–west in the model frame. Kit from nyc-570-lexington.ts.
 *
 * Evidence
 * - OSM: outline way/137564642; tower part way/137564641 (the elongated
 *   octagon, 90.8 × 42 m, its long faces each broken into three facets);
 *   base parts 137565295 and 1487962793; four small 30–38 m piers
 *   1487962789–92.
 * - Lidar: USGS 3DEP NY_NewYorkCity, flown 2017, resampled into the model
 *   frame. Measured: tower roof 242–243 m above the lowest ground at the
 *   footprint, parapet points to 246 m; the base podium 37 m at its edge,
 *   a raised inner block at 45 m and a mechanical block at 49 m north of
 *   the tower.
 * - Published: 246 m, 59 floors, Emery Roth & Sons with Walter Gropius and
 *   Pietro Belluschi, 1963 (Wikipedia). Precast concrete curtain wall,
 *   two recessed mechanical floors as dark horizontal bands, a louvred
 *   mechanical crown under the roof carrying the MetLife sign.
 * - Photos (Wikimedia Commons): /tmp/city/nyc/work/nyc-metlife-building/photos/credits.txt
 *
 * Estimated: mechanical band heights (from photos: about a third and two
 * thirds up the shaft, and the top 9 m), panel rhythm. The sign and the
 * Park Avenue viaduct portals through the podium are left out.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Facade, massing, prism, finishModel } from './nyc-570-lexington'

const concrete = new Part(), win = new Part(), roof = new Part(), louvre = new Part()

// Podium: the outline at 37 m, a raised inner block at 45 m and a mechanical
// block at 49 m (lidar). The tower stands on the 45 m block.
const OUTLINE: XY[] = [[-44.6, 55.5], [-45.1, 54.8], [-45.4, -40.4], [-44.4, -40.8], [-39.6, -40.8], [-39.6, -57.3],
  [39.1, -57.3], [39.1, -40.7], [45.2, -40.7], [45.4, 54.7], [44.7, 55.5]]
const podium: Facade = { bay: 4.5, ratio: 0.6, floor: 4, group: 2, spandrel: 1.6, sill: 1.5, head: 1.5, ground: 6, minLength: 6 }
massing({
  wall: concrete, win, roof, facade: podium,
  polys: [[37, OUTLINE.map(([x, y]) => [Math.round(x * 2) / 2, Math.round(y * 2) / 2] as XY)]],
  boxes: [[-39.5, -39.5, 39, 43, 45], [-24, 12, 18, 40, 49]],
})

// Tower: way/137564641, the elongated octagon (counter-clockwise).
const TOWER: XY[] = [[-45.4, -26.3], [-39.4, -27.9], [-19.0, -33.2], [21.6, -33.0], [38.6, -28.7], [45.4, -27.0],
  [45.4, 2.3], [38.8, 4.2], [23.1, 9.0], [-18.7, 8.9], [-39.2, 3.2], [-45.3, 1.3]]
// A precast concrete grid: narrow window panels between frequent mullions,
// four storeys to a panel.
const shaft: Facade = { bay: 3.0, ratio: 0.62, floor: 3.65, group: 4, spandrel: 1.9, sill: 1.2, head: 1.2, minLength: 3 }
const ROOF = 243
const bands: [number, number, boolean][] = [ // [z0, z1, mechanical]
  [45, 106, false], [106, 111, true], [111, 179, false], [179, 184, true], [184, 233.5, false], [233.5, ROOF, true],
]
for (const [z0, z1, mech] of bands) {
  const top = z1 === ROOF
  prism({ wall: mech ? louvre : concrete, win: mech ? null : win, roof: top ? roof : null, coping: concrete, ring: TOWER, z0, z1, facade: mech ? null : shaft, bevel: 0.5 })
}
finishModel('MetLife Building', 'nyc-metlife-building', [
  { part: concrete, material: finish('metlife-concrete', 0xd9d6cc) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: louvre, material: finish('metlife-louvre', 0x6f767b) },
], { bearing: 29, osm: 'way/137564642', height: ROOF })
