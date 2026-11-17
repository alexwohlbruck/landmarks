/**
 * Heritage Plaza (1111 Bagby Street, 1987, M. Nasr & Partners), Houston —
 * original procedural geometry, CC0-1.0.
 * bun generators/hou-heritage-plaza.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/1512782864,
 * 29.758784,-95.370724. The slab's long walls run at 34.9° (the downtown
 * grid), so the catalog bearing is 34.9 and the plan is square to the frame:
 * model +y faces north-north-east (towards Tranquillity Park), +x faces
 * east-south-east, -x faces Bagby Street and Sam Houston Park.
 *
 * Identity, in order: the stepped Mayan-temple crown, a granite ziggurat
 * climbing to a flat-topped temple over the middle of the slab; on each long
 * face the granite "inverted stepped pyramid" of dark windows hanging under
 * the crown into the glass; the stepped glass terraces at both ends of the
 * slab, falling away from the temple; the plain blue glass slab.
 *
 * Evidence:
 *  - plan: lidar (below) shows a clean 34.6 x 77.2 m slab, read in the turned
 *    frame at x -17.2..17.4, y -38.6..38.6; drawn 34.6 x 77.2 m centred on the
 *    anchor. OSM's outline is the same rectangle but runs 2.4 m further
 *    north-north-east (y 41); the lidar edge is used.
 *  - heights: USGS 3DEP lidar TX_Coastal_B1_2018 (flown 2018), 0.5 m grid,
 *    read in the model frame. The street round the slab stands 4.4 m above
 *    ground_min; every height below is above that street.
 *      * the middle of the slab (|y| <= 27.5): eaves 197.6 m;
 *      * the ends (27.5 < |y| <= 38.6): a 3 x 3 grid of flat glass terraces
 *        each 4 m apart, lowest at the far end and on the -x side: 175.6 m
 *        at the outer -x corner up to 191.6 m beside the middle on the +x
 *        side (the lidar steps are at x = -6.5 and 4.5, |y| = 35 and 31.5);
 *      * over the middle a ziggurat with 2 m risers, each set back about
 *        1 m across and 1-1.5 m along: 199.6, 201.6, 203.6, 205.6, 207.6 m;
 *        on the long faces a steeper granite stair climbs to the temple,
 *        flush with the facade: 201.6 m for |y| <= 16.5 up to 210 m for
 *        |y| <= 8.5;
 *      * the temple: a ring of 2-2.5 m walls at 217.3 m round a court at
 *        210-212 m, with its front walls on both long faces (|y| <= 7.5) and
 *        beams across at |y| 8.5-11. Lidar top 217.3 m. Published height is
 *        232 m (762 ft, 53 floors; Wikipedia, CTBUH); no lidar return
 *        reaches above 217.4 m, so the model follows the lidar and the
 *        published figure is noted as a doubt.
 *    OSM's part heights (214, 223, 225, 229, 235 m on way/1511778219-222)
 *    disagree with both and were not used.
 *  - the hanging granite V on each long face: Taruru's close photos
 *    (Heritage_Plaza_01 and _03, from the -x/+x faces) scaled against the
 *    77.2 m face and the lidar eave: outer steps 8.8 and 11.2 m below the
 *    eave (|y| 22.5-27.5), then 14 m (|y| 14.5-22.5), 16.7 m (|y| 7.7-14.5)
 *    and the centre tab 20.6 m (|y| <= 7.7); a big central window and tall
 *    dark slots between granite piers, with a band of small windows near the
 *    eave (estimates, from the same photos).
 *  - the two dark lines down each long face (every photo) are drawn as the
 *    centre bay, |y| <= 7.7, set back 0.6 m from base to the V: the edges read
 *    as shadow lines, as in the photos. Estimate.
 *  - colours: the curtain wall reads mid sky-blue in every daylight photo
 *    (Tammra's, Taruru's, Another Believer's), lighter than the palette
 *    window: a light window variant #86a9cc. The granite is a light neutral
 *    grey (#c4c2bc in sun, Taruru 01): #cdcac3. The crown's windows are the
 *    palette window. The terraces' sloped glazing reads pale grey-blue
 *    (Taruru 01, the treads beside the granite pyramid): the palette glass.
 *  - night: office windows lit (window-2) and the crown's windows (window).
 *    The crown granite carries a light floodlight, brightest at the temple.
 *
 * Ground: Houston is flat here; elevation 0. The 14 m podium east of the
 * slab (way/260361699) and the garages are separate buildings, not modelled.
 *
 * Photos (Wikimedia Commons, all EVIDENCE; licences checked on each file
 * page):
 *  - Heritage_Plaza_01.JPG, Taruru, public domain
 *    https://commons.wikimedia.org/wiki/File:Heritage_Plaza_01.JPG
 *  - Heritage_Plaza_03.JPG, Taruru, public domain
 *    https://commons.wikimedia.org/wiki/File:Heritage_Plaza_03.JPG
 *  - Heritage_Plaza_04.JPG, Taruru, public domain
 *    https://commons.wikimedia.org/wiki/File:Heritage_Plaza_04.JPG
 *  - Heritage_Plaza,_Downtown_Houston.jpg, Tammra, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Heritage_Plaza,_Downtown_Houston.jpg
 *  - Heritage_Plaza_Building_Houston_Texas.jpg, W0lfie, CC BY-SA 2.5
 *    https://commons.wikimedia.org/wiki/File:Heritage_Plaza_Building_Houston_Texas.jpg
 *  - Heritage_Plaza_Building.jpg, Rick Kimpel, CC BY-SA 2.0 (from
 *    Tranquillity Park, north-north-east)
 *    https://commons.wikimedia.org/wiki/File:Heritage_Plaza_Building.jpg
 *  - Heritage_Plaza,_Houston,_Texas_in_2012.JPG, Another Believer, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Heritage_Plaza,_Houston,_Texas_in_2012.JPG
 *  - Julia_Ideson_Building_&_Heritage_Plaza,_Houston,_TX.jpg, JStephanMease,
 *    CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Julia_Ideson_Building_%26_Heritage_Plaza,_Houston,_TX.jpg
 * Lidar: USGS 3DEP TX_Coastal_B1_2018 (public domain). No look-only sources;
 * no commercial imagery.
 *
 * Doubts: the 232 m published height against the 217.3 m lidar top; the
 * temple's lattice court is drawn as a flat glass floor; the curtain wall's
 * fine square mullion grid is left out (a few pale lines instead); the
 * V's window pattern is simplified; the corners' small re-entrant steps
 * seen in some photos are below lidar resolution and left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, panel, rect, save, walls, type XY } from './chi-aon-center'

const granite = new Part(), curtain = new Part(), dark = new Part(), glass = new Part(), trim = new Part()

const HX = 17.3, HY = 38.6 // half width (x) and half length (y)
const EAVE = 197.6 // the middle of the slab
const TOP = 217.3 // the temple
const BAY = 6.5, BAYD = 1.0 // centre bay half-width (the V's centre tab) and set-back

/** A box from z0 to z1 with its sides in `side` and its top in `top`. */
function box(side: Part, top: Part | null, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const r = rect(x0, y0, x1, y1)
  walls(side, r, z0, z1)
  if (top) cap(top, r, z1)
}
/** A box whose top edge is bevelled `b` into the top. */
function bbox(side: Part, top: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0.3) {
  const r = rect(x0, y0, x1, y1), ri = rect(x0 + b, y0 + b, x1 - b, y1 - b)
  walls(side, r, z0, z1 - b)
  walls(side, r, z1 - b, z1, ri)
  cap(top, ri, z1)
}

