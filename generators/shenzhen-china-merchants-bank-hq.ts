/**
 * China Merchants Bank Global Headquarters (招银环球金融中心), Shenzhen Bay
 * Super Headquarters Base, Nanshan, Shenzhen — original procedural geometry, CC0-1.0.
 * bun generators/shenzhen-china-merchants-bank-hq.ts   (writes the low model and the detail LOD)
 *
 * Frame: bearing 0 (OSM's outline runs east-west). Origin = area centroid of
 * the OSM outline way/1443942674 (113.965175 E, 22.525341 N), on the ground.
 * Elevation 0.
 *
 * Form, as read from OSM and the photos (Foster + Partners with CCDI):
 * - a bundle of rounded tubes: the south face is six round-fronted bays
 *   (scallops), the east and west ends are rounded at their corners, and the
 *   north face is a flat spine; the plan is 71 x 46 m (OSM);
 * - the bays step down outward as they rise (OSM parts): the outer bays and
 *   the north corner blocks stop at 300 m, the next pair at 340 m, the two
 *   central bays rise to 387 m; the flat north spine runs up behind them and
 *   ends in a low peaked crest at the architectural top (393 m);
 * - the tubes are deep blue glass in pyramid-diamond facets, wrapped by
 *   silver: drawn as real 3D pyramids on every bay and rounded end (low model
 *   8.5 x 14 m cells, 1.5 m deep; detail 3.6 x 4.4 m, 0.8 m deep), all in the
 *   blue glass so the light, not a painted pattern, draws the diamonds; bold
 *   silver joints stand between the bays and a silver lip caps each tier; the
 *   north spine is paler glass between bold silver pilasters.
 *
 * Evidence
 * - OSM, fetched 2026-11-27 with tools/osm.py: outline way/1443942674
 *   (招银环球金融中心, 387 m, 75 levels) and its parts way/1443942675 and
 *   way/1443942678 (340 m, 69 levels), way/1443942676 and way/1443942679 (300 m,
 *   61 levels), way/1443942677 (387 m, 75 levels).
 * - Published: main tower 393 m, 77 floors, Foster + Partners and CCDI,
 *   completed 2025 (Wikipedia "China Merchants Bank Tower Global HQ",
 *   Q65054387; CTBUH Skyscraper Center 42765).
 * - Photos (Wikimedia Commons, all CC BY-SA 4.0):
 *   "招银环球金融中心.jpg", Lhzss8, from the SSE (155 deg, 440 m): the stepped tube
 *   tops, the faceted cladding, the sky-garden slots, the crest;
 *   https://commons.wikimedia.org/wiki/File:%E6%8B%9B%E9%93%B6%E7%8E%AF%E7%90%83%E9%87%91%E8%9E%8D%E4%B8%AD%E5%BF%83.jpg
 *   "招银环球金融中心主楼背部.jpg", Lhzss8, from the NE (45 deg, 125 m): the flat
 *   north spine with silver pilasters, its peaked top, the east tubes;
 *   https://commons.wikimedia.org/wiki/File:%E6%8B%9B%E9%93%B6%E7%8E%AF%E7%90%83%E9%87%91%E8%9E%8D%E4%B8%AD%E5%BF%83%E4%B8%BB%E6%A5%BC%E8%83%8C%E9%83%A8.jpg
 *   "招银环球金融中心主楼侧边.jpg", Lhzss8, from the east (79 deg, 340 m): the steps;
 *   https://commons.wikimedia.org/wiki/File:%E6%8B%9B%E9%93%B6%E7%8E%AF%E7%90%83%E9%87%91%E8%9E%8D%E4%B8%AD%E5%BF%83%E4%B8%BB%E6%A5%BC%E4%BE%A7%E8%BE%B9.jpg
 * - No lidar, NAIP or Mapillary used. Look-only references: none.
 *
 * Numbers
 * - Published: 393 m top.
 * - Measured (OSM): the plan and the three tier outlines and heights.
 * - Estimated: the crest (the spine's top, peaked from 386 m at its ends to
 *   393 m), its depth (the north 9 m of the central bays); the facet size
 *   (coarser than the real ~1.5-storey diamonds, so they read); colours sampled
 *   from the SSE and NE photos (#6c6e7d overcast, #3a5590 in sun: deep blue
 *   glass, silver frames), pulled to the palette (#5d7aa6).
 *
 * Doubts
 * - Thin evidence: three open photos, from the south-east, north-east and
 *   east. The west side is unphotographed (a far-west Commons photo found for
 *   this tower shows a different building and was dropped); the south is seen
 *   only from the SSE.
 *   The SSE photo hints that the west bays stop a little lower than the east ones;
 *   drawn symmetric as OSM has it.
 * - The diamonds are coarser than the real ones and plain pyramids; the CMB
 *   logo panel at the top is left out.
 * - The dark sky-garden slots staggered up the bays are left out: their real
 *   levels are not known, and drawn as scattered squares they read as a dot
 *   grid at phone size.
 * - The four lower office buildings of the complex (OSM separate buildings) are
 *   not part of this model.
 *
 * Night: the tubes glow as windows (`window`), the spine too (`window-2`);
 * the silver frames stay unlit.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { face, saveLods, type Layer, type XY } from './auckland-sky-tower'
import { grid, rib, flat } from './shenzhen-ping-an-finance-centre'

const TOP = 393
const T1 = 300, T2 = 340, T3 = 387
const CREST0 = 386

// OSM outlines in this frame (metres east/north of the anchor)
const OUTLINE: XY[] = [[-25.2, 23.4], [-12.9, 23.4], [12.8, 23.4], [25.0, 23.4], [25.0, 14.5], [26.0, 15.6], [27.2, 16.3], [28.5, 16.8], [30.0, 16.9], [31.4, 16.6], [32.7, 16.0], [33.8, 15.1], [34.6, 14.0], [35.1, 12.7], [35.3, 11.2], [35.4, -17.6], [35.0, -19.0], [34.4, -20.2], [33.4, -21.3], [32.2, -22.0], [30.8, -22.5], [29.4, -22.6], [28.0, -22.3], [26.7, -21.7], [25.6, -20.8], [24.8, -19.6], [23.6, -19.6], [22.8, -20.9], [21.6, -21.9], [20.3, -22.6], [18.8, -22.9], [17.3, -22.9], [15.8, -22.5], [14.5, -21.8], [13.3, -20.8], [12.5, -19.5], [11.6, -19.5], [10.7, -20.7], [9.7, -21.6], [8.4, -22.3], [7.0, -22.7], [5.6, -22.8], [4.1, -22.5], [2.8, -21.9], [1.6, -21.1], [0.7, -20.0], [-0.7, -20.0], [-1.6, -21.1], [-2.8, -21.9], [-4.1, -22.5], [-5.6, -22.7], [-7.0, -22.7], [-8.4, -22.3], [-9.7, -21.6], [-10.8, -20.6], [-11.6, -19.4], [-12.5, -19.4], [-13.3, -20.6], [-14.5, -21.7], [-15.8, -22.4], [-17.3, -22.8], [-18.8, -22.8], [-20.3, -22.4], [-21.6, -21.7], [-22.8, -20.7], [-23.6, -19.5], [-24.8, -19.5], [-25.6, -20.7], [-26.7, -21.6], [-28.0, -22.2], [-29.4, -22.5], [-30.8, -22.4], [-32.2, -21.9], [-33.4, -21.2], [-34.4, -20.1], [-35.0, -18.9], [-35.4, -17.5], [-35.4, 11.3], [-35.2, 12.7], [-34.7, 14.1], [-33.9, 15.2], [-32.8, 16.1], [-31.5, 16.7], [-30.1, 17.0], [-28.6, 16.9], [-27.3, 16.4], [-26.1, 15.7], [-25.1, 14.6]]
// union of way/1443942675, 1443942677 and 1443942678 (the 340 m tier and above)
const TIER2: XY[] = [[-12.9, 23.4], [12.8, 23.4], [12.8, 14.4], [13.8, 15.6], [15.0, 16.5], [16.3, 17.1], [17.8, 17.3], [19.3, 17.2], [20.7, 16.8], [21.9, 16.0], [23.0, 14.9], [23.7, 13.7], [24.1, 12.3], [24.2, -18.2], [23.6, -19.6], [22.8, -20.9], [21.6, -21.9], [20.3, -22.6], [18.8, -22.9], [17.3, -22.9], [15.8, -22.5], [14.5, -21.8], [13.3, -20.8], [12.5, -19.5], [11.6, -19.5], [10.7, -20.7], [9.7, -21.6], [8.4, -22.3], [7.0, -22.7], [5.6, -22.8], [4.1, -22.5], [2.8, -21.9], [1.6, -21.1], [0.7, -20.0], [-0.7, -20.0], [-1.6, -21.1], [-2.8, -21.9], [-4.1, -22.5], [-5.6, -22.7], [-7.0, -22.7], [-8.4, -22.3], [-9.7, -21.6], [-10.8, -20.6], [-11.6, -19.4], [-12.5, -19.4], [-13.3, -20.6], [-14.5, -21.7], [-15.8, -22.4], [-17.3, -22.8], [-18.8, -22.8], [-20.3, -22.4], [-21.6, -21.7], [-22.8, -20.7], [-23.6, -19.5], [-24.2, -18.1], [-24.2, 12.4], [-23.8, 13.8], [-23.1, 15.0], [-22.1, 16.1], [-20.8, 16.9], [-19.4, 17.3], [-17.9, 17.4], [-16.5, 17.2], [-15.1, 16.6], [-14.0, 15.7], [-12.9, 14.5]]
// way/1443942677 (the central bays, 387 m), its 0.8 m joint notches dropped
const TIER3: XY[] = [[-12.9, 23.4], [12.8, 23.4], [12.8, -1.5], [12.1, -18.2], [11.6, -19.5], [10.7, -20.7], [9.7, -21.6], [8.4, -22.3], [7.0, -22.7], [5.6, -22.8], [4.1, -22.5], [2.8, -21.9], [1.6, -21.1], [0.7, -20.0], [-0.7, -20.0], [-1.6, -21.1], [-2.8, -21.9], [-4.1, -22.5], [-5.6, -22.7], [-7.0, -22.7], [-8.4, -22.3], [-9.7, -21.6], [-10.8, -20.6], [-11.6, -19.4], [-12.1, -18.0], [-12.9, -1.5]]

const area2 = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
const ccw = (r: XY[]) => (area2(r) < 0 ? [...r].reverse() : r)

/** Extrude a plan (any winding) from z0 to z1 with smooth normals round its curves; pick(edge midpoint, edge normal). */
function extrude(poly: XY[], z0: number, z1: number, pick: (m: XY, n: XY) => Part | null) {
  const r = ccw(poly), n = r.length
  const ring = (z: number) => r.map((p) => [p[0], p[1], z] as V3)
  const dir = (i: number): XY => { const a = r[i], b = r[(i + 1) % n], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / l, (b[1] - a[1]) / l] }
  // smooth at a vertex where the two edges turn by less than 40 degrees and both are short (a curve)
  const smooth = (vi: number) => {
    const d0 = dir((vi - 1 + n) % n), d1 = dir(vi)
    const a = r[vi], p = r[(vi - 1 + n) % n], q = r[(vi + 1) % n]
    const short = Math.hypot(a[0] - p[0], a[1] - p[1]) < 3 && Math.hypot(q[0] - a[0], q[1] - a[1]) < 3
    return short && d0[0] * d1[0] + d0[1] * d1[1] > Math.cos((40 * Math.PI) / 180)
  }
  grid([ring(z0), ring(z1)], true, (i) => {
    const a = r[i], b = r[(i + 1) % n], d = dir(i)
    return pick([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], [d[1], -d[0]])
  }, smooth)
}

