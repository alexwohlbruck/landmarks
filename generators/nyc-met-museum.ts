/**
 * The Metropolitan Museum of Art, Fifth Avenue at 82nd Street —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-met-museum.ts
 *
 * Map frame: x = model east (Fifth Avenue), y = model north (towards 84th
 * Street), z up, metres. Placed at bearing 29°, the Manhattan grid. Anchor:
 * area centroid of the OSM multipolygon relation/3698894.
 *
 * Identifying features (from the photos):
 * 1. Richard Morris Hunt's central block on Fifth Avenue: three tall round
 *    arches with dark lunette windows, four pairs of free-standing
 *    Corinthian columns on pedestals, the entablature breaking forward over
 *    each pair and topped by a tall uncarved stone block, a recessed attic
 *    with a sculpted cresting between them.
 * 2. The great stair, the full width of the centre, down to the avenue.
 * 3. The long, lower McKim, Mead & White wings either side: a taller link
 *    pavilion with pedimented windows next to the centre, then a row of
 *    tall arched windows under a plain panelled attic, glass skylight roofs
 *    behind; stone end pavilions standing forward at 80th and 84th Streets.
 * 4. Behind, the low modern wings on the park: the Sackler Wing's sloping
 *    glass wall and ribbed glass roof (Temple of Dendur) to the north, the
 *    Rockefeller Wing's to the south, the American Wing court's glass roof,
 *    and the Lehman Wing's glass pyramid on the west front.
 * 5. Pale grey-buff Indiana limestone; grey roofs.
 *
 * Evidence
 * - OSM relation/3698894 (outline only, 189 × 304 m, height 26.8; no
 *   building parts).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), resampled in the model frame
 *   (/tmp/city/nyc/work/nyc-met-museum/rot.png), above Fifth Avenue: the
 *   Hunt front's attic 30 m with blocks to 32.5 m, standing at x = 74.8;
 *   the Great Hall roof behind it 34–36 m (x 20…72); the McKim wings 20–21 m
 *   at their cornice with roofs to 26 m; the end pavilions 27–29 m; the
 *   rear wings 23–28 m; the Sackler and Rockefeller glass 25 m; the Lehman
 *   pyramid up to 24–28 m. Glass areas show as gaps in the returns.
 * - NAIP orthophoto (USGS, public domain): ribbed glass roofs over the
 *   Sackler (north), Rockefeller (south), American Wing and Wallace (west)
 *   wings, a stepped octagonal base round the Lehman pyramid, skylights in
 *   the end pavilions.
 * - Published: Hunt's Fifth Avenue facade and Great Hall 1902; McKim, Mead &
 *   White's wings 1911–26; Kevin Roche John Dinkeloo's wings 1971–91
 *   (Lehman 1975, Sackler 1978, American Wing 1980, Rockefeller 1982,
 *   Wallace 1987) (Wikipedia; NRHP 86003556).
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-met-museum/photos/credits.txt: the Hunt front
 *   head-on (Hugo Schneider, CC BY-SA 2.0; Martin Furtschegger, CC BY 3.0),
 *   from the north-east and south-east (Carlos Delgado, CC BY-SA 3.0; Rob
 *   Young, CC BY 2.0; Fcb981, CC BY-SA 3.0), the north McKim wing and link
 *   pavilion (Epicgenius, CC BY-SA 4.0), the south wing from the fountain
 *   (Erik Drost, CC BY 2.0), the Sackler glass wall from the park
 *   (Jfcapdet, CC BY-SA 4.0).
 *
 * Estimated: the Hunt front's storeys (the head-on photo scaled to the
 * lidar: entrance podium 4.5 m, pedestals to 7 m, columns to 19.5 m,
 * entablature to 23.5 m, attic to 30.5 m, blocks to 32.5 m), the column and
 * arch sizes, the stair's depth (outside the outline, as the real one is),
 * the wings' bay counts, the rear wings' window rhythm, the glass ribs'
 * spacing, the Lehman pyramid's base height (11 m). The rear (park) side is
 * drawn from the lidar and the orthophoto; one licensed photo shows it.
 * The fountains, flagpoles, cresting sculpture and roof-garden fittings are
 * left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, massing, spire, type XY } from './nyc-570-lexington'
import { column, rectPanel, archPanel, wallFrame } from './nyc-city-hall'
import { onWall, cube, roofOn, stair } from './nyc-nypl'

const stone = new Part(), shade = new Part(), win = new Part(), glass = new Part(), roof = new Part(), trim = new Part()
const door = win // doors are drawn as windows; the sixth material is the pale trim of the orders
const flat = roof // see the material list: the flat roofs are pale, as NAIP shows them

const HX = 74.8 // the Hunt front
const WX = 71.6 // the McKim wings' front
const PXF = 83.4 // the end pavilions' front
const HY0 = -30.7, HY1 = 29.9 // the Hunt centre
const WING = 21.0, LINK = 25.5, PAV = 28.5, REAR = 26, HALL = 34.5, GLASS = 25

// --- Massing (lidar heights) ---
massing({
  wall: stone, win: null, roof, facade: null, bevel: 0.4,
  boxes: [
    [-64.4, -88.3, 45, 86.7, REAR], // the main body behind the fronts
    [-31.2, -100, 40, -88.3, REAR],
    [-28.7, 86.7, 40, 100, REAR],
    [20, HY0, WX, HY1, HALL], // the Great Hall
    [WX - 1, HY0, HX - 1.5, HY1, 30.5], // the Hunt front
    [45, HY1, WX, 48, LINK], [45, 48, WX, 87.8, WING], // north McKim wing
    [45, -48, WX, HY0, LINK], [45, -88.2, WX, -48, WING], // south McKim wing
    [40, 87.8, PXF, 152.1, PAV], [40, -151.4, PXF, -88.2, PAV], // end pavilions
    [-28.7, 100, 40, 147, GLASS], // Sackler Wing
    [-31.2, -146, 40, -100, GLASS], // Rockefeller Wing
    [-87, 86.7, -28.7, 139.5, 23.5], // American Wing
    [-86.5, -141.3, -31.2, -88.3, 24], // Wallace Wing
  ],
})

/** Ribbed glass: a run of low glass gables over a rectangle, ridges along y (or x). */
function ribbed(x0: number, y0: number, x1: number, y1: number, z: number, pitch: number, h: number, alongY = true) {
  const n = Math.max(1, Math.round((alongY ? x1 - x0 : y1 - y0) / pitch))
  for (let k = 0; k < n; k++) {
    if (alongY) { const a = x0 + ((x1 - x0) * k) / n, b = x0 + ((x1 - x0) * (k + 1)) / n; roofOn(glass, glass, a, y0, b, y1, z, z + h, 'gableY') }
    else { const a = y0 + ((y1 - y0) * k) / n, b = y0 + ((y1 - y0) * (k + 1)) / n; roofOn(glass, glass, x0, a, x1, b, z, z + h, 'gableX') }
  }
}
ribbed(-27.7, 101, 39, 146, GLASS, 5.2, 1.4) // Sackler
ribbed(-30.2, -145, 39, -101, GLASS, 5.2, 1.4) // Rockefeller
ribbed(-86, 88, -62, 138.5, 23.5, 5, 1.3, false) // American Wing court
ribbed(-60, 88, -31, 114, REAR, 5, 1.3, false)
ribbed(-85.5, -140.3, -60, -89.3, 24, 5, 1.3, false) // Wallace
// Skylights over the central galleries (NAIP): the ribbed roof west of
// the Great Hall to the north, a skylight to the south, and the Great
// Hall's own lantern strip.
ribbed(-60, 52, -21, 100, REAR, 5, 1.3)
roofOn(glass, null, -50, -62, -10, -53, REAR, REAR + 1.6, 'hip')
roofOn(glass, null, 41, -30, 57, 15, HALL, HALL + 2.2, 'hip')
// The McKim wings' skylight roofs and the end pavilions' skylights.
for (const [y0, y1] of [[48.6, 87.2], [-87.6, -48.6]]) roofOn(glass, null, 46, y0, WX - 1.2, y1, WING, 25.5, 'gableY')
for (const yc of [120, -120]) roofOn(glass, null, 52, yc - 12, 72, yc + 12, PAV, PAV + 3.5, 'hip')

