/**
 * 101 California Street, San Francisco — original procedural geometry, CC0-1.0.
 * bun generators/sf-101-california.ts
 *
 * Map frame: x east, y north, z up, metres, no rotation (the tower is round).
 * Origin = centroid of the OSM outline way/1279505488, which takes in the
 * tower, the granite wing on the west, the sloped glass atrium between them
 * and a low block at the south-east corner.
 *
 * Evidence
 * - OSM way/1279505488 (48 levels, height 183, Johnson/Burgee 1982) and parts
 *   436484078 (tower), 436484073 (the four-storey wing), 1089398909 (atrium),
 *   1279505487 (south-east block). Their edges sit ~2 m off the lidar.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.5 m; y = 0 is the
 *   lowest ground under the outline (3.32 m NAVD88). The tower is a circle of
 *   radius 28.9 m about (18.35, 0.0) (edges fitted in twelve 30° sectors) with
 *   a re-entrant notch on the north-west (inner corner at (2, 13.8)); roof
 *   184 m, a square plant room turned 45° to 190 m. Outwards from the roof edge
 *   the surface steps down 184 → 171 → 156 → 137 m within the outer ~2.2 m, all
 *   the way round: the stepped, serrated crown. The wing is 30 m, the atrium glass slopes from 30 m at the wing to ~10 m at the
 *   tower, the south-east block is 30 m.
 * - Published (Wikipedia, CTBUH): 183 m, 48 floors; a serrated glass cylinder
 *   on a granite colonnade, with a sloped glass lobby atrium at the foot.
 * - Commons daylight photos: "101 California Street 2021 front.jpg" and "101
 *   California Street 2021.jpg" (Dead.rabbit, CC BY-SA 4.0: the colonnade,
 *   atrium and the flat faces of the notch, from the south-west); "101
 *   California Street from Market Street.jpg" (DestinationFearFan, CC BY-SA
 *   4.0, from the south-east); "101 California Street from Salesforce
 *   Park.jpg" (Dead.rabbit, CC BY-SA 4.0, from the south); "101 California
 *   Street (42199762351).jpg" (Ian D. Keating, CC BY 2.0: the serrated,
 *   stepped crown); "101 California 01 (8437377119).jpg" (Tom Hilton, CC BY
 *   2.0, the serration from below).
 *
 * Estimated: the serration (44 teeth on the round face, 1 m deep), the crown
 * tiers drawn 1 m deep each (lidar ~0.7 m) so they read at map scale, the 20 m
 * colonnade height and its column spacing, the lobby glass line, the trim
 * floor lines every eight storeys on the curtain wall, the wing's window
 * grouping (two-storey panels per ~6 m bay). The wing's 33-35 m parapet
 * sections are drawn at 30 m.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]
const ANCHOR = { lng: -122.3981556, lat: 37.7928605 }
const glassWall = new Part(), granite = new Part(), trim = new Part(), windows = new Part(), roof = new Part(), atrium = new Part()

const C: XY = [18.35, 0.0]
const R = 28.9, TOOTH = 1.0
const TOP = 184, PLANT = 190, BASE = 20
const V: XY = [2, 13.8] // the notch's inner corner
const DIRS: XY[] = [[-7, 3], [7, 11.2]] // its two arms, towards the arc

// --- Helpers (as in sf-555-california) ---
const area = (p: XY[]) => p.reduce((a, q, i) => { const r = p[(i + 1) % p.length]; return a + q[0] * r[1] - r[0] * q[1] }, 0) / 2
function triangulate(poly: XY[]): [XY, XY, XY][] {
  const p = area(poly) < 0 ? [...poly].reverse() : [...poly]
  const out: [XY, XY, XY][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (q: XY, a: XY, b: XY, c: XY) => cr(a, b, q) > 1e-9 && cr(b, c, q) > 1e-9 && cr(c, a, q) > 1e-9
  let guard = 0
  while (p.length > 3 && guard++ < 2000) {
    let cut = false
    for (let i = 0; i < p.length; i++) {
      const a = p[(i + p.length - 1) % p.length], b = p[i], c = p[(i + 1) % p.length]
      if (cr(a, b, c) <= 1e-9) continue
      if (p.some((q) => q !== a && q !== b && q !== c && inside(q, a, b, c))) continue
      out.push([a, b, c]); p.splice(i, 1); cut = true; break
    }
    if (!cut) p.splice(0, 1) // degenerate vertex
  }
  out.push([p[0], p[1], p[2]])
  return out
}
/** A vertical prism; `skip` lists edges (i → i+1, in the given order) whose wall is hidden. */
function prism(part: Part, poly: XY[], z0: number, z1: number, skip: number[] = [], top: Part | null = roof, bottom = false) {
  const ccw = area(poly) > 0, p = ccw ? poly : [...poly].reverse(), n = p.length
  const sk = new Set(ccw ? skip : skip.map((i) => (n - 2 - i + n) % n))
  for (let i = 0; i < n; i++) {
    if (sk.has(i)) continue
    const a = p[i], b = p[(i + 1) % n]
    part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  const tris = triangulate(p)
  if (top) for (const [a, b, c] of tris) top.tri([a[0], a[1], z1], [b[0], b[1], z1], [c[0], c[1], z1])
  if (bottom) for (const [a, b, c] of tris) part.tri([a[0], a[1], z0], [c[0], c[1], z0], [b[0], b[1], z0])
}
const polar = (r: number, a: number): XY => [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a)]
/** Where the notch arm k meets the circle of radius r. */
function armHit(k: number, r: number): XY {
  const [dx, dy] = DIRS[k], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L
  const fx = V[0] - C[0], fy = V[1] - C[1], b = fx * ux + fy * uy, c = fx * fx + fy * fy - r * r
  const t = -b + Math.sqrt(b * b - c)
  return [V[0] + ux * t, V[1] + uy * t]
}
const ang = (p: XY) => Math.atan2(p[1] - C[1], p[0] - C[0])
// The round face runs anticlockwise from arm 0's end round to arm 1's end.
const A0 = ang(armHit(0, R)), A1 = ang(armHit(1, R)) + 2 * Math.PI
const N = 44, STEP = (A1 - A0) / N

