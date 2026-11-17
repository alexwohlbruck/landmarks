/**
 * Old State House, Boston (1713) — original procedural geometry, CC0-1.0.
 * bun generators/bos-old-state-house.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 357: the long walls of OSM way/29608515 run at
 * 87°, so the model's x axis is the building's long axis. Anchor = the
 * outline's centroid, -71.0574679, 42.3587304.
 *
 * Identity (from the photos below):
 *  1. A small red-brick Georgian block, three storeys and a basement, with a
 *     steep grey slate roof and five dormers a side.
 *  2. Raised brick gable walls at both ends standing above the roof, with
 *     short level shoulders at the corners: the gilded lion (south) and
 *     unicorn (north) on the east gable's shoulders, a gilded clock in the
 *     east gable and a balcony over the State Street end; gilded scrolls and
 *     an eagle on the west gable.
 *  3. The cream, multi-staged steeple at the middle of the roof: a square
 *     base, a stage with big round-arched windows, a balustrade, an
 *     octagonal lantern, a gilded cap and a weathervane.
 *  4. Cream pedimented doorcases on the north, south and west sides; white
 *     window sashes.
 *
 * Plan: OSM way/29608515 (and its parts) in the turned frame, made
 * symmetric: 33.7 × 13.8 m (x ±16.85, y ±6.9). The steeple is drawn on the
 * centre line (OSM puts its parts 1 m east, the lidar 0.5 m west).
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021, 0.5 m grid, read in
 * this frame with tools/lidar_frame.py. The street falls 1.7 m from the west
 * end (Washington St) to the east end (State St); y = 0 is the east street.
 * Measured (above the east street): eaves 10.6, ridge 16.5, gable peaks 17.6,
 * shoulders about 12–13; steeple: square base 6 m wide to 19.0, the arched
 * stage 5 m wide to 24.2, balustrade to 25.2, lantern about 3.4 m wide to
 * 27.9, cap 28.8, finial 31.1. OSM: height 20, tower part 32 m.
 *
 * Estimated from the photos (scaled from the east front's eaves): window
 * rows (basement 0.5–1.4 above the local street, floors at 3.1–5.5 and
 * 7.1–9.6), eleven bays on the long sides, the dormers' size, the doorcases,
 * the balcony, the clock, and the gilded figures (drawn as bold simple
 * masses, about 1.8 m tall).
 *
 * Ground: Mapterhorn and the lidar both show the 1.7 m fall to the east;
 * elevation 0. The west end's walls run down to y = 0 and sink in.
 * Not modelled: the State Street MBTA station entrance in the basement, the
 * street furniture.
 *
 * Night: the east and west gable fronts and the steeple are floodlit (night
 * photo below); windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - USA Old State House 1 MA.jpg, Daniel Schwen, CC BY-SA 2.5 (from the
 *    north-east: east front, north side, steeple)
 *    https://commons.wikimedia.org/wiki/File:USA_Old_State_House_1_MA.jpg
 *  - Old State House, Boston.jpg, Marco Almbauer, public domain (from the
 *    north-west) https://commons.wikimedia.org/wiki/File:Old_State_House,_Boston.jpg
 *  - Old State House Boston 2009f.JPG, Chensiyuan, CC BY-SA 4.0 (from the
 *    west) https://commons.wikimedia.org/wiki/File:Old_State_House_Boston_2009f.JPG
 *  - Boston Old State House NE StateCongressSt 9445 20190429.jpg, Karlunun,
 *    CC BY-SA 4.0 (from the east, far)
 *    https://commons.wikimedia.org/wiki/File:Boston_Old_State_House_NE_StateCongressSt_9445_20190429.jpg
 *  - Old State House, Boston (western elevation detail, 2026).jpg,
 *    Seasider53, CC BY 4.0 (the west gable)
 *    https://commons.wikimedia.org/wiki/File:Old_State_House,_Boston_(western_elevation_detail,_2026).jpg
 *  - Old State House at night 03.jpg, Runner1928, CC BY-SA 4.0 (east front
 *    at night) https://commons.wikimedia.org/wiki/File:Old_State_House_at_night_03.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the south side is seen only obliquely; its windows are drawn like
 * the north. Dormer x positions are from lidar bumps (±0.5 m). The steeple's
 * arched stage is drawn square with chamfered corners.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'

const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part(), gold = new Part(), door = new Part()

const X = 16.85, Y = 6.9 // half sizes
const EAVE = 10.6, RIDGE = 16.5, PEAK = 17.6, SHOULDER = 13.2
const gnd = (x: number) => 0.85 - (0.85 * x) / X // the street, 1.7 m at the west end, 0 at the east

/** A convex [y, z] polygon (counter-clockwise seen from +x) extruded from x0 to x1. */
function extrudeX(p: Part, x0: number, x1: number, pts: [number, number][]) {
  const A = pts.map(([y, z]): V3 => [x0, y, z]), B = pts.map(([y, z]): V3 => [x1, y, z])
  for (let i = 1; i < pts.length - 1; i++) { p.tri(B[0], B[i], B[i + 1]); p.tri(A[0], A[i + 1], A[i]) }
  for (let i = 0; i < pts.length; i++) { const j = (i + 1) % pts.length; p.quad(A[i], A[j], B[j], B[i]) }
}
/** Same along y, the polygon [x, z] counter-clockwise seen from -y. */
function extrudeY(p: Part, y0: number, y1: number, pts: [number, number][]) {
  const A = pts.map(([x, z]): V3 => [x, y0, z]), B = pts.map(([x, z]): V3 => [x, y1, z])
  for (let i = 1; i < pts.length - 1; i++) { p.tri(A[0], A[i], A[i + 1]); p.tri(B[0], B[i + 1], B[i]) }
  for (let i = 0; i < pts.length; i++) { const j = (i + 1) % pts.length; p.quad(A[j], A[i], B[i], B[j]) }
}

