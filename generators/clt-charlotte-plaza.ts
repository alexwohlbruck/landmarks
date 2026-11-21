/**
 * Charlotte Plaza (201 S College St, 1982), Charlotte — original procedural
 * geometry, CC0-1.0.
 * bun generators/clt-charlotte-plaza.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the
 * centroid of the OSM outline way/397372378) on the lowest ground. Placed at
 * bearing 50.31, square to Uptown's grid: the long faces (±x) look onto
 * College Street and the Truist Center side, the ends (±y) onto Third and
 * Trade Street sides.
 *
 * Identity:
 *  - a black glass slab, 27 storeys, flat-topped;
 *  - each end is a pair of near-black glass towers with rounded outer
 *    corners, split by a narrow recess, and each tower steps out twice on
 *    the way down (photos from S College and E 4th St; the end face in
 *    "Fountain and Charlotte Plaza");
 *  - between the end towers the long faces are a lighter, sky-reflecting
 *    glass wall set back from them.
 *
 * Evidence:
 *  - OSM way/397372378 (office, 120 m, 27 levels): outline; the 1.6 m
 *    bumps at its north corners are the end towers' lowest tier.
 *    way/1186330025 (building=roof) is the covered skybridge on the east
 *    side, drawn here as the bridge stub OSM maps.
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17), 1 m grid.
 *    Street 5.4 m above the box's lowest return. Parapet 114.3 m, roof
 *    111.8 m, plant box over the middle 118.3 m above the street
 *    (published 118 m / 388 ft, 27 floors: Wikipedia "Charlotte Plaza").
 *    Skybridge top 12.5 m. Plan x -17.8..17.8, y -33.2..32.7 (OSM; lidar
 *    agrees within a metre).
 *  - Photos (Wikimedia Commons, daylight):
 *    "Charlotte Plaza S College.jpg" (City Dweller 2, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Charlotte_Plaza_S_College.jpg);
 *    "Charlotte Plaza December 2022.jpg" (City Dweller 2, CC BY-SA 4.0, the
 *    long face from the south-west,
 *    https://commons.wikimedia.org/wiki/File:Charlotte_Plaza_December_2022.jpg);
 *    "Charlotte Plaza.jpg" (Kylebassphotography, CC BY-SA 4.0, the end face
 *    and its recess, https://commons.wikimedia.org/wiki/File:Charlotte_Plaza.jpg);
 *    "Fountain and Charlotte Plaza.jpg" (Andrew Simpson, CC BY 2.0,
 *    https://commons.wikimedia.org/wiki/File:Fountain_and_Charlotte_Plaza.jpg).
 *    No commercial imagery or 3D tiles; no look-only sources.
 *
 * Estimated (photos): each end tower has four tiers (three steps in
 * Kyle's and City Dweller 2's S College photos), steps at 27, 52 and 78 m
 * (the long-face photo, scaled to the 66 m face, places the upper two at
 * about 51 and 77 m; the lowest is hidden there and read from the S
 * College photo). Going up, each step pulls the tower in along the long
 * face (17.0, 13.6, 10.3, 7.0 m deep), widens the recess between the pair
 * (1.4, 2.4, 3.4, 4.4 m) and pulls the outer faces in 0.4-0.6 m. The core
 * stops 3 m below the towers (111.3 m, the long-face photo; lidar's 111.8
 * m "roof"); its end walls sit 2.4 m back from the towers' base. The
 * south corners are drawn like the north ones (OSM omits their bumps).
 * Colours: the end glass reads black, pulled to charcoal; the long faces
 * read a saturated reflective blue (the S College and long-face photos),
 * kept lighter than the end towers.

 * Doubts: the plant box's plan is coarse (lidar), and lidar puts its top at
 * 118.3 m, but no street photo shows anything above the end towers, so it
 * is drawn small, set back and only 1.6 m above the core's parapet, below
 * the end towers. The lowest tier's depth is
 * extrapolated from the three above it. The Overstreet Mall
 * bridges other than the mapped stub are left out.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { bays, cap, parapetRoof, rect, save, walls, type XY } from './chi-aon-center'

const BEARING = 50.31
const ANCHOR: [number, number] = [35.2248987, -80.8433166]

const darkFrame = new Part(), darkGlass = new Part(), lightFrame = new Part(), lightGlass = new Part(), roof = new Part()

const TOP = 114.3, YN = 32.7, YS = -33.2, XC = 16.8, FLOOR = 4.1
const RECESS = 2.4, CORE_TOP = 111.3

/** Window groups of three storeys between z0 and z1. */
function groups(z0: number, z1: number): [number, number][] {
  const out: [number, number][] = []
  const n = Math.max(1, Math.round((z1 - z0) / (3 * FLOOR))), h = (z1 - z0) / n
  for (let i = 0; i < n; i++) out.push([z0 + i * h + 0.35, z0 + (i + 1) * h - 0.35])
  return out
}

