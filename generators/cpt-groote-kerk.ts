/**
 * Groote Kerk (the Dutch Reformed "Great Church"; rebuilt 1836-41 by
 * Hermann Schutte, keeping the 1703 tower), Adderley Street, Cape Town:
 * original procedural geometry, CC0-1.0.
 * bun generators/cpt-groote-kerk.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/48801576,
 * lng 18.4209280, lat -33.9247652. Its walls run at 40.4 / 130.4 degrees;
 * the catalog bearing is 310.4, so in the model +y is the front on Adderley
 * Street (facing north-west), -y the back on Church Square (south-east), -x
 * the Bureau Street side (south-west) and +x the north-east side with the
 * old tower.
 *
 * Identity, in order: the broad hall with a classical pediment at each end,
 * and behind each pediment the stepped gable with its row of pinnacles that
 * stands above the roof; tall pointed (neo-Gothic) windows in white
 * surrounds between plain pilasters, five to the front; the pointed door in
 * the middle of the front; the cross arms with their own stepped gables
 * half-way down the sides, and the long low annex along the sides with its
 * row of small round-headed windows; the old tower beside the north-east
 * corner: a plain grey shaft with louvred openings, a white cornice, the
 * clock stage with a dial on each face, and the dark bell-cast slate spire
 * with ball and vane. Grey walls, white trim.
 *
 * Evidence:
 *  - plan: OSM way/48801576 (measured): 26.8 m across the ends, 44.3 m
 *    long; a 7.2 x 9.4 m block standing out from the middle of the
 *    north-east side (x 12.4..19.7, y -4.1..5.3), drawn as a lower vestry
 *    block. No parts, no heights. The outline includes the low annexes, so
 *    the hall is drawn 21.6 m wide with a 2.6 m annex each side (front.jpg:
 *    the annex shows just past the facade's south-west corner).
 *  - heights: no published height and no lidar here. Estimated from
 *    Debbie Louise Lloyd's straight-on front photo, scaled to the 21.6 m
 *    facade (43.8 px/m): cornice 11.9 m, pediment apex 15.2 m, the stepped
 *    gable to 15.8 m in the middle and its pinnacles to 16.6 m; windows from
 *    4.6 m to their points at 9.8 m with small windows under them at
 *    1.6-3.0 m; the annex about 4.8 m.
 *  - tower: not in OSM. HelenOnline's photo from Adderley Street shows it in
 *    the gap between the church's north-east corner and The Adderley
 *    (way/131399672), its face a few metres behind the church front; drawn
 *    5.0 x 5.2 m at x 12.6..17.6, y 12..17.2. Heights estimated from that
 *    photo and Ossewa's, against the church cornice: shaft and white
 *    cornice to 13.2 m, clock stage to 16.3 m, spire to 23.3 m, vane top
 *    25.5 m.
 *  - colours from the daylight photos: the walls and the tower shaft are
 *    painted a neutral mid grey (sampled #787878-#929398 on the overcast
 *    Lloyd front photo, #818382 on the side photo; the tower #697478 in
 *    shade in HelenOnline's photo, where the sunlit facade blows out to
 *    white), drawn a lighter neutral grey at the palette's lightness;
 *    white pilaster caps, cornices, pediments, copings and window
 *    surrounds; the near-black slate spire pulled to charcoal. Ossewa's
 *    older photo shows a beige-grey paint.
 *  - map terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s);
 *    the site is nearly flat. Elevation 0.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Groote_Kerk_Adderley_Street_Cape_Town_-_Frontal_view.JPG, - Back
 *    view.JPG, - Side view from the front.JPG, - Side view from the back.JPG
 *    (Debbie Louise Lloyd, CC BY-SA 3.0): the front, the back, the
 *    south-west side with the cross arm and annex.
 *  - Groote_Kerk,_Adderley_Street,_Cape_Town.JPG (Ossewa, CC BY-SA 3.0):
 *    the front with the tower.
 *  - Groote_Kerk_1.jpg (HelenOnline, CC BY-SA 4.0): the tower and the
 *    front's north-east corner from Adderley Street.
 *  - ZA-CA-Groote_Kerk.jpg (taurus, public domain): the front.
 * No commercial imagery. No look-only sources.
 *
 * Left out: the railings and gate piers (ground), the statue, the glazing
 * bars and the tracery of the window heads, the gablets round the dials,
 * the vane's figure.
 *
 * Doubts: the north-east side is hidden by The Adderley in every photo; its
 * annex and cross arm are drawn like the south-west side, and the OSM
 * block on that side is drawn as a plain 6.5 m vestry. The tower is placed
 * from photos only. The roof is not seen in any photo; it is drawn as a
 * plain gable under the stepped gables.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, rect, lathe, walls, cap, inset, rectOn, discOn, face, along, ball, wallSlab, pointedOn, gableRoof, pyramid, archOn, type XY } from './amsterdam-westerkerk'
import { boxOn, band, edges, floodWalls } from './cpt-old-town-house'

function build() {
  const wall = new Part(), trim = new Part(), roof = new Part(), win = new Part(), slate = new Part()

  const XC = 0.3, HW = 12.1, HX0 = XC - HW, HX1 = XC + HW, Y0 = -22.2, Y1 = 22.2
  const OX0 = -14.4, OX1 = 12.4 // the outline's sides: the annexes' faces
  const EAVE = 11.9, RIDGE = 14.2, PED = 15.2, ANNEX = 4.8, PL = 0.6
  const TY0 = -5.0, TY1 = 5.0 // the cross arms

  // ------------------------------------------------------------ the hall
  const hall = rect(HX0, Y0, HX1, Y1)
  walls(wall, hall, 0, EAVE)
  band(trim, hall, 0, PL, 0.06, 0.05)
  band(trim, hall, EAVE - 0.5, EAVE, 0.3)
  // The frieze band under the cornice.
  band(wall, hall, EAVE - 1.5, EAVE - 0.5, 0.12, 0.05)
  gableRoof(roof, null, HX0, Y0 + 0.8, HX1, Y1 - 0.8, EAVE, RIDGE, false, 0.3, 0)
  // The cross arms, full height, to the outline on both sides.
  for (const [x0, x1] of [[OX0, HX0 + 0.5]]) {
    const r = rect(x0, TY0, x1, TY1)
    walls(wall, r, 0, EAVE)
    band(trim, r, 0, PL, 0.06, 0.05)
    band(trim, r, EAVE - 0.5, EAVE, 0.3)
    band(wall, r, EAVE - 1.5, EAVE - 0.5, 0.12, 0.05)
  }
  gableRoof(roof, null, OX0, TY0, OX1, TY1, EAVE, 13.6, true, 0.3, 0)

  /**
   * A stepped gable standing on the end wall a→b above the cornice: steps
   * rising to the middle, a pinnacle on some of them. hw is half the wall.
   */
  const stepped = (a: XY, b: XY, hw: number, steps: [number, number][], pins: number[], back = 0.7) => {
    const zb = EAVE - 0.4, n = steps.length
    const right = steps.map(([d, z]) => [hw + d, z] as XY)
    const clean: XY[] = [[0, zb], [2 * hw, zb]]
    for (let i = 0; i < n; i++) {
      if (i > 0) clean.push([hw + steps[i][0], steps[i - 1][1]])
      clean.push([hw + steps[i][0], steps[i][1]])
    }
    for (let i = n - 1; i >= 0; i--) {
      clean.push([hw - steps[i][0], steps[i][1]])
      if (i > 0) clean.push([hw - steps[i][0], steps[i - 1][1]])
    }
    wallSlab(wall, a, b, clean, 0.5, -back - 0.5)
    // Coping on each step and the pinnacles.
    const { P } = along(a, b)
    for (let i = 0; i < right.length; i++) {
      const s1 = right[i][0], s0 = i + 1 < right.length ? right[i + 1][0] : hw
      const z = right[i][1]
      for (const [u0, u1] of [[s0, s1], [2 * hw - s1, 2 * hw - s0]]) boxOn(trim, a, b, u0 - 0.08, u1 + 0.08, z, z + 0.18, -back - 0.58, -back + 0.08)
    }
    for (const d of pins) {
      for (const s of [hw + d, hw - d]) {
        // the step height at this s
        let z = right[0][1]
        for (const [dd, zz] of steps) if (Math.abs(s - hw) <= dd + 1e-6) z = zz
        const p = P(s, z, -back - 0.25)
        const r = 0.36
        const sq: XY[] = [[p[0] - r, p[1] - r], [p[0] + r, p[1] - r], [p[0] + r, p[1] + r], [p[0] - r, p[1] + r]]
        walls(wall, sq, z, z + 0.7)
        pyramid(wall, sq, z + 0.7, [p[0], p[1], z + 3.0])
      }
    }
  }
  const steps: [number, number][] = [[HW, 12.9], [HW * 0.787, 13.6], [HW * 0.574, 14.3], [HW * 0.361, 15.0], [HW * 0.148, 15.8]]
  const HE = edges(hall) // 0 back (south), 1 north-east side, 2 front (north), 3 south-west side
  stepped(HE[2][0], HE[2][1], HW, steps, [HW * 0.213, HW * 0.509, HW * 0.815])
  stepped(HE[0][0], HE[0][1], HW, steps, [HW * 0.213, HW * 0.509, HW * 0.815])
  // Cross arms: smaller stepped gables on their ends.
  {
    const tw = (TY1 - TY0) / 2
    const ts: [number, number][] = [[tw, 12.6], [3.2, 13.3], [1.4, 14.0]]
    stepped([OX0, TY1], [OX0, TY0], tw, ts, [3.2], -0.05)
    stepped([OX1, TY0], [OX1, TY1], tw, ts, [3.2], -0.05)
  }

  // The pediments on both ends: grey tympanum, white raking cornices and the
  // horizontal cornice under it.
  for (const [a, b] of [HE[2], HE[0]]) {
    const L = 2 * HW
    const PIL = [0, 1, 2, 3, 4, 5].map((i) => 0.45 + (i * (L - 0.9)) / 5)
    wallSlab(wall, a, b, [[0.2, EAVE], [L - 0.2, EAVE], [HW, PED - 0.4]], 0.35, 0)
    const k = (PED - EAVE) / HW, t = 0.45
    wallSlab(trim, a, b, [[-0.1, EAVE - 0.1], [0.5, EAVE - 0.1], [HW, PED - 0.4 - 0.1], [HW, PED], [-0.1, EAVE + 0.35]], 0.55, 0)
    wallSlab(trim, a, b, [[L - 0.5, EAVE - 0.1], [L + 0.1, EAVE - 0.1], [L + 0.1, EAVE + 0.35], [HW, PED], [HW, PED - 0.5]], 0.55, 0)
    void k; void t
    // A pointed vent in the tympanum.
    pointedOn(trim, a, b, HW, 0.75, EAVE + 0.5, EAVE + 1.2, 0.4, 5)
    pointedOn(win, a, b, HW, 0.55, EAVE + 0.6, EAVE + 1.2, 0.44, 5)
    // Pilasters with white caps, five bays.
    for (const s of PIL) {
      boxOn(wall, a, b, s - 0.45, s + 0.45, PL, EAVE - 1.5, 0, 0.22)
      boxOn(trim, a, b, s - 0.6, s + 0.6, EAVE - 2.1, EAVE - 1.6, 0, 0.32)
    }
    // Small square panels in the frieze.
    for (const s of PIL) rectOn(trim, a, b, s, 0.32, EAVE - 1.3, EAVE - 0.7, 0.17)
    // The windows: tall pointed windows, small windows under them, the
    // pointed door in the middle with a window over it.
    for (const s of [0, 1, 3, 4].map((i) => (PIL[i] + PIL[i + 1]) / 2)) {
      pointedOn(trim, a, b, s, 1.42, 4.3, 7.8, 0.05, 6)
      pointedOn(win, a, b, s, 1.12, 4.6, 7.8, 0.09, 6)
      rectOn(trim, a, b, s, 1.0, 1.4, 3.2, 0.05)
      rectOn(win, a, b, s, 0.8, 1.6, 3.0, 0.09)
    }
    pointedOn(trim, a, b, HW, 1.42, 5.6, 7.9, 0.05, 6)
    pointedOn(win, a, b, HW, 1.12, 5.9, 7.9, 0.09, 6)
    pointedOn(trim, a, b, HW, 1.65, 0.3, 3.3, 0.05, 6)
    pointedOn(slate, a, b, HW, 1.25, 0.3, 3.3, 0.09, 6)
  }

  // ------------------------------------------------------- the annexes
  for (const [x0, x1] of [[OX0, HX0]]) {
    for (const [y0, y1] of [[-19.0, TY0], [TY1, 19.0]]) {
      const r = rect(x0, y0, x1 + (x0 < 0 ? 0.3 : -0.3) * 0, y1)
      walls(wall, r, 0, ANNEX)
      cap(roof, inset(r, 0.25), ANNEX - 0.15)
      band(trim, r, ANNEX - 0.35, ANNEX, 0.15)
      band(trim, r, 0, PL, 0.05, 0.04)
      // Small round-headed windows on the outer face.
      const out: [XY, XY] = x0 < 0 ? [[x0, y1], [x0, y0]] : [[x1, y0], [x1, y1]]
      const L = y1 - y0
      const n = Math.round(L / 2.1)
      for (let i = 0; i < n; i++) {
        const s = (i + 0.5) * (L / n)
        archOn(trim, out[0], out[1], s, 0.55, 1.4, 3.0, 0.05, 6)
        archOn(win, out[0], out[1], s, 0.38, 1.55, 3.0, 0.09, 6)
      }
    }
  }
  // The annexes' ends facing the street, with a round-headed window.
  for (const [x0, x1] of [[OX0, HX0]]) {
    for (const [y, a, b] of [[19.0, [x1, 19.0], [x0, 19.0]], [-19.0, [x0, -19.0], [x1, -19.0]]] as [number, XY, XY][]) {
      void y
      archOn(trim, a, b, (x1 - x0) / 2, 0.6, 1.4, 3.1, 0.05, 6)
      archOn(win, a, b, (x1 - x0) / 2, 0.42, 1.55, 3.1, 0.09, 6)
    }
  }

  // Tall windows down the sides above the annex roofs, between pilasters;
  // one great window in each cross arm's end.
  for (const [a, b] of [HE[1], HE[3]]) {
    const { L } = along(a, b)
    for (const yc of [17.9, 13.5, 9.1, -9.1, -13.5, -17.9]) {
      const s = a[0] > XC ? yc - Y0 : Y1 - yc
      pointedOn(trim, a, b, s, 1.3, 5.3, 7.9, 0.05, 6)
      pointedOn(win, a, b, s, 1.0, 5.6, 7.9, 0.09, 6)
    }
    for (const yc of [20.0, 15.7, 11.3, -11.3, -15.7, -20.0]) {
      const s = a[0] > XC ? yc - Y0 : Y1 - yc
      boxOn(wall, a, b, s - 0.4, s + 0.4, ANNEX, EAVE - 1.5, 0, 0.2)
      boxOn(trim, a, b, s - 0.55, s + 0.55, EAVE - 2.1, EAVE - 1.6, 0, 0.3)
    }
    void L
  }
  for (const [a, b] of [[[OX0, TY1], [OX0, TY0]], [[OX1, TY0], [OX1, TY1]]] as [XY, XY][]) {
    pointedOn(trim, a, b, 5.0, 1.6, 4.6, 8.0, 0.05, 6)
    pointedOn(win, a, b, 5.0, 1.3, 4.9, 8.0, 0.09, 6)
    rectOn(trim, a, b, 5.0, 1.0, 1.4, 3.2, 0.05)
    rectOn(win, a, b, 5.0, 0.8, 1.6, 3.0, 0.09)
  }

  // The vestry block in OSM's north-east projection.
  {
    const r: XY[] = [[OX1, -4.1], [19.6, -4.1], [19.6, 4.3], [14.6, 4.3], [14.6, 5.3], [OX1, 5.3]]
    walls(wall, r, 0, 6.5)
    band(trim, r, 6.1, 6.5, 0.15)
    cap(roof, inset(r, 0.25), 6.35)
    for (const s of [2.4, 6.0]) archOn(win, [19.6, -4.1], [19.6, 4.3], s, 0.5, 2.0, 4.0, 0.09, 6)
  }

  // ------------------------------------------------------------ the tower
  const TX0 = 12.4, TX1 = 17.4, TY0t = 15.0, TY1t = 20.2, TXC = (TX0 + TX1) / 2, TYC = (TY0t + TY1t) / 2
  const tr = rect(TX0, TY0t, TX1, TY1t)
  walls(wall, tr, 0, 12.5)
  band(trim, tr, 0, PL, 0.06, 0.05)
  band(trim, tr, 12.5, 13.2, 0.25)
  const t2 = inset(tr, 0.2)
  walls(wall, t2, 13.2, 16.0)
  band(trim, t2, 15.8, 16.3, 0.2)
  for (const [a, b] of edges(tr)) {
    const { L } = along(a, b)
    // louvred openings on the shaft
    for (const d of [-1.1, 1.1]) archOn(slate, a, b, L / 2 + d, 0.42, 9.0, 10.0, 0.06, 6)
    archOn(slate, a, b, L / 2, 0.42, 4.8, 5.8, 0.06, 6)
  }
  for (const [a, b] of edges(t2)) {
    const { L } = along(a, b)
    // the dial in its white ring, small windows either side
    discOn(trim, a, b, L / 2, 14.75, 0.95, 0.06, 14)
    discOn(slate, a, b, L / 2, 14.75, 0.75, 0.1, 14)
    for (const d of [-1.65, 1.65]) archOn(win, a, b, L / 2 + d, 0.35, 13.5, 14.1, 0.08, 5)
  }
  // The bell-cast slate spire: a flared skirt, then a straight pyramid.
  {
    const h = (TX1 - TX0) / 2 - 0.2 + 0.25, h2 = h - 0.85
    const sqr = (d: number): XY[] => [[TXC - d, TYC - d], [TXC + d, TYC - d], [TXC + d, TYC + d], [TXC - d, TYC + d]]
    const lvl = (d: number, z: number) => sqr(d).map(([x, y]) => [x, y, z] as V3)
    slate.loft([lvl(h, 16.3), lvl(h - 0.45, 16.9), lvl(h2, 17.6)])
    cap(slate, sqr(h), 16.3, false)
    pyramid(slate, sqr(h2), 17.6, [TXC, TYC, 23.3])
    lathe(trim, TXC, TYC, [[0.12, 23.0], [0.12, 23.6], [0, 23.6]], 6)
    ball(trim, TXC, TYC, 23.85, 0.3, 8)
    lathe(slate, TXC, TYC, [[0.07, 24.1], [0.07, 25.5], [0, 25.5]], 4)
    const vz = 24.6
    face(slate, [[TXC - 0.7, TYC, vz], [TXC + 0.7, TYC, vz], [TXC + 0.7, TYC, vz + 0.12], [TXC - 0.7, TYC, vz + 0.12]], [0, -1, 0])
    face(slate, [[TXC, TYC - 0.7, vz], [TXC, TYC + 0.7, vz], [TXC, TYC + 0.7, vz + 0.12], [TXC, TYC - 0.7, vz + 0.12]], [1, 0, 0])
  }

  // Heights above were read against a 21.6 m facade; the facade is 24.2 m
  // (OSM less the south-west annex), so every height is scaled by 24.2/21.6.
  for (const p of [wall, trim, roof, win, slate]) for (let i = 1; i < p.pos.length; i += 3) p.pos[i] *= 1.12
  return [
    { part: wall, material: { ...finish('groote-kerk-grey', 0xb7b6b2), floodlight: floodWalls } },
    { part: trim, material: { ...finish('groote-kerk-white', 0xf5f1e8), floodlight: floodWalls } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: slate, material: finish('groote-kerk-slate', 0x4a4f57) },
  ]
}

if (import.meta.main) await save('cpt-groote-kerk', 'Groote Kerk', [-33.9247652, 18.420928], 310.4, build())
