/**
 * Sunset Station ("The Espee"), 1174 East Commerce Street, San Antonio,
 * Texas: the 1902 Southern Pacific passenger depot by J. D. Isaacs, Mission
 * Revival in salmon-pink stucco under red tile: a long gabled block with a
 * curved, scrolled parapet gable in the middle of its street side carrying
 * the great round "SUNSET ROUTE" window in a red-brick surround, a square
 * tower at the south end with deep bracketed tile eaves, a tile-roofed
 * arcade of brick-edged arches along the street front, a cross-roofed wing
 * at the north end. OSM maps the depot together with the long baggage wing
 * north of it, the platform canopy on the track side and a large hall at
 * the north end as one building (way/42817372), so the model draws all of
 * it; only the depot is detailed, the rest is drawn plain from lidar.
 * Original procedural geometry, CC0-1.0.   bun generators/sat-sunset-station.ts
 *
 * Frame: bearing 0 (the outline is square to the compass). x east (the
 * tracks), y north, z up, metres. Drawn about the second lidar grid's
 * centre (-98.47826, 29.42068), shifted by (-5.37, 29.75) so the origin is
 * the area centroid of way/42817372 (-98.478205, 29.420411).
 *
 * Ground: flat (Mapterhorn 1.2-1.8 m across it; lidar ground 0.9-1.7 over
 * the grids' ground_min). Heights below are lidar less the local ground.
 * Elevation 0.
 *
 * Evidence
 * - OSM way/42817372 (building, "The Espee"): the depot x -4.2..13.6, y
 *   -103.3..-64.6; the baggage wing to y -3.8; the platform canopy x
 *   13.6..21.8; the north hall x -19.9..23, y -3.8..36.1. The Amtrak station
 *   (way/154820952) to the south-east is a separate building, left out.
 * - USGS 3DEP lidar USGS_LPC_TX_Central_B2_2017_LAS_2019 (2017), 1 m grids
 *   (~/landmarks-scratch/satx/work/sat-sunset-station/lidar.json, lidar2.json):
 *   the depot's walls 5.0, its ridge 9.9 on x 5.3; cross-roofs to 12.4 at
 *   its south end (the tower), middle (the parapet gable) and north end; the
 *   baggage wing's walls 3.9, ridge 7.0; the canopy 3.4; the north hall's
 *   steep roof from 9.5 to 15.5 on x -3, its north range 14, a spire point
 *   at 28.2 (x -3, y 30) and side aisles 4.5.
 * - Published: Wikipedia "Sunset Station (San Antonio)" (1902, Southern
 *   Pacific; Mission Revival; restored 1998).
 * - Photos (Wikimedia Commons), EVIDENCE:
 *   "San Antonio Train Station.jpg" (Tony Kent, CC BY-SA 2.0): the street
 *     side: the scrolled gable and the rose window, the tower's eaves and
 *     its carved window frame, the tiled arcade, the brick arch surrounds;
 *   "San Antonio Station.jpg" (Ironmatic1, CC BY-SA 4.0).
 *
 * Doubts: no licensed photo shows the north hall, the baggage wing or the
 * track side; they are plain lidar massing. The north end of the depot is
 * drawn as a cross-hipped wing like the photo's left edge. Bolder than
 * real: the rose window (r 2.4) and its brick surround.
 *
 * Night: the depot's street front floodlit; the windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { prism, lathe, report, writeGlb, type XY } from './sf-de-young'
import { shift } from './sf-opera-house'
import { onWall, rectPts, roundPts, circlePts, ringOnWall, block, pyramid, pitchedX } from './sat-san-fernando-cathedral'

const stucco = new Part(), tile = new Part(), trim = new Part(), win = new Part(), rose = new Part(), roof = new Part()
const W: XY = [-1, 0]
const sW = (y: number) => -y

/** A pitched roof along y over x0..x1, eaves ze, ridge zr at xr, with gable walls (on `gable`) at both ends. */
function pitchedY(r: Part, gable: Part | null, x0: number, x1: number, y0: number, y1: number, ze: number, zr: number, xr = (x0 + x1) / 2, o = 0.4) {
  r.quad([x0 - o, y1, ze - 0.2], [x0 - o, y0, ze - 0.2], [xr, y0, zr], [xr, y1, zr])
  r.quad([x1 + o, y0, ze - 0.2], [x1 + o, y1, ze - 0.2], [xr, y1, zr], [xr, y0, zr])
  if (gable) {
    gable.tri([x0, y0, ze], [x1, y0, ze], [xr, y0, zr])
    gable.tri([x1, y1, ze], [x0, y1, ze], [xr, y1, zr])
  }
}
void pitchedX

