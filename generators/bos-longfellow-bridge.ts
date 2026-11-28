/**
 * Longfellow Bridge, Boston–Cambridge (1900–1906, engineer William Jackson,
 * architect Edmund M. Wheelwright; rebuilt 2013–2018, architect Miguel
 * Rosales) — procedural, CC0-1.0. bun generators/bos-longfellow-bridge.ts
 *
 * The "salt and pepper" bridge as one placement, end to end of its OSM
 * outline (way/148646760): eleven steel arch spans with open spandrels on ten
 * granite piers with rounded cutwaters, the two great central piers with the
 * four domed towers on their ends, the abutments with their small domed stair
 * towers, the dark ornamental railing, the sidewalks and the Red Line's two
 * tracks between their fences (the model's: it owns walkways and tracks on
 * the bridge; the map draws the road surfaces). Writes a low model (ribs and
 * spandrel posts on the fascias only, the railing a solid band) and a detail
 * model (six ribs a span, every post, railing balusters, rails and fences,
 * lamp posts), which the map draws from detailZoom up.
 *
 * Frame: x across (+x south), y along toward Boston, z up, metres. Origin on
 * the deck axis at midspan of the central span. Placed at bearing 95.87°, the
 * deck axis in the lidar (OSM outline's principal axis 94.90°; the deck runs
 * about 1° off it). z = 0 is the river: NAVD88 - 0.25 m (the map's Mapterhorn
 * water; the lidar's reads 0.3).
 *
 * Lidar: USGS 3DEP MA_CentralEastern_1_2021 (2021 flight, after the rebuild;
 * tools/lidar.py at 1 m over the whole bridge, resampled into the frame).
 * Measured:
 * - roadway (tools/bridge_ele.py measure on both carriageways, within 0.05 m
 *   of each other): ROAD_NAVD below; a 3.0 % climb from Cambridge, a crest
 *   curve over the central span at 12.71 m NAVD88, 3.0 % down to the Boston
 *   abutment's fill. The OSM `ele` tags that give the map the same roadway are
 *   in ~/landmarks-scratch/osm-ele/bos-longfellow-bridge.osc (not uploaded).
 *   The Red Line's rails (way/89784393) follow it to y = 200, then hold at
 *   8.2-8.4 m into Charles/MGH station.
 * - deck: parapets at x = +-16.3 (published width 105 ft, 32 m); sidewalks
 *   to curbs at -12.3 (north, with the cycle lane) and +12.8 (south); track
 *   fences at +-4.
 * - piers: centres y = +-37 (central), +-97, +-147.8, +-194.6, +-237;
 *   abutment faces +-271.4 (538.7 m apart; published 1,767 ft 6 in, 538.73 m,
 *   between abutments). Small piers' cutwaters out to x = +-22.5 with tops
 *   about 4.6 m over the river; bays at the sidewalk to about x = +-18.
 * - towers: centres x = +-20.15, y = +-37; plinth step 17.1, shaft cornice
 *   23.9, lantern cornice 26.9-27.4, dome 29.5, finial 30.4 m NAVD88; shaft
 *   about 6.8 m, lantern 6.0 m (published 58 ft tall, 17.7 m: the finial is
 *   17.7 m over the deck).
 * - stair towers at the abutments: 4.7 m square, body to 13.6, dome to 15.1 m.
 * Published (Wikipedia "Longfellow Bridge"): eleven steel arch
 * spans on ten masonry piers; arches 101 ft 6 in (30.94 m) to 188 ft 6 in
 * (57.45 m), rise 8 ft 6 in (2.59 m) to 26 ft 6 in (8.08 m); headroom 26 ft
 * (7.9 m) at mean high water; central piers 188 ft by 53 ft 6 in (16.31 m).
 *
 * Photos (Wikimedia Commons; all evidence):
 * - "Longfellow Bridge Boston November 2016", King of Hearts, CC BY-SA 4.0:
 *   broadside from the north, all eleven arches and piers.
 *   https://commons.wikimedia.org/wiki/File:Longfellow_Bridge_Boston_November_2016.jpg
 * - "Boston Skyline and Longfellow Bridge August 2024", 4300streetcar, CC BY
 *   4.0: broadside from the north-east; arch depths, piers, towers.
 *   https://commons.wikimedia.org/wiki/File:Boston_Skyline_and_Longfellow_Bridge_August_2024.jpg
 * - "Aerial photos of Longfellow Bridge and downtown Boston skyline",
 *   CaribDigita, CC BY-SA 4.0: from high at the Cambridge end; deck layout,
 *   tracks between fences, pier bays, cutwaters, stair tower.
 *   https://commons.wikimedia.org/wiki/File:Aerial_photos_of_Longfellow_Bridge_and_downtown_Boston_skyline.jpg
 * - "Main Piers Longfellow Bridge", EgorovaSvetlana, CC BY-SA 4.0: a central
 *   pier and its two towers close up (stages, oculus, slit, dome; rib depth).
 *   https://commons.wikimedia.org/wiki/File:Main_Piers_Longfellow_Bridge.jpg
 * - "Longfellow Bridge with towers (34602)", CaribDigita, CC BY-SA 4.0: the
 *   towers from above.
 *   https://commons.wikimedia.org/wiki/File:Longfellow_Bridge_with_towers_(34602).jpg
 * - "Longfellow Bridge Span 9 Arch Repairs", MassDOT, public domain: the arch
 *   ribs under the deck.
 *   https://commons.wikimedia.org/wiki/File:Longfellow_Bridge_Span_9_Arch_Repairs_(25842203004).jpg
 * - Night: "Longfellow Bridge at Night", Ethan Long, CC BY-SA 2.0: lamp posts
 *   lit along the parapets, towers unlit.
 *   https://commons.wikimedia.org/wiki/File:Longfellow_Bridge_at_Night_(53812970692).jpg
 *
 * Estimated:
 * - arches: rise in proportion to the clear span between the published
 *   extremes; the crown's soffit 2.6-4.3 m under the road (puts the central
 *   soffit 8.1 m over the river, against the published 7.9 m headroom, and
 *   springs every arch between the waterline and 2 m up, as the photos show);
 *   circular segments; ribs 1.7 m deep at the crown, 2.6 m at the springing;
 *   six ribs a span (detail; the photos show several, their number is not
 *   counted); spandrel posts about 3.6 m apart (twice that, on the fascias
 *   only, in the low model).
 * - girder 2.2 m under the road; railing 1.1 m over the sidewalk; soffit slab
 *   1.0-1.4 m under the road, left out where it would sit in the map's ground.
 * - the Memorial Drive span at the Cambridge end (y -323.5 to -292) drawn as
 *   a girder span on the abutment; the abutments' extents along the bridge.
 * - stair flights: 10 m sloped blocks out from each stair tower (the real
 *   stairs' run is not measured).
 * - lamps: posts about 25 m apart on both parapets, 5.2 m tall (from the
 *   night photo; not counted).
 *
 * Ends (bridge rules): at Cambridge the deck lands on Main Street (road 4.9 m
 * NAVD88, bare earth 4.6 m) with a granite end wall; at Boston it comes down
 * onto the abutment's fill, the walls running into the map's ground, and the
 * tracks stop where Charles/MGH station's building begins (y = 278).
 *
 * Ground: Mapterhorn z15 under the site (tools/terrain.ts grid, 5 m), as the
 * GROUND table; feet sink 0.4 m (abutment walls 0.6 m) into it.
 *
 * Doubts:
 * - The arch geometry (rise per span, crown depth, rib count) is estimated
 *   from the published end values and photos, not measured: the lidar sees
 *   only the deck.
 * - Colours: the steel is painted a dark bronze-grey since the rebuild,
 *   drawn #55504a; the granite #cdc6b8.
 * - The towers' Viking-prow carvings and the city seals on the central piers
 *   are left out (fine sculpture).
 * - Charles/MGH station (way/485921731) is not replaced; its platforms on the
 *   bridge (y 242-278) are drawn as plain slabs, their canopies left to it.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { band, bead, face, footedLoft, footedWall, groundAt, piecewise, rod, stations, type GroundGrid } from './bridge-kit'
import { countParts, loftSolid, one } from './sf-golden-gate-bridge'
import { finish } from './palette'

// ---- Measurements -------------------------------------------------------------

/** The model's z is NAVD88 less the river (0.25 m: Mapterhorn's water; the lidar's reads 0.3). */
const Z0 = 0.25

