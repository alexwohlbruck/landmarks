/**
 * Bunker Hill Monument, Charlestown (1825–1843, Solomon Willard) and its
 * lodge (1903) — original procedural geometry, CC0-1.0.
 * bun generators/bos-bunker-hill-monument.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 17.3: the obelisk's square (OSM way/212124093)
 * and the lodge (way/29787114) are both turned 17.3° from north. Anchor =
 * the obelisk outline's centroid, -71.0607674, 42.3763523. The lodge stands
 * 10 m north of the obelisk in this frame, its portico facing east.
 *
 * Identity: a plain Quincy granite obelisk, 221 ft tall, tapering from a
 * 30 ft square base, with a low pyramidion and a small window in each face
 * under the cap; beside it the small granite lodge, a flat-roofed block with
 * a six-column Ionic portico and pediment on its east front.
 *
 * Evidence:
 *  - plan: OSM way/212124093 (8.8 m square as drawn) and its parts
 *    way/240874184–189; the lodge way/29787114 (OSM names it "Bunker Hill
 *    Pavilion"; the photos and its position show it is the monument lodge)
 *    and its parts way/240874172–192, including the portico columns.
 *  - heights: USGS 3DEP lidar MA_CentralEastern_1_2021, 0.5 m grid, in this
 *    frame. y = 0 is the lowest ground, at the lodge's north end; the
 *    ground at the obelisk is 1.6 m higher and at the lodge front 1.1 m.
 *    Measured: the obelisk's apex 68.3 (66.7 above its own base), the
 *    shaft's top edge about 64.8; the lodge roof 6.8, its centre range and
 *    pediment to 8.0.
 *  - published: 221 ft (67.4 m) tall, 30 ft (9.14 m) square at the base,
 *    15 ft (4.57 m) at the top of the shaft (NPS, Boston National Historical
 *    Park; Wikipedia "Bunker Hill Monument"). Drawn: base 9.14 m, top
 *    4.57 m, shaft 63.2 m, apex 65.4 m above the base (lidar, with the
 *    blunt cap drawn 2.2 m tall).
 *  - estimated from the photos: the pyramidion's height (2.2 m, low and
 *    blunt in delso and the lidar), the top windows, the door, the lodge's
 *    portico size, cornice and windows.
 *  - ground: Mapterhorn and lidar slope about 1.6 m down to the north;
 *    elevation 0. The obelisk's shaft runs down to y = 0 and sinks in.
 *  - colour: grey-taupe Quincy granite (delso, crisco), the lodge a shade paler.
 *  - night: the obelisk is floodlit from its foot.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Monumento de Bunker Hill, Boston, EE.UU., 2007-08-01 DD 280.jpg, Diego
 *    Delso, CC BY-SA 4.0 (the whole obelisk, lodge at its foot)
 *    https://commons.wikimedia.org/wiki/File:Monumento_de_Bunker_Hill,_Boston,_EE.UU.,_2007-08-01_DD_280.jpg
 *  - Bunker Hill Monument (36286).jpg, Rhododendrites, CC BY-SA 4.0 (the
 *    lodge front) https://commons.wikimedia.org/wiki/File:Bunker_Hill_Monument_(36286).jpg
 *  - Bunker Hill Lodge.jpg, Swampyank, public domain (lodge, side and
 *    portico) https://commons.wikimedia.org/wiki/File:Bunker_Hill_Lodge.jpg
 *  - Bunker Hill Monument, Charlestown, MA 2023-02-20.jpg, Crisco 1492,
 *    CC BY-SA 4.0 https://commons.wikimedia.org/wiki/File:Bunker_Hill_Monument,_Charlestown,_MA_2023-02-20.jpg
 *  - Bunker Hill Monument 20201128 01.jpg, Peacearth, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Bunker_Hill_Monument_20201128_01.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the door's face on the obelisk (drawn on the north, toward the
 * lodge) is not confirmed by a photo; the lodge's back is unphotographed and
 * drawn plain. The Prescott statue, fence and park are not modelled.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'

const granite = new Part(), lodge = new Part(), win = new Part(), door = new Part(), roof = new Part()

// ── The obelisk ──
const BASE = 1.6, B0 = 9.14 / 2, B1 = 4.57 / 2, SHAFT = BASE + 63.2, APEX = BASE + 65.4, C = 0.25
const half = (z: number) => B0 + (B1 - B0) * Math.max(0, (z - BASE) / (SHAFT - BASE))
const sq = (h: number, z: number): V3[] => {
  const c = Math.min(C, h * 0.2)
  return [[-h + c, -h, z], [h - c, -h, z], [h, -h + c, z], [h, h - c, z], [h - c, h, z], [-h + c, h, z], [-h, h - c, z], [-h, -h + c, z]]
}
granite.loft([sq(half(0) + 0.02, 0), sq(half(BASE), BASE), sq(half(SHAFT), SHAFT)])
{
  const r = sq(B1, SHAFT), apex: V3 = [0, 0, APEX]
  for (let i = 0; i < r.length; i++) granite.tri(r[i], r[(i + 1) % r.length], apex)
}
// A flat panel on one face, turned from the south face by quarter turns.
function panel(p: Part, face: number, s0: number, s1: number, z0: number, z1: number) {
  const a = (face * Math.PI) / 2, cs = Math.cos(a), sn = Math.sin(a)
  const pt = (s: number, z: number): V3 => { const x = s, y = -half(z) - 0.04; return [x * cs - y * sn, x * sn + y * cs, z] }
  p.quad(pt(s0, z0), pt(s1, z0), pt(s1, z1), pt(s0, z1))
}
for (let f = 0; f < 4; f++) panel(win, f, -0.35, 0.35, SHAFT - 3.2, SHAFT - 2.0)
panel(door, 2, -0.8, 0.8, BASE, BASE + 3.0) // face 2 is north, toward the lodge

// ── The lodge ──
// Body x -5.2..6.9, y 10..25.5; the centre range y 15.2..21.3 rises a little;
// the portico x 6.9..9.6 on the east front.
const LZ = 6.8
box(lodge, -5.2, 6.9, 10.0, 25.5, 0, LZ - 0.6, null, 0)
// cornice and the flat roof
box(lodge, -5.5, 7.2, 9.7, 25.8, LZ - 0.6, LZ, roof, 0.2)
// windows and doors on the east front either side of the portico
for (const yc of [12.6, 23.0]) onWall(win, [6.9, 10], [6.9, 25.5], rectShape(yc - 10 - 0.6, yc - 10 + 0.6, 2.6, 4.6), 0.05)
onWall(door, [6.9, 10], [6.9, 25.5], rectShape(17.6 - 10, 18.8 - 10, 1.2, 4.1), 0.05)
// side windows and doors (Swampyank)
onWall(win, [6.9, 25.5], [-5.2, 25.5], rectShape(3.0, 4.0, 2.6, 4.6), 0.05)
onWall(door, [6.9, 25.5], [-5.2, 25.5], rectShape(6.5, 7.9, 1.0, 3.6), 0.05)
onWall(win, [-5.2, 10], [6.9, 10], rectShape(8.0, 9.0, 2.6, 4.6), 0.05)
// the portico: steps, six columns, entablature, pediment
box(lodge, 6.9, 9.8, 15.0, 21.5, 0, 1.2, lodge, 0.1)
for (let i = 0; i < 6; i++) revolve(lodge, [9.0, 15.6 + (i * 5.2) / 5], [[0.36, 1.2], [0.3, 5.3], [0.42, 5.4], [0.42, 5.6]], 8, 0, false, true)
box(lodge, 6.9, 9.7, 15.0, 21.5, 5.6, LZ + 0.2, null, 0.1)
{
  const x0 = -5.2, x1 = 9.8, y0 = 15.0, y1 = 21.5, z0 = LZ + 0.2, z1 = LZ + 1.4, ym = (y0 + y1) / 2
  // a low gable running east–west over the centre range, pediment to the east
  roof.quad([x0, y0, z0], [x1, y0, z0], [x1, ym, z1], [x0, ym, z1])
  roof.quad([x1, y1, z0], [x0, y1, z0], [x0, ym, z1], [x1, ym, z1])
  lodge.tri([x1, y0, z0], [x1, y1, z0], [x1, ym, z1])
  lodge.tri([x0, y1, z0], [x0, y0, z0], [x0, ym, z1])
  box(lodge, x0, x1, y0, y1, LZ, z0, null, 0)
  // the acroterion over the pediment
  box(lodge, x1 - 0.35, x1, ym - 0.35, ym + 0.35, z1 - 0.1, z1 + 0.6, lodge, 0.1)
}

const lit = (p: V3, n: V3) => (n[2] > 0.5 ? 0.3 : 0.95 - 0.35 * (p[2] / APEX))
await save('bos-bunker-hill-monument', 'Bunker Hill Monument', [
  { part: granite, material: { ...finish('bunker-granite', 0xb0aa9c), floodlight: lit } },
  { part: lodge, material: finish('bunker-lodge-granite', 0xc9c4b8) },
  { part: roof, material: finish('bunker-lodge-roof', 0xa9b0ad) },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('bunker-door', 0x7a5a48) },
], { height: APEX, anchor: [42.3763523, -71.0607674], bearing: 17.3 })
