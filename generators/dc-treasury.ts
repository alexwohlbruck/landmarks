/**
 * Treasury Building — procedural, CC0-1.0, no textures.
 * bun generators/dc-treasury.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0°, the outline's walls
 * running due north–south and east–west. The anchor is the centroid of the
 * OSM outline relation/286293 (lng -77.034315, lat 38.897587). The building
 * is not symmetrical as a whole (Mills's east and centre wings of 1836–42,
 * then Young and Walter's south, west and north wings of 1855–69), so each
 * front is drawn symmetrical about its own axis, at OSM's positions.
 *
 * What it is: a granite Greek Revival block round two courtyards. A
 * rusticated basement carries a giant Ionic order three storeys tall, an
 * entablature and a balustrade; low grey hip roofs sit behind. The 15th
 * Street (east) front is the long colonnade of 30 Ionic columns between two
 * pedimented end pavilions; the north, south and west fronts each have an
 * octastyle pedimented portico on a high podium (the south one faces
 * Hamilton Place over the grand steps); the other fronts carry pilasters
 * between the bays. The centre wing rises one storey higher with a long
 * row of windows, the courtyards' corners have low domed skylights.
 *
 * Wikidata: Q7836795, the building. (OSM's wikidata tag on the outline,
 * Q648666, is the Department of the Treasury, not the building.)
 *
 * Covers and replaces: the outline relation only. The courtyard buildings
 * way/1444818993 and way/1444818994 (untagged infill, no height) are left in
 * the open courtyards and not replaced.
 *
 * Evidence
 * - OSM (measured): relation/286293, 87.1 × 158.1 m including the porticos;
 *   main walls at x = 39.6 (east, the colonnade's face), about -36.4 (west),
 *   y = 70.6 (north) and -70.0 (south); porticos 26 × 8.5 m north and south
 *   and 27 × 8.6 m west; end pavilions on 15th Street 1.7–2.5 m proud;
 *   courtyards 37.2 × 42.6 m and 37.0 × 42.0 m. building:levels 5.
 * - Published: 30 Ionic columns, each 36 ft (11 m) and of one granite
 *   block (replacing Aquia sandstone in 1908); the colonnade 350 ft (107 m)
 *   long (Wikipedia, "Treasury Building (Washington, D.C.)"; Treasury
 *   history pages). Granite and painted sandstone, light grey.
 * - Photos (Wikimedia Commons): "Us-treasury-building.jpg" (MeanieHyaena,
 *   CC BY 4.0), the north front and roofs from above, with the Monument;
 *   "Treasury building in Washington DC.jpg" (Runner1928, CC BY-SA 4.0),
 *   the south-east corner with the colonnade and end pavilion; "Treasury
 *   Department rear view.JPG" (AgnosticPreachersKid, CC BY-SA 3.0) and
 *   "Treasury Building in Washington, D.C. 2012.JPG" (Another Believer, CC
 *   BY-SA 3.0), the south portico; "United States Treasury Washington DC
 *   5383075936 o.jpg" (Tony Webster, CC BY-SA 3.0), the north portico;
 *   "White House construction aerial view 2025-12-03 14-15-53.jpg" (G.
 *   Edward Johnson, CC BY 4.0), from the south-west and above.
 * - USGS NAIP orthophoto (public domain): roof plan and colour, the
 *   centre wing's raised storey, the four low domes at (-23, 51), (25, 51),
 *   (-23, -63) and (25, -63).
 * - Estimated from the photos against the published 11 m columns: basement
 *   4.6 m, order to 15.6 m, entablature to 18.4 m, balustrade to 19.9 m,
 *   pediment apexes 23 m, wing roofs to 23 m, centre wing to 24 m.
 * - The pediments' roofs are drawn in the stone colour, as their raking
 *   cornices read in the photos, so the temple fronts stand out against the
 *   grey roofs behind.
 * - Simplified: the porticos' second rows of columns, the steps' cheek
 *   walls, the statues of Hamilton and Gallatin and the window grilles are
 *   left out; the west front's low pavilions beside its portico are drawn
 *   as wall.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { balustrade, block, cbox, cylinder, gable, grow, hip, panel, qf, rect, save, tf, type Rect, type Side } from './dc-white-house'

const stone = new Part(), shade = new Part(), bal = new Part(), roof = new Part(), win = new Part(), door = new Part()

// ---- Heights.
const BASE = 4.6, ORDER = 15.6, ENT = 18.4, BAL = 19.9, RIDGE = 21.2, APEX = 23.4
const COL_R = 0.72

// ---- Plan.
const XE = 35.4, XC = 39.6 // east wing wall (set deep behind the colonnade), colonnade face
const XW = -36.4
const YN = 70.6, YS = -70.0
const CY_N = [9.7, 52.4], CY_S = [-50.7, -8.7], CX = [-16.3, 20.9] // courtyards

const wings: Rect[] = [
  rect(XW, XE, CY_N[1], YN), // north
  rect(XW, XE, YS, CY_S[0]), // south
  rect(CX[1], XE, YS, YN), // east
  rect(XW, CX[0], YS, YN), // west
  rect(CX[0], CX[1], CY_S[1], CY_N[0]), // centre
]
// End pavilions on 15th Street (proud of the colonnade), and on the west.
const paviE = [rect(XE, XC + 0.3, 52.1, YN), rect(XE, XC + 0.3, YS, -51.1)]
const paviFront = [41.3, 42.1] // their porticos' faces (OSM)
const paviW = [rect(-38.8, XW, 53.6, YN), rect(-38.8, XW, YS, -52.0)]
const masses = [...wings, ...paviE, ...paviW]

// ---- Walls, basement, entablature for every mass.
function walls(r: Rect) {
  // The wall plane between the pilasters is a shade darker than the
  // pilasters, columns and entablature, as it reads in the photos.
  cbox(shade, r, 0, ORDER, { top: false })
  // Rusticated basement: proud, in the darker tone, capped by a light band.
  cbox(shade, grow(r, 0.25), 0, BASE - 0.45, { top: false })
  cbox(stone, grow(r, 0.35), BASE - 0.45, BASE, { top: true })
  cbox(stone, grow(r, 0.12), ORDER, ENT - 0.8, { top: false, bottom: true })
  cbox(stone, grow(r, 0.6), ENT - 0.8, ENT, { b: 0.3, bottom: true, top: false })
}
for (const r of masses) walls(r)

// The colonnade's entablature and ceiling, carried on the 30 columns.
const colon = rect(XE, XC, -51.1, 52.1)
cbox(stone, rect(XE, XC - 0.15, colon.y0, colon.y1), ORDER, ENT - 0.8, { top: false, bottom: true })
cbox(stone, rect(XE, XC + 0.45, colon.y0, colon.y1), ENT - 0.8, ENT, { b: 0.3, bottom: true, top: false })
{
  const n = 30, y0 = -49.6, y1 = 50.6
  for (let k = 0; k < n; k++) {
    const y = y0 + ((y1 - y0) * k) / (n - 1)
    col(XC - COL_R - 0.25, y)
  }
}
/** A giant Ionic column: plinth, shaft, a capital block. */
function col(x: number, y: number, z0 = BASE, z1 = ORDER) {
  cylinder(stone, x, y, COL_R, z0, z1 - 0.55, 8, COL_R * 0.88)
  cbox(stone, rect(x - COL_R - 0.15, x + COL_R + 0.15, y - COL_R - 0.15, y + COL_R + 0.15), z1 - 0.55, z1, { bottom: true, top: false })
}

