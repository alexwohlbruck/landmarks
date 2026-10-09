/**
 * San Francisco Ferry Building — original procedural geometry, CC0-1.0.
 * bun generators/sf-ferry-building.ts
 *
 * Frame: built turned to the building, BEARING 323.5 (its long axis runs
 * along the Embarcadero, 36.5° west of north). x across the building (+x = the
 * bay side, -x = the Embarcadero front facing Market Street), y along it
 * (+y = the north end), z up, metres. Origin = centroid of the OSM outline
 * way/558731934.
 *
 * Evidence
 * - OSM way/558731934 (outline, height 15) and its duplicate building:part
 *   way/24460886 (16.1 m): a 47.3 x 200.6 m rectangle with a central pavilion
 *   projecting 8.9 m towards the Embarcadero over 43 m. The tower parts
 *   way/404449724 and 406710833-839 (43.5 to 83.1 m, the last the flagpole)
 *   give the tower's position and an 11.2 x 11.9 m shaft.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 1 m (the building) and
 *   0.5 m (the tower): the ground along the Embarcadero front is 2.9 m NAVD88,
 *   the lowest under the outline, so y = 0 is there. Walls and eaves at 14-15
 *   m; two gabled roofs, the main one's ridge 20 m over x = -6 and a lower one
 *   18 m over x = +9.5 (the two gables seen at the north end); the pavilion
 *   17-18 m. Tower: wide stage (belfry cornice and attic) to ~57 m, an 8-9 m
 *   stage to ~67 m, the round lantern to ~72 m, drum to ~77 m, dome top ~80
 *   m; the flag streams above it. The top stage widths match the photos when
 *   the shaft is ~12.5 m wide, a little wider than OSM's part; the lidar's
 *   14.4 m at the belfry cornice includes the cornice's projection. Doubt:
 *   scaled that way the photo puts the belfry cornice and attic at 59-63 m,
 *   where the lidar's wide stage ends at ~57; the photo's proportions won.
 * - Published (Wikipedia, NRHP, SF Landmark No. 90): 1898, A. Page Brown;
 *   the tower is modelled on the Giralda in Seville, 245 ft (75 m), with four
 *   clock faces; the head-house is 660 ft long, two storeys, with a skylit
 *   nave down its length.
 * - Commons daylight photos: "San Francisco Ferry Building (cropped).jpg"
 *   (JaGa, CC BY-SA 4.0, the Embarcadero front from above Market Street);
 *   "Ferry Building San Francisco from Hyatt Regency with R-Evolution and Bay
 *   Bridge 2026 dllu.jpg" (Daniel Lu, CC BY-SA 4.0, same side, higher);
 *   "San Francisco Ferry Building 2017.jpg" (Dllu, CC BY-SA 4.0, the
 *   pavilion and tower head-on, used for the tower's stages); "San Francisco
 *   Ferry Building January 2013 002.jpg" (King of Hearts, CC BY-SA 3.0, the
 *   tower close up); "Ferry Building clock tower as seen from the North.jpg"
 *   (Frank Schulenburg, CC BY-SA 4.0, the bay side with its lunette arcade);
 *   "View of the Ferry Building from Pier 1, San Francisco dllu.jpg" (Dllu, CC
 *   BY-SA 4.0, the north end's gables, at dusk).
 *
 * Estimated from the photos: the tower's stages, scaled from the head-on
 * photo with the shaft 12.5 m wide and the dome's top at the lidar's 80 m
 * (the clock 8 m across at 42 m, the frieze windows, the five-bay belfry,
 * the three-bay upper stage, the lantern's colonnade, the bronze dome and the
 * corner balls); the Embarcadero front's rhythm (17 bays a wing, arcade below
 * and arched windows above), the pavilion's three great arched windows, the
 * bay side's 22 lunettes over a glazed ground storey, the end gables' arched
 * windows, the skylight strip along the main ridge. The rooftop "PORT OF SAN
 * FRANCISCO" sign is left out (lettering).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const BEARING = 323.5
const ANCHOR = { lng: -122.39343978, lat: 37.79553247 }
const stone = new Part(), win = new Part(), roof = new Part(), trim = new Part(), bronze = new Part(), sky = new Part()
const up: V3 = [0, 0, 1]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return v.map((n) => n / l) as V3 }

// --- Plan (x across, y along) ---
const X0 = -22.6, X1 = 24.7, Y0 = -100.3, Y1 = 100.3
const PX = -31.4, PY0 = -20.6, PY1 = 22.5 // the pavilion
const TC: XY = [-17.2, (PY0 + PY1) / 2] // tower centre, on the pavilion's axis

// --- Heights ---
const EAVE = 15, RIDGE_A = 20, RIDGE_B = 18, XA = -6, XB = 9.5, XV = 2.5, VALLEY = 15.6
const PAV = 18

// --- Helpers ---
type Seg = { a: XY; t: XY; n: XY; len: number }
function seg(a: XY, b: XY): Seg {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
  return { a, t, n: [t[1], -t[0]], len }
}
const P = (g: Seg, s: number, d: number, z: number): V3 => [g.a[0] + g.t[0] * s + g.n[0] * d, g.a[1] + g.t[1] * s + g.n[1] * d, z]
function wall(part: Part, g: Seg, s0: number, s1: number, z0: number, z1: number, d = 0) {
  part.quad(P(g, s0, d, z0), P(g, s1, d, z0), P(g, s1, d, z1), P(g, s0, d, z1))
}
const pane = (part: Part, g: Seg, s0: number, s1: number, z0: number, z1: number, d = 0) => wall(part, g, s0, s1, z0, z1, d + 0.05)
/** A round-headed panel (semicircular head of its own width), flush on the face. */
function arched(part: Part, g: Seg, sc: number, w: number, z0: number, z1: number, d = 0, seg = 8) {
  const r = w / 2, spring = Math.max(z0, z1 - r), o = d + 0.05
  const pts: V3[] = [P(g, sc, o, (z0 + spring) / 2), P(g, sc - r, o, z0), P(g, sc + r, o, z0)]
  for (let k = 0; k <= seg; k++) pts.push(P(g, sc + r * Math.cos((k * Math.PI) / seg), o, spring + r * Math.sin((k * Math.PI) / seg)))
  pts.push(P(g, sc - r, o, z0))
  for (let i = 1; i < pts.length - 1; i++) part.tri(pts[0], pts[i], pts[i + 1])
}
/** A moulding along a face: (d, z) profile out, up and back in, with end caps. */
function band(part: Part, g: Seg, s0: number, s1: number, prof: [number, number][]) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [d0, z0] = prof[k], [d1, z1] = prof[k + 1]
    part.quad(P(g, s0, d0, z0), P(g, s1, d0, z0), P(g, s1, d1, z1), P(g, s0, d1, z1))
  }
  const fan = (pts: V3[]) => { for (let i = 1; i < pts.length - 1; i++) part.tri(pts[0], pts[i], pts[i + 1]) }
  fan(prof.map(([d, z]) => P(g, s0, d, z)))
  fan([...prof].reverse().map(([d, z]) => P(g, s1, d, z)))
}
/** An axis-aligned box with chamfered vertical edges. */
function block(part: Part, cx: number, cy: number, hx: number, hy: number, z0: number, z1: number, ch = 0.3, top: Part | null = part, bottom = false) {
  const r: XY[] = [[cx - hx + ch, cy - hy], [cx + hx - ch, cy - hy], [cx + hx, cy - hy + ch], [cx + hx, cy + hy - ch], [cx + hx - ch, cy + hy], [cx - hx + ch, cy + hy], [cx - hx, cy + hy - ch], [cx - hx, cy - hy + ch]]
  for (let i = 0; i < 8; i++) {
    const a = r[i], b = r[(i + 1) % 8]
    part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (top) for (let i = 1; i < 7; i++) top.tri([r[0][0], r[0][1], z1], [r[i][0], r[i][1], z1], [r[i + 1][0], r[i + 1][1], z1])
  if (bottom) for (let i = 1; i < 7; i++) part.tri([r[0][0], r[0][1], z0], [r[i + 1][0], r[i + 1][1], z0], [r[i][0], r[i][1], z0])
}
/** A solid of revolution about (cx, cy). */
function lathe(part: Part, prof: [number, number][], cx: number, cy: number, seg = 16, phase = 0) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const dr = r1 - r0, dz = z1 - z0, l = Math.hypot(dr, dz) || 1
    for (let i = 0; i < seg; i++) {
      const t0 = phase + (i / seg) * 2 * Math.PI, t1 = phase + ((i + 1) / seg) * 2 * Math.PI
      const p = (r: number, z: number, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
      const nn = (t: number): V3 => unit([(Math.cos(t) * dz) / l, (Math.sin(t) * dz) / l, -dr / l])
      if (r1 < 1e-6) { part.tri(p(r0, z0, t0), p(r0, z0, t1), [cx, cy, z1], undefined, undefined, undefined, [nn(t0), nn(t1), up]); continue }
      part.tri(p(r0, z0, t0), p(r0, z0, t1), p(r1, z1, t1), undefined, undefined, undefined, [nn(t0), nn(t1), nn(t1)])
      part.tri(p(r0, z0, t0), p(r1, z1, t1), p(r1, z1, t0), undefined, undefined, undefined, [nn(t0), nn(t1), nn(t0)])
    }
  }
}
function ball(part: Part, c: V3, r: number) {
  const prof: [number, number][] = []
  for (let k = 0; k <= 4; k++) { const t = -Math.PI / 2 + (k * Math.PI) / 4; prof.push([k === 0 || k === 4 ? 0 : r * Math.cos(t), c[2] + r + r * Math.sin(t)]) }
  prof[0][0] = 1e-4
  lathe(part, prof, c[0], c[1], 8)
}