/**
 * The roadway, metres NAVD88 (tools/bridge_ele.py on both carriageways, which
 * agree within 0.05 m), by y: a straight 2.9 % climb from the Cambridge end,
 * a vertical curve over the central span (crest 12.71 m), the same grade down
 * to the Boston end, where it lands on the abutment's fill from y = 274.
 */
const ROAD_NAVD = piecewise([
  [-323.5, 4.85], [-318.4, 4.92], [-298.4, 5.68], [-280.5, 6.17], [-262.3, 6.68], [-247.3, 7.12], [-227.3, 7.74],
  [-213.2, 8.16], [-193.2, 8.79], [-174.9, 9.33], [-154.9, 9.94], [-134.9, 10.53], [-114.9, 11.12], [-92.8, 11.69],
  [-72.8, 12.11], [-52.8, 12.40], [-32.8, 12.60], [-10.3, 12.71], [2.2, 12.71], [22.2, 12.66], [35.0, 12.53],
  [47.3, 12.43], [59.3, 12.28], [71.4, 12.08], [84.0, 11.84], [95.5, 11.58], [108.5, 11.24], [128.5, 10.66],
  [152.8, 9.94], [167.1, 9.49], [187.1, 8.92], [206.0, 8.33], [221.1, 7.87], [232.0, 7.56], [243.1, 7.21],
  [263.1, 6.62], [274.1, 6.27], [285.6, 5.86], [297.4, 5.34], [309.8, 4.84], [319.6, 4.44],
])
const road = (y: number) => ROAD_NAVD(y) - Z0
/** The Red Line's rails (bridge_ele.py on way/89784393): with the road to y = 200, then held up for Charles/MGH station. */
const RAIL_NAVD = piecewise([[190, 8.89], [210, 8.40], [230, 8.15], [243.2, 8.22], [263.2, 8.15], [283.2, 8.43]])
const rail = (y: number) => (y < 200 ? road(y) : Math.max(road(y), RAIL_NAVD(y) - Z0))

const Y0 = -323.5, Y1 = 313.5          // the outline's ends: Cambridge (Main Street), Boston (Charles Circle)
const ABUT_C = -271.4, ABUT_B = 271.4  // abutment faces (lidar; 538.7 m apart, published 538.73)
const ABUT_C_BACK = -292, ABUT_B_BACK = 300
const STATION = 278                     // Charles/MGH station's building starts here; the tracks are the map's beyond
/** Pier centres (lidar), Cambridge to Boston, and half-widths along the bridge. */
const PIERS: { y: number; hw: number; central: boolean }[] = [
  -237, -194.6, -147.8, -97, -37, 37, 97, 147.8, 194.6, 237,
].map((y) => ({ y, hw: Math.abs(y) === 37 ? 8.15 : 3.4, central: Math.abs(y) === 37 }))

// Deck section (lidar): parapets at x = +-16.3, sidewalks out to the curbs at
// -12.3 (north, with the cycle lane) and +12.8 (south), the Red Line's two
// tracks between fences at +-4.
const OUT = 16.3
const WALK_N = [-16.0, -12.3], WALK_S = [12.8, 16.0], TRACK = 4.0
const walk = (y: number) => road(y) + 0.15
const railTop = (y: number) => road(y) + 1.25

