/**
 * San Fernando Cathedral, Main Plaza, San Antonio, Texas. The 1868-1873
 * Gothic Revival nave and twin-towered front by François Giraud, in cream
 * limestone, facing EAST onto Main Plaza; behind it, at the west end towards
 * Military Plaza, the whitewashed sanctuary of the 1738-1750 parish church of
 * the Canary Islanders, with its small dome and lantern over the crossing.
 * Original procedural geometry, CC0-1.0.   bun generators/sat-san-fernando-cathedral.ts
 *
 * Also the shared kit for the other Main and Military Plaza models
 * (sat-city-hall, sat-spanish-governors-palace, sat-bexar-county-courthouse),
 * which import the wall-face helpers below; this file's own build runs only
 * under `import.meta.main`.
 *
 * Frame: bearing 4.5 (the OSM outline is square to 0.1 m in it). x runs along
 * the nave towards the front (east-south-east), y is the model's north, z up,
 * metres. The geometry is drawn about the lidar grid's centre (-98.49432,
 * 29.42456) and shifted at the end by (-12.39, -1.34), so the origin is the
 * area centroid of OSM way/80647022 (-98.494194, 29.424539). The building is
 * symmetric about y = -2.0 (its measured centre line, in the drawing frame).
 *
 * Ground: flat (Mapterhorn 0.3-1.1 m across the site; lidar ground 0.4-1.0
 * m over ground_min 197.67, 0.5 on the plaza at the front). Lidar heights
 * below are taken less 0.4 m. Elevation 0.
 *
 * Evidence
 * - OSM way/80647022 (building=cathedral, no parts, no height). In the drawing
 *   frame: the nave x 4.2..36.6, y -12.6..9.8; the old church west of it,
 *   x -14.2..4.2, with a chamfered south-west corner and a low north wing.
 * - USGS 3DEP lidar USGS_LPC_TX_Central_B2_2017_LAS_2019 (flown 2017), 0.5 m
 *   grid (~/landmarks-scratch/satx/work/sat-san-fernando-cathedral/lidar.json),
 *   read in the frame: nave walls y -13.6..9.6, eaves 10.3, ridge 16.0 on
 *   y = -2; towers x 30.6..37.2, y 2.3..9.6 and -13.6..-6.3, cornice 25.5,
 *   pyramid caps to 27.6; front gable 17.5-18.2 between them; the old church's
 *   flat roofs at 10.4, its north wing at 5.4 (parapet 6.6); the dome centred
 *   (-4.5, -2), 7 m across, 13.6 at its crown, the lantern 15.2.
 * - Published: Wikipedia "San Fernando Cathedral" and the Handbook of Texas
 *   (TSHA, "San Fernando Cathedral"): church 1738-1750; Gothic Revival
 *   addition 1868-1873 by François Giraud; the old sanctuary and dome kept.
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   "San Fernando Cathedral.jpg" (Daniel Schwen, CC BY-SA 4.0): the east front
 *     face on, scaled at 42.8 px/m from its 23.4 m width: doors (centre 2.3 m
 *     wide to 4.7, tower doors 1.65 to 4.5 under gabled hoods to 6.9), the
 *     paired lancets at 6.7-9.3, the tower oculi at 12.3, the rose window at
 *     11.4 (r 1.6 with its surround), the arcaded parapet 15.6, the pinnacle
 *     buttresses either side of the gable, the belfry stage from 14.6 with two
 *     louvred round-headed openings a face under one arch, the deep eaves;
 *   "Cathedral of San Fernando rear.jpg" (GoneBefore, CC BY-SA 4.0): the west
 *     end from Military Plaza: the whitewashed old church, flat-topped, its
 *     small white dome and lantern, the towers' low grey pyramid caps;
 *   "San Fernando Cathedral in the Main and Military Plazas Historic
 *     District, San Antonio, Texas.jpg" (Tedcampbell, CC BY-SA 4.0): from
 *     above the north-east at night: the north side (buttressed bays of
 *     tall lancets under a dark pitched roof), the dome, and the floodlighting.
 *
 * Bolder than real, for phone size: the front's buttresses and pinnacles
 * (0.7-0.95 m proud, in the paler trim stone; review); the tower crosses (0.3 m bars, 2.2 m
 * tall); the rose window's surround and the belfry arches.
 *
 * Night: the east front and the towers are floodlit (the night photo, which
 * shows the belfry louvres lit from inside: drawn as `window`), the nave's
 * north side too; the old church dimly.
 *
 * Estimated: the side windows (six bays of lancets, 1.4 m wide, 4.0-8.4 m;
 * from the night photo, which is oblique); the buttresses' depth; the old
 * church's few windows are left out (no photo shows them clearly).
 *
 * Doubts: the south side of the nave, which no photo here shows (it faces
 * the gift shop's court), is drawn as the mirror of the north; the old church's plan is simplified from lidar.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, lathe, planar, report, writeGlb, type XY } from './sf-de-young'
import { shift } from './sf-opera-house'

// ---------------------------------------------------------------------------
// Shared helpers (exported for the other plaza models)

/** A flat shape on a vertical wall through `at`, facing `n`, `o` proud of it; pts are (along, z). */
export function onWall(p: Part, at: XY, n: XY, pts: XY[], o = 0.06) {
  const su: V3 = [-n[1], n[0], 0]
  planar(p, [at[0] + n[0] * o, at[1] + n[1] * o, 0], su, [0, 0, 1], pts)
}
/** A pointed (equilateral) lancet, `w` wide centred at s, from z0 to its apex zt. */
export function lancetPts(s: number, w: number, z0: number, zt: number, seg = 4): XY[] {
  const r = w, zs = Math.max(z0, zt - w * Math.sqrt(3) / 2)
  const pts: XY[] = [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, zs]]
  // right arc centred at the left jamb, left arc at the right jamb
  const a1 = Math.acos(0.5) // 60 degrees
  for (let i = 1; i <= seg; i++) { const a = (a1 * i) / seg; pts.push([s - w / 2 + r * Math.cos(a), zs + r * Math.sin(a)]) }
  for (let i = seg - 1; i >= 1; i--) { const a = (a1 * i) / seg; pts.push([s + w / 2 - r * Math.cos(a), zs + r * Math.sin(a)]) }
  pts.push([s - w / 2, zs])
  return pts
}
/** A round-headed opening, `w` wide centred at s, from z0 to its crown zt (a true semicircle). */
export function roundPts(s: number, w: number, z0: number, zt: number, seg = 8): XY[] {
  const r = w / 2, zs = zt - r
  const pts: XY[] = [[s - r, z0], [s + r, z0]]
  for (let i = 0; i <= seg; i++) { const a = (Math.PI * i) / seg; pts.push([s + r * Math.cos(a), zs + r * Math.sin(a)]) }
  return pts
}
export const circlePts = (s: number, z: number, r: number, n = 16): XY[] =>
  Array.from({ length: n }, (_, i) => [s + r * Math.cos((2 * Math.PI * i) / n), z + r * Math.sin((2 * Math.PI * i) / n)] as XY)
