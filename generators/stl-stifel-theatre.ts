/**
 * Stifel Theatre (Kiel Opera House, Peabody Opera House), 1400 Market St,
 * St. Louis (1932–1934; LaBeaume & Klein; the opera house half of the
 * Municipal Auditorium) — original procedural geometry, CC0-1.0.
 * bun generators/stl-stifel-theatre.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 17.2, the street grid: +y is the Market St front.
 * Anchor = the centroid of OSM way/108705184, -90.2019588, 38.6276202.
 *
 * Identity (from the photos below):
 *  1. The Market St front: a recessed colonnade of eight giant Corinthian
 *     columns between two broad pylons carved with inscriptions, over a
 *     row of doors and a wide flight of steps; a tall attic band carved
 *     with the building's dedication and medallions, a cresting along its
 *     top.                                                       (p1, p2)
 *  2. Plain limestone side wings with grouped windows; the big auditorium
 *     block and the stage's fly tower rising behind.         (p1, lidar)
 *
 * Plan: OSM way/108705184 turned to bearing 17.2: the front block x -30..
 * 25.6 to y 45.5, the wings x -47.7..43.5, the auditorium and stage between;
 * the south edge follows Enterprise Center's curved north wall.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018 (flown 2017),
 * 1 m grid with class 18 kept; y = 0 is the box's ground_min, on the west
 * (Market St is 3.5–4 m up). Measured: the side wings 25, the front block's
 * attic 28, the auditorium's walls 37–38 and its stepped roof to 45, the
 * stage house 45–48 with the fly tower to 54.6, the low rear range 19.
 * Doubt: in the wedge between the stage and the arena the lidar rises from
 * 30 to 38 m towards the east; that matches Enterprise Center's sloping
 * roof edge, not the theatre, so the wedge is drawn at the 19 m range
 * the lidar shows at its east and west ends.
 * Estimated from p1 and p2: the colonnade (columns 1.6 m across, x -20..15,
 * the loggia 3 m deep, 7.5–22.5), the pylons, the doors, the steps
 * (to the 5 m floor), the window bays (~4 m, two storeys a panel).
 * Review round 1: the loggia is a real recess, its dark wall 4.9 m behind
 * the front plane of the pylons; the eight columns are round (14 sides),
 * pale and 2.2 m across at the capital.
 * Left out: the carving, the lettering, the bears on the cheeks of the
 * steps, the cresting's detail (a plain band).
 *
 * Night: the front is floodlit; the loggia windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  p1  "Stifel Theatre, Market Street, St. Louis, MO.jpg", Warren LeMay, CC BY-SA 2.0 (north-east)
 *  p2  "St. Louis, Missouri - Municipal Auditorium. Peabody Opera House. - panoramio.jpg", MARELBU,
 *      CC BY 3.0 (the front)
 *  p3  "Detail, Kiel Opera House, St. Louis, Missouri LCCN2010630549", Carol M. Highsmith, public domain
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, cornice, hipRoof, onWall, prism, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { ccw, edgePanels } from './atl-flatiron-building'

const lime = new Part(), win = new Part(), roof = new Part(), door = new Part(), col = new Part()
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const panelOpts = { group: 7.0, gap: 1.6, bay: 4.0, pier: 2.0, margin: 2.0, out: 0.06, min: 5 }
const block = (x0: number, x1: number, y0: number, y1: number, top: number, wins = true, z0w = 6) => {
  box(lime, x0, x1, y0, y1, 0, top, roof, 0.3)
  cornice(lime, rect(x0, x1, y0, y1), top - 0.9, 0.9, 0.4, null)
  if (!wins) return
  const r = ccw(rect(x0, x1, y0, y1))
  for (let i = 0; i < 4; i++) edgePanels(win, r[i], r[(i + 1) % 4], z0w, top - 2.5, panelOpts)
}

// ── The rear range, the wings, the auditorium, the stage and fly tower ──
// the wedge against Enterprise Center (south edge from OSM)
prism(lime, ccw([[-50.4, -43.1], [-40.1, -37.6], [-33.7, -34.2], [-25.3, -31.3], [-10.2, -31.9], [1.8, -33.1], [14.5, -37.9], [25.1, -45.5], [34.0, -55.5], [40.3, -65.7], [44.6, -63.4], [44.6, -32.0], [-50.4, -32.0]]), 0, 19, roof, 0.3)
block(-47.7, -25.0, -32.0, 38.0, 25.0)
block(25.0, 43.5, -32.0, 38.0, 25.0)
block(-51.4, -47.0, -29.8, -6.5, 25.0, false)
block(-25.0, 25.0, -7.0, 38.0, 37.5, false)
hipRoof(roof, -25.0, 25.0, -7.0, 38.0, 37.5, 41.5, 0)
box(lime, -14, 10, 4, 28, 37.5, 45.0, roof, 0.3) // the auditorium's raised middle (lidar steps 40–45)
block(-45.0, 43.0, -32.0, -7.0, 38.0, false)
block(-22.0, 18.0, -31.0, -9.0, 48.0, false)
hipRoof(roof, -22.0, 18.0, -31.0, -9.0, 48.0, 54.6, 0)

// ── The front block on Market St ──
const FY = 45.5, FL = -30.0, FR = 25.6
const LX0 = -21.0, LX1 = 16.6, LZ0 = 7.5, LZ1 = 22.5, REC = FY - 3.0, FF = FY + 1.9 // FF: the front plane
// the block behind the loggia, the two pylons, the podium and the attic over the colonnade
block(FL, FR, 38.0, REC, 28.0, false)
for (const [x0, x1] of [[FL, LX0], [LX1, FR]]) block(x0, x1, REC - 0.1, FF, 28.0, false)
box(lime, LX0, LX1, REC - 0.1, FF, 0, LZ0, lime, 0.05) // the podium under the colonnade
box(lime, LX0, LX1, REC - 0.1, FF, LZ1, 28.0, null, 0) // the entablature and attic over it
lime.quad([LX0, REC, LZ1], [LX0, FF, LZ1], [LX1, FF, LZ1], [LX1, REC, LZ1]) // the loggia's ceiling
cornice(lime, rect(FL, FR, REC, FF), 27.1, 0.9, 0.4, null)
box(lime, -24.4, 24.4, 36.6, 37.6, 37.5, 38.7, lime, 0.1) // the cresting tops the auditorium's front wall (p1, p2)
// the dedication band and medallions on that wall, over the front block
onWall(lime, [25.0, 38.0], [-25.0, 38.0], rectShape(3.0, 47.0, 30.0, 34.5), 0.12)
// the loggia: a dark wall set 4.9 m back, eight round, pale columns in the front plane
onWall(win, [LX1, REC], [LX0, REC], rectShape(0.2, LX1 - LX0 - 0.2, LZ0, LZ1), 0.05)
for (let k = 0; k < 8; k++) {
  const x = LX0 + 2.0 + (k * (LX1 - LX0 - 4.0)) / 7
  revolve(col, [x, FY + 0.8], [[1.05, LZ0], [1.05, LZ0 + 0.5], [0.85, LZ0 + 0.8], [0.76, LZ1 - 1.6], [0.98, LZ1 - 1.0], [1.12, LZ1 - 0.2], [1.12, LZ1]], 14, 0, false, false)
}
// the inscription panels on the pylons, and the doors in the podium
for (const [x0, x1] of [[FL + 2.2, LX0 - 2.2], [LX1 + 2.2, FR - 2.2]]) onWall(lime, [FR, FF], [FL, FF], rectShape(FR - x1, FR - x0, 9.5, 20.5), 0.12)
for (let k = 0; k < 7; k++) {
  const x = LX0 + 3.0 + (k * (LX1 - LX0 - 6.0)) / 6
  onWall(door, [FR, FF], [FL, FF], rectShape(FR - x - 0.9, FR - x + 0.9, 3.8, 6.6), 0.08)
}
// the steps up from Market St (the floor is ~5 m up; the pavement 3.5–4)
for (let k = 0; k < 4; k++) box(lime, -26 + k * 0.3, 22 - k * 0.3, FF, FF + 5.2 - k * 1.2, 0, 3.8 + 0.3 * (k + 1), lime, 0.03)
// cheeks of the stairs with the bears' plinths
for (const x of [-27.5, 23.5]) box(lime, x - 1.4, x + 1.4, FF, FF + 4.8, 0, 6.2, lime, 0.15)
// the front block's flanks: windows
for (const [a, b] of [[[FR, 38.0], [FR, FY]], [[FL, FY], [FL, 38.0]]] as [XY, XY][]) edgePanels(win, a, b, 6, 25, { ...panelOpts, min: 3, margin: 1.2 })

const lit = (p: V3, n: V3) => (n[1] > 0.7 ? 0.9 : n[2] > 0.8 ? 0 : 0.3)
await save('stl-stifel-theatre', 'Stifel Theatre', [
  { part: lime, material: { ...finish('stl-kiel-limestone', 0xddd8cc), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: door, material: finish('stl-kiel-door', 0x4d4a46) },
  { part: col, material: { ...finish('stl-kiel-columns', 0xebe7dc), floodlight: () => 0.9 } },
], { height: 54.6, anchor: [38.6276202, -90.2019588], bearing: 17.2 })
