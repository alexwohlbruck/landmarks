/**
 * Wells Fargo Center (1983, SOM), Los Angeles: the North Tower (Wells Fargo
 * Tower, 54 floors), the South Tower (KPMG Tower, 45 floors) and the glass
 * atrium (Wells Fargo Court) between them, as one model — original
 * procedural geometry, CC0-1.0.
 * bun generators/la-wells-fargo-center.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the area centroid of
 * the three OSM footprints, on the lowest ground under them (the South
 * Tower's Fourth Street side). Placed at bearing 38°, so +x runs along
 * Grand Avenue's cross streets (south-east) and +y up Grand Avenue.
 *
 * Two prisms of red-brown granite and bronze glass, each a right trapezoid
 * in plan: three faces square to the street grid and the fourth cut at 45°,
 * which ends in a knife-edge acute corner. The two cut faces look at each
 * other across the atrium, a 42 m square turned 45° to the grid with a roof
 * of glass pyramids. The towers' sharp prisms, their colour and the pairing
 * are the identity.
 *
 * Sources:
 * - Plans: OSM way/427532202 (North) and way/427532194 (South), which match
 *   the LA County LARIAC 2020 lidar footprints 485357841728 and 485112841424
 *   vertex for vertex. Atrium and podium: OSM way/427532221 (lidar
 *   485091841660 + 485045841627, 16.1 m); the atrium square and its glass
 *   pyramid roof from the LA County 2011 aerial (LACounty_Aerial_2011).
 * - Heights: lidar roof elevations 338.0 m (North) and 302.2 m (South),
 *   atrium 129.7 m; LARIAC 2006 bare earth under the footprints falls from
 *   117 m (Grand Ave) to 107.5 m (Fourth St, south of the South Tower), so
 *   the roofs stand 230.5, 194.7 and 22.1 m over the lowest ground. Lidar
 *   heights over local ground 222.4 and 186.6 m; published roofs 220.4 and
 *   170.7 m (Wikipedia). Floors 54 and 45 (4.1 m).
 * - Photos (Wikimedia Commons): w1 "Wells Fargo Center in downtown Los
 *   Angeles, California" (Minnaert, CC BY-SA 3.0; from the west, Hope St:
 *   the North Tower left, the South Tower's acute west corner right);
 *   w2 "Wells Fargo Center LA" (Patrick Pelster, CC BY-SA 3.0 de; from the
 *   plaza on the west, both cut faces); w3 "Wells Fargo Tower" (Krzykol, CC
 *   BY-SA 4.0; from the south-east, both towers side by side); w4
 *   "WellsFargoCenter" (Minnaert, CC BY-SA 3.0; from the west, the South
 *   Tower's knife edge in front of the North Tower);
 *   w6 "KPMG Tower" (Krzykol, CC BY-SA 3.0); w7 "Los Angeles - Downtown
 *   streetscape from Figueroa" (Daniel Mayer, CC BY-SA 3.0; from the west).
 * - Colour: OSM building:colour #9C5B31 and the photos (red-brown granite,
 *   bronze glass), pulled only part way to the palette's lightness.
 *
 * Estimated: window panels (three floors, 9 m bays: the real facade is a fine
 * grid of punched bronze windows), the atrium's 4 × 4 pyramid grid (the
 * real roof has about 6 × 6), the podium wings' height (12 m), the parapets.
 * Left out: signs, the plaza, the tower roof equipment and helipads.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const granite = new Part(), win = new Part(), roof = new Part(), glass = new Part(), plaza = new Part()

const BEARING = 38
/** Grid frame (u along 128°, v along 38°, from OSM's local origin) → model frame. */
const O: XY = [1.68, -5.98]
const P = (p: XY): XY => [p[0] - O[0], p[1] - O[1]]
const at = (p: XY, z: number): V3 => [p[0], p[1], z]
const FLOOR = 4.1, GROUP = 3 * FLOOR, BAY = 9, PIER = 2.2, SPANDREL = 2.8, PROUD = 0.05, BEVEL = 0.6

const outward = (a: XY, b: XY): XY => {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1])
  return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l]
}
function triangulate(pts: XY[]): [number, number, number][] {
  const idx = pts.map((_, i) => i), tris: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      if (cr(pts[i0], pts[i1], pts[i2]) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(pts[j], pts[i0], pts[i1], pts[i2]))) continue
      tris.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) tris.push([idx[0], idx[1], idx[2]])
  return tris
}
function inset(pts: XY[], d: number): XY[] {
  const n = pts.length
  return pts.map((p, i) => {
    const a = pts[(i + n - 1) % n], b = pts[(i + 1) % n]
    const n1 = outward(a, p), n2 = outward(p, b)
    const k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    return [p[0] - ((n1[0] + n2[0]) * d) / k, p[1] - ((n1[1] + n2[1]) * d) / k] as XY
  })
}
const cap = (part: Part, pts: XY[], z: number) => {
  for (const [i, j, k] of triangulate(pts)) part.tri(at(pts[i], z), at(pts[j], z), at(pts[k], z))
}
/** Ground under a grid-frame point, over the lowest ground (LARIAC 2006 DEM, fitted). */
const groundAt = (p: XY) => Math.max(0, Math.min(9.5, 9.5 + (p[1] + 40) * 0.17))

/**
 * A granite tower on a counter-clockwise grid-frame ring: walls to y = 0,
 * window panels per 9 m bay and three floors from above the local ground, a
 * bevelled parapet and a roof.
 */
