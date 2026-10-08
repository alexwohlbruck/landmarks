/**
 * Walt Disney Concert Hall (2003, Frank Gehry), Los Angeles — original
 * procedural geometry, CC0-1.0.
 * bun generators/la-disney-concert-hall.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the outline's centroid
 * on the lowest ground under it (the Hope St / 2nd St corner). Placed at
 * bearing 38°, so the block is square to this frame: +x faces Grand Avenue,
 * +y faces 1st Street, −x Hope Street, −y 2nd Street.
 *
 * The building: a concert hall whose auditorium (its roof a broad, gently
 * dished white surface, turned about 30° to the street grid) is wrapped in
 * curved, brushed stainless-steel "sails". They lean outward and overlap:
 * two tall book-like sails with a glass slot between them face the main
 * entrance at the 1st & Grand corner; a tall bulging sail stands at the
 * south end of Grand with layered, curling sails sweeping across the Grand
 * lobby below it; a pair of tall sails faces the garden to the south-west; a
 * broad rounded sail faces Hope St; a leaning drum stands beside the main
 * entrance with a low curved wall (the one carrying the hall's name) along
 * the plaza. The rest of the block is a limestone podium carrying a raised
 * garden, with a five-storey stone wing along 2nd St.
 *
 * Sources:
 * - Plan: OSM relation/6333150 (outer way/425993488, inner courtyard
 *   way/425993505); the building:parts inside it are the Keck children's
 *   amphitheatre in the garden (way/319307757, way/319307763).
 * - Heights and the sails' plan: LA County LARIAC 2006 lidar surface model
 *   (Elevation MapServer layer 8), sampled on a 1.5 m grid in this frame.
 *   Lowest ground under the outline (3DEP-style bare earth, LARIAC layer 7):
 *   111.85 m, at Hope & 2nd; Grand Ave is ≈ 6 m above it and 1st St ≈ 9 m.
 *   Measured over y = 0: the book sails' tops 45–46.5 m, the south-west
 *   sails 43–44 m, the Hope St sail ≈ 40 m, the tall Grand sail ≈ 41 m, the
 *   lower Grand sails 22–27 m, the drum ≈ 31 m, the 2nd St wing 24 m, the
 *   garden deck 16–17 m. The auditorium roof is fitted to the lidar
 *   (z = 37.35 − 0.026p + 0.0055p² − 0.0035q + 0.0002q² + 0.0006pq, p and q
 *   across and along the hall; rms 1.3 m): lowest mid-hall at ≈ 37 m,
 *   rising toward both ends. LARIAC 2020 footprint 486079842670 gives a
 *   roof elevation of 155.8 m (≈ 44 m over y = 0), consistent.
 * - The sails' count, lean, curl and order: photos (Wikimedia Commons),
 *   matched to the lidar plan by their camera positions —
 *   Grand Ave face: "Disney Concert Hall by Carol Highsmith" (public
 *   domain), "Walt Disney Concert Hall" (Antoine Taveneaux, CC BY-SA 3.0),
 *   "Walt Disney Concert Hall Across Grand" (Arturoramos, CC BY 3.0);
 *   from the 2nd & Grand corner: "Walt Disney Concert Hall 2013" (Tuxyso,
 *   CC BY-SA 3.0), "Walt Disney Concert Hall, LA, CA, jjron 22.03.2012"
 *   (jjron, GFDL 1.2), "Los Angeles, California (September 8, 2022) - 074"
 *   (Another Believer, CC BY-SA 4.0); main entrance at 1st & Grand: "Walt
 *   Disney Concert Hall Building ... (149226095)" (Giuseppe Milo, CC BY 3.0),
 *   "Walt Disney Concert Hall July 2022" (Benoît Prieur, CC0); from 1st St:
 *   "Walt Disney Concert Hall - panoramio (17)" (Андрей Бобровский, CC BY
 *   3.0); from above (City Hall): "Walt Disney Concert Hall and surrounding
 *   area" (Geographer, CC BY-SA 2.5), "View of Walt Disney Concert Hall from
 *   LA City Hall" (Levi Clancy, CC BY-SA 4.0). USGS NAIP orthophoto for the
 *   roof's outline and the garden.
 * - Estimated: each sail's lean (2–4 m at the top) and curl, read from the
 *   photos; where a sail's base meets the podium (hidden behind lower
 *   sails); the Hope St sail's shape (seen in NAIP and from above, few
 *   street photos of that side); the lobby glass heights. The lidar is from
 *   2006, three years after completion, so it shows the finished building.
 * - Left out: the lettering, the stairs, the garden's trees, the rose
 *   fountain, the small skylights on the auditorium roof.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const steel = new Part(), stone = new Part(), roof = new Part(), garden = new Part(), glass = new Part(), slot = new Part()

const BEARING = 38

// ---------- small vector helpers ----------
const sub2 = (a: XY, b: XY): XY => [a[0] - b[0], a[1] - b[1]]
const add2 = (a: XY, b: XY, k = 1): XY => [a[0] + b[0] * k, a[1] + b[1] * k]
const len2 = (a: XY) => Math.hypot(a[0], a[1])
const unit2 = (a: XY): XY => { const l = len2(a) || 1; return [a[0] / l, a[1] / l] }
const at = (p: XY, z: number): V3 => [p[0], p[1], z]
const n3 = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

/** Catmull–Rom resampling of an open polyline to n points. */
function smooth(pts: XY[], n: number): XY[] {
  if (pts.length === 2) return Array.from({ length: n }, (_, i) => add2(pts[0], sub2(pts[1], pts[0]), i / (n - 1)))
  const segs = pts.length - 1
  const out: XY[] = []
  for (let i = 0; i < n; i++) {
    const f = (i / (n - 1)) * segs, k = Math.min(segs - 1, Math.floor(f)), t = f - k
    const p0 = pts[Math.max(0, k - 1)], p1 = pts[k], p2 = pts[k + 1], p3 = pts[Math.min(pts.length - 1, k + 2)]
    const c = (a: number, b: number, c_: number, d: number) =>
      0.5 * (2 * b + (-a + c_) * t + (2 * a - 5 * b + 4 * c_ - d) * t * t + (-a + 3 * b - 3 * c_ + d) * t * t * t)
    out.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])])
  }
  return out
}

