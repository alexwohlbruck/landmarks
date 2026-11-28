/**
 * 909 Walnut (Fidelity National Bank and Trust Building, 1931, Hoit, Price
 * & Barnes), 909 Walnut Street, Kansas City, Missouri — original procedural
 * geometry, CC0-1.0.
 * bun generators/kc-909-walnut.ts
 *
 * Uses the setback kit in kc-power-and-light-building.ts (`Tower`,
 * `groups`).
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of OSM way/203837841, -94.5815712 39.1032259.
 * Its walls run at 2.4° / 92.4° (the downtown grid), so the bearing is 2.4
 * and the model is square to its own frame. Elevation 0.
 *
 * Identity, in order: the slender pale buff slab, long north-south, rising
 * from a six-storey base that fills the lot; its twin crown: two square
 * turrets at the north and south ends, each under a steep green copper
 * pyramid and finial, with the pinnacled parapet of the top stage running
 * between them; the corners notched near the top and the ornamented top
 * stage above a cornice line; the vertical window columns of the shaft.
 *
 * Evidence
 * - OSM way/203837841 (35 levels, Q4645620), the lot outline (33.7 × 50.1 m),
 *   and its tower part way/466563977 (height 138, 35 levels; x -7.9..7.7,
 *   y -24.4..19.4 in this frame). The 909 Walnut Garage (way/1342723929)
 *   only shares the south edge.
 * - USGS 3DEP lidar MO_FEMANRCS_1_2020 (2020 flight), 0.5 m, read in this
 *   frame (it agrees with the tower part within ~1 m). The roof returns are
 *   sparse (dark roofs), but every tier shows. Heights above y = 0 (the
 *   west side; the ground rises ~3 m to the north-east), measured: the base
 *   roof 21.6 with parapets 24.8; a ledge on the long sides at 110.3; the
 *   corners notched at 92.2; the two turrets 11 m square, centred 13.7 m either side
 *   of the middle (y 10.5 and -17), their walls to ~130.5, the pyramids to
 *   ~137, the finials 139.9; a small roof house 120.5 between them. OSM's
 *   138 agrees. Published 35 storeys, 1931 (Wikipedia; NRHP).
 * - Photos: "909 Walnut Kansas City MO.jpg" (User:Charvex, public domain;
 *   the long face from the west: the shaft's window columns, the cornice line
 *   at ~101 m (scaled by the 44 m face, 6.6 px/m), the top stage to its
 *   pinnacled parapet at ~114.5-118.5, the
 *   turrets ~10 m wide with 2 window columns a face, the pyramids ~7 m tall,
 *   the colours); "909 Walnut viewed from the River Market District in Kansas
 *   City, Missouri.jpg" (Noah Bohland, CC BY-SA 4.0; from the north: the
 *   narrow face, the two turrets one behind the other).
 * - Estimated: the bay (3.4 m) and the storey (3.8 m); the top stage's
 *   inset (0.8 m) and windows; the pinnacles (1.2 m blocks, 2.6 m tall);
 *   the turret windows; the base's windows (hidden by the trees and the
 *   building in front in both photos).
 * - Doubts: the east face and the base are not seen in any licensed photo;
 *   they repeat the west. The assignment notes said brick/terracotta with a
 *   stepped crown; the photos show pale buff stone and two turrets.
 *
 * Colours: the stone reads a warm pale buff in sun (#cbbd9f, Charvex),
 * pulled to the palette's lightness; the ornament bands and pinnacles a
 * paler buff; windows the palette slate; the pyramids `patina`; roofs
 * `roof`. Night: the crown is floodlit (`_FLOODLIGHT` above the cornice).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, chamfer, onWall, panel, rect, save, spire, walls, type XY } from './chi-aon-center'
import { Tower, groups } from './kc-power-and-light-building'
import { stepped } from './kc-city-hall'

function build() {
  const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), copper = new Part()
  const T = new Tower(stone, roof, win)
  const ST = 3.8
  const CX = -0.1, CY = -2.5, HX = 7.8, HY = 21.9 // the tower part
  const BASE = 24.8, NOTCH = 92.2, CORNICE = 100.5, RIM = 114.5

  // --- the base, filling the lot, and its parapet roof
  const lot = rect(-16.9, -25.1, 16.9, 25.0)
  T.mass(lot, 0, BASE, 0.4)

  // --- the shaft, its corners notched above 92 m, and the top stage
  const shaft = rect(CX - HX, CY - HY, CX + HX, CY + HY)
  T.mass(shaft, BASE, NOTCH, 0.3)
  const notched = stepped(CX, CY, [[HX, HY - 1.6], [HX - 1.6, HY]])
  T.mass(notched, NOTCH, CORNICE, 0.3)
  const top = stepped(CX, CY, [[HX - 0.8, HY - 2.2], [HX - 2.2, HY - 0.8]])
  T.mass(top, CORNICE + 1.0, RIM, 0.3)
  block(trim, trim, notched.map(([x, y]) => [x + Math.sign(x - CX) * 0.5, y + Math.sign(y - CY) * 0.5] as XY), CORNICE, CORNICE + 1.0, 0.3) // the cornice line

  // the pinnacled parapet of the top stage, on its long sides and ends
  for (let i = 0; i < top.length; i++) {
    const a = top[i], b = top[(i + 1) % top.length], { L, P } = onWall(a, b)
    if (L < 5) continue
    const n = Math.round(L / 3.2)
    for (let k = 0; k <= n; k++) {
      const s = Math.min(L - 0.7, Math.max(0.7, L * k / n)), c = P(s, 0, -0.6)
      block(trim, trim, rect(c[0] - 0.65, c[1] - 0.65, c[0] + 0.65, c[1] + 0.65), RIM, RIM + 4.0, 0.2)
    }
  }
  block(stone, roof, rect(CX - 3, CY - 5, CX + 3, CY + 3), RIM, RIM + 2.5, 0.3) // the roof house between the turrets (lidar 120.5; kept under the pinnacles, no photo shows it)

  // --- the two turrets, their pyramids and finials
  const TH = 5.5, TW = 130.5, TP = 137.2, FIN = 139.9
  for (const ty of [10.5, -17]) {
    const t = chamfer(rect(CX - TH, ty - TH, CX + TH, ty + TH), 0.4)
    T.mass(t, RIM, TW - 1.2, 0.2, null)
    block(trim, null, t.map(([x, y]) => [CX + (x - CX) * 1.06, ty + (y - ty) * 1.06] as XY), TW - 1.2, TW, 0.25)
    const eave = rect(CX - TH - 0.3, ty - TH - 0.3, CX + TH + 0.3, ty + TH + 0.3)
    cap(copper, eave, TW, false)
    spire(copper, eave, TW, [CX, ty, TP])
    walls(trim, rect(CX - 0.18, ty - 0.18, CX + 0.18, ty + 0.18), TP - 0.4, FIN)
    // corner piers rising to pinnacles at the pyramid's foot
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const c: XY = [CX + sx * (TH - 0.6), ty + sy * (TH - 0.6)]
      block(trim, trim, rect(c[0] - 0.9, c[1] - 0.9, c[0] + 0.9, c[1] + 0.9), TW, TW + 2.2, 0.25)
    }
    // two tall window columns on every turret face
    for (const [a, b] of [[[CX - TH, ty - TH], [CX + TH, ty - TH]], [[CX + TH, ty - TH], [CX + TH, ty + TH]], [[CX + TH, ty + TH], [CX - TH, ty + TH]], [[CX - TH, ty + TH], [CX - TH, ty - TH]]] as [XY, XY][]) {
      for (const s of [3.4, 7.6]) for (const [z0, z1] of [[RIM + 4.6, TW - 2.6]]) panel(win, a, b, s - 0.8, s + 0.8, z0, z1, 0.05)
    }
  }

  // --- windows: three-storey groups on the base and the shaft
  T.windows(lot, [[1.0, 5.6], ...groups(6.4, BASE - 0.6, ST, 2, 1.2)], { bay: 3.4, fill: 0.55 })
  T.windows(shaft, groups(BASE + 0.6, NOTCH - 0.4, ST, 3, 2.6), { bay: 3.4, fill: 0.46, end: 1.4 })
  T.windows(notched, groups(NOTCH + 0.4, CORNICE - 0.4, ST, 2, 2.0), { bay: 3.4, fill: 0.46, end: 1.0, minLen: 6 })
  T.windows(top, [[CORNICE + 2.4, CORNICE + 6.6], [CORNICE + 8.4, RIM - 1.4]], { bay: 3.4, fill: 0.55, end: 1.0, minLen: 6 })

  // Night: the top stage and the turrets are floodlit, the shaft is not.
  const lit = (p: V3, n: V3) => (p[2] < CORNICE - 1 ? 0 : n[2] > 0.7 ? 0.3 : 1)
  return [
    { part: stone, material: { ...finish('kc909-stone', 0xdacdb2), floodlight: lit } },
    { part: trim, material: { ...finish('kc909-stone-pale', 0xe6dcc8), floodlight: lit } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: copper, material: { ...PALETTE.patina, floodlight: lit } },
  ]
}

if (import.meta.main) await save('kc-909-walnut', '909 Walnut', [39.1032259, -94.5815712], 2.4, build())
