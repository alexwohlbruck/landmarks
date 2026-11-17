/**
 * Metropolitan Cathedral of Mexico City (Catedral Metropolitana de la
 * Asunción de María) with the Sagrario Metropolitano — procedural, CC0-1.0,
 * no textures. bun generators/mexico-city-metropolitan-cathedral.ts
 *
 * Map frame: x east, y north, z up, metres, turned to the cathedral's axis:
 * the long walls in OSM run at 7.8° east of north, so the placement bearing
 * is 7.8. The anchor is the area centroid of the OSM outline way/862852010
 * (lng -99.1331213, lat 19.4344032). The church's own axis lies 6.3 m east
 * of the anchor (the outline takes in a low annex on the north-west), so
 * everything of the cathedral is drawn about x = AX.
 *
 * What it is: the cathedral (1573–1813; Arciniega's plan, Ortiz de Castro's
 * towers and front, Tolsá's dome, clock attic and statues) is grey cantera,
 * a five-aisled basilica stepping down from the nave to two aisles and two
 * rows of chapels, with half-moon clerestory windows and sloping buttresses
 * between them, a transept with portals on both flanks, and the octagonal
 * drum, pale tiled dome and tall lantern over the crossing. The south front
 * on the Zócalo: three portal bays between buttresses, the centre one
 * carrying a segmental pediment and the clock attic with Faith, Hope and
 * Charity; and the two towers, each a plain lower body with small square
 * windows, a belfry stage of arched openings, a second stage of tall
 * rectangular openings, and the bell-shaped (campana) cap with a small
 * ribbed cupola, stone ball and cross. The Sagrario (Lorenzo Rodríguez,
 * 1749–68) on the east: a Greek cross in a square, red tezontle walls that
 * step down from two tall grey Churrigueresque frontispieces (south and
 * east), a tiled dome on an octagonal drum.
 *
 * Covers and replaces the cathedral outline way/862852010 and its duplicate
 * way/862873648 (building=cathedral), the cathedral parts way/1050213473
 * (nave), way/1050213474 (transept), way/462287918 (crossing / dome),
 * way/862366582 and way/862366583 (towers); the Sagrario way/862420735 and
 * its parts way/1050202443, way/1050202444 (cross arms), way/1050204076
 * (dome), way/1050204077 (body) and way/1050204882 (lantern).
 *
 * Evidence
 * - OSM (measured, turned 7.8°): towers 12 × 12 m, fronts at y −68.3,
 *   centres x −18.55 and 31.15 (axis x 6.3); facade bays at y −65.8; side
 *   walls x −22.3 and 34.9; nave part x −3.9…16.3; transept y −10.2…7.7;
 *   crossing square 19.3 × 17.9 m; north end and apse y 50.8…58.4; low
 *   north-west annex x −41.4…−22.3, y 14.3…65.4. Sagrario 48 × 48 m,
 *   x 37.2…85.5, y −68.6…−20.6, cross arms 17 m wide centred (61.25,
 *   −44.5). OSM heights (67, 55, 40, 30) are rough and not used except as
 *   a check.
 * - Published: 59 × 128 m and towers "64 to 67 m" (Wikipedia en/es).
 * - Towers (review round 1): the published height, 64.5 m to the top of
 *   the cross (Wikipedia "64 to 67 m", OSM 67), and 13.6 m square lower
 *   bodies (OSM parts 12 m; the outline's buttress steps and the reviewer's
 *   reading of the photos give 13-14 m). The first pass scaled the towers
 *   from the front photos (height / front width 0.96, so about 60 m); the
 *   reviewer found them too slim and too short beside the dome against
 *   ProtoplasmaKid's and TonyBallioni's photos, so only the towers were
 *   raised and widened. The nave, front and dome keep their photo-scaled
 *   heights. Towers: lower body to 21.2 m (cornice at 15.3), first belfry
 *   stage (13.2 m square) to 36.0, second (11.8 m) to 47.8, balustrade to
 *   48.8, drum to 49.4, bell cap 49.3-55.5 (base r 5.0 narrowing to
 *   r 2.8), cupola to 59.6 (r 3.05), ball to 61.3 (r 1.1), cross to 64.5,
 *   with corner buttress piers on every stage.
 * - Photo-scaled (estimated): Front:
 *   side bays to 19.0, central bay to 23, pediment to 27.7, clock attic to
 *   33.7, statues to 38.4. Section, from the west aerial (photo 4), using
 *   the far tower to get the view's tilt (8°): chapels 14.4 m, aisles 20.3,
 *   nave 26.1 (ridge 27.4), transept portal pediments to 29.7, drum
 *   27.6–34 with attic, dome to 40.6 (r 7), lantern to 48.4, finial to
 *   51. North-west annex 11 m and apse 22 m: invented (no photo). Sagrario (front photos): frontispieces to 27.3 m,
 *   red walls stepping 20.7 → 15, corner bays 14, dome to 33, cross 39.
 * - Terrain: Mapterhorn has no z15 terrain here; the Centro Histórico is on
 *   the flat lake bed (~2,240 m). The cathedral has settled unevenly and
 *   leans; it is modelled level.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 "Catedral Metropolitana de la Ciudad de México 1.jpg", ProtoplasmaKid,
 *     CC BY-SA 4.0 — the south front square on from a drone; tower stages.
 *   2 "Catedral Metropolitana de la Ciudad de México 8.jpg", ProtoplasmaKid,
 *     CC BY-SA 4.0 — high aerial from the south: roofs, aisles, Sagrario.
 *   3 "CDMX Metropolitan Cathedral from above.jpg", TonyBallioni, CC0 —
 *     south-west, elevated: west flank heights.
 *   4 "Catedral Metropolitana desde la Torre Latinoamericana, Ciudad de
 *     México.JPG", Luisalvaz, CC BY-SA 4.0 — the west side: section, dome.
 *   5 "Torres de la Catedral Metropolitana desde la Torre Latinoamericana.JPG",
 *     Luisalvaz, CC BY-SA 4.0 — the bell caps close up.
 *   6 "Catedral - cúpula, Ciudad de México MEX.jpg", Stefano Vigorelli,
 *     CC BY-SA 4.0 — the dome, drum and lantern.
 *   7 "Mexico City, Metropolitan Cathedral (20693413381).jpg", Arian
 *     Zwegers, CC BY 2.0 — the front from the Zócalo.
 *   8 "Metropolitan Cathedral & Sagrario - Mexico 2024.jpg", José Luiz,
 *     CC BY-SA 4.0 — the front from the Zócalo.
 *   9 "East Facade - Sagrario Metropolitano - Mexico 2024 (2).jpg", José
 *     Luiz, CC BY-SA 4.0 — the Sagrario's east front.
 * - Look-only: none used.
 * - Drawn: belfry openings are real openings (reveals and a dark back),
 *   bell caps and domes are lathed; the cathedral's flat roofs are the
 *   orange-brown of the waterproofed terraces in the aerials.
 * - Simplified or left out: statues are plain posts; urns, pinnacles along
 *   the balustrades, the relief panels, the flying-scroll profile of the
 *   buttresses (drawn as plain sloping wedges) and the aisle vault domes.
 *   The north end has no licensed photo: the apse block,
 *   the north wall and the north-west annex are plain masses from OSM at
 *   estimated heights (doubt).
 * - Night: the cathedral's grey stone and the pale caps carry a
 *   `floodlight` attribute, towers and dome brightest. The Sagrario's red
 *   walls have none, to keep the file under 250 KB.
 * - The dome is drawn in the weathered grey of the rest of the stone
 *   (photos 4 and 6), with eight raised ribs.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { lathe } from './dc-nmaahc'
import { cbox, earcut, gable, ccw, grow, ngon, ngonPrism, qf, rect, roundArch, spire, tf, type Side } from './dc-national-cathedral'

type AZ = [number, number]
const AX = 6.3 // the cathedral's axis
const NRM: Record<Side, V3> = { n: [0, 1, 0], s: [0, -1, 0], e: [1, 0, 0], w: [-1, 0, 0] }
const TAN: Record<Side, V3> = { n: [1, 0, 0], s: [1, 0, 0], e: [0, 1, 0], w: [0, 1, 0] }
/** A point on a wall plane: `a` along the wall, `z` up, `d` into the wall. */
const wallPt = (side: Side, at: number, a: number, z: number, d = 0): V3 => {
  switch (side) {
    case 's': return [a, at + d, z]
    case 'n': return [a, at - d, z]
    case 'w': return [at + d, a, z]
    default: return [at - d, a, z]
  }
}
const dir = (side: Side, da: number, dz: number): V3 => { const t = TAN[side]; return [t[0] * da, t[1] * da, dz] }

