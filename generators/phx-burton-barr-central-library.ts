/**
 * Burton Barr Central Library, Phoenix, Arizona (1995, Will Bruder with
 * DWL Architects) — original procedural geometry, CC0-1.0.
 * bun generators/phx-burton-barr-central-library.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: the library's long
 * walls run north–south. Anchor -112.0731690, 33.4624612, the area
 * centroid of OSM's outline way/35421843 (the only OSM building the model
 * covers; the two-storey service building way/699964446 against the south
 * face and the shelters around it are separate buildings, left to the map).
 *
 * Identity (from the photos below):
 *  1. A five-storey box held between two long, slightly bowed "saddlebag"
 *     walls on the east and west, clad in oxidised copper-coloured
 *     corrugated steel: ribbed, darker lower body, a smoother rust-copper
 *     band at the top, and tall stainless sections set into them.
 *                                                  (ne08, v1, dp)
 *  2. The north face: full-height glass behind rows of white fabric
 *     "sails", lens-shaped shades in three tiers, under a thin roof that
 *     oversails the glass; a pale concrete bay at its west end.   (ne08)
 *  3. The south face: glass behind grey horizontal louvres.       (dp)
 *  4. The copper walls run past the glass ends as fins, with taller piers
 *     at their tips; a raised roof monitor along the middle.   (ne08, lidar)
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020, 1 m grid,
 * tools/lidar.py, read with tools/lidar_frame.py; ground_min 328.39 m; the
 * ground round the library is 1.4–2.4 m above that, so y = 0 here is
 * ground_min + 1.5). Measured: the main roof 29.5 (x -25..23, y -45..42);
 * the saddlebags' roofs 27.7 between the box and their outer walls, whose
 * tops are 29.8; the roof monitor 32.5 over x -5..3, y -10..28; the north
 * fins reach y 47.5. Mapterhorn (tools/terrain.ts grid): flat within
 * 0.8 m under the footprint; elevation 0.
 * Plan: OSM's outline (anchor frame), the box's sides from the lidar's
 * roof edge, the bowed outer walls through OSM's nodes.
 * Published: five storeys, 280,000 sq ft, opened April 1995 (Wikipedia,
 * "Burton Barr Central Library").
 *
 * Estimated: the copper band's height (top 9.8 m, ne08, v1); the stainless
 * sections' positions and widths (dp on the west, v1 on the east, which
 * may be the west wall seen from the other end); the sails: 14 columns of
 * three lens-shaped shades, 1.2 m out from the glass, from ne08; the
 * louvre screens on the south as three two-storey panels (dp); the
 * corner piers' height (1.2 m over the walls, ne08); the ground storey's
 * stainless wall (ne08). Left out: the roof's tension rods and beams, the
 * north canopies at 6 m, the cable stays, the entrance canopy, signs.
 *
 * Photos (evidence, Wikimedia Commons):
 *  ne08 "Phoenix Central Library - North East Corner - 2008-12-27.jpg",
 *       Cygnusloop99, CC BY-SA 3.0, from the north-east
 *       https://commons.wikimedia.org/wiki/File:Phoenix_Central_Library_-_North_East_Corner_-_2008-12-27.jpg
 *  v1   "Burton Barr Central Library-1.jpg", Visitor7, CC BY-SA 3.0, a
 *       long copper wall face on
 *       https://commons.wikimedia.org/wiki/File:Burton_Barr_Central_Library-1.jpg
 *  dp   "Phoenix City Library - panoramio.jpg", davidpinter, CC BY 3.0,
 *       from the park to the south-west (west wall and south face)
 *       https://commons.wikimedia.org/wiki/File:Phoenix_City_Library_-_panoramio.jpg
 * No look-only sources. No commercial imagery.
 * Doubts: the south face is seen only obliquely (dp), and the service
 * building hides its lower 11 m; no photo shows the roof.
 *
 * Night: the north and south glass are `window` and glow; the sails are
 * lit from behind by it and stay `trim`.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'

const ID = 'phx-burton-barr-central-library'
type XY = [number, number]

const body = new Part(), band = new Part(), steel = new Part(), win = new Part(), sail = new Part(), roof = new Part()

const P = (x: number, y: number, z: number): V3 => [x, y, z]
const area = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)
function earcut(ring: XY[]): [XY, XY, XY][] {
  const pts = [...ring], out: [XY, XY, XY][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (pts.length > 3 && guard++ < 10000) {
    let cut = false
    for (let i = 0; i < pts.length; i++) {
      const a = pts[(i + pts.length - 1) % pts.length], b = pts[i], c = pts[(i + 1) % pts.length]
      if (cr(a, b, c) <= 1e-9) continue
      if (pts.some((p) => p !== a && p !== b && p !== c && inside(p, a, b, c))) continue
      out.push([a, b, c]); pts.splice(i, 1); cut = true; break
    }
    if (!cut) break
  }
  if (pts.length === 3) out.push([pts[0], pts[1], pts[2]])
  return out
}
/** Walls of a ring from z0 to z1 (optionally a different part per edge). */
function walls(part: Part | ((a: XY, b: XY) => Part), ring: XY[], z0: number, z1: number) {
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-6) continue
    const p = typeof part === 'function' ? part(a, b) : part
    p.quad(P(a[0], a[1], z0), P(b[0], b[1], z0), P(b[0], b[1], z1), P(a[0], a[1], z1))
  }
}
function top(part: Part, ring: XY[], z: number) {
  for (const [a, b, c] of earcut(ccw(ring))) part.tri(P(a[0], a[1], z), P(b[0], b[1], z), P(c[0], c[1], z))
}
function prism(part: Part, ring: XY[], z0: number, z1: number) { walls(part, ring, z0, z1); top(part, ring, z1) }
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
/** A flat panel on the face a→b (outward to the right), fractions s0..s1, heights z0..z1. */
function panel(part: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, off = 0.06) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy)
  const n: XY = [(dy / L) * off, (-dx / L) * off]
  const p = (s: number): XY => [a[0] + dx * s + n[0], a[1] + dy * s + n[1]]
  const [p0, p1] = [p(s0), p(s1)]
  part.quad(P(p0[0], p0[1], z0), P(p1[0], p1[1], z0), P(p1[0], p1[1], z1), P(p0[0], p0[1], z1))
}

