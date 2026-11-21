/**
 * Charles R. Jonas Federal Building and U.S. Courthouse (401 W Trade St;
 * 1915 post office and courthouse by James A. Wetmore's office, tripled in
 * 1933-34 in Neoclassical limestone with its front turned to Trade Street;
 * an eight-storey courthouse annex behind it, 2023, Robert A.M. Stern
 * Architects with Jenkins Peer Architects), Charlotte — original procedural
 * geometry, CC0-1.0.
 * bun generators/clt-jonas-building.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the
 * centroid of the OSM outline way/983721762) on the lowest ground. Placed at
 * bearing 49.55, square to Uptown's grid: +y faces West Trade Street (the
 * ceremonial front), +x the south-east side, -y the annex on the old
 * parking lot.
 *
 * Identity, in order:
 *  - a long, low limestone block on a raised base: its Trade Street front
 *    two long colonnades of giant round columns standing clear of a
 *    shadowed wall, a pedimented temple front stepped forward between them,
 *    and solid pavilions with only a few tall windows at the ends and
 *    beside the temple front;
 *  - a deep plain entablature and attic over the columns, all round;
 *  - the side elevations pilastered, two tiers of tall windows per bay;
 *  - behind, the 2023 annex: a pale, restrained eight-storey block of
 *    punched windows with a base and a cornice, lower wings either side.
 *
 * Evidence:
 *  - OSM: outline way/983721762 (both buildings); parts way/1580339648
 *    (the temple front, stepped forward 2.6 m, 16 m wide), way/1580339643 to
 *    -645 (light courts and the raised courtroom block), relation/22077040
 *    (the 1934 block); way/1580339636 (annex, 49 m), -637 and -641 (annex
 *    wings, 15 m), -639 (the link to the old building, 15 m), -638 and -640
 *    (4 m). NAIP (below) confirms the split: the annex's white roof on the
 *    old lot, a lower roof strip at each end, the link between.
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17, before the
 *    annex), 1 m grid read in this frame. The old building's ground on Trade
 *    Street is 5.2 m above the crop's lowest return, the old parking lot
 *    (the annex's ground, the model's base) 0.9. Measured above the base:
 *    the old roof 15.6, its edge 16.6 (12.3 m above Trade Street), the
 *    courtroom block 20.0, the light courts 11 and 14, the temple front 16.0.
 *  - Photo: "Charles R. Jonas Federal Building, Charlotte (Mecklenburg
 *    County, North Carolina).jpg" (unknown photographer, public domain,
 *    1934, from the east corner: on the right the Trade Street front with
 *    its corner pavilion, eight columns, pavilion, pedimented temple front of
 *    six columns, pavilion, eight columns and end pavilion; on the left the
 *    pilastered south-east side with two tiers of tall windows,
 *    https://commons.wikimedia.org/wiki/File:Charles_R._Jonas_Federal_Building,_Charlotte_(Mecklenburg_County,_North_Carolina).jpg).
 *  - Text: Wikipedia ("Charles R. Jonas Federal Building",
 *    https://en.wikipedia.org/wiki/Charles_R._Jonas_Federal_Building): a
 *    Neoclassical limestone building, "a full-length colonnade, with a
 *    projecting central temple-front pavilion", monolithic Corinthian
 *    columns, a denticulated cornice; the main elevation (north-east) faces
 *    West Trade Street. The annex (BD+C, Aug 2023,
 *    https://bdcnetwork.com/historic-courthouse-charlotte-updated-and-expanded-robert-am-stern-architects;
 *    PCI, https://www.pci.org/PCIWest/ProjectProfile?ID=274596): eight
 *    storeys rising behind the original, clad in precast concrete panels made
 *    to match its limestone, with precast cornices and punched windows,
 *    joined to it by a double-height stair hall.
 *  - No open photo of the annex, or of the old building since 1934, could
 *    be found (Commons categories and search, Openverse incl. Flickr CC;
 *    Mapillary unavailable). No commercial imagery. No look-only sources.
 *  - Terrain (Mapterhorn): Trade Street about 5 m above the old lot, as in
 *    the lidar; elevation 0.
 *
 * Estimated: the bay widths (pavilions 7 m, colonnades 20 m of eight
 * columns, the temple front's six), from the photo's counts and OSM's
 * lengths; columns 1.25 m across, drawn a little stouter than the real ones
 * so they read at phone size; the colonnade wall 2.8 m behind the face; the
 * entablature 1.6 m and the attic above it; the pediment 4.2 m high (a little steeper than the photo's, to read); the
 * annex's bays (3.6 m), its tall windows two storeys each, its base and
 * cornice heights. Guessed outright: the annex's elevations (only the text
 * above describes them), the north-west side (drawn like the south-east) and
 * the south-west face (mostly hidden by the link).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, onWall, panel, save, walls, type XY } from './chi-aon-center'

const BEARING = 49.55
const ANCHOR: [number, number] = [35.2292993, -80.8468152]

const stone = new Part(), trim = new Part(), shade = new Part(), win = new Part(), roof = new Part()

// --- The 1934 block.
const X0 = -41.8, X1 = 42.4, Y0 = -10.0, Y1 = 40.0
const PODIUM = 5.2 // the raised base: Trade Street (4.3) plus the steps
const ENT = 13.6 // the columns' tops, the entablature's foot
const CORNICE = ENT + 1.6, EDGE = 16.6, ROOF = 15.6
const D = 1.25, BACK = 2.8 // column diameter; the colonnade wall's depth behind the face

const OLD: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]

/** A round (12-sided) column with a square base and capital. */
function column(x: number, y: number) {
  const r = D / 2, n = 12
  walls(trim, Array.from({ length: n }, (_, k) => [x + r * Math.cos((k + 0.5) * 2 * Math.PI / n), y + r * Math.sin((k + 0.5) * 2 * Math.PI / n)] as XY), PODIUM + 0.4, ENT - 0.5)
  const sq = (h: number): XY[] => [[x - h, y - h], [x + h, y - h], [x + h, y + h], [x - h, y + h]]
  walls(trim, sq(0.8), PODIUM, PODIUM + 0.4); cap(trim, sq(0.8), PODIUM + 0.4)
  walls(trim, sq(0.85), ENT - 0.5, ENT)
}

