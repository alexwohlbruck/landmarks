/**
 * Honeywell Tower (Honeywell global headquarters, 700 S Mint St, Legacy
 * Union, 2021, Goettsch Partners / Childress Klein), Charlotte — original
 * procedural geometry, CC0-1.0.
 * bun generators/clt-honeywell-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the
 * centroid of the OSM outline way/1046848108) on the lowest ground. Placed at
 * bearing 49.7, square to Uptown's grid: -x faces South Mint Street, +x the
 * Legacy Union parking deck, +y Bank of America Tower to the north-east.
 *
 * Identity, in order:
 *  - a broad 23-storey slab of red brick framing big glass bays, a modern
 *    take on a brick mill: brick piers full height, brick spandrel bands
 *    every four storeys, a pale stone base and cornice;
 *  - its top in three steps: the main block's cornice, two brick end
 *    blocks a storey or two higher on each long face, then a glass top tier
 *    set in from the edges;
 *  - the pale grey screen on top carrying the red "Honeywell" sign, drawn
 *    as a red band the height of the letters (not a famous sign).
 *
 * Evidence:
 *  - OSM: outline way/1046848108 (93 m, 23 levels); parts way/1351679677
 *    (main block, 83 m), way/1351679683-686 (brick end blocks, 89 m, thin L
 *    walls on the long faces' ends), way/1351679678 (glass top tier, 96 m,
 *    inset 2 m from the long faces and 6 m from the ends), way/1351679680
 *    (96 m) and way/1351679681-682 (the screen, 101 m). Plan and heights
 *    from these; OSM's 93 m on the outline is not used.
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17) predates the
 *    tower; not used.
 *  - Terrain (Mapterhorn): about 4 m of fall from the north-east end to the
 *    south-west; elevation 0.
 *  - Photos (Wikimedia Commons, daylight):
 *    "Honeywell Tower in Charlotte, NC, USA.jpg" (Quintin Soloviev, CC BY 4.0,
 *    drone, face-on to the south-east long face: the bays, the bands, the
 *    stepped top, the screen and sign,
 *    https://commons.wikimedia.org/wiki/File:Honeywell_Tower_in_Charlotte,_NC,_USA.jpg);
 *    "Honeywell Tower S Mint St.jpg" (City Dweller 2, CC BY-SA 4.0, from Mint
 *    St to the south-west during fit-out: the stone base and the short face,
 *    https://commons.wikimedia.org/wiki/File:Honeywell_Tower_S_Mint_St.jpg);
 *    "Legacy Union April 2023.jpg" (City Dweller 2, CC BY-SA 4.0, from the
 *    north with Bank of America Tower: the north-east face and its sign,
 *    https://commons.wikimedia.org/wiki/File:Legacy_Union_April_2023.jpg).
 *    No commercial imagery. No look-only sources.
 *
 * Estimated: the base 9 m (two storeys); bands every four storeys (16.4 m),
 * the floors 4.1 m (74 m over 18 storeys above the base); nine bays on the
 * long faces with a wider middle bay and four on the short faces, counted in
 * the photos; the sign as a plain red plate (not a famous sign), on the
 * screen's south-east and north-east faces where the photos show it.
 * Doubts: the north-west (Mint St) long face is seen only obliquely and is
 * drawn like the south-east one; the screen's other faces may carry signs.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, onWall, panel, save, walls, type XY } from './chi-aon-center'

const BEARING = 49.7
const ANCHOR: [number, number] = [35.2242414, -80.8515522]

const brick = new Part(), glass = new Part(), top = new Part(), stone = new Part(), roof = new Part(), sign = new Part()

const X = 17.6, Y = 42.4
const BASE = 9, MAIN = 83, STOREY = 4.1, GROUP = 4 * STOREY
const R: XY[] = [[-X, -Y], [X, -Y], [X, Y], [-X, Y]]

// --- Main block: brick to the cornice, stone base.
walls(stone, R, 0, BASE)
walls(brick, R, BASE, MAIN - 1.2)
// stone cornice, stepped out 0.4 m
{
  const C: XY[] = [[-X - 0.4, -Y - 0.4], [X + 0.4, -Y - 0.4], [X + 0.4, Y + 0.4], [-X - 0.4, Y + 0.4]]
  walls(stone, C, MAIN - 1.2, MAIN)
  for (let i = 0; i < 4; i++) {
    const a = R[i], b = R[(i + 1) % 4], c = C[i], d = C[(i + 1) % 4]
    stone.quad([d[0], d[1], MAIN - 1.2], [c[0], c[1], MAIN - 1.2], [a[0], a[1], MAIN - 1.2], [b[0], b[1], MAIN - 1.2])
  }
  cap(roof, C, MAIN)
}

/** Bays on wall a→b: n bays, the middle one `mid` times as wide; piers `pier` wide. */
function bays(a: XY, b: XY, n: number, mid: number, pier: number, rows: [number, number][], part = glass, out = 0.05) {
  const { L } = onWall(a, b)
  const weights = Array.from({ length: n }, (_, k) => (n % 2 === 1 && k === (n - 1) / 2 ? mid : 1))
  const unit = (L - (n + 1) * pier) / weights.reduce((s, w) => s + w, 0)
  let s = pier
  for (const w of weights) {
    for (const [z0, z1] of rows) panel(part, a, b, s, s + w * unit, z0, z1, out)
    s += w * unit + pier
  }
}
// rows: the glass base (storefront), then four-storey groups under the cornice
const groups: [number, number][] = []
for (let z = BASE + 0.9; z + 2 < MAIN - 1.2; z += GROUP) groups.push([z, Math.min(z + GROUP - 1.2, MAIN - 2.4)])
for (let i = 0; i < 4; i++) {
  const a = R[i], b = R[(i + 1) % 4], long = i % 2 === 1
  bays(a, b, long ? 9 : 4, long ? 1.6 : 1, 2.0, groups)
  bays(a, b, long ? 9 : 4, long ? 1.6 : 1, 2.0, [[0.4, BASE - 1.6]], glass, 0.05)
  // pale band over the storefront
  panel(stone, a, b, 0, onWall(a, b).L, BASE - 1.2, BASE - 0.6, 0.12)
}

