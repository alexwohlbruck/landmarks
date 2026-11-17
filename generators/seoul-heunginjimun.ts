/**
 * Heunginjimun (흥인지문, Dongdaemun), the east gate of Hanyang's city wall,
 * Seoul (1398; the present pavilion 1869) — original procedural geometry,
 * CC0-1.0.
 * bun generators/seoul-heunginjimun.ts
 *
 * Built with the hanok kit in seoul-geunjeongjeon.ts and the gate helpers in
 * seoul-sungnyemun.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/320783808 (the base, its
 * wall stubs and the ongseong), 37.5711281, 127.0096849. The base's long
 * sides run at 350.5°, so the catalog bearing is 260.5: the frame's +x is
 * north (350.5°) and the gate faces -y, east (80.5°), out of the old city,
 * into its ongseong.
 *
 * Identity, in order: the semicircular ongseong, the only one on Seoul's
 * gates, a thick granite ring wall with a crenellated grey brick parapet,
 * wrapping the front of the gate and open on its north side; the granite
 * base with one round-headed passage and a brick parapet; the two-storey
 * pavilion, 5 × 2 bays, under two hipped (ujingak) roofs, trapezoids from
 * the front, sweeping up at the corners. At night the ongseong, the base and
 * the pavilion are floodlit warm from below: granite, brick, red, the soffits
 * and the bracket bands carry `floodlight`.
 *
 * Evidence:
 *  - plan: OSM way/320783808 (1229 m²). In the frame the base runs x
 *    −12.8…17.6, y −1.8…15.9; the ongseong is a ring: circles fitted to the
 *    outline's inner and outer arcs share a centre (2.37, −5.2) and have radii
 *    16.3 and 22.6 m (residuals under 0.4 m), so the passage sits at x 2.4;
 *    the ring runs from the base's south end (≈170°) round the front to its
 *    open end at ≈−23° (north). Wall stubs: south x −27.2…−12.8,
 *    y 3.2…15.9; north x 17.6…25.3, y −4.6…15.9.
 *  - published: ko.wikipedia, 흥인지문: 5 × 2 bays, two storeys, ujingak
 *    roof, dapo brackets; the only ongseong among Seoul's gates (rebuilt
 *    2002–2007).
 *  - proportions: measured on the level view of the west (inner) face,
 *    Korea-Seoul-Dongdaemun-02, at 31.3 px/m, the scale that makes the base
 *    top as wide as OSM's 30.4 m; heights corrected for perspective (camera
 *    ~60 m off, the ridge ~10 m behind the base face, the ridge then
 *    measuring ~16 m, as Sungnyemun's published 16.6 m): base 8.1 m, parapet
 *    to 9.6, passage 6.2 m wide and high, lower eave 12.8, lower roof meets
 *    the upper wall at 15.1, upper eave 19.2, ridge top 22.8 m; lower eaves
 *    ~35 m and upper ~32 m wide (ratio 0.915 in the photo). The ongseong,
 *    from Richard Mortel's view of its east face: granite 4.6 m, crenellated
 *    brick parapet to 6.6 m, merlons ~4 m long. Depths of the storeys
 *    (±5.2, ±4.2 m) are estimates from the north and south views.
 *  - colours: daylight photos: granite #a8a196, grey brick, dark tile, red
 *    columns and the upper storey's red board walls, green dancheong.
 *  - terrain: Mapterhorn has no z15 tiles over Seoul, so `terrain.ts` could
 *    not check the site; the street around the gate is flat. Elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Korea-Seoul-Dongdaemun-02.jpg, Gaël Chardon, CC BY-SA 2.0 (west face, level)
 *  - Heunginjimun_Gate,_Seoul,_1869_(5)_(27243613568).jpg, Richard Mortel, CC BY 2.0 (east, the ongseong)
 *  - Heunginjimun_Gate,_Seoul,_1869_(6)_(39307626730).jpg, Richard Mortel, CC BY 2.0 (north stub and stair)
 *  - Dongdaemun,_Seoul.jpg, Rtflakfizer, CC BY-SA 4.0 (from Naksan, north: ongseong plan and opening)
 *  - Heunginjimun,_Seoul_02.jpg, Tristan Surtel, CC BY-SA 4.0 (from above, north-west)
 *  - 20240601_144028_Heunginjimun,_Seoul_07.jpg, Dwxn, CC BY-SA 4.0 (south-west)
 *  - 흥인지문_(Heunginjimun_Gate).jpg, Jiyounnng, CC BY-SA 4.0 (night)
 * No commercial imagery. No look-only references.
 *
 * Left out: the embrasure holes in the merlons, the stair up the north stub,
 * the side gates in the base parapet, the taegeuk panels on the upper
 * storey's boards (drawn as plain red walls), the japsang figures.
 */
