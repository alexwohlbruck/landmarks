/**
 * The Neon Museum's visitor centre: the lobby of the La Concha Motel
 * (Paul Revere Williams, 1961), moved from the Strip in 2006. Three thin
 * concrete shells, each a pointed arch flaring up and out to a tip, meeting
 * in valleys that come down almost to the ground, with glass walls under
 * each arch. Procedural, CC0-1.0.
 * bun generators/lv-neon-museum.ts
 *
 * Map frame: x east, y north, z up, metres, built turned: three equal
 * shells round a centre, the front valley (between the two shells with the
 * doors) on -y. The placement bearing of 197° turns that valley to face
 * 17°, north-north-east, towards the car park: of OSM's three valleys that
 * is the one whose opposite shell sits off to one side, as the third shell
 * peeks out behind the right-hand one in both front photos. The origin is
 * the shells' centre, 0.8 m west and 0.6 m north of the area centroid of
 * OSM way/543178410 ("Neon Museum Gift Shop", name:historic "La Concha
 * Motel Lobby").
 *
 * Measured, from OSM way/543178410, the roof outline: three lobes, the
 * valleys between them about 5.7 m from the centre, the tips 7 to 12 m
 * out; drawn here as an even trefoil with the tips 9 m out, which also
 * matches the photos' ratio of tip spread to height (about 0.75).
 *
 * Published: Docomomo US register and Neon Museum, Googie, "a hyperbolic
 * paraboloid lobby of glass and thin concrete shell", about 1,100 sq ft
 * inside; the tallest point about 32 ft (9.8 m), as reported in the press
 * (Las Vegas Review-Journal).
 *
 * Measured from photos: the middle of the roof about half the tips' height,
 * the valleys coming down to about 1.5 m onto short piers, the glass under
 * each arch rising to about 9 m.
 *
 * Photos (Wikimedia Commons):
 * - p1 "La Concha Motel lobby.jpg", Carol M. Highsmith, public domain: the
 *   front, square on, on its original site;
 * - p2 "La Concha Motel, Las Vegas, Nevada.jpg", designmilk, CC BY-SA 2.0:
 *   the front at the Neon Museum, both front shells and the back one;
 * - p3 "Neon Museum - La Concha Motel.jpg" and p4 "La Concha Motel -
 *   Neon Museum.jpg", APK, CC BY-SA 4.0: the front lit at night, and one
 *   shell end on.
 *
 * Estimated: the shells' exact curvature (drawn as a ruled surface from a
 * central point to each rounded-pointed arch, sagged a little), the facing
 * (inferred, see above), the third shell's size (taken equal to the others;
 * no licensed photo shows it square on),
 * the shell's thickness (0.35 m). Left out: the boneyard signs, the
 * neighbouring museum building, the planting.
 */
import { Part, type V3 } from './mesh'
import { PALETTE } from './palette'
import { save, type XY } from './lv-wynn'

const shellTop = new Part()
const shellUnder = new Part()
const glass = new Part()

const H = 9.8 // the tips, 32 ft
const HC = 4.6 // the middle of the roof
const T = 0.35 // shell thickness
const C: XY = [0, 0]

/** A lobe: its arch's two feet (the valleys) and its tip, in plan. */
type Lobe = { a: XY; b: XY; tip: XY }
const V0: XY = [0, -5.7], V1: XY = [4.94, 2.85], V2: XY = [-4.94, 2.85]
const LOBES: Lobe[] = [
  { a: V0, b: V1, tip: [7.8, -4.5] },
  { a: V1, b: V2, tip: [0, 9.0] },
  { a: V2, b: V0, tip: [-7.8, -4.5] },
]

/**
 * The arch edge of a lobe, u from −1 (foot a) to 1 (foot b): the chord
 * pulled out towards the tip and lifted, pointed at the top and rising
 * steeply off the ground at the feet.
 */
function edge(l: Lobe, u: number): V3 {
  const s = (u + 1) / 2, w = 1 - Math.abs(u)
  const mx = (l.a[0] + l.b[0]) / 2, my = (l.a[1] + l.b[1]) / 2
  const out = 1 - u * u
  const x = l.a[0] + (l.b[0] - l.a[0]) * s + (l.tip[0] - mx) * out
  const y = l.a[1] + (l.b[1] - l.a[1]) * s + (l.tip[1] - my) * out
  return [x, y, 0.2 + (H - 0.2) * Math.pow(1 - Math.pow(Math.abs(u), 1.7), 0.75)]
}

/** The shell's upper surface: from the middle (t = 0) to the arch (t = 1), sagging a little between. */
function surf(l: Lobe, u: number, t: number): V3 {
  const e = edge(l, u)
  const w = 1 - Math.abs(u)
  const sag = 1.1 * Math.sin(Math.PI * t) * w
  return [C[0] + (e[0] - C[0]) * t, C[1] + (e[1] - C[1]) * t, HC + (e[2] - HC) * t - sag]
}

const NU = 16, NT = 6
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const down = (p: V3, d: number): V3 => [p[0], p[1], p[2] - d]

