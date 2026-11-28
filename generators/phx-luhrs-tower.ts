/**
 * Luhrs Tower, Phoenix (1929, Trost & Trost; Art Deco) — original
 * procedural geometry, CC0-1.0.
 * bun generators/phx-luhrs-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * anchor. Bearing 0: OSM's walls run within a degree of north–south.
 * Anchor -112.0747708, 33.4468407, the centroid of OSM way/37057924
 * ("Luhrs Tower", 14 levels, 1929), which covers the whole lot on 1st
 * Avenue: the tower on its north part and its two-storey base, which
 * fills the lot. The 1924 Luhrs Building (way/1570187489) stands 24 m
 * east, past way/1570187488, and is not part of this model.
 *
 * Identity (from the photos below):
 *  1. A slim pale setback tower: a broad shaft stepping in twice to a
 *     narrow top block, the steps uneven (the shoulders higher on the
 *     north than on the south), every step finished by pier tops rising
 *     past the parapet.                                    (l1, both)
 *  2. Strong vertical piers the whole height, windows recessed between
 *     them, teal-green terracotta ornament at the tops of the piers and
 *     round the base's shopfronts.                          (l1, wars)
 *  3. A red tile hip roof on the top block.                     (l1)
 *  4. A two-storey base filling the lot, with the arched entrance.  (l1)
 *
 * Plan and heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (2020
 * flight), 0.5 m grid, read in this frame and moved 1 m west to OSM's
 * walls; the street 331.0 m is y = 0. Measured (model metres): the base
 * 9.6 over x -16.15..15, 6.5 over x 15..24 (all of OSM's outline); the
 * shaft x -16..8, y 2.5..18.5, to 31.5; the second stage to 42, x -14..6
 * on its north half and x -12..4 on its south half; the top block x
 * -8..0, y 4.5..17, to 54.5 with its tile roof to 56.5 and a step to 51
 * on its south side. Published: 14 storeys, 1929 (Wikipedia; National
 * Register). Estimated from l1 scaled to those: the pier rhythm (about
 * 3.7 m), the floor lines (3.3 m over the base), the pier tops 1.2 m over
 * each parapet, the ornament bands.
 *
 * Photos (evidence, Wikimedia Commons):
 *  l1    "Luhrs Tower-1.jpg", Visitor7, CC BY-SA 3.0, from the north-west on
 *        1st Avenue: both setback faces, the crown, the base
 *        https://commons.wikimedia.org/wiki/File:Luhrs_Tower-1.jpg
 *  both  "Luhrs Building and Luhrs Tower.jpg", Visitor7, CC BY-SA 3.0, from
 *        the south-east on Jefferson: the tower's south side behind the base
 *        https://commons.wikimedia.org/wiki/File:Luhrs_Building_and_Luhrs_Tower.jpg
 *  wars  "Art Deco Luhrs Tower Phoenix AZ USA 230582.JPG", Wars, CC BY 2.5:
 *        the entrance, the piers and the teal ornament
 *        https://commons.wikimedia.org/wiki/File:Art_Deco_Luhrs_Tower_Phoenix_AZ_USA_230582.JPG
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the east face is seen in no photo; it is drawn like the west.
 * The base's east part (6.5 m) is seen only from far off in "both". The
 * carved ornament, the "LUHRS TOWER" lettering over the door and the
 * flagpole are left out.
 *
 * Night: windows glow; the base's shopfronts are `entrance`; the tower's
 * piers are lightly floodlit, brightest at the crown.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, ccw, cornice, hipRoof, onWall, prism, rectShape, save, type XY } from './atl-tech-tower'
import { curtain, exposed, type Block } from './phx-chase-tower'

const stucco = new Part(), win = new Part(), teal = new Part(), tile = new Part(), shop = new Part()
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])

const BASEW: Block = { ring: ccw([[-16.15, 19.38], [-15.64, -22.61], [15, -22.4], [15, 19.4]]), z0: 0, z1: 9.6 }
const BASEE: Block = { ring: ccw([[15, 19.4], [15, -22.4], [24.15, -22.21], [24.14, 19.44]]), z0: 0, z1: 6.5 }
const SHAFT: Block = { ring: rect(-16, 8, 2.5, 18.5), z0: 0, z1: 31.5 }
const S2N: Block = { ring: rect(-14, 6, 10.5, 18.5), z0: 0, z1: 42 }
const S2S: Block = { ring: rect(-12, 4, 2.5, 10.5), z0: 0, z1: 42 }
const STEP: Block = { ring: rect(-8, 0, 2.5, 4.5), z0: 0, z1: 51 }
const TOP: Block = { ring: rect(-8, 0, 4.5, 17), z0: 0, z1: 54.5 }
const ALL = [BASEW, BASEE, SHAFT, S2N, S2S, STEP, TOP]
const TIERS = [SHAFT, S2N, S2S, STEP, TOP]

// ── Massing ──
for (const b of [BASEW, BASEE]) {
  prism(stucco, b.ring, 0, b.z1, stucco, 0.3)
  cornice(stucco, b.ring, b.z1 - 0.9, 0.6, 0.3, null)
}
for (const b of TIERS) prism(stucco, b.ring, 0, b.z1, stucco, 0.3)
hipRoof(tile, -8.3, 0.3, 4.2, 17.3, 54.5, 56.5, 0.3)

// ── Piers, windows and ornament on every exposed face of the tower ──
const FL = 3.3, Z0 = 9.6
for (const b of TIERS) {
  for (const [a, c, zf] of exposed(b, ALL)) {
    const L = Math.hypot(c[0] - a[0], c[1] - a[1])
    if (L < 1.5) continue
    const t: XY = [(c[0] - a[0]) / L, (c[1] - a[1]) / L], n: XY = [t[1], -t[0]]
    const P = (s: number, d: number): XY => [a[0] + t[0] * s + n[0] * d, a[1] + t[1] * s + n[1] * d]
    const bays = Math.max(1, Math.round(L / 3.7)), w = L / bays
    const zTop = b.z1
    // the piers: the corner ones broad, all standing past the parapet
    for (let k = 0; k <= bays; k++) {
      const s = k * w, half = k === 0 || k === bays ? 0.75 : 0.4
      const s0 = Math.max(0, s - half), s1 = Math.min(L, s + half)
      const q = ccw([P(s0, -0.05), P(s1, -0.05), P(s1, 0.4), P(s0, 0.4)])
      prism(stucco, q, zf, zTop + (k === 0 || k === bays ? 1.4 : 0.9), stucco, 0.15)
      // the teal cap ornament on the pier top
      onWall(teal, P(s0, 0.4), P(s1, 0.4), rectShape(0, s1 - s0, zTop - 2.4, zTop - 0.3), 0.03)
    }
    // the windows between the piers: two storeys a panel, aligned across
    // the faces from the base's top
    const lo = Math.max(zf, Z0), hi = zTop - 2.8
    for (let k = 0; k < bays; k++) {
      const s0 = k * w + (k === 0 ? 0.75 : 0.4) + 0.55, s1 = (k + 1) * w - (k === bays - 1 ? 0.75 : 0.4) - 0.55
      if (s1 - s0 < 0.6) continue
      for (let g = Math.floor((lo - Z0) / (2 * FL)); Z0 + g * 2 * FL < hi; g++) {
        const za = Math.max(lo + 0.5, Z0 + g * 2 * FL + 0.9), zb = Math.min(hi, Z0 + (g + 1) * 2 * FL - 0.9)
        if (zb - za > 1) onWall(win, a, c, rectShape(s0, s1, za, zb), 0.03)
      }
    }
  }
}

// ── The base: shopfronts in teal frames on the street fronts, the arched
// entrance on 1st Avenue under the tower ──
for (const b of [BASEW, BASEE]) {
  for (const [a, c, zf] of exposed(b, ALL)) {
    if (zf > 0.5) continue
    const L = Math.hypot(c[0] - a[0], c[1] - a[1]), bays = Math.max(1, Math.round(L / 4.2)), w = L / bays
    for (let k = 0; k < bays; k++) {
      const s0 = k * w + 0.6, s1 = (k + 1) * w - 0.6
      onWall(teal, a, c, rectShape(s0 - 0.25, s1 + 0.25, 0.6, b.z1 - 1.6), 0.03)
      onWall(shop, a, c, rectShape(s0, s1, 0.6, 3.6), 0.06)
      onWall(win, a, c, rectShape(s0, s1, 4.4, b.z1 - 2.0), 0.06)
    }
  }
}
// the entrance: a round arch on the west front, under the tower
onWall(stucco, [-16.15, 19.38], [-15.64, -22.61], rectShape(4.6, 11.4, 0, 9.0), 0.15)
onWall(shop, [-16.15, 19.38], [-15.64, -22.61], archShape(8.0, 3.6, 0, 4.4, 10), 0.2)

const lit = (p: V3, n: V3) => (n[2] > 0.5 ? 0 : p[2] > 40 ? 0.8 : p[2] > 10 ? 0.35 : 0)
await save('phx-luhrs-tower', 'Luhrs Tower', [
  { part: stucco, material: { ...finish('luhrs-stucco', 0xeadfd5), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: teal, material: finish('luhrs-terracotta-teal', 0x5f9a8f) },
  { part: tile, material: PALETTE.terracotta },
  { part: shop, material: { ...PALETTE.entrance, color: 0x5d625c } },
], { height: 56.5, anchor: [33.4468407, -112.0747708], bearing: 0 })
