/**
 * Our Lady of the Lake University, the Main Building, 411 SW 24th Street, San
 * Antonio, Texas (begun 1895, Victorian Gothic, buff brick with white stone
 * trim): a four-storey east range with steep gabled bays, round corner
 * turrets under silver conical caps, a Gothic entrance porch and a slate
 * mansard roof with dormers; a lower west wing behind it.
 * Original procedural geometry, CC0-1.0.   bun generators/sat-our-lady-of-the-lake.ts
 *
 * Identity: OSM maps the Main Building (way/912208746) and the Sacred Heart
 * Conventual Chapel with the campus's tall spire (way/912208751) as separate
 * buildings 6 m apart, so they are two models: this one and
 * sat-ollu-sacred-heart-chapel.
 *
 * Frame: bearing 0. x east, y north, z up, metres. Drawn in the lidar grid's
 * frame (centre -98.54376, 29.42596) and shifted by (-4.17, -24.59) so the
 * origin is the area centroid of way/912208746 (-98.543717, 29.426182).
 *
 * Ground: the ground round it is flat (lidar 1.2-2.0 over its ground_min),
 * but the map's terrain (Mapterhorn) dips about 1.4 m under the footprint
 * and the map puts y = 0 there; heights below are lidar less 1.6 (over the
 * street), lifted 1.4 m, the walls running down to y = 0. Elevation 0.
 *
 * Evidence
 * - OSM way/912208746 (building=university, "Main Building"): drawn as its
 *   east range, simplified to three blocks within the outline (x 3.4..34.8,
 *   y -13.2..55), with the two round turrets on the east face, and the west
 *   wing (x -35..8.6, y 13.9..44.4).
 * - USGS 3DEP lidar USGS_LPC_TX_Central_B2_2017_LAS_2019 (2017), 1 m grid
 *   (~/landmarks-scratch/satx/work/sat-our-lady-of-the-lake/lidar.json), less
 *   1.6: the east range's eaves about 16.5 and its roof 18-20 (peaks 22 on
 *   the gables), the turret tops 25; the west wing 10.2-15.2.
 * - Photos (Wikimedia Commons), EVIDENCE: "OLLU1.JPG" (Zereshk, CC BY 3.0):
 *   the east front's south half: the round turret with its conical cap, the
 *   twin pointed arches of the porch, the gabled bays with pointed windows,
 *   the belt courses, buff brick and white trim; "Our Lady of the Lake
 *   University, San Antonio, Texas.jpg" (Zereshk, CC BY 3.0): the north end
 *   behind the trees.
 *
 * Estimated: the bay and window rhythm (a panel per bay and storey pair),
 * the gables' positions, the west wing (no photo); the mansard's form.
 *
 * Night: the windows glow; the porch and turrets softly floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, offset, flat, lathe, ccw, report, writeGlb, type XY } from './sf-de-young'
import { shift } from './sf-opera-house'
import { onWall, rectPts, lancetPts, block } from './sat-san-fernando-cathedral'

const brick = new Part(), white = new Part(), roof = new Part(), metal = new Part(), win = new Part(), door = new Part()

const EAST: XY[] = [[3.0, -10.0], [5.5, -13.4], [9, -13.5], [12.1, -11], [12.3, -9.1], [28.1, -11], [29.5, 0.6], [23.4, 1.3], [24.8, 13.0],
  [26.8, 17.2], [24.8, 17.4], [25.2, 21.9], [27.4, 21.7], [27.9, 29.2], [27.8, 37.3], [33.8, 36.6], [35.1, 48], [34.3, 49], [18.5, 50.6],
  [18.7, 52.5], [16.8, 55.2], [13.1, 55.6], [10.1, 53.2], [8.6, 39.7], [8.5, 13.9], [7.6, 5.9], [9.3, 5.7], [9.0, 3.2], [5.6, 3.6], [4.4, 2.9]]
const WEST: XY[] = [[8.6, 39.7], [-34.2, 44.4], [-35.2, 35.6], [-32.2, 35.3], [-34.1, 18.6], [8.5, 13.9]]

const ccwR = (r: XY[]) => ccw(r)
/** Walls to z1, then a mansard that steps in `d` and rises to a flat top at z2. */
function mansard(ring: XY[], z1: number, z2: number, d: number) {
  prism(brick, ring, 0, z1, null)
  prism(white, offset(ring, 0.35), z1 - 0.5, z1, white)
  const top = offset(ring, -d), n = ring.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    roof.quad([...ring[i], z1], [...ring[j], z1], [...top[j], z2], [...top[i], z2])
  }
  flat(roof, top, z2)
}
// the east range as three blocks (the outline's notches dropped): the mansard steps in cleanly on each
const R = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const BLOCKS = [R(3.4, -13.2, 28.8, 1.0), R(8.5, 1.0, 26.0, 55.0), R(26.0, 37.0, 34.8, 48.8)]
for (const b of BLOCKS) mansard(b, 16.5, 19.6, 2.2)
mansard(ccwR(WEST), 10.6, 13.8, 2.0)

