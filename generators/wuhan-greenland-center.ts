/**
 * Wuhan Greenland Center, Wuchang, Wuhan — original procedural geometry, CC0-1.0.
 * bun generators/wuhan-greenland-center.ts   (writes the low model and the detail LOD)
 *
 * Also holds the small plan kit (resample, ring offsets, caps, ledges) that the
 * other Wuhan / Changsha / Chongqing towers of this batch import.
 *
 * Frame: bearing 0 (model +y is north). Origin = the centroid of the OSM
 * outline way/533413541 (114.3174016 E, 30.5858044 N), on the ground; y = 0
 * is the plaza; elevation 0.
 *
 * Form, as read from OSM and the photos:
 * - a three-lobed (trefoil) plan: three rounded lobes, at bearings ~23, ~161
 *   and ~270 degrees, with concave faces between them, taken from the OSM
 *   outline itself (resampled and lightly smoothed);
 * - a streamlined taper: nearly straight to ~150 m, then narrowing ever
 *   faster to ~73 % of the foot width at the top;
 * - the lobe ends are smooth silver glass columns running the full height
 *   and rising highest at the top, with rounded shoulders;
 * - the concave faces carry horizontal sunshade ledges (real 3D lips, grouped
 *   every ~4 floors in the low model, every 2 in the detail LOD) and are cut
 *   back at the two refuge floors (~214 m and ~341 m) where they meet the
 *   lobes, as dark recessed notches;
 * - the top: the west lobe column is the peak (475.6 m); the SSE and NNE lobes
 *   stop ~9 and ~14 m lower, and the concave parapets between dip a few
 *   metres more, over a flat roof at 455 m. The tower was topped out at 475.6 m
 *   without the dome cap of the original 636 m design: every finished-tower
 *   photo shows a flat, wavy top, so no dome is modelled.
 *
 * Evidence
 * - OSM (API map call, fetched 2026-11-27): outline way/533413541
 *   (building=commercial, height 476, 97 levels, name 武汉绿地中心,
 *   wikidata Q143235; Wikidata Q143235 is "Wuhan Greenland Center", 475.6 m,
 *   coordinates on the outline, checked).
 * - Published: 475.6 m, 97 floors (CTBUH / Wikipedia "Wuhan Greenland Center";
 *   reduced from the planned 636 m, topped out 2021–2023).
 * - Photos (Wikimedia Commons, daylight, finished tower):
 *   "(CHN-Hubei) Wuhan Greenland Center 2024-12-01.jpg", S5A-0043, CC BY 4.0,
 *   across the Yangtze from the north-west: the profile (measured row by row,
 *   below), the silver lobe column, ledges, refuge notches, the wavy top;
 *   https://commons.wikimedia.org/wiki/File:(CHN-Hubei)_Wuhan_Greenland_Center_2024-12-01.jpg
 *   "Greenland Wuhan Center by2020(9to16).jpg", WiNG, CC BY-SA 4.0, camera
 *   2.26 km due north (Commons camera location): the profile and the refuge
 *   notches at a third and two thirds of the height, glass colour in sun;
 *   https://commons.wikimedia.org/wiki/File:Greenland_Wuhan_Center_by2020(9to16).jpg
 *   "武汉绿地中心.jpg", Denisvldk, CC BY-SA 4.0 (2017, under construction):
 *   context only; https://commons.wikimedia.org/wiki/File:%E6%AD%A6%E6%B1%89%E7%BB%BF%E5%9C%B0%E4%B8%AD%E5%BF%83.jpg
 * - No lidar, NAIP or Mapillary here (batch notes).
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 475.6 m top.
 * - Measured (OSM): the plan, 80 x 74 m.
 * - Measured (photo, S5A-0043, scaled to 475.6 m; width relative to the
 *   widest, 80.6 m, which matches OSM): 1.0 to 145 m, 0.993 at 189, 0.983 at
 *   219, 0.971 at 248, 0.953 at 278, 0.931 at 307, 0.906 at 337, 0.872 at 366,
 *   0.839 at 396, 0.794 at 425, 0.752 at 455, 0.73 at the top.
 * - Measured (photos): refuge recesses at ~210–220 m and ~337–347 m; the SSE lobe top ~9 m and the NNE ~14 m below the
 *   west lobe's (S5A-0043 crop; the north photo agrees on the order).
 * - Estimated: ledge projection (0.9 m low, 0.8 m detail, bolder than the
 *   real sunshades); recess depth 2.2 m; roof 455 m; colours sampled from the
 *   two photos (glass #2f4153–#3d4e61 in shade, #43649c in sun, pulled to
 *   #56687e; silver #6e7581–#9ca5c0, pulled to #a3adb8).
 *
 * Doubts
 * - The plan is OSM's outline, assumed to be the foot; the camera of the main
 *   photo is not recorded, so the NW direction is estimated from the river.
 * - The real sunshades are per floor and wave; the ledges are grouped and level.
 * - The lobby canopies and the low annexes at the foot are not modelled.
 *
 * Night: the curtain wall (dark glass and silver lobes) glows as windows; the
 * ledges are lightly floodlit.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { face, saveLods, type Layer } from './auckland-sky-tower'
import { gridSurface } from './shanghai-tower'
import { triangulate } from './chi-aon-center'

// ---- Plan kit (shared with the other towers of this batch) -------------------------------------

export type XY = [number, number]

const area = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
export const ccwXY = (r: XY[]): XY[] => (area(r) < 0 ? [...r].reverse() : r)

export function centroidXY(r: XY[]): XY {
  let A = 0, cx = 0, cy = 0
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], c = a[0] * b[1] - b[0] * a[1]
    A += c; cx += (a[0] + b[0]) * c; cy += (a[1] + b[1]) * c
  }
  return [cx / (3 * A), cy / (3 * A)]
}

/** n points evenly spaced by arc length round a closed ring, starting nearest angle `start` (rad). */
export function resample(poly: XY[], n: number, start = 0): XY[] {
  const r = ccwXY(poly)
  let i0 = 0, best = 1e9
  r.forEach((p, i) => { const d = Math.abs(Math.atan2(Math.sin(Math.atan2(p[1], p[0]) - start), Math.cos(Math.atan2(p[1], p[0]) - start))); if (d < best) { best = d; i0 = i } })
  const R = [...r.slice(i0), ...r.slice(0, i0)]
  const L: number[] = [0]
  for (let i = 0; i < R.length; i++) { const a = R[i], b = R[(i + 1) % R.length]; L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1])) }
  const T = L[L.length - 1], out: XY[] = []
  let j = 0
  for (let k = 0; k < n; k++) {
    const s = (k * T) / n
    while (L[j + 1] < s) j++
    const a = R[j], b = R[(j + 1) % R.length], t = (s - L[j]) / (L[j + 1] - L[j] || 1)
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
  }
  return out
}

