/**
 * Comerica Bank Tower (1987, Johnson/Burgee Architects; built as Momentum
 * Place), 1717 Main Street, Dallas: original procedural geometry, CC0-1.0.
 * bun generators/dal-comerica-bank-tower.ts [out.glb]
 *
 * Map frame: x, y, z up, metres; origin at the anchor (the centroid of OSM
 * way/28015874, -96.796528 32.781611) on the lowest ground under the
 * footprint. Placed at bearing 346, the downtown street grid: +y runs
 * north-north-west along Ervay... toward Elm Street, +x east-north-east.
 *
 * Form: a 60-storey slab, 40 x 53 m, of pink-beige granite with small
 * punched windows, standing on the east half of a 26 m granite podium whose
 * west half is the barrel-vaulted banking hall. A full-height bay of blue
 * glass runs up the middle of every face. At the top the corners stop at
 * about four fifths of the height and two crossing barrel vaults carry on,
 * so the crown is a cross in plan whose four arms end in semicircular
 * lunettes over the glass bays. On the two narrow (north and south) faces a
 * lower bay projects 4.5 m and rises to a lunette of its own at about 58 %
 * of the height. On the east face the glass bay is recessed between two
 * granite wings.
 *
 * Identifying features, in order: the four lunettes and the crossing vaults
 * of the crown; the stepped-down corners that make the cross; the blue glass
 * bays against pink granite; the lower lunetted bays on the narrow faces.
 *
 * Sources
 * - OSM way/28015874 (building=commercial, height 239.88, wikidata
 *   Q2743574): the outline, 88 x 62 m, covers tower and podium.
 * - Lidar (measured): USGS 3DEP TX_Pecos_Dallas_B3_2018 (2018 flight), 1 m
 *   grid. The point cloud has nothing above about 54 m here, so over the
 *   tower it gives only the footprint and the podium:
 *   - tower walls at x = -9.5 (west, against the podium), x = 30.5 (east
 *     wings), y = -30 (south bay, 24 m wide, x -1.5..22.5); the east face's
 *     middle 20 m is open to the ground from x = 27, so the east glass bay
 *     is recessed 3.5 m;
 *   - podium roof 26.3 m, parapet 27.4 m, west edge x = -41 (OSM has -44);
 *   - the banking-hall vault along x over |y| < 11.3: crown 40.5 m, 34.5 m
 *     at |y| = 10, so radius 11.3 m springing at 29.2 m.
 *   The ends of the tower at y = +-26.5 are estimated: the lidar shows only
 *   the bays' faces at +-30/31, and the photos show the bays standing about
 *   4.5 m proud.
 * - NAIP (USGS) orthophoto: the crossing vaults from above (leaning), the
 *   east plaza.
 * - Published: 239.88 m (787 ft) to the roof, 60 storeys, 1987,
 *   Johnson/Burgee; polished granite and dark glass; "setbacks carve a cross
 *   shape from the building's top section"; barrel vaults (Wikipedia,
 *   "Comerica Bank Tower").
 * - Photos (Wikimedia Commons; shapes and colours come from these):
 *   - "View of Comerica Bank Tower from Reunion Tower August 2015 22.jpg",
 *     Michael Barera, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:View_of_Comerica_Bank_Tower_from_Reunion_Tower_August_2015_22.jpg
 *     (west face: proportions of glass bay and granite, corner step)
 *   - "Dallas-Downtown-0385.jpg", Loadmaster (David R. Tribble), CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Dallas-Downtown-0385.jpg
 *     (west face from above: crown, corner step at about 0.8 of the height)
 *   - "Comerica Bank Tower.jpg", Justin Cozart, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Comerica_Bank_Tower.jpg
 *     (crown close-up: lunettes, vault roofs, corner steps)
 *   - "Comerica Bank Tower 01.jpg", Joe Mabel, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Comerica_Bank_Tower_01.jpg
 *     (the lower lunetted bay, granite colour)
 *   - "UBI US headquarter in Dallas Comerica Bank Tower Business
 *     Center.jpg", Hugopush, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:UBI_US_headquarter_in_Dallas_Comerica_Bank_Tower_Business_Center.jpg
 *     (narrow face head-on: lower bay under the upper bay)
 *   - "Comerica Bank in Dallas Texas - Eric Statzer.jpg", Eric Statzer,
 *     CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Comerica_Bank_in_Dallas_Texas_-_Eric_Statzer.jpg
 *     (banking hall's west lunette)
 *   - "Bank One Center.jpg", RadicalBender, public domain,
 *     https://commons.wikimedia.org/wiki/File:Bank_One_Center.jpg
 *   - "Comerica Tower Sunset (8413071906).jpg", fw_gadget, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Comerica_Tower_Sunset_(8413071906).jpg
 * - Look-only: none used.
 *
 * Numbers
 * - Podium, its vault, the tower's east and west walls and the bay width:
 *   measured (lidar).
 * - Roof 240 m at the crown of the east-west vault: published (239.88 m).
 * - Vault springing 230 m; east-west vault 20 m wide (radius 10), north-south
 *   vault 16 m wide (radius 8, crown 238 m); the cross's arms 28 m (east-
 *   west) and 24 m (north-south) wide; corners stopping at 205 m; the lower
 *   bays' walls at 130 m with a lunette to 138 m: estimated from the photos
 *   above, scaled to the published height and the measured plan.
 * - Window panels group three storeys of 4.0 m (240 m / 60).
 *
 * Doubts
 * - No lidar above 54 m, so every height above the podium rests on photos
 *   and the published total.
 * - The tower's north and south walls (y = +-26.5) and the bays' depth are
 *   estimated; the lidar's shadowed cells can't place them.
 * - The east recess comes from the lidar; the west glass bay is drawn flush
 *   because the lidar puts a wall there, so the two broad faces differ.
 * - Left out: the lunettes' lattice (drawn as plain pale glass in a granite
 *   rim), the Comerica sign in the top lunette, the small glass vaults on the
 *   corner steps, the arched entrances and round windows of the base, and
 *   the east plaza's canopy.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { prism, box, extrude, archProfile, panels, poly, type PanelOpts } from './dal-chase-tower'
import { finishGlb, type XY } from './sea-columbia-center'

/** Window panels on an axis-aligned face. `side` is the way it faces. */
function face(part: Part, side: 'N' | 'S' | 'E' | 'W', c: number, s0: number, s1: number, z0: number, z1: number, g: PanelOpts, edge = 0.8) {
  const L = s1 - s0
  const [a, b]: [XY, XY] =
    side === 'S' ? [[s0, c], [s1, c]] : side === 'N' ? [[s1, c], [s0, c]] : side === 'W' ? [[c, s1], [c, s0]] : [[c, s0], [c, s1]]
  panels(part, a, b, z0, z1, [[edge, L - edge]], g)
}

