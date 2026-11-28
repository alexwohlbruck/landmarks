/**
 * Faneuil Hall, Dock Square, Boston (1742, John Smibert; rebuilt 1762;
 * enlarged by Charles Bulfinch 1806) — original procedural geometry, CC0-1.0.
 * bun generators/bos-faneuil-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 352: the long walls of OSM way/29551702 run at 82°,
 * so x runs along the hall (the cupola end at +x, east, toward Quincy
 * Market) and y across it. Anchor = the outline's centroid,
 * -71.0562341, 42.3600335. In this frame the outline is x ±15.5, y ±12.18
 * (31.0 × 24.35 m; published 100 × 80 ft after Bulfinch's enlargement).
 *
 * Identity (from the photos below):
 *  1. The white cupola over the east gable: a square base with an arched
 *     window a face and a heavy cornice, an octagonal belfry with an arched
 *     opening on every face, a gilded dome, and the gilded grasshopper vane.
 *  2. A red-brick Georgian hall of three tall storeys under a low pitched
 *     slate roof, with full pediments at both ends: a big semicircular arch
 *     moulding with a fanlit lunette and two oculi in each tympanum.
 *  3. Brick pilasters between the bays, white entablature belts between the
 *     storeys and a white dentil cornice. Ends seven bays: arched openings
 *     and doors on the ground floor, two tiers of tall round-headed windows
 *     above. Long sides nine bays: ground arches, round-headed windows, then
 *     square windows with semicircular lunettes over them in the attic.
 *  4. A brick chimney at the apex of the west gable.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021), 0.5 m grid,
 * read with tools/lidar_frame.py. The ground round the hall is flat (2.0–2.2
 * above the grid's ground_min, a pit elsewhere in the box); y = 0 is that
 * ground. Measured: eaves with cornice 17.2, ridge 22.4, west chimney 23.8,
 * cupola base cornice 25.7, belfry cornice 31.5, dome 33.9, vane 36.8. The
 * lidar outline matches OSM's to about 0.5 m (the cornice overhang).
 *
 * Estimated from the photos (Epicgenius Mar 2025 06, scaled from the 17.2 m
 * eaves and 24.35 m end): the belts at 4.7–5.6 and 10.4–11.2; window sizes
 * and sill and head heights; bay spacing (3.0 m on the ends, 3.1 m on the
 * long sides); the pediment arch (radius 4.4) and oculi; the cupola's
 * stage widths (base 6.0 m, OSM part way/240370278; belfry 4.4 m across;
 * dome 3.7 m, OSM part way/240370310) from the Daderot close-up.
 *
 * Ground: flat; elevation 0.
 *
 * Night: the cupola is floodlit white and its dome gilt; the windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Faneuil Hall Boston Massachusetts.JPG, Daderot, CC BY-SA 3.0 (east end
 *    and south side, the cupola close up)
 *    https://commons.wikimedia.org/wiki/File:Faneuil_Hall_Boston_Massachusetts.JPG
 *  - Faneuil Hall (6001395851).jpg, Francisco Anzola, CC BY 2.0 (east end
 *    from Quincy Market) https://commons.wikimedia.org/wiki/File:Faneuil_Hall_(6001395851).jpg
 *  - Boston Faneuil Hall 01.jpg, Miguel Hermoso Cuesta, CC BY-SA 4.0 (west
 *    end and north side) https://commons.wikimedia.org/wiki/File:Boston_Faneuil_Hall_01.jpg
 *  - Faneuil Hall Mar 2025 06.jpg, Epicgenius, CC BY-SA 4.0 (west end,
 *    square on) https://commons.wikimedia.org/wiki/File:Faneuil_Hall_Mar_2025_06.jpg
 *  - Faneuil Hall Mar 2025 12.jpg and 27.jpg, Epicgenius, CC BY-SA 4.0 (the
 *    long side's window tiers)
 *    https://commons.wikimedia.org/wiki/File:Faneuil_Hall_Mar_2025_12.jpg
 *    https://commons.wikimedia.org/wiki/File:Faneuil_Hall_Mar_2025_27.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the long sides' bay count (nine) is read from oblique photos; the
 * ground-floor doors on the long sides are simplified to one central door;
 * the roof's small skylights (seen in the lidar) and the quoins of the
 * cupola base are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, cornice, gableRoof, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'

const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part(), gold = new Part(), door = new Part()

const X = 15.5, Y = 12.18, EAVE = 17.2, RIDGE = 22.4
const ring: XY[] = [[-X, -Y], [X, -Y], [X, Y], [-X, Y]]

// ── Body, belts, cornice, roof ──
box(brick, -X, X, -Y, Y, 0, EAVE - 0.9, null, 0)
box(brick, -X + 0.05, X - 0.05, -Y + 0.05, Y - 0.05, EAVE - 0.95, EAVE, null, 0)
for (const [z, h] of [[4.7, 0.9], [10.4, 0.8]]) cornice(trim, ring, z, h, 0.18, null)
cornice(trim, ring, EAVE - 0.9, 0.9, 0.55, null)
gableRoof(roof, null, -X, X, -Y, Y, EAVE, RIDGE, 'x', 0.45, 0.45)
// Pediments: brick tympana set just inside the raking cornices, which are white.
for (const x of [-X, X]) {
  const s = x < 0 ? -1 : 1
  brick.tri([x, s * Y, EAVE], [x, -s * Y, EAVE], [x, 0, RIDGE - 0.1])
  brick.tri([x, -s * Y, EAVE], [x, s * Y, EAVE], [x, 0, RIDGE - 0.1])
  for (const k of [-1, 1]) {
    const x0 = x - s * 0.1, x1 = x + s * 0.5
    const sec = (y: number, z: number): V3[] => [[x0, y, z], [x1, y, z], [x1, y, z - 0.55], [x0, y, z - 0.55]]
    trim.sweep([sec(k * (Y + 0.45), EAVE + 0.05), sec(0, RIDGE + 0.2)])
  }
}

// ── Pilasters: brick strips between the bays, white capitals under the cornice ──
function pilaster(a: XY, b: XY, s: number, w = 0.75) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const P = (ss: number, d: number): XY => [a[0] + t[0] * ss + n[0] * d, a[1] + t[1] * ss + n[1] * d]
  const q = [P(s - w / 2, 0), P(s + w / 2, 0), P(s + w / 2, 0.16), P(s - w / 2, 0.16)]
  const xs = q.map((p) => p[0]), ys = q.map((p) => p[1])
  box(brick, Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys), 0, EAVE - 0.9, null, 0)
  const c = [P(s - w / 2 - 0.08, 0), P(s + w / 2 + 0.08, 0.3)]
  box(trim, Math.min(c[0][0], c[1][0]), Math.max(c[0][0], c[1][0]), Math.min(c[0][1], c[1][1]), Math.max(c[0][1], c[1][1]), EAVE - 1.35, EAVE - 0.9, trim, 0.05)
}

type F = [XY, XY]
// Each face runs with the outside on its right; s is metres along it.
const SOUTH: F = [[-X, -Y], [X, -Y]], NORTH: F = [[X, Y], [-X, Y]], EAST: F = [[X, -Y], [X, Y]], WEST: F = [[-X, Y], [-X, -Y]]

/** A round-headed window with a white frame. */
function arched(f: F, s: number, z0: number, w: number, zs: number, p = win) {
  onWall(trim, f[0], f[1], archShape(s, w + 0.34, z0 - 0.2, zs, 10), 0.03)
  onWall(p, f[0], f[1], archShape(s, w, z0, zs, 10), 0.06)
}
/** A ground-floor arch: door leaves under a fanlight, or a fanlit window. */
function groundArch(f: F, s: number, isDoor: boolean) {
  const w = 1.8, zs = 3.0
  onWall(trim, f[0], f[1], archShape(s, w + 0.34, isDoor ? 0 : 0.8, zs, 10), 0.03)
  if (isDoor) {
    onWall(door, f[0], f[1], rectShape(s - w / 2, s + w / 2, 0, zs - 0.1), 0.06)
    onWall(win, f[0], f[1], archShape(s, w, zs, zs + 0.02, 10), 0.06)
  } else onWall(win, f[0], f[1], archShape(s, w, 1.0, zs, 10), 0.06)
}

