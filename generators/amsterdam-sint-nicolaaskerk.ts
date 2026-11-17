/**
 * Basilica of Saint Nicholas (Sint-Nicolaasbasiliek, 1884-87, Adrianus
 * Bleijs), Prins Hendrikkade, Amsterdam: original procedural geometry,
 * CC0-1.0.
 * bun generators/amsterdam-sint-nicolaaskerk.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/174996833,
 * 52.376435, 4.901162. The nave runs at 150.1 degrees, so the catalog
 * bearing is 150.1 and the church is square to this frame: -y is the west
 * front with the twin towers facing Centraal Station (compass 330), +y the
 * apse, the crossing dome between.
 *
 * Identity, in order: the twin west towers, square, dark brown brick
 * banded with sandstone, louvred belfry arches, a balustrade with corner
 * finials, an octagonal open belfry, a bell-shaped lead dome, a small
 * lantern, a small onion and the cross; the
 * front between them with its great rose window, the arcade of small
 * windows, the three-arched porch and the gable with the saint's niche; the
 * octagonal crossing drum with its ribbed lead dome and open lantern; the
 * nave and transept under grey slate, the apse.
 *
 * Evidence:
 *  - plan: OSM outline way/174996833 and its parts in the turned frame:
 *    aisles 750217063/750217064 (x -11.6..11.2, 14 m), nave 749289634
 *    (x -6.8..6.2, y -21.9..18.3, 30 m, 6 m roof), transept 749289633
 *    (y 1.4..14.0, 30 m), drum 749289632 (octagon 13 m across, 24-39 m),
 *    dome 750217062 (39-50 m), lantern 750591090 (3.7 m across, 50-56 m),
 *    apse 750217059 (y 12.2..24.4, 30 m), corner chapels 750217060/061
 *    (14 m), towers 645534930/645534931 (6 m square, 56 m, roof 23 m).
 *  - the towers: OSM maps them 2.5 m apart in y (one projects 4.8 m, the
 *    other 2.3 m); every front photo shows a symmetric front, so both are
 *    drawn alike, 6 m square as OSM maps them, projecting 0.4 m from the
 *    front. Shaft
 *    to 35 m (OSM's 23 m roof on a 56 m tower puts it at 33; the front
 *    photos at about 40; drawn between), then (review round 2, from the front photos) an
 *    octagonal open belfry with posts round a deep dark core to 40.6, the
 *    bell-shaped dome to 46, a small open lantern to 47.6, a small onion
 *    and the spike to 52, cross to 56 m
 *    (OSM height).
 *  - the dome is drawn lower than OSM's parts (drum to 37.2, dome to 46,
 *    lantern to 50, cross 54.6 against OSM's 39/50/56): in the front photos
 *    the drum's cornice is level with the towers' balustrades and the
 *    lantern's cross well under the towers' crosses, and OSM's figures made
 *    the dome dwarf the towers. Its eight ribs are real geometry. The drum's windows and the lantern's arches
 *    are from the photos.
 *  - colours from the daylight photos: very dark brown brick, drawn as dark
 *    as the palette allows while still reading as brick, warm sandstone bands and dressings, grey lead
 *    cupolas and dome, grey slate roofs, gilt crosses.
 *  - elevation 0 (flat); no lidar (AHN not supported by the repo's tools).
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Amsterdam,_Sint_Nicolaasbasiliek_vanaf_brug_bij_Centraal_Station.JPG
 *    (A.A.W.J. Rietman, CC BY-SA 4.0): the front, towers and dome.
 *  - Amsterdam,_Sint_Nicolaasbasiliek.jpg (Parsifall, CC BY-SA 4.0): the
 *    front from the station side.
 *  - Amsterdam,_Sint_Nicolaasbasiliek,_exterieur_front_02.JPG and
 *    Amsterdam,_Sint_Nicolaasbasiliek,_achterzijde_00_koepel_02.JPG
 *    (A.A.W.J. Rietman, CC BY-SA 4.0): the front, the dome from behind.
 * No commercial imagery. No look-only sources.
 *
 * Left out: the statue of Saint Nicholas and the relief, the tracery of the
 * rose and the tall front windows, the louvres' slats, dormers in the
 * cupolas, the porch columns, the many small finials.
 *
 * Doubts: the sides and the apse are hidden by houses in every photo and
 * follow OSM; the tower and cupola split is estimated (see above).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  archOn, archWin, ball, bbox, cap, column, cornice, discOn, face, floodAll, gableRoof, lathe, mastCross, parapet,
  pyramid, rect, rectOn, save, sidesOf, urn, walls, wallSlab, along, type XY,
} from './amsterdam-westerkerk'

function build() {
  const brick = new Part(), stone = new Part(), lead = new Part(), win = new Part(), gold = new Part(), dark = new Part()

  const CX = -0.25
  const AX0 = CX - 11.4, AX1 = CX + 11.4, FY = -22.4, AY1 = 21.4
  const NX0 = CX - 6.5, NX1 = CX + 6.5, NEAVE = 23, NRIDGE = 30
  const R8 = (f: number) => f / Math.cos(Math.PI / 8)
  const oct = (cx: number, cy: number, f: number) => Array.from({ length: 8 }, (_, i) => [cx + R8(f) * Math.cos(Math.PI / 8 + i * Math.PI / 4), cy + R8(f) * Math.sin(Math.PI / 8 + i * Math.PI / 4)] as XY)

  // ------------------------------------------------------------- the body
  walls(brick, rect(AX0, FY, AX1, AY1), 0, 11)
  bbox(stone, null, AX0 - 0.08, FY - 0.08, AX1 + 0.08, AY1 + 0.08, 0, 1.6, 0.05)
  bbox(stone, null, AX0 - 0.25, FY - 0.1, AX1 + 0.25, AY1 + 0.25, 10.5, 11.0, 0.15)
  for (const [xo, xi] of [[AX0, NX0], [AX1, NX1]] as [number, number][]) {
    const sg = Math.sign(xo - xi), s = 4 / Math.abs(xo - xi)
    face(lead, [[xo + sg * 0.3, FY, 11 - 0.3 * s], [xo + sg * 0.3, AY1, 11 - 0.3 * s], [xi, AY1, 15], [xi, FY, 15]], [sg, 0, 1 / s])
    for (const y of [FY, AY1]) face(brick, [[xo, y, 11], [xi, y, 11], [xi, y, 15]], [0, Math.sign(y), 0])
  }
  walls(brick, rect(NX0, FY, NX1, 18.3), 10.5, NEAVE)
  bbox(stone, null, NX0 - 0.3, FY, NX1 + 0.3, 18.3, NEAVE - 0.6, NEAVE, 0.2)
  gableRoof(lead, null, NX0, FY, NX1, 18.3, NEAVE, NRIDGE, false, 0.3, 0)
  // Transept, ridge along x, classical end gables.
  const TY0 = 1.4, TY1 = 14.0
  walls(brick, rect(AX0, TY0, AX1, TY1), 10.5, NEAVE)
  bbox(stone, null, AX0 - 0.3, TY0 - 0.3, AX1 + 0.3, TY1 + 0.3, NEAVE - 0.6, NEAVE, 0.2)
  gableRoof(lead, null, AX0, TY0, AX1, TY1, NEAVE, NRIDGE, true, 0.3, 0)
  const TS = sidesOf(rect(AX0, TY0, AX1, TY1))
  for (const k of ['W', 'E'] as const) {
    const [a, b] = TS[k], hw = (TY1 - TY0) / 2
    wallSlab(brick, a, b, [[0, NEAVE], [2 * hw, NEAVE], [hw, NRIDGE + 0.8]], 0.6, -0.6)
    const { P } = along(a, b)
    for (const s of [-1, 1]) {
      const p0 = P(hw + s * (hw + 0.2), NEAVE - 0.1, 0.05), p1 = P(hw, NRIDGE + 1.2, 0.05), q1 = P(hw, NRIDGE + 0.4, 0.05), q0 = P(hw + s * (hw - 0.5), NEAVE - 0.1, 0.05)
      face(stone, [p0, p1, q1, q0], [along(a, b).n[0], along(a, b).n[1], 0])
    }
    const pa = P(hw, NRIDGE + 0.8, -0.3)
    lathe(stone, pa[0], pa[1], [[0.35, pa[2]], [0.35, pa[2] + 0.6], [0, pa[2] + 2.2]], 4, Math.PI / 4)
    archWin(stone, win, [a, b], hw, 2.2, 12.5, 19.0, 0.35)
    discOn(stone, a, b, hw, 25.3, 1.2, 0.04, 12)
    discOn(win, a, b, hw, 25.3, 0.9, 0.08, 12)
  }
  // Side windows of the aisles and the clerestory.
  const AS = sidesOf(rect(AX0, FY, AX1, AY1))
  const NS = sidesOf(rect(NX0, FY, NX1, 18.3))
  for (const y of [-17.5, -12.0, -6.5, 18.0]) {
    archWin(stone, win, AS.E, y - FY, 1.1, 3.0, 8.0, 0.25)
    archWin(stone, win, AS.W, AY1 - y, 1.1, 3.0, 8.0, 0.25)
  }
  for (const y of [-17.5, -12.0, -6.5]) {
    archWin(stone, win, NS.E, y - FY, 1.2, 16.8, 20.6, 0.25)
    archWin(stone, win, NS.W, 18.3 - y, 1.2, 16.8, 20.6, 0.25)
  }
  // The apse: half an octagon on the nave's end, roofed to the ridge.
  {
    const ap: XY[] = [[NX1, 18.3], [CX + 4.8, 22.1], [CX + 1.8, 24.4], [CX - 2.1, 24.4], [CX - 5.3, 22.0], [NX0, 18.3]]
    walls(brick, [...ap, [CX, 18.3]] as XY[], 0, NEAVE)
    const apex: V3 = [CX, 18.3, NRIDGE]
    for (let i = 0; i < ap.length - 1; i++) {
      const a = ap[i], b = ap[i + 1]
      face(lead, [[a[0], a[1], NEAVE], [b[0], b[1], NEAVE], apex], [(a[0] + b[0]) / 2 - CX, (a[1] + b[1]) / 2 - 18.3, 2])
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      archWin(stone, win, [a, b], L / 2, 1.0, 13.5, 19.5, 0.25)
    }
    for (const sx of [-1, 1]) {
      const c = oct(CX + sx * 8.95, 21.3, 2.3)
      walls(brick, c, 0, 10.5)
      pyramid(lead, c, 10.5, [CX + sx * 8.95, 21.3, 14.2])
    }
  }

  // ----------------------------------------------- the crossing dome
  {
    const DY = 7.75, D = oct(CX, DY, 6.3)
    walls(brick, D, 22.0, 36.2)
    for (const z of [29.5]) walls(stone, oct(CX, DY, 6.42), z, z + 0.5)
    walls(stone, oct(CX, DY, 6.75), 36.2, 37.2)
    cap(stone, oct(CX, DY, 6.75), 36.2, false)
    for (let i = 0; i < 8; i++) {
      const a = D[i], b = D[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      for (const d of [-0.85, 0.85]) archWin(stone, win, [a, b], L / 2 + d, 0.6, 31.0, 34.6, 0.2, 6)
      discOn(stone, a, b, L / 2, 26.6, 1.05, 0.04, 10)
      discOn(win, a, b, L / 2, 26.6, 0.78, 0.08, 10)
      // pilasters at the drum's corners
      rectOn(stone, a, b, 0.3, 0.3, 22.0, 36.2, 0.05)
    }
    // Ribbed lead dome (eight faceted gores) and the open lantern.
    lathe(lead, CX, DY, [[R8(6.5), 37.2], [R8(6.35), 38.5], [R8(5.7), 40.6], [R8(4.5), 42.7], [R8(3.0), 44.4], [R8(2.1), 45.4], [R8(1.9), 46.0], [0, 46.0]], 8, Math.PI / 8)
    // Eight ribs over the dome's corners, real geometry.
    {
      const prof: [number, number][] = [[6.5, 37.2], [6.35, 38.5], [5.7, 40.6], [4.5, 42.7], [3.0, 44.4], [2.1, 45.4], [1.9, 46.0]]
      for (let k = 0; k < 8; k++) {
        const t = Math.PI / 8 + k * Math.PI / 4, c = Math.cos(t), sn = Math.sin(t), w = 0.22
        const secs: V3[][] = prof.map(([f, z]) => {
          const r0 = R8(f) - 0.05, r1 = R8(f) + 0.3
          return [[CX + r0 * c - sn * w, DY + r0 * sn + c * w, z], [CX + r0 * c + sn * w, DY + r0 * sn - c * w, z], [CX + r1 * c + sn * w, DY + r1 * sn - c * w, z], [CX + r1 * c - sn * w, DY + r1 * sn + c * w, z]] as V3[]
        })
        lead.sweep(secs)
      }
    }
    const L8 = oct(CX, DY, 1.85)
    walls(dark, oct(CX, DY, 1.3), 46.0, 49.4)
    for (const p of L8) column(lead, p[0], p[1], 46.0, 49.4, 0.24, 5)
    walls(lead, oct(CX, DY, 2.05), 49.4, 50.0)
    cap(lead, oct(CX, DY, 2.05), 49.4, false)
    lathe(lead, CX, DY, [[R8(2.05), 50.0], [R8(1.6), 50.7], [R8(0.8), 51.4], [R8(0.3), 51.8], [0, 51.9]], 8, Math.PI / 8)
    ball(gold, CX, DY, 52.1, 0.25, 6)
    mastCross(gold, CX, DY, 52.2, 54.6, 0.65, 0.12)
  }

  // --------------------------------------------------------- the front
  const TH = 3.0, TWY = FY - 0.4 + TH // tower centre y: front faces 0.4 m proud
  const F = sidesOf(rect(NX0, FY, NX1, FY + 1)).S
  {
    // Central bay between the towers, to the cornice at 23 and its gable.
    const cw = (NX1 - NX0) / 2
    const [a, b] = F
    bbox(stone, null, CX - 5.2, FY - 0.15, CX + 5.2, FY + 0.5, 22.4, 23.2, 0.15)
    wallSlab(brick, a, b, [[cw - 5.2, 23.2], [cw + 5.2, 23.2], [cw, 30.6]], 0.7, -0.6)
    const { P, n } = along(a, b)
    for (const s of [-1, 1]) face(stone, [P(cw + s * 5.4, 23.1, 0.15), P(cw, 30.95, 0.15), P(cw, 30.2, 0.15), P(cw + s * 4.5, 23.1, 0.15)], [n[0], n[1], 0])
    const pa = P(cw, 30.6, -0.3)
    lathe(stone, pa[0], pa[1], [[0.45, pa[2] - 0.3], [0.45, pa[2] + 0.5], [0, pa[2] + 1.6]], 4, Math.PI / 4)
    mastCross(gold, pa[0], pa[1], pa[2] + 1.4, pa[2] + 3.0, 0.4, 0.08)
    archOn(stone, a, b, cw, 0.95, 24.6, 27.4, 0.05, 6) // the saint's niche
    archOn(dark, a, b, cw, 0.7, 24.8, 27.4, 0.08, 6)
    // The rose window, the arcade of small windows under it, the porch.
    discOn(stone, a, b, cw, 16.3, 3.6, 0.05, 20)
    discOn(win, a, b, cw, 16.3, 3.05, 0.09, 20)
    discOn(stone, a, b, cw, 16.3, 0.9, 0.12, 12)
    for (const d of [-2.4, -1.2, 0, 1.2, 2.4]) archOn(win, a, b, cw + d, 0.45, 10.3, 11.8, 0.08, 5)
    bbox(stone, null, CX - 4.7, FY - 1.6, CX + 4.7, FY, 0, 9.0, 0.2)
    const pf: [XY, XY] = [[CX - 4.7, FY - 1.6], [CX + 4.7, FY - 1.6]]
    for (const d of [-2.9, 0, 2.9]) archOn(dark, pf[0], pf[1], 4.7 + d, 1.25, 0, 5.6, 0.05, 8)
    // the porch's crowning pediment
    const { P: Q, n: qn } = along(pf[0], pf[1])
    face(stone, [Q(4.7 - 1.8, 9.0, 0.05), Q(4.7 + 1.8, 9.0, 0.05), Q(4.7, 10.4, 0.05)], [qn[0], qn[1], 0])
    rectOn(stone, a, b, cw, 4.7, 9.0, 9.6, 0.05)
  }
  for (const sx of [-1, 1]) {
    const tx = CX + sx * (11.4 - TH), ty = TWY
    const r = rect(tx - TH, ty - TH, tx + TH, ty + TH)
    walls(brick, r, 0, 33.6)
    bbox(stone, null, tx - TH - 0.1, ty - TH - 0.1, tx + TH + 0.1, ty + TH + 0.1, 0, 2.2, 0.08)
    for (const z of [5.0, 9.0, 15.6, 22.4, 31.6]) bbox(stone, null, tx - TH - 0.12, ty - TH - 0.12, tx + TH + 0.12, ty + TH + 0.12, z, z + 0.6, 0.12)
    cornice(stone, tx, ty, TH + 0.4, 33.6, 35.0)
    parapet(stone, rect(tx - TH - 0.25, ty - TH - 0.25, tx + TH + 0.25, ty + TH + 0.25), 35.0, 36.0, 0.3)
    for (const [ux, uy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      // stone corner strips and the pinnacles on the balustrade
      urn(stone, tx + ux * (TH + 0.05), ty + uy * (TH + 0.05), 36.0, 1.0, 6)
    }
    for (const [k, [a, b]] of Object.entries(sidesOf(r))) {
      for (const s of [0.25, 2 * TH - 0.25]) rectOn(stone, a, b, s, 0.25, 2.2, 33.6, 0.04)
      // belfry: a tall louvred arch
      archWin(stone, dark, [a, b], TH, 1.25, 25.0, 30.8, 0.35, 8)
      for (let z = 25.6; z < 30.6; z += 1.25) rectOn(lead, a, b, TH, 1.2, z, z + 0.45, 0.1)
      // the long front windows of the lower stage
      if (k === 'S' || (k === 'W' && sx < 0) || (k === 'E' && sx > 0)) archWin(stone, win, [a, b], TH, 0.95, 11.0, 19.6, 0.3, 8)
      if (k === 'S') archWin(stone, dark, [a, b], TH, 1.1, 2.2, 6.4, 0.3, 8)
    }
    // The tower top: an octagonal open belfry (posts round a deep dark
    // core), the bell-shaped dome, a small open lantern, a small onion, the
    // spike, the gilt ball and the cross.
    const ob = oct(tx, ty, 2.45)
    walls(dark, oct(tx, ty, 1.55), 36.0, 40.0)
    for (const p of ob) column(lead, p[0], p[1], 36.0, 40.0, 0.32, 6)
    for (let i = 0; i < 8; i++) {
      // arch heads between the posts, so each bay reads as an opening
      const a = ob[i], b = ob[(i + 1) % 8], { P, n } = along(a, b), L = Math.hypot(b[0] - a[0], b[1] - a[1])
      face(lead, [P(0, 39.2, 0), P(L, 39.2, 0), P(L, 40.0, 0), P(0, 40.0, 0)], [n[0], n[1], 0])
    }
    walls(stone, oct(tx, ty, 2.7), 40.0, 40.6)
    cap(stone, oct(tx, ty, 2.7), 40.0, false)
    lathe(lead, tx, ty, [[R8(2.7), 40.6], [R8(2.75), 41.1], [R8(2.4), 42.0], [R8(1.75), 43.2], [R8(1.3), 44.4], [R8(1.15), 45.4], [R8(0.95), 46.0], [0, 46.0]], 8, Math.PI / 8)
    walls(dark, oct(tx, ty, 0.5), 46.0, 47.6)
    for (const p of oct(tx, ty, 0.85)) column(lead, p[0], p[1], 46.0, 47.6, 0.15, 4)
    lathe(lead, tx, ty, [[R8(1.05), 47.6], [R8(1.05), 47.9], [R8(0.55), 48.1], [R8(1.05), 48.9], [R8(1.0), 49.5], [R8(0.4), 50.2], [R8(0.13), 51.9], [0, 52.0]], 8, Math.PI / 8)
    ball(gold, tx, ty, 52.2, 0.3, 6)
    mastCross(gold, tx, ty, 52.4, 56.0, 0.8, 0.14)
  }

  const flood = (p: V3, n: V3) => (p[1] < -14 || Math.hypot(p[0] - CX, p[1] - 7.75) < 7 ? floodAll(p, n) : n[2] > 0.7 ? 0.1 : 0.4)
  return [
    { part: brick, material: { ...finish('nicolaas-brick', 0x76584d), floodlight: flood } },
    { part: stone, material: { ...finish('nicolaas-sandstone', 0xdac8ac), floodlight: flood } },
    { part: lead, material: { ...finish('nicolaas-lead', 0x626b75), floodlight: flood } },
    { part: win, material: { ...PALETTE.window } },
    { part: gold, material: finish('nicolaas-gilt', 0xc9a24a, 0.45) },
    { part: dark, material: finish('nicolaas-openings', 0x4a4f57) },
  ]
}

if (import.meta.main) await save('amsterdam-sint-nicolaaskerk', 'Basilica of Saint Nicholas', [52.376435, 4.901162], 150.1, build(), 6500)
