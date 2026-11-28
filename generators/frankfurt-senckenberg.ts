/**
 * Senckenberg Naturmuseum, Senckenberganlage 25, Frankfurt am Main: the
 * natural history museum of 1904-07 by Ludwig Neher, neo-Baroque in red
 * Main sandstone with rendered upper walls on the sides, its front to the
 * east on the Senckenberganlage. Original procedural geometry, CC0-1.0.
 * bun generators/frankfurt-senckenberg.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/30119021,
 * 50.1175308, 8.6514950. The front runs at 5.8 degrees (OSM front edges),
 * so the catalog bearing is 5.8: the front faces +x (east), the museum's
 * quadrangle and its west wing run back to -x.
 *
 * Identity, in order: the red sandstone front with its five-bay centre
 * risalit, three tall round-arched windows through two storeys, the
 * balcony over the arched entrance; the attic over the centre with its
 * concave volutes and segmental gable, crowned by the green bronze Chronos
 * with two putti, a sculpted cartouche in the gable; the two bronze groups
 * (Europa on the bull, a Triton group) on pedestals at the risalit's
 * corners; the steep grey slate hipped roof; the cream rendered upper
 * walls of the side bays and side elevations; the Diplodocus replica on
 * the forecourt.
 *
 * Evidence:
 *  - plan: OSM outline way/30119021 and its parts read in the turned
 *    frame: front x 55, y -27.8..21.8 (49.6 m), the centre risalit y -12..
 *    9.4 standing 0.7 m proud; the quadrangle back to x -40 with its two
 *    light courts (30119022 "1. Lichthof", 958603757), the west wing
 *    958603755 to x -84, the small south porch 958603756.
 *  - heights: OSM has 5 levels and no heights; no lidar. Scaled from
 *    Daniel Falke's frontal photo, taking the main cornice as 17 m (5
 *    storeys): ground-floor windows 3.4-6.7 m, balcony 7.9-9.4 m, the three
 *    tall arched windows 8.8-15.2 m, main cornice 16.2-17 m, attic windows
 *    18.3-20.6 m, attic cornice 21.8 m, gable apex 25.2 m, Chronos to about
 *    30 m (all estimated). The hipped roof's ridge (21.6 m) is kept under
 *    the gable's shoulders, as the street photos show it. The quadrangle
 *    (14.5 m) and west wing (13 m) are estimates, kept low so nothing
 *    behind rises over the front's cornice line in the frontal view; the
 *    light courts' glazed roofs rise only 0.8 m.
 *  - Diplodocus: OSM node/6432469198 ("Diplodocus Longus", tourism=
 *    artwork) at (64, 24.6); length (about 25 m) and pose estimated from Grimes2's
 *    and Ugureisberg's photos. The T-Rex (node/2585387817) stands across
 *    the road in the Senckenberganlage and is left out.
 *  - colours from the daylight photos: red sandstone, cream render, grey
 *    slate, green bronze; the Diplodocus is drawn in the same green as the
 *    bronze (a material is saved for the courts' glass roofs).
 *  - night: windows lit, the front lightly floodlit.
 *  - terrain: Mapterhorn falls about 1.5 m from the front (east) to the
 *    west wing, with a 3-4 m deep hollow over the west light court
 *    (958603757), which no photo shows. The map grounds the model on that
 *    hollow, so the front steps read up to 4 m under the drawn street in
 *    `terrain.ts check`. Kept true to the photos; elevation 0.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Senckenberg Naturmuseum.jpg (Daniel Falke, CC BY-SA 4.0): front.
 *    https://commons.wikimedia.org/wiki/File:Senckenberg_Naturmuseum.jpg
 *  - Senckenberg Museum building.jpg (Yair Haklai, CC BY-SA 4.0): front.
 *    https://commons.wikimedia.org/wiki/File:Senckenberg_Museum_building.jpg
 *  - Front facade - Naturmuseum Senckenberg - DSC02288.JPG and Chronos and
 *    relief - DSC02283.JPG (Daderot, CC0)
 *    https://commons.wikimedia.org/wiki/File:Front_facade_-_Naturmuseum_Senckenberg_-_DSC02288.JPG
 *    https://commons.wikimedia.org/wiki/File:Chronos_and_relief_-_Naturmuseum_Senckenberg_-_DSC02283.JPG
 *  - Senckenberg Museum Frankfurt.jpg (Grimes2, CC0): north-east corner and the Diplodocus.
 *    https://commons.wikimedia.org/wiki/File:Senckenberg_Museum_Frankfurt.jpg
 *  - Senckenberg Museum Frankfurt am Main.jpg (Ugureisberg, CC BY-SA 4.0): from the east.
 *    https://commons.wikimedia.org/wiki/File:Senckenberg_Museum_Frankfurt_am_Main.jpg
 *  - ETH-BIB-Senckenberg, Museum, Universität, Fliegerbild (Leo Wehrli,
 *    c. 1930, CC BY-SA 4.0): aerial; plan of the front block and roof
 *    (the lantern on the roof seen there was lost in 1944 and is not drawn).
 *    https://commons.wikimedia.org/wiki/File:ETH-BIB-Senckenberg,_Museum,_Universit%C3%A4t,_Fliegerbild,_Frankfurt_am_Main-Dia_247-02466.tif
 *  - Bundesarchiv B 145 Bild-F049012-0014 (Detlef Gräfingholt, CC BY-SA 3.0 de): front.
 *    https://commons.wikimedia.org/wiki/File:Bundesarchiv_B_145_Bild-F049012-0014,_Frankfurt-Main,_Universit%C3%A4t.jpg
 * Look-only (GFDL, not relied on): "Frankfurt Am Main-Senckenberg
 * Naturmuseum von Osten-20120325.jpg" (Mylius). No commercial imagery, no
 * 3D city models (Hessen LoD2 not used).
 *
 * Left out: the balcony railing's ironwork (a dark band), the window
 * aedicules' carving, the rustication joints, the arcaded gateways to the
 * neighbours (not in the outline), the T-Rex.
 *
 * Doubts: the back of the quadrangle and the west wing are in no photo:
 * drawn as plain blocks with flat slate roofs and low glazed roofs over the
 * two courts. All heights are photo-scaled.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  writeLods, prism, box, straight as S, wrect, warch, wframe, wbox, band, figure, face, cap, rect, setCurve, blob, ellipsoid, limb, seated, lathe, ccw,
  type Mat, type XY, type Wall,
} from './frankfurt-alte-oper'
import { hipRoof, wallSlab } from './amsterdam-westerkerk'

export const ID = 'frankfurt-senckenberg'
const BEARING = 5.8
const ANCHOR: [number, number] = [50.1175308, 8.651495]

const FX = 53.1, FY0 = -22.6, FY1 = 27.3, BX = 40.2
const RY0 = -10.3, RY1 = 14.9, RP = 0.85, RC = (RY0 + RY1) / 2
const CORN = 17.0, REAR = 14.5, WING = 13.0, RIDGE = 21.6

function build(D: boolean): Mat[] {
  const sand = new Part(), render = new Part(), slate = new Part(), win = new Part(), bronze = new Part(), glass = new Part()
  setCurve(D ? 1.2 : 2.6)
  const AN = D ? 8 : 5

  // ---- massing: front block and its risalit, the quadrangle, the west wing, the south porch
  prism(sand, rect(BX, FY0, FX, FY1), 0, 7.9, false)
  prism(render, rect(BX, FY0, FX, FY1), 7.9, CORN - 0.5, false)
  prism(sand, rect(FX - 0.5, RY0, FX + RP, RY1), 0, CORN - 0.5, false)
  hipRoof(slate, BX, FY0, FX, FY1, CORN, RIDGE, 0.5)
  const Q1: XY[] = [[BX, -21.85], [-26.0, -21.85], [-26.0, -10.4], [-30.2, -10.4], [-30.3, 15.2], [-33.6, 15.3], [-41.9, 15.2], [-42.0, 26.5], [-30.6, 26.85], [-6.7, 26.8], [6.1, 26.4], [BX, 26.4]]
  const Q2: XY[] = [[-26.0, -21.85], [-43.4, -21.96], [-43.4, -21.6], [-68.8, -21.7], [-68.8, -25.1], [-82.8, -25.15], [-82.9, -9.2], [-83.8, -7.6], [-82.5, -6.4], [-81.0, -7.4], [-69.0, -7.6], [-59.6, -7.6], [-56.0, -6.6], [-52.75, -7.55], [-52.7, -10.6], [-43.4, -10.5], [-30.2, -10.4], [-26.0, -10.4]]
  const PORCH: XY[] = [[8.2, -23.6], [8.6, -26.4], [18.5, -26.4], [18.9, -23.6], [18.5, -23.2], [13.1, -23.2], [13.1, -21.6], [11.0, -21.6], [11.0, -23.2], [8.6, -23.2]]
  prism(sand, Q1, 0, 5.0, false)
  prism(render, Q1, 5.0, REAR, false)
  prism(sand, Q2, 0, 4.5, false)
  prism(render, Q2, 4.5, WING, false)
  prism(sand, PORCH, 0, 5.0)
  // roofs: flat slate, the two light courts under low glazed hips
  cap(slate, ccw(Q1), REAR)
  cap(slate, ccw(Q2), WING)
  for (const [x0, y0, x1, y1] of [[7.1, -10.5, 29.9, 15.4], [-30.2, -10.4, -6.7, 15.2]]) hipRoof(glass, x0, y0, x1, y1, REAR + 0.05, REAR + 0.8, 0)
  // cornices and plain windows round the quadrangle and the wing
  for (const [r, z, base] of [[Q1, REAR, 5.0], [Q2, WING, 4.5]] as [XY[], number, number][]) {
    const c = ccw(r)
    for (let i = 0; i < c.length; i++) {
      const w = S(c[i], c[(i + 1) % c.length])
      if (w.L < 2) continue
      band(sand, w, 0, w.L, z - 0.6, z, 0.45)
      band(sand, w, 0, w.L, base - 0.3, base, 0.15)
      if (w.L > 7) for (let s = 2.4; s < w.L - 2; s += 4.0) {
        wrect(win, w, s - 0.7, s + 0.7, 1.6, 3.9, 0.05)
        wrect(win, w, s - 0.7, s + 0.7, 6.0, 8.8, 0.05)
        if (z > 15) wrect(win, w, s - 0.7, s + 0.7, 10.6, 13.4, 0.05)
      }
    }
  }

  // ---- window kit: a window in a red sandstone surround, with a cornice in detail
  function winSurround(w: Wall, c: number, hw: number, z0: number, z1: number, arch = false) {
    if (arch) warch(win, w, c, hw, z0, z1 - hw, 0.08, AN)
    else wrect(win, w, c - hw, c + hw, z0, z1, 0.08)
    // a red sandstone surround round every window, flat in the low model
    if (arch) warch(sand, w, c, hw + 0.32, z0 - 0.3, z1 - hw, 0.04, AN)
    else wrect(sand, w, c - hw - 0.32, c + hw + 0.32, z0 - 0.3, z1 + 0.3, 0.04)
    if (D && arch) wframe(sand, w, c, hw, z0, z1 - hw, 0.22, 0.12, AN)
    else if (D) { wbox(sand, w, c - hw - 0.2, c - hw, z0, z1, 0, 0.12, false); wbox(sand, w, c + hw, c + hw + 0.2, z0, z1, 0, 0.12, false) }
    if (D) { wbox(sand, w, c - hw - 0.35, c + hw + 0.35, z1 + 0.15, z1 + 0.5, 0, 0.28); wbox(sand, w, c - hw - 0.3, c + hw + 0.3, z0 - 0.3, z0, 0, 0.22) }
  }
  /** A side face: a sandstone base and frames, render between; window columns at `cols`. */
  function sideFace(w: Wall, cols: number[]) {
    band(sand, w, 0, w.L, 0, 0.8, 0.15)
    band(sand, w, 0, w.L, 7.5, 7.9, 0.3)
    band(sand, w, 0, w.L, CORN - 0.8, CORN, 0.7)
    for (const e of [0, w.L - 1.1]) wbox(sand, w, e, e + 1.1, 7.9, CORN - 0.8, 0, 0.14, false)
    for (const c of cols) {
      // the red apron panel between the upper windows, a cartouche over the top one
      wrect(sand, w, c - 1.0, c + 1.0, 11.9, 12.8, 0.05)
      if (D) blob(sand, w.M(c, 15.6, 0.1), 0.45, 0.45, 0.35, 6, 3)
      warch(win, w, c, 0.8, 3.7, 5.5, 0.05, AN)
      if (D) wframe(sand, w, c, 0.8, 3.7, 5.5, 0.22, 0.12, AN)
      wrect(win, w, c - 0.5, c + 0.5, 1.0, 2.2, 0.05)
      winSurround(w, c, 0.85, 8.6, 11.6)
      winSurround(w, c, 0.85, 13.1, 14.9, true)
    }
  }
  // the front block's north and south ends: four bays
  for (const w of [S([FX, FY1], [BX, FY1]), S([BX, FY0], [FX, FY0])]) sideFace(w, [2.0, 5.0, 8.0, 11.0])

  // ---- the front: side bays (two window columns each) and the risalit
  const F = S([FX, FY0], [FX, FY1]) // s from the south end
  const rs0 = RY0 - FY0, rs1 = RY1 - FY0
  for (const [a, b] of [[0, rs0], [rs1, F.L]]) {
    const L = b - a
    const sub = S([FX, FY0 + a], [FX, FY0 + b])
    sideFace(sub, [L * 0.3, L * 0.68])
  }
  const R = S([FX + RP, RY0], [FX + RP, RY1]), RL = R.L, rc = RL / 2
  band(sand, R, 0, RL, 0, 0.8, 0.15)
  band(sand, R, 0, RL, 2.6, 2.9, 0.2)
  band(sand, R, 0, RL, CORN - 0.8, CORN, 0.85)
  if (D) band(sand, R, 0, RL, CORN - 1.4, CORN - 0.8, 0.25, false)
  for (const [a, b] of [[R.M(0, 0, 0), F.M(rs0, 0, 0)], [F.M(rs1, 0, 0), R.M(RL, 0, 0)]] as [V3, V3][]) {
    const w = S([a[0], a[1]], [b[0], b[1]])
    band(sand, w, 0, w.L, CORN - 0.8, CORN, 0.85)
  }
  // seven bays: narrow at +-10.7 and +-3.5, wide round-arched through two storeys at +-7.1 and 0
  for (const d of [-7.1, 0, 7.1]) {
    const c = rc + d
    warch(win, R, c, 1.25, 8.8, 13.9, 0.05, AN)
    wbox(sand, R, c - 1.6, c + 1.6, 8.5, 8.8, 0, 0.3)
    if (D) {
      wframe(sand, R, c, 1.25, 8.8, 13.9, 0.32, 0.22, AN)
      // white glazing bars: a mullion and two transoms, as in the photos
      wbox(render, R, c - 0.07, c + 0.07, 8.8, 15.1, 0, 0.1, false)
      for (const z of [11.4, 13.9]) wbox(render, R, c - 1.25, c + 1.25, z - 0.07, z + 0.07, 0, 0.1, false)
      // keystone ornament over the arch
      blob(sand, R.M(c, 15.5, 0.2), 0.5, 0.3, 0.5, 6, 3)
    } else wframe(sand, R, c, 1.25, 8.8, 13.9, 0.32, 0.22, AN)
    // the ground floor under it
    if (d !== 0) { warch(win, R, c, 0.8, 3.4, 5.9, 0.05, AN); if (D) wframe(sand, R, c, 0.8, 3.4, 5.9, 0.22, 0.14, AN); wrect(win, R, c - 0.5, c + 0.5, 1.0, 2.2, 0.05) }
  }
  for (const d of [-10.7, -3.5, 3.5, 10.7]) {
    const c = rc + d
    winSurround(R, c, 0.7, 8.8, 11.7)
    winSurround(R, c, 0.7, 13.4, 15.3, true)
    if (D) blob(sand, R.M(c, 12.5, 0.12), 0.55, 0.5, 0.35, 6, 3)
    warch(win, R, c, 0.75, 3.4, 5.9, 0.05, AN)
    if (D) wframe(sand, R, c, 0.75, 3.4, 5.9, 0.22, 0.14, AN)
  }
  // pilasters between the bays
  for (const d of [-12.2, -8.9, -5.3, -1.75, 1.75, 5.3, 8.9, 12.2]) { const s = Math.min(RL - 0.4, Math.max(0.4, rc + d)); wbox(sand, R, s - 0.4, s + 0.4, 7.9, CORN - 1.4, 0, 0.25, false) }
  // the arched door, its surround and steps
  warch(win, R, rc, 1.25, 0.9, 5.4, 0.35, AN)
  wframe(sand, R, rc, 1.25, 0.9, 5.4, 0.45, 0.65, AN)
  for (let k = 0; k < (D ? 5 : 2); k++) { const n = D ? 5 : 2, dd = 3.0 - (k * 3.0) / n; const a = R.M(rc - 3.4, 0, 0), b = R.M(rc + 3.4, 0, dd); box(sand, a[0], a[1], b[0], b[1], 0, (0.9 * (k + 1)) / n) }
  // the balcony over the door on corbels, with a dark iron railing
  {
    const a = R.M(rc - 5.2, 0, 0), b = R.M(rc + 5.2, 0, 1.3)
    box(sand, a[0], a[1], b[0], b[1], 7.9, 8.5)
    if (D) for (const d of [-4.5, -2.2, 2.2, 4.5]) { const m = R.M(rc + d, 0, 0.6); box(sand, m[0] - 0.6, m[1] - 0.25, m[0] + 0.6, m[1] + 0.25, 6.3, 7.9) }
    const r0 = R.M(rc - 5.1, 0, 1.15), r1 = R.M(rc + 5.1, 0, 1.25)
    box(slate, r0[0], r0[1], r1[0], r1[1], 8.5, 9.4)
  }
  // ---- the attic and gable over the centre: volutes, segmental top
  {
    const aw = 5.8, top = 21.8, apex = 25.2, vs = 8.6 // vs: half-width where the volutes meet the cornice
    const out: XY[] = []
    const n = D ? 8 : 4
    for (let k = 0; k <= n; k++) { const t = k / n; out.push([rc - vs + (vs - aw) * Math.sin((t * Math.PI) / 2), CORN + (top - 0.9 - CORN) * (1 - Math.cos((t * Math.PI) / 2))]) }
    out.push([rc - aw, top])
    const m = D ? 10 : 5, rise = apex - top, Rr = (aw * aw + rise * rise) / (2 * rise), zc = apex - Rr, a0 = Math.asin(aw / Rr)
    for (let k = 0; k <= m; k++) { const t = -a0 + (k / m) * 2 * a0; out.push([rc + Rr * Math.sin(t), zc + Rr * Math.cos(t)]) }
    out.push([rc + aw, top])
    for (let k = n; k >= 0; k--) { const t = k / n; out.push([rc + vs - (vs - aw) * Math.sin((t * Math.PI) / 2), CORN + (top - 0.9 - CORN) * (1 - Math.cos((t * Math.PI) / 2))]) }
    const a = R.M(0, 0, 0), b = R.M(RL, 0, 0)
    wallSlab(sand, [a[0], a[1]], [b[0], b[1]], out, 1.6, -1.3)
    // the attic cornice and the gable's moulding
    wbox(sand, R, rc - aw - 0.3, rc + aw + 0.3, top - 0.55, top, 0.3, 0.8)
    for (let k = 0; k < m; k++) {
      const t0 = -a0 + (k / m) * 2 * a0, t1 = -a0 + ((k + 1) / m) * 2 * a0
      const P = (r: number, t: number): XY => [rc + r * Math.sin(t), zc + r * Math.cos(t)]
      const p0 = P(Rr + 0.15, t0), p1 = P(Rr + 0.15, t1), q0 = P(Rr - 0.5, t0), q1 = P(Rr - 0.5, t1)
      face(sand, [R.M(p0[0], p0[1], 0.6), R.M(p1[0], p1[1], 0.6), R.M(q1[0], q1[1], 0.6), R.M(q0[0], q0[1], 0.6)], [1, 0, 0])
      const tm = (t0 + t1) / 2
      face(sand, [R.M(p0[0], p0[1], 0.6), R.M(p1[0], p1[1], 0.6), R.M(p1[0], p1[1], -1.3), R.M(p0[0], p0[1], -1.3)], [0, Math.sin(tm), Math.cos(tm)])
    }
    // three attic windows, the cartouche and its supporters in the gable
    const RA = S([FX + RP + 0.3, RY0], [FX + RP + 0.3, RY1])
    for (const d of [-3.4, 0, 3.4]) winSurround(RA, rc + d, 0.7, 18.3, 20.6, true)
    ellipsoid(sand, R.M(rc, 23.3, 0.45), [0, 0.75, 0], [0.3, 0, 0], [0, 0, 0.8], D ? 10 : 6, 4)
    if (D) for (const sd of [-1, 1]) { recl(R.M(rc + sd * 2.2, 22.2, 0.45), sd); blob(sand, R.M(rc + sd * 4.0, 22.15, 0.45), 0.7, 0.3, 0.25, 6, 3) }
    // slate behind the attic, back into the hip
    face(slate, [R.M(rc - aw, top - 0.3, -1.3), R.M(rc + aw, top - 0.3, -1.3), R.M(rc + aw, RIDGE, -7), R.M(rc - aw, RIDGE, -7)], [-0.3, 0, 1])
    // Chronos with two putti on the apex
    const ap = R.M(rc, apex, -0.35)
    box(sand, ap[0] - 0.8, ap[1] - 0.8, ap[0] + 0.6, ap[1] + 0.8, apex - 0.4, apex + 0.5)
    chronos(bronze, ap[0], ap[1], apex + 0.5, D)
    // bronze groups on the outer narrow bays: Europa on the bull, a Triton on a sea beast
    for (const [d, kind] of [[-10.7, 0], [10.7, 1]] as [number, number][]) {
      const m2 = R.M(rc + d, 0, -0.5)
      box(sand, m2[0] - 1.1, m2[1] - 1.4, m2[0] + 1.0, m2[1] + 1.4, CORN, CORN + 0.8)
      beastGroup(bronze, m2[0], m2[1], CORN + 0.8, kind, D)
    }
  }
  function recl(p: V3, sd: number) {
    limb(sand, [p[0] + 0.2, p[1] - sd * 0.1, p[2]], [p[0] + 0.2, p[1] + sd * 1.0, p[2] - 0.15], 0.26, 6, 3, 0.22)
    blob(sand, [p[0] + 0.25, p[1] - sd * 0.3, p[2] + 0.3], 0.15, 0.15, 0.17, 6, 3)
  }

  // ---- the Diplodocus on the forecourt
  diplodocus(bronze, 64.0, 24.6, D)

  const flood = (p: V3, n: V3) => (p[0] > BX && n[0] > 0.5 ? 0.6 : 0)
  return [
    { part: sand, material: { ...finish('senck-sandstone', 0xc4907f), floodlight: flood } },
    { part: render, material: { ...finish('senck-render', 0xeee3cf), floodlight: flood } },
    { part: slate, material: finish('senck-slate', 0x878d93) },
    { part: win, material: PALETTE.window },
    { part: bronze, material: finish('senck-bronze', 0x80a490) },
    { part: glass, material: PALETTE.glass },
  ]
}

