/**
 * Dallas Union Station (Eddie Bernice Johnson Union Station), 400 South
 * Houston Street, 1916, Jarvis Hunt — original procedural geometry, CC0-1.0.
 * bun generators/dal-union-station.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/25699224
 * (building=train_station, "EBJ Union Station"), 32.7761299, -96.8075375.
 * Its walls run at 345° / 75°, so the catalog bearing is 345: +x faces
 * Houston Street (east-north-east), +y runs along it.
 *
 * Identity, in order: the long white glazed-brick Beaux-Arts block on a grey
 * granite base; the Houston Street front, symmetric about a recessed loggia
 * of six columns before tall arched windows, between plain piers, aedicule
 * window bays and end pavilions with paired engaged columns and raised
 * balustraded attics; the Grand Hall rising behind, with three lunettes
 * over the track-side roofs; the two-storey track-side wing carried on piers
 * over an open undercroft.
 *
 * Evidence:
 *  - plan: OSM outline (18 points), squared to the frame and made
 *    symmetric: OSM's east face steps 1.3-1.6 m at each end pavilion but is
 *    skewed ~1.4 m end to end, and the north and south blocks' west faces
 *    differ by 1.7 m; both drawn at their mean. The Grand Hall (22.5 x
 *    40 m), the track-side wing and the 5.4 m north annex placed from the
 *    lidar and USGS NAIP (0.15 m), shifted ~2.5 m north-east to the OSM
 *    outline (the lidar sits that far off it).
 *  - heights: USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018 flight),
 *    0.5 m grid, above the street (ground_min + 1.2): Grand Hall roof 23.3,
 *    three-storey blocks 17.7, corner attics 19.8-20, track-side wing 12.4,
 *    north annex 5.4. Measured.
 *  - front: belt course 4.8 m and entablature 13.0-14.8 m scaled from
 *    kla4067's view (~25 px/m at the attic); section widths (pavilions
 *    11.6 m from OSM; window bays 12, piers 6, loggia 27.4) estimated from
 *    the same photo and Renelibrary's; six loggia columns (photos), ~1.5 m
 *    diameter (estimated), in front of a ~4.5 m deep recess drawn in a
 *    shade finish (#8e8b86) for its deep shadow; tall arched windows in all
 *    five intercolumns, ~7.7 m to the crown. Pavilion columns ~1.4 m.
 *  - other faces: nine bays on the north and south ends (Renelibrary); four
 *    window groups over seven undercroft piers on the track side and three
 *    lunettes on the hall (Michael Barera's views from Reunion Tower).
 *  - colour: near-white glazed brick (#f1ece2, at `stone`/`trim` lightness),
 *    grey granite base pulled light (#bdbcb6), pale `trim` cornices,
 *    columns and balustrade panels; flat roofs `roof`.
 *  - night: windows glow; the walls carry a modest _FLOODLIGHT wash, fading
 *    upward, from the station's lit corner in Milestone2's dusk view of
 *    Reunion Tower.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - DallasUnionStation.jpg, kla4067, CC BY 2.0 (Houston Street front)
 *  - Dallas_Union_Station_Wiki_(1_of_1).jpg, Renelibrary, CC BY-SA 4.0
 *    (from the south-east)
 *  - View_of_Union_Station_from_Reunion_Tower_August_2015_12.jpg, Michael
 *    Barera, CC BY-SA 4.0 (aerial from the south-west)
 *  - Dallas_EBJ_Eddie_Bernice_Johnson_Union_Station_May_2024.jpg,
 *    IcedCowboyCoffee, CC0 (aerial from the south-west)
 *  - Downtown_Dallas_Skyline_with_shot_of_Hyatt_Regency_Dallas_and_the_Reunion_Tower.jpg,
 *    Milestone2, CC BY-SA 3.0 (night)
 * Published: opened 1916, Jarvis Hunt, Beaux-Arts, NRHP 75001966
 * (Wikipedia). No look-only sources. No commercial imagery or 3D tiles.
 *
 * Doubts: the north face is only seen obliquely, so it mirrors the south;
 * the hall's east wall and the roofs' skylights and plant are simplified
 * away; the loggia depth (4.5 m) is estimated.
 *
 * Left out: the medallions, lettering, cornice dentils, window tracery,
 * rooftop plant and the Grand Hall's roof vents, the platform canopies.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { archPanel, block, cap, lathe, panel, rect, save, wallBays, type XY } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.7761299, -96.8075375]
const BEARING = 345

// Plan (model frame: x toward 75°, the Houston Street front; y toward 345°).
const FRONT = 22.2 // Houston Street face
const PAV = 23.6 // the end pavilions stand 1.4 m proud
const WEST = -17.8 // west faces of the north and south blocks
const WING = -25.8 // track-side wing
const HALL_W = -7, HALL_E = 15.5, HALL_S = -21, HALL_N = 19.1
const YS = -43.9, YN = 42.7, C = (YS + YN) / 2
// Front sections, as distance from the centre line C.
const LOG = 13.7, PIER = 19.7, BAY = 31.7
/** Depth of the loggia behind the column line (estimated). */
const DEEP = 4.5