import { Part, type V3 } from './mesh'
import { box, brackets, columns, gateBase, hanokParts, hyeonpan, roof, saveHanok, storey, tally } from './seoul-geunjeongjeon'
import { brickParapet, gateMaterials, ring, wallStub } from './seoul-sungnyemun'

/**
 * A curved box: the ring sector between radii r0 < r1, angles a0 < a1
 * (radians, counter-clockwise), from z0 to z1, about (cx, cy). `ends`
 * draws the end faces; the bottom is never drawn.
 */
function arcBox(p: Part, cx: number, cy: number, r0: number, r1: number, a0: number, a1: number, z0: number, z1: number, n: number, o: { inner?: boolean; ends?: boolean } = {}) {
  const at = (r: number, a: number, z: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
  for (let i = 0; i < n; i++) {
    const t0 = a0 + (a1 - a0) * i / n, t1 = a0 + (a1 - a0) * (i + 1) / n
    p.quad(at(r1, t0, z0), at(r1, t1, z0), at(r1, t1, z1), at(r1, t0, z1))
    if (o.inner !== false) p.quad(at(r0, t1, z0), at(r0, t0, z0), at(r0, t0, z1), at(r0, t1, z1))
    p.quad(at(r0, t0, z1), at(r1, t0, z1), at(r1, t1, z1), at(r0, t1, z1))
  }
  if (o.ends !== false) {
    p.quad(at(r0, a0, z0), at(r1, a0, z0), at(r1, a0, z1), at(r0, a0, z1))
    p.quad(at(r1, a1, z0), at(r0, a1, z0), at(r0, a1, z1), at(r1, a1, z1))
  }
}

function build() {
  const P = hanokParts()
  const brick = new Part()
  const CX = 2.37, Y0 = -1.8, Y1 = 15.9, CY = (Y0 + Y1) / 2
  const BX0 = -12.8, BX1 = 17.6, BH = 8.1

  gateBase(P, {
    x0: BX0, x1: BX1, y0: Y0, y1: Y1, h: BH, reveal: 2.6, seg: 12,
    arches: [{ c: CX, w: 6.2, h: 6.2 }],
  })
  ring(P.stone, CX, Y0, 3.1, 4.05, 6.2 - 3.1, 0.18)
  ring(P.stone, CX, Y1, 3.1, 4.05, 6.2 - 3.1, -0.18)
  brickParapet(P, brick, BX0, Y0, BX1, Y1, BH, 1.5, 0.7)
  for (const x of [BX0, BX1 - 1.1]) for (const y of [Y0, Y1 - 1.1]) box(brick, x, y, BH, x + 1.1, y + 1.1, BH + 1.9, 'b')
  // The city wall's stubs: the south one sloping off the base, the north one
  // the north one sloping too, where the stair climbs the wall to the base.
  wallStub(P.stone, BX0, -27.2, 3.2, Y1, BH, 5.2)
  wallStub(P.stone, BX1, 25.3, -4.6, Y1, BH, 4.6)
  tally(P, 'base')

  // The ongseong: a granite ring with a walk on top, a low inner parapet and
  // the crenellated brick parapet on the outer edge.
  const OCY = -5.2, R0 = 16.3, R1 = 22.6, OH = 4.6
  const A0 = 170 * Math.PI / 180, A1 = 337 * Math.PI / 180, N = 22
  // The ring's rubble granite reads darker and greyer than the gate's
  // dressed base: it takes the grey `brick` swatch; its brick parapet reads
  // pale, so the parapet takes the granite swatch.
  arcBox(brick, CX, OCY, R0, R1, A0, A1, 0, OH, N)
  arcBox(P.stone, CX, OCY, R0, R0 + 0.5, A0, A1, OH, OH + 0.9, N)
  arcBox(P.stone, CX, OCY, R1 - 0.8, R1, A0, A1, OH, OH + 0.9, N)
  // Merlons, ~4.2 m along the outer face, with crenels between, each under
  // a grey coping.
  const M = 16, gap = 1.0 / R1
  for (let i = 0; i < M; i++) {
    const m0 = A0 + (A1 - A0) * i / M + (i ? gap / 2 : 0), m1 = A0 + (A1 - A0) * (i + 1) / M - (i < M - 1 ? gap / 2 : 0)
    arcBox(P.stone, CX, OCY, R1 - 0.8, R1, m0, m1, OH + 0.9, OH + 1.85, 2)
    arcBox(brick, CX, OCY, R1 - 0.9, R1 + 0.1, m0, m1, OH + 1.85, OH + 2.1, 2)
  }
  // Where the ring's south end meets the base and the south stub.
  box(brick, -19.7, -2.4, 0, BX0, 3.2, OH, 'b')
  box(P.stone, -19.7, -2.4, OH, -18.9, 3.2, OH + 0.9, 'b')
  tally(P, 'ongseong')

  // Lower storey: 5 × 2 bays, open between the columns.
  const Z0 = BH
  const xs = [-12.4, -8.3, -3.9, 3.9, 8.3, 12.4].map((x) => CX + x)
  const ys = [CY - 5.2, CY, CY + 5.2]
  const L1 = Z0 + 2.4, L2 = Z0 + 3.0, B1 = Z0 + 4.6
  box(P.stone, BX0 + 0.7, Y0 + 0.7, Z0, BX1 - 0.7, Y1 - 0.7, Z0 + 0.15, 'b')
  storey(P, xs, ys, Z0 + 0.15, L1, L2, () => 'open')
  box(P.teal, xs[1], ys[0] + 1.5, Z0 + 0.15, xs[4], ys[2] - 1.5, L2, 'tb')
  box(P.teal, xs[0] + 0.3, ys[0] + 0.3, L2 - 0.02, xs[5] - 0.3, ys[2] - 0.3, L2, 'nsewb')
  columns(P, xs, ys, Z0 + 0.15, L2, 0.36)
  brackets(P, xs, ys, L2, B1, { per: 2, depth: 1.4, width: 0.55 })
  tally(P, 'lower storey')

  const UX = 10.8, UY = 4.2, U0 = Z0 + 7.0
  roof(P, {
    cx: CX, cy: CY, kind: 'skirt', ex: 16.3, ey: 8.6, ze: Z0 + 4.7, gx: UX, gy: UY, zg: U0,
    lift: 1.5, flare: 1.1, sag: 0.3, th: 0.75,
    soffit: { bx: 12.4 + 1.45, by: 5.2 + 1.45, zb: B1 },
  })
  tally(P, 'lower roof')

  // Upper storey: taller than Sungnyemun's, its red board walls showing
  // above the lower roof.
  const uxs = [-UX, -7.6, -3.9, 3.9, 7.6, UX].map((x) => CX + x)
  const uys = [CY - UY, CY, CY + UY]
  const UL1 = Z0 + 8.9, UL2 = Z0 + 9.4, UB1 = Z0 + 11.0
  storey(P, uxs, uys, U0 - 0.2, UL1, UL2, () => 'wall')
  columns(P, uxs, uys, U0 - 0.2, UL2, 0.33)
  brackets(P, uxs, uys, UL2, UB1, { per: 2, depth: 1.35, width: 0.5 })
  tally(P, 'upper storey')

  roof(P, {
    cx: CX, cy: CY, kind: 'hip', ex: 14.8, ey: 7.9, ze: Z0 + 11.1, gx: 7.6, gy: 0, zg: 22.0, zr: 22.0,
    lift: 1.9, flare: 1.2, sag: 0.35, th: 0.8,
    soffit: { bx: UX + 1.4, by: UY + 1.4, zb: UB1 },
    ridge: { h: 0.85, w: 0.9, ornament: 1.3 }, ridgeSag: 0.2,
  })
  // The name board 興仁之門 over the middle bay, on the gate's outer face.
  hyeonpan(P, CX, CY - UY - 0.9, UL2 + 0.4, 3.0, 1.3, 0.22)
  tally(P, 'upper roof')

  return gateMaterials(P, brick, { red: 0.75, teal: 0.7, stone: 0.6, brick: 0.6, green: 0.4 }, { stone: 0xd8cfbf }, 0xaba69d)
}

if (import.meta.main) await saveHanok('seoul-heunginjimun', 'Heunginjimun', [37.5711281, 127.0096849], 260.5, build(), 6500)
