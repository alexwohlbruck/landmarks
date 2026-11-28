/**
 * Maurice J. Tobin Memorial Bridge (Mystic River Bridge, 1948–1950),
 * Charlestown–Chelsea — procedural, CC0-1.0. bun generators/bos-tobin-bridge.ts
 *
 * The bridge's OSM outline (way/631109724) as one placement: the green
 * double-deck cantilever through truss over the Mystic River (anchor arms,
 * the humps over the two main piers, the suspended middle), the smaller
 * through truss over the Little Mystic Channel, and the double-deck girder
 * approach between and beyond them on braced steel bents, with the concrete
 * portal piers. Southbound traffic on the upper deck, northbound on the
 * lower; the map draws both roadways, the model only what is beside and under
 * them (green fascia girders with parapets, the decks' undersides). Writes a
 * low model (bold chords, posts and diagonals, each panel filled with a pale
 * translucent veil so the trusses read as solid green bands from far off) and
 * a detail model (the lattice open, with sub-diagonals, top laterals and
 * strut bracing), which the map draws from detailZoom up.
 *
 * Frame: x across (+x south-east), y along toward Chelsea, z up, metres.
 * Origin on the deck axis at the outline's centroid. Placed at bearing
 * 33.57°, the deck axis in the lidar (outline principal axis 33.44°). z = 0
 * is the map's river: NAVD88 + 2.13 m (Mapterhorn reads the Mystic at
 * -2.13 m NAVD88; the lidar's water -0.9 to -0.4 at the flight's tide).
 *
 * Lidar: USGS 3DEP MA_CentralEastern_1_2021 (2021 flight; tools/lidar.py at
 * 1 m in two boxes over the whole outline, resampled into the frame).
 * Measured:
 * - upper roadway (tools/bridge_ele.py measure on way/8648413 and
 *   way/591493146, spread 0.01-0.14 m): UPPER_NAVD below, 41.15 m NAVD88 at
 *   the Charlestown end of the outline, 53.00 m at the crest over the main
 *   span, 45.5 m at the Chelsea end. The OSM `ele` tags that give the map the
 *   same roadway are in ~/landmarks-scratch/osm-ele/bos-tobin-bridge.osc (not
 *   uploaded).
 * - cantilever truss: south end y = 16, main piers y = 115.5 and 358.5
 *   (243 m apart; published centre span 800 ft, 240 m), north end y = 461;
 *   top chord TOP_NAVD below: 56.3 m near the ends, 74.0 m over the piers,
 *   63.3 m along the suspended middle (y 180-297); truss planes about +-7 m.
 * - Little Mystic Channel truss: y = -447 to -331, parallel top chord
 *   52.4-54.6 m NAVD88, inclined end posts.
 * - the upper deck widened round the old toll plaza (y -255 to -70) to
 *   about +-17 m.
 * Published (Wikipedia "Tobin Bridge"): three-span cantilevered truss, 1,525
 * ft (465 m), centre span 800 ft (240 m), maximum truss height 115 ft (35 m;
 * modelled 34 m over the piers); three lanes on each of two levels,
 * northbound below; 36 approach spans north, 32 south; opened 1950.
 *
 * Photos (Wikimedia Commons; all evidence):
 * - "Tobin Bridge from Boston Harbor", Fletcher, CC BY 4.0: broadside from
 *   the south-east: the humps, the suspended span, the portal piers, the
 *   double-deck approaches.
 *   https://commons.wikimedia.org/wiki/File:Tobin_Bridge_from_Boston_Harbor.jpg
 * - "Tobin bridge 2009f", Chensiyuan, CC BY-SA 4.0: the south main pier and
 *   both anchor arm and main span close: panel pattern, the two decks
 *   through the truss (8-10 m apart), the concrete portals.
 *   https://commons.wikimedia.org/wiki/File:Tobin_bridge_2009f.JPG
 * - "Tobin Bridge from Bunker Hill Monument, June 2017", Pi.1415926535, CC
 *   BY-SA 3.0: from high in Charlestown: the Little Mystic truss, the braced
 *   steel bents, the concrete piers.
 *   https://commons.wikimedia.org/wiki/File:Tobin_Bridge_from_Bunker_Hill_Monument,_June_2017.JPG
 * - "Boston Tobin Bridge SE von Pier10 9329 20190426", Karlunun, CC BY-SA
 *   4.0: broadside, both humps.
 *   https://commons.wikimedia.org/wiki/File:Boston_Tobin_Bridge_SE_von_Pier10_9329_20190426.jpg
 * - "Tobin Bridge from Charlestown", Derek Yu, CC BY-SA 2.0; "Tobin Memorial
 *   Bridge 0834", Derek Yu, CC BY-SA 2.0: the approach's bents and decks
 *   from below and the side.
 *   https://commons.wikimedia.org/wiki/File:Tobin_Bridge_from_Charlestown.jpg
 *   https://commons.wikimedia.org/wiki/File:Tobin_Memorial_Bridge_0834.jpg
 * - "Charlestown Bunker Hill St Tobin Bridge se 9459 20190429", Matthias
 *   Nonnenmacher, CC BY-SA 4.0: the approach's green girders and two levels.
 *   https://commons.wikimedia.org/wiki/File:Charlestown_Bunker_Hill_St_Tobin_Bridge_se_9459_20190429.jpg
 *
 * Estimated:
 * - the lower deck 9.9 m under the upper: the northbound off-ramp
 *   (way/8617297), which leaves the lower deck at the Chelsea end of the
 *   outline, is the first of that level the lidar sees (34.54 m 37 m from the
 *   split, falling 5.5 %: about 36.6 m at the split, 9.9 m under the upper
 *   deck there); the photos give 8-10 m. Lidar can't see the lower deck.
 * - the bottom chords 1.4 m under the lower deck; panels (8 on each anchor
 *   arm, 20 on the main span, 10 on the Little Mystic truss); member sizes.
 * - approach bents about 35 m apart (the photos show braced steel bents;
 *   their stations are hidden from the lidar), girders 2.6 m deep.
 * - piers: plan and column sizes of the concrete portals (main 5 x 7 m
 *   columns, the others 3.6 x 4.5 m), from the photos.
 * - lamp posts 10 m tall, about 40 m apart along the upper deck.
 *
 * Ends (bridge rules): both ends of the outline are in the air; the I-93/US 1
 * viaducts carry on as bridge=yes ways with no outline of their own, so they
 * are the map's: the model ends on a steel bent at each end (y = -452 and
 * 517), the decks' girders stopping there.
 *
 * Ground: Mapterhorn z15 under the site (tools/terrain.ts grid, 5 m), as the
 * GROUND table; feet sink 0.4 m (pier columns 1 m, on the channel banks) into
 * it.
 *
 * Doubts:
 * - The lower deck's height (above) and the bents' stations are estimated.
 * - The top chord over the main piers: the lidar sees it at 73.6-74.0 m at
 *   y = 105 and 126 and little between; drawn as one high panel point at the
 *   pier. Lead review: drawn as one sharp peak (74.6) over each main pier,
 *   as the photos show, rather than the flat 105-126 m plateau.
 * - The truss web is drawn as a Warren with verticals (plus sub-diagonals in
 *   the detail model); the real panels are subdivided more finely.
 * - OSM tags the outline bridge:structure=suspension; it is a cantilever truss.
 * - Building way/29849296 stands partly under the Charlestown approach; it is
 *   a separate building and is not replaced.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { band, bead, face, footedLoft, groundAt, piecewise, stations, strip, type GroundGrid } from './bridge-kit'
import { countParts } from './sf-golden-gate-bridge'
import { finish } from './palette'

// ---- Measurements -------------------------------------------------------------

/** The model's z is NAVD88 + 2.13 m: the map's Mapterhorn water reads -2.13 m NAVD88 there (the lidar's water -0.9 to -0.4 at the flight's tide). */
const Z0 = -2.13

