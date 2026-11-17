/**
 * Vanderbilt Hall (Arthur T. Vanderbilt Hall), NYU School of Law,
 * 40 Washington Square South, New York (1951, Eggers & Higgins) — original
 * procedural geometry, CC0-1.0.
 * bun generators/nyc-nyu-law-vanderbilt-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 33: the model's north is the Washington Square
 * South front, which faces bearing 33 like the Manhattan grid. Anchor = the
 * centre of OSM relation/3343762's outer way, -73.9994876, 40.7305463.
 *
 * Identity (from the photos below):
 *  1. A red-brick neo-Georgian block filling the whole block, built round a
 *     garden court that opens onto the street.            (vh1, aerial)
 *  2. The one-storey brick arcade closing the court on Washington Square
 *     South, a covered walk open through seven of its nine round arches on a granite plinth, the middle one the gate,
 *     the end ones blind with pale tablets.               (vh1, entrance)
 *  3. Light green copper hipped roofs over every range, a taller cross
 *     range at the back of the court, brick chimneys, and a flat-topped
 *     monitor on the east wing.                           (aerial, lidar)
 *  4. Limestone trim: plinth, a course at the arcade top, a course under
 *     the top storey and the eaves cornice.               (vh1)
 *  5. The court's main door in a pedimented stone portico.  (entrance, ajay)
 *
 * Plan: OSM relation/3343762 (outer way/248166318, court way/248166316),
 * turned to bearing 33. Outer walls x ±29.4, y ±31.4; the court x ±11.6,
 * y 5.7 to 26.9; the arcade y 26.9 to 30.3, the wings' inner strips set
 * back 1 m to y 30.3 (OSM's notch).
 *
 * Heights: USGS 3DEP lidar, NY_NewYorkCity, read in the model frame with
 * tools/lidar_frame.py; ground at 5.5 m. Measured: wing eaves 18.8 m, wing
 * ridges 21.8 m, cross range ridge 24.8 m, east-wing monitor top 25.6 m,
 * chimneys about 29.3 m, rear low section 10.7 m, arcade top 6.0 m. OSM
 * says 24.1 m to the roof.
 *
 * Estimated: storey heights and window rows (from vh1), arcade bay rhythm
 * (nine bays read off vh1 and entrance), arch sizes, the portico, the
 * chimney plan (from lidar spikes), the rear section's roof (no photo shows
 * it; drawn flat and pale). The wing ends' blind brick panels above the
 * arcade are left plain.
 *
 * Signs: the three real plaques on the gate piers ("40", "Arthur T.
 * Vanderbilt Hall", "New York University School of Law") are plain dark
 * boxes, per STYLE.md.
 *
 * Photos (evidence):
 *  vh1      "NYULaw VanderbiltHall.jpg", Peter Brown, CC BY-SA 4.0 —
 *           the arcade and both wings from Washington Square South.
 *  vh2      "NYULaw VanderbiltHall2.jpg", Peter Brown, CC BY-SA 4.0.
 *  entrance "NYU School of Law Arthur T Vanderbilt Hall entrance way
 *           November 2024.jpg", BruceSchaff, CC BY-SA 4.0 — the gate arch,
 *           its piers and plaques, the portico beyond.
 *  ajay     "NYU School of Law (51661212260).jpg", ajay_suresh, CC BY 2.0.
 *  aerial   "NYU Campus aerial.jpg", Wil Fyfordy, CC BY-SA 4.0 — the
 *           copper roofs, chimneys and east monitor from the east.
 *  arches   "Vanderbilt arches NYU jeh.JPG", Jim.henderson, CC0.
 * All on Wikimedia Commons.
 */
import { Part, type V3, cross, sub } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, ccw, cornice, hipRoof, onWall, rectShape, save, type XY } from './atl-tech-tower'

const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part(), plaque = new Part()

const EAVE = 18.8, WING_RIDGE = 21.8, CROSS_RIDGE = 24.8, BACK = 10.7, ARCADE = 6.0
const X = 29.4, Y = 31.4, CX = 11.6, CY0 = 5.7, CY1 = 26.9, AY = 30.3, NOTCH = 15.8

