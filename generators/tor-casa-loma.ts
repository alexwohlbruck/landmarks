/**
 * Casa Loma, Toronto (1911-1914, E. J. Lennox for Sir Henry Pellatt) —
 * original procedural geometry, CC0-1.0.
 * bun generators/tor-casa-loma.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 342: the house's walls run 18 degrees off the
 * compass (OSM outline edges cluster at 72/162 degrees), and the model is
 * built in that turned frame, its main hall along x. Anchor = centroid of
 * the house outline OSM way/198471666 ("Casa Loma", building=yes):
 * -79.4093982, 43.6781016. Elevation 0. The stables (way/198471704 and the
 * buildings north of Austin Terrace) are separate and left out.
 *
 * Identity (from the photos below):
 *  1. The Norman tower at the south-east: a round stone shaft, a corbelled
 *     parapet, a red tiled conical skirt with a green copper rim, a smaller
 *     round upper stage and a tall red candle-snuffer cone.  (east, south)
 *  2. The round Scottish tower at the west with a corbelled, crenellated
 *     parapet.                                               (south, gable)
 *  3. The square battlemented entrance tower over the north court, with
 *     its porte-cochère.                                   (c2022, c2025)
 *  4. Steep red tile roofs ending in stepped stone gables with tall
 *     chimney stacks; pale limestone battlements, turrets and window
 *     surrounds on grey rock-faced stone.          (gable, c2022, castillo)
 *  5. The conservatory at the east end with its glass dome.
 *
 * Plan: OSM way/198471666 and its building:part ways (1011072455-553,
 * 663868463, relation/13537035), turned into the frame; each block below
 * sits on its part's rectangle (rounded to 0.1 m).
 * Heights: OSM part heights (above the north court), plus BASE = 1.2 m: the
 * lowest ground under the footprint (the west edge, Mapterhorn) lies about
 * 1.2 m below the court's level (10.3-10.7 m on the terrain grid against
 * 9.1-9.3 at the west wall). City of Toronto 3D Massing 2025 (lidar):
 * Norman tower top 39.4 m (OSM 37; the lidar is used), Scottish tower
 * parapet about 28.9 m average (OSM merlons 27; drawn 27.5 + BASE),
 * conservatory 6.8 m average.
 *  - main hall: eaves 11, ridge 18 (OSM 1011072543/545);
 *  - east wing: eaves 16, ridge 24 (1011072546/547); cross block 16 / 21;
 *  - north-east wing 11 / 18; west wing 12 / 18.5; north-west block 14.5
 *    with a battlemented parapet;
 *  - square tower 22 with merlons to 24 (1011072527/528);
 *  - Scottish tower: shaft r 4.3 to 23, corbelled parapet r 5.05 to 25.5,
 *    merlons to 27.5 (1011072525, 663868463, 1011072517-524);
 *  - Norman tower: shaft r 4.75 to 24, corbel ring r 5.8 to 25.5, skirt
 *    cone to the upper stage r 3.45 (1011072549/552/553), upper stage to
 *    31.5, cone to 39.4 (lidar);
 *  - conservatory: walls 7 (OSM 1011072542), glass dome r 5 to 13
 *    (estimated: the massing polygon's 21 m maximum looks like the Norman
 *    tower's edge, so the dome height is a guess from the house's scale).
 * Estimated: stepped gables (5 steps), chimney positions and heights,
 * windows (two rows per storey band), merlon size.
 *
 * Ground: the house stands on the flat top of the Davenport escarpment; the
 * slope falls 4-6 m just south of the south terrace, outside the
 * footprint. Inside it the terrain is flat within 1.5 m, so everything runs
 * down to y = 0 and the north court side sinks about 1.2 m.
 *
 * Colour: the photos show grey rock-faced stone (not buff) with pale
 * limestone trim, red tile roofs (OSM roof:colour #b22222) and a green
 * copper rim on the Norman tower's skirt.
 *
 * Night: floodlit stone (`_FLOODLIGHT`, strongest on the towers); windows
 * glow; the conservatory dome is `glass`.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  c2022    "Casa Loma 2022.jpg", Evelyncyuzu, CC BY-SA 4.0 (north front)
 *           https://commons.wikimedia.org/wiki/File:Casa_Loma_2022.jpg
 *  c2025    "Casa Loma in Toronto 08 2025.jpg", Dpalma01, CC BY-SA 4.0
 *           (north court) https://commons.wikimedia.org/wiki/File:Casa_Loma_in_Toronto_08_2025.jpg
 *  castillo "Casa Loma, el castillo de Toronto.JPG", Maria Carmen,
 *           CC BY-SA 3.0 https://commons.wikimedia.org/wiki/File:Casa_Loma,_el_castillo_de_Toronto.JPG
 *  south    "View of Casa Loma, Toronto from the South - panoramio.jpg",
 *           A J Butler, CC BY 3.0 https://commons.wikimedia.org/wiki/File:View_of_Casa_Loma,_Toronto_from_the_South_-_panoramio.jpg
 *  east     "Casa Loma's east tower (49932155893).jpg", Vlad Litvinov, CC0
 *           https://commons.wikimedia.org/wiki/File:Casa_Loma%27s_east_tower_(49932155893).jpg
 *  gable    "Casa Loma Towers (9159945801).jpg", Richie Diesterheft, CC BY 2.0
 *           https://commons.wikimedia.org/wiki/File:Casa_Loma_Towers_(9159945801).jpg
 * Massing: City of Toronto, 3D Massing 2025,
 * https://open.toronto.ca/dataset/3d-massing/ (Open Government Licence –
 * Toronto). No look-only sources. No commercial imagery.
 *
 * Doubts: the east and west ends are seen only in part; the conservatory
 * dome's outside is not photographed (only its stained-glass ceiling); the
 * roof layout between the wings is simplified to gables and hips.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { gableRoof, hipRoof, onWall, pyramid, rectShape, revolve } from './atl-tech-tower'
import { box, ccw, circle, prism, save, smoothWall, type XY } from './atl-flatiron-building'

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), glass = new Part(), copper = new Part()
const B = 1.2 // the north court over the lowest ground
type Rect = [number, number, number, number]
const ring = ([x0, x1, y0, y1]: Rect): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** Window panels in rows along each face of a rectangle (`sides` picks faces: S E N W). */
function windows(r: Rect, rows: [number, number][], sides = 'SENW', bay = 3.3, w = 1.9) {
  const [x0, x1, y0, y1] = r
  const f: Record<string, [XY, XY]> = { S: [[x0, y0], [x1, y0]], E: [[x1, y0], [x1, y1]], N: [[x1, y1], [x0, y1]], W: [[x0, y1], [x0, y0]] }
  for (const s of sides) {
    const [a, b] = f[s], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.floor((L - 2) / bay)
    if (n < 1) continue
    const step = (L - 2) / n
    for (let k = 0; k < n; k++) for (const [z0, z1] of rows) onWall(win, a, b, rectShape(1 + step * (k + 0.5) - w / 2, 1 + step * (k + 0.5) + w / 2, z0 + B, z1 + B), 0.06)
  }
}

