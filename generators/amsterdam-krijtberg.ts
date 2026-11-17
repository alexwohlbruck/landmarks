/**
 * De Krijtberg (Sint-Franciscus Xaveriuskerk, 1881-83, Alfred Tepe),
 * Singel 448, Amsterdam: original procedural geometry, CC0-1.0.
 * bun generators/amsterdam-krijtberg.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/267123478,
 * 52.367761, 4.888070. The nave runs at 49.2 degrees, so the catalog
 * bearing is 49.2 and the church is square to this frame: +y is the narrow
 * front on the Singel with the twin spires, -y the apse.
 *
 * Identity, in order: the two slender spires on the narrow canal front,
 * each a square brick tower turning into an octagonal belfry with gablets
 * and pinnacles under a tall dark slate spire with a cross; the gabled
 * front between them with its two tall pointed windows and twin portals;
 * the tall, narrow neo-Gothic brick church running back from the canal
 * between the houses, with its steep slate roof, the transept, the small
 * flèche on the crossing and the polygonal apse.
 *
 * Evidence:
 *  - plan: OSM outline way/267123478 and its parts in the turned frame:
 *    aisles 751713220 (x -11.0..5.8, y -15.9..26.5, 20 m, 7 m roof), nave
 *    751713223 (x -7.7..2.6, to y 26.5, 35 m, 7 m roof), transept 751713221
 *    (y -13.0..-3.1, 35 m), apse 751713222 (polygon to y -26.1, 35 m),
 *    the apse-side chapels 751713218/219 (20 m), the annex 751905303
 *    (x 7.5..17.3, 13 m), towers 751905304/751905305 (4.2 m, 50 m with a
 *    17 m spire roof) at x -8.9 and 3.7, y 22.8..27.0.
 *  - heights: OSM's tower 50 m is the cross's top. The stages are scaled
 *    from C messier's frontal elevation-like photo (37 px/m across the
 *    16.8 m front) and fitted to 50 m: square towers to 25.7, belfry
 *    octagons and gablets to 34.5, spire tip 47, cross 50; front cornice
 *    25.4, gable apex 33.9 m. Nave eave 28, ridge 35 m (OSM).
 *  - colours from the daylight photos: dark brown-red brick pulled to the
 *    palette's lightness, dark slate spires and roofs (the spires stay dark,
 *    they are what the church is known by), pale stone only in thin
 *    copings, gilt crosses.
 *  - elevation 0 (flat); no lidar (AHN not supported by the repo's tools).
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Krijtberg_2856.jpg (C messier, CC BY-SA 4.0): the front, frontal, at
 *    night (floodlit).
 *  - Amsterdam_-_De_Krijtberg_church_-_1308.jpg (Jorge Royan, CC BY-SA 3.0):
 *    from above and behind: apse, transept, roofs, flèche, spires.
 *  - Overzicht_neogotische_kruisbasiliek_-_Amsterdam_-_20369642_-_RCE.jpg
 *    (unknown author, Rijksdienst voor het Cultureel Erfgoed, CC BY-SA 4.0):
 *    the front and the spires along the Singel.
 *  - Overzicht_met_R.K._kerk_De_Krijtberg_-_Amsterdam_-_20020935_-_RCE.jpg
 *    (Gerard Dukker, CC BY-SA 4.0): the spires and the nave roof over the
 *    canal houses.
 *  - Amsterdam_De_Krijtberg_Fassade_2.jpg (Zairon, CC BY-SA 4.0).
 *  - De_Krijtberg,_Singel.JPG (Alf van Beem, CC0).
 *  - De_Krijtberg_(5821469239).jpg (Jorge Lascar, CC BY 2.0).
 * No commercial imagery. No look-only sources.
 *
 * Left out: tracery, the statue on the front, crockets, the blind arcading
 * of the towers (drawn as a few dark lancets), the houses on either side
 * (they are the map's own).
 *
 * Review round 2: the centre of the front stands 0.5 m back from the
 * towers, the towers carry stepped buttresses, the belfries and spires are
 * wider (octagon 4.3 m across), the transept's eave is lowered to 22 m and
 * its ridge to 32 m (OSM tags 35 m) so the nave reads as one steep gable
 * from behind and the transept doesn't widen the canal view above the
 * front's cornice; the apse chapels are lower (13 m walls, 17.5 m tips,
 * OSM 20 m). The brick is darker, purple-brown. Width seen from the canal
 * is still OSM's: the transept reaches 1.7 m past the towers on each side
 * and the 13 m annex stands beside it; the map's neighbouring houses hide
 * most of both.
 *
 * Doubts: the sides are hidden between houses and follow OSM; the annex is
 * drawn plain; the spires are drawn a little thicker than real so they
 * hold at phone size.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  ball, bbox, cap, face, floodAll, gableRoof, lathe, mastCross, pointedOn, pyramid, rect, rectOn, save, sidesOf,
  walls, wallSlab, along, type XY,
} from './amsterdam-westerkerk'

function build() {
  const brick = new Part(), stone = new Part(), slate = new Part(), win = new Part(), gold = new Part(), dark = new Part()

  const CX = -2.55, FY = 27.0
  const AX0 = -11.0, AX1 = 5.8, AY0 = -15.9
  const NX0 = -7.7, NX1 = 2.6, NY0 = -20.3, NEAVE = 28, NRIDGE = 35
  const R8 = (f: number) => f / Math.cos(Math.PI / 8)
  const oct = (cx: number, cy: number, f: number) => Array.from({ length: 8 }, (_, i) => [cx + R8(f) * Math.cos(Math.PI / 8 + i * Math.PI / 4), cy + R8(f) * Math.sin(Math.PI / 8 + i * Math.PI / 4)] as XY)

  // A pointed gable on wall a→b, rising past the roof, stone coping, finial.
  const gable = (a: XY, b: XY, hw: number, eave: number, apex: number) => {
    wallSlab(brick, a, b, [[0, eave], [2 * hw, eave], [hw, apex]], 0.6, -0.6)
    const { P, n } = along(a, b)
    for (const s of [-1, 1]) face(stone, [P(hw + s * (hw + 0.15), eave - 0.1, 0.04), P(hw, apex + 0.3, 0.04), P(hw, apex - 0.3, 0.04), P(hw + s * (hw - 0.4), eave - 0.1, 0.04)], [n[0], n[1], 0])
    const pa = P(hw, apex, -0.3)
    lathe(stone, pa[0], pa[1], [[0.25, pa[2] - 0.2], [0.25, pa[2] + 0.4], [0, pa[2] + 1.6]], 4, Math.PI / 4)
    for (const s of [-1, 1]) {
      const pb = P(hw + s * (hw - 0.15), eave, -0.3)
      lathe(slate, pb[0], pb[1], [[0.3, pb[2] - 0.5], [0.3, pb[2] + 0.5], [0, pb[2] + 2.4]], 4, Math.PI / 4)
    }
  }

  // ------------------------------------------------------------- the body
  walls(brick, rect(AX0, AY0, AX1, FY - 1.3), 0, 13)
  bbox(stone, null, AX0 - 0.2, AY0 - 0.2, AX1 + 0.2, FY - 1.3, 12.6, 13.0, 0.12)
  for (const [xo, xi] of [[AX0, NX0], [AX1, NX1]] as [number, number][]) {
    const sg = Math.sign(xo - xi), s = 6 / Math.abs(xo - xi)
    face(slate, [[xo + sg * 0.3, AY0, 13 - 0.3 * s], [xo + sg * 0.3, FY - 1.3, 13 - 0.3 * s], [xi, FY - 1.3, 19], [xi, AY0, 19]], [sg, 0, 1 / s])
    face(brick, [[xo, AY0, 13], [xi, AY0, 13], [xi, AY0, 19]], [0, -1, 0])
  }
  walls(brick, rect(NX0, NY0, NX1, FY - 1.3), 12.5, NEAVE)
  bbox(stone, null, NX0 - 0.2, NY0, NX1 + 0.2, FY - 1.3, NEAVE - 0.4, NEAVE, 0.12)
  gableRoof(slate, null, NX0, NY0, NX1, FY - 1.3, NEAVE, NRIDGE, false, 0.3, 0)
  // Transept: same height as the nave, ridge along x, gables at both ends.
  const TY0 = -13.0, TY1 = -3.1, TX0 = -12.7, TX1 = 7.6
  const TE = 22 // transept eave: below the front, so it doesn't widen the canal view
  walls(brick, rect(TX0, TY0, TX1, TY1), 0, TE)
  bbox(stone, null, TX0 - 0.2, TY0 - 0.2, TX1 + 0.2, TY1 + 0.2, TE - 0.4, TE, 0.12)
  gableRoof(slate, null, TX0, TY0, TX1, TY1, TE, 32, true, 0.3, 0)
  const TS = sidesOf(rect(TX0, TY0, TX1, TY1))
  for (const k of ['W', 'E'] as const) {
    const [a, b] = TS[k], hw = (TY1 - TY0) / 2
    gable(a, b, hw, TE, 33.0)
    pointedOn(stone, a, b, hw, 2.2, 9.0, 21.0, 0.04)
    pointedOn(win, a, b, hw, 1.85, 9.4, 21.0, 0.08)
    for (const d of [-hw + 0.4, hw - 0.4]) {
      const [x0, x1] = k === 'W' ? [TX0 - 1.2, TX0] : [TX1, TX1 + 1.2]
      bbox(brick, stone, x0, TY0 + hw + d - 0.5, x1, TY0 + hw + d + 0.5, 0, TE - 3, 0.5)
    }
  }
  // Clerestory and aisle windows on both sides.
  const NS = sidesOf(rect(NX0, NY0, NX1, FY - 1.3)), AS = sidesOf(rect(AX0, AY0, AX1, FY - 1.3))
  for (const y of [1.0, 7.0, 13.0, 19.0]) {
    for (const k of ['E', 'W'] as const) {
      const sN = k === 'E' ? y - NY0 : FY - 1.3 - y, sA = k === 'E' ? y - AY0 : FY - 1.3 - y
      pointedOn(win, NS[k][0], NS[k][1], sN, 1.1, 20.5, 24.8, 0.08)
      pointedOn(win, AS[k][0], AS[k][1], sA, 1.1, 4.0, 9.5, 0.08)
    }
  }
  // The flèche on the crossing.
  {
    const x = CX, y = -8.05
    lathe(slate, x, y, [[R8(0.9), 33.0], [R8(0.9), 37.2], [R8(1.1), 37.4], [R8(0.15), 41.5], [0, 41.6]], 8, Math.PI / 8)
    mastCross(gold, x, y, 41.4, 43.0, 0.45, 0.08)
  }
  // The apse: polygon to y -26.1 with a hipped roof to the ridge's end.
  {
    const ap: XY[] = [[NX1, NY0 + 0.5], [2.6, -21.9], [1.4, -24.5], [-0.8, -26.0], [-3.7, -26.1], [-6.1, -24.5], [-7.4, -21.7], [NX0, NY0 + 0.5]]
    walls(brick, [...ap, [CX, NY0 + 0.5]] as XY[], 0, NEAVE)
    const apex: V3 = [CX, NY0 + 0.5, NRIDGE]
    for (let i = 0; i < ap.length - 1; i++) {
      const a = ap[i], b = ap[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      face(slate, [[a[0], a[1], NEAVE], [b[0], b[1], NEAVE], apex], [(a[0] + b[0]) / 2 - CX, (a[1] + b[1]) / 2 - NY0, 1.5])
      if (L > 2) pointedOn(win, a, b, L / 2, Math.min(0.9, L / 2 - 0.4), 12.0, 22.0, 0.08)
    }
    for (const [cx, cy] of [[-10.45, -16.05], [5.6, -15.9]]) {
      const c = oct(cx, cy, 2.7)
      walls(brick, c, 0, 13)
      pyramid(slate, c, 13, [cx, cy, 17.5])
    }
  }
  // The annex beside the transept (OSM 751905303, 13 m).
  walls(brick, rect(7.6, -12.8, 17.3, 8.6), 0, 10)
  gableRoof(slate, brick, 7.6, -12.8, 17.3, 8.6, 10, 13, false, 0.25, 0)

  // ------------------------------------------------------------ the front
  const FX0 = -6.8, FX1 = 1.6
  {
    const FR = FY - 0.5 // the centre stands back so the towers read as towers
    const fr = rect(FX0, FR - 1.0, FX1, FR)
    walls(brick, fr, 0, 25.4)
    const [a, b] = sidesOf(fr).N
    const hw = (FX1 - FX0) / 2
    bbox(stone, null, FX0, FR - 0.6, FX1, FR + 0.2, 25.0, 25.5, 0.1)
    gable(a, b, hw, 25.4, 33.9)
    mastCross(gold, CX, FR - 0.3, 35.4, 37.2, 0.55, 0.1)
    // Two tall windows, a central pier, two pointed portals.
    for (const d of [-2.0, 2.0]) {
      pointedOn(stone, a, b, hw + d, 1.5, 13.0, 19.6, 0.04)
      pointedOn(win, a, b, hw + d, 1.2, 13.4, 19.6, 0.08)
      pointedOn(win, a, b, hw + d, 0.6, 7.0, 8.4, 0.08, 3)
      pointedOn(stone, a, b, hw + d, 1.55, 0, 3.3, 0.04)
      pointedOn(dark, a, b, hw + d, 1.15, 0, 3.3, 0.08)
    }
    rectOn(brick, a, b, hw, 0.35, 0, 25.0, 0.2)
    rectOn(stone, a, b, hw, 4.2, 11.4, 11.8, 0.06)
    for (const d of [-1.6, 0, 1.6]) pointedOn(dark, a, b, hw + d, 0.28, 27.0, 29.6, 0.07, 3)
  }

  // ------------------------------------------------------------ the spires
  for (const tx of [-8.9, 3.7]) {
    const ty = 24.9, H = 2.2
    const sq = rect(tx - H, ty - H, tx + H, ty + H)
    walls(brick, sq, 0, 25.7)
    bbox(stone, null, tx - H - 0.08, ty - H - 0.08, tx + H + 0.08, ty + H + 0.08, 0, 0.8, 0.05)
    for (const z of [11.4, 24.6]) bbox(stone, null, tx - H - 0.1, ty - H - 0.1, tx + H + 0.1, ty + H + 0.1, z, z + 0.4, 0.08)
    // corner buttresses on the outer front corners
    // Stepped corner buttresses on the tower's front corners: they give
    // the shafts their edges in the photos.
    for (const sx of [-1, 1]) {
      const x = tx + sx * (H - 0.35)
      bbox(brick, stone, x - 0.45, ty + H - 0.2, x + 0.45, ty + H + 0.55, 0, 13.5, 0.35)
      bbox(brick, stone, x - 0.35, ty + H - 0.2, x + 0.35, ty + H + 0.3, 13.5, 23.5, 0.3)
    }
    for (const [k, [a, b]] of Object.entries(sidesOf(sq))) {
      if (k === 'S') continue
      for (const d of [-0.7, 0.7]) pointedOn(dark, a, b, H + d, 0.33, 15.5, 22.4, 0.06, 3)
      pointedOn(win, a, b, H, 0.45, 5.0, 9.6, 0.06, 3)
    }
    // the transition: chamfered top of the square
    const o = oct(tx, ty, 2.15)
    const sq8: XY[] = Array.from({ length: 8 }, (_, i) => { const t = Math.PI / 8 + i * Math.PI / 4; const m = H / Math.max(Math.abs(Math.cos(t)), Math.abs(Math.sin(t))); return [tx + m * Math.cos(t), ty + m * Math.sin(t)] as XY })
    walls(brick, sq8, 25.7, 26.6, o)
    // Octagonal belfry with dark lancets.
    walls(brick, o, 26.6, 32.0)
    for (let i = 0; i < 8; i++) {
      const a = o[i], b = o[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      pointedOn(dark, a, b, L / 2, 0.42, 27.4, 30.6, 0.05, 3)
    }
    walls(stone, oct(tx, ty, 2.25), 31.6, 32.0)
    // Gablets on the four main faces and pinnacles on the diagonals.
    for (const fi of [1, 3, 5, 7]) {
      const a = o[fi], b = o[(fi + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      wallSlab(brick, a, b, [[0, 31.4], [L, 31.4], [L / 2, 34.5]], 0.35, 0.0)
      const { P } = along(a, b)
      const pa = P(L / 2, 34.5, 0.15)
      lathe(stone, pa[0], pa[1], [[0.14, pa[2] - 0.1], [0, pa[2] + 0.7]], 4)
    }
    for (const fi of [0, 2, 4, 6]) {
      const p = o[fi], q = o[(fi + 1) % 8]
      const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2
      const ox = mx + (mx - tx) * 0.12, oy = my + (my - ty) * 0.12
      lathe(slate, ox, oy, [[0.26, 30.6], [0.26, 32.4], [0, 35.0]], 4, Math.PI / 4)
    }
    // The spire, drawn a little fat so it holds at phone size.
    lathe(slate, tx, ty, [[R8(2.2), 32.0], [R8(1.85), 33.2], [R8(1.25), 37.0], [R8(0.6), 42.5], [R8(0.13), 46.6], [0, 47.0]], 8, Math.PI / 8)
    ball(gold, tx, ty, 47.15, 0.25, 6)
    mastCross(gold, tx, ty, 47.3, 50.0, 0.7, 0.13)
  }

  const flood = (p: V3, n: V3) => (p[1] > 20 ? floodAll(p, n) : n[2] > 0.7 ? 0.05 : 0.2)
  return [
    { part: brick, material: { ...finish('krijtberg-brick', 0x7b5552), floodlight: flood } },
    { part: stone, material: { ...finish('krijtberg-stone', 0xdccfba), floodlight: flood } },
    { part: slate, material: { ...finish('krijtberg-slate', 0x5f6670), floodlight: flood } },
    { part: win, material: { ...PALETTE.window } },
    { part: gold, material: finish('krijtberg-gilt', 0xc9a24a, 0.45) },
    { part: dark, material: finish('krijtberg-openings', 0x464b52) },
  ]
}

if (import.meta.main) await save('amsterdam-krijtberg', 'De Krijtberg', [52.367761, 4.88807], 49.2, build(), 6500)
