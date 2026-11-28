/**
 * Bexar County Courthouse, 100 Dolorosa Street, San Antonio, Texas. The
 * 1892-1896 Romanesque Revival courthouse by J. Riely Gordon faces north
 * onto Main Plaza: rock-faced red sandstone on a red granite base, the tall
 * east tower with its bullet-shaped tiled dome on a round drum over an
 * arcaded belfry, the west
 * tower with an open belvedere under a steep green-tile pyramid, the arched
 * entrance porch with its loggia and two small domed turrets, green-tile hip
 * roofs. The 1914-1927 additions run 120 m south behind it, ending in a
 * second front on Nueva Street with a belvedere tower (west) and another
 * green-tile pyramid (east). OSM maps the whole complex as one outline, so the
 * model draws all of it. Original procedural geometry, CC0-1.0.
 *   bun generators/sat-bexar-county-courthouse.ts
 *
 * Frame: bearing 7.7 (the OSM outline is square to 0.1 m in it). x east-ish,
 * y north-ish, z up, metres. Drawn about the lidar grid's centre (-98.49366,
 * 29.42324) in OSM coordinates, then shifted by (-3.66, 0.36) so the origin
 * is the area centroid of OSM way/60586392 (-98.493623, 29.423232).
 *
 * Ground: lidar ground 3.6-4.6 m over its ground_min (a pit) on every side,
 * flat. The map's terrain (Mapterhorn) has a low point under the footprint
 * that sits 0.9-2.0 m (mostly 1.3-1.8) below the streets round the building
 * (`terrain.ts check`), and the map puts y = 0 there. So the model is drawn
 * with heights over the street (lidar less 3.7) and then lifted 1.6 m
 * above its base, the walls running down to y = 0: the streets meet it at
 * its real plinth. Elevation 0.
 *
 * Evidence
 * - OSM way/60586392 (building=civic, amenity=courthouse, levels 6, no
 *   parts): x -11.7..19.5, y -62.7..61.7 in the drawing frame; the north
 *   front's pavilion x -6..16.4 to y 61.7, the south front's x -6.6..14.2 to
 *   y -62.7, a west projection x -16.2..-11.7, y -7..6.8.
 * - USGS 3DEP lidar USGS_LPC_TX_Central_B2_2017_LAS_2019 (2017), 1 m grid
 *   (~/landmarks-scratch/satx/work/sat-bexar-county-courthouse/lidar.json),
 *   less 3.7 m: the lidar outline sits about 1 m east of OSM's (followed
 *   OSM). North block eaves 21, hip ridges 26; the east tower 6.5 m square,
 *   its dome's tip 41.4 (r 2.5-3 at 35-37); the 2017 photo, scaled at
 *   16.8 px/m from the front's width, gives the stages: cornice 28.2, belfry
 *   arcade to 34, drum to 36.5, dome r 2.75 and 5 m tall; the west tower's pyramid to 31.3
 *   from about 25.5; the porch between them 11.8; the long middle with walls
 *   to 20.5 and a hip roof to a flat top at 29.6 (x 0..12); light courts on
 *   the east side (y 27..39 and -40..-28) filled low at 7.0; the south
 *   front 20.5-21.3, its west tower flat at 26.5, its east pyramid to 31.6.
 * - Published: Wikipedia "Bexar County Courthouse"; NRHP 1977; Texas
 *   Historical Commission (1892-1896, J. Riely Gordon; additions 1914, 1926-27).
 * - Photos, all EVIDENCE:
 *   "San Antonio July 2017 06 (Bexar County Courthouse).jpg" (Michael Barera,
 *     CC BY-SA 4.0): the north front face on: towers, porch arch, loggia and
 *     turret domes, the arched top-floor windows, the green tile roofs;
 *   "NORTH FRONT ELEVATION, FROM NORTHWEST - Bexar County Courthouse ... HABS
 *     TEX,15-SANT,36-3" (HABS, public domain): both towers' stages, the ogival
 *     dome's courses, the belvedere's columns, the west side's bays;
 *   "Bexar County Courthouse (2023).jpg" (Lily Thomas, CC BY-SA 4.0): the
 *     south front: five storeys, the arcaded top floor, the triple-arched
 *     entrance up a stair, the two towers;
 *   "EAST (SIDE) AND SOUTH (REAR) ELEVATIONS ... HABS TEX,15-SANT,36-5" (HABS,
 *     public domain): the long east side of the additions, its storeys and
 *     cornice, tile roofs.
 *
 * Estimated: the window bays (grouped two storeys to a panel on the long
 * additions, per the STYLE rules) and their rhythm (3.4 m); which roofs are
 * tiled (the 1896 block and the towers are green tile in the photos; the
 * additions are drawn flat-roofed behind their cornice and a parapet to
 * 21.3, as the HABS side view shows them; the lidar's higher returns over
 * them, 26 at the ends and 29.6 over the middle, are drawn only as a
 * set-back penthouse to 24, out of sight from the street); the west
 * projection's form. Bolder than real: the turrets beside the entrance arch (r 1.6-1.8, domes to
 * 16 m) and the tower cornices. Lower than lidar: the 1896 block's hip roof
 * is a flat-topped hip from 21 to 24 m (lidar ridge 26) so that, as in the
 * photos, the towers' belfries stand clear of it.
 *
 * Night: both fronts floodlit, the long sides less.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, lathe, flat, report, writeGlb, type XY } from './sf-de-young'
import { shift } from './sf-opera-house'
import { onWall, rectPts, roundPts, block, pyramid } from './sat-san-fernando-cathedral'

const sand = new Part(), light = new Part(), tile = new Part(), roof = new Part(), win = new Part(), dark = new Part()

/** A hip roof from rectangle r0 at z0 up to a flat top rectangle r1 at z1 (r1 inside r0). */
function hipTo(side: Part, top: Part | null, r0: [number, number, number, number], r1: [number, number, number, number], z0: number, z1: number) {
  const [a0, b0, c0, d0] = r0, [a1, b1, c1, d1] = r1 // x0, x1, y0, y1
  const lo: V3[] = [[a0, c0, z0], [b0, c0, z0], [b0, d0, z0], [a0, d0, z0]]
  const hi: V3[] = [[a1, c1, z1], [b1, c1, z1], [b1, d1, z1], [a1, d1, z1]]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    if (Math.hypot(hi[i][0] - hi[j][0], hi[i][1] - hi[j][1]) < 1e-6) side.tri(lo[i], lo[j], hi[i])
    else side.quad(lo[i], lo[j], hi[j], hi[i])
  }
  if (top && b1 - a1 > 1e-6 && d1 - c1 > 1e-6) top.quad(hi[0], hi[1], hi[2], hi[3])
}
/** A hip with a ridge: the top rectangle collapses to a line along the longer side. */
function hip(side: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const h = Math.min(x1 - x0, y1 - y0) / 2, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  const ax = Math.max(0, (x1 - x0) / 2 - h), ay = Math.max(0, (y1 - y0) / 2 - h)
  hipTo(side, null, [x0, x1, y0, y1], [cx - ax, cx + ax, cy - ay, cy + ay], z0, z1)
}
type Face = { at: XY; n: XY; s: (x: number, y: number) => number }
const FE = (x: number): Face => ({ at: [x, 0], n: [1, 0], s: (_x, y) => y })
const FW = (x: number): Face => ({ at: [x, 0], n: [-1, 0], s: (_x, y) => -y })
const FN = (y: number): Face => ({ at: [0, y], n: [0, 1], s: (x) => -x })
const FS = (y: number): Face => ({ at: [0, y], n: [0, -1], s: (x) => x })
/** Window bays along a face from a to b (plan coordinates along it), one panel per group of floors. */
function bays(f: Face, a: number, b: number, step: number, rows: [number, number, boolean][], w = 1.5) {
  const n = Math.max(1, Math.round((b - a) / step)), d = (b - a) / n
  for (let k = 0; k < n; k++) {
    const c = a + d * (k + 0.5)
    for (const [z0, z1, arch] of rows) onWall(win, f.at, f.n, arch ? roundPts(c, w, z0, z1, 6) : rectPts(c - w / 2, c + w / 2, z0, z1), 0.06)
  }
}
// one panel per bay and storey group, with tall sandstone spandrels between (review: no full-height stripes)
const OLD: [number, number, boolean][] = [[1.6, 3.0, false], [5.2, 8.2, false], [10.4, 13.6, false], [16.4, 19.0, true]]
const NEW: [number, number, boolean][] = [[1.6, 3.0, false], [5.0, 8.6, false], [10.8, 14.4, false], [16.6, 19.2, true]]