// Trade Street front, along x (from +x to -x): the bays as [x0, x1, kind]
type Bay = [number, number, 'pav' | 'corner' | 'cols' | 'temple']
const FRONT: Bay[] = [
  [35.4, X1, 'corner'], [15.1, 35.4, 'cols'], [8.1, 15.1, 'pav'], [-7.9, 8.1, 'temple'],
  [-14.9, -7.9, 'pav'], [-34.8, -14.9, 'cols'], [X0, -34.8, 'corner'],
]
const TEMPLE_Y = 42.6

// The body's ring from the podium to the entablature: the outline, notched back where the colonnades stand.
const BODY: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1]]
for (const [x0, x1, kind] of FRONT) {
  if (kind === 'cols') BODY.push([x1, Y1], [x1, Y1 - BACK], [x0, Y1 - BACK], [x0, Y1])
  else if (kind === 'temple') BODY.push([x1, Y1], [x1, Y1 - 1.0], [x0, Y1 - 1.0], [x0, Y1])
}
BODY.push([X0, Y1])

// plinth and body
walls(stone, OLD, 0, PODIUM)
for (let i = 0; i < BODY.length; i++) {
  const a = BODY[i], b = BODY[(i + 1) % BODY.length], { L } = onWall(a, b)
  if (L < 0.01) continue
  const back = a[1] === b[1] && a[1] < Y1 - 0.01 && a[1] > Y1 - BACK - 0.01 // a colonnade or temple-front back wall
  panel(back ? shade : stone, a, b, 0, L, PODIUM, ENT, 0)
}
// the colonnades' floors and soffits, and their columns
for (const [x0, x1, kind] of FRONT) {
  if (kind !== 'cols') continue
  const R: XY[] = [[x0, Y1 - BACK], [x1, Y1 - BACK], [x1, Y1], [x0, Y1]]
  cap(stone, R, PODIUM)
  cap(trim, R, ENT, false)
  const n = 8, sp = (x1 - x0) / n
  for (let k = 0; k < n; k++) column(x0 + (k + 0.5) * sp, Y1 - 0.75)
}
// entablature (pale band, a cornice lip) and the attic, all round the outline
walls(trim, OLD, ENT, CORNICE)
{
  const lip = inset(OLD, -0.35)
  walls(trim, lip, CORNICE - 0.35, CORNICE)
  cap(trim, lip, CORNICE - 0.35, false)
  cap(trim, lip, CORNICE)
}
walls(stone, OLD, CORNICE, EDGE)
walls(stone, [...inset(OLD, 0.6)].reverse(), ROOF, EDGE) // the attic parapet's inner face
cap(roof, OLD, ROOF)

