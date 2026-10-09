/**
 * David Geffen Hall, Lincoln Center — procedural, CC0-1.0, no textures.
 * bun generators/nyc-david-geffen-hall.ts
 *
 * Map frame: x = model east (Columbus Avenue), y = model north (West 65th
 * Street), z up, metres. Placed at bearing 29°, the Manhattan grid. Anchor:
 * area centroid of the OSM outline way/265354527. The plaza front faces
 * south (−y).
 *
 * Identifying features (from the photos):
 * 1. A travertine box under a thin flat roof slab, ringed by tall slender
 *    flat-faced columns, tapering slightly towards the foot, carrying the
 *    flat slab: square-headed bays, nothing arched.
 * 2. On the plaza front the columns stand free, ten across, in front of a
 *    recessed glass wall (the lobby, re-glazed in 2022), one tall pane a bay.
 * 3. On the sides and back the columns are engaged, with tall dark windows
 *    between them over a lower storey.
 * 4. The plain auditorium box showing above the roof.
 *
 * Evidence
 * - OSM way/265354527 (outline, 59 × 79 m), parts 1475173701 (the ring,
 *   24 m) and 330177539 (the auditorium, 27.4 m).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), resampled in the model frame
 *   (/tmp/city/nyc/work/lc/rot.py), above the West 65th Street sidewalk
 *   (22.05 m NAVD88): the plaza in front 2.9 m; the roof slab 24.3 m to the
 *   outline on every side; the auditorium box 29.5 m over x −20…19.5,
 *   y −21…34. The flight predates the 2022 renovation (Diamond Schmitt;
 *   Tod Williams Billie Tsien), which kept the colonnade and the massing;
 *   the 2023–24 photos below confirm the exterior.
 * - Published: Max Abramovitz, 1962, as Philharmonic Hall; renamed 2015;
 *   rebuilt inside 2019–22 (Wikipedia).
 * - Photos (Wikimedia Commons, daylight): the plaza front head-on (D.
 *   Benjamin Miller, CC0, March 2024), the front and east side (Thomas J.
 *   Bickerton II, CC BY-SA 4.0), the east and west sides (Epicgenius, CC
 *   BY-SA 4.0); /tmp/city/nyc/work/nyc-david-geffen-hall/photos/credits.txt.
 *
 * Measured from the head-on photo, scaled to the 59.4 m front: the slab
 * 1.5 m deep, its top 21.5 m above the plaza (lidar 21.4); ten columns at
 * 6.4 m, drawn 1.5 m wide at the foot and 1.9 m under the slab (measured about 1.3–1.7 m) (drawn
 * square-headed; the slight curve of the soffit is left out). Estimated:
 * the loggia's depth (4 m), the columns' depth, the side bays (12 at the
 * front's 6.4 m rhythm along the 79 m sides, 9 on the back), the side
 * windows' storey split. No licensed photo of the 65th
 * Street (north) front was found; it carries the side treatment. The plaza
 * and the fountain are not modelled.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { finishModel, massing, type XY } from './nyc-570-lexington'
import { cube, face } from './nyc-met-opera'

/**
 * A tapering column: a loft of rectangles `levels` = [z, half-width along
 * the facade, half-depth], centred on (cx, cy); `along` is the facade axis.
 */
export function taperCol(p: Part, cx: number, cy: number, along: 'x' | 'y', levels: [number, number, number][]) {
  const rings = levels.map(([z, a, b]) => {
    const hx = along === 'x' ? a : b, hy = along === 'x' ? b : a
    return [[cx - hx, cy - hy, z], [cx + hx, cy - hy, z], [cx + hx, cy + hy, z], [cx - hx, cy + hy, z]] as V3[]
  })
  p.loft(rings)
}

