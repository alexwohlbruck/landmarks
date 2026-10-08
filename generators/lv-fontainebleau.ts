/**
 * Fontainebleau Las Vegas: the blue-glass hotel tower (begun 2007, stalled
 * 2009, finished and opened December 2023), the tallest occupied building
 * in Nevada. Procedural, CC0-1.0.
 * bun generators/lv-fontainebleau.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: the plan is drawn in
 * OSM's own orientation. The origin is the area centroid of the tower's
 * outline, way/134068318 (36.137992, -115.159404).
 *
 * Published (Wikipedia, "Fontainebleau Las Vegas"): 735 ft (224 m), 67
 * storeys, by Bergman Walls & Associates; blue glass, the tallest occupied
 * building in Nevada. OSM tags way/134068318 height=224, building:levels=63.
 *
 * Measured, from OSM way/134068318: a boomerang plan. Its outer side is a
 * straight west face, a broad rounded corner sweeping round the south-west,
 * and a straight south-east face running out to the north-east arm; the
 * inner (north) side is three faces round a recessed middle bay. Arms are
 * 24 to 32 m deep. Taken as is, unsimplified.
 *
 * Photos (Wikimedia Commons):
 * - "South end of Fontainebleau Las Vegas (2024).png", Ron Mader,
 *   CC BY-SA 2.0: from the south-east, the rounded corner as a few broad
 *   facets of mid-blue glass; a pale belt at about the middle; the crown, a
 *   white rim over a dark band of glass;
 * - "Fontainebleau Las Vegas - October 2021.jpg", APK, CC BY-SA 4.0: from
 *   the south-west, the west face and the corner, the belt and the white
 *   rim;
 * - "North side of Fontainebleau tower in Las Vegas.jpg", AJFU,
 *   CC BY-SA 4.0: the inner side from the Strip, two arms and the recessed
 *   middle, the belt running round all of them at one level;
 * - "Fontainebleau Las Vegas tower, seen from Sahara.jpg", AJFU,
 *   CC BY-SA 4.0: the inner side from the north-west;
 * - "Fontainebleau Las Vegas exterior.jpg", Dialh, CC BY 4.0: at night, the
 *   glass lit by rooms (so it is a `window` wall) and the crown band lit.
 *
 * Measured from the photos (scaled by the published height): the belt at
 * about 106 to 109 m, the dark crown band about 4 m and the white rim about
 * 6 m. Estimated: the glass colour (the real glass is a saturated cobalt,
 * pulled to the palette's lightness), the bevels. The podium, way/134068317,
 * is a large angular block whose heights OSM does not record; it is left to
 * the map, as is the separate building:part way/134068316 beside it.
 */
import { Part } from './mesh'
import { PALETTE, windowVariant } from './palette'
import { prism, save, type XY } from './lv-wynn'

const glass = new Part() // blue curtain wall
const trim = new Part() // the belt and the crown's rim
const band = new Part() // the crown's dark band of glass
const roof = new Part()

const PLAN: XY[] = [
  [78.3, 29.6], [25.0, -6.3], [1.1, -10.2], [-32.2, 11.9], [-36.5, 47.6], [-64.3, 64.1], [-59.4, 16.9], [-58.0, 7.8],
  [-55.3, -1.1], [-51.2, -8.7], [-46.7, -14.9], [-40.2, -20.9], [-32.4, -27.6], [-24.2, -32.2], [-13.6, -36.0], [-3.0, -38.2],
  [7.6, -38.7], [17.0, -37.2], [26.6, -33.9], [32.2, -31.0], [46.2, -21.4], [91.5, 10.0],
]
const H = 224, BELT0 = 106, BELT1 = 109.5, BAND = 12, RIM = 7

prism(glass, null, PLAN, 0, BELT0, 0, 0.6)
prism(trim, null, PLAN, BELT0, BELT1, 0, 0.6)
prism(glass, null, PLAN, BELT1, H - BAND, 0, 0.6)
prism(band, null, PLAN, H - BAND, H - RIM, 0, 0.6)
prism(trim, roof, PLAN, H - RIM, H, 0.6, 0.6)

await save('lv-fontainebleau', 'Fontainebleau Las Vegas', [
  { part: glass, material: windowVariant(2, 0x7296c6) },
  { part: trim, material: PALETTE.trim },
  { part: band, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
], H, 'Y up, -Z north, +X east, metres; origin at the way/134068318 centroid; bearing 0')
