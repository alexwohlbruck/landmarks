/**
 * Neighborhood Theatre, NoDa, Charlotte (1945 cinema, now a music venue) —
 * procedural, CC0-1.0.
 * bun generators/neighborhood-theatre.ts
 *
 * Map frame: x east, y north, z up, metres, placed at bearing 52°: the
 * model's +y runs back from East 36th Street along the outline's long side
 * (way/967830177, 16.9 × 33.6 m), so the street front is the model's south
 * face. The anchor is the outline's centroid.
 *
 * A small club is its front: a stepped parapet, taller in the middle, painted
 * with the big colourful mural; a three-sided marquee box over the doors (OSM
 * draws its roof, way/1411146348: 6.3 m at the wall, 2 m at the front, 2.7 m
 * deep); flat attraction boards on the wall either side; a plain stucco ground
 * floor with the doors and poster cases. Behind it the auditorium is a plain
 * box. The boards carry no lettering; they are the `entrance` material so the
 * marquee lights up at night, as the real one does.
 *
 * The street slopes away behind the theatre: lidar puts the front sidewalk
 * 3.0 m above the lowest ground at the back, so the walls run down to y = 0
 * and the front starts at G.
 *
 * Rework (2026-10): forms kept (stepped front, mural, three-sided marquee,
 * side boards, plain auditorium). Changes, each from the Mecklenburg 2016
 * lidar (USGS 3DEP, 0.5 m cells, sampled in this frame) and the 2024 street
 * photo:
 * - G 2.0 -> 3.0 m: lidar ground 3.0 m at the front sidewalk, 0 at the rear.
 * - The marquee was 1.1 m too high: lidar puts its top 3.8 m above the
 *   sidewalk, and the photo (scaled by the 7.7 m centre parapet) its board
 *   2.6-3.7 m. The side boards and the mural's lower edge move down with it.
 * - Parapets: centre 7.7 m above the sidewalk (was 9.6), sides 6.95 (was
 *   8.2). Centre section 7.0 m wide (was 8.4), from lidar and the photo.
 * - The auditorium roof is a shallow ridge running front to back, not flat:
 *   lidar reads 9.3 m at both side walls and 10.3 m on the centre line.
 * The lidar sits about 1.4 m east of OSM here (the marquee centres differ by
 * that); the outline and marquee plan stay on OSM.
 *
 * Measured: outline and marquee plan (OSM), every height (lidar). Estimated:
 * the boards, doors and poster cases, from the photo. The mural is reduced to
 * a warm field with three teal sweeps; its real reds, yellows and pinks are
 * averaged into the warm colour.
 *
 * References: City Dweller 2, "Neighborhood Theatre Mid-April 2024", "... along
 * 36th St" and "... alley" (Commons, CC BY-SA 4.0); James Willamor,
 * "Neighborhood Theater, NoDa, Charlotte - panoramio" (Commons, CC BY-SA 3.0).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const stucco = new Part(), mural = new Part(), teal = new Part()
const board = new Part(), roof = new Part(), win = new Part()

type XY = [number, number]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n?: V3 | V3[]) {
  const N = n === undefined ? undefined : Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3, n as V3]
  p.tri(a, b, c, undefined, undefined, undefined, N && [N[0], N[1], N[2]])
  p.tri(a, c, d, undefined, undefined, undefined, N && [N[0], N[2], N[3]])
}
const S: V3 = [0, -1, 0], E: V3 = [1, 0, 0], W: V3 = [-1, 0, 0], NN: V3 = [0, 1, 0], UP: V3 = [0, 0, 1], DN: V3 = [0, 0, -1]

/** An axis-aligned box with a chamfer of b round its top edge. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0, top: Part | null = p, sides = [true, true, true, true]) {
  const zt = z1 - b
  if (sides[0]) quadN(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, zt], [x0, y0, zt], S)
  if (sides[1]) quadN(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, zt], [x1, y0, zt], E)
  if (sides[2]) quadN(p, [x1, y1, z0], [x0, y1, z0], [x0, y1, zt], [x1, y1, zt], NN)
  if (sides[3]) quadN(p, [x0, y1, z0], [x0, y0, z0], [x0, y0, zt], [x0, y1, zt], W)
  if (b > 0) {
    const i0 = x0 + b, i1 = x1 - b, j0 = y0 + b, j1 = y1 - b
    quadN(p, [x0, y0, zt], [x1, y0, zt], [i1, j0, z1], [i0, j0, z1], unit([0, -1, 1]))
    quadN(p, [x1, y0, zt], [x1, y1, zt], [i1, j1, z1], [i1, j0, z1], unit([1, 0, 1]))
    quadN(p, [x1, y1, zt], [x0, y1, zt], [i0, j1, z1], [i1, j1, z1], unit([0, 1, 1]))
    quadN(p, [x0, y1, zt], [x0, y0, zt], [i0, j0, z1], [i0, j1, z1], unit([-1, 0, 1]))
    if (top) quadN(top, [i0, j0, z1], [i1, j0, z1], [i1, j1, z1], [i0, j1, z1], UP)
  } else if (top) quadN(top, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], UP)
}
/** A flat panel on a south-facing wall at y, from (x0, z0) to (x1, z1). */
function southPanel(p: Part, x0: number, x1: number, y: number, z0: number, z1: number) {
  quadN(p, [x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1], S)
}
/** A flat convex shape on a south-facing wall, corners (x, z) anticlockwise as seen from the street. */
function southShape(p: Part, pts: XY[], y: number) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    p.tri([a[0], y, a[1]], [b[0], y, b[1]], [c[0], y, c[1]], undefined, undefined, undefined, [S, S, S])
  }
}

