/**
 * JFK Airport Terminal 8 (American Airlines), Queens — procedural, CC0-1.0, no textures.
 * bun generators/nyc-jfk-terminal-8.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing −29.2°, the grid of the central terminal area (as Terminal 4 and
 * the control tower): the concourses run along x. Anchor: area centroid of
 * the OSM multipolygon relation/9077394, whose two outers are the main
 * building (way/284907691: headhouse and concourse) and the satellite
 * concourse to the north (way/284907690); both are drawn.
 *
 * Identifying features (photos): the headhouse's big grey metal roof, a long
 * low arch rising from the concourse to a crest near the landside and
 * falling to the glass front, cut off on the west by a long diagonal and
 * ending on the east in a white trussed edge; the tall glazed front over the
 * departures curb; long, plain, silver-grey concourses with pale roofs and
 * short gate piers.
 *
 * Evidence
 * - OSM relation/9077394 "Terminal 8" (outers way/284907691, tagged 30.1 m,
 *   and way/284907690, tagged 11.7 m; neither way carries building=*).
 * - Lidar: USGS 3DEP NY_NewYorkCity, flown 2017, 1 m, heights above the
 *   apron (ground_min 1.64 m + 0.1): the big roof over x −62…100,
 *   y −30…−209, its west edge the diagonal (−62, −209)–(55, −85); its
 *   height along y from 22.8 m at the concourse, 21.3 m at y −90, up to a
 *   crest of 29.2 m at y −160 and down to 25.1 m at the front; the block
 *   west of it 18.1 m with a 9.8 m strip on its west side; the concourse
 *   20 m at the headhouse, 16.6 m, 15.1 m and 11.8 m westward; the satellite
 *   10.6 m; the gate piers ~9 m.
 * - The east end (x > 96 south of the concourse and x > 140) postdates the
 *   flight (empty in the lidar; the 2019–22 expansion, photo 颐园居 2024):
 *   drawn at an estimated 12 m from that photo.
 * - Published: opened in stages 2005–2007, DMJM Aviation (Wikipedia, "JFK
 *   Airport Terminal 8").
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:JFK-SatelliteTerminal-MostlyAA_(36774618531).jpg
 *     (formulanone, CC BY-SA 2.0) aerial from the south-west: the roof, both concourses;
 *   https://commons.wikimedia.org/wiki/File:Terminal_8_at_JFKIA_20240602.jpg
 *     (颐园居, CC BY 4.0) the east end: the roof's trussed edge, the new wing;
 *   https://commons.wikimedia.org/wiki/File:John_F._Kennedy_Airport_T8_20240602.jpg
 *     (颐园居, CC BY-SA 4.0) the glazed front and canopy;
 *   https://commons.wikimedia.org/wiki/File:Terminal_8_departures.jpg
 *     (Mybirthday647, CC0) the front's glass;
 *   https://commons.wikimedia.org/wiki/File:Aerial_view_of_JFK_Terminal_8_from_the_southwest_01_(9456620628).jpg
 *     (Joe Mabel, CC BY-SA 3.0) aerial;
 *   https://commons.wikimedia.org/wiki/File:At_Long_Island_2025_393.jpg
 *     (Mike Peel, CC BY-SA 4.0) aerial;
 *   https://commons.wikimedia.org/wiki/File:John_F._Kennedy_Airport_2021b.jpg
 *     (Antony-22, CC BY-SA 4.0) aerial.
 *
 * Estimated: window bands on the concourses; the front glazing as one
 * glass wall under the roof; the roof as a piecewise-linear curve through
 * the lidar's heights at 10 m steps. The circular rooftop room on the
 * connector north of the concourse (lidar ~14 m) is drawn as part of the
 * 9 m pier.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, clip, ccw, rect, zones, slopedZone, pwl, type Facade } from './nyc-jfk-terminal-5'
import { inside, finishModel } from './nyc-570-lexington'

const MAIN: XY[] = ccw([[48.0, -27.1], [47.9, -30.0], [58.5, -30.1], [58.4, -28.8], [69.3, -29.0], [69.3, -4.4], [72.2, -4.5], [72.1, 32.6], [76.5, 32.8], [72.9, 36.5], [72.8, 39.6], [70.8, 39.5], [71.1, 44.1], [76.0, 48.8], [83.7, 48.8], [88.5, 44.0], [88.5, 39.5], [86.3, 39.4], [86.1, 36.7], [82.6, 33.2], [82.7, 32.3], [87.1, 32.7], [87.3, -28.8], [101.1, -28.8], [101.1, -29.9], [140.2, -29.7], [143.1, -26.6], [168.1, -26.5], [168.1, -18.8], [168.0, 2.1], [176.4, 2.3], [176.4, -19.2], [176.4, -31.0], [158.3, -30.8], [158.0, -62.3], [159.0, -62.6], [164.4, -62.7], [165.4, -61.6], [166.9, -61.4], [190.4, -61.3], [190.6, -66.1], [182.1, -66.3], [170.8, -66.6], [171.4, -91.2], [171.8, -107.3], [166.9, -107.1], [165.7, -107.1], [165.6, -95.4], [165.5, -69.0], [158.0, -68.9], [158.0, -71.8], [144.1, -72.0], [144.1, -76.5], [100.5, -75.9], [95.7, -75.9], [96.3, -202.8], [96.4, -207.8], [94.0, -207.9], [93.9, -208.7], [84.0, -208.7], [80.8, -208.7], [48.0, -208.8], [44.2, -208.9], [14.3, -208.9], [7.2, -209.0], [-23.0, -209.0], [-57.4, -209.2], [-61.7, -209.2], [-65.7, -213.0], [-77.8, -212.9], [-81.2, -212.8], [-30.2, -161.8], [-30.4, -66.9], [-39.2, -67.0], [-39.1, -65.7], [-82.8, -65.9], [-82.8, -69.1], [-82.8, -86.7], [-82.5, -87.0], [-82.4, -88.3], [-82.3, -89.5], [-86.2, -89.3], [-86.0, -85.0], [-91.3, -85.1], [-91.3, -76.4], [-86.2, -76.3], [-86.2, -69.0], [-86.2, -65.7], [-143.5, -65.4], [-143.5, -69.0], [-143.5, -77.9], [-143.6, -90.6], [-152.9, -90.8], [-152.8, -77.5], [-152.8, -69.0], [-152.9, -65.4], [-197.4, -65.4], [-197.3, -63.6], [-204.4, -63.6], [-204.5, -68.9], [-204.5, -77.5], [-204.6, -90.4], [-213.8, -90.4], [-213.8, -69.0], [-213.9, -63.5], [-221.9, -63.6], [-221.7, -62.7], [-246.5, -62.7], [-246.6, -39.3], [-250.4, -39.2], [-250.3, -27.6], [-250.4, -22.9], [-276.6, -22.9], [-276.6, -21.0], [-276.6, -19.0], [-262.8, -19.3], [-262.7, -18.0], [-262.5, -16.5], [-250.5, -16.4], [-250.3, -5.9], [-241.1, -5.8], [-241.1, -27.6], [-241.1, -33.6], [-221.9, -33.6], [-221.9, -32.5], [-197.4, -32.5], [-197.4, -30.6], [-177.3, -30.7], [-177.4, -27.7], [-177.4, -18.6], [-177.3, -5.9], [-168.2, -5.9], [-168.1, -27.7], [-168.2, -30.8], [-112.1, -30.6], [-110.3, -30.3], [-110.3, -27.6], [-110.3, -18.5], [-110.4, -5.8], [-101.3, -6.0], [-101.2, -27.6], [-101.3, -30.5], [-49.5, -30.6], [-49.4, -27.8], [-49.5, -18.6], [-49.7, -5.5], [-40.4, -5.4], [-40.4, -18.5], [-40.4, -27.9], [-40.5, -30.4], [-39.3, -30.5], [-39.3, -29.9], [38.8, -29.9], [38.8, -26.2], [38.8, -19.0], [38.7, -5.7], [48.2, -5.8]])
const SAT: XY[] = ccw([[107.5, 188.9], [93.6, 175.5], [93.8, 144.3], [86.8, 144.2], [87.0, 127.2], [83.9, 127.2], [75.8, 127.3], [71.8, 127.4], [71.8, 144.2], [64.9, 144.3], [65.0, 175.3], [51.9, 188.2], [49.3, 190.9], [11.3, 191.1], [11.1, 182.4], [10.6, 164.5], [1.8, 164.7], [1.8, 191.0], [-43.9, 191.1], [-43.9, 182.7], [-43.8, 164.4], [-53.0, 164.6], [-52.9, 191.3], [-92.5, 191.0], [-92.5, 182.8], [-92.5, 165.1], [-101.8, 165.1], [-102.0, 191.0], [-146.8, 191.0], [-147.1, 182.3], [-147.6, 165.2], [-156.4, 165.0], [-156.5, 190.9], [-170.1, 190.6], [-170.1, 193.0], [-203.7, 193.2], [-223.6, 193.5], [-223.7, 196.5], [-226.9, 196.4], [-227.2, 208.8], [-250.1, 208.9], [-250.2, 211.2], [-250.2, 213.0], [-223.1, 212.7], [-222.6, 200.7], [-220.6, 200.7], [-220.3, 222.2], [-218.7, 222.3], [-218.6, 234.1], [-216.4, 234.1], [-213.4, 234.0], [-213.6, 222.3], [-170.2, 222.1], [-170.2, 224.2], [-142.5, 224.3], [-88.2, 224.0], [-38.8, 224.0], [21.6, 224.1], [70.5, 224.0], [125.1, 223.9], [170.5, 223.8], [170.7, 222.2], [179.8, 222.2], [208.3, 222.1], [208.4, 198.7], [208.4, 193.3], [170.7, 193.3], [170.6, 191.0], [169.1, 191.0], [169.1, 182.7], [169.1, 164.8], [160.0, 164.8], [160.4, 191.2], [120.3, 191.0], [120.2, 182.3], [120.2, 164.7], [111.3, 164.8], [111.4, 191.0], [109.4, 190.9]])

// The big roof (lidar): plan and height along y.
const ROOF: XY[] = ccw([[-62, -209], [96.2, -209], [96.2, -76], [100.5, -76], [100.5, -30], [55, -30], [55, -85]])
const roofZ = pwl([[-209, 25.1], [-200, 25.6], [-190, 27.2], [-180, 28.4], [-170, 29.0], [-160, 29.2], [-150, 28.8], [-140, 27.9], [-130, 26.6], [-120, 24.7], [-110, 23.0], [-90, 21.3], [-70, 22.0], [-30, 22.8]])

function build() {
  const panel = new Part(), win = new Part(), roof = new Part(), big = new Part(), trim = new Part()
  const ext = [MAIN, SAT]
  const band: Facade = { bay: 8, ratio: 0.8, floor: 4, group: 1, spandrel: 0, sill: 4.5, head: 2, ground: 4.5, minLength: 7 }

  const notRoof = (rs: XY[][]) => clip('difference', rs, [ROOF])
  const bar = (x0: number, x1: number) => notRoof(clip('intersection', [MAIN], [rect(x0, -66.5, x1, -29.95)]))
  const east = notRoof(clip('union', clip('intersection', [MAIN], [rect(140, -120, 200, 10)]), clip('intersection', [MAIN], [rect(96, -120, 200, -66.5)])))
  const head = notRoof(clip('difference', clip('intersection', [MAIN], [rect(-100, -220, 96, -66.5)]), [rect(96, -220, 200, -66.5)]))
  const headWest = clip('intersection', head, [rect(-100, -220, -20, -60)], ).concat(clip('difference', clip('intersection', head, [rect(-20, -220, 96, -165)]), [rect(-100, -220, -20, -60)]))
  const headNorth = clip('difference', head, [rect(-100, -220, -20, -60)], [rect(-20, -220, 96, -165)])
  const piers = notRoof(clip('difference', [MAIN], [rect(-300, -66.5, 140, -29.95)], [rect(-100, -220, 96.2, -66.5)], [rect(140, -120, 200, 10)], [rect(96, -120, 200, -66.5)]))
  const satBar = clip('intersection', [SAT], [rect(-260, 191.5, 220, 225)])
  const satPiers = clip('difference', [SAT], [rect(-260, 191.5, 220, 225)])

  const list = [
    { rings: bar(-300, -200), z: 11.8, facade: band },
    { rings: bar(-200, -110), z: 15.1, facade: band },
    { rings: bar(-110, -30), z: 16.6, facade: band },
    { rings: bar(-30, 140), z: 20, facade: band },
    { rings: east, z: 12, facade: band },
    { rings: headNorth, z: 18.1, facade: band },
    { rings: headWest, z: 9.8, facade: band },
    { rings: piers, z: 9, facade: { ...band, floor: 3, sill: 3.2, head: 1.3, ground: 3.2 } },
    { rings: satBar, z: 10.6, facade: { ...band, sill: 3.5, head: 1.8, ground: 3.5 } },
    { rings: satPiers, z: 8.5, facade: { ...band, floor: 3, sill: 3.2, head: 1.3, ground: 3.2 } },
  ]
  const zoneAt = (q: XY) => { let h = 0; for (const z of list) for (const r of z.rings) if (inside(q, r)) h = Math.max(h, z.z); return h }
  const roofAt = (q: XY) => (inside(q, ROOF) ? roofZ(q[1]) : 0)
  zones({ wall: panel, win, roof, coping: trim, exterior: ext, list, heightAt: roofAt })

  // The big roof over the headhouse; the front (y −209) is all glass.
  const front: Facade = { bay: 7.5, ratio: 0.92, floor: 10, group: 1, spandrel: 0, sill: 0.3, head: 1.4, ground: 0.4, minLength: 3 }
  slopedZone({
    roof: big, wall: panel, win, fascia: trim, ring: ROOF, z: (q) => roofZ(q[1]), axis: 1, step: 10, heightAt: zoneAt, exterior: ext,
    facade: (a, b) => (Math.abs(a[1] - b[1]) < 0.5 && a[1] < -200 ? front : { ...band, sill: 5, head: 3, ground: 5 }),
  })

  // The white trussed rim along the roof's east end (photo: the trusses cantilever past the wall).
  {
    const x0 = 96.2, x1 = 98.2, Y: number[] = []
    for (let y = -209; y <= -76.01; y += 7) Y.push(y)
    Y.push(-76)
    for (let k = 0; k < Y.length - 1; k++) {
      const a = Y[k], b = Y[k + 1], za = roofZ(a), zb = roofZ(b), h = 2.2
      trim.quad([x1, a, za - h], [x1, b, zb - h], [x1, b, zb + 0.15], [x1, a, za + 0.15]) // outer face (+x)
      trim.quad([x0, a, za + 0.15], [x1, a, za + 0.15], [x1, b, zb + 0.15], [x0, b, zb + 0.15]) // top
      trim.quad([x0, b, zb - h], [x1, b, zb - h], [x1, a, za - h], [x0, a, za - h]) // underside
    }
    const a = -209, za = roofZ(a)
    trim.quad([x0, a, za - 2.2], [x1, a, za - 2.2], [x1, a, za + 0.15], [x0, a, za + 0.15]) // south end (−y)
  }

  finishModel('JFK Airport Terminal 8', 'nyc-jfk-terminal-8', [
    { part: panel, material: finish('t8-panel', 0xc9cccf) },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('t8-flat-roof', 0xdcdddb) },
    { part: big, material: finish('t8-metal-roof', 0xa3a8ad) },
    { part: trim, material: PALETTE.trim },
  ], { bearing: -29.2, osm: 'relation/9077394', height: 29.2 }, 6500)
}

if (import.meta.main) build()
