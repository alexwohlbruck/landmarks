/**
 * 555 California Street (former Bank of America Center), San Francisco —
 * original procedural geometry, CC0-1.0.
 * bun generators/sf-555-california.ts
 *
 * Frame: built turned to the tower, BEARING 351 (its faces run 9° anticlockwise
 * of north, off the street grid; OSM and lidar agree). x along the long
 * (north and south) faces, y across, z up, metres. Origin = centroid of the OSM
 * outline way/288511106, which includes the low banking-hall wing on the east;
 * the tower's own centre sits 4.75 m west and 0.4 m south of it.
 *
 * Evidence
 * - OSM way/288511106 (outline, 52 levels, SOM / Wurster Bernardi & Emmons,
 *   1969) and its parts 1243267628, 1244283830-36. The parts are drawn loosely;
 *   the outline's bay teeth (about 6.2 m apart, 2 m deep) are used for rhythm.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.5 m, sampled in the
 *   turned frame (/tmp/city/sf/work/fd/{code,prof}.py). y = 0 is the lowest
 *   ground under the outline (Montgomery St, east); the plaza round the tower is
 *   4.65 m above it. Tower 73.5 x 43.6 m to the bay tips; main roof 231 m;
 *   mechanical screen 242 m over the middle 51 x 21 m. The bays end in three
 *   layers, each 2 m further out: the core to 231, a middle layer to 212 (204
 *   at the east end), and the outer bays at 184-212 in groups, read tooth by
 *   tooth from the lidar (tables below). The four corners run full height.
 *   The short faces step once, 4 m deep: 184/192 on the west, 196/204 east.
 *   The east wing is ~10.5 m high.
 * - Published (Wikipedia, CTBUH): 237 m, 52 floors, carnelian granite, sawtooth
 *   bay windows.
 * - Commons daylight photos: "555 California Street from One Montgomery, San
 *   Francisco.jpg" (The wub, CC BY-SA 4.0, from the south, the stepped tops),
 *   "555 California Street 2021.jpg" (Dead.rabbit, CC BY-SA 4.0, from the
 *   south), "555 California Street, San Francisco.jpg" (Supercarwaar, CC BY-SA
 *   4.0, from the north-west), "Bank of America Tower San Francisco.jpg" (Chris
 *   Yunker, CC BY-SA 2.0, south-east), "555 California Street SAn Fran.JPG"
 *   (Cookaa, CC BY-SA 3.0, south-west).
 *
 * Estimated: the corner chamfers (from the OSM outline), windows as three-storey
 * panels per bay face with granite showing at the bay tips and valleys, the
 * 10 m lobby band, the east wing's facade. Colour: the photos' dark red-brown
 * granite, pulled up to the palette's lightness.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const BEARING = 351
const ANCHOR = { lng: -122.4037122, lat: 37.7921133 }
const granite = new Part(), windows = new Part(), roof = new Part(), ledge = new Part()

const C: XY = [-4.75, -0.4] // tower centre
const TOP = 231, SCREEN = 242, LOBBY = 10.5, PLAZA = 4.65
// Each bay layer stands proud of the one behind. Lidar puts the three layers
// within ~6 m; drawn 2.5 m each (7.5 m) so the stepped bay ends read at map scale.
const DEPTH = 2.5

// Faces: outward normal n, traversal tangent t (anticlockwise from above),
// core valley distance D0, tooth half-width w, tip offsets, and per tooth the
// [outer, middle] tops (the core always runs to TOP). 231 = full height.
type Face = { n: XY; t: XY; D0: number; w: number; tips: number[]; h: [number, number][] }
const longTips = [-30, -24, -18, -12, -6, 0, 6, 12, 18, 24, 30]
const shortTips = [-15.5, -9.3, -3.1, 3.1, 9.3, 15.5]
const F = TOP
// Listed west to east (long faces) and south to north (short faces), from the lidar.
const NORTH: [number, number][] = [[F, F], [192, 212], [192, 212], [192, 212], [212, 212], [184, 212], [204, 212], [204, 212], [204, 204], [204, 204], [F, F]]
const SOUTH: [number, number][] = [[F, F], [192, 212], [192, 212], [192, 212], [184, 212], [184, 212], [204, 212], [204, 212], [204, 204], [204, 204], [F, F]]
const WEST: [number, number][] = [[F, F], [192, 192], [184, 184], [184, 184], [192, 192], [F, F]]
const EAST: [number, number][] = [[F, F], [204, 204], [196, 196], [196, 196], [204, 204], [F, F]]
// t runs anticlockwise: north face east→west, west face north→south, etc.
const FACES: Face[] = [
  { n: [0, 1], t: [-1, 0], D0: 14.3, w: 3, tips: longTips.map((s) => -s), h: NORTH },
  { n: [-1, 0], t: [0, -1], D0: 29.25, w: 3.1, tips: shortTips.map((s) => -s), h: WEST },
  { n: [0, -1], t: [1, 0], D0: 14.3, w: 3, tips: longTips, h: SOUTH },
  { n: [1, 0], t: [0, 1], D0: 29.25, w: 3.1, tips: shortTips, h: EAST },
]
const at = (f: Face, s: number, d: number): XY => [C[0] + f.t[0] * s + f.n[0] * d, C[1] + f.t[1] * s + f.n[1] * d]

// --- Small geometry helpers ---
const area = (p: XY[]) => p.reduce((a, q, i) => { const r = p[(i + 1) % p.length]; return a + q[0] * r[1] - r[0] * q[1] }, 0) / 2
function triangulate(poly: XY[]): [XY, XY, XY][] {
  const p = area(poly) < 0 ? [...poly].reverse() : [...poly]
  const out: [XY, XY, XY][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (q: XY, a: XY, b: XY, c: XY) => cr(a, b, q) > 1e-9 && cr(b, c, q) > 1e-9 && cr(c, a, q) > 1e-9
  let guard = 0
  while (p.length > 3 && guard++ < 500) {
    for (let i = 0; i < p.length; i++) {
      const a = p[(i + p.length - 1) % p.length], b = p[i], c = p[(i + 1) % p.length]
      if (cr(a, b, c) <= 1e-9) continue
      if (p.some((q) => q !== a && q !== b && q !== c && inside(q, a, b, c))) continue
      out.push([a, b, c]); p.splice(i, 1); break
    }
  }
  out.push([p[0], p[1], p[2]])
  return out
}
/** A vertical prism over `poly`; `skip` marks edges (i → i+1) whose wall is hidden. */
function prism(part: Part, poly: XY[], z0: number, z1: number, skip: number[] = [], topPart = part) {
  const ccw = area(poly) > 0
  const p = ccw ? poly : [...poly].reverse()
  const n = p.length
  const sk = new Set(ccw ? skip : skip.map((i) => n - 2 - i < 0 ? n - 1 : n - 2 - i))
  for (let i = 0; i < n; i++) {
    if (sk.has(i)) continue
    const a = p[i], b = p[(i + 1) % n]
    part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  for (const [a, b, c] of triangulate(p)) topPart.tri([a[0], a[1], z1], [b[0], b[1], z1], [c[0], c[1], z1])
}

// --- Window panels: three storeys each, granite spandrels between. ---
const STOREY = (TOP - LOBBY) / 52
const ROWS: [number, number][] = [[PLAZA + 0.6, LOBBY - 0.9]]
for (let z = LOBBY; z + 3 * STOREY <= TOP - 2; z += 3 * STOREY) ROWS.push([z + 1.2, z + 3 * STOREY - 1.2])
/** Panels on the wall a→b (outward = right of a→b), between heights lo and hi. */
function panels(a: XY, b: XY, lo: number, hi: number, inset = 0.45, insetB = inset) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < inset + insetB + 1) return
  const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy * 0.05, ny = -ux * 0.05
  const P = (s: number, z: number): V3 => [a[0] + ux * s + nx, a[1] + uy * s + ny, z]
  for (const [r0, r1] of ROWS) {
    const z0 = Math.max(r0, lo + 0.7), z1 = Math.min(r1, hi - 0.7)
    if (z1 - z0 < 2.5) continue
    windows.quad(P(inset, z0), P(L - insetB, z0), P(L - insetB, z1), P(inset, z1))
  }
}

