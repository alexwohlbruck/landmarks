/**
 * Brookfield Place (the World Financial Center), Battery Park City, New York
 * (1985–88, Cesar Pelli) — four office towers and the Winter Garden —
 * original procedural geometry, CC0-1.0.
 * bun generators/nyc-brookfield-place.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Bearing 0: every plan is OSM's, turned into its tower's own grid
 * (16.3–16.5° for the two Liberty Street towers, 29° for the two on Vesey
 * Street and the Winter Garden). Anchor 40.7126, -74.0153, between 225
 * Liberty and the Winter Garden.
 *
 * Identity (photos below):
 *  1. Four granite-and-glass towers whose glass share grows with height:
 *     punched windows in pink-tan granite low down, nearly all glass at the
 *     top.                                            (evening, ferry, wfc3)
 *  2. A copper-green crown on each, all different:    (evening, aerial)
 *       200 Liberty (One WFC)   a truncated pyramid, 176 m
 *       225 Liberty (Two WFC)   a dome, 197 m
 *       200 Vesey (Three WFC)   a pyramid, 225.4 m (the tallest)
 *       250 Vesey (Four WFC)    a stepped pyramid, 152 m
 *  3. Setbacks: a wide lower block to 100 m, the shaft, then a tier with
 *     notched corners under the crown.                 (OSM parts, aerial)
 *  4. The Winter Garden: a glass barrel vault between Two and Three, its
 *     arched end to the river, palms inside.            (evening, wg1, wg2)
 *  5. Small copper domes over the Liberty towers' octagonal lobbies on
 *     the river side.                                  (aerial)
 *
 * Plans and heights: OSM relations 2105001 (One), 2105202 (Two), 2845099
 * (Three), 11518965 (250 Vesey) with every building:part, and way/277919050
 * (Winter Garden). OSM's tier heights match the published heights above.
 * Lidar (USGS NJ_SdL5 2014, which covers only the river edge of the site)
 * confirms 250 Vesey's tiers (100, 133, 140 m, top about 153 m) and the
 * Winter Garden's vault crown at about 38 m; the other three towers lie
 * outside it.
 *
 * Simplified or estimated: each tier is a rectangle (OSM's tiers are
 * rectangles to within a metre); the lower blocks' small setbacks between
 * 40 and 100 m are merged into one block; corner notches are one size per
 * tier; the podiums are each tower's OSM outline extruded to 40 m (OSM's
 * podium parts); the glass share by height is read from the photos; the
 * Winter Garden vault springs at 14 m with a semicircle over its 47 m span
 * (estimated, to meet the 37–38 m crown), runs the 68 m length of OSM's
 * outline, and holds two rows of palms and the east stair (estimated count
 * and size). Two's dome is a spherical cap 15 m high on a 23 m radius.
 *
 * Photos (evidence, Wikimedia Commons):
 *  evening "World Financial Center Evening.jpg", WiNG, CC BY 3.0
 *  ferry   "View of Manhattan from Liberty Island ferry, NYC, 20231003 1627
 *          2026.jpg", Jakub Hałun, CC BY 4.0
 *  aerial  "World Trade Center photomontage, aerial view.jpg",
 *          CrossingLights, CC BY 4.0
 *  wfc3    "3 World Financial Center.jpg", Aude, CC BY-SA 2.5
 *  bp3     "Brookfield Place New York August 2017 003.jpg", King of Hearts,
 *          CC BY-SA 4.0
 *  wg1     "Winter Garden Atrium January 2017 02.jpg", Arild Vågen,
 *          CC BY-SA 4.0
 *  wg2     "Winter Garden Atrium 144.jpg", Kidfly182, CC BY 4.0
 */
import { Part, type V3, cross, sub } from './mesh'
import { PALETTE, finish } from './palette'
import { ccw, edgePanels, prism, save, wall, type XY } from './atl-flatiron-building'

const granite = new Part(), win = new Part(), copper = new Part(), glass = new Part(), trim = new Part(), roof = new Part()

const PODIUM = 40

