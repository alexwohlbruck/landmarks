/**
 * Desert Diamond Arena (opened 2003 as Glendale Arena; later Jobing.com and
 * Gila River Arena), Glendale, Arizona — original procedural geometry,
 * CC0-1.0.
 * bun generators/phx-desert-diamond-arena.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: the arena's long
 * axis runs north–south. Origin: the centre of the building in the lidar,
 * -112.2612598, 33.5319593, 5.5 m east of the centroid of OSM's outline
 * (way/24635891), which sits that far west of the lidar footprint.
 *
 * Identity (from the photos below):
 *  1. A big tan stucco box with gently bowed sides, its roof stepped up in
 *     the middle over the bowl: the raised central roof is the "drum" that
 *     shows over the parapets from the car parks.            (a1, lidar)
 *  2. Glass entry towers at the four corners (the gates), tall blue curtain
 *     walls framed by rust-brown stair towers.               (a1, a2, a3)
 *  3. The north entrance pavilion on the plaza: tan, with tall grid windows
 *     over a recessed ground floor of glass doors under a balcony.
 *                                                             (a2, a4)
 *  4. The tan walls' balcony line at the top of the ground floor, running
 *     round the building, and a darker stone base.            (a4, a1)
 *
 * Heights from USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020, 1 m
 * grid, tools/lidar.py; ground_min 316.15 m). y = 0 is the floor of the
 * truck dock's sunken yard at the south end, the lowest ground under the
 * footprint in the map's terrain (the event floor is down at that level
 * too); the plaza all round is 11 m above it. Measured (model metres): the
 * outer roof 37 on the long sides and 35 at the ends; the raised central
 * roof 39.7 at its edge to 40.5 at the crown, over x ±38, y ±49; the
 * corner towers 39.3–39.7; the north pavilion 37.9; the plaza 11.
 * Plan: OSM's outline moved 5.5 m east onto the lidar, made symmetric:
 * sides bowed (x ±63.5 at the middle, ±58 at y ±60), ends bowed (y ±75 at
 * the middle, ±69 at the corners), corner towers 16 m square in OSM's four
 * corner notches; the north pavilion x ±22 out to y 77.
 *
 * OSM relation/21437659 (leisure=stadium) is the site, not a building, so
 * `replaces` lists only the building way.
 *
 * Estimated: the darker tan piers every 12.5 m on the long sides and the
 * coping band (a1), the balcony line (6 m above the plaza, from a4), the window
 * bays and their heights (a2, a4 scaled to the lidar heights), the stone
 * base (1.5 m), the dock doors on the south wall. Left out: the plaza's
 * red columns and big screens (free-standing on the plaza), signs and
 * lettering (the arena's name sign is a plain box), the plaza canopies.
 * The roof colours are estimated (light membrane; NAIP did not answer).
 *
 * Photos (evidence, Wikimedia Commons / Flickr):
 *  a1 "2024 Fiesta Bowl –1264 (Desert Diamond Arena).jpg", SecretName101,
 *     CC BY 4.0 — the long side from the car park
 *     https://commons.wikimedia.org/wiki/File:2024_Fiesta_Bowl_%E2%80%931264_(Desert_Diamond_Arena).jpg
 *  a2 "Exterior of Desert Diamond Arena, Glendale, AZ (Aug 2023).jpg",
 *     Mliu92, CC BY-SA 4.0 — the north entrance from the plaza
 *     https://commons.wikimedia.org/wiki/File:Exterior_of_Desert_Diamond_Arena,_Glendale,_AZ_(Aug_2023).jpg
 *  a3 "Gila River Arena Gate 4 Entrance.jpg", Kyvuh, CC0
 *     https://commons.wikimedia.org/wiki/File:Gila_River_Arena_Gate_4_Entrance.jpg
 *  a4 "Glendale-arena.jpg", Paul Kucher, CC BY 2.0 — the north entrance, 2005
 *     https://commons.wikimedia.org/wiki/File:Glendale-arena.jpg
 * No look-only sources. No commercial imagery.
 *
 * Night: the tall glass bays and the entry towers' curtain walls are
 * `window` and glow; the ground-floor doors are `entrance`.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'

const ID = 'phx-desert-diamond-arena'
const stucco = new Part(), pier = new Part(), accent = new Part(), win = new Part(), door = new Part(), roof = new Part()

const PLAZA = 10.7, BAL = PLAZA + 6, SIDE = 36.7, END = 34.3, DRUM = 39.4, CROWN = 40.1, TOWER = 39.2
type XY = [number, number]

/** The outline: bowed sides and ends, x ±63.5 / y ±75 at the middles. */
function outline(): XY[] {
  const pts: XY[] = []
  const side = (y: number) => 63.5 - 5.5 * (y / 60) ** 2
  const end = (x: number) => 75 - 6 * (x / 50) ** 2
  // counter-clockwise from the south-east corner, the corners squared off
  // where the towers stand (their own boxes fill them)
  const XC = 50, YC = 62
  for (let k = 0; k <= 6; k++) { const y = -YC + (2 * YC * k) / 6; pts.push([side(y), y]) } // east
  for (let k = 0; k <= 6; k++) { const x = XC - (2 * XC * k) / 6; pts.push([x, end(x)]) } // north
  for (let k = 0; k <= 6; k++) { const y = YC - (2 * YC * k) / 6; pts.push([-side(y), y]) } // west
  for (let k = 0; k <= 6; k++) { const x = -XC + (2 * XC * k) / 6; pts.push([x, -end(x)]) } // south
  return pts
}

