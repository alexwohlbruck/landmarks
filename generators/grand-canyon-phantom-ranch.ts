/**
 * Phantom Ranch Canteen (the lodge and dining hall, 1922; Mary Colter for
 * the Fred Harvey Company), at the bottom of the Grand Canyon beside
 * Bright Angel Creek — procedural, CC0-1.0, no textures.
 * bun generators/grand-canyon-phantom-ranch.ts
 *
 * The canteen only; the cabins, bunkhouses and shower house round it are
 * separate small buildings the map draws. What makes it itself: walls of
 * rounded river boulders, laid as thick piers at the corners and between
 * the window bays, with green-framed window bands between them; a low
 * green-shingled gable roof with exposed rafter ends and a gable end of
 * green board and batten over a stone base; the fat river-stone chimney
 * rising off the front slope by the west gable and a second chimney at the
 * back; the entrance up a few stone steps under a small gable in the front
 * slope; the screened porch at the east end with its green wainscot.
 *
 * Frame: x east, y north (turned to bearing 355.4°, the OSM outline's
 * edges), z up, metres; origin on the lowest ground under the footprint,
 * 2.1 m south of the outline's centroid, so the front range and the back
 * wing together sit centred on the outline and on the roof the aerial
 * shows.
 *
 * Sources:
 * - OSM (API, 2026-11-20): way/230992578 (building=yes, no name or tags),
 *   about 11.2 × 9.5 m, the only building in the ranch that is neither a
 *   cabin nor named, standing where the canteen stands south of the cabins
 *   and north of the amphitheatre. No other building in the footprint.
 * - USGS NAIP aerial (tools/usgs.py naip, public domain): a squarish green
 *   roof about 13 × 14 m over the outline, the trail passing east of it and
 *   the round amphitheatre south.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - "Phantom Ranch.jpg", Michael Quinn (NPS), public domain (the front
 *     and the west gable end, both chimneys, the entrance gablet, the
 *     screened porch);
 *   - "Grand Canyon Phantom Ranch Lodge 0322", Grand Canyon National Park,
 *     CC BY 2.0 (the same side in autumn);
 *   - "Grand Canyon Phantom Ranch Lodge 2878", Grand Canyon National Park,
 *     CC BY 2.0 (the front close up: boulder piers, the window bands, the
 *     green wainscot and bench, the board-and-batten frieze, rafter ends);
 *   - "Busy Day at the Canteen", Grand Canyon National Park, CC BY 2.0
 *     (the whole front from the south-west).
 *   - Look-only for the entrance at night: "Phantom Ranch Canteen -
 *     panoramio", Outdoor Craziness, CC BY-SA 3.0.
 * - Estimated from photos (doors and people for scale): eaves 3.1 m,
 *   ridge 6.0 m, the floor 0.5 m up, piers about 1.4 m wide, chimneys
 *   1.5 m square rising about 1.5 m over the ridge; the front range 12.6 ×
 *   8.4 m on the outline, with a lower kitchen wing at the back filling the
 *   squarish roof the aerial shows (no photo shows the back).
 * - The front faces south, onto the open ground with the picnic tables,
 *   from the aerial and the photos' light; the west gable from the photos.
 *
 * Doubts: the back (kitchen) wing's shape and height; the ridge direction
 * is read from the photos, not the aerial, which can't resolve it.
 *
 * Night: the windows are lit (the night photo); the door is plain oak.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, rect, save, walls, type XY } from './chi-museum-of-science-industry'
import { face, gable } from './grand-canyon-el-tovar'

const stone = new Part(), roof = new Part(), green = new Part(), win = new Part(), door = new Part()

const X0 = -6.3, X1 = 6.3, Y0 = -4.2, Y1 = 4.2 // front range walls
const EAVE = 3.1, RIDGE = 6.0, OV = 0.7, FLOOR = 0.5

/** A bevelled box over x0..x1, y0..y1, z0..z1. */
function block(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0.25) {
  const r: XY[] = [[x0 + b, y0], [x1 - b, y0], [x1, y0 + b], [x1, y1 - b], [x1 - b, y1], [x0 + b, y1], [x0, y1 - b], [x0, y0 + b]]
  walls(p, r, z0, z1)
  cap(p, r, z1)
}

/** A flat panel on the south (y = Y0) face. */
const south = (p: Part, x0: number, x1: number, z0: number, z1: number, y = Y0 - 0.05) =>
  face(p, [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], [0, -1, 0])
const west = (p: Part, y0: number, y1: number, z0: number, z1: number, x = X0 - 0.05) =>
  face(p, [[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]], [-1, 0, 0])
const east = (p: Part, y0: number, y1: number, z0: number, z1: number, x = X1 + 0.05) =>
  face(p, [[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]], [1, 0, 0])

