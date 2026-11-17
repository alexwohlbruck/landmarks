/**
 * One Blackfriars ("the Vase"), 1 Blackfriars Road, Southwark — original
 * procedural geometry, CC0-1.0.
 * bun generators/london-one-blackfriars.ts
 *
 * Map frame, unturned (BEARING 0): +x east, +y north, z up, metres. Origin =
 * centroid of the OSM outline way/389881291.
 *
 * Evidence
 * - OSM way/389881291 (outline = the widest plan, at 100–107 m; height 163,
 *   52 levels, wikidata Q2893700) and its 28 parts way/771700358–385: one
 *   12-sided plan every two storeys (6.29 m), drawn here as LEVELS. The plan
 *   is a rounded, lopsided triangle: a near-vertical north-east side and round
 *   north corner, and a south-west side that swells by 6.5 m (west) and 12.8 m
 *   (south) between the foot and 107 m, then pulls in fast to the top.
 *   The top four parts (144.8–163 m) step in to a peak near the middle.
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0: peak 164.9 m above the lowest ground under the footprint at about
 *   (1, 1); north edge 150–154 m, east shoulder 154–158 m, the south and
 *   south-west faces of the crown falling about 2 m per metre to 134–142 m at
 *   the edge. Returns are missing over the north-west quarter of the roof.
 * - Published: 163 m to roof (CTBUH), 170 m (Wikipedia, to the top of the
 *   crown's glass fins), 50/52 storeys, SimpsonHaugh, 2018.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "One Blackfriars, 2023.jpg", Thomas Dahlstrøm Nielsen, CC BY-SA 4.0 —
 *     from the north bank: the swell and the faceted pale glass;
 *   "London Blackfriars Railway Bridge and One Blackfriars seen from
 *     Millennium Bridge.jpg", Ymblanter, CC BY-SA 4.0 — distant, from the
 *     north-east: the whole silhouette;
 *   "One Blackfriars, London as seen from the Thames (2026).jpg",
 *     ThatsTheBoss, CC0 — from the north-west: the north side's near-vertical
 *     line and the rounded top;
 *   "One Blackfriars 1.jpg", kallerna, CC BY-SA 4.0 — from Blackfriars Road
 *     (south): the south-west bulge and the base;
 *   "One Blackfriars, OXO Tower, Shard, South Bank Tower and 240 Blackfriars
 *     Road.jpg", Acabashi, CC BY-SA 4.0 — from the north-west, the sloped top.
 *
 * Measured: plan at every second storey (OSM parts), the roof inside the
 * crown (lidar, 164.9 m peak; the lidar edge readings of 141–153 m are the
 * roof seen through the glass fins, not the fins' tops).
 * Published: 170 m to the fins' high point, used for the slanted cut
 * (170 m at the north-east, estimated 160 m at the south-west, from the
 * photos' sloping top line); storeys.
 * Estimated: the crown roof where lidar has no returns (north-west quarter);
 * rounding of the plan's corners (two passes of corner cutting on the
 * 12-gons); the pleats, drawn as 32 facets round the plan (3.0–3.9 m wide)
 * whose edges are pushed alternately 0.3 m out and in, so neighbouring
 * facets tilt opposite ways and catch the light differently, as the
 * faceted glass does in the north-bank and Millennium Bridge photos; faint
 * floor lines every four storeys (the photos show a floor joint at every
 * storey); the fin crown (one 0.45 m glass fin per facet, narrow gaps,
 * leaning in 14% toward the peak to round the shoulder); the glass
 * colour; the two-storey (6.3 m) lobby, glazed and set back 1.4 m under a
 * pale fascia.
 * Not modelled: the separate low pavilion on the south-east (its own OSM
 * building, not in this outline).
 */
import { Part, writeGlb, addGltfTriangles, cross, sub, type V3 } from './mesh'
import { PALETTE } from './palette'

const BEARING = 0
const ANCHOR = { lng: -0.1048636, lat: 51.5078651 }

