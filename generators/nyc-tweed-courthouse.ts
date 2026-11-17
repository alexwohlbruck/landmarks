/**
 * Tweed Courthouse (Old New York County Courthouse), 52 Chambers Street,
 * New York (1861–1881, John Kellum; south wing Leopold Eidlitz) — original
 * procedural geometry, CC0-1.0.
 * bun generators/nyc-tweed-courthouse.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 31: the model's north is the Chambers Street
 * front. Anchor = OSM way/575213948's Nominatim centre, -74.0055424,
 * 40.7133991, which is the middle of the main block.
 *
 * Identity (from the photos below):
 *  1. A pale marble Italianate block in an H: two full-depth end pavilions
 *     standing proud of a lower centre, all on a rusticated basement.
 *                                                        (ajay, upstate)
 *  2. The tall Corinthian portico on Chambers Street: four columns rising
 *     from a stair landing to a big pediment, over a broad flight of steps
 *     between stone cheeks.                              (ajay, oct22)
 *  3. Giant pilasters on the pavilions, deep cornices, pedimented windows
 *     on the main floor.                                 (upstate, frontE)
 *  4. The octagonal rotunda over the middle, a stone drum under a low
 *     glass skylight, seen only from above.              (civic, lidar)
 *  5. The lower grey roofs, and the Eidlitz wing behind on the City Hall
 *     side.                                              (lidar)
 *
 * Plan: OSM way/575213948 and its parts, turned to bearing 31. Pavilions
 * x ±20 to ±38.5, y ±23.7; centre y ±18.2; portico projection x ±8.7 to
 * y 23.3; south wing x ±9 to y -32.7; rotunda octagon apothem 8.3 (part
 * way/214791744).
 *
 * Heights: USGS 3DEP lidar, NY_NewYorkCity, read in the model frame with
 * tools/lidar_frame.py, ground 1.2 m on Chambers Street (2.1 m on the park
 * side). Measured: pavilion tops 23.6, cross-roof ridge 26.9, pediment apex
 * 27.4, rotunda drum 29.3 and skylight peak 32.5, south wing about 23 to
 * 26.5, steps rising about 4.5 m to the portico. OSM says 25 m.
 *
 * Estimated: the centre cornice (21 m, from ajay against the pavilions'),
 * storey and window sizes (ajay), bay counts on the long sides (upstate,
 * frontE), column spacing and diameter (ajay), the stair's run (lidar
 * rows north of the building). The south wing's look: no usable licensed
 * photo shows it, so it is drawn in the same stone with plain windows.
 *
 * Photos (evidence):
 *  ajay     "Tweed Courthouse (55313845566).jpg", Ajay Suresh, CC BY 4.0 —
 *           the Chambers Street front, square on.
 *  upstate  "Tweed Courthouse.jpg", Upstateherd, CC BY-SA 4.0 — from the
 *           north-east.
 *  frontE   "Tweed Court front East sun jeh.jpg", Jim.henderson, CC0.
 *  oct22    "Tweed Courthouse October 2022.jpg", Kidfly182, CC BY-SA 4.0 —
 *           the portico.
 *  north    "Tweed Courthouse north main facade 118443pv.jpg", Walter
 *           Smalling Jr. (HABS), public domain.
 *  civic    "New York - New York City - NARA - 68145666 Crop 2 - Civic
 *           Center.jpg", public domain — an old aerial showing the rotunda.
 * All on Wikimedia Commons.
 */
import { Part, type V3, cross, sub } from './mesh'
import { PALETTE, finish } from './palette'
import { box, ccw, cornice, hipRoof, onWall, prism, pyramid, rectShape, archShape, save, type XY } from './atl-tech-tower'
import { along, column } from './atl-flatiron-building'

const marble = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part(), glass = new Part()

const BASE = 5.0 // the rusticated basement's top
const PAV = 23.6, MID = 21.0, RIDGE = 26.9, WING = 23.0
const PX0 = 20, PX1 = 38.5, PY = 23.7, CY = 18.2, PORT = 8.7, PORTY = 23.3, WX = 9, WY = -32.7

/** A quad wound to face `want`. */
function face(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}

