/**
 * National Constitution Center (2003, Pei Cobb Freed & Partners, Henry N.
 * Cobb), 525 Arch Street, Philadelphia — original procedural geometry,
 * CC0-1.0.
 * bun generators/phl-national-constitution-center.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/40083914,
 * 39.953720,-75.149083. Its east wall on 5th Street runs at 9.8°, so the
 * catalog bearing is 9.8: -y is the main front facing south down
 * Independence Mall toward Independence Hall, +y Race Street, -x 6th Street.
 *
 * Identity, in order: a long, low, pale limestone block closing the north
 * end of the Mall; its south front a deep limestone canopy slab carried
 * across a recessed two-storey glass hall, with a balcony slab and a
 * ground-floor colonnade under it, ending on the east in a solid limestone
 * block engraved "We the People"; the set-back chevron-shaped attic over
 * the middle (it carries the "NATIONAL CONSTITUTION CENTER" letters) with
 * its triangular glass skylights; the low glazed wing running south along
 * 6th Street to the tall square limestone portal at 6th and Arch. At night the glass hall glows.
 *
 * Evidence:
 *  - plan: OSM outline way/40083914 with parts way/335387043 (main block,
 *    3 levels), 333316197 (attic, 4 levels, a chevron 25 m across),
 *    338020144-338020147 (four triangular skylights, "pyramidal"),
 *    338029304 (the wedge-shaped wing along 6th Street, 1 level),
 *    338029305 (the portal, 2 levels) and 1314909585 (a small corner part).
 *    Turned to 9.8° the main block is 85 m along its south front and 116 m
 *    deep, its west side on the courtyard following OSM's curve.
 *  - heights: lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown
 *    2015), 1 m grid, above the lowest ground under the footprint (6th
 *    Street, ~3.3 m over the box's ground_min): roof and parapet 15.6-16.0,
 *    attic 20.6, skylight peaks 22.6, wing 6.6, portal 11.5 m. The Mall
 *    lawn in front of the south front is ~1.6 m above that, so the south
 *    front's openings start 1.6 m up. The lidar sits ~1-2 m south of OSM;
 *    OSM is kept. NAIP shows the wing's diagonal east edge as OSM has it
 *    (the lidar's returns east of it are the Mall's trees).
 *  - the south front, scaled on Netagert's straight-on photo against the
 *    lidar's 14.3 m from the lawn to the roof and OSM's 85 m front: the
 *    "We the People" block the east 18.5 m; the canopy slab from 13.6 m up,
 *    carried 5 m clear of the recessed wall; the glass hall 25 m wide from
 *    6.7 to 12.2 m; the balcony slab 4.9-6.7 m; the ground floor's piers
 *    on ~7 m centres; the attic set back 6 m. The inscription's position and
 *    size from Jeffrey M. Vinocur's close photo: "We the People" ~7.9 m
 *    long, its capitals ~2.2 m, in the upper middle of the block.
 *  - colours, from the daylight photos: pale buff limestone (palette
 *    stone), the same stone a shade darker on the recessed wall and soffits
 *    under the canopy (they are in deep shadow in every photo), dark
 *    reflective glass (palette window), the inscription's dark grey, a flat
 *    grey roof, the skylights' pale glass.
 *
 * Photos (Wikimedia Commons): National_Constitution_Center_Front.jpg
 * (Housefinch1787, CC BY-SA 4.0); NationalConstitutionCenterPH.jpg
 * (Netagert, CC BY-SA 3.0); National_Constitution_Center.jpg (grenavitar,
 * CC0); National_Constitution_Center_-_panoramio.jpg (4net, CC BY 3.0);
 * National_Constitution_Center-exterior.jpg (Jeffrey M. Vinocur, CC BY 2.5;
 * the inscription); National_Constitution_Center_from_southwest.jpg and
 * _from_Arch_Street.jpg and _walkway.jpg (Beyond My Ken, CC BY-SA 4.0; the
 * 6th Street wing and the portal); National_Constitution_Center_2.jpg
 * (lukemcurley, CC BY-SA 3.0); National_Constitution_Center_(53572938645)
 * .jpg and _-_2_(53586570586).jpg (ajay_suresh, CC BY 2.0); 2012-07_ncc_01
 * .JPG and _04.JPG (Ziko van Dijk, CC BY-SA 3.0); Center_City_East,
 * _Philadelphia,_PA,_USA_-_panoramio_(16).jpg (Андрей Бобровский, CC BY
 * 3.0). USGS NAIP for the plan and the skylights. No commercial imagery.
 *
 * Lettering: "We the People" is carved into the stone and is the
 * building's best-known feature, so it is drawn as flush dark strokes with
 * generators/lettering.ts, its blackletter capitals traced from Vinocur's
 * photo as a simplified calligraphic hand. Left out: the pale grey granite
 * courses that band the limestone every ~3.3 m, the Preamble's three
 * lines of small script under it, and the attic's bronze "NATIONAL
 * CONSTITUTION CENTER" capitals (too small to read on the map).
 *
 * Doubts: the south front is straight in plan (OSM, NAIP and every photo);
 * the curve is the west face of the north block on the courtyard and the
 * Grand Hall's curved balcony inside. The north (Race Street) and east
 * (5th Street) fronts have few open photos: they are drawn as banded
 * limestone with a glazed ground storey, after the two close photos of the
 * 5th Street entrance. The portal's piers are placed from Beyond My Ken's
 * south-west photo and the lidar's square top.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, parapetRoof, save, walls, type XY } from './chi-aon-center'
import { bbox, face, rectOn } from './phl-independence-hall'
import { Pen, strokes } from './lettering'

type Seg = [XY, XY]
const len2 = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])

/** "We the People", simplified from the carved blackletter; cap height 1. */
function weThePeople(): Pen {
  const pen = new Pen()
  const e = (o: number) => pen.moveTo([o + 0.02, 0.2]).lineTo([o + 0.2, 0.29]).quadTo([o + 0.21, 0.47], [o + 0.08, 0.44]).quadTo([o - 0.03, 0.38], [o + 0.0, 0.14]).quadTo([o + 0.06, -0.03], [o + 0.23, 0.06])
  // W, with its leading hairline flourish
  pen.moveTo([-0.1, 0.8]).quadTo([0.0, 1.02], [0.06, 0.95]).lineTo([0.16, 0.0]).lineTo([0.3, 0.72]).lineTo([0.44, 0.0]).lineTo([0.6, 0.98])
  e(0.68)
  // t, h, e
  pen.moveTo([1.1, 0.72]).lineTo([1.08, 0.06]).quadTo([1.1, -0.03], [1.21, 0.05])
  pen.moveTo([1.0, 0.44]).lineTo([1.2, 0.46])
  pen.moveTo([1.33, 1.0]).lineTo([1.31, 0.0])
  pen.moveTo([1.32, 0.3]).quadTo([1.42, 0.52], [1.52, 0.38]).lineTo([1.51, 0.0])
  e(1.6)
  // P, e, o, p, l, e
  pen.moveTo([2.06, 0.96]).lineTo([2.0, -0.14])
  pen.moveTo([1.9, 0.86]).cubicTo([2.2, 1.12], [2.55, 0.85], [2.03, 0.5])
  e(2.38)
  pen.circle([2.78, 0.22], 0.13, 0.22, 12)
  pen.moveTo([3.0, 0.45]).lineTo([2.98, -0.35])
  pen.moveTo([2.99, 0.36]).cubicTo([3.28, 0.56], [3.3, -0.02], [2.99, 0.07])
  pen.moveTo([3.43, 1.0]).lineTo([3.41, 0.06]).quadTo([3.43, -0.03], [3.54, 0.05])
  e(3.6)
  return pen
}

