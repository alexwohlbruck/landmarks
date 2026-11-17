/**
 * 1940 Air Terminal Museum, William P. Hobby Airport, Houston: the original
 * Houston Municipal Airport terminal (Joseph Finger, 1940), Streamline Art
 * Deco, white stucco, with the airport's first control cab on its roof.
 * Procedural, CC0-1.0.
 *
 *   bun generators/hou-hobby-1940-air-terminal.ts
 *
 * Form. A long, low, one-storey block runs north-south (the wings, with
 * rounded outer corners); in the middle a two-storey block projects 3 m
 * front and back (landside west on Travelair Street, airside east on the
 * museum apron). Above it the building steps up like a wedding cake:
 * a second storey spreading over the wings, two rounded shoulders north
 * and south, a chamfered (octagonal) third storey, a low green copper hip
 * roof, and the octagonal glazed control cab on top.
 *
 * Frame: x east, y north, z up, metres, bearing 0 (the OSM outline is
 * square to north within 0.3 degrees). Origin at the centroid of OSM
 * way/45765445 (aeroway=terminal, "Terminal Building"), the building
 * outline; the museum tags sit on the site way/1293782242, which is not a
 * building and is not replaced.
 *
 * Sources:
 * - OSM way/45765445: outline, 15.8 m x 51.3 m wings and a 21.7 m x 13.9 m
 *   central projection (measured).
 * - USGS 3DEP lidar TX_Coastal_B1_2018 (flight 2018), 0.5 m grid
 *   (tools/lidar.py), heights above the apron (measured): wing roof 5.6 m,
 *   parapet 6.5 m; central block roof 9.8 m, parapet 10.8 m; the second
 *   storey over the wings 9.5 m; shoulders 12.7 m; third-storey eaves
 *   17.5 m; hip roof to 19.5 m; cab roof 23.9 m (railing 24.8 m, left out).
 *   The lidar footprint sits about 0.6 m east of OSM; OSM is followed.
 *   Shoulders (x -2..4, y +-7..10) and tower (about 12 m across, chamfered
 *   corners) are read from the lidar grid.
 * - USGS NAIP (tools/usgs.py naip): the plan, white roofs, the central
 *   round-cornered tower.
 * - Photo a1 "1940 Air Terminal Museum.jpg", Mlickliter, CC BY-SA 3.0, from
 *   the east (airside): the stepped centre, cab, green hip roof, wing
 *   pilasters rising above the parapet, the tall glazed entrance bay.
 *   https://commons.wikimedia.org/wiki/File:1940_Air_Terminal_Museum.jpg
 * - Photo a2 "1940sAirTerminalMuseumHobby.JPG", WhisperToMe, CC0, from the
 *   west (landside): tall wing windows, the rounded wing ends, the shoulders
 *   and octagonal upper storey, the cab's railing.
 *   https://commons.wikimedia.org/wiki/File:1940sAirTerminalMuseumHobby.JPG
 * - Photo a3 "The 'Winged Mercury' bas-relief atop the entrance ...",
 *   Carol M. Highsmith, public domain (LoC): the relief over the entrance
 *   (too fine to model; noted only).
 *   https://commons.wikimedia.org/wiki/File:The_%22Winged_Mercury%22_bas-relief_atop_the_entrance_to_the_1940_Air_Terminal_Museum,_designed_by_architect_Joseph_Finger_(who_also_designed_Houston%27s_City_Hall)_and_housed_in_the_original_art-deco_LCCN2014632542.tif
 * - Published: built 1940, architect Joseph Finger (Wikipedia, "1940 Air
 *   Terminal Museum"; Library of Congress captions).
 *
 * Roofs are pale (NAIP shows them near-white), drawn a light grey.
 * Estimated: window sizes and counts (from a1/a2, scaled to the wing
 * height); the cab's width (6 m, lidar and a1); rounded corner radii (2 m,
 * a2). Colours: warm white stucco, green copper hip roof, green-tinted cab
 * glass, all from a1/a2.
 *
 * Doubts: the north and south ends are not photographed (drawn plain with
 * the same windows); the stepped centre's exact plan between the lidar
 * cells is simplified to rectangles; railings and antennas are left out.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, walls, cap, roundRect, rect, clean, type XY } from './clt-terminal'

const wall = new Part(), roof = new Part(), win = new Part(), copper = new Part(), cab = new Part()

// The outline is symmetric about this point (centre of the OSM wings).
const CX = -0.1, CY = -0.25
const at = (r: XY[]): XY[] => r.map(([x, y]) => [x + CX, y + CY] as XY)

const H_WING = 6.5, H_MID = 10.8, H_UP = 9.6, H_SH = 12.7, H_TW = 17.5, H_HIP = 19.5, H_CAB = 23.3, H_CABTOP = 23.9

/** A chamfered square (octagon with long faces on the axes), counter-clockwise. */
function octo(a: number, c: number, cx = CX, cy = CY): XY[] {
  return [[a - c, -a], [a, -a + c], [a, a - c], [a - c, a], [-a + c, a], [-a, a - c], [-a, -a + c], [-a + c, -a]]
    .map(([x, y]) => [x + cx, y + cy] as XY)
}

