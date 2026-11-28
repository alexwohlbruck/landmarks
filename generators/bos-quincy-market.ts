/**
 * Quincy Market (the central market building of Faneuil Hall Marketplace),
 * Boston (1824–26, Alexander Parris; glass canopies 1976, Benjamin Thompson)
 * — original procedural geometry, CC0-1.0.
 * bun generators/bos-quincy-market.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 352.8: the long walls of OSM way/29573399 run at
 * 82.8°, so x runs along the market (west portico toward Faneuil Hall at -x)
 * and y across it. Anchor = the outline's centroid, -71.0548035,
 * 42.3602173. In this frame the outline is x -81.9..82.6, y ±8.2.
 *
 * Identity (from the photos below):
 *  1. A very long, low two-storey granite market hall under a grey gabled
 *     roof, with a Greek Doric temple portico at each end: four tall
 *     columns, an entablature and a pediment with an oculus, a chimney
 *     behind it.
 *  2. The taller central pavilion with five tall arched windows a side, an
 *     attic with corner chimneys, and the low copper (green) dome on its
 *     oval drum with a small round lantern and a weathervane.
 *  3. The long 1976 glass canopies along both sides of the wings.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021), 1 m grid, read
 * with tools/lidar_frame.py; the ground round the market is flat (about 2.3
 * above the grid's ground_min), y = 0. Measured: the wings' eaves 10.0
 * (published: cornice 31 ft, 9.45 m) and ridge 13.8; the pavilion's
 * parapet 15.0, corner chimneys 17.5; the dome's crown 22.5 and lantern
 * 24.7; the canopies 5.8 at the wall, 4.3 at the outer edge. The dome is
 * an oval about 20 × 14.5 m in the lidar, as OSM's part way/484942339
 * (20 × 15 m) and the published 70 × 50 ft have it. Published (Wikipedia,
 * citing Quincy 2003 and the BLC): the wings 50 ft wide, the pavilion
 * 74.5 × 55 ft; the portico columns 20.75 ft (6.3 m), 42 in at the base;
 * the first floor 3 ft above the ground.
 *
 * Estimated from the photos: the portico depth (4 m) and column spacing;
 * the bay rhythm of the wings (3.35 m) and window sizes; the pavilion's
 * arched windows and attic; the lantern; the canopies' frames.
 *
 * Ground: nearly flat; the terrain is 0.7 higher at both ends than at the
 * lowest point, so the portico steps and floor are built from there
 * (floor 1.6). Elevation 0.
 *
 * Night: the windows glow; the canopies' glass stays dark; the porticoes
 * and dome are floodlit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Quincy Market south-east sides.jpg, Jack Boucher (HABS), public domain
 *    (the east portico and south side)
 *    https://commons.wikimedia.org/wiki/File:Quincy_Market_south-east_sides.jpg
 *  - VIEW OF CENTRAL AREA FROM SOUTH, ELEVATION OF DOME - Quincy Market,
 *    Jack Boucher (HABS), public domain (the pavilion square on)
 *    https://commons.wikimedia.org/wiki/File:VIEW_OF_CENTRAL_AREA_FROM_SOUTH,_ELEVATION_OF_DOME_-_Quincy_Market,_South_Market_Street,_Boston,_Suffolk_County,_MA_HABS_MASS,13-BOST,118-10.tif
 *  - Quincy Market from Custom House.jpg, Av9, CC BY-SA 4.0 (aerial: the
 *    roof, dome, canopies)
 *    https://commons.wikimedia.org/wiki/File:Quincy_Market_from_Custom_House.jpg
 *  - Quincy Market, Boston, Massachusetts, April 2011 - Flickr - PhillipC
 *    (1).jpg, Phillip Capper, CC BY 2.0 (the west portico)
 *    https://commons.wikimedia.org/wiki/File:Quincy_Market,_Boston,_Massachusetts,_April_2011_-_Flickr_-_PhillipC_(1).jpg
 * No look-only sources. No commercial imagery.
 *
 * The end walls inside the porticoes are drawn in the slate grey as the
 * shade they stand in, so the columns read against them.
 *
 * Doubts: the gilt "QUINCY MARKET" letters on the west frieze are left out;
 * the canopies are drawn as one sloping glass roof a side on posts, without
 * their jogs; the roof's vents and skylights are left out.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, cornice, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'

const stone = new Part(), roof = new Part(), win = new Part(), dome = new Part(), glass = new Part(), metal = new Part()

function poly(p: Part, pts: V3[], out: V3) {
  const n = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const q = n[0] * out[0] + n[1] * out[1] + n[2] * out[2] < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}
type F = [XY, XY]

const X0 = -81.9, X1 = 82.6, Y = 8.0, DEPTH = 4.0, W0 = X0 + DEPTH, W1 = X1 - DEPTH
const EAVE = 10.0, RIDGE = 13.8, ST = 1.6 // the porticoes' floor: 3 ft over the ground at the ends, which is 0.7 above y = 0
const XC = 0.6, PX = 11.35, PY = 8.6 // the pavilion

// ── Wings and the long roof ──
box(stone, W0, W1, -Y, Y, 0, EAVE - 0.7, null, 0)
cornice(stone, [[W0, -Y], [W1, -Y], [W1, Y], [W0, Y]], EAVE - 0.7, 0.7, 0.4, null)
cornice(stone, [[W0, -Y], [W1, -Y], [W1, Y], [W0, Y]], 4.7, 0.3, 0.12, null) // string course between the storeys
{
  const o = 0.45, sl = (RIDGE - EAVE) / Y, lo = EAVE - o * sl
  const A: V3 = [X0 - 0.3, -Y - o, lo], B: V3 = [X1 + 0.3, -Y - o, lo], C: V3 = [X1 + 0.3, Y + o, lo], D: V3 = [X0 - 0.3, Y + o, lo]
  const R0: V3 = [X0 - 0.3, 0, RIDGE], R1: V3 = [X1 + 0.3, 0, RIDGE]
  poly(roof, [A, B, R1, R0], [0, -1, 1])
  poly(roof, [C, D, R0, R1], [0, 1, 1])
  poly(roof, [A, D, C, B], [0, 0, -1])
}

// ── Porticoes ──
for (const s of [-1, 1]) {
  const xe = s < 0 ? X0 : X1, xw = s < 0 ? W0 : W1, xa = Math.min(xe, xw), xb = Math.max(xe, xw)
  // stylobate and steps
  box(stone, xa - (s < 0 ? 0.9 : 0), xb + (s > 0 ? 0.9 : 0), -Y, Y, 0, 0.85, stone, 0.05)
  box(stone, xa - (s < 0 ? 0.45 : 0), xb + (s > 0 ? 0.45 : 0), -Y, Y, 0.85, 1.2, stone, 0.05)
  box(stone, xa, xb, -Y, Y, 1.2, ST, stone, 0.05)
  // four Doric columns
  for (const yc of [-6.9, -2.3, 2.3, 6.9]) {
    revolve(stone, [xe - s * 0.75, yc], [[0.6, ST], [0.54, ST + 0.2], [0.42, 7.0], [0.62, 7.05], [0.62, 7.3], [0, 7.3]], 10, 0, false, false)
  }
  // entablature, pediment with its oculus, raking cornices
  box(stone, xa, xb, -Y - 0.1, Y + 0.1, 7.3, EAVE, null, 0)
  poly(stone, [[xe, -Y, EAVE], [xe, Y, EAVE], [xe, 0, RIDGE - 0.1]], [s, 0, 0])
  const fe: F = s < 0 ? [[xe, Y], [xe, -Y]] : [[xe, -Y], [xe, Y]]
  const circ = (r: number) => Array.from({ length: 12 }, (_, i) => [Y + r * Math.cos((i / 12) * Math.PI * 2), 11.55 + r * Math.sin((i / 12) * Math.PI * 2)] as [number, number])
  onWall(stone, fe[0], fe[1], circ(0.95), 0.03)
  onWall(win, fe[0], fe[1], circ(0.72), 0.06)
  for (const k of [-1, 1]) {
    const sec = (y: number, z: number): V3[] => [[xe - s * 0.15, y, z], [xe + s * 0.35, y, z], [xe + s * 0.35, y, z - 0.45], [xe - s * 0.15, y, z - 0.45]]
    stone.sweep([sec(k * (Y + 0.45), EAVE - 0.15), sec(0, RIDGE + 0.12)])
  }
  // the end wall behind: a round-headed door between windows, windows above
  const fw: F = s < 0 ? [[xw, Y], [xw, -Y]] : [[xw, -Y], [xw, Y]]
  // the end wall stands in the portico's deep shade (darker in every photo),
  // which is what lets the four columns read against it
  onWall(roof, fw[0], fw[1], rectShape(0.4, 2 * Y - 0.4, ST, 7.3), 0.02)
  onWall(metal, fw[0], fw[1], archShape(Y, 2.0, ST, ST + 2.8, 10), 0.05)
  for (const d of [-4.6, 4.6]) {
    onWall(win, fw[0], fw[1], archShape(Y + d, 1.5, 1.6, 3.9, 10), 0.05)
    onWall(win, fw[0], fw[1], rectShape(Y + d - 0.7, Y + d + 0.7, 5.4, 6.9), 0.05)
  }
  onWall(win, fw[0], fw[1], rectShape(Y - 0.7, Y + 0.7, 5.4, 6.9), 0.05)
  // the chimney behind the pediment
  const xc = xe - s * 5.6
  box(stone, xc - 0.7, xc + 0.7, -0.75, 0.75, RIDGE - 1, 15.4, stone, 0.1)
}

// ── Wing windows: arched below, square above, a bay every 3.35 m ──
for (const [a, b] of [[W0, XC - PX], [XC + PX, W1]]) {
  const L = b - a, n = Math.round(L / 3.35), w = L / n
  for (const f of [[[a, -Y], [b, -Y]], [[b, Y], [a, Y]]] as F[]) {
    for (let k = 0; k < n; k++) {
      const s = (k + 0.5) * w
      onWall(win, f[0], f[1], archShape(s, 1.7, 1.3, 3.6, 8), 0.05)
      onWall(win, f[0], f[1], rectShape(s - 0.7, s + 0.7, 5.6, 8.1), 0.05)
    }
  }
}

// ── The central pavilion ──
const PE = 11.6, PT = 15.0
box(stone, XC - PX, XC + PX, -PY, PY, 0, PE, null, 0)
cornice(stone, [[XC - PX, -PY], [XC + PX, -PY], [XC + PX, PY], [XC - PX, PY]], PE - 0.7, 0.7, 0.45, null)
box(stone, XC - PX + 0.3, XC + PX - 0.3, -PY + 0.3, PY - 0.3, PE, PT - 0.4, roof, 0)
cornice(stone, [[XC - PX + 0.3, -PY + 0.3], [XC + PX - 0.3, -PY + 0.3], [XC + PX - 0.3, PY - 0.3], [XC - PX + 0.3, PY - 0.3]], PT - 0.4, 0.4, 0.2, null)
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const cx = XC + sx * (PX - 1.4), cy = sy * (PY - 1.3)
  box(stone, cx - 0.9, cx + 0.9, cy - 0.8, cy + 0.8, PT - 0.4, 17.5, stone, 0.12)
}
for (const f of [[[XC - PX, -PY], [XC + PX, -PY]], [[XC + PX, PY], [XC - PX, PY]]] as F[]) {
  for (const k of [-2, -1, 0, 1, 2]) {
    const s = PX + k * 4.25, w = k === 0 ? 3.1 : 2.5
    onWall(stone, f[0], f[1], archShape(s, w + 0.5, 1.0, 8.3 - (k === 0 ? 0.3 : 0), 10), 0.03)
    onWall(win, f[0], f[1], archShape(s, w, 1.3, 8.3 - (k === 0 ? 0.3 : 0), 10), 0.06)
  }
}

// ── The oval drum, the copper dome and the lantern ──
{
  const RX = 10.0, RY = 7.2, N = 20, Z0 = 15.0, ZD = 16.2, ZC = 22.5
  const ring = (k: number, z: number): V3[] => Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2
    return [XC + RX * k * Math.cos(a), RY * k * Math.sin(a), z]
  })
  stone.loft([ring(1.02, Z0), ring(1.02, ZD)])
  const rings: V3[][] = []
  const steps = 6
  for (let j = 0; j <= steps; j++) {
    const t = (j / steps) * (Math.PI / 2)
    rings.push(ring(Math.max(0.17, Math.cos(t)), ZD + (ZC - ZD) * Math.sin(t)))
  }
  dome.loft(rings)
  const top = rings[rings.length - 1]
  for (let i = 0; i < N; i++) dome.tri(top[i], top[(i + 1) % N], [XC, 0, ZC])
}
revolve(stone, [XC, 0], [[1.75, 22.0], [1.75, 24.2], [1.95, 24.35], [1.95, 24.55], [0, 24.7]], 14, 0, false, false)
{
  const c = (z0: number, z1: number) => {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2, u: XY = [Math.cos(a), Math.sin(a)]
      const p = (dt: number, z: number): V3 => [XC + 1.77 * u[0] - u[1] * dt, 1.77 * u[1] + u[0] * dt, z]
      poly(win, [p(-0.35, z0), p(0.35, z0), p(0.35, z1), p(-0.35, z1)], [u[0], u[1], 0])
    }
  }
  c(22.6, 23.8)
}
revolve(metal, [XC, 0], [[0.06, 24.6], [0.06, 27.6], [0, 27.9]], 6, 0, true, false)
box(metal, XC - 0.05, XC + 0.05, -0.1, 1.4, 26.6, 27.1, metal, 0)

// ── The glass canopies ──
for (const s of [-1, 1]) {
  const xa = -62.0, xb = 64.0, yo = s * 18.3, yw = s * Y, zw = 5.8, ze = 4.3
  poly(glass, [[xa, yw, zw], [xb, yw, zw], [xb, yo, ze], [xa, yo, ze]], [0, s * 0.3, 1])
  poly(glass, [[xa, yw, zw - 0.15], [xb, yw, zw - 0.15], [xb, yo, ze - 0.15], [xa, yo, ze - 0.15]], [0, 0, -1])
  // the edge beam, the end frames and posts every 8 m
  box(metal, xa, xb, Math.min(yo, yo - s * 0.35), Math.max(yo, yo - s * 0.35), ze - 0.55, ze, metal, 0)
  for (const xe of [xa, xb]) poly(metal, [[xe, yw, zw], [xe, yo, ze], [xe, yo, ze - 0.55], [xe, yw, zw - 0.55]], [xe < 0 ? -1 : 1, 0, 0])
  const n = Math.round((xb - xa) / 8)
  for (let k = 0; k <= n; k++) {
    const x = xa + ((xb - xa) * k) / n
    box(metal, x - 0.15, x + 0.15, Math.min(yo, yo - s * 0.3), Math.max(yo, yo - s * 0.3), 0, ze - 0.55, null, 0)
    // a rafter over the glass, as the frames read from above
    metal.sweep([
      [[x - 0.12, yw, zw + 0.12], [x + 0.12, yw, zw + 0.12], [x + 0.12, yw, zw - 0.1], [x - 0.12, yw, zw - 0.1]],
      [[x - 0.12, yo, ze + 0.12], [x + 0.12, yo, ze + 0.12], [x + 0.12, yo, ze - 0.1], [x - 0.12, yo, ze - 0.1]],
    ])
  }
}

const lit = (p: V3, n: V3) => (Math.abs(p[0]) > W1 - 1 || Math.abs(p[0] - XC) < PX + 1 ? (n[2] > 0.7 ? 0.2 : 0.75) : 0)
await save('bos-quincy-market', 'Quincy Market', [
  { part: stone, material: { ...finish('qm-granite', 0xe2ddd2), floodlight: lit } },
  { part: roof, material: finish('qm-slate', 0x8f979e) },
  { part: win, material: PALETTE.window },
  { part: dome, material: { ...PALETTE.copper, floodlight: () => 0.5 } },
  { part: glass, material: PALETTE.glass },
  { part: metal, material: finish('qm-metal', 0x4f5458) },
], { height: 27.9, anchor: [42.3602173, -71.0548035], bearing: 352.8 })