// The sloping glass walls of the Sackler (north) and Rockefeller (south)
// wings, leaning back from the park to the roof.
function slope(xa: number, xb: number, yBase: number, yTop: number, zTop: number) {
  const sgn = Math.sign(yBase - yTop)
  const a: V3 = [xa, yBase, 0], b: V3 = [xb, yBase, 0], c: V3 = [xb, yTop, zTop], d: V3 = [xa, yTop, zTop]
  if (sgn > 0) glass.quad(b, a, d, c); else glass.quad(a, b, c, d)
  // Stone cheeks at the ends.
  for (const [x, flip] of [[xa, sgn > 0], [xb, sgn < 0]] as [number, boolean][]) {
    const p: V3 = [x, yBase, 0], q: V3 = [x, yTop, 0], r: V3 = [x, yTop, zTop]
    if (flip) stone.tri(p, r, q); else stone.tri(p, q, r)
  }
}
slope(-28.7, 40, 152, 147, GLASS)
slope(-31.2, 40, -151.5, -146, GLASS)

// The American Wing court's glass wall on the park, and the Wallace Wing's.
rectPanel(glass, [-87, 139.5], [-87, 86.7], 26.4, 49, 1, 22.5, 0.06)

// --- The Lehman Wing: a stepped octagonal base and a glass pyramid ---
{
  const ring: XY[] = [[-64.5, -18], [-65.6, -16.8], [-69.3, -16.8], [-72.1, -19.6], [-72.1, -29.5], [-82.5, -29.5], [-105.9, -6.1], [-105.9, 4.8], [-82.4, 28.3], [-72, 28.3], [-72.1, 18.4], [-69.3, 15.6], [-65.6, 15.6], [-64.4, 16.9]].reverse() as XY[]
  const oct: XY[] = [[-98, -5], [-81, -22], [-66, -22], [-66, 21], [-81, 21], [-98, 4]] // counter-clockwise
  void ring
  massing({ wall: stone, win: null, roof, facade: null, bevel: 0.3, polys: [[11, [[-105.9, -6.1], [-82.5, -29.5], [-64.4, -29.5], [-64.4, 28.3], [-82.4, 28.3], [-105.9, 4.8]]]] })
  // Pyramid over the inner octagon.
  for (let i = 0; i < oct.length; i++) {
    const a = oct[i], b = oct[(i + 1) % oct.length]
    roof.quad([a[0], a[1], 11], [b[0], b[1], 11], [b[0], b[1], 13], [a[0], a[1], 13])
  }
  spire(glass, oct, 13, [-78, -0.5, 25])
}