// --- Core: a rectangle at the core valley lines, to the roof. ---
const CORE: XY[] = [[C[0] - 29.25, C[1] - 14.3], [C[0] + 29.25, C[1] - 14.3], [C[0] + 29.25, C[1] + 14.3], [C[0] - 29.25, C[1] + 14.3]]
prism(granite, CORE, 0, TOP, [0, 1, 2, 3], roof) // its walls are all behind the bays

// --- Bays: per tooth, the core tooth and two chevron layers in front of it. ---
for (const f of FACES) {
  f.tips.forEach((s, i) => {
    const [hOut, hMid] = f.h[i]
    const tops = [TOP, hMid, hOut]
    for (let L = 0; L < 3; L++) {
      const v0 = f.D0 + DEPTH * L, v1 = v0 + DEPTH
      const outer = [at(f, s - f.w, v0), at(f, s, v1), at(f, s + f.w, v0)]
      const poly: XY[] = L === 0 ? outer : [...outer, at(f, s + f.w, v0 - DEPTH), at(f, s, v0), at(f, s - f.w, v0 - DEPTH)]
      // walls: 0,1 the bay faces; 2 and 5 the ends (shown); 3,4 the inner faces (hidden)
      // the stepped bay ends get a pale ledge so the staircase reads from above
      prism(granite, poly, 0, tops[L], L === 0 ? [2] : [3, 4], tops[L] < TOP ? ledge : roof)
      // windows where this layer's faces are not covered by the layer in front
      const lo = L === 2 ? 0 : tops[L + 1]
      if (tops[L] - lo > 3) {
        // a broad granite rib down each bay tip, a thin one in the valleys
        panels(outer[0], outer[1], lo, tops[L], 0.3, 1.0)
        panels(outer[1], outer[2], lo, tops[L], 1.0, 0.3)
      }
    }
  })
}