/** A polygon's walls and flat top; the ring is counter-clockwise. */
function prism(part: Part, top: Part, ring: XY[], z0: number, z1: number) {
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    part.quad(at(a, z0), at(b, z0), at(b, z1), at(a, z1))
  }
  capPoly(top, ring, z1)
}

/** Ear-clipping cap for a simple counter-clockwise polygon, facing up. */
function capPoly(part: Part, ring: XY[], z: number) {
  const idx = ring.map((_, i) => i)
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) >= 0 && cr(b, c, p) >= 0 && cr(c, a, p) >= 0
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const ia = idx[(k + idx.length - 1) % idx.length], ib = idx[k], ic = idx[(k + 1) % idx.length]
      const a = ring[ia], b = ring[ib], c = ring[ic]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inTri(ring[j], a, b, c))) continue
      part.tri(at(a, z), at(b, z), at(c, z))
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) part.tri(at(ring[idx[0]], z), at(ring[idx[1]], z), at(ring[idx[2]], z))
}

// ---------- the sails ----------
/**
 * One stainless sail: a curved shell over a base line, its outward side on
 * the right of the base line's direction. It rises from z0 to `top` (a
 * height per end and a dip in the middle: the book sails' tops are
 * concave), leaning out by `lean` at the top with a flare that grows toward
 * the top, bulging out by `bulge` in the middle of its run, and with its
 * ends spreading sideways by `spread` at the top, as a book's covers open.
 */
