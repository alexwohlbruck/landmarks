/**
 * 300 South Tryon (2017; LS3P), Charlotte — original procedural geometry,
 * CC0-1.0.
 * bun generators/clt-300-south-tryon.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the
 * centroid of the OSM outline way/1047699840) on the lowest ground. Placed
 * at bearing 47.93, square to Uptown's grid and the same as Latta Arcade
 * next door: +x faces South Tryon Street, +y faces Third Street.
 *
 * Identity:
 *  - a pale glass office tower on a white stone base, its curtain wall
 *    ruled by white mullions and floor lines (both street photos);
 *  - the "sail": a darker glass prism over the Tryon end, its Tryon face
 *    bowing out in plan, its top edge sweeping up, steepening, to a sharp
 *    peak (the tallest point) at the Tryon/Third corner, traced by white
 *    fins; the white-ruled L-shaped block steps down behind it (both
 *    photos, taken from that corner looking south-west: Tryon on the left,
 *    Third Street on the right);
 *  - the two-storey glass lobby curving round the Tryon/Third corner under
 *    a layered white canopy, three bands stepping back as they rise.
 *
 * Evidence:
 *  - OSM: outline way/1047699840 (commercial, "300 South Tryon", 2017);
 *    tower part way/1047699844 (25 levels, height 141); parts
 *    way/1047699842 and way/1047699843 at the west end (untagged heights)
 *    are left to the map and not drawn or replaced here.
 *  - Published: 463 ft / 141 m to the roof, 25 floors, completed October
 *    2017, LS3P (Wikipedia "300 South Tryon", citing CTBUH).
 *  - Lidar not used: USGS_LPC_NC_Phase4_Mecklenburg_2016 was flown while the
 *    tower was being built.
 *  - Photos (Wikimedia Commons, daylight, both from the Tryon/Third corner):
 *    "300 South Tryon December 2023.jpg" (City Dweller 2, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:300_South_Tryon_December_2023.jpg);
 *    "300 S Tryon Office.jpg" (Jt12081988 at English Wikipedia, CC BY-SA
 *    4.0, https://commons.wikimedia.org/wiki/File:300_S_Tryon_Office.jpg).
 *    No commercial imagery or 3D tiles.
 *  - Look-only, not relied on: "300SouthTryon.jpg" (TorontoON, CC BY-SA
 *    4.0, https://commons.wikimedia.org/wiki/File:300SouthTryon.jpg), which
 *    appears to be the developer's rendering from the south-west; it agrees
 *    with the photos on the sail and the lower flat-topped block.
 *
 * Estimated: the main block's roof at 118 m; the sail's top edge from
 * 121 m at its south end to the peak at 140 m, plus a 1.2 m fin reaching
 * the published 141 m, rising as t^2.4 to match the photos' steepening
 * curve; its west edge to 127 m, so the Third Street edge also climbs to the peak; the bow (2.5 m out at mid-length); the
 * sail's plan (26 m along Third Street from Tryon, and all of the Tryon
 * face but its south 12 m, where the photos show the lower white-framed
 * block); the base 12 m (three storeys, photos) and the canopy bands
 * (estimated from photo-NE); bays of 3 m, three storeys a panel, at 4.4 m
 * a storey. The sail's glass reads darker and bluer than the white-ruled
 * block. The photos show a pale screen behind the peak; it is left out.

 * Doubts: only the Tryon and Third Street faces are photographed (from one
 * corner); the south face over Latta Arcade and the west end are drawn like
 * them. The
 * podium between the tower and the west parts is drawn at the base's
 * height without evidence. Latta Arcade (clt-latta-arcade) is a separate
 * model; this one stays inside way/1047699840, which is 1-2 m clear of it.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { bays, cap, parapetRoof, panel, rect, rows, save, walls, type XY } from './chi-aon-center'

const BEARING = 47.93
const ANCHOR: [number, number] = [35.2259454, -80.8462194]

const white = new Part(), win = new Part(), sailGlass = new Part(), roof = new Part(), base = new Part()

// OSM rings were read in Latta Arcade's frame; this shifts them to ours.
const OX = -36.5, OY = 39.0
const L = (r: XY[]): XY[] => r.map(([x, y]) => [x - OX, y - OY] as XY)

const BASE = 12, MAIN = 118, FLOOR = 4.4

// --- Base: the outline east of the west parts, white stone, glass lobby.
const podium = L([
  [-68.1, 16.1], [24.9, 17.9], [25.0, 17.3], [26.2, 17.4], [26.2, 26.0], [26.3, 44.6], [27.1, 47.1], [27.5, 49.2],
  [27.7, 51.6], [27.4, 54.4], [26.8, 56.8], [25.8, 59.2], [26.0, 62.7], [21.7, 62.9], [20.2, 63.5], [18.2, 64.1],
  [16.2, 64.4], [14.0, 64.1], [11.0, 63.6], [7.0, 63.6], [-18.7, 63.5], [-25.4, 63.6], [-34.5, 63.5], [-40.2, 63.5],
  [-42.3, 63.5], [-42.3, 64.5], [-47.0, 64.4], [-47.3, 64.4], [-61.9, 64.1], [-63.1, 64.1], [-67.9, 64.0], [-68.0, 62.9],
])
walls(base, podium, 0, BASE)
cap(roof, podium, BASE)
// shopfronts and the lobby: two storeys of glass between white piers
bays(win, podium, [[0.6, 8.2]], { bay: 3.2, gap: 0.8, end: 0.5, minLen: 1.8 })
// the white canopy band over the lobby
walls(white, podium, 8.6, 9.8)

// --- The tower: an L-shaped main block, and the sail at the Tryon/Third
// corner rising above it.
const X0 = -41.0 - OX, X1 = 26.0 - OX, Y0 = 26.0 - OY, Y1 = 63.4 - OY
const SX0 = X1 - 26, SY0 = Y0 + 12
const groups = (z0: number, z1: number) => rows(z0, z1, Math.max(1, Math.round((z1 - z0) / (3 * FLOOR))), 0.6)
/** Window bays on the single wall a→b. */
function edgeBays(p: Part, a: XY, b: XY, rs: [number, number][], bay = 3, gap = 0.35, end = 0.3) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]), use = len - 2 * end
  const k = Math.max(1, Math.round((use + gap) / (bay + gap))), w = (use - (k - 1) * gap) / k
  for (let q = 0; q < k; q++) for (const [z0, z1] of rs) panel(p, a, b, end + q * (w + gap), end + q * (w + gap) + w, z0, z1)
}
const main: XY[] = [[X0, Y0], [X1, Y0], [X1, SY0], [SX0, SY0], [SX0, Y1], [X0, Y1]]
walls(white, main, BASE, MAIN)
parapetRoof(white, roof, main, MAIN, 0.5, 1.2)
{
  const G = groups(BASE + 0.5, MAIN - 1)
  for (const [a, b] of [[main[0], main[1]], [main[1], main[2]], [main[4], main[5]], [main[5], main[0]]] as [XY, XY][]) edgeBays(win, a, b, G)
}

