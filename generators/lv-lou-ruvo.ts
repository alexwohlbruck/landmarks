/**
 * Cleveland Clinic Lou Ruvo Center for Brain Health, Las Vegas (Frank
 * Gehry, 2009-10). Procedural, CC0-1.0.
 * bun generators/lv-lou-ruvo.ts
 *
 * Three parts: the white stucco clinic of stacked, staggered boxes on the
 * north-east; the stainless-steel Keep Memory Alive event center on the
 * south-west, drawn as three free-form lobes with a fold that overhangs the
 * lower wall and broad punched windows; and the steel trellis between
 * them, drawn as its long perforated grid frame and the open cage at the
 * west end. A low white block stands at the south-east corner.
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the parts are not
 * on one axis). Origin: centroid of OSM way/484153262.
 *
 * Measured:
 * - OSM way/484153262 ("Keep Memory Alive Event Center", architect Frank
 *   Gehry): the outline of the whole complex. Its north-east edge,
 *   (-13.7, 39.1) to (41.9, 9.3), bearing 118°, is the clinic's long face;
 *   its south-east corner is the white block. way/130585544 ("Lou Ruvo
 *   Center for Brain Health") is the untagged site lot, not a building.
 * - USGS NAIP orthophoto (public domain): the clinic's 17 m depth and the
 *   courtyard 10 m wide south-west of it; the steel lobes' grey roofs across
 *   the south-west (x -31..10, y -37..-10); the pale flat roof between them
 *   and the courtyard; the cage's bright steel at the west end (-22, 4).
 *
 * Published (Wikipedia): about 65,000 sq ft; Gehry Partners; opened 2009-10.
 * No published heights.
 *
 * Photos (Wikimedia Commons), compared with renders from the same sides:
 * - "Lou Ruvo Center - 2010-12-10 - South.JPG", "... - North.JPG",
 *   "Lou Ruvo Center - West - 2010-12-10.JPG", "... - South West Corner -
 *   2010-12-10.JPG", "... - South East Corner - 2010-03-05.JPG",
 *   "... - North West Corner - 2010-03-05.JPG", Cygnusloop99, CC BY-SA 3.0;
 * - "Lou Ruvo Center Brain Clinic - panoramio.jpg", Alen Ištoković, CC BY 3.0
 *   (from the south-west);
 * - "Lou Ruvo, Center for Brain Health, Las Vegas (4583166580).jpg", Sandra
 *   Cohen-Rose and Colin Rose, CC BY-SA 2.0 (the long grid frame behind);
 * - "Lou Ruvo Center For Brain Health Las Vegas (59457436).jpeg", O
 *   Palsson, CC BY 3.0; "Lou Ruvo Center (20287814466).jpg", Janusz
 *   Sobolewski, CC BY 2.0; "Center for Brain Health gf 429.jpg", Gillfoto,
 *   CC BY-SA 4.0; "Gehry Las Vegas.jpg", Monster4711, CC BY-SA 3.0;
 * - "View of the World Market Center, Lou Ruvo Brain Institute ...
 *   LCCN2010630608", Carol M. Highsmith, public domain (from the
 *   Stratosphere, under construction: the plan of the three parts).
 *
 * Estimated: every height. The clinic at four tiers of 5-5.6 m (20.6 m),
 * from the photos' storey count; the frame at 21 m, rising to about 25 m at
 * its west end (N and NW photos show it just over the clinic); the steel
 * lobes at 17.5-21 m, the white block at 9.5 m, the cage at 13-14.5 m, all
 * scaled against the clinic in the photos. The box and bay lengths are a
 * seeded stagger, not a survey of the real facade. The lobes' shapes are an
 * abstraction: positions from NAIP, lean, fold and tilt from the photos.
 *
 * Not modelled: the trellis's curved overhead beams over the courtyard
 * (only its frame and cage), the coloured courtyard walls, signage.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ccw, prism, save, type XY } from './lv-wynn'
import { quadTo, triTo } from './lv-mgm-grand'

const STEEL = finish('steel', 0xc4c8cc, 0.4)
const steel = new Part(), stucco = new Part(), win = new Part()

// ------------------------------------------------------------ small vector kit
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const subv = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const scl = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const bil = (q: V3[], s: number, t: number): V3 => {
  // q = [a (s0,t0), b (s1,t0), c (s1,t1), d (s0,t1)]
  const lo = add(scl(q[0], 1 - s), scl(q[1], s)), hi = add(scl(q[3], 1 - s), scl(q[2], s))
  return add(scl(lo, 1 - t), scl(hi, t))
}
let seed = 7
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)

// ------------------------------------------------------------ the clinic frame
// The clinic's long north-east face, from OSM way/484153262: (-13.7, 39.1)
// to (41.9, 9.3), bearing 118°. u runs along it to the south-east, v points
// out of it to the north-east; the clinic is 17 m deep (v from -17 to 0).
const O: XY = [-13.7, 39.1], U: XY = [0.881, -0.472], VN: XY = [0.472, 0.881]
const at = (u: number, v: number): XY => [O[0] + U[0] * u + VN[0] * v, O[1] + U[1] * u + VN[1] * v]
const box = (u0: number, u1: number, v0: number, v1: number): XY[] => [at(u0, v0), at(u1, v0), at(u1, v1), at(u0, v1)]
const P3 = (p: XY, z: number): V3 => [p[0], p[1], z]

// ------------------------------------------------------------ 1. the clinic's stacked boxes
const DEPTH = 17
const TIERS: Array<{ z0: number; z1: number; u0: number; u1: number }> = [
  { z0: 0, z1: 5.6, u0: 0, u1: 62 },
  { z0: 5.6, z1: 10.6, u0: 1.6, u1: 60.5 },
  { z0: 10.6, z1: 15.6, u0: 3.2, u1: 59 },
  { z0: 15.6, z1: 20.6, u0: 5, u1: 57 },
]
/** A glass bay: a recessed stucco block with a window panel on both long faces. */
function bay(u0: number, u1: number, z0: number, z1: number) {
  prism(stucco, stucco, box(u0, u1, -DEPTH + 0.7, -0.7), z0, z1, 0, 0)
  for (const [v, s] of [[-0.64, 1], [-DEPTH + 0.64, -1]] as const) {
    const a = at(u0 + 0.2, v), b = at(u1 - 0.2, v)
    quadTo(win, P3(a, z0 + 0.4), P3(b, z0 + 0.4), P3(b, z1 - 0.4), P3(a, z1 - 0.4), [VN[0] * s, VN[1] * s, 0])
  }
}
TIERS.forEach((t, k) => {
  // Boxes 7-10 m long between glass bays 3.5-5 m wide, staggered tier by
  // tier the way the photos show them tumbling.
  let u = t.u0
  let glass = k % 2 === 1
  const top = k === TIERS.length - 1
  while (u < t.u1 - 0.5) {
    const len = glass ? 4.2 + rnd() * 1.6 : 4.8 + rnd() * 2.6
    const u1 = Math.min(t.u1, u + len)
    const rest = t.u1 - u1
    const end = rest < 4 ? t.u1 : u1
    if (glass && u > t.u0 + 0.1 && end < t.u1 - 0.1) bay(u, end, t.z0, t.z1)
    else {
      // Boxes stand a little proud of the bays and of each other.
      const out = 0.25 + rnd() * 0.6, back = 0.25 + rnd() * 0.6
      const z1 = t.z1 + (top ? rnd() * 1.4 : 0)
      prism(stucco, stucco, box(u, end, -DEPTH - back, out), t.z0, z1, top ? 0.35 : 0, 0.3)
    }
    u = end
    glass = !glass
  }
})

