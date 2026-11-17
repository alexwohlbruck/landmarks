/**
 * Gulf Building (712 Main Street, 1929, Alfred C. Finn with Kenneth
 * Franzheim and J. E. R. Carpenter; now the JPMorgan Chase Building),
 * Houston — original procedural geometry, CC0-1.0.
 * bun generators/hou-gulf-building.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/510321974 ("712 Main",
 * 36 levels, height 130), 29.758864,-95.363857. Its walls run at 34.9° /
 * 124.9° (the downtown grid), so the catalog bearing is 34.9 and the plan
 * is square to the frame: model +x faces south-east (Main Street), +y
 * north-east. The name "Gulf Building" sits on node/368163928 (USGS GNIS)
 * inside the outline; the JPMorgan Chase Building Annex (way/510321962)
 * west of it is a separate building and is left out.
 *
 * Identity, in order: the square tan-brick shaft rising sheer from Main
 * Street, its faces cut into tall vertical strips of windows and dark
 * spandrels between plain piers (Saarinen's Tribune entry, as Finn drew
 * it); the crown, three setbacks each finished with a row of pointed pier
 * tops, so the top reads as a jagged stepped cluster; the pale limestone
 * base of five or six storeys.
 *
 * Evidence:
 *  - plan: OSM outline, squared in the turned frame: x -22.5..19.6, y
 *    -18.5..20.7, minus a notch at the north-west corner (x < -13.7,
 *    y > 4) where a 38 m neighbour stands (lidar confirms the notch).
 *  - lidar (USGS 3DEP TX_Coastal_B1_2018, flown 2018, 0.5 m grid; the
 *    street is 0.3 m above ground_min): the tower is a 34 x 34 m square
 *    standing on the north and east lines of the outline (the lidar sits
 *    ~1.7 m east of OSM; the OSM lines are followed), drawn x -13.7..19.6,
 *    y -12.6..20.7. The base round it is 24.2 m. The shaft's faces stop at
 *    96.3 m, its corners lower, at 80-90 m (drawn 85 m: the corners are
 *    cut back 3.5 m above that; the cut-back region reads 2.5-4.5 m
 *    across at 0.5 m). Stage 2, a 28 m square, to 110 m (tips to
 *    112 m); the crown, a 23 x 22 m square, to 127.5 m with pier tips to
 *    130.8 m. Published 130 m / 428 ft and 37 storeys (Wikipedia), OSM
 *    height=130.
 *  - facade: strips counted on Kent Wang's upward view of the Main Street
 *    face and on ExqBoredinNac's and i_am_jim's photos: about nine window
 *    strips a face, each a pair of windows, with brown spandrels; drawn as
 *    nine 1.8 m strips on a 3.1 m pitch, windows grouped two storeys to a
 *    panel. Stage 2 has seven strips and the crown six, of tall narrow
 *    slit windows (Rothenberger, ExqBoredinNac). Pier tips: a pointed cap
 *    on every pier along each setback, made larger than the real finials
 *    (estimate) so the jagged top reads at phone size.
 *  - base: limestone, tall two-storey windows (Kent Wang), a cornice at
 *    the base's top. Window rhythm estimated.
 *  - colours: the brick samples #c1ae8f and #c8b69b in sun (Kent Wang),
 *    #8d7e6a and #7f715f in shade (ExqBoredinNac); drawn #d1c0a0, a warm
 *    tan at the palette's lightness. Spandrels #a69276 in Kent Wang's,
 *    drawn #b39d7b. The base limestone paler and greyer, #dcd2bf.
 *  - night: windows lit (window). No licensed night photo found; the crown
 *    is left unlit beyond its windows.
 *
 * Ground: Houston is flat (Mapterhorn 0.0-0.4 m over the block);
 * elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - The_Gulf_Building_Houston_Texas.jpg, i_am_jim, 2013, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:The_Gulf_Building_Houston_Texas.jpg
 *  - JP_Morgan_Chase_Building_Houston_Texas.jpg, Kent Wang, 2008, CC BY-SA 2.0
 *    https://commons.wikimedia.org/wiki/File:JP_Morgan_Chase_Building_Houston_Texas.jpg
 *  - Gulf_Building.jpg, ExqBoredinNac, 2009, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Gulf_Building.jpg
 *  - Gulfchasehouston.jpg, Reagan Rothenberger, 2010, CC BY 3.0
 *    https://commons.wikimedia.org/wiki/File:Gulfchasehouston.jpg
 * No look-only sources; no commercial imagery.
 *
 * Doubts: the corner treatment below 85 m (the photos show slim recessed
 * corner lines, drawn as a plain bevel); the base's south and west faces
 * (no photo); window strips are counted, the storey grouping estimated.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, chamfer, panel, parapetRoof, rect, save, spire, walls, type XY } from './chi-aon-center'

const brick = new Part(), lime = new Part(), span = new Part(), win = new Part(), roof = new Part()

const CX = 2.95, CY = 4.05
const BASE = 24.2, CORNER = 85, SHAFT = 96.3, ST2 = 110.5, CROWN = 127.5

/** A square of half-width h about the tower centre, with its corners notched by n. CCW. */
function notched(h: number, n: number): XY[] {
  const q: XY[] = [[-h + n, -h], [h - n, -h], [h - n, -h + n], [h, -h + n], [h, h - n], [h - n, h - n], [h - n, h], [-h + n, h], [-h + n, h - n], [-h, h - n], [-h, -h + n], [-h + n, -h + n]]
  return n > 0 ? q.map(([x, y]) => [CX + x, CY + y] as XY) : rect(CX - h, CY - h, CX + h, CY + h)
}
/** The four main faces of a tier (h half-width, n notch), each counter-clockwise a→b. */
const mainFaces = (h: number, n: number): [XY, XY][] => {
  const f: [XY, XY][] = [[[-h + n, -h], [h - n, -h]], [[h, -h + n], [h, h - n]], [[h - n, h], [-h + n, h]], [[-h, h - n], [-h, -h + n]]]
  return f.map(([a, b]) => [[CX + a[0], CY + a[1]], [CX + b[0], CY + b[1]]] as [XY, XY])
}

