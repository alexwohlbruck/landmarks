/**
 * Atrium Building, Design Center of the Carolinas, 127 W. Worthington Ave,
 * South End, Charlotte — procedural, CC0-1.0.
 * bun generators/clt-atrium-building.ts
 *
 * The campus's two-storey brick industrial building north of the Plaza
 * Building, across the alley, and named for its glass-roofed central atrium:
 * a flat-roofed red-brick block behind a plain parapet with two raised
 * skylight monitors on its long axis, a stair tower and a one-storey strip on
 * the alley side, and its entrance (127) on Worthington Ave.
 *
 * Evidence:
 *  - OSM: way/432929165 ("Atrium Building", industrial, 2 levels). No parts.
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 0.5 m (lowest ground
 *    under the footprint 219.7 m NAVD88 = y 0, on the Hawkins St side;
 *    ground rises ~1.2 m east). Above base: the roof 10.7 m, parapets
 *    11.2–11.9 m, the north skylight monitor 14.2 m, the south monitor 13.1 m,
 *    the stair tower 12.0 m, the alley strip's west end 5.5 m.
 *  - USGS NAIP (public domain): the plan and the dark grey roof.
 *  - Photos (Wikimedia Commons, City Dweller 2, CC BY-SA 4.0, April 2024):
 *    https://commons.wikimedia.org/wiki/File:The_Atrium_at_the_Design_Center_of_the_Carolinas_Mid-April_2024.jpg (the 127 entrance: brick colour, blue door frame)
 *    https://commons.wikimedia.org/wiki/File:Design_Center_Alley_Mid-April_2024.jpg (the alley between this and the Plaza Building)
 *
 * Window treatment and brick follow clt-plaza-building, the Nebel mill's two
 * rows of steel windows (clt-design-center). Estimated: window bays on every
 * face, the alley strip's east part (4.5 m; the 2016 lidar shows it open,
 * OSM includes it).
 *
 * Doubts: no licensed photo shows a whole face of this building; the facade
 * is the campus treatment, not observed. The OSM outline runs 7 m further
 * south than the 2016 lidar's full-height roof; the model keeps OSM's extent
 * with that strip low.
 *
 * Model frame: bearing 30, as clt-design-center; metres above the base.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type Block, type Kit, type XY, build, prism, quad, rect } from './clt-highland-park-mill-3'
import { writeAtBase } from './clt-vantage-south-end'
import { CAMPUS_BRICK, MILL_ROWS } from './clt-plaza-building'

const ENTRY = finish('atrium-blue', 0x5f7690)
const ground = (p: XY) => Math.max(0, Math.min(1.3, 0.025 * (p[0] + 23)))

function buildAtrium() {
  const brick = new Part(), win = new Part(), trim = new Part(), roof = new Part(), glass = new Part(), entry = new Part()
  const kit: Kit = { win, trim, roof, ground }
  const MAIN: XY[] = [[-22.9, 28.1], [-22.8, -21.0], [18.2, -21.0], [18.1, 28.4], [-3.1, 28.2]]
  const blocks: Block[] = [
    { poly: MAIN, top: 11.2, wall: brick, rows: MILL_ROWS, pitch: 4.0 },
    { poly: rect(-22.8, -28.6, -14.0, -21.0), top: 5.6, wall: brick, rows: [{ z0: 1.6, z1: 3.8, w: 2.6 }], pitch: 3.6 },
    { poly: rect(-14.0, -28.5, -4.0, -21.0), top: 12.0, wall: brick, rows: MILL_ROWS, pitch: 3.6 },
    { poly: rect(-4.0, -28.4, 18.3, -21.0), top: 4.6, wall: brick, rows: [{ z0: 1.6, z1: 3.8, w: 2.6 }], pitch: 3.6 },
  ]
  build(blocks, kit)
  // The two skylight monitors over the atrium.
  prism(glass, rect(-7.0, 12.5, 3.0, 27.0), 10.6, 14.2)
  prism(glass, rect(-5.0, -17.0, 3.0, 5.0), 10.6, 13.1)
  // The 127 entrance on Worthington: blue-framed doors.
  const c = -12.5, y = 28.15 + 0.07
  quad(entry, [c - 2.2, y, 0.2], [c + 2.2, y, 0.2], [c + 2.2, y, 3.4], [c - 2.2, y, 3.4], [0, 1, 0])

  return {
    id: 'clt-atrium-building', name: 'Atrium Building', anchor: [0, 0] as XY, height: 14.2,
    parts: [
      { part: brick, material: CAMPUS_BRICK },
      { part: roof, material: PALETTE.roof },
      { part: win, material: PALETTE.window },
      { part: trim, material: PALETTE.trim },
      { part: glass, material: PALETTE.glass },
      { part: entry, material: { ...ENTRY, name: 'entrance' } },
    ],
  }
}

if (import.meta.main) await writeAtBase(buildAtrium())
