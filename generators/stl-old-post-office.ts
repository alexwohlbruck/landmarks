/**
 * Old Post Office (United States Customhouse and Post Office), 815 Olive St,
 * St. Louis (1873–1884; Alfred B. Mullett; a National Historic Landmark) —
 * original procedural geometry, CC0-1.0.  bun generators/stl-old-post-office.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 17.2, the street grid: -y is the Olive St front,
 * where the dome stands. Anchor = the centroid of OSM way/42323065,
 * -90.1928002, 38.6291114.
 *
 * Identity (from the photos below):
 *  1. The great square mansard dome on the Olive St front: a curved,
 *     four-sided dome with round dormers, over a pedimented pavilion
 *     crowned by a sculpture group, and a balustraded top.       (p1, p4)
 *  2. A Second Empire block of grey granite: a rusticated arcaded base,
 *     three storeys of paired columns with pedimented windows, a heavy
 *     cornice; a pedimented pavilion in the middle of every side and
 *     projecting corners; a low hipped roof.                     (p1, p3)
 *  3. Stairs up to the arcaded base at the corners and pavilions.     (p1)
 *
 * Plan: OSM way/42323065 turned to bearing 17.2: 74 x 58 m; the middle
 * pavilions project 1–2 m (x ±9 on the north and south, y -9..9 on the
 * east and west); the dome stands over x -10..12, y -28..-10. OSM tags no
 * parts; the two building=roof ways nearby are canopies off the site.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018 (flown 2017),
 * 1 m grid with class 18 kept; y = 0 is the pavement (1.3 m over the box's
 * ground_min). Measured: the cornice 26.0, the hip roof to 29.5, the
 * pavilions' pediments 31–33, the dome's foot 36, its shoulder 43.5 and top
 * 44.6, the crowning group 46.1 (OSM height 38 is the hip roof's
 * neighbourhood, not the dome). A light court 10 m below the roof in the
 * middle (x -8..6, y -4..10).
 * Estimated from p1 (HABS, from the north-east): the base (to 7.5), the
 * three upper storeys' window grid (bays ~3.7 m, a panel a storey pair),
 * the pediments' pitch, the dome's curve and dormers, the corner stairs.
 * Left out: the columns (drawn as pale piers between the window panels),
 * the eagle group's detail, the chimneys.
 *
 * Review round 1: paired engaged columns at every bay line in both storey
 * bands; the base in the pink-grey granite; the dome made convex (it
 * swells 1.4 m past the drum, p1) with bigger round-headed dormers. The
 * other pavilions carry pediments, not mansards, in every photo (p1, p3),
 * so they keep them.
 *
 * Night: the granite fronts are floodlit; windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  p1  "US Customhouse and post office St Louis.jpg", Piaget (HABS), public domain
 *  p2  "Old Post Office, Saint Louis.jpg", Zmerkle13, CC BY-SA 4.0
 *  p3  "Old Post Office from 9th St..JPG", BirgitteSB, CC BY-SA 3.0 (the 9th St side)
 *  p4  "Old United States Customhouse and Post Office, Olive Street, St. Louis, MO", Warren LeMay,
 *      CC BY-SA 2.0
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, cornice, hipRoof, onWall, prism, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { ccw, edgePanels } from './atl-flatiron-building'

const gran = new Part(), pier = new Part(), win = new Part(), roof = new Part(), slate = new Part(), pink = new Part()
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const tri = (p: Part, a: V3, b: V3, c: V3, out: V3) => {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}

const BASE = 7.5, COR = 26.0, HIP = 29.5
/** A pale square engaged column standing 0.5 m proud of the wall a→b at s (front and sides only). */
const column = (a: XY, b: XY, s: number, z0: number, z1: number, hw = 0.32, out = 0.5) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const P = (u: number, d: number, z: number): V3 => [a[0] + t[0] * u + n[0] * d, a[1] + t[1] * u + n[1] * d, z]
  const N3: V3 = [n[0], n[1], 0], T3: V3 = [t[0], t[1], 0], Tm: V3 = [-t[0], -t[1], 0]
  tri(pier, P(s - hw, out, z0), P(s + hw, out, z0), P(s + hw, out, z1), N3); tri(pier, P(s - hw, out, z0), P(s + hw, out, z1), P(s - hw, out, z1), N3)
  tri(pier, P(s + hw, 0, z0), P(s + hw, out, z0), P(s + hw, out, z1), T3); tri(pier, P(s + hw, 0, z0), P(s + hw, out, z1), P(s + hw, 0, z1), T3)
  tri(pier, P(s - hw, out, z0), P(s - hw, 0, z0), P(s - hw, 0, z1), Tm); tri(pier, P(s - hw, out, z0), P(s - hw, 0, z1), P(s - hw, out, z1), Tm)
}
const OUTER: XY[] = ccw([[-37.0, -28.6], [-13.8, -28.9], [-13.8, -29.9], [-9.2, -30.0], [-9.2, -31.1], [9.0, -31.2], [9.0, -30.1], [13.6, -30.1], [13.6, -29.2], [36.7, -29.4], [36.8, -9.8], [38.4, -9.8], [38.5, 9.1], [37.1, 9.1], [37.2, 28.5], [14.4, 28.7], [14.4, 29.8], [9.3, 29.8], [9.3, 30.9], [-8.9, 31.1], [-8.9, 30.3], [-13.7, 30.4], [-13.7, 29.2], [-36.9, 29.4], [-37.1, 10.1], [-38.1, 10.1], [-38.4, -9.0], [-36.8, -9.0]])