function tower(ringUV: XY[], H: number) {
  const pts = ringUV.map(P), n = pts.length, top = H - BEVEL
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n]
    granite.quad(at(a, 0), at(b, 0), at(b, top), at(a, top))
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const bays = Math.max(1, Math.round((L - 2.4) / BAY)), bay = (L - 2.4) / bays
    const o = outward(a, b), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const p = (s: number): XY => [a[0] + t[0] * s + o[0] * PROUD, a[1] + t[1] * s + o[1] * PROUD]
    const ground = Math.max(groundAt(ringUV[i]), groundAt(ringUV[(i + 1) % n]))
    const z0 = ground + 7
    for (let k = 0; k < bays; k++) {
      const s0 = 1.2 + k * bay + PIER / 2, s1 = 1.2 + (k + 1) * bay - PIER / 2
      for (let g = 0; ; g++) {
        const lo = z0 + g * GROUP + SPANDREL / 2, hi = z0 + (g + 1) * GROUP - SPANDREL / 2
        if (hi > top - 3) break
        win.quad(at(p(s0), lo), at(p(s1), lo), at(p(s1), hi), at(p(s0), hi))
      }
    }
  }
  const inner = inset(pts, BEVEL)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    granite.quad(at(pts[i], top), at(pts[j], top), at(inner[j], H), at(inner[i], H))
  }
  // a parapet ring 1.2 m tall around a lower roof
  const lip = inset(pts, 1.6)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    granite.quad(at(inner[i], H), at(inner[j], H), at(lip[j], H), at(lip[i], H))
    granite.quad(at(lip[j], H), at(lip[i], H), at(lip[i], H - 1.2), at(lip[j], H - 1.2))
  }
  cap(roof, lip, H - 1.2)
}

// OSM rings (grid frame), turned counter-clockwise.
const NORTH: XY[] = [[3.2, 75.4], [44.0, 75.4], [44.1, -6.3], [3.2, 34.5]].reverse() as XY[]
const SOUTH: XY[] = [[44.2, -53.9], [44.2, -94.3], [-37.1, -94.6], [3.4, -54.1]].reverse() as XY[]
tower(NORTH, 230.5)
tower(SOUTH, 194.7)

// ---------- podium and atrium ----------
// The podium wings (OSM way/427532221) at 12 m with plain granite walls and a
// band of windows; the atrium square inside them, turned 45° to the grid,
// rises to 16 m on glass walls and carries a 4 × 4 grid of glass pyramids.
{
  const ring = ([
    [-39.5, -17.5], [-35.3, -17.5], [-35.3, 0.8], [-39.6, 0.8], [-39.5, 70.2], [-8.5, 70.2], [-8.5, 19.2],
    [-5.7, 22.0], [24.8, -8.2], [21.6, -11.4], [24.2, -11.4], [24.1, -37.7], [-14.2, -37.8], [-39.5, -63.6],
  ] as XY[]).reverse()
  const pts = ring.map(P), n = pts.length, H = 12
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n]
    granite.quad(at(a, 0), at(b, 0), at(b, H), at(a, H))
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 6) continue
    const o = outward(a, b), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const p = (s: number): XY => [a[0] + t[0] * s + o[0] * PROUD, a[1] + t[1] * s + o[1] * PROUD]
    const lo = Math.max(groundAt(ring[i]), groundAt(ring[(i + 1) % n])) + 1
    if (H - 1.5 - lo > 2.5) win.quad(at(p(1.5), lo), at(p(L - 1.5), lo), at(p(L - 1.5), H - 1.5), at(p(1.5), H - 1.5))
  }
  cap(plaza, pts, H)

  // atrium: corners top, right, bottom, left (grid frame), counter-clockwise
  const sq = ([[-5.6, 21.5], [-35.3, -8.2], [-5.6, -37.9], [24.1, -8.2]] as XY[]).map(P)
  const Z = 16.5
  for (let i = 0; i < 4; i++) {
    const a = sq[i], b = sq[(i + 1) % 4]
    glass.quad(at(a, H), at(b, H), at(b, Z), at(a, Z))
  }
  // 4 × 4 pyramids over the square
  const N = 4, apex = 3.2
  const lerp2 = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  const cell = (i: number, j: number): XY => lerp2(lerp2(sq[0], sq[1], i / N), lerp2(sq[3], sq[2], i / N), j / N)
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++) {
      const c = [cell(i, j), cell(i + 1, j), cell(i + 1, j + 1), cell(i, j + 1)]
      const m: XY = [(c[0][0] + c[2][0]) / 2, (c[0][1] + c[2][1]) / 2]
      // orient each triangle to face up and out, whatever the corner order
      for (let k = 0; k < 4; k++) {
        const A = at(c[k], Z), B = at(c[(k + 1) % 4], Z), T = at(m, Z + apex)
        const nz = (B[0] - A[0]) * (T[1] - A[1]) - (B[1] - A[1]) * (T[0] - A[0])
        if (nz > 0) glass.tri(A, B, T); else glass.tri(B, A, T)
      }
    }
}

const parts = [
  { part: granite, material: finish('wfc-granite', 0xa87a66) },
  { part: win, material: { ...PALETTE.window, color: 0x6e6259 } },
  { part: roof, material: PALETTE.roof },
  { part: plaza, material: finish('wfc-plaza', 0xa98270) },
  { part: glass, material: PALETTE.glass },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Wells Fargo Center', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, height: 230.5,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/427532202', 'way/427532194', 'way/427532221'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/la-wells-fargo-center.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