/**
 * The diamond cladding in real 3D: the plan's non-north walls (the scalloped
 * bays and rounded ends) between z0 and z1, cut into cells about `cw` wide and
 * `ch` tall, each a low pyramid standing `dp` proud, all in the blue glass:
 * the light falls differently on each of a pyramid's four facets, which draws
 * the diamond relief without painting a pattern (a two-colour version read as
 * an argyle grid at phone size).
 */
function facets(poly: XY[], z0: number, z1: number, cw: number, ch: number, dp: number, glass: Part, isNorth: (m: XY, n: XY) => boolean) {
  const r = ccw(poly), n = r.length
  const north = (i: number) => {
    const a = r[i], b = r[(i + 1) % n], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    return isNorth([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], [(b[1] - a[1]) / l, -(b[0] - a[0]) / l])
  }
  // runs of consecutive non-north edges, starting just after a north edge
  const start = [...Array(n).keys()].find((i) => north(i))!
  const runs: XY[][] = []
  let cur: XY[] | null = null
  for (let t = 1; t <= n; t++) {
    const i = (start + t) % n
    if (north(i)) { if (cur) { runs.push(cur); cur = null } continue }
    if (!cur) cur = [r[i]]
    cur.push(r[(i + 1) % n])
  }
  if (cur) runs.push(cur)
  const nrow = Math.max(1, Math.round((z1 - z0) / ch))
  for (const run of runs) {
    const seg: number[] = [0]
    for (let i = 1; i < run.length; i++) seg.push(seg[i - 1] + Math.hypot(run[i][0] - run[i - 1][0], run[i][1] - run[i - 1][1]))
    const L = seg[seg.length - 1], ncol = Math.max(1, Math.round(L / cw))
    const at = (u: number): { p: XY; o: XY } => {
      let i = 1
      while (i < seg.length - 1 && seg[i] < u) i++
      const t = (u - seg[i - 1]) / (seg[i] - seg[i - 1] || 1)
      const a = run[i - 1], b = run[i]
      const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1
      return { p: [a[0] + dx * t, a[1] + dy * t], o: [dy / l, -dx / l] }
    }
    for (let j = 0; j < ncol; j++) {
      const A = at((L * j) / ncol), B = at((L * (j + 1)) / ncol), M = at((L * (j + 0.5)) / ncol)
      for (let k = 0; k < nrow; k++) {
        const za = z0 + ((z1 - z0) * k) / nrow, zb = z0 + ((z1 - z0) * (k + 1)) / nrow
        const a: V3 = [A.p[0], A.p[1], za], b: V3 = [B.p[0], B.p[1], za], c: V3 = [B.p[0], B.p[1], zb], d: V3 = [A.p[0], A.p[1], zb]
        const ap: V3 = [M.p[0] + M.o[0] * dp, M.p[1] + M.o[1] * dp, (za + zb) / 2]
        glass.tri(a, b, ap)
        glass.tri(b, c, ap)
        glass.tri(c, d, ap)
        glass.tri(d, a, ap)
      }
    }
  }
}