// ── The block ──
prism(pink, OUTER, 0, BASE, null, 0) // the pink-grey granite base (p1, p4)
prism(gran, OUTER, BASE, COR, null, 0)
cornice(pink, OUTER, BASE - 0.6, 0.6, 0.3, null)
cornice(gran, OUTER, 16.6, 0.5, 0.25, null)
cornice(gran, OUTER, COR - 1.3, 1.3, 0.8, null)
hipRoof(roof, -36.9, 36.6, -28.8, 29.3, COR, HIP, 0.4)
// the light court: the roof is open over it (drawn as a dark well top)
box(roof, -8, 6, -4, 10, HIP - 0.4, HIP + 0.05, roof, 0)

// windows: arched in the base, panels with pale piers above (a panel per storey pair)
for (let i = 0; i < OUTER.length; i++) {
  const a = OUTER[i], b = OUTER[(i + 1) % OUTER.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 4) continue
  const n = Math.max(1, Math.round(L / 3.7)), w = L / n
  for (let k = 0; k < n; k++) {
    const c = (k + 0.5) * w
    onWall(win, a, b, archShape(c, 1.6, 1.8, 5.4, 6), 0.06)
    for (const [z0, z1] of [[8.6, 15.6], [17.6, 24.0]]) onWall(win, a, b, rectShape(c - 0.85, c + 0.85, z0, z1), 0.06)
    for (const [z0, z1] of [[11.6, 12.6], [20.6, 21.4]]) onWall(gran, a, b, rectShape(c - 0.85, c + 0.85, z0, z1), 0.1) // the storey band
    // paired engaged columns at every bay line, one pair a storey band (p1, p4)
    if (k > 0) for (const [z0, z1] of [[BASE, 16.6], [17.1, COR - 1.3]]) for (const d of [-0.55, 0.55]) column(a, b, k * w + d, z0, z1)
  }
}

// ── The pediments over the middle pavilions ──
const peds: [XY, XY, number][] = [[[-9.2, -31.1], [9.0, -31.2], 33.0], [[9.3, 30.9], [-8.9, 31.1], 31.5], [[38.4, -9.8], [38.5, 9.1], 31.5], [[-38.1, 10.1], [-38.4, -9.0], 31.5]]
for (const [a, b, top] of peds) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const P = (s: number, d: number, z: number): V3 => [a[0] + t[0] * s + n[0] * d, a[1] + t[1] * s + n[1] * d, z]
  const back = 9
  tri(gran, P(0, 0.4, COR), P(L, 0.4, COR), P(L / 2, 0.4, top), [n[0], n[1], 0])
  tri(roof, P(0, 0.6, COR), P(L / 2, 0.6, top), P(L / 2, -back, top), [-t[0] + n[0] * 0.1, -t[1] + n[1] * 0.1, 1])
  tri(roof, P(0, 0.6, COR), P(L / 2, -back, top), P(0, -back, COR), [-t[0], -t[1], 1])
  tri(roof, P(L, 0.6, COR), P(L / 2, -back, top), P(L / 2, 0.6, top), [t[0] + n[0] * 0.1, t[1] + n[1] * 0.1, 1])
  tri(roof, P(L, 0.6, COR), P(L, -back, COR), P(L / 2, -back, top), [t[0], t[1], 1])
}

