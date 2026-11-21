/**
 * Atrium Health Carolinas Medical Center (1000 Blythe Blvd; the main
 * hospital, grown from the 1940 Charlotte Memorial Hospital through towers
 * and wings of the 1970s to 2000s, including the Rush S. Dickson Tower),
 * Charlotte — original procedural geometry, CC0-1.0.
 * bun generators/clt-carolinas-medical-center.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the
 * centroid of the OSM outline way/239256536) on the lowest ground. Placed at
 * bearing 330.6, square to the hospital's own grid (its wings run about 32
 * degrees off OSM's minimum rectangle): -y faces Blythe Boulevard's main
 * entrance drive and the curved glass front, +y the old hospital to the
 * north-north-west.
 *
 * Identity, in order:
 *  - a huge cluster of pale cream precast wings and towers of different
 *    heights, flat-roofed with plant, read as one campus;
 *  - the entrance front: a curved wall of green glass between two white
 *    towers, over a blue entrance canopy;
 *  - window bands on the cream walls.
 * The whole outline is modelled (OSM draws it as one way, so the model must
 * stand in for all of it): a podium along the exact outline to 14 m, and
 * above it blocks from the lidar, each an 8 m cell rounded to a 6 m height
 * band and merged into rectangles; only the curved front is drawn by hand.
 *
 * Evidence:
 *  - OSM: outline way/239256536; parts way/239265600 (Rush S. Dickson
 *    Tower, 11 levels) and way/239265602 (the long diagonal wing); the
 *    multipolygon relation/6259021 (building=hospital, layer 1, wholly inside
 *    the outline, found by tools/overlap.ts) is replaced too. Plan and
 *    the curved front from the outline.
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17), 2 m grid,
 *    read in this frame. Ground falls from 15.5 m (west) to 5.0 m (east, the
 *    model's base) above the crop's lowest return. Measured above the base:
 *    the wings 15 to 55 m; the curved front 45 m (median over it); the tops
 *    of the towers either side about 50 to 55 m.
 *  - NAIP (tools/usgs.py naip, 160 m half-size, laid over OSM): the wings,
 *    the curved front, two helipads.
 *  - Photos (Wikimedia Commons): "Carolinas Medical Center.jpg" (Atrium
 *    Health, CC BY-SA 4.0, aerial from the south-east over the entrance:
 *    the curved green glass front, the white towers, the cream wings,
 *    https://commons.wikimedia.org/wiki/File:Carolinas_Medical_Center.jpg);
 *    "Carolinas Medical Center, Charlotte, NC - panoramio.jpg" (James
 *    Willamor, CC BY-SA 3.0, aerial from the south-west: the wings and
 *    towers behind the parking decks,
 *    https://commons.wikimedia.org/wiki/File:Carolinas_Medical_Center,_Charlotte,_NC_-_panoramio.jpg).
 *    No commercial imagery. No look-only sources.
 *  - Terrain (Mapterhorn): tools/terrain.ts check; elevation 0.
 *
 * Left out (separate OSM buildings, not part of the outline): Medical Center
 * Plaza (way/239151522) and its parking deck (way/239151508), Morehead
 * Medical Plaza (way/239151523), the Scott Employee Parking Deck
 * (way/48910227), the hospital buildings way/239151528 and way/239256537,
 * the building way/239256539, and the new tower under construction to the
 * south (way/1412653952).
 *
 * Estimated: the window bands (one 4 m band every 7.6 m, two storeys); the
 * curved front's depth (14 m) and its mullions; the entrance canopy; the
 * colours from the photos. Doubts: the wings are lidar blocks, not drawn one
 * by one from photos; lidar is 2016, so changes since (if any) are missing;
 * the white towers' window patterns are not traced.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { area, cap, onWall, panel, save, walls, type XY } from './chi-aon-center'

const BEARING = 330.6
const ANCHOR: [number, number] = [35.2036952, -80.8385721]
const POD = 14, FRONT = 45, DEPTH = 14

const cream = new Part(), win = new Part(), green = new Part(), white = new Part(), roof = new Part(), canopy = new Part()

const OUTLINE: XY[] = [[61.5, 46.0], [61.6, 72.8], [56.1, 72.7], [56.1, 77.9], [51.9, 82.6], [45.7, 88.2], [39.0, 93.2], [32.6, 97.2], [24.4, 101.2], [17.2, 103.8], [8.3, 105.4], [0.1, 105.5], [1.9, 73.0], [-0.9, 72.9], [-1.3, 83.9], [-8.2, 84.0], [-17.3, 84.0], [-17.0, 78.2], [-17.1, 72.5], [-39.4, 72.6], [-39.6, 77.6], [-52.9, 78.1], [-56.0, 78.2], [-56.3, 81.1], [-62.9, 81.4], [-65.4, 81.5], [-65.4, 86.1], [-75.2, 85.9], [-74.6, 61.4], [-79.4, 61.2], [-86.5, 61.1], [-86.3, 36.9], [-79.7, 36.8], [-74.1, 36.6], [-73.8, 14.5], [-46.7, 14.9], [-46.6, 7.6], [-22.3, 7.8], [-22.1, -10.0], [-76.9, -10.9], [-76.9, -0.6], [-106.5, -0.5], [-106.6, 3.5], [-125.1, 3.0], [-125.0, -35.2], [-74.6, -35.3], [-72.0, -35.3], [-68.4, -35.3], [-68.5, -48.3], [-71.7, -48.2], [-71.5, -86.0], [-65.3, -86.3], [-64.8, -62.4], [-39.8, -36.9], [-33.7, -36.9], [-33.8, -43.6], [-29.4, -47.4], [-37.0, -55.3], [-56.9, -56.3], [-56.7, -70.3], [-36.9, -69.7], [-29.2, -77.2], [-29.7, -99.7], [-14.9, -99.7], [-10.9, -99.7], [-7.7, -99.7], [-7.6, -94.6], [-2.9, -94.6], [5.6, -94.4], [7.8, -94.5], [15.4, -85.9], [15.2, -82.3], [19.3, -82.1], [19.8, -85.6], [22.7, -85.3], [28.1, -84.7], [29.0, -89.4], [36.1, -88.0], [37.3, -87.8], [40.5, -87.2], [43.1, -86.2], [45.9, -85.1], [50.0, -83.5], [61.5, -77.5], [67.8, -73.9], [75.2, -67.1], [80.9, -58.1], [85.4, -47.4], [86.9, -36.4], [89.9, -36.4], [89.8, -27.5], [87.5, -27.5], [87.2, -16.8], [89.9, -16.8], [89.3, 46.1]]
const ARC: XY[] = [[80.9, -58.1], [75.2, -67.1], [67.8, -73.9], [61.5, -77.5], [50.0, -83.5], [45.9, -85.1], [43.1, -86.2], [40.5, -87.2], [37.3, -87.8], [36.1, -88.0], [29.0, -89.4]]
const CENTRE: XY = [-10.6, -6.9]
const BLOCKS: [number, number, number, number, number][] = [
  [-22.0, -100.0, -6.0, -52.0, 42.0],
  [-38.0, -76.0, -22.0, -52.0, 42.0],
  [-6.0, -76.0, 26.0, -68.0, 42.0],
  [26.0, -76.0, 42.0, -44.0, 48.0],
  [-54.0, -68.0, -38.0, -60.0, 42.0],
  [-6.0, -68.0, 18.0, -60.0, 42.0],
  [18.0, -68.0, 26.0, -52.0, 48.0],
  [42.0, -68.0, 58.0, -44.0, 48.0],
  [-46.0, -60.0, -38.0, -52.0, 42.0],
  [-6.0, -60.0, 2.0, -52.0, 42.0],
  [58.0, -60.0, 66.0, -44.0, 48.0],
  [74.0, -60.0, 82.0, -36.0, 54.0],
  [-30.0, -52.0, 2.0, -12.0, 48.0],
  [18.0, -52.0, 26.0, -28.0, 24.0],
  [66.0, -52.0, 74.0, -20.0, 54.0],
  [2.0, -44.0, 10.0, -12.0, 48.0],
  [10.0, -44.0, 18.0, -28.0, 24.0],
  [26.0, -44.0, 34.0, -28.0, 24.0],
  [34.0, -44.0, 50.0, -36.0, 48.0],
  [50.0, -44.0, 58.0, -28.0, 24.0],
  [58.0, -44.0, 66.0, -28.0, 54.0],
  [82.0, -44.0, 90.0, -12.0, 48.0],
  [-126.0, -36.0, -102.0, -28.0, 18.0],
  [-102.0, -36.0, -78.0, -28.0, 24.0],
  [-78.0, -36.0, -70.0, -12.0, 42.0],
  [34.0, -36.0, 50.0, -28.0, 24.0],
  [74.0, -36.0, 82.0, -20.0, 48.0],
  [-126.0, -28.0, -110.0, 4.0, 18.0],
  [-110.0, -28.0, -78.0, -4.0, 30.0],
  [-70.0, -28.0, -46.0, -12.0, 42.0],
  [-46.0, -28.0, -30.0, -20.0, 48.0],
  [10.0, -28.0, 26.0, -12.0, 48.0],
  [26.0, -28.0, 58.0, -12.0, 42.0],
  [58.0, -28.0, 66.0, 44.0, 48.0],
  [-46.0, -20.0, -38.0, -12.0, 42.0],
  [-38.0, -20.0, -30.0, -12.0, 48.0],
  [66.0, -20.0, 74.0, 44.0, 48.0],
  [74.0, -20.0, 82.0, 44.0, 42.0],
  [-14.0, -12.0, 2.0, 20.0, 48.0],
  [2.0, -12.0, 26.0, 20.0, 24.0],
  [26.0, -12.0, 34.0, -4.0, 42.0],
  [34.0, -12.0, 50.0, 20.0, 36.0],
  [50.0, -12.0, 58.0, 44.0, 48.0],
  [82.0, -12.0, 90.0, 44.0, 42.0],
  [26.0, -4.0, 34.0, 28.0, 36.0],
  [-70.0, 12.0, -62.0, 28.0, 24.0],
  [-62.0, 12.0, -38.0, 20.0, 18.0],
  [-22.0, 12.0, -14.0, 20.0, 48.0],
  [-62.0, 20.0, -54.0, 36.0, 24.0],
  [-54.0, 20.0, -38.0, 28.0, 18.0],
  [-38.0, 20.0, -6.0, 44.0, 42.0],
  [-6.0, 20.0, 2.0, 28.0, 48.0],
  [2.0, 20.0, 10.0, 44.0, 42.0],
  [10.0, 20.0, 18.0, 28.0, 24.0],
  [18.0, 20.0, 26.0, 28.0, 36.0],
  [34.0, 20.0, 42.0, 28.0, 36.0],
  [42.0, 20.0, 50.0, 36.0, 48.0],
  [-78.0, 28.0, -62.0, 44.0, 18.0],
  [-54.0, 28.0, -46.0, 60.0, 18.0],
  [-46.0, 28.0, -38.0, 44.0, 42.0],
  [-6.0, 28.0, 2.0, 52.0, 42.0],
  [10.0, 28.0, 42.0, 44.0, 42.0],
  [-86.0, 36.0, -78.0, 60.0, 18.0],
  [-62.0, 36.0, -54.0, 44.0, 18.0],
  [42.0, 36.0, 50.0, 84.0, 36.0],
  [-78.0, 44.0, -70.0, 84.0, 18.0],
  [-70.0, 44.0, -54.0, 52.0, 24.0],
  [-46.0, 44.0, -22.0, 52.0, 18.0],
  [-22.0, 44.0, -6.0, 60.0, 24.0],
  [2.0, 44.0, 26.0, 76.0, 30.0],
  [26.0, 44.0, 42.0, 52.0, 36.0],
  [50.0, 44.0, 58.0, 76.0, 36.0],
  [-70.0, 52.0, -62.0, 84.0, 18.0],
  [-62.0, 52.0, -54.0, 68.0, 24.0],
  [-46.0, 52.0, -38.0, 68.0, 24.0],
  [-38.0, 52.0, -22.0, 76.0, 18.0],
  [-6.0, 52.0, 2.0, 84.0, 18.0],
  [26.0, 52.0, 34.0, 60.0, 24.0],
  [34.0, 52.0, 42.0, 84.0, 36.0],
  [-54.0, 60.0, -46.0, 68.0, 24.0],
  [-22.0, 60.0, -6.0, 76.0, 18.0],
  [26.0, 60.0, 34.0, 100.0, 30.0],
  [-62.0, 68.0, -38.0, 76.0, 18.0],
  [-62.0, 76.0, -54.0, 84.0, 18.0],
  [-14.0, 76.0, -6.0, 84.0, 18.0],
  [2.0, 76.0, 10.0, 108.0, 24.0],
  [10.0, 76.0, 26.0, 100.0, 30.0],
  [34.0, 84.0, 42.0, 92.0, 30.0],
  [10.0, 100.0, 18.0, 108.0, 24.0],
]

const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)

/** Window bands on wall a→b between z0 and z1, two storeys each. */
function bands(a: XY, b: XY, z0: number, z1: number) {
  const { L } = onWall(a, b)
  if (L < 8 || z1 - z0 < 6) return
  for (let z = z0 + 2.4; z + 3 < z1 - 1; z += 7.6) panel(win, a, b, 1.2, L - 1.2, z, Math.min(z + 4, z1 - 1.2), 0.05)
}