// ---------------------------------------------------------------------------
// Dimensions, from the OSM outline and the street photos.

const X0 = -6.8, X1 = 10.1, Y0 = -16.1, Y1 = 17.5
const G = 3.0                 // front sidewalk above the lowest ground (lidar)
const XC = 1.5                // the facade's centre line (the marquee's too)
const XR = (X0 + X1) / 2      // the auditorium roof's ridge line
const Z_EAVE = 9.3            // auditorium roof at the side walls (lidar)
const Z_RIDGE = 10.3          // and on its centre line (lidar)
const Z_SIDE = G + 6.95       // side parapets (lidar 9.9-10.0)
const Z_MID = G + 7.7         // the raised centre parapet (lidar 10.7)
const MID = 3.5               // half-width of the centre section
const Z_M0 = G + 2.6, Z_M1 = G + 3.55 // marquee and wall boards (lidar top 3.8)
const Z_MURAL = G + 3.9
const roofZ = (x: number) => Z_EAVE + (Z_RIDGE - Z_EAVE) * (1 - Math.abs(x - XR) / (XR - X0))

// The auditorium: walls to the eaves, a shallow ridged roof behind the front
// parapet, the eaves softened by a chamfer.
{
  const yb = Y0 + 0.6, c = 0.3
  box(stucco, X0, X1, yb, Y1, 0, Z_EAVE - c, 0, null, [false, true, true, true])
  const ze = Z_EAVE - c
  for (const [xa, xi, n] of [[X0, X0 + c, unit([-1, 0, 1])], [X1, X1 - c, unit([1, 0, 1])]] as [number, number, V3][]) {
    const zi = roofZ(xi)
    quadN(stucco, [xa, yb, ze], [xa, Y1, ze], [xi, Y1, zi], [xi, yb, zi], n)
  }
  // Roof planes.
  const zw = roofZ(X0 + c), sl = (Z_RIDGE - zw) / (XR - X0 - c)
  quadN(roof, [X0 + c, yb, zw], [X0 + c, Y1 - c, zw], [XR, Y1 - c, Z_RIDGE], [XR, yb, Z_RIDGE], unit([-sl, 0, 1]))
  quadN(roof, [XR, yb, Z_RIDGE], [XR, Y1 - c, Z_RIDGE], [X1 - c, Y1 - c, zw], [X1 - c, yb, zw], unit([sl, 0, 1]))
  // The rear wall's gable, with a chamfered rake.
  const back: V3[] = [[X0, Y1, ze], [X1, Y1, ze], [XR, Y1, Z_RIDGE - c]]
  stucco.tri(back[0], back[2], back[1], undefined, undefined, undefined, [NN, NN, NN])
  quadN(stucco, [X0, Y1, ze], [XR, Y1, Z_RIDGE - c], [XR, Y1 - c, Z_RIDGE], [X0 + c, Y1 - c, zw], unit([-sl, 1, 1]))
  quadN(stucco, [XR, Y1, Z_RIDGE - c], [X1, Y1, ze], [X1 - c, Y1 - c, zw], [XR, Y1 - c, Z_RIDGE], unit([sl, 1, 1]))
}