type Sail = {
  base: XY[]; z0: number; top: [number, number]; dip?: number
  lean: number; bulge?: number; spread?: number; flare?: number; thick?: number; n?: number; k?: number
  /** The curled-back top: how far it runs toward the hall, and the height it falls to. */
  depth?: number; back?: number
}
const HALL_C: XY = [0, 3]
function sail(s0: Sail, part = steel) {
  // Turn the base line round if needed so its right-hand side faces away
  // from the hall: that side is the sail's outside, which it leans toward.
  const m = s0.base[Math.floor(s0.base.length / 2)], d = sub2(s0.base[s0.base.length - 1], s0.base[0])
  const right: XY = [d[1], -d[0]], away = sub2(m, HALL_C)
  const s = right[0] * away[0] + right[1] * away[1] >= 0 ? s0 : { ...s0, base: [...s0.base].reverse(), top: [s0.top[1], s0.top[0]] as [number, number] }
  const n = s.n ?? 9, K = s.k ?? 5, thick = s.thick ?? 0.7, flare = s.flare ?? 1.8
  const pts = smooth(s.base, n)
  const tang = pts.map((_, i) => unit2(sub2(pts[Math.min(n - 1, i + 1)], pts[Math.max(0, i - 1)])))
  const nrm = tang.map((t): XY => [t[1], -t[0]])
  const grid: V3[][] = [], inner: V3[][] = []
  for (let k = 0; k <= K; k++) {
    const sk = k / K, row: V3[] = [], irow: V3[] = []
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1)
      const zTop = s.top[0] + (s.top[1] - s.top[0]) * t - (s.dip ?? 0) * 4 * t * (1 - t)
      const z = s.z0 + (zTop - s.z0) * sk
      const out = (s.bulge ?? 0) * 4 * t * (1 - t) + s.lean * Math.pow(sk, flare)
      const side = (s.spread ?? 0) * Math.pow(sk, 1.5) * (2 * t - 1)
      const p = add2(add2(pts[i], nrm[i], out), tang[i], side)
      row.push(at(p, z))
      irow.push(at(add2(p, nrm[i], -thick), z))
    }
    grid.push(row)
    inner.push(irow)
  }
  // smooth normals from the grid's partial derivatives
  const normalAt = (g: V3[][], k: number, i: number, flip: boolean): V3 => {
    const di = sub3(g[k][Math.min(n - 1, i + 1)], g[k][Math.max(0, i - 1)])
    const dk = sub3(g[Math.min(K, k + 1)][i], g[Math.max(0, k - 1)][i])
    const c = n3(cross3(di, dk))
    return flip ? [-c[0], -c[1], -c[2]] : c
  }
  for (let k = 0; k < K; k++) for (let i = 0; i < n - 1; i++) {
    const a = grid[k][i], b = grid[k][i + 1], c = grid[k + 1][i + 1], d = grid[k + 1][i]
    const na = normalAt(grid, k, i, false), nb = normalAt(grid, k, i + 1, false), nc = normalAt(grid, k + 1, i + 1, false), nd = normalAt(grid, k + 1, i, false)
    // base line runs with the outside on its right, so (b − a) × up points
    // outward; wind so the face looks out
    part.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
    part.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
    const ia = inner[k][i], ib = inner[k][i + 1], ic = inner[k + 1][i + 1], id = inner[k + 1][i]
    const ma = normalAt(inner, k, i, true), mb = normalAt(inner, k, i + 1, true), mc = normalAt(inner, k + 1, i + 1, true), md = normalAt(inner, k + 1, i, true)
    part.tri(ia, ic, ib, undefined, undefined, undefined, [ma, mc, mb])
    part.tri(ia, id, ic, undefined, undefined, undefined, [ma, md, mc])
  }
  // The sail's top edge curls back over the hall and slopes down into it,
  // closing the sail into a volume: from above the steel reads as
  // overlapping curved leaves, never a thin edge. The cap runs back `depth`
  // toward the hall's middle, rising a little first, then falling to `back`.
  {
    const toward = (p: V3): XY => unit2(sub2(HALL_C, [p[0], p[1]]))
    const mean = (s.top[0] + s.top[1]) / 2
    const back = s.back ?? Math.max(s.z0 + 2, mean >= 36 ? Math.min(35, mean - 7) : mean - 6)
    const mid = grid[K][Math.floor(n / 2)]
    const depth = s.depth ?? (mean >= 36 ? 0.62 : 0.3) * len2(sub2(HALL_C, [mid[0], mid[1]]))
    const rows: V3[][] = [grid[K]]
    for (const [f, lift] of [[0.35, 0.6], [0.75, -0.45], [1, -1]] as [number, number][]) {
      rows.push(grid[K].map((p) => {
        const d = toward(p), dz = lift > 0 ? lift : 0, fall = lift < 0 ? -lift : 0
        return [p[0] + d[0] * depth * f, p[1] + d[1] * depth * f, p[2] + dz + (back - p[2]) * fall] as V3
      }))
    }
    for (let r = 0; r < rows.length - 1; r++) for (let i = 0; i < n - 1; i++) {
      const a = rows[r][i], b = rows[r][i + 1], c = rows[r + 1][i + 1], d = rows[r + 1][i]
      // wound to face up
      const up = cross3(sub3(b, a), sub3(d, a))[2] > 0
      if (up) part.quad(a, b, c, d); else part.quad(a, d, c, b)
    }
    // the cap's back edge drops to the sail's foot, so no gap shows behind
    const last = rows[rows.length - 1]
    for (let i = 0; i < n - 1; i++) {
      const a = last[i], b = last[i + 1]
      part.quad(a, b, [b[0], b[1], s.z0], [a[0], a[1], s.z0])
      part.quad(b, a, [a[0], a[1], s.z0], [b[0], b[1], s.z0])
    }
  }
  // rim along the top and the bottom, and the two ends
  for (let i = 0; i < n - 1; i++) {
    part.quad(grid[K][i], grid[K][i + 1], inner[K][i + 1], inner[K][i])
    part.quad(grid[0][i], inner[0][i], inner[0][i + 1], grid[0][i + 1])
  }
  for (let k = 0; k < K; k++) {
    part.quad(grid[k][0], grid[k + 1][0], inner[k + 1][0], inner[k][0])
    part.quad(grid[k][n - 1], inner[k][n - 1], inner[k + 1][n - 1], grid[k + 1][n - 1])
  }
}

