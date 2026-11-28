/**
 * Cathédrale Notre-Dame de Paris — procedural, CC0-1.0, no textures.
 * bun generators/paris-notre-dame.ts
 *
 * The cathedral as it stands after the December 2024 reopening: the twin
 * west towers with their flat tops, the three great roses (west, north and
 * south transepts), the rebuilt 96 m flèche over the crossing, the steep
 * lead roofs, the transept gables, the long single-span flying buttresses of
 * the nave, choir and chevet, and Viollet-le-Duc's sacristy south of the
 * choir (inside the OSM outline).
 *
 * Map frame: x along the church's axis towards the altar (compass 115°), y
 * to its left (liturgical north, compass 25°), z up, metres. Placement
 * bearing 25. Anchor: the area centroid of the OSM outline way/201611261
 * (lng 2.3499096, lat 48.8529729). The vessels' axis sits at y = +3.2
 * (the sacristy pulls the centroid south).
 *
 * Evidence
 * - OSM (measured, read in this frame by a local script): outline
 *   way/201611261 and its 83 building:parts. West front x −67.9, buttresses
 *   to −68.6; towers back to x −49.0, south tower y −20.0…−1.8, north tower
 *   7.8…27.6 (drawn symmetric about the axis, off-axis 5.0…23.8); four front
 *   buttresses off-axis ±(6…8) and ±(19…21.2); nave roof y −4.2…10.6 (vessel
 *   half-width 7.0); transept x −5.3…9.3, north front y 29.2, south front
 *   −22.5; apse roof cone x 35.9…49.9 (apse centre x 42.8, r 7);
 *   outer chapel wall off-axis 24.4; flyer piers (culées) at nave x −46.7,
 *   −40.5, −34.6, −28.9, −23.2, −17.7, −12.2, choir x 16.9, 22.4, 27.6, 32.6,
 *   38.0, and round the chevet about 22.7 m from the apse centre at ±22° and
 *   ±65°; the flyers (OSM skillion parts) span from the culées straight to
 *   the clerestory; flèche base x −0.8…5.1, y 0.4…6.3. Sacristy (part
 *   way/1340842277 and parts 201611264, 201611266) x 12.5…42, y −48.8…−21.
 *   OSM heights used where sane: culées 26 m, apse culées 30 m, tribune
 *   roofs 25 m, galerie des chimères 45 m, sacristy 12 and 18 m. The
 *   outline's height tag (10.5 m) is wrong and is ignored.
 * - Published (Wikipedia FR/EN "Cathédrale Notre-Dame de Paris"; Mérimée
 *   PA00086250): towers 69 m, flèche 96 m, vault 33 m (eaves drawn at 33 m
 *   above the floor), roof ridge about 43 m, length 128 m, width 48 m,
 *   west rose 9.6 m across, transept roses 12.9 m across.
 * - Photos (Wikimedia Commons, evidence):
 *   "Notre Dame Cathedral in Paris July 2025.jpg" (Dmarcovitz, CC0;
 *   the west front from the Petit-Pont, used to scale every stage of the
 *   front against the 69 m towers: portals to ~15 m, kings' gallery
 *   17.5–21.5 m, balustrade 23 m, rose centre 26.3 m (9.3 m across, against
 *   9.6 published), galerie top 45–46 m);
 *   "Cathédrale Notre-Dame de Paris en 2026 05.jpg" (Gargarapalvin,
 *   CC BY-SA 4.0; the west front close up: belfry pairs, galerie, roses);
 *   "Paris 4e Cathédrale Notre-Dame 684.jpg" (GFreihalter, CC BY-SA 4.0;
 *   from the south-west: south tower, nave roof, chapel gables, flyers,
 *   south transept rose and gable, the new flèche — stage to ~56 m, needle
 *   above, read against the 43 m ridge);
 *   "Le chevet de Notre-Dame de Paris, 27 mars 2018.jpg" (Jean-Pierre
 *   Dalbéra, CC BY 2.0; the chevet from the south-east, high, at night:
 *   the radiating flyers, apse roof, floodlit stone and spire, dark roofs.
 *   Pre-fire; the restoration rebuilt the chevet, roofs and flèche to the
 *   same form, so it is used for form and night look only).
 * - Mapterhorn terrain (bearing 25): the church's ground lies 1.0–1.9 m
 *   above the lowest ground under the footprint (the sacristy's south
 *   side), so the church's floor is drawn at z = 1.3 and every published
 *   height is measured from there; the walls run down to z = 0.
 * - Estimated: the tribune and outer aisle roof levels (21–25 m, 13–18 m,
 *   from the SW photo against the 33 m eaves), the spire's stages (stage
 *   1 to 53 m, stage 2 to 60 m, needle base radius 2.1 m), transept gables
 *   to 46 m and their pinnacles to 50 m, the stair turrets' caps, the
 *   sacristy's roofs.
 * - Simplified: statues, the kings' gallery figures, tracery other than the
 *   roses' spokes, crockets, gargoyles and chimères, the apostles on the
 *   roof, the tribune windows; the side chapels are one wall with a gable
 *   per bay; the sacristy's cloister court is drawn as a low roofed block.
 * - Look-only references: none.
 * - Doubts: the north side and the sacristy were not compared against a
 *   photo; the stair turrets are put at the outer east corners of both
 *   towers from the far views; tower top roofs (OSM 69–73 m pyramids) are
 *   drawn low, hidden behind the parapet as the photos show flat tops.
 *
 * Night: the stone is floodlit all round, the west front strongest, and the
 * flèche is lit; roofs stay dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, grow, hip, qf, rect, save, tf, wallRing, type Rect } from './dc-white-house'
import { ngon, ngonPrism, spire } from './dc-smithsonian-castle'
import { boxHoles, disc, face, faceAB, holePanel, kit, polyPrism, ringOn, strutOpen, type Face, type Hole, type XY } from './london-westminster-abbey'

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), lead = new Part(), door = new Part()
kit.seg = 3; kit.round = 6

const Z0 = 1.3 // the church's floor above the model's lowest ground
const H = (h: number) => Z0 + h
const YC = 3.2 // the vessels' axis
const EAVE = H(33), RIDGE = H(43)
const XF = -67.9, XT = -49.0 // west front, back of the towers
const X0 = -62.5 // west end of the nave between the towers
const XS = -49.6 // west end of the aisles (inside the towers)
const XA = 42.8 // apse centre
const TX0 = -5.3, TX1 = 9.3, TS = -22.5, TN = 29.2 // transept
const NAPSE = 8

/** A ring of half-width d about the axis: straight from x0 to the apse, round the apse, back. CCW from above. */
function stad(d: number, z: number, x0: number): V3[] {
  const pts: V3[] = [[x0, YC - d, z]]
  for (let k = 0; k <= NAPSE; k++) {
    const t = -Math.PI / 2 + (Math.PI * k) / NAPSE
    pts.push([XA + d * Math.cos(t), YC + d * Math.sin(t), z])
  }
  pts.push([x0, YC + d, z])
  return pts
}
/** The apse's wall faces at half-width d, as plan segments a→b (outward to the right). */
function apseSegs(d: number): Array<[XY, XY]> {
  const out: Array<[XY, XY]> = []
  for (let k = 0; k < NAPSE; k++) {
    const t0 = -Math.PI / 2 + (Math.PI * k) / NAPSE, t1 = -Math.PI / 2 + (Math.PI * (k + 1)) / NAPSE
    out.push([[XA + d * Math.cos(t0), YC + d * Math.sin(t0)], [XA + d * Math.cos(t1), YC + d * Math.sin(t1)]])
  }
  return out
}
const pointed = (c: number, w: number, zb: number, zs: number): Hole => ({ a0: c - w / 2, a1: c + w / 2, zb, zs, head: 'pointed' })
/** A small square pinnacle (a four-sided spirelet) standing on z0. */
const pyr = (p: Part, x: number, y: number, r: number, z0: number, tip: number) => spire(p, ngon(x, y, r, 4, z0, Math.PI / 4), [x, y, tip])
/** A thin gable (two triangle faces and two sloped edges) across a plan segment a→b, standing on z0. */
function gableWall(p: Part, edge: Part, a: XY, b: XY, z0: number, apex: number, t: number) {
  const f = faceAB(a, b), n = f.n, m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const o = (q: XY, d: number, z: number): V3 => [q[0] - n[0] * d, q[1] - n[1] * d, z]
  tf(p, o(a, 0, z0), o(b, 0, z0), o(m, 0, apex), n)
  tf(p, o(a, t, z0), o(b, t, z0), o(m, t, apex), [-n[0], -n[1], 0])
  qf(edge, o(a, 0, z0), o(a, t, z0), o(m, t, apex), o(m, 0, apex), [-f.u[0], -f.u[1], 1])
  qf(edge, o(b, 0, z0), o(b, t, z0), o(m, t, apex), o(m, 0, apex), [f.u[0], f.u[1], 1])
}

