/**
 * Ocean Beach Pier (Ocean Beach Municipal Pier), San Diego: procedural, CC0-1.0.
 * bun generators/sd-ocean-beach-pier.ts
 *
 * CLOSED. The pier has been closed to the public since storm damage in the
 * winter of 2023-24 (after earlier closures in 2021 and 2023); the city plans
 * to demolish and replace it. It still stands as built in 1966, which is what
 * this model draws (Wikipedia "Ocean Beach Pier", read November 2026).
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin: the centroid
 * of the OSM outline way/551709834 (lon -117.2566606, lat 32.7489626), on the
 * sea surface, which is y = 0, the lowest ground under the footprint. The
 * pier is a structure over the water, so the model owns its deck and piles;
 * elevation 0.
 *
 * What it is: a 1966 reinforced-concrete pier, 1,971 ft (601 m), the longest
 * concrete pier in the world when built (Wikipedia): a straight stem from
 * the foot of Niagara Avenue out to a T whose two arms bend away north and
 * south, with the café and bait shop on the north side of the stem about a
 * fifth of the way from the T.
 *
 * Plan: OSM. The outline way/551709834 (man_made=pier, area), the T's
 * centreline way/25256355, the stem's centreline way/833699876, the café
 * way/438087243. Stem 6.0 m wide, T arms 6 m (from the outline).
 *
 * Heights, measured: USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), four
 * 1 m boxes along the pier, above the sea surface (0.5 m in the cloud):
 * deck 8.1 m at the T, 6.4 m at the café, 5.0 m at mid-stem (s 300 m from
 * the T), 7.7 m at s 523 and about 9.6 m at the shore end: the deck sags to
 * the middle and climbs to the seawall. Railings read 1 m above the deck.
 * The café's flat roof is 3.2 m over the deck (lidar 9.6 m).
 * Estimated from photos: bents of two square concrete piles 0.8 m across
 * with a cap beam, 9.1 m apart (30 ft; from the spacing against the deck height in the Scott Cameron photo); the deck's edge beams 1.1 m deep;
 * lamp standards 4.5 m tall about every 30 m.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *   "Ocean Beach, San Diego, CA, USA - panoramio - rvd5star (1).jpg",
 *     rvd5star, CC BY 3.0 (side on: paired piles, cap beams, deck edge, lamps)
 *     https://commons.wikimedia.org/wiki/File:Ocean_Beach,_San_Diego,_CA,_USA_-_panoramio_-_rvd5star_(1).jpg
 *   "The long path (2357285180).jpg", jimmyweee, CC BY 2.0 (under the deck,
 *     the T beyond) https://commons.wikimedia.org/wiki/File:The_long_path_(2357285180).jpg
 *   "Symmetry (2353838006).jpg", jimmyweee, CC BY 2.0 (bents under the deck)
 *     https://commons.wikimedia.org/wiki/File:Symmetry_(2353838006).jpg
 *   "Pier on Ocean Beach - panoramio.jpg", Alen Ištoković, CC BY 3.0 (on the
 *     deck: width, railings, lamp standards)
 *     https://commons.wikimedia.org/wiki/File:Pier_on_Ocean_Beach_-_panoramio.jpg
 *   "Hohe Wellen in Ocean Beach.jpg", PDPhoto.org, public domain (the café)
 *     https://commons.wikimedia.org/wiki/File:Hohe_Wellen_in_Ocean_Beach.jpg
 *   "Ocean Beach - panoramio - Scott Cameron.jpg", Scott Cameron, CC BY 3.0
 *     (the T from the rocks to the south)
 *     https://commons.wikimedia.org/wiki/File:Ocean_Beach_-_panoramio_-_Scott_Cameron.jpg
 *
 * Style: pale weathered concrete for deck, piles and railings; the café
 * white with a blue window band and a grey flat roof; lamp heads as `lamp`
 * beads on thin standards (the pier was lit along its length).
 *
 * Doubts: pile spacing and size are estimated from photos, not drawings.
 * The deck profile between the lidar boxes is interpolated. The café's
 * "CAFE" roof sign and the shore gate's "OCEAN BEACH FISHING PIER" grille are
 * left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, rect, qf, save, type XY } from './dc-white-house'

const concrete = new Part(), white = new Part(), roof = new Part(), win = new Part(), lamp = new Part()

// ------------------------------------------------------------------ plan ----
// Stem centreline, from the T junction to the shore end; T arms from the
// junction to each end (OSM, metres from the origin).
const STEM: XY[] = [[-179.1, 136.5], [295.4, -207.9], [312.7, -220.4]]
const ARM_S: XY[] = [[-179.1, 136.5], [-220.6, 110.2], [-231.5, 96.8], [-244.8, 53.2]]
const ARM_N: XY[] = [[-179.1, 136.5], [-180.9, 137.9], [-164.8, 193.3]]
const W_STEM = 6.0, W_ARM = 6.0
/** Deck top over the sea by distance along the stem from the T (lidar, linear between). */
const PROFILE: [number, number][] = [[0, 8.1], [117, 6.4], [300, 5.0], [380, 5.3], [523, 7.7], [610, 9.6]]
function stemZ(s: number) {
  for (let i = 0; i + 1 < PROFILE.length; i++) {
    const [s0, z0] = PROFILE[i], [s1, z1] = PROFILE[i + 1]
    if (s <= s1 || i === PROFILE.length - 2) return z0 + ((z1 - z0) * Math.max(0, s - s0)) / (s1 - s0)
  }
  return PROFILE[0][1]
}
const armZ = () => 8.1
const DECK_T = 1.1

