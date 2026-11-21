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
 * - Heights: estimated from the renderings, scaled from 5 storeys. The
 *   upper volume's roof sweeps in one curve (exponent 1.4) from 17 m (about
 *   three storeys) at the theatre end to 30.5 m at the prow, and runs flat
 *   along 6th St; the level-1 glass stands 2.5 m back under a 6.3 m soffit,
 *   the level-2 deck and terrace at 7 m; prow soffit 11 m. No measured
 *   height exists. Rework (lead review): the stepped roof, the separate
 *   theatre-side block and the roof boxes were removed; the rooftop
 *   mechanical box in VIEW_2 is left out.
 * - Prow: 12 m along 6th St, 8 m along Tryon (VIEW_1 and VIEW_2 proportions).
 * - The fin wall's lean (6–7 m out over the level-2 terrace) and its concave
 *   curve: estimated from VIEW_1, VIEW_4 and the e-architect aerial.
 *
 * Checked against VIEW_1 and VIEW_2 rendered from the same sides (bearing
 * 316 and 255, eye level). Still differs: the renderings' fin wall is a
 * fine shingle of ceramic fins (drawn as a light glass plane with fourteen
 * pale fins and two floor lines); the
 * curved grey fascia at level 2 on 6th St is drawn straight; the plaza steps
 * and planting are left to the map.
 *
 * Doubts
 * - Everything rests on renderings, which may differ from what was built.
 *   The 2025 photos show the Tryon front clad in a pale checkered panel and
 *   glass pattern, more vertical than the renderings' fins; drawn as the
 *   renderings show it, in their light silvery tone.
 * - The NE (alley) and SE (midblock plaza) sides are not shown in any source:
 *   plain ceramic with a few window bands, invented.
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

const ceramic = new Part(), win = new Part(), light = new Part(), trim = new Part(), roof = new Part(), copper = new Part()

const PROW = 30.5, PROW0 = 11.0

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

// ---------------------------------------------------------------- level 1: recessed glass under a floating slab
// The slab (level 2's floor and terrace) runs out to the street lines; the glass stands 2.5 m back
// under its warm soffit (VIEW_1, VIEW_2).
const SLAB: XY[] = S([[-50, -25], [12, -25], [12, 20], [-55, 20], [-55, -19]])
const SOFFIT = 6.3, DECK = 7.0
{
  const glass = inset(SLAB, 2.5)
  walls(light, glass, 0, SOFFIT)
  // mullions every ~6 m on the glazed fronts (Tryon, the corner, 6th St); ceramic piers on the back sides
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
  // the slab: a thin silver-grey fascia, the warm soffit under it, the terrace on it and a low parapet
  walls(trim, SLAB, SOFFIT, DECK + 0.5)
  cap(copper, SLAB, SOFFIT, false)
  const lip = inset(SLAB, 0.4)
  for (let i = 0; i < SLAB.length; i++) {
    const j = (i + 1) % SLAB.length
    trim.quad([SLAB[i][0], SLAB[i][1], DECK + 0.5], [SLAB[j][0], SLAB[j][1], DECK + 0.5], [lip[j][0], lip[j][1], DECK + 0.5], [lip[i][0], lip[i][1], DECK + 0.5])
    trim.quad([lip[j][0], lip[j][1], DECK + 0.5], [lip[i][0], lip[i][1], DECK + 0.5], [lip[i][0], lip[i][1], DECK], [lip[j][0], lip[j][1], DECK])
  }
  cap(roof, lip, DECK)
}

