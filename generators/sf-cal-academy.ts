/**
 * California Academy of Sciences, Golden Gate Park, San Francisco — original
 * procedural geometry, CC0-1.0.
 * bun generators/sf-cal-academy.ts
 *
 * Map frame: x east, y north, z up, metres, built turned to bearing 317.9:
 * the model's north (+y) is the main front on the Music Concourse (facing
 * north-west); +x runs along the long side (bearing 47.9). Origin = centroid
 * of the OSM outline way/28695389.
 *
 * Evidence
 * - OSM way/28695389 (building=museum, height 11): the roof's outline,
 *   160 x 102 m.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 1 m, in the turned
 *   frame: the lowest ground at the footprint, a sunken strip along the back,
 *   69.7 m NAVD88 (y = 0); the concourse in front ~76.8 (+7.1); the canopy's
 *   edge at +18.9, x -82..83, y -54..50; the living roof +19.1 to +19.3;
 *   seven hills: two big ones at (-26, 2) and (29, 2), 7.5 m above the roof
 *   and ~35 m across; five small ones at (0, -23) (+5.7), (-20, -24) and
 *   (21, -24) (+2.7), (-11, 20) and (13, 20) (+2.5); the piazza's glass roof
 *   between the big hills dipping to ~+17.3; a box on the roof deck at
 *   (-23, 26), +25.1.
 * - USGS NAIP: the canopy reads as a pale band ~9 m wide round the green
 *   roof; the piazza's square glass roof; the portholes clustered on the
 *   hills; the paved roof deck north-west of the west hill.
 * - Published (Wikipedia; Renzo Piano Building Workshop): 2008; 2.5-acre
 *   living roof of native plants on seven hills; the two largest over the
 *   planetarium and the rainforest sphere; portholes that open for
 *   ventilation; a glass-roofed central piazza; the canopy carries
 *   photovoltaic cells; glass perimeter walls.
 * - Commons daylight photos: "California Academy of Sciences pano
 *   (cropped).jpg" (WolfmanSF, CC BY-SA 3.0, the front from the de Young
 *   tower); "Living roof at the California Academy of Sciences.jpg" and
 *   "Living roof, California Academy of Sciences Museum ... .jpg" (Carol M.
 *   Highsmith, public domain, the portholes); "Living Roof - California
 *   Academy of Sciences.jpg" (Don McCulley, CC BY-SA 4.0); "California
 *   Academy of Sciences Building ... .jpg" (Carol M. Highsmith, public
 *   domain, the entrance under the canopy, stone walls either side).
 *
 * Estimated: the wall line (5 m in from the canopy's edge), the canopy's
 * 0.6 m edge, the entrance's width, the porthole layout (rings on the big
 * hills, as the photos show, not counted one by one) and the hills' exact
 * profiles between the lidar's 4 m samples. The living roof is drawn as a
 * muted green roof finish, not as ground.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { bandTris, lathe, prism, report, type XY } from './sf-de-young'

const ANCHOR = { lng: -122.46609147, lat: 37.76982799 }
const canopy = new Part(), green = new Part(), stone = new Part(), wall = new Part(), glass = new Part()

// --- heights above y = 0 (69.7 m NAVD88) ---
const EDGE0 = 18.3, EDGE = 18.9, ROOF = 19.2, PIAZZA = 17.4
const CX0 = -82, CX1 = 82.5, CY0 = -53.5, CY1 = 50.5 // canopy
const BAND = 9 // canopy band round the green roof
const WX0 = CX0 + 5, WX1 = CX1 - 5, WY0 = CY0 + 5, WY1 = CY1 - 5 // walls
const PZ: [number, number, number, number] = [-8, 10, -8, 12] // piazza roof

const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// --- the canopy: a thin flat plate, a band round the living roof ---
{
  const outer = rect(CX0, CY0, CX1, CY1), inner = rect(CX0 + BAND, CY0 + BAND, CX1 - BAND, CY1 - BAND)
  for (const [a, b, c] of bandTris([outer, [...inner].reverse()])) canopy.tri([...a, EDGE], [...b, EDGE], [...c, EDGE])
  prism(canopy, outer, EDGE0, EDGE, null)
  // underside, so the overhang has a soffit
  for (const [a, b, c] of bandTris([outer, [...rect(WX0, WY0, WX1, WY1)].reverse()])) canopy.tri([...c, EDGE0], [...b, EDGE0], [...a, EDGE0])
  // the step up from the canopy to the planted roof
  prism(green, inner, EDGE, ROOF, null)
}
// --- the living roof, with the piazza's glass roof let into it ---
{
  const inner = rect(CX0 + BAND, CY0 + BAND, CX1 - BAND, CY1 - BAND)
  const hole = rect(PZ[0], PZ[2], PZ[1], PZ[3])
  for (const [a, b, c] of bandTris([inner, [...hole].reverse()])) green.tri([...a, ROOF], [...b, ROOF], [...c, ROOF])
  // the piazza: a glass roof dipping in the middle, inside a low curb
  const P = (x: number, y: number): V3 => {
    const u = (x - PZ[0]) / (PZ[1] - PZ[0]), v = (y - PZ[2]) / (PZ[3] - PZ[2])
    return [x, y, ROOF - (ROOF - PIAZZA) * Math.sin(Math.PI * u) * Math.sin(Math.PI * v)]
  }
  const n = 6
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const x0 = PZ[0] + ((PZ[1] - PZ[0]) * i) / n, x1 = PZ[0] + ((PZ[1] - PZ[0]) * (i + 1)) / n
    const y0 = PZ[2] + ((PZ[3] - PZ[2]) * j) / n, y1 = PZ[2] + ((PZ[3] - PZ[2]) * (j + 1)) / n
    glass.quad(P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1))
  }
}

// --- the seven hills, with portholes on the big two ---
type Hill = { c: XY; h: number; r: number }
const hills: Hill[] = [
  { c: [-26, 2], h: 7.5, r: 17.5 },
  { c: [29, 2], h: 7.5, r: 17.5 },
  { c: [0, -23], h: 5.7, r: 12 },
  { c: [-20, -24], h: 2.7, r: 7.5 },
  { c: [21, -24], h: 2.7, r: 7.5 },
  { c: [-11, 20], h: 2.5, r: 7 },
  { c: [13, 20], h: 2.6, r: 7 },
]
/** A hill's height above the roof at distance d from its centre: a smooth bell. */
const bell = (H: Hill, d: number) => (d >= H.r ? 0 : H.h * Math.pow(Math.cos((Math.PI / 2) * (d / H.r)), 1.6))
for (const H of hills) {
  const prof: [number, number][] = []
  const K = H.r > 10 ? 8 : 5
  for (let i = K; i >= 0; i--) { const d = (H.r * i) / K; prof.push([d, ROOF - 0.05 + bell(H, d)]) }
  lathe(green, prof, H.r > 10 ? 20 : 14, H.c, 0, true)
}
{
  // portholes: round skylights in rings, each a flat disc lying on the slope
  const disc = (H: Hill, d: number, a: number, rad: number) => {
    const x = H.c[0] + d * Math.cos(a), y = H.c[1] + d * Math.sin(a)
    const e = 0.05, z = ROOF + bell(H, d), dz = (bell(H, d + e) - bell(H, d - e)) / (2 * e)
    // the slope's normal, and two tangents
    const nr = 1 / Math.hypot(1, dz)
    const N: V3 = [-dz * Math.cos(a) * nr, -dz * Math.sin(a) * nr, nr]
    const T1: V3 = [Math.cos(a) * nr, Math.sin(a) * nr, dz * nr], T2: V3 = [-Math.sin(a), Math.cos(a), 0]
    const o: V3 = [x + N[0] * 0.25, y + N[1] * 0.25, z + N[2] * 0.25]
    const pts = Array.from({ length: 8 }, (_, k) => {
      const t = (2 * Math.PI * k) / 8
      return [o[0] + rad * (Math.cos(t) * T1[0] + Math.sin(t) * T2[0]), o[1] + rad * (Math.cos(t) * T1[1] + Math.sin(t) * T2[1]), o[2] + rad * (Math.cos(t) * T1[2] + Math.sin(t) * T2[2])] as V3
    })
    for (let k = 0; k < 8; k++) glass.tri(o, pts[k], pts[(k + 1) % 8])
  }
  for (const H of hills.slice(0, 2)) {
    disc(H, 0, 0, 1.1)
    for (const [d, n, off] of [[4.2, 6, 0], [8.0, 11, 0.2], [11.6, 15, 0.1]] as [number, number, number][])
      for (let k = 0; k < n; k++) disc(H, d, off + (2 * Math.PI * k) / n, 1.0)
  }
  for (const [d, n] of [[0, 1], [4, 6]] as [number, number][]) for (let k = 0; k < n; k++) disc(hills[2], d, (2 * Math.PI * k) / n, 0.8)
}
// the stair and lift pavilion on the roof deck
prism(canopy, rect(-26.5, 23, -19.5, 29), ROOF, 25.1, canopy, 0.25)