/**
 * The upper roadway, metres NAVD88 (tools/bridge_ele.py on way/8648413 and
 * way/591493146, lower quartile, spread 0.01-0.14 m), by y.
 */
const UPPER_NAVD = piecewise([
  [-476.4, 40.44], [-456.4, 41.15], [-436.3, 41.85], [-416.2, 42.43], [-396.2, 42.99], [-376.1, 43.49], [-356.1, 43.94], [-336.0, 44.3], [-315.9, 44.62], [-295.9, 44.85], [-275.8, 45.02], [-255.7, 45.19], [-215.6, 45.51], [-199.0, 45.64], [-178.9, 45.81], [-158.8, 45.95], [-138.8, 46.09], [-118.8, 46.24], [-98.8, 46.42], [-78.7, 46.59], [-58.7, 46.77], [-38.6, 47.01], [-18.5, 47.33], [1.5, 47.68], [13.6, 47.92], [53.7, 48.88], [73.7, 49.4], [93.8, 50.05], [113.9, 50.67], [133.9, 51.33], [154.0, 51.91], [174.1, 52.38], [194.1, 52.7], [214.2, 52.92], [234.3, 53.0], [254.3, 52.94], [274.4, 52.76], [294.4, 52.47], [354.6, 50.88], [414.8, 48.93], [434.9, 48.26], [455.0, 47.59], [469.4, 47.13], [475.4, 46.9], [478.9, 46.79], [499.0, 46.12], [516.5, 45.54], [529.8, 45.1],
])

/** The upper (southbound) roadway, measured; the lower (northbound) one 9.9 m under it (estimated, see the header). */
const upper = (y: number) => UPPER_NAVD(y) - Z0
const LOWER_GAP = 9.9
const lower = (y: number) => upper(y) - LOWER_GAP

const Y0 = -456, Y1 = 520            // the outline's ends: Charlestown, Chelsea
const S0 = 16, P1 = 115.5, P2 = 358.5, N0 = 461   // cantilever truss: south end, main piers, north end (lidar)
const LM0 = -447, LM1 = -331         // Little Mystic Channel truss (lidar)
const TX = 7.0                       // truss planes and deck fascias at x = +-TX

