/**
 * Bishop's Palace (the Walter Gresham House), 1402 Broadway, Galveston
 * (1886-93, Nicholas J. Clayton) — original procedural geometry, CC0-1.0,
 * no textures.
 * bun generators/hou-bishops-palace.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Built turned to Galveston's street grid: catalog bearing 345
 * (Broadway runs 15 degrees north of east here; NAIP, and the OSM
 * outline's walls at 344-347 degrees). Model -y is the Broadway front,
 * +x the 14th Street side. Anchor = centroid of the OSM outline
 * way/56044910, -94.7821595, 29.3030730.
 *
 * Identity, in order: the round south-east tower with its arcaded
 * belvedere, frieze and tall red-tile cone; the steep central red-tile
 * roof with the tall front dormer gable over the entrance; the
 * south-west pavilion with its steep octagonal tile roof and front gable;
 * the tall stone chimneys; the iron verandas wrapping the front at
 * second-floor level; the buff and pink-grey stone walls over a raised
 * rusticated basement; the glass solarium on the east side.
 *
 * Evidence
 * - Plan and heights: HABS TX-2103 (Historic American Buildings Survey,
 *   1967, public domain), sheets 3 (first floor plan), 4 (second floor),
 *   6 (attic and roof plan), 7, 8, 9 (south, east, west elevations),
 *   10 (section); measured off the sheets at their scale bars:
 *   https://commons.wikimedia.org/wiki/File:Colonel_Walter_Gresham_House,_1402_Broadway,_Galveston,_Galveston_County,_TX_HABS_TEX,84-GALV,26-_(sheet_7_of_11).png
 *   (and sheets 3, 4, 6, 8, 9 of the same set). In this frame: main block
 *   x -14.6..11.6, front at y -11.0 (pavilion) / -8.2 (library), rear
 *   wing to y 13.5; tower centre (5.8, -6.9), radius 3.0. Heights above
 *   the ground line: basement 2.6, porch roofs 7.6, main cornice 14.0-14.5,
 *   rear wing 12.6 (ridge 16.3), pavilion cornice 16.4 and roof 20.8,
 *   dormer gable 19.9, west and east gables 17.7 / 18.3, central roof
 *   ridge 22.5, stair-hall roof 23.1, tower cornice 19.1, cone apex 25.4,
 *   finial 26.4, chimneys 21.5-23.8.
 * - Lidar: USGS 3DEP TX_Coastal_B3_2018 (flown 2018), 0.5 m grid, checks
 *   the HABS figures: footprint x -15..12, y -11..14.5 in this frame;
 *   central roof 21-22.3 m and the tower top 26.3 m above the ground.
 * - Colours sampled from several photos (overcast and sun): walls
 *   #a99980 / #ac997b (Highsmith), #9c9175 (Farragutful), drawn #cfc0a2;
 *   the cream sandstone bands, lighter, drawn #e6dac2; tile roofs #937e73
 *   / #907b7a (cone), #6e5d59 / #827264 (roofs, overcast), red in sun
 *   (Farragutful 02), drawn #a5675a; iron verandas near black, drawn
 *   #4d4a4a (charcoal).
 *
 * Photos (all evidence):
 *  - "Bishop's Palace," ... LCCN2013650800.tif and LCCN2013650798.tif,
 *    Carol M. Highsmith, public domain (south front; south-east)
 *    https://commons.wikimedia.org/wiki/File:%22Bishop%27s_Palace,%22_also_known_as_Gresham%27s_Castle,_an_ornate_Victorian-style_house,_located_on_Broadway_and_14th_Street_in_the_East_End_Historic_District_of_Galveston,_Texas_LCCN2013650800.tif
 *    https://commons.wikimedia.org/wiki/File:%22Bishop%27s_Palace,%22_also_known_as_Gresham%27s_Castle,_an_ornate_Victorian-style_house,_located_on_Broadway_and_14th_Street_in_the_East_End_Historic_District_of_Galveston,_Texas_LCCN2013650798.tif
 *  - Bishop's Palace - Galveston 02.jpg and 03.jpg, Farragutful,
 *    CC BY-SA 4.0 (south-east corner and tower; the east side)
 *    https://commons.wikimedia.org/wiki/File:Bishop%27s_Palace_-_Galveston_02.jpg
 *    https://commons.wikimedia.org/wiki/File:Bishop%27s_Palace_-_Galveston_03.jpg
 *  - Galveston March 2022 25 (Bishop's Palace).jpg, Michael Barera,
 *    CC BY-SA 4.0 (south, across Broadway)
 *    https://commons.wikimedia.org/wiki/File:Galveston_March_2022_25_(Bishop%27s_Palace).jpg
 *  - WEST AND PRINCIPAL (SOUTH) SIDES ... HABS TEX,84-GALV,26-4.tif,
 *    HABS, public domain (south-west)
 *    https://commons.wikimedia.org/wiki/File:WEST_AND_PRINCIPAL_(SOUTH)_SIDES_-_Colonel_Walter_Gresham_House,_1402_Broadway,_Galveston,_Galveston_County,_TX_HABS_TEX,84-GALV,26-4.tif
 *  - Bishop's palace side.jpg, Laura Scudder, CC BY-SA 3.0 (east)
 *    https://commons.wikimedia.org/wiki/File:Bishop%27s_palace_side.jpg
 *  USGS NAIP for the plan and the grid's bearing. Published: 1886-1893,
 *  Nicholas J. Clayton, for Col. Walter Gresham; NRHP and NHL (Wikipedia).
 *  No commercial imagery.
 *
 * Left out: carved ornament, the horses and finials on the gables, the
 * iron railings and brackets, mullions, the porch steps' balustrades,
 * the rear slate steps, the back stair, the dormers' small gablets.
 *
 * Doubts: the north side (no photo; drawn from the HABS plans as plain
 * walls with windows); the rear wing's roof is simplified to a hip; the
 * window counts on the east and west sides are approximate; the HABS
 * drawings date from 1967 (the house is little changed since, per the
 * photos). Night: lit windows only; no licensed night photo was found.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, lathe, panel, rect, save, spire, walls, chamfer, type XY } from './chi-aon-center'

const wall = new Part(), trim = new Part(), tile = new Part(), win = new Part(), iron = new Part(), glass = new Part()

/** A triangle or quad wound to face along n. */
function oriented(p: Part, pts: V3[], n: V3) {
  const [a, b, c] = pts
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const g = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  const q = g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0 ? pts : [...pts].reverse()
  if (q.length === 3) p.tri(q[0], q[1], q[2]); else p.quad(q[0], q[1], q[2], q[3])
}

