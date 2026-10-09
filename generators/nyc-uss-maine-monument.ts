/**
 * USS Maine National Monument, Merchants' Gate, Central Park (H. Van Buren
 * Magonigle, architect; Attilio Piccirilli, sculptor; 1913) — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-uss-maine-monument.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 76°, so model −y is the front, facing the centre of Columbus
 * Circle (bearing 256° from the monument), with the ship's prow and its
 * figures; +y is the park side. OSM maps the monument as an area,
 * way/608965023 (historic=monument, no building), so `replaces` is empty.
 * The anchor is the pylon's centre as the lidar shows it, ~1 m east-north-east of
 * the OSM area's centroid (that outline sits ~1 m off the lidar).
 *
 * Evidence
 * - Published (Wikipedia; NYC Parks): a pylon with a fountain at its base and
 *   marble groups by Piccirilli; on top the gilded bronze Columbia Triumphant
 *   standing in a seashell chariot drawn by three hippocampi.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m, /tmp/city/nyc/lidar.py.
 *   Plaza 23.9–24.1 m NAVD88 (y = 0). Pylon top 12.4 m over ~5.6 × 4.8 m;
 *   the group's horses 14–15 m, Columbia's raised hand 18.1 m; the side
 *   terraces and their groups 2.5–4.3 m; the prow ~2.6–3.1 m with its
 *   figures to ~4.7 m; the back group to ~6 m.
 * - OSM way/608965023 for the plan: body ~5 m wide with side terraces to
 *   ±4.5 m, the prow reaching ~5 m in front of the body (the basin
 *   way/608965022 wraps it; water is the map's).
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-uss-maine-monument/photos/credits.txt: Peterjr1961
 *   (PD, from above at the front), Beyond My Ken (CC BY-SA 4.0, front),
 *   Mike Peel (CC BY-SA 4.0, prow side), Jim Henderson (CC0, back),
 *   dconvertini (CC BY-SA 2.0, three-quarter), Sharonlflynn (CC BY-SA 4.0,
 *   side), PortableNYCTours (CC BY-SA 4.0, the gilded group).
 *
 * Estimated from the photos against the lidar: the pylon's batter, the
 * frieze/cornice/attic split, the side and back blocks, the prow's hull, and
 * all figure poses, which are simplified to bold masses (the marble groups
 * as robed figures and mounds; the hippocampi as rearing horse foreparts
 * with coiled fish tails). The bronze plaque and inscriptions are left out.
 */
import { Part, type V3 } from './mesh'
import { finishModel, prism, chamferRect } from './nyc-570-lexington'
import { TAU, smooth, solid, tube, ellipsoid, slab, block } from './nyc-columbus-monument'

/** A ring of `n` points on an ellipse at height z. */
export const ell = (x: number, y: number, z: number, rx: number, ry: number, n = 10): V3[] =>
  Array.from({ length: n }, (_, i): V3 => [x + rx * Math.cos(i * TAU / n), y + ry * Math.sin(i * TAU / n), z])

/** A standing robed figure facing −y, feet at c, h tall; `arms` are shoulder-to-hand paths. */
export function robed(p: Part, c: V3, h: number, arms: V3[][], lean = 0) {
  const r = (z: number, rx: number, ry: number) => ell(c[0], c[1] + lean * z * h, c[2] + z * h, rx * h, ry * h)
  solid(p, [r(0, 0.15, 0.12), r(0.45, 0.12, 0.1), r(0.72, 0.12, 0.09), r(0.8, 0.13, 0.085), r(0.84, 0.06, 0.05)])
  ellipsoid(p, [c[0], c[1] + lean * 0.9 * h, c[2] + 0.9 * h], [0.065 * h, 0.07 * h, 0.08 * h], 8, 4)
  for (const a of arms) tube(p, a, a.map((_, i) => (0.045 - i * 0.006) * h), 6)
}

/** A seated or reclining figure as one rounded mass with a head, facing −y. */
export function seated(p: Part, c: V3, w: number, d: number, h: number) {
  // Seat and lap, then the torso rising from the back of the lap to the shoulders.
  solid(p, [ell(c[0], c[1], c[2], w / 2, d / 2), ell(c[0], c[1], c[2] + 0.3 * h, 0.46 * w, 0.46 * d), ell(c[0], c[1] + 0.05 * d, c[2] + 0.4 * h, 0.4 * w, 0.36 * d)])
  solid(p, [ell(c[0], c[1] + 0.15 * d, c[2] + 0.35 * h, 0.3 * w, 0.22 * d), ell(c[0], c[1] + 0.12 * d, c[2] + 0.72 * h, 0.3 * w, 0.2 * d), ell(c[0], c[1] + 0.1 * d, c[2] + 0.8 * h, 0.12 * w, 0.1 * d)])
  ellipsoid(p, [c[0], c[1] + 0.08 * d, c[2] + 0.9 * h], [0.09 * h, 0.09 * h, 0.11 * h], 8, 4)
}

