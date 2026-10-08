/**
 * RMS Queen Mary, Long Beach (1936 Cunard-White Star liner; moored here as
 * a hotel and museum since 1967) — procedural, CC0-1.0.
 * bun generators/la-queen-mary.ts
 *
 * Map frame: x to starboard, y toward the bow, z up, metres; placed at
 * bearing 293.7°, the bow pointing west-north-west as the OSM outline's
 * sharp end and the NAIP orthophoto show (so the starboard side faces the
 * Long Beach shore across the water, as in most photos). Origin at the
 * centroid of OSM way/438331516. y = 0 is the waterline: USGS 3DEP gives
 * the harbour's surface, 0.3 m, everywhere under the hull, so elevation 0
 * puts the waterline on it. Nothing below the waterline is modelled.
 *
 * What makes it the Queen Mary: the long black hull with its sheer rising
 * to a raked bow and a rounded cruiser stern, a white strake above the
 * black; the long white superstructure in stepped tiers with the bridge
 * and its full-width wings forward, the rows of white lifeboats along the
 * boat deck, the stepped terraces aft; the three Cunard red funnels with
 * black tops, the forward two the tallest; the two tall masts, fore and
 * aft of the superstructure; and the thin red boot-topping at the water.
 *
 * Sources:
 * - Plan: OSM way/438331516 (the deck outline: 309.8 m long along 113.7°,
 *   36.3 m in beam; its half-breadths, averaged port and starboard, shape
 *   the hull), and the three funnel parts way/439768915, /16, /17 (centres
 *   66.9 m and 22.7 m forward of the centroid and 22.6 m aft). USGS NAIP
 *   orthophoto: outline, bow direction, deck layout.
 * - Heights (LA County 2020 lidar surface model, 2 m grid over the ship,
 *   minus the water at 0.3 m): funnel tops 44, 44 and 42 m; foremast 47 m,
 *   111 m forward of the centroid; bridge 31–35 m with wings across the
 *   full beam at 30 m; forward superstructure 25–33 m, middle 26–29 m, aft
 *   28–30 m; boat deck at the sides 22–25 m; aft terraces 22, 19.5–20 and
 *   17 m; stern deck 14.5 m; forecastle 19–22 m. (The surface model smears
 *   the hull's edges into the water, so the outline comes from OSM.)
 * - Published: 310.7 m long, 36.1 m beam, 11.9 m draught, 55.2 m keel to
 *   funnel top (43.3 m above the waterline, matching the lidar) (Wikipedia
 *   "RMS Queen Mary").
 * - Photos (Wikimedia Commons, daylight, the starboard side from the shore
 *   to the north unless noted): "RMS Queen Mary Long Beach January 2011
 *   view" and "RMS Queen Mary Long Beach January 2011" (David Jones, CC BY
 *   2.0); "RMS Queen Mary" (Thcipriani, CC BY-SA 4.0; bow from the dock
 *   side); "RMS Queen Mary in Long Beach" (Andrek02, CC0); "RMS Queen Mary
 *   at Long Beach Harbor" (David Lofink, CC BY 2.0); "Long Beach - Queen
 *   Mary (1)–(3)" (Mquach, CC BY-SA 3.0); "RMS Queen Mary (50132478716)"
 *   (Mike McBey, CC BY 2.0); "Queen Mary Long Beach 2" (Christophe Finot,
 *   CC BY-SA 2.5; the forecastle and foremast); "R.M.S. Queen Mary in Long
 *   Beach, California; October 2019" (Bernard Spragg, CC0); "RMS Queen
 *   Mary. (6715670493)" (Andrew Thomas, CC BY-SA 2.0; the bow, port side).
 * - Estimated from photos, scaled by the lidar: black hull to 12.4 m
 *   amidships rising to 16 m at the bow, white strake to 17.1 m rising to
 *   21 m; the bow's rake (waterline 6.5 m short of the stem head) and the
 *   stern's overhang; funnel sections (oval, 8.8 x 7.2 m) and black tops
 *   (5.8 m); the lifeboats (11 a side, 9 m); mainmast height (44 m, too thin
 *   for the lidar), 109 m aft; window rows.
 * - Left out: ventilator cowls, davits, rigging, deck clutter, the
 *   breakwater, the dockside gangways and hotel buildings.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, ccw, capRing, countDrawn, earcut, rect, beam, wallPanel, type XY, TAU } from './la-pacific-wheel'

const hull = new Part(), white = new Part(), deck = new Part(), win = new Part(), red = new Part()

// --- Hull plan: half-breadth along y (bow +), from the OSM outline ------------
const BREADTH: [number, number][] = [
  [-146.3, 0.8], [-143, 5.72], [-139, 8.3], [-134, 10.08], [-128, 11.39], [-120, 13.0], [-112, 14.42], [-100, 15.45],
  [-85, 16.7], [-60, 17.73], [-30, 18.13], [0, 18.27], [30, 18.14], [60, 17.31], [90, 14.82], [110, 11.98],
  [125, 10.05], [135, 8.87], [143, 7.52], [150, 5.67], [156, 4.09], [160, 2.7], [163.5, 0.0],
]
const STERN = -146.3, BOW = 163.5
function breadth(y: number) {
  if (y <= BREADTH[0][0]) return BREADTH[0][1]
  for (let i = 0; i < BREADTH.length - 1; i++) {
    const [y0, b0] = BREADTH[i], [y1, b1] = BREADTH[i + 1]
    if (y <= y1) return b0 + (b1 - b0) * (y - y0) / (y1 - y0)
  }
  return 0
}
const smooth = (t: number) => t * t * (3 - 2 * t)
/** Top of the black (the main deck line): 12.4 m, rising toward the bow. */
const black = (y: number) => 12.4 + 3.6 * Math.max(0, (y - 60) / (BOW - 60)) ** 2
/** Top of the hull (the white strake): 17.1 m, sheer rising to the bow, low at the stern. */
const top = (y: number) => 17.1 + 3.9 * Math.max(0, (y - 60) / (BOW - 60)) ** 2 - 2.5 * smooth(Math.min(1, Math.max(0, (-y - 100) / 28)))

