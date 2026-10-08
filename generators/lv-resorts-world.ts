/**
 * Resorts World Las Vegas: the hotel tower (2021), two curved wings of
 * copper-red glass, the Hilton's and the Conrad's (with Crockfords), held
 * between tall red piers at their ends and where they meet. Procedural,
 * CC0-1.0.
 * bun generators/lv-resorts-world.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: the plan is drawn in
 * OSM's own orientation. The origin is the area centroid of the tower's
 * outline, way/316303708 (36.134767, -115.166194).
 *
 * Published (Wikipedia, "Resorts World Las Vegas"): opened June 2021; the
 * tower rose on the steel left by Boyd's unfinished Echelon; 59 storeys,
 * about 3,500 rooms in three hotels: Hilton, Conrad and Crockfords. The
 * red-framed curved towers are its identity. OSM tags way/316303708
 * height=205.4, building:levels=57.
 *
 * Measured, from OSM way/316303708: one slab about 20 m deep, bent at
 * (−9, 37): a west wing (the Conrad, 112 m long, its north face convex)
 * and a south-east wing (the Hilton, 130 m long, its north-east face
 * concave). The USGS NAIP orthophoto (public domain) shows the same bent
 * slab on the roof.
 *
 * Photos (Wikimedia Commons):
 * - "Resorts World Las Vegas May 2022.jpg", Logan Frick, CC BY-SA 4.0: from
 *   the Strip to the north-east: the Hilton wing's concave face on the left,
 *   the Conrad's sweeping face on the right, a red pier at each outer end
 *   and a narrower red pier between them standing above both roofs;
 * - "Resorts World Las Vegas (Sep 2021).jpg", Tomás Del Coro, CC BY-SA 2.0:
 *   from the north, the same three piers, the Conrad glass copper in sun;
 * - "Conrad Las Vegas at Resorts World February 2023 HDR.jpg", King of
 *   Hearts, CC BY-SA 4.0, and "Resorts World Las Vegas 2026-05-14 1.jpg",
 *   Yelderberry, CC BY-SA 4.0: the red piers and the dark glass from the
 *   Strip, by day and at night (the glass is lit by rooms: a `window` wall).
 *
 * Measured from the photos (scaled by the tower's height): the piers about
 * 12 to 14 m wide; the middle pier about 10 m above the roofs, the end
 * piers about 2 m. Estimated: the piers' depth (drawn wrapping the slab
 * and 0.8 m proud of it), the glass colour (a dark maroon-copper, pulled
 * up to the palette's lightness), the red (a saturated signal red, pulled
 * to the palette's lightness), the bevels. The Hilton face's LED screen,
 * the signs and the casino podium (way/972129019, whose heights OSM does
 * not record) are left out.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { boxRing, prism, save, type XY } from './lv-wynn'

const glass = new Part(), red = new Part(), roof = new Part()

const PLAN: XY[] = [
  [100.6, -61.8], [90.0, -81.5], [69.8, -70.0], [43.2, -48.9], [23.9, -25.4], [3.7, 7.6], [-4.0, 25.3], [-13.2, 29.7],
  [-47.9, 30.6], [-78.8, 24.9], [-113.0, 12.4], [-123.1, 28.7], [-74.9, 46.4], [-42.1, 50.3], [-11.7, 48.3], [15.3, 32.5],
  [27.3, 8.6], [44.2, -13.9], [64.5, -38.4],
]
const H = 205.4

prism(glass, roof, PLAN, 0, H, 0.5, 0.5)

// The red piers: boxes wrapping the slab, a little proud of both faces.
// [centre, half-length along the slab, half-width across it, angle]
const PIERS: [XY, number, number, number, number][] = [
  [[-112.9, 22.5], 6.5, 11.0, 32, H + 2], // the Conrad's west end
  [[90.5, -69.0], 6.5, 12.2, -28.4, H + 2], // the Hilton's south-east end
  [[-8.0, 38.0], 6.5, 12.0, -30, H + 10], // where the wings meet
]
for (const [c, hu, hv, a, top] of PIERS) prism(red, roof, boxRing(c, hu, hv, a), 0, top, 0.5, 0.5)

await save('lv-resorts-world', 'Resorts World Las Vegas', [
  { part: glass, material: windowVariant(2, 0x9c7470) },
  { part: red, material: finish('rw-red', 0xd0625a) },
  { part: roof, material: PALETTE.roof },
], H + 10, 'Y up, -Z north, +X east, metres; origin at the way/316303708 centroid; bearing 0')
