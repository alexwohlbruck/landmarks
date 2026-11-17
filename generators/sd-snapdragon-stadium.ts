/**
 * Snapdragon Stadium, San Diego: San Diego State's open-air stadium in
 * Mission Valley (Gensler, built by Clark 2020-22, opened 19 August 2022,
 * 35,000 seats), on the site of the demolished Qualcomm (Jack Murphy)
 * Stadium. A sunken lower bowl wraps the whole field; two steel upper decks
 * stand along the touchlines, the west (home) one larger, over two levels of
 * clubs and suites; a row of black steel masts stands up from the back of
 * each upper deck (the columns left for a future shade canopy, which was
 * never built) with four floodlight masts on each; four more light poles at
 * the corners, the video board in the north-west corner and the "pier"
 * platform over the south end. Original procedural geometry, CC0-1.0.
 *   bun generators/sd-snapdragon-stadium.ts
 *
 * No canopy. The lead's note asked for "the big west-side canopy/roof over
 * the main stand"; there isn't one. StadiumDB calls the bowl uncovered, and
 * reporting on the design (Sportico 2023, via StadiumDB/search) says the
 * stadium "was designed with columns to incorporate canopies in the future"
 * and canopies were cut for cost ($50-100 M). Every photo below shows the
 * upper decks open to the sky with bare black masts above them. The masts
 * are modelled; no roof.
 *
 * Stadium rule (STYLE.md "Ground"): the stands, decks, masts and board only.
 * The field is the map's; nothing is drawn inside the field ring.
 *
 * Frame: bearing 7 (the field's long axis, from OSM inner way/1083572807,
 * runs 7 degrees east of north). x east, y north, z up, metres, origin at the
 * lead's anchor -117.12244, 32.78422, about 2 m west of the field's centre.
 *
 * Ground and elevation: y = 0 is the field. Published (SDSU Mission Valley
 * EIR appendix 4.6-2, Group Delta geotechnical report, 2019, grading table):
 * field finished subgrade 56 ft NAVD88, main concourse 87 ft, so the
 * concourse and the plaza round the stadium are 31 ft (9.4 m) above the
 * field, and the lower bowl climbs from the field to it. The site was raised
 * with fill in 2020-21 (up to 35 ft). The map's terrain (Mapterhorn, from the
 * 2014 lidar) still shows the old Qualcomm parking-lot grade, a plane from
 * 16 m NAVD88 at the south-west to 27 m at the north-east, so the lowest
 * ground under the footprint (about 16.5 m, 54 ft) is already at the real
 * field level. The rule would give elevation -9.4 (the field's depth below
 * the concourse/plaza), but on this terrain that would bury the bowl 9 m below
 * its real height; with 0 the field sits at its real 56 ft. ELEVATION 0,
 * chosen on purpose; the lead should re-check it if the terrain is ever
 * rebuilt from post-2022 lidar (then -9.4). Until then the outer walls of the
 * lower bowl show above the old terrain on the east and south where the real
 * plaza is now filled up to them.
 *
 * Evidence
 * - OSM: relation/14552060 (building=stadium; outer way/1092512810
 *   "Snapdragon Stadium", inner way/1083572807 = the field). The outline sets
 *   the outer edges here (west -90, east +92, north +100, south -104 in this
 *   frame). The nine building=yes ways listed beside it in the plan
 *   (1083572811-17, 1481675101/2) are the one-storey "garden buildings" on
 *   the plaza outside the outline, not stands; the model doesn't draw them
 *   and doesn't replace them.
 * - USGS NAIP, 2022-04-25 (m_3211716_sw_11_060_20220425; four months before
 *   opening, field still bare): plan of the bowl, the two upper decks (west
 *   x -63 to -88, y -70 to +70; east x +63 to +90, y -76 to +66), the lower
 *   bowl's outer edge (west -58, east +62, north +85, south -90), the
 *   wrap-round corner seating, the video board in the north-west corner on
 *   the diagonal, its shadow and the west stand's long shadow.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014: NOT usable; it shows Qualcomm
 *   Stadium. No height here comes from lidar.
 * - Published: Wikipedia "Snapdragon Stadium" (opening, capacity, Gensler,
 *   Clark); StadiumDB "Snapdragon Stadium" (sunken field, west lower stand in
 *   two tiers, steel upper tiers on both long sides, a low second level over
 *   the north stand by the west corner, pavilion behind the west stand,
 *   floodlights on twelve masts: eight on the upper tiers, four near the
 *   corners; the "pier-like platform" over the south stand; grey and burgundy
 *   seat mosaic); Group Delta geotechnical report (levels, above).
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   "An aerial view of Snapdragon Stadium (2022-08-26).jpg" (Terrible Tim,
 *     CC BY-SA 4.0): the whole bowl from the air, decks, masts, light poles,
 *     corner gaps between the upper decks, the board, the south platform;
 *   "PXL 20220826 184856422.jpg" (Terrible Tim, CC BY-SA 4.0): high aerial,
 *     the bowl in its plaza;
 *   "San Diego Wave vs Angel City FC June 17, 2023 (52999752262).jpg"
 *     (StarsApart, CC BY 2.0): from the north-east corner, the west stand's
 *     burgundy upper deck, suites and black masts, the open south end with
 *     its platform and corner pole;
 *   "CaptureOfSnapdragonStadium.jpg" (The Great Epiphany, CC0): dusk, the
 *     west stand and its masts and light rigs;
 *   "Mascot Monday San Diego Legion Rugby Game (8301408).jpg" (USMC, Sgt.
 *     Jesse K., public domain): an upper deck face-on, masts over it;
 *   "Snapdragon Stadium interior-home stands 1.jpg", "-away stands 1.jpg",
 *     "exterior-Night stadium.jpg", "exterior-Night home stands.jpg"
 *     (Spatms, CC BY-SA 4.0): the stands, the open steel undercroft of the
 *     west upper deck seen from outside (lit red at night), the board;
 *   "AztecStadium.png" (Gateman1997, CC BY-SA 4.0, 2021) and "Aztec Stadium
 *     as of 11-13-21.jpg" (Chuck Marean, CC BY-SA 4.0): the west stand's
 *     raking steel in construction.
 * - Look-only (not used for shape): Flickr "Snapdragon Stadium" by
 *   jimmywayne (CC BY-NC-ND 2.0) and paulkimo90 (CC BY-NC-SA 2.0).
 *
 * Estimated (from the photos, scaled by the 9.4 m concourse and the field's
 * width): west upper deck front 21 m, back 35 m; east upper deck front 14 m,
 * back 29 m; suites 10-20 m; masts 7-8 m above the decks, leaning in; light
 * rigs to 49 m (west) and 43 m (east); corner poles 42 m; the board 15 x 34 m,
 * top 29.5 m (it stands about as tall as the west deck in the night photo); the south platform 13-17 m. Colours: grey lower bowls, burgundy
 * upper decks (the photos' mosaic averaged), pale concrete, black steel.
 *
 * Doubts: no daytime photo of the outside of the west or east stands; the
 * outer walls are plain concrete with glass bands, the undercrofts dark
 * steel. Mast count (9 west, 9 east) from the aerial. Corner wraps and the
 * north-west low second level are simplified.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { beam, box, ccw, earcut, prism, report, writeGlb, type XY } from './sf-de-young'
import { panel } from './sf-opera-house'

const conc = new Part(), grey = new Part(), red = new Part(), steel = new Part(), win = new Part(), roof = new Part()

const CONC = 9.4 // main concourse / plaza above the field (published)

// ---------------------------------------------------------------------------
// Lower bowl: a continuous rake from the field wall up to the concourse, as a
// loft between two rounded rectangles with matching vertex counts.
function rrect(x0: number, x1: number, y0: number, y1: number, r: number, n = 4): XY[] {
  const out: XY[] = []
  const corners: [number, number, number][] = [[x1 - r, y0 + r, -Math.PI / 2], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, Math.PI / 2], [x0 + r, y0 + r, Math.PI]]
  for (const [cx, cy, a0] of corners) for (let i = 0; i <= n; i++) {
    const a = a0 + (i / n) * (Math.PI / 2)
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
  }
  return out // counter-clockwise
}
const FIELD = rrect(-38.5, 42.5, -61.5, 56.5, 6)
const BOWL = rrect(-58, 62, -90, 85, 22)
const ring = (r: XY[], z: number): V3[] => r.map(([x, y]) => [x, y, z])
{
  const n = FIELD.length
  // field wall (faces the field, i.e. inward) and the rake
  const w0 = ring(FIELD, 0), w1 = ring(FIELD, 1.3), top = ring(BOWL, CONC)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    conc.quad(w0[j], w0[i], w1[i], w1[j])
  }
  // the rake in two bands so a concrete cross-aisle shows half way up
  const midIn = FIELD.map((p, i) => [p[0] + (BOWL[i][0] - p[0]) * 0.55, p[1] + (BOWL[i][1] - p[1]) * 0.55] as XY)
  const midOut = FIELD.map((p, i) => [p[0] + (BOWL[i][0] - p[0]) * 0.6, p[1] + (BOWL[i][1] - p[1]) * 0.6] as XY)
  const zm = 1.3 + (CONC - 1.3) * 0.55
  const a = ring(midIn, zm), b = ring(midOut, zm + 0.2)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    grey.quad(w1[j], w1[i], a[i], a[j])
    conc.quad(a[j], a[i], b[i], b[j])
    grey.quad(b[j], b[i], top[i], top[j])
  }
  // concourse walkway round the top, and the bowl's outer wall down to y = 0
  const walk = BOWL.map((p, i) => { const q = BOWL[i]; const c: XY = [2, -2.5]; const d = Math.hypot(q[0] - c[0], q[1] - c[1]); return [q[0] + ((q[0] - c[0]) / d) * 4, q[1] + ((q[1] - c[1]) / d) * 4] as XY })
  const wt = ring(walk, CONC), wb = ring(walk, 0)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    conc.quad(top[j], top[i], wt[i], wt[j])
    conc.quad(wb[i], wb[j], wt[j], wt[i])
  }
}
// Aisles: concrete stair strips down the lower bowl, every ~12 m along the
// sides and ends (drawn as thin raised strips on the rake).
function rakeStrip(p0: XY, p1: XY, z0: number, z1: number, w: number) {
  const d: XY = [p1[0] - p0[0], p1[1] - p0[1]], L = Math.hypot(d[0], d[1]), n: XY = [-d[1] / L * w / 2, d[0] / L * w / 2]
  conc.quad([p0[0] - n[0], p0[1] - n[1], z0 + 0.12], [p0[0] + n[0], p0[1] + n[1], z0 + 0.12], [p1[0] + n[0], p1[1] + n[1], z1 + 0.12], [p1[0] - n[0], p1[1] - n[1], z1 + 0.12])
}
for (let y = -48; y <= 44; y += 13) {
  rakeStrip([-38.5, y], [-58, y], 1.3, CONC, 1.4)
  rakeStrip([42.5, y], [62, y], 1.3, CONC, 1.4)
}
for (let x = -24; x <= 30; x += 13) {
  rakeStrip([x, 56.5], [x, 85], 1.3, CONC, 1.4)
  rakeStrip([x, -61.5], [x, -90], 1.3, CONC, 1.4)
}

// ---------------------------------------------------------------------------
// The upper decks: a section in x-z swept along y between the two ends, the
// ends cut on a slant towards the corners (the corner gaps). `side` = -1 west,
// +1 east. Section points are distances out from the field (|x|).
type Sec = { x: number; z: number; m: Part }
function deck(side: number, y0: number, y1: number, slant: number, sec: Sec[]) {
  // ends: the front (field) edge is shorter than the back by `slant` at each end
  const xs = sec.map((s) => s.x), xmin = Math.min(...xs), xmax = Math.max(...xs)
  const yAt = (x: number, end: 0 | 1) => {
    const t = (x - xmin) / (xmax - xmin)
    return end === 0 ? y0 + slant * (1 - t) : y1 - slant * (1 - t)
  }
  const P = (s: Sec, end: 0 | 1): V3 => [side * s.x, yAt(s.x, end), s.z]
  for (let k = 0; k < sec.length; k++) {
    const a = sec[k], b = sec[(k + 1) % sec.length], m = b.m
    const A0 = P(a, 0), A1 = P(a, 1), B0 = P(b, 0), B1 = P(b, 1)
    // the section runs clockwise seen from +y on the west side; wind per side
    if (side < 0) m.quad(A0, A1, B1, B0)
    else m.quad(A0, B0, B1, A1)
  }
  // end caps
  const r0 = ccw(sec.map((s) => [s.x, s.z] as XY))
  for (const end of [0, 1] as const) for (const [i, j, k] of earcut(r0)) {
    const f = (q: XY): V3 => [side * q[0], yAt(q[0], end), q[1]]
    const A = f(r0[i]), B = f(r0[j]), C = f(r0[k])
    // outward: -y at end 0, +y at end 1
    const nY = (B[2] - A[2]) * (C[0] - A[0]) - (B[0] - A[0]) * (C[2] - A[2])
    const want = end === 0 ? -1 : 1
    if (Math.sign(nY) === want) conc.tri(A, B, C)
    else conc.tri(A, C, B)
  }
}
// West (home) stand, distances out from the field centre line x = 0 (the
// field edge is at x = -38.5): club and suites over the lower bowl's back,
// the burgundy upper deck, its back fascia, and the open steel undercroft.
deck(-1, -70, 70, 10, [
  { x: 60, z: 9.4, m: conc }, // concourse edge
  { x: 60, z: 20.2, m: win }, // the suites' glass front (two levels)
  { x: 59, z: 21.2, m: conc }, // upper deck front fascia
  { x: 87, z: 35.2, m: red }, // the upper deck rake
  { x: 88.5, z: 36.6, m: conc }, // back rail
  { x: 89.5, z: 36.6, m: conc },
  { x: 89.5, z: 32.5, m: conc }, // back fascia
  { x: 70, z: 12.5, m: roof }, // open steel undercroft (sloping soffit)
  { x: 90, z: 12.5, m: conc }, // pavilion roof under it
  { x: 90, z: 0, m: conc }, // outer wall to the field level
  { x: 62, z: 0, m: conc },
  { x: 62, z: 9.4, m: conc },
])
// East (visitors') stand: lower bowl only at the front, upper deck from 14 m.
deck(1, -76, 66, 10, [
  { x: 64, z: 9.4, m: conc },
  { x: 64, z: 13.2, m: win }, // a glazed club band under the deck front
  { x: 63, z: 14.2, m: conc },
  { x: 89, z: 28.2, m: red },
  { x: 90.5, z: 29.6, m: conc },
  { x: 91.5, z: 29.6, m: conc },
  { x: 91.5, z: 26, m: conc },
  { x: 72, z: 10, m: roof },
  { x: 92, z: 10, m: conc },
  { x: 92, z: 0, m: conc },
  { x: 66, z: 0, m: conc },
  { x: 66, z: 9.4, m: conc },
])
// Concrete stair strips (vomitory aisles) down each upper deck.
function deckAisles(side: number, y0: number, y1: number, xf: number, zf: number, xb: number, zb: number) {
  for (let y = y0; y <= y1; y += 14) {
    const w = 1.6
    const P = (x: number, z: number, dy: number): V3 => [side * x, y + dy, z + 0.12]
    if (side < 0) conc.quad(P(xf, zf, w / 2), P(xf, zf, -w / 2), P(xb, zb, -w / 2), P(xb, zb, w / 2))
    else conc.quad(P(xf, zf, -w / 2), P(xf, zf, w / 2), P(xb, zb, w / 2), P(xb, zb, -w / 2))
  }
}
deckAisles(-1, -56, 58, 59.5, 21.4, 87, 35.2)
deckAisles(1, -62, 54, 63.5, 14.4, 89, 28.2)
// Suite boxes along the west front: piers between glass bays.
for (let y = -56; y <= 56; y += 8) box(conc, [-59.4, y, 15], 0.6, 0.5, 5.2)
// Raking steel struts in the open undercrofts (seen from outside).
for (const [side, y0, y1, xo, zt, zb] of [[-1, -60, 60, 89, 32.5, 12.5], [1, -66, 56, 91, 26, 10]] as const)
  for (let y = y0; y <= y1; y += 12) {
    beam(steel, [side * (xo - 0.6), y, zt - 0.3], [side * (xo - 14), y, zb], 0.7, 0.9)
    beam(steel, [side * (xo - 0.6), y, zt - 0.3], [side * (xo - 0.6), y, zb], 0.7, 0.7)
    if (y + 12 <= y1) beam(steel, [side * (xo - 0.3), y, zb + 0.5], [side * (xo - 0.3), y + 12, zt - 1], 0.5, 0.5)
  }
// The back of the west pavilion: glass bands of the clubs on the concourse.
panel(win, [-90, -60], [-90, 60], [-1, 0], 3.5, 8.5, 0.06)
panel(win, [92, -66], [92, 56], [1, 0], 2, 6.5, 0.06)

// ---------------------------------------------------------------------------
// The black masts along the back of each upper deck, leaning in over the
// seats (the future canopy's columns), and the floodlight rigs on four of
// them per side.
function masts(side: number, y0: number, y1: number, n: number, xb: number, zb: number, h: number, lamps: number[]) {
  for (let i = 0; i < n; i++) {
    const y = y0 + ((y1 - y0) * i) / (n - 1)
    const foot: V3 = [side * (xb - 0.5), y, zb - 3]
    const tip: V3 = [side * (xb - 6), y, zb + h]
    beam(steel, foot, tip, 1.1, 1.4)
  }
  for (const y of lamps) {
    const base: V3 = [side * (xb + 0.2), y, zb - 2], top: V3 = [side * (xb - 1.5), y, zb + h + 7]
    beam(steel, base, top, 0.8, 0.8)
    // the lamp head: a white frame with a lamp grid facing the field
    box(conc, [side * (xb - 1.8), y, top[2] + 1.6], 0.6, 3.6, 1.8)
    panel(win, [side * (xb - 2.42), y - 3.2], [side * (xb - 2.42), y + 3.2], [-side, 0], top[2] + 0.2, top[2] + 3.0, 0.02)
  }
}
masts(-1, -62, 62, 9, 89.5, 36.6, 7, [-46.5, -15.5, 15.5, 46.5])
masts(1, -68, 58, 9, 91.5, 29.6, 6.5, [-52.5, -21, 10.5, 42])
// Four light poles near the corners.
function pole(x: number, y: number, h: number, toward: XY) {
  const b = Math.atan2(toward[1], toward[0])
  box(steel, [x, y, h / 2], 0.6, 0.6, h / 2, b)
  const u: XY = [-Math.sin(b), Math.cos(b)], n: XY = [Math.cos(b), Math.sin(b)]
  const c: XY = [x + n[0] * 0.8, y + n[1] * 0.8]
  box(conc, [c[0], c[1], h + 1.6], 0.5, 3.2, 1.9, b)
  panel(win, [c[0] - u[0] * 2.8 + n[0] * 0.5, c[1] - u[1] * 2.8 + n[1] * 0.5], [c[0] + u[0] * 2.8 + n[0] * 0.5, c[1] + u[1] * 2.8 + n[1] * 0.5], n, h + 0.2, h + 3.2, 0.02)
}
pole(-48, -97, 42, [0.5, 1])
pole(58, -98, 42, [-0.5, 1])
pole(70, 86, 42, [-0.6, -1])
pole(-30, 98, 42, [0.3, -1])

// ---------------------------------------------------------------------------
// The video board in the north-west corner, on the diagonal, facing the
// field, on two legs; screen = window (lit at night).
{
  const A: XY = [-80, 72], B: XY = [-56, 96], u: XY = [(B[0] - A[0]) / Math.hypot(22, 22), (B[1] - A[1]) / Math.hypot(22, 22)]
  const n: XY = [u[1], -u[0]] // towards the field (south-east)
  const c: XY = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], rot = Math.atan2(u[1], u[0])
  box(steel, [c[0], c[1], 22], 17.5, 1.2, 7.5, rot)
  panel(win, [A[0] + u[0] * 0.8 + n[0] * 1.2, A[1] + u[1] * 0.8 + n[1] * 1.2], [B[0] - u[0] * 0.8 + n[0] * 1.2, B[1] - u[1] * 0.8 + n[1] * 1.2], n, 15.4, 28.6, 0.04)
  for (const s of [-8, 8]) box(steel, [c[0] + u[0] * s, c[1] + u[1] * s, 7.3], 1.2, 1.2, 7.3, rot)
  // the low second level over the north stand by the west corner
  prism(conc, [[-60, 84], [-34, 86], [-34, 100], [-62, 98]], 0, 14, roof)
  panel(win, [-60, 84], [-34, 86], [0, -1], 10.4, 13.2, 0.06)
}
// The "pier" platform over the south end: a two-level deck on legs.
{
  prism(conc, [[-22, -94], [22, -94], [22, -84], [-22, -84]], 12, 13.4, roof)
  prism(conc, [[-10, -98], [10, -98], [10, -90], [-10, -90]], 13.4, 17.6, roof)
  panel(win, [-10, -90], [10, -90], [0, 1], 14.4, 17, 0.06)
  for (const x of [-18, -6, 6, 18]) box(steel, [x, -92, 6], 0.6, 0.6, 6)
}
// Concourse buildings at the open ends (gates, stairs), plain blocks.
prism(conc, [[-58, -104], [-30, -104], [-30, -94], [-62, -94]], 0, 13, roof)
prism(conc, [[26, -104], [52, -100], [56, -92], [24, -94]], 0, 13, roof)
prism(conc, [[30, 86], [70, 80], [76, 92], [32, 98]], 0, 13, roof)

// ---------------------------------------------------------------------------
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : p[2] > 8 ? 0.45 : 0.2)
const parts = [
  { part: conc, material: { ...finish('snapdragon-concrete', 0xdcd8d0), floodlight: lit } },
  { part: grey, material: finish('snapdragon-grey-seats', 0x8e9399) },
  { part: red, material: finish('snapdragon-burgundy-seats', 0x9b5a5c) },
  { part: steel, material: finish('snapdragon-black-steel', 0x4a4f57) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
]
const REPLACES = ['relation/14552060']
const glb = writeGlb('Snapdragon Stadium', parts, {
  license: 'CC0-1.0', bearing: 7, elevation: 0, anchor: [32.78422, -117.12244],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', replaces: REPLACES,
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('Snapdragon Stadium', parts, glb, 6500)
const out = new URL('../models/sd-snapdragon-stadium.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
