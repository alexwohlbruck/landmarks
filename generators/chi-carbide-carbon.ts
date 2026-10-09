/**
 * Carbide & Carbon Building (230 North Michigan, 1929, Burnham Brothers;
 * now the Pendry hotel), Chicago — original procedural geometry, CC0-1.0.
 * bun generators/chi-carbide-carbon.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/148544831,
 * 41.886526,-87.625008 (the hotel outline, which takes in the five-storey
 * 222 North Michigan to the south as part way/148544830). Its faces run at
 * 89.3° / 179.3°, so the catalog bearing is 359.
 *
 * Identity, in order: the gold lantern on top, the "champagne cork"; the
 * dark green tower with its gold-tipped corner pinnacles and gold frieze;
 * the slab it rises from; the black granite base.
 *
 * Evidence:
 *  - plan: the Carbide & Carbon part, OSM way/147400407, 39.5 × 25.3 m, at
 *    the north end of the outline. The five-storey south part (OSM
 *    way/148544830, building:levels 5) is drawn as a plain stone block so the
 *    outline is covered.
 *  - heights: 153 m to the top of the lantern and 37 floors (published,
 *    Wikipedia, Emporis). The slab's top at ~88 m (24 floors), the tower's
 *    parapet at ~139 m and the lantern's 14 m are in the proportions of
 *    David Brossard's straightened telephoto (tower 2.75 widths tall above
 *    the slab, lantern 0.67 widths) and Teemu008's view up Michigan Avenue.
 *  - tower plan ~17 m square, set to the Michigan Avenue side and centred
 *    north-south: estimated from the same photos (the tower's east face
 *    nearly continues the avenue front in Teemu008's view).
 *  - crown: corner piers notched and rising as gold-capped pinnacles; a gold
 *    frieze band two floors under the parapet and another at the parapet;
 *    the lantern with stepped shoulders and a rounded top (Traveler100,
 *    Tony Hisgett, Brossard).
 *  - colour: black granite base (charcoal, the darkest STYLE.md allows);
 *    dark green terracotta pulled to a muted green; gold leaf as a muted
 *    gold finish; the slab's party walls are the same green here (their
 *    real buff brick shows only from the south).
 *
 * Photos (Wikimedia Commons): Carbide_&_Carbon_Building_(7185086785).jpg
 * (Teemu008, CC BY-SA 2.0); Carbon_and_Carbide_Building_-_Chicago_21
 * (3225183176)_straighten.jpg (David Brossard, CC BY-SA 4.0);
 * Carbide&CarbonBuildingTop-01.jpg (Traveler100, CC BY-SA 4.0);
 * Chicago_Buildings_3_(15613607781).jpg (Tony Hisgett, CC BY 2.0);
 * Carbide_&_Carbon_Building.jpg (Juan Lanzagorta Vallín, CC BY-SA 3.0).
 * No commercial imagery.
 *
 * Left out: the terracotta piers' gold tips down the slab, the lettering
 * and canopy at the entrance, the setback ledges of the slab's rear.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { bays, block, chamfer, lathe, parapetRoof, rect, rows, save, walls, type XY } from './chi-aon-center'

const annex = new Part(), green = new Part(), base = new Part(), gold = new Part(), win = new Part(), roof = new Part()

// The Carbide & Carbon part, relative to the hotel outline's centroid.
const X0 = -19.8, X1 = 19.8, Y0 = -3.6, Y1 = 21.8
const SLAB = 88, PARAPET = 139, LANTERN = 151, TOP = 153.2
const BASE = 13
// The tower: ~17 m square, at the avenue (east) side, centred north-south.
const TY = (Y0 + Y1) / 2, TW = 8.6, TX1 = X1 - 2.2, TX0 = TX1 - 2 * TW

// South part: 222 North Michigan, five storeys.
block(annex, roof, rect(X0, -22, X1, Y0 - 0.05), 0, 21, 0.4)
bays(win, rect(X0, -22, X1, Y0 - 0.05), rows(4.5, 20, 4, 1.2), { bay: 1.8, gap: 1.6 })

// Slab: black granite base, green above, a gold coping at the top.
const slab = chamfer(rect(X0, Y0, X1, Y1), 0.4)
walls(base, slab, 0, BASE)
walls(green, slab, BASE, SLAB - 1.2)
walls(gold, slab, SLAB - 1.2, SLAB - 0.4)
walls(green, slab, SLAB - 0.4, SLAB)
parapetRoof(green, roof, slab, SLAB, 0.5, 0.8)
bays(win, rect(X0, Y0, X1, Y1), rows(BASE + 1, SLAB - 2.5, 12, 1.6), { bay: 1.5, gap: 1.75, end: 1.4 })
bays(win, rect(X0, Y0, X1, Y1), [[1.5, BASE - 1.5]], { bay: 4, gap: 1.6, end: 2 })

// Tower: corner piers notched in 1.2 m, rising to gold-capped pinnacles.
const N = 1.2
const tower: XY[] = [
  [TX0 + N, TY - TW], [TX1 - N, TY - TW], [TX1 - N, TY - TW + N], [TX1, TY - TW + N], [TX1, TY + TW - N], [TX1 - N, TY + TW - N],
  [TX1 - N, TY + TW], [TX0 + N, TY + TW], [TX0 + N, TY + TW - N], [TX0, TY + TW - N], [TX0, TY - TW + N], [TX0 + N, TY - TW + N],
]
const F1 = PARAPET - 8, F2 = PARAPET - 1.4 // gold friezes
walls(green, tower, SLAB - 0.8, F1)
walls(gold, tower, F1, F1 + 1.2)
walls(green, tower, F1 + 1.2, F2)
walls(gold, tower, F2, PARAPET)
parapetRoof(green, roof, tower, PARAPET, 0.6, 0.8)
bays(win, rect(TX0 + N, TY - TW, TX1 - N, TY + TW), rows(SLAB + 1, F1 - 0.6, 7, 1.6), { bay: 2.2, gap: 2.2, end: 1.2 })
bays(win, rect(TX0 + N, TY - TW, TX1 - N, TY + TW), [[F1 + 1.8, F2 - 0.6]], { bay: 2.2, gap: 2.2, end: 1.2 })
// Pinnacles: the corner piers, stepping in and topped in gold.
for (const [cx, cy] of [[TX0 + N / 2, TY - TW + N / 2], [TX1 - N / 2, TY - TW + N / 2], [TX1 - N / 2, TY + TW - N / 2], [TX0 + N / 2, TY + TW - N / 2]]) {
  const sx = Math.sign(cx - (TX0 + TX1) / 2), sy = Math.sign(cy - TY)
  const p = (h: number) => chamfer(rect(cx - h - sx * 0.4, cy - h - sy * 0.4, cx + h - sx * 0.4, cy + h - sy * 0.4), 0.3)
  block(green, null, p(1.9), PARAPET - 0.8, PARAPET + 1.5, 0.3)
  block(gold, gold, p(1.3), PARAPET + 1.5, PARAPET + 4.2, 0.4)
}

// Lantern: a gold shaft with stepped shoulders and a rounded top.
const LX = (TX0 + TX1) / 2
const lantern = (h: number) => chamfer(rect(LX - h, TY - h, LX + h, TY + h), 0.5)
block(gold, gold, lantern(3.9), PARAPET - 0.9, PARAPET + 1.8, 0.4)
block(gold, gold, lantern(3.3), PARAPET + 1.8, PARAPET + 3.4, 0.4)
walls(gold, lantern(2.7), PARAPET + 3.4, LANTERN)
lathe(gold, LX, TY, [[2.7 * 1.08, LANTERN], [2.7, LANTERN + 0.7], [1.9, LANTERN + 1.6], [0.9, TOP - 0.1], [0, TOP]], 8, Math.PI / 8)
// Its tall windows, the clock oculus above them.
bays(win, rect(LX - 2.7, TY - 2.7, LX + 2.7, TY + 2.7), [[PARAPET + 4.2, LANTERN - 3.5]], { bay: 0.9, gap: 0.6, end: 0.9, minLen: 4 })

await save('chi-carbide-carbon', 'Carbide & Carbon Building', [41.886526, -87.625008], 359, [
  { part: green, material: finish('cc-green-terracotta', 0x7a9081) },
  { part: base, material: finish('black-granite', 0x4a4f57) },
  { part: gold, material: finish('cc-gold', 0xd2b066, 0.6) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: annex, material: PALETTE.stone },
])
