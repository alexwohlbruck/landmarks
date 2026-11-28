/**
 * One Kansas City Place (1988, Patty Berkebile Nelson Immenschuh), 1200 Main
 * Street, Kansas City, Missouri — original procedural geometry, CC0-1.0.
 * bun generators/kc-one-kansas-city-place.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Anchor = centroid of OSM way/132570884, -94.5837544
 * 39.0996844; walls at 2.1° (the downtown grid), so the catalog bearing is
 * 2.1. Elevation 0.
 *
 * Identity, in order: the tallest tower in Missouri, a blue reflective glass
 * slab on a dark granite podium; the notched corners; the stepped top, where
 * the long faces drop back in three tiers (a notched ring, then a cross whose
 * east-west arms stop short, then the square central block) to an octagonal
 * penthouse and the mast. The glass reads mid grey-blue in daylight, crossed
 * by a fine silver grid (drawn as a few pale lines every three storeys) and
 * by deep vertical reveals, which read darker (`window-2`).
 *
 * Note for the lead: the assignment described a pale granite tower with a
 * gabled crown and dark ribbon windows. Every photo of this building (and
 * the lidar) shows the blue glass tower with a flat stepped top; the pale
 * gabled tower beside it is 1201 Walnut. Modelled from the evidence.
 *
 * Evidence
 * - OSM way/132570884 (building=office, 42 levels, Q7092770; its height tag
 *   654 is wrong) and its parts: podium way/1345389972 (20 m), the west
 *   annex way/1345389978 (8 m), the entrance block way/1346067802 (4 m), the
 *   tower way/1345389973 (20-127 m), tiers way/1345389976 (142),
 *   way/1345389975 (163), way/1345389974 (173), the penthouse
 *   way/1345389977 (179). OSM's tower parts run 2-3 m wider than the
 *   lidar; the lidar's plan is used.
 * - USGS 3DEP lidar MO_FEMANRCS_1_2020 (2020 flight), 1 m, read at bearing
 *   1.3-2.1. Heights above the lowest ground (Walnut Street side, 270.5 m
 *   NAVD88; Main Street on the west is ~5 m higher), measured: podium 19;
 *   tower 126.5 over x -22..28, y -17.5..18, its four corners notched about
 *   2.5 m from ~61 m up; tier 141.5 over x -21..27, y -15..16, corners
 *   notched; the cross at 162.5 (east-west arms x -20.5..26.5, y -6..8);
 *   the central block 175 over x -10..18, y -14..14.5; the penthouse 178.5,
 *   ~12 m across; the mast to ~189. Published 190 m (623 ft), 42 floors
 *   (Wikipedia, CTBUH). All agree with OSM's part heights within 2 m.
 * - Photos: "One Kansas City Place KCMO.jpg" (User:Charvex, public domain;
 *   from the south-east: the stepped top, the glass colour, the reveals),
 *   "OneKCPlace.jpg" (Hello2020121212, CC BY-SA 4.0; from the north-east
 *   at the foot: the granite podium, the corner notch with its glazed bay,
 *   the grid), "One Kansas City Place Complex and Town Pavilion.JPG"
 *   (Baylor98, CC BY-SA 4.0; from the south-east, with Town Pavilion and
 *   1201 Walnut), "One Kansas City Place.JPG" (Little Mountain 5,
 *   CC BY-SA 3.0; the glass up close).
 * - Estimated: storey 4.1 m (42 floors to 175 m), the pale line spacing,
 *   the podium's window bands, the reveal positions (two per long face,
 *   one per short face, from the Charvex photo).
 *
 * Night: the curtain wall is `window` and `window-2` (an office tower,
 * lit); the podium's windows too. Nothing else is lit.
 *
 * Left out: the glazed corner bays' sloped heads, the mullion grid itself,
 * the plaza canopy, the mast's guys.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { block, cap, chamfer, inset, rect, save, walls, type XY } from './chi-aon-center'
import { Tower } from './kc-power-and-light-building'
import { notched } from './chi-board-of-trade'

function build() {
  const glass = new Part(), slot = new Part(), trim = new Part(), granite = new Part(), roof = new Part(), metal = new Part()
  const podiumWin = glass

  // Tower centre (lidar) in the anchor frame.
  const CX = 3, CY = 0.25
  const R = (x0: number, y0: number, x1: number, y1: number, n = 0) => notched(CX + x0, CY + y0, CX + x1, CY + y1, n)

  // --- podium (OSM way/1345389972, the west annex, the entrance block)
  const podium: XY[] = [[-26.7, -18.3], [-25.5, -18.3], [13.8, -19.8], [22.0, -20.1], [29.9, -20.4], [30.4, -8.4], [31.5, 20.4], [-25.0, 22.5], [-25.7, 4.5], [-25.9, -0.9]]
  const P = new Tower(granite, roof, podiumWin)
  P.mass(podium, 0, 19, 0.4)
  const annex = rect(-37.7, -17.9, -26.3, -0.6)
  P.mass(annex, 0, 11, 0.3)
  const entrance: XY[] = [[13.8, -24.9], [21.9, -24.9], [21.9, -20.0], [13.8, -19.7]]
  P.mass(entrance, 0, 4.5, 0.2)
  // the tower's foot buries the podium's roof where it stands
  const foot = R(-25, -17.75, 25, 17.75, 0)
  P.masses.push({ r: foot, z0: 19, z1: 126.5 })
  P.windows(podium, [[6.5, 9.5], [12, 16.5]], { bay: 5.5, fill: 0.6, end: 2 })

  // --- the glass tower: walls in glass, a pale coping, roofs
  const tier = (r: XY[], z0: number, z1: number) => {
    walls(glass, r, z0, z1 - 1.0)
    block(trim, roof, r, z1 - 1.0, z1, 0.35)
  }
  // pale lines: every three storeys round each tier, and at the reveals
  const STOREY = 4.1
  const lines = (r: XY[], z0: number, z1: number) => {
    const o = inset(r, -0.05)
    for (let z = z0 + 3 * STOREY; z < z1 - 3; z += 3 * STOREY) walls(trim, o, z, z + 0.3)
  }
  const reveal = (x: number, y: number, side: 'n' | 's' | 'e' | 'w', z0: number, z1: number) => {
    // a darker vertical line 1 m wide, just proud of the face
    const w = 0.5, d = 0.06
    const r: XY[] = side === 's' ? [[x - w, y - d], [x + w, y - d], [x + w, y + 0.1], [x - w, y + 0.1]]
      : side === 'n' ? [[x - w, y - 0.1], [x + w, y - 0.1], [x + w, y + d], [x - w, y + d]]
      : side === 'e' ? [[x - 0.1, y - w], [x + d, y - w], [x + d, y + w], [x - 0.1, y + w]]
      : [[x - d, y - w], [x + 0.1, y - w], [x + 0.1, y + w], [x - d, y + w]]
    walls(slot, r, z0, z1)
  }

  // shaft: full corners to 61 m, then notched corners to 126.5
  const shaftLo = R(-25, -17.75, 25, 17.75, 0)
  const shaftHi = R(-25, -17.75, 25, 17.75, 2.5)
  walls(glass, chamfer(shaftLo, 0.4), 19, 61)
  // the ledge where the corner notches begin
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x = CX + sx * 23.75, y = CY + sy * 16.5
    cap(trim, rect(x - 1.25, y - 1.25, x + 1.25, y + 1.25), 61)
  }
  tier(shaftHi, 61, 126.5)
  lines(chamfer(shaftLo, 0.4), 19, 61)
  lines(shaftHi, 61, 126.5)

  const t2 = R(-24, -15.25, 24, 15.75, 3)
  tier(t2, 126.5, 141.5); lines(t2, 126.5, 141.5)

  // the cross: the central square with east-west arms
  const sq = { x0: -13, x1: 15, y0: -14.25, y1: 14.25 }, arm = { x0: -23.5, x1: 23.5, y0: -6.25, y1: 7.75 }
  const cross: XY[] = [
    [sq.x0, sq.y0], [sq.x1, sq.y0], [sq.x1, arm.y0], [arm.x1, arm.y0], [arm.x1, arm.y1], [sq.x1, arm.y1],
    [sq.x1, sq.y1], [sq.x0, sq.y1], [sq.x0, arm.y1], [arm.x0, arm.y1], [arm.x0, arm.y0], [sq.x0, arm.y0],
  ].map(([x, y]) => [CX + x, CY + y] as XY)
  tier(cross, 141.5, 162.5); lines(cross, 141.5, 162.5)
  const top = R(sq.x0, sq.y0, sq.x1, sq.y1, 2)
  tier(top, 162.5, 175); lines(top, 162.5, 175)

  // reveals: two on each long face, one on each short face, on the shaft
  for (const x of [-9, 9]) {
    reveal(CX + x, CY - 17.75, 's', 19, 126.5)
    reveal(CX + x, CY + 17.75, 'n', 19, 126.5)
  }
  reveal(CX + 25, CY + 0.75, 'e', 19, 126.5)
  reveal(CX - 25, CY + 0.75, 'w', 19, 126.5)

  // the octagonal penthouse and the mast
  const oct = Array.from({ length: 8 }, (_, i) => [CX - 1 + 6.2 * Math.cos((i + 0.5) * Math.PI / 4), CY + 0.75 + 6.2 * Math.sin((i + 0.5) * Math.PI / 4)] as XY)
  block(trim, roof, oct, 175, 178.5, 0.3)
  {
    const m = (h: number) => rect(CX - 1 - h, CY + 0.75 - h, CX - 1 + h, CY + 0.75 + h)
    walls(metal, m(0.5), 178.5, 184)
    walls(metal, m(0.25), 184, 190, m(0.08))
    cap(metal, m(0.5), 184)
  }

  void ([] as V3[])
  return [
    { part: glass, material: { ...PALETTE.window, color: 0x6f8aab } },
    { part: slot, material: windowVariant(2, 0x566c88) },
    { part: trim, material: finish('silver-mullion', 0xc8d1da, 0.5) },
    { part: granite, material: finish('dark-granite', 0x77706d) },
    { part: roof, material: PALETTE.roof },
    { part: metal, material: finish('mast-metal', 0x9a9fa3, 0.6) },
  ]
}

if (import.meta.main) await save('kc-one-kansas-city-place', 'One Kansas City Place', [39.0996844, -94.5837544], 2.1, build(), 6500)