// Stations, closer at the ends where the plan curves.
const STATIONS = 34
const ys = Array.from({ length: STATIONS + 1 }, (_, i) => STERN + (BOW - STERN) * (1 - Math.cos(Math.PI * i / STATIONS)) / 2)
/**
 * The hull's side at height z for a station: the stem is raked, so at the
 * waterline the bow ends 6.5 m short of the stem head; the cruiser stern
 * overhangs 3.3 m. The plan is squeezed lengthwise below the deck to match.
 */
function sidePoint(y: number, z: number, side: number): V3 {
  const f = Math.min(1, z / 20)
  const bow = BOW - 6.5 * (1 - f), stern = STERN + 3.3 * (1 - Math.min(1, z / 14))
  const t = (y - STERN) / (BOW - STERN), yy = stern + t * (bow - stern)
  return [side * breadth(y), yy, z]
}
{
  // The ring runs up the starboard side from stern to bow, then down port:
  // counter-clockwise from above. The red boot-topping, the black and the
  // white strake are bands of one lofted skin.
  const ring = (z: (y: number) => number): V3[] => [
    ...ys.map((y) => sidePoint(y, z(y), 1)),
    ...ys.slice(0, -1).reverse().map((y) => sidePoint(y, z(y), -1)),
  ]
  // Each station's own heights, so the bands follow the sheer.
  const r0 = ring(() => 0), r1 = ring(() => 1.1), r2 = ring(black), r3 = ring(top)
  red.loft([r0, r1])
  hull.loft([r1, r2])
  white.loft([r2, r3])
  // The weather deck, following the sheer: the plan triangulated flat, each
  // corner at its own height.
  const plan: XY[] = r3.map((p) => [p[0], p[1]])
  for (const [i, j, k] of earcut(plan)) deck.tri(r3[i], r3[j], r3[k])
}

/** A footprint following the hull between y0 and y1, inset from the side and capped in width. */
function hullBlock(y0: number, y1: number, inset: number, maxHalf = 99, n = 10): XY[] {
  const st = Array.from({ length: n + 1 }, (_, i) => y0 + (y1 - y0) * i / n)
  const w = (y: number) => Math.max(1, Math.min(maxHalf, breadth(y) - inset))
  return ccw([...st.map((y) => [w(y), y] as XY), ...st.slice().reverse().map((y) => [-w(y), y] as XY)])
}
const rectXY = (y0: number, y1: number, half: number): XY[] => ccw([[half, y0], [half, y1], [-half, y1], [-half, y0]])

// --- Superstructure: white tiers ---------------------------------------------
// Promenade deck: nearly the full beam, from the bridge front to the aft terraces.
const PROM = hullBlock(-97, 97, 0.8, 99, 16)
block(white, PROM, 16.6, 21.6, 0.3, deck)
// Aft terraces stepping down to the stern deck.
block(white, hullBlock(-114, -97, 0.8, 99, 4), 15.0, 19.8, 0.3, deck)
block(white, hullBlock(-127, -114, 0.8, 99, 3), 14.0, 17.2, 0.3, deck)
// Boat deck house.
block(white, hullBlock(-80, 62, 5.5, 12, 12), 21.4, 28.0, 0.3, white)
// Forward: the broad block ahead of the lifeboats, the bridge deck, the
// wheelhouse and the bridge wings across the beam.
block(white, hullBlock(61, 94, 3.0, 99, 6), 21.4, 27.0, 0.3, white)
block(white, hullBlock(66, 92, 5.0, 11, 4), 26.8, 30.2, 0.3, white)
block(white, rectXY(82, 91, 7), 30.0, 33.5, 0.3, white)
block(white, hullBlock(87.4, 90.6, 0.6, 99, 1), 29.0, 30.6, 0.2, white)
// Middle and aft deckhouses on the sun deck.
block(white, rectXY(36, 48, 9), 27.8, 29.6, 0.3, white)
block(white, rectXY(-12, 14, 7), 27.8, 29.0, 0.3, white)
block(white, rectXY(-78, -30, 10), 27.8, 30.0, 0.3, white)

