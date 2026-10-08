/**
 * Pacific Science Center, Seattle Center: procedural, CC0-1.0.
 * bun generators/sea-pacific-science-center.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * centroid of OSM way/394955903 (the outline). y = 0 is the lowest ground
 * the walls touch, on the south (Denny Way) side, 37.9 m NAVD88; the site
 * rises about 9 m to the north-west, so walls there sink into the hill.
 *
 * Minoru Yamasaki, 1962 (the United States Science Pavilion of the World's
 * Fair). Five white lattice arches rise over the courtyard pools, ringed by
 * low white precast buildings whose walls are lined with slender pointed
 * arches and open, at the courtyard, in pointed-arch arcades.
 *
 * Measured (USGS 3DEP WA_KingCo_1_2021 lidar, 0.5-1 m; heights above y = 0):
 * - the arches: five squares about 8.3 m a side, each turned 45 degrees,
 *   centred at (-17.5, 51.0), (-11.3, 38.5), (-23.5, 32.6), (-36.0, 26.8)
 *   and (-30.3, 14.3); crowns 37.9 m, standing on the courtyard at 6.7 m
 *   (so 31.2 m tall; published 110 ft, 33.5 m, from the pool floor);
 * - flat roofs: the north-east and north-west halls 22.6 / 22.4 m, the
 *   south-west hall 21.9 m, the west, south and east halls 16.5-16.6 m, the
 *   north-west annex 12.3 m, the east wing round the dome 14.6 m; the dome
 *   (the Laser Dome / IMAX, 36 m across) crown 22.1 m, its ring 10.8 m.
 *
 * OSM: way/394955903 (outline) and its building:parts 394955876, -877, -878,
 * -882, -883, -887, -890, -894, -898, -899, all covered by the model.
 *
 * From photos: the arch form (four legs rising straight to about two thirds
 * of their height, a lancet arch on each face, tracery thickening toward the
 * crown); the walls' lancet relief and the
 * courtyard arcades; the dome's glazed ring.
 *
 * Estimated: the lancet curvature (radius 1.6 times the span), rib and leg
 * sizes (1.5 m, drawn a little heavy so the lattice reads at map scale), the relief's bay (4.2 m) and the arcade's height (6.5 m
 * above the courtyard), the dome's profile between the lidar's ring and
 * crown. Left out: the pools and their fountains (water), the raised
 * walkways over them, the lamps hung in the arches, rooftop plant.
 *
 * Photos (Wikimedia Commons):
 * - "Pacific Science Center arches.jpg", Ron Clausen, CC BY-SA 4.0
 * - "Pacific Science Center arches, Seattle WA.jpg", Ron Clausen, CC BY-SA 4.0
 * - "Pacific Science Center 01.jpg", Ɱ, CC BY-SA 4.0 (aerial from the north)
 * - "Seattle (WA, USA), Pacific Science Center -- 2022 -- 1531.jpg" and "-- 1530.jpg", Dietmar Rabich, CC BY-SA 4.0
 * - "Pacific Science Center Seattle 2.jpg", Thayne Tuason, CC BY-SA 4.0
 * - "Pacific Science Center, 1968.jpg", Seattle Municipal Archives, CC BY 2.0
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE } from './palette'

type P2 = [number, number]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

const white = new Part()   // walls, arches, dome
const relief = new Part()  // the lancet relief, a shade deeper than the walls
const roof = new Part()
const win = new Part()     // arcades and the dome's glazed ring

/** A triangle facing `n`. */
function tri(p: Part, a: V3, b: V3, c: V3, n: V3) {
  if (dot(cross(sub(b, a), sub(c, a)), n) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
const quad = (p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) => { tri(p, a, b, c, n); tri(p, a, c, d, n) }
const area = (P: P2[]) => P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
const ccw = (P: P2[]) => (area(P) >= 0 ? P : [...P].reverse())
function earClip(P: P2[]): [P2, P2, P2][] {
  const idx = P.map((_, i) => i), out: [P2, P2, P2][] = []
  const cr = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  for (let guard = 0; idx.length > 3 && guard < 2000; guard++) {
    let cut = false
    for (let k = 0; k < idx.length && !cut; k++) {
      const a = P[idx[(k + idx.length - 1) % idx.length]], b = P[idx[k]], c = P[idx[(k + 1) % idx.length]]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => { const p = P[j]; return p !== a && p !== b && p !== c && cr(a, b, p) >= 0 && cr(b, c, p) >= 0 && cr(c, a, p) >= 0 })) continue
      out.push([a, b, c]); idx.splice(k, 1); cut = true
    }
    if (!cut) break
  }
  for (let k = 1; k < idx.length - 1; k++) out.push([P[idx[0]], P[idx[k]], P[idx[k + 1]]])
  return out
}

