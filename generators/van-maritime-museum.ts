/**
 * Vancouver Maritime Museum, Vanier Park (1959; the A-frame built round the
 * RCMP schooner St. Roch) — procedural, CC0-1.0.
 * bun generators/van-maritime-museum.ts
 *
 * The tall A-frame: two steep cedar-shingled roof slopes coming down to a
 * low glazed base, a glazed skylight band along the ridge, pale trim on
 * every edge, and the gable ends glazed in big triangles between dark
 * shingled legs; the low flat-roofed gallery wing to the west and the
 * glazed link between them.
 *
 * Frame: x across (east'), y along (north'), z up, metres, turned to
 * bearing 1.6 (the outline's edges run at 1.6° and 91.6°). Origin at the
 * OSM outline's vertex centroid; z = 0 the lowest ground, under the wing.
 *
 * Evidence
 *  - OSM: way/174530913 (building=yes, "Vancouver Maritime Museum"): the
 *    A-frame block x 9.2…27.6, y -23…16.7 (18.4 x 39.7 m); the wing
 *    x -44…-1, y -7.6…12; the link between.
 *  - Heights: City of Vancouver building footprints 2009 (City 2009 lidar;
 *    Contains information licensed under the Open Government Licence –
 *    Vancouver): building 140267 (the A-frame) max 21.0 m over its ground
 *    (base 5.2 m), building 140217 (the wing) roof 7.1 m, max 10.6, over its
 *    base 2.6 m. MEASURED. The A-frame stands 2.6 m higher than the wing;
 *    Mapterhorn reads 0.1–1.5 m under the wing and 2.1–2.7 under the
 *    A-frame, so the A-frame's floor (and the link's) is built 2.6 m up, the lidar step, its base walls
 *    running down to the wing's ground.
 *  - Photos (Wikimedia Commons, EVIDENCE):
 *    1. "Vancouver Maritime Museum in June 2022.jpg", Richard N Horne, CC
 *       BY-SA 4.0: the north gable end and east slope: the glazed triangles,
 *       the skylight band, the trim, the glazed base.
 *    2. "Vancouver Maritime Museum.jpg", Darren Kirby, CC BY-SA 3.0 (dusk):
 *       the gable and slope from the north-east; base glazing lit.
 *    3. "Vancouver Maritime Museum exterior at night.jpg", Ccyyrree, CC0: the
 *       gable end square-on: the pattern of glazed triangles.
 *    4. "Vancouver Maritime Museum 2026.JPG", Canmenwalker, CC BY 4.0: the
 *       west slope, the link and the wing.
 *    5. "Vancouver Maritime Museum from False Creek 01.jpg", Joe Mabel, CC
 *       BY-SA 4.0: the east side from the water.
 *  Elevation 0.
 *
 * Estimated: the eave height (3.4 m over the A-frame's floor) and the
 * skylight band (the top 6 m of each slope) from photos 1 and 4; the
 * gable's glass pattern simplified to a tall central triangle, a diamond
 * above it and two side triangles; the wing's glazing from photo 4.
 * Doubts: the south gable end is assumed to repeat the north one; the
 * wing's other sides are not photographed close up.
 *
 * Night: the gable glass and the glazed base are `window` (lit), the
 * skylight band `glass` (dark).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { box, loftSolid, type Skin } from './sf-golden-gate-bridge'
import { PALETTE, finish } from './palette'

const shingle = new Part(), trim = new Part(), win = new Part(), sky = new Part(), wallP = new Part(), roofP = new Part()
const n3 = (v: V3): V3 => { const l = Math.hypot(...v); return [v[0] / l, v[1] / l, v[2] / l] }
function quad(p: Part, q: V3[], n: V3) {
  const m = n3(n)
  p.tri(q[0], q[1], q[2], undefined, undefined, undefined, [m, m, m])
  p.tri(q[0], q[2], q[3], undefined, undefined, undefined, [m, m, m])
}
function tri(p: Part, a: V3, b: V3, c: V3, n: V3) { const m = n3(n); p.tri(a, b, c, undefined, undefined, undefined, [m, m, m]) }
const one = (p: Part): Skin => () => p

// ---- The A-frame ------------------------------------------------------------------------
const X0 = 9.2, X1 = 27.6, XM = (X0 + X1) / 2, HW = (X1 - X0) / 2
const Y0 = -23.0, Y1 = 16.7
const FL = 2.6                          // the A-frame's floor over the wing's ground
const EAVE = FL + 3.4, RIDGE = FL + 21.0, SKY = RIDGE - 6, O = 0.8
const zAt = (dx: number) => EAVE + ((RIDGE - EAVE) * (HW + O - Math.abs(dx))) / (HW + O)   // roof height at |x - XM|
const dxAt = (z: number) => (HW + O) - ((z - EAVE) * (HW + O)) / (RIDGE - EAVE)

// The base: glazed walls under the eaves, on a plinth down to the ground.
/** Open walls round a plan rectangle, z0–z1, no caps (a plinth whose top is the floor inside). */
const walls = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) =>
  loftSolid(one(p), [z0, z1].map((z) => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]] as V3[]), [false, false])
