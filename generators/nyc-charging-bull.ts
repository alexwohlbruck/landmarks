/**
 * Charging Bull, Bowling Green, Lower Manhattan (Arturo Di Modica, 1989) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-charging-bull.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. The bull is
 * built charging toward model +y and placed at bearing 30°, the axis of
 * Broadway and of the paved island it stands on (OSM footway
 * way/420788300, 31°), head up Broadway to the north-north-east as every
 * photo from 26 Broadway's side and from Bowling Green shows. Anchor: OSM
 * node/373069793 (tourism=artwork; no building, so `replaces` is empty).
 * It stands directly on the paving: no plinth, y = 0 is the street.
 *
 * Evidence
 * - Published (Wikipedia; the artist's site): bronze, 7,100 lb, 11 ft
 *   (3.4 m) tall and 16 ft (4.9 m) long; head lowered, tail lashing up.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m: a ~5 × 2 m mass up to
 *   ~2.9 m over the paving (mixed with the crowd round it, so only a
 *   check). Drawn to the published size: 4.9 m from the hind hoofs to the
 *   muzzle, the tail's S peaking at 3.3 m and the rump at ~2.6 m.
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-charging-bull/photos/credits.txt: the side from
 *   across Broadway (Tdorante10, CC BY-SA 4.0), the head-on view (Andy
 *   Rusch, CC BY 2.0), from behind (Mario Antonio Pena Zapateria,
 *   CC BY-SA 2.0), the head and horns (Art Palmer, CC BY-SA 3.0), and the
 *   rear from 26 Broadway (Tdorante10, cropped, CC BY-SA 4.0).
 *
 * Estimated from the photos: everything of the pose — the body as lofted
 * sections (low and deep in front, the belly tucking up to a raised rump
 * on massive haunches, the head carried low and thrust forward), short
 * thick legs (the forelegs splayed forward, the hinds braced back), the
 * horns sweeping out and forward, the tail whipping up over the back in an S. The bronze is drawn dark, a charcoal brown, the
 * horns and muzzle polished golden (rubbed bright by visitors).
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { smooth, solid, tube, ellipsoid } from './nyc-columbus-monument'
import { ell } from './nyc-uss-maine-monument'

const bronze = new Part(), bright = new Part()

/** An elliptical ring in the plane y = const: half-width w, half-height h, centred (x, y, z). */
const ring = (x: number, y: number, z: number, w: number, h: number, n = 12): V3[] =>
  Array.from({ length: n }, (_, i): V3 => {
    const t = (i * 2 * Math.PI) / n
    return [x + w * Math.cos(t), y, z + h * Math.sin(t)]
  })

smooth(bronze, q => {
  // Body, rump → shoulders → neck, sections along +y: [y, zc, half-width,
  // half-height]. Low and deep in front (the shoulders and dewlap nearly to
  // the ground), the belly tucking up toward the raised rump. Rings are
  // reversed to run clockwise seen from the rear, so with the loft running
  // toward +y the faces wind outward.
  const secs: [number, number, number, number][] = [
    [-2.15, 2.05, 0.24, 0.32],
    [-1.95, 1.95, 0.5, 0.6],
    [-1.35, 1.85, 0.56, 0.66],
    [-0.55, 1.66, 0.63, 0.8],
    [0.3, 1.5, 0.74, 0.96],
    [0.9, 1.36, 0.68, 0.86],
    [1.4, 1.06, 0.52, 0.62],
    [1.75, 0.82, 0.4, 0.44],
  ]
  const rings = secs.map(([y, z, w, h]) => ring(0, y, z, w, h).reverse())
  q.loft(rings)
  q.cap(rings[0].slice().reverse(), true)
  q.cap(rings[rings.length - 1], true)
  // The head, carried low and thrust forward, the forehead broad.
  ellipsoid(q, [0, 2.08, 0.66], [0.55, 0.4, 0.36], 10, 5, Math.PI / 2, -0.5)
  ellipsoid(q, [0, 1.85, 0.95], [0.44, 0.3, 0.3], 8, 4)
  // Legs: short and thick; the forelegs splayed forward, the hinds braced back.
  const leg = (pts: V3[]) => tube(q, pts, [0.34, 0.23, 0.17].slice(0, pts.length), 8)
  leg([[0.42, 0.55, 0.85], [0.46, 0.95, 0.4], [0.48, 1.3, 0.06]])
  leg([[-0.42, 0.45, 0.85], [-0.46, 0.7, 0.4], [-0.48, 0.95, 0.06]])
  // Massive haunches carry the hind legs, which brace back short and thick.
  for (const sx of [-1, 1]) ellipsoid(q, [sx * 0.32, -1.7, 1.55], [0.3, 0.55, 0.7], 10, 5)
  for (const sx of [-1, 1]) tube(q, [[sx * 0.38, -1.85, 1.0], [sx * 0.42, -2.15, 0.5], [sx * 0.42, -2.4, 0.06]], [0.3, 0.2, 0.16], 8)
  for (const [x, y] of [[0.48, 1.33], [-0.48, 0.98], [0.42, -2.43], [-0.42, -2.43]]) ellipsoid(q, [x, y, 0.07], [0.17, 0.2, 0.08], 7, 3)
  // The tail whipping up from the rump in an S over the back.
  tube(q, [[0, -2.12, 2.25], [0, -2.42, 2.55], [0.04, -2.4, 2.95], [0.1, -2.05, 3.28], [0.16, -1.65, 3.2], [0.2, -1.42, 2.95]], [0.12, 0.1, 0.09, 0.08, 0.07, 0.06], 7)
  ellipsoid(q, [0.21, -1.38, 2.86], [0.11, 0.12, 0.17], 6, 3)
}, 65)
smooth(bright, q => {
  // Horns: out from the poll, sweeping forward and up, rubbed golden.
  for (const sx of [-1, 1]) tube(q, [[sx * 0.32, 1.85, 1.05], [sx * 0.72, 2.0, 1.15], [sx * 0.92, 2.38, 1.3], [sx * 0.78, 2.75, 1.55]], [0.13, 0.1, 0.07, 0.025], 7)
  // The muzzle, polished by visitors.
  ellipsoid(q, [0, 2.44, 0.42], [0.28, 0.18, 0.22], 8, 4)
}, 65)

finishModel('Charging Bull', 'nyc-charging-bull', [
  { part: bronze, material: { name: 'bronze', color: 0x55493e, roughness: 0.5 } },
  { part: bright, material: { name: 'bronze-polished', color: 0xc9a467, roughness: 0.4 } },
], { bearing: 30, osm: 'node/373069793', height: 3.4 }, 5000)