/** Laplacian smoothing of a closed ring, `it` passes. */
export function smoothXY(r: XY[], it = 1, k = 0.5): XY[] {
  let a = r
  for (let q = 0; q < it; q++) a = a.map((p, i) => { const u = a[(i - 1 + a.length) % a.length], v = a[(i + 1) % a.length]; return [p[0] + k * ((u[0] + v[0]) / 2 - p[0]), p[1] + k * ((u[1] + v[1]) / 2 - p[1])] as XY })
  return a
}

/** Outward unit normals at the vertices of a counter-clockwise ring. */
export function normalsXY(r: XY[]): XY[] {
  return r.map((_, i) => {
    const a = r[(i - 1 + r.length) % r.length], b = r[(i + 1) % r.length]
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1
    return [dy / l, -dx / l]
  })
}

/** Flat cap over a ring (any vertex heights; triangulated in plan), facing up or down. */
export function capRing(p: Part, ring: V3[], up = true) {
  const xy = ring.map((v) => [v[0], v[1]] as XY)
  const flip = area(xy) < 0
  const r = flip ? [...ring].reverse() : ring
  for (const [a, b, c] of triangulate(r.map((v) => [v[0], v[1]] as XY))) face(p, [r[a], r[b], r[c]], [0, 0, up ? 1 : -1])
}

/**
 * A level ledge (sunshade lip) along an open run of ring points `pts` at
 * height z: `out` metres proud of them along `ns`, `h` thick. Top, front,
 * soffit and the two ends.
 */
