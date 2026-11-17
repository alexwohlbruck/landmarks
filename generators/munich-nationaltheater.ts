/**
 * Nationaltheater (Bavarian State Opera), Max-Joseph-Platz, Munich: Karl
 * von Fischer, 1811-18; rebuilt after the fire of 1823 by Leo von Klenze,
 * who added the Corinthian portico and the double pediment; rebuilt after
 * 1945 and reopened 1963. Original procedural geometry, CC0-1.0.
 * bun generators/munich-nationaltheater.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/23458583,
 * 48.139567, 11.579510. Its long walls run at 105.7 degrees, so the catalog
 * bearing is 15.8 and the theatre is square to this frame: -x is the
 * portico on the Max-Joseph-Platz (west-north-west), +x the back toward the
 * Marstallplatz, -y the long side on the Maximilianstraße. Symmetric about
 * y = YC = 0.1.
 *
 * Identity, in order: the temple front, eight tall Corinthian columns on a
 * broad flight of steps under the lower pediment with its figure group;
 * the second, higher pediment behind it with the gold mosaic of Pegasus
 * and the Horae, the gable of the long attic hall; the attic's row of
 * lunette windows under its green copper roof, rising from the lower green
 * roofs; the pale grey stone of the 20 m block with its heavy cornice, the
 * front wings with their arched windows, the long sides with a ground
 * floor arcade and rows of windows.
 *
 * Evidence:
 *  - plan: OSM outline way/23458583 read in the turned frame: the block
 *    x -53.25..57.65, y -28.2..28.4; the portico x -60.2..-53.25,
 *    y -17.9..18.2. The steps stand in front of the portico (outside the
 *    outline), as the photos show. The attic hall's width, +-13.9 m, is the
 *    upper pediment's width from Wilfredor's frontal photo; its length, to
 *    x +-50, from Maximilian Dörrbecker's aerial and Dguendel's view from
 *    St. Peter.
 *  - heights: none published. Scaled from Wilfredor's frontal photo
 *    (16.6 px per m on the 56.5 m front), corrected for the set-back of the
 *    portico and attic: steps 3.1 m, columns to 17.6 (diameter 1.7, eight
 *    at 4.94 m centres), entablature to 21.0, lower pediment apex 25.7,
 *    block cornice 20.4, attic eave 29.6 and upper pediment apex 35.6; the
 *    attic against the lower roofs (2.4 m rise, 7 m of attic showing)
 *    from Dguendel's photo from St. Peter. The long side's storeys from
 *    Fentriss's photo on the Maximilianstraße. The upper apex is the least
 *    certain number (two photos give 33 and 37 m).
 *  - colours from the daylight photos: pale grey render and stone, paler
 *    columns and cornices, green copper roofs, the gold mosaic.
 *  - night (Burkhard Mücke's night photo): the portico floodlit, the
 *    windows behind the columns and the doors lit.
 *  - elevation 0 (flat Max-Joseph-Platz). No lidar in Germany; no 3D city
 *    model.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Nationaltheater_München.jpg (Wilfredor, CC0): frontal; the main
 *    reference for the front.
 *  - 2019-01-26_Bayerische_Nationaltheater_03.jpg (Burkhard Mücke,
 *    CC BY-SA 4.0): the front, the attic's front lunette, the mosaic.
 *  - Nationaltheater_2014-08-02.jpg (M(e)ister Eiskalt, CC BY-SA 4.0): the
 *    portico close.
 *  - Nationaltheater_in_München.JPG (Guido Radig, CC BY 3.0): the front
 *    from the Max-Joseph-Platz.
 *  - Muemaxistrnatthea2017c99.jpg (Fentriss, CC BY-SA 4.0): the south front
 *    wing and the long side on the Maximilianstraße.
 *  - München,_St._Peter,_Blick_zum_Opernhaus_und_zur_Residenz.jpg (Dguendel,
 *    CC BY 4.0): the south flank from St. Peter: attic, lunettes, roofs.
 *  - München_-_Nationaltheater_(Luftbild).jpg (Maximilian Dörrbecker,
 *    CC BY-SA 2.5): aerial, the roofs.
 *  - 2022-08-01_Nationaltheater_München_bei_Nacht.jpg (Burkhard Mücke,
 *    CC BY-SA 4.0): night.
 * No commercial imagery, no 3D city models. No look-only sources.
 *
 * Left out: the column fluting and capitals' acanthus (drawn as plain
 * flared capitals), the inscription, the modillions, the Greek key band,
 * the mosaic's figures (drawn as a gold field), the figure group's
 * carving (bold simple figures), the lanterns before the portico.
 *
 * Doubts: the back (east) end and the north side are not photographed and
 * are drawn like the south side; the attic's back end is drawn hipped; the
 * long sides' windows are grouped two storeys to a panel.
 *
 * Uses the kit in munich-theatinerkirche.ts.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, rect, walls, cap, along, archOn, bbox, face, box, slab, statue, lathe, rectOn, pilasterOn, corniceOn, type XY } from './munich-theatinerkirche'

const YC = 0.1
const XF = -53.25, XE = 57.65, HW = 28.3 // the block
const XP = -60.2 // portico front
const AX0 = -50.0, AX1 = 28.0, AW = 13.9 // the attic hall

/** The side of a rect ring facing (nx, ny), as a counter-clockwise wall a→b. */
function sideOf(x0: number, y0: number, x1: number, y1: number, nx: number, ny: number): [XY, XY] {
  if (nx > 0) return [[x1, y0], [x1, y1]]
  if (nx < 0) return [[x0, y1], [x0, y0]]
  if (ny > 0) return [[x1, y1], [x0, y1]]
  return [[x0, y0], [x1, y0]]
}

