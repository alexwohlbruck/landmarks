/**
 * Kresge Auditorium (MIT Building W16), Cambridge MA: original procedural
 * geometry, CC0-1.0.
 * bun generators/bos-mit-kresge-auditorium.ts
 *
 * Eero Saarinen, 1955. A thin concrete shell that is exactly one eighth of
 * a sphere, turned so the octant's axis is vertical: it stands on three
 * points 120° apart, and its three edges are great-circle arcs that rise
 * between the supports and bow outward in plan. Glass curtain walls fill
 * the arches under the edges; the shell is clad in copper, weathered pale
 * green, with a slim pale concrete edge beam.
 *
 * Frame: map frame, bearing 0 (x east, y north, z up, metres). Origin = the
 * anchor, the centroid of OSM way/24494029.
 *
 * Geometry (measured, USGS 3DEP lidar MA_CentralEastern_1_2021, 2021
 * flight, 0.5 m grid): a least-squares sphere through the roof returns
 * within 15 m of the middle gives R 34.73 m (rms 0.04 m), centred at plan
 * (-0.41, -1.90) and 19.59 m below y = 0. Published: radius 112 ft
 * (34.1 m) (Wikipedia, "Kresge Auditorium"). y = 0 is the lowest ground
 * round the footprint (lidar ground 2.85 m over the box's ground_min, the
 * site is flat to ±0.15 m). That puts the octant's corners 0.46 m up (on
 * short abutments), the apex 15.1 m up (OSM: height 16.1, which includes
 * the ~1 m brick terrace), and the edge arcs' crowns 8.8 m up. The corner
 * directions, 85.2°, 205.2° and 325.2° from +x, are the means of OSM's
 * three corners about the sphere's centre (each within 2.5° of 120°
 * spacing); OSM's outline bows out 5.5 m mid-edge, the exact octant's
 * great circles 5.9 m.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - "Kresge Auditorium, MIT (view with Green Building).JPG", Daderot,
 *    CC BY-SA 3.0 (the shell, glass wall, edge beam and colours):
 *    https://commons.wikimedia.org/wiki/File:Kresge_Auditorium,_MIT_(view_with_Green_Building).JPG
 *  - "MIT Chapel Kresge Auditorium aerial.JPG", Nick Allen, CC BY-SA 4.0
 *    (from above: the copper, the dark disc round the apex, the glass
 *    walls under the arches):
 *    https://commons.wikimedia.org/wiki/File:MIT_Chapel_Kresge_Auditorium_aerial.JPG
 *  - "MIT Kresge Auditorium (8223258618).jpg", Aleksandr Zykov, CC BY-SA
 *    2.0 (from the north-west across the lawn):
 *    https://commons.wikimedia.org/wiki/File:MIT_Kresge_Auditorium_(8223258618).jpg
 *  No look-only sources. No commercial imagery.
 *
 * Estimated: the shell's drawn thickness at the edge (0.7 m, the edge beam
 * as it reads in the photos; the real shell is 3.5 in); the glass walls'
 * set-back under the edge (0.8 m); the dark disc round the apex (r 6 m, a filled disc with radial seams,
 * from the aerial); the abutments.
 *
 * Not modelled: the brick terrace and steps round the base (ground, left to
 * the map), the lamps under the edge beam, the mullions.
 *
 * Night: the glass walls glow (Daderot's night photo); the shell is unlit.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { save } from './atl-flatiron-building'

const shell = new Part(), edge = new Part(), win = new Part(), ring = new Part()

const R = 34.73, CX = -0.41, CY = -1.9, CZ = -19.59
const PHI = [85.2, 205.2, 325.2].map((d) => (d * Math.PI) / 180)
const s3 = Math.sqrt(2 / 3), c3 = Math.sqrt(1 / 3)
const U: V3[] = PHI.map((p) => [s3 * Math.cos(p), s3 * Math.sin(p), c3])

const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2])
  return [v[0] / l, v[1] / l, v[2] / l]
}
/** The unit direction at barycentric (a, b, c) of the octant. */
const dir = (a: number, b: number, c: number): V3 =>
  norm([a * U[0][0] + b * U[1][0] + c * U[2][0], a * U[0][1] + b * U[1][1] + c * U[2][1], a * U[0][2] + b * U[1][2] + c * U[2][2]])
const on = (d: V3, r: number): V3 => [CX + d[0] * r, CY + d[1] * r, CZ + d[2] * r]
const neg = (v: V3): V3 => [-v[0], -v[1], -v[2]]