// ── Heights (lidar) and plan ───────────────────────────────────────────
const ROOF = 29.5, SADDLE = 27.7, WALLTOP = 29.8, MONITOR = 32.5, BAND = 20
const BX0 = -25, BX1 = 23, BS = -45, BN = 42, FIN = 47.5

/** A smooth bowed curve (Catmull-Rom) through the given (y, x) points, ~6 m steps. */
function bow(pts: [number, number][]): XY[] {
  const out: XY[] = []
  const at = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))]
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    const n = Math.max(1, Math.round(Math.abs(p2[0] - p1[0]) / 6))
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t
      const cr = (j: 0 | 1) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)
      out.push([cr(1), cr(0)])
    }
  }
  const [yl, xl] = pts[pts.length - 1]
  out.push([xl, yl])
  return out
}
// outer faces, south → north (OSM nodes, anchor frame, eased between)
const westOuter = bow([[BS, -27.4], [-36, -29.3], [-2, -34], [25, -32.4], [FIN, -29.4]])
const eastOuter = bow([[BS, 24.9], [-39, 29.2], [-6, 33.6], [28, 32.1], [FIN, 28.6]])

// ── The box ────────────────────────────────────────────────────────────
prism(roof, rect(BX0, BS, BX1, BN), 0, ROOF)
// the roof monitor
prism(steel, rect(-5, -10, 3, 28), ROOF, MONITOR)
// the thin roof oversailing the north and south glass
prism(roof, rect(BX0, BN, BX1, BN + 1.6), ROOF - 0.7, ROOF)
prism(roof, rect(BX0, BS - 1.6, BX1, BS), ROOF - 0.7, ROOF)

// ── The saddlebags ─────────────────────────────────────────────────────
// Each: a body from the box's side to the bowed copper wall, roofed at
// 27.7, the outer wall rising as a parapet to 29.8, with the rust band at
// the top and a tall stainless section.
function saddle(outer: XY[], inner: number, steelAt: [number, number]) {
  const ring: XY[] = [...outer, [inner, FIN], [inner, BS]]
  const side = Math.sign(outer[2][0] - inner)
  // Each wall: the outer bowed faces are copper (two tones), the rest body.
  walls(body, ring, 0, BAND)
  walls((a, b) => (Math.abs(a[0] - inner) < 0.01 && Math.abs(b[0] - inner) < 0.01 ? body : band), ring, BAND, SADDLE)
  top(roof, ring, SADDLE)
  // the parapet: 0.8 m inside the outer face
  const inOff = outer.map(([x, y]) => [x - side * 0.8, y] as XY)
  const par: XY[] = [...outer, ...[...inOff].reverse()]
  walls(band, par, SADDLE, WALLTOP)
  top(band, par, WALLTOP)
  // the stainless sections, flush on the outer face
  for (let i = 0; i < outer.length - 1; i++) {
    const a = side > 0 ? outer[i] : outer[i + 1], b = side > 0 ? outer[i + 1] : outer[i]
    const y0 = Math.min(a[1], b[1]), y1 = Math.max(a[1], b[1])
    const lo = Math.max(y0, steelAt[0]), hi = Math.min(y1, steelAt[1])
    if (hi <= lo) continue
    const f = (y: number) => (y - a[1]) / (b[1] - a[1])
    panel(steel, a, b, Math.min(f(lo), f(hi)), Math.max(f(lo), f(hi)), 0.3, WALLTOP - 0.2, 0.08)
  }
  // the piers at the fins' tips, north and south
  for (const y of [FIN, BS]) {
    const x = outer[y === FIN ? outer.length - 1 : 0][0]
    const px = side > 0 ? x - 3.2 : x
    prism(body, rect(px, y === FIN ? y - 3.2 : y, px + 3.2, y === FIN ? y : y + 3.2), 0, WALLTOP + 1.2)
  }
}
saddle(westOuter, BX0, [28, 38])
saddle(eastOuter, BX1, [6, 16])

