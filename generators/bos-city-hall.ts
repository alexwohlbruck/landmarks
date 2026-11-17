/**
 * Boston City Hall (1968, Kallmann McKinnell & Knowles) — original procedural
 * geometry, CC0-1.0.
 * bun generators/bos-city-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 353.1: the long walls of OSM way/788015166 run at
 * 353°, so x is across the building (west front on City Hall Plaza, east
 * side on Congress Street) and y along it. Anchor = the outline's centroid,
 * -71.0579642, 42.360367.
 *
 * Identity (from the photos below):
 *  1. An inverted ziggurat: the top four office storeys oversail the floors
 *     below, each a little wider than the one under it, with a tall plain
 *     concrete attic band on top. (all photos)
 *  2. The deep precast fins: close-set vertical concrete fins in front of
 *     recessed dark windows on every face of the top storeys. (archives,
 *     schwen, bmk-side)
 *  3. Below them, tall concrete piers carrying the top, a recessed glazed
 *     core, and projecting concrete volumes at mid height on the plaza
 *     front: the council chamber block (where "BOSTON CITY HALL" is cut) and
 *     a long row of boxes north of it. (schwen, streetcar2026, daderot)
 *  4. A heavy red-brick base that the sloping plaza runs into: brick
 *     terraces and walls on the north and east (Congress St), a brick pylon
 *     in front of the plaza entrance. (bmk-side, bmk-rear, schwen)
 *  5. A courtyard open to the sky in the middle, its sides stepping in, and
 *     plain penthouses on the roof. (lidar)
 *
 * Plan and heights: USGS 3DEP lidar MA_CentralEastern_1_2021, 1 m grid, read
 * in this frame with tools/lidar_frame.py (heights below are above y = 0, the
 * Congress Street pavement at the east wall, 0.3 m above the box's lowest
 * ground). Measured: the top block's edges x -39..38, y -54..45 (OSM's
 * outline is the ground floor, which is smaller on the plaza and larger on
 * the north-east); roof 41, parapet 41.8; the courtyard opening x -16..12,
 * y -12..20, with ledges at 37.7 and 32.6 and its floor at 13.1; penthouses
 * to 52.7 (south, OSM way/1420293160) and 47.8 (north, way/1420293159,
 * and the two small ones way/1420293161–62); the plaza on the west at
 * about 7.7; the north-east brick terraces 9.5, 13.2 and 17.3 (OSM
 * way/1420293155–57), the north-west one 12.2 (way/1420293154); mid-height
 * volumes: council block top 31 (x -44), the row of boxes 24.3 (x -42), the
 * east boxes 24.3 and 28.4, the south ones 24.3 and 28.4.
 *
 * Estimated from the photos (schwen, streetcar2026; scaled against the
 * measured 34 m from plaza to parapet): four fin storeys of 4 m from 23.6
 * to 39.6, each stepping out about 1.1 m; the attic 39.6–41.8; fin spacing
 * (drawn at 3 m, 4.2 m on the lowest storey, roughly half the real density,
 * as STYLE.md asks for thin repeated members); the piers' size and spacing, the
 * council block's and the boxes' depths, the brick pylon.
 *
 * Ground: Mapterhorn falls 7.5 m from the plaza (west) to Congress Street
 * (east). Elevation 0; the west half's base sinks into the plaza, as the
 * real building's lower floors do. The plaza itself is not modelled.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Boston city hall.jpg, Daniel Schwen, CC BY-SA 4.0 (the plaza front from
 *    the south-west) https://commons.wikimedia.org/wiki/File:Boston_city_hall.jpg
 *  - Boston City Hall May 2026.jpg, 4300streetcar, CC BY 4.0 (plaza front)
 *    https://commons.wikimedia.org/wiki/File:Boston_City_Hall_May_2026.jpg
 *  - Boston City Hall - Boston, MA - DSC04704 (cropped).JPG, Daderot, CC0
 *    (plaza front and south end)
 *    https://commons.wikimedia.org/wiki/File:Boston_City_Hall_-_Boston,_MA_-_DSC04704_(cropped).JPG
 *  - 2017 Boston City Hall side view.jpg, Beyond My Ken, CC BY-SA 4.0 (the
 *    north end and brick base)
 *    https://commons.wikimedia.org/wiki/File:2017_Boston_City_Hall_side_view.jpg
 *  - 2017 Boston City Hall rear view.jpg, Beyond My Ken, CC BY-SA 4.0
 *    (Congress Street side)
 *    https://commons.wikimedia.org/wiki/File:2017_Boston_City_Hall_rear_view.jpg
 *  - Boston City Hall (8658248374).jpg, City of Boston Archives, CC BY 2.0
 *    (the fins at a corner)
 *    https://commons.wikimedia.org/wiki/File:Boston_City_Hall_(8658248374).jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the core's glazing and the piers under the oversailing storeys
 * are simplified; the inscription, the stairs and the brick plaza walls
 * outside the outline are left out. The fin pattern is regularised (the
 * real lower storey alternates wide and narrow bays).
 */
