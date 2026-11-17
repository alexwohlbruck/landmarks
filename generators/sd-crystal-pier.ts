/**
 * Crystal Pier and the Crystal Pier Hotel, Pacific Beach, San Diego:
 * procedural, CC0-1.0.
 * bun generators/sd-crystal-pier.ts
 *
 * Frame: built along the pier. x runs along the pier's axis towards the
 * shore (compass 75.1°), y across it (345.1°), z up, metres; the placement
 * bearing is 345.1, which turns the model's north to 345.1° and so its x to
 * 75.1°. Origin: the placement anchor (lon -117.25825, lat 32.79601), on the
 * water. y = 0 (z here) is the sea surface, the lowest ground under the
 * footprint; the pier is a structure over the water and the beach, so the
 * model owns its deck, piles and all, and elevation stays 0.
 *
 * What it is: a 1927 timber pier, 872 ft (266 m), with 26 white clapboard
 * cottages on its landward half (the Crystal Pier Hotel; ten cottages
 * opened in April 1936, most built in the 1930s), entered from Garnet Avenue
 * through a white stucco arch between the two hotel office buildings, with a
 * small arcaded tower either side (Times of San Diego, 2025-06-05;
 * pierfishing.com "Crystal Pier"; Ken Jones, "Crystal Pier").
 *
 * Plan: OSM. The pier outline way/31294900 (man_made=pier); the 26 cottages
 * (building=commercial, way/40839394 … way/40840834, way/165831915,
 * way/1444021025, way/1444021026), each drawn from its own outline; the
 * hotel buildings on shore, relation/19743905 (outer ways 39568451 and
 * 39568452); the entrance gap "Crystal Pier Entrance" way/1454689889.
 * Checked over USGS NAIP (public domain): every outline sits on its roof.
 *
 * Heights, measured from USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014),
 * 1 m grid along the pier's axis, above the sea surface (0.4 m under the
 * cloud's lowest ground return):
 *   deck from the shore to x -60: 7.0 m; rising to 8.8 m by x -95, level to
 *     the seaward end (the deck climbs seaward, as the photos show);
 *   cottage roofs 9.7-10.7 m, so walls 2.6 m and ridges 3.6 m over the deck;
 *   the beach under the hotel half 1-3 m (sand), the street at the shore 7 m;
 *   the hotel buildings' roofs 13.6-14.7 m, the two towers 17.7 m.
 * Estimated from the photos against those heights: the arch (a semicircle
 * of 3.2 m radius springing 2.6 m above the street, its wall 6.8 m high),
 * the towers' plan (3.6 m square), pile spacing (a bent every 6.5 m, three
 * piles under the walkway and seven under the hotel), the railing (1 m).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *   "Crystal Pier.jpg", Dirk Hansen, CC BY 2.0 (from the beach to the south:
 *     cottages, piles, bracing, railing)
 *     https://commons.wikimedia.org/wiki/File:Crystal_Pier.jpg
 *   "Crystal Pier - San Diego Pacific Beach.JPG", Hombre del rio, CC BY-SA 4.0
 *     (the entrance arch and towers from Garnet Avenue)
 *     https://commons.wikimedia.org/wiki/File:Crystal_Pier_-_San_Diego_Pacific_Beach.JPG
 *   "CrystalPier.jpg", Tim Shell, CC BY-SA 3.0 (along the walkway to the
 *     cottages and the shore)
 *     https://commons.wikimedia.org/wiki/File:CrystalPier.jpg
 *   "Crystal Pier, Sandiago Beach - panoramio.jpg", Raman Patel, CC BY 3.0
 *     (cottages from the hotel lane: white clapboard, blue shutters)
 *     https://commons.wikimedia.org/wiki/File:Crystal_Pier,_Sandiago_Beach_-_panoramio.jpg
 *   "Pac Beach 024.jpg", Dirk Hansen, CC BY-SA 3.0 (the seaward half, side on)
 *     https://commons.wikimedia.org/wiki/File:Pac_Beach_024.jpg
 *   "Crystal peer san diego.JPG", Microsomen, CC BY 1.0 (from the north beach)
 *     https://commons.wikimedia.org/wiki/File:Crystal_peer_san_diego.JPG
 *
 * Style: white cottages with slate-blue hip roofs and one window panel a
 * side (lit at night, as the cottages are); the deck, piles and bracing in
 * weathered timber, the piles drawn as chunky square posts in bents with a
 * cap beam and one girt each, so the open timber forest under the deck
 * reads; the white railing as a bold solid band. The office buildings white
 * with grey roofs, the arch and towers white, the towers' arcades as window
 * panels.
 *
 * Doubts: pile counts and bracing are simplified (the real bents hold more
 * piles, with X bracing). The office buildings are drawn as plain two-storey
 * blocks with hip roofs; their verandas and balconies are left out. The
 * deck's rise seaward is from the 2014 lidar.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, rect, hip, qf, save, type XY } from './dc-white-house'

const white = new Part(), timber = new Part(), cotRoof = new Part(), roof = new Part(), win = new Part()

/** Deck top above the sea, by distance along the pier. */
const deckZ = (u: number) => (u >= -60 ? 7.0 : u <= -95 ? 8.8 : 7.0 + ((-60 - u) / 35) * 1.8)
const DECK_T = 0.9 // deck and stringers