// --- Podium along the exact outline.
const O = ccw(OUTLINE)
walls(cream, O, 0, POD)
cap(roof, O, POD)
for (let i = 0; i < O.length; i++) bands(O[i], O[(i + 1) % O.length], 0, POD)

// --- Lidar blocks above the podium.
for (const [x0, y0, x1, y1, h] of BLOCKS) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  walls(cream, r, POD, h)
  cap(roof, r, h)
  for (let i = 0; i < 4; i++) bands(r[i], r[(i + 1) % 4], POD, h)
}

// --- The curved green glass front: the outline's arc and an arc 14 m in, to 45 m.
{
  const pull = (p: XY, d: number): XY => { const v = [CENTRE[0] - p[0], CENTRE[1] - p[1]], L = Math.hypot(v[0], v[1]); return [p[0] + v[0] / L * d, p[1] + v[1] / L * d] }
  const S = ccw([...ARC, ...[...ARC].reverse().map(p => pull(p, DEPTH))])
  walls(green, S, 0, FRONT)
  cap(roof, S, FRONT)
  // white mullion fins on the curved face and a white cornice
  for (let i = 0; i < ARC.length - 1; i++) {
    const a = ARC[i], b = ARC[i + 1]
    const [p, q] = area(S) > 0 && S.indexOf(a) >= 0 && S[(S.indexOf(a) + 1) % S.length] === b ? [a, b] : [b, a]
    const { L } = onWall(p, q)
    panel(white, p, q, 0, Math.min(0.5, L), 0, FRONT, 0.25)
    for (let z = 10; z < FRONT - 2; z += 7.6) panel(white, p, q, 0, L, z, z + 0.4, 0.1)
    panel(white, p, q, 0, L, FRONT - 2.2, FRONT, 0.3)
  }
  // the blue entrance canopy in front of its middle
  const m = ARC[Math.floor(ARC.length / 2)], o = pull(m, -9)
  const u = [ARC[Math.floor(ARC.length / 2) + 1][0] - ARC[Math.floor(ARC.length / 2) - 1][0], ARC[Math.floor(ARC.length / 2) + 1][1] - ARC[Math.floor(ARC.length / 2) - 1][1]]
  const Lu = Math.hypot(u[0], u[1]), ux = u[0] / Lu * 11, uy = u[1] / Lu * 11
  const C: XY[] = ccw([[m[0] - ux, m[1] - uy], [m[0] + ux, m[1] + uy], [o[0] + ux, o[1] + uy], [o[0] - ux, o[1] - uy]])
  walls(canopy, C, 5.5, 6.5)
  cap(canopy, C, 6.5)
  cap(canopy, C, 5.5, false)
}

if (import.meta.main) {
  await save('clt-carolinas-medical-center', 'Atrium Health Carolinas Medical Center', ANCHOR, BEARING, [
    { part: cream, material: finish('cmc-cream', 0xebe6da) },
    { part: win, material: PALETTE.window },
    { part: green, material: windowVariant(2, 0x3f7a6a) },
    { part: white, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: canopy, material: finish('cmc-canopy-blue', 0x3f6fae) },
  ], 6500)
}