// ---------- the auditorium roof ----------
const roofZ = (u: number, v: number) => {
  const p = 0.455 * u + 0.891 * v, q = 0.891 * u - 0.455 * v
  return 37.35 - 0.02622 * p + 0.00553 * p * p - 0.00346 * q + 0.00022 * q * q + 0.00062 * p * q
}

// The auditorium: a rectangle about 46 × 68 m turned 29° from the grid,
// from the orthophoto (corrected for its lean by the 2nd St wing's offset)
// and the lidar. Its walls follow the roof's curve.
// Its ends are pulled 5 m inside the end sails, which stand in front of them.
const HALL: XY[] = [[-5.4, 39.1], [-34.6, -13.1], [4.4, -36.1], [34.6, 12.1]]
{
  const NU = 6, NV = 8
  const P = (i: number, j: number): XY => {
    // bilinear over the rectangle: i along the short side, j along the long
    const s = i / NU, t = j / NV
    const a = add2(HALL[1], sub2(HALL[2], HALL[1]), s), b = add2(HALL[0], sub2(HALL[3], HALL[0]), s)
    return add2(a, sub2(b, a), t)
  }
  // The lidar's 37–44 m over the hall is the sails and their curled-back tops; the roof itself is drawn lower.
  // What shows between the sails' caps: three tilted planes along the hall,
  // the two ends sloping up toward the end sails, kept under them.
  const Z = (p: XY) => {
    const t = ((p[0] - HALL[1][0]) * (HALL[0][0] - HALL[1][0]) + (p[1] - HALL[1][1]) * (HALL[0][1] - HALL[1][1])) / ((HALL[0][0] - HALL[1][0]) ** 2 + (HALL[0][1] - HALL[1][1]) ** 2)
    return t < 0.3 ? 35 - 3 * (t / 0.3) : t > 0.7 ? 32 + 3.5 * ((t - 0.7) / 0.3) : 32
  }
  for (let i = 0; i < NU; i++) for (let j = 0; j < NV; j++) {
    const a = P(i, j), b = P(i + 1, j), c = P(i + 1, j + 1), d = P(i, j + 1)
    roof.quad(at(a, Z(a)), at(b, Z(b)), at(c, Z(c)), at(d, Z(d)))
  }
  // walls round the edge, counter-clockwise
  const edge: XY[] = []
  for (let i = 0; i < NU; i++) edge.push(P(i, 0))
  for (let j = 0; j < NV; j++) edge.push(P(NU, j))
  for (let i = NU; i > 0; i--) edge.push(P(i, NV))
  for (let j = NV; j > 0; j--) edge.push(P(0, j))
  for (let k = 0; k < edge.length; k++) {
    const a = edge[k], b = edge[(k + 1) % edge.length]
    roof.quad(at(a, 0), at(b, 0), at(b, Z(b)), at(a, Z(a)))
  }
}

// The lobbies and foyers round the hall, under the sails: a lower mass whose
// flat top (steel: from above it reads with the sails) shows between them (counter-clockwise, from the
// lidar's outline of the whole).
const LOBBY: XY[] = [
  [-12, 40], [-26, 32], [-29, 26], [-29, 0], [-28, -14], [-20, -21], [-6, -30], [6, -36],
  [14, -32], [36, -26], [44, -21], [44, -6], [44, 8], [43, 18], [24, 34], [20, 37.5], [-3, 44],
]
prism(roof, roof, LOBBY, 0, 18)