// The sail: a glass prism over the Tryon end whose Tryon face bows out in
// plan and whose top edge sweeps up, steepening, to a sharp peak at the
// Tryon/Third corner. White fins trace that top edge.
const SAIL_S = 121, SAIL_NW = 127, PEAK = 140, BOW = 2.5, NS = 10
const ys = Array.from({ length: NS + 1 }, (_, k) => SY0 + (Y1 - SY0) * k / NS)
const tOf = (y: number) => (y - SY0) / (Y1 - SY0)
const xE = (y: number) => X1 + BOW * Math.sin(Math.PI * tOf(y))
const zE = (y: number) => SAIL_S + (PEAK - SAIL_S) * tOf(y) ** 2.4
const zW = (y: number) => SAIL_S + (SAIL_NW - SAIL_S) * tOf(y) ** 2.4
{
  for (let k = 0; k < NS; k++) {
    const y0 = ys[k], y1 = ys[k + 1], a: XY = [xE(y0), y0], b: XY = [xE(y1), y1]
    // the bowed Tryon face
    white.quad([a[0], a[1], BASE], [b[0], b[1], BASE], [b[0], b[1], zE(y1)], [a[0], a[1], zE(y0)])
    for (const [z0, z1] of groups(BASE + 0.5, Math.min(zE(y0), zE(y1)) - 0.8)) panel(sailGlass, a, b, 0.18, Math.hypot(b[0] - a[0], b[1] - a[1]) - 0.18, z0, z1)
    // the west face, over the main block's roof
    white.quad([SX0, y1, BASE], [SX0, y0, BASE], [SX0, y0, zW(y0)], [SX0, y1, zW(y1)])
    panel(sailGlass, [SX0, y1], [SX0, y0], 0.18, y1 - y0 - 0.18, MAIN + 0.6, Math.min(zW(y0), zW(y1)) - 0.8)
    // roof, rising to the corner
    roof.quad([SX0, y0, zW(y0)], [a[0], a[1], zE(y0)], [b[0], b[1], zE(y1)], [SX0, y1, zW(y1)])
    // fin along the top edge
    const f = 0.25, h = 1.2
    white.quad([a[0] + f, y0, zE(y0) - 0.3], [b[0] + f, y1, zE(y1) - 0.3], [b[0] + f, y1, zE(y1) + h], [a[0] + f, y0, zE(y0) + h])
    white.quad([b[0] - f, y1, zE(y1) - 0.3], [a[0] - f, y0, zE(y0) - 0.3], [a[0] - f, y0, zE(y0) + h], [b[0] - f, y1, zE(y1) + h])
    white.quad([a[0] + f, y0, zE(y0) + h], [b[0] + f, y1, zE(y1) + h], [b[0] - f, y1, zE(y1) + h], [a[0] - f, y0, zE(y0) + h])
  }
  // south end, a low wall over the main roof
  white.quad([SX0, SY0, BASE], [X1, SY0, BASE], [X1, SY0, SAIL_S], [SX0, SY0, SAIL_S])
  panel(sailGlass, [SX0, SY0], [X1, SY0], 0.3, X1 - SX0 - 0.3, MAIN + 0.6, SAIL_S - 0.6)
  // Third Street face: its top rises from the west to the peak
  white.quad([X1, Y1, BASE], [SX0, Y1, BASE], [SX0, Y1, SAIL_NW], [X1, Y1, PEAK])
  const zN = (x: number) => SAIL_NW + (PEAK - SAIL_NW) * (x - SX0) / (X1 - SX0)
  const nb = Math.round((X1 - SX0) / 3.3)
  for (let q = 0; q < nb; q++) {
    const s0 = q * (X1 - SX0) / nb + 0.18, s1 = (q + 1) * (X1 - SX0) / nb - 0.18
    for (const [z0, z1] of groups(BASE + 0.5, zN(X1 - s1) - 0.8)) panel(sailGlass, [X1, Y1], [SX0, Y1], s0, s1, z0, z1)
  }
  // fin along that edge, ending in the pointed peak
  const f = 0.25, h = 1.2
  white.quad([X1, Y1 + f, PEAK - 0.3], [SX0, Y1 + f, SAIL_NW - 0.3], [SX0, Y1 + f, SAIL_NW + h], [X1, Y1 + f, PEAK + h])
  white.quad([SX0, Y1 - f, SAIL_NW - 0.3], [X1, Y1 - f, PEAK - 0.3], [X1, Y1 - f, PEAK + h], [SX0, Y1 - f, SAIL_NW + h])
  white.quad([X1, Y1 + f, PEAK + h], [SX0, Y1 + f, SAIL_NW + h], [SX0, Y1 - f, SAIL_NW + h], [X1, Y1 - f, PEAK + h])
}

