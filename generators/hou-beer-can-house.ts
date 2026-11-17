/**
 * Beer Can House (222 Malone Street, Houston; John Milkovisch, 1968-88,
 * restored by the Orange Show Center for Visionary Art, 2008) — original
 * procedural geometry, CC0-1.0.
 * bun generators/hou-beer-can-house.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Bearing 0. Anchor = centroid of OSM way/874518448 ("Beer Can
 * House", wikidata Q4879943; a Microsoft footprint, 17.7 x 8.0 m),
 * 29.7637730, -95.4190145. The house faces west onto Malone Street.
 *
 * Identity: a small front-gabled bungalow wholly clad in flattened beer
 * cans (a silvery, mottled metal skin), with curtains of strung can lids
 * and pull-tabs hanging from every eave and gable rake, a smaller front
 * gable over the porch, and the can-and-marble fence with square pillars
 * along the front yard. The surface is the identity; it is drawn as
 * colour and as one bold fringe band with a zigzag hem under every eave.
 *
 * Evidence:
 *  - USGS 3DEP lidar TX_Coastal_B1_2018 (flown 2018), 0.5 m grid in this
 *    frame; ground 0.6 m over the grid minimum. Measured above the ground:
 *    the house x -8.6..9.3, y -4.5..4.3 (eaves), matching OSM; ridge E-W at
 *    y 0, 5.8 m; eaves 3.4 m at y +-4.3 (roof pitch ~31 deg); the front
 *    gable at the west end, lower (4.5 m), over y -3.5..0.5; the fence and
 *    pillars 1.3-2.1 m at x -12..-13.
 *  - photos: the front gable sits south of centre and in front of the main
 *    gable (Andrew Wiseman, amanderson2, TexasExplorer98); fringes along the
 *    rakes and along the north side eave (NZ Russ); the fence of can panels
 *    between square pillars with gates on the north (Highsmith, Russ).
 *  - estimated from the photos: front gable 5.6 m wide (y -4.3..1.3),
 *    1.2 m deep, eaves 3.0 m, ridge 4.9 m (Wiseman's front photo puts its ridge ~0.8 m under the main one; lidar's 4.5 is the rake); fringe 1.5 m deep (photos show
 *    1-2 m strings); fence 1.6 m with 2.1 m pillars every ~2.8 m.
 *  - colours sampled from several photos: can cladding #b2b3ad,
 *    #9c9f9c, #c9cbc6 (Wiseman, Highsmith, gruntzooki) -> drawn #b6b9b5 (a little under the lids, as the photos show the wall darker behind the curtains);
 *    hanging lids brighter #d6d8d6 in sun -> drawn #e4e6e4; roof shingles
 *    dark brown-grey #5f5650 (Russ, TexasExplorer98) -> drawn #8a7d72 at
 *    the palette's lightness; door and trim dark brown -> #6a5a4c.
 *
 * Photos (all evidence):
 *  - "Beer Can House.jpg", Andrew Wiseman, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Beer_Can_House.jpg
 *  - "Beer can house.jpg", NZ Russ, CC BY-SA 2.0
 *    https://commons.wikimedia.org/wiki/File:Beer_can_house.jpg
 *  - "Quirky beer can house, Houston, Texas", Carol M. Highsmith, public domain
 *    https://commons.wikimedia.org/wiki/File:Quirky_beer_can_house,_Houston,_Texas_LCCN2011630520.tif
 *  - "Beer Can House closeup.jpg", BrokenSegue, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Beer_Can_House_closeup.jpg
 *  - "Beer Can House, Houston, Texas", TexasExplorer98, CC BY 2.0
 *    https://www.flickr.com/photos/76792851@N07/8301316811
 *  - "Beer-can house, Houston, TX" and "... 6", gruntzooki, CC BY-SA 2.0
 *    https://www.flickr.com/photos/37996580417@N01/2986042076
 *    https://www.flickr.com/photos/37996580417@N01/2986144744
 *  - "Keith at Beer Can House Houston", amanderson2, CC BY 2.0
 *    https://www.flickr.com/photos/49399018@N00/4381092816
 *  USGS NAIP for the roof colour and plan. Mapterhorn terrain: flat.
 *  No commercial imagery.
 *  Look-only (NC licences, not used for shape): Mr. Kimberly and
 *  MrSchuReads on Flickr (CC BY-NC-SA 2.0).
 *
 * Left out: individual cans and strings, the marbles and rocks set in the
 * yard and the fence, the ladder, signs, the garage-shed behind.
 *
 * Doubts: the back (east) end and the south side are in no licensed photo
 * (drawn plain, with the fringe continued); the window positions are
 * estimated; the fence's exact line. At 80 px this is a small grey-silver
 * gabled house: the fringe reads at 200 px and up, not at 80.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { cap, save, type XY } from './chi-aon-center'

function wallSeg(p: Part, a: XY, b: XY, z0: number, z1: number, max = 5) {
  const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / max))
  for (let k = 0; k < n; k++) {
    const t0 = k / n, t1 = (k + 1) / n
    const A: XY = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0]
    const B: XY = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]
    p.quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1])
  }
}
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  r.forEach((a, i) => wallSeg(p, a, r[(i + 1) % 4], z0, z1))
  cap(p, r, z1)
}
/** Both faces of a quad (for thin hanging curtains). */
function quad2(p: Part, a: V3, b: V3, c: V3, d: V3) { p.quad(a, b, c, d); p.quad(d, c, b, a) }