// --- Front range -----------------------------------------------------------
// The wall body is the green frame and board-and-batten (between the
// piers); stone wainscot runs under the windows; boulder piers stand proud.
walls(green, rect(X0, Y0, X1, Y1), 0, EAVE)
block(stone, X0 - 0.05, X1 + 0.05, Y0 - 0.05, Y1 + 0.05, 0, FLOOR + 0.8, 0.15)
// Piers on the front, west to east: the west corner and the chimney wall,
// beside the entrance, before the porch, the east corner.
const piers: [number, number][] = [[X0 - 0.25, X0 + 3.6], [0.2, 1.4], [2.9, 3.9], [X1 - 1.3, X1 + 0.25]]
for (const [a, b] of piers) block(stone, a, b, Y0 - 0.3, Y0 + 1.2, 0, EAVE - 0.05)
// Back corners and the gable-end piers.
for (const x of [X0 - 0.25, X1 - 1.3]) block(stone, x, x + 1.55, Y1 - 1.2, Y1 + 0.3, 0, EAVE - 0.05)
for (const [x0, x1] of [[X0 - 0.3, X0 + 1.0], [X1 - 1.0, X1 + 0.3]]) block(stone, x0, x1, -0.6, 0.6, 0, EAVE - 0.05)

// Window bands: two lights between the chimney wall and the entrance pier;
// the entrance; the screened porch east of it.
south(win, X0 + 3.75, 0.05, FLOOR + 0.85, EAVE - 0.45)
south(door, 1.5, 2.8, FLOOR, FLOOR + 2.15)
south(win, 1.5, 2.8, FLOOR + 2.2, EAVE - 0.45)
south(win, 4.0, X1 - 1.4, FLOOR + 1.0, EAVE - 0.45) // the porch screens, over the green wainscot
// Gable ends: a window band between the piers each side of the middle one.
for (const s of [-1, 1]) {
  west(win, s < 0 ? Y0 + 1.3 : 0.7, s < 0 ? -0.7 : Y1 - 1.3, FLOOR + 0.85, EAVE - 0.45)
  east(win, s < 0 ? Y0 + 1.3 : 0.7, s < 0 ? -0.7 : Y1 - 1.3, FLOOR + 0.85, EAVE - 0.45)
}
// Steps up to the entrance.
for (let i = 0; i < 3; i++) block(stone, 1.2, 3.1, Y0 - 1.6 + i * 0.45, Y0, 0, 0.17 * (i + 1), 0.05)

// The main roof, ridge east–west, its gable triangles in green board.
gable(roof, green, X0, X1, Y0, Y1, EAVE, RIDGE, OV, 'x')
// The entrance gablet: a small gable on the front slope over the door.
{
  const xa = 1.0, xb = 3.3, ze = EAVE - 0.2, zr = 4.35, yf = Y0 - OV - 0.1
  const k = (RIDGE - EAVE) / ((Y1 - Y0) / 2) // main roof slope
  const yb = Y0 + (zr - EAVE) / k // where its ridge meets the main slope
  const xm = (xa + xb) / 2
  for (const [xe, sx] of [[xb + 0.25, 1], [xa - 0.25, -1]] as [number, number][]) {
    const ze2 = ze - 0.25 * ((zr - ze) / ((xb - xa) / 2))
    face(roof, [[xe, yf, ze2], [xm, yf, zr], [xm, yb, zr], [xe, yb - (zr - ze2) / k * 0, ze2]], [sx, 0, 1])
  }
  face(green, [[xa, Y0 - 0.1, ze], [xb, Y0 - 0.1, ze], [xm, Y0 - 0.1, zr]], [0, -1, 0])
  face(green, [[xa, yf + 0.05, ze], [xb, yf + 0.05, ze], [xm, yf + 0.05, zr]], [0, -1, 0])
}

// --- Kitchen wing at the back --------------------------------------------
{
  const x0 = -4.2, x1 = 3.4, y0 = Y1, y1 = Y1 + 4.4, ze = 2.8, zr = 4.6
  walls(green, rect(x0, y0 - 0.5, x1, y1), 0, ze)
  block(stone, x0 - 0.05, x1 + 0.05, y0 - 0.5, y1 + 0.05, 0, FLOOR + 0.8, 0.15)
  for (const x of [x0 - 0.2, x1 - 1.1]) block(stone, x, x + 1.3, y1 - 1.1, y1 + 0.2, 0, ze - 0.05)
  face(win, [[x1 + 0.05, y0 + 0.6, FLOOR + 0.9], [x1 + 0.05, y1 - 1.2, FLOOR + 0.9], [x1 + 0.05, y1 - 1.2, ze - 0.4], [x1 + 0.05, y0 + 0.6, ze - 0.4]], [1, 0, 0])
  gable(roof, green, x0, x1, y0 - 0.5, y1, ze, zr, 0.6, 'y')
}

// --- Chimneys --------------------------------------------------------------
// The big one rises from the front wall by the west gable, through the
// front slope; the second from the back slope east of the middle.
block(stone, X0 + 1.2, X0 + 2.8, Y0 - 0.3, Y0 + 1.1, EAVE - 0.1, RIDGE + 1.6, 0.3)
block(stone, X0 + 1.35, X0 + 2.65, Y0 - 0.15, Y0 + 0.95, RIDGE + 1.6, RIDGE + 1.75, 0.2)
block(stone, 3.4, 4.5, 1.2, 2.3, RIDGE - 1.6, RIDGE + 1.1, 0.25)

await save('grand-canyon-phantom-ranch', 'Phantom Ranch Canteen', [
  { part: stone, material: finish('river-stone', 0xb98e72) },
  { part: roof, material: finish('green-shingle', 0x7f9488) },
  { part: green, material: finish('ranch-green', 0x6f8a6c) },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('door-oak', 0x7d5d45) },
], { bearing: 355.4, height: RIDGE + 1.75 })