/** A flat panel on an axis-aligned face, proud by `p`. */
function sheet(part: Part, side: 'N' | 'S' | 'E' | 'W', c: number, s0: number, s1: number, z0: number, z1: number, p = 0.06) {
  const n: V3 = side === 'N' ? [0, 1, 0] : side === 'S' ? [0, -1, 0] : side === 'E' ? [1, 0, 0] : [-1, 0, 0]
  const P = (s: number, z: number): V3 => (side === 'N' || side === 'S' ? [s, c + n[1] * p, z] : [c + n[0] * p, s, z])
  poly(part, [P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1)], n)
}

/** A semicircular sheet (a lunette's glass) on an axis-aligned face. */
function halfDisc(part: Part, side: 'N' | 'S' | 'E' | 'W', c: number, sc: number, zc: number, r: number, seg: number, p = 0.08) {
  const n: V3 = side === 'N' ? [0, 1, 0] : side === 'S' ? [0, -1, 0] : side === 'E' ? [1, 0, 0] : [-1, 0, 0]
  const P = (s: number, z: number): V3 => (side === 'N' || side === 'S' ? [s, c + n[1] * p, z] : [c + n[0] * p, s, z])
  const pts: V3[] = []
  for (let k = 0; k <= seg; k++) {
    const t = (Math.PI * k) / seg
    pts.push(P(sc + r * Math.cos(t), zc + r * Math.sin(t)))
  }
  poly(part, pts, n)
}

