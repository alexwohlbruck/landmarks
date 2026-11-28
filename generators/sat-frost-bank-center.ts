/**
 * Frost Bank Center (opened 2002 as the SBC Center, later the AT&T Center),
 * home of the San Antonio Spurs, One AT&T Center Parkway, San Antonio,
 * Texas (Ellerbe Becket with Kell Muñoz, Marmon Mok). A rectangular arena
 * hall under a long barrel-vaulted metal roof whose curved ends show as
 * arcs over the east and west fronts; in front of each end a lower,
 * chamfered concourse wing with a glass entrance, its roof sloping down
 * outward; red-brick and stone bases; four round stair towers at the
 * corners; silver-grey metal cladding. Original procedural geometry,
 * CC0-1.0.   bun generators/sat-frost-bank-center.ts
 *
 * Frame: bearing 0 (the outline is square to the compass). x east, y north,
 * z up, metres. Drawn about the lidar grid's centre (-98.43751, 29.42698),
 * shifted by (-0.45, -0.31) so the origin is the area centroid of OSM
 * way/25313089 (-98.437505, 29.426983).
 *
 * Ground: flat (lidar ground 2.8-3.8 over its ground_min round the arena);
 * heights below are lidar less 3.4. Elevation 0.
 *
 * Evidence
 * - OSM way/25313089 (building, "Frost Bank Center"): the hall x -49..50,
 *   y -67..67.8; the chamfered wings to x -82.6 and 83.3; the four round
 *   corner towers, r 8, centred (+-64, +-47).
 * - USGS 3DEP lidar USGS_LPC_TX_Central_B2_2017_LAS_2019 (2017), 1 m grid
 *   (~/landmarks-scratch/satx/work/sat-frost-bank-center/lidar.json), less
 *   3.4: the vault's crest 36.0 on y 0, falling as an arc to 29.2 at
 *   y +-56 and the eaves at 21.7 on the long sides; the wings from 22.4 at
 *   the hall to 10.7 at their outer fronts; the towers 13.4.
 * - Photos (Wikimedia Commons), EVIDENCE:
 *   "AT&T Center at day.jpg" (Atristan 77, CC BY-SA 3.0): an end front square
 *     on: the arched silhouette of the vault, the silver metal panels, the
 *     name panel at the top centre, the glazed entrance hall with its
 *     canopy, the red-brick corner blocks;
 *   "ATTCenter.jpg" (Dknights411, CC BY-SA 3.0): the same front at night
 *     from the side, the round corner tower lit in green, the glass lit.
 *
 * The sign is drawn as a plain panel (no lettering; the arena's name has
 * changed twice). Estimated: the long sides, which no photo here shows
 * (drawn as metal with a high glazing band); the wings' glazing.
 *
 * Night: the glass walls glow; the towers and the name panel floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { earcut, ccw, lathe, report, writeGlb, type XY } from './sf-de-young'
import { shift } from './sf-opera-house'
import { onWall, rectPts, block } from './sat-san-fernando-cathedral'

const metal = new Part(), brick = new Part(), roof = new Part(), glass = new Part(), win = new Part(), panel = new Part()

/** A prism whose top follows z = h(x, y): walls to that height, a planar top (h linear). */
function slopedPrism(wall: Part, top: Part, ring0: XY[], h: (p: XY) => number, z0 = 0) {
  const ring = ccw(ring0), n = ring.length
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    wall.quad([...a, z0], [...b, z0], [...b, h(b)], [...a, h(a)])
  }
  for (const [i, j, k] of earcut(ring)) top.tri([...ring[i], h(ring[i])], [...ring[j], h(ring[j])], [...ring[k], h(ring[k])])
}

