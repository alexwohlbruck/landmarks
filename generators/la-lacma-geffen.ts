/**
 * LACMA David Geffen Galleries (Peter Zumthor with SOM, opened April 2026),
 * Wilshire Boulevard, Los Angeles — original procedural geometry, CC0-1.0.
 * bun generators/la-lacma-geffen.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the area centroid of
 * the OSM outline way/1352498524 (-118.3577537, 34.0629495), on the lowest
 * ground under it (the west lobe, 3DEP ~51 m; Wilshire under the bridge is
 * ~53 m, the east end ~54 m). Bearing 0: the plan is free-form, so it is
 * drawn north-up straight from OSM.
 *
 * One long, amoeba-shaped gallery floor, glass all round, under a deeply
 * overhanging flat concrete roof with a rounded edge, lifted 30 ft on seven
 * concrete pavilions and bridging Wilshire. The identity is the floating,
 * curving pale slab over a dark glass band, with open shade underneath.
 *
 * Sources:
 * - Plan: OSM way/1352498524 (the roof edge, 15,490 m2, mapped 2026) and its
 *   parts. The seven pavilions are the building:part ways 1352498494 (with
 *   503, 504 inside it), 495 (526 duplicates it), 497 (+496), 498, 499, 500,
 *   and 502 south of Wilshire. OSM's slab part 1352498501 is a coarse polygon
 *   that crosses the roof edge in places, so the glass line is drawn as the
 *   roof outline inset by a uniform overhang instead.
 * - Published (Wikipedia; ArchDaily 1040778; Architectural Record 18145):
 *   ~900 ft long, single gallery level, exhibition floor "30 feet above
 *   street level", seven pavilions, floor-to-ceiling glass on all sides,
 *   sand-coloured concrete, a flat roof with a deep overhang.
 * - Photos (Wikimedia Commons, ArchEyes Magazine, CC BY 4.0, 2026):
 *   g5 "LACMA-Exterior-View-ROLM-ArchEyes-5" (the west lobe's rounded nose
 *   from the south-west plaza: roof rim, glass band, floor band, pavilion);
 *   g3 "...-3" (under the overhang, looking along the south-west side);
 *   g4 "...-4" and g9 "...-9" (the north side from 6th St / the park);
 *   g1 "..._-_55107256431" and g2 "...-2" (from Wilshire & Fairfax's corner,
 *   the long south face behind Urban Light); g6 "...-6" (the south pavilion
 *   arm south of Wilshire).
 * - Heights: lidar (LARIAC 2020) predates the building. Floor top is 30 ft
 *   above Wilshire (53 m) = 11.3 m above the lowest ground; the floor band,
 *   glass band and roof rim are read off g5 against the 30 ft clearance
 *   (glass ~0.6 of the clearance, rim ~0.2, floor band ~0.15).
 *
 * Estimated: the overhang (7 m roof edge to glass, uniform; g3, g5), the
 * floor band set 1 m out from the glass, the pavilions' glazed panels.
 * Left out: the brass mullions, the perforated vents in the pavilions, the
 * stairs down the north side (g4), the concrete roof's mechanical kit.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

export type XY = [number, number]

// ---------------------------------------------------------------- helpers
// Shared by the Miracle Mile models (la-petersen, la-academy-museum); the
// model below only builds when this file is run directly.

export const area = (P: XY[]) => P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
/** Counter-clockwise from above, without the closing duplicate. */
export function ccw(P: XY[]): XY[] {
  let Q = P.slice()
  const a = Q[0], b = Q[Q.length - 1]
  if (a[0] === b[0] && a[1] === b[1]) Q.pop()
  return area(Q) < 0 ? Q.reverse() : Q
}

/** Ear clipping for a simple counter-clockwise polygon. */
export function earcut(P: XY[]): [number, number, number][] {
  const idx = P.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 100000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i = idx[(k + idx.length - 1) % idx.length], j = idx[k], l = idx[(k + 1) % idx.length]
      if (cr(P[i], P[j], P[l]) <= 1e-9) continue
      if (idx.some(m => m !== i && m !== j && m !== l && inside(P[m], P[i], P[j], P[l]))) continue
      out.push([i, j, l]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) { // degenerate leftovers: fan them
      for (let k = 1; k < idx.length - 1; k++) out.push([idx[0], idx[k], idx[k + 1]])
      return out
    }
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}

