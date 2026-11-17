/**
 * Atlas, International Building forecourt, Rockefeller Center, Fifth
 * Avenue, Manhattan (Lee Lawrie and Rene Chambellan, 1937) — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-atlas.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 29°, the Manhattan grid: Atlas faces model +x, across Fifth
 * Avenue to St Patrick's. Anchor: the pedestal's centre as the lidar shows
 * it, 1.2 m south-west of OSM node/5654226941 (Atlas, tourism=artwork). It
 * stands in the open forecourt, outside every outline of the International
 * Building (way/109284807 and its parts), so `replaces` is empty. y = 0 is
 * the forecourt paving, level with Fifth Avenue's sidewalk.
 *
 * Evidence
 * - Published (Wikipedia, "Atlas (statue)"): bronze, 45 ft (14 m) overall,
 *   the figure 15 ft (4.6 m), 14,000 lb; he stands on one leg on a small
 *   stone pedestal whose corner faces Fifth Avenue; the armillary sphere's
 *   axis points at the North Star from New York.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m: the stepped base, a
 *   ~3.3 by 3.5 m block ~1.9 m high, with returns on the pedestal and feet
 *   to ~3.7 m; the open sphere returns almost nothing.
 * - Photos (Wikimedia Commons):
 *   - "Atlas - Rockefeller Center (51394733772).jpg", Ajay Suresh,
 *     CC BY 2.0 (head-on from across Fifth Avenue: the base, the pedestal,
 *     the figure and the rings; heights scaled off it against the 14 m);
 *   - "NYC - Rockfeller Center - Atlas Statue.JPG", Jean-Christophe
 *     Benoist, CC BY 3.0 (from below: the broad zodiac band in his hands,
 *     the rings, the lunge);
 *   - "Over Atlas (39952692).jpeg", Sam Mellors, CC BY 3.0 (the arms and
 *     band from behind);
 *   - "Rockerfeller Center - Looking Across Fifth Ave.jpg", Eric Kilby,
 *     CC BY-SA 2.0 (night: the statue lit).
 *
 * Estimated: the base (1.9 m) and the pedestal (1.5 m square turned 45°,
 * to 3.9 m), the pose (left leg planted, right knee bent with the foot
 * back, head bowed, arms out and up to the band at 8.1 m), the sphere
 * 6.6 m across centred at 10.6 m (top 13.9 m): the zodiac band face-on to
 * Fifth Avenue in his hands, the meridian, the equator and a colure about
 * the polar axis, which points to true north at 40.7° up. Rings are drawn
 * thicker than the real ones so they read; the zodiac figures, the
 * finials and the planting on the base are left out.
 */
import { Part, cross, type V3 } from './mesh'
import { finishModel, prism, chamferRect } from './nyc-570-lexington'
import { TAU, smooth, solid, tube, ellipsoid, block, face, add, mul, unit } from './nyc-columbus-monument'
import { ell } from './nyc-uss-maine-monument'

const bronze = new Part(), granite = new Part(), plinth = new Part()

// --- Base and pedestal. ---
block(plinth, -1.65, -1.75, 1.65, 1.75, 0, 1.9, 0.15, 0.1)
{
  // The pedestal, a square turned 45° to the grid so a corner faces Fifth Avenue.
  const r = 0.75 * Math.SQRT2
  const ring = [0, 1, 2, 3].map(k => [r * Math.cos(k * Math.PI / 2), r * Math.sin(k * Math.PI / 2)] as [number, number])
  prism({ wall: granite, win: null, roof: granite, ring, z0: 1.9, z1: 3.9, facade: null, bevel: 0.06 })
}

