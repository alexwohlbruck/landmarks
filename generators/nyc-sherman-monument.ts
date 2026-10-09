/**
 * William Tecumseh Sherman Monument, Grand Army Plaza, Manhattan (Augustus
 * Saint-Gaudens, 1903; pedestal by Charles McKim) — procedural, CC0-1.0, no
 * textures.
 * bun generators/nyc-sherman-monument.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 28°, the long axis of the OSM pedestal (way/988716842,
 * tourism=artwork, not a building, so `replaces` is empty). Model −y is the
 * front: Sherman rides south-south-west down Fifth Avenue, Victory striding
 * ahead on his horse's left (+x). Anchor: the centroid of that outline.
 *
 * Evidence
 * - OSM way/988716842: a round-ended pedestal 2.25 m wide, 6.45 m long.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m (/tmp/city/nyc/lidar.py):
 *   plaza ~15.8 m NAVD88 (y = 0); steps ~0.8 m; pedestal top ~3.3 m; the
 *   group's highest point 7.8 m, at its front (Victory's raised arm), the
 *   group spanning the pedestal's width. Bronze returns are sparse.
 * - Published (Wikipedia; NYC Parks): gilded bronze, Saint-Gaudens, unveiled
 *   1903, regilded 2013; pink Stony Creek granite pedestal by McKim.
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-sherman-monument/photos/credits.txt: Axel
 *   Tschentscher (PD, the horse's left with Victory), Jim Henderson (PD),
 *   Jay Dobkin (CC BY-SA 4.0, from behind on the left), BriYYZ (CC BY-SA
 *   2.0, the front-left), Doubleduhgirls (PD, head on).
 *
 * Estimated from the photos against the lidar: the steps, the pedestal's
 * mouldings, the horse (walking, near fore raised and bent, arched neck,
 * head high; ~3 m nose to tail, the group heroic scale), Sherman upright
 * with his cloak billowing behind and his hat in his lowered right hand,
 * Victory's pose (flared robe, right arm raised forward, the palm frond
 * upright in her left hand, broad wings). The pedestal's carved inscription
 * and the small bronze details are left out.
 */
import { Part, type V3 } from './mesh'
import { finishModel, prism } from './nyc-570-lexington'
import { TAU, smooth, solid, tube, ellipsoid, slab } from './nyc-columbus-monument'
import { ell, robed } from './nyc-uss-maine-monument'

/** A round-ended (stadium) ring: half-width w, half-length l along y, n points per end. */
function stadium(w: number, l: number, n = 7): [number, number][] {
  const pts: [number, number][] = []
  for (let i = 0; i <= n; i++) { const a = Math.PI + (Math.PI * i) / n; pts.push([w * Math.cos(a), -(l - w) + w * Math.sin(a)]) }
  for (let i = 0; i <= n; i++) { const a = (Math.PI * i) / n; pts.push([w * Math.cos(a), (l - w) + w * Math.sin(a)]) }
  return pts
}