/** Uniform points every ~`step` m round a closed ring. */
export function resample(P: XY[], step: number): XY[] {
  const L: number[] = [0]
  for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1])) }
  const total = L[P.length], n = Math.max(8, Math.round(total / step)), out: XY[] = []
  let s = 0
  for (let k = 0; k < n; k++) {
    const t = (k / n) * total
    while (L[s + 1] < t) s++
    const a = P[s], b = P[(s + 1) % P.length], f = (t - L[s]) / (L[s + 1] - L[s] || 1)
    out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f])
  }
  return out
}

/** Laplacian smoothing of a closed ring. */
export function smooth(P: XY[], iters = 2, w = 0.5): XY[] {
  let Q = P
  for (let it = 0; it < iters; it++) Q = Q.map((p, i) => {
    const a = Q[(i + Q.length - 1) % Q.length], b = Q[(i + 1) % Q.length]
    return [p[0] * (1 - w) + (a[0] + b[0]) * w / 2, p[1] * (1 - w) + (a[1] + b[1]) * w / 2] as XY
  })
  return Q
}

/** Move each vertex of a CCW ring inward by `d` (outward if negative), mitred. */
export function offset(P: XY[], d: number): XY[] {
  const n = P.length
  return P.map((p, i) => {
    const a = P[(i + n - 1) % n], b = P[(i + 1) % n]
    const e1 = norm([p[0] - a[0], p[1] - a[1]]), e2 = norm([b[0] - p[0], b[1] - p[1]])
    const n1: XY = [-e1[1], e1[0]], n2: XY = [-e2[1], e2[0]] // inward normals of a CCW ring
    const m = norm([n1[0] + n2[0], n1[1] + n2[1]])
    const c = Math.max(0.35, m[0] * n1[0] + m[1] * n1[1])
    return [p[0] + m[0] * d / c, p[1] + m[1] * d / c] as XY
  })
}
const norm = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

export const at = (p: XY, z: number): V3 => [p[0], p[1], z]

/** Flat cap over a CCW ring at height z, facing up or down. */
export function capRing(part: Part, R: XY[], z: number, up: boolean) {
  for (const [i, j, k] of earcut(R)) {
    if (up) part.tri(at(R[i], z), at(R[j], z), at(R[k], z), undefined, undefined, undefined, [[0, 0, 1], [0, 0, 1], [0, 0, 1]])
    else part.tri(at(R[k], z), at(R[j], z), at(R[i], z), undefined, undefined, undefined, [[0, 0, -1], [0, 0, -1], [0, 0, -1]])
  }
}

/**
 * Smooth-shaded band between rings of equal vertex count (a lofted wall);
 * normals are horizontal, from the ring's outward direction, unless `flat`.
 */
export function band(part: Part, A: XY[], za: number, B: XY[], zb: number, nz = 0) {
  const n = A.length
  const outN = (R: XY[], i: number): V3 => {
    const a = R[(i + n - 1) % n], b = R[(i + 1) % n], t = norm([b[0] - a[0], b[1] - a[1]])
    const h = Math.sqrt(1 - nz * nz)
    return [t[1] * h, -t[0] * h, nz]
  }
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a0 = at(A[i], za), a1 = at(A[j], za), b1 = at(B[j], zb), b0 = at(B[i], zb)
    const na = outN(A, i), nb = outN(A, j)
    part.tri(a0, a1, b1, undefined, undefined, undefined, [na, nb, nb])
    part.tri(a0, b1, b0, undefined, undefined, undefined, [na, nb, na])
  }
}

/** Flat ring between an outer and inner CCW ring of equal count, facing up or down. */
export function annulus(part: Part, O: XY[], I: XY[], z: number, up: boolean, zi = z) {
  const n = O.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    if (up) part.quad(at(O[i], z), at(O[j], z), at(I[j], zi), at(I[i], zi))
    else part.quad(at(O[j], z), at(O[i], z), at(I[i], zi), at(I[j], zi))
  }
}

/**
 * A straight-walled block over a CCW ring from z0 to z1, with a chamfered
 * lip of `bev` at the top and a flat roof in `roofPart`.
 */
export function block(wall: Part, roofPart: Part, R: XY[], z0: number, z1: number, bev = 0.4) {
  const n = R.length
  for (let i = 0; i < n; i++) {
    const a = R[i], b = R[(i + 1) % n]
    wall.quad(at(a, z0), at(b, z0), at(b, z1 - bev), at(a, z1 - bev))
  }
  const I = offset(R, bev)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    wall.quad(at(R[i], z1 - bev), at(R[j], z1 - bev), at(I[j], z1), at(I[i], z1))
  }
  capRing(roofPart, I, z1, true)
}