walls(wallP, X0, X1, Y0 - O + 0.4, Y1 + O - 0.4, 0, FL - 0.4)
for (const [x, s] of [[X0 + 0.6, -1], [X1 - 0.6, 1]] as [number, number][]) {
  quad(win, [[x, Y0, FL], [x, Y1, FL], [x, Y1, EAVE - 0.1], [x, Y0, EAVE - 0.1]], [s, 0, 0])
  // Mullion piers of the glazed base, every 5 m.
  for (let y = Y0 + 2; y < Y1; y += 5) box(one(trim), x - 0.15, x + 0.15, y - 0.15, y + 0.15, FL, EAVE, { r: 0, bottom: false })
}
// Floor slab edge / sill band.
walls(trim, X0, X1, Y0 - O + 0.4, Y1 + O - 0.4, FL - 0.4, FL)
// Roof slopes: shingles from the eave to the skylight band, glass above it; trim along the edges.
for (const s of [-1, 1]) {
  const xe = XM + s * (HW + O), xs = XM + s * dxAt(SKY)
  const n: V3 = [s * (RIDGE - EAVE), 0, HW + O]
  const pts = (xa: number, za: number, xb: number, zb: number): V3[] => s > 0
    ? [[xa, Y0 - O, za], [xa, Y1 + O, za], [xb, Y1 + O, zb], [xb, Y0 - O, zb]]
    : [[xa, Y1 + O, za], [xa, Y0 - O, za], [xb, Y0 - O, zb], [xb, Y1 + O, zb]]
  quad(shingle, pts(xe, EAVE, xs, SKY), n)
  quad(sky, pts(xs, SKY, XM, RIDGE), n)
  // Undersides of the eave overhang.
  quad(trim, [[xe, Y0 - O, EAVE], [xe, Y1 + O, EAVE], [XM + s * (HW - 0.6), Y1 + O, EAVE], [XM + s * (HW - 0.6), Y0 - O, EAVE]], [0, 0, -1])
  // Edge trim: a pale fascia along the eave and up both rakes.
  box(one(trim), Math.min(xe, xe - s * 0.5), Math.max(xe, xe - s * 0.5), Y0 - O, Y1 + O, EAVE - 0.5, EAVE + 0.1, { r: 0, bottom: true })
}
// Ridge cap.
box(one(trim), XM - 0.3, XM + 0.3, Y0 - O, Y1 + O, RIDGE - 0.2, RIDGE + 0.25, { r: 0, bottom: false })

