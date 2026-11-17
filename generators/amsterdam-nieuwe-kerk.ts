/**
 * Nieuwe Kerk, Dam, Amsterdam — procedural, CC0-1.0, no textures.
 * bun generators/amsterdam-nieuwe-kerk.ts
 *
 * The late-Gothic church beside the palace (begun c. 1380, rebuilt after
 * the fires of 1421, 1452 and 1645). It never got its west tower: only the
 * slender crossing turret (dakruiter) rises from the roofs.
 *
 * Map frame: x = model east, y = model north, z up, metres. Model north is
 * the choir (liturgical east, true ENE); +x is the south transept front on
 * the Dam. Placed at bearing 71.7°, the nave's axis (OSM 747911441).
 * Anchor: area centroid of the OSM church outline way/220749328 (the BAG
 * church building; the houses built against the church are separate BAG
 * buildings and are not modelled or replaced).
 *
 * Evidence
 * - OSM way/220749328 (outline) and its parts: nave 747911441 and transept
 *   747911439 (34 m, gabled, roof 10 m), aisles 747911438 (15 m), side
 *   chapels 747911435/436/437, 747924617/618/619/626 (19 m, hipped), the
 *   apse roof 747911440, the ambulatory 174987150 (15 m) and its radiating
 *   chapels 747924621–625 (19 m), the two stair turrets at the west end
 *   748997143/144 (34 m, copper spires).
 * - Published (nl.wikipedia, Nieuwe Kerk (Amsterdam)): nave of five bays,
 *   transept among the oldest parts, the north arm raised 1530–1540, the
 *   west tower founded 1565 and 1646, stopped 1653, mostly demolished 1783.
 *   No published heights were found.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   - C messier, "Amsterdam Nieuwe Kerk 1697.jpg", CC BY-SA 4.0 — the south
 *     transept front from the Dam, the nave, the crossing turret.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_Nieuwe_Kerk_1697.jpg
 *   - Zairon, "Amsterdam Nieuwe Kerk 1–6.jpg", CC BY-SA 4.0 — the Dam front
 *     (5, 6), the north side over the houses on the Gravenstraat (1–4).
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_Nieuwe_Kerk_5.jpg
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_Nieuwe_Kerk_6.jpg
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_Nieuwe_Kerk_1.jpg
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_Nieuwe_Kerk_3.jpg
 *   - Zairon, "Amsterdam Nieuwe Kerk Chor 2.jpg", CC BY-SA 4.0 — the choir's
 *     banded brick, buttresses, tall windows and openwork parapet.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_Nieuwe_Kerk_Chor_2.jpg
 *
 * Estimated (photo-scaled to OSM's 15 m transept width): walls to 25 m,
 * ridges 36.5 m (OSM 34 looked low against the steep transept gable in
 * messier's photo: its rise is about 1.6 × its half width), aisles 13 m,
 * chapels 14 m to hipped roofs at 19 m (OSM), the crossing turret: a
 * square base on the ridge, an open octagonal lantern to 42.5 m, a needle
 * spire to about 55 m and a cross. The great south window, the clerestory
 * and aisle windows by bay from the photos. The ambulatory's radiating
 * chapels are drawn as one polygonal aisle under a sloping roof.
 *
 * Colour: dark red-brown brick banded with pale sandstone (messier, Chor 2),
 * pulled to the palette's lightness; the south transept front is all pale
 * sandstone; dark slate roofs; lead-grey turret and spire.
 *
 * Doubts: the west end (the stub of the unbuilt tower on the Nieuwezijds
 * Voorburgwal) and the north transept front are not in the photos used;
 * both are drawn plainly, the north front mirroring the south's window in
 * brick. The houses built against the church hide its lower walls in
 * reality; the model shows the church whole.
 *
 * Night: the Dam front is floodlit; the stone carries a floodlight wash,
 * strongest on the south transept.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, circle, type XY, spire } from './nyc-570-lexington'
import { block, wallFrame, band } from './nyc-city-hall'

const brick = new Part(), stone = new Part(), win = new Part(), roof = new Part(), lead = new Part(), gilt = new Part()

/** A pointed (equilateral) arch panel on a wall a→b: two true arcs over a rectangle. */
export function pointed(p: Part, a: XY, b: XY, s: number, w: number, z0: number, zTop: number, d = 0.06, segs = 5) {
  const f = wallFrame(a, b, d), h = (w * Math.sqrt(3)) / 2, spring = zTop - h
  const pts: [number, number][] = [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, spring]]
  for (let i = 1; i <= segs; i++) { const t = (i / segs) * (Math.PI / 3); pts.push([s - w / 2 + w * Math.cos(t), spring + w * Math.sin(t)]) }
  for (let i = segs - 1; i >= 0; i--) { const t = (i / segs) * (Math.PI / 3); pts.push([s + w / 2 - w * Math.cos(t), spring + w * Math.sin(t)]) }
  const c: [number, number] = [s, (z0 + spring) / 2]
  for (let i = 0; i < pts.length; i++) {
    const A = pts[i], B = pts[(i + 1) % pts.length]
    if (Math.hypot(A[0] - B[0], A[1] - B[1]) < 1e-6) continue
    p.tri(f.at(c[0], c[1]), f.at(A[0], A[1]), f.at(B[0], B[1]))
  }
}

