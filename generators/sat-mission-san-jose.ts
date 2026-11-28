/**
 * Mission San José y San Miguel de Aguayo, the church (1768-1782), San
 * Antonio Missions National Historical Park (UNESCO World Heritage), Texas.
 * A limestone church facing west-north-west: the carved Baroque frontispiece
 * round the west door, the single bell tower on the SOUTH-west corner (a
 * square shaft, an arcaded belfry with pilasters, a small cupola), the base
 * of an unfinished second tower at the north-west corner, the flat-roofed
 * nave with deep buttresses, the dome on an octagonal drum over the
 * crossing, and the low sacristy along the south side with its scalloped
 * parapet and the Rose Window. Original procedural geometry, CC0-1.0.
 *   bun generators/sat-mission-san-jose.ts
 *
 * Orientation, from evidence: the brief placed the bell tower at the
 * north-west; OSM, lidar and every photo put it at the south-west corner,
 * next to the sacristy (which carries the Rose Window on its south wall).
 *
 * Frame: bearing 27. x runs along the nave towards the altar (bearing 117,
 * east-south-east), y is the model's north (bearing 27), z up, metres. Drawn
 * about the lidar grid's centre (-98.479883, 29.36233), shifted by
 * (-3.29, -3.45) so the origin is the area centroid of OSM way/368488495
 * (-98.479837, 29.362344).
 *
 * Ground: flat (lidar ground 1.1-1.8 m over its ground_min, lowest on the
 * west); heights below are lidar less 1.3. Elevation 0.
 *
 * Evidence
 * - OSM way/368488495 (building=church): in the frame, the west front at
 *   x = -13.6 from y -3.9 to 14.8; the nave x -7.9..19.7, y 0..10.7; the
 *   sacristy x 0.7..19.6, y -6..0; a round stair turret behind the tower at
 *   (-6.6, -1.9).
 * - USGS 3DEP lidar USGS_LPC_TX_Central_B2_2017_LAS_2019 (2017), 0.5 m grid
 *   (~/landmarks-scratch/satx/work/sat-mission-san-jose/lidar.json), less 1.3:
 *   nave parapets 10.7-11.7; the tower's belfry top 20.4-20.8 over x -12..-8,
 *   y -4..0; the north tower base 12.4; the drum about 8 m across centred (9, 5.4),
 *   the dome 7 m across, its crown 19.3; the sacristy 6.1-7.0.
 * - Published: NPS San Antonio Missions; Wikipedia "Mission San José (Texas)"
 *   (church 1768-1782; dome and north wall collapsed 1868-1874, rebuilt 1930s).
 * - Photos (Wikimedia Commons), EVIDENCE:
 *   "Mission San Jose, San Antonio, Texas with clouds.jpg" (P. Hughes, CC
 *     BY-SA 4.0) and "MIssion San Jose y San Miguel de Aguayo 733.jpg" (Chris
 *     Light, CC BY-SA 4.0): from the south-west: the front, the tower's
 *     stages (scaled from the lidar top: shaft cornice 11.6, belfry to 18.2,
 *     cupola to 20.8), the frontispiece rising over the parapet, the
 *     buttressed south wall, the sacristy's scalloped parapet and the Rose
 *     Window, the dome on its drum;
 *   "NORTH WALL WITH DOME ... HABS TEX,15-SANT,V,5E-4" (HABS, public domain):
 *     the north wall's deep buttresses and the octagonal drum.
 *
 * Estimated: the frontispiece's outline (one carved panel, 4.4 m wide, to
 * 13.6 m) and the openings on the sides; the east end, which no photo here
 * shows, is drawn plain. Bolder than real: the Rose Window's surround.
 *
 * Night: the west front and tower floodlit, the rest dimly.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, lathe, report, writeGlb, type XY } from './sf-de-young'
import { shift } from './sf-opera-house'
import { onWall, rectPts, roundPts, circlePts, ringOnWall, block, pyramid, cross3 } from './sat-san-fernando-cathedral'

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), wood = new Part(), dome = new Part()
const W: XY = [-1, 0], S: XY = [0, -1], N: XY = [0, 1]
const sW = (y: number) => -y, sS = (x: number) => x, sN = (x: number) => -x

const XF = -13.6, YC = 5.35
// the nave, flat-roofed behind a parapet
block(stone, -7.9, 19.7, 0, 10.7, 0, 11.2, 0.15, roof)
// the front block: the facade wall across the nave, the north tower base
block(stone, XF, -7.9, 1.1, 10.7, 0, 11.0, 0.15, roof)
block(stone, XF, -7.9, 10.7, 14.8, 0, 12.4, 0.15, roof)
for (let k = 0; k < 4; k++) block(stone, XF + 0.3 + k * 1.45, XF + 0.95 + k * 1.45, 14.2, 14.8, 12.4, 13.0) // crenels
// buttresses on the north wall and above the sacristy on the south
for (const x of [-2.5, 4.0, 13.5, 17.5]) {
  block(stone, x - 0.6, x + 0.6, 10.7, 12.0, 0, 10.8, 0.12)
  block(stone, x - 0.5, x + 0.5, -0.9, 0, 6.5, 10.8, 0.12)
}
// the sacristy along the south side, with its scalloped parapet
block(stone, 0.7, 19.6, -6.0, 0, 0, 5.6, 0.1, roof)
for (let k = 0; k < 8; k++) {
  const x0 = 0.9 + k * 2.35, x1 = x0 + 2.35
  for (const [y, n] of [[-6.0, S]] as [number, XY][]) {
    const pts: XY[] = [[sS(x0), 5.6], [sS(x1), 5.6]]
    for (let i = 0; i <= 6; i++) { const t = i / 6; pts.push([sS(x1 - (x1 - x0) * t), 5.6 + 0.4 + 0.55 * Math.sin(Math.PI * t)]) }
    onWall(stone, [0, y], n, pts.slice(0, 2).concat(pts.slice(2)), 0)
  }
  block(stone, x0, x1, -6.0, -5.6, 5.6, 6.0)
}
// the Rose Window on the sacristy's south wall, and a door
ringOnWall(trim, [0, -6.0], S, sS(12.0), 3.2, 0.75, 1.15, 0.04, 16)
onWall(win, [0, -6.0], S, circlePts(sS(12.0), 3.2, 0.75, 16), 0.06)
onWall(wood, [0, -6.0], S, roundPts(sS(6.0), 1.3, 0, 2.6, 6), 0.05)

// the bell tower at the south-west corner: shaft, belfry, cupola
{
  const x0 = XF, x1 = -7.9, y0 = -3.9, y1 = 1.1, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  block(stone, x0, x1, y0, y1, 0, 11.8, 0, null)
  block(trim, x0 - 0.3, x1 + 0.3, y0 - 0.3, y1 + 0.3, 11.8, 12.4, 0.15)
  const h = 2.2
  block(stone, cx - h, cx + h, cy - h, cy + h, 12.4, 17.6, 0, null)
  block(trim, cx - h - 0.3, cx + h + 0.3, cy - h - 0.3, cy + h + 0.3, 17.6, 18.2, 0.12)
  for (const [at, n, s] of [[[cx - h, 0], W, sW(cy)], [[cx + h, 0], [1, 0], cy], [[0, cy + h], N, sN(cx)], [[0, cy - h], S, sS(cx)]] as [XY, XY, number][]) {
    onWall(win, at, n, roundPts(s, 1.3, 13.6, 16.9, 6), 0.06)
    for (const d of [-1.65, 1.65]) onWall(trim, at, n, rectPts(s + d - 0.25, s + d + 0.25, 12.4, 17.6), 0.12)
  }
  for (const [px, py] of [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]]) block(trim, px - 0.25, px + 0.25, py - 0.25, py + 0.25, 18.2, 18.9, 0.05)
  lathe(stone, [[1.9, 18.2], [1.9, 18.6], [1.7, 19.4], [1.2, 20.1], [0.5, 20.6], [0.35, 20.8], [0.35, 21.2], [0, 21.4]], 12, [cx, cy])
  cross3(trim, cx, cy, 21.3, 1.3, 0.2)
  onWall(win, [x0, 0], W, rectPts(sW(cy) - 0.4, sW(cy) + 0.4, 6.0, 7.6), 0.06)
}
// the round stair turret behind the tower
lathe(stone, [[1.2, 0], [1.2, 9.6], [0, 9.6]], 12, [-6.6, -1.9])

// the frontispiece: one bold carved panel round the door, rising over the parapet
{
  const w = 2.2
  block(trim, XF - 0.35, XF, YC - w, YC + w, 0, 12.6, 0.1)
  onWall(trim, [XF - 0.35, 0], W, [[sW(YC) - 1.2, 12.6], [sW(YC) + 1.2, 12.6], [sW(YC), 13.6]], 0)
  cross3(trim, XF - 0.15, YC, 13.4, 1.1, 0.18)
  onWall(wood, [XF - 0.35, 0], W, roundPts(sW(YC), 1.7, 0, 4.1, 8), 0.05)
  onWall(win, [XF - 0.35, 0], W, circlePts(sW(YC), 8.4, 0.55, 12), 0.05)
  for (const d of [-1.45, 1.45]) onWall(wood, [XF - 0.35, 0], W, roundPts(sW(YC) + d, 0.6, 5.2, 7.0, 4), 0.05)
}
// small windows high in the nave walls
for (const x of [-4.5, 1.0, 16.0]) onWall(win, [0, 10.7], N, rectPts(sN(x) - 0.5, sN(x) + 0.5, 7.0, 8.6), 0.06)
for (const x of [-4.5]) onWall(win, [0, 0], S, rectPts(sS(x) - 0.5, sS(x) + 0.5, 7.0, 8.6), 0.06)

// the dome over the crossing: an octagonal drum with windows, a hemisphere, a finial
{
  const DX = 9.0, DY = YC, R = 3.9
  lathe(stone, [[R, 11.2], [R, 14.6]], 8, [DX, DY], Math.PI / 8, false)
  lathe(trim, [[R, 14.6], [R + 0.3, 14.6], [R + 0.3, 14.95], [R, 14.95]], 8, [DX, DY], Math.PI / 8, false)
  for (let k = 0; k < 8; k += 2) {
    const a = (Math.PI / 4) * (k + 1), n: XY = [Math.cos(a), Math.sin(a)]
    onWall(win, [DX, DY], n, rectPts(-0.45, 0.45, 12.4, 13.8), R * Math.cos(Math.PI / 8) + 0.04)
  }
  const prof: [number, number][] = []
  for (let i = 0; i <= 6; i++) { const a = (Math.PI / 2) * (i / 6); prof.push([Math.max(0.45, 3.45 * Math.cos(a)), 14.95 + 3.45 * Math.sin(a)]) }
  lathe(dome, [[R, 14.95], [3.45, 14.95]], 16, [DX, DY])
  lathe(dome, prof, 16, [DX, DY])
  lathe(trim, [[0.45, 18.4], [0.55, 18.8], [0.3, 19.1], [0, 19.3]], 8, [DX, DY])
  cross3(trim, DX, DY, 19.2, 1.2, 0.18)
}

// ---------------------------------------------------------------------------
const all = [stone, trim, roof, win, wood, dome]
shift(all, -3.29, -3.45)
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : n[0] < -0.5 && p[0] < -15 ? 0.9 : p[0] < -10 ? 0.6 : 0.3)
const parts = [
  { part: stone, material: { ...finish('sanjose-limestone', 0xe2d7c0), floodlight: lit } },
  { part: trim, material: { ...finish('sanjose-carved-stone', 0xeee4cf), floodlight: lit } },
  { part: roof, material: { ...PALETTE.roof, color: 0xb3b2aa } },
  { part: win, material: PALETTE.window },
  { part: wood, material: finish('sanjose-door', 0x6a4c38) },
  { part: dome, material: finish('sanjose-dome-plaster', 0xcdc5b6) },
]
const glb = writeGlb('Mission San José', parts, {
  license: 'CC0-1.0', bearing: 27, elevation: 0, anchor: [29.362344, -98.479837],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/368488495'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('Mission San José', parts, glb, 5000)
const out = new URL('../models/sat-mission-san-jose.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