import { Part, type V3 } from './mesh'
import { finish, windowVariant } from './palette'
import { box, onWall, rectShape, save, type XY } from './atl-tech-tower'

const conc = new Part(), brick = new Part(), win = new Part(), roof = new Part(), dark = new Part()

const TX0 = -39, TX1 = 38, TY0 = -54, TY1 = 45 // the top block
// The profile, measured from the plaza photos against the lidar's top edges:
// three fin storeys, each a little wider than the one below, cantilevered
// well out over a lower storey, which in turn oversails the tall piers.
const SOFFIT = 23.6
const ROWS: [number, number, number, number][] = [[27.6, 31.6, 1.6, 2.2], [31.6, 35.6, 0.8, 2.2], [35.6, 39.6, 0, 2.2]]
const LOWER: [number, number, number, number] = [23.6, 27.6, 4.6, 4.0] // the storey under the cantilever
const ATTIC = 39.6, ROOF = 41.0, PARAPET = 41.8
const HOLE = { x0: -16, x1: 12, y0: -12, y1: 20 } // the courtyard opening

type Rect = [number, number, number, number] // x0, x1, y0, y1
const inset = ([x0, x1, y0, y1]: Rect, d: number): Rect => [x0 + d, x1 - d, y0 + d, y1 - d]
/** The four faces of a rect, each a → b with the outside on the right. */
const faces = ([x0, x1, y0, y1]: Rect): [XY, XY][] => [[[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]]]
/** Open walls round a rect (no caps). */
function walls(p: Part, r: Rect, z0: number, z1: number) {
  for (const [a, b] of faces(r)) p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
}
/** A flat ring between an outer rect and an inner rect at height z, facing up or down. */
function ring(p: Part, o: Rect, i: Rect, z: number, up: boolean) {
  const q = (a: V3, b: V3, c: V3, d: V3) => (up ? p.quad(a, b, c, d) : p.quad(a, d, c, b))
  q([o[0], o[2], z], [o[1], o[2], z], [i[1], i[2], z], [i[0], i[2], z])
  q([o[1], o[2], z], [o[1], o[3], z], [i[1], i[3], z], [i[1], i[2], z])
  q([o[1], o[3], z], [o[0], o[3], z], [i[0], i[3], z], [i[1], i[3], z])
  q([o[0], o[3], z], [o[0], o[2], z], [i[0], i[2], z], [i[0], i[3], z])
}
const cap = (p: Part, [x0, x1, y0, y1]: Rect, z: number, up: boolean) =>
  (up ? p.quad([x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]) : p.quad([x0, y0, z], [x0, y1, z], [x1, y1, z], [x1, y0, z]))

const TOP: Rect = [TX0, TX1, TY0, TY1]