/** Merlons round a rectangle's parapet. */
function merlonsRect([x0, x1, y0, y1]: Rect, z: number, h = 1.2, w = 0.9, step = 2.2) {
  const edges: [XY, XY][] = [[[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]]]
  for (const [a, b] of edges) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / step))
    for (let k = 0; k <= n; k++) {
      const t = k / n, cx = a[0] + (b[0] - a[0]) * t, cy = a[1] + (b[1] - a[1]) * t
      box(trim, cx - w / 2, cx + w / 2, cy - w / 2, cy + w / 2, z, z + h, trim, 0)
    }
  }
}

/** Merlons round a circle. */
function merlonsRound(c: XY, r: number, z: number, n: number, h = 1.3, w = 1.0) {
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2, t: XY = [-Math.sin(a), Math.cos(a)], u: XY = [Math.cos(a), Math.sin(a)]
    const P = (s: number, d: number): XY => [c[0] + u[0] * (r + d) + t[0] * s, c[1] + u[1] * (r + d) + t[1] * s]
    prism(trim, ccw([P(-w / 2, -0.7), P(w / 2, -0.7), P(w / 2, 0), P(-w / 2, 0)]), z, z + h, trim, 0)
  }
}

/** A flat-topped block with a trim parapet. */
function flatBlock(r: Rect, h: number, rows: [number, number][] = [], sides = 'SENW', battle = false) {
  prism(stone, ring(r), 0, h + B, stone, 0)
  const [x0, x1, y0, y1] = r
  prism(trim, ring([x0 - 0.15, x1 + 0.15, y0 - 0.15, y1 + 0.15]), h + B - 0.5, h + B + 0.4, null, 0.1)
  if (battle) merlonsRect([x0 + 0.3, x1 - 0.3, y0 + 0.3, y1 - 0.3], h + B + 0.4)
  windows(r, rows, sides)
}

