/**
 * Shanghai Tower, Lujiazui, Shanghai — original procedural geometry, CC0-1.0.
 * bun generators/shanghai-tower.ts   (writes the low model and the detail LOD)
 *
 * Also exports the small surface kit (`gridSurface`, `ringBand`, `toXY`) that
 * shanghai-world-financial-center.ts and shanghai-jin-mao-tower.ts import.
 *
 * Frame: bearing 0 (model +y = north). Origin = area centroid of the OSM
 * outline way/165792123 (121.501271 E, 31.235555 N), on the ground. The tower
 * axis stands at (2.0, -9.5) in this frame: the common centre of the OSM
 * zone parts (way/1573412411...1573438273). y = 0 is the plaza; elevation 0.
 *
 * Form, as read from OSM and the photos:
 * - one smooth outer curtain wall: a rounded equilateral triangle in plan
 *   (radius +/-6% round the plan), tapering linearly from 44.5 m mean radius
 *   at the plaza to 24.9 m at 585 m, and turning clockwise (seen from above)
 *   as it rises, about 160 degrees from the foot to the crown;
 * - the vertical notch: a V groove at one corner of the triangle, running
 *   the full height and so spiralling round the tower; 6 m deep at the foot
 *   (scaled with the plan), its leading lip standing 1.5 m proud, in the
 *   darker glass the photos show in it;
 * - the zone joints: the skin is hung in zones, and each joint shows as a
 *   faint line; drawn as a thin band (1.2 m) a shade darker than the glass,
 *   standing 0.3 m proud (8 rings), so the notch stays the strongest line;
 * - the deck band (dark glass, 572-585 m) and the crown: the skin carried up
 *   as a frame with three rows of deep dark slots (posts across them), open
 *   at the top round the core roof (588 m), its top a slanted cut rising
 *   clockwise from 612 m just past the notch to 632 m just before it, its
 *   outer edge rounded over, as the OSM roof parts step up (590/603/617/630 m)
 *   and as the north-west photo shows;
 * - the base: the lobby plinth over the rest of the outline, and the gold
 *   J-Life podium (OSM malls way/967281057 and way/967281058), which wraps
 *   the tower foot on the west and north-east.
 *
 * Evidence
 * - OSM, fetched 2026-11-27 with tools/osm.py: outline way/165792123
 *   (height 632, 128 levels, Q18547) and its parts way/376023554 (0-90 m),
 *   relation/21824254 (90-180 m), relation/21824349 (587-590 m); the zone
 *   parts way/1573412415 (180-270 m), 1573412414 (270-360), 1573438273
 *   (360-405), 1573412413 (405-450), 1573437671 (450-495), 1573412412
 *   (495-540), 1573432465 (540-565), 1573412411 (565-587.4); the crown roof
 *   parts way/1573425008, 1573425009, 1573423824-1573423826 (590-630 m);
 *   the podium malls way/967281057, way/967281058.
 * - Published: 632 m, 128 floors, Gensler, completed 2015; the facade turns
 *   about 120 degrees and the plan shrinks as it rises (Wikipedia "Shanghai
 *   Tower"; CTBUH Skyscraper Center).
 * - Photos (Wikimedia Commons, daylight unless noted):
 *   "Pudong Shanghai November 2017 panorama.jpg", King of Hearts, CC BY-SA 4.0,
 *   from the Bund (camera ~1060 m at bearing 289): silhouette, taper, ring
 *   joints, crown frame and deck band, relative heights of the three towers;
 *   https://commons.wikimedia.org/wiki/File:Pudong_Shanghai_November_2017_panorama.jpg
 *   "Shanghai Tower, Shanghai World Financial Center and Jin Mao Tower 20251126.jpg",
 *   Supanut Arunopra, CC BY 4.0, from the north-west (~319): notch spiral,
 *   sloping crown top, gold podium, colour;
 *   https://commons.wikimedia.org/wiki/File:Shanghai_Tower,_Shanghai_World_Financial_Center_and_Jin_Mao_Tower_20251126.jpg
 *   "20191114 Shanghai Tower-1.jpg", Balon Greyjoy, CC0, from the NNW (~330):
 *   notch, rings, crown; https://commons.wikimedia.org/wiki/File:20191114_Shanghai_Tower-1.jpg
 *   "Shanghai - Shanghai Tower - 0001.jpg", Stefan Fussan (DerFussi),
 *   CC BY-SA 3.0, from the WSW (~248): taper and colour;
 *   https://commons.wikimedia.org/wiki/File:Shanghai_-_Shanghai_Tower_-_0001.jpg
 *   "Shanghai Tower, August 2023.jpg", Francisco Javier PB, CC BY-SA 4.0,
 *   from the ESE at the foot: the podium's gold cladding and arch;
 *   https://commons.wikimedia.org/wiki/File:Shanghai_Tower,_August_2023.jpg
 * - No lidar, NAIP or Mapillary over Shanghai (batch notes).
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 632 m top.
 * - Measured (OSM): the mean radius by zone (half the part extents), fitted
 *   as 44.5 - 0.0335 z m; the crown roof steps; the podium outlines. The
 *   notch corners in the OSM parts give its turn rate (271 deg at 315 m ...
 *   325 at 552, ~0.23 deg/m).
 * - Measured (photo): the notch's bearing, which the Bund panorama (at ~340,
 *   ~475 and ~600 m) and the 2025 north-west photo (foot and top) put about
 *   30-50 deg further clockwise than OSM's corners, the NW photo putting it
 *   at the left limb (~35-50 deg) at the top: drawn as 235 + 0.27 z deg.
 * - Measured (photo, panorama scaled to 632 m): width 49.5 m at the top and
 *   69 m at ~300 m (agrees with OSM); the crown frame 569-632 m, the deck
 *   band ~572-585 m, three to four rows of slots in the frame above it; ring
 *   joints at ~327, 394, 473 and 551 m.
 * - Estimated: the lower ring joints (continued at ~66 m spacing: 63, 129,
 *   195, 261 m); the plan's roundness (+/-6%) and the notch size (6 m deep,
 *   +/-9 deg wide at the foot); the crown top's rise (612 -> 632 m, from the
 *   NW photo's slope; OSM has 590 -> 630); the
 *   slot rows and their posts (sparser and bolder than the real lattice);
 *   the podium height (24 m, against the tower in the 2025 photo) and the
 *   lobby plinth (8 m); colours sampled from the 2025, 0001 and panorama
 *   photos (#8c999f-#8ea4b5 glass, pulled light to #a8b8c4).
 * - Invented: none of the massing.
 *
 * Doubts
 * - OSM's zone parts are crude (their radii from the axis run 20-44 m), so
 *   only their extents were used; the plan is drawn
 *   as a regular rounded triangle, and the notch's bearing follows the photos.
 * - The drawn turn (~160 deg to the crown) is more than the published ~120
 *   deg: it follows where the photos put the notch at the foot and the top.
 * - The real notch is a step where the skin overlaps, shallower than drawn;
 *   it is drawn deeper and darker so it reads at phone size.
 * - The podium's real height and roof are not measured; it is drawn as a
 *   plain gold block with a chamfered top edge.
 * - The east and south sides are only seen in distant or foot-level photos.
 *
 * Night: the curtain wall glows as windows (`window`), the notch and deck
 * band too (`window-2`), and the joints (`window-3`); the crown frame is floodlit (it is lit at night).
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { face, prism, saveLods, type Layer, type XY } from './auckland-sky-tower'

// ---- Shared surface kit (also used by the SWFC and Jin Mao generators) -------------------------

const nrm3 = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}

/**
 * A smooth surface over a grid of points, `g[k][i]`: rows k bottom to top,
 * columns i counter-clockwise from above (so the surface faces outward).
 * `closed` joins the last column to the first. Columns flagged by `crease`
 * keep a sharp edge; `flat` marks quads (by column) to flat-shade.
 * `pick` chooses the part per quad column and row.
 */
