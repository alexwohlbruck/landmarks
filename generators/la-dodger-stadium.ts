/**
 * Dodger Stadium, Los Angeles (1962, Emil Praeger) — procedural, CC0-1.0.
 * bun generators/la-dodger-stadium.ts
 *
 * Map frame: x across the field, y from home plate out to centre field, z up,
 * metres. Placed at bearing 27°, home plate to centre field (the symmetry
 * axis of the LARIAC 2020 grandstand footprint and of OSM way/1353249584,
 * fitted by mirror distance). The anchor is the area centroid of OSM
 * way/1353249584 (leisure=stadium, the grandstand and both pavilions).
 * y = 0 is the playing field (152.8 m, USGS 3DEP), the lowest ground under
 * the footprint. The stadium is cut into Chavez Ravine: outside the stands
 * the parking lots sit 25-28 m above the field on the sides and about 40 m
 * behind home plate, so the back of the stands runs down to y = 0 inside
 * the hill and only its top shows above the lots.
 *
 * What makes it Dodger Stadium, from above: the tiered horseshoe of stands
 * (yellow field and loge levels, pale blue reserve and top deck, blue
 * fascias between them), the white zigzag canopy along the top of the
 * stands, the two low outfield pavilions under their own zigzag roofs, and
 * the hexagonal video boards on the light standards behind them.
 *
 * Sources:
 * - Plan: LARIAC 2020 building footprint 2014092851630000 (the grandstand:
 *   field wall, ends and outer plaza edge, in this frame); OSM
 *   way/1353249584 and its 60 building:parts (the pavilions: seating steps
 *   way/1348907079 and way/1348911406, back blocks way/1348907080 and
 *   way/1348911644, 28 skillion roof panels 12-13 m, 28 roof posts).
 *   USGS NAIP orthophoto for the tier boundaries and colours from above.
 * - Heights: LA County 2006 lidar surface model on a 4 m grid in this frame,
 *   over 3DEP bare earth. Stands: field level 0-10 m, a step to the loge
 *   at 18 m, the reserve and top deck to the back row at 36-40 m, the
 *   canopy and its lights at 41-47 m; the back of the stands is 91-98 m
 *   from a point 20 m behind home plate, widening to 120 m along the
 *   straight sides. Pavilions 2-12 m, video boards and light banks 41 m.
 * - Photos (Wikimedia Commons / Flickr): "Dodger Stadium from the Air"
 *   (kla4067, CC BY 2.0; from the north-east, behind centre field), "Aerial
 *   view of Dodger Stadium, April 2024" (Pi.1415926535, CC BY-SA 4.0),
 *   "Dodger Stadium field from upper deck 2015-10-04" (Junkyardsparkle,
 *   CC0), "Dodger Stadium from Top Deck evening 2021-06-28" (DukeOfDelTaco,
 *   CC BY-SA 4.0), Ken Lund's 2008 and 2014 series (CC BY-SA 2.0: the
 *   pavilion's zigzag roof, the hexagonal board, the canopy over the top
 *   deck), "Dodger Stadium (16188933601)" (redlegsfan21, CC BY-SA 2.0).
 * - Estimated: the tier fractions between field wall and back row (from the
 *   lidar steps along five rays), the canopy depth and the height of its
 *   zigzag, the board size (about 24 × 11 m, from photos against the
 *   pavilion roof panels), the light standards' posts.
 * - Left out: seat rows and aisles, the foul poles, signage, the
 *   centre-field plaza and its bridge (2020), the stairs and ramps outside,
 *   the parking-level plazas, which are paving at grade.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const yellow = new Part(), blue = new Part(), fascia = new Part()
const concrete = new Part(), white = new Part(), screen = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A quad wound to face `hint`, optionally with per-corner normals. */
function quad(p: Part, P: V3[], hint: V3, ns?: V3[]) {
  const face = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const f2 = cross(sub(P[2], P[0]), sub(P[3], P[0]))
  const ord = dot(add(face, f2), hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const n = ns?.map(unit)
  const t = (a: number, b: number, c: number) => {
    const A = P[ord[a]], B = P[ord[b]], C = P[ord[c]]
    if (Math.hypot(...cross(sub(B, A), sub(C, A))) < 1e-9) return
    p.tri(A, B, C, undefined, undefined, undefined, n && [n[ord[a]], n[ord[b]], n[ord[c]]])
  }
  t(0, 1, 2)
  t(0, 2, 3)
}
function tri(p: Part, A: V3, B: V3, C: V3, hint: V3) {
  const f = cross(sub(B, A), sub(C, A))
  if (dot(f, hint) >= 0) p.tri(A, B, C)
  else p.tri(A, C, B)
}

/** An oriented box: centre, three unit axes, half extents. Closed. */
function box(p: Part, c: V3, ax: [V3, V3, V3], h: [number, number, number]) {
  const P = (a: number, b: number, d: number) => add(add(add(c, mul(ax[0], a * h[0])), mul(ax[1], b * h[1])), mul(ax[2], d * h[2]))
  for (let i = 0; i < 3; i++) for (const s of [1, -1]) {
    const o = [0, 1, 2].filter(x => x !== i)
    const corner = (a: number, b: number) => {
      const v = [0, 0, 0]
      v[i] = s; v[o[0]] = a; v[o[1]] = b
      return P(v[0], v[1], v[2])
    }
    quad(p, [corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)], mul(ax[i], s))
  }
}

