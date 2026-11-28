/**
 * Guangxi China Resources Tower (广西华润大厦, Nanning China Resources Center T1),
 * China-ASEAN Business District, Qingxiu, Nanning — original procedural
 * geometry, CC0-1.0.
 * bun generators/nanning-guangxi-china-resources-tower.ts   (writes the low model and the detail LOD)
 *
 * Frame: bearing 0 (OSM's parts are axis-aligned). Origin = area centroid of
 * the OSM outline way/974187258 (108.3912468 E, 22.8148602 N), on the ground.
 * Elevation 0.
 *
 * Form, as read from OSM and the photos (completed 2020):
 * - two interlocking glass slabs: a wider south slab (56 x 36 m) to a flat
 *   roof at ~338 m, and a narrower north slab (48 x 36 m), offset 11 m to the
 *   north, easing in slightly above 250 m and rising to a sharp glass wedge:
 *   a skillion that falls 14 m to the south, peaking at 402.7 m;
 * - two tones of saturated blue glass, the lower (south) slab deeper than the
 *   upper, so the interlock reads; softened corners; the faint vertical
 *   texture of the mullions as shallow fins in each slab's own glass (no
 *   contrast of their own; horizontal lines are left out).
 *
 * Evidence
 * - OSM, fetched 2026-11-27 with tools/osm.py: outline way/974187258
 *   (南宁华润大厦A座, 85 levels, fixme:height 402.7) and its parts
 *   way/974187259 (346 m) and way/974187260 (402.7 m, roof:shape skillion,
 *   roof:direction 180, roof:height 10). The OSM way carries no Wikidata id;
 *   Q18347369 ("Nanning China Resources Tower", 广西华润大厦, 402.7 m) was checked
 *   by its coordinates (22.81483 N, 108.39114 E), which fall on this outline.
 * - Published: 402.7 m, 85 floors, completed 2020 (Wikipedia "Guangxi China
 *   Resources Tower"; CTBUH Skyscraper Center).
 * - Photos (Wikimedia Commons, all by EditQ, 2022-10):
 *   "Guangxi China Resource Tower A 2022.jpg", CC BY 4.0, from the south-east
 *   at street level: the two slabs, the skillion top, the horizontal lines;
 *   https://commons.wikimedia.org/wiki/File:Guangxi_China_Resource_Tower_A_2022.jpg
 *   "Dongmeng CBD 3.jpg", CC BY-SA 4.0, from the foot: the corners, the colour;
 *   https://commons.wikimedia.org/wiki/File:Dongmeng_CBD_3.jpg
 *   "Skyline of China-ASEAN Business Center in Qingxiu District.jpg",
 *   CC BY-SA 4.0, from Qingxiu Mountain (south-east): the silhouette, the
 *   step at 346 m, the deep blue glass at a distance;
 *   https://commons.wikimedia.org/wiki/File:Skyline_of_China-ASEAN_Business_Center_in_Qingxiu_District.jpg
 *   "Dongmeng CBD, Nanning.jpg", CC BY-SA 4.0: skyline check;
 *   https://commons.wikimedia.org/wiki/File:Dongmeng_CBD,_Nanning.jpg
 * - No lidar, NAIP or Mapillary. Look-only references: none.
 *
 * Numbers
 * - Published: 402.7 m.
 * - Measured (OSM): both slabs' plans, the skillion falling south.
 * - Measured (photo, "Guangxi China Resource Tower A 2022.jpg", the top
 *   crop): the skillion's fall, ~13 m over the slab's 36 m depth (OSM tags
 *   roof:height 10; drawn at 14 m so the wedge reads at phone size); the
 *   step between the slabs at ~335 m (OSM 346 m; drawn at 338 m).
 * - Estimated: the north slab's taper (1.8 m in on each face from 250 m to
 *   the top; the street photo's leaning edge is partly perspective), fin
 *   spacing (4.5 m detail, 9 m low; 0.25 m proud), corner softening (1.4 m),
 *   colours sampled from the photos (#497cb0 lit, #274170-#2e4b7c at a
 *   distance): upper slab #4f7bad, lower slab #3d6290.
 *
 * Doubts
 * - The west and north faces have no close photo; drawn like the others.
 * - The taper and the skillion's extra 4 m over OSM are judgement for
 *   readability; the step height disagrees with OSM's 346 m.
 * - The base (lobby, entrances) is not visible in any licensed photo and is
 *   drawn plain.
 *
 * Night: both glasses glow as windows (`window` upper slab, `window-2` lower slab).
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, windowVariant } from './palette'
import { saveLods, face, type Layer, type XY } from './auckland-sky-tower'
import { grid, flat } from './shenzhen-ping-an-finance-centre'
import { roundedPoly, walls, offsetPoly, smoothAt } from './nanjing-zifeng-tower'

const H_S = 338, H_N = 402.7, SKILL = 14
const SOUTH: XY[] = [[-38.05, -24.95], [17.8, -24.95], [17.8, 11.3], [-38.05, 11.3]]
const NORTH: XY[] = [[-34.05, -14.25], [13.7, -14.25], [13.7, 21.55], [-34.05, 21.55]]
const YS = NORTH[0][1], YN = NORTH[2][1]
/** The north slab's taper: plan inset (m) at height z, from 250 m to the top. */
const TAPER0 = 250, TAPER = 1.8
const insetN = (z: number) => -TAPER * Math.max(0, Math.min(1, (z - TAPER0) / (H_N - TAPER0)))