// ── The oversailing office storeys: deep shadowed slots between proud fins ──
const DEEP = 1.3
function storey(zb: number, zt: number, d: number, span: number, fin: number) {
  const R = inset(TOP, d), back = inset(R, DEEP)
  // the solid spandrel at the foot of the storey, its soffit and sill
  walls(conc, R, zb, zb + 0.8)
  cap(conc, R, zb, false)
  ring(conc, R, back, zb + 0.8, true)
  // the dark recess behind the fins, glazed
  walls(dark, back, zb + 0.8, zt)
  for (const [a, b] of faces(back)) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    onWall(win, a, b, rectShape(0.3, L - 0.3, zb + 1.0, zt - 0.2), 0.03)
  }
  // the fins: tapering precast wedges from the recess out to the storey's face
  for (const [a, b] of faces(R)) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
    const k = Math.round((L - 2 * DEEP) / span)
    for (let i = 0; i <= k; i++) {
      const sc = DEEP + ((L - 2 * DEEP) * i) / k
      const P = (u: number, v: number, z: number): V3 => [a[0] + t[0] * u + n[0] * v, a[1] + t[1] * u + n[1] * v, z]
      const z0 = zb + 0.8, z1 = zt
      conc.quad(P(sc - fin / 2, -DEEP, z0), P(sc, 0, z0), P(sc, 0, z1), P(sc - fin / 2, -DEEP, z1))
      conc.quad(P(sc, 0, z0), P(sc + fin / 2, -DEEP, z0), P(sc + fin / 2, -DEEP, z1), P(sc, 0, z1))
    }
  }
}
for (const [zb, zt, d, span] of ROWS) storey(zb, zt, d, span, 0.8)
storey(LOWER[0], LOWER[1], LOWER[2], LOWER[3], 1.0)
// the underside of the cantilever, between the lower storey and the fin storeys
ring(conc, inset(TOP, ROWS[0][2]), inset(TOP, LOWER[2]), ROWS[0][0], false)
// The attic band, the parapet and the roof round the courtyard.
const HR: Rect = [HOLE.x0, HOLE.x1, HOLE.y0, HOLE.y1]
walls(conc, TOP, ATTIC, PARAPET)
ring(conc, TOP, inset(TOP, 0.6), PARAPET, true)
// the parapet's inside face, looking in over the roof
for (const [a, b] of faces(inset(TOP, 0.6))) conc.quad([b[0], b[1], ROOF], [a[0], a[1], ROOF], [a[0], a[1], PARAPET], [b[0], b[1], PARAPET])
ring(roof, inset(TOP, 0.6), HR, ROOF, true)
// The courtyard's stepped sides, inward-facing, and its floor.
{
  const steps: [Rect, number, number][] = [[HR, ROOF, 37.7], [[-12, 8, -8, 16], 37.7, 32.6], [[-8, 4, -4, 12], 32.6, 13.1]]
  steps.forEach(([r, z1, z0], i) => {
    for (const [a, b] of faces(r)) conc.quad([b[0], b[1], z0], [a[0], a[1], z0], [a[0], a[1], z1], [b[0], b[1], z1])
    const next = steps[i + 1]
    if (next) ring(roof, r, next[0], z0, true)
    else cap(roof, r, z0, true)
  })
  // the courtyard's windows on its deep inner walls
  for (const [a, b] of faces([-8, 4, -4, 12])) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    // inward-facing: run the face backwards so onWall's outside is the courtyard
    onWall(win, b, a, rectShape(0.8, L - 0.8, 16, 31), 0.05)
  }
}
// Penthouses on the roof.
box(conc, -10.5, 8.1, -41.4, -13.7, ROOF, 47.8, conc, 0.3)
box(conc, -7.5, 5.5, -38, -17, 47.8, 52.7, roof, 0.3)
box(conc, -12.7, 9.8, 27.2, 39.1, ROOF, 47.8, roof, 0.3)
box(conc, 11.7, 16.5, -32, -14, ROOF, 47.8, roof, 0.3)
box(conc, -19.2, -13.9, -32.2, -14, ROOF, 47.8, roof, 0.3)

