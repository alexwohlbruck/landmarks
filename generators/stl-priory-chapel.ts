/**
 * Saint Louis Abbey Church (the Priory Chapel), 500 S Mason Rd, Creve
 * Coeur, St. Louis County (1962; Gyo Obata of Hellmuth, Obata & Kassabaum,
 * with Pier Luigi Nervi as consultant) — original procedural geometry,
 * CC0-1.0.  bun generators/stl-priory-chapel.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the
 * chapel's centre) on the lowest ground. Bearing 0. Anchor = the centroid of
 * OSM way/530715850, -90.4788282, 38.6441947.
 *
 * Identity (from the photos below):
 *  1. A ring of 20 large, thin, white parabolic concrete vaults on the
 *     ground, each opening outward in a parabolic arch filled with dark
 *     glazing; their shells meet in V-shaped valleys.           (p1, p2, p3)
 *  2. A second ring of 20 smaller parabolic vaults above and behind them.
 *  3. The open bell crown in the middle: tall slender parabolic blades in a
 *     ring round the bells, a cross on top.
 *
 * Geometry: the rims lean outward (the lower crowns 0.8 m beyond their
 * springing, the upper 0.6; lidar returns to r 22–23 at 7–8 m agree), and
 * each vault is a true parabola in section, z = z0 + H(1 − (2s/w)²),
 * across the full sector between the rays at ±9°, so neighbouring vaults
 * meet in valleys that start at the ground at the rim and climb inward
 * (to 5.5 m for the lower ring, where the upper ring springs); the section is lofted from the outer
 * arch inward.
 *
 * Heights and radii: USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018
 * (flown 2017), 0.5 m grid, read in rings about the centre; y = 0 is the
 * lawn (1 m over the box's ground_min). Measured: the lower ring's arches
 * open at r 21.5 (OSM's circle, r ≈ 21.5), the shells 8.0–8.5 at r 16–20
 * (the rims' crowns at 8.0; review round 2: each parabola springs 3 m below
 * the floor at the rim, so its opening meets the ground steeply and spans
 * ~85% of the bay, as in p1 and p3);
 * the upper ring's arches open at r 14.5, crowns 12.7–13.0, its roof 13.3
 * inward to r 5 (drawn as the upper vaults converging on the crown's
 * base); the bell crown's top 24.1 within r 3. Estimated from p1
 * and p3: the upper arches' springing (5.5), the glazing's recess (0.5 m),
 * the bell blades (eight, 2.3 m wide, parabolic tops from 18.5), the cross (to 27.5; the cloud misses
 * it). The east wing of the outline (x 21–28, y −2..3) is a low link,
 * drawn at 3.0 m.
 * Left out: the doors, the steps, the shells' ribs.
 *
 * Night: the glazing glows (window material); the shells are floodlit.
 *
 * Photos (EVIDENCE):
 *  p1  "Exterior of the Priory Chapel at Saint Louis Abbey.jpg", ArentYouJustAdorable, CC BY-SA 4.0 (Wikimedia Commons)
 *  p2  "Priory Chapel at Saint Louis Abbey - July 2013.jpg", Magdalena424, CC BY-SA 3.0 (Wikimedia Commons)
 *  p3  "St. Anselm Parish Church (Priory Chapel), St. Louis Abbey, Mason Road", w_lemay, CC BY-SA 2.0
 *      (Flickr 54223895575; the front)
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, revolve, save, type XY } from './atl-tech-tower'

const shell = new Part(), glass = new Part(), roof = new Part(), cross = new Part()
const N = 20, HALF = Math.PI / N
const tri = (p: Part, a: V3, b: V3, c: V3, out: V3) => {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}

type Tier = { rOut: number; rIn: number; z0: number; hOut: number; hIn: number; lean?: number; zvIn?: number; zb?: number }
/** A ring of parabolic vaults. */
function tier(t: Tier, rows = 4, cols = 10, edge = true) {
  for (let k = 0; k < N; k++) {
    const th = (k / N) * Math.PI * 2, u: XY = [Math.cos(th), Math.sin(th)], v: XY = [-u[1], u[0]]
    // a point on the vault at radius r, across-fraction f ∈ [-1, 1], dropped by `drop`
    const P = (r: number, f: number, drop = 0): V3 => {
      const half = r * Math.tan(HALF), s = f * half
      const H = t.hOut + ((t.hIn - t.hOut) * (t.rOut - r)) / (t.rOut - t.rIn)
      // the valleys between vaults climb inward (the shells are folded, not troughs)
      // the parabola's springing lies below the floor at the rim (zb), so the
      // opening meets the floor steeply and spans ~80% of the bay; the rest of
      // the bay is a narrow valley at the floor. Inward the springing climbs to zvIn.
      const zb = t.zb ?? t.z0
      const zv = zb + ((t.zvIn ?? t.z0) - zb) * ((t.rOut - r) / (t.rOut - t.rIn))
      const z = Math.max(t.z0, zv + (H - zv) * (1 - f * f)) - drop
      // the shells lean outward: the rim's crown stands `lean` m beyond its springing (p1, p3)
      const rl = r + (t.lean ?? 0) * (1 - f * f) * ((r - t.rIn) / (t.rOut - t.rIn))
      return [u[0] * rl + v[0] * s, u[1] * rl + v[1] * s, z]
    }
    const up = (r: number, f: number): V3 => { const q = P(r, f); return [q[0] * 0.2, q[1] * 0.2, 1] }
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
      const r0 = t.rOut - ((t.rOut - t.rIn) * i) / rows, r1 = t.rOut - ((t.rOut - t.rIn) * (i + 1)) / rows
      const f0 = -1 + (2 * j) / cols, f1 = -1 + (2 * (j + 1)) / cols
      const a = P(r0, f0), b = P(r0, f1), c = P(r1, f1), d = P(r1, f0)
      const o = up((r0 + r1) / 2, (f0 + f1) / 2)
      tri(shell, a, b, c, o); tri(shell, a, c, d, o)
    }
    // the arch's thick edge: the soffit for the first 0.6 m and the rim face
    const rr = t.rOut - (edge ? 0.35 : 0.15)
    if (edge) for (let j = 0; j < cols; j++) {
      const f0 = -1 + (2 * j) / cols, f1 = -1 + (2 * (j + 1)) / cols
      const a = P(t.rOut, f0, 0.15), b = P(t.rOut, f1, 0.15), c = P(rr, f1, 0.15), d = P(rr, f0, 0.15)
      tri(shell, a, b, c, [0, 0, -1]); tri(shell, a, c, d, [0, 0, -1])
      const e = P(t.rOut, f0), g = P(t.rOut, f1) // the thin bright rim face
      tri(shell, e, g, b, [u[0], u[1], 0.3]); tri(shell, e, b, a, [u[0], u[1], 0.3])
    }
    // the dark glazing filling the arch, recessed behind the rim
    const fan: V3[] = []
    for (let j = 0; j <= cols; j++) fan.push(P(rr, -1 + (2 * j) / cols, edge ? 0.15 : 0.05))
    const base: V3 = [u[0] * rr, u[1] * rr, t.z0]
    for (let j = 0; j < cols; j++) tri(glass, base, fan[j], fan[j + 1], [u[0], u[1], 0])
  }
}