// ── The dome over the Olive St pavilion ──
const DC: XY = [1, -19], DH = 9.8
box(gran, DC[0] - DH, DC[0] + DH, DC[1] - DH, DC[1] + DH, COR, 35.0, null, 0)
cornice(gran, rect(DC[0] - DH, DC[0] + DH, DC[1] - DH, DC[1] + DH), 34.0, 1.0, 0.6, null)
for (const [a, b] of [[[DC[0] - DH, DC[1] - DH], [DC[0] + DH, DC[1] - DH]], [[DC[0] + DH, DC[1] - DH], [DC[0] + DH, DC[1] + DH]], [[DC[0] + DH, DC[1] + DH], [DC[0] - DH, DC[1] + DH]], [[DC[0] - DH, DC[1] + DH], [DC[0] - DH, DC[1] - DH]]] as [XY, XY][]) {
  for (const s of [4.8, 9.6, 14.4]) onWall(win, a, b, archShape(s, 1.6, 30.0, 33.2, 6), 0.06)
}
// the curved square dome: four flat-shaded facets on a convex profile (r is the apothem)
const R = (h: number) => h / Math.cos(Math.PI / 4)
// a bulging (convex) mansard: it swells past the drum before curving in (p1, p4)
revolve(slate, DC, [[R(DH + 0.5), 35.0], [R(DH + 1.3), 36.6], [R(DH + 1.4), 38.4], [R(DH + 0.8), 40.4], [R(DH - 0.8), 42.3], [R(DH - 3.4), 43.8], [R(DH - 6.4), 44.5], [R(3.0), 44.6]], 4, Math.PI / 4, true, false)
// round dormers on each face of the dome
for (let k = 0; k < 4; k++) {
  const ang = (k * Math.PI) / 2, u: XY = [Math.cos(ang), Math.sin(ang)], v: XY = [-u[1], u[0]]
  for (const s of [-4.0, 0, 4.0]) {
    const c: XY = [DC[0] + u[0] * (DH + 1.6) + v[0] * s, DC[1] + u[1] * (DH + 1.6) + v[1] * s]
    box(gran, c[0] - 0.9, c[0] + 0.9, c[1] - 0.9, c[1] + 0.9, 36.6, 39.4, gran, 0.3)
    const f0: XY = [c[0] + u[0] * 0.95 - v[0] * 0.9, c[1] + u[1] * 0.95 - v[1] * 0.9], f1: XY = [c[0] + u[0] * 0.95 + v[0] * 0.9, c[1] + u[1] * 0.95 + v[1] * 0.9]
    onWall(win, f0, f1, archShape(0.9, 1.0, 37.0, 38.4, 6), 0.03) // the dormer's round-headed light
  }
}
// the balustraded top and the crowning sculpture group
box(gran, DC[0] - 3.2, DC[0] + 3.2, DC[1] - 3.2, DC[1] + 3.2, 44.4, 45.2, roof, 0.1)
box(gran, DC[0] - 1.0, DC[0] + 1.0, DC[1] - 1.0, DC[1] + 1.0, 45.2, 46.1, gran, 0.3)

// ── Stairs at the corners and pavilions (the base's floor is ~1.5 m up) ──
for (const [x0, x1, y0, y1] of [[-30, -16, -32.4, -28.6], [15, 29, -32.4, -29.2], [-30, -16, 29.2, 32.6], [15, 29, 28.6, 32.6]]) box(gran, x0, x1, y0, y1, 0, 1.5, gran, 0.05)

const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.05 : p[2] > 36 ? 0.7 : 0.6)
await save('stl-old-post-office', 'Old Post Office', [
  { part: gran, material: { ...finish('stl-opo-granite', 0xb9b6ad), floodlight: lit } },
  { part: pier, material: { ...finish('stl-opo-columns', 0xe4e1d8), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: slate, material: { ...finish('stl-opo-slate', 0x7d8389), floodlight: () => 0.5 } },
  { part: pink, material: { ...finish('stl-opo-pink-granite', 0xc2aba3), floodlight: lit } },
], { height: 46.1, anchor: [38.6291114, -90.1928002], bearing: 17.2 }, 6500)