/**
 * A stepped stone gable on the end of a gable roof: stacked trim-coped
 * steps on the end wall (axis = the ridge's direction; `end` = which end).
 */
function steppedGable(r: Rect, axis: 'x' | 'y', end: 0 | 1, z0: number, z1: number, n = 5) {
  const [x0, x1, y0, y1] = r
  const W = axis === 'y' ? x1 - x0 : y1 - y0, c = axis === 'y' ? (x0 + x1) / 2 : (y0 + y1) / 2
  const pos = axis === 'y' ? (end ? y1 : y0) : end ? x1 : x0, d = end ? -0.8 : 0.8
  for (let k = 0; k < n; k++) {
    const half = (W / 2) * (1 - k / n) + 0.15, za = z0 + ((z1 - z0) * k) / n, zb = z0 + ((z1 - z0) * (k + 1)) / n + 0.5
    if (axis === 'y') box(k === n - 1 ? trim : stone, c - half, c + half, Math.min(pos, pos + d), Math.max(pos, pos + d), za, zb, trim, 0.1)
    else box(k === n - 1 ? trim : stone, Math.min(pos, pos + d), Math.max(pos, pos + d), c - half, c + half, za, zb, trim, 0.1)
  }
}

/** A pitched block: walls to the eave, a gable roof along `axis`, stepped gables on the chosen ends. */
function gabledBlock(r: Rect, eave: number, ridge: number, axis: 'x' | 'y', ends: (0 | 1)[], rows: [number, number][], sides: string) {
  const [x0, x1, y0, y1] = r
  prism(stone, ring(r), 0, eave + B, null, 0)
  gableRoof(roof, stone, x0, x1, y0, y1, eave + B, ridge + B, axis, 0.4, 0.1)
  for (const e of ends) steppedGable(r, axis, e, eave + B, ridge + B)
  windows(r, rows, sides)
}