export function gridSurface(g: V3[][], closed: boolean, pick: (i: number, k: number) => Part, crease: (i: number) => boolean = () => false, flat: (i: number) => boolean = () => false) {
  const K = g.length, N = g[0].length, C = closed ? N : N - 1
  const qn: V3[][] = []
  for (let k = 0; k < K - 1; k++) {
    qn.push([])
    for (let i = 0; i < C; i++) {
      const j = (i + 1) % N
      const a = g[k][i], b = g[k][j], c = g[k + 1][j], d = g[k + 1][i]
      const e1: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]], e2: V3 = [d[0] - b[0], d[1] - b[1], d[2] - b[2]]
      qn[k].push(nrm3([e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]))
    }
  }
  // a quad column's neighbours that share smoothing at vertex column `vi`
  const cols = (qi: number, vi: number): number[] => {
    if (crease(vi)) return [qi]
    const other = vi === qi ? (vi - 1 + C) % C : vi
    if (!closed && (vi === 0 || vi === N - 1)) return [qi]
    return [qi, other]
  }
  const vn = (qi: number, k: number, vi: number): V3 => {
    const s: V3 = [0, 0, 0]
    for (const c of cols(qi, vi)) for (const kk of [k - 1, k]) if (kk >= 0 && kk < K - 1) {
      const n = qn[kk][c]
      s[0] += n[0]; s[1] += n[1]; s[2] += n[2]
    }
    return nrm3(s)
  }
  for (let k = 0; k < K - 1; k++) for (let i = 0; i < C; i++) {
    const j = (i + 1) % N, p = pick(i, k)
    const a = g[k][i], b = g[k][j], c = g[k + 1][j], d = g[k + 1][i]
    if (flat(i)) {
      const n = qn[k][i]
      p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
      p.tri(a, c, d, undefined, undefined, undefined, [n, n, n])
      continue
    }
    const na = vn(i, k, i), nb = vn(i, k, j), nc = vn(i, k + 1, j), nd = vn(i, k + 1, i)
    p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
    p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
  }
}

