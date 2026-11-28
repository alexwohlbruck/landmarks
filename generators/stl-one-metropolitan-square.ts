/**
 * One Metropolitan Square, 211 N Broadway, St. Louis (1989; Hellmuth, Obata
 * + Kassabaum), the city's tallest building — original procedural geometry,
 * CC0-1.0.  bun generators/stl-one-metropolitan-square.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 17.2, the downtown street grid: +y runs up
 * Broadway's side (the tower's long axis), +x towards the river. Anchor =
 * the centroid of OSM way/108706791, -90.1898346, 38.6275209.
 *
 * Identity (from the photos below):
 *  1. A slab 40 x 72 m in pinkish-tan granite with punched windows,
 *     stepping in at its corners twice on the way up (74 and 117 m), the
 *     corners chamfered and glazed in dark bronze glass.          (p2, p3)
 *  2. The crown: a green copper hipped roof; a tall gable running across the
 *     tower whose ends are glass pediments over a glass bay down the middle
 *     of each long face; a smaller glass gable on each chamfered corner.
 *                                                               (p2, p3)
 *  3. A low granite podium on the west with a copper hipped roof.     (p2)
 *
 * Plan: OSM way/108706791 and parts way/1363019939–1363019944, turned to
 * bearing 17.2 and used as drawn: podium x -38.6..-2, tower x -2.1..39.2,
 * y ±36; tier rings for 0–74, 74–118, 118–162 m; the crown's base octagon
 * and the gable strip y ±5.6.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018 (flown 2017),
 * 1 m grid with all classes kept (the 2012 flight agrees within 0.3 m),
 * read with tools/lidar_frame.py; y = 0 is the lowest ground under the
 * footprint, on the east (0.4 m over the box's ground_min; the west side is
 * 1.5 m higher). Measured: podium eaves ~24.5, ridge 33.4; setbacks 73.4
 * and 116.6; the crown's eaves 160.4, its hip rising at ~45° to a plateau
 * at 172.6; the corner gables 172.9; the cross gable 173.6 at y ±6, 178.5
 * at y ±3, ridge 181.2 (published 181 m, 593 ft). OSM agrees within a
 * metre (74, 118, 162, 173.7, 180.7).
 * Estimated from p2 and p3: the width of the glass bays (11 m on the long
 * faces, the whole chamfer at the corners), where the long-face bays start
 * (25 m), the window bays (~3.3 m with 1.9 m granite piers, as punched
 * windows read in p2; three storeys a panel), the podium's
 * height split, the entrances.
 * Left out: the podium's dormers, the rooftop lights, the window mullions.
 *
 * Review round 1: the bronze glass is pulled to the palette's lightness
 * (#8b8178, a warm bronze-grey) and framed by pale trim lines every three
 * storeys with one or two mullions a bay.
 *
 * Night: windows glow; the glass bays are lit windows too; the granite is
 * not floodlit (night photo "The one metropolitan square at night from the
 * south.jpg" shows the crown lit, so the crown's copper and gables carry
 * _FLOODLIGHT).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  p1  "One metropolitan square St. Louis.jpg", Johnhochi, CC BY-SA 4.0
 *  p2  "One metropolitan square from the south.jpg", Johnhochi, CC BY-SA 4.0
 *  p3  "One Metropolitan Square.jpg", Matthew Black, CC BY-SA 2.0 (from below, a long face)
 *  p4  "One Metropolitian Square.jpg", Lightmetro, CC BY-SA 4.0
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cornice, hipRoof, prism, save, type XY } from './atl-tech-tower'
import { ccw, edgePanels, offset } from './atl-flatiron-building'

const gran = new Part(), win = new Part(), glass = new Part(), copper = new Part(), roof = new Part()
const tri = (p: Part, a: V3, b: V3, c: V3, out: V3) => {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}
const quad = (p: Part, a: V3, b: V3, c: V3, d: V3, out: V3) => { tri(p, a, b, c, out); tri(p, a, c, d, out) }

// OSM tier rings (bearing 17.2), simplified where the outline doubles back by < 0.5 m
const T1: XY[] = ccw([[2.1, -35.9], [34.3, -36.4], [38.3, -32.7], [38.3, -5.8], [39.2, -4.1], [39.1, 3.4], [38.2, 5.1], [38.2, 31.9], [34.1, 35.9], [1.9, 36.0], [-2.0, 32.4], [-2.1, 5.6], [-3.2, 4.4], [-3.1, -3.6], [-2.3, -5.0], [-2.1, -32.2]])
const T2: XY[] = ccw([[5.1, -35.9], [31.6, -36.4], [31.5, -32.5], [34.4, -29.7], [38.3, -29.8], [38.3, -5.8], [39.2, -4.1], [39.1, 3.4], [38.2, 5.1], [38.2, 28.4], [34.2, 28.4], [31.4, 31.5], [31.6, 35.9], [4.7, 36.0], [4.7, 31.8], [2.0, 28.8], [-2.0, 28.9], [-2.1, 5.6], [-3.2, 4.4], [-3.1, -3.6], [-2.3, -5.0], [-2.1, -29.7], [2.1, -29.8], [5.1, -32.4]])
const T3: XY[] = ccw([[9.2, -36.1], [27.8, -36.3], [27.8, -32.3], [34.2, -26.0], [38.3, -26.0], [38.3, -5.8], [39.2, -4.1], [39.1, 3.4], [38.2, 5.1], [38.2, 23.8], [34.5, 23.9], [27.8, 31.3], [27.6, 35.9], [8.7, 36.0], [8.7, 31.9], [2.1, 24.3], [-2.1, 24.4], [-2.1, 5.6], [-3.2, 4.4], [-3.1, -3.6], [-2.3, -5.0], [-2.1, -26.0], [2.3, -26.1], [9.1, -32.2]])
const CROWN: XY[] = ccw([[-2.1, 24.4], [8.7, 36.0], [27.6, 35.9], [38.2, 23.8], [38.3, -26.0], [27.8, -36.3], [9.2, -36.1], [-2.1, -26.0]])
const Z1 = 73.4, Z2 = 116.6, EAVE = 160.4, PLAT = 172.6, CORNER = 172.9, RIDGE = 181.2
const XW = -2.1, XE = 38.3, GY = 5.6 // the cross gable: long faces at XW / XE, half-width GY

const diagonal = (a: XY, b: XY) => Math.abs(b[0] - a[0]) > 1.5 && Math.abs(b[1] - a[1]) > 1.5
const isGableBay = (a: XY, b: XY) => Math.abs(b[0] - a[0]) < 1.2 && Math.abs(a[1]) < GY + 0.2 && Math.abs(b[1]) < GY + 0.2
const opts = { group: 11.4, gap: 1.6, bay: 3.3, pier: 1.9, margin: 1.2, out: 0.06, min: 4 }
function tier(ring: XY[], z0: number, z1: number, glassCorners = true) {
  prism(gran, ring, z0, z1, roof, 0.35)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 1.6) continue
    if ((glassCorners && diagonal(a, b)) || isGableBay(a, b) || (L < 6 && Math.abs(b[0] - a[0]) < 1.5 && Math.abs(a[1]) < 7)) {
      // chamfered corners and the long faces' middle bay: dark bronze glass
      const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]], o = 0.06
      const P = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * o, a[1] + t[1] * s + n[1] * o, z]
      const zs = isGableBay(a, b) || (L < 6 && Math.abs(a[1]) < 7) ? Math.max(z0, 25) : z0 + 0.3
      quad(glass, P(0.15, zs), P(L - 0.15, zs), P(L - 0.15, z1 - 0.6), P(0.15, z1 - 0.6), [n[0], n[1], 0])
      // pale granite trim lines across the glass every three storeys, and a mullion or two,
      // so a bay reads as framed glass rather than a dark stripe (p3 shows the frame)
      const Q = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * 0.12, a[1] + t[1] * s + n[1] * 0.12, z]
      for (let z = zs + 11.4; z < z1 - 3; z += 11.4) quad(gran, Q(0.15, z - 0.3), Q(L - 0.15, z - 0.3), Q(L - 0.15, z + 0.3), Q(0.15, z + 0.3), [n[0], n[1], 0])
      const mull = L > 8 ? [L / 3, (2 * L) / 3] : L > 4 ? [L / 2] : []
      for (const m of mull) quad(gran, Q(m - 0.22, zs), Q(m + 0.22, zs), Q(m + 0.22, z1 - 0.6), Q(m - 0.22, z1 - 0.6), [n[0], n[1], 0])
      continue
    }
    edgePanels(win, a, b, z0 + 2.0, z1 - 1.2, opts)
  }
}

// ── Podium (west), copper hipped roof ──
prism(gran, ccw([[-38.6, -31.8], [-34.9, -35.5], [-2.1, -35.9], [-2.1, 36.0], [-34.5, 36.2], [-38.3, 32.5]]), 0, 24.5, null, 0)
cornice(gran, ccw([[-38.6, -31.8], [-34.9, -35.5], [-2.1, -35.9], [-2.1, 36.0], [-34.5, 36.2], [-38.3, 32.5]]), 23.8, 0.7, 0.35, null)
hipRoof(copper, -38.5, -2.1, -35.7, 36.1, 24.5, 33.4, 0.3)
for (const [a, b] of [[[-34.9, -35.5], [-2.1, -35.9]], [[-2.1, 36.0], [-34.5, 36.2]], [[-38.3, 32.5], [-38.6, -31.8]]] as [XY, XY][]) edgePanels(win, a, b, 4.0, 22.6, { group: 9.2, gap: 1.2, bay: 3.6, pier: 1.4, margin: 2, out: 0.06 })

// ── The tower's three tiers ──
tier(T1, 0, Z1, false) // the lowest tier's chamfers are granite (p2)
tier(T2, Z1, Z2)
tier(T3, Z2, EAVE)
// entrances: a dark glass base on the east (Broadway) side and the south
for (const [a, b] of [[[38.3, -20], [38.3, -8]], [[12, -35.95], [24, -36.05]]] as [XY, XY][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const P = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * 0.08, a[1] + t[1] * s + n[1] * 0.08, z]
  quad(glass, P(0, 0.3), P(L, 0.3), P(L, 7.5), P(0, 7.5), [n[0], n[1], 0])
}

// ── The crown ──
// the copper hip, rising at ~45° from the eaves to the plateau
const base = CROWN, top = offset(CROWN, -12.2)
for (let i = 0; i < base.length; i++) {
  const j = (i + 1) % base.length, a = base[i], b = base[j], c = top[j], d = top[i]
  const mx = (a[0] + b[0]) / 2 - 18, my = (a[1] + b[1]) / 2
  quad(copper, [a[0], a[1], EAVE], [b[0], b[1], EAVE], [c[0], c[1], PLAT], [d[0], d[1], PLAT], [mx, my, 30])
}
{ const r = top; for (let i = 1; i < r.length - 1; i++) tri(copper, [r[0][0], r[0][1], PLAT], [r[i][0], r[i][1], PLAT], [r[i + 1][0], r[i + 1][1], PLAT], [0, 0, 1]) }
// a flat ledge from the tier's notched outline to the crown octagon
{
  const cz = EAVE
  for (let i = 1; i < base.length - 1; i++) tri(roof, [base[0][0], base[0][1], cz - 0.02], [base[i][0], base[i][1], cz - 0.02], [base[i + 1][0], base[i + 1][1], cz - 0.02], [0, 0, 1])
}
// the cross gable: glass ends standing on the long faces, copper slopes
for (const x of [XW, XE]) {
  const s = x === XE ? 1 : -1
  // the gable end: a glass pentagon from the eaves to the ridge
  quad(glass, [x, -GY, EAVE - 0.6], [x, GY, EAVE - 0.6], [x, GY, PLAT + 0.4], [x, -GY, PLAT + 0.4], [s, 0, 0])
  tri(glass, [x, -GY, PLAT + 0.4], [x, GY, PLAT + 0.4], [x, 0, RIDGE], [s, 0, 0])
  // the pale frame of the pediment
  for (const k of [-1, 1]) quad(gran, [x + s * 0.1, k * GY, PLAT + 0.4], [x + s * 0.1, k * (GY - 0.5), PLAT + 0.4], [x + s * 0.1, 0, RIDGE - 0.6], [x + s * 0.1, 0, RIDGE], [s, 0, 0])
}
for (const k of [-1, 1]) {
  quad(copper, [XW, k * GY, PLAT + 0.4], [XE, k * GY, PLAT + 0.4], [XE, 0, RIDGE], [XW, 0, RIDGE], [0, k, 1])
  quad(glass, [XW, k * GY, EAVE - 0.6], [XE, k * GY, EAVE - 0.6], [XE, k * GY, PLAT + 0.4], [XW, k * GY, PLAT + 0.4], [0, k, 0])
}
// the corner gables: glass triangles on the four chamfers, copper ridges running in to the hip
for (let i = 0; i < base.length; i++) {
  const a = base[i], b = base[(i + 1) % base.length]
  if (!diagonal(a, b)) continue
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], ap: V3 = [m[0], m[1], CORNER], back: V3 = [m[0] - n[0] * 12.4, m[1] - n[1] * 12.4, CORNER]
  tri(glass, [a[0], a[1], EAVE], [b[0], b[1], EAVE], ap, [n[0], n[1], 0])
  tri(copper, [a[0], a[1], EAVE], ap, back, [-t[0] + n[0] * 0.3, -t[1] + n[1] * 0.3, 1])
  tri(copper, [b[0], b[1], EAVE], back, ap, [t[0] + n[0] * 0.3, t[1] + n[1] * 0.3, 1])
}

const crownLit = (p: V3) => (p[2] > EAVE - 1 ? 0.8 : 0)
await save('stl-one-metropolitan-square', 'One Metropolitan Square', [
  { part: gran, material: { ...finish('stl-met-granite', 0xdcc2aa), floodlight: crownLit } },
  { part: win, material: PALETTE.window },
  { part: glass, material: windowVariant(2, 0x8b8178) },
  { part: copper, material: { ...PALETTE.copper, floodlight: crownLit } },
  { part: roof, material: PALETTE.roof },
], { height: RIDGE, anchor: [38.6275209, -90.1898346], bearing: 17.2 }, 6500)