// Gable ends, set 0.4 m in: dark shingled legs with big glazed triangles (photos 1 and 3).
for (const [y, s] of [[Y0 - O + 0.4, -1], [Y1 + O - 0.4, 1]] as [number, number][]) {
  const n: V3 = [0, s, 0], P = (dx: number, z: number): V3 => [XM + dx, y, z]
  const f = (a: V3, b: V3, c: V3, p: Part, off = 0) => {
    const d = (q: V3): V3 => [q[0], q[1] + s * off, q[2]]
    tri(p, d(a), d(b), d(c), n)
  }
  // The whole gable: wall under the roof line.
  const half = dxAt(FL)
  f(P(-half, FL), P(half, FL), P(0, RIDGE - 0.3), shingle)
  // Rakes in trim along the gable's edges.
  for (const sx of [-1, 1]) {
    const a = P(sx * half, FL), b = P(0, RIDGE - 0.3), a2 = P(sx * (half - 0.7), FL), b2 = P(0, RIDGE - 1.6)
    quad(trim, sx > 0 ? [a2, a, b, b2] : [a, a2, b2, b], n)
  }
  // A narrow central triangle, the diamond above it, and a long thin
  // triangle inside each rake (photos 1 and 3).
  f(P(-1.8, FL + 0.2), P(1.8, FL + 0.2), P(0, FL + 11.2), win, 0.05)
  const zd = FL + 11.6
  f(P(0, zd), P(1.7, zd + 2.9), P(0, zd + 5.8), win, 0.05)
  f(P(0, zd), P(0, zd + 5.8), P(-1.7, zd + 2.9), win, 0.05)
  for (const sx of [-1, 1]) {
    const o = dxAt(FL) - 1.0, zt = FL + 9.5
    const a = P(sx * o, FL + 0.2), b = P(sx * (o - 4.2), FL + 0.2), c = P(sx * (dxAt(zt) - 1.0), zt)
    sx > 0 ? f(b, a, c, win, 0.05) : f(a, b, c, win, 0.05)
  }
  // The glazed base band across the gable and its sill.
  quad(trim, [P(-half, FL - 0.4), P(half, FL - 0.4), P(half, FL), P(-half, FL)].map((q) => [q[0], q[1] + s * 0.02, q[2]] as V3), n)
}

// ---- The link and the wing ------------------------------------------------------------------
// The glazed link, on the wing's level.
box(one(roofP), -1.3, X0, -1.4, 4.2, FL + 3.2, FL + 3.6, { r: 0, bottom: true })
walls(wallP, -1.3, X0, -1.4, 4.2, 0, FL)
for (const [y, s] of [[-1.4, -1], [4.2, 1]] as [number, number][]) quad(win, [[-1.3, y + s * 0.02, FL], [X0, y + s * 0.02, FL], [X0, y + s * 0.02, FL + 3.2], [-1.3, y + s * 0.02, FL + 3.2]], [0, s, 0])
// The wing: white walls, a glazed ground floor band, flat roof with a parapet.
const WX0 = -44.2, WX1 = -1.2, WY0 = -7.8, WY1 = 12.2, WH = 7.1
box(one(wallP), WX0, WX1, WY0, WY1, 0, WH, { r: 0.2, bottom: false })
box(one(roofP), WX0 + 0.4, WX1 - 0.4, WY0 + 0.4, WY1 - 0.4, WH, WH + 0.05, { r: 0, bottom: false })
box(one(trim), WX0 - 0.1, WX1 + 0.1, WY0 - 0.1, WY1 + 0.1, WH - 0.5, WH, { r: 0, bottom: false })
const panelY = (y: number, s: number, x0: number, x1: number, z0: number, z1: number) => quad(win, [[x0, y + s * 0.04, z0], [x1, y + s * 0.04, z0], [x1, y + s * 0.04, z1], [x0, y + s * 0.04, z1]], [0, s, 0])
const panelX = (x: number, s: number, y0: number, y1: number, z0: number, z1: number) => quad(win, [[x + s * 0.04, y0, z0], [x + s * 0.04, y1, z0], [x + s * 0.04, y1, z1], [x + s * 0.04, y0, z1]], [s, 0, 0])
for (let x = WX0 + 1.5; x < WX1 - 4; x += 6.5) { panelY(WY0, -1, x, x + 5, 0.6, 3.2); panelY(WY1, 1, x, x + 5, 0.6, 3.2) }
panelX(WX0, -1, WY0 + 1.5, WY1 - 1.5, 0.6, 3.2)

const SHINGLE = finish('cedar-shingle', 0x7b6857)
const parts = [
  { part: shingle, material: SHINGLE },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: sky, material: { ...PALETTE.glass, color: 0x9cc2bc } },
  { part: wallP, material: finish('museum-wall', 0xe9e6de) },
  { part: roofP, material: PALETTE.roof },
]
const tris = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('Vancouver Maritime Museum', parts, { license: 'CC0-1.0', bearing: 1.6, elevation: 0 })
await Bun.write(new URL('../models/van-maritime-museum.glb', import.meta.url), glb)
console.log(`van-maritime-museum.glb: ${tris} triangles, ${glb.length} bytes`)