// ---------------------------------------------------------------------------
// The 1896 north block, its hip roof, and the north front
const XW = -11.7, XE = 19.5
prism(sand, [[XW, 39.5], [XE, 39.5], [XE, 57.6], [XW, 57.6]], 0, 21.0, null)
prism(light, [[XW - 0.4, 39.5], [XE + 0.4, 39.5], [XE + 0.4, 58.0], [XW - 0.4, 58.0]], 20.3, 21.0, null)
// a low hip, mostly hidden behind the eaves from the plaza (review; the lidar's
// 26 m ridge is drawn as a flat-topped hip at 24 so the towers stand clear)
hipTo(tile, roof, [XW - 0.6, XE + 0.6, 39.5, 58.2], [XW + 5.5, XE - 5.5, 45.0, 52.5], 21.0, 24.0)
prism(light, [[XW - 0.2, 39.5], [XE + 0.2, 39.5], [XE + 0.2, 57.8], [XW - 0.2, 57.8]], 0, 3.6, null) // granite base
bays(FN(57.8), -XE + 0.5, -16.6, 3.2, OLD, 1.4)
bays(FN(57.8), 6.2, -XW - 0.5, 3.2, OLD, 1.4)
bays(FN(57.8), -10.2, 0.0, 2.0, [[13.8, 19.2, true]], 1.2)
bays(FE(XE + 0.2), 40.5, 57.0, 3.3, OLD, 1.4)
bays(FW(XW - 0.2), -57.0, -40.5, 3.3, OLD, 1.4)
// a dormer in the roof over the middle of the front
block(sand, 2.6, 7.8, 53.0, 58.0, 20.5, 23.6, 0.1, null)
pyramid(tile, 2.3, 8.1, 52.7, 58.3, 23.6, 25.0)
onWall(win, [0, 58.0], [0, 1], rectPts(-7.4, -3.0, 21.3, 23.1), 0.06)