// the lower ring on the ground, and the clerestory wall behind it
tier({ rOut: 21.5, rIn: 14.5, z0: 0, hOut: 8.0, hIn: 8.6, lean: 0.4, zvIn: 5.5, zb: -3.0 }, 1, 14) // the rim's crown 7.0; the shell rises to the lidar's 8–8.6 behind it
revolve(glass, [0, 0], [[14.5, 0], [14.5, 5.6]], N, HALF, true, false)
// the upper ring, springing at 5.5, and the drum behind it
tier({ rOut: 14.5, rIn: 2.5, z0: 5.5, hOut: 12.6, hIn: 13.4, lean: 0.6, zvIn: 12.0, zb: 2.6 }, 1, 6) // converging on the bell crown's base
// the bell crown: eight broad blades in a ring round the bells, each a
// straight-sided plate with a parabolic top (p1, p3)
for (let k = 0; k < 8; k++) {
  const th = (k / 8) * Math.PI * 2 + Math.PI / 8, u: XY = [Math.cos(th), Math.sin(th)], v: XY = [-u[1], u[0]]
  const r = 3.0, w = 2.0, z0 = 12.8, zs = 18.5, z1 = 24.1
  const Q = (f: number, z: number): V3 => [u[0] * r + v[0] * f * (w / 2), u[1] * r + v[1] * f * (w / 2), z]
  const top: V3[] = []
  for (let j = 0; j <= 8; j++) { const f = -1 + j / 4; top.push(Q(f, zs + (z1 - zs) * (1 - f * f))) }
  const out: V3 = [u[0], u[1], 0], inn: V3 = [-u[0], -u[1], 0]
  for (const o of [out, inn]) {
    tri(shell, Q(-1, z0), Q(1, z0), Q(1, zs), o); tri(shell, Q(-1, z0), Q(1, zs), Q(-1, zs), o)
    const c = Q(0, zs)
    for (let j = 0; j < 8; j++) tri(shell, c, top[j], top[j + 1], o)
  }
}
revolve(glass, [0, 0], [[2.6, 13.3], [2.6, 21.5]], 8, Math.PI / 8, true, true) // the dark open core between the blades
revolve(roof, [0, 0], [[0.8, 21.5], [0.8, 23.0]], 6, 0, false, true) // the cross's stand
box(cross, -0.14, 0.14, -0.14, 0.14, 23.0, 27.5, cross, 0)
box(cross, -0.9, 0.9, -0.12, 0.12, 25.6, 25.9, cross, 0)
// the low link to the east
box(roof, 20.5, 28.1, -1.8, 2.7, 0, 3.0, roof, 0.1)

const lit = (p: V3, n: V3) => (n[2] > 0.2 ? 0.9 : 0.5)
await save('stl-priory-chapel', 'Saint Louis Abbey Church (Priory Chapel)', [
  { part: shell, material: { ...finish('stl-priory-concrete', 0xf1efea), floodlight: lit } },
  { part: glass, material: { ...PALETTE.window, color: 0x4d555a } },
  { part: roof, material: PALETTE.roof },
  { part: cross, material: finish('stl-priory-cross', 0x3d3b39) },
], { height: 27.5, anchor: [38.6441947, -90.4788282], bearing: 0 }, 6500)
