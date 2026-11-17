/**
 * The Sphere (Große Kugelkaryatide), Liberty Park, Lower Manhattan (Fritz
 * Koenig, 1971) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-the-sphere.ts
 *
 * Map frame: x = model east, y = model north, z up, metres; bearing 0. The
 * torn cleft across the sphere, where its dark inner segments show, faces
 * model −y (south, toward the park's lawn; the night photo from the south
 * sees it head-on). Anchor: OSM node/561042174 (The Sphere,
 * historic=memorial, tourism=artwork, height 7.64); no building is mapped
 * under it, so `replaces` is empty. y = 0 is the park's deck.
 *
 * Elevation: +7.0. Liberty Park is a deck over the WTC Vehicle Security
 * Center; OSM maps it only as leisure=park (way/22926662), with no building
 * under the sculpture, and the map's terrain (Mapterhorn) shows the street
 * grade there, not the deck. The lidar (USGS 3DEP NY_NewYorkCity, 2017, the
 * deck's first returns) puts the deck at 9.97 m NAVD88, 6.2 m above Liberty
 * Street beside it; the terrain under the footprint reads ~7 m lower than
 * the deck. The sculpture itself was installed in August 2017, after the
 * flight, so the lidar shows only the empty deck.
 *
 * Evidence
 * - Published (Wikipedia, "The Sphere"; OSM height): bronze, 25 ft (7.6 m)
 *   tall; made of 52 bronze segments; damaged on 9/11, moved to Battery
 *   Park in 2002 and to Liberty Park in 2017.
 * - Photos (Wikimedia Commons):
 *   - "The Sphere, New York.jpg", Mike Peel, CC BY-SA 4.0 (in Battery
 *     Park: the cleft side, the lower dome on the splayed base);
 *   - "Closer shot of The Sphere jeh.jpg", Jim.henderson, CC0 (in Liberty
 *     Park, the other side: the stem and the torn base plate on pebbles);
 *   - "TheSphere-2017-11-09.jpg", MLOlschowy, CC BY-SA 4.0 (night, from the
 *     south, the cleft facing);
 *   - "The Sphere from North in Liberty Park unveiled jeh.jpg",
 *     Jim.henderson, CC0.
 *
 * Estimated from the photos against the 7.6 m: the main sphere 4.9 m
 * across, centred 5.1 m up; the dark stem; the lower dome (1.8 m across,
 * 2.3 m high) in front of it; the dented, splayed base plate ~5 m across;
 * the cleft drawn as bold dark wedge segments with a bronze lobe at the
 * west, and a narrower split round the north-east; the dents, tears and
 * holes are left out. Bronze: the worn gold-brown of the outer shell, the
 * segments' dark patina inside.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { TAU, smooth, solid, ellipsoid, slab, unit } from './nyc-columbus-monument'

const bronze = new Part(), dark = new Part()

// --- The torn base plate, splayed out over the bed, its edge uneven. ---
smooth(bronze, q => {
  const n = 12, rr = [2.5, 2.2, 2.6, 2.1, 2.4, 2.7, 2.3, 2.0, 2.5, 2.2, 2.6, 2.3]
  const ring = (s: number, z: number, d = 0): V3[] => Array.from({ length: n }, (_, i) => [s * rr[i] * Math.cos(i * TAU / n) + d, s * rr[i] * Math.sin(i * TAU / n), z])
  solid(q, [ring(1, 0), ring(1, 0.18), ring(0.7, 0.35), ring(0.42, 0.75)])
}, 35)
// --- The dark stem, tapering up and leaning, the sphere's support. ---
smooth(dark, q => {
  const oct = (r: number, z: number, dx: number, dy: number): V3[] => Array.from({ length: 7 }, (_, i) => [dx + r * Math.cos(0.4 + i * TAU / 7), dy + r * Math.sin(0.4 + i * TAU / 7), z])
  solid(q, [oct(1.0, 0.5, 0, 0.2), oct(0.75, 1.8, 0.05, 0.15), oct(0.62, 2.9, 0.1, 0.05), oct(0.95, 3.4, 0.1, 0)])
}, 30)
// --- The lower dome, in front of the stem. ---
smooth(bronze, q => ellipsoid(q, [-0.2, -0.75, 1.15], [0.9, 0.85, 1.15], 12, 6), 60)

// --- The great sphere. ---
const C: V3 = [0, 0, 5.1], R = 2.45
smooth(bronze, q => ellipsoid(q, C, [R, R, R * 0.97], 20, 10), 60)
// The cleft: dark inner segments forced out through the southern face, in
// a broad band dipping to the east, under an overhanging bronze cap.
smooth(dark, q => {
  const S = (yaw: number, z: number): V3 => [C[0] + (R - 0.25) * Math.sin(yaw), C[1] - (R - 0.25) * Math.cos(yaw), z]
  // Each segment: a thick wedge plate following the sphere's face.
  const seg = (yaw: number, z: number, w: number, h: number, d: number) => {
    const o = S(yaw, z), U = unit([Math.cos(yaw), Math.sin(yaw), 0]), Vv: V3 = [0, 0, 1]
    slab(q, o, U, Vv, [[-w / 2, -h / 2], [w / 2, -h / 2 + 0.15], [w / 2, h / 2], [-w / 2 + 0.2, h / 2]], d)
  }
  seg(-0.9, 5.6, 1.4, 1.3, 0.75)
  seg(-0.4, 5.25, 1.3, 1.2, 0.8)
  seg(0.1, 4.95, 1.4, 1.1, 0.8)
  seg(0.55, 4.6, 1.3, 1.0, 0.7)
  seg(-0.2, 4.15, 1.6, 0.6, 0.65)
  // The dark drum pushed out low on the south-east (the "nose").
  ellipsoid(q, [0.9, -2.15, 4.1], [0.55, 0.6, 0.55], 8, 4)
  // A second, narrower split round the north-east, with its own dark drum
  // (the side seen from the park's north path).
  seg(1.85, 4.55, 1.3, 0.75, 0.6)
  seg(2.35, 4.4, 1.3, 0.7, 0.6)
  seg(2.85, 4.5, 1.2, 0.6, 0.55)
  ellipsoid(q, [2.0, 1.15, 3.85], [0.5, 0.5, 0.55], 8, 4)
}, 35)
// A bronze lobe split off the west side of the cleft, and the curled
// bronze lip over it.
smooth(bronze, q => {
  ellipsoid(q, [-1.95, -1.25, 4.9], [0.55, 0.85, 0.95], 10, 5, 0.6)
  ellipsoid(q, [0.2, -2.3, 5.95], [1.35, 0.35, 0.22], 10, 4, 0.12, -0.15)
}, 60)

const lit = (p: V3, n: V3) => (n[2] > 0.85 ? 0.3 : 0.55)
finishModel('The Sphere', 'nyc-the-sphere', [
  { part: bronze, material: { name: 'bronze', color: 0xa88a5a, roughness: 0.45, floodlight: lit } },
  { part: dark, material: { name: 'bronze-dark', color: 0x55504a, roughness: 0.6 } },
], { bearing: 0, osm: 'node/561042174', height: 7.55 }, 5000)