// the porch: the entrance arch, the loggia above it and the two domed turrets
block(sand, 0.2, 10.2, 57.6, 61.5, 0, 11.4, 0.15, roof)
block(light, 0.0, 10.4, 57.6, 61.7, 11.0, 11.8, 0.15)
onWall(light, [0, 61.5], [0, 1], roundPts(-5.2, 7.4, 0, 8.0, 10), 0.03)
onWall(dark, [0, 61.5], [0, 1], roundPts(-5.2, 6.2, 0, 7.3, 10), 0.06)
for (let k = 0; k < 5; k++) onWall(dark, [0, 61.5], [0, 1], rectPts(-2.0 - k * 1.3, -1.2 - k * 1.3, 8.9, 10.8), 0.06)
for (const x of [0.7, 9.7]) {
  lathe(light, [[1.6, 0], [1.6, 9.6], [1.8, 9.8], [1.8, 12.0]], 12, [x, 61.6])
  const prof: [number, number][] = [[1.8, 12.0], [1.95, 12.7], [1.85, 13.6], [1.5, 14.5], [0.9, 15.3], [0.3, 15.8], [0, 16.1]]
  lathe(sand, prof, 12, [x, 61.6])
}

// the west tower: an open belvedere under a steep green-tile pyramid
{
  const x0 = -6.0, x1 = 0.2, y0 = 55.6, y1 = 61.9
  block(sand, x0, x1, y0, y1, 0, 22.0, 0, null)
  block(light, x0 - 0.15, x1 + 0.15, y0 - 0.15, y1 + 0.15, 21.6, 22.2, 0.08, null)
  block(sand, x0, x1, y0, y1, 22.2, 25.8, 0, null)
  block(light, x0 - 0.35, x1 + 0.35, y0 - 0.35, y1 + 0.35, 25.8, 26.5, 0.12)
  pyramid(tile, x0 - 0.3, x1 + 0.3, y0 - 0.3, y1 + 0.3, 26.5, 31.3)
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  for (const [f, c] of [[FN(y1), -cx], [FS(y0), cx], [FE(x1), cy], [FW(x0), -cy]] as [Face, number][]) {
    for (const d of [-1.9, 0, 1.9]) onWall(dark, f.at, f.n, rectPts(c + d - 0.7, c + d + 0.7, 22.6, 25.5), 0.06)
    onWall(win, f.at, f.n, rectPts(c - 1.6, c - 0.4, 12.0, 15.2), 0.06)
    onWall(win, f.at, f.n, rectPts(c - 1.6, c - 0.4, 16.4, 19.5), 0.06)
    onWall(win, f.at, f.n, rectPts(c + 0.4, c + 1.6, 12.0, 15.2), 0.06)
    onWall(win, f.at, f.n, rectPts(c + 0.4, c + 1.6, 16.4, 19.5), 0.06)
    onWall(win, f.at, f.n, rectPts(c - 1.0, c + 1.0, 4.5, 9.0), 0.06)
  }
}
// the east tower: a square shaft with a big arch and a cornice at 28.2, the
// arcaded belfry stage with corner pinnacles, a round drum, the bullet dome
{
  const x0 = 10.2, x1 = 16.6, y0 = 55.5, y1 = 61.9, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  block(sand, x0, x1, y0, y1, 0, 28.2, 0, null)
  block(light, x0 - 0.2, x1 + 0.2, y0 - 0.2, y1 + 0.2, 20.6, 21.2, 0.08, null)
  block(light, x0 - 0.35, x1 + 0.35, y0 - 0.35, y1 + 0.35, 27.6, 28.2, 0.12, null)
  block(sand, x0 + 0.15, x1 - 0.15, y0 + 0.15, y1 - 0.15, 28.2, 33.6, 0, null)
  block(light, x0 - 0.3, x1 + 0.3, y0 - 0.3, y1 + 0.3, 33.6, 34.1, 0.12)
  for (const [f, c, ins] of [[FN(y1), -cx, 0], [FS(y0), cx, 0], [FE(x1), cy, 0], [FW(x0), -cy, 0]] as [Face, number, number][]) {
    const fi: Face = { ...f, at: [f.at[0] - f.n[0] * 0.15, f.at[1] - f.n[1] * 0.15] }
    for (const d of [-1.95, -0.65, 0.65, 1.95]) onWall(dark, fi.at, fi.n, roundPts(c + d, 0.95, 29.0, 33.0, 6), 0.06)
    onWall(dark, f.at, f.n, roundPts(c, 2.6, 22.6, 27.0, 8), 0.06)
    onWall(win, f.at, f.n, rectPts(c - 1.3, c - 0.3, 5.0, 9.2), 0.06)
    onWall(win, f.at, f.n, rectPts(c - 1.3, c - 0.3, 10.3, 14.5), 0.06)
    onWall(win, f.at, f.n, rectPts(c + 0.3, c + 1.3, 5.0, 9.2), 0.06)
    onWall(win, f.at, f.n, rectPts(c + 0.3, c + 1.3, 10.3, 14.5), 0.06)
    onWall(win, f.at, f.n, rectPts(c - 0.6, c + 0.6, 16.0, 19.6), 0.06)
  }
  for (const [px, py] of [[x0 + 0.1, y0 + 0.1], [x1 - 0.1, y0 + 0.1], [x1 - 0.1, y1 - 0.1], [x0 + 0.1, y1 - 0.1]]) {
    block(light, px - 0.35, px + 0.35, py - 0.35, py + 0.35, 34.1, 34.9, 0.05)
    pyramid(light, px - 0.35, px + 0.35, py - 0.35, py + 0.35, 34.9, 36.2)
  }
  // the round drum with its small arches, then the dome (a bullet: upright at the
  // base, tapering to the tip), r 2.75 and 5 m tall, read from the 2017 photo
  lathe(sand, [[2.9, 34.1], [2.9, 36.2], [3.05, 36.3], [3.05, 36.5]], 16, [cx, cy])
  for (let k = 0; k < 8; k++) {
    const a = (Math.PI / 4) * k, n: XY = [Math.cos(a), Math.sin(a)]
    onWall(dark, [cx, cy], n, roundPts(0, 0.6, 34.6, 35.9, 4), 2.92)
  }
  const dome: [number, number][] = []
  for (let i = 0; i <= 8; i++) {
    const t = i / 8, z = 36.5 + 4.9 * t, rr = 2.75 * Math.sqrt(Math.max(0, 1 - t * t * t))
    dome.push([rr, z])
  }
  dome[dome.length - 1] = [0, 41.4]
  lathe(sand, dome, 16, [cx, cy])
  lathe(light, [[0.18, 41.2], [0.18, 42.2], [0, 42.4]], 6, [cx, cy])
}