// ---------------------------------------------------------------------------
// Grandstand plan. Both curves are given for the east half (x ≥ 0) and
// mirrored, and read along rays from C, a point on the axis 20 m behind the
// field centre, so the stands stay exactly symmetrical.

const C: XY = [0, -20]
// The field wall: LARIAC inner edge, smoothed, from behind home plate to the
// end of the stand by the foul pole.
const INNER: XY[] = [[0, -51.5], [8, -50.3], [14, -46.5], [19, -41], [24, -36], [30, -26], [35, -15], [46, 7], [58, 20], [70, 32], [71, 40], [69, 50]]
// The back of the stands (top row): the lidar ridge, out to the end of the
// stand beside the pavilion.
const BACK: XY[] = [[0, -115], [32.1, -108.3], [59.1, -90.5], [78.8, -65.5], [88.9, -43.8], [98, -20], [108.3, -0.9], [118.4, 23.1], [119.9, 49.2], [121, 71]]

const full = (h: XY[]): XY[] => [...h.slice(1).reverse().map(([x, y]) => [-x, y] as XY), ...h]
const IN = full(INNER), BK = full(BACK)
const angOf = ([x, y]: XY) => Math.atan2(x - C[0], -(y - C[1]))
/** Where a ray from C at angle a (0 = straight behind home, + towards +x) meets a polyline. */
function onRay(poly: XY[], a: number): XY {
  const d: XY = [Math.sin(a), -Math.cos(a)]
  let best: XY | null = null, bt = Infinity
  for (let i = 0; i < poly.length - 1; i++) {
    const [x1, y1] = poly[i], [x2, y2] = poly[i + 1]
    const ex = x2 - x1, ey = y2 - y1, den = d[0] * ey - d[1] * ex
    if (Math.abs(den) < 1e-12) continue
    const qx = x1 - C[0], qy = y1 - C[1]
    const t = (qx * ey - qy * ex) / den, s = (qx * d[1] - qy * d[0]) / den
    if (t > 0 && s >= -1e-6 && s <= 1 + 1e-6 && t < bt) { bt = t; best = [C[0] + d[0] * t, C[1] + d[1] * t] }
  }
  if (!best) throw new Error(`no hit at ${a}`)
  return best
}
const A_IN = angOf(INNER[INNER.length - 1]), A_BK = angOf(BACK[BACK.length - 1])

const N = 56 // segments round the horseshoe
const S = Array.from({ length: N + 1 }, (_, k) => -1 + (2 * k) / N)
const inPt = S.map(s => onRay(IN, s * A_IN))
const bkPt = S.map(s => onRay(BK, s * A_BK))

// Back-row height: 40 m behind home plate, 36 m along the sides (lidar).
const H = S.map(s => {
  const a = Math.min(Math.abs(s * A_BK) / ((60 * Math.PI) / 180), 1)
  return 36 + 4 * Math.cos((a * Math.PI) / 2) ** 2
})
/** A point at fraction t from the field wall to the back row, at height z. */
const ring = (k: number, t: number, z: number): V3 => [
  inPt[k][0] + (bkPt[k][0] - inPt[k][0]) * t,
  inPt[k][1] + (bkPt[k][1] - inPt[k][1]) * t,
  z,
]
/** Outward horizontal direction at sample k. */
const outDir = (k: number): V3 => unit([bkPt[k][0] - inPt[k][0], bkPt[k][1] - inPt[k][1], 0])

