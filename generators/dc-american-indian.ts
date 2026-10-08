/**
 * National Museum of the American Indian (Smithsonian) — procedural,
 * CC0-1.0, no textures.
 * bun generators/dc-american-indian.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the area centroid of
 * the OSM outline (way/66418605). The plan is drawn from OSM's own
 * coordinates, so the model is placed at bearing 0.
 *
 * Modelled: the curvilinear mass in golden Kasota limestone, built up as
 * broad horizontal strata, each leaning out a little and stepping back at
 * its foot, and each waving in and out along the wall, so the walls read as
 * wind-carved rock; the dark window ribbon under the top and the deep
 * overhanging cornice above it; the east entrance block, its curving stone
 * ledges stacked with glass ribbons between them, under the great
 * cantilevered lid; the recessed glass ground storey at the east entrance;
 * the stepped dome of the Potomac atrium with its glazed oculus; and the two
 * low rooftop blocks.
 *
 * Evidence:
 * - OSM: way/66418605 (outline, height 42 incl. the dome); building parts
 *   way/427843981 (the main mass, to 36 m), 427843980 (the east block,
 *   6–34 m), 427843967 (its north-east lobe, 6–32 m), 427843969 (the
 *   cantilevered lid, tagged 24–30 m; drawn 28.5–34 m, since the photos
 *   show it as the topmost element at the east end, flush with the block), 427843974 (the dome, r 15.6, 36–42 m),
 *   427843966 and 427843978 (rooftop blocks, 36–39 m). Below 6 m at the east
 *   no part is mapped: that is the open, glazed entrance under the ledges.
 * - Published: Wikipedia "National Museum of the American Indian" (Douglas
 *   Cardinal / GBQC with Johnpaul Jones, opened 2004; five storeys; clad in
 *   Kasota limestone from Minnesota, meant to evoke stratified rock carved
 *   by wind and water; east entrance facing the rising sun; the Potomac
 *   atrium under a 120 ft dome with an oculus).
 * - Photos (Wikimedia Commons): "Smithsonian National Museum of the American
 *   Indian, on the National Mall, Washington, D.C LCCN2011633096 / 097 / 098 /
 *   100 / 101 / 102.tif" and "National Museum of the American Indian,
 *   Washington, D.C LCCN2011630892.jpg" (Carol M. Highsmith, public domain:
 *   the east entrance and its lid, the north and south walls, the window
 *   ribbon under the cornice); "National Museum of the American Indian,
 *   April 2019.jpg" (Thomson200, CC0, south-east, the walls' lean);
 *   "National Museum of the American Indian 3.jpg" (Kurt Kaiser, CC0,
 *   south-west); "National Museum of the American Indian, Washington,
 *   DC.jpg" (O Palsson, CC BY 2.0, the lid's edge).
 * - USGS NAIP orthophoto (public domain): the roof, the stepped rings of the
 *   dome and the oculus, the wavy cornice.
 *
 * Heights are OSM's. Measured from the photos (to a metre): the window
 * ribbon at 30–32 m, the cornice's overhang (about 1.5 m), the east block's
 * three ledges and glass ribbons. Estimated: the strata's lean and wave
 * (drawn larger than the real stone courses, which are too fine to see at
 * map scale, so that they read as the bands they make from a distance), the
 * dome's step count. Not modelled: the "eyelid" window recesses on the
 * north, south and west walls (shallow and small at map scale), the
 * landscape, the water features and boulders, the lettering.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, annulus, cap, ccw, lathe, orient, save, slab } from './dc-nmaahc'

const kasota = new Part(), roof = new Part(), win = new Part(), glass = new Part()

// ---------------------------------------------------------------------------
// Plan, from the OSM parts (simplified to 0.4–0.6 m), then smoothed.

const MAIN: XY[] = [[28.5, -16.7], [31.4, -15.1], [37.8, -8.6], [39.6, -2.9], [38.8, 5.1], [33.6, 12.8], [27.3, 16.3], [18.1, 17.3], [16.8, 20.6], [11.4, 25.7], [4.3, 26.8], [-3.5, 24.2], [-11.1, 26.5], [-22.0, 24.6], [-28.2, 24.7], [-35.9, 26.8], [-41.7, 25.3], [-44.2, 23.3], [-46.9, 18.4], [-47.8, 4.9], [-46.9, -14.3], [-47.9, -19.7], [-46.9, -28.0], [-48.0, -37.1], [-47.9, -39.2], [-45.8, -41.6], [-42.7, -41.6], [-31.5, -37.0], [-23.8, -35.3], [-17.1, -31.5], [-8.8, -30.1], [-0.7, -25.9], [9.0, -23.2], [15.0, -18.4]]
const EAST: XY[] = [[29.5, 15.1], [33.6, 14.4], [38.2, 17.1], [39.5, 17.0], [40.5, 15.9], [39.5, 12.0], [42.0, 6.3], [43.3, 1.3], [45.5, -0.1], [51.4, -0.1], [53.7, -1.5], [53.8, -4.9], [51.0, -8.3], [46.3, -9.8], [40.2, -9.7], [36.1, -10.7], [37.8, -8.6], [38.9, -5.9], [39.6, -2.9], [39.5, 2.5], [37.6, 7.7], [35.8, 10.4], [33.6, 12.8]]
const NE: XY[] = [[25.5, 27.2], [33.3, 24.7], [35.6, 22.5], [36.9, 19.4], [37.1, 16.5], [33.6, 14.4], [29.5, 15.1], [24.1, 17.2], [18.1, 17.3], [16.8, 20.6], [11.4, 25.7], [20.2, 27.3]]
const LID: XY[] = [[50.8, 24.0], [57.7, 19.4], [61.0, 15.2], [64.1, 10.0], [66.7, 2.0], [66.5, -1.6], [65.7, -2.7], [59.7, -5.1], [51.7, -7.3], [53.8, -4.9], [53.7, -1.5], [51.4, -0.1], [45.5, -0.1], [43.3, 1.3], [42.0, 6.3], [39.5, 12.0], [40.5, 15.9], [39.5, 17.0], [37.1, 16.5], [36.9, 19.4], [35.6, 22.5], [33.3, 24.7], [25.5, 27.2], [43.8, 26.1], [47.6, 25.6]]
const PENT_A: XY[] = [[-7.3, -13.3], [-8.6, -7.2], [-8.5, -4.4], [-7.3, -2.4], [-5.3, -1.2], [-2.9, -1.1], [-1.2, -2.1], [1.4, -10.0], [6.5, -17.2], [6.6, -19.2], [5.1, -21.1], [3.4, -21.9], [1.2, -21.4], [-4.1, -14.8], [-6.4, -14.3]]
const PENT_B: XY[] = [[-42.6, -32.9], [-42.4, -29.8], [-43.8, -20.7], [-43.4, -19.2], [-42.2, -18.5], [-41.0, -18.7], [-39.6, -21.8], [-38.7, -22.5], [-32.5, -24.3], [-31.5, -25.9], [-31.2, -28.1], [-29.9, -29.4], [-26.8, -29.9], [-23.7, -28.7], [-22.6, -30.4], [-23.3, -31.5], [-24.8, -32.2], [-36.6, -35.1], [-40.8, -37.2], [-43.2, -36.8]]
const DOME_C: XY = [21.7, -0.2], DOME_R = 15.6

/** Chaikin corner-cutting: rounds a ring's corners, as the real walls are. */
function smooth(r: XY[], passes = 1): XY[] {
  let p = r
  for (let k = 0; k < passes; k++) {
    const q: XY[] = []
    for (let i = 0; i < p.length; i++) {
      const a = p[i], b = p[(i + 1) % p.length]
      q.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]])
    }
    p = q
  }
  return p
}