// Ends: seven bays, 3.0 m apart.
const endBays = [-9, -6, -3, 0, 3, 6, 9]
for (const [f, doors] of [[EAST, [1, 2, 3, 4, 5]], [WEST, [1, 3, 5]]] as [F, number[]][]) {
  endBays.forEach((d, i) => {
    const s = Y + d
    groundArch(f, s, doors.includes(i))
    arched(f, s, 6.5, 1.55, 9.3)
    arched(f, s, 11.9, 1.55, 14.4)
  })
  for (const d of [-10.6, -7.5, -4.5, -1.5, 1.5, 4.5, 7.5, 10.6]) pilaster(f[0], f[1], Y + d)
  // pediment: the great arch moulding, its fanlit lunette, two oculi
  onWall(trim, f[0], f[1], archShape(Y, 9.2, EAVE, EAVE, 16), 0.015)
  onWall(brick, f[0], f[1], archShape(Y, 8.4, EAVE, EAVE, 16), 0.03)
  onWall(trim, f[0], f[1], archShape(Y, 4.3, EAVE, EAVE, 12), 0.045)
  onWall(win, f[0], f[1], archShape(Y, 3.8, EAVE + 0.1, EAVE + 0.1, 12), 0.06)
  for (const d of [-6.4, 6.4]) {
    const circ = (r: number) => Array.from({ length: 12 }, (_, i) => [Y + d + r * Math.cos((i / 12) * Math.PI * 2), 18.7 + r * Math.sin((i / 12) * Math.PI * 2)] as [number, number])
    onWall(trim, f[0], f[1], circ(0.75), 0.03)
    onWall(win, f[0], f[1], circ(0.55), 0.06)
  }
}
// Long sides: nine bays, 3.1 m apart.
for (const f of [SOUTH, NORTH]) {
  for (let k = -4; k <= 4; k++) {
    const s = X + k * 3.1
    groundArch(f, s, k === 0)
    arched(f, s, 6.5, 1.55, 9.3)
    onWall(trim, f[0], f[1], rectShape(s - 0.95, s + 0.95, 11.6, 13.95), 0.03)
    onWall(win, f[0], f[1], rectShape(s - 0.78, s + 0.78, 11.75, 13.8), 0.06)
    onWall(trim, f[0], f[1], archShape(s, 1.8, 14.45, 14.6, 10), 0.03)
    onWall(win, f[0], f[1], archShape(s, 1.45, 14.65, 14.7, 10), 0.06)
  }
  for (let k = -4; k <= 3; k++) pilaster(f[0], f[1], X + (k + 0.5) * 3.1)
  pilaster(f[0], f[1], 0.7, 1.0)
  pilaster(f[0], f[1], 2 * X - 0.7, 1.0)
}