/** A Corinthian column: base, a shaft with entasis, a flared capital and an abacus. */
function column(p: Part, x: number, y: number, z0: number, z1: number, r: number) {
  const h = z1 - z0
  lathe(p, x, y, [[r * 1.25, z0], [r * 1.25, z0 + 0.35], [r * 1.05, z0 + 0.6], [r, z0 + 0.8], [r * 0.98, z0 + 0.4 * h], [r * 0.86, z1 - 1.5], [r * 0.95, z1 - 1.2], [r * 1.35, z1 - 0.35], [r * 1.35, z1 - 0.3]], 10, Math.PI / 10)
  bbox(p, p, x - r * 1.45, y - r * 1.45, x + r * 1.45, y + r * 1.45, z1 - 0.32, z1, 0.06)
}

function build() {
  const stone = new Part(), trim = new Part(), copper = new Part(), win = new Part(), door = new Part(), gold = new Part()
  const Y = (d: number) => YC + d

  const ZC = 20.4 // block cornice
  const ZS = 3.1 // portico floor
  const ZCOL = 17.6, ZENT = 21.0, ZPED = 25.7
  const ZA0 = 22.8, ZAE = 29.6, ZAP = 35.6

  // --------------------------------------------------------------- block
  walls(stone, rect(XF, Y(-HW), XE, Y(HW)), 0, ZC - 1.0)
  bbox(trim, null, XF - 0.8, Y(-HW) - 0.8, XE + 0.8, Y(HW) + 0.8, ZC - 1.0, ZC, 0.3)
  face(trim, [[XF - 0.8, Y(-HW) - 0.8, ZC - 1.0], [XE + 0.8, Y(-HW) - 0.8, ZC - 1.0], [XE + 0.8, Y(HW) + 0.8, ZC - 1.0], [XF - 0.8, Y(HW) + 0.8, ZC - 1.0]], [0, 0, -1])
  // the frieze under the cornice, a plain band
  bbox(stone, null, XF - 0.15, Y(-HW) - 0.15, XE + 0.15, Y(HW) + 0.15, ZC - 2.2, ZC - 1.0, 0.05)
  // lower roofs, rising from the cornice to the attic hall
  {
    const o: XY[] = rect(XF - 0.5, Y(-HW) - 0.5, XE + 0.5, Y(HW) + 0.5), i: XY[] = rect(AX0, Y(-AW), AX1, Y(AW))
    for (let k = 0; k < 4; k++) {
      const l = (k + 1) % 4
      copper.quad([o[k][0], o[k][1], ZC], [o[l][0], o[l][1], ZC], [i[l][0], i[l][1], ZA0], [i[k][0], i[k][1], ZA0])
    }
  }

  // ------------------------------------------------- the long sides, back
  for (const s of [-1, 1]) {
    const [a, b] = sideOf(XF, Y(-HW), XE, Y(HW), 0, s)
    const L = XE - XF, n = 22, x0 = XF + 11.2, x1 = XE - 1.5
    for (let k = 0; k < n; k++) {
      const x = x0 + (k + 0.5) * ((x1 - x0) / n), c = s < 0 ? x - XF : XE - x
      // ground floor arcade: arched recesses with a trim archivolt
      archOn(trim, a, b, c, 1.35, 0, 3.1, 0.04, 6)
      archOn(win, a, b, c, 1.05, 0, 3.1, 0.08, 6)
      // the four storeys above, two to a panel
      rectOn(win, a, b, c, 0.72, 6.3, 11.5, 0.05)
      rectOn(win, a, b, c, 0.72, 12.6, 17.6, 0.05)
    }
    corniceOn(trim, a, b, 0, L, 5.0, 5.6, 0.3)
  }
  {
    const [a, b] = sideOf(XF, Y(-HW), XE, Y(HW), 1, 0), L = 2 * HW
    for (let k = 0; k < 11; k++) {
      const c = 2.5 + (k + 0.5) * ((L - 5) / 11)
      rectOn(door, a, b, c, 0.9, 0, 3.4, 0.05)
      rectOn(win, a, b, c, 0.62, 6.3, 11.5, 0.05)
      rectOn(win, a, b, c, 0.62, 12.6, 17.6, 0.05)
    }
    corniceOn(trim, a, b, 0, L, 5.0, 5.6, 0.3)
  }

  // ------------------------------------------------------ the front wings
  for (const s of [-1, 1]) {
    // the front face of each wing, and its return on the long side
    const [a, b] = sideOf(XF, Y(-HW), XE, Y(HW), -1, 0)
    const c = s < 0 ? 2 * HW - 4.9 : 4.9
    archOn(win, a, b, c, 1.15, 11.0, 14.6, 0.06, 8)
    archOn(trim, a, b, c, 1.45, 10.6, 14.6, 0.03, 8)
    rectOn(win, a, b, c, 1.0, 4.4, 8.4, 0.06)
    for (const d of [0.7, 9.6]) pilasterOn(stone, a, b, s < 0 ? 2 * HW - d : d, 0.7, 1.0, ZC - 2.2, 0.35)
    for (const d of [0.7, 9.6]) bbox(trim, trim, XF - 0.55, Y(s * (HW - d)) - 0.85, XF + 0.1, Y(s * (HW - d)) + 0.85, ZC - 3.4, ZC - 2.2, 0.08)
    corniceOn(trim, a, b, s < 0 ? 2 * HW - 10.4 : 0, s < 0 ? 2 * HW : 10.4, 9.4, 9.9, 0.25)
    // rusticated base: a raised plinth band
    corniceOn(stone, a, b, s < 0 ? 2 * HW - 10.4 : 0, s < 0 ? 2 * HW : 10.4, 0, 1.0, 0.25)
    const [sa, sb] = sideOf(XF, Y(-HW), XE, Y(HW), 0, s)
    const cc = s < 0 ? 4.9 : XE - XF - 4.9
    archOn(win, sa, sb, cc, 1.15, 11.0, 14.6, 0.06, 8)
    archOn(trim, sa, sb, cc, 1.45, 10.6, 14.6, 0.03, 8)
    rectOn(win, sa, sb, cc, 1.0, 4.4, 8.4, 0.06)
  }

  // ------------------------------------------------------------ portico
  const PW = 18.3
  box(stone, XP, Y(-PW), XF, Y(PW), 0, ZS)
  // steps in front, across the portico and a little beyond
  {
    const N = 13, rise = ZS / N, tread = 0.34
    for (let k = 0; k < N; k++) box(stone, XP - (k + 1) * tread, Y(-19.9), XP, Y(19.9), 0, ZS - k * rise)
  }
  // the wall behind the columns: arched windows over doors, pilasters
  {
    const [a, b] = sideOf(XF, Y(-PW), XE, Y(PW), -1, 0), L = 2 * PW
    for (let k = 0; k < 7; k++) {
      const c = L / 2 + (k - 3) * 4.94
      archOn(win, a, b, c, 1.0, 11.6, 14.8, 0.06, 8)
      rectOn(door, a, b, c, 0.95, ZS, ZS + 4.6, 0.06)
      rectOn(trim, a, b, c, 1.2, ZS + 4.6, ZS + 5.1, 0.08)
    }
    for (let k = 0; k < 8; k++) pilasterOn(stone, a, b, L / 2 + (k - 3.5) * 4.94, 0.7, ZS, ZCOL, 0.25)
    corniceOn(trim, a, b, 0, L, 9.4, 9.9, 0.2)
  }
  for (let k = 0; k < 8; k++) column(trim, XP + 1.15, Y((k - 3.5) * 4.94), ZS, ZCOL, 0.85)
  // the entablature: architrave and frieze, the cornice
  const EX = XP + 0.25
  box(trim, EX, Y(-PW - 0.2), XF + 0.4, Y(PW + 0.2), ZCOL, ZENT - 0.9, true)
  bbox(trim, trim, EX - 0.6, Y(-PW - 0.8), XF + 0.4, Y(PW + 0.8), ZENT - 0.9, ZENT, 0.3)
  face(trim, [[EX - 0.6, Y(-PW - 0.8), ZENT - 0.9], [XF + 0.4, Y(-PW - 0.8), ZENT - 0.9], [XF + 0.4, Y(PW + 0.8), ZENT - 0.9], [EX - 0.6, Y(PW + 0.8), ZENT - 0.9]], [0, 0, -1])
  // the lower pediment: tympanum, raking cornices, its roof back to the attic
  {
    const a: XY = [EX + 0.4, Y(PW)], b: XY = [EX + 0.4, Y(-PW)] // facing -x, s from +y
    slab(stone, a, b, [[0, ZENT], [2 * PW, ZENT], [PW, ZPED - 0.5]], 0.25, 0, stone, false)
    slab(trim, a, b, [[PW, ZPED], [-0.8, ZENT], [-0.1, ZENT - 0.05], [PW, ZPED - 0.75]], 1.1, 0, trim, false)
    slab(trim, a, b, [[PW, ZPED], [PW, ZPED - 0.75], [2 * PW + 0.1, ZENT - 0.05], [2 * PW + 0.8, ZENT]], 1.1, 0, trim, false)
    // the pediment's roof, two slopes back to the attic
    const xa = EX - 0.7, xb = AX0
    face(copper, [[xa, Y(-PW - 0.8), ZENT], [xb, Y(-PW - 0.8), ZENT], [xb, YC, ZPED], [xa, YC, ZPED]], [0, -1, 3])
    face(copper, [[xa, Y(PW + 0.8), ZENT], [xb, Y(PW + 0.8), ZENT], [xb, YC, ZPED], [xa, YC, ZPED]], [0, 1, 3])
    // the figure group (Brenninger, 1972): Apollo and the Muses
    const P = along(a, b).P
    const figs: [number, number][] = [[0, 3.6], [-2.3, 2.9], [2.3, 2.9], [-4.6, 2.7], [4.6, 2.7], [-6.9, 2.3], [6.9, 2.3], [-9.2, 1.9], [9.2, 1.9]]
    for (const [d, h] of figs) {
      const q = P(PW + d, ZENT, 0.75)
      statue(trim, q[0], q[1], ZENT, h, Math.PI, 5)
    }
  }

  // ---------------------------------------------------------- attic hall
  walls(stone, rect(AX0, Y(-AW), AX1, Y(AW)), ZA0 - 0.6, ZAE - 0.8)
  bbox(trim, null, AX0 - 0.45, Y(-AW) - 0.45, AX1 + 0.45, Y(AW) + 0.45, ZAE - 0.8, ZAE, 0.2)
  for (const s of [-1, 1]) {
    const [a, b] = sideOf(AX0, Y(-AW), AX1, Y(AW), 0, s), L = AX1 - AX0, n = 8
    for (let k = 0; k < n; k++) {
      const c = (k + 0.5) * (L / n)
      archOn(win, a, b, c, 1.75, 24.6, 24.6, 0.06, 8)
      archOn(trim, a, b, c, 2.05, 24.35, 24.35, 0.03, 8)
      if (k > 0) pilasterOn(stone, a, b, k * (L / n), 0.35, ZA0, ZAE - 0.8, 0.15)
    }
  }
  {
    const [a, b] = sideOf(AX0, Y(-AW), AX1, Y(AW), -1, 0)
    archOn(win, a, b, AW, 2.5, 25.4, 25.4, 0.06, 10)
    archOn(trim, a, b, AW, 2.85, 25.1, 25.1, 0.03, 10)
  }
  // roof: gable to the front (the upper pediment), hipped at the back
  {
    const o = 0.45, ya = Y(-AW - o), yb = Y(AW + o), xa = AX0 - 0.2, xb = AX1 + o, h = AW + o
    const ridgeEnd = xb - h * 0.9
    face(copper, [[xa, ya, ZAE], [xb, ya, ZAE], [ridgeEnd, YC, ZAP - 0.2], [xa, YC, ZAP - 0.2]], [0, -1, 2])
    face(copper, [[xb, yb, ZAE], [xa, yb, ZAE], [xa, YC, ZAP - 0.2], [ridgeEnd, YC, ZAP - 0.2]], [0, 1, 2])
    face(copper, [[xb, ya, ZAE], [xb, yb, ZAE], [ridgeEnd, YC, ZAP - 0.2]], [1, 0, 1])
    face(copper, [[xa, ya, ZAE], [xb, ya, ZAE], [xb, yb, ZAE], [xa, yb, ZAE]], [0, 0, -1])
    // the upper pediment: the gold mosaic in a stone frame
    const a: XY = [AX0 - 0.1, Y(AW)], b: XY = [AX0 - 0.1, Y(-AW)]
    slab(gold, a, b, [[0.6, ZAE + 0.35], [2 * AW - 0.6, ZAE + 0.35], [AW, ZAP - 0.95]], 0.12, 0, gold, false)
    slab(stone, a, b, [[-0.4, ZAE], [2 * AW + 0.4, ZAE], [2 * AW + 0.4, ZAE + 0.35], [-0.4, ZAE + 0.35]], 0.3, 0, stone, false)
    slab(trim, a, b, [[AW, ZAP], [-0.6, ZAE], [0.2, ZAE], [AW, ZAP - 0.8]], 0.8, 0, trim, false)
    slab(trim, a, b, [[AW, ZAP], [AW, ZAP - 0.8], [2 * AW - 0.2, ZAE], [2 * AW + 0.6, ZAE]], 0.8, 0, trim, false)
    face(stone, [[AX0 - 0.1, Y(-AW), ZAE], [AX0 - 0.1, Y(AW), ZAE], [AX0 - 0.1, YC, ZAP - 0.3]], [-1, 0, 0])
    // a slender mast on the apex, as in every photo
    box(copper, AX0 - 0.3, YC - 0.06, AX0 - 0.18, YC + 0.06, ZAP, ZAP + 4.5)
  }

  const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : p[0] < XF + 1 || p[2] > ZC ? 1 : 0.35)
  return [
    { part: stone, material: { ...finish('nationaltheater-stone', 0xdedbd2), floodlight: flood } },
    { part: trim, material: { ...finish('nationaltheater-trim', 0xf0ece2), floodlight: flood } },
    { part: copper, material: finish('nationaltheater-copper', 0x82ab9b) },
    { part: win, material: PALETTE.window },
    { part: door, material: { ...PALETTE.entrance, color: 0x6b655b } }, // dark doors by day, lit at night
    { part: gold, material: finish('nationaltheater-mosaic', 0xd6b35c) },
  ]
}

if (import.meta.main) await save('munich-nationaltheater', 'Nationaltheater', [48.139567, 11.57951], 15.8, build(), 6500)