type Set = { tube: Part; spine: Part; silver: Part; roof: Part }
const mk = (): Set => ({ tube: new Part(), spine: new Part(), silver: new Part(), roof: new Part() })

function build(s: Set, d: boolean) {
  const isNorth = (m: XY, nn: XY) => nn[1] > 0.95 && m[1] > 22
  // the north spine is a plain wall; the bays are clad in diamond facets
  const pick = (m: XY, nn: XY) => (isNorth(m, nn) ? s.spine : null)
  const CW = d ? 3.6 : 8.5, CH = d ? 4.4 : 14, DP = d ? 0.8 : 1.5
  // the three tiers (each tier's walls above the one below; the facet rows share one grid)
  extrude(OUTLINE, 0, T1, pick)
  facets(OUTLINE, 0, T1 - 2.2, CW, CH, DP, s.tube, isNorth)
  flat(s.roof, ccw(OUTLINE), T1)
  extrude(TIER2, T1 - 0.5, T2, pick)
  facets(TIER2, T1, T2 - 2.2, CW, CH, DP, s.tube, isNorth)
  flat(s.roof, ccw(TIER2), T2)
  extrude(TIER3, T2 - 0.5, T3, pick)
  facets(TIER3, T2, T3 - 2.2, CW, CH, DP, s.tube, isNorth)
  flat(s.roof, ccw(TIER3), T3)
  // the wall behind the facets (seen only through the joints at the tier tops)
  extrude(OUTLINE, T1 - 2.2, T1, (m, nn) => (isNorth(m, nn) ? null : s.silver))
  extrude(TIER2, T2 - 2.2, T2, (m, nn) => (isNorth(m, nn) ? null : s.silver))
  extrude(TIER3, T3 - 2.2, T3, (m, nn) => (isNorth(m, nn) ? null : s.silver))

  // a rounded parapet lip on each tier's top edge (silver)
  for (const [poly, z] of [[OUTLINE, T1], [TIER2, T2], [TIER3, T3]] as [XY[], number][]) {
    const r = ccw(poly)
    const cx = r.reduce((a, p) => a + p[0], 0) / r.length, cy = r.reduce((a, p) => a + p[1], 0) / r.length
    const outP = (p: XY, o: number, zz: number): V3 => {
      const dx = p[0] - cx, dy = p[1] - cy, l = Math.hypot(dx, dy) || 1
      return [p[0] + (dx / l) * o, p[1] + (dy / l) * o, zz]
    }
    grid([r.map((p) => outP(p, 0, z - 2.2)), r.map((p) => outP(p, 0.35, z - 1.6)), r.map((p) => outP(p, 0.35, z - 0.2)), r.map((p) => outP(p, -0.4, z + 0.6))], true, () => s.silver, () => true)
  }

  // the north spine's crest: the central bays' north 9 m rise on to a low gable peaking at 393 m
  const cx0 = -12.9, cx1 = 12.8, cy0 = 14.4, cy1 = 23.4
  const zc = (x: number) => CREST0 + (TOP - CREST0) * (1 - Math.abs(x) / 12.85)
  const wall = (a: XY, b: XY, top: (x: number) => number, nn: V3, p: Part) => {
    const steps = 6
    for (let i = 0; i < steps; i++) {
      const t0 = i / steps, t1 = (i + 1) / steps
      const A: XY = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0], B: XY = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]
      face(p, [[A[0], A[1], T3], [B[0], B[1], T3], [B[0], B[1], top(B[0])], [A[0], A[1], top(A[0])]], nn)
    }
  }
  wall([cx1, cy1], [cx0, cy1], zc, [0, 1, 0], s.spine)
  wall([cx0, cy0], [cx1, cy0], zc, [0, -1, 0], s.silver)
  face(s.silver, [[cx0, cy0, T3], [cx0, cy1, T3], [cx0, cy1, zc(cx0)], [cx0, cy0, zc(cx0)]], [-1, 0, 0])
  face(s.silver, [[cx1, cy1, T3], [cx1, cy0, T3], [cx1, cy0, zc(cx1)], [cx1, cy1, zc(cx1)]], [1, 0, 0])
  // the sloping top of the crest, in two planes meeting at the peak
  const slope = Math.atan2(TOP - CREST0, 12.85)
  face(s.roof, [[cx0, cy0, zc(cx0)], [0, cy0, TOP], [0, cy1, TOP], [cx0, cy1, zc(cx0)]], [-Math.sin(slope), 0, Math.cos(slope)])
  face(s.roof, [[0, cy0, TOP], [cx1, cy0, zc(cx1)], [cx1, cy1, zc(cx1)], [0, cy1, TOP]], [Math.sin(slope), 0, Math.cos(slope)])

  // ---- silver joints between the south bays (where the scallops meet), up each bay's height
  const joints: { x: number; y: number; top: number }[] = [
    { x: -24.2, y: -19.5, top: T1 }, { x: -12.1, y: -19.4, top: T2 }, { x: 0, y: -20.0, top: T3 }, { x: 12.1, y: -19.5, top: T2 }, { x: 24.2, y: -19.6, top: T1 },
  ]
  for (const j of joints) {
    const zs = [0, j.top - 1.6]
    rib(s.silver, zs.map((z) => [j.x, j.y, z] as V3), zs.map(() => [0, -1, 0] as V3), d ? 0.8 : 1.2, d ? 1.6 : 2.0, 0.6, true)
  }
  // ---- silver pilasters on the north spine (bold, grouped), full height of each tier
  const NP = d ? 13 : 7
  for (let i = 0; i < NP; i++) {
    const x = -24 + (48 * (i + 0.5)) / NP
    const top = Math.abs(x) < 12.8 ? zc(x) - 0.4 : x < 0 ? (x < -24.2 ? T1 : T2) : x > 24.2 ? T1 : T2
    const h = Math.abs(x) > 25 ? T1 : top
    const zs = [0, h - 0.6]
    rib(s.silver, zs.map((z) => [x, 23.4, z] as V3), zs.map(() => [0, 1, 0] as V3), d ? 1.0 : 1.4, d ? 0.7 : 0.9, 0.1, true)
  }
}

// ---- Materials and output ----------------------------------------------------------------------------------

const TUBE: MaterialSpec = { ...PALETTE.window, color: 0x5d7aa6 }
const SPINE: MaterialSpec = windowVariant(2, 0xa3b4c4)
const SILVER: MaterialSpec = finish('cmb-silver', 0xc9cfd8, 0.45)
const ROOF: MaterialSpec = PALETTE.roof
const layers = (s: Set): Layer[] => [
  { part: s.tube, material: TUBE },
  { part: s.spine, material: SPINE },
  { part: s.silver, material: SILVER },
  { part: s.roof, material: ROOF },
]

if (import.meta.main) {
  const low = mk(), det = mk()
  build(low, false)
  build(det, true)
  await saveLods('shenzhen-china-merchants-bank-hq', 'China Merchants Bank Global Headquarters', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM outline centroid, on the ground',
    bearing: 0, height: TOP,
  }, 5000)
}
