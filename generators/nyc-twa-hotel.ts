/**
 * TWA Hotel's two hotel towers (the Saarinen Wing, north, and the Hughes
 * Wing, south), JFK Airport, Queens (2019, Lubrano Ciavarra Architects) —
 * original procedural geometry, CC0-1.0.
 * bun generators/nyc-twa-hotel.ts
 *
 * The 1962 TWA Flight Center between them is its own model
 * (nyc-twa-flight-center); this one is only the two 2019 towers, drawn to
 * sit with it as one set.
 *
 * Map frame: x east, y north, z up, metres, origin at the anchor on the
 * lowest ground. Bearing -3.5, the Flight Center's own bearing, so the two
 * models share axes. Anchor: centre of the two towers' bounding box,
 * -73.7776173, 40.6457858 (inside the Flight Center's court).
 *
 * Identity (from the photos below):
 *  1. Two low crescents that wrap round the back of the Flight Center,
 *     their concave sides facing it, seven storeys.          (aerial OSM plan, hw1, sw1)
 *  2. Curtain walls of near-black glass on both long, curved faces.  (hw1, sw1, fc64)
 *  3. A tall pale metal-panel block at each tower's east end, by the
 *     flight tubes, standing above the glass, with a white plant room on
 *     top.                                                     (hw1, sw1, fc59, fc64)
 *  4. Pale flat roofs with a long low plant room on each.        (hw1, pool1)
 *
 * Plan: OSM way/736809349 (north tower) and way/736827874 (south tower),
 * both untagged building=yes, used as drawn. The end blocks are the east
 * ends of those outlines (OSM's small notches there are the stair cores).
 *
 * Heights: no lidar covers the towers (USGS 3DEP NY_NewYorkCity was flown
 * in 2017, before they were built), so every height is published or
 * estimated. Published: seven storeys (Wikipedia, "TWA Hotel"); curtain
 * wall panels 2.9 m tall (Wikipedia). Estimated from the photos against
 * the 2.9 m panels: glass roof 22.5 m (a 4 m ground floor and six 3.05 m
 * storeys, plus the parapet), the end blocks 25 m, their plant rooms 28 m,
 * the plant rooms on the glass roofs 25.3 m.
 *
 * Estimated: how far each end block runs along the arc (from hw1 and sw1,
 * about as deep as the tower is wide); the plant rooms' size and place.
 * Left out: the curtain wall's vertical fins (a stripe per panel would
 * shimmer; the wall reads as one dark band), the rooftop infinity pool and
 * its deck (not seen in any open photo from outside), masts and rails.
 *
 * Photos (evidence, Wikimedia Commons):
 *  hw1   "Hughes Wing, TWA Hotel, ... (48589261887).jpg", Warren LeMay, CC0.
 *  sw1   "Saarinen Wing, TWA Hotel, ... (48589138716).jpg", Warren LeMay, CC0.
 *  pool1 "View from Pool Deck, TWA Hotel, ....jpg", w_lemay, CC0.
 *  fc59, fc63, fc64 "TWA Flight Center Dec 2025 59/63/64.jpg", Epicgenius,
 *        CC BY-SA 4.0.
 *  jag   "TWA Hotel at JFK Airport, New York City 20190521-jag9889.jpg",
 *        Jag9889, CC BY-SA 4.0.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { box, offset, prism, save, toFrame, wall, type XY } from './atl-flatiron-building'

const ANCHOR = { lng: -73.7776173, lat: 40.6457858 }, BEARING = -3.5
const GLASS = 22.5, BLOCK = 25, BLOCK_TOP = 28, PLANT = 25.3

const glass = new Part(), panel = new Part(), roof = new Part()

type LL = [number, number]
// OSM outlines, lon/lat, as drawn.
const NORTH: LL[] = [[-73.7779318, 40.6466902], [-73.7780354, 40.6467009], [-73.7780877, 40.6467016], [-73.778212, 40.646703], [-73.778201, 40.6465538], [-73.778102, 40.6465585], [-73.7780061, 40.6465532], [-73.7779045, 40.6465397], [-73.7778, 40.6465164], [-73.7777042, 40.6464872], [-73.7776052, 40.6464461], [-73.7775146, 40.6464], [-73.7774377, 40.6463488], [-73.7773666, 40.6462932], [-73.7773086, 40.6462456], [-73.7772206, 40.6462922], [-73.7771952, 40.6462657], [-73.7771596, 40.6462857], [-73.7771849, 40.6463112], [-73.7771513, 40.646329], [-73.7772341, 40.6464019], [-73.7773174, 40.646465], [-73.7774213, 40.6465312], [-73.777538, 40.6465879], [-73.7776572, 40.6466321], [-73.7777816, 40.6466659]]
const SOUTH: LL[] = [[-73.7778433, 40.6450107], [-73.7777996, 40.6448685], [-73.7777008, 40.6448843], [-73.7775951, 40.64491], [-73.7774823, 40.6449538], [-73.7773756, 40.6450057], [-73.777265, 40.6450695], [-73.7771619, 40.6451467], [-73.7770922, 40.6452122], [-73.7770226, 40.6452867], [-73.7770561, 40.6453062], [-73.7770364, 40.6453267], [-73.77707, 40.6453464], [-73.7770896, 40.6453256], [-73.7771798, 40.645378], [-73.7772501, 40.645299], [-73.7773249, 40.6452319], [-73.7774146, 40.645167], [-73.7775076, 40.6451144], [-73.777615, 40.6450704], [-73.777726, 40.6450379]]

const frame = (ll: LL[]) => toFrame(ll, ANCHOR, BEARING)
const centre = (r: XY[]): XY => [r.reduce((s, p) => s + p[0], 0) / r.length, r.reduce((s, p) => s + p[1], 0) / r.length]

/**
 * One tower: the glass body, its parapet and roof, the pale east block and
 * the plant rooms. `east` and `mid` are vertex indices into the OSM outline:
 * the east block's outline and a quad across the middle of the arc.
 */
