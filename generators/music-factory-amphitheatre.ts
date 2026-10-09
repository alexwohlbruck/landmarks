/**
 * Skyla Credit Union Amphitheatre, AvidXchange Music Factory — procedural, CC0-1.0.
 * bun generators/music-factory-amphitheatre.ts
 *
 * The outdoor amphitheatre on the old Charlotte Cotton Mill site (opened 2009
 * as the Uptown Amphitheatre, then Charlotte Metro Credit Union
 * Amphitheatre, Skyla Credit Union Amphitheatre today; about 5,000 people).
 * Its stage stands in the angle of the mill's west arm (`fillmore-charlotte`)
 * and faces east-north-east over a fan of seats to the festival lawn. The
 * seats are on graded ground and the lawn is grass, so both are the map's;
 * what stands up is the stage under its roof.
 *
 * Identity, from the photos: a big folded-plate canopy, pale metal on top and
 * charcoal underneath, its front edge the highest, lifted towards the seats;
 * two slender dark front columns with diagonal struts; a concrete-block stage
 * deck; a tall glazed wing on the south-east side of the stage, the mill wall
 * draped black on the north-west; and the venue's blue sign band across the
 * front under the roof edge.
 *
 * Evidence:
 *  - Lidar (USGS 3DEP NC Phase 4 Mecklenburg 2016, 0.5 m DSM) gives the roof
 *    exactly. In the stage frame (s along 62°, towards the seats; t to its
 *    right, south-south-east) the top is a folded plate, constant across t:
 *    a valley line at s = -6.5, 10.45 m over the lowest ground of the lidar
 *    box (210.0 m NAVD88); the front plane rises 0.29 per metre to the front
 *    edge at 15.7 m; the back rises gently to the back corner at 11.7 m; the
 *    two side corners stand at ~13.9 m (each value the median of 2 m bins,
 *    the plate fits to ±0.3 m). The outline is a pentagon: front edge 22 m,
 *    sides to corners at s = -1.1, back corner at s = -17.
 *  - NAIP (USGS, public domain): the pale grey pentagon of the roof, the
 *    same as the lidar's. Ground from the lidar: seats in front ~1.6 m, the
 *    plaza to the south ~3.6 m, the lowest point under the roof 0.43 m (north
 *    corner, against the mill), which is this model's y = 0.
 *  - Photos (Wikimedia Commons): Southern_Asbestos_Company_Mills.jpg (James
 *    Willamor, CC BY-SA 3.0, aerial from the north-east, 2007: the folded
 *    plate roof, front columns and struts, curved deck front);
 *    Greenville,_Charlotte,_NC,_USA_-_panoramio.jpg (James Willamor, CC BY-SA
 *    3.0, 2009: charcoal underside and fascia, column and strut);
 *    CMCU_Amphitheatre_stage.jpg and KT_Tunstall_Charlotte.jpg (HangingCurve,
 *    CC BY-SA 4.0, 2018: the blue sign band, block deck ~1.6 m above the
 *    front row, glazed south-east wing, black-draped north-west side).
 *  - OSM: way/1202433678 (building=roof, no height) is the roof, traced
 *    loosely (notched); the lidar and NAIP pentagon is used instead, and
 *    replaces lists the way.
 *
 * Estimated: roof thickness (1.0 m from the photos), the deck's plan and
 * the stage walls' extent (from the 2007 aerial and the 2018 photos), the
 * column positions. Not drawn: rigging, line arrays, railings, seats.
 *
 * Map frame: x east, y north, z up, metres; origin at the catalog anchor
 * (-80.8450652, 35.2397754) on the lowest ground under the roof; bearing 0.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
type ST = [number, number]

// ---------------------------------------------------------------------------
// Frame and faces.

/** Lidar heights are over 210.0 m; the model's ground is 0.43 m above that. */
const G = 0.43
const BEAR = (62 * Math.PI) / 180
const U: XY = [Math.sin(BEAR), Math.cos(BEAR)], R: XY = [Math.cos(BEAR), -Math.sin(BEAR)]
/** Stage frame (s towards the seats, t to the right) → map x, y. */
const P = ([s, t]: ST): XY => [s * U[0] + t * R[0], s * U[1] + t * R[1]]
const V = (q: ST, z: number): V3 => { const [x, y] = P(q); return [x, y, z] }

