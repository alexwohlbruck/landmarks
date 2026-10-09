/**
 * The Palazzo, Las Vegas: the 50-storey tan tower with its three wings,
 * stepped tops and wing-end pavilions, on the shopping podium with the
 * domed tempietto at the Strip corner. Procedural, CC0-1.0.
 * bun generators/lv-palazzo.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: drawn in OSM's own
 * orientation. The origin is the area centroid of the resort outline,
 * way/180584269. The Venezia tower belongs to the Venetian's outline and is
 * in lv-venetian.ts.
 *
 * Published (Wikipedia, "The Palazzo"; HKS Architects, opened 2007-08): a
 * 50-storey hotel tower, 642 ft (196 m), briefly the tallest building in
 * Nevada. OSM: way/30424125, 196 m, 53 levels.
 *
 * Measured, from OSM: the tower footprint, a north wing about 33 m wide and
 * 75 m long, a south-west wing 31 m wide and a shorter east-south-east wing,
 * meeting at a hub; the podium outline. A 6 m spike on the north end
 * (49.9, 71.3), which no photo shows, is left out. USGS NAIP (public domain): the
 * stepped roofs (leaning west in the image, so the footprint is OSM's), the
 * round tempietto at the west corner and the grey dome over the atrium.
 *
 * Photos (Wikimedia Commons):
 * - "Palazzo Las Vegas new resort dec 2007.jpg", CC BY-SA 3.0, and
 *   "Palazzo Hotel - panoramio.jpg", Alen Ištoković, CC BY 3.0: the west
 *   faces from the Strip, the north wing tallest with its pavilion, the
 *   "PALAZZO" crown at the hub, the lower south-west wing, the cream belt a
 *   third of the way up, the tempietto on the podium;
 * - "EM PALAZZO HOTEL&CASINO (2845054044).jpg", Eddie Maloney, CC BY-SA 2.0:
 *   from the north-east, the north end with its cream panel and the east
 *   wing's own pavilion;
 * - "The Palazzo at the Venetian Resort.jpg", Julian Lupyan, CC0: the hub
 *   crown and the colours, tan piers and blue-grey glass;
 * - "Looking over the Las Vegas strip from our hotel room (5202630353)",
 *   Roy Luck, CC BY 2.0: the north end close up, the belt and top band.
 *
 * Estimated: the roofs (north wing 182 m with its pavilion to the published
 * 196 m, hub crown 188 m, the other wings 172 m with pavilions to 182 m),
 * read from the photos' relative heights; the belt at 66-80 m; the podium at
 * 20 m; the tempietto (drum 20-28 m, dome to 33 m) and the atrium dome.
 * The tops are drawn flat: the "domed/arched crown pieces" the brief
 * mentions do not appear in any photo found, which all show flat-topped
 * pavilions and a pedimented hub crown. Left out: signs, lettering, the
 * unfinished St. Regis tower (a separate building), pools and gardens.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { band, chamfer, circle, dome, offset, panels, prism, save, type XY } from './lv-venetian'

const tan = new Part()
const trim = new Part()
const win = new Part()
const roof = new Part()
const cap = new Part()

const OUTLINE: XY[] = [
  [113.7, 10.5], [144.5, -67.4], [144.5, -71.9], [15.4, -69.2], [14.5, -98.6], [-125.3, -95.5], [-124.6, -82.5], [-108.9, -68.6],
  [-90.6, -70.3], [-72.0, -35.3], [-74.2, -28.0], [-79.0, -11.8], [-83.7, -9.6], [-112.0, 5.6], [-127.0, 13.3], [-107.2, 50.1],
  [-97.9, 43.8], [-93.2, 44.2], [-92.0, 49.7], [-90.9, 54.5], [-88.6, 59.0], [-83.0, 62.6], [-84.7, 67.2], [-91.4, 63.8],
  [-95.4, 71.8], [-76.1, 107.5], [-64.8, 112.8], [-46.5, 102.9], [-37.6, 114.0], [-3.3, 95.0], [2.7, 105.6], [32.7, 89.2],
  [69.0, 69.4], [92.9, 45.2],
]
const TOWER: XY[] = [
  [71.2, 65.2], [69.3, -0.4], [65.5, -7.2], [69.5, -9.3], [67.6, -12.2], [107.1, -33.9], [92.3, -61.4], [53.1, -39.3],
  [51.3, -42.0], [47.4, -39.9], [43.9, -46.4], [-11.1, -83.9], [-17.9, -74.2], [-21.8, -77.4], [-25.6, -71.4], [-22.0, -68.4],
  [-29.4, -57.7], [19.8, -25.7], [17.6, -24.6], [35.6, 8.8], [38.1, 7.4], [39.2, 65.4],
]
// The wings above the common shaft, each extended into the hub.
const N_WING: XY[] = [[37.4, -14], [68.4, -14], [71.2, 65.2], [39.2, 65.4]]
const SW_WING: XY[] = [[-29.4, -57.7], [-11.1, -83.9], [43.4, -46.7], [25.9, -21.7]]
const E_WING: XY[] = [[48.8, -36.9], [92.3, -61.4], [107.1, -33.9], [63.3, -9.8]]
const HUB: XY[] = [[19.8, -25.7], [35.6, 8.8], [38.1, 7.4], [67.6, -12.2], [53.1, -39.3], [43.9, -46.4]]
// Wing-end pavilions, 16 m deep.
const N_PAV: XY[] = [[38.9, 49.4], [70.7, 49.2], [71.2, 65.2], [39.2, 65.4]]
const SW_PAV: XY[] = [[-29.4, -57.7], [-11.1, -83.9], [2.4, -75.4], [-15.9, -49.2]]
const E_PAV: XY[] = [[78.7, -53.0], [92.3, -61.4], [107.1, -33.9], [93.5, -25.5]]

const PODIUM = 20
const BAY = { bay: 6.5, pier: 3, minLen: 6 }

// The three wing ends are solid: tan piers round a broad cream panel, no
// glass (photos from the Strip and from the north-east).
const ENDS: [XY, XY][] = [[[71.2, 65.2], [39.2, 65.4]], [[-29.4, -57.7], [-11.1, -83.9]], [[92.3, -61.4], [107.1, -33.9]]]
const offEnd = (a: XY, b: XY) => !ENDS.some(([p, q]) => {
  const L = Math.hypot(q[0] - p[0], q[1] - p[1]), u = [(q[0] - p[0]) / L, (q[1] - p[1]) / L]
  const d = (r: XY) => Math.abs((r[0] - p[0]) * u[1] - (r[1] - p[1]) * u[0])
  return d(a) < 1.5 && d(b) < 1.5
})
/** Tan wall with glass in tall groups between z0 and z1. */
function glazed(poly: XY[], z0: number, z1: number, group = 22) {
  prism(tan, null, poly, z0, z1)
  panels(win, poly, z0 + 1.5, z1 - 1, { ...BAY, group, gap: 1.6, keep: offEnd })
}
/** The cream top band with one row of windows, a cornice and a white roof. */
function crown(poly: XY[], z0: number, z1: number) {
  prism(trim, trim, poly, z0, z1)
  panels(win, poly, z0 + 2, z1 - 2.5, { ...BAY, pier: 3.4 })
  band(trim, trim, poly, z1 - 1, z1 + 0.4, 0.5)
}

