/**
 * Chicago Union Station headhouse (210 South Canal Street, 1925, Graham,
 * Burnham & Co. and Graham, Anderson, Probst & White) — original procedural
 * geometry, CC0-1.0.
 * bun generators/chi-union-station.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/203442440,
 * 41.8786657,-87.6404074. Its walls run at 358.7° / 88.7°, so the catalog
 * bearing is 358.7 and the block is square to this frame. The underground
 * station relation/17581411 (layer -2) is not replaced: the model is the
 * headhouse only, and the platforms and sheds are not drawn.
 *
 * Identity, in order: the full-block limestone mass, a tall classical base
 * under a plainer office attic; the colossal colonnade along Canal Street
 * (east) between corner pavilions with arched doorways; the set-back upper
 * office storeys round the central light well; the Great Hall's
 * barrel-vaulted glass skylight in the well.
 *
 * Evidence:
 *  - plan: OSM outline, a 92.7 x 115.3 m rectangle. The upper block's
 *    setbacks (deepest, ~8 m, on Canal Street), the light well (~44 x 62 m) and the
 *    skylight (~35 x 58 m, its vault running north-south) measured on USGS
 *    NAIP; the north-south setbacks there are blurred by building lean and
 *    are estimates to ~2 m.
 *  - heights: OSM gives 8 levels; the Great Hall is 34 m high inside
 *    (published, 110 ft). Proportions from Bohao Zhao's view of the long
 *    side, scaled to ~39 m overall: base cornice ~22 m, attic band to ~26 m,
 *    upper office storeys to ~38.5 m. Estimates, not measurements.
 *  - colonnade: ~18 columns between the corner pavilions on Charles
 *    O'Rear's and Cards84664's views of the south-east corner; column
 *    diameter (~2 m) and pitch (~4.6 m) estimated from the same photos.
 *  - colour: grey-buff Bedford limestone (published); the skylight `glass`.
 *
 * Photos (Wikimedia Commons): Union_Station_from_South_-_panoramio.jpg
 * (Bohao Zhao, CC BY 3.0); Chicago_Union_Station_exterior,_July_2019.jpg
 * (Cards84664, CC BY-SA 4.0); CHICAGO'S_UNION_STATION_IN_THE_HEART_OF_THE_
 * CITY..._NARA_556077.jpg (Charles O'Rear, public domain);
 * Chicago_Union_Station_outside.jpg (Addis Wang, CC BY-SA 4.0). USGS NAIP
 * for the plan and the skylight. No commercial imagery.
 *
 * Left out: the clocks, lettering, cornice dentils, the arched doorways'
 * detail, the rooftop mechanical plant.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archPanel, block, cap, inset, lathe, panel, rect, save, wallBays, walls, type XY } from './chi-merchandise-mart'

/** A flat ring roof between an outer and an inner rectangle (same corner order). */
function annulus(p: Part, o: XY[], i: XY[], z: number) {
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    p.quad([i[k][0], i[k][1], z], [o[k][0], o[k][1], z], [o[l][0], o[l][1], z], [i[l][0], i[l][1], z])
  }
}

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), glass = new Part()

  const X0 = -46.3, X1 = 46.4, Y0 = -57.6, Y1 = 57.7
  const BASE = 22, ATTIC = 26, TOP = 38.5
  const outline = rect(X0, Y0, X1, Y1)

  // Base, with the colonnade's recess on Canal Street between the pavilions.
  const PAV = 15 // corner pavilion length along Canal
  const REC = 4.2 // depth of the portico
  const base: XY[] = [[X0, Y0], [X1, Y0], [X1, Y0 + PAV], [X1 - REC, Y0 + PAV], [X1 - REC, Y1 - PAV], [X1, Y1 - PAV], [X1, Y1], [X0, Y1]]
  walls(stone, base, 0, BASE - 2.2)
  // Entablature over the columns closes the recess at the top.
  walls(stone, outline, BASE - 2.2, BASE - 0.6)
  walls(trim, inset(outline, -0.4), BASE - 0.6, BASE)
  cap(stone, [[X1 - REC, Y0 + PAV], [X1, Y0 + PAV], [X1, Y1 - PAV], [X1 - REC, Y1 - PAV]], BASE - 2.2, false)
  // Colossal columns.
  const NC = 18
  for (let k = 0; k < NC; k++) {
    const y = Y0 + PAV + 2.4 + k * ((Y1 - Y0 - 2 * PAV - 4.8) / (NC - 1))
    lathe(trim, X1 - 1.4, y, [[1.15, 0], [1.15, 1.0], [0.95, 1.2], [0.85, BASE - 3.2], [1.1, BASE - 2.4], [1.1, BASE - 2.2]], 8)
  }
  // Doors and windows behind the colonnade.
  for (let k = 0; k < NC - 1; k++) {
    const y0 = Y0 + PAV + 2.4 + k * ((Y1 - Y0 - 2 * PAV - 4.8) / (NC - 1))
    panel(win, [X1 - REC, Y0 + PAV], [X1 - REC, Y1 - PAV], y0 - (Y0 + PAV) + 0.9, y0 - (Y0 + PAV) + 3.5, 1, 15.5, 0.05)
  }
  // Corner pavilions: an arched doorway each on Canal and round the corner.
  for (const [ya, yb] of [[Y0, Y0 + PAV], [Y1 - PAV, Y1]]) {
    archPanel(win, [X1, ya], [X1, yb], PAV / 2 - 2.2, PAV / 2 + 2.2, 0.2, 8.2, 0.06, 8)
  }

  // The other three faces: tall ground windows and a mezzanine row between pilasters.
  for (const [a, b] of [[[X0, Y0], [X1, Y0]], [[X1, Y1], [X0, Y1]], [[X0, Y1], [X0, Y0]]] as [XY, XY][]) {
    wallBays(win, a, b, [[1.6, 8.6], [11.2, 15.8]], { pitch: 6.2, w: 2.5, end: 4 })
  }

  // Attic band, set back 1.2 m; then the upper office storeys round the
  // light well, set back further (deepest on Canal).
  const attic = rect(X0 + 1.2, Y0 + 1.2, X1 - 1.2, Y1 - 1.2)
  annulus(roof, outline.map(p => p) as XY[], attic, BASE)
  walls(stone, attic, BASE, ATTIC)
  const up = rect(-43.2, -54.2, 38.4, 52.6)
  annulus(roof, attic, up, ATTIC)
  const well = rect(-26, -30.5, 18.5, 32.5)
  const upIn = inset(up, -0.4)
  walls(stone, up, ATTIC, TOP - 1.2)
  walls(trim, upIn, TOP - 1.2, TOP - 0.4)
  walls(trim, upIn, TOP - 0.4, TOP, up)
  annulus(roof, up, well, TOP)
  // Light well walls, facing in.
  walls(stone, [...well].reverse(), 24, TOP)
  for (const [a, b] of [[up[0], up[1]], [up[1], up[2]], [up[2], up[3]], [up[3], up[0]]] as [XY, XY][]) {
    wallBays(win, a, b, [[ATTIC + 1, ATTIC + 5.2], [ATTIC + 6.2, TOP - 2.2]], { pitch: 3.3, w: 1.7, end: 1.6 })
  }
  // A plain penthouse on the roof north of the well.
  block(stone, roof, rect(-9, 36, 7, 45.5), TOP, TOP + 4.2, 0.3)

  // The Great Hall's skylight: a barrel vault running north-south, set on
  // the well floor.
  const SX0 = -20.2, SX1 = 13.8, SY0 = -27.8, SY1 = 29.8, SZ = 24, RISE = 6.5
  annulus(roof, well, rect(SX0, SY0, SX1, SY1), SZ)
  const seg = 10
  const prof = Array.from({ length: seg + 1 }, (_, i) => {
    const t = Math.PI * (i / seg)
    return [(SX0 + SX1) / 2 - Math.cos(t) * (SX1 - SX0) / 2, SZ + Math.sin(t) * RISE, Math.sin(t)] as const
  })
  for (let i = 0; i < seg; i++) {
    const [x0, z0] = prof[i], [x1, z1] = prof[i + 1]
    glass.quad([x0, SY0, z0], [x1, SY0, z1], [x1, SY1, z1], [x0, SY1, z0])
  }
  // Gable ends.
  for (const [y, s] of [[SY0, 1], [SY1, -1]] as [number, number][]) {
    for (let i = 0; i < seg; i++) {
      const [x0, z0] = prof[i], [x1, z1] = prof[i + 1], c: V3 = [(SX0 + SX1) / 2, y, SZ]
      if (s < 0) stone.tri(c, [x0, y, z0], [x1, y, z1])
      else stone.tri(c, [x1, y, z1], [x0, y, z0])
    }
  }
  // A few pale ribs across the vault.
  for (let k = 1; k < 6; k++) {
    const y = SY0 + (k * (SY1 - SY0)) / 6
    for (let i = 0; i < seg; i++) {
      const [x0, z0] = prof[i], [x1, z1] = prof[i + 1]
      trim.quad([x0, y - 0.3, z0 + 0.05], [x1, y - 0.3, z1 + 0.05], [x1, y + 0.3, z1 + 0.05], [x0, y + 0.3, z0 + 0.05])
    }
  }

  return [
    { part: stone, material: finish('union-limestone', 0xe6ddcf) },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: glass, material: PALETTE.glass },
  ]
}

if (import.meta.main) await save('chi-union-station', 'Chicago Union Station', [41.8786657, -87.6404074], 358.7, build())
