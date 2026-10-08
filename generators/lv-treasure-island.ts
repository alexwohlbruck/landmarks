/**
 * Treasure Island (TI), Las Vegas: the 36-storey Y-shaped hotel tower in
 * terracotta with white-framed window stacks, arched top windows and a white
 * cornice, on its casino podium. Procedural, CC0-1.0.
 * bun generators/lv-treasure-island.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: drawn in OSM's own
 * orientation. The origin is the area centroid of the resort outline,
 * way/33959894.
 *
 * Published (Wikipedia, "Treasure Island Hotel and Casino"; Joel Bergman,
 * 1993): a 36-storey tower whose plan branches three ways in a Y with the
 * elevators in the centre, modelled on the Mirage's; repainted in 2003 in
 * terra cotta ("Salmon Stream") over the earlier pink.
 *
 * Measured, from OSM: the tower (way/27727145, 112 m, 38 levels, colour
 * #B43104): a west wing 21 m wide and 75 m long and two arms to the
 * north-east and south-east, the concave side to the Strip; the podium
 * outline. USGS NAIP (public domain) confirms the Y and its grey roof.
 *
 * Photos (Wikimedia Commons):
 * - "Treasure Island Hotel Las Vegas.jpg", Markbriggs, public domain, and
 *   "Treasure Island Hotel, Las Vegas.jpg", Clément Bardot, CC BY-SA 4.0:
 *   the concave east face, terracotta walls, white-framed window stacks
 *   (about 7 m apart), the arched top row, white string course and cornice,
 *   white quoins up the arm ends;
 * - "Mirage-treasure island tram in front of treasure island.jpg", C4K3,
 *   CC BY-SA 4.0: the same from the south-west, colours in shade;
 * - "Las Vegas. Treasure Island Hotel.jpg", André Corboz, CC BY-SA 4.0: the
 *   earlier pink, for the window rhythm only.
 *
 * Estimated: the podium at 14 m; the window stacks (5.6 m apart, white
 * frame 3.4 m, glass 2.4 m in two-floor groups; the glass reads pale, sky
 * reflected, so it is a light window variant); the crown (string course
 * at 101 m, arched windows to 109 m, cornice at 112 m); quoins 2.4 m wide.
 * Left out: the TI sign, the lettering, the Sirens' Cove lagoon and ships,
 * the small stair towers at the arm ends.
 */
import { Part } from './mesh'
import { PALETTE, windowVariant } from './palette'
import { band, chamfer, offset, panels, prism, rect, save, type XY } from './lv-venetian'

const wall = new Part()
const trim = new Part()
const win = new Part()
const roof = new Part()
const base = new Part()

const OUTLINE: XY[] = [
  [-121.8, -36.5], [-112.0, -37.1], [-112.3, -42.8], [-6.9, -42.9], [-25.2, -60.0], [-26.5, -62.9], [-25.4, -66.5], [-18.3, -73.7],
  [-21.0, -76.2], [-11.2, -86.6], [-0.9, -76.2], [11.2, -68.9], [16.2, -69.0], [15.5, -88.4], [22.2, -89.0], [21.9, -95.2],
  [48.9, -96.2], [49.7, -88.7], [55.6, -88.9], [55.7, -71.9], [67.0, -82.7], [65.9, -100.1], [77.3, -106.8], [79.6, -103.7],
  [84.7, -93.2], [90.7, -83.7], [102.6, -62.3], [93.4, -54.2], [85.7, -44.2], [81.4, -34.0], [81.8, -25.8], [80.3, -18.4],
  [72.0, -16.1], [75.9, -7.1], [77.3, 4.2], [77.5, 17.3], [82.5, 22.0], [85.6, 21.4], [92.5, 27.7], [93.0, 37.4], [94.9, 46.3],
  [98.0, 48.9], [114.9, 47.5], [114.0, 41.4], [130.5, 39.8], [133.2, 34.3], [142.8, 52.5], [133.4, 61.7], [120.7, 62.1],
  [88.4, 66.7], [64.2, 68.6], [29.8, 70.0], [-12.1, 70.8], [-78.4, 71.9], [-99.3, 69.4], [-109.4, 69.4], [-109.9, 55.8],
  [-119.0, 55.8], [-119.6, 30.9], [-120.3, 11.8],
]
// way/27727145 without the small stair towers at the three ends.
const TOWER: XY[] = [
  [-111.4, 8.6], [-111.9, -12.5], [-35.7, -14.1], [16.2, -69.0], [32.3, -54.9], [-6.2, -12.8], [-6.6, 5.3],
  [34.6, 43.6], [19.9, 58.8], [6.3, 45.8], [-19.1, 21.4], [-34.8, 6.5], [-37.0, 6.4], [-77.0, 7.6],
]
const PODIUM = 14, TOP = 112, CROWN = 101

// ---- podium: the casino, low and pale.
prism(base, roof, offset(OUTLINE, -0.3), 0, PODIUM)

// ---- the tower.
const body = chamfer(TOWER, 0.5)
prism(wall, null, body, PODIUM, TOP - 1.2)
band(trim, roof, body, TOP - 1.2, TOP + 0.3, 0.6) // cornice, its top the grey roof
band(trim, null, body, CROWN - 0.6, CROWN + 0.4, 0.3) // string course under the arched row
band(trim, null, body, PODIUM + 3.4, PODIUM + 4.2, 0.3) // base course
// Window stacks: a white frame per bay from the base course to the string
// course, glass in four-floor groups on it, and an arched window in each
// bay of the crown. The arm ends keep only their white quoins.
const isEnd = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1]) < 23
const stack = { bay: 5.6, minLen: 23, end: 2.6 }
panels(trim, body, PODIUM + 4.2, CROWN - 0.6, { ...stack, pier: 2.2, out: 0.04 })
panels(win, body, PODIUM + 5, CROWN - 1.4, { ...stack, pier: 3.2, group: 6.2, gap: 1.2, out: 0.08 })
panels(trim, body, CROWN + 0.4, TOP - 2, { ...stack, pier: 2.2, out: 0.04, shape: 'arch' })
panels(win, body, CROWN + 1, TOP - 2.6, { ...stack, pier: 3.2, out: 0.08, shape: 'arch' })
// Quoins: white strips up both corners of every arm end.
{
  const r = body
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (!isEnd(a, b) || Math.hypot(b[0] - a[0], b[1] - a[1]) < 15) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const n: XY = [u[1], -u[0]]
    const deg = (Math.atan2(u[1], u[0]) * 180) / Math.PI
    // The body ring is counter-clockwise, so n points out of the face.
    for (const s of [1.3, L - 1.3]) prism(trim, trim, rect(a[0] + u[0] * s + n[0] * 0.15, a[1] + u[1] * s + n[1] * 0.15, 2.4, 0.5, deg), PODIUM, TOP - 1.2)
    // A pair of window stacks between the quoins.
    panels(win, [a, b], PODIUM + 5, CROWN - 1.4, { bay: 5.6, pier: 3.2, group: 6.2, gap: 1.2, out: 0.08, minLen: 10, end: 4.5, keep: (p) => p === a })
  }
}

await save('lv-treasure-island', 'Treasure Island', [
  { part: wall, material: PALETTE.terracotta },
  { part: trim, material: PALETTE.trim },
  { part: win, material: windowVariant(2, 0x9fb6c8) },
  { part: roof, material: PALETTE.roof },
  { part: base, material: PALETTE.stone },
], TOP, 'Y up, -Z north, +X east, metres; origin at the way/33959894 centroid; bearing 0', 5000)
