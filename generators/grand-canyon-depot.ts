/**
 * Grand Canyon Railway Depot, Grand Canyon Village, South Rim (1909–10,
 * Francis W. Wilson for the Santa Fe Railway) — original procedural
 * geometry, CC0-1.0.
 * bun generators/grand-canyon-depot.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of OSM way/171147658 (-112.136673, 36.056799).
 * Bearing 350.4: the model's +x runs along the tracks (80.4°), −y faces
 * the platform and the tracks.
 *
 * Identity: one of the few log depots in the US. A two-storey central block
 * of logs below and boards above under a steep front gable, toward the
 * tracks, with deep bracketed eaves (the "GRAND CANYON" sign board); a small
 * gabled entry porch under it; lower one-storey log wings to either side
 * with broad hipped shingle roofs, the west one running on as an open
 * platform canopy on log posts; saddle-notched log corners.
 *
 * Evidence:
 *  - plan: OSM way/171147658 (28 × 15 m with the south bay); USGS NAIP;
 *    USGS 3DEP lidar AZ_GrandCanyonNP_1_2019 (1 m grid): main block
 *    x 0.5..10.5, west wing and canopy x −19..0.5, east wing to x 15.5.
 *  - heights (measured, lidar, flat ground at 2094 m): main ridge 9–9.4,
 *    main eaves ≈ 6; west wing ridge 5, eaves 3; east wing ridge 6.5.
 *    Porch, windows and log corners: estimated from the photos.
 *  - colour (photos, pulled light): brown logs and boards, red-brown
 *    shingle roofs.
 *
 * Photos (Wikimedia Commons, evidence): Grand_Canyon_Railway_Station_2015_
 * 003.jpg — Mike Peel, CC BY-SA 4.0; Grand_Canyon_Village-Grand_Canyon_
 * Railroad_Depot-1901-1.jpg — Marine 69-71, CC BY-SA 4.0; RAILWAY_STATION_
 * AND_EL_TOVAR_HOTEL,_FACING_WNW ... 1994,_HAER.jpg — Brian C. Grogan,
 * HAER, public domain. No look-only sources. No commercial imagery.
 *
 * Doubts: the north (road) side is drawn from lidar and NAIP only; the
 * sign lettering, the eave brackets and the platform benches are left out.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { rect, save, type XY } from './chi-museum-of-science-industry'
import { gable, lofted, post, prism, windowRow } from './grand-canyon-el-tovar'

const logs = new Part(), roof = new Part(), win = new Part()

// Central block: logs and boards to the eaves, the front gable to the tracks.
prism(logs, rect(0.5, -6.5, 10.5, 6.5), 0, 6.0, null)
gable(roof, logs, 0.5, 10.5, -6.5, 6.5, 6.0, 9.4, 1.3, 'y')
// Sign board on the gable.
prism(logs, rect(2.6, -6.9, 8.4, -6.5), 6.3, 7.3)
windowRow(win, [0.5, -6.5], [10.5, -6.5], [[4.0, 5.4]], 1.4, 2.4, 2.4, 7.6)
windowRow(win, [10.5, 6.5], [0.5, 6.5], [[4.0, 5.4], [1.0, 2.4]], 1.4, 2.6, 2.4, 7.6)
windowRow(win, [0.5, 6.5], [0.5, -6.5], [[4.0, 5.4]], 1.3, 3.0, 2.5, 10.5)
windowRow(win, [10.5, -6.5], [10.5, 6.5], [[4.0, 5.4]], 1.3, 3.0, 2.5, 10.5)
// Gabled entry porch on the track side.
prism(logs, rect(2.6, -8.6, 6.4, -6.5), 0, 3.0, null)
gable(roof, logs, 2.6, 6.4, -8.6, -6.5, 3.0, 4.9, 0.5, 'y')
windowRow(win, [2.6, -8.6], [6.4, -8.6], [[0.0, 2.3]], 1.3, 9, 1.9, 1.9)
windowRow(win, [6.5, -6.5], [10.5, -6.5], [[0.9, 2.5]], 1.2, 9, 2.0, 2.0)

// West wing: one storey of logs, with a broad hip that runs on west over
// the open canopy and out over the platform on posts.
prism(logs, rect(-15, -3.5, 0.5, 4.5), 0, 3.2, null)
lofted(roof, rect(-19.2, -6.0, 0.5, 6.2), [[-0.3, 3.2], [5.6, 5.3]])
for (const x of [-18.9, -15, -11, -7, -3]) post(logs, x, -5.7, 0, 3.2, 0.2)
for (const y of [-1.5, 2.5]) post(logs, -18.9, y, 0, 3.2, 0.2)
post(logs, -18.9, 5.9, 0, 3.2, 0.2)
windowRow(win, [-15, -3.5], [0.5, -3.5], [[0.9, 2.4]], 1.4, 3.2, 2.5, 13.5)
windowRow(win, [0.5, 4.5], [-15, 4.5], [[0.9, 2.4]], 1.4, 3.2, 2.0, 13.5)

// East wing: one storey under a taller hip.
prism(logs, rect(10.5, -6.0, 15.5, 6.5), 0, 3.6, null)
lofted(roof, rect(10.5, -6.0, 15.5, 6.5), [[-0.8, 3.6], [2.4, 6.4]])
windowRow(win, [15.5, -6.0], [15.5, 6.5], [[0.9, 2.5]], 1.4, 3.6, 2.5, 10)
windowRow(win, [10.5, -6.0], [15.5, -6.0], [[0.9, 2.5]], 1.4, 9, 2.5, 2.5)

// Saddle-notched corners: log ends standing proud at each wing corner.
for (const [x, y] of [[-15, -3.5], [-15, 4.5], [0.5, -6.5], [10.5, -6.5], [15.5, -6.0], [15.5, 6.5], [0.5, 6.5], [10.5, 6.5]] as XY[])
  prism(logs, rect(x - 0.45, y - 0.45, x + 0.45, y + 0.45), 0, 3.4)

await save('grand-canyon-depot', 'Grand Canyon Railway Depot', [
  { part: logs, material: finish('depot-logs', 0x8b6d56) },
  { part: roof, material: finish('depot-shingle', 0x86593f) },
  { part: win, material: PALETTE.window },
], { height: 9.4 })