/** A walled block with a cornice band; returns its ring. */
function block(r: XY[], z0: number, z1: number, cornice = true, top = true) {
  walls(wall, r, z0, z1)
  if (top) cap(tile, r, z1)
  if (cornice) {
    const o = outset(r, 0.25)
    walls(trim, o, z1 - 0.6, z1)
    ringUp(o, r, z1)
    ringDown(o, r, z1 - 0.6)
  }
  // the basement string course
  if (z0 <= 0.01) { const o = outset(r, 0.12); walls(trim, o, 2.4, 2.75); ringUp(o, r, 2.75); ringDown(o, r, 2.4) }
  return r
}
function outset(r: XY[], d: number): XY[] {
  const n = r.length
  const nrm = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l] }
  return r.map((c, i) => {
    const n1 = nrm(r[(i - 1 + n) % n], c), n2 = nrm(c, r[(i + 1) % n])
    const k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    return [c[0] + (n1[0] + n2[0]) / Math.max(k, 0.2) * d, c[1] + (n1[1] + n2[1]) / Math.max(k, 0.2) * d] as XY
  })
}
function ringUp(o: XY[], i: XY[], z: number, p = trim) {
  for (let k = 0; k < o.length; k++) {
    const j = (k + 1) % o.length
    p.quad([o[k][0], o[k][1], z], [o[j][0], o[j][1], z], [i[j][0], i[j][1], z], [i[k][0], i[k][1], z])
  }
}
function ringDown(o: XY[], i: XY[], z: number, p = trim) {
  for (let k = 0; k < o.length; k++) {
    const j = (k + 1) % o.length
    p.quad([o[k][0], o[k][1], z], [i[k][0], i[k][1], z], [i[j][0], i[j][1], z], [o[j][0], o[j][1], z])
  }
}

