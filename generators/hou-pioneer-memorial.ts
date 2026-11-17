/**
 * Pioneer Memorial, Molly Ann Smith Plaza, Hermann Park, Houston (1936,
 * Frank Teich; Texas Centennial) — procedural, CC0-1.0, no textures.
 * bun generators/hou-pioneer-memorial.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * plaza. Placed at bearing 0: the obelisk is square to the Jones Reflection
 * Pool, which runs due north from it to the Sam Houston Monument. Its bronze
 * plaque faces south, across the plaza (every photo with the plaque shows
 * the pool and Sam Houston behind it). Anchor: OSM node/661054556
 * (man_made=obelisk), on the obelisk in the lidar to within 0.5 m. OSM maps
 * no building: replaces [].
 *
 * Identity: a tall, slender, plain square obelisk of pink granite, tapering
 * to a low pyramidion, on a short die with a chamfered cap, a plain plinth
 * and a broad rock-faced base block.
 *
 * Evidence
 * - Lidar: USGS 3DEP TX_Coastal_B1_2018 (flown 2018), 0.5 m grid. Plaza
 *   0.4 m over the grid's lowest ground (z = 0); the base block ~0.9 m and
 *   the plinth ~1.6 m above the plaza over a ~2.5-3 m footprint; the
 *   shaft's highest return 15.5 m above the plaza (the slender tip is
 *   likely missed between returns, so the apex is taken as 16.0 m).
 * - Published: Wikipedia "Pioneer Memorial (Houston)"; Hermann Park
 *   Conservancy: granite obelisk, Frank Teich, 1936, Texas Centennial. No
 *   published height found; the brief's "about 70 ft" (21 m) is not borne
 *   out by the lidar or the photos.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Hermann Park, Houston, Pioneer Memorial in 2012.JPG", Another
 *     Believer, CC BY-SA 3.0, from the south, the plaque face
 *     https://commons.wikimedia.org/wiki/File:Hermann_Park,_Houston,_Pioneer_Memorial_in_2012.JPG
 *   - "Hermann Park, Houston, Pioneer Memorial.JPG", Another Believer,
 *     CC BY-SA 3.0, from the north (the rock-faced base, the plain faces)
 *     https://commons.wikimedia.org/wiki/File:Hermann_Park,_Houston,_Pioneer_Memorial.JPG
 *   - "Pioneer Memorial Obelisk 1936 at Houston's Hermann Park.jpg" and
 *     "...Memorial Park.jpg", RealtimeAI, CC BY-SA 4.0, from the south-west
 *     and from the south at a distance (proportions scaled from this one)
 *     https://commons.wikimedia.org/wiki/File:Pioneer_Memorial_Obelisk_1936_at_Houston%27s_Hermann_Park.jpg
 *     https://commons.wikimedia.org/wiki/File:Pioneer_Memorial_Obelisk_1936_at_Houston%27s_Memorial_Park.jpg
 *   - "Pioneer Memorial Hermann Park.jpg", Euthman (Ed Uthman), CC BY-SA
 *     2.5, a distant view across the water (silhouette only)
 *     https://commons.wikimedia.org/wiki/File:Pioneer_Memorial_Hermann_Park.jpg
 *
 * Proportions scaled from the distant south photo to the 16 m height and
 * checked against the lidar: base block 2.9 m square, 1.0 m high (lidar
 * 0.9); plinth 1.95 m square to 1.6 m (lidar); die 1.55 m square to 4.1 m;
 * a chamfered cap to 4.35 m; the shaft 1.06 m square at its foot, 0.56 m
 * under the pyramidion at 15.4 m; apex 16.0 m. The plaque (0.65 x 0.9 m)
 * on the die's south face.
 *
 * Follows the photos over the brief: the brief mentions seated figures at
 * the base; no photo, from any side, shows any figure. The obelisk is plain.
 *
 * Colours sampled from four photos (the polished shaft #e0cebc / #dccab5 /
 * #d9c4ac in sun, the rock-faced base #b29b81 / #b19880), pulled to the
 * palette's lightness: pink granite #e6d3c2, the rough base #cfb8a3, the
 * plaque bronze #6b5a45.
 *
 * Doubts: the exact height (no published figure); whether there is a
 * plaque on another face (only the south and north faces were
 * photographed, the north one is blank). Night: no night photo; unlit.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { solid, block, plate } from './nyc-columbus-monument'

const sq = (h: number, z: number): V3[] => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]]

function build() {
  const granite = new Part(), rough = new Part(), bronze = new Part()

  // Rock-faced base block: a soft, heavily bevelled block, its top dressed flat.
  block(rough, -1.45, -1.45, 1.45, 1.45, 0, 1.0, 0.18, 0.12)
  // Plinth and die.
  block(granite, -0.975, -0.975, 0.975, 0.975, 1.0, 1.6, 0.04, 0.04)
  block(granite, -0.775, -0.775, 0.775, 0.775, 1.6, 4.1, 0.03, 0.02)
  // Chamfered cap of the die up to the shaft, the shaft, the pyramidion.
  solid(granite, [sq(0.775, 4.1), sq(0.775, 4.14), sq(0.53, 4.35)])
  granite.loft([sq(0.53, 4.35), sq(0.28, 15.4)])
  for (const [a, b] of [[0, 1], [1, 2], [2, 3], [3, 0]]) {
    const r = sq(0.28, 15.4)
    granite.tri(r[a], r[b], [0, 0, 16.0])
  }

  // The bronze plaque on the die's south face.
  plate(bronze, -0.33, 0.33, 2.65, 3.55, -0.775, -1, 0.04)

  finishModel('Pioneer Memorial', 'hou-pioneer-memorial', [
    { part: granite, material: { name: 'pink-granite', color: 0xe6d3c2, roughness: 0.6 } },
    { part: rough, material: { name: 'rough-granite', color: 0xcfb8a3, roughness: 0.95 } },
    { part: bronze, material: { name: 'bronze', color: 0x6b5a45, roughness: 0.5 } },
  ], { bearing: 0, osm: 'node/661054556', height: 16 }, 5000)
}

if (import.meta.main) build()
