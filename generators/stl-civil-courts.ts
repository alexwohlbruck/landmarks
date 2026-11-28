/**
 * Clyde S. Cahill Courts Building (the Civil Courts Building until December
 * 2024), 10 N Tucker Blvd at Market St, St. Louis (1928–1930; Klipstein &
 * Rathmann) — original procedural geometry, CC0-1.0.
 * bun generators/stl-civil-courts.ts
 *
 * Name: the City renamed it by Ordinance 71921 (Board Bill 92, 2024–25,
 * effective 15 Dec 2024); the circuit court calls it the "Clyde S. Cahill
 * Courts Building", as OSM does (way/565578443, old_name "Civil Courts
 * Building", wikidata Q5124455).
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 16.1, the street grid: -y is the Market St front
 * with the main portal, facing the Gateway Mall. Anchor = the centroid of
 * OSM way/565578443, -90.1971931, 38.6275759.
 *
 * Identity (from the photos below):
 *  1. A limestone slab of 13 storeys with a carved frieze under its
 *     cornice, a narrower attic stage over it.                    (p2, p3)
 *  2. The top, after the Mausoleum of Halicarnassus: a colonnade of 32
 *     Ionic columns (nine a side, counting the corners) round a recessed
 *     two-storey stage, a deep entablature, a plain attic, and a stepped
 *     pyramid of cast aluminium crowned by sculpture.             (p2, p3)
 *  3. The Market St portal: two columns in antis in a tall recess.     (p3)
 *
 * Plan: OSM way/565578443 turned to bearing 16.1: 52 x 42 m with shallow
 * end bays; the pyramid part way/565578444 (34.5 x 28 m at its foot).
 *
 * Heights: USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018 (flown 2017),
 * 0.5 m grid with class 18 kept, read with tools/lidar_frame.py; y = 0 is
 * 1.5 m over the box's ground_min (the Market St pavement; an areaway on the
 * north dips lower). The cloud has no returns on the east third of the roof,
 * so the west half is mirrored. Measured: the slab's cornice 70.5 (a 2 m
 * ledge), the entablature over the colonnade 92.5–94.5, the pyramid's steps
 * 101.5 at its foot, 103.5, 106.5, 109.5, 112.5, apex 116.5, sculpture to
 * 118.0. Published: roof 386 ft (118 m), 13 floors, columns 42 ft (13 m)
 * and 5.5 ft across, two 12 ft sphinx-like figures at the top (Wikipedia).
 * Estimated from p2 and p3: the attic stage (70.5–78.5), the colonnade
 * (78.5–91.5) and its recessed, glazed wall (2.5 m back),
 * the window grid (seven bays a face, two storeys a panel), the frieze, the
 * top attic's height (93.5–97.5, thin in p3; the pyramid rises from it),
 * portal. The figures at the entablature's corners (two show in p3) are
 * drawn on all four corners, by symmetry; the apex group is a simple block.
 * Left out: the fluting, the frieze's carving, the flagpoles.
 *
 * Night: the colonnade and pyramid are floodlit; windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  p1  "St. Louis Civil Courts Building rear facade.jpg", Triciaburmeister, CC BY-SA 4.0
 *  p2  "Civil Courts Building (2011).jpg", US District Court for the Eastern
 *      District of Missouri, public domain (from the south-west)
 *  p3  "St Louis Civil Courts, 2007.jpg", Matthew Black, CC BY-SA 2.0 (the Market St front)
 *  p4  "St. Louis Civil Courts Building 10252023 KV1.jpg", Kvescovo, CC BY-SA 4.0
 * Published: en.wikipedia.org/wiki/Civil_Courts_Building;
 * stlouis-mo.gov Board Bill 92 (2024–2025).
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, cornice, onWall, prism, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { ccw, edgePanels } from './atl-flatiron-building'

const lime = new Part(), win = new Part(), roof = new Part(), metal = new Part(), door = new Part()
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const S = (x0: number, x1: number, y: number): [XY, XY] => [[x0, y], [x1, y]]

const MAIN = 70.5, ATTIC = 78.5, COLTOP = 91.5, ENT = 94.0, TOPATTIC = 97.5, APEX = 116.5
const SLAB: XY[] = ccw([[-24.5, 20.9], [-24.5, 11.8], [-25.9, 11.8], [-25.9, -11.7], [-24.5, -11.7], [-24.5, -20.9], [24.4, -20.9], [24.4, -11.9], [26.0, -11.9], [26.0, 11.9], [24.3, 11.9], [24.3, 20.9]])
const win2 = { group: 7.4, gap: 1.6, bay: 6.6, pier: 3.6, margin: 2.0, out: 0.06, min: 4 }

// ── The slab ──
prism(lime, SLAB, 0, MAIN, roof, 0.35)
cornice(lime, SLAB, MAIN - 1.4, 1.4, 0.6, roof)
for (let i = 0; i < SLAB.length; i++) {
  const a = SLAB[i], b = SLAB[(i + 1) % SLAB.length]
  const front = a[1] < -20 && b[1] < -20
  edgePanels(win, a, b, front ? 16.0 : 5.0, 60.0, win2)
  // the frieze band under the cornice
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L > 6) onWall(lime, a, b, rectShape(1.0, L - 1.0, 62.6, 64.6), 0.18)
}
// the Market St portal: a tall recess with two columns in antis, three doors
{
  const [a, b] = S(-24.5, 24.4, -20.9), m = 24.5
  box(lime, -9.5, 9.5, -21.6, -20.9, 0, 17.0, lime, 0.2) // the frame standing proud
  onWall(win, [-9.5, -21.6], [9.5, -21.6], rectShape(2.0, 17.0, 1.2, 14.4), 0.04) // the shadowed recess (glazed)
  for (const x of [-2.4, 2.4]) revolve(lime, [x, -22.2], [[0.95, 1.2], [0.85, 13.6], [1.1, 13.8], [1.1, 14.4]], 12, 0, false, false)
  for (const d of [-5.6, 0, 5.6]) onWall(door, [-9.5, -21.6], [9.5, -21.6], rectShape(9.5 + d - 1.1, 9.5 + d + 1.1, 1.2, 6.4), 0.07)
  box(lime, -9.5, 9.5, -22.8, -21.6, 14.4, 17.0, lime, 0.15)
  box(lime, -9.5, 9.5, -24.4, -21.6, 0, 1.2, lime, 0.05) // steps
  void a; void b; void m
}

// ── The attic stage over the slab ──
const AX = 22.5, AY = 18.5
box(lime, -AX, AX, -AY, AY, MAIN, ATTIC, null, 0)
cornice(lime, rect(-AX, AX, -AY, AY), ATTIC - 0.8, 0.8, 0.3, roof)
for (const [a, b] of [S(-AX, AX, -AY), [[AX, -AY], [AX, AY]], [[AX, AY], [-AX, AY]], [[-AX, AY], [-AX, -AY]]] as [XY, XY][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  for (let k = 0; k < 5; k++) onWall(win, a, b, rectShape(L / 2 + (k - 2) * 6.6 - 0.5, L / 2 + (k - 2) * 6.6 + 0.5, 73.2, 74.6), 0.06)
}

// ── The colonnade: nine Ionic columns a side round a recessed wall ──
const WX = 19.8, WY = 15.8
box(lime, -WX, WX, -WY, WY, ATTIC, COLTOP, null, 0)
for (const [a, b] of [S(-WX, WX, -WY), [[WX, -WY], [WX, WY]], [[WX, WY], [-WX, WY]], [[-WX, WY], [-WX, -WY]]] as [XY, XY][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n = 8, step = L / n
  // the recess reads dark between the columns (p2, p3): two tall glazed bands a bay
  for (let k = 0; k < n; k++) for (const [z0, z1] of [[79.0, 84.6], [85.4, 91.0]]) onWall(win, a, b, rectShape(k * step + 0.35, (k + 1) * step - 0.35, z0, z1), 0.06)
}
const CX = 21.4, CY = 17.4
const colAt: XY[] = []
for (let k = 0; k < 9; k++) {
  const x = -CX + (2 * CX * k) / 8, y = -CY + (2 * CY * k) / 8
  colAt.push([x, -CY], [x, CY])
  if (k > 0 && k < 8) colAt.push([-CX, y], [CX, y])
}
for (const c of colAt) {
  // base, tapering shaft, a flared Ionic capital
  revolve(lime, c, [[1.05, ATTIC], [1.05, ATTIC + 0.5], [0.85, ATTIC + 0.7], [0.72, COLTOP - 1.0], [0.95, COLTOP - 0.6], [1.1, COLTOP - 0.3], [1.1, COLTOP]], 10, 0, false, false)
}
// the entablature, the ceiling over the colonnade, and the cornice
box(lime, -AX, AX, -AY, AY, COLTOP, ENT - 0.9, null, 0)
lime.quad([-AX, -AY, COLTOP], [-AX, AY, COLTOP], [AX, AY, COLTOP], [AX, -AY, COLTOP])
cornice(lime, rect(-AX, AX, -AY, AY), ENT - 0.9, 0.9, 0.55, roof)
for (const [a, b] of [S(-AX, AX, -AY), [[AX, -AY], [AX, AY]], [[AX, AY], [-AX, AY]], [[-AX, AY], [-AX, -AY]]] as [XY, XY][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  onWall(lime, a, b, rectShape(0.4, L - 0.4, COLTOP + 0.9, COLTOP + 1.1), 0.12) // the architrave's line
}

// ── The top attic, the corner figures, the stepped pyramid, the crowning sculpture ──
const TX = 18.6, TY = 15.0
box(lime, -TX, TX, -TY, TY, ENT, TOPATTIC, null, 0)
cornice(lime, rect(-TX, TX, -TY, TY), TOPATTIC - 0.7, 0.7, 0.3, null)
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  const x = sx * 20.6, y = sy * 16.6
  box(lime, x - 0.9, x + 0.9, y - 0.9, y + 0.9, ENT, ENT + 1.0, lime, 0.15)
  box(lime, x - 0.55, x + 0.55, y - 0.75, y + 0.75, ENT + 1.0, ENT + 3.4, lime, 0.3)
}
// the pyramid: twelve steps from the attic to the apex
{
  const steps = 12, x0 = 17.0, y0 = 13.6, x1 = 1.6, y1 = 1.4
  for (let k = 0; k < steps; k++) {
    const t = k / steps, hx = x0 + (x1 - x0) * t, hy = y0 + (y1 - y0) * t
    const za = TOPATTIC + ((APEX - 1.6 - TOPATTIC) * k) / steps, zb = TOPATTIC + ((APEX - 1.6 - TOPATTIC) * (k + 1)) / steps
    box(metal, -hx, hx, -hy, hy, za, zb, k === steps - 1 ? null : metal, 0.0)
  }
  // the crowning plinth and the paired figures
  box(lime, -1.8, 1.8, -1.6, 1.6, APEX - 1.6, APEX, lime, 0.2)
  for (const s of [-1, 1]) box(lime, -1.4, 1.4, s * 0.3 - 0.45, s * 0.3 + 0.45 + (s > 0 ? 0 : 0), APEX, APEX + 1.5, lime, 0.3)
}

const lit = (p: V3, n: V3) => (p[2] > MAIN ? (n[2] > 0.85 ? 0.2 : 0.9) : 0.15)
await save('stl-civil-courts', 'Clyde S. Cahill Courts Building (Civil Courts Building)', [
  { part: lime, material: { ...finish('stl-courts-limestone', 0xe3dccb), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: metal, material: { ...finish('stl-cast-aluminium', 0xb8b4ab), floodlight: (p) => (p[2] > TOPATTIC ? 0.7 : 0) } },
  { part: door, material: finish('stl-bronze-door', 0x5d564e) },
], { height: APEX + 1.5, anchor: [38.6275759, -90.1971931], bearing: 16.1 }, 6500)