/** A hip roof over x0..x1, y0..y1 (overhang o) from z0 to a ridge at z1 along the longer axis (or `along`). */
function hip(x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, o = 0.4, along?: 'x' | 'y', ridgeLen?: number) {
  x0 -= o; y0 -= o; x1 += o; y1 += o
  const ax = along ?? (x1 - x0 >= y1 - y0 ? 'x' : 'y')
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  const A: V3 = [x0, y0, z0], B: V3 = [x1, y0, z0], C: V3 = [x1, y1, z0], D: V3 = [x0, y1, z0]
  let R0: V3, R1: V3
  if (ax === 'x') {
    const h = ridgeLen !== undefined ? ridgeLen / 2 : Math.max(0, (x1 - x0 - (y1 - y0)) / 2)
    R0 = [cx - h, cy, z1]; R1 = [cx + h, cy, z1]
    oriented(tile, [A, B, R1, R0], [0, -1, 1]); oriented(tile, [C, D, R0, R1], [0, 1, 1])
    oriented(tile, [B, C, R1], [1, 0, 1]); oriented(tile, [D, A, R0], [-1, 0, 1])
  } else {
    const h = ridgeLen !== undefined ? ridgeLen / 2 : Math.max(0, (y1 - y0 - (x1 - x0)) / 2)
    R0 = [cx, cy - h, z1]; R1 = [cx, cy + h, z1]
    oriented(tile, [B, C, R1, R0], [1, 0, 1]); oriented(tile, [D, A, R0, R1], [-1, 0, 1])
    oriented(tile, [A, B, R0], [0, -1, 1]); oriented(tile, [C, D, R1], [0, 1, 1])
  }
  // soffit, so the overhang is not see-through from below
  oriented(tile, [A, B, C, D], [0, 0, -1])
}

/** A gable roof with its ridge along x over x0..x1 (gable ends in wall stone), y0..y1, overhang o. */
function gableX(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, o = 0.4, ends: [boolean, boolean] = [true, true]) {
  const cy = (y0 + y1) / 2
  const e0 = x0 - (ends[0] ? 0.3 : 0), e1 = x1 + (ends[1] ? 0.3 : 0)
  oriented(tile, [[e0, y0 - o, z0], [e1, y0 - o, z0], [e1, cy, z1], [e0, cy, z1]], [0, -1, 1])
  oriented(tile, [[e0, y1 + o, z0], [e1, y1 + o, z0], [e1, cy, z1], [e0, cy, z1]], [0, 1, 1])
  oriented(tile, [[e0, y0 - o, z0], [e1, y0 - o, z0], [e1, y1 + o, z0], [e0, y1 + o, z0]], [0, 0, -1])
  if (ends[0]) oriented(wall, [[x0, y0, z0], [x0, y1, z0], [x0, cy, z1]], [-1, 0, 0])
  if (ends[1]) oriented(wall, [[x1, y0, z0], [x1, y1, z0], [x1, cy, z1]], [1, 0, 0])
}

