/**
 * Brooklyn War Memorial, Cadman Plaza Park, Brooklyn (Eggers & Higgins,
 * architects; Charles Keck, sculptor; 1951) — procedural, CC0-1.0, no
 * textures.
 * bun generators/nyc-brooklyn-war-memorial.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 2°, the edges of the OSM outline way/250373213 (building=yes,
 * height 11.2; a 30.8 × 16.6 m block with a memorial hall inside), which
 * this model replaces. The inscribed face with the two figures looks south
 * (model −y) down the park's lawn. Anchor: the outline's centroid.
 *
 * y = 0 is the ground on the north side, the lowest under the footprint; the
 * lawn and plaza on the south are 3.0 m higher (lidar), so the south face
 * starts there and the block's lower 3 m shows only on the north.
 *
 * Evidence
 * - Published (NYC Parks; Wikipedia): granite; a long wall-like block with
 *   the dedication to Brooklyn's men and women of the Second World War; two
 *   24 ft (7.3 m) figures in relief by Charles Keck, a man with a sword and
 *   a woman with a child, at the ends of the inscription.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m, in the outline's frame:
 *   the coping 12.5 m above the north ground (13.1 m at the edges, 12.4 m on
 *   the flat roof); the plaza on the south at +3.0 m.
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-brooklyn-war-memorial/photos/credits.txt: Daderot
 *   (CC0, from the lawn, south), Ajay Suresh (CC BY 2.0, the south face square
 *   on), Autopilot (CC BY-SA 3.0, the figure "Victory").
 *
 * Estimated from the square-on photo scaled to the 30.8 m face: the figures
 * 7.3 m tall standing on low ledges 1.6 m in from each end, carved proud of
 * the face (drawn as full bold masses 0.8 m deep, half sunk in the wall);
 * the base course, the coping and the inscription field (a flat panel of
 * darker granite, the lettering left out). The north face is drawn plain.
 */
import { Part, type V3 } from './mesh'
import { finishModel, prism, chamferRect } from './nyc-570-lexington'
import { smooth, tube, ellipsoid } from './nyc-columbus-monument'
import { robed } from './nyc-uss-maine-monument'

const granite = new Part(), figures = new Part(), panel = new Part()

const HX = 15.4, HY = 8.3, TOP = 12.5, SZ = 3.0
prism({ wall: granite, win: null, roof: granite, ring: chamferRect(-HX, -HY, HX, HY, 0), z0: 0, z1: TOP - 0.45, facade: null, bevel: 0.15 })
// The coping, a little proud.
prism({ wall: granite, win: null, roof: granite, ring: chamferRect(-HX - 0.15, -HY - 0.15, HX + 0.15, HY + 0.15, 0), z0: TOP - 0.45, z1: TOP, facade: null, bevel: 0.1 })
// The base course on the south, at the plaza.
prism({ wall: granite, win: null, roof: granite, ring: chamferRect(-HX - 0.3, -HY - 0.4, HX + 0.3, -HY + 0.5, 0), z0: SZ - 0.5, z1: SZ + 0.55, facade: null, bevel: 0.1 })

// The inscription field between the figures: a flat panel of darker granite.
{
  const y = -HY - 0.03
  panel.quad([-8.5, y, 6.3], [8.5, y, 6.3], [8.5, y, 10.6], [-8.5, y, 10.6])
}

// The two figures, standing on ledges near the ends, carved proud of the face.
smooth(figures, q => {
  const yF = -HY - 0.15, z0 = SZ + 0.55
  for (const s of [-1, 1]) {
    // A low ledge under each.
    const cx = s * (HX - 1.75)
    prism({ wall: q, win: null, roof: q, ring: chamferRect(cx - 1.3, -HY - 0.9, cx + 1.3, -HY, 0), z0: SZ - 0.1, z1: z0, facade: null, bevel: 0.08 })
    const H = 6.8
    robed(q, [cx, yF, z0], H, s < 0
      // The man (west): arms folded over the sword's hilt at his chest.
      ? [[[cx - 0.75, yF, z0 + 5.6], [cx - 0.55, yF - 0.45, z0 + 4.8], [cx + 0.05, yF - 0.55, z0 + 4.7]],
         [[cx + 0.75, yF, z0 + 5.6], [cx + 0.6, yF - 0.45, z0 + 4.8], [cx + 0.05, yF - 0.55, z0 + 4.85]]]
      // The woman (east): her arm round the child at her side.
      : [[[cx - 0.75, yF, z0 + 5.6], [cx - 0.5, yF - 0.45, z0 + 4.7], [cx + 0.3, yF - 0.5, z0 + 4.5]],
         [[cx + 0.75, yF, z0 + 5.6], [cx + 1.0, yF - 0.3, z0 + 4.6], [cx + 1.05, yF - 0.35, z0 + 3.6]]])
    // The broad fall of the robes, shoulder to hem: the figures are wide,
    // block-like masses in the photos.
    ellipsoid(q, [cx, yF + 0.05, z0 + 3.0], [1.05, 0.5, 3.1], 10, 5)
    ellipsoid(q, [cx, yF + 0.05, z0 + 5.45], [0.95, 0.45, 0.55], 10, 4)
    if (s < 0) tube(q, [[cx + 0.05, yF - 0.6, z0 + 4.7], [cx + 0.1, yF - 0.7, z0 + 1.0]], [0.16, 0.1], 5)
    else {
      // The child at her left side.
      robed(q, [cx + 1.2, yF + 0.05, z0], 3.0, [])
      ellipsoid(q, [cx + 1.2, yF - 0.05, z0 + 1.2], [0.35, 0.3, 1.0], 8, 4)
    }
  }
}, 55)

finishModel('Brooklyn War Memorial', 'nyc-brooklyn-war-memorial', [
  { part: granite, material: { name: 'granite', color: 0xdedbd3, roughness: 0.85 } },
  { part: figures, material: { name: 'granite-figures', color: 0xe8e5de, roughness: 0.8 } },
  { part: panel, material: { name: 'granite-panel', color: 0xc6c1b7, roughness: 0.85 } },
], { bearing: 2, osm: 'way/250373213', height: TOP }, 5000)
