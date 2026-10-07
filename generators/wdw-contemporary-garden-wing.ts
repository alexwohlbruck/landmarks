/**
 * Disney's Contemporary Resort, the (South) Garden Wing — procedural, CC0-1.0.
 * bun generators/wdw-contemporary-garden-wing.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0. The anchor is the
 * area centroid of OSM way/344887164 ("South Garden Wing", building=hotel,
 * building:levels=3), and the footprint is that outline simplified to 0.6 m
 * (68 corners), extruded whole.
 *
 * What it is: the three-storey room wings south of the A-frame (1971),
 * long arms joined at an octagonal hub, flat roofs behind a plain parapet.
 * Buff render, a white slab line at each floor, and the rooms' balconies as
 * a recessed band along the long faces; the ends are plain walls.
 *
 * Evidence:
 * - OSM (measured): the outline and its three levels. No height tag.
 * - Photos (Flickr, CC BY 2.0, credits in the report): cvorobek's view from
 *   Bay Lake with the A-frame behind, and Jeff Christiansen's view down on a
 *   wing from the A-frame. They show three even storeys under a parapet,
 *   slab lines, balcony bays, blank buff ends and a pale flat roof.
 *
 * Estimated: the heights (3.2 m storeys over a 0.8 m base, parapet at
 * 11 m). Simplified: the balconies are one continuous band per floor rather
 * than one bay per room.
 */
import { Part, cross, len, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const wall = new Part(), trim = new Part(), win = new Part(), roof = new Part()
type XY = [number, number]
const unit = (v: V3): V3 => { const l = len(v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function tri(p: Part, a: V3, b: V3, c: V3, n: V3[]) {
  const f = cross([b[0] - a[0], b[1] - a[1], b[2] - a[2]], [c[0] - a[0], c[1] - a[1], c[2] - a[2]])
  if (len(f) < 1e-9) return
  const avg: V3 = [n[0][0] + n[1][0] + n[2][0], n[0][1] + n[1][1] + n[2][1], n[0][2] + n[1][2] + n[2][2]]
  if (dot(f, avg) >= 0) p.tri(a, b, c, undefined, undefined, undefined, n)
  else p.tri(a, c, b, undefined, undefined, undefined, [n[0], n[2], n[1]])
}
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3 | V3[]) {
  const N = Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3, n as V3]
  tri(p, a, b, c, [N[0], N[1], N[2]])
  tri(p, a, c, d, [N[0], N[2], N[3]])
}
/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
function earcut(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i), out: [number, number, number][] = []
  const crossz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => crossz(a, b, p) > 0 && crossz(b, c, p) > 0 && crossz(c, a, p) > 0
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if (crossz(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(poly[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
function lid(p: Part, poly: XY[], z: number) {
  for (const [a, b, c] of earcut(poly)) tri(p, [...poly[a], z] as V3, [...poly[b], z] as V3, [...poly[c], z] as V3, [[0, 0, 1], [0, 0, 1], [0, 0, 1]])
}

const OUTLINE: XY[] = [[-69.1, 62.3], [-68.3, 64.0], [-66.7, 63.0], [-71.7, 54.3], [-45.0, 39.2], [-45.1, 14.9], [-35.5, 14.9], [-35.6, 7.8], [-41.3, 7.8], [-43.6, 5.5], [-43.6, 3.0], [-41.3, 0.4], [-41.3, -4.5], [-43.8, -6.4], [-43.6, -9.3], [-40.9, -11.7], [-35.4, -11.7], [-35.3, -19.3], [-45.1, -19.3], [-45.0, -67.2], [-41.4, -67.2], [-41.4, -78.7], [-24.1, -78.6], [-24.1, -66.7], [-21.6, -66.7], [-21.8, -19.6], [-32.6, -19.6], [-32.6, -11.7], [-25.2, -11.7], [-23.2, -9.1], [-23.2, -3.7], [-15.9, -3.6], [-15.9, -13.5], [41.1, -13.3], [41.0, -3.9], [47.3, -3.9], [47.4, -34.8], [50.9, -34.7], [51.0, -45.4], [66.0, -45.3], [66.0, -35.2], [69.7, -35.1], [69.3, 31.5], [66.0, 31.5], [65.9, 42.7], [50.3, 42.6], [50.3, 31.1], [47.2, 31.1], [47.4, -0.1], [41.2, -0.2], [41.1, 9.9], [-16.3, 9.5], [-16.2, -0.5], [-23.8, -0.5], [-23.8, 5.5], [-26.2, 8.0], [-32.3, 8.0], [-32.3, 15.3], [-22.8, 15.4], [-23.0, 52.1], [-60.8, 73.4], [-65.3, 65.3], [-66.7, 66.3], [-64.2, 70.6], [-67.6, 72.5], [-69.0, 70.3], [-68.3, 69.6], [-72.7, 64.5]]

const BASE = 0.8, FLOOR = 3.2, FLOORS = 3, ROOF = BASE + FLOOR * FLOORS + 0.6 // 11.0
const SLAB = 0.45, BALC = 2.1

for (let i = 0; i < OUTLINE.length; i++) {
  const a = OUTLINE[i], b = OUTLINE[(i + 1) % OUTLINE.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]
  const at = (p: XY, z: number, d = 0): V3 => [p[0] + n[0] * d, p[1] + n[1] * d, z]
  quad(wall, at(a, 0), at(b, 0), at(b, ROOF - 1.3), at(a, ROOF - 1.3), n)
  // The white fascia round the roof (photo 1).
  quad(trim, at(a, ROOF - 1.3), at(b, ROOF - 1.3), at(b, ROOF - 0.4), at(a, ROOF - 0.4), n)
  quad(trim, at(a, ROOF - 0.4), at(b, ROOF - 0.4), at(b, ROOF, -0.3), at(a, ROOF, -0.3), unit([n[0], n[1], 1]))
  // Only the long room faces carry balconies; ends and hub stay plain.
  if (L < 20) continue
  const t = 2.5, u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const a1: XY = [a[0] + u[0] * t, a[1] + u[1] * t], b1: XY = [b[0] - u[0] * t, b[1] - u[1] * t]
  for (let k = 0; k < FLOORS; k++) {
    const z = BASE + k * FLOOR
    quad(win, at(a1, z + 0.3, 0.05), at(b1, z + 0.3, 0.05), at(b1, z + 0.3 + BALC, 0.05), at(a1, z + 0.3 + BALC, 0.05), n)
    quad(trim, at(a1, z + FLOOR - SLAB, 0.06), at(b1, z + FLOOR - SLAB, 0.06), at(b1, z + FLOOR, 0.06), at(a1, z + FLOOR, 0.06), n)
  }
}
lid(roof, OUTLINE, ROOF)

// Buff render pulled to the palette's lightness, white slabs, the balcony
// recesses in the palette's slate `window` (lit at night), a pale roof.
const parts = [
  { part: wall, material: finish('gw-buff', 0xe2d2b2) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((sum, { part }) => sum + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb("Disney's Contemporary Resort Garden Wing", parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: ROOF,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/wdw-contemporary-garden-wing.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