// The colonnade's back wall, in shadow behind the columns.
panel(shade, 'e', XE, colon.y0, colon.y1, 0, ORDER, 0.02)

// ---- Roofs: low grey hips behind the balustrade over every wing; the
// centre wing's raised storey; four low domes.
for (const r of wings.slice(0, 4)) hip(roof, grow(r, -0.7), ENT, RIDGE, 9)
for (const r of [...paviE, ...paviW]) cbox(roof, grow(r, -0.3), ENT - 0.1, ENT + 0.15, { top: true })
cbox(roof, grow(colon, 0, 0), ENT - 0.1, ENT + 0.15, { top: true })
{
  const c = wings[4]
  const up = rect(c.x0 + 1.2, c.x1 - 1.2, c.y0 + 2.2, c.y1 - 2.2)
  cbox(roof, grow(c, -0.3), ENT - 0.1, ENT + 0.1, { top: true })
  cbox(stone, up, ENT, 22.6, { top: false })
  cbox(stone, grow(up, 0.35), 22.6, 23.2, { b: 0.2, bottom: true, top: false })
  hip(roof, grow(up, 0.1), 23.2, 24.2, 3)
  const n = 10, step = (up.x1 - up.x0) / n
  for (let k = 0; k < n; k++) {
    const a = up.x0 + step * (k + 0.5)
    panel(win, 'n', up.y1, a - 0.7, a + 0.7, 19.2, 21.8)
    panel(win, 's', up.y0, a - 0.7, a + 0.7, 19.2, 21.8)
  }
}
for (const [cx, cy] of [[-23, 51], [24.7, 51], [-23, -63], [24.7, -63]]) {
  const seg = 8, r0 = 2.8
  const ring = (rad: number, z: number) => Array.from({ length: seg }, (_, k) => {
    const a = (2 * Math.PI * (k + 0.5)) / seg
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a), z] as V3
  })
  stone.loft([ring(r0, RIDGE - 2.5), ring(r0, RIDGE - 0.6)])
  roof.loft([ring(r0 + 0.2, RIDGE - 0.6), ring(r0 * 0.55, RIDGE + 0.6), ring(0.4, RIDGE + 1.0)])
  roof.cap(ring(0.4, RIDGE + 1.0), true)
}