// ── Faces, each a → b with the outside on the right ──
const S: [XY, XY] = [[-X, -Y], [X, -Y]], E: [XY, XY] = [[X, -Y], [X, Y]], N: [XY, XY] = [[X, Y], [-X, Y]], W: [XY, XY] = [[-X, Y], [-X, -Y]]

// ── Brick body, split so the walls follow the sloping street ──
for (let i = 0; i < 7; i++) {
  const x0 = -X + (i * 2 * X) / 7, x1 = -X + ((i + 1) * 2 * X) / 7
  const b: V3[] = [[x0, -Y, 0], [x1, -Y, 0], [x1, Y, 0], [x0, Y, 0]], t = b.map(([x, y]): V3 => [x, y, EAVE])
  brick.quad(b[0], b[1], t[1], t[0]); brick.quad(b[2], b[3], t[3], t[2])
}
brick.quad([X, -Y, 0], [X, Y, 0], [X, Y, EAVE], [X, -Y, EAVE])
brick.quad([-X, Y, 0], [-X, -Y, 0], [-X, -Y, EAVE], [-X, Y, EAVE])
// The cornice along the long sides.
for (const s of [-1, 1]) extrudeX(trim, -X, X, s < 0
  ? [[-Y - 0.45, EAVE - 0.5], [-Y, EAVE - 0.7], [-Y, EAVE + 0.15], [-Y - 0.45, EAVE + 0.05]]
  : [[Y, EAVE - 0.7], [Y + 0.45, EAVE - 0.5], [Y + 0.45, EAVE + 0.05], [Y, EAVE + 0.15]])

