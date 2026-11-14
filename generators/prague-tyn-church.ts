/**
 * Church of Our Lady before Týn, Prague (Kostel Matky Boží před Týnem) —
 * procedural, CC0-1.0, no textures. bun generators/prague-tyn-church.ts
 *
 * Uses the Gothic kit exported from prague-st-vitus-cathedral.ts (merge that
 * one first).
 *
 * The church only: the Týn school and the houses in front of it on Old Town
 * Square are separate OSM buildings and are left to the map.
 *
 * Frame: built turned to the church's axis. The nave's long walls in OSM run
 * at 72.3°, so the placement bearing is 342.3: +x is the axis towards the
 * choir (ENE), +y liturgical north, z up, metres. Origin = area centroid of
 * the OSM outline way/379512802 (lng 14.4227209, lat 50.0877144). The nave's
 * axis runs at y = 0.55; the west front, between the towers, at x = -27.
 *
 * Evidence
 * - OSM way/379512802 (building=church, 20 m, Q1453427) and its 27
 *   building:parts: the towers way/455314030 (north) and way/455314031
 *   (south), 55 m; their gallery roofs way/492321213 (55–58) and
 *   way/492321205 (55–60); the main spires way/492321218 and way/492486647
 *   (80, octagons 7.4 m across); the eight corner turrets way/492486635…641
 *   and way/492321216 (53–67); the eight spire turrets way/492486642…651
 *   (64–72), set on the faces of the main spires; the nave and apse
 *   way/455314032 (48, gabled); the ridge turret way/462196624 (55, onion);
 *   small annexes way/950050198, way/950050199, way/951078829 (20).
 * - Published: en/cs.wikipedia "Church of Our Lady before Týn": towers 80 m;
 *   Gothic, 14th–15th c., the north tower (Eve) slightly slimmer than the
 *   south (Adam); the gable's gilded Madonna (1626).
 * - Mapterhorn terrain: Old Town Square is flat (see the report).
 * - Commons daylight photos (EVIDENCE):
 *   "Our Lady before Tyn Prague September 2016-1.jpg", "-2.jpg", "-3.jpg"
 *     (Alvesgaspar, CC BY-SA 4.0, the west front from the square; -1 is the
 *     photo the heights are scaled from),
 *   "Prag - Blick vom Altstädter Rathausturm auf die Kirche der Jungfrau
 *     Maria vor dem Tein … - panoramio (1).jpg" (Edgar El, CC BY-SA 3.0, the
 *     front from the Old Town Hall tower: the west window, the balustrade,
 *     the gable),
 *   "Praha, Týnský chrám z Celetné.jpg" (PatrikPaprika, CC BY-SA 3.0, the
 *     south side: aisle and clerestory windows, buttresses, the red tile
 *     roofs with dormers, the ridge turret),
 *   "Praha Týnský chrám z Letné.jpg" (VitVit, CC BY-SA 3.0, from the north
 *     across the roofs),
 *   "Prag, Teynkirche -- 2019 -- 6584.jpg" and "-- 6588.jpg" (Dietmar
 *     Rabich, CC BY-SA 4.0),
 *   "Týnský chrám z Orloje.JPG" (VitVit, CC BY-SA 3.0),
 *   "Praha 1, Kostel Matky Boží před Týnem 20170809 005.jpg" (Tilman2007,
 *     CC BY-SA 4.0, the gable close up).
 *
 * Measured on Alvesgaspar -1 (scale from the south tower, 9.7 m wide in OSM,
 * and its 80 m top): the ledge and balustrade across the front and round
 * the towers at 46; the corbel table 57–57.7 and the pierced parapet to
 * 58.9; the main spires from 58.5 to 78, needle and gilt ball to 80; the
 * corner turrets on corbels at the parapet corners, spirelets to 66.5,
 * needles to 67.5 (OSM 67); the spire turrets with their little lanterns
 * 63.5–66.2 and caps to 71, needles to 72 (OSM 72); the gable 46–56.5 with
 * its cross to 59.5. Estimated from the south-side photo: aisle walls 20
 * (OSM), lean-to aisle roofs to 26, clerestory 26–36, nave roof to the OSM
 * ridge of 48 (about 65°), the ridge turret 48–55 (OSM 55). Colours from
 * the photos: dark grey-brown sandstone for the body, a darker weathered
 * tone for the quoins (40–57), string courses (20.8, 33.4), ledges, corbel
 * tables, parapets and the dense pinnacled gable, near-black slate on the spires (kept dark: it is the landmark's
 * identity, but no darker than charcoal), red tile on the nave and aisles,
 * gilt balls and the Madonna.
 *
 * Doubts: the east end and the north side are seen only from afar (Letná)
 * and over roofs; the apse's window heights and the annex on the south
 * (OSM 9.9–18.4) are estimated. The roof dormers are left out. The lower
 * west front is hidden behind the Týn school in every photo; the portal
 * there is drawn plain.
 *
 * Night: the towers and the front are floodlit; the spires faintly.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  archPts, bar, box, circlePts, ebox, fanPlane, hipRoof, lancet, lathe, obox, pf, pinnacle, prism, railing, tf, qf, tubePath, unit2, writeModel,
  type P2, type PF, type XY,
} from './prague-st-vitus-cathedral'

const AX = 0.55, YS = -5.0, YN = 6.1, XW = -27.0
const EAVE = 36, RIDGE = 48, AISLE = 20, AISLE_TOP = 26
const TOWERS = [
  { x0: -27.1, x1: -17.4, y0: 6.2, y1: 15.0, spire: 3.35 },  // north, Eve
  { x0: -26.9, x1: -17.1, y0: -14.3, y1: -5.0, spire: 3.55 }, // south, Adam
]

/** The nave and apse (OSM way/455314032). */
const NAVE: XY[] = [[-27.0, 6.1], [-26.9, -5.0], [23.9, -5.3], [26.7, -4.6], [27.9, -3.5], [29.4, -0.3], [29.4, 1.3], [28.2, 4.4], [27.0, 5.6], [24.5, 6.1]]
/** The aisles, from the outline without its buttresses. */
const AISLE_N: XY[] = [[-17.4, 6.1], [24.5, 6.1], [24.6, 12.4], [22.3, 15.3], [-17.4, 15.3]]
const AISLE_S: XY[] = [[-17.1, -14.3], [18.4, -14.4], [23.9, -11.2], [23.9, -5.3], [-17.1, -5.0]]
const ANNEX = { x0: 9.9, x1: 18.4, y0: -21.6, y1: -14.4 }

