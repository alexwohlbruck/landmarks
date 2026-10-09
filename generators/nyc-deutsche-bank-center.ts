/**
 * Deutsche Bank Center (formerly Time Warner Center), 10 Columbus Circle —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-deutsche-bank-center.ts
 *
 * Map frame: x = model east (toward Columbus Circle), y = model north (West
 * 60th Street), z up, metres. Placed at bearing 29°, the Manhattan grid.
 * Anchor: the centroid of the OSM outline way/167923911's vertices.
 *
 * Evidence
 * - OSM: the outline way/167923911 (whole block, 45 m, its east front
 *   following the curve of Columbus Circle) and building:parts 183199498–
 *   183199505: the two towers (…499 north, …505 south) are parallelograms
 *   about 29.5 m across the grid and 34.5 m deep, their long sides slanting
 *   31° off the grid; the lower glass wings (…500, …501, …502, …504), the
 *   80 m block on 60th Street (…498) and the 55 m middle (…503).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 2 m. Heights above the lowest
 *   street (21.8 m NAVD88): towers 229–231 m; the south glass wing 106–115 m
 *   (OSM says 105/125; the lidar is used: 110 m); the north wings 100 m;
 *   the 60th Street block 79 m; the circle front 45–48 m; a 59 m strip
 *   along 58th Street and the 59 m middle; a 37 m strip on 60th Street.
 * - Published: 229 m, two 55-storey towers, Skidmore, Owings & Merrill
 *   (David Childs), completed 2003 (Wikipedia).
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-deutsche-bank-center/photos/credits.txt: Ajay
 *   Suresh (CC BY 4.0, from the south-east on the circle), Tdorante10
 *   (CC BY-SA 4.0), Martin Furtschegger (CC BY 3.0), Kidfly182 (CC BY-SA 4.0
 *   and CC BY 4.0), Fletcher (CC BY 4.0, from Central Park), Jakob von Raumer
 *   (CC BY 3.0, from the park), Steven Lek (CC BY-SA 4.0).
 *
 * What makes it read: the twin parallelogram towers with their stepped
 * crowns (four bold notches stepping down northward), the lower glass wings
 * stepping off each tower, and the pale stone base curving round the circle
 * with the glass atrium between the towers. Glass treatment: broad glass
 * bays between pale fins, four storeys to a panel, in a light sky glass
 * (the towers read bright silver-blue in daylight), no floor lines.
 *
 * Estimated: bay width (6.6 m), storey height (4.1 m), the crown's steps
 * (from the photos, drawn as solid steps though the lidar's roof reads
 * ~230 m over most of each top; see the towers' comment), the atrium's extent on the curved front (from the
 * photos), the stone base's window rhythm. The mechanical notches at the
 * towers' acute corners (lidar ~196 m) are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { finishModel, prism, facade, capPoly, area, type XY, type Facade } from './nyc-570-lexington'

const glass = new Part(), fins = new Part(), stone = new Part(), stoneWin = new Part(), roof = new Part(), crown = new Part()

const towerFacade: Facade = { bay: 6.6, ratio: 0.88, floor: 4.1, group: 4, spandrel: 0.9, sill: 0.6, head: 0.6, minLength: 3 }
const baseFacade: Facade = { bay: 7.5, ratio: 0.72, floor: 4.5, group: 2, spandrel: 2.6, sill: 1.5, head: 2.4, ground: 5, minLength: 5, margin: 0.5 }

/** A glass volume on a ring, from z0 to z1: pale fins behind glass bays, flat roof. */
function glassVol(ring: XY[], z0: number, z1: number) {
  prism({ wall: fins, win: glass, roof, ring, z0, z1, facade: towerFacade, bevel: 0.4 })
}
/** A stone volume with punched window bands. */
function stoneVol(ring: XY[], z0: number, z1: number, f: Facade | null = baseFacade) {
  prism({ wall: stone, win: stoneWin, roof, ring, z0, z1, facade: f, bevel: 0.45 })
}

// ---------------------------------------------------------------- base
// The OSM outline (vertices in the grid frame), to 45 m, its east front on the circle's curve.
const outline: XY[] = [[10.4, 31.5], [13.6, 31.6], [15.4, 38.4], [17.0, 42.7], [18.0, 45.4], [1.2, 75.9], [-8.5, 76.2],
  [-84.2, 75.8], [-84.2, -52.9], [63.0, -52.1], [63.2, -48.2], [54.3, -46.6], [55.6, -43.3], [52.3, -41.5], [46.6, -38.4],
  [41.9, -35.7], [36.7, -31.9], [33.2, -28.4], [29.3, -24.2], [25.5, -18.4], [22.4, -13.5], [19.7, -8.5], [17.1, -2.5],
  [14.8, 4.6], [10.5, 4.3], [10.5, 18.5]]
