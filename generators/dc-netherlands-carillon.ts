/**
 * Netherlands Carillon, Arlington, Virginia — procedural, CC0-1.0.
 *
 *   bun generators/dc-netherlands-carillon.ts
 *
 * Map frame: x east, y north, z up, metres. The origin is the centre of the
 * tower's OSM outline (way/41273627; lng -77.0694954, lat 38.8882159), on
 * the plaza. Bearing 0: the long sides face east and west.
 *
 * Joost W. C. Boks's open steel campanile (1960): four corner posts rising
 * the full 39 m, a solid plate core up to the first platform, then a ring of
 * louvred bell-chamber panels between two balconies, and above them an empty
 * cage of posts and beams around the inner bell frame, where the bells hang
 * in the open. Two bronze lions by Paul Koning guard the plaza's east steps.
 *
 * Evidence
 *  - OSM (measured): way/41273627, building=yes, man_made=tower,
 *    height=39; the lions are node/504620898 and node/504620901
 *    (tourism=artwork, artist Paul Koning), 15 m east of the tower.
 *  - Published (Wikipedia, NRHP): 127 ft (39 m) high, 36 ft (11 m) long and
 *    25 ft (7.6 m) wide; open steel structure reinforced by steel plate. The
 *    OSM outline is a 7.4 m square, so the plan here is the published one,
 *    centred on it, long side north-south as the photos show it.
 *  - Photos (Wikimedia Commons): Carol M. Highsmith "Looking W at
 *    Netherlands Carillon" (public domain) for every level, measured on the
 *    east face; Bart de Goeij (CC BY-SA 3.0) and Ben Schumin (CC BY-SA 2.0 and
 *    3.0) for the structure from below; FaceMePLS (CC BY 2.0, both photos)
 *    for the narrow face and the lion; Duane Lempke (CC0) from the air.
 *
 * Measured off the east face (39 m = the published height): platform beam
 * 17.4–18.2 m, lower balcony to 20.6, louvres 20.6–25.7, upper balcony beam
 * 25.7–26.3, inner bell frame up to 34.2, top beam 38.1–39. The plate core
 * is 47% of the long face. Estimated: post and beam sizes (0.8 m and 0.6 m),
 * the core's depth (4.6 m: the short face shows it as a column with
 * open bays either side, the long faces as a plate near their plane), the
 * lions' sizes (about 2.5 m long, on 0.7 m plinths).
 * The steel is a dark blue-grey in every photo, held at charcoal; railings,
 * louvre slats and the bells themselves are too fine to draw, so the louvres
 * are one panel per bay and the bells a bronze panel on the bell frame.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { ellipsoid, prism, rect, save, tube } from './dc-wwii-memorial'

const steel = new Part()
const louvre = new Part()
const bells = new Part()
const bronze = new Part()
const stone = new Part()

const HX = 3.8, HY = 5.5, H = 39
const P = 0.4 // half a corner post
const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0) =>
  prism(p, rect((x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2), z0, z1, b, true)

// Corner posts, full height.
for (const sx of [-1, 1]) for (const sy of [-1, 1])
  box(steel, sx * HX - P, sx * HX + P, sy * HY - P, sy * HY + P, 0, H, 0.08)

// Ring beams: the platform, the upper balcony and the top.
function ring(z0: number, z1: number, d = 0.8) {
  for (const sx of [-1, 1]) box(steel, sx * HX - (sx > 0 ? d : 0), sx * HX + (sx < 0 ? d : 0), -HY + P, HY - P, z0, z1)
  for (const sy of [-1, 1]) box(steel, -HX + P, HX - P, sy * HY - (sy > 0 ? d : 0), sy * HY + (sy < 0 ? d : 0), z0, z1)
}
ring(17.4, 18.2)
ring(25.7, 26.3)
ring(38.1, H)

// Intermediate posts above the platform: two on each long face, one on each
// short face.
for (const sx of [-1, 1]) for (const y of [-2.2, 2.2])
  box(steel, sx * HX - 0.3 - (sx > 0 ? 0.3 : -0.3), sx * HX + 0.3 - (sx > 0 ? 0.3 : -0.3), y - 0.3, y + 0.3, 18.2, 38.1)
for (const sy of [-1, 1])
  box(steel, -0.3, 0.3, sy * HY - 0.3 - (sy > 0 ? 0.3 : -0.3), sy * HY + 0.3 - (sy > 0 ? 0.3 : -0.3), 18.2, 38.1)

// The plate core, from the ground to the platform.
// 5.2 m along the long faces (47% of them, east photo) and 4.6 m deep: the
// short face shows it as a central column with open bays either side.
box(steel, -2.3, 2.3, -2.6, 2.6, 0, 17.4)
// Platform and upper balcony floors.
box(steel, -HX + P, HX - P, -HY + P, HY - P, 18.0, 18.4)
// The louvred bell-chamber band between the balconies, set just inside the
// posts.
box(louvre, -HX + 0.25, HX - 0.25, -HY + 0.25, HY - 0.25, 20.6, 25.7)

// The inner bell frame above the upper balcony, the bells hanging in its
// open east and west faces.
box(steel, -1.8, 1.8, -2.2, 2.2, 26.3, 34.2, 0.06)
for (const sx of [-1, 1]) {
  const x = sx * 1.85
  const q: V3[] = [[x, -1.4, 28.0], [x, 1.4, 28.0], [x, 1.4, 32.4], [x, -1.4, 32.4]]
  if (sx > 0) bells.quad(q[0], q[1], q[2], q[3])
  else bells.quad(q[3], q[2], q[1], q[0])
}

// The two lions on their plinths, lying with heads up, looking east.
for (const [lx, ly] of [[14.8, 5.3], [15.4, -7.2]] as [number, number][]) {
  prism(stone, rect(lx, ly, 1.5, 0.75), 0, 0.7, 0.06)
  const z = 0.7
  // Haunches at the back (west), the chest and raised head at the front.
  ellipsoid(bronze, [lx - 0.7, ly, z + 0.45], [0.75, 0.55, 0.45], 8, 4)
  ellipsoid(bronze, [lx + 0.1, ly, z + 0.5], [0.8, 0.45, 0.42], 8, 4)
  tube(bronze, [[lx + 0.5, ly, z + 0.6], [lx + 0.75, ly, z + 1.35]], [0.36, 0.3], [0.36, 0.3], 6)
  ellipsoid(bronze, [lx + 0.85, ly, z + 1.5], [0.32, 0.27, 0.27], 6, 4)
  // Forelegs stretched out in front.
  for (const s of [-1, 1]) tube(bronze, [[lx + 0.5, ly + s * 0.25, z + 0.2], [lx + 1.4, ly + s * 0.25, z + 0.12]], [0.13, 0.12], [0.13, 0.12], 6)
}

await save('dc-netherlands-carillon', 'Netherlands Carillon', [
  // Dark blue-grey painted steel, held at charcoal.
  { part: steel, material: finish('carillon-steel', 0x4d535b) },
  // The louvres read a shade lighter, their slats catching the light.
  { part: louvre, material: finish('carillon-louvres', 0x656c75) },
  // The bells, bronze against the dark frame.
  { part: bells, material: finish('carillon-bells', 0x6c6352) },
  { part: bronze, material: finish('lion-bronze', 0x5c6a62) },
  { part: stone, material: finish('lion-plinth', 0xa9a49c) },
], { bearing: 0, osm: 'way/41273627', height: H })