// ---------------------------------------------------------------- the upper volume: one sweeping roof
// The roof edge rises from about three storeys at the theatre end (y = 15) to the prow's full height
// at the 6th St corner, curving (VIEW_1); flat along 6th St (VIEW_2).
const Y0 = -18, Y1 = 15, LOW = 17.0
const H = (y: number) => {
  const t = Math.min(1, Math.max(0, (Y1 - y) / (Y1 - Y0)))
  return LOW + (PROW - LOW) * Math.pow(t, 1.4)
}
const tOf = (y: number) => (y - Y0) / (Y1 - Y0)
// the Tryon skin: foot on the terrace, leaning 5 m out over it, slightly concave
const xBot = (y: number) => -45 + 1.5 * Math.sin(Math.PI * tOf(y))
const xTop = (y: number) => -50 + 1.5 * Math.sin(Math.PI * tOf(y))
const NSEG = 14
const ys = Array.from({ length: NSEG + 1 }, (_, i) => Y0 + (Y1 - Y0) * i / NSEG)
const XE = 12, YS = -25
{
  // the fin skin, one surface the full length of the upper volume
  for (let i = 0; i < NSEG; i++) {
    const ya = ys[i], yb = ys[i + 1]
    light.quad(P3(xBot(yb), yb, DECK), P3(xBot(ya), ya, DECK), P3(xTop(ya), ya, H(ya)), P3(xTop(yb), yb, H(yb)))
    // a pale fascia along the sweeping roof edge
    trim.quad(P3(xTop(yb) - 0.1, yb, H(yb) - 0.7), P3(xTop(ya) - 0.1, ya, H(ya) - 0.7), P3(xTop(ya) - 0.1, ya, H(ya) + 0.25), P3(xTop(yb) - 0.1, yb, H(yb) + 0.25))
  }
  // vertical ceramic fins, ~2.2 m apart, and two floor lines
  const nf = 15
  for (let k = 1; k < nf; k++) {
    const y = Y0 + (Y1 - Y0) * k / nf, w = 0.28
    const bt = P3(xBot(y), y, DECK + 0.3), tp = P3(xTop(y), y, H(y) - 0.8)
    const off = (q: V3, dy: number): V3 => [q[0] - 0.08, q[1] + dy, q[2]]
    trim.quad(off(bt, w), off(bt, -w), off(tp, -w), off(tp, w))
  }
  for (const f of [0.4, 0.7]) for (let i = 0; i < NSEG; i++) {
    const ya = ys[i], yb = ys[i + 1]
    const za = DECK + (H(ya) - DECK) * f, zb = DECK + (H(yb) - DECK) * f
    const xa = xBot(ya) + (xTop(ya) - xBot(ya)) * f - 0.08, xb = xBot(yb) + (xTop(yb) - xBot(yb)) * f - 0.08
    trim.quad(P3(xb, yb, zb - 0.2), P3(xa, ya, za - 0.2), P3(xa, ya, za + 0.2), P3(xb, yb, zb + 0.2))
  }
  // the theatre end of the lean: close the triangle
  ceramic.tri(P3(xBot(Y1), Y1, DECK), P3(xTop(Y1), Y1, H(Y1)), P3(xBot(Y1), Y1, H(Y1)))

  // the roof, in strips so it follows the curve; flat between the prow and 6th St
  for (let i = 0; i < NSEG; i++) {
    const ya = ys[i], yb = ys[i + 1]
    roof.quad(P3(xTop(ya), ya, H(ya)), P3(XE, ya, H(ya)), P3(XE, yb, H(yb)), P3(xTop(yb), yb, H(yb)))
  }
  roof.quad(P3(-45, YS, PROW), P3(XE, YS, PROW), P3(XE, Y0, PROW), P3(-45, Y0, PROW))

  // 6th St wall (flat-topped), the SE end (following the sweep) and the theatre-side wall (low)
  const sixthA: XY = S([[-45, YS]])[0], sixthB: XY = S([[XE, YS]])[0]
  ceramic.quad([sixthA[0], sixthA[1], DECK], [sixthB[0], sixthB[1], DECK], [sixthB[0], sixthB[1], PROW], [sixthA[0], sixthA[1], PROW])
  const seYs = [YS, ...ys]
  for (let i = 0; i < seYs.length - 1; i++) {
    const ya = seYs[i], yb = seYs[i + 1]
    ceramic.quad(P3(XE, ya, DECK), P3(XE, yb, DECK), P3(XE, yb, H(yb)), P3(XE, ya, H(ya)))
  }
  ceramic.quad(P3(XE, Y1, DECK), P3(xBot(Y1), Y1, DECK), P3(xBot(Y1), Y1, H(Y1)), P3(XE, Y1, H(Y1)))
  // the prow's back side down to the deck, between 6th St and the skin's start
  ceramic.quad(P3(-45, Y0, DECK), P3(-45, YS, DECK), P3(-45, YS, PROW0), P3(-45, Y0, PROW0))

  // 6th St openings: a long top strip window and tall slots, under folded ceramic hoods (VIEW_2)
  for (const [s0, s1, z0, z1] of [[9, 54, 25.0, 28.4], [13, 17, 12.0, 21.0], [30, 35, 11.0, 21.0], [47, 52, 9.0, 21.0]] as const) {
    panel(win, sixthA, sixthB, s0, s1, z0, z1, 0.05)
    const L = 0.9, h = 1.6
    const A = P3(-45 + s0, YS, z1), B = P3(-45 + s1, YS, z1), C = P3(-45 + s1, YS, z1 + h), D = P3(-45 + s0, YS, z1 + h)
    const Ao: V3 = [A[0], A[1] - L, A[2]], Bo: V3 = [B[0], B[1] - L, B[2]]
    ceramic.quad(A, B, Bo, Ao)
    ceramic.quad(Ao, Bo, C, D)
    ceramic.tri(A, Ao, D); ceramic.tri(B, C, Bo)
  }
  // SE end and theatre side: a few bands (no source shows them)
  const seA: XY = S([[XE, YS]])[0], seB: XY = S([[XE, Y1]])[0]
  for (let s = 3; s < 36; s += 9) panel(win, seA, seB, s, s + 5.5, 9.5, 14.8, 0.05)
  for (let s = 3; s < 18; s += 9) panel(win, seA, seB, s, s + 5.5, 17.0, 24.5, 0.05)
  const thA: XY = S([[XE, Y1]])[0], thB: XY = S([[xBot(Y1), Y1]])[0]
  for (let s = 4; s < 52; s += 10) panel(win, thA, thB, s, s + 6, 9.5, 14.6, 0.05)
}

