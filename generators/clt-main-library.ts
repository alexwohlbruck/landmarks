/**
 * Charlotte Mecklenburg Library, new Main Library: 310 N Tryon St, Charlotte,
 * at the corner of N Tryon and E 6th St. Design architect Snøhetta, architect
 * of record Clark Nexsen; five storeys, 115,000 sq ft. Groundbreaking August
 * 2023 after the 1989 library was demolished; OSM gives `opening_date`
 * 2026-04-24 on the construction site. Drawn as designed (the finished
 * building), from the architects' renderings, because no open photo of the
 * finished building was found.
 *
 * Frame: model +y points NE (bearing 46.3, along N Tryon), +x points SE
 * along E 6th St. Tryon is the model's west face, 6th St its south face, the
 * McGlohon Theatre (former First Baptist Church, Spirit Square) is to the
 * north, across a narrow alley.
 *
 * Sources
 * - Snøhetta project page, text and renderings (architect renderings, allowed
 *   only because the building is unfinished; look at, not copy):
 *   https://snohetta.com/projects/charlotte-mecklenburg-new-main-library
 *   VIEW_1 (from across Tryon, looking SE: McGlohon at left, the glass band
 *   with the level-2 terrace on it, the sloped concave fin wall rising to the
 *   glass prow at the 6th St corner):
 *   https://snohetta.b-cdn.net/uploads/images/SNO_CHA_VIEW_1_FINAL.jpg
 *   VIEW_2 (from the Tryon/6th corner: the prow, its copper soffit, the long
 *   ceramic 6th St wall with a level-5 strip window and tall punched slots,
 *   the grey louvred penthouse): https://snohetta.b-cdn.net/uploads/images/SNO_CHA_VIEW_2_FINAL_V2.jpg
 *   VIEW_4 (the level-2 terrace under the leaning fin wall):
 *   https://snohetta.b-cdn.net/uploads/images/SNO_CHA_VIEW_4_FINAL_V2.jpg
 * - e-architect, 2019 design release with LMNB renderings (aerial from the
 *   NW showing the plan, the concave Tryon wall and the roof terrace):
 *   https://www.e-architect.com/america/main-library-in-charlotte-north-carolina
 *   https://www.e-architect.com/wp-content/uploads/2019/11/main-library-charlotte-nc-s081119-1.jpg
 * - Five official renderings (Snøhetta and Clark Nexsen) supplied by the
 *   user, the basis of this massing (look at, not copy; kept in the batch
 *   scratch as user-renderings/r1-r5): r1 and r2 from across Tryon (the
 *   scoop and the prow), r3 the level-1 soffit and the seating steps, r4 an
 *   aerial from above Tryon (the plan, the level-4 terrace, the roof and its
 *   lozenge skylight), r5 the Tryon/6th corner (the prow's copper wedge, the
 *   6th St panel wall, the penthouse).
 * - Charlotte Mecklenburg Library, project page (five levels, terraces):
 *   https://www.cmlibrary.org/new-main-library
 * - Dezeen, groundbreaking 2023: https://www.dezeen.com/2023/08/29/snohetta-breaks-ground-charlotte-library/
 * - Construction photos, 20 Oct 2025, Dclemens1971, CC BY 4.0 (EVIDENCE; the
 *   Tryon front topped out and clad, pale panels with glass; McGlohon left):
 *   https://commons.wikimedia.org/wiki/File:Main_Library_and_former_First_Baptist_Church_01.jpg
 *   https://commons.wikimedia.org/wiki/File:Main_Library_and_former_First_Baptist_Church_02.jpg
 * - OSM: way/174171802 (the old library, now `demolished:building`),
 *   way/1235638238 (landuse=construction, the site), street centrelines of
 *   N Tryon (bearing 49.2), E 6th (136.3), N College and E 7th; way/131139724
 *   (Spirit Square / McGlohon) for the alley line.
 * - USGS NAIP (pre-demolition) for the block and the alley.
 * - Mapterhorn terrain: the site is flat, 1 m of fall across it.
 * - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 predates the building; not used.
 *
 * Numbers
 * - Storeys (5), floor area (115,000 sq ft): published (Snøhetta, library).
 * - Plan: estimated. 6th St building line 10.7 m off the street centreline
 *   (as the old library's); Tryon glass 12 m off Tryon's centreline; the
 *   theatre side 7 m short of the McGlohon wall (alley); the SE end at
 *   x = 12 (35 m from the anchor), short of the block's midblock plaza, where the construction
 *   site's outline narrows. Floor area check: podium 2,900 m² + four upper
 *   floors of about 1,900 m² ≈ 10,500 m² against 10,680 m² published.
 * - Heights: estimated from the renderings, scaled from 5 storeys; no
 *   measured height exists. Level 1 glass stands 2.5 m back under a 6.3 m
 *   soffit; level-2 deck 7 m; level-4 terrace 20 m; main roof 30 m;
 *   prow 30.5 m with its copper wedge from 11 m down to 8.6 m; penthouse
 *   33.6 m.
 * - The scoop: plan concave by 3 m, leaning out 0.22 m per metre of height
 *   (about 5 m at the top near the prow); its top edge sags to the terrace
 *   and rises to 30.5 m at the prow and 22 m at the church-end block.
 *   Estimated from r1, r2 and r4.
 * - Prow: 12 m along 6th St, 8 m along Tryon (r1, r5 proportions).
 *
 * Rebuilt from the user's renderings (the earlier sweeping-roof massing was
 * the wrong shape). Compared with r1, r4 and r5 at bearings 316, 320
 * (elevation 38) and 255. Still differs:
 * - the roof is drawn as a rectangle; r4 shows it faceted, with a curved
 *   front edge;
 * - the scoop's glass shingle is drawn as a smooth surface with ribs and two
 *   course lines;
 * - the level-2 slab's curvy Tryon edge is drawn straight;
 * - the terrace's stepped planting is one flat green plane;
 * - the 6th St wall's coursing is not drawn; its openings are approximate.
 *
 * Doubts
 * - Everything rests on renderings, which may differ from what was built.
 *   The 2025 photos show the Tryon front clad in a pale checkered panel and
 *   glass pattern, more vertical than the renderings' fins; drawn as the
 *   renderings show it, in their light silvery tone.
 * - The NE (alley) and SE (midblock plaza) sides are not shown in any source:
 *   plain ceramic with a few window bands, invented.
 * - The street views (r1, r2) show the church end of the scoop low, while r4
 *   shows a full-height opaque wall there; drawn as a full-height block set
 *   back 6 m behind the scoop's end, which rises to meet it.
 * - The extent along 6th St (to x = 12) is an estimate.
 * - `replaces` lists way/174171802, the old library's way, now tagged
 *   `demolished:building`; OSM has no building for the new one yet. A mapper
 *   who adds it will need it added to `replaces`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, inset, onWall, panel, save, walls, type XY } from './chi-aon-center'

const BEARING = 46.3
// Anchor: the model's plan centroid (site point (-23, -2.5) from -80.84002, 35.22854).
const ANCHOR: [number, number] = [35.228675, -80.840215]
// Geometry is authored in site coordinates and shifted onto the anchor.
const OX = 23, OY = 2.5
const S = (r: XY[]): XY[] => r.map(([x, y]) => [x + OX, y + OY] as XY)
const P3 = (x: number, y: number, z: number): V3 => [x + OX, y + OY, z]

const ceramic = new Part(), win = new Part(), light = new Part(), green = new Part(), roof = new Part(), copper = new Part()
// pale fins, fascias and mullions share the panel colour
const trim = ceramic

const PROW = 30.5, PROW0 = 11.0, ROOF = 30.0

/** A rounded rectangle, counter-clockwise. */
function rrect(x0: number, y0: number, x1: number, y1: number, rad: number, seg = 3): XY[] {
  const out: XY[] = []
  const c: [number, number, number][] = [[x1 - rad, y0 + rad, -90], [x1 - rad, y1 - rad, 0], [x0 + rad, y1 - rad, 90], [x0 + rad, y0 + rad, 180]]
  for (const [cx, cy, a0] of c) for (let k = 0; k <= seg; k++) {
    const a = (a0 + (90 * k) / seg) * Math.PI / 180
    out.push([cx + rad * Math.cos(a), cy + rad * Math.sin(a)])
  }
  return out
}