// ---------------------------------------------------------------------------
// The ends: a 3 x 3 grid of glass terraces each end, with granite copings.
const COLS: [number, number, number][] = [[-HX, -6.5, 0], [-6.5, 4.5, 1], [4.5, HX, 2]]
const ROWS: [number, number, number][] = [[35, HY, 0], [31.5, 35, 1], [27.5, 31.5, 2]]
const COPE = 1.1
for (const s of [1, -1]) for (const [x0, x1, c] of COLS) for (const [a, b, r] of ROWS) {
  const z = 175.6 + 4 * (c + r)
  const y0 = s > 0 ? a : -b, y1 = s > 0 ? b : -a
  box(curtain, null, x0, x1, y0, y1, 0, z - COPE)
  bbox(granite, glass, x0, x1, y0, y1, z - COPE, z, 0.25)
  // A dark band of the top floor's windows under each coping (Kimpel's and
  // W0lfie's photos of the end faces).
  const ring = rect(x0, y0, x1, y1)
  for (let k = 0; k < 4; k++) {
    const a = ring[k], b = ring[(k + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    panel(dark, a, b, 0.4, L - 0.4, z - COPE - 1.7, z - COPE - 0.2, 0.05)
  }
}

// ---------------------------------------------------------------------------
// The middle of the slab: glass up to the hanging granite V on the long
// faces, granite above it.
// V steps: for |y| from the listed value inwards to the next, its bottom.
// Measured on Taruru 03 (near face-on, 15.3 px/m across the 77.2 m face):
// the shoulder, where the V's outer edge meets the glass, 13 m under the
// eave; five steps a side, then the centre tab 20.5 m below the shoulder.
const SH = EAVE - 13
const V: [number, number][] = [[27.5, SH - 2], [22.5, SH - 5.5], [17.5, SH - 9], [13, SH - 12.5], [9.5, SH - 15.5], [BAY, SH - 20.5]]
const vBottom = (ay: number) => { let z = EAVE; for (const [y, b] of V) if (ay <= y + 1e-6) z = b; return z }
const vEdges = [...V.map(([y]) => -y), 0, ...V.map(([y]) => y).reverse()].filter((v, i, a) => a.indexOf(v) === i).sort((p, q) => p - q)

// End walls of the middle block (above the terraces) and its cap under the ziggurat.
for (const s of [1, -1]) {
  const y = s * 27.5
  const a: XY = s > 0 ? [HX, y] : [-HX, y], b: XY = s > 0 ? [-HX, y] : [HX, y]
  granite.quad([a[0], a[1], 170], [b[0], b[1], 170], [b[0], b[1], EAVE], [a[0], a[1], EAVE])
}
cap(granite, rect(-HX, -27.5, HX, 27.5), EAVE)

// Long faces, x = ±HX, piece by piece along y.
for (const s of [1, -1]) {
  const X = s * HX
  // From a to b counter-clockwise from above: +x face runs -y → +y.
  const seg = (y0: number, y1: number, z0: number, z1: number, p: Part, x = X) => {
    const [ya, yb] = s > 0 ? [y0, y1] : [y1, y0]
    p.quad([x, ya, z0], [x, yb, z0], [x, yb, z1], [x, ya, z1])
  }
  for (let i = 0; i < vEdges.length - 1; i++) {
    const y0 = vEdges[i], y1 = vEdges[i + 1], ym = Math.abs((y0 + y1) / 2)
    const zb = vBottom(ym)
    const inBay = ym < BAY
    const x = inBay ? X - s * BAYD : X
    seg(y0, y1, 0, zb, curtain, x)
    seg(y0, y1, zb, EAVE, granite)
    // The bay's set-back reaches up to the V: its soffit is the V's underside.
    if (inBay) {
      const [ya, yb] = s > 0 ? [y0, y1] : [y1, y0]
      granite.quad([X - s * BAYD, ya, zb], [X - s * BAYD, yb, zb], [X, yb, zb], [X, ya, zb])
    }
  }
  // The bay's side walls (the shadow lines).
  for (const ys of [BAY, -BAY]) {
    const inward = ys > 0 ? -1 : 1 // towards the bay
    const a: V3 = [X, ys, 0], b: V3 = [X - s * BAYD, ys, 0]
    const A: V3 = [X, ys, vBottom(BAY - 0.01)], B: V3 = [X - s * BAYD, ys, vBottom(BAY - 0.01)]
    // Face points along -inward... choose order so the normal points into the bay opening.
    const n = inward * s
    if (n > 0) curtain.quad(a, b, B, A); else curtain.quad(b, a, A, B)
  }

  // Windows in the V: the dark grid as one large panel per step, inside a
  // granite frame (1.2 m at the stepped lower edge, piers 1 m between
  // steps), split by one granite band, with a strip of small windows under
  // the eave.
  const wl = (y0: number, y1: number, z0: number, z1: number) => { if (z1 - z0 > 0.8) seg(y0, y1, z0, z1, dark, X + s * 0.05) }
  const BAND = SH + 1.4
  const cols: [number, number][] = [[-BAY + 0.6, BAY - 0.6]]
  for (let i = V.length - 1; i > 0; i--) {
    const a = V[i][0], b = V[i - 1][0]
    cols.push([a + 0.5, b - 0.5], [-b + 0.5, -a - 0.5])
  }
  for (const [y0, y1] of cols) {
    const zb = vBottom(Math.abs((y0 + y1) / 2)) + 1.2
    wl(y0, y1, zb, Math.min(BAND, EAVE - 3.6))
    wl(y0, y1, Math.max(zb, BAND + 1.0), EAVE - 3.6)
    wl(y0, y1, EAVE - 2.7, EAVE - 0.9)
  }
}

// A few pale lines on the glass: a floor line every six storeys.
for (const s of [1, -1]) for (let z = 48; z < 172; z += 48) {
  const X = s * (HX + 0.04)
  for (const [y0, y1, x] of [[-HY, -BAY, X], [BAY, HY, X], [-BAY, BAY, X - s * BAYD]] as [number, number, number][]) {
    const [ya, yb] = s > 0 ? [y0, y1] : [y1, y0]
    trim.quad([x, ya, z], [x, yb, z], [x, yb, z + 0.45], [x, ya, z + 0.45])
  }
  const Y = s * (HY + 0.04)
  const [xa, xb] = s > 0 ? [HX, -HX] : [-HX, HX]
  trim.quad([xa, Y, z], [xb, Y, z], [xb, Y, z + 0.45], [xa, Y, z + 0.45])
}

// ---------------------------------------------------------------------------
// The crown.
// Side ziggurat: glass treads set back across and along, granite risers' lips.
const ZIG: [number, number, number][] = [[15.6, 26.5, 199.6], [14.5, 25.5, 201.6], [13.5, 24.5, 203.6], [12.5, 23.0, 205.6], [11.0, 21.5, 207.6]]
for (const [hx, hy, z] of ZIG) bbox(granite, glass, -hx, hx, -hy, hy, z - 2.6, z, 0.25)
// Face stair: granite, full width, flush with the facade, narrowing to the temple.
const STAIR: [number, number, number][] = [[HX, 16.5, 201.6], [HX - 0.35, 12.5, 203.6], [HX - 0.7, 11.5, 205.6], [HX - 1.05, 9.5, 207.6], [HX - 1.4, 8.5, 210.0]]
for (const [hx, hy, z] of STAIR) bbox(granite, granite, -hx, hx, -hy, hy, z - 2.6, z, 0.25)
// The temple's court floor.
box(granite, glass, -11.5, 11.5, -12.5, 12.5, 205, 210.0)
// Temple walls: front walls on the long faces split by a seam, side wings,
// beams across.
const TH = TOP
for (const s of [1, -1]) {
  const x0 = s > 0 ? HX - 3.2 : -HX + 1.4, x1 = s > 0 ? HX - 1.4 : -HX + 3.2
  for (const [ya, yb] of [[-7.5, -0.45], [0.45, 7.5]]) bbox(granite, granite, x0, x1, ya, yb, 208, TH)
  bbox(granite, granite, x0 + 0.2, x1 - 0.2, -0.5, 0.5, 208, TH - 1.6, 0.2)
  // Wings: back from the front walls to the beams.
  const wx0 = s > 0 ? 8.5 : -HX + 3.2, wx1 = s > 0 ? HX - 3.2 : -8.5
  for (const sy of [1, -1]) bbox(granite, granite, wx0, wx1, sy > 0 ? 5.5 : -8.5, sy > 0 ? 8.5 : -5.5, 208, TH - 0.8)
  // Beams.
  bbox(granite, granite, -10, 10, s > 0 ? 8.5 : -11, s > 0 ? 11 : -8.5, 208, TH)
  // Pavilion windows, two to a front wall.
  const X = s > 0 ? x1 + 0.05 : x0 - 0.05
  for (const [ya, yb] of [[-6.2, -1.6], [1.6, 6.2]]) {
    const [p, q] = s > 0 ? [ya, yb] : [yb, ya]
    dark.quad([X, p, 211.4], [X, q, 211.4], [X, q, 215.2], [X, p, 215.2])
  }
}

await save('hou-heritage-plaza', 'Heritage Plaza', [29.758784, -95.370724], 34.9, [
  { part: granite, material: { ...finish('heritage-granite', 0xcdcac3), floodlight: (p: V3) => (p[2] > 186 ? Math.min(1, (p[2] - 186) / 25) * 0.8 : 0) } as never },
  { part: curtain, material: windowVariant(2, 0x86a9cc) },
  { part: dark, material: windowVariant(3, 0x4a5462) },
  { part: glass, material: PALETTE.glass },
  { part: trim, material: PALETTE.trim },
], 6500)
