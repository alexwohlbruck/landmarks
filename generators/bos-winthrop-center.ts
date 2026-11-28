/**
 * Winthrop Center, Boston (115 Federal Street): original procedural geometry,
 * CC0-1.0.
 * bun generators/bos-winthrop-center.ts
 *
 * Handel Architects for Millennium Partners, completed 2023; 691 ft, offices
 * below and flats above. A slim blue-glass tower whose folded curtain wall
 * reads as close vertical ribs, with chamfered corners and a taller crown
 * band of angled glass at the top; lower glass wings of 27 and 28 storeys
 * wrap its south-west and east sides, the south-west one with a column of
 * open balconies, and a two-storey base on the north.
 *
 * Frame: map frame, bearing 0 (x east, y north, z up), metres. Origin = the
 * anchor, the centroid of OSM outline way/117853075.
 *
 * Evidence
 * - OSM way/117853075 (outline, 53 levels, height 210.5) and its parts
 *   way/1279142405 (the tower, 52 levels, 210.5), way/1279142406 (the
 *   south-west wing, 27 levels), way/1279142407 (the east wing, 28 levels),
 *   way/1279142404 (the north base, 2 levels). Their plans are used as
 *   mapped. way/485205446 (2 levels) lies mostly outside the outline, to the
 *   south, and is not drawn or replaced.
 * - USGS 3DEP lidar MA_CentralEastern_1_2021 (2021 flight): the tower was
 *   then under construction, with the whole site at 59-70 m and parts of the
 *   east and north at ~110 m (cranes and formwork). It confirms the site's
 *   extent (x -32..48, y -42..34) and nothing else; no height below is
 *   from lidar.
 * - Published (Wikipedia "Winthrop Center"): 690.7 ft (210.5 m), approved
 *   May 2018, completed 2023.
 * - Commons photos, all EVIDENCE:
 *   - "Winthrop Center completed.jpg", Jazzman989, CC BY-SA 4.0: from a
 *     tower to the west; the ribbed glass, the crown band (its bottom about
 *     28 m below the top), the south-west wing in front with its balcony
 *     column, the wing top at 0.47 of the tower's height below the crown;
 *     https://commons.wikimedia.org/wiki/File:Winthrop_Center_completed.jpg
 *   - "Winthrop Center under construction.jpg", Anthonyt31201, CC BY-SA 4.0:
 *     from Downtown Crossing (west); the wing and its balcony column, the
 *     chamfered corners.
 *     https://commons.wikimedia.org/wiki/File:Winthrop_Center_under_construction.jpg
 *
 * Estimated: the wings' heights from their storey counts and the completed
 * photo (south-west wing 112 m, east wing 116 m); the base 10 m; the crown
 * band 182.5-210.5 and its 0.6 m flare; the rib spacing (~4.5 m on the shaft, ~2.6 m in
 * the crown, where the photo shows the folds closer); no floor lines, as the
 * photos show none; the corner chamfers (2.5 m); the balcony column's
 * width (6 m) and position (the north end of the wing's west face).
 * Doubts: only the west side is photographed; the east wing and the
 * tower's east face are drawn plain, as the plans and the west face
 * suggest. The lidar predates completion.
 * No look-only sources were used.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const ANCHOR = { lng: -71.05705, lat: 42.354565 }

type P2 = [number, number]
const glass = new Part(), crown = new Part(), line = new Part(), roof = new Part(), dark = new Part()

const area2 = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
function earcut(poly: P2[]): [number, number, number][] {
  const idx = poly.map((_, i) => i), out: [number, number, number][] = []
  let guard = 0
  while (idx.length > 3 && guard++ < 2000) {
    for (let k = 0; k < idx.length; k++) {
      const a = idx[(k + idx.length - 1) % idx.length], b = idx[k], c = idx[(k + 1) % idx.length]
      if (area2(poly[a], poly[b], poly[c]) <= 1e-9) continue
      if (idx.some((j) => j !== a && j !== b && j !== c &&
        area2(poly[a], poly[b], poly[j]) >= 0 && area2(poly[b], poly[c], poly[j]) >= 0 && area2(poly[c], poly[a], poly[j]) >= 0)) continue
      out.push([a, b, c]); idx.splice(k, 1); break
    }
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
function ccw(poly: P2[]): P2[] {
  let A = 0
  for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; A += a[0] * b[1] - b[0] * a[1] }
  return A < 0 ? [...poly].reverse() : poly
}
function cap(p: Part, poly: P2[], z: number, up = true) {
  for (const [a, b, c] of earcut(poly)) {
    const A: V3 = [...poly[a], z], B: V3 = [...poly[b], z], C: V3 = [...poly[c], z]
    if (up) p.tri(A, B, C); else p.tri(A, C, B)
  }
}
function inside(p: P2, poly: P2[]) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
function chamfer(poly: P2[], c: number): P2[] {
  const out: P2[] = [], n = poly.length
  for (let i = 0; i < n; i++) {
    const p = poly[(i + n - 1) % n], q = poly[i], r = poly[(i + 1) % n]
    const d1 = Math.hypot(q[0] - p[0], q[1] - p[1]), d2 = Math.hypot(r[0] - q[0], r[1] - q[1])
    if (area2(p, q, r) > 0 && d1 > 2.5 * c && d2 > 2.5 * c) {
      out.push([q[0] + ((p[0] - q[0]) * c) / d1, q[1] + ((p[1] - q[1]) * c) / d1])
      out.push([q[0] + ((r[0] - q[0]) * c) / d2, q[1] + ((r[1] - q[1]) * c) / d2])
    } else out.push(q)
  }
  return out
}
/** Push a closed anticlockwise polygon out by d (mitred). */
function offset(poly: P2[], d: number): P2[] {
  const n = poly.length
  const nrm = (v: P2): P2 => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
  return poly.map((q, i) => {
    const p = poly[(i + n - 1) % n], r = poly[(i + 1) % n]
    const n1 = nrm([q[1] - p[1], p[0] - q[0]]), n2 = nrm([r[1] - q[1], q[0] - r[0]])
    const m = nrm([n1[0] + n2[0], n1[1] + n2[1]])
    const k = d / Math.max(0.3, m[0] * n1[0] + m[1] * n1[1])
    return [q[0] + m[0] * k, q[1] + m[1] * k] as P2
  })
}

