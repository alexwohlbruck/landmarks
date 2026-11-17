/**
 * Livestock Exchange Building, 131 East Exchange Avenue, Fort Worth
 * Stockyards, 1902-03 (Mission Revival) — original procedural geometry,
 * CC0-1.0. bun generators/dal-livestock-exchange.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM multipolygon relation/7321195
 * (building=yes, 131 East Exchange Avenue: outer way/56029794, light courts
 * way/499180510 and way/499180511), 32.7894622, -97.3467290. The named OSM
 * node/4273376249 ("Livestock Exchange Building", 131 E Exchange Ave) sits
 * inside it; the address, the Texas Historical Commission marker on the lawn
 * (photo below) and every photo confirm the building. Its walls run 0.4° off
 * north, so the catalog bearing is 0.4. The front faces south, over a lawn,
 * to Exchange Avenue.
 *
 * Identity, in order: the curved Mission parapets (the big central gable
 * over the front, a smaller one on each end pavilion); the red tile hipped
 * roofs; the one-storey arcade of round arches between the two-storey end
 * pavilions; the central red cupola tower with its green dome; the
 * cream-yellow stucco.
 *
 * Plan (OSM, made symmetric about x = 0.25): end pavilions 18.3 x 30.9 m
 * (x -34.7..-16.4 and 16.9..35.2, y -24.6..6.3); the one-storey arcade range
 * across the front between them (y -24.6..-16.9); the two open light courts
 * behind it (OSM inner ways; open to the ground in the lidar) either side of
 * a one-storey entrance spine (x -2.95..3.45); the two-storey north range
 * (y -8.3..6.3) carrying the central gable; the later flat-roofed annex
 * behind (OSM outer way, x -12.8..12.25 to y 39.5). One-storey strips behind
 * the pavilions to y 10 come from the lidar and NAIP (OSM stops at 6.3-9.2).
 *
 * Heights: USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018 flight), 0.5 m
 * grid, above the street (ground_min + 0.9): pavilion and north-range eaves
 * 8.6, hip ridges 12.1 (measured); arcade eave 4.5, ridge 5.5 (measured);
 * spine 5.1; rear strips 5.9; annex 10.1; central gable top 14.4 (drawn
 * 15.3, bolder for the phone views); central
 * cupola to 18.6; pavilion cupolas to 14.6 (all measured, thin tops
 * rounded up a little where the lidar is sparse). Pavilion gable top 13.3
 * (lidar 11.6, drawn bolder for the phone views; the 1908 postcard shows it level with
 * the ridge). Arcade: 11 arches (1908 postcard, Michael Barera's views),
 * 2.4 m openings from the 1.2 m terrace (the front ground sits ~0.6 m
 * above the lowest ground under the footprint, Mapterhorn) to a 2.75 m
 * springing (semicircles), 0.62 m piers, estimated from Mark Fisher's and Carol Highsmith's photos.
 * Gable outlines, windows and porches estimated from the same photos.
 *
 * Colour (daylight photos, pulled to the palette's lightness): cream-yellow
 * stucco #e9cf98; red clay tile #b9614c (Highsmith's close view reads
 * brick red, not orange); dark red cupola #93473c; weathered green dome
 * #93a58f; the arcade's shaded loggia #857665. Flat annex roof drawn in the
 * stucco colour (NAIP shows it pale).
 * Night: windows glow; nothing else is lit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Fort_Worth_Stockyards_June_2016_45_(Livestock_Exchange_Building).jpg,
 *    Michael Barera, CC BY-SA 4.0 (south-west)
 *    https://commons.wikimedia.org/wiki/File:Fort_Worth_Stockyards_June_2016_45_(Livestock_Exchange_Building).jpg
 *  - Fort_Worth_Stockyards_June_2016_46_(Livestock_Exchange_Building).jpg,
 *    Michael Barera, CC BY-SA 4.0 (south-east)
 *    https://commons.wikimedia.org/wiki/File:Fort_Worth_Stockyards_June_2016_46_(Livestock_Exchange_Building).jpg
 *  - Fort_Worth_Stockyards_June_2016_18_(Livestock_Exchange_Building).jpg,
 *    Michael Barera, CC BY-SA 4.0 (south, from Exchange Avenue)
 *    https://commons.wikimedia.org/wiki/File:Fort_Worth_Stockyards_June_2016_18_(Livestock_Exchange_Building).jpg
 *  - 0011Fort_Worth_Stockyards_Live_Stock_Exchange_SE_Texas.jpg, Mark
 *    Fisher, CC BY-SA 3.0 (central gable, cupola, arcade)
 *    https://commons.wikimedia.org/wiki/File:0011Fort_Worth_Stockyards_Live_Stock_Exchange_SE_Texas.jpg
 *  - Fort_Worth_Livestock_Exchange_(8159374156).jpg, Nicolas Henderson,
 *    CC BY 2.0 (south-west, pavilion and arcade)
 *    https://commons.wikimedia.org/wiki/File:Fort_Worth_Livestock_Exchange_(8159374156).jpg
 *  - Fort_Worth,Texas.USA._-_panoramio_(3).jpg, Roman Eugeniusz,
 *    CC BY-SA 3.0 (east pavilion with its gable, pavilion cupola)
 *    https://commons.wikimedia.org/wiki/File:Fort_Worth,Texas.USA._-_panoramio_(3).jpg
 *  - Live_Stock_Exchange,_Fort_Worth,_Texas_LCCN2011630470.tif and
 *    The_Stock_Yards_building..._LCCN2013650788.tif, Carol M. Highsmith,
 *    public domain (gable, cupola, tile colour)
 *    https://commons.wikimedia.org/wiki/File:Live_Stock_Exchange,_Fort_Worth,_Texas_LCCN2011630470.tif
 *    https://commons.wikimedia.org/wiki/File:The_Stock_Yards_building,_the_center_of_a_historic_livestock-market_district_in_Fort_Worth,_Texas_LCCN2013650788.tif
 *  - Fort_Worth_Live_Stock_Exchange_(1908).jpg, Raphael Tuck & Sons
 *    postcard, public domain (whole front, roofs, both pavilion cupolas)
 *    https://commons.wikimedia.org/wiki/File:Fort_Worth_Live_Stock_Exchange_(1908).jpg
 *  - Fort_Worth_Livestock_Exchange.jpg, Jpo tx113, public domain
 *    (historical marker; arcade pier proportions behind it)
 *    https://commons.wikimedia.org/wiki/File:Fort_Worth_Livestock_Exchange.jpg
 * Also: OSM (ODbL); USGS NAIP (public domain) for the plan, roofs and
 * courts; Mapterhorn terrain (site within ~1 m of level).
 * Published: built 1902-03 for the Stockyards Company (Texas Historical
 * Commission marker). No look-only sources. No commercial imagery or 3D
 * tiles.
 *
 * Doubts: the north side and the annex were not photographed; the annex is
 * a plain stucco block with invented window rows. The courts' inner walls
 * are only seen from above. Cupola and gable details simplified.
 *
 * Left out: the "FORT WORTH" and "LIVE STOCK EXCHANGE" lettering and the
 * longhorn head (not a sign landmark), the flagpoles, railings, stairs,
 * gutters and the terrace planters.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archPanel, block, cap, lathe, panel, rect, save, triangulate, wallBays, type XY } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.7894622, -97.346729]
const BEARING = 0.4

const XC = 0.25 // symmetry axis
const FRONT = -24.6, BACK = 6.3
const PW0 = -34.7, PW1 = -16.4, PE0 = 16.9, PE1 = 35.2 // pavilions
const NR_S = -8.3 // north range's south face (the courts' north side)
const AR_N = -16.9 // arcade range's back (the courts' south side)
const LOG_N = -21.0 // back wall of the loggia
const SP0 = XC - 3.2, SP1 = XC + 3.2 // entrance spine
const EAVE = 8.6, RIDGE = 12.1
const AR_EAVE = 4.5, AR_RIDGE = 5.5, TERRACE = 1.2, SPRING = 2.75

// --- small geometry helpers ------------------------------------------------
/** A flat polygon (any simple outline) facing `n`, from points in 3D and a 2D projection. */
function face(p: Part, pts: V3[], n: V3, proj: (q: V3) => XY) {
  let r = pts.map(proj)
  const a = r.reduce((s, c, i) => { const d = r[(i + 1) % r.length]; return s + c[0] * d[1] - d[0] * c[1] }, 0)
  let P = pts
  if (a < 0) { r = [...r].reverse(); P = [...pts].reverse() }
  for (const [i, j, k] of triangulate(r)) p.tri(P[i], P[j], P[k], undefined, undefined, undefined, [n, n, n])
}
/** A profile (x, z) extruded between y0 (front, facing -y) and y1. */
function extrudeY(p: Part, prof: XY[], y0: number, y1: number) {
  face(p, prof.map(([x, z]) => [x, y0, z] as V3), [0, -1, 0], (q) => [q[0], q[2]])
  face(p, prof.map(([x, z]) => [x, y1, z] as V3), [0, 1, 0], (q) => [q[0], q[2]])
  for (let i = 0; i < prof.length; i++) {
    const [ax, az] = prof[i], [bx, bz] = prof[(i + 1) % prof.length]
    const l = Math.hypot(bx - ax, bz - az) || 1, n: V3 = [(bz - az) / l, 0, -(bx - ax) / l]
    p.tri([ax, y0, az], [bx, y0, bz], [bx, y1, bz], undefined, undefined, undefined, [n, n, n])
    p.tri([ax, y0, az], [bx, y1, bz], [ax, y1, az], undefined, undefined, undefined, [n, n, n])
  }
}
/**
 * A hipped roof over [x0,x1]x[y0,y1] (eaves at ze, ridge at zr) with its
 * ridge along the long axis; `open` leaves an end square (a vertical gable
 * triangle) where another roof swallows it. Includes a fascia and soffit.
 */