type Op = { a0: number; a1: number; zb: number; zt: number; arch?: boolean; seg?: number }

/**
 * A wall face with real openings: the outer plane with holes, reveals `d`
 * deep, and a dark back panel in each opening. Openings sorted along a.
 */
function pierced(p: Part, dark: Part, side: Side, at: number, a0: number, a1: number, z0: number, z1: number, ops: Op[], d = 0.7, seg = 4) {
  const n = NRM[side], T = TAN[side], up: V3 = [0, 0, 1]
  const P = (a: number, z: number, dd = 0) => wallPt(side, at, a, z, dd)
  const Q = (pp: Part, b0: number, b1: number, zb: number, zt: number, dd = 0) => {
    if (b1 - b0 < 1e-6 || zt - zb < 1e-6) return
    qf(pp, P(b0, zb, dd), P(b1, zb, dd), P(b1, zt, dd), P(b0, zt, dd), n)
  }
  let cur = a0
  for (const o of [...ops].sort((u, v) => u.a0 - v.a0)) {
    Q(p, cur, o.a0, z0, z1)
    cur = o.a1
    const r = (o.a1 - o.a0) / 2, am = (o.a0 + o.a1) / 2
    const hs = o.arch ? o.zt - r : o.zt
    Q(p, o.a0, o.a1, z0, o.zb)
    Q(p, o.a0, o.a1, o.zt, z1)
    qf(p, P(o.a0, o.zb), P(o.a0, o.zb, d), P(o.a0, hs, d), P(o.a0, hs), T)
    qf(p, P(o.a1, o.zb), P(o.a1, o.zb, d), P(o.a1, hs, d), P(o.a1, hs), [-T[0], -T[1], -T[2]])
    qf(p, P(o.a0, o.zb), P(o.a1, o.zb), P(o.a1, o.zb, d), P(o.a0, o.zb, d), up)
    Q(dark, o.a0, o.a1, o.zb, hs, d)
    if (!o.arch) {
      qf(p, P(o.a0, hs), P(o.a1, hs), P(o.a1, hs, d), P(o.a0, hs, d), [0, 0, -1])
      continue
    }
    const sg = o.seg ?? seg
    for (let k = 0; k < sg; k++) {
      const t0 = (Math.PI * k) / sg, t1 = (Math.PI * (k + 1)) / sg
      const A: AZ = [am + r * Math.cos(t0), hs + r * Math.sin(t0)], B: AZ = [am + r * Math.cos(t1), hs + r * Math.sin(t1)]
      const corner: AZ = k < sg / 2 ? [o.a1, o.zt] : [o.a0, o.zt]
      tf(p, P(...corner), P(...A), P(...B), n)
      const tm = (t0 + t1) / 2
      qf(p, P(...A), P(...B), P(B[0], B[1], d), P(A[0], A[1], d), dir(side, -Math.cos(tm), -Math.sin(tm)))
      tf(dark, P(am, hs, d), P(A[0], A[1], d), P(B[0], B[1], d), n)
    }
  }
  Q(p, cur, a1, z0, z1)
}

/** A flat window panel on a wall face. */
function panel(p: Part, side: Side, at: number, a0: number, a1: number, z0: number, z1: number, d = 0.06) {
  qf(p, wallPt(side, at, a0, z0, -d), wallPt(side, at, a1, z0, -d), wallPt(side, at, a1, z1, -d), wallPt(side, at, a0, z1, -d), NRM[side])
}

