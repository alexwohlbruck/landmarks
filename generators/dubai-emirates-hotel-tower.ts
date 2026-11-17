/**
 * Jumeirah Emirates Towers Hotel, Dubai — original procedural geometry, CC0-1.0.
 * bun generators/dubai-emirates-hotel-tower.ts
 *
 * The shorter of the twin Emirates Towers. Built with `buildEmiratesTower`
 * from `dubai-emirates-office-tower.ts`, whose header holds the shared
 * evidence, the photo credits and the reasoning for which outline is which.
 *
 * Frame: map frame, x east, y north, z up, metres; origin at the centroid of
 * OSM way/393391114 (the WEST tower, 55.2823759 E 25.2175816 N), BEARING 0:
 * the plan is this outline's own geometry, unrotated.
 *
 * Identity: OSM names way/393391114 "Emirates Office Tower", but it is the
 * hotel. Wikidata puts the hotel (Q1049027) at 55.28194 E, west of the office
 * (Q845182, 55.28333 E); this outline's building:parts stop at 309 m, the
 * hotel's published tip; and photos from known sides (from the north-east on
 * Sheikh Zayed Road with Burj Khalifa behind, 2009; from the north on SZR,
 * 2022) show the short-crowned tower on the west.
 *
 * Numbers
 * - Tip 309 m: published (Wikipedia, antenna spire). Crown high corner 268 m:
 *   published roof 269 m; the dawn photo gives 0.86 of the height (265).
 * - Crown low edge 228 m: OSM part 974 (min_height 230) and the dawn photo
 *   (0.73 of 309 = 225), just over the published 222.5 m top floor.
 * - Top of the glass and floor of the corner notch 195 m: OSM 978/979 (197)
 *   and the dawn photo (0.62 = 192).
 * - Spire step 281 m: estimated from the dawn photo. OSM's spire parts
 *   (983: 275-294, 984: 292-309) agree on the tip.
 * - Portal 42 m: estimated from the dawn photo (0.13) and the panoramio pair
 *   (0.13); OSM tags the legs and drum 57 m, which the photos don't bear out
 *   for the portal opening.
 * - Plan: OSM way/393391114 and parts 975-982, measured (54 m sides).
 * - Glass bands: three floors to a panel (11 m pitch), estimated.
 * Replaces the outline and every part inside it (1001192974-1001192984).
 * The surrounding podium (way/28743901, the Boulevard) is not replaced.
 * Terrain: Mapterhorn has no tiles here; not checked. Flat site; elevation 0.
 */
import { writeTower } from './dubai-emirates-office-tower'

await writeTower({
  id: 'dubai-emirates-hotel-tower',
  name: 'Jumeirah Emirates Towers Hotel',
  anchor: { lng: 55.2823759, lat: 25.2175816 },
  bearing: 0,
  replaces: [
    'way/393391114',
    'way/1001192974', 'way/1001192975', 'way/1001192976', 'way/1001192977', 'way/1001192978',
    'way/1001192979', 'way/1001192980', 'way/1001192981', 'way/1001192982', 'way/1001192983', 'way/1001192984',
  ],
  portal: 42,
  glassTop: 195,
  crownLow: 228,
  crownHigh: 268,
  spireStep: 281,
  tip: 309,
  pitch: 11,
  planScale: 1,
})