// ===========================================================================
// Nave, choir and apse: concentric layers from the chapels in to the vessel.

// Outer wall of the side chapels and the chevet chapels, with a parapet.
stone.loft([stad(24.4, 0, XS), stad(24.4, H(12), XS)])
trim.loft([stad(24.7, H(11.3), XS), stad(24.7, H(12.3), XS)])
// Outer aisle roofs rising to the tribune wall, the tribune wall, the tribune roofs.
roof.loft([stad(24.5, H(12.3), XS), stad(14.0, H(18), XS)])
stone.loft([stad(14.0, H(18), XS), stad(14.0, H(21), XS)])
roof.loft([stad(14.1, H(21), XS), stad(7.0, H(25.3), XS)])
// The clerestory to the eaves, its cornice, and the steep lead roof.
stone.loft([stad(7.0, H(24.5), X0), stad(7.0, EAVE, X0)])
trim.loft([stad(7.35, EAVE - 0.8, X0), stad(7.35, EAVE + 0.3, X0)])
{
  const r = stad(7.5, EAVE + 0.3, X0), apex: V3 = [XA, YC, RIDGE]
  // Straight slopes and the west gable end (against the front's screen).
  qf(roof, r[0], r[1], [XA, YC, RIDGE], [X0, YC, RIDGE], [0, -1, 0.8])
  qf(roof, r[r.length - 2], r[r.length - 1], [X0, YC, RIDGE], [XA, YC, RIDGE], [0, 1, 0.8])
  tf(stone, r[0], r[r.length - 1], [X0, YC, RIDGE], [-1, 0, 0])
  // The apse's half cone.
  for (let k = 1; k < r.length - 2; k++) tf(roof, r[k], r[k + 1], apex, [(r[k][0] + r[k + 1][0]) / 2 - XA, (r[k][1] + r[k + 1][1]) / 2 - YC, 4])
}