// ------------------------------------------------------------ lofted steel lobes
type Level = { z: number; c: XY; r: XY; rot?: number; tilt?: [number, number]; wave?: number; crease?: boolean }
/**
 * A free-form steel lobe: rounded-box rings (superellipse) lofted through
 * the levels with smooth normals, a fan cap on the top ring (which may tilt
 * and undulate), and window panels on the cells `win(k, i)` picks.
 */
function lobe(levels: Level[], seg: number, wants: (k: number, i: number) => boolean, capPart: Part = steel) {
  const ring = (L: Level): V3[] => Array.from({ length: seg }, (_, i) => {
    const a = (i / seg) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a)
    // Superellipse exponent 3.6: a soft box, flat-sided with round corners.
    const e = 2 / 3.6
    const x = L.r[0] * Math.sign(ca) * Math.abs(ca) ** e, y = L.r[1] * Math.sign(sa) * Math.abs(sa) ** e
    const ro = ((L.rot ?? 0) * Math.PI) / 180
    const px = L.c[0] + x * Math.cos(ro) - y * Math.sin(ro), py = L.c[1] + x * Math.sin(ro) + y * Math.cos(ro)
    let z = L.z
    // tilt: [rise, world direction of the high side, degrees ccw from east]
    if (L.tilt) z += L.tilt[0] * Math.cos(Math.atan2(py - L.c[1], px - L.c[0]) - (L.tilt[1] * Math.PI) / 180)
    if (L.wave) z += L.wave * Math.sin(2 * a + 0.7)
    return [px, py, z]
  })
  const R = levels.map(ring)
  const n = R.length
  // Smooth round each ring; smooth up the lobe too, except at a crease
  // level, where each band keeps its own slope (the lip's sharp fold).
  const normal = (k: number, i: number, band: number): V3 => {
    const t = subv(R[k][(i + 1) % seg], R[k][(i + seg - 1) % seg])
    const v = levels[k].crease ? subv(R[band + 1][i], R[band][i]) : subv(R[Math.min(n - 1, k + 1)][i], R[Math.max(0, k - 1)][i])
    return unit(crs(t, v))
  }
  for (let k = 0; k < n - 1; k++)
    for (let i = 0; i < seg; i++) {
      const j = (i + 1) % seg
      const A = R[k][i], B = R[k][j], C = R[k + 1][j], D = R[k + 1][i]
      const nA = normal(k, i, k), nB = normal(k, j, k), nC = normal(k + 1, j, k), nD = normal(k + 1, i, k)
      steel.tri(A, B, C, [0, 0], [0, 0], [0, 0], [nA, nB, nC])
      steel.tri(A, C, D, [0, 0], [0, 0], [0, 0], [nA, nC, nD])
      if (wants(k, i)) {
        const q = [A, B, C, D]
        const nn = unit(add(add(nA, nB), add(nC, nD)))
        const off = scl(nn, 0.08)
        const w = [bil(q, 0.2, 0.22), bil(q, 0.8, 0.22), bil(q, 0.8, 0.72), bil(q, 0.2, 0.72)].map((p) => add(p, off))
        quadTo(win, w[0], w[1], w[2], w[3], nn)
      }
    }
  // Fan cap over the top ring.
  const top = R[n - 1]
  const cz = top.reduce((s, p) => s + p[2], 0) / seg
  const cx = top.reduce((s, p) => s + p[0], 0) / seg, cy = top.reduce((s, p) => s + p[1], 0) / seg
  // Dished, so the rim reads as a sheet edge rather than a dome.
  const c: V3 = [cx, cy, cz - 1.5]
  for (let i = 0; i < seg; i++) triTo(capPart, top[i], top[(i + 1) % seg], c, [0, 0, 1])
}