// ---- Balustrades along every outer front (and the colonnade).
const P = 3.6, PB = 7.2 // bay pitch; balustrade pier pitch
balustrade(stone, bal, 'e', XC - 0.05, colon.y0, colon.y1, ENT, BAL, PB)
balustrade(stone, bal, 'n', YN - 0.05, -38.8, -11.5, ENT, BAL, PB)
balustrade(stone, bal, 'n', YN - 0.05, 14.7, 41.3, ENT, BAL, PB)
balustrade(stone, bal, 's', YS + 0.05, -38.8, -11.7, ENT, BAL, PB)
balustrade(stone, bal, 's', YS + 0.05, 15.4, 42.1, ENT, BAL, PB)
balustrade(stone, bal, 'w', -38.8 + 0.05, 53.6, YN, ENT, BAL, PB)
balustrade(stone, bal, 'w', -38.8 + 0.05, YS, -52.0, ENT, BAL, PB)
balustrade(stone, bal, 'w', XW + 0.05, -52.0, -13.8, ENT, BAL, PB)
balustrade(stone, bal, 'w', XW + 0.05, 13.1, 53.6, ENT, BAL, PB)

// ---- Facades: a window a storey in each bay, pilasters between bays.
const W = 1.8
const ROWS: [number, number][] = [[1.3, 3.3], [5.4, 8.4], [9.3, 12.1], [12.9, 14.9]]
function facade(side: Side, at: number, a0: number, a1: number, o: { pilasters?: boolean; pitch?: number; rows?: [number, number][] } = {}) {
  const pitch = o.pitch ?? P
  const n = Math.max(1, Math.round((a1 - a0) / pitch)), step = (a1 - a0) / n
  for (let k = 0; k < n; k++) {
    const c = a0 + step * (k + 0.5)
    for (const [z0, z1] of o.rows ?? ROWS) panel(win, side, at, c - W / 2, c + W / 2, z0, z1, z0 < BASE ? 0.29 : 0.04)
  }
  if (o.pilasters !== false) for (let k = 0; k <= n; k++) {
    const a = a0 + k * step
    block(stone, side, at, Math.max(a0, a - 0.5), Math.min(a1, a + 0.5), BASE, ORDER, 0.3, false, false)
  }
}
// East: behind the colonnade (plain wall, windows), then the end pavilions.
facade('e', XE, colon.y0, colon.y1, { pilasters: false, pitch: (colon.y1 - colon.y0) / 29 })
facade('e', XC + 0.3, 52.1, YN, { pilasters: false })
facade('e', XC + 0.3, YS, -51.1, { pilasters: false })
// North and south: either side of the portico.
facade('n', YN, -38.8, -11.5)
facade('n', YN, 14.7, 41.3)
facade('s', YS, -38.8, -11.7)
facade('s', YS, 15.4, 42.1)
// West: either side of the portico, and the end pavilions.
facade('w', XW, -52.0, -13.8)
facade('w', XW, 13.1, 53.6)
facade('w', -38.8, 53.6, YN)
facade('w', -38.8, YS, -52.0)
// Courtyards: plain (they are deep and seen only from above; the file
// budget goes to the colonnade and porticos instead).

