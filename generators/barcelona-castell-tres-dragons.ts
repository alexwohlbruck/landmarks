/**
 * Castell dels Tres Dragons, Parc de la Ciutadella, Barcelona — original
 * procedural geometry, CC0-1.0. bun generators/barcelona-castell-tres-dragons.ts
 *
 * Uses the kit exported by generators/barcelona-arc-de-triomf.ts.
 *
 * Frame: built turned to the building, BEARING 46.4. -y is the south-west
 * front to the Passeig de Picasso, +y the park front (north-east) with the
 * big arched window, -x north-west (the Passeig de
 * Pujades side). z up, metres. Origin = the area centroid of the OSM outline
 * way/33570474.
 *
 * Evidence
 * - ICGC orthophoto (Institut Cartografic i Geologic de Catalunya,
 *   ortofoto_color_vigent WMS, CC BY 4.0): the true plan. A main block
 *   about 21 x 32 m under a red tiled roof with a tower at each corner: the
 *   tall one at the north (its lantern seen from above), square ones at the
 *   east and west, a round one at the south; low glazed galleries along the
 *   long fronts; a low annex west of it. OSM's outline lies about 5 m north-
 *   west of the photo's building and maps the corners as wings; the model
 *   keeps OSM's position (the map's footprint) and the photo's plan.
 * - OSM way/33570474 (Castell dels Tres Dragons, Q1048705, Lluis Domenech i
 *   Montaner, 1888; no height, no parts). In this frame: the front wing
 *   x -31..15, y -21..-14 (its part west of the middle body drawn as a
 *   two-storey annex, 10.5 m, as the photo from the park shows it low), with rounded towers at both ends (centres
 *   (-31, -17.5) and (14.7, -17.6)); the middle body x -7.2..13.6,
 *   y -14..17.4; the back wing x -10..17.6, y 17.2..25.2 with a round tower
 *   at its north-west corner (centre (-10.5, 21.1), r 4.3).
 * - Published (ca.wikipedia "Castell dels Tres Dragons"): built as the cafe-
 *   restaurant of the 1888 Universal Exposition, bare red brick on an iron
 *   frame, crowned with merlons and a band of white glazed ceramic shields
 *   painted in blue with invented brand names; later the Museu de Zoologia.
 * - Mapterhorn terrain (bun tools/terrain.ts grid, bearing 46.4): flat, within
 *   0.5 m, but for a sunken strip near x -30 outside the walls.
 * - Commons daylight photos (EVIDENCE):
 *   "Castell dels Tres Dragons 01.jpg" (Bernard Gagnon, CC BY-SA 3.0; the
 *   back front and the round-topped tower from the north: heights measured
 *   from it, scaled to OSM's 31.5 m front);
 *   "Tres Dragons 2022.jpg" (Canaan, CC BY-SA 4.0; the same front square on,
 *   2022, the arched window and the entrance);
 *   "Barcelona - Castell dels Tres Dragons (3).jpg" (Fred Romero, CC BY 2.0;
 *   the tall tower's belfry and the long front);
 *   "714 Castell dels Tres Dragons, pg. Picasso 5 - parc de la Ciutadella
 *   (Barcelona).jpg" (Enric, CC BY-SA 4.0; the tall square tower and its
 *   octagonal belfry from below, the two fronts meeting at it);
 *   "Castell dels Tres Dragons 02.jpg" (Bernard Gagnon, CC BY-SA 3.0; the
 *   shields and the round openings close up).
 *
 * Measured from the photos: the main block's walls 21.5, merlons to 22.75;
 * the corner towers 23.5 (merlons 24.75); the tall tower's square body to
 * 24.5, its corbelled octagonal belfry to 29.4, merlons 30.6, the iron
 * gallery and lantern to 33, the spire to 37.4. The shields' band 1.6-3.4 m
 * under the merlons; the great arched window 13-20; the row of small arched
 * windows under it; the arched entrance. Estimated: the rest of the windows
 * (grouped in pairs a bay), the galleries (5.2 m) and the annex (6 m) from
 * the orthophoto's shadows. Colours from the daylight photos, pulled to the
 * palette's lightness: red-brown brick, white ceramic, cream merlon caps,
 * dark iron (also the galleries' glass roofs), the hipped roof's red tile
 * from the orthophoto.
 *
 * Doubts: OSM's outline is offset from the orthophoto by about 5 m; the
 * south-west and north-west sides are seen only obliquely in the photos;
 * the tall tower's iron lantern is in the 2012 and 2022 photos but missing
 * from some in between (restoration).
 *
 * Night: the brick is floodlit from the park.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { arcPts, away, beam, cap, face, quadN, triN, lathe, ngon, onWall, prismN, rect, relief, save, turned, type XY } from './barcelona-arc-de-triomf'

const brick = new Part(), ceramic = new Part(), cream = new Part(), roof = new Part(), win = new Part(), iron = new Part()
const glass = iron // the galleries' glazed roofs share the iron's dark grey (six materials)

/** Walls to z with a parapet: the roof sunk 1 m; merlons with cream caps along every edge. */
function castle(r: XY[], z: number, merlons = true, skip: number[] = []) {
  prismN(brick, r, 0, z, null)
  // the parapet's inner face and the roof
  const inner = r.map(([x, y]) => [x, y] as XY)
  const c = r.reduce((s, p) => [s[0] + p[0] / r.length, s[1] + p[1] / r.length], [0, 0])
  const ins = inner.map(([x, y]) => { const dx = x - c[0], dy = y - c[1], l = Math.hypot(dx, dy); return [x - (dx / l) * 0.7, y - (dy / l) * 0.7] as XY })
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], A = ins[i], B = ins[(i + 1) % r.length]
    roofQuad([a[0], a[1], z], [b[0], b[1], z], [B[0], B[1], z], [A[0], A[1], z])
  }
  cap(roof, ins, z - 1.0)
  for (let i = 0; i < r.length; i++) {
    const A = ins[i], B = ins[(i + 1) % r.length]
    const l = Math.hypot(B[0] - A[0], B[1] - A[1]) || 1
    // inner parapet face, looking in
    brickQuad([B[0], B[1], z - 1.0], [A[0], A[1], z - 1.0], [A[0], A[1], z], [B[0], B[1], z], [-(B[1] - A[1]) / l, (B[0] - A[0]) / l, 0])
  }
  if (!merlons) return
  for (let i = 0; i < r.length; i++) {
    if (skip.includes(i)) continue
    const a = r[i], b = r[(i + 1) % r.length]
    const { L, P } = onWall(a, b)
    const n = Math.max(1, Math.round(L / 2.7))
    for (let k = 0; k <= n; k++) {
      const s = (k / n) * L
      const s0 = Math.max(0, s - 0.45), s1 = Math.min(L, s + 0.45)
      const q = [P(s0, 0, 0), P(s1, 0, 0), P(s1, 0, -0.6), P(s0, 0, -0.6)].map((v) => [v[0], v[1]] as XY)
      prismN(brick, q, z, z + 1.25, cream) // brick merlon, its cream cap seen from above
    }
  }
}
const roofQuad = (a: V3, b: V3, c: V3, d: V3) => { brick.tri(a, b, c); brick.tri(a, c, d) }
function brickQuad(a: V3, b: V3, c: V3, d: V3, n: V3) {
  brick.tri(a, b, c, undefined, undefined, undefined, [n, n, n]); brick.tri(a, c, d, undefined, undefined, undefined, [n, n, n])
}
/** The band of white ceramic shields under the merlons, along wall a→b. */
function shields(a: XY, b: XY, z: number, s0 = 0.9, s1?: number) {
  const { L } = onWall(a, b)
  const e = s1 ?? L - 0.9
  const n = Math.max(1, Math.floor((e - s0) / 1.8))
  const step = (e - s0) / n
  for (let k = 0; k < n; k++) {
    const s = s0 + (k + 0.5) * step
    face(ceramic, a, b, [[s - 0.5, z - 1.8], [s + 0.5, z - 1.8], [s + 0.6, z], [s - 0.6, z]], 0.06)
  }
}
/** A flush arched (round-headed) window on wall a→b. */
function archWin(p: Part, a: XY, b: XY, sc: number, w: number, z0: number, z1: number, out = 0.06) {
  const h = w / 2
  face(p, a, b, [[sc - h, z0], [sc + h, z0], ...arcPts(sc, z1 - h, h, 0, Math.PI, 8).slice(0, -1), [sc - h, z1 - h]], out)
}