/** A gabled bay facing -y: walls over xc±w/2, yf..yf+d from zb to ze, gable to za, ridge running back. */
function dormerS(xc: number, w: number, yf: number, d: number, zb: number, ze: number, za: number) {
  const x0 = xc - w / 2, x1 = xc + w / 2, y1 = yf + d
  walls(wall, rect(x0, yf, x1, y1), zb, ze)
  oriented(wall, [[x0, yf, ze], [x1, yf, ze], [xc, yf, za]], [0, -1, 0])
  const o = 0.35, f = yf - 0.3
  oriented(tile, [[x0 - o, f, ze - 0.25], [xc, f, za + 0.25], [xc, y1, za + 0.25], [x0 - o, y1, ze - 0.25]], [-1, 0, 1])
  oriented(tile, [[x1 + o, f, ze - 0.25], [xc, f, za + 0.25], [xc, y1, za + 0.25], [x1 + o, y1, ze - 0.25]], [1, 0, 1])
  oriented(tile, [[x0 - o, f, ze - 0.25], [x1 + o, f, ze - 0.25], [x1 + o, y1, ze - 0.25], [x0 - o, y1, ze - 0.25]], [0, 0, -1])
  // a stone coping on the gable's rakes
  for (const s of [-1, 1]) {
    const xe = xc + s * (w / 2 + 0.15)
    oriented(trim, [[xe, yf - 0.32, ze - 0.1], [xc, yf - 0.32, za + 0.35], [xc, yf - 0.32, za - 0.1], [xe, yf - 0.32, ze - 0.55]], [0, -1, 0])
  }
}

/** A window panel on the wall a→b of a counter-clockwise ring. */
const W = (a: XY, b: XY, s: number, w: number, z0: number, z1: number, p = win) => panel(p, a, b, s - w / 2, s + w / 2, z0, z1, 0.05)
/** The same on a south face (y = yf) at x = xc. */
const WS = (yf: number, xc: number, w: number, z0: number, z1: number, p = win) => panel(p, [-100, yf], [100, yf], xc + 100 - w / 2, xc + 100 + w / 2, z0, z1, 0.05)
const WN = (yf: number, xc: number, w: number, z0: number, z1: number) => panel(win, [100, yf], [-100, yf], 100 - xc - w / 2, 100 - xc + w / 2, z0, z1, 0.05)
const WE = (xf: number, yc: number, w: number, z0: number, z1: number) => panel(win, [xf, -100], [xf, 100], yc + 100 - w / 2, yc + 100 + w / 2, z0, z1, 0.05)
const WW = (xf: number, yc: number, w: number, z0: number, z1: number) => panel(win, [xf, 100], [xf, -100], 100 - yc - w / 2, 100 - yc + w / 2, z0, z1, 0.05)

const G1: [number, number] = [3.4, 6.6], G2: [number, number] = [8.4, 11.6], G3: [number, number] = [12.2, 13.6], BS: [number, number] = [0.7, 1.9]

// ---- main blocks ------------------------------------------------------------
// the rear cross band (music room, stair hall, dining room)
block(rect(-14.6, -0.68, 11.6, 4.99), 0, 14.0)
// the front block (parlor, entrance hall, library)
block(rect(-10.35, -8.17, 5.85, -0.68), 0, 14.5)
// the south-west pavilion, rising to 16.4, chamfered front corners
const pav: XY[] = [[-10.35, -9.6], [-9.5, -11.0], [-5.33, -11.0], [-4.48, -9.6], [-4.48, -6.0], [-10.35, -6.0]]
block(pav, 0, 16.4)
// the entrance bay
block(rect(-4.3, -8.98, 0.5, -6.0), 0, 12.0)
// the rear (kitchen) wing
block(rect(-1.04, 4.99, 10.6, 13.49), 0, 12.6)

