/**
 * Alice in Wonderland, Central Park, north of Conservatory Water (José de
 * Creeft, 1959) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-alice-in-wonderland.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Bearing 0:
 * Alice faces model −y, south, toward Conservatory Water and the plaza the
 * group is seen from; the rocky bank and wall rise behind her. Anchor: OSM
 * node/561950603 (tourism=artwork, "Alice in Wonderland"), the middle of the
 * group. Not a building in OSM, so `replaces` is empty. The pebble ring and
 * paving round it are the map's ground; only the bronze base is drawn.
 *
 * Evidence
 * - Published (NYC Parks; Central Park Conservancy; Wikipedia "Alice in
 *   Wonderland (sculpture)"): bronze, about 11 ft (3.4 m) tall; Alice on a
 *   giant mushroom with Dinah in her lap, the White Rabbit with his pocket
 *   watch, the Mad Hatter, the Dormouse, the Cheshire Cat in the tree behind,
 *   smaller toadstools for children to climb.
 * - Photos (Wikimedia Commons; credits in
 *   landmarks-scratch/nyc-parks/work/nyc-alice-in-wonderland/photos):
 *   Gzzz, "Alice in Wonderland Central Park NYC.JPG", CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:Alice_in_Wonderland_Central_Park_NYC.JPG
 *   (the whole group from the front, south);
 *   GreenReaper, "Alice in Wonderland sculpture in Central Park.jpg", public
 *   domain,
 *   https://commons.wikimedia.org/wiki/File:Alice_in_Wonderland_sculpture_in_Central_Park.jpg
 *   (closer, south-west: the rabbit, the tree, the Hatter and toadstools).
 * - Estimated from the front photo scaled to the published 3.4 m (Alice's
 *   head): base 4.9 × 3.0 m; mushroom cap 2.6 m across, top +1.75 m, stem
 *   1.0 m; Rabbit 2.0 m to his ear tips; Hatter's hat +2.35 m; the Cheshire
 *   Cat's tree +2.9 m; toadstools 0.8–1.25 m. Alice is built a little stout and scaled 1.2 about her seat so she dominates as in the photos. Poses are simplified to bold
 *   masses: Alice's legs out to her right (model −x), arms spread.
 * - Lidar was not used (a 3.4 m bronze under trees).
 *
 * Doubts: the orientation (Alice facing due south) is from the photos'
 * setting, not a survey; the back of the group is seen in no photo used and
 * is drawn as the front implies.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { smooth, solid, lathe, ellipsoid, tube } from './nyc-columbus-monument'
import { ell } from './nyc-uss-maine-monument'

const bronze = new Part(), polished = new Part()

// --- The bronze base: a low, irregular oval slab. ---
smooth(bronze, q => solid(q, [ell(0, 0, 0, 2.45, 1.5, 16), ell(0, 0, 0.12, 2.42, 1.47, 16), ell(0, 0, 0.18, 2.3, 1.38, 16)]), 40)

// --- The great mushroom: stem and a broad polished cap. ---
smooth(bronze, q => lathe(q, [[0.62, 0.15], [0.5, 0.4], [0.44, 1.0], [0.46, 1.38]], 12, 0, 0.1, false), 50)
smooth(polished, q => lathe(q, [[0.42, 1.36], [0.95, 1.4], [1.28, 1.5], [1.3, 1.58], [1.05, 1.7], [0.55, 1.76], [0, 1.78]], 16, 0, 0.1, true), 60)

// --- Toadstools at the front right, for children to climb. ---
for (const [x, y, h, r] of [[1.35, -0.55, 0.95, 0.5], [0.95, -1.0, 0.6, 0.42], [1.75, 0.15, 1.05, 0.55]]) {
  smooth(bronze, q => lathe(q, [[0.22, 0.15], [0.16, 0.4], [0.15, h]], 8, x, y, false), 50)
  smooth(polished, q => lathe(q, [[0.14, h - 0.05], [r * 0.85, h], [r, h + 0.1], [r * 0.7, h + 0.22], [0, h + 0.27]], 12, x, y, true), 60)
}

// --- Alice, seated on the cap, facing −y, legs out to her right (−x);
// built at 1/1.2 and scaled up about her seat. ---
const alice = new Part()
smooth(alice, q => {
  const ax = -0.3, ay = 0.15, z0 = 1.68
  // Skirt spread over the cap.
  ellipsoid(q, [ax - 0.1, ay - 0.05, z0 + 0.1], [0.72, 0.58, 0.2], 12, 4)
  // Torso to the neck.
  solid(q, [ell(ax, ay, z0 + 0.12, 0.28, 0.22, 10), ell(ax, ay, z0 + 0.45, 0.19, 0.14, 10), ell(ax, ay, z0 + 0.8, 0.25, 0.15, 10), ell(ax, ay, z0 + 0.95, 0.07, 0.06, 10)])
  // Head, a little bowed toward the rabbit, and her long hair behind.
  ellipsoid(q, [ax - 0.02, ay - 0.03, z0 + 1.2], [0.16, 0.18, 0.21], 10, 5)
  ellipsoid(q, [ax, ay + 0.1, z0 + 1.0], [0.22, 0.13, 0.36], 10, 4)
  ellipsoid(q, [ax, ay + 0.02, z0 + 1.43], [0.12, 0.06, 0.06], 6, 3)
  // Legs out to the left of the picture, over the cap's edge.
  for (const dy of [-0.08, 0.1]) tube(q, [[ax - 0.2, ay + dy, z0 + 0.12], [ax - 0.75, ay + dy - 0.15, z0 + 0.2], [ax - 1.15, ay + dy - 0.2, z0 + 0.08], [ax - 1.32, ay + dy - 0.22, z0 + 0.1]], [0.1, 0.085, 0.07, 0.07], 6)
  // Arms spread: her right down toward Dinah and the rabbit, her left onto the cap.
  tube(q, [[ax - 0.2, ay, z0 + 0.78], [ax - 0.6, ay - 0.2, z0 + 0.55], [ax - 0.85, ay - 0.35, z0 + 0.1]], [0.07, 0.06, 0.05], 6)
  tube(q, [[ax + 0.2, ay, z0 + 0.78], [ax + 0.7, ay - 0.1, z0 + 0.5], [ax + 0.85, ay - 0.25, z0]], [0.07, 0.06, 0.05], 6)
  // Dinah in her lap.
  ellipsoid(q, [ax - 0.15, ay - 0.35, z0 + 0.32], [0.14, 0.2, 0.15], 8, 4)
  ellipsoid(q, [ax - 0.12, ay - 0.45, z0 + 0.5], [0.09, 0.09, 0.09], 6, 3)
}, 60)
{
  // Part stores glTF (x, z, −y): scale about Alice's seat (−0.3, 0.15, 1.68).
  const k = 1.2, c = [-0.3, 1.68, -0.15]
  for (let i = 0; i < alice.pos.length; i++) alice.pos[i] = c[i % 3] + (alice.pos[i] - c[i % 3]) * k
  bronze.pos.push(...alice.pos); bronze.nrm.push(...alice.nrm); bronze.uv.push(...alice.uv)
}

// --- The Dormouse on the cap's edge at her left. ---
smooth(bronze, q => { ellipsoid(q, [1.0, -0.3, 1.78], [0.12, 0.1, 0.16], 8, 4); ellipsoid(q, [1.0, -0.33, 1.98], [0.08, 0.08, 0.08], 6, 3) }, 60)

// --- The White Rabbit, standing at the left in his waistcoat, watch in paw. ---
smooth(bronze, q => {
  const rx = -2.0, ry = -0.45
  for (const s of [-1, 1]) tube(q, [[rx + s * 0.12, ry, 0.15], [rx + s * 0.13, ry + 0.05, 0.5], [rx + s * 0.1, ry, 0.75]], [0.09, 0.1, 0.11], 6)
  solid(q, [ell(rx, ry, 0.65, 0.24, 0.2, 10), ell(rx, ry, 0.95, 0.22, 0.19, 10), ell(rx, ry, 1.3, 0.18, 0.16, 10), ell(rx, ry, 1.42, 0.08, 0.08, 10)])
  ellipsoid(q, [rx + 0.04, ry - 0.08, 1.58], [0.15, 0.22, 0.17], 8, 4, 0.4, 0.2)
  for (const s of [-1, 1]) tube(q, [[rx + s * 0.06, ry + 0.02, 1.68], [rx + s * 0.09, ry + 0.04, 1.9], [rx + s * 0.08, ry + 0.02, 2.05]], [0.06, 0.07, 0.03], 5)
  tube(q, [[rx + 0.17, ry, 1.25], [rx + 0.3, ry - 0.2, 1.1], [rx + 0.28, ry - 0.3, 1.18]], [0.05, 0.045, 0.045], 5)
  tube(q, [[rx - 0.17, ry, 1.25], [rx - 0.22, ry - 0.1, 0.95]], [0.05, 0.045], 5)
  // Coat tails behind.
  ellipsoid(q, [rx, ry + 0.18, 0.85], [0.22, 0.1, 0.32], 8, 4)
}, 60)

// --- The Cheshire Cat's tree, a gnarled stump behind at the left, the cat at its top. ---
smooth(bronze, q => {
  tube(q, [[-1.35, 1.15, 0.15], [-1.3, 1.2, 1.2], [-1.2, 1.15, 2.2], [-1.1, 1.1, 2.55]], [0.3, 0.22, 0.17, 0.13], 8)
  tube(q, [[-1.25, 1.1, 1.6], [-1.65, 1.05, 2.2], [-1.85, 1.0, 2.55]], [0.13, 0.1, 0.06], 6)
  tube(q, [[-1.1, 1.05, 2.1], [-0.8, 1.15, 2.6], [-0.7, 1.2, 2.9]], [0.11, 0.08, 0.05], 6)
  ellipsoid(q, [-1.08, 0.92, 2.62], [0.26, 0.2, 0.2], 10, 4)
  for (const s of [-1, 1]) tube(q, [[-1.08 + s * 0.14, 0.92, 2.72], [-1.08 + s * 0.2, 0.92, 2.9]], [0.07, 0.01], 4)
}, 60)

// --- The Mad Hatter at the right: hunched over, a big head and the top hat. ---
smooth(bronze, q => {
  const hx = 2.0, hy = -0.05
  solid(q, [ell(hx, hy, 0.15, 0.42, 0.4, 10), ell(hx, hy, 0.6, 0.36, 0.32, 10), ell(hx - 0.03, hy - 0.04, 1.15, 0.3, 0.24, 10), ell(hx - 0.03, hy - 0.05, 1.3, 0.12, 0.1, 10)])
  ellipsoid(q, [hx - 0.04, hy - 0.1, 1.55], [0.31, 0.28, 0.33], 10, 5)
  tube(q, [[hx - 0.25, hy - 0.05, 1.1], [hx - 0.45, hy - 0.3, 0.85], [hx - 0.35, hy - 0.45, 0.7]], [0.08, 0.07, 0.06], 6)
  tube(q, [[hx + 0.25, hy - 0.05, 1.1], [hx + 0.35, hy - 0.3, 0.75], [hx + 0.2, hy - 0.45, 0.6]], [0.08, 0.07, 0.06], 6)
  // Knees drawn up in front.
  for (const s of [-1, 1]) ellipsoid(q, [hx + s * 0.17, hy - 0.35, 0.55], [0.13, 0.25, 0.13], 8, 4)
}, 60)
smooth(polished, q => lathe(q, [[0.4, 1.78], [0.42, 1.84], [0.27, 1.86], [0.29, 2.15], [0.32, 2.35], [0, 2.36]], 12, 1.96, -0.15, true), 50)

finishModel('Alice in Wonderland', 'nyc-alice-in-wonderland', [
  { part: bronze, material: { name: 'bronze', color: 0x6e5c44, roughness: 0.6 } },
  { part: polished, material: { name: 'bronze-polished', color: 0xa3875a, roughness: 0.45 } },
], { bearing: 0, height: 3.4 }, 6500)