// --- Hunt's Fifth Avenue front ---
// Storeys from the head-on photo (Hugo Schneider) scaled to the lidar's
// 30.5 m attic: the entrance terrace 5 m, pedestals to 7.5 m, columns to
// 20.5 m, entablature to 25 m, attic to 30.5 m, the blocks to 32.5 m. Four
// pairs of columns 18.8 m apart, 4.1 m between the shafts of a pair, 2 m
// thick; arches 9 m wide springing at 16 m.
const hf: [XY, XY] = [[HX - 1.5, HY0], [HX - 1.5, HY1]] // the wall behind the columns
const HL = HY1 - HY0, hm = HL / 2
const POD = 5, PED = 7.5, COL = 20.5, ENT = 25, ATT = 30.5, BLK = 32.5
const pairs = [-28.2, -9.4, 9.4, 28.2].map((d) => hm + d)
const at = (s: number, d: number) => wallFrame(hf[0], hf[1], 0).at(s, 0, d)
onWall(stone, hf[0], hf[1], -1, HL + 1, -0.05, 5.2, 0, POD) // the entrance terrace
stair(stone, hf[0], hf[1], -2, HL + 2, 5.1, 12, 0, POD, 12) // the great stair, to the avenue
// The shaded wall of the bays, and the arches: a dark lunette over a
// framed window and the doors.
for (const k of [-1, 0, 1]) {
  const s = hm + k * 18.8
  rectPanel(shade, hf[0], hf[1], s, 14.2, POD, COL, 0.04)
  archPanel(trim, hf[0], hf[1], s, 11.4, 15.0, 22.3, 0.08, 12) // the arch's moulding
  archPanel(shade, hf[0], hf[1], s, 9.4, POD, 21.2, 0.12, 12)
  archPanel(win, hf[0], hf[1], s, 8.4, 16.2, 20.6, 0.16, 12)
  rectPanel(win, hf[0], hf[1], s, 6.4, 10.2, 15.2, 0.16)
  rectPanel(win, hf[0], hf[1], s, k ? 4.6 : 6.6, POD, POD + 4.4, 0.16)
}
// The column pairs on their pedestals; the entablature breaking forward over
// them, crowned by the uncarved blocks.
for (const p of pairs) {
  const half = p === pairs[0] || p === pairs[3] ? 3.4 : 3.6
  onWall(stone, hf[0], hf[1], p - half, p + half, -0.05, 4.6, POD, PED)
  for (const d of [-2.05, 2.05]) {
    const c = at(p + d, 2.6)
    column(trim, c[0], c[1], 1.0, PED, COL, { n: 12, base: 0.7, cap: 1.5, taper: 0.88 })
  }
  onWall(trim, hf[0], hf[1], p - 3.9, p + 3.9, -0.05, 4.2, COL, ENT) // entablature over the pair
  onWall(trim, hf[0], hf[1], p - 4.4, p + 4.4, 3.0, 4.8, ENT - 1.2, ENT) // its cornice
  onWall(trim, hf[0], hf[1], p - 3.3, p + 3.3, -0.05, 3.6, ENT, BLK) // the uncarved block
  onWall(trim, hf[0], hf[1], p - 2.7, p + 2.7, -0.05, 3.0, BLK, BLK + 0.5)
}
// The entablature between the pairs, the attic and its cresting.
onWall(stone, hf[0], hf[1], -0.4, HL + 0.4, -0.05, 1.4, COL, ENT)
onWall(trim, hf[0], hf[1], -0.6, HL + 0.6, -0.05, 2.2, ENT - 1.0, ENT)
onWall(stone, hf[0], hf[1], -0.4, HL + 0.4, -0.05, 0.9, ATT - 1.0, ATT)
for (let k = 0; k < 24; k++) {
  const s = 1 + ((HL - 2) * (k + 0.5)) / 24
  if (pairs.some((p) => Math.abs(p - s) < 3.6)) continue
  onWall(stone, hf[0], hf[1], s - 0.45, s + 0.45, 0, 0.9, ATT, ATT + 1.3) // the cresting's heads
}