// Heights (lidar, above the street).
const BELT = 4.8, ENT = 13.0, CORNICE = 14.8, ATTIC = 17.7, CORNER = 19.8, HALL = 23.3, WING_H = 12.4, UNDER = 4.4

function build() {
  const shade = new Part(), brick = new Part(), trim = new Part(), win = new Part(), roof = new Part(), granite = new Part()
  const box = (x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bevel = 0.4, wall = brick, top: Part | null = roof) =>
    block(wall, top, rect(x0, y0, x1, y1), z0, z1, bevel)
  /** East face at x from y0 to y1; s is measured northward from y0. */
  const east = (x: number, y0: number, y1: number): [XY, XY] => [[x, y0], [x, y1]]
  const north = (y: number, x0: number, x1: number): [XY, XY] => [[x1, y], [x0, y]]
  const south = (y: number, x0: number, x1: number): [XY, XY] => [[x0, y], [x1, y]]
  const west = (x: number, y0: number, y1: number): [XY, XY] => [[x, y1], [x, y0]]

  // --- Masses -------------------------------------------------------------
  // North and south blocks, three storeys, full depth.
  box(WEST, HALL_N, FRONT, C + BAY, 0, ATTIC)
  box(WEST, C - BAY, FRONT, HALL_S, 0, ATTIC)
  // End pavilions on Houston Street, with the raised corner attics.
  box(WEST, C + BAY, PAV, YN, 0, ATTIC)
  box(WEST, YS, PAV, C - BAY, 0, ATTIC)
  for (const [y0, y1] of [[C + BAY, YN], [YS, C - BAY]]) {
    box(12, y0, PAV - 0.3, y1, ATTIC - 0.4, CORNER, 0.35)
    box(WEST + 0.3, y0, -8, y1, ATTIC - 0.4, CORNER, 0.35)
  }
  // Front range between the pavilions, with the recessed loggia.
  box(HALL_E, HALL_S, FRONT, HALL_N, 0, BELT, 0, brick, brick)
  box(HALL_E, HALL_S, FRONT, C - LOG, BELT, ATTIC)
  box(HALL_E, C + LOG, FRONT, HALL_N, BELT, ATTIC)
  box(HALL_E, C - LOG, FRONT - DEEP, C + LOG, BELT, ATTIC)
  const lintel = box(FRONT - DEEP - 0.2, C - LOG, FRONT, C + LOG, ENT, ATTIC)
  cap(shade, rect(FRONT - DEEP - 0.2, C - LOG, FRONT, C + LOG), ENT, false)
  // The recess in shadow: back wall and side walls.
  panel(shade, ...east(FRONT - DEEP, C - LOG, C + LOG), 0, 2 * LOG, BELT, ENT, 0.03)
  panel(shade, ...north(C - LOG, FRONT - DEEP, FRONT), 0, DEEP, BELT, ENT, 0.03)
  panel(shade, ...south(C + LOG, FRONT - DEEP, FRONT), 0, DEEP, BELT, ENT, 0.03)
  void lintel
  // The Grand Hall, rising over everything.
  box(HALL_W, HALL_S, HALL_E, HALL_N, 0, HALL, 0.5)
  box(HALL_W - 0.3, HALL_S - 0.3, HALL_E + 0.3, HALL_N + 0.3, HALL - 1.0, HALL - 0.4, 0.3, trim, null)
  // Track-side wing: upper storey on piers over an open undercroft.
  box(WING + 3, C - BAY + 0.1, HALL_W, HALL_N + 1.5, 0, UNDER, 0, brick, null)
  box(WING, C - BAY + 0.1, HALL_W, HALL_N + 1.5, UNDER, WING_H)
  cap(brick, rect(WING, C - BAY + 0.1, WING + 3, HALL_N + 1.5), UNDER, false)
  for (let k = 0; k < 7; k++) {
    const y = C - BAY + 1.2 + k * ((HALL_N + 1.5 - (C - BAY) - 2.4) / 6)
    box(WING + 0.1, y - 0.55, WING + 1.2, y + 0.55, 0, UNDER, 0, brick, null)
  }
  // Low annex on the north side.
  box(-0.5, YN - 0.1, 20, YN + 4.5, 0, 5.4, 0.3)

  // --- Courses ------------------------------------------------------------
  // Grey granite base and pale belt and main cornice round the three-storey blocks.
  const ring = (x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, out: number, p: Part) =>
    block(p, null, rect(x0 - out, y0 - out, x1 + out, y1 + out), z0, z1, 0)
  for (const [y0, y1, x1] of [[C + BAY, YN, PAV], [YS, C - BAY, PAV], [HALL_N, C + BAY, FRONT], [C - BAY, HALL_S, FRONT]] as [number, number, number][]) {
    ring(WEST, y0, x1, y1, 0, 1.2, 0.1, granite)
    ring(WEST, y0, x1, y1, BELT - 0.3, BELT, 0.12, trim)
    ring(WEST, y0, x1, y1, ENT + 0.6, CORNICE, 0.22, trim)
    ring(WEST, y0, x1, y1, ATTIC - 0.4, ATTIC, 0.1, trim)
  }
  for (const [y0, y1] of [[HALL_S, C - LOG], [C + LOG, HALL_N]]) {
    ring(HALL_E + 0.2, y0, FRONT, y1, 0, 1.2, 0.1, granite)
    ring(HALL_E + 0.2, y0, FRONT, y1, BELT - 0.3, BELT, 0.12, trim)
    ring(HALL_E + 0.2, y0, FRONT, y1, ENT + 0.6, CORNICE, 0.22, trim)
  }
  // Entablature over the loggia, and the base under it.
  block(trim, null, rect(FRONT - DEEP - 0.2, C - LOG, FRONT + 0.22, C + LOG), ENT + 0.6, CORNICE, 0)
  block(granite, null, rect(HALL_E + 0.2, C - LOG, FRONT + 0.1, C + LOG), 0, 1.2, 0)

  // --- The Houston Street front -------------------------------------------
  // The loggia: six columns before five tall arched windows, doors below.
  const pitch = (2 * LOG) / 6
  for (let k = 0; k < 6; k++) {
    const y = C - LOG + pitch * (k + 0.5)
    lathe(trim, FRONT - 1.0, y, [[0.95, BELT], [0.95, BELT + 0.5], [0.78, BELT + 0.8], [0.72, ENT - 0.8], [0.95, ENT - 0.35], [0.95, ENT]], 12)
  }
  for (let k = 0; k < 5; k++) {
    const s = pitch * (k + 1) // centre of the k-th intercolumn, from C - LOG
    const [a, b] = east(FRONT - DEEP, C - LOG, C + LOG)
    archPanel(win, a, b, s - 1.4, s + 1.4, BELT + 0.3, ENT - 1.6, 0.06, 8)
    const [ga, gb] = east(FRONT, C - LOG, C + LOG)
    if (k % 2 === 0) panel(win, ga, gb, s - 1.8, s + 1.8, 1.2, BELT - 0.6, 0.06)
    else panel(win, ga, gb, s - 1.1, s + 1.1, 1.6, BELT - 0.8, 0.06)
  }
  // Window-bay sections: an aedicule window over a glazed doorway, and a
  // balustrade panel in the attic.
  for (const sgn of [1, -1]) {
    const y0 = sgn > 0 ? C + PIER : C - BAY, y1 = sgn > 0 ? C + BAY : C - PIER
    const [a, b] = east(FRONT, y0, y1), m = (y1 - y0) / 2
    panel(win, a, b, m - 2.4, m + 2.4, 1.2, BELT - 0.6, 0.06)
    panel(trim, a, b, m - 3.0, m + 3.0, BELT + 0.6, ENT - 0.2, 0.12)
    panel(win, a, b, m - 2.4, m + 2.4, BELT + 1.0, ENT - 0.8, 0.18)
    panel(trim, a, b, m - 3.6, m + 3.6, CORNICE + 0.6, ATTIC - 0.9, 0.12)
    // the piers each side of the loggia: a tall narrow slot window
    const p0 = sgn > 0 ? C + LOG : C - PIER, p1 = sgn > 0 ? C + PIER : C - LOG
    const [pa, pb] = east(FRONT, p0, p1)
    panel(win, pa, pb, (p1 - p0) / 2 - 0.35, (p1 - p0) / 2 + 0.35, BELT + 2.4, ENT - 2.4, 0.06)
    panel(win, pa, pb, (p1 - p0) / 2 - 1.2, (p1 - p0) / 2 + 1.2, 1.6, BELT - 0.8, 0.06)
  }
  // Attic balustrade panels over the loggia.
  {
    const [a, b] = east(FRONT + 0.22, C - LOG, C + LOG)
    for (const s of [0.18, 0.5, 0.82]) panel(trim, a, b, s * 2 * LOG - 2.8, s * 2 * LOG + 2.8, CORNICE + 0.6, ATTIC - 0.9, 0.1)
  }
  // End pavilions: two engaged columns round a stack of windows.
  for (const [y0, y1] of [[C + BAY, YN], [YS, C - BAY]]) {
    const yc = (y0 + y1) / 2, [a, b] = east(PAV, y0, y1), m = (y1 - y0) / 2
    for (const d of [-3.6, 3.6]) lathe(trim, PAV + 0.35, yc + d, [[0.92, BELT], [0.92, BELT + 0.5], [0.76, BELT + 0.8], [0.7, ENT - 0.8], [0.92, ENT - 0.35], [0.92, ENT]], 12)
    panel(win, a, b, m - 1.6, m + 1.6, 1.8, BELT - 0.8, 0.06)
    panel(win, a, b, m - 1.6, m + 1.6, BELT + 1.0, BELT + 3.6, 0.06)
    panel(win, a, b, m - 1.6, m + 1.6, BELT + 4.6, ENT - 0.9, 0.06)
    const [ta, tb] = east(PAV - 0.3, y0, y1)
    panel(trim, ta, tb, m - 3.4, m + 3.4, ATTIC + 0.1, CORNER - 0.6, 0.06)
  }

  // --- The other faces ----------------------------------------------------
  const storeys: [number, number][] = [[1.8, BELT - 0.8], [BELT + 1.0, ENT - 0.8], [CORNICE + 0.6, ATTIC - 0.9]]
  // North and south ends: nine bays.
  for (const [a, b] of [north(YN, WEST, PAV), south(YS, WEST, PAV)]) wallBays(win, a, b, storeys, { pitch: 4.5, w: 2.2, end: 1.6, skip: (s, P) => P[0] > -1 && P[0] < 20.5 && P[1] > 0 })
  // Annex: a band of windows.
  wallBays(win, ...north(YN + 4.5, -0.5, 20), [[1.4, 4.0]], { pitch: 4, w: 2.6, end: 1 })
  // West faces of the end blocks, above and beside the wing.
  for (const [y0, y1] of [[HALL_N + 1.5, YN], [YS, C - BAY + 0.1]]) wallBays(win, ...west(WEST, y0, y1), storeys, { pitch: 4.5, w: 2.2, end: 1.6 })
  for (const [y0, y1] of [[C - BAY + 0.1, HALL_N + 1.5]]) wallBays(win, ...west(WEST, y0, y1), [[WING_H + 1.4, ATTIC - 0.9]], { pitch: 4.5, w: 2.2, end: 1.6, skip: (s, P) => P[1] > HALL_S - 1 && P[1] < HALL_N + 0.5 })
  // Track-side wing: four groups of windows over the undercroft piers.
  {
    const [a, b] = west(WING, C - BAY + 0.1, HALL_N + 1.5), L = HALL_N + 1.5 - (C - BAY + 0.1)
    for (let k = 0; k < 4; k++) panel(win, a, b, (k + 0.5) * (L / 4) - 3.6, (k + 0.5) * (L / 4) + 3.6, UNDER + 2.0, WING_H - 2.0, 0.05)
    panel(trim, a, b, 0, L, UNDER - 0.3, UNDER + 0.3, 0.1)
    // the undercroft: dark doors along the back wall
    const [ua, ub] = west(WING + 3, C - BAY + 0.1, HALL_N + 1.5)
    for (let k = 0; k < 6; k++) panel(win, ua, ub, (k + 0.5) * (L / 6) - 2.4, (k + 0.5) * (L / 6) + 2.4, 0.6, UNDER - 1.0, 0.05)
  }
  // The Grand Hall's three lunettes over the wing roof.
  {
    const [a, b] = west(HALL_W, HALL_S, HALL_N), L = HALL_N - HALL_S
    for (const s of [0.22, 0.5, 0.78]) archPanel(win, a, b, s * L - 2.8, s * L + 2.8, WING_H + 0.5, WING_H + 0.55, 0.05, 10)
  }

  // Floodlit at night (Milestone2's dusk view): the walls, brightest low
  // down, the roofs not at all.
  const lit = (p: number[], n: number[]) => (Math.abs(n[2]) > 0.5 ? 0 : Math.max(0, 0.5 - 0.016 * p[2]))
  const brickM = { ...finish('union-glazed-brick', 0xf1ece2), floodlight: lit }
  const trimM = { ...PALETTE.trim, floodlight: lit }
  return [
    { part: brick, material: brickM },
    { part: trim, material: trimM },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: granite, material: finish('union-granite', 0xbdbcb6) },
    // the loggia's recess, which reads as deep shadow in every daylight photo
    { part: shade, material: finish('union-loggia-shade', 0x8e8b86) },
  ]
}

if (import.meta.main) await save('dal-union-station', 'Dallas Union Station', ANCHOR, BEARING, build())