function tower(outline: LL[], east: number[], mid: number[]) {
  const ring = frame(outline)
  // Glass from the ground to the parapet; a pale parapet band and roof.
  wall(glass, ring, 0, GLASS - 0.8)
  prism(panel, ring, GLASS - 0.8, GLASS, roof, 0.25)
  // The east block, a hair proud of the glass so the two never share a face.
  const block = offset(frame(east.map((i) => outline[i])), 0.08)
  prism(panel, block, 0, BLOCK, panel, 0.3)
  const [bx, by] = centre(block)
  box(panel, bx - 4, bx + 4, by - 3.5, by + 3.5, BLOCK, BLOCK_TOP, panel, 0.2)
  // A long low plant room over the middle of the arc.
  prism(panel, offset(frame(mid.map((i) => outline[i])), -3.2), GLASS, PLANT, panel, 0.2)
}

// Vertex indices into NORTH / SOUTH (see the OSM ways): the east blocks take
// the notched stair cores and the outline either side of them.
tower(NORTH, [13, 14, 15, 16, 17, 18, 19, 20], [8, 9, 10, 23, 24, 25])
tower(SOUTH, [7, 8, 9, 10, 11, 12, 13, 14, 15], [3, 4, 5, 17, 18, 19])

await save('nyc-twa-hotel', 'TWA Hotel', [
  // The near-black glass is the towers' identity: darker than the library's
  // slate, held at STYLE.md's charcoal limit, still named `window` to glow.
  { part: glass, material: { ...PALETTE.window, color: 0x4d5762 } },
  { part: panel, material: finish('twa-hotel-panel', 0xe8e9e7) },
  { part: roof, material: finish('twa-hotel-roof', 0xd6d8d6) },
], { height: BLOCK_TOP, anchor: [ANCHOR.lat, ANCHOR.lng], bearing: BEARING })