// ── The north face (ne08) ───────────────────────────────────────────────
{
  const a: XY = [BX1, BN], b: XY = [BX0, BN] // outward north is to the right
  const W = BX1 - BX0
  // the stainless ground storey and the glass above
  panel(steel, a, b, 0, 1, 0.3, 4.6)
  panel(win, a, b, 0, (BX1 - -17) / W, 4.6, ROOF - 0.9)
  // the pale concrete bay at the west end
  prism(sail, rect(BX0, BN - 0.01, -17, BN + 0.6), 0, ROOF - 0.7)
  // the sails: 14 columns of three lens-shaped shades, 1.2 m out
  const cols = 14, x0 = -16.2, x1 = 22.2, pitch = (x1 - x0) / cols, y = BN + 1.2
  for (let c = 0; c < cols; c++) {
    const xc = x0 + pitch * (c + 0.5), hw = pitch * 0.42
    for (let t = 0; t < 3; t++) {
      const z0 = 5.6 + t * 7.4, z1 = z0 + 7.1, zm = (z0 + z1) / 2
      const pts: V3[] = [
        P(xc - hw * 0.25, y, z0), P(xc + hw * 0.25, y, z0), P(xc + hw, y, zm),
        P(xc + hw * 0.25, y, z1), P(xc - hw * 0.25, y, z1), P(xc - hw, y, zm),
      ]
      // the face looking north, and its back looking at the glass
      for (let k = 1; k < 5; k++) sail.tri(pts[0], pts[k + 1], pts[k])
      for (let k = 1; k < 5; k++) sail.tri(pts[0], pts[k], pts[k + 1])
    }
    // a slim steel mast between the shades
    if (c > 0) {
      const xm = x0 + pitch * c
      prism(steel, rect(xm - 0.15, BN, xm + 0.15, y + 0.15), 4.6, ROOF - 0.9)
    }
  }
}

// ── The south face (dp): glass behind grey louvre screens ──────────────
{
  const a: XY = [BX0, BS], b: XY = [BX1, BS] // outward south is to the right
  panel(steel, a, b, 0, 1, 0.3, 4.6)
  panel(win, a, b, 0, 1, 4.6, ROOF - 0.9)
  for (const [z0, z1] of [[5.4, 12.6], [13.6, 20.8], [21.8, 28.2]]) {
    for (let k = 0; k < 6; k++) panel(steel, a, b, k / 6 + 0.006, (k + 1) / 6 - 0.006, z0, z1, 0.9)
  }
}

// ── Write ───────────────────────────────────────────────────────────────
const parts: { part: Part; material: Swatch }[] = [
  { part: body, material: finish('bb-copper', 0x75655f) },
  { part: band, material: finish('bb-rust', 0x8e6a5c) },
  { part: steel, material: finish('bb-steel', 0xc6cacd) },
  { part: win, material: PALETTE.window },
  { part: sail, material: { ...PALETTE.trim, color: 0xf2ece0 } },
  { part: roof, material: PALETTE.roof },
]
const used = parts.filter((p) => p.part.triangles > 0)
const triangles = used.reduce((s, p) => s + p.part.triangles, 0)
if (used.length > 6) throw new Error(`${ID}: ${used.length} materials`)
if (triangles > 5000) throw new Error(`${ID}: ${triangles} triangles`)
const glb = writeGlb('Burton Barr Central Library', used, {
  license: 'CC0-1.0',
  frame: 'Y up, -Z north, +X east, metres; origin on the ground at the outline centroid (-112.0731690, 33.4624612); bearing 0',
})
if (glb.length > 250_000) throw new Error(`${ID}: ${glb.length} bytes`)
const out = new URL(`../models/${ID}.glb`, import.meta.url).pathname
await Bun.write(out, glb)
console.log(used.map((p) => `${p.material.name}: ${p.part.triangles}`).join(', '))
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