// The map's ground (Mapterhorn z15, tools/terrain.ts grid at the anchor,
// bearing 95.87), metres above the river (0.25 m NAVD88), 5 m apart: x from -50, y from -340.
const GROUND: GroundGrid = { y0: -340, x0: -50, step: 5, z: [
  [2.5,2.8,2.9,2.8,3.0,3.3,3.6,3.9,4.0,4.0,4.0,4.0,3.8,3.9,4.0,3.8,3.1,2.8,2.6,2.4,2.3],
  [2.8,3.0,2.8,3.0,3.2,3.4,3.7,4.0,4.1,4.1,4.2,4.1,4.0,4.4,4.5,4.7,4.2,2.8,2.6,2.3,2.1],
  [3.0,2.8,2.9,3.1,3.2,3.3,3.5,3.9,4.1,4.3,4.3,4.3,3.9,4.3,4.5,4.5,3.8,2.7,2.4,2.2,2.0],
  [2.8,2.7,2.9,3.0,2.9,3.4,3.9,4.1,4.3,4.4,4.5,4.3,3.8,4.1,4.4,3.9,3.2,2.5,2.3,2.0,1.9],
  [2.6,2.7,2.9,2.8,3.2,3.8,4.1,4.5,4.4,4.6,4.7,4.4,3.1,4.2,4.4,3.8,2.9,2.3,2.2,1.8,1.8],
  [2.6,2.7,2.6,2.8,3.4,3.9,4.2,4.6,4.6,4.6,4.8,4.7,3.7,3.3,4.1,3.3,2.5,2.0,1.9,1.6,1.8],
  [2.6,2.6,2.5,2.8,3.2,3.4,3.4,3.6,3.7,3.8,3.8,4.6,4.3,3.5,2.9,2.6,2.1,1.8,1.6,1.5,1.8],
  [2.5,2.4,2.2,2.4,2.3,2.4,2.2,2.2,2.4,2.4,2.5,3.5,4.5,2.7,1.8,1.8,1.7,1.5,1.3,1.5,2.0],
  [2.5,2.3,2.0,1.9,1.9,1.7,1.6,1.6,1.6,1.6,1.6,1.6,1.7,1.5,1.4,1.4,1.2,1.1,1.4,1.7,2.0],
  [2.4,2.2,2.0,1.7,1.5,1.3,1.1,0.9,0.8,0.7,0.5,0.4,0.4,0.5,0.6,0.8,1.1,1.3,1.6,1.9,2.2],
  [2.3,2.2,2.0,1.8,1.5,1.3,1.1,0.9,0.8,0.7,0.5,0.5,0.5,0.7,0.8,1.1,1.3,1.6,1.9,2.2,2.5],
  [2.5,2.3,2.0,1.8,1.7,1.5,1.3,1.2,1.1,1.0,0.9,0.9,1.0,1.1,1.4,1.6,2.0,2.2,2.4,2.5,2.6],
  [2.5,2.5,2.3,2.1,1.9,1.9,1.8,1.8,1.7,1.6,1.4,1.7,2.3,1.9,2.0,2.3,2.3,2.4,2.5,2.5,2.5],
  [2.2,2.2,2.0,1.6,0.7,0.9,1.7,1.7,1.6,1.6,1.5,2.0,2.3,2.3,2.0,1.7,1.0,1.1,1.6,1.6,1.8],
  [0.0,0.0,0.0,0.0,0.0,0.2,1.4,1.6,1.5,1.5,1.5,1.7,1.8,1.9,1.4,1.2,0.1,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.5,1.3,1.3,1.3,1.3,1.3,1.3,1.4,1.5,1.4,1.5,0.1,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.4,1.0,0.9,0.8,1.0,1.4,1.3,0.9,0.8,0.9,0.9,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.3,0.6,0.6,1.0,1.5,1.3,1.2,1.0,0.4,0.5,0.7,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.3,0.7,1.2,1.6,1.4,1.3,1.1,1.0,0.8,0.9,1.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.3,1.4,1.4,1.3,1.3,1.3,1.3,1.2,1.2,1.3,0.5,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.2,1.2,1.0,0.9,0.8,0.8,0.8,0.8,1.1,1.1,0.1,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.3,0.8,0.5,0.5,0.4,0.4,0.6,0.7,0.3,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.1,0.0,0.0,0.1,0.1,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.7,0.6,0.5,0.5,0.5,0.6,0.7,0.4,0.3,0.2,0.2,0.1,0.0,0.1,0.1,0.1,0.1,0.0,0.1,0.0,0.0],
  [1.3,1.3,1.1,1.2,1.4,1.4,1.0,0.7,0.4,0.5,0.5,0.2,0.2,0.3,0.2,0.3,0.4,0.5,0.8,0.8,0.7],
  [1.3,1.3,1.2,1.2,1.3,1.4,1.0,0.7,0.8,1.0,0.7,0.4,0.4,0.4,0.4,0.5,0.7,0.8,1.0,1.1,1.1],
  [1.4,1.3,1.3,1.3,1.3,1.2,0.9,1.0,1.4,1.4,1.0,0.6,0.5,0.6,0.5,0.6,0.8,1.0,1.2,1.2,1.1],
  [1.4,1.3,1.3,1.2,1.1,1.0,1.3,1.6,1.9,1.6,1.2,0.9,0.6,0.7,0.7,0.8,1.0,1.2,1.4,1.4,1.3],
  [1.1,1.0,1.0,1.0,1.0,1.3,1.8,2.2,2.3,1.9,1.5,1.1,0.8,0.9,0.9,1.0,1.2,1.4,1.3,1.4,1.4],
  [1.1,1.1,1.1,1.1,1.1,1.3,2.4,2.7,2.5,2.1,1.8,1.4,1.0,1.0,1.1,1.2,1.4,1.4,1.3,1.3,1.4],
  [1.1,1.0,1.2,1.3,1.3,1.4,2.8,3.1,2.8,2.4,2.0,1.6,1.2,1.1,1.2,1.4,1.4,1.4,1.4,1.3,1.4],
  [1.1,1.2,1.3,1.4,1.4,1.5,2.4,3.1,2.9,2.6,2.2,1.9,1.5,1.2,1.4,1.4,1.5,1.5,1.5,1.6,1.5],
  [0.9,0.9,0.9,1.3,1.4,1.4,1.4,1.3,1.2,1.2,1.2,1.3,1.2,1.3,1.2,1.2,1.3,1.4,1.5,1.5,1.5],
  [0.9,1.0,1.0,1.2,1.2,1.1,1.1,1.0,1.0,1.0,1.0,0.9,0.9,0.9,1.1,1.1,1.2,1.2,1.3,1.4,1.6],
  [1.1,1.2,1.1,1.0,0.9,0.9,0.8,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,1.0,1.2,1.3,1.4],
  [1.2,1.1,1.0,1.0,0.9,0.8,0.9,1.6,2.0,1.8,1.7,1.7,1.6,1.2,0.9,0.9,0.9,1.0,1.1,1.2,1.3],
  [1.1,1.0,1.0,1.0,1.0,1.0,1.0,2.0,3.7,4.0,3.9,3.8,3.5,1.4,0.9,0.9,0.9,1.0,1.0,1.1,1.3],
  [1.0,0.9,0.9,0.9,1.1,1.2,1.4,2.5,4.5,5.9,6.0,5.8,4.2,1.9,1.2,1.2,1.1,1.1,1.2,1.3,1.4],
  [0.8,0.9,1.0,1.1,1.4,1.4,2.0,5.3,5.8,6.9,7.9,6.6,5.8,3.6,1.4,1.5,1.3,1.2,1.2,1.3,1.5],
  [0.9,1.0,1.3,1.4,1.6,1.7,4.9,6.1,5.9,6.9,8.1,6.6,6.0,5.3,2.1,1.6,1.5,1.6,1.6,1.6,1.5],
  [0.9,1.0,1.8,2.1,2.0,2.0,3.5,5.9,5.8,6.7,8.1,6.5,5.8,5.1,2.6,1.7,1.7,1.7,1.9,1.9,2.0],
  [1.1,1.4,2.2,2.1,2.3,2.1,1.8,4.6,5.6,6.8,8.3,6.8,5.6,5.2,1.7,1.7,1.6,1.6,2.1,2.5,2.5],
  [1.2,2.3,2.7,2.2,2.1,2.1,2.2,4.7,5.4,6.8,8.4,6.9,5.4,4.2,1.7,1.8,2.4,2.7,3.0,3.0,2.9],
  [1.8,2.5,2.8,2.6,2.4,2.3,3.0,5.1,5.2,6.6,8.4,6.8,5.1,5.2,2.0,3.0,3.3,3.2,3.0,2.9,2.8],
  [1.8,2.4,2.9,2.8,2.7,2.8,3.7,5.1,5.1,6.5,8.5,6.8,4.9,4.9,2.6,3.5,3.3,3.1,3.1,3.1,3.0],
  [2.2,2.5,2.8,3.1,3.3,3.5,4.4,4.9,4.9,6.5,8.5,6.6,4.7,4.7,2.8,3.4,3.2,3.3,3.3,3.5,2.9],
  [2.7,3.1,3.4,3.3,3.6,4.1,4.5,4.6,4.7,6.5,8.6,6.6,4.5,3.7,3.1,3.4,3.4,3.5,3.3,3.4,2.5],
  [3.8,3.4,3.4,3.7,3.9,4.2,4.2,4.4,4.5,6.5,8.7,6.6,4.2,4.2,3.4,3.4,3.5,3.3,3.2,2.8,2.4],
  [4.3,4.2,4.0,3.9,4.0,4.0,4.1,4.3,4.4,6.3,8.7,6.2,4.0,4.0,3.5,3.4,3.6,3.2,2.9,2.5,2.4],
  [3.7,4.1,4.0,4.0,4.0,4.1,4.1,4.2,4.3,6.0,8.7,6.5,3.8,3.8,3.6,3.5,3.6,3.0,2.7,2.4,2.6],
  [2.5,3.3,3.9,3.9,4.1,4.1,4.0,4.0,4.1,6.1,8.4,6.8,3.7,3.7,3.6,3.4,3.6,3.0,2.6,2.5,2.8],
  [2.7,2.8,3.4,3.8,3.9,4.0,3.9,3.9,3.9,4.9,5.2,4.8,3.6,3.5,3.5,3.4,3.4,3.0,2.7,2.7,2.9],
  [2.7,2.9,3.1,3.8,3.7,3.8,3.7,3.7,3.8,3.7,3.7,3.6,3.4,3.4,3.4,3.3,3.3,3.1,3.0,2.9,3.0],
] }