// ── Massing ──
type R4 = [number, number, number, number]
const rect = ([x0, x1, y0, y1]: R4) => ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]] as XY[])
const pavs: R4[] = [[-PX1, -PX0, -PY, PY], [PX0, PX1, -PY, PY]]
const centre: R4 = [-PX0, PX0, -CY, CY]
const wing: R4 = [-WX, WX, WY, -CY + 0.5]
const blocks: [R4, number][] = [...pavs.map((r) => [r, PAV] as [R4, number]), [centre, MID], [wing, WING]]
for (const [r, top] of blocks) {
  box(marble, r[0], r[1], r[2], r[3], 0, top - 1.1, null, 0)
  box(marble, r[0] - 0.15, r[1] + 0.15, r[2] - 0.15, r[3] + 0.15, 0, BASE, null, 0) // rusticated basement
  for (const z of [1.7, 3.4]) box(trim, r[0] - 0.2, r[1] + 0.2, r[2] - 0.2, r[3] + 0.2, z, z + 0.12, null, 0) // its joints
  box(trim, r[0] - 0.3, r[1] + 0.3, r[2] - 0.3, r[3] + 0.3, BASE, BASE + 0.4, null, 0.1) // water table
  cornice(trim, rect(r), top - 1.1, 1.1, 0.8, trim)
}
// Roofs: the pavilions, the centre, the cross roof over the middle, the wing.
for (const r of pavs) hipRoof(roof, r[0], r[1], r[2], r[3], PAV, PAV + 1.6, 0.2)
hipRoof(roof, -PX0, PX0, -CY, CY, MID, PAV, 0.3)
hipRoof(roof, -PX1 + 2, PX1 - 2, -8, 8, PAV, RIDGE, 0.1)
hipRoof(roof, wing[0], wing[1], wing[2], wing[3], WING, 26.5, 0.3)

// ── The rotunda: an octagonal drum under a low glass skylight ──
const AP = 8.3, oct: XY[] = Array.from({ length: 8 }, (_, i) => {
  const a = Math.PI / 8 + (i / 8) * Math.PI * 2, r = AP / Math.cos(Math.PI / 8)
  return [r * Math.cos(a), r * Math.sin(a)] as XY
})
prism(marble, oct, 22, 29.3, null, 0)
cornice(trim, oct, 28.6, 0.7, 0.5, trim)
pyramid(glass, [0, 0], AP, 29.3, 32.5, 8, Math.PI / 8)
for (let i = 0; i < 8; i++) {
  const a = oct[i], b = oct[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  onWall(win, a, b, archShape(L / 2, 2.6, 25.2, 27.0, 8))
}

// ── Pilasters, windows and their heads ──
/** Giant pilasters on a face a→b (outside on the right), at each bay edge. */
function pilasters(a: XY, b: XY, bays: number, z0: number, z1: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  for (let k = 0; k <= bays; k++) {
    const s = Math.min(L - 0.6, Math.max(0.6, (k * L) / bays))
    const p = along(a, b, s - 0.6, 0), q = along(a, b, s + 0.6, 0.3)
    box(marble, Math.min(p[0], q[0]), Math.max(p[0], q[0]), Math.min(p[1], q[1]), Math.max(p[1], q[1]), z0, z1, null, 0.08)
  }
}
const ROWS: [number, number][] = [[1.8, 4.0], [6.2, 10.6], [12.4, 15.6]]
/** Windows on a face a→b in `bays` bays; the main-floor ones get a stone head. */
function windows(a: XY, b: XY, bays: number, rows = ROWS, w = 1.7, skip?: (j: number, r: number) => boolean) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  for (let j = 0; j < bays; j++) {
    const s = ((j + 0.5) * L) / bays
    rows.forEach(([z0, z1], r) => {
      if (skip?.(j, r)) return
      onWall(win, a, b, rectShape(s - w / 2, s + w / 2, z0, z1), z1 < BASE ? 0.2 : 0.05)
      if (r !== 1) return
      // the main floor's stone head
      const p = along(a, b, s - w / 2 - 0.35, 0), q = along(a, b, s + w / 2 + 0.35, 0.35)
      box(trim, Math.min(p[0], q[0]), Math.max(p[0], q[0]), Math.min(p[1], q[1]), Math.max(p[1], q[1]), z1 + 0.15, z1 + 0.75, trim, 0)
    })
  }
}
// Faces run a→b with the outside on the right: north faces east to west,
// south faces west to east, east faces south to north, west faces north to south.
for (const sx of [-1, 1]) {
  const o = sx * PX1, i = sx * PX0
  const faces: [XY, XY, number][] = sx > 0
    ? [[[o, PY], [i, PY], 3], [[o, -PY], [o, PY], 9], [[i, -PY], [o, -PY], 3]]
    : [[[i, PY], [o, PY], 3], [[o, PY], [o, -PY], 9], [[o, -PY], [i, -PY], 3]]
  for (const [a, b, n] of faces) {
    windows(a, b, n)
    pilasters(a, b, n, BASE + 0.4, PAV - 1.1)
  }
  // The pavilions' inner faces, in front of and behind the centre.
  if (sx > 0) { windows([PX0, PY], [PX0, CY], 1, ROWS, 1.4); windows([PX0, -CY], [PX0, -PY], 1, ROWS, 1.4) }
  else { windows([-PX0, CY], [-PX0, PY], 1, ROWS, 1.4); windows([-PX0, -PY], [-PX0, -CY], 1, ROWS, 1.4) }
}
// The centre's front either side of the portico, and its back either side of the wing.
windows([PX0, CY], [PORT, CY], 3); windows([-PORT, CY], [-PX0, CY], 3)
windows([WX, -CY], [PX0, -CY], 3); windows([-PX0, -CY], [-WX, -CY], 3)
// The south wing.
windows([WX, WY], [WX, -CY], 4, ROWS, 1.5)
windows([-WX, -CY], [-WX, WY], 4, ROWS, 1.5)
windows([-WX, WY], [WX, WY], 4, ROWS, 1.5)