// --- massing (the plan from the ICGC orthophoto, set on the OSM outline) ---
const MAIN: XY[] = rect(-7.2, -14.2, 13.6, 17.4)
castle(MAIN, 21.5)
{
  // the red tiled hipped roof over the main block, mostly hidden behind the merlons
  const x0 = -6.6, x1 = 13.0, y0 = -13.6, y1 = 16.8, z = 20.5, zr = 24.6, xm = (x0 + x1) / 2, h = (x1 - x0) / 2
  const A: V3 = [x0, y0, z], B: V3 = [x1, y0, z], C: V3 = [x1, y1, z], D: V3 = [x0, y1, z], R0: V3 = [xm, y0 + h, zr], R1: V3 = [xm, y1 - h, zr]
  const c: V3 = [xm, (y0 + y1) / 2, z]
  quadN(roof, B, C, R1, R0, away(B, C, R1, c)); quadN(roof, D, A, R0, R1, away(D, A, R0, c))
  triN(roof, A, B, R0, away(A, B, R0, c)); triN(roof, C, D, R1, away(C, D, R1, c))
}
// the low galleries along the two long fronts' feet and the annex west of
// the main block, with glazed roofs
for (const r of [rect(-7.2, -21, 10.9, -14.2), rect(13.6, -14.2, 16.4, 14.6), rect(-10, -14.2, -7.2, 14.5)]) {
  prismN(brick, r, 0, 5.2, null)
  cap(glass, r, 5.2)
}
castle(rect(-31, -21, -12.3, -14.2), 6.0, false)
// corner towers: square at the east and west corners, round at the south
const EAST = rect(10.8, 14.6, 16.6, 20.4), WEST = rect(-12.3, -23, -4.3, -15)
castle(EAST, 23.5)
castle(WEST, 23.5)
const SOUTH = ngon(14.7, -18.6, 4.0, 12, Math.PI / 12)
castle(SOUTH, 23.5)

