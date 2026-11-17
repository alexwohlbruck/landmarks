/**
 * The 20 Times Square screen (701 Seventh Avenue, the Times Square EDITION;
 * lit 2018-19): the 18,000 sq ft LED wall that wraps the north-east corner
 * of Seventh Avenue and West 47th Street above Hershey's Chocolate World,
 * the largest single screen in Times Square when it opened. Signage only,
 * so it replaces nothing: the tower stays the map's own OSM extrusion.
 * Procedural, CC0-1.0.
 *   bun generators/nyc-20-times-square-screen.ts
 *
 * Host: OSM way/266170795 "20 Times Square" (building=yes, height 157,
 * building:levels 42, start_date 2018), no building:parts. Its outline is
 * a plain rectangle on the grid: the Seventh Avenue face 30.2 m long, the
 * 47th Street face 48.6 m, the corner between them drawn square.
 * Confirmed: OSM and Wikipedia put the building on the north-east corner
 * of Seventh Avenue and 47th Street, across 47th from TSX Broadway.
 *
 * Map frame: x east, y north, z up, metres, turned by the bearing (29.0°,
 * the Manhattan grid, from the OSM edges): +y runs up Seventh Avenue, +x
 * along 47th Street. The origin is the outline's south-west corner (the
 * corner of the avenue and 47th Street), on the ground: -73.984417,
 * 40.759220. In this frame the avenue face is x = 0 (y 0 to 30.2) and the
 * 47th Street face y = 0 (x 0 to 48.6).
 * Elevation: the sign hangs on the facade, so y = 0 is the screen's
 * bottom (9.5 m up) and the placement's `elevation` is 9.5.
 *
 * Published (Wikipedia "20 Times Square"): "18,000 square feet of screen
 * along 200 linear feet of wraparound frontage", 16 million LEDs at 10 mm:
 * so 61.0 m of developed length and 27.4 m of height.
 * Measured/estimated from the photos (c00 above all): the screen starts
 * over a two-storey glazed shopfront base, about 9.5 m up, so it reaches
 * 36.9 m; it runs the whole avenue face and turns the corner on a broad
 * curve (drawn 8 m: OSM draws the corner square, so a broader curve would
 * stand the screen even further off the street faces), and the rest of the
 * 61 m runs along 47th Street (avenue 24.9 m, curve 12.6 m, 47th 23.6 m); its top corners are rounded (4 m); its two
 * ends carry a narrow vertical strip in another colour (pink and green in
 * 2019, Hershey's red with FREE CHOCOLATE in 2023 and 2026), 2.6 m wide.
 * The screen's front is 3.0 m off the street faces and its cabinet runs
 * back to 0.3 m off them, so nothing sits inside the extrusion; at the
 * corner the curve clears OSM's square corner by 0.9 m.
 * Colours: rotating ads, so two bold blocks: the wall a pale white-pink
 * (white in 2019, pale pink in 2023; it glows pink-white at night) and the end strips Hershey's red. Both
 * are neon and glow in their own colours at night; the cabinet and its
 * 0.6 m frame are dark.
 *
 * Photos (EVIDENCE):
 * - c00 "Times Square, New York 2019 12.jpg", dconvertini, CC BY-SA 2.0:
 *   from the south-west, raised: the base, the curve, the end strips.
 *   https://commons.wikimedia.org/wiki/File:Times_Square,_New_York_2019_12.jpg
 * - c02 "Times Square, New York 2019 17.jpg", dconvertini, CC BY-SA 2.0.
 *   https://commons.wikimedia.org/wiki/File:Times_Square,_New_York_2019_17.jpg
 * - c01 "Times Square, New York 2019 13.jpg", dconvertini, CC BY-SA 2.0:
 *   from below, the 47th Street wing.
 *   https://commons.wikimedia.org/wiki/File:Times_Square,_New_York_2019_13.jpg
 * - p-c13 "View of Times Square (May 2023).JPG", Benoît Prieur, CC0: from
 *   the west, the avenue face nearly square on and the red end strips.
 *   https://commons.wikimedia.org/wiki/File:View_of_Times_Square_(May_2023).JPG
 * - p-c14 "20 Times Square - The Times Square EDITION (55283756778).jpg",
 *   Flickr 83136374@N05, CC BY 4.0 (May 2026): from the south-west at
 *   street level, the wrap and the red end strips.
 *   https://commons.wikimedia.org/wiki/File:20_Times_Square_-_The_Times_Square_EDITION_(55283756778).jpg
 * Night: "Times Square, NYC at night - August 2025.jpg",
 *   Nielsoncaetanosalmeron, CC BY 4.0.
 *   https://commons.wikimedia.org/wiki/File:Times_Square,_NYC_at_night_-_August_2025.jpg
 *
 * No lidar: the 2017 NYC flight predates the tower and its screen.
 * Doubts: the split of the 61 m between the two streets and the corner
 * radius are read from oblique photos; the real curve may be broader still
 * than the 8 m drawn, and the screen stands further off the faces than
 * the real one so as to wrap OSM's square corner; the base height (9.5 m) is estimated from storeys. The
 * EDITION's own small signs and the hotel crown are left out.
 */