const unit = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
/** A triangle wound to face `n`, flat-shaded with that normal. */
function tri(p: Part, a: V3, b: V3, c: V3, n: V3) {
  const e1: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const f: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (Math.hypot(...f) < 1e-9) return
  const N = unit(n)
  const nn: V3[] = [N, N, N]
  if (f[0] * N[0] + f[1] * N[1] + f[2] * N[2] >= 0) p.tri(a, b, c, undefined, undefined, undefined, nn)
  else p.tri(a, c, b, undefined, undefined, undefined, nn)
}
const quad = (p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) => { tri(p, a, b, c, n); tri(p, a, c, d, n) }
/** The face normal of a triangle, turned to point up (or down). */
function facing(a: V3, b: V3, c: V3, up: boolean): V3 {
  const e1: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  let f: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if ((f[2] > 0) !== up) f = [-f[0], -f[1], -f[2]]
  return f
}

/**
 * A box in the stage frame, s0..s1 by t0..t1, from z0 up to z1 (z1 may vary
 * over the plan), its upright edges chamfered by `b` so they catch the light.
 */
function block(p: Part, s0: number, s1: number, t0: number, t1: number, z0: number, z1: number | ((q: ST) => number), b = 0, top: Part = p) {
  const Z = typeof z1 === 'number' ? () => z1 : z1
  const ring: ST[] = b > 0
    ? [[s0 + b, t0], [s1 - b, t0], [s1, t0 + b], [s1, t1 - b], [s1 - b, t1], [s0 + b, t1], [s0, t1 - b], [s0, t0 + b]]
    : [[s0, t0], [s1, t0], [s1, t1], [s0, t1]]
  const c: ST = [(s0 + s1) / 2, (t0 + t1) / 2]
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], d = ring[(i + 1) % ring.length]
    const m = P([(a[0] + d[0]) / 2 - c[0], (a[1] + d[1]) / 2 - c[1]])
    // Outward: perpendicular to the edge, on the side away from the centre.
    const e = P([d[0] - a[0], d[1] - a[1]]), o0: XY = [e[1], -e[0]]
    const o: V3 = o0[0] * m[0] + o0[1] * m[1] >= 0 ? [o0[0], o0[1], 0] : [-o0[0], -o0[1], 0]
    quad(p, V(a, z0), V(d, z0), V(d, Z(d)), V(a, Z(a)), o)
  }
  for (let i = 1; i < ring.length - 1; i++) {
    const a = V(ring[0], Z(ring[0])), b2 = V(ring[i], Z(ring[i])), d = V(ring[i + 1], Z(ring[i + 1]))
    tri(top, a, b2, d, facing(a, b2, d, true))
  }
}
/** A square member of half-width w from a to b (struts and braces). */
function member(p: Part, a: V3, b: V3, w: number) {
  const d = unit([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
  const side = unit([d[1], -d[0], 0]), up = unit([side[1] * d[2] - side[2] * d[1], side[2] * d[0] - side[0] * d[2], side[0] * d[1] - side[1] * d[0]])
  const C = (q: V3, i: number): V3 => {
    const [ks, ku] = [[-1, -1], [1, -1], [1, 1], [-1, 1]][i]
    return [q[0] + (side[0] * ks + up[0] * ku) * w, q[1] + (side[1] * ks + up[1] * ku) * w, q[2] + (side[2] * ks + up[2] * ku) * w]
  }
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, [ks, ku] = [[0, -1], [1, 0], [0, 1], [-1, 0]][i]
    const n: V3 = [side[0] * ks + up[0] * ku, side[1] * ks + up[1] * ku, side[2] * ks + up[2] * ku]
    quad(p, C(a, i), C(a, j), C(b, j), C(b, i), n)
  }
}

// ---------------------------------------------------------------------------
// The roof: a folded plate over a pentagon (lidar).

const RZ = (z: number) => z - G
/** Outline corners, round the plan: front left, front right, side, back, side. */
const F1: ST = [12.1, -10.8], F2: ST = [12.1, 11.4], S2: ST = [-1.1, 15.9], B: ST = [-17.0, 0.3], S1: ST = [-1.1, -15.3]
/** The valley line where the front plane meets the back. */
const V1: ST = [-6.5, -9.2], V2: ST = [-6.5, 9.8]
const OUT = [F1, F2, S2, B, S1]
const TOP: Record<string, number> = { F1: 15.7, F2: 15.7, S2: 13.9, B: 11.7, S1: 13.9, V1: 10.45, V2: 10.45 }
/** Facets of the plate, by corner name. */
const FACETS = [['F1', 'F2', 'V2'], ['F1', 'V2', 'V1'], ['F2', 'S2', 'V2'], ['S2', 'B', 'V2'], ['V2', 'B', 'V1'], ['V1', 'B', 'S1'], ['S1', 'F1', 'V1']]
const NAMES = ['F1', 'F2', 'S2', 'B', 'S1']
const PTS: Record<string, ST> = { F1, F2, S2, B, S1, V1, V2 }
const THICK = 1.0, BEVEL = 0.35, DROP = 0.3

/** The top of the roof at a plan point (for anything hung under it). */
function roofTop(q: ST): number {
  for (const f of FACETS) {
    const [a, b, c] = f.map((k) => PTS[k])
    const d = (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])
    const l1 = ((b[0] - q[0]) * (c[1] - q[1]) - (c[0] - q[0]) * (b[1] - q[1])) / d
    const l2 = ((c[0] - q[0]) * (a[1] - q[1]) - (a[0] - q[0]) * (c[1] - q[1])) / d
    const l3 = 1 - l1 - l2
    if (l1 > -1e-6 && l2 > -1e-6 && l3 > -1e-6) return l1 * TOP[f[0]] + l2 * TOP[f[1]] + l3 * TOP[f[2]]
  }
  return TOP.V1
}
const under = (q: ST) => RZ(roofTop(q)) - THICK