/** Vertical walls round a ccw ring from z0 to z1. */
function walls(part: Part, ring: XY[], z0: number, z1: number) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-6) continue
    part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}
/** A fan cap over a star-shaped ring around (cx, cy), height from h(x, y). */
function fanCap(part: Part, ring: XY[], h: (x: number, y: number) => number, c: XY = [0, 0]) {
  const C: V3 = [c[0], c[1], h(c[0], c[1])]
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    part.tri(C, [a[0], a[1], h(a[0], a[1])], [b[0], b[1], h(b[0], b[1])])
  }
}
/** An axis-aligned box. */
function box(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = part) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  walls(part, r, z0, z1)
  if (top) top.cap(r.map(([x, y]) => [x, y, z1] as V3), true)
}
/** A flat panel on the face from a to b (outward = right of a→b), between heights. */
function panel(part: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, off = 0.06) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy)
  const n: XY = [dy / L * off, -dx / L * off]
  const p = (s: number): XY => [a[0] + dx * s + n[0], a[1] + dy * s + n[1]]
  const [p0, p1] = [p(s0), p(s1)]
  part.quad([p0[0], p0[1], z0], [p1[0], p1[1], z0], [p1[0], p1[1], z1], [p0[0], p0[1], z1])
}

// ── The body ────────────────────────────────────────────────────────────
const ring = outline()
// The walls rise to 37 on the long sides and 35 at the ends; the roof
// between is drawn as two flat levels meeting at the drum.
for (let i = 0; i < ring.length; i++) {
  const a = ring[i], b = ring[(i + 1) % ring.length]
  if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-6) continue
  const top = Math.abs(a[0]) > 55 && Math.abs(b[0]) > 55 ? SIDE : END
  stucco.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], top], [a[0], a[1], top])
  // the stone base and the balcony line
  panel(accent, a, b, 0, 1, PLAZA, PLAZA + 1.5)
  panel(stucco, a, b, 0, 1, BAL, BAL + 0.9, 0.5)
}
// the roof: the long sides' strips at 37, the ends at 35, set 1 m behind a parapet
{
  const yS = 60 // where the side strips end
  for (const s of [-1, 1]) {
    // side strip from the wall in to the drum
    const pts: XY[] = []
    for (let k = 0; k <= 6; k++) { const y = -yS + (2 * yS * k) / 6; pts.push([s * (63.5 - 5.5 * (y / 60) ** 2), y]) }
    for (let k = 0; k < pts.length - 1; k++) {
      const [a, b] = [pts[k], pts[k + 1]]
      const q: V3[] = [[a[0], a[1], SIDE - 0.01], [b[0], b[1], SIDE - 0.01], [s * 38, b[1], SIDE - 0.01], [s * 38, a[1], SIDE - 0.01]]
      if (s > 0) roof.quad(q[0], q[1], q[2], q[3])
      else roof.quad(q[3], q[2], q[1], q[0])
    }
    // end strip at 35, from the wall in to the drum, full width
    const e: XY[] = []
    for (let k = 0; k <= 6; k++) { const x = -50 + (100 * k) / 6; e.push([x, s * (75 - 6 * (x / 50) ** 2)]) }
    for (let k = 0; k < e.length - 1; k++) {
      const [a, b] = [e[k], e[k + 1]]
      const q: V3[] = [[a[0], a[1], END], [b[0], b[1], END], [b[0], s * 49, END], [a[0], s * 49, END]]
      if (s < 0) roof.quad(q[0], q[1], q[2], q[3])
      else roof.quad(q[3], q[2], q[1], q[0])
    }
    // the 35 → 37 step where the side strips meet the ends
    for (const sx of [-1, 1]) {
      const x0 = sx * 38, x1 = sx * (63.5 - 5.5)
      const y = s * 60
      const q: V3[] = [[x0, y, END], [x1, y, END], [x1, y, SIDE], [x0, y, SIDE]]
      if (s * sx < 0) stucco.quad(q[0], q[1], q[2], q[3])
      else stucco.quad(q[3], q[2], q[1], q[0])
    }
    // fill between the end strip (to y ±49) and side strips (to ±60) under the drum's edge
    const q: V3[] = [[-50, s * 49, END], [50, s * 49, END], [50, s * 60, END], [-50, s * 60, END]]
    if (s > 0) roof.quad(q[0], q[1], q[2], q[3])
    else roof.quad(q[3], q[2], q[1], q[0])
  }
}