// Bays along the straight sides, between the culées.
const NAVE_C = [-46.7, -40.5, -34.6, -28.9, -23.2, -17.7, -12.2]
const CHOIR_C = [16.9, 22.4, 27.6, 32.6, 38.0]
const bays: number[] = []
for (const list of [[XT, ...NAVE_C], [TX1 + 1.5, ...CHOIR_C]]) for (let i = 0; i < list.length - 1; i++) bays.push((list[i] + list[i + 1]) / 2)
bays.push(-8.6)
for (const s of [-1, 1]) {
  const side = s > 0 ? 'n' : 's'
  const Fo = face(side, YC + s * 24.4), Fc = face(side, YC + s * 7.0)
  for (const c of bays) {
    // Chapel window under a gable on the parapet.
    holePanel(win, Fo, pointed(c, 3.2, H(2.6), H(8.0)))
    if (c !== -8.6) gableWall(trim, trim, s > 0 ? [c + 2.2, YC + s * 24.7] : [c - 2.2, YC + s * 24.7], s > 0 ? [c - 2.2, YC + s * 24.7] : [c + 2.2, YC + s * 24.7], H(12.3), H(16.0), 0.5)
    // Clerestory.
    if (c > XT + 1) holePanel(win, Fc, pointed(c, 2.8, H(25.6), H(30.6)))
  }
}
// The apse: clerestory windows, and chapel windows round the chevet.
for (const [a, b] of apseSegs(7.0)) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  holePanel(win, faceAB(a, b), pointed(L / 2, 1.7, H(25.6), H(30.6)))
}
for (const [a, b] of apseSegs(24.4)) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  holePanel(win, faceAB(a, b), pointed(L / 2, 3.0, H(2.6), H(8.0)))
}

