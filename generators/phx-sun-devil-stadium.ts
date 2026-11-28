/**
 * Mountain America Stadium (historically Sun Devil Stadium; Frank Kush
 * Field), Arizona State University, Tempe AZ. Opened 1958, upper decks 1976
 * and 1988, rebuilt in phases 2014-2019 (new west side tower and suites, the
 * north end Student-Athlete Facility with its video board, the south end
 * building). Procedural, CC0-1.0, no textures.
 *   bun generators/phx-sun-devil-stadium.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 14: model north
 * (+y) runs up the field's long axis (the sidelines in OSM run 13.9-14.3
 * degrees). Anchor -111.932605, 33.426445: the centroid of the OSM building
 * outline (relation/15635252, outer way/1156823760).
 *
 * The bowl sits in the saddle between Tempe Butte (A Mountain, west) and
 * the butte to the east: the lower bowl is cut into the ground all round,
 * the west side carries a tall upper deck and the 2017-19 suite and press
 * tower, the east side an upper deck that backs onto the hill, the north
 * end is the low Student-Athlete Facility (SAF) with the video board on its
 * roof, and the south end the stadium's south building. The field is the
 * map's (not modelled).
 *
 * What is drawn (replaces):
 *  - relation/15635252 "Mountain America Stadium" (building=stadium): bowl,
 *    both upper decks, the west tower, the east end stair towers;
 *  - way/675557448 "SAF Building": the north end building, whose roof is the
 *    north concourse and carries the video board;
 *  - way/1156816190 (building=yes, unnamed): the south end building, joined
 *    to the bowl above ground at concourse level.
 *  leisure=stadium relation/7312612 is not a building and is not listed.
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020, after the
 * renovation), 1 m grid, read in this frame with tools/lidar_frame.py. y = 0
 * here is 356.8 m, the street north of the SAF (the lowest ground under the
 * footprint); the field is at 2.95 (359.74 m), so the field is about 3 m
 * above the north street and level with the south street: elevation 0 (the
 * hollow is in the terrain; evidence.md, Elevation). Measured (model z):
 *   field 2.95; field wall top ~4.9; concourse 15.0 all round;
 *   lower bowl top: west 13.6 (x -59.5), east 13.4 (x 68), north 11.9
 *     (y 88), south 12.3 (y -90); drawn west 13.9 and north 12.2, and the
 *     corners up to 1.1 m over a straight blend, so no seat row sits under
 *     the map's terrain (terrain.ts check; within the lidar's spread);
 *   west upper deck: front 23.0 at x -60, back 38.6 at x -89; west tower
 *     x -88.5..-104, roof 54.1, a raised block 58 mid-back; two light rigs on
 *     the roof to ~63;
 *   east upper deck: front 24.6 at x 69, back 44.3 at x 101, y -57..52;
 *     its end stair towers 39.4;
 *   north video board 52 m wide, top 41.2, on a base 22.1 high on the SAF
 *     roof (15.0); SAF rooftop blocks 19.4;
 *   south building: main block roof 31.1, sign boxes on its front to 37.5,
 *     lower south block roof 19.3; corner video boards top 36.7;
 *   corner light poles 42-52.
 *
 * Photos (EVIDENCE, Wikimedia Commons, all Beyond My Ken, CC BY-SA 4.0):
 *   pano  "2021 Sun Devil Stadium (pano).jpg", from the east stands looking
 *         west: west deck and tower, south building, north board.
 *         https://commons.wikimedia.org/wiki/File:2021_Sun_Devil_Stadium_(pano).jpg
 *   int1  "2021 Sun Devil Stadium 1.jpg", from the east upper deck looking
 *         north-west: west tower, north board, SAF behind.
 *         https://commons.wikimedia.org/wiki/File:2021_Sun_Devil_Stadium_1.jpg
 *   int3  "2021 Sun Devil Stadium 3.jpg", looking at the south end building
 *         and its corner boards.
 *         https://commons.wikimedia.org/wiki/File:2021_Sun_Devil_Stadium_3.jpg
 *   ext1  "2021 Sun Devil Stadium exterior 1.jpg", from the south-west: the
 *         west tower's stacked south-end terraces, the south building.
 *         https://commons.wikimedia.org/wiki/File:2021_Sun_Devil_Stadium_exterior_1.jpg
 *   ext2  "2021 Sun Devil Statium exterior 2.jpg", the south building from
 *         the south-west: cream upper block, two glazed bands on a colonnade.
 *         https://commons.wikimedia.org/wiki/File:2021_Sun_Devil_Statium_exterior_2.jpg
 *   USGS NAIP orthophoto (public domain): plan, seat colours.
 * No look-only sources. No commercial imagery.
 *
 * Estimated: the field edge as a rounded rectangle (x -34..40, y -67..66,
 * corner radius 10) from the OSM inner ring; the lower bowl as one straight
 * rake per side; window band heights and bays (photos, scaled to the lidar
 * roofs); the SW terraces (ext1: four white shelves, spacing estimated);
 * the board frames. The concourse between the bowl and the south building
 * (y -89..-96) is drawn as part of the south building's podium; lidar shows
 * a deck there at concourse level that OSM leaves out.
 * Doubts: the brief mentions a shade canopy on the west rim; neither the
 * 2020 lidar nor the 2021 photos show a roof over the west upper seats, so
 * only the tower roof is drawn. The east deck's outer wall and the SAF's
 * sides have no photo; drawn plain with window bands where the SAF has
 * floors. The seats are drawn grey throughout (the real bowl has gold and
 * maroon accents in places).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save } from './atl-flatiron-building'
import { add, box as obox, cylinder, mul, prism, quad, rayHit, triangulate, unit, type XY } from './dc-nationals-park'

const concrete = new Part(), seats = new Part(), white = new Part(), win = new Part(), screen = new Part(), roof = new Part()

const F = 2.95 // field level
const CONC = 15.0 // concourse

// The OSM outer ring (way/1156823760) in this frame.
const RING: XY[] = [[-95.4, 58.1], [-99.8, 58.0], [-103.8, 58.1], [-103.7, 47.8], [-104.6, 20.4], [-107.8, 20.3], [-107.9, -23.4], [-104.3, -23.3], [-104.1, -60.6], [-96.3, -60.9], [-96.0, -58.8], [-89.6, -58.8], [-89.5, -56.0], [-68.2, -56.1], [-66.8, -70.8], [-60.3, -83.3], [-47.7, -94.9], [-42.7, -97.5], [-43.1, -99.2], [-41.0, -100.0], [-41.5, -101.7], [-32.6, -104.4], [-31.7, -102.8], [-29.8, -103.4], [-28.9, -100.6], [-31.0, -99.9], [-30.6, -94.2], [-23.3, -88.8], [28.3, -89.7], [35.8, -94.9], [36.1, -99.9], [34.0, -100.7], [35.0, -104.2], [37.1, -103.4], [37.5, -104.9], [46.6, -101.8], [46.0, -100.2], [48.7, -99.3], [48.0, -97.8], [60.6, -89.1], [72.5, -71.8], [73.5, -56.5], [89.4, -56.8], [89.6, -63.9], [107.1, -63.7], [107.0, -57.7], [100.6, -57.9], [101.2, -36.5], [103.2, -36.3], [103.3, -16.4], [102.0, -12.6], [101.2, 53.4], [107.7, 53.4], [107.6, 59.6], [90.0, 59.7], [89.8, 52.4], [80.6, 52.5], [74.2, 52.4], [72.9, 66.5], [66.8, 77.7], [54.0, 92.6], [39.5, 97.4], [-32.2, 97.0], [-47.9, 92.5], [-59.1, 80.5], [-66.0, 66.9], [-67.0, 53.2], [-74.0, 53.2], [-88.9, 53.2], [-88.8, 55.9], [-95.3, 55.5]]

// ---------------------------------------------------------------------------
// The bowl: a loft round the field edge. Each column is a point on the field
// edge with its outward normal; its profile is (offset outward, height):
// field wall top, top of the lower seats, concourse lip. Past the lip the
// concourse runs out to the OSM ring and drops to the ground, except where
// the side decks or the end buildings stand behind it.
type Prof = [number, number][]
const WEST: Prof = [[0, F + 2], [25.5, 13.9], [26.1, CONC]]
const EAST: Prof = [[0, F + 2], [28, 13.4], [28.6, CONC]]
const NORTH: Prof = [[0, F + 2], [22, 12.2], [22.6, CONC]]
const SOUTH: Prof = [[0, F + 2], [23, 12.3], [23.6, CONC]]
const X0 = -34, X1 = 40, Y0 = -67, Y1 = 66, R = 10
const clamp = (v: number) => Math.max(0, Math.min(1, v))
const smooth = (t: number) => t * t * (3 - 2 * t)
const mix = (a: Prof, b: Prof, t: number): Prof => a.map(([d, h], i) => [d + (b[i][0] - d) * t, h + (b[i][1] - h) * t])

// side: which deck stands behind a column ('w', 'e') or none
type Col = { base: XY; n: XY; prof: Prof; side: '' | 'w' | 'e' }
const cols: Col[] = []
const straight = (a: XY, b: XY, n: XY, prof: Prof, side: Col['side'], step = 9) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(L / step))
  for (let i = 0; i <= k; i++) cols.push({ base: [a[0] + ((b[0] - a[0]) * i) / k, a[1] + ((b[1] - a[1]) * i) / k], n, prof, side })
}
const corner = (c: XY, a0: number, pa: Prof, pb: Prof) => {
  const K = 9
  for (let k = 0; k <= K; k++) {
    const phi = k / K, a = ((a0 + 90 * phi) * Math.PI) / 180
    const n: XY = [Math.cos(a), Math.sin(a)]
    const prof = mix(pa, pb, smooth(clamp((phi - 0.15) / 0.7)))
    // the corner seats run a little higher than a straight blend (lidar: up to 1 m)
    prof[1] = [prof[1][0], prof[1][1] + 1.1 * Math.sin(Math.PI * phi)]
    cols.push({ base: [c[0] + n[0] * R, c[1] + n[1] * R], n, prof, side: '' })
  }
}
// counter-clockwise from above, from the south end of the east side
straight([X1, Y0 + R], [X1, Y1 - R], [1, 0], EAST, 'e')
corner([X1 - R, Y1 - R], 0, EAST, NORTH)
straight([X1 - R, Y1], [X0 + R, Y1], [0, 1], NORTH, '')
corner([X0 + R, Y1 - R], 90, NORTH, WEST)
straight([X0, Y1 - R], [X0, Y0 + R], [-1, 0], WEST, 'w')
corner([X0 + R, Y0 + R], 180, WEST, SOUTH)
straight([X0 + R, Y0], [X1 - R, Y0], [0, -1], SOUTH, '')
corner([X1 - R, Y0 + R], 270, SOUTH, EAST)

const P = (c: Col, d: number, z: number): V3 => [c.base[0] + c.n[0] * d, c.base[1] + c.n[1] * d, z]
// how far the concourse runs out past the lip: to the ring, or (behind a
// deck) a little under the deck; ends at the SAF and south podium stop at
// the ring with no wall, the buildings beyond carry on.
const reach = (c: Col) => {
  if (c.side === 'w') return 27
  if (c.side === 'e') return 29.5
  return Math.max(c.prof[2][0] + 0.5, rayHit(RING, c.base, c.n))
}
for (let j = 0; j < cols.length - 1 + 1; j++) {
  const A = cols[j], B = cols[(j + 1) % cols.length]
  if (Math.hypot(A.base[0] - B.base[0], A.base[1] - B.base[1]) < 1e-6 && A.n[0] === B.n[0] && A.n[1] === B.n[1]) continue
  const n: V3 = unit([A.n[0] + B.n[0], A.n[1] + B.n[1], 0])
  // field wall, facing the field, run below the field so it never floats
  quad(concrete, [P(A, 0, F - 1), P(B, 0, F - 1), P(B, 0, B.prof[0][1]), P(A, 0, A.prof[0][1])], mul(n, -1))
  // field wall cap, lower seats, concourse lip
  const parts = [seats, concrete]
  for (let i = 0; i < 2; i++) {
    const dd = (A.prof[i + 1][0] - A.prof[i][0] + B.prof[i + 1][0] - B.prof[i][0]) / 2
    const dz = (A.prof[i + 1][1] - A.prof[i][1] + B.prof[i + 1][1] - B.prof[i][1]) / 2
    quad(parts[i], [P(A, A.prof[i][0], A.prof[i][1]), P(B, B.prof[i][0], B.prof[i][1]), P(B, B.prof[i + 1][0], B.prof[i + 1][1]), P(A, A.prof[i + 1][0], A.prof[i + 1][1])], [-dz * n[0], -dz * n[1], dd])
  }
  // the concourse out to its edge
  const ra = reach(A), rb = reach(B)
  quad(concrete, [P(A, A.prof[2][0], CONC), P(B, B.prof[2][0], CONC), P(B, rb, CONC), P(A, ra, CONC)], [0, 0, 1])
  // outer wall down to the ground, unless a deck or an end building is behind
  const ea = P(A, ra, 0), eb = P(B, rb, 0)
  const behind = (p: V3) => p[1] > 94 || (p[1] < -88 && p[0] > -24 && p[0] < 28.5)
  if (!A.side && !B.side && !(behind(ea) && behind(eb))) quad(concrete, [ea, eb, P(B, rb, CONC), P(A, ra, CONC)], n)
}

// ---------------------------------------------------------------------------
// A profile in the (x, z) plane extruded along y from y0 to y1, closed at
// both ends. Edge i (point i to i+1) is drawn in parts[i].
function extrudeX(prof: XY[], parts: Part[], y0: number, y1: number, cap: Part) {
  const area = prof.reduce((s, a, i) => { const b = prof[(i + 1) % prof.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
  const sgn = area > 0 ? 1 : -1
  for (let i = 0; i < prof.length; i++) {
    const a = prof[i], b = prof[(i + 1) % prof.length]
    const out: V3 = [sgn * (b[1] - a[1]), 0, -sgn * (b[0] - a[0])]
    quad(parts[i], [[a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]]], out)
  }
  for (const [i, j, k] of triangulate(prof)) {
    const A = prof[i], B = prof[j], C = prof[k]
    quad(cap, [[A[0], y0, A[1]], [B[0], y0, B[1]], [C[0], y0, C[1]], [C[0], y0, C[1]]], [0, -1, 0])
    quad(cap, [[A[0], y1, A[1]], [B[0], y1, B[1]], [C[0], y1, C[1]], [C[0], y1, C[1]]], [0, 1, 0])
  }
}
// A flat panel on a vertical face: plane x = x0 facing `dir` (+-1), or
// y = y0 facing `dir`, between (s0, z0) and (s1, z1).
const panelX = (p: Part, x: number, dir: number, s0: number, s1: number, z0: number, z1: number) =>
  quad(p, [[x + dir * 0.06, s0, z0], [x + dir * 0.06, s1, z0], [x + dir * 0.06, s1, z1], [x + dir * 0.06, s0, z1]], [dir, 0, 0])
const panelY = (p: Part, y: number, dir: number, s0: number, s1: number, z0: number, z1: number) =>
  quad(p, [[s0, y + dir * 0.06, z0], [s1, y + dir * 0.06, z0], [s1, y + dir * 0.06, z1], [s0, y + dir * 0.06, z1]], [0, dir, 0])
// window bays along a face: bays of about `bay` with `pier` between
function bays(s0: number, s1: number, bay: number, pier: number, f: (a: number, b: number) => void) {
  const k = Math.max(1, Math.round((s1 - s0) / bay)), w = (s1 - s0) / k
  for (let i = 0; i < k; i++) f(s0 + i * w + pier / 2, s0 + (i + 1) * w - pier / 2)
}
const abox = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = p) =>
  prism([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, p, top)

// ---------------------------------------------------------------------------
// West side: the upper deck over a suite fascia, then the 2017-19 tower.
const WY0 = -57, WY1 = 56
extrudeX([[-60, 0], [-60, 23], [-61, 23], [-89, 38.6], [-89, 0]], [concrete, concrete, seats, concrete, concrete], WY0, WY1, concrete)
bays(WY0 + 2, WY1 - 2, 9, 1.2, (a, b) => panelX(win, -60, 1, a, b, 16.6, 21.6))
// the tower: white frame, two glazed bands facing the field (club boxes and
// the press level), three on the hill side
const TY0 = -60.6, TY1 = 58.1
abox(white, -104, -88.5, TY0, TY1, 0, 54.1, roof)
bays(TY0 + 3, TY1 - 3, 10, 1.2, (a, b) => { panelX(win, -88.5, 1, a, b, 40, 45.8); panelX(win, -88.5, 1, a, b, 47.4, 53) })
bays(TY0 + 3, TY1 - 3, 10, 1.2, (a, b) => { for (const [z0, z1] of [[30.5, 35], [39, 45], [47.2, 52.4]]) panelX(win, -104, -1, a, b, z0, z1) })
for (const s of [-1, 1]) {
  const y = s > 0 ? TY1 : TY0
  bays(-101, -91, 10, 0, (a, b) => { for (const [z0, z1] of [[39, 45], [47.2, 52.4]]) panelY(win, y, s, a, b, z0, z1) })
}
abox(white, -104, -97, -12, 12, 54.1, 58, roof) // raised mid-back block
// two light rigs on the roof (pano, lidar ~63)
for (const y of [-27, 25]) {
  abox(white, -93.6, -92.6, y - 0.5, y + 0.5, 54.1, 60)
  obox(white, [-93.1, y, 61.5], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0.5, 4, 1.6], true)
}
// the stacked white terraces at the tower's south-west end (ext1)
for (const z of [23, 30.5, 38, 45.5]) obox(white, [-96.5, TY0 - 1.6, z], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [7.8, 1.6, 0.6], true)

// ---------------------------------------------------------------------------
// East side: the upper deck backing onto the hill, with stair towers at both
// ends.
const EY0 = -57, EY1 = 52.4
extrudeX([[69, 0], [101.5, 0], [101.5, 44.3], [101, 44.3], [70, 24.6], [69, 24.6]], [concrete, concrete, concrete, seats, concrete, concrete], EY0, EY1, concrete)
bays(EY0 + 2, EY1 - 2, 9, 1.2, (a, b) => panelX(win, 69, -1, a, b, 18.2, 22.4))
abox(concrete, 88, 107.6, 52.4, 59.7, 0, 39.4, roof)
abox(concrete, 89.6, 107.1, -63.9, -57, 0, 39.4, roof)

// ---------------------------------------------------------------------------
// North: the SAF (way/675557448), its roof the north concourse, the video
// board on it.
const SAF: XY[] = [[-32.6, 161.0], [41.0, 160.9], [40.9, 130.1], [35.8, 115.7], [39.8, 114.4], [44.7, 112.8], [42.2, 105.3], [39.5, 97.4], [-32.2, 97.0], [-34.5, 104.2], [-37.1, 112.6], [-28.8, 115.5], [-33.8, 130.4]]
prism(SAF, 0, CONC, concrete, concrete)
bays(-30, 39, 9, 1.4, (a, b) => { panelY(win, 161, 1, a, b, 1.6, 6.4); panelY(win, 161, 1, a, b, 8.2, 13) })
bays(131, 159, 9, 1.4, (a, b) => { panelX(win, 40.95, 1, a, b, 1.6, 6.4); panelX(win, 40.95, 1, a, b, 8.2, 13) })
abox(roof, -24, -12, 118, 142, CONC, 19.4)
abox(roof, 20, 32, 118, 142, CONC, 19.4)
// the board: a base on the roof, legs behind, a 52 m screen facing the field
abox(concrete, -24, 28, 94, 108, CONC, 22.1, roof)
for (const x of [-18, 22]) abox(white, x - 3, x + 3, 102, 113, CONC, 25.6)
obox(white, [2, 99.8, 31.65], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [26, 1.8, 9.55], true)
panelY(screen, 98, -1, -23, 27, 23, 40.2)

// ---------------------------------------------------------------------------
// South: the south building (way/1156816190) and its podium to the bowl.
abox(concrete, -23.3, 27.6, -96.6, -89.3, 0, CONC)
const SB_HI: XY[] = [[-23.3, -96.6], [27.6, -96.6], [27.6, -113.7], [19.4, -113.7], [19.4, -119], [-15.4, -119], [-15.4, -113.7], [-23.3, -113.7]]
const SB_LO: XY[] = [[-15.4, -119], [19.4, -119], [19.6, -136.8], [33.6, -137.2], [34.0, -140.8], [39.2, -141], [39.1, -143.8], [34.4, -145.5], [34.9, -149.2], [19.2, -153.4], [8.4, -155.8], [-3.3, -155.7], [-15.5, -153.4], [-30.7, -149.1], [-29.2, -136.4], [-15.5, -136.4]]
prism(SB_HI, 0, 31.1, concrete, roof)
prism(SB_LO, 0, 19.3, concrete, roof)
// sign boxes along the front, a stair tower behind
abox(white, -20, 27, -101.5, -97.2, 31.1, 37.5)
abox(concrete, -12, -4, -112, -104, 31.1, 35.2, roof)
// glazing: two suite rows facing the field; a dark band high on the south
// face; on the lower block two glazed bands over a dark colonnade (ext2)
bays(-21, 25.5, 8, 1, (a, b) => { panelY(win, -96.6, 1, a, b, 17.2, 21.2); panelY(win, -96.6, 1, a, b, 23.2, 27.4) })
bays(-21.5, 26, 8, 1, (a, b) => { panelY(win, -113.7, -1, a, b, 25.4, 28.2) })
bays(-14, 18, 8, 0.8, (a, b) => panelY(win, -119, -1, a, b, 25.4, 28.2))
for (const [x0, x1, y] of [[-13.5, 17.5, -155.7]] as const) {
  bays(x0, x1, 7, 1, (a, b) => { panelY(win, y, -1, a, b, 3.2, 7.4); panelY(win, y, -1, a, b, 9.6, 12.8); panelY(win, y, -1, a, b, 14.2, 17.4) })
}
bays(-152, -138, 7, 1, (a, b) => { for (const [z0, z1] of [[3.2, 7.4], [9.6, 12.8], [14.2, 17.4]]) panelX(win, -30.1, -1, a, b, z0, z1) })
bays(-152, -138, 7, 1, (a, b) => { for (const [z0, z1] of [[3.2, 7.4], [9.6, 12.8], [14.2, 17.4]]) panelX(win, 34.7, 1, a, b, z0, z1) })
bays(-118, -100, 8, 1, (a, b) => { for (const [z0, z1] of [[17.2, 21.2], [23.2, 27.4]]) { panelX(win, -23.3, -1, a, b, z0, z1); panelX(win, 27.6, 1, a, b, z0, z1) } })

// the corner video boards on their bases, turned to face the field
for (const [cx, base] of [[-35, [[-42.7, -97.5], [-30.6, -97.5], [-30.6, -104], [-42.7, -104]]], [41.5, [[35.5, -97.5], [48.3, -97.5], [48.3, -104], [35.5, -104]]]] as const) {
  prism(base as unknown as XY[], 0, CONC + 6, concrete, roof)
  const a = Math.atan2(0 - cx, 0 + 100) // turn the face toward mid-field
  const u: V3 = [Math.cos(a), -Math.sin(a), 0], v: V3 = [Math.sin(a), Math.cos(a), 0]
  const c: V3 = [cx, -101, 28.85]
  obox(white, c, [u, v, [0, 0, 1]], [6.2, 0.8, 7.85], true)
  const f = add(c, mul(v, 0.86))
  quad(screen, [add(f, add(mul(u, -5.6), [0, 0, -7.2])), add(f, add(mul(u, 5.6), [0, 0, -7.2])), add(f, add(mul(u, 5.6), [0, 0, 7.2])), add(f, add(mul(u, -5.6), [0, 0, 7.2]))], v)
}

// corner light poles (lidar tops)
for (const [x, y, top] of [[-80, 88, 52], [104, 88, 50.8], [72, -96, 42], [-64, -90, 45]] as const) {
  cylinder(white, [x, y], 0.7, 0, top - 3, 8, null)
  const dir = unit([-x, -y, 0]), side: V3 = [-dir[1], dir[0], 0]
  obox(white, [x, y, top - 1.6], [side, dir, [0, 0, 1]], [3.2, 0.5, 1.6], true)
}

if (import.meta.main) {
  await save('phx-sun-devil-stadium', 'Mountain America Stadium', [
    { part: concrete, material: finish('sds-concrete', 0xe4dac8) },
    { part: seats, material: finish('sds-seats', 0xb3b6ba) },
    { part: white, material: { ...PALETTE.trim, floodlight: (p: V3, n: V3) => (n[2] < 0.5 && p[2] > 20 ? 0.5 : 0) } },
    { part: win, material: PALETTE.window },
    { part: screen, material: finish('neon-board', 0x4a4f57) },
    { part: roof, material: PALETTE.roof },
  ], { height: 63, anchor: [33.426445, -111.932605], bearing: 14 }, 6500)
}