for (const l of LOBES) {
  const P = (i: number, k: number) => surf(l, -1 + (2 * i) / NU, k / NT)
  // Smooth normals from the surface's partial derivatives, pointing up.
  const N = (i: number, k: number): V3 => {
    const u = -1 + (2 * i) / NU, t = Math.max(0.02, k / NT), e = 1e-3
    const du = sub(surf(l, Math.min(1, u + e), t), surf(l, Math.max(-1, u - e), t))
    const dt = sub(surf(l, u, Math.min(1, t + e)), surf(l, u, t - e))
    let n = unit(cross(du, dt))
    if (n[2] < 0) n = [-n[0], -n[1], -n[2]]
    return n
  }
  for (let i = 0; i < NU; i++) {
    for (let k = 0; k < NT; k++) {
      const a = P(i, k), b = P(i + 1, k), c = P(i + 1, k + 1), d = P(i, k + 1)
      const na = N(i, k), nb = N(i + 1, k), nc = N(i + 1, k + 1), nd = N(i, k + 1)
      const up = cross(sub(b, a), sub(d, a))[2] >= 0
      if (up) {
        shellTop.tri(a, b, c, [0, 0], [0, 0], [0, 0], [na, nb, nc])
        shellTop.tri(a, c, d, [0, 0], [0, 0], [0, 0], [na, nc, nd])
      } else {
        shellTop.tri(a, c, b, [0, 0], [0, 0], [0, 0], [na, nc, nb])
        shellTop.tri(a, d, c, [0, 0], [0, 0], [0, 0], [na, nd, nc])
      }
      // The underside, the same surface T lower, facing down.
      const flip = (n: V3): V3 => [-n[0], -n[1], -n[2]]
      const A = down(a, T), B = down(b, T), Cc = down(c, T), D = down(d, T)
      if (up) {
        shellUnder.tri(A, Cc, B, [0, 0], [0, 0], [0, 0], [flip(na), flip(nc), flip(nb)])
        shellUnder.tri(A, D, Cc, [0, 0], [0, 0], [0, 0], [flip(na), flip(nd), flip(nc)])
      } else {
        shellUnder.tri(A, B, Cc, [0, 0], [0, 0], [0, 0], [flip(na), flip(nb), flip(nc)])
        shellUnder.tri(A, Cc, D, [0, 0], [0, 0], [0, 0], [flip(na), flip(nc), flip(nd)])
      }
    }
    // The shell's edge: a band T deep along the arch, facing out.
    const e0 = P(i, NT), e1 = P(i + 1, NT)
    const mid: V3 = [(e0[0] + e1[0]) / 2 - C[0], (e0[1] + e1[1]) / 2 - C[1], 0]
    const q = [e0, e1, down(e1, T), down(e0, T)]
    const n = cross(sub(q[1], q[0]), sub(q[3], q[0]))
    if (n[0] * mid[0] + n[1] * mid[1] >= 0) shellTop.quad(q[0], q[3], q[2], q[1])
    else shellTop.quad(q[0], q[1], q[2], q[3])
  }

  // Glass under the arch: from a curve on the ground, bulging out a third
  // of the way to the tip, up to the shell's underside 60% of the way out.
  const NG = 10, TG = 0.62
  const ground = (u: number): V3 => {
    const s = (u + 1) / 2, w = 1 - u * u
    const mx = (l.a[0] + l.b[0]) / 2, my = (l.a[1] + l.b[1]) / 2
    return [l.a[0] + (l.b[0] - l.a[0]) * s + (l.tip[0] - mx) * 0.3 * w, l.a[1] + (l.b[1] - l.a[1]) * s + (l.tip[1] - my) * 0.3 * w, 0]
  }
  for (let i = 0; i < NG; i++) {
    const u0 = -0.92 + (1.84 * i) / NG, u1 = -0.92 + (1.84 * (i + 1)) / NG
    const g0 = ground(u0), g1 = ground(u1), h0 = down(surf(l, u0, TG), T + 0.05), h1 = down(surf(l, u1, TG), T + 0.05)
    const n = cross(sub(g1, g0), sub(h0, g0))
    const out: V3 = [(g0[0] + g1[0]) / 2 - C[0], (g0[1] + g1[1]) / 2 - C[1], 0]
    if (n[0] * out[0] + n[1] * out[1] >= 0) glass.quad(g0, g1, h1, h0)
    else glass.quad(g0, h0, h1, g1)
  }
}

// Short piers under the three valleys, where the shells come down.
for (const [x, y] of [V0, V1, V2]) {
  const r = 0.45, seg = 8
  const ring = (z: number): V3[] => Array.from({ length: seg }, (_, k) => [x + Math.cos((k / seg) * 2 * Math.PI) * r, y + Math.sin((k / seg) * 2 * Math.PI) * r, z] as V3)
  shellUnder.loft([ring(0), ring(1.0)])
}

await save('lv-neon-museum', 'Neon Museum (La Concha lobby)', [
  { part: shellTop, material: PALETTE.trim },
  { part: shellUnder, material: PALETTE.stone },
  { part: glass, material: PALETTE.window },
], H, 'Y up, -Z north, +X east, metres; origin at the centroid of way/543178410; the front valley looks -Y before the bearing', 5000)