/** A plan corner rounded with `seg` steps, radius r, centred inside. */
function round(cx: number, cy: number, r: number, a0: number, seg = 4): XY[] {
  return Array.from({ length: seg + 1 }, (_, i) => {
    const a = a0 + (i / seg) * Math.PI / 2
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as XY
  })
}

// --- The light core: the long faces between the end towers.
{
  const C: XY[] = rect(-XC, YS + RECESS, XC, YN - RECESS)
  walls(lightFrame, C, 0, CORE_TOP)
  parapetRoof(lightFrame, roof, C, CORE_TOP, 0.5, 1.5)
  bays(lightGlass, C, groups(0.4, CORE_TOP - 0.8), { bay: 2.9, gap: 0.35, end: 0.5, minLen: 6 })
}

// --- End towers: four of them, each stepping out twice going down.
// Four tiers, bottom to top: each step pulls the tower in along the long
// face (d), widens the recess between the pair (w), and pulls the outer
// faces in a little (x, and yo below).
const tiers = [
  { z0: 0, z1: 27, x: 19.4, d: 17.0, w: 1.4, yIn: 0 },
  { z0: 27, z1: 52, x: 18.9, d: 13.6, w: 2.4, yIn: 0.4 },
  { z0: 52, z1: 78, x: 18.3, d: 10.3, w: 3.4, yIn: 0.8 },
  { z0: 78, z1: TOP, x: 17.8, d: 7.0, w: 4.4, yIn: 1.2 },
]
const R = 2.2
for (const end of [1, -1]) {
  const Y = end > 0 ? YN : YS
  for (const side of [1, -1]) {
    for (const t of tiers) {
      // In the north-east tower's own terms (x outward, y outward), then mirrored.
      const xi = t.w / 2, xo = t.x, yo = Math.abs(Y) - t.yIn, yi = yo - t.d
      let ring: XY[] = [[xi, yi], [xo, yi], ...round(xo - R, yo - R, R, 0), [xi, yo]]
      ring = ring.map(([x, y]) => [x * side, y * end] as XY)
      // mirroring flips the winding when exactly one axis is flipped
      if (side * end < 0) ring.reverse()
      const zTop = t.z1
      walls(darkFrame, ring, t.z0, zTop)
      cap(t.z1 === TOP ? roof : darkFrame, ring, zTop)
      bays(darkGlass, ring, groups(t.z0 + 0.4, zTop - 0.4), { bay: 2.6, gap: 0.3, end: 0.3, minLen: 1.6 })
    }
  }
}

// --- Plant box.
{
  const P: XY[] = rect(-5, -14, 5, 12)
  walls(roof, P, CORE_TOP - 1.5, CORE_TOP + 1.6)
  cap(roof, P, CORE_TOP + 1.6)
}

// --- The covered skybridge stub OSM maps on the east face (way/1186330025).
{
  const B: XY[] = rect(XC, 4.1, 27.6, 7.2)
  walls(lightFrame, B, 9.4, 12.5)
  cap(roof, B, 12.5)
  cap(lightFrame, B, 9.4, false)
  bays(lightGlass, B, [[9.9, 12.0]], { bay: 2.5, gap: 0.3, end: 0.3, minLen: 2.5 })
}

if (import.meta.main) {
  await save('clt-charlotte-plaza', 'Charlotte Plaza', ANCHOR, BEARING, [
    { part: darkFrame, material: finish('charlotte-plaza-black', 0x4a4f57) },
    { part: darkGlass, material: { ...PALETTE.window, color: 0x55667a } },
    { part: lightFrame, material: finish('charlotte-plaza-mullion', 0x6b86a6) },
    { part: lightGlass, material: windowVariant(2, 0x5f8cc4) },
    { part: roof, material: PALETTE.roof },
  ])
}