// ---------------------------------------------------------------- level 1: recessed glass under a thin slab
// The slab (level 2's floor) runs out to the street lines and carries a planted terrace in front of the
// scoop; the glass stands 2.5 m back under its warm wood/copper soffit (r3, r4, r5).
const SLAB: XY[] = S([[-50, -25], [12, -25], [12, 20], [-55, 20], [-55, -19]])
const SOFFIT = 6.3, DECK = 7.0
{
  const glass = inset(SLAB, 2.5)
  walls(light, glass, 0, SOFFIT)
  for (let i = 0; i < glass.length; i++) {
    const a = glass[i], b = glass[(i + 1) % glass.length], { L } = onWall(a, b)
    const front = i === 0 || i === 3 || i === 4
    const n = Math.max(1, Math.round(L / (front ? 6 : 4))), w = L / n
    for (let k = 0; k <= n; k++) {
      const s0 = Math.min(L - 0.5, Math.max(0, k * w - 0.25))
      if (front) panel(trim, a, b, s0, s0 + 0.5, 0, SOFFIT, 0.06)
      else if (k < n) panel(ceramic, a, b, k * w, k * w + w * 0.45, 0, SOFFIT, 0.06)
    }
  }
  walls(ceramic, SLAB, SOFFIT, DECK + 0.5)
  cap(copper, SLAB, SOFFIT, false)
  const lip = inset(SLAB, 0.4)
  for (let i = 0; i < SLAB.length; i++) {
    const j = (i + 1) % SLAB.length
    ceramic.quad([SLAB[i][0], SLAB[i][1], DECK + 0.5], [SLAB[j][0], SLAB[j][1], DECK + 0.5], [lip[j][0], lip[j][1], DECK + 0.5], [lip[i][0], lip[i][1], DECK + 0.5])
    ceramic.quad([lip[j][0], lip[j][1], DECK + 0.5], [lip[i][0], lip[i][1], DECK + 0.5], [lip[i][0], lip[i][1], DECK], [lip[j][0], lip[j][1], DECK])
  }
  cap(green, lip, DECK)
}
// wide seating steps up from Tryon at the church end (r3, r4)
for (const [d, z] of [[4.5, 0.45], [3.0, 0.9], [1.5, 1.35]] as const) {
  const r = S([[-55 - d, 6], [-55, 6], [-55, 19], [-55 - d, 19]])
  walls(ceramic, r, 0, z)
  cap(ceramic, r, z)
}