/** A flat polygon (in a, z) extruded `t` into the wall: a screen, pediment or gable. */
function screen(p: Part, side: Side, at: number, poly: AZ[], t: number, back = true) {
  const ring = ccw(poly) as AZ[]
  const n = NRM[side], nb: V3 = [-n[0], -n[1], -n[2]]
  for (const [i, j, k] of earcut(ring)) {
    tf(p, wallPt(side, at, ...ring[i]), wallPt(side, at, ...ring[j]), wallPt(side, at, ...ring[k]), n)
    if (back) tf(p, wallPt(side, at, ...ring[i], t), wallPt(side, at, ...ring[j], t), wallPt(side, at, ...ring[k], t), nb)
  }
  for (let i = 0; i < ring.length; i++) {
    const A = ring[i], B = ring[(i + 1) % ring.length]
    const da = B[0] - A[0], dz = B[1] - A[1]
    if (Math.hypot(da, dz) < 1e-6) continue
    qf(p, wallPt(side, at, ...A), wallPt(side, at, ...B), wallPt(side, at, ...B, t), wallPt(side, at, ...A, t), dir(side, dz, -da))
  }
}
const mirror = (half: AZ[], c: number): AZ[] => [...half.map(([a, z]) => [c + a, z] as AZ), ...[...half].reverse().map(([a, z]) => [c - a, z] as AZ)]

/** A wedge buttress: a sloping block from (u0, z0) high against a wall down to (u1, z1), w wide; u runs outward along x. */
function wedge(p: Part, y: number, w: number, x0: number, x1: number, zTop: number, zFoot: number, zBase: number) {
  const s = Math.sign(x1 - x0), ya = y - w / 2, yb = y + w / 2
  const pts: AZ[] = [[x0, zBase], [x1, zBase], [x1, zFoot], [x0, zTop]]
  const P = (q: AZ, yy: number): V3 => [q[0], yy, q[1]]
  tf(p, P(pts[0], ya), P(pts[1], ya), P(pts[2], ya), [0, -1, 0]); tf(p, P(pts[0], ya), P(pts[2], ya), P(pts[3], ya), [0, -1, 0])
  tf(p, P(pts[0], yb), P(pts[1], yb), P(pts[2], yb), [0, 1, 0]); tf(p, P(pts[0], yb), P(pts[2], yb), P(pts[3], yb), [0, 1, 0])
  qf(p, P(pts[2], ya), P(pts[3], ya), P(pts[3], yb), P(pts[2], yb), [s * (zTop - zFoot), 0, Math.abs(x1 - x0)])
  qf(p, P(pts[1], ya), P(pts[2], ya), P(pts[2], yb), P(pts[1], yb), [s, 0, 0])
}

