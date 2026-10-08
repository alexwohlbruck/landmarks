/**
 * The Plaza (Plaza Hotel), Fifth Avenue at Central Park South —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-plaza-hotel.ts
 *
 * Map frame: x = model east (Fifth Avenue / Grand Army Plaza), y = model
 * north (Central Park South), z up, metres. Placed at bearing 29°, the
 * Manhattan grid. Anchor: area centroid of the outer ring of the OSM
 * multipolygon relation/9771573.
 *
 * Identifying features (from the photos):
 * 1. The green copper mansard roof all round, with rows of dormers, over a
 *    pale eighteen-storey block.
 * 2. On the Fifth Avenue front, two end pavilions each rising to a tall,
 *    steep gable: a pale stone gable face under a steep copper roof.
 * 3. Round corner turrets on the two Fifth Avenue corners, capped with
 *    small copper domes.
 * 4. The recessed centre of the Fifth Avenue front between the pavilions,
 *    its mansard over a row of arched windows, the entrance below.
 * 5. Pale marble and white brick walls with a heavy cornice line under the
 *    roof and a band over the marble base.
 *
 * Evidence
 * - OSM relation/9771573 (outer ring, 89 × 64 m) and its 48 building:part
 *   ways (the gabled pavilions 703143170 and 703143171, the corner domes
 *   703143219 and 703143220, the mansard slopes 703143177–703143194, the
 *   court 703143199 at 20 m, the inner roofs 703143200–703143223).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), resampled in the model frame
 *   (/tmp/city/nyc/work/lc/rot.py), above the lowest ground under the
 *   footprint (14.9 m NAVD88): the cornice about 60 m at the walls; the
 *   mansard rising to 81–82 m about 6–7 m in; the flat tops 82–88 m; the
 *   pavilions' gable ridges 88–91 m; the light court 19–20 m, open to the
 *   west; the west annex about 36–45 m; the north-west corner 28–32 m.
 * - Published: Henry Janeway Hardenbergh, 1907, 19 storeys, about 76 m to
 *   the roof (Wikipedia; NRHP 78001878; NYC landmark).
 * - Photos (Wikimedia Commons, daylight): the Fifth Avenue front (JJBers,
 *   CC BY-SA 4.0; Ermell, CC BY-SA 4.0), from Grand Army Plaza and Fifth
 *   Avenue at 58th Street (ajay_suresh, CC BY 2.0; Yarl, CC BY-SA 3.0;
 *   Andrew Milligan sumo, CC BY 2.0), Central Park South and the 58th Street
 *   side (Kidfly182, CC BY 4.0);
 *   /tmp/city/nyc/work/nyc-plaza-hotel/photos/credits.txt.
 *
 * Estimated: the window bays (drawn 3.6 m, two storeys a panel), the
 * dormers' size and rows, the turrets' radius (3.2 m, from the photos; OSM's dome ways have
 * 2.3 m) and how far they stand out from the corners, the gables' eaves
 * (72 m), the bands. The arcade, the balconies, the carved gables, the
 * finials and the flagpoles are left out. The west annex and the low
 * north-west corner are plain boxes.
 */
import { Part, type V3 } from './mesh'
import { PALETTE } from './palette'
import { finishModel, massing, prism, circle, capPoly, type Facade, type XY } from './nyc-570-lexington'
import { quadTo, face } from './nyc-met-opera'

const stone = new Part(), trim = new Part(), win = new Part(), copper = new Part(), roof = new Part(), door = new Part()

const E = 41.8, S = -30.5, N = 32.8, WS = -42.4, WN = -35, CX = 19, CS = -9.6, CN = 12, PB = 24
const CORN = 62, MTOP = 81, MD = 6.5, ATTIC = 72, APEX = 90

