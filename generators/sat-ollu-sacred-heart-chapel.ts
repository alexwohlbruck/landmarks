/**
 * Sacred Heart Conventual Chapel, Our Lady of the Lake University, 411 SW
 * 24th Street, San Antonio, Texas (1923, Gothic Revival, Atlee B. Ayres):
 * the campus's landmark. A cross-plan church in buff brick with white cast
 * stone, facing EAST onto SW 24th Street up a broad stair: the central
 * tower with a pointed door, a tall traceried window and a balustrade, the
 * belfry stage with louvred lancets under steep gables and a clock, slim
 * corner pinnacles, and the tall green-grey octagonal spire with lucarnes
 * and a cross; the nave and transepts under steep grey roofs; a lower
 * polygonal sanctuary to the west. Original procedural geometry, CC0-1.0.
 *   bun generators/sat-ollu-sacred-heart-chapel.ts
 *
 * Identity: the brief asked for the university's Main Building "with its
 * chapel/spire if OSM maps them as one". It does not: the spire belongs to
 * this chapel, OSM way/912208751, a separate building 6 m south of the Main
 * Building (way/912208746), which is its own model (sat-our-lady-of-the-lake).
 *
 * Frame: bearing 7 (the outline is square to 0.1 m in it). x runs along the
 * nave towards the front (east), y the model's north, z up, metres. Origin
 * at the outline's area centroid (-98.543886, 29.425622), which is also the
 * second lidar grid's centre.
 *
 * Ground: the streets round it are flat (lidar 0.7-1.0), but the map's
 * terrain has a hollow inside the footprint about 1.1 m below the ground
 * at the front, and the map puts y = 0 in it. Heights below are lidar less
 * 0.8 (over the street), lifted 1.2 m, the walls running down to y = 0.
 * Elevation 0.
 *
 * Evidence
 * - OSM way/912208751 (building=church): the nave x 3.9..24.6, y -11.5..11.7;
 *   the transepts x -10.7..3.9, y -17..17.2; the sanctuary to x -24.1 with a
 *   canted west end. The outline stops at x 24.6; the lidar puts the tower
 *   at x 21..30, y -6..4, so the tower stands 5.4 m east of OSM's line (over
 *   the entrance forecourt; no other building there).
 * - USGS 3DEP lidar USGS_LPC_TX_Central_B2_2017_LAS_2019 (2017), 0.5 m grid
 *   (~/landmarks-scratch/satx/work/sat-our-lady-of-the-lake/lidarc.json),
 *   less 0.8: the nave's eaves 18.2 and ridge 25 on y -1; the transept ridge
 *   25 on x -2; the sanctuary 13-14; the tower's gables and pinnacle tops
 *   32-41, the spire's flanks to 57.8 near its axis (its needle missed).
 * - Photos (Wikimedia Commons), EVIDENCE:
 *   "Sacred Heart Conventual Chapel San Antonio Texas 2021.jpg" (Larry D.
 *     Moore, CC BY 4.0): the east front square on, scaled at 23 px/m from the
 *     tower's width and raised 26% so its belfry gables meet the lidar's 41:
 *     the shaft to 29 with its balustrade, the belfry to 37, gables to 41,
 *     pinnacles to 46, the spire from 37 to 62.5, the cross to 65; the
 *     door, the traceried window, the clock;
 *   "Our Lady of the Lake University, San Antonio, Texas.jpg" (Zereshk, CC
 *     BY 3.0): the belfry and spire from the north-east.
 *
 * Estimated: the spire's tip (62.5) and cross, extrapolated from its flank
 * slope and the photo (no published height found); the sides and the west
 * end, which no photo here shows. Bolder than real: the pinnacles, the
 * lucarnes and the clock.
 *
 * Night: the tower floodlit, the windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, lathe, report, writeGlb, type XY } from './sf-de-young'
import { onWall, rectPts, circlePts, lancetPts, block, pyramid, cross3 } from './sat-san-fernando-cathedral'

const brick = new Part(), white = new Part(), roof = new Part(), spire = new Part(), win = new Part(), door = new Part()
const E: XY = [1, 0], N: XY = [0, 1], S: XY = [0, -1]
const sE = (y: number) => y, sN = (x: number) => -x, sS = (x: number) => x
const YC = -1.0, EAVE = 18.2, RIDGE = 25.0

// ---- nave (along x) and transept (along y), steep pitched roofs ----
block(brick, 3.9, 24.6, -11.5, 11.7, 0, EAVE, 0, null)
roof.quad([3.9, -11.9, EAVE - 0.2], [24.9, -11.9, EAVE - 0.2], [24.9, YC, RIDGE], [3.9, YC, RIDGE])
roof.quad([24.9, 12.1, EAVE - 0.2], [3.9, 12.1, EAVE - 0.2], [3.9, YC, RIDGE], [24.9, YC, RIDGE])
block(brick, -10.7, 3.9, -17.0, 17.2, 0, EAVE, 0, null)
const XT = -3.4
roof.quad([-11.0, 17.5, EAVE - 0.2], [-11.0, -17.3, EAVE - 0.2], [XT, -17.3, RIDGE], [XT, 17.5, RIDGE])
roof.quad([4.2, -17.3, EAVE - 0.2], [4.2, 17.5, EAVE - 0.2], [XT, 17.5, RIDGE], [XT, -17.3, RIDGE])
// the transept gable ends with a big traceried window each
for (const [yw, n] of [[-17.0, S], [17.2, N]] as [number, XY][]) {
  const s = (x: number) => (n[1] < 0 ? sS(x) : sN(x))
  onWall(brick, [0, yw], n, [[s(-10.7), EAVE], [s(3.9), EAVE], [s(XT), RIDGE + 0.4]].sort((a, b) => a[0] - b[0]) as XY[], 0)
  onWall(white, [0, yw], n, lancetPts(s(XT), 5.2, 5.0, 16.6), 0.03)
  onWall(win, [0, yw], n, lancetPts(s(XT), 4.2, 5.4, 16.0), 0.06)
  for (const d of [-1.05, 1.05]) onWall(white, [0, yw], n, rectPts(s(XT) + d - 0.09, s(XT) + d + 0.09, 5.4, 13.0), 0.08)
  for (const x of [-10.7, 3.9]) block(white, x - 0.4, x + 0.4, n[1] < 0 ? yw - 0.6 : yw, n[1] < 0 ? yw : yw + 0.6, 0, EAVE + 2.5, 0.08)
}
// the nave's front gable either side of the tower, and lancets along its sides
onWall(brick, [24.6, 0], E, [[sE(-11.5), EAVE], [sE(11.7), EAVE], [sE(YC), RIDGE + 0.4]], 0)
for (const x of [7.5, 12.5, 17.5]) {
  onWall(win, [0, -11.5], S, lancetPts(sS(x), 1.8, 6.0, 15.0), 0.06)
  onWall(win, [0, 11.7], N, lancetPts(sN(x), 1.8, 6.0, 15.0), 0.06)
}
for (const y of [-8.0, 6.0]) onWall(win, [24.6, 0], E, lancetPts(sE(y), 2.0, 6.0, 14.5), 0.06)
// buttresses
for (const x of [3.9, 10, 15, 20, 24.6]) for (const [yw, sg] of [[-11.5, -1], [11.7, 1]]) block(white, x - 0.45, x + 0.45, sg < 0 ? yw - 0.7 : yw, sg < 0 ? yw : yw + 0.7, 0, 15.5, 0.1)

// ---- the sanctuary: lower, with a canted west end ----
prism(brick, [[-10.7, -14.1], [-10.7, 13.9], [-20.9, 13.9], [-20.9, 6.8], [-24.1, 2.3], [-24.0, -2.6], [-20.9, -6.8], [-20.6, -14.1]], 0, 12.6, null)
prism(roof, [[-10.7, -14.4], [-10.7, 14.2], [-21.2, 14.2], [-21.2, 6.9], [-24.4, 2.3], [-24.3, -2.6], [-21.2, -6.9], [-20.9, -14.4]], 12.6, 13.2, roof)
for (const y of [-8, 0, 8]) onWall(win, [-20.9, 0], [-1, 0], lancetPts(-y, 1.4, 5.0, 10.6), 0.06)

// ---- the tower ----
{
  const x0 = 21.0, x1 = 30.0, y0 = YC - 4.5, y1 = YC + 4.5, cx = (x0 + x1) / 2
  block(brick, x0, x1, y0, y1, 0, 28.4, 0, null)
  // corner buttresses in white stone, carried up into the pinnacles
  for (const [px, py] of [[x1, y0], [x1, y1], [x0, y0], [x0, y1]]) {
    block(white, px - 0.75, px + 0.75, py - 0.75, py + 0.75, 0, 41.0, 0.1)
    pyramid(white, px - 0.75, px + 0.75, py - 0.75, py + 0.75, 41.0, 46.0)
  }
  // the balustrade and cornice at the top of the shaft
  block(white, x0 - 0.25, x1 + 0.25, y0 - 0.25, y1 + 0.25, 28.4, 29.6, 0.08)
  // the belfry stage, white, with a gable over each face
  block(white, x0 + 0.4, x1 - 0.4, y0 + 0.4, y1 - 0.4, 29.6, 37.0, 0, null)
  const faces: [XY, XY, number, number][] = [
    [[x1 - 0.4, 0], E, sE(YC), 1], [[x0 + 0.4, 0], [-1, 0], -YC, 1], [[0, y1 - 0.4], N, sN(cx), 1], [[0, y0 + 0.4], S, sS(cx), 1],
  ]
  for (const [at, n, s] of faces) {
    onWall(white, at, n, [[s - 3.9, 37.0], [s + 3.9, 37.0], [s, 41.0]], 0)
    for (const d of [-0.9, 0.9]) onWall(win, at, n, lancetPts(s + d, 1.2, 30.6, 35.8), 0.06)
    onWall(white, at, n, circlePts(s, 38.5, 0.95, 12), 0.05)
    onWall(win, at, n, circlePts(s, 38.5, 0.7, 12), 0.08) // the clock face (glows at night like the real one)
  }
  // the front: the pointed door in a white surround, the tall traceried window
  onWall(white, [x1, 0], E, lancetPts(sE(YC), 4.0, 0, 8.2), 0.04)
  onWall(door, [x1, 0], E, lancetPts(sE(YC), 2.8, 0, 7.2), 0.07)
  onWall(white, [x1, 0], E, rectPts(sE(YC) - 2.4, sE(YC) + 2.4, 9.4, 10.0), 0.05)
  onWall(win, [x1, 0], E, lancetPts(sE(YC), 3.6, 11.0, 22.5), 0.06)
  for (const d of [-0.62, 0.62]) onWall(white, [x1, 0], E, rectPts(sE(YC) + d - 0.08, sE(YC) + d + 0.08, 11.0, 20.0), 0.09)
  // the stair up to the door
  for (let k = 0; k < 6; k++) block(white, x1, x1 + 6.0 - k * 1.0, YC - 3.5, YC + 3.5, 0, 0.25 * (k + 1), 0)
  // the spire: octagonal, from inside the gables to the tip, with lucarnes and a band
  const R0 = 3.6
  lathe(spire, [[R0, 37.0], [3.1, 41.5], [2.6, 46.0], [2.75, 46.2], [2.75, 46.6], [2.4, 46.8], [1.2, 56.0], [0.0, 62.5]], 8, [cx, YC], Math.PI / 8, false)
  for (let k = 0; k < 4; k++) {
    const a = (Math.PI / 2) * k, n: XY = [Math.cos(a), Math.sin(a)], t: XY = [-n[1], n[0]]
    const P = (sv: number, z: number, o: number): V3 => [cx + n[0] * o + t[0] * sv, YC + n[1] * o + t[1] * sv, z]
    const o1 = 3.3, o0 = 2.0
    spire.quad(P(-0.6, 41.0, o1), P(0.6, 41.0, o1), P(0.6, 42.6, o1), P(-0.6, 42.6, o1))
    spire.tri(P(-0.6, 42.6, o1), P(0.6, 42.6, o1), P(0, 43.8, o1))
    spire.quad(P(-0.6, 42.6, o0), P(-0.6, 42.6, o1), P(0, 43.8, o1), P(0, 43.8, o0))
    spire.quad(P(0, 43.8, o0), P(0, 43.8, o1), P(0.6, 42.6, o1), P(0.6, 42.6, o0))
    win.quad(P(-0.35, 41.2, o1 + 0.04), P(0.35, 41.2, o1 + 0.04), P(0.35, 42.4, o1 + 0.04), P(-0.35, 42.4, o1 + 0.04))
  }
  cross3(spire, cx, YC, 62.3, 2.8, 0.2)
}

// lift everything above the base by G (see Ground); the walls run down to y = 0
const G = 1.2
for (const p of [brick, white, roof, spire, win, door]) for (let i = 1; i < p.pos.length; i += 3) if (p.pos[i] > 0.001) p.pos[i] += G

// ---------------------------------------------------------------------------
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : p[0] > 20 ? 0.85 : 0.2)
const parts = [
  { part: brick, material: { ...finish('ollu-buff-brick', 0xdfcb9c), floodlight: lit } },
  { part: white, material: { ...finish('ollu-cast-stone', 0xf3f0e8), floodlight: lit } },
  { part: roof, material: { ...PALETTE.roof, color: 0x8f989c } },
  { part: spire, material: { ...finish('ollu-spire-copper', 0x7f958d), floodlight: (p: V3) => (p[2] < 50 ? 0.5 : 0.2) } },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('ollu-door', 0x7a4a36) },
]
const glb = writeGlb('Sacred Heart Conventual Chapel', parts, {
  license: 'CC0-1.0', bearing: 7, elevation: 0, anchor: [29.425622, -98.543886],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/912208751'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('Sacred Heart Conventual Chapel', parts, glb, 5000)
const out = new URL('../models/sat-ollu-sacred-heart-chapel.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