// --- Plans (OSM parts) ---
const TOWER = ccw(chamfer(ccw([[4.0, 32.0], [-20.5, 29.3], [-25.1, 28.6], [-23.6, 11.1], [-19.9, -36.2], [7.8, -34.4], [9.0, -20.5], [9.9, -10.2], [7.7, 13.3], [7.0, 21.8]]), 2.5))
const SW = ccw([[-23.6, 11.1], [-28.5, 10.7], [-28.9, 3.7], [-29.7, -2.7], [-39.7, -29.2], [-29.6, -33.6], [-5.7, -44.9], [7.1, -43.4], [7.8, -34.4], [-19.9, -36.2]])
const EAST = ccw([[44.9, 16.7], [7.7, 13.3], [9.9, -10.2], [47.1, -6.8]])
const BASE = ccw([[44.9, 16.7], [7.7, 13.3], [7.0, 21.8], [4.0, 32.0], [-20.5, 29.3], [-22.0, 38.0], [11.9, 42.5], [15.0, 19.0], [44.7, 22.9]])

const TOP = 210.5, CROWN = 182.5
type Vol = { poly: P2[]; top: number; ribs: number }
const vols: Vol[] = [
  { poly: TOWER, top: CROWN, ribs: 6 },
  { poly: SW, top: 112, ribs: 6 },
  { poly: EAST, top: 116, ribs: 6 },
  { poly: BASE, top: 10, ribs: 0 },
]
function neighbourTop(self: Vol, a: P2, b: P2, s: number): number {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: P2 = [t[1], -t[0]]
  const p: P2 = [a[0] + (b[0] - a[0]) * s + n[0] * 0.4, a[1] + (b[1] - a[1]) * s + n[1] * 0.4]
  let top = 0
  for (const v of vols) if (v !== self && inside(p, v.poly)) top = Math.max(top, v === vols[0] ? TOP : v.top)
  return top
}

for (const v of vols) {
  const P = v.poly
  for (let k = 0; k < P.length; k++) {
    const a = P[k], b = P[(k + 1) % P.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: P2 = [t[1], -t[0]]
    const N = Math.max(1, Math.round(L / 4.5))
    for (let i = 0; i < N; i++) {
      const s0 = i / N, s1 = (i + 1) / N
      const z0 = neighbourTop(v, a, b, (s0 + s1) / 2)
      if (z0 >= v.top) continue
      const A: P2 = [a[0] + (b[0] - a[0]) * s0, a[1] + (b[1] - a[1]) * s0]
      const B: P2 = [a[0] + (b[0] - a[0]) * s1, a[1] + (b[1] - a[1]) * s1]
      glass.quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], v.top], [A[0], A[1], v.top])
      if (!v.ribs) {
        line.quad([A[0] + n[0] * 0.1, A[1] + n[1] * 0.1, v.top - 1.2], [B[0] + n[0] * 0.1, B[1] + n[1] * 0.1, v.top - 1.2], [B[0] + n[0] * 0.1, B[1] + n[1] * 0.1, v.top], [A[0] + n[0] * 0.1, A[1] + n[1] * 0.1, v.top])
        continue
      }
      // a pale rib at the bay's start (the fold of the glass)
      if (i > 0 || L < 6) {
        const c: P2 = [A[0] + n[0] * 0.14, A[1] + n[1] * 0.14]
        const r0: P2 = [c[0] - t[0] * 0.2, c[1] - t[1] * 0.2], r1: P2 = [c[0] + t[0] * 0.2, c[1] + t[1] * 0.2]
        line.quad([r0[0], r0[1], Math.max(z0, 10)], [r1[0], r1[1], Math.max(z0, 10)], [r1[0], r1[1], v.top], [r0[0], r0[1], v.top])
      }
      // floor groups
      const A2: P2 = [A[0] + n[0] * 0.12, A[1] + n[1] * 0.12], B2: P2 = [B[0] + n[0] * 0.12, B[1] + n[1] * 0.12]
      line.quad([A2[0], A2[1], v.top - 0.8], [B2[0], B2[1], v.top - 0.8], [B2[0], B2[1], v.top], [A2[0], A2[1], v.top])
    }
  }
  if (v !== vols[0]) cap(roof, P, v.top)
}

