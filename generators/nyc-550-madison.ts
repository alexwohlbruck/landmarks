/**
 * 550 Madison Avenue (the AT&T / Sony Building) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-550-madison.ts
 *
 * Map frame: x = model east (Madison Avenue), y = model north (East 56th
 * Street), z up, metres. Placed at bearing 29°, the Manhattan grid. Anchor:
 * area centroid of the OSM outline relation/21151099. Kit from
 * nyc-570-lexington.ts.
 *
 * Evidence
 * - OSM relation/21151099 (outline, 31.4 × 60.2 m) and its parts: shaft
 *   way/118116805 (185 m) and the two skillion halves of the pediment
 *   way/260244593 and way/260244595 (185–197 m), split by a 4 m gap at the
 *   middle: the broken pediment's notch.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017) in the model frame
 *   (/tmp/city/nyc/work/nyc-550-madison/rot.png). Street ≈ 16.4 m NAVD88.
 *   Measured above it: walls to 187 m at the 55th and 56th Street ends; the
 *   roof rises evenly to 197 m beside the middle (a gable, ridge running
 *   east–west, so the pediment shows on the broad Madison and west faces);
 *   a slot 4 m wide right across the building at y = 0 whose floor is at
 *   185 m (the bottom of the round notch).
 * - Published: 197 m, 37 floors, Philip Johnson and John Burgee, 1984;
 *   Stony Creek pink granite; a broken pediment with a round orifice (the
 *   "Chippendale" top); a 110 ft (33.5 m) arched entrance in the middle of
 *   the Madison front between tall rectangular loggia openings (Wikipedia;
 *   NYC LPC designation 2018).
 * - Photos (Wikimedia Commons, daylight): see
 *   /tmp/city/nyc/work/nyc-550-madison/photos/credits.txt.
 *
 * Estimated: the orifice's radius (4.8 m, about a seventh of the face; its floor 0.4 m above the eaves, from the photos against the face
 * width), the arch's width (13 m), the loggia openings' size and count
 * (three a side), the window rhythm (paired windows in bays of 3.6 m, three
 * storeys a panel), the tall attic windows' height. The roof between the
 * pediments is drawn in the green-grey the aerial photos show.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, facade, capPoly, quadN, type Facade, type XY } from './nyc-570-lexington'

const granite = new Part(), win = new Part(), roofP = new Part(), dark = new Part()

const X0 = -15.7, X1 = 15.7, Y0 = -30.1, Y1 = 30.1
const EAVE = 187, APEX = 197, NOTCH_R = 4.8, NOTCH_Z = 187.4 + NOTCH_R, GAP = 1.8
const BASE = 40, ATTIC0 = 166, ATTIC1 = 182

// --- Shaft -------------------------------------------------------------------
const shaftF: Facade = { bay: 3.6, ratio: 0.42, floor: 4.3, group: 3, spandrel: 2.4, sill: 1.6, head: 1.4, margin: 2.2 }
const atticF: Facade = { bay: 3.6, ratio: 0.42, floor: ATTIC1 - ATTIC0 - 2, group: 1, spandrel: 0, sill: 1.0, head: 1.0, margin: 2.2 }
const ring: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
// Base (plain granite with the loggia drawn on), shaft, attic with tall windows, solid band to the eaves.
// The base on Madison is a granite slab D deep cut by the arch and loggia, in
// front of a recessed core whose wall carries the glazing.
const D = 2.4
prism({ wall: granite, win: null, roof: null, ring: [[X0, Y0], [X1 - D, Y0], [X1 - D, Y1], [X0, Y1]], z0: 0, z1: BASE, facade: null, bevel: 0.5 })
prism({ wall: granite, win, roof: null, ring, z0: BASE, z1: ATTIC0, facade: shaftF, bevel: 0.5 })
prism({ wall: granite, win, roof: null, ring, z0: ATTIC0, z1: ATTIC1, facade: atticF, bevel: 0.5 })
prism({ wall: granite, win: null, roof: null, ring, z0: ATTIC1, z1: EAVE, facade: null, bevel: 0.5 })

// --- The broken pediment -------------------------------------------------------
// Profile in (y, z), counter-clockwise, extruded east–west: two slopes from the
// eaves to the apex, broken by a gap that opens into the round orifice.
const slopeZ = (y: number) => EAVE + (APEX - EAVE) * (1 - (Math.abs(y) - GAP) / (Y1 - GAP))
const yc = Math.sqrt(NOTCH_R * NOTCH_R - GAP * GAP), a0 = Math.atan2(yc, GAP)
const arc: [number, number][] = []
const N = 14
for (let i = 0; i <= N; i++) { // from the right lip round the bottom to the left lip
  const t = a0 - (i / N) * (2 * a0 - Math.PI) - 0 // a0 → π − a0, going the long way through −π/2
  const ang = a0 - (i / N) * (2 * Math.PI - (Math.PI - 2 * a0))
  arc.push([NOTCH_R * Math.cos(ang), NOTCH_Z + NOTCH_R * Math.sin(ang)])
  void t
}
const prof: [number, number][] = [[Y0, EAVE], [Y1, EAVE], [Y1, EAVE + 0.01], [GAP, slopeZ(GAP)], ...arc, [-GAP, slopeZ(GAP)], [Y0, EAVE + 0.01]]
// End faces (the pediments themselves) on the east and west walls.
for (const [x, east] of [[X1, true], [X0, false]] as [number, boolean][]) {
  const side = new Part()
  capPoly(side, prof.map(([y, z]) => [y, z] as XY), 0, true)
  // capPoly lays the polygon in the xy plane facing +z; map (u, v, 0) → (x, u, v).
  for (let i = 0; i < side.pos.length; i += 9) {
    const p = [0, 3, 6].map((k) => [side.pos[i + k], -side.pos[i + k + 2], side.pos[i + k + 1]]) // glTF → map frame
    const A: V3 = [x, p[0][0], p[0][1]], B: V3 = [x, p[1][0], p[1][1]], C: V3 = [x, p[2][0], p[2][1]]
    // A face in the (y, z) plane counter-clockwise from +x faces +x.
    if (east) granite.tri(A, B, C); else granite.tri(A, C, B)
  }
}
// The surfaces between the pediments: roof slopes (green-grey) and the orifice's shell.
for (let i = 0; i < prof.length; i++) {
  const [ya, za] = prof[i], [yb, zb] = prof[(i + 1) % prof.length]
  if (Math.hypot(yb - ya, zb - za) < 0.02) continue
  const a: V3 = [X1, ya, za], b: V3 = [X1, yb, zb], c: V3 = [X0, yb, zb], d: V3 = [X0, ya, za]
  // Outward normal of edge (ya,za)→(yb,zb) on a counter-clockwise (y,z) profile is (dz, −dy).
  const isRoof = Math.abs(ya) >= GAP - 1e-6 && Math.abs(yb) >= GAP - 1e-6 && za > EAVE && zb > EAVE && Math.abs(Math.abs(yb) - Math.abs(ya)) > 1
  const isArc = i >= 4 && i < 4 + arc.length - 1
  const part = isRoof ? roofP : isArc ? dark : granite
  if (za === EAVE && zb === EAVE) continue // the base edge sits on the shaft
  part.quad(a, d, c, b)
}
// The orifice reads as a dark disc from outside (its far end is in shadow):
// close it with a disc set 1.2 m into each face.
for (const [x, east] of [[X1 - 0.8, true], [X0 + 0.8, false]] as [number, boolean][]) {
  const n = 16
  for (let i = 0; i < n; i++) {
    const t0 = (i / n) * 2 * Math.PI, t1 = ((i + 1) / n) * 2 * Math.PI
    const A: V3 = [x, 0, NOTCH_Z], B: V3 = [x, NOTCH_R * Math.cos(t0), NOTCH_Z + NOTCH_R * Math.sin(t0)], C: V3 = [x, NOTCH_R * Math.cos(t1), NOTCH_Z + NOTCH_R * Math.sin(t1)]
    if (east) dark.tri(A, B, C); else dark.tri(A, C, B)
  }
}

// --- The Madison front: arched entrance and loggia ---------------------------
// A 35 m round-arched recess (semicircle on 13 m) in the middle, three tall
// openings either side, all cut D deep into the front slab with glazing at the back.
const AW = 13, ATOP = 35, SPRING = ATOP - AW / 2, LW = 4.4, LH = 24, LP = 6.6
const openings: [number, number][] = [] // [y0, y1] of the loggia openings
for (const s of [1, -1]) for (let k = 0; k < 3; k++) {
  const yc = s * (AW / 2 + 2.2 + LW / 2 + k * LP)
  openings.push([yc - LW / 2, yc + LW / 2])
}
openings.sort((a, b) => a[0] - b[0])
const XF = X1, XB = X1 - D
const nx: V3 = [1, 0, 0]
const front = (y0: number, y1: number, z0: number, z1: number) => quadN(granite, [XF, y0, z0], [XF, y1, z0], [XF, y1, z1], [XF, y0, z1], [nx, nx, nx, nx])
// Reveal from (ya, za) to (yb, zb) on the front, running back to the core; faces into the opening.
const reveal = (ya: number, za: number, yb: number, zb: number) => granite.quad([XF, ya, za], [XF, yb, zb], [XB, yb, zb], [XB, ya, za])
// Solid piers between openings, and the slab above each.
const cuts: [number, number, number][] = [...openings.map(([a, b]) => [a, b, LH] as [number, number, number]), [-AW / 2, AW / 2, -1]]
cuts.sort((a, b) => a[0] - b[0])
let yPrev = Y0
for (const [a, b, h] of cuts) {
  front(yPrev, a, 0, BASE)
  if (h > 0) {
    front(a, b, h, BASE)
    reveal(a, h, a, 0); reveal(b, 0, b, h); reveal(b, h, a, h) // sides and soffit
    win.quad([XB + 0.06, a, 0], [XB + 0.06, b, 0], [XB + 0.06, b, h], [XB + 0.06, a, h])
  }
  yPrev = b
}
front(yPrev, Y1, 0, BASE)
// The arch: straight jambs to the springing, then a semicircle; the slab fills
// above it in strips, and a barrel reveal runs back to the glazing.
{
  const r = AW / 2, n = 14
  reveal(-r, SPRING, -r, 0); reveal(r, 0, r, SPRING)
  win.quad([XB + 0.06, -r, 0], [XB + 0.06, r, 0], [XB + 0.06, r, SPRING], [XB + 0.06, -r, SPRING])
  for (let i = 0; i < n; i++) {
    const t0 = (i / n) * Math.PI, t1 = ((i + 1) / n) * Math.PI
    const p0: [number, number] = [r * Math.cos(t0), SPRING + r * Math.sin(t0)], p1: [number, number] = [r * Math.cos(t1), SPRING + r * Math.sin(t1)]
    reveal(p0[0], p0[1], p1[0], p1[1])
    win.tri([XB + 0.06, 0, SPRING], [XB + 0.06, p0[0], p0[1]], [XB + 0.06, p1[0], p1[1]])
    // Slab above this arc segment, up to the top of the base.
    granite.quad([XF, p1[0], p1[1]], [XF, p0[0], p0[1]], [XF, p0[0], BASE], [XF, p1[0], BASE])
  }
  // Jamb-height strips either side of the arch are in the piers already.
}
// Slab ends on 55th and 56th Streets.
for (const [y, s] of [[Y0, -1], [Y1, 1]] as [number, number][]) {
  const a: V3 = [XB, y, 0], b: V3 = [XF, y, 0], c: V3 = [XF, y, BASE], d: V3 = [XB, y, BASE]
  if (s < 0) granite.quad(a, b, c, d); else granite.quad(b, a, d, c)
}
// The other three faces: a row of tall ground-floor openings and a band of base windows.
for (const [a, b] of [[[X1, Y1], [X0, Y1]], [[X0, Y1], [X0, Y0]], [[X0, Y0], [X1, Y0]]] as [XY, XY][]) {
  facade(new Part(), win, a, b, 0, BASE, { bay: 5.2, ratio: 0.55, floor: 9, group: 2, spandrel: 4, sill: 2, head: 2.5, ground: 0.6, margin: 2.5 })
}
// Notch and roof undersides: the slot floor at the bottom of the orifice is in the arc.

finishModel('550 Madison Avenue', 'nyc-550-madison', [
  { part: granite, material: finish('att-granite', 0xe0c9bb) },
  { part: win, material: PALETTE.window },
  { part: roofP, material: finish('att-roof', 0xa9bab2) },
  { part: dark, material: finish('att-orifice', 0x8f8682) },
], { bearing: 29, osm: 'relation/21151099', height: APEX })
void quadN