/** [min_height, height, plan] for way/771700385 (foot) … way/771700363 (138.5–144.8 m). */
const LEVELS: [number, number, [number, number][]][] = [
  [0, 6.29, [[12.26, -6.02], [2.78, -12.63], [-3.53, -9.70], [-10.10, -8.04], [-13.22, 3.06], [-3.17, 19.31], [-0.03, 22.42], [4.16, 23.86], [8.58, 23.32], [12.30, 20.92], [14.59, 17.14], [14.98, 12.74]]],
  [6.29, 12.59, [[12.34, -6.51], [2.67, -13.43], [-3.80, -10.42], [-10.54, -8.71], [-13.61, 2.76], [-3.13, 19.56], [0.03, 22.70], [4.25, 24.14], [8.67, 23.60], [12.42, 21.19], [14.72, 17.38], [15.10, 12.97]]],
  [12.59, 18.88, [[12.42, -7.01], [2.57, -14.23], [-4.07, -11.13], [-10.97, -9.39], [-14.00, 2.45], [-3.08, 19.83], [0.09, 22.97], [4.33, 24.41], [8.78, 23.87], [12.54, 21.45], [14.85, 17.64], [15.24, 13.20]]],
  [18.88, 25.18, [[12.51, -7.51], [2.47, -15.03], [-4.34, -11.86], [-11.41, -10.07], [-14.40, 2.16], [-3.03, 20.08], [0.15, 23.24], [4.41, 24.70], [8.88, 24.15], [12.66, 21.72], [14.97, 17.88], [15.37, 13.42]]],
  [25.18, 31.47, [[12.59, -8.01], [2.36, -15.83], [-4.61, -12.58], [-11.85, -10.75], [-14.79, 1.86], [-2.99, 20.33], [0.21, 23.51], [4.49, 24.98], [8.98, 24.43], [12.78, 21.98], [15.10, 18.12], [15.50, 13.66]]],
  [31.47, 37.76, [[12.67, -8.50], [2.26, -16.63], [-4.89, -13.30], [-12.28, -11.42], [-15.18, 1.56], [-2.94, 20.59], [0.27, 23.78], [4.57, 25.26], [9.08, 24.70], [12.89, 22.25], [15.24, 18.38], [15.63, 13.88]]],
  [37.76, 44.06, [[12.76, -9.00], [2.15, -17.43], [-5.16, -14.03], [-12.71, -12.10], [-15.58, 1.25], [-2.91, 20.81], [0.32, 24.02], [4.64, 25.49], [9.17, 24.93], [13.00, 22.47], [15.35, 18.58], [15.74, 14.07]]],
  [44.06, 50.35, [[12.84, -9.50], [2.05, -18.23], [-5.43, -14.75], [-13.15, -12.77], [-15.96, 0.95], [-2.90, 20.98], [0.35, 24.20], [4.68, 25.69], [9.24, 25.13], [13.08, 22.65], [15.44, 18.74], [15.85, 14.21]]],
  [50.35, 56.65, [[12.92, -10.00], [1.95, -19.03], [-5.71, -15.47], [-13.59, -13.45], [-16.36, 0.65], [-2.88, 21.15], [0.38, 24.39], [4.73, 25.87], [9.31, 25.32], [13.17, 22.82], [15.54, 18.91], [15.94, 14.35]]],
  [56.65, 62.94, [[13.01, -10.49], [1.84, -19.83], [-5.98, -16.20], [-14.02, -14.12], [-16.75, 0.35], [-2.86, 21.33], [0.41, 24.57], [4.78, 26.07], [9.37, 25.51], [13.25, 23.01], [15.64, 19.06], [16.04, 14.49]]],
  [62.94, 69.23, [[13.10, -10.99], [1.73, -20.63], [-6.25, -16.92], [-14.46, -14.79], [-17.14, 0.04], [-2.85, 21.50], [0.44, 24.76], [4.84, 26.26], [9.44, 25.70], [13.34, 23.19], [15.73, 19.23], [16.14, 14.63]]],
  [69.23, 75.53, [[13.18, -11.49], [1.63, -21.43], [-6.53, -17.64], [-14.90, -15.48], [-17.54, -0.25], [-2.83, 21.67], [0.47, 24.95], [4.88, 26.46], [9.51, 25.90], [13.43, 23.36], [15.83, 19.39], [16.24, 14.77]]],
  [75.53, 81.82, [[13.26, -11.99], [1.52, -22.23], [-6.80, -18.37], [-15.33, -16.15], [-17.93, -0.55], [-2.85, 21.68], [0.46, 24.97], [4.88, 26.48], [9.53, 25.92], [13.45, 23.39], [15.86, 19.41], [16.26, 14.77]]],
  [81.82, 88.12, [[13.34, -12.48], [1.42, -23.03], [-7.07, -19.09], [-15.77, -16.83], [-18.32, -0.85], [-2.87, 21.69], [0.44, 24.99], [4.88, 26.50], [9.53, 25.94], [13.46, 23.40], [15.88, 19.41], [16.29, 14.77]]],
  [88.12, 94.41, [[13.43, -12.98], [1.32, -23.83], [-7.34, -19.80], [-16.21, -17.50], [-18.71, -1.15], [-2.89, 21.71], [0.43, 25.01], [4.88, 26.53], [9.54, 25.96], [13.48, 23.42], [15.90, 19.42], [16.31, 14.76]]],
  [94.41, 100.7, [[13.51, -13.48], [1.21, -24.62], [-7.61, -20.53], [-16.64, -18.18], [-19.11, -1.46], [-2.91, 21.72], [0.42, 25.02], [4.87, 26.55], [9.55, 25.98], [13.50, 23.43], [15.92, 19.42], [16.34, 14.76]]],
  [100.7, 107, [[13.59, -13.98], [1.11, -25.43], [-7.89, -21.25], [-17.08, -18.85], [-19.50, -1.76], [-2.93, 21.73], [0.41, 25.05], [4.87, 26.57], [9.55, 26.01], [13.52, 23.45], [15.95, 19.43], [16.36, 14.76]]],
  [107, 113.29, [[13.28, -13.07], [1.44, -23.94], [-7.41, -19.95], [-16.36, -17.50], [-18.67, -1.28], [-2.77, 21.62], [0.51, 24.87], [4.88, 26.37], [9.49, 25.81], [13.37, 23.31], [15.76, 19.36], [16.16, 14.77]]],
  [113.29, 119.59, [[12.82, -11.70], [1.93, -21.68], [-6.67, -17.96], [-15.26, -15.47], [-17.43, -0.55], [-2.56, 21.46], [0.64, 24.64], [4.91, 26.10], [9.39, 25.54], [13.18, 23.10], [15.51, 19.26], [15.89, 14.78]]],
  [119.59, 125.88, [[12.37, -10.32], [2.41, -19.44], [-5.94, -15.98], [-14.16, -13.45], [-16.20, 0.18], [-2.34, 21.31], [0.77, 24.39], [4.93, 25.82], [9.29, 25.29], [12.98, 22.90], [15.25, 19.16], [15.63, 14.81]]],
  [125.88, 132.17, [[11.92, -8.95], [2.90, -17.18], [-5.20, -13.99], [-13.07, -11.41], [-14.96, 0.91], [-2.13, 21.15], [0.90, 24.15], [4.95, 25.54], [9.19, 25.02], [12.78, 22.70], [14.99, 19.06], [15.36, 14.83]]],
  [132.17, 138.47, [[11.47, -7.57], [3.37, -14.94], [-4.48, -12.01], [-11.97, -9.39], [-13.73, 1.65], [-1.91, 20.99], [1.03, 23.92], [4.97, 25.27], [9.10, 24.76], [12.59, 22.50], [14.73, 18.96], [15.10, 14.84]]],
  [138.47, 144.76, [[11.02, -6.19], [3.86, -12.68], [-3.74, -10.03], [-10.87, -7.35], [-12.49, 2.38], [-1.50, 20.72], [1.29, 23.49], [5.02, 24.76], [8.92, 24.28], [12.24, 22.15], [14.27, 18.80], [14.61, 14.89]]],
]