// ---------------------------------------------------------------------------
// Head-house: walls to the eaves, two gabled roofs, gable ends.
const roofZ = (x: number) =>
  x <= XA ? EAVE + ((RIDGE_A - EAVE) * (x - X0)) / (XA - X0)
    : x <= XV ? RIDGE_A + ((VALLEY - RIDGE_A) * (x - XA)) / (XV - XA)
      : x <= XB ? VALLEY + ((RIDGE_B - VALLEY) * (x - XV)) / (XB - XV)
        : RIDGE_B + ((EAVE - RIDGE_B) * (x - XB)) / (X1 - XB)
const PROFILE: XY[] = [[X0, EAVE], [XA, RIDGE_A], [XV, VALLEY], [XB, RIDGE_B], [X1, EAVE]]

const WEST_S = seg([X0, Y1], [X0, Y0]) // the Embarcadero front, walked south so its normal points -x
const EAST = seg([X1, Y0], [X1, Y1])
const NORTH = seg([X1, Y1], [X0, Y1])
const SOUTH = seg([X0, Y0], [X1, Y0])

wall(stone, EAST, 0, EAST.len, 0, EAVE)
wall(stone, WEST_S, 0, WEST_S.len, 0, EAVE)
for (const [g, y] of [[NORTH, Y1], [SOUTH, Y0]] as [Seg, number][]) {
  wall(stone, g, 0, g.len, 0, EAVE)
  // the gable triangles above the eaves
  const north = y === Y1
  for (let k = 0; k < PROFILE.length - 1; k++) {
    const [xa, za] = PROFILE[k], [xb, zb] = PROFILE[k + 1]
    const A: V3 = [xa, y, EAVE], B: V3 = [xb, y, EAVE], At: V3 = [xa, y, za], Bt: V3 = [xb, y, zb]
    if (north) stone.quad(B, A, At, Bt)
    else stone.quad(A, B, Bt, At)
  }
}
// roof planes, with a 0.6 m overhang at the gable ends and a skylight strip down the main ridge
{
  const ya = Y0 - 0.5, yb = Y1 + 0.5
  for (let k = 0; k < PROFILE.length - 1; k++) {
    const [xa, za] = PROFILE[k], [xb, zb] = PROFILE[k + 1]
    roof.quad([xa, ya, za + 0.05], [xb, ya, zb + 0.05], [xb, yb, zb + 0.05], [xa, yb, za + 0.05])
  }
  // skylights either side of the main ridge
  const s0 = XA - 4.5, s1 = XA + 3.5
  for (const [xa, xb] of [[s0, XA], [XA, s1]]) {
    for (const [y0, y1] of [[-88, -24], [24, 88]]) sky.quad([xa, y0, roofZ(xa) + 0.1], [xb, y0, roofZ(xb) + 0.1], [xb, y1, roofZ(xb) + 0.1], [xa, y1, roofZ(xa) + 0.1])
  }
  // undersides of the overhang
  for (const y of [ya, yb]) for (let k = 0; k < PROFILE.length - 1; k++) {
    const [xa, za] = PROFILE[k], [xb, zb] = PROFILE[k + 1], yy = y < 0 ? Y0 : Y1
    const q: V3[] = [[xa, y, za + 0.05], [xb, y, zb + 0.05], [xb, yy, zb + 0.05], [xa, yy, za + 0.05]]
    if (y < 0) roof.quad(q[1], q[0], q[3], q[2]); else roof.quad(q[0], q[1], q[2], q[3])
    // fascia
    const f: V3[] = [[xa, y, za - 0.45], [xb, y, zb - 0.45], [xb, y, zb + 0.05], [xa, y, za + 0.05]]
    if (y < 0) trim.quad(f[0], f[1], f[2], f[3]); else trim.quad(f[1], f[0], f[3], f[2])
  }
}
// eaves cornices and a low parapet on the long fronts
for (const g of [EAST, WEST_S]) band(trim, g, -0.5, g.len + 0.5, [[0, EAVE - 1.6], [0.45, EAVE - 1.3], [0.45, EAVE - 0.7], [0, EAVE - 0.7]])
for (const g of [NORTH, SOUTH]) band(trim, g, -0.5, g.len + 0.5, [[0, EAVE - 1.6], [0.45, EAVE - 1.3], [0.45, EAVE - 0.7], [0, EAVE - 0.7]])
// string course between the storeys, all round
for (const g of [EAST, WEST_S, NORTH, SOUTH]) band(trim, g, -0.3, g.len + 0.3, [[0, 5.3], [0.3, 5.3], [0.3, 5.9], [0, 5.9]])

