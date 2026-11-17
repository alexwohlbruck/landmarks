/**
 * 609 Main at Texas (2017, Pickard Chilton with Kendall/Heaton), Houston —
 * original procedural geometry, CC0-1.0.
 * bun generators/hou-609-main.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/503660106,
 * 29.759155,-95.362524. Its long walls run at 124.9° (the downtown grid),
 * so the catalog bearing is 34.9 and the plan is square to the frame:
 * model +x faces east-south-east (Fannin Street), -x west-north-west
 * (Main Street), +y north-north-east (Texas Avenue), -y Prairie side.
 *
 * Identity, in order: the single roof plane falling 27 m from the Main
 * Street end to the Fannin end, so the long faces end in a sloped edge; the
 * two great triangular facets that cut the Main Street corners, each from
 * the roof down to a point at the street corner, which draw the diagonal
 * crease up the long faces; the light, finely finned glass skin; the dark
 * open mechanical court at the high end of the roof; the shallow chamfered
 * corners at the Fannin end.
 *
 * Evidence:
 *  - plan and heights: USGS 3DEP lidar TX_Coastal_B1_2018 (flown 2018, the
 *    tower was finished in 2017), 0.5 m grid read in the turned frame. The
 *    slab runs x -39.9..37.3, y -18.5..18.5 (OSM's outline: the same, with
 *    its east face at 36.3). The street is 0.5 m above ground_min; heights
 *    below are above the street.
 *      * roof: one plane, 229.0 m at the west face falling 0.343 m per metre
 *        to 202.6 m at the east face (measured along the whole length;
 *        published height 230 m, 48 floors, Wikipedia/CTBUH). OSM tags a
 *        skillion facing 130°, which agrees in direction; its roof:height 20
 *        is smaller than the measured 26.4 m fall.
 *      * west corners: the lidar surface there falls steeply from the roof
 *        line along the OSM chamfer, (-39.9, ±9.5) to (-17.7, ±18.5), towards
 *        the outer corner, its contours running parallel to the chamfer:
 *        each corner is cut by one leaning plane through the chamfer line
 *        at the roof and the street corner. Fitting that plane to the
 *        points puts its foot within ~15 m of the street, drawn at the
 *        street. Xnatedawgx's 2021 photo shows the crease this cut makes on
 *        the long face, rising from a glass lobby at the corner, and the
 *        skyline photos from the west show the facet as a separate plane.
 *      * the court: a recess at the high end of the roof, x -39.9..-22.5,
 *        |y| <= 8, floor ~210.5 m, open through the top of the west face
 *        (the west wall's top reads 210-216 m between rims at 229 m on the
 *        lidar); it is the dark notch at the top of the west face in both
 *        skyline photos from the west.
 *      * east corners chamfered from (27, ±18.5) to (37.3, ±14.6): OSM and
 *        the lidar roof edge; drawn vertical (Adavyd's 2015 photos of the
 *        Fannin end show the corner set back full height).
 *  - lobby: the facet's foot is the glass lobby in Xnatedawgx's photo, its
 *    apex about a fifth of the way up (estimate, ~45 m): drawn darker glass.
 *  - fins: every photo shows close-set pale vertical fins over the whole
 *    curtain wall (Adavyd's close views of the base, Xnatedawgx's). Drawn as
 *    pale trim fins at a 6 m pitch, 0.4 m wide, 0.45 m deep, a fraction of
 *    the real density so they read without shimmer.
 *  - colours: the glass reads pale silvery blue in the skyline photos and
 *    light blue in Xnatedawgx's: a light window variant #a3bdd3. Fins
 *    trim. The court's walls a dark grey #5d6670 (the notch reads near
 *    black in the skyline photos, pulled up to charcoal), its floor the
 *    palette roof; the lobby the palette window.
 *  - night: an office tower; the curtain wall glows (window-2), the lobby
 *    (window) too.
 *
 * Ground: Houston is flat here (Mapterhorn relief < 0.5 m); elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE; licences checked on each file
 * page):
 *  - 609_Main_at_Texas_2021-08-10.jpg, Xnatedawgx, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:609_Main_at_Texas_2021-08-10.jpg
 *  - 609_Main_Street_at_Texas_Downtown_Houston_DSC_7813_ad.JPG and
 *    _DSC_7811_ad.JPG, Adavyd, CC BY-SA 4.0 (2015, under construction: base,
 *    fins and the Fannin end only)
 *    https://commons.wikimedia.org/wiki/File:609_Main_Street_at_Texas_Downtown_Houston_DSC_7813_ad.JPG
 *    https://commons.wikimedia.org/wiki/File:609_Main_Street_at_Texas_Downtown_Houston_DSC_7811_ad.JPG
 *  - Downtown_Houston,_TX_Skyline_-_2018.jpg, David Daniel Turner, CC BY 4.0
 *    (from the west, over Buffalo Bayou)
 *    https://commons.wikimedia.org/wiki/File:Downtown_Houston,_TX_Skyline_-_2018.jpg
 *  - Houston_Texas_Skyline_and_the_Buffalo_Bayou_(54182707440).jpg, Tony
 *    Webster, CC BY 2.0 (from the west)
 *    https://commons.wikimedia.org/wiki/File:Houston_Texas_Skyline_and_the_Buffalo_Bayou_(54182707440).jpg
 * Lidar: USGS 3DEP TX_Coastal_B1_2018 (public domain). No look-only
 * sources; no commercial imagery.
 *
 * Doubts: no licensed photo of the finished tower from the east or south;
 * the Fannin end and the Prairie face are drawn from lidar and the 2015
 * construction photos. The facets' foot and the lobby height are estimates.
 * The fins are drawn far sparser than built. The ground-floor colonnade
 * (Adavyd) is left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { save, triangulate, type XY } from './chi-aon-center'

const glass = new Part(), fin = new Part(), roof = new Part(), lobby = new Part(), screen = new Part()

const W = -39.9, E = 37.3, H = 18.5
const zr = (x: number) => 229.0 - 0.343 * (x - W) // the roof plane
const CW: XY = [-17.7, 9.5] // west chamfer: (W, ±CW[1]) to (CW[0], ±H) at the roof
const CE: XY = [27.0, 14.6] // east chamfer: (CE[0], ±H) to (E, ±CE[1])
const LOBBY = 45

/** Fill a planar convex-ish polygon (counter-clockwise seen from outside). */
function poly(p: Part, pts: V3[]) {
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1])
}

