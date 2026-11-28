/**
 * The Spanish Governor's Palace (Comandancia of the Presidio de San Antonio
 * de Béxar), 105 Plaza de Armas, San Antonio, Texas: a one-storey, flat-roofed
 * whitewashed stone house of 1749 (restored 1929-1931), its long front on
 * Military Plaza with projecting vigas, carved wooden doors, grilled windows
 * and the carved stone portal whose keystone bears the Habsburg arms (dated
 * 1749); behind it an open terrace under a pergola of logs and the walled
 * patio garden. Original procedural geometry, CC0-1.0.
 *   bun generators/sat-spanish-governors-palace.ts
 *
 * Frame: bearing 0 (the OSM outline is square to the compass). x east, y
 * north, z up, metres. Origin at the centroid of OSM way/628863906, the
 * house (-98.495810, 29.424825). The front faces east at x = 7.5.
 *
 * Ground: the plaza in front is the high side. Mapterhorn falls 1.3 m from
 * the front (x 7.5) to the garden's west wall above San Pedro Creek (x -42),
 * the lowest ground under the footprint, which is y = 0. So the front's
 * ground, doors and windows start at z = 1.3, the terrace and garden side
 * of the house at 0.85, and every wall runs down to z = 0. USGS lidar agrees
 * (plaza 4.2, garden 3.4-3.6, creek side 2.8 over ground_min). Elevation 0.
 *
 * Evidence
 * - OSM way/628863906 (building, the house): x -7.5..7.5, y -15..15, 30 m by
 *   15 m. way/78601534 (tourism=museum, the palace grounds, not a building):
 *   the garden west of the house to x -42.3, between the neighbours
 *   way/365202529 (south) and way/628863907 (north), whose walls close it on
 *   those sides; the model draws no part of them.
 * - HABS TX-3540 (Library of Congress, 2009 measured drawings, public domain,
 *   via Wikimedia Commons): sheet 4, floor plan, 99'-5" by 50'-3", three
 *   ranges: the front rooms (16'-0"), the middle rooms, and a west range of
 *   which only the ends are roofed (children's room at the south, hallway and
 *   kitchen at the north) with the open terrace (38'-1") between; sheet 5,
 *   east elevation: roof 15'-0" and parapet 16'-7" over the plaza, the
 *   openings from the south end (windows 2.3-7.4, 25.9-31.9, 47.9-53.0 and
 *   86.2-92.0 ft, doors 9.3-16.0, 36.2-42.8 and 77.8-85.1 ft, the carved
 *   portal 59.4-68.0 ft, to 9.5 ft), the row of ten vigas at about 12 ft;
 *   west elevation: the stair/hall block to 21'-0", the kitchen chimney, the
 *   terrace's low scrolled wall with its round-headed gate, the rest 15-18.5 ft.
 * - USGS 3DEP lidar USGS_LPC_TX_Central_B2_2017_LAS_2019 (2017), 0.5 m: the
 *   roof over the two east ranges at 4.45 m over the plaza, uniform; the
 *   north-west block higher (6.1-7.2 over the lowest ground).
 * - Photos (all EVIDENCE):
 *   "The Spanish Governor's Palace in San Antonio, Texas LCCN2014633550.tif"
 *     (Carol M. Highsmith, Library of Congress, public domain): the front from
 *     the north-east: the long white wall, the soft parapet line, the vigas
 *     well proud, the dark carved doors under wooden lintels, the grilled
 *     windows, the stone portal with its carved keystone;
 *   "Courtyard of the Spanish Governor's Palace in San Antonio, Texas
 *     LCCN2014633577.tif" (Carol M. Highsmith, public domain): the garden,
 *     its white perimeter walls about 3 m high, the big arch on the terrace;
 *   "San Antonio TX Spanish Govenors Palace.jpg" (Lutz Fischer-Lamprecht,
 *     CC BY-SA 4.0): the terrace under its pergola of log vigas.
 *
 * Bolder than real, for zoom 16: the vigas are 0.45 m square and stand 0.8 m
 * proud (real: about 0.3 m round, 0.5 m); the portal's surround is 0.25 m
 * proud and its keystone block 0.35 m; the lintels run 0.3 m past each
 * opening.
 *
 * Estimated: the garden walls' height (3.2 m, from the courtyard photo's
 * people and benches) and their line: the grounds' OSM outline way/78601534,
 * drawn just inside it so they stay clear of the neighbours' walls, closed
 * all round from the house's south-west corner to its north-west corner;
 * the gate in the north wall, which no photo shows; the doors on the terrace (the plan's three).
 * The north end wall is drawn plain (HABS sheet 6 not consulted).
 *
 * Night: the front wall dimly floodlit from the plaza, the portal more; the
 * windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, flat, offset, report, writeGlb, type XY } from './sf-de-young'
import { onWall, rectPts, roundPts, block } from './sat-san-fernando-cathedral'

const lime = new Part(), roof = new Part(), wood = new Part(), win = new Part(), carved = new Part(), wall = new Part()

/** Walls to zTop with a parapet of thickness t round a roof at zRoof. */
function parapeted(w: Part, r: Part, ring: XY[], zTop: number, zRoof: number, t = 0.4) {
  prism(w, ring, 0, zTop, null)
  const inner = offset(ring, -t), n = ring.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    w.quad([...ring[i], zTop], [...ring[j], zTop], [...inner[j], zTop], [...inner[i], zTop])
    w.quad([...inner[j], zRoof], [...inner[i], zRoof], [...inner[i], zTop], [...inner[j], zTop])
  }
  flat(r, inner, zRoof)
}

