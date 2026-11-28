/**
 * St. Louis City Hall, 1200 Market St at Tucker Blvd (1890–1904; George R.
 * Mann and Harvey Ellis; after the Hôtel de Ville, Paris) — original
 * procedural geometry, CC0-1.0.  bun generators/stl-city-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 17.2, the street grid: -y is the Market St front,
 * +x the Tucker Blvd side; the building is 66 m across and 118 m deep.
 * Anchor = the centroid of the outer ring of OSM relation/11088391,
 * -90.1994053, 38.6268038.
 *
 * Identity (from the photos below):
 *  1. Steep red-tile hipped roofs over every range, tall pyramidal roofs on
 *     square pavilions at the four corners and in the middle of each long
 *     side, a row of tall stone dormers with pinnacled tops.      (p1, p2)
 *  2. Buff brick and stone above a two-storey pink granite base; the Market
 *     St front with a round-arched entrance in a centre bay.          (p1)
 *  3. Wings round four light courts, a lower spine between them.
 *                                                   (OSM inners, lidar)
 *
 * Note on the brief: it mentions a central tower with a tall pyramidal or
 * lantern roof. Neither the photos nor the lidar (highest return 36.5 m
 * above the ground) show one; the tallest roofs are the two pavilions in
 * the middle of the long sides. The model follows the evidence.
 *
 * Plan: OSM relation/11088391 (outer way/802291931, four court rings) turned
 * to bearing 17.2: corner pavilions 18 m square at x ±13..31, y ±41..59;
 * long ranges x ±14..27.6 between them; the middle pavilions projecting to
 * x ±33.5 for y -16..17; a cross range y -16..15; the courts x ±(3..13),
 * y ±(15..31).
 *
 * Heights: USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018 (flown 2017),
 * 1 m grid with class 18 kept; y = 0 is 1 m over the box's ground_min, the
 * pavement on the west. Measured: eaves 23, range ridges 31, corner
 * pavilion roofs to 34, the middle pavilions' roofs to 36.5, the spine
 * between the courts 19, court floors at 9 (or open to the ground).
 * Estimated from p1 and p2: the granite base (to 9.5), the window grid
 * (bays ~3.6 m, two storeys a panel), the dormers (one or two a face, 3 m
 * wide, to 30 m), the entrance arch.
 * Left out: the oculus dormers, the carved pinnacles' detail, the chimneys.
 *
 * Review round 1: a pair of windows in every bay (3.9 m) of every seen face,
 * two storeys a panel; a stone dormer every ~7.8 m along every seen eave,
 * with a finial; pinnacles on the pavilions' outer corners; the roof
 * pulled to the real darker red-brown.
 *
 * Night: the stone fronts are floodlit softly; windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  p1  "St. Louis City Hall 2023.jpg", Triciaburmeister, CC BY-SA 4.0 (the Market St front)
 *  p2  "St. Louis City Hall 2015.jpg", Lightmetro, CC BY-SA 4.0 (the Tucker Blvd side, elevated)
 *  p3  "St. Louis City Hall, Market Street and Tucker Boulevard, St. Louis, MO.jpg", w_lemay, CC BY-SA 2.0
 *  p4  "St. Louis City Hall, Market Street and Tucker Boulevard, St. Louis, MO - 53123884448.jpg",
 *      w_lemay, CC BY-SA 2.0
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, cornice, hipRoof, onWall, prism, rectShape, save, type XY } from './atl-tech-tower'
import { ccw, edgePanels } from './atl-flatiron-building'

const buff = new Part(), gran = new Part(), tile = new Part(), win = new Part(), door = new Part()
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const EAVE = 23, RIDGE = 31, BASE = 9.5
const triOut = (p: Part, a: V3, b: V3, c: V3, out: V3) => {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}

const OUTER: XY[] = ccw([[-31.0, 59.2], [-31.1, 41.2], [-27.5, 41.1], [-27.7, 17.0], [-33.3, 17.0], [-33.5, -16.3], [-28.4, -16.3], [-28.6, -39.7], [-32.0, -39.7], [-32.2, -58.7], [-13.5, -58.8], [-13.5, -55.6], [-5.7, -55.7], [-4.6, -56.6], [2.7, -56.5], [3.6, -55.7], [11.7, -55.7], [11.7, -58.9], [30.1, -59.0], [30.2, -41.3], [29.1, -41.3], [29.2, -16.6], [32.2, -16.6], [33.1, -9.1], [32.9, 8.1], [32.0, 16.5], [30.1, 16.4], [29.8, 39.3], [31.1, 39.3], [30.9, 59.0], [12.4, 58.8], [12.4, 55.8], [4.1, 55.7], [-0.2, 56.4], [-4.7, 55.8], [-13.0, 55.8], [-13.0, 59.1]])

// ── The granite base: the whole footprint, two storeys ──
prism(gran, OUTER, 0, BASE, buff, 0)
cornice(gran, OUTER, BASE - 0.6, 0.6, 0.25, null)
for (let i = 0; i < OUTER.length; i++) {
  const a = OUTER[i], b = OUTER[(i + 1) % OUTER.length]
  edgePanels(win, a, b, 1.6, BASE - 1.0, { group: 7.0, gap: 1.0, bay: 3.6, pier: 1.5, margin: 1.2, out: 0.05, min: 4 })
}

// ── The ranges and pavilions above the base ──
type R = { x0: number; x1: number; y0: number; y1: number; top: number; kind: 'hip' | 'pyr' }
const parts: R[] = [
  // corner pavilions with tall pyramidal roofs
  { x0: -32.0, x1: -13.3, y0: -58.8, y1: -40.0, top: 34.0, kind: 'pyr' },
  { x0: 11.7, x1: 30.2, y0: -59.0, y1: -40.5, top: 34.0, kind: 'pyr' },
  { x0: -31.0, x1: -13.0, y0: 41.0, y1: 59.1, top: 34.0, kind: 'pyr' },
  { x0: 12.4, x1: 31.0, y0: 40.0, y1: 59.0, top: 34.0, kind: 'pyr' },
  // the end ranges between them
  { x0: -13.5, x1: 11.7, y0: -55.7, y1: -40.0, top: RIDGE, kind: 'hip' },
  { x0: -13.0, x1: 12.4, y0: 40.5, y1: 55.8, top: RIDGE, kind: 'hip' },
  // the long ranges
  { x0: -28.4, x1: -13.5, y0: -40.0, y1: 41.0, top: RIDGE, kind: 'hip' },
  { x0: 12.5, x1: 29.2, y0: -40.5, y1: 40.0, top: RIDGE, kind: 'hip' },
  // the cross range between the courts
  { x0: -13.5, x1: 12.5, y0: -16.0, y1: 15.0, top: RIDGE, kind: 'hip' },
  // the middle pavilions of the long sides, the tallest roofs
  { x0: -33.4, x1: -16.0, y0: -16.3, y1: 17.0, top: 36.5, kind: 'hip' },
  { x0: 15.0, x1: 32.9, y0: -16.6, y1: 16.5, top: 36.5, kind: 'hip' },
]
for (const p of parts) {
  box(buff, p.x0, p.x1, p.y0, p.y1, BASE, EAVE, null, 0)
  cornice(buff, rect(p.x0, p.x1, p.y0, p.y1), EAVE - 0.8, 0.8, 0.4, null)
  hipRoof(tile, p.x0, p.x1, p.y0, p.y1, EAVE, p.top, 0.5)
}
// the low spine between the courts
for (const [y0, y1] of [[15.0, 40.5], [-40.0, -16.0]]) {
  box(buff, -3.8, 2.6, y0, y1, BASE, 19.0, tile, 0.3)
}

// windows in every bay of every seen face of the upper storeys: a window pair a
// bay (p1, p2), drawn as one panel, two storeys a panel (11.0–16.6, 17.4–22.0)
const inPart = (q: XY) => parts.some((r) => q[0] > r.x0 && q[0] < r.x1 && q[1] > r.y0 && q[1] < r.y1)
const partFaces = (r: R): [XY, XY][] => [[[r.x0, r.y0], [r.x1, r.y0]], [[r.x1, r.y0], [r.x1, r.y1]], [[r.x1, r.y1], [r.x0, r.y1]], [[r.x0, r.y1], [r.x0, r.y0]]]
const BAY = 3.9
for (const r of parts) for (const [a, b] of partFaces(r)) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const nb = Math.max(1, Math.round((L - 1.2) / BAY)), w = (L - 1.2) / nb
  for (let k = 0; k < nb; k++) {
    const c = 0.6 + (k + 0.5) * w, q: XY = [a[0] + t[0] * c + n[0] * 0.6, a[1] + t[1] * c + n[1] * 0.6]
    if (inPart(q) || Math.abs(q[0]) < 3.9 && Math.abs(q[1]) < 41) continue // hidden, or on the court spine
    for (const [z0, z1] of [[11.0, 16.6], [17.4, 22.0]]) onWall(win, a, b, rectShape(c - 1.1, c + 1.1, z0, z1), 0.08)
  }
}
// the courts' faces
for (const [x0, x1, y0, y1] of [[2.6, 12.0, 15.0, 30.2], [-13.0, -3.8, 15.1, 30.4], [2.7, 11.9, -31.8, -17.4], [-13.4, -3.9, -32.0, -17.2]]) {
  const r = ccw(rect(x0, x1, y0, y1)).reverse() as XY[] // seen from inside the court
  for (let i = 0; i < 4; i++) edgePanels(win, r[i], r[(i + 1) % 4], BASE + 1.4, EAVE - 1.6, { group: 6.0, gap: 1.4, bay: 3.2, pier: 1.4, margin: 1.0, out: 0.05, min: 4 })
}

// ── Dormers: tall stone gables standing on the eaves, two a pavilion face ──
const dormer = (a: XY, b: XY, s: number) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const P = (u: number, d: number): XY => [a[0] + t[0] * u + n[0] * d, a[1] + t[1] * u + n[1] * d]
  const q = ccw([P(s - 1.6, 0.1), P(s + 1.6, 0.1), P(s + 1.6, -2.6), P(s - 1.6, -2.6)])
  prism(buff, q, EAVE - 1.0, EAVE + 4.6, null, 0)
  // the pinnacled gable top
  const c = P(s, 0.1), cb = P(s, -2.6)
  const g0 = P(s - 1.6, 0.1), g1 = P(s + 1.6, 0.1), h0 = P(s - 1.6, -2.6), h1 = P(s + 1.6, -2.6)
  const Z = EAVE + 4.6, ZT = EAVE + 7.0
  triOut(buff, [g0[0], g0[1], Z], [g1[0], g1[1], Z], [c[0], c[1], ZT], [n[0], n[1], 0])
  triOut(buff, [g1[0], g1[1], Z], [h1[0], h1[1], Z], [cb[0], cb[1], ZT], [t[0], t[1], 1])
  triOut(buff, [g1[0], g1[1], Z], [cb[0], cb[1], ZT], [c[0], c[1], ZT], [t[0], t[1], 1])
  triOut(buff, [h0[0], h0[1], Z], [g0[0], g0[1], Z], [c[0], c[1], ZT], [-t[0], -t[1], 1])
  triOut(buff, [h0[0], h0[1], Z], [c[0], c[1], ZT], [cb[0], cb[1], ZT], [-t[0], -t[1], 1])
  // the finial on the gable's apex
  box(buff, c[0] - 0.3, c[0] + 0.3, c[1] - 0.3, c[1] + 0.3, ZT - 0.6, ZT + 1.2, buff, 0)
  onWall(win, a, b, rectShape(s - 0.8, s + 0.8, EAVE + 0.4, EAVE + 3.8), 0.16)
}
// a stone dormer every other bay along every seen eave (p1, p2), and pinnacles on
// the pavilions' corners
for (const r of parts) for (const [a, b] of partFaces(r)) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const nd = Math.max(1, Math.round((L - 4) / 7.8))
  for (let k = 0; k < nd; k++) {
    const sPos = 2 + ((k + 0.5) * (L - 4)) / nd, q: XY = [a[0] + t[0] * sPos + n[0] * 0.6, a[1] + t[1] * sPos + n[1] * 0.6]
    if (inPart(q) || Math.abs(q[0]) < 3.9 && Math.abs(q[1]) < 41) continue
    dormer(a, b, sPos)
  }
}
for (const r of parts.filter((q) => q.kind === 'pyr' || q.top > 35)) {
  for (const [x, y] of [[r.x0, r.y0], [r.x1, r.y0], [r.x1, r.y1], [r.x0, r.y1]]) {
    const q: XY = [x + (x < 0 ? -0.1 : 0.1), y + (y < 0 ? -0.1 : 0.1)]
    if (inPart([x + (x > (r.x0 + r.x1) / 2 ? 0.6 : -0.6), y]) && inPart([x, y + (y > (r.y0 + r.y1) / 2 ? 0.6 : -0.6)])) continue
    box(buff, q[0] - 0.7, q[0] + 0.7, q[1] - 0.7, q[1] + 0.7, EAVE - 2, EAVE + 5.2, null, 0)
    hipRoof(buff, q[0] - 0.8, q[0] + 0.8, q[1] - 0.8, q[1] + 0.8, EAVE + 5.2, EAVE + 7.6, 0)
  }
}

// ── The Market St entrance: a round arch in a granite surround ──
{
  const a: XY = [-4.6, -56.6], b: XY = [2.7, -56.5], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  box(gran, -6.5, 4.6, -58.0, -56.5, 0, 9.0, gran, 0.2)
  const fa: XY = [-6.5, -58.0], fb: XY = [4.6, -58.0], FL = 11.1
  const arch: [number, number][] = [[FL / 2 - 1.5, 1.5], [FL / 2 + 1.5, 1.5]]
  for (let i = 0; i <= 8; i++) arch.push([FL / 2 + 1.5 * Math.cos((i / 8) * Math.PI), 4.6 + 1.5 * Math.sin((i / 8) * Math.PI)])
  onWall(door, fa, fb, arch, 0.06)
  box(gran, -7.5, 5.6, -60.0, -58.0, 0, 1.5, gran, 0.05) // steps (Market St is ~1.3 m above y = 0 here)
  void L; void a; void b
}

const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0 : 0.4)
await save('stl-city-hall', 'St. Louis City Hall', [
  { part: buff, material: { ...finish('stl-cityhall-buff', 0xdcc49c), floodlight: lit } },
  { part: gran, material: { ...finish('stl-cityhall-granite', 0xc9a497), floodlight: lit } },
  { part: tile, material: finish('stl-cityhall-tile', 0x8f5a4e) },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('stl-cityhall-door', 0x5e4c42) },
], { height: 36.5, anchor: [38.6268038, -90.1994053], bearing: 17.2 }, 6500)