// --- the walls under the canopy: glass all round, the front in stone either side of the entrance ---
{
  const z1 = EDGE0
  const W = (a: XY, b: XY, p: Part) => p.quad([...a, 0], [...b, 0], [...b, z1], [...a, z1])
  W([WX0, WY0], [WX1, WY0], wall) // back
  W([WX1, WY0], [WX1, WY1], wall) // east end
  W([WX0, WY1], [WX0, WY0], wall) // west end
  // front: stone, glass, stone
  W([WX1, WY1], [14, WY1], stone)
  W([14, WY1], [-14, WY1], wall)
  W([-14, WY1], [WX0, WY1], stone)
  // the stone ends wrap the front corners a little
  // a glazed band along the top of the stone, under the canopy
  for (const [a, b] of [[WX1, 14], [-14, WX0]] as [number, number][]) {
    wall.quad([a, WY1 + 0.05, z1 - 2.6], [b, WY1 + 0.05, z1 - 2.6], [b, WY1 + 0.05, z1], [a, WY1 + 0.05, z1])
  }
}

// pale mullion fins and a floor line on the glass walls, so they read as glazing, not a slab
{
  const fin = (a: XY, b: XY) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
    const n = Math.round(L / 7.5)
    for (let i = 1; i < n; i++) {
      const c: XY = [a[0] + (ux * L * i) / n, a[1] + (uy * L * i) / n]
      prism(canopy, [[c[0] - ux * 0.25, c[1] - uy * 0.25], [c[0] + ux * 0.25, c[1] + uy * 0.25], [c[0] + ux * 0.25 + nx * 0.3, c[1] + uy * 0.25 + ny * 0.3], [c[0] - ux * 0.25 + nx * 0.3, c[1] - uy * 0.25 + ny * 0.3]], 0, EDGE0, null)
    }
    for (const z of [9.6]) canopy.quad([a[0] + nx * 0.06, a[1] + ny * 0.06, z], [b[0] + nx * 0.06, b[1] + ny * 0.06, z], [b[0] + nx * 0.06, b[1] + ny * 0.06, z + 0.5], [a[0] + nx * 0.06, a[1] + ny * 0.06, z + 0.5])
  }
  fin([WX0, WY0], [WX1, WY0]); fin([WX1, WY0], [WX1, WY1]); fin([WX0, WY1], [WX0, WY0]); fin([14, WY1], [-14, WY1])
}

const parts = [
  { part: canopy, material: finish('academy-canopy', 0xdfe2e1) },
  { part: green, material: finish('academy-living-roof', 0x9fa983) },
  { part: stone, material: PALETTE.stone },
  { part: wall, material: windowVariant(2, 0xa9bfd1) },
  { part: glass, material: PALETTE.glass },
]
const glb = writeGlb('California Academy of Sciences', parts, {
  license: 'CC0-1.0', bearing: 317.9, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: ROOF + 7.5,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/28695389'],
})
const tris = report('Cal Academy', parts, glb)
const out = new URL('../models/sf-cal-academy.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