function build() {
  const stone = new Part(), marble = new Part(), gold = new Part(), steps = new Part()

  // --- Base course and steps under the whole monument. ---
  block(steps, -4.75, -3.25, 4.75, 4.0, 0, 0.35, 0.3, 0.08)

  // --- The pylon: a battered shaft, frieze, cornice, attic, sloped cap. ---
  const bx = 2.45, by = 2.1, tx = 2.25, ty = 1.92
  block(stone, -2.78, -2.38, 2.78, 2.38, 0.35, 1.4, 0.12, 0.12)
  smooth(stone, q => solid(q, [chamferRect(-bx, -by, bx, by, 0.12).map(([x, y]) => [x, y, 1.4] as V3), chamferRect(-tx, -ty, tx, ty, 0.12).map(([x, y]) => [x, y, 10.3] as V3)]), 30)
  block(stone, -2.36, -1.99, 2.36, 1.99, 10.3, 11.0, 0.1, 0.05)
  block(stone, -2.62, -2.25, 2.62, 2.25, 11.0, 11.55, 0.12, 0.15)
  block(stone, -2.4, -2.03, 2.4, 2.03, 11.55, 12.25, 0.1, 0.08)
  // The cap slopes up gently from the attic's edge to the group's bed.
  smooth(stone, q => solid(q, [chamferRect(-2.4, -2.03, 2.4, 2.03, 0.1).map(([x, y]) => [x, y, 12.25] as V3), chamferRect(-2.0, -1.65, 2.0, 1.65, 0.1).map(([x, y]) => [x, y, 12.5] as V3)]), 20)

  // --- Side terraces with their seated groups (Courage and Peace, Fortitude
  // and the Feeble), facing out to the sides. ---
  for (const s of [-1, 1]) {
    block(stone, ...(s > 0 ? [2.4, -1.65, 4.5, 1.85] : [-4.5, -1.65, -2.4, 1.85]) as [number, number, number, number], 0.35, 2.55, 0.25, 0.12)
    smooth(marble, q => {
      seated(q, [s * 3.5, 0.1, 2.55], 1.4, 2.6, 1.8)
      robed(q, [s * 3.3, 1.2, 2.55], 1.7, [])
    }, 55)
  }

  // --- Back (park side): a block with the standing group. ---
  block(stone, -1.85, 2.0, 1.85, 3.75, 0.35, 2.55, 0.2, 0.12)
  smooth(marble, q => {
    robed(q, [0, 3.0, 2.55], 2.9, [[[-0.2, 3.0, 4.95], [-0.5, 3.15, 5.5], [-0.55, 3.2, 6.0]]])
    seated(q, [-1.05, 3.05, 2.55], 1.1, 1.2, 1.7)
    seated(q, [1.05, 3.05, 2.55], 1.1, 1.2, 1.7)
  }, 55)

  // --- Front: the stage block and the ship's prow running into the basin. ---
  block(stone, -2.45, -3.05, 2.45, -2.0, 0.35, 2.55, 0.2, 0.12)
  smooth(stone, q => {
    // Hull sections from the stage to the stem: [y, half-beam at deck, half-beam at keel, deck z, keel z].
    const secs: [number, number, number, number, number][] = [[-3.0, 1.45, 0.9, 2.45, 0.35], [-4.4, 1.35, 0.8, 2.45, 0.35], [-5.6, 1.05, 0.55, 2.5, 0.4], [-6.6, 0.6, 0.25, 2.6, 0.6], [-7.3, 0.18, 0.08, 2.75, 0.9]]
    const rings = secs.map(([y, b, k, zd, zk]) => [[-k, y, zk], [k, y, zk], [b, y, zd - 0.6], [b, y, zd], [-b, y, zd], [-b, y, zd - 0.6]] as V3[])
    // Loft runs bow-ward; rings are listed counter-clockwise seen from the bow.
    q.loft(rings.map(r => [...r].reverse()))
    q.cap(rings[0], true)
    q.cap(rings[rings.length - 1].slice().reverse(), true)
    // The stem post rising at the bow.
    tube(q, [[0, -7.25, 2.6], [0, -7.45, 3.05], [0, -7.3, 3.4]], [0.16, 0.13, 0.1], 6)
  }, 40)
  smooth(marble, q => {
    // The boy at the bow, arms raised; the standing figure behind, the seated pair on the deck.
    robed(q, [0, -6.4, 2.6], 1.5, [[[-0.12, -6.4, 3.85], [-0.3, -6.45, 4.25]], [[0.12, -6.4, 3.85], [0.3, -6.45, 4.25]]])
    robed(q, [0, -3.6, 2.45], 2.5, [[[0.3, -3.6, 4.5], [0.55, -3.75, 4.1], [0.6, -3.9, 3.8]]])
    seated(q, [-0.85, -4.4, 2.45], 0.9, 1.1, 1.4)
    seated(q, [0.85, -4.4, 2.45], 0.9, 1.1, 1.4)
  }, 55)

  // --- The gilded group: Columbia Triumphant in her shell chariot, drawn
  // toward the circle by three hippocampi abreast. ---
  smooth(gold, q => {
    const z0 = 12.5
    // A low bronze bed under the group.
    solid(q, [chamferRect(-1.85, -1.55, 1.85, 1.55, 0.3).map(([x, y]) => [x, y, z0] as V3), chamferRect(-1.75, -1.45, 1.75, 1.45, 0.3).map(([x, y]) => [x, y, z0 + 0.25] as V3)])
    const zb = z0 + 0.25
    for (const [hx, hy, yaw, k] of [[-1.25, -0.35, -0.45, 1.45], [0, -0.85, 0, 1.2], [1.25, -0.35, 0.45, 1.45]] as [number, number, number, number][]) hippocampus(q, hx, hy, zb, yaw, k)
    // The scallop shell chariot: a bowl under her and the shell's fan rising behind.
    solid(q, [ell(0, 0.6, zb, 0.7, 0.55), ell(0, 0.6, zb + 0.55, 1.0, 0.8), ell(0, 0.6, zb + 0.8, 1.05, 0.85)])
    slab(q, [0, 1.3, zb + 0.5], [1, 0, 0], [0, -0.25, 1], Array.from({ length: 9 }, (_, i): [number, number] => {
      const a = Math.PI * (0.05 + 0.9 * i / 8)
      return [0.95 * Math.cos(a), 0.25 + 1.35 * Math.sin(a)]
    }).concat([[-0.4, 0], [0.4, 0]] as [number, number][]).sort((a, b) => Math.atan2(a[1] - 0.6, a[0]) - Math.atan2(b[1] - 0.6, b[0])), 0.22)
    // Columbia, standing in the shell, her right arm raised with the branch.
    robed(q, [0, 0.5, zb + 0.75], 3.3, [
      [[-0.38, 0.55, zb + 3.45], [-0.55, 0.45, zb + 4.15], [-0.55, 0.4, zb + 4.95]],
      [[0.38, 0.55, zb + 3.45], [0.6, 0.35, zb + 2.95], [0.7, 0.2, zb + 2.7]],
    ], -0.03)
    ellipsoid(q, [-0.55, 0.4, zb + 5.15], [0.22, 0.12, 0.3], 8, 4)
    // Her robes billowing back and out behind her: a broad mass from hip to shoulder.
    solid(q, [ell(0.1, 0.85, zb + 0.75, 0.75, 0.45), ell(0.15, 0.95, zb + 1.8, 0.8, 0.5), ell(0.2, 0.9, zb + 2.7, 0.62, 0.38), ell(0.15, 0.75, zb + 3.2, 0.3, 0.2)])
  }, 55)

  finishModel('USS Maine National Monument', 'nyc-uss-maine-monument', [
    { part: stone, material: { name: 'granite', color: 0xe2d9cd, roughness: 0.85 } },
    { part: steps, material: { name: 'granite-steps', color: 0xd3cfc6, roughness: 0.85 } },
    { part: marble, material: { name: 'marble', color: 0xeeebe4, roughness: 0.75 } },
    { part: gold, material: { name: 'gilding', color: 0xdcb35a, roughness: 0.45 } },
  ], { bearing: 76, osm: 'way/608965023', height: 18.1 }, 6500)
}

