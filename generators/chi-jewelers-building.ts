/**
 * Jewelers Building (35 East Wacker, 1927, Giaver & Dinkelberg with
 * Thielbar & Fugard), Chicago — original procedural geometry, CC0-1.0.
 * bun generators/chi-jewelers-building.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/124865488,
 * 41.886527,-87.626793. The plan is drawn from OSM's own coordinates
 * (faces at 89.7° / 179.5°), so the catalog bearing is 0.
 *
 * Identity, in order: the domed temple on top of the tower, a square
 * colonnaded drum with corner pinnacles under a ribbed dome and lantern;
 * the four round tempietti, little domed colonnades, on the corners of the
 * base's roof; the 23-storey base with the narrower tower centred on it;
 * the cream terracotta all over.
 *
 * Evidence:
 *  - plan: OSM outline 50.8 × 43.9 m (the base, way/686198237, 23 levels);
 *    the tower OSM way/686198235, 22.2 × 25.5 m, 40 levels, 160.65 m; the
 *    dome OSM way/686198236, ~12.5 m across.
 *  - heights: 160.65 m to the lantern (OSM; published 523 ft, 159 m). The
 *    base's cornice at ~88 m (23 floors of ~3.75 m and a taller ground
 *    floor) is from the proportions of Cbaile19's elevation from across
 *    the river. The tower's cornice is put at ~127 m so that the temple
 *    stage can carry what the photos show: a drum ~12 m tall, about as
 *    tall as the dome, ~17 m across (three quarters of the tower's top),
 *    and a dome ~14 m across (OSM's dome part says 12.5) with its lantern.
 *  - temple and tempietti: Cbaile19, Paul R. Burley, Antoine Taveneaux.
 *    The tempietti's size (~6.5 m across, ~20 m tall) is measured against
 *    the base's width in Cbaile19's photo.
 *  - colour: warm buff terracotta (Burley's close-up), a warm finish at the
 *    palette's lightness, the dome the same; cornices and colonnades trim.
 *
 * Estimated: window bay counts (thirteen a face on the base, six on the
 * tower, in three-storey groups), the temple's proportions within the
 * stage, the corner pavilions' size.
 *
 * Photos (Wikimedia Commons): 35_East_Wacker_Drive,_2013-09-21.jpg
 * (Cbaile19, CC0); 35_East_Wacker_Drive_Jewelers_Building_Chicago
 * _2017-12247.jpg (Paul R. Burley, CC BY-SA 4.0); 35_East_Wacker_2.jpg and
 * 35_East_Wacker.JPG (Antoine Taveneaux, CC BY-SA 3.0);
 * 35_East_Wacker,_Chicago_September_2016-41.jpg (Alvesgaspar, CC BY-SA
 * 4.0). No commercial imagery.
 *
 * Left out: the arcaded window bands, the clock, the car-lift penthouse
 * glazing on the base's roof, sculpture.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { bays, block, chamfer, lathe, parapetRoof, rect, rows, save, walls, type XY } from './chi-aon-center'

const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part()

const BX0 = -25.3, BX1 = 25.5, BY0 = -21.9, BY1 = 22.0
const TX0 = -12.0, TX1 = 10.2, TY0 = -13.2, TY1 = 12.3
const TCX = (TX0 + TX1) / 2, TCY = (TY0 + TY1) / 2
const BASE = 88, SHAFT = 127, TOP = 160.65

// Base: walls, a trim cornice, a parapet and roof.
const base = chamfer(rect(BX0, BY0, BX1, BY1), 0.5)
walls(stone, base, 0, BASE - 2.4)
walls(trim, base, BASE - 2.4, BASE - 1.2, base)
walls(stone, base, BASE - 1.2, BASE)
parapetRoof(stone, roof, base, BASE, 0.6, 1.0)
bays(win, rect(BX0, BY0, BX1, BY1), rows(8, BASE - 4, 9, 1.4), { bay: 1.7, gap: 1.75, end: 2.8 })
bays(win, rect(BX0, BY0, BX1, BY1), [[1, 6.8]], { bay: 3.6, gap: 1.6, end: 2.8 })

// Tempietti on the base's corners: a podium, a ring of six columns round a
// core, a cornice and a small dome.
function tempietto(cx: number, cy: number) {
  block(stone, roof, chamfer(rect(cx - 3.6, cy - 3.6, cx + 3.6, cy + 3.6), 0.8), BASE - 1, BASE + 3.8, 0.3)
  lathe(stone, cx, cy, [[1.6, BASE + 3.8], [1.6, BASE + 12.8]], 8)
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * 2 * Math.PI
    lathe(trim, cx + 2.5 * Math.cos(a), cy + 2.5 * Math.sin(a), [[0.42, BASE + 3.8], [0.42, BASE + 12.8]], 6)
  }
  lathe(trim, cx, cy, [[3.2, BASE + 12.8], [3.2, BASE + 14.1], [2.7, BASE + 14.3], [2.5, BASE + 15.7], [1.7, BASE + 17.2], [0.5, BASE + 17.9], [0.3, BASE + 19.8], [0, BASE + 20.0]], 10)
}
for (const [x, y] of [[BX0 + 4, BY0 + 4], [BX1 - 4, BY0 + 4], [BX1 - 4, BY1 - 4], [BX0 + 4, BY1 - 4]]) tempietto(x, y)

// Tower: shaft, trim cornice, parapet with corner pinnacles.
const tower = chamfer(rect(TX0, TY0, TX1, TY1), 0.5)
const flare = chamfer(rect(TX0 - 0.5, TY0 - 0.5, TX1 + 0.5, TY1 + 0.5), 0.6)
walls(stone, tower, BASE - 1, SHAFT)
walls(trim, tower, SHAFT, SHAFT + 1.4, flare)
walls(stone, flare, SHAFT + 1.4, SHAFT + 3)
parapetRoof(stone, roof, flare, SHAFT + 3, 0.6, 1)
bays(win, rect(TX0, TY0, TX1, TY1), rows(BASE + 1, SHAFT - 1.2, 4, 1.4), { bay: 1.5, gap: 1.75, end: 2.4 })
for (const [x, y] of [[TX0 + 1.1, TY0 + 1.1], [TX1 - 1.1, TY0 + 1.1], [TX1 - 1.1, TY1 - 1.1], [TX0 + 1.1, TY1 - 1.1]]) {
  block(stone, null, chamfer(rect(x - 1.3, y - 1.3, x + 1.3, y + 1.3), 0.3), SHAFT + 3, SHAFT + 6.5, 0.2)
  lathe(trim, x, y, [[1.1, SHAFT + 6.5], [0.8, SHAFT + 8.5], [0, SHAFT + 11]], 8, Math.PI / 8)
}

// Temple: a tall square drum with cut corners and arched windows, corner
// pavilions with cupolas, a cornice and attic, then the dome and lantern.
const T0 = SHAFT + 2.2, T1 = 141.5, DOME = 144, H = 8.6
const drum = chamfer(rect(TCX - H, TCY - H, TCX + H, TCY + H), 2.6)
walls(stone, drum, T0, T1)
const attic = chamfer(rect(TCX - H - 0.6, TCY - H - 0.6, TCX + H + 0.6, TCY + H + 0.6), 2.9)
walls(trim, drum, T1, T1 + 1.2, attic)
block(stone, roof, attic, T1 + 1.2, DOME, 0.4)
bays(win, rect(TCX - H, TCY - H, TCX + H, TCY + H), [[T0 + 2.2, T1 - 1.2]], { bay: 1.5, gap: 1.3, end: 3.6, minLen: 10 })
// Corner pavilions on the cut corners, each with a small cupola.
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  const x = TCX + sx * (H - 1.2), y = TCY + sy * (H - 1.2)
  block(stone, null, chamfer(rect(x - 1.5, y - 1.5, x + 1.5, y + 1.5), 0.4), T0, T1 + 3, 0.3)
  lathe(trim, x, y, [[1.4, T1 + 3], [1.3, T1 + 4], [0.9, T1 + 5], [0.3, T1 + 5.6], [0.15, T1 + 7], [0, T1 + 7.1]], 8, Math.PI / 8)
}
// The dome: about as tall as the drum, nearly as wide as the temple.
lathe(stone, TCX, TCY, [
  [7.2, DOME], [7.2, DOME + 1.4], [7.0, DOME + 2.8], [6.4, DOME + 5.0], [5.2, DOME + 7.0], [3.5, DOME + 8.6], [1.5, DOME + 9.6],
], 16)
lathe(trim, TCX, TCY, [[1.5, DOME + 9.6], [1.5, DOME + 12.6], [1.2, DOME + 13.2], [0.6, DOME + 14.2], [0.3, DOME + 15], [0, TOP]], 8)

await save('chi-jewelers-building', 'Jewelers Building', [41.886527, -87.626793], 0, [
  { part: stone, material: finish('jewelers-terracotta', 0xe9d4b8) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
])
