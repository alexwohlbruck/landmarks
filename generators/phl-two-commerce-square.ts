/**
 * Two Commerce Square, 2001 Market Street, Philadelphia (Pei Cobb Freed &
 * Partners, 1992) — original procedural geometry, CC0-1.0.
 * bun generators/phl-two-commerce-square.ts
 *
 * Built with `buildCommerceTower` from generators/phl-one-commerce-square.ts
 * (merge that one first); the form, colours, estimates and photo credits are
 * described there. This file holds only Two's own plan and heights.
 *
 * Map frame, turned to the building: +x east along Market Street, +y north,
 * z up, metres. BEARING 9.0, the Center City grid. Origin = area centroid of
 * the OSM outline way/333939824 (-75.173562, 39.954143), on the ground.
 *
 * How the twins differ (OSM, lidar, the skyline crop): Two is One mirrored
 * east-west. Its 66 m and 31 m steps take the outer (east) half of the north
 * and south ends, and its 108 m wings stop 4 m short of the plaza (west)
 * side, as One's stop short of its east side; its podium wings run west
 * across the plaza side (including the connector toward One). Heights agree
 * with One's within 0.7 m; each tower uses its own lidar numbers.
 *
 * Evidence
 * - OSM way/333939824 (outline, Two Commerce Square, 2001 Market St) and its
 *   parts way/333316059 (main block, 160.9 m), way/333434761 (attic,
 *   172.2 m), way/333316065 and way/333434759 (wings, 113 m), way/333316066
 *   and way/333434762 (steps, 72 m), way/333316067 and way/333434763 (steps,
 *   35 m), way/344020957 and way/344020958 (podium, 15 m). All are replaced.
 * - USGS 3DEP lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015),
 *   0.5 m grid in this frame, above Market Street: main roof 156.9 m (+2.2 m
 *   parapet), attic 165.1 m (x -20..21.5, y -4.5..4.5), lantern peaks 169.6 m
 *   at x -23 and +24, wings 107.2 m, steps 65.2 m and 31.0 m, podium 11.9 m.
 * - Mapterhorn terrain: about 2 m of rise to the north; elevation 0.
 * - Published: 565 ft (172 m), 39 storeys, 1992 (Wikipedia, "Commerce
 *   Square").
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "Commerce Square cropped.jpg", GardenStreetBridgeSchuylkillRiverSkyline,
 *   CC BY 3.0 (both towers from the north-west)
 *   https://commons.wikimedia.org/wiki/File:Commerce_Square_cropped.jpg
 * - "Commerce Square Philadelphia a.jpg", Wobbanight, CC0 (both towers from
 *   below)
 *   https://commons.wikimedia.org/wiki/File:Commerce_Square_Philadelphia_a.jpg
 *
 * Doubts: as for One Commerce Square; the podium's outline toward One is
 * simplified to three boxes.
 */
import { saveTower } from './phl-comcast-center'
import { buildCommerceTower } from './phl-one-commerce-square'

const parts = buildCommerceTower({
  main: [-22.3, 23.8, -13.9, 15.2],
  wings: [[-18.7, 24.1, -22.8, -13.5], [-18.6, 23.9, 14.8, 24.3]],
  steps72: [[-9.3, 24.1, -31.5, -22.4], [-9.2, 24.0, 23.9, 33.7]],
  steps35: [[4.5, 24.0, -40.9, -31.1], [4.8, 24.3, 33.3, 42.5]],
  podium: [[-22.6, 4.6, -40.9, -13.5], [-27.6, -22.2, -35.5, -21.5], [-36.7, -27.2, -27.1, -21.6], [-22.3, 5.0, 14.8, 42.7]],
  attic: [-20.0, 21.5, -4.5, 4.5],
  lanterns: [[-22.0, -0.5], [23.0, -0.5]],
  h: { main: 156.9, wing: 107.2, s72: 65.2, s35: 31.0, podium: 11.9, attic: 165.1, lantern: 169.6 },
})
await saveTower('phl-two-commerce-square', 'Two Commerce Square', parts, {
  bearing: 9.0, anchor: { lng: -75.173562, lat: 39.954143 }, height: 169.6,
  replaces: ['way/333939824', 'way/333316059', 'way/333434761', 'way/333316065', 'way/333434759', 'way/333316066', 'way/333434762', 'way/333316067', 'way/333434763', 'way/344020957', 'way/344020958'],
})