function build() {
  const cantera = new Part(), pale = new Part(), red = new Part(), roof = new Part(), win = new Part(), door = new Part()

  // ===================================================================
  // The cathedral body: chapels, aisles, nave, transept.
  const FB = -65.8, NORTH = 50.8
  const NAVE = 10.1, AISLE = 19.5, CHAP = 28.6
  const Z_CH = 14.4, Z_AI = 20.3, Z_NV = 26.1, Z_RIDGE = 27.4
  const TY0 = -10.2, TY1 = 7.7, CY = (TY0 + TY1) / 2
  const xs = (dx: number) => AX + dx
  for (const s of [-1, 1]) {
    const ch = rect(Math.min(xs(s * AISLE), xs(s * CHAP)), Math.max(xs(s * AISLE), xs(s * CHAP)), -55.9, NORTH)
    cbox(cantera, ch, 0, Z_CH, { b: 0.4, top: cantera })
    const ai = rect(Math.min(xs(s * NAVE), xs(s * AISLE)), Math.max(xs(s * NAVE), xs(s * AISLE)), FB, NORTH)
    cbox(cantera, ai, 0, Z_AI, { b: 0.4, top: cantera })
  }
  const nave = rect(xs(-NAVE), xs(NAVE), FB, NORTH)
  cbox(cantera, nave, 0, Z_NV, { b: 0.4, top: false })
  gable(roof, cantera, grow(nave, -0.3, 0), Z_NV - 0.1, Z_RIDGE, true, [true, true])
  const trans = rect(xs(-CHAP), xs(CHAP), TY0, TY1)
  cbox(cantera, trans, 0, Z_NV, { b: 0.4, top: false })
  gable(roof, cantera, grow(trans, 0, -0.3), Z_NV - 0.1, Z_RIDGE, false, [true, true])

  // Bays: four south of the transept, four north of it.
  const southBays = [0, 1, 2, 3].map((k) => -55.9 + (k + 0.5) * ((TY0 + 55.9) / 4))
  const northBays = [0, 1, 2, 3].map((k) => TY1 + (k + 0.5) * ((NORTH - TY1) / 4))
  const bays = [...southBays, ...northBays]
  const bounds = [-55.9, ...southBays.slice(1).map((c, i) => (c + southBays[i]) / 2), TY0, TY1, ...northBays.slice(1).map((c, i) => (c + northBays[i]) / 2), NORTH]
  for (const s of [-1, 1]) {
    const side: Side = s < 0 ? 'w' : 'e'
    for (const c of bays) {
      // Half-moon clerestory windows in the nave walls, broad rectangular
      // ones in the aisle walls, and arched chapel windows.
      const hw = 3.5
      roundArch(win, side, xs(s * NAVE), c - hw, c + hw, Z_AI + 0.4, Z_AI + 0.4 + hw, 0.06, 6)
      panel(win, side, xs(s * AISLE), c - 1.6, c + 1.6, Z_CH + 1.4, Z_AI - 1.4)
      panel(win, side, xs(s * CHAP), c - 1.2, c + 1.2, 7.0, 11.6)
    }
    // Sloping buttresses between the bays, at both steps of the section.
    for (const y of bounds) {
      if (y > TY0 - 0.1 && y < TY1 + 0.1) continue
      wedge(cantera, y, 1.3, xs(s * NAVE), xs(s * (NAVE + 4.4)), Z_NV - 0.6, Z_AI, Z_AI)
    }
  }
  // Cornice bands round the three levels.
  cbox(cantera, rect(xs(-CHAP - 0.4), xs(CHAP + 0.4), -55.5, NORTH + 0.4), Z_CH - 0.8, Z_CH, { top: false, bottom: true })

  // ---- Transept portals on both flanks: a frontispiece with a segmental
  // pediment, a round window and an arched door.
  for (const s of [-1, 1]) {
    const side: Side = s < 0 ? 'w' : 'e'
    const at = xs(s * (CHAP + 1.2))
    const poly: AZ[] = mirror([[7.2, 0], [7.2, 26.0], [6.2, 26.0], [5.0, 28.0], [2.7, 29.2], [0, 29.7]], CY)
    screen(cantera, side, at, poly, 1.2)
    roundArch(door, side, at, CY - 1.8, CY + 1.8, 0, 8.0, 0.06, 6)
    roundArch(win, side, at, CY - 1.7, CY + 1.7, 16.2, 19.6, 0.06, 6)
    // The window is round: close the lower half with a stone sill panel.
  }

  // ---- The north end: the apse of the Altar de los Reyes, plain, and the
  // low north-west annex (no licensed photos of the north side).
  {
    const apse: AZ[] = [[-9.2, NORTH - 0.5], [9.2, NORTH - 0.5], [9.2, 52.4], [5.2, 57.4], [3.2, 58.4], [-3.2, 58.4], [-5.2, 57.4], [-9.2, 52.4]]
    const ring = apse.map(([a, y]) => [xs(a), y] as AZ)
    for (let i = 0; i < ring.length; i++) {
      const A = ring[i], B = ring[(i + 1) % ring.length]
      qf(cantera, [A[0], A[1], 0], [B[0], B[1], 0], [B[0], B[1], 22], [A[0], A[1], 22], [B[1] - A[1], -(B[0] - A[0]), 0])
    }
    for (const [i, j, k] of earcut(ring)) tf(roof, [...ring[i], 22] as V3, [...ring[j], 22] as V3, [...ring[k], 22] as V3, [0, 0, 1])
    const annex: AZ[] = [[-41.4, 14.3], [xs(-CHAP), 14.3], [xs(-CHAP), NORTH], [-11.5, NORTH], [-11.5, 65.4], [-41.4, 65.4]]
    for (let i = 0; i < annex.length; i++) {
      const A = annex[i], B = annex[(i + 1) % annex.length]
      qf(cantera, [A[0], A[1], 0], [B[0], B[1], 0], [B[0], B[1], 11], [A[0], A[1], 11], [B[1] - A[1], -(B[0] - A[0]), 0])
    }
    for (const [i, j, k] of earcut(annex)) tf(cantera, [...annex[i], 11] as V3, [...annex[j], 11] as V3, [...annex[k], 11] as V3, [0, 0, 1])
  }

  // ===================================================================
  // The dome over the crossing: square base, octagonal drum with tall
  // windows, attic, grey ribbed dome, lantern.
  {
    const cx = AX, cy = CY
    cbox(cantera, rect(cx - 9.6, cx + 9.6, TY0, TY1), Z_NV, 27.6, { b: 0.3, top: roof })
    const ap = 8.3, R = ap / Math.cos(Math.PI / 8), rot = 0
    // Drum faces: one big window each.
    const drumRing = (r: number, z: number) => ngon(cx, cy, r, 8, z, rot)
    cantera.loft([drumRing(R, 27.6), drumRing(R, 32.4)])
    for (let k = 0; k < 8; k++) {
      const a = rot + (2 * Math.PI * (k + 0.5)) / 8, c = Math.cos(a), sn = Math.sin(a), d = ap + 0.06
      const P = (u: number, z: number): V3 => [cx + c * d - sn * u, cy + sn * d + c * u, z]
      qf(win, P(-1.3, 28.6), P(1.3, 28.6), P(1.3, 31.6), P(-1.3, 31.6), [c, sn, 0])
    }
    // Paired pilasters at the drum's corners read as buttress piers.
    for (let k = 0; k < 8; k++) {
      const a = rot + (2 * Math.PI * k) / 8
      const px = cx + Math.cos(a) * (R - 0.3), py = cy + Math.sin(a) * (R - 0.3)
      ngonPrism(cantera, px, py, 0.7, 4, 27.6, 32.5, { top: false })
    }
    // Attic: a cornice ring and a short wall with a small pediment a face.
    cantera.loft([drumRing(R + 0.4, 32.4), drumRing(R + 0.4, 33.0), drumRing(R - 0.3, 33.0), drumRing(R - 0.3, 34.0), drumRing(7.4, 34.0)])
    for (let k = 0; k < 8; k += 2) {
      const a = rot + (2 * Math.PI * (k + 0.5)) / 8, c = Math.cos(a), sn = Math.sin(a), d = (R - 0.3) * Math.cos(Math.PI / 8)
      const P = (u: number, z: number, o = 0): V3 => [cx + c * (d + o) - sn * u, cy + sn * (d + o) + c * u, z]
      tf(cantera, P(-2.6, 34.0, 0.2), P(2.6, 34.0, 0.2), P(0, 35.2, 0.2), [c, sn, 0.3])
      tf(cantera, P(-2.6, 34.0, -0.6), P(0, 35.2, -0.6), P(2.6, 34.0, -0.6), [-c, -sn, 0.3])
      qf(cantera, P(-2.6, 34.0, 0.2), P(0, 35.2, 0.2), P(0, 35.2, -0.6), P(-2.6, 34.0, -0.6), [-sn * 1.2 + c * 0, c * -1.2, 2.6])
      qf(cantera, P(2.6, 34.0, 0.2), P(0, 35.2, 0.2), P(0, 35.2, -0.6), P(2.6, 34.0, -0.6), [sn * 1.2, -c * 1.2 * -1, 2.6])
    }
    // The dome: r 7.0, springing at 34, rising to 40.6.
    const DR = 7.0, Z0 = 33.9, RISE = 6.7, LR = 1.9
    const prof: [number, number][] = []
    for (const deg of [0, 18, 36, 52, 66]) prof.push([DR * Math.cos((deg * Math.PI) / 180), Z0 + RISE * Math.sin((deg * Math.PI) / 180)])
    const tL = Math.acos(LR / DR)
    prof.push([LR, Z0 + RISE * Math.sin(tL)])
    // Weathered grey like the rest of the stone, with eight bold ribs.
    lathe(cantera, cx, cy, prof, 16, false)
    for (let k = 0; k < 8; k++) {
      const ang = (2 * Math.PI * k) / 8, c = Math.cos(ang), sn = Math.sin(ang)
      const R3 = (r: number, z: number, u: number): V3 => [cx + c * r - sn * u, cy + sn * r + c * u, z]
      const rp = [prof[0], prof[2], prof[4], prof[prof.length - 1]]
      for (let i = 0; i < rp.length - 1; i++) {
        const [r0, z0] = rp[i], [r1, z1] = rp[i + 1]
        // the profile's outward normal in (r, z)
        const nr = z1 - z0, nz = -(r1 - r0), nl = Math.hypot(nr, nz), h = 0.5, w = 0.55
        const o0: [number, number] = [r0 + (nr / nl) * h, z0 + (nz / nl) * h], o1: [number, number] = [r1 + (nr / nl) * h, z1 + (nz / nl) * h]
        const out: V3 = [c * nr / nl, sn * nr / nl, nz / nl]
        qf(cantera, R3(r0, z0, -w), R3(r1, z1, -w), R3(o1[0], o1[1], 0), R3(o0[0], o0[1], 0), [out[0] + sn * 0.9, out[1] - c * 0.9, out[2]])
        qf(cantera, R3(r0, z0, w), R3(r1, z1, w), R3(o1[0], o1[1], 0), R3(o0[0], o0[1], 0), [out[0] - sn * 0.9, out[1] + c * 0.9, out[2]])
      }
    }
    const lz = prof[prof.length - 1][1]
    // Lantern: a balustraded base, a tall drum with windows, a small tiled
    // cupola and a finial.
    lathe(cantera, cx, cy, [[2.6, lz - 0.2], [2.6, lz + 0.9], [1.75, lz + 0.9]], 12, false)
    ngonPrism(cantera, cx, cy, 1.75, 12, lz + 0.9, lz + 7.0, { top: false })
    for (let k = 0; k < 12; k += 2) {
      const a = (2 * Math.PI * (k + 0.5)) / 12 + Math.PI / 12, c = Math.cos(a), sn = Math.sin(a), d = 1.75 * Math.cos(Math.PI / 12) + 0.05
      const P = (u: number, z: number): V3 => [cx + c * d - sn * u, cy + sn * d + c * u, z]
      qf(win, P(-0.32, lz + 2.0), P(0.32, lz + 2.0), P(0.32, lz + 5.6), P(-0.32, lz + 5.6), [c, sn, 0])
    }
    lathe(pale, cx, cy, [[2.1, lz + 7.0], [2.1, lz + 7.4], [1.8, lz + 7.4], [1.55, lz + 8.3], [0.9, lz + 9.0], [0.35, lz + 9.2], [0.3, lz + 10.0], [0.55, lz + 10.3], [0, lz + 11.0]], 8, false)
  }

  // ===================================================================
  // The south front.
  {
    const towerC = [AX - 24.85, AX + 24.85]
    // Side bays (to the main cornice at 19.0), with the nave/aisle front
    // walls behind them already drawn by the body blocks.
    for (const s of [-1, 1]) {
      const a0 = xs(s * 6.9), a1 = xs(s * 16.3)
      const r = rect(Math.min(a0, a1), Math.max(a0, a1), FB - 0.6, FB + 0.5)
      cbox(cantera, r, 0, 19.0, { top: cantera })
      cbox(cantera, grow(r, 0.3, 0.4), 18.2, 19.4, { b: 0.3, bottom: true })
      const c = (a0 + a1) / 2
      roundArch(door, 's', FB - 0.6, c - 1.65, c + 1.65, 0.6, 7.8, 0.06, 6)
      qf(pale, [c - 1.3, FB - 0.66, 10.8], [c + 1.3, FB - 0.66, 10.8], [c + 1.3, FB - 0.66, 14.2], [c - 1.3, FB - 0.66, 14.2], [0, -1, 0])
      // A small pedestal and finials over the bay.
      // Buttresses flanking the central bay, rising to 23 m.
      const b0 = xs(s * 6.9), b1 = xs(s * 9.3)
      cbox(cantera, rect(Math.min(b0, b1), Math.max(b0, b1), -68.0, FB), 0, 23.0, { b: 0.3 })
      // Pilasters at the tower side of the bay.
      const p0 = xs(s * 16.3), p1 = xs(s * 18.65)
      cbox(cantera, rect(Math.min(p0, p1), Math.max(p0, p1), -67.4, FB), 0, 19.4)
    }
    // Central bay: three storeys under a cornice at 23, a segmental
    // pediment, and the clock attic with Faith, Hope and Charity.
    {
      const r = rect(xs(-6.9), xs(6.9), FB - 1.0, FB + 0.5)
      cbox(cantera, r, 0, 23.0, { top: cantera })
      cbox(cantera, grow(r, 0.3, 0.4), 22.2, 23.4, { b: 0.3, bottom: true })
      cbox(cantera, grow(r, 0.2, 0.3), 8.9, 9.5, { bottom: true, top: cantera })
      cbox(cantera, grow(r, 0.2, 0.3), 16.3, 16.9, { bottom: true, top: cantera })
      roundArch(door, 's', FB - 1.0, AX - 1.85, AX + 1.85, 0.6, 8.6, 0.06, 6)
      qf(pale, [AX - 1.6, FB - 1.06, 10.6], [AX + 1.6, FB - 1.06, 10.6], [AX + 1.6, FB - 1.06, 15.0], [AX - 1.6, FB - 1.06, 15.0], [0, -1, 0])
      for (const dx of [-4.4, 4.4]) roundArch(win, 's', FB - 1.0, xs(dx) - 0.7, xs(dx) + 0.7, 11.0, 14.6, 0.06, 4)
      const ped: AZ[] = []
      for (let k = 0; k <= 8; k++) { const t = Math.PI * (k / 8); ped.push([AX - 7.2 * Math.cos(t), 23.4 + 4.3 * Math.sin(t)]) }
      screen(cantera, 's', FB - 0.9, ped, 1.4)
      // The clock attic.
      const ct = rect(xs(-3.3), xs(3.3), FB - 0.2, FB + 5.2)
      cbox(cantera, ct, 23.0, 33.7, { top: false })
      cbox(cantera, grow(ct, 0.4), 33.2, 34.4, { b: 0.3, bottom: true, top: cantera })
      for (let k = 0; k < 10; k++) {
        const t0 = (2 * Math.PI * k) / 10, t1 = (2 * Math.PI * (k + 1)) / 10
        tf(pale, [AX, FB - 0.3, 29.9], [AX + 1.3 * Math.cos(t0), FB - 0.3, 29.9 + 1.3 * Math.sin(t0)], [AX + 1.3 * Math.cos(t1), FB - 0.3, 29.9 + 1.3 * Math.sin(t1)], [0, -1, 0])
      }
      cbox(cantera, rect(xs(-2.3), xs(2.3), FB + 0.4, FB + 3.8), 34.4, 35.4)
      // Statues: plain posts, the central (Faith) tallest.
      ngonPrism(pale, AX, FB + 2.0, 0.6, 6, 35.4, 37.6, { top: false, r1: 0.45 })
      lathe(pale, AX, FB + 2.0, [[0.45, 37.6], [0.42, 38.0], [0, 38.5]], 6, false)
      for (const dx of [-1.75, 1.75]) {
        ngonPrism(pale, xs(dx), FB + 2.0, 0.5, 6, 35.4, 37.0, { top: false, r1: 0.38 })
        lathe(pale, xs(dx), FB + 2.0, [[0.38, 37.0], [0, 37.6]], 6, false)
      }
      // The front wall of the nave rising behind the side bays, with a
      // balustrade line to 26 m.
    }

    // ---- The towers: 13.6 m square lower bodies (as wide as a front bay),
    // stages stepping in only slightly, corner buttress piers on each
    // stage, the published height (64 m to the top of the cross).
    for (const tc of towerC) {
      const H = 6.8, cy = -68.3 + H
      const body = rect(tc - H, tc + H, cy - H, cy + H)
      cbox(cantera, body, 0, 15.3, { top: false })
      cbox(cantera, grow(body, 0.3), 14.7, 15.6, { b: 0.3, bottom: true, top: false })
      cbox(cantera, grow(body, -0.1), 15.6, 20.6, { top: false })
      cbox(cantera, grow(body, 0.45), 20.3, 21.2, { b: 0.3, bottom: true, top: cantera })
      // Corner buttress piers on the lower body.
      for (const [x, y] of [[body.x0, body.y0], [body.x1, body.y0], [body.x1, body.y1], [body.x0, body.y1]]) {
        cbox(cantera, rect(x - 0.7, x + 0.7, y - 0.7, y + 0.7), 0, 20.3, { top: false })
      }
      // Small square windows stacked on the front, and a door.
      for (const z of [6.4, 9.4, 12.4]) {
        qf(win, [tc - 0.55, body.y0 - 0.06, z], [tc + 0.55, body.y0 - 0.06, z], [tc + 0.55, body.y0 - 0.06, z + 1.1], [tc - 0.55, body.y0 - 0.06, z + 1.1], [0, -1, 0])
      }
      qf(door, [tc - 0.9, body.y0 - 0.06, 0.6], [tc + 0.9, body.y0 - 0.06, 0.6], [tc + 0.9, body.y0 - 0.06, 3.6], [tc - 0.9, body.y0 - 0.06, 3.6], [0, -1, 0])

      // First belfry stage: a big arched opening between two narrower ones
      // on every face.
      const S1 = 6.4, z1a = 21.2, z1b = 36.0
      const st1 = rect(tc - S1, tc + S1, cy - S1, cy + S1)
      const ops1 = (c: number): Op[] => [
        { a0: c - 1.6, a1: c + 1.6, zb: 22.8, zt: 31.6, arch: true },
        { a0: c - 4.5, a1: c - 2.9, zb: 22.8, zt: 30.2, arch: true, seg: 3 },
        { a0: c + 2.9, a1: c + 4.5, zb: 22.8, zt: 30.2, arch: true, seg: 3 },
      ]
      pierced(cantera, win, 's', st1.y0, st1.x0, st1.x1, z1a, z1b, ops1(tc), 0.8, 4)
      pierced(cantera, win, 'n', st1.y1, st1.x0, st1.x1, z1a, z1b, ops1(tc), 0.8, 4)
      pierced(cantera, win, 'w', st1.x0, st1.y0, st1.y1, z1a, z1b, ops1(cy), 0.8, 4)
      pierced(cantera, win, 'e', st1.x1, st1.y0, st1.y1, z1a, z1b, ops1(cy), 0.8, 4)
      // Corner buttress piers and the cornice with its balustrade ledge.
      for (const [x, y] of [[st1.x0, st1.y0], [st1.x1, st1.y0], [st1.x1, st1.y1], [st1.x0, st1.y1]]) {
        cbox(cantera, rect(x - 0.7, x + 0.7, y - 0.7, y + 0.7), z1a, z1b - 0.9, { top: false })
      }
      cbox(cantera, grow(st1, 0.7), z1b - 1.0, z1b, { b: 0.3, bottom: true, top: cantera })
      // Balustrade round the ledge (a solid low parapet).
      const bal = (r: ReturnType<typeof rect>, z: number) => {
        cbox(cantera, r, z, z + 1.0, { top: cantera })
      }
      bal(grow(st1, 0.6), z1b)
      // Second stage: three tall rectangular openings a face between piers.
      const S2 = 5.9, z2a = z1b, z2b = 47.8
      const st2 = rect(tc - S2, tc + S2, cy - S2, cy + S2)
      const ops2 = (c: number): Op[] => [
        { a0: c - 1.5, a1: c + 1.5, zb: 37.5, zt: 45.8, arch: true, seg: 3 },
        { a0: c - 4.2, a1: c - 2.4, zb: 37.5, zt: 45.2 },
        { a0: c + 2.4, a1: c + 4.2, zb: 37.5, zt: 45.2 },
      ]
      pierced(cantera, win, 's', st2.y0, st2.x0, st2.x1, z2a, z2b, ops2(tc), 0.7, 4)
      pierced(cantera, win, 'n', st2.y1, st2.x0, st2.x1, z2a, z2b, ops2(tc), 0.7, 4)
      pierced(cantera, win, 'w', st2.x0, st2.y0, st2.y1, z2a, z2b, ops2(cy), 0.7, 4)
      pierced(cantera, win, 'e', st2.x1, st2.y0, st2.y1, z2a, z2b, ops2(cy), 0.7, 4)
      for (const [x, y] of [[st2.x0, st2.y0], [st2.x1, st2.y0], [st2.x1, st2.y1], [st2.x0, st2.y1]]) {
        cbox(cantera, rect(x - 0.65, x + 0.65, y - 0.65, y + 0.65), z2a, z2b - 0.8, { top: false })
      }
      cbox(cantera, grow(st2, 0.6), z2b - 0.9, z2b, { b: 0.3, bottom: true, top: cantera })
      bal(grow(st2, 0.5), z2b)
      // Statues at the corners of the top balustrade.
      for (const [x, y] of [[st2.x0 + 0.1, st2.y0 + 0.1], [st2.x1 - 0.1, st2.y0 + 0.1], [st2.x1 - 0.1, st2.y1 - 0.1], [st2.x0 + 0.1, st2.y1 - 0.1]]) {
        ngonPrism(pale, x, y, 0.65, 4, z2b + 1.0, z2b + 3.4, { top: false, r1: 0.45 })
        spire(pale, ngon(x, y, 0.45, 4, z2b + 3.4), [x, y, z2b + 4.0])
      }
      // The cap: a short drum, the big bell-shaped campana nearly as wide as
      // the stage below, a cornice, the cupola, a bold ball and cross.
      ngonPrism(cantera, tc, cy, 4.6, 12, z2b + 0.9, 49.4, { top: false })
      lathe(pale, tc, cy, [
        [5.0, 49.3], [4.8, 50.4], [4.3, 51.8], [3.6, 53.3], [3.0, 54.6], [2.8, 55.4], [3.4, 55.5], [3.4, 56.1], [3.0, 56.1],
        [3.05, 57.0], [2.7, 58.2], [1.6, 59.2], [0.5, 59.6],
      ], 12, false)
      lathe(pale, tc, cy, [[0.5, 59.5], [1.0, 59.9], [1.1, 60.5], [0.85, 61.1], [0, 61.3]], 8, false)
      // The cross: thick enough for a phone.
      cbox(pale, rect(tc - 0.3, tc + 0.3, cy - 0.3, cy + 0.3), 61.2, 64.5, { top: true })
      cbox(pale, rect(tc - 1.3, tc + 1.3, cy - 0.28, cy + 0.28), 62.6, 63.2, { top: true, bottom: true })
    }
  }

  // ===================================================================
  // The Sagrario Metropolitano.
  {
    const SX0 = 37.2, SX1 = 85.5, SY0 = -68.6, SY1 = -20.6
    const SCX = 61.25, SCY = -44.5, ARM = 8.5
    // Corner blocks of the square, low and flat.
    cbox(red, rect(SX0, SX1, SY0 + 0.6, SY1), 0, 12.5, { b: 0.3, top: roof })
    // The two arms of the Greek cross, red walls under gabled vaults.
    const armNS = rect(SCX - ARM, SCX + ARM, SY0 + 0.6, SY1)
    const armEW = rect(SX0, SX1 - 0.6, SCY - ARM, SCY + ARM)
    cbox(red, armNS, 12.5, 20.2, { top: false })
    gable(roof, red, armNS, 20.0, 23.4, true, [true, true])
    cbox(red, armEW, 12.5, 20.2, { top: false })
    gable(roof, red, armEW, 20.0, 23.4, false, [true, true])
    // Grey stone corner pilasters on the square.
    for (const [x, y] of [[SX0 + 0.6, SY0 + 0.6], [SX1 - 0.6, SY0 + 0.6], [SX1 - 0.6, SY1 - 0.6]] as AZ[]) {
      cbox(cantera, rect(x - 0.9, x + 0.9, y - 0.9, y + 0.9), 0, 14.2)
      spire(cantera, ngon(x, y, 0.7, 4, 14.2), [x, y, 16.2])
    }
    for (const [x, y] of [[SCX - ARM, SY1], [SCX + ARM, SY1], [SX0, SCY + ARM], [SX0, SCY - ARM]] as AZ[]) {
      cbox(cantera, rect(x - 0.7, x + 0.7, y - 0.7, y + 0.7), 0, 20.6)
    }
    // The crossing: square base, octagonal drum, tiled dome, lantern.
    cbox(red, rect(SCX - ARM, SCX + ARM, SCY - ARM, SCY + ARM), 20.2, 23.6, { top: roof })
    const ap = 6.9, R = ap / Math.cos(Math.PI / 8)
    cantera.loft([ngon(SCX, SCY, R, 8, 23.6), ngon(SCX, SCY, R, 8, 28.0), ngon(SCX, SCY, R + 0.35, 8, 28.0), ngon(SCX, SCY, R + 0.35, 8, 28.6), ngon(SCX, SCY, R - 0.6, 8, 28.6)])
    for (let k = 0; k < 8; k++) {
      const a = Math.PI / 8 + (2 * Math.PI * (k + 0.5)) / 8, c = Math.cos(a), sn = Math.sin(a), d = ap + 0.06
      const P = (u: number, z: number): V3 => [SCX + c * d - sn * u, SCY + sn * d + c * u, z]
      qf(win, P(-0.9, 24.6), P(0.9, 24.6), P(0.9, 27.0), P(-0.9, 27.0), [c, sn, 0])
    }
    const DR = 6.6, Z0 = 28.5, RISE = 4.8, LR = 1.6
    const prof: [number, number][] = []
    for (const deg of [0, 20, 40, 58]) prof.push([DR * Math.cos((deg * Math.PI) / 180), Z0 + RISE * Math.sin((deg * Math.PI) / 180)])
    prof.push([LR, Z0 + RISE * Math.sin(Math.acos(LR / DR))])
    lathe(roof, SCX, SCY, prof, 12, false)
    const lz = prof[prof.length - 1][1]
    ngonPrism(cantera, SCX, SCY, 1.6, 8, lz - 0.2, lz + 3.4, { top: false })
    lathe(roof, SCX, SCY, [[1.9, lz + 3.4], [1.5, lz + 4.0], [0.7, lz + 4.6], [0.25, lz + 4.8]], 8, false)
    cbox(cantera, rect(SCX - 0.14, SCX + 0.14, SCY - 0.14, SCY + 0.14), lz + 4.7, lz + 7.0, { top: true })
    cbox(cantera, rect(SCX - 0.7, SCX + 0.7, SCY - 0.13, SCY + 0.13), lz + 5.9, lz + 6.25, { top: true, bottom: true })

    // The two fronts: red tezontle screens stepping down from the grey
    // Churrigueresque frontispiece, with grey pilasters and finials.
    const steps: AZ[] = [[24.1, 0], [24.1, 14.0], [22.4, 14.0], [22.4, 15.0], [20.4, 15.0], [19.1, 16.6], [17.8, 15.0], [13.4, 15.0], [13.4, 16.7], [11.4, 16.7], [11.4, 18.1], [9.4, 18.1], [9.4, 19.4], [7.4, 19.4], [7.4, 20.7], [6.4, 20.7]]
    const crest: AZ[] = [[6.3, 0], [6.3, 24.4], [5.2, 24.4], [4.6, 25.4], [3.0, 25.6], [2.2, 26.6], [1.0, 26.7], [0, 27.4]]
    const fronts: Array<[Side, number, number]> = [['s', SY0, SCX], ['e', SX1, SCY]]
    for (const [side, at, c] of fronts) {
      // Left and right halves as separate screens (the frontispiece fills the middle).
      const right = [[c + 6.4, 0] as AZ, ...steps.map(([a, z]) => [c + a, z] as AZ).reverse()].reverse()
      const left = right.map(([a, z]) => [2 * c - a, z] as AZ)
      screen(red, side, at, right, 1.2)
      screen(red, side, at, left, 1.2)
      screen(cantera, side, wallPt(side, at, 0, 0, -0.9)[side === 's' ? 1 : 0], mirror(crest, c), 2.1)
      // Grey pilasters with finials at the steps and corners.
      for (const da of [-13.4, 13.4, -22.4, 22.4, -6.9, 6.9]) {
        const h = Math.abs(da) === 6.9 ? 22.5 : Math.abs(da) === 13.4 ? 17.4 : 15.6
        const P0 = wallPt(side, at, c + da, 0, -0.5)
        const r = side === 's' ? rect(P0[0] - 0.55, P0[0] + 0.55, P0[1], P0[1] + 1.3) : rect(P0[0] - 1.3, P0[0], P0[1] - 0.55, P0[1] + 0.55)
        cbox(cantera, r, 0, h)
        const m = side === 's' ? [P0[0], P0[1] + 0.65] : [P0[0] - 0.65, P0[1]]
        spire(cantera, ngon(m[0], m[1], 0.55, 4, h), [m[0], m[1], h + 1.9])
      }
      // The portal, a niche window over it, and windows in the red walls.
      roundArch(door, side, wallPt(side, at, 0, 0, -0.9)[side === 's' ? 1 : 0], c - 1.6, c + 1.6, 0.6, 7.6, 0.06, 6)
      roundArch(win, side, wallPt(side, at, 0, 0, -0.9)[side === 's' ? 1 : 0], c - 0.8, c + 0.8, 11.5, 14.4, 0.06, 4)
      for (const da of [-10.2, 10.2, -18.8, 18.8]) roundArch(win, side, at, c + da - 0.85, c + da + 0.85, 3.6, 7.2, 0.06, 4)
    }
    // The plain north end of the N-S arm and the north face of the square.
  }

  const floodlight = (p: V3, n: V3): number => {
    const tower = p[2] > 20 && p[1] < -54 && p[0] < 40
    const dome = Math.hypot(p[0] - AX, p[1] + 1.25) < 11 && p[2] > 26
    return (tower || dome ? 1 : 0.7) * (n[2] > 0.7 ? 0.3 : 1)
  }
  return [
    // Grey cantera, pulled toward the palette's lightness but still grey.
    { part: cantera, material: { ...finish('cantera-grey', 0xb3ada3), floodlight } },
    // The paler stone of the bell caps, dome, statues and crosses.
    { part: pale, material: { ...finish('cantera-pale', 0xdcd6cb), floodlight } },
    // The Sagrario's red tezontle.
    { part: red, material: finish('tezontle', 0x8a5a4e) },
    // The orange-brown waterproofed terraces and the Sagrario's tile dome.
    { part: roof, material: finish('terrace-roof', 0xbf9c84) },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) {
  const id = 'mexico-city-metropolitan-cathedral'
  const parts = build().filter(({ part }) => part.triangles)
  const tris = parts.reduce((s, { part }) => s + part.triangles, 0)
  for (const { part, material } of parts) console.log(`  ${material.name}: ${part.triangles}`)
  const glb = writeGlb('Metropolitan Cathedral of Mexico City', parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', source: `generators/${id}.ts` })
  const strict = !process.env.LOOSE
  if (strict && tris > 6500) throw new Error(`${id}: ${tris} triangles`)
  if (strict && glb.length > 250 * 1024) throw new Error(`${id}: ${glb.length} bytes`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