/** A gabled roof over x0..x1, y0..y1 with eaves at z0 and ridge at z0 + h; gable walls in `gw`. */
export function gableRoof(rf: Part, gw: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, h: number, alongY: boolean, o = 0.4) {
  if (alongY) {
    const cx = (x0 + x1) / 2
    rf.quad([x1 + o, y0, z0 - o * 0.6], [x1 + o, y1, z0 - o * 0.6], [cx, y1, z0 + h], [cx, y0, z0 + h])
    rf.quad([x0 - o, y1, z0 - o * 0.6], [x0 - o, y0, z0 - o * 0.6], [cx, y0, z0 + h], [cx, y1, z0 + h])
    if (gw) { gw.tri([x0, y0, z0], [x1, y0, z0], [cx, y0, z0 + h]); gw.tri([x1, y1, z0], [x0, y1, z0], [cx, y1, z0 + h]) }
  } else {
    const cy = (y0 + y1) / 2
    rf.quad([x0, y0 - o, z0 - o * 0.6], [x1, y0 - o, z0 - o * 0.6], [x1, cy, z0 + h], [x0, cy, z0 + h])
    rf.quad([x1, y1 + o, z0 - o * 0.6], [x0, y1 + o, z0 - o * 0.6], [x0, cy, z0 + h], [x1, cy, z0 + h])
    if (gw) { gw.tri([x1, y0, z0], [x1, y1, z0], [x1, cy, z0 + h]); gw.tri([x0, y1, z0], [x0, y0, z0], [x0, cy, z0 + h]) }
  }
}

/** A square pinnacle: a shaft and a pyramid cap. */
export function pinnacle(p: Part, x: number, y: number, r: number, z0: number, z1: number, tip: number) {
  block(p, x - r, y - r, x + r, y + r, z0, z1)
  const q: V3[] = [[x - r * 1.15, y - r * 1.15, z1], [x + r * 1.15, y - r * 1.15, z1], [x + r * 1.15, y + r * 1.15, z1], [x - r * 1.15, y + r * 1.15, z1]]
  for (let i = 0; i < 4; i++) p.tri(q[i], q[(i + 1) % 4], [x, y, tip])
}

/** A hipped roof over a rectangle (ridge along the longer side). */
function hip(x0: number, y0: number, x1: number, y1: number, z0: number, zt: number) {
  const w = x1 - x0, d = y1 - y0, k = Math.min(w, d) / 2, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  const A: V3 = [x0, y0, z0], B: V3 = [x1, y0, z0], C: V3 = [x1, y1, z0], D: V3 = [x0, y1, z0]
  if (w >= d) { const r0: V3 = [x0 + k, cy, zt], r1: V3 = [x1 - k, cy, zt]; roof.quad(A, B, r1, r0); roof.quad(C, D, r0, r1); roof.tri(B, C, r1); roof.tri(D, A, r0) }
  else { const r0: V3 = [cx, y0 + k, zt], r1: V3 = [cx, y1 - k, zt]; roof.quad(B, C, r1, r0); roof.quad(D, A, r0, r1); roof.tri(A, B, r0); roof.tri(C, D, r1) }
}

