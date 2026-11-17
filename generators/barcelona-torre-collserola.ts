/**
 * Torre de Collserola, Barcelona — original procedural geometry, CC0-1.0.
 * bun generators/barcelona-torre-collserola.ts
 *
 * Uses the kit exported by generators/barcelona-arc-de-triomf.ts.
 *
 * Frame: not turned (BEARING 0): +y north, +x east, z up, metres. Origin =
 * the area centroid of the OSM relation/20725097, on the floor of the round
 * pit the shaft rises from; y = 0 is that floor, the lowest ground under the
 * tower (the hilltop around the pit is about 18.5 m higher).
 *
 * Evidence
 * - OSM relation/20725097 (Torre de Collserola, height 288.4, Q1147977): the
 *   pit's retaining ring (outer and inner rings, a rounded triangle about
 *   31 m across, 1.3 m thick) and its parts: way/305960313 (the platform
 *   module, 84-152 m, the same rounded triangle, apexes to the north, south-
 *   east and south-west), way/305960311 (the shaft, r 2.25, to 205),
 *   way/305960312 (r 1.8, to 243), way/305960310 (the mast, r 0.9, to 288,
 *   pyramidal top), way/305960314 (building:part=no, the whole, 288.4).
 * - Published (ca/en.wikipedia "Torre de Collserola"): Norman Foster, 1992,
 *   288.4 m; a slender concrete shaft; a 13-storey platform module hung on
 *   it and held, with the shaft, by three pairs of pre-stressed guys below
 *   (steel) and three pairs above (aramid fibre) to the mast.
 * - Mapterhorn terrain (bun tools/terrain.ts grid, 5 m and 10 m steps): the
 *   pit, about 18.5 m deep and 15 m across at the bottom, on a hilltop
 *   falling away 15-25 m within 70 m to the south-west and south-east. The
 *   10 m table is embedded below (`GROUND`), less its pit-floor reading, to
 *   stand the lower guys' anchors on the hillside.
 * - Commons photos (EVIDENCE):
 *   "Torre de Collserola 2013.jpg" (Felix Konig, CC BY 3.0; from Tibidabo,
 *   the whole tower with both sets of guys: proportions measured from it);
 *   "Barcelona - Torre de Collserola from Tibidabo.jpg" (Joe Mabel, CC BY-SA
 *   4.0; the tower on its hill, the lower guys' spread);
 *   "Torre de Collserola from Tibidabo.jpg" (Jaipasdepseudo, CC0);
 *   "Torre de Collserola in 2026.jpg" (Bravodelnorte, CC BY-SA 4.0; current
 *   state, no visible change); "Torre de Collserola - 002.jpg" (Mutari,
 *   public domain).
 *
 * Heights from OSM (they agree with the photo, scaled to 288.4 m); the
 * platform's thirteen floors drawn as seven white slab edges (every other
 * floor, to keep the bands calm) round a grey-blue
 * equipment core; the shaft 4.5 m across, the antenna section 3.6 m, the
 * mast tapering to its tip. Estimated from the photos: the lower guys' fan
 * (two from each corner of the platform's underside, 40 m out, +-22 degrees
 * either side of the corner) and the upper guys (two from each corner of
 * the platform's top to the shaft at 205). Guys drawn 0.5 m thick, far
 * bolder than the real cables, so they read at map distance; the
 * real cables are the tower's identity. No detail model: the bold guys are
 * in this one.
 *
 * Doubts: the pit's ring wall is drawn to the hilltop's level (18.5 m, from
 * the terrain); on the map it lines the terrain's pit and only its rim
 * shows. The lower guys' anchors stand on the Mapterhorn hillside, 8-14 m
 * above the pit floor; the map's drape may leave them a metre or two off.
 *
 * Left out: the dishes and antennas on the platform, the hilltop visitor
 * building, the lifts.
 *
 * Night: the platform glows (its core is a window material); the shaft
 * takes a light wash.
 */
import { Part, type V3 } from './mesh'
import { finish, windowVariant, type Swatch } from './palette'
import { beam, lathe, prismN, quadN, save, type XY } from './barcelona-arc-de-triomf'

const concrete = new Part(), white = new Part(), core = new Part(), cable = new Part(), mast = new Part()

