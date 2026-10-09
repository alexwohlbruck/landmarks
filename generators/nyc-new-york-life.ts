/**
 * New York Life Building (51 Madison Avenue), Manhattan — procedural, CC0-1.0, no textures.
 * bun generators/nyc-new-york-life.ts
 *
 * Map frame: x = model east (East 26th/27th Streets run along x, Madison
 * Avenue is −x, Park Avenue South +x), y = model north (27th Street), z up,
 * metres. Placed at bearing 29°, the Manhattan grid. Anchor: area centroid of
 * the OSM outline way/109280421, which covers the whole block.
 *
 * Identifying features (from the photos): the gilded octagonal pyramid
 * roof; its gold lantern and spire; the four corner turrets with gold cone
 * caps round the pyramid's foot; the square pale limestone tower rising
 * from wings and a block-filling base in 1916-zoning setbacks; the
 * double-height arcade round the street walls.
 *
 * Evidence
 * - OSM way/109280421 (block outline, 126 × 59 m, tagged 22 m) and its parts
 *   158856535 (central section, 60 m, with light courts on 26th and 27th
 *   Streets), 158856532 (tower and wings, 115 m), 158856533 (tower, 148 m),
 *   158856531 (octagonal roof, 187.5 m), 607446387/389/391/393 (corner
 *   turrets, 152.5 m).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), resampled into the model frame
 *   (/tmp/city/nyc/work/nyc-new-york-life/rot.png), heights above the street
 *   (10.3 m NAVD88): base 22–24 m over the whole block; central section
 *   60–62 m; wings 105–113 m; tower 138–149 m; the roof from ~146 m at its
 *   foot (r ≈ 11 m) to 163–172 m at r 5 m and 187–189 m at the tip.
 * - Published: 1928, Cass Gilbert; 615 ft (187 m), 34 office storeys plus a
 *   six-storey roof; setbacks at the 5th, 14th, 26th, 30th, 31st, 34th and
 *   35th floors; tower five bays a side, wings three; the octagonal pyramid
 *   88 ft (27 m) tall in gold-leafed tiles with a 57 ft (17 m) lantern;
 *   arcades of 9 bays on the avenues and 19 on the streets; limestone over a
 *   granite base (Wikipedia; NRHP 1978).
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-new-york-life/photos/credits.txt: from the Empire
 *   State Building (north-west, DanielPenfield CC BY-SA 4.0; Tony Hisgett CC
 *   BY 2.0), at dusk (Noah Sheridan CC BY-SA 3.0), from the north-east
 *   (ButtonwoodTree CC BY-SA 3.0), street level (AnahitaR CC BY-SA 4.0).
 *
 * Estimated: the clean rectangles drawn for the setbacks (OSM, squared to
 * the grid), storey height 4.1 m and panel grouping (one panel per paired
 * window bay, two floors), the 35th-floor block (set ~2.5 m in, so the turrets
 * at its corners land on OSM's turret ways), the lantern's split between gallery and spire, the
 * small mid-side gold finials.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, massing, finishModel, circle, type Facade } from './nyc-570-lexington'
import { archPanel, rectPanel, band, spread } from './nyc-city-hall'

const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), gold = new Part()

const R = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const edges = (r: XY[]) => r.map((a, i) => [a, r[(i + 1) % r.length]] as [XY, XY])
const len = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])

const cx = -0.7, cy = -0.9 // centre of the octagonal roof (OSM way/158856531)

// --- Setback massing (OSM parts, squared to the grid; heights from lidar) ---
const BLOCK = R(-62.8, -29.6, 62.8, 29.6)
const CENTRAL: XY[] = [
  [-58.1, -24.4], [-35.6, -24.4], [-35.6, -18.6], [-24.7, -18.6], [-24.7, -24.4], [23.3, -24.4], [23.3, -18.6], [34.9, -18.6], [34.9, -24.4], [55.6, -24.4],
  [55.6, 22.4], [34.9, 22.4], [34.9, 16.5], [23.3, 16.5], [23.3, 22.4], [-24.7, 22.4], [-24.7, 16.5], [-35.6, 16.5], [-35.6, 22.4], [-58.1, 22.4],
]
const WINGS = R(-35.7, -11.7, 34.8, 9.6)
const TOWER = R(-17.1, -18.4, 15.7, 16.6)
const TOWER_TOP = 141
const facadeSpec: Facade = { bay: 6.4, ratio: 0.5, floor: 4.1, group: 2, spandrel: 2.3, sill: 2.2, head: 3.2, ground: 26, margin: 1.6, minLength: 5 }
massing({
  wall: stone, win, roof, coping: trim,
  polys: [[24, BLOCK], [60, CENTRAL], [110, WINGS], [TOWER_TOP, TOWER]],
  facade: facadeSpec, bevel: 0.5,
})
// Cornices at the setbacks.
band(trim, BLOCK, 20.5, 21.6, 0.45)
band(stone, BLOCK, 0, 1.4, 0.2) // granite water table

// --- The street arcade: double-height round arches, 19 bays on the streets, 9 on the avenues ---
edges(BLOCK).forEach(([a, b], i) => {
  const L = len(a, b), n = i % 2 === 0 ? 19 : 9
  const pitch = (L - 4) / n
  for (const s of spread(2, L - 2, n)) archPanel(win, a, b, s, pitch * 0.62, 0.8, 11.2, 0.06, 8)
  // A band of windows on the two storeys over the arcade.
  for (const s of spread(2, L - 2, n)) rectPanel(win, a, b, s, pitch * 0.5, 13, 19, 0.05)
})

// --- The 35th floor: a parapeted block set in from the tower, arched windows ---
// Set in ~2.5 m from the tower so its corners carry the turrets where OSM maps them
// (ways 607446387–393, centres ±12.6 × ±13.4 m from the roof's centre).
const TOP35 = R(cx - 13.7, cy - 14.4, cx + 13.7, cy + 14.4)
prism({ wall: stone, win: null, roof, coping: trim, ring: TOP35, z0: TOWER_TOP, z1: 147.6, facade: null, bevel: 0.4 })
for (const [a, b] of edges(TOP35)) for (const s of spread(4.5, len(a, b) - 4.5, 5)) archPanel(win, a, b, s, 2.4, TOWER_TOP + 1.2, 146.4, 0.05, 6)

// --- Turrets at the four corners, gold cones; small gold finials mid-side ---
const ring = (x: number, y: number, r: number, z: number, n = 12): V3[] => circle(x, y, r, n, Math.PI / n).map(([px, py]) => [px, py, z] as V3)
for (const [x0, y0] of TOP35) {
  const x = x0 + (x0 < cx ? 1.1 : -1.1), y = y0 + (y0 < cy ? 1.0 : -1.0)
  stone.loft([ring(x, y, 1.9, TOWER_TOP - 1), ring(x, y, 1.9, 150.4)])
  trim.loft([ring(x, y, 1.9, 150.4), ring(x, y, 2.15, 150.8), ring(x, y, 2.15, 151.2)])
  gold.loft([ring(x, y, 2.15, 151.2), ring(x, y, 1.2, 153.4), ring(x, y, 0.05, 156.5)])
}
for (const [a, b] of edges(TOP35)) {
  const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  stone.loft([ring(m[0], m[1], 1.1, 148.0, 8), ring(m[0], m[1], 1.1, 150.6, 8)])
  gold.loft([ring(m[0], m[1], 1.3, 150.6, 8), ring(m[0], m[1], 0.04, 153.6, 8)])
}

// --- The gilded octagonal pyramid, its lantern and spire ---
const oct = (ap: number, z: number): V3[] => {
  const r = ap / Math.cos(Math.PI / 8)
  return circle(cx, cy, r, 8, Math.PI / 8).map(([x, y]) => [x, y, z] as V3)
}
// The OSM octagon (apothem 11.9 m) fills the 35th-floor roof between the turrets;
// the slope fits the lidar (allowing ~1 m for its cell blur: ~154 m at r 9.5,
// ~161 m at r 6.7, ~169 m at r 3.7); about as tall as it is wide, as photographed.
const PYR0 = 148.2, PYR1 = 175
gold.loft([oct(12.4, 147.6), oct(12.4, PYR0), oct(11.9, PYR0 + 0.4), oct(2.6, PYR1)])
// Lantern: an octagonal gold cage of arched openings over a gallery, then the spire.
gold.loft([oct(2.6, PYR1), oct(3.0, PYR1 + 0.4), oct(3.0, PYR1 + 1.0), oct(2.4, PYR1 + 1.2)])
gold.loft([oct(2.4, PYR1 + 1.2), oct(2.4, 181.2), oct(2.7, 181.6), oct(2.7, 182.0), oct(2.1, 182.4)])
{
  const o = oct(2.4, 0)
  for (let i = 0; i < 8; i++) {
    const a: XY = [o[i][0], o[i][1]], b: XY = [o[(i + 1) % 8][0], o[(i + 1) % 8][1]]
    archPanel(win, a, b, len(a, b) / 2, 1.1, PYR1 + 1.7, 180.6, 0.04, 6)
  }
}
gold.loft([oct(2.1, 182.4), oct(1.1, 184.9), oct(0.45, 186.2), oct(0.02, 187.5)])

finishModel('New York Life Building', 'nyc-new-york-life', [
  { part: stone, material: finish('nyl-limestone', 0xe2d6c0) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: gold, material: finish('nyl-gilded-roof', 0xdcbb55) },
], { bearing: 29, osm: 'way/109280421', height: 187.5 }, 5000)