function build() {
  const stone = new Part(), dark = new Part(), slate = new Part(), tile = new Part(), win = new Part(), gold = new Part()

  // ---- Aisles: walls, lean-to roofs, windows and buttresses.
  for (const [ring, outerY] of [[AISLE_N, 15.3], [AISLE_S, -14.35]] as [XY[], number][]) {
    prism(stone, ring, 0, AISLE, false)
    const zOf = (y: number) => AISLE + ((AISLE_TOP - AISLE) * (Math.abs(outerY - y))) / Math.abs(outerY - (outerY > 0 ? YN : YS))
    // the roof, a fan over the (convex) ring at z(y)
    const P = ring.map(([x, y]) => [x, y, zOf(y)] as V3)
    for (let i = 1; i < P.length - 1; i++) tf(tile, P[0], P[i], P[i + 1], [0, outerY > 0 ? 1 : -1, 2])
    // close the sloping ends above the wall tops
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      const za = zOf(a[1]), zb = zOf(b[1])
      if (za - AISLE < 0.05 && zb - AISLE < 0.05) continue
      const c: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], o: XY = [ring.reduce((s, q) => s + q[0], 0) / ring.length, ring.reduce((s, q) => s + q[1], 0) / ring.length]
      const n: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
      const s = (c[0] - o[0]) * n[0] + (c[1] - o[1]) * n[1] > 0 ? 1 : -1
      qf(stone, [a[0], a[1], AISLE], [b[0], b[1], AISLE], [b[0], b[1], zb], [a[0], a[1], za], [n[0] * s, n[1] * s, 0])
    }
  }
  // buttresses with sloped tops
  const buttress = (c: XY, out: XY, w: number, d: number, h: number) => {
    const u = unit2(out), v: XY = [-u[1], u[0]]
    obox(stone, [c[0] + u[0] * d / 2, c[1] + u[1] * d / 2], u, d / 2, w / 2, 0, h, false)
    const p = (s: number, t: number, z: number): V3 => [c[0] + u[0] * s + v[0] * t, c[1] + u[1] * s + v[1] * t, z]
    qf(dark, p(d, -w / 2, h), p(d, w / 2, h), p(0, w / 2, h + 1.6), p(0, -w / 2, h + 1.6), [u[0], u[1], 1.5])
    tf(dark, p(d, w / 2, h), p(0, w / 2, h), p(0, w / 2, h + 1.6), [v[0], v[1], 0])
    tf(dark, p(d, -w / 2, h), p(0, -w / 2, h + 1.6), p(0, -w / 2, h), [-v[0], -v[1], 0])
  }
  const NB = [-11.8, -3.6, 3.7, 10.8, 18.0], SB = [-11.3, -3.7, 3.6]
  for (const x of NB) buttress([x, 15.3], [0, 1], 1.7, 2.0, 17.5)
  for (const x of SB) buttress([x, -14.35], [0, -1], 1.7, 2.0, 17.5)
  buttress([23.3, 13.9], [0.78, 0.62], 1.7, 2.0, 17.5)
  buttress([24.0, -12.0], [0.8, -0.6], 1.7, 2.0, 17.5)
  // aisle windows between the buttresses
  const FNo = pf([0, 15.3], [-1, 0], [0, 1]), FSo = pf([0, -14.35], [1, 0], [0, -1])
  for (const x of [-14.6, -7.7, 0.05, 7.25, 14.4, 20.3]) lancet(win, null, FNo, -x - 1.5, -x + 1.5, 4, 17, { k: 0.7 })
  for (const x of [-14.2, -7.5, -0.05]) lancet(win, null, FSo, x - 1.5, x + 1.5, 4, 17, { k: 0.7 })
  for (const x of [6.4, 20.6]) lancet(win, null, FSo, x - 1.2, x + 1.2, 4, 17, { k: 0.7 })
  // the annex on the south: low walls, hipped tile roof
  box(stone, ANNEX.x0, ANNEX.x1, ANNEX.y0, ANNEX.y1, 0, 13, false)
  hipRoof(tile, [[ANNEX.x0, ANNEX.y0], [ANNEX.x1, ANNEX.y0], [ANNEX.x1, ANNEX.y1], [ANNEX.x0, ANNEX.y1]], 13, [[ANNEX.x0 + 3.6, (ANNEX.y0 + ANNEX.y1) / 2], [ANNEX.x1 - 3.6, (ANNEX.y0 + ANNEX.y1) / 2]], 19)
  lancet(win, dark, pf([(ANNEX.x0 + ANNEX.x1) / 2, ANNEX.y0], [1, 0], [0, -1]), -1.3, 1.3, 3.5, 10.5, { k: 0.7, frame: 0.16, depth: 0.22 })

  // ---- Nave: walls to the eaves, clerestory, steep tile roof, ridge turret.
  prism(stone, NAVE, 0, EAVE, false)
  hipRoof(tile, NAVE, EAVE, [[XW, AX], [24.4, AX]], RIDGE)
  ebox(dark, [XW + 0.5, YN + 0.15], [24.4, YN + 0.15], 0.4, EAVE - 0.7, EAVE)
  ebox(dark, [XW + 0.5, YS - 0.15], [23.9, YS - 0.15], 0.4, EAVE - 0.7, EAVE)
  const FN = pf([0, YN], [-1, 0], [0, 1]), FS = pf([0, YS], [1, 0], [0, -1])
  for (const x of [-14.6, -7.7, 0.05, 7.25, 14.4, 20.5]) {
    lancet(win, null, FN, -x - 1.3, -x + 1.3, 27.5, 34.8, { k: 0.7 })
    lancet(win, null, FS, x - 1.3, x + 1.3, 27.5, 34.8, { k: 0.7 })
  }
  // the apse: tall windows on its faces, buttresses at its corners
  const apse = NAVE.slice(2, 10)
  for (let i = 0; i < apse.length - 1; i++) {
    const a = apse[i], b = apse[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = unit2([b[1] - a[1], -(b[0] - a[0])])
    if (L > 2.2) lancet(win, dark, pf(a, unit2([b[0] - a[0], b[1] - a[1]]), n), L / 2 - 0.85, L / 2 + 0.85, 9, 32, { k: 0.7 })
    if (i > 0) {
      const p = apse[i], q = apse[i - 1], nn = unit2([n[0] + unit2([p[1] - q[1], -(p[0] - q[0])])[0], n[1] + unit2([p[1] - q[1], -(p[0] - q[0])])[1]])
      buttress(p, nn, 1.3, 1.8, 28)
    }
  }
  // ridge turret (OSM way/462196624): a small dark lantern and onion
  lathe(slate, 14.2, AX, [[0.75, 46.5], [0.75, 50.4], [0.95, 50.6], [0.95, 50.9], [0.9, 51.3], [1.05, 52.0], [0.6, 52.9], [0.2, 53.4], [0.05, 55], [0, 55]], 8, Math.PI / 8, true)
  lathe(gold, 14.2, AX, [[0, 54.6], [0.22, 54.8], [0.22, 55.1], [0, 55.3]], 6, 0, true)

  // ---- West front between the towers: wall to the ledge, window, portal, gable.
  box(stone, XW - 0.6, XW + 0.5, YS, YN, 0, 45.4, true)
  const FW = pf([XW - 0.6, AX], [0, -1], [-1, 0])
  lancet(win, dark, FW, -2.4, 2.4, 21, 42.6, { k: 0.75, frame: 0.3, depth: 0.45, detail: true, lights: 4, tracery: false })
  // its tracery: four lights with sub-arches, a transom, and a spoked rose in the head
  for (const a of [-1.2, 0, 1.2]) tubePath(dark, FW, [[a, 21], [a, 38.9]], 0.1, 0, 0.35, false, false, false)
  for (const a of [-2.4, -1.2, 0, 1.2]) tubePath(dark, FW, archPts(a, a + 1.2, 37.6, 0.8, 2), 0.08, 0, 0.32, false, false, false)
  tubePath(dark, FW, [[-2.4, 31.5], [2.4, 31.5]], 0.1, 0, 0.32, false, false, false)
  tubePath(dark, FW, circlePts(0, 40.6, 1.35, 10), 0.1, 0, 0.35, true)
  for (let i = 0; i < 6; i++) { const t = (Math.PI * i) / 3; tubePath(dark, FW, [[0, 40.6], [1.3 * Math.cos(t), 40.6 + 1.3 * Math.sin(t)]], 0.07, 0, 0.3, false, false, false) }
  lancet(dark, dark, FW, -1.8, 1.8, 0.35, 8.5, { k: 0.75, frame: 0.35, depth: 0.5 })
  // the ledge with its balustrade, across the front and round both towers
  box(dark, XW - 1.0, XW + 0.5, YS, YN, 45.4, 46.2, true, true)
  railing(dark, [[XW - 0.9, YS], [XW - 0.9, YN]], 46.2, 1.0, 0.25, true, 1.3)
  // the gable: a thick stone triangle, pinnacles on its rakes, the gilt Madonna, the cross
  {
    const g: P2[] = [[-5.55, 46.2], [5.55, 46.2], [0, 56.5]]
    const F0 = { ...FW, o: [XW - 0.1, AX, 0] as V3 }
    const f0 = g.map(([a, z]) => [F0.o[0] + F0.n[0] * 0 + F0.u[0] * a, F0.o[1] + F0.u[1] * a, z] as V3)
    const f1 = g.map(([a, z]) => [F0.o[0] + F0.n[0] * 0.7 + F0.u[0] * a, F0.o[1] + F0.u[1] * a, z] as V3)
    tf(dark, f1[0], f1[1], f1[2], [-1, 0, 0])
    tf(dark, f0[0], f0[1], f0[2], [1, 0, 0])
    for (let i = 0; i < 3; i++) {
      const j = (i + 1) % 3
      const mid: V3 = [(f0[i][0] + f0[j][0]) / 2, (f0[i][1] + f0[j][1]) / 2, (f0[i][2] + f0[j][2]) / 2]
      const c: V3 = [(f0[0][0] + f0[1][0] + f0[2][0]) / 3, (f0[0][1] + f0[1][1] + f0[2][1]) / 3, (f0[0][2] + f0[1][2] + f0[2][2]) / 3]
      qf(dark, f0[i], f0[j], f1[j], f1[i], [mid[0] - c[0], mid[1] - c[1], mid[2] - c[2]])
    }
    const Fg = { ...FW, o: [XW - 0.8, AX, 0] as V3 }
    for (const a of [-4.6, -3.5, -2.4, -1.3, 1.3, 2.4, 3.5, 4.6]) {
      const z = 46.2 + (10.3 * (5.55 - Math.abs(a))) / 5.55
      const c: XY = [XW - 0.55, AX - a]
      pinnacle(dark, c, [1, 0], 0.3, 0.3, 46.2, z + 1.2, z + 3.4, false)
    }
    fanPlane(gold, Fg, circlePts(0, 51.6, 1.0, 10).map(([a, z]) => [a * 0.75 + 0, 51.6 + (z - 51.6) * 1.25] as P2), 0.03)
    for (const k of [0, 1]) lancet(win, dark, Fg, k ? 1.4 : -2.4, k ? 2.4 : -1.4, 47.2, 50.0, { k: 0.6, frame: 0.1, depth: 0.15 })
    bar(dark, [XW - 0.45, AX, 56.2], [XW - 0.45, AX, 59.6], 0.3, 0.3)
    bar(dark, [XW - 0.45, AX - 1.1, 58.4], [XW - 0.45, AX + 1.1, 58.4], 0.25, 0.25)
  }

  // ---- The towers.
  for (const [k, T] of TOWERS.entries()) {
    const c: XY = [(T.x0 + T.x1) / 2, (T.y0 + T.y1) / 2]
    const outer = k === 0 ? 1 : -1
    box(stone, T.x0, T.x1, T.y0, T.y1, 0, 57, false)
    // dark weathered quoins up every corner and string courses round the shaft
    for (const z of [20.8, 33.4]) box(dark, T.x0 - 0.15, T.x1 + 0.15, T.y0 - 0.15, T.y1 + 0.15, z, z + 0.45, true, true)
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const qx = sx < 0 ? T.x0 : T.x1, qy = sy < 0 ? T.y0 : T.y1
      box(dark, sx < 0 ? qx - 0.08 : qx - 0.6, sx < 0 ? qx + 0.6 : qx + 0.08, sy < 0 ? qy - 0.08 : qy - 0.6, sy < 0 ? qy + 0.6 : qy + 0.08, 40, 57, false)
    }
    // stepped corner buttresses on the lower stages
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const cx = sx < 0 ? T.x0 : T.x1, cy = sy < 0 ? T.y0 : T.y1
      if (sy !== outer && sx > 0) continue // the inner east corner meets the aisle
      for (const [u, n] of [[[1, 0], [0, sy]], [[0, 1], [sx, 0]]] as [XY, XY][]) {
        const p0: XY = [cx - u[0] * sx * 0.9 + n[0] * 0.6, cy - u[1] * sy * 0.9 + n[1] * 0.6]
        obox(stone, p0, u, 0.8, 0.6, 0, 24, true)
        obox(stone, [p0[0] - n[0] * 0.25, p0[1] - n[1] * 0.25], u, 0.7, 0.35, 24, 40, true)
      }
    }
    // the ledge round the tower at 46, its balustrade
    box(dark, T.x0 - 0.4, T.x1 + 0.4, T.y0 - 0.4, T.y1 + 0.4, 45.4, 46.2, true, true)
    const rim = (d: number): XY[] => [[T.x0 - d, T.y0 - d], [T.x1 + d, T.y0 - d], [T.x1 + d, T.y1 + d], [T.x0 - d, T.y1 + d], [T.x0 - d, T.y0 - d]]
    railing(dark, rim(0.25), 46.2, 1.0, 0.25, false)
    // windows: tall belfry lancets on all four faces, smaller ones lower down
    const faces: PF[] = [
      pf([c[0], T.y0], [1, 0], [0, -1]), pf([T.x1, c[1]], [0, 1], [1, 0]),
      pf([c[0], T.y1], [-1, 0], [0, 1]), pf([T.x0, c[1]], [0, -1], [-1, 0]),
    ]
    for (const [i, F] of faces.entries()) {
      lancet(win, dark, F, -0.9, 0.9, 48.5, 55.3, { k: 0.6, frame: 0.2, depth: 0.3 })
      const isOuter = (i === 0 && outer < 0) || (i === 2 && outer > 0) || i === 3
      if (isOuter) {
        lancet(win, null, F, -0.7, 0.7, 36, 41.5, { k: 0.6 })
        lancet(win, null, F, -0.6, 0.6, 22, 26.5, { k: 0.6 })
      }
    }
    // corbel table and pierced parapet
    box(dark, T.x0 - 0.55, T.x1 + 0.55, T.y0 - 0.55, T.y1 + 0.55, 57, 57.7, true, true)
    railing(dark, rim(0.4), 57.7, 1.2, 0.3, true, 1.8)
    // corner turrets on corbels: shaft, little gallery, spirelet, needle and gilt ball
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const tx = (sx < 0 ? T.x0 : T.x1) + sx * 0.15, ty = (sy < 0 ? T.y0 : T.y1) + sy * 0.15
      lathe(dark, tx, ty, [[0.15, 55.0], [1.15, 57.6], [1.0, 60.3], [0, 60.3]], 8, Math.PI / 8, true)
      lathe(slate, tx, ty, [[1.25, 60.3], [1.25, 60.7], [1.05, 61.4], [0.08, 68.2], [0, 68.2]], 8, Math.PI / 8, true)
      lathe(gold, tx, ty, [[0, 68.1], [0.25, 68.3], [0.25, 68.6], [0, 68.8]], 6, 0, true)
      bar(gold, [tx, ty, 68.7], [tx, ty, 69.4], 0.08, 0.08)
    }
    // the main spire: octagonal slate, gilt ball and needle
    const R = T.spire / Math.cos(Math.PI / 8)
    // a flared foot over the parapet, then a straight steep needle
    lathe(slate, c[0], c[1], [[R, 57.7], [R, 58.4], [R * 0.78, 60.6], [0.22, 77.8], [0, 77.8]], 8, Math.PI / 8)
    bar(slate, [c[0], c[1], 77.5], [c[0], c[1], 79.3], 0.16, 0.16)
    lathe(gold, c[0], c[1], [[0, 79.2], [0.42, 79.5], [0.42, 79.85], [0, 80.15]], 8, 0, true)
    // the four spire turrets, one on each face: bracket, lantern, cap
    for (let i = 0; i < 4; i++) {
      const t = (Math.PI / 2) * i, d: XY = [Math.cos(t), Math.sin(t)]
      const rz = (z: number) => T.spire * 0.78 + ((0.22 - T.spire * 0.78) * (z - 60.6)) / (77.8 - 60.6)
      const off = rz(64) + 0.35
      const tx = c[0] + d[0] * off, ty = c[1] + d[1] * off
      lathe(slate, tx, ty, [[0.1, 62.2], [0.95, 63.5], [0.95, 66.4], [1.15, 66.6], [0.08, 72.0], [0, 72.0]], 8, Math.PI / 8, true)
      for (let j = 0; j < 3; j++) {
        const a = t + ((j - 1) * Math.PI) / 3, e: XY = [Math.cos(a), Math.sin(a)]
        const r = 0.95 * Math.cos(Math.PI / 8) + 0.01
        lancet(win, null, pf([tx + e[0] * r, ty + e[1] * r], [-e[1], e[0]], e), -0.2, 0.2, 64.0, 65.9, { k: 0.5, seg: 2 })
      }
      lathe(gold, tx, ty, [[0, 71.9], [0.22, 72.1], [0.22, 72.35], [0, 72.55]], 6, 0, true)
      bar(gold, [tx, ty, 72.4], [tx, ty, 73.1], 0.07, 0.07)
    }
  }

  const lit = (base: number) => (_p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : base)
  return [
    { part: stone, material: { ...finish('tyn-sandstone', 0x948a78), floodlight: lit(0.9) } },
    { part: dark, material: { ...finish('tyn-weathered-stone', 0x5d564e), floodlight: lit(0.8) } },
    { part: slate, material: { ...finish('tyn-slate', 0x5a616b), floodlight: lit(0.35) } },
    { part: tile, material: PALETTE.terracotta },
    { part: win, material: PALETTE.window },
    { part: gold, material: { ...finish('tyn-gold', 0xd2b05a), floodlight: lit(0.9) } },
  ]
}

if (import.meta.main) {
  await writeModel('prague-tyn-church.glb', 'Church of Our Lady before Týn', build(), 6500, 245_000, { bearing: 342.3, elevation: 0, height: 80 })
}
