/**
 * Zuiderkerk (1603-11, Hendrick de Keyser; tower finished 1614), Zandstraat,
 * Amsterdam: original procedural geometry, CC0-1.0.
 * bun generators/amsterdam-zuiderkerk.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/114120359,
 * 52.370292, 4.899756. The church's long walls run at 29 degrees, so the
 * catalog bearing is 29 and the church is square to this frame: the nave
 * runs along y, the tower stands at the -x/-y (south-west) corner.
 *
 * Identity, in order: the Renaissance tower: a square brick base with white
 * sandstone quoins, bands and oculi, its white entablature at 30 m; the
 * white sandstone stage with four free-standing corner columns and a
 * balustrade; the clock stage with the dated pediments (1614) and red-gold
 * dials; then the lead-covered octagonal stages, a closed one with a
 * balustrade and the open belfry with its bells, under an onion-shaped
 * cupola, a slender spire, a gilt ball and the vane; the brick hall church
 * with tall windows in white quoined surrounds, slate lean-to aisle
 * roofs, transverse gabled dormers and the great slate roof between
 * ornamented end gables.
 *
 * Evidence:
 *  - nave roof: OSM's 24 m nave part (8 m roof) is drawn taller, eave 16.5
 *    and ridge 27.5 m, as Parsifall's level side photo scales it (ridge just
 *    under the tower's 30 m entablature, roof about 60 degrees).
 *  - plan: OSM outline way/114120359 and its parts read in the turned frame:
 *    aisles 749385557 (x -13.7..13.7, y -19.9..21.0, 13 m), nave 749385558
 *    (x -5.8..6.7, y -19.9..19.5, 24 m with an 8 m gabled roof), tower
 *    749385556 (x -15.3..-4.2, y -22.5..-11.5, 30 m), the small annex at
 *    x 13.7..18.8, y 7.9..13.4 (untagged; drawn 6 m, from Parsifall's photo).
 *  - height: OSM height 61.2 m on the outline, sourced to 3DBAG (AHN lidar,
 *    via OSM's source:height tag), used as the vane's top: measured.
 *  - tower stages estimated from Ymblanter's distant 2025 photo (24 px/m on
 *    the 30 m base): base to 30, column stage to 36.4, clock stage to 40.5,
 *    lead octagon to 44.4, belfry to 49.8, cupola to 53, spire and ball to
 *    57.4, vane to 61.2 m. Widths from the same photo: column stage core
 *    8.3 m, clock stage 7 m, octagon 5.8 m, belfry 4.8 m, cupola 3.2 m.
 *  - colours from the daylight photos: brown-red brick pulled light; the
 *    white sandstone of the lower stages and the window surrounds; the
 *    upper wooden stages and cupola dark lead grey since the restoration
 *    (Steven Lek 2018 and Ymblanter 2025 both show it; photos before 2015
 *    show them painted white); grey slate roofs; gilt finials and ball.
 *  - elevation 0; no lidar read directly (AHN is not supported by the
 *    repo's tools; the 3DBAG height comes from it).
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Amsterdam_Zuiderkerk_seen_from_Zwanenburgwal.jpg (Ymblanter,
 *    CC BY-SA 4.0, 2025): the whole tower from the south-east, distant.
 *  - Zuiderkerk_Amsterdam_2018.jpg (Steven Lek, CC BY-SA 4.0): the tower
 *    stages, lead colours.
 *  - Amsterdam,_de_Zuiderkerktoren_RM6498_foto2_2014-01-12_12.50.jpg
 *    (Michielverbeek, CC BY-SA 4.0): column and clock stages close up.
 *  - Amsterdam,_Zuiderkerk_01.jpg (Parsifall, CC BY-SA 4.0): the long side,
 *    aisle windows, dormers, roofs and the annex.
 *  - Amsterdam-652-Zuiderkerk-2011-gje.jpg (Gerd Eichmann, CC BY-SA 4.0):
 *    the tower from the Groenburgwal.
 *  - Amsterdam,_the_tower_of_the_Zuiderkerk.jpg (Dguendel, CC BY 4.0).
 * No commercial imagery. No look-only sources.
 *
 * Left out: brackets of the entablature, the balusters, the 1614 numerals,
 * clock hands, the bells, the many small finials of the lead stages, the
 * cupola's crown-like openwork, the vane's cockerel, sash bars.
 *
 * Doubts: the east long side and the north end are drawn as the west side's
 * and the south end's mirror; the dormer positions follow Parsifall's photo
 * of one side only; the annex height is estimated.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  archOn, archWin, ball, bbox, cap, column, cornice, discOn, face, floodAll, gableRoof, lathe, mastCross, parapet,
  rect, rectOn, save, sidesOf, sq, urn, wallSlab, walls, along, hipRoof, type XY,
} from './amsterdam-westerkerk'

function build() {
  const brick = new Part(), stone = new Part(), lead = new Part(), win = new Part(), gold = new Part(), dark = new Part()

  // ------------------------------------------------------------- the body
  const AX0 = -13.7, AX1 = 13.7, Y0 = -19.9, Y1 = 21.0, AEAVE = 13
  const NX0 = -5.8, NX1 = 6.7, NEAVE = 16.5, NRIDGE = 27.5
  const aisles = rect(AX0, Y0, AX1, Y1)
  walls(brick, aisles, 0, AEAVE)
  bbox(stone, null, AX0 - 0.08, Y0 - 0.08, AX1 + 0.08, Y1 + 0.08, 0, 0.8, 0.05)
  bbox(stone, null, AX0 - 0.3, Y0 - 0.3, AX1 + 0.3, Y1 + 0.3, AEAVE - 0.5, AEAVE, 0.2)
  walls(brick, rect(NX0, Y0, NX1, Y1), AEAVE - 0.5, NEAVE)
  bbox(stone, null, NX0 - 0.25, Y0 - 0.1, NX1 + 0.25, Y1 + 0.1, NEAVE - 0.45, NEAVE, 0.15)
  gableRoof(lead, null, NX0, Y0, NX1, Y1, NEAVE, NRIDGE, false, 0.35, 0)
  // Lean-to aisle roofs, along y: build with x as the slope direction.
  for (const [xo, xi] of [[AX0, NX0], [AX1, NX1]] as [number, number][]) {
    const sgn = Math.sign(xo - xi), s = 3 / Math.abs(xo - xi), o = 0.3
    const xe = xo + sgn * o, ze = AEAVE - o * s
    face(lead, [[xe, Y0, ze], [xe, Y1, ze], [xi, Y1, AEAVE + 3], [xi, Y0, AEAVE + 3]], [sgn, 0, 1 / s])
    face(lead, [[xe, Y0, ze], [xe, Y1, ze], [xe, Y1, ze + 0.3], [xe, Y0, ze + 0.3]], [sgn, 0, 0])
    for (const y of [Y0, Y1]) face(brick, [[xo, y, AEAVE], [xi, y, AEAVE], [xi, y, AEAVE + 3]], [0, Math.sign(y), 0])
  }

  // End gables of the nave (both ends), stepped with stone copings.
  const endGable = (a: XY, b: XY, c: number, hw: number) => {
    const z0 = NEAVE, H = NRIDGE + 2.6 - z0
    const o: XY[] = [
      [c - hw, z0], [c + hw, z0], [c + hw, z0 + 0.15 * H], [c + hw * 0.7, z0 + 0.35 * H], [c + hw * 0.7, z0 + 0.55 * H],
      [c + hw * 0.38, z0 + 0.72 * H], [c + hw * 0.38, z0 + 0.88 * H], [c, z0 + H],
      [c - hw * 0.38, z0 + 0.88 * H], [c - hw * 0.38, z0 + 0.72 * H], [c - hw * 0.7, z0 + 0.55 * H], [c - hw * 0.7, z0 + 0.35 * H], [c - hw, z0 + 0.15 * H],
    ]
    wallSlab(brick, a, b, o, 0.6, -0.6)
    for (const s of [c - hw * 0.55, c + hw * 0.55]) rectOn(stone, a, b, s, 0.3, z0, z0 + 0.55 * H, 0.04)
    archWin(stone, win, [a, b], c, 1.0, z0 + 0.12 * H, z0 + 0.45 * H, 0.25)
    const { P } = along(a, b)
    for (const s of [-1, 1]) {
      const p = P(c + s * (hw - 0.3), z0 + 0.15 * H, -0.3)
      lathe(stone, p[0], p[1], [[0.3, p[2]], [0.3, p[2] + 0.5], [0, p[2] + 1.6]], 4, Math.PI / 4)
      const q = P(c + s * (hw * 0.7 - 0.25), z0 + 0.55 * H, -0.3)
      lathe(stone, q[0], q[1], [[0.25, q[2]], [0.25, q[2] + 0.4], [0, q[2] + 1.3]], 4, Math.PI / 4)
    }
    const pa = P(c, z0 + H, -0.3)
    lathe(stone, pa[0], pa[1], [[0.2, pa[2] - 0.2], [0.2, pa[2] + 0.4], [0, pa[2] + 1.5]], 4, Math.PI / 4)
  }
  const NS = sidesOf(rect(NX0, Y0, NX1, Y1))
  const hwN = (NX1 - NX0) / 2
  endGable(NS.S[0], NS.S[1], hwN, hwN)
  endGable(NS.N[0], NS.N[1], hwN, hwN)

  // Bays: six to each long side between brick pilaster buttresses; tall
  // round-headed windows in white surrounds; transverse gabled dormers over
  // the second and fifth bays.
  const S = sidesOf(aisles)
  const NB = 6, BAY = (Y1 - Y0) / NB
  for (let i = 0; i <= NB; i++) {
    const y = Y0 + i * BAY
    for (const sx of [-1, 1]) {
      const x = sx < 0 ? AX0 : AX1
      bbox(brick, stone, Math.min(x, x + sx * 1.3), y - 0.75, Math.max(x, x + sx * 1.3), y + 0.75, 0, AEAVE - 1.0, 0.4)
    }
  }
  for (let i = 0; i < NB; i++) {
    const yc = Y0 + (i + 0.5) * BAY
    const dormer = i === 1 || i === 4
    for (const k of ['W', 'E'] as const) {
      const seg = S[k], s = k === 'E' ? yc - Y0 : Y1 - yc
      if (k === 'W' && i === 0) continue // the tower stands here
      const top = dormer ? 14.6 : 11.4
      rectOn(stone, seg[0], seg[1], s, 1.95, 3.0, top + 0.4, 0.04)
      rectOn(win, seg[0], seg[1], s, 1.45, 3.4, top, 0.08)
    }
    if (dormer) {
      // A small transverse roof over the dormer, from the aisle eave in to
      // the nave, with a brick gable front and a stone pediment edge.
      for (const sx of [-1, 1]) {
        const xo = sx < 0 ? AX0 : AX1, xi = sx < 0 ? NX0 : NX1
        const y0 = yc - 2.3, y1 = yc + 2.3
        const x0 = Math.min(xo, xi), x1 = Math.max(xo, xi)
        walls(brick, rect(x0, y0, x1, y1), AEAVE - 0.5, AEAVE + 2.6)
        gableRoof(lead, brick, x0 - (sx < 0 ? 0.3 : 0), y0, x1 + (sx > 0 ? 0.3 : 0), y1, AEAVE + 2.6, AEAVE + 5.0, true, 0.25, 0)
        const seg: [XY, XY] = sx < 0 ? [[xo, y1], [xo, y0]] : [[xo, y0], [xo, y1]]
        const { P, n } = along(seg[0], seg[1])
        // stone rakes on the dormer gable
        for (const d of [-1, 1]) {
          const a = P(2.3 + d * 2.5, AEAVE + 2.5, 0.1), b = P(2.3, AEAVE + 5.15, 0.1)
          const a2 = P(2.3 + d * 2.5, AEAVE + 2.95, 0.1), b2 = P(2.3, AEAVE + 5.6, 0.1)
          face(stone, [a, b, b2, a2], [n[0], n[1], 0])
        }
      }
    }
  }
  // The ends: aisle windows beside the nave gable walls.
  for (const k of ['S', 'N'] as const) {
    for (const d of [-9.7, 9.7]) {
      if (k === 'S' && d < 0) continue
      archWin(stone, win, S[k], AX1 + d, 1.4, 3.4, 10.6)
    }
    archWin(stone, win, S[k], AX1 + 0.45, 1.9, 3.4, 12.0)
  }

  // The annex on the east side (white, hipped).
  walls(stone, rect(AX1, 7.9, 18.8, 13.4), 0, 5.2)
  hipRoof(lead, AX1, 7.9, 18.8, 13.4, 5.2, 7.6, 0.3)
  rectOn(dark, [18.8, 7.9], [18.8, 13.4], 1.5, 0.6, 1.0, 3.8, 0.05)
  rectOn(dark, [18.8, 7.9], [18.8, 13.4], 4.0, 0.6, 1.0, 3.8, 0.05)

  // ------------------------------------------------------------ the tower
  const TX = -9.75, TY = -17.0, H1 = 5.5, TOP1 = 30
  const tb = rect(TX - H1, TY - H1, TX + H1, TY + H1)
  walls(brick, tb, 0, 27.3)
  bbox(stone, null, TX - H1 - 0.1, TY - H1 - 0.1, TX + H1 + 0.1, TY + H1 + 0.1, 0, 1.2, 0.05)
  for (const z of [9.0, 20.6]) bbox(stone, null, TX - H1 - 0.1, TY - H1 - 0.1, TX + H1 + 0.1, TY + H1 + 0.1, z, z + 0.55, 0.1)
  // The white entablature at the top of the base.
  bbox(stone, null, TX - H1 - 0.15, TY - H1 - 0.15, TX + H1 + 0.15, TY + H1 + 0.15, 27.3, 28.9, 0.05)
  cornice(stone, TX, TY, H1 + 0.6, 28.9, TOP1)
  for (const [k, [a, b]] of Object.entries(sidesOf(tb))) {
    const c = H1
    // quoins
    for (const s of [0.45, 2 * H1 - 0.45]) for (let z = 1.2; z < 27; z += 1.6) rectOn(stone, a, b, s + (Math.round((z - 1.2) / 1.6) % 2 ? 0 : (s < c ? 0.25 : -0.25)), 0.55, z, z + 0.8, 0.04)
    // the upper tier: an arched paired opening between two stone oculi
    archOn(stone, a, b, c, 1.65, 21.7, 24.9, 0.04, 8)
    archOn(brick, a, b, c, 1.3, 21.9, 24.9, 0.06, 8)
    for (const d of [-0.6, 0.6]) archOn(dark, a, b, c + d, 0.42, 22.3, 24.4, 0.08, 5)
    for (const d of [-3.4, 3.4]) { discOn(stone, a, b, c + d, 24.4, 0.95, 0.04, 12); discOn(brick, a, b, c + d, 24.4, 0.55, 0.06, 12) }
    // middle: a tall arched window in white
    if (k !== 'E' && k !== 'N') archOn(stone, a, b, c, 1.3, 12.0, 17.8, 0.04, 8)
    if (k !== 'E' && k !== 'N') archOn(win, a, b, c, 1.0, 12.2, 17.8, 0.06, 8)
  }

  // Column stage: white core with free-standing corner columns, 30-36.4.
  const H2 = 3.8, CO = H2 + 1.15
  parapet(stone, rect(TX - CO - 0.5, TY - CO - 0.5, TX + CO + 0.5, TY + CO + 0.5), TOP1, 31.2, 0.3)
  const c2 = 1.3
  const r2: XY[] = [[TX - H2 + c2, TY - H2], [TX + H2 - c2, TY - H2], [TX + H2, TY - H2 + c2], [TX + H2, TY + H2 - c2], [TX + H2 - c2, TY + H2], [TX - H2 + c2, TY + H2], [TX - H2, TY + H2 - c2], [TX - H2, TY - H2 + c2]]
  walls(stone, r2, TOP1, 35.3)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    sq(stone, stone, TX + sx * CO, TY + sy * CO, 0.62, 31.2, 31.8, 0.1)
    column(stone, TX + sx * CO, TY + sy * CO, 31.8, 35.3, 0.52, 8)
    sq(stone, stone, TX + sx * CO, TY + sy * CO, 0.6, 35.0, 35.5, 0.1)
  }
  for (const fi of [0, 2, 4, 6]) { const a = r2[fi], b = r2[fi + 1]; archOn(stone, a, b, H2 - c2, 1.5, 31.4, 33.8, 0.05, 8); archOn(lead, a, b, H2 - c2, 1.2, 31.6, 33.8, 0.03, 8) }
  cornice(stone, TX, TY, CO + 0.7, 35.3, 36.4)

  // Clock stage with chamfered corners, pediments and urns, 36.4-40.5.
  const H3 = 3.5, ch = 1.0
  const r3: XY[] = [[TX - H3 + ch, TY - H3], [TX + H3 - ch, TY - H3], [TX + H3, TY - H3 + ch], [TX + H3, TY + H3 - ch], [TX + H3 - ch, TY + H3], [TX - H3 + ch, TY + H3], [TX - H3, TY + H3 - ch], [TX - H3, TY - H3 + ch]]
  walls(stone, r3, 36.4, 39.2)
  for (const fi of [0, 2, 4, 6]) {
    const a = r3[fi], b = r3[fi + 1]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    rectOn(gold, a, b, L / 2, 1.05, 36.8, 38.9, 0.08) // the red-and-gold dial
    rectOn(dark, a, b, L / 2, 0.75, 37.1, 38.6, 0.1)
    // Pediment over each dial, carrying the date.
    const { P, n } = along(a, b)
    face(stone, [P(L / 2 - 2.0, 39.2, 0.25), P(L / 2 + 2.0, 39.2, 0.25), P(L / 2, 40.6, 0.25)], [n[0], n[1], 0])
    face(stone, [P(L / 2 - 2.0, 39.2, 0), P(L / 2 - 2.0, 39.2, 0.25), P(L / 2, 40.6, 0.25), P(L / 2, 40.6, 0)], [-n[1] * 0, 0, 1])
    face(stone, [P(L / 2 + 2.0, 39.2, 0.25), P(L / 2 + 2.0, 39.2, 0), P(L / 2, 40.6, 0), P(L / 2, 40.6, 0.25)], [0, 0, 1])
  }
  walls(stone, r3, 39.2, 39.6)
  cap(stone, r3, 39.6)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) urn(stone, TX + sx * (H3 + 0.7), TY + sy * (H3 + 0.7), 36.4, 1.1, 6)

  // Lead octagon with windows and a balustrade, 39.6-44.4.
  const R8 = (f: number) => f / Math.cos(Math.PI / 8)
  const oct = (f: number) => Array.from({ length: 8 }, (_, i) => [TX + R8(f) * Math.cos(Math.PI / 8 + i * Math.PI / 4), TY + R8(f) * Math.sin(Math.PI / 8 + i * Math.PI / 4)] as XY)
  const o1 = oct(2.9)
  walls(lead, o1, 39.6, 43.5)
  for (let k = 0; k < 8; k++) {
    const a = o1[k], b = o1[(k + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    rectOn(dark, a, b, L / 2, 0.55, 40.6, 42.6, 0.05)
  }
  walls(lead, oct(3.25), 43.5, 43.9)
  cap(lead, oct(3.25), 43.9)
  cap(lead, oct(3.25), 43.5, false)
  parapet(lead, oct(3.2), 43.9, 44.8, 0.25)
  // Open belfry octagon, 44.8-49.8, with dark arched openings.
  const o2 = oct(2.35)
  walls(lead, o2, 43.9, 49.2)
  for (let k = 0; k < 8; k++) {
    const a = o2[k], b = o2[(k + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    archOn(dark, a, b, L / 2, 0.62, 45.2, 48.0, 0.05, 6)
    const p = o2[k]
    lathe(gold, p[0] + (p[0] - TX) * 0.12, p[1] + (p[1] - TY) * 0.12, [[0.14, 44.8], [0.14, 45.4], [0, 46.3]], 4)
  }
  walls(lead, oct(2.7), 49.2, 49.8)
  cap(lead, oct(2.7), 49.8)
  cap(lead, oct(2.7), 49.2, false)
  // Onion cupola, spire, ball, vane.
  lathe(lead, TX, TY, [[2.3, 49.8], [1.5, 50.2], [1.75, 50.9], [1.85, 51.6], [1.55, 52.4], [0.9, 53.0], [0.45, 53.4], [0.5, 53.9], [0.35, 54.3], [0.22, 56.6], [0, 57.0]], 8, Math.PI / 8)
  lathe(lead, TX, TY, [[0.55, 54.6], [0.6, 55.0], [0.4, 55.3], [0, 55.35]], 8)
  ball(gold, TX, TY, 57.2, 0.35, 8)
  mastCross(dark, TX, TY, 57.5, 61.2, 0.6, 0.09)
  {
    const vz = 60.0
    const v: V3[] = [[TX - 0.2, TY, vz], [TX + 1.0, TY, vz], [TX + 1.0, TY, vz + 0.7], [TX - 0.2, TY, vz + 0.7]]
    face(gold, v, [0, -1, 0]); face(gold, v, [0, 1, 0])
  }

  const towerFlood = (p: V3, n: V3) => (Math.hypot(p[0] - TX, p[1] - TY) < 7.5 ? floodAll(p, n) : n[2] > 0.7 ? 0.1 : 0.4)
  return [
    { part: brick, material: { ...finish('zuiderkerk-brick', 0x9f5b4b), floodlight: towerFlood } },
    { part: stone, material: { ...finish('zuiderkerk-sandstone', 0xe8e1d4), floodlight: towerFlood } },
    { part: lead, material: { ...finish('zuiderkerk-lead', 0x737d88), floodlight: towerFlood } },
    { part: win, material: { ...PALETTE.window } },
    { part: gold, material: finish('zuiderkerk-gilt', 0xc9a24a, 0.45) },
    { part: dark, material: finish('zuiderkerk-openings', 0x4a4f57) },
  ]
}

if (import.meta.main) await save('amsterdam-zuiderkerk', 'Zuiderkerk', [52.370292, 4.899756], 29, build(), 6500)