// ------------------------------------------------------------ 2. the event center
// The hall's flat middle (the pale roof between the lobes and the
// courtyard on NAIP), a plain block the lobes stand round.
prism(steel, stucco, [[-24, -6], [-14, -1], [-4, -6], [6, -13], [7, -20], [-10, -18], [-23, -13]], 0, 10, 0.3, 0.3)
/**
 * The lobes rise from the ground. Each swells into a lip a third of the
 * way up (the overhanging fold the photos show between the lower wall and
 * the upper sheets), then rises nearly sheer to a tilted, rippling top.
 */
const lip = (c: XY, r: XY, rot: number, top: number, push: XY, lean: XY, tilt: [number, number], wave = 0, twist = 10): Level[] => {
  const at = (p: number, l: number): XY => [c[0] + push[0] * p + lean[0] * l, c[1] + push[1] * p + lean[1] * l]
  const rs = (f: number): XY => [r[0] * f, r[1] * f]
  return [
    { z: 0, c, r, rot },
    { z: 3.6, c, r: rs(0.97), rot },
    // the lower wall leans back, then the upper sheet kicks out over it
    { z: 7, c: at(0.2, 0), r: rs(0.92), rot: rot + twist * 0.3, crease: true },
    { z: 8.1, c: at(1, 0.05), r: rs(1.18), rot: rot + twist * 0.45, crease: true },
    { z: 11.6, c: at(0.9, 0.3), r: rs(1.1), rot: rot + twist * 0.6 },
    { z: (11.6 + top) / 2, c: at(0.5, 0.65), r: rs(1.05), rot: rot + twist * 0.8, tilt: [tilt[0] / 2, tilt[1]] },
    { z: top, c: at(0.3, 1), r: rs(0.95), rot: rot + twist, tilt, wave },
  ]
}
// Windows: two rows on the lower wall, none on the lip's underside, then
// the upper sheet's rows, every other cell.
const rowsOf = (o: number) => (k: number, i: number) => k !== 2 && (i * 3 + k * 2 + o) % 5 !== 0
// West lobe: leans west, its top sloping down to the south-west.
lobe(lip([-20, -19.5], [6.6, 8.6], 30, 17.5, [-1.6, -1.8], [-5.5, 1], [3, 190], 1, 14), 14, rowsOf(0))
// Central lobe: the tallest, its lip folding out to the south.
lobe(lip([-8.5, -25], [7, 7.4], 12, 19.5, [0.6, -2.6], [0.5, 0.5], [2, 260], 1.6, -12), 14, rowsOf(2))
// East roll: lower, swelling out to the south-east and tucking in.
lobe([
  { z: 0, c: [3.5, -25], r: [5, 5.2] },
  { z: 3.6, c: [4, -26], r: [5.8, 5.8], rot: 10 },
  { z: 7.5, c: [4.6, -27], r: [6.6, 6.4], rot: 20 },
  { z: 11, c: [5, -27], r: [6, 6], rot: 30 },
  { z: 14, c: [4.5, -26], r: [4.4, 4.6], rot: 40, tilt: [1.4, 300] },
], 12, (k, i) => k !== 4 && (i + k) % 2 === 0)