function hipRoof(p: Part, x0: number, x1: number, y0: number, y1: number, ze: number, zr: number, open: { s?: boolean; n?: boolean; w?: boolean; e?: boolean } = {}) {
  const alongY = y1 - y0 >= x1 - x0
  const h = alongY ? (x1 - x0) / 2 : (y1 - y0) / 2
  const fas = 0.3
  walls(p, rect(x0, y0, x1, y1), ze - fas, ze)
  cap(p, rect(x0, y0, x1, y1), ze - fas, false)
  if (alongY) {
    const xm = (x0 + x1) / 2, ya = open.s ? y0 : y0 + h, yb = open.n ? y1 : y1 - h
    const A: V3 = [xm, ya, zr], B: V3 = [xm, yb, zr]
    p.quad([x1, y0, ze], [x1, y1, ze], B, A) // east slope
    p.quad([x0, y1, ze], [x0, y0, ze], A, B) // west slope
    p.tri([x0, y0, ze], [x1, y0, ze], A) // south hip or gable
    p.tri([x1, y1, ze], [x0, y1, ze], B)
  } else {
    const ym = (y0 + y1) / 2, xa = open.w ? x0 : x0 + h, xb = open.e ? x1 : x1 - h
    const A: V3 = [xa, ym, zr], B: V3 = [xb, ym, zr]
    p.quad([x0, y0, ze], [x1, y0, ze], B, A) // south slope
    p.quad([x1, y1, ze], [x0, y1, ze], A, B) // north slope
    p.tri([x0, y1, ze], [x0, y0, ze], A)
    p.tri([x1, y0, ze], [x1, y1, ze], B)
  }
}
function walls(p: Part, r: XY[], z0: number, z1: number) {
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    p.quad([r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [r[j][0], r[j][1], z1], [r[i][0], r[i][1], z1])
  }
}
/** The outline of a curved Mission parapet: shoulders at zs, a concave sweep up to a round top at zt. */
function missionProfile(cx: number, W: number, zb: number, zs: number, zt: number): XY[] {
  const r = W * 0.5, zc = zt - r, a = W * 0.85
  const right: XY[] = [[cx + W, zb], [cx + W, zs], [cx + a, zs]]
  for (let i = 1; i <= 4; i++) { const t = (i / 4) * Math.PI / 2; right.push([cx + a - (a - r) * Math.sin(t), zc - (zc - zs) * Math.cos(t)]) }
  const top: XY[] = []
  for (let i = 1; i < 10; i++) { const t = (i / 10) * Math.PI; top.push([cx + r * Math.cos(t), zc + r * Math.sin(t)]) }
  const left = right.map(([x, z]) => [2 * cx - x, z] as XY).reverse()
  return [...right, ...top, ...left]
}
const ball = (p: Part, x: number, y: number, z: number, r: number) =>
  lathe(p, x, y, [[0, z - r], [r * 0.7, z - r * 0.7], [r, z], [r * 0.7, z + r * 0.7], [0, z + r]], 8)