// ---- roofs ------------------------------------------------------------------
// the steep central roof: eave 14.5, ridge 22.5 running east-west
hip(-6.0, -7.9, 7.2, 3.6, 14.5, 22.5, 0.3, 'x', 3.6)
// west wing: gable to the west at 17.7
gableX(-14.6, -6.0, -0.68, 4.99, 14.0, 17.7, 0.4, [true, false])
// east wing: gable to the east at 18.3
gableX(7.2, 11.6, -0.68, 4.99, 14.0, 18.3, 0.4, [false, true])
// the parlor's rear bay, behind the pavilion
hip(-10.35, -6.0, -6.0, -0.68, 14.5, 16.6, 0.3)
// rear wing hip, ridge 16.3
hip(-1.04, 4.99, 10.6, 13.49, 12.6, 16.3, 0.4)
// the pavilion's steep octagonal roof, and the gable on its front
lathe(tile, -7.41, -8.5, [[3.55, 16.2], [0.0, 20.8]], 8, Math.PI / 8)
lathe(trim, -7.41, -8.5, [[0.22, 20.6], [0.22, 21.3], [0.0, 21.6]], 6)
dormerS(-7.41, 4.4, -11.0, 2.6, 16.4, 16.4, 18.8)
// the tall front dormer over the entrance
block(rect(-4.1, -8.98, 0.7, -5.5), 12.0, 17.2, true, false)
dormerS(-1.7, 4.8, -8.98, 3.6, 17.2, 17.2, 19.9)
// the south gable on the west wing and on the east wing
dormerS(-12.4, 3.4, -0.68, 2.4, 14.0, 14.0, 17.4)
dormerS(9.4, 3.4, -0.68, 2.4, 14.0, 14.0, 17.4)
// the stair hall's octagonal roof behind the central roof
lathe(wall, -1.98, 4.04, [[3.0, 14.0], [3.0, 16.4]], 8, Math.PI / 8)
lathe(tile, -1.98, 4.04, [[3.35, 16.3], [0.0, 23.1]], 8, Math.PI / 8)
lathe(trim, -1.98, 4.04, [[0.2, 22.9], [0.2, 23.6], [0.0, 23.9]], 6)

// ---- the round tower --------------------------------------------------------
{
  const cx = 5.8, cy = -6.9
  lathe(wall, cx, cy, [[3.0, 0], [3.0, 14.4]], 16)
  lathe(trim, cx, cy, [[3.0, 2.4], [3.12, 2.4], [3.12, 2.75], [3.0, 2.75]], 16)
  lathe(trim, cx, cy, [[3.0, 14.1], [3.2, 14.1], [3.2, 14.6], [2.85, 14.6]], 16)
  // the belvedere: dark arcade behind columns, arches above
  lathe(win, cx, cy, [[2.6, 14.6], [2.6, 17.3]], 16)
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * 2 * Math.PI + Math.PI / 16
    lathe(wall, cx + 2.72 * Math.cos(a), cy + 2.72 * Math.sin(a), [[0.3, 14.6], [0.3, 17.3]], 6)
  }
  lathe(wall, cx, cy, [[2.85, 17.2], [2.85, 18.0]], 16)
  lathe(trim, cx, cy, [[2.85, 18.0], [3.05, 18.0], [3.05, 18.9], [3.3, 18.9], [3.3, 19.2], [3.1, 19.2]], 16)
  // the cone and its finial
  lathe(tile, cx, cy, [[3.25, 19.1], [0.0, 25.4]], 16)
  lathe(iron, cx, cy, [[0.3, 25.0], [0.38, 25.6], [0.12, 26.0], [0.0, 26.4]], 8)
  // windows on the round wall, facing south round to east
  for (const deg of [-112.5, -67.5, -22.5, 22.5]) {
    const a = (deg * Math.PI) / 180, d = 0.17, r = 3.04
    const P = (t: number, z: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
    for (const [z0, z1] of [G1, G2, BS]) win.quad(P(a - d, z0), P(a + d, z0), P(a + d, z1), P(a - d, z1))
  }
}
// the slim corbelled turret beside it
lathe(wall, 3.0, -8.15, [[0.1, 11.4], [0.75, 12.3], [0.75, 22.3], [0.9, 22.3], [0.9, 22.7], [0.7, 22.9], [0.4, 23.6], [0.0, 23.9]], 10)

