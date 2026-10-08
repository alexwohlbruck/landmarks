/**
 * United Center, Chicago — procedural, CC0-1.0, no textures.
 * bun generators/chi-united-center.ts
 *
 * Map frame: x east, y north, z up, metres, built square to the arena and
 * placed at bearing 359°: the long north and south faces run at bearing 89°
 * in OSM. The anchor (-87.674184, 41.880680) is the area centroid of the
 * outline way/205221993. The arena is symmetrical about both axes, so its
 * outline is the OSM ring's north-east quarter mirrored round; the east
 * atrium (way/750458683, 2017) is the one asymmetric part.
 *
 * Evidence
 * - OSM (measured): outline way/205221993 (165 x 124 m, stepped corners,
 *   bowed east and west ends); the atrium way/750458683; the entrance
 *   canopies way/750458680 and way/750458681 on Madison Street and the south
 *   side.
 * - Published (Wikipedia): HOK Sport, 1994, 960,000 sq ft; the exterior
 *   echoes Chicago Stadium; the glass east atrium opened in 2017.
 * - Photos (Wikimedia Commons): Arvell Dorsey Jr. (CC BY 2.0) "United Center
 *   (17136283953)" (Madison Street front, square on); Brule Laker (CC BY 2.0)
 *   "United Center 2014"; JeremyA (CC BY-SA 2.5) "United Center 060716";
 *   Alacoolwiki (CC BY-SA 4.0) "United Center 1"; Brandon Zeman (CC BY-SA
 *   2.0) "2017 NHL Entry Draft (35346024092)" and Ryan Dickey (CC BY 2.0)
 *   "2017 NHL draft (35341702522)" (the atrium).
 * - USGS NAIP orthophoto (public domain): the white roof, a superellipse over
 *   nearly the whole footprint.
 *
 * Measured from the square-on front photo, scaled by its 2.4 m doors: the
 * central block 48 m wide and 28.5 m tall, its two pylons 30 m, the flanks
 * 27 m; the two groups of six tall windows from 5.8 to 20.8 m between
 * white pilasters, with a row of square windows over them.
 *
 * Estimated: the stepped side blocks (26 and 25 m), the end blocks and
 * stair towers, the drum's glass band (25 to 30 m) and the dome's 6 m rise, from the oblique photos; the
 * atrium 21 m. The photos show the walls as warm grey precast, not the red
 * brick of the old Chicago Stadium.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { box, dot, fill, mul, prism, quad, type XY } from './chi-wrigley-field'

const wall = new Part(), trim = new Part(), win = new Part(), drum = new Part(), atrium = new Part(), door = new Part()

// North-east quarter of the outline, mirrored to all four.
const Q: XY[] = [[0, 61.9], [46.3, 61.9], [46.3, 60.2], [63.2, 60.2], [63.2, 55.5], [71.5, 55.5], [71.5, 48], [76.5, 48], [76.8, 28.5], [75.5, 27.7], [77.8, 22], [79, 15], [82.3, 14.7], [82.4, 0]]
const ring: XY[] = []
for (const p of Q) ring.push([p[0], p[1]])
for (const p of [...Q].reverse().slice(1)) ring.push([p[0], -p[1]])
for (const p of Q.slice(1)) ring.push([-p[0], -p[1]])
for (const p of [...Q].reverse().slice(1, -1)) ring.push([-p[0], p[1]])
const outline = ring.filter((p, i) => i === 0 || p[0] !== ring[i - 1][0] || p[1] !== ring[i - 1][1]).reverse()

const BASE = 25, DRUM = 30, CROWN = 36
prism(wall, outline, 0, BASE, wall)

// Front blocks on Madison Street and the south side: the flanks, then the
// central block between its pylons.
for (const s of [-1, 1]) {
  const blk = (x0: number, x1: number, y0: number, y1: number, h: number) =>
    prism(wall, [[x0, s * y0], [x1, s * y0], [x1, s * y1], [x0, s * y1]].map(([x, y]) => [x, y] as XY), BASE, h, wall)
  blk(-63.2, -46.3, 48, 60.2, 26)
  blk(46.3, 63.2, 48, 60.2, 26)
  blk(-46.3, -24, 50, 61.9, 27)
  blk(24, 46.3, 50, 61.9, 27)
  blk(-24, 24, 50, 61.9, 28.5)
  // Pylons at the ends of the central block.
  for (const x of [-24, 24]) box(trim, [x, s * 60.6, 15], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [1.6, 1.6, 15], true)
}
// The real outline's bevel: the parapets of the base get a pale coping.
{
  const n = outline.length
  for (let i = 0; i < n; i++) {
    const a = outline[i], b = outline[(i + 1) % n]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 1) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    let o: V3 = [u[1], -u[0], 0]
    if (dot(o, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0]) < 0) o = mul(o, -1)
    const W = (t: number, z: number, d = 0.06): V3 => [a[0] + u[0] * t + o[0] * d, a[1] + u[1] * t + o[1] * d, z]
    // Window slots on the plain walls: one per 9 m bay, two storeys apart.
    const front = Math.abs(a[1]) > 59 && Math.abs(b[1]) > 59 && Math.min(Math.abs(a[0]), Math.abs(b[0])) < 46.3
    if (front || L < 6) continue
    const bays = Math.max(1, Math.round(L / 12))
    for (let k = 0; k < bays; k++) {
      const t0 = (k / bays) * L, t1 = ((k + 1) / bays) * L, m = (t1 - t0) * 0.3
      for (const [z0, z1] of [[15, 17.5]]) quad(win, [W(t0 + m, z0), W(t1 - m, z0), W(t1 - m, z1), W(t0 + m, z1)], o)
    }
  }
}

// The east and west ends: a tall central block with two narrow window
// strips, and a glazed stair tower at each corner of the drum.
for (const s of [-1, 1]) {
  prism(wall, [[s * 76.5, -14.7], [s * 82.4, -14.7], [s * 82.4, 14.7], [s * 76.5, 14.7]].map(p => p as XY), BASE, 28.5, wall)
  for (const y of [-5, 5]) {
    const x = s * 82.46
    quad(win, [[x, y - 1.6, 4], [x, y + 1.6, 4], [x, y + 1.6, 26], [x, y - 1.6, 26]], [s, 0, 0])
  }
  for (const t of [-1, 1]) prism(drum, [[s * 71.5, t * 44], [s * 76.6, t * 44], [s * 76.6, t * 48.2], [s * 71.5, t * 48.2]].map(p => p as XY), 0, 27.5, trim)
}

// The Madison Street front, mirrored on the south: two groups of six tall
// windows between white pilasters, square windows over them, a glazed
// ground floor of doors under a canopy.
for (const s of [-1, 1]) {
  const y = s * 61.9, o: V3 = [0, s, 0]
  const F = (x: number, z: number, d = 0.06): V3 => [x, y + s * d, z]
  for (const g of [-1, 1]) {
    const x0 = g < 0 ? -22 : 5.5, x1 = g < 0 ? -5.5 : 22
    const w = (x1 - x0) / 6
    for (let i = 0; i < 6; i++) {
      const a = x0 + i * w + 0.45, b = x0 + (i + 1) * w - 0.45
      quad(win, [F(a, 5.8), F(b, 5.8), F(b, 20.8), F(a, 20.8)], o)
      quad(win, [F(a + 0.3, 21.8), F(b - 0.3, 21.8), F(b - 0.3, 23.6), F(a + 0.3, 23.6)], o)
    }
    // Pilasters, in pairs at both edges and the middle of each group.
    for (const x of [x0, x0 + 3 * w, x1]) for (const dx of [-0.7, 0.7]) {
      box(trim, [x + dx, y + s * 0.3, 15.4], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0.32, 0.3, 10], true)
    }
  }
  quad(door, [F(-23, 0.2), F(23, 0.2), F(23, 4.4), F(-23, 4.4)], o)
  // Canopy over the doors (way/750458680, 750458681).
  box(trim, [0, y + s * 2.2, 5.0], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [26, 2.2, 0.35])
}

// ---- Drum and dome ------------------------------------------------------------
const A = 79, B = 58, NX = 3.2, SEG = 64
const se = (t: number, f: number): XY => {
  const c = Math.cos(t), s = Math.sin(t)
  return [A * f * Math.sign(c) * Math.abs(c) ** (2 / NX), B * f * Math.sign(s) * Math.abs(s) ** (2 / NX)]
}
const ang = Array.from({ length: SEG }, (_, i) => (i / SEG) * 2 * Math.PI)
const drumRing = ang.map(t => se(t, 1))
for (let i = 0; i < SEG; i++) {
  const a = drumRing[i], b = drumRing[(i + 1) % SEG]
  const o: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0]
  quad(drum, [[a[0], a[1], BASE], [b[0], b[1], BASE], [b[0], b[1], DRUM - 0.6], [a[0], a[1], DRUM - 0.6]], o)
  quad(trim, [[a[0], a[1], DRUM - 0.6], [b[0], b[1], DRUM - 0.6], [b[0], b[1], DRUM], [a[0], a[1], DRUM]], o)
}
// A shallow superelliptic dome, smooth-shaded.
const FR = [1, 0.97, 0.88, 0.72, 0.5, 0.25]
const zf = (f: number) => DRUM + (CROWN - DRUM) * (1 - f * f)
const nrm = (t: number, f: number): V3 => {
  // Gradient of z = DRUM + H(1 - f^2) on the superellipse, approximated radially.
  const [x, y] = se(t, 1)
  const l = Math.hypot(x, y)
  const slope = (2 * (CROWN - DRUM) * f) / l
  const v: V3 = [(x / l) * slope, (y / l) * slope, 1]
  const m = Math.hypot(...v)
  return [v[0] / m, v[1] / m, v[2] / m]
}
for (let j = 0; j < FR.length - 1; j++) {
  for (let i = 0; i < SEG; i++) {
    const t0 = ang[i], t1 = ang[(i + 1) % SEG]
    const p = (t: number, f: number): V3 => { const [x, y] = se(t, f); return [x, y, zf(f)] }
    quad(trim, [p(t0, FR[j]), p(t1, FR[j]), p(t1, FR[j + 1]), p(t0, FR[j + 1])], [0, 0, 1],
      [nrm(t0, FR[j]), nrm(t1, FR[j]), nrm(t1, FR[j + 1]), nrm(t0, FR[j + 1])])
  }
}
const cap = ang.map(t => se(t, FR[FR.length - 1]))
fill(trim, cap.map(([x, y]) => [x, y, zf(FR[FR.length - 1])] as V3), cap, [0, 0, 1])
// The roof's two long trusses, low ribs curving from end to end.
for (const sx of [-1, 1]) {
  const pts: V3[] = []
  for (let i = 0; i <= 10; i++) {
    const y = -B + (2 * B * i) / 10
    const x = sx * (30 + 6 * (1 - (y / B) ** 2))
    // Height of the dome under (x, y).
    const f = (Math.abs(x / A) ** NX + Math.abs(y / B) ** NX) ** (1 / NX)
    pts.push([x, y, zf(Math.min(1, f)) + 0.45])
  }
  for (let i = 0; i < 10; i++) {
    const a = pts[i], b = pts[i + 1]
    quad(trim, [[a[0] - 0.6, a[1], a[2]], [a[0] + 0.6, a[1], a[2]], [b[0] + 0.6, b[1], b[2]], [b[0] - 0.6, b[1], b[2]]], [0, 0, 1])
    for (const e of [-1, 1]) quad(trim, [[a[0] + e * 0.6, a[1], a[2]], [b[0] + e * 0.6, b[1], b[2]], [b[0] + e * 0.6, b[1], b[2] - 0.6], [a[0] + e * 0.6, a[1], a[2] - 0.6]], [e, 0, 0.2])
  }
}

// ---- East atrium (2017) ------------------------------------------------------------
// A glass hall against the east end, its outer wall bent at the middle, under
// a pale roof edge.
{
  const R: XY[] = [[75.9, -26.1], [106.4, -26.1], [99.9, 7.4], [102.8, 44.6], [76.5, 39.1], [76.8, 28.5], [75.5, 27.7], [77.8, 22], [79, 15], [82.3, 14.7], [82.4, 0], [82.3, -14.7], [79, -15], [77.8, -22]]
  const H = 21
  const n = R.length
  let cx = 0, cy = 0
  R.forEach(([x, y]) => { cx += x / n; cy += y / n })
  for (let i = 0; i < n; i++) {
    const a = R[i], b = R[(i + 1) % n]
    if (a[0] < 83 && b[0] < 83) continue // against the arena
    const o: V3 = [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0]
    quad(atrium, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], H - 2], [a[0], a[1], H - 2]], o)
    quad(trim, [[a[0], a[1], H - 2], [b[0], b[1], H - 2], [b[0], b[1], H], [a[0], a[1], H]], o)
  }
  fill(trim, R.map(([x, y]) => [x, y, H] as V3), R, [0, 0, 1])
}

// ---- Write -----------------------------------------------------------------------------
// Palette (STYLE.md): the warm grey precast as a finish at the palette's
// lightness; the white pilasters, pylons, coping and the big white roof are
// `trim`; tall windows `window`; the drum's blue-grey glass band `glass`; the
// atrium's reflective curtain wall a light window variant, lit at night; the
// glazed doors `entrance`.
const parts = [
  { part: wall, material: finish('uc-precast', 0xd9cfc2) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: drum, material: PALETTE.glass },
  { part: atrium, material: windowVariant(2, 0xa9bfd1) },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(14), part.triangles)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('United Center', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 359, osm: 'way/205221993',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/chi-united-center.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
