/**
 * Palace of Fine Arts, San Francisco — original procedural geometry, CC0-1.0.
 * bun generators/sf-palace-of-fine-arts.ts
 *
 * Map frame turned to the composition's axis: +x points from the rotunda out
 * over the lagoon (compass 80°), +y to its left, z up, metres. BEARING 350.
 * Origin = the centre of the dome (OSM way/456820271's centroid), on the
 * lowest ground under the model (2.6 m NAVD88; the rotunda's plinth stands at
 * 2.8, the hall's floor at 2.8-3.1). The lagoon is the map's.
 *
 * Evidence
 * - OSM: rotunda outline way/288371295 (building=temple) with parts
 *   way/456820271 (dome), 456820274 (drum), 1549377350 (octagon ring and its
 *   corner clusters), eight `column` clusters 1549377328/31/34/35/38/41/44/45
 *   and the low curved walls and urns round them (1549377329/30/32/33/36/37/
 *   39/40/42/43/46/47/48/49); the colonnades way/288371310 (north) and
 *   288371306 (south) with their outlying column groups 288371313 and
 *   288371314; the exhibition hall way/288371302 with parts 1550664397-410.
 *   The rotunda octagon has a face square to the lagoon axis (the OSM ring
 *   is symmetric about it to 0.3 m), which is what sets the bearing.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023, 1 m grid), above 2.6 m:
 *   dome crown 49.1 and springing r 17 at 40 (a spherical cap: r 10 at 46.4,
 *   r 14 at 43.5); drum ring r 18-19 at 39-40; attic octagon (apothem ~21.5)
 *   top 36.9 with corner piers to 38; corner entablatures 28.5, projecting to
 *   r 25.5; the low curved walls 5.5. Colonnades: entablature 17.8 the whole
 *   way, 4 m wide; planter boxes 21.8-22.5. The hall: walls 12.0 both sides,
 *   pitched roof to 15.3, a raised central monitor 7 m wide at 17.8; its
 *   end blocks 17.8. Its plan (inner and outer walls) is OSM's, 42.6 m wide.
 * - Published (Wikipedia; SF Landmark No. 88; NRHP): Bernard Maybeck, 1915,
 *   for the Panama-Pacific Exposition, rebuilt in concrete 1964-67; rotunda
 *   about 162 ft (49 m) high.
 * - Commons daylight photos: "San Francisco (CA, USA), Palace of Fine Arts --
 *   2022 -- 0916.jpg" (Dietmar Rabich, CC BY-SA 4.0; a corner of the rotunda
 *   from the lagoon: paired red columns on tall pedestals at each corner,
 *   arches between, attic with relief panels, the pale dome); "Palace of
 *   Fine Arts - San Francisco, CA - DSC02408.jpg" (Daderot, CC0, from the
 *   east); "Palace of Fine Arts San Francisco.jpg" (Yourusernamewillbepublic2,
 *   CC0, panorama across the lagoon); "Palace of Fine Arts San Francisco
 *   January 2014 003.jpg" (King of Hearts, CC BY-SA 4.0); "Palace of Fine
 *   Arts. View of colonnade from north-east.jpg" (Sarbjit Bahga, CC BY-SA
 *   4.0; the double row of columns, grouped in fours under each planter box);
 *   "Aerial view of The Palace of Fine Arts.jpg" (Sasha Stories, CC0) and
 *   USGS NAIP for the plan and the hall's roof.
 *
 * Colour: the stone is a warm ochre-tan, the rotunda's columns a red ochre,
 *   the dome in every recent daylight photo a pale cream (older photos show
 *   it darker and weathered; the 2010s restoration lightened it), the hall's
 *   concrete paler and greyer than the rotunda, its roof grey.
 * Estimated from the photos (scaled by the lidar): the column pedestals
 *   (6.9 m), column shafts to 23.6 m (2 m thick), the arches (9 m wide,
 *   crown 22 m), the attic bands, the colonnades' column spacing (4.2 m)
 *   and the box groups' four columns, the hall's door panels. Simplified:
 *   no statues, reliefs, urns or weeping women; the planter boxes are plain.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 350
const ANCHOR = { lng: -122.4484045, lat: 37.8029182 }
const REPLACES = [
  'way/288371295', 'way/456820271', 'way/456820274',
  ...Array.from({ length: 23 }, (_, i) => `way/${1549377328 + i}`),
  'way/288371310', 'way/288371306', 'way/288371313', 'way/288371314',
  'way/288371302', ...Array.from({ length: 14 }, (_, i) => `way/${1550664397 + i}`),
]

type XY = [number, number]
const stone = new Part(), red = new Part(), dome = new Part(), hall = new Part(), roof = new Part(), door = new Part()
const up: V3 = [0, 0, 1], down: V3 = [0, 0, -1]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return v.map((n) => n / l) as V3 }

// ---- helpers ---------------------------------------------------------------
const area = (p: XY[]) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
const ccw = (p: XY[]) => (area(p) < 0 ? [...p].reverse() : p)
/** Ear-clipping triangulation of a simple polygon (CCW); returns index triples. */
function earcut(p: XY[]): number[][] {
  const idx = p.map((_, i) => i), out: number[][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (q: XY, a: XY, b: XY, c: XY) => cr(a, b, q) >= 0 && cr(b, c, q) >= 0 && cr(c, a, q) >= 0
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const a = p[ia], b = p[ib], c = p[ic]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inside(p[j], a, b, c))) continue
      out.push([ia, ib, ic]); idx.splice(i, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
/** A vertical prism over a plan polygon, walls flat-shaded, top cap, optional bottom. */
function prism(part: Part, poly: XY[], z0: number, z1: number, bottom = false, top = true) {
  const p = ccw(poly)
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length]
    part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  const tris = earcut(p)
  if (top) for (const [i, j, k] of tris) part.tri([...p[i], z1] as V3, [...p[j], z1] as V3, [...p[k], z1] as V3)
  if (bottom) for (const [i, j, k] of tris) part.tri([...p[i], z0] as V3, [...p[k], z0] as V3, [...p[j], z0] as V3)
}
/** A rectangle in plan centred at c, long axis along direction angle a. */
const rect = (c: XY, a: number, hl: number, hw: number): XY[] => {
  const u: XY = [Math.cos(a), Math.sin(a)], v: XY = [-u[1], u[0]]
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([s, t]) => [c[0] + u[0] * s * hl + v[0] * t * hw, c[1] + u[1] * s * hl + v[1] * t * hw])
}
/** A round column, smooth-shaded, uncapped (its ends are buried). */
function column(part: Part, c: XY, r: number, z0: number, z1: number, seg = 8, r1 = r) {
  for (let i = 0; i < seg; i++) {
    const a0 = (i / seg) * 2 * Math.PI, a1 = ((i + 1) / seg) * 2 * Math.PI
    const q = (a: number, z: number, rr: number): V3 => [c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a), z]
    const n = (a: number): V3 => [Math.cos(a), Math.sin(a), 0]
    part.tri(q(a0, z0, r), q(a1, z0, r), q(a1, z1, r1), undefined, undefined, undefined, [n(a0), n(a1), n(a1)])
    part.tri(q(a0, z0, r), q(a1, z1, r1), q(a0, z1, r1), undefined, undefined, undefined, [n(a0), n(a1), n(a0)])
  }
}
/** A regular polygon ring at apothem `ap`, `n` sides, a face centred on angle `phase`. */
const polyRing = (ap: number, n: number, phase = 0): XY[] => {
  const R = ap / Math.cos(Math.PI / n)
  return Array.from({ length: n }, (_, k) => { const a = phase + ((k + 0.5) * 2 * Math.PI) / n; return [R * Math.cos(a), R * Math.sin(a)] as XY })
}
/** Surface of revolution through (r, z) points, smooth. */
function lathe(part: Part, prof: [number, number][], seg = 24) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const dr = r1 - r0, dz = z1 - z0, l = Math.hypot(dr, dz) || 1
    for (let i = 0; i < seg; i++) {
      const t0 = (i / seg) * 2 * Math.PI, t1 = ((i + 1) / seg) * 2 * Math.PI
      const p = (r: number, z: number, t: number): V3 => [r * Math.cos(t), r * Math.sin(t), z]
      const nn = (t: number): V3 => unit([(Math.cos(t) * dz) / l, (Math.sin(t) * dz) / l, -dr / l])
      if (r1 < 1e-6) { part.tri(p(r0, z0, t0), p(r0, z0, t1), [0, 0, z1], undefined, undefined, undefined, [nn(t0), nn(t1), up]); continue }
      part.tri(p(r0, z0, t0), p(r0, z0, t1), p(r1, z1, t1), undefined, undefined, undefined, [nn(t0), nn(t1), nn(t1)])
      part.tri(p(r0, z0, t0), p(r1, z1, t1), p(r1, z1, t0), undefined, undefined, undefined, [nn(t0), nn(t1), nn(t0)])
    }
  }
}