// --- The McKim wings on Fifth Avenue ---
function mckim(y0: number, y1: number, linkAtStart: boolean) {
  const a: XY = [WX, y0], b: XY = [WX, y1], L = y1 - y0
  const linkS0 = linkAtStart ? 0 : L - 18.1, linkS1 = linkAtStart ? 18.1 : L
  // Base storey with small grated windows, string course.
  onWall(stone, a, b, 0, L, -0.05, 0.4, 0, 4.2)
  onWall(stone, a, b, -0.4, L + 0.4, -0.05, 0.7, 4.2, 4.9)
  // The link pavilion: pedimented windows, panelled attic with statues.
  onWall(stone, a, b, linkS0, linkS1, -0.05, 0.9, 0, LINK - 1.2)
  onWall(stone, a, b, linkS0 - 0.6, linkS1 + 0.6, -0.05, 1.6, 15.8, 17.0)
  onWall(stone, a, b, linkS0 - 0.6, linkS1 + 0.6, -0.05, 1.6, LINK - 1.2, LINK)
  for (const t of [0.25, 0.5, 0.75]) {
    const s = linkS0 + (linkS1 - linkS0) * t
    rectPanel(win, a, b, s, 2.0, 7.0, 12.4, 0.95)
    onWall(stone, a, b, s - 1.7, s + 1.7, 0.9, 1.4, 12.8, 13.6) // the pediment cap
    rectPanel(shade, a, b, s, 2.8, 18.0, 23.2, 0.95) // attic panel
  }
  // The long wing: tall arched windows between pilasters, plain attic.
  const w0 = linkAtStart ? 18.1 : 0, w1 = linkAtStart ? L : L - 18.1
  const n = Math.round((w1 - w0) / 5.0), bw = (w1 - w0) / n
  for (let k = 0; k < n; k++) {
    const s = w0 + bw * (k + 0.5)
    archPanel(win, a, b, s, 2.3, 6.2, 14.2, 0.06)
    rectPanel(win, a, b, s, 1.4, 1.4, 3.2, 0.42)
    rectPanel(shade, a, b, s, 3.4, 16.6, 19.6, 0.06)
  }
  for (let k = 0; k <= n; k++) onWall(stone, a, b, w0 + bw * k - 0.4, w0 + bw * k + 0.4, -0.05, 0.4, 4.9, 15.4)
  onWall(stone, a, b, w0, w1, -0.05, 0.8, 15.4, 16.2)
  onWall(stone, a, b, w0 - 0.4, w1 + 0.4, -0.05, 1.2, WING - 1.0, WING)
}
mckim(HY1, 87.8, true)
mckim(-88.2, HY0, false)