// ------------------------------------------------------------ the halls ---
/** The courtyard, open to the north between the two northern halls. */
const inCourtyard = (x: number, y: number) =>
  (x > -66 && x < 12.7 && y > -44.5 && y < 13.5) || (x > -47.9 && x < -0.4 && y > 13.4 && y < 70)
const COURT_Z = 6.7 // the courtyard's deck above y = 0 (lidar)
const BAY = 4.2

/**
 * A lancet: points along its outline in (u, z) for a panel `w` wide from
 * z0, springing at zs. The arcs are struck from radius 1.6 w, so the arch
 * rises about 1.25 w: Yamasaki's slender pointed arches.
 */
function lancet(u0: number, w: number, z0: number, zs: number, k = 6): P2[] {
  const R = 1.6 * w, h = Math.sqrt(R * R - (R - w / 2) ** 2)
  const pts: P2[] = [[u0, z0], [u0 + w, z0], [u0 + w, zs]]
  // right arc centred at u0 + w - R, left arc at u0 + R, meeting at the apex
  const cR = u0 + w - R, cL = u0 + R
  const apexAng = Math.acos((u0 + w / 2 - cR) / R)
  for (let i = 1; i <= k; i++) { const t = (apexAng * i) / k; pts.push([cR + R * Math.cos(t), zs + R * Math.sin(t)]) }
  for (let i = k - 1; i >= 0; i--) { const t = (apexAng * i) / k; pts.push([cL - R * Math.cos(t), zs + R * Math.sin(t)]) }
  return pts
}
/** A flat shape in a wall's (u, z) frame, laid just proud of it. */
function onWall(p: Part, P: V3, Q: V3, n: V3, shape: P2[], proud = 0.05) {
  const t = unit(sub(Q, P))
  const at = ([u, z]: P2): V3 => add(add(P, mul(t, u)), add(mul(n, proud), [0, 0, z]))
  for (const [a, b, c] of earClip(ccw(shape))) tri(p, at(a), at(b), at(c), n)
}

/** A flat-roofed hall from its OSM part, walls to y = 0. */
function hall(plan: P2[], h: number) {
  const P = ccw(plan)
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.05) continue
    const n: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]
    const A: V3 = [a[0], a[1], 0], B: V3 = [b[0], b[1], 0]
    quad(white, A, B, [b[0], b[1], h], [a[0], a[1], h], n)
    // Walls facing the courtyard carry the lancet relief and an arcade.
    const m: P2 = [(a[0] + b[0]) / 2 + n[0] * 2, (a[1] + b[1]) / 2 + n[1] * 2]
    if (!inCourtyard(m[0], m[1]) || L < BAY) continue
    const nb = Math.floor((L - 1) / BAY), m0 = (L - nb * BAY) / 2
    for (let k = 0; k < nb; k++) {
      const u = m0 + k * BAY
      // the arcade: open pointed arches at the courtyard deck
      onWall(win, A, B, n, lancet(u + 0.6, BAY - 1.2, COURT_Z - 0.5, COURT_Z + 3.0, 4))
      // the relief above it, up to under the parapet
      const top = h - 1.2, w = BAY - 1.6, zs = top - 1.25 * w
      if (zs > COURT_Z + 7.5) onWall(relief, A, B, n, lancet(u + 0.8, w, COURT_Z + 7.0, zs, 4))
    }
  }
  const T = earClip(P)
  for (const [a, b, c] of T) tri(roof, [a[0], a[1], h], [b[0], b[1], h], [c[0], c[1], h], [0, 0, 1])
  // a white parapet lip round the roof
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.05) continue
    const n: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]
    const ai: V3 = [a[0] - n[0] * 0.5, a[1] - n[1] * 0.5, h], bi: V3 = [b[0] - n[0] * 0.5, b[1] - n[1] * 0.5, h]
    quad(white, [a[0], a[1], h], [b[0], b[1], h], [b[0], b[1], h + 0.8], [a[0], a[1], h + 0.8], n)
    quad(white, [a[0], a[1], h + 0.8], [b[0], b[1], h + 0.8], add(bi, [0, 0, 0.8]), add(ai, [0, 0, 0.8]), [0, 0, 1])
    quad(white, ai, bi, add(bi, [0, 0, 0.8]), add(ai, [0, 0, 0.8]), mul(n, -1))
  }
}