const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// ------------------------------------------------------------------ plan
const NX0 = -5.8, NX1 = 9.1, NC = (NX0 + NX1) / 2 // nave walls (15 m)
const W0 = -43.0, CH = 24.5 // west front, start of the apse
const TY0 = -10.8, TY1 = 3.8, TC = (TY0 + TY1) / 2 // transept walls (14.6 m)
const TX0 = -27.6, TX1 = 29.8 // transept ends; +x is the Dam front
const AX0 = -12.6, AX1 = 15.6 // aisle walls
const EAVE = 25, RIDGE = 36.5, AISLE = 13

// Nave and choir (brick to the eaves), transept, aisles.
prism({ wall: brick, win: null, roof: null, ring: rect(NX0, W0, NX1, CH), z0: 0, z1: EAVE, facade: null, bevel: 0.3 })
prism({ wall: brick, win: null, roof: null, ring: rect(TX0, TY0, TX1, TY1), z0: 0, z1: EAVE, facade: null, bevel: 0.3 })
for (const [x0, x1] of [[AX0, NX0 + 0.1], [NX1 - 0.1, AX1]]) {
  prism({ wall: brick, win: null, roof: null, ring: rect(x0, W0 + 0.5, x1, CH - 1), z0: 0, z1: AISLE, facade: null, bevel: 0.3 })
  // lean-to roofs from the aisle wall up to the clerestory
  const out = x0 < 0 ? x0 : x1, inn = x0 < 0 ? NX0 : NX1
  const s = Math.sign(out - inn)
  for (const [y0, y1] of [[W0 + 0.5, TY0], [TY1, CH - 1]]) {
    const q: V3[] = [[out + s * 0.4, y0, AISLE - 0.2], [out + s * 0.4, y1, AISLE - 0.2], [inn, y1, AISLE + 4.2], [inn, y0, AISLE + 4.2]]
    if (s > 0) roof.quad(q[0], q[1], q[2], q[3]); else roof.quad(q[1], q[0], q[3], q[2])
    // the lean-to's end triangles
    const e = (y: number, f: boolean) => { const t: V3[] = [[out, y, AISLE], [inn, y, AISLE], [inn, y, AISLE + 4.2]]; if (f !== s > 0) brick.tri(t[0], t[1], t[2]); else brick.tri(t[0], t[2], t[1]) }
    e(y0, false); e(y1, true)
  }
}

// Side chapels (OSM, 19 m hipped) between the aisles and the street lines.
const chapels: [number, number, number, number][] = [
  [AX1 - 0.1, -23.9, 24.4, TY0], [AX1 - 0.1, TY1 + 0.5, 23.1, 20.8],
  [-22.7, -22.9, AX0 + 0.1, TY0], [-21.2, TY1 + 0.5, AX0 + 0.1, 28.0],
]
for (const [x0, y0, x1, y1] of chapels) {
  prism({ wall: brick, win: null, roof: null, ring: rect(x0, y0, x1, y1), z0: 0, z1: 14, facade: null, bevel: 0.3 })
  hip(x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, 13.8, 19)
}