// --- the tall tower at the north corner ---
// A square brick body standing above the roofs, corbelled out to an
// octagonal belfry with paired openings and merlons, then the iron gallery,
// lantern and spire (in place in 2012 and 2022).
{
  const [cx, cy] = [-9.0, 18.8]
  const sq = rect(cx - 4.3, cy - 4.3, cx + 4.3, cy + 4.3)
  castle(sq, 24.5, false)
  for (let i = 0; i < 4; i++) shields(sq[i], sq[(i + 1) % 4], 24.2, 0.5, 8.1)
  const oct = ngon(cx, cy, 3.6, 8, Math.PI / 8)
  prismN(brick, ngon(cx, cy, 4.0, 8, Math.PI / 8), 24.0, 25.4, brick)
  prismN(brick, oct, 25.4, 29.4, null)
  turned(roof, cx, cy, [[3.2, 29.0], [0, 29.0]], 8, Math.PI / 8)
  for (let i = 0; i < 8; i++) {
    const a = oct[i], b2 = oct[(i + 1) % 8]
    const { L } = onWall(a, b2)
    archWin(win, a, b2, L / 2 - 0.45, 0.6, 26.2, 28.6)
    archWin(win, a, b2, L / 2 + 0.45, 0.6, 26.2, 28.6)
    const t = Math.atan2(a[1] - cy, a[0] - cx)
    const m = ngon(cx + 3.25 * Math.cos(t), cy + 3.25 * Math.sin(t), 0.5, 4, t + Math.PI / 4)
    prismN(brick, m, 29.4, 30.6, cream)
  }
  turned(brick, cx, cy, [[3.2, 29.4], [3.2, 29.0]], 8, Math.PI / 8)
  turned(brick, cx, cy, [[3.2, 29.4], [3.6, 29.4]], 8, Math.PI / 8)
  turned(iron, cx, cy, [[1.9, 29.0], [2.6, 30.6], [2.6, 31.0], [1.6, 31.0]], 12)
  turned(iron, cx, cy, [[1.6, 31.0], [1.45, 33.0], [1.7, 33.2], [0.9, 34.4], [0.35, 35.0], [0.22, 36.9], [0, 37.4]], 8)
  turned(win, cx, cy, [[1.5, 31.4], [1.38, 32.7], [0, 32.7]], 8) // the lantern's blue glass
  beam(iron, [cx, cy, 36.3], [cx + 1.2, cy, 36.6], 0.12)
}