// ------------------------------------------------------------------ deck ----
/** A deck slab over [u0, u1] × [v0, v1], top following deckZ, split where it slopes. */
function deck(u0: number, u1: number, v0: number, v1: number) {
  const cuts = [u0, ...[-95, -77.5, -60].filter((c) => c > u0 && c < u1), u1]
  for (let i = 0; i + 1 < cuts.length; i++) {
    const a = cuts[i], b = cuts[i + 1], za = deckZ(a), zb = deckZ(b)
    const T = (u: number, v: number, z: number): V3 => [u, v, z]
    // Top, sides, ends; bottom too (seen from the beach).
    const n: V3 = [-(zb - za), 0, b - a]
    qf(timber, T(a, v0, za), T(b, v0, zb), T(b, v1, zb), T(a, v1, za), n)
    qf(timber, T(a, v0, za - DECK_T), T(b, v0, zb - DECK_T), T(b, v1, zb - DECK_T), T(a, v1, za - DECK_T), [0, 0, -1])
    qf(timber, T(a, v0, za - DECK_T), T(b, v0, zb - DECK_T), T(b, v0, zb), T(a, v0, za), [0, -1, 0])
    qf(timber, T(a, v1, za - DECK_T), T(b, v1, zb - DECK_T), T(b, v1, zb), T(a, v1, za), [0, 1, 0])
    if (i === 0) qf(timber, T(a, v0, za - DECK_T), T(a, v1, za - DECK_T), T(a, v1, za), T(a, v0, za), [-1, 0, 0])
    if (i === cuts.length - 2) qf(timber, T(b, v0, zb - DECK_T), T(b, v1, zb - DECK_T), T(b, v1, zb), T(b, v0, zb), [1, 0, 0])
  }
}
// The walkway (5 m), the wider platform at its seaward end, the hotel half,
// and the short neck between them (OSM outline, simplified to rectangles).
const WALK: [number, number] = [-6.8, -1.8]
deck(-118, 4, WALK[0], WALK[1])
deck(-135.4, -118, -12.1, 3.7)
deck(4, 131.5, -21, 11.4)
deck(47.2, 65.3, -26.5, -21)
deck(107.8, 131.5, 11.4, 13)

