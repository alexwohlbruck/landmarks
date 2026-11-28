/**
 * The Long Center for the Performing Arts (2008, Zimmer Gunsul Frasca),
 * 701 West Riverside Drive, Austin, built inside the shell of Palmer
 * Auditorium (1959) — procedural, CC0-1.0, no textures.
 *   bun generators/atx-long-center.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 48, the hall's axis
 * (fitted to the lidar), so +y points north-east, from the stage through
 * the hall to the terrace and downtown across the river. Anchor = area
 * centroid of OSM way/187668220, -97.751191, 30.260191. z = 0 is the
 * lowest ground under the footprint (the lawn on the east); heights below
 * are lidar minus 0.4.
 *
 * Identity: Palmer Auditorium's old roof ring, a thin white circle 95 m
 * across, kept on tall white round columns over the terrace in front of the
 * hall; the hall behind it, a tall box clad in green, gold and tan tile
 * mosaic over a glass curtain wall facing the terrace, mid grey side
 * blocks, the brown-grey stage house behind, and low white wings filling the back half of
 * the ring.
 *
 * Numbers (lidar = USGS 3DEP USGS_LPC_TX_Central_B1_2017_LAS_2019, flown
 * 2017, 1 m grid read in this frame; all measured unless noted):
 *  - the ring: a circle centred (0, 20), 41.5-47.5 m radius, its top at
 *    14.9; the fascia 1.7 m deep (estimated from "barera12"); the low wings
 *    under its back half at 14.6 (lidar 15.4 with the ring);
 *  - the terrace inside the ring's front half is ground at z 4.8 (lidar and
 *    the map's terrain), not modelled; the columns run from it to the ring;
 *  - 11 columns, 1.7 m across, every 13 degrees round the open front arc:
 *    counted and scaled on "barera12";
 *  - the hall x -18..15, y -14..28, to 28.0 with its parapet;
 *  - the fly tower x -15..12, y -32..-16, to 32.0;
 *  - the side blocks x -30..-21, y 10..31 and x 18..30, y 10..25, to 21.0;
 *  - the loading blocks at the back, y -44..-32, to 9.5 and 17;
 *  - the curtain wall to 20.5 and the mosaic over it: from "lsm-a".
 *    Cross-check of the hall against the ring in "lsm-a" (taken from far
 *    off, so little perspective): the hall's top stands 2.2 times as high
 *    over the terrace as the ring does; lidar gives 23.3 / 10.1 = 2.3. In
 *    "barera12", taken close and low, the hall looks lower only because it
 *    stands 36 m behind the ring's front.
 *  - colours from "lsm-a" (sampled, pulled to the palette's lightness):
 *    the tile mosaic one olive-tan (green, olive and tan tiles averaged,
 *    #93907b), the side blocks mid grey panel (#797577), the stage house
 *    a warm brown-grey (grey above, brick below);
 *  - the hall's terrace face from "lsm-a": a curtain wall in 7 broad bays
 *    and two groups of floors up to about the ring's height (15.4), a few
 *    panels tiled like the mosaic, a glass band over it (16.4-20.4), and
 *    the mosaic block above;
 *  - the wings are set 2.5 m inside the ring's inner edge, so the ring
 *    stands clear as a band on its columns all round ("barera12" shows the
 *    columns outside the wings at both ends).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  barera12 "Austin August 2019 12 (Long Center for the Performing Arts).jpg",
 *           Michael Barera, CC BY-SA 4.0 (from the north-east lawn: the ring
 *           and its columns, the curtain wall, the mosaic)
 *           https://commons.wikimedia.org/wiki/File:Austin_August_2019_12_(Long_Center_for_the_Performing_Arts).jpg
 *  lsm-a    "LongCenter-2010a.JPG", LoneStarMike, CC BY-SA 3.0 (from across
 *           the river: the hall, the fly tower, the low wings)
 *           https://commons.wikimedia.org/wiki/File:LongCenter-2010a.JPG
 *  fred     "Long Center for the Performing Arts 2016.JPG", Fredlyfish4,
 *           CC BY-SA 4.0 (panorama from the north-west)
 *           https://commons.wikimedia.org/wiki/File:Long_Center_for_the_Performing_Arts_2016.JPG
 * Also USGS NAIP (plan). No look-only sources, no commercial imagery.
 *
 * Replaces the outline (way/187668220) and the ring's roof part over the
 * terrace (way/452460572, building=roof). The H-E-B Stage (way/1450283595,
 * building=no) north-east of the ring is left to the map.
 *
 * Doubts: the column count and the fascia depth are photo estimates; the
 * low wings' facades are drawn as plain window bands; the mosaic is one
 * mixed colour. Left out: the terrace's stairs and railings, signs, the
 * ring's lights.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, ccw, circle, column, prism, save, smoothWall, type XY } from './atl-flatiron-building'

const white = new Part(), glass = new Part(), mosaic = new Part(), grey = new Part(), brick = new Part(), roof = new Part()

const C: XY = [0, 20], RI = 41.5, RO = 47.5, RING_TOP = 14.9, RING_BOT = 13.2
const SEG = 48

// ── the ring ──────────────────────────────────────────────────────────────

const outer = circle(C, RO, SEG), inner = circle(C, RI, SEG)
smoothWall(white, outer, RING_BOT, RING_TOP)
smoothWall(white, [...inner].reverse(), RING_BOT, RING_TOP)
for (let i = 0; i < SEG; i++) {
  const j = (i + 1) % SEG
  white.quad([inner[i][0], inner[i][1], RING_TOP], [outer[i][0], outer[i][1], RING_TOP], [outer[j][0], outer[j][1], RING_TOP], [inner[j][0], inner[j][1], RING_TOP])
  white.quad([inner[i][0], inner[i][1], RING_BOT], [inner[j][0], inner[j][1], RING_BOT], [outer[j][0], outer[j][1], RING_BOT], [outer[i][0], outer[i][1], RING_BOT])
}
// the columns round the open front arc, on the terrace (z 4.8; run on
// down into it)
// and on round the back, standing clear of the set-back wings ("barera12"
// shows them outside the wings at both ends), except where the stage
// house passes under the ring
const BLOCKS = [[-16, 13, -45, -14]]
for (let a = 25; a < 25 + 360 - 1; a += 13) {
  const r = (a * Math.PI) / 180, R = (RI + RO) / 2
  const p: XY = [C[0] + R * Math.cos(r), C[1] + R * Math.sin(r)]
  if (BLOCKS.some(([x0, x1, y0, y1]) => p[0] > x0 && p[0] < x1 && p[1] > y0 && p[1] < y1)) continue
  const front = a <= 155.1
  column(white, p, 0.85, front ? 3.0 : 0, RING_BOT, 12)
}

// ── the low wings filling the ring's back half ────────────────────────────

const WING = 14.6
const wing: XY[] = []
{
  const arc: XY[] = []
  for (let k = 0; k <= 28; k++) {
    const a = ((160 + (k * 220) / 28) * Math.PI) / 180 // 160° → 380° (= 20°), round the back
    arc.push([C[0] + (RI - 2.5) * Math.cos(a), C[1] + (RI - 2.5) * Math.sin(a)])
  }
  wing.push(...arc, [27, 33], [24, 28], [15.5, 28], [15.5, 20], [-18.5, 20], [-18.5, 28], [-30, 28], [-30, 33])
}
const WING_R = ccw(wing)
prism(white, WING_R, 0, WING, roof, 0.3)
// window bands in the wings' outer wall, between the plain piers
for (let i = 0; i < WING_R.length; i++) {
  const a = WING_R[i], b = WING_R[(i + 1) % WING_R.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 3) continue
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const P = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * 0.06, a[1] + t[1] * s + n[1] * 0.06, z]
  for (const [z0, z1] of [[5.6, 9.4], [10.4, 13.4]]) glass.quad(P(0.6, z0), P(L - 0.6, z0), P(L - 0.6, z1), P(0.6, z1))
}

// ── the hall, side blocks, fly tower ──────────────────────────────────────

box(mosaic, -18, 15, -14, 28, 0, 28.0, roof, 0.4)
/** A flush window panel on the wall from a to b (outside to the right of a→b). */
function panel(a: XY, b: XY, z0: number, z1: number, p: Part = glass, o = 0.06) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L * o, -(b[0] - a[0]) / L * o]
  p.quad([a[0] + n[0], a[1] + n[1], z0], [b[0] + n[0], b[1] + n[1], z0], [b[0] + n[0], b[1] + n[1], z1], [a[0] + n[0], a[1] + n[1], z1])
}
// the curtain wall over the terrace (the hall's north-east face)
// ("lsm-a"): a pale frame carrying, below about the ring's height, a big
// curtain wall in broad bays (two groups of floors), a few of its panels
// tiled like the mosaic; over it a horizontal glass band; the mosaic block
// above. x runs west to east along the face at y 28.
const HF = (x: number): XY => [x, 28]
panel(HF(14.5), HF(-17.5), 4.8, 20.8, white, 0.03)
const BAYS = 7, X0 = -17, X1 = 14, BW = (X1 - X0) / BAYS
for (let k = 0; k < BAYS; k++) {
  const xa = X0 + k * BW + 0.3, xb = X0 + (k + 1) * BW - 0.3
  for (const [z0, z1] of [[5.0, 9.9], [10.5, 15.4]]) panel(HF(xb), HF(xa), z0, z1)
  panel(HF(xb), HF(xa), 16.4, 20.4) // the band over the curtain wall
}
// the tiled accent panels in the curtain wall
for (const [k, z0, z1] of [[1, 10.5, 12.2], [3, 7.6, 9.9], [4, 13.4, 15.4], [6, 10.5, 12.2], [2, 16.4, 17.6], [5, 16.4, 17.6]] as [number, number, number][])
  panel(HF(X0 + (k + 1) * BW - 0.3), HF(X0 + k * BW + 0.3), z0, z1, mosaic, 0.09)
