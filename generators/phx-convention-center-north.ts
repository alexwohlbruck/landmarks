/**
 * Phoenix Convention Center, North Building (2008, the second phase of the
 * 2006–08 expansion), Phoenix, Arizona — original procedural geometry,
 * CC0-1.0.
 * bun generators/phx-convention-center-north.ts
 *
 * Uses the kit in phx-convention-center-west.ts (merge that first).
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: the walls run
 * north–south and east–west. Anchor -112.0688676, 33.4493739, the area
 * centroid of OSM's outline way/668623337. Geometry is written in metres
 * about -112.0698, 33.4487 ("rel") and shifted by (-86.6, -74.8).
 *
 * What is drawn: OSM way/668623337 only (no building:parts inside it).
 * The skybridge to the West Building over 3rd Street (way/209289532) is
 * its own OSM building and is left to the map; it lands on this
 * building's bridge lobby (rel y 69–88). The truck-parking garage against
 * the east wall (way/110199787) is its own building and is left out too.
 *
 * Identity (from the photos below):
 *  1. The vast louvred steel canopy along 3rd Street at roof height,
 *     cantilevered 21 m out over the sidewalk.       (s3rd, gage, v1, lidar)
 *  2. Under it, six glass lobby boxes leaning out toward the street,
 *     between striped rust-and-sandstone stair towers. (s3rd, gage, v1)
 *  3. The huge exhibit-hall box: beige panels below a silver ribbed
 *     metal skin, its roof falling 5 m from 3rd St to 5th St. (gage, lidar)
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020, 1 m grid,
 * tools/lidar.py; ground_min 328.26 m). y = 0 is 331.66 m, the street at
 * the building's south-west corner (the site is flat within about 1.5 m).
 * Measured (model metres): the hall roof 35.7 on 3rd St falling to 30.5
 * at the east wall; the canopy's top 36.0–36.5, reaching out to rel x 6;
 * the glass lobbies' roofs 24.4; the stair towers drawn 21 (gage, s3rd: nearly as tall as the lobbies; the lidar returns of 15.5 there are taken as their lower roofs).
 * Plan: OSM's outline: the lobbies are its six bays reaching to rel x 18
 * (and the bridge lobby to x 11), the towers stand in the recesses
 * between them.
 *
 * Estimated: the lobbies' lean (2 m over their height, from s3rd and
 * gage); the silver skin's depth (from 24 m up); the canopy's slats,
 * girders and struts (drawn sparser and bolder than the real truss); the
 * stripes; the sandstone base band. Left out: signs, planters, the
 * balconies on the south face, the east garage. The north, south and east
 * faces are drawn plain; no licensed photo shows them square on.
 *
 * Photos (evidence):
 *  s3rd "Phoenix Convention Center - South on 3rd St - 2009-07-06.jpg",
 *       Cygnusloop99, CC BY-SA 3.0, Wikimedia Commons
 *       https://commons.wikimedia.org/wiki/File:Phoenix_Convention_Center_-_South_on_3rd_St_-_2009-07-06.jpg
 *  gage "Phoenix Convention Center by Gage Skidmore.jpg", Gage Skidmore,
 *       CC BY-SA 3.0, Wikimedia Commons
 *       https://commons.wikimedia.org/wiki/File:Phoenix_Convention_Center_by_Gage_Skidmore.jpg
 *  v1   "Phoenix Convention Center-1.jpg", Visitor7, CC BY-SA 3.0,
 *       Wikimedia Commons
 *       https://commons.wikimedia.org/wiki/File:Phoenix_Convention_Center-1.jpg
 *  n21  "2021 Phoenix Convention Center, North Building.jpg", Beyond My
 *       Ken, CC BY-SA 4.0, Wikimedia Commons
 *       https://commons.wikimedia.org/wiki/File:2021_Phoenix_Convention_Center,_North_Building.jpg
 * Aerial: USGS NAIP (public domain). No look-only sources. No commercial
 * imagery.
 *
 * Night: the glass lobbies are `window` and glow.
 */
