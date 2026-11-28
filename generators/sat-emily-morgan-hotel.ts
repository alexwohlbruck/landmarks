/**
 * The Emily Morgan Hotel (built 1924-1926 as the Medical Arts Building, by
 * Ralph Cameron), 705 East Houston Street, on the north corner of Alamo
 * Plaza, San Antonio, Texas. A 13-storey Gothic Revival office tower on a
 * wedge-shaped plan: a buff brick shaft with tall grouped window bays
 * between pale terra-cotta piers, an arcaded terra-cotta top with a row of
 * Gothic gables and pinnacles, a steep green-grey mansard roof behind them,
 * and the square corner tower at the west point rising above the roof to an
 * arcaded belfry, pinnacles and a lantern. A low service wing fills the
 * east corner. Original procedural geometry, CC0-1.0.
 *   bun generators/sat-emily-morgan-hotel.ts
 *
 * Frame: bearing 0. x east, y north, z up, metres. Drawn about the lidar
 * grid's centre (-98.48578, 29.42660), shifted by (1.34, 2.29) so the origin
 * is the area centroid of OSM way/79156552 (-98.485794, 29.426579).
 *
 * Ground: flat (Mapterhorn 2.6-3.4 m in the table; lidar ground 2.8-3.4 over
 * its ground_min); heights below are lidar less 2.9. Elevation 0.
 *
 * Evidence
 * - OSM way/79156552 (building=hotel, no parts): the wedge, its long south
 *   side on Houston Street, the north-west side on Avenue E, the point at the
 *   north. Its outline's small notches are simplified away.
 *   The south-east face, shared with the neighbour way/100056538, is drawn
 *   1 m inside OSM's line, so that the eaves and the map's 1.5 m coverage
 *   grid stay off the neighbour (review).
 * - USGS 3DEP lidar USGS_LPC_TX_Central_B2_2017_LAS_2019 (2017), 0.5 m grid
 *   (~/landmarks-scratch/satx/work/sat-emily-morgan-hotel/lidar.json), less
 *   2.9: the mansard's eaves 44-47, its flat top 50.8, a plant room on it to
 *   54; the tower about 6.5 m square at (-23, -8.3), its shaft to 59, the
 *   belfry and pinnacles to 64, the lantern's top 70.5 (the flagpole above is not modelled);
 *   the service wing in the east corner 5.5.
 * - Published: Wikipedia "Emily Morgan Hotel" (1924, 13 storeys, Gothic
 *   Revival, terra cotta, the gargoyles).
 * - Photos (Wikimedia Commons), EVIDENCE:
 *   "Emily Morgan Hotel, San Antonio, Texas, 2011.jpg" (Leaflet, CC BY-SA
 *     3.0): from the south-west at eye level with the roof: the wedge, the
 *     tower at the point, the buff shaft and pale top, the gabled mansard;
 *   "Emily Morgan Hotel (4762555455).jpg" (Tony Kent, CC BY-SA 2.0): the
 *     top three storeys, the arcade, the gables in the mansard, the tower's
 *     belfry;
 *   "Cenotaph & Morgan Hotel (48874537178).jpg" (Eden, Janine and Jim, CC BY
 *     2.0): the tower's stages from the plaza.
 *
 * Estimated: the bay rhythm (2.9 m, a pair of windows each) and the storey
 * groups (three storeys a panel up the shaft, per the STYLE rules); the gables' size. Bolder than
 * real: the gables and the tower's pinnacles.
 *
 * Night: the windows glow; the terra-cotta top and the tower floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, offset, flat, lathe, report, writeGlb, type XY } from './sf-de-young'
import { shift } from './sf-opera-house'
import { onWall, rectPts, roundPts, block, pyramid } from './sat-san-fernando-cathedral'

const brick = new Part(), terra = new Part(), roof = new Part(), win = new Part(), low = new Part()

const H: XY[] = [[-26, -9], [-22, -11.7], [13.8, -17.17], [17.1, -10.57], [6, -4.5], [5.5, 14.5], [-0.3, 20.2], [-26, -6.5]]
const EAVE = 45.5, TOP = 50.8, SHAFT = 36.5
prism(brick, H, 0, SHAFT, null)
prism(terra, H, SHAFT, EAVE, null)
prism(terra, offset(H, 0.35), SHAFT - 0.4, SHAFT + 0.1, terra) // a band at the base of the top
prism(terra, offset(H, 0.4), EAVE - 0.4, EAVE, terra) // the eaves' cornice
// the mansard, steep, to a flat top; the plant room on it
const T = offset(H, -2.4)
for (let i = 0; i < H.length; i++) {
  const j = (i + 1) % H.length
  roof.quad([...H[i], EAVE], [...H[j], EAVE], [...T[j], TOP], [...T[i], TOP])
}
flat(roof, T, TOP)
block(terra, -4, 3, -8, -1, TOP, 54, 0.1, roof)
// the service wing in the east corner
prism(low, [[6, -4.5], [17.1, -10.57], [19.3, -5.77], [21.3, -1.67], [9, 11], [5.5, 11]], 0, 5.5, roof)

// the faces: grouped bays up the shaft, the arcade and gables at the top
for (let i = 0; i < H.length; i++) {
  const a = H[i], b = H[(i + 1) % H.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 3) continue
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  // skip the faces hidden by the service wing and the tower
  if (a[0] === 6 && a[1] === -4.5) continue
  if (a[0] === 17.1 && a[1] === -10.57) continue
  const at: XY = a, s0 = 0 // along-coordinate from a
  const nb = Math.max(1, Math.round(L / 2.9)), d = L / nb
  for (let k = 0; k < nb; k++) {
    const c = s0 + d * (k + 0.5), w = Math.min(1.7, d - 0.8)
    onWall(win, at, n, rectPts(c - w / 2, c + w / 2, 1.2, 4.6), 0.06)
    // a pair of windows per bay, three storeys to a panel, brick between
    for (const [z0, z1] of [[5.8, 15.0], [16.8, 26.0], [27.8, 35.4]]) for (const dd of [-0.42, 0.42]) onWall(win, at, n, rectPts(c + dd - 0.3, c + dd + 0.3, z0, z1), 0.06)
    onWall(win, at, n, roundPts(c, w, 37.4, 42.6, 6), 0.06)
    // piers of pale terra cotta between bays, up the shaft
    if (k > 0) onWall(terra, at, n, rectPts(s0 + d * k - 0.22, s0 + d * k + 0.22, 4.8, SHAFT), 0.12)
    // a gable dormer over every other bay, standing in the mansard
    if (k % 2 === 0 || nb < 3) {
      const P = (sv: number, z: number, o: number): V3 => {
        const t = sv - s0
        return [a[0] + u[0] * t + n[0] * o, a[1] + u[1] * t + n[1] * o, z]
      }
      const g0 = c - 1.1, g1 = c + 1.1
      terra.quad(P(g0, EAVE, 0.1), P(g1, EAVE, 0.1), P(g1, EAVE + 1.4, 0.1), P(g0, EAVE + 1.4, 0.1))
      terra.tri(P(g0, EAVE + 1.4, 0.1), P(g1, EAVE + 1.4, 0.1), P(c, EAVE + 3.0, 0.1))
      terra.quad(P(g0, EAVE, -1.2), P(g0, EAVE, 0.1), P(g0, EAVE + 1.4, 0.1), P(g0, EAVE + 1.4, -1.2))
      terra.quad(P(g1, EAVE, 0.1), P(g1, EAVE, -1.2), P(g1, EAVE + 1.4, -1.2), P(g1, EAVE + 1.4, 0.1))
      terra.quad(P(g0, EAVE + 1.4, 0.1), P(c, EAVE + 3.0, 0.1), P(c, EAVE + 3.0, -1.2), P(g0, EAVE + 1.4, -1.2))
      terra.quad(P(c, EAVE + 3.0, 0.1), P(g1, EAVE + 1.4, 0.1), P(g1, EAVE + 1.4, -1.2), P(c, EAVE + 3.0, -1.2))
      onWall(win, P(c, 0, 0.1).slice(0, 2) as XY, n, rectPts(-0.45, 0.45, EAVE + 0.2, EAVE + 1.9), 0.04)
    }
  }
}

// the corner tower at the west point
{
  const cx = -23, cy = -8.3, h = 3.3
  block(brick, cx - h, cx + h, cy - h, cy + h, 0, SHAFT, 0, null)
  block(terra, cx - h, cx + h, cy - h, cy + h, SHAFT, 56.5, 0, null)
  block(terra, cx - h - 0.3, cx + h + 0.3, cy - h - 0.3, cy + h + 0.3, 56.5, 57.1, 0.12, null)
  block(terra, cx - h + 0.3, cx + h - 0.3, cy - h + 0.3, cy + h - 0.3, 57.1, 62.2, 0, null)
  block(terra, cx - h, cx + h, cy - h, cy + h, 62.2, 62.8, 0.1)
  for (const [at, n, s] of [[[cx - h, 0], [-1, 0], -cy], [[cx + h, 0], [1, 0], cy], [[0, cy + h], [0, 1], -cx], [[0, cy - h], [0, -1], cx]] as [XY, XY, number][]) {
    onWall(win, at, n, roundPts(s, 2.2, 48.0, 54.8, 6), 0.06)
    for (const [z0, z1] of [[5.8, 15.0], [16.8, 26.0], [27.8, 35.4]]) onWall(win, at, n, rectPts(s - 0.4, s + 0.4, z0, z1), 0.06)
    const at2: XY = [at[0] - n[0] * 0.3, at[1] - n[1] * 0.3]
    for (const dd of [-1.15, 1.15]) onWall(win, at2, n, roundPts(s + dd, 1.4, 57.8, 61.6, 6), 0.06)
  }
  for (const [px, py] of [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]]) {
    block(terra, px - 0.4, px + 0.4, py - 0.4, py + 0.4, 50.5, 63.6, 0.06)
    pyramid(terra, px - 0.4, px + 0.4, py - 0.4, py + 0.4, 63.6, 65.4)
  }
  // the lantern: an octagonal drum and a small pointed cap
  lathe(terra, [[1.8, 62.8], [1.8, 66.6], [2.0, 66.8], [1.4, 68.6], [0.5, 70.0], [0, 70.5]], 8, [cx, cy], Math.PI / 8, false)
}

// ---------------------------------------------------------------------------
const all = [brick, terra, roof, win, low]
shift(all, 1.34, 2.29)
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : p[2] > 36 ? 0.85 : 0.15)
const parts = [
  { part: brick, material: finish('morgan-buff-brick', 0xdcc8a4) },
  { part: terra, material: { ...finish('morgan-terra-cotta', 0xf0e7d0), floodlight: lit } },
  { part: roof, material: finish('morgan-mansard', 0x8e9a8c) },
  { part: win, material: PALETTE.window },
  { part: low, material: finish('morgan-service-brick', 0xcdb999) },
]
const glb = writeGlb('Emily Morgan Hotel', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [29.426579, -98.485794],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/79156552'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('Emily Morgan Hotel', parts, glb, 5000)
const out = new URL('../models/sat-emily-morgan-hotel.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
