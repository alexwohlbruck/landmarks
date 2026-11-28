/**
 * Soldiers Memorial (Soldiers Memorial Military Museum), 1315 Chestnut St,
 * St. Louis (1936–1938; Mauran, Russell & Crowell; sculpture by Walker
 * Hancock) — original procedural geometry, CC0-1.0.
 * bun generators/stl-soldiers-memorial.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 14.9, the building's own axis (OSM's long walls
 * run at 104.9°): -y is the Chestnut St front facing the Court of Honor.
 * Anchor = the centroid of OSM way/108704943, -90.2000443, 38.629035.
 *
 * Identity (from the photos below):
 *  1. A pale limestone block ringed by tall square fluted piers, twelve
 *     bays on the long sides and five on the ends, forming deep loggias
 *     with tall dark windows behind; a plain entablature carved with
 *     medallions; a plain attic block above.                     (p1, p4)
 *  2. The open loggia through the middle of the long sides, reached by
 *     wide steps.                                                      (p4)
 *  3. Hancock's sculpture groups (a figure with a winged horse) on
 *     pedestals either side of the steps, on both long sides.    (p2, p4)
 *
 * Plan: OSM way/108704943 (58.2 x 27.6 m) and its part way/615408468 (the
 * attic, 49 x 19.3 m) turned to bearing 14.9.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018 (flown 2017),
 * 0.5 m grid with class 18 kept; y = 0 is the lowest ground under the
 * footprint (0.3 m over the box's ground_min, at the foot of the steps):
 * the memorial stands on a lawn about 2 m above that point (Mapterhorn
 * and lidar agree; the terrain dips under the south steps). Measured: the entablature's top 17.7, the attic 22.7,
 * the sculpture groups to about 7.5 (returns at x -8 and +10, y ±16).
 * Estimated from p1 and p4: the podium (to 3.3, 1.3 m over the lawn), four
 * steps down to the lawn, the piers (2.3 m square, about as wide as the gaps, p4; to 14.3), the
 * entablature (14.3–17.7), the loggia depth (3.0 m), the
 * central opening (7 m), the steps, the sculptures' size (block 2.8 x 1.6
 * x 4 m on a 1.2 m pedestal), the medallions.
 * The piers' sides, which stand in the loggias' shadow in every photo, are a
 * darker tone of the limestone so the colonnade reads as piers and voids.
 * Left out: the fluting, the inscriptions, the urns and flagpoles.
 *
 * Night: the limestone is floodlit; the loggia windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  p1  "Soldiers Memorial Military Museum, St. Louis, Missouri LCCN2010630560", Carol M. Highsmith, public domain
 *  p2  "Soldiers Memorial Military Museum, St. Louis, Missouri LCCN2010630554", Carol M. Highsmith, public domain
 *      (a sculpture group, close up)
 *  p3  "St. Louis, Missouri - Soldiers' Memorial Military Museum - panoramio (2).jpg", MARELBU, CC BY 3.0
 *  p4  "Soldiers Memorial, Chestnut Street, St. Louis, MO.jpg", w_lemay, CC BY-SA 2.0 (from the south-west)
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, cornice, onWall, rectShape, save, type XY } from './atl-tech-tower'
import { discShape } from './stl-cathedral-basilica'

const stone = new Part(), win = new Part(), roof = new Part(), shade = new Part()
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

const X = 29.1, Y = 13.8, POD = 3.3, PIER = 14.3, ENT = 17.7, ATTIC = 22.7, DEPTH = 3.0
const faces = (x: number, y: number): [XY, XY][] => [[[-x, -y], [x, -y]], [[x, -y], [x, y]], [[x, y], [-x, y]], [[-x, y], [-x, -y]]]

// the podium, the recessed core behind the loggias, the entablature and the attic
box(stone, -X - 0.4, X + 0.4, -Y - 0.4, Y + 0.4, 0, POD, stone, 0.1)
box(stone, -X + DEPTH, X - DEPTH, -Y + DEPTH, Y - DEPTH, POD, ENT, null, 0)
box(stone, -X, X, -Y, Y, PIER, ENT, null, 0)
stone.quad([-X, -Y, PIER], [-X, Y, PIER], [X, Y, PIER], [X, -Y, PIER]) // the loggias' ceiling
cornice(stone, rect(-X, X, -Y, Y), ENT - 0.8, 0.8, 0.35, roof)
box(stone, -24.5, 24.5, -9.7, 9.7, ENT, ATTIC, null, 0.2)
cornice(stone, rect(-24.5, 24.5, -9.7, 9.7), ATTIC - 0.6, 0.6, 0.25, roof)

// the piers: twelve bays on the long sides, five on the ends, corners shared
const PW = 2.3
const piers = new Set<string>()
for (const [nx, ny] of [[13, 6]]) {
  for (let i = 0; i < nx; i++) for (const y of [-Y + PW / 2, Y - PW / 2]) piers.add(`${(-X + PW / 2 + (i * (2 * X - PW)) / (nx - 1)).toFixed(2)},${y.toFixed(2)}`)
  for (let j = 0; j < ny; j++) for (const x of [-X + PW / 2, X - PW / 2]) piers.add(`${x.toFixed(2)},${(-Y + PW / 2 + (j * (2 * Y - PW)) / (ny - 1)).toFixed(2)}`)
}
for (const k of piers) {
  const [x, y] = k.split(',').map(Number)
  // the pier in shadow-toned stone; its outward faces in the lit limestone
  box(shade, x - PW / 2, x + PW / 2, y - PW / 2, y + PW / 2, POD, PIER, null, 0)
  const x0 = x - PW / 2 - 0.03, x1 = x + PW / 2 + 0.03, y0 = y - PW / 2 - 0.03, y1 = y + PW / 2 + 0.03
  if (y < -Y + PW) stone.quad([x0, y0, POD], [x1, y0, POD], [x1, y0, PIER], [x0, y0, PIER])
  if (y > Y - PW) stone.quad([x1, y1, POD], [x0, y1, POD], [x0, y1, PIER], [x1, y1, PIER])
  if (x > X - PW) stone.quad([x1, y0, POD], [x1, y1, POD], [x1, y1, PIER], [x1, y0, PIER])
  if (x < -X + PW) stone.quad([x0, y1, POD], [x0, y0, POD], [x0, y0, PIER], [x0, y1, PIER])
}

// the loggias' back walls read dark between the piers (tall windows in shadow, p4):
// one glazed panel per wall, the piers in front break it into bays
for (const [a, b] of faces(X - DEPTH, Y - DEPTH)) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  onWall(win, a, b, rectShape(0.3, L - 0.3, POD + 0.4, PIER - 0.6), 0.05)
}
// medallions along the entablature
for (const [a, b] of faces(X, Y)) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = L > 40 ? 12 : 5
  for (let i = 0; i < n; i++) onWall(stone, a, b, discShape(((i + 0.5) * L) / n, 15.7, 0.55, 10), 0.08)
}

// the steps and the sculpture groups on both long sides
for (const s of [-1, 1]) {
  for (let k = 0; k < 4; k++) box(stone, -13 + k * 0.3, 13 - k * 0.3, s < 0 ? -Y - 4.4 + k * 1.0 : Y + 0.4, s < 0 ? -Y - 0.4 : Y + 4.4 - k * 1.0, 0, 2.1 + 0.4 * (k + 1), stone, 0.03)
  for (const x of [-8.5, 10.0]) {
    const y = s * (Y + 2.6)
    box(stone, x - 2.4, x + 2.4, y - 1.5, y + 1.5, 0, 3.0, stone, 0.1)
    box(stone, x - 1.9, x + 1.9, y - 1.1, y + 1.1, 3.0, 7.4, stone, 0.4) // the group, abstracted
    box(stone, x + 0.6, x + 1.9, y - 0.9, y + 0.9, 7.4, 8.6, stone, 0.3) // the horse's head and neck
    // the wings: a wedge rising behind the figure
    const wy = y - s * 0.2
    box(stone, x - 2.2, x + 0.4, wy - 0.25, wy + 0.25, 6.4, 8.8, stone, 0.1) // the raised wing
  }
}

const lit = (p: V3, n: V3) => (n[2] > 0.85 ? 0.1 : 0.85)
await save('stl-soldiers-memorial', 'Soldiers Memorial', [
  { part: stone, material: { ...finish('stl-memorial-limestone', 0xe6e1d6), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: shade, material: finish('stl-memorial-shade', 0xa9a397) },
], { height: ATTIC, anchor: [38.629035, -90.2000443], bearing: 14.9 })