// ---- Rotunda ---------------------------------------------------------------
// An open octagon: eight piers with an arch through every face, a pedestal
// and a pair of red columns at every corner, entablature, attic, drum, dome.
const AO = 22.2 // outer face plane (OSM ring, lidar entablature line)
const AI = 16.4 // inner face plane, under the dome's springing
const TA = Math.tan(Math.PI / 8)
const AW = 5.0, SPRING = 19.0 // arch half width and springing; crown 24.0
const ENT0 = 25.8, ENT = 28.5 // entablature over the order
const ATTIC = 35.0, CORNICE = 36.2
const ARCH_N = 10

/** One octagon face's wall (outer or inner plane) with its arch, in face coordinates. */
function archedFace(face: number, ap: number, outward: boolean) {
  const a = (face * Math.PI) / 4
  const L = ap * TA
  // s along the face (to the left seen from outside), z up; d = apothem plane.
  const P = (s: number, z: number): V3 => [ap * Math.cos(a) - s * Math.sin(a), ap * Math.sin(a) + s * Math.cos(a), z]
  const Q = (a1: V3, b1: V3, c1: V3, d1: V3) => (outward ? stone.quad(a1, b1, c1, d1) : stone.quad(d1, c1, b1, a1))
  // piers
  Q(P(-L, 0), P(-AW, 0), P(-AW, SPRING), P(-L, SPRING))
  Q(P(AW, 0), P(L, 0), P(L, SPRING), P(AW, SPRING))
  // spandrel strip: arch points to a U-shaped outline (right side, top, left side)
  const uLen = 2 * (ENT - SPRING) + 2 * L
  const U = (f: number): [number, number] => {
    let d = f * uLen
    if (d <= ENT - SPRING) return [L, SPRING + d]
    d -= ENT - SPRING
    if (d <= 2 * L) return [L - d, ENT]
    d -= 2 * L
    return [-L, ENT - d]
  }
  for (let k = 0; k < ARCH_N; k++) {
    const t0 = (k / ARCH_N) * Math.PI, t1 = ((k + 1) / ARCH_N) * Math.PI
    const [us0, uz0] = U(k / ARCH_N), [us1, uz1] = U((k + 1) / ARCH_N)
    Q(P(AW * Math.cos(t0), SPRING + AW * Math.sin(t0)), P(us0, uz0), P(us1, uz1), P(AW * Math.cos(t1), SPRING + AW * Math.sin(t1)))
  }
}
for (let f = 0; f < 8; f++) {
  archedFace(f, AO, true)
  archedFace(f, AI, false)
  // the passage: side walls and the barrel vault, from the inner plane to the outer
  const a = (f * Math.PI) / 4
  const P = (ap: number, s: number, z: number): V3 => [ap * Math.cos(a) - s * Math.sin(a), ap * Math.sin(a) + s * Math.cos(a), z]
  stone.quad(P(AI, -AW, 0), P(AO, -AW, 0), P(AO, -AW, SPRING), P(AI, -AW, SPRING))
  stone.quad(P(AO, AW, 0), P(AI, AW, 0), P(AI, AW, SPRING), P(AO, AW, SPRING))
  for (let k = 0; k < ARCH_N; k++) {
    const t0 = (k / ARCH_N) * Math.PI, t1 = ((k + 1) / ARCH_N) * Math.PI
    const s0 = AW * Math.cos(t0), z0 = SPRING + AW * Math.sin(t0), s1 = AW * Math.cos(t1), z1 = SPRING + AW * Math.sin(t1)
    stone.quad(P(AO, s0, z0), P(AI, s0, z0), P(AI, s1, z1), P(AO, s1, z1))
  }
}
// Ring top at the entablature, the interior's ceiling, and the floor of the
// open interior is the map's.
{
  const o = polyRing(AO, 8, 0), i = polyRing(AI, 8, 0)
  // rotate polyRing so corners sit between faces: faces centred on k*45°
  for (let k = 0; k < 8; k++) {
    const l = (k + 1) % 8
    stone.quad([...i[k], ENT] as V3, [...o[k], ENT] as V3, [...o[l], ENT] as V3, [...i[l], ENT] as V3)
  }
  const c = polyRing(AI, 8, 0)
  for (let k = 1; k < 7; k++) stone.tri([...c[0], ENT0] as V3, [...c[k + 1], ENT0] as V3, [...c[k], ENT0] as V3) // ceiling, facing down
}
// Entablature band, projecting 1 m round the faces.
{
  const o = polyRing(AO + 1.0, 8, 0), i = polyRing(AO, 8, 0)
  for (let k = 0; k < 8; k++) {
    const l = (k + 1) % 8
    stone.quad([...o[k], ENT0] as V3, [...o[l], ENT0] as V3, [...o[l], ENT] as V3, [...o[k], ENT] as V3)
    stone.quad([...i[k], ENT0] as V3, [...i[l], ENT0] as V3, [...o[l], ENT0] as V3, [...o[k], ENT0] as V3)
    stone.quad([...i[k], ENT] as V3, [...o[k], ENT] as V3, [...o[l], ENT] as V3, [...i[l], ENT] as V3)
  }
}
// Corner clusters: a tall pedestal, two red columns side by side across the
// corner, and the entablature breaking forward over them (OSM `column` parts).
for (let k = 0; k < 8; k++) {
  const c = ((k + 0.5) * Math.PI) / 4
  const rot = (x: number, y: number): XY => [x * Math.cos(c) - y * Math.sin(c), x * Math.sin(c) + y * Math.cos(c)]
  // plan in the corner's own frame (x out along the corner's bisector)
  const ped: XY[] = [[21.0, -3.4], [26.6, -3.4], [26.6, 3.4], [21.0, 3.4]].map(([x, y]) => rot(x, y))
  prism(stone, ped, 0, 6.9)
  const cap: XY[] = [[21.0, -3.6], [26.9, -3.6], [26.9, 3.6], [21.0, 3.6]].map(([x, y]) => rot(x, y))
  prism(stone, cap, ENT0 - 0.6, ENT)
  for (const t of [-2.2, 2.2]) {
    column(red, rot(24.6, t), 1.2, 6.9, ENT0 - 2.0, 10, 1.05)
    column(stone, rot(24.6, t), 1.1, ENT0 - 2.0, ENT0 - 0.6, 8, 1.5) // capital
    prism(stone, rect(rot(24.6, t), c, 1.5, 1.5), 6.9, 7.8) // base
  }
  // the pier behind the pair, between the two arches (a pilastered corner)
  prism(stone, [[21.0, -2.0], [23.2, -2.0], [23.2, 2.0], [21.0, 2.0]].map(([x, y]) => rot(x, y)), 6.9, ENT0 - 0.6, false, false)
}
// Attic: octagon with a corner pier at each angle, cornice, drum, dome.
{
  prism(stone, polyRing(21.4, 8, 0), ENT, ATTIC)
  prism(stone, polyRing(22.0, 8, 0), ATTIC, CORNICE)
  // the relief panel on each attic face, a shallow raised slab
  for (let f = 0; f < 8; f++) {
    const a = (f * Math.PI) / 4, ap = 21.4 * Math.cos(Math.PI / 8) / Math.cos(Math.PI / 8)
    prism(stone, rect([(ap + 0.15) * Math.cos(a), (ap + 0.15) * Math.sin(a)], a, 0.25, 4.4), 29.8, 34.0, false, true)
  }
  for (let k = 0; k < 8; k++) {
    const c = ((k + 0.5) * Math.PI) / 4
    // the corner piers of the attic, with the statue groups standing in
    // front of them on the projecting entablature drawn as one mass
    prism(stone, rect([22.2 * Math.cos(c), 22.2 * Math.sin(c)], c, 2.2, 2.2), ENT, ATTIC + 0.4)
    prism(stone, rect([24.4 * Math.cos(c), 24.4 * Math.sin(c)], c, 1.0, 1.5), ENT, 33.6)
    prism(stone, rect([22.4 * Math.cos(c), 22.4 * Math.sin(c)], c, 1.5, 1.5), CORNICE, 37.6)
  }
  lathe(stone, [[20.3, CORNICE], [20.3, 37.0], [19.2, 37.4], [18.2, 39.0], [17.4, 40.0]], 24)
  // Dome: a spherical cap 17.4 m in radius at 40.0, crown 49.1 (lidar).
  const H = 9.1, B = 17.4, R = (B * B + H * H) / (2 * H), zc = 49.1 - R
  const prof: [number, number][] = []
  const tMax = Math.asin(B / R)
  for (let i = 0; i <= 7; i++) { const t = tMax * (1 - i / 7); prof.push([R * Math.sin(t), zc + R * Math.cos(t)]) }
  lathe(dome, prof, 24)
}
// The low curved walls between the corner clusters (OSM, lidar 5.5 m).
const LOW_WALLS: XY[][] = [
  [[16.8, 33.3], [14.7, 32.3], [13.3, 31.2], [11.6, 29.4], [10.7, 27.7], [10.3, 26.5], [10.1, 25.0], [15.6, 22.5], [15.3, 23.0], [15.5, 24.5], [16.3, 26.4], [17.6, 27.5], [18.2, 27.8]],
  [[-14.5, 22.6], [-9.2, 25.4], [-9.5, 27.2], [-10.4, 29.5], [-12.1, 31.6], [-13.7, 33.1], [-15.6, 34.0], [-17.5, 28.6], [-16.4, 27.8], [-15.2, 26.7], [-14.5, 25.0], [-14.3, 23.2]],
  [[-21.1, 15.9], [-23.6, 15.4], [-24.1, 14.3], [-25.2, 14.0], [-26.2, 12.9], [-26.8, 12.1], [-27.2, 10.7], [-27.3, 9.5], [-27.0, 8.3], [-26.5, 7.7], [-25.7, 7.4], [-25.9, 6.5], [-27.3, 6.7], [-27.3, 3.9], [-25.9, 3.9], [-24.3, 11.0]],
  [[-21.5, -15.1], [-23.9, -14.5], [-24.4, -13.4], [-25.3, -13.2], [-26.6, -12.2], [-27.3, -11.0], [-27.7, -9.6], [-27.5, -7.9], [-27.2, -6.9], [-26.1, -6.4], [-26.2, -5.7], [-27.5, -5.7], [-27.3, -3.1], [-26.1, -3.1], [-24.8, -10.1]],
  [[-15.4, -22.2], [-12.4, -23.7], [-9.9, -25.0], [-10.3, -27.2], [-10.9, -28.2], [-12.0, -29.9], [-13.4, -31.5], [-14.9, -32.5], [-16.6, -33.4], [-18.3, -27.8], [-17.2, -27.1], [-16.2, -26.0], [-15.4, -24.2], [-15.3, -22.7]],
  [[9.2, -25.5], [9.5, -27.8], [10.3, -29.6], [11.4, -31.1], [12.9, -32.2], [14.2, -33.3], [15.8, -34.0], [17.7, -28.4], [16.4, -27.6], [15.3, -26.1], [15.0, -25.1], [14.6, -24.1], [14.8, -23.0]],
  [[28.5, -16.6], [27.6, -17.5], [26.8, -16.6], [25.3, -15.7], [23.8, -15.3], [22.6, -15.5], [26.5, -7.3], [26.9, -8.7], [28.0, -10.0], [29.4, -11.0], [30.5, -11.5]],
  [[27.0, 7.2], [23.2, 14.9], [24.2, 14.7], [25.7, 14.8], [27.2, 15.6], [27.9, 16.6], [28.6, 15.2], [31.0, 10.2], [29.1, 9.4], [27.8, 8.3]],
]
/** Drop vertices that bend the outline by less than `tol` metres (closed ring). */
function simplify(p: XY[], tol: number): XY[] {
  let q = [...p], changed = true
  while (changed && q.length > 4) {
    changed = false
    for (let i = 0; i < q.length; i++) {
      const a = q[(i + q.length - 1) % q.length], b = q[i], c = q[(i + 1) % q.length]
      const l = Math.hypot(c[0] - a[0], c[1] - a[1]) || 1
      const d = Math.abs((c[0] - a[0]) * (a[1] - b[1]) - (a[0] - b[0]) * (c[1] - a[1])) / l
      if (d < tol) { q.splice(i, 1); changed = true; break }
    }
  }
  return q
}
for (const w of LOW_WALLS) prism(stone, simplify(w, 0.45), 0, 4.0)

