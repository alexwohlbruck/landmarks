/**
 * Two California Plaza (1992, Arthur Erickson), Los Angeles — original
 * procedural geometry, CC0-1.0.
 * bun generators/la-two-california-plaza.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the centroid of the
 * OSM outline (way/48847807) on the lowest ground under it (the Olive Street
 * side). Placed at bearing 37.9°, so the tower's faces are square to x, y.
 *
 * A blue-green glass tower, 61 × 50 m, with two opposite corners rounded
 * (r ≈ 14 m) and the other two cut back in two 5 m steps, the steps reading
 * as darker recessed strips up the full height. It stands on a granite base
 * with round porthole windows where the ground falls away from California
 * Plaza towards Olive Street.
 *
 * Sources:
 * - Plan: OSM way/48847807 (52 levels), used as drawn: corners at ±30.5,
 *   ±25.2, steps at 5.5 and 5.4 m.
 * - Height: LA County LARIAC 2020 lidar footprint 485426841221, max 235.2 m,
 *   roof elevation 338.1 m; 3DEP bare earth falls from ≈ 118 m (the plaza,
 *   north and west) to ≈ 100 m (south and east), so the roof is ≈ 238 m over
 *   the lowest ground. Published 228.6 m / 750 ft (Wikipedia), measured from
 *   the plaza.
 * - Base height (18 m, the plaza's height over Olive St) from 3DEP; porthole
 *   rows from photo c4. Glass colour from c3, c4, c11.
 * - Photos (Wikimedia Commons): c3 "Two California Plaza 2015" (CookieMonster
 *   …, CC BY-SA 4.0, stepped corner and rounded corner, from the south-east
 *   below); c4 "Two California Plaza - 350 S. Grand Avenue, Los Angeles"
 *   (Downtowngal, CC BY-SA 3.0, from the east up 4th Street, base);
 *   c11 "California Plaza 1 and 2" (Selvingarcia, CC BY-SA 3.0, top).
 *
 * The top five floors round the corners off more deeply (r 19 m), the
 * step-down at the crown seen in c4; its depth is estimated.
 *
 * Left out: the row of louvre panels, the signs. Its identity is mostly the rounded
 * and stepped corners on a plain glass prism; see the batch notes.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]

const wall = new Part(), glass = new Part(), notch = new Part(), granite = new Part(), roof = new Part(), ports = new Part()

const BEARING = 37.9
const HX = 30.5, HY = 25.2, R = 14, STEP = 5.4
const H = 238, BASE = 18, PARAPET = 1.6
const FLOOR = 4.1, GROUP = 4 * FLOOR

type V = { p: XY; kind: 'glass' | 'notch' }

/** The plan, counter-clockwise from the south-west stepped corner, with corner radius r. */
function plan(r: number): V[] {
  const ring: V[] = []
  const half = (s: 1 | -1) => {
    const m = (p: XY): XY => [p[0] * s, p[1] * s]
    // stepped corner (−x, −y), then the south face to the rounded corner (+x, −y)
    ring.push({ p: m([-HX, -HY + 2 * STEP]), kind: 'notch' })
    ring.push({ p: m([-HX + STEP, -HY + 2 * STEP]), kind: 'notch' })
    ring.push({ p: m([-HX + STEP, -HY + STEP]), kind: 'notch' })
    ring.push({ p: m([-HX + 2 * STEP, -HY + STEP]), kind: 'notch' })
    ring.push({ p: m([-HX + 2 * STEP, -HY]), kind: 'glass' })
    for (let i = 0; i <= 5; i++) {
      const a = -Math.PI / 2 + (Math.PI / 2) * (i / 5)
      ring.push({ p: m([HX - r + r * Math.cos(a), -HY + r + r * Math.sin(a)]), kind: 'glass' })
    }
  }
  half(1)
  half(-1)
  return ring
}

const at = (p: XY, z: number): V3 => [p[0], p[1], z]
const outward = (a: XY, b: XY): XY => {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1])
  return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l]
}
const lerp2 = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

/**
 * One tier of the shaft from z0 to z1. The top five floors round their
 * corners off more deeply, so the rounded corners step down at the crown
 * (photo c4).
 */
function tier(ring: V[], z0: number, z1: number, base: boolean) {
const n = ring.length
for (let i = 0; i < n; i++) {
  const a = ring[i].p, b = ring[(i + 1) % n].p
  const isNotch = ring[i].kind === 'notch'
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const o = outward(a, b), off = (p: XY, d = 0.05): XY => [p[0] + o[0] * d, p[1] + o[1] * d]
  // granite base, then the shaft, then a pale parapet
  if (base) granite.quad(at(a, 0), at(b, 0), at(b, BASE), at(a, BASE))
  const w0 = base ? BASE : z0
  wall.quad(at(a, w0), at(b, w0), at(b, z1), at(a, z1))
  // Glass: the steps are one dark panel per storey group; the faces, bays of
  // about 6.5 m, four floors to a panel, with slim mullion piers.
  const bays = isNotch ? 1 : Math.max(1, Math.round(L / 6.5)), pier = isNotch ? 0.5 : 0.7
  for (let g = 0; ; g++) {
    // the crown tier splits its height into two rows
    const start = base ? BASE + 1.2 : z0, group = base ? GROUP : (z1 - PARAPET - z0) / 2
    const lo = start + g * group + 0.5, hi = start + (g + 1) * group - 0.5
    if (hi > z1 - (base ? 0.3 : PARAPET)) break
    for (let k = 0; k < bays; k++) {
      const p = off(lerp2(a, b, k / bays + pier / 2 / L)), q = off(lerp2(a, b, (k + 1) / bays - pier / 2 / L))
      ;(isNotch ? notch : glass).quad(at(p, lo), at(q, lo), at(q, hi), at(p, hi))
    }
  }
  // Base: two rows of round portholes, on the faces long enough to carry them.
  if (base && !isNotch && L > 4) {
    const holes = Math.max(1, Math.round(L / 5))
    for (let k = 0; k < holes; k++) {
      const c = off(lerp2(a, b, (k + 0.5) / holes))
      const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
      for (const zc of [6, 12.5]) {
        const r = 1.6, seg = 8
        for (let s = 0; s < seg; s++) {
          const a0 = (s / seg) * 2 * Math.PI, a1 = ((s + 1) / seg) * 2 * Math.PI
          const p0: V3 = [c[0] + t[0] * r * Math.cos(a0), c[1] + t[1] * r * Math.cos(a0), zc + r * Math.sin(a0)]
          const p1: V3 = [c[0] + t[0] * r * Math.cos(a1), c[1] + t[1] * r * Math.cos(a1), zc + r * Math.sin(a1)]
          ports.tri(at(c, zc), p0, p1)
        }
      }
    }
  }
}
// roof: the ring is star-shaped about the origin, so a fan covers it
for (let i = 0; i < n; i++) roof.tri([0, 0, z1], at(ring[i].p, z1), at(ring[(i + 1) % n].p, z1))
}

const CROWN = BASE + 1.2 + 12 * GROUP // the top five floors
tier(plan(R), 0, CROWN, true)
tier(plan(19), CROWN, H, false)


const parts = [
  { part: wall, material: finish('tcp-mullion', 0xd5dde0) },
  { part: glass, material: windowVariant(2, 0x8fb4c2) },
  { part: notch, material: PALETTE.window },
  { part: granite, material: finish('tcp-granite', 0xe6dccd) },
  { part: ports, material: windowVariant(3, 0x7d95a3) },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Two California Plaza', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, height: H,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/48847807'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/la-two-california-plaza.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
