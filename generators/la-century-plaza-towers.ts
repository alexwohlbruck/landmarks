/**
 * Century Plaza Towers (1975, Minoru Yamasaki), Century City, Los Angeles:
 * the twin 44-floor triangular towers as one model — original procedural
 * geometry, CC0-1.0.
 *
 *   bun generators/la-century-plaza-towers.ts
 *
 * Frame: x along bearing 110.6° (east-south-east), y along 20.6°, z up,
 * metres. Origin halfway between the two towers' centroids, on the plaza
 * (flat: 84.3–85.2 m at every corner, USGS 3DEP). Placed at bearing 20.6°,
 * so the two faces that look at each other across the plaza run along x.
 *
 * Each tower is an equilateral triangle in plan with its three corners cut
 * square, the second turned 180° to the first. What makes them read as
 * themselves: the triangular prisms paired face to face, the solid
 * aluminium corner piers and the solid aluminium band round the top, and
 * the bronze glass between close aluminium mullions.
 *
 * Evidence
 * - Plans: LA County LARIAC 2020 lidar footprints 436553843997 (Tower II,
 *   south) and 436323844287 (Tower I, north): three 73 m faces at bearings
 *   110.6°, 230.4°, 350.5° (and the reverse) with 2.2 m corner cuts, used
 *   as measured. OSM way/104944092 and way/104944087 (the outers of
 *   relation/19619602) agree within a metre but lack the corner cuts.
 * - Heights: lidar roofs 175.2 m (II) and 174.4 m (I) over the ground;
 *   published 174 m / 571 ft, 44 floors (Wikipedia). OSM height 175.2 / 174.4.
 * - Photos (Wikimedia Commons), looked at side by side with renders from
 *   the same side:
 *   c1 "Century Plaza Towers (June 2026)" (Busition, CC BY 4.0) — from the
 *      plaza between them, looking up at the two facing corners;
 *   c2 "CenturyPlazaTowers" (Minnaert, CC BY-SA 3.0) — from the south-west,
 *      Tower II in front, a knife corner and the top band;
 *   c3 "Century Plaza Towers Century Park" (Tony Hisgett, CC BY 2.0) — from
 *      the south-west on Avenue of the Stars, both towers, corner piers;
 *   c4 "CenturyPlazaTowers CAA" (Minnaert, CC BY-SA 3.0) — from the north-west;
 *   c5 "Century Plaza Towers - In Explore" (joey zanotti, CC BY 2.0) — the
 *      top band and corners from below.
 * - Colour: the photos (bright natural aluminium, bronze glass, drawn #75695e), 
 *   pulled to the palette's lightness.
 *
 * Estimated: the bays and storey groups (the real facade is a close grid
 * of 1.5 m aluminium mullions on each floor; drawn here as 9.6 m bays
 * four floors tall with 1 m piers and 1.2 m spandrels, the reviewer's rule), the corner pier width (3 m of
 * solid face beside each cut, from the photos), the top band (8 m), the
 * lobby band (7 m, the recessed glass ground floors). Left out: the
 * plaza, its gardens and the garage below it, roof equipment.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, lngLat, toModel, prism, panel, wallLen, ccw, inset, cap, walls, save } from './la-getty-center'

const O = [-118.41315, 34.05852] as const
const BEARING = 20.6

// LARIAC 2020 lidar footprints, local metres about O (x east, y north)
const TOWER_II: XY[] = [[-25.17, 49.59], [-23.38, 51.14], [44.96, 25.46], [45.39, 23.26], [-11.01, -23.36], [-13.02, -22.65]]
const TOWER_I: XY[] = [[-52.96, 143.02], [-50.92, 142.29], [-39.02, 69.85], [-40.76, 68.55], [-109.07, 94.19], [-109.46, 96.36]]
const C2: XY = [2.95, 17.29], C1: XY = [-67.03, 102.38]
const ANCHOR: XY = [(C1[0] + C2[0]) / 2, (C1[1] + C2[1]) / 2]

const alu = new Part(), win = new Part(), roof = new Part()

const FLOOR = 3.95, GROUP = 4 * FLOOR, SPANDREL = 1.2, BAY = 9.6, PIER = 1.0
const CORNER = 3.0, TOPBAND = 8.0, LOBBY = 7.0

function tower(ringWorld: XY[], H: number) {
  const ring = ccw(ringWorld.map((p) => toModel(p, ANCHOR, BEARING)))
  // Body with a softened top edge; the roof sits inside a 1 m parapet.
  prism(alu, null, ring, 0, H, { corner: 0.25, bevel: 0.5 })
  const inner = inset(ring, 1.2)
  const top = inset(ring, 0.5)
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length
    alu.quad([top[i][0], top[i][1], H], [top[j][0], top[j][1], H], [inner[j][0], inner[j][1], H], [inner[i][0], inner[i][1], H])
  }
  walls(alu, inner, H - 1.0, H, true)
  cap(roof, inner, H - 1.0)

  // Window panels on the three long faces only; the cuts stay solid.
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = wallLen(a, b)
    if (L < 20) continue
    const s0 = CORNER, s1 = L - CORNER
    const n = Math.round((s1 - s0) / BAY), bay = (s1 - s0) / n
    // the recessed glass lobby: one band between the corner piers
    panel(win, a, b, s0, s1, 0.4, LOBBY - 1.0, 0.06)
    for (let z = LOBBY; z + GROUP <= H - TOPBAND + 0.01; z += GROUP)
      for (let k = 0; k < n; k++)
        panel(win, a, b, s0 + k * bay + PIER / 2, s0 + (k + 1) * bay - PIER / 2, z + SPANDREL / 2, z + GROUP - SPANDREL / 2, 0.06)
  }
}

tower(TOWER_II, 175.2)
tower(TOWER_I, 174.4)

if (import.meta.main) {
  const [lng, lat] = lngLat(ANCHOR, O[0], O[1])
  console.log(`anchor ${lng.toFixed(7)}, ${lat.toFixed(7)}`)
  save('la-century-plaza-towers', 'Century Plaza Towers', [
    { part: alu, material: finish('cpt-aluminium', 0xe9ebeb) },
    { part: win, material: { ...PALETTE.window, color: 0x75695e } },

    { part: roof, material: { ...PALETTE.roof, color: 0xc8cccd } },
  ], { bearing: BEARING, elevation: 0, height: 175.2, replaces: ['relation/19619602', 'way/104944092', 'way/104944087'] })
}

