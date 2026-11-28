/**
 * Enterprise Center (Kiel Center, Savvis Center, Scottrade Center), 1401
 * Clark Ave, St. Louis (1992–1994; Ellerbe Becket), home of the St. Louis
 * Blues — original procedural geometry, CC0-1.0.
 * bun generators/stl-enterprise-center.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 17.2, the street grid: -y is the Clark Ave front;
 * the curved north wall is shared with the Stifel Theatre (its own model,
 * stl-stifel-theatre), so nothing here reaches past the OSM outline there.
 * Anchor = the centroid of OSM way/42369176, -90.2026201, 38.6268126.
 *
 * Identity (from the photos below):
 *  1. The Clark Ave front: a long band of dark glass curtain wall with pale
 *     horizontal mullion lines over a glazed ground floor, between pale
 *     precast end blocks.                                         (p1, p3)
 *  2. A glazed clerestory band all round under a thin, wide roof slab that
 *     overhangs it, and over that a low, gently domed pale roof.     (p1)
 *  3. A rounded arena body in pale precast panels.                    (p1)
 *
 * Note on the brief: it says brick; the photos show pale precast panels and
 * glass, so the model follows them.
 *
 * Plan: OSM way/42369176 turned to bearing 17.2, used as drawn for the body.
 * The clerestory, roof slab and dome sit on the outline's convex hull,
 * scaled in about its centre (the hull adds nothing on the north side, so
 * the shared wall with the theatre is kept). The garage (way/42369162) and
 * the canopies nearby are separate buildings and are not replaced.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018 (flown 2017),
 * 1 m grid with class 18 kept; y = 0 is the Clark Ave pavement, the lowest
 * ground under the footprint (5.5 m over the box's ground_min). Measured:
 * the body's walls 21.5, the roof slab's edge 25–26, the roof 30–34 near
 * its edges and 36.5 at its crown (the lidar shows a low, slightly tilted
 * cap; it is drawn level and symmetric).
 * Estimated from p1: the clerestory band (21.5–25), the slab (25–26.2), the
 * curtain wall's extent (x -6..66 on Clark Ave, 3–20 m), the glazed ground
 * floor, the end blocks' window bands.
 * Left out: the signs and screens, the flagpoles.
 *
 * Night: the curtain wall and clerestory glow as windows; the roof edge is
 * floodlit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  p1  "Scottrade 2015.jpg", Lightmetro, CC BY-SA 4.0 (the Clark Ave front, from the south)
 *  p2  "Scottrade center 2010.jpg", Chris Yunker, CC BY 2.0
 *  p3  "Enterprise All Star.jpg", Lightmetro, CC BY-SA 4.0 (the curtain wall, close up)
 *  p4  "Scottrade Center 3Apr2005.jpg", Haaron755, CC BY-SA 3.0
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { onWall, prism, rectShape, save, type XY } from './atl-tech-tower'
import { ccw, capPoly, wall, at } from './atl-flatiron-building'

const body = new Part(), glass = new Part(), roof = new Part(), trim = new Part()
const OUT: XY[] = ccw([[-77.3, -5.2], [-77.0, 41.0], [-53.8, 41.1], [-50.8, 43.0], [-45.1, 46.3], [-33.9, 52.9], [-22.1, 59.8], [-11.8, 65.3], [-5.4, 68.7], [3.1, 71.6], [3.4, 68.6], [7.3, 69.8], [12.9, 70.6], [18.2, 71.0], [24.1, 70.7], [30.1, 69.8], [36.9, 67.5], [42.8, 65.0], [47.6, 62.0], [53.5, 57.4], [58.0, 52.8], [62.3, 47.4], [65.8, 41.9], [68.6, 37.1], [70.6, 33.3], [72.4, 29.1], [74.1, 23.5], [75.3, 17.6], [76.0, 10.7], [75.8, 4.7], [75.1, -1.2], [73.8, -7.1], [71.5, -13.1], [68.6, -18.4], [65.3, -32.9], [75.3, -47.9], [66.8, -50.0], [36.6, -57.2], [-6.0, -67.4], [-11.8, -68.3], [-17.7, -68.7], [-23.8, -68.4], [-30.6, -67.2], [-37.2, -65.1], [-42.0, -62.9], [-46.8, -60.2], [-51.6, -56.6], [-54.4, -54.3], [-55.2, -55.1], [-66.6, -50.1], [-61.7, -46.3], [-64.9, -41.6], [-67.7, -36.7], [-70.4, -31.6], [-73.1, -26.0], [-75.1, -19.5], [-76.5, -11.9]])
const WALL = 21.5, CLER = 25.0, SLAB = 26.2

/** Convex hull (monotone chain), counter-clockwise. */
function hull(pts: XY[]): XY[] {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cr = (o: XY, a: XY, b: XY) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lo: XY[] = [], up: XY[] = []
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q) }
  for (const q of [...p].reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q) }
  return lo.slice(0, -1).concat(up.slice(0, -1))
}
// (the hull leaves out three small jutting corners — the south-east loading wedge,
// the west stair and a north notch — which the lidar shows low)
const H = hull(OUT.filter(([x, y]) => !((x === 75.3 && y === -47.9) || (x === -66.6 && y === -50.1) || (x === 3.1 && y === 71.6))))
const C: XY = [H.reduce((s, q) => s + q[0], 0) / H.length, H.reduce((s, q) => s + q[1], 0) / H.length]
const scaled = (k: number): XY[] => H.map(([x, y]) => [C[0] + (x - C[0]) * k, C[1] + (y - C[1]) * k] as XY)

