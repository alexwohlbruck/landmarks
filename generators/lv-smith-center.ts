/**
 * The Smith Center for the Performing Arts, Las Vegas (2012, David M.
 * Schwarz Architects): Reynolds Hall with its lobby, wings and carillon
 * tower. Procedural, CC0-1.0.  bun generators/lv-smith-center.ts
 *
 * Map frame: x east, y north, z up, metres, in the building's own grid: the
 * model's north is turned to bearing 28°, the line of the long east face on
 * Grand Central Parkway. So "north" below is the Symphony Park Avenue front
 * (real NNE), "east" the parkway side (real ESE). The origin is the area
 * centroid of the Reynolds Hall outline, way/135294818 (36.1687433,
 * -115.1518646).
 *
 * Measured:
 * - OSM way/135294818 (Smith Center for the Performing Arts) is Reynolds
 *   Hall only: a 63 x 114 m block with a south leg, square to the 28° grid.
 *   Only this outline is modelled. The untagged building=public way west of
 *   it (way/182464619) is left to the map: no photo confirms what it is.
 *   way/182464620 (Discovery Children's Museum) is separate and left out.
 * - USGS NAIP orthophoto (public domain), rotated into the model grid: the
 *   lobby block along the north front (about 24 m deep), the auditorium's
 *   hipped roof behind it (39 x 36 m, its flat top offset), the stage house
 *   south of the auditorium with plant on its roof, lower back-of-house
 *   ranges round the east, west and south sides. The tower's lantern shows
 *   as a bright spot 10 m from the east corner, 6 m in from the north front.
 *
 * Published (Wikipedia, "Smith Center for the Performing Arts"): Neo Art Deco
 * echoing Hoover Dam, white Indiana limestone; "a 17-story carillon tower
 * containing 47 bells" at the corner; 2,050-seat Reynolds Hall. The
 * carillon tower is 170 ft (52 m), 17 storeys, with 47 bells (The Smith
 * Center, thesmithcenter.com/about; Wikipedia).
 *
 * Photos:
 * - "Smithcenterlv.jpg", Neaco, CC BY-SA 3.0 (Wikimedia Commons): from the
 *   north-north-east, the tower at the east end of the north front, the
 *   five-bay front, the hipped grey roof and the stage house behind;
 * - "Smith Center For The Performing Arts 02/03/04/06.jpg", pony rojo,
 *   CC BY-SA 2.0 (Commons): under construction in green sheathing, from the
 *   north. The cleanest massing evidence: a lower wing east of the tower,
 *   the five-bay front in two tiers between full-height piers, a taller
 *   pylon at its west end, the hip roof. Proportions here are read off 02,
 *   the most distant;
 * - "The Smith Center for the Performing Arts & DISCOVERY Children's
 *   Museum.jpg", June H. Johns, CC BY-SA 3.0 (Commons): from the west, the
 *   tower far behind, and the window colour;
 * - "LasVegasSymphonyPark1.jpg", Rmvisuals, CC BY-SA 4.0 (Commons): night,
 *   from the park, the tower beside the north front;
 * - "Smith Center - West - 2010-03-05.JPG", Cygnusloop99, CC BY-SA 3.0
 *   (Commons): the concrete stage house standing above the steel frame.
 * Look-only (not licensed for reuse; described, not copied): "Smith Center
 * Tower", flexible fotography, Flickr, CC BY-NC-SA 2.0 (the tower's corner
 * piers rising into pinnacles, the louvered belfry in the recessed middle
 * bay, the stepped blue glass lantern); "The Smith Center", Sky Island,
 * Flickr, CC BY-ND 2.0 (the north front at dusk).
 * No usable photo shows the east (parkway) or south faces.
 *
 * Published: the tower's 52 m, taken to the lantern top. Estimated: every
 * other height. The tower's pinnacles at 48 m, the shaft at 44 m, 12.4 m
 * square (its width against its height in pony rojo 02); the north front's parapet at 22 m and its west pylon
 * at 24.5 m, the wing east of the tower at 17 m (all scaled from the tower
 * in 02); the auditorium's eaves at 26 m and its hip at 31 m, the stage
 * house at 36 m (from Neaco's view, where it shows above the hip, and
 * from 02, where it does not); the back-of-house ranges at 12-18 m (photos;
 * none published). The window layout follows the photos for the north
 * front; the east and south faces are left plain stone, unseen.
 *
 * Not modelled: the Discovery Children's Museum, the park, the colonnade
 * lettering, the bronze reliefs, the balconies' railings.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, windowVariant } from './palette'
import { prism, cap, ccw, save, type XY } from './lv-wynn'
import { quadTo } from './lv-mgm-grand'

// The limestone reads near white, warm: the palette's stone as it is.
const STONE = PALETTE.stone
const TRIM = PALETTE.trim
const ROOF = PALETTE.roof
// The tall windows read a muted teal-green in daylight (Johns photo).
const WINDOW = { ...PALETTE.window, color: 0x5f7d84 }
// The lantern: reflective blue-silver glass, lit at night, so a light window.
const LANTERN = windowVariant(2, 0xa9bfd1)

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), lantern = new Part()

const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// ------------------------------------------------------------- the grid
// Reynolds Hall, way/135294818, squared to the grid (OSM within 0.3 m):
const XE = 27.4, XW = -35.4, YN = 46.4

// ------------------------------------------------------------- face helpers
/** A flat panel on an axis-aligned face. `side`: which way the face looks. */
function panel(p: Part, side: 'n' | 's' | 'e' | 'w', at: number, u0: number, u1: number, z0: number, z1: number, off = 0.05) {
  if (side === 'n' || side === 's') {
    const y = side === 'n' ? at + off : at - off
    quadTo(p, [u0, y, z0], [u1, y, z0], [u1, y, z1], [u0, y, z1], [0, side === 'n' ? 1 : -1, 0])
  } else {
    const x = side === 'e' ? at + off : at - off
    quadTo(p, [x, u0, z0], [x, u1, z0], [x, u1, z1], [x, u0, z1], [side === 'e' ? 1 : -1, 0, 0])
  }
}
/** A plain box with soft edges, top in `top`. */
const box = (wall: Part, top: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0.3, c = 0.25) =>
  prism(wall, top, rect(x0, x1, y0, y1), z0, z1, b, c)