// ---------------------------------------------------------------------------
// The long middle (additions), its courts and the west projection
prism(sand, [[XW, -40.0], [11.0, -40.0], [11.0, -26.0], [XE, -26.0], [XE, 26.0], [11.0, 26.0], [11.0, 39.5], [XW, 39.5]], 0, 20.5, null)
prism(light, [[XW - 0.2, -40.0], [11.0, -40.0], [11.0, -26.0], [XE + 0.2, -26.0], [XE + 0.2, 26.0], [11.0, 26.0], [11.0, 39.5], [XW - 0.2, 39.5]], 0, 3.6, null)
prism(light, [[XW - 0.4, -40.0], [11.0, -40.0], [11.0, -26.4], [XE + 0.4, -26.4], [XE + 0.4, 26.4], [11.0, 26.4], [11.0, 39.5], [XW - 0.4, 39.5]], 19.8, 20.5, null)
// the additions' roofs: flat behind the heavy cornice (review; the HABS side
// view shows no hip), with a parapet and a low set-back penthouse where the
// lidar finds a raised block
const MID: XY[] = [[XW - 0.4, -40.0], [11.0, -40.0], [11.0, -26.4], [XE + 0.4, -26.4], [XE + 0.4, 26.4], [11.0, 26.4], [11.0, 39.5], [XW - 0.4, 39.5]]
flat(roof, MID, 21.25)
prism(light, [[XW - 0.4, -40.0], [11.0, -40.0], [11.0, -26.4], [XE + 0.4, -26.4], [XE + 0.4, 26.4], [11.0, 26.4], [11.0, 39.5], [XW - 0.4, 39.5]], 20.5, 21.3, null)
block(sand, 1.0, 11.5, -11.0, 4.0, 20.5, 24.0, 0.1, roof)
for (const [y0, y1] of [[26.0, 39.5], [-40.0, -26.0]]) block(sand, 11.0, XE, y0, y1, 0, 7.0, 0.15, roof)
block(sand, -16.2, XW, -7.0, 6.8, 0, 20.1, 0.2, roof)
bays(FE(XE + 0.2), -25.5, 25.5, 3.4, NEW)
bays(FW(XW - 0.2), -39.5, -7.5, 3.4, NEW)
bays(FW(XW - 0.2), 7.3, 39.0, 3.4, NEW)
bays(FW(-16.2), -6.5, 6.3, 3.4, NEW)
for (const [y0, y1] of [[26.5, 39.0], [-39.5, -26.5]]) bays(FE(XE), y0, y1, 3.4, [[1.4, 5.6, false]])
for (const [y0, y1] of [[26.5, 39.0], [-39.5, -26.5]]) bays(FE(11.0), y0, y1, 3.4, [[9.0, 18.6, false]])