/** Chronos, a winged old man with a raised scythe, and two putti at his feet (facing +x). */
function chronos(p: Part, x: number, y: number, z: number, D: boolean) {
  const nu = D ? 8 : 5
  // body on a rock
  blob(p, [x, y, z + 0.35], 0.75, 0.75, 0.45, nu, 3)
  limb(p, [x, y, z + 0.6], [x + 0.05, y, z + 2.4], 0.32, nu, 4, 0.26)
  blob(p, [x + 0.08, y, z + 2.7], 0.18, 0.18, 0.21, nu, 4)
  // the raised right arm with the scythe
  limb(p, [x, y + 0.3, z + 2.2], [x + 0.1, y + 0.5, z + 3.2], 0.09, 5, 3)
  limb(p, [x + 0.1, y + 0.5, z + 2.4], [x + 0.1, y + 0.5, z + 4.0], 0.04, 4, 2)
  limb(p, [x + 0.1, y + 0.5, z + 3.95], [x + 0.7, y + 0.1, z + 3.75], 0.06, 4, 2, 0.03)
  limb(p, [x, y - 0.3, z + 2.2], [x + 0.35, y - 0.55, z + 1.6], 0.08, 5, 3)
  // wings
  for (const s of [-1, 1]) {
    const r: V3 = [x - 0.25, y + s * 0.2, z + 2.3], t: V3 = [x - 0.55, y + s * 1.1, z + 3.3], b: V3 = [x - 0.5, y + s * 0.9, z + 1.4]
    face(p, [r, t, b], [-1, 0, 0]); face(p, [r, t, b], [1, 0, 0])
  }
  // putti either side
  for (const s of [-1, 1]) {
    blob(p, [x + 0.2, y + s * 1.0, z + 0.45], 0.25, 0.25, 0.35, nu - 2, 3)
    blob(p, [x + 0.22, y + s * 1.0, z + 0.95], 0.14, 0.14, 0.15, nu - 2, 3)
  }
}