// --- The Embarcadero front: 17 bays a wing, arcade below, arched windows above ---
{
  const g = WEST_S // s = 0 at the north end (y = Y1), running south
  const sPav0 = Y1 - PY1, sPav1 = Y1 - PY0
  const wing = (s0: number, s1: number) => {
    const n = 17, w = (s1 - s0) / n
    for (let k = 0; k < n; k++) {
      const sc = s0 + w * (k + 0.5)
      arched(win, g, sc, 2.6, 0.3, 4.6) // the arcade
      arched(win, g, sc, 2.5, 6.6, 12.2) // upper windows
    }
  }
  wing(0.8, sPav0 - 0.6)
  wing(sPav1 + 0.6, g.len - 0.8)
}
// --- The bay side: 22 lunettes over a glazed ground storey ---
{
  const g = EAST, n = 22, w = g.len / n
  for (let k = 0; k < n; k++) {
    const sc = w * (k + 0.5)
    arched(win, g, sc, w - 1.6, 6.4, 6.4 + (w - 1.6) / 2 + 0.6, 0, 10)
    pane(win, g, sc - (w - 1.6) / 2, sc + (w - 1.6) / 2, 1.0, 4.9)
  }
}
// --- The ends: the arcade rhythm, and a big lunette in each gable ---
for (const g of [NORTH, SOUTH]) {
  const n = 10, w = g.len / n
  for (let k = 0; k < n; k++) {
    const sc = w * (k + 0.5)
    arched(win, g, sc, 2.6, 0.3, 4.6)
    arched(win, g, sc, 2.5, 6.6, 12.2)
  }
  // gable lunettes: centred under each ridge (s measured along the end wall)
  const sOf = (x: number) => (g === NORTH ? X1 - x : x - X0)
  arched(win, g, sOf(XA), 7, 13.2, 17.6, 0, 10)
  arched(win, g, sOf(XB), 5, 13.6, 16.3, 0, 10)
}

