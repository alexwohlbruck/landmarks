/**
 * 360 Condominiums, 360 Nueces Street, Austin (2008, Mithun / Ziegler
 * Cooper) — original procedural geometry, CC0-1.0.
 * bun generators/atx-360-condominiums.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 17.9: Austin's street grid (Nueces Street runs
 * along y, 3rd/4th Streets along x). Anchor = area centroid of OSM
 * way/328839215 ("360 Condominiums"), -97.7497586, 30.2674128.
 *
 * Identity (from the photos): a slender light-blue glass tower, its long
 * east and west faces stacked with balconies in a sawtooth of angled bays
 * between white piers; the north end narrowing to an angled glass prow;
 * the south end a tall white blade (two white piers flanking a strip of
 * glass) that rises past the roof to a pointed top and a mast; a pale
 * stone parking podium wrapping the west and north, with a taller block
 * at the north end.
 *
 * Evidence and numbers:
 *  - lidar: USGS 3DEP USGS_LPC_TX_Central_B1_2017 (2017 flight), 1 m grid
 *    read in the frame. Ground: the lowest ground under the outline is the
 *    north-west corner, ~8 m over the grid's ground_min; the street on the
 *    south-east is ~2 m higher. Every height here = lidar - 8.
 *    Measured: the tower x 7..32, y -37..23.5 (lidar sits ~1.3 m east of
 *    OSM's east edge; OSM kept, so the tower is drawn x 5.7..30.7); the
 *    north end narrowing from 25 m wide at y 6 to ~4 m at y 23.5; the main
 *    roof 143-147 (drawn 145); a mechanical strip down the middle 149; the
 *    south blade's shoulders ~150-157 and its peak ~162-165 (drawn 152 ->
 *    162); the mast 173 (drawn 173). The north block x 6..31, y 22..42, 56
 *    m. The rest of the podium 29-36 (drawn 31), with a pool hole (not
 *    drawn).
 *  - published: 563 ft (171.6 m) to the top, 44 storeys, completed 2008
 *    (Wikipedia, "360 Condominiums"; OSM part way/328839141 height 172,
 *    44 levels). The mast's top is 171 m over the south-east street.
 *  - plan: the podium is OSM's outline; the tower is the lidar's, as above.
 *  - estimated from the photos: the sawtooth depth (1.3 m) and bay width
 *    (~5 m); the balcony lines (drawn every three storeys, 3.2 m floors);
 *    the blade's width (14 m with a 3.2 m glass strip); the podium window
 *    groups.
 *
 *  - the stone bases flanking the blade at the south end (24 m) follow the
 *    lidar's 22-30 m returns there and the "fitz" photo.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  x21   "360 Condominium Austin 2021-08-10.jpg", Xnatedawgx, CC BY-SA 4.0
 *        (the west face's balconies and the podium, looking up)
 *        https://commons.wikimedia.org/wiki/File:360_Condominium_Austin_2021-08-10.jpg
 *  lsm10 "360Condos-2010-08-a.JPG", LoneStarMike, CC BY-SA 3.0 (the south
 *        blade with its pointed top and mast, the west balconies)
 *        https://commons.wikimedia.org/wiki/File:360Condos-2010-08-a.JPG
 *  fitz  "360 Condos.JPG", M.Fitzsimmons, CC BY-SA 3.0 (the blade face on)
 *        https://commons.wikimedia.org/wiki/File:360_Condos.JPG
 *  sahm  "360Condominiums.JPG", Sahmeditor, CC BY-SA 3.0 (a long face whole,
 *        the roofline and mast) https://commons.wikimedia.org/wiki/File:360Condominiums.JPG
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the sawtooth is drawn as a regular 5 m tooth on both long faces;
 * the north prow's balconies are drawn as the same bands; the podium's
 * openings are generic window groups; the mast is not known to be lit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, windowVariant, finish } from './palette'
import { prism, wall, ccw, panels, edgePanels, box, save, type XY } from './atl-flatiron-building'

// ── Heights (m above the lowest ground) ──
const POD = 31
const NORTH = 56
const ROOF = 145
const BLADE_SH = 152
const BLADE_PK = 162
const MAST = 173

// ── Plan (bearing 17.9) ──
// OSM way/328839215 in the frame.
export const OUTLINE: XY[] = ccw([[-10.88, 41.9], [12.02, 41.86], [12.05, 43.06], [14.61, 43.07], [15.5, 44.22], [17.61, 44.19], [18.5, 43.1], [20.96, 43.11], [20.96, 42.01], [30.37, 42.08], [30.72, -33.95], [27.67, -36.76], [17.78, -36.34], [14.2, -36.32], [6.19, -36.03], [3.53, -32.94], [0.84, -32.98], [0.78, -34.36], [-6.56, -34.43], [-6.59, -37.82], [-25.95, -37.96], [-26.3, -20.04], [-26.01, -1.15], [-11.05, -1.06], [-11.16, 7.04]])

const CX = 18.2, HW = 12.5, XW = CX - HW, XE = CX + HW
const YS = -36.5, YN0 = 6 // the long faces run from the south chamfer to y 6
const TOOTH = 1.3, BAY = 5
// The long faces' sawtooth: from each pier the glass angles back in by TOOTH.
function sawFace(x: number, sgn: number, y0: number, y1: number): XY[] {
  const n = Math.round((y1 - y0) / BAY), w = (y1 - y0) / n, pts: XY[] = []
  for (let k = 0; k < n; k++) {
    const ya = y0 + k * w
    pts.push([x, ya], [x - sgn * TOOTH, ya + 0.05])
  }
  return pts
}
// East face runs south→north (counter-clockwise), the west face north→south.
const east = sawFace(XE, 1, -33.5, YN0)
const westS = sawFace(XW, -1, -33.5, YN0)
const TOWER: XY[] = ccw([
  [XW + 3, YS], [XE - 3, YS], [XE, -33.5],
  ...east.slice(2), [XE, YN0],
  [CX + 6.2, 18], [CX + 2, 23.5], [CX - 2, 23.5], [CX - 6.2, 18],
  [XW, YN0], ...westS.slice(2).reverse().map(([x, y]) => [x, y] as XY), [XW, -33.5],
])

const glass = new Part(), trim = new Part(), stone = new Part(), roof = new Part(), podWin = new Part(), balc = new Part()

// ── Podium and the north block: pale stone with grouped window openings ──
// the podium west of the tower (OSM's outline, cut at the tower's west face)
const PODW: XY[] = ccw([[-10.88, 41.9], [-11.16, 7.04], [-11.05, -1.06], [-26.01, -1.15], [-26.3, -20.04], [-25.95, -37.96], [-6.59, -37.82], [-6.56, -34.43], [0.78, -34.36], [0.84, -32.98], [3.53, -32.94], [XW, -35.6], [XW, 41.9]])
prism(stone, PODW, 0, POD, roof, 0.45)
panels(podWin, PODW, 4, POD - 2.5, { group: 6.4, gap: 1.6, bay: 4.5, pier: 1.4, margin: 1.2, min: 4 })
prism(stone, ccw([[XW, 22], [30.5, 22], [30.37, 42.08], [20.96, 42.01], [20.96, 43.11], [12.05, 43.06], [12.02, 41.86], [XW, 41.9]]), 0, NORTH, roof, 0.45)
for (const [a, b] of [[[30.37, 22], [30.37, 42]], [[30.37, 42], [XW, 42]], [[XW, 42], [XW, 22]]] as [XY, XY][])
  edgePanels(podWin, a, b, POD + 1, NORTH - 3, { group: 9.6, gap: 1.6, bay: 4.2, pier: 1.2, margin: 1.5 })
box(trim, XW - 0.3, 30.67, 21.7, 42.3, NORTH - 1.2, NORTH, roof, 0.3)

// ── The tower ──
wall(glass, TOWER, 0, ROOF - 3)
prism(trim, TOWER, ROOF - 3, ROOF, roof, 0.4) // the white parapet band
// mechanical strip
box(roof, CX - 3, CX + 3, -9, 5, ROOF, ROOF + 4, roof, 0.4)

// white piers at each sawtooth step, full height above the podium
for (const [face, sgn] of [[east, 1], [westS, -1]] as [XY[], number][]) {
  for (let i = 0; i < face.length; i += 2) {
    const [x, y] = face[i]
    const xo = x + sgn * 0.7, xi = x - sgn * TOOTH
    box(trim, Math.min(xo, xi), Math.max(xo, xi), y - 0.4, y + 0.4, 6, ROOF - 3, trim, 0.25)
  }
  // the balcony stacks: one per bay, a broad pale column of stacked balconies
  // standing out of the angled glass (they read as vertical grey strips)
  for (let i = 0; i < face.length; i += 2) {
    const [x, y] = face[i], y1 = i + 2 < face.length ? face[i + 2][1] : YN0
    const xi = x - sgn * TOOTH * 0.5, xo = x + sgn * 0.6
    box(balc, Math.min(xi, xo), Math.max(xi, xo), y + 1.6, y1 - 1.6, POD, ROOF - 3.5, balc, 0.3)
  }
  // the balcony slabs along the face, every three storeys (the piers stand through them)
  for (let z = POD + 3.2; z < ROOF - 6; z += 9.6) {
    const x = face[0][0], x0 = x - sgn * TOOTH * 0.6, x1 = x + sgn * 0.9
    box(balc, Math.min(x0, x1), Math.max(x0, x1), -33.3, YN0 - 0.2, z - 0.35, z + 0.35, balc, 0, true)
  }
}
// balcony slabs across the north prow
for (let z = POD + 3.2; z < ROOF - 6; z += 9.6) {
  for (const s of [1, -1]) {
    const a: XY = [CX + s * HW, YN0], b: XY = [CX + s * 6.2, 18]
    const t: XY = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(t[0], t[1]), n: XY = [(s * t[1]) / L, (-s * t[0]) / L]
    const o = 1.2
    const ring: XY[] = ccw([[a[0], a[1]], [b[0], b[1]], [b[0] + n[0] * o, b[1] + n[1] * o], [a[0] + n[0] * o, a[1] + n[1] * o]])
    prism(balc, ring, z - 0.35, z + 0.35, balc, 0, true)
  }
}

// ── The south blade: two white piers and a glass strip, rising to a point ──
/** A planar quad wound to face `n` (Part.tri flips it to agree with the normal). */
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  p.tri(a, c, d, undefined, undefined, undefined, [n, n, n])
}
const nrm = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l] }
{
  const x0 = CX - 7, x1 = CX + 7, y0 = YS - 1.6, y1 = YS + 3
  const zt = (x: number) => BLADE_SH + (BLADE_PK - BLADE_SH) * (1 - Math.abs(x - CX) / 7)
  // front and back faces (pentagons), sides, and the two sloping tops
  for (const [y, s] of [[y0, -1], [y1, 1]] as [number, number][]) {
    quadN(trim, [x0, y, 0], [CX, y, 0], [CX, y, zt(CX)], [x0, y, zt(x0)], [0, s, 0])
    quadN(trim, [CX, y, 0], [x1, y, 0], [x1, y, zt(x1)], [CX, y, zt(CX)], [0, s, 0])
  }
  quadN(trim, [x0, y0, 0], [x0, y1, 0], [x0, y1, zt(x0)], [x0, y0, zt(x0)], [-1, 0, 0])
  quadN(trim, [x1, y0, 0], [x1, y1, 0], [x1, y1, zt(x1)], [x1, y0, zt(x1)], [1, 0, 0])
  const dz = BLADE_PK - BLADE_SH
  quadN(trim, [x0, y0, zt(x0)], [CX, y0, zt(CX)], [CX, y1, zt(CX)], [x0, y1, zt(x0)], nrm([-dz, 0, 7]))
  quadN(trim, [CX, y0, zt(CX)], [x1, y0, zt(x1)], [x1, y1, zt(x1)], [CX, y1, zt(CX)], nrm([dz, 0, 7]))
  // the glass strip up the blade's face, in groups of three storeys
  const gw = 1.6
  for (let z = 6; z < BLADE_SH - 6; z += 9.6) {
    const zb = Math.min(z + 8.6, BLADE_SH - 4)
    quadN(glass, [CX - gw, y0 - 0.05, z], [CX + gw, y0 - 0.05, z], [CX + gw, y0 - 0.05, zb], [CX - gw, y0 - 0.05, zb], [0, -1, 0])
  }
  // the mast
  box(trim, CX - 0.5, CX + 0.5, y0 + 1, y0 + 2, BLADE_PK - 1, MAST, trim, 0.2)
}

// stone bases flanking the blade at the south end (lidar 22-30 m, the fitz photo)
for (const [a, b] of [[XW - 0.3, CX - 7], [CX + 7, XE + 0.3]]) {
  box(stone, a, b, YS - 0.3, YS + 5, 0, 24, roof, 0.4)
  edgePanels(podWin, [a, YS - 0.3], [b, YS - 0.3], 6, 22, { group: 6.4, gap: 2.4, bay: 3, pier: 2, margin: 1.6 })
}

if (import.meta.main) {
  await save('atx-360-condominiums', '360 Condominiums', [
    { part: glass, material: { ...PALETTE.window, color: 0x93acc4 } },
    { part: podWin, material: windowVariant(2, 0x66798b) },
    { part: trim, material: PALETTE.trim },
    { part: stone, material: { ...PALETTE.stone, color: 0xe9e2d4 } },
    { part: balc, material: finish('balcony', 0xb5b0a7) },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 17.9, height: MAST, replaces: ['way/328839215', 'way/328839141', 'way/516271605', 'way/972380479', 'way/972380480', 'way/972380481'] }, 6500)
}