// ── West chimney ──
box(brick, -X + 0.3, -X + 1.4, -0.6, 0.6, RIDGE - 2, 23.5, brick, 0.05)
box(trim, -X + 0.2, -X + 1.5, -0.7, 0.7, 23.5, 23.8, trim, 0.05)

// ── Cupola ──
const CX = 12.0, CY = 0
const sq = (h: number, z0: number, z1: number, p = trim, bev = 0.1) => box(p, CX - h, CX + h, CY - h, CY + h, z0, z1, p, bev)
const faces = (h: number): F[] => [
  [[CX - h, CY - h], [CX + h, CY - h]], [[CX + h, CY - h], [CX + h, CY + h]],
  [[CX + h, CY + h], [CX - h, CY + h]], [[CX - h, CY + h], [CX - h, CY - h]],
]
// square base, an arched window a face, a heavy cornice
sq(3.2, 19.0, 24.9, trim, 0)
for (const [a, b] of faces(3.2)) {
  onWall(trim, a, b, archShape(3.2, 1.3, 21.3, 23.0, 10), 0.03)
  onWall(win, a, b, archShape(3.2, 1.0, 21.45, 23.0, 10), 0.06)
}
sq(3.65, 24.9, 25.4, trim, 0.15)
sq(3.4, 25.4, 25.7, trim, 0.1)
// octagonal belfry: plinth, eight arched openings between corner pilasters, cornice
const oct = (r: number): XY[] => Array.from({ length: 8 }, (_, i) => {
  const a = Math.PI / 8 + (i / 8) * Math.PI * 2
  return [CX + (r / Math.cos(Math.PI / 8)) * Math.cos(a), CY + (r / Math.cos(Math.PI / 8)) * Math.sin(a)] as XY
})
revolve(trim, [CX, CY], [[2.5, 25.7], [2.5, 26.2], [2.2, 26.2], [2.2, 30.5], [2.55, 30.8], [2.7, 31.25], [2.4, 31.5], [0, 31.5]], 8, 0, true, false)
{
  const o = oct(2.2)
  for (let i = 0; i < 8; i++) {
    const a = o[i], b = o[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    onWall(door, a, b, archShape(L / 2, 1.05, 26.6, 29.3, 10), 0.03)
    onWall(trim, a, b, rectShape(-0.02, 0.22, 26.2, 30.5), 0.08)
    onWall(trim, a, b, rectShape(L - 0.22, L + 0.02, 26.2, 30.5), 0.08)
  }
}
// gilded dome, ball, rod and grasshopper
revolve(gold, [CX, CY], [[1.85, 31.5], [1.85, 31.8], [1.78, 32.35], [1.55, 32.9], [1.15, 33.4], [0.6, 33.78], [0, 33.9]], 12, 0, false, false)
revolve(gold, [CX, CY], [[0.06, 33.85], [0.26, 34.05], [0.3, 34.3], [0.22, 34.55], [0.06, 34.7], [0.06, 35.9], [0, 36.0]], 8, 0, true, false)
// the grasshopper: a long body on the rod's tip, its legs and feelers drawn as one bold wedge
// (a horizontal body with a raised hind leg; no upright piece, which read as a cross)
box(gold, CX - 0.9, CX + 0.9, CY - 0.1, CY + 0.1, 36.0, 36.4, gold, 0)
box(gold, CX - 0.9, CX - 0.2, CY - 0.08, CY + 0.08, 36.4, 36.8, gold, 0)

const lit = (p: V3) => (p[2] > 18.8 && Math.abs(p[0] - CX) < 3.8 && Math.abs(p[1] - CY) < 3.8 ? 0.9 : 0)
await save('bos-faneuil-hall', 'Faneuil Hall', [
  { part: brick, material: finish('fh-brick', 0xa35c49) },
  { part: trim, material: { ...finish('fh-white', 0xf4efe6), floodlight: lit } },
  { part: roof, material: finish('fh-slate', 0x7f8891) },
  { part: win, material: PALETTE.window },
  { part: gold, material: { ...finish('fh-gold', 0xd9b45e), floodlight: () => 0.8 } },
  { part: door, material: finish('fh-door', 0x56605d) },
], { height: 36.8, anchor: [42.3600335, -71.0562341], bearing: 352 })