// --------------------------------------------------------------- railing ----
/** A white railing band 1 m high and 0.2 m thick along a run at constant v, from u0 to u1. */
function rail(u0: number, u1: number, v: number) {
  const cuts = [u0, ...[-95, -60].filter((c) => c > u0 && c < u1), u1]
  for (let i = 0; i + 1 < cuts.length; i++) {
    const a = cuts[i], b = cuts[i + 1], za = deckZ(a), zb = deckZ(b)
    for (const [vv, s] of [[v - 0.1, -1], [v + 0.1, 1]] as const)
      qf(white, [a, vv, za], [b, vv, zb], [b, vv, zb + 1], [a, vv, za + 1], [0, s, 0])
    qf(white, [a, v - 0.1, za + 1], [b, v - 0.1, zb + 1], [b, v + 0.1, zb + 1], [a, v + 0.1, za + 1], [0, 0, 1])
  }
}
/** The same across the pier, at constant u. */
function railX(u: number, v0: number, v1: number) {
  const z = deckZ(u)
  for (const [uu, s] of [[u - 0.1, -1], [u + 0.1, 1]] as const)
    qf(white, [uu, v0, z], [uu, v1, z], [uu, v1, z + 1], [uu, v0, z + 1], [s, 0, 0])
  qf(white, [u - 0.1, v0, z + 1], [u + 0.1, v0, z + 1], [u + 0.1, v1, z + 1], [u - 0.1, v1, z + 1], [0, 0, 1])
}
rail(-118, 4, WALK[0] + 0.1); rail(-118, 4, WALK[1] - 0.1)
rail(-135.3, -118, -12); rail(-135.3, -118, 3.6)
railX(-135.3, -12, 3.6); railX(-118, -12, WALK[0]); railX(-118, WALK[1], 3.6)
rail(4, 47.2, -20.9); rail(65.3, 131.5, -20.9); rail(47.2, 65.3, -26.4)
rail(4, 107.8, 11.3); rail(107.8, 131.5, 12.9)
railX(4, -20.9, WALK[0]); railX(4, WALK[1], 11.3)

// ----------------------------------------------------------------- piles ----
/** A square post from z0 to z1, half-width r (sides only). */
function post(p: Part, u: number, v: number, r: number, z0: number, z1: number) {
  cbox(p, rect(u - r, u + r, v - r, v + r), z0, z1, { top: false })
}
/** A horizontal beam across the pier at u, from v0 to v1, centred at z. */
function beam(p: Part, u: number, v0: number, v1: number, z: number, h = 0.5, t = 0.35) {
  cbox(p, rect(u - t, u + t, v0, v1), z - h / 2, z + h / 2, { bottom: true })
}
/** A diagonal brace in a bent, in the plane u, from (v0, z0) to (v1, z1). */
function brace(p: Part, u: number, v0: number, z0: number, v1: number, z1: number, w = 0.25, h = 0.35) {
  const P = (k: number, v: number, z: number): V3 => [u + k * w, v, z]
  const nv = -(z1 - z0), nz = v1 - v0, l = Math.hypot(nv, nz), N: V3 = [0, nv / l, nz / l]
  const dz = h * (N[2]), dv = h * N[1]
  for (const k of [-1, 1]) qf(p, P(k, v0 - dv, z0 - dz), P(k, v1 - dv, z1 - dz), P(k, v1 + dv, z1 + dz), P(k, v0 + dv, z0 + dz), [k, 0, 0])
  qf(p, P(-1, v0 + dv, z0 + dz), P(1, v0 + dv, z0 + dz), P(1, v1 + dv, z1 + dz), P(-1, v1 + dv, z1 + dz), N)
}
const R_PILE = 0.42
// Walkway and end platform.
for (let u = -133; u <= 2; u += 6.5) {
  const z1 = deckZ(u) - DECK_T
  const wide = u < -118
  const vs = wide ? [-11.4, -7.2, -4.3, -1.4, 3.0] : [WALK[0] + 0.4, (WALK[0] + WALK[1]) / 2, WALK[1] - 0.4]
  for (const v of vs) post(timber, u, v, R_PILE, 0, z1)
  beam(timber, u, vs[0] - 0.4, vs[vs.length - 1] + 0.4, z1 - 0.3)
  beam(timber, u, vs[0] - 0.3, vs[vs.length - 1] + 0.3, z1 * 0.45, 0.4, 0.25)
  brace(timber, u, vs[0], z1 * 0.45, vs[vs.length - 1], z1 - 0.5)
}
// The hotel half.
for (let u = 7; u <= 129; u += 6.5) {
  const z1 = deckZ(u) - DECK_T
  const vs = [-20.4, -15.3, -10.2, -5.1, 0, 5.4, 10.8]
  for (const v of vs) post(timber, u, v, R_PILE + 0.04, 0, z1)
  beam(timber, u, vs[0] - 0.4, vs[vs.length - 1] + 0.4, z1 - 0.3)
  beam(timber, u, vs[0] - 0.3, vs[vs.length - 1] + 0.3, z1 * 0.5, 0.4, 0.25)
  brace(timber, u, vs[0], z1 * 0.5, vs[3], z1 - 0.5)
  brace(timber, u, vs[6], z1 * 0.5, vs[3], z1 - 0.5)
}
/** A longitudinal wale along the outer pile line at v, from u0 to u1, at a fraction f of the deck's underside. */
function wale(u0: number, u1: number, v: number, f: number, h = 0.45) {
  const cuts = [u0, ...[-95, -60].filter((c) => c > u0 && c < u1), u1]
  for (let i = 0; i + 1 < cuts.length; i++) {
    const a = cuts[i], b = cuts[i + 1], za = (deckZ(a) - DECK_T) * f, zb = (deckZ(b) - DECK_T) * f
    for (const [vv, sg] of [[v - 0.5, -1], [v + 0.5, 1]] as const)
      qf(timber, [a, vv, za - h], [b, vv, zb - h], [b, vv, zb + h], [a, vv, za + h], [0, sg, 0])
  }
}
for (const f of [0.45, 0.85]) {
  wale(-133, 2, WALK[0] + 0.4, f); wale(-133, 2, WALK[1] - 0.4, f)
  wale(7, 129, -20.4, f); wale(7, 129, 10.8, f)
}