// Windows: the promenade deck's long glazing and the boat deck house, a
// panel per bay; rows across the forward faces of the tiers.
{
  const sideRows = (R: XY[], z0: number, z1: number, bay: number, gap: number) => {
    for (let i = 0; i < R.length; i++) {
      const a = R[i], b = R[(i + 1) % R.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 4 || Math.abs(b[0] - a[0]) > Math.abs(b[1] - a[1])) continue // sides only
      const n = Math.max(1, Math.round(L / bay)), w = L / n
      for (let k = 0; k < n; k++) wallPanel(win, a, b, k * w + gap / 2, (k + 1) * w - gap / 2, z0, z1)
    }
  }
  sideRows(PROM, 18.0, 20.9, 7, 1.4)
  sideRows(hullBlock(-80, 62, 5.5, 12, 12), 23.0, 26.8, 6, 1.6)
  sideRows(hullBlock(61, 94, 3.0, 99, 6), 22.4, 25.6, 5, 1.4)
  sideRows(hullBlock(66, 92, 5.0, 11, 4), 27.6, 29.6, 5, 1.4)
  // Forward faces: rows of windows across each tier's front.
  const front = (y: number, half: number, z0: number, z1: number, n: number) => {
    const a: XY = [-half, y], b: XY = [half, y]
    const w = 2 * half / n
    for (let k = 0; k < n; k++) wallPanel(win, b, a, k * w + 0.5, (k + 1) * w - 0.5, z0, z1)
  }
  front(97 - 0.02, breadth(97) - 1.2, 18.0, 20.9, 6)
  front(94 - 0.02, breadth(94) - 3.0 - 0.4, 22.4, 25.6, 6)
  front(92 - 0.02, Math.min(11, breadth(92) - 5) - 0.3, 27.4, 29.6, 5)
  front(91, 6.6, 30.8, 32.8, 3)
}

// --- Lifeboats along the boat deck, white, eleven a side ---------------------
{
  const boat = (cx: number, cy: number) => {
    const L = 5.1, B = 1.45, ring = (z: number, l: number, b: number): V3[] => [
      [cx - b * 0.6, cy - l, z], [cx + b * 0.6, cy - l, z], [cx + b, cy - l * 0.7, z], [cx + b, cy + l * 0.7, z],
      [cx + b * 0.6, cy + l, z], [cx - b * 0.6, cy + l, z], [cx - b, cy + l * 0.7, z], [cx - b, cy - l * 0.7, z],
    ]
    const rs = [ring(22.3, L * 0.8, B * 0.55), ring(23.6, L, B), ring(25.6, L * 0.95, B * 0.9)]
    white.loft(rs)
    white.cap(rs[2], true)
    white.cap(rs[0], false)
  }
  for (let k = 0; k < 11; k++) {
    const y = 60 - k * 11.6
    for (const s of [-1, 1]) boat(s * (breadth(y) - 2.6), y)
  }
}

// --- Funnels: oval, Cunard red with black tops -------------------------------
{
  const FUNNELS: [number, number][] = [[66.9, 44.0], [22.7, 44.0], [-22.6, 42.0]]
  const oval = (cy: number, ra: number, rb: number, z: number): V3[] =>
    Array.from({ length: 16 }, (_, i) => [rb * Math.cos(i / 16 * TAU), cy + ra * Math.sin(i / 16 * TAU), z] as V3)
  for (const [cy, h] of FUNNELS) {
    const band = h - 5.8
    red.loft([oval(cy, 4.4, 3.6, 27.6), oval(cy, 4.4, 3.6, band)])
    hull.loft([oval(cy, 4.4, 3.6, band), oval(cy, 4.4, 3.6, h - 0.3), oval(cy, 4.15, 3.35, h)])
    hull.cap(oval(cy, 4.15, 3.35, h), true)
  }
}

// --- Masts ---------------------------------------------------------------------
{
  const mast = (y: number, z0: number, h: number, nest?: number) => {
    beam(deck, [0, y, z0], [0, y - 1.2, h], rect(0.75, 0.75, 0.2), rect(0.4, 0.4, 0.1), [1, 0, 0])
    if (nest) beam(deck, [0, y - 1.2 * (nest - z0) / (h - z0), nest], [0, y - 1.2 * (nest - z0) / (h - z0), nest + 1.8], rect(0.9, 0.9, 0.2), rect(0.9, 0.9, 0.2), [1, 0, 0])
  }
  mast(111, 18.5, 47.0, 33.0)
  mast(-109, 19.6, 44.0)
}

const HULL = finish('hull-black', 0x4a4f57, 0.6)
const RED = finish('cunard-red', 0xd2623f, 0.7)
const parts = [
  { part: hull, material: HULL },
  { part: white, material: PALETTE.trim },
  { part: deck, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: red, material: RED },
]
const triangles = countDrawn(parts)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('RMS Queen Mary', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at the waterline', height: 47, bearing: 293.7,
})
await Bun.write(new URL('../models/la-queen-mary.glb', import.meta.url), glb)
console.log(`la-queen-mary.glb: ${triangles} triangles, ${glb.length} bytes`)
