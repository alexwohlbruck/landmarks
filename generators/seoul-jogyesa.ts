/**
 * Jogyesa Daeungjeon (조계사 대웅전), the main hall of Jogyesa, head temple of
 * the Jogye Order, Seoul (1938) — original procedural geometry, CC0-1.0.
 * bun generators/seoul-jogyesa.ts
 *
 * Built with the hanok kit in seoul-geunjeongjeon.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/432721256 (the eaves),
 * 37.5739071, 126.9818575. Its long sides run at 87.2°, so the catalog
 * bearing is 357.2 and the hall faces -y, south, onto the temple court.
 *
 * Identity: one tall single-storey hall under a huge, steep hipped-and-gabled
 * (paljak) roof, nearly as tall as the walls under it, its eaves sweeping up
 * at the corners; the deep, densely bracketed eaves in green dancheong; dark
 * red columns framing green lattice doors with blue-green panels above,
 * 7 × 4 bays; the red gables with the Jogye Order's emblem, three dots in a
 * ring; the name board 大雄殿; the granite base with its front stairs. At
 * night the hall is lit for the lantern festivals: the lattice doors glow
 * (`window-2`), the red and the soffits carry `floodlight`.
 *
 * Evidence:
 *  - plan: OSM way/432721256, 38.8 × 25.6 m (the eaves). Published: built
 *    1938, the largest wooden Buddhist hall in Seoul (ko.wikipedia, 조계사);
 *    the 7 × 4 bay plan from the photos (7 bays across the front in
 *    Jogyesa_temple_in_2026 and the Two Dragons view).
 *  - proportions: scaled from the people and doors in Jogyesa_temple.jpg
 *    (people ~1.6 m: doors ~4.2 m, wall to the lintel ~6.2 m above the
 *    floor, bracket band ~3 m) and the overall views (Seoul_Jongno_Jogyesa
 *    _Temple_15239723850: the roof's rise about equal to the wall): base
 *    1.5 m, lintel 7.7, bracket band to 10.6, eave 11.0 m at the middle,
 *    gable foot 14.6, ridge top ~18.6 m. Columns ±15.4 × ±8.8 m (the eaves
 *    less ~4 m of overhang, the bays ~4.4 m). Gable ~11 m wide at the foot,
 *    ridge ~22 m between its ornaments (estimated from the east view).
 *    No published height found; the ridge height is an estimate (±1.5 m).
 *  - colours: daylight photos: deep red columns #7d3530 (pulled light), green
 *    lattice doors, blue-green panels, dark tile, granite base; the gable red
 *    with a yellow emblem (drawn pale).
 *  - terrain: Mapterhorn has no z15 tiles over Seoul, so `terrain.ts` could
 *    not check the site; the court is level. Elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Jogyesa_temple.jpg, Irma2403, CC BY-SA 4.0 (south-east, close; gable emblem)
 *  - Jogyesa_Temple_with_Two_Dragons.jpg, Ethan Doyle White, CC BY-SA 4.0 (south-west)
 *  - Seoul,_Jongno_&_Jogyesa_Temple_(조계사)_(15239723850).jpg, Michael Sean Gallagher, CC BY-SA 2.0 (south-east, distant)
 *  - Jogyesa_Temple_(1509839597).jpg, Francisco Anzola, CC BY 2.0 (gable end)
 *  - Jogyesa_temple_in_2026_(2).jpg and (4), Sadopaul, CC BY-SA 4.0 (front, bays and board)
 * No commercial imagery. No look-only references.
 *
 * Left out: the lantern canopies hung over the court for festivals, the
 * stone pagoda, lanterns and the lacebark pine; the paintings on the wall
 * panels, the japsang figures, the board's lettering.
 */
import { Part, type V3 } from './mesh'
import { box, brackets, columns, hanokMaterials, hanokParts, hyeonpan, platform, roof, saveHanok, storey, tally } from './seoul-geunjeongjeon'