/** Map-frame point from a compass bearing (deg) and radius about centre c. */
export const toXY = (c: XY, bearing: number, r: number, z: number): V3 => {
  const b = (bearing * Math.PI) / 180
  return [c[0] + r * Math.sin(b), c[1] + r * Math.cos(b), z]
}

/**
 * A proud ring round a closed counter-clockwise plan ring `ring` (at z0),
 * `out` metres outward, from z0 to z1: outer face, top and soffit. Outward
 * is measured from the ring's centroid.
 */
export function ringBand(p: Part, ring: V3[], z0: number, z1: number, out: number, inset = 0) {
  const n = ring.length
  const cx = ring.reduce((s, v) => s + v[0], 0) / n, cy = ring.reduce((s, v) => s + v[1], 0) / n
  const off = (v: V3, d: number, z: number): V3 => {
    const dx = v[0] - cx, dy = v[1] - cy, l = Math.hypot(dx, dy) || 1
    return [v[0] + (dx / l) * d, v[1] + (dy / l) * d, z]
  }
  const rows = [ring.map((v) => off(v, -inset, z0)), ring.map((v) => off(v, out, z0)), ring.map((v) => off(v, out, z1)), ring.map((v) => off(v, -inset, z1))]
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const q = (r0: V3[], r1: V3[]) => {
      const a = r0[i], b = r0[j], c = r1[j], d = r1[i]
      const e1: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2: V3 = [d[0] - a[0], d[1] - a[1], d[2] - a[2]]
      const nn = nrm3([e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]])
      face(p, [a, b, c, d], nn)
    }
    q(rows[0], rows[1]) // soffit
    q(rows[1], rows[2]) // outer face
    q(rows[2], rows[3]) // top
  }
}

// ---- Shanghai Tower ------------------------------------------------------------------------------

const C: XY = [2.0, -9.5]
const TOP = 632
const notchBearing = (z: number) => 235 + 0.27 * z
const meanR = (z: number) => 44.5 - 0.0335 * Math.min(z, 586)
const NOTCH_HALF = 9 // degrees
const ROUND = 0.06
const ZONES = [63, 129, 195, 261, 327, 394, 473, 551]
const DECK0 = 572, DECK1 = 585, FRAME0 = DECK1, CORE_ROOF = 588
const SLOTS: [number, number][] = [[590, 593.5], [597, 600.5], [604, 607.5]]
const topAt = (t: number) => 612 + 20 * (t / (360 - NOTCH_HALF)) // crown top, t = degrees clockwise from the notch

