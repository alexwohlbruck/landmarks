/**
 * The Spheres (2018, NBBJ), Amazon's conservatories, Seattle — original
 * procedural geometry, CC0-1.0.
 * bun generators/sea-amazon-spheres.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the OSM
 * outline's area centroid, -122.3394654, 47.6156630) on the lowest ground
 * under the footprint (28.9 m NAVD88, at the 6th Avenue / Lenora Street
 * corner; the south-west sphere stands about 4 m higher). Bearing 0.
 *
 * Form: three intersecting glass spheres, each a steel-framed pentagonal
 * hexecontahedron cut off below its equator. Drawn as faceted glass (a
 * geodesic sphere of 180 flat facets each) carrying the frame's main steel
 * members: the pentagonal net of the hexecontahedron's 60 faces, as raised
 * silver strips 0.85 m wide (the finer sub-triangulation inside each
 * pentagon is left out), plus bold seams where the spheres meet.
 *
 * Sources
 * - OSM: outline way/868099742; parts way/491817111 (the large sphere),
 *   way/398816077 (north-east), way/491817110 (south-west). Centres and radii
 *   by least-squares circle fits to their outlines: large (-3.8, -0.5)
 *   r 19.7 m; north-east (13.8, 12.1) r 15.1 m; south-west (-10.9, -18.2)
 *   r 12.8 m.
 * - Lidar (measured, USGS 3DEP WA_KingCo_1_2021, above 28.9 m NAVD88; glass
 *   gives sparse returns): tops 28.4 m (large), 24.4 m (north-east),
 *   22.5 m (south-west).
 * - Published: the largest sphere is 90 ft (27 m) tall and 130 ft (40 m)
 *   across; frame a pentagonal hexecontahedron (Wikipedia, "The Spheres").
 * - Photos (Wikimedia Commons): Sea Cow 2022 (from above, from the west and
 *   north-west), SounderBruce 2020 (from 6th Avenue), Biodin 2018, Joe Mabel.
 * Estimated: the net is an even-edged pentagonal net (the real
 *   hexecontahedron has long and short edges), turned arbitrarily per
 *   sphere; the glass under it is a geodesic sphere, the seams'
 *   width (1 m), the glass colour (pale silver-green of glass plus white
 *   steel, from the photos).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { emit, finishGlb } from './sea-two-union-square'

type M3 = number[] // row-major 3x3
const mul = (a: M3, b: M3): M3 => Array.from({ length: 9 }, (_, k) => { const i = Math.floor(k / 3), j = k % 3; return a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j] })
const app = (m: M3, v: V3): V3 => [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]]
const unit = (v: V3): V3 => { const l = Math.hypot(...v); return [v[0] / l, v[1] / l, v[2] / l] }
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
function rot(axis: V3, ang: number): M3 {
  const [x, y, z] = unit(axis), c = Math.cos(ang), s = Math.sin(ang), t = 1 - c
  return [t * x * x + c, t * x * y - s * z, t * x * z + s * y, t * x * y + s * z, t * y * y + c, t * y * z - s * x, t * x * z - s * y, t * y * z + s * x, t * z * z + c]
}

/**
 * A geodesic sphere on the unit sphere: an icosahedron with each face cut
 * into `n` x `n` triangles and pushed out to the sphere. Even facets of
 * about 7 m on the large sphere, which read as the frame's faceting.
 */
function geodesic(n: number): V3[][] {
  const phi = (1 + Math.sqrt(5)) / 2
  const V: V3[] = [[-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0], [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi], [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]].map((v) => unit(v as V3))
  const F = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]]
  const out: V3[][] = []
  for (const [ia, ib, ic] of F) {
    const A = V[ia], B = V[ib], C = V[ic]
    const P = (i: number, j: number): V3 => {
      const u = i / n, v = j / n, w = 1 - u - v
      return unit([A[0] * w + B[0] * u + C[0] * v, A[1] * w + B[1] * u + C[1] * v, A[2] * w + B[2] * u + C[2] * v])
    }
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n - i; j++) {
        out.push([P(i, j), P(i + 1, j), P(i, j + 1)])
        if (i + j < n - 1) out.push([P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)])
      }
  }
  return out
}

/**
 * The edges of a pentagonal hexecontahedron's 60 faces, on the unit sphere:
 * the dual of the hull of a 60-point orbit of the icosahedral rotation
 * group. The orbit point was fitted (a small search) so that every edge
 * comes out the same length once pushed to the sphere: an even pentagonal
 * net, the Spheres' main steel members.
 */