/** The cantilever truss's top chord, metres NAVD88 (lidar, west chord, both chords within 0.3 m). */
const TOP_NAVD = piecewise([
  [16, 54.0], [18, 56.3], [27, 56.85], [39, 57.55], [51, 59.0], [63, 60.5], [69, 61.96], [75, 63.71], [81, 65.45],
  [87, 67.04], [93, 68.72], [99, 71.14], [115.5, 74.6], [129, 72.96], [135, 70.6], [141, 68.74],
  [147, 67.43], [153, 65.91], [159, 64.97], [165, 64.61], [171, 63.96], [177, 63.47], [183, 63.3], [297, 63.3],
  [300, 63.66], [306, 64.21], [312, 64.73], [318, 65.25], [324, 66.55], [330, 67.99], [336, 69.48], [342, 71.37],
  [358.5, 74.6], [372, 72.81], [378, 70.19], [384, 68.33], [390, 66.57], [396, 64.88], [402, 63.23],
  [408, 61.46], [414, 60.24], [420, 59.52], [426, 58.72], [432, 57.94], [438, 57.41], [444, 57.08], [450, 56.75],
  [456, 56.32], [459, 56.11], [461, 54.0],
])
const top = (y: number) => TOP_NAVD(y) - Z0
/** The Little Mystic truss's top chord: parallel, 52.4 m to 54.6 m NAVD88 (lidar). */
const lmTop = (y: number) => 52.4 + ((y - LM0 - 3) / (LM1 - LM0 - 6)) * 2.2 - Z0
const botChord = (y: number) => lower(y) - 1.4

/** Half-width of the upper deck: 7 m, widened round the old toll plaza (lidar). */
const UPPER_HALF = piecewise([[-275, 7], [-255, 10.5], [-235, 14], [-210, 16.5], [-150, 17], [-130, 15.5], [-110, 12.5], [-90, 10.5], [-70, 8], [-60, 7]])