/**
 * A band round the horseshoe between two rings, each given as (t, z/H)
 * or a function. `face` is the side it faces: 'in' (towards the field and
 * up), 'out' or 'up'.
 */
type RingSpec = (k: number) => V3
function band(p: Part, lo: RingSpec, hi: RingSpec, face: 'in' | 'out' | 'up' | 'down') {
  for (let k = 0; k < N; k++) {
    const o = mul(add(outDir(k), outDir(k + 1)), 0.5)
    const hint: V3 = face === 'up' ? [0, 0, 1] : face === 'down' ? [0, 0, -1] : face === 'in' ? add(mul(o, -1), [0, 0, 0.3]) : o
    quad(p, [lo(k), lo(k + 1), hi(k + 1), hi(k)], hint)
  }
}
const at = (t: number, f: number, dz = 0): RingSpec => k => ring(k, t, H[k] * f + dz)

// Tiers, as fractions of the way from the field wall to the back row (t)
// and of the back-row height (f): the lidar steps along five rays.
const T1 = 0.5, T2 = 0.6, T3 = 0.84
const WALL = 1.6
band(fascia, k => ring(k, 0, 0), k => ring(k, 0, WALL), 'in') // padded field wall
band(yellow, k => ring(k, 0, WALL), at(T1, 0.24), 'in') // field level
band(fascia, at(T1, 0.24), at(T1, 0.4), 'in') // loge fascia
band(yellow, at(T1, 0.4), at(T2, 0.575), 'in') // loge
band(fascia, at(T2, 0.575), at(T2, 0.65), 'in') // club / reserve fascia
band(blue, at(T2, 0.65), at(T3, 0.775), 'in') // reserve
band(fascia, at(T3, 0.775), at(T3, 0.825), 'in') // top deck fascia
band(blue, at(T3, 0.825), at(1, 1), 'in') // top deck
// Back wall: a parapet, then the concrete back of the stands down into the hill.
const PAR = 1.1
const outAt = (k: number, d: number, z: number): V3 => add(ring(k, 1, z), mul(outDir(k), d))
band(concrete, at(1, 1), at(1, 1, PAR), 'in')
band(concrete, at(1, 1, PAR), k => outAt(k, 1.2, H[k] + PAR), 'up')
band(concrete, k => outAt(k, 1.2, 0), k => outAt(k, 1.2, H[k] + PAR), 'out')

// The ends of the stand, beside the pavilions: the seating profile closed
// down to the field.
for (const k of [0, N]) {
  const prof: V3[] = [
    ring(k, 0, 0), ring(k, 0, WALL), ring(k, T1, H[k] * 0.24), ring(k, T1, H[k] * 0.4), ring(k, T2, H[k] * 0.575),
    ring(k, T2, H[k] * 0.65), ring(k, T3, H[k] * 0.775), ring(k, T3, H[k] * 0.825), ring(k, 1, H[k]), ring(k, 1, H[k] + PAR),
    outAt(k, 1.2, H[k] + PAR), outAt(k, 1.2, 0),
  ]
  const along: V3 = unit(sub(k === 0 ? ring(1, 0.5, 0) : ring(N - 1, 0.5, 0), ring(k, 0.5, 0)))
  const hint = mul(along, -1)
  for (let i = 0; i < prof.length - 2; i++) {
    const a = prof[i], b = prof[i + 1]
    quad(concrete, [a, b, [b[0], b[1], 0], [a[0], a[1], 0]], hint)
  }
}

// ---------------------------------------------------------------------------
// The canopy over the back of the top deck: a thin white folded plate, its
// front edge zigzagging up and down every sample, carried out over the back
// wall. Light banks stand on it at the ends and twice along each side.

