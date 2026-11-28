/**
 * Heard Museum, Phoenix, Arizona (1929, Herbert H. Green, Spanish
 * Colonial Revival; enlarged several times since, in the same manner) —
 * original procedural geometry, CC0-1.0.
 * bun generators/phx-heard-museum.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: the walls run
 * north–south and east–west. Anchor -112.0722587, 33.4719432, the area
 * centroid of OSM's multipolygon relation/1983722 (outers way/146999345
 * and way/146999338, five small inner courtyards), the only OSM building
 * the model covers.
 *
 * Identity (from the photos below):
 *  1. White stucco under red clay tile roofs, low and spread out round
 *     courtyards.                                  (h1, h5, h6, h9)
 *  2. The Steele Auditorium front on the west lawn: a taller block with
 *     three round-arched doorways and a row of five small round-arched
 *     windows high up.                             (h1, h2, h6, h8)
 *  3. The wings beside it: square-pillared loggias under a band of
 *     pierced diamond lattice.                     (h1, h3, h5, h9)
 *
 * Heights and plan: OSM's outlines cut into rectangles at their own
 * corners plus the lidar's edges, each taking the 65th-percentile USGS
 * 3DEP lidar height inside it (AZ_MaricopaPinal_1_2020, flown 2020, 1 m
 * grid, tools/lidar.py; the ground is 2.3 m above ground_min) snapped to
 * the levels 6, 8.5 and 10.5 m (scratch script cells.py; table CELLS);
 * the auditorium's front parapet, measured 12.1–15 along its face,
 * drawn 14. Each block's tile hip (about 20 degrees) is drawn so its
 * ridge comes near the block's measured height.
 * Mapterhorn: flat; elevation 0.
 *
 * Estimated: the auditorium front's width (18 m, from h1 scaled to its
 * height), its arches' sizes and spacing (h1, h8); the loggias' pier
 * spacing (3 m) and the lattice band's height (h1, h9). The tile roofs
 * are drawn as one low hip per rectangle; the real roofs are hips and
 * flat roofs behind parapets in a less regular pattern. The plan's rectangles straighten the round north-west corner.
 * Left out: the lattice's pattern (drawn as a plain band), the fountain,
 * the sculpture, signs and the lettering.
 *
 * Photos (evidence, Wikimedia Commons):
 *  h1 "HeardMuseum May2013.jpg", Yassie, CC BY-SA 3.0, the auditorium
 *     front from the west lawn
 *     https://commons.wikimedia.org/wiki/File:HeardMuseum_May2013.jpg
 *  h3 "Phoenix-Heard Museum-1929-3.JPG", Tony the Marine, CC BY-SA 3.0,
 *     the arcade and lattice close up
 *     https://commons.wikimedia.org/wiki/File:Phoenix-Heard_Museum-1929-3.JPG
 *  h5 "Heard Museum-3.jpg", Visitor7, CC BY-SA 3.0, the courtyard
 *     https://commons.wikimedia.org/wiki/File:Heard_Museum-3.jpg
 *  h8 "HeardMuseum.jpg", Kirs10, public domain, the auditorium front
 *     https://commons.wikimedia.org/wiki/File:HeardMuseum.jpg
 * No look-only sources. No commercial imagery.
 * Doubts: the photos used show only the west lawn and its courtyards;
 * the north, east and south faces are drawn plain.
 *
 * Night: the doors and windows are `window` and glow.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'

const ID = 'phx-heard-museum'
type XY = [number, number]
const stucco = new Part(), tile = new Part(), win = new Part(), shade = new Part()
const P = (x: number, y: number, z: number): V3 => [x, y, z]
function box(wall: Part, cap: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4]
    wall.quad(P(a[0], a[1], z0), P(b[0], b[1], z0), P(b[0], b[1], z1), P(a[0], a[1], z1))
  }
  cap.quad(P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1))
}
/** A west-facing flat shape at x, from y0..y1, z0..z1 with a semicircular head of radius (y1-y0)/2. */
function archWest(part: Part, x: number, y0: number, y1: number, z0: number, z1: number) {
  const r = (y1 - y0) / 2, yc = (y0 + y1) / 2
  // west-facing: wind so the normal points -x (y decreasing along the base)
  part.quad(P(x, y1, z0), P(x, y0, z0), P(x, y0, z1), P(x, y1, z1))
  for (let k = 0; k < 10; k++) {
    const a0 = (Math.PI * k) / 10, a1 = (Math.PI * (k + 1)) / 10
    part.tri(P(x, yc, z1), P(x, yc + r * Math.cos(a1), z1 + r * Math.sin(a1)), P(x, yc + r * Math.cos(a0), z1 + r * Math.sin(a0)))
  }
}