// ── The body: pale precast walls to 21.5, a flat ledge to the clerestory ──
prism(body, OUT, 0, WALL, null, 0)
capPoly(roof, OUT, WALL, true)
// ── The clerestory band, the overhanging slab, the low domed roof ──
const CL = scaled(0.95)
wall(glass, CL, WALL, CLER)
const S0 = scaled(0.99)
body.loft([at(CL, CLER), at(S0, CLER)]) // the slab's underside
wall(trim, S0, CLER, SLAB)
const rings: [number, number][] = [[0.99, SLAB], [0.9, 29.5], [0.75, 32.5], [0.55, 34.8], [0.3, 36.1], [0.08, 36.5]]
for (let k = 0; k < rings.length - 1; k++) roof.loft([at(scaled(rings[k][0]), rings[k][1]), at(scaled(rings[k + 1][0]), rings[k + 1][1])])
capPoly(roof, scaled(0.08), 36.5, true)

// ── The Clark Ave curtain wall, the glazed ground floor, the end blocks' windows ──
for (let i = 0; i < OUT.length; i++) {
  const a = OUT[i], b = OUT[(i + 1) % OUT.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const front = n[1] < -0.85 && Math.min(a[0], b[0]) > -6.5 && L > 20 // the two straight Clark Ave segments
  if (front) {
    const inset = L > 35 ? 4 : 0
    onWall(glass, a, b, rectShape(inset, L - (L > 35 ? 0 : 6), 0.4, 20.4), 0.05)
    for (let z = 3.6; z < 20; z += 1.8) onWall(trim, a, b, rectShape(inset, L - (L > 35 ? 0 : 6), z - 0.12, z + 0.12), 0.1) // pale mullion lines
    continue
  }
  if (L < 3) continue
  // elsewhere: a glazed ground floor and two bands of windows in the precast
  onWall(glass, a, b, rectShape(0.4, L - 0.4, 0.4, 4.0), 0.05)
  for (const [z0, z1] of [[9.0, 10.6], [15.0, 16.6]]) onWall(glass, a, b, rectShape(0.6, L - 0.6, z0, z1), 0.05)
}

const lit = (p: V3, n: V3) => (p[2] > CLER - 0.1 && p[2] < SLAB + 0.1 ? 1 : n[2] > 0.5 ? 0 : 0.3)
await save('stl-enterprise-center', 'Enterprise Center', [
  { part: body, material: { ...finish('stl-arena-precast', 0xe3dbcb), floodlight: lit } },
  { part: glass, material: PALETTE.window },
  { part: roof, material: finish('stl-arena-roof', 0xc7cacc) },
  { part: trim, material: { ...finish('stl-arena-trim', 0xeeeeea), floodlight: lit } },
], { height: 36.5, anchor: [38.6268126, -90.2026201], bearing: 17.2 })