// ── Below the storeys: the glazed core, the piers ──
const CORE: Rect = inset(TOP, 10)
walls(dark, CORE, 0, SOFFIT)
for (const [a, b] of faces(CORE)) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  for (const [z0, z1] of [[10, 14.5], [16.5, 21]]) onWall(win, a, b, rectShape(1.5, L - 1.5, z0, z1), 0.04)
}
const PIER: Rect = inset(TOP, 7.2)
for (const [a, b] of faces(PIER)) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const k = Math.round(L / 10)
  for (let i = 0; i < k; i++) {
    const s = (L * i) / k, c: XY = [a[0] + t[0] * s, a[1] + t[1] * s], w = 1.1, dd = 2.2
    const xs = [c[0] - w - Math.abs(n[0]) * dd, c[0] + w + Math.abs(n[0]) * dd], ys = [c[1] - w - Math.abs(n[1]) * dd, c[1] + w + Math.abs(n[1]) * dd]
    box(conc, Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys), 0, SOFFIT, null, 0)
  }
}

// ── The mid-height volumes ──
/** A concrete volume with a window band on its outer faces. */
function volume(r: Rect, z0: number, z1: number, band: [number, number]) {
  box(conc, r[0], r[1], r[2], r[3], z0, z1, roof, 0.3, true)
  for (const [a, b] of faces(r)) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L > 2.5) onWall(win, a, b, rectShape(0.8, L - 0.8, band[0], band[1]), 0.04)
  }
}
volume([-44, -35, -33.6, -22], 16, 31, [20, 27.5]) // the council chamber block
for (const [y0, y1] of [[-21.4, -14.4], [-13.8, -6.8], [-6.2, 0.8], [1.4, 8.4], [9, 16]] as [number, number][]) volume([-42.5, -35, y0, y1], 18.5, 24.3, [20, 23])
volume([37, 40.6, -11, 10.9], 13.5, 24.3, [17, 22.5]) // east, over Congress St
volume([37, 40.7, -45.9, -33.1], 13.5, 28.4, [17, 26])
volume([-10.4, 12, -55.2, -50.5], 14, 24.3, [17, 22.5]) // south end
volume([14, 29.7, -55.2, -50.5], 14, 28.4, [17, 26])
// the piers carrying the projecting volumes down to the plaza
for (const y of [-31, -24, -20, -12, -4.6, 3, 10.6]) box(conc, -40.5, -38.5, y - 0.9, y + 0.9, 0, 18.5, null, 0)

// ── The brick base ──
const PODIUM: Rect = [-36.5, 34.4, -48.7, 42]
box(brick, ...PODIUM, 0, 9.0, roof, 0.3)
box(brick, 34.4, 37.6, -11, 58.1, 0, 9.5, brick, 0.3)
box(brick, 15.3, 37.6, 42, 66.8, 0, 9.5, brick, 0.3)
box(brick, 13.4, 34.6, 42, 58.1, 0, 13.2, brick, 0.3)
box(brick, 13.4, 32.7, 42, 52.1, 0, 17.3, brick, 0.3)
box(brick, -28.4, -7.3, 42, 53.1, 0, 12.2, brick, 0.3)
box(brick, -36.6, 13.4, 38, 45.6, 0, 9.5, brick, 0.3)
box(brick, -47, -43, -40.5, -36.5, 0, 19.5, brick, 0.3) // the pylon by the plaza entrance
// Congress Street and north entrances: dark glazing in the brick base.
onWall(win, [37.6, -11], [37.6, 58.1], rectShape(8, 20, 1.5, 6.5), 0.04)
onWall(win, [37.6, 66.8], [15.3, 66.8], rectShape(4, 16, 1.5, 6.5), 0.04)

// Night: the concrete is lit from below on the plaza front; windows glow.
await save('bos-city-hall', 'Boston City Hall', [
  { part: conc, material: { ...finish('cityhall-concrete', 0xd6d0c4), floodlight: (p, n) => (n[0] < -0.7 && p[2] < 30 ? 0.4 : 0) } },
  { part: brick, material: finish('cityhall-brick', 0xae6a55) },
  { part: dark, material: finish('cityhall-recess', 0x6e6a64) },
  { part: win, material: windowVariant(2, 0x4e5661) },
  { part: roof, material: finish('cityhall-roof', 0xbdb8ae) },
], { height: 52.7, anchor: [42.360367, -71.0579642], bearing: 353.1 }, 6500)