// The map's ground (Mapterhorn z15, tools/terrain.ts grid at the anchor,
// bearing 33.57), metres above its river (-2.13 m NAVD88), 5 m apart.
const GROUND: GroundGrid = { y0: -470, x0: -30, step: 5, z: [
  [5.4,5.4,5.2,5.4,5.8,5.8,5.9,5.9,5.9,6.0,7.6,8.1,8.1],
  [5.4,5.4,5.2,5.4,5.8,5.8,5.8,5.9,5.9,6.0,8.1,8.2,8.1],
  [5.5,5.5,5.4,5.6,5.8,5.8,5.8,5.8,5.9,6.4,8.2,8.3,8.1],
  [4.0,5.3,5.6,5.7,5.9,5.8,5.9,5.9,5.9,7.1,8.3,8.3,8.4],
  [0.0,0.6,2.9,5.2,5.6,5.7,5.7,5.8,5.8,7.6,8.4,8.5,8.7],
  [0.0,0.0,0.0,0.2,1.9,3.5,3.1,3.8,5.8,8.4,8.4,8.8,9.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.2,1.3,4.4,7.0,8.2,7.7,9.2],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.3,2.2,5.4,6.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.1,1.2],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.1,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [3.4,0.7,0.1,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [5.4,3.4,3.3,2.0,0.2,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [6.8,6.4,5.2,4.8,4.7,3.7,1.4,0.7,0.2,0.2,0.3,0.1,0.0],
  [6.6,6.6,5.1,4.9,5.1,5.4,5.1,4.7,4.2,2.3,2.0,1.9,1.1],
  [6.4,6.2,5.0,4.9,5.2,5.4,5.5,5.4,5.1,4.9,4.3,3.6,3.1],
  [6.2,6.0,5.1,4.9,5.1,5.2,5.3,5.2,5.1,4.8,4.8,5.1,4.8],
  [5.8,5.7,5.2,4.8,4.9,5.1,5.2,5.2,5.0,4.8,4.8,4.8,4.8],
  [5.6,5.5,5.3,4.8,4.8,5.0,5.1,5.2,5.0,4.9,4.9,4.9,4.9],
  [5.3,5.2,5.1,4.8,4.7,4.9,5.0,5.1,5.1,4.9,4.9,4.9,4.9],
  [5.1,4.9,4.9,4.9,4.7,4.7,4.9,4.9,5.0,4.9,4.9,4.9,4.9],
  [4.8,4.8,4.7,4.7,4.9,4.7,4.8,4.9,4.8,4.9,4.9,4.9,4.9],
  [4.6,4.6,4.6,4.6,4.7,4.8,4.7,4.8,4.7,4.8,4.8,4.8,4.9],
  [4.6,4.6,4.6,4.6,4.6,4.7,4.6,4.7,4.8,4.7,4.8,4.8,4.8],
  [4.5,4.6,4.5,4.6,4.6,4.6,4.6,4.6,4.7,4.8,4.8,4.7,4.8],
  [4.4,4.4,4.5,4.5,4.5,4.6,4.6,4.6,4.6,4.7,4.7,4.7,4.8],
  [4.4,4.4,4.4,4.4,4.5,4.5,4.6,4.6,4.6,4.6,4.6,4.7,4.8],
  [4.4,4.4,4.3,4.4,4.4,4.5,4.6,4.6,4.6,4.6,4.6,4.7,4.8],
  [4.4,4.4,4.3,4.3,4.5,4.6,4.6,4.6,4.8,4.8,4.6,4.7,4.8],
  [4.5,4.4,4.3,4.4,4.6,4.6,4.6,4.6,4.7,4.7,4.7,4.7,4.8],
  [4.5,4.5,4.5,4.5,4.6,4.6,4.6,4.6,4.6,4.7,4.8,4.8,4.8],
  [4.6,4.6,4.6,4.6,4.6,4.7,4.6,4.6,4.6,4.6,4.7,4.7,4.8],
  [4.7,4.6,4.6,4.6,4.6,4.7,4.7,4.7,4.6,4.7,4.7,4.8,4.8],
  [4.8,4.7,4.7,4.7,4.6,4.6,4.7,4.8,4.7,4.9,4.8,4.8,4.8],
  [4.7,4.8,4.8,4.8,4.7,4.7,4.8,4.8,4.9,5.7,4.9,4.8,4.9],
  [4.7,4.8,4.8,4.9,4.8,4.8,4.7,4.8,4.8,5.7,4.9,4.9,4.9],
  [4.6,4.7,4.8,4.7,4.7,4.7,4.7,4.7,4.7,4.8,4.8,4.8,4.9],
  [4.6,4.6,4.7,4.7,4.7,4.8,4.8,4.8,4.8,4.8,4.8,4.8,4.8],
  [4.6,4.6,4.7,4.7,4.8,4.8,4.8,4.8,4.8,4.7,4.8,4.8,4.8],
  [4.7,4.6,4.7,4.8,4.6,4.6,4.6,4.7,4.7,4.6,4.7,4.7,4.7],
  [4.6,4.6,4.7,4.7,4.6,4.6,4.6,4.6,4.6,4.6,4.6,4.6,4.7],
  [4.6,4.6,4.6,4.6,4.6,4.6,4.6,4.6,4.6,4.6,4.7,4.8,4.7],
  [4.6,4.7,4.7,4.8,4.8,4.8,4.7,4.7,4.7,4.7,4.7,4.7,4.7],
  [4.6,4.6,4.7,4.8,4.8,4.8,4.8,4.7,4.7,4.8,5.0,4.8,4.8],
  [4.6,4.6,4.8,4.8,4.8,4.8,4.8,4.9,4.9,4.9,5.0,4.8,4.8],
  [4.7,4.8,4.9,4.7,4.7,4.8,4.9,4.9,5.0,5.0,5.0,4.8,4.8],
  [4.7,4.8,4.9,4.8,4.7,4.8,4.9,4.9,5.0,5.0,5.1,4.9,5.0],
  [4.8,4.8,4.8,4.8,4.6,4.7,4.8,4.9,5.0,5.0,4.9,4.8,5.0],
  [4.8,4.7,4.6,4.6,4.6,4.6,4.7,4.8,4.8,4.8,4.8,4.9,4.9],
  [4.9,4.8,4.7,4.6,4.6,4.7,4.8,4.8,4.8,4.9,4.8,4.8,5.0],
  [4.9,4.8,4.8,4.8,4.8,4.7,4.8,4.8,4.9,5.1,4.8,4.8,4.9],
  [4.8,4.8,4.8,4.7,4.8,4.8,4.8,4.8,4.8,4.8,4.8,4.8,4.8],
  [4.8,4.8,4.7,4.6,4.7,4.7,4.7,4.8,4.8,4.7,4.7,4.7,4.7],
  [4.8,4.9,4.7,4.6,4.6,4.7,4.7,4.8,4.8,4.7,4.6,4.7,4.6],
  [4.8,4.8,4.8,4.8,4.7,4.7,4.8,4.8,4.7,4.7,4.7,4.6,4.6],
  [4.8,4.8,4.9,4.8,4.8,4.8,4.8,4.8,4.7,4.7,4.7,4.7,4.6],
  [4.7,4.7,4.8,4.8,4.7,4.8,4.7,4.8,4.8,4.7,4.7,4.8,4.7],
  [4.6,4.6,4.6,4.6,4.6,4.7,4.7,4.8,4.8,4.8,4.8,4.8,4.8],
  [4.5,4.5,4.6,4.6,4.6,4.6,4.6,4.7,4.7,4.8,4.8,4.8,4.8],
  [4.6,4.6,4.6,4.6,4.6,4.6,4.6,4.6,4.6,4.8,4.8,4.9,5.0],
  [4.6,4.6,4.6,4.6,4.6,4.6,4.6,4.6,4.6,4.9,4.9,4.9,4.9],
  [4.6,4.6,4.6,4.5,4.7,4.6,4.5,4.5,4.7,4.8,4.9,5.0,5.0],
  [4.7,4.6,4.6,4.6,4.9,4.7,4.6,4.7,4.9,4.9,4.9,5.0,5.0],
  [4.6,4.7,4.6,4.6,4.6,4.6,4.6,4.6,4.7,4.9,4.9,5.0,5.0],
  [4.7,4.7,4.6,4.6,4.6,4.6,4.6,4.6,4.7,4.8,4.9,5.0,5.0],
  [4.7,4.7,4.6,4.6,4.6,4.6,4.6,4.6,4.7,4.8,4.9,4.9,5.0],
  [4.7,4.7,4.6,4.6,4.6,4.6,4.7,4.7,4.7,4.8,4.9,5.0,5.6],
  [4.8,4.6,4.6,4.6,4.6,4.7,4.8,4.8,4.8,4.9,4.9,5.0,5.7],
  [4.8,4.6,4.6,4.6,4.6,4.7,4.8,4.8,4.8,4.9,5.0,5.0,5.0],
  [4.8,4.7,4.6,4.6,4.6,4.8,4.9,5.0,4.9,4.9,5.0,5.0,5.3],
  [4.9,4.7,4.5,4.6,4.6,4.7,4.9,5.0,4.9,4.7,4.9,4.9,5.3],
  [4.8,4.7,4.6,4.6,4.6,4.8,4.8,4.9,4.9,4.9,4.9,4.9,5.2],
  [4.8,4.7,4.6,4.6,4.6,4.8,4.9,4.9,5.0,5.1,5.0,4.9,5.2],
  [4.9,4.8,4.6,4.6,4.7,4.8,4.9,5.0,5.1,5.0,5.0,4.9,5.2],
  [5.0,5.0,4.7,4.6,4.7,4.9,4.9,5.1,5.2,5.1,5.1,5.3,5.8],
  [4.9,4.9,4.8,4.6,4.8,4.9,4.9,5.0,5.1,5.1,5.8,5.9,5.9],
  [4.9,4.9,4.8,4.7,4.9,4.9,4.9,4.9,5.1,5.3,5.9,6.0,5.9],
  [5.0,5.0,4.9,4.8,4.9,4.9,5.0,5.0,5.1,5.3,5.9,5.9,5.9],
  [5.4,5.4,5.3,4.9,4.9,5.0,5.0,4.9,5.1,5.3,5.8,5.9,6.0],
  [5.4,5.5,5.3,4.9,4.9,5.0,5.0,5.1,5.2,5.3,5.8,5.9,5.9],
  [5.2,5.3,5.3,5.1,5.0,5.0,5.1,5.1,5.2,5.3,5.8,5.9,5.8],
  [5.2,5.3,5.3,5.1,5.1,5.1,5.1,5.1,5.0,5.2,5.7,5.8,5.8],
  [5.2,5.2,5.2,5.1,5.1,5.1,5.1,5.1,5.0,5.1,5.4,5.5,5.2],
  [5.0,5.0,5.1,5.1,5.1,5.1,5.1,5.1,5.0,5.1,5.1,5.2,5.0],
  [5.0,5.0,5.0,5.1,5.2,5.2,5.1,5.1,5.1,5.0,5.1,5.1,5.1],
  [4.9,4.9,5.0,5.1,5.2,5.1,5.0,5.0,5.0,4.9,5.1,5.1,4.4],
  [4.8,4.9,4.9,5.1,5.3,5.1,5.0,5.0,5.0,5.0,5.2,5.2,3.9],
  [4.8,4.9,4.9,5.1,5.3,5.1,4.9,5.0,5.0,4.9,5.2,5.3,4.6],
  [4.8,4.9,4.9,5.2,5.3,5.1,4.9,4.9,4.9,5.1,5.1,5.1,5.0],
  [4.8,4.8,5.0,5.3,5.3,5.1,4.9,4.9,4.9,4.9,5.1,5.1,5.1],
  [4.8,4.8,5.1,5.3,5.3,4.9,4.8,4.8,5.0,5.0,5.0,5.0,5.2],
  [3.1,4.7,5.0,5.3,4.6,4.6,4.7,4.8,4.9,4.7,4.6,4.0,4.4],
  [0.0,0.5,1.1,1.1,1.0,1.4,2.3,3.8,3.5,3.8,4.3,4.2,4.1],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.1,0.1,0.1,0.2],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.1,0.1,0.2,0.2,0.1,0.5,1.1],
  [0.0,0.0,0.0,0.0,0.0,0.1,0.2,0.3,0.4,0.4,0.4,1.2,2.1],
  [0.0,0.0,0.0,0.0,0.0,0.1,0.4,0.5,0.6,0.6,1.0,2.0,2.9],
  [0.0,0.0,0.0,0.0,0.0,0.1,0.4,0.6,0.8,1.0,1.8,2.5,3.2],
  [0.0,0.0,0.0,0.0,0.0,0.2,0.5,0.8,1.1,1.8,3.3,4.1,4.7],
  [0.0,0.0,0.0,0.0,0.0,0.8,1.1,1.5,1.7,2.5,5.2,5.7,5.5],
  [0.1,0.1,0.1,0.3,0.4,1.1,1.4,1.8,2.1,2.8,5.1,5.8,5.7],
  [1.4,1.3,1.1,1.0,1.1,1.4,1.7,2.0,2.4,3.5,5.6,5.7,5.6],
  [2.0,1.9,1.6,1.3,1.6,1.9,2.1,2.3,2.6,3.7,5.5,5.6,5.6],
  [3.0,2.9,2.4,2.1,2.2,2.5,2.6,2.8,3.0,3.9,5.6,5.6,5.5],
  [7.0,6.9,6.9,6.4,6.2,5.9,5.5,5.3,5.2,5.5,5.4,5.6,5.5],
  [8.0,7.8,7.5,7.2,7.0,6.7,6.4,6.2,5.9,5.6,5.5,5.6,5.5],
  [8.0,7.7,7.4,7.0,6.8,6.5,6.3,6.0,5.7,5.6,5.6,5.7,5.6],
  [8.4,8.1,7.8,7.4,7.0,6.8,6.5,6.3,6.0,5.7,5.7,5.7,5.7],
  [9.2,8.8,8.3,7.9,7.6,7.3,7.0,6.6,6.2,5.8,5.7,5.8,5.8],
  [9.4,9.2,8.7,8.2,7.9,7.6,7.2,6.8,6.3,5.9,5.8,5.8,5.8],
  [9.6,9.4,9.1,8.5,8.1,7.8,7.4,6.9,6.5,6.1,5.9,5.9,5.9],
  [9.8,9.6,9.4,8.8,8.3,7.9,7.5,7.2,6.8,6.4,6.0,6.0,6.0],
  [10.3,10.1,9.7,8.9,8.5,8.1,7.8,7.5,7.3,7.1,6.3,6.0,6.0],
] }