// ---- podium, 20 m, cream stone, a hair inside the outline.
prism(trim, trim, offset(OUTLINE, -0.3), 0, PODIUM)
// The atrium dome on the podium roof.
dome(roof, -77.2, 48.8, 7.5, PODIUM, 4.5, 14, 3)
// The tempietto at the Strip corner: a round base, a ring of columns round a
// dark drum, an entablature and a pale green dome.
{
  const cx = -100.5, cy = 60
  prism(trim, trim, circle(cx, cy, 8.5, 14), 0, PODIUM + 0.6)
  prism(win, null, circle(cx, cy, 5.2, 12), PODIUM, 27.5)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    prism(trim, null, circle(cx + Math.cos(a) * 6.6, cy + Math.sin(a) * 6.6, 0.55, 6), PODIUM + 0.6, 27.5)
  }
  prism(trim, trim, circle(cx, cy, 7.6, 14), 27.5, 29)
  dome(cap, cx, cy, 7, 29, 4.6, 14, 3)
}

// ---- the tower: a common shaft to 160 m with the cream belt at 66-80 m.
const body = chamfer(TOWER, 0.6)
glazed(body, PODIUM, 66)
prism(trim, null, body, 66, 80)
panels(win, body, 70, 76, { ...BAY, pier: 3.6 })
band(trim, null, body, 79.4, 80.4, 0.35)
band(trim, null, body, 65.6, 66.6, 0.35)
glazed(body, 80, 160, 26.7)
prism(trim, trim, body, 159.8, 160) // the ledge where the tops step back
// The north wing rises highest; the others stop at 172 m.
glazed(chamfer(N_WING, 0.5), 160, 170, 10)
crown(chamfer(N_WING, 0.5), 170, 182)
crown(chamfer(SW_WING, 0.5), 160, 172)
crown(chamfer(E_WING, 0.5), 160, 172)
// The hub crown, the pedimented "PALAZZO" block.
glazed(chamfer(HUB, 0.5), 160, 182, 22)
prism(trim, trim, chamfer(HUB, 0.5), 182, 188)
band(trim, trim, chamfer(HUB, 0.5), 187, 188.6, 0.6)
// Wing-end pavilions, a little proud, with a cream panel up the end face.
function pavilion(p0: XY[], z0: number, top: number, end: [XY, XY]) {
  const p = chamfer(offset(p0, 0.3), 0.5)
  glazed(p, z0, top - 10, Math.min(22, top - 10 - z0))
  crown(p, top - 10, top)
  // The cream strip on the end face, full height of the pavilion.
  const [a, b] = end
  const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const n: XY = [u[1], -u[0]]
  const o = (s: number, t: number): XY => [m[0] + u[0] * s + n[0] * t, m[1] + u[1] * s + n[1] * t]
  // n points outward when the end runs counter-clockwise round the pavilion.
  prism(trim, trim, [o(-7, -0.2), o(7, -0.2), o(7, 0.75), o(-7, 0.75)], PODIUM, top - 10)
}
pavilion(N_PAV, 160, 196, [[71.2, 65.2], [39.2, 65.4]])
pavilion(SW_PAV, 160, 182, [[-29.4, -57.7], [-11.1, -83.9]])
pavilion(E_PAV, 160, 182, [[92.3, -61.4], [107.1, -33.9]])
// The pavilions' lower shafts carry the strip from the podium; the shaft
// itself is the body, so only the strip is added below 160 m.

await save('lv-palazzo', 'The Palazzo', [
  { part: tan, material: finish('palazzo-tan', 0xd9bb93) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: cap, material: PALETTE.copper },
], 196, 'Y up, -Z north, +X east, metres; origin at the way/180584269 centroid; bearing 0', 5000)
