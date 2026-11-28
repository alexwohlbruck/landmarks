/**
 * Mission Nuestra Señora de la Purísima Concepción de Acuña, the church
 * (completed 1755) and its attached convento, San Antonio Missions National
 * Historical Park (UNESCO World Heritage), Texas. A cross-plan stone church
 * facing WEST: twin bell towers with arched belfries, corner finials and
 * stepped pyramid caps flank a flat front with the triangular-pedimented
 * portal and an oculus; the flat-roofed nave and transepts; the white dome
 * on a drum with its lantern over the crossing; the apse; and the low
 * rubble-stone convento to the south with its arcade facing west.
 * Original procedural geometry, CC0-1.0.   bun generators/sat-mission-concepcion.ts
 *
 * The convento is OSM way/120248905, a separate outline, but it is built
 * against the church's south tower and transept (the photos), so it is drawn
 * here and replaced with the church.
 *
 * Frame: bearing 4.3 (both OSM outlines are square to 0.2 m in it). x east
 * (the front faces -x, west), y north, z up, metres. Drawn about the lidar
 * grid's centre (-98.49116, 29.39105), shifted by (-0.46, 1.86) so the
 * origin is the area centroid of the church, way/120248909 (-98.491157,
 * 29.391033).
 *
 * Ground: flat (lidar ground 0.9-1.6 over its ground_min); heights below are
 * lidar less 0.95. Elevation 0.
 *
 * Evidence
 * - OSM way/120248909 (the church): the front x -14.4..-8.7, y -8.0..9.4;
 *   the nave to x 0.9, y -4.0..4.3; the transepts x 0.9..9.6, y -16.8..8.5;
 *   the apse to x 14.4, y -4.5..4.4. way/120248905 (the convento): x
 *   -24.2..-5.2, y -34.4..-7.9.
 * - USGS 3DEP lidar USGS_LPC_TX_Central_B2_2017_LAS_2019 (2017), 0.5 m grid
 *   (~/landmarks-scratch/satx/work/sat-mission-concepcion/lidar.json), less
 *   0.95: the towers x -14..-8, y 3.6..8.6 and -9..-3.8, belfry cornice 16.2 (drawn 15.6, the belfries
 *   0.6 m shorter to match the photos' proportions), caps to 19.5; the front between them 8.7-9, its pediment 12.6; nave and
 *   transepts 8.3-9.1; the drum 12-13.5 and the dome's lantern 16; the
 *   convento 4.3-5.6.
 * - Published: NPS; Wikipedia "Mission Concepción" (dedicated 1755, the
 *   oldest unrestored stone church in the United States).
 * - Photos (Wikimedia Commons), EVIDENCE:
 *   "Mission Concepcion, San Antonio, Texas.jpg" (Jkulick, CC BY-SA 4.0): the
 *     west front from the west-south-west: towers, pediment, oculus, small
 *     windows, the convento's arcade;
 *   "Mission Concepción 1.jpg" (Ligocsicnarf89, CC BY 4.0): from the south:
 *     the north tower's belfry and cap, the white dome with its lantern and
 *     pinnacles, the convento's rubble walls;
 *   "Mission Concepción in San Antonio, Texas.jpg" (Michaelluckey, CC BY 4.0).
 *
 * Estimated: the east end and the north side, drawn plain; the convento's
 * arches (three on its west face, from the photo) and its inner court,
 * which is drawn roofed (the outline has none).
 *
 * Night: the front and towers floodlit, the dome a little.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, lathe, report, writeGlb, type XY } from './sf-de-young'
import { shift } from './sf-opera-house'
import { onWall, rectPts, roundPts, circlePts, ringOnWall, block, pyramid, cross3 } from './sat-san-fernando-cathedral'

const stone = new Part(), trim = new Part(), white = new Part(), roof = new Part(), win = new Part(), wood = new Part()
const W: XY = [-1, 0], S: XY = [0, -1], N: XY = [0, 1], E: XY = [1, 0]
const sW = (y: number) => -y, sS = (x: number) => x, sN = (x: number) => -x

const XF = -14.4, YC = 0.7
// the church body: front block, nave, transepts, apse (flat roofs)
block(stone, XF, -8.7, -8.0, 9.4, 0, 9.0, 0.12, roof)
block(stone, -8.7, 0.9, -4.0, 4.3, 0, 8.6, 0.12, roof)
block(stone, 0.9, 9.6, -16.8, 8.5, 0, 9.0, 0.12, roof)
block(stone, 9.6, 14.4, -4.5, 4.4, 0, 8.6, 0.12, roof)

// the towers: shaft to 11, a string course, the belfry, cornice, stepped cap, finials
for (const [y0, y1] of [[3.8, 9.4], [-8.0, -2.4]]) {
  const x0 = XF, x1 = -8.7, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  block(stone, x0, x1, y0, y1, 9.0, 11.0, 0, null)
  block(trim, x0 - 0.25, x1 + 0.25, y0 - 0.25, y1 + 0.25, 11.0, 11.6, 0.12)
  const hx = 2.45, hy = 2.45
  block(stone, cx - hx, cx + hx, cy - hy, cy + hy, 11.6, 15.0, 0, null)
  block(trim, cx - hx - 0.3, cx + hx + 0.3, cy - hy - 0.3, cy + hy + 0.3, 15.0, 15.6, 0.12)
  block(stone, cx - 1.9, cx + 1.9, cy - 1.9, cy + 1.9, 15.6, 16.3, 0.1, null)
  pyramid(stone, cx - 1.9, cx + 1.9, cy - 1.9, cy + 1.9, 16.3, 18.3)
  lathe(trim, [[0.45, 18.1], [0.45, 18.9], [0.6, 19.0], [0, 19.5]], 8, [cx, cy])
  cross3(trim, cx, cy, 19.4, 1.0, 0.16)
  for (const [px, py] of [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]]) {
    block(trim, px - 0.3, px + 0.3, py - 0.3, py + 0.3, 15.6, 16.1, 0.05)
    pyramid(trim, px - 0.3, px + 0.3, py - 0.3, py + 0.3, 16.1, 17.0)
  }
  for (const [at, n, s] of [[[cx - hx, 0], W, sW(cy)], [[cx + hx, 0], E, cy], [[0, cy + hy], N, sN(cx)], [[0, cy - hy], S, sS(cx)]] as [XY, XY, number][]) {
    onWall(trim, at, n, roundPts(s, 2.0, 12.2, 14.8, 8), 0.03)
    onWall(win, at, n, roundPts(s, 1.4, 12.4, 14.5, 6), 0.06)
  }
  onWall(win, [XF, 0], W, rectPts(sW(cy) - 0.35, sW(cy) + 0.35, 7.0, 7.9), 0.06)
  onWall(win, [XF, 0], W, rectPts(sW(cy) - 0.45, sW(cy) + 0.45, 3.4, 4.5), 0.06)
}
// the front between the towers: a stepped parapet with the cross, the oculus, the pediment portal
block(stone, XF, -8.7, YC - 3.0, YC + 3.0, 9.0, 9.9, 0, roof)
block(stone, XF, XF + 0.8, YC - 1.0, YC + 1.0, 9.9, 10.6, 0.05)
cross3(trim, XF + 0.4, YC, 10.6, 1.8, 0.18)
ringOnWall(trim, [XF, 0], W, sW(YC), 7.8, 0.45, 0.85, 0.04, 12)
onWall(win, [XF, 0], W, circlePts(sW(YC), 7.8, 0.45, 12), 0.06)
block(trim, XF - 0.3, XF, YC - 2.0, YC + 2.0, 0, 4.9, 0.06)
onWall(trim, [XF - 0.3, 0], W, [[sW(YC) - 2.2, 4.9], [sW(YC) + 2.2, 4.9], [sW(YC), 6.9]], 0)
onWall(wood, [XF - 0.3, 0], W, roundPts(sW(YC), 1.5, 0, 3.4, 8), 0.05)
for (const d of [-1.8, 1.8]) onWall(win, [XF, 0], W, rectPts(sW(YC) + d - 0.35, sW(YC) + d + 0.35, 5.3, 6.2), 0.06)

// the dome over the crossing: drum, white dome, pinnacles, lantern
{
  const DX = 5.25, DY = 0.0, R = 3.6
  lathe(white, [[R, 9.0], [R, 11.8], [R + 0.25, 11.9], [R + 0.25, 12.2], [R, 12.2]], 16, [DX, DY])
  for (let k = 0; k < 4; k++) {
    const a = (Math.PI / 2) * k + Math.PI / 4, n: XY = [Math.cos(a), Math.sin(a)]
    onWall(win, [DX, DY], n, rectPts(-0.4, 0.4, 9.8, 11.2), R + 0.04)
    const px = DX + Math.cos(a) * (R + 0.5), py = DY + Math.sin(a) * (R + 0.5)
    pyramid(white, px - 0.4, px + 0.4, py - 0.4, py + 0.4, 9.0, 11.0)
  }
  const prof: [number, number][] = []
  for (let i = 0; i <= 6; i++) { const a = (Math.PI / 2) * (i / 6); prof.push([Math.max(0.6, 3.3 * Math.cos(a)), 12.2 + 2.6 * Math.sin(a)]) }
  lathe(white, prof, 16, [DX, DY])
  lathe(white, [[0.6, 14.7], [0.6, 15.6], [0.75, 15.7], [0.75, 15.9], [0, 16.2]], 10, [DX, DY])
  cross3(trim, DX, DY, 16.1, 0.9, 0.14)
}
// a few windows on the sides and transepts
for (const x of [-4.0]) {
  onWall(win, [0, 4.3], N, rectPts(sN(x) - 0.4, sN(x) + 0.4, 5.6, 7.0), 0.06)
}
onWall(win, [0, 8.5], N, roundPts(sN(5.25), 1.0, 5.2, 7.4, 6), 0.06)
onWall(win, [14.4, 0], E, roundPts(0, 1.0, 5.2, 7.4, 6), 0.06)

// the convento: low rubble-stone ranges (the OSM outline), with the arcade facing west
{
  const C: XY[] = [[-24.1, -27.5], [-24.2, -28.1], [-23.9, -32.2], [-17.9, -32.1], [-17.7, -34.4], [-12.8, -34.4], [-12.9, -31.2], [-8.5, -30.9], [-8.6, -24.0], [-8.0, -23.9], [-8.1, -20.2], [-6.5, -18.0], [-5.3, -17.2], [-5.2, -7.9], [-8.7, -8.0], [-14.4, -8.0], [-18.3, -7.9], [-18.0, -19.6], [-17.9, -26.9]]
  prism(stone, C, 0, 4.8, roof, 0.12)
  for (const y of [-10.6, -14.2, -17.8]) onWall(wood, [-18.15, 0], W, roundPts(sW(y), 2.6, 0, 3.4, 8), 0.06)
  for (const y of [-29.6]) onWall(wood, [-24.0, 0], W, rectPts(sW(y) - 0.6, sW(y) + 0.6, 0, 2.2), 0.06)
}

// ---------------------------------------------------------------------------
const all = [stone, trim, white, roof, win, wood]
shift(all, -0.46, 1.86)
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : n[0] < -0.5 && p[0] < -14 ? 0.9 : p[0] < -8 ? 0.6 : 0.25)
const parts = [
  { part: stone, material: { ...finish('concepcion-stone', 0xc9c2b0), floodlight: lit } },
  { part: trim, material: { ...finish('concepcion-carved-stone', 0xddd8cb), floodlight: lit } },
  { part: white, material: { ...finish('concepcion-dome-white', 0xf3f1ec), floodlight: () => 0.35 } },
  { part: roof, material: { ...PALETTE.roof, color: 0xb3b2aa } },
  { part: win, material: PALETTE.window },
  { part: wood, material: finish('concepcion-door', 0x6d6660) },
]
const glb = writeGlb('Mission Concepción', parts, {
  license: 'CC0-1.0', bearing: 4.3, elevation: 0, anchor: [29.391033, -98.491157],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/120248909', 'way/120248905'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('Mission Concepción', parts, glb, 5000)
const out = new URL('../models/sat-mission-concepcion.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