// ---- Colonnades --------------------------------------------------------------
// Two arcs of paired columns under a continuous entablature, with a planter
// box over every group of four columns. Centrelines and box positions from
// the OSM outlines (their bulges are the groups); heights from lidar.
const COL_TOP = 15.0, C_ENT = 17.8, BOX = 21.4, BOX_CAP = 21.9
type Colonnade = { line: XY[]; boxes: XY[] }
const NORTH: Colonnade = {
  line: [[-28.5, 30.5], [-25.5, 38.5], [-18.3, 51.0], [-14.5, 57.0], [-4.9, 67.2], [5.2, 75.2], [10.6, 77.6], [16.5, 78.0], [27.5, 77.6], [31.6, 77.8], [31.7, 101.0], [32.4, 105.4]],
  boxes: [[-28.5, 30.5], [-18.3, 51.0], [-4.9, 67.2], [16.5, 78.0], [31.6, 77.8], [32.4, 105.4]],
}
const SOUTH: Colonnade = {
  line: [[-29.5, -30.0], [-26.0, -39.0], [-20.2, -50.5], [-12.9, -61.0], [-6.7, -67.7], [-0.9, -74.0], [9.0, -78.0], [14.5, -79.0], [21.0, -77.8], [28.5, -77.8], [30.5, -78.5], [28.8, -82.0], [28.8, -102.0], [29.0, -106.4]],
  boxes: [[-29.5, -30.0], [-20.2, -50.5], [-6.7, -67.7], [14.5, -79.0], [30.5, -78.5], [29.0, -106.4]],
}
/** A group of four columns carrying a planter box, turned to angle a. */
function boxGroup(c: XY, a: number, half = 1.8, big = false) {
  const u: XY = [Math.cos(a), Math.sin(a)], v: XY = [-u[1], u[0]]
  for (const s of [-1, 1]) for (const t of [-1, 1]) column(stone, [c[0] + (u[0] * s + v[0] * t) * half, c[1] + (u[1] * s + v[1] * t) * half], 0.8, 0, COL_TOP, 6)
  const e = half + 1.0
  prism(stone, rect(c, a, e, e), COL_TOP, C_ENT, true)
  prism(stone, rect(c, a, e - 0.5 + (big ? 0.3 : 0), e - 0.5 + (big ? 0.3 : 0)), C_ENT, BOX)
  prism(stone, rect(c, a, e - 0.2 + (big ? 0.3 : 0), e - 0.2 + (big ? 0.3 : 0)), BOX, BOX_CAP, true)
}
function colonnade({ line, boxes }: Colonnade) {
  const near = (p: XY, d: number) => boxes.some((b) => Math.hypot(p[0] - b[0], p[1] - b[1]) < d)
  for (let i = 0; i < line.length - 1; i++) {
    const a = line[i], b = line[i + 1]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]), dir = Math.atan2(b[1] - a[1], b[0] - a[0])
    // entablature over this run, overlapping the next at the joint
    const mid: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    prism(stone, rect(mid, dir, len / 2 + 1.0, 2.0), COL_TOP, C_ENT, true)
    // columns in two rows, 4.2 m apart, kept clear of the box groups
    const n = Math.max(1, Math.round(len / 4.2))
    for (let k = 0; k <= n; k++) {
      if (k === n && i < line.length - 2) continue
      const p: XY = [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]
      if (near(p, 3.4)) continue
      for (const t of [-1.35, 1.35]) column(stone, [p[0] - Math.sin(dir) * t, p[1] + Math.cos(dir) * t], 0.75, 0, COL_TOP, 6)
    }
  }
  for (const bx of boxes) {
    // turn each group to its run
    let best = 0, bd = Infinity
    for (let i = 0; i < line.length - 1; i++) {
      const d = Math.hypot(line[i][0] - bx[0], line[i][1] - bx[1]) + Math.hypot(line[i + 1][0] - bx[0], line[i + 1][1] - bx[1])
      if (d < bd) { bd = d; best = i }
    }
    const a = line[best], b = line[best + 1]
    boxGroup(bx, Math.atan2(b[1] - a[1], b[0] - a[0]))
  }
}
colonnade(NORTH)
colonnade(SOUTH)
// The two free-standing groups beyond the colonnades' ends (OSM 288371313/14).
boxGroup([15.5, 104.1], Math.PI / 2, 2.4, true)
boxGroup([12.2, -104.7], Math.PI / 2, 2.4, true)