// [x0, y0, x1, y1, roof height] in the anchor frame (see header)
const CELLS: [number, number, number, number, number][] = [
  [-59.1, 29.2, -51.0, 35.5, 6.0], [-51.0, 21.2, -46.0, 38.7, 6.0], [-46.0, 21.2, -30.2, 35.5, 6.0], [-40.8, 38.7, -6.5, 44.1, 6.0],
  [-40.8, 69.8, -12.8, 76.1, 6.0], [-37.7, 35.5, -12.8, 38.7, 6.0], [-37.7, 76.1, -12.8, 85.1, 6.0], [-34.5, -49.1, -20.9, -36.0, 8.5],
  [-34.5, -36.0, -30.2, -11.0, 10.5], [-30.2, -72.6, -12.8, -59.9, 8.5], [-30.2, -36.0, 15.7, -28.0, 10.5], [-30.2, -28.0, -20.9, -18.0, 8.5],
  [-30.2, -18.0, 28.1, -11.0, 10.5], [-30.2, 12.7, -18.2, 35.5, 6.0], [-30.2, 85.1, -15.5, 97.5, 6.0], [-20.9, -49.1, -6.5, -36.0, 6.0],
  [-20.9, -28.0, -15.5, -24.2, 10.5], [-20.9, -24.2, -18.2, -18.0, 8.5], [-20.9, 44.1, -15.5, 51.3, 6.0], [-20.9, 51.3, -15.5, 65.7, 10.5],
  [-20.9, 65.7, -15.5, 69.8, 6.0], [-18.2, -59.9, -3.4, -49.1, 6.0], [-18.2, -24.2, -15.5, -21.4, 10.5], [-18.2, -21.4, -12.8, -18.0, 8.5],
  [-18.2, -4.3, -15.5, 35.5, 6.0], [-15.5, -28.0, -12.8, -21.4, 8.5], [-15.5, -4.3, -12.8, -0.4, 8.5], [-15.5, -0.4, -12.8, 35.5, 6.0],
  [-15.5, 51.3, 12.9, 65.7, 8.5], [-15.5, 85.1, -12.8, 88.0, 6.0], [-12.8, -67.9, 28.1, -59.9, 8.5], [-12.8, -28.0, 15.7, -18.0, 10.5],
  [-12.8, -11.0, -6.5, -4.3, 8.5], [-12.8, -4.3, -0.1, -0.4, 6.0], [-12.8, 32.0, 4.1, 35.5, 6.0], [-12.8, 44.1, -3.4, 51.3, 8.5],
  [-12.8, 65.7, -6.5, 76.1, 8.5], [-6.5, -49.1, 28.1, -36.0, 8.5], [-6.5, -11.0, -3.4, -4.3, 6.0], [-6.5, 38.7, 15.7, 44.1, 8.5],
  [-6.5, 65.7, -0.1, 69.8, 10.5], [-6.5, 69.8, -0.1, 76.1, 8.5], [-3.4, -75.5, 4.1, -67.9, 6.0], [-3.4, 44.1, 12.9, 51.3, 10.5],
  [-0.1, -11.0, 4.1, 12.7, 10.5], [-0.1, 12.7, 4.1, 17.0, 8.5], [-0.1, 17.0, 4.1, 32.0, 6.0], [-0.1, 35.5, 4.1, 38.7, 6.0],
  [-0.1, 65.7, 4.1, 69.8, 8.5], [-0.1, 69.8, 4.1, 76.1, 10.5], [4.1, -75.5, 28.1, -72.6, 6.0], [4.1, -59.9, 12.9, -49.1, 6.0],
  [4.1, -11.0, 12.9, -4.3, 10.5], [4.1, -4.3, 12.9, 9.2, 8.5], [4.1, 9.2, 28.1, 12.7, 10.5], [4.1, 17.0, 12.9, 29.2, 6.0],
  [4.1, 29.2, 15.7, 38.7, 8.5], [4.1, 65.7, 12.9, 69.8, 10.5], [4.1, 69.8, 12.9, 76.1, 8.5], [12.9, -72.6, 28.1, -67.9, 8.5],
  [12.9, -59.9, 28.1, -49.1, 8.5], [12.9, -11.0, 15.7, 9.2, 8.5], [12.9, 44.1, 15.7, 51.3, 6.0], [12.9, 51.3, 15.7, 65.7, 10.5],
  [12.9, 65.7, 15.7, 76.1, 6.0], [15.7, -36.0, 28.1, -18.0, 8.5], [15.7, -11.0, 28.1, -0.4, 10.5], [15.7, -0.4, 21.0, 9.2, 8.5],
  [15.7, 44.1, 21.0, 76.1, 8.5], [21.0, -0.4, 28.1, 9.2, 10.5], [28.1, -55.8, 31.5, -11.0, 6.0], [28.1, -11.0, 31.5, -4.3, 8.5],
  [28.1, -4.3, 31.5, -0.4, 6.0], [28.1, -0.4, 31.5, 9.2, 8.5], [28.1, 9.2, 41.1, 12.7, 6.0], [31.5, -67.9, 36.3, -11.0, 6.0],
  [31.5, -0.4, 45.2, 9.2, 6.0], [36.3, -67.9, 41.1, -28.0, 6.0], [36.3, -24.2, 41.1, -11.0, 6.0], [41.1, -67.9, 45.2, -59.9, 8.5],
  [41.1, -59.9, 45.2, -21.4, 6.0],
]

