/**
 * Tower Life Building (built as the Smith-Young Tower), San Antonio:
 * procedural, CC0-1.0.
 * bun generators/sat-tower-life-building.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * tower's axis, found from the 2017 lidar as the centre of its returns
 * above 70 m (-98.4913878, 29.4228678; OSM's tower parts sit about 1.3 m
 * west of it). y = 0 is the lowest ground under the footprint: the River
 * Walk level at the podium's north-east corner, 2.5 m below the street on
 * the south and west (lidar ground; Mapterhorn agrees).
 *
 * Ayres & Ayres, 1929; NRHP 1991. A 30-storey octagonal tower of buff
 * brick with pale terra-cotta Gothic trim, stepping in twice above a broad
 * eight-storey wing, crowned by a green Ludowici-tile octagonal roof with
 * dormers, a copper lantern and (since 2010, restoring the 1929 design) a
 * 35 m flagpole.
 *
 * Published: 404 ft (123.1 m), 30-31 storeys (Wikipedia, "Tower Life
 * Building"; "List of tallest buildings in San Antonio"); the 114 ft
 * (35 m) flagpole (Wikipedia).
 *
 * Measured (lidar USGS_LPC_TX_Central_B2_2017_LAS_2019, flown 2017;
 * heights above y = 0):
 * - the wing's roof 29.7 m, with a small penthouse to 35.7 m on its
 *   north side; the tower's first setback 75.3 m (parapet and corner
 *   pinnacles to about 79 m), the second 93.5 m (to about 95), the top
 *   stage's parapet 104.5-105.5 m (pinnacles 106.5);
 * - the tower's half-widths (apothems): 15.0 m below the first setback,
 *   12.5 m to the second, 10.8 m to the roof;
 * - the tile roof from about 104.5 m at its eaves to 116.3 m at r 2.5,
 *   the lantern to 124.5 m, the flagpole's tip 154.1 m.
 * From photos (Leaflet 2011, from the south): the stage widths in the
 * ratio 1 : 0.84 : 0.70, which the lidar matches; eight small gabled
 * dormers at the foot of the roof; the window rhythm (five narrow windows
 * per face on the shaft, two tall arched ones per face on the top stage);
 * the pale terra-cotta bands and pinnacles at each setback; the top stage
 * faced all in pale terra-cotta.
 * Estimated: the octagon's orientation (a flat faces south: the 2011 view
 * from the south shows the tower face-on, and the lidar's outline is too
 * soft to say otherwise), pinnacle sizes, dormer sizes, the lantern's
 * shape above the lidar's height.
 * Left out: grotesques, gargoyles, tracery, mullions; the neighbour to the
 * east (way/164483206, its own building).
 *
 * OSM: way/60586390 (outline) with parts way/360103243 (the wing; tagged
 * 20 m, lidar 29.7), way/79788377, /80312693, /80312696 (the tower's
 * stages; tagged 60, 80, 120 m), /360103238 (lantern) and /360103237
 * (flagpole). All are drawn, so all are replaced.
 *
 * Night: the crown is floodlit (Corey Leopold's and other night photos
 * show the top stage and roof washed white): `floodlight` on the brick,
 * trim and tile above the second setback, weaker on the stage below; the
 * windows are `window`.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Tower Life Building, San Antonio, 2011.jpg", Leaflet, public domain (from the south; widths, crown)
 * - "Tower Life Building 2024.jpg", Jumpy542, CC0
 * - "Tower Life Building.jpg", Blas J, CC BY-SA 4.0
 * - "Tower Life Building from Tower of the Americas.jpg", Runner1928, CC BY-SA 3.0 (from above, south-east)
 * - "Tower Life Bldg SA TX.jpg", KelliMays, CC BY-SA 4.0 (night)
 * No look-only sources used.
 *
 * Doubts: the octagon's orientation; the wing's facade on the north and
 * west sides (no clear photo; drawn like the south).
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ring, walls, capPoly, offset, outN, bayPanels, box, regular, type XY } from './sat-frost-tower'

const brick = new Part()
const trim = new Part()
const win = new Part()
const tile = new Part()
const dark = new Part()    // dormers, flagpole
const roofP = new Part()   // flat roofs

const STREET = 2.5
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
/** A triangle wound to face direction n. */
function tf(p: Part, a: V3, b: V3, c: V3, n: V3) {
  if (dot(cross(sub(b, a), sub(c, a)), n) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
/** A quad wound to face direction n. */
function qf(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  tf(p, a, b, c, n)
  tf(p, a, c, d, n)
}
// --------------------------------------------------------------- the wing ---
// OSM way/360103243 moved into the tower's frame (x - 1.18, y + 12.41).
const WING = ring([
  [-28.7, 30.0], [-25.6, 32.7], [23.5, 22.5], [11.8, -19.4], [2.2, -16.6], [-8.5, -13.4], [-15.4, -6.9], [-18.8, 2.6],
])
const W_TOP = 29.7
walls(brick, WING, 0, W_TOP - 1.2)
walls(trim, WING, W_TOP - 1.2, W_TOP)
capPoly(roofP, offset(WING, -0.05), W_TOP, true)
// windows on the wing's walls, not where the tower stands against them
const nearTower = (i: number) => {
  const a = WING[i], b = WING[(i + 1) % WING.length]
  return Math.hypot((a[0] + b[0]) / 2, (a[1] + b[1]) / 2) < 17
}
const wingBands: [number, number][] = [[STREET + 2.4, STREET + 8.6], [STREET + 10.6, STREET + 16.8], [STREET + 18.8, W_TOP - 2.6]]
bayPanels(win, WING, wingBands, 1.6, 1.5, 4, nearTower)
// the penthouse on the north side of the wing
box(brick, 10.3, 22.1, 7.5, 3.0, W_TOP - 0.2, 35.7)

// -------------------------------------------------------------- the tower ---
type Stage = { ap: number; z0: number; z1: number; para: number; pin: number }
const STAGES: Stage[] = [
  { ap: 15.0, z0: 0, z1: 75.3, para: 77.3, pin: 79.0 },
  { ap: 12.5, z0: 75.3, z1: 93.5, para: 95.3, pin: 96.8 },
  { ap: 10.8, z0: 93.5, z1: 104.3, para: 105.5, pin: 106.6 },
]
for (const [k, s] of STAGES.entries()) {
  const R = regular(8, s.ap)
  // the top stage is faced in pale terra-cotta, the rest in buff brick
  walls(k === STAGES.length - 1 ? trim : brick, R, s.z0, s.z1)
  // pale terra-cotta band under the setback, and the parapet above it
  const P = regular(8, s.ap + 0.15)
  walls(trim, P, s.z1 - 2.0, s.para)
  capPoly(trim, offset(P, -0.6), s.para, true)
  walls(trim, offset(P, -0.6), s.para, s.z1)
  // pinnacles at the eight corners
  for (const c of P) box(trim, c[0], c[1], 0.55, 0.55, s.z1 - 2.0, s.pin, Math.atan2(c[1], c[0]))
  // the roof of the setback, inside the parapet
  if (k < STAGES.length - 1) capPoly(roofP, offset(P, -0.6), s.z1 + 0.05, true)
}
// Window panels: five narrow bays per face on the shaft and the second
// stage (three storeys a panel), two tall arched-head bays per face on top.
{
  const floors = (z0: number, z1: number, h = 3.75 * 3, gap = 1.9): [number, number][] => {
    const out: [number, number][] = []
    for (let z = z0; z + h - gap <= z1 + 0.01; z += h) out.push([z, z + h - gap])
    return out
  }
  bayPanels(win, regular(8, 15.0), floors(STREET + 2.0, 73.0), 1.0, 1.35, 4)
  bayPanels(win, regular(8, 12.5), floors(76.8, 91.4), 0.95, 1.3, 4)
  // top stage: two tall windows per face, 95.5 to 102.3
  const R = regular(8, 10.8)
  bayPanels(win, R, [[95.6, 101.6]], 2.4, 1.4, 4)
  // their round heads: a semicircle on each panel
  for (let i = 0; i < R.length; i++) {
    const a = R[i], b = R[(i + 1) % R.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.max(1, Math.floor((L - 1.4) / (2.4 + 1.4))), w = (L - 1.4 * (n + 1)) / n
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o = outN(a, b)
    for (let k = 0; k < n; k++) {
      const s0 = 1.4 + k * (w + 1.4), cx = s0 + w / 2, rad = w / 2
      const C: V3 = [a[0] + t[0] * cx + o[0] * 0.05, a[1] + t[1] * cx + o[1] * 0.05, 101.6]
      const SEG = 8
      for (let j = 0; j < SEG; j++) {
        const q0 = (Math.PI * j) / SEG, q1 = (Math.PI * (j + 1)) / SEG
        const P0: V3 = [C[0] + t[0] * rad * Math.cos(q0), C[1] + t[1] * rad * Math.cos(q0), C[2] + rad * Math.sin(q0)]
        const P1: V3 = [C[0] + t[0] * rad * Math.cos(q1), C[1] + t[1] * rad * Math.cos(q1), C[2] + rad * Math.sin(q1)]
        tf(win, C, P0, P1, [o[0], o[1], 0])
      }
    }
  }
}

// --------------------------------------------------------- the tile crown ---
const EAVE = 104.5, R_EAVE = 10.4, TOP = 116.5, R_TOP = 2.2
{
  const lo = regular(8, R_EAVE), hi = regular(8, R_TOP)
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    const m: XY = [(lo[i][0] + lo[j][0]) / 2, (lo[i][1] + lo[j][1]) / 2]
    qf(tile, [lo[i][0], lo[i][1], EAVE], [lo[j][0], lo[j][1], EAVE], [hi[j][0], hi[j][1], TOP], [hi[i][0], hi[i][1], TOP], [m[0], m[1], 8])
  }
  // Dormers: a small gabled box on each face at the foot of the roof.
  const slope = (TOP - EAVE) / (R_EAVE - R_TOP)
  for (let i = 0; i < 8; i++) {
    const az = (i * 45 * Math.PI) / 180, d: XY = [Math.sin(az), Math.cos(az)], e: XY = [Math.cos(az), -Math.sin(az)]
    const r0 = R_EAVE - 0.6, r1 = R_EAVE - 3.2, hw = 0.95, zb = EAVE + 0.3, zw = EAVE + 2.6, zr = zw + 1.1
    const P = (r: number, u: number, z: number): V3 => [d[0] * r + e[0] * u, d[1] * r + e[1] * u, z]
    // front wall (pentagon), sides, gable roof planes, back into the tile
    const D: V3 = [d[0], d[1], 0], E: V3 = [e[0], e[1], 0]
    qf(dark, P(r0, -hw, zb), P(r0, hw, zb), P(r0, hw, zw), P(r0, -hw, zw), D)
    tf(dark, P(r0, -hw, zw), P(r0, hw, zw), P(r0, 0, zr), D)
    const zIn = (r: number) => EAVE + (R_EAVE - r) * slope
    qf(dark, P(r0, hw, zb), P(r1, hw, Math.max(zb, zIn(r1) - 0.2)), P(r1, hw, zw), P(r0, hw, zw), E)
    qf(dark, P(r1, -hw, Math.max(zb, zIn(r1) - 0.2)), P(r0, -hw, zb), P(r0, -hw, zw), P(r1, -hw, zw), [-E[0], -E[1], 0])
    qf(dark, P(r0, hw, zw), P(r1, hw, zw), P(r1, 0, zr), P(r0, 0, zr), [E[0], E[1], 1])
    qf(dark, P(r1, -hw, zw), P(r0, -hw, zw), P(r0, 0, zr), P(r1, 0, zr), [-E[0], -E[1], 1])
  }
  // The lantern: an octagonal copper drum, a cornice and a small cap.
  const L0 = regular(8, 1.9)
  walls(tile, L0, TOP - 0.3, 121.8)
  const C1 = regular(8, 2.2)
  walls(tile, C1, 121.8, 122.4)
  capPoly(tile, C1, 122.4, true)
  const capR = regular(8, 1.6)
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    tf(tile, [capR[i][0], capR[i][1], 122.4], [capR[j][0], capR[j][1], 122.4], [0, 0, 124.5], [capR[i][0] + capR[j][0], capR[i][1] + capR[j][1], 2])
  }
  // The flagpole.
  box(dark, 0, 0, 0.18, 0.18, 124.4, 154.1)
}

// ----------------------------------------------------------------- output ---
// Colours from daylight photos, pulled to the palette's lightness: buff
// brick, pale terra-cotta trim, the green Ludowici tile and copper, the
// dormers' dark bronze.
const crownLit = (p: V3, n: V3) => (p[2] < 75 ? 0 : n[2] > 0.8 ? 0.3 : p[2] < 93 ? 0.45 : 0.95)
const parts = [
  { part: brick, material: { ...finish('towerlife-brick', 0xd8bf96), floodlight: crownLit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: crownLit } },
  { part: win, material: PALETTE.window },
  { part: tile, material: { ...finish('towerlife-tile', 0x86aa8a), floodlight: (p: V3) => (p[2] > 104 ? 0.6 : 0) } },
  { part: dark, material: finish('towerlife-dormer', 0x6e5f52) },
  { part: roofP, material: PALETTE.roof },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Tower Life Building', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 154.1, anchor: [29.4228678, -98.4913878],
  replaces: ['way/60586390', 'way/360103243', 'way/79788377', 'way/80312693', 'way/80312696', 'way/360103238', 'way/360103237'],
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/sat-tower-life-building.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