// ---------- the sails ----------
// Each is a curved panel flaring outward like a petal: vertical at its foot,
// its top 3–8 m out past its base. Tops step from the lidar's 46 m over the
// entrance down to about 20 m toward 2nd St and Hope St, with gaps and
// overlaps between them, so the silhouette is jagged and layered.
const SAILS: Sail[] = [
  // the two book sails over the 1st & Grand entrance, a glass slot between
  { base: [[-3, 44.5], [9, 42.5], [20.5, 38.5]], z0: 10, top: [46.5, 45], dip: 2.2, lean: 7, bulge: -1.8, spread: 4 },
  { base: [[24.5, 35], [35, 28], [44, 19]], z0: 10, top: [44.5, 46.5], dip: 2.2, lean: 7, bulge: -1.8, spread: 4 },
  // low curls in front of each book sail
  { base: [[-4, 49], [5, 47.5], [14, 44]], z0: 8, top: [21, 16], lean: 7, bulge: 1.5, flare: 2.4, spread: 3 },
  { base: [[29, 40], [37, 34.5], [45, 26]], z0: 8, top: [17, 23], lean: 8, bulge: 1.5, flare: 2.4, spread: 3 },
  // Grand Ave: a tall sail behind the lobby, and the lobby's curling sails
  { base: [[36, 13], [39, 3], [38, -9]], z0: 18, top: [40, 44], lean: 7, bulge: -1.5, spread: 3.5, dip: 2 },
  { base: [[43, 21], [46, 8], [46, -7]], z0: 9, top: [23, 19], lean: 8, bulge: 1.8, flare: 2.4, spread: 3 },
  { base: [[48, 2], [49, -10], [47.5, -22]], z0: 7, top: [14, 17], lean: 6, bulge: 1.2, flare: 2.2, spread: 3 },
  // the tall bulging sail at the south end of Grand
  { base: [[41, -11], [43, -20], [40, -30]], z0: 8, top: [33, 42], lean: 7, bulge: 3, spread: 3 },
  // the low sails stepping down to the 2nd & Grand corner
  { base: [[38, -32], [28, -35], [17, -37]], z0: 6, top: [24, 19], lean: 5, bulge: 1.5, flare: 2.2 },
  // the pair of tall sails facing the garden, south-west, and lower ones in front
  { base: [[7, -37.5], [0, -34], [-6.5, -30.5]], z0: 16, top: [41.5, 44], dip: 1.8, lean: 6, bulge: -1.2, spread: 3 },
  { base: [[-9, -29.5], [-19, -23], [-28.5, -15]], z0: 16, top: [44, 40], dip: 2, lean: 6, bulge: -1.2, spread: 3 },
  { base: [[12, -43], [3, -41], [-6, -37]], z0: 16, top: [27, 31], lean: 6, bulge: 1.2, flare: 2.2, spread: 2 },
  { base: [[-14, -34], [-24, -28], [-33, -20]], z0: 16, top: [30, 24], lean: 6, bulge: 1.2, flare: 2.2, spread: 2 },
  // Hope St: a broad rounded sail stepping down, a low one in front
  { base: [[-31, -11], [-32.5, 3], [-32, 17], [-29, 29]], z0: 16, top: [32, 38], lean: 5, bulge: 3.5, spread: 2 },
  { base: [[-36, -4], [-37.5, 8], [-36, 21]], z0: 16, top: [24, 21], lean: 5, bulge: 1.5, flare: 2.2 },
  // the north-west sail, rising toward the book sails
  { base: [[-28, 33], [-17, 40], [-6, 45]], z0: 16, top: [30, 40], lean: 5, bulge: 1.0, spread: 2 },
  // the low wall along the plaza that carries the hall's name
  { base: [[14, 47.5], [20.5, 56], [22.5, 64], [31, 71.5]], z0: 12, top: [24, 21], lean: 2.6, bulge: 1.8, k: 3, depth: 4, back: 18 },
]
SAILS.forEach((s) => sail(s))

// the glass slot between the book sails
slot.quad([23.4, 35.9, 12], [21.6, 37.4, 12], [21.6, 37.4, 43.5], [23.4, 35.9, 43.5])