// Roof outline at the top, counter-clockwise from above.
const top: XY[] = [[W, -CW[1]], [CW[0], -H], [CE[0], -H], [E, -CE[1]], [E, CE[1]], [CE[0], H], [CW[0], H], [W, CW[1]]]

// ---- Walls.
for (const s of [1, -1]) {
  // Long faces: from the street corner at W, along the street to the east
  // chamfer, up to the roof, back along the sloped roof edge to the
  // facet's top, and down the crease.
  const Y = s * H
  const face: V3[] = [[W, Y, 0], [CE[0], Y, 0], [CE[0], Y, zr(CE[0])], [CW[0], Y, zr(CW[0])]]
  poly(glass, s > 0 ? [...face].reverse() : face)
  // East chamfers, vertical.
  const ch: V3[] = [[CE[0], Y, 0], [E, s * CE[1], 0], [E, s * CE[1], zr(E)], [CE[0], Y, zr(CE[0])]]
  poly(glass, s > 0 ? [...ch].reverse() : ch)
  // West facets: the street corner up to the chamfer line at the roof. The
  // lobby is the part below LOBBY.
  const P0: V3 = [W, Y, 0], P1: V3 = [CW[0], Y, zr(CW[0])], P2: V3 = [W, s * CW[1], zr(W)]
  const at = (a: V3, b: V3, z: number): V3 => { const t = z / b[2]; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, z] }
  const L1 = at(P0, P1, LOBBY), L2 = at(P0, P2, LOBBY)
  const tri = (p: Part, a: V3, b: V3, c: V3) => (s > 0 ? p.tri(a, c, b) : p.tri(a, b, c))
  tri(lobby, P0, L1, L2)
  tri(glass, L1, P1, P2)
  tri(glass, L1, P2, L2)
}
// West face: between the two facets, open at the top where the court
// breaks through it (the dark notch in the skyline photos from the west).
const COURT = { x1: -22.5, y: 8, z: 210.5 }
{
  const e = H - (H - CW[1]) * COURT.z / zr(W) // the facet edge's |y| at the court floor
  poly(glass, [[W, -H, 0], [W, -e, COURT.z], [W, e, COURT.z], [W, H, 0]])
  poly(glass, [[W, -e, COURT.z], [W, -CW[1], zr(W)], [W, -COURT.y, zr(W)], [W, -COURT.y, COURT.z]])
  poly(glass, [[W, COURT.y, COURT.z], [W, COURT.y, zr(W)], [W, CW[1], zr(W)], [W, e, COURT.z]])
}
// East face.
poly(glass, [[E, -CE[1], 0], [E, CE[1], 0], [E, CE[1], zr(E)], [E, -CE[1], zr(E)]])

