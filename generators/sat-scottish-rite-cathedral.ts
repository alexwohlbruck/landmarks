/**
 * Scottish Rite Cathedral, 308 Avenue E, San Antonio, Texas (1922-1924,
 * Herbert M. Greene, LaRoche & Dahl): a Neoclassical temple in pale
 * limestone. Its front, facing north-west onto Avenue E, is a two-storey
 * podium with the bronze door and four windows between projecting end piers,
 * a giant order of eight Corinthian columns in antis before tall bronze
 * grilles, a full entablature lettered "SCOTTISH RITE CATHEDRAL", and a
 * pediment with the double-headed eagle. Behind it rises the big auditorium
 * block with its stepped attic roof, and the stage block to the south-east;
 * low two-storey wings flank the front. Original procedural geometry,
 * CC0-1.0.   bun generators/sat-scottish-rite-cathedral.ts
 *
 * Identity, from evidence: OSM's way/100577312, which carries the name
 * "Scottish Rite Cathedral" and wikidata Q7437954, is a 10 m high diagonal
 * strip on North Alamo Street, 220 m away (lidar), and the historic marker
 * node/12395184245 sits at the real building. The building in the photos is
 * OSM way/100577297, tagged "Scottish Rite Banquet Hall" (its lidar profile,
 * pediment and stepped attic match the photos), with its two flanking wings
 * way/100577313 and way/100577294. The model is placed there and replaces
 * those three; way/100577312 is left alone.
 *
 * Frame: bearing 46 (the outlines are square to 0.1 m in it). x runs from
 * the front (x -39.1, facing bearing 316) to the back, y across, z up,
 * metres. Drawn about the lidar grid's centre (-98.48424, 29.42752), shifted
 * by (0.63, -0.42) so the origin is the area centroid of way/100577297
 * (-98.484241, 29.427527).
 *
 * Ground: nearly flat (Mapterhorn 0.3-1.6 m over 80 m; lidar ground 1.8-2.2
 * round the building); heights below are lidar less 1.9. Elevation 0.
 *
 * Evidence
 * - OSM way/100577297 (x -39.1..34.0, y -21.3..19.8), way/100577313 (the
 *   north wing, x -38.7..-14.5, y 9.5..23.6), way/100577294 (the south wing,
 *   x -39.2..-11.7, y -31.1..-12.8).
 * - USGS 3DEP lidar USGS_LPC_TX_Central_B2_2017_LAS_2019 (2017), 1 m grid
 *   (~/landmarks-scratch/satx/work/sat-scottish-rite-cathedral/lidar.json),
 *   less 1.9: the front block x -39..-22, y -12.4..10, its cornice 20.1 and
 *   pediment ridge 23.7 on y -1.2; the wings 8.5; the auditorium x -22..6,
 *   y -21..20, its attic stepping from 25.6 at the walls through 27.2, 28.8,
 *   29.7 to a flat top at 30.9 (skylights to 34); the stage block x 6..26,
 *   y -14..14 at 27 with a raised lantern to 29.8; the low rear range to x 34
 *   at 9-11.6.
 * - Published: Wikipedia "Scottish Rite Cathedral (San Antonio)"; NRHP
 *   (1922-24, Herbert M. Greene, LaRoche & Dahl; bronze doors).
 * - Photos (Wikimedia Commons), EVIDENCE:
 *   "Scottish Rite Cathedral in San Antonio.jpg" (Renegomezphotography, CC
 *     BY-SA 4.0): the front square on, scaled at 25.6 px/m from the lidar
 *     cornice: the podium to 9.6 (photo 10.2; lowered a little so the
 *     columns read at their photo share of the front, review), the columns 1.15 m across at 2.3 m
 *     centres to 18.2, the entablature to 20.1, the pediment to 23.3; the
 *     door 2.5 m wide to 5, the four windows, the end piers, the low wings;
 *   "Scottishritefront.jpg" (Leonard Pierce, CC BY-SA 3.0): the colonnade,
 *     the bronze grilles, the eagle medallion.
 *
 * Estimated: the sides and back, which no photo here shows, drawn as plain
 * stone with a few windows. Bolder than real: the columns (1.2 m).
 *
 * Night: the front floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, lathe, report, writeGlb, type XY } from './sf-de-young'
import { shift } from './sf-opera-house'
import { onWall, rectPts, circlePts, block } from './sat-san-fernando-cathedral'

const stone = new Part(), trim = new Part(), roof = new Part(), bronze = new Part(), win = new Part()
const W: XY = [-1, 0]
const sW = (y: number) => -y
const XF = -39.1, Y0 = -12.4, Y1 = 10.0, YC = -1.2

// ---- the auditorium block with its stepped attic ----
block(stone, -22, 6, -21.3, 19.8, 0, 25.6, 0.2, null)
{
  const steps: [number, number][] = [[0, 25.6], [1.6, 27.2], [3.2, 28.8], [4.8, 29.7], [6.2, 30.9]]
  for (let i = 1; i < steps.length; i++) {
    const [d, z] = steps[i], [, z0] = steps[i - 1]
    block(stone, -22 + d, 6 - d, -21.3 + d, 19.8 - d, z0, z, 0.15, i === steps.length - 1 ? roof : stone)
  }
  block(roof, -12, -4, -6, 4, 30.9, 32.6, 0.2) // the skylight
}
// ---- the stage block and the low rear range ----
block(stone, 6, 26, -14, 14, 0, 27.0, 0.2, roof)
block(stone, 11.5, 18.5, -8, 4, 27.0, 29.8, 0.15, roof)
prism(stone, [[6, -21.3], [34.0, -21.3], [34.0, 19.8], [6, 19.8], [6, 14], [26, 14], [26, -14], [6, -14]], 0, 9.7, roof, 0.15)
// ---- the flanking wings ----
prism(stone, [[-38.7, 9.5], [-22, 9.5], [-22, 19.8], [-14.5, 19.8], [-14.5, 23.6], [-38.7, 23.6]], 0, 8.5, roof, 0.15)
prism(stone, [[-39.2, -31.1], [-11.7, -31.1], [-11.7, -21.3], [-22, -21.3], [-22, -12.8], [-39.2, -12.8]], 0, 8.5, roof, 0.15)
for (const y of [12.5, 16.5, 20.5]) onWall(win, [-38.7, 0], W, rectPts(sW(y) - 0.7, sW(y) + 0.7, 4.4, 7.0), 0.06)
for (const y of [-15.5, -19.5, -23.5, -27.5]) onWall(win, [-39.2, 0], W, rectPts(sW(y) - 0.7, sW(y) + 0.7, 4.4, 7.0), 0.06)

// ---- the front block: podium, colonnade in antis, entablature, pediment ----
block(stone, XF, -22, Y0, Y1, 0, 9.6, 0, null)
block(stone, XF + 1.6, -22, Y0, Y1, 18.3, 20.1, 0, null)
block(roof, XF + 0.5, -22, Y0 + 0.5, Y1 - 0.5, 20.0, 20.1)
// the steps
for (let k = 0; k < 3; k++) block(trim, XF - 2.4 + k * 0.8, XF, Y0 + 1.5, Y1 - 1.5, 0, 0.65 + 0.35 * k, 0)
// the podium's cornice and the end piers
block(trim, XF - 0.35, XF, Y0, Y1, 9.0, 9.6, 0.1)
// the antae: bold pale pylons framing the colonnade, full height, standing proud
for (const [a, b] of [[Y0 - 0.5, Y0 + 2.4], [Y1 - 2.4, Y1 + 0.5]]) block(trim, XF - 0.5, -22, a, b, 0, 18.3, 0.12, null)
for (const [a, b] of [[Y0, Y0 + 3.4], [Y1 - 3.4, Y1]]) block(trim, XF - 0.6, XF, a, b, 0, 10.9, 0.12)
onWall(bronze, [XF, 0], W, rectPts(sW(YC) - 1.25, sW(YC) + 1.25, 0, 5.0), 0.08)
onWall(trim, [XF, 0], W, rectPts(sW(YC) - 1.9, sW(YC) + 1.9, 5.0, 6.8), 0.12)
for (const d of [-6.2, -3.7, 3.7, 6.2]) onWall(win, [XF, 0], W, rectPts(sW(YC + d) - 0.75, sW(YC + d) + 0.75, 3.3, 6.6), 0.06)
// the colonnade: the bronze grilles set back, eight columns, the antae
const XC = XF + 1.6
block(stone, XC, -22, Y0, Y1, 9.6, 18.3, 0, null)
onWall(bronze, [XC, 0], W, rectPts(sW(YC) - 9.0, sW(YC) + 9.0, 11.4, 18.0), 0.06)
for (let k = 0; k < 8; k++) {
  const y = YC - 8.05 + k * 2.3
  lathe(trim, [[0.8, 9.6], [0.8, 10.0], [0.66, 10.1], [0.6, 17.3], [0.85, 17.6], [0.85, 18.3]], 10, [XF + 0.9, y])
}
// the entablature, a full-width band projecting a little
block(trim, XF - 0.7, -22, Y0 - 0.8, Y1 + 0.8, 18.3, 20.1, 0.1)
// the pediment and its raking cornices
{
  const x0 = XF - 0.7, x1 = -22, apex = 23.6, P = (x: number, y: number, z: number): V3 => [x, y, z]
  stone.tri(P(x0 + 0.2, Y0 - 0.6, 20.1), P(x0 + 0.2, YC, apex - 0.2), P(x0 + 0.2, Y1 + 0.6, 20.1))
  roof.quad(P(x1, Y0 - 0.8, 20.1), P(x1, YC, apex), P(x0, YC, apex), P(x0, Y0 - 0.8, 20.1))
  roof.quad(P(x1, YC, apex), P(x1, Y1 + 0.8, 20.1), P(x0, Y1 + 0.8, 20.1), P(x0, YC, apex))
  // raking cornice: a pale band along each slope on the front
  for (const [ya, yb] of [[Y0 - 0.8, YC], [YC, Y1 + 0.8]]) {
    const za = ya === YC ? apex : 20.1, zb = yb === YC ? apex : 20.1
    trim.quad(P(x0 - 0.05, ya, za), P(x0 - 0.05, yb, zb), P(x0 - 0.05, yb, zb - 0.55), P(x0 - 0.05, ya, za - 0.55))
  }
  onWall(trim, [x0 + 0.2, 0], W, circlePts(sW(YC), 21.4, 0.8, 12), 0.06)
  block(trim, x0 - 0.1, x0 + 0.5, YC - 0.5, YC + 0.5, apex - 0.1, apex + 1.0, 0.1) // the acroterion
}
// a few windows on the sides of the auditorium and wings
for (const x of [-16, -8, 0]) for (const [yw, n] of [[19.8, [0, 1]], [-21.3, [0, -1]]] as [number, XY][]) {
  const s = n[1] > 0 ? -x : x
  onWall(win, [0, yw], n, rectPts(s - 1.0, s + 1.0, 11.0, 20.0), 0.06)
}

// ---------------------------------------------------------------------------
const all = [stone, trim, roof, bronze, win]
shift(all, 0.63, -0.42)
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : n[0] < -0.5 && p[0] < -36 ? 0.9 : 0.25)
const parts = [
  { part: stone, material: { ...finish('scottish-rite-limestone', 0xe9e3d4), floodlight: lit } },
  { part: trim, material: { ...finish('scottish-rite-carved-stone', 0xf4efe4), floodlight: lit } },
  { part: roof, material: { ...PALETTE.roof, color: 0xaaaea9 } },
  { part: bronze, material: finish('scottish-rite-bronze', 0x7d5a46) },
  { part: win, material: PALETTE.window },
]
const glb = writeGlb('Scottish Rite Cathedral', parts, {
  license: 'CC0-1.0', bearing: 46, elevation: 0, anchor: [29.427527, -98.484241],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/100577297', 'way/100577313', 'way/100577294'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('Scottish Rite Cathedral', parts, glb, 5000)
const out = new URL('../models/sat-scottish-rite-cathedral.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