export function ledge(p: Part, pts: XY[], ns: XY[], z: number, out: number, h: number, soffit = true) {
  const o = (i: number, d: number, zz: number): V3 => [pts[i][0] + ns[i][0] * d, pts[i][1] + ns[i][1] * d, zz]
  for (let i = 0; i < pts.length - 1; i++) {
    const j = i + 1
    const n: V3 = [(ns[i][0] + ns[j][0]) / 2, (ns[i][1] + ns[j][1]) / 2, 0]
    face(p, [o(i, -0.2, z + h), o(j, -0.2, z + h), o(j, out, z + h), o(i, out, z + h)], [0, 0, 1])
    p.tri(o(i, out, z), o(j, out, z), o(j, out, z + h), undefined, undefined, undefined, [[ns[i][0], ns[i][1], 0], [ns[j][0], ns[j][1], 0], [ns[j][0], ns[j][1], 0]])
    p.tri(o(i, out, z), o(j, out, z + h), o(i, out, z + h), undefined, undefined, undefined, [[ns[i][0], ns[i][1], 0], [ns[j][0], ns[j][1], 0], [ns[i][0], ns[i][1], 0]])
    if (soffit) face(p, [o(i, -0.2, z), o(i, out, z), o(j, out, z), o(j, -0.2, z)], [0, 0, -1])
    void n
  }
  const e = (i: number, k: number) => {
    const t: XY = k < 0 ? [ns[i][1], -ns[i][0]] : [-ns[i][1], ns[i][0]]
    face(p, [o(i, -0.2, z), o(i, out, z), o(i, out, z + h), o(i, -0.2, z + h)], [t[0], t[1], 0])
  }
  e(0, -1); e(pts.length - 1, 1)
}

/** Piecewise-linear interpolation of [x, y] pairs (x ascending). */
export function interp(P: [number, number][], x: number): number {
  if (x <= P[0][0]) return P[0][1]
  for (let i = 0; i < P.length - 1; i++) if (x <= P[i + 1][0]) { const t = (x - P[i][0]) / (P[i + 1][0] - P[i][0]); return P[i][1] + (P[i + 1][1] - P[i][1]) * t }
  return P[P.length - 1][1]
}

/** Catmull-Rom through [x, y] pairs (x ascending). */
export function smoothInterp(P: [number, number][], z: number): number {
  if (z <= P[0][0]) return P[0][1]
  for (let i = 0; i < P.length - 1; i++) {
    const [z0, r0] = P[i], [z1, r1] = P[i + 1]
    if (z <= z1) {
      const rm = i > 0 ? P[i - 1][1] : r0 - (r1 - r0), rp = i + 2 < P.length ? P[i + 2][1] : r1 + (r1 - r0)
      const t = (z - z0) / (z1 - z0), t2 = t * t, t3 = t2 * t
      return 0.5 * (2 * r0 + (-rm + r1) * t + (2 * rm - 5 * r0 + 4 * r1 - rp) * t2 + (-rm + 3 * r0 - 3 * r1 + rp) * t3)
    }
  }
  return P[P.length - 1][1]
}

/** Contiguous runs (as index lists, wrapping) of ring indices where `f` holds. */
export function runs(n: number, f: (i: number) => boolean): number[][] {
  const out: number[][] = []
  let s = -1
  for (let i = 0; i < n; i++) if (!f(i)) { s = i; break }
  if (s < 0) return [[...Array(n).keys(), 0]]
  let cur: number[] = []
  for (let k = 1; k <= n; k++) {
    const i = (s + k) % n
    if (f(i)) cur.push(i)
    else if (cur.length) { out.push(cur); cur = [] }
  }
  if (cur.length) out.push(cur)
  return out
}

// ---- Wuhan Greenland Center ---------------------------------------------------------------------