function pentagonNet(): [V3, V3][] {
  const phi = (1 + Math.sqrt(5)) / 2
  const g5 = rot([0, 1, phi], (2 * Math.PI) / 5), g3 = rot([1, 1, 1], (2 * Math.PI) / 3)
  const group: M3[] = [[1, 0, 0, 0, 1, 0, 0, 0, 1]]
  const key = (m: number[]) => m.map((x) => Math.round(x * 1e4)).join(',')
  const seen = new Set([key(group[0])])
  for (let i = 0; i < group.length; i++)
    for (const g of [g5, g3]) {
      const m = mul(g, group[i])
      if (!seen.has(key(m))) { seen.add(key(m)); group.push(m) }
    }
  const pts = group.map((m) => app(m, unit([0.3545, 0.1095, 0.9286])))
  const planes: { n: V3; verts: Set<number> }[] = []
  for (let i = 0; i < 60; i++)
    for (let j = i + 1; j < 60; j++)
      for (let k = j + 1; k < 60; k++) {
        let n = crs(sub(pts[j], pts[i]), sub(pts[k], pts[i]))
        const l = Math.hypot(...n)
        if (l < 1e-9) continue
        n = [n[0] / l, n[1] / l, n[2] / l]
        let d = dot(n, pts[i])
        if (d < 0) { n = [-n[0], -n[1], -n[2]]; d = -d }
        if (!pts.every((q) => dot(n, q) <= d + 1e-7)) continue
        let pl = planes.find((q) => dot(q.n, n) > 1 - 1e-7)
        if (!pl) { pl = { n, verts: new Set() }; planes.push(pl) }
        pl.verts.add(i).add(j).add(k)
      }
  // a hull edge (two orbit points sharing two facets) is a net edge between those facets' poles
  const edges: [V3, V3][] = []
  for (let a = 0; a < planes.length; a++)
    for (let b = a + 1; b < planes.length; b++) {
      let shared = 0
      for (const v of planes[a].verts) if (planes[b].verts.has(v)) shared++
      if (shared >= 2) edges.push([planes[a].n, planes[b].n])
    }
  return edges
}

type Sphere = { c: V3; R: number; turn: number }