// ── The portico ──
const LAND = 4.8, CAP = 19.5, ENT = 21.8, APEX = 27.4
box(marble, -PORT, PORT, CY, PORTY, 0, LAND, trim, 0.1) // the landing's podium
for (const x of [-6.4, -2.1, 2.1, 6.4]) {
  box(trim, x - 0.9, x + 0.9, PORTY - 2.0, PORTY - 0.2, LAND, LAND + 0.6, trim, 0.08) // base
  column(marble, [x, PORTY - 1.1], 0.7, LAND + 0.6, CAP - 1.0, 14)
  box(trim, x - 0.95, x + 0.95, PORTY - 2.05, PORTY - 0.15, CAP - 1.0, CAP, trim, 0.15) // Corinthian capital, as a block
}
// Antae at the back of the portico.
for (const x of [-8.1, 8.1]) box(marble, x - 0.6, x + 0.6, CY, CY + 0.6, LAND, CAP, null, 0.05)
box(trim, -PORT - 0.2, PORT + 0.2, CY, PORTY + 0.2, CAP, ENT, trim, 0.15) // entablature
{
  // The pediment, its roof running back into the cross roof.
  const f = PORTY + 0.2, back = 8, z0 = ENT
  const A: V3 = [-PORT - 0.3, f, z0], B: V3 = [PORT + 0.3, f, z0], C: V3 = [0, f, APEX]
  const A2: V3 = [-PORT - 0.3, back, z0], B2: V3 = [PORT + 0.3, back, z0], C2: V3 = [0, back, APEX]
  trim.tri(B, A, C)
  face(roof, A2, A, C, C2, [-1, 0, 1])
  face(roof, B, B2, C2, C, [1, 0, 1])
}
// The three arched doors on the landing, and the windows over them.
const bf: [XY, XY] = [[PORT, CY], [-PORT, CY]] // the portico's back wall; s runs east to west
for (const x of [-3.7, 0, 3.7]) {
  const s = PORT - x
  onWall(door, ...bf, archShape(s, 1.9, LAND, LAND + 3.6, 8))
  onWall(win, ...bf, rectShape(s - 0.8, s + 0.8, 12.4, 15.6))
}
// The steps: treads from the landing down to the street, between cheeks.
const STEPS = 9, RUN = 6.8
for (let k = 0; k < STEPS; k++) {
  const y1 = PORTY + (RUN * (k + 1)) / STEPS, z = LAND * (1 - k / STEPS)
  box(trim, -6.4, 6.4, PORTY, y1, -0.8, z, trim, 0.02)
}
for (const sx of [-1, 1]) {
  const x0 = sx * 6.4, x1 = sx * 8.6
  box(marble, Math.min(x0, x1), Math.max(x0, x1), PORTY, PORTY + RUN, -0.8, 1.6, trim, 0.1)
  box(marble, Math.min(x0, x1), Math.max(x0, x1), PORTY, PORTY + 2.2, 1.6, LAND + 1.0, trim, 0.1)
}

const front = (p: V3, n: V3) => (n[1] > 0.5 || (p[1] > CY && Math.abs(p[0]) < PORT + 1) ? 0.7 : 0)
await save('nyc-tweed-courthouse', 'Tweed Courthouse', [
  { part: marble, material: { ...finish('tweed-marble', 0xebe2d1), floodlight: front } },
  { part: trim, material: { ...finish('tweed-trim', 0xf3eee3), floodlight: front } },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
  { part: glass, material: PALETTE.glass },
], { height: 32.5, anchor: [40.7133991, -74.0055424], bearing: 31 }, 6500)