// Culées and flying buttresses: one long span from each pier to the clerestory.
for (const s of [-1, 1]) {
  for (const x of [...NAVE_C, ...CHOIR_C]) {
    const y0 = YC + s * 20.4, y1 = YC + s * 24.9
    cbox(stone, rect(x - 0.8, x + 0.8, Math.min(y0, y1), Math.max(y0, y1)), 0, H(26), { top: trim })
    pyr(trim, x, YC + s * 22.6, 1.0, H(26), H(31.5))
    strutOpen(trim, [x, YC + s * 20.9, H(24.6)], [x, YC + s * 7.2, H(31.4)], 0.75, 1.3)
  }
}
for (const deg of [-65, -22, 22, 65]) {
  const t = (deg * Math.PI) / 180, u: XY = [Math.cos(t), Math.sin(t)], v: XY = [-u[1], u[0]]
  const P = (r: number, w: number): XY => [XA + u[0] * r + v[0] * w, YC + u[1] * r + v[1] * w]
  polyPrism(stone, [P(20.4, -0.8), P(24.9, -0.8), P(24.9, 0.8), P(20.4, 0.8)], 0, H(28), trim)
  const c = P(22.6, 0)
  pyr(trim, c[0], c[1], 1.0, H(28), H(33.5))
  const A = P(20.9, 0), B = P(7.25, 0)
  strutOpen(trim, [A[0], A[1], H(25.4)], [B[0], B[1], H(31.6)], 0.75, 1.3)
}

// ===========================================================================
// The transepts: full-height arms with gabled fronts, roses and turrets.
cbox(stone, rect(TX0, TX1, TS, TN), 0, EAVE, { top: false })
cbox(trim, grow(rect(TX0, TX1, TS, TN), 0.35), EAVE - 0.8, EAVE + 0.3, { top: false, bottom: true })
{
  // Roof ridge along y, under the gables.
  const xm = (TX0 + TX1) / 2
  qf(roof, [TX0 - 0.2, TS + 0.6, EAVE + 0.3], [TX0 - 0.2, TN - 0.6, EAVE + 0.3], [xm, TN - 0.6, RIDGE], [xm, TS + 0.6, RIDGE], [-1, 0, 0.8])
  qf(roof, [TX1 + 0.2, TS + 0.6, EAVE + 0.3], [TX1 + 0.2, TN - 0.6, EAVE + 0.3], [xm, TN - 0.6, RIDGE], [xm, TS + 0.6, RIDGE], [1, 0, 0.8])
  for (const [y, s] of [[TN, 1], [TS, -1]] as Array<[number, number]>) {
    const F = face(s > 0 ? 'n' : 's', y)
    // The gable, standing above the roof with a small rose.
    const a: XY = s > 0 ? [TX1 + 0.3, y] : [TX0 - 0.3, y], b: XY = s > 0 ? [TX0 - 0.3, y] : [TX1 + 0.3, y]
    gableWall(stone, trim, a, b, EAVE + 0.3, H(46), 0.9)
    disc(win, F, xm, H(38.6), 1.5, 10, 0.06)
    ringOn(trim, F, xm, H(38.6), 1.5, 2.0, 10, 0.08)
    // The great rose, its spokes and frame.
    disc(win, F, xm, H(25.8), 6.4, 20, 0.06)
    ringOn(trim, F, xm, H(25.8), 6.4, 7.0, 20, 0.09)
    ringOn(trim, F, xm, H(25.8), 1.2, 1.9, 10, 0.09)
    for (let k = 0; k < 12; k++) {
      const t = (2 * Math.PI * k) / 12, c = Math.cos(t), si = Math.sin(t), w = 0.13
      const P = (r: number, o: number): V3 => {
        const q = [xm + r * c - o * si, H(25.8) + r * si + o * c]
        return [q[0], y + s * 0.09, q[1]]
      }
      qf(trim, P(1.9, -w), P(6.4, -w), P(6.4, w), P(1.9, w), [0, s, 0])
    }
    // The claire-voie under the rose and the portal with its doors.
    for (let k = -2; k <= 2; k++) holePanel(win, F, pointed(xm + k * 2.3, 1.6, H(13.2), H(17.6)))
    holePanel(trim, F, pointed(xm, 7.2, 0, H(5.6)), 0.08)
    holePanel(door, F, { a0: xm - 2.0, a1: xm + 2.0, zb: 0, zs: H(4.6), head: 'flat' }, 0.12)
    holePanel(stone, F, pointed(xm, 4.6, H(4.6), H(6.6)), 0.12)
    // Corner turrets with tall pinnacles flanking the gable.
    for (const x of [TX0 - 0.5, TX1 + 0.5]) {
      ngonPrism(stone, x, y + s * 0.4, 1.25, 8, 0, H(35.5), { top: trim })
      ngonPrism(trim, x, y + s * 0.4, 1.0, 8, H(35.5), H(40.5), { top: false })
      spire(trim, ngon(x, y + s * 0.4, 1.0, 8, H(40.5)), [x, y + s * 0.4, H(50)])
    }
  }
  // Clerestory windows on the arms' east and west walls, above the aisle roofs.
  for (const [x, side] of [[TX0, 'w'], [TX1, 'e']] as Array<[number, 'w' | 'e']>) {
    for (const off of [-19.5, -11.5, 11.5, 19.5]) holePanel(win, face(side, x), pointed(YC + off, 2.6, H(25.6), H(30.6)))
  }
}