/** Flat slate panel on the face a→b of a counter-clockwise ring (outward = right of travel). */
function panel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out = 0.05) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, z]
  p.quad(P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1))
}

// ------------------------------------------------------------ wings
const WX0 = -7.95, WX1 = 7.85, WY0 = -25.65, WY1 = 25.65
block(wall, roof, at(roundRect(WX0, WY0, WX1, WY1, [2, 2, 2, 2], 3)), 0, H_WING, 0.35)

// Wing windows: tall panels between piers, 7 per wing on each long face.
// Wing faces run y from the centre block (|y| 9.6) out to the rounded end.
for (const side of [-1, 1]) {
  const y0 = 10.2, y1 = 24.6, n = 6, w = (y1 - y0) / n
  for (let k = 0; k < n; k++) {
    const ya = side * (y0 + k * w + 0.55), yb = side * (y0 + (k + 1) * w - 0.55)
    const lo = Math.min(ya, yb) + CY, hi = Math.max(ya, yb) + CY
    // landside (west face, outward -x): long windows, a2
    panel(win, [WX0 + CX, hi], [WX0 + CX, lo], 0, hi - lo, 0.9, 5.0)
    // airside (east face): a1 shows shorter windows set high
    panel(win, [WX1 + CX, lo], [WX1 + CX, hi], 0, hi - lo, 1.6, 5.0)
  }
  // airside pilasters between the windows, rising just above the parapet (a1)
  for (let k = 0; k <= n; k++) {
    const y = side * (y0 + k * w) + CY
    block(wall, wall, [[WX1 + CX, y - 0.35], [WX1 + CX + 0.35, y - 0.35], [WX1 + CX + 0.35, y + 0.35], [WX1 + CX, y + 0.35]], 0, H_WING + 0.5, 0.1)
  }
  // end walls: one wide window each side of centre (plan, undocumented)
  const yE = side > 0 ? WY1 + CY : WY0 + CY
  const a: XY = side > 0 ? [WX1 + CX, yE] : [WX0 + CX, yE], b: XY = side > 0 ? [WX0 + CX, yE] : [WX1 + CX, yE]
  panel(win, a, b, 4.5, 11.3, 1.6, 4.6)
}

