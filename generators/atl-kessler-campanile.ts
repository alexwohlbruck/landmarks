/**
 * Kessler Campanile, Georgia Institute of Technology, Atlanta (1996) —
 * original procedural geometry, CC0-1.0.
 * bun generators/atl-kessler-campanile.ts
 *
 * Uses the B9 kit exported from generators/atl-tech-tower.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Bearing 0. Anchor = OSM node/11698623873, 33.77430, -84.39818
 * (the campanile; OSM maps no building for it, so `replaces` is empty).
 *
 * Identity: an 80 ft stainless-steel shard rising out of a round fountain
 * pool in the Georgia Tech amphitheatre beside the Student Center: a
 * slender three-sided obelisk built of 244 stacked steel plates, each
 * turned a little from the one below so the faces twist as it rises,
 * tapering to a sharp point, on a flared three-sided foot standing in the
 * water. The pool's raised white rim rings it. Lit at night.
 *
 * Evidence:
 *  - height: 24 m (80 ft), published (Wikipedia, "Kessler Campanile").
 *    The 2018 lidar (GA_Statewide_B2_2018) catches only a few returns on
 *    the thin shaft (9.6 m at 1 m from the anchor), so it gives the
 *    position and not the height.
 *  - pool: the lidar has no returns over the water inside a circle of
 *    about 7 m radius centred 1 m south-west of the anchor, with the plaza
 *    0.7 m above ground_min round it; NAIP agrees. The rim is drawn 0.9 m
 *    wide and 0.6 m tall (estimated from the Daderot photos).
 *  - the foot and the shaft: scaled from the Daderot photos against the
 *    24 m height: the foot about 2.5 m tall and 4 m across, the shaft about
 *    1.45 m across above it, tapering to 0.55 m before a 3.5 m needle. The twist (about 50° over the height) is
 *    estimated from the photos' swirling plate edges.
 *  - ground: Mapterhorn is flat here (within 0.5 m over 24 m); elevation 0.
 *  - colour: the steel reads as a dark warm grey in every daylight photo,
 *    pulled to just above charcoal; the rim is white concrete.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Kessler Campanile - Georgia Institute of Technology - DSC00765.JPG,
 *    Daderot, CC0 https://commons.wikimedia.org/wiki/File:Kessler_Campanile_-_Georgia_Institute_of_Technology_-_DSC00765.JPG
 *  - Kessler Campanile - Georgia Institute of Technology - DSC00771.JPG,
 *    Daderot, CC0 https://commons.wikimedia.org/wiki/File:Kessler_Campanile_-_Georgia_Institute_of_Technology_-_DSC00771.JPG
 *  - Kessler Campanile- Georgia Institute of Technology - DSC00757.JPG,
 *    Daderot, CC0 https://commons.wikimedia.org/wiki/File:Kessler_Campanile-_Georgia_Institute_of_Technology_-_DSC00757.JPG
 *  - Kessler Campanile, Georgia Tech.jpg, Davidhermanns, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Kessler_Campanile,_Georgia_Tech.jpg
 *  - Georgia Tech Student Center and Campanile.jpg, Disavian, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Georgia_Tech_Student_Center_and_Campanile.jpg
 *  - Kessler Campanile.jpg, Scott Ehardt, public domain (night)
 *    https://commons.wikimedia.org/wiki/File:Kessler_Campanile.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the plates' stepped edges are drawn as a smooth twisted shaft;
 * the exact twist, the foot's proportions and the rim's height are
 * estimates. The amphitheatre's steps and the fountain jets are left out
 * (ground and water are the map's).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { revolve, save, type XY } from './atl-tech-tower'

const steel = new Part(), rim = new Part()

const C: XY = [0.6, 0.4] // the shaft, from the lidar returns
const POOL: XY = [-0.5, -1.0], R_POOL = 7.4
const H = 24

// A triangle of circumradius r at height z, turned by a.
const tri = (r: number, z: number, a: number): V3[] => [0, 1, 2].map((k) => {
  const t = a + (k / 3) * Math.PI * 2 + Math.PI / 2
  return [C[0] + r * Math.cos(t), C[1] + r * Math.sin(t), z] as V3
})

// The foot: flares from 4 m across at the water to the shaft's 1.7 m.
const footR = (w: number) => w / Math.sqrt(3) // side → circumradius
const TWIST = (50 * Math.PI) / 180
const turn = (z: number) => TWIST * (z / H)
const rings: V3[][] = [
  tri(footR(4.0), 0, 0),
  tri(footR(3.2), 1.0, turn(1.0)),
  tri(footR(1.7), 2.2, turn(2.2)),
  tri(footR(1.45), 2.6, turn(2.6)),
]
// The shaft: a slow taper (1.45 m to 0.55 m), a ring every 2.5 m so the
// twist reads, then the needle tip.
for (let z = 5; z < H - 3.5; z += 2.5) rings.push(tri(footR(1.45 - 0.9 * (z - 2.6) / (H - 6.1)), z, turn(z)))
rings.push(tri(footR(0.55), H - 3.5, turn(H - 3.5)))
steel.loft(rings)
// The pyramidal tip.
const top = rings[rings.length - 1], apex: V3 = [C[0], C[1], H]
for (let k = 0; k < 3; k++) steel.tri(top[k], top[(k + 1) % 3], apex)
steel.cap(rings[0], false)

// The pool's raised white rim, smooth-shaded, a 32-sided ring.
revolve(rim, POOL, [[R_POOL + 0.9, 0], [R_POOL + 0.9, 0.45], [R_POOL + 0.75, 0.6], [R_POOL, 0.6], [R_POOL, 0]], 32, 0, false, false)

// Night: the shaft is floodlit from the pool, brightest low down.
await save('atl-kessler-campanile', 'Kessler Campanile', [
  { part: steel, material: { ...finish('campanile-steel', 0x62666c, 0.4), floodlight: (p) => Math.max(0.35, 1 - p[2] / 30) } },
  { part: rim, material: PALETTE.trim },
], { height: H, anchor: [33.7743, -84.39818], bearing: 0 })