// ===========================================================================
// The flèche (rebuilt 2023–24 to Viollet-le-Duc's design): an open
// octagonal stage with gablets and pinnacles, a second stage, the needle.
{
  const cx = 2.1, cy = YC + 0.15
  ngonPrism(lead, cx, cy, 3.2, 8, H(38), H(53), { top: true })
  const ap = 3.2 * Math.cos(Math.PI / 8)
  for (let k = 0; k < 8; k++) {
    const t = Math.PI / 8 + (2 * Math.PI * k) / 8, t2 = t + (2 * Math.PI) / 8
    const A: V3 = [cx + 3.2 * Math.cos(t), cy + 3.2 * Math.sin(t), H(53)], B: V3 = [cx + 3.2 * Math.cos(t2), cy + 3.2 * Math.sin(t2), H(53)]
    const tm = t + Math.PI / 8, nrm: V3 = [Math.cos(tm), Math.sin(tm), 0]
    const M: V3 = [cx + ap * Math.cos(tm), cy + ap * Math.sin(tm), H(56.5)]
    tf(lead, A, B, M, nrm)
    tf(lead, A, B, M, [-nrm[0], -nrm[1], 0])
    pyr(lead, A[0], A[1], 0.32, H(53), H(59))
    // A tall opening on each face of the open stage.
    const f: Face = { o: [A[0], A[1], 0], u: [(B[0] - A[0]) / 2.449, (B[1] - A[1]) / 2.449, 0], n: nrm }
    holePanel(stone, f, pointed(1.2245, 1.1, H(42), H(50.5)), 0.04)
  }
  ngonPrism(lead, cx, cy, 2.35, 8, H(53), H(60.5), { top: true })
  for (let k = 0; k < 8; k++) {
    const t = Math.PI / 8 + (2 * Math.PI * k) / 8
    pyr(lead, cx + 2.35 * Math.cos(t), cy + 2.35 * Math.sin(t), 0.22, H(60.5), H(64))
  }
  spire(lead, ngon(cx, cy, 2.05, 8, H(60.5)), [cx, cy, H(94.2)])
  cbox(lead, rect(cx - 0.13, cx + 0.13, cy - 0.13, cy + 0.13), H(93.2), H(96), {})
  cbox(lead, rect(cx - 0.75, cx + 0.75, cy - 0.1, cy + 0.1), H(94.6), H(94.9), {})
}