const ground = (x: number, y: number): number => groundAt(GROUND, x, y)
const foot = (x: number, y: number): number => Math.max(0, ground(x, y) - 0.4)
/** Walls along the abutments sink deeper: the ground falls steeply off their sides. */
const wallFoot = (x: number, y: number): number => Math.max(0, Math.min(...[-1.5, 0, 1.5].map((d) => ground(x + d, y))) - 0.6)

// ---- Parts ---------------------------------------------------------------------

type Lod = 'low' | 'detail'
type Kit = { stone: Part; steel: Part; walk: Part; ballast: Part; under: Part; lamp: Part }
const newKit = (): Kit => ({ stone: new Part(), steel: new Part(), walk: new Part(), ballast: new Part(), under: new Part(), lamp: new Part() })

/** A stadium (a rectangle with semicircular ends along x) centred on (0, cy): straight part to +-ex, radius r; CCW from above. */
function stadium(cy: number, ex: number, r: number, z: number, seg: number): V3[] {
  const pts: V3[] = []
  for (let i = 0; i <= seg; i++) {
    const a = -Math.PI / 2 + (Math.PI * i) / seg
    pts.push([ex + r * Math.cos(a), cy + r * Math.sin(a), z])
  }
  for (let i = 0; i <= seg; i++) {
    const a = Math.PI / 2 + (Math.PI * i) / seg
    pts.push([-ex + r * Math.cos(a), cy + r * Math.sin(a), z])
  }
  return pts
}

/** A plan rectangle with chamfered corners, CCW from above, at z. */
function rect(cx: number, cy: number, hx: number, hy: number, c: number, z: number): V3[] {
  return ([[cx - hx + c, cy - hy], [cx + hx - c, cy - hy], [cx + hx, cy - hy + c], [cx + hx, cy + hy - c],
    [cx + hx - c, cy + hy], [cx - hx + c, cy + hy], [cx - hx, cy + hy - c], [cx - hx, cy - hy + c]] as [number, number][])
    .map(([x, y]) => [x, y, z] as V3)
}

/** A half disc (or its ring wall) beyond the parapet at x = s * OUT, centred at y. */
function halfRing(cx: number, cy: number, r: number, s: number, seg: number): [number, number][] {
  const out: [number, number][] = []
  for (let i = 0; i <= seg; i++) {
    const a = -Math.PI / 2 + (Math.PI * i) / seg
    out.push([cx + s * r * Math.cos(a), cy + s * r * Math.sin(a)])
  }
  return out
}

/** A triangle wound to face n. */
function tri3(p: Part, a: V3, b: V3, c: V3, n: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const d = (u[1] * v[2] - u[2] * v[1]) * n[0] + (u[2] * v[0] - u[0] * v[2]) * n[1] + (u[0] * v[1] - u[1] * v[0]) * n[2]
  if (d >= 0) p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  else p.tri(a, c, b, undefined, undefined, undefined, [n, n, n])
}