// OSM building:parts (metres from the anchor) with lidar roof heights.
hall([[-0.3, 50.2], [1.7, 50.2], [31.1, 50.0], [31.0, 13.3], [-0.5, 13.5]], 22.6)                       // 394955883
hall([[-79.8, 50.6], [-51.7, 50.3], [-47.6, 50.3], [-47.8, 30.3], [-47.9, 13.9], [-66.0, 14.1], [-80.2, 14.2]], 22.4) // 394955899
hall([[-59.4, -28.9], [-27.4, -29.1], [-27.5, -44.3], [-27.7, -59.7], [-59.7, -59.4], [-59.5, -31.2]], 21.9) // 394955898
hall([[-59.5, -39.1], [-92.1, -38.9], [-91.8, 14.2], [-66.0, 14.1], [-66.2, -31.2], [-59.5, -31.2]], 16.5) // 394955890
hall([[12.4, -44.5], [12.3, -67.7], [-27.7, -67.5], [-27.5, -44.3]], 16.6)                              // 394955882
hall([[46.7, -55.0], [12.3, -54.8], [12.7, 13.4], [47.0, 13.3]], 16.5)                                  // 394955887
hall([[-79.8, 50.6], [-79.8, 67.1], [-56.1, 66.9], [-56.1, 63.7], [-51.6, 63.7], [-51.7, 50.3]], 12.3)  // 394955894
// The east wing (394955876), wrapped round the dome.
{
  const DC: P2 = [57.1, 39.7], R0 = 17.7
  hall([[64.7, 55.6], [64.7, 66.8], [31.2, 66.9], [31.0, 13.3], [47.0, 13.3], [46.7, -55.0], [64.3, -55.1], [64.6, 23.8], [63.8, 23.4], [60.5, 22.4], [57.0, 22.1], [53.5, 22.5], [50.2, 23.5], [47.2, 25.2], [44.5, 27.4], [42.3, 30.1], [40.7, 33.2], [39.7, 36.5], [39.4, 39.9], [39.8, 43.4], [40.9, 46.7], [42.5, 49.7], [44.8, 52.3], [47.5, 54.5], [50.6, 56.1], [53.9, 57.1], [57.4, 57.4], [60.8, 57.0], [64.2, 55.9]], 14.6)
  // The dome: a drum with a glazed ring, then the shell (lidar ring 10.8,
  // crown 22.1).
  const K = 32
  const prof: [number, number][] = [[R0, 0], [R0, 9.2], [R0 + 0.4, 9.4], [R0 + 0.4, 10.8], [R0 - 0.2, 11.0], [R0 - 1.5, 14.5], [R0 - 4.2, 18.0], [R0 - 8.5, 20.8], [R0 - 13.5, 21.9], [0, 22.1]]
  for (let b = 0; b < prof.length - 1; b++) {
    const [r0, z0] = prof[b], [r1, z1] = prof[b + 1]
    const part = b === 0 ? win : white
    const er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez)
    for (let s = 0; s < K; s++) {
      const a0 = (s / K) * Math.PI * 2, a1 = ((s + 1) / K) * Math.PI * 2
      const P = (r: number, a: number, z: number): V3 => [DC[0] + r * Math.cos(a), DC[1] + r * Math.sin(a), z]
      const am = (a0 + a1) / 2
      const n: V3 = unit([(ez / l) * Math.cos(am), (ez / l) * Math.sin(am), -er / l])
      if (r1 === 0) tri(part, P(r0, a0, z0), P(r0, a1, z0), P(0, 0, z1), n)
      else quad(part, P(r0, a0, z0), P(r0, a1, z0), P(r1, a1, z1), P(r1, a0, z1), n)
    }
  }
}

// ----------------------------------------------------------- the arches ---
/**
 * One of the five arches: a square of four legs turned 45 degrees, a lancet
 * on each face springing at two thirds of the height, and the band of
 * tracery thickening toward the crown, inside the arch.
 */