function build() {
  const H = 240
  // plan, model frame (bearing 346)
  const TX0 = -9.5, TX1 = 30.5, TY = 26.5 // tower body
  const EX = 27 // the east face of the recessed glass bay
  const CY = 0, CXN = 10.5 // the north-south axis of the narrow faces
  const BAY_HW = 12, BAY_Y = 31 // lower bays: x -1.5..22.5, out to y = +-31
  const PX0 = -41.5, PX1 = 44, PY = 31, PZ = 26.3 // podium
  // heights
  const CORNER = 205, SPRING = 230, EW_R = 10, NS_R = 8, BAY_WALL = 130
  const ARM_EW = 14, ARM_NS = 12 // half-widths of the cross's arms
  const LUN_RIM = 1.4

  const granite = new Part(), win = new Part(), blue = new Part(), roof = new Part(), pale = new Part()

  // --- podium, with the east plaza cut out of it
  prism(granite, roof, [[PX0, -PY], [PX1, -PY], [PX1, -10], [EX, -10], [EX, 10], [PX1, 10], [PX1, PY], [PX0, PY]], 0, PZ, 0.5)
  // the banking hall's barrel vault, along x, ending in a lunette on the west
  const HALL_R = 11.3, HALL_S = 29.2
  extrude(roof, granite, archProfile(CY - HALL_R, CY + HALL_R, PZ, CY, HALL_S, HALL_R, 10), 'x', PX0 + 0.6, TX0 + 0.5)
  halfDisc(pale, 'W', PX0 + 0.6, CY, HALL_S, HALL_R - LUN_RIM, 10)

  // --- tower body to the corners' step
  const body: XY[] = [[TX0, -TY], [TX1, -TY], [TX1, -10], [EX, -10], [EX, 10], [TX1, 10], [TX1, TY], [TX0, TY]]
  prism(granite, roof, body, PZ - 1, CORNER, 0.5)
  // --- the cross above the corners
  prism(granite, roof, [[TX0, -ARM_EW], [TX1, -ARM_EW], [TX1, -10], [EX, -10], [EX, 10], [TX1, 10], [TX1, ARM_EW], [TX0, ARM_EW]], CORNER - 1, SPRING, 0.5)
  box(granite, roof, CXN - ARM_NS, CXN + ARM_NS, -TY, TY, CORNER - 1, SPRING, 0.5)
  // crossing vaults: east-west (radius 10) and north-south (radius 8)
  extrude(roof, granite, archProfile(CY - EW_R, CY + EW_R, SPRING - 1, CY, SPRING, EW_R, 12), 'x', TX0, EX)
  extrude(roof, granite, archProfile(CXN - NS_R, CXN + NS_R, SPRING - 1, CXN, SPRING, NS_R, 10), 'y', -TY, TY)
  halfDisc(pale, 'W', TX0, CY, SPRING, EW_R - LUN_RIM, 12)
  halfDisc(pale, 'E', EX, CY, SPRING, EW_R - LUN_RIM, 12)
  halfDisc(pale, 'N', TY, CXN, SPRING, NS_R - LUN_RIM, 10)
  halfDisc(pale, 'S', -TY, CXN, SPRING, NS_R - LUN_RIM, 10)

  // --- lower bays on the narrow faces, each with its own lunette
  for (const sgn of [-1, 1]) {
    const y0 = sgn < 0 ? -BAY_Y : TY - 1, y1 = sgn < 0 ? -TY + 1 : BAY_Y
    box(granite, roof, CXN - BAY_HW, CXN + BAY_HW, y0, y1, PZ - 1, BAY_WALL, 0.5)
    const ya = sgn < 0 ? -BAY_Y : TY - 3, yb = sgn < 0 ? -TY + 3 : BAY_Y
    extrude(roof, granite, archProfile(CXN - NS_R, CXN + NS_R, BAY_WALL - 1, CXN, BAY_WALL, NS_R, 10), 'y', ya, yb)
    halfDisc(pale, sgn < 0 ? 'S' : 'N', sgn * BAY_Y, CXN, BAY_WALL, NS_R - LUN_RIM, 10)
  }

  // --- glass bays (blue): up the middle of every face
  sheet(blue, 'W', TX0, CY - EW_R + LUN_RIM, CY + EW_R - LUN_RIM, PZ + 1.5, SPRING)
  sheet(blue, 'E', EX, CY - 10 + 0.6, CY + 10 - 0.6, 1, SPRING)
  for (const sgn of [-1, 1]) {
    const side = sgn < 0 ? 'S' : 'N'
    // the bay's front, from the ground to its lunette
    sheet(blue, side, sgn * BAY_Y, CXN - NS_R + LUN_RIM, CXN + NS_R - LUN_RIM, 3, BAY_WALL)
    // the upper bay, from over the lower lunette to the crown's
    sheet(blue, side, sgn * TY, CXN - NS_R + LUN_RIM, CXN + NS_R - LUN_RIM, BAY_WALL + NS_R + 1.5, SPRING)
  }

  // --- punched windows, three storeys a panel
  const g: PanelOpts = { group: 3 * 4.0, spandrel: 4.8, bayW: 2.6, pier: 2.3, zMin: PZ + 2 }
  const g0: PanelOpts = { ...g, zMin: 6 }
  // west face, either side of the glass bay
  face(win, 'W', TX0, -TY, -EW_R, PZ, CORNER, g)
  face(win, 'W', TX0, EW_R, TY, PZ, CORNER, g)
  face(win, 'W', TX0, -ARM_EW, -EW_R, CORNER, SPRING, g, 0.6)
  face(win, 'W', TX0, EW_R, ARM_EW, CORNER, SPRING, g, 0.6)
  // east wings
  face(win, 'E', TX1, -TY, -10, PZ, CORNER, g)
  face(win, 'E', TX1, 10, TY, PZ, CORNER, g)
  face(win, 'E', TX1, -ARM_EW, -10, CORNER, SPRING, g, 0.6)
  face(win, 'E', TX1, 10, ARM_EW, CORNER, SPRING, g, 0.6)
  for (const sgn of [-1, 1]) {
    const side = sgn < 0 ? 'S' : 'N'
    // narrow faces' corners, beside the bay
    face(win, side, sgn * TY, TX0, CXN - BAY_HW, PZ, CORNER, g)
    face(win, side, sgn * TY, CXN + BAY_HW, TX1, PZ, CORNER, g)
    // the bay's granite shoulders, and the upper arm's above them
    face(win, side, sgn * BAY_Y, CXN - BAY_HW, CXN - NS_R, PZ, BAY_WALL, g, 0.6)
    face(win, side, sgn * BAY_Y, CXN + NS_R, CXN + BAY_HW, PZ, BAY_WALL, g, 0.6)
    face(win, side, sgn * TY, CXN - ARM_NS, CXN - NS_R, BAY_WALL, SPRING, g, 0.6)
    face(win, side, sgn * TY, CXN + NS_R, CXN + ARM_NS, BAY_WALL, SPRING, g, 0.6)
    // the east-west arm's sides above the corners
    face(win, side, sgn * ARM_EW, TX0, CXN - ARM_NS, CORNER, SPRING, g)
    face(win, side, sgn * ARM_EW, CXN + ARM_NS, TX1, CORNER, SPRING, g)
  }
  // the north-south arm's sides above the corners
  for (const [lo, hi] of [[-TY, -ARM_EW], [ARM_EW, TY]] as [number, number][]) {
    face(win, 'W', CXN - ARM_NS, lo, hi, CORNER, SPRING, g)
    face(win, 'E', CXN + ARM_NS, lo, hi, CORNER, SPRING, g)
  }
  // podium: a band of tall windows on its street faces
  face(win, 'S', -PY, PX0, TX0 - 1, 0, PZ, { ...g0, group: 13, spandrel: 4 })
  face(win, 'N', PY, PX0, TX0 - 1, 0, PZ, { ...g0, group: 13, spandrel: 4 })

  const GRANITE = finish('comerica-granite', 0xe6d3c2)
  const BLUE = windowVariant(2, 0x7092b6)
  return finishGlb('dal-comerica-bank-tower', 'Comerica Bank Tower', [
    { part: granite, material: GRANITE },
    { part: win, material: PALETTE.window },
    { part: blue, material: BLUE },
    { part: roof, material: PALETTE.roof },
    { part: pale, material: PALETTE.glass },
  ], { bearing: 346, height: H, replaces: ['way/28015874'] })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/dal-comerica-bank-tower.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