const ground = (x: number, y: number): number => Math.max(0, groundAt(GROUND, x, y))
const foot = (x: number, y: number): number => Math.max(0, ground(x, y) - 0.4)
/** Pier columns on the steep channel banks sink deeper. */
const deepFoot = (x: number, y: number): number => Math.max(0, Math.min(...[-2, 0, 2].map((d) => ground(x + d, y))) - 1.0)

// ---- Parts ---------------------------------------------------------------------

type Lod = 'low' | 'detail'
type Kit = { steel: Part; web: Part; veil: Part; concrete: Part; under: Part; lamp: Part }
const newKit = (): Kit => { const steel = new Part(); return { steel, web: steel, veil: new Part(), concrete: new Part(), under: new Part(), lamp: new Part() } }

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scl = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const nrm = (a: V3): V3 => scl(a, 1 / (Math.hypot(...a) || 1))
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

/** A rectangular member from a to b, w wide (across, in the truss's plane normal) and d deep, its four long faces. */
function beam(p: Part, a: V3, b: V3, w: number, d: number, up: V3 = [0, 0, 1]) {
  const t = nrm(sub(b, a))
  let u = crs(t, up)
  if (Math.hypot(...u) < 1e-3) u = crs(t, [1, 0, 0])
  u = nrm(u)
  const v = nrm(crs(u, t))
  const U = scl(u, w / 2), V = scl(v, d / 2)
  const c = (q: V3, su: number, sv: number) => add(add(q, scl(U, su)), scl(V, sv))
  for (const [su, sv, n] of [[1, 0, u], [-1, 0, scl(u, -1)], [0, 1, v], [0, -1, scl(v, -1)]] as [number, number, V3][]) {
    const [s1, s2] = su ? [[su, -1], [su, 1]] : [[-1, sv], [1, sv]]
    face(p, c(a, s1[0], s1[1]), c(b, s1[0], s1[1]), c(b, s2[0], s2[1]), c(a, s2[0], s2[1]), n)
  }
}