// --- The central pavilion ---
{
  const front = seg([PX, PY1], [PX, PY0]) // facing the Embarcadero
  const north = seg([X0, PY1], [PX, PY1]), south = seg([PX, PY0], [X0, PY0])
  wall(stone, front, 0, front.len, 0, PAV)
  wall(stone, north, 0, north.len, 0, PAV)
  wall(stone, south, 0, south.len, 0, PAV)
  // roof, with a parapet lip
  block(trim, (PX + X0) / 2 - 0.25, (PY0 + PY1) / 2, (X0 - PX) / 2 + 0.25, (PY1 - PY0) / 2 + 0.25, PAV - 0.9, PAV, 0.3, null)
  roof.quad([PX + 0.4, PY0 + 0.4, PAV - 0.3], [X0, PY0 + 0.4, PAV - 0.3], [X0, PY1 - 0.4, PAV - 0.3], [PX + 0.4, PY1 - 0.4, PAV - 0.3])
  for (const [a, b] of [[[PX + 0.4, PY1 - 0.4], [PX + 0.4, PY0 + 0.4]], [[PX + 0.4, PY0 + 0.4], [X0, PY0 + 0.4]], [[X0, PY1 - 0.4], [PX + 0.4, PY1 - 0.4]]] as [XY, XY][]) {
    stone.quad([a[0], a[1], PAV - 0.3], [b[0], b[1], PAV - 0.3], [b[0], b[1], PAV], [a[0], a[1], PAV])
    stone.quad([b[0], b[1], PAV - 0.3], [a[0], a[1], PAV - 0.3], [a[0], a[1], PAV], [b[0], b[1], PAV])
  }
  band(trim, front, -0.3, front.len + 0.3, [[0, 14.6], [0.45, 14.9], [0.45, 15.6], [0, 15.6]])
  band(trim, front, -0.3, front.len + 0.3, [[0, 5.3], [0.3, 5.3], [0.3, 5.9], [0, 5.9]])
  // three great arched windows over three openings, between paired pilasters
  const mid = front.len / 2
  for (const k of [-1, 0, 1]) {
    const sc = mid + k * 9.4
    arched(win, front, sc, 7.4, 7.0, 14.0, 0, 12)
    pane(win, front, sc - 2.6, sc + 2.6, 0, 4.8)
    for (const side of [-1, 1]) {
      const sp = sc + side * 4.7
      if (Math.abs(k) === 1 && side === k) continue
      band(trim, front, sp - 0.9, sp + 0.9, [[0, 0], [0.35, 0], [0.35, 14.6], [0, 14.6]])
    }
  }
  // the end bays: pilasters and small square windows
  for (const side of [-1, 1]) {
    const sp = mid + side * 14.1
    band(trim, front, sp - 1.0, sp + 1.0, [[0, 0], [0.35, 0], [0.35, 14.6], [0, 14.6]])
    const se = mid + side * 18.3
    pane(win, front, se - 1.0, se + 1.0, 9.5, 12.0)
    pane(win, front, se - 1.0, se + 1.0, 6.7, 8.6)
    arched(win, front, se, 2.4, 0.3, 4.4)
  }
  for (const g of [north, south]) {
    arched(win, g, g.len / 2, 2.4, 6.8, 12.0)
    arched(win, g, g.len / 2, 2.4, 0.3, 4.4)
  }
}

