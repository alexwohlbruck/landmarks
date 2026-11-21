/**
 * Charles R. Jonas Federal Building and U.S. Courthouse (401 W Trade St;
 * 1918 post office and courthouse, enlarged 1933-34 in a stripped
 * Neoclassical limestone design by James A. Wetmore's office; courthouse
 * annex "the Wing" 2023, Robert A.M. Stern Architects), Charlotte — original
 * procedural geometry, CC0-1.0.
 * bun generators/clt-jonas-building.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the
 * centroid of the OSM outline way/983721762) on the lowest ground. Placed at
 * bearing 49.55, square to Uptown's grid: +y faces West Trade Street (the
 * ceremonial entrance), +x and -x the colonnaded short sides,
 * -y the 2023 annex on the old parking lot.
 *
 * Identity, in order:
 *  - a long, low, pale limestone block, three storeys under a flat
 *    entablature, its Trade Street front giant colonnades between plain end
 *    pavilions, the centre stepped forward as a pedimented portico;
 *  - the short sides colonnaded too between end pavilions;
 *  - a raised courtroom block in the middle of the roof;
 *  - behind it, the 2023 annex: a plain limestone block about three times
 *    as tall, with lower wings and a link to the old building.
 *
 * Evidence:
 *  - OSM: outline way/983721762 (both buildings); parts way/1580339648
 *    (the Trade Street entrance portico, stepped forward 2.6 m), way/1580339643 to -645 (light courts and
 *    the courtroom block), way/1580339636 (annex, 49 m), -637 and -641
 *    (annex wings, 15 m), -639 (link, 15 m), -638 and -640 (4 m).
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17, before the
 *    annex), 1 m grid read in this frame. The old building's ground on Trade
 *    Street is 5.2 m above the crop's lowest return, the old parking lot
 *    (the annex's ground, the model's base) 0.9. Measured above the base:
 *    the old roof 15.6, its edge 16.6, the courtroom block 20.0, the light
 *    courts 11 and 14, the Trade Street entrance 16.0.
 *  - Published: annex 8 to 10 storeys, 198,000 sq ft, opened 2023 (GSA,
 *    https://www.gsa.gov/about-gsa/newsroom/former-gsa-regional-news-archive/region-4-newsroom/news-releases/ribboncutting-ceremony-to-mark-opening-of-new-fed-06092023;
 *    https://origin-www.gsa.gov/node/89371); its height 49 m is OSM's.
 *  - NAIP (tools/usgs.py naip, 70 m half-size, laid over OSM): the annex
 *    built on the lot, its flat white roof with plant on the south-east half.
 *  - Photo: "Charles R. Jonas Federal Building, Charlotte (Mecklenburg
 *    County, North Carolina).jpg" (unknown photographer, public domain, the
 *    1934 building from the north across Trade Street: the giant colonnades
 *    on the front and the north-west side, the end pavilions, the pediment,
 *    https://commons.wikimedia.org/wiki/File:Charles_R._Jonas_Federal_Building,_Charlotte_(Mecklenburg_County,_North_Carolina).jpg).
 *    No commercial imagery. No look-only sources.
 *
 * Estimated: column counts and spacing (3.4 m), the colonnade lengths (the
 * middle half of the front, most of the north-west side), the pediment's
 * height (3.5 m), the window bays, from the 1934 photo. The annex is
 * invented in its detail: no open photo of it exists that I could find
 * (Commons, Openverse; Mapillary unavailable), so it is drawn as a plain
 * limestone block with grouped windows and a cornice, from OSM and NAIP.
 * Doubts: the annex's look; the old building's north-west side (drawn like
 * the south-east one) and south-west face (plain bays) are unphotographed.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, onWall, panel, save, walls, type XY } from './chi-aon-center'

const BEARING = 49.55
const ANCHOR: [number, number] = [35.2292993, -80.8468152]

const stone = new Part(), win = new Part(), roof = new Part(), shade = new Part()

const X0 = -41.8, X1 = 42.4, Y0 = -10.0, Y1 = 40.0
const STREET = 4.3, ROOF = 15.6, EDGE = 16.6, ENT = 14.0 // the entablature's foot: the giant order runs most of the front (1934 photo)
const COL_R = 0.7

function column(x: number, y: number, z0: number, z1: number) {
  const n = 8, pts: XY[] = Array.from({ length: n }, (_, k) => [x + COL_R * Math.cos((k + 0.5) * 2 * Math.PI / n), y + COL_R * Math.sin((k + 0.5) * 2 * Math.PI / n)] as XY)
  walls(stone, pts, z0, z1)
}

// --- The 1934 block: plinth, walls, entablature, roof.
const OLD: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
walls(stone, OLD, 0, EDGE)
cap(roof, OLD, ROOF + 0.02)
walls(stone, [...inset(OLD, 0.8)].reverse(), ROOF, EDGE) // parapet's inner face
// the courtroom block on the roof
{
  const C: XY[] = [[-6.5, 6.1], [7.0, 6.1], [7.0, 24.3], [-6.5, 24.3]]
  walls(stone, C, ROOF, 20.0)
  cap(roof, C, 20.0)
  for (let i = 0; i < 4; i++) {
    const a = C[i], b = C[(i + 1) % 4], { L } = onWall(a, b)
    panel(win, a, b, 1.0, L - 1.0, ROOF + 1.2, 19.0, 0.04) // clerestory
  }
}
// light courts: darker sunken patches
for (const R of [[[-25.3, 6.1], [-13.3, 6.1], [-13.3, 24.3], [-25.3, 24.3]], [[13.4, 6.2], [32.9, 6.2], [32.9, 24.3], [13.4, 24.3]]] as XY[][]) cap(shade, R, ROOF + 0.05)

/** A giant colonnade on wall a→b from s0 to s1: a shaded loggia wall, columns `depth` in front of it. */
function colonnade(a: XY, b: XY, s0: number, s1: number, depth: number) {
  const { P } = onWall(a, b)
  const cols = Math.max(2, Math.round((s1 - s0) / 3.4) + 1)
  // the loggia: dark windows set in the wall behind the columns
  panel(shade, a, b, s0, s1, STREET + 1.2, ENT, 0.03)
  for (let k = 0; k < cols; k++) {
    const s = s0 + 0.6 + k * (s1 - s0 - 1.2) / (cols - 1)
    if (k < cols - 1) panel(win, a, b, s + 0.9, s + (s1 - s0 - 1.2) / (cols - 1) - 0.9, STREET + 2.0, ENT - 1.0, 0.05)
    const p = P(s, 0, depth)
    column(p[0], p[1], STREET + 1.2, ENT)
  }
  // entablature over the columns, carried out to them
  const q0 = P(s0, 0, depth + COL_R + 0.2), q1 = P(s1, 0, depth + COL_R + 0.2)
  const box: XY[] = [[P(s0, 0, 0)[0], P(s0, 0, 0)[1]], [P(s1, 0, 0)[0], P(s1, 0, 0)[1]], [q1[0], q1[1]], [q0[0], q0[1]]]
  walls(stone, box, ENT, EDGE)
  cap(roof, box, EDGE)
  cap(stone, box, ENT, false)
  // stylobate: steps up from the street
  const st: XY[] = [[P(s0, 0, 0)[0], P(s0, 0, 0)[1]], [P(s1, 0, 0)[0], P(s1, 0, 0)[1]], [P(s1, 0, depth + 1.6)[0], P(s1, 0, depth + 1.6)[1]], [P(s0, 0, depth + 1.6)[0], P(s0, 0, depth + 1.6)[1]]]
  walls(stone, st, 0, STREET + 1.2)
  cap(stone, st, STREET + 1.2)
}
/** Plain window bays on wall a→b from s0 to s1, two tiers above the plinth. */
function bays(a: XY, b: XY, s0: number, s1: number, z0 = STREET + 1.0, bay = 4.2) {
  const n = Math.max(1, Math.round((s1 - s0) / bay)), w = (s1 - s0) / n
  for (let k = 0; k < n; k++) {
    panel(win, a, b, s0 + k * w + 1.1, s0 + (k + 1) * w - 1.1, z0, z0 + 4.4, 0.04)
    panel(win, a, b, s0 + k * w + 1.1, s0 + (k + 1) * w - 1.1, z0 + 5.6, ENT - 0.6, 0.04)
  }
  panel(stone, a, b, s0, s1, ENT - 0.1, ENT + 0.4, 0.15) // a string course under the entablature
}

