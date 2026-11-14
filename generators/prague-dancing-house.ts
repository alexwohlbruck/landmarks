/**
 * Dancing House (Tančící dům, "Fred and Ginger"), Prague: procedural, CC0-1.0.
 *   bun generators/prague-dancing-house.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/prague-dancing-house.glb, the low model;
 * - models/prague-dancing-house.detail.glb, drawn from zoom 17: framed
 *   windows, twice the glazing mullions and a denser Medusa.
 *
 * This file also exports the small kit the other `prague-` generators use
 * (smooth lofts, swept tubes and bars, oriented boxes, two-LOD saving), so
 * it merges first.
 *
 * Frame: not turned (BEARING 0): +x east, +y north, z up, metres. Origin =
 * the anchor 14.41417 E, 50.07543 N, within a metre of the centroid of the
 * OSM outline relation/6751056; y = 0 is the pavement (Mapterhorn z14 shows
 * the corner flat to within half a metre).
 *
 * Evidence
 * - OSM relation/6751056 (Tančící dům, building=commercial, height 28,
 *   8 levels, Frank Gehry and Vlado Milunić, 1996, Q244816): the outline,
 *   used as drawn. Its parts: way/456783389 (Fred, the round concrete tower,
 *   6-26 m, a circle r ~4.8 about (-6.6, 7.4)); way/456783391 (the dome,
 *   "Medusa", r ~3 on Fred's roof); way/456783390 (the river wing, 4-24 m,
 *   its ground floor set back); way/1201366338 (Ginger, the glass tower,
 *   6-29 m) and ways 1201366339/40/41 (Ginger's flared lower skirt, glass,
 *   5-13 m, reaching 17.3 m north); way/456783392 (the little terrace at
 *   Ginger's waist, 14.5-15 m); ways 319383482-93 (the columns under Fred,
 *   the river wing and Ginger: three round ones r 0.75-1.0 and eight
 *   slender ones under Ginger), all used as placed.
 * - Commons photos (EVIDENCE):
 *   "The Dancing House in Prague.jpg" (LenaSevcikova, CC0; from the
 *   embankment to the west: Fred, the river front and Ginger's skirt);
 *   "Dancing house in 2010.jpg" (Speedbump49, CC0; square on from across the
 *   river: the heights below are scaled from it, Fred 26.5 m);
 *   "Jiráskovo náměstí, Tatra T3R.P a Tančící dům.jpg" (Honza Groh (Jagro),
 *   CC BY-SA 3.0; from the north: Ginger's waist, the terrace and its struts,
 *   the Medusa's tangle); "Casa Danzante, Praga, República Checa,
 *   2022-07-01, DD 01.jpg" (Diego Delso, CC BY-SA 4.0; dusk, from the
 *   north-west: Ginger's legs and the lit glass); "Prague - Dancing House
 *   (20743403790).jpg" (Ștefan Jurcă, CC BY 2.0; from the river, the
 *   building in its row); "Dancing House in Prague, at night.jpg" (Simon
 *   Lyngshede, CC BY-SA 4.0; night).
 *
 * Measured from the photos (scaled to Fred = 26.5 m from the 2010 photo,
 * where the river wing's top reads 0.88 of Fred's): the river wing 23.5 m;
 * Ginger's top rim 27.8 m, a little above Fred; the waist at 14.5 m; the
 * skirt's lower rim at 5 m (OSM); the Medusa about 7 m across and 5 m high.
 * Fred has seven rows of large windows, the river front eight rows of
 * smaller ones, each row riding a wavy moulding line; both are staggered.
 * Estimated: Ginger's plan (an ellipse fitted to OSM's glass part, its
 * skirt and upper half both swelling to the north-east, away from Fred);
 * the window sizes (1.5 x 1.75 m on Fred, 1.35 x 1.45 m on the river front)
 * and the waves (0.5 m, a 9 m period); the Medusa's mesh (twisted flat
 * steel ribbons crossing each other, some loose ends standing out; the real
 * tangle is denser and less regular); the roof's glazed bar pavilion.
 *
 * Left out: the neighbouring houses (OSM's own buildings), the café
 * lettering, the roof terrace railings.
 *
 * Doubts: the rear (the Resslova side and the courtyard) is not photographed
 * and is drawn plain; the window counts round the back of Fred are inferred.
 *
 * Night: the windows and Ginger's floors glow; Fred's render is floodlit
 * warm and the Medusa lit (DD 01 and the night photo).
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { lathe, triangulate, type XY } from './chi-aon-center'

// ---------------------------------------------------------------------------
// The kit, shared by the prague- generators.

export type { XY }
export type PartList = Array<{ part: Part; material: MaterialSpec }>
export const TAU = Math.PI * 2
export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
export const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
export { cross, sub, lathe, triangulate }

/** A quad with one normal; its winding follows the normal. */
export function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  p.tri(a, c, d, undefined, undefined, undefined, [n, n, n])
}
export function triN(p: Part, a: V3, b: V3, c: V3, n: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
}
/** A quad with per-corner normals; its winding follows them. */
export function quadS(p: Part, Q: V3[], N: V3[]) {
  p.tri(Q[0], Q[1], Q[2], undefined, undefined, undefined, [N[0], N[1], N[2]])
  p.tri(Q[0], Q[2], Q[3], undefined, undefined, undefined, [N[0], N[2], N[3]])
}