const TOP = 475.6
const ROOF = 455
const PARAPET = 459 // the lowest parapet, on the east face
// the top line round the plan (angle in degrees, CCW from east -> height): the west lobe is the
// peak; the NNE and SSE lobes stand lower, the concave parapets between dip a little
const TOPLINE: [number, number][] = [[-180, 475.6], [-125, 467], [-71, 467], [0, 459], [67, 462], [124, 466], [180, 475.6]]
// OSM way/533413541 in the model frame (bearing 0), metres about its centroid
const OSM: XY[] = [[11.7, 38.5], [8.6, 36.7], [5.4, 33.9], [2.4, 30.6], [-0.4, 27.6], [-3.0, 24.7], [-6.3, 22.0], [-10.3, 20.0], [-14.0, 18.4], [-18.0, 17.3], [-22.6, 16.5], [-27.0, 16.2], [-31.0, 15.8], [-35.1, 15.3], [-39.2, 13.2], [-42.0, 10.0], [-43.8, 6.4], [-44.4, 2.5], [-44.1, -1.9], [-42.4, -5.2], [-39.6, -8.4], [-36.6, -10.1], [-32.6, -11.8], [-28.2, -12.8], [-23.8, -13.7], [-19.5, -14.8], [-15.4, -16.2], [-11.8, -18.6], [-8.7, -21.1], [-5.8, -23.7], [-3.5, -26.9], [-1.6, -29.6], [0.2, -32.4], [2.1, -35.1], [4.6, -37.7], [7.4, -39.5], [10.9, -40.7], [14.5, -41.1], [18.8, -40.8], [22.3, -38.9], [24.6, -36.3], [26.7, -33.1], [27.6, -28.9], [27.4, -25.0], [26.4, -21.5], [24.9, -17.8], [23.8, -13.9], [22.7, -10.3], [21.8, -6.2], [21.6, -2.4], [22.1, 1.7], [23.1, 5.0], [24.5, 8.2], [26.0, 11.3], [27.6, 14.5], [29.1, 17.7], [29.8, 20.9], [30.2, 24.6], [29.9, 28.3], [28.6, 31.9], [26.2, 34.9], [23.2, 37.3], [19.6, 38.6], [15.7, 39.1]]

// width relative to the foot, by height (photo, S5A-0043)
const PROF: [number, number][] = [[0, 1], [145, 1], [189, 0.993], [219, 0.983], [248, 0.971], [278, 0.953], [307, 0.931], [337, 0.906], [366, 0.872], [396, 0.839], [425, 0.794], [455, 0.752], [476, 0.728]]
const scaleAt = (z: number) => smoothInterp(PROF, z)
const REFUGE: [number, number][] = [[210, 220], [337, 347]]

type Set = { glass: Part; silver: Part; fin: Part; dark: Part; roof: Part }
const mk = (): Set => ({ glass: new Part(), silver: new Part(), fin: new Part(), dark: new Part(), roof: new Part() })