// The walls, 0…62 m, on the plan of the three wings round the light court.
const body: XY[] = [[WS, S], [E, S], [E, N], [WN, N], [WN, CN], [CX, CN], [CX, CS], [WS, CS]]
const wf: Facade = { bay: 3.6, ratio: 0.46, floor: 3.4, group: 2, spandrel: 2.6, sill: 1.2, head: 2.0, ground: 6.5, minLength: 6, margin: 1.2 }
prism({ wall: stone, win, roof: null, ring: body, z0: 0, z1: CORN, facade: wf, bevel: 0.4 })
// Bands: over the marble base and the cornice under the roof.
const band = (z0: number, z1: number, d: number) => {
  for (let i = 0; i < body.length; i++) {
    const a = body[i], b = body[(i + 1) % body.length]
    face(a, b).box(trim, -d, Math.hypot(b[0] - a[0], b[1] - a[1]) + d, 0, d, z0, z1, true)
  }
}
band(15.2, 16.0, 0.35)
band(53.6, 54.4, 0.45)
band(CORN - 1.2, CORN, 0.7)

// The mansard: a loft from the cornice to an inset ring, on every outer
// edge except along the pavilions; straight up where it meets the court
// or the pavilions.
const mring: [XY, number][] = [
  [[WS, S], MD], [[PB, S], 0], [[PB, -10.7], 0], [[E, -10.7], MD], [[E, CN], 0], [[PB, CN], 0], [[PB, N], MD],
  [[WN, N], MD], [[WN, CN], 0], [[CX, CN], 0], [[CX, CS], 0], [[WS, CS], MD],
] // each point with the offset of the edge that leaves it
const nOut = (a: XY, b: XY): XY => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[1] - a[1]) / L, -(b[0] - a[0]) / L] }
const inner: XY[] = mring.map(([v, d2], i) => {
  const [p, d1] = mring[(i + mring.length - 1) % mring.length]
  const n1 = nOut(p, v), n2 = nOut(v, mring[(i + 1) % mring.length][0])
  return [v[0] - n1[0] * d1 - n2[0] * d2, v[1] - n1[1] * d1 - n2[1] * d2]
})
for (let i = 0; i < mring.length; i++) {
  const j = (i + 1) % mring.length, a = mring[i][0], b = mring[j][0], d = mring[i][1]
  const A: V3 = [a[0], a[1], CORN], B: V3 = [b[0], b[1], CORN], C: V3 = [inner[j][0], inner[j][1], MTOP], D: V3 = [inner[i][0], inner[i][1], MTOP]
  const n = nOut(a, b)
  quadTo(d ? copper : stone, A, B, C, D, [n[0], n[1], d ? 0.4 : 0])
  if (!d) continue
  // Dormers: a row of tall panels on the lower slope and small ones above.
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const k = MD / (MTOP - CORN)
  const on = (s: number, z: number): V3 => [a[0] + u[0] * s - n[0] * (k * (z - CORN) - 0.08), a[1] + u[1] * s - n[1] * (k * (z - CORN) - 0.08), z]
  const cnt = Math.max(1, Math.round((L - 2 * MD) / 4.2)), p = (L - 2 * MD) / cnt
  for (let c = 0; c < cnt; c++) {
    const s = MD + p * (c + 0.5)
    for (const [z0, z1, w] of [[CORN + 1.5, CORN + 6.5, 1.5], [CORN + 9.5, CORN + 13, 1.0]]) {
      quadTo(win, on(s - w, z0), on(s + w, z0), on(s + w, z1), on(s - w, z1), [n[0], n[1], 0.4])
    }
  }
}
capPoly(roof, inner, MTOP)