// ── The raised gable walls with their shoulders, both ends ──
const GT = 0.6
for (const s of [-1, 1]) {
  const [x0, x1] = s > 0 ? [X - GT, X] : [-X, -X + GT]
  extrudeX(brick, x0, x1, [[-Y, EAVE], [Y, EAVE], [Y, SHOULDER], [-Y, SHOULDER]])
  extrudeX(brick, x0, x1, [[-4.9, SHOULDER], [4.9, SHOULDER], [0.9, PEAK - 0.9], [-0.9, PEAK - 0.9]])
  extrudeX(brick, x0 - (s < 0 ? 0.05 : 0), x1 + (s > 0 ? 0.05 : 0), [[-0.9, PEAK - 0.9], [0.9, PEAK - 0.9], [0.9, PEAK], [-0.9, PEAK]])
  // stone coping on the shoulders and rakes
  for (const k of [-1, 1]) {
    const pts: [number, number][] = [[k * Y, SHOULDER], [k * 4.9, SHOULDER], [k * 4.9, SHOULDER + 0.25], [k * Y, SHOULDER + 0.25]]
    extrudeX(trim, x0 - 0.1, x1 + 0.1, k > 0 ? pts.reverse() as [number, number][] : pts)
  }
}

// ── Slate roof between the gable walls ──
{
  const x0 = -X + GT, x1 = X - GT, o = 0.4, sl = (RIDGE - EAVE) / Y, lo = EAVE - o * sl + 0.05
  const a: V3 = [x0, -Y - o, lo], b: V3 = [x1, -Y - o, lo], r0: V3 = [x0, 0, RIDGE], r1: V3 = [x1, 0, RIDGE], c: V3 = [x1, Y + o, lo], d: V3 = [x0, Y + o, lo]
  roof.quad(a, b, r1, r0); roof.quad(c, d, r0, r1)
}

// ── Dormers, five a side ──
for (const dx of [-12, -6.3, -0.7, 4.9, 10.5]) for (const s of [-1, 1]) {
  const yf = s * (Y - 1.1), yb = s * 2.6, w = 0.9, top = 13.2, rz = 14.1
  const pts: [number, number][] = [[dx - w, 10.9], [dx + w, 10.9], [dx + w, top], [dx, rz], [dx - w, top]]
  extrudeY(roof, Math.min(yf, yb), Math.max(yf, yb), pts)
  onWall(win, s < 0 ? [dx - w, yf] : [dx + w, yf], s < 0 ? [dx + w, yf] : [dx - w, yf], rectShape(0.4, 1.4, 11.3, 12.9), 0.04)
}

// ── Windows: white sash frames (trim) behind slate panels ──
function sash(f: [XY, XY], s: number, z0: number, z1: number, w = 1.15) {
  onWall(trim, f[0], f[1], rectShape(s - w / 2 - 0.13, s + w / 2 + 0.13, z0 - 0.13, z1 + 0.13), 0.04)
  onWall(win, f[0], f[1], rectShape(s - w / 2, s + w / 2, z0, z1), 0.08)
}
const L = 2 * X, bays = 11, bay = (L - 3.6) / (bays - 1)
for (const f of [S, N]) for (let k = 0; k < bays; k++) {
  const s = 1.8 + k * bay, x = f === S ? -X + s : X - s
  sash(f, s, 7.1, 9.6)
  if (k === 5) continue // the doorcase
  sash(f, s, 3.1, 5.5)
  sash(f, s, gnd(x) + 0.45, gnd(x) + 1.3, 1.0)
}
// East front (State Street): three bays, the balcony door in the middle.
for (const s of [2.6, 6.9, 11.2]) {
  sash(E, s, 3.1, 5.5)
  sash(E, s, 0.45, 1.3, 1.0)
  if (s !== 6.9) sash(E, s, 7.1, 9.6)
}
sash(E, 6.9, 10.6, 13.0, 1.1)
// West front: windows either side of the doorcase.
for (const s of [2.6, 6.9, 11.2]) {
  sash(W, s, 7.1, 9.6)
  if (s === 6.9) continue
  sash(W, s, 3.1, 5.5)
  sash(W, s, gnd(-X) + 0.45, gnd(-X) + 1.3, 1.0)
}
sash(W, 6.9, 10.6, 13.0, 1.1)
// Round windows in both gables.
for (const f of [E, W]) for (const s of [2.6, 11.2]) {
  const ring = (r: number) => Array.from({ length: 12 }, (_, i) => [s + r * Math.cos((i / 12) * Math.PI * 2), 11.8 + r * Math.sin((i / 12) * Math.PI * 2)] as [number, number])
  onWall(trim, f[0], f[1], ring(0.62), 0.04)
  onWall(win, f[0], f[1], ring(0.45), 0.08)
}

