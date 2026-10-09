/**
 * Cleopatra's Needle, Central Park (Greywacke Knoll) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-cleopatras-needle.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 16.7°, the edges of the OSM square way/179685272 (man_made=obelisk,
 * not a building, so `replaces` is empty). Anchor: that square's centroid.
 *
 * Evidence
 * - Published (H. H. Gorringe, Egyptian Obelisks, 1882, the engineer who
 *   moved it): height 69 ft 2 in (21.08 m) base to tip; shaft 61 ft 7 in
 *   (18.77 m); pyramidion 7 ft 7 in (2.31 m); base 7 ft 8½ in (2.35 m)
 *   square, top of the shaft 5 ft 3 in (1.60 m). Red Aswan granite, Thutmose
 *   III, c. 1475 BC; erected here 22 Feb 1881 on a 50-ton granite pedestal
 *   (Wikipedia; obelisks.org gives 21.21 m).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m: tip 23.8 m above the
 *   plaza round the base (ground 32.6 m NAVD88 on the north and west, rising
 *   ~0.5 m to the south-east); the obelisk stands ~0.7 m south of the OSM
 *   square's centroid (not shifted: inside OSM's accuracy).
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-cleopatras-needle/photos/credits.txt: Mike Peel
 *   (CC BY-SA 4.0, from the south-east with the pedestal and steps),
 *   Rhododendrites (CC BY-SA 4.0, winter, two faces lit), Joseph Zarro
 *   (CC BY-SA 4.0, close up of the shaft and pyramidion).
 *
 * Estimated from the photos against the 2.35 m shaft base: the pedestal
 * (3.1 m square, 1.85 m tall), the two pale stone steps under it (0.42 m
 * each), and the broken, rounded lower corners of the shaft (the reason the
 * bronze crabs were made); the crabs themselves (a 0.4 m gap) are left out,
 * the shaft resting on the pedestal, so the pedestal is drawn 0.35 m taller
 * to keep the lidar's tip height. Colours from the daylight photos: a warm
 * pinkish-tan weathered granite, the pyramidion paler and greyer, the
 * pedestal a pinker granite, pale grey steps.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, chamferRect, type XY } from './nyc-570-lexington'

const shaft = new Part(), pyr = new Part(), ped = new Part(), steps = new Part()

// The obelisk's axis, on the anchor.
const CX = 0, CY = 0

// --- Steps and pedestal ---
const S1 = 0.42, S2 = 0.84, PT = S2 + 1.85 + 0.35 // 3.04
prism({ wall: steps, win: null, roof: steps, ring: chamferRect(CX - 3.0, CY - 3.0, CX + 3.0, CY + 3.0, 0), z0: 0, z1: S1, facade: null, bevel: 0.12 })
prism({ wall: steps, win: null, roof: steps, ring: chamferRect(CX - 2.35, CY - 2.35, CX + 2.35, CY + 2.35, 0), z0: S1, z1: S2, facade: null, bevel: 0.12 })
prism({ wall: ped, win: null, roof: ped, ring: chamferRect(CX - 1.55, CY - 1.55, CX + 1.55, CY + 1.55, 0), z0: S2, z1: PT, facade: null, bevel: 0.1 })

// --- The shaft: a tapering square, 2.35 m → 1.60 m over 18.77 m, its lower
// corners broken and rounded (a wide chamfer that closes up over the first
// 1.6 m), the arrises otherwise crisp with a small bevel. ---
const SH = 18.77, B0 = 2.35 / 2, B1 = 1.6 / 2, TIP = 2.31
const half = (z: number) => B0 + (B1 - B0) * (z / SH)
const levels: [number, number][] = [[0, 0.42], [0.5, 0.3], [1.0, 0.16], [1.6, 0.07], [SH - 0.4, 0.05], [SH, 0.002]]
const rings: V3[][] = levels.map(([z, c]) => chamferRect(CX - half(z), CY - half(z), CX + half(z), CY + half(z), c).map(([x, y]) => [x, y, PT + z] as V3))
shaft.loft(rings)

// --- Pyramidion: a true square pyramid on the shaft top, 2.31 m tall. ---
{
  const z0 = PT + SH, h = B1
  const q: V3[] = [[CX - h, CY - h, z0], [CX + h, CY - h, z0], [CX + h, CY + h, z0], [CX - h, CY + h, z0]]
  // Close the small chamfers at the shaft top with a flat band under the pyramid.
  const top = rings[rings.length - 1]
  for (let i = 0; i < top.length; i++) {
    const a = top[i], b = top[(i + 1) % top.length]
    // each shaft-top point to the nearest pyramid base corner (fan)
    const near = (p: V3) => q.reduce((m, c) => (Math.hypot(c[0] - p[0], c[1] - p[1]) < Math.hypot(m[0] - p[0], m[1] - p[1]) ? c : m))
    const na = near(a), nb = near(b)
    if (na === nb) shaft.tri(a, b, na)
    else { shaft.tri(a, b, nb); shaft.tri(a, nb, na) }
  }
  for (let i = 0; i < 4; i++) pyr.tri(q[i], q[(i + 1) % 4], [CX, CY, z0 + TIP])
}

finishModel("Cleopatra's Needle", 'nyc-cleopatras-needle', [
  { part: shaft, material: finish('needle-granite', 0xd6c1ae) },
  { part: pyr, material: finish('needle-pyramidion', 0xe2d2c2) },
  { part: ped, material: finish('needle-pedestal', 0xcdb2a4) },
  { part: steps, material: PALETTE.stone },
], { bearing: 16.7, osm: 'way/179685272', height: PT + SH + TIP }, 5000)