/** A low hipped tile roof over a rectangle, eaves at ze, about 20 degrees. */
function hip(x0: number, y0: number, x1: number, y1: number, ze: number) {
  const w = x1 - x0, d = y1 - y0, o = 0.4
  const [X0, Y0, X1, Y1] = [x0 - o, y0 - o, x1 + o, y1 + o]
  if (w >= d) {
    const r = Math.min(0.36 * (d / 2 + o), 3), ym = (y0 + y1) / 2, a = X0 + (Y1 - Y0) / 2, b = X1 - (Y1 - Y0) / 2
    tile.quad(P(X0, Y0, ze), P(X1, Y0, ze), P(b, ym, ze + r), P(a, ym, ze + r))
    tile.quad(P(X1, Y1, ze), P(X0, Y1, ze), P(a, ym, ze + r), P(b, ym, ze + r))
    tile.tri(P(X1, Y0, ze), P(X1, Y1, ze), P(b, ym, ze + r))
    tile.tri(P(X0, Y1, ze), P(X0, Y0, ze), P(a, ym, ze + r))
  } else {
    const r = Math.min(0.36 * (w / 2 + o), 3), xm = (x0 + x1) / 2, a = Y0 + (X1 - X0) / 2, b = Y1 - (X1 - X0) / 2
    tile.quad(P(X1, Y0, ze), P(X1, Y1, ze), P(xm, b, ze + r), P(xm, a, ze + r))
    tile.quad(P(X0, Y1, ze), P(X0, Y0, ze), P(xm, a, ze + r), P(xm, b, ze + r))
    tile.tri(P(X0, Y0, ze), P(X1, Y0, ze), P(xm, a, ze + r))
    tile.tri(P(X1, Y1, ze), P(X0, Y1, ze), P(xm, b, ze + r))
  }
  // the eaves' soffit
  tile.quad(P(X0, Y0, ze), P(X0, Y1, ze), P(X1, Y1, ze), P(X1, Y0, ze))
}
// each block: stucco walls to its eaves, a hipped tile roof whose ridge
// reaches about the measured height
for (const [x0, y0, x1, y1, h] of CELLS) {
  if (h <= 0) continue
  const ze = h - Math.min(0.36 * (Math.min(x1 - x0, y1 - y0) / 2), 3) * 0.8
  box(stucco, stucco, x0, y0, x1, y1, 0, ze)
  hip(x0, y0, x1, y1, ze)
}