// ---- Arches -----------------------------------------------------------------------

type Span = { ya: number; yb: number; spring: number; crown: number }

/**
 * The eleven spans between the abutment faces and the piers' faces. Rise from
 * the published 2.59 m (abutment spans, 30.94 m) to 8.08 m (central, 57.45 m),
 * in proportion to the clear span; the crown's soffit a depth under the road
 * that grows from 2.6 m to 4.3 m with the span (estimated: it puts the central
 * arch's soffit at 7.9 m over the river, the published headroom, and springs
 * every arch between the waterline and 2 m up, as the photos show).
 */
function spans(): Span[] {
  const faces: [number, number][] = [[-Infinity, ABUT_C], ...PIERS.map((p) => [p.y - p.hw, p.y + p.hw] as [number, number]), [ABUT_B, Infinity]]
  const out: Span[] = []
  for (let i = 0; i < faces.length - 1; i++) {
    const ya = faces[i][1], yb = faces[i + 1][0], c = yb - ya
    const t = (c - 30.94) / (57.45 - 30.94)
    const rise = 2.59 + t * (8.08 - 2.59), depth = 2.6 + t * 1.7
    const crown = road((ya + yb) / 2) - depth
    out.push({ ya, yb, spring: crown - rise, crown })
  }
  return out
}

/** The arch's soffit (intrados) at y: a circular segment through the springings and the crown. */
function intrados(s: Span, y: number): number {
  const c = s.yb - s.ya, r = s.crown - s.spring
  const R = (c * c / 4 + r * r) / (2 * r), yc = (s.ya + s.yb) / 2
  return s.crown - R + Math.sqrt(Math.max(0, R * R - (y - yc) ** 2))
}

/** Rib depth: 1.7 m at the crown deepening to 2.6 m at the springing (estimated from the photos). */
const ribDepth = (s: Span, y: number) => 1.7 + 0.9 * ((2 * (y - (s.ya + s.yb) / 2)) / (s.yb - s.ya)) ** 2
const GIRDER = 2.2   // fascia girder depth under the road

function arches(k: Kit, lod: Lod) {
  const ribsX = lod === 'low' ? [OUT - 0.85] : [OUT - 0.85, 9.6, 3.2]
  for (const s of spans()) {
    const n = lod === 'low' ? 8 : 18
    const ys = stations(s.ya, s.yb, (s.yb - s.ya) / n)
    for (const side of [-1, 1]) for (const xc of ribsX) {
      const w = xc > 15 ? 0.85 : 0.6
      const x0 = side * xc, x1 = side * (xc + w)
      const outer = xc > 15
      // A rib stops where the map's ground (high at the Boston abutment) would bury it.
      const rys = ys.filter((y) => intrados(s, y) + ribDepth(s, y) > ground((x0 + x1) / 2, y) + 0.3)
      if (rys.length > 1) band(k.steel, Math.min(x0, x1), Math.max(x0, x1), rys, (y) => intrados(s, y) + ribDepth(s, y), (y) => intrados(s, y),
        { out: true, in: true, top: lod === 'detail', bottom: true })
      // Spandrel posts from the rib to the girder: thin plates on the fascia in
      // the low model, at about twice their real spacing; boxes at their real
      // spacing (about 3.6 m) in the detail model.
      const gap = lod === 'low' ? 7.2 : 3.6
      const m = Math.max(1, Math.round((s.yb - s.ya) / gap))
      for (let i = 1; i < m; i++) {
        const y = s.ya + ((s.yb - s.ya) * i) / m
        const z0 = intrados(s, y) + ribDepth(s, y) - 0.1, z1 = road(y) - GIRDER + 0.1
        if (z1 - z0 < 0.4) continue
        if (lod === 'low') {
          if (!outer) continue
          // Both faces, so the far fascia's posts show through the near one's, as in the photos.
          for (const [xf, d] of [[side * (OUT - 0.02), side], [side * (OUT - 0.5), -side]])
            face(k.steel, [xf, y - 0.3, z0], [xf, y + 0.3, z0], [xf, y + 0.3, z1], [xf, y - 0.3, z1], [d, 0, 0])
        } else {
          const xm = side * (xc + w / 2)
          band(k.steel, xm - 0.25, xm + 0.25, [y - 0.25, y + 0.25], () => z1, () => z0, { out: true, in: true, ends: true })
        }
      }
    }
  }
}

// ---- Deck ---------------------------------------------------------------------------

/** A band's bottom: where it comes within 1.2 m of the map's ground (the ends, the Memorial Drive dip), it runs down into it. */
const above = (f: (y: number) => number, x: number) => (y: number) => {
  const b = f(y), g = Math.min(...[-1, 1].map((d) => ground(x + d, y)))
  return b - g > 1.2 ? b : Math.min(b, g - 0.5)
}