/**
 * Offset a CCW ring outward by a distance that varies along it: `d(s)`,
 * with s the arc length from the first vertex. Mitred, with the mitre
 * clamped so tight concave turns don't spike.
 */
function offsetBy(ring: XY[], d: (s: number) => number): XY[] {
  const n = ring.length
  let s = 0
  const arc = ring.map((p, i) => { const v = s; const q = ring[(i + 1) % n]; s += Math.hypot(q[0] - p[0], q[1] - p[1]); return v })
  return ring.map((p, i) => {
    const a = ring[(i + n - 1) % n], b = ring[(i + 1) % n]
    const e1 = unit([p[0] - a[0], p[1] - a[1]]), e2 = unit([b[0] - p[0], b[1] - p[1]])
    const m = unit([e1[1] + e2[1], -e1[0] - e2[0]])
    const k = Math.max(0.6, m[0] * e1[1] - m[1] * e1[0])
    const dist = d(arc[i]) / k
    return [p[0] + m[0] * dist, p[1] + m[1] * dist] as XY
  })
}
const unit = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
const lift = (r: XY[], z: number) => r.map(([x, y]) => [x, y, z] as V3)

/**
 * Loft CCW rings into a smooth-shaded wall: each vertex takes the averaged
 * horizontal normal of its two edges, so the curved walls shade as curves
 * (and their corners weld, which keeps the file small). Sharp turns over
 * 50° keep a crease.
 */