// ------------------------------------------------------------- Reynolds Hall: the masses
const H_FRONT = 22, H_PYLON = 24.5, H_EWING = 17

// The lobby block on the north front, wrapped round the back of the tower.
prism(stone, roof, [[-26, 22], [16, 22], [16, 34.4], [4, 34.4], [4, YN], [-26, YN]], 0, H_FRONT, 0.5, 0.5)
// Its west pylon, a storey taller with a stepped top.
box(stone, roof, XW, -26, 22, YN, 0, H_PYLON, 0.5, 0.5)
box(stone, roof, XW + 1.6, -27.6, 23.6, YN - 1.6, H_PYLON, H_PYLON + 1.3, 0.3, 0.3)
// The lower wing east of the tower, to the corner on the parkway.
box(stone, roof, 16, XE, 22, YN, 0, H_EWING, 0.5, 0.5)

// The auditorium: stone walls, then the hipped metal roof up to a flat top.
{
  const x0 = -24, x1 = 15, y0 = -14, y1 = 22, ze = 26, zt = 31
  box(stone, stone, x0, x1, y0, y1, 0, ze, 0, 0)
  const lift = (r: XY[], z: number): V3[] => ccw(r).map(([x, y]) => [x, y, z])
  const eave = rect(x0 - 0.4, x1 + 0.4, y0 - 0.4, y1 + 0.4)
  const top = rect(x0 + 8, x1 - 6, y0 + 6.5, y1 - 6.5)
  roof.loft([lift(eave, ze), lift(eave, ze + 0.5)])
  roof.loft([lift(eave, ze + 0.5), lift(top, zt)])
  cap(roof, top, zt)
  cap(roof, eave, ze, false)
}
// The stage house behind it, the tallest block.
box(stone, roof, -24, 15, -34, -14, 0, 36, 0.5, 0.5)
// Back-of-house ranges: west along the court, east along the parkway, south.
box(stone, roof, XW, -24, 6.5, 22, 0, 18, 0.5, 0.5)
box(stone, roof, 15, XE, -45.3, 22, 0, 18, 0.5, 0.5)
box(stone, roof, -24, 15, -45.3, -34, 0, 15, 0.5, 0.5)
box(stone, roof, 15.5, 27.2, -67.6, -45.3, 0, 12, 0.5, 0.5)

