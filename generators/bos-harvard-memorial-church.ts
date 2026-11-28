/**
 * The Memorial Church of Harvard University, Harvard Yard, Cambridge (1932,
 * Coolidge, Shepley, Bulfinch & Abbott) — original procedural geometry,
 * CC0-1.0.
 * bun generators/bos-harvard-memorial-church.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 13: the nave runs along x (103°), the west portico
 * at -x, Appleton Chapel's lower block at +x; -y is the south front on
 * Tercentenary Theatre, facing Widener Library, with the main portico and
 * the steeple over it. Anchor = the centroid of OSM way/29789985,
 * -71.1160331, 42.3749104.
 *
 * Identity (from the photos below):
 *  1. The tall white Georgian steeple: a square red-brick tower rising
 *     behind the portico to a white cornice, then a white pedestal stage
 *     with corner obelisks, a square belfry with a round-headed louvred
 *     opening, a smaller octagonal lantern with urns, and a tall slender
 *     octagonal white spire with a gilt ball and finial.
 *  2. The south portico: four big grey Doric columns, a triglyph frieze
 *     and a plain pediment, on a wide flight of steps.
 *  3. A red-brick Georgian Revival hall with tall round-headed windows in
 *     white frames, a grey triglyph frieze at the eaves and a grey slate
 *     gable roof; a smaller portico on the west end; the lower Appleton
 *     Chapel block at the east end.
 *
 * Plan: OSM way/29789985 for the hall (x -25.3..21.4, y ±11.9), the west
 * portico (x -32.4..-25.3, y ±8.1) and the east block (x 21.4..32,
 * y -10..9.7). The south portico and the tower are not in the OSM outline;
 * they are drawn where the 2021 lidar has them: the portico x -8.7..5.7,
 * y -23.5..-11.9, the tower 7.5 m square about (-1, -14.5).
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021), 0.5 m grid,
 * above the Yard (8.7 m). Measured: the hall's eaves 12.0, ridge 18.1; the
 * east block's ridge 16.9; the west portico's ridge 16.2; the south
 * portico's eaves 11.9 and ridge 16.4; the tower's brick cornice 28.4; the
 * pedestal stage 30.3; the belfry's corners 37.8; the lantern's urns 43.8;
 * a return on the spire at 53.9. Two returns at 70–72 m over the spire are
 * not borne out by the photo (below) and are taken as noise.
 * Measured on the ajay_suresh photo (frontal, verticals parallel), scaled
 * by the tower's 7.5 m width (23 px/m): the pedestal stage to 31.0, the
 * belfry to 37.0, the lantern to 42.6 (urns 44), the spire's tip 58.0, the
 * gilt ball and finial to 60.7; the stages' widths 6.7, 5.4 and 4.3 m, the
 * spire's base 2.0 m. These agree with the lidar's stages within a metre.
 * Estimated from the photos: the windows, the columns (1.4 m across,
 * capitals at 9.7), the frieze, the steps.
 *
 * Ground: the Mapterhorn terrain falls about 2 m from the south front to
 * the north-east corner, which is y = 0 (the lidar shows 0.5–1 m); the
 * walls run down to 0, and the south portico's platform (2.8) and steps
 * (from 2.4) stand on the south ground as the terrain draws it. The
 * lidar heights are taken above the north side's ground. elevation 0.
 *
 * Night: the steeple is floodlit white (Daderot's night photo); the windows
 * glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Memorial Church of Harvard University (54939978802).jpg, ajay_suresh,
 *    CC BY 4.0 (the south front and the steeple square on)
 *    https://commons.wikimedia.org/wiki/File:Memorial_Church_of_Harvard_University_(54939978802).jpg
 *  - Harvard Memorial Church Saulenportikus S 9367 20190427.jpg, Karlunun,
 *    CC BY-SA 4.0 (the south portico close up)
 *    https://commons.wikimedia.org/wiki/File:Harvard_Memorial_Church_Saulenportikus_S_9367_20190427.jpg
 *  - Cambridge - USA - Harvard University - Memorial Church -
 *    panoramio.jpg, Edgar El, CC BY 3.0 (the tower and steeple from the
 *    south-west) https://commons.wikimedia.org/wiki/File:Cambridge_-_USA_-_Harvard_University_-_Memorial_Church_-_panoramio.jpg
 *  - Memorial Church in Harvard Yard.jpg, Chris Rycroft, CC BY 2.0 (the
 *    south front and the west portico)
 *    https://commons.wikimedia.org/wiki/File:Memorial_Church_in_Harvard_Yard.jpg
 *  - USA-Harvard Memorial Church.jpg, Ingfbruno, CC BY-SA 3.0 (the south
 *    front from the Yard, far)
 *    https://commons.wikimedia.org/wiki/File:USA-Harvard_Memorial_Church.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the north side and the east block are not in the photos used;
 * the north side's windows are drawn like the south's. The west portico is
 * seen only at the edge of the Rycroft photo: four columns under a
 * pediment, as drawn. The lantern is drawn octagonal; the photo is frontal
 * and does not settle it.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, onWall, rectShape, revolve, type XY } from './atl-tech-tower'
import { box, ccw, cornice, prism, save } from './atl-flatiron-building'
import { gableBanded, poly, sq } from './bos-harvard-memorial-hall'

const brick = new Part(), white = new Part(), grey = new Part(), slate = new Part(), win = new Part(), gilt = new Part() // the doors are blue-grey: drawn in slate
type F = [XY, XY]

const X0 = -25.3, X1 = 21.4, Y0 = -11.9, Y1 = 11.9, EAVE = 12.0, RIDGE = 18.1
// ── The hall ──
box(brick, X0, X1, Y0, Y1, 0, EAVE, null, 0)
const hallRing = ccw([[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]])
cornice(grey, hallRing, EAVE - 1.6, 1.6, 0.35, null) // the triglyph frieze and cornice
gableBanded([[1, slate]], brick, X0, X1, Y0, Y1, EAVE, RIDGE, 'x', 0.45, 0.3)

// tall round-headed windows in white frames
const arched = (f: F, s: number, w: number, z0: number, zs: number) => {
  onWall(white, f[0], f[1], archShape(s, w + 0.5, z0 - 0.3, zs, 8), 0.03)
  onWall(win, f[0], f[1], archShape(s, w, z0, zs, 8), 0.06)
  onWall(white, f[0], f[1], rectShape(s - 0.08, s + 0.08, z0, zs + w / 2 - 0.05), 0.08)
  onWall(white, f[0], f[1], rectShape(s - w / 2, s + w / 2, zs - 0.08, zs + 0.08), 0.08)
}
const SOUTH: F = [[X0, Y0], [X1, Y0]], NORTH: F = [[X1, Y1], [X0, Y1]]
const BAYS = [-20.2, -14.6, -9.4, 6.9, 12.1, 17.3]
for (const x of BAYS) arched(SOUTH, x - X0, 2.4, 2.6, 8.2)
for (const x of [...BAYS, -1.2]) arched(NORTH, X1 - x, 2.4, 2.6, 8.2)

// ── The west portico ──
{
  const WX0 = -32.4, WY = 8.1
  box(brick, -27.0, X0, -WY, WY, 0, 11.8, null, 0)
  box(grey, WX0, -27.0, -WY, WY, 10.0, 11.8, null, 0, true)
  cornice(grey, ccw([[WX0, -WY], [X0, -WY], [X0, WY], [WX0, WY]]), 11.2, 0.6, 0.3, null)
  gableBanded([[1, slate]], grey, WX0, X0, -WY, WY, 11.8, 16.2, 'x', 0.3, 0.25)
  box(white, WX0 - 1.2, -27.0, -WY, WY, 0, 2.0, white, 0.1) // the platform, on the ground there (1.7)
  for (const y of [-6.3, -2.1, 2.1, 6.3]) revolve(grey, [WX0 + 0.9, y], [[0.6, 2.0], [0.55, 9.6], [0.75, 10.0], [0, 10.0]], 12, 0, false, false)
  const WF: F = [[-27.0, WY], [-27.0, -WY]]
  onWall(white, WF[0], WF[1], archShape(WY, 2.6, 2.0, 5.0, 8), 0.03)
  onWall(slate, WF[0], WF[1], archShape(WY, 2.0, 2.0, 5.0, 8), 0.06)
}

// ── Appleton Chapel's east block ──
{
  const EX1 = 32.0, EY0 = -10.0, EY1 = 9.7
  box(brick, X1, EX1, EY0, EY1, 0, EAVE, null, 0)
  cornice(grey, ccw([[X1, EY0], [EX1, EY0], [EX1, EY1], [X1, EY1]]), EAVE - 1.4, 1.4, 0.3, null)
  gableBanded([[1, slate]], brick, X1 - 0.3, EX1, EY0, EY1, EAVE, 16.9, 'x', 0.4, 0.3)
  for (const s of [2.6, 7.9]) {
    arched([[X1, EY0], [EX1, EY0]], s, 2.0, 2.8, 7.6)
    arched([[EX1, EY1], [X1, EY1]], s, 2.0, 2.8, 7.6)
  }
  arched([[EX1, EY0], [EX1, EY1]], (EY1 - EY0) / 2, 2.6, 3.0, 8.0)
}

// ── The south portico ──
const PC = -1.5, PW = 7.2, PY0 = -23.5, PZ = 2.8, CAP = 9.7, PE = 11.9
{
  const ring = ccw([[PC - PW, PY0], [PC + PW, PY0], [PC + PW, Y0], [PC - PW, Y0]])
  // platform and steps
  box(white, PC - PW - 0.6, PC + PW + 0.6, PY0 - 0.6, Y0, 0, PZ, white, 0.05)
  for (let k = 0; k < 3; k++) box(white, PC - 10.5 + k * 0.4, PC + 10.5 - k * 0.4, PY0 - 2.4 + k * 0.6, PY0 - 0.6, 0, 2.4 + 0.1 * k, white, 0)
  // entablature: architrave, triglyph frieze, cornice; the pediment above
  box(grey, PC - PW, PC + PW, PY0, Y0, CAP, PE - 0.5, null, 0, true)
  cornice(grey, ring, PE - 0.6, 0.6, 0.35, null)
  for (let k = 0; k <= 12; k++) {
    const s = 0.5 + (k * (2 * PW - 1.0)) / 12
    onWall(slate, [PC + PW, PY0], [PC - PW, PY0], rectShape(s - 0.18, s + 0.18, CAP + 0.9, PE - 0.75), 0.03) // triglyph shadows
  }
  gableBanded([[1, slate]], grey, PC - PW, PC + PW, PY0, Y0 + 0.5, PE, 16.4, 'y', 0.3, 0.35)
  // pediment raking cornices in grey
  for (const sx of [-1, 1]) {
    const sec = (x: number, z: number): V3[] => [[x, PY0 - 0.45, z + 0.3], [x, PY0 + 0.2, z + 0.3], [x, PY0 + 0.2, z - 0.15], [x, PY0 - 0.45, z - 0.15]]
    grey.sweep([sec(PC + sx * (PW + 0.3), PE - 0.1), sec(PC, 16.6)])
  }
  // four Doric columns
  for (const k of [-1.5, -0.5, 0.5, 1.5]) { // 4.3 m centres
    const c: XY = [PC + k * 4.3, PY0 + 1.0]
    revolve(grey, c, [[0.75, PZ], [0.72, 5], [0.62, CAP - 0.5], [0.66, CAP - 0.4], [0.9, CAP - 0.05], [0.9, CAP], [0, CAP]], 12, 0, false, false)
  }
  // under the portico: the door with its fanlight and two windows
  const W: F = [[PC - PW, Y0], [PC + PW, Y0]]
  onWall(white, W[0], W[1], archShape(PW, 2.6, PZ, PZ + 3.4, 8), 0.03)
  onWall(slate, W[0], W[1], rectShape(PW - 1.0, PW + 1.0, PZ, PZ + 3.3), 0.06)
  onWall(win, W[0], W[1], archShape(PW, 2.0, PZ + 3.35, PZ + 3.4, 8), 0.06)
  for (const s of [PW - 3.9, PW + 3.9]) arched(W, s, 1.6, PZ + 1.4, PZ + 4.6)
  onWall(white, W[0], W[1], rectShape(PW - 1.7, PW + 1.7, PZ + 6.6, PZ + 7.8), 0.05) // the dedication tablet
}

// ── The steeple ──
const TC: XY = [-1.0, -15.0], TH = 3.75, TB = 28.4
box(brick, TC[0] - TH, TC[0] + TH, TC[1] - TH, TC[1] + TH, 0, TB, null, 0)
cornice(white, sq(TC, TH), TB - 0.8, 1.0, 0.5, white)
{
  const faces = (h: number): F[] => { const r = sq(TC, h); return [[r[0], r[1]], [r[1], r[2]], [r[2], r[3]], [r[3], r[0]]] }
  for (const f of faces(TH)) {
    if (f[0][1] === f[1][1] && f[0][1] > TC[1]) continue // the north face: behind the roof
    arched(f, TH, 1.5, 21.6, 24.6)
  }
  // pedestal stage with a balustrade and corner obelisks
  box(white, TC[0] - 3.35, TC[0] + 3.35, TC[1] - 3.35, TC[1] + 3.35, TB + 0.2, 31.0, white, 0.15)
  for (const f of faces(3.35)) onWall(grey, f[0], f[1], rectShape(0.9, 5.8, 29.4, 30.5), 0.03) // the balusters' shadow
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const c: XY = [TC[0] + sx * 3.05, TC[1] + sy * 3.05]
    box(white, c[0] - 0.3, c[0] + 0.3, c[1] - 0.3, c[1] + 0.3, 31.0, 31.6, white, 0.05)
    revolve(white, c, [[0.22, 31.6], [0.0, 35.2]], 4, Math.PI / 4, true, false)
  }
  // belfry: square, corner pilasters, a round-headed louvred opening a face
  box(white, TC[0] - 2.7, TC[0] + 2.7, TC[1] - 2.7, TC[1] + 2.7, 31.0, 37.0, null, 0)
  cornice(white, sq(TC, 2.7), 36.4, 0.6, 0.35, white)
  for (const f of faces(2.7)) {
    onWall(slate, f[0], f[1], archShape(2.7, 1.7, 32.0, 34.6, 8), 0.05)
    onWall(grey, f[0], f[1], rectShape(0, 0.5, 31.0, 36.4), 0.04)
    onWall(grey, f[0], f[1], rectShape(4.9, 5.4, 31.0, 36.4), 0.04)
  }
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const c: XY = [TC[0] + sx * 2.6, TC[1] + sy * 2.6]
    revolve(white, c, [[0.2, 37.0], [0.3, 37.4], [0.15, 37.8], [0, 38.0]], 6, 0, true, false)
  }
  // octagonal lantern with urns
  const R8 = 1 / Math.cos(Math.PI / 8)
  revolve(white, TC, [[2.15 * R8, 37.0], [2.15 * R8, 42.0], [2.45 * R8, 42.3], [2.45 * R8, 42.6], [0, 42.6]], 8, Math.PI / 8, true, false)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2, u: XY = [Math.cos(a), Math.sin(a)]
    const P = (t: number, z: number): V3 => [TC[0] + u[0] * 2.17 - u[1] * t, TC[1] + u[1] * 2.17 + u[0] * t, z]
    poly(slate, [P(-0.5, 38.2), P(0.5, 38.2), P(0.5, 40.6), P(0, 41.1), P(-0.5, 40.6)], [u[0], u[1], 0])
    const ua = a + Math.PI / 8, c: XY = [TC[0] + Math.cos(ua) * 2.2 * R8, TC[1] + Math.sin(ua) * 2.2 * R8]
    revolve(white, c, [[0.15, 42.6], [0.28, 43.1], [0.16, 43.6], [0, 44.0]], 6, 0, true, false)
  }
  // the spire, the gilt ball and finial
  revolve(white, TC, [[1.0 * R8, 42.6], [1.0 * R8, 43.4], [0.05, 58.0]], 8, Math.PI / 8, true, false)
  revolve(gilt, TC, [[0.05, 57.9], [0.3, 58.2], [0.36, 58.5], [0.3, 58.8], [0.06, 59.0], [0.06, 60.4], [0, 60.7]], 8, 0, true, false)
}

const lit = (p: V3) => (p[2] > TB - 1 ? 0.9 : 0)
await save('bos-harvard-memorial-church', 'Memorial Church', [
  { part: brick, material: finish('memchurch-brick', 0x9e5a48) },
  { part: white, material: { ...finish('memchurch-white', 0xf3efe6), floodlight: lit } },
  { part: grey, material: finish('memchurch-grey', 0xb8b2a6) },
  { part: slate, material: finish('memchurch-slate', 0x6f7880) },
  { part: win, material: PALETTE.window },
  { part: gilt, material: finish('memchurch-gilt', 0xc9a85a) },
], { height: 60.7, anchor: [42.3749104, -71.1160331], bearing: 13 })
void prism
