/**
 * Helmsley Building (230 Park Avenue, the former New York Central Building) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-helmsley-building.ts
 *
 * Map frame: x = model east (Lexington side), y = model north (up Park
 * Avenue), z up, metres. Placed at bearing 29°, the Manhattan grid. Anchor:
 * area centroid of the OSM outline way/73850655. Park Avenue's viaduct runs
 * through the middle of the building along y. Kit from nyc-570-lexington.ts.
 *
 * Evidence
 * - OSM: outline way/73850655 and parts 264734070–75 (tower 130 m, hip roof
 *   to 150 m, cupola rings 151–160 m, spire 172 m), 291189622–30 (the wings
 *   at 65 m and the low 21 m middle sections), 668477452 (Vanderbilt Market,
 *   inside the west wing).
 * - Lidar: USGS 3DEP NY_NewYorkCity, flown 2017, resampled into the model
 *   frame. Measured: tower cornice 124–126 m, the hip roof to ~146 m round
 *   the cupola, cupola and spire 153–174 m; wings 63–73 m (68 m north,
 *   65–70 m south); the middle sections of the wings 21–29 m.
 * - Published: 172 m, 35 floors, Warren & Wetmore, 1929 (Wikipedia; NYC
 *   landmark 1987). Tan brick and limestone tower, green copper hip roof
 *   with dormers, gilded cupola and lantern; two road portals carry Park
 *   Avenue through the base, with pedestrian arches beside them.
 * - Photos (Wikimedia Commons): /tmp/city/nyc/work/nyc-helmsley-building/photos/credits.txt
 *
 * Estimated: the roof pitch and the cupola's profile (photos and the lidar
 * heights), the portal size (≈ 9 × 13 m, from the Park Avenue photos), the
 * panel rhythm. Dormers, the clock and its sculpture group are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Facade, massing, prism, finishModel, circle, ring3, spire, quadN } from './nyc-570-lexington'

const stone = new Part(), win = new Part(), roof = new Part(), copper = new Part(), gold = new Part(), portal = new Part()

// Tower plan (way/264734075) and its cornice height.
const T = { x0: -10.3, x1: 27.4, y0: -17.7, y1: 26.6 }
const cx = (T.x0 + T.x1) / 2, cy = (T.y0 + T.y1) / 2
const CORNICE = 126

const wing: Facade = { bay: 3.6, ratio: 0.5, floor: 3.7, group: 2, spandrel: 1.8, sill: 1.6, head: 2.2, ground: 15, minLength: 5 }
massing({
  wall: stone, win, roof, facade: wing,
  boxes: [
    [-52, 10, T.x0, 31, 68],          // west wing, north (291189630)
    [-52, -8, T.x0, 10, 22],          // west middle (291189626)
    [-52, -29.3, T.x0, -8, 70],       // west wing, south (291189622)
    [T.x1, 11, 52.7, 30.6, 68],       // east wing, north (291189624)
    [T.x1, -3.6, 52.7, 11, 22],       // east middle (291189628)
    [T.x1, -29.3, 52.7, -3.6, 65],    // east wing, south (291189622)
    [T.x0, -29.3, T.x1, T.y0, 65],    // the south range in front of the tower
    [T.x0, T.y0, T.x1, T.y1, CORNICE - 2.5],
  ],
})
// Tower windows: the massing draws its walls; add the Beaux-Arts cornice.
prism({ wall: stone, win: null, roof: null, ring: [[T.x0 - 0.6, T.y0 - 0.6], [T.x1 + 0.6, T.y0 - 0.6], [T.x1 + 0.6, T.y1 + 0.6], [T.x0 - 0.6, T.y1 + 0.6]],
  z0: CORNICE - 2.5, z1: CORNICE, facade: null, bevel: 0.5 })

// The green copper hip roof, from the cornice to a broad flat top at 144 m
// (lidar: 130–133 m at the eaves, 145 m round the cupola's foot).
const R0: V3[] = [[T.x0 - 0.2, T.y0 - 0.2, CORNICE], [T.x1 + 0.2, T.y0 - 0.2, CORNICE], [T.x1 + 0.2, T.y1 + 0.2, CORNICE], [T.x0 - 0.2, T.y1 + 0.2, CORNICE]]
// Cornice top ring, outside the roof's foot.
{
  const o: V3[] = [[T.x0 - 0.6, T.y0 - 0.6, CORNICE], [T.x1 + 0.6, T.y0 - 0.6, CORNICE], [T.x1 + 0.6, T.y1 + 0.6, CORNICE], [T.x0 - 0.6, T.y1 + 0.6, CORNICE]]
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; quadN(stone, o[i], o[j], R0[j], R0[i]) }
}
const TOP = 144, k = 0.3
const R1: V3[] = R0.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k, TOP])
copper.loft([R0, R1]); copper.cap(R1, true)

// Cupola, in tiers as in the photos: an octagonal copper drum with tall
// arched lights, a gilded cap, a narrower drum, a second gilded cap and the
// gilded spire to 172 m.
function drumWithLights(r: number, z0: number, z1: number) {
  const ring = circle(cx, cy, r, 8, Math.PI / 8)
  prism({ wall: copper, win: null, roof: null, ring, z0, z1, facade: null, bevel: 0.2 })
  for (let i = 0; i < 8; i++) {
    const a = ring[i], b = ring[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, n: XY = [uy, -ux]
    const v = (s: number, z: number): V3 => [a[0] + ux * s + n[0] * 0.05, a[1] + uy * s + n[1] * 0.05, z]
    const w = L * 0.27, c = L / 2, top = z1 - 0.8 - w
    win.quad(v(c - w, z0 + 0.8), v(c + w, z0 + 0.8), v(c + w, top), v(c - w, top))
    for (let q = 0; q < 4; q++) {
      const t0 = (q * Math.PI) / 4, t1 = ((q + 1) * Math.PI) / 4
      win.tri(v(c, top), v(c + w * Math.cos(t0), top + w * Math.sin(t0)), v(c + w * Math.cos(t1), top + w * Math.sin(t1)))
    }
  }
}
function cap(r0: number, r1: number, z0: number, z1: number) {
  const rings: V3[][] = []
  for (let i = 0; i <= 3; i++) {
    const t = (i / 3) * (Math.PI / 2)
    rings.push(ring3(circle(cx, cy, r1 + (r0 - r1) * Math.cos(t), 8, Math.PI / 8), z0 + (z1 - z0) * Math.sin(t)))
  }
  gold.loft(rings); gold.cap(rings[3], true)
}
prism({ wall: copper, win: null, roof: copper, ring: circle(cx, cy, 5.2, 8, Math.PI / 8), z0: TOP - 1, z1: TOP + 1, facade: null, bevel: 0.25 })
drumWithLights(4.2, TOP + 1, 152)
cap(4.5, 2.4, 152, 155)
drumWithLights(2.4, 155, 160)
cap(2.6, 1, 160, 162.5)
spire(gold, circle(cx, cy, 0.8, 8), 162.5, [cx, cy, 172], true)
// Small gilded finials at the roof's four corners, as on the real roof.
for (const [x, y] of [[T.x0 + 1.5, T.y0 + 1.5], [T.x1 - 1.5, T.y0 + 1.5], [T.x1 - 1.5, T.y1 - 1.5], [T.x0 + 1.5, T.y1 - 1.5]] as XY[]) {
  const z = CORNICE + 0.8
  spire(gold, circle(x, y, 0.6, 6), z, [x, y, z + 3])
}

// Portals: on the north and south fronts of the middle range, two road
// arches for Park Avenue and a pedestrian arch beside each, drawn flush.
function arch(y: number, facing: 1 | -1, xc: number, w: number, h: number) {
  const r = w / 2, d = 0.06 * facing
  const P = (x: number, z: number): V3 => [x, y + d, z]
  const pts: XY[] = [[xc - r, 0], [xc + r, 0], [xc + r, h - r]]
  for (let q = 1; q < 10; q++) { const t = (q * Math.PI) / 10; pts.push([xc + r * Math.cos(t), h - r + r * Math.sin(t)]) }
  pts.push([xc - r, h - r])
  const centre = P(xc, (h - r) * 0.5)
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    if (facing === 1) portal.tri(centre, P(b[0], b[1]), P(a[0], a[1])); else portal.tri(centre, P(a[0], a[1]), P(b[0], b[1]))
  }
}
for (const [y, f] of [[T.y1, 1], [-29.3, -1]] as [number, 1 | -1][]) {
  for (const xc of [cx - 7, cx + 7]) arch(y, f, xc, 9, 13)
  for (const xc of [cx - 15, cx + 15]) arch(y, f, xc, 4.2, 8)
}

finishModel('Helmsley Building', 'nyc-helmsley-building', [
  { part: stone, material: finish('helmsley-stone', 0xddcdb2) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: copper, material: PALETTE.copper },
  { part: gold, material: finish('helmsley-gilt', 0xd4b56a) },
  { part: portal, material: finish('helmsley-portal', 0x4f565c) },
], { bearing: 29, osm: 'way/73850655', height: 172 })