// windows: a panel per bay and storey pair, round the walls
function windows(ring: XY[], storeys: [number, number][], step = 3.6) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 3.5) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    // outward test for this ring's winding: a point a little out must lie outside
    const k = Math.max(1, Math.round(L / step)), d = L / k
    for (let j = 0; j < k; j++) {
      const s = d * (j + 0.5)
      // onWall measures along (-n.y, n.x) from `at`; that is u or -u
      const sg = -n[1] * u[0] + n[0] * u[1]
      for (const [z0, z1] of storeys) onWall(win, a, n, lancetPts(sg * s, 1.1, z0, z1, 3), 0.06)
    }
  }
}
for (const b of BLOCKS) windows(b, [[1.2, 6.8], [8.2, 14.6]])
windows(ccwR(WEST), [[1.0, 4.4], [5.6, 9.6]])

// gabled bays on the east face, standing above the mansard, white-edged
for (const [x, y0, y1] of [[28.8, -10.5, 0.6], [34.8, 37.6, 48.2], [26.0, 22.0, 28.8]] as [number, number, number][]) {
  const yc = (y0 + y1) / 2, h = (y1 - y0) / 2
  const P = (y: number, z: number, o: number): V3 => [x + o, y, z]
  brick.tri(P(y0, 16.5, 0), P(y1, 16.5, 0), P(yc, 16.5 + h * 0.9, 0))
  roof.quad(P(y0, 16.5, 0.3), P(yc, 16.5 + h * 0.9, 0.3), P(yc, 16.5 + h * 0.9, -4), P(y0, 16.5, -4))
  roof.quad(P(yc, 16.5 + h * 0.9, 0.3), P(y1, 16.5, 0.3), P(y1, 16.5, -4), P(yc, 16.5 + h * 0.9, -4))
  white.quad(P(y0, 16.4, 0.35), P(yc, 16.5 + h * 0.9 - 0.1, 0.35), P(yc, 16.5 + h * 0.9 + 0.35, 0.35), P(y0, 16.85, 0.35))
  white.quad(P(yc, 16.5 + h * 0.9 - 0.1, 0.35), P(y1, 16.4, 0.35), P(y1, 16.85, 0.35), P(yc, 16.5 + h * 0.9 + 0.35, 0.35))
  onWall(win, [x, 0], [1, 0], lancetPts(yc, 1.4, 17.0, 16.5 + h * 0.6, 3), 0.06)
}
// round turrets with silver conical caps
for (const [cx, cy, r] of [[26.0, 12.5, 2.1], [28.0, 27.2, 2.3]]) {
  lathe(brick, [[r, 0], [r, 20.5]], 12, [cx, cy])
  lathe(white, [[r, 20.5], [r + 0.3, 20.7], [r + 0.3, 21.1]], 12, [cx, cy])
  lathe(metal, [[r + 0.3, 21.1], [0, 25.6]], 12, [cx, cy])
  for (let k = -1; k <= 1; k++) {
    const a = (k * Math.PI) / 4, n: XY = [Math.cos(a), Math.sin(a)]
    for (const [z0, z1] of [[8.2, 12.4], [14.0, 18.6]]) onWall(win, [cx, cy], n, rectPts(-0.35, 0.35, z0, z1), r - 0.02)
  }
}
// the Gothic entrance porch: twin pointed arches between the turrets, and steps
{
  const x0 = 25.2, x1 = 28.0, y0 = 17.8, y1 = 21.8
  block(white, x0, x1, y0, y1, 0, 5.2, 0.12, white)
  roof.tri([x1, y0, 5.2], [x1, y1, 5.2], [x1, (y0 + y1) / 2, 7.2])
  for (const d of [-1.0, 1.0]) onWall(door, [x1, 0], [1, 0], lancetPts((y0 + y1) / 2 + d, 1.4, 0, 4.0, 3), 0.06)
  for (let k = 0; k < 4; k++) block(white, x1, x1 + 2.8 - k * 0.7, y0 + 0.4, y1 - 0.4, 0, 0.3 * (k + 1), 0)
}

// ---------------------------------------------------------------------------
const all = [brick, white, roof, metal, win, door]
// lift everything above the base by G (see Ground); the walls run down to y = 0
const G = 1.4
for (const p of all) for (let i = 1; i < p.pos.length; i += 3) if (p.pos[i] > 0.001) p.pos[i] += G
shift(all, -4.17, -24.59)
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.05 : n[0] > 0.5 ? 0.4 : 0.15)
const parts = [
  { part: brick, material: { ...finish('ollu-buff-brick', 0xdccb9f), floodlight: lit } },
  { part: white, material: { ...finish('ollu-white-stone', 0xf2efe6), floodlight: lit } },
  { part: roof, material: { ...PALETTE.roof, color: 0x8c9499 } },
  { part: metal, material: finish('ollu-silver-roof', 0xc3c8ca) },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('ollu-door', 0x6b4a3a) },
]
const glb = writeGlb('Our Lady of the Lake University Main Building', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [29.426182, -98.543717],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/912208746'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('OLLU Main Building', parts, glb, 5000)
const out = new URL('../models/sat-our-lady-of-the-lake.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