// ---- the depot ----
const DX0 = -4.2, DX1 = 13.6, DY0 = -103.3, DY1 = -64.6, DR = 5.3
block(stucco, DX0, DX1, DY0, DY1, 0, 5.0, 0, null)
pitchedY(tile, stucco, DX0, DX1, DY0, DY1, 5.0, 9.9, DR)
// the middle: the cross-roof and, on the street side, the scrolled parapet gable with the rose window
const YM = -84.6
{
  block(stucco, DX0, DX1, YM - 4.5, YM + 4.5, 5.0, 7.4, 0, null)
  // the cross-roof
  tile.quad([DX0, YM - 4.9, 7.2], [DX1 + 0.3, YM - 4.9, 7.2], [DX1 + 0.3, YM, 11.6], [DX0, YM, 11.6])
  tile.quad([DX1 + 0.3, YM + 4.9, 7.2], [DX0, YM + 4.9, 7.2], [DX0, YM, 11.6], [DX1 + 0.3, YM, 11.6])
  // the scrolled gable on the street (west) face, 0.5 m thick
  const half: XY[] = [[5.0, 5.0], [5.0, 7.4], [4.4, 7.6], [4.0, 8.1], [3.5, 8.3], [3.0, 8.3], [2.6, 8.7], [2.3, 9.6], [2.0, 10.4], [1.5, 11.1], [0.8, 11.6], [0, 11.8]]
  const pts: XY[] = [...half.map(([u, z]) => [sW(YM) + u, z] as XY), ...[...half].reverse().slice(1).map(([u, z]) => [sW(YM) - u, z] as XY)]
  onWall(stucco, [DX0 - 0.5, 0], W, pts, 0)
  onWall(stucco, [DX0, 0], [1, 0], pts.map(([s, z]) => [-s, z] as XY), 0)
  for (let i = 0; i < pts.length - 1; i++) {
    const [sa, za] = pts[i], [sb, zb] = pts[i + 1]
    const ya = -sa, yb = -sb
    trim.quad([DX0 - 0.5, ya, za], [DX0 - 0.5, yb, zb], [DX0, yb, zb], [DX0, ya, za])
  }
  // the rose window in its brick surround, the crest ornament
  ringOnWall(tile, [DX0 - 0.5, 0], W, sW(YM), 7.0, 2.1, 2.8, 0.05, 16)
  onWall(rose, [DX0 - 0.5, 0], W, circlePts(sW(YM), 7.0, 2.1, 16), 0.06)
  block(trim, DX0 - 0.8, DX0 - 0.5, YM - 0.5, YM + 0.5, 9.8, 10.9, 0.05)
}
// the tile-roofed arcade along the street front, brick-edged arches
block(stucco, DX0 - 3.2, DX0, YM - 9.0, YM + 9.0, 0, 3.6, 0, null)
tile.quad([DX0 - 3.5, YM + 9.0, 3.6], [DX0 - 3.5, YM - 9.0, 3.6], [DX0, YM - 9.0, 4.7], [DX0, YM + 9.0, 4.7])
for (let k = 0; k < 5; k++) {
  const y = YM - 7.2 + k * 3.6
  onWall(tile, [DX0 - 3.2, 0], W, roundPts(sW(y), 3.0, 0, 3.3, 8), 0.04)
  onWall(win, [DX0 - 3.2, 0], W, roundPts(sW(y), 2.3, 0, 2.9, 8), 0.07)
}
// the south tower, with its deep bracketed eaves and hipped tile roof
{
  const ty0 = DY0, ty1 = DY0 + 7.2, tx0 = DX0 - 3.2, tx1 = tx0 + 7.2, cy = (ty0 + ty1) / 2
  block(stucco, tx0, tx1, ty0, ty1, 0, 10.8, 0, null)
  block(trim, tx0 - 0.5, tx1 + 0.5, ty0 - 0.5, ty1 + 0.5, 10.2, 11.0, 0.1, null)
  block(tile, tx0 - 1.3, tx1 + 1.3, ty0 - 1.3, ty1 + 1.3, 11.0, 11.2, 0, null)
  tile.quad([tx0 - 1.3, ty1 + 1.3, 11.0], [tx1 + 1.3, ty1 + 1.3, 11.0], [tx1 + 1.3, ty0 - 1.3, 11.0], [tx0 - 1.3, ty0 - 1.3, 11.0])
  pyramid(tile, tx0 - 1.3, tx1 + 1.3, ty0 - 1.3, ty1 + 1.3, 11.2, 12.8)
  onWall(tile, [tx0, 0], W, roundPts(sW(cy), 4.0, 0, 4.6, 8), 0.04)
  onWall(win, [tx0, 0], W, roundPts(sW(cy), 3.0, 0, 4.0, 8), 0.07)
  onWall(trim, [tx0, 0], W, rectPts(sW(cy) - 1.6, sW(cy) + 1.6, 5.6, 8.8), 0.08)
  onWall(win, [tx0, 0], W, rectPts(sW(cy) - 0.9, sW(cy) + 0.9, 6.0, 8.0), 0.12)
  for (const [at, n, s] of [[[0, ty0], [0, -1], cy - cy + (tx0 + tx1) / 2], [[tx1, 0], [1, 0], cy]] as [XY, XY, number][]) {
    onWall(trim, at, n, rectPts(s - 1.4, s + 1.4, 5.6, 8.8), 0.08)
    onWall(win, at, n, rectPts(s - 0.8, s + 0.8, 6.0, 8.0), 0.12)
  }
}
// the north end's cross-hipped wing
{
  const y0 = DY1 - 8.0, y1 = DY1
  tile.quad([DX0 - 0.3, y0, 5.0], [DX1 + 0.3, y0, 5.0], [DX1 + 0.3, (y0 + y1) / 2, 9.4], [DX0 - 0.3, (y0 + y1) / 2, 9.4])
  tile.quad([DX1 + 0.3, y1, 5.0], [DX0 - 0.3, y1, 5.0], [DX0 - 0.3, (y0 + y1) / 2, 9.4], [DX1 + 0.3, (y0 + y1) / 2, 9.4])
}
// windows along the street side
for (const y of [-96, -92, -77, -73, -69]) onWall(win, [DX0, 0], W, roundPts(sW(y), 1.4, 1.0, 3.8, 6), 0.06)