// Choir apse (five sides of a decagon) and the ambulatory round it.
const AC: XY = [NC, CH]
const pAt = (r: number, t: number, dy = 0): XY => [NC + r * Math.sin((t * Math.PI) / 180), CH + dy + r * Math.cos((t * Math.PI) / 180)]
const apse: XY[] = [90, 54, 18, -18, -54, -90].map((t) => pAt((NX1 - NX0) / 2, t))
{
  prism({ wall: brick, win: null, roof: null, ring: [[NX0, CH - 0.5], [NX1, CH - 0.5], ...apse], z0: 0, z1: EAVE, facade: null, bevel: 0.2 })
  // a half cone of slate from the eaves to the ridge's end
  const top: V3 = [NC, CH, RIDGE]
  const g = (p: XY): V3 => { const dx = p[0] - AC[0], dy = p[1] - AC[1], l = Math.hypot(dx, dy); return [p[0] + (dx / l) * 0.5, p[1] + (dy / l) * 0.5, EAVE - 0.3] }
  for (let i = 0; i < apse.length - 1; i++) roof.tri(g(apse[i]), g(apse[i + 1]), top)
  // ambulatory: a polygonal aisle at 13 m, its roof sloping up to the apse wall
  const R = 13.4, ts = [90, 60, 30, 0, -30, -60, -90]
  const outer = ts.map((t) => pAt(R, t, 0.5))
  prism({ wall: brick, win: null, roof: null, ring: outer, z0: 0, z1: AISLE, facade: null, bevel: 0.3 })
  const inn = (t: number): V3 => { const q = pAt((NX1 - NX0) / 2 + 0.2, t); return [q[0], q[1], AISLE + 4.5] }
  const out = (t: number): V3 => { const q = pAt(R + 0.4, t, 0.5); return [q[0], q[1], AISLE - 0.25] }
  for (let i = 0; i < ts.length - 1; i++) roof.quad(out(ts[i]), out(ts[i + 1]), inn(ts[i + 1]), inn(ts[i]))
  // the radiating chapels' pyramid roofs (OSM 747924621–625)
  // the five radiating chapels (OSM 747924621–625): polygonal, walls to 14 m, pyramid roofs to 19 m
  for (const t of [62, 31, 0, -31, -62]) {
    const q = pAt(R + 1.6, t, 0.5), ring = circle(q[0], q[1], 3.6, 7, (-t * Math.PI) / 180 + Math.PI / 2)
    prism({ wall: brick, win: null, roof: null, ring, z0: 0, z1: 14, facade: null, bevel: 0.15 })
    spire(roof, circle(q[0], q[1], 3.95, 7, (-t * Math.PI) / 180 + Math.PI / 2), 13.8, [q[0], q[1], 19])
    pointed(win, ring[0], ring[1], Math.hypot(ring[1][0] - ring[0][0], ring[1][1] - ring[0][1]) / 2, 1.8, 3.6, 11.5)
  }
  for (let i = 0; i < ts.length - 1; i++) {
    const a = outer[i], b = outer[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    pointed(win, a, b, L / 2, 2.8, 3.6, 11.6)
  }
}

// West front: the stub of the unbuilt tower, with its two stair turrets.
prism({ wall: brick, win: null, roof: null, ring: rect(-8.9, -49.9, 10.7, W0 + 0.2), z0: 0, z1: 18, facade: null, bevel: 0.3 })
block(stone, -9.1, -50.1, 10.9, W0, 17.4, 18.4)
for (const [x, y] of [[-6.5, -44.0], [8.5, -43.5]] as XY[]) {
  prism({ wall: brick, win: null, roof: stone, ring: circle(x, y, 1.35, 8, Math.PI / 8), z0: 0, z1: 28.5, facade: null, bevel: 0.1 })
  spire(lead, circle(x, y, 1.5, 8, Math.PI / 8), 28.5, [x, y, 35.5])
}

// ------------------------------------------------------------------ roofs
gableRoof(roof, brick, NX0, W0, NX1, CH, EAVE, RIDGE - EAVE, true, 0.5)
gableRoof(roof, null, TX0, TY0, TX1, TY1, EAVE, RIDGE - EAVE, false, 0.5)
// Transept fronts: gable walls up into the roof (the Dam front in pale stone).
for (const [x, s] of [[TX1, 1], [TX0, -1]] as [number, number][]) {
  const mat = s > 0 ? stone : brick
  const A: V3 = [x, TY0, EAVE], B: V3 = [x, TY1, EAVE], T: V3 = [x, TC, RIDGE + 0.6]
  if (s > 0) mat.tri(A, B, T); else mat.tri(B, A, T)
  // raking copings
  for (const sy of [-1, 1]) {
    const y0 = sy < 0 ? TY0 - 0.5 : TY1 + 0.5
    const q: V3[] = [[x + s * 0.35, y0, EAVE + 0.3], [x + s * 0.35, TC, RIDGE + 1.1], [x - s * 1.0, TC, RIDGE + 1.1], [x - s * 1.0, y0, EAVE + 0.3]]
    const n = (q[1][1] - q[0][1]) * sy
    if ((n > 0) === (s > 0)) stone.quad(q[0], q[1], q[2], q[3]); else stone.quad(q[0], q[3], q[2], q[1])
  }
  pinnacle(stone, x - s * 0.3, TC, 0.5, RIDGE + 0.6, RIDGE + 1.8, RIDGE + 3.6)
}
// The Dam front itself: the transept end clad in sandstone, with its
// corner buttress turrets.
prism({ wall: stone, win: null, roof: null, ring: rect(TX1 - 0.6, TY0 - 0.15, TX1 + 0.15, TY1 + 0.15), z0: 0, z1: EAVE, facade: null, bevel: 0.1 })
for (const y of [TY0 - 0.6, TY1 + 0.6]) {
  prism({ wall: stone, win: null, roof: null, ring: circle(TX1 + 0.2, y, 1.05, 8, Math.PI / 8), z0: 0, z1: EAVE + 2, facade: null, bevel: 0.08 })
  spire(stone, circle(TX1 + 0.2, y, 1.15, 8, Math.PI / 8), EAVE + 2, [TX1 + 0.2, y, EAVE + 6.5])
}

// ------------------------------------------------------------------ eaves, buttresses, bands
const parapetRun = (x0: number, y0: number, x1: number, y1: number) => block(stone, x0, y0, x1, y1, EAVE - 0.4, EAVE + 0.9)
parapetRun(NX0 - 0.35, W0, NX0 + 0.1, TY0); parapetRun(NX0 - 0.35, TY1, NX0 + 0.1, CH)
parapetRun(NX1 - 0.1, W0, NX1 + 0.35, TY0); parapetRun(NX1 - 0.1, TY1, NX1 + 0.35, CH)
parapetRun(TX0, TY0 - 0.35, NX0, TY0 + 0.1); parapetRun(NX1, TY0 - 0.35, TX1, TY0 + 0.1)
parapetRun(TX0, TY1 - 0.1, NX0, TY1 + 0.35); parapetRun(NX1, TY1 - 0.1, TX1, TY1 + 0.35)
// Pinnacles on the nave and transept buttresses, one per bay.
const navePin = [-36.5, -30, -23.5, -17, 8.5, 15, 21.5]
for (const y of navePin) for (const x of [NX0 - 0.2, NX1 + 0.2]) pinnacle(stone, x, y, 0.45, EAVE - 1, EAVE + 1.6, EAVE + 3.6)
for (const x of [-21, -15, 17, 23]) for (const y of [TY0 - 0.2, TY1 + 0.2]) pinnacle(stone, x, y, 0.45, EAVE - 1, EAVE + 1.6, EAVE + 3.6)
// Pale stone string courses on the brick (the banding, drawn as three bands).
band(stone, rect(NX0, W0, NX1, CH), 3.0, 3.6, 0.12)
band(stone, rect(TX0, TY0, TX1 - 0.6, TY1), 3.0, 3.6, 0.12)
band(stone, rect(NX0, W0, NX1, CH), AISLE + 4.4, AISLE + 5.0, 0.12)
band(stone, rect(TX0, TY0, TX1 - 0.6, TY1), 14.2, 14.8, 0.12)
// Buttresses on the aisle walls, banded caps.
for (const y of navePin) {
  if (y > CH - 2) continue
  for (const [x0, x1] of [[AX0 - 1.0, AX0], [AX1, AX1 + 1.0]]) {
    if ((y > -24 && y < TY0 + 1) || (y > TY1 && y < 21)) continue // chapels there
    block(brick, x0, y - 0.6, x1, y + 0.6, 0, AISLE - 1.5)
    block(stone, x0, y - 0.65, x1, y + 0.65, AISLE - 1.5, AISLE - 0.9)
  }
}

// ------------------------------------------------------------------ windows
// The great south window of the Dam front, and its north twin.
pointed(win, [TX1 + 0.16, TY0], [TX1 + 0.16, TY1], TY1 - TY0 - (TC - TY0), 8.6, 6.5, 27.5, 0.05, 6)
pointed(win, [TX0, TY1], [TX0, TY0], TC - TY0 + 0, 8.0, 7.0, 26.5, 0.06, 6)
// a small door under the south window
pointed(win, [TX1 + 0.16, TY0], [TX1 + 0.16, TY1], TY1 - TC, 2.6, 0, 4.6, 0.08, 4)
// Transept side walls, above the chapels: two tall windows on each side of each arm.
for (const xs of [[20.0, 26.0], [-24.5, -18.5]]) {
  for (const x of xs) {
    pointed(win, [TX0, TY0], [TX1, TY0], x - TX0, 3.4, 15.5, 23.8)
    pointed(win, [TX1, TY1], [TX0, TY1], TX1 - x, 3.4, 15.5, 23.8)
  }
}
// Nave clerestory, five bays west of the crossing and three in the choir; aisle windows below.
const bayC = [-39.7, -33.2, -26.7, -20.2, -13.7, 7.0, 13.0, 19.0]
for (const y of bayC) {
  pointed(win, [NX1, W0], [NX1, CH], y - W0, 3.6, AISLE + 5.4, EAVE - 0.9)
  pointed(win, [NX0, CH], [NX0, W0], CH - y, 3.6, AISLE + 5.4, EAVE - 0.9)
}
for (const y of [-39.7, -33.2, -26.7]) {
  pointed(win, [AX1, W0 + 0.5], [AX1, CH - 1], y - W0 - 0.5, 3.0, 3.8, 11.8)
  pointed(win, [AX0, CH - 1], [AX0, W0 + 0.5], CH - 1 - y, 3.0, 3.8, 11.8)
}
// Chapel windows.
for (const [x0, y0, x1, y1] of chapels) {
  const L = y1 - y0
  if (x0 > 0) pointed(win, [x1, y0], [x1, y1], L / 2, 3.2, 3.6, 12.4)
  else pointed(win, [x0, y1], [x0, y0], L / 2, 3.2, 3.6, 12.4)
}
// Apse windows: one tall light on each face above the ambulatory.
{
  for (let i = 0; i < apse.length - 1; i++) {
    const a = apse[i], b = apse[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    pointed(win, a, b, L / 2, Math.min(3.4, L * 0.55), AISLE + 5.2, EAVE - 1.0)
  }
}
// West front: one great window over the door in the tower stub.
pointed(win, [10.7, -49.9], [-8.9, -49.9], 9.8, 5.0, 4.5, 16.0)

// ------------------------------------------------------------------ crossing turret
// The slender dakruiter: a square leaded base on the ridges, an open
// octagonal lantern (arches as dark insets), a gallery of small pinnacles
// and a tall needle spire with a gilt cross.
{
  const cx = NC, cy = TC
  block(lead, cx - 2.9, cy - 2.9, cx + 2.9, cy + 2.9, RIDGE - 3, RIDGE + 1.2)
  const L0 = RIDGE + 1.2, L1 = 43.0, R = 2.5
  const oct = circle(cx, cy, R, 8, Math.PI / 8)
  prism({ wall: lead, win: null, roof: null, ring: oct, z0: L0, z1: L1, facade: null, bevel: 0.05 })
  for (let i = 0; i < 8; i++) {
    const a = oct[i], b = oct[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    pointed(win, a, b, L / 2, L * 0.62, L0 + 0.7, L1 - 0.6, 0.05, 4)
  }
  prism({ wall: lead, win: null, roof: lead, ring: circle(cx, cy, R + 0.45, 8, Math.PI / 8), z0: L1, z1: L1 + 0.5, facade: null, bevel: 0.08 })
  for (const p of circle(cx, cy, R + 0.2, 8, Math.PI / 8)) pinnacle(lead, p[0], p[1], 0.2, L1 + 0.5, L1 + 1.2, L1 + 2.6)
  spire(lead, circle(cx, cy, R * 0.92, 8, Math.PI / 8), L1 + 0.5, [cx, cy, 55.0], true)
  block(gilt, cx - 0.12, cy - 0.12, cx + 0.12, cy + 0.12, 54.4, 57.2)
  block(gilt, cx - 0.12, cy - 0.75, cx + 0.12, cy + 0.75, 56.0, 56.3)
  prism({ wall: gilt, win: null, roof: gilt, ring: circle(cx, cy, 0.3, 8), z0: 54.6, z1: 55.2, facade: null, bevel: 0.08 })
}

// ------------------------------------------------------------------ write
const lit = (p: V3, n: V3): number => {
  if (n[2] > 0.7) return 0.15
  if (p[2] > RIDGE) return 0.8
  return n[0] > 0.5 ? 1 : 0.4
}
finishModel('Nieuwe Kerk', 'amsterdam-nieuwe-kerk', [
  { part: brick, material: { ...finish('nieuwe-kerk-brick', 0xb07462), floodlight: lit } },
  { part: stone, material: { ...finish('nieuwe-kerk-sandstone', 0xe6dcc6), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: roof, material: finish('nieuwe-kerk-slate', 0x7f8892) },
  { part: lead, material: finish('nieuwe-kerk-lead', 0x8d959c) },
  { part: gilt, material: finish('nieuwe-kerk-gilt', 0xd8b25a) },
], { bearing: 71.7, osm: 'way/220749328', height: 57.2 }, 6500)
