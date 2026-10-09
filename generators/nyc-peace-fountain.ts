/**
 * The Peace Fountain, Pulpit Green, Cathedral of St. John the Divine,
 * Manhattan (Greg Wyatt, 1985) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-peace-fountain.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Bearing 0, the
 * parts placed where the lidar and photos put them: the sun face on the
 * west of the platform, looking west toward Amsterdam Avenue; the Archangel
 * Michael on its south-east side facing south, his two wings raised in a V
 * along the east–west line. Anchor: the centroid of OSM way/608955193 (the
 * fountain's kerb, tourism=artwork, barrier=kerb, r 3.4 m, not a building), which matches the
 * platform's centre in the lidar within 0.3 m; `replaces` is empty. y = 0 is
 * the lawn; the dry pool (now a garden) is the map's ground.
 *
 * Evidence
 * - Published (Wikipedia; the cathedral): bronze, 40 ft (12 m); a double
 *   helix rising from a basin to a crab-ringed platform carrying the sun and
 *   moon face; Michael triumphant over Satan, whose head hangs below; nine
 *   giraffes round the sun.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m, sparse: the platform's
 *   rim ~3.8 m over a ~5.5 m disc; two high clusters 4.5 m apart on an
 *   east–west line south of the centre, 11.0 m (west) and 9.8 m (east)
 *   above the lawn — the wing tips.
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-peace-fountain/photos/credits.txt: Pablo Costa
 *   Tirado (CC BY-SA 3.0, the whole fountain, the sun face square on),
 *   Rangilo Gujarati (CC BY-SA 3.0, Michael and the wing from the west, the
 *   crossing dome behind; the sun close), Jay Dobkin (CC BY-SA 4.0, Michael
 *   facing south with both wings spread, from below), Corsario CL (CC BY-SA
 *   4.0, the wing against the west front).
 *
 * Estimated from the photos against the lidar heights: the helix (two
 * ribbons wound one and a half turns round a waisted core, 0.4–3.4 m), the
 * platform (r 2.8 m, its rim of crab shell and sixteen spikes), the sun disc
 * (3.0 m across, centre 5.45 m), Michael (4.0 m, feet 4.0 m, the sword held
 * down across him), the wings (4.5 m long, broad fans 2 m deep, their feathers trailing back
 * and down), and
 * one giraffe leaping over the sun for the nine; the granite basin wall on
 * the kerb's line (0.55 m high, 0.35 m thick); each wing as a broad
 * leading-edge fan with four pointed primary feathers. Satan's head, the crab's
 * claws, the lions and the small animals are left out.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { TAU, smooth, lathe, ellipsoid, tube, slab, unit, add, mul } from './nyc-columbus-monument'
import { robed } from './nyc-uss-maine-monument'
import { sub } from './mesh'

const bronze = new Part(), face = new Part(), granite = new Part()

smooth(bronze, q => {
  // A low basin round the foot.
  lathe(q, [[1.7, 0], [1.75, 0.3], [1.5, 0.42]], 16, 0, 0, true)
  // The waisted core of the helix and its flare under the platform.
  lathe(q, [[1.15, 0.4], [0.85, 1.1], [0.62, 2.2], [0.7, 2.9], [1.3, 3.3], [2.2, 3.45]], 16, 0, 0, false)
  // Two ribbons wound round it, one and a half turns, half a turn apart.
  for (const ph of [0, Math.PI]) {
    const pts: V3[] = []
    for (let i = 0; i <= 14; i++) {
      const t = i / 14, z = 0.45 + 2.85 * t, a = ph + t * 1.5 * TAU
      const r = 1.2 - 0.55 * Math.sin(Math.PI * Math.min(1, t * 1.1)) + 0.1
      pts.push([r * Math.cos(a), r * Math.sin(a), z])
    }
    tube(q, pts, pts.map(() => 0.22), 6)
  }
  // The platform: a broad shallow dish, its rim swelling into the crab shell.
  lathe(q, [[2.2, 3.45], [2.75, 3.6], [2.85, 3.8], [2.6, 3.98], [2.0, 4.02]], 24, 0, 0, true)
}, 45)
// The round granite basin wall (the OSM kerb, r 3.4 m), 0.55 m high.
{
  const n = 32, R0 = 3.4, R1 = 3.05, H = 0.55
  const P = (r: number, i: number, z: number): V3 => [r * Math.cos(i * TAU / n), r * Math.sin(i * TAU / n), z]
  for (let i = 0; i < n; i++) {
    granite.quad(P(R0, i, 0), P(R0, i + 1, 0), P(R0, i + 1, H), P(R0, i, H))
    granite.quad(P(R1, i + 1, 0), P(R1, i, 0), P(R1, i, H), P(R1, i + 1, H))
    granite.quad(P(R1, i, H), P(R0, i, H), P(R0, i + 1, H), P(R1, i + 1, H))
  }
}
// Sixteen spikes round the rim.
for (let k = 0; k < 16; k++) {
  const a = (k + 0.5) * TAU / 16, c = Math.cos(a), s = Math.sin(a)
  smooth(bronze, q => lathe(q, [[0.16, 3.85], [0.1, 4.15], [0.01, 4.45]], 5, 2.55 * c, 2.55 * s, true), 60)
}

// The sun and moon face: a thick upright disc on the west, looking west.
{
  const C: V3 = [-0.5, 0.4, 5.45], R = 1.5, n = 18
  const U: V3 = [0, 1, 0], W: V3 = [0, 0, 1]
  smooth(face, q => {
    slab(q, C, U, W, Array.from({ length: n }, (_, i): [number, number] => [R * Math.cos(i * TAU / n), R * Math.sin(i * TAU / n)]), 0.7)
    // The face's relief: brow, nose and cheeks as low bosses on the west side.
    ellipsoid(q, [C[0] - 0.4, C[1], C[2] + 0.1], [0.18, 0.18, 0.35], 6, 3)
    ellipsoid(q, [C[0] - 0.38, C[1] - 0.45, C[2] - 0.15], [0.12, 0.28, 0.24], 6, 3)
    ellipsoid(q, [C[0] - 0.38, C[1] + 0.45, C[2] - 0.15], [0.12, 0.28, 0.24], 6, 3)
  }, 50)
  // The mass of drapery and beasts under and behind it, down to the platform.
  smooth(face, q => ellipsoid(q, [-0.2, 0.3, 4.1], [1.3, 1.5, 0.55], 10, 4), 60)
}

// The Archangel Michael, south-east of the sun, facing south, sword held down.
const M: V3 = [1.0, -1.35, 4.0], MH = 4.0
smooth(bronze, q => {
  // A rock of drapery and Satan's body under his feet.
  ellipsoid(q, [M[0] - 0.1, M[1] + 0.2, M[2] + 0.1], [0.9, 0.8, 0.45], 10, 4)
  robed(q, [M[0], M[1], M[2] + 0.2], MH, [
    // Both hands on the sword's hilt at his chest.
    [[M[0] - 0.4, M[1], M[2] + 3.0], [M[0] - 0.3, M[1] - 0.35, M[2] + 2.55], [M[0] - 0.05, M[1] - 0.45, M[2] + 2.45]],
    [[M[0] + 0.4, M[1], M[2] + 3.0], [M[0] + 0.3, M[1] - 0.35, M[2] + 2.55], [M[0] + 0.05, M[1] - 0.45, M[2] + 2.45]],
  ])
  // The sword, point down past his knees.
  tube(q, [[M[0], M[1] - 0.48, M[2] + 2.5], [M[0] + 0.1, M[1] - 0.6, M[2] + 0.5]], [0.07, 0.04], 4)
}, 60)
// His wings, raised in a V from the shoulders to the lidar's two tips.
{
  const sh: V3 = [M[0], M[1] + 0.25, M[2] + 3.1]
  for (const tip of [[-1.0, -1.0, 11.0], [3.3, -2.1, 9.8]] as V3[]) {
    const L = Math.hypot(...sub(tip, sh)), U = unit(sub(tip, sh))
    // The chord runs across the wing, the trailing feathers hanging on its outer, lower side.
    // Broad fans, the feathers trailing back (north) and down, so the wings
    // show their full spread from the west and from the south alike.
    const back: V3 = [0, 0.7, -0.7]
    const V = unit(sub(back, mul(U, U[0] * back[0] + U[1] * back[1] + U[2] * back[2])))
    // The wing as a broad convex fan along the leading edge, then four long
    // primary feathers fanning out from its trailing edge, so the outline
    // reads feathered, not as a plate.
    const o = add(sh, mul(U, 0.2))
    slab(bronze, o, U, V, [[0, -0.2], [0.9, -1.2], [2.2, -1.5], [L - 0.6, -0.6], [L - 0.2, 0.0], [L - 0.6, 0.4], [1.5, 0.55], [0, 0.35]], 0.22)
    for (const [u0, u1, d] of [[0.9, 2.0, 2.1], [1.7, 2.9, 2.3], [2.6, 3.7, 2.15], [3.4, L - 0.4, 1.65]] as [number, number, number][])
      slab(bronze, o, U, V, [[u0, -0.9], [u1, -0.6], [u1 + 0.15, -d + 0.4], [u1 - 0.2, -d]], 0.13)
  }
}
// One giraffe leaping over the sun toward Michael, for the nine.
smooth(bronze, q => {
  ellipsoid(q, [0.15, -0.35, 7.0], [0.75, 0.32, 0.36], 10, 4, -0.5, 0.35)
  tube(q, [[-0.4, 0.0, 7.25], [-0.75, 0.25, 7.9], [-0.95, 0.35, 8.45]], [0.16, 0.12, 0.1], 6)
  ellipsoid(q, [-1.05, 0.38, 8.55], [0.24, 0.1, 0.12], 6, 3, -0.5, 0)
  for (const [fx, fy, tx, ty, tz] of [[-0.3, 0.0, -0.75, 0.35, 6.3], [-0.1, -0.15, -0.55, 0.15, 6.3], [0.55, -0.55, 0.85, -0.95, 5.2], [0.4, -0.7, 0.65, -1.15, 5.0]]) {
    tube(q, [[fx, fy, 6.85], [tx, ty, tz]], [0.09, 0.06], 5)
  }
}, 60)

finishModel('Peace Fountain', 'nyc-peace-fountain', [
  { part: bronze, material: { name: 'bronze', color: 0x5d6862, roughness: 0.7 } },
  { part: face, material: { name: 'bronze-face', color: 0x68716a, roughness: 0.65 } },
  { part: granite, material: { name: 'granite', color: 0xd9d3c8, roughness: 0.85 } },
], { bearing: 0, osm: 'way/608955193', height: 11.0 }, 6500)