// --- Glass top tier (way/1351679678): x -15.8..15.2, y -36.6..35.5, 83 to 96.
const T: XY[] = [[-15.8, -36.6], [15.2, -36.6], [15.2, 35.5], [-15.8, 35.5]]
walls(top, T, MAIN, 96)
cap(roof, T, 96)
for (let i = 0; i < 4; i++) {
  const a = T[i], b = T[(i + 1) % 4], { L } = onWall(a, b)
  for (let s = 0; s <= L + 0.01; s += L / Math.round(L / 6)) panel(stone, a, b, Math.max(0, s - 0.2), Math.min(L, s + 0.2), MAIN, 96, 0.04)
  panel(stone, a, b, 0, L, 89.2, 89.6, 0.04)
  panel(stone, a, b, 0, L, 95.2, 96, 0.04)
}

// --- Brick end blocks (way/1351679683-686): thin L walls to 89 at the long faces' ends.
const ends: XY[][] = [
  [[9.4, -37.9], [17.6, -37.8], [17.6, -6.8], [15.1, -6.8], [15.1, -36.6], [9.4, -36.6]],
  [[15.2, 5.7], [17.6, 5.7], [17.6, 36.7], [9.3, 36.8], [9.3, 35.5], [15.2, 35.5]],
  [[-17.6, 5.8], [-15.8, 5.7], [-15.8, 35.5], [-9.2, 35.5], [-9.2, 36.9], [-17.6, 37.0]],
  [[-17.6, -37.6], [-9.3, -37.8], [-9.3, -36.6], [-15.7, -36.6], [-15.7, -6.6], [-17.6, -6.6]],
]
for (const E of ends) {
  walls(brick, E, MAIN, 88.4)
  walls(stone, E, 88.4, 89)
  cap(roof, E, 89)
}
// their windows: three per block on the long faces, one on the end
for (const [a, b] of [[[17.6, -37.8], [17.6, -6.8]], [[17.6, 5.7], [17.6, 36.7]], [[-17.6, 37.0], [-17.6, 5.8]], [[-17.6, -6.6], [-17.6, -37.6]]] as [XY, XY][]) {
  bays(a, b, 3, 1, 1.6, [[MAIN + 0.8, 88]])
}
for (const [a, b] of [[[9.4, -37.9], [17.6, -37.8]], [[17.6, 36.7], [9.3, 36.8]], [[-9.2, 36.9], [-17.6, 37.0]], [[-17.6, -37.6], [-9.3, -37.8]]] as [XY, XY][]) {
  const { L } = onWall(a, b)
  if (L > 4) bays(a, b, 1, 1, 1.4, [[MAIN + 0.8, 88]])
}

// --- The screen (way/1351679680-682): grey louvres, 96 to 101.
const S: XY[] = [[-12.0, -18.3], [10.9, -18.3], [10.9, 17.1], [-11.9, 17.1]]
walls(stone, S, 96, 101) // pale grey in the drone photo
cap(roof, S, 101)
// louvre lines
for (let i = 0; i < 4; i++) {
  const a = S[i], b = S[(i + 1) % 4], { L } = onWall(a, b)
  for (const z of [96.6, 100.3]) panel(roof, a, b, 0, L, z, z + 0.2, 0.03)
}
// --- The red sign: a plain plate on the screen's south-east (+x) and north-east (+y) faces.
{
  const plate = (a: XY, b: XY, len: number) => {
    const { L, P } = onWall(a, b), s0 = (L - len) / 2, s1 = s0 + len, z0 = 97.6, z1 = 99.6, d = 0.35
    const q = (s: number, z: number, o: number): V3 => P(s, z, o)
    sign.quad(q(s0, z0, d), q(s1, z0, d), q(s1, z1, d), q(s0, z1, d))
    sign.quad(q(s0, z1, d), q(s1, z1, d), q(s1, z1, 0.05), q(s0, z1, 0.05))
    sign.quad(q(s1, z0, d), q(s1, z0, 0.05), q(s1, z1, 0.05), q(s1, z1, d))
    sign.quad(q(s0, z0, 0.05), q(s0, z0, d), q(s0, z1, d), q(s0, z1, 0.05))
  }
  plate(S[1], S[2], 22)
  plate(S[2], S[3], 15)
}

if (import.meta.main) {
  await save('clt-honeywell-tower', 'Honeywell Tower', ANCHOR, BEARING, [
    { part: brick, material: finish('honeywell-brick', 0xa95a43) },
    { part: glass, material: { ...PALETTE.window, color: 0x5f7a88 } },
    { part: top, material: windowVariant(2, 0x93b2c6) },
    { part: stone, material: PALETTE.stone },
    { part: roof, material: PALETTE.roof },
    { part: sign, material: finish('neon-honeywell-red', 0xc9443c, 0.6) },
  ])
}