function build() {
  const P = hanokParts()
  const PH = 1.5
  platform(P, [{
    x0: -18.4, x1: 18.4, y0: -12.0, y1: 11.2, z0: 0, z1: PH, rail: false,
    stairs: [{ side: 's', at: 0, width: 9.0 }, { side: 's', at: -12.5, width: 3.2 }, { side: 's', at: 12.5, width: 3.2 }, { side: 'e', at: -2, width: 3.0 }, { side: 'w', at: -2, width: 3.0 }],
  }])
  tally(P, 'base')

  // 7 × 4 bays, the middle bay a little wider.
  const xs = [-15.4, -11.0, -6.6, -2.4, 2.4, 6.6, 11.0, 15.4]
  const ys = [-8.8, -4.4, 0, 4.4, 8.8]
  const L1 = PH + 6.2, L2 = PH + 7.0, B1 = PH + 9.4
  storey(P, xs, ys, PH, L1 - 1.6, L1 - 1.2, (side) => (side === 'n' ? 'window' : 'door'), { panes: 3 })
  // The band of blue-green panels over the doors, under the lintel.
  storey(P, xs, ys, L1 - 1.2, L1 - 0.1, L2, () => 'high')
  columns(P, xs, ys, PH, L2, 0.42, { n: 10 })
  box(P.stone, xs[0] - 0.5, ys[0] - 0.5, PH, xs[7] + 0.5, ys[4] + 0.5, PH + 0.12, 'b')
  brackets(P, xs, ys, L2, B1, { per: 2, depth: 1.8, width: 0.6, tiers: 3 })
  tally(P, 'walls')

  const R = roof(P, {
    kind: 'paljak', ex: 17.9, ey: 11.3, ze: PH + 9.5, gx: 11.0, gy: 5.5, zg: 14.6, zr: 17.8,
    lift: 2.4, flare: 1.5, sag: 0.45, th: 0.85,
    soffit: { bx: xs[7] + 1.9, by: ys[4] + 1.9, zb: B1 },
    ridge: { h: 0.85, w: 0.9, ornament: 1.4 }, ridgeSag: 0.3,
  })
  void R
  // The Jogye Order emblem on both gables: a pale ring with three dots.
  for (const s of [-1, 1]) emblem(P.stone, s * 11.0 + s * 0.06, 0, 15.9, 1.15, s)
  hyeonpan(P, 0, ys[0] - 1.0, L2 + 0.55, 4.2, 1.4, 0.22)
  tally(P, 'roof')

  return hanokMaterials(P, { red: 0.75, teal: 0.6, green: 0.4 }, { red: 0x99463d, lattice: 0x52806e })
}

/**
 * The emblem on a gable at x (facing ±x by `s`): a ring of radius r about
 * (y, z) with three dots inside, flush on the gable boards.
 */
function emblem(p: Part, x: number, y: number, z: number, r: number, s: number) {
  const at = (u: number, v: number): V3 => [x, y + u, z + v]
  const n: V3 = [s, 0, 0]
  const tri = (a: V3, b: V3, c: V3) => p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  const K = 16, w = 0.22
  for (let i = 0; i < K; i++) {
    const a = i / K * 2 * Math.PI, b = (i + 1) / K * 2 * Math.PI
    const A0 = at((r - w) * Math.cos(a), (r - w) * Math.sin(a)), A1 = at(r * Math.cos(a), r * Math.sin(a))
    const B0 = at((r - w) * Math.cos(b), (r - w) * Math.sin(b)), B1 = at(r * Math.cos(b), r * Math.sin(b))
    tri(A0, A1, B1); tri(A0, B1, B0)
  }
  for (const [u, v] of [[0, 0.38], [-0.33, -0.2], [0.33, -0.2]]) {
    const c = 0.2
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * 2 * Math.PI, b = (i + 1) / 8 * 2 * Math.PI
      tri(at(u, v), at(u + c * Math.cos(a), v + c * Math.sin(a)), at(u + c * Math.cos(b), v + c * Math.sin(b)))
    }
  }
}

if (import.meta.main) await saveHanok('seoul-jogyesa', 'Jogyesa Daeungjeon', [37.5739071, 126.9818575], 357.2, build(), 6500)
