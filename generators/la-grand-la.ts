/**
 * The Grand LA (2022, Frank Gehry), 100 S. Grand Avenue, Los Angeles: the
 * residential tower, the Conrad hotel tower and the podium they stand on —
 * original procedural geometry, CC0-1.0.
 * bun generators/la-grand-la.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the area centroid of
 * the two OSM block outlines, on the lowest ground under them (the east
 * side; Grand Avenue is 10 m higher). Placed at bearing 38°, so +x runs from
 * Grand Avenue towards Olive Street and +y towards First Street.
 *
 * Both towers are stacks of boxes shifted against each other. The
 * residential tower at the Second St end alternates cream render with
 * punched windows and boxes of pale glass, widening from a slim shaft (a glass
 * slab down its west side, a sliver on the east) to a broad base. The hotel at the First St
 * end is a white ziggurat of stacked boxes. A tan podium covers both blocks.
 *
 * Sources:
 * - Plans: OSM way/1106947212 and way/1106947213 (the two blocks) and the
 *   tower parts way/1106947214 (45 levels) and way/1106947215 (25 levels).
 *   The LA County 2020 lidar predates completion, so it has no heights here.
 * - Heights: published 156 m / 511 ft (Wikipedia, Grand Avenue Project
 *   infobox); hotel ≈ 86 m from 25 levels of 3.45 m (estimated; r6 fixes only
 *   the bands' proportions). Ground:
 *   USGS 3DEP sampled at 10 m (EPSG:3857), 118 m on Grand Ave to 108 m on
 *   the east side.
 * - Box stack: proportioned from photos r5 (from the east, the residential
 *   tower left, the hotel right: the shaft is 43 % of the height above the
 *   podium and 58 % of the base's width), r4 (from the south-west, the shaft's
 *   glass on its west side and the glass boxes lower down to the west) and r6
 *   (the hotel from Grand Ave, three bands of boxes).
 * - Photos (Wikimedia Commons): r1 "The Grand LA - 200 S. Grand Avenue - Los
 *   Angeles" (Dale Cruse, CC BY 4.0; from the Broad, south-west); r2 "The
 *   Grand LA and downtown Los Angeles 2021-11-21" (Ilkka Simomaa, CC BY 4.0;
 *   from the north-east); r4 "Tower (to indentify) DTLA (July 2022)" (Benoît
 *   Prieur, CC0; south-west); r5 "The Grand and Conrad DTLA" (Shoup1cobra, CC
 *   BY-SA 4.0; east); r6 "View of Conrad Los Angeles (July 2023)" (Benoît
 *   Prieur, CC0; the hotel from Grand Ave, west).
 *
 * Estimated: every box's extent in depth (each photo fixes only its width
 * and height from one side), the hotel's height, the podium's (22 m over the
 * lowest ground, ≈ 12 m on Grand Ave).
 * Left out: the podium's terraces and planting, the canopy, signs.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]

const beige = new Part(), white = new Part(), podium = new Part(), win = new Part(), glass = new Part(), roof = new Part()

const BEARING = 38
const O: XY = [2.92, 2.38]
const P = (u: number, v: number): XY => [u - O[0], v - O[1]]
const at = (p: XY, z: number): V3 => [p[0], p[1], z]
const FLOOR = 3.45, BEVEL = 0.35, PROUD = 0.05
/** Ground over the lowest point: 10 m on Grand Ave (u −43) falling to 0 by u 30. */
const groundAt = (u: number) => Math.max(0, Math.min(10, (30 - u) * 0.14))

type Kind = 'beige' | 'white' | 'glass'
/**
 * A box u0…u1 × v0…v1 from z0 to z1. Render boxes get a window panel per
 * 5.5 m bay, two floors tall; glass boxes are pale glass with a cream floor
 * line every three floors.
 */
function box(u0: number, u1: number, v0: number, v1: number, z0: number, z1: number, kind: Kind) {
  const c: XY[] = [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)]
  const us = [u0, u1, u1, u0]
  const wall = kind === 'glass' ? glass : kind === 'white' ? white : beige
  const top = z1 - BEVEL
  for (let i = 0; i < 4; i++) {
    const a = c[i], b = c[(i + 1) % 4]
    wall.quad(at(a, z0), at(b, z0), at(b, top), at(a, top))
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
    const p = (s: number, d = PROUD): XY => [a[0] + t[0] * s + n[0] * d, a[1] + t[1] * s + n[1] * d]
    const ground = Math.max(groundAt(us[i]), groundAt(us[(i + 1) % 4]))
    const zlo = Math.max(z0, ground + 4)
    if (kind === 'glass') {
      for (let z = z0 + 3 * FLOOR; z < top - 1.5; z += 3 * FLOOR) {
        if (z < zlo) continue
        beige.quad(at(p(0, 0.06), z - 0.25), at(p(L, 0.06), z - 0.25), at(p(L, 0.06), z + 0.25), at(p(0, 0.06), z + 0.25))
      }
      continue
    }
    const bays = Math.floor(L / 5.5)
    if (bays < 1) continue
    const bay = L / bays, pw = kind === 'white' ? 3.4 : 3
    const groups = Math.floor((top - zlo) / (2 * FLOOR))
    for (let k = 0; k < bays; k++) {
      const s0 = (k + 0.5) * bay - pw / 2, s1 = s0 + pw
      for (let g = 0; g < groups; g++) {
        const lo = zlo + g * 2 * FLOOR + 1.2, hi = zlo + (g + 1) * 2 * FLOOR - 1.2
        win.quad(at(p(s0), lo), at(p(s1), lo), at(p(s1), hi), at(p(s0), hi))
      }
    }
  }
  const b = BEVEL
  const inner: XY[] = [P(u0 + b, v0 + b), P(u1 - b, v0 + b), P(u1 - b, v1 - b), P(u0 + b, v1 - b)]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    wall.quad(at(c[i], top), at(c[j], top), at(inner[j], z1), at(inner[i], z1))
  }
  roof.quad(at(inner[0], z1), at(inner[1], z1), at(inner[2], z1), at(inner[3], z1))
}