export const rectPts = (s0: number, s1: number, z0: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]

/** A ring (annulus) on a wall: between radii r0 and r1 about (s, z). */
export function ringOnWall(p: Part, at: XY, n: XY, s: number, z: number, r0: number, r1: number, o = 0.05, seg = 16) {
  for (let i = 0; i < seg; i++) {
    const a0 = (2 * Math.PI * i) / seg, a1 = (2 * Math.PI * (i + 1)) / seg
    onWall(p, at, n, [[s + r0 * Math.cos(a0), z + r0 * Math.sin(a0)], [s + r1 * Math.cos(a0), z + r1 * Math.sin(a0)], [s + r1 * Math.cos(a1), z + r1 * Math.sin(a1)], [s + r0 * Math.cos(a1), z + r0 * Math.sin(a1)]], o)
  }
}

/** An axis-aligned block with a bevelled top edge, closed underneath when `under`. */
export function block(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bevel = 0, top: Part | null = p) {
  prism(p, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, top, bevel)
}

/** A pyramid (or hipped cap when the rectangle is long) from a rectangle at z0 up to an apex at z1. */
export function pyramid(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, under = false) {
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, h = Math.min(x1 - x0, y1 - y0) / 2
  const r0: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const ax = Math.max(0, (x1 - x0) / 2 - h), ay = Math.max(0, (y1 - y0) / 2 - h)
  const top: V3[] = [[cx - ax, cy - ay, z1], [cx + ax, cy - ay, z1], [cx + ax, cy + ay, z1], [cx - ax, cy + ay, z1]]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    if (Math.hypot(top[i][0] - top[j][0], top[i][1] - top[j][1]) < 1e-6) p.tri(r0[i], r0[j], top[i])
    else p.quad(r0[i], r0[j], top[j], top[i])
  }
  if (under) p.quad(r0[3], r0[2], r0[1], r0[0])
}

