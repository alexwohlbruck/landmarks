/**
 * McNay Art Museum, San Antonio: procedural, CC0-1.0.
 * bun generators/sat-mcnay.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * centre of OSM's building (relation/6283056, a multipolygon with three
 * courtyards: -98.4563180, 29.4858103). y = 0 is the lowest ground under
 * it, at the north-west corner; the site rises about 6 m to the south and
 * east (2017 lidar ground), and the walls run into the slope.
 *
 * Atlee B. and Robert M. Ayres, 1929: Marion Koogler McNay's Spanish
 * Colonial Revival house, now the museum, in white stucco under red tile
 * hip roofs, built round courtyards, with a polygonal tower at the
 * entrance. Galleries were added round it; the Jane and Arthur Stieren
 * Center (Jean-Paul Viguier, 2008) is the flat-roofed wing of grey stone
 * and glass to the east. OSM maps them all as one building.
 *
 * Measured (lidar USGS_LPC_TX_Central_B2_2017_LAS_2019, flown 2017;
 * heights above y = 0):
 * - the house and galleries: eaves about 11 m over the low ground (8-12 m
 *   over their own ground), roofs to 14.5-16 m;
 * - the entrance tower's top about 20 m (x 8..12, y 2);
 * - the Stieren Center's flat roof about 13 m.
 * From photos: the white stucco, the tile roofs, the tower's polygonal
 * plan and low tile cap, the Stieren Center's stone and glass.
 * Drawn: each roof as a tile band sloping up 1.6 m from the eaves round
 * every wall, inner and outer, to a tiled top: the hips abstracted, since
 * the wings are too narrow and irregular for true hips at this size.
 * Estimated: the eave and roof heights as one level for the old house,
 * the tower's size (8 m across, 8 sides), the window rhythm, the split
 * between the house and the Stieren Center at x 14.
 * Left out: the courtyard's fountains and planting, loggias, chimneys.
 *
 * OSM: relation/6283056 (one building with three courtyards), replaced.
 * The site's other buildings (ways 422672297, 422672298, 422672300,
 * 422672302) are separate and left to the map; way/30446984 is the
 * museum grounds, not a building.
 *
 * Night: windows `window`; the stucco is floodlit softly at the tower.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Mcnay front1 Nima.JPG", "McNay courtyard Nima1.JPG", "McNay Viguier
 *   Nima.JPG", Zereshk, CC BY-SA 3.0
 * - "McNay Art Museum - panoramio.jpg", NODE of Texas, CC BY 3.0
 * - "McNayArtMuseum.jpg", Csyberblue, public domain
 *
 * Doubts: the roofs' true hip lines; the north-west galleries' facades.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ring, walls, offset, outN, capPoly, bayPanels, type XY } from './sat-frost-tower'
import { bandTris } from './sf-de-young'

const stucco = new Part()
const tile = new Part()
const win = new Part()
const stone = new Part()
const roofP = new Part()

const OUTER: XY[] = [[-53.2, -34.5], [-56.3, -30.9], [-57.1, -31.6], [-59.9, -31.3], [-62.0, -28.9], [-61.8, -26.1], [-60.9, -25.4], [-63.6, -22.2], [-63.4, -19.1], [-76.7, -18.0], [-76.0, -8.3], [-72.3, -8.6], [-72.1, -5.4], [-79.1, 2.9], [-70.9, 9.7], [-70.4, 15.3], [-72.5, 17.7], [-72.4, 19.2], [-79.3, 19.7], [-78.3, 31.7], [-54.2, 29.8], [-54.4, 27.2], [-27.5, 25.1], [-28.2, 15.6], [-27.3, 15.5], [-26.9, 20.2], [-8.4, 18.8], [-6.8, 38.9], [8.2, 37.7], [8.0, 35.5], [10.8, 35.3], [10.7, 33.7], [14.4, 33.4], [12.4, 7.2], [30.7, 5.7], [55.8, 3.8], [55.5, -1.0], [77.9, -2.8], [75.6, -33.1], [-3.8, -26.9], [-7.3, -29.9], [-7.6, -34.6], [-19.3, -33.7], [-19.5, -36.9], [-23.7, -36.6], [-23.8, -38.1], [-30.9, -37.5], [-30.7, -34.9], [-39.0, -34.3], [-39.3, -37.6], [-49.4, -36.8], [-49.2, -34.8]]
const INNERS: XY[][] = [
  [[-27.5, 12.6], [-28.4, 12.7], [-28.5, 11.8], [-35.8, 12.3], [-36.9, -1.3], [-32.6, -1.6], [-31.9, 7.2], [-25.7, 6.8], [-25.8, 5.5], [-18.8, 4.9], [-18.6, 7.5], [-27.8, 8.2]],
  [[-49.5, -7.7], [-56.2, -13.0], [-47.9, -22.8], [-38.2, -23.6], [-38.3, -25.1], [-27.8, -25.9], [-27.7, -24.9], [-9.9, -26.3], [-6.5, -23.5], [-5.7, -13.2], [-2.7, -10.7], [-5.3, -7.6], [-8.1, -10.0], [-14.4, -9.5], [-14.1, -5.5], [-18.2, -5.2], [-18.5, -9.1], [-26.9, -8.5], [-27.0, -9.4]],
  [[-50.1, -0.2], [-46.6, -0.5], [-45.5, 13.1], [-65.0, 14.6], [-65.4, 9.7], [-55.3, -2.2], [-61.7, -7.6], [-59.6, -7.7]],
].map((r) => ring(r as XY[]))

/** Clip a CCW ring to x <= c (keep) or x >= c (keep = false), Sutherland-Hodgman. */
function clipX(P: XY[], c: number, keepLess: boolean): XY[] {
  const ins = (p: XY) => (keepLess ? p[0] <= c : p[0] >= c)
  const out: XY[] = []
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length]
    if (ins(a)) out.push(a)
    if (ins(a) !== ins(b)) { const t = (c - a[0]) / (b[0] - a[0]); out.push([c, a[1] + t * (b[1] - a[1])]) }
  }
  return ring(out)
}
const SPLIT = 14
const HOUSE = clipX(ring(OUTER), SPLIT, true)
const STIEREN = clipX(ring(OUTER), SPLIT, false)

