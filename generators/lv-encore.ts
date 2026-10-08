/**
 * Encore Las Vegas: the Wynn's sister tower (2008), a taller, deeper,
 * shorter crescent of the same bronze glass. Procedural, CC0-1.0.
 * bun generators/lv-encore.ts
 *
 * Built with the Wynn-family tower in lv-wynn.ts: a crescent slab striped
 * with pale floor lines, square ends each with a projecting bay.
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: the plan is drawn in
 * OSM's own orientation. The origin is the area centroid of the tower's
 * outline, way/27910891 (36.129408, -115.164760).
 *
 * Published (Wikipedia, "Encore Las Vegas"): opened December 2008, 631 ft
 * (192 m), 52 storeys (numbered to 63); "a curved bronze-glass tower similar
 * to Wynn Las Vegas". OSM tags height=192, building:levels=52,
 * building:colour=#B8860B, building:material=glass.
 *
 * Measured, from OSM way/27910891: both curved faces fit circles about one
 * centre (135, 176) within 1 m, radius 213.7 m (the concave north-east face,
 * towards Desert Inn Road) and 241.3 m (the convex south-west face), so the
 * slab is 27.6 m deep, deeper than the Wynn's 23.5, and runs from −148.9° to
 * −106.1°, 169 m along its middle: shorter and more tightly curved than the
 * Wynn. Each end carries a bay about 10 to 13 m wide and 4 m proud. The
 * USGS NAIP orthophoto (public domain) confirms the crescent and the
 * squared block at the south-east end.
 *
 * Photos (Wikimedia Commons):
 * - "Encore, Las Vegas Strip.jpg", Ken Lund, CC BY-SA 2.0: the concave face
 *   close on: dark bronze, a pale line every two storeys, a plain top band;
 * - "Encore, Las Vegas.jpg", Clément Bardot, CC BY-SA 4.0: from the Strip to
 *   the north-west, the end bay as a narrower slab, a dark slot beside it,
 *   rising a little above the roof;
 * - "Desert Inn Road and the Encore in Las Vegas, Nevada, September
 *   2026.jpg", TheYearbookTeacher, CC BY-SA 4.0: from the east, the concave
 *   face and the south-east end block;
 * - "Encore-wynn-towers.JPG", HoppingRabbit34, CC BY-SA 3.0: from the golf
 *   course, beside the Wynn, slimmer and taller;
 * - "Encore in Las Vegas (4096504781).jpg", John Fowler, CC BY 2.0: with the
 *   Wynn from the Strip, same glass and lines.
 *
 * Estimated: as for the Wynn, the bays' size and their 3 m rise, the line
 * spacing (drawn every 12 m, three storeys, so they stay clean at phone
 * size; the real lines are every two) and the bevels. Signage, the podium
 * and the Encore Beach Club are left out.
 */
import { Part } from './mesh'
import { PALETTE } from './palette'
import { BRONZE, LINE, save, wynnTower } from './lv-wynn'

const glass = new Part(), line = new Part(), roof = new Part()
wynnTower({
  c: [135, 176], r0: 213.7, r1: 241.3, a0: -148.9, a1: -106.1, n: 18,
  H: 192, bay: { w: 12, d: 4.5, dh: 3 },
  stripes: { z0: 14, step: 12, h: 1.3, top: 9 },
}, glass, line, roof)
await save('lv-encore', 'Encore Las Vegas', [
  { part: glass, material: BRONZE },
  { part: line, material: LINE },
  { part: roof, material: PALETTE.roof },
], 195, 'Y up, -Z north, +X east, metres; origin at the way/27910891 centroid; bearing 0')