// --- the ceramic shields under the merlons, all round ---
for (const r of [MAIN, EAST, WEST]) for (let i = 0; i < 4; i++) shields(r[i], r[(i + 1) % 4], (r === MAIN ? 21.5 : 23.5) - 1.6)
for (let i = 0; i < 12; i++) shields(SOUTH[i], SOUTH[(i + 1) % 12], 21.9, 0.3, Math.hypot(SOUTH[(i + 1) % 12][0] - SOUTH[i][0], SOUTH[(i + 1) % 12][1] - SOUTH[i][1]) - 0.3)

// --- windows ---
// the park front (+y, x 13.6 to -7.2): great arched window, small arched row, entrance
{
  const a: XY = [13.6, 17.4], b: XY = [-7.2, 17.4]
  const sc = 10.6 // centre at x = 3.0
  relief(brick, a, b, [[sc - 4.6, 12.6], [sc + 4.6, 12.6], [sc + 4.6, 16.5], ...arcPts(sc, 16.5, 4.6, 0, Math.PI, 10).slice(1, -1), [sc - 4.6, 16.5]], 0, 0.35)
  archWin(win, a, b, sc, 7.0, 13.0, 20.0, 0.42)
  for (let k = 0; k < 7; k++) archWin(win, a, b, sc - 4.2 + k * 1.4, 0.9, 9.4, 12.0)
  archWin(win, a, b, sc, 7.4, 0, 5.4)
}
// the long walls: a pair of tall arched windows a bay over a row of broad ground-floor arches
function sideWindows(a: XY, b: XY, s0: number, s1: number, zTop: number, ground = false) {
  const L = s1 - s0, n = Math.max(1, Math.round(L / 5.5)), step = L / n
  for (let k = 0; k < n; k++) {
    const s = s0 + (k + 0.5) * step
    archWin(win, a, b, s - 0.75, 1.0, zTop - 9.5, zTop - 5.0)
    archWin(win, a, b, s + 0.75, 1.0, zTop - 9.5, zTop - 5.0)
    if (ground) archWin(win, a, b, s, 2.6, 1.0, 5.5)
    else archWin(win, a, b, s, 2.6, 6.2, 9.6)
  }
}
sideWindows([-7.2, -14.2], [13.6, -14.2], 0.5, 17.8, 21.5) // the south-west front, over its gallery
sideWindows([-7.2, 17.4], [-7.2, -14.2], 4, 31.6, 21.5) // the north-west side
sideWindows([13.6, -14.2], [13.6, 17.4], 1, 28.8, 21.5) // the south-east side

const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : 0.9)
await save('barcelona-castell-tres-dragons', 'Castell dels Tres Dragons', [41.388082, 2.183352], 46.4, [
  { part: brick, material: { ...finish('dragons-brick', 0xb0705a), floodlight: lit } as Swatch },
  { part: ceramic, material: { ...finish('dragons-ceramic', 0xe8e6e0), floodlight: lit } as Swatch },
  { part: cream, material: { ...finish('dragons-cream', 0xdcc48e), floodlight: lit } as Swatch },
  { part: roof, material: finish('dragons-roof', 0xc4917a) },
  { part: win, material: PALETTE.window },
  { part: iron, material: finish('dragons-iron', 0x4f5763) },
])