// ── The main hall and the wings ──
const ROWS2: [number, number][] = [[1.2, 4.6], [6.0, 9.2]]
const ROWS3: [number, number][] = [[1.2, 4.6], [6.0, 9.2], [10.8, 13.6]]
gabledBlock([-16.6, 5.6, -12.4, 7.0], 11, 18, 'x', [], ROWS2, 'SN')
gabledBlock([5.6, 21.4, -15.7, 2.5], 16, 24, 'y', [0], ROWS3, 'SE')
gabledBlock([5.8, 20.5, 8.3, 24.9], 11, 18, 'y', [1], ROWS2, 'ENW')
gabledBlock([5.8, 21.3, 2.5, 8.3], 16, 21, 'x', [1], ROWS3, 'E')
gabledBlock([-29.2, -16.6, -21.2, 7.8], 12, 18.5, 'y', [0], ROWS2, 'SW')
flatBlock([-21.2, -4.6, 2.0, 11.2], 14.5, ROWS3, 'N', true)
// the south bays and the north porch block
flatBlock([-14.0, -8.3, -15.9, -12.4], 11, ROWS2, 'SEW')
flatBlock([-2.6, 2.9, -15.7, -12.2], 11, ROWS2, 'SEW')
flatBlock([20.5, 23.2, 15.6, 24.2], 11, ROWS2, 'E')
flatBlock([5.9, 11.2, 24.8, 27.8], 4.5, [], 'N')
// the west loggias and the low north-west wing
flatBlock([-32.6, -20.4, 7.6, 18.3], 7, [[1.2, 4.8]], 'NW', true)
flatBlock([-34.9, -29.1, -4.4, 7.1], 6, [[1.2, 4.4]], 'W', true)
flatBlock([-31.4, -28.8, -0.2, 7.9], 14, [[6.0, 9.2], [10.8, 12.6]], 'W')
// the south-east terrace loggia
flatBlock([5.5, 20.9, -21.4, -15.6], 6, [[1.0, 4.5]], 'S', true)

// ── The square entrance tower and its porte-cochère ──
{
  const r: Rect = [-10.0, -2.9, 8.0, 14.6]
  prism(stone, ring(r), 0, 22 + B, stone, 0)
  prism(trim, ring([r[0] - 0.5, r[1] + 0.5, r[2] - 0.5, r[3] + 0.5]), 21 + B, 22.2 + B, null, 0.15, true)
  merlonsRect([r[0] - 0.2, r[1] + 0.2, r[2] - 0.2, r[3] + 0.2], 22.2 + B, 1.6, 1.0, 2.3)
  windows(r, [[11, 13.6], [15.2, 18.4]], 'N', 3.5, 1.4)
  flatBlock([-10.0, -3.2, 14.6, 20.7], 6.5, [], 'N', true)
  onWall(win, [-3.2, 20.7], [-10.0, 20.7], [[1.4, B], [5.4, B], [5.4, 3.4 + B], [3.4, 5.2 + B], [1.4, 3.4 + B]], 0.06)
}

// ── The Scottish tower ──
{
  const c: XY = [-29.4, -7.8]
  smoothWall(stone, circle(c, 4.3, 16), 0, 23 + B)
  revolve(stone, c, [[4.3, 22.0 + B], [5.05, 23.2 + B], [5.05, 25.5 + B]], 16)
  merlonsRound(c, 5.05, 25.5 + B, 12, 2.0)
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2 + 0.4, u: XY = [Math.cos(a), Math.sin(a)]
    const a0: XY = [c[0] + u[0] * 4.35 - u[1] * 0.8, c[1] + u[1] * 4.35 + u[0] * 0.8], b0: XY = [c[0] + u[0] * 4.35 + u[1] * 0.8, c[1] + u[1] * 4.35 - u[0] * 0.8]
    for (const [z0, z1] of [[7, 10], [13, 16], [18.5, 21]]) onWall(win, a0, b0, rectShape(0.2, 1.4, z0 + B, z1 + B), 0.06)
  }
}

// ── The Norman tower ──
{
  const c: XY = [20.75, -15.65]
  smoothWall(stone, circle(c, 4.75, 18), 0, 24 + B)
  revolve(trim, c, [[4.75, 22.6 + B], [5.8, 24.0 + B], [5.8, 25.5 + B]], 18)
  revolve(copper, c, [[6.1, 25.5 + B], [6.1, 25.9 + B]], 18, 0, false, false)
  revolve(roof, c, [[6.1, 25.9 + B], [3.45, 28.6 + B]], 18, 0, false, false) // the red skirt
  smoothWall(stone, circle(c, 3.45, 16), 25.5 + B, 31.5 + B)
  revolve(trim, c, [[3.45, 31.0 + B], [3.8, 31.6 + B]], 16)
  revolve(roof, c, [[3.8, 31.6 + B], [3.0, 33.4 + B], [1.6, 36.6 + B], [0, 39.4 + B]], 16, 0, false, false)
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2, u: XY = [Math.cos(a), Math.sin(a)]
    const p = (r: number, s: number): XY => [c[0] + u[0] * r - u[1] * s, c[1] + u[1] * r + u[0] * s]
    onWall(win, p(4.8, -0.6), p(4.8, 0.6), rectShape(0, 1.2, 15 + B, 18 + B), 0.06)
    onWall(win, p(4.8, -0.6), p(4.8, 0.6), rectShape(0, 1.2, 19.5 + B, 21.8 + B), 0.06)
    onWall(win, p(3.5, -0.5), p(3.5, 0.5), rectShape(0, 1.0, 28.9 + B, 30.4 + B), 0.06)
  }
}