/** Two passes of corner cutting: soft corners, same vertex order on every level. */
function chaikin(p: [number, number][], n = 2): [number, number][] {
  for (let k = 0; k < n; k++) {
    const q: [number, number][] = []
    for (let i = 0; i < p.length; i++) {
      const a = p[i], b = p[(i + 1) % p.length]
      q.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]])
    }
    p = q
  }
  return p
}
// OSM rings run clockwise; reverse to anticlockwise from above.
const raw = LEVELS.map(([, , p]) => chaikin(p).reverse())
// The parts are linear steps of a curved surface: smooth each vertex's path
// up the height (three [1 2 1] passes, foot and top held), so the swell
// turns as a curve, not a kink at 107 m.
let plans = raw
for (let pass = 0; pass < 3; pass++)
  plans = plans.map((p, k) => k === 0 || k === plans.length - 1 ? p
    : p.map(([x, y], i) => [(plans[k - 1][i][0] + 2 * x + plans[k + 1][i][0]) / 4, (plans[k - 1][i][1] + 2 * y + plans[k + 1][i][1]) / 4] as [number, number]))

// --- Resample every level to M facets by arc length (same start corner on every level) ---
const M = 32 // facets round the plan: 3.0–3.9 m wide
function resample(p: [number, number][]): [number, number][] {
  const cum = [0]
  for (let i = 1; i <= p.length; i++) cum.push(cum[i - 1] + Math.hypot(p[i % p.length][0] - p[i - 1][0], p[i % p.length][1] - p[i - 1][1]))
  const L = cum[p.length], out: [number, number][] = []
  let k = 0
  for (let m = 0; m < M; m++) {
    const s = (m / M) * L
    while (cum[k + 1] < s) k++
    const t = (s - cum[k]) / (cum[k + 1] - cum[k]), a = p[k], b = p[(k + 1) % p.length]
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
  }
  return out
}
const flat = plans.map(resample)