function build() {
  const granite = new Part(), steps = new Part(), gold = new Part()
  const pr = (p: Part, w: number, l: number, z0: number, z1: number, bevel = 0.08) =>
    prism({ wall: p, win: null, roof: p, ring: stadium(w, l), z0, z1, facade: null, bevel })

  // --- Steps and the pink granite pedestal. ---
  pr(steps, 1.85, 4.0, 0, 0.4)
  pr(steps, 1.5, 3.65, 0.4, 0.8)
  pr(granite, 1.22, 3.32, 0.8, 1.15, 0.1)
  pr(granite, 1.12, 3.22, 1.15, 2.95, 0.04)
  pr(granite, 1.22, 3.32, 2.95, 3.3, 0.12)

  // --- The gilded group, on its rocky bronze ground. ---
  const zb = 3.5
  smooth(gold, q => {
    solid(q, [ell(0, 0, 3.3, 1.08, 3.1, 14), ell(0, 0, 3.42, 1.05, 3.05, 14), ell(0, 0, zb, 0.95, 2.95, 14)])

    // The horse, walking south: rounded chest, barrel and quarters, an arched
    // neck carrying the head high and forward, the near (left, +x) foreleg
    // raised and bent, the tail hanging. Heroic scale K.
    const hx = -0.3, K = 1.35
    const H = (x: number, y: number, z: number): V3 => [hx + x * K, 0.35 + y * K, zb + z * K]
    // One rounded body from rump to chest, then a thick neck rising forward
    // and a short tapered head; four tapered legs.
    tube(q, [H(0, 0.98, 1.42), H(0, 0.8, 1.45), H(0, 0.2, 1.42), H(0, -0.38, 1.5), H(0, -0.6, 1.55)], [0.26 * K, 0.46 * K, 0.5 * K, 0.5 * K, 0.28 * K], 12)
    tube(q, [H(0, -0.42, 1.6), H(0, -0.62, 2.08), H(0, -0.78, 2.5)], [0.33 * K, 0.23 * K, 0.16 * K], 10)
    tube(q, [H(0, -0.76, 2.56), H(0, -0.97, 2.42), H(0, -1.14, 2.24)], [0.16 * K, 0.13 * K, 0.09 * K], 8)
    const leg = (pts: V3[]) => tube(q, pts, [0.19 * K, 0.12 * K, 0.1 * K].slice(0, pts.length), 8)
    leg([H(0.16, -0.4, 1.2), H(0.17, -0.62, 0.78), H(0.17, -0.5, 0.42)])   // near fore, raised
    leg([H(-0.16, -0.4, 1.2), H(-0.16, -0.45, 0.55), H(-0.16, -0.45, 0)])   // off fore
    for (const sx of [-1, 1]) leg([H(sx * 0.16, 0.72, 1.2), H(sx * 0.16, 0.86, 0.6), H(sx * 0.16, 0.76, 0)])
    tube(q, [H(0, 1.02, 1.55), H(0, 1.16, 1.1), H(0, 1.14, 0.6)], [0.09 * K, 0.11 * K, 0.06 * K], 8)

    // Sherman, upright in the saddle, his cloak billowing behind him, the hat
    // in his lowered right hand (−x), the reins in his left.
    tube(q, [H(0, 0.12, 1.88), H(0, 0.14, 2.3), H(0, 0.12, 2.6)], [0.24 * K, 0.23 * K, 0.2 * K], 8)
    ellipsoid(q, H(0, 0.1, 2.78), [0.11 * K, 0.12 * K, 0.13 * K], 8, 4)
    for (const sx of [-1, 1]) tube(q, [H(sx * 0.18, 0.12, 1.9), H(sx * 0.38, -0.18, 1.62), H(sx * 0.38, -0.06, 1.12)], [0.1 * K, 0.08 * K, 0.06 * K], 6)
    tube(q, [H(-0.24, 0.12, 2.5), H(-0.32, 0.04, 2.15), H(-0.34, -0.04, 1.85)], [0.07 * K, 0.06 * K, 0.05 * K], 6)
    solid(q, [ell(...H(-0.36, -0.05, 1.8), 0.17 * K, 0.17 * K, 8), ell(...H(-0.36, -0.05, 1.86), 0.17 * K, 0.17 * K, 8)])
    tube(q, [H(0.24, 0.12, 2.5), H(0.28, -0.1, 2.2), H(0.1, -0.32, 2.12)], [0.07 * K, 0.06 * K, 0.05 * K], 6)
    solid(q, [ell(...H(0, 0.24, 2.6), 0.3 * K, 0.12 * K, 10), ell(...H(0, 0.5, 2.3), 0.44 * K, 0.22 * K, 10), ell(...H(0, 0.72, 1.92), 0.5 * K, 0.24 * K, 10), ell(...H(0, 0.78, 1.78), 0.42 * K, 0.16 * K, 10)])

    // Victory striding ahead on the horse's left: a flared robe to the
    // ground, her bust, right arm raised forward and up, the palm frond held
    // up in her left hand, two broad wings behind her shoulders.
    const vx = 0.42, vy = -2.0, vFrom = q.pos.length
    solid(q, [ell(vx, vy + 0.12, zb, 0.46, 0.52, 12), ell(vx, vy + 0.06, zb + 0.6, 0.36, 0.38, 12), ell(vx, vy, zb + 1.3, 0.24, 0.22, 12), ell(vx, vy, zb + 1.6, 0.19, 0.15, 12)])
    solid(q, [ell(vx, vy, zb + 1.58, 0.19, 0.15, 10), ell(vx, vy - 0.02, zb + 2.0, 0.22, 0.15, 10), ell(vx, vy, zb + 2.3, 0.2, 0.13, 10), ell(vx, vy, zb + 2.38, 0.07, 0.07, 10)])
    ellipsoid(q, [vx, vy - 0.02, zb + 2.55], [0.12, 0.13, 0.15], 8, 4)
    tube(q, [[vx - 0.2, vy, zb + 2.25], [vx - 0.3, vy - 0.32, zb + 2.7], [vx - 0.32, vy - 0.5, zb + 3.2]], [0.075, 0.065, 0.055], 6)
    tube(q, [[vx + 0.2, vy, zb + 2.25], [vx + 0.4, vy - 0.12, zb + 2.0], [vx + 0.46, vy - 0.22, zb + 1.95]], [0.075, 0.065, 0.055], 6)
    slab(q, [vx + 0.47, vy - 0.24, zb + 1.85], [0.08, 0.1, 1], [0, 1, 0], [[0, -0.05], [0.6, -0.17], [1.2, -0.15], [1.6, 0], [1.2, 0.15], [0.6, 0.17], [0, 0.05]], 0.07)
    // Two wings, mirrored about her body, rising up and back from her
    // shoulders toward the horse, their tips above her head.
    for (const sx of [-1, 1]) slab(q, [vx + sx * 0.15, vy + 0.15, zb + 2.2], [sx * 0.5, 0.87, 0], [0, -0.2, 1],
      [[0, -0.12], [0.24, -0.25], [0.42, 0.05], [0.47, 0.5], [0.36, 0.9], [0.15, 0.68], [0, 0.26]], 0.1)
    // Victory is drawn at 1.2× these numbers (about the base of her robe), so
    // her head comes level with the horse's ears, as in the photos.
    const g = [vx, zb, -vy] // glTF frame (x, z, −y)
    for (let i = vFrom; i < q.pos.length; i++) q.pos[i] = g[i % 3] + (q.pos[i] - g[i % 3]) * 1.2
  }, 55)

  finishModel('William Tecumseh Sherman Monument', 'nyc-sherman-monument', [
    { part: granite, material: { name: 'pink-granite', color: 0xdcc2b5, roughness: 0.85 } },
    { part: steps, material: { name: 'granite-steps', color: 0xd6cfc6, roughness: 0.85 } },
    { part: gold, material: { name: 'gilding', color: 0xdcb35a, roughness: 0.45 } },
  ], { bearing: 28, osm: 'way/988716842', height: 7.8 }, 5000)
}

if (import.meta.main) build()
