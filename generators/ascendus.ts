/**
 * Ascendus, Ed Carpenter's gateway sculpture at the Charlotte Douglas airport
 * turn-off on Billy Graham Parkway — procedural, CC0-1.0.
 *
 *   bun generators/ascendus.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres. The origin is the sculpture's
 * anchor (OSM node 12329988037), and the catalog places it at bearing 0.
 *
 * Steel, aluminium and laminated glass, 60 × 16 × 16 ft (18.3 × 4.9 × 4.9 m)
 * by the airport's own description. The form is one tall pointed pod, a
 * lattice shell like a seed case or a sail stood on end: open to the south,
 * its back bowed north, standing on three feet (its two rims and the back)
 * with the bottom edge arching up between them, and narrowing to a single
 * point that leans east over the east foot. The shell is a triangulated steel
 * lattice hung with pale triangular glass fins; an orange diamond net fills
 * the lower middle of the back, and the rims carry coloured dichroic glass
 * (lime on the west rim, orange on the east).
 *
 * Rework (2026-10): the earlier model drew two separate leaves springing from
 * one pointed foot. Every street photo shows a single pod standing on a base
 * about as wide as the sculpture itself, so the massing was rebuilt.
 *
 * Evidence:
 * - Mapillary (CC BY-SA 4.0) street photos from the parkway: 519112425759292
 *   (from the south, 2018-01), 166273841992480 (south, 2021-02),
 *   328739052262691 (north-west, 2021-07). No Commons or Openverse photo
 *   exists. The rim outlines below were measured off 519112425759292 and
 *   scaled to the published 16 ft width (estimated ±0.5 m).
 * - USGS NAIP (public domain): a pale round pad about 7 m across under the
 *   sculpture, centred about 1 m west of the anchor.
 * - Published: height 18.3 m (60 ft), plan 4.9 m square.
 * - Estimated: the depth of the pod (2.6 m at the base) and the north bow,
 *   which only the north-west photo shows, and only in its upper half; the
 *   lattice pitch (12 rows), drawn coarser than the real one so it reads.
 */
import { Part, type V3, writeGlb } from './mesh'
import { finish } from './palette'

const STEEL = finish('steel-silver', 0xaeb6bd, 0.5)
const FIN = finish('fin-glass', 0xe6ebee, 0.3)
const NET = finish('ascendus-orange', 0xd99a6c, 0.6)
const RIM = finish('dichroic-glass', 0xc9cf7e, 0.3)

const steel = new Part(), fin = new Part(), net = new Part(), rim = new Part()

const H = 18.3
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const norm = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

/** Linear interpolation through [s, value] rows. */
function table(rows: number[][], s: number): number {
  if (s <= rows[0][0]) return rows[0][1]
  for (let i = 1; i < rows.length; i++) if (s <= rows[i][0]) {
    const [s0, a] = rows[i - 1], [s1, b] = rows[i]
    return a + ((b - a) * (s - s0)) / (s1 - s0)
  }
  return rows[rows.length - 1][1]
}

// The two rims as seen from the south (x east at height fraction s), from
// the 2018 photo; they meet at the tip over the east foot.
const S = [0, 0.235, 0.415, 0.6, 0.775, 0.955, 1]
const WEST = [-2.6, -2.0, -1.4, -0.6, 0.3, 1.6, 2.15]
const EAST = [2.6, 3.1, 3.4, 3.4, 3.3, 2.6, 2.15]
const rows = (xs: number[]) => S.map((s, i) => [s, xs[i]])
const W = rows(WEST), E = rows(EAST)
// How far the back bows north of the rims, which stand 1 m south of the anchor.
const BOW = [[0, 2.6], [0.4, 2.4], [0.7, 1.6], [0.9, 0.6], [1, 0]]

/** A point on the shell: s up (0 foot, 1 tip), t across (0 west rim, 1 east rim). */
function P(s: number, t: number): V3 {
  const xw = table(W, s), xe = table(E, s)
  const yr = -1.0 * (1 - s)
  const w: V3 = [xw, yr, 0], e: V3 = [xe, yr, 0]
  const spine: V3 = [(xw + xe) / 2 - 0.6 * (1 - s), yr + table(BOW, s), 0]
  // A quadratic through both rims and the spine at t = 0.5.
  const c = sub(mul(spine, 2), mul(add(w, e), 0.5))
  const q = add(add(mul(w, (1 - t) ** 2), mul(c, 2 * t * (1 - t))), mul(e, t * t))
  // The bottom edge arches up between the three feet.
  const lift = 1.3 * Math.abs(Math.sin(2 * Math.PI * t)) * (1 - s) ** 4
  return [q[0], q[1], s * H + lift]
}
/** The shell's outward normal (away from the open inside). */
function N(s: number, t: number): V3 {
  const d = 1e-3
  const ds = sub(P(Math.min(1, s + d), t), P(Math.max(0, s - d), t))
  const dt = sub(P(s, Math.min(1, t + d)), P(s, Math.max(0, t - d)))
  return norm(cross(ds, dt))
}