function build() {
  const stucco = new Part(), tile = new Part(), win = new Part(), red = new Part(), dome = new Part(), shade = new Part()
  const box = (x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top: Part | null = null) => block(stucco, top, rect(x0, y0, x1, y1), z0, z1, 0)
  const south = (y: number, x0: number, x1: number): [XY, XY] => [[x0, y], [x1, y]]
  const north = (y: number, x0: number, x1: number): [XY, XY] => [[x1, y], [x0, y]]
  const east = (x: number, y0: number, y1: number): [XY, XY] => [[x, y0], [x, y1]]
  const west = (x: number, y0: number, y1: number): [XY, XY] => [[x, y1], [x, y0]]
  const O = 0.6 // eave overhang

  // --- Masses -------------------------------------------------------------
  for (const [x0, x1] of [[PW0, PW1], [PE0, PE1]]) box(x0, FRONT, x1, BACK, 0, EAVE)
  box(PW1, NR_S, PE0, BACK, 0, EAVE)
  box(SP0, AR_N, SP1, NR_S, 0, 4.6)
  box(PW1, LOG_N, PE0, AR_N, 0, AR_EAVE)
  // rear one-storey strips (lidar 5.9) and the flat-roofed annex (10.1)
  for (const [x0, x1] of [[PW0, -12.8], [12.25, PE1]]) {
    box(x0, BACK, x1, 10.0, 0, 5.9, stucco)
  }
  box(-12.8, BACK, 12.25, 34.1, 0, 10.1, stucco)
  box(-12.8, 34.1, -2.05, 39.45, 0, 10.1, stucco)
  // a low parapet round the annex roof
  block(stucco, stucco, rect(-12.9, BACK, 12.35, 34.2), 10.1, 10.5, 0)

  // --- Roofs --------------------------------------------------------------
  hipRoof(tile, PW0 - O, PE1 + O, NR_S - O, BACK + O, EAVE, RIDGE)
  for (const [x0, x1] of [[PW0, PW1], [PE0, PE1]]) hipRoof(tile, x0 - O, x1 + O, FRONT - O, -1, EAVE, RIDGE, { n: true })
  // arcade range: gable E-W, ends swallowed by the pavilions
  {
    const y0 = FRONT - O, y1 = AR_N, ym = -20.9, x0 = PW1, x1 = PE0, f = 0.25
    tile.quad([x0, y0, AR_EAVE], [x1, y0, AR_EAVE], [x1, ym, AR_RIDGE], [x0, ym, AR_RIDGE])
    tile.quad([x1, y1, AR_EAVE], [x0, y1, AR_EAVE], [x0, ym, AR_RIDGE], [x1, ym, AR_RIDGE])
    tile.quad([x0, y0, AR_EAVE - f], [x1, y0, AR_EAVE - f], [x1, y0, AR_EAVE], [x0, y0, AR_EAVE])
    cap(tile, rect(x0, y0, x1, FRONT), AR_EAVE - f, false)
  }
  // entrance spine: gable N-S
  {
    const x0 = SP0 - 0.4, x1 = SP1 + 0.4, xm = XC
    tile.quad([x1, AR_N, 4.6], [x1, NR_S, 4.6], [xm, NR_S, 5.6], [xm, AR_N, 5.6])
    tile.quad([x0, NR_S, 4.6], [x0, AR_N, 4.6], [xm, AR_N, 5.6], [xm, NR_S, 5.6])
    cap(tile, rect(x0, AR_N, SP0, NR_S), 4.6, false)
    cap(tile, rect(SP1, AR_N, x1, NR_S), 4.6, false)
  }

  // --- The arcade ---------------------------------------------------------
  {
    const N = 11, pier = 0.62, L = PE0 - PW1, pitch = (L - pier) / N, w = pitch - pier, r = w / 2
    const y0 = FRONT, y1 = FRONT + 0.6
    box(PW1, y0, PE0, y1, 0, TERRACE) // terrace wall under the arches
    cap(stucco, rect(PW1, y0, PE0, y1), TERRACE, true)
    for (let k = 0; k <= N; k++) { const x = PW1 + k * pitch; box(x, y0, x + pier, y1, TERRACE, AR_EAVE) }
    for (let k = 0; k < N; k++) {
      const s0 = PW1 + pier + k * pitch, s1 = s0 + w, c = s0 + r, seg = 10
      const arc: XY[] = Array.from({ length: seg + 1 }, (_, i) => { const t = Math.PI - (i / seg) * Math.PI; return [c + r * Math.cos(t), SPRING + r * Math.sin(t)] as XY })
      // spandrel: the wall over the arch, front and back, as a fan from the top corners
      for (const [y, n] of [[y0, -1], [y1, 1]] as [number, number][]) {
        const N3: V3 = [0, n, 0]
        const P = ([x, z]: XY): V3 => [x, y, z]
        for (let i = 0; i < seg; i++) {
          const corner: XY = i < seg / 2 ? [s0, AR_EAVE] : [s1, AR_EAVE]
          stucco.tri(P(arc[i]), P(arc[i + 1]), P(corner), undefined, undefined, undefined, [N3, N3, N3])
        }
        stucco.tri(P([s0, AR_EAVE]), P(arc[seg / 2]), P([s1, AR_EAVE]), undefined, undefined, undefined, [N3, N3, N3])
      }
      // soffit
      for (let i = 0; i < seg; i++) {
        const [ax, az] = arc[i], [bx, bz] = arc[i + 1]
        const na: V3 = [(c - ax) / r, 0, (SPRING - az) / r], nb: V3 = [(c - bx) / r, 0, (SPRING - bz) / r]
        stucco.tri([ax, y0, az], [bx, y0, bz], [bx, y1, bz], undefined, undefined, undefined, [na, nb, nb])
        stucco.tri([ax, y0, az], [bx, y1, bz], [ax, y1, az], undefined, undefined, undefined, [na, nb, na])
      }
    }
    // the loggia in shadow: back wall and ceiling
    panel(shade, ...south(LOG_N, PW1, PE0), 0, L, 0, AR_EAVE - 0.1, 0.03)
    cap(shade, rect(PW1, y1, PE0, LOG_N), 4.0, false)
    // the loggia's raised floor, in pieces of under 5 m for the terrain
    for (let k = 0; k < 8; k++) cap(shade, rect(PW1 + (k * L) / 8, y1, PW1 + ((k + 1) * L) / 8, LOG_N), TERRACE, true)
    // doors and windows on the loggia's back wall
    for (let k = 0; k < N; k++) {
      const s = pier + k * pitch + w / 2
      panel(win, ...south(LOG_N - 0.06, PW1, PE0), s - 0.8, s + 0.8, TERRACE + 0.3, 3.0, 0.03)
    }
  }

  // --- Mission gables -----------------------------------------------------
  // central gable on the north range's south face, cupola behind it
  {
    const prof = missionProfile(XC, 5.6, 7.6, 11.2, 15.3)
    extrudeY(stucco, prof, NR_S - 0.3, NR_S + 0.5)
    for (const sx of [-1, 1]) ball(stucco, XC + sx * 5.2, NR_S + 0.1, 11.7, 0.5)
  }
  for (const cx of [(PW0 + PW1) / 2, (PE0 + PE1) / 2]) {
    const yf = FRONT + 0.4
    extrudeY(stucco, missionProfile(cx, 4.6, 8.0, 10.5, 13.3), yf, yf + 0.7)
    for (const sx of [-1, 1]) ball(stucco, cx + sx * 4.2, yf + 0.35, 10.9, 0.42)
    archPanel(win, ...south(yf, cx - 4.6, cx + 4.6), 4.6 - 0.75, 4.6 + 0.75, 9.1, 11.0, 0.05, 8)
  }

  // --- Cupolas ------------------------------------------------------------
  {
    const cy = -0.3, h = 2.0
    block(red, null, rect(XC - h, cy - h, XC + h, cy + h), 10.5, 14.4, 0)
    block(red, red, rect(XC - h - 0.3, cy - h - 0.3, XC + h + 0.3, cy + h + 0.3), 14.4, 14.8, 0)
    for (const [a, b] of [south(cy - h, XC - h, XC + h), north(cy + h, XC - h, XC + h), east(XC + h, cy - h, cy + h), west(XC - h, cy - h, cy + h)])
      archPanel(win, a, b, h - 0.6, h + 0.6, 12.1, 13.2, 0.05, 8)
    lathe(dome, XC, cy, [[2.05, 14.8], [1.95, 15.4], [1.7, 15.95], [1.25, 16.45], [0.65, 16.8], [0, 16.9]], 16)
    block(red, red, rect(XC - 0.62, cy - 0.62, XC + 0.62, cy + 0.62), 16.6, 18.0, 0)
    lathe(dome, XC, cy, [[0.85, 18.0], [0.7, 18.35], [0.3, 18.6], [0, 18.65]], 8)
  }
  for (const cx of [(PW0 + PW1) / 2, (PE0 + PE1) / 2]) {
    const cy = 1.0, h = 1.15
    block(red, red, rect(cx - h, cy - h, cx + h, cy + h), 11.0, 13.2, 0)
    lathe(dome, cx, cy, [[1.25, 13.2], [1.1, 13.75], [0.7, 14.15], [0, 14.35]], 12)
    lathe(red, cx, cy, [[0.16, 14.3], [0.16, 14.7], [0, 14.75]], 6)
  }

  // --- Windows ------------------------------------------------------------
  const lower: [number, number] = [1.6, 3.9], upper: [number, number] = [5.3, 7.5]
  // pavilion fronts: recessed porch with two columns, windows each side, three above
  for (const cx of [(PW0 + PW1) / 2, (PE0 + PE1) / 2]) {
    const [a, b] = south(FRONT, cx - 9.15, cx + 9.15), m = 9.15
    panel(shade, a, b, m - 3.2, m + 3.2, TERRACE, 4.4, 0.04)
    panel(win, a, b, m - 2.4, m + 2.4, TERRACE + 0.2, 3.6, 0.07)
    for (const d of [-1.55, 1.55]) lathe(stucco, cx + d, FRONT - 0.25, [[0.42, TERRACE], [0.36, TERRACE + 0.3], [0.33, 3.9], [0.45, 4.15], [0.45, 4.4]], 10)
    for (const d of [-6.4, 6.4]) panel(win, a, b, m + d - 0.85, m + d + 0.85, lower[0], lower[1], 0.05)
    for (const d of [-4.6, 0, 4.6]) panel(win, a, b, m + d - 0.95, m + d + 0.95, upper[0], upper[1], 0.05)
  }
  // pavilion outer sides
  wallBays(win, ...west(PW0, FRONT, BACK), [lower, upper], { pitch: 3.8, w: 1.8, end: 1.4 })
  wallBays(win, ...east(PE1, FRONT, BACK), [lower, upper], { pitch: 3.8, w: 1.8, end: 1.4 })
  // pavilion inner sides: over the arcade roof, and into the courts
  wallBays(win, ...east(PW1, FRONT, NR_S), [[5.9, 7.5]], { pitch: 3.8, w: 1.6, end: 1.2 })
  wallBays(win, ...west(PE0, FRONT, NR_S), [[5.9, 7.5]], { pitch: 3.8, w: 1.6, end: 1.2 })
  wallBays(win, ...east(PW1, AR_N, NR_S), [lower], { pitch: 3.8, w: 1.6, end: 1.2 })
  wallBays(win, ...west(PE0, AR_N, NR_S), [lower], { pitch: 3.8, w: 1.6, end: 1.2 })
  // pavilion backs above the rear strips
  wallBays(win, ...north(BACK, PW0, PW1), [upper], { pitch: 3.8, w: 1.8, end: 1.4 })
  wallBays(win, ...north(BACK, PE0, PE1), [upper], { pitch: 3.8, w: 1.8, end: 1.4 })
  // north range front (seen over the arcade roof): paired second-floor
  // windows, small attic windows under the eave either side of the gable
  {
    const [a, b] = south(NR_S, PW1, PE0), L = PE0 - PW1, mid = XC - PW1
    for (const s of [-13.5, -10.5, -6.6, -3.6, -1.2, 1.2, 3.6, 6.6, 10.5, 13.5]) panel(win, a, b, mid + s - 0.7, mid + s + 0.7, 5.0, 6.7, 0.05)
    for (const s of [-14, -12.4, -8.6, -7, 7, 8.6, 12.4, 14]) panel(win, a, b, mid + s - 0.45, mid + s + 0.45, 7.6, 8.15, 0.05)
    wallBays(win, a, b, [lower], { pitch: 3.6, w: 1.5, end: 0.8, skip: (s) => Math.abs(s - mid) < 3.6 })
    void L
  }
  // the gable's own pair of windows and the arcade range's back to the courts
  wallBays(win, ...north(AR_N, PW1, SP0), [[1.4, 3.6]], { pitch: 3.6, w: 1.5, end: 1.0 })
  wallBays(win, ...north(AR_N, SP1, PE0), [[1.4, 3.6]], { pitch: 3.6, w: 1.5, end: 1.0 })
  wallBays(win, ...west(SP0, AR_N, NR_S), [[1.4, 3.6]], { pitch: 3.4, w: 1.5, end: 1.0 })
  wallBays(win, ...east(SP1, AR_N, NR_S), [[1.4, 3.6]], { pitch: 3.4, w: 1.5, end: 1.0 })
  // rear strips and annex
  wallBays(win, ...north(10.0, PW0, -12.8), [[1.6, 4.0]], { pitch: 3.8, w: 1.8, end: 1.2 })
  wallBays(win, ...north(10.0, 12.25, PE1), [[1.6, 4.0]], { pitch: 3.8, w: 1.8, end: 1.2 })
  const annex: [number, number][] = [[1.4, 2.9], [4.5, 6.0], [7.6, 9.1]]
  wallBays(win, ...west(-12.8, 10.0, 39.45), annex, { pitch: 3.6, w: 1.7, end: 1.2 })
  wallBays(win, ...east(12.25, 10.0, 34.1), annex, { pitch: 3.6, w: 1.7, end: 1.2 })
  wallBays(win, ...north(39.45, -12.8, -2.05), annex, { pitch: 3.6, w: 1.7, end: 1.2 })
  wallBays(win, ...north(34.1, -2.05, 12.25), annex, { pitch: 3.6, w: 1.7, end: 1.2 })

  return [
    { part: stucco, material: finish('exchange-stucco', 0xe9cf98) },
    { part: tile, material: finish('exchange-tile', 0xb9614c) },
    { part: win, material: PALETTE.window },
    { part: red, material: finish('exchange-cupola-red', 0x93473c) },
    { part: dome, material: finish('exchange-dome', 0x93a58f) },
    { part: shade, material: finish('exchange-loggia-shade', 0x857665) },
  ]
}

if (import.meta.main) await save('dal-livestock-exchange', 'Livestock Exchange Building', ANCHOR, BEARING, build())