import { Part } from './mesh'
import { CC, Kit, canopy, stairTower, write, type XY } from './phx-convention-center-west'

const ID = 'phx-convention-center-north'
const k = new Kit([-86.6, -74.8])
const panel = new Part(), metal = new Part(), rust = new Part(), sand = new Part(), win = new Part(), roof = new Part()

// The hall: x 27..153.7, y -22.9..172.1, roof falling east 35.7 → 30.5.
const XW = 27, XE = 153.7, YS = -22.9, YN = 172.1, SKIN = 24
const zr = (x: number) => 35.7 - (5.2 * (x - XW)) / (XE - XW)
const hall: XY[] = [[XW, YS], [XE, YS], [XE, YN], [XW, YN]]
k.walls(panel, hall, 0, SKIN)
k.walls(metal, hall, SKIN, (x) => zr(x))
k.top(roof, hall, (x) => zr(x))
// the sandstone base band with a rust stripe, on the three plain faces
for (const [a, b] of [[[XW, YS], [XE, YS]], [[XE, YS], [XE, YN]], [[XE, YN], [XW, YN]]] as [XY, XY][]) {
  k.panel(sand, a, b, 0, 1, 0, 5.5, 0.08)
  k.panel(rust, a, b, 0, 1, 2.2, 3.6, 0.12)
}

// The 3rd St lobbies: glass boxes from the hall wall out to x 18 (the
// bridge lobby to x 11), leaning 2 m out at the top.
const LOB = 24.4, LEAN = 2
const lobbies: [number, number, number][] = [
  [-13.6, 6.5, 18.4], [15.2, 33.3, 18.6], [42.5, 60.4, 18.5], [69.2, 88.4, 11.1],
  [96.4, 115.7, 17.9], [124.6, 143.6, 17.8], [152, 171.2, 18],
]
for (const [y0, y1, x0] of lobbies) {
  // a leaning box: the west face tilts out; the sides are trapezoids
  const b: XY[] = [[x0, y0], [XW, y0], [XW, y1], [x0, y1]]
  const tp = (p: XY): XY => (p[0] === x0 ? [x0 - LEAN, p[1]] : p)
  for (let i = 0; i < 4; i++) {
    const a = b[i], c = b[(i + 1) % 4]
    const [ta, tc] = [tp(a), tp(c)]
    win.quad(k.P(a[0], a[1], 0), k.P(c[0], c[1], 0), k.P(tc[0], tc[1], LOB), k.P(ta[0], ta[1], LOB))
  }
  k.top(roof, b.map(tp), LOB)
  // a pale frame line across the glass at two-thirds height
  k.panel(metal, [x0 - LEAN * 0.66, y1], [x0 - LEAN * 0.66, y0], 0, 1, 16, 16.8, 0.1)
}
// The stair towers in the recesses between the lobbies.
for (const [y0, y1] of [[6.5, 15.2], [33.3, 42.5], [60.4, 69.2], [88.4, 96.4], [115.7, 124.6], [143.6, 152]]) {
  stairTower(k, sand, rust, roof, 19, XW, y0 + 0.3, y1 - 0.3, 21)
}
// the plain wall under the canopy at the south end, and the canopy
k.box(panel, 19, XW, YS, -13.6, 0, 21, roof)
canopy(k, metal, XW, 6, YS, YN, (x) => 36 + (0.5 * (XW - x)) / (XW - 6), 18)

await write(ID, 'Phoenix Convention Center North Building',
  'Y up, -Z north, +X east, metres; origin on the ground at the outline centroid (-112.0688676, 33.4493739); bearing 0', [
    { part: panel, material: CC.panel },
    { part: metal, material: CC.metal },
    { part: rust, material: CC.rust },
    { part: sand, material: CC.sand },
    { part: win, material: CC.window },
    { part: roof, material: CC.roof },
  ])