/**
 * A curtain of hanging cans under the edge a→b: a band `drop` deep with a
 * zigzag hem, `n` teeth, drawn double-sided.
 */
function fringe(p: Part, a: V3, b: V3, drop: number, n: number) {
  const L = (t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
  for (let k = 0; k < n; k++) {
    const t0 = k / n, t1 = (k + 1) / n, tm = (t0 + t1) / 2
    const A = L(t0), B = L(t1), M = L(tm)
    const A1: V3 = [A[0], A[1], A[2] - drop * 0.6], B1: V3 = [B[0], B[1], B[2] - drop * 0.6]
    const M1: V3 = [M[0], M[1], M[2] - drop]
    quad2(p, A1, B1, B, A)
    p.tri(A1, M1, B1); p.tri(B1, M1, A1)
  }
}

// ---------------------------------------------------------------------------

const X0 = -8.84, X1 = 8.84, WY = 4.0 // walls
const OV = 0.35 // eave and rake overhang
const EAVE = 3.4, RIDGE = 5.8
const F = { x0: -10.05, y0: -4.3, y1: 1.3, eave: 3.0, ridge: 4.9 } // front gable
const DROP = 1.5

function build() {
  const can = new Part(), lids = new Part(), roof = new Part(), win = new Part(), dark = new Part()

  // ---- main house: walls and gable ends
  wallSeg(can, [X0, -WY], [X1, -WY], 0, EAVE)
  wallSeg(can, [X1, -WY], [X1, WY], 0, EAVE)
  wallSeg(can, [X1, WY], [X0, WY], 0, EAVE)
  wallSeg(can, [X0, WY], [X0, -WY], 0, EAVE)
  can.tri([X1, -WY, EAVE], [X1, WY, EAVE], [X1, 0, RIDGE])
  can.tri([X0, WY, EAVE], [X0, -WY, EAVE], [X0, 0, RIDGE])
  // roof: two slopes with overhangs, and a thin fascia
  const ye = WY + OV, ze = EAVE - OV * (RIDGE - EAVE) / WY
  const xa = X0 - OV, xb = X1 + OV
  for (const s of [-1, 1]) {
    const A: V3 = [xa, s * ye, ze], B: V3 = [xb, s * ye, ze], C: V3 = [xb, 0, RIDGE], D: V3 = [xa, 0, RIDGE]
    if (s < 0) roof.quad(A, B, C, D); else roof.quad(B, A, D, C)
    // underside of the slope (seen from below the eaves)
    const lo = 0.15
    const A2: V3 = [A[0], A[1], A[2] - lo], B2: V3 = [B[0], B[1], B[2] - lo], C2: V3 = [C[0], C[1], C[2] - lo], D2: V3 = [D[0], D[1], D[2] - lo]
    if (s < 0) roof.quad(D2, C2, B2, A2); else roof.quad(C2, D2, A2, B2)
    // fascia along the eave
    if (s < 0) roof.quad(A2, B2, B, A); else roof.quad(B2, A2, A, B)
  }
  // rake fascias at the two gable ends
  for (const x of [xa, xb]) {
    const sgn = x < 0 ? -1 : 1
    for (const s of [-1, 1]) {
      const P0: V3 = [x, s * ye, ze], P1: V3 = [x, 0, RIDGE]
      const q: V3[] = [P0, P1, [x, 0, RIDGE - 0.15], [x, s * ye, ze - 0.15]]
      if ((sgn > 0) === (s > 0)) roof.quad(q[0], q[1], q[2], q[3]); else roof.quad(q[3], q[2], q[1], q[0])
    }
  }

  // ---- front gable over the porch (west)
  const fy0 = F.y0, fy1 = F.y1, fc = (fy0 + fy1) / 2, fw = (fy1 - fy0) / 2
  wallSeg(can, [F.x0, fy0], [X0, fy0], 0, F.eave)
  wallSeg(can, [F.x0, fy1], [F.x0, fy0], 0, F.eave)
  wallSeg(can, [X0, fy1], [F.x0, fy1], 0, F.eave)
  can.tri([F.x0, fy1, F.eave], [F.x0, fy0, F.eave], [F.x0, fc, F.ridge])
  const fye = fw + OV, fze = F.eave - OV * (F.ridge - F.eave) / fw, fxa = F.x0 - OV, fxb = X0 + 1.5
  for (const s of [-1, 1]) {
    const A: V3 = [fxa, fc + s * fye, fze], B: V3 = [fxb, fc + s * fye, fze], C: V3 = [fxb, fc, F.ridge], D: V3 = [fxa, fc, F.ridge]
    if (s < 0) roof.quad(A, B, C, D); else roof.quad(B, A, D, C)
    const lo = 0.15
    const A2: V3 = [A[0], A[1], A[2] - lo], B2: V3 = [B[0], B[1], B[2] - lo], C2: V3 = [C[0], C[1], C[2] - lo], D2: V3 = [D[0], D[1], D[2] - lo]
    if (s < 0) roof.quad(D2, C2, B2, A2); else roof.quad(C2, D2, A2, B2)
    const q: V3[] = [A, D, D2, A2]
    if (s > 0) roof.quad(q[0], q[1], q[2], q[3]); else roof.quad(q[3], q[2], q[1], q[0])
  }
  // front door under the porch gable
  dark.quad([F.x0 - 0.05, fc + 0.55, 0.6], [F.x0 - 0.05, fc - 0.55, 0.6], [F.x0 - 0.05, fc - 0.55, 2.6], [F.x0 - 0.05, fc + 0.55, 2.6])
  // porch steps / raised floor lip
  box(dark, F.x0 - 0.9, fc - 0.9, 0, F.x0, fc + 0.9, 0.35)

  // ---- windows (estimated): three on each long side, one in the north front
  for (const x of [-5.5, -1.0, 4.5]) {
    win.quad([x - 0.5, -WY - 0.05, 1.2], [x + 0.5, -WY - 0.05, 1.2], [x + 0.5, -WY - 0.05, 2.6], [x - 0.5, -WY - 0.05, 2.6])
    win.quad([x + 0.5, WY + 0.05, 1.2], [x - 0.5, WY + 0.05, 1.2], [x - 0.5, WY + 0.05, 2.6], [x + 0.5, WY + 0.05, 2.6])
  }
  win.quad([X0 - 0.05, 3.2, 1.2], [X0 - 0.05, 2.0, 1.2], [X0 - 0.05, 2.0, 2.6], [X0 - 0.05, 3.2, 2.6])

  // ---- the hanging can curtains: under every eave and rake
  const d = 0.05
  // main side eaves
  for (const s of [-1, 1]) fringe(lids, [xa, s * (ye - d), ze - 0.15], [xb, s * (ye - d), ze - 0.15], DROP, 14)
  // main gable rakes (east end full; west end above the front gable)
  for (const x of [xa + d, xb - d]) {
    for (const s of [-1, 1]) fringe(lids, [x, s * ye, ze - 0.15], [x, 0, RIDGE - 0.15], DROP, 6)
  }
  // front gable rakes
  for (const s of [-1, 1]) fringe(lids, [fxa + d, fc + s * fye, fze - 0.15], [fxa + d, fc, F.ridge - 0.15], DROP * 0.9, 4)

  // ---- the can fence along the front yard, pillars every ~2.8 m
  const FX = -12.6, FY0 = -4.6, FY1 = 3.0
  box(can, FX - 0.12, FY0, 0, FX + 0.12, FY1, 1.6)
  const n = Math.round((FY1 - FY0) / 2.8)
  for (let k = 0; k <= n; k++) {
    const y = FY0 + (k * (FY1 - FY0)) / n
    box(lids, FX - 0.3, y - 0.3, 0, FX + 0.3, y + 0.3, 2.1)
  }

  return [
    { part: can, material: finish('beer-can-cladding', 0xb6b9b5, 0.5) },
    { part: lids, material: finish('beer-can-lids', 0xe4e6e4, 0.4) },
    { part: roof, material: finish('beer-can-roof', 0x8a7d72) },
    { part: win, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
    { part: dark, material: finish('beer-can-trim', 0x6a5a4c) },
  ]
}

if (import.meta.main) await save('hou-beer-can-house', 'Beer Can House', [29.763773, -95.4190145], 0, build())