type Set = { skin: Part; dark: Part; joint: Part; silver: Part; gold: Part; roof: Part }
const mk = (): Set => ({ skin: new Part(), dark: new Part(), joint: new Part(), silver: new Part(), gold: new Part(), roof: new Part() })

/** Plan angles (deg clockwise from the notch), the notch V at 0 and its lips at +/-NOTCH_HALF. */
function angles(n: number): number[] {
  const out = [0, NOTCH_HALF]
  const step = (360 - 2 * NOTCH_HALF) / n
  for (let i = 1; i < n; i++) out.push(NOTCH_HALF + i * step)
  out.push(360 - NOTCH_HALF)
  return out
}

/** Radius at angle t (deg from the notch) and height z; `inset` pulls it in. */
function radius(t: number, z: number, inset = 0) {
  const R = meanR(z)
  let r = R * (1 + ROUND * Math.cos((3 * t * Math.PI) / 180))
  if (t === 0) r -= 6 * (R / 44.5)
  if (t === NOTCH_HALF) r += 1.5 * (R / 44.5) // the overlapping lip of the notch
  return r - inset
}

/** The plan ring at z, counter-clockwise from above (so reversed bearings). */
function ring(ts: number[], z: number | ((t: number) => number), inset = 0): V3[] {
  const pts = ts.map((t) => {
    const zz = typeof z === 'number' ? z : z(t)
    return toXY(C, notchBearing(Math.min(zz, FRAME0)) + t, radius(t, Math.min(zz, FRAME0), inset), zz)
  })
  return pts.reverse()
}