/** A pitched roof along x over x0..x1, eaves at y0/y1 at height ze, ridge at yr height zr, with gable ends on `gable`. */
export function pitchedX(roof: Part, gable: Part | null, x0: number, x1: number, y0: number, y1: number, ze: number, zr: number, yr = (y0 + y1) / 2, over = 0) {
  const dz0 = (over * (zr - ze)) / (yr - y0), dz1 = (over * (zr - ze)) / (y1 - yr)
  roof.quad([x0 - over, y0 - over, ze - dz0], [x1 + over, y0 - over, ze - dz0], [x1 + over, yr, zr], [x0 - over, yr, zr])
  roof.quad([x1 + over, y1 + over, ze - dz1], [x0 - over, y1 + over, ze - dz1], [x0 - over, yr, zr], [x1 + over, yr, zr])
  if (gable) {
    gable.tri([x0, y0, ze], [x0, yr, zr], [x0, y1, ze])
    gable.tri([x1, y1, ze], [x1, yr, zr], [x1, y0, ze])
  }
}

/** A cross of square bars standing at (x, y) from z0, `h` tall, its arm across y. */
export function cross3(p: Part, x: number, y: number, z0: number, h: number, t = 0.3) {
  block(p, x - t / 2, x + t / 2, y - t / 2, y + t / 2, z0, z0 + h)
  block(p, x - t / 2, x + t / 2, y - h * 0.28, y + h * 0.28, z0 + h * 0.6, z0 + h * 0.6 + t)
}