/** A square bar from a to b, `w` wide, its faces squared to `up`. */
function bar(part: Part, a: V3, b: V3, w: number, up: V3) {
  const ax = norm(sub(b, a))
  let u = norm(cross(ax, up))
  if (!Number.isFinite(u[0])) u = norm(cross(ax, [0, 0, 1]))
  const v = cross(u, ax)
  const h = w / 2
  const ring = (p: V3) => [
    add(add(p, mul(u, h)), mul(v, h)), add(add(p, mul(u, -h)), mul(v, h)),
    add(add(p, mul(u, -h)), mul(v, -h)), add(add(p, mul(u, h)), mul(v, -h)),
  ]
  const r0 = ring(a), r1 = ring(b)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    part.quad(r0[j], r0[i], r1[i], r1[j])
  }
}
/** A flat triangle seen from both sides. */
function pane(part: Part, a: V3, b: V3, c: V3) {
  part.tri(a, b, c)
  part.tri(a, c, b)
}

const NS = 12, NT = 6
const s = (i: number) => i / NS
const t = (j: number) => j / NT
// Points stop short of the tip so the bars don't pile into a knot there.
const at = (i: number, j: number): V3 => (i === NS ? P(1, 0.5) : P(s(i), t(j)))

for (let i = 0; i < NS; i++) {
  for (let j = 0; j <= NT; j++) {
    const n = N(s(i) + 0.5 / NS, t(j))
    const edge = j === 0 || j === NT
    // Meridians: the rims heavy, the rest light.
    bar(steel, at(i, j), at(i + 1, j), edge ? 0.42 : 0.2, n)
    // The coloured glass strip along each rim's outer side.
    if (edge && i < NS - 1) {
      const out = norm(sub(P(s(i) + 0.5 / NS, j === 0 ? 0 : 1), P(s(i) + 0.5 / NS, 0.5)))
      const a = at(i, j), b = at(i + 1, j)
      const k = 0.55 * (1 - s(i)) + 0.2
      const rimPart = j === 0 ? rim : net
      pane(rimPart, a, b, add(b, mul(out, k * 0.8)))
      pane(rimPart, a, add(b, mul(out, k * 0.8)), add(a, mul(out, k)))
    }
  }
  for (let j = 0; j < NT; j++) {
    const a = at(i, j), b = at(i, j + 1), c = at(i + 1, j), d = at(i + 1, j + 1)
    const n = N(s(i) + 0.5 / NS, t(j) + 0.5 / NT)
    // Hoops at every row.
    bar(steel, a, b, i === 0 ? 0.3 : 0.16, n)
    // One diagonal per cell, alternating, so the lattice is triangulated.
    const flip = (i + j) % 2 === 0
    // The lower middle of the back is the orange diamond net instead.
    const inNet = i >= 2 && i <= 7 && j >= 2 && j <= 3
    if (inNet) {
      bar(net, a, d, 0.16, n)
      bar(net, b, c, 0.16, n)
      continue
    }
    if (i < NS - 1) bar(steel, flip ? a : b, flip ? d : c, 0.12, n)
    // A pale glass fin in one triangle of each cell, set just outside the lattice.
    if (i < NS - 1) {
      const o = mul(n, 0.06)
      const tri = flip ? [a, b, d] : [a, b, c]
      pane(fin, add(tri[0], o), add(tri[1], o), add(tri[2], o))
    }
  }
}
// The three feet: low steel shoes at the rims and the back.
for (const tt of [0, 0.5, 1]) {
  const p = P(0, tt), k = 0.45
  const lo: V3[] = [[p[0] - k, p[1] - k, 0], [p[0] + k, p[1] - k, 0], [p[0] + k, p[1] + k, 0], [p[0] - k, p[1] + k, 0]]
  const hi = lo.map(([x, y]): V3 => [p[0] + (x - p[0]) * 0.6, p[1] + (y - p[1]) * 0.6, 0.5])
  steel.loft([lo, hi])
  steel.cap(hi, true)
}

const parts = [
  { part: steel, material: STEEL },
  { part: fin, material: FIN },
  { part: net, material: NET },
  { part: rim, material: RIM },
]
const tris = parts.reduce((n, { part }) => n + part.triangles, 0)
if (tris > 5000) throw new Error(`over budget: ${tris} triangles`)
const glb = writeGlb('Ascendus', parts, {
  title: 'Ascendus',
  artist: 'Ed Carpenter',
  license: 'CC0-1.0',
  source: 'generators/ascendus.ts',
})
if (glb.length > 256000) throw new Error(`over budget: ${glb.length} bytes`)
const outPath = process.argv[2] ?? new URL('../models/ascendus.glb', import.meta.url).pathname
await Bun.write(outPath, glb)
console.log(`${outPath}: ${tris} triangles, ${glb.length} bytes`)
