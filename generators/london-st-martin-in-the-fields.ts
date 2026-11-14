/**
 * St Martin-in-the-Fields, Trafalgar Square, London — procedural, CC0-1.0,
 * no textures. bun generators/london-st-martin-in-the-fields.ts
 *
 * Built with the London church kit in london-westminster-abbey.ts (merge
 * that generator first).
 *
 * Map frame: x along the church's axis from the portico towards the east
 * end (compass 89.6°), y to its north, z up, metres. Placement bearing
 * 359.6. Anchor: the area centroid of the OSM outline way/30734422
 * (lng -0.1266654, lat 51.5088303). The axis sits at y = −0.3.
 *
 * What it is: James Gibbs's church (1722–26): a Portland stone box with
 * giant Corinthian pilasters and two tiers of windows under a balustrade,
 * a hexastyle Corinthian portico with its pediment facing Trafalgar
 * Square, and the steeple rising from the roof just behind it: a square
 * tower with oculi, a louvred belfry stage, a clock stage with urns, an
 * open octagonal belfry, and an obelisk spire with oval lights, ball and
 * vane.
 *
 * Covers and replaces the outline way/30734422 (OSM maps no parts).
 *
 * Evidence
 * - OSM (measured): outline 42 × 25.3 m body (x −18…23.9, y −12.6…12.7)
 *   and the portico x −25.5…−18, y −9.7…9.1 (18.8 m wide).
 * - Environment Agency LIDAR Composite DSM/DTM 1 m (0.5 m resampling), Open
 *   Government Licence v3.0, measured above the street on the Trafalgar
 *   Square side (the outline's lowest ground; the other sides are 0.8 m
 *   higher): roof ridge 18.2 m, eaves 14.2 m and balustrade to 15.4 m;
 *   pediment apex 18 m, portico cornice 14 m; steeple tower about 8 m
 *   square centred x −14.3, its stages reading 34, 42, 45.5 and 54.3 m
 *   (the spire's thin tip is under-read).
 * - Published: steeple 192 ft (58.5 m) (Wikipedia, "St Martin-in-the-
 *   Fields"); Grade I, Historic England list entry 1217661 (from the OSM
 *   heritage:website tag).
 * - Photos (Wikimedia Commons): "St Martin-in-the-Fields - geograph.org.uk
 *   - 4136073.jpg" (Ashley Martin, CC BY-SA 2.0; from Trafalgar Square,
 *   distant: every steeple stage height, scaled from the roof to the
 *   published 58.5 m); "View of St-Martin-in-the-Fields Church from the
 *   steps leading up to the National Portrait Gallery - geograph.org.uk -
 *   3502550.jpg" (Robert Lamb, CC BY-SA 2.0; portico and north side);
 *   "St Martin-in-the-Fields steeple.jpg" (APK, CC BY 4.0; steeple close
 *   up); "St Martin in the Fields 2.jpg" (Frombowen, CC BY-SA 4.0; the
 *   portico's columns and entablature); "View of St Martin in the Fields
 *   Church from Trafalgar Square - geograph.org.uk - 1721968.jpg" (Robert
 *   Lamb, CC BY-SA 2.0); "St Martin-in-the-Fields - geograph.org.uk -
 *   2817148.jpg" (Patrick Baldwin, CC BY-SA 2.0).
 * - Read off the photos (estimated): steeple stages: oculus stage from
 *   the roof to 25.6 m, cornice to 26.5 m, louvred belfry to 32.7 m,
 *   cornice to 33.6 m, clock stage to 37.4 m, open octagon to 43.3 m, a
 *   small stage to 45.6 m, the spire to its ball at 56.2 m and the vane to
 *   58.5 m; portico columns about 1.25 m across, 10 m tall on a 1.6 m
 *   podium; seven bays along each side.
 * - Simplified: capitals are plain blocks, the pediment's arms and the
 *   window surrounds are left out, the east end's Venetian window is a
 *   flat panel.
 * - Look-only references: none.
 *
 * Night: the portico and steeple are floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { column } from './dc-white-house'
import {
  cbox, cylinder, disc, face, faceAB, gable, grow, holePanel, ngon, ngonPrism, qf, rect, ringOn, saveLod, spire, tf, wallHoles,
  type Hole, type Side, type XY,
} from './london-westminster-abbey'

export function build(lo = true) {
  const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part(), gold = new Part()
  const YC = -0.3
  const Y = (v: number) => YC + v
  const BX0 = -18.0, BX1 = 23.9, BHW = 12.65
  const EAVE = 14.2, BAL = 15.4, RIDGE = 18.2, POD = 1.6

  // ---- The body: a stone box on a low plinth, entablature and balustrade.
  const body = rect(BX0, BX1, Y(-BHW), Y(BHW))
  cbox(stone, body, 0, EAVE - 1.3, { top: false })
  cbox(trim, grow(body, 0.15), 0, POD, { top: false })
  cbox(trim, grow(body, 0.3), EAVE - 1.3, EAVE, { b: 0.25, bottom: true, top: false })
  cbox(stone, grow(body, 0.05), EAVE, BAL, { top: false })
  cbox(trim, grow(body, 0.15), BAL - 0.25, BAL, { top: false, bottom: true })
  // The pitched roof inside the balustrade, gabled at the east end.
  gable(roof, stone, rect(BX0, BX1, Y(-BHW + 0.3), Y(BHW - 0.3)), EAVE, RIDGE, false, [false, true])
  roof.cap([[BX0, Y(-BHW), EAVE], [BX1, Y(-BHW), EAVE], [BX1, Y(BHW), EAVE], [BX0, Y(BHW), EAVE]], true)
  // The east pediment over the Venetian window.
  {
    const x = BX1 + 0.05
    tf(stone, [x, Y(-BHW), EAVE], [x, Y(BHW), EAVE], [x, YC, RIDGE + 0.6], [1, 0, 0])
    qf(trim, [x, Y(-BHW - 0.3), EAVE], [x + 0.6, Y(-BHW - 0.3), EAVE], [x + 0.6, YC, RIDGE + 0.8], [x, YC, RIDGE + 0.8], [0.3, -1, 3])
    qf(trim, [x, Y(BHW + 0.3), EAVE], [x + 0.6, Y(BHW + 0.3), EAVE], [x + 0.6, YC, RIDGE + 0.8], [x, YC, RIDGE + 0.8], [0.3, 1, 3])
    const F = face('e', BX1)
    holePanel(win, F, { a0: YC - 1.6, a1: YC + 1.6, zb: 4.0, zs: 10.0, head: 'round' })
    for (const s of [-1, 1]) holePanel(win, F, { a0: YC + s * 3.0 - 0.9, a1: YC + s * 3.0 + 0.9, zb: 4.0, zs: 8.2, head: 'flat' })
  }
  // Giant pilasters and two tiers of windows, seven bays a side.
  const NB = 7, bw = (BX1 - BX0) / NB
  for (const [side, at] of [['n', Y(BHW)], ['s', Y(-BHW)]] as Array<[Side, number]>) {
    const sg = side === 'n' ? 1 : -1
    for (let k = 0; k <= NB; k++) {
      const x = BX0 + k * bw, x0 = Math.max(BX0, x - 0.6), x1 = Math.min(BX1, x + 0.6)
      cbox(trim, rect(Math.max(BX0, x - 0.7), Math.min(BX1, x + 0.7), Math.min(at, at + sg * 0.45), Math.max(at, at + sg * 0.45)), POD, EAVE - 1.3, { top: false })
      cbox(trim, rect(x0 - 0.1, x1 + 0.1, Math.min(at, at + sg * 0.6), Math.max(at, at + sg * 0.6)), EAVE - 2.3, EAVE - 1.3, { bottom: true, top: false })
    }
    const F = face(side, at)
    for (let k = 0; k < NB; k++) {
      const c = BX0 + (k + 0.5) * bw
      holePanel(win, F, { a0: c - 1.1, a1: c + 1.1, zb: 7.0, zs: 10.4, head: 'round' })
      holePanel(win, F, { a0: c - 1.0, a1: c + 1.0, zb: 2.6, zs: 4.9, head: 'segment' })
    }
  }

  // ---- The portico: six columns, two more down each side, entablature and pediment.
  {
    const PX0 = -25.5, PHW = 9.4, COLX = -24.6, CT = 11.6
    // The podium and its steps.
    cbox(trim, rect(PX0 - 1.2, BX0, Y(-PHW - 0.4), Y(PHW + 0.4)), 0, 0.8, {})
    cbox(trim, rect(PX0 - 0.4, BX0, Y(-PHW), Y(PHW)), 0.8, POD, {})
    const ys = [-8.4, -5.04, -1.68, 1.68, 5.04, 8.4].map(Y)
    const n = lo ? 10 : 14
    for (const y of ys) column(trim, COLX, y, 0.63, POD, CT, n)
    for (const y of [ys[0], ys[5]]) column(trim, -21.3, y, 0.63, POD, CT, n)
    // Pilasters on the church's west wall behind.
    for (const y of ys) cbox(stone, rect(BX0 - 0.35, BX0, y - 0.6, y + 0.6), POD, CT, { top: false })
    // The entablature: a deep beam round three sides, its soffit the porch ceiling.
    const ent = rect(PX0, BX0, Y(-PHW), Y(PHW))
    cbox(stone, ent, CT, CT + 1.6, { top: false, bottom: true })
    cbox(trim, grow(ent, 0.25, 0.25), CT + 1.6, CT + 2.4, { b: 0.2, bottom: true, top: false })
    // The pediment: a triangular wedge with its raking cornice, under a lead roof.
    const z0 = CT + 2.4, z1 = 18.0
    tf(stone, [PX0 + 0.1, Y(-PHW), z0], [PX0 + 0.1, Y(PHW), z0], [PX0 + 0.1, YC, z1 - 0.4], [-1, 0, 0])
    const sl = Math.hypot(PHW + 0.3, z1 - z0)
    for (const s of [-1, 1]) {
      const n3: V3 = [0, s * (z1 - z0) / sl, (PHW + 0.3) / sl]
      qf(roof, [PX0 - 0.3, Y(s * (PHW + 0.3)), z0], [BX0, Y(s * (PHW + 0.3)), z0], [BX0, YC, z1], [PX0 - 0.3, YC, z1], n3)
      // The raking cornice: a band along the gable's edge.
      qf(trim, [PX0 - 0.3, Y(s * (PHW + 0.3)), z0], [PX0 - 0.3, YC, z1], [PX0 - 0.3, YC, z1 - 0.7], [PX0 - 0.3, Y(s * (PHW + 0.3)), z0 - 0.7], [-1, 0, 0])
      qf(trim, [PX0 - 0.3, Y(s * (PHW + 0.3)), z0 - 0.7], [PX0 + 0.1, Y(s * (PHW + 0.3)), z0 - 0.7], [PX0 + 0.1, YC, z1 - 0.7], [PX0 - 0.3, YC, z1 - 0.7], [0, -s * 0.3, -1])
    }
    // The royal arms carved in the tympanum, a stone relief.
    cbox(trim, rect(PX0 - 0.2, PX0 + 0.2, YC - 1.6, YC + 1.6), z0 + 0.3, z0 + 2.3, { b: 0.15 })
    // Doors in the west wall behind the columns.
    const F = face('w', BX0)
    holePanel(door, F, { a0: YC - 1.2, a1: YC + 1.2, zb: POD, zs: 5.4, head: 'round' }, 0.06)
    for (const s of [-1, 1]) holePanel(door, F, { a0: Y(s * 5.0) - 0.9, a1: Y(s * 5.0) + 0.9, zb: POD, zs: 4.4, head: 'round' }, 0.06)
    for (const s of [-1, 1]) holePanel(win, F, { a0: Y(s * 5.0) - 0.9, a1: Y(s * 5.0) + 0.9, zb: 7.0, zs: 9.6, head: 'round' }, 0.06)
  }

  // ---- The steeple.
  {
    const cx = -14.3, cy = YC, h = 4.0
    const r = rect(cx - h, cx + h, cy - h, cy + h)
    // The oculus stage, from the body up through the roof.
    cbox(stone, r, EAVE, 25.6, { top: false })
    for (const [side, at, c] of [['n', r.y1, cx], ['s', r.y0, cx], ['e', r.x1, cy], ['w', r.x0, cy]] as Array<[Side, number, number]>) {
      disc(win, face(side, at), c, 22.0, 1.05, lo ? 10 : 14, 0.06)
      ringOn(trim, face(side, at), c, 22.0, 1.05, 1.45, lo ? 10 : 14, 0.08)
    }
    cbox(trim, grow(r, 0.4), 25.6, 26.5, { b: 0.25, bottom: true, top: false })
    // The louvred belfry stage: a tall round-headed opening each side,
    // louvres deep inside, paired pilasters at the corners.
    const r2 = grow(r, -0.25)
    const hole = (c: number): Hole => ({ a0: c - 0.95, a1: c + 0.95, zb: 27.1, zs: 31.1, head: 'round' })
    const H2 = { n: [hole(cx)], s: [hole(cx)], e: [hole(cy)], w: [hole(cy)] }
    for (const side of ['n', 's', 'e', 'w'] as Side[]) void side
    wallHoles(stone, face('n', r2.y1), r2.x0, r2.x1, 26.5, 32.7, H2.n, { depth: 0.8, back: roof })
    wallHoles(stone, face('s', r2.y0), r2.x0, r2.x1, 26.5, 32.7, H2.s, { depth: 0.8, back: roof })
    wallHoles(stone, face('e', r2.x1), r2.y0, r2.y1, 26.5, 32.7, H2.e, { depth: 0.8, back: roof })
    wallHoles(stone, face('w', r2.x0), r2.y0, r2.y1, 26.5, 32.7, H2.w, { depth: 0.8, back: roof })
    for (const [x, y] of [[r2.x0, r2.y0], [r2.x1, r2.y0], [r2.x1, r2.y1], [r2.x0, r2.y1]] as XY[]) {
      cbox(stone, rect(x - 0.55, x + 0.55, y - 0.55, y + 0.55), 26.5, 32.7, { top: false })
    }
    // Pilasters flanking each opening.
    for (const [side, at, c] of [['n', r2.y1, cx], ['s', r2.y0, cx], ['e', r2.x1, cy], ['w', r2.x0, cy]] as Array<[Side, number, number]>) {
      for (const k of [-1, 1]) {
        const a = c + k * 1.85, ns = side === 'n' || side === 's', sg = side === 'n' || side === 'e' ? 1 : -1
        const R = ns ? rect(a - 0.32, a + 0.32, Math.min(at, at + sg * 0.3), Math.max(at, at + sg * 0.3)) : rect(Math.min(at, at + sg * 0.3), Math.max(at, at + sg * 0.3), a - 0.32, a + 0.32)
        cbox(trim, R, 26.5, 32.7, { top: false })
      }
    }
    cbox(trim, grow(r, 0.35), 32.7, 33.6, { b: 0.25, bottom: true, top: roof })
    // The clock stage, with a clock in each face and urns at the corners.
    const r3 = grow(r, -0.85)
    cbox(stone, r3, 33.6, 37.4, { top: false })
    for (const [side, at, c] of [['n', r3.y1, cx], ['s', r3.y0, cx], ['e', r3.x1, cy], ['w', r3.x0, cy]] as Array<[Side, number, number]>) {
      const F = face(side, at)
      disc(win, F, c, 35.4, 1.15, lo ? 10 : 14, 0.07)
      ringOn(gold, F, c, 35.4, 1.15, 1.35, lo ? 10 : 14, 0.09)
    }
    for (const [x, y] of [[r.x0 + 0.3, r.y0 + 0.3], [r.x1 - 0.3, r.y0 + 0.3], [r.x1 - 0.3, r.y1 - 0.3], [r.x0 + 0.3, r.y1 - 0.3]] as XY[]) {
      cylinder(stone, x, y, 0.32, 33.6, 34.6, 6, 0.42)
      spire(stone, ngon(x, y, 0.42, 6, 34.6), [x, y, 35.3])
    }
    cbox(trim, grow(r3, 0.3), 37.0, 37.6, { b: 0.15, bottom: true, top: roof })
    // The open octagonal belfry: eight arches through a thin wall, columns
    // at the angles, a solid core inside for the bells.
    const R = 2.9, oc = ngon(cx, cy, R, 8, 0)
    for (let k = 0; k < 8; k++) {
      const a: XY = [oc[k][0], oc[k][1]], b: XY = [oc[(k + 1) % 8][0], oc[(k + 1) % 8][1]], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      wallHoles(stone, faceAB(a, b), 0, L, 37.6, 42.6, [{ a0: 0.35, a1: L - 0.35, zb: 37.6, zs: 40.6, head: 'round', seg: lo ? 4 : 6 }], { depth: 0.45, through: true, reveal: stone })
      cylinder(trim, a[0], a[1], 0.3, 37.6, 42.4, 6)
    }
    ngonPrism(roof, cx, cy, 1.2, 8, 37.6, 42.6, { top: false })
    ngonPrism(trim, cx, cy, R + 0.35, 8, 42.6, 43.3, { top: roof, bottom: true })
    // The small stage with oculi, then the obelisk spire, ball and vane.
    ngonPrism(stone, cx, cy, 2.1, 8, 43.3, 45.0, { top: false })
    const o2 = ngon(cx, cy, 2.1, 8, 0)
    for (let k = 0; k < 8; k += 2) {
      const a: XY = [o2[k][0], o2[k][1]], b: XY = [o2[k + 1][0], o2[k + 1][1]]
      disc(win, faceAB(a, b), Math.hypot(b[0] - a[0], b[1] - a[1]) / 2, 44.15, 0.42, 8, 0.05)
    }
    ngonPrism(trim, cx, cy, 2.35, 8, 45.0, 45.6, { top: roof, bottom: true })
    ngonPrism(stone, cx, cy, 1.6, 8, 45.6, 46.6, { top: false })
    ngonPrism(trim, cx, cy, 1.75, 8, 46.6, 46.9, { top: roof, bottom: true })
    const sp = ngon(cx, cy, 1.4, 8, 46.9)
    const tipZ = 56.2
    spire(stone, sp, [cx, cy, tipZ])
    // Oval lights up the spire, on alternate faces.
    for (let k = 0; k < 8; k += 2) {
      const a = sp[k], b = sp[(k + 1) % 8]
      for (const t of lo ? [0.22, 0.5] : [0.18, 0.38, 0.58]) {
        const z = 46.9 + (tipZ - 46.9) * t, s = 1 - t
        const A: XY = [cx + (a[0] - cx) * s, cy + (a[1] - cy) * s], B: XY = [cx + (b[0] - cx) * s, cy + (b[1] - cy) * s]
        const L = Math.hypot(B[0] - A[0], B[1] - A[1])
        disc(win, faceAB(A, B), L / 2, z, Math.min(0.32, L * 0.22), 6, 0.08)
      }
    }
    cylinder(gold, cx, cy, 0.38, 56.0, 56.9, 8)
    cbox(gold, rect(cx - 0.07, cx + 0.07, cy - 0.07, cy + 0.07), 56.9, 58.5, {})
    cbox(gold, rect(cx - 0.07, cx + 0.07, cy - 0.5, cy + 0.5), 57.8, 58.0, {})
  }

  // At night the portico and the steeple are floodlit.
  const lit = (q: V3, n: V3): number => (n[2] > 0.8 ? 0.25 : q[0] < -10 || q[2] > 18 ? 0.95 : 0.5)
  return [
    { part: stone, material: { ...PALETTE.stone, floodlight: lit } },
    { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
    { part: gold, material: finish('gilt', 0xd9b35c) },
  ]
}

if (import.meta.main) {
  const extras = { source: 'generators/london-st-martin-in-the-fields.ts' }
  await saveLod('london-st-martin-in-the-fields', 'St Martin-in-the-Fields', build(true), extras, false, 5000)
}