// The crown: going out from the roof edge the lidar steps down 184 → 171 → 156
// → 137 m within the outer ~2.2 m, the same all round, so the serrated wall
// sets back one tier at a time and the top reads rounded from every side.
// Each tier is drawn 1 m deep (3 m in all) so the setbacks read at map scale.
const TIERS = [TOP, 171, 156, 137] // core, then each ring outwards
const TIER = 1.0
const R0 = R - TOOTH - TIER * (TIERS.length - 1) // core valley radius

// --- Tower core: the notch plus the arc at the core's valley radius. ---
{
  const poly: XY[] = [V, armHit(0, R0)]
  for (let i = 0; i <= N; i++) poly.push(polar(R0, A0 + STEP * i))
  poly.push(armHit(1, R0))
  // arm walls (edges 0 and N+2) are real; the arc walls hide behind the teeth
  const skip = Array.from({ length: N + 1 }, (_, i) => i + 1)
  prism(glassWall, poly, BASE, TOP, skip, roof, true)
}
// --- The notch's flat faces run out to the full radius, stepping like the crown. ---
for (const k of [0, 1]) {
  const e = k === 0 ? A0 : A1
  for (let L = 1; L < TIERS.length; L++) {
    const ri = R0 + TIER * (L - 1), ro = R0 + TIER * L + (L === TIERS.length - 1 ? TOOTH : 0)
    const a = armHit(k, ri), b = armHit(k, ro)
    const q: XY[] = k === 0 ? [a, b, polar(ro, e), polar(ri, e)] : [b, a, polar(ri, e), polar(ro, e)]
    prism(glassWall, q, BASE, TIERS[L], [], trim, true)
  }
}

// --- Teeth: the core's own serration, then one serrated ring per tier. ---
type Facet = { a: XY; b: XY; lo: number; hi: number }
const facets: Facet[] = []
for (let i = 0; i < N; i++) {
  const a0 = A0 + STEP * i, am = a0 + STEP / 2, a1 = a0 + STEP
  const ring = (L: number): XY[] => [polar(R0 + TIER * L, a0), polar(R0 + TIER * L + TOOTH, am), polar(R0 + TIER * L, a1)]
  const ct = ring(0)
  prism(glassWall, ct, BASE, TOP, [2], roof, true)
  facets.push({ a: ct[0], b: ct[1], lo: TIERS[1], hi: TOP }, { a: ct[1], b: ct[2], lo: TIERS[1], hi: TOP })
  for (let L = 1; L < TIERS.length; L++) {
    const o = ring(L), n = ring(L - 1)
    const ch: XY[] = [o[0], o[1], o[2], n[2], n[1], n[0]]
    prism(glassWall, ch, BASE, TIERS[L], [3, 4], trim, true)
    const lo = L === TIERS.length - 1 ? BASE : TIERS[L + 1]
    facets.push({ a: o[0], b: o[1], lo, hi: TIERS[L] }, { a: o[1], b: o[2], lo, hi: TIERS[L] })
  }
}
// Pale floor lines every eight storeys on the curtain wall, just proud of it.
{
  const storey = (TOP - BASE) / 44
  const lines: number[] = []
  for (let z = BASE + 8 * storey; z < TOP - 2; z += 8 * storey) lines.push(z)
  const band = (a: XY, b: XY, z: number) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = ((b[1] - a[1]) / L) * 0.06, ny = (-(b[0] - a[0]) / L) * 0.06
    trim.quad([a[0] + nx, a[1] + ny, z - 0.35], [b[0] + nx, b[1] + ny, z - 0.35], [b[0] + nx, b[1] + ny, z + 0.35], [a[0] + nx, a[1] + ny, z + 0.35])
  }
  for (const f of facets) for (const z of lines) if (z > f.lo + 0.5 && z < f.hi - 0.5) band(f.a, f.b, z)
  // the notch faces, outward = right of each arm's direction as walked round the outline
  for (const z of lines) {
    if (z < 137) band(V, armHit(0, R), z)
    if (z < 137) band(armHit(1, R), V, z)
  }
}
// Plant room on the roof: a square turned 45°.
prism(granite, [[C[0] + 12.5, C[1]], [C[0], C[1] + 12.5], [C[0] - 12.5, C[1]], [C[0], C[1] - 12.5]], TOP - 0.5, PLANT)