const ARCH_SIDE = 8.3, ARCH_TOP = 37.9, LEG = 1.5
function arch(cx: number, cy: number) {
  const half = ARCH_SIDE / 2
  // corners of the square, turned 45 degrees (lidar)
  const C: V3[] = [0, 1, 2, 3].map((k) => {
    const a = Math.PI / 4 + (k * Math.PI) / 2 + Math.PI / 4
    return [cx + half * Math.SQRT2 * Math.cos(a), cy + half * Math.SQRT2 * Math.sin(a), 0]
  })
  const R = 1.6 * ARCH_SIDE, ZS = ARCH_TOP - Math.sqrt(R * R - (R - half) ** 2)
  // legs
  for (const c of C) {
    const d = unit([c[0] - cx, c[1] - cy, 0]), e: V3 = [-d[1], d[0], 0]
    const at = (u: number, v: number, z: number): V3 => [c[0] + d[0] * u + e[0] * v, c[1] + d[1] * u + e[1] * v, z]
    const sq: P2[] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
    for (let i = 0; i < 4; i++) {
      const [u0, v0] = sq[i], [u1, v1] = sq[(i + 1) % 4], hl = LEG / 2
      const n = unit(add(mul(d, u0 + u1), mul(e, v0 + v1)))
      quad(white, at(u0 * hl, v0 * hl, COURT_Z), at(u1 * hl, v1 * hl, COURT_Z), at(u1 * hl, v1 * hl, ZS), at(u0 * hl, v0 * hl, ZS), n)
    }
  }
  /** A rib along a lancet between corners A and B, its in-plane depth growing to `deep` at the crown. */
  const rib = (A: V3, B: V3, span: number, deep: number, K: number) => {
    const t = unit(sub(B, A)), n: V3 = unit(cross(t, [0, 0, 1])) // horizontal, across the face
    const Rr = 1.6 * span
    const rr = Math.sqrt(Rr * Rr - (Rr - span / 2) ** 2), zs = ARCH_TOP - rr
    // points along the two arcs, from A's springing to the apex to B's
    const pts: { u: number; z: number; w: number }[] = []
    const cR = span - Rr, cL = Rr // arc centres along u
    const angA = Math.acos((span / 2 - cR) / Rr)
    for (let i = 0; i <= K; i++) { const a = Math.PI - (angA * i) / K; pts.push({ u: cL + Rr * Math.cos(a), z: zs + Rr * Math.sin(Math.PI - a), w: i / K }) }
    for (let i = K - 1; i >= 0; i--) { const a = (angA * i) / K; pts.push({ u: cR + Rr * Math.cos(a), z: zs + Rr * Math.sin(a), w: i / K }) }
    const at = (u: number, z: number, s: number): V3 => add(add(A, mul(t, u)), add(mul(n, s), [0, 0, z]))
    for (let i = 0; i < pts.length - 1; i++) {
      const p = pts[i], q = pts[i + 1]
      const dp = 1.4 + (deep - 1.4) * p.w * p.w, dq = 1.4 + (deep - 1.4) * q.w * q.w
      // the rib's band hangs inward from the arc, deepening toward the crown
      const ip = (pt: { u: number; z: number }, d: number): [number, number] => {
        const cu = pt.u < span / 2 ? cL : cR, cz = zs
        const ru = cu - pt.u, rz = cz - pt.z, rl = Math.hypot(ru, rz)
        return [pt.u + (ru / rl) * d, pt.z + (rz / rl) * d]
      }
      const [pu2, pz2] = ip(p, dp), [qu2, qz2] = ip(q, dq)
      const hw = LEG / 2
      for (const s of [-hw, hw]) {
        const nn = mul(n, Math.sign(s))
        quad(white, at(p.u, p.z, s), at(q.u, q.z, s), at(qu2, qz2, s), at(pu2, pz2, s), nn)
      }
      // outer (extrados) and inner (intrados) faces
      const ext = unit(add(mul(t, -(q.z - p.z)), [0, 0, q.u - p.u]))
      quad(white, at(p.u, p.z, -hw), at(q.u, q.z, -hw), at(q.u, q.z, hw), at(p.u, p.z, hw), ext)
      quad(white, at(pu2, pz2, -hw), at(qu2, qz2, -hw), at(qu2, qz2, hw), at(pu2, pz2, hw), mul(ext, -1))
    }
  }
  for (let k = 0; k < 4; k++) rib(C[k], C[(k + 1) % 4], ARCH_SIDE, 2.6, 10)
}
for (const [x, y] of [[-17.5, 51.0], [-11.3, 38.5], [-23.5, 32.6], [-36.0, 26.8], [-30.3, 14.3]] as P2[]) arch(x, y)

// ---------------------------------------------------------------- output ---
// Yamasaki's white precast: walls and arches trim white, the relief a shade
// deeper (stone), roofs the library grey, arcades and the dome's ring dark glass.
const parts = [
  { part: white, material: PALETTE.trim },
  { part: relief, material: PALETTE.stone },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Pacific Science Center', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: ARCH_TOP,
})
await Bun.write(new URL('../models/sea-pacific-science-center.glb', import.meta.url), glb)
console.log(`sea-pacific-science-center.glb: ${triangles} triangles, ${glb.length} bytes`)
