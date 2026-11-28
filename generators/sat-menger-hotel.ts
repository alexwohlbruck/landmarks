/**
 * The Menger Hotel, 204 Alamo Plaza, San Antonio, Texas: the hotel's own
 * buildings round its two courts, as OSM maps them (relation/1204761). On
 * the plaza, at the south end of the west front, the 1859 hotel by John M.
 * Fries: three storeys of cream limestone with a pedimented centre bay, iron
 * balconies on the upper floors, a red-tiled hood and the green iron canopy
 * along the sidewalk. North of it the 1909 extension in the same height and
 * colour, and round the block the later wings (1950s) a storey higher; the
 * open patio garden and a second, lower court inside.
 * Original procedural geometry, CC0-1.0.   bun generators/sat-menger-hotel.ts
 *
 * Frame: bearing 17 (the west front runs at 17 degrees). x east-ish, y
 * north-ish, z up, metres. Drawn about the lidar grid's centre (-98.48602,
 * 29.42468), shifted by (-3.60, 1.92) so the origin is the area centroid of
 * the outer way/80186437 (-98.485990, 29.424654).
 *
 * Ground: flat (Mapterhorn 0.3-1.2 m; lidar ground 0.4-0.7); heights below
 * are lidar less 0.5. Elevation 0.
 *
 * Neighbours: the Alamo (sat-alamo, way/92060042) stands 120 m north; the
 * Rivercenter buildings adjoin to the south and east. The model stays inside
 * the Menger's own outline (the sidewalk canopy, 2.6 m deep, the balconies
 * and the pedimented bay, 0.8 m proud, are the only things over the plaza).
 *
 * Evidence
 * - OSM relation/1204761 (building, levels 3, Q6816982): the outer way
 *   80186437 (the west front x -47.9, y -37.7..27.7; the slanting north
 *   side; the east side; the south side y -37.7) and two inner courts,
 *   ways 80187317 (the patio, x -22.5..-1.4, y -25.3..4.9) and 80187316.
 * - USGS 3DEP lidar USGS_LPC_TX_Central_B2_2017_LAS_2019 (2017), 1 m grid
 *   (~/landmarks-scratch/satx/work/sat-menger-hotel/lidar.json), less 0.5:
 *   the west range and the north-west wing 14.1; a low range inside the
 *   west range 4.8; the middle range between the courts 13.8; the north
 *   range east of x -12, the east block and the south range 17.1-17.8; the
 *   east court's low buildings 3.3-4.3.
 * - Published: Wikipedia "Menger Hotel" (1859, John M. Fries; additions
 *   1909, 1950s).
 * - Photos (Wikimedia Commons), EVIDENCE:
 *   "202 Alamo Plaza.jpg" (Dat Lien, CC BY-SA 4.0): the 1859 front square on,
 *   scaled at 39 px/m from the lidar cornice: 20.7 m wide, the pediment to
 *   17, the balconies at 4.2 and 9.0, the canopy at 3.6-4.2, the red-tiled
 *   hood over the centre bay, the 1909 wing to its north;
 *   "Menger Hotel, San Antonio, Texas (50295947263).jpg" (Nicolas Henderson,
 *     CC BY 2.0): the plain white later wings from the Alamo's garden, their
 *     punched windows and parapet.
 *
 * Estimated: the internal divisions between ranges (from the lidar steps);
 * the window rhythm of the later wings (two storeys to a panel); the canopy
 * posts. Not modelled: the courtyard planting, signs and awnings.
 *
 * Night: the 1859 front floodlit; the windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, report, writeGlb, type XY } from './sf-de-young'
import { shift } from './sf-opera-house'
import { onWall, rectPts, roundPts, block } from './sat-san-fernando-cathedral'

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), iron = new Part(), tile = new Part()
const ny = (x: number) => 27.7 + (x + 47.1) * 0.1483 // the slanting north side
const ex = (y: number) => 57.5 - (y + 36.7) * 0.155 // the slanting east side
const XF = -47.9, YS = -37.7

/** A range: walls to z, a parapet coping, a flat roof. */
function range(r: XY[], z: number) {
  prism(stone, r, 0, z - 0.6, null)
  prism(trim, r, z - 0.6, z, roof, 0.12)
}
// the west range (1859 and 1909) along the plaza
range([[XF, YS], [-30, YS], [-30, ny(-30)], [XF, ny(XF)]], 14.1)
// the low range inside it, round the patio's west side
range([[-30, -25.3], [-22.5, -25.3], [-22.5, 12], [-3, 12], [-3, 20], [-30, 20]], 4.8)
// the north-west wing
range([[-30, 20], [-12, 20], [-12, ny(-12)], [-30, ny(-30)]], 14.1)
// the middle range between the courts, and its west arm north of the patio
range([[-3, -25.3], [12, -25.3], [12, 20], [-3, 20]], 13.8)
range([[-22.5, 4.9], [-3, 4.9], [-3, 12], [-22.5, 12]], 13.8)
// the north range east of x -12, the east block, the south range (later wings, a storey higher)
range([[-12, 19.2], [12, 19.2], [12, 18.7], [40, 18.7], [ex(18.7), 18.7], [ex(ny(45.3)), ny(45.3)], [-12, ny(-12)]], 17.1)
range([[40, -25.3], [ex(-25.3), -25.3], [ex(18.7), 18.7], [40, 18.7]], 17.1)
range([[-30, YS], [ex(YS), YS], [ex(-25.3), -25.3], [-30, -25.3]], 17.6)
// the east court's low buildings along its south side
range([[12, -25.3], [40, -25.3], [40, -13], [12, -13]], 3.8)