// ── The east balcony and its door surround; the clock ──
box(trim, X, X + 1.3, -1.9, 1.9, 6.1, 6.5, trim, 0.1)
box(trim, X + 1.1, X + 1.3, -1.9, 1.9, 6.5, 7.4, trim, 0.05)
onWall(trim, E[0], E[1], [[5.2, 6.5], [8.6, 6.5], [8.6, 9.9], [6.9, 10.4], [5.2, 9.9]], 0.06)
onWall(win, E[0], E[1], rectShape(5.9, 7.9, 6.6, 9.6), 0.1)
{
  const disc = (r: number, z: number): [number, number][] => Array.from({ length: 16 }, (_, i) => [6.9 + r * Math.cos((i / 16) * Math.PI * 2), z + r * Math.sin((i / 16) * Math.PI * 2)])
  onWall(gold, E[0], E[1], disc(1.25, 14.9), 0.08)
  onWall(roof, E[0], E[1], disc(0.95, 14.9), 0.12)
  // gilded scrollwork either side of the clock
  onWall(gold, E[0], E[1], [[4.3, 14.5], [5.6, 14.2], [5.8, 15.0], [4.6, 15.3]], 0.08)
  onWall(gold, E[0], E[1], [[8.2, 14.2], [9.5, 14.5], [9.2, 15.3], [8.0, 15.0]], 0.08)
}
// West: the seal in the gable, gilded.
{
  const oval = (rx: number, rz: number): [number, number][] => Array.from({ length: 14 }, (_, i) => [6.9 + rx * Math.cos((i / 14) * Math.PI * 2), 15.0 + rz * Math.sin((i / 14) * Math.PI * 2)])
  onWall(roof, W[0], W[1], oval(1.4, 1.1), 0.08)
  onWall(gold, W[0], W[1], oval(0.9, 0.9), 0.12)
}

// ── Doorcases: cream pilasters, entablature and pediment, door leaves ──
function doorcase(f: [XY, XY], s: number, g: number, round = false) {
  const z1 = g + 4.2, d = 0.35
  // the frontispiece as a shallow solid block standing off the wall
  const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1]), t: XY = [(f[1][0] - f[0][0]) / L, (f[1][1] - f[0][1]) / L], nn: XY = [t[1], -t[0]]
  const P = (u: number, v: number): XY => [f[0][0] + t[0] * u + nn[0] * v, f[0][1] + t[1] * u + nn[1] * v]
  const a = P(s - 1.45, 0), b = P(s + 1.45, d)
  box(trim, Math.min(a[0], b[0]), Math.max(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[1], b[1]), 0, z1, trim, 0.08)
  const fa = P(0, d), fb = P(L, d)
  onWall(trim, fa, fb, round ? archShape(s, 3.3, z1 - 0.05, z1, 8) : [[s - 1.65, z1 - 0.05], [s + 1.65, z1 - 0.05], [s, z1 + 1.0]], 0.02)
  onWall(door, fa, fb, rectShape(s - 0.75, s + 0.75, g, g + 3.0), 0.03)
  onWall(win, fa, fb, rectShape(s - 0.75, s + 0.75, g + 3.15, g + 3.8), 0.03)
}
doorcase(S, 1.8 + 5 * bay, gnd(0))
doorcase(N, 1.8 + 5 * bay, gnd(0))
doorcase(W, 6.9, gnd(-X))