// ── Podiums: the OSM outlines, extruded ──
const podiums: XY[][] = [
  // One WFC (way/157389380)
  [[-32.2, -151.4], [-38.8, -166.0], [-33.3, -181.2], [-32.3, -181.5], [-35.4, -192.0], [-45.7, -188.9], [-63.0, -247.5], [-58.7, -248.8], [-8.0, -263.9], [-3.9, -265.1], [2.2, -244.7], [3.5, -245.1], [5.3, -242.0], [8.8, -230.6], [8.5, -230.5], [8.8, -227.2], [7.6, -226.8], [13.7, -206.3], [3.3, -203.2], [7.3, -189.9], [-4.1, -182.7], [-1.9, -177.9], [-0.1, -174.1], [1.6, -170.4], [2.8, -167.7], [-2.6, -152.6], [-5.9, -151.1], [-12.8, -148.0], [-17.2, -146.1]],
  // Two WFC (way/75309461)
  [[-8.7, -82.2], [-1.2, -85.5], [-8.4, -101.3], [-3.1, -116.4], [0.7, -118.2], [7.6, -121.3], [11.2, -122.9], [26.0, -117.5], [32.8, -103.1], [27.7, -88.0], [26.0, -87.5], [33.9, -59.9], [27.9, -55.1], [33.5, -35.4], [39.2, -33.6], [44.3, -15.7], [41.2, -9.4], [34.6, -6.0], [39.9, 12.8], [36.1, 20.1], [27.8, 24.2], [20.5, 20.6], [19.3, 16.4], [-40.1, 50.5], [-42.5, 46.0], [-61.9, 10.3], [-67.5, 1.8], [-49.0, -8.7], [-56.3, -36.6], [-29.7, -44.1], [-27.6, -48.0], [-20.6, -51.1], [-14.0, -51.9], [-10.2, -51.7], [-9.7, -49.8], [-5.6, -51.0], [-13.8, -79.9]],
  // Three WFC (way/277919047)
  [[51.9, 147.3], [59.0, 142.9], [82.6, 128.1], [74.9, 102.1], [78.4, 97.7], [73.3, 79.8], [67.1, 76.7], [59.4, 77.2], [53.6, 58.2], [45.7, 53.7], [21.5, 64.6], [23.0, 67.3], [11.2, 73.8], [12.6, 76.2], [-11.8, 89.5], [16.2, 140.7], [11.7, 143.2], [10.8, 149.9], [15.0, 157.1], [22.5, 159.5], [25.9, 157.6], [27.7, 160.7]],
  // 250 Vesey (way/793889288)
  [[13.3, 154.2], [2.4, 161.0], [-7.9, 166.7], [-10.6, 167.1], [-8.9, 170.1], [-11.1, 178.2], [-13.2, 179.5], [-11.0, 184.1], [-35.2, 198.8], [-42.8, 202.1], [-73.2, 221.1], [-89.2, 192.3], [-114.2, 147.2], [-99.2, 139.0], [-89.0, 133.3], [-19.9, 95.1], [-16.1, 93.1], [-16.8, 91.9], [-11.8, 89.5], [16.2, 140.7], [11.7, 143.2], [10.8, 149.9]],
].map((r) => ccw(r as XY[]))
const PODIUM_PANELS = { group: 18, gap: 4, bay: 10, pier: 4, margin: 1.5, min: 7 }
for (const r of podiums) {
  prism(granite, r, 0, PODIUM, roof, 0.5)
  for (let i = 0; i < r.length; i++) edgePanels(win, r[i], r[(i + 1) % r.length], 3, PODIUM - 1, PODIUM_PANELS)
}
// One WFC's low river annex (way/274801265), 5 m.
prism(granite, ccw([[-58.7, -248.8], [-66.2, -273.8], [-56.3, -276.7], [-41.0, -281.1], [-29.4, -282.7], [-15.4, -288.7], [-8.0, -263.9]]), 0, 5, roof, 0.3)

// ── Towers ──
type Tier = { z0: number; z1: number; hu: number; hv: number; notch?: number }
type Crown =
  | { kind: 'trunc'; z0: number; z1: number; hu: number; hv: number; tu: number; tv: number }
  | { kind: 'pyramid'; z0: number; z1: number; hu: number; hv: number }
  | { kind: 'dome'; z0: number; z1: number; r: number }
  | { kind: 'steps'; steps: Tier[] }
type Tower = { c: XY; ang: number; tiers: Tier[]; crown: Crown }

/** A tier's plan in the tower's grid: a rectangle, its corners notched. */
function plan(t: Tier): XY[] {
  const { hu, hv } = t, n = t.notch ?? 0
  if (!n) return [[-hu, -hv], [hu, -hv], [hu, hv], [-hu, hv]]
  return [[-hu + n, -hv], [hu - n, -hv], [hu - n, -hv + n], [hu, -hv + n], [hu, hv - n], [hu - n, hv - n], [hu - n, hv], [-hu + n, hv], [-hu + n, hv - n], [-hu, hv - n], [-hu, -hv + n], [-hu + n, -hv + n]]
}

