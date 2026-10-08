/**
 * San Francisco–Oakland Bay Bridge, eastern span: the self-anchored
 * suspension span's tower (2013; T.Y. Lin International and Moffatt &
 * Nichol) — procedural, CC0-1.0.
 * bun generators/sf-bay-bridge-sas.ts
 *
 * Map frame: x and y along the tower's square plan, which is turned with
 * the bridge (placed at bearing 55°), z up, metres; origin at the tower's
 * centre on the water. Only the tower: the two decks that pass either side
 * of it and the single main cable looping over its top are the map's.
 *
 * What makes it the SAS tower: one white tower, not two legs and a portal;
 * four pentagonal steel shafts (squares with their outer corner cut off)
 * standing in a 2 x 2 cluster with a narrow cross-shaped slot between them;
 * the shafts tapering upward from a flared foot; shear-link beams across
 * the slots, close-set as a ladder of rungs near the top and sparse below.
 *
 * Sources:
 * - OSM: way/237735191 (building=tower, bridge:support=pylon, height 160).
 * - Lidar (USGS 3DEP, CA_SanFrancisco_1_B23, 2023, 0.5 m grid; water 0.25
 *   m NAVD88 = y 0): the shafts' tops at 161.5–163.5 m, a square 11.5 m
 *   across turned to 55° (the bridge's axis there, from the deck and the
 *   gaps between the two decks), the slot visible as a dip on the axis;
 *   decks at 55.5 m. The top's centre lies 0.7 m west of the OSM outline's
 *   centroid, so the anchor is moved by that.
 * - Published: 525 ft (160 m) above the water; four separate shafts joined
 *   by shear link beams; white (Caltrans; Wikipedia "Eastern span
 *   replacement of the San Francisco–Oakland Bay Bridge").
 * - Photos (Wikimedia Commons): "Tower - panoramio (49)" (Stephen Edmonds,
 *   CC BY-SA 3.0; broadside, the taper, the slot's ladder and the flared
 *   foot); "Tower of the east span of the San Francisco–Oakland Bay Bridge,
 *   California, US" (Clyde Charles Brown, CC BY-SA 4.0; the shafts' facets,
 *   the slot and its links from the deck); "New Bay Bridge SFO 04 2015
 *   2261" (Mariordo, CC BY-SA 4.0); "2013, Finishing New East Span Bay
 *   Bridge Construction - panoramio" (Chris English, CC BY-SA 3.0);
 *   "SFOakBayBridgeNewEastTowe" (Leonard G., CC0; the four shafts during
 *   erection).
 * - Measured from the broadside photo, scaled by the lidar: 16.5 m across
 *   at the deck, 11.5 m at the top, about 23 m at the flared foot; the slot
 *   2.4 m wide; the close-set links over the top 40 m.
 * - Estimated: the corner cut (0.42 of a shaft's width), the foot's flare
 *   (4–20 m), the pile cap (28 m square, 4 m), the links' spacing below,
 *   the slight fall of the shafts' tops toward their outer corners.
 * - Colour: white paint pulled to the palette's lightness; the slot's
 *   depths dark grey.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { box, countParts, loftSolid, one, prism } from './sf-golden-gate-bridge'

const white = new Part(), dark = new Part(), pier = new Part()
const S = one(white), D = one(dark)

const G = 2.4 / 2                       // half the slot
const TOP_IN = 163.3, TOP_OUT = 161.5    // shaft tops, at the slot and the outer corner
/** Half the tower's width at height z: a straight taper, flaring at the foot. */
const half = (z: number) => {
  const w = 5.75 + (162 - z) * 0.0245
  return z >= 20 ? w : w + (11.5 - (5.75 + (162 - 4) * 0.0245)) * ((20 - z) / 16) ** 1.6
}

// Pile cap.
const c = 14, k = 2.5
prism(one(pier), [[-c + k, -c], [c - k, -c], [c, -c + k], [c, c - k], [c - k, c], [-c + k, c], [-c, c - k], [-c, -c + k]], 0, 4, false)

// Shafts: one pentagon per quadrant, lofted through the taper.
const levels = [4, 7, 10, 13.5, 17, 20, 60, 110, 160]
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const ring = (z: number, top = false): V3[] => {
    const W = top ? half(160) : half(z), cut = 0.42 * (W - G)
    const pts: [number, number][] = [[G, G], [W, G], [W, W - cut], [W - cut, W], [G, W]]
    const zz = (x: number, y: number) => {
      if (!top) return z
      const f = (x + y - 2 * G) / (2 * W - cut - 2 * G)   // 0 at the slot corner, 1 at the cut
      return TOP_IN + (TOP_OUT - TOP_IN) * Math.min(1, f)
    }
    const out = pts.map(([x, y]) => [sx * x, sy * y, zz(x, y)] as V3)
    return sx * sy > 0 ? out : out.reverse()
  }
  loftSolid(S, [...levels.map((z) => ring(z)), ring(160, true)], [false, true])
}

// The slot's depths: a dark cross set 1 m in from the faces.
const coreRing = (z: number, along: 'x' | 'y'): V3[] => {
  const w = half(z) - 1.0
  return along === 'x' ? [[-w, -G, z], [w, -G, z], [w, G, z], [-w, G, z]] : [[-G, -w, z], [G, -w, z], [G, w, z], [-G, w, z]]
}
for (const a of ['x', 'y'] as const) loftSolid(D, [4, 20, 160.5].map((z) => coreRing(z, a)), [false, true])

// Shear links across the slot, flush with the faces: a close ladder over
// the top 40 m, sparse below.
const links = [...Array.from({ length: 9 }, (_, i) => 121 + i * 4.4), ...[30, 44, 58, 72, 86, 100, 112]]
for (const z of links) {
  const w = half(z + 0.6)
  for (const s of [-1, 1]) {
    box(S, s > 0 ? w - 1.3 : -w, s > 0 ? w : -w + 1.3, -G - 0.1, G + 0.1, z, z + 1.3, { r: 0 })
    box(S, -G - 0.1, G + 0.1, s > 0 ? w - 1.3 : -w, s > 0 ? w : -w + 1.3, z, z + 1.3, { r: 0 })
  }
}

const parts = [
  { part: white, material: finish('sas-white', 0xe8e9e6) },
  { part: dark, material: finish('sas-slot', 0x8e969d) },
  { part: pier, material: finish('concrete', 0xd9d3c7) },
]
const triangles = countParts(parts)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Bay Bridge self-anchored suspension span tower', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at the tower centre on the water', height: TOP_IN, bearing: 55,
})
await Bun.write(new URL('../models/sf-bay-bridge-sas.glb', import.meta.url), glb)
console.log(`sf-bay-bridge-sas.glb: ${triangles} triangles, ${glb.length} bytes`)