/** Window strips on a face: spandrel strip behind, two-storey window panels on it. */
function strips(a: XY, b: XY, n: number, w: number, z0: number, z1: number, groups: number, slit = false) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), pitch = (L - 2.4) / n
  const H = (z1 - z0) / groups
  for (let k = 0; k < n; k++) {
    const c = 1.2 + pitch * (k + 0.5)
    panel(span, a, b, c - w / 2, c + w / 2, z0, z1, 0.03)
    for (let g = 0; g < groups; g++) {
      const g0 = z0 + g * H + (slit ? 1.0 : 0.7), g1 = z0 + (g + 1) * H - (slit ? 1.0 : 0.7)
      panel(win, a, b, c - w / 2 + 0.25, c + w / 2 - 0.25, g0, g1, 0.06)
    }
  }
  return { pitch, L }
}

/** Pointed caps on the piers between strips, standing on the parapet at z. */
function tips(a: XY, b: XY, n: number, z: number, wide: number, tall: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), pitch = (L - 2.4) / n
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], m: XY = [u[1], -u[0]] // m points outwards
  for (let k = 0; k <= n; k++) {
    const s = 1.2 + pitch * k, d = 1.2
    const P = (t: number, o: number): XY => [a[0] + u[0] * t - m[0] * o, a[1] + u[1] * t - m[1] * o]
    const ring: XY[] = [P(s - wide / 2, 0), P(s + wide / 2, 0), P(s + wide / 2, d), P(s - wide / 2, d)].reverse()
    // ring must be CCW seen from above: outward edge first, along the face.
    const r: XY[] = [P(s - wide / 2, 0), P(s + wide / 2, 0), P(s + wide / 2, d), P(s - wide / 2, d)]
    const ccw = (r[1][0] - r[0][0]) * (r[2][1] - r[0][1]) - (r[1][1] - r[0][1]) * (r[2][0] - r[0][0]) > 0 ? r : ring
    walls(brick, ccw, z - 0.6, z + tall * 0.35)
    const c = P(s, d / 2)
    spire(brick, ccw, z + tall * 0.35, [c[0], c[1], z + tall])
  }
}

