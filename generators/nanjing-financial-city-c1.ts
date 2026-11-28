/**
 * Nanjing Financial City Phase II, Plot C, Tower 1 (南京金融城二期C1), Hexi,
 * Jianye, Nanjing — original procedural geometry, CC0-1.0.
 * bun generators/nanjing-financial-city-c1.ts   (writes the low model and the detail LOD)
 *
 * Frame: bearing 0. Origin = the mean of the corners of the tower's two OSM
 * parts (118.7090336 E, 31.9858063 N), on the ground. Elevation 0.
 *
 * Form, as read from OSM and the one licensed photo of the finished tower:
 * - a square plan ~49 m a side, turned ~40 deg, split into three interlocking
 *   glass slabs: the north-west half to 350 m, the south quadrant to the top
 *   at 416.6 m, the east quadrant to 300 m;
 * - dark recessed slots between the slabs, running their full height;
 * - blue glass with fine vertical mullion lines, drawn as shallow fins
 *   close to the glass colour, and faint dark bands at the refuge floors.
 *
 * Evidence
 * - OSM, fetched 2026-11-27 with tools/osm.py (found through Overpass by its
 *   height): way/1396179801 (the whole tower, office, 300 m),
 *   way/1396179802 (north-west half, 350 m), way/1417999719 (south quadrant,
 *   416.6 m). No name or Wikidata id on them; the identity rests on the
 *   416.6 m height, the site (金融城二期A1/A2/A8 are named next to it) and the
 *   photo's description ("Nanjing Financial City Phase II Plot C Tower 1 ...
 *   416.6 metres"). The 35 m podium way/1396179803 is a separate building,
 *   left to the map.
 * - Published: 416.6 m (the photo's description; CTBUH Skyscraper Center).
 * - Photos (Wikimedia Commons):
 *   "南京金融城二期C1 (20250325).jpg", Fumikas Sagisavas, CC0, from the
 *   north-east, finished: the three slabs and their tops, the slots, colours;
 *   https://commons.wikimedia.org/wiki/File:%E5%8D%97%E4%BA%AC%E9%87%91%E8%9E%8D%E5%9F%8E%E4%BA%8C%E6%9C%9FC1_(20250325).jpg
 * - No other licensed photo of the finished tower found (Commons, Openverse;
 *   Mapillary had no token). No lidar, NAIP. Look-only references: none.
 *
 * Numbers
 * - Published: 416.6 m.
 * - Measured (OSM): the plan and its split, 350 m and 300 m.
 *   (The photo reads the slab tops at roughly 290 and 380 m; OSM kept.)
 * - Estimated: slot width (1.8 m) and depth, fin spacing (3 m detail, 6 m
 *   low), band heights, colours sampled from the photo (#556988-#5c6f91),
 *   pulled to the palette.
 *
 * Doubts
 * - One photo, from one side: the south and west faces are drawn like it.
 * - The slab heights: OSM's 350 and 300 m against the photo's ~380 and ~290 m.
 * - The base and entrances are not seen.
 *
 * Night: the glass glows as windows (`window`; the slots and bands `window-2`).
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { saveLods, prism, bar, type Layer, type XY } from './auckland-sky-tower'
import { grid, flat } from './shenzhen-ping-an-finance-centre'
import { offsetPoly, walls, ccwXY } from './nanjing-zifeng-tower'

const N: XY = [1.2, 40.3], E: XY = [40.3, 7.3], S: XY = [5.8, -33.0], W: XY = [-34.2, 0.3]
const NE_M: XY = [20.4, 24.0], SE_M: XY = [24.7, -10.9], SW_M: XY = [-13.9, -16.3], C: XY = [5.0, 5.9]
const SLABS: [XY[], number][] = [
  [[N, NE_M, C, SW_M, W], 350], // way/1396179802
  [[C, SE_M, S, SW_M], 416.6], // way/1417999719
  [[NE_M, E, SE_M, C], 300], // the rest of way/1396179801
]
const H = 416.6
const BANDS = [62, 124, 186, 248]

type Set = { glass: Part; dark: Part; fin: Part; roof: Part }
const mk = (): Set => ({ glass: new Part(), dark: new Part(), fin: new Part(), roof: new Part() })

function build(s: Set, d: boolean) {
  const GAPH = 0.9
  for (const [poly0, h] of SLABS) {
    const poly = offsetPoly(ccwXY(poly0), -GAPH)
    // rows: glass with dark band rows at the refuge floors
    const lv: [number, number][] = [[0, 0]], dark: boolean[] = []
    for (const b of BANDS) if (b < h - 10) { lv.push([b, 0], [b, -0.35], [b + 4.2, -0.35], [b + 4.2, 0]); dark.push(false, true, true, true) }
    lv.push([h, 0]); dark.push(false)
    walls(poly, lv, (_i, k) => (dark[k] ? s.dark : s.glass), 10)
    // a glass parapet: the walls rise 2 m past the roof, which sits inside
    const inner = offsetPoly(poly, -0.5)
    grid([poly.map(([x, y]) => [x, y, h] as V3), poly.map(([x, y]) => [x, y, h + 2] as V3), inner.map(([x, y]) => [x, y, h + 2] as V3), inner.map(([x, y]) => [x, y, h] as V3)], true, () => s.glass)
    flat(s.roof, inner, h)
    // the mullion fins: shallow, close to the glass colour, on the outer faces only
    const step = d ? 3 : 6
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 8) continue
      const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
      // skip the faces on the slots (they run through the centre)
      const mid: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      if (Math.hypot(mid[0] - C[0], mid[1] - C[1]) < 22 && Math.abs((mid[0] - C[0]) * n[0] + (mid[1] - C[1]) * n[1]) < 3) continue
      const m = Math.floor(L / step)
      for (let k = 1; k < m; k++) {
        const u = (k * L) / m, p: XY = [a[0] + t[0] * u + n[0] * 0.2, a[1] + t[1] * u + n[1] * 0.2]
        bar(s.fin, [p[0], p[1], 0], [p[0], p[1], h + 2], d ? 0.35 : 0.5, 0.4, [n[0], n[1], 0])
      }
    }
  }
  // ---- the slots: dark walls set 1.5 m back in the gaps between the slabs
  const slot = (a: XY, b: XY, h: number) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [-t[1], t[0]]
    const a1: XY = [a[0] + t[0] * 1.5, a[1] + t[1] * 1.5], b1: XY = [b[0] - t[0] * 1.5, b[1] - t[1] * 1.5]
    prism(s.dark, [[a1[0] - n[0] * GAPH, a1[1] - n[1] * GAPH], [b1[0] - n[0] * GAPH, b1[1] - n[1] * GAPH], [b1[0] + n[0] * GAPH, b1[1] + n[1] * GAPH], [a1[0] + n[0] * GAPH, a1[1] + n[1] * GAPH]], 0, h, { top: true })
  }
  slot(NE_M, C, 300)
  slot(C, SW_M, 350)
  slot(C, SE_M, 300)
}

// ---- Materials and output ----------------------------------------------------------------------------------

const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x5f7596 }
const DARK: MaterialSpec = windowVariant(2, 0x4d6182)
const FIN: MaterialSpec = finish('nfc-mullion', 0x7d8fab, 0.5)
const layers = (s: Set): Layer[] => [
  { part: s.glass, material: GLASS },
  { part: s.dark, material: DARK },
  { part: s.fin, material: FIN },
  { part: s.roof, material: PALETTE.roof },
]

if (import.meta.main) {
  const low = mk(), det = mk()
  build(low, false)
  build(det, true)
  await saveLods('nanjing-financial-city-c1', 'Nanjing Financial City C1', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the mean of the OSM parts\' corners, on the ground',
    bearing: 0, height: H + 2,
  }, 5000)
}