// ---------------------------------------------------------------------------
// The tower, after the Giralda: shaft with clock faces, frieze, belfry,
// attic, stepped upper stage, round lantern, drum and bronze dome.
const [tx, ty] = TC
const HS = 6.25 // shaft half width
const faces = (h: number): Seg[] => [
  seg([tx - h, ty + h], [tx - h, ty - h]), // west (Embarcadero)
  seg([tx - h, ty - h], [tx + h, ty - h]), // south
  seg([tx + h, ty - h], [tx + h, ty + h]), // east (bay)
  seg([tx + h, ty + h], [tx - h, ty + h]), // north
]
const Z = {
  shaft: 51.5, frieze0: 49.5, frieze1: 50.8, cornice: 53.0, belfry: 59.7, bcornice: 61.1, attic: 62.8,
  step: 65.0, upper: 69.8, ucornice: 70.6, lantern: 74.3, ring: 75.2, drum: 78.3, dome: 79.8, top: 80.6,
}
block(stone, tx, ty, HS, HS, PAV - 1, Z.shaft, 0.4, null)
for (const g of faces(HS)) {
  // the clock: a pale disc with a darker chapter ring, flush on the face
  const sc = g.len / 2, zc = 42.1, R = 4.0, n = 20
  const pt = (r: number, a: number, o: number) => P(g, sc + r * Math.cos(a), o, zc + r * Math.sin(a))
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * 2 * Math.PI, a1 = ((i + 1) / n) * 2 * Math.PI
    bronze.quad(pt(R, a0, 0.05), pt(R, a1, 0.05), pt(R - 0.55, a1, 0.05), pt(R - 0.55, a0, 0.05))
    trim.tri(P(g, sc, 0.06, zc), pt(R - 0.55, a0, 0.06), pt(R - 0.55, a1, 0.06))
  }
  // slit windows below the clock
  pane(win, g, sc - 0.4, sc + 0.4, 33.6, 36.0)
  pane(win, g, sc - 3.2, sc - 2.4, 28.2, 30.6)
  pane(win, g, sc + 2.4, sc + 3.2, 28.2, 30.6)
  // frieze: a band of small windows under the cornice
  for (let k = 0; k < 6; k++) { const s = 1.6 + k * ((g.len - 3.2) / 5); pane(win, g, s - 0.45, s + 0.45, Z.frieze0, Z.frieze1) }
}
// the shaft's top moulding under the frieze, and the frieze cornice
block(trim, tx, ty, HS + 0.2, HS + 0.2, 48.4, 49.1, 0.3, null, true)
block(trim, tx, ty, HS + 0.45, HS + 0.45, Z.shaft, Z.shaft + 0.6, 0.3, null, true)
block(trim, tx, ty, HS + 0.95, HS + 0.95, Z.shaft + 0.6, Z.cornice, 0.4, trim, true)
// belfry: corner piers and five openings a face
block(stone, tx, ty, HS - 0.1, HS - 0.1, Z.cornice, Z.belfry, 0.4, null)
block(trim, tx, ty, HS + 0.05, HS + 0.05, Z.cornice, Z.cornice + 0.3, 0.4, null)
for (const g of faces(HS - 0.1)) {
  const n = 5, w = (g.len - 2.6) / n
  for (let k = 0; k < n; k++) pane(win, g, 1.3 + k * w + 0.22, 1.3 + (k + 1) * w - 0.22, Z.cornice + 0.7, Z.belfry - 0.3)
}
block(trim, tx, ty, HS + 0.5, HS + 0.5, Z.belfry, Z.bcornice, 0.35, trim, true)
// attic with bronze balls at the corners
block(stone, tx, ty, HS + 0.05, HS + 0.05, Z.bcornice, Z.attic, 0.35, stone)
for (const sx of [-1, 1]) for (const sy of [-1, 1]) ball(bronze, [tx + sx * (HS - 0.7), ty + sy * (HS - 0.7), Z.attic], 0.55)
// stepped stage, then the upper colonnade stage
block(stone, tx, ty, 4.8, 4.8, Z.attic, Z.step, 0.3, stone)
block(stone, tx, ty, 3.9, 3.9, Z.step, Z.upper, 0.3, null)
for (const g of faces(3.9)) {
  const n = 3, w = (g.len - 2.0) / n
  for (let k = 0; k < n; k++) pane(win, g, 1.0 + k * w + 0.25, 1.0 + (k + 1) * w - 0.25, Z.step + 0.6, Z.upper - 0.5)
}
block(trim, tx, ty, 4.15, 4.15, Z.upper, Z.ucornice, 0.3, trim, true)
for (const sx of [-1, 1]) for (const sy of [-1, 1]) ball(bronze, [tx + sx * 3.6, ty + sy * 3.6, Z.ucornice], 0.4)
// the round lantern: a drum with dark openings between columns, an ornament ring, an upper drum and the dome
lathe(stone, [[2.8, Z.ucornice], [2.8, Z.lantern]], tx, ty, 16)
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * 2 * Math.PI + Math.PI / 8, da = 0.24
  const q = (t: number, z: number): V3 => [tx + 2.85 * Math.cos(t), ty + 2.85 * Math.sin(t), z]
  win.quad(q(a - da, Z.ucornice + 0.6), q(a + da, Z.ucornice + 0.6), q(a + da, Z.lantern - 0.6), q(a - da, Z.lantern - 0.6))
}
lathe(trim, [[2.8, Z.lantern], [3.05, Z.lantern + 0.3], [3.05, Z.ring], [1.65, Z.ring]], tx, ty, 16)
lathe(stone, [[1.65, Z.ring], [1.65, Z.drum]], tx, ty, 12)
for (let i = 0; i < 6; i++) {
  const a = (i / 6) * 2 * Math.PI, da = 0.2
  const q = (t: number, z: number): V3 => [tx + 1.7 * Math.cos(t), ty + 1.7 * Math.sin(t), z]
  win.quad(q(a - da, Z.ring + 0.6), q(a + da, Z.ring + 0.6), q(a + da, Z.drum - 0.6), q(a - da, Z.drum - 0.6))
}
{
  const prof: [number, number][] = [[1.95, Z.drum], [1.95, Z.drum + 0.25]]
  for (let k = 1; k <= 5; k++) { const t = (k / 5) * (Math.PI / 2); prof.push([0.25 + 1.7 * Math.cos(t), Z.drum + 0.25 + (Z.dome - Z.drum - 0.25) * Math.sin(t)]) }
  lathe(bronze, prof, tx, ty, 12)
  lathe(bronze, [[0.25, Z.dome], [0.25, Z.top - 0.3], [0.0, Z.top]], tx, ty, 6)
}

// Close the bottom so the shadow pass sees a solid.
stone.quad([X0, Y0, 0], [X0, Y1, 0], [X1, Y1, 0], [X1, Y0, 0])
stone.quad([PX, PY0, 0], [PX, PY1, 0], [X0, PY1, 0], [X0, PY0, 0])

const parts = [
  { part: stone, material: finish('ferry-sandstone', 0xe9e5dc) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: trim, material: PALETTE.trim },
  { part: bronze, material: finish('bronze', 0x8f7a5c) },
  { part: sky, material: PALETTE.glass },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('San Francisco Ferry Building', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: Z.top,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/558731934', 'way/24460886', 'way/404449724', 'way/406710833', 'way/406710834', 'way/406710835', 'way/406710836', 'way/406710837', 'way/406710838', 'way/406710839'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-ferry-building.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB), top ${Z.top.toFixed(1)} m`)