// ── Gilded figures on the gable shoulders ──
/** A rearing beast on the east shoulder at y = c, facing out along ±y. */
function beast(c: number, dir: number) {
  const x0 = X - 0.75, x1 = X - 0.05, z = SHOULDER + 0.25
  box(trim, x0 - 0.1, x1 + 0.1, c - 0.5, c + 0.5, z, z + 0.45, trim, 0.08) // plinth
  // hind legs, body rising toward the gable, head, a raised foreleg
  const P = (u: number, h: number): [number, number] => [c + dir * u * 1.3, z + 0.45 + h * 1.25]
  const poly = (pts: [number, number][]) => extrudeX(gold, x0, x1, dir > 0 ? pts : ([...pts].reverse() as [number, number][]))
  poly([P(-0.35, 0), P(0.05, 0), P(0.0, 0.8), P(-0.35, 0.6)])
  poly([P(-0.4, 0.55), P(0.0, 0.75), P(-0.45, 1.6), P(-0.75, 1.35)])
  poly([P(-0.75, 1.35), P(-0.45, 1.6), P(-0.55, 2.05), P(-0.85, 1.85)])
  poly([P(-0.5, 1.2), P(-0.3, 1.3), P(-0.85, 1.05), P(-0.9, 0.95)])
}
beast(-Y + 0.6, -1) // the lion, south, rearing toward the clock
beast(Y - 0.6, 1) // the unicorn, north
// West: gilded scrolls on the shoulders, the eagle on the peak.
for (const k of [-1, 1]) {
  const y0 = k * (Y - 0.35)
  extrudeX(gold, -X + 0.05, -X + 0.55, (k < 0
    ? [[y0 - 0.3, SHOULDER + 0.25], [y0 + 0.9, SHOULDER + 0.25], [y0 + 0.5, SHOULDER + 1.3], [y0 - 0.3, SHOULDER + 1.0]]
    : [[y0 - 0.9, SHOULDER + 0.25], [y0 + 0.3, SHOULDER + 0.25], [y0 + 0.3, SHOULDER + 1.0], [y0 - 0.5, SHOULDER + 1.3]]) as [number, number][])
}
{
  const x0 = -X + 0.1, x1 = -X + 0.5
  revolve(gold, [-X + 0.3, 0], [[0, PEAK], [0.3, PEAK + 0.15], [0.3, PEAK + 0.45], [0, PEAK + 0.6]], 8, 0, false, false)
  extrudeX(gold, x0, x1, [[-0.25, PEAK + 0.5], [0.25, PEAK + 0.5], [0.2, PEAK + 1.4], [-0.2, PEAK + 1.4]])
  extrudeX(gold, x0, x1, [[0, PEAK + 0.9], [1.3, PEAK + 1.5], [1.1, PEAK + 2.0], [0, PEAK + 1.3]])
  extrudeX(gold, x0, x1, [[-1.3, PEAK + 1.5], [0, PEAK + 0.9], [0, PEAK + 1.3], [-1.1, PEAK + 2.0]])
}