const CT = 0.87 // front edge, as a fraction t
const canopyZ = (k: number, front: boolean) => H[k] + (front ? (k % 2 ? 6.4 : 3.8) : 5.0)
const cFront = (k: number, dz = 0): V3 => ring(k, CT, canopyZ(k, true) + dz)
const cBack = (k: number, dz = 0): V3 => outAt(k, 2.6, canopyZ(k, false) + dz)
const TH = 0.7
for (let k = 0; k < N; k++) {
  const o = mul(add(outDir(k), outDir(k + 1)), 0.5)
  quad(white, [cFront(k), cFront(k + 1), cBack(k + 1), cBack(k)], [0, 0, 1])
  quad(white, [cFront(k, -TH), cFront(k + 1, -TH), cBack(k + 1, -TH), cBack(k, -TH)], [0, 0, -1])
  quad(white, [cFront(k, -TH), cFront(k + 1, -TH), cFront(k + 1), cFront(k)], mul(o, -1))
  quad(white, [cBack(k, -TH), cBack(k + 1, -TH), cBack(k + 1), cBack(k)], o)
}
for (const k of [0, N]) {
  const along: V3 = unit(sub(k === 0 ? cBack(1) : cBack(N - 1), cBack(k)))
  quad(white, [cFront(k, -TH), cBack(k, -TH), cBack(k), cFront(k)], mul(along, -1))
}
// Posts under the canopy's front edge, every fourth sample.
for (let k = 2; k < N; k += 4) {
  const base = ring(k, CT + 0.01, H[k] * 0.98)
  const top = ring(k, CT + 0.01, canopyZ(k, true) - TH)
  const h = (top[2] - base[2]) / 2
  box(white, [base[0], base[1], base[2] + h], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0.35, 0.35, h])
}

/** A bank of floodlights on posts: a white box tipped towards the field. */
function lightBank(c: V3, toField: V3, w: number, zBase: number) {
  const f = unit([toField[0], toField[1], 0])
  const side: V3 = unit(cross([0, 0, 1], f))
  const tilt = (20 * Math.PI) / 180
  const nrm = add(mul(f, Math.cos(tilt)), [0, 0, -Math.sin(tilt)])
  const upv = add(mul(f, Math.sin(tilt)), [0, 0, Math.cos(tilt)])
  box(white, c, [side, nrm, upv], [w / 2, 0.6, 1.6])
  for (const s of [-0.32, 0.32]) {
    const px = add(c, mul(side, s * w))
    const h = (c[2] - 1.2 - zBase) / 2
    box(white, [px[0], px[1], zBase + h], [side, f, [0, 0, 1]], [0.45, 0.45, h])
  }
}
const deg = Math.PI / 180
for (const a of [41, 79, 116]) for (const sg of [-1, 1]) {
  const s = (sg * a * deg) / A_BK
  const k = Math.round(((s + 1) / 2) * N)
  const p = ring(k, 1, 0)
  const c: V3 = [p[0], p[1], canopyZ(k, false) + 4.2]
  lightBank(c, mul(outDir(k), -1), 13, canopyZ(k, false))
}

// The deck behind home plate, level with the top row: the top-deck concourse,
// built out to the LARIAC edge over the entrance below.
{
  const ks: number[] = []
  for (let k = 0; k <= N; k++) if (Math.abs(S[k] * A_BK) <= 22 * deg) ks.push(k)
  const edge = (k: number) => onRay(full([[0, -132.5], [30, -128.5], [52, -118]]), S[k] * A_BK)
  for (let i = 0; i < ks.length - 1; i++) {
    const k = ks[i], j = ks[i + 1]
    const a = outAt(k, 1.2, H[k]), b = outAt(j, 1.2, H[j])
    const ea = edge(k), eb = edge(j)
    const A: V3 = [ea[0], ea[1], H[k]], B: V3 = [eb[0], eb[1], H[j]]
    quad(concrete, [a, b, B, A], [0, 0, 1])
    quad(concrete, [[A[0], A[1], 0], [B[0], B[1], 0], B, A], [ea[0] - C[0], ea[1] - C[1], 0])
  }
  for (const k of [ks[0], ks[ks.length - 1]]) {
    const e = edge(k), a = outAt(k, 1.2, H[k])
    const t: V3 = [-(e[1] - C[1]), e[0] - C[0], 0]
    quad(concrete, [[a[0], a[1], 0], [e[0], e[1], 0], [e[0], e[1], H[k]], a], k < N / 2 ? t : mul(t, -1))
  }
}

// ---------------------------------------------------------------------------
// Outfield pavilions (OSM, west one; the east one is its mirror): raked
// seats from the outfield wall to the back row at 8 m, a back block, and a
// white zigzag roof of folded panels over the back rows.

