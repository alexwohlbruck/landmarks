/**
 * Audrey Jones Beck Building, Museum of Fine Arts, Houston (5601 Main
 * Street, 2000, Rafael Moneo) — original procedural geometry, CC0-1.0.
 * bun generators/hou-mfah-beck-building.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Built turned to the block: catalog bearing 34.7 (the long sides
 * run at 34.7 deg, parallel to Main Street), so model +y points north-east
 * along Main Street, +x south-east to Main, -x north-west to the Law
 * Building. Anchor = centroid of the OSM outline way/45776251 ("Audrey Jones
 * Beck Building", wikidata Q119820228), 29.7250784, -95.3894815.
 *
 * Identity, in order: a blank, buff limestone box, stepped in a few tiers;
 * on its roof a field of small "lanterns" (Moneo's light monitors: pale
 * louvred boxes) in rows round the edges and larger raised blocks over the
 * central galleries, which is what the building looks like from above; the
 * covered walk under the north-west side.
 *
 * Evidence:
 *  - plan: OSM way/45776251 and its parts way/1559187457 (the main block,
 *    x -21.5..31.2, y -39.8..40.5, 3 levels) and way/1559187456 (a strip
 *    x -31.7..-21.5 along the north-west side, building:min_level 1: the
 *    upper floors over the covered walk seen in WhisperToMe's "Beck
 *    Building B"). Lidar agrees with both.
 *  - heights: USGS 3DEP lidar TX_Coastal_B1_2018 (flown 2018), 0.5 m grid,
 *    read in this frame; street ground 5.6 m over the grid minimum (a
 *    loading dock is the minimum). Above the street: edge walls 16-18 m
 *    (drawn 17.5; the south-east edge reads 16); the main roof deck 20-21 m
 *    (drawn 20.5) set back ~3 m from the north-east, south-west and
 *    south-east edges; the north-west strip 20 m; raised blocks 27 m at
 *    x -17..-1, y 8..24 and 24 m with lanterns to 26.5 m at x 2..29,
 *    y 8..17; a 24.5 m block at x 5..17, y -14..-4 (a hipped glass roof in
 *    NAIP); lanterns 3.5-6 m over the deck at the places listed in LANTERNS,
 *    each read from the lidar as a 3-7 m box at 24-27 m.
 *  - covered walk: ~5.5 m high under the strip, from "Beck Building B"
 *    (people for scale); estimated.
 *  - colours, sampled from the photos: limestone #e0d6c7 lit (drawn
 *    #e2d7c4); lanterns' grey louvres #a2a49d / #8e9690 (drawn #dfe2de,
 *    lighter, as they read from above in NAIP); roof deck grey-beige in NAIP
 *    (drawn #b9b5ab); glazing under the walk dark (palette window).
 *
 * Photos (evidence):
 *  - "Beck Building MFAH.jpg" / "Beck Building A.jpg", WhisperToMe, CC0
 *    (the Main Street side from the north-east)
 *    https://commons.wikimedia.org/wiki/File:Beck_Building_MFAH.jpg
 *  - "Beck Building B.jpg", "C", "D", "Audrey Jones Beck Building, Museum of
 *    Fine Arts, Houston.jpg", "MFAH Beck Bldg.jpg", "MfahHoustonbeckbldg.jpg",
 *    WhisperToMe, CC0 (the north-west side, the covered walk, the entrance)
 *    https://commons.wikimedia.org/wiki/File:Beck_Building_B.jpg
 *    https://commons.wikimedia.org/wiki/File:MFAH_Beck_Bldg.jpg
 *  - "Housmfa.jpg", Judson Dunn, CC BY-SA 2.0 (a long side with the row of
 *    lanterns on the skyline)
 *    https://commons.wikimedia.org/wiki/File:Housmfa.jpg
 *  USGS NAIP for the roof plan. Published: 2000, Rafael Moneo (Wikipedia,
 *  "Museum of Fine Arts, Houston"). No commercial imagery.
 *
 * Left out: the stone coursing, the few punched windows, the entrance
 * canopy and its struts, the porte-cochère opening, rooftop plant.
 *
 * Doubts: lanterns smaller than ~3 m may be missed by the 0.5 m lidar; the
 * louvres are drawn as plain pale boxes; which side Dunn's photo shows is
 * uncertain (it has no coordinates); the covered walk's height is an
 * estimate.
 *
 * Terrain: Mapterhorn shows 5.9 m of relief across the plan (the lidar
 * ground here is flat, 5.6 m over a loading-dock minimum); the model keeps
 * y = 0 at the street and `tools/terrain.ts check` prints ok.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { block, cap, rect, save, walls, type XY } from './chi-aon-center'
import { walls5, wallSeg } from './hou-mfah-law-building'

const EDGE = 17.5, DECK = 20.5, WALK = 5.5

// lanterns: x0, x1, y0, y1, top (lidar)
const LANTERNS: [number, number, number, number, number][] = [
  // the row along the north-west side
  [-27, -23, -37, -34, 24.5], [-27, -23, -30, -27, 24.5], [-28, -24, -24, -20, 24.5], [-27, -23, -17, -13, 24.5],
  [-27, -23, -10, -6, 24.5], [-27, -20, 8, 12, 24.5], [-27, -20, 13, 17.5, 24.5], [-27, -20, 18.5, 23, 24.5],
  [-14, -10.5, 0, 5, 24.5],
  // north-east end
  [-4, -1, 27, 30.5, 24.5], [2, 5, 27, 30.5, 24.5], [8, 11, 27, 30.5, 24.5], [13, 16, 27, 30.5, 24.5],
  [-16, -9, 27, 32, 26.5], [21, 25, 27, 32.5, 26.5],
  [-3, 0, 34, 37.5, 24], [5, 8, 34, 37.5, 24], [13, 16, 34, 37.5, 24],
  // over the galleries north of centre: five on the 24 m block
  [3, 7, 8.5, 16.5, 26.5], [8.5, 12.5, 8.5, 16.5, 26.5], [14, 18, 8.5, 16.5, 26.5], [19.5, 23.5, 8.5, 16.5, 26.5], [25, 28.5, 8.5, 16.5, 26.5],
  // east and south
  [19, 23, 1, 5, 24.5],
  [-2, 3, -22, -18, 26.5], [9, 13, -22, -18, 26.5], [-15, -11, -30, -20, 26.5], [21, 26, -30, -25, 26.5],
]

function build() {
  const lime = new Part(), lant = new Part(), roof = new Part(), win = new Part(), glass = new Part()

  const MAIN = rect(-21.5, -39.8, 31.2, 40.5), STRIP = rect(-31.7, -39.9, -21.5, 36.0)
  // the main block: edge walls, then the deck set back ~3 m (not on the north-west side)
  walls5(lime, MAIN, 0, EDGE)
  // top of the edge walls round the setback
  const deckR = rect(-21.6, -36.5, 28.2, 37.5)
  {
    const o = MAIN, i = deckR
    for (let k = 0; k < 4; k++) {
      const j = (k + 1) % 4
      roof.quad([o[k][0], o[k][1], EDGE], [o[j][0], o[j][1], EDGE], [i[j][0], i[j][1], EDGE], [i[k][0], i[k][1], EDGE])
    }
  }
  // the deck tier: walls from the edge top to the deck, flush on the north-west
  const tier = rect(-31.7, -36.5, 28.2, 37.5)
  block(lime, roof, tier, EDGE - 0.5, DECK, 0.4)

  // the north-west strip over the covered walk
  walls(lime, STRIP, WALK, DECK - 0.5)
  cap(lime, STRIP, WALK, false)
  cap(roof, STRIP, DECK - 0.5)
  // dark glazing along the walk, on the main block's north-west wall
  wallSeg(win, [-21.45, 34], [-21.45, -36], 0, WALK - 0.6)

  // raised blocks over the central galleries
  block(lime, roof, rect(-17, 8, -1, 24), DECK - 0.5, 27, 0.4)
  block(lime, roof, rect(2, 8, 29, 17), DECK - 0.5, 24, 0.4)
  // central hall: a 24.5 m block with a hipped glass roof
  {
    const r = rect(5, -14, 17, -4)
    block(lime, null, r, DECK - 0.5, 23.2, 0.3)
    const top = rect(8.5, -11, 13.5, -7)
    walls(glass, r, 23.2, 25.2, top)
    cap(glass, top, 25.2)
  }

  // the lanterns: pale louvred boxes with a bevelled top
  for (const [x0, x1, y0, y1, z] of LANTERNS) {
    const base = x0 >= 2 && y0 >= 8 && y1 <= 17 ? 24 : DECK
    block(lant, lant, rect(x0, y0, x1, y1), base - 0.3, z, 0.35)
  }

  const flood = (p: V3, n: V3) => (n[2] < 0.5 && p[2] > 2 && p[2] < EDGE + 3 ? 0.45 : 0)
  return [
    { part: lime, material: { ...finish('mfah-beck-limestone', 0xe2d7c4), floodlight: flood } },
    { part: lant, material: finish('mfah-beck-lantern', 0xdfe2de) },
    { part: roof, material: finish('mfah-beck-roof', 0xb9b5ab) },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
  ]
}

if (import.meta.main) await save('hou-mfah-beck-building', 'Audrey Jones Beck Building', [29.7250784, -95.3894815], 34.7, build())