// ---- the hall and its barrel vault (along x) ----
const HX0 = -49, HX1 = 50, HY = 67.4, EAVE = 21.7
block(metal, HX0, HX1, -HY, HY, 0, EAVE, 0, null)
const vault = (y: number) => {
  // an arc through 36.0 at y 0 and 29.2 at y 56, ending at the eaves at y +-HY
  const R = (56 * 56 + 6.8 * 6.8) / (2 * 6.8), zc = 36.0 - R
  return Math.max(EAVE, zc + Math.sqrt(Math.max(0, R * R - y * y)))
}
const VS = 16
for (let i = 0; i < VS; i++) {
  const y0 = -HY + (2 * HY * i) / VS, y1 = -HY + (2 * HY * (i + 1)) / VS
  roof.quad([HX0 - 0.5, y0, vault(y0)], [HX1 + 0.5, y0, vault(y0)], [HX1 + 0.5, y1, vault(y1)], [HX0 - 0.5, y1, vault(y1)])
  // the arched end walls
  metal.quad([HX0, y1, EAVE], [HX0, y0, EAVE], [HX0, y0, vault(y0)], [HX0, y1, vault(y1)])
  metal.quad([HX1, y0, EAVE], [HX1, y1, EAVE], [HX1, y1, vault(y1)], [HX1, y0, vault(y0)])
}
// a high glazing band on the long sides, the name panels on the ends
for (const [yw, n] of [[-HY, [0, -1]], [HY, [0, 1]]] as [number, XY][]) {
  for (let x = HX0 + 4; x < HX1 - 4; x += 9) onWall(win, [0, yw], n, rectPts((n[1] < 0 ? x : -x) - 3.6, (n[1] < 0 ? x : -x) + 3.6, 14.0, 19.5), 0.06)
  block(brick, HX0, HX1, n[1] < 0 ? -HY - 0.3 : HY, n[1] < 0 ? -HY : HY + 0.3, 0, 6.0, 0, null)
}
for (const [x, s] of [[HX0, -1], [HX1, 1]]) block(panel, s < 0 ? x - 0.6 : x, s < 0 ? x : x + 0.6, -16, 16, 24.0, 31.5, 0.1)

// ---- the concourse wings: chamfered, the roof sloping down outward ----
for (const s of [-1, 1]) {
  const xi = s < 0 ? HX0 : HX1, xo = s < 0 ? -82.6 : 83.3
  const ring: XY[] = s < 0
    ? [[xi, -45.5], [-55.2, -41.5], [-82.3, -15.0], [xo, 15.1], [-55.4, 42.6], [xi, 46.8]]
    : [[xi, 47.4], [55.6, 43.3], [83.0, 16.5], [xo, -13.6], [55.6, -41.6], [xi, -44.5]]
  const h = (p: XY) => 22.4 + ((Math.abs(p[0]) - Math.abs(xi)) / (Math.abs(xo) - Math.abs(xi))) * (10.7 - 22.4)
  slopedPrism(metal, roof, s < 0 ? ring : ring, h)
  const nf: XY = [s, 0], sf = (y: number) => (s > 0 ? y : -y)
  onWall(glass, [xo, 0], nf, rectPts(sf(-12) < sf(12) ? sf(-12) : sf(12), sf(-12) < sf(12) ? sf(12) : sf(-12), 0, 9.2), 0.06)
  block(panel, s < 0 ? xo - 4.0 : xo, s < 0 ? xo : xo + 4.0, -8, 8, 4.2, 4.6, 0.05) // the entrance canopy
  // glazing on the chamfered faces
  for (const [a, b] of [[ring[1], ring[2]], [ring[3], ring[4]]]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    let n: XY = [u[1], -u[0]]
    if (n[0] * s < 0) n = [-n[0], -n[1]]
    const su: XY = [-n[1], n[0]], d = su[0] * u[0] + su[1] * u[1]
    const sA = 0, sB = d * L
    onWall(win, a, n, rectPts(Math.min(sA, sB) + 3, Math.max(sA, sB) - 3, 7.0, 9.6), 0.06)
    onWall(brick, a, n, rectPts(Math.min(sA, sB), Math.max(sA, sB), 0, 5.6), 0.08)
  }
}

// ---- the four round corner towers ----
for (const [cx, cy] of [[-64, -47], [64, -47], [-64, 47.5], [64, 47.5]]) {
  lathe(brick, [[8.0, 0], [8.0, 7.0]], 16, [cx, cy])
  lathe(glass, [[8.0, 7.0], [8.0, 12.6]], 16, [cx, cy])
  lathe(metal, [[8.0, 12.6], [8.5, 12.8], [8.5, 13.4], [0, 13.4]], 16, [cx, cy])
}

// ---------------------------------------------------------------------------
const all = [metal, brick, roof, glass, win, panel]
shift(all, -0.45, -0.31)
const parts = [
  { part: metal, material: { ...finish('arena-silver-metal', 0xc9ccca), floodlight: (p: V3, n: V3) => (n[2] > 0.7 ? 0 : 0.2) } },
  { part: brick, material: { ...finish('arena-red-brick', 0xbc735d), floodlight: () => 0.5 } },
  { part: roof, material: { ...PALETTE.roof, color: 0xc2c6c7 } },
  { part: glass, material: windowVariant(2, 0x8aa6ba) },
  { part: win, material: PALETTE.window },
  { part: panel, material: { ...finish('arena-sign-panel', 0x7b8288), floodlight: () => 0.8 } },
]
const glb = writeGlb('Frost Bank Center', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [29.426983, -98.437505],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/25313089'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('Frost Bank Center', parts, glb, 5000)
const out = new URL('../models/sat-frost-bank-center.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