/** Two unit vectors perpendicular to t (and to each other). */
export function perp(t: V3, hint: V3 = [0, 0, 1]): [V3, V3] {
  let u = cross(t, hint)
  if (Math.hypot(...u) < 1e-4) u = cross(t, [1, 0, 0])
  u = unit(u)
  return [u, unit(cross(u, t))]
}

/**
 * An oriented box: centre c, unit axes u (half-width hu), v (half-height
 * hv) and w (the outward normal), from depth d0 to d1 along w. The back
 * face is left off unless `back`.
 */
export function box(p: Part, c: V3, u: V3, v: V3, w: V3, hu: number, hv: number, d0: number, d1: number, back = false) {
  const P = (su: number, sv: number, d: number): V3 => add(add(add(c, mul(u, su * hu)), mul(v, sv * hv)), mul(w, d))
  quadN(p, P(-1, -1, d1), P(1, -1, d1), P(1, 1, d1), P(-1, 1, d1), w)
  quadN(p, P(-1, -1, d0), P(-1, -1, d1), P(-1, 1, d1), P(-1, 1, d0), mul(u, -1))
  quadN(p, P(1, -1, d1), P(1, -1, d0), P(1, 1, d0), P(1, 1, d1), u)
  quadN(p, P(-1, 1, d1), P(1, 1, d1), P(1, 1, d0), P(-1, 1, d0), v)
  quadN(p, P(-1, -1, d0), P(1, -1, d0), P(1, -1, d1), P(-1, -1, d1), mul(v, -1))
  if (back) quadN(p, P(-1, 1, d0), P(1, 1, d0), P(1, -1, d0), P(-1, -1, d0), mul(w, -1))
}

/** A framed window: a rim of four bars standing `out` proud, and the pane set just in front of the wall. */
export function framedWindow(frame: Part, pane: Part, c: V3, u: V3, v: V3, w: V3, hu: number, hv: number, bar: number, out: number) {
  box(frame, add(c, mul(v, hv - bar / 2)), u, v, w, hu, bar / 2, -0.05, out)
  box(frame, add(c, mul(v, -hv + bar / 2)), u, v, w, hu, bar / 2, -0.05, out)
  box(frame, add(c, mul(u, hu - bar / 2)), u, v, w, bar / 2, hv - bar, -0.05, out)
  box(frame, add(c, mul(u, -hu + bar / 2)), u, v, w, bar / 2, hv - bar, -0.05, out)
  const P = (su: number, sv: number): V3 => add(add(add(c, mul(u, su * (hu - bar))), mul(v, sv * (hv - bar))), mul(w, 0.04))
  quadN(pane, P(-1, -1), P(1, -1), P(1, 1), P(-1, 1), w)
}

/** A window for the low model: a flat frame plate just off the wall and the pane on it, inset by `bar`. */
export function plateWindow(frame: Part, pane: Part, c: V3, u: V3, v: V3, w: V3, hu: number, hv: number, bar: number, out = 0.06) {
  const P = (su: number, sv: number, h: number, d: number): V3 => add(add(add(c, mul(u, su * h)), mul(v, sv * (h === hu ? hv : hv - bar))), mul(w, d))
  quadN(frame, P(-1, -1, hu, out), P(1, -1, hu, out), P(1, 1, hu, out), P(-1, 1, hu, out), w)
  const Q = (su: number, sv: number): V3 => add(add(add(c, mul(u, su * (hu - bar))), mul(v, sv * (hv - bar))), mul(w, out + 0.03))
  quadN(pane, Q(-1, -1), Q(1, -1), Q(1, 1), Q(-1, 1), w)
  void P
}

/**
 * A grid of rings lofted into a smooth surface. rings[k][i]: ring k (going
 * up, or along) and corner i (counter-clockwise seen from where the surface
 * faces). Normals average the faces round each corner.
 */
export function loftSmooth(p: Part, rings: V3[][], closed = true, flip = false) {
  const K = rings.length, n = rings[0].length, m = closed ? n : n - 1
  const fn: V3[][] = []
  for (let k = 0; k < K - 1; k++) {
    fn.push([])
    for (let i = 0; i < m; i++) {
      const j = (i + 1) % n
      const a = rings[k][i], b = rings[k][j], c = rings[k + 1][j], d = rings[k + 1][i]
      let f = cross(sub(c, a), sub(d, b))
      if (flip) f = mul(f, -1)
      fn[k].push(unit(f))
    }
  }
  const vn = (k: number, i: number): V3 => {
    let s: V3 = [0, 0, 0]
    for (const kk of [k - 1, k]) {
      if (kk < 0 || kk >= K - 1) continue
      for (const ii of [i - 1, i]) {
        const iw = closed ? (ii + m) % m : ii
        if (iw < 0 || iw >= m) continue
        s = add(s, fn[kk][iw])
      }
    }
    return unit(s)
  }
  for (let k = 0; k < K - 1; k++)
    for (let i = 0; i < m; i++) {
      const j = (i + 1) % n
      quadS(p, [rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i]], [vn(k, i), vn(k, j), vn(k + 1, j), vn(k + 1, i)])
    }
}

