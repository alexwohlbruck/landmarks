/**
 * Untermyer Fountain, "Three Dancing Maidens", Conservatory Garden (north
 * garden), Central Park (Walter Schott, c. 1910; installed here 1947) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-untermyer-fountain.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Bearing 0 (the
 * group is a ring; one maiden faces model −y). Anchor: OSM node/432760466
 * ("Three Dancing Maidens – Untermyer Fountain", amenity=fountain), at the
 * centre of the pool way/386469202 (natural=water, not a building), so
 * `replaces` is empty. y = 0 is the pool's water; the water, the pool's
 * kerb and the flower beds are the map's. Drawn: the carved stone drum
 * standing in the pool, its dark basin rim, and the three bronze maidens
 * dancing in a ring on the rim, hands joined over the basin.
 *
 * Evidence
 * - Published (Central Park Conservancy; NYC Parks; Wikipedia "Untermyer
 *   Fountain"): bronze by Walter Schott, three life-size dancing maidens,
 *   given by Samuel Untermyer's family and set in the Conservatory
 *   Garden's north (French) garden in 1947.
 * - Photos (Wikimedia Commons; credits in
 *   landmarks-scratch/nyc-parks/work/nyc-untermyer-fountain/photos):
 *   Station1, "Untermyer Fountain 1.jpg", CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Untermyer_Fountain_1.jpg (level,
 *   the drum, rim and all three figures);
 *   Ralph Hockens, "Untermeyer fountain1-Walter Schott.jpg", CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:Untermeyer_fountain1-Walter_Schott.jpg
 *   (from above the rim: the outward lean and the flying skirts).
 * - Estimated from the level photo, taking the maidens as life-size (head
 *   about 1.45 m over the rim as they lean): drum 2.45 m across, rim +1.4 m
 *   over the water; hands joined about 0.9 m over the rim at 0.45 m from the
 *   axis. Lidar was not used.
 *
 * Doubts: the pool's outline in OSM (a stadium shape) does not match the
 * photos well and is not drawn; the drum's carved garland relief is left
 * out; the poses are simplified to the ring, the outward lean and the
 * flaring skirts.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { smooth, lathe, ellipsoid, tube, solid, TAU } from './nyc-columbus-monument'

const stone = new Part(), rim = new Part(), bronze = new Part()

// --- The drum: base moulding, carved shaft, cornice. ---
smooth(stone, q => lathe(q, [[1.3, 0], [1.3, 0.22], [1.22, 0.3], [1.2, 1.12], [1.27, 1.18], [1.27, 1.3]], 20, 0, 0, false), 35)
// --- The basin rim: a dark lipped ring dished inside. ---
smooth(rim, q => lathe(q, [[1.27, 1.3], [1.32, 1.33], [1.32, 1.41], [1.0, 1.42], [0.95, 1.33], [0.0, 1.3]], 20, 0, 0, true), 35)

// --- The three maidens, each leaning outward from the ring, hands joined. ---
const Z = 1.41
for (let k = 0; k < 3; k++) {
  const th = -Math.PI / 2 + (k * TAU) / 3
  const ur = [Math.cos(th), Math.sin(th)], ut = [-Math.sin(th), Math.cos(th)]
  // Local (radial, tangential, up) → model, figure standing at radius 1.0.
  // The body is drawn in over the rim, more so higher up, so the lean stays over the basin's edge.
  const P = (r0: number, t: number, z: number): V3 => {
    const r = r0 - 0.2 * Math.min(1, Math.max(0, z / 0.8))
    return [ur[0] * r + ut[0] * t, ur[1] * r + ut[1] * t, Z + z]
  }
  const hand = (s: number): V3 => {
    const a = th + s * Math.PI / 3
    return [0.5 * Math.cos(a), 0.5 * Math.sin(a), Z + 0.95]
  }
  smooth(bronze, q => {
    // Legs: one planted on the rim, one kicked back and up behind.
    tube(q, [P(0.98, -0.08, 0.02), P(1.02, -0.08, 0.45), P(1.08, -0.06, 0.85)], [0.06, 0.07, 0.09], 6)
    tube(q, [P(1.1, 0.1, 0.85), P(1.3, 0.12, 0.6), P(1.42, 0.1, 0.42)], [0.09, 0.07, 0.05], 6)
    // Torso leaning outward, from the hips to the neck.
    const ring = (r: number, t: number, z: number, a: number, b: number) =>
      Array.from({ length: 10 }, (_, i) => P(r + a * Math.cos((i * TAU) / 10), t + b * Math.sin((i * TAU) / 10), z))
    solid(q, [ring(1.12, 0, 0.8, 0.16, 0.22), ring(1.22, 0, 0.98, 0.12, 0.17), ring(1.37, 0, 1.16, 0.14, 0.22), ring(1.43, 0, 1.24, 0.06, 0.06)])
    // Head thrown back a little, and hair.
    ellipsoid(q, P(1.5, 0, 1.33), [0.11, 0.1, 0.13], 8, 4)
    ellipsoid(q, P(1.56, 0, 1.39), [0.1, 0.13, 0.09], 6, 3)
    // Skirt: flaring from the waist, swept round to one side.
    solid(q, [ring(1.14, 0, 0.92, 0.16, 0.21), ring(1.18, 0.06, 0.6, 0.3, 0.38), ring(1.2, 0.18, 0.36, 0.38, 0.5)])
    // Arms out to the joined hands on either side.
    for (const s of [-1, 1]) {
      const sh = P(1.36, s * 0.2, 1.14), h = hand(s)
      const mid: V3 = [(sh[0] + h[0]) / 2, (sh[1] + h[1]) / 2, (sh[2] + h[2]) / 2 + 0.03]
      tube(q, [sh, mid, h], [0.06, 0.055, 0.05], 6)
    }
  }, 60)
}

finishModel('Untermyer Fountain', 'nyc-untermyer-fountain', [
  { part: stone, material: { name: 'limestone', color: 0x9b9587, roughness: 0.9 } },
  { part: rim, material: { name: 'rim', color: 0x6c6a66, roughness: 0.6 } },
  { part: bronze, material: { name: 'bronze', color: 0x6c6156, roughness: 0.6 } },
], { bearing: 0, height: 2.85 }, 5000)