/** A bronze group: a beast (bull or sea-horse) with a figure riding it, facing +x. */
function beastGroup(p: Part, x: number, y: number, z: number, kind: number, D: boolean) {
  const nu = D ? 8 : 5, dir = kind === 0 ? -1 : 1
  ellipsoid(p, [x, y, z + 0.9], [0, 1.15 * dir, 0.2], [0.5, 0, 0], [0, -0.1 * dir, 0.55], nu, 4)
  limb(p, [x, y + 0.9 * dir, z + 1.1], [x + 0.1, y + 1.5 * dir, z + 1.7], 0.3, nu - 2, 3)
  blob(p, [x + 0.1, y + 1.7 * dir, z + 1.85], 0.25, 0.35, 0.25, nu - 2, 3)
  if (kind === 0) for (const s of [-0.7, 0.7]) limb(p, [x + 0.25, y + s, z + 0.6], [x + 0.35, y + s, z + 0.02], 0.12, 4, 2)
  else for (let k = 0; k < 3; k++) limb(p, [x, y - (0.6 + k * 0.5) * dir, z + 0.6 - k * 0.1], [x, y - (1.1 + k * 0.5) * dir, z + 0.3 + (k % 2) * 0.5], 0.22 - k * 0.04, 5, 3)
  seated(p, x, y - 0.1 * dir, z + 1.25, 1.5, nu - 1)
  limb(p, [x, y - 0.1 * dir, z + 2.4], [x + 0.2, y + 0.6 * dir, z + 3.0], 0.07, 4, 2)
}

