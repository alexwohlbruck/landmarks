/**
 * Bay Lake Tower at Disney's Contemporary Resort — procedural, CC0-1.0.
 * bun generators/wdw-bay-lake-tower.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0. The anchor is the
 * area centroid of OSM way/344911011, and the footprint is that outline,
 * simplified to 0.6 m (56 corners), extruded whole.
 *
 * What it is (2009, Disney Vacation Club): a 15-storey crescent opening east
 * onto Bay Lake, its convex west face toward the Contemporary's A-frame. Tan
 * walls, white floor slabs running round every storey, glass and balcony
 * bands between; round glass stair towers at both ends of the convex face; an
 * open square frame on a round drum on the roof (the Top of the World
 * lounge); a skyway to the A-frame's 4th floor from the south-west corner.
 *
 * Evidence:
 * - OSM (measured): the outline, area 4,264 m². The crescent's outer face
 *   is close to a 74 m radius about a point 40 m east of the anchor, the
 *   inner face 50 m; the round bumps at the north-west and south-west
 *   corners are the stair towers.
 *   No height in OSM.
 * - Published: 15 storeys (Wikipedia).
 * - Photos (Wikimedia Commons, credits in the report): "Bay lake towers"
 *   and "BayLakeTower.JPG" from the west, "Bay Lake Tower Front", and Sam
 *   Howzit's aerial from the A-frame's roof (south-west). They give a tall
 *   ground floor, 14 even floors above, the cylinders a storey proud, and
 *   the roof frame on the west arc, north of centre.
 *
 * Estimated: the heights (5 m ground floor, 3.1 m storeys, roof at 49.5 m),
 * the roof frame's size and place, the stair towers' radius (4.2 m). The
 * two rectangles on the inner side of each wing are extruded full height,
 * as no photo shows the courtyard; they may be lower. The skyway is left to
 * its own OSM way (way/357831862) and not modelled.
 */