// Mapterhorn z15, 10 m steps, rows north to south (y = +70 .. -70), columns x = -70 .. 70,
// metres above the table's lowest point; the pit floor reads 22.4.
const GROUND = [
  [18.2, 17.7, 17.6, 15.9, 15.0, 15.7, 20.6, 23.6, 22.6, 29.4, 34.9, 36.9, 38.4, 38.9, 39.2],
  [26.0, 25.6, 21.6, 21.3, 19.8, 20.2, 22.2, 22.4, 23.5, 30.3, 36.9, 38.6, 38.9, 39.2, 39.5],
  [31.5, 24.4, 21.3, 21.5, 22.4, 23.7, 22.5, 22.8, 23.8, 32.6, 38.3, 39.2, 39.6, 39.9, 42.8],
  [29.7, 24.5, 21.6, 21.4, 23.9, 30.2, 30.0, 30.9, 30.4, 34.6, 39.4, 39.9, 41.1, 44.1, 43.8],
  [26.5, 27.2, 28.8, 31.2, 32.4, 34.2, 35.0, 29.4, 35.1, 37.1, 40.4, 41.1, 43.8, 44.2, 42.8],
  [31.2, 32.1, 32.6, 34.9, 35.7, 37.0, 38.7, 39.8, 39.5, 40.1, 40.9, 42.1, 43.0, 42.3, 39.4],
  [31.8, 31.9, 32.4, 35.8, 37.5, 39.1, 41.1, 34.4, 41.3, 41.3, 41.2, 41.0, 39.8, 38.3, 38.0],
  [28.8, 30.7, 32.3, 35.0, 37.3, 39.7, 37.6, 22.4, 31.5, 41.2, 40.8, 39.1, 37.1, 36.5, 34.0],
  [21.3, 25.3, 27.4, 33.9, 36.4, 39.3, 35.9, 34.5, 36.7, 40.6, 38.6, 36.4, 35.3, 32.8, 29.5],
  [21.3, 24.0, 27.9, 32.1, 35.2, 37.3, 39.6, 40.1, 39.9, 38.8, 36.7, 34.3, 32.6, 29.5, 27.7],
  [18.4, 21.2, 22.7, 26.1, 30.8, 34.0, 36.3, 37.5, 37.7, 36.9, 35.0, 33.4, 29.8, 27.5, 25.2],
  [13.6, 17.0, 21.0, 23.5, 25.9, 29.7, 32.6, 34.5, 35.4, 35.1, 33.1, 31.6, 28.0, 25.7, 23.1],
  [8.8, 13.5, 16.0, 19.8, 24.6, 26.8, 28.9, 31.4, 32.4, 32.4, 31.7, 29.2, 26.1, 24.6, 21.0],
  [5.1, 9.1, 13.5, 15.7, 19.8, 23.8, 27.6, 29.3, 30.2, 30.8, 29.5, 27.1, 25.1, 22.8, 18.7],
  [0.0, 6.5, 10.2, 12.9, 17.0, 20.1, 23.1, 25.7, 27.4, 28.0, 26.7, 24.7, 22.3, 20.0, 17.1],
]
// the table's "z" axis runs south: row r is y = 70 - 10 r... (row 0 is z = -70, i.e. 70 m north)
const ground = (x: number, y: number) => {
  const c = (x + 70) / 10, r = (70 - y) / 10
  const c0 = Math.max(0, Math.min(13, Math.floor(c))), r0 = Math.max(0, Math.min(13, Math.floor(r)))
  const fc = c - c0, fr = r - r0
  const g = (rr: number, cc: number) => GROUND[rr][cc]
  const v = g(r0, c0) * (1 - fc) * (1 - fr) + g(r0, c0 + 1) * fc * (1 - fr) + g(r0 + 1, c0) * (1 - fc) * fr + g(r0 + 1, c0 + 1) * fc * fr
  return v - 22.4
}

// --- the plan: OSM's rounded triangle, apexes at these bearings from the axis ---
const APEX = [102, -20, 220].map((d) => (d * Math.PI) / 180) // maths angles of the three corners
function rounded(rApex: number, rSide: number, n = 6): XY[] {
  const pts: XY[] = []
  for (let k = 0; k < 3; k++) {
    const a0 = APEX[k], a1 = APEX[(k + 1) % 3] + (APEX[(k + 1) % 3] < a0 ? 2 * Math.PI : 0)
    for (let i = 0; i < n; i++) {
      const t = i / n, a = a0 + (a1 - a0) * t
      // radius: the apex, easing to the middle of the side and back
      const r = rSide + (rApex - rSide) * Math.pow(Math.cos(Math.PI * t), 2)
      pts.push([r * Math.cos(a), r * Math.sin(a)])
    }
  }
  return pts
}