/** A rearing hippocampus facing −y (turned by `yaw`): horse forepart, raised forelegs, coiled fish tail. */
function hippocampus(q: Part, x: number, y: number, z: number, yaw: number, k = 1) {
  const c = Math.cos(yaw), s = Math.sin(yaw)
  const P = (u: number, v: number, w: number): V3 => [x + k * (u * c - v * s), y + k * (u * s + v * c), z + k * w]
  // Chest and body, rising forward.
  tube(q, [P(0, 0.75, 0.35), P(0, 0.25, 0.65), P(0, -0.25, 1.05)], [0.3*k, 0.36*k, 0.32*k], 8)
  // Neck and head, the head high and pitched forward.
  tube(q, [P(0, -0.3, 1.2), P(0, -0.45, 1.65), P(0, -0.5, 1.95)], [0.3*k, 0.25*k, 0.2*k], 8)
  tube(q, [P(0, -0.48, 2.0), P(0, -0.85, 1.85)], [0.2*k, 0.14*k], 6)
  // Forelegs pawing forward.
  for (const k of [-1, 1]) tube(q, [P(k * 0.16, -0.35, 0.9), P(k * 0.18, -0.75, 0.85), P(k * 0.18, -0.85, 0.5)], [0.09*k, 0.08*k, 0.07*k], 5)
  // The fish tail coiling back and up, ending in a fin.
  tube(q, [P(0, 0.75, 0.35), P(0, 1.15, 0.15), P(0, 1.45, 0.45), P(0, 1.35, 0.85)], [0.27*k, 0.2*k, 0.14*k, 0.09*k], 6)
  slab(q, P(0, 1.3, 0.92), [c, s, 0], [0, 0, 1], [[-0.32 * k, 0.25 * k], [0, 0], [0.32 * k, 0.25 * k], [0, 0.1 * k]], 0.06 * k)
}

if (import.meta.main) build()
