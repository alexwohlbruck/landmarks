/**
 * The San Remo, 145–146 Central Park West — procedural, CC0-1.0, no
 * textures.
 * bun generators/nyc-san-remo.ts
 *
 * Map frame: x = model east (Central Park West), y = model north (West 75th
 * Street), z up, metres. Placed at bearing 29°, the Manhattan grid. Anchor:
 * area centroid of the OSM outline way/269293207.
 *
 * Identifying features (from the photos):
 * 1. Twin square towers rising ten storeys from a broad seventeen-storey
 *    base, set back from Central Park West at its two ends.
 * 2. Each tower's crown: a stepped stage with corner pinnacles, a smaller
 *    stage, then a circular colonnaded tempietto (the Choragic Monument of
 *    Lysicrates) under a drum and a tall lantern finial.
 * 3. The base stepping back in terraces towards the top, more at its
 *    corners, on an E-shaped plan with light courts to the west.
 * 4. Pale buff limestone and brick, punched windows.
 *
 * Evidence
 * - OSM way/269293207 (outline, 45 × 61 m, E-shaped, height 122 m,
 *   25 levels); no building:part ways.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), resampled in the model frame
 *   (/tmp/city/nyc/work/lc/rot.py), above the lowest ground under the
 *   footprint (24.5 m NAVD88): the base 47 m at Central Park West stepping
 *   to 54, 57.5 and 61 m (64 m penthouses); the courts' floors 3 m; the
 *   towers about 19 m square, centred about 14 m back from Central Park
 *   West, x −4…16, y 8…26 and −24…−6, their roofs 94–96 m; the upper
 *   stages 100–104 m; the tempietto to 110 m; the finials 119 and 124 m.
 * - Published: Emery Roth, 1930, 27 storeys, 400 ft (122 m) (Wikipedia;
 *   NYC landmark, part of the Central Park West Historic District).
 * - Photos (Wikimedia Commons, daylight): from Central Park (Ed Yourdon,
 *   CC BY-SA 2.0; Bilby, CC BY 3.0; Jim.henderson, public domain), on
 *   Central Park West (Philippe Cendron, CC BY-SA 4.0; Ajay Suresh, CC BY
 *   4.0); /tmp/city/nyc/work/nyc-san-remo/photos/credits.txt.
 *
 * Estimated: the base's terraces (from the lidar and the park-side photo),
 * the window bays (3.4 m, two storeys a panel), the crown stages' sizes,
 * the tempietto's radius (3 m, from the park-side photo scaled to the
 * lidar) and its eight columns, the finial's
 * profile. The pinnacles are simple spikes; the urns, balustrades and
 * carving are left out. The rear (west) courts are drawn from OSM.
 */
import { Part } from './mesh'
import { finish, PALETTE } from './palette'
import { finishModel, massing, prism, circle, spire, type Facade, type XY } from './nyc-570-lexington'

const stone = new Part(), win = new Part(), roof = new Part(), trim = new Part(), shade = new Part(), metal = new Part()

const E = 20.3, S = -30.0, N = 31.4
const f: Facade = { bay: 3.4, ratio: 0.42, floor: 3.3, group: 2, spandrel: 2.4, sill: 1.2, head: 1.6, ground: 5.0, minLength: 5, margin: 0.8 }

// The base: an E-shaped plan in three blocks (the Central Park West bar and
// the two wings), stepping back in terraces near the top.
type B = [number, number, number, number, number]
const tiers = (i: number, z: number): B[] => [
  [3.7, S + i, E - i, N - i, z],
  [-24.8 + (i ? 2 * i : 0), S + i, 3.7, -12.3, z],
  [-21.5 + (i ? 2 * i : 0), 13.7, 3.7, N - i, z],
]
massing({
  wall: stone, win, roof, coping: trim, facade: f, bevel: 0.35,
  boxes: [
    ...tiers(0, 47), ...tiers(1.5, 54), ...tiers(3.5, 57.5),
    [-21.1, -12.3, -4.9, -4.1, 47], [-18.4, 5.5, -5.6, 13.7, 47], // the stubs between the courts
    [-10, -24, 13, -6, 61], [-10, 8, 13, 26, 61],                 // the top storeys round the towers
    [-21.1, -4.1, 3.7, 5.5, 3.2], [-4.9, -13.2, 3.7, 14.4, 3.2],  // the courts' floors
  ],
})