// --- The temple front (way/1580339648): six columns, entablature, pediment.
{
  const x0 = -7.9, x1 = 8.1, yb = Y1 - 1.0, P: XY[] = [[x0, Y1], [x1, Y1], [x1, TEMPLE_Y], [x0, TEMPLE_Y]]
  walls(stone, P, 0, PODIUM)
  cap(stone, [[x0, yb], [x1, yb], [x1, TEMPLE_Y], [x0, TEMPLE_Y]], PODIUM)
  const n = 6, sp = (x1 - x0) / n
  for (let k = 0; k < n; k++) column(x0 + (k + 0.5) * sp, TEMPLE_Y - 0.75)
  const E: XY[] = [[x0, yb], [x1, yb], [x1, TEMPLE_Y], [x0, TEMPLE_Y]]
  walls(trim, E, ENT, CORNICE)
  cap(trim, E, ENT, false)
  // pediment: front triangle and two roof slopes running back to the attic
  const apex = CORNICE + 4.2, xm = (x0 + x1) / 2, yr = Y1 - 4
  const f0: V3 = [x0, TEMPLE_Y, CORNICE], f1: V3 = [x1, TEMPLE_Y, CORNICE], ft: V3 = [xm, TEMPLE_Y, apex]
  trim.tri(f1, f0, ft) // faces +y
  roof.quad(ft, [xm, yr, apex], [x1, yr, CORNICE], f1)
  roof.quad(ft, f0, [x0, yr, CORNICE], [xm, yr, apex])
  // the pediment's tympanum, set back and shaded
  shade.tri([x1 - 1.2, TEMPLE_Y + 0.02, CORNICE + 0.45], [x0 + 1.2, TEMPLE_Y + 0.02, CORNICE + 0.45], [xm, TEMPLE_Y + 0.02, apex - 0.75])
}

// --- Pavilions on the front: solid, a few tall windows.
{
  const a: XY = [X1, Y1], b: XY = [X0, Y1], S = (x: number) => X1 - x
  for (const [x0, x1, kind] of FRONT) {
    if (kind !== 'pav' && kind !== 'corner') continue
    const c = (S(x0) + S(x1)) / 2
    panel(win, a, b, c - 0.85, c + 0.85, 9.4, 12.6, 0.04) // the upper window
    if (kind === 'pav') panel(win, a, b, c - 0.85, c + 0.85, 6.0, 8.6, 0.04)
    panel(stone, a, b, c - 1.1, c + 1.1, 12.8, 13.1, 0.12) // a hood over the upper window
  }
}
// --- The side elevations: pilasters, two tiers of tall windows per bay.
function pilastered(a: XY, b: XY, s0: number, s1: number) {
  const n = Math.max(1, Math.round((s1 - s0) / 4.4)), w = (s1 - s0) / n
  for (let k = 0; k <= n; k++) {
    const s = s0 + k * w
    panel(stone, a, b, Math.max(s0, s - 0.35), Math.min(s1, s + 0.35), PODIUM, ENT, 0.3)
  }
  for (let k = 0; k < n; k++) {
    const c = s0 + (k + 0.5) * w
    panel(win, a, b, c - 0.8, c + 0.8, PODIUM + 0.8, 8.8, 0.04)
    panel(win, a, b, c - 0.8, c + 0.8, 9.8, ENT - 0.9, 0.04)
  }
}
{
  // south-east (+x): the corner pavilion's return (7 m) then pilastered bays
  const a: XY = [X1, Y0], b: XY = [X1, Y1], L = Y1 - Y0
  pilastered(a, b, 0, L - 7)
  panel(win, a, b, L - 3.5 - 0.85, L - 3.5 + 0.85, 9.4, 12.6, 0.04)
  // north-west (-x), drawn the same
  const c: XY = [X0, Y1], d: XY = [X0, Y0]
  pilastered(c, d, 7, L)
  panel(win, c, d, 3.5 - 0.85, 3.5 + 0.85, 9.4, 12.6, 0.04)
  // south-west, above the link: pilastered too
  pilastered([X0, Y0], [X1, Y0], 0, X1 - X0)
}
// the raised courtroom block and the light courts on the roof
{
  const C: XY[] = [[-6.5, 6.1], [7.0, 6.1], [7.0, 24.3], [-6.5, 24.3]]
  walls(stone, C, ROOF, 20.0)
  cap(roof, C, 20.0)
  for (const R of [[[-25.3, 6.1], [-13.3, 6.1], [-13.3, 24.3], [-25.3, 24.3]], [[13.4, 6.2], [32.9, 6.2], [32.9, 24.3], [13.4, 24.3]]] as XY[][]) cap(roof, R, ROOF + 0.05) // light courts (NAIP: grey roofs)
}