// --- The layered white canopy curving round the lobby at the Tryon/Third
// corner: three bands stepping back as they rise (photo-NE, bottom).
{
  const corner = podium.slice(5, 20)
  for (const [z0, z1, o] of [[8.4, 9.3, 2.2], [9.7, 10.6, 1.6], [11.0, 11.9, 1.0]] as [number, number, number][]) {
    for (let i = 0; i < corner.length - 1; i++) {
      const a = corner[i], b = corner[i + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (len < 0.2) continue
      const u: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len], n: XY = [u[1], -u[0]]
      const P = (t: number, z: number, out: number): [number, number, number] => [a[0] + u[0] * t + n[0] * out, a[1] + u[1] * t + n[1] * out, z]
      white.quad(P(0, z0, o), P(len, z0, o), P(len, z1, o), P(0, z1, o))
      white.quad(P(0, z1, o), P(len, z1, o), P(len, z1, 0), P(0, z1, 0))
      white.quad(P(0, z0, 0), P(len, z0, 0), P(len, z0, o), P(0, z0, o))
    }
  }
}

if (import.meta.main) {
  await save('clt-300-south-tryon', '300 South Tryon', ANCHOR, BEARING, [
    { part: white, material: finish('300-tryon-white', 0xeef0ee) },
    { part: win, material: windowVariant(2, 0x9fb8cc) },
    { part: sailGlass, material: { ...PALETTE.window, color: 0x6f8fae } },
    { part: roof, material: PALETTE.roof },
    { part: base, material: PALETTE.stone },
  ])
}