// The glass atrium between the towers on the circle front (y 4.3 … 31.5), the
// stone wings either side: drawn as the base with that stretch of wall in glass.
{
  let ring = outline.slice()
  if (area(ring) < 0) ring.reverse()
  prism({
    wall: stone, win: stoneWin, roof, ring, z0: 0, z1: 45, facade: baseFacade, bevel: 0.45,
    faceFacade: (_i, a, b) => {
      const atrium = a[0] < 16 && b[0] < 16 && Math.min(a[1], b[1]) > 4 && Math.max(a[1], b[1]) < 32
      return atrium ? null : baseFacade
    },
  })
  // The atrium's glass wall, a sheet just proud of the base's front between the towers.
  for (const [a, b] of [[[10.5, 4.3], [10.5, 18.5]], [[10.5, 18.5], [10.4, 31.5]]] as [XY, XY][]) {
    const n = 0.06
    crown.quad([a[0] + n, a[1] + 0.8, 1], [b[0] + n, b[1] - 0.8, 1], [b[0] + n, b[1] - 0.8, 43.5], [a[0] + n, a[1] + 0.8, 43.5])
  }
}
// Stone strips above the 45 m base: along 58th Street to 59 m, the middle to 59 m, 60th Street to 37 m is under 45 (skipped).
stoneVol([[-84.2, -52.9], [36.0, -52.4], [36.0, -38.7], [-84.2, -38.4]], 45, 59)
stoneVol([[-76.1, 4.3], [-15.2, 3.8], [-19.4, 31.4], [-30.9, 32.2], [-75.7, 32.9]], 45, 59)

// ---------------------------------------------------------------- glass wings
glassVol([[-84.0, -38.4], [28.5, -38.7], [-10.8, 2.5], [-14.5, 2.6], [-15.2, 3.8], [-84.0, 4.3]], 59, 110) // south wing (…504 + …501)
glassVol([[-30.9, 32.2], [-19.4, 31.4], [-10.4, 66.9], [-50.8, 66.6]], 59, 100) // …500, east of the north tower
glassVol([[-84.0, 32.9], [-55.3, 32.6], [-75.3, 67.4], [-84.0, 67.4]], 59, 100) // …502, west of it
glassVol([[-62.1, 67.3], [-50.8, 66.6], [-1.2, 70.7], [-62.2, 72.2]], 45, 79) // …498, on 60th Street

// ---------------------------------------------------------------- towers
// Each tower to 205 m, then the crown steps down northward along the
// circle-facing (east) face in four bold notches across the whole top:
// 230 / 225 / 220 / 215 m, the stepped skyline seen from the circle. Doubt:
// the 2017 lidar reads ~229–231 m over most of each top, so the real steps
// are probably the crown's glass screen rather than the roof; they are drawn
// as solid steps so the profile reads.
const TOP = 230, SHAFT = 205, STEPS = [230, 225, 220, 215]
function tower(sw: XY, se: XY, ne: XY, nw: XY) {
  glassVol([sw, se, ne, nw], 45, SHAFT)
  const E = (t: number): XY => [se[0] + (ne[0] - se[0]) * t, se[1] + (ne[1] - se[1]) * t]
  const W = (t: number): XY => [sw[0] + (nw[0] - sw[0]) * t, sw[1] + (nw[1] - sw[1]) * t]
  STEPS.forEach((z, i) => glassVol([W(i / 4), E(i / 4), E((i + 1) / 4), W((i + 1) / 4)], SHAFT, z))
}
tower([-24.3, -30.6], [5.4, -30.6], [-15.2, 3.8], [-44.5, 4.0])
tower([-55.3, 32.6], [-30.9, 32.2], [-50.8, 66.6], [-75.3, 67.4])

finishModel('Deutsche Bank Center', 'nyc-deutsche-bank-center', [
  { part: glass, material: { ...windowVariant(1, 0xa9bfd1), name: 'window' } },
  { part: fins, material: finish('dbc-fin', 0xdfe3e5) },
  { part: stone, material: finish('dbc-limestone', 0xe6dfd3) },
  { part: stoneWin, material: { name: 'window-2', color: 0x7a90a3, roughness: 0.35 } },
  { part: roof, material: PALETTE.roof },
  { part: crown, material: { name: 'glass', color: 0xa4c4d9, roughness: 0.24 } },
], { bearing: 29, osm: 'way/167923911', height: TOP })