// --- Corners: full-height chamfered blocks between the long and short faces. ---
for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]] as XY[]) {
  const q: XY[] = ([[29, 14.5], [36.75, 14.5], [36.75, 17.2], [33.2, 21.8], [29, 21.8]] as XY[]).map(([a, b]) => [C[0] + sx * a, C[1] + sy * b])
  prism(granite, q, 0, TOP, [], roof)
  // the chamfer face: outward from the corner
  const [a, b] = sx * sy > 0 ? [q[2], q[3]] : [q[3], q[2]]
  panels(a, b, 0, TOP, 0.6)
}

// --- Mechanical screen on the roof: its long faces carry the bay rhythm too. ---
{
  const hx = 24, hy = 9, ch = 1.2
  const s: XY[] = ([[-hx + ch, -hy], [hx - ch, -hy], [hx, -hy + ch], [hx, hy - ch], [hx - ch, hy], [-hx + ch, hy], [-hx, hy - ch], [-hx, -hy + ch]] as XY[]).map(([a, b]) => [C[0] + a, C[1] + b])
  prism(granite, s, TOP - 0.5, SCREEN, [], roof)
  for (const sy of [1, -1]) for (let k = -3; k <= 3; k++) {
    const x = C[0] + 6 * k
    prism(granite, [[x - 3, C[1] + sy * hy], [x, C[1] + sy * (hy + 1.6)], [x + 3, C[1] + sy * hy]], TOP - 0.5, SCREEN, [2], roof)
  }
}

// --- East wing: the low banking hall on the Montgomery Street side. ---
{
  const x0 = C[0] + 36.4, x1 = 40.6, y0 = -21.5, y1 = 21.2, H = 10.5
  prism(granite, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 0, H, [3], roof)
  for (const [a, b] of [[[x1, y0], [x1, y1]], [[x0, y0], [x1, y0]], [[x1, y1], [x0, y1]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / 5))
    for (let k = 0; k < n; k++) {
      const p = (t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
      const A = p(k / n), B = p((k + 1) / n)
      const P = (q: XY, sgn: number, z: number): V3 => [q[0] + ux * 0.5 * sgn + uy * 0.05, q[1] + uy * 0.5 * sgn - ux * 0.05, z]
      windows.quad(P(A, 1, 2.2), P(B, -1, 2.2), P(B, -1, H - 1.6), P(A, 1, H - 1.6))
    }
  }
}

const parts = [
  { part: granite, material: finish('carnelian-granite', 0x82605e) },
  { part: ledge, material: PALETTE.trim },
  { part: windows, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('555 California Street', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: SCREEN,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/288511106', 'way/1243267628', 'way/1244283830', 'way/1244283832', 'way/1244283833', 'way/1244283834', 'way/1244283835', 'way/1244283836'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-555-california.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