// Trade Street front (+y): pavilions at the ends, colonnades, and the stepped-forward entrance
// portico with its pediment at the middle (way/1580339648); the right-hand face in the 1934 photo
{
  const a: XY = [X1, Y1], b: XY = [X0, Y1], L = X1 - X0, S = (x: number) => X1 - x
  bays(a, b, 0, S(30))
  bays(a, b, S(-30), L)
  colonnade(a, b, S(30), S(8.1), 1.2)
  colonnade(a, b, S(-7.9), S(-30), 1.2)
  colonnade(a, b, S(8.1), S(-7.9), 2.6 + 1.0)
  pediment(a, b, S(8.1), S(-7.9), 2.6 + 1.0)
}
// the two short sides: a giant colonnade between plain end pavilions (the south-east side is the
// left-hand face in the 1934 photo; the north-west side is unphotographed and drawn the same)
for (const [a, b] of [[[X1, Y0], [X1, Y1]], [[X0, Y1], [X0, Y0]]] as [XY, XY][]) {
  const L = Y1 - Y0
  bays(a, b, 0, 8.5)
  colonnade(a, b, 8.5, L - 8.5, 1.2)
  bays(a, b, L - 8.5, L)
}
// the south-west face, mostly behind the annex's link: plain bays
bays([X0, Y0], [X1, Y0], 0, X1 - X0)

