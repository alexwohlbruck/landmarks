/**
 * Gapstow Bridge, the Pond, Central Park (Howard & Caudwell, 1896) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-gapstow-bridge.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 332.7°, so model +x runs along the bridge (62.7°, ENE, the long
 * sides of OSM way/546663191, man_made=bridge, bridge:structure=humpback)
 * and +y is across it, toward the north-west. Anchor: the centroid of that
 * outline, which this model replaces. The model draws the whole structure
 * inside the outline, walkway surface included (a footbridge's deck is the
 * model's, per docs/reference.md on bridges).
 *
 * Evidence
 * - OSM way/546663191: 22.4 m between the end midpoints, 6.06 m wide.
 * - Map terrain (Mapterhorn) in this frame: the Pond's water at y = 0
 *   under x −6..+6; the banks rise to about +3.6 m at |x| ≥ 11. The ends of
 *   the bridge stand on the banks: every foot is set on that terrain, vertex
 *   by vertex (bridge-kit `footedLoft` style), with y = 0 the water.
 * - Published (Central Park Conservancy; Wikipedia "Gapstow Bridge"): a
 *   single segmental arch of rough-cut Manhattan schist, 1896, replacing
 *   Mould's 1874 iron bridge; span about 44 ft (13.4 m), 76 ft (23 m) long.
 * - Photos (Wikimedia Commons; credits in
 *   landmarks-scratch/nyc-parks/work/nyc-gapstow-bridge/photos):
 *   spurekar, "Gapstow Bridge.jpg", CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:Gapstow_Bridge.jpg (side-on
 *   from the water, south-east: arch and parapet profile);
 *   Randusr836, "Sunlit Gapstow Bridge.jpg", CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Sunlit_Gapstow_Bridge.jpg (from
 *   the north, above the Pond: the hump and the low arch).
 * - Estimated from the side-on photo scaled to the 13.4 m span: arch crown
 *   (intrados) +4.3 m over the water, springing at the water (radius 7.8 m), arch
 *   ring 0.7 m deep; walkway +5.0 m at the ends rising to +6.4 m at midspan;
 *   solid parapet 1.0 m over the walkway, 0.45 m thick, with a coping.
 *
 * Doubts: the ivy that covers the spandrels in autumn and the stone
 * texture are left out; the parapet ends are drawn as plain square ends.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'

const stone = new Part(), ring = new Part(), coping = new Part(), walk = new Part()

const L = 11.2, W = 3.03, PT = 0.45 // half length, half width, parapet thickness
const SPAN = 6.7, SPRING = 0, CROWN = 4.3
const R = (SPAN * SPAN + (CROWN - SPRING) ** 2) / (2 * (CROWN - SPRING)), ZC = CROWN - R
const intrados = (x: number) => (Math.abs(x) < SPAN ? ZC + Math.sqrt(R * R - x * x) : NaN)
// The walkway: a circular hump from +5.0 at the ends to +6.4 at midspan.
const RW = (L * L + 1.4 ** 2) / (2 * 1.4)
const deck = (x: number) => 6.4 - RW + Math.sqrt(RW * RW - x * x)
const top = (x: number) => deck(x) + 1.0
// The banks, from the map's terrain in this frame (|x| in metres → height over the water).
const bank = (x: number) => {
  const a = Math.abs(x)
  return a <= 6 ? 0 : a >= 11 ? 3.6 : 3.6 * (a - 6) / 5
}
const bottom = (x: number) => (Math.abs(x) < SPAN ? intrados(x) : Math.max(0, bank(x)))

// Stations along the bridge: fine over the arch, closing exactly at the springings.
const xs: number[] = []
for (let i = 0; i <= 24; i++) xs.push(-SPAN + (2 * SPAN * i) / 24)
for (const s of [-1, 1]) for (const x of [7.6, 8.6, 9.6, 10.4, L]) xs.push(s * x)
xs.sort((a, b) => a - b)
const bot = (x: number) => (Math.abs(Math.abs(x) - SPAN) < 1e-6 ? SPRING : bottom(x))

const N = (x: number, y: number, z: number): V3 => [x, y, z]
for (let i = 0; i + 1 < xs.length; i++) {
  const a = xs[i], b = xs[i + 1]
  for (const s of [-1, 1]) {
    const y = s * W, yi = s * (W - PT), n: V3 = [0, s, 0]
    // Outer face, from the soffit or the bank up to the coping.
    const q = (p: Part, za: number, zb: number, zc: number, zd: number, yy: number, nn: V3) => {
      p.tri(N(a, yy, za), N(b, yy, zb), N(b, yy, zc), undefined, undefined, undefined, [nn, nn, nn])
      p.tri(N(a, yy, za), N(b, yy, zc), N(a, yy, zd), undefined, undefined, undefined, [nn, nn, nn])
    }
    q(stone, bot(a), bot(b), top(b) - 0.2, top(a) - 0.2, y, n)
    // The arch ring: voussoirs a little proud of the spandrel.
    if (Math.abs(a) < SPAN + 1e-6 && Math.abs(b) < SPAN + 1e-6) {
      const yr = y + s * 0.05
      q(ring, bot(a), bot(b), bot(b) + 0.7, bot(a) + 0.7, yr, n)
      const ra: V3 = N(a, yr, bot(a)), rb: V3 = N(b, yr, bot(b))
      const dn: V3 = [0, 0, -1]
      ring.tri(N(a, y, bot(a)), N(b, y, bot(b)), rb, undefined, undefined, undefined, [dn, dn, dn])
      ring.tri(N(a, y, bot(a)), rb, ra, undefined, undefined, undefined, [dn, dn, dn])
    }
    // Coping: outer lip, top and inner face down to the walkway.
    q(coping, top(a) - 0.2, top(b) - 0.2, top(b), top(a), y + s * 0.06, n)
    const up: V3 = [0, 0, 1]
    coping.tri(N(a, y + s * 0.06, top(a)), N(b, y + s * 0.06, top(b)), N(b, yi, top(b)), undefined, undefined, undefined, [up, up, up])
    coping.tri(N(a, y + s * 0.06, top(a)), N(b, yi, top(b)), N(a, yi, top(a)), undefined, undefined, undefined, [up, up, up])
    q(stone, deck(a), deck(b), top(b), top(a), yi, [0, -s, 0])
  }
  // Walkway and soffit (or the underside over the banks).
  const up: V3 = [0, 0, 1], dn: V3 = [0, 0, -1]
  const wi = W - PT
  walk.tri(N(a, -wi, deck(a)), N(b, -wi, deck(b)), N(b, wi, deck(b)), undefined, undefined, undefined, [up, up, up])
  walk.tri(N(a, -wi, deck(a)), N(b, wi, deck(b)), N(a, wi, deck(a)), undefined, undefined, undefined, [up, up, up])
  if (Math.abs(a) < SPAN + 1e-6 && Math.abs(b) < SPAN + 1e-6) {
    stone.tri(N(a, -W, bot(a)), N(b, W, bot(b)), N(b, -W, bot(b)), undefined, undefined, undefined, [dn, dn, dn])
    stone.tri(N(a, -W, bot(a)), N(a, W, bot(a)), N(b, W, bot(b)), undefined, undefined, undefined, [dn, dn, dn])
  }
}
// Square ends of the parapets and the walkway at each bank.
for (const s of [-1, 1]) {
  const x = s * L, n: V3 = [s, 0, 0]
  for (const y of [-1, 1]) {
    const yo = y * W, yi = y * (W - PT)
    stone.tri(N(x, yo, bank(x)), N(x, yi, bank(x)), N(x, yi, top(x)), undefined, undefined, undefined, [n, n, n])
    stone.tri(N(x, yo, bank(x)), N(x, yi, top(x)), N(x, yo, top(x)), undefined, undefined, undefined, [n, n, n])
  }
  const wi = W - PT
  stone.tri(N(x, -wi, bank(x)), N(x, wi, bank(x)), N(x, wi, deck(x)), undefined, undefined, undefined, [n, n, n])
  stone.tri(N(x, -wi, bank(x)), N(x, wi, deck(x)), N(x, -wi, deck(x)), undefined, undefined, undefined, [n, n, n])
}

finishModel('Gapstow Bridge', 'nyc-gapstow-bridge', [
  { part: stone, material: { name: 'schist', color: 0x958e84, roughness: 0.9 } },
  { part: ring, material: { name: 'voussoirs', color: 0xa69d90, roughness: 0.9 } },
  { part: coping, material: { name: 'coping', color: 0xb9b2a6, roughness: 0.85 } },
  { part: walk, material: { name: 'walkway', color: 0xa9a49b, roughness: 0.9 } },
], { bearing: 332.7, osm: 'way/546663191', height: 7.4 }, 5000)
