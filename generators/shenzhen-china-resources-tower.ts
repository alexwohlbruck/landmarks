/**
 * China Resources Headquarters ("Spring Bamboo", 中国华润大厦), Houhai,
 * Nanshan, Shenzhen — original procedural geometry, CC0-1.0.
 * bun generators/shenzhen-china-resources-tower.ts   (writes the low model and the detail LOD)
 *
 * Frame: bearing 0 (the tower is round). Origin = area centroid of the OSM
 * outline way/529272473 (113.941611 E, 22.517785 N), on the ground; the tower
 * axis is at the origin. Elevation 0.
 *
 * Form, as read from OSM and the photos (KPF, 2018):
 * - a round tower, its profile a bamboo shoot: slightly pinched at the foot,
 *   widest (73 m, the OSM outline) at about a quarter of its height, then
 *   tapering ever faster into a pointed top at 392.5 m;
 * - its 56 slender perimeter columns, silver, run up the glass from the base
 *   diagrid to the top, where they gather to the point; at the foot each pair
 *   of columns splits into a diagrid of Vs (the lobby's tall openings); near
 *   the top they cross again in a diagrid (detail);
 * - the glass between the columns, blue-grey.
 *
 * Evidence
 * - OSM, fetched 2026-11-27 with tools/osm.py: outline way/529272473
 *   (中国华润大厦, 392.5 m, 68 levels, Q18111159; English Wikipedia's
 *   coordinates were not used) and its 73 parts way/1270310028-1270310100 (a
 *   mapper's stepped approximation of the taper: 36.6 m radius at the foot,
 *   30.3 m at 244 m, 24.3 m at 294 m, pyramid to 392.5 m).
 * - Published: 392.5 m, 66 floors, 56 perimeter columns, KPF, completed 2018
 *   (Wikipedia "China Resources Tower"; CTBUH Skyscraper Center).
 * - Photos (Wikimedia Commons, all CC BY-SA 4.0):
 *   "China Resources Headquarters by the side of shenzhen bay2020.jpg",
 *   Charlie fong, drone, near-frontal: the whole profile (widths measured
 *   from it), the base diagrid, the top's crossing columns, colours;
 *   https://commons.wikimedia.org/wiki/File:China_Resources_Headquarters_by_the_side_of_shenzhen_bay2020.jpg
 *   "China Resources Headquarters 2019 july.jpg", Nord794ub, across the bay:
 *   profile and colour; https://commons.wikimedia.org/wiki/File:China_Resources_Headquarters_2019_july.jpg
 *   "China Resources Headquarters Shenzhen.jpg", Dlm423, from the SE (123 deg,
 *   840 m): profile; https://commons.wikimedia.org/wiki/File:China_Resources_Headquarters_Shenzhen.jpg
 *   "China Resources Headquarters, Shenzhen 2021.jpg", 钉钉, from the street:
 *   the columns and the top; https://commons.wikimedia.org/wiki/File:China_Resources_Headquarters,_Shenzhen_2021.jpg
 *   "ChinaResourcesHeadquartersinShenzhen20209.jpg", Charlie fong, from the
 *   SSE (154 deg, 880 m) at dusk: the night lighting (the whole column cage
 *   glows warm); https://commons.wikimedia.org/wiki/File:ChinaResourcesHeadquartersinShenzhen20209.jpg
 * - No lidar, NAIP or Mapillary used. Look-only references: none.
 *
 * Numbers
 * - Published: 392.5 m top; 56 columns.
 * - Measured (OSM): the 73.2 m outline (the widest section).
 * - Measured (photo, the drone photo, widths relative to the widest): 0.94 at
 *   the foot, 0.98 at 10%, 1.0 at 24%, 0.99 at 37%, 0.95 at 50%, 0.84 at 63%,
 *   0.65 at 76%, 0.45 at 86%, 0.26 at 93%, 0.11 at 97% of the height; the
 *   base diagrid ~45 m tall.
 * - Estimated: column size (1.1 m wide in the low model, 0.8 m in the detail;
 *   1.4 m proud), the top diagrid's crossings, colours sampled from the drone
 *   and bay photos (glass #5f768c-#9db3bf, columns #b8bbc4-#cacfe0), pulled to
 *   the palette.
 * - Simplified: the low model draws 28 of the 56 columns (every other one),
 *   the detail all 56.
 *
 * Doubts
 * - The drone photo is taken from a little above, so the measured heights
 *   of the widths are slightly foreshortened.
 * - The podium buildings around the foot are separate OSM buildings and not
 *   modelled.
 *
 * Night: the glass glows as windows (`window`, the lobby `window-2`); the
 * silver columns are floodlit (`_FLOODLIGHT`), as the cage is lit warm at night.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { saveLods, bar, type Layer } from './auckland-sky-tower'
import { grid, rib, pwl } from './shenzhen-ping-an-finance-centre'

const H = 392.5
const RMAX = 36.6
const DIAG = 45 // base diagrid height
/** Radius at z. */
const rad = (z: number) => RMAX * pwl([[0, 0.94], [0.04, 0.955], [0.105, 0.98], [0.24, 1.0], [0.37, 0.99], [0.5, 0.95], [0.632, 0.84], [0.763, 0.65], [0.862, 0.45], [0.928, 0.255], [0.974, 0.11], [1, 0.0]], z / H)