import { Part } from './mesh'
import { finish } from './palette'
import { offsetLeft, rounded, save, signedDist, wrapScreen, type XY } from './nyc-tsx-broadway-screen'

// the host, OSM way/266170795, in the turned frame (origin at its SW corner), clockwise
const HOST: XY[] = [[48.67, 30.22], [48.65, 20.04], [48.63, 6.3], [48.62, -0.05], [0.0, 0.0], [0.01, 30.18], [36.01, 30.2], [48.67, 30.22]]
// the faces the screen backs onto: 47th Street from the east, round the corner, up the avenue
const BACK = offsetLeft([[48.62, -0.05], [0.0, 0.0], [0.01, 30.18]], 0.3)

const cabinet = new Part(), wall = new Part(), red = new Part()
const OFF = 3.0, R = 8 // the front's offset from the street faces, the corner radius
const XF = -OFF, YF = -OFF
const WRAP = 61.0, YN = 30.18 - 0.3 // published length; the north end, short of VOCO next door
const westLen = YN - (YF + R), arc = (Math.PI * R) / 2
const southLen = WRAP - westLen - arc
const front = rounded([[XF + R + southLen, YF], [XF, YF], [XF, YN]], R, 10)
const STRIP = 2.6 + 0.6 // the end strips, from the cabinet's ends (frame included)
const { length, rows } = wrapScreen({
  front, back: BACK, maxDepth: 3, z0: 9.5, z1: 9.5 + 27.4, topR: 4, cabinet, margin: 0.6,
  faces: [{ part: red, from: 0, to: STRIP }, { part: wall, from: STRIP, to: WRAP - STRIP }, { part: red, from: WRAP - STRIP, to: WRAP }],
})

// clearance report: the back plane and the front against the host outline
{
  const min = Math.min(...rows.map(r => signedDist(r.b, HOST)))
  const fmin = Math.min(...rows.map(r => signedDist(r.p, HOST)))
  console.log(`wrap ${length.toFixed(1)} m (47th ${southLen.toFixed(1)}, arc ${arc.toFixed(1)}, avenue ${westLen.toFixed(1)}); back plane >= ${min.toFixed(2)} m outside the host, front >= ${fmin.toFixed(2)} m`)
}

const parts = [
  { part: cabinet, material: finish('ts20-cabinet', 0x4a4f57) },
  { part: wall, material: finish('neon-20ts-white', 0xebc8da) },
  { part: red, material: finish('neon-hershey-red', 0xd2322f) },
]
await save('nyc-20-times-square-screen', '20 Times Square Screen', parts, 29.0)