import { Part, cross, len, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const wall = new Part(), trim = new Part(), win = new Part(), roof = new Part(), frame = new Part()
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
/** Round lathe: rings of [radius, z], smooth-shaded sides, flat top. */
function drum(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, seg = 16, top: Part | null = p) {
  for (let k = 0; k < seg; k++) {
    const a = (k / seg) * 2 * Math.PI, b = ((k + 1) / seg) * 2 * Math.PI
    const P = (t: number, z: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
    const N = (t: number): V3 => [Math.cos(t), Math.sin(t), 0]
    quad(p, P(a, z0), P(b, z0), P(b, z1), P(a, z1), [N(a), N(b), N(b), N(a)])
    if (top) tri(top, [cx, cy, z1], P(a, z1), P(b, z1), [[0, 0, 1], [0, 0, 1], [0, 0, 1]])
  }
}

// ---------------------------------------------------------------------------

const OUTLINE: XY[] = [[-32.9, 10.2], [-33.7, -10.1], [-31.8, -22.1], [-24.7, -37.3], [-20.1, -42.7], [-17.3, -40.8], [-16.2, -41.9], [-17.0, -45.3], [-15.1, -48.4], [-15.9, -49.5], [-14.3, -51.0], [-7.5, -55.0], [2.4, -58.2], [12.6, -59.7], [30.1, -59.2], [47.5, -54.3], [43.6, -44.8], [44.3, -42.6], [43.5, -41.6], [42.0, -41.3], [33.0, -45.1], [33.0, -34.8], [7.2, -34.5], [7.0, -44.7], [-6.2, -39.2], [-9.7, -34.8], [-4.2, -31.0], [-5.9, -27.8], [-2.8, -26.1], [-8.5, -13.4], [-9.7, 0.5], [-7.2, 12.2], [-2.8, 20.9], [-6.4, 23.2], [-4.8, 26.4], [-9.5, 29.8], [-5.3, 35.0], [6.8, 41.1], [6.9, 29.5], [33.2, 29.8], [33.2, 39.2], [40.6, 36.3], [43.6, 36.4], [44.2, 38.8], [43.4, 40.0], [47.5, 49.3], [34.2, 53.9], [16.2, 55.2], [8.0, 54.4], [-6.1, 50.2], [-10.3, 56.8], [-29.6, 48.3], [-20.2, 43.1], [-21.2, 38.3], [-29.0, 25.1], [-34.0, 10.4]]

const GROUND = 5, FLOOR = 3.1, FLOORS = 14, ROOF = GROUND + FLOOR * FLOORS + 1.1 // 49.5
const SLAB = 0.5, GLAZE = 1.5

// Walls, bevelled at the parapet, and per storey a white slab line and a
// band of glass and balconies on every face long enough to carry one.
for (let i = 0; i < OUTLINE.length; i++) {
  const a = OUTLINE[i], b = OUTLINE[(i + 1) % OUTLINE.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]
  const at = (p: XY, z: number, d = 0): V3 => [p[0] + n[0] * d, p[1] + n[1] * d, z]
  quad(wall, at(a, 0), at(b, 0), at(b, ROOF - 0.5), at(a, ROOF - 0.5), n)
  const up = unit([n[0], n[1], 1])
  quad(trim, at(a, ROOF - 0.5), at(b, ROOF - 0.5), at(b, ROOF, -0.4), at(a, ROOF, -0.4), up)
  if (L < 4) continue
  // Inset the bands a little from the corners, so they never wrap past them.
  const t = Math.min(0.6, L * 0.1), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const a1: XY = [a[0] + u[0] * t, a[1] + u[1] * t], b1: XY = [b[0] - u[0] * t, b[1] - u[1] * t]
  // The ground floor: glass lobby and shopfronts on the long faces.
  if (L > 10) quad(win, at(a1, 0.6, 0.05), at(b1, 0.6, 0.05), at(b1, GROUND - 1.2, 0.05), at(a1, GROUND - 1.2, 0.05), n)
  for (let k = 0; k <= FLOORS; k++) {
    const z = GROUND + k * FLOOR
    quad(trim, at(a, z - SLAB, 0.06), at(b, z - SLAB, 0.06), at(b, z, 0.06), at(a, z, 0.06), n)
    if (k < FLOORS) quad(win, at(a1, z + 0.7, 0.05), at(b1, z + 0.7, 0.05), at(b1, z + 0.7 + GLAZE, 0.05), at(a1, z + 0.7 + GLAZE, 0.05), n)
  }
}
lid(roof, OUTLINE, ROOF)

// The glass stair towers at the convex face's two ends, by the skyway in
// the south-west and in the north-west: glazed full height, ringed by a
// white slab at every floor, and a storey and a half proud of the roof.
for (const [cx, cy] of [[-18.6, -45.2], [-22.4, 46.0]]) {
  const r = 4.2, top = ROOF + 4.5
  drum(wall, cx, cy, r, 0, GROUND, 12, null)
  drum(win, cx, cy, r, GROUND, top, 12, null)
  for (let k = 1; k <= FLOORS + 1; k++) drum(trim, cx, cy, r + 0.08, GROUND + k * FLOOR - 0.45, GROUND + k * FLOOR, 12, null)
  drum(trim, cx, cy, r + 0.15, top, top + 0.7, 12)
}

// The roof frame: a white drum with an open square frame standing on it,
// four tapering legs under a square ring.
{
  const cx = -22, cy = 24, R = 9.5, z0 = ROOF, z1 = ROOF + 3.2, zt = ROOF + 10.5
  drum(trim, cx, cy, R, z0, z1, 16, roof)
  drum(win, cx, cy, R - 1.2, z1, z1 + 2.2, 16, roof)
  const ring = (h: number, z: number): V3[] => [[cx - h, cy - h, z], [cx + h, cy - h, z], [cx + h, cy + h, z], [cx - h, cy + h, z]]
  // Legs at the corners, leaning out a little as they rise.
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const w = 1.0
    const b0: XY = [cx + sx * 6.2, cy + sy * 6.2], t0: XY = [cx + sx * 7.6, cy + sy * 7.6]
    const sec = (c: XY, z: number): V3[] => [[c[0] - w, c[1] - w, z], [c[0] + w, c[1] - w, z], [c[0] + w, c[1] + w, z], [c[0] - w, c[1] + w, z]]
    const r0 = sec(b0, z1), r1 = sec(t0, zt - 1.6)
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4, mid: V3 = [(b0[0] + t0[0]) / 2, (b0[1] + t0[1]) / 2, (z1 + zt) / 2]
      const q = [r0[i], r0[j], r1[j], r1[i]]
      const nn = cross([q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], [q[3][0] - q[0][0], q[3][1] - q[0][1], q[3][2] - q[0][2]])
      const c = q.reduce<V3>((s2, v) => [s2[0] + v[0] / 4, s2[1] + v[1] / 4, s2[2] + v[2] / 4], [0, 0, 0])
      const out = dot(nn, [c[0] - mid[0], c[1] - mid[1], c[2] - mid[2]]) >= 0 ? unit(nn) : unit([-nn[0], -nn[1], -nn[2]])
      quad(frame, q[0], q[1], q[2], q[3], out)
    }
  }
  // The square ring at the top: outer and inner faces, top and underside.
  const o0 = ring(9, zt - 1.8), o1 = ring(9, zt), i0 = ring(6.6, zt - 1.8), i1 = ring(6.6, zt)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const mx = (o0[i][0] + o0[j][0]) / 2 - cx, my = (o0[i][1] + o0[j][1]) / 2 - cy
    const n = unit([mx, my, 0]), m: V3 = [-n[0], -n[1], 0]
    quad(frame, o0[i], o0[j], o1[j], o1[i], n)
    quad(frame, i0[i], i0[j], i1[j], i1[i], m)
    quad(frame, o1[i], o1[j], i1[j], i1[i], [0, 0, 1])
    quad(frame, o0[i], o0[j], i0[j], i0[i], [0, 0, -1])
  }
}

// ---------------------------------------------------------------------------

// The tan render is the building's colour (photos), pulled to the palette's
// lightness; floor slabs and frame trims white; glass and balconies the
// slate `window`, lit at night.
const parts = [
  { part: wall, material: finish('blt-tan', 0xdccbab) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: frame, material: finish('blt-frame', 0xe8dcc4) },
]
const triangles = parts.reduce((sum, { part }) => sum + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Bay Lake Tower', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: ROOF + 10.5,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/wdw-bay-lake-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