function build() {
  const stone = new Part(), shade = new Part(), win = new Part(), roof = new Part(), ink = new Part(), sky = new Part()

  const YS = -43.8, REC = -38.9, BLK = 25.2, XW = -41.6
  const G = 1.6 // the Mall lawn's height over y = 0, along the south front
  const ROOF = 15.9, SOFF = 13.6
  // Main block, counter-clockwise from the south-west corner (OSM, turned).
  const east: XY[] = [[43.7, YS], [35.1, -26.3], [35.1, 33.4], [36.7, 39.1], [37.1, 44.6], [36.3, 49.8], [35.2, 53.4], [34.2, 71.6]]
  const westN: XY[] = [[-31.7, 71.8], [-22.6, 54.3], [-15.8, 54.2], [-17.1, 50.5], [-17.8, 46.1], [-17.9, 41.4], [-17.3, 37.5], [-16.3, 34.1], [-14.1, 29.4], [-11.1, 25.2], [-5.9, 20.7], [-7.9, 16.6], [-20.5, -10.1], [-41.5, -10.0]]
  const full: XY[] = [[XW, YS], [BLK, YS], ...east, ...westN]
  const lower: XY[] = [[XW, REC], [BLK, REC], [BLK, YS], ...east, ...westN]

  // The recessed wall under the canopy is drawn in a shaded stone, so the
  // canopy reads as the deep overhang it is (as the photos' shadow shows).
  for (let i = 0; i < lower.length; i++) {
    const a = lower[i], b = lower[(i + 1) % lower.length]
    walls(a[1] === REC && b[1] === REC ? shade : stone, [a, b], 0, SOFF)
  }
  walls(stone, full, SOFF, ROOF - 0.6)
  parapetRoof(stone, roof, full, ROOF, 0.5, 0.7)
  walls(stone, full, ROOF - 0.6, ROOF)
  // The canopy's soffit over the recess.
  face(shade, [[XW, YS, SOFF], [BLK, YS, SOFF], [BLK, REC, SOFF], [XW, REC, SOFF]], [0, 0, -1])

  // ------------------------------------------------------ the south front
  const rec: Seg = [[XW, REC], [BLK, REC]]
  const at = (x: number) => x - XW
  // Glass hall: two storeys of glass with a few pale mullions and a transom.
  rectOn(win, rec[0], rec[1], at(6.1), 12.7, G + 5.1, G + 10.6, 0.05)
  for (let k = 1; k < 6; k++) rectOn(shade, rec[0], rec[1], at(-6.6 + (25.4 * k) / 6), 0.09, G + 5.1, G + 10.6, 0.08)
  rectOn(shade, rec[0], rec[1], at(6.1), 12.7, G + 7.9, G + 8.05, 0.08)
  // Balcony slab across the hall and the ground floor's piers and glass.
  bbox(stone, stone, -19.2, REC - 1.7, 20.6, REC, G + 3.3, G + 5.1, 0.12)
  face(shade, [[-19.2, REC - 1.7, G + 3.3], [20.6, REC - 1.7, G + 3.3], [20.6, REC, G + 3.3], [-19.2, REC, G + 3.3]], [0, 0, -1])
  rectOn(win, rec[0], rec[1], at(1.0), 20.0, G + 0.3, G + 3.3, 0.05)
  for (const x of [-12.1, -4.9, 2.2, 9.4, 16.4]) bbox(stone, null, x - 0.6, REC - 1.5, x + 0.6, REC, 0, G + 3.3, 0.06)
  // West of the hall: the upper glass band over the wing's terrace.
  rectOn(win, rec[0], rec[1], at(-24.5), 15.5, G + 7.0, G + 10.6, 0.05)
  for (const x of [-32, -24.5, -17]) rectOn(shade, rec[0], rec[1], at(x), 0.09, G + 7.0, G + 10.6, 0.08)

  // "We the People" on the east block, carved: flush dark strokes.
  {
    const S = 2.2, X0 = BLK + 1.9, Z0 = G + 9.1
    strokes(ink, weThePeople().paths, { width: 0.1, depth: 0.02, place: (u, v, w) => [X0 + u * S, YS - 0.03 - w * S, Z0 + v * S] })
  }

  // ------------------------------------------------------ the other fronts
  // West face of the south block on 6th Street and the north block's
  // courtyard faces: a long glass band under the roof, glass at the ground.
  {
    const w: Seg = [[-41.5, -10.0], [XW, REC]]
    const L = len2(w[0], w[1])
    rectOn(win, w[0], w[1], L / 2, L / 2 - 2.5, 8.4, 12.2, 0.05)
    for (let i = 0; i < westN.length - 2; i++) {
      const a = westN[i], b = westN[i + 1], l = len2(a, b)
      if (l < 3) continue
      rectOn(win, a, b, l / 2, l / 2 - 0.6, 8.4, 12.2, 0.05)
      rectOn(win, a, b, l / 2, l / 2 - 0.6, 0.5, 4.0, 0.05)
    }
    const c: Seg = [[-20.5, -10.1], [-41.5, -10.0]]
    rectOn(win, c[0], c[1], len2(c[0], c[1]) / 2, 8.5, 0.5, 4.0, 0.05)
  }
  // 5th Street and Race Street: banded limestone over a glazed ground storey.
  {
    const e: Seg = [[35.1, -26.3], [35.1, 33.4]]
    for (const [c, hw] of [[12, 9], [37, 12], [55, 3.5]] as [number, number][]) rectOn(win, e[0], e[1], c, hw, 0.6, 4.4, 0.05)
    const n: Seg = [[34.2, 71.6], [-31.7, 71.8]]
    for (const [c, hw] of [[14, 10], [44, 12]] as [number, number][]) rectOn(win, n[0], n[1], c, hw, 0.6, 4.4, 0.05)
    rectOn(win, n[0], n[1], 33, 22, 8.4, 11.2, 0.05)
  }

  // ------------------------------------------------- attic and skylights
  {
    const attic: XY[] = [[-3.6, -35.3], [9.4, -35.0], [21.6, -34.7], [15.4, -22.3], [9.0, -9.3], [15.1, 3.6], [21.1, 16.2], [8.6, 15.9], [-3.8, 15.7], [-10.4, 2.8], [-16.6, -9.5], [-10.1, -22.4]]
    const AT = 20.6
    walls(stone, attic, ROOF - 0.7, AT - 0.5)
    walls(stone, attic, AT - 0.5, AT)
    cap(roof, attic, AT)
      // Four triangular glass skylights, each a low pyramid.
    const tris: XY[][] = [
      [[-10.1, -22.4], [2.3, -22.4], [-4.4, -10.8]],
      [[-3.8, -9.3], [2.7, 2.8], [-10.4, 2.8]],
      [[3.0, 3.6], [15.1, 3.6], [8.6, 15.9]],
      [[3.2, -23.2], [9.4, -35.0], [15.4, -22.3]],
    ]
    for (const t of tris) {
      const c: XY = [(t[0][0] + t[1][0] + t[2][0]) / 3, (t[0][1] + t[1][1] + t[2][1]) / 3]
      const r = t.map(([u, v]) => [c[0] + (u - c[0]) * 0.86, c[1] + (v - c[1]) * 0.86] as XY)
      const apex: V3 = [c[0], c[1], AT + 2.0]
      for (let i = 0; i < 3; i++) {
        const a = r[i], b = r[(i + 1) % 3]
        const m: XY = [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1]]
        face(sky, [[a[0], a[1], AT], [b[0], b[1], AT], apex], [m[0], m[1], 2])
      }
    }
  }

  // ------------------------------------------------ the 6th Street wing
  {
    const WH = 6.6
    const wing: XY[] = [[-41.5, REC], [-41.4, -94.2], [-32.6, -94.2], [-15.8, -59.8], [-7.4, YS], [-7.4, REC]]
    walls(stone, wing, 0, WH - 0.5)
    walls(stone, wing, WH - 0.5, WH)
    cap(roof, wing, WH)
    // Its glazed storey along the street and on the diagonal toward the Mall.
    for (let i = 0; i < wing.length - 1; i++) {
      const a = wing[i], b = wing[i + 1], l = len2(a, b)
      if (l < 6 || (a[1] === REC && b[1] === REC)) continue
      const lift = i >= 2 ? G * 0.6 : 0
      rectOn(win, a, b, l / 2, l / 2 - 2.0, 0.6 + lift, 4.3, 0.05)
    }
    // The portal at 6th and Arch: a deep limestone lintel on four square
    // piers, open to the ground on every side (stairs and plaza under it).
    const P0 = -42.4, P1 = -32.6, Q0 = -104.6, Q1 = -94.2, TOP = 11.5, LIN = 9.3, PW = 2.3
    bbox(stone, stone, P0, Q0, P1, Q1, LIN, TOP, 0.12)
    face(shade, [[P0, Q0, LIN], [P1, Q0, LIN], [P1, Q1, LIN], [P0, Q1, LIN]], [0, 0, -1])
    for (const [x0, y0] of [[P0, Q0], [P1 - PW, Q0], [P1 - PW, Q1 - PW], [P0, Q1 - PW]]) bbox(stone, null, x0, y0, x0 + PW, y0 + PW, 0, LIN, 0.06)
  }

  const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : n[1] < -0.7 ? 0.7 : 0.35)
  return [
    { part: stone, material: { ...PALETTE.stone, floodlight: flood } },
    { part: shade, material: finish('ncc-shade', 0xb5aea3) },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('ncc-roof', 0xc2c0b9) }, // NAIP: a pale membrane roof
    { part: ink, material: finish('ncc-inscription', 0x5d5953) },
    { part: sky, material: PALETTE.glass },
  ]
}

if (import.meta.main) await save('phl-national-constitution-center', 'National Constitution Center', [39.95372, -75.149083], 9.8, build(), 5000)