function build(s: Set, d: boolean) {
  const N = d ? 132 : 66
  const base = smoothXY(resample(OSM, N, Math.PI / 2), d ? 2 : 1, 0.4)
  const c = centroidXY(base)
  const plan = base.map((p) => [p[0] - c[0], p[1] - c[1]] as XY)
  const ns = normalsXY(plan)
  const rad = plan.map((p) => Math.hypot(p[0], p[1]))
  // lobe-ness: 1 on the rounded lobe ends, 0 on the concave faces
  const w = rad.map((r) => Math.max(0, Math.min(1, (r - 31) / 7)))
  const lobe = (i: number) => w[i] > 0.45
  // the refuge floors are cut back where the concave faces meet the lobes (the photos' dark notches)
  const recess = (i: number) => !lobe(i) && rad[i] > 26.5
  const topZ = (i: number) => {
    const a = (Math.atan2(plan[i][1], plan[i][0]) * 180) / Math.PI
    const lobeZ = interp(TOPLINE, a), dip = (1 - Math.pow(w[i], 0.45)) * 3
    return lobeZ - dip
  }
  const at = (i: number, z: number, inset = 0): V3 => {
    const k = scaleAt(z)
    return [plan[i][0] * k - ns[i][0] * inset, plan[i][1] * k - ns[i][1] * inset, z]
  }

  // rows of the shell, with the refuge recesses cut into the concave faces
  const levels: number[] = d ? [0, 20, 45, 70, 100, 130, 160, 190] : [0, 60, 145, 190]
  const rows: { z: number; inset: boolean }[] = levels.map((z) => ({ z, inset: false }))
  for (const [a, b] of REFUGE) {
    rows.push({ z: a, inset: false }, { z: a + 0.01, inset: true }, { z: b - 0.01, inset: true }, { z: b, inset: false })
  }
  for (const z of d ? [250, 280, 310, 375, 400, 420, 440, 455] : [270, 300, 390, 430]) rows.push({ z, inset: false })
  rows.sort((p, q) => p.z - q.z)
  const g: V3[][] = rows.map((r) => plan.map((_, i) => at(i, r.z, r.inset && recess(i) ? 2.2 : 0)))
  // the top: lobes rise to their rounded shoulders, the concave parapets sweep down
  const shoulder = plan.map((_, i) => at(i, topZ(i) - 2.2 - 2 * (1 - w[i]), 0))
  g.push(shoulder)
  const topRow = plan.map((_, i) => { const p = at(i, topZ(i), w[i] * 0.9); return p })
  g.push(topRow)
  const recessRow = (k: number) => rows[k] && rows[k].inset && rows[k + 1] && rows[k + 1].inset
  gridSurface(g, true, (i, k) => {
    const j = (i + 1) % N
    if (recessRow(k) && (recess(i) || recess(j))) return s.dark
    return lobe(i) && lobe(j) ? s.silver : s.glass
  })
  // the recess floors and ceilings are the gridSurface's own horizontal steps (zero-height rows) — they are
  // drawn by the rows at a and a+0.01 / b-0.01 and b, which form the step faces.

  // parapet: flat top lip, inner face down to the roof, the roof
  const inner = plan.map((_, i) => at(i, topZ(i), 1.4 + w[i] * 0.9))
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    face(lobe(i) && lobe(j) ? s.silver : s.fin, [topRow[i], topRow[j], inner[j], inner[i]], [0, 0, 1])
  }
  const innerLow = inner.map((p) => [p[0], p[1], ROOF] as V3)
  gridSurface([innerLow, inner].map((r) => [...r].reverse()), true, () => s.roof)
  capRing(s.roof, innerLow, true)

  // ledges on the concave faces
  const ledgeZ: number[] = []
  const step = d ? 9 : 22.5
  for (let z = 14; z < PARAPET - 6; z += step) {
    if (REFUGE.some(([a, b]) => z > a - 4 && z < b + 4)) continue
    ledgeZ.push(z)
  }
  const out = d ? 0.8 : 0.9, h = d ? 0.45 : 0.6
  for (const z of ledgeZ) {
    const k = scaleAt(z)
    for (const run of runs(N, (i) => !lobe(i))) {
      const all = [(run[0] - 1 + N) % N, ...run, (run[run.length - 1] + 1) % N]
      const idx = d ? all : all.filter((_, q) => q % 2 === 0 || q === all.length - 1)
      const pts = idx.map((i) => [plan[i][0] * k, plan[i][1] * k] as XY)
      ledge(s.fin, pts, idx.map((i) => ns[i]), z, out, h, d)
    }
  }
}

// ---- Materials and output ----------------------------------------------------------------------

const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x56687e }
const SILVER: MaterialSpec = windowVariant(2, 0xa3adb8)
const FIN: MaterialSpec = { ...finish('greenland-fin', 0xb2bbc5, 0.5), floodlight: (p, n) => (n[2] > 0.7 ? 0.15 : 0.4) }
const DARK: MaterialSpec = finish('greenland-recess', 0x4e5866, 0.6)
const ROOFM: MaterialSpec = PALETTE.roof

const low = mk(), det = mk()
build(low, false)
build(det, true)
const layers = (s: Set): Layer[] => [
  { part: s.glass, material: GLASS },
  { part: s.silver, material: SILVER },
  { part: s.fin, material: FIN },
  { part: s.dark, material: DARK },
  { part: s.roof, material: ROOFM },
]

if (import.meta.main) {
  await saveLods('wuhan-greenland-center', 'Wuhan Greenland Center', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres, bearing 0; origin at the centroid of the OSM outline, on the plaza',
    bearing: 0, height: TOP,
  }, 5000)
}
