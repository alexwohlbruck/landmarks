/**
 * Iziko South African Museum, Company's Garden, Cape Town (the 1897
 * building, with its later wings and the 1987 planetarium): original
 * procedural geometry, CC0-1.0.
 * bun generators/cpt-iziko-museum.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/24010045,
 * lng 18.4149595, lat -33.9288842. Its walls run at 41 / 131 degrees; the
 * catalog bearing is 41, so in the model +x is the front, facing south-east
 * across the brick plaza to Government Avenue and the Company's Garden,
 * +y is north-east, -x the back on Queen Victoria Street.
 *
 * OSM maps the whole museum complex as one outline (5,700 m2, no parts),
 * so the model covers all of it: the 1897 front range in detail, the later
 * wings behind it as plain flat-roofed blocks, and the planetarium drum and
 * dome in the rounded north-west corner. `replaces` is way/24010045.
 *
 * Identity, in order: the long two-storey front in pale yellow with white
 * pilasters, quoins, string course and cornice; the white centre block with
 * three round-arched doors, three pedimented windows above and the tall
 * ornamental attic gable with three small arched windows, a pediment and a
 * finial; the big round-arched first-floor windows of the inner wings; the
 * grey slate hipped roof; behind, the planetarium's dark ribbed dome.
 *
 * Evidence:
 *  - plan: OSM outline way/24010045, read in the turned frame: front wall
 *    x 37-38.8, y -32.7..24.3 (57 m, centred on y -4.2, where OSM has a
 *    small notch at the centre block), the north-east later wing
 *    x 14..33, y 24.3..41.8, the south-east corner annex x 37..41.3,
 *    y -38.4..-32.7, the back x -37.7, and the rounded north-west corner
 *    (centre about x -24.5, y 25.5), which is the planetarium.
 *  - depth of the 1897 range: about 31 m, estimated from the postcard
 *    (pc.jpg, public domain), which shows the original block with seven
 *    bays down its side.
 *  - heights: none published. Estimated from isam.jpg and atcg.jpg (straight
 *    on, from the plaza about 60 m away), scaled to the three-bay centre
 *    block at about 11 m wide: floor about 1.8 m above the plaza (the
 *    steps), cornice 12-13 m, hip ridge about 18 m, attic gable apex 18.9 m
 *    and finial 20.4 m. The planetarium drum about 7 m and the dome to
 *    about 17 m (plan.jpg, in proportion to the drum width taken from the
 *    OSM curve). The later blocks 13 m (three storeys in plan.jpg).
 *  - bays: three to the centre block, six to each wing (the inner three
 *    with round-arched upper windows), from isam, atcg, jeh and pano.
 *  - colour: pale yellow render with white dressings (daylight photos),
 *    grey slate, the planetarium's dark bronze ribbed dome, cream concrete
 *    for the later blocks.
 *  - map terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s);
 *    no lidar in South Africa. The site rises to the south-west; the front
 *    stands up a flight of steps from the plaza. Elevation 0.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Iziko_South_Africa_Museum.JPG (Discott, CC BY-SA 3.0) "isam": the
 *    front straight on from the plaza.
 *  - Iziko_South_African_Museum_at_the_Company's_Gardens.JPG (Lara van Dyk,
 *    CC BY-SA 3.0) "atcg": the front, wider.
 *  - Iziko_South_African_Museum.JPG (Josephou, CC BY-SA 3.0): the front.
 *  - Iziko_South_African_Museum_Panorama.jpg (Nkansahrexford, CC BY 3.0)
 *    "pano": the whole front.
 *  - Iziko_SA_museum_CT_jeh_HDR.jpg (Jim.henderson, CC BY-SA 4.0) "jeh": the
 *    front at an angle from the north-east.
 *  - Company_Gardens._SA_Museum_Entrance.jpg and Company_Gardens._SA_Museum
 *    .jpg (Chris Snelling, CC BY-SA 3.0): the centre block and attic.
 *  - South_African_Museum_&_Planeterium.JPG (Josephou, CC BY-SA 3.0) "plan":
 *    the planetarium and the later block from the street.
 *  - South_African_Museum_postcard.jpg (unknown author, public domain) "pc":
 *    the 1897 building before the later wings.
 *  - Iziko_South_African_Museum_in_July,_2018_-_15.jpg (Jnanaranjan Sahu,
 *    CC BY-SA 4.0): the front from the south-east.
 * No commercial imagery. No look-only sources.
 *
 * Left out: carving, window glazing bars, the steps and terrace (ground),
 * the gate piers, statues and lamps.
 *
 * Doubts: the back and the inner courts of the complex are not seen in any
 * photo; the later blocks are drawn plain and flat-roofed. The 1897 range's
 * depth and the planetarium's size are estimated. The front's two halves
 * differ by 1.5 m in OSM; the model is drawn symmetric about the centre
 * block, as the photos show.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, rect, walls, cap, inset, block, lathe, type XY } from './chi-aon-center'
import { face, along, rectOn, archOn, pedimentOn } from './phl-independence-hall'
import { hipRoof, pyramid } from './amsterdam-westerkerk'

const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.85)

function build() {
  const yellow = new Part(), white = new Part(), roof = new Part(), win = new Part(), dome = new Part(), conc = new Part()

  const box = (p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top: Part | null = p, bev = 0.2) =>
    block(p, top, rect(x0, y0, x1, y1), z0, z1, bev)
  /** A strip proud of wall a→b (pilaster, band), s0..s1, z0..z1, d deep. */
  const strip = (p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, d: number) => {
    const { P, n, u } = along(a, b)
    face(p, [P(s0, z0, d), P(s1, z0, d), P(s1, z1, d), P(s0, z1, d)], [n[0], n[1], 0])
    face(p, [P(s0, z0, 0), P(s0, z0, d), P(s0, z1, d), P(s0, z1, 0)], [-u[0], -u[1], 0])
    face(p, [P(s1, z0, d), P(s1, z0, 0), P(s1, z1, 0), P(s1, z1, d)], [u[0], u[1], 0])
    face(p, [P(s0, z1, 0), P(s0, z1, d), P(s1, z1, d), P(s1, z1, 0)], [0, 0, 1])
  }

  const EAVE = 13.0, RIDGE = 18.0
  /** Bands common to every 1897 wall: plinth, string course, cornice. */
  const bands = (a: XY, b: XY) => {
    const { L } = along(a, b)
    strip(white, a, b, 0, L, 0, 1.8, 0.2)
    strip(white, a, b, 0, L, 6.4, 6.9, 0.15)
    strip(white, a, b, 0, L, 12.0, EAVE, 0.45)
  }
  /** One bay of the 1897 wings: pilasters, a ground-floor pair, an upper window. */
  const bay = (a: XY, b: XY, c: number, w: number, arched: boolean) => {
    strip(white, a, b, c - w / 2 - 0.3, c - w / 2 + 0.3, 1.8, 12.0, 0.12)
    rectOn(white, a, b, c, 1.2, 2.4, 5.8, 0.03)
    rectOn(win, a, b, c - 0.5, 0.38, 2.7, 5.5, 0.07)
    rectOn(win, a, b, c + 0.5, 0.38, 2.7, 5.5, 0.07)
    if (arched) {
      archOn(white, a, b, c, 1.3, 7.3, 9.9, 0.03, 10)
      archOn(win, a, b, c, 1.0, 7.6, 9.9, 0.07, 10)
    } else {
      rectOn(white, a, b, c, 1.1, 7.4, 11.2, 0.03)
      rectOn(win, a, b, c, 0.8, 7.7, 10.9, 0.07)
    }
  }

  // ------------------------------------------------------ the 1897 range
  const FX = 38.6, BX = 8.0, YC = -4.2, HW = 28.5, Y0 = YC - HW, Y1 = YC + HW
  {
    const r = rect(BX, Y0, FX, Y1)
    walls(yellow, r, 0, 12.0)
    walls(white, r, 12.0, EAVE)
    hipRoof(roof, BX, Y0, FX, Y1, EAVE, RIDGE, 0.5)
    const F: [XY, XY] = [[FX, Y0], [FX, Y1]]
    bands(...F)
    // Six bays each side of the centre block; the inner three arched.
    const cw = 5.6, bw = 3.8
    for (const sgn of [-1, 1]) {
      for (let i = 0; i < 6; i++) {
        const c = HW + sgn * (cw + bw * (i + 0.5))
        bay(F[0], F[1], c, bw, i < 3)
      }
      // White quoins at the corners.
      const ce = HW + sgn * (HW - 0.6)
      strip(white, F[0], F[1], ce - 0.6, ce + 0.6, 1.8, 12.0, 0.15)
    }
    // The sides (seven bays down each, arched upper windows) and the back.
    for (const [a, b] of [[[FX, Y1], [BX, Y1]], [[BX, Y0], [FX, Y0]]] as [XY, XY][]) {
      bands(a, b)
      const { L } = along(a, b)
      for (let i = 0; i < 7; i++) bay(a, b, 1.6 + (i + 0.5) * ((L - 3.2) / 7), (L - 3.2) / 7, true)
      strip(white, a, b, 0, 1.2, 1.8, 12.0, 0.15)
      strip(white, a, b, L - 1.2, L, 1.8, 12.0, 0.15)
    }
  }
  // ------------------------------------------------- the white centre block
  {
    const cx0 = FX - 2, cx1 = FX + 1.0, c0 = YC - 5.6, c1 = YC + 5.6
    box(white, cx0, c0, cx1, c1, 0, 12.0, null, 0)
    box(white, cx0 - 0.2, c0 - 0.3, cx1 + 0.35, c1 + 0.3, 12.0, EAVE + 0.2, white, 0.25)
    const F: [XY, XY] = [[cx1, c0], [cx1, c1]], L = c1 - c0
    strip(white, F[0], F[1], 0, L, 0, 1.8, 0.15)
    strip(white, F[0], F[1], 0, L, 6.4, 6.9, 0.15)
    for (const d of [-3.4, 0, 3.4]) {
      const c = L / 2 + d
      archOn(win, F[0], F[1], c, 1.15, 1.8, 4.8, 0.07, 10)
      rectOn(win, F[0], F[1], c, 0.8, 7.6, 10.8, 0.07)
      pedimentOn(white, F[0], F[1], c, 1.25, 11.0, 11.8, 0.18)
    }
    for (const s of [0.35, L - 0.35, L / 2 - 1.7, L / 2 + 1.7]) strip(white, F[0], F[1], s - 0.35, s + 0.35, 1.8, 12.0, 0.25)
    // The attic gable: a tall narrow front with three small arched windows,
    // a pediment and a finial, and a hipped slate cap behind it.
    const ax0 = cx1 - 4.0, ax1 = cx1 - 0.1, a0 = YC - 3.1, a1 = YC + 3.1
    box(white, ax0, a0, ax1, a1, EAVE, 16.6, null, 0)
    const A: [XY, XY] = [[ax1, a0], [ax1, a1]]
    for (const d of [-1.3, 0, 1.3]) archOn(win, A[0], A[1], 3.1 + d, 0.42, 14.0, 15.4, 0.07, 8)
    strip(white, A[0], A[1], 0, 6.2, 16.3, 16.8, 0.3)
    pedimentOn(white, A[0], A[1], 3.1, 3.3, 16.8, 18.9, 0.3)
    hipRoof(roof, ax0 - 3, a0 + 0.2, ax1 - 0.3, a1 - 0.2, 16.6, 18.8, 0.1)
    lathe(white, ax1 - 0.1, YC, [[0.4, 18.8], [0.4, 19.3], [0.25, 19.6], [0.14, 20.4], [0, 20.4]], 6)
    // Side scrolls of the attic as stepped white blocks, and small corner finials.
    for (const s of [-1, 1]) {
      box(white, ax1 - 1.4, YC + s * 3.1 - (s > 0 ? 0 : 1.0), ax1 - 0.1, YC + s * 3.1 + (s > 0 ? 1.0 : 0), EAVE, 14.8, white, 0.2)
      lathe(white, cx1 - 0.2, YC + s * 5.3, [[0.3, EAVE + 0.2], [0.2, EAVE + 1.2], [0, EAVE + 1.6]], 6)
    }
  }

  // ------------------------------------------------- later wings (plain)
  const RT = 13.0
  const later = (x0: number, y0: number, x1: number, y1: number, h = RT, bands = 2) => {
    const r = rect(x0, y0, x1, y1)
    walls(conc, r, 0, h - 0.8)
    walls(conc, r, h - 0.8, h, inset(r, 0.3))
    cap(conc, inset(r, 0.3), h)
    // Ribbon windows on the long outer walls.
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const { L } = along(a, b)
      if (L < 8) continue
      for (let k = 0; k < bands; k++) {
        const z = 2.4 + k * ((h - 3.4) / bands)
        rectOn(win, a, b, L / 2, L / 2 - 1.5, z, z + 2.4, 0.05)
      }
    }
  }
  // The back block, behind the 1897 range (x -37.7..8), leaving the corner
  // to the planetarium.
  later(-37.7, -38.6, BX, 12.0)
  later(-12.0, 12.0, BX, 37.9)
  later(-37.2, 12.0, -12.0, 14.5, RT - 2, 2)
  // North-east wing, and the south-east corner annex.
  later(14.1, Y1, 33.0, 37.7, RT - 1)
  later(3.4, 37.7, 13.4, 41.8, 8, 2)
  later(BX, -38.4, 37.0, Y0 - 0.1, 9, 2)
  box(yellow, 37.0, -38.4, 41.3, Y0, 0, 7.0, roof, 0.3)

  // ---------------------------------------------------------- planetarium
  {
    const cx = -24.5, cy = 26.0, R = 12.6
    lathe(conc, cx, cy, [[R, 0], [R, 6.4], [R - 0.6, 7.0], [0, 7.0]], 20)
    const prof: XY[] = []
    const Rd = 11.8
    for (let i = 0; i <= 8; i++) {
      const t = (i / 8) * (Math.PI / 2)
      prof.push([Rd * Math.cos(t), 7.0 + 10.2 * Math.sin(t)])
    }
    prof[8][0] = 0
    lathe(dome, cx, cy, prof, 20)
  }

  return [
    { part: yellow, material: { ...finish('cpt-museum-yellow', 0xe7d79c), floodlight: flood } },
    { part: white, material: { ...PALETTE.trim, floodlight: flood } },
    { part: roof, material: { ...PALETTE.roof, color: 0x8f989f } },
    { part: win, material: PALETTE.window },
    { part: dome, material: finish('cpt-planetarium-bronze', 0x6f6457) },
    { part: conc, material: finish('cpt-museum-concrete', 0xddd3bf) },
  ]
}

if (import.meta.main) await save('cpt-iziko-museum', 'Iziko South African Museum', [-33.9288842, 18.4149595], 41, build() as any, 6500)