function smoothLoft(p: Part, rings: V3[][]) {
  const n = rings[0].length
  for (let k = 0; k < rings.length - 1; k++) {
    const A = rings[k], B = rings[k + 1]
    const en = (i: number): V3 => { const a = A[i], b = A[(i + 1) % n]; const u = unit([b[0] - a[0], b[1] - a[1]]); return [u[1], -u[0], 0] }
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, h = (i + n - 1) % n, l = (j + 1) % n
      const e = en(i)
      const blend = (o: V3): V3 => (o[0] * e[0] + o[1] * e[1] > 0.64 ? norm3([o[0] + e[0], o[1] + e[1], 0]) : e)
      const ni = blend(en(h)), nj = blend(en(j))
      void l
      p.tri(A[i], A[j], B[j], undefined, undefined, undefined, [ni, nj, nj])
      p.tri(A[i], B[j], B[i], undefined, undefined, undefined, [ni, nj, ni])
    }
  }
}
const norm3 = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

/**
 * A stratified wall: bands of stone, each leaning out by `lean` over its
 * height and waving in and out along the wall, with a step back at each
 * band's foot. `bands` are [z0, z1, base offset, wave amplitude, phase].
 */
function strata(ring: XY[], bands: [number, number, number, number, number][], lean: number, wave = 28) {
  // a whole number of waves round the ring, so the bands close smoothly
  const per = ring.reduce((s, p, i) => { const q = ring[(i + 1) % ring.length]; return s + Math.hypot(q[0] - p[0], q[1] - p[1]) }, 0)
  wave = per / Math.max(1, Math.round(per / wave))
  const arc: number[] = []
  ring.reduce((acc, p, i) => { arc.push(acc); const q = ring[(i + 1) % ring.length]; return acc + Math.hypot(q[0] - p[0], q[1] - p[1]) }, 0)
  let prevTop: XY[] | null = null, prevF: ((s: number) => number) | null = null, prevZ = 0
  for (const [z0, z1, o, amp, ph] of bands) {
    const f = (extra: number) => (s: number) => o + extra + amp * Math.sin((2 * Math.PI * s) / wave + ph)
    const lo = offsetBy(ring, f(0)), hi = offsetBy(ring, f(lean))
    // the ledge (or soffit) between this band's foot and the band below's
    // top: up-facing where the band below stands out further, else down
    if (prevTop && prevF && Math.abs(prevZ - z0) < 1e-6) {
      for (let i = 0; i < ring.length; i++) {
        const j = (i + 1) % ring.length
        const up = prevF(arc[i]) + prevF(arc[j]) > f(0)(arc[i]) + f(0)(arc[j])
        orient(kasota, [[...prevTop[i], z0], [...prevTop[j], z0], [...lo[j], z0], [...lo[i], z0]] as V3[], [0, 0, up ? 1 : -1])
      }
    }
    smoothLoft(kasota, [lift(lo, z0), lift(hi, z1)])
    prevTop = hi
    prevF = f(lean)
    prevZ = z1
  }
  return prevTop!
}

// ---------------------------------------------------------------------------
// The main mass: five strata to the window ribbon, the ribbon, the cornice.