// ---------- the podium ----------
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
const PODIUM = 22
function block(ringUV: XY[]) {
  let area = 0
  ringUV.forEach((p, i) => { const q = ringUV[(i + 1) % ringUV.length]; area += p[0] * q[1] - q[0] * p[1] })
  const ring = area < 0 ? [...ringUV].reverse() : ringUV
  const pts = ring.map(([u, v]) => P(u, v)), n = pts.length
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n]
    podium.quad(at(a, 0), at(b, 0), at(b, PODIUM), at(a, PODIUM))
    // a glazed shopfront band on the long podium walls, above the local ground
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 8) continue
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [t[1], -t[0]]
    const q = (s: number): XY => [a[0] + t[0] * s + nn[0] * PROUD, a[1] + t[1] * s + nn[1] * PROUD]
    const g = Math.max(groundAt(ring[i][0]), groundAt(ring[(i + 1) % n][0]))
    if (PODIUM - 2 - (g + 1) > 3) win.quad(at(q(2), g + 1), at(q(L - 2), g + 1), at(q(L - 2), Math.min(g + 6, PODIUM - 2)), at(q(2), Math.min(g + 6, PODIUM - 2)))
  }
  for (const [i, j, k] of triangulate(pts)) roof.tri(at(pts[i], PODIUM), at(pts[j], PODIUM), at(pts[k], PODIUM))
}
block([[18.1, -4.6], [17.4, -34.1], [15.5, -34.1], [15.4, -41.2], [-14.1, -42.1], [-13.9, -37.6], [-20.1, -36.4], [-20.1, -23.1], [-22.1, -23.3], [-22.3, -20.3], [-42.6, -19.9], [-43.3, -66.2], [-23.8, -67.3], [-23.5, -70.4], [7.5, -64.0], [18.0, -61.8], [40.5, -62.4], [41.8, -64.1], [48.9, -58.5], [47.0, -56.1], [47.1, -43.2], [44.9, -43.2], [45.0, -29.1], [44.6, -24.6], [46.1, -9.4], [32.7, -6.6], [32.6, -4.4]])
block([[-34.4, 5.5], [-43.2, 29.6], [-34.6, 31.8], [-34.6, 42.7], [-41.9, 43.0], [-41.2, 65.7], [-2.5, 64.9], [7.3, 64.7], [20.6, 67.2], [41.8, 67.0], [41.6, 54.6], [44.3, 54.2], [45.3, 28.3], [43.0, 27.9], [43.2, 13.8], [43.3, 12.2], [40.8, 12.3], [41.0, 8.7], [22.4, 8.2], [22.2, 14.9], [17.5, 15.8], [17.8, 13.8], [12.1, 12.9], [8.8, 25.1], [-2.2, 28.4], [-5.0, 16.3], [-7.4, 17.0], [-7.9, 11.3], [-16.3, 11.8]])

// ---------- the residential tower ----------
// Footprint (OSM part) u 12.4…48.9, v −64…−29. Bands above the podium (r5):
// to 51, 73, 98, then the shaft to 158: the published 156 m, over the ground
// at the tower's own foot (≈ 2 m above the lowest point).
box(28, 48, -63, -30, PODIUM, 51, 'beige')
box(13, 30, -60, -34, PODIUM, 47, 'glass')
box(22, 44, -58, -31, 51, 73, 'beige')
box(13, 28, -52, -36, 47, 70, 'glass')
box(26, 46, -60, -38, 73, 98, 'beige')
box(18, 30, -56, -40, 70, 95, 'glass')
box(28, 48, -61, -41, 98, 158, 'beige')
box(23, 28, -60, -45, 95, 154, 'glass')
box(47, 49, -57, -47, 98, 150, 'glass')

// ---------- the hotel ----------
// Footprint (OSM part) u −24…10.6, v 34.6…62.5. Three bands (r6): base to
// 47–50, middle boxes to 64–66, top box to 86 with two lower side boxes.
box(-24, 10.6, 34.6, 48, PODIUM, 50, 'white')
box(-22, 8.5, 48, 62.5, PODIUM, 47, 'white')
box(-22, 6, 52.8, 62, 47, 64, 'white')
box(-19, 10, 41.3, 52.8, 50, 66, 'white')
box(-18, 4, 46.7, 57.6, 66, 86, 'white')
box(-16, 2, 57.6, 60.5, 64, 72, 'white')
box(-14, 4, 43.5, 46.7, 66, 74, 'white')

const parts = [
  { part: beige, material: finish('grand-render', 0xece0c9) },
  { part: white, material: finish('grand-white', 0xe6e8e6) },
  { part: podium, material: finish('grand-podium', 0xe3cba9) },
  { part: win, material: PALETTE.window },
  { part: glass, material: windowVariant(2, 0xa9bfd1) },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('The Grand LA', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, height: 158,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/1106947212', 'way/1106947213', 'way/1106947214', 'way/1106947215'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/la-grand-la.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