// The front wall: side sections, then the raised centre section, a little proud.
box(stucco, X0, XC - MID, Y0, Y0 + 0.6, 0, Z_SIDE, 0.25, stucco, [true, false, false, true])
box(stucco, XC + MID, X1, Y0, Y0 + 0.6, 0, Z_SIDE, 0.25, stucco, [true, true, false, false])
box(stucco, XC - MID, XC + MID, Y0 - 0.2, Y0 + 0.6, 0, Z_MID, 0.25, stucco, [true, true, false, true])
// The parapets' backs, above the roof.
quadN(stucco, [XC - MID, Y0 + 0.6, Z_EAVE - 0.3], [X0, Y0 + 0.6, Z_EAVE - 0.3], [X0, Y0 + 0.6, Z_SIDE - 0.25], [XC - MID, Y0 + 0.6, Z_SIDE - 0.25], NN)
quadN(stucco, [X1, Y0 + 0.6, Z_EAVE - 0.3], [XC + MID, Y0 + 0.6, Z_EAVE - 0.3], [XC + MID, Y0 + 0.6, Z_SIDE - 0.25], [X1, Y0 + 0.6, Z_SIDE - 0.25], NN)
quadN(stucco, [XC + MID, Y0 + 0.6, Z_EAVE - 0.3], [XC - MID, Y0 + 0.6, Z_EAVE - 0.3], [XC - MID, Y0 + 0.6, Z_MID - 0.25], [XC + MID, Y0 + 0.6, Z_MID - 0.25], NN)

// The mural, flush on the upper front: a warm field with the big teal shapes.
{
  const ys = Y0 - 0.03, yc = Y0 - 0.23
  southPanel(mural, X0 + 0.15, XC - MID, ys, Z_MURAL, Z_SIDE - 0.4)
  southPanel(mural, XC + MID, X1 - 0.15, ys, Z_MURAL, Z_SIDE - 0.4)
  southPanel(mural, XC - MID + 0.15, XC + MID - 0.15, yc, Z_MURAL, Z_MID - 0.4)
  // The mural's blues and greens as three broad sweeps, not spots: a corner
  // on each side section and a diagonal band across the centre.
  const zl = Z_MURAL + 0.05, zs = Z_SIDE - 0.45, zm = Z_MID - 0.45
  southShape(teal, [[X0 + 0.2, zl], [XC - MID - 0.6, zl], [X0 + 0.2, zs - 0.6]], ys - 0.02)
  southShape(teal, [[X1 - 0.2, zl + 1.0], [X1 - 0.2, zs], [XC + MID + 0.6, zs]], ys - 0.02)
  const a = XC - MID + 0.2, b = XC + MID - 0.2
  southShape(teal, [[a, zl], [a + 1.9, zl], [b, zm - 1.9], [b, zm], [b - 1.7, zm], [a, zl + 1.5]], yc - 0.02)
  // It carries on along the east wall, over the low neighbour on the corner.
  const x = X1 + 0.03
  quadN(mural, [x, Y0 + 0.3, Z_MURAL], [x, Y0 + 9, Z_MURAL], [x, Y0 + 9, Z_EAVE - 0.5], [x, Y0 + 0.3, Z_SIDE - 0.4], E)
}

