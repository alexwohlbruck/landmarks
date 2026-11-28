/**
 * The Heman Marion Sweatt Travis County Courthouse (1931, Page & Brother
 * with Giesecke & Harris, Moderne; enlarged 1958-62), 1000 Guadalupe
 * Street, Austin — procedural, CC0-1.0, no textures.
 *   bun generators/atx-travis-county-courthouse.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 17.4, the downtown grid,
 * so +x is the front on Guadalupe Street (east-south-east) and +y runs up
 * towards 11th Street. Anchor = area centroid of OSM way/516187643,
 * -97.745271, 30.273387. z = 0 is the lowest ground under the footprint,
 * on the west (San Antonio Street) side; the Guadalupe sidewalk is 2.9 m
 * higher (lidar ground, and the map's terrain), so the west wings run that
 * much further down.
 *
 * Identity: a stepped pale limestone mass. The tall central block (the
 * 1958-62 top floors) rises over the 1931 wings, ringed at the top by a band
 * of big square stone grilles; in front, on Guadalupe, the 1931 entrance
 * front with four pilasters running up past the parapet and three tall
 * window bands between them over the steps, low projecting blocks to either
 * side, and lower wings stepping down behind and to the south and west.
 *
 * Numbers (lidar = USGS 3DEP USGS_LPC_TX_Central_B1_2017_LAS_2019, flown
 * 2017, 1 m grid read in this frame; every top below is lidar minus the
 * base ground):
 *  - the tall block x -12..15.5 (y -13..11) and x -13..20.3 (y 11..30), top
 *    27.8; its penthouse 30.7; the stair tower at its north-west corner
 *    31.1;
 *  - the 1931 east wing x 15.5..26.8, y -13..12.5, and west wing
 *    x -21.5..-12, top 22.3, the entrance pilasters to 23.6;
 *  - the low projection on the front x 20.3..30, y 7.7..17, top 15.5; the
 *    entrance annex south of the steps (OSM's outline to x 30, y -17..-8.9)
 *    is low, EG + 3.6 ("highsmith" shows the front's window strips over it;
 *    the lidar's 15 m there is the trees in front); the south wing y -31..-13, top 14.5; the west low wing
 *    x -31..-21.5, top 10.2; the north-west pieces 14.3 and 17.6;
 *  - OSM's height=62.78 is wrong (the lidar's highest roof is 31 m over the
 *    base; the antenna mast is left out);
 *  - the front: pilasters 3.8 m apart, window bands 2.1 m wide from 3.5 to
 *    16.3 m over the sidewalk in four storeys, roundels over them, single
 *    window columns either side: scaled on "highsmith" (taken square on,
 *    30 px a metre at the facade), and the sidewalk-to-parapet height there
 *    (19.7 m) matches the lidar's 19.4;
 *  - the grille band 22.3..26.3 (on the tall block's north part and its
 *    sides, not over the 1931 front) and the tall block's three window
 *    columns on the east, running down to the sidewalk; the front's
 *    medallions and the dark spandrel between the window groups: "highsmith" and "moore11"; on the north, eleven columns
 *    and the grilles all round: "snow";
 *  - colours from "highsmith" (overcast) and "moore11" (sun), pulled to the
 *    palette's lightness: the limestone #e3d8c3, the grilles a mid stone
 *    grey #a39e93 (stone lattice over dark openings, averaged).
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  highsmith "The "Moderne" style Travis County Courthouse in Austin, Texas",
 *            Carol M. Highsmith, public domain (square on from Guadalupe)
 *            https://commons.wikimedia.org/wiki/File:The_%22Moderne%22_style_Travis_County_Courthouse_in_Austin,_Texas_LCCN2014632374.tif
 *  moore11   "Travis courthouse 2011.jpg", Larry D. Moore, CC BY 4.0 (the
 *            front from Guadalupe)
 *            https://commons.wikimedia.org/wiki/File:Travis_courthouse_2011.jpg
 *  snow      "Travis County Court House in snow during the 2021 Texas power
 *            crisis.jpg", Jno.skinner, CC BY-SA 4.0 (from 11th and
 *            Guadalupe: the north face of the tall block)
 *            https://commons.wikimedia.org/wiki/File:Travis_County_Court_House_in_snow_during_the_2021_Texas_power_crisis.jpg
 *  rutledge  "Travis County Courthouse.jpg", Matthew Rutledge, CC BY 2.0
 *            (night: the floodlit upper walls)
 *            https://commons.wikimedia.org/wiki/File:Travis_County_Courthouse.jpg
 * Also OSM (ODbL) and the lidar. No look-only sources, no commercial imagery.
 *
 * Replaces way/516187643.
 *
 * Doubts: no licensed photo of the west or south sides: their windows are
 * generic grouped panels at the measured heights. The entrance kiosk south
 * of the steps and the antenna mast are left out. The blocks' edges are
 * read off a 1 m lidar grid, good to about half a metre.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, edgePanels, save, type XY } from './atl-flatiron-building'
import { flush } from './atx-governors-mansion'

const stone = new Part(), pil = new Part(), roof = new Part(), win = new Part(), grille = new Part(), door = new Part()

const EG = 2.9 // the Guadalupe sidewalk over the base

// ── the masses ──
type Block = [number, number, number, number, number] // x0 x1 y0 y1 top
const TALL1: Block = [-12, 15.5, -13, 11, 27.8], TALL2: Block = [-13, 20.3, 11, 30, 27.8]
const EAST: Block = [15.5, 26.8, -13, 12.5, 22.3], WEST: Block = [-21.5, -12, -13, 12.5, 22.3]
const NE: Block = [20.3, 30.0, 7.7, 17.06, 15.5], SE: Block = [21.0, 30.0, -17.1, -8.87, EG + 3.6]
const SOUTH: Block = [-13.2, 21.0, -31.0, -13, 14.5], WLOW: Block = [-31.0, -21.5, -16.6, 17.5, 10.2]
const NWC: Block = [-21.5, -13, 12.5, 17.4, 14.3], NWB: Block = [-19.2, -16.5, 17.4, 24.7, 17.6], STAIR: Block = [-16.5, -12.5, 17, 26, 31.1]
const blocks = [TALL1, TALL2, EAST, WEST, NE, SE, SOUTH, WLOW, NWC, NWB, STAIR]
for (const [x0, x1, y0, y1, t] of blocks) {
  box(stone, x0, x1, y0, y1, 0, t - 0.6, null, 0)
  // a parapet with a bevelled coping, the roof inside it
  box(stone, x0, x1, y0, y1, t - 0.6, t, null, 0.15)
  box(roof, x0 + 0.4, x1 - 0.4, y0 + 0.4, y1 - 0.4, t - 0.6, t - 0.35, roof, 0)
}
// the penthouse on the tall block
box(stone, -2, 8, 0, 8, 27.8, 30.7, roof, 0.3)

// ── the grille band round the top of the tall block ──
function grilles(a: XY, b: XY, n: number, margin: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), w = (L - 2 * margin) / n
  for (let k = 0; k < n; k++) flush(grille, a, b, margin + k * w + 0.4, margin + (k + 1) * w - 0.4, 22.3, 26.3, 0.05)
}
grilles([20.3, 11], [20.3, 30], 3, 1.5) // east: three, over the front ("highsmith")
grilles([20.3, 30], [-13, 30], 10, 1.2) // north: ten, over the ten window columns ("snow")
grilles([-13, 30], [-13, 26], 1, 0.3) // either side of the stair tower
grilles([-13, 17], [-13, 11], 1, 0.3)
grilles([-12, 11], [-12, -13], 6, 1.0)
grilles([-12, -13], [15.5, -13], 7, 1.0)
// (none on the east face over the 1931 front: plain stone there in "highsmith" and "moore11")

// ── the windows ──
// the tall block's faces under the grilles: window columns in three-storey panels
const tallPanels = { group: 4.6, gap: 0.8, bay: 2.6, pier: 1.2, margin: 1.2 }
// the tall block's east face north of the projection runs down to the sidewalk: three narrow window
// columns in three groups with dark spandrels between ("highsmith")
for (const y of [19.6, 23.5, 27.4]) {
  const a: XY = [20.3, 17.06], b: XY = [20.3, 30], c = y - 17.06
  for (const [z0, z1] of [[EG + 3.2, EG + 7.8], [EG + 8.6, EG + 13.2], [EG + 14.0, 21.4]]) flush(win, a, b, c - 0.8, c + 0.8, z0, z1, 0.05)
  for (const z of [EG + 7.8, EG + 13.2]) flush(grille, a, b, c - 0.8, c + 0.8, z, z + 0.8, 0.05)
}
edgePanels(win, [20.3, 30], [-13, 30], 3.5, 21.4, { ...tallPanels, group: 6.0, bay: 2.9, pier: 1.3 }) // ten tall strips in three groups ("snow")
edgePanels(win, [-13, 30], [-13, 26], 3.5, 21.4, tallPanels)
edgePanels(win, [-12, 11], [-12, -13], 22.3 + 0.5, 27.0, { ...tallPanels, group: 4.2 })
edgePanels(win, [-12, -13], [15.5, -13], 14.5 + 0.8, 21.4, tallPanels)

// the 1931 front on Guadalupe (x = 26.8): four pilasters up past the parapet,
// three tall window bands between them, a window column either side
{
  const a: XY = [26.8, -13], b: XY = [26.8, 12.5], s = (y: number) => y + 13
  const YC = -4.1, PIL = 3.8
  for (let k = -1.5; k <= 1.5; k++) {
    const y = YC + k * PIL
    // in the pale trim colour: in the photos they read by their shadows, which the
    // map's flat light doesn't give a face seen square on
    box(pil, 26.8 - 0.1, 27.7, y - 0.5, y + 0.5, EG, 24.0, pil, 0.2)
    box(pil, 26.8 - 0.1, 27.4, y - 0.3, y + 0.3, 24.0, 24.8, pil, 0.12)
  }
  for (const k of [-1, 0, 1]) {
    const y = YC + k * PIL
    flush(win, a, b, s(y) - 1.05, s(y) + 1.05, EG + 3.3, EG + 9.0, 0.05)
    flush(grille, a, b, s(y) - 1.05, s(y) + 1.05, EG + 9.0, EG + 10.0, 0.05) // the dark spandrel
    flush(win, a, b, s(y) - 1.05, s(y) + 1.05, EG + 10.0, EG + 15.7, 0.05)
    // the round medallion over the strip
    {
      const c = s(y), zc = EG + 16.9, r = 0.65, P = (u: number, z: number): V3 => [26.85, a[1] + c + u, z]
      for (let k = 0; k < 12; k++) {
        const t0 = (k / 12) * 2 * Math.PI, t1 = ((k + 1) / 12) * 2 * Math.PI
        grille.tri(P(0, zc), P(-r * Math.cos(t1), zc + r * Math.sin(t1)), P(-r * Math.cos(t0), zc + r * Math.sin(t0)))
      }
    }
  }
  for (const y of [-11.7, 5.0]) {
    flush(win, a, b, s(y) - 0.85, s(y) + 0.85, EG + 3.3, EG + 9.0, 0.05)
    flush(grille, a, b, s(y) - 0.85, s(y) + 0.85, EG + 9.0, EG + 10.0, 0.05)
    flush(win, a, b, s(y) - 0.85, s(y) + 0.85, EG + 10.0, EG + 15.7, 0.05)
  }
  // the entrance: its stone surround, the doors, the steps down to the sidewalk
  box(stone, 26.8, 27.5, YC - 1.7, YC + 1.7, EG, EG + 6.4, stone, 0.2)
  flush(door, [27.5, YC - 1.7], [27.5, YC + 1.7], 0.75, 2.65, EG + 2.4, EG + 5.3, 0.05)
  for (let k = 0; k < 4; k++) box(stone, 27.5, 27.5 + 0.6 * (k + 1), YC - 2.4, YC + 2.4, 0, EG + 2.4 - 0.6 * k, stone, 0)
}
// the low projections either side of the front: three narrow window bands each
for (const [y0, y1] of [[7.7, 17.06]] as const) {
  const a: XY = [30, y0], b: XY = [30, y1], L = y1 - y0
  const n = L > 6 ? 3 : 1
  for (let k = 0; k < n; k++) {
    const s = L / 2 + (k - (n - 1) / 2) * 1.9
    flush(win, a, b, s - 0.6, s + 0.6, EG + 3.3, EG + 9.8, 0.05)
    flush(win, a, b, s - 0.6, s + 0.6, EG + 0.4, EG + 2.0, 0.05)
  }
}
// the wings' other faces: grouped panels at their storeys
const low = { group: 4.6, gap: 0.9, bay: 3.6, pier: 1.6, margin: 1.5 }
edgePanels(win, [-13.2, -31.0], [21.0, -31.0], 3.2, 13.0, low) // the south wing's south face
edgePanels(win, [21.0, -31.0], [21.0, -17.1], 3.2, 13.0, low)
edgePanels(win, [-13.2, -13], [-13.2, -31.0], 3.2, 13.0, low)
edgePanels(win, [-31.0, 17.5], [-31.0, -16.6], 1.5, 8.8, { ...low, group: 3.6 })
edgePanels(win, [-31.0, -16.6], [-21.5, -16.6], 1.5, 8.8, { ...low, group: 3.6 })
edgePanels(win, [-21.5, 12.5], [-21.5, -13], 10.2 + 1.0, 20.8, low)
edgePanels(win, [26.8, 12.5], [20.3, 12.5], 15.5 + 1.0, 20.8, { ...low, margin: 0.8 })
edgePanels(win, [30, 17.06], [20.3, 17.06], 3.2, 13.6, { ...low, margin: 0.8 })

const lit = (p: V3, n: V3) => (Math.abs(n[2]) < 0.5 && p[2] > 14 ? 0.55 : 0)
if (import.meta.main) {
  await save('atx-travis-county-courthouse', 'Heman Marion Sweatt Travis County Courthouse', [
    { part: stone, material: { ...finish('courthouse-limestone', 0xe3d8c3), floodlight: lit } },
    { part: pil, material: { ...PALETTE.trim, floodlight: lit } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: grille, material: finish('courthouse-grille', 0xa39e93) },
    { part: door, material: PALETTE.entrance },
  ], { bearing: 17.4, replaces: ['way/516187643'] }, 5000)
}