// ---- Trusses ---------------------------------------------------------------------

/**
 * One truss: chords through panel points ys with tops tz(y) and bottoms
 * bz(y), a post at every panel point and one diagonal per panel,
 * alternating (Warren with verticals); in the detail model each panel's
 * sub-diagonal too, and the top laterals and sway struts between the planes.
 * The low model draws the members bolder and fills each panel with a pale
 * translucent veil, so the truss reads as one green band from far off.
 */
function truss(k: Kit, ys: number[], tz: (y: number) => number, bz: (y: number) => number, lod: Lod) {
  const n = ys.length - 1
  for (const s of [-1, 1]) {
    const x = s * TX
    const T = (i: number): V3 => [x, ys[i], tz(ys[i])]
    const B = (i: number): V3 => [x, ys[i], bz(ys[i])]
    for (let i = 0; i < n; i++) {
      beam(k.steel, T(i), T(i + 1), lod === 'low' ? 1.1 : 0.9, lod === 'low' ? 1.4 : 1.1)
      beam(k.steel, B(i), B(i + 1), lod === 'low' ? 1.1 : 0.9, lod === 'low' ? 1.6 : 1.3)
      const [a, b] = i % 2 === 0 ? [B(i), T(i + 1)] : [T(i), B(i + 1)]
      strip(k.web, a, b, lod === 'low' ? 1.2 : 0.8, [1, 0, 0])
      if (lod === 'detail') {
        // The sub-diagonal from mid-panel on the bottom chord to the main diagonal's middle.
        const m: V3 = [x, (ys[i] + ys[i + 1]) / 2, bz((ys[i] + ys[i + 1]) / 2)]
        strip(k.web, m, scl(add(a, b), 0.5), 0.45, [1, 0, 0])
      }
      if (lod === 'low') {
        const q = [B(i), B(i + 1), T(i + 1), T(i)]
        face(k.veil, q[0], q[1], q[2], q[3], [s, 0, 0])
      }
    }
    for (let i = 0; i <= n; i++) strip(k.web, B(i), T(i), i === 0 || i === n ? 1.2 : lod === 'low' ? 0.9 : 0.6, [1, 0, 0])
  }
  // Between the planes: a strut at every panel point's top and the X laterals (detail); a
  // strut every other panel point in the low model.
  for (let i = 0; i <= n; i++) {
    if (lod === 'low' && i % 2 === 1) continue
    const y = ys[i], z = tz(y)
    beam(k.steel, [-TX, y, z], [TX, y, z], 0.5, 0.7)
    if (lod === 'detail' && i < n) {
      const y2 = ys[i + 1], z2 = tz(y2)
      strip(k.web, [-TX, y, z + 0.3], [TX, y2, z2 + 0.3], 0.35, [0, 0, 1])
      strip(k.web, [TX, y, z + 0.3], [-TX, y2, z2 + 0.3], 0.35, [0, 0, 1])
    }
  }
}