function build(s: Set, d: boolean) {
  const ts = angles(d ? 96 : 34)
  const N = ts.length
  // reversed ring order: column index i in the ring is ts[N-1-i]
  const tOf = (i: number) => ts[N - 1 - i]
  const isNotchCol = (i: number) => {
    const t = tOf(i), tn = tOf((i + 1) % N)
    return t === 0 || tn === 0
  }
  const creaseCol = (i: number) => {
    const t = tOf(i)
    return t === 0 || t === NOTCH_HALF || t === 360 - NOTCH_HALF
  }

  // the skin up to the deck band
  const step = d ? 6 : 22
  const levels: number[] = []
  for (let z = 0; z < DECK0; z += step) levels.push(z)
  levels.push(DECK0)
  gridSurface(levels.map((z) => ring(ts, z)), true, (i) => (isNotchCol(i) ? s.dark : s.skin), creaseCol, isNotchCol)
  // the deck band, dark glass
  gridSurface([DECK0, DECK1].map((z) => ring(ts, z)), true, () => s.dark, creaseCol, isNotchCol)
  // zone joints: a dark band standing a little proud (reads as the dark joint lines)
  const JH = d ? 0.9 : 1.2
  for (const z of ZONES) ringBand(s.joint, ring(ts, z - JH), z - JH, z, 0.3, 0)
  // a pale lip under the crown
  ringBand(s.silver, ring(ts, DECK1), DECK1, DECK1 + 1.5, 0.8, 0)

  // ---- crown: the skin carried up as a frame, open at the top, with rows of deep slots ----
  const RIM_W = d ? 1.6 : 1.8
  const top = (t: number) => topAt(t)
  // outer wall: silver strips between recessed dark slot rows
  let zc = DECK1
  const strip = (z0: number | ((t: number) => number), z1: number | ((t: number) => number)) =>
    gridSurface([ring(ts, z0), ring(ts, z1)], true, () => s.silver, creaseCol, isNotchCol)
  const SLOT_D = d ? 1.0 : 1.4
  for (const [s0, s1] of SLOTS) {
    strip(zc, s0)
    // the slot: soffit, dark back, sill
    const o0 = ring(ts, s0), o1 = ring(ts, s1), b0 = ring(ts, s0, SLOT_D), b1 = ring(ts, s1, SLOT_D)
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N
      face(s.silver, [o0[i], o0[j], b0[j], b0[i]], [0, 0, 1])
      face(s.silver, [b1[i], b1[j], o1[j], o1[i]], [0, 0, -1])
    }
    gridSurface([b0, b1], true, () => s.dark, creaseCol, isNotchCol)
    // mullion posts across the slot (detail): the frame's lattice
    for (let i = 0; i < N; i += d ? 2 : 3) {
      const a = o0[i], b = b1[i]
      const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2
      const dx = a[0] - b[0], dy = a[1] - b[1], l = Math.hypot(dx, dy) || 1
      const ux = dx / l, uy = dy / l, vx = -uy, vy = ux, h = SLOT_D / 2, w = 0.35
      prism(s.silver, [[cx - ux * h - vx * w, cy - uy * h - vy * w], [cx + ux * h - vx * w, cy + uy * h - vy * w], [cx + ux * h + vx * w, cy + uy * h + vy * w], [cx - ux * h + vx * w, cy - uy * h + vy * w]], s0, s1, { top: false })
    }
    zc = s1
  }
  // up to the sloping top, its outer edge rounded over in two facets
  const tA = (t: number) => top(t) - 1.6, tB = (t: number) => top(t) - 0.45
  strip(zc, tA)
  gridSurface([ring(ts, tA), ring(ts, tB, 0.45), ring(ts, top, 1.1)], true, () => s.silver, creaseCol, isNotchCol)
  // the inner face of the wall and its top rim
  const i0 = ring(ts, DECK1, RIM_W), i1 = ring(ts, top, RIM_W), o1 = ring(ts, top, 1.1)
  gridSurface([[...i0].reverse(), [...i1].reverse()], true, () => s.silver)
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    face(s.silver, [o1[i], o1[j], i1[j], i1[i]], [0, 0, 1])
  }
  // the core roof inside the open frame
  const core = ring(ts, CORE_ROOF, RIM_W)
  const cz: V3 = [C[0], C[1], CORE_ROOF]
  for (let i = 0; i < N; i++) face(s.roof, [cz, core[i], core[(i + 1) % N]], [0, 0, 1])
  // the core's own crown inside the frame: a smaller drum and a mast (detail)
  if (d) {
    const c0 = ring(ts, CORE_ROOF, 9), c1 = ring(ts, CORE_ROOF + 9, 9)
    gridSurface([c0, c1], true, () => s.silver)
    for (let i = 0; i < N; i++) face(s.roof, [[C[0], C[1], CORE_ROOF + 9], c1[i], c1[(i + 1) % N]], [0, 0, 1])
  }

  // ---- base: lobby plinth over the outline, and the gold podium malls ----
  prism(s.gold, OUTLINE, 0, 8, { top: false })
  for (const [a, b, c] of trisOf(OUTLINE)) face(s.roof, [[a[0], a[1], 8], [b[0], b[1], 8], [c[0], c[1], 8]], [0, 0, 1])
  for (const m of [MALL_W, MALL_NE]) {
    prism(s.gold, m, 0, PODIUM_H - 1.5, { top: false })
    chamferTop(s.gold, s.roof, m, PODIUM_H - 1.5, PODIUM_H, 1.5)
  }
}

import { polyTris } from './berlin-oberbaum-bridge'
const trisOf = (poly: XY[]) => polyTris(poly)