// ── The steeple ──
{
  // square base with a round window each side
  box(trim, -2.7, 2.7, -2.7, 2.7, 14, 18.7, trim, 0.1)
  box(trim, -2.9, 2.9, -2.9, 2.9, 18.7, 19.1, trim, 0.15)
  const faces: [XY, XY][] = [[[-2.7, -2.7], [2.7, -2.7]], [[2.7, -2.7], [2.7, 2.7]], [[2.7, 2.7], [-2.7, 2.7]], [[-2.7, 2.7], [-2.7, -2.7]]]
  for (const [a, b] of faces) {
    const ring = Array.from({ length: 12 }, (_, i) => [2.7 + 0.5 * Math.cos((i / 12) * Math.PI * 2), 17.6 + 0.5 * Math.sin((i / 12) * Math.PI * 2)] as [number, number])
    onWall(win, a, b, ring, 0.04)
  }
  // the arched stage: a chamfered square
  const c = 0.45, h = 2.25
  const oct: XY[] = [[-h + c, -h], [h - c, -h], [h, -h + c], [h, h - c], [h - c, h], [-h + c, h], [-h, h - c], [-h, -h + c]]
  trim.loft([oct.map(([x, y]): V3 => [x, y, 19.1]), oct.map(([x, y]): V3 => [x, y, 24.0])])
  for (let i = 0; i < 8; i += 2) {
    const a = oct[i], b = oct[i + 1], w = Math.hypot(b[0] - a[0], b[1] - a[1])
    onWall(win, a, b, archShape(w / 2, 2.1, 19.7, 22.8, 8), 0.04)
    onWall(trim, a, b, rectShape(w / 2 - 0.09, w / 2 + 0.09, 19.8, 23.6), 0.07) // the mullion
  }
  // cornice and balustrade, with corner posts
  box(trim, -2.6, 2.6, -2.6, 2.6, 24.0, 24.45, trim, 0.15)
  box(trim, -2.4, 2.4, -2.4, 2.4, 24.45, 25.2, null, 0.05)
  box(trim, -2.1, 2.1, -2.1, 2.1, 24.45, 24.9, trim, 0)
  for (const [x, y] of [[-2.35, -2.35], [2.35, -2.35], [2.35, 2.35], [-2.35, 2.35]] as XY[]) box(trim, x - 0.25, x + 0.25, y - 0.25, y + 0.25, 25.2, 25.9, trim, 0.1)
  // the octagonal lantern with arched openings, its cornice
  revolve(trim, [0, 0], [[1.55, 24.9], [1.55, 27.7], [1.75, 27.7], [1.75, 28.0], [1.55, 28.0]], 8, Math.PI / 8, true, false)
  for (let i = 0; i < 8; i += 2) {
    const a0 = Math.PI / 8 + (i / 8) * Math.PI * 2, a1 = a0 + Math.PI / 4
    const a: XY = [1.55 * Math.cos(a0), 1.55 * Math.sin(a0)], b: XY = [1.55 * Math.cos(a1), 1.55 * Math.sin(a1)]
    onWall(win, a, b, archShape(0.59, 0.75, 25.5, 26.9, 6), 0.03)
  }
  // the gilded bell cap, ball and vane
  revolve(gold, [0, 0], [[1.55, 28.0], [1.45, 28.3], [1.0, 28.6], [0.5, 28.9], [0.2, 29.0], [0.32, 29.2], [0.32, 29.5], [0.08, 29.7], [0.08, 31.1], [0, 31.1]], 8, Math.PI / 8, false, true)
  box(gold, -0.05, 0.05, 0, 1.1, 30.3, 30.7, gold, 0)
}

// Night: the gable fronts and the steeple are floodlit.
const lit = (p: V3, n: V3) => (Math.abs(n[0]) > 0.7 && Math.abs(p[0]) > X - 0.8 ? 0.8 : 0)
await save('bos-old-state-house', 'Old State House', [
  { part: brick, material: { ...finish('osh-brick', 0xa85a48), floodlight: lit } },
  { part: trim, material: { ...finish('osh-cream', 0xf2e8d2), floodlight: (p, n) => (p[2] > 14 && n[2] < 0.7 ? 0.85 : lit(p, n)) } },
  { part: roof, material: finish('osh-slate', 0x8c959e) },
  { part: win, material: PALETTE.window },
  { part: gold, material: { ...finish('osh-gold', 0xd9b45e), floodlight: () => 0.8 } },
  { part: door, material: PALETTE.entrance },
], { height: 31.1, anchor: [42.3587304, -71.0574679], bearing: 357 })