// Flat attraction boards on the wall either side of the marquee.
for (const [a, b, y] of [[X0 + 0.25, XC - 3.15, Y0], [XC + 3.15, X1 - 0.25, Y0]] as [number, number, number][]) {
  box(board, a, b, y - 0.25, y, Z_M0 + 0.2, Z_M1, 0.06, roof, [true, true, false, true])
  quadN(board, [a, y - 0.25, Z_M0 + 0.2], [a, y, Z_M0 + 0.2], [b, y, Z_M0 + 0.2], [b, y - 0.25, Z_M0 + 0.2], DN)
}

// The marquee: a three-sided box off the centre section, its sign faces lit.
{
  const yb = Y0 - 0.2, yf = Y0 - 2.7, hb = 3.15, hf = 1.0
  const pts: XY[] = [[XC - hb, yb], [XC - hf, yf], [XC + hf, yf], [XC + hb, yb]]
  for (let i = 0; i < 3; i++) {
    const a = pts[i], b = pts[i + 1], n = unit([b[1] - a[1], -(b[0] - a[0]), 0])
    quadN(board, [a[0], a[1], Z_M0], [b[0], b[1], Z_M0], [b[0], b[1], Z_M1], [a[0], a[1], Z_M1], n)
    // A slim grey frame over each face, as the boards' dark frames read.
    const o = 0.12, A: V3 = [a[0] + n[0] * o, a[1] + n[1] * o, Z_M1], B: V3 = [b[0] + n[0] * o, b[1] + n[1] * o, Z_M1]
    quadN(roof, [a[0], a[1], Z_M1 - 0.02], [b[0], b[1], Z_M1 - 0.02], [B[0], B[1], Z_M1 + 0.22], [A[0], A[1], Z_M1 + 0.22], unit([n[0], n[1], 0.6]))
  }
  // Top and lit soffit.
  const top = (z: number, up: boolean) => {
    const r = pts.map(([x, y]) => [x, y, z] as V3)
    if (up) { roof.tri(r[0], r[1], r[2], undefined, undefined, undefined, [UP, UP, UP]); roof.tri(r[0], r[2], r[3], undefined, undefined, undefined, [UP, UP, UP]) }
    else { board.tri(r[0], r[2], r[1], undefined, undefined, undefined, [DN, DN, DN]); board.tri(r[0], r[3], r[2], undefined, undefined, undefined, [DN, DN, DN]) }
  }
  top(Z_M1 + 0.22, true)
  top(Z_M0, false)
}

// Ground floor: the doors, recessed under the marquee, and dark poster cases.
{
  const y = Y0 - 0.21
  southPanel(win, XC - 2.6, XC + 2.6, y, G, G + 2.45)
  for (const [a, b] of [[X0 + 0.9, X0 + 2.4], [X0 + 3.2, XC - 3.2], [XC + 3.4, XC + 4.0], [XC + 4.8, X1 - 3.4], [X1 - 2.6, X1 - 0.8]] as XY[]) {
    if (b - a < 0.4) continue
    southPanel(win, a, b, Y0 - 0.02, G + 0.6, G + 2.3)
  }
}

// ---------------------------------------------------------------------------

// Colours from the daylight Commons photos: pale grey stucco; the mural's
// reds, oranges and yellows averaged to one warm coral and its blues and
// greens to one teal, both pulled to the palette's lightness; the boards are
// the white attraction panels.
const parts = [
  { part: stucco, material: finish('stucco', 0xd6d2c8) },
  { part: mural, material: finish('mural', 0xe7a882) },
  { part: teal, material: finish('mural-teal', 0x86b9b2) },
  { part: board, material: PALETTE.entrance },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name}: ${part.triangles}`).join(', '))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Neighborhood Theatre', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 52, osm: 'way/967830177', height: Z_MID,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/neighborhood-theatre.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