// --- Atlas, facing +x: lunging, the load across his shoulders. ---
smooth(bronze, q => {
  const zf = 3.9
  // Planted left leg (+y) and the right leg bent, its foot back.
  tube(q, [[0.15, 0.28, zf], [0.1, 0.28, zf + 0.85], [0.0, 0.26, zf + 1.7]], [0.16, 0.2, 0.26], 8)
  tube(q, [[-0.6, -0.3, zf + 0.05], [-0.1, -0.32, zf + 0.35], [0.3, -0.3, zf + 0.85], [0.0, -0.26, zf + 1.7]], [0.12, 0.16, 0.2, 0.26], 8)
  for (const [x, y] of [[0.3, 0.28], [-0.62, -0.3]]) ellipsoid(q, [x, y, zf + 0.06], [0.25, 0.11, 0.07], 6, 3)
  // Hips, the drape, the broad torso leaning a little forward, the neck.
  solid(q, [ell(0, 0, zf + 1.55, 0.32, 0.5, 10), ell(0.02, 0, zf + 1.95, 0.3, 0.46, 10), ell(0.06, 0, zf + 2.6, 0.36, 0.62, 10),
    ell(0.08, 0, zf + 3.15, 0.38, 0.72, 10), ell(0.08, 0, zf + 3.35, 0.2, 0.3, 10)])
  ellipsoid(q, [0.2, 0, zf + 3.6], [0.24, 0.2, 0.27], 8, 4)
  // Arms out to the sides and up, hands on the band.
  for (const s of [-1, 1]) {
    tube(q, [[0.05, s * 0.62, zf + 3.15], [0.05, s * 1.4, zf + 3.55], [0.05, s * 2.15, zf + 4.15]], [0.2, 0.16, 0.12], 7)
    ellipsoid(q, [0.05, s * 2.2, zf + 4.25], [0.12, 0.12, 0.16], 6, 3)
  }
}, 60)

// --- The armillary sphere. ---
const C: V3 = [0, 0, 10.6]
/** A hoop about C: normal n, radius R, `w` wide along n, `t` thick radially. */
function hoop(n: V3, R: number, w: number, t: number, segs = 36) {
  const nn = unit(n)
  const u = unit(cross(Math.abs(nn[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1], nn)), v = cross(nn, u)
  const pt = (a: number, r: number, h: number): V3 => add(C, add(add(mul(u, r * Math.cos(a)), mul(v, r * Math.sin(a))), mul(nn, h)))
  for (let i = 0; i < segs; i++) {
    const a0 = i * TAU / segs, a1 = (i + 1) * TAU / segs
    const inside = pt((a0 + a1) / 2, R - t / 2, 0)
    for (const [r0, h0, r1, h1] of [[R, -w / 2, R, w / 2], [R - t, -w / 2, R - t, w / 2], [R - t, w / 2, R, w / 2], [R - t, -w / 2, R, -w / 2]])
      face(bronze, pt(a0, r0, h0), pt(a1, r0, h0), pt(a1, r1, h1), pt(a0, r1, h1), inside)
  }
}
// The polar axis, in the model frame: true north is 29° anticlockwise of
// model +y; up at New York's latitude.
const lat = 40.7 * Math.PI / 180, b = -29 * Math.PI / 180
const axis: V3 = [Math.sin(b) * Math.cos(lat), Math.cos(b) * Math.cos(lat), Math.sin(lat)]
const meridianN = unit(cross(axis, [0, 0, 1]))
hoop([1, 0, 0], 3.3, 0.48, 0.12)          // the zodiac band, in his hands
hoop(meridianN, 3.18, 0.2, 0.14)          // the meridian, through the poles
hoop(axis, 3.1, 0.2, 0.14)                // the equator
hoop(cross(axis, meridianN), 3.02, 0.16, 0.12) // a colure
tube(bronze, [add(C, mul(axis, -3.5)), add(C, mul(axis, 3.7))], [0.09, 0.09], 6)

const lit = (k: number) => (p: V3, n: V3) => (n[2] > 0.85 ? k * 0.6 : k)
finishModel('Atlas', 'nyc-atlas', [
  { part: bronze, material: { name: 'bronze', color: 0x5b5249, roughness: 0.5, floodlight: lit(0.7) } },
  { part: granite, material: { name: 'granite', color: 0xc9c0b2, roughness: 0.8, floodlight: lit(0.5) } },
  { part: plinth, material: { name: 'granite-base', color: 0xb9b2a6, roughness: 0.85 } },
], { bearing: 29, osm: 'node/5654226941', height: 13.9 }, 5000)
