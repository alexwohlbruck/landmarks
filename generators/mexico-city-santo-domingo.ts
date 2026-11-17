/**
 * Templo de Santo Domingo, north side of the Plaza de Santo Domingo, Mexico
 * City — procedural, CC0-1.0, no textures. bun generators/mexico-city-santo-domingo.ts
 *
 * Map frame: x east, y north, z up, metres, turned to the church's axis: the
 * long walls of the OSM outline run at 7–8° east of north, so the placement
 * bearing is 7.5. The anchor is the area centroid of OSM way/1422338549
 * (lng -99.1336370, lat 19.4385509). The church's own axis lies at x 0.6.
 *
 * What it is: the Dominicans' church (Pedro de Arrieta's school, dedicated
 * 1736), the survivor of the great convent of Santo Domingo. A long
 * single-nave church with side chapels, facing south onto the plaza. The
 * front: red tezontle walls framed in grey cantera, the two-storey grey
 * retablo portal in the middle (arched door, a relief panel above) crowned by
 * a segmental gable with two windows; on the right a red bay whose top
 * sweeps down in a concave curve to a corner pinnacle; on the left (west)
 * the single bell tower, a red shaft with grey quoins, two open belfry
 * stages in grey stone between bold cornices, with corner pinnacles, a
 * gold-tiled cupola,
 * lantern and cross. The nave's barrel vault, the drum and pale dome with
 * lantern over the crossing near the altar end, pilaster-buttresses with
 * pinnacles down the east flank. The arcaded Capilla de la Expiración to
 * the west (way/1422338554) is a separate building, not covered.
 *
 * Covers and replaces way/1422338549 (building, place_of_worship "Santo
 * Domingo"); OSM maps no building:parts.
 *
 * Evidence
 * - OSM (measured, turned 7.5°): body x −12.0…14.8, y −38.4…34.6 (front
 *   27.8 m wide with the tower, 73 m long); tower bump x −13.4…−11.8 at the
 *   south-west; a chapel x −23.2…−12.0, y 17.5…30.8 on the west.
 * - Photo-scaled (estimated) on photo 2, a near square-on daylight view of
 *   the front, using OSM's 27.8 m front (21.4 px/m; a person by the door
 *   gives the same scale): tower 7.2 m wide, its red shaft to 18.3 m, first
 *   belfry stage to 25.1, second to 29.1, cupola to 31.6, cross 33.3 (drawn to 34.6, a bolder cross for phone
 *   sizes); the
 *   retablo 11.2 m wide (x −5.0…6.2), its storeys to 8.5 and 16.7, the
 *   gable to 21.6; the door 3.5 × 6.9 m; the walls and the right bay to
 *   16.4, its sweep from 19.9 down to 17.2. Dome position: over the crossing
 *   by the west chapel (y ≈ 21.5), size from photos 1 and 4 (drum ~8.8 m
 *   across to 20 m, dome to ~24.5, lantern and cross to ~28.5 m, well under
 *   the tower and set back so the front's gable hides it from the plaza):
 *   estimated; no open aerial of it was found. Dome colour: the pale grey
 *   of photos 1 and 4. Nave vault rise
 *   2.6 m: estimated. Pilaster rhythm on the east flank (~7.3 m) from
 *   photo 1.
 * - Published: dedicated 1736 (es.wikipedia "Templo de Santo Domingo
 *   (Ciudad de México)"); no published height.
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s); the
 *   Centro is on the flat lake bed (~2,240 m). Like most Centro churches it
 *   has settled; modelled level. Elevation 0.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 "Church of Santo Domingo (Mexico City) - 2.jpg", ProtoplasmaKid,
 *     CC BY-SA 3.0 — front and east flank from the south-east, the dome.
 *   2 "ChurchSantoDomingoDF.JPG", Thelmadatter, public domain — the front
 *     near square on; the tower stages.
 *   3 "Fachada del Templo de Santo Domingo de Guzmán (Cuauhtémoc).jpg",
 *     Huichol19, CC BY-SA 3.0 — the tower base and retablo close up.
 *   4 "PlazaSantoDomingoDF.JPG", Thelmadatter, public domain — the church
 *     from the plaza's south-west, tower and dome together.
 *   5 "Iglesia de Santo Domingo, CDMX.jpg", Muñoz LC, CC BY-SA 4.0 — night:
 *     the front floodlit, tower brightest.
 * - Look-only: none. No commercial imagery.
 * - Which side the tower is on: the west (left seen from the plaza), in
 *   photos 1–4.
 * - Simplified or left out: the retablo's columns are flat pilasters, its
 *   statues and relief are plain panels; the belfry balustrades, the bells,
 *   urns and the flank's side portal are left out.
 * - Doubts: the north end and the west flank above the chapel have no
 *   licensed photo (plain walls); the dome's exact place and size are
 *   estimates from oblique photos.
 * - Night: the front and tower are floodlit (photo 5).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, lathe } from './dc-nmaahc'
import { cbox, qf, tf } from './dc-white-house'
import { offsetPoly } from './dc-national-cathedral'
import { belfry, cross3, merlon, ringWalls, wpanel, warch, wprofile, wp, type XY } from './mexico-city-palacio-nacional'

type AZ = [number, number]
const X0 = -12.0, X1 = 14.8, Y0 = -38.4, Y1 = 34.6, ZW = 16.4
const AXIS = 0.6

function build() {
  const red = new Part(), grey = new Part(), roof = new Part(), win = new Part(), dome = new Part(), gold = new Part()

  // ---- Body: red walls, a pale parapet, terrace roof.
  const BODY: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
  ringWalls(red, BODY, 0, ZW)
  const IN = offsetPoly(BODY, -0.5)
  ringWalls(grey, BODY, ZW, ZW + 0.6)
  ringWalls(grey, IN, ZW, ZW + 0.6, true)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    qf(grey, [...BODY[i], ZW + 0.6] as V3, [...BODY[j], ZW + 0.6] as V3, [...IN[j], ZW + 0.6] as V3, [...IN[i], ZW + 0.6] as V3, [0, 0, 1])
  }
  roof.cap(IN.map(([x, y]) => [x, y, ZW] as V3), true)
  // West chapel by the crossing.
  cbox(red, { x0: -23.2, x1: X0, y0: 17.5, y1: 30.8 }, 0, 13.0, { top: roof })
  cbox(grey, { x0: -23.4, x1: X0, y0: 17.3, y1: 31.0 }, 13.0, 13.5, { b: 0.15, top: roof })

  // ---- Nave and presbytery barrel vaults (a flattened half-round).
  const vault = (y0: number, y1: number, hw: number, rise: number) => {
    const n = 8
    const P = (k: number, y: number): V3 => { const t = Math.PI * (1 - k / n); return [AXIS + hw * Math.cos(t), y, ZW + rise * Math.sin(t)] }
    for (let k = 0; k < n; k++) qf(roof, P(k, y0), P(k + 1, y0), P(k + 1, y1), P(k, y1), [Math.cos(Math.PI * (1 - (k + 0.5) / n)), 0, Math.sin(Math.PI * (1 - (k + 0.5) / n))])
    for (const [y, s] of [[y0, -1], [y1, 1]] as [number, number][]) for (let k = 0; k < n; k++) tf(grey, [AXIS, y, ZW], P(k, y), P(k + 1, y), [0, s, 0])
  }
  vault(-37.0, 16.1, 6.2, 2.6)
  vault(26.9, 33.6, 6.2, 2.6)

  // ---- Crossing: octagonal drum in cantera with windows, pale tiled dome,
  // lantern, gold cap, cross.
  const DC: XY = [AXIS, 21.5], RD = 4.4, ZD0 = ZW + 0.6, ZD1 = 20.0
  cbox(grey, { x0: AXIS - 5.4, x1: AXIS + 5.4, y0: 16.1, y1: 26.9 }, ZW, ZD0 + 0.4, { b: 0.2 })
  lathe(grey, DC[0], DC[1], [[RD, ZD0], [RD, ZD1], [RD + 0.35, ZD1], [RD + 0.35, ZD1 + 0.5], [RD - 0.2, ZD1 + 0.5]], 8, false)
  for (let k = 0; k < 8; k++) {
    // a window on each drum face, flush with the face
    const a = (k + 0.5) * (Math.PI / 4), ap = RD * Math.cos(Math.PI / 8) + 0.05
    const c: XY = [DC[0] + ap * Math.cos(a), DC[1] + ap * Math.sin(a)], t: XY = [-Math.sin(a), Math.cos(a)]
    const P = (u: number, z: number): V3 => [c[0] + t[0] * u, c[1] + t[1] * u, z]
    qf(win, P(-0.8, ZD0 + 1.0), P(0.8, ZD0 + 1.0), P(0.8, ZD0 + 3.6), P(-0.8, ZD0 + 3.6), [Math.cos(a), Math.sin(a), 0])
  }
  const prof: [number, number][] = []
  for (let k = 0; k <= 6; k++) { const t = (Math.PI / 2) * (k / 6); prof.push([(RD - 0.3) * Math.cos(t), ZD1 + 0.5 + 4.2 * Math.sin(t)]) }
  prof[prof.length - 1] = [1.0, ZD1 + 0.5 + 4.05]
  lathe(dome, DC[0], DC[1], prof, 16, false)
  const ZL = ZD1 + 0.5 + 4.05
  lathe(grey, DC[0], DC[1], [[1.0, ZL], [1.0, ZL + 1.8], [1.25, ZL + 1.8], [1.25, ZL + 2.1]], 8, false)
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2 + Math.PI / 8 * 0, ap = 1.0 * Math.cos(Math.PI / 8) + 0.04
    const c: XY = [DC[0] + ap * Math.cos(a + Math.PI / 8), DC[1] + ap * Math.sin(a + Math.PI / 8)], t: XY = [-Math.sin(a + Math.PI / 8), Math.cos(a + Math.PI / 8)]
    const P = (u: number, z: number): V3 => [c[0] + t[0] * u, c[1] + t[1] * u, z]
    qf(win, P(-0.25, ZL + 0.4), P(0.25, ZL + 0.4), P(0.25, ZL + 1.4), P(-0.25, ZL + 1.4), [Math.cos(a + Math.PI / 8), Math.sin(a + Math.PI / 8), 0])
  }
  lathe(gold, DC[0], DC[1], [[1.25, ZL + 2.1], [0.9, ZL + 2.5], [0.4, ZL + 2.8], [0, ZL + 2.9]], 8)
  cross3(grey, DC[0], DC[1], ZL + 2.8, ZL + 4.0)

  // ---- The front (south, y = Y0).
  const F = Y0 - 0.6 // the retablo's face
  // retablo: two storeys of grey cantera standing proud
  cbox(grey, { x0: -5.0, x1: 6.2, y0: F, y1: Y0 + 0.2 }, 0, 16.7, { b: 0.2 })
  for (const [z0, z1] of [[8.1, 8.6], [16.2, 16.9]]) cbox(grey, { x0: -5.4, x1: 6.6, y0: F - 0.35, y1: Y0 }, z0, z1, { b: 0.12, bottom: true })
  for (const [z0, z1] of [[0.6, 8.1], [8.6, 16.2]]) for (const x of [-4.1, -2.6, 3.8, 5.3]) cbox(grey, { x0: x - 0.32, x1: x + 0.32, y0: F - 0.3, y1: F }, z0, z1, { top: true })
  warch(win, 's', F, AXIS - 1.75, AXIS + 1.75, 0, 6.9, 0.05, 8) // the door
  cbox(grey, { x0: AXIS - 1.6, x1: AXIS + 1.6, y0: F - 0.2, y1: F }, 10.0, 14.6, { top: true }) // the relief
  // the gable with two windows, and its pinnacles
  const gableTop = 21.6, chord: [number, number] = [-4.8, 6.0], sag = gableTop - 19.9
  const R = (((chord[1] - chord[0]) / 2) ** 2 + sag * sag) / (2 * sag), zc = gableTop - R
  const g: AZ[] = [[chord[0], 16.9], [chord[1], 16.9], [chord[1], 19.9]]
  for (let k = 1; k < 10; k++) {
    const x = chord[1] - ((chord[1] - chord[0]) * k) / 10
    g.push([x, zc + Math.sqrt(R * R - (x - AXIS) ** 2)])
  }
  g.push([chord[0], 19.9])
  wprofile(grey, 's', F, g, 1.2, 0, true)
  for (const x of [-3.2, 2.8]) wpanel(win, 's', F, x, x + 1.6, 17.5, 19.4, 0.05)
  for (const x of [chord[0] + 0.4, chord[1] - 0.4]) merlon(grey, x, F + 0.4, 19.9, 0.7, 1.6)
  // the right bay: grey pilasters, two windows, the concave sweep
  cbox(grey, { x0: 6.2, x1: 7.4, y0: Y0 - 0.25, y1: Y0 + 0.2 }, 0, ZW + 0.6, { top: true })
  cbox(grey, { x0: 12.4, x1: X1 + 0.25, y0: Y0 - 0.25, y1: Y0 + 0.2 }, 0, ZW + 0.6, { top: true })
  wpanel(grey, 's', Y0, 9.0, 11.9, 3.6, 6.9, 0.03)
  wpanel(win, 's', Y0, 9.5, 11.4, 4.1, 6.4, 0.06)
  wpanel(grey, 's', Y0, 8.4, 10.6, 12.4, 15.4, 0.03)
  wpanel(win, 's', Y0, 8.8, 10.2, 12.9, 14.9, 0.06)
  const sweep: AZ[] = [[6.2, ZW + 0.6], [X1, ZW + 0.6], [X1, 17.2], [12.4, 17.2], [11.0, 17.5], [9.6, 18.2], [8.4, 19.1], [7.4, 19.9], [6.2, 19.9]]
  wprofile(red, 's', Y0, sweep, 0.8, 0, true)
  merlon(grey, 13.6, Y0 + 0.4, 17.2, 0.7, 1.5)

  // ---- The tower (south-west), x −13.4…−6.2.
  const TX = -9.8, TY = Y0 + 3.6, TH = 3.6
  cbox(red, { x0: TX - TH, x1: TX + TH, y0: Y0 - 0.1, y1: Y0 + 2 * TH }, 0, 17.6, { top: false })
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const x = TX + sx * (TH - 0.5), y = TY + sy * (TH - 0.5)
    cbox(grey, { x0: x - 0.7, x1: x + 0.7, y0: y - 0.75, y1: y + 0.7 }, 0, 17.6, { top: false })
  }
  cbox(grey, { x0: TX - TH - 0.6, x1: TX + TH + 0.6, y0: Y0 - 0.6, y1: Y0 + 2 * TH + 0.6 }, 17.5, 18.3, { b: 0.25, bottom: true })
  for (const [side, at, c] of [['s', Y0 - 0.1, TX], ['w', TX - TH, TY]] as const) {
    for (const [z0, z1] of [[3.6, 5.7], [12.0, 14.1]]) {
      wpanel(grey, side, at, c - 1.1, c + 1.1, z0 - 0.4, z1 + 0.4, 0.03)
      wpanel(win, side, at, c - 0.75, c + 0.75, z0, z1, 0.06)
    }
  }
  // belfry stages
  belfry(grey, roof, TX, TY, 2.9, 18.3, 24.4, 2.2, 0.55, 0.6, 0.6)
  cbox(grey, { x0: TX - 3.6, x1: TX + 3.6, y0: TY - 3.6, y1: TY + 3.6 }, 24.4, 25.1, { b: 0.22, bottom: true })
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) merlon(grey, TX + sx * 3.1, TY + sy * 3.1, 25.1, 0.85, 1.9)
  belfry(grey, roof, TX, TY, 2.25, 25.1, 28.5, 1.6, 0.45, 0.45, 0.4)
  cbox(grey, { x0: TX - 2.85, x1: TX + 2.85, y0: TY - 2.85, y1: TY + 2.85 }, 28.5, 29.1, { b: 0.18, bottom: true })
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) merlon(grey, TX + sx * 2.45, TY + sy * 2.45, 29.1, 0.65, 1.4)
  lathe(gold, TX, TY, [[2.0, 29.1], [1.95, 29.9], [1.6, 30.8], [1.0, 31.4], [0.6, 31.55]], 12, true)
  lathe(grey, TX, TY, [[0.6, 31.55], [0.6, 32.4], [0.8, 32.4], [0.35, 32.8], [0, 32.9]], 8)
  cross3(grey, TX, TY, 32.8, 34.6, 0.34)

  // ---- The east flank: pilaster-buttresses with pinnacles, windows.
  for (let k = 1; k <= 9; k++) {
    const y = Y0 + k * 7.3
    if (y > Y1 - 1) break
    cbox(grey, { x0: X1, x1: X1 + 0.7, y0: y - 0.55, y1: y + 0.55 }, 0, ZW + 0.6, { b: 0.15 })
    merlon(grey, X1 + 0.2, y, ZW + 0.6, 0.7, 1.4)
  }
  for (let k = 0; k < 9; k++) {
    const y = Y0 + (k + 0.5) * 7.3
    if (y > Y1 - 2) break
    warch(win, 'e', X1, y - 0.8, y + 0.8, 10.6, 13.8, 0.05, 6)
    if (k % 2 === 1) wpanel(win, 'e', X1, y - 0.6, y + 0.6, 3.2, 5.0, 0.05)
  }

  // Night: the front and the tower are floodlit.
  const lit = (p: V3, n: V3) => (n[2] > 0.6 ? 0 : p[1] < Y0 + 8 ? 0.95 : n[1] < -0.5 ? 0.8 : 0.3)
  return [
    { part: red, material: { ...finish('tezontle', 0x8a5a4e), floodlight: lit } },
    { part: grey, material: { ...finish('cantera-grey', 0xb3ada3), floodlight: lit } },
    { part: roof, material: finish('terrace-roof', 0xbf9c84) },
    { part: win, material: PALETTE.window },
    { part: dome, material: finish('dome-stone', 0xc2bdb4) },
    { part: gold, material: finish('gold-tile', 0xcfa954) },
  ]
}

if (import.meta.main) await save('mexico-city-santo-domingo', 'Templo de Santo Domingo', build(), { generator: 'generators/mexico-city-santo-domingo.ts' }, 6500)