// ---- Exhibition hall ---------------------------------------------------------
// A crescent 42.6 m deep round a centre east of the rotunda; walls 12 m, a
// pitched roof to 15.3 and a raised monitor 7 m wide at 17.8 down its middle.
const HALL: XY[] = [[-87.0, -49.6], [-88.1, -46.5], [-91.0, -36.2], [-93.0, -26.5], [-94.2, -15.1], [-94.9, -4.8], [-94.8, 3.5], [-94.9, 6.3], [-94.1, 15.7], [-92.5, 26.7], [-90.0, 37.1], [-87.1, 47.8], [-83.7, 56.7], [-79.2, 66.4], [-73.8, 77.0], [-68.2, 85.9], [-60.6, 96.4], [-54.0, 104.0], [-49.0, 109.1], [-44.8, 113.3], [-38.4, 119.0], [-31.1, 124.5], [-22.1, 130.6], [-12.7, 136.4], [-6.5, 126.6], [-9.1, 124.9], [1.0, 108.3], [2.4, 109.2], [8.2, 99.9], [0.0, 94.9], [-4.7, 92.5], [-16.0, 82.8], [-23.9, 74.5], [-30.5, 66.0], [-36.1, 57.6], [-40.2, 51.3], [-43.9, 43.2], [-47.7, 31.5], [-50.3, 20.8], [-51.7, 12.1], [-52.2, 2.2], [-52.1, -7.0], [-51.2, -17.2], [-49.6, -25.9], [-47.0, -35.6], [-43.9, -44.4], [-39.7, -53.1], [-36.9, -58.5], [-30.4, -68.4], [-25.8, -74.6], [-19.0, -82.4], [-11.6, -88.7], [-3.4, -94.5], [-3.0, -93.9], [5.7, -99.5], [-0.7, -109.2], [-2.1, -108.4], [-13.1, -125.4], [-11.1, -126.6], [-16.9, -135.4], [-25.8, -129.7], [-32.1, -125.8], [-38.6, -121.0], [-45.2, -114.9], [-50.6, -109.6], [-53.0, -107.1], [-59.3, -100.0], [-67.0, -90.1], [-72.0, -82.3], [-74.8, -77.2], [-76.9, -75.2], [-76.6, -74.0], [-80.8, -65.5], [-84.2, -57.2], [-84.8, -55.7], [-85.9, -52.5], [-87.0, -49.6]]
const HC: XY = [25, 0]
/** Inner and outer wall radii about HC at angle th, from the OSM outline. */
function hallRadii(th: number, poly: XY[]): number[] {
  const dx = Math.cos(th), dy = Math.sin(th), out: number[] = []
  for (let i = 0; i < poly.length - 1; i++) {
    const [x0, y0] = poly[i], [x1, y1] = poly[i + 1]
    const ex = x1 - x0, ey = y1 - y0, den = dx * ey - dy * ex
    if (Math.abs(den) < 1e-9) continue
    const t = ((x0 - HC[0]) * ey - (y0 - HC[1]) * ex) / den, u = ((x0 - HC[0]) * dy - (y0 - HC[1]) * dx) / den
    if (t > 0 && u >= 0 && u <= 1) out.push(t)
  }
  return out.sort((a, b) => a - b)
}
{
  const T0 = (107 * Math.PI) / 180, T1 = (250 * Math.PI) / 180
  const N = 30
  const all: { th: number; ri: number; ro: number }[] = []
  for (let k = 0; k <= N; k++) {
    const th = T0 + ((T1 - T0) * k) / N
    const h = hallRadii(th, HALL)
    all.push({ th, ri: h[0], ro: h[h.length - 1] })
  }
  // cross-section: fraction across the hall -> height
  const W0 = 12.0, PITCH = 15.3, MON = 17.8, MW = 3.6
  const at = (r: { th: number; ri: number; ro: number }, f: number, z: number, dr = 0): V3 => {
    const rr = r.ri + (r.ro - r.ri) * f + dr
    return [HC[0] + rr * Math.cos(r.th), HC[1] + rr * Math.sin(r.th), z]
  }
  for (let k = 0; k < all.length - 1; k++) {
    const a = all[k], b = all[k + 1] // th decreasing past 180 → increasing: keep winding by sign
    const p = a, q = b
    const w = p.ro - p.ri, half = (f: number) => f
    const fm0 = 0.5 - MW / w, fm1 = 0.5 + MW / w
    // inner wall (faces the centre), outer wall
    hall.quad(at(q, 0, 0), at(p, 0, 0), at(p, 0, W0), at(q, 0, W0))
    hall.quad(at(p, 1, 0), at(q, 1, 0), at(q, 1, W0), at(p, 1, W0))
    // cornice lip on the inner (lagoon) side
    hall.quad(at(q, 0, W0 - 1.2, -0.5), at(p, 0, W0 - 1.2, -0.5), at(p, 0, W0, -0.5), at(q, 0, W0, -0.5))
    hall.quad(at(q, 0, W0, -0.5), at(p, 0, W0, -0.5), at(p, 0, W0), at(q, 0, W0))
    // roof slopes, monitor sides and top
    roof.quad(at(q, 0, W0), at(p, 0, W0), at(p, fm0, PITCH), at(q, fm0, PITCH))
    roof.quad(at(p, 1, W0), at(q, 1, W0), at(q, fm1, PITCH), at(p, fm1, PITCH))
    hall.quad(at(q, fm0, PITCH), at(p, fm0, PITCH), at(p, fm0, MON), at(q, fm0, MON))
    hall.quad(at(p, fm1, PITCH), at(q, fm1, PITCH), at(q, fm1, MON), at(p, fm1, MON))
    roof.quad(at(q, fm0, MON), at(p, fm0, MON), at(p, fm1, MON), at(q, fm1, MON))
    void half
  }
  // Door panels on the inner wall, every other bay, and the gable ends.
  for (let k = 1; k < all.length - 1; k += 3) {
    const r = all[k], d = 0.06
    const c = at(r, 0, 0, -d), tdir: V3 = [-Math.sin(r.th), Math.cos(r.th), 0]
    const P = (s: number, z: number): V3 => [c[0] + tdir[0] * s, c[1] + tdir[1] * s, z]
    door.quad(P(2.2, 0), P(-2.2, 0), P(-2.2, 7.5), P(2.2, 7.5))
  }
  // End blocks (OSM 1550664397 and 1550664401, lidar 17.8) close the crescent.
  for (const sgn of [1, -1]) {
    const r = sgn > 0 ? all[0] : all[all.length - 1]
    const tdir: XY = [-Math.sin(r.th) * sgn, Math.cos(r.th) * sgn]
    const p0: XY = [HC[0] + (r.ri - 1) * Math.cos(r.th), HC[1] + (r.ri - 1) * Math.sin(r.th)]
    const p1: XY = [HC[0] + (r.ro + 1) * Math.cos(r.th), HC[1] + (r.ro + 1) * Math.sin(r.th)]
    const blk: XY[] = [p0, p1, [p1[0] + tdir[0] * 12, p1[1] + tdir[1] * 12], [p0[0] + tdir[0] * 12, p0[1] + tdir[1] * 12]]
    prism(hall, blk, 0, 18.1) // a hair over the monitor it meets
    const mid: XY = [(p0[0] + p1[0]) / 2 + tdir[0] * 12.07, (p0[1] + p1[1]) / 2 + tdir[1] * 12.07]
    const ang = Math.atan2(tdir[1], tdir[0])
    const n: XY = [Math.cos(ang), Math.sin(ang)], t: XY = [-n[1], n[0]]
    const P = (s: number, z: number): V3 => [mid[0] + t[0] * s, mid[1] + t[1] * s, z]
    door.quad(P(-4, 0), P(4, 0), P(4, 9), P(-4, 9))
  }
}

// ---- Write -----------------------------------------------------------------
// sRGB from the daylight photos, pulled to the palette's lightness.
const parts = [
  { part: stone, material: finish('ochre-stone', 0xe0c6a4) },
  { part: red, material: finish('red-ochre', 0xc27f6a) },
  { part: dome, material: finish('dome-cream', 0xeee3cc) },
  { part: hall, material: finish('hall-concrete', 0xe6dccb) },
  { part: roof, material: { ...PALETTE.roof, color: 0xaab0b3 } },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
for (const { part, material } of parts) console.log(`  ${material.name}: ${part.triangles}`)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Palace of Fine Arts', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 49.1,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: REPLACES,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-palace-of-fine-arts.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