// ---------------------------------------------------------------- the scoop
// One concave, outward-leaning wall of silver shingle glass along Tryon, from the prow (y = -18) to the
// opaque church-end block (y = 8). Its top edge sags to the level-4 terrace (20 m) in the middle and rises
// to the prow's full height at the 6th St end and, less, to the church-end block (r1, r2, r4).
const Y0 = -18, Y1 = 12, TERR = 20.0, BACK = -36, CHURCH_X = -40, NE = 18
const tOf = (y: number) => (y - Y0) / (Y1 - Y0)
const Z = (y: number) => {
  const t = tOf(y)
  return t < 0.72 ? TERR + (PROW - TERR) * Math.pow(1 - t / 0.72, 2.2) : TERR + 2.0 * Math.pow((t - 0.72) / 0.28, 2)
}
const xBot = (y: number) => -46 + 3.0 * Math.sin(Math.PI * tOf(y))
const lean = (z: number) => 0.22 * (z - DECK)
const xAt = (y: number, z: number) => xBot(y) - lean(z)
const NSEG = 16
const ys = Array.from({ length: NSEG + 1 }, (_, i) => Y0 + (Y1 - Y0) * i / NSEG)
{
  for (let i = 0; i < NSEG; i++) {
    const ya = ys[i], yb = ys[i + 1]
    // in two bands up the lean so the surface bows outward
    const za = Z(ya), zb = Z(yb)
    const ma = DECK + (za - DECK) * 0.5, mb = DECK + (zb - DECK) * 0.5
    light.quad(P3(xBot(yb), yb, DECK), P3(xBot(ya), ya, DECK), P3(xAt(ya, ma), ya, ma), P3(xAt(yb, mb), yb, mb))
    light.quad(P3(xAt(yb, mb), yb, mb), P3(xAt(ya, ma), ya, ma), P3(xAt(ya, za), ya, za), P3(xAt(yb, zb), yb, zb))
    // the pale lip along the top edge
    ceramic.quad(P3(xAt(yb, zb) - 0.1, yb, zb - 0.6), P3(xAt(ya, za) - 0.1, ya, za - 0.6), P3(xAt(ya, za) - 0.1, ya, za + 0.2), P3(xAt(yb, zb) - 0.1, yb, zb + 0.2))
    // shingle courses: two pale lines across the lean
    for (const f of [0.33, 0.66]) {
      const fa = DECK + (za - DECK) * f, fb = DECK + (zb - DECK) * f
      if (Math.min(fa, fb) > Math.min(za, zb) - 1.0) continue
      ceramic.quad(P3(xAt(yb, fb) - 0.08, yb, fb - 0.18), P3(xAt(ya, fa) - 0.08, ya, fa - 0.18), P3(xAt(ya, fa) - 0.08, ya, fa + 0.18), P3(xAt(yb, fb) - 0.08, yb, fb + 0.18))
    }
  }
  // vertical shingle ribs, ~1.6 m apart
  const nf = 16
  for (let k = 1; k < nf; k++) {
    const y = Y0 + (Y1 - Y0) * k / nf, w = 0.22, zt = Z(y) - 0.7
    const off = (x: number, z: number, dy: number): V3 => P3(x - 0.08, y + dy, z)
    const zm = DECK + (zt - DECK) * 0.5
    ceramic.quad(off(xBot(y), DECK + 0.3, w), off(xBot(y), DECK + 0.3, -w), off(xAt(y, zm), zm, -w), off(xAt(y, zm), zm, w))
    ceramic.quad(off(xAt(y, zm), zm, w), off(xAt(y, zm), zm, -w), off(xAt(y, zt), zt, -w), off(xAt(y, zt), zt, w))
  }
  // the church end of the lean, closed
  ceramic.tri(P3(xBot(Y1), Y1, DECK), P3(xAt(Y1, Z(Y1)), Y1, Z(Y1)), P3(xBot(Y1), Y1, Z(Y1)))
}
// behind it, up to the terrace: solid, with the level-4 terrace planted on top (r4)
{
  const ring: XY[] = []
  for (let i = 0; i <= NSEG; i++) ring.push([xBot(ys[i]), ys[i]])
  ring.push([BACK, Y1], [BACK, Y0])
  const r = S(ring).reverse()   // xBot runs -y→+y on the -x side: reversed is counter-clockwise
  cap(green, r, TERR)
  // the terrace's back: a glazed wall to the roof slab (an open-air room under the roof)
  const a: XY = S([[BACK, Y1]])[0], b: XY = S([[BACK, Y0]])[0]
  panel(light, a, b, 0.5, (Y1 - Y0) - 0.5, TERR + 0.4, ROOF - 1.9, 0.05)
  // the scoop's church end, closed back to the church-end block
  ceramic.quad(P3(CHURCH_X, Y1, DECK), P3(xBot(Y1), Y1, DECK), P3(xBot(Y1), Y1, Z(Y1)), P3(CHURCH_X, Y1, Z(Y1)))
}