/** Panel points from a to b, n panels. */
const panels = (a: number, b: number, n: number) => stations(a, b, (b - a) / n)

// ---- Decks -------------------------------------------------------------------------

/**
 * Both decks' green fascia girders and parapets, the underside of each, from
 * ya to yb. No road surfaces: the map draws both roadways. Inside the trusses
 * the fascias are the deck edges just inside the truss planes.
 */
function decks(k: Kit, ya: number, yb: number, lod: Lod, inTruss: boolean) {
  const ys = stations(ya, yb, lod === 'low' ? 24 : 12)
  const F = { out: true, in: true, top: true, bottom: true }
  for (const [deck, half, girder] of [[upper, (y: number) => UPPER_HALF(y), inTruss ? 1.4 : 2.6], [lower, () => TX, inTruss ? 1.2 : 2.6]] as [(y: number) => number, (y: number) => number, number][]) {
    for (const s of [-1, 1]) {
      const xo = (y: number) => s * (half(y) - (inTruss ? 0.6 : 0))
      // A band can't follow a varying x, so the widened toll-plaza deck is drawn in short straight pieces.
      for (let i = 0; i < ys.length - 1; i++) {
        const y0 = ys[i], y1 = ys[i + 1]
        const x0 = xo(y0), x1 = xo(y1)
        if (Math.abs(x0 - x1) < 0.05) {
          band(k.steel, Math.min(x0, x0 - s * 0.5), Math.max(x0, x0 - s * 0.5), [y0, y1], (y) => deck(y) + 1.0, (y) => deck(y) - girder, F)
        } else {
          const z = (y: number, d: number) => deck(y) + d
          const n: V3 = nrm([s * (y1 - y0), -(x1 - x0), 0])
          face(k.steel, [x0, y0, z(y0, -girder)], [x1, y1, z(y1, -girder)], [x1, y1, z(y1, 1.0)], [x0, y0, z(y0, 1.0)], n)
          face(k.steel, [x0, y0, z(y0, 1.0)], [x1, y1, z(y1, 1.0)], [x1 - s * 0.5, y1, z(y1, 1.0)], [x0 - s * 0.5, y0, z(y0, 1.0)], [0, 0, 1])
        }
      }
    }
    // The deck's underside, closing it from below and seen between the map's lanes from above.
    for (let i = 0; i < ys.length - 1; i++) {
      const y0 = ys[i], y1 = ys[i + 1], h0 = half(y0) - 0.5, h1 = half(y1) - 0.5
      const z0 = deck(y0) - 1.0, z1 = deck(y1) - 1.0
      face(k.under, [-h0, y0, z0], [h0, y0, z0], [h1, y1, z1], [-h1, y1, z1], [0, 0, 1])
      face(k.under, [-h0, y0, z0 - 0.3], [h0, y0, z0 - 0.3], [h1, y1, z1 - 0.3], [-h1, y1, z1 - 0.3], [0, 0, -1])
    }
  }
}

// ---- Supports ------------------------------------------------------------------------

const rect = (cx: number, cy: number, hx: number, hy: number): [number, number][] =>
  [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]]

/**
 * A concrete portal pier (the main, anchor and Little Mystic piers): two
 * columns under the truss planes, a strut half-way up and a cap under the
 * bottom chord (photos: plain concrete, rust-stained under the bearings).
 */
function portal(k: Kit, y: number, col: [number, number], capZ: number) {
  const [cw, cd] = col
  for (const s of [-1, 1])
    footedLoft(k.concrete, deepFoot, [{ plan: rect(s * TX, y, cw / 2, cd / 2), z: 'ground' }, { plan: rect(s * TX, y, cw / 2, cd / 2), z: capZ - 2.5 }], 2, false)
  footedLoft(k.concrete, foot, [{ plan: rect(0, y, TX + cw / 2 + 0.4, cd / 2 + 0.3), z: capZ - 2.5 }, { plan: rect(0, y, TX + cw / 2 + 0.4, cd / 2 + 0.3), z: capZ }], 6)
  const g = Math.max(foot(-TX, y), foot(TX, y))
  const mz = (g + capZ) / 2
  if (capZ - g > 15) footedLoft(k.concrete, foot, [{ plan: rect(0, y, TX, cd / 2 - 0.5), z: mz - 1.2 }, { plan: rect(0, y, TX, cd / 2 - 0.5), z: mz + 1.2 }], 6)
}

/**
 * A steel approach bent (green): two columns from the ground to the upper
 * deck, a cross girder under each deck, and X bracing between the columns.
 */