/** A tier: walls with bevelled top, a parapet and roof. */
function tier(ring: XY[], z0: number, z1: number) {
  walls(brick, ring, z0, z1 - 0.4)
  const top = chamfer(ring, 0)
  walls(brick, ring, z1 - 0.4, z1, top)
  parapetRoof(brick, roof, top, z1, 0.5, 0.8)
}

// Base: limestone over the whole outline, a cornice, a flat roof.
const base: XY[] = [[-22.5, -18.5], [19.6, -18.5], [19.6, 20.7], [-13.7, 20.7], [-13.7, 4.0], [-22.5, 4.0]]
walls(lime, base, 0, BASE - 1.2)
walls(lime, base, BASE - 1.2, BASE)
cap(roof, base, BASE)
for (let i = 0; i < base.length; i++) {
  const a = base[i], b = base[(i + 1) % base.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n = Math.round((L - 3) / 5.2)
  if (n < 1) continue
  const pitch = (L - 3) / n
  for (let k = 0; k < n; k++) {
    const c = 1.5 + pitch * (k + 0.5)
    panel(win, a, b, c - 1.4, c + 1.4, 1.0, 9.0)
    panel(win, a, b, c - 1.0, c + 1.0, 11.0, 15.5)
    panel(win, a, b, c - 1.0, c + 1.0, 17.0, 21.8)
  }
}

// Shaft: full square (bevelled corners) to the corner piers' tops, then
// the corners cut back to the face tops.
const H0 = 16.65, N0 = 3.5
const shaft = chamfer(rect(CX - H0, CY - H0, CX + H0, CY + H0), 0.5)
walls(brick, shaft, BASE, CORNER)
cap(roof, notched(H0, N0), CORNER) // hidden under the upper shaft except at the cut corners
walls(brick, notched(H0, N0), CORNER, SHAFT - 0.4)
walls(brick, notched(H0, N0), SHAFT - 0.4, SHAFT)
parapetRoof(brick, roof, notched(H0, N0), SHAFT, 0.5, 0.8)
// Corner piers: pointed caps where the corners stop.
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  const x0 = CX + sx * (H0 - N0 / 2), y0 = CY + sy * (H0 - N0 / 2), r = N0 / 2 - 0.1
  spire(brick, rect(x0 - r, y0 - r, x0 + r, y0 + r), CORNER, [x0, y0, CORNER + 5.5])
}
for (const [a, b] of mainFaces(H0, N0)) {
  strips(a, b, 9, 1.8, BASE + 1.0, SHAFT - 2.0, 18)
  tips(a, b, 9, SHAFT, 1.8, 5.0)
}

// Stage 2: a 28 m square, notched, with seven strips a face.
const H2 = 14.0, N2 = 2.6
walls(brick, notched(H2, N2), SHAFT - 0.8, ST2 - 0.4)
walls(brick, notched(H2, N2), ST2 - 0.4, ST2)
parapetRoof(brick, roof, notched(H2, N2), ST2, 0.5, 0.8)
for (const [a, b] of mainFaces(H2, N2)) {
  strips(a, b, 7, 1.7, SHAFT + 0.8, ST2 - 1.6, 2, true)
  tips(a, b, 7, ST2, 1.8, 5.0)
}

// Crown: a 23 m square, notched, six strips of tall slits, the tallest tips.
const H3 = 11.5, N3 = 2.0
walls(brick, notched(H3, N3), ST2 - 0.8, CROWN - 0.4)
walls(brick, notched(H3, N3), CROWN - 0.4, CROWN)
parapetRoof(brick, roof, notched(H3, N3), CROWN, 0.5, 0.8)
for (const [a, b] of mainFaces(H3, N3)) {
  strips(a, b, 6, 1.5, ST2 + 0.8, CROWN - 1.6, 2, true)
  tips(a, b, 6, CROWN, 1.9, 3.4)
}

const out = [
  { part: brick, material: finish('gulf-brick', 0xd1c0a0) },
  { part: lime, material: finish('gulf-limestone', 0xdcd2bf) },
  { part: span, material: finish('gulf-spandrel', 0xb39d7b) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
]
if (import.meta.main) await save('hou-gulf-building', 'Gulf Building', [29.758864, -95.363857], 34.9, out)