// ── The Steele Auditorium front on the west lawn (h1, h8) ──────────────
{
  const X = -36.5, Y0 = -36, Y1 = -18, H = 14
  box(stucco, stucco, X, Y0, -31, Y1, 0, H)
  // a tile coping over the parapet's front edge
  box(tile, tile, X - 0.4, Y0 - 0.4, -30.6, Y1 + 0.4, H - 0.35, H + 0.15)
  // three arched doorways
  for (const yc of [-30.6, -27, -23.4]) archWest(win, X - 0.06, yc - 1.25, yc + 1.25, 0.3, 4.2)
  // five small arched windows high up
  for (let k = 0; k < 5; k++) { const yc = -31.6 + k * 2.3; archWest(win, X - 0.06, yc - 0.7, yc + 0.7, 9.6, 10.8) }
}
// ── The wings' loggias and lattice bands along the west front (h1, h9) ─
for (const [y0, y1] of [[-49.1, -36], [-18, -11]] as [number, number][]) {
  const X = -34.5 - 0.06, n = Math.round((y1 - y0) / 3)
  for (let k = 0; k < n; k++) {
    const a = y0 + ((y1 - y0) * k) / n + 0.35, b = y0 + ((y1 - y0) * (k + 1)) / n - 0.35
    shade.quad(P(X, b, 0.3), P(X, a, 0.3), P(X, a, 3.3), P(X, b, 3.3))
  }
  // the lattice band: a slightly shaded band under the eaves
  shade.quad(P(X - 0.02, y1, 4.6), P(X - 0.02, y0, 4.6), P(X - 0.02, y0, 6.0), P(X - 0.02, y1, 6.0))
}

// ── Write ───────────────────────────────────────────────────────────────
const parts: { part: Part; material: Swatch }[] = [
  { part: stucco, material: finish('hm-stucco', 0xf1e8da) },
  { part: tile, material: finish('hm-tile', 0xc47b62) },
  { part: win, material: PALETTE.window },
  { part: shade, material: finish('hm-shade', 0xb3a596) },
]
const used = parts.filter((p) => p.part.triangles > 0)
const triangles = used.reduce((s, p) => s + p.part.triangles, 0)
if (used.length > 6) throw new Error(`${ID}: ${used.length} materials`)
if (triangles > 5000) throw new Error(`${ID}: ${triangles} triangles`)
const glb = writeGlb('Heard Museum', used, {
  license: 'CC0-1.0',
  frame: 'Y up, -Z north, +X east, metres; origin on the ground at the outline centroid (-112.0722587, 33.4719432); bearing 0',
})
if (glb.length > 250_000) throw new Error(`${ID}: ${glb.length} bytes`)
const out = new URL(`../models/${ID}.glb`, import.meta.url).pathname
await Bun.write(out, glb)
console.log(used.map((p) => `${p.material.name}: ${p.part.triangles}`).join(', '))
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
