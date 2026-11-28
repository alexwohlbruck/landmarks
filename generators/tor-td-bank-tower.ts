/**
 * Toronto-Dominion Bank Tower, Toronto (1967, Ludwig Mies van der Rohe with
 * John B. Parkin and Bregman + Hamann) — original procedural geometry,
 * CC0-1.0.
 * bun generators/tor-td-bank-tower.ts
 *
 * Frame: x east-north-east +, y north-north-west +, z up, metres; origin
 * at the anchor on the ground. Bearing 343.3 (the Toronto street grid; the
 * OSM outline runs true in it). Anchor = area centroid of OSM
 * way/141693728: -79.3810709, 43.6475280.
 *
 * Identity (from the photos):
 *  1. A plain rectangular Miesian slab, 56 storeys, black-painted steel
 *     with bronze-tinted glass, the I-beam mullions giving a fine even
 *     vertical rhythm.                                   (findist, fcp)
 *  2. The open base: the glass lobby set back behind the perimeter
 *     columns, so the tower stands on a row of black columns.    (fcp)
 *  3. The darker louvred mechanical band at the top, under a flat roof.
 *                                                        (findist, td)
 *
 * Plan: OSM way/141693728, 75.7 x 39.5 m, drawn as its rectangle.
 * Heights (no lidar in Canada):
 *  - published: 223 m, 56 storeys (Wikipedia, "Toronto-Dominion Centre");
 *    OSM height 222.86.
 *  - City of Toronto 3D Massing 2025 (https://open.toronto.ca/dataset/3d-massing/):
 *    225.9 (lidar-derived, includes the roof plant). Used: roof 223.
 *  - estimated from fcp: the lobby 7 m tall, set back 4.7 m (half a bay)
 *    behind the columns; the mechanical band the top 8 m.
 *  - bays: eight across the long faces and four across the ends (the
 *    outline's 75.7 and 39.5 m on a ~9.5 m module).
 *  - ground: Mapterhorn z15 near flat here; elevation 0.
 *
 * Colours: the black steel and dark bronze glass are the identity (td,
 * lund), so both stay dark: steel at the STYLE charcoal floor #4a4f57, glass dark
 * bronze-charcoal #4f4a44 (the lead's review: the earlier #625d55 glass read
 * as a mid taupe box); the roof gravel a dark brown-grey so the roof edge
 * reads dark from above (td).
 *
 * Night: the office floors glow (lund, at night); nothing is floodlit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  findist "Toronto Financial District August 2017.jpg", Arild Vågen, CC BY-SA 4.0
 *          https://commons.wikimedia.org/wiki/File:Toronto_Financial_District_August_2017.jpg
 *  fcp     "First Canadian Place August 2017 01.jpg", Arild Vågen, CC BY-SA 4.0
 *          (the TD towers' black frames and the open lobby at the left)
 *          https://commons.wikimedia.org/wiki/File:First_Canadian_Place_August_2017_01.jpg
 *  td      "TD Tower (3600902026).jpg", veggiefrog, CC BY 2.0 — the roof and
 *          the louvred top band from above.
 *          https://commons.wikimedia.org/wiki/File:TD_Tower_(3600902026).jpg
 *  lund    "Toronto-Dominion Centre, Toronto, Ontario (21652484160).jpg",
 *          Ken Lund, CC BY-SA 2.0 — the towers at night.
 *          https://commons.wikimedia.org/wiki/File:Toronto-Dominion_Centre,_Toronto,_Ontario_(21652484160).jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the lobby setback and height are estimated; the mullions are
 * drawn as the panel grid, not as separate I-beams.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { box, edgePanels, prism, save, type XY } from './atl-flatiron-building'

const steel = new Part(), win = new Part(), roof = new Part()

const X0 = -37.85, X1 = 37.85, Y0 = -19.7, Y1 = 19.7, H = 223, LOBBY = 7.0, MECH = H - 8, SET = 4.7

// The shaft over the lobby, on its perimeter columns.
prism(steel, [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]], LOBBY, H, roof, 0.3, true)
box(win, X0 + SET, X1 - SET, Y0 + SET, Y1 - SET, 0, LOBBY, null, 0)
const nx = 8, ny = 4
for (let i = 0; i <= nx; i++) for (const y of [Y0, Y1]) {
  const x = X0 + ((X1 - X0) * i) / nx, yy = y === Y0 ? y + 0.45 : y - 0.45, xx = Math.min(X1 - 0.45, Math.max(X0 + 0.45, x))
  box(steel, xx - 0.45, xx + 0.45, yy - 0.45, yy + 0.45, 0, LOBBY, null, 0)
}
for (let j = 1; j < ny; j++) for (const x of [X0, X1]) {
  const y = Y0 + ((Y1 - Y0) * j) / ny, xx = x === X0 ? x + 0.45 : x - 0.45
  box(steel, xx - 0.45, xx + 0.45, y - 0.45, y + 0.45, 0, LOBBY, null, 0)
}
// Bronze glass: one panel per bay per three storeys, black piers and spandrels between.
const faces: [XY, XY, number][] = [[[X0, Y0], [X1, Y0], nx], [[X1, Y0], [X1, Y1], ny], [[X1, Y1], [X0, Y1], nx], [[X0, Y1], [X0, Y0], ny]]
for (const [a, b, n] of faces) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  edgePanels(win, a, b, LOBBY + 1.0, MECH - 0.8, { group: 11.7, gap: 0.9, bay: L / n, pier: 0.8, margin: 0.4 })
}

await save('tor-td-bank-tower', 'Toronto-Dominion Bank Tower', [
  { part: steel, material: finish('td-steel', 0x4a4f57) },
  { part: win, material: { ...PALETTE.window, color: 0x4f4a44 } },
  { part: roof, material: { ...PALETTE.roof, color: 0x6e6962 } },
], { anchor: [43.6475280, -79.3810709], bearing: 343.3 })