/** Pleats: each facet edge alternately pushed out and in, so neighbouring facets tilt opposite ways. */
const PLEAT = 0.3
function pleat(p: [number, number][], amp = PLEAT): [number, number][] {
  return p.map(([x, y], m) => {
    const a = p[(m + M - 1) % M], b = p[(m + 1) % M]
    let nx = b[1] - a[1], ny = -(b[0] - a[0])
    const l = Math.hypot(nx, ny) || 1
    nx /= l
    ny /= l
    const s = m % 2 === 0 ? amp : -amp
    return [x + nx * s, y + ny * s]
  })
}

// --- The crown: from the top full ring up to the peak (lidar) ---
const PEAK: [number, number] = [1.5, 1.0], ZPEAK = 164.9
/** Edge height and profile exponent by compass direction from the peak (E, NE, N, NW, W, SW, S, SE). */
const EDGE = [153, 153, 151, 147, 142, 141.6, 141.6, 143]
const POW = [3.0, 2.7, 2.4, 1.9, 1.4, 1.1, 1.1, 1.6]
function dirTable(t: number[], x: number, y: number) {
  const a = ((Math.atan2(y - PEAK[1], x - PEAK[0]) / (Math.PI / 4)) % 8 + 8) % 8
  const i = Math.floor(a), f = a - i
  return t[i] * (1 - f) + t[(i + 1) % 8] * f
}

// Ring stack: lobby top, then each part's plan at its mid-height, the top ring at its edge height.
type Ring = V3[]
const LOBBY = 6.29 // the two-storey glazed lobby, recessed under the tower
const rings: Ring[] = []
rings.push(pleat(flat[0]).map(([x, y]) => [x, y, LOBBY] as V3))
LEVELS.slice(1, -1).forEach(([z0, z1], k) => rings.push(pleat(flat[k + 1]).map(([x, y]) => [x, y, (z0 + z1) / 2] as V3)))
const top = flat[flat.length - 1]
const edgeZ = top.map(([x, y]) => dirTable(EDGE, x, y))
rings.push(pleat(top).map(([x, y], i) => [x, y, edgeZ[i]] as V3))

