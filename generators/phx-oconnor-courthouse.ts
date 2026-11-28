/**
 * Sandra Day O'Connor United States Courthouse, Phoenix (2000, Richard
 * Meier & Partners) — original procedural geometry, CC0-1.0.
 * bun generators/phx-oconnor-courthouse.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * anchor. Bearing 0: the OSM walls run north–south and east–west. Anchor
 * -112.0804575, 33.4476699, the centroid of OSM way/37057889 ("Sandra Day
 * O'Connor United States Courthouse", 401 W Washington Street, wikidata
 * Q7416587). Washington Street runs along the north side, 4th Avenue the
 * east.
 *
 * Identity (from the photos below):
 *  1. The six-storey glass atrium filling the north half: a translucent
 *     curtain wall on Washington Street and the ends, tall white columns
 *     at each bay, and a thin folded roof whose gables show along the
 *     north front, overhanging it.          (gonzo, webster, webster2)
 *  2. Seen through the glass: the white courtroom block's north face,
 *     and the drum of the special-proceedings courtroom standing free
 *     in the atrium.                         (webster2; Wikipedia text)
 *     The atrium's folded roof is glazed between white ribs (NAIP).
 *  3. The white panelled courtroom block along the south, a taller white
 *     end block on the west, a white stair block on the east.
 *                                                    (gonzo, webster2)
 *
 * Plan: OSM way/37057889 as drawn: the atrium x -52.8..63.4, y -8..45.4;
 * the courtroom bar x -67.4..64.4, y -44.2..-8; the west block x
 * -67.4..-52.8, y -8..33.9; the east bump x 63.8..71, y -31..-9.6. The
 * split lines between the parts are read from the lidar.
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (2020 flight), 1 m grid;
 * the plaza round the building, 5.0 m above ground_min 325.95 (a garage
 * ramp to the west), is y = 0. Measured (model metres): the bar's roof
 * 31.1; the west block 34; the east bump 34.2; the atrium roof's eaves
 * 35.5 and its six ridges 39, about 19.4 m apart, running north–south.
 * Published: six storeys, 2000 (Wikipedia, GSA).
 * Estimated from webster2 and gonzo: the columns (0.9 m, every 19.4 m,
 * 1.6 m off the glass), the roof's overhang (2.4 m), the mullion lines.
 * The drum's place and size (r 11 at (-14, 20), 21 m tall) are a guess:
 * the published text puts it in the atrium, no open photo fixes where.
 *
 * Photos (evidence, Wikimedia Commons):
 *  gonzo    "Sandra Day OConnor US Courthouse Phoenix, Arizona.jpg",
 *           Gonzo fan2007, CC BY 4.0: from 4th Avenue and Washington
 *           https://commons.wikimedia.org/wiki/File:Sandra_Day_OConnor_US_Courthouse_Phoenix,_Arizona.jpg
 *  webster  "Sandra Day O'Connor U.S. Federal Courthouse, Phoenix,
 *           Arizona.jpg", Tony Webster, CC BY 2.0: the north glass wall,
 *           columns and folded roof, close
 *           https://commons.wikimedia.org/wiki/File:Sandra_Day_O%27Connor_U.S._Federal_Courthouse,_Phoenix,_Arizona.jpg
 *  webster2 "Sandra Day O'Connor United States Courthouse - Phoenix,
 *           Arizona (49343843277).jpg", Tony Webster, CC BY-SA 2.0: from
 *           the north-east, the whole north front and east end
 *           https://commons.wikimedia.org/wiki/File:Sandra_Day_O%27Connor_United_States_Courthouse_-_Phoenix,_Arizona_(49343843277).jpg
 * USGS NAIP orthophoto (public domain), 0.2 m: the glazed atrium roof and
 * its ribs, the plan, solar panels on the south block.
 * Published text: Wikipedia, "Sandra Day O'Connor United States
 * Courthouse" (the north-facing six-storey curtain wall, the drum-shaped
 * special-proceedings courtroom in the atrium).
 * No look-only sources. No commercial imagery.
 *
 * Translucent glass (STYLE.md): the atrium is the identity, so its walls
 * are `glass` at 0.3 opacity, double-sided, tinted clear blue, with the
 * courtroom block's face and the drum modelled behind them and a white
 * frame (columns, roof edge, sills) carrying the outline.
 *
 * Doubts: the south front on Jefferson Street and the west end are seen
 * in no photo; they are drawn as white panelled walls with grouped
 * windows. The drum's position is a guess (above). The V-struts at the
 * column heads and the louvres under the roof are left out.
 *
 * Night: the courtroom block's windows glow; the atrium glass stays dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, edgePanels, onWall, prism, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { wallLen } from './phx-st-marys-basilica'

const white = new Part(), glass = new Part(), win = new Part(), roof = new Part(), door = new Part()

const AX0 = -52.8, AX1 = 63.4, AY0 = -8, AY1 = 45.4, EAVE = 35.5, RIDGE = 39
const BAYS = 6, BW = (AX1 - AX0) / BAYS

// ── The courtroom bar, the west block and the east bump ──
box(white, -67.4, 64.4, -44.2, AY0, 0, 31.1, roof, 0.3)
box(white, -67.4, AX0, AY0, 33.9, 0, 34, roof, 0.3)
box(white, 63.4, 71, -31, -9.6, 0, 34.2, roof, 0.3)
const panels = (a: XY, b: XY, z0: number, z1: number) =>
  edgePanels(win, a, b, z0, z1, { group: 10.2, gap: 1.6, bay: 4.4, pier: 1.6, margin: 2.2, min: 6 })
panels([-67.4, -44.2], [64.4, -44.2], 1.2, 30) // south front
panels([-67.4, 33.9], [-67.4, -44.2], 1.2, 30) // west end
panels([AX0, 33.9], [-67.4, 33.9], 1.2, 30) // the west block's north end
panels([64.4, -44.2], [64.4, -31], 1.2, 30)
// the bar's north face inside the atrium: long bands of windows behind the glass
panels([AX1, AY0], [AX0, AY0], 1.2, 30)
// the east stair block: a tall slot of glass
onWall(win, [71, -31], [71, -9.6], rectShape(8, 13.4, 2, 31))

// ── The atrium: translucent walls, the white frame, the folded roof ──
const G = (a: XY, b: XY, z0: number, z1: number) => {
  // a glass wall a→b (outside to the right), double-sided in the material
  glass.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
}
G([AX1, AY1], [AX0, AY1], 0, EAVE) // north, on Washington Street
G([AX1, AY0], [AX1, AY1], 0, EAVE) // east end
G([AX0, AY1], [AX0, 33.9], 0, EAVE) // the west end's strip above the west block's corner
// the frame: sills, the roof edge band, a column per bay, mullion fins
box(white, AX0, AX1, AY1 - 0.3, AY1 + 0.3, 0, 0.9, white, 0.1)
box(white, AX1 - 0.3, AX1 + 0.3, AY0, AY1, 0, 0.9, white, 0.1)
for (let k = 0; k <= BAYS; k++) {
  const x = AX0 + k * BW
  box(white, x - 0.45, x + 0.45, AY1 + 1.2, AY1 + 2.1, 0, EAVE - 0.4, white, 0.15) // the free-standing column
  box(white, x - 0.2, x + 0.2, AY1 - 0.2, AY1 + 0.2, 0.9, EAVE, null, 0) // the mullion behind it
  // the strut from the column head back to the roof
  box(white, x - 0.3, x + 0.3, AY1, AY1 + 1.2, EAVE - 1.2, EAVE - 0.6, white, 0.05)
}
for (let k = 1; k < 6; k++) { const y = AY0 + (k * (AY1 - AY0)) / 6; box(white, AX1 - 0.2, AX1 + 0.2, y - 0.2, y + 0.2, 0.9, EAVE, null, 0) }
// light horizontal lines across the glass at the floors
for (const z of [7, 13, 19, 25, 31]) {
  box(white, AX0, AX1, AY1 - 0.08, AY1 + 0.08, z, z + 0.25, null, 0)
  box(white, AX1 - 0.08, AX1 + 0.08, AY0, AY1, z, z + 0.25, null, 0)
}

// the folded roof: six gables, ridges running north–south, overhanging north and east
{
  const OV = 2.4, Y0 = AY0 - 0.5, Y1 = AY1 + OV, T = 0.5
  for (let k = 0; k < BAYS; k++) {
    const x0 = AX0 + k * BW - (k === 0 ? 0.5 : 0), x1 = AX0 + (k + 1) * BW + (k === BAYS - 1 ? OV : 0), xm = AX0 + (k + 0.5) * BW
    const P = (x: number, y: number, z: number): V3 => [x, y, z]
    // the two slopes, their undersides and the gable edges
    // the slopes are glazed (NAIP): glass, with white ribs along the ridge, the
    // valleys and the middle of each slope
    glass.quad(P(x0, Y0, EAVE), P(xm, Y0, RIDGE), P(xm, Y1, RIDGE), P(x0, Y1, EAVE))
    glass.quad(P(xm, Y0, RIDGE), P(x1, Y0, EAVE), P(x1, Y1, EAVE), P(xm, Y1, RIDGE))
    for (const [xa, za] of [[x0, EAVE], [(x0 + xm) / 2, (EAVE + RIDGE) / 2], [xm, RIDGE], [(xm + x1) / 2, (EAVE + RIDGE) / 2], [x1, EAVE]] as Array<[number, number]>)
      box(white, xa - 0.35, xa + 0.35, Y0, Y1, za - 0.45, za + 0.08, white, 0)
    // the north gable's thin white edge, and the triangle of glass under it
    white.quad(P(x0, Y1, EAVE - T), P(x0, Y1, EAVE), P(xm, Y1, RIDGE), P(xm, Y1, RIDGE - T))
    white.quad(P(xm, Y1, RIDGE - T), P(xm, Y1, RIDGE), P(x1, Y1, EAVE), P(x1, Y1, EAVE - T))
    white.quad(P(x0, Y0, EAVE), P(x0, Y0, EAVE - T), P(xm, Y0, RIDGE - T), P(xm, Y0, RIDGE))
    white.quad(P(xm, Y0, RIDGE), P(xm, Y0, RIDGE - T), P(x1, Y0, EAVE - T), P(x1, Y0, EAVE))
    const g0 = AX0 + k * BW, g1 = AX0 + (k + 1) * BW
    glass.tri([g0, AY1, EAVE], [g1, AY1, EAVE], [xm, AY1, RIDGE - T])
  }
  // the east end's eave edge
  white.quad([AX1 + OV, Y0, EAVE - T], [AX1 + OV, Y1, EAVE - T], [AX1 + OV, Y1, EAVE], [AX1 + OV, Y0, EAVE])
}

// ── Inside the glass: the drum of the special-proceedings courtroom ──
const DC: XY = [-14, 20]
revolve(white, DC, [[11, 0], [11, 19.6], [11.4, 19.6], [11.4, 21]], 16, 0, false, false)
revolve(glass, DC, [[11.4, 21], [6, 22.2], [0, 22.6]], 16, 0, true, false) // its glass-lens roof
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * Math.PI * 2, c: XY = [DC[0] + 11.05 * Math.cos(a), DC[1] + 11.05 * Math.sin(a)]
  const t: XY = [-Math.sin(a), Math.cos(a)], p0: XY = [c[0] - t[0] * 1.4, c[1] - t[1] * 1.4], p1: XY = [c[0] + t[0] * 1.4, c[1] + t[1] * 1.4]
  onWall(win, p0, p1, rectShape(0, wallLen(p0, p1), 12.5, 18.5), 0.05)
}

// the entrance on Washington Street: a canopy slab on posts and its doors
box(white, 20, 34, AY1 + 0.3, AY1 + 9, 5.6, 6.2, white, 0.1, true)
for (const x of [20.5, 33.5]) box(white, x - 0.25, x + 0.25, AY1 + 8.2, AY1 + 8.7, 0, 5.6, null, 0)
box(door, 22, 32, AY1 - 0.1, AY1 + 0.1, 0, 3.6, null, 0)

await save('phx-oconnor-courthouse', "Sandra Day O'Connor U.S. Courthouse", [
  { part: white, material: finish('meier-white', 0xf2f1ec) },
  { part: glass, material: { name: 'glass', color: 0x7fc4de, roughness: 0.24, opacity: 0.3, doubleSided: true } },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: door, material: PALETTE.entrance },
], { height: RIDGE, anchor: [33.4476699, -112.0804575], bearing: 0 })