// ===========================================================================
// The west front and the towers.
const TIN = 5.0, TOUT = 23.8 // tower faces, off-axis
const front = rect(XF, X0, YC - TOUT, YC + TOUT)
cbox(stone, front, 0, H(44.5), { top: roof })
for (const s of [-1, 1]) cbox(stone, rect(X0, XT, Math.min(YC + s * TIN, YC + s * TOUT), Math.max(YC + s * TIN, YC + s * TOUT)), 0, H(44.5), { top: roof })
{
  const F = face('w', XF)
  // The four buttresses dividing the front, stepping back at the kings' gallery.
  for (const [a0, a1] of [[-8.0, -6.0], [6.0, 8.0], [-21.2, -19.0], [19.0, 21.2]]) {
    cbox(stone, rect(XF - 0.9, XF, YC + a0, YC + a1), 0, H(17.2), { top: true })
    cbox(stone, rect(XF - 0.5, XF, YC + a0 + 0.15, YC + a1 - 0.15), H(17.2), H(44.5), { top: true })
  }
  // Portals: pointed archivolts with doors and a tympanum.
  for (const [c, w, zs] of [[0, 10.0, H(7.1)], [-13.5, 8.2, H(6.4)], [13.5, 8.2, H(6.4)]]) {
    holePanel(trim, F, pointed(YC + c, w, 0, zs), 0.08)
    holePanel(stone, F, pointed(YC + c, w * 0.66, H(5.2), zs + 0.6), 0.14)
    holePanel(door, F, { a0: YC + c - w * 0.26, a1: YC + c + w * 0.26, zb: 0, zs: H(5.2), head: 'flat' }, 0.14)
  }
  // The kings' gallery, the balustraded terrace of the Virgin's gallery.
  cbox(trim, rect(XF - 0.45, XF, YC - TOUT, YC + TOUT), H(17.4), H(21.3), { b: 0.2, bottom: true, top: true })
  cbox(trim, rect(XF - 1.0, XF, YC - TOUT, YC + TOUT), H(21.3), H(22.9), { b: 0.3, bottom: true, top: true })
  // The west rose: window, spokes, frame and the arch around it.
  disc(win, F, YC, H(27.6), 4.8, 20, 0.06)
  ringOn(trim, F, YC, H(27.6), 4.8, 5.5, 20, 0.09)
  ringOn(trim, F, YC, H(27.6), 0.9, 1.5, 10, 0.09)
  ringOn(trim, F, YC, H(27.6), 6.1, 6.7, 20, 0.07)
  for (let k = 0; k < 12; k++) {
    const t = (2 * Math.PI * k) / 12, c = Math.cos(t), si = Math.sin(t), w = 0.12
    const P = (r: number, o: number): V3 => [XF - 0.09, YC + r * c - o * si, H(27.6) + r * si + o * c]
    qf(trim, P(1.5, -w), P(4.8, -w), P(4.8, w), P(1.5, w), [-1, 0, 0])
  }
  // The towers' windows at the rose's level: two lancets under a blind arch.
  for (const c of [-13.5, 13.5]) {
    holePanel(trim, F, pointed(YC + c, 9.0, H(22.6), H(27.0)), 0.04)
    for (const k of [-1, 1]) holePanel(win, F, pointed(YC + c + k * 2.2, 2.6, H(23.4), H(28.4)), 0.08)
    disc(win, F, YC + c, H(32.6), 1.2, 10, 0.08)
  }
  // The grande galerie: an open arcade across the front.
  for (let k = 0; k < 6; k++) holePanel(lead, F, pointed(YC - 5.0 + 2.0 * k + 0.0, 1.35, H(37.6), H(42.6)), 0.06)
  for (const c of [-13.5, 13.5]) for (let k = 0; k < 5; k++) holePanel(lead, F, pointed(YC + c - 4.0 + 2.0 * k, 1.35, H(37.6), H(42.6)), 0.06)
  cbox(trim, rect(XF - 0.6, XF + 0.3, YC - TOUT - 0.3, YC + TOUT + 0.3), H(36.6), H(37.4), { b: 0.2, bottom: true, top: true })
  // The balustrade on top of the galerie between the towers.
  cbox(trim, rect(XF - 0.3, X0, YC - TIN, YC + TIN), H(44.5), H(45.9), { b: 0.2, top: true })
  // The outer sides of the towers: two lancets at the rose's level, the galerie.
  for (const s of [-1, 1]) {
    const Fs = face(s > 0 ? 'n' : 's', YC + s * TOUT)
    for (const k of [-1, 1]) holePanel(win, Fs, pointed(-58.4 + k * 2.4, 2.6, H(23.4), H(28.4)))
    for (let k = 0; k < 5; k++) holePanel(lead, Fs, pointed(-62.4 + 2.0 * k, 1.35, H(37.6), H(42.6)))
  }
}
// Upper stages: open belfries, corner buttresses, parapets, low roofs, stair turrets.
for (const s of [-1, 1]) {
  const ya = YC + s * 4.8, yb = YC + s * 23.4
  const r: Rect = rect(XF + 0.6, XT - 0.6, Math.min(ya, yb), Math.max(ya, yb))
  const xm = (r.x0 + r.x1) / 2, ym = (r.y0 + r.y1) / 2
  cbox(trim, grow(r, 0.5), H(44.5), H(45.4), { b: 0.25, bottom: true, top: roof })
  const pair = (c: number): Hole[] => [pointed(c - 2.35, 2.7, H(48.2), H(61.6)), pointed(c + 2.35, 2.7, H(48.2), H(61.6))]
  boxHoles(stone, r, H(45.4), H(66.4), { n: pair(xm), s: pair(xm), e: pair(ym), w: pair(ym) }, { depth: 1.0, back: lead, top: false })
  cbox(trim, grow(r, 0.35), H(66.4), H(67.3), { b: 0.25, bottom: true, top: roof })
  wallRing(trim, grow(r, 0.2), 0.45, H(67.3), H(68.6))
  // Corner buttresses rising to small pinnacles.
  for (const [x, y] of [[r.x0, r.y0], [r.x1, r.y0], [r.x1, r.y1], [r.x0, r.y1]] as XY[]) {
    cbox(stone, rect(x - 1.1, x + 1.1, y - 1.1, y + 1.1), H(45.4), H(66.0), { top: false, c: 0.3 })
    cbox(trim, rect(x - 1.2, x + 1.2, y - 1.2, y + 1.2), H(66.0), H(68.2), { c: 0.3, b: 0.2 })
    pyr(trim, x, y, 0.7, H(68.2), H(70.4))
  }
  // The stair turret at the outer east corner, with its pointed cap.
  const tx = r.x1 - 2.6, ty = s > 0 ? r.y1 - 0.3 : r.y0 + 0.3
  ngonPrism(stone, tx, ty, 1.3, 8, H(45.4), H(70.0), { top: false })
  ngonPrism(trim, tx, ty, 1.5, 8, H(70.0), H(70.6), { top: false, bottom: true })
  spire(trim, ngon(tx, ty, 1.4, 8, H(70.6)), [tx, ty, H(74.5)])
}