function buildRoof(top: Part, dark: Part) {
  // The outline moved in by BEVEL: each edge offset, corners at the meets.
  const n = OUT.length
  const edges = OUT.map((a, i) => {
    const b = OUT[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const d: ST = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    // The inward side is toward the plate's centre.
    let nIn: ST = [-d[1], d[0]]
    const mid: ST = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    if ((-2 - mid[0]) * nIn[0] + (0.3 - mid[1]) * nIn[1] < 0) nIn = [d[1], -d[0]]
    return { a, d, nIn }
  })
  const inset: ST[] = OUT.map((_, i) => {
    const e0 = edges[(i + n - 1) % n], e1 = edges[i]
    const p0: ST = [e0.a[0] + e0.nIn[0] * BEVEL, e0.a[1] + e0.nIn[1] * BEVEL], p1: ST = [e1.a[0] + e1.nIn[0] * BEVEL, e1.a[1] + e1.nIn[1] * BEVEL]
    const den = e0.d[0] * e1.d[1] - e0.d[1] * e1.d[0]
    const k = ((p1[0] - p0[0]) * e1.d[1] - (p1[1] - p0[1]) * e1.d[0]) / den
    return [p0[0] + e0.d[0] * k, p0[1] + e0.d[1] * k]
  })
  const IN: Record<string, ST> = { ...PTS }
  NAMES.forEach((k, i) => (IN[k] = inset[i]))
  // Top facets, pale metal; each a flat face so the folds read.
  for (const f of FACETS) {
    const [a, b, c] = f.map((k) => V(IN[k], RZ(TOP[k])))
    tri(top, a, b, c, facing(a, b, c, true))
  }
  // Soffit: the same facets a roof's depth lower, charcoal.
  for (const f of FACETS) {
    const [a, b, c] = f.map((k) => V(PTS[k], RZ(TOP[k]) - THICK))
    tri(dark, a, b, c, facing(a, b, c, false))
  }
  NAMES.forEach((k, i) => {
    const j = NAMES[(i + 1) % n], e = edges[i]
    const o = P([-e.nIn[0], -e.nIn[1]]), out: V3 = [o[0], o[1], 0]
    const za = RZ(TOP[k]), zb = RZ(TOP[j])
    // The bevel: from the inset top down and out to the fascia's top.
    quad(top, V(IN[k], za), V(IN[j], zb), V(PTS[j], zb - DROP), V(PTS[k], za - DROP), [out[0], out[1], 1])
    // The fascia.
    quad(dark, V(PTS[k], za - DROP), V(PTS[j], zb - DROP), V(PTS[j], zb - THICK), V(PTS[k], za - THICK), out)
  })
}

// ---------------------------------------------------------------------------
// Build.

const top = new Part(), dark = new Part(), glass = new Part(), deck = new Part(), sign = new Part()
buildRoof(top, dark)

/** Stage deck top (lidar: plaza 3.6 m, front row 1.6 m, deck ~1.6 m above it). */
const DECK = RZ(3.5)
const TL = -9.4, TR = 10.0
{
  // The deck: concrete block, its front bowed out towards the seats (2007
  // aerial), drawn as a back rectangle and a five-sided bow.
  block(deck, -6.6, 6.0, TL, TR, -0.6, DECK, 0.3, dark)
  const bow: ST[] = [[6.0, TL], [7.6, TL + 0.4], [9.0, TL + 5], [9.4, (TL + TR) / 2], [9.0, TR - 5], [7.6, TR - 0.4], [6.0, TR]]
  for (let i = 0; i < bow.length - 1; i++) {
    const a = bow[i], b = bow[i + 1], o = P([b[1] - a[1], -(b[0] - a[0])])
    // Outward is towards +s for every bow segment.
    const out: V3 = o[0] * U[0] + o[1] * U[1] >= 0 ? [o[0], o[1], 0] : [-o[0], -o[1], 0]
    quad(deck, V(a, -0.6), V(b, -0.6), V(b, DECK), V(a, DECK), out)
  }
  const c: ST = [6.0, (TL + TR) / 2]
  for (let i = 0; i < bow.length - 1; i++) {
    const a = V(bow[i], DECK), b = V(bow[i + 1], DECK), d = V(c, DECK)
    tri(dark, a, b, d, [0, 0, 1])
  }
}

// The stage house over the back of the deck: a dark back wall and the
// black-draped north-west side up to the soffit, the glazed wing on the
// south-east (2018 photos).
block(dark, -6.5, -5.7, TL + 0.4, TR - 0.4, DECK, (q) => under(q) + 0.05)
block(dark, -5.7, -0.5, TL + 0.4, TL + 1.2, DECK, (q) => under(q) + 0.05)
// The glazed wing: a tall glass box in the stage's back corner, its face to
// the seats, framed in charcoal at its front corners.
block(glass, -5.7, -2.2, TR - 3.6, TR - 0.4, DECK, (q) => under(q) + 0.05)
for (const t of [TR - 3.6, TR - 0.4]) block(dark, -2.35, -1.95, t - 0.2, t + 0.2, DECK, (q) => under(q) + 0.05)

// Front columns at the deck's front corners, each with a strut up and back
// to the roof (2007 aerial, 2009 photo). The roof's back cantilevers off the
// stage house; no photo shows what holds it, so nothing is invented there.
for (const t of [TL + 0.6, TR - 0.6]) {
  const s = 7.4
  block(dark, s - 0.3, s + 0.3, t - 0.3, t + 0.3, -0.5, (q) => under(q) + 0.05)
  const a = V([s - 0.2, t], DECK + 3.5), b = V([s - 5.5, t], under([s - 5.5, t]) + 0.1)
  member(dark, a, b, 0.2)
}

// The sign band: the venue's blue banner across the stage opening, hung
// just under the front fascia between the columns.
{
  const s0 = 11.0, s1 = 11.35, t0 = TL + 1.2, t1 = TR - 1.2
  const z1 = (q: ST) => under(q) - 0.4, z0 = (q: ST) => under(q) - 1.7
  // Front and back faces and the ends of a thin board.
  const C = (s: number, t: number, z: (q: ST) => number) => V([s, t], z([s, t]))
  quad(sign, C(s1, t0, z0), C(s1, t1, z0), C(s1, t1, z1), C(s1, t0, z1), [U[0], U[1], 0])
  quad(sign, C(s0, t1, z0), C(s0, t0, z0), C(s0, t0, z1), C(s0, t1, z1), [-U[0], -U[1], 0])
  quad(dark, C(s0, t0, z1), C(s1, t0, z1), C(s1, t1, z1), C(s0, t1, z1), [0, 0, 1])
  quad(dark, C(s0, t0, z0), C(s0, t1, z0), C(s1, t1, z0), C(s1, t0, z0), [0, 0, -1])
  for (const [t, k] of [[t0, -1], [t1, 1]] as [number, number][]) {
    const o = P([0, k])
    quad(dark, C(s0, t, z0), C(s1, t, z0), C(s1, t, z1), C(s0, t, z1), [o[0], o[1], 0])
  }
  // Hangers from the soffit.
  for (const t of [t0 + 1, (t0 + t1) / 2, t1 - 1]) block(dark, s0, s1, t - 0.12, t + 0.12, under([s0, t]) - 0.45, (q) => under(q) + 0.05)
}

const parts = [
  { part: top, material: PALETTE.roof },
  { part: dark, material: finish('stage-charcoal', 0x4a4f57) },
  { part: deck, material: finish('stage-block', 0xcfcbc3) },
  { part: glass, material: PALETTE.glass },
  { part: sign, material: finish('skyla-blue', 0x4f7db5) },
]
const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
const height = Math.max(...Object.values(TOP)) - G
const glb = writeGlb('Skyla Credit Union Amphitheatre', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 0, elevation: 0, height,
})
if (triangles > 5000 || glb.length > 250000) throw new Error(`budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out = new URL('../models/music-factory-amphitheatre.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, height ${height.toFixed(1)} m`)
