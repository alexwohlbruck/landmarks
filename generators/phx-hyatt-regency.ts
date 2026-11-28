/**
 * Hyatt Regency Phoenix (1976, Charles Luckman Associates) — original
 * procedural geometry, CC0-1.0.
 * bun generators/phx-hyatt-regency.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * anchor. Bearing 0: OSM's walls run within 0.3 degrees of north–south.
 * Anchor -112.0718325, 33.4498334, the centroid of OSM way/37057945, the
 * hotel's whole block at 122 N 2nd Street (the hotel's name and POI is
 * node/2470073528, inside it).
 *
 * Identity (from the photos below):
 *  1. The round revolving restaurant (Compass Arizona Grill) on the roof: a
 *     wide disc with a dark glass band, a narrower drum above it, standing
 *     over the slab's east edge on a round glass lift shaft that runs down
 *     the east face.                                        (cazzy, jimmy)
 *  2. A long thin north–south slab of 24 storeys: on the long faces pale
 *     spandrel bands between dark ribbon windows, closed at each end by
 *     tan textured-concrete end walls that rise to the parapet.  (cazzy)
 *  3. The tan concrete end faces with a narrow stack of windows, and the
 *     lower tan wings: a 10-storey east block of rooms and an 18 m podium
 *     on the west with the pool deck.                      (cazzy, jimmy)
 *
 * Plan: OSM way/37057945 and its parts, squared. The slab is part
 * way/209097279, x -16.6..2.0, y -40.4..45.3; the east block part
 * way/209289534 to x 33.6; the podium the rest of the outline west to
 * x -48.5. The drum's parts way/116513539 (r 14) and way/209097288 (r 8.7)
 * are centred at (-0.7, 2.6). The lidar puts every edge about 1.5 m east
 * of OSM; OSM is kept. The small 5 m entrance blocks north and south of
 * the east block follow OSM's outline.
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (2020 flight), 1 m grid;
 * the street round the block 332.1 m, which is y = 0. Measured (model
 * metres): the slab's roof 72.3 and parapet 73.5, its roof boxes 75–76.4;
 * the restaurant disc's roof 83.7 and rim 84.8 at r 13.8; the upper drum's
 * roof 90.4 and rim 91.4 at r 9; the east block 33.3 (parapet 34.5); the
 * podium 16.8 (parapet 18); the entrance blocks 5. OSM's 91/95/97 m drum
 * heights are 6 m too high against the lidar and are not used.
 * Estimated from the photos scaled to those: the disc's underside at 75.5,
 * its glass band 78.5–81.5, the lift shaft's radius (4.5 m), the storey
 * groups (two floors a band, 11 bands), the end walls' width (6 m).
 *
 * Photos (evidence, Wikimedia Commons):
 *  cazzy  "Hyatt Regency Phoenix 2022.jpg", Cazzy82, CC BY-SA 4.0, from
 *         high in the west: the slab's west face, the podium, the drum
 *         https://commons.wikimedia.org/wiki/File:Hyatt_Regency_Phoenix_2022.jpg
 *  jimmy  "HyattRegencyPhoenix.JPG", Jimmybeverage, public domain, from the
 *         south-east at dusk: the lift shaft, the east block, the end walls
 *         https://commons.wikimedia.org/wiki/File:HyattRegencyPhoenix.JPG
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the north end and the podium's west wall are seen only obliquely;
 * their windows are drawn like the south end and the east block. The
 * restaurant's sign panels and the hotel's roof sign are left out. The
 * drum is drawn static (it is the restaurant floor inside that turns).
 *
 * Night: the ribbon windows, the restaurant's glass band and the lift
 * shaft glow (`window`); the upper drum and the disc are floodlit, as in
 * jimmy; the entrances are `entrance`.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { box, ccw, onWall, prism, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { curtain, exposed, type Block } from './phx-chase-tower'

const tan = new Part(), cream = new Part(), win = new Part(), roof = new Part(), door = new Part()

const SLAB: Block = { ring: ccw([[-16.6, -40.4], [2.0, -40.4], [2.0, 45.3], [-16.6, 45.3]]), z0: 0, z1: 73.5 }
const EAST: Block = { ring: ccw([[2.0, -40.0], [33.6, -40.0], [33.6, 45.2], [2.0, 45.2]]), z0: 0, z1: 34.5 }
const WEST: Block = { ring: ccw([[-48.5, -39.1], [-16.6, -39.1], [-16.6, 43.8], [-48.5, 43.8]]), z0: 0, z1: 18 }
const ENT_N: Block = { ring: ccw([[4.0, 45.2], [12.0, 45.2], [12.0, 52.5], [4.0, 52.5]]), z0: 0, z1: 5 }
const ENT_S: Block = { ring: ccw([[4.5, -47.3], [12.3, -47.3], [12.3, -40.0], [4.5, -40.0]]), z0: 0, z1: 5 }
const ALL = [SLAB, EAST, WEST, ENT_N, ENT_S]
const END = 6 // the tan end walls of the slab, along y

// ── Massing ──
// The slab: tan end walls standing 0.4 m proud of the long faces and up to
// the parapet; between them the long faces carry the pale spandrels.
prism(cream, ccw([[-16.2, -40.4 + END], [1.6, -40.4 + END], [1.6, 45.3 - END], [-16.2, 45.3 - END]]), 0, 72.9, roof, 0.3)
for (const [y0, y1] of [[-40.4, -40.4 + END], [45.3 - END, 45.3]]) box(tan, -16.6, 2.0, y0, y1, 0, 73.5, roof, 0.4)
// a parapet lip along the long faces
for (const x of [-16.2, 1.25]) box(tan, x, x + 0.35, -40.4 + END, 45.3 - END, 72.3, 73.5, tan, 0.1)
// roof boxes (lidar 75–76.4)
box(roof, -12, -6.5, 13, 18.5, 72.9, 75, roof, 0.3)
box(roof, -12, -6.5, -15, -9, 72.9, 75, roof, 0.3)
box(roof, -5, 0, -36, -31, 72.9, 76.4, roof, 0.3)

for (const b of [EAST, WEST, ENT_N, ENT_S]) prism(tan, b.ring, 0, b.z1, roof, 0.35)
// parapets: the east block's and the podium's tops are framed in cream (cazzy)
box(cream, 2.3, 33.6, -40.0, -39.4, 33.3, 34.5, cream, 0.15)
box(cream, 2.3, 33.6, 44.6, 45.2, 33.3, 34.5, cream, 0.15)

// ── Windows ──
// The slab's long faces: one ribbon band per two floors, 11 bands over the
// lobby, the spandrels pale between them.
const LOBBY = 6, TOP = 71.4
const ribbon = { group: (TOP - LOBBY) / 11, gap: 2.4, bay: 80, mull: 0, zBase: LOBBY, margin: 0.4, out: 0.06 }
for (const [a, c, zf] of exposed({ ...SLAB, ring: ccw([[-16.2, -34.4], [1.6, -34.4], [1.6, 39.3], [-16.2, 39.3]]) }, ALL.filter((o) => o !== SLAB))) {
  if (Math.abs(a[0] - c[0]) > 0.1) continue // the end faces are tan walls
  curtain(win, a, c, Math.max(zf, LOBBY), TOP, ribbon)
}
// the tan end faces: a stack of windows down the middle, grouped
for (const [a, c, zf] of exposed(SLAB, ALL)) {
  if (Math.abs(a[1] - c[1]) > 0.1) continue
  const L = Math.hypot(c[0] - a[0], c[1] - a[1])
  for (let g = 0; g < 11; g++) {
    const z0 = LOBBY + g * ribbon.group + 1.2, z1 = z0 + ribbon.group - 2.4
    if (z0 < zf) continue
    onWall(win, a, c, rectShape(L / 2 - 2.2, L / 2 + 2.2, z0, z1))
  }
}
// the east block and the podium: punched rooms grouped two floors a panel
for (const b of [EAST, WEST]) {
  for (const [a, c, zf] of exposed(b, ALL)) curtain(win, a, c, Math.max(zf, 4.5), b.z1 - 1.8, { group: b === EAST ? 5.8 : 6.0, gap: 1.6, bay: 4.2, mull: 1.4, zBase: 4.5, margin: 1.2 })
}
// entrances: glazed doors on the entrance blocks and the slab's south end
for (const [a, c] of [...exposed(ENT_N, ALL), ...exposed(ENT_S, ALL)]) {
  const L = Math.hypot(c[0] - a[0], c[1] - a[1])
  if (L > 5) onWall(door, a, c, rectShape(1.2, L - 1.2, 0, 3.4))
}
onWall(door, [2.0, -40.4], [-16.6, -40.4], rectShape(5, 13.6, 0, 4.2))

// ── The revolving restaurant and the lift shaft ──
const C: XY = [-0.7, 2.6], N = 32
// the glass lift shaft down the east face, from the east block's roof
revolve(win, C, [[4.5, 33.3], [4.5, 75.6]], 16, 0, false, false)
revolve(cream, [C[0], C[1]], [[4.5, 32.9], [5.0, 32.9], [5.0, 34.0], [4.5, 34.0]], 16, 0, true, false)
// the disc: a sloping white underside, the dark glass band, a white fascia
// and roof rim
revolve(cream, C, [[4.5, 75.5], [12.6, 76.2], [13.8, 77.6], [13.8, 78.5]], N, 0, false, false)
revolve(win, C, [[13.4, 78.5], [13.4, 81.5]], N, 0, false, false)
revolve(cream, C, [[13.8, 81.5], [13.8, 84.8], [13.2, 84.8], [13.2, 83.7], [9, 83.7]], N, 0, false, false)
cream.cap(Array.from({ length: N }, (_, i) => [C[0] + 13.8 * Math.cos((i / N) * Math.PI * 2), C[1] + 13.8 * Math.sin((i / N) * Math.PI * 2), 81.5] as [number, number, number]), false)
// the upper drum and its rim
revolve(cream, C, [[9, 83.7], [9, 91.4], [8.5, 91.4], [8.5, 90.4], [0, 90.4]], N, 0, false, false)
// a panel of windows on the upper drum's west side (cazzy)
for (let i = -2; i <= 2; i++) {
  const a0 = Math.PI + (i - 0.45) * 0.13, a1 = Math.PI + (i + 0.45) * 0.13
  onWall(win, [C[0] + 9 * Math.cos(a1), C[1] + 9 * Math.sin(a1)], [C[0] + 9 * Math.cos(a0), C[1] + 9 * Math.sin(a0)], rectShape(0, 9 * 0.117, 85.2, 89.6), 0.08)
}

const flood = (p: [number, number, number]) => (p[2] > 75 ? 0.8 : 0)
await save('phx-hyatt-regency', 'Hyatt Regency Phoenix', [
  { part: tan, material: finish('hyatt-concrete', 0xc4ab95) },
  { part: cream, material: { ...finish('hyatt-spandrel', 0xeee7dc), floodlight: (p) => flood(p) } },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: door, material: PALETTE.entrance },
], { height: 91.4, anchor: [33.4498334, -112.0718325], bearing: 0 })