// The twin towers and their crowns.
const tf: Facade = { ...f, bay: 3.2, group: 2, spandrel: 2.6, head: 2.4 }
for (const cy of [-15.3, 16.9]) {
  const cx = 6, h = 9.5
  const sq = (r: number): XY[] => [[cx - r, cy - r], [cx + r, cy - r], [cx + r, cy + r], [cx - r, cy + r]]
  prism({ wall: stone, win, roof, coping: trim, ring: sq(h), z0: 61, z1: 93, facade: tf, bevel: 0.4 })
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  const pin = (x: number, y: number, r: number, z0: number, z1: number, tip: number) => {
    const p: XY[] = [[x - r, y - r], [x + r, y - r], [x + r, y + r], [x - r, y + r]]
    prism({ wall: stone, win: null, roof: null, ring: p, z0, z1, facade: null, bevel: 0.1 })
    spire(stone, p, z1, [x, y, tip])
  }
  // Stage A: a broad setback storey with corner pavilions and pinnacles.
  prism({ wall: stone, win, roof, coping: trim, ring: sq(6.8), z0: 93, z1: 98, facade: { ...tf, group: 1, ground: 1, sill: 1.4, head: 1.2, minLength: 4 }, bevel: 0.35 })
  for (const [sx, sy] of corners) pin(cx + sx * (h - 1.2), cy + sy * (h - 1.2), 1.1, 93, 96.5, 100)
  // Stage B and the pedestal, each with corner pinnacles, stepping in.
  prism({ wall: stone, win: null, roof, coping: trim, ring: sq(4.5), z0: 98, z1: 102, facade: null, bevel: 0.3 })
  for (const [sx, sy] of corners) pin(cx + sx * 6.0, cy + sy * 6.0, 0.6, 98, 100, 103)
  prism({ wall: stone, win: null, roof, coping: trim, ring: sq(3.3), z0: 102, z1: 105.5, facade: null, bevel: 0.3 })
  for (const [sx, sy] of corners) pin(cx + sx * 4.0, cy + sy * 4.0, 0.45, 102, 104, 106.5)
  // The tempietto: a ring of eight columns round a shaded core, under an
  // entablature ring, a drum and the lantern finial.
  prism({ wall: shade, win: null, roof: null, ring: circle(cx, cy, 1.8, 12), z0: 105.5, z1: 111.4, facade: null, bevel: 0.01 })
  for (let k = 0; k < 8; k++) {
    const a = (k * 2 * Math.PI) / 8 + Math.PI / 8
    prism({ wall: stone, win: null, roof: null, ring: circle(cx + 2.7 * Math.cos(a), cy + 2.7 * Math.sin(a), 0.45, 8), z0: 105.5, z1: 111.4, facade: null, bevel: 0.01 })
  }
  prism({ wall: stone, win: null, roof: trim, coping: trim, ring: circle(cx, cy, 3.3, 16), z0: 111.4, z1: 112.6, facade: null, bevel: 0.25 })
  prism({ wall: stone, win: null, roof: trim, coping: trim, ring: circle(cx, cy, 2.3, 12), z0: 112.6, z1: 115, facade: null, bevel: 0.25 })
  spire(metal, circle(cx, cy, 1.3, 10), 115, [cx, cy, cy > 0 ? 124 : 122], true)
}

finishModel('The San Remo', 'nyc-san-remo', [
  { part: stone, material: finish('san-remo-buff', 0xeadcc2) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: shade, material: finish('san-remo-shade', 0xb9ab93) },
  { part: metal, material: PALETTE.patina },
], { bearing: 29, osm: 'way/269293207', height: 124 }, 6500)
