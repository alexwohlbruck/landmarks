/**
 * Pulitzer Fountain, Grand Army Plaza, Manhattan (Thomas Hastings, 1916;
 * Pomona by Karl Bitter, finished by Isidore Konti) — procedural, CC0-1.0,
 * no textures.
 * bun generators/nyc-pulitzer-fountain.ts
 *
 * Map frame: x = model east (Fifth Avenue), y = model north, z up, metres.
 * Placed at bearing 29°, the Manhattan grid. Anchor: OSM node/11359524457
 * (Pomona, tourism=artwork), the centre of the stacked tiers; the OSM water
 * area way/988718514 (amenity=fountain, natural=water) is the pool round
 * them and is not a building, so `replaces` is empty.
 *
 * Evidence
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m, /tmp/city/nyc/lidar.py.
 *   Plaza ~15.3 m NAVD88 (y = 0); the pool ~0.9 m; tiers stepping to
 *   ~1.3, ~2.4 and ~3.3 m over ~12, ~9 and ~7.5 m squares; the top bowl's
 *   rim ~6.2 m, ~4 m across. Trees mask the south side and the bronze figure.
 * - Published (Wikipedia; NYC LPC): Hastings's design, Bitter's bronze
 *   Pomona (goddess of abundance) holding a basket of fruit, rebuilt in
 *   granite in 1990.
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-pulitzer-fountain/photos/credits.txt: ajay_suresh
 *   (CC BY 2.0, tiers and masks), Tdorante10 (CC BY-SA 4.0, from the north
 *   and from Fifth Avenue), Another Believer (CC BY-SA 3.0), CarolPena8
 *   (CC BY-SA 4.0), Rangilo Gujarati (CC BY-SA 3.0, the bowl and Pomona),
 *   PortableNYCTours (CC BY-SA 4.0, Pomona), Jim Henderson (PD).
 *
 * The pool and its water are the map's. The tiers are drawn as stepped
 * granite (their ledges are water in reality; drawn as the stone basin bed,
 * not as water). Estimated: the tiers' chamfered-square plans, the shaft,
 * the bowl's profile, the shell masks round the lower tiers (bold lumps),
 * Pomona's height (~2.3 m on a 0.6 m pedestal) and facing (east, to Fifth
 * Avenue), her pose simplified to a standing figure holding the basket.
 */
import { Part, type V3 } from './mesh'
import { finishModel, prism, chamferRect } from './nyc-570-lexington'
import { smooth, tube, ellipsoid, lathe, turnSince } from './nyc-columbus-monument'

function build() {
  const granite = new Part(), trim = new Part(), bronze = new Part()
  const tier = (p: Part, h: number, c: number, z0: number, z1: number, b = 0.15) =>
    prism({ wall: p, win: null, roof: p, ring: chamferRect(-h, -h, h, h, c), z0, z1, facade: null, bevel: b })

  // --- Stepped tiers, each with a projecting coping. ---
  tier(granite, 5.9, 1.6, 0, 1.15)
  tier(trim, 6.05, 1.65, 1.15, 1.4, 0.12)
  tier(granite, 4.4, 1.2, 1.4, 2.2)
  tier(trim, 4.55, 1.25, 2.2, 2.45, 0.12)
  tier(granite, 3.5, 0.9, 2.45, 3.15)
  tier(trim, 3.65, 0.95, 3.15, 3.4, 0.12)

  // Shell masks spouting into the pool, on the faces of the two lower tiers.
  smooth(trim, q => {
    for (let k = 0; k < 4; k++) {
      const from = q.pos.length
      for (const x of [-2.6, 2.6]) ellipsoid(q, [x, -5.95, 0.85], [0.6, 0.35, 0.45], 8, 4)
      ellipsoid(q, [0, -4.45, 1.95], [0.55, 0.32, 0.4], 8, 4)
      turnSince(q, from, (k * Math.PI) / 2)
    }
  }, 60)

  // --- The shaft, the round bowl and Pomona's pedestal. ---
  smooth(granite, q => lathe(q, [[1.1, 3.4], [1.1, 3.7], [0.75, 3.95], [0.55, 4.3], [0.5, 5.0], [0.65, 5.3], [1.2, 5.55], [1.85, 5.85], [2.0, 6.05], [2.0, 6.2], [1.85, 6.2]], 16), 50)
  smooth(granite, q => lathe(q, [[0.42, 6.15], [0.42, 6.45], [0.32, 6.6], [0.36, 6.75], [0.45, 6.85]], 12), 50)

  // --- Pomona, bronze, facing east (+x), the basket of fruit at her waist. ---
  smooth(bronze, q => {
    const from = q.pos.length, z = 6.85
    // Slim standing nude: legs, hips, torso, head; both hands at the basket.
    for (const sx of [-1, 1]) tube(q, [[sx * 0.1, 0, z], [sx * 0.1, -0.03, z + 0.55], [sx * 0.11, 0, z + 1.05]], [0.09, 0.11, 0.14], 6)
    tube(q, [[0, 0, z + 1.0], [0, 0, z + 1.3], [0, 0.02, z + 1.75], [0, 0.02, z + 1.9]], [0.2, 0.17, 0.19, 0.08], 8)
    ellipsoid(q, [0, -0.02, z + 2.05], [0.11, 0.12, 0.14], 8, 4)
    for (const sx of [-1, 1]) tube(q, [[sx * 0.2, 0.02, z + 1.8], [sx * 0.26, -0.08, z + 1.5], [sx * 0.14, -0.28, z + 1.3]], [0.06, 0.055, 0.05], 6)
    ellipsoid(q, [0, -0.32, z + 1.25], [0.3, 0.2, 0.15], 8, 4)
    // A short drape about the hips.
    tube(q, [[0, 0, z + 0.85], [0, 0, z + 1.15]], [0.24, 0.22], 8)
    turnSince(q, from, Math.PI / 2) // −y front turned to face +x
  }, 60)

  finishModel('Pulitzer Fountain', 'nyc-pulitzer-fountain', [
    { part: granite, material: { name: 'granite', color: 0xe0d5c3, roughness: 0.85 } },
    { part: trim, material: { name: 'granite-trim', color: 0xeae1d2, roughness: 0.85 } },
    { part: bronze, material: { name: 'bronze', color: 0x55635b, roughness: 0.75 } },
  ], { bearing: 29, osm: 'way/988718514', height: 9.15 }, 5000)
}

if (import.meta.main) build()