// ===========================================================================
// The sacristy (Viollet-le-Duc and Lassus, 1845–50) south of the choir.
{
  const blocks: Array<[Rect, number, number, number]> = [
    [rect(12.5, 18.1, -26.4, -21.0), 9, 11, 1.5],
    [rect(12.5, 22.0, -41.5, -26.4), 10, 13.5, 3],
    [rect(22.0, 42.0, -41.5, -31.0), 12, 15.5, 3.5],
    [rect(27.0, 37.0, -48.8, -41.5), 14, 18.5, 3.4],
  ]
  for (const [r, wall, top, inset] of blocks) {
    cbox(stone, r, 0, wall, { top: false })
    cbox(trim, grow(r, 0.25), wall - 0.6, wall + 0.2, { top: false, bottom: true })
    hip(roof, grow(r, 0.2), wall + 0.2, top, inset)
  }
  // The cloister court, as its low galleries' roof.
  cbox(stone, rect(18.1, 36.5, -31.0, -21.0), 0, 5.6, { top: false })
  cbox(roof, rect(18.2, 36.4, -30.9, -21.1), 5.6, 6.4, { b: 0.6 })
  const Fs = face('s', -48.8), Fe = face('e', 42.0), Fw = face('w', 12.5)
  for (const c of [29.2, 32, 34.8]) holePanel(win, Fs, pointed(c, 1.6, 4.5, 10.5))
  for (const c of [-39.0, -36.2, -33.4]) holePanel(win, Fe, pointed(c, 1.6, 4.0, 8.5))
  for (const c of [-38.6, -34.2, -29.8]) holePanel(win, Fw, pointed(c, 1.6, 3.5, 7.0))
  holePanel(win, face('s', -41.5), pointed(24.5, 1.6, 4.0, 8.5))
  holePanel(win, face('s', -41.5), pointed(39.5, 1.6, 4.0, 8.5))
}

// ===========================================================================
// Floodlighting: all the stone, the west front strongest, the flèche too.
const lit = (q: V3, n: V3): number => (n[2] > 0.8 ? 0.15 : q[0] < XT && n[0] < -0.5 ? 1 : q[2] > 30 ? 0.75 : 0.55)
await save('paris-notre-dame', 'Cathédrale Notre-Dame de Paris', [
  { part: stone, material: { ...PALETTE.stone, floodlight: lit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: lead, material: { ...finish('notre-dame-lead', 0x6d747b), floodlight: (q: V3) => (q[2] > H(45) ? 0.65 : 0) } },
  { part: door, material: finish('notre-dame-oak', 0x8a7663) },
], { source: 'generators/paris-notre-dame.ts' }, 6500)