// --- The 2023 annex: pale precast, punched tall windows, base, cornice. No photo; restrained.
const ANNEX: XY[] = [[-27.8, -45.6], [28.2, -41.9], [28.5, -14.8], [-27.7, -15.2]]
const WINGS: XY[][] = [
  [[-35.3, -46.1], [-27.8, -45.6], [-27.7, -15.2], [-35.6, -15.1]],
  [[28.2, -41.9], [36.1, -41.4], [36.3, -14.6], [28.5, -14.8]],
]
const LINK: XY[] = [[-27.7, -15.2], [28.5, -14.8], [28.4, -9.7], [-27.7, -10.1]]
const LOWS: XY[][] = [[[-35.6, -15.1], [-27.7, -15.2], [-27.7, -10.1], [-35.6, -10.1]], [[28.5, -14.8], [36.3, -14.6], [36.2, -9.6], [28.4, -9.7]]]

/** A precast block to height h: base string course at `base`, tall windows two storeys each, cornice. */
function precast(r: XY[], h: number, base: number) {
  walls(stone, r, 0, h)
  cap(roof, r, h - 0.01)
  const lip = inset(r, -0.45)
  walls(trim, lip, h - 2.4, h - 1.6)
  cap(trim, lip, h - 2.4, false)
  cap(trim, lip, h - 1.6)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], { L } = onWall(a, b)
    if (L < 5) continue
    panel(trim, a, b, 0, L, base - 0.5, base, 0.2) // string course over the base
    const n = Math.max(1, Math.round(L / 3.6)), w = L / n
    for (let k = 0; k < n; k++) {
      const c = (k + 0.5) * w
      // base: one tall window per bay
      panel(win, a, b, c - 0.75, c + 0.75, 1.2, base - 1.4, 0.03)
      panel(shade, a, b, c - 0.95, c + 0.95, base - 1.4, base - 1.0, 0.05) // the reveal's shadow under the lintel
      for (let z = base + 1.0; z + 5.5 < h - 3.2; z += 8.0) {
        const z1 = Math.min(z + 6.6, h - 3.4)
        panel(win, a, b, c - 0.7, c + 0.7, z, z1, 0.03)
        panel(shade, a, b, c - 0.9, c + 0.9, z1, z1 + 0.35, 0.05)
      }
    }
  }
}
precast(ANNEX, 49, 11)
precast(WINGS[0], 15, 9)
precast(WINGS[1], 15, 9)
{
  // the link: the double-height stair hall between the buildings, plain stone, a skylight
  walls(stone, LINK, 0, 15)
  cap(roof, LINK, 15)
  for (const r of LOWS) { walls(stone, r, 0, 4.3); cap(roof, r, 4.3) }
}

if (import.meta.main) {
  await save('clt-jonas-building', 'Charles R. Jonas Federal Building', ANCHOR, BEARING, [
    { part: stone, material: finish('jonas-limestone', 0xe0d8c6) },
    { part: trim, material: finish('jonas-limestone-pale', 0xf3eee3) },
    { part: shade, material: finish('jonas-shadow', 0x57544e) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
  ], 6500)
}