/** A chamfered top edge: the walls lean in by `inset` from z0 to z1, then a flat roof. */
function chamferTop(wall: Part, roof: Part, poly: XY[], z0: number, z1: number, inset: number) {
  // inset by moving each vertex along the bisector (polygon is near-convex at the corners that matter)
  const n = poly.length
  const area = poly.reduce((s, a, i) => { const b = poly[(i + 1) % n]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
  const sgn = area > 0 ? 1 : -1
  const inner: XY[] = poly.map((p, i) => {
    const a = poly[(i - 1 + n) % n], b = poly[(i + 1) % n]
    const e1 = [p[0] - a[0], p[1] - a[1]], e2 = [b[0] - p[0], b[1] - p[1]]
    const l1 = Math.hypot(e1[0], e1[1]) || 1, l2 = Math.hypot(e2[0], e2[1]) || 1
    // inward normals (for CCW: left of edge)
    const n1 = [-e1[1] / l1 * sgn, e1[0] / l1 * sgn], n2 = [-e2[1] / l2 * sgn, e2[0] / l2 * sgn]
    let bx = n1[0] + n2[0], by = n1[1] + n2[1]
    const bl = Math.hypot(bx, by) || 1
    bx /= bl; by /= bl
    const cos = Math.max(0.35, bx * n1[0] + by * n1[1])
    return [p[0] + (bx * inset) / cos, p[1] + (by * inset) / cos]
  })
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a: V3 = [poly[i][0], poly[i][1], z0], b: V3 = [poly[j][0], poly[j][1], z0]
    const c: V3 = [inner[j][0], inner[j][1], z1], d: V3 = [inner[i][0], inner[i][1], z1]
    const e1: V3 = [b[0] - a[0], b[1] - a[1], 0]
    let nn: V3 = [e1[1], -e1[0], 0]
    if (sgn < 0) nn = [-nn[0], -nn[1], 0]
    const l = Math.hypot(nn[0], nn[1]) || 1
    face(wall, [a, b, c, d], [nn[0] / l, nn[1] / l, 0.9])
  }
  for (const [a, b, c] of polyTris(inner)) face(roof, [[a[0], a[1], z1], [b[0], b[1], z1], [c[0], c[1], z1]], [0, 0, 1])
}

const PODIUM_H = 24
// OSM outlines in this frame (metres east/north of the anchor)
const OUTLINE: XY[] = [[-51.7, -6.2], [-48.6, -13.6], [-44.6, -23.2], [-38.0, -25.5], [-40.5, -32.7], [-28.5, -37.1], [-11.0, -40.5], [5.0, -40.3], [12.1, -39.4], [18.9, -37.8], [31.6, -34.5], [38.4, -31.2], [45.1, -27.9], [48.9, -23.2], [50.9, -17.3], [50.0, -12.4], [49.1, -7.4], [46.8, -3.4], [43.6, 2.6], [37.0, 14.7], [28.7, 29.8], [18.9, 42.1], [12.0, 50.5], [5.7, 54.6], [-0.8, 52.7], [-3.4, 50.9], [-8.3, 47.4], [-21.4, 36.6], [-39.3, 15.8], [-44.9, 6.3]]
const MALL_W: XY[] = [[-58.7, -14.0], [-64.0, -12.0], [-66.7, -8.5], [-67.7, -4.1], [-79.0, -2.0], [-107.7, 2.5], [-105.9, 44.5], [-102.7, 49.5], [-81.5, 55.3], [-69.9, 56.1], [-47.3, 55.4], [-15.0, 52.5], [-10.2, 51.9], [-3.4, 50.9], [-8.3, 47.4], [-21.4, 36.6], [-39.3, 15.8], [-44.9, 6.3], [-51.7, -6.2]]
const MALL_NE: XY[] = [[12.0, 50.5], [18.9, 42.1], [28.7, 29.8], [37.0, 14.7], [43.7, 15.5], [48.7, 18.4], [51.5, 23.7], [50.2, 31.5], [46.7, 39.3], [40.8, 43.2], [34.2, 46.4], [19.8, 49.2]]

// ---- Materials and output ----------------------------------------------------------------------

const SKIN: MaterialSpec = { ...PALETTE.window, color: 0xa8b8c4 }
const DARK: MaterialSpec = windowVariant(2, 0x7d90a2)
const JOINT: MaterialSpec = windowVariant(3, 0x97a8b5)
const SILVER: MaterialSpec = { ...finish('st-silver', 0xc6d0d6, 0.5), floodlight: (p, n) => (p[2] > 580 ? (n[2] > 0.7 ? 0.3 : 0.9) : 0) }
const GOLD: MaterialSpec = finish('st-podium-gold', 0xcdb88c, 0.5)
const ROOF: MaterialSpec = PALETTE.roof
const layers = (s: Set): Layer[] => [
  { part: s.skin, material: SKIN },
  { part: s.dark, material: DARK },
  { part: s.joint, material: JOINT },
  { part: s.silver, material: SILVER },
  { part: s.gold, material: GOLD },
  { part: s.roof, material: ROOF },
]

if (import.meta.main) {
  const low = mk(), det = mk()
  build(low, false)
  build(det, true)
  await saveLods('shanghai-tower', 'Shanghai Tower', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM outline centroid, on the plaza',
    bearing: 0, height: TOP,
  }, 6500)
}