/** A smooth tube swept along a path of centres with radii (rx across, rz up), closed at both ends. */
function tube(p: Part, C: V3[], rx: number[], rz: number[], n: number) {
  const rings: V3[][] = [], nrms: V3[][] = []
  for (let k = 0; k < C.length; k++) {
    const a = C[Math.max(0, k - 1)], b = C[Math.min(C.length - 1, k + 1)]
    const t: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], tl = Math.hypot(...t)
    const T: V3 = [t[0] / tl, t[1] / tl, t[2] / tl]
    let S: V3 = [T[1], -T[0], 0]; const sl = Math.hypot(...S) || 1; S = [S[0] / sl, S[1] / sl, 0]
    const U: V3 = [S[1] * T[2] - S[2] * T[1], S[2] * T[0] - S[0] * T[2], S[0] * T[1] - S[1] * T[0]]
    const ring: V3[] = [], nr: V3[] = []
    for (let q = 0; q < n; q++) {
      const th = (q / n) * 2 * Math.PI, cs = Math.cos(th), sn = Math.sin(th)
      ring.push([C[k][0] + S[0] * rx[k] * cs + U[0] * rz[k] * sn, C[k][1] + S[1] * rx[k] * cs + U[1] * rz[k] * sn, C[k][2] + S[2] * rx[k] * cs + U[2] * rz[k] * sn])
      const nx = S[0] * cs / rx[k] + U[0] * sn / rz[k], ny = S[1] * cs / rx[k] + U[1] * sn / rz[k], nz = S[2] * cs / rx[k] + U[2] * sn / rz[k], l = Math.hypot(nx, ny, nz)
      nr.push([nx / l, ny / l, nz / l])
    }
    rings.push(ring); nrms.push(nr)
  }
  for (let k = 0; k < C.length - 1; k++) for (let q = 0; q < n; q++) {
    const q2 = (q + 1) % n
    p.tri(rings[k][q], rings[k][q2], rings[k + 1][q2], undefined, undefined, undefined, [nrms[k][q], nrms[k][q2], nrms[k + 1][q2]])
    p.tri(rings[k][q], rings[k + 1][q2], rings[k + 1][q], undefined, undefined, undefined, [nrms[k][q], nrms[k + 1][q2], nrms[k + 1][q]])
  }
  const end = (k: number, sgn: number) => { for (let q = 0; q < n; q++) { const q2 = (q + 1) % n; const tri: V3[] = [C[k], rings[k][q], rings[k][q2]]; face(p, tri, [(C[k][0] - C[k - sgn][0]), (C[k][1] - C[k - sgn][1]), (C[k][2] - C[k - sgn][2])]) } }
  end(C.length - 1, 1); end(0, -1)
}