// --- Crown: a flared band of angled glass with close ribs, then the roof ---
{
  const C = offset(TOWER, 0.6)
  for (let k = 0; k < C.length; k++) {
    const a = C[k], b = C[(k + 1) % C.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: P2 = [t[1], -t[0]]
    // a ledge where the crown steps out
    const a0 = TOWER[k], b0 = TOWER[(k + 1) % TOWER.length]
    line.quad([a0[0], a0[1], CROWN], [b0[0], b0[1], CROWN], [b[0], b[1], CROWN], [a[0], a[1], CROWN])
    line.quad([a[0], a[1], CROWN - 0.6], [b[0], b[1], CROWN - 0.6], [b[0], b[1], CROWN], [a[0], a[1], CROWN])
    crown.quad([a[0], a[1], CROWN], [b[0], b[1], CROWN], [b[0], b[1], TOP], [a[0], a[1], TOP])
    const N = Math.max(1, Math.round(L / 2.6))
    for (let i = 1; i < N; i++) {
      const s = (i / N) * L, c: P2 = [a[0] + t[0] * s + n[0] * 0.16, a[1] + t[1] * s + n[1] * 0.16]
      const r0: P2 = [c[0] - t[0] * 0.25, c[1] - t[1] * 0.25], r1: P2 = [c[0] + t[0] * 0.25, c[1] + t[1] * 0.25]
      line.quad([r0[0], r0[1], CROWN], [r1[0], r1[1], CROWN], [r1[0], r1[1], TOP], [r0[0], r0[1], TOP])
    }
    // pale top edge
    const a2: P2 = [a[0] + n[0] * 0.12, a[1] + n[1] * 0.12], b2: P2 = [b[0] + n[0] * 0.12, b[1] + n[1] * 0.12]
    line.quad([a2[0], a2[1], TOP - 1.0], [b2[0], b2[1], TOP - 1.0], [b2[0], b2[1], TOP], [a2[0], a2[1], TOP])
  }
  // parapet inner face and the roof 3 m down
  const I = offset(TOWER, -1.0)
  for (let k = 0; k < C.length; k++) {
    const a = C[k], b = C[(k + 1) % C.length], c = I[(k + 1) % I.length], d = I[k]
    line.quad([a[0], a[1], TOP], [b[0], b[1], TOP], [c[0], c[1], TOP], [d[0], d[1], TOP])
    crown.quad([c[0], c[1], TOP - 3], [d[0], d[1], TOP - 3], [d[0], d[1], TOP], [c[0], c[1], TOP])
  }
  cap(roof, I, TOP - 3)
}

// --- The balcony column on the south-west wing's west face (north end) ---
{
  const a: P2 = [-28.9, 3.7], b: P2 = [-29.7, -2.7], c: P2 = [-39.7, -29.2]
  // the column spans the short edge a→b and the first 3 m of b→c
  const n1: P2 = (() => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[1] - a[1]) / L, -(b[0] - a[0]) / L] })()
  void n1
  const seg = (p: P2, q: P2, s0: number, s1: number) => {
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]), t: P2 = [(q[0] - p[0]) / L, (q[1] - p[1]) / L], n: P2 = [t[1], -t[0]]
    const P0: V3 = [p[0] + t[0] * s0 + n[0] * 0.18, p[1] + t[1] * s0 + n[1] * 0.18, 12]
    const P1: V3 = [p[0] + t[0] * s1 + n[0] * 0.18, p[1] + t[1] * s1 + n[1] * 0.18, 12]
    dark.quad(P0, P1, [P1[0], P1[1], 108], [P0[0], P0[1], 108])
  }
  seg(a, b, 0.3, Math.hypot(b[0] - a[0], b[1] - a[1]))
  seg(b, c, 0, 2.5)
}

const parts = [
  { part: glass, material: windowVariant(2, 0x7f9fc6) },
  { part: crown, material: windowVariant(3, 0x7698c2) },
  { part: line, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: dark, material: finish('balcony-column', 0x4b5562) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Winthrop Center', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TOP,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/117853075', 'way/1279142404', 'way/1279142405', 'way/1279142406', 'way/1279142407'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/bos-winthrop-center.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