// ------------------------------------------------------------ the stepped centre
// two-storey projecting block (OSM central bump)
block(wall, roof, at(rect(-10.95, -6.95, 10.75, 6.95)), 0, H_MID, 0.4)
// second storey spreading over the wings
block(wall, roof, at(roundRect(-7.6, -9.6, 7.5, 9.6, [1.5, 1.5, 1.5, 1.5], 3)), H_WING - 0.4, H_UP, 0.35)
// shoulders, north and south, round-cornered (a1, a2, lidar 12.7 m)
block(wall, roof, at(roundRect(-4.2, -10.2, 4.2, 10.2, [2.2, 2.2, 2.2, 2.2], 3)), H_UP - 0.4, H_SH, 0.35)
// third storey: chamfered square, 12 m across
const TW = octo(6.0, 2.0)
block(wall, null, TW, H_SH - 0.4, H_TW, 0.3)
// green copper hip roof, from the eaves up to the cab's base
const eave = octo(6.15, 2.05), top = octo(3.5, 1.2)
walls(copper, eave, H_TW - 0.35, H_TW)
cap(copper, eave, H_TW - 0.35, false)
walls(copper, eave, H_TW, H_HIP, top)
cap(roof, top, H_HIP)
// the cab: octagon, green glass between thin posts, a flat roof slab
const C = octo(3.05, 1.0)
for (let i = 0; i < C.length; i++) {
  const a = C[i], b = C[(i + 1) % C.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  // the window runs post to post; posts in wall colour
  panel(cab, a, b, 0, L, H_HIP + 0.9, H_CAB, 0)
}
walls(wall, C, H_HIP, H_HIP + 0.9)
const cabTop = octo(3.35, 1.1)
block(copper, copper, cabTop, H_CAB, H_CABTOP, 0.2, copper)
for (const q of C) {
  const s = 0.18
  block(wall, null, [[q[0] - s, q[1] - s], [q[0] + s, q[1] - s], [q[0] + s, q[1] + s], [q[0] - s, q[1] + s]], H_HIP + 0.9, H_CAB, 0)
}

// ------------------------------------------------------------ centre windows
// The tall glazed entrance bays, east and west (a1, a2), 5 m wide.
panel(win, [10.75 + CX, -2.6 + CY], [10.75 + CX, 2.6 + CY], 0, 5.2, 0.2, 8.6)
panel(win, [-10.95 + CX, 2.6 + CY], [-10.95 + CX, -2.6 + CY], 0, 5.2, 0.2, 8.6)
// Second-storey windows each side of the bays, on the projecting block.
for (const [x, dir] of [[10.75, 1], [-10.95, -1]] as const) {
  for (const s of [-1, 1]) {
    const ya = s * 4.0 + CY, yb = s * 6.0 + CY
    const lo = Math.min(ya, yb), hi = Math.max(ya, yb)
    const a: XY = dir > 0 ? [x + CX, lo] : [x + CX, hi], b: XY = dir > 0 ? [x + CX, hi] : [x + CX, lo]
    panel(win, a, b, 0, 2, 6.0, 8.6)
    panel(win, a, b, 0, 2, 1.4, 4.4)
  }
}
// Shoulder windows, north and south faces (a1).
for (const s of [-1, 1]) {
  const y = s * 10.2 + CY
  const a: XY = s > 0 ? [1.3 + CX, y] : [-1.3 + CX, y], b: XY = s > 0 ? [-1.3 + CX, y] : [1.3 + CX, y]
  panel(win, a, b, 0, 2.6, 10.3, 11.9)
  panel(win, a, b, 0, 2.6, 7.2, 8.8)
}
// Third storey: a wide window on each long face (a1, a2).
for (let i = 0; i < TW.length; i++) {
  const a = TW[i], b = TW[(i + 1) % TW.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L > 5) panel(win, a, b, L / 2 - 2.3, L / 2 + 2.3, 14.0, 16.2)
}

// ------------------------------------------------------------ output
const parts = [
  { part: wall, material: finish('stucco', 0xf3eee4) },
  { part: roof, material: finish('roof-pale', 0xd6d7d2) },
  { part: win, material: PALETTE.window },
  { part: copper, material: finish('copper-roof', 0x8fb7a4) },
  { part: cab, material: finish('glass-cab', 0x5f8f80, 0.24) },
]
// rename so the cab stays dark like other structural glass
parts[4].material.name = 'glass'
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('1940 Air Terminal Museum', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, height: H_CABTOP,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/45765445'],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/hou-hobby-1940-air-terminal.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
void clean