// ---------------------------------------------------------------------------
if (import.meta.main) {
  const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), render = new Part(), door = new Part()
  const YC = -2.0 // centre line
  const XF = 36.9 // the east front
  const E: XY = [1, 0], Wd: XY = [-1, 0], N: XY = [0, 1], S: XY = [0, -1]
  // the wall-face frame: along-coordinate s for a face; for E faces s runs with +y, for S with +x, for N with -x, for W with -y
  const sE = (y: number) => y, sS = (x: number) => x, sN = (x: number) => -x, sW = (y: number) => -y

  // ---- the nave (1868-1873): limestone walls to the eaves, pitched roof ----
  const NX0 = 4.5, NX1 = 30.6, NY0 = -13.6, NY1 = 9.6, EAVE = 9.9, RIDGE = 15.6
  block(stone, NX0, NX1, NY0, NY1, 0, EAVE, 0, null)
  pitchedX(roof, stone, NX0, 36.4, NY0, NY1, EAVE, RIDGE, YC, 0.35)
  // buttresses and lancets along both sides, six bays
  const BX = [5.0, 9.3, 13.6, 17.9, 22.2, 26.5]
  for (const [yw, n] of [[NY0, S], [NY1, N]] as [number, XY][]) {
    const out = n[1]
    for (const x of [...BX, 30.6]) {
      const y0 = out < 0 ? yw - 0.7 : yw, y1 = out < 0 ? yw : yw + 0.7
      block(stone, x - 0.45, x + 0.45, y0, y1, 0, 8.6, 0.15)
      // the sloped set-off at the top
      const yo = out < 0 ? y0 : y1
      stone.quad(...((out < 0
        ? [[x - 0.45, yo, 8.6], [x + 0.45, yo, 8.6], [x + 0.45, yw, 10.4], [x - 0.45, yw, 10.4]]
        : [[x + 0.45, yo, 8.6], [x - 0.45, yo, 8.6], [x - 0.45, yw, 10.4], [x + 0.45, yw, 10.4]]) as [V3, V3, V3, V3]))
    }
    for (let i = 0; i < BX.length; i++) {
      const xm = (BX[i] + (BX[i + 1] ?? 30.6)) / 2
      const s = out < 0 ? sS(xm) : sN(xm)
      onWall(trim, [0, yw], n, lancetPts(s, 1.8, 3.7, 8.9), 0.03)
      onWall(win, [0, yw], n, lancetPts(s, 1.35, 4.0, 8.6), 0.06)
    }
  }

  // ---- the towers ----
  const TX0 = 30.6, TX1 = XF
  const TOW: [number, number][] = [[2.3, 9.6], [-13.6, -6.3]]
  const CORN = 24.6, EAVES = 25.0, CAP = 27.1
  for (const [y0, y1] of TOW) {
    const yc = (y0 + y1) / 2, outer = yc > YC ? 1 : -1
    // shaft to the string course, then the belfry stage set back 0.15
    block(stone, TX0, TX1, y0, y1, 0, 14.4)
    block(trim, TX0 - 0.15, TX1 + 0.15, y0 - 0.15, y1 + 0.15, 14.4, 14.75, 0.1)
    block(stone, TX0 + 0.1, TX1 - 0.1, y0 + 0.1, y1 - 0.1, 14.75, CORN, 0, null)
    // cornice, deep eaves and the low pyramid cap
    block(trim, TX0 - 0.15, TX1 + 0.15, y0 - 0.15, y1 + 0.15, CORN, EAVES, 0.12, null)
    block(roof, TX0 - 0.75, TX1 + 0.75, y0 - 0.75, y1 + 0.75, EAVES, EAVES + 0.22, 0, null)
    roof.quad([TX0 - 0.75, y0 - 0.75, EAVES], [TX0 - 0.75, y1 + 0.75, EAVES], [TX1 + 0.75, y1 + 0.75, EAVES], [TX1 + 0.75, y0 - 0.75, EAVES]) // soffit
    pyramid(roof, TX0 - 0.75, TX1 + 0.75, y0 - 0.75, y1 + 0.75, EAVES + 0.22, CAP)
    cross3(roof, (TX0 + TX1) / 2, yc, CAP - 0.1, 2.2)
    // corner buttresses at the front: on the front face at both edges, and on the outer side at the front corner
    for (const yb of [y0 + 0.5, y1 - 0.5]) {
      block(trim, TX1, TX1 + 0.95, yb - 0.55, yb + 0.55, 0, 7.0, 0.12)
      block(trim, TX1, TX1 + 0.7, yb - 0.55, yb + 0.55, 7.0, 15.0, 0.12)
      pyramid(trim, TX1, TX1 + 0.7, yb - 0.55, yb + 0.55, 15.0, 16.8)
    }
    const yo = outer > 0 ? y1 : y0
    block(stone, TX1 - 1.4, TX1 - 0.2, outer > 0 ? yo : yo - 0.7, outer > 0 ? yo + 0.7 : yo, 0, 7.0, 0.12)
    block(stone, TX1 - 1.4, TX1 - 0.2, outer > 0 ? yo : yo - 0.4, outer > 0 ? yo + 0.4 : yo, 7.0, 14.0, 0.12)
    // the belfry: two round-headed louvred openings under one arch on every face
    const faces: [XY, XY, number][] = [
      [[TX1 - 0.1, 0], E, sE(yc)], [[TX0 + 0.1, 0], Wd, sW(yc)],
      [[0, y1 - 0.1], N, sN((TX0 + TX1) / 2)], [[0, y0 + 0.1], S, sS((TX0 + TX1) / 2)],
    ]
    for (const [at, n, s] of faces) {
      onWall(trim, at, n, roundPts(s, 3.5, 15.3, 22.9, 10), 0.03)
      for (const d of [-0.78, 0.78]) onWall(win, at, n, roundPts(s + d, 1.0, 15.6, 22.2, 6), 0.06)
    }
    // the front: an oculus, a pair of lancets, the door under a gabled hood
    onWall(trim, [TX1, 0], E, circlePts(sE(yc), 12.1, 1.25, 16), 0.03)
    onWall(win, [TX1, 0], E, circlePts(sE(yc), 12.1, 0.8, 16), 0.06)
    for (const d of [-1.15, 1.15]) onWall(win, [TX1, 0], E, lancetPts(sE(yc) + d, 0.7, 6.5, 9.2), 0.06)
    onWall(trim, [TX1, 0], E, [[sE(yc) - 1.75, 4.4], [sE(yc) + 1.75, 4.4], [sE(yc), 6.7]], 0.25)
    block(trim, TX1, TX1 + 0.25, yc - 1.75, yc - 1.25, 0, 4.4)
    block(trim, TX1, TX1 + 0.25, yc + 1.25, yc + 1.75, 0, 4.4)
    onWall(win, [TX1, 0], E, lancetPts(sE(yc), 1.65, 3.2, 4.6), 0.06)
    onWall(door, [TX1, 0], E, rectPts(sE(yc) - 0.82, sE(yc) + 0.82, 0, 3.2), 0.06)
    // the outer side: the oculus and a lancet pair too
    const at: XY = [0, yo]
    onWall(trim, at, [0, outer], circlePts(outer > 0 ? sN(33.75) : sS(33.75), 12.1, 1.25, 16), 0.03)
    onWall(win, at, [0, outer], circlePts(outer > 0 ? sN(33.75) : sS(33.75), 12.1, 0.8, 16), 0.06)
    for (const d of [-1.1, 1.1]) onWall(win, at, [0, outer], lancetPts((outer > 0 ? sN(33.75) : sS(33.75)) + d, 0.7, 6.5, 9.2), 0.06)
  }

  // ---- the middle bay: parapet, gable, rose window and main door ----
  const MY0 = -6.3, MY1 = 2.3
  block(stone, TX0, XF, MY0, MY1, 0, 15.2, 0.15)
  // the gable, standing 0.3 proud of the front, steep, to 17.6
  const GW = 2.7
  block(stone, XF, XF + 0.3, YC - GW, YC + GW, 0, 15.2, 0, null)
  onWall(stone, [XF + 0.3, 0], E, [[sE(YC) - GW, 15.2], [sE(YC) + GW, 15.2], [sE(YC), 17.6]], 0)
  onWall(stone, [XF - 0.6, 0], Wd, [[sW(YC) - GW, 15.2], [sW(YC) + GW, 15.2], [sW(YC), 17.6]], 0)
  {
    // the gable's sloping tops (a 0.9 m thick slab), so it reads from the side
    const a: V3 = [XF + 0.3, YC - GW, 15.2], b: V3 = [XF + 0.3, YC, 17.6], c: V3 = [XF + 0.3, YC + GW, 15.2]
    const a2: V3 = [XF - 0.6, YC - GW, 15.2], b2: V3 = [XF - 0.6, YC, 17.6], c2: V3 = [XF - 0.6, YC + GW, 15.2]
    stone.quad(a2, a, b, b2); stone.quad(b, c, c2, b2)
  }
  cross3(trim, XF, YC, 17.5, 1.3, 0.22)
  // pinnacle buttresses either side of the gable
  for (const y of [YC - GW - 0.45, YC + GW + 0.45]) {
    block(trim, XF, XF + 0.85, y - 0.5, y + 0.5, 0, 16.2, 0.1)
    pyramid(trim, XF, XF + 0.85, y - 0.5, y + 0.5, 16.2, 18.6)
  }
  // rose window in its surround
  onWall(trim, [XF + 0.3, 0], E, circlePts(sE(YC), 11.4, 1.65, 16), 0.03)
  onWall(win, [XF + 0.3, 0], E, circlePts(sE(YC), 11.4, 1.2, 16), 0.06)
  for (let k = 0; k < 4; k++) {
    const a = (Math.PI * k) / 4, c = Math.cos(a), s = Math.sin(a), t = 0.08
    onWall(trim, [XF + 0.3, 0], E, [[sE(YC) - 1.2 * c - t * s, 11.4 - 1.2 * s + t * c], [sE(YC) - 1.2 * c + t * s, 11.4 - 1.2 * s - t * c], [sE(YC) + 1.2 * c + t * s, 11.4 + 1.2 * s - t * c], [sE(YC) + 1.2 * c - t * s, 11.4 + 1.2 * s + t * c]], 0.09)
  }
  // two small lancets and the main door in its pointed surround
  for (const d of [-1.2, 1.2]) onWall(win, [XF + 0.3, 0], E, lancetPts(sE(YC) + d, 0.55, 6.9, 8.9), 0.06)
  onWall(trim, [XF + 0.3, 0], E, lancetPts(sE(YC), 3.2, 0, 5.7), 0.03)
  onWall(win, [XF + 0.3, 0], E, lancetPts(sE(YC), 2.3, 3.4, 4.8), 0.06)
  onWall(door, [XF + 0.3, 0], E, rectPts(sE(YC) - 1.15, sE(YC) + 1.15, 0, 3.4), 0.06)
  // a band of trim across the front over the doors
  block(trim, XF, XF + 0.4, MY0, YC - GW, 5.9, 6.25, 0, trim)
  block(trim, XF + 0.3, XF + 0.45, YC - GW, YC + GW, 5.9, 6.25, 0, trim)
  block(trim, XF, XF + 0.4, YC + GW, MY1, 5.9, 6.25, 0, trim)

  // ---- the old church (1738-1750), whitewashed ----
  const OLD: XY[] = [[-13.6, -5.0], [-11.2, -8.4], [-7.0, -10.4], [-3.0, -10.4], [-3.0, -13.0], [4.6, -13.0], [4.6, 3.0], [-2.0, 3.0], [-2.0, 6.4], [-7.2, 6.4], [-7.2, 2.6], [-11.6, 2.6], [-13.6, 0.6]]
  prism(render, OLD, 0, 10.0, roof, 0.2)
  // the low north wing with its parapet
  const WING: XY[] = [[-13.6, 0.6], [-11.6, 2.6], [-7.2, 2.6], [-7.2, 6.4], [-4.4, 6.4], [-4.4, 10.6], [-13.6, 10.6]]
  prism(render, WING, 0, 6.2, roof, 0.15)
  // the dome on a low drum, with its lantern and cross
  const DX = -4.5, DY = YC
  lathe(render, [[3.5, 10.0], [3.5, 10.5]], 16, [DX, DY])
  const prof: [number, number][] = []
  for (let i = 0; i <= 6; i++) { const a = (Math.PI / 2) * (i / 6); prof.push([Math.max(0.55, 3.2 * Math.cos(a)), 10.5 + 3.2 * Math.sin(a) * 0.85]) }
  lathe(render, [[3.5, 10.5], ...prof], 16, [DX, DY])
  lathe(render, [[0.55, 13.2], [0.55, 14.4], [0.75, 14.5], [0.0, 15.0]], 10, [DX, DY])
  cross3(render, DX, DY, 14.9, 1.2, 0.2)
  // a few deep window recesses on the west end
  onWall(door, [-13.6, 0], Wd, rectPts(sW(-1.6) - 0.5, sW(-1.6) + 0.5, 5.5, 7.0), 0.06)
  onWall(door, [-13.6, 0], Wd, rectPts(sW(6.5) - 0.6, sW(6.5) + 0.6, 0, 2.2), 0.06)

  // ---------------------------------------------------------------------------
  const OX = -12.39, OY = 1.34
  const all = [stone, trim, roof, win, render, door]
  shift(all, OX, OY)
  const FRONT = XF + OX - 0.5
  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : n[0] > 0.5 && p[0] > FRONT ? 1 : p[0] > FRONT - 6.5 ? 0.85 : n[1] > 0.5 ? 0.6 : 0.4)
  const dim = (p: V3, n: V3) => (n[2] > 0.7 ? 0.05 : 0.25)
  const parts = [
    { part: stone, material: { ...finish('fernando-limestone', 0xe6dfcf), floodlight: lit } },
    { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
    { part: roof, material: { ...PALETTE.roof, color: 0x8f989f } },
    { part: win, material: PALETTE.window },
    { part: render, material: { ...finish('fernando-whitewash', 0xf2efe8), floodlight: dim } },
    { part: door, material: finish('fernando-door', 0x5e4636) },
  ]
  const glb = writeGlb('San Fernando Cathedral', parts, {
    license: 'CC0-1.0', bearing: 4.5, elevation: 0, anchor: [29.424539, -98.494194],
    frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    replaces: ['way/80647022'],
  })
  console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
  const tris = report('San Fernando Cathedral', parts, glb, 5000)
  const out = new URL('../models/sat-san-fernando-cathedral.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}