function bent(k: Kit, y: number, lod: Lod) {
  const hx = TX - 0.8, zl = lower(y) - 2.6, zu = upper(y) - 2.6
  const uh = UPPER_HALF(y) - 0.5
  for (const s of [-1, 1]) {
    const g = foot(s * hx, y)
    beam(k.steel, [s * hx, y, g], [s * hx, y, zu], 1.6, 1.6, [1, 0, 0])
  }
  beam(k.steel, [-TX + 0.3, y, zl - 0.7], [TX - 0.3, y, zl - 0.7], 1.0, 1.4, [0, 0, 1])
  beam(k.steel, [-uh, y, zu - 0.7], [uh, y, zu - 0.7], 1.0, 1.4, [0, 0, 1])
  // X bracing between the columns, in bays about 12 m tall, under the lower deck and between the decks.
  const g = Math.max(foot(-hx, y), foot(hx, y))
  const levels = [...stations(g + 1, zl - 1.4, 12), zu - 1.4]
  const w = lod === 'low' ? 0.8 : 0.5
  for (let i = 0; i < levels.length - 1; i++) {
    strip(k.web, [-hx, y, levels[i]], [hx, y, levels[i + 1]], w, [0, 1, 0])
    strip(k.web, [hx, y, levels[i]], [-hx, y, levels[i + 1]], w, [0, 1, 0])
    if (lod === 'detail' && i > 0) beam(k.steel, [-hx, y, levels[i]], [hx, y, levels[i]], 0.5, 0.6, [0, 0, 1])
  }
}

// Approach bents (estimated spacing, about 36 m; the photos show tall braced steel bents).
const BENTS = [-452, ...stations(-331, S0, (S0 + 331) / 10).slice(1, -1), 490, 517]

// ---- Lamps ---------------------------------------------------------------------------

/** Lamp posts along the upper deck's parapets, about 40 m apart (photos); beads, sparser, in the low model. */
function lamps(k: Kit, lod: Lod) {
  for (const y of stations(Y0 + 6, Y1 - 6, lod === 'low' ? 80 : 40)) for (const s of [-1, 1]) {
    const x = s * (UPPER_HALF(y) - 0.4), zt = upper(y) + 10
    if (lod === 'detail') band(k.steel, x - 0.12, x + 0.12, [y - 0.12, y + 0.12], () => zt, () => upper(y) + 1.0, { out: true, in: true, ends: true })
    bead(k.lamp, [x, y, zt + 0.3], lod === 'low' ? 0.5 : 0.35, lod === 'low')
  }
}

// ---- Build -----------------------------------------------------------------------------

function build(lod: Lod): Kit {
  const k = newKit()
  // The cantilever truss: 8 panels on each anchor arm, 20 on the main span.
  const ys = [...panels(S0, P1, 8), ...panels(P1, P2, 20).slice(1), ...panels(P2, N0, 8).slice(1)]
  truss(k, ys, top, botChord, lod)
  // The Little Mystic Channel truss: 10 panels, the end posts inclined.
  const lys = panels(LM0, LM1, 10)
  const lt = (y: number) => (y <= LM0 + 0.1 || y >= LM1 - 0.1 ? upper(y) + 1.5 : lmTop(y))
  truss(k, lys, lt, botChord, lod)
  // Decks: in the trusses, and on the approaches between them and to the outline's ends.
  decks(k, S0, N0, lod, true)
  decks(k, LM0, LM1, lod, true)
  decks(k, Y0, LM0, lod, false)
  decks(k, LM1, S0, lod, false)
  decks(k, N0, Y1, lod, false)
  // Piers: the main piers, the truss ends' piers, the Little Mystic truss's piers; steel bents elsewhere.
  for (const y of [P1, P2]) portal(k, y, [5.0, 7.0], botChord(y) - 0.9)
  for (const y of [S0, N0, LM0, LM1]) portal(k, y, [3.6, 4.5], botChord(y) - 0.9)
  for (const y of BENTS) bent(k, y, lod)
  lamps(k, lod)
  return k
}

if (import.meta.main) {
  const STEEL = { ...finish('truss-green', 0x5fa98b), doubleSided: true }
  const VEIL = { ...finish('truss-veil', 0x86c2a8), opacity: 0.25, doubleSided: true }
  const CONCRETE = finish('concrete', 0xcbbfa9)
  const UNDER = finish('deck-underside', 0x8d9296)
  const LAMP = finish('lamp', 0x4a4f57)
  const list = (k: Kit, lod: Lod) => [
    { part: k.steel, material: STEEL }, ...(lod === 'low' ? [{ part: k.veil, material: VEIL }] : []),
    { part: k.concrete, material: CONCRETE }, { part: k.under, material: UNDER }, { part: k.lamp, material: LAMP },
  ]
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin on the deck axis at the outline centroid, on the river (NAVD88 -2.13 m)',
    bearing: 33.57, elevation: 0, piers: [P1, P2], trussEnds: [S0, N0],
    roadwayHeights: { upperAtPiers: [upper(P1), upper(P2)], upperCrest: upper(235), lower: `upper - ${LOWER_GAP} (estimated)` },
  }
  for (const [file, lod, maxTris, maxBytes] of [
    ['bos-tobin-bridge.glb', 'low', 6500, 250 * 1024],
    ['bos-tobin-bridge.detail.glb', 'detail', 40000, 1536 * 1024],
  ] as const) {
    const parts = list(build(lod), lod)
    const tris = countParts(parts)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Maurice J. Tobin Memorial Bridge', parts, extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
