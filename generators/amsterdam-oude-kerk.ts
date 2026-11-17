/**
 * Oude Kerk (from about 1300; tower spire 1565, Joost Bilhamer), Oudekerks-
 * plein, Amsterdam: original procedural geometry, CC0-1.0.
 * bun generators/amsterdam-oude-kerk.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/57857592,
 * 52.374365, 4.898064. The church's walls run at 86 degrees, so the catalog
 * bearing is 356 (-4) and the church is square to this frame: the nave runs
 * along x, the tower stands at the west end (-x), the choir at the east.
 *
 * Identity, in order: the west tower: a square brick base with blind
 * arcading and a white cornice at 30 m, then the lead-covered wooden spire
 * stack: the clock stage with its dials and corner pinnacles, the open
 * octagonal belfry, the double bulb, the small open lantern, the crown and
 * the spire with its gilt ball and vane; the wide brick hall church, three
 * parallel roofs along the nave, and round it the crowd of chapels and
 * transept arms, each under its own transverse roof with a steep pointed
 * gable and a great Gothic window; the polygonal choir with its low
 * ambulatory; the little houses built against the walls; the small roof
 * turret on the nave.
 *
 * Evidence:
 *  - plan: OSM outline way/57857592 and its 40-odd parts, read in the
 *    turned frame: nave 747868995 (y -6.0..5.7), aisles 747868974 and
 *    747868975 (y -17.7..-6.0 and 5.7..17.4), all x -30.4..29.2 and tagged
 *    23 m with 8 m gabled roofs; south chapels 747868976-978 (y -24.3..
 *    -12.1), north chapels 747868979-981 (y 11.6..23.9), the transept arms
 *    747868987 (x 0.3..11.9, to y -31.4) and 747868988 (to y 29.4), the
 *    north chapels 747868972-973 (x 11.4..29.1), all 23 m gabled; the choir
 *    and ambulatory parts at x 29.2..41.5 (15 m, 4 m roofs) with the apse
 *    747868994 (23 m, pyramidal); the houses against the walls 747868957-960,
 *    749242499-501 (6-10 m) and 747868968-969 (17 m); tower 747868982
 *    (10 m square, 30 m), 747868971 (clock stage, 7.8 m, 30-40 m) and
 *    747868970 (40-58 m).
 *  - heights: OSM's 23 m roofs are kept for the chapels and transepts
 *    (eave 15, ridge 24.5, gables to about 26), the transept arms are raised
 *    to eave 16 and ridge 27 (their gables, the church's biggest, stand
 *    over the chapels' in every photo, about 60 degrees steep); the nave is drawn a little higher
 *    (ridge 26) and the aisles lower (ridge 21.5), as the photos show the
 *    nave roof over the chapel gables. Tower total: nl.wikipedia gives 70 m
 *    for the restored tower ("De vernieuwde ... toren is 70 meter hoog");
 *    the lead's brief gives about 67 m; C messier's level photo (8.5 px/m
 *    on the 10 m clock stage) scales to 72 m. 70 m is used. Stages, scaled
 *    from that photo: brick base 30, clock stage to 39.4, belfry to 47,
 *    bulbs to 53.6, lantern to 58.6, crown to 61, ball 64.7, vane 70 m.
 *  - colours from the daylight photos: warm red-brown brick pulled to the
 *    palette's lightness with pale sandstone bands and copings; the tower
 *    top and the roofs grey lead and slate; the dials black and gilt.
 *  - elevation 0 (flat); no lidar (AHN not supported by the repo's tools).
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Amsterdam_Oude_Kerk_7310.jpg (C messier, CC BY-SA 4.0): the west tower
 *    and the south gables from the Oudezijds Voorburgwal.
 *  - Tower_of_Oude_Kerk,_Amsterdam_01.jpg (John Samuel, CC BY-SA 4.0): the
 *    tower stages close up.
 *  - Oude_Kerk_tower_2136.jpg (C messier, CC BY-SA 4.0).
 *  - Amsterdam-508-Oude_Kerk-2010-gje.jpg (Gerd Eichmann, CC BY-SA 4.0):
 *    the transept gable, the nave roof and its turret, the houses.
 *  - Amsterdam,_Oude_Kerk_(Old_Church)_-_panoramio.jpg (Carlo Pelagalli,
 *    CC BY-SA 3.0): the chapels and transept from the canal.
 *  - Oude_Kerk_(Amsterdam,_Netherlands_2015)_(15805701833).jpg (Paul Arps,
 *    CC BY 2.0).
 *  - Amsterdam,_Oude_Kerk_(04).jpg (Subbass1, CC BY-SA 4.0).
 * No commercial imagery. No look-only sources.
 *
 * Left out: tracery, crockets, the stone bands of every gable (two per
 * gable are drawn), dormers in the roofs, the balusters, the pinnacles'
 * crockets, the vane's cockerel, the red tiled roofs of some houses (all
 * roofs are slate grey).
 *
 * Doubts: the choir and the north side are seen in few photos and follow
 * OSM; the houses against the walls are simplified to boxes with hipped
 * roofs; the spire stages' widths are estimated from photos taken from
 * below.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  archOn, ball, bbox, cap, column, cornice, discOn, face, floodAll, gableRoof, hipRoof, lathe, mastCross, parapet,
  pointedOn, rect, rectOn, save, sidesOf, walls, wallSlab, along, type XY,
} from './amsterdam-westerkerk'

function build() {
  const brick = new Part(), stone = new Part(), lead = new Part(), win = new Part(), gold = new Part(), dark = new Part()

  const X0 = -30.4, X1 = 29.2

  // A pointed gable front on wall a→b (c = centre along it, hw half width),
  // a slab rising past the roof with a stone coping and an apex pinnacle,
  // a great pointed window below it.
  const front = (a: XY, b: XY, hw: number, eave: number, apex: number, winHw: number) => {
    const c = hw
    wallSlab(brick, a, b, [[c - hw, eave], [c + hw, eave], [c, apex]], 0.7, -0.7)
    const { P, n } = along(a, b)
    const N: V3 = [n[0], n[1], 0]
    // copings: stone strips along both rakes
    for (const s of [-1, 1]) {
      const p0 = P(c + s * (hw + 0.15), eave - 0.1, 0.05), p1 = P(c, apex + 0.35, 0.05)
      const q0 = P(c + s * (hw - 0.45), eave - 0.1, 0.05), q1 = P(c, apex - 0.4, 0.05)
      face(stone, [p0, p1, q1, q0], N)
      // stone band across the gable, and the eave line
    }
    rectOn(stone, a, b, c, hw * 0.55, eave + (apex - eave) * 0.42, eave + (apex - eave) * 0.42 + 0.45, 0.05)
    rectOn(stone, a, b, c, hw, eave - 0.6, eave - 0.1, 0.05)
    const pa = P(c, apex, -0.35)
    lathe(stone, pa[0], pa[1], [[0.3, pa[2] - 0.3], [0.3, pa[2] + 0.5], [0, pa[2] + 2.0]], 4, Math.PI / 4)
    for (const s of [-1, 1]) {
      const pb = P(c + s * (hw - 0.2), eave, -0.35)
      lathe(stone, pb[0], pb[1], [[0.32, pb[2] - 0.6], [0.32, pb[2] + 0.4], [0, pb[2] + 1.8]], 4, Math.PI / 4)
    }
    // the great window
    pointedOn(stone, a, b, c, winHw + 0.35, 4.6, eave - 1.6, 0.04)
    pointedOn(win, a, b, c, winHw, 5.0, eave - 1.6, 0.08)
    // small openings in the gable
    rectOn(dark, a, b, c, 0.35, eave + (apex - eave) * 0.55, eave + (apex - eave) * 0.68, 0.06)
  }

  // A chapel or transept arm with a transverse roof (ridge along y) and its
  // gable front on the outer end (south: yOut < 0).
  const arm = (x0: number, x1: number, yIn: number, yOut: number, ridge: number, winHw: number, eave = 15) => {
    const y0 = Math.min(yIn, yOut), y1 = Math.max(yIn, yOut)
    walls(brick, rect(x0, y0, x1, y1), 0, eave)
    bbox(stone, null, x0 - 0.06, y0 - 0.06, x1 + 0.06, y1 + 0.06, 0, 0.7, 0.05)
    gableRoof(lead, null, x0, y0, x1, y1, eave, ridge, false, 0.3, 0)
    const S = sidesOf(rect(x0, y0, x1, y1))
    const seg = yOut < yIn ? S.S : S.N
    front(seg[0], seg[1], (x1 - x0) / 2, eave, ridge + 1.3, winHw)
    // buttresses at the outer corners
    for (const x of [x0, x1]) {
      const yb = yOut < yIn ? y0 : y1, sg = yOut < yIn ? -1 : 1
      bbox(brick, stone, x - 0.7, Math.min(yb, yb + sg * 1.4), x + 0.7, Math.max(yb, yb + sg * 1.4), 0, eave - 1.5, 0.5)
    }
  }

  // ------------------------------------------------------------ the hall
  // Nave and the two aisles, three parallel roofs along x.
  walls(brick, rect(X0, -6.0, X1, 5.7), 0, 16)
  gableRoof(lead, null, X0, -6.0, X1, 5.7, 16, 26, true, 0.3, 0)
  face(brick, [[X0, -6.0, 16], [X0, 5.7, 16], [X0, -0.15, 26]], [-1, 0, 0])
  for (const [y0, y1] of [[-17.7, -6.0], [5.7, 17.4]]) {
    walls(brick, rect(X0, y0, X1, y1), 0, 15)
    gableRoof(lead, brick, X0, y0, X1, y1, 15, 21.5, true, 0.3, 0)
  }
  bbox(stone, null, X0 - 0.06, -17.76, X1 + 0.06, 17.46, 0, 0.7, 0.05)

  // Chapels and transept arms round the hall.
  for (const [x0, x1] of [[-30.4, -20.2], [-20.2, -10.0], [-10.0, 0.3]]) {
    arm(x0, x1, -12.1, -24.3, 24.5, 2.6)
    arm(x0, x1, 11.6, 23.9, 24.5, 2.6)
  }
  arm(0.3, 11.9, -12.2, -31.4, 27.0, 3.3, 16)
  arm(0.3, 11.6, 11.5, 29.4, 27.0, 3.3, 16)
  arm(11.6, 20.3, 11.5, 24.5, 23.0, 2.4)
  arm(20.3, 29.1, 11.5, 24.5, 23.0, 2.4)
  // The south aisle's windows east of the transept, under its eave.
  {
    const S = sidesOf(rect(X0, -17.7, X1, -6.0)).S
    for (const x of [15.5, 23.5]) {
      pointedOn(stone, S[0], S[1], x - X0, 2.0, 4.6, 11.5, 0.04)
      pointedOn(win, S[0], S[1], x - X0, 1.65, 5.0, 11.5, 0.08)
    }
  }
  // The small roof turret on the nave ridge.
  {
    const x = 2.0, y = -0.15
    const R8 = (f: number) => f / Math.cos(Math.PI / 8)
    lathe(lead, x, y, [[R8(1.0), 24.0], [R8(1.0), 28.2], [R8(1.25), 28.4], [R8(1.25), 28.7], [R8(0.8), 29.1], [R8(0.2), 32.0], [0, 32.2]], 8, Math.PI / 8)
    ball(gold, x, y, 32.4, 0.25, 6)
  }

  // ----------------------------------------------------------- the choir
  {
    const outer: XY[] = [[X1, -12.7], [37.1, -12.7], [41.5, -3.9], [41.5, 3.3], [37.0, 12.3], [X1, 12.3]]
    const inner: XY[] = [[X1, -6.0], [32.6, -6.0], [35.2, -2.5], [35.2, 2.2], [32.6, 5.7], [X1, 5.7]]
    walls(brick, outer, 0, 11)
    walls(lead, outer, 11, 14.2, inner)
    walls(brick, inner, 14.2, 16)
    // the apse roof: from the apse's walls to the nave ridge's end
    const apex: V3 = [X1 - 0.5, -0.15, 26]
    for (let i = 0; i < inner.length - 1; i++) {
      const a = inner[i], b = inner[i + 1]
      face(lead, [[a[0], a[1], 16], [b[0], b[1], 16], apex], [((a[0] + b[0]) / 2 - X1), (a[1] + b[1]) / 2 + 0.15, 2])
    }
    for (let i = 1; i < outer.length - 2; i++) {
      const a = outer[i], b = outer[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      pointedOn(stone, a, b, L / 2, 1.6, 3.6, 8.4, 0.04)
      pointedOn(win, a, b, L / 2, 1.25, 4.0, 8.4, 0.08)
    }
    for (const [a, b] of [[outer[0], outer[1]], [outer[4], outer[5]]] as [XY, XY][]) {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      pointedOn(win, a, b, L / 2, 1.25, 4.0, 8.4, 0.08)
    }
    for (let i = 1; i < inner.length - 2; i++) {
      const a = inner[i], b = inner[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L > 3) pointedOn(win, a, b, L / 2, 0.75, 14.6, 15.0, 0.08, 3)
    }
    for (const p of outer.slice(1, 5)) bbox(brick, stone, p[0] - 0.6, p[1] - 0.6, p[0] + 0.6, p[1] + 0.6, 0, 10.0, 0.4)
  }

  // ------------------------------------------- the houses against the walls
  const house = (x0: number, y0: number, x1: number, y1: number, eave: number, ridge: number) => {
    walls(brick, rect(x0, y0, x1, y1), 0, eave)
    hipRoof(lead, x0, y0, x1, y1, eave, ridge, 0.25)
    const S = sidesOf(rect(x0, y0, x1, y1))
    for (const [a, b] of Object.values(S)) {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L > 3.5) for (const c of [L * 0.3, L * 0.7]) rectOn(win, a, b, c, 0.45, eave * 0.35, eave * 0.75, 0.05)
    }
  }
  house(-14.5, -31.2, -8.9, -24.3, 5.5, 10)
  house(-8.9, -30.4, -4.0, -24.3, 5.0, 9)
  house(-4.0, -30.6, 0.3, -24.4, 6.0, 10)
  house(-11.1, 23.9, -8.1, 26.9, 5.0, 6.5)
  house(-9.0, 26.9, -3.5, 30.6, 4.5, 7)
  house(-3.5, 23.9, 0.2, 28.9, 4.5, 7)
  house(-35.5, -17.7, -30.4, -13.1, 13.5, 17)

  // ------------------------------------------------------------ the tower
  const TX = -35.4, TY = 0.8, H = 5.0
  const tb = rect(TX - H, TY - H, TX + H, TY + H)
  walls(brick, tb, 0, 28.6)
  bbox(stone, null, TX - H - 0.1, TY - H - 0.1, TX + H + 0.1, TY + H + 0.1, 0, 1.0, 0.05)
  bbox(stone, null, TX - H - 0.12, TY - H - 0.12, TX + H + 0.12, TY + H + 0.12, 14.6, 15.2, 0.1)
  cornice(stone, TX, TY, H + 0.45, 28.6, 30.0)
  parapet(dark, rect(TX - H - 0.3, TY - H - 0.3, TX + H + 0.3, TY + H + 0.3), 30.0, 31.0, 0.25)
  for (const [k, [a, b]] of Object.entries(sidesOf(tb))) {
    // Blind arcading: three tall arches a tier, rimmed in stone.
    for (const [z0, zs] of [[2.0, 12.0], [16.2, 25.2]]) {
      for (const d of [-3.15, 0, 3.15]) {
        archOn(stone, a, b, H + d, 1.45, z0, zs, 0.03, 8)
        archOn(brick, a, b, H + d, 1.25, z0, zs, 0.05, 8)
      }
    }
    // The belfry openings, a pair in the middle arch of the upper tier.
    for (const d of [-0.55, 0.55]) archOn(dark, a, b, H + d, 0.42, 18.2, 23.8, 0.07, 5)
    rectOn(win, a, b, H, 0.4, 9.0, 10.3, 0.07)
    if (k === 'W') { archOn(stone, a, b, H, 1.3, 0, 2.9, 0.06, 8); archOn(dark, a, b, H, 1.0, 0, 2.9, 0.08, 8) }
  }
  // Clock stage: slate-hung square stage with dials and corner pinnacles.
  const H2 = 3.9
  walls(lead, rect(TX - H2, TY - H2, TX + H2, TY + H2), 30.0, 36.6)
  for (const [a, b] of Object.values(sidesOf(rect(TX - H2, TY - H2, TX + H2, TY + H2)))) {
    rectOn(lead, a, b, H2, 1.6, 32.3, 37.6, 0.25)
    discOn(gold, a, b, H2, 34.6, 1.35, 0.3, 14)
    discOn(dark, a, b, H2, 34.6, 1.1, 0.34, 14)
    // the dial's frame rises into a small pediment over the slope
    face(lead, [along(a, b).P(H2 - 1.6, 37.6, 0.25), along(a, b).P(H2 + 1.6, 37.6, 0.25), along(a, b).P(H2, 38.5, 0.25)], [along(a, b).n[0], along(a, b).n[1], 0])
  }
  const R8 = (f: number) => f / Math.cos(Math.PI / 8)
  const oct = (f: number) => Array.from({ length: 8 }, (_, i) => [TX + R8(f) * Math.cos(Math.PI / 8 + i * Math.PI / 4), TY + R8(f) * Math.sin(Math.PI / 8 + i * Math.PI / 4)] as XY)
  // the slate slope from the square to the octagon
  {
    const sqr: XY[] = [[TX - H2, TY - H2], [TX, TY - H2], [TX + H2, TY - H2], [TX + H2, TY], [TX + H2, TY + H2], [TX, TY + H2], [TX - H2, TY + H2], [TX - H2, TY]]
    const o = oct(3.0)
    // match each octagon corner to the nearest ring point, in order
    const oo: XY[] = [o[5], o[6], o[7], o[0], o[1], o[2], o[3], o[4]]
    void oo
    const sq8: XY[] = Array.from({ length: 8 }, (_, i) => { const t = Math.PI / 8 + i * Math.PI / 4; const m = H2 / Math.max(Math.abs(Math.cos(t)), Math.abs(Math.sin(t))); return [TX + m * Math.cos(t), TY + m * Math.sin(t)] as XY })
    walls(lead, sq8, 36.6, 38.4, o)
    void sqr
  }
  parapet(lead, oct(3.25), 38.4, 39.4, 0.25)
  cap(lead, oct(3.25), 38.4)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x = TX + sx * (H2 + 0.1), y = TY + sy * (H2 + 0.1)
    lathe(lead, x, y, [[0.35, 30.0], [0.35, 36.0], [0, 40.2]], 4, Math.PI / 4)
    ball(gold, x, y, 40.3, 0.22, 6)
  }
  // Open belfry: eight columns round a dark core.
  const o3 = oct(2.85)
  walls(dark, oct(2.1), 39.4, 46.3)
  for (const p of o3) column(lead, p[0], p[1], 39.4, 46.3, 0.3, 6)
  for (let i = 0; i < 8; i++) {
    const a = o3[i], b = o3[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    // arch heads between the columns
    const { P, n } = along(a, b)
    face(lead, [P(0, 45.0, 0), P(L, 45.0, 0), P(L, 46.3, 0), P(0, 46.3, 0)], [n[0], n[1], 0])
    ball(gold, a[0], a[1], 46.6, 0.2, 6)
  }
  walls(lead, oct(3.15), 46.3, 47.0)
  cap(lead, oct(3.15), 46.3, false)
  // Double bulb.
  lathe(lead, TX, TY, [[R8(3.15), 47.0], [R8(3.3), 47.7], [R8(3.0), 48.6], [R8(2.0), 49.7], [R8(1.7), 50.3], [R8(2.35), 51.2], [R8(2.2), 52.2], [R8(1.5), 53.2], [R8(1.6), 53.6], [0, 53.6]], 8, Math.PI / 8)
  // Small open lantern with a balustrade.
  parapet(lead, oct(1.95), 53.6, 54.4, 0.2)
  walls(dark, oct(1.15), 53.6, 57.9)
  for (const p of oct(1.6)) column(lead, p[0], p[1], 53.6, 57.9, 0.2, 5)
  walls(lead, oct(1.85), 57.9, 58.6)
  cap(lead, oct(1.85), 57.9, false)
  // The crown, the spire, the gilt ball and the vane.
  lathe(lead, TX, TY, [[R8(1.85), 58.6], [R8(1.5), 59.1], [R8(1.6), 59.8], [R8(1.0), 60.5], [R8(0.6), 61.0], [R8(0.35), 61.6], [R8(0.12), 64.3], [0, 64.4]], 8, Math.PI / 8)
  for (const p of oct(1.6)) ball(gold, p[0], p[1], 59.9, 0.18, 5)
  ball(gold, TX, TY, 64.7, 0.42, 8)
  mastCross(dark, TX, TY, 65.0, 70.0, 0.6, 0.1)
  {
    const vz = 68.8
    const v: V3[] = [[TX - 0.2, TY, vz], [TX + 1.0, TY, vz], [TX + 1.0, TY, vz + 0.7], [TX - 0.2, TY, vz + 0.7]]
    face(gold, v, [0, -1, 0]); face(gold, v, [0, 1, 0])
  }

  const flood = (p: V3, n: V3) => (Math.hypot(p[0] - TX, p[1] - TY) < 7 ? floodAll(p, n) : n[2] > 0.7 ? 0.15 : 0.6)
  return [
    { part: brick, material: { ...finish('oude-kerk-brick', 0xa65d49), floodlight: flood } },
    { part: stone, material: { ...finish('oude-kerk-sandstone', 0xe3d8c5), floodlight: flood } },
    { part: lead, material: { ...finish('oude-kerk-lead', 0x7a838d), floodlight: flood } },
    { part: win, material: { ...PALETTE.window } },
    { part: gold, material: finish('oude-kerk-gilt', 0xc9a24a, 0.45) },
    { part: dark, material: finish('oude-kerk-openings', 0x4a4f57) },
  ]
}

if (import.meta.main) await save('amsterdam-oude-kerk', 'Oude Kerk', [52.374365, 4.898064], 356, build(), 6500)