// ---- the baggage wing, the platform canopy, the north hall (plain, lidar) ----
block(stucco, -4.2, 13.3, DY1, -3.8, 0, 3.9, 0, null)
pitchedY(tile, stucco, -4.2, 13.3, DY1, -3.8, 3.9, 7.0, 6.5)
for (let y = -60; y < -6; y += 6) onWall(win, [-4.2, 0], W, rectPts(sW(y) - 0.8, sW(y) + 0.8, 1.0, 3.0), 0.06)
block(roof, 13.6, 21.8, -101.6, -2.2, 3.0, 3.4, 0.05)
for (let y = -100; y < -2; y += 7) block(trim, 21.2, 21.6, y - 0.2, y + 0.2, 0, 3.0)
// the north hall: aisles, a steep nave roof, the north range and its spire
block(stucco, -19.9, 13.3, -3.8, 26.2, 0, 4.5, 0, roof)
block(stucco, -16.0, 10.0, -3.8, 26.2, 0, 9.5, 0, null)
pitchedY(roof, stucco, -16.0, 10.0, -3.8, 26.2, 9.5, 15.5, -3.0)
block(stucco, 13.3, 23.0, 9.7, 22.5, 0, 4.0, 0.1, roof)
block(stucco, -19.9, 13.7, 26.2, 36.1, 0, 14.0, 0.15, roof)
block(stucco, -5.0, -1.0, 28.0, 32.0, 14.0, 17.0, 0.1, null)
lathe(roof, [[2.0, 17.0], [0.0, 28.2]], 8, [-3.0, 30.0], Math.PI / 8, false)
for (let y = 0; y < 25; y += 5) onWall(win, [-19.9, 0], W, rectPts(sW(y) - 0.8, sW(y) + 0.8, 1.0, 3.2), 0.06)

// ---------------------------------------------------------------------------
const all = [stucco, tile, trim, win, rose, roof]
shift(all, -5.37, 29.75)
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : n[0] < -0.5 && p[1] < -30 ? 0.8 : 0.15)
const parts = [
  { part: stucco, material: { ...finish('sunset-pink-stucco', 0xdcaa96), floodlight: lit } },
  { part: tile, material: { ...finish('sunset-red-tile', 0xb5644f), floodlight: lit } },
  { part: trim, material: { ...finish('sunset-cream-trim', 0xf0e3c6), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: rose, material: windowVariant(2, 0x4f6b9e) },
  { part: roof, material: PALETTE.roof },
]
const glb = writeGlb('Sunset Station', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [29.420411, -98.478205],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/42817372'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('Sunset Station', parts, glb, 5000)
const out = new URL('../models/sat-sunset-station.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
