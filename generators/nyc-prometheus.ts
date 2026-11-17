/**
 * Prometheus, the Lower Plaza fountain, Rockefeller Center, Manhattan (Paul
 * Manship, 1934) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-prometheus.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 29°, the Manhattan grid: model +x points along the Lower Plaza
 * toward Fifth Avenue, which Prometheus faces; the red granite fountain
 * wall stands behind him on the plaza's west side (−x), under Rockefeller
 * Plaza (the private street). Anchor: OSM node/1332501243 (Prometheus,
 * tourism=artwork), the statue's centre. No building is mapped here, so
 * `replaces` is empty. y = 0 is the floor of the sunken Lower Plaza (the
 * rink).
 *
 * Elevation: 0. The plaza is sunk about 4.9 m below Rockefeller Plaza
 * (lidar first returns on the street paving 5.2 m and on the rink floor
 * 0.3 m above the box's lowest return; secondary sources give "18 feet
 * below street level", 5.5 m, toward Fifth Avenue). But the map's terrain
 * (Mapterhorn) already draws this pit, 4.8 m deep, and the map stands a
 * model on the lowest terrain under it, so the statue's base already lands
 * on the plaza floor; a negative `elevation` would sink it a further 4.9 m
 * under the rink. (Checked with `bun tools/terrain.ts check`.)
 *
 * Evidence
 * - Published (Wikipedia, "Prometheus (Manship)"): gilded bronze, 18 ft
 *   (5.5 m) tall, 8 tons; in a 60 by 16 ft (18.3 by 4.9 m) fountain basin
 *   in front of the wall; the ring is the heavens with the zodiac.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m: the wall's back at
 *   x ≈ −3 with its parapet ~1.2 m above the street (6.3 m above the rink);
 *   the pool (no returns) from x −2.5 to +2.3; the cascades and the lower
 *   trough to x ≈ +4.5; returns on the statue up to ~5.4 m.
 * - Photos (Wikimedia Commons):
 *   - "Prometheus (Manship) photographed in 2024.jpg", Penguinpottery,
 *     CC BY 4.0 (head-on from the east: wall, planters, waterfall, pool and
 *     cascades; the proportions below are scaled off it);
 *   - "Prometheus at Rockefeller Center by David Shankbone.jpg", public
 *     domain (the figure, ring and mountain from the north-east);
 *   - "Prometheus Rockefeller Center.jpg", Uris, public domain (from the
 *     south-east, the ring's tilt);
 *   - "Rockefeller Center Lower Plaza New York City 2022.jpg", Larry D.
 *     Moore, CC BY 4.0 (from above, the basin and steps);
 *   - "Prometheus Rockefeller Center Plaza.jpg", foxbert, CC BY 2.0 (night:
 *     the statue floodlit, the wall lit).
 *
 * Estimated from the head-on photo against the wall's lidar height: the
 * mountain (faceted, 3.6 by 3 m at the water, peak 3.2 m), the ring (4.7 m
 * across, a broad flat band tilted front-down), the figure (head north,
 * flying east, flame held up at 6.5 m, the left arm reaching out north),
 * the pool and two cascade steps, the waterfall on the wall (a pale sheet,
 * the same water-as-solid choice as nyc-revson-fountain), the grey ledges
 * and the hedges in their planters. The inscription and the zodiac reliefs
 * are left out. Gold: the bright yellow of the regilding (2019), a little
 * muted; floodlit at night like the real statue.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { TAU, smooth, solid, tube, ellipsoid, block, face, add } from './nyc-columbus-monument'

const gold = new Part(), red = new Part(), grey = new Part(), water = new Part(), spray = new Part(), hedge = new Part()

// --- The red granite wall behind, up past the street to its parapet. ---
block(red, -3.8, -9.6, -2.7, 9.6, 0, 6.3, 0.05, 0.12)
// Grey granite piers closing the ends, up to the street (5.2 m).
for (const s of [-1, 1]) block(grey, -3.8, s > 0 ? 9.6 : -11.0, -1.6, s > 0 ? 11.0 : -9.6, 0, 5.2, 0.1, 0.1)
// Grey ledges carrying the planters, either side of the waterfall.
for (const s of [-1, 1]) {
  const y0 = s > 0 ? 5.8 : -9.6, y1 = s > 0 ? 9.6 : -5.8
  block(grey, -2.7, y0, -1.5, y1, 0, 2.1, 0.05, 0.08)
  block(gold, -2.65, y0 + 0.05, -1.55, y1 - 0.05, 2.1, 2.4, 0.04, 0.03) // bronze planter box
  // A row of clipped arborvitae, drawn as one hedge with rounded tops.
  smooth(hedge, q => {
    for (let k = 0; k < 6; k++) {
      const y = y0 + 0.35 + k * ((y1 - y0 - 0.7) / 5)
      ellipsoid(q, [-2.1, y, 3.6], [0.42, 0.42, 1.3], 8, 4)
    }
  }, 60)
}
// The waterfall: a pale sheet down the wall's face between the planters.
face(spray, [-2.66, -5.4, 0.9], [-2.66, 5.4, 0.9], [-2.66, 5.4, 4.8], [-2.66, -5.4, 4.8], [-3, 0, 2])

// --- The basin: the upper pool round the statue, two cascade steps, the
// lower trough along the plaza. Water levels drawn as flat water. ---
block(grey, -2.7, -8.0, 2.2, 8.0, 0, 1.0, 0.1, 0.08)
block(grey, 1.6, -8.6, 3.0, 8.6, 0, 0.62, 0.1, 0.06)
for (let k = 0; k < 4; k++) block(grey, 2.6, -9.15 + k * 4.575, 4.2, -9.15 + (k + 1) * 4.575, 0, 0.32, 0.05, 0.05)
face(water, [-2.55, -7.8, 1.02], [2.0, -7.8, 1.02], [2.0, 7.8, 1.02], [-2.55, 7.8, 1.02], [0, 0, 0])
// Water spilling over the cascades: pale faces on the step fronts.
face(spray, [2.24, -7.9, 0.62], [2.24, 7.9, 0.62], [2.24, 7.9, 0.98], [2.24, -7.9, 0.98], [0, 0, 0.8])
face(spray, [3.04, -8.5, 0.32], [3.04, 8.5, 0.32], [3.04, 8.5, 0.6], [3.04, -8.5, 0.6], [0, 0, 0.5])

// --- The mountain: a faceted peak rising from the pool. ---
smooth(gold, q => {
  const ring = (rx: number, ry: number, z: number, dx: number, dy: number, n = 7, ph = 0.3): V3[] =>
    Array.from({ length: n }, (_, i) => [dx + rx * Math.cos(ph + i * TAU / n), dy + ry * Math.sin(ph + i * TAU / n), z])
  solid(q, [ring(1.5, 1.8, 0.95, 0, 0), ring(1.35, 1.5, 1.7, 0, -0.1), ring(0.9, 1.0, 2.6, -0.1, -0.3), ring(0.35, 0.4, 3.2, -0.1, -0.5)])
}, 25)

// --- The ring of the heavens: a broad flat band, tilted front-down. ---
{
  const C: V3 = [-0.05, -0.2, 2.65], R = 2.35, W = 0.45, T = 0.12, n = 32
  const tilt = 0.6, roll = -0.15 // radians about y (front down) and about x (south up)
  const rot = (v: V3): V3 => {
    let [x, y, z] = v
    ;[x, z] = [x * Math.cos(tilt) + z * Math.sin(tilt), -x * Math.sin(tilt) + z * Math.cos(tilt)]
    ;[y, z] = [y * Math.cos(roll) - z * Math.sin(roll), y * Math.sin(roll) + z * Math.cos(roll)]
    return add(C, [x, y, z])
  }
  const pt = (a: number, r: number, h: number) => rot([r * Math.cos(a), r * Math.sin(a), h])
  for (let i = 0; i < n; i++) {
    const a0 = i * TAU / n, a1 = (i + 1) * TAU / n, am = (a0 + a1) / 2
    const inside = pt(am, R - T / 2, 0)
    const ro = R, ri = R - T, h = W / 2
    face(gold, pt(a0, ro, -h), pt(a1, ro, -h), pt(a1, ro, h), pt(a0, ro, h), inside)
    face(gold, pt(a0, ri, -h), pt(a1, ri, -h), pt(a1, ri, h), pt(a0, ri, h), inside)
    face(gold, pt(a0, ri, h), pt(a1, ri, h), pt(a1, ro, h), pt(a0, ro, h), inside)
    face(gold, pt(a0, ri, -h), pt(a1, ri, -h), pt(a1, ro, -h), pt(a0, ro, -h), inside)
  }
}

// --- Prometheus: flying east (+x) over the peak, head to the north (+y),
// the flame held high, the left arm reaching out north, legs trailing south. ---
smooth(gold, q => {
  // Torso from the hips (south) to the shoulders (north), chest to the east.
  tube(q, [[0.05, -0.85, 3.55], [0.1, -0.2, 3.65], [0.1, 0.6, 3.85], [0.05, 1.25, 4.05]], [0.36, 0.4, 0.46, 0.4], 10)
  // Head, with the mass of curls.
  ellipsoid(q, [0.15, 1.85, 4.45], [0.3, 0.32, 0.34], 10, 5)
  tube(q, [[0.08, 1.35, 4.1], [0.12, 1.65, 4.3]], [0.17, 0.16], 6)
  // Right arm raised, the hand holding the flame up over his back.
  tube(q, [[-0.15, 1.2, 4.2], [-0.25, 1.0, 4.95], [-0.2, 0.6, 5.6]], [0.17, 0.15, 0.13], 7)
  ellipsoid(q, [-0.2, 0.55, 5.8], [0.18, 0.18, 0.28], 8, 4)
  tube(q, [[-0.2, 0.55, 5.95], [-0.15, 0.5, 6.25]], [0.16, 0.04], 6) // the flame
  // Left arm reaching out north, a little up.
  tube(q, [[0.25, 1.3, 4.05], [0.45, 2.3, 4.2], [0.55, 3.1, 4.4]], [0.17, 0.14, 0.11], 7)
  ellipsoid(q, [0.58, 3.3, 4.45], [0.12, 0.2, 0.08], 6, 3)
  // The trailing leg, straight back to the south.
  tube(q, [[0.0, -0.9, 3.55], [-0.1, -1.9, 3.75], [-0.15, -2.9, 4.0]], [0.24, 0.19, 0.13], 7)
  ellipsoid(q, [-0.15, -3.1, 4.05], [0.1, 0.22, 0.09], 6, 3)
  // The bent leg: knee down on the peak, shin back.
  tube(q, [[0.2, -0.85, 3.45], [0.35, -1.0, 2.95], [0.25, -1.75, 3.15]], [0.24, 0.19, 0.13], 7)
  // Drapery: a band round the hips and a scarf curling up behind the legs.
  tube(q, [[0.0, -0.75, 3.55], [0.0, -0.45, 3.6]], [0.42, 0.42], 10)
  tube(q, [[-0.2, -0.6, 3.75], [-0.35, -1.4, 4.2], [-0.3, -2.0, 4.6], [-0.2, -1.7, 4.95], [-0.15, -1.35, 4.75]], [0.16, 0.2, 0.2, 0.16, 0.12], 7)
  // Heroic and heavy-limbed in the photos: scale the figure up about its
  // hips, keeping the hips on the peak and the flame at 6.5 m: the published 5.5 m
  // over the 0.95 m water line.
  const S = 1.3, c = [0.1, 3.4, -(-0.6)] // glTF (x, z, -y)
  for (let k = 0; k < q.pos.length; k += 3) for (let j = 0; j < 3; j++) q.pos[k + j] = c[j] + (q.pos[k + j] - c[j]) * S + (j === 1 ? -0.6 : 0)
}, 60)

const lit = (k: number) => (p: V3, n: V3) => (n[2] > 0.85 ? k * 0.6 : k)
finishModel('Prometheus', 'nyc-prometheus', [
  { part: gold, material: { name: 'gilding', color: 0xe0ad45, roughness: 0.4, floodlight: lit(0.9) } },
  { part: red, material: { name: 'red-granite', color: 0x9c6a5c, roughness: 0.6, floodlight: (p: V3) => (p[2] < 4.8 ? 0.5 : 0.15) } },
  { part: grey, material: { name: 'granite', color: 0xb9b6ae, roughness: 0.8 } },
  { part: water, material: { name: 'basin-water', color: 0x6c7d78, roughness: 0.2 } },
  { part: spray, material: { name: 'spray', color: 0xd9dfe0, roughness: 0.6, doubleSided: true, floodlight: () => 0.8 } },
  { part: hedge, material: { name: 'hedge', color: 0x5f7a52, roughness: 0.9 } },
], { bearing: 29, osm: 'node/1332501243', height: 6.5 }, 6500)