// The two Fifth Avenue pavilions: attic storeys to 72 m, then a steep
// copper gable roof with its pale stone gable face to Fifth Avenue.
for (const [y0, y1, g0, g1] of [[S, -10.7, -24.8, -10.7], [CN, N, 13.2, 27.3]] as [number, number, number, number][]) {
  const pf: Facade = { ...wf, group: 2, sill: 1.0, head: 1.2 }
  prism({ wall: stone, win, roof, ring: [[PB, y0], [E, y0], [E, y1], [PB, y1]], z0: CORN, z1: ATTIC, facade: pf, bevel: 0.4 })
  const gc = (g0 + g1) / 2, x0 = PB + 1, x1 = E - 0.3
  // Roof planes, with a little overhang at the eaves.
  quadTo(copper, [x0, g0 - 0.3, ATTIC - 0.2], [x1, g0 - 0.3, ATTIC - 0.2], [x1, gc, APEX], [x0, gc, APEX], [0, -1, 0.5])
  quadTo(copper, [x1, g1 + 0.3, ATTIC - 0.2], [x0, g1 + 0.3, ATTIC - 0.2], [x0, gc, APEX], [x1, gc, APEX], [0, 1, 0.5])
  // The gable faces: pale stone to the avenue, copper at the back; a window in the front one.
  stone.tri([x1, g0 - 0.3, ATTIC - 0.2], [x1, g1 + 0.3, ATTIC - 0.2], [x1, gc, APEX])
  copper.tri([x0, g1 + 0.3, ATTIC - 0.2], [x0, g0 - 0.3, ATTIC - 0.2], [x0, gc, APEX])
  const w = face([x1, g0], [x1, g1])
  w.rect(win, (g1 - g0) / 2 - 2.6, (g1 - g0) / 2 + 2.6, ATTIC + 1.0, ATTIC + 5.0, 0.06)
  w.rect(win, (g1 - g0) / 2 - 1.0, (g1 - g0) / 2 + 1.0, ATTIC + 7.0, ATTIC + 10.5, 0.06)
}

// Round corner turrets at the Fifth Avenue corners, with copper domes.
for (const [cx, cy] of [[E - 1.6, S + 1.6], [E - 1.6, N - 1.6]] as XY[]) {
  const r = 3.2, ring = circle(cx, cy, r, 14)
  prism({ wall: stone, win: null, roof: null, ring, z0: 0, z1: ATTIC - 1, facade: null, bevel: 0.01 })
  // Windows round the turret: a narrow panel per segment facing out, in storey groups.
  for (let i = 0; i < 14; i += 2) {
    const a = ring[i], b = ring[(i + 1) % 14], f = face(a, b)
    for (let z = 8; z < ATTIC - 6; z += 10.2) f.rect(win, f.L * 0.15, f.L * 0.85, z, z + 7.2, 0.05)
  }
  const dome: V3[][] = []
  for (let k = 0; k <= 4; k++) {
    const t = (k / 4) * (Math.PI / 2), rr = Math.max(0.15, (r + 0.2) * Math.cos(t))
    dome.push(circle(cx, cy, rr, 14).map(([x, y]) => [x, y, ATTIC - 1 + 4.5 * Math.sin(t)] as V3))
  }
  copper.loft(dome)
  copper.loft([circle(cx, cy, 0.5, 8).map(([x, y]) => [x, y, ATTIC + 3.4] as V3), circle(cx, cy, 0.05, 8).map(([x, y]) => [x, y, ATTIC + 6.5] as V3)])
}

// The Fifth Avenue entrance in the centre, and the 58th Street entrance.
face([E, CS], [E, CN]).rect(door, (CN - CS) / 2 - 4.5, (CN - CS) / 2 + 4.5, 0, 4.5, 0.08)

// The low parts: the light court's floor, the north-west corner, the west annex.
massing({
  wall: stone, win: null, roof, coping: trim, facade: null, bevel: 0.4,
  boxes: [[WS, CS, CX, CN, 20], [WS, 1.3, WN, 19.6, 30], [-47.1, S + 0.7, WS, 1.3, 38]],
})

finishModel('The Plaza', 'nyc-plaza-hotel', [
  { part: stone, material: PALETTE.stone },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: copper, material: PALETTE.copper },
  { part: roof, material: PALETTE.roof },
  { part: door, material: PALETTE.entrance },
], { bearing: 29, osm: 'relation/9771573', height: APEX }, 6500)