// ------------------------------------------------------------ 3. the trellis: grid frames
/**
 * A perforated steel frame along a plan polyline: vertical bars at every
 * point, horizontal bars per segment, `rows` openings high. The top may
 * rise towards either end (`rise`), and lean along `lean` (m per m up).
 */
function gridWall(path: XY[], z0: number, z1: (i: number) => number, rows: number, bar: number, thick: number) {
  const n = path.length
  const dir = (i: number): XY => {
    const a = path[Math.max(0, i - 1)], b = path[Math.min(n - 1, i + 1)]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1])
    return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]
  }
  const side = (i: number): XY => { const d = dir(i); return [d[1], -d[0]] } // right of the path
  const cornerPts = (i: number, along: number, h: number): XY[] => {
    // the bar's plan rectangle at point i: `along` either way, thick across
    const d = dir(i), s = side(i), p = path[i]
    return [
      [p[0] - d[0] * along - s[0] * thick / 2, p[1] - d[1] * along - s[1] * thick / 2],
      [p[0] + d[0] * along - s[0] * thick / 2, p[1] + d[1] * along - s[1] * thick / 2],
      [p[0] + d[0] * along + s[0] * thick / 2, p[1] + d[1] * along + s[1] * thick / 2],
      [p[0] - d[0] * along + s[0] * thick / 2, p[1] - d[1] * along + s[1] * thick / 2],
    ]
  }
  // Vertical bars.
  for (let i = 0; i < n; i++) prism(steel, steel, cornerPts(i, bar / 2, 0), z0, z1(i), 0, 0)
  // Horizontal bars between neighbouring verticals, `rows + 1` of them.
  for (let i = 0; i < n - 1; i++) {
    const a = path[i], b = path[i + 1]
    const d: XY = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(d[0], d[1])
    const t: XY = [d[0] / l, d[1] / l], s: XY = [t[1], -t[0]]
    const pa: XY = [a[0] + t[0] * bar / 2, a[1] + t[1] * bar / 2], pb: XY = [b[0] - t[0] * bar / 2, b[1] - t[1] * bar / 2]
    const ring: XY[] = [
      [pa[0] - s[0] * thick / 2, pa[1] - s[1] * thick / 2], [pb[0] - s[0] * thick / 2, pb[1] - s[1] * thick / 2],
      [pb[0] + s[0] * thick / 2, pb[1] + s[1] * thick / 2], [pa[0] + s[0] * thick / 2, pa[1] + s[1] * thick / 2],
    ]
    const ha = z1(i), hb = z1(i + 1)
    for (let r = 0; r <= rows; r++) {
      // bars evenly spaced; the top bar follows the top line
      const f = r / rows
      const za = z0 + (ha - z0) * f, zb = z0 + (hb - z0) * f
      const h0a = Math.max(z0, za - (r === rows ? bar : bar / 2)), h1a = Math.min(ha, za + (r === 0 ? bar : bar / 2))
      const h0b = Math.max(z0, zb - (r === rows ? bar : bar / 2)), h1b = Math.min(hb, zb + (r === 0 ? bar : bar / 2))
      const lo = [P3(ring[0], h0a), P3(ring[1], h0b), P3(ring[2], h0b), P3(ring[3], h0a)]
      const hi = [P3(ring[0], h1a), P3(ring[1], h1b), P3(ring[2], h1b), P3(ring[3], h1a)]
      const sv: V3 = [s[0], s[1], 0]
      quadTo(steel, lo[0], lo[1], hi[1], hi[0], scl(sv, -1))
      quadTo(steel, lo[2], lo[3], hi[3], hi[2], sv)
      if (r > 0) quadTo(steel, lo[0], lo[1], lo[2], lo[3], [0, 0, -1])
      quadTo(steel, hi[0], hi[1], hi[2], hi[3], [0, 0, 1])
    }
  }
}
// The long frame along the courtyard's south-west side, 11 m off the
// clinic, one opening every 4 m; its west end rises and curls out.
{
  const pts: XY[] = []
  const N = 15
  for (let i = 0; i <= N; i++) {
    const u = -3 + (61 * i) / N
    const v = -27 - 1.6 * Math.sin((i / N) * Math.PI * 1.5)
    pts.push(at(u, v))
  }
  gridWall(pts, 0, (i) => 21 + Math.max(0, 3 - i) * 1.3, 5, 1.3, 0.8)
}
// The cage at the west end of the courtyard: four short frames round a box.
{
  const c: XY = [-22, 4], hw = 6, hd = 5.5
  const rot = (-28 * Math.PI) / 180
  const P = (x: number, y: number): XY => [c[0] + x * Math.cos(rot) - y * Math.sin(rot), c[1] + x * Math.sin(rot) + y * Math.cos(rot)]
  const line = (a: XY, b: XY, k: number) => Array.from({ length: k + 1 }, (_, i) => [a[0] + (b[0] - a[0]) * i / k, a[1] + (b[1] - a[1]) * i / k] as XY)
  const corners = [P(-hw, -hd), P(hw, -hd), P(hw, hd), P(-hw, hd)]
  for (let s = 0; s < 4; s++) gridWall(line(corners[s], corners[(s + 1) % 4], 3), 0, (i) => 13 + (s === 1 || (s === 0 && i === 3) || (s === 2 && i === 0) ? 1.5 : 0), 3, 1.3, 0.8)
}

// ------------------------------------------------------------ 4. the white box on the south-east
prism(stucco, stucco, [[17.8, -28.7], [25.9, -12.6], [11.6, -5.4], [3.5, -21.5]], 0, 9.5, 0.35, 0.3)

if (import.meta.main) {
  await save('lv-lou-ruvo', 'Cleveland Clinic Lou Ruvo Center for Brain Health', [
    { part: steel, material: STEEL },
    { part: stucco, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
  ], 22, 'Y up, -Z north, +X east, metres; origin at the centroid of OSM way/484153262 (-115.1546623, 36.1672742); bearing 0', 6500)
}