// The raised central roof over the bowl: a rounded box, x ±38, y ±49,
// walls in stucco, a low crowned membrane roof.
{
  const drum: XY[] = []
  const n = 32
  for (let k = 0; k < n; k++) {
    const t = (k / n) * 2 * Math.PI
    const c = Math.cos(t), s = Math.sin(t)
    const r = Math.pow(Math.pow(Math.abs(c) / 38, 6) + Math.pow(Math.abs(s) / 49, 6), -1 / 6)
    drum.push([c * r, s * r])
  }
  walls(stucco, drum, END - 0.5, DRUM)
  roof.quad([-38, -49, END - 0.02], [38, -49, END - 0.02], [38, 49, END - 0.02], [-38, 49, END - 0.02])
  fanCap(roof, drum, (x, y) => CROWN - (CROWN - DRUM) * Math.max(Math.abs(x) / 38, Math.abs(y) / 49) ** 2)
}

// The long sides' darker tan piers between the wall panels (a1), and a
// coping band along the top of every wall.
for (const sx of [-1, 1])
  for (let k = -4; k <= 4; k++) {
    const yc = k * 12.5, ya = yc - 1.2, yb = yc + 1.2
    const xa = sx * (63.5 - 5.5 * (ya / 60) ** 2), xb = sx * (63.5 - 5.5 * (yb / 60) ** 2)
    const [a, b]: [XY, XY] = sx > 0 ? [[xa, ya], [xb, yb]] : [[xb, yb], [xa, ya]]
    panel(pier, a, b, 0, 1, PLAZA + 1.5, SIDE - 1.2, 0.35)
  }
for (let i = 0; i < ring.length; i++) {
  const a = ring[i], b = ring[(i + 1) % ring.length]
  const top = Math.abs(a[0]) > 55 && Math.abs(b[0]) > 55 ? SIDE : END
  panel(pier, a, b, 0, 1, top - 1.2, top, 0.3)
}

