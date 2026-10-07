/**
 * Vdara Hotel & Spa, Las Vegas: the crescent of blue glass, three curved
 * slabs side by side and stepped in height, the tallest in the middle,
 * concave to the south. Procedural, CC0-1.0.
 * bun generators/lv-vdara.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: drawn in OSM's own
 * orientation. The origin is the area centroid of the middle slab,
 * way/52175577 (36.109526, -115.178022).
 *
 * Published (Wikipedia, "Vdara"; Rafael Viñoly, opened 2009): a
 * crescent-shaped 57-storey tower of 1,495 suites. OSM, relation/20214578:
 * three building:parts, way/134932949 (north, 165 m, 55 levels),
 * way/52175577 (middle, 174 m, 57 levels) and way/134932948 (south, 140 m,
 * 48 levels), and the outline way/1481167211 over them and the lobby.
 *
 * Measured, from OSM: the slab faces fit circles about one centre
 * (-8.5, -108) within 0.5 m: the north slab between radii 118.2 and
 * 129.4 m, from 73.7° to 115°; the middle between 106.3 and 118.2 m, from
 * 59.7° to 113.5°; the south between 95.5 and 106.3 m, from 55.8° to
 * 95.6°. So the three slabs are each about 11 m deep, offset along the
 * curve, and their ends step.
 *
 * Photos (Wikimedia Commons):
 * - "Vdara - South - 2010-03-06.JPG", Cygnusloop99, CC BY-SA 3.0: the
 *   concave south face, the three slabs and their steps, blue glass with
 *   fine pale floor lines;
 * - "Vdara (23793642159).jpg", Thomas Duesing, CC BY 2.0, and "The Vdara
 *   (Mike Murry) - Flickr.jpg", Mike Murry, CC BY-SA 2.0: close up, the
 *   sweep of the curved faces and the stepped ends;
 * - "Vdara, Las Vegas.jpg", Supercarwaar, CC BY-SA 4.0: from the east, the
 *   slabs end-on, stepped in height;
 * - "Aria Las Vegas December 2013.jpg", King of Hearts, CC BY-SA 3.0: from
 *   the south-east, Vdara behind Aria.
 *
 * Estimated: the lobby block under the outline, 10 m; the floor lines,
 * every four storeys; the glass colour, the photos' blue pulled light.
 * Left out: the "Vdara" sign, the porte-cochère canopy and pool deck.
 */
import { Part } from './mesh'
import { PALETTE, windowVariant } from './palette'
import { curvedTower } from './lv-aria'
import { prism, save, type XY } from './lv-wynn'

const glass = new Part(), line = new Part(), roof = new Part()
const BLUE = windowVariant(2, 0x93adc8)
const C: XY = [-8.5, -108]
const LINES = { z0: 12, step: 14, h: 1.1 }

// the three slabs, north to south; a thin pale parapet band on each top
curvedTower({ c: C, r0: 118.2, r1: 129.4, a0: 73.7, a1: 115, H: 165, crown: 1.6, lines: LINES }, glass, line, roof)
curvedTower({ c: C, r0: 106.3, r1: 118.2, a0: 59.7, a1: 113.5, H: 174, crown: 1.6, lines: LINES }, glass, line, roof)
curvedTower({ c: C, r0: 95.5, r1: 106.3, a0: 55.8, a1: 95.6, H: 140, crown: 1.6, lines: LINES }, glass, line, roof)

// the lobby under the outline, way/1481167211
const LOBBY: XY[] = [
  [-64.7, 9.5], [-63.3, 9.3], [-55.9, 12.5], [-50.3, 14.9], [-44.1, 16.7], [-35.8, 18.6], [-29.4, 19.7], [-22.2, 20.5],
  [-15.8, 21.2], [-10.8, 21.2], [-3.4, 21.3], [5.0, 20.9], [13.4, 19.4], [20.7, 18.2], [27.9, 16.6], [24.3, 6.1], [31.8, 3.8],
  [38.8, 1.0], [45.8, -2.5], [51.4, -5.7], [43.6, -16.9], [46.1, -18.7], [50.7, -22.0], [44.4, -30.2], [41.4, -35.3],
  [46.8, -37.0], [56.3, -43.2], [63.0, -47.1], [62.8, -36.3], [70.0, -41.8], [69.8, -27.2], [65.0, -22.1], [59.2, -14.6],
  [55.2, -8.1], [49.7, 2.5], [47.3, 10.4], [45.8, 17.9], [45.4, 24.8], [-64.6, 24.5],
]
prism(line, roof, LOBBY, 0, 10, 0, 0)

await save('lv-vdara', 'Vdara Hotel & Spa', [
  { part: glass, material: BLUE },
  { part: line, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
], 174, 'Y up, -Z north, +X east, metres; origin at the way/52175577 centroid; bearing 0')