// ---------------------------------------------------------------- the body: full height, flat roof
// Its Tryon side is the church-end block (opaque shingle, y 8..16), the terrace's glazed back (x = -36) and the
// prow's back (y < -18); 6th St is a long opaque panel wall.
const BODY: XY[] = S([[-45, -25], [12, -25], [12, NE], [CHURCH_X, NE], [CHURCH_X, Y1], [BACK, Y1], [BACK, Y0], [-45, Y0]])
{
  walls(ceramic, BODY, DECK, ROOF)
  const lip = inset(BODY, 0.5)
  walls(ceramic, BODY, ROOF, ROOF + 0.6, lip)
  cap(roof, lip, ROOF + 0.6)
  // the roof slab reaching out over the terrace, following the scoop's curve, warm underside
  const ring: XY[] = []
  for (let i = 0; i <= NSEG; i++) ring.push([xBot(ys[i]) + 1.5, ys[i]])
  ring.push([BACK, Y1], [BACK, Y0])
  const r = S(ring).reverse()
  walls(ceramic, r, ROOF - 1.4, ROOF + 0.6)
  cap(roof, r, ROOF + 0.6)
  cap(copper, r, ROOF - 1.4, false)
  // the lozenge skylight and the dark mechanical penthouse set back from 6th St (r4, r5)
  const sky = S(rrect(-25, 0, -11, 9, 3.5))
  walls(ceramic, sky, ROOF + 0.6, ROOF + 1.3)
  cap(light, sky, ROOF + 1.3)
  const ph = S([[-20, -21], [9, -21], [9, -9], [-20, -9]])
  walls(roof, ph, ROOF + 0.6, ROOF + 3.6)
  cap(roof, ph, ROOF + 3.6)

  // 6th St (r5): a top-storey ribbon window, two large recessed openings with folded hoods
  const A: XY = S([[-45, -25]])[0], B: XY = S([[12, -25]])[0]
  for (const [s0, s1, z0, z1] of [[6, 54, 25.0, 28.4], [14, 19, 14.0, 22.5], [33, 39, 10.5, 22.5]] as const) {
    panel(win, A, B, s0, s1, z0, z1, 0.05)
    const L = 1.0, h = 1.8
    const a = P3(-45 + s0, -25, z1), b = P3(-45 + s1, -25, z1), c = P3(-45 + s1, -25, z1 + h), d = P3(-45 + s0, -25, z1 + h)
    const ao: V3 = [a[0], a[1] - L, a[2]], bo: V3 = [b[0], b[1] - L, b[2]]
    ceramic.quad(a, b, bo, ao); ceramic.quad(ao, bo, c, d); ceramic.tri(a, ao, d); ceramic.tri(b, c, bo)
  }
  // the church-end block's Tryon face: opaque shingle with a slot window at the terrace corner (r4)
  const ca: XY = S([[CHURCH_X, NE]])[0], cb: XY = S([[CHURCH_X, Y1]])[0]
  panel(win, ca, cb, 3.5, 5.5, TERR + 0.5, ROOF - 2.0, 0.05)
  // the SE end and the alley side: a few bands (no source shows them)
  const se0: XY = S([[12, -25]])[0], se1: XY = S([[12, NE]])[0]
  for (let s = 3; s < 38; s += 9) { panel(win, se0, se1, s, s + 5.5, 10.0, 15.5, 0.05); panel(win, se0, se1, s, s + 5.5, 19.0, 25.0, 0.05) }
  const al0: XY = S([[12, NE]])[0], al1: XY = S([[CHURCH_X, NE]])[0]
  for (let s = 4; s < 54; s += 10) panel(win, al0, al1, s, s + 6, 12.0, 17.5, 0.05)
}