const GF = 1.3 // the plaza's ground at the front
const GT = 0.85 // the terrace and the garden side of the house
const E: XY = [1, 0], W: XY = [-1, 0], N: XY = [0, 1]
const sE = (y: number) => y, sW = (y: number) => -y, sN = (x: number) => -x

// ---- the house: the two east ranges under one flat roof ----
const XF = 7.5, XM = -3.0, XW = -7.5, Y0 = -15, Y1 = 15
parapeted(lime, roof, [[XM, Y0], [XF, Y0], [XF, Y1], [XM, Y1]], GF + 5.05, GF + 4.5)
// the west range's roofed ends: the children's room (south), the kitchen and the hall/stair block (north)
parapeted(lime, roof, [[XW, Y0], [XM, Y0], [XM, -8.6], [XW, -8.6]], GT + 5.1, GT + 4.6)
parapeted(lime, roof, [[XW, 8.2], [XM, 8.2], [XM, Y1], [XW, Y1]], GT + 5.65, GT + 5.2)
parapeted(lime, roof, [[XW, 3.3], [XM, 3.3], [XM, 8.2], [XW, 8.2]], GT + 6.4, GT + 5.9)
block(lime, XW + 0.3, XW + 1.5, 13.2, 14.6, 0, GT + 6.6, 0.1) // the kitchen chimney

// ---- the front on the plaza (HABS sheet 5, from the south end in feet) ----
const ft = (f: number) => Y0 + f * 0.3018 // 99.4 ft drawn over the 30 m outline
const front: XY = [XF, 0]
for (const [a, b] of [[2.3, 7.4], [25.9, 31.9], [47.9, 53.0], [86.2, 92.0]]) {
  onWall(win, front, E, rectPts(sE(ft(a)), sE(ft(b)), GF + 0.45, GF + 2.6), 0.04)
  block(wood, XF, XF + 0.14, ft(a) - 0.3, ft(b) + 0.3, GF + 2.6, GF + 2.85) // lintel
}
for (const [a, b] of [[9.3, 16.0], [36.2, 42.8], [77.8, 85.1]]) {
  onWall(wood, front, E, rectPts(sE(ft(a)), sE(ft(b)), GF, GF + 2.65), 0.05)
  block(wood, XF, XF + 0.14, ft(a) - 0.3, ft(b) + 0.3, GF + 2.65, GF + 2.9)
}
// the carved stone portal and its keystone with the Habsburg arms
{
  const y0 = ft(59.4), y1 = ft(68.0), yc = (y0 + y1) / 2
  block(carved, XF, XF + 0.25, y0, y1, 0, GF + 2.95, 0.06)
  block(carved, XF + 0.25, XF + 0.6, yc - 0.45, yc + 0.45, GF + 2.45, GF + 3.25, 0.08) // keystone
  onWall(wood, [XF + 0.25, 0], E, rectPts(sE(yc) - 0.7, sE(yc) + 0.7, GF, GF + 2.35), 0.04)
}
// the vigas: ten beam ends well proud, about 12 ft up
for (let k = 0; k < 10; k++) {
  const y = ft(5.3 + 9.4 * k)
  block(wood, XF, XF + 0.8, y - 0.22, y + 0.22, GF + 3.55, GF + 4.0, 0.06)
}