/** Parallel-transport frames along a polyline. */
function frames(pts: V3[], hint: V3) {
  const T = pts.map((_, i) => unit(sub(pts[Math.min(pts.length - 1, i + 1)], pts[Math.max(0, i - 1)])))
  let [u] = perp(T[0], hint)
  const U: V3[] = [], V: V3[] = []
  for (let i = 0; i < pts.length; i++) {
    if (i > 0) {
      u = sub(u, mul(T[i], dot(u, T[i])))
      u = unit(u)
    }
    U.push(u)
    V.push(unit(cross(T[i], u)))
  }
  return { T, U, V }
}

/** A round tube swept along a polyline, smooth-shaded, ends capped. */
export function tube(p: Part, pts: V3[], r: number | ((i: number) => number), sides = 6, caps = true) {
  const { T, U, V } = frames(pts, [0, 0, 1])
  const R = (i: number) => (typeof r === 'number' ? r : r(i))
  const ring = (i: number) =>
    Array.from({ length: sides }, (_, s) => {
      const a = (s / sides) * TAU
      const n = add(mul(U[i], Math.cos(a)), mul(V[i], Math.sin(a)))
      return { p: add(pts[i], mul(n, R(i))), n }
    })
  const rings = pts.map((_, i) => ring(i))
  for (let i = 0; i < pts.length - 1; i++)
    for (let s = 0; s < sides; s++) {
      const t = (s + 1) % sides
      const A = rings[i][s], B = rings[i][t], C = rings[i + 1][t], D = rings[i + 1][s]
      quadS(p, [A.p, D.p, C.p, B.p], [A.n, D.n, C.n, B.n])
    }
  if (caps) {
    const e0 = rings[0].map((x) => x.p), e1 = rings[pts.length - 1].map((x) => x.p)
    for (let s = 1; s < sides - 1; s++) {
      triN(p, e0[0], e0[s + 1], e0[s], mul(T[0], -1))
      triN(p, e1[0], e1[s], e1[s + 1], T[pts.length - 1])
    }
  }
}

/**
 * A flat bar (rectangular section, `w` wide along `side(i)` and `t` thick)
 * swept along a polyline: a ribbon of steel. Flat across, smooth along.
 */
export function bar(p: Part, pts: V3[], w: number, t: number, side: (i: number) => V3, faces = [0, 1, 2, 3], ends = true) {
  const T = pts.map((_, i) => unit(sub(pts[Math.min(pts.length - 1, i + 1)], pts[Math.max(0, i - 1)])))
  const S = pts.map((_, i) => {
    let s = side(i)
    s = unit(sub(s, mul(T[i], dot(s, T[i]))))
    return s
  })
  const N = pts.map((_, i) => unit(cross(T[i], S[i])))
  const C = (i: number, a: number, b: number): V3 => add(add(pts[i], mul(S[i], (a * w) / 2)), mul(N[i], (b * t) / 2))
  const sides: Array<[[number, number], [number, number], (i: number) => V3]> = [
    [[1, 1], [-1, 1], (i) => N[i]],
    [[-1, -1], [1, -1], (i) => mul(N[i], -1)],
    [[1, -1], [1, 1], (i) => S[i]],
    [[-1, 1], [-1, -1], (i) => mul(S[i], -1)],
  ]
  for (let i = 0; i < pts.length - 1; i++)
    for (const [a, b, n] of faces.map((f) => sides[f]))
      quadS(p, [C(i, a[0], a[1]), C(i, b[0], b[1]), C(i + 1, b[0], b[1]), C(i + 1, a[0], a[1])], [n(i), n(i), n(i + 1), n(i + 1)])
  if (ends) for (const [i, sgn] of [[0, -1], [pts.length - 1, 1]] as [number, number][])
    quadN(p, C(i, -1, -1), C(i, 1, -1), C(i, 1, 1), C(i, -1, 1), mul(T[i], sgn))
}

/** A straight round member a→b. */
export const rod = (p: Part, a: V3, b: V3, r: number, sides = 6, caps = true) => tube(p, [a, b], r, sides, caps)

/** Walls of a counter-clockwise ring from z0 to z1, one flat normal per wall. */
export function prism(p: Part, r: XY[], z0: number, z1: number, top: Part | null = p, bottom: Part | null = null) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    quadN(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [(b[1] - a[1]) / l, -(b[0] - a[0]) / l, 0])
  }
  if (top) for (const [i, j, k] of triangulate(r)) triN(top, [r[i][0], r[i][1], z1], [r[j][0], r[j][1], z1], [r[k][0], r[k][1], z1], [0, 0, 1])
  if (bottom) for (const [i, j, k] of triangulate(r)) triN(bottom, [r[i][0], r[i][1], z0], [r[k][0], r[k][1], z0], [r[j][0], r[j][1], z0], [0, 0, -1])
}

/** An ellipse ring (counter-clockwise), n corners, at height z. */
export const ellipse = (cx: number, cy: number, rx: number, ry: number, z: number, n: number, a0 = 0): V3[] =>
  Array.from({ length: n }, (_, i) => {
    const a = a0 + (i / n) * TAU
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a), z] as V3
  })

/** Deterministic noise in [-1, 1]. */
export const jitter = (k: number) => {
  const s = Math.sin(k * 12.9898 + 78.233) * 43758.5453
  return (s - Math.floor(s)) * 2 - 1
}