function pediment(a: XY, b: XY, s0: number, s1: number, depth: number) {
  const { P } = onWall(a, b), d = depth + COL_R + 0.2
  const l = P(s0, EDGE, d), r = P(s1, EDGE, d), t = P((s0 + s1) / 2, EDGE + 3.5, d)
  stone.tri(l, r, t)
  const l2 = P(s0, EDGE, 0), r2 = P(s1, EDGE, 0), t2 = P((s0 + s1) / 2, EDGE + 3.5, 0)
  roof.quad(l, t, t2, l2)
  roof.quad(t, r, r2, t2)
}

// --- The 2023 annex (no open photo): plain limestone, grouped windows, cornice.
const ANNEX: XY[] = [[-27.8, -45.6], [28.2, -41.9], [28.5, -14.8], [-27.7, -15.2]]
const WINGS: XY[][] = [
  [[-35.3, -46.1], [-27.8, -45.6], [-27.7, -15.2], [-35.6, -15.1]],
  [[28.2, -41.9], [36.1, -41.4], [36.3, -14.6], [28.5, -14.8]],
  [[-27.7, -15.2], [28.5, -14.8], [28.4, -9.7], [-27.7, -10.1]], // the link
]
const LOWS: XY[][] = [[[-35.6, -15.1], [-27.7, -15.2], [-27.7, -10.1], [-35.6, -10.1]], [[28.5, -14.8], [36.3, -14.6], [36.2, -9.6], [28.4, -9.7]]]
function annexBlock(r: XY[], h: number, skip: number[] = []) {
  walls(stone, r, 0, h)
  cap(roof, r, h)
  for (let i = 0; i < r.length; i++) {
    if (skip.includes(i)) continue
    const a = r[i], b = r[(i + 1) % r.length], { L } = onWall(a, b)
    if (L < 4) continue
    const n = Math.max(1, Math.round(L / 4.5)), w = L / n
    for (let k = 0; k < n; k++)
      for (let z = 6; z + 6 < h - 2; z += 8.4) panel(win, a, b, k * w + 0.9, (k + 1) * w - 0.9, z, Math.min(z + 7.2, h - 3), 0.04)
    panel(win, a, b, 1, L - 1, 0.6, 4.6, 0.04)
    panel(stone, a, b, 0, L, h - 1.6, h - 0.4, 0.35) // cornice
  }
}
annexBlock(ANNEX, 49)
annexBlock(WINGS[0], 15)
annexBlock(WINGS[1], 15)
annexBlock(WINGS[2], 15, [0, 2])
for (const r of LOWS) annexBlock(r, 4.3)
{
  const M: XY[] = [[2, -40], [24, -39], [24, -20], [2, -20]]
  walls(roof, M, 49, 53)
  cap(roof, M, 53)
}

if (import.meta.main) {
  await save('clt-jonas-building', 'Charles R. Jonas Federal Building', ANCHOR, BEARING, [
    { part: stone, material: finish('jonas-limestone', 0xe2dccd) },
    { part: win, material: PALETTE.window },
    { part: shade, material: finish('jonas-shade', 0x9a978e) },
    { part: roof, material: PALETTE.roof },
  ], 6500)
}