// ---- the garden side ----
// the terrace: its low scrolled west wall with the round-headed gate (HABS west elevation)
{
  const prof: XY[] = [[3.3, 4.0], [2.4, 2.6], [1.2, 1.9], [0.2, 2.6], [-0.6, 3.4], [-1.5, 3.6], [-2.4, 3.4], [-3.2, 2.6], [-4.4, 1.7], [-6.0, 2.2], [-7.4, 3.2], [-8.6, 4.2]]
  const x0 = XW, x1 = XW + 0.45
  for (let i = 0; i < prof.length - 1; i++) {
    const [ya, za] = prof[i], [yb, zb] = prof[i + 1]
    lime.quad([x0, ya, 0], [x0, yb, 0], [x0, yb, GT + zb], [x0, ya, GT + za])
    lime.quad([x1, yb, 0], [x1, ya, 0], [x1, ya, GT + za], [x1, yb, GT + zb])
    lime.quad([x0, ya, GT + za], [x0, yb, GT + zb], [x1, yb, GT + zb], [x1, ya, GT + za])
  }
  onWall(wood, [x0, 0], W, roundPts(sW(-1.5), 1.5, GT, GT + 3.0, 8), 0.04)
  // the pergola of log vigas over the terrace
  for (let k = 0; k < 11; k++) {
    const y = -8.1 + k * 1.05
    block(wood, XW + 0.2, XM, y - 0.15, y + 0.15, GT + 4.45, GT + 4.75, 0.05)
  }
  // three doors from the middle rooms onto the terrace
  for (const y of [-5.6, -2.0, 1.4]) onWall(wood, [XM, 0], W, rectPts(sW(y) - 0.55, sW(y) + 0.55, GT, GT + 2.4), 0.05)
}
// the walled patio garden, closed all round: from the house's south-west
// corner along the grounds' OSM line (just inside it, clear of the
// neighbours' walls) to the creek side, north, and back to the house's
// north-west corner (review: the walls join the house's ends)
const GW = 3.2
const GARDEN: XY[] = [[-7.5, -14.45], [-28.7, -14.2], [-42.2, -13.8], [-41.9, 14.1], [-14.2, 13.5], [-7.5, 14.6]]
const GC: XY = [-25, 0]
for (let i = 0; i + 1 < GARDEN.length; i++) {
  const [a, b] = [GARDEN[i], GARDEN[i + 1]], l = Math.hypot(b[0] - a[0], b[1] - a[1])
  let n: XY = [-(b[1] - a[1]) / l, (b[0] - a[0]) / l]
  const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  if ((GC[0] - m[0]) * n[0] + (GC[1] - m[1]) * n[1] < 0) n = [-n[0], -n[1]] // n points into the garden
  const t = 0.4, e = 0.2 // thickness; run past each end so the corners close
  const u: XY = [(b[0] - a[0]) / l, (b[1] - a[1]) / l]
  const A: XY = [a[0] - u[0] * e, a[1] - u[1] * e], B: XY = [b[0] + u[0] * e, b[1] + u[1] * e]
  prism(wall, [A, B, [B[0] + n[0] * t, B[1] + n[1] * t], [A[0] + n[0] * t, A[1] + n[1] * t]], 0, GW, wall, 0.1)
}
onWall(wood, [0, 13.75], [0, -1], rectPts(-12.0, -10.5, 0.5, 2.9), 0.05) // a gate in the north wall

// ---------------------------------------------------------------------------
const lit = (p: V3, n: V3) => (n[0] > 0.5 && p[0] > 7 ? 0.45 : 0)
const parts = [
  { part: lime, material: { ...finish('palace-whitewash', 0xf2efe9), floodlight: lit } },
  { part: wall, material: finish('palace-garden-wall', 0xe9e6e0) },
  { part: roof, material: { ...PALETTE.roof, color: 0xa9adad } },
  { part: wood, material: finish('palace-wood', 0x6b5240) },
  { part: win, material: PALETTE.window },
  { part: carved, material: { ...finish('palace-portal-stone', 0xe0d1b2), floodlight: (p: V3, n: V3) => (n[0] > 0.5 ? 0.9 : 0.3) } },
]
const glb = writeGlb("Spanish Governor's Palace", parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [29.424825, -98.49581],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/628863906'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report("Spanish Governor's Palace", parts, glb, 5000)
const out = new URL('../models/sat-spanish-governors-palace.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