// -------------------------------------------------------------- cottages ----
// The 26 cottages: OSM outlines (way ids) in the pier frame, [x, y] corners.
// The ones near the neck stand turned 45°; the 6-node outlines are L-shaped
// (a porch), drawn as their oriented box.
const COTTAGES: Record<string, XY[]> = {
  1444021025: [[104.1, -9.7], [111.1, -9.8], [111.1, -15.2], [104.1, -15.1]],
  1444021026: [[111.3, 0.3], [120.7, 0.4], [120.6, 10.5], [111.2, 10.5]],
  165831915: [[6.6, -6.6], [9.5, -9.5], [7.4, -11.6], [4.4, -8.7]],
  40839394: [[9.9, 0.8], [7.9, 3.2], [4.8, 0.6], [6.8, -1.8]],
  40839395: [[12.9, -8.2], [19.0, -14.5], [14.0, -19.3], [7.9, -13.0]],
  40839396: [[23.3, -8.5], [29.1, -14.5], [24.3, -19.1], [18.5, -13.1]],
  40839397: [[33.2, -8.6], [39.6, -14.7], [34.9, -19.5], [28.6, -13.3]],
  40839398: [[19.9, 6.1], [15.2, 10.9], [9.6, 5.5], [14.4, 0.6]],
  40839403: [[24.1, 0.4], [30.0, 6.4], [25.2, 11.1], [19.3, 5.1]],
  40839407: [[40.1, 6.4], [35.1, 11.2], [28.7, 4.7], [33.7, -0.1]],
  40839420: [[73.1, -9.5], [73.2, -15.0], [65.9, -14.9], [65.9, -9.4]],
  40839421: [[65.5, 6.8], [73.0, 6.8], [73.0, 0.9], [65.5, 0.9]],
  40839422: [[82.3, 0.9], [82.4, 6.5], [74.9, 6.6], [74.8, 1.0]],
  40839423: [[82.6, -14.7], [82.6, -9.4], [74.9, -9.4], [74.9, -14.7]],
  40839424: [[84.8, -9.7], [91.9, -9.7], [91.9, -14.7], [84.8, -14.7]],
  40839425: [[47.4, 7.3], [54.8, 7.1], [54.6, 0.5], [42.9, 0.8], [43.1, 9.2], [47.5, 9.0]],
  40839427: [[43.1, -9.2], [54.1, -9.2], [54.2, -15.0], [47.6, -15.1], [47.3, -17.3], [42.8, -17.3]],
  40839428: [[63.6, 1.5], [63.6, 6.8], [56.4, 6.8], [56.4, 1.4]],
  40839429: [[63.2, -14.4], [63.2, -9.3], [56.6, -9.2], [56.3, -14.3]],
  40839443: [[101.3, 6.5], [101.3, 0.6], [94.0, 0.6], [94.0, 6.6]],
  40839444: [[109.8, 6.3], [109.8, 0.8], [103.1, 0.8], [103.1, 6.3]],
  40839445: [[101.3, -9.7], [101.3, -14.9], [94.2, -14.8], [94.3, -9.6]],
  40839446: [[84.4, 6.4], [91.9, 6.3], [91.8, 0.7], [84.3, 1.0]],
  40840819: [[123.4, -9.4], [130.6, -9.6], [130.5, -20.0], [121.8, -19.9], [121.8, -12.7], [123.4, -12.7]],
  40840820: [[121.0, 0.4], [130.4, 0.5], [130.3, 10.7], [120.9, 10.6]],
  40840834: [[113.5, -9.7], [120.5, -9.8], [120.5, -15.2], [113.5, -15.1]],
}
/** An oriented box cottage from its OSM outline: centre, axes, half sizes from the outline. */
type Box = { c: XY; a: XY; hu: number; hv: number }
function boxOf(pts: XY[]): Box {
  // Longest edge gives the axis.
  let best = 0, a: XY = [1, 0]
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length], l = Math.hypot(q[0] - p[0], q[1] - p[1])
    if (l > best) { best = l; a = [(q[0] - p[0]) / l, (q[1] - p[1]) / l] }
  }
  const b: XY = [-a[1], a[0]]
  const pu = pts.map((p) => p[0] * a[0] + p[1] * a[1]), pv = pts.map((p) => p[0] * b[0] + p[1] * b[1])
  const cu = (Math.min(...pu) + Math.max(...pu)) / 2, cv = (Math.min(...pv) + Math.max(...pv)) / 2
  return { c: [cu * a[0] + cv * b[0], cu * a[1] + cv * b[1]], a, hu: (Math.max(...pu) - Math.min(...pu)) / 2, hv: (Math.max(...pv) - Math.min(...pv)) / 2 }
}
const WALL = 2.6, RIDGE = 3.6
function cottage(bx: Box) {
  const { c, a, hu, hv } = bx, b: XY = [-a[1], a[0]]
  const z0 = deckZ(c[0]), P = (su: number, sv: number, z: number): V3 => [c[0] + a[0] * su + b[0] * sv, c[1] + a[1] * su + b[1] * sv, z]
  const corners: [number, number][] = [[-hu, -hv], [hu, -hv], [hu, hv], [-hu, hv]]
  for (let i = 0; i < 4; i++) {
    const [u0, v0] = corners[i], [u1, v1] = corners[(i + 1) % 4]
    const mu = (u0 + u1) / 2, mv = (v0 + v1) / 2
    const n: V3 = [a[0] * Math.sign(mu) * (Math.abs(mu) > 1e-6 ? 1 : 0) + b[0] * Math.sign(mv) * (Math.abs(mv) > 1e-6 ? 1 : 0), a[1] * Math.sign(mu) * (Math.abs(mu) > 1e-6 ? 1 : 0) + b[1] * Math.sign(mv) * (Math.abs(mv) > 1e-6 ? 1 : 0), 0]
    qf(white, P(u0, v0, z0), P(u1, v1, z0), P(u1, v1, z0 + WALL), P(u0, v0, z0 + WALL), n)
    // A window panel in the middle of each wall: half its length, 0.9-2.0 m up.
    const k = 0.25, off = 0.05
    const W0 = P(u0 + (u1 - u0) * k + Math.sign(mu) * off * (Math.abs(mu) > 1e-6 ? 1 : 0), v0 + (v1 - v0) * k + Math.sign(mv) * off * (Math.abs(mv) > 1e-6 ? 1 : 0), z0 + 0.9)
    const W1 = P(u0 + (u1 - u0) * (1 - k) + Math.sign(mu) * off * (Math.abs(mu) > 1e-6 ? 1 : 0), v0 + (v1 - v0) * (1 - k) + Math.sign(mv) * off * (Math.abs(mv) > 1e-6 ? 1 : 0), z0 + 0.9)
    qf(win, W0, W1, [W1[0], W1[1], z0 + 2.0], [W0[0], W0[1], z0 + 2.0], n)
  }
  // Hip roof with a 0.35 m overhang, ridge along the long axis.
  const o = 0.35, H = hu + o, V = hv + o, ins = Math.min(H, V) - 0.05
  const e = z0 + WALL, r = z0 + RIDGE
  const base = [P(-H, -V, e), P(H, -V, e), P(H, V, e), P(-H, V, e)]
  const top = [P(-H + ins, -V + ins, r), P(H - ins, -V + ins, r), P(H - ins, V - ins, r), P(-H + ins, V - ins, r)]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const m: V3 = [(base[i][0] + base[j][0]) / 2 - c[0], (base[i][1] + base[j][1]) / 2 - c[1], 1.2]
    qf(cotRoof, base[i], base[j], top[j], top[i], m)
  }
  qf(cotRoof, top[0], top[1], top[2], top[3], [0, 0, 1])
  // Eave soffit.
  qf(cotRoof, base[0], base[1], base[2], base[3], [0, 0, -1])
}