function build() {
  const stone = new Part(), win = new Part(), door = new Part(), roof = new Part(), shade = new Part(), trim = new Part()

  const X0 = -29.7, X1 = 29.7, YF = -39.5, YB = 39.4
  const PLAZA = 2.9, TOP = 24.3, SLAB = TOP - 1.5, AUD = 29.5
  const YG = YF + 4.0      // the front glass wall
  const IN = 0.8           // the side fins' depth

  // The body behind the colonnade, under the slab.
  massing({
    wall: stone, win: null, roof, coping: stone, facade: null, bevel: 0.3,
    boxes: [[X0 + IN, YG, X1 - IN, YB - IN, SLAB]],
  })
  // The roof slab over the whole outline, and the auditorium box above it.
  cube(stone, X0, YF, X1, YB, SLAB, TOP, true)
  roof.quad([X0 + 0.4, YF + 0.4, TOP + 0.03], [X1 - 0.4, YF + 0.4, TOP + 0.03], [X1 - 0.4, YB - 0.4, TOP + 0.03], [X0 + 0.4, YB - 0.4, TOP + 0.03])
  massing({ wall: stone, win: null, roof, coping: stone, facade: null, bevel: 0.4, boxes: [[-20, -21, 19.5, 34, AUD]] })

  // The column profile: a flat-faced pier, tapering slightly towards its foot.
  const prof = (z0: number, w0: number, d: number): [number, number, number][] => [
    [z0, w0, d], [SLAB + 0.02, w0 + 0.2, d],
  ]

  // The plaza front: ten free columns, the glass wall 4 m behind.
  const n = 10, pitch = (X1 - X0 - 1.6) / (n - 1)
  const cols = Array.from({ length: n }, (_, k) => X0 + 0.8 + k * pitch)
  for (const x of cols) taperCol(stone, x, YF + 0.8, 'x', prof(0, 0.75, 0.8))
  // The glass wall: one tall recessed pane per bay, from the plaza to the slab.
  const g = face([X0, YG], [X1, YG])      // facing −y; s runs west → east
  for (let k = 0; k < n - 1; k++) g.rect(win, cols[k] - X0 + 0.3, cols[k + 1] - X0 - 0.3, PLAZA, SLAB - 0.4, 0.06)
  // The loggia's floor, a plinth down to y = 0 under the colonnade.
  cube(stone, X0 + 0.02, YF + 0.02, X1 - 0.02, YG, 0, PLAZA)

  // Sides and back: the same colonnade, engaged, at the front's 6.4 m
  // rhythm (12 bays on the long sides, 9 on the back), each column a bold
  // flat-faced pier 1.5 m wide standing 0.8 m proud, glass between.
  const side = (a: XY, b: XY, bays: number) => {
    const f = face(a, b), p = f.L / bays
    for (let k = 1; k < bays; k++) {
      const c = f.at(k * p, 0, IN / 2)
      taperCol(stone, c[0], c[1], Math.abs(f.n[0]) > 0.5 ? 'y' : 'x', prof(0, 0.75, IN / 2 + 0.02))
    }
    for (let k = 0; k < bays; k++) {
      const s0 = k * p + 1.0, s1 = (k + 1) * p - 1.0
      f.rect(win, s0, s1, 2.0, 7.0, 0.06)
      f.rect(win, s0, s1, 8.6, SLAB - 1.0, 0.06)
    }
  }
  side([X1 - IN, YG], [X1 - IN, YB - IN], 12)   // east (Columbus Avenue)
  side([X0 + IN, YB - IN], [X0 + IN, YG], 12)   // west
  side([X1 - IN, YB - IN], [X0 + IN, YB - IN], 9) // north (65th Street)
  // The back corners.
  for (const [x, y] of [[X0 + 0.8, YB - 0.8], [X1 - 0.8, YB - 0.8]] as XY[]) taperCol(stone, x, y, 'x', [[0, 0.8, 0.8], [SLAB + 0.02, 0.9, 0.9]])

  finishModel('David Geffen Hall', 'nyc-david-geffen-hall', [
    { part: stone, material: finish('lincoln-travertine', 0xede6d8) },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
    { part: roof, material: PALETTE.roof },
    { part: trim, material: PALETTE.trim },
    { part: shade, material: finish('geffen-soffit', 0xd8cdbb) },
  ].filter(({ part }) => part.triangles > 0), { bearing: 29, osm: 'way/265354527', height: AUD })
}

if (import.meta.main) build()
