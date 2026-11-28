/**
 * Basilica of the National Shrine of the Little Flower, 1715 North Zarzamora
 * Street, San Antonio, Texas (1929-1931, Spanish Baroque / Romanesque
 * Revival, Leo M. J. Dielmann). A cream-grey limestone church facing EAST: a
 * gabled centre with a big arched window over three arched doors, between
 * two UNEQUAL towers: the taller south tower rises through two arcaded
 * belfry stages to a drum and a gold-tiled dome with a cross; the shorter
 * north tower has one belfry stage and a gold-tiled dome carrying a statue
 * of St. Thérèse. Behind: the nave under a low pitched roof, a crossing dome (drawn in the roof grey: no photo shows its covering),
 * the transept, a south chapel with its round apse. Original procedural
 * geometry, CC0-1.0.   bun generators/sat-little-flower-basilica.ts
 *
 * Frame: bearing 6.6 (the OSM outline is square to 0.1 m in it). x runs
 * along the church towards the front (east), y is the model's north, z up,
 * metres. Drawn about the lidar grid's centre (-98.52546, 29.44606), shifted
 * by (1.36, -2.65) so the origin is the area centroid of OSM way/521482347
 * (-98.525471, 29.446085).
 *
 * Ground: the streets round the church are flat (lidar 2.8-3.0 over its
 * ground_min), but the map's terrain (Mapterhorn) has a hollow under the
 * nave 2.5-3 m below them, and the front stands on a raised porch and
 * steps that the terrain already shows (4.5-5 m over that low point, just
 * outside the OSM outline). The map puts y = 0 in the hollow, so the model is
 * drawn with heights over the street (lidar less 2.9) and lifted 2.7 m, the
 * walls running down to y = 0; the doors and front openings start at the
 * porch, 2.4 m over the street. The porch and steps are left to the terrain.
 * Elevation 0.
 *
 * Evidence
 * - OSM way/521482347 (building=basilica): in the frame, the front x 27.0
 *   between y -8.3 and 14.9; the towers x 21.4..27; the nave x -3..21.4,
 *   y -6.3..13.6; the sanctuary to x -26.8, wider (y -10.7..16.1), with the
 *   south chapel's round apse centred (-9.8, -10.7), r 5.2. The adjoining
 *   way/1252079748 (to the south-west) is a separate building, left out.
 * - USGS 3DEP lidar USGS_LPC_TX_Central_B2_2017_LAS_2019 (2017), 0.5 m grid
 *   (~/landmarks-scratch/satx/work/sat-little-flower-basilica/lidar.json),
 *   less 2.9: the nave roof from about 15.8 at the walls to 19.3 on y 3.6;
 *   the crossing dome centred (-9.5, 3.6), about 6 m across, to 27.5; the
 *   south tower x 23..27, y -8..-3, to 34 (dome) and higher returns 36.5
 *   (cross); the north tower x 22..27, y 9..14.9, to 26.2 (dome); the south
 *   chapel 13-15.
 * - Photos (Wikimedia Commons), EVIDENCE:
 *   "Basilica of the Little Flower in San Antonio.jpg" (Michaelluckey, CC BY
 *     4.0): the east front square on, scaled at 33 px/m from its width, heights
 *     over the porch (2.4 m over the street) and checked against the lidar
 *     tops: the south tower's shaft 5.4 m wide to 20, open belfry stages
 *     4.4 m wide to 25.4 and 3.4 m to 29, an octagonal lantern to 32.4, dome
 *     to 34.7, cross 36.5; the north tower's shaft to 20, belfry 4.6 m to
 *     24.6, dome to 26.8, statue to 30.4; the gable's crest 19.4 (56% of the
 *     tall tower, as the photo has it); the
 *     window and doors as drawn;
 *   "Church of the Little Flower Basilica.JPG" (Peacehood, CC BY-SA 3.0):
 *     the front from the south-east, both domes' gold tiles.
 *
 * Estimated: the sides and the west end (no photo), the crossing dome's
 * form (from lidar only), the transept. Bolder than real: the belfry
 * openings, the statue.
 *
 * Night: the front and towers floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, lathe, report, writeGlb, type XY } from './sf-de-young'
import { shift } from './sf-opera-house'
import { onWall, rectPts, roundPts, block, cross3 } from './sat-san-fernando-cathedral'

const stone = new Part(), trim = new Part(), roof = new Part(), gold = new Part(), win = new Part(), door = new Part()
const E: XY = [1, 0], N: XY = [0, 1], S: XY = [0, -1]
const sE = (y: number) => y, sN = (x: number) => -x, sS = (x: number) => x
const XF = 27.0, NY0 = -6.3, NY1 = 13.6, YR = 3.6, WALL = 15.6, RIDGE = 19.3

// ---- the nave and sanctuary under one low pitched roof (along x) ----
block(stone, -26.8, 21.4, NY0, NY1, 0, WALL, 0, null)
roof.quad([-27.1, NY0 - 0.3, WALL - 0.1], [21.4, NY0 - 0.3, WALL - 0.1], [21.4, YR, RIDGE], [-27.1, YR, RIDGE])
roof.quad([21.4, NY1 + 0.3, WALL - 0.1], [-27.1, NY1 + 0.3, WALL - 0.1], [-27.1, YR, RIDGE], [21.4, YR, RIDGE])
stone.tri([-26.8, NY0, WALL], [-26.8, YR, RIDGE], [-26.8, NY1, WALL])
// the north transept, the low rooms at the west corners, the south chapel and its apse
block(stone, -17.0, -3.1, NY1, 16.1, 0, 15.0, 0.12, roof)
block(stone, -26.8, -15.0, -10.7, NY0, 0, 10.0, 0.12, roof)
block(stone, -26.8, -17.0, NY1, 14.7, 0, 10.0, 0.12, roof)
block(stone, -15.0, -4.6, -10.7, NY0, 0, 13.6, 0.12, roof)
{
  const ring: XY[] = []
  for (let i = 0; i <= 8; i++) { const a = Math.PI + (Math.PI * i) / 8; ring.push([-9.8 + 5.2 * Math.cos(a), -10.7 + 5.2 * Math.sin(a)]) }
  prism(stone, ring, 0, 12.8, roof)
}
// tall round-headed windows along the nave
for (const x of [0, 5.5, 11, 16.5, -21]) {
  onWall(win, [0, NY0], S, roundPts(sS(x), 1.8, 7.0, 13.6, 6), 0.06)
  onWall(win, [0, NY1], N, roundPts(sN(x), 1.8, 7.0, 13.6, 6), 0.06)
}
// the crossing dome on a drum (lidar: 6 m across, to 27.5)
{
  const cx = -9.5, cy = YR
  lathe(roof, [[3.2, RIDGE - 1.0], [3.2, 23.0], [3.4, 23.2], [3.4, 23.6]], 16, [cx, cy])
  const prof: [number, number][] = []
  for (let i = 0; i <= 6; i++) { const a = (Math.PI / 2) * (i / 6); prof.push([Math.max(0.4, 3.0 * Math.cos(a)), 23.6 + 3.0 * Math.sin(a)]) }
  lathe(roof, prof, 16, [cx, cy])
  lathe(trim, [[0.4, 26.5], [0.5, 27.1], [0, 27.5]], 8, [cx, cy])
}

// ---- the east front (heights over the street; the porch is 2.4 up) ----
const P0 = 2.4
const MY0 = -2.6, MY1 = 9.2, MC = (MY0 + MY1) / 2
block(stone, 21.4, XF, MY0, MY1, 0, 17.4, 0, roof)
// the stepped gable over the centre, with a cross
const G0 = 17.4, GT = 19.4 // the crest at 56% of the tall tower, as in the photo
const gable = (sgn: number): XY[] => [[sgn * MY0, G0], [sgn * MY1, G0], [sgn * MY1 - sgn * 1.6, G0 + 0.6], [sgn * MC + sgn * 1.4, GT - 0.6], [sgn * MC + sgn * 0.7, GT], [sgn * MC - sgn * 0.7, GT], [sgn * MC - sgn * 1.4, GT - 0.6], [sgn * MY0 + sgn * 1.6, G0 + 0.6]]
onWall(stone, [XF, 0], E, gable(1), 0)
onWall(stone, [XF - 1.0, 0], [-1, 0], gable(-1), 0)
cross3(trim, XF - 0.5, MC, GT, 1.3, 0.16)
// the great window: an arched frame with three lights, a row of lower lights
onWall(trim, [XF, 0], E, roundPts(sE(MC), 6.6, P0 + 5.0, P0 + 13.2, 10), 0.03)
onWall(win, [XF, 0], E, roundPts(sE(MC), 2.2, P0 + 7.6, P0 + 12.6, 6), 0.06)
for (const d of [-2.0, 2.0]) onWall(win, [XF, 0], E, rectPts(sE(MC) + d - 0.8, sE(MC) + d + 0.8, P0 + 7.6, P0 + 11.6), 0.06)
for (const d of [-2.0, 0, 2.0]) onWall(win, [XF, 0], E, rectPts(sE(MC) + d - 0.8, sE(MC) + d + 0.8, P0 + 5.6, P0 + 7.1), 0.06)
block(trim, XF, XF + 0.4, MY0, MY1, P0 + 4.4, P0 + 4.9, 0.05)
// three arched doors in a shallow arcade, at the porch's level
for (const d of [-3.6, 0, 3.6]) {
  onWall(trim, [XF, 0], E, roundPts(sE(MC + d), 3.0, P0, P0 + 4.6, 8), 0.04)
  onWall(door, [XF, 0], E, roundPts(sE(MC + d), 2.2, P0, P0 + 4.0, 8), 0.07)
}

function belfryFaces(cx: number, cy: number, h: number, z0: number, z1: number, w: number) {
  for (const [at, n, s] of [[[cx + h, 0], E, cy], [[cx - h, 0], [-1, 0], -cy], [[0, cy + h], N, sN(cx)], [[0, cy - h], S, sS(cx)]] as [XY, XY, number][]) {
    onWall(win, at, n, roundPts(s, w, z0, z1, 6), 0.06)
  }
}
// the south tower (photo, 34 px/m across the front, review): a 5.4 m shaft
// to 20, then two open belfry stages stepping in (4.4 m to 25.4, 3.4 m to
// 29.0), an octagonal lantern to 32.4, the gold dome to 34.7 and the cross
{
  const cx = 24.2, cy = -5.45, h = 2.7
  block(stone, cx - h, cx + h, cy - h, cy + h, 0, 20.0, 0, null)
  block(trim, cx - h - 0.25, cx + h + 0.25, cy - h - 0.25, cy + h + 0.25, 19.5, 20.2, 0.1)
  block(stone, cx - 2.2, cx + 2.2, cy - 2.2, cy + 2.2, 20.2, 25.4, 0, null)
  belfryFaces(cx, cy, 2.2, 20.8, 25.0, 1.9)
  for (const [px, py] of [[cx - 2.2, cy - 2.2], [cx + 2.2, cy - 2.2], [cx + 2.2, cy + 2.2], [cx - 2.2, cy + 2.2]]) block(trim, px - 0.3, px + 0.3, py - 0.3, py + 0.3, 20.2, 25.9, 0.05)
  block(trim, cx - 2.4, cx + 2.4, cy - 2.4, cy + 2.4, 25.4, 25.9, 0.1)
  block(stone, cx - 1.7, cx + 1.7, cy - 1.7, cy + 1.7, 25.9, 29.0, 0, null)
  belfryFaces(cx, cy, 1.7, 26.3, 28.7, 1.5)
  block(trim, cx - 1.85, cx + 1.85, cy - 1.85, cy + 1.85, 29.0, 29.4, 0.08)
  lathe(stone, [[1.45, 29.4], [1.45, 32.2], [1.6, 32.4]], 8, [cx, cy], Math.PI / 8, false)
  for (let k = 0; k < 8; k++) {
    const a = Math.PI / 8 + (Math.PI / 4) * (k + 0.5), n: XY = [Math.cos(a), Math.sin(a)]
    onWall(win, [cx, cy], n, roundPts(0, 0.6, 29.9, 31.8, 4), 1.45 * Math.cos(Math.PI / 8) + 0.03)
  }
  const prof: [number, number][] = []
  for (let i = 0; i <= 6; i++) { const a = (Math.PI / 2) * (i / 6); prof.push([Math.max(0.25, 1.6 * Math.cos(a)), 32.4 + 2.3 * Math.sin(a)]) }
  lathe(gold, prof, 12, [cx, cy])
  cross3(trim, cx, cy, 34.6, 1.9, 0.18)
  onWall(win, [cx + h, 0], E, rectPts(sE(cy) - 0.35, sE(cy) + 0.35, 14.5, 16.5), 0.06)
  onWall(win, [cx + h, 0], E, rectPts(sE(cy) - 0.35, sE(cy) + 0.35, 7.0, 9.0), 0.06)
}
// the north tower: a 5.4 m shaft to 20, one open belfry stage (4.6 m) to
// 24.6, the gold dome to 26.8, a small lantern, the statue to 30.4
{
  const cx = 24.2, cy = 12.05, h = 2.7
  block(stone, cx - h, cx + h, cy - h, cy + h, 0, 20.0, 0, null)
  block(trim, cx - h - 0.25, cx + h + 0.25, cy - h - 0.25, cy + h + 0.25, 19.5, 20.2, 0.1)
  block(stone, cx - 2.3, cx + 2.3, cy - 2.3, cy + 2.3, 20.2, 24.6, 0, null)
  belfryFaces(cx, cy, 2.3, 20.8, 24.2, 1.8)
  for (const [px, py] of [[cx - 2.3, cy - 2.3], [cx + 2.3, cy - 2.3], [cx + 2.3, cy + 2.3], [cx - 2.3, cy + 2.3]]) block(trim, px - 0.3, px + 0.3, py - 0.3, py + 0.3, 20.2, 25.0, 0.05)
  const prof: [number, number][] = []
  for (let i = 0; i <= 6; i++) { const a = (Math.PI / 2) * (i / 6); prof.push([Math.max(0.5, 2.3 * Math.cos(a)), 24.6 + 2.2 * Math.sin(a)]) }
  lathe(gold, prof, 12, [cx, cy])
  lathe(stone, [[0.6, 26.7], [0.6, 28.0], [0.8, 28.2]], 8, [cx, cy])
  block(trim, cx - 0.4, cx + 0.4, cy - 0.35, cy + 0.35, 28.2, 30.4, 0.15) // the statue
  onWall(win, [cx + h, 0], E, rectPts(sE(cy) - 0.35, sE(cy) + 0.35, 14.0, 16.0), 0.06)
  onWall(win, [cx + h, 0], E, rectPts(sE(cy) - 0.35, sE(cy) + 0.35, 7.0, 9.0), 0.06)
}

// ---------------------------------------------------------------------------
const all = [stone, trim, roof, gold, win, door]
// lift everything above the base by G (see Ground); the walls run down to y = 0
const G = 2.7
for (const p of all) for (let i = 1; i < p.pos.length; i += 3) if (p.pos[i] > 0.001) p.pos[i] += G
shift(all, 1.36, -2.65)
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : p[0] > 20 ? 0.85 : 0.2)
const parts = [
  { part: stone, material: { ...finish('littleflower-limestone', 0xb9b6ae), floodlight: lit } },
  { part: trim, material: { ...finish('littleflower-carved-stone', 0xd6d3ca), floodlight: lit } },
  { part: roof, material: { ...PALETTE.roof, color: 0xa8aca9 } },
  { part: gold, material: { ...finish('littleflower-gold-tile', 0xd8b064), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('littleflower-door', 0x5b4638) },
]
const glb = writeGlb('Basilica of the Little Flower', parts, {
  license: 'CC0-1.0', bearing: 6.6, elevation: 0, anchor: [29.446085, -98.525471],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/521482347'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('Basilica of the Little Flower', parts, glb, 5000)
const out = new URL('../models/sat-little-flower-basilica.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