// --- Colonnade under the tower: granite piers round a recessed glass lobby. ---
{
  const RL = R - 6
  const lobby: XY[] = [armHit(0, RL), ...Array.from({ length: 23 }, (_, i) => polar(RL, A0 + ((A1 - A0) * i) / 22)), armHit(1, RL), V]
  prism(atrium, lobby, 0, BASE, [], null)
  for (let i = 0; i <= 22; i++) {
    const a = A0 + 0.04 + ((A1 - A0 - 0.08) * i) / 22, c = polar(R - 1.4, a), s = 0.8
    const ux = Math.cos(a), uy = Math.sin(a)
    const sq: XY[] = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([p, q]) => [c[0] + (ux * p - uy * q) * s, c[1] + (uy * p + ux * q) * s])
    prism(granite, sq, 0, BASE, [], null)
  }
}

// --- The granite wing on the west and the block at the south-east corner. ---
const WING: XY[] = [[-43, 45], [-32, -38], [-2, -33], [-4, -18], [-8, -12.5], [-20.8, -13.9], [-23.9, 6.6], [-18.7, 7.4], [-9.5, 8.5], [-4.5, 16.6]]
const SE: XY[] = [[27.4, -27.3], [50.1, -23.6], [39.8, -15.9], [30, -20.5]]
prism(granite, WING, 0, 30)
prism(granite, SE, 0, 30)
function bays(a: XY, b: XY, top: number, bay = 6) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / bay))
  const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy * 0.05, ny = -ux * 0.05
  const P = (s: number, z: number): V3 => [a[0] + ux * s + nx, a[1] + uy * s + ny, z]
  for (let k = 0; k < n; k++) {
    const s0 = (L * k) / n + 1.2, s1 = (L * (k + 1)) / n - 1.2
    for (let z = 4; z + 7 <= top - 1; z += 8.5) windows.quad(P(s0, z), P(s1, z), P(s1, z + 6), P(s0, z + 6))
  }
}
// outward = right of a→b; the wing polygon above runs clockwise, so walk it backwards
{
  const ring = area(WING) > 0 ? WING : [...WING].reverse()
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const mid: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    if (Math.hypot(mid[0] - C[0], mid[1] - C[1]) < R + 2) continue // against the tower
    if (mid[0] > -24 && mid[0] < -7 && mid[1] > -14 && mid[1] < 8) continue // against the atrium
    bays(a, b, 30)
  }
  const se = area(SE) > 0 ? SE : [...SE].reverse()
  for (let i = 0; i < se.length; i++) {
    const a = se[i], b = se[(i + 1) % se.length], mid: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    if (Math.hypot(mid[0] - C[0], mid[1] - C[1]) < R + 1) continue
    bays(a, b, 30)
  }
}

// --- Sloped glass atrium between the wing and the tower. ---
{
  const poly: XY[] = [[-18.7, 7.4], [-23.9, 6.6], [-20.8, -13.9], [-7.8, -12.2], [-9.6, -5], [-10.4, 2.6]]
  const zAt = (p: XY) => Math.max(9, Math.min(30, 30 - ((p[0] + 22) * 20) / 11))
  const p = area(poly) > 0 ? poly : [...poly].reverse()
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length]
    atrium.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], zAt(b)], [a[0], a[1], zAt(a)])
  }
  for (const [a, b, c] of triangulate(p)) atrium.tri([a[0], a[1], zAt(a)], [b[0], b[1], zAt(b)], [c[0], c[1], zAt(c)])
}

const parts = [
  { part: glassWall, material: windowVariant(2, 0x93abbf) },
  { part: trim, material: PALETTE.trim },
  { part: granite, material: finish('pale-granite', 0xe3d6c6) },
  { part: windows, material: PALETTE.window },
  { part: atrium, material: PALETTE.glass },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('101 California Street', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: PLANT,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/1279505488', 'way/436484073', 'way/436484078', 'way/1089398909', 'way/1279505487'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-101-california.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