const glass = new Part()
const lines = new Part()
const lobby = new Part()
const roof = new Part()
const fins = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function quadOut(p: Part, a: V3, b: V3, c: V3, d: V3, hint: V3) {
  const n = cross(sub(c, a), sub(d, b))
  if (dot(n, hint) >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}
const outward = (a: V3, b: V3): V3 => [b[1] - a[1], -(b[0] - a[0]), 0]

// --- Pleated glass walls ---
for (let k = 0; k < rings.length - 1; k++) {
  const r0 = rings[k], r1 = rings[k + 1]
  for (let i = 0; i < M; i++) {
    const j = (i + 1) % M
    quadOut(glass, r0[i], r0[j], r1[j], r1[i], outward(r0[i], r0[j]))
  }
}

// --- Lobby: recessed glazing, a soffit and a pale fascia under the first pleats ---
{
  const inset = (p: [number, number][], d: number) => p.map(([x, y], m) => {
    const a = p[(m + M - 1) % M], b = p[(m + 1) % M]
    const nx = b[1] - a[1], ny = -(b[0] - a[0]), l = Math.hypot(nx, ny) || 1
    return [x - (nx / l) * d, y - (ny / l) * d] as [number, number]
  })
  const inner = inset(flat[0], 1.4), outer = pleat(flat[0])
  const FASCIA = 1.0
  for (let i = 0; i < M; i++) {
    const j = (i + 1) % M
    const I = (m: number, z: number): V3 => [inner[m][0], inner[m][1], z], O = (m: number, z: number): V3 => [outer[m][0], outer[m][1], z]
    quadOut(lobby, I(i, 0), I(j, 0), I(j, LOBBY - FASCIA), I(i, LOBBY - FASCIA), outward(I(i, 0), I(j, 0)))
    quadOut(lines, I(i, LOBBY - FASCIA), I(j, LOBBY - FASCIA), O(j, LOBBY - FASCIA), O(i, LOBBY - FASCIA), [0, 0, -1])
    quadOut(lines, O(i, LOBBY - FASCIA), O(j, LOBBY - FASCIA), O(j, LOBBY), O(i, LOBBY), outward(O(i, 0), O(j, 0)))
  }
}

// --- Crown: sloped glass shoulders to a roof plateau (lidar), ringed by glass fins ---
const S = [1, 0.8, 0.62, 0.4]
const crown = S.map((s, n) => (n === 0 ? rings[rings.length - 1] : top.map(([x, y]) => {
  const p = dirTable(POW, x, y), e = dirTable(EDGE, x, y)
  return [PEAK[0] + (x - PEAK[0]) * s, PEAK[1] + (y - PEAK[1]) * s, ZPEAK - (ZPEAK - e) * s ** p] as V3
})))
for (let k = 0; k < crown.length - 1; k++)
  for (let i = 0; i < M; i++) {
    const j = (i + 1) % M
    quadOut(roof, crown[k][i], crown[k][j], crown[k + 1][j], crown[k + 1][i], [0, 0, 1])
  }
{
  const last = crown[crown.length - 1], apex: V3 = [PEAK[0], PEAK[1], ZPEAK]
  for (let i = 0; i < M; i++) {
    const j = (i + 1) % M
    const t: [V3, V3, V3] = [last[i], last[j], apex]
    if (dot(cross(sub(t[1], t[0]), sub(t[2], t[0])), [0, 0, 1]) >= 0) roof.tri(...t)
    else roof.tri(t[0], t[2], t[1])
  }
}
/**
 * The fins' top: the slanted cut, 170 m at the north-east high point
 * (published), 160 m at the south-west. The fins are glass, so the lidar
 * reads the roof inside them (EDGE), not their tops.
 */
const NE: [number, number] = [Math.SQRT1_2, Math.SQRT1_2]
function finTop(x: number, y: number) {
  const dx = x - PEAK[0], dy = y - PEAK[1], l = Math.hypot(dx, dy) || 1
  return 165 + 5 * ((dx * NE[0] + dy * NE[1]) / l)
}
{
  // One fin per facet, continuing the pleated facade above the roof edge, with narrow gaps.
  const R = crown[0]
  const T = 0.45, GAP = 0.18 // thickness; gap as a share of the facet
  for (let i = 0; i < M; i++) {
    const j = (i + 1) % M
    const a = R[i], b = R[j]
    const p0: V3 = [a[0] + (b[0] - a[0]) * GAP / 2, a[1] + (b[1] - a[1]) * GAP / 2, 0]
    const p1: V3 = [b[0] + (a[0] - b[0]) * GAP / 2, b[1] + (a[1] - b[1]) * GAP / 2, 0]
    const n = outward(a, b), l = Math.hypot(n[0], n[1])
    const o: [number, number] = [(n[0] / l) * T / 2, (n[1] / l) * T / 2]
    const z0a = a[2] + (b[2] - a[2]) * GAP / 2 - 0.4, z0b = b[2] + (a[2] - b[2]) * GAP / 2 - 0.4
    const z1a = finTop(p0[0], p0[1]), z1b = finTop(p1[0], p1[1])
    // The fins lean in toward the peak, rounding the shoulder as the photos show.
    const LEAN = 0.86
    const inl = (p: V3): V3 => [PEAK[0] + (p[0] - PEAK[0]) * LEAN, PEAK[1] + (p[1] - PEAK[1]) * LEAN, 0]
    const q0 = inl(p0), q1 = inl(p1)
    const P = (p: V3, s: number, z: number): V3 => [p[0] + o[0] * s, p[1] + o[1] * s, z]
    const oa0 = P(p0, 1, z0a), ob0 = P(p1, 1, z0b), ob1 = P(q1, 1, z1b), oa1 = P(q0, 1, z1a)
    const ia0 = P(p0, -1, z0a), ib0 = P(p1, -1, z0b), ib1 = P(q1, -1, z1b), ia1 = P(q0, -1, z1a)
    const out: V3 = [n[0], n[1], 0], inn: V3 = [-n[0], -n[1], 0], tan: V3 = [b[0] - a[0], b[1] - a[1], 0], ntan: V3 = [a[0] - b[0], a[1] - b[1], 0]
    quadOut(fins, oa0, ob0, ob1, oa1, out)
    quadOut(fins, ia0, ib0, ib1, ia1, inn)
    quadOut(fins, oa1, ob1, ib1, ia1, [0, 0, 1])
    quadOut(fins, ob0, ib0, ib1, ob1, tan)
    quadOut(fins, oa0, ia0, ia1, oa1, ntan)
  }
}

// --- Faint floor lines every four storeys, on each facet ---
function ringAt(z: number): Ring {
  let k = 0
  while (k < rings.length - 2 && rings[k + 1][0][2] < z) k++
  const a = rings[k], b = rings[k + 1]
  return a.map((p, m) => {
    const t = Math.min(1, Math.max(0, (z - p[2]) / (b[m][2] - p[2])))
    return [p[0] + (b[m][0] - p[0]) * t, p[1] + (b[m][1] - p[1]) * t, z] as V3
  })
}
for (let z = 4 * 3.145 + LOBBY - 0.3; z < 136; z += 4 * 3.145) {
  const r0 = ringAt(z), r1 = ringAt(z + 0.45)
  for (let i = 0; i < M; i++) {
    const j = (i + 1) % M
    const n = outward(r0[i], r0[j]), l = Math.hypot(n[0], n[1])
    const o = (p: V3): V3 => [p[0] + (n[0] / l) * 0.07, p[1] + (n[1] / l) * 0.07, p[2]]
    quadOut(lines, o(r0[i]), o(r0[j]), o(r1[j]), o(r1[i]), n)
  }
}

function smooth(p: Part, crease: number): Part {
  const out = new Part()
  const n = p.pos.length / 3
  addGltfTriangles(out, new Float32Array(p.pos), Uint32Array.from({ length: n }, (_, i) => i), { creaseDegrees: crease })
  return out
}

const HEIGHT = 170
const parts = [
  // Pleated: the crease keeps each facet flat across its width and smooth up the height.
  { part: smooth(glass, 3), material: { ...PALETTE.window, color: 0x9fb5c8 } },
  { part: lines, material: { ...PALETTE.trim, color: 0xdfe5ea } },
  { part: lobby, material: PALETTE.entrance },
  { part: smooth(roof, 30), material: PALETTE.roof },
  { part: fins, material: { ...PALETTE.glass, color: 0xb6c8d6 } },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('One Blackfriars', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: HEIGHT,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/389881291', ...Array.from({ length: 28 }, (_, i) => `way/${771700358 + i}`)],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/london-one-blackfriars.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