const M = ccw(smooth(MAIN, 1))
const RIBBON0 = 30.0, RIBBON1 = 32.0, TOP = 36.0
{
  const top = strata(M, [
    [0, 7.5, -2.0, 0.3, 0.0],
    [7.5, 15.0, -1.3, 0.6, 1.3],
    [15.0, 22.5, -0.6, 0.7, 2.6],
    [22.5, RIBBON0, 0.1, 0.6, 3.9],
  ], 1.1)
  // the window ribbon, set back under the cornice
  const rib = offsetBy(M, () => -0.6)
  annulus(kasota, top, rib, RIBBON0, true)
  smoothLoft(win, [lift(rib, RIBBON0), lift(rib, RIBBON1)])
  // the cornice: a deep overhang, its soffit, a rounded lip, and the roof
  const lip = offsetBy(M, (s) => 1.4 + 0.5 * Math.sin((2 * Math.PI * s) / 40))
  annulus(kasota, lip, rib, RIBBON1, false)
  const lip2 = offsetBy(M, (s) => 1.0 + 0.5 * Math.sin((2 * Math.PI * s) / 40))
  smoothLoft(kasota, [lift(lip, RIBBON1), lift(lip, TOP - 0.6), lift(lip2, TOP)])
  cap(roof, lip2, TOP)
}

// Rooftop blocks.
slab(kasota, PENT_A, TOP, 39.0, 0.4, roof)
slab(kasota, PENT_B, TOP, 39.0, 0.4, roof)

// The Potomac atrium dome: stepped rings rising to the glazed oculus.
{
  const steps = 7, z0 = TOP, z1 = 42.0, rTop = 3.0
  const prof: [number, number][] = [[DOME_R, z0]]
  for (let k = 0; k < steps; k++) {
    const r = DOME_R - ((DOME_R - rTop) * (k + 1)) / steps
    const zA = z0 + ((z1 - z0) * (k + 1)) / steps
    const rPrev = prof[prof.length - 1][0]
    prof.push([rPrev - 0.35, zA], [r, zA]) // a riser, then the tread inward
  }
  lathe(kasota, DOME_C[0], DOME_C[1], prof, 24, false)
  lathe(glass, DOME_C[0], DOME_C[1], [[rTop, z1], [0, z1 + 0.6]], 16, false)
}

// ---------------------------------------------------------------------------
// The east entrance: the east block and its north-east lobe, stone ledges
// with glass ribbons between, over a glazed ground storey; the lid above.

const LID0 = 28.5, LID1 = 34.0
for (const ring of [EAST, NE]) {
  const R = ccw(smooth(ring, 1))
  const core = offsetBy(R, () => -1.0)
  // glass behind the ledges, from the entrance up to the lip under the lid
  smoothLoft(win, [lift(core, 0), lift(core, 22.5)])
  // two broad curving ledges, a lip under the lid, and the wall behind the lid
  const ledges: [number, number, number, number][] = [ // z0, z1, offset, wave phase
    [3.5, 9.0, 1.6, 0.0],
    [13.0, 18.0, 2.2, 1.9],
    [22.5, 25.0, 0.6, 3.4],
  ]
  for (const [z0, z1, o, ph] of ledges) {
    const L = offsetBy(R, (s) => o + 1.0 * Math.sin((2 * Math.PI * s) / 30 + ph))
    const L2 = offsetBy(R, (s) => o - 0.4 + 1.0 * Math.sin((2 * Math.PI * s) / 30 + ph))
    smoothLoft(kasota, [lift(L2, z0), lift(L, z0 + 0.8), lift(L, z1 - 0.8), lift(L2, z1)])
    annulus(kasota, L2, core, z0, false)
    annulus(kasota, L2, core, z1, true)
  }
  smoothLoft(kasota, [lift(core, 25.0), lift(core, LID0)])
}

// The lid: a thick stone cantilever over the whole east end, the topmost
// thing on that side, its soffit pale.
{
  const L = ccw(smooth(LID, 1))
  slab(kasota, L, LID0, LID1, 0, roof, true)
  for (const ring of [EAST, NE]) slab(kasota, ccw(smooth(ring, 1)), LID0, LID1, 0, roof, true)
}

const KASOTA = finish('nmai-kasota', 0xe8d4aa)
await save('dc-american-indian', 'National Museum of the American Indian', [
  { part: kasota, material: KASOTA },
  { part: roof, material: finish('nmai-roof', 0xcfc6b4) },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
], { source: 'generators/dc-american-indian.ts' }, 6500)