function deck(k: Kit, lod: Lod) {
  const step = lod === 'low' ? 20 : 8
  const ys = stations(Y0, Y1, step)
  const steelYs = stations(ABUT_C_BACK, ABUT_B, step)
  for (const s of [-1, 1]) {
    // Fascia girder (steel) over the arches and the Memorial Drive span; granite walls on the abutments.
    const gz = (y: number) => road(y) - GIRDER
    for (const [a, b] of [[Y0, ABUT_C_BACK], [ABUT_C, ABUT_B]] as [number, number][]) {
      const yy = stations(a, b, step)
      band(k.steel, s * (OUT - 0.4), s * OUT, yy, walk, above(gz, s * OUT), { out: true, bottom: true, top: false, in: false })
    }
    // The ornamental railing, solid in the low model; rails and balusters in the detail one.
    if (lod === 'low') band(k.steel, s * (OUT - 0.3), s * OUT, ys, railTop, walk, { out: true, in: true, top: true })
    else railing(k, s, ys)
  }
  // Abutment walls, from the ground up to the sidewalk, and their end faces.
  for (const [a, b] of [[ABUT_C_BACK, ABUT_C], [ABUT_B, Y1]] as [number, number][])
    for (const s of [-1, 1]) {
      const n: V3 = [s, 0, 0]
      footedWall(k.stone, [s * OUT, s > 0 ? a : b], [s * OUT, s > 0 ? b : a], wallFoot, (_, y) => walk(y), n, lod === 'low' ? 4 : 3)
    }
  // The Memorial Drive span's landing at the Cambridge end, and the face of the abutment over it.
  footedWall(k.stone, [-OUT, Y0], [OUT, Y0], foot, (_, y) => walk(y), [0, -1, 0], 6)
  const zC = road(ABUT_C_BACK) - GIRDER
  footedWall(k.stone, [-OUT, ABUT_C_BACK], [OUT, ABUT_C_BACK], foot, () => zC, [0, -1, 0], 6)
  // The abutments' river faces, down to the arches' springing.
  for (const [y, d] of [[ABUT_C, 1], [ABUT_B, -1]] as [number, number][])
    footedWall(k.stone, d > 0 ? [OUT, y] : [-OUT, y], d > 0 ? [-OUT, y] : [OUT, y], foot, () => road(y) - 0.3, [0, d, 0], 6)
  // Soffit under the deck, closing it seen from above between the map's roadways.
  // Left out where it would sit in the map's ground (the ends, on their fill).
  for (const yy of [steelYs, stations(Y0, ABUT_C_BACK, step)]) {
    const clear = (y: number) => road(y) - 1.0 > Math.max(...[-12, 0, 12].map((x) => ground(x, y))) + 0.3
    let run: number[] = []
    for (const y of [...yy, Infinity]) {
      if (y !== Infinity && clear(y)) { run.push(y); continue }
      if (run.length > 1) band(k.under, -OUT + 0.4, OUT - 0.4, run, (y) => road(y) - 1.0, (y) => road(y) - 1.4, { top: true, bottom: true })
      run = []
    }
  }
  // Sidewalks (with the north cycle lane): walking surfaces, the model's.
  // They stop where the Boston end's fill comes up to them.
  for (const [x0, x1] of [WALK_N, WALK_S]) {
    const wy = ys.filter((y) => walk(y) > Math.max(ground(x0, y), ground(x1, y)) + 0.3)
    band(k.walk, x0, x1, wy, walk, above((y) => road(y) - 0.3, (x0 + x1) / 2), { top: true, in: true, out: false, ends: true })
  }
  // The Red Line: ballast bed between the fences, held up on walls where the
  // rails climb toward Charles/MGH, with the station's side platforms.
  const ty = stations(Y0, STATION, step)
  band(k.ballast, -TRACK, TRACK, ty, rail, above((y) => Math.min(rail(y), road(y)) - 0.3, 0), { top: true, in: true, out: true, ends: true })
  const py = stations(242, STATION, 6)
  for (const s of [-1, 1]) band(k.walk, s * 2.6, s * TRACK, py, (y) => rail(y) + 1.0, rail, { top: true, in: true, ends: true })
  if (lod === 'detail') {
    for (const xc of [-1.9, 1.9]) for (const g of [-0.72, 0.72])
      band(k.steel, xc + g - 0.05, xc + g + 0.05, ty, (y) => rail(y) + 0.18, rail, { top: true, in: true, out: true })
    for (const s of [-1, 1]) fence(k, s * TRACK, ty)
  }
}

/** The detail model's railing: a top rail, a bottom rail and balusters 1.2 m apart. */
function railing(k: Kit, s: number, ys: number[]) {
  const x0 = s * (OUT - 0.25), x1 = s * OUT
  band(k.steel, Math.min(x0, x1), Math.max(x0, x1), ys, railTop, (y) => railTop(y) - 0.15, { out: true, in: true, top: true, bottom: true })
  band(k.steel, Math.min(x0, x1), Math.max(x0, x1), ys, (y) => walk(y) + 0.2, walk, { out: true, in: true, top: true })
  const xm = s * (OUT - 0.12)
  for (const y of stations(ys[0], ys[ys.length - 1], 1.2))
    band(k.steel, xm - 0.05, xm + 0.05, [y - 0.05, y + 0.05], (yy) => railTop(yy) - 0.15, (yy) => walk(yy) + 0.2, { out: true, in: true })
}

/** The detail model's track fence: posts every 3 m and two rails. */
function fence(k: Kit, x: number, ys: number[]) {
  const top = (y: number) => Math.max(road(y), rail(y)) + 1.5
  band(k.steel, x - 0.04, x + 0.04, ys, top, (y) => top(y) - 0.08, { out: true, in: true, top: true })
  for (const y of stations(ys[0], ys[ys.length - 1], 3))
    band(k.steel, x - 0.05, x + 0.05, [y - 0.05, y + 0.05], top, (yy) => Math.max(road(yy), rail(yy)), { out: true, in: true })
}

// ---- Piers --------------------------------------------------------------------------

/** A small pier: a cutwater with rounded ends, the rounded pier above it, and a bay in the parapet each side. */
function smallPier(k: Kit, py: number, lod: Lod) {
  const seg = lod === 'low' ? 3 : 8
  const g = Math.max(0, Math.min(...[-20, 0, 20].map((x) => ground(x, py))) - 0.4)
  const S = one(k.stone)
  // Cutwater, rounded at both ends, to x = +-22.5 (lidar), its top 4.6 m above the river.
  loftSolid(S, [stadium(py, 18.3, 4.2, g, seg), stadium(py, 18.3, 4.2, Math.max(g + 0.5, 3.1), seg), stadium(py, 16.0, 3.4, 4.6, seg)], [false, true])
  // The pier from the cutwater to just under the roadway.
  loftSolid(S, [stadium(py, 15.0, 3.4, 4.5, seg), stadium(py, 15.0, 3.4, road(py) - 1.1, seg)], [false, true])
  // The pier's rounded ends stand out past the fascia (to x = +-18.4) from
  // the cutwater up through the girder to the parapet, as pilasters with a
  // bay in the sidewalk at the top (photos; lidar bays at the sidewalk).
  for (const s of [-1, 1]) {
    const ring = halfRing(s * 15.0, py, 3.4, s, seg)
    const zt = lod === 'low' ? railTop(py) : walk(py) - 0.02
    loftSolid(S, [ring.map(([x, y]) => [x, y, 4.5] as V3), ring.map(([x, y]) => [x, y, zt] as V3)], [false, true])
    if (lod === 'detail') bayParapet(k, ring, s, py)
  }
}