// --- the pit's retaining ring, its top at the hilltop's level ---
{
  const o = rounded(16.2, 12.6, 6), i = rounded(14.9, 11.3, 6)
  prismN(concrete, o, 0, 18.5, null)
  for (let k = 0; k < o.length; k++) {
    const j = (k + 1) % o.length
    // the inner face, looking in, and the coping
    const a = i[k], b = i[j], l = Math.hypot(b[0] - a[0], b[1] - a[1])
    quadN(concrete, [b[0], b[1], 0], [a[0], a[1], 0], [a[0], a[1], 18.5], [b[0], b[1], 18.5], [-(b[1] - a[1]) / l, (b[0] - a[0]) / l, 0])
    quadN(concrete, [o[k][0], o[k][1], 18.5], [o[j][0], o[j][1], 18.5], [i[j][0], i[j][1], 18.5], [i[k][0], i[k][1], 18.5], [0, 0, 1])
  }
}

// --- shaft, antenna section and mast ---
lathe(concrete, 0, 0, [[2.6, 0], [2.25, 3], [2.25, 205]], 14)
lathe(mast, 0, 0, [[2.25, 205], [1.8, 206], [1.8, 243], [0.9, 245], [0.9, 268], [0.55, 270], [0.35, 285], [0.15, 288.4]], 10)
for (const z of [215, 226, 236]) lathe(white, 0, 0, [[1.8, z], [2.2, z + 0.4], [2.2, z + 1.8], [1.8, z + 2.2]], 10)

// --- the platform module: thirteen floors on the shaft ---
const Z0 = 84, Z1 = 152, FLOORS = 13
{
  const out = rounded(16.6, 12.0, 6), inner = rounded(15.2, 10.8, 6)
  prismN(core, inner, Z0, Z1, null)
  // every other floor's slab edge, so the bands stay calm at map distance
  for (let f = 0; f <= FLOORS + 1; f += 2) {
    const z = Z0 + ((Z1 - Z0) * Math.min(f, FLOORS)) / FLOORS
    prismN(white, out, z - 0.7, z + 0.7, white, white)
  }
  // the three corner trusses: white posts up each apex
  for (const a of APEX) beam(white, [16.8 * Math.cos(a), 16.8 * Math.sin(a), Z0 - 1.5], [16.8 * Math.cos(a), 16.8 * Math.sin(a), Z1 + 1.5], 1.3)
}

// --- the guys: three pairs below to the hillside, three pairs above to the shaft ---
for (const a of APEX) {
  const top: V3 = [16.8 * Math.cos(a), 16.8 * Math.sin(a), Z1 + 1.0]
  const bot: V3 = [16.8 * Math.cos(a), 16.8 * Math.sin(a), Z0 - 1.0]
  for (const s of [-1, 1]) {
    // lower: fanning out to anchors 40 m from the axis
    const t = a + s * 0.38
    const ax = 40 * Math.cos(t), ay = 40 * Math.sin(t)
    beam(cable, bot, [ax, ay, ground(ax, ay)], 0.5)
    // upper: from either side of the corner to the shaft's head
    const side: XY = [-Math.sin(a) * s * 1.6, Math.cos(a) * s * 1.6]
    beam(cable, [top[0] + side[0], top[1] + side[1], top[2]], [Math.cos(a) * 1.9, Math.sin(a) * 1.9, 205], 0.45)
  }
}

const lit = (p: V3, n: V3) => (p[2] > 18 && p[2] < 210 ? (n[2] > 0.7 ? 0.2 : 0.5) : 0)
await save('barcelona-torre-collserola', 'Torre de Collserola', [41.417255, 2.114264], 0, [
  { part: concrete, material: { ...finish('collserola-concrete', 0xd2d3cf), floodlight: lit } as Swatch },
  { part: white, material: { ...finish('collserola-white', 0xeff0ee), floodlight: lit } as Swatch },
  { part: core, material: windowVariant(2, 0xb3bec7) },
  { part: cable, material: finish('collserola-cable', 0x5b6168) },
  { part: mast, material: finish('collserola-mast', 0xa9aeb2) },
])