// ---- End pavilions on 15th Street: four engaged columns and a pediment.
function pediment(side: Side, at: number, a0: number, a1: number, z0: number, z1: number, depth: number) {
  const ns = side === 'n' || side === 's', sgn = side === 'n' || side === 'e' ? 1 : -1
  const am = (a0 + a1) / 2, f = at, b = at - sgn * depth
  const Pt = (a: number, d: number, z: number): V3 => (ns ? [a, d, z] : [d, a, z])
  const n: V3 = ns ? [0, sgn, 0] : [sgn, 0, 0]
  tf(stone, Pt(a0, f, z0), Pt(a1, f, z0), Pt(am, f, z1), n)
  const h = z1 - z0, half = (a1 - a0) / 2
  qf(stone, Pt(a0, f + sgn * 0.3, z0), Pt(am, f + sgn * 0.3, z1), Pt(am, b, z1), Pt(a0, b, z0), ns ? [-h, 0, half] : [0, -h, half])
  qf(stone, Pt(a1, f + sgn * 0.3, z0), Pt(am, f + sgn * 0.3, z1), Pt(am, b, z1), Pt(a1, b, z0), ns ? [h, 0, half] : [0, h, half])
  // Raking cornice: a thin lip under the roof edge.
  for (const a of [a0, a1]) {
    qf(stone, Pt(a, f + sgn * 0.3, z0), Pt(am, f + sgn * 0.3, z1), Pt(am, f + sgn * 0.3, z1 - 0.45), Pt(a, f + sgn * 0.3, z0 - 0.45), n)
  }
}
paviE.forEach((r, i) => {
  // A shallow hexastyle portico on the pavilion's face, under its pediment.
  const at = paviFront[i], ym = (r.y0 + r.y1) / 2
  const e = rect(r.x1, at, r.y0 + 0.8, r.y1 - 0.8)
  cbox(stone, rect(r.x1, at - 0.3, e.y0, e.y1), ORDER, ENT - 0.8, { top: false, bottom: true })
  cbox(stone, rect(r.x1, at + 0.3, e.y0 - 0.3, e.y1 + 0.3), ENT - 0.8, ENT, { b: 0.3, bottom: true, top: false })
  cbox(stone, rect(r.x1, at, e.y0, e.y1), 0, BASE, { top: true })
  for (let k = 0; k < 6; k++) col(at - COL_R - 0.3, e.y0 + 1.4 + ((e.y1 - e.y0 - 2.8) * k) / 5)
  pediment('e', at, e.y0 - 0.3, e.y1 + 0.3, ENT, APEX - 0.4, 10)
  void ym
})