/** The parapet round a bay: a 0.45 m wall on the bay's rim. */
function bayParapet(k: Kit, ring: [number, number][], s: number, py: number) {
  const z0 = walk(py) - 0.05, z1 = railTop(py)
  for (let i = 0; i < ring.length - 1; i++) {
    const [a, b] = [ring[i], ring[i + 1]]
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
    const nx = mx - s * 15.0, ny = my - py, l = Math.hypot(nx, ny)
    const n: V3 = [nx / l, ny / l, 0]
    const inA: [number, number] = [a[0] - n[0] * 0.45, a[1] - n[1] * 0.45], inB: [number, number] = [b[0] - n[0] * 0.45, b[1] - n[1] * 0.45]
    face(k.stone, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], n)
    face(k.stone, [inA[0], inA[1], z0], [inB[0], inB[1], z0], [inB[0], inB[1], z1], [inA[0], inA[1], z1], [-n[0], -n[1], 0])
    face(k.stone, [a[0], a[1], z1], [b[0], b[1], z1], [inB[0], inB[1], z1], [inA[0], inA[1], z1], [0, 0, 1])
  }
}

/** A central pier: a chamfered block out to x = +-26.5 (OSM, lidar), its ends terraces round the towers. */
function centralPier(k: Kit, py: number, lod: Lod) {
  const S = one(k.stone), hw = 8.15
  loftSolid(S, [rect(0, py, 27.1, hw + 0.6, 3.4, 0), rect(0, py, 27.1, hw + 0.6, 3.4, 1.2)], [false, true])
  loftSolid(S, [rect(0, py, 26.5, hw, 3.0, 1.2), rect(0, py, 26.5, hw, 3.0, road(py) - 1.1)], [false, true])
  for (const s of [-1, 1]) {
    // Terrace beyond the parapet, at the sidewalk, and its parapet wall.
    const x0 = s * OUT, x1 = s * 26.5
    const zt = walk(py), zp = railTop(py)
    const plan: [number, number][] = s > 0
      ? [[x0, py - hw], [x1 - 3.0, py - hw], [x1, py - hw + 3.0], [x1, py + hw - 3.0], [x1 - 3.0, py + hw], [x0, py + hw]]
      : [[x0, py + hw], [x1 + 3.0, py + hw], [x1, py + hw - 3.0], [x1, py - hw + 3.0], [x1 + 3.0, py - hw], [x0, py - hw]]
    loftSolid(S, [plan.map(([x, y]) => [x, y, road(py) - 0.31] as V3), plan.map(([x, y]) => [x, y, zt] as V3)], [false, true])
    for (let i = 0; i < plan.length - 1; i++) {
      const [a, b] = [plan[i], plan[i + 1]]
      const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
      const n: V3 = [dy / l, -dx / l, 0]
      const t = 0.5
      const ia: [number, number] = [a[0] - n[0] * t, a[1] - n[1] * t], ib: [number, number] = [b[0] - n[0] * t, b[1] - n[1] * t]
      face(k.stone, [a[0], a[1], zt - 0.05], [b[0], b[1], zt - 0.05], [b[0], b[1], zp], [a[0], a[1], zp], n)
      face(k.stone, [a[0], a[1], zp], [b[0], b[1], zp], [ib[0], ib[1], zp], [ia[0], ia[1], zp], [0, 0, 1])
      if (lod === 'detail') face(k.stone, [ia[0], ia[1], zt - 0.05], [ib[0], ib[1], zt - 0.05], [ib[0], ib[1], zp], [ia[0], ia[1], zp], [-n[0], -n[1], 0])
    }
    tower(k, s * 20.15, py, lod)
  }
}

// ---- Towers -------------------------------------------------------------------------

/**
 * One of the four "salt and pepper shaker" towers (lidar, NAVD88): a plinth
 * to 17.1 m, the shaft to its cornice at 23.9 m, the narrower lantern stage
 * with its oculus to the upper cornice at 26.9-27.4 m, the dome to 29.5 m and
 * the finial to 30.4 m. Plans (lidar, photos): plinth 7.4 m, shaft 6.8 m,
 * lantern 6.0 m, all with chamfered corners; dome 4.6 m across.
 */
function tower(k: Kit, cx: number, cy: number, lod: Lod) {
  const S = one(k.stone), z = (navd: number) => navd - Z0
  const base = road(cy) - 0.3
  const r = (h: number, c: number, zz: number) => rect(cx, cy, h, h, c, zz)
  loftSolid(S, [r(3.7, 1.0, base), r(3.7, 1.0, z(17.1))], [false, true])
  loftSolid(S, [r(3.4, 0.9, z(17.1)), r(3.4, 0.9, z(23.4))], [false, false])
  loftSolid(S, [r(3.75, 1.0, z(23.4)), r(3.75, 1.0, z(23.95))], [true, true])
  loftSolid(S, [r(3.0, 0.8, z(23.95)), r(3.0, 0.8, z(26.85))], [false, false])
  loftSolid(S, [r(3.45, 0.9, z(26.85)), r(3.45, 0.9, z(27.4))], [true, true])
  // Dome: a hemisphere on a short drum (real semicircle, 12 around, 4 up).
  const R = 2.6, zc = z(27.4) + 0.05, around = lod === 'low' ? 8 : 12, up = lod === 'low' ? 2 : 5
  const rings: V3[][] = []
  for (let j = 0; j <= up; j++) {
    const a = (Math.PI / 2) * (j / up) * 0.92
    rings.push(Array.from({ length: around }, (_, i) => {
      const t = (2 * Math.PI * i) / around
      return [cx + R * Math.cos(a) * Math.cos(t), cy + R * Math.cos(a) * Math.sin(t), zc + R * Math.sin(a)] as V3
    }))
  }
  loftSolid(S, rings, [true, true])
  // Finial.
  const top = zc + R * Math.sin(Math.PI / 2 * 0.92)
  rod(k.stone, [cx, cy, top - 0.1], [cx, cy, z(30.4)], 0.22, lod === 'low' ? 3 : 6)
  // A slit window on each face of the shaft and an oculus on each face of the lantern.
  for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const o = 3.4 + 0.02, ol = 3.0 + 0.02
    const px = (u: number) => [cx + nx * o - ny * u, cy + ny * o + nx * u] as const
    const [ax, ay] = px(-0.22), [bx, by] = px(0.22)
    face(k.steel, [ax, ay, z(20.6)], [bx, by, z(20.6)], [bx, by, z(22.4)], [ax, ay, z(22.4)], [nx, ny, 0])
    const c: V3 = [cx + nx * ol, cy + ny * ol, z(25.4)], m = lod === 'low' ? 6 : 10
    for (let i = 0; i < m; i++) {
      const t0 = (2 * Math.PI * i) / m, t1 = (2 * Math.PI * (i + 1)) / m, rr = 0.6
      const p0: V3 = [c[0] - ny * rr * Math.cos(t0), c[1] + nx * rr * Math.cos(t0), c[2] + rr * Math.sin(t0)]
      const p1: V3 = [c[0] - ny * rr * Math.cos(t1), c[1] + nx * rr * Math.cos(t1), c[2] + rr * Math.sin(t1)]
      tri3(k.steel, c, p0, p1, [nx, ny, 0])
    }
  }
}