// ---- Roof: the plane, with the open court at the high end.
function clip(r: XY[], keep: (p: XY) => number): XY[] {
  // Sutherland–Hodgman against one half-plane keep(p) >= 0 (linear in p).
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], fa = keep(a), fb = keep(b)
    if (fa >= 0) out.push(a)
    if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]) }
  }
  return out
}
const roofPiece = (r: XY[]) => { if (r.length >= 3) for (const [a, b, c] of triangulate(r)) roof.tri([r[a][0], r[a][1], zr(r[a][0])], [r[b][0], r[b][1], zr(r[b][0])], [r[c][0], r[c][1], zr(r[c][0])]) }
roofPiece(clip(top, p => p[0] - COURT.x1))
const westPart = clip(top, p => COURT.x1 - p[0])
roofPiece(clip(westPart, p => p[1] - COURT.y))
roofPiece(clip(westPart, p => -COURT.y - p[1]))
// The court, open to the west: dark side and back walls, a floor.
{
  const { x1, y, z } = COURT
  screen.quad([x1, -y, zr(x1)], [x1, y, zr(x1)], [x1, y, z], [x1, -y, z]) // back wall, facing west
  screen.quad([x1, y, zr(x1)], [W, y, zr(W)], [W, y, z], [x1, y, z]) // north side, facing south
  screen.quad([W, -y, zr(W)], [x1, -y, zr(x1)], [x1, -y, z], [W, -y, z]) // south side, facing north
  roof.quad([W, -y, z], [x1, -y, z], [x1, y, z], [W, y, z])
}

// ---- Fins: pale vertical fins at a 6 m pitch, up to the roof edge (and,
// on the long faces, no higher than the crease).
const FW = 0.2, FD = 0.45
function finAt(base: XY, along: XY, out: XY, z1: number) {
  const q = (u: number, o: number, z: number): V3 => [base[0] + along[0] * u + out[0] * o, base[1] + along[1] * u + out[1] * o, z]
  const z0 = 0.6
  fin.quad(q(-FW, FD, z0), q(FW, FD, z0), q(FW, FD, z1), q(-FW, FD, z1)) // front
  fin.quad(q(FW, 0, z0), q(FW, FD, z0), q(FW, FD, z1), q(FW, 0, z1)) // side
  fin.quad(q(-FW, FD, z0), q(-FW, 0, z0), q(-FW, 0, z1), q(-FW, FD, z1)) // side
  fin.quad(q(-FW, FD, z1), q(FW, FD, z1), q(FW, 0, z1), q(-FW, 0, z1)) // top
}
for (const s of [1, -1]) {
  for (let x = -33; x < CE[0] - 1; x += 6) {
    const crease = (x - W) / (CW[0] - W) * zr(CW[0])
    const z1 = Math.min(zr(x), crease) - 0.3
    if (z1 < 8) continue
    finAt([x, s * H], [-s, 0], [0, s], z1)
  }
}
for (let y = -6; y <= 6; y += 6) {
  finAt([W, y], [0, -1], [-1, 0], COURT.z - 0.3)
  finAt([E, y], [0, 1], [1, 0], zr(E) - 0.3)
}

await save('hou-609-main', '609 Main at Texas', [29.759155, -95.362524], 34.9, [
  { part: glass, material: windowVariant(2, 0xa3bdd3) },
  { part: fin, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: lobby, material: PALETTE.window },
  { part: screen, material: finish('main609-court', 0x5d6670) },
])