// ---- Porticos: octastyle, on a podium with steps, under a pediment.
function portico(side: Side, wall: number, front: number, a0: number, a1: number, steps: number) {
  const ns = side === 'n' || side === 's', sgn = side === 'n' || side === 'e' ? 1 : -1
  const d0 = Math.min(wall, front), d1 = Math.max(wall, front)
  const R = (lo: number, hi: number, e0: number, e1: number) => (ns ? rect(lo, hi, e0, e1) : rect(e0, e1, lo, hi))
  // Podium and steps.
  cbox(stone, R(a0, a1, d0, d1), 0, BASE - 0.2, { top: true })
  if (steps > 0) {
    const s0 = sgn > 0 ? front : front - steps, s1 = sgn > 0 ? front + steps : front
    const st = R(a0 + 2.5, a1 - 2.5, s0, s1)
    // A ramp of steps: a sloped top from the podium edge down to the ground.
    const z = BASE - 0.2
    const corners = ns
      ? [[st.x0, front], [st.x1, front], [st.x1, front + sgn * steps], [st.x0, front + sgn * steps]]
      : [[front, st.y0], [front, st.y1], [front + sgn * steps, st.y1], [front + sgn * steps, st.y0]]
    const V = (c: number[], h: number): V3 => [c[0], c[1], h]
    qf(stone, V(corners[0], z), V(corners[1], z), V(corners[2], 0.3), V(corners[3], 0.3), [ns ? 0 : sgn * z, ns ? sgn * z : 0, steps])
    qf(stone, V(corners[3], 0), V(corners[2], 0), V(corners[2], 0.3), V(corners[3], 0.3), ns ? [0, sgn, 0] : [sgn, 0, 0])
    for (const [i, j] of [[0, 3], [1, 2]]) {
      const n: V3 = ns ? [corners[i][0] === st.x0 ? -1 : 1, 0, 0] : [0, corners[i][1] === st.y0 ? -1 : 1, 0]
      qf(stone, V(corners[i], 0), V(corners[j], 0), V(corners[j], 0.3), V(corners[i], z), n)
    }
  }
  // Columns: eight across the front.
  const m = 8, pad = 1.6, cl = front - sgn * (COL_R + 0.5)
  for (let k = 0; k < m; k++) {
    const a = a0 + pad + ((a1 - a0 - 2 * pad) * k) / (m - 1)
    if (ns) col(a, cl)
    else col(cl, a)
  }
  // Entablature block and pediment.
  const ent = R(a0 + 0.3, a1 - 0.3, Math.min(wall, front - sgn * 0.3), Math.max(wall, front - sgn * 0.3))
  cbox(stone, ent, ORDER, ENT - 0.8, { top: false, bottom: true })
  cbox(stone, grow(ent, 0.4), ENT - 0.8, ENT, { b: 0.3, bottom: true, top: false })
  const ped = R(a0, a1, Math.min(wall - sgn * 1, front), Math.max(wall - sgn * 1, front))
  const g = ns ? rect(ped.x0, ped.x1, ped.y0, ped.y1) : rect(ped.x0, ped.x1, ped.y0, ped.y1)
  gable(stone, stone, g, ENT, APEX, ns, sgn > 0 ? [false, true] : [true, false])
  // Doors and windows behind the columns.
  const am = (a0 + a1) / 2
  panel(shade, side, wall, a0 + 0.4, a1 - 0.4, BASE, ORDER, 0.02) // the shaded back wall
  panel(door, side, wall, am - 1.4, am + 1.4, BASE, BASE + 5.2)
  for (const off of [-7.2, -3.6, 3.6, 7.2]) {
    for (const [z0, z1] of ROWS.slice(1)) panel(win, side, wall, am + off - W / 2, am + off + W / 2, z0, z1)
  }
}
portico('n', YN, 76.6, -11.5, 14.7, 2.5)
portico('s', YS, -75.0, -11.7, 15.4, 4.0)
portico('w', XW, -45.0, -13.8, 13.1, 0)

await save('dc-treasury', 'Treasury Building', [
  { part: stone, material: finish('treasury-granite', 0xdcd9d1) },
  { part: shade, material: finish('treasury-granite-shade', 0xbfbbb3) },
  { part: bal, material: finish('baluster', 0xc7c6c1) },
  { part: roof, material: finish('treasury-roof', 0xbcbfc1) },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
], { bearing: 0, osm: 'relation/286293', footprint: [87.1, 158.1], height: 24.2 }, 6500)
