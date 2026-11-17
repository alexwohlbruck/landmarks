/**
 * Neues Rathaus, Marienplatz, Munich: Georg von Hauberrisser, built in
 * three phases 1867-1908 (the brick east part on Marienplatz first,
 * 1867-74; the stone west part and the tower 1898-1905). Original
 * procedural geometry, CC0-1.0.
 * bun generators/munich-neues-rathaus.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM multipolygon relation/147095
 * (outer ring minus its six courtyards), 48.137797, 11.575929. The walls
 * run at 18 / 108 degrees, so the catalog bearing is 18: -y is the
 * Marienplatz front (south-south-west), +y the Landschaftstraße.
 *
 * Identity, in order: the 85 m tower rising from the Marienplatz front,
 * left of centre: the square lower tower with the arched passage and the
 * green copper Glockenspiel oriel, the gallery with four corner turrets at
 * the main roofline, the square upper tower with its clock and corner
 * pinnacles, the open octagonal lantern and the crocketed stone spire with
 * the Münchner Kindl; the long front (98.5 m) with its ground-floor
 * arcade, grouped window bays, a balustrade with pinnacles all along the
 * roofline, little oriel turrets and the tall corner turret at the west
 * end; the brick east part with its big pinnacled gable between two
 * slender spires; the steep dark roofs over wings round six courtyards.
 *
 * Evidence:
 *  - plan: the OSM multipolygon relation/147095 (outer way 23632633, six
 *    courtyard inners) and its parts, read in the turned frame. The wings
 *    are drawn as 16 rectangles between the courtyards (front wing y
 *    -45.2..-27.5; west, north and east wings; the cross wings), each with
 *    a hipped roof; the courtyards are the gaps. The tower: parts 219431689
 *    (12.3 x 11.4 m, to 40 m), 222518028 (8 m square, 40-60), 222518027
 *    (round, 6.5 m, 60-70), 222518030 (spire, 70-85); its corner turrets
 *    224138001-004 (30-40) and 224138007-010 (55-63); the west corner turret
 *    224138012; the front's small turrets 224253364-387.
 *  - heights: tower 85 m and front 98.5 m long, the first phase 48 m of it
 *    (de.wikipedia, Neues Rathaus (München)); OSM wing height 26 m. The
 *    eave (balustrade) 22 m and ridges ~29-31 m, the tower stages
 *    (Glockenspiel oriel 21.5-31, gallery 38-39.5, clock at 51, lantern
 *    60.5-70, spire to 83.2, figure to 85), the east gable (to 41 m, pinnacle
 *    44.6) and its spires (43.5 m), the corner turret (spire to 40 m) are scaled from
 *    Steffen Flor's front view from St Peter (front 0.124 m per px, the
 *    tower from its own 85 m) and checked against Martin Falbisoner's.
 *  - review round 2: warm grey-brown stone, dark brown brick and dark
 *    grey slate (pulled from Flor's photo), steeper roofs, smaller paired
 *    windows with stone mullions and string courses, pinnacles every 2.5 m
 *    and more gabled dormers on the front, a taller gable, an open lantern
 *    with tracery heads and pinnacle rings round the spire; the window bays
 *    on the north and east outer faces were dropped for budget.
 *  - colours from the daylight photos: grey-beige limestone, the reddish
 *    brick of the first phase (drawn on the front between x 12 and the
 *    east end), the dark brown-grey roofs, the green copper oriel, the
 *    gilt clock ring.
 *  - elevation 0 (flat Marienplatz). No lidar in Germany; no 3D city
 *    models.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Neues_Rathaus_München_2018.jpg (Steffen Flor, CC BY-SA 4.0): the whole
 *    front from St Peter; the main reference.
 *  - Neues_Rathaus_Munich_March_2013.JPG (Martin Falbisoner, CC BY-SA 3.0):
 *    the tower and the front from St Peter, detail.
 *  - Neues_Rathaus_München_-_2014_-_Alter_Peter.jpg (High Contrast, CC BY
 *    3.0 de): the front and the roofs behind from St Peter.
 *  - München_-_Marienplatz_(Luftbild).jpg (Maximilian Dörrbecker, CC BY-SA
 *    2.5): aerial, courtyards and roofs.
 *  - Turm_Neues_Rathaus_München.jpg (Flocci Nivis, CC BY 4.0): the
 *    courtyard stair tower (not modelled).
 * No commercial imagery, no 3D city models. No look-only sources.
 *
 * Left out: the sculpture, tracery and statues of the front (the oriels,
 * pinnacles and gable carry its crowding), the Glockenspiel figures, the
 * courtyard facades' windows, the roofs' dormers and chimneys, the
 * Prunkhof's octagonal stair tower, the slender rear tower.
 *
 * Doubts: the wings are rectangles, so the slanted west wall and the
 * courtyard corners are approximate; the ridge heights behind the front
 * are estimated; the gable and the tower's tracery are simplified.
 *
 * Uses the kit in munich-frauenkirche.ts.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, rect, lathe, walls, spire, cap, along, archOn, bbox, face, ngon, rectOn, ball, pointedOn, sidesOf, segsOf, post, band, clock, type XY } from './munich-frauenkirche'
import { hipRoof, wallSlab, column } from './amsterdam-westerkerk'

function build() {
  const stone = new Part(), roof = new Part(), brick = new Part(), win = new Part(), copper = new Part(), gold = new Part()
  const EAVE = 22.0

  // ------------------------------------------------------------- the wings
  const wings: [number, number, number, number][] = [
    [-50.5, -45.2, 49.6, -27.5], // front
    [-52.8, -27.5, -36.4, 42.3], // west
    [-52.8, 31.0, 56.8, 42.3], // north
    [40.2, -27.5, 50.2, -1.6], // east, south part
    [41.6, -1.6, 55.0, 31.0], // east, north part
    [-8.5, -27.5, 1.5, -2.8],
    [-8.5, -2.8, 6.6, 22.5],
    [6.6, 12.4, 41.6, 22.5],
    [6.6, -21.0, 41.6, -2.8],
    [21.3, -27.5, 28.2, -21.0],
    [-3.3, 22.5, 17.4, 31.0],
    [-36.4, 9.6, -8.5, 22.5],
    [-36.4, 22.5, -11.7, 31.0],
    [-36.4, -12.4, -28.5, -4.3],
    [-14.9, -27.5, -8.5, -21.2],
  ]
  for (const [x0, y0, x1, y1] of wings) {
    walls(stone, rect(x0, y0, x1, y1), 0, EAVE)
    const d = Math.min(x1 - x0, y1 - y0)
    hipRoof(roof, x0, y0, x1, y1, EAVE, EAVE + Math.min(12.5, d * 0.72), 0.35)
  }

  // ------------------------------------------------------ the outer faces
  // Grouped window bays on the west, north and east faces.
  const bays = (a: XY, b: XY, pitch = 5.0, z0 = 5.0) => {
    const { L } = along(a, b)
    const n = Math.floor(L / pitch)
    for (let k = 0; k < n; k++) {
      const s = (L - n * pitch) / 2 + (k + 0.5) * pitch
      for (const d of [-0.75, 0.75]) {
        rectOn(win, a, b, s + d, 0.38, z0 + 1.0, 11.2, 0.05)
        rectOn(win, a, b, s + d, 0.38, 14.0, 19.4, 0.05)
      }
    }
  }
  bays([-52.8, 42.3], [-52.8, -27.5])
  bays([50.2, -27.5], [50.2, -1.6])

  // ------------------------------------------------------ the Marienplatz front
  const FY = -45.2, FX0 = -50.5, FX1 = 49.6, TX0 = -26.1, TX1 = -13.8
  const front: [XY, XY] = [[FX0, FY], [FX1, FY]]
  const S = (x: number) => x - FX0
  // The brick of the first building phase, east of x 12.
  rectOn(brick, front[0], front[1], S((12 + FX1) / 2), (FX1 - 12) / 2 - 0.3, 4.8, EAVE - 1.2, 0.04)
  // Arcade and window bays, 5 m pitch, away from the tower.
  for (let x = FX0 + 3.0; x < FX1 - 1.5; x += 5.0) {
    if (x > TX0 - 1.5 && x < TX1 + 1.5) continue
    archOn(stone, front[0], front[1], S(x), 2.2, 0, 3.2, 0.03, 6)
    archOn(win, front[0], front[1], S(x), 1.85, 0, 3.2, 0.07, 6)
    for (const d of [-0.85, 0.85]) {
      rectOn(win, front[0], front[1], S(x) + d, 0.46, 6.8, 11.6, 0.08)
      rectOn(win, front[0], front[1], S(x) + d, 0.46, 14.2, 19.0, 0.08)
    }
    // a stone mullion standing proud between the pair
    bbox(stone, stone, x - 0.22, FY - 0.28, x + 0.22, FY, 6.4, 19.4, 0.08)
    // stone piers between the bays, standing proud
    bbox(stone, stone, x + 2.5 - 0.35, FY - 0.35, x + 2.5 + 0.35, FY, 0, EAVE - 0.4, 0.12)
  }
  // String course over the arcade, balustrade with pinnacles at the eave.
  bbox(stone, stone, FX0, FY - 0.45, FX1, FY, 4.4, 5.0, 0.12)
  for (const z of [6.2, 12.0, 13.6, 19.4]) {
    bbox(stone, stone, FX0, FY - 0.42, TX0, FY, z, z + 0.4, 0.1)
    bbox(stone, stone, TX1, FY - 0.42, FX1, FY, z, z + 0.4, 0.1)
  }
  bbox(stone, stone, FX0, FY - 0.5, FX1, FY + 0.4, EAVE - 0.4, EAVE + 1.3, 0.1)
  for (let x = FX0 + 0.5; x <= FX1; x += 2.5) {
    if (x > TX0 - 0.5 && x < TX1 + 0.5) continue
    if (x > 15.0 && x < 34.6) continue
    const big = Math.round((x - FX0 - 0.5) / 2.5) % 2 === 0
    if (big) post(stone, stone, x, FY - 0.15, 0.32, EAVE + 1.3, EAVE + 3.0, Math.PI / 4, 2.4)
    else spire(stone, [[x - 0.25, FY - 0.4], [x + 0.25, FY - 0.4], [x + 0.25, FY + 0.1], [x - 0.25, FY + 0.1]], EAVE + 1.3, [x, FY - 0.15, EAVE + 3.4])
  }
  // Little gabled dormers on the front roof.
  for (const x of [-42.0, -37.5, -33.0, -11.0, -6.5, -2.0, 2.5, 7.0, 11.5, 38.5, 43.5]) {
    const y0 = FY + 1.2, y1 = FY + 4.0, z0 = EAVE + 0.6
    wallSlab(stone, [x - 1.6, y0], [x + 1.6, y0], [[0, z0 - 1.0], [3.2, z0 - 1.0], [3.2, z0 + 2.0], [1.6, z0 + 4.2], [0, z0 + 2.0]], 0.4, 0)
    rectOn(win, [x - 1.6, y0 - 0.4], [x + 1.6, y0 - 0.4], 1.6, 0.55, z0 - 0.4, z0 + 1.6, 0.03)
    face(roof, [[x - 1.75, y0, z0 + 1.9], [x, y0, z0 + 4.1], [x, y1, z0 + 4.1], [x - 1.75, y1, z0 + 1.9]], [-1, 0, 0.8])
    face(roof, [[x + 1.75, y0, z0 + 1.9], [x + 1.75, y1, z0 + 1.9], [x, y1, z0 + 4.1], [x, y0, z0 + 4.1]], [1, 0, 0.8])
  }
  // Small oriel turrets standing on the front, with stone spires.
  for (const x of [-42.1, -31.5, -8.9, -4.0, 6.3, 11.6]) {
    const cy = FY - 0.75
    lathe(stone, x, cy, [[0.1, 4.6], [0.75, 6.0], [0.75, EAVE + 2.0], [0, EAVE + 2.0]], 6, Math.PI / 6)
    lathe(stone, x, cy, [[0.88, EAVE + 1.95], [0, EAVE + 7.0]], 6, Math.PI / 6)
  }
  // The tall corner turret at the west end.
  {
    const cx = -49.6, cy = -43.0
    lathe(stone, cx, cy, [[0.2, 3.0], [1.75, 5.5], [1.75, 30.8], [2.0, 31.2], [0, 31.2]], 8, Math.PI / 8)
    const o = ngon(cx, cy, 1.55, 8)
    walls(stone, o, 31.2, 34.6)
    segsOf(ngon(cx, cy, 1.6, 8)).forEach(([a, b]) => archOn(win, a, b, along(a, b).L / 2, 0.36, 31.8, 33.6, 0.03, 4))
    band(stone, o, 34.6, 35.1, 0.2)
    lathe(roof, cx, cy, [[1.65, 35.0], [0.9, 36.5], [0, 40.2]], 8, Math.PI / 8)
    ball(gold, cx, cy, 40.4, 0.2, 6)
  }
  // The east turret, smaller.
  lathe(stone, 48.6, -44.9, [[0.2, 6.0], [1.3, 7.5], [1.3, 25.8], [1.45, 26.1], [0, 26.1]], 8, Math.PI / 8)
  lathe(roof, 48.6, -44.9, [[1.45, 26.0], [0, 31.5]], 8, Math.PI / 8)

  // The great gable of the first phase, between two slender spires.
  {
    const gx = 24.8, hw = 9.3, z0 = EAVE - 1.0
    const outline: XY[] = [[-hw, z0], [hw, z0], [hw, 26.0], [7.0, 28.0], [7.0, 32.0], [4.6, 34.0], [4.6, 37.5], [2.2, 39.5], [2.2, 41.5], [0, 44.0], [-2.2, 41.5], [-2.2, 39.5], [-4.6, 37.5], [-4.6, 34.0], [-7.0, 32.0], [-7.0, 28.0], [-hw, 26.0]].map(([s, z]) => [s + hw, z] as XY)
    const a: XY = [gx - hw, FY - 0.3], b: XY = [gx + hw, FY - 0.3]
    wallSlab(stone, a, b, outline, 1.1, -0.8)
    // tracery windows of the gable
    for (const d of [-4.6, -2.3, 0, 2.3, 4.6]) pointedOn(win, a, b, hw + d, 0.75, 22.6, 25.6, 0.06, 4)
    for (const d of [-2.3, 0, 2.3]) pointedOn(win, a, b, hw + d, 0.6, 28.2, 31.6, 0.06, 4)
    for (const d of [-1.1, 1.1]) pointedOn(win, a, b, hw + d, 0.42, 34.6, 37.4, 0.06, 4)
    // pinnacles on the shoulders and the apex
    for (const [s, z] of [[hw - 0.4, 26.0], [7.0 - 0.4, 32.0], [4.6 - 0.35, 37.5], [2.2 - 0.3, 41.5], [hw - 3.4, 27.0], [5.8, 33.0]] as [number, number][]) for (const sg of [-1, 1]) post(stone, stone, gx + sg * s, FY - 0.5, 0.3, z - 0.5, z + 1.6, Math.PI / 4, 2.8)
    post(stone, stone, gx, FY - 0.5, 0.4, 44.0 - 1.2, 44.8, Math.PI / 4, 3.4)
    // the stone tracery of the front below it
    for (const d of [-6.2, -3.1, 0, 3.1, 6.2]) bbox(stone, stone, gx + d - 0.3, FY - 0.55, gx + d + 0.3, FY, 4.8, EAVE - 0.6, 0.12)
    // the two slender spires
    for (const sx of [gx - hw - 0.4, gx + hw + 0.4]) {
      lathe(stone, sx, FY - 0.2, [[0.2, 6.0], [0.85, 7.4], [0.85, 31.0], [1.0, 31.3], [0, 31.3]], 8, Math.PI / 8)
      lathe(roof, sx, FY - 0.2, [[0.95, 31.2], [0, 46.5]], 8, Math.PI / 8)
    }
  }

  // ------------------------------------------------------------- the tower
  const TX = -19.95, TY = -41.3
  // Lower tower: 12.3 x 11.4 m, to 38 m, its front 1.8 m proud of the
  // facade.
  const base = rect(TX0, -47.0, TX1, -35.6)
  walls(stone, base, 0, 38.0)
  const BF = sidesOf(base).S
  archOn(stone, BF[0], BF[1], 6.15, 2.6, 0, 4.0, 0.03, 8)
  archOn(win, BF[0], BF[1], 6.15, 2.2, 0, 4.0, 0.07, 8)
  for (const z of [7.0, 13.5]) pointedOn(win, BF[0], BF[1], 6.15, 1.5, z, z + 3.6, 0.07, 5)
  for (const [a, b] of [sidesOf(base).E, sidesOf(base).W]) for (const z of [7.0, 13.5, 26.0, 32.0]) pointedOn(win, a, b, 5.7, 1.2, z, z + 3.0, 0.07, 4)
  // corner buttresses of the lower tower
  for (const [x, y] of [[TX0, -47.0], [TX1, -47.0]]) bbox(stone, stone, x - 0.6, y - 0.6, x + 0.6, y + 0.6, 0, 36.5, 0.2)
  // The Glockenspiel: a copper oriel, half an octagon, with its roof.
  {
    const ob: XY[] = [[TX - 3.0, -47.0], [TX - 1.9, -48.5], [TX + 1.9, -48.5], [TX + 3.0, -47.0]]
    for (let i = 0; i < 3; i++) {
      const a = ob[i], b = ob[i + 1]
      walls(copper, [a, b], 21.0, 31.0)
      const { L } = along(a, b)
      for (const z of [22.0, 26.6]) archOn(win, a, b, L / 2, Math.min(1.3, L * 0.32), z, z + 2.6, 0.04, 6)
    }
    face(copper, [[ob[0][0], ob[0][1], 21.0], [ob[3][0], ob[3][1], 21.0], [ob[2][0], ob[2][1], 21.0], [ob[1][0], ob[1][1], 21.0]], [0, 0, -1])
    const apex: V3 = [TX, -47.0, 33.8]
    for (let i = 0; i < 3; i++) face(copper, [[ob[i][0], ob[i][1], 31.0], [ob[i + 1][0], ob[i + 1][1], 31.0], apex], [(ob[i][0] + ob[i + 1][0]) / 2 - TX, (ob[i][1] + ob[i + 1][1]) / 2 + 47, 0.6])
    column(copper, TX, -47.4, 33.5, 35.2, 0.08, 4)
  }
  // Gallery at the roofline: a projecting slab, a parapet, four corner
  // turrets with spires.
  bbox(stone, stone, TX0 - 0.6, -47.6, TX1 + 0.6, -35.0, 37.6, 38.4, 0.15)
  {
    const r = rect(TX0 - 0.45, -47.45, TX1 + 0.45, -35.15)
    walls(stone, r, 38.4, 39.5)
    walls(stone, [...r].reverse().map(([x, y]) => [x, y] as XY), 38.4, 39.5)
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4]
      // a thin top
      face(stone, [[a[0], a[1], 39.5], [b[0], b[1], 39.5], [b[0] + (r[(i + 2) % 4][0] - b[0]) * 0.03, b[1] + (r[(i + 2) % 4][1] - b[1]) * 0.03, 39.5], [a[0] + (r[(i + 3) % 4][0] - a[0]) * 0.03, a[1] + (r[(i + 3) % 4][1] - a[1]) * 0.03, 39.5]], [0, 0, 1])
    }
    for (const [x, y] of r) {
      lathe(stone, x, y, [[0.2, 29.0], [0.85, 30.5], [0.85, 41.2], [0, 41.2]], 8, Math.PI / 8)
      lathe(stone, x, y, [[0.9, 41.1], [0, 45.5]], 8, Math.PI / 8)
    }
  }
  // Upper tower: 8.2 m square, 38-60 m, clocks, paired windows, corner
  // pinnacles.
  const H2 = 4.1
  const up = rect(TX - H2, TY - H2, TX + H2, TY + H2)
  walls(stone, up, 38.0, 60.0)
  for (const [a, b] of segsOf(up)) {
    clock(gold, win, gold, a, b, H2, 50.8, 1.75, 2.2, 0.4)
    for (const d of [-1.3, 1.3]) {
      pointedOn(win, a, b, H2 + d, 0.6, 41.5, 46.2, 0.07, 4)
      pointedOn(win, a, b, H2 + d, 0.6, 54.0, 57.6, 0.07, 4)
      // a pointed gablet (wimperg) over each upper window, 3D
      wallSlab(stone, a, b, [[H2 + d - 0.95, 57.4], [H2 + d + 0.95, 57.4], [H2 + d, 60.4]], 0.25, 0)
    }
    { const { P } = along(a, b); const p = P(H2, 0, 0.15); post(stone, stone, p[0], p[1], 0.22, 57.0, 60.6, Math.PI / 4, 2.6) }
  }
  for (const [x, y] of up) {
    lathe(stone, x, y, [[0.2, 53.5], [0.7, 55.0], [0.7, 62.8], [0, 62.8]], 8, Math.PI / 8)
    lathe(stone, x, y, [[0.75, 62.7], [0, 66.2]], 8, Math.PI / 8)
  }
  bbox(stone, stone, TX - H2 - 0.5, TY - H2 - 0.5, TX + H2 + 0.5, TY + H2 + 0.5, 59.6, 60.6, 0.2)
  // The open octagonal lantern, 60.6-70 m.
  const o = ngon(TX, TY, 3.4, 8)
  for (let i = 0; i < 8; i++) {
    const t = Math.PI / 8 + (i * Math.PI) / 4
    post(stone, stone, TX + 3.25 * Math.cos(t), TY + 3.25 * Math.sin(t), 0.36, 60.6, 70.0, t, 0)
    post(stone, stone, TX + 3.45 * Math.cos(t), TY + 3.45 * Math.sin(t), 0.24, 70.0, 71.0, t, 3.2)
  }
  // open tracery: pointed heads between the posts at both tiers, a thin core
  segsOf(ngon(TX, TY, 3.3, 8)).forEach(([a, b]) => {
    const { L } = along(a, b)
    for (const zs of [67.9]) {
      wallSlab(stone, a, b, [[0.2, zs], [L / 2 - 0.05, zs + 1.6], [L / 2 + 0.05, zs + 1.6], [L - 0.2, zs], [L - 0.2, zs + 1.75], [0.2, zs + 1.75]], 0.22, -0.1)
    }
  })
  lathe(stone, TX, TY, [[0.75, 60.6], [0.75, 69.6], [0, 69.6]], 8, Math.PI / 8)
  band(stone, o, 64.9, 65.4, 0.05)
  band(stone, o, 69.6, 70.2, 0.12)
  // The spire, stone, with a figure on top.
  lathe(stone, TX, TY, [[2.3, 70.1], [1.6, 72.0], [0.85, 77.5], [0.2, 83.0], [0, 83.2]], 8, Math.PI / 8)
  band(stone, ngon(TX, TY, 1.3, 8), 74.4, 74.9, 0.12, true)
  for (let i = 0; i < 8; i++) {
    const t = Math.PI / 8 + (i * Math.PI) / 4
    post(stone, stone, TX + 1.75 * Math.cos(t), TY + 1.75 * Math.sin(t), 0.15, 72.0, 72.6, t, 2.0)
    post(stone, stone, TX + 1.15 * Math.cos(t), TY + 1.15 * Math.sin(t), 0.11, 76.6, 77.0, t, 1.4)
  }
  lathe(copper, TX, TY, [[0.16, 83.0], [0.26, 83.5], [0.2, 84.4], [0.14, 84.6], [0.17, 84.85], [0, 85.0]], 6)

  const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : p[1] < -30 ? 1 : 0.15)
  return [
    { part: stone, material: { ...finish('neues-rathaus-limestone', 0xb5a891), floodlight: flood } },
    { part: roof, material: finish('neues-rathaus-roof', 0x5f6267) },
    { part: brick, material: { ...finish('neues-rathaus-brick', 0x8d6551), floodlight: flood } },
    { part: win, material: { ...PALETTE.window } },
    { part: copper, material: { ...finish('neues-rathaus-copper', 0x6a9e89), floodlight: (p: V3) => (p[1] < -40 ? 0.8 : 0) } },
    { part: gold, material: finish('neues-rathaus-gilt', 0xd8ad45, 0.45) },
  ]
}

if (import.meta.main) await save('munich-neues-rathaus', 'Neues Rathaus', [48.137797, 11.575929], 18, build(), 6500)