function build() {
  const glass = new Part(), steel = new Part(), web = new Part()
  const TOP = { big: 28.4, ne: 24.4, sw: 22.5 }
  const S: Sphere[] = [
    { c: [-3.8, -0.5, TOP.big - 19.7], R: 19.7, turn: 0.0 },
    { c: [13.8, 12.1, TOP.ne - 15.1], R: 15.1, turn: 0.7 },
    { c: [-10.9, -18.2, TOP.sw - 12.8], R: 12.8, turn: 1.9 },
  ]
  const faces = geodesic(3), rmax = 1
  const insideOther = (p: V3, self: Sphere) => S.some((o) => o !== self && Math.hypot(...sub(p, o.c)) < o.R - 0.05)

  for (const s of S) {
    const m = mul(rot([0, 0, 1], s.turn), rot([1, 0.3, 0], 0.4 + s.turn))
    for (const f of faces) {
      let poly = f.map((p) => { const q = app(m, p); return [s.c[0] + (q[0] * s.R) / rmax, s.c[1] + (q[1] * s.R) / rmax, s.c[2] + (q[2] * s.R) / rmax] as V3 })
      if (poly.every((p) => insideOther(p, s))) continue
      // cut off below the ground (z = 0)
      const out: V3[] = []
      for (let i = 0; i < poly.length; i++) {
        const a = poly[i], b = poly[(i + 1) % poly.length]
        if (a[2] >= 0) out.push(a)
        if ((a[2] >= 0) !== (b[2] >= 0)) { const t = a[2] / (a[2] - b[2]); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 0]) }
      }
      poly = out
      if (poly.length < 3) continue
      // wind outward
      const n = crs(sub(poly[1], poly[0]), sub(poly[2], poly[0]))
      if (dot(n, sub(poly[0], s.c)) < 0) poly.reverse()
      for (let i = 1; i < poly.length - 1; i++) glass.tri(poly[0], poly[i], poly[i + 1])
    }
  }

  // the steel web: each net edge as a raised strip over the glass, a shallow
  // tent in section so it meets the glass with no gap, smooth-shaded
  const net = pentagonNet(), WEB = 0.42, SEG = 3
  for (const s of S) {
    const m = mul(rot([0, 0, 1], s.turn), rot([1, 0.3, 0], 0.4 + s.turn))
    for (const [a0, b0] of net) {
      const a = app(m, a0), b = app(m, b0)
      for (let k = 0; k < SEG; k++) {
        const P = (t: number): V3 => unit([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t])
        const u0 = P(k / SEG), u1 = P((k + 1) / SEG), um = P((k + 0.5) / SEG)
        const at = (u: V3, r: number): V3 => [s.c[0] + u[0] * r, s.c[1] + u[1] * r, s.c[2] + u[2] * r]
        const mp = at(um, s.R)
        if (mp[2] < 0.2 || insideOther(mp, s)) continue
        const along = unit(sub(u1, u0)), side = (u: V3) => unit(crs(u, along))
        const pt = (u: V3, off: number, r: number): V3 => { const sd = side(u); return at(unit([u[0] + sd[0] * off / s.R, u[1] + sd[1] * off / s.R, u[2] + sd[2] * off / s.R]), r) }
        const L0 = pt(u0, -WEB, s.R - 0.05), C0 = at(u0, s.R + 0.3), R0 = pt(u0, WEB, s.R - 0.05)
        const L1 = pt(u1, -WEB, s.R - 0.05), C1 = at(u1, s.R + 0.3), R1 = pt(u1, WEB, s.R - 0.05)
        if ([L0, R0, L1, R1].some((q) => q[2] < 0)) continue
        const n0 = u0, n1 = u1
        // winding: outward is +u; L is on the -side
        const quad = (p: V3, q: V3, r: V3, t: V3) => {
          const n = crs(sub(q, p), sub(r, p))
          if (dot(n, um) < 0) { web.tri(p, r, q, undefined, undefined, undefined, [n0, n1, n0]); web.tri(p, t, r, undefined, undefined, undefined, [n0, n1, n1]) }
          else { web.tri(p, q, r, undefined, undefined, undefined, [n0, n0, n1]); web.tri(p, r, t, undefined, undefined, undefined, [n0, n1, n1]) }
        }
        quad(L0, C0, C1, L1)
        quad(C0, R0, R1, C1)
      }
    }
  }

  // the seams: where two spheres meet, a bold pale steel rib along the circle
  for (let a = 0; a < S.length; a++)
    for (let b = a + 1; b < S.length; b++) {
      const A = S[a], B = S[b], D = sub(B.c, A.c), d = Math.hypot(...D)
      if (d >= A.R + B.R) continue
      const u = unit(D), x = (d * d + A.R * A.R - B.R * B.R) / (2 * d), r = Math.sqrt(A.R * A.R - x * x)
      const c: V3 = [A.c[0] + u[0] * x, A.c[1] + u[1] * x, A.c[2] + u[2] * x]
      const e1 = unit(crs(u, [0, 0, 1])), e2 = crs(u, e1)
      const N = 48, W = 0.5, H = 0.6
      let run: V3[][] = []
      const flush = () => { if (run.length > 1) steel.sweep(run); run = [] }
      for (let k = 0; k <= N; k++) {
        const t = (2 * Math.PI * k) / N
        const radial: V3 = [e1[0] * Math.cos(t) + e2[0] * Math.sin(t), e1[1] * Math.cos(t) + e2[1] * Math.sin(t), e1[2] * Math.cos(t) + e2[2] * Math.sin(t)]
        const p: V3 = [c[0] + radial[0] * r, c[1] + radial[1] * r, c[2] + radial[2] * r]
        const third = S.find((o) => o !== A && o !== B)!
        if (p[2] < 0.3 || Math.hypot(...sub(p, third.c)) < third.R) { flush(); continue }
        // a square section: across the seam (along u) and out from it
        const q = (s: number, h: number): V3 => [p[0] + u[0] * s + radial[0] * h, p[1] + u[1] * s + radial[1] * h, p[2] + u[2] * s + radial[2] * h]
        run.push([q(-W, -0.2), q(W, -0.2), q(W, H), q(-W, H)])
      }
      flush()
    }

  return finishGlb('The Spheres', [
    { part: glass, material: { ...PALETTE.glass, color: 0xb2c4c4 } },
    { part: web, material: finish('spheres-web', 0xdfe2de, 0.6) },
    { part: steel, material: finish('spheres-steel', 0xeef0ec, 0.6) },
  ], { bearing: 0, height: TOP.big, replaces: REPLACES })
}

const REPLACES = ['way/868099742', 'way/491817111', 'way/398816077', 'way/491817110']

if (import.meta.main) await emit('sea-amazon-spheres', build())
