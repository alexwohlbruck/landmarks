/**
 * St. Peter ("Alter Peter"), Rindermarkt / Petersplatz, Munich: the oldest
 * parish church of the city; Gothic basilica consecrated 1294, rebuilt
 * after 1327, the single west tower between the two Gothic tower stumps
 * 1379-86, its crown with the open lantern after 1607; rebuilt after 1945.
 * Original procedural geometry, CC0-1.0.
 * bun generators/munich-st-peter.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/228534603,
 * 48.136473, 11.576031. The church's walls run at 14 / 104 degrees, so the
 * catalog bearing is 14 and the church is square to this frame: +x is the
 * trefoil choir (east-north-east), -x the tower on the Rindermarkt, -y the
 * south side. The church is symmetric about y = 0 to within 0.2 m.
 *
 * Identity, in order: the tall pale plastered tower with its open gallery
 * at 56 m, the green copper crown above it (the bell-shaped hood with four
 * clock dormers, the open lantern, the onion and the slender spire with
 * gilt ball and double cross, 91 m), the four big clocks on the shaft
 * under the paired pointed belfry openings; the two Gothic tower stumps
 * with sloped copper tops flanking it and the two polygonal stair turrets
 * at the west portal; the steep red tile nave roof over the white
 * clerestory with its oculi and the long lean-to aisle roofs; the bare
 * brick trefoil choir with its tent roofs and the two round stair towers
 * with green welsche Hauben in its eastern angles.
 *
 * Evidence:
 *  - plan: OSM outline way/228534603 and its parts, read in the turned
 *    frame: nave 228534639 (x -30.7..19.3, 12.7 m wide), aisles 225910820/
 *    821 (17 m) and chapels 225910818/819 (12 m) to y +-14.9; the trefoil
 *    choir 225910817 (to x 35.3 and y +-16.4); its round stair towers
 *    225910822/823 (30 m, dome); the sacristy 225984495 round the east conch
 *    (10 m, skillion 5 m falling outward); the tower 35903317 (x -36.9..
 *    -30.7, y +-6.3), the stumps 225717101/105 (40 m, skillion 5 m falling
 *    outward), the spire 225984496 (91 m), the west porch 225987427 (12 m)
 *    and the stair turrets 225987428/429 (20 m, pyramidal). The upper shaft
 *    is drawn 10 m square, wider east-west than OSM's 6.2 m part: Richard
 *    Huber's and HerrAdams's photos, from the south-west and south-east,
 *    show two near-equal faces, each about 10 m across.
 *  - heights: 91 m to the top of the cross and the gallery at 56 m
 *    (de.wikipedia, St. Peter (München); "Turmgalerie in 57 m Höhe" in the
 *    description section; the platform floor drawn at 56.2). Nave vault
 *    22 m, aisles 9 m, chapels 2.2-2.35 m deep (de.wikipedia). The stages
 *    of the crown are scaled from Richard Huber's Rindermarkt photo
 *    (0.071 m per px between the 56 m gallery and the 91 m cross): hood
 *    59.6-66.6, lantern to 70.6, onion to 73.7, spire to 88, ball, cross;
 *    shaft clocks at 44.7, belfry openings 48.4-52.4, stumps' tops 35-40
 *    (OSM). The nave ridge, 37 m, scaled from Softeis's photo from the
 *    Neues Rathaus (0.06 m per px from the gallery and the shaft clocks);
 *    the nave eave (25 m), the aisle eave (14 m), the choir walls (26 m)
 *    and its tent roofs (crossing to 37.6 m, level with the nave ridge as
 *    in Softeis's photo, conches 36 m) are estimated from the photos.
 *  - colours from the daylight photos: pale grey plaster (tower, nave,
 *    west front), red-brown brick of the choir, red tiles, green copper,
 *    gilt ball and cross, black clock dials (drawn as `window`, so lit).
 *  - elevation 0; flat ground. No lidar in Germany; no 3D city models.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Alter_Peter_und_Rindermarkt.jpg (Richard Huber, CC BY-SA 3.0): the
 *    tower from the south-west, whole crown; main height reference.
 *  - Alter-peter_vom-rathaus.jpg (Softeis, CC BY 2.5): from the Neues
 *    Rathaus tower, north-north-west: tower, nave roof, clerestory.
 *  - Alter_Peter_(Seitenansicht).jpg (Meister Eiskalt, CC BY-SA 4.0): the
 *    brick choir and a stair tower from the south-east.
 *  - Turm_St._Peter_München_2024-11-09.jpg and St._Peter_und_Turm_vom_
 *    Talburgtor_München_2022-12-17.jpg (Strubbl, CC BY-SA 4.0): the choir's
 *    tent roofs, a stair tower's haube, the crown.
 *  - München,_Alter_Peter_2007-10.jpg (HerrAdams, CC BY-SA 4.0): the tower
 *    from the south-east (Viktualienmarkt).
 *  - 20230304_St._Peter_church_Munich.jpg (Flocci Nivis, CC BY 4.0): the
 *    tower from the east, crown and clocks.
 * No commercial imagery. No look-only sources.
 *
 * Left out: the round-arched friezes and dentils of the tower (drawn as
 * plain cornices), the tracery of the west front's blind arch, epitaphs,
 * the ironwork pattern of the gallery railing (drawn as posts and a rail),
 * the bells in the lantern.
 *
 * Doubts: the upper shaft's depth (OSM 6.2 m against the photos' ~10 m);
 * the choir's roofs are seen only obliquely and are simplified to three
 * tent roofs and a crossing pyramid; the sacristy's roof is from OSM tags.
 *
 * Uses the kit in munich-frauenkirche.ts.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, rect, lathe, walls, cap, along, archOn, bbox, discOn, face, ngon, rectOn, ball, pointedOn, sidesOf, segsOf, ccw, post, band, slopedPrism, clock, ridgeRoof, area, type XY } from './munich-frauenkirche'
import { leanTo, gableRoof, column } from './amsterdam-westerkerk'

function build() {
  const plaster = new Part(), brick = new Part(), tile = new Part(), copper = new Part(), win = new Part(), gold = new Part()

  // ------------------------------------------------------------- the nave
  const NX0 = -30.7, NX1 = 19.3, NY = 6.3, AY = 14.8
  const NEAVE = 25.0, NRIDGE = 37.0, AEAVE = 14.0, AINNER = 19.6
  walls(plaster, rect(NX0, -AY, NX1, AY), 0, AEAVE)
  walls(plaster, rect(NX0, -NY, NX1, NY), AEAVE, NEAVE)
  bbox(plaster, null, NX0 - 0.25, -NY - 0.25, NX1 + 0.25, NY + 0.25, NEAVE - 0.5, NEAVE, 0.15)
  bbox(plaster, null, NX0 - 0.2, -AY - 0.2, NX1 + 0.2, AY + 0.2, AEAVE - 0.5, AEAVE, 0.15)
  gableRoof(tile, plaster, NX0, -NY, NX1, NY, NEAVE, NRIDGE, true, 0.4, 0)
  leanTo(tile, plaster, NX0, NX1, -AY, -NY, AEAVE, AINNER, 0.4)
  leanTo(tile, plaster, NX0, NX1, AY, NY, AEAVE, AINNER, 0.4)
  // Nine bays: round-arched windows and oculi in the aisle walls, oculi in
  // the clerestory, flat pilasters between.
  const BAY = (NX1 - NX0 - 1.5) / 9
  const AS = sidesOf(rect(NX0, -AY, NX1, AY)), NS = sidesOf(rect(NX0, -NY, NX1, NY))
  for (let k = 0; k < 9; k++) {
    const x = NX0 + 1.5 + (k + 0.5) * BAY
    for (const side of ['S', 'N'] as const) {
      const [a, b] = AS[side], s = side === 'S' ? x - NX0 : NX1 - x
      if (k !== 0 && k !== 7) archOn(win, a, b, s, 1.05, 3.4, 8.6, 0.06, 6)
      else { archOn(brick, a, b, s, 1.2, 0, 3.6, 0.06, 6); archOn(win, a, b, s, 0.7, 6.2, 8.6, 0.06, 6) }
      discOn(win, a, b, s, 11.6, 0.75, 0.06, 10)
      const [c, d] = NS[side], t = side === 'S' ? x - NX0 : NX1 - x
      discOn(win, c, d, t, 22.4, 1.05, 0.06, 10)
    }
    if (k > 0) for (const sy of [-1, 1]) {
      const xp = x - BAY / 2, y = sy * AY
      bbox(plaster, plaster, xp - 0.4, sy < 0 ? y - 0.25 : y, xp + 0.4, sy < 0 ? y : y + 0.25, 0.8, AEAVE - 0.6, 0.1)
    }
  }

  // ------------------------------------------------------- the trefoil choir
  const CEAVE = 26.0
  const choir: XY[] = ccw([[19.3, 6.4], [19.3, 13.1], [21.7, 16.4], [27.5, 16.4], [30.2, 13.2], [30.2, 6.5], [32.4, 6.5], [35.3, 3.3], [35.2, -2.2], [32.5, -6.0], [30.3, -6.0], [30.3, -12.7], [27.6, -15.9], [21.9, -15.9], [19.3, -12.8], [19.3, -6.1]])
  walls(brick, choir, 0, CEAVE)
  walls(brick, choir, CEAVE - 0.6, CEAVE, choir.map(([x, y]) => [x + (x - 26) * 0.02, y + y * 0.02] as XY))
  // Windows: tall round-arched below, oval-ish oculi above, on every
  // outer facet of the conches (the west edges are against the nave).
  segsOf(choir).forEach(([a, b]) => {
    const { L, n } = along(a, b)
    if (L < 2.5 || (Math.abs(a[0] - 19.3) < 0.01 && Math.abs(b[0] - 19.3) < 0.01)) return
    if (n[0] < -0.9) return
    archOn(win, a, b, L / 2, Math.min(1.2, L * 0.22), 13.2, 18.4, 0.06, 6)
    discOn(win, a, b, L / 2, 22.2, Math.min(1.15, L * 0.2), 0.06, 10)
    archOn(brick, a, b, L / 2, Math.min(1.5, L * 0.27), 12.8, 18.4, 0.03, 6)
  })
  // Tent roofs: the crossing square, the south and north conches, the
  // small east conch.
  const conchS: XY[] = ccw([[19.3, -6.1], [19.3, -12.8], [21.9, -15.9], [27.6, -15.9], [30.3, -12.7], [30.3, -6.0]])
  const conchN: XY[] = ccw([[19.3, 6.4], [30.2, 6.5], [30.2, 13.2], [27.5, 16.4], [21.7, 16.4], [19.3, 13.1]])
  const conchE: XY[] = ccw([[30.3, -6.0], [32.5, -6.0], [35.2, -2.2], [35.3, 3.3], [32.4, 6.5], [30.2, 6.5]])
  const square: XY[] = rect(19.3, -6.05, 30.25, 6.45)
  const tent = (ring: XY[], apex: V3, o = 0.4) => {
    const r = ccw(ring), cx = r.reduce((s, v) => s + v[0], 0) / r.length, cy = r.reduce((s, v) => s + v[1], 0) / r.length
    const g = r.map(([x, y]) => { const dx = x - cx, dy = y - cy, l = Math.hypot(dx, dy) || 1; return [x + (dx / l) * o, y + (dy / l) * o] as XY })
    ridgeRoof(tile, null, g, CEAVE - 0.3, () => apex)
    // finial
    column(copper, apex[0], apex[1], apex[2] - 0.2, apex[2] + 1.2, 0.09, 4)
    ball(copper, apex[0], apex[1], apex[2] + 1.35, 0.28, 6)
  }
  tent(square, [24.8, 0.2, 37.6])
  tent(conchS, [24.9, -9.6, 36.0])
  tent(conchN, [24.8, 10.0, 36.0])
  tent(conchE, [31.2, 0.25, 32.5])
  // The round stair towers in the eastern angles, with green hauben.
  for (const [x, y] of [[31.0, -7.6], [30.9, 8.1]]) {
    lathe(brick, x, y, [[2.15, 0], [2.15, 30.0], [0, 30.0]], 12)
    lathe(copper, x, y, [[2.25, 29.8], [2.45, 30.6], [2.3, 31.8], [1.6, 33.0], [0.7, 33.8], [0.15, 34.3], [0, 34.4]], 12)
    column(copper, x, y, 34.2, 35.4, 0.08, 4)
    ball(copper, x, y, 35.5, 0.22, 6)
    for (let k = 0; k < 3; k++) {
      const t = -Math.PI / 2 + k * 0.9 * Math.sign(y) + (y > 0 ? Math.PI : 0)
      const a: XY = [x + 2.16 * Math.cos(t - 0.2), y + 2.16 * Math.sin(t - 0.2)], b: XY = [x + 2.16 * Math.cos(t + 0.2), y + 2.16 * Math.sin(t + 0.2)]
      rectOn(win, a, b, along(a, b).L / 2, 0.22, 8 + k * 7, 9.2 + k * 7, 0.05)
    }
  }
  // The sacristy round the east conch: plastered, lean-to roof falling
  // outward from 10 m to 6.5 m.
  {
    const ring: XY[] = [[30.2, 11.5], [30.2, 13.2], [35.0, 11.4], [36.5, 10.2], [40.8, 6.4], [41.0, -4.7], [35.4, -10.5], [30.3, -12.7], [30.3, -10.9], [30.3, -6.0], [32.5, -6.0], [35.2, -2.2], [35.3, 3.3], [32.4, 6.5], [30.2, 6.5]]
    const inner = [true, false, false, false, false, false, false, false, true, true, true, true, true, true, true]
    const rev = area(ring) < 0, r = rev ? [...ring].reverse() : ring, inn = rev ? [...inner].reverse() : inner
    const tops = inn.map((v) => (v ? 10 : 6.5))
    const skip = r.map((_, i) => (inn[i] && inn[(i + 1) % r.length] ? i : -1)).filter((i) => i >= 0)
    slopedPrism(plaster, tile, r, 0, tops, skip)
    r.forEach((a, i) => {
      if (skip.includes(i)) return
      const b = r[(i + 1) % r.length], L = along(a, b).L
      if (L > 4) archOn(win, a, b, L / 2, 0.7, 2.6, 4.8, 0.06, 6)
    })
  }

  // ------------------------------------------------------------- the tower
  // West block between the stumps, to 37.5 m; the stumps with sloped
  // copper tops (40 m at the tower, 35 m outside); the stair turrets and
  // the porch; the upper shaft, 10 m square, to the gallery.
  const WX = -37.4, WX1 = -30.7
  walls(plaster, rect(WX, -6.3, WX1, 6.3), 0, 37.5)
  for (const s of [-1, 1]) {
    const y0 = s * 6.3, y1 = s * 13.0
    const ring: XY[] = ccw([[-37.8, y0], [WX1, y0], [WX1, y1], [-37.8, y1]])
    const tops = ring.map(([, y]) => (Math.abs(y) < 7 ? 40 : 35))
    slopedPrism(plaster, copper, ring, 0, tops)
    const F = sidesOf(rect(-37.8, Math.min(y0, y1), WX1, Math.max(y0, y1)))
    const outer = s < 0 ? F.S : F.N
    pointedOn(win, outer[0], outer[1], along(outer[0], outer[1]).L / 2, 0.9, 8, 13, 0.06, 4)
    pointedOn(win, F.W[0], F.W[1], 3.35, 0.9, 8, 13, 0.06, 4)
    pointedOn(win, F.W[0], F.W[1], 3.35, 0.7, 22, 26, 0.06, 4)
    // a plain cornice under the slope
    bbox(plaster, null, -38.05, Math.min(y0, y1) - (s < 0 ? 0.25 : 0), WX1, Math.max(y0, y1) + (s > 0 ? 0.25 : 0), 33.8, 34.4, 0.1)
  }
  {
    // West face: the great blind pointed arch (a recessed plaster panel
    // edged in brick-red shadow is not drawn; its window and the portal are).
    const [a, b] = sidesOf(rect(WX, -6.3, WX1, 6.3)).W
    pointedOn(win, a, b, 6.3, 1.0, 12.5, 18.0, 0.06, 5)
    pointedOn(brick, a, b, 6.3, 1.5, 0, 4.4, 0.08, 5)
  }
  // Stair turrets (octagonal) and the porch between them.
  for (const s of [-1, 1]) {
    const cx = -38.5, cy = s * 4.75
    const o = ngon(cx, cy, 2.3, 8)
    walls(plaster, o, 0, 16.6)
    band(plaster, o, 16.0, 16.6, 0.15)
    for (let i = 0; i < 8; i++) {
      const a = o[i], c = o[(i + 1) % 8]
      face(copper, [[a[0], a[1], 16.6], [c[0], c[1], 16.6], [cx, cy, 20.0]], [(a[0] + c[0]) / 2 - cx, (a[1] + c[1]) / 2 - cy, 1])
    }
    for (const z of [5, 10.5]) {
      const [a, c] = [o[3], o[4]]
      rectOn(win, a, c, along(a, c).L / 2, 0.25, z, z + 1.2, 0.05)
    }
  }
  walls(plaster, [[-37.4, 2.7], [-39.3, 2.7], [-39.3, -2.7], [-37.4, -2.7]], 0, 9.0)
  face(copper, [[-39.6, -2.7, 8.8], [-37.4, -2.7, 10.2], [-37.4, 2.7, 10.2], [-39.6, 2.7, 8.8]], [-0.6, 0, 1])
  face(plaster, [[-39.3, -2.7, 9.0], [-37.4, -2.7, 9.0], [-37.4, -2.7, 10.2]], [0, -1, 0])
  face(plaster, [[-39.3, 2.7, 9.0], [-37.4, 2.7, 9.0], [-37.4, 2.7, 10.2]], [0, 1, 0])
  archOn(brick, [-39.3, 2.7], [-39.3, -2.7], 2.7, 1.1, 0, 3.6, 0.06, 6)

  // Upper shaft.
  const TX = -32.4, TY = 0, H = 5.0, ZG = 56.2
  const shaft = rect(TX - H, TY - H, TX + H, TY + H)
  walls(plaster, shaft, 37.5, ZG)
  bbox(plaster, null, TX - H - 0.2, TY - H - 0.2, TX + H + 0.2, TY + H + 0.2, 46.4, 47.0, 0.1)
  bbox(plaster, null, TX - H - 0.2, TY - H - 0.2, TX + H + 0.2, TY + H + 0.2, 53.4, 54.0, 0.1)
  for (const [a, b] of segsOf(shaft)) {
    clock(plaster, win, gold, a, b, H, 43.6, 1.75, 2.0, 0.6)
    for (const d of [-1.5, 1.5]) pointedOn(win, a, b, H + d, 0.55, 48.3, 51.4, 0.06, 4)
  }
  // The gallery: a projecting floor slab, posts and a rail.
  const G = H + 1.0
  bbox(plaster, plaster, TX - G, TY - G, TX + G, TY + G, 55.4, ZG, 0.25)
  for (const [a, b] of segsOf(rect(TX - G + 0.15, TY - G + 0.15, TX + G - 0.15, TY + G - 0.15))) {
    const { L, P } = along(a, b)
    for (let k = 0; k < 6; k++) {
      const p = P((L * k) / 6, 0, 0)
      bbox(copper, null, p[0] - 0.07, p[1] - 0.07, p[0] + 0.07, p[1] + 0.07, ZG, ZG + 1.15, 0.02)
    }
  }
  {
    const r = rect(TX - G + 0.15, TY - G + 0.15, TX + G - 0.15, TY + G - 0.15)
    band(copper, r, ZG + 1.05, ZG + 1.2, 0.04, true)
    walls(copper, [...r].reverse(), ZG + 1.05, ZG + 1.2)
    // a lower rail
    band(copper, r, ZG + 0.45, ZG + 0.53, 0.03, true)
  }
  // The keeper's room above the gallery.
  const H2 = 4.3
  walls(plaster, rect(TX - H2, TY - H2, TX + H2, TY + H2), ZG, 59.6)
  for (const [a, b] of segsOf(rect(TX - H2, TY - H2, TX + H2, TY + H2))) for (const d of [-2.4, 0, 2.4]) archOn(win, a, b, H2 + d, 0.45, 57.0, 58.4, 0.06, 4)
  bbox(plaster, null, TX - H2 - 0.3, TY - H2 - 0.3, TX + H2 + 0.3, TY + H2 + 0.3, 59.2, 59.8, 0.15)

  // The copper crown: hood, four clock dormers, open lantern, onion,
  // spire, ball and double cross.
  const P8 = Math.PI / 8
  lathe(copper, TX, TY, [[4.55, 59.8], [4.7, 60.3], [4.5, 61.4], [3.95, 62.9], [3.05, 64.6], [2.3, 65.9], [2.05, 66.6], [0, 66.6]], 8, P8)
  for (const [ux, uy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
    const vx = -uy, vy = ux, w = 1.5, f = 4.45, back = 2.4, z0 = 60.2, z1 = 63.7, zt = 64.6
    const Pt = (s: number, d: number, z: number): V3 => [TX + ux * d + vx * s, TY + uy * d + vy * s, z]
    const fr: V3[] = [Pt(-w, f, z0), Pt(w, f, z0), Pt(w, f, z1), Pt(w * 0.5, f, zt - 0.15), Pt(0, f, zt), Pt(-w * 0.5, f, zt - 0.15), Pt(-w, f, z1)]
    face(copper, fr, [ux, uy, 0])
    face(copper, [Pt(-w, f, z0), Pt(-w, back, z0), Pt(-w, back, z1), Pt(-w, f, z1)], [-vx, -vy, 0])
    face(copper, [Pt(w, back, z0), Pt(w, f, z0), Pt(w, f, z1), Pt(w, back, z1)], [vx, vy, 0])
    face(copper, [Pt(-w, f, z1), Pt(-w * 0.5, f, zt - 0.15), Pt(-w * 0.5, back, zt - 0.15), Pt(-w, back, z1)], [-vx, -vy, 1])
    face(copper, [Pt(-w * 0.5, f, zt - 0.15), Pt(0, f, zt), Pt(0, back, zt), Pt(-w * 0.5, back, zt - 0.15)], [-vx * 0.3, -vy * 0.3, 1])
    face(copper, [Pt(0, f, zt), Pt(w * 0.5, f, zt - 0.15), Pt(w * 0.5, back, zt - 0.15), Pt(0, back, zt)], [vx * 0.3, vy * 0.3, 1])
    face(copper, [Pt(w * 0.5, f, zt - 0.15), Pt(w, f, z1), Pt(w, back, z1), Pt(w * 0.5, back, zt - 0.15)], [vx, vy, 1])
    const a: XY = [TX + ux * f - vx * w, TY + uy * f - vy * w], b: XY = [TX + ux * f + vx * w, TY + uy * f + vy * w]
    clock(plaster, win, gold, a, b, w, 62.0, 1.25, 2.0, 0.6)
  }
  // Lantern: base ring, eight posts round a dark core, top ring.
  lathe(copper, TX, TY, [[2.15, 66.5], [2.15, 66.9], [0, 66.9]], 8, P8)
  for (let i = 0; i < 8; i++) {
    const t = P8 + (i * Math.PI) / 4
    post(copper, copper, TX + 1.8 * Math.cos(t), TY + 1.8 * Math.sin(t), 0.17, 66.9, 70.2, t)
  }
  lathe(win, TX, TY, [[0.95, 66.9], [0.95, 70.2], [0, 70.2]], 8, P8)
  lathe(copper, TX, TY, [[2.2, 70.15], [2.3, 70.6], [0, 70.6]], 8, P8)
  // Onion and spire.
  lathe(copper, TX, TY, [[2.15, 70.6], [2.4, 71.3], [2.05, 72.3], [1.05, 73.2], [0.62, 73.7], [0, 73.7]], 8, P8)
  lathe(copper, TX, TY, [[0.78, 73.7], [0.62, 76.0], [0.12, 87.9], [0, 88.0]], 8, P8)
  ball(gold, TX, TY, 88.45, 0.48, 8)
  // The double ("papal") cross, turned across the wind (north-south).
  bbox(gold, gold, TX - 0.07, TY - 0.07, TX + 0.07, TY + 0.07, 88.9, 91.0, 0.02)
  bbox(gold, gold, TX - 0.07, TY - 0.55, TX + 0.07, TY + 0.55, 89.75, 89.93, 0.02)
  bbox(gold, gold, TX - 0.07, TY - 0.38, TX + 0.07, TY + 0.38, 90.35, 90.5, 0.02)

  const floodTower = (p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : p[0] < -26 ? 1 : 0.35)
  return [
    { part: plaster, material: { ...finish('st-peter-plaster', 0xe7e3da), floodlight: floodTower } },
    { part: brick, material: finish('st-peter-brick', 0xab6a55) },
    { part: tile, material: finish('st-peter-tile', 0xc8694a) },
    { part: copper, material: { ...finish('st-peter-copper', 0x6c9f8a), floodlight: (p: V3, n: V3) => (p[0] < -26 && p[2] > 55 ? 0.8 : 0) } },
    { part: win, material: { ...PALETTE.window } },
    { part: gold, material: finish('st-peter-gilt', 0xd8ad45, 0.45) },
  ]
}

if (import.meta.main) await save('munich-st-peter', 'St. Peter', [48.136473, 11.576031], 14, build(), 6500)