// ── Massing ──
const blocks: [number, number, number, number, number][] = [
  [-X, -NOTCH, -Y, Y, EAVE], [NOTCH, X, -Y, Y, EAVE], // wings
  [-NOTCH, -CX, -Y, CY1, EAVE], [CX, NOTCH, -Y, CY1, EAVE], // the wings' set-back inner strips
  [-CX, CX, -14, CY0, EAVE], // cross range at the back of the court
  [-CX, CX, -Y, -14, BACK], // low rear section
]
for (const [x0, x1, y0, y1, z] of blocks) {
  box(brick, x0, x1, y0, y1, 0, z, z === BACK ? trim : null, z === BACK ? 0.3 : 0)
  box(trim, x0 - 0.08, x1 + 0.08, y0 - 0.08, y1 + 0.08, 0, 0.9, null, 0) // granite plinth
}
// The strips' upper storeys stand on the arcade's end bays.
for (const s of [-1, 1]) box(brick, s < 0 ? -NOTCH : CX, s < 0 ? -CX : NOTCH, CY1, AY, ARCADE - 0.35, EAVE, null, 0)
// Arcade coping and the course that carries it across the wings.
box(trim, -NOTCH - 0.1, NOTCH + 0.1, CY1 - 0.15, AY + 0.15, ARCADE - 0.35, ARCADE + 0.05, trim, 0.08)
for (const s of [-1, 1]) {
  const [a, b] = s < 0 ? [-X, -CX] : [CX, X]
  box(trim, a - 0.12, b + 0.12, -Y - 0.12, Y + 0.12, ARCADE - 0.35, ARCADE, trim, 0.05)
  box(trim, a - 0.1, b + 0.1, -Y - 0.1, Y + 0.1, 15.3, 15.6, trim, 0.05)
  const wing = ccw([[a, -Y], [b, -Y], [b, Y], [a, Y]] as XY[])
  cornice(trim, wing, EAVE - 0.7, 0.7, 0.5, null)
  hipRoof(roof, a, b, -Y, Y, EAVE, WING_RIDGE, 0.5)
}
box(trim, -CX, CX, -14.1, CY0 + 0.1, 15.3, 15.6, trim, 0.05)
cornice(trim, ccw([[-X, -14], [X, -14], [X, CY0], [-X, CY0]] as XY[]), EAVE - 0.7, 0.7, 0.5, null)
hipRoof(roof, -X, X, -14, CY0, EAVE, CROSS_RIDGE, 0.5)
// The east wing's monitor, flat topped.
box(roof, 15.5, 23, -20, 16, 20.5, 25.6, trim, 0.25)
// Chimneys.
for (const x of [-16, 16]) for (const y of [-2, -8]) box(brick, x - 0.9, x + 0.9, y - 0.8, y + 0.8, 20, 29.3, trim, 0.15)

// ── Windows: one slate panel per window ──
const ROWS: [number, number][] = [[2.0, 4.6], [7.0, 9.0], [10.2, 12.2], [13.2, 15.0], [16.0, 17.8]]
/** Windows along a face; a→b runs with the outside on the right. */
function windows(a: XY, b: XY, rows: [number, number][], pitch = 3.3, w = 1.35, skip?: (j: number, r: number) => boolean) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.round(L / pitch))
  for (let j = 0; j < k; j++) {
    const s = ((j + 0.5) * L) / k
    rows.forEach(([z0, z1], r) => { if (!skip?.(j, r)) onWall(win, a, b, rectShape(s - w / 2, s + w / 2, z0, z1)) })
  }
}
// Each face a→b with the outside on the right.
windows([X, -Y], [X, Y], ROWS); windows([-X, Y], [-X, -Y], ROWS) // long sides
windows([X, Y], [NOTCH, Y], ROWS); windows([-NOTCH, Y], [-X, Y], ROWS) // north ends
windows([CX, -Y], [X, -Y], ROWS); windows([-X, -Y], [-CX, -Y], ROWS) // south ends
windows([CX, CY1], [CX, CY0], ROWS); windows([-CX, CY0], [-CX, CY1], ROWS) // court faces
windows([CX, -14], [CX, -Y], ROWS.slice(3)); windows([-CX, -Y], [-CX, -14], ROWS.slice(3)) // over the rear section
windows([CX, CY0], [-CX, CY0], ROWS, 3.3, 1.35, (j, r) => j === 3 && r === 0) // court back, portico in the middle
windows([-CX, -14], [CX, -14], ROWS.slice(3)) // cross range over the rear section
windows([-CX, -Y], [CX, -Y], [[2.0, 4.4], [6.0, 8.6]]) // rear section on West 3rd Street

