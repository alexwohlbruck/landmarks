/**
 * Lakewood Church Central Campus, Houston — the former Summit / Compaq Center
 * arena (1975, Kenneth Bentsen Associates), converted to a church in 2005 —
 * procedural, CC0-1.0, no textures.  bun generators/hou-lakewood-church.ts
 *
 * Map frame: x east along the building's long axis, y north, z up, metres.
 * Placed at bearing 357.9°, the axis of the OSM outline way/118780514 (its
 * sides come out square in this frame). The anchor is the outline's area
 * centroid. z = 0 is the lowest ground at the footprint, the service drive
 * along the north side; the Southwest Freeway (south) side stands on a grass
 * berm and terrace about 6–8 m higher.
 *
 * What makes it read as itself, from the photos: a long, plain box of
 * beige precast panels whose top two-thirds is solid, standing over a
 * recessed glass ground storey behind a colonnade of square white piers
 * (south and west faces); the tall black granite sign wall with the
 * Lakewood flame logo, its top a concave curve, near the east end of the
 * freeway front; the taller 2005 east block with tall recessed windows; the
 * low hipped arena roof.
 *
 * Evidence
 * - OSM: outline way/118780514 (building=sports_centre, height 28,
 *   wikidata Q2435324); no building:parts.
 * - Measured, lidar: USGS 3DEP TX_Coastal_B1_2018 (flight 2018), 1 m, read
 *   in this frame above the box's lowest ground (the north drive):
 *   main block x -82.6..47, y -56.4..38.2, parapet 29.5 m, its roof rising
 *   as a low hip to a 31.8 m plateau over x -40..20, y -25..5; east block
 *   x 47..86.5, 31.0 m, with a 34.3 m penthouse at x 58..76, y 2..16; its
 *   south wing (x 47..71.8, to y -56.4) 29.1 m; north block x -68.6..34,
 *   y 38.2..62.6, 24.2 m; the south terrace 8.3 m, about 5 m deep; the west
 *   canopy 11.6 m at x -90..-84, y -38..17; ground 0.2–1.5 m north and
 *   east, 6–7 m west, 4.5–6 m south.
 * - USGS NAIP orthophoto: plan of the blocks and the west canopy, roof
 *   colours (light grey arena roof, darker east block).
 * - Published (Wikipedia "Lakewood Church Central Campus"): opened 1975 as
 *   The Summit; Lakewood Church since 2005 after a $95 million renovation
 *   (John Bertini; Morris Architects).
 * - Photos (Wikimedia Commons): WhisperToMe, "GreenwayPlazaandLakewoodChurch"
 *   (CC0, from the freeway to the south-west), "Lakewood Church0" (CC0, the
 *   sign wall and colonnade), "Lakewoodchurch1" (CC0, south-west corner);
 *   Hequals2henry, "Lakewood church.jpg" (CC BY-SA 3.0, the south front from
 *   the south-west); Djarizpe13, "Lakewood church.JPG" (public domain);
 *   BrandonDJAdams1994, "Lakewoodchurch.jpg" (CC BY-SA 3.0, the south and
 *   east fronts).
 *
 * Estimated: the glass storey's height (to 18.5 m, about half of the face
 * above the terrace, from the photos), pier spacing (1.8 m piers every 7.6 m, counted on
 * the south front), the sign wall (22 m wide, 2.5 m proud, its corners 7 m
 * above the parapet, its middle 4.5 m above it, scaled from both photos), the east
 * block's window bays (photos), the canopy's posts.
 * Doubts: no licensed photo shows the north face or the east face close up,
 * so they are plain panels; the "Lakewood globe" sculpture named in the
 * brief appears in none of the licensed photos (Commons; the Openverse search
 * failed) or in the NAIP aerial, so it is left out until a licensed photo
 * shows its size and place. The lettering on the sign is left out; the logo ring is kept.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const precast = new Part(), trim = new Part(), win = new Part()
const roof = new Part(), granite = new Part(), logo = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]

function tri(p: Part, A: V3, B: V3, C: V3, hint: V3) {
  const f = cross(sub(B, A), sub(C, A))
  if (Math.hypot(...f) < 1e-9) return
  if (dot(f, hint) >= 0) p.tri(A, B, C)
  else p.tri(A, C, B)
}
function quad(p: Part, P: V3[], hint: V3) {
  const f = add(cross(sub(P[1], P[0]), sub(P[2], P[0])), cross(sub(P[2], P[0]), sub(P[3], P[0])))
  const o = dot(f, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  tri(p, P[o[0]], P[o[1]], P[o[2]], hint)
  tri(p, P[o[0]], P[o[2]], P[o[3]], hint)
}
/** A vertical wall from a to b, split into pieces no longer than 5 m along and up to `z1`. */
function wall(p: Part, a: XY, b: XY, z0: number, z1: number, out: V3) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / 5))
  for (let i = 0; i < n; i++) {
    const t0 = i / n, t1 = (i + 1) / n
    const p0: XY = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0]
    const p1: XY = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]
    quad(p, [[p0[0], p0[1], z0], [p1[0], p1[1], z0], [p1[0], p1[1], z1], [p0[0], p0[1], z1]], out)
  }
}
/** Axis-aligned box; `skip` drops faces: t b e w n s. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, skip = '', top?: Part) {
  if (!skip.includes('t')) quad(top ?? p, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1])
  if (!skip.includes('b')) quad(p, [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], [0, 0, -1])
  if (!skip.includes('e')) wall(p, [x1, y0], [x1, y1], z0, z1, [1, 0, 0])
  if (!skip.includes('w')) wall(p, [x0, y0], [x0, y1], z0, z1, [-1, 0, 0])
  if (!skip.includes('n')) wall(p, [x0, y1], [x1, y1], z0, z1, [0, 1, 0])
  if (!skip.includes('s')) wall(p, [x0, y0], [x1, y0], z0, z1, [0, -1, 0])
}

// ---------------------------------------------------------------------------
// Main block: the old arena. South and west fronts: the beige panelled wall
// from the lintel (18.5 m) to the parapet, over a tall glass storey (from the
// terrace, 8.3 m: about the lower 40% of the wall seen above the berm, from
// the photos) set 0.6 m back behind a colonnade of bold square white piers
// that stand 0.6 m proud of the wall above. North and the rest: precast to
// the ground.

const X0 = -82.6, X1 = 47, Y0 = -56.4, Y1 = 38.2, PAR = 29.5, TER = 8.3, LIN = 18.5, SET = 0.6
// North and east (into the east block, hidden) faces: plain.
box(precast, X0, X1, Y0, Y1, 0, PAR, 'tbsw')
// South and west upper band, from the lintel to the parapet, with its soffit.
wall(precast, [X0, Y0], [X1, Y0], LIN, PAR, [0, -1, 0])
wall(precast, [X0, Y0], [X0, Y1], LIN, PAR, [-1, 0, 0])
quad(trim, [[X0, Y0, LIN], [X1, Y0, LIN], [X1, Y0 + SET, LIN], [X0 + SET, Y0 + SET, LIN]], [0, 0, -1])
quad(trim, [[X0, Y0, LIN], [X0 + SET, Y0 + SET, LIN], [X0 + SET, Y1, LIN], [X0, Y1, LIN]], [0, 0, -1])
// A white lintel band along the foot of the panelled wall, as photographed.
wall(trim, [X0 - 0.06, Y0 - 0.06], [X1, Y0 - 0.06], LIN, LIN + 0.9, [0, -1, 0])
wall(trim, [X0 - 0.06, Y0 - 0.06], [X0 - 0.06, Y1], LIN, LIN + 0.9, [-1, 0, 0])
// Behind the piers: a recessed wall (hidden) and the precast base below the terrace.
wall(precast, [X0 + SET, Y0 + SET], [X1, Y0 + SET], 0, TER, [0, -1, 0])
wall(precast, [X0 + SET, Y0 + SET], [X0 + SET, Y1], 0, TER, [-1, 0, 0])
// Piers: 1.8 m wide, 1.2 m deep, white, from the terrace to the lintel band,
// every 7.6 m, 0.6 m proud of the wall above; one dark glass panel fills each
// bay from pier to pier (5.8 m), recessed 0.6 m behind the wall face. The sign wall takes the south front from x = 24 to 46.
const PIER = 1.8, BAY = 7.6
const sx: number[] = []
for (let x = X0; x < 22; x += BAY) sx.push(x)
sx.push(24 - PIER)
sx.forEach((x, i) => {
  box(trim, x, x + PIER, Y0 - 0.6, Y0 + SET, TER, LIN, 'tb')
  const nx = i + 1 < sx.length ? sx[i + 1] : null
  if (nx !== null) {
    quad(win, [[x + PIER, Y0 + SET, TER], [nx, Y0 + SET, TER], [nx, Y0 + SET, LIN], [x + PIER, Y0 + SET, LIN]], [0, -1, 0])
  }
})
wall(win, [24, Y0 + SET], [X1, Y0 + SET], TER, LIN, [0, -1, 0]) // behind the sign
const wy: number[] = []
for (let y = Y1 - PIER; y > Y0 + SET; y -= BAY) wy.push(y)
wy.forEach((y, i) => {
  box(trim, X0 - 0.6, X0 + SET, y, y + PIER, TER, LIN, 'tb')
  const ny = i + 1 < wy.length ? wy[i + 1] + PIER : Y0 + SET
  quad(win, [[X0 + SET, ny, TER], [X0 + SET, y, TER], [X0 + SET, y, LIN], [X0 + SET, ny, LIN]], [-1, 0, 0])
})
// Panel joints in the beige wall: a pale line over each pier, nothing finer.
for (const x of sx.slice(0, -1)) quad(trim, [[x + PIER / 2 - 0.2, Y0 - 0.06, LIN + 0.9], [x + PIER / 2 + 0.2, Y0 - 0.06, LIN + 0.9], [x + PIER / 2 + 0.2, Y0 - 0.06, PAR - 0.3], [x + PIER / 2 - 0.2, Y0 - 0.06, PAR - 0.3]], [0, -1, 0])
for (const y of wy) quad(trim, [[X0 - 0.06, y + PIER / 2 - 0.2, LIN + 0.9], [X0 - 0.06, y + PIER / 2 + 0.2, LIN + 0.9], [X0 - 0.06, y + PIER / 2 + 0.2, PAR - 0.3], [X0 - 0.06, y + PIER / 2 - 0.2, PAR - 0.3]], [-1, 0, 0])
// The terrace in front of both glass fronts, and its retaining wall.
box(precast, X0 - 4, X1, Y0 - 5.5, Y0 - 0.6, 0, TER, 'bn', trim)
box(precast, X0 - 4, X0 - 0.6, Y0 - 0.6, Y1, 0, TER, 'bse', trim)
quad(trim, [[X0 - 0.6, Y0 - 0.6, TER], [X1, Y0 - 0.6, TER], [X1, Y0 + SET, TER], [X0 + SET, Y0 + SET, TER]], [0, 0, 1])
quad(trim, [[X0 - 0.6, Y0 - 0.6, TER], [X0 + SET, Y0 + SET, TER], [X0 + SET, Y1, TER], [X0 - 0.6, Y1, TER]], [0, 0, 1])

// Roof: a low hip from the parapet line to a plateau (lidar).
{
  const z0 = PAR - 0.1, z1 = 31.8
  const O: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
  const I: XY[] = [[-40, -25], [20, -25], [20, 5], [-40, 5]]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    quad(roof, [[O[i][0], O[i][1], z0], [O[j][0], O[j][1], z0], [I[j][0], I[j][1], z1], [I[i][0], I[i][1], z1]], [0, 0, 1])
  }
  quad(roof, I.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  // Parapet lip all round.
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const a = O[i], b = O[j]
    const n: XY = [b[1] - a[1], -(b[0] - a[0])], l = Math.hypot(...n)
    const ins: XY = [-n[0] / l * 0.6, -n[1] / l * 0.6]
    quad(precast, [[a[0], a[1], PAR], [b[0], b[1], PAR], [b[0] + ins[0], b[1] + ins[1], PAR], [a[0] + ins[0], a[1] + ins[1], PAR]], [0, 0, 1])
  }
}

// ---------------------------------------------------------------------------
// North block (24.2 m) and the strip east of it.
box(precast, -68.6, 34, Y1, 62.6, 0, 24.2, 'bs', roof)
box(precast, 34, X1, Y1, 44.7, 0, 24.2, 'bsw', roof)

// ---------------------------------------------------------------------------
// East block (2005): 31 m, its south wing 29.1 m, a 34.3 m penthouse, and
// a tall window bay split by a white pier in its south front and two in its east front.
box(precast, X1, 86.5, -48, 44.7, 0, 31, 'bw', roof)
box(precast, X1, 71.8, Y0, -48, 0, 29.1, 'bwn', roof)
box(roof, 58, 76, 2, 16, 31, 34.3, 'b')
quad(win, [[49.5, Y0 - 0.05, TER + 0.5], [61.5, Y0 - 0.05, TER + 0.5], [61.5, Y0 - 0.05, 23.5], [49.5, Y0 - 0.05, 23.5]], [0, -1, 0])
box(trim, 54.7, 56.3, Y0 - 0.6, Y0, TER + 0.5, 23.5, 'b')
for (const [y0, y1] of [[-36, -20], [20, 36]] as XY[]) {
  quad(win, [[86.55, y0, 3], [86.55, y1, 3], [86.55, y1, 24], [86.55, y0, 24]], [1, 0, 0])
}

// ---------------------------------------------------------------------------
// The west canopy over the drive (11.6 m, 1 m deep fascia) on four posts.
box(trim, -90, -84, -38, 17, 10.6, 11.6)
for (const y of [-37, -18, -1, 16]) box(trim, -89.6, -89, y - 0.3, y + 0.3, 0, 10.6, 'tb')

// ---------------------------------------------------------------------------
// The black granite sign wall near the east end of the freeway front: 22 m
// wide (about two and a half bays), 2.5 m proud of the face, from the
// terrace to a concave top 7 m above the parapet at its corners and 4.5 m
// above it in the middle (about a quarter of the wall's height, scaled from
// both photos). The flame logo's ring, white and lit, bold on its face.
{
  const xa = 24, xb = 46, y0 = Y0 - 2.5, y1 = Y0 + 0.5, SEG = 8
  const top = (x: number) => PAR + 4.5 + 2.5 * Math.pow((x - (xa + xb) / 2) / ((xb - xa) / 2), 2)
  for (let i = 0; i < SEG; i++) {
    const s0 = xa + ((xb - xa) * i) / SEG, s1 = xa + ((xb - xa) * (i + 1)) / SEG
    quad(granite, [[s0, y0, TER], [s1, y0, TER], [s1, y0, top(s1)], [s0, y0, top(s0)]], [0, -1, 0])
    quad(granite, [[s0, y1, LIN], [s1, y1, LIN], [s1, y1, top(s1)], [s0, y1, top(s0)]], [0, 1, 0])
    quad(granite, [[s0, y0, top(s0)], [s1, y0, top(s1)], [s1, y1, top(s1)], [s0, y1, top(s0)]], [0, 0, 1])
  }
  for (const x of [xa, xb]) quad(granite, [[x, y0, TER], [x, y1, TER], [x, y1, top(x)], [x, y0, top(x)]], [x === xa ? -1 : 1, 0, 0])
  // Logo ring: outer radius 5.4 m, 1.8 m wide, centred level with the parapet.
  const cx = (xa + xb) / 2, cz = PAR, R = 5.4, r = 3.6, N = 16, yy = y0 - 0.06
  for (let i = 0; i < N; i++) {
    const a0 = (i / N) * 2 * Math.PI, a1 = ((i + 1) / N) * 2 * Math.PI
    const p = (rad: number, a: number): V3 => [cx + rad * Math.cos(a), yy, cz + rad * Math.sin(a)]
    quad(logo, [p(r, a0), p(R, a0), p(R, a1), p(r, a1)], [0, -1, 0])
  }
}

// ---------------------------------------------------------------------------
// Materials (six). The beige precast is sampled from four daylight photos
// (grey-beige in the noon shots, pinker at sunset) and kept at the
// palette's lightness; the piers, soffit, terrace and canopy are white
// trim; the glass storey and window bays glow at night; the granite is the
// style's charcoal; the logo is lit at night.
const parts = [
  { part: precast, material: finish('lakewood-precast', 0xd9cbb7) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: finish('lakewood-roof', 0xb3b6b5) },
  { part: granite, material: finish('lakewood-granite', 0x4a4f57) },
  { part: logo, material: finish('neon-lakewood-logo', 0xf4f1ea) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(22), part.triangles)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Lakewood Church Central Campus', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 357.9, osm: 'way/118780514', height: 34.3,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const outPath = new URL('../models/hou-lakewood-church.glb', import.meta.url).pathname
await Bun.write(outPath, glb)
console.log(`${outPath}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