/**
 * The Diplodocus replica on the forecourt, about 25 m long: one smooth
 * sweep from the small head down the long neck, over the deep body and out
 * along the whip tail, on four pillar legs. Its head points south-south-east
 * as in Grimes2's photo.
 */
function diplodocus(p: Part, cx: number, cy: number, D: boolean) {
  const n = D ? 10 : 6
  const dx = 0.5, dy = -0.866
  const P = (a: number, z: number, side = 0): V3 => [cx + dx * a - dy * side, cy + dy * a + dx * side, z]
  // the spine: (distance along, height, half-width, half-depth), head to tail tip
  const spine: [number, number, number, number][] = [
    [12.2, 6.9, 0.16, 0.2], [11.7, 7.0, 0.26, 0.26], [11.0, 6.9, 0.22, 0.24], [9.5, 6.6, 0.3, 0.34], [7.8, 6.2, 0.4, 0.45], [6.0, 5.7, 0.52, 0.6],
    [4.3, 5.2, 0.7, 0.8], [2.6, 4.8, 1.0, 1.1], [1.0, 4.65, 1.25, 1.35], [-0.8, 4.7, 1.3, 1.4], [-2.4, 4.6, 1.1, 1.2], [-4.0, 4.3, 0.75, 0.8],
    [-6.0, 3.8, 0.5, 0.55], [-8.2, 3.2, 0.33, 0.36], [-10.4, 2.6, 0.2, 0.22], [-12.4, 2.1, 0.11, 0.12], [-13.8, 1.8, 0.05, 0.05],
  ]
  const pts = D ? spine : spine.filter((_, k) => k % 2 === 0 || k === spine.length - 1)
  tube(p, pts.map(([a, z]) => P(a, z)), pts.map((q) => q[2]), pts.map((q) => q[3]), n)
  // legs: thick pillars, front pair a little shorter
  for (const [a, sd] of [[2.0, 0.8], [2.0, -0.8], [-1.6, 0.85], [-1.6, -0.85]] as [number, number][]) {
    const foot = P(a, 0, sd)
    lathe(p, foot[0], foot[1], [[0, 0], [0.5, 0], [0.42, 0.45], [0.38, 2.2], [0.52, 3.8], [0, 4.4]], D ? 8 : 5)
  }
  if (D) for (let k = 0; k < 34; k++) {
    // the row of small dorsal spines from the neck to the tail
    const a = -12 + k * 0.68
    let z = 0, hz = 0
    for (let q = 0; q < spine.length - 1; q++) { const [a0, z0, , h0] = spine[q], [a1, z1, , h1] = spine[q + 1]; if (a <= a0 && a >= a1) { const t = (a0 - a) / (a0 - a1); z = z0 + (z1 - z0) * t; hz = h0 + (h1 - h0) * t } }
    if (!z) continue
    const h = 0.12 + hz * 0.25
    const b0 = P(a - 0.2, z + hz * 0.85), b1 = P(a + 0.2, z + hz * 0.85), t = P(a, z + hz + h)
    face(p, [b0, b1, t], [-dy, dx, 0]); face(p, [b0, b1, t], [dy, -dx, 0])
  }
}

if (import.meta.main && process.env.STATS) for (const D of [false, true]) console.log(D, build(D).map((m) => `${m.material.name}:${m.part.triangles}`).join(' '))
else if (import.meta.main) await writeLods(ID, 'Senckenberg Naturmuseum', ANCHOR, BEARING, build(false), build(true))