for (const pts of Object.values(COTTAGES)) cottage(boxOf(pts))

// ------------------------------------------------- hotel office and arch ----
// The two hotel buildings on shore (relation/19743905), as rectangles in the
// pier frame, on the street at 7.0 m; walls from the beach (they sink into
// the bluff on the map) to eaves at 12.3 m, hip roofs to 14.5 m.
const STREET = 7.0, EAVE = 12.3, TOP = 14.5
const OFFICES = [rect(137.0, 146.5, -0.9, 18.2), rect(136.4, 142.7, 18.2, 22.4), rect(137.6, 148.5, -35.3, -9.2)]
for (const r of OFFICES) {
  cbox(white, r, 2, EAVE, { top: false })
  hip(roof, { x0: r.x0 - 0.4, x1: r.x1 + 0.4, y0: r.y0 - 0.4, y1: r.y1 + 0.4 }, EAVE, TOP, 2.6)
  // Window bands on the long faces (two storeys), and on the street end.
  for (const [y, s] of [[r.y0 - 0.04, -1], [r.y1 + 0.04, 1]] as const) {
    if (r.x1 - r.x0 < 8) continue
    for (const z of [STREET + 0.9, STREET + 3.3]) qf(win, [r.x0 + 1.2, y, z], [r.x1 - 1.2, y, z], [r.x1 - 1.2, y, z + 1.5], [r.x0 + 1.2, y, z + 1.5], [0, s, 0])
  }
  for (const z of [STREET + 0.9, STREET + 3.3]) {
    const yy0 = r.y0 + 1.5, yy1 = r.y1 - 1.5
    if (yy1 - yy0 < 2) continue
    qf(win, [r.x1 + 0.04, yy0, z], [r.x1 + 0.04, yy1, z], [r.x1 + 0.04, yy1, z + 1.5], [r.x1 + 0.04, yy0, z + 1.5], [1, 0, 0])
  }
}
// The arch: a white wall across the 8.3 m gap between them, 2.5 m thick,
// 6.8 m high, with a semicircular opening of 3.2 m radius springing 2.6 m up.
{
  const u0 = 140.5, u1 = 143.0, v0 = -9.2, v1 = -0.9, vc = (v0 + v1) / 2, R = 3.2, zs = STREET + 2.6, zt = STREET + 6.8
  const SEG = 10
  const arcPt = (k: number): [number, number] => { const t = Math.PI * (1 - k / SEG); return [vc + R * Math.cos(t), zs + R * Math.sin(t)] }
  for (const [u, s] of [[u0, -1], [u1, 1]] as const) {
    const n: V3 = [s, 0, 0]
    qf(white, [u, v0, 2], [u, vc - R, 2], [u, vc - R, zt], [u, v0, zt], n)
    qf(white, [u, vc + R, 2], [u, v1, 2], [u, v1, zt], [u, vc + R, zt], n)
    for (let k = 0; k < SEG; k++) {
      const [va, za] = arcPt(k), [vb, zb] = arcPt(k + 1)
      qf(white, [u, va, za], [u, vb, zb], [u, vb, zt], [u, va, zt], n)
    }
  }
  // Intrados and the opening's jambs, facing into the opening.
  for (let k = 0; k < SEG; k++) {
    const [va, za] = arcPt(k), [vb, zb] = arcPt(k + 1), vm = (va + vb) / 2, zm = (za + zb) / 2
    qf(white, [u0, va, za], [u1, va, za], [u1, vb, zb], [u0, vb, zb], [0, vc - vm, zs - zm])
  }
  qf(white, [u0, vc - R, 2], [u1, vc - R, 2], [u1, vc - R, zs], [u0, vc - R, zs], [0, 1, 0])
  qf(white, [u0, vc + R, 2], [u1, vc + R, 2], [u1, vc + R, zs], [u0, vc + R, zs], [0, -1, 0])
  qf(white, [u0, v0, zt], [u1, v0, zt], [u1, v1, zt], [u0, v1, zt], [0, 0, 1])
}
// The two towers at the arch's sides, on the office roofs: 3.6 m square,
// to 17.7 m, an arcade of two arched openings a face, a low hip cap.
for (const vc of [-11.2, 1.1]) {
  const r = rect(140.0, 143.6, vc - 1.8, vc + 1.8), z1 = 17.0
  cbox(white, r, EAVE - 0.5, z1, { top: false })
  hip(roof, { x0: r.x0 - 0.35, x1: r.x1 + 0.35, y0: r.y0 - 0.35, y1: r.y1 + 0.35 }, z1, 17.7, 1.2)
  const za = z1 - 2.5, zb = z1 - 0.6
  for (const [y, s] of [[r.y0 - 0.04, -1], [r.y1 + 0.04, 1]] as const)
    qf(win, [r.x0 + 0.5, y, za], [r.x1 - 0.5, y, za], [r.x1 - 0.5, y, zb], [r.x0 + 0.5, y, zb], [0, s, 0])
  for (const [x, s] of [[r.x0 - 0.04, -1], [r.x1 + 0.04, 1]] as const)
    qf(win, [x, r.y0 + 0.5, za], [x, r.y1 - 0.5, za], [x, r.y1 - 0.5, zb], [x, r.y0 + 0.5, zb], [s, 0, 0])
}

// ---------------------------------------------------------------- output ----
// Colours from the daylight photos, pulled to the palette's lightness:
// white clapboard and stucco; slate-blue cottage roofs; grey office roofs
// (the palette's roof); weathered brown timber.
await save('sd-crystal-pier', 'Crystal Pier', [
  { part: white, material: finish('crystal-white', 0xf3f0e8) },
  { part: timber, material: finish('crystal-timber', 0x8c7660) },
  { part: cotRoof, material: finish('crystal-cottage-roof', 0x6f8099) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
], { bearing: 345.1, elevation: 0 }, 6500)