// ---- the 1859 front on the plaza: y -37.7..-17, facing -x ----
const W: XY = [-1, 0]
const sW = (y: number) => -y
{
  const y0 = YS, y1 = -17.0, yc = (y0 + y1) / 2
  // pedimented centre bay, standing a little proud and higher
  block(stone, XF - 0.8, XF, yc - 4.1, yc + 4.1, 0, 14.6, 0, null)
  block(trim, XF - 1.1, XF, yc - 4.3, yc + 4.3, 13.6, 14.6, 0.1, trim)
  {
    const x0 = XF - 1.1, x1 = XF + 1.5, P = (x: number, y: number, z: number): V3 => [x, y, z]
    stone.tri(P(x0 + 0.2, yc - 4.1, 14.6), P(x0 + 0.2, yc, 17.0), P(x0 + 0.2, yc + 4.1, 14.6))
    roof.quad(P(x1, yc - 4.3, 14.6), P(x1, yc, 17.2), P(x0, yc, 17.2), P(x0, yc - 4.3, 14.6))
    roof.quad(P(x1, yc, 17.2), P(x1, yc + 4.3, 14.6), P(x0, yc + 4.3, 14.6), P(x0, yc, 17.2))
  }
  // the main cornice
  block(trim, XF - 0.6, XF, y0, y1, 13.2, 14.1, 0.1, null)
  // windows, three storeys, a pair per side bay and three in the centre
  for (const y of [y0 + 2.5, y0 + 5.2, y1 - 5.2, y1 - 2.5]) {
    for (const [z0, z1] of [[5.6, 8.0], [9.6, 12.0]]) onWall(win, [XF, 0], W, rectPts(sW(y) - 0.6, sW(y) + 0.6, z0, z1), 0.06)
  }
  for (const d of [-2.1, 0, 2.1]) {
    onWall(win, [XF - 0.8, 0], W, roundPts(sW(yc + d), 1.4, 5.6, 8.4, 6), 0.06)
    onWall(win, [XF - 0.8, 0], W, rectPts(sW(yc + d) - 0.6, sW(yc + d) + 0.6, 9.6, 12.0), 0.06)
  }
  // ground floor: doors in a stone base
  for (let k = 0; k < 7; k++) onWall(win, [XF, 0], W, rectPts(sW(y0 + 1.6 + k * 2.9) - 0.6, sW(y0 + 1.6 + k * 2.9) + 0.6, 0, 3.0), 0.06)
  // the iron balconies: a slab with a dark iron front, full width at the
  // second floor, at the third over the centre and the side bays
  const balcony = (ya: number, yb: number, z: number, d: number) => {
    block(trim, XF - d, XF, ya, yb, z - 0.25, z, 0.05)
    iron.quad([XF - d, yb, z], [XF - d, ya, z], [XF - d, ya, z + 1.1], [XF - d, yb, z + 1.1])
  }
  balcony(y0 + 0.6, y1 - 0.6, 4.6, 1.7)
  balcony(yc - 3.4, yc + 3.4, 9.1, 1.9)
  balcony(y0 + 1.2, y0 + 6.4, 9.1, 1.3)
  balcony(y1 - 6.4, y1 - 1.2, 9.1, 1.3)
  // the red-tiled hood over the centre bay's second-floor gallery
  tile.quad([XF - 0.8, yc - 4.6, 8.9], [XF - 0.8, yc + 4.6, 8.9], [XF - 2.8, yc + 4.6, 7.6], [XF - 2.8, yc - 4.6, 7.6])
  tile.quad([XF - 2.8, yc - 4.6, 7.6], [XF - 2.8, yc + 4.6, 7.6], [XF - 2.8, yc + 4.6, 7.45], [XF - 2.8, yc - 4.6, 7.45])
  // the green iron canopy over the sidewalk, on slim posts
  block(iron, XF - 2.6, XF, y0 + 0.3, y1 - 0.3, 3.6, 3.9, 0.05)
  for (let k = 0; k < 7; k++) block(iron, XF - 2.5, XF - 2.3, y0 + 0.6 + k * 3.25 - 0.1, y0 + 0.6 + k * 3.25 + 0.1, 0, 3.6)
}
// the 1909 extension's front and the later wings: grouped punched windows
for (const [a, b] of [[-15.5, 26.0]]) {
  const n = Math.round((b - a) / 3.0)
  for (let k = 0; k < n; k++) {
    const y = a + (b - a) * (k + 0.5) / n
    for (const [z0, z1] of [[1.0, 3.4], [4.8, 8.6], [9.6, 13.0]]) onWall(win, [XF, 0], W, rectPts(sW(y) - 0.55, sW(y) + 0.55, z0, z1), 0.06)
  }
}
{
  // the south side above the Rivercenter roofs and the north side to the Alamo
  const S: XY = [0, -1]
  for (let x = -25; x < 50; x += 3.4) for (const [z0, z1] of [[9.8, 12.6], [13.6, 16.2]]) onWall(win, [0, YS], S, rectPts(x - 0.55, x + 0.55, z0, z1), 0.06)
  const nx = 45.3 + 47.1, nl = Math.hypot(nx, 41.4 - 27.7), u: XY = [nx / nl, (41.4 - 27.7) / nl], nrm: XY = [-u[1], u[0]]
  for (let s = 4; s < nl - 2; s += 3.4) {
    const x = -47.1 + u[0] * s, z1 = x < -12 ? 13.1 : 16.2
    for (const [za, zb] of [[1.0, 3.4], [4.8, 8.6], [9.6, Math.min(13.0, z1)]]) onWall(win, [-47.1, 27.7], nrm, rectPts(-s - 0.55, -s + 0.55, za, zb), 0.06)
    if (x > -12) onWall(win, [-47.1, 27.7], nrm, rectPts(-s - 0.55, -s + 0.55, 13.6, 16.2), 0.06)
  }
}

// ---------------------------------------------------------------------------
const all = [stone, trim, roof, win, iron, tile]
shift(all, -3.60, 1.92)
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : n[0] < -0.5 && p[0] < -50 && p[1] < -12 ? 0.85 : 0.15)
const parts = [
  { part: stone, material: { ...finish('menger-limestone', 0xeee8da), floodlight: lit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: iron, material: finish('menger-green-iron', 0x4e6257) },
  { part: tile, material: finish('menger-red-tile', 0xb5594a) },
]
const glb = writeGlb('Menger Hotel', parts, {
  license: 'CC0-1.0', bearing: 17, elevation: 0, anchor: [29.424654, -98.48599],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['relation/1204761', 'way/80186437'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('Menger Hotel', parts, glb, 5000)
const out = new URL('../models/sat-menger-hotel.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
