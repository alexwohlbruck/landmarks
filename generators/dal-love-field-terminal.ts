/**
 * Dallas Love Field terminal (rebuilt 2009–2014, Love Field Modernization
 * Program) — procedural, CC0-1.0, no textures. A plain massing model.
 *
 *   bun generators/dal-love-field-terminal.ts
 *
 * Frame: x east, y north, z up, metres, bearing 0. Anchor -96.84970
 * 32.84490, in the central hall, near the middle of the group's extent.
 *
 * The terminal is one building in several OSM ways: the gate concourse
 * (way/224697058, "Terminal Gates 1-20", a long east–west bar with its
 * spine running south to the landside), the central hall (way/25661629),
 * the two angled landside wings, baggage claim on the west (way/25661630)
 * and ticketing on the east (way/237849526 with way/744685694), the car
 * rental counters (way/303623491), and the curbside canopy along the front
 * (way/1145443237, building=roof).
 *
 * What it looks like from above (NAIP, lidar): a long gate bar with a
 * raised clerestory down its middle; a spine to the south under a raised
 * centre; the square central hall; two lower wings folding back at 45° to
 * hold the curb in a shallow V, with the canopy along it.
 *
 * Evidence
 * - OSM: the ways above, in this frame; no heights.
 * - Lidar: USGS 3DEP TX_Pecos_Dallas_B3_2018 (flown 2018, after the 2014
 *   opening), 1 m, work/dal-love-field-terminal/lidar.json; z = 0 is the
 *   apron and curb (about 2 m over ground_min). Gate bar 12.3 m with a
 *   clerestory band 16.6 m along y 108–119; spine 16.6 m in its middle,
 *   about 12 m at its sides (drawn 16.6 over its core); central hall
 *   13.8 m, its west block 17.5 m, a plant room to 27.8 m; ticketing wing
 *   10.6 m and its back strip 12 m; baggage claim 10.5 m; car rental 6.3 m;
 *   canopy 7.4 m.
 * - NAIP (USGS orthophoto via tools/usgs.py): plan and the pale roofs.
 * - Photos (Wikimedia Commons), aerials:
 *   https://commons.wikimedia.org/wiki/File:Dallas_Love_Field_(40736439252).jpg
 *     (formulanone, CC BY-SA 2.0, January 2014) oblique aerial: the T of
 *     the gate concourse and the hall, roofs bright white;
 *   https://commons.wikimedia.org/wiki/File:Dallas_Love_Field_2013.jpg
 *     (Danazar, CC BY-SA 3.0, May 2013) aerial during construction: the new
 *     concourse's white roof and its raised centre;
 *   https://commons.wikimedia.org/wiki/File:Dallas_Love_Field.jpg
 *     (Billyjayb, public domain, 2008) low approach view: the terminal row
 *     before the rebuild, for the site only.
 * - Photos, interior:
 *   https://commons.wikimedia.org/wiki/File:Main_terminal_at_Dallas_Love_Field_Airport.jpg
 *     (EEJCC, CC BY-SA 4.0) the hall: pale ceiling, long skylights;
 *   https://commons.wikimedia.org/wiki/File:Dallas_Love_Field_gate_concourse.jpg
 *     (EEJCC, CC BY-SA 4.0) the concourse: clerestory windows both sides
 *     above the gates, tall glass to the apron.
 *
 * Colours: roofs and canopy near-white (aerials, NAIP); walls white panel;
 * glass a light sky grey-blue window variant, with a continuous band of
 * clerestory glass along the concourse and spine (interior photo).
 *
 * Doubts. No licensed street-level exterior photo of the rebuilt terminal
 * was found; the aerials show roofs and plan only, so the facades are
 * invented as glass bands on pale panels. The roofs' small plant and
 * skylights are left out.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, area, capPoly, facade, finishModel, type Facade } from './nyc-570-lexington'

const wall = new Part(), win = new Part(), roof = new Part(), trim = new Part(), canopy = new Part()
const ccw = (r: XY[]) => (area(r) < 0 ? r.slice().reverse() : r)

function block(ring0: XY[], z0: number, z1: number, f: Facade | null, top: Part = roof) {
  const ring = ccw(ring0)
  for (let i = 0; i < ring.length; i++) facade(wall, f ? win : null, ring[i], ring[(i + 1) % ring.length], z0, z1 - 0.5, f)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1e-6) continue
    const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    trim.quad([a[0] + n[0] * 0.12, a[1] + n[1] * 0.12, z1 - 0.5], [b[0] + n[0] * 0.12, b[1] + n[1] * 0.12, z1 - 0.5], [b[0] + n[0] * 0.12, b[1] + n[1] * 0.12, z1], [a[0] + n[0] * 0.12, a[1] + n[1] * 0.12, z1])
  }
  capPoly(top, ring, z1)
}
const box = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

const glassFront: Facade = { bay: 9, ratio: 0.88, floor: 4.5, group: 2, spandrel: 0, sill: 1.2, head: 1.6, ground: 1.2, minLength: 5 }
const clerestory: Facade = { bay: 12, ratio: 0.96, floor: 2.4, group: 2, spandrel: 0, sill: 0.4, head: 0.5, minLength: 4 }
const lowWing: Facade = { bay: 8, ratio: 0.8, floor: 3.6, group: 2, spandrel: 0, sill: 1.4, head: 1.8, ground: 1.4, minLength: 5 }

// --- Gate concourse and spine (way/224697058) ---
const CONCOURSE: XY[] = [[-21.4,-19.2],[-21.3,-15.3],[-20.6,-15.3],[-22.5,8.1],[-33.0,8.2],[-33.4,14.6],[-36.2,14.7],[-37.7,35.2],[-39.6,63.7],[-41.6,63.7],[-43.0,82.8],[-42.7,84.0],[-50.3,91.8],[-57.8,99.6],[-54.6,102.6],[-58.6,107.1],[-64.7,107.2],[-92.6,107.5],[-128.2,108.0],[-157.0,108.4],[-157.0,107.2],[-191.2,107.5],[-192.7,107.5],[-192.7,108.4],[-197.7,108.4],[-197.7,116.8],[-198.6,116.8],[-198.2,143.8],[-160.1,143.6],[-119.9,143.1],[-82.0,142.5],[-29.7,141.8],[-29.6,139.3],[-17.5,139.2],[-15.4,141.2],[-13.1,139.1],[-0.7,138.8],[-0.6,141.2],[17.2,141.1],[94.9,140.3],[168.6,139.2],[168.6,135.9],[168.2,112.6],[167.3,112.6],[167.2,104.7],[152.3,104.9],[152.3,103.9],[126.9,104.2],[126.9,105.2],[27.3,105.9],[23.5,102.2],[12.0,90.9],[3.3,82.4],[-1.0,35.8],[2.8,10.6],[19.5,-19.5],[3.6,-19.3]]
block(CONCOURSE, 0, 12.3, glassFront)
// the clerestory down the gate bar and the raised centre of the spine
block(box(-196, 108.6, 167, 118.6), 12.3, 16.6, clerestory)
block([[-33.5, -19.2], [-3, -19.2], [-5, 20], [-7, 60], [-8, 104.5], [-36, 104.5], [-36.5, 60], [-35, 20]], 12.3, 16.6, clerestory)

// --- Central hall (way/25661629), its taller west block and plant ---
const HALL: XY[] = [[-36.2,-91.1],[-36.1,-74.9],[-84.4,-74.7],[-84.2,-54.9],[-59.7,-55.3],[-59.3,-18.7],[-21.4,-19.2],[3.6,-19.3],[19.5,-19.5],[29.7,-19.8],[36.5,-27.0],[36.2,-57.2],[35.8,-70.5],[36.4,-85.1],[35.6,-86.7],[35.5,-89.4],[31.8,-89.4],[31.7,-104.7],[16.6,-104.6],[16.6,-93.0],[5.8,-92.9],[5.7,-106.1],[-11.6,-106.1],[-11.6,-93.5],[-36.2,-93.6]]
block(HALL, 0, 13.8, glassFront)
block(box(-84.2, -74.7, -36.5, -55.1), 13.8, 17.5, lowWing)
block(box(-44, -66, -34, -54), 17.5, 27.8, null)

// --- Landside wings ---
block([[-96.9,-89.4],[-110.4,-75.5],[-158.1,-122.1],[-144.2,-136.2],[-146.6,-138.5],[-140.7,-144.4],[-138.9,-142.9],[-116.5,-165.3],[-109.9,-159.1],[-108.2,-160.6],[-100.4,-154.0],[-85.5,-139.5],[-70.2,-124.6],[-59.1,-112.5],[-68.6,-104.2],[-53.2,-90.6],[-60.5,-90.8],[-60.4,-80.8],[-66.3,-86.7],[-84.4,-86.4],[-89.2,-81.9]], 0, 10.5, lowWing)
block([[36.4,-85.1],[35.8,-70.5],[36.2,-57.2],[58.3,-57.4],[61.4,-58.6],[67.8,-52.5],[135.2,-120.9],[123.3,-132.5],[110.5,-144.9],[105.3,-139.6],[81.6,-115.3],[65.0,-98.4],[48.0,-80.9],[47.5,-80.4],[42.6,-85.2]], 0, 10.6, lowWing)
block([[67.8,-52.5],[135.2,-120.9],[138.2,-123.7],[144.0,-118.0],[70.4,-44.3],[67.2,-44.3],[62.1,-49.2],[64.2,-51.5],[58.3,-57.4],[61.4,-58.6]], 0, 12, lowWing)
block([[-59.8,-111.7],[-68.6,-104.2],[-53.2,-90.6],[-60.5,-90.8],[-60.4,-80.8],[-60.6,-74.9],[-36.1,-74.9],[-36.2,-91.1],[-38.0,-91.0],[-56.4,-108.3]], 0, 6.3, lowWing)

// --- The curbside canopy (way/1145443237): a thin roof at 6.6–7.4 m on a row of columns ---
{
  const ring = ccw([[-48.8,-102.8],[-44.2,-101.0],[-39.2,-99.6],[-34.8,-98.9],[-30.2,-98.7],[-11.6,-98.7],[-11.6,-106.1],[5.7,-106.1],[5.7,-99.0],[16.6,-99.0],[16.6,-104.6],[31.7,-104.7],[31.8,-89.4],[35.5,-89.4],[36.4,-85.1],[42.6,-85.2],[47.5,-80.4],[65.0,-98.4],[81.6,-115.3],[110.5,-144.9],[123.3,-132.5],[135.2,-120.9],[138.2,-123.7],[120.8,-140.3],[124.6,-144.1],[111.5,-156.8],[73.4,-117.8],[70.3,-114.7],[66.6,-112.4],[63.5,-111.3],[60.3,-110.8],[-30.5,-110.3],[-34.8,-110.4],[-39.1,-111.2],[-42.4,-112.5],[-45.5,-114.2],[-48.3,-116.4],[-108.2,-173.6],[-116.5,-165.3],[-109.9,-159.1],[-108.2,-160.6],[-100.4,-154.0],[-85.5,-139.5],[-70.2,-124.6],[-59.1,-112.5]])
  const z0 = 6.6, z1 = 7.4
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    trim.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  capPoly(canopy, ring, z1)
  capPoly(trim, ring, z0, false)
  // columns along the curb edge
  const curb: XY[] = [[-100, -165], [-80, -146], [-60, -127], [-40, -114], [-15, -109], [10, -109], [35, -109], [62, -112], [85, -133], [105, -152]]
  for (const [x, y] of curb) {
    const r = 0.45, sq: XY[] = [[x - r, y - r], [x + r, y - r], [x + r, y + r], [x - r, y + r]]
    for (let i = 0; i < 4; i++) {
      const a = sq[i], b = sq[(i + 1) % 4]
      trim.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], z0], [a[0], a[1], z0])
    }
  }
}

finishModel('Dallas Love Field Terminal', 'dal-love-field-terminal', [
  { part: wall, material: finish('dal-terminal-panel', 0xeceae5) },
  { part: win, material: windowVariant(2, 0xa9bfd1) },
  { part: roof, material: finish('dal-terminal-roof', 0xeef0f1) },
  { part: trim, material: PALETTE.trim },
  { part: canopy, material: finish('dal-terminal-canopy', 0xe6e9ea) },
], { bearing: 0, osm: 'way/224697058', height: 27.8 }, 5000)
