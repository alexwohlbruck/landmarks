/**
 * George Bush Intercontinental Airport (IAH), Houston: Terminal E (opened
 * 2003–04; United's international terminal, 23 gates). Procedural, CC0-1.0.
 *   bun generators/hou-iah-terminal-e.ts
 *
 * Why this terminal. The brief offered the circular satellites of A/B or
 * the new Mickey Leland terminal. A's "banjo" flight stations went in the
 * 1990s and B's last two were replaced by United's new piers (Terminal B
 * Transformation, finishing 2026; OSM already shows the piers, but no
 * licensed photo does). The Leland terminal's central processor is not in
 * OSM and has no licensed photo; only its D West Pier (2024) is mapped. Of
 * what stands, is mapped and is photographed, Terminal E is the one that
 * reads from above: a great "Π" of two concourse legs off a long bar, under
 * pale standing-seam vaults, with an oval glazed rotunda where the bridges
 * from the international arrivals hall come in. The 1969/1981 headhouses of
 * A, B and C are parking decks on top, mapped as separate garages.
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin at the area
 * centroid of OSM way/191969986 (aeroway=terminal, "Terminal E",
 * -95.333833, 29.985221). Coordinates below are written in a frame centred
 * on the outline's bounding box (-95.33407, 29.98519), where the lidar grid
 * is centred, and shifted by C on use.
 *
 * Sources
 * - OSM way/191969986: the outline, used as is, except that the diagonal
 *   enclosed bridge at its north-west corner is drawn as a raised deck.
 * - USGS NAIP (usgs.py naip, 0.4 m; work/hou-iah-terminal-e/naip.png): the
 *   pale vaulted spine down each leg and along the bar, the darker low gate
 *   blocks either side of the legs, the oval rotunda (about 86 x 38 m) with
 *   its inner drum (about 36 x 18 m); e1 shows the drum about 4.5 m of
 *   glass over a broad blue ring.
 * - Lidar: USGS 3DEP TX_Coastal_B1_2018 (flown 2018), 1 m grid
 *   (work/hou-iah-terminal-e/lidar.json), heights above the apron (4.6 m
 *   over ground_min): leg and bar bodies 14.5 m at the eaves, vault crowns
 *   18.1 m (each crown about 16 m wide); rotunda roof 19.5–21 m, its drum
 *   22.7 m; west stub 9.8 m; the north-west bridge 11–12 m; the gate blocks
 *   at the leg sides low and broken, 2–7 m.
 * - Photo e1 "IAH 3.jpg", Daniel2986 at en.wikipedia, public domain, 2006:
 *   https://commons.wikimedia.org/wiki/File:IAH_3.jpg
 *   the rotunda from a nearby roof: a glass oval drum ringed by a dark blue
 *   roof band, white curved standing-seam roofs falling away from it, glass
 *   curtain wall below.
 * - Photos e2 "Bush Terminal E.jpg" (Henry Han, CC BY-SA 3.0, 2011),
 *   https://commons.wikimedia.org/wiki/File:Bush_Terminal_E.jpg ;
 *   e3 "IAH - George Bush Intercontinental Airport Terminal E - panoramio.jpg"
 *   (Bohao Zhao, CC BY 3.0),
 *   https://commons.wikimedia.org/wiki/File:IAH_-_George_Bush_Intercontinental_Airport_Terminal_E_-_panoramio.jpg :
 *   the concourse halls inside: a white vault on columns with clerestory
 *   glazing along both sides and a full-height glass end wall.
 * - Published: opened June 2003 / January 2004, 23 gates (Wikipedia,
 *   "George Bush Intercontinental Airport").
 *
 * Estimated: the vault sections (a segmental arch from eaves to crown, from
 * the lidar), the clerestory and curtain-wall bands (from e1–e3). Colours:
 * pale roofs (NAIP, e1); walls in the palette's warm `stone` under a slate
 * `window` band so the concourses read; the drum dark tinted glass
 * (`window-2`, e1); the ring roof white (`trim`, e1). The drum's roof is
 * drawn in the band's blue rather than its real mid grey with plant, so the
 * drum reads from above as a dark oval in a white ring.
 * Rotunda heights: the lidar's highest return, 22.7 m, is taken as the
 * drum's cap; the drum is drawn as about two storeys of glass from 16.8 m,
 * from e1's proportions. The lidar's 19.5–21 m readings round the drum are
 * taken to be the cap's edge and rooftop plant blurred by the 1 m grid.
 * Connectors, both inside the OSM outline: the west block and its 10 m wide
 * corridor towards the building west (NAIP 0.2 m, naip-nw.png: roofed, with
 * plant; lidar 14.5 m), and the enclosed bridge to the north-west over the
 * roadway (NAIP: a roofed span about 11 m wide casting its shadow on the
 * road; lidar roof 11–12 m), drawn 6.5 m deep on one pier.
 * Not drawn: jet bridges, aprons, the bridges from the rotunda to the
 * arrivals hall (outside the outline), rooftop plant.
 *
 * Doubts: no licensed photo shows the airside faces of the legs from the
 * apron, so their walls are plain panels over a window band. The low gate
 * blocks are drawn at one height (6 m) though the lidar breaks them up.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { finishModel } from './nyc-570-lexington'
import { clean, block, panels, walls, cap, vault, rect, type XY } from './clt-terminal'

const roof = new Part(), panel = new Part(), win = new Part(), drum = new Part(), blue = new Part(), trim = new Part()

const C: XY = [22.8, 3.4] // the area centroid, in the bounding-box frame
const T = (r: XY[]): XY[] => r.map(([x, y]) => [x - C[0], y - C[1]] as XY)
const P = (x: number, y: number): XY => [x - C[0], y - C[1]]

// OSM way/191969986, bounding-box frame, metres; the north-west bridge cut out
const OUTLINE: XY[] = T([[166.3,69.7],[166.6,74.3],[201.5,73.7],[201.7,68.7],[206.1,68.8],[206.3,62.9],[207.7,28.9],[208.8,3.9],[208.9,1.4],[199.7,1.3],[199.7,-15.9],[199.7,-21.4],[209.8,-21.1],[210.9,-54.7],[204.9,-55.7],[205.0,-57.6],[206.1,-72.7],[206.7,-79.9],[212.4,-79.7],[214.0,-113.7],[208.2,-113.8],[203.2,-113.9],[197.2,-114.0],[196.9,-121.1],[170.9,-120.5],[170.6,-114.7],[159.6,-113.7],[153.7,-113.2],[155.0,-79.4],[160.8,-80.0],[160.9,-78.0],[161.9,-55.4],[156.8,-55.1],[158.2,-26.7],[158.4,-21.2],[165.0,-21.2],[165.2,-15.7],[165.0,13.0],[157.0,13.0],[136.8,32.5],[136.2,37.1],[100.2,36.0],[97.6,35.9],[97.1,43.4],[81.2,44.0],[73.3,41.6],[69.8,40.8],[58.5,38.3],[44.7,35.9],[25.5,37.7],[16.4,42.9],[7.4,42.5],[-19.0,42.2],[-19.1,36.1],[-29.7,36.1],[-56.1,36.1],[-61.8,36.1],[-62.1,32.1],[-82.8,11.7],[-90.0,11.9],[-89.8,-16.1],[-89.8,-21.7],[-78.9,-20.4],[-76.8,-50.5],[-76.6,-53.2],[-86.4,-53.4],[-86.1,-65.2],[-85.8,-78.9],[-75.5,-78.3],[-74.3,-111.8],[-82.1,-112.7],[-89.1,-113.4],[-89.1,-119.3],[-117.3,-120.1],[-117.3,-113.3],[-132.7,-113.2],[-135.0,-113.2],[-134.3,-78.6],[-128.3,-78.8],[-128.2,-76.9],[-127.7,-55.5],[-134.1,-55.5],[-133.4,-42.1],[-132.3,-21.5],[-122.8,-21.7],[-122.8,-15.8],[-123.1,12.0],[-130.3,11.4],[-149.2,29.5],[-166.3,29.4],[-187.4,29.3],[-187.5,39.7],[-158.1,39.7],[-158.2,61.8],[-158.3,67.6],[-155.3,67.4],[-136.1,67.4],[-130.7,67.5],[-130.8,73.3],[-88.9,74.3],[-88.9,68.9],[25.4,68.3],[40.9,72.4],[45.9,73.3],[52.4,74.1],[60.1,74.6],[72.7,73.5],[76.6,72.4],[79.3,71.6],[83.7,69.1],[85.4,68.1],[98.3,67.9]])
const BRIDGE: XY[] = T([[-155.4, 74.2], [-213.8, 121.2], [-196.7, 121.1], [-136.5, 72.7]])

const H_LOW = 6, H_BODY = 14.5, RISE = 3.6 // crown 18.1 m

// ------------------------------------------------------------ the low gate level: the whole outline
block(panel, roof, OUTLINE, 0, H_LOW, 0.4)
// the west block and its corridor towards Terminal C (inside the outline; NAIP shows a roofed block with plant and a
// roofed corridor joining the building to the west; lidar 14.5 m over both)
const STUB = T([[-187.4, 29.3], [-136, 29.4], [-136, 67.4], [-158.3, 67.6], [-158.1, 39.7], [-187.5, 39.7]])
{
  const r = block(panel, roof, STUB, 0, H_BODY, 0.4)
  panels(win, r, 6.8, 13.2, { bay: 14, gap: 1.0, end: 1.5, minLen: 6 })
}

// ------------------------------------------------------------ the concourse bodies under the vaults
type Body = { ring: XY[]; a: XY; b: XY; w: number }
const bodies: Body[] = [
  // west leg: crown x -120..-104 (lidar), pale roof x -122..-96 (NAIP)
  { ring: T(rect(-134, -113, -90, 38)), a: P(-111, -112), b: P(-111, 40), w: 24 },
  // east leg: crown x 172..180 (lidar), pale roof x 168..194 (NAIP)
  { ring: T(rect(156, -113, 200, 38)), a: P(178, -112), b: P(178, 40), w: 24 },
  // the bar: crown y 50..58 (lidar); its vault stops at the rotunda
  { ring: T(rect(-134, 38, 204, 67.5)), a: P(-134, 54), b: P(9, 54), w: 26 },
  { ring: [], a: P(91, 54), b: P(204, 54), w: 26 },
]
for (const { ring } of bodies) {
  if (!ring.length) continue
  const r = block(panel, roof, ring, 0, H_BODY, 0.5)
  // curtain-wall band under the eaves (e1): broad slate panels with narrow stone piers
  panels(win, r, 6.8, 13.4, { bay: 14, gap: 1.0, end: 2.0, minLen: 8 })
}
// the vaults: pale standing-seam roofs on a clerestory band (e2, e3)
const CLR = 1.3
for (const { a, b, w } of bodies) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const at = (p: XY, s: number): XY => [p[0] + n[0] * s, p[1] + n[1] * s]
  walls(win, clean([at(a, -w / 2), at(a, w / 2), at(b, w / 2), at(b, -w / 2)]), H_BODY, H_BODY + CLR)
  vault(roof, a, b, w, H_BODY + CLR, RISE - CLR, 8)
}

// ------------------------------------------------------------ the rotunda (e1, NAIP)
const OC: XY = P(50, 55)
const ell = (ax: number, by: number, z: number, seg = 24): V3[] =>
  Array.from({ length: seg }, (_, k) => {
    const t = (k / seg) * 2 * Math.PI
    return [OC[0] + ax * Math.cos(t), OC[1] + by * Math.sin(t), z] as V3
  })
{
  const H0 = 15.6, H1 = 16.6, H2 = 22.7
  // walls round the oval, with a curtain-wall band
  panel.loft([ell(43, 19, 0), ell(43, 19, 6.8)])
  win.loft([ell(43.05, 19.05, 6.8), ell(43.05, 19.05, H0 - 1.2)])
  panel.loft([ell(43, 19, H0 - 1.2), ell(43, 19, H0)])
  // the white ring roof, falling away from the drum (e1)
  trim.loft([ell(43, 19, H0), ell(41.5, 17.8, H0 + 0.5), ell(24, 12, H1)])
  // the dark blue band round the drum's foot
  blue.loft([ell(24, 12, H1), ell(18.6, 8.8, H1 + 0.15)])
  // the drum: about two storeys of dark tinted glass, up to the lidar's 22.7 m
  drum.loft([ell(18, 8.2, H1 + 0.15), ell(18, 8.2, H2 - 0.7)])
  // its white cap, overhanging the glass
  trim.loft([ell(18, 8.2, H2 - 0.7), ell(19.2, 9.4, H2 - 0.7), ell(19.2, 9.4, H2 - 0.1), ell(18.8, 9.0, H2)])
  trim.cap(ell(19.2, 9.4, H2 - 0.7), false)
  blue.cap(ell(18.8, 9.0, H2), true) // the drum's roof, darker than the ring roof (NAIP); drawn in the band's blue
}

// ------------------------------------------------------------ the north-west enclosed bridge over the roadway
// (inside the outline; NAIP 0.2 m shows a roofed span about 13 m wide casting its shadow on the road, joining E's
// north-west corner to the building north-west; lidar roof 11-12 m)
{
  const r = clean(BRIDGE)
  walls(panel, r, 5.5, 12)
  cap(roof, r, 12)
  cap(panel, r, 5.5, false)
  panels(win, r, 7.0, 11.0, { bay: 12, gap: 1.0, end: 1.5, minLen: 15 })
  const cx = r.reduce((t, p) => t + p[0], 0) / r.length, cy = r.reduce((t, p) => t + p[1], 0) / r.length
  block(panel, null, rect(cx - 2, cy - 2, cx + 2, cy + 2), 0, 5.5, 0)
}

finishModel('George Bush Intercontinental Airport Terminal E', 'hou-iah-terminal-e', [
  { part: roof, material: finish('iah-e-roof', 0xe4e6e6) },
  { part: panel, material: PALETTE.stone },
  { part: win, material: PALETTE.window },
  { part: drum, material: windowVariant(2, 0x45525e) },
  { part: blue, material: finish('iah-e-blue', 0x4f6680) },
  { part: trim, material: PALETTE.trim },
], { bearing: 0, elevation: 0, height: 22.7, replaces: ['way/191969986'] }, 6500)