// ---------------------------------------------------------------------------
// The south block and the 1920s south front on Nueva Street
prism(sand, [[XW, -58.3], [XE, -58.3], [XE, -40.0], [XW, -40.0]], 0, 20.5, null)
prism(light, [[XW - 0.2, -58.5], [XE + 0.2, -58.5], [XE + 0.2, -40.0], [XW - 0.2, -40.0]], 0, 3.6, null)
prism(light, [[XW - 0.4, -58.7], [XE + 0.4, -58.7], [XE + 0.4, -40.0], [XW - 0.4, -40.0]], 19.8, 20.5, null)
flat(roof, [[XW - 0.4, -58.7], [XE + 0.4, -58.7], [XE + 0.4, -40.0], [XW - 0.4, -40.0]], 21.25)
prism(light, [[XW - 0.4, -58.7], [XE + 0.4, -58.7], [XE + 0.4, -40.0], [XW - 0.4, -40.0]], 20.5, 21.3, null)
bays(FS(-58.5), XW + 0.5, -7.1, 3.2, NEW)
bays(FS(-58.5), 14.7, XE - 0.5, 3.2, NEW)
bays(FE(XE + 0.2), -57.5, -40.5, 3.4, NEW)
bays(FW(XW - 0.2), 40.5, 57.5, 3.4, NEW)
{
  const X0 = -6.6, X1 = 14.2, Y0 = -62.7, Y1 = -58.3
  block(sand, X0, X1, Y0, Y1, 0, 20.6, 0, roof)
  block(light, X0, X1, Y0 - 0.2, Y1, 0, 4.2, 0, null)
  block(light, X0 - 0.3, X1 + 0.3, Y0 - 0.45, Y1, 19.6, 20.9, 0.15)
  // between the towers: three entrance arches over the stair, five storeys, arcaded top floor
  const f = FS(Y0 - 0.2)
  for (const x of [1.2, 3.8, 6.4]) onWall(dark, f.at, f.n, roundPts(x, 2.0, 1.4, 5.6, 8), 0.06)
  bays(FS(Y0), 0.0, 7.6, 1.9, [[6.6, 10.2, false], [11.0, 15.2, false], [16.2, 18.8, true]], 1.1)
  for (let k = 0; k < 4; k++) block(light, -0.4 + k * 2.3, 1.6 + k * 2.3 - 0.4, Y0 - 3.6 + k * 0.9, Y0, 0, 0.4 * (k + 1), 0)
  // the west tower: an open belvedere, flat-topped
  const tw: [number, number, number, number] = [X0, -0.4, Y0, -56.6]
  block(sand, tw[0], tw[1], tw[2], tw[3], 0, 21.6, 0, null)
  block(sand, tw[0], tw[1], tw[2], tw[3], 21.6, 25.6, 0, null)
  block(light, tw[0] - 0.35, tw[1] + 0.35, tw[2] - 0.35, tw[3] + 0.35, 25.6, 26.5, 0.12, roof)
  // the east tower: belvedere under a green-tile pyramid
  const te: [number, number, number, number] = [8.0, X1, Y0, -56.8]
  block(sand, te[0], te[1], te[2], te[3], 0, 25.0, 0, null)
  block(light, te[0] - 0.35, te[1] + 0.35, te[2] - 0.35, te[3] + 0.35, 25.0, 25.7, 0.12)
  pyramid(tile, te[0] - 0.3, te[1] + 0.3, te[2] - 0.3, te[3] + 0.3, 25.7, 31.6)
  for (const t of [tw, te]) {
    const cx = (t[0] + t[1]) / 2, cy = (t[2] + t[3]) / 2
    for (const [g, c] of [[FN(t[3]), -cx], [FS(t[2]), cx], [FE(t[1]), cy], [FW(t[0]), -cy]] as [Face, number][]) {
      for (const d of [-1.9, 0, 1.9]) onWall(dark, g.at, g.n, rectPts(c + d - 0.7, c + d + 0.7, 21.9, 24.7), 0.06)
      onWall(win, g.at, g.n, rectPts(c - 1.6, c - 0.4, 11.0, 14.6), 0.06)
      onWall(win, g.at, g.n, rectPts(c - 1.6, c - 0.4, 15.8, 19.4), 0.06)
      onWall(win, g.at, g.n, rectPts(c + 0.4, c + 1.6, 11.0, 14.6), 0.06)
      onWall(win, g.at, g.n, rectPts(c + 0.4, c + 1.6, 15.8, 19.4), 0.06)
      onWall(win, g.at, g.n, rectPts(c - 1.0, c + 1.0, 5.0, 9.4), 0.06)
    }
  }
}

// ---------------------------------------------------------------------------
const OX = -3.66, OY = 0.36
const all = [sand, light, tile, roof, win, dark]
// lift everything above the base by G: the map's lowest ground under the
// footprint is about 1.6 m below the streets round the building (see Ground)
const G = 1.6
for (const p of all) for (let i = 1; i < p.pos.length; i += 3) if (p.pos[i] > 0.001) p.pos[i] += G
shift(all, OX, OY)
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : (n[1] > 0.5 && p[1] > 54) || (n[1] < -0.5 && p[1] < -54) ? 0.9 : 0.35)
const parts = [
  { part: sand, material: { ...finish('bexar-sandstone', 0xc98b74), floodlight: lit } },
  { part: light, material: { ...finish('bexar-sandstone-light', 0xd8a590), floodlight: lit } },
  { part: tile, material: finish('bexar-green-tile', 0x86a184) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: dark, material: finish('bexar-shadow', 0x5e4740) },
]
const glb = writeGlb('Bexar County Courthouse', parts, {
  license: 'CC0-1.0', bearing: 7.7, elevation: 0, anchor: [29.423232, -98.493623],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/60586392'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('Bexar County Courthouse', parts, glb, 6500)
const out = new URL('../models/sat-bexar-county-courthouse.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