const PF: XY[] = [[-65.5, 55.1], [-62.4, 57.5], [-47.4, 69.2], [-34.4, 76.9], [-22.2, 82.4], [-11, 86.4], [-9.9, 89.4]]
const PB: XY[] = [[-76.7, 67.7], [-68.9, 73.7], [-60.9, 79.8], [-53, 85], [-48.4, 87.9], [-43.6, 90.4], [-38.8, 92.9], [-34, 95], [-29.1, 97.2], [-24.2, 99.1], [-19, 101.1], [-13.7, 103]]
const PO: XY[] = [[-81.2, 72.9], [-77.3, 76.1], [-73.3, 79.3], [-69.2, 82.5], [-65.2, 85.4], [-60.8, 88.3], [-56.6, 91], [-51.7, 93.8], [-46.9, 96.7], [-41.9, 99.2], [-36.8, 101.6], [-31.8, 103.7], [-26.5, 105.8], [-21.1, 107.7], [-15.5, 109.6]]
/** A polyline resampled to n+1 points evenly along its length. */
function resample(poly: XY[], n: number): XY[] {
  const cum = [0]
  for (let i = 1; i < poly.length; i++) cum.push(cum[i - 1] + Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]))
  const out: XY[] = []
  let j = 0
  for (let k = 0; k <= n; k++) {
    const s = (k / n) * cum[cum.length - 1]
    while (j < poly.length - 2 && cum[j + 1] < s) j++
    const f = (s - cum[j]) / (cum[j + 1] - cum[j] || 1)
    out.push([poly[j][0] + (poly[j + 1][0] - poly[j][0]) * f, poly[j][1] + (poly[j + 1][1] - poly[j][1]) * f])
  }
  return out
}
const M = 14 // roof panels per pavilion, as in OSM
const pf = resample(PF, M), pb = resample(PB, M), po = resample(PO, M)
const PZF = 2.4, PZB = 8, ROOF_HI = 13.8, ROOF_LO = 11.4

