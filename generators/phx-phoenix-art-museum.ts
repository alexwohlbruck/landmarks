/**
 * Phoenix Art Museum, Phoenix, Arizona (1959, Alden B. Dow; expansions
 * 1996 and 2006 by Tod Williams Billie Tsien) — original procedural
 * geometry, CC0-1.0.
 * bun generators/phx-phoenix-art-museum.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: every wall runs
 * north–south or east–west. Anchor -112.0727346, 33.4667602, the area
 * centroid of OSM's multipolygon relation/2048105 (outer way/151494786,
 * three inner courtyards; the outer way is itself tagged building=yes,
 * so both are replaced), the only OSM building the model covers.
 *
 * Identity (from the photos below):
 *  1. A low, sprawling ring of flat-roofed planar volumes round a garden
 *     court open to the south-west, in two finishes: pale sand-coloured
 *     concrete on most of it, dark charcoal-violet stone on the tall south
 *     hall and the entrance walls.                 (p1, p3, p9, lidar)
 *  2. The east entrance off Central Avenue: a long, thin, dark-edged flat
 *     canopy oversailing a glass pavilion, at the end of a lawn.
 *                                                  (p1, p5, p6)
 *  3. The taller boxes rising out of it: the south hall (16–19 m) and the
 *     east block over the entrance (14.4 m) with a dark band.  (p1, lidar)
 *
 * Heights and plan: OSM's outline is cut into rectangles at its own
 * corners plus lidar edges, and each rectangle takes the 65th-percentile
 * USGS 3DEP lidar height inside it (AZ_MaricopaPinal_1_2020, flown 2020,
 * 1 m grid, tools/lidar.py; the ground is 4.4 m above ground_min, which is
 * a pit), snapped to the roof levels 5, 10.2, 14.4, 16.1 and 19 (the
 * measured 9.4 and 11 m roofs merged to 10.2, and 4.3/5.2 to 5, so the
 * plan reads as a few broad tiers) (scratch script cells.py; the table CELLS below). The
 * canopy's top is measured at 8.1. Mapterhorn: flat; elevation 0.
 *
 * Estimated: which volumes are dark stone (the south hall, from p9, and
 * the entrance walls, p2, p3) and which pale (p1); the east block's dark
 * band (p1); the canopy's depth (0.8 m) and the glass pavilion under it
 * (p5, p6); the cut of the plan into rectangles smooths steps under 2.6 m.
 * Left out: the sculpture garden, the lawn and its walls, the sign wall
 * on Central Avenue (p3), signs and lettering, the rooftop plant.
 *
 * Photos (evidence, Wikimedia Commons):
 *  p1 "Main entrance to Phoenix Art Museum - 19 June 2008.jpg", Chanel
 *     Wheeler, CC BY-SA 2.0, from the east across the lawn
 *     https://commons.wikimedia.org/wiki/File:Main_entrance_to_Phoenix_Art_Museum_-_19_June_2008.jpg
 *  p3 "Phoenix Art museum outside main entrance.JPG", Tomwsulcer, CC0
 *     https://commons.wikimedia.org/wiki/File:Phoenix_Art_museum_outside_main_entrance.JPG
 *  p5 "Phoenix Art Museum-4.jpg", Visitor7, CC BY-SA 3.0, the canopy
 *     https://commons.wikimedia.org/wiki/File:Phoenix_Art_Museum-4.jpg
 *  p6 "Phoenix Art Museum-3.jpg", Visitor7, CC BY-SA 3.0, the pavilion
 *     https://commons.wikimedia.org/wiki/File:Phoenix_Art_Museum-3.jpg
 *  p9 "Phoenix, AZ, McDowell Street and Central Ave. Phoenix Art Museum
 *     Service Area" (Commons), Chris English, CC BY-SA 3.0, the dark stone
 *     hall seen through glass
 * No look-only sources. No commercial imagery.
 * Doubts: the west and north faces are unphotographed in the photos used;
 * their finish is assumed pale.
 *
 * Night: the entrance pavilion's glass is `window` and glows.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'

const ID = 'phx-phoenix-art-museum'
type XY = [number, number]
const pale = new Part(), stone = new Part(), roof = new Part(), win = new Part()
const P = (x: number, y: number, z: number): V3 => [x, y, z]
function box(wall: Part, cap: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4]
    wall.quad(P(a[0], a[1], z0), P(b[0], b[1], z0), P(b[0], b[1], z1), P(a[0], a[1], z1))
  }
  cap.quad(P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1))
  if (z0 > 0) cap.quad(P(x0, y0, z0), P(x0, y1, z0), P(x1, y1, z0), P(x1, y0, z0))
}

// [x0, y0, x1, y1, roof height] in the anchor frame (see header)
const CELLS: [number, number, number, number, number][] = [
  [-78.9, 59.1, -56.6, 87.2, 5.0], [-72.9, -83.5, -56.6, -10.3, 10.2], [-72.9, 13.3, -67.9, 59.1, 10.2], [-67.9, -10.3, -65.0, 59.1, 10.2],
  [-65.0, 10.2, -49.8, 59.1, 10.2], [-56.6, -68.7, -53.5, -10.3, 10.2], [-56.6, 59.1, -34.4, 71.6, 10.2], [-56.6, 71.6, -49.8, 87.2, 5.0],
  [-53.5, -68.7, -34.4, -65.7, 5.0], [-53.5, -65.7, -34.4, -40.1, 10.2], [-53.5, -40.1, -49.8, 2.4, 5.0], [-49.8, -14.0, -42.9, 6.0, 5.0],
  [-49.8, 13.3, -42.9, 59.1, 10.2], [-42.9, -7.0, -38.3, 10.2, 5.0], [-42.9, 10.2, -38.3, 59.1, 10.2], [-38.3, 2.4, -34.4, 59.1, 10.2],
  [-34.4, -68.7, -31.1, -40.1, 16.1], [-34.4, -40.1, -31.1, -36.5, 5.0], [-34.4, 2.4, -21.6, 48.5, 10.2], [-31.1, -75.7, -7.0, -58.6, 16.1],
  [-31.1, -58.6, -19.0, -43.0, 19.0], [-31.1, -43.0, -19.0, -36.5, 16.1], [-21.6, 10.2, -19.0, 55.6, 10.2], [-19.0, -58.6, -7.0, -36.5, 16.1],
  [-19.0, 10.2, 20.6, 13.3, 5.0], [-19.0, 13.3, 3.4, 17.0, 10.2], [-19.0, 29.6, -13.0, 55.6, 10.2], [-13.0, 17.0, 3.4, 55.6, 10.2],
  [-7.0, -80.0, 3.4, -36.5, 16.1], [3.4, -58.6, 10.3, -53.0, 0], [3.4, -53.0, 10.3, -36.5, 10.2], [3.4, 13.3, 20.6, 29.6, 5.0],
  [3.4, 29.6, 40.7, 55.6, 10.2], [10.3, -65.7, 74.7, -58.6, 5.0], [10.3, -58.6, 71.0, -40.1, 10.2], [10.3, -40.1, 16.6, -28.0, 14.4],
  [10.3, -28.0, 71.0, -25.0, 10.2], [16.6, -40.1, 71.0, -36.5, 10.2], [16.6, -36.5, 23.6, -28.0, 14.4], [16.6, 55.6, 48.9, 59.1, 10.2],
  [20.6, 10.2, 23.6, 17.0, 0], [23.6, -36.5, 71.0, -28.0, 10.2], [23.6, 10.2, 40.7, 17.0, 10.2], [23.6, 17.0, 48.9, 29.6, 5.0],
  [40.7, -25.0, 60.0, -17.7, 5.0], [40.7, -17.7, 48.9, 17.0, 10.2], [40.7, 29.6, 48.9, 43.2, 5.0], [40.7, 43.2, 48.9, 55.6, 10.2],
  [48.9, -17.7, 78.5, -10.3, 10.2], [48.9, -10.3, 74.7, 17.0, 14.4], [48.9, 17.0, 86.6, 37.0, 10.2], [48.9, 37.0, 71.0, 55.6, 5.0],
  [71.0, -58.6, 74.7, -25.0, 5.0], [71.0, 37.0, 74.7, 43.2, 5.0], [71.0, 43.2, 89.2, 48.5, 10.2], [71.0, 48.5, 74.7, 55.6, 5.0],
  [74.7, -10.3, 78.5, -7.0, 14.4], [74.7, 37.0, 86.6, 43.2, 10.2], [74.7, 48.5, 89.2, 55.6, 10.2],
]

// the entrance canopy's extent (lidar 8.1 over open ground, p1)
const CAN = { x0: 74.7, x1: 89.2, y0: 17.4, y1: 55.6, top: 8.1 }
for (const [x0, y0, x1, y1, h] of CELLS) {
  if (h <= 0) continue
  // the part under the canopy is open: clip it at the pavilion's back wall
  const xe = y0 >= CAN.y0 - 0.5 && y1 <= CAN.y1 + 0.5 && x1 > CAN.x0 ? CAN.x0 : x1
  if (xe - x0 < 0.5) continue
  const dark = h >= 16
  box(dark ? stone : pale, roof, x0, y0, xe, y1, 0, h)
}
// the east block's dark band (p1), round the 14.4 m block
for (const [x0, y0, x1, y1, h] of CELLS) {
  if (h !== 14.4) continue
  const o = 0.08
  stone.quad(P(x0 - o, y0 - o, h - 3.2), P(x1 + o, y0 - o, h - 3.2), P(x1 + o, y0 - o, h - 1.6), P(x0 - o, y0 - o, h - 1.6))
  stone.quad(P(x1 + o, y0 - o, h - 3.2), P(x1 + o, y1 + o, h - 3.2), P(x1 + o, y1 + o, h - 1.6), P(x1 + o, y0 - o, h - 1.6))
  stone.quad(P(x1 + o, y1 + o, h - 3.2), P(x0 - o, y1 + o, h - 3.2), P(x0 - o, y1 + o, h - 1.6), P(x1 + o, y1 + o, h - 1.6))
  stone.quad(P(x0 - o, y1 + o, h - 3.2), P(x0 - o, y0 - o, h - 3.2), P(x0 - o, y0 - o, h - 1.6), P(x0 - o, y1 + o, h - 1.6))
}
// the canopy: a thin slab with a dark fascia, a pale soffit
box(stone, roof, CAN.x0 - 0.2, CAN.y0, CAN.x1, CAN.y1, CAN.top - 0.8, CAN.top)
// the glass pavilion under it, and two dark stone piers (p5, p6)
box(win, roof, CAN.x0, 24, 80.5, 49, 0, CAN.top - 0.8)
box(stone, stone, 80.5, 30, 82, 33, 0, CAN.top - 0.8)
box(stone, stone, 80.5, 41, 82, 44, 0, CAN.top - 0.8)

// ── Write ───────────────────────────────────────────────────────────────
const parts: { part: Part; material: Swatch }[] = [
  { part: pale, material: finish('pam-concrete', 0xddd3c4) },
  { part: stone, material: finish('pam-stone', 0x6e6870) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
]
const used = parts.filter((p) => p.part.triangles > 0)
const triangles = used.reduce((s, p) => s + p.part.triangles, 0)
if (used.length > 6) throw new Error(`${ID}: ${used.length} materials`)
if (triangles > 5000) throw new Error(`${ID}: ${triangles} triangles`)
const glb = writeGlb('Phoenix Art Museum', used, {
  license: 'CC0-1.0',
  frame: 'Y up, -Z north, +X east, metres; origin on the ground at the outline centroid (-112.0727346, 33.4667602); bearing 0',
})
if (glb.length > 250_000) throw new Error(`${ID}: ${glb.length} bytes`)
const out = new URL(`../models/${ID}.glb`, import.meta.url).pathname
await Bun.write(out, glb)
console.log(used.map((p) => `${p.material.name}: ${p.part.triangles}`).join(', '))
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