const towers: Tower[] = [
  { // One WFC, 200 Liberty
    c: [-25.0, -227.1], ang: 16.3,
    tiers: [{ z0: 0, z1: 100, hu: 27.7, hv: 28.1 }, { z0: 100, z1: 147, hu: 22.7, hv: 23.2 }, { z0: 147, z1: 155, hu: 22.7, hv: 23.2, notch: 5.8 }, { z0: 155, z1: 162, hu: 19.3, hv: 19.8 }],
    crown: { kind: 'trunc', z0: 162, z1: 176, hu: 16.9, hv: 17.4, tu: 8.4, tv: 9.0 },
  },
  { // Two WFC, 225 Liberty
    c: [-11.7, -10.8], ang: 16.5,
    tiers: [{ z0: 0, z1: 100, hu: 33.8, hv: 35.0 }, { z0: 100, z1: 158, hu: 28.8, hv: 30.0 }, { z0: 158, z1: 172, hu: 28.8, hv: 30.0, notch: 6.0 }, { z0: 172, z1: 182, hu: 24.8, hv: 26.0 }],
    crown: { kind: 'dome', z0: 182, z1: 197, r: 23 },
  },
  { // Three WFC, 200 Vesey
    c: [35.1, 106.7], ang: 28.9,
    tiers: [{ z0: 0, z1: 100, hu: 32.3, hv: 33.2 }, { z0: 100, z1: 181, hu: 28.3, hv: 29.4 }, { z0: 181, z1: 191, hu: 28.3, hv: 29.4, notch: 8.5 }, { z0: 191, z1: 198, hu: 24.4, hv: 26.0 }],
    crown: { kind: 'pyramid', z0: 198, z1: 225.4, hu: 21.3, hv: 22.6 },
  },
  { // Four WFC, 250 Vesey
    c: [-61.7, 163.7], ang: 29.0,
    tiers: [{ z0: 0, z1: 100, hu: 32.0, hv: 31.7 }, { z0: 100, z1: 124, hu: 28.5, hv: 28.2 }, { z0: 124, z1: 133, hu: 28.5, hv: 28.2, notch: 9.3 }, { z0: 133, z1: 140, hu: 24.0, hv: 23.7 }],
    crown: { kind: 'steps', steps: [{ z0: 140, z1: 145, hu: 21.0, hv: 20.7 }, { z0: 145, z1: 149, hu: 18.5, hv: 18.3 }, { z0: 149, z1: 152, hu: 16.5, hv: 16.3 }] },
  },
]

for (const T of towers) {
  const b = (T.ang * Math.PI) / 180, U: XY = [Math.cos(b), -Math.sin(b)], V: XY = [Math.sin(b), Math.cos(b)]
  const to = ([u, v]: XY): XY => [T.c[0] + u * U[0] + v * V[0], T.c[1] + u * U[1] + v * V[1]]
  const P3 = (u: number, v: number, z: number): V3 => { const [x, y] = to([u, v]); return [x, y, z] }
  const top = T.crown.kind === 'steps' ? T.crown.steps[0].z0 : T.crown.z0
  for (const t of T.tiers) {
    const ring = plan(t).map(to)
    prism(granite, ring, t.z0, t.z1, roof, 0.5)
    // Glass share grows with height: narrow punched panels low down, wide
    // ones near the top, and the top tiers in tighter storey groups.
    const z0 = Math.max(t.z0, PODIUM) + 1.5, z1 = t.z1 - 1.5
    if (z1 - z0 < 3) continue
    const f = 0.3 + 0.6 * Math.min(1, ((z0 + z1) / 2 / top) ** 2)
    const high = (z0 + z1) / 2 > top * 0.75
    const o = { group: high ? 9 : 16, gap: high ? 0.9 : 2.0, bay: 9, pier: 9 * (1 - f), margin: 1.0, min: 4 }
    for (let i = 0; i < ring.length; i++) edgePanels(win, ring[i], ring[(i + 1) % ring.length], z0, z1, o)
  }
  // The crown, in copper.
  const C = T.crown
  if (C.kind === 'steps') {
    for (const s of C.steps) prism(copper, plan(s).map(to), s.z0, s.z1, copper, 0.4)
  } else if (C.kind === 'dome') {
    // a spherical cap over a short copper drum
    const n = 16, h = C.z1 - C.z0 - 1.5, R = (C.r * C.r + h * h) / (2 * h), zc = C.z1 - R
    const ring = (r: number, z: number): V3[] => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return P3(r * Math.cos(a), r * Math.sin(a), z) })
    copper.loft([ring(C.r, C.z0), ring(C.r, C.z0 + 1.5)])
    const rows = 5
    const rings = Array.from({ length: rows }, (_, k) => { const r = C.r * (1 - k / rows); return ring(r, zc + Math.sqrt(R * R - r * r)) })
    copper.loft(rings)
    const apex = P3(0, 0, C.z1), last = rings[rows - 1]
    for (let i = 0; i < n; i++) copper.tri(last[i], last[(i + 1) % n], apex)
  } else {
    const tu = C.kind === 'trunc' ? C.tu : 0, tv = C.kind === 'trunc' ? C.tv : 0
    const base = [P3(-C.hu, -C.hv, C.z0), P3(C.hu, -C.hv, C.z0), P3(C.hu, C.hv, C.z0), P3(-C.hu, C.hv, C.z0)]
    if (C.kind === 'pyramid') {
      const apex = P3(0, 0, C.z1)
      for (let i = 0; i < 4; i++) copper.tri(base[i], base[(i + 1) % 4], apex)
    } else {
      const topR = [P3(-tu, -tv, C.z1), P3(tu, -tv, C.z1), P3(tu, tv, C.z1), P3(-tu, tv, C.z1)]
      copper.loft([base, topR])
      copper.cap(topR, true)
    }
  }
}