/**
 * A flat panel on the outside of edge a→b of a CCW ring, from s0 to s1 along
 * it (metres from a) and z0 to z1, `d` proud of the wall.
 */
export function panel(part: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, d = 0.05) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o: XY = [t[1], -t[0]]
  const p = (s: number): XY => [a[0] + t[0] * s + o[0] * d, a[1] + t[1] * s + o[1] * d]
  part.quad(at(p(s0), z0), at(p(s1), z0), at(p(s1), z1), at(p(s0), z1))
}

export function finishModel(id: string, name: string, parts: { part: Part; material: any }[], extras: Record<string, unknown>, budget = 5000) {
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > budget) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(name, parts.filter(p => p.part.triangles > 0), {
    license: 'CC0-1.0', elevation: 0,
    frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground', ...extras,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  return { glb, triangles }
}

// ---------------------------------------------------------------- the model

const OUTLINE: XY[] = [[-87.67, 98.66], [-85.06, 99.65], [-81.69, 100.22], [-79.26, 99.94], [-77.48, 99.0], [-75.97, 97.98], [-30.14, 63.63], [-27.98, 62.7], [-24.24, 62.05], [-21.52, 63.44], [-4.55, 79.64], [-1.74, 81.13], [1.17, 80.94], [4.91, 79.83], [7.45, 78.06], [11.1, 72.94], [12.51, 68.93], [16.82, 39.7], [17.94, 26.39], [19.25, 20.34], [21.13, 16.89], [24.51, 14.0], [27.01, 13.03], [27.88, 12.7], [31.63, 12.33], [34.82, 12.7], [63.78, 20.8], [67.15, 21.17], [69.96, 20.61], [72.21, 19.22], [73.99, 16.89], [80.46, -2.57], [81.49, -6.94], [82.24, -17.74], [82.24, -28.64], [82.17, -34.21], [82.15, -35.28], [81.4, -41.67], [80.72, -45.44], [80.09, -48.94], [78.14, -55.7], [75.15, -66.14], [73.99, -70.16], [70.62, -80.38], [69.08, -85.04], [66.12, -94.0], [62.37, -104.15], [57.4, -118.39], [55.25, -121.18], [53.28, -122.86], [50.09, -123.32], [46.35, -123.32], [24.79, -119.13], [15.04, -116.24], [10.26, -113.73], [6.42, -110.85], [4.26, -107.77], [3.6, -105.16], [3.98, -101.81], [5.01, -98.74], [6.51, -95.77], [26.87, -66.35], [30.28, -61.42], [34.16, -55.83], [35.43, -52.53], [35.84, -51.45], [36.6, -47.44], [36.69, -43.82], [36.38, -41.82], [35.84, -38.41], [33.79, -33.76], [31.79, -31.07], [30.88, -29.85], [25.44, -25.75], [12.83, -19.33], [4.07, -14.87], [-25.13, 0.01], [-54.43, 14.93], [-61.68, 18.84], [-64.33, 20.27], [-73.27, 26.64], [-74.24, 27.34], [-79.3, 32.79], [-88.88, 45.51], [-97.06, 58.67], [-99.87, 66.58], [-100.51, 71.18], [-100.35, 75.78], [-99.6, 81.08], [-97.94, 86.78], [-95.73, 90.88], [-93.24, 93.91], [-90.83, 96.59], [-87.67, 98.66]]

// The seven pavilions (OSM building:part outlines).
const PAVILIONS: XY[][] = [
  [[-79.53, 83.83], [-89.7, 75.47], [-85.06, 69.89], [-75.82, 58.79], [-63.91, 44.48], [-53.73, 52.82], [-65.65, 67.14], [-74.88, 78.24]], // 494
  [[70.93, -28.86], [75.04, -18.02], [76.2, -14.96], [68.38, -12.03], [60.48, -9.09], [59.32, -12.15], [55.22, -22.99], [63.03, -25.9]], // 495
  [[14.2, -3.17], [24.5, -17.07], [27.63, -14.79], [33.75, -10.31], [37.6, -7.49], [43.69, -3.05], [46.84, -0.74], [51.09, -6.48], [58.56, -1.03], [49.47, 11.24], [41.99, 5.77], [38.85, 3.47], [32.76, -0.98], [28.94, -3.78], [23.46, 3.6], [17.29, -0.92]], // 497 (+496)
  [[4.67, 67.67], [7.26, 50.49], [-0.2, 49.37], [-7.65, 48.27], [-10.24, 65.45]], // 498
  [[-25.61, 25.18], [-30.61, 21.09], [-35.62, 17.01], [-54.23, 39.5], [-49.23, 43.58], [-44.22, 47.67]], // 499
  [[-14.72, 4.65], [-0.49, 6.71], [-5.1, 37.96], [-19.34, 35.9]], // 500
  [[39.33, -69.86], [34.99, -81.45], [28.08, -99.97], [26.54, -104.1], [50.62, -112.97], [52.16, -108.85], [59.07, -90.33], [63.41, -78.74]], // 502
]

// Heights above the lowest ground (west lobe, ~51 m). Wilshire is ~53 m, so
// the floor top at 11.3 m is 30 ft over the street.
const FLOOR0 = 9.8, FLOOR1 = 11.3, GLASS1 = 17.8, RIM0 = 17.8, RIM1 = 19.7
const OVERHANG = 6.0, FLOOR_OUT = 5.0

if (import.meta.main) {
  const concrete = new Part(), under = new Part(), glassP = new Part(), roofP = new Part()

  const roofEdge = smooth(resample(ccw(OUTLINE), 4.2), 2, 0.5)
  const glassLine = smooth(offset(roofEdge, OVERHANG), 3, 0.5)
  const floorEdge = smooth(offset(roofEdge, FLOOR_OUT), 3, 0.5)

  // Roof slab: a rounded rim (g5) — underside lip, two-step bulge, top lip —
  // then the flat roof. Underside of the overhang back to the glass.
  const r0 = offset(roofEdge, 0.7), r3 = offset(roofEdge, 0.7)
  band(concrete, r0, RIM0, roofEdge, RIM0 + 0.6, -0.6)
  band(concrete, roofEdge, RIM0 + 0.6, roofEdge, RIM1 - 0.6, 0)
  band(concrete, roofEdge, RIM1 - 0.6, r3, RIM1, 0.6)
  capRing(roofP, r3, RIM1, true)
  annulus(under, r0, glassLine, RIM0, false)

  // The glass band all round, floor to roof.
  band(glassP, glassLine, FLOOR1, glassLine, GLASS1)

  // The floor band (exhibition floor slab edge) and its underside.
  const f0 = offset(floorEdge, 0.4)
  band(concrete, f0, FLOOR0, floorEdge, FLOOR0 + 0.4, -0.6)
  band(concrete, floorEdge, FLOOR0 + 0.4, floorEdge, FLOOR1, 0)
  annulus(concrete, floorEdge, glassLine, FLOOR1, true)
  capRing(under, f0, FLOOR0, false)

  // The pavilions: concrete blocks up to the slab, each with a broad glazed
  // panel on its longest faces (g5 shows one glass wall per pavilion).
  for (const raw of PAVILIONS) {
    const R = ccw(raw)
    for (let i = 0; i < R.length; i++) {
      const a = R[i], b = R[(i + 1) % R.length]
      concrete.quad(at(a, 0), at(b, 0), at(b, FLOOR0), at(a, FLOOR0))
    }
    // the longest edge gets a broad glazed bay (g5)
    const lens = R.map((a, i) => { const b = R[(i + 1) % R.length]; return Math.hypot(b[0] - a[0], b[1] - a[1]) })
    const max = Math.max(...lens)
    lens.forEach((L, i) => {
      if (L < max || L < 8) return
      const a = R[i], b = R[(i + 1) % R.length]
      panel(glassP, a, b, L * 0.3, L * 0.7, 0.4, FLOOR0 - 1.6)
    })
  }

  const parts = [
    { part: concrete, material: finish('geffen-concrete', 0xe2dbcf) },
    { part: under, material: finish('geffen-soffit', 0xc9c3b8) },
    { part: roofP, material: finish('geffen-roof', 0xc2bcb1) },
    { part: glassP, material: PALETTE.window },
  ]
  const { glb, triangles } = finishModel('la-lacma-geffen', 'LACMA David Geffen Galleries', parts, {
    bearing: 0, height: RIM1,
    replaces: ['way/1352498524', 'way/1528280559', 'way/1352498501', 'way/1352498494', 'way/1352498495', 'way/1352498496', 'way/1352498497',
      'way/1352498498', 'way/1352498499', 'way/1352498500', 'way/1352498502', 'way/1352498503', 'way/1352498504', 'way/1352498526'],
  })
  const out = process.argv[2] ?? new URL('../models/la-lacma-geffen.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