// the drum beside the main entrance: a leaning, flaring bowl
{
  const N = 16, c0: XY = [4.5, 56.5], c1: XY = [7, 58], r0 = 8, r1 = 11.5, z0 = 0, z1 = 31
  const K = 4
  const pt = (i: number, k: number): V3 => {
    const t = k / K, a = (i / N) * 2 * Math.PI
    const c = add2(c0, sub2(c1, c0), Math.pow(t, 1.5)), r = r0 + (r1 - r0) * Math.pow(t, 1.5)
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z0 + (z1 + 3.5 * Math.sin(a - 0.6) * t - z0) * t] // the rim tilts, higher toward the hall
  }
  for (let k = 0; k < K; k++) for (let i = 0; i < N; i++) {
    const a = pt(i, k), b = pt(i + 1, k), cc = pt(i + 1, k + 1), d = pt(i, k + 1)
    const nr = (p: V3, q: number): V3 => n3([p[0] - c0[0] - (c1[0] - c0[0]) * q, p[1] - c0[1] - (c1[1] - c0[1]) * q, -0.15])
    steel.tri(a, b, cc, undefined, undefined, undefined, [nr(a, k / K), nr(b, k / K), nr(cc, (k + 1) / K)])
    steel.tri(a, cc, d, undefined, undefined, undefined, [nr(a, k / K), nr(cc, (k + 1) / K), nr(d, (k + 1) / K)])
  }
  for (let i = 0; i < N; i++) roof.tri(pt(i, K), pt(i + 1, K), [c1[0], c1[1], z1])
}

// ---------- the podium ----------
// The garden deck along Hope St and the south, its walls limestone, its top
// the raised garden.
const DECK: XY[] = [
  [-45.2, -54.1], [17.2, -54.1], [17.2, -48.7], [28, -48.7], [28, -31], [10, 0], [10, 38], [-2, 44],
  [-9.4, 44.5], [-7.7, 48.8], [-6.6, 53.8], [-7.3, 57], [-9.8, 61.6], [-12.9, 66.3], [-18.3, 66],
  [-25, 60.4], [-27.9, 51.9], [-33.8, 49.2], [-39.8, 49], [-39.5, 65.1], [-45.1, 65.2],
]
prism(stone, garden, DECK, 0, 16)
// the stone wing along 2nd St
prism(stone, stone, [[-45.2, -64.8], [33.9, -64.9], [34.5, -54.1], [-45.2, -54.1]], 0, 19)
// the corner stair block at 2nd & Grand, below the wing
prism(stone, stone, [[17.2, -54.1], [34.5, -54.1], [34.5, -45.1], [28, -45.1], [28, -48.7], [17.2, -48.7]], 0, 13)
// the 1st St frontage: stone terraces and stairs under the drum and the name wall
prism(stone, stone, [
  [-2.5, 47], [10, 46], [15, 49], [20.8, 55.1], [22.2, 63], [24.5, 66.2], [32.2, 71.3], [33.2, 74.1],
  [28.6, 76.2], [11, 76.2], [11.1, 72.6], [-5.3, 73.9], [-5.1, 64.5], [-4.7, 61.7], [-2.6, 57.8],
], 0, 12)

// ---------- lobby glass at street level ----------
// Along Grand under the low sails, and across the main entrance.
glass.quad([43.5, -24, 0], [43.5, 16, 0], [43.5, 16, 9], [43.5, -24, 9])
glass.quad([42.5, 23, 0], [15.5, 40, 0], [15.5, 40, 10], [42.5, 23, 10])

// ---------- write ----------
const parts = [
  { part: steel, material: finish('wdch-steel', 0xc6ccd2, 0.3) },
  { part: stone, material: finish('wdch-limestone', 0xe8dcc6) },
  { part: roof, material: finish('wdch-body', 0xaab2b9) },
  { part: garden, material: finish('wdch-garden', 0xa7b28e) },
  { part: glass, material: PALETTE.window },
  { part: slot, material: PALETTE.glass },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
console.log('per part', parts.map(({ part, material }) => `${material.name} ${part.triangles}`).join(', '))
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Walt Disney Concert Hall', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, height: 46.5,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['relation/6333150', 'way/319307757', 'way/319307763'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/la-disney-concert-hall.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