/** Points every `step` m along a polyline, with the heading there. */
function walk(poly: XY[], step: number) {
  const out: { p: XY; t: XY; s: number }[] = []
  let s0 = 0
  for (let i = 0; i + 1 < poly.length; i++) {
    const a = poly[i], b = poly[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    for (let d = i === 0 ? 0 : step - ((s0) % step || step); d <= L + 1e-6; d += step) out.push({ p: [a[0] + t[0] * d, a[1] + t[1] * d], t, s: s0 + d })
    s0 += L
  }
  return out
}
const lengthOf = (poly: XY[]) => poly.slice(1).reduce((s, b, i) => s + Math.hypot(b[0] - poly[i][0], b[1] - poly[i][1]), 0)

// ------------------------------------------------------------------ deck ----
/** A deck strip along a polyline, `w` wide, top at z(s), sampled every `step` m. */
function strip(poly: XY[], w: number, z: (s: number) => number, step: number) {
  const pts = walk(poly, step)
  const last = poly[poly.length - 1], total = lengthOf(poly)
  if (pts[pts.length - 1].s < total - 0.5) pts.push({ p: last, t: pts[pts.length - 1].t, s: total })
  const sec = (q: (typeof pts)[number]) => {
    const n: XY = [-q.t[1], q.t[0]], h = z(q.s)
    const L: XY = [q.p[0] + n[0] * w / 2, q.p[1] + n[1] * w / 2], R: XY = [q.p[0] - n[0] * w / 2, q.p[1] - n[1] * w / 2]
    return { L, R, h, n }
  }
  for (let i = 0; i + 1 < pts.length; i++) {
    const A = sec(pts[i]), B = sec(pts[i + 1])
    qf(concrete, [A.L[0], A.L[1], A.h], [A.R[0], A.R[1], A.h], [B.R[0], B.R[1], B.h], [B.L[0], B.L[1], B.h], [0, 0, 1])
    qf(concrete, [A.L[0], A.L[1], A.h - DECK_T], [A.R[0], A.R[1], A.h - DECK_T], [B.R[0], B.R[1], B.h - DECK_T], [B.L[0], B.L[1], B.h - DECK_T], [0, 0, -1])
    for (const [k, sg] of [['L', 1], ['R', -1]] as const) {
      const a = A[k], b = B[k], N: V3 = [A.n[0] * sg, A.n[1] * sg, 0]
      qf(concrete, [a[0], a[1], A.h - DECK_T], [b[0], b[1], B.h - DECK_T], [b[0], b[1], B.h], [a[0], a[1], A.h], N)
      // Railing: a solid band 1 m high, 0.18 m thick, on the deck's edge.
      const ia: XY = [a[0] - A.n[0] * sg * 0.18, a[1] - A.n[1] * sg * 0.18], ib: XY = [b[0] - B.n[0] * sg * 0.18, b[1] - B.n[1] * sg * 0.18]
      qf(concrete, [a[0], a[1], A.h], [b[0], b[1], B.h], [b[0], b[1], B.h + 1], [a[0], a[1], A.h + 1], N)
      qf(concrete, [ia[0], ia[1], A.h], [ib[0], ib[1], B.h], [ib[0], ib[1], B.h + 1], [ia[0], ia[1], A.h + 1], [-N[0], -N[1], 0])
      qf(concrete, [a[0], a[1], A.h + 1], [b[0], b[1], B.h + 1], [ib[0], ib[1], B.h + 1], [ia[0], ia[1], A.h + 1], [0, 0, 1])
    }
  }
  // Square ends.
  for (const q of [pts[0], pts[pts.length - 1]]) {
    const S = sec(q), N: V3 = q === pts[0] ? [-q.t[0], -q.t[1], 0] : [q.t[0], q.t[1], 0]
    qf(concrete, [S.L[0], S.L[1], S.h - DECK_T], [S.R[0], S.R[1], S.h - DECK_T], [S.R[0], S.R[1], S.h], [S.L[0], S.L[1], S.h], N)
  }
}
strip(STEM, W_STEM, stemZ, 15)
strip(ARM_S, W_ARM, armZ, 20)
strip(ARM_N, W_ARM, armZ, 20)

// ----------------------------------------------------------------- bents ----
/** A bent: two square piles from the sea to the cap, and a cap beam across. */
function bent(p: XY, t: XY, w: number, top: number) {
  const n: XY = [-t[1], t[0]], r = 0.4, off = w / 2 - 0.9, capH = 0.7
  for (const sg of [1, -1]) {
    const c: XY = [p[0] + n[0] * off * sg, p[1] + n[1] * off * sg]
    // An axis-aligned post turned to the pier: four faces.
    const P = (a: number, b: number, z: number): V3 => [c[0] + t[0] * a + n[0] * b, c[1] + t[1] * a + n[1] * b, z]
    const z1 = top - capH
    const sides: [number, number, number, number, XY][] = [[-r, -r, r, -r, [-n[0], -n[1]]], [r, -r, r, r, t], [r, r, -r, r, n], [-r, r, -r, -r, [-t[0], -t[1]]]]
    for (const [a0, b0, a1, b1, N] of sides) qf(concrete, P(a0, b0, 0), P(a1, b1, 0), P(a1, b1, z1), P(a0, b0, z1), [N[0], N[1], 0])
  }
  // Cap beam: 0.8 m along, the deck's width less 0.3, under the deck.
  const P = (a: number, b: number, z: number): V3 => [p[0] + t[0] * a + n[0] * b, p[1] + t[1] * a + n[1] * b, z]
  const hb = w / 2 - 0.3, ha = 0.45, z0 = top - capH, z1 = top
  qf(concrete, P(-ha, -hb, z0), P(-ha, hb, z0), P(-ha, hb, z1), P(-ha, -hb, z1), [-t[0], -t[1], 0])
  qf(concrete, P(ha, -hb, z0), P(ha, hb, z0), P(ha, hb, z1), P(ha, -hb, z1), [t[0], t[1], 0])
  qf(concrete, P(-ha, -hb, z0), P(ha, -hb, z0), P(ha, hb, z0), P(-ha, hb, z0), [0, 0, -1])
}
const SPAN = 9.1
for (const q of walk(STEM, SPAN)) if (q.s > 3 && q.s < lengthOf(STEM) - 2) bent(q.p, q.t, W_STEM, stemZ(q.s) - DECK_T)
for (const arm of [ARM_S, ARM_N]) for (const q of walk(arm, SPAN)) if (q.s > 4) bent(q.p, q.t, W_ARM, armZ() - DECK_T)

// ------------------------------------------------------------------ café ----
// way/438087243: on the north side of the stem, 37.8 × 5.9 m, deck widened
// under it. Walls 3.2 m with a white parapet, a blue window band all round,
// grey flat roof.
{
  const t: XY = [0.81, -0.586], n: XY = [0.586, 0.81]
  const c: XY = [-81.4, 71.5], hl = 18.9, hw = 2.95
  const s = (( c[0] + 179.1) * t[0] + (c[1] - 136.5) * t[1])
  const z0 = stemZ(s), H = 3.2
  const P = (a: number, b: number, z: number): V3 => [c[0] + t[0] * a + n[0] * b, c[1] + t[1] * a + n[1] * b, z]
  // Deck extension under it.
  qf(concrete, P(-hl - 0.5, -hw - 0.5, z0 - 0.02), P(hl + 0.5, -hw - 0.5, z0 - 0.02), P(hl + 0.5, hw + 0.5, z0 - 0.02), P(-hl - 0.5, hw + 0.5, z0 - 0.02), [0, 0, 1])
  qf(concrete, P(-hl - 0.5, hw + 0.5, z0 - DECK_T), P(hl + 0.5, hw + 0.5, z0 - DECK_T), P(hl + 0.5, hw + 0.5, z0), P(-hl - 0.5, hw + 0.5, z0), [n[0], n[1], 0])
  qf(concrete, P(-hl - 0.5, -hw - 0.5, z0 - DECK_T), P(hl + 0.5, -hw - 0.5, z0 - DECK_T), P(hl + 0.5, hw + 0.5, z0 - DECK_T), P(-hl - 0.5, hw + 0.5, z0 - DECK_T), [0, 0, -1])
  for (let a = -hl + 1; a <= hl; a += SPAN) bent([c[0] + t[0] * a, c[1] + t[1] * a], t, 2 * hw + 1, z0 - DECK_T)
  const corners: [number, number][] = [[-hl, -hw], [hl, -hw], [hl, hw], [-hl, hw]]
  for (let i = 0; i < 4; i++) {
    const [a0, b0] = corners[i], [a1, b1] = corners[(i + 1) % 4]
    const ma = (a0 + a1) / 2, mb = (b0 + b1) / 2
    const N: V3 = Math.abs(ma) > 1e-6 ? [t[0] * Math.sign(ma), t[1] * Math.sign(ma), 0] : [n[0] * Math.sign(mb), n[1] * Math.sign(mb), 0]
    qf(white, P(a0, b0, z0), P(a1, b1, z0), P(a1, b1, z0 + H + 0.5), P(a0, b0, z0 + H + 0.5), N)
    // Window band, 1.0-2.3 m up, inset 0.6 m from each corner.
    const k = 0.6 / Math.hypot(a1 - a0, b1 - b0), d = 0.05
    const A = P(a0 + (a1 - a0) * k + N[0] * 0, b0 + (b1 - b0) * k, 0), B = P(a1 - (a1 - a0) * k, b1 - (b1 - b0) * k, 0)
    const off: V3 = [N[0] * d, N[1] * d, 0]
    qf(win, [A[0] + off[0], A[1] + off[1], z0 + 1.0], [B[0] + off[0], B[1] + off[1], z0 + 1.0], [B[0] + off[0], B[1] + off[1], z0 + 2.3], [A[0] + off[0], A[1] + off[1], z0 + 2.3], N)
  }
  // Roof inside a 0.5 m parapet, and the parapet's inner face and top.
  const pi = 0.25
  qf(roof, P(-hl + pi, -hw + pi, z0 + H), P(hl - pi, -hw + pi, z0 + H), P(hl - pi, hw - pi, z0 + H), P(-hl + pi, hw - pi, z0 + H), [0, 0, 1])
  const inner: [number, number][] = [[-hl + pi, -hw + pi], [hl - pi, -hw + pi], [hl - pi, hw - pi], [-hl + pi, hw - pi]]
  for (let i = 0; i < 4; i++) {
    const [a0, b0] = inner[i], [a1, b1] = inner[(i + 1) % 4], [o0, q0] = corners[i], [o1, q1] = corners[(i + 1) % 4]
    const ma = (a0 + a1) / 2, mb = (b0 + b1) / 2
    const N: V3 = Math.abs(ma) > 1e-6 && Math.abs(a0 - a1) < 1e-6 ? [-t[0] * Math.sign(ma), -t[1] * Math.sign(ma), 0] : [-n[0] * Math.sign(mb), -n[1] * Math.sign(mb), 0]
    qf(white, P(a0, b0, z0 + H), P(a1, b1, z0 + H), P(a1, b1, z0 + H + 0.5), P(a0, b0, z0 + H + 0.5), N)
    qf(white, P(o0, q0, z0 + H + 0.5), P(o1, q1, z0 + H + 0.5), P(a1, b1, z0 + H + 0.5), P(a0, b0, z0 + H + 0.5), [0, 0, 1])
  }
}

// ----------------------------------------------------------------- lamps ----
// Lamp standards about every 30 m, alternating sides: a thin post and a bead.
function standard(p: XY, n: XY, side: number, z0: number) {
  const c: XY = [p[0] + n[0] * side * (W_STEM / 2 - 0.35), p[1] + n[1] * side * (W_STEM / 2 - 0.35)]
  cbox(concrete, rect(c[0] - 0.12, c[0] + 0.12, c[1] - 0.12, c[1] + 0.12), z0, z0 + 4.5, { top: false })
  const r = 0.35, h: V3 = [c[0], c[1], z0 + 4.7]
  const v: V3[] = [[r, 0, 0], [-r, 0, 0], [0, r, 0], [0, -r, 0], [0, 0, r], [0, 0, -r]].map((d) => [h[0] + d[0], h[1] + d[1], h[2] + d[2]] as V3)
  for (const [i, j, k] of [[0, 2, 4], [2, 1, 4], [1, 3, 4], [3, 0, 4], [2, 0, 5], [1, 2, 5], [3, 1, 5], [0, 3, 5]]) {
    const m: V3 = [0, 1, 2].map((q) => (v[i][q] + v[j][q] + v[k][q]) / 3 - h[q]) as V3
    lamp.tri(v[i], v[j], v[k], undefined, undefined, undefined, [m, m, m])
  }
}
{
  let side = 1
  for (const q of walk(STEM, 30)) { if (q.s > 5 && q.s < lengthOf(STEM) - 5) { standard(q.p, [-q.t[1], q.t[0]], side, stemZ(q.s)); side = -side } }
  for (const arm of [ARM_S, ARM_N]) for (const q of walk(arm, 30)) if (q.s > 10) { standard(q.p, [-q.t[1], q.t[0]], side, armZ()); side = -side }
}

// ---------------------------------------------------------------- output ----
// Colours from the daylight photos, pulled to the palette's lightness: pale
// weathered concrete; the café white, blue window band, grey roof.
await save('sd-ocean-beach-pier', 'Ocean Beach Pier', [
  { part: concrete, material: finish('ob-concrete', 0xbdb8ae) },
  { part: white, material: finish('ob-cafe-white', 0xf1eee6) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: lamp, material: finish('lamp-ob', 0xd9d6cf) },
], { bearing: 0, elevation: 0, status: 'closed since 2023 storm damage' }, 6500)