// ── Turrets with pyramid caps ──
for (const [r, top, cap] of [
  [[4.5, 9.6, -17.3, -12.0], 17, 24.5],
  [[18.8, 22.6, 4.6, 8.4], 18, 21],
  [[-29.8, -27.5, -21.7, -19.4], 18, 21],
  [[-31.0, -28.8, 5.4, 7.5], 16, 19],
  [[-31.1, -29.0, 0.2, 2.4], 16, 19],
] as [Rect, number, number][]) {
  prism(stone, ring(r), 0, top + B, null, 0)
  prism(trim, ring([r[0] - 0.2, r[1] + 0.2, r[2] - 0.2, r[3] + 0.2]), top + B - 0.6, top + B, null, 0.1, true)
  pyramid(roof, [(r[0] + r[1]) / 2, (r[2] + r[3]) / 2], (r[1] - r[0]) / 2 + 0.2, top + B, cap + B)
}
flatBlock([-19.8, -16.1, -22.0, -18.4], 22, [[8, 11], [13, 16], [17.5, 20]], 'S', true)

// ── Chimney stacks ──
for (const [x, y, h] of [[-6, 4.4, 22.5], [0, -9, 21], [13.1, -7, 27], [13.2, 20, 21.5], [-24.9, -14, 21.5], [-24.9, 3, 21.5], [17.5, 5.4, 24]] as [number, number, number][]) {
  box(stone, x - 0.9, x + 0.9, y - 1.3, y + 1.3, 12, h + B, null, 0)
  box(trim, x - 1.1, x + 1.1, y - 1.5, y + 1.5, h + B, h + B + 0.6, trim, 0.1)
}

// ── The conservatory ──
{
  const P: XY[] = ccw([[21.3, -9.6], [35.8, -9.5], [35.8, -5.8], [37.3, -5.4], [38.7, -4.4], [39.5, -2.7], [39.7, -1.5], [39.4, -0.3], [38.7, 0.7], [37.2, 1.8], [35.3, 2.1], [35.4, 5.7], [22.3, 5.4], [21.3, 4.6]])
  prism(stone, P, 0, 7 + B, stone, 0)
  windows([22, 35.8, -9.5, 5.6], [[1.4, 5.8]], 'SN', 3.2, 2.2)
  merlonsRect([21.6, 35.5, -9.2, 5.3], 7 + B, 0.8, 0.7, 2.6)
  revolve(copper, [29, -1.9], [[5.6, 7 + B], [5.6, 7.9 + B]], 16)
  revolve(glass, [29, -1.9], [[5.3, 7.9 + B], [5.0, 9.6 + B], [4.0, 11.4 + B], [2.4, 12.6 + B], [0, 13.0 + B]], 16, 0, false, false)
}

// Night: floodlit stone, strongest on the towers.
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : p[2] > 20 ? 0.8 : 0.5)
await save('tor-casa-loma', 'Casa Loma', [
  { part: stone, material: { ...finish('cl-stone', 0xbdb7ac), floodlight: lit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
  { part: roof, material: PALETTE.terracotta },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
  { part: copper, material: PALETTE.copper },
], { height: 39.4 + B, anchor: [43.6781016, -79.4093982], bearing: 342 }, 6500)