type Set = { south: Part; north: Part; roof: Part }
const mk = (): Set => ({ south: new Part(), north: new Part(), roof: new Part() })

/**
 * Shallow mullion fins in the slab's own glass (0.25 m proud), so the faint vertical
 * texture shows only as shading, not as pale lines. `inset(z)` follows a taper.
 */
function fins(p: Part, poly: XY[], z1: (x: number, y: number) => number, step: number, inset: (z: number) => number = () => 0) {
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 10) continue
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
    const m = Math.round(L / step)
    for (let k = 1; k < m; k++) {
      const u = (k * L) / m, q: XY = [a[0] + t[0] * u, a[1] + t[1] * u]
      const zt = z1(q[0], q[1]) - 0.5
      // a point on the fin: `o` out from the face, `sd` along it, moved in by the taper
      const at = (z: number, o: number, sd: number): V3 => {
        const off = inset(z)
        return [q[0] + n[0] * (o + off) + t[0] * sd, q[1] + n[1] * (o + off) + t[1] * sd, z]
      }
      const zs = inset(zt) !== 0 ? [0, TAPER0, zt] : [0, zt]
      const ring = (z: number) => [at(z, -0.1, -0.3), at(z, 0.25, -0.3), at(z, 0.25, 0.3), at(z, -0.1, 0.3)]
      grid(zs.map(ring), true, () => p)
      face(p, ring(zt), [0, 0, 1])
    }
  }
}

function build(s: Set, d: boolean) {
  const nF = d ? 3 : 2
  const south = roundedPoly(SOUTH, [0, 0, 0, 0], [1.4, 1.4, 1.4, 1.4], 1, nF)
  const north = roundedPoly(NORTH, [0, 0, 0, 0], [1.4, 1.4, 1.4, 1.4], 1, nF)
  const step = d ? 4.5 : 9

  // the south slab: the darker glass, flat roof
  walls(south, [[0, 0], [H_S, 0]], () => s.south, 30)
  flat(s.roof, south, H_S)
  fins(s.south, south, () => H_S, step)

  // the north slab: the lighter glass, a slight taper above 250 m, up to the skillion
  const z1 = H_N - SKILL
  const lv: [number, number][] = [[0, 0], [TAPER0, 0], [(TAPER0 + z1) / 2, insetN((TAPER0 + z1) / 2)], [z1, insetN(z1)]]
  walls(north, lv, () => s.north, 30)
  const topPoly = offsetPoly(north, insetN(z1))
  const roofN = (y: number) => H_N - (SKILL * (YN + insetN(z1) - y)) / (YN - YS + 2 * insetN(z1))
  const top: V3[] = topPoly.map(([x, y]) => [x, y, roofN(y)])
  grid([topPoly.map(([x, y]) => [x, y, z1] as V3), top], true, () => s.north, smoothAt(north, 30))
  // the glass runs 1 m past the sloped roof as a parapet, then the roof
  const inner = offsetPoly(topPoly, -0.6)
  grid([top, top.map((p) => [p[0], p[1], p[2] + 1] as V3), inner.map(([x, y]) => [x, y, roofN(y) + 1] as V3), inner.map(([x, y]) => [x, y, roofN(y)] as V3)], true, () => s.north, smoothAt(north, 30))
  // the sloped top is a glass screen in the photos: drawn in the slab's glass so the wedge reads as one form
  face(s.north, inner.map(([x, y]) => [x, y, roofN(y)] as V3), [0, -SKILL / (YN - YS), 1])
  fins(s.north, north, (_x, y) => roofN(y) - 1, step, insetN)
}

// ---- Materials and output ----------------------------------------------------------------------------------

// two tones, from the photos: the lower (south) slab deeper, the upper (north) slab a lighter saturated blue
const NORTH_GLASS: MaterialSpec = { ...PALETTE.window, color: 0x4f7bad }
const SOUTH_GLASS: MaterialSpec = windowVariant(2, 0x3d6290)
const layers = (s: Set): Layer[] => [
  { part: s.north, material: NORTH_GLASS },
  { part: s.south, material: SOUTH_GLASS },
  { part: s.roof, material: PALETTE.roof },
]

if (import.meta.main) {
  const low = mk(), det = mk()
  build(low, false)
  build(det, true)
  await saveLods('nanning-guangxi-china-resources-tower', 'Guangxi China Resources Tower', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM outline centroid, on the ground',
    bearing: 0, height: H_N + 1,
  }, 5000)
}
