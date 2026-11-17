/**
 * Rhodes Hall ("the castle on Peachtree"), 1516 Peachtree Street NE,
 * Atlanta (1904, Willis F. Denny, for Amos Giles Rhodes) — original
 * procedural geometry, CC0-1.0.
 * bun generators/atl-rhodes-hall.ts
 *
 * Uses the B9 kit exported from generators/atl-tech-tower.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground (the west side). Bearing 0: the plan is OSM's outline as
 * drawn. Anchor = centroid of OSM way/269637579 ("Rhodes Hall",
 * historic=castle, wikidata Q7321015), 33.795963, -84.388339. Its
 * building:parts way/1450958391 (the porch), way/1450958392 (the south-west
 * wing), way/1450958393 (the main house, pyramidal roof), way/1450958394
 * (the square tower, 4 levels), way/1450958395 and way/1455901692 (the west
 * wings) lie inside it.
 *
 * Identity: a Romanesque Revival mansion of rough-faced grey Stone Mountain
 * granite, facing east to Peachtree Street. A tall square crenellated tower
 * at the south-east corner with paired round-arched windows near its top; a
 * round turret with a steep conical red-tile roof beside it; a one-storey
 * arcaded porch of heavy round arches across the east front and round the
 * north-east corner, with a parapet; a steep red-tile hipped roof with
 * gables (one with a cross finial); a round tower with a crenellated flat
 * top on the south front; low flat-roofed wings to the south-west and west.
 *
 * Evidence:
 *  - plan: OSM way/269637579 and its parts, as drawn. The round turret
 *    centres and radii come from the parts' curved edges.
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 0.5 m
 *    grid, max-filtered over 2 m; ground_min 281.31 m. The ground falls
 *    2.3 m from Peachtree (east) to the west side, which is y = 0 (lidar
 *    1.5 m over ground_min). Measured, model metres: the square tower's
 *    parapet 20.8 and merlons 21.7; the main roof's peak about 19.9 (drawn at 17.4: the higher
 *    returns are its chimneys, and the photos show the roof well below
 *    the tower top); the
 *    north-east turret's cone about 19; the south tower's top about 12 (flat, crenellated, as the photos
 *    show; the higher returns there are the main roof behind it);
 *    the porch parapet 8.5 (6 m over the Peachtree side); the south-west
 *    wing 8.5; the west wings 11.5 and 10.5.
 *  - eaves, storeys, windows and arches: scaled from the JJonahJackalope
 *    and Lars Juhl Jensen photos against the lidar tower height.
 *  - ground: Mapterhorn 0.5 m (west) to 2.9 m (east); elevation 0. The
 *    walls run down to y = 0 and sink into the slope on the east.
 *  - colours: grey granite, red clay tile roofs, from the daylight photos
 *    (the Georgia Trust photo is warm evening light and is not used for
 *    colour).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Rhodes Hall in Atlanta.jpg, Lars Juhl Jensen, CC BY 2.0 (the east
 *    front from the south-east) https://commons.wikimedia.org/wiki/File:Rhodes_Hall_in_Atlanta.jpg
 *  - Rhodes Hall 1.jpg, JJonahJackalope, CC BY-SA 4.0 (east front)
 *    https://commons.wikimedia.org/wiki/File:Rhodes_Hall_1.jpg
 *  - Rhodes Hall 2.jpg, JJonahJackalope, CC BY-SA 4.0 (from the south-east)
 *    https://commons.wikimedia.org/wiki/File:Rhodes_Hall_2.jpg
 *  - Rhodes Hall.jpg, Tyler Lahti, CC BY-SA 2.0 (east front, the drive)
 *    https://commons.wikimedia.org/wiki/File:Rhodes_Hall.jpg
 *  - Rhodes Hall Exterior.jpg, Georgia Trust (Gatrust), public domain (the
 *    porch and turret) https://commons.wikimedia.org/wiki/File:Rhodes_Hall_Exterior.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the west and north sides are seen in no photo and are drawn
 * plain with windows; the roof's dormers and gables are simplified to two
 * cross gables; the porch's columns are drawn as solid piers between dark
 * arches; the chimneys and the cross are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, capPoly, ccw, cornice, edgePanels, gableRoof, hipRoof, onWall, rectShape, revolve, save, split, wall, type XY } from './atl-tech-tower'

const granite = new Part(), trim = new Part(), win = new Part(), tile = new Part(), roof = new Part()

const P393 = ccw([[-11.59, 7.38], [-11.59, 6.85], [-11.55, 1.69], [-11.18, 1.69], [-11.16, -3.73], [-8.27, -3.71], [-8.28, -6.71], [-6.09, -6.70], [-6.08, -7.75], [-2.07, -7.71], [-2.08, -6.39], [-0.63, -6.37], [-0.65, -7.16], [-0.43, -8.14], [-0.14, -8.74], [0.27, -9.26], [1.46, -10.08], [3.10, -10.33], [4.48, -9.91], [5.46, -9.09], [6.04, -8.07], [6.25, -6.86], [5.34, -6.86], [5.33, -0.44], [8.28, -0.44], [8.27, 0.70], [8.27, 1.42], [9.48, 1.66], [10.46, 2.30], [11.08, 3.14], [11.43, 4.67], [11.12, 5.94], [9.58, 7.43], [8.23, 7.72], [2.26, 7.76], [2.25, 8.95], [0.33, 10.70], [-2.00, 10.68], [-3.99, 8.57], [-3.99, 7.43]])
const P392 = ccw([[-8.28, -6.71], [-6.09, -6.70], [-6.08, -7.75], [-2.07, -7.71], [-2.08, -6.39], [-0.63, -6.37], [-0.65, -7.16], [-0.43, -8.14], [-0.14, -8.74], [0.27, -9.26], [0.22, -15.14], [-8.31, -15.17], [-8.29, -10.32]])
const P395 = ccw([[-16.81, 1.67], [-11.18, 1.69], [-11.16, -4.34], [-16.80, -4.35]])
const P692 = ccw([[-16.83, 6.83], [-11.59, 6.85], [-11.55, 1.69], [-16.81, 1.67]])
// The porch: east of the main house and round the north-east corner.
const PORCH_E = ccw([[11.45, -1.48], [16.14, -1.46], [16.10, 10.76], [11.2, 10.74], [11.2, -0.43]])
const PORCH_N = ccw([[2.26, 7.76], [11.2, 7.72], [11.2, 10.74], [0.33, 10.70], [2.25, 8.95]])

const EAVE = 13.5, PEAK = 17.4
const TW: [number, number, number, number] = [5.33, 11.45, -6.86, -0.44] // square tower x0 x1 y0 y1
const TOWER = 20.8
const NE: XY = [8.25, 4.6], NE_R = 3.15 // north-east turret
const ST: XY = [3.15, -7.05], ST_R = 3.25 // south turret
const PORCH = 8.5

// ── Main house ──
wall(granite, split(P393, 4), 0, EAVE)
cornice(trim, P393.filter(() => true), EAVE - 0.6, 0.6, 0.3, null)
capPoly(roof, P393, EAVE, true)
// The steep red-tile hipped roof, nearly pyramidal (OSM roof:shape).
hipRoof(tile, -11.6, 5.3, -7.7, 10.7, EAVE, PEAK, 0.5)
// Cross gables: east-facing at the north-east (with the cross), and
// south-facing over the south front, left of the tower.
gableRoof(tile, granite, 1.0, 8.2, 6.3, 10.6, EAVE, 17.2, 'x', 0.35, 0.3)
gableRoof(tile, granite, -6.2, -1.6, -7.7, -1.5, EAVE, 17.0, 'y', 0.35, 0.3)
// small windows in the gables
onWall(win, [8.2, 6.3], [8.2, 10.6], archShape(2.15, 1.3, EAVE + 0.5, EAVE + 1.8))
onWall(win, [-6.2, -7.7], [-1.6, -7.7], archShape(2.3, 1.3, EAVE + 0.5, EAVE + 1.6))

// ── Wings ──
wall(granite, split(P392, 4), 0, PORCH)
capPoly(roof, P392, PORCH, true)
cornice(trim, P392, PORCH - 0.5, 0.5, 0.2, null)
wall(granite, split(P395, 4), 0, 11.5)
capPoly(roof, P395, 11.5, true)
cornice(trim, P395, 11.0, 0.5, 0.25, null)
wall(granite, split(P692, 4), 0, 10.5)
capPoly(roof, P692, 10.5, true)
cornice(trim, P692, 10.0, 0.5, 0.25, null)

// ── The square tower, crenellated ──
const [x0, x1, y0, y1] = TW
const tRing = ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]] as XY[])
box(granite, x0, x1, y0, y1, 0, TOWER, roof, 0)
// a corbelled band under the parapet, standing out
cornice(trim, tRing, TOWER - 1.9, 0.9, 0.35, trim)
box(trim, x0 - 0.3, x1 + 0.3, y0 - 0.3, y1 + 0.3, TOWER - 1.0, TOWER, null, 0)
// merlons: four a side, on the parapet's outer edge
for (let i = 0; i < 4; i++) {
  for (const [ax, ay, bx, by] of [[x0, y0, x1, y0], [x1, y0, x1, y1], [x1, y1, x0, y1], [x0, y1, x0, y0]] as number[][]) {
    const L = Math.hypot(bx - ax, by - ay), t = [(bx - ax) / L, (by - ay) / L], nn = [t[1], -t[0]]
    const s0 = -0.3 + (i * (L + 0.6)) / 4 + 0.15, s1 = s0 + (L + 0.6) / 4 - 0.75
    const p = (s: number, d: number): XY => [ax + t[0] * s + nn[0] * d, ay + t[1] * s + nn[1] * d]
    const a = p(s0, 0.3), b = p(s1, 0.3), c = p(s1, -0.4), d = p(s0, -0.4)
    const xs = [a[0], b[0], c[0], d[0]], ys = [a[1], b[1], c[1], d[1]]
    box(trim, Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys), TOWER, TOWER + 0.9, trim, 0.08)
  }
}
// Tower windows: paired round-headed lights near the top, single windows below.
for (let i = 0; i < 4; i++) {
  const a = tRing[i], b = tRing[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  onWall(win, a, b, archShape(L / 2 - 0.75, 1.05, 15.0, 17.0))
  onWall(win, a, b, archShape(L / 2 + 0.75, 1.05, 15.0, 17.0))
  for (const z of [3.6, 7.6, 11.4]) onWall(win, a, b, rectShape(L / 2 - 0.7, L / 2 + 0.7, z, z + 2.0))
}

// ── Round turrets with conical red-tile roofs ──
revolve(granite, NE, [[NE_R, 0], [NE_R, EAVE + 0.4]], 16, 0, false, false)
revolve(trim, NE, [[NE_R, EAVE - 0.2], [NE_R + 0.3, EAVE + 0.2], [NE_R + 0.3, EAVE + 0.6], [NE_R, EAVE + 0.6]], 16, 0, false, false)
revolve(tile, NE, [[NE_R + 0.4, EAVE + 0.5], [NE_R * 0.8, EAVE + 1.6], [0, 20.2]], 16, 0, false, true)
revolve(granite, ST, [[ST_R, 0], [ST_R, 11.0]], 16, 0, false, false)
revolve(trim, ST, [[ST_R, 10.6], [ST_R + 0.3, 11.0], [ST_R + 0.3, 11.4], [ST_R, 11.4]], 16, 0, false, false)
// the south tower is flat-topped behind a corbelled, crenellated parapet (JJonahJackalope photo 2)
revolve(trim, ST, [[ST_R + 0.3, 11.4], [ST_R + 0.3, 12.3], [ST_R - 0.3, 12.3], [ST_R - 0.3, 11.4]], 16, 0, false, false)
capPoly(roof, Array.from({ length: 16 }, (_, k) => [ST[0] + (ST_R - 0.3) * Math.cos((k / 16) * Math.PI * 2), ST[1] + (ST_R - 0.3) * Math.sin((k / 16) * Math.PI * 2)] as XY), 11.4, true)
for (let k = 0; k < 16; k += 2) {
  const a = (k / 16) * Math.PI * 2, c: XY = [ST[0] + ST_R * Math.cos(a), ST[1] + ST_R * Math.sin(a)]
  box(trim, c[0] - 0.35, c[0] + 0.35, c[1] - 0.35, c[1] + 0.35, 12.3, 13.0, trim, 0.06)
}
// turret windows: a ring of round-headed lights on the upper floor, tall ones below
for (const [c, r, zt] of [[NE, NE_R, EAVE], [ST, ST_R, 11.0]] as [XY, number, number][]) {
  const n = 16
  for (let k = 0; k < n; k++) {
    const a0 = (k / n) * Math.PI * 2, a1 = ((k + 1) / n) * Math.PI * 2
    const A: XY = [c[0] + r * Math.cos(a0), c[1] + r * Math.sin(a0)], B: XY = [c[0] + r * Math.cos(a1), c[1] + r * Math.sin(a1)]
    const mid = (a0 + a1) / 2, dir: XY = [Math.cos(mid), Math.sin(mid)]
    // only the faces out of the main house: east half for NE, south half for ST
    const out = c === NE ? dir[0] > 0.2 : dir[1] < -0.2
    if (!out) continue
    const L = Math.hypot(B[0] - A[0], B[1] - A[1])
    if (k % 2 === 0) onWall(win, A, B, archShape(L / 2, 0.75, zt - 3.0, zt - 1.6, 4), 0.04)
    if (k % 4 === 0) onWall(win, A, B, rectShape(L / 2 - 0.4, L / 2 + 0.4, zt - 8.2, zt - 6.0), 0.04)
  }
}

// ── The porch: an arcade of heavy round arches under a parapet ──
for (const P of [PORCH_E, PORCH_N]) {
  wall(granite, split(P, 4), 0, PORCH - 0.8)
  capPoly(roof, P, PORCH - 0.8, true)
}
// parapet (a solid balustrade) on the outer edges
const parapet = (a: XY, b: XY) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn = [t[1], -t[0]]
  const q = (s: number, d: number): V3 => [a[0] + t[0] * s + nn[0] * d, a[1] + t[1] * s + nn[1] * d, 0]
  const r = [q(0, 0.15), q(L, 0.15), q(L, -0.45), q(0, -0.45)]
  const xs = r.map((v) => v[0]), ys = r.map((v) => v[1])
  box(trim, Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys), PORCH - 1.0, PORCH, trim, 0.1)
}
parapet([16.14, -1.46], [16.10, 10.76])
parapet([16.10, 10.76], [0.6, 10.7])
parapet([11.45, -1.48], [16.14, -1.46])
// The arches: five on the east front, four on the north, two at the south end,
// springing from short piers on the raised porch floor (2.4 m, the east ground).
const arcade = (a: XY, b: XY, n: number) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), w = L / n
  for (let k = 0; k < n; k++) onWall(win, a, b, archShape((k + 0.5) * w, w - 0.9, 3.0, PORCH - 1.0 - (w - 0.9) / 2 - 0.5, 8))
}
arcade([16.14, -1.46], [16.10, 10.76], 4)
arcade([16.10, 10.76], [2.25, 10.7], 4)
arcade([11.45, -1.48], [16.14, -1.46], 1)

// ── Windows on the house and wings ──
const house = { group: 3.6, gap: 1.4, bay: 3.2, pier: 1.8, margin: 1.0, min: 2.8 }
const skip = (a: XY, b: XY) => {
  // edges hidden behind the porch, the tower, or on the turrets' arcs
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
  if (mx > 8 && my > -0.5) return true
  if (my > 7.5 && mx > 0) return true
  return Math.hypot(b[0] - a[0], b[1] - a[1]) < 2.5
}
for (let i = 0; i < P393.length; i++) {
  const a = P393[i], b = P393[(i + 1) % P393.length]
  if (!skip(a, b)) edgePanels(win, a, b, 2.6, EAVE - 1.3, house)
}
for (const [P, top] of [[P392, PORCH], [P395, 11.5], [P692, 10.5]] as [XY[], number][]) {
  for (let i = 0; i < P.length; i++) edgePanels(win, P[i], P[(i + 1) % P.length], 2.6, top - 1.1, house)
}

// Night: windows glow; the house is floodlit from the lawn, the tower most.
const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0 : p[0] > 4 ? 0.7 : 0.4)
await save('atl-rhodes-hall', 'Rhodes Hall', [
  { part: granite, material: { ...finish('rhodes-granite', 0xaeaba3), floodlight: flood } },
  { part: trim, material: { ...finish('rhodes-granite-dressed', 0xc9c6be), floodlight: flood } },
  { part: win, material: PALETTE.window },
  { part: tile, material: finish('rhodes-tile', 0xa65a4a) },
  { part: roof, material: PALETTE.roof },
], { height: TOWER + 0.9, anchor: [33.795963, -84.388339], bearing: 0 })