// ── The shell: the octant's outer (copper) and inner (soffit) surfaces ──
const N = 16, T = 0.7
for (let i = 0; i < N; i++) {
  for (let j = 0; j < N - i; j++) {
    const k = N - i - j
    const tri = (p: [number, number, number][]) => {
      const ds = p.map(([a, b, c]) => dir(a / N, b / N, c / N))
      shell.tri(on(ds[0], R), on(ds[1], R), on(ds[2], R), undefined, undefined, undefined, ds)
      edge.tri(on(ds[0], R - T), on(ds[2], R - T), on(ds[1], R - T), undefined, undefined, undefined, [neg(ds[0]), neg(ds[2]), neg(ds[1])])
    }
    tri([[i, j, k], [i + 1, j, k - 1], [i, j + 1, k - 1]])
    if (k - 1 > 0 && j + 1 <= N - i - 1) {
      const k2 = N - (i + 1) - (j + 1)
      if (k2 >= 0) tri([[i + 1, j, k - 1], [i + 1, j + 1, k2], [i, j + 1, k - 1]])
    }
  }
}

// ── The edge beams and the glass walls under each arch ──
const M = 24
for (let e = 0; e < 3; e++) {
  const A = U[e], B = U[(e + 1) % 3]
  // the outward normal of this edge's great-circle plane (pointing away from the third corner)
  const third = U[(e + 2) % 3]
  let pn: V3 = norm([A[1] * B[2] - A[2] * B[1], A[2] * B[0] - A[0] * B[2], A[0] * B[1] - A[1] * B[0]])
  if (pn[0] * third[0] + pn[1] * third[1] + pn[2] * third[2] > 0) pn = neg(pn)
  const pts: V3[] = Array.from({ length: M + 1 }, (_, t) => norm([A[0] + (B[0] - A[0]) * (t / M), A[1] + (B[1] - A[1]) * (t / M), A[2] + (B[2] - A[2]) * (t / M)]))
  for (let t = 0; t < M; t++) {
    const a0 = on(pts[t], R), a1 = on(pts[t + 1], R), b0 = on(pts[t], R - T), b1 = on(pts[t + 1], R - T)
    edge.tri(a0, b0, b1, undefined, undefined, undefined, [pn, pn, pn])
    edge.tri(a0, b1, a1, undefined, undefined, undefined, [pn, pn, pn])
  }
  // The glass wall: vertical, 0.8 m in from the edge in plan, up to the soffit.
  const IN = 0.8
  const wallPts = pts.slice(1, M).map((d) => {
    const p = on(d, R - T)
    const r = Math.hypot(p[0] - CX, p[1] - CY), k = (r - IN) / r
    const x = CX + (p[0] - CX) * k, y = CY + (p[1] - CY) * k
    const z = CZ + Math.sqrt((R - T) ** 2 - (r - IN) ** 2)
    return [x, y, z] as V3
  })
  for (let t = 0; t < wallPts.length - 1; t++) {
    const p = wallPts[t], q = wallPts[t + 1]
    const o: V3 = norm([pn[0], pn[1], 0])
    win.tri([p[0], p[1], 0], [q[0], q[1], 0], [q[0], q[1], q[2] + 0.05], undefined, undefined, undefined, [o, o, o])
    win.tri([p[0], p[1], 0], [q[0], q[1], q[2] + 0.05], [p[0], p[1], p[2] + 0.05], undefined, undefined, undefined, [o, o, o])
  }
}

// ── The three abutments under the corners ──
for (const u of U) {
  const p = on(u, R - T / 2)
  const r = Math.hypot(p[0] - CX, p[1] - CY), ux = (p[0] - CX) / r, uy = (p[1] - CY) / r
  const vx = -uy, vy = ux, w = 0.9, l = 1.6
  const q = (s: number, t: number, z: number): V3 => [p[0] - ux * s + vx * t, p[1] - uy * s + vy * t, z]
  const zt = p[2] + 0.3
  const ring4 = [q(-0.2, -w, 0), q(l, -w, 0), q(l, w, 0), q(-0.2, w, 0)]
  for (let i = 0; i < 4; i++) {
    const a = ring4[i], b = ring4[(i + 1) % 4]
    edge.quad(b, a, [a[0], a[1], zt], [b[0], b[1], zt])
  }
}

// ── The dark disc round the apex (aerial) ──
{
  const n = 24, rs = [0, 2, 4, 6]
  const zr = (r: number) => CZ + Math.sqrt(R * R - r * r) + 0.05
  const P = (r: number, t: number): V3 => [CX + r * Math.cos(t), CY + r * Math.sin(t), zr(r)]
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, b = ((i + 1) / n) * Math.PI * 2
    ring.tri(P(0, a), P(rs[1], a), P(rs[1], b))
    for (let k = 1; k < rs.length - 1; k++) ring.quad(P(rs[k], a), P(rs[k + 1], a), P(rs[k + 1], b), P(rs[k], b))
  }
}

await save('bos-mit-kresge-auditorium', 'Kresge Auditorium', [
  { part: shell, material: finish('kresge-copper', 0x8fb2a6) },
  { part: edge, material: finish('kresge-concrete', 0xe4d9c4) },
  { part: ring, material: finish('kresge-ring', 0x637c86) },
  { part: win, material: PALETTE.window },
], { height: 15.14, anchor: [42.35815, -71.09505], bearing: 0 })
