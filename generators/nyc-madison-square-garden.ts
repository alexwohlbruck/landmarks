/**
 * Madison Square Garden — procedural, CC0-1.0, no textures.
 * bun generators/nyc-madison-square-garden.ts
 *
 * Map frame: x = model east (Seventh Avenue), y = model north (West 33rd
 * Street), z up, metres. Placed at bearing 29°, the Manhattan grid. Anchor:
 * area centroid of the OSM outline way/138141251.
 *
 * The round drum of tan precast piers, a white rim round the cable roof,
 * and the glass and panel blocks that wrap its corners and avenue fronts
 * (the Chase Square glass front on Seventh Avenue, the stair and office
 * blocks at the corners, the lower Eighth Avenue front). Two Penn Plaza,
 * the office tower on the Seventh Avenue side, is a separate OSM building
 * (way/35938543) outside this outline and is not part of the model.
 *
 * Evidence
 * - OSM way/138141251 (outline) and parts 138141255 (the drum, a circle of
 *   radius 64.2 m centred at x 2.8, y −0.1 here, 45 m), 283108463–72 and
 *   283108476 (the wrap-round blocks, 23–45 m).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), resampled in the model frame
 *   (/tmp/city/nyc/work/nyc-madison-square-garden/rot.png). Street ≈ 11 m
 *   NAVD88. Measured above it: the drum's rim 46.5 m, the roof inside it
 *   43.5–44.5 m; the corner blocks 37.5 m (NE, SE, NW, SW outer) and 29 m
 *   (the west corners); the Seventh Avenue front 37 m; the Eighth Avenue
 *   front 26.5 m, with a strip along the avenue at about 20 m (OSM says
 *   23 m; the lidar is used).
 * - Published: opened 1968, Charles Luckman Associates; 2011–13 renovation
 *   with the Chase Square entrance (Wikipedia). Cable-suspended roof 404 ft
 *   (123 m) across.
 * - Photos (Wikimedia Commons, daylight, from Seventh Avenue, Eighth Avenue
 *   and 33rd Street, the entrances):
 *   /tmp/city/nyc/work/nyc-madison-square-garden/photos/credits.txt.
 *
 * Estimated: the number of piers (64 bays) and the slot width, the glazed
 * base band (9 m) round the drum, the rim's depth, the glazing rhythm of
 * the wrap-round blocks. The roof's central ring (10 m across) is estimated
 * from aerial views; the outrigger posts on the rim and the signs are left
 * out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, capPoly, type XY } from './nyc-570-lexington'
import { volume, at, type Bays } from './nyc-30-hudson-yards'

const pier = new Part(), slot = new Part(), rim = new Part(), roof = new Part(), win = new Part(), panel = new Part()

const CX = 2.84, CY = -0.11, R = 64.2
const BASE = 9, WALL = 43.2, TOP = 46.5, ROOF = 44.0
const N = 64, PIER = 0.66, RECESS = 0.8

const P = (a: number, r: number, z: number): V3 => [CX + r * Math.cos(a), CY + r * Math.sin(a), z]
const n2 = (a: number): V3 => [Math.cos(a), Math.sin(a), 0]

// Drum: a glazed base band, then tan piers with dark recessed slots between.
for (let k = 0; k < N; k++) {
  const a0 = (k / N) * 2 * Math.PI, a1 = ((k + 1) / N) * 2 * Math.PI
  const am = a0 + (a1 - a0) * PIER
  // Base band: panel backing and a window panel.
  panel.quad(P(a0, R, 0), P(a1, R, 0), P(a1, R, BASE), P(a0, R, BASE))
  const w0 = a0 + (a1 - a0) * 0.08, w1 = a1 - (a1 - a0) * 0.08
  win.quad(P(w0, R + 0.06, 0.6), P(w1, R + 0.06, 0.6), P(w1, R + 0.06, BASE - 1.6), P(w0, R + 0.06, BASE - 1.6))
  // Pier: the outer face, smooth-shaded round the drum.
  const tri = (p: Part, a: V3, b: V3, c: V3, na: V3, nb: V3, nc: V3) => p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
  tri(pier, P(a0, R, BASE), P(am, R, BASE), P(am, R, WALL), n2(a0), n2(am), n2(am))
  tri(pier, P(a0, R, BASE), P(am, R, WALL), P(a0, R, WALL), n2(a0), n2(am), n2(a0))
  // Slot: recessed, with its two cheeks.
  const r1 = R - RECESS
  slot.quad(P(am, r1, BASE), P(a1, r1, BASE), P(a1, r1, WALL), P(am, r1, WALL))
  slot.quad(P(am, R, BASE), P(am, r1, BASE), P(am, r1, WALL), P(am, R, WALL))
  slot.quad(P(a1, r1, BASE), P(a1, R, BASE), P(a1, R, WALL), P(a1, r1, WALL))
  // The ledge over the base band, under the slot.
  slot.quad(P(am, r1, BASE), P(am, R, BASE), P(a1, R, BASE), P(a1, r1, BASE))
}

// Rim: a white band standing a little proud of the piers, over a coping
// onto the roof, 48 segments so it reads round.
const M = 48
for (let k = 0; k < M; k++) {
  const a0 = (k / M) * 2 * Math.PI, a1 = ((k + 1) / M) * 2 * Math.PI
  const ro = R + 0.5, ri = R - 1.6
  rim.tri(P(a0, ro, WALL), P(a1, ro, WALL), P(a1, ro, TOP), undefined, undefined, undefined, [n2(a0), n2(a1), n2(a1)])
  rim.tri(P(a0, ro, WALL), P(a1, ro, TOP), P(a0, ro, TOP), undefined, undefined, undefined, [n2(a0), n2(a1), n2(a0)])
  rim.quad(P(a0, ro, WALL), P(a0, R - 0.4, WALL), P(a1, R - 0.4, WALL), P(a1, ro, WALL)) // soffit
  rim.quad(P(a0, ri, TOP), P(a0, ro, TOP), P(a1, ro, TOP), P(a1, ri, TOP))
  rim.quad(P(a1, ri, ROOF), P(a0, ri, ROOF), P(a0, ri, TOP), P(a1, ri, TOP)) // inner face
  roof.tri([CX, CY, ROOF], P(a0, ri, ROOF), P(a1, ri, ROOF))
}

// The cable roof's central tension ring: a low drum at the centre of the
// roof (estimated 10 m across, 1.8 m high).
for (let k = 0; k < 16; k++) {
  const a0 = (k / 16) * 2 * Math.PI, a1 = ((k + 1) / 16) * 2 * Math.PI, h = ROOF + 1.8
  rim.tri(P(a0, 5, ROOF), P(a1, 5, ROOF), P(a1, 5, h), undefined, undefined, undefined, [n2(a0), n2(a1), n2(a1)])
  rim.tri(P(a0, 5, ROOF), P(a1, 5, h), P(a0, 5, h), undefined, undefined, undefined, [n2(a0), n2(a1), n2(a0)])
  rim.tri([CX, CY, h], P(a0, 5, h), P(a1, 5, h))
}

// The wrap-round blocks, from OSM's parts (heights from the lidar).
const blocks: [number, XY[]][] = [
  [20, [[-70.2, -34.7], [-61.8, -34.8], [-64.0, -29.2], [-65.8, -24.0], [-67.0, -19.9], [-68.1, -14.6], [-69.1, -8.5], [-69.4, -1.3], [-69.3, 5.7], [-68.4, 12.4], [-67.6, 17.4], [-66.7, 21.1], [-65.7, 25.0], [-63.8, 30.2], [-61.5, 35.2], [-70.2, 35.0], [-70.0, 26.2], [-71.0, 19.5], [-71.7, 12.9], [-72.0, 5.3], [-72.1, -3.1], [-72.0, -8.8], [-71.6, -14.5], [-71.0, -20.2], [-70.2, -25.7]]],
  [26.5, [[-57.3, -23.3], [-58.6, -19.7], [-60.5, -12.0], [-61.4, -4.2], [-61.4, 3.6], [-60.4, 11.5], [-58.3, 19.5], [-66.7, 21.1], [-67.6, 17.4], [-68.4, 12.4], [-69.3, 5.7], [-69.4, -1.3], [-69.1, -8.5], [-68.1, -14.6], [-67.0, -19.9], [-65.8, -24.0]]],
  [37, [[61.5, -26.1], [70.0, -29.5], [71.0, -26.7], [71.7, -23.9], [68.2, -22.6], [69.8, -18.0], [70.7, -14.0], [71.3, -10.5], [71.8, -7.3], [72.1, -3.9], [72.3, -0.8], [72.3, 2.2], [72.1, 5.1], [71.7, 8.9], [71.2, 12.8], [70.0, 17.9], [68.2, 23.3], [72.0, 24.6], [69.9, 30.3], [61.8, 25.9], [64.4, 19.0], [66.3, 11.0], [67.1, 4.2], [67.2, -1.8], [66.5, -8.9], [65.1, -15.9], [63.0, -22.6]]],
  [40, [[60.0, 29.6], [61.8, 25.9], [69.9, 30.3], [67.9, 33.9]]],
  [40, [[68.0, -33.5], [70.0, -29.5], [61.5, -26.1], [59.9, -29.5]]],
  [37.5, [[50.5, 55.3], [47.5, 57.3], [39.4, 52.9], [45.2, 48.4], [50.6, 43.1], [55.7, 36.8], [59.9, 45.2], [57.1, 49.1], [54.4, 51.9], [54.0, 52.3], [51.6, 54.3]]],
  [37.5, [[55.3, -37.0], [50.5, -42.9], [44.6, -48.7], [39.1, -52.9], [47.5, -56.6], [52.0, -53.2], [53.8, -51.3], [55.9, -49.2], [56.2, -48.9], [59.8, -44.5]]],
  [37.5, [[-42.5, -57.3], [-43.9, -56.1], [-47.5, -52.7], [-49.1, -51.1], [-51.1, -48.9], [-53.6, -46.1], [-54.8, -44.7], [-50.3, -36.6], [-47.6, -40.2], [-42.4, -46.0], [-34.4, -52.6]]],
  [29, [[-57.3, -23.3], [-65.8, -24.0], [-64.0, -29.2], [-61.8, -34.8], [-60.5, -37.0], [-59.0, -39.1], [-57.3, -41.6], [-54.8, -44.7], [-50.3, -36.6], [-52.1, -33.8], [-55.8, -26.9]]],
  [29, [[-54.4, 45.1], [-56.9, 42.0], [-58.4, 39.9], [-59.3, 38.7], [-61.5, 35.2], [-63.8, 30.2], [-65.7, 25.0], [-66.7, 21.1], [-58.3, 19.5], [-55.9, 25.6], [-52.9, 31.6], [-49.8, 36.5]]],
  [37.5, [[-33.2, 52.8], [-42.2, 56.9], [-43.4, 55.9], [-44.5, 55.0], [-47.3, 52.5], [-50.5, 49.4], [-52.9, 46.8], [-53.3, 46.3], [-54.4, 45.1], [-49.8, 36.5], [-45.2, 42.2], [-39.4, 48.0]]],
]
const ccw = (r: XY[]) => { let s = 0; for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; s += a[0] * b[1] - b[0] * a[1] } return s > 0 ? r : [...r].reverse() }
const glazing: Bays = { bay: 4.2, pier: 0.8, row: 8.4, brk: 1.4, foot: 1.2, head: 1.6, minWidth: 2.5 }
for (const [h, ring] of blocks) {
  const r = ccw(ring)
  volume([at(r, 0), at(r, h)], panel, (_, i) => {
    const a = r[i], b = r[(i + 1) % r.length]
    const mx = (a[0] + b[0]) / 2 - CX, my = (a[1] + b[1]) / 2 - CY
    return Math.hypot(mx, my) < R + 0.8 ? null : [win, glazing] // faces against the drum stay plain
  }, null)
  capPoly(roof, r, h)
}

finishModel('Madison Square Garden', 'nyc-madison-square-garden', [
  { part: pier, material: finish('msg-precast', 0xd8c3a3) },
  { part: slot, material: finish('msg-slot', 0x8f8270) },
  { part: rim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: panel, material: finish('msg-panel', 0xc7c6c0) },
], { bearing: 29, osm: 'way/138141251', height: TOP })