// ---- chimneys ---------------------------------------------------------------
for (const [x, y, w, d, top] of [
  [-10.7, -4.0, 1.25, 0.85, 23.8], [11.4, 2.65, 0.9, 1.3, 23.5], [7.9, 12.9, 1.1, 0.8, 21.7],
  [-0.9, 8.0, 1.0, 1.0, 21.5], [6.6, -3.6, 1.0, 0.85, 21.7],
] as [number, number, number, number, number][]) {
  // a slender stone stack, a flared cap and a short pinnacle top
  const r = rect(x - w / 2, y - d / 2, x + w / 2, y + d / 2)
  walls(wall, r, 12.0, top - 1.6)
  const o = outset(r, 0.2)
  walls(trim, o, top - 1.6, top - 1.0)
  ringDown(o, r, top - 1.6)
  ringUp(o, r, top - 1.0)
  walls(wall, r, top - 1.0, top - 0.5)
  spire(trim, r, top - 0.5, [x, y, top])
}

// ---- verandas (iron, at the second floor) -----------------------------------
function porch(r: XY[], posts: XY[]) {
  walls(wall, r, 0, 2.6)
  cap(trim, r, 2.6)
  const o = r
  walls(iron, o, 7.3, 7.7)
  cap(iron, o, 7.7)
  cap(iron, o, 7.3, false)
  for (const [x, y] of posts) {
    const q = rect(x - 0.13, y - 0.13, x + 0.13, y + 0.13)
    walls(iron, q, 2.6, 7.3)
  }
}
// west porch, rounded at its south-west corner
porch([[-14.4, -7.0], [-13.4, -7.9], [-10.35, -7.9], [-10.35, -0.68], [-14.4, -0.68]],
  [[-14.3, -1.0], [-14.3, -4.0], [-13.6, -7.6], [-11.0, -7.8]])
// the front and east veranda, curving round the tower
porch([[-4.6, -10.4], [3.0, -10.4], [6.0, -11.0], [8.6, -10.5], [10.6, -9.0], [11.45, -6.8], [11.45, -0.68], [5.85, -0.68], [5.85, -8.17], [-4.6, -8.17]],
  [[-4.4, -10.2], [-0.9, -10.2], [2.6, -10.2], [5.8, -10.8], [8.5, -10.3], [10.5, -8.9], [11.3, -6.5], [11.3, -3.6], [11.3, -0.9]])
// the entrance steps, a stone wedge down to the walk
{
  const x0 = -3.3, x1 = -0.9, yt = -10.4, yb = -13.6, zt = 2.6
  // the bottom step is a 0.45 m riser, so the drape cannot bury the flight's foot
  const zb = 0.45
  oriented(wall, [[x0, yb, zb], [x1, yb, zb], [x1, yt, zt], [x0, yt, zt]], [0, -1, 1.2])
  oriented(wall, [[x0, yb, 0], [x1, yb, 0], [x1, yb, zb], [x0, yb, zb]], [0, -1, 0])
  for (const x of [x0, x1]) oriented(wall, [[x, yb, 0], [x, yt, 0], [x, yt, zt], [x, yb, zb]], [x === x0 ? -1 : 1, 0, 0])
  for (const x of [x0 - 0.45, x1 + 0.45]) block(rect(x - 0.4, yb + 0.2, x + 0.4, yb + 1.0), 0, 1.6, false)
}

// ---- the solarium (east) ----------------------------------------------------
{
  const cy = 2.16, r = 2.54, x0 = 11.6, xc = 14.2
  const D: XY[] = [[x0, cy - r]]
  for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 + (i / 8) * Math.PI; D.push([xc + r * Math.cos(a), cy + r * Math.sin(a)]) }
  D.push([x0, cy + r])
  walls(wall, D, 0, 2.8)
  cap(trim, D, 2.8)
  walls(glass, D, 2.8, 6.3)
  const o = outset(D, 0.3)
  walls(iron, o, 6.1, 6.4)
  ringDown(o, D, 6.1, iron)
  spire(iron, o, 6.4, [13.6, cy, 8.9])
  lathe(iron, 13.6, cy, [[0.15, 8.7], [0.15, 9.4], [0.0, 9.6]], 6)
}