for (const sx of [1, -1]) {
  const P = ([x, y]: XY, z: number): V3 => [sx * x, y, z]
  const toOut = (i: number): V3 => unit([sx * (po[i][0] - pf[i][0]), po[i][1] - pf[i][1], 0])
  for (let i = 0; i < M; i++) {
    const o = mul(add(toOut(i), toOut(i + 1)), 0.5)
    // outfield wall, seats, back block top, back wall
    quad(fascia, [P(pf[i], 0), P(pf[i + 1], 0), P(pf[i + 1], PZF), P(pf[i], PZF)], mul(o, -1))
    quad(yellow, [P(pf[i], PZF), P(pf[i + 1], PZF), P(pb[i + 1], PZB), P(pb[i], PZB)], add(mul(o, -1), [0, 0, 1]))
    quad(concrete, [P(pb[i], PZB), P(pb[i + 1], PZB), P(po[i + 1], PZB), P(po[i], PZB)], [0, 0, 1])
    quad(concrete, [P(po[i], 0), P(po[i + 1], 0), P(po[i + 1], PZB), P(po[i], PZB)], o)
  }
  for (const i of [0, M]) {
    const along: V3 = unit(sub(P(pb[i === 0 ? 1 : M - 1], 0), P(pb[i], 0)))
    const h = mul(along, -1)
    quad(concrete, [P(pf[i], 0), P(pb[i], 0), P(pb[i], PZB), P(pf[i], PZF)], h)
    quad(concrete, [P(pb[i], 0), P(po[i], 0), P(po[i], PZB), P(pb[i], PZB)], h)
  }
  // Roof: from 3 m in front of the back row to 1 m past the back wall.
  const rf = pb.map((p, i): XY => {
    const d = toOut(i)
    return [p[0] - sx * d[0] * 3, p[1] - d[1] * 3]
  })
  const rb = po.map((p, i): XY => {
    const d = toOut(i)
    return [p[0] + sx * d[0] * 1, p[1] + d[1] * 1]
  })
  const rz = (i: number) => (i % 2 ? ROOF_LO : ROOF_HI)
  const RT = 0.5
  for (let i = 0; i < M; i++) {
    const o = mul(add(toOut(i), toOut(i + 1)), 0.5)
    quad(white, [P(rf[i], rz(i)), P(rf[i + 1], rz(i + 1)), P(rb[i + 1], rz(i + 1)), P(rb[i], rz(i))], [0, 0, 1])
    quad(white, [P(rf[i], rz(i) - RT), P(rf[i + 1], rz(i + 1) - RT), P(rb[i + 1], rz(i + 1) - RT), P(rb[i], rz(i) - RT)], [0, 0, -1])
    quad(white, [P(rf[i], rz(i) - RT), P(rf[i + 1], rz(i + 1) - RT), P(rf[i + 1], rz(i + 1)), P(rf[i], rz(i))], mul(o, -1))
    quad(white, [P(rb[i], rz(i) - RT), P(rb[i + 1], rz(i + 1) - RT), P(rb[i + 1], rz(i + 1)), P(rb[i], rz(i))], o)
  }
  for (const i of [0, M]) {
    const along: V3 = unit(sub(P(rb[i === 0 ? 1 : M - 1], 0), P(rb[i], 0)))
    quad(white, [P(rf[i], rz(i) - RT), P(rb[i], rz(i) - RT), P(rb[i], rz(i)), P(rf[i], rz(i))], mul(along, -1))
  }
  // Posts at the back wall, at every valley of the roof.
  for (let i = 1; i < M; i += 2) {
    const q = P(po[i], 0), h = (rz(i) - RT - PZB) / 2
    box(white, [q[0], q[1], PZB + h], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0.35, 0.35, h])
  }

  // The hexagonal video board on its light standard behind the pavilion
  // (lidar peak 41 m at x = ±55, y = 97), facing home plate.
  const bc: V3 = [sx * -55, 98, 0]
  const f = unit([0 - bc[0], -30 - bc[1], 0]) // towards the infield
  const side: V3 = unit(cross([0, 0, 1], f))
  const W = 24, Z0 = 16.5, Z1 = 28, D = 1.4, CH = 3.6
  const zm = (Z0 + Z1) / 2
  const hex = (d: number, inset: number): V3[] => {
    const w = W / 2 - inset, c = CH - inset * 0.6, z0 = Z0 + inset, z1 = Z1 - inset
    const pts: [number, number][] = [[-w, zm], [-w + c, z0], [w - c, z0], [w, zm], [w - c, z1], [-w + c, z1]]
    return pts.map(([s, z]) => add(add(bc, mul(side, s)), add(mul(f, d), [0, 0, z])) as V3)
  }
  const front = hex(D / 2, 0), backF = hex(-D / 2, 0)
  for (let i = 0; i < 6; i++) {
    const j = (i + 1) % 6
    const mid = mul(add(front[i], front[j]), 0.5)
    quad(white, [front[i], front[j], backF[j], backF[i]], sub(mid, [bc[0], bc[1], zm]))
  }
  for (let i = 1; i < 5; i++) {
    tri(white, front[0], front[i], front[i + 1], f)
    tri(white, backF[0], backF[i], backF[i + 1], mul(f, -1))
  }
  const scr = hex(D / 2 + 0.05, 0.9)
  for (let i = 1; i < 5; i++) tri(screen, scr[0], scr[i], scr[i + 1], f)
  // Light standard: two posts behind the board up to a lamp bank at 38-41 m.
  for (const s of [-6, 6]) {
    const q = add(add(bc, mul(side, s)), mul(f, -1.6))
    box(white, [q[0], q[1], 19.8], [side, f, [0, 0, 1]], [0.55, 0.55, 19.8])
  }
  const lb = add(bc, mul(f, -0.6))
  lightBank([lb[0], lb[1], 39.6], f, 20, 39.6)
}

// ---------------------------------------------------------------------------
// Palette. The seats are Dodger Stadium's pastels as they read from above:
// the yellow field and loge levels and the pale blue reserve and top deck,
// both pulled to the palette's lightness; the fascias and walls are Dodger
// blue, softened. Concrete is `stone`, canopies, roofs, boards' frames and
// light standards are white `trim`, the board screens `window`.
const parts = [
  { part: yellow, material: finish('dodger-seat-yellow', 0xe6cf8f) },
  { part: blue, material: finish('dodger-seat-blue', 0xa9c2d0) },
  { part: fascia, material: finish('dodger-blue', 0x5f86b8) },
  { part: concrete, material: PALETTE.stone },
  { part: white, material: PALETTE.trim },
  { part: screen, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Dodger Stadium', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 27, osm: 'way/1353249584',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/la-dodger-stadium.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