// --- End pavilions: plain stone blocks with three tall arched windows on
// the avenue and a row of them on the side streets ---
function pavilion(y0: number, y1: number) {
  const a: XY = [PXF, y0], b: XY = [PXF, y1], L = y1 - y0
  onWall(stone, a, b, 0, L, -0.05, 0.5, 0, 5)
  onWall(stone, a, b, -0.6, L + 0.6, -0.05, 1.3, PAV - 1.4, PAV)
  onWall(stone, a, b, -0.4, L + 0.4, -0.05, 0.8, 18.5, 19.3)
  for (const t of [0.3, 0.5, 0.7]) { const s = L * t; archPanel(win, a, b, s, 3.2, 7.5, 16.5); rectPanel(shade, a, b, s, 5, 20.5, 26, 0.06) }
}
pavilion(87.8, 152.1)
pavilion(-151.4, -88.2)
for (const [a, b] of [[[PXF, 152.1], [40, 152.1]], [[40, -151.4], [PXF, -151.4]]] as [XY, XY][]) {
  const L = wallFrame(a, b).L
  onWall(stone, a, b, -0.6, L + 0.6, -0.05, 1.3, PAV - 1.4, PAV)
  for (let k = 0; k < 7; k++) archPanel(win, a, b, 3 + ((L - 6) * (k + 0.5)) / 7, 2.6, 7.5, 15.5)
}
// The wings' side walls facing the avenue between pavilion and wing.
for (const [a, b] of [[[PXF, 87.8], [WX, 87.8]], [[WX, -88.2], [PXF, -88.2]]] as [XY, XY][]) {
  const L = wallFrame(a, b).L
  archPanel(win, a, b, L / 2, 3.0, 7.5, 16.5)
}

// --- The park side: stone walls with sparse windows ---
const parkWalls: [XY, XY][] = [
  [[-64.4, 86.7], [-64.4, 28.3]], [[-64.4, -29.5], [-64.4, -88.3]],
]
for (const [a, b] of parkWalls) {
  const L = wallFrame(a, b).L, n = Math.round(L / 8)
  for (let k = 0; k < n; k++) rectPanel(win, a, b, (L * (k + 0.5)) / n, 2.2, 8, 16)
}
void cube

finishModel('The Metropolitan Museum of Art', 'nyc-met-museum', [
  { part: stone, material: finish('met-limestone', 0xe8e0d2) },
  { part: shade, material: finish('met-limestone-shade', 0xc6bba8) },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
  { part: roof, material: finish('met-flat-roof', 0xcfcdc6) },
  { part: trim, material: finish('met-limestone-light', 0xf3ece0) },
], { bearing: 29, osm: 'relation/3698894', height: HALL }, 6500)