type Set = { glass: Part; lobby: Part; col: Part }
const mk = (): Set => ({ glass: new Part(), lobby: new Part(), col: new Part() })

const P = (ang: number, r: number, z: number): V3 => [r * Math.cos(ang), r * Math.sin(ang), z]

function build(s: Set, d: boolean) {
  const N = d ? 56 : 28 // columns drawn
  const SEG = d ? 56 : 28 // body segments (columns sit on the vertices)
  const lv: number[] = []
  const zs = d ? [0, 10, 22, 34, DIAG, 60, 80, 100, 125, 150, 175, 200, 225, 250, 270, 290, 310, 325, 340, 352, 362, 370, 377, 383, 387.5, 390.5, H]
    : [0, DIAG, 90, 150, 200, 245, 285, 315, 340, 360, 375, 385, H]
  for (const z of zs) lv.push(z)
  const ring = (z: number, out = 0) => {
    const r = rad(z) + out
    const pts: V3[] = []
    for (let i = 0; i < SEG; i++) pts.push(P((i / SEG) * Math.PI * 2, Math.max(r, 0.05), z))
    return pts
  }
  // the glass body, the lobby (below the diagrid top) a little darker
  grid(lv.map((z) => ring(z)), true, (_i, k) => (lv[k] < DIAG - 0.1 ? s.lobby : s.glass), () => true)

  // ---- the columns: from the top of the base diagrid to near the point, gathering in
  const colTop = H - (d ? 2.5 : 4)
  const cz = lv.filter((z) => z >= DIAG && z < colTop).concat([colTop])
  const W = d ? 0.8 : 1.15, D = d ? 1.3 : 1.5
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2
    const path = cz.map((z) => P(a, rad(z), z))
    const out = cz.map(() => [Math.cos(a), Math.sin(a), 0] as V3)
    // thinner and shallower as they gather to the point, so they don't merge into a solid cone
    const f = (k: number) => Math.min(1, Math.max(0.25, rad(cz[k]) / 12))
    rib(s.col, path, out, (k) => W * f(k), (k) => D * f(k), 0.15, true)
  }

  // ---- the base diagrid: each column splits into a V down to the ground, meeting its neighbours'
  const half = Math.PI / N
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2
    const top = P(a, rad(DIAG) + D / 2, DIAG)
    for (const s2 of [-1, 1]) {
      const b = a + s2 * half
      const foot = P(b, rad(0) + D / 2, 0)
      bar(s.col, foot, top, W * 1.15, D, [Math.cos(a + s2 * half / 2), Math.sin(a + s2 * half / 2), 0])
    }
  }
  // a silver ring where the diagrid meets the columns
  {
    const r0 = ring(DIAG - 0.8, 0.1), r1 = ring(DIAG - 0.8, D * 0.9), r2 = ring(DIAG + 0.8, D * 0.9), r3 = ring(DIAG + 0.8, 0.1)
    grid([r0, r1, r2, r3], true, () => s.col, () => true)
  }

  // ---- near the top the columns cross in a diagrid (detail): diagonals between neighbours
  if (d) {
    const bands = [[318, 340], [340, 358], [358, 372], [372, 383]]
    for (const [z0, z1] of bands) for (let i = 0; i < N; i += 2) {
      const a0 = (i / N) * Math.PI * 2, a1 = ((i + 2) / N) * Math.PI * 2
      const pA = P(a0, rad(z0) + 0.5, z0), pB = P(a1, rad(z1) + 0.5, z1), pC = P(a1, rad(z0) + 0.5, z0), pD = P(a0, rad(z1) + 0.5, z1)
      const am = (a0 + a1) / 2, up: V3 = [Math.cos(am), Math.sin(am), 0]
      bar(s.col, pA, pB, 0.55, 0.6, up)
      bar(s.col, pC, pD, 0.55, 0.6, up)
    }
  }
}

// ---- Materials and output ----------------------------------------------------------------------------------

const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x7088a0 }
const LOBBY: MaterialSpec = windowVariant(2, 0x62788b)
const COL: MaterialSpec = { ...finish('cr-silver', 0xcfd3dc, 0.5), floodlight: (p) => (p[2] < 2 ? 0.4 : 0.85) }
const layers = (s: Set): Layer[] => [
  { part: s.glass, material: GLASS },
  { part: s.lobby, material: LOBBY },
  { part: s.col, material: COL },
]

if (import.meta.main) {
  const low = mk(), det = mk()
  build(low, false)
  build(det, true)
  await saveLods('shenzhen-china-resources-tower', 'China Resources Tower', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM outline centroid, on the ground',
    bearing: 0, height: H,
  }, 5000)
}
