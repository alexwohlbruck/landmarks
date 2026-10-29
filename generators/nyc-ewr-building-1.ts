/**
 * Newark Metropolitan Airport Administration Building ("Building One";
 * 1934-35, John Homlish; NRHP 1980; moved about 1 km in 2001 when a runway
 * was lengthened), now the EWR Administrative Offices, Brewster Road /
 * Conrad Road, Newark Liberty International Airport. Procedural, CC0-1.0.
 *   bun generators/nyc-ewr-building-1.ts
 *
 * The 1935 terminal is a white two-storey Streamline Moderne range with
 * grouped steel strip windows; at the middle of its courtyard front a dark
 * glazed half-drum (the first air traffic control station) rises through
 * the roof to a broad white collar and a small glazed lantern with a ribbed
 * dome, over a long dark canopy at the entrance. Since the move it stands
 * as the north range of a larger office complex: two-storey additions
 * clad in pale grey panels flank the courtyard, angle away at both ends of
 * the old range and fill a block to the south. OSM maps the whole complex
 * as one outline (way/232382759, "EWR Administrative Offices (Building
 * One)"), so the model draws all of it: the historic range in white with
 * its tower, the additions plainer and grey.
 *
 * Map frame: x east, y north (turned 1.5 degrees to the outline), z up,
 * metres; origin at the outline's centroid; bearing 1.5.
 *
 * Measured (USGS_Lidar_Point_Cloud_NJ_SdL5_2014, 0.5 m grid, flown after
 * the move): roofs 9.2-9.8 m on the old range, the angled wings and the
 * courtyard blocks; 8.3-8.9 m on the south block; the tower's top 13.1 m;
 * the open courtyard (x -13..13, y -5..17), which the OSM outline fills.
 * NAIP (2019-ish, usgs.py naip) confirms the plan, the courtyard and the
 * drum at the middle of the old range's south front.
 * Measured from photo b5 (straight on, 22.8 px per metre against the 9.4 m
 * roof): the drum 3.2 m across rising to 10.6 m, the collar 4.8 m across
 * 10.1-11.2 m, the lantern 2.2 m across to 12.6 m, the dome to 13.1 m; the
 * canopy at 4.9-5.6 m; the window groups.
 *
 * Photos:
 * - b5 "NewarkAirportAdminBldg(restored).tif", Djflem, CC BY-SA 4.0: the
 *   restored courtyard front, straight on (EVIDENCE).
 *   https://commons.wikimedia.org/wiki/File:NewarkAirportAdminBldg(restored).tif
 * - HAER NJ-133-B (Library of Congress; Peter Brandt, 2000; public
 *   domain), before the move: b1 "NORTH (LAND SIDE) AND NORTHWEST
 *   ELEVATIONS, LOOKING SOUTHEAST", b2 "SOUTH (AIR SIDE) AND SOUTHWEST
 *   ELEVATIONS, LOOKING NORTH-EAST FROM BUILDING 340 ROOF", b3 "EAST
 *   ELEVATION LOOKING WEST" (on cribbing for the move), b4 "DETAIL
 *   ELEVATION OF CONTROL TOWER NORTH ELEVATION FROM ROOF, LOOKING SOUTH"
 *   (the lantern and its dome). Commons file pages:
 *   https://commons.wikimedia.org/wiki/File:NORTH_(LAND_SIDE)_AND_NORTHWEST_ELEVATIONS,_LOOKING_SOUTHEAST._ROUTE_ONE_IN_FOREGROUND._-_Newark_International_Airport,_Administration_Building,_Brewster_Road_between_Route_21_HAER_NJ,7-NEARK.V,1B-1.tif
 *   https://commons.wikimedia.org/wiki/File:SOUTH_(AIR_SIDE)_AND_SOUTHWEST_ELEVATIONS,_LOOKING_NORTH-EAST_FROM_BUILDING_340_ROOF._PARKING_LOT_G_IN_FOREGROUND._-_Newark_International_Airport,_Administration_Building,_HAER_NJ,7-NEARK.V,1B-2.tif
 *
 * Doubts, plainly: no licensed photo of the building since the move shows
 * anything but the courtyard front (b5), so the additions' cladding is
 * read from b5's edges and NAIP, and their windows are estimated bands.
 * Which parts of the north range are 1935 fabric and which are new is not
 * certain: the straight range between the angled wings is taken as the
 * old building (about 65 m, as HAER b2 shows it long and low), the angled
 * wings as additions. The rooftop plant boxes (to 12.2 m) are left out.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, panels, clean, lathe, type XY } from './clt-terminal'

const stucco = new Part(), panel = new Part(), win = new Part(), roof = new Part(), dark = new Part(), glass = new Part()

// ------------------------------------------------------------ massing (OSM outline, lidar heights)
const HIST: XY[] = [[-31.7, 19.0], [31.3, 17.0], [33.8, 35.1], [-31.7, 35.9]]
const WING_W: XY[] = [[-31.7, 19.4], [-31.7, 35.9], [-47.0, 52.8], [-56.1, 44.0]]
const WING_E: XY[] = [[31.3, 16.9], [58.0, 43.4], [50.4, 51.5], [33.8, 35.1]]
const SIDE_W: XY[] = [[-31.0, -4.9], [-13.0, -5.2], [-13.0, 18.6], [-31.7, 19.2]]
const SIDE_E: XY[] = [[13.0, -5.5], [31.2, -5.7], [31.3, 16.9], [13.0, 17.4]]
const SOUTH: XY[] = [[-31.0, -4.6], [-38.3, -4.8], [-38.2, -18.1], [-48.6, -18.1], [-48.3, -37.0], [28.7, -38.3], [28.7, -40.3],
  [29.7, -41.9], [35.4, -44.2], [37.2, -43.7], [38.5, -41.7], [38.5, -39.0], [45.0, -38.8], [45.0, -19.5], [39.3, -19.4],
  [39.1, -15.5], [38.7, -5.7], [31.2, -5.7], [-13.0, -5.2]]

const hist = block(stucco, roof, HIST, 0, 9.5, 0.4)
for (const [ring, h] of [[WING_W, 9.5], [WING_E, 9.5], [SIDE_W, 9.5], [SIDE_E, 9.5], [SOUTH, 8.6]] as [XY[], number][]) {
  const r = block(panel, roof, ring, 0, h, 0.35)
  // additions: a window band per storey
  panels(win, r, 1.3, 3.4, { bay: 7, gap: 1.6, end: 1.5, minLen: 5 })
  panels(win, r, 5.4, 7.6, { bay: 7, gap: 1.6, end: 1.5, minLen: 5 })
}

// ------------------------------------------------------------ the 1935 range: grouped strip windows
// The courtyard front (south edge) has the drum and canopy in its middle; keep the windows clear of them.
const keepClear = (a: XY, b: XY) => true
for (const [z0, z1] of [[1.4, 3.7], [5.9, 7.7]]) {
  for (let i = 0; i < hist.length; i++) {
    const a = hist[i], b = hist[(i + 1) % hist.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const south = Math.abs(u[1]) < 0.2 && u[0] > 0
    // window groups ~5.6 m wide, 3.2 m piers; on the south front only the two groups each side of the tower show
    const step = 8.8, w = 5.6
    for (let s = 2; s + w < L - 1.5; s += step) {
      const sm = s + w / 2
      const p = (t: number): XY => [a[0] + u[0] * t, a[1] + u[1] * t]
      if (south) {
        const x = p(sm)[0]
        if (Math.abs(x) < 4.5 || Math.abs(x) > 13) continue
      }
      const P = (t: number, z: number): V3 => [p(t)[0] + n[0] * 0.05, p(t)[1] + n[1] * 0.05, z]
      win.quad(P(s, z0), P(s + w, z0), P(s + w, z1), P(s, z1))
    }
  }
}
void keepClear

// ------------------------------------------------------------ the tower, the canopy, the doors
const TX = 0, TY = 18.0 // the drum's centre, on the courtyard front
// the dark glazed half-drum, from the ground to above the roof (a full drum; its back half is inside)
lathe(dark, TX, TY, [[1.6, 0], [1.6, 10.1]], 16)
lathe(win, TX, TY, [[1.64, 6.0], [1.64, 9.0]], 16) // its upper glazing band
// the white collar and its rail-height parapet
lathe(stucco, TX, TY, [[0, 10.1], [2.4, 10.1], [2.4, 11.2], [0, 11.2]], 16)
// the lantern and its dome
lathe(glass, TX, TY, [[1.1, 11.2], [1.1, 12.5]], 12)
lathe(dark, TX, TY, [[1.2, 12.5], [1.0, 12.8], [0.6, 13.0], [0, 13.1]], 12)
// the canopy: a dark band projecting 1.5 m across the middle of the front
{
  const y0 = 18.2 - 1.6, y1 = 18.2, z0 = 4.9, z1 = 5.6, x0 = -12.5, x1 = 12.5
  const r: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  dark.loft([r, r.map(([x, y]) => [x, y, z1] as V3)])
  dark.cap(r.map(([x, y]) => [x, y, z1] as V3), true)
  dark.cap(r, false)
}
// doors under the drum
win.quad([TX - 1.6, TY - 1.65, 0], [TX + 1.6, TY - 1.65, 0], [TX + 1.6, TY - 1.65, 3.4], [TX - 1.6, TY - 1.65, 3.4])
void clean

const parts = [
  { part: stucco, material: finish('stucco-white', 0xf3f0ea) },
  { part: panel, material: finish('panel-grey', 0xcdd1d4) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: dark, material: finish('deco-dark', 0x4f555d) },
  { part: glass, material: PALETTE.glass },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Newark Airport Administration Building (Building One)', parts, {
  license: 'CC0-1.0', bearing: 1.5, elevation: 0, height: 13.1,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/232382759'],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-ewr-building-1.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