// ---- Abutment stair towers -------------------------------------------------------------

/** The small domed towers at the abutments' stairs (lidar: 4.7 m square, body to 13.6 m, dome to 15.1 m NAVD88), and a flight of steps down from each. */
function stairTower(k: Kit, cx: number, cy: number, lod: Lod) {
  const S = one(k.stone), z = (navd: number) => navd - Z0, s = Math.sign(cx)
  const plan = (h: number, c: number): [number, number][] => rect(cx, cy, h, h, c, 0).map(([x, y]) => [x, y] as [number, number])
  footedLoft(k.stone, foot, [{ plan: plan(2.35, 0.5), z: 'ground' }, { plan: plan(2.35, 0.5), z: z(13.0) }], lod === 'low' ? 6 : 2.5, false)
  loftSolid(S, [rect(cx, cy, 2.6, 2.6, 0.55, z(13.0)), rect(cx, cy, 2.6, 2.6, 0.55, z(13.6))], [true, true])
  const R = 1.75, zc = z(13.6), around = lod === 'low' ? 8 : 12, up = lod === 'low' ? 2 : 4
  const rings: V3[][] = []
  for (let j = 0; j <= up; j++) {
    const a = (Math.PI / 2) * (j / up) * 0.9
    rings.push(Array.from({ length: around }, (_, i) => {
      const t = (2 * Math.PI * i) / around
      return [cx + R * Math.cos(a) * Math.cos(t), cy + R * Math.cos(a) * Math.sin(t), zc + R * Math.sin(a) * 0.85] as V3
    }))
  }
  loftSolid(S, rings, [false, true])
  // Steps: a sloped flight 3 m wide running out from the tower, from the sidewalk down to the ground.
  const xa = cx + s * 2.35, len = 10, w = 1.5
  const zt = walk(cy) - 0.2
  const zEnd = Math.max(...[-w, 0, w].map((d) => ground(xa + s * len, cy + d))) + 0.4
  const top = (x: number, _y: number) => zt - (Math.abs(x - xa) / len) * (zt - zEnd)
  const corners: [number, number][] = [[xa, cy - w], [xa + s * len, cy - w], [xa + s * len, cy + w], [xa, cy + w]]
  const n4: V3[] = [[0, -1, 0], [s, 0, 0], [0, 1, 0], [-s, 0, 0]]
  for (let i = 0; i < 3; i++) footedWall(k.stone, corners[i], corners[i + 1], foot, top, n4[i], lod === 'low' ? 5 : 2.5)
  const [a, b, c, d] = corners
  face(k.walk, [a[0], a[1], top(a[0], a[1])], [b[0], b[1], top(b[0], b[1])], [c[0], c[1], top(c[0], c[1])], [d[0], d[1], top(d[0], d[1])], [0, 0, 1])
}

// ---- Lamps ---------------------------------------------------------------------------

/** The bridge's lamp posts on the parapets, about 25 m apart (night photo); beads only, sparser, in the low model. */
function lamps(k: Kit, lod: Lod) {
  const gap = lod === 'low' ? 50 : 25
  for (const y of stations(Y0 + 8, Y1 - 8, gap)) for (const s of [-1, 1]) {
    const x = s * (OUT - 0.15), zt = road(y) + 5.2
    if (lod === 'detail') rod(k.steel, [x, y, walk(y)], [x, y, zt], 0.09, 5)
    bead(k.lamp, [x, y, zt + 0.25], lod === 'low' ? 0.45 : 0.32, lod === 'low')
  }
}

// ---- Build ---------------------------------------------------------------------------

function build(lod: Lod): Kit {
  const k = newKit()
  arches(k, lod)
  deck(k, lod)
  for (const p of PIERS) (p.central ? centralPier : smallPier)(k, p.y, lod)
  for (const [x, y] of [[19.5, -276.5], [-21.6, -276.5], [19.5, 275.9], [-21.7, 275.8]]) stairTower(k, x, y, lod)
  lamps(k, lod)
  return k
}

if (import.meta.main) {
  const STONE = finish('granite', 0xcdc6b8)
  const STEEL = finish('arch-steel', 0x55504a)
  const WALK = finish('sidewalk', 0xc6c2ba)
  const BALLAST = finish('track-ballast', 0x8e857b)
  const UNDER = finish('deck-underside', 0x8d9296)
  const LAMP = finish('lamp', 0x3f3d3a)
  const list = (k: Kit) => [
    { part: k.stone, material: STONE }, { part: k.steel, material: STEEL }, { part: k.walk, material: WALK },
    { part: k.ballast, material: BALLAST }, { part: k.under, material: UNDER }, { part: k.lamp, material: LAMP },
  ]
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin on the deck axis at midspan of the central span, on the river',
    bearing: 95.87, elevation: 0, ends: [Y0, Y1], roadwayCrest: road(0), towersTop: 30.4 - Z0,
  }
  for (const [file, lod, maxTris, maxBytes] of [
    ['bos-longfellow-bridge.glb', 'low', 5000, 250 * 1024],
    ['bos-longfellow-bridge.detail.glb', 'detail', 40000, 1536 * 1024],
  ] as const) {
    const parts = list(build(lod))
    const tris = countParts(parts)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Longfellow Bridge', parts, extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