// ── The corner entry towers ─────────────────────────────────────────────
// 16 m square in OSM's corner notches: rust-brown blocks (a1, a2) with
// tall glass curtain walls on the two outer faces and a stair shaft
// standing proud at the outer corner.
for (const sx of [-1, 1])
  for (const sy of [-1, 1]) {
    const cx = sx * 52, cy = sy * 66, h = 8
    const x0 = cx - h, x1 = cx + h, y0 = cy - h, y1 = cy + h
    box(accent, x0, x1, y0, y1, 0, TOWER, roof)
    // glass on the outer faces (east/west face and north/south face)
    const xf = sx > 0 ? x1 : x0, yf = sy > 0 ? y1 : y0
    const fx: [XY, XY] = sx > 0 ? [[x1, y0], [x1, y1]] : [[x0, y1], [x0, y0]]
    const fy: [XY, XY] = sy > 0 ? [[x1, y1], [x0, y1]] : [[x0, y0], [x1, y0]]
    for (const [a, b] of [fx, fy]) {
      panel(win, a, b, 0.12, 0.7, BAL + 1, TOWER - 3)
      panel(door, a, b, 0.15, 0.85, PLAZA, BAL - 0.3)
    }
    // the rust-brown stair shaft at the outer corner, standing 1.5 m proud of the roof
    box(accent, xf - (sx > 0 ? 4 : -0.6), xf + (sx > 0 ? 0.6 : 4), yf - (sy > 0 ? 4 : -0.6), yf + (sy > 0 ? 0.6 : 4), 0, TOWER + 1.5)
  }

// ── The north entrance pavilion ─────────────────────────────────────────
box(stucco, -22, 22, 66, 77, 0, 37.5, roof)
for (let k = 0; k < 4; k++) {
  const x0 = -18 + k * 9.25, x1 = x0 + 7.25
  win.quad([x1, 77.06, BAL + 1.5], [x0, 77.06, BAL + 1.5], [x0, 77.06, 34], [x1, 77.06, 34])
}
// the recessed ground floor of doors under the balcony, and the balcony slab
door.quad([20, 77.06, PLAZA], [-20, 77.06, PLAZA], [-20, 77.06, BAL - 0.4], [20, 77.06, BAL - 0.4])
box(stucco, -24, 24, 77, 80, BAL - 0.4, BAL + 0.6)
// the name sign over the windows: a plain box
box(accent, -10, 10, 77, 77.8, 34.4, 36.8)

// ── The long sides' glass bays (a1, a4): two broad bays per side near each end
for (const sx of [-1, 1])
  for (const yc of [-38, 38]) {
    const ya = yc - 9, yb = yc + 9
    const xa = sx * (63.5 - 5.5 * (ya / 60) ** 2), xb = sx * (63.5 - 5.5 * (yb / 60) ** 2)
    const [a, b]: [XY, XY] = sx > 0 ? [[xa, ya], [xb, yb]] : [[xb, yb], [xa, ya]]
    panel(win, a, b, 0, 1, BAL + 1.5, 31)
    panel(door, a, b, 0.1, 0.9, PLAZA + 1.5, BAL - 0.3)
  }
// the south wall's dock doors, at the yard's level
for (const x of [-30, -15, 0, 15, 30]) {
  const y = -(75 - 6 * (x / 50) ** 2) - 0.08
  accent.quad([x - 5, y, 0], [x + 5, y, 0], [x + 5, y, 6], [x - 5, y, 6])
}

// ── Write ───────────────────────────────────────────────────────────────
const parts: { part: Part; material: Swatch }[] = [
  { part: stucco, material: finish('dda-stucco', 0xe3d1ad) },
  { part: pier, material: finish('dda-tan', 0xcdb68f) },
  { part: accent, material: finish('dda-rust', 0xa8735d) },
  { part: win, material: windowVariantSky() },
  { part: door, material: PALETTE.entrance },
  { part: roof, material: finish('dda-roof', 0xd9dad8) },
]
function windowVariantSky(): Swatch {
  // the curtain walls read a clear mid blue in daylight (a2, a4)
  return { ...PALETTE.window, color: 0x6e8aa3 }
}
const used = parts.filter((p) => p.part.triangles > 0)
const triangles = used.reduce((s, p) => s + p.part.triangles, 0)
if (used.length > 6) throw new Error(`${ID}: ${used.length} materials`)
if (triangles > 5000) throw new Error(`${ID}: ${triangles} triangles`)
const glb = writeGlb('Desert Diamond Arena', used, {
  license: 'CC0-1.0',
  frame: 'Y up, -Z north, +X east, metres; origin on the ground at the building centre (-112.2612598, 33.5319593); bearing 0',
})
if (glb.length > 250_000) throw new Error(`${ID}: ${glb.length} bytes`)
const out = new URL(`../models/${ID}.glb`, import.meta.url).pathname
await Bun.write(out, glb)
console.log(used.map((p) => `${p.material.name}: ${p.part.triangles}`).join(', '))
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