// ---------------------------------------------------------------- the prow: glass, rounded, over a copper soffit
{
  const r = S(rrect(-57, -26, -45, -18, 2.4))
  walls(light, r, PROW0, PROW)
  cap(copper, r, PROW0, false)
  const ins = inset(r, 0.45)
  walls(trim, r, PROW, PROW + 0.4, ins)
  cap(roof, ins, PROW + 0.4)
  for (const z of [15.8, 20.6, 25.4]) walls(trim, inset(r, -0.06), z - 0.25, z + 0.25)
  walls(copper, inset(r, -0.05), PROW0, PROW0 + 0.8)
}

// level 2 under the prow: a recessed glazed band (VIEW_2)
{
  const r = S([[-53, -24], [-45, -24], [-45, -18], [-53, -18]])
  walls(ceramic, r, DECK, PROW0)
  panel(win, r[0], r[1], 0.3, 7.7, DECK + 0.4, PROW0 - 0.4, 0.05)
  panel(win, r[3], r[0], 0.3, 5.7, DECK + 0.4, PROW0 - 0.4, 0.05)
}

if (import.meta.main) {
  await save('clt-main-library', 'Charlotte Mecklenburg Library Main Library', ANCHOR, BEARING, [
    { part: ceramic, material: finish('cml-ceramic', 0xe8e3db) },
    { part: win, material: PALETTE.window },
    { part: light, material: windowVariant(2, 0xa9bfd1) },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: copper, material: finish('cml-copper', 0xb98266) },
  ])
}