// ---------------------------------------------------------- the old house ---
const EAVE = 11.0, RISE = 1.6, IN = 1.6, TOP = EAVE + RISE
walls(stucco, HOUSE, 0, EAVE)
for (const I of INNERS) walls(stucco, [...I].reverse(), 0, EAVE)   // courtyard walls face in
// the tile roof: bands up from every eave, a tiled top between them
{
  const band = (A: XY[], B: XY[], into: boolean) => {
    for (let i = 0; i < A.length; i++) {
      const j = (i + 1) % A.length, n = outN(A[i], A[j]), s = into ? -1 : 1
      const P: V3[] = [[A[i][0], A[i][1], EAVE], [A[j][0], A[j][1], EAVE], [B[j][0], B[j][1], TOP], [B[i][0], B[i][1], TOP]]
      const nn: V3 = [n[0] * s, n[1] * s, 1.6]
      // wind to face up-and-out
      const f = [P[1][0] - P[0][0], P[1][1] - P[0][1], P[1][2] - P[0][2]], g = [P[2][0] - P[0][0], P[2][1] - P[0][1], P[2][2] - P[0][2]]
      const c = [f[1] * g[2] - f[2] * g[1], f[2] * g[0] - f[0] * g[2], f[0] * g[1] - f[1] * g[0]]
      if (c[0] * nn[0] + c[1] * nn[1] + c[2] * nn[2] >= 0) tile.quad(P[0], P[1], P[2], P[3])
      else tile.quad(P[0], P[3], P[2], P[1])
    }
  }
  const OUTIN = offset(HOUSE, -IN)
  band(HOUSE, OUTIN, false)
  const HOLES = INNERS.map((I) => offset(I, IN))
  INNERS.forEach((I, k) => band(I, HOLES[k], true))
  for (const [a, b, c] of bandTris([OUTIN, ...HOLES])) {
    const A: V3 = [a[0], a[1], TOP], B: V3 = [b[0], b[1], TOP], C: V3 = [c[0], c[1], TOP]
    const z = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    if (z >= 0) tile.tri(A, B, C)
    else tile.tri(A, C, B)
  }
}
// windows: one per real window, two floors, on the outer walls and courtyards
bayPanels(win, HOUSE, [[2.2, 4.6], [6.6, 9.0]], 1.2, 3.2, 3, (i) => {
  const a = HOUSE[i], b = HOUSE[(i + 1) % HOUSE.length]
  return Math.abs(a[0] - SPLIT) < 0.01 && Math.abs(b[0] - SPLIT) < 0.01
})
for (const I of INNERS) bayPanels(win, [...I].reverse(), [[2.2, 4.6], [6.6, 9.0]], 1.2, 3.2, 3)

// the entrance tower: octagonal, stucco, under a low tile cap
{
  const cx = 10, cy = 2, R = 4.0, K = 8
  const T: XY[] = Array.from({ length: K }, (_, k) => [cx + R * Math.cos((2 * Math.PI * (k + 0.5)) / K), cy + R * Math.sin((2 * Math.PI * (k + 0.5)) / K)] as XY)
  walls(stucco, ring(T), 0, 17.6)
  bayPanels(win, ring(T), [[13.0, 15.6]], 1.0, 0.9, 2)
  const E: XY[] = offset(ring(T), 0.8)
  for (let i = 0; i < K; i++) {
    const j = (i + 1) % K
    const a: V3 = [E[i][0], E[i][1], 17.6], b: V3 = [E[j][0], E[j][1], 17.6], c: V3 = [cx, cy, 20.0]
    const z = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    if (z >= 0) tile.tri(a, b, c)
    else tile.tri(a, c, b)
  }
  capPoly(stucco, E, 17.6, false)
}

// --------------------------------------------------- the Stieren Center ---
walls(stone, STIEREN, 0, 13.0)
capPoly(roofP, STIEREN, 13.0, true)
bayPanels(win, STIEREN, [[1.0, 6.5]], 5.0, 1.0, 6, (i) => {
  const a = STIEREN[i], b = STIEREN[(i + 1) % STIEREN.length]
  return Math.abs(a[0] - SPLIT) < 0.01 && Math.abs(b[0] - SPLIT) < 0.01
})

// Colours from daylight photos, pulled to the palette's lightness.
const towerLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : Math.hypot(p[0] - 10, p[1] - 2) < 6 ? 0.8 : 0.2)
const parts = [
  { part: stucco, material: { ...finish('mcnay-stucco', 0xf2e9e1), floodlight: towerLit } },
  { part: tile, material: PALETTE.terracotta },
  { part: win, material: PALETTE.window },
  { part: stone, material: finish('mcnay-stieren-stone', 0xc4c2bc) },
  { part: roofP, material: PALETTE.roof },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('McNay Art Museum', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 20.0, anchor: [29.4858103, -98.456318], replaces: ['relation/6283056'],
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/sat-mcnay.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