// ── The arcade: nine bays, the middle the gate, the ends blind ──
// A covered walk: two arched brick walls (street and court) under a flat
// ceiling, the seven middle arches open right through, the end bays solid.
const BAYS = 9, PITCH = (2 * 15.7) / BAYS, AW = 2.5, SPRING = 3.3, TOP = SPRING + AW / 2
const ZT = ARCADE - 0.35, WT = 0.55, E = 15.7 - PITCH // wall top, wall thickness, x of the solid end bays
const front: [XY, XY] = [[15.7, AY], [-15.7, AY]] // s runs east to west
const bayX = (j: number) => 15.7 - (j + 0.5) * PITCH
/** A quad wound to face `want`. */
function face(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}
for (const s of [-1, 1]) {
  // the solid end bays
  box(brick, s < 0 ? -NOTCH : E, s < 0 ? -E : NOTCH, CY1, AY, 0, ZT, null, 0)
  box(trim, s < 0 ? -NOTCH : E, s < 0 ? -E : NOTCH, CY1 - 0.08, AY + 0.08, 0, 0.9, null, 0)
}
for (const [y0, y1] of [[AY - WT, AY], [CY1, CY1 + WT]]) {
  const open = [1, 2, 3, 4, 5, 6, 7].map(bayX).sort((p, q) => p - q)
  // piers, with their granite feet
  const edges = [-E, ...open.flatMap((x) => [x - AW / 2, x + AW / 2]), E]
  for (let k = 0; k < edges.length; k += 2) {
    box(brick, edges[k], edges[k + 1], y0, y1, 0.9, ZT, null, 0)
    box(trim, edges[k], edges[k + 1], y0 - 0.06, y1 + 0.06, 0, 0.9, trim, 0.03)
  }
  for (const x of open) {
    if (Math.abs(x) > 0.1) box(trim, x - AW / 2, x + AW / 2, y0 - 0.03, y1 + 0.03, 0, 0.9, trim, 0.03) // sill
    // the spandrel over the arch and the arch's soffit
    const n = 10, r = AW / 2
    const P = (i: number): [number, number] => [x - r * Math.cos((i / n) * Math.PI), SPRING + r * Math.sin((i / n) * Math.PI)]
    for (let i = 0; i < n; i++) {
      const [xa, za] = P(i), [xb, zb] = P(i + 1)
      face(brick, [xa, y1, za], [xb, y1, zb], [xb, y1, ZT], [xa, y1, ZT], [0, 1, 0])
      face(brick, [xa, y0, za], [xb, y0, zb], [xb, y0, ZT], [xa, y0, ZT], [0, -1, 0])
      face(brick, [xa, y0, za], [xb, y0, zb], [xb, y1, zb], [xa, y1, za], [x - (xa + xb) / 2, 0, SPRING - (za + zb) / 2])
    }
  }
}
box(trim, -E, E, CY1 + WT, AY - WT, ARCADE - 1.1, ZT, null, 0, true) // the walk's ceiling
for (let j = 1; j < BAYS - 1; j++) {
  const s = (j + 0.5) * PITCH
  onWall(trim, ...front, rectShape(s - 0.22, s + 0.22, TOP - 0.35, TOP + 0.3), 0.08) // keystone
}
for (const j of [0, BAYS - 1]) onWall(trim, ...front, archShape((j + 0.5) * PITCH, 1.1, 2.0, 3.2, 8)) // pale tablet in a blind bay
// Stone imposts across every pier.
for (let j = 0; j <= BAYS; j++) {
  const s = j * PITCH, p0 = Math.max(0, s - (PITCH - AW) / 2), p1 = Math.min(2 * 15.7, s + (PITCH - AW) / 2)
  onWall(trim, ...front, rectShape(p0, p1, SPRING - 0.25, SPRING), 0.07)
}

// ── The court portico ──
box(trim, -2.2, 2.2, CY0, CY0 + 1.9, 0, 0.6, trim, 0.05) // steps
for (const x of [-1.15, 1.15]) box(trim, x - 0.22, x + 0.22, CY0, CY0 + 0.6, 0.6, 3.7, null, 0.08)
box(trim, -1.7, 1.7, CY0, CY0 + 0.8, 3.7, 4.15, trim, 0.06)
{
  const f = CY0 + 0.8, z0 = 4.15, z1 = 4.95
  const A: V3 = [-1.75, f, z0], B: V3 = [1.75, f, z0], C: V3 = [0, f, z1]
  const A2: V3 = [-1.75, CY0, z0], B2: V3 = [1.75, CY0, z0], C2: V3 = [0, CY0, z1]
  trim.tri(A, B, C)
  trim.quad(A2, A, C, C2)
  trim.quad(B, B2, C2, C)
}
onWall(win, [CX, CY0], [-CX, CY0], archShape(CX, 1.3, 0.6, 2.6, 8), 0.06) // the door

// ── Plaques on the gate piers ──
const PIER = PITCH / 2 // x of the pier centres either side of the gate
const pl = (x: number, w: number, z0: number, z1: number) => box(plaque, x - w / 2, x + w / 2, AY, AY + 0.04, z0, z1, plaque, 0.01)
pl(PIER, 0.3, 2.25, 2.5) // "40"
pl(PIER, 0.66, 1.55, 1.9) // "Arthur T. Vanderbilt Hall"
pl(-PIER, 0.66, 1.55, 1.9) // "New York University School of Law"

await save('nyc-nyu-law-vanderbilt-hall', 'Vanderbilt Hall', [
  { part: brick, material: finish('vanderbilt-brick', 0xb05c49) },
  { part: trim, material: finish('vanderbilt-limestone', 0xefe6d6) },
  { part: roof, material: PALETTE.copper },
  { part: win, material: PALETTE.window },
  { part: plaque, material: finish('vanderbilt-plaque', 0x4a4f57) },
], { height: 29.3, anchor: [40.7305463, -73.9994876], bearing: 33 })