// ------------------------------------------------------------- the north front
// Five bays between full-height piers, two tiers of tall windows with a
// frieze between (the lettering band), plain attic above.
{
  const x0 = -26, x1 = 3.8, n = 5, bay = (x1 - x0) / n, pw = 1.2
  for (let i = 0; i <= n; i++) {
    const x = x0 + i * bay
    const a = Math.max(x0, x - pw / 2), b = Math.min(x1 + 0.2, x + pw / 2)
    box(stone, trim, a, b, YN - 0.3, YN + 0.55, 0, H_FRONT + 1.2, 0.2, 0.15)
  }
  for (let i = 0; i < n; i++) {
    const a = x0 + i * bay + pw / 2 + 0.35, b = x0 + (i + 1) * bay - pw / 2 - 0.35
    panel(win, 'n', YN, a, b, 2.4, 9.6)
    panel(win, 'n', YN, a, b, 14.0, 18.8)
  }
  // the balcony band under the upper tier
  panel(trim, 'n', YN, x0 + 0.8, x1 - 0.4, 12.6, 13.4)
}
// The west pylon: a tall window in each tier, centred.
panel(win, 'n', YN, -32.1, -29.3, 1.0, 9.8)
panel(win, 'n', YN, -32.1, -29.3, 13.8, 20.5)
// West face of the pylon over the court: the same two windows.
panel(win, 'w', XW, 30.4, 37.6, 1.0, 9.8)
panel(win, 'w', XW, 30.4, 37.6, 13.8, 20.5)
// The east wing: one broad window per tier on the north front and the parkway.
panel(win, 'n', YN, 18.4, 25.0, 1.0, 9.8)
panel(win, 'n', YN, 18.4, 25.0, 11.6, 14.8)
for (const [a, b] of [[25.5, 33.5], [36, 44]] as [number, number][]) {
  panel(win, 'e', XE, a, b, 1.0, 9.8)
  panel(win, 'e', XE, a, b, 11.6, 14.8)
}

// ------------------------------------------------------------- the carillon tower
{
  const cx = 10, cy = 40.6, h = 6.2 // 12.4 m square, 0.4 m proud of the front
  const H_SHAFT = 44, H_PIER = 42.5, H_PIN = 48.2, H_TOP = 52
  // recessed core
  box(stone, roof, cx - h + 0.7, cx + h - 0.7, cy - h + 0.7, cy + h - 0.7, 0, H_SHAFT, 0.3, 0)
  // corner piers: full height, then a step in, then the pinnacles
  const pier = 3.0
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const ox = cx + sx * h, oy = cy + sy * h // the outer corner
    const r = (d: number, z0: number, z1: number, top: Part, b: number) => {
      const xa = Math.min(ox, ox - sx * d), xb = Math.max(ox, ox - sx * d)
      const ya = Math.min(oy, oy - sy * d), yb = Math.max(oy, oy - sy * d)
      box(stone, top, xa, xb, ya, yb, z0, z1, b, b)
    }
    r(pier, 0, H_PIER, stone, 0.35)
    // the step: shifted in from the outer corner so it reads as a setback
    const ix = ox - sx * 0.5, iy = oy - sy * 0.5, d2 = 2.3
    box(stone, stone, Math.min(ix, ix - sx * d2), Math.max(ix, ix - sx * d2), Math.min(iy, iy - sy * d2), Math.max(iy, iy - sy * d2), H_PIER, H_SHAFT + 1.5, 0.3, 0.3)
    const jx = ox - sx * 0.9, jy = oy - sy * 0.9, d3 = 1.3
    box(stone, trim, Math.min(jx, jx - sx * d3), Math.max(jx, jx - sx * d3), Math.min(jy, jy - sy * d3), Math.max(jy, jy - sy * d3), H_SHAFT + 1.5, H_PIN, 0.25, 0.25)
  }
  // the recessed middle bay of each face: the louvered belfry, and the
  // band of three small windows under it
  const core = h - 0.7, bw = h - pier // half-width of the middle bay
  for (const side of ['n', 's', 'e', 'w'] as const) {
    const at = side === 'n' ? cy + core : side === 's' ? cy - core : side === 'e' ? cx + core : cx - core
    const c = side === 'n' || side === 's' ? cx : cy
    panel(lantern, side, at, c - bw + 0.5, c + bw - 0.5, 30.5, 42.0)
    panel(win, side, at, c - bw + 0.9, c + bw - 0.9, 26.4, 28.6)
  }
  // the lantern: three stepped tiers of glass with chamfered corners, a pale
  // band between tiers
  const tier = (half: number, z0: number, z1: number, part: Part, ch: number) =>
    prism(part, part, rect(cx - half, cx + half, cy - half, cy + half), z0, z1, 0, ch)
  tier(3.9, H_SHAFT - 0.5, 48.0, lantern, 1.0)
  tier(3.5, 48.0, 48.5, trim, 0.9)
  tier(3.2, 48.5, 50.4, lantern, 0.8)
  tier(2.8, 50.4, 50.8, trim, 0.7)
  tier(2.4, 50.8, H_TOP - 0.3, lantern, 0.6)
  tier(1.6, H_TOP - 0.3, H_TOP, trim, 0.4)
}

if (import.meta.main) {
  await save('lv-smith-center', 'The Smith Center for the Performing Arts', [
    { part: stone, material: STONE },
    { part: trim, material: TRIM },
    { part: roof, material: ROOF },
    { part: win, material: WINDOW },
    { part: lantern, material: LANTERN },
  ], 52, 'Y up, -Z north, +X east, metres; origin at the way/135294818 centroid; bearing 28')
}