// ---- windows ----------------------------------------------------------------
// south: pavilion front (paired, three floors and the attic trio)
for (const x of [-8.15, -6.65]) for (const g of [G1, G2]) WS(-11.0, x, 1.15, g[0], g[1])
WS(-11.0, -7.41, 2.6, 12.6, 14.9)
WS(-11.0, -7.41, 1.6, 17.0, 17.9)
WS(-11.0, -7.41, 2.4, BS[0], BS[1])
// entrance: the door, the arched window over it, the dormer's tall window
WS(-8.98, -2.0, 1.9, 2.75, 6.6, iron)
WS(-8.98, -2.0, 1.8, G2[0], G2[1])
WS(-8.98, -1.7, 1.8, 13.0, 16.6)
// library front
for (const x of [1.0, 2.0]) for (const g of [G1, G2]) WS(-8.17, x, 0.8, g[0], g[1])
// the west wing's south face, above and below the west porch roof
for (const x of [-13.4, -11.6]) { WS(-0.68, x, 1.1, G2[0], G2[1]); WS(-0.68, x, 1.1, G1[0], G1[1]) }
WS(-0.68, -12.4, 1.5, 14.6, 16.3)
// the east wing's south face, behind the veranda
for (const x of [7.5, 9.4, 11.0]) { WS(-0.68, x, 1.1, G2[0], G2[1]); WS(-0.68, x, 1.1, G1[0], G1[1]) }
WS(-0.68, 9.4, 1.5, 14.6, 16.3)
// basement windows along the front
for (const x of [-13.0, -11.6, 0.8, 2.6, 8.0, 10.0]) WS(x < 0 ? -0.68 : -8.17, x, 0.8, BS[0], BS[1])
// west faces
for (const y of [0.8, 3.5]) for (const g of [G1, G2]) WW(-14.6, y, 1.1, g[0], g[1])
WW(-14.6, 2.15, 1.6, 14.5, 16.4)
for (const y of [-5.2, -3.0]) for (const g of [G1, G2, G3]) WW(-10.35, y, 1.1, g[0], g[1])
for (const y of [-8.6]) for (const g of [G1, G2]) WW(-10.35, y, 0.9, g[0], g[1])
for (const y of [7.3, 11.0]) for (const g of [G1, G2]) WW(-1.04, y, 1.1, g[0], g[1])
// east faces: the east wing either side of the solarium, the gable's pair, the rear wing
for (const y of [-0.1, 4.5]) WE(11.6, y, 0.9, G2[0], G2[1])
for (const y of [1.4, 2.9]) WE(11.6, y, 0.9, G2[0] + 0.4, G2[1] + 0.9)
WE(11.6, 2.15, 1.8, 14.6, 16.0)
for (const y of [6.8, 9.2, 11.6]) for (const g of [G1, G2]) WE(10.6, y, 1.1, g[0], g[1] - 0.6)
// north faces
for (const x of [0.6, 3.5, 6.4, 9.2]) for (const g of [G1, G2]) WN(13.49, x, 1.1, g[0], g[1] - 0.6)
for (const x of [-13.0, -10.4, -7.6]) for (const g of [G1, G2]) WN(4.99, x, 1.1, g[0], g[1])

void chamfer
if (import.meta.main) {
  await save('hou-bishops-palace', "Bishop's Palace", [29.303073, -94.7821595], 345, [
    { part: wall, material: finish('galveston-stone', 0xcfc0a2) },
    { part: trim, material: finish('cream-sandstone', 0xe6dac2) },
    { part: tile, material: finish('red-tile', 0xa5675a) },
    { part: win, material: PALETTE.window },
    { part: iron, material: finish('iron', 0x4d4a4a) },
    { part: glass, material: PALETTE.glass },
  ], 6500)
}