box(grey, -30, -21, 10, 31, 0, 21.0, roof, 0.4)
box(grey, 18, 30, 10, 25, 0, 21.0, roof, 0.4)
// window bands on the side blocks over the wings
panel([-21, 13], [-21, 29], 15.5, 19.5)
panel([-30, 29], [-30, 12], 15.5, 19.5)
panel([-21, 31], [-29, 31], 15.5, 19.5)
panel([30, 12], [30, 23], 15.5, 19.5)
panel([29, 25], [19, 25], 15.5, 19.5)
box(brick, -15, 12, -32, -16, 0, 32.0, roof, 0.4)
// the back: loading blocks behind the fly tower
box(white, -24, 27, -44, -32, 0, 9.5, roof, 0.3)
box(brick, -9, 9, -41, -32, 0, 17.0, roof, 0.3)

if (import.meta.main) {
  await save('atx-long-center', 'The Long Center for the Performing Arts', [
    { part: white, material: { ...PALETTE.trim, floodlight: (_p, n) => (n[2] > 0.7 ? 0.2 : 0.8) } },
    { part: glass, material: PALETTE.window },
    { part: mosaic, material: finish('long-mosaic-tile', 0xa2a084) },
    { part: grey, material: finish('long-grey-panel', 0x8f8c8c) },
    { part: brick, material: finish('long-fly-tower', 0x8e8178) },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 48, height: 32.0, replaces: ['way/187668220', 'way/452460572'] })
}