// ---------------------------------------------------------------- the prow: rounded glass, over a copper wedge
{
  const r = S(rrect(-57, -26, -45, -18, 2.4))
  walls(light, r, PROW0, PROW)
  const ins = inset(r, 0.45)
  walls(ceramic, r, PROW, PROW + 0.4, ins)
  cap(roof, ins, PROW + 0.4)
  for (const z of [15.8, 20.6, 25.4]) walls(ceramic, inset(r, -0.06), z - 0.25, z + 0.25)
  // the wedge: its underside slopes from the prow's outer edge (11 m) down to 8.6 m at the body (r5)
  const zw = (x: number) => PROW0 - 2.4 * (x - -57) / 12
  const w: XY[] = S([[-57, -26], [-45, -26], [-45, -18], [-57, -18]])
  const [w0, w1, w2, w3] = w
  copper.quad([w0[0], w0[1], zw(-57)], [w3[0], w3[1], zw(-57)], [w2[0], w2[1], zw(-45)], [w1[0], w1[1], zw(-45)])
  copper.tri([w0[0], w0[1], zw(-57)], [w1[0], w1[1], zw(-45)], [w1[0], w1[1], PROW0])
  copper.tri([w3[0], w3[1], zw(-57)], [w2[0], w2[1], PROW0], [w2[0], w2[1], zw(-45)])
}
// level 2 under the prow: a recessed glazed band
{
  const r = S([[-53, -24], [-45, -24], [-45, -18], [-53, -18]])
  walls(win, r, DECK, 8.6)
}

if (import.meta.main) {
  await save('clt-main-library', 'Charlotte Mecklenburg Library Main Library', ANCHOR, BEARING, [
    { part: ceramic, material: finish('cml-ceramic', 0xe4dfd7) },
    { part: win, material: PALETTE.window },
    { part: light, material: windowVariant(2, 0xb3c2cc) },
    { part: green, material: finish('cml-planting', 0xa3ae8c) },
    { part: roof, material: PALETTE.roof },
    { part: copper, material: finish('cml-copper', 0xb98266) },
  ])
}