// The Liberty towers' copper-domed octagonal lobbies on the river side
// (OSM 274796775/274796776: drum to 42 m, dome to 50 m).
for (const [c, r] of [[[-17.6, -166.1], 15.0], [[12.7, -102.0], 15.3]] as [XY, number][]) {
  const n = 12
  const ring = (rr: number, z: number): V3[] => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return [c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a), z] })
  copper.loft([ring(r, PODIUM), ring(r, PODIUM + 2), ring(r * 0.8, PODIUM + 6), ring(r * 0.45, PODIUM + 8.6)])
  copper.cap(ring(r * 0.45, PODIUM + 8.6), true)
}

// ── The Winter Garden ──
// A glass barrel vault on its OSM outline's grid (29.4°): 68 m along u,
// 47 m span across v, vertical glass to 14 m, then a semicircle.
{
  const b = (29.4 * Math.PI) / 180, U: XY = [Math.cos(b), -Math.sin(b)], V: XY = [Math.sin(b), Math.cos(b)], c: XY = [2.0, 53.1]
  const P3 = (u: number, v: number, z: number): V3 => [c[0] + u * U[0] + v * V[0], c[1] + u * U[1] + v * V[1], z]
  const HU = 34, HV = 23.5, SPRING = 14, n = 12
  const prof: [number, number][] = [[-HV, 0], ...Array.from({ length: n + 1 }, (_, i) => { const a = Math.PI - (i / n) * Math.PI; return [HV * Math.cos(a), SPRING + HV * Math.sin(a)] as [number, number] }), [HV, 0]]
  // the vault skin, both ends' arched glass walls
  for (let i = 0; i < prof.length - 1; i++) {
    const [v0, z0] = prof[i], [v1, z1] = prof[i + 1]
    glass.quad(P3(-HU, v0, z0), P3(-HU, v1, z1), P3(HU, v1, z1), P3(HU, v0, z0))
  }
  for (const u of [-HU, HU]) for (let i = 0; i < prof.length - 1; i++) glass.tri(P3(u, 0, 0), P3(u, prof[i][0], prof[i][1]), P3(u, prof[i + 1][0], prof[i + 1][1]))
  // The steel frame, drawn as solid white members about 0.5 m square (a
  // little heavier than the real ones so the grid reads from the street):
  // arched ribs every 11.3 m (budget: the file sits at the 250 KB cap), purlins along the vault at every other facet line,
  // and mullions and a transom on both glazed ends.
  const out = (v: number, z: number): [number, number] => {
    if (z <= SPRING) return [Math.sign(v), 0]
    const k = Math.hypot(v, z - SPRING) || 1
    return [v / k, (z - SPRING) / k]
  }
  /** A quad wound to face `want`. */
  const faced = (q: V3[], want: V3) => {
    const nrm = cross(sub(q[1], q[0]), sub(q[2], q[0]))
    if (nrm[0] * want[0] + nrm[1] * want[1] + nrm[2] * want[2] >= 0) trim.quad(q[0], q[1], q[2], q[3])
    else trim.quad(q[3], q[2], q[1], q[0])
  }
  const DO = 0.45, DI = -0.1, W = 0.25 // outer face, inner edge (just inside the skin), half-width
  const off = (u: number, v: number, z: number, d: number) => { const [a, bz] = out(v, z); return P3(u, v + a * d, z + bz * d) }
  const dir = (u: number, v: number, z: number) => sub(P3(u, v, z), P3(0, 0, 0))
  // arched ribs: outer face and both sides
  for (let k = 0; k <= 6; k++) {
    const u = -HU + (k * 2 * HU) / 6
    for (let i = 0; i < prof.length - 1; i++) {
      const [v0, z0] = prof[i], [v1, z1] = prof[i + 1], [am, bm] = out((v0 + v1) / 2, (z0 + z1) / 2)
      // the outer face smooth-shaded along the arc, so segments share corners
      const n0 = dir(0, ...out(v0, z0)), n1 = dir(0, ...out(v1, z1))
      const q = [off(u - W, v0, z0, DO), off(u + W, v0, z0, DO), off(u + W, v1, z1, DO), off(u - W, v1, z1, DO)]
      trim.tri(q[0], q[1], q[2], undefined, undefined, undefined, [n0, n0, n1])
      trim.tri(q[0], q[2], q[3], undefined, undefined, undefined, [n0, n1, n1])
      void am; void bm; void DI
      for (const s of [-1, 1]) faced([off(u + s * W, v0, z0, DI), off(u + s * W, v1, z1, DI), off(u + s * W, v1, z1, DO), off(u + s * W, v0, z0, DO)], dir(s, 0, 0))
    }
  }
  // purlins along the vault at every other facet line (outer face only)
  for (let i = 1; i < prof.length - 1; i += 2) {
    const [v, z] = prof[i], [a, bz] = out(v, z), t: [number, number] = [-bz, a] // along the arc
    const at = (u: number, e: number, d: number) => P3(u, v + a * d + t[0] * e, z + bz * d + t[1] * e)
    faced([at(-HU, -W, DO), at(HU, -W, DO), at(HU, W, DO), at(-HU, W, DO)], dir(0, a, bz))
  }
  // the glazed ends: mullions and a transom at the springing
  const heightAt = (v: number) => SPRING + Math.sqrt(Math.max(0, HV * HV - v * v))
  for (const u of [-HU, HU]) {
    const o = Math.sign(u) * (W + 0.05)
    for (const v of [-15.7, -7.8, 0, 7.8, 15.7]) {
      const r = [[u + o - W, v - W], [u + o + W, v - W], [u + o + W, v + W], [u + o - W, v + W]].map(([a, bb]) => { const p = P3(a, bb, 0); return [p[0], p[1]] as XY })
      prism(trim, ccw(r), 0, heightAt(v + Math.sign(v) * W) - 0.2, null, 0)
    }
    const tr = [[u + o - W, -HV], [u + o + W, -HV], [u + o + W, HV], [u + o - W, HV]].map(([a, bb]) => { const p = P3(a, bb, 0); return [p[0], p[1]] as XY })
    prism(trim, ccw(tr), SPRING - 0.3, SPRING + 0.3, trim, 0, true)
  }
  for (const v of [-HV, HV]) prism(trim, [[-HU, v - 0.4], [HU, v - 0.4], [HU, v + 0.4], [-HU, v + 0.4]].map(([u, vv]) => { const p = P3(u, vv, 0); return [p[0], p[1]] as XY }), 0, 1.2, trim, 0.1)
  // inside: two rows of palms (thinned, and the east stair dropped: the darker glass hides most of them)
  for (const v of [-9, 9]) for (let k = 0; k < 3; k++) {
    const u = -22 + k * 18
    const t = [[u - 0.3, v - 0.3], [u + 0.3, v - 0.3], [u + 0.3, v + 0.3], [u - 0.3, v + 0.3]].map(([a, bb]) => { const p = P3(a, bb, 0); return [p[0], p[1]] as XY })
    wall(trim, t, 0, 11)
    const crown = [P3(u - 2.4, v, 11), P3(u, v - 2.4, 11), P3(u + 2.4, v, 11), P3(u, v + 2.4, 11)], apex = P3(u, v, 13)
    for (let i = 0; i < 4; i++) copper.tri(crown[i], crown[(i + 1) % 4], apex)
  }
}



await save('nyc-brookfield-place', 'Brookfield Place', [
  { part: granite, material: finish('bp-granite', 0xdcc2a2) },
  { part: win, material: PALETTE.window },
  { part: copper, material: { ...PALETTE.copper, floodlight: (p, n) => (p[2] > 130 && n[2] < 0.9 ? 0.6 : 0) } },
  { part: glass, material: { name: 'glass', color: 0x3f6f8c, roughness: 0.24, opacity: 0.62, doubleSided: true } },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
], { height: 225.4, anchor: [40.7126, -74.0153], bearing: 0 }, 6500)