const triangles = (parts: PartList) => parts.reduce((t, { part }) => t + part.triangles, 0)

/** Write the low model (and the detail one, if given) after checking both budgets. */
export async function saveLods(id: string, name: string, low: PartList, detail: PartList | null, extras: Record<string, unknown>, lowMax = 6500) {
  const write = async (file: string, parts: PartList, maxTri: number, maxBytes: number) => {
    const used = parts.filter((x) => x.part.triangles > 0)
    const names = new Set(used.map((x) => x.material.name))
    if (names.size > 6) throw new Error(`${file}: ${names.size} materials`)
    // Parts sharing a material are merged, so each name is one primitive.
    const merged: PartList = []
    for (const nm of names) {
      const group = used.filter((x) => x.material.name === nm)
      const part = new Part()
      for (const g of group) {
        part.pos.push(...g.part.pos)
        part.nrm.push(...g.part.nrm)
        part.uv.push(...g.part.uv)
      }
      merged.push({ part, material: group[0].material })
    }
    const tris = triangles(merged)
    if (process.env.LOD_DEBUG) console.log(file, merged.map((m) => {
      let lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9]
      for (let i = 0; i < m.part.pos.length; i += 3) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], m.part.pos[i + k]); hi[k] = Math.max(hi[k], m.part.pos[i + k]) }
      return `${m.material.name}:${m.part.triangles} [${lo.map((v) => v.toFixed(1))}]..[${hi.map((v) => v.toFixed(1))}]`
    }).join("\n  "))
    if (tris > maxTri) throw new Error(`${file}: ${tris} triangles > ${maxTri}`)
    const glb = writeGlb(name, merged, { frame: 'Y up, -Z north, +X east; metres; ground anchor', ...extras })
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes`)
    const out = new URL(`../models/${file}`, import.meta.url).pathname
    await Bun.write(out, glb)
    console.log(`${out}: ${tris} triangles, ${glb.length} bytes, ${names.size} materials`)
  }
  await write(`${id}.glb`, low, process.env.LOD_DEBUG ? 1e9 : lowMax, process.env.LOD_DEBUG ? 1e9 : 250_000)
  if (detail) await write(`${id}.detail.glb`, detail, 40_000, 1536 * 1024)
}

// ---------------------------------------------------------------------------
// The Dancing House

type Lod = { detail: boolean }

const FRED: XY = [-6.6, 7.4]
const FRED_TOP = 26.5
const fredR = (z: number) => {
  const t = Math.min(1, Math.max(0, (z - 4.5) / (FRED_TOP - 4.5)))
  return 4.45 + 0.35 * t + 0.18 * Math.sin(Math.PI * t)
}
const MAIN_H = 23.5
const GROUND = 4.5 // the river wing's and Fred's ground floor, set back under them

// The main block, counter-clockwise: OSM's outline less Fred and Ginger.
const MAIN: XY[] = [
  [-11.0, -18.9], [7.2, -18.4], [7.1, -13.5], [7.3, -11.4], [8.2, -10.1], [9.5, -9.3], [11.4, -9.0], [9.6, 8.4],
  [6.4, 8.4], [-1.0, 8.4], [-2.4, 6.4], [-7.1, 2.7], [-8.6, 3.1], [-9.4, 1.4], [-9.8, 0.5], [-10.7, -1.3],
  [-11.4, -3.9], [-11.6, -9.4], [-11.1, -15.1],
]
// The river front, south to north (the outside is on the left, to the west).
const RIVER: XY[] = [[-11.0, -18.9], [-11.1, -15.1], [-11.6, -9.4], [-11.4, -3.9], [-10.7, -1.3], [-9.8, 0.5], [-9.4, 1.4], [-8.6, 3.1]]
const SETBACK = 1.6

// Ginger: an ellipse at each height, (z, cx, cy, rx, ry).
const GINGER: [number, number, number, number, number][] = [
  [5.0, 3.5, 13.1, 5.4, 5.0],
  [7.5, 2.85, 12.4, 4.6, 4.35],
  [10.0, 2.2, 11.75, 3.9, 3.8],
  [12.5, 1.75, 11.4, 3.45, 3.4],
  [14.5, 1.6, 11.3, 3.35, 3.3],
  [17.0, 1.75, 11.4, 3.55, 3.5],
  [20.0, 2.0, 11.6, 3.9, 3.8],
  [23.0, 2.3, 11.9, 4.25, 4.15],
  [26.0, 2.75, 12.3, 4.65, 4.5],
  [27.8, 3.05, 12.6, 4.9, 4.65],
]
function gingerAt(z: number) {
  let k = 0
  while (k < GINGER.length - 2 && GINGER[k + 1][0] < z) k++
  // Catmull-Rom through the keys, so the curve is smooth.
  const g = (i: number) => GINGER[Math.max(0, Math.min(GINGER.length - 1, i))]
  const t = (z - g(k)[0]) / (g(k + 1)[0] - g(k)[0])
  const cr = (j: number) => {
    const p0 = g(k - 1)[j], p1 = g(k)[j], p2 = g(k + 1)[j], p3 = g(k + 2)[j]
    return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t)
  }
  return { cx: cr(1), cy: cr(2), rx: cr(3), ry: cr(4) }
}
const gingerPt = (z: number, a: number, inset = 0): V3 => {
  const g = gingerAt(z)
  return [g.cx + (g.rx - inset) * Math.cos(a), g.cy + (g.ry - inset) * Math.sin(a), z]
}

/** Arc length positions along a polyline. */
function along(line: XY[]) {
  const seg = line.slice(0, -1).map((a, i) => Math.hypot(line[i + 1][0] - a[0], line[i + 1][1] - a[1]))
  const L = seg.reduce((s, x) => s + x, 0)
  const at = (s: number) => {
    let i = 0
    while (i < seg.length - 1 && s > seg[i]) s -= seg[i++]
    const a = line[i], b = line[i + 1], t = Math.min(1, Math.max(0, s / seg[i]))
    const d: XY = [(b[0] - a[0]) / seg[i], (b[1] - a[1]) / seg[i]]
    return { p: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t] as XY, d, out: [-d[1], d[0]] as XY }
  }
  return { L, at }
}

function build(L: Lod): PartList {
  const render = new Part(), win = new Part(), steel = new Part(), glass = new Part(), roof = new Part(), lobby = new Part()

  // --- the main block: the river wing and the rear, its ground floor set back on the river front ---
  const upper = MAIN
  const lower = MAIN.map(([x, y], i) => (i >= 12 || i === 0 ? ([x + SETBACK, y] as XY) : ([x, y] as XY)))
  // the shopfronts face the river and the square; the party walls are plain
  for (let i = 0; i < lower.length; i++) {
    const a = lower[i], b = lower[(i + 1) % lower.length]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    const glazed = i >= 8
    quadN(glazed ? win : render, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], GROUND], [a[0], a[1], GROUND], [(b[1] - a[1]) / l, -(b[0] - a[0]) / l, 0])
  }
  prism(render, upper, GROUND, MAIN_H, roof)
  // the soffit over the setback
  for (let i = 12; i <= MAIN.length; i++) {
    const a = i % MAIN.length, b = (i + 1) % MAIN.length
    if (b !== 0 && b < 12) continue
    quadN(render, [upper[a][0], upper[a][1], GROUND], [lower[a][0], lower[a][1], GROUND], [lower[b][0], lower[b][1], GROUND], [upper[b][0], upper[b][1], GROUND], [0, 0, -1])
  }
  // parapet lip on the roof
  {
    const lip = new Part()
    for (let i = 0; i < upper.length; i++) {
      const a = upper[i], b = upper[(i + 1) % upper.length]
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / l, -(b[0] - a[0]) / l]
      const ai: XY = [a[0] - n[0] * 0.4, a[1] - n[1] * 0.4], bi: XY = [b[0] - n[0] * 0.4, b[1] - n[1] * 0.4]
      quadN(render, [a[0], a[1], MAIN_H], [b[0], b[1], MAIN_H], [b[0], b[1], MAIN_H + 0.7], [a[0], a[1], MAIN_H + 0.7], [n[0], n[1], 0])
      quadN(render, [a[0], a[1], MAIN_H + 0.7], [b[0], b[1], MAIN_H + 0.7], [bi[0], bi[1], MAIN_H + 0.7], [ai[0], ai[1], MAIN_H + 0.7], [0, 0, 1])
      quadN(render, [bi[0], bi[1], MAIN_H], [ai[0], ai[1], MAIN_H], [ai[0], ai[1], MAIN_H + 0.7], [bi[0], bi[1], MAIN_H + 0.7], [-n[0], -n[1], 0])
    }
    void lip
  }
  // columns under the river front (OSM ways 319383482 and 319383483)
  for (const [x, y, r] of [[-10.15, -12.35, 0.75], [-9.9, -5.2, 0.8], [-10.3, -17.6, 0.7]] as const)
    lathe(render, x, y, [[r, 0], [r, GROUND]], L.detail ? 16 : 10)

  // the river front: wavy mouldings and the staggered windows riding them
  {
    const { L: len, at } = along(RIVER)
    const ROWS = 8, PITCH = 2.3, Z0 = 5.0, WAVE = 0.5, PERIOD = 9.0
    const wave = (s: number, k: number) => WAVE * Math.sin((TAU * s) / PERIOD + 0.9 * k)
    const sEnd = len - 1.2
    for (let k = 0; k < ROWS; k++) {
      // the moulding: a raised band under each row
      const steps = L.detail ? 40 : 12
      const pts: V3[] = []
      for (let i = 0; i <= steps; i++) {
        const s = 0.05 + ((sEnd - 0.05) * i) / steps
        const { p, out } = at(s)
        pts.push([p[0] + out[0] * 0.18, p[1] + out[1] * 0.18, Z0 + PITCH * k + wave(s, k) - 0.35])
      }
      // north-going: the side facing the river (west) is the bar's -N face
      bar(render, pts, 0.3, 0.4, () => [0, 0, 1], L.detail ? [0, 1, 2, 3] : [1, 2, 3], L.detail)
      // windows
      for (let s = 1.4; s < sEnd - 0.6; s += 2.3) {
        const { p, d, out } = at(s)
        const zc = Z0 + PITCH * k + wave(s, k) + 0.85
        const u: V3 = [d[0], d[1], 0], w: V3 = [out[0], out[1], 0]
        const c: V3 = [p[0], p[1], zc]
        if (L.detail) framedWindow(steel, win, c, u, [0, 0, 1], w, 0.7, 0.75, 0.16, 0.28)
        else plateWindow(steel, win, c, u, [0, 0, 1], w, 0.7, 0.75, 0.16)
      }
    }
    // the cornice, following the wave of the top row
    const pts: V3[] = []
    const CS = L.detail ? 18 : 10
    for (let i = 0; i <= CS; i++) {
      const s = (sEnd * i) / CS
      const { p, out } = at(s)
      pts.push([p[0] + out[0] * 0.15, p[1] + out[1] * 0.15, MAIN_H - 0.2])
    }
    bar(render, pts, 0.5, 0.45, () => [0, 0, 1], L.detail ? [0, 1, 2, 3] : [1, 2, 3], L.detail)
  }

  // the rear's short front to Jiráskovo náměstí, beside Ginger: plain punched windows
  for (let k = 0; k < 7; k++)
    for (const x of [7.2, 8.8]) {
      const c: V3 = [x, 8.4, 6.2 + 2.6 * k]
      if (L.detail) framedWindow(steel, win, c, [1, 0, 0], [0, 0, 1], [0, 1, 0], 0.55, 0.7, 0.12, 0.12)
      else plateWindow(steel, win, c, [1, 0, 0], [0, 0, 1], [0, 1, 0], 0.55, 0.7, 0.12)
    }

  // --- Fred: the round tower, on a column, its windows staggered round the street side ---
  {
    const seg = L.detail ? 36 : 22
    const prof: XY[] = []
    for (let z = GROUND; z <= FRED_TOP + 1e-6; z += (FRED_TOP - GROUND) / 8) prof.push([fredR(z), z])
    lathe(render, FRED[0], FRED[1], prof, seg)
    // the soffit and the roof
    const R0 = fredR(GROUND), R1 = fredR(FRED_TOP)
    const ringAt = (r: number, z: number) => Array.from({ length: seg }, (_, i): XY => [FRED[0] + r * Math.cos((i / seg) * TAU), FRED[1] + r * Math.sin((i / seg) * TAU)])
    for (const [i, j, k] of triangulate(ringAt(R0, GROUND))) {
      const r = ringAt(R0, GROUND)
      triN(render, [r[i][0], r[i][1], GROUND], [r[k][0], r[k][1], GROUND], [r[j][0], r[j][1], GROUND], [0, 0, -1])
    }
    // a rounded cornice lip and the roof inside it
    lathe(render, FRED[0], FRED[1], [[R1, FRED_TOP], [R1 + 0.25, FRED_TOP + 0.15], [R1 + 0.25, FRED_TOP + 0.6], [R1 - 0.3, FRED_TOP + 0.6]], seg)
    lathe(roof, FRED[0], FRED[1], [[R1 - 0.3, FRED_TOP + 0.6], [R1 - 0.3, FRED_TOP + 0.3], [0, FRED_TOP + 0.3]], seg)
    // the column under it (OSM way/319383484) and a second one at the corner
    lathe(render, -7.25, 7.0, [[1.0, 0], [1.0, GROUND]], L.detail ? 16 : 10)
    // the glazed ground floor behind it, set back to the main block's line
    // wavy mouldings round the street side
    const ROWS = 7, PITCH = 2.95, Z0 = 5.3
    const A0 = (35 * Math.PI) / 180, A1 = (262 * Math.PI) / 180
    for (let k = 0; k < ROWS; k++) {
      const steps = L.detail ? 36 : 12
      const pts: V3[] = []
      for (let i = 0; i <= steps; i++) {
        const a = A0 + ((A1 - A0) * i) / steps
        const z = Z0 + PITCH * k - 0.3 + 0.35 * Math.sin(2 * a + 1.3 * k)
        const r = fredR(z) + 0.16
        pts.push([FRED[0] + r * Math.cos(a), FRED[1] + r * Math.sin(a), z])
      }
      bar(render, pts, 0.3, 0.36, () => [0, 0, 1], L.detail ? [0, 1, 2, 3] : [0, 2, 3], L.detail)
      // windows: about 38 degrees apart, every other row shifted half a bay, each nudged
      const step = (38 * Math.PI) / 180
      for (let a = A0 + 0.2 + (k % 2) * step * 0.5; a < A1 - 0.15; a += step) {
        const aa = a + 0.06 * jitter(k * 31 + a)
        const zc = Z0 + PITCH * k + 1.15 + 0.35 * Math.sin(2 * aa + 1.3 * k) + 0.2 * jitter(k * 7 + aa * 3)
        const r = fredR(zc)
        const w: V3 = [Math.cos(aa), Math.sin(aa), 0], u: V3 = [-Math.sin(aa), Math.cos(aa), 0]
        const c: V3 = [FRED[0] + r * w[0], FRED[1] + r * w[1], zc]
        if (L.detail) framedWindow(steel, win, c, u, [0, 0, 1], w, 0.78, 0.9, 0.17, 0.32)
        else plateWindow(steel, win, c, u, [0, 0, 1], w, 0.78, 0.9, 0.17, 0.1)
      }
    }
  }

  // --- Medusa: a tangle of twisted steel ribbons on Fred's roof ---
  {
    const Z = FRED_TOP + 0.6, R = 3.3, H = 4.3
    lathe(steel, FRED[0], FRED[1], [[R + 0.15, Z], [R + 0.15, Z + 0.35], [R - 0.15, Z + 0.35]], L.detail ? 24 : 14)
    const N = L.detail ? 16 : 8, STEPS = L.detail ? 18 : 9
    const W = L.detail ? 0.32 : 0.42, T = L.detail ? 0.1 : 0.16
    for (let i = 0; i < N; i++) {
      const dir = i % 2 ? 1 : -1
      const a0 = (i / N) * TAU + (i % 2) * 0.2
      const twist = dir * (1.6 + 0.25 * jitter(i))
      const reach = 0.86 + 0.08 * jitter(i + 5)
      const pts: V3[] = []
      for (let s = 0; s <= STEPS; s++) {
        const t = (s / STEPS) * reach
        const a = a0 + twist * t
        const r = R * Math.cos((t * Math.PI) / 2) ** 0.75 * (1 + 0.1 * Math.sin(5 * t + i))
        pts.push([FRED[0] + r * Math.cos(a), FRED[1] + r * Math.sin(a), Z + 0.3 + H * Math.sin((t * Math.PI) / 2)])
      }
      bar(steel, pts, W, T, (k) => unit(sub(pts[k], [FRED[0], FRED[1], Z])))
    }
    // wandering bands round the tangle
    const BANDS = L.detail ? 4 : 2
    for (let b = 0; b < BANDS; b++) {
      const tb = 0.25 + (0.5 * b) / Math.max(1, BANDS - 1)
      const S = L.detail ? 28 : 14
      const pts: V3[] = []
      for (let s = 0; s <= S; s++) {
        const a = (s / S) * TAU * 1.05 + b
        const t = tb + 0.12 * Math.sin(3 * a + b)
        const r = R * Math.cos((t * Math.PI) / 2) ** 0.75 + 0.05
        pts.push([FRED[0] + r * Math.cos(a), FRED[1] + r * Math.sin(a), Z + 0.3 + H * Math.sin((t * Math.PI) / 2)])
      }
      bar(steel, pts, W, T, (k) => unit(sub(pts[k], [FRED[0], FRED[1], Z])))
    }
    // loose ends flaring out from the crown and the shoulders
    const LOOSE = L.detail ? 10 : 6
    for (let i = 0; i < LOOSE; i++) {
      const a = (i / LOOSE) * TAU + 0.4 * jitter(i + 11)
      const lift = i % 2 ? 0.55 : 0.85 // shoulder or crown
      const t0 = lift
      const r0 = R * Math.cos((t0 * Math.PI) / 2) ** 0.75
      const z0 = Z + 0.3 + H * Math.sin((t0 * Math.PI) / 2)
      const len = 1.6 + 0.6 * jitter(i + 3)
      const pts: V3[] = []
      const S = L.detail ? 6 : 3
      for (let s = 0; s <= S; s++) {
        const t = s / S
        const ang = a + (i % 2 ? 0.5 : -0.5) * t
        const rr = r0 + len * t * (0.9 + 0.2 * t)
        pts.push([FRED[0] + rr * Math.cos(ang), FRED[1] + rr * Math.sin(ang), z0 + len * (0.9 - 0.3 * t) * t])
      }
      bar(steel, pts, W, T, (k) => unit(sub(pts[k], [FRED[0], FRED[1], Z])))
    }
  }

  // --- Ginger: the pinched glass tower on its legs ---
  {
    const n = L.detail ? 40 : 22
    const zs: number[] = []
    const NZ = L.detail ? 26 : 13
    for (let k = 0; k <= NZ; k++) zs.push(5.0 + ((27.8 - 5.0) * k) / NZ)
    const a0 = Math.PI / 2
    const rings = zs.map((z) => Array.from({ length: n }, (_, i) => gingerPt(z, a0 + (i / n) * TAU)))
    loftSmooth(glass, rings, true)
    // the floors behind the glass, their edges pale
    const slabs = L.detail ? [5.2, 8.0, 10.8, 13.6, 16.4, 19.2, 22.0, 24.8, 27.4] : [8.0, 13.6, 19.2, 24.8]
    for (const z of slabs) {
      const ring = Array.from({ length: n }, (_, i): XY => {
        const p = gingerPt(z, a0 + (i / n) * TAU, 0.35)
        return [p[0], p[1]]
      })
      prism(render, ring, z - 0.3, z, render, L.detail ? render : null)
    }
    // the lit offices inside
    const core = Array.from({ length: 16 }, (_, i): XY => {
      const g = gingerAt(16)
      const a = (i / 16) * TAU
      return [g.cx - 0.3 + (g.rx - 1.4) * Math.cos(a), g.cy - 0.6 + (g.ry - 1.4) * Math.sin(a)]
    })
    prism(win, core, 5.2, 27.1, null)
    // rims: the outline at the bottom, waist and top
    for (const z of [5.0, 14.5, 27.8]) {
      const ring = Array.from({ length: n + 1 }, (_, i) => gingerPt(z, a0 + (i / n) * TAU, -0.05))
      tube(steel, ring, z === 14.5 ? 0.12 : 0.2, L.detail ? 6 : 4, false)
    }
    // mullions running up the curves
    const M = L.detail ? 40 : 10
    for (let m = 0; m < M; m++) {
      const a = a0 + (m / M) * TAU
      const pts = zs.map((z) => gingerPt(z, a, -0.04))
      tube(steel, pts, L.detail ? 0.07 : 0.12, L.detail ? 4 : 3, false)
    }
    // the lobby under the skirt, glazed and lit
    const lob = Array.from({ length: 16 }, (_, i): XY => [2.2 + 3.0 * Math.cos((i / 16) * TAU), 11.0 + 2.9 * Math.sin((i / 16) * TAU)])
    prism(lobby, lob, 0, 5.0, null)
    // ceiling under the skirt
    const ceil = Array.from({ length: n }, (_, i): XY => {
      const p = gingerPt(5.0, a0 + (i / n) * TAU, 0.05)
      return [p[0], p[1]]
    })
    for (const [i, j, k] of triangulate(ceil)) triN(render, [ceil[i][0], ceil[i][1], 5.0], [ceil[k][0], ceil[k][1], 5.0], [ceil[j][0], ceil[j][1], 5.0], [0, 0, -1])
    // the legs (OSM ways 319383486-93): the outer ones lean out to the skirt's rim
    const legs: XY[] = [[5.4, 13.05], [0.7, 13.35], [-1.75, 12.2], [5.45, 15.45], [6.35, 11.45], [2.1, 15.8], [3.25, 14.3], [-0.85, 14.9]]
    const g5 = gingerAt(5.0)
    legs.forEach(([x, y], li) => {
      const a = Math.atan2((y - g5.cy) / g5.ry, (x - g5.cx) / g5.rx)
      const dist = Math.hypot((x - g5.cx) / g5.rx, (y - g5.cy) / g5.ry)
      // the outer legs splay in pairs, each leaning out to the skirt's rim
      const rim = gingerPt(5.0, a + (li % 2 ? 0.32 : -0.32), 0.45)
      const top: V3 = dist > 0.55 ? [rim[0], rim[1], 5.0] : [x, y, 5.0]
      const sides = L.detail ? 8 : 6, r = L.detail ? 0.42 : 0.46
      const ring = (c: V3) => Array.from({ length: sides }, (_, i): V3 => [c[0] + r * Math.cos((i / sides) * TAU), c[1] + r * Math.sin((i / sides) * TAU), c[2]])
      loftSmooth(render, [ring([x, y, 0]), ring(top)], true)
    })
    // the terrace at the waist (OSM way/456783392) and its struts
    const terr: XY[] = [[-2.0, 14.5], [-3.3, 14.4], [-4.7, 15.4], [-5.5, 12.8], [-3.4, 12.5], [-2.4, 12.3]].reverse() as XY[]
    prism(render, terr, 13.6, 15.0, render, render)
    rod(render, [-4.9, 14.6, 13.6], [-1.6, 13.6, 9.6], 0.22, 6)
    rod(render, [-5.2, 13.2, 13.6], [-2.4, 12.4, 9.4], 0.22, 6)
  }

  // --- the glazed bar on the roof, behind Fred ---
  {
    const n = L.detail ? 10 : 6
    const x0 = -5.0, x1 = 6.5, y0 = -2.0, y1 = 5.5, r = (y1 - y0) / 2, yc = (y0 + y1) / 2
    const rings: V3[][] = []
    for (const x of [x0, x1]) rings.push(Array.from({ length: n + 1 }, (_, i) => [x, yc + r * Math.cos((i / n) * Math.PI), MAIN_H + 0.7 + 0.55 * r * Math.sin((i / n) * Math.PI)] as V3))
    loftSmooth(glass, [rings[1], rings[0]], false)
    for (const x of [x0, x1]) {
      const pts = Array.from({ length: n + 1 }, (_, i): XY => [yc + r * Math.cos((i / n) * Math.PI), MAIN_H + 0.7 + 0.55 * r * Math.sin((i / n) * Math.PI)])
      for (let i = 1; i < n; i++) {
        const tri: V3[] = [[x, pts[0][0], pts[0][1]], [x, pts[i][0], pts[i][1]], [x, pts[i + 1][0], pts[i + 1][1]]]
        if (x === x1) triN(glass, tri[0], tri[1], tri[2], [1, 0, 0])
        else triN(glass, tri[0], tri[2], tri[1], [-1, 0, 0])
      }
    }
  }

  const fredLit = (p: V3, n: V3) => (Math.hypot(p[0] - FRED[0], p[1] - FRED[1]) < 5.6 && n[2] < 0.6 ? 0.75 : n[2] < 0.6 && p[0] < -8 ? 0.35 : 0)
  return [
    { part: render, material: { ...finish('dancing-render', 0xe8e3d8), floodlight: fredLit } },
    { part: win, material: PALETTE.window },
    { part: steel, material: { ...finish('dancing-steel', 0x8e9599), floodlight: (p: V3) => (p[2] > FRED_TOP ? 0.6 : 0) } },
    { part: glass, material: { name: 'glass', color: 0x7fb6d4, roughness: 0.2, opacity: 0.42, doubleSided: true } },
    { part: roof, material: PALETTE.roof },
    { part: lobby, material: PALETTE.entrance },
  ]
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

if (import.meta.main) {
  await saveLods(
    'prague-dancing-house',
    'Dancing House',
    build({ detail: false }),
    build({ detail: true }),
    { anchor: [50.07543, 14.41417], bearing: 0, height: 32.0 },
  )
}
