/**
 * Powell Hall at the Jack C. Taylor Music Center, 718 N Grand Blvd, St.
 * Louis: the St. Louis Theatre (1925; Rapp and Rapp), the St. Louis
 * Symphony's hall since 1968, with Snøhetta's expansion (opened September
 * 2025) — original procedural geometry, CC0-1.0.
 * bun generators/stl-powell-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 29.3, the building's own axis: -x is the Grand Blvd
 * side. Anchor = the centroid of OSM way/202425813, -90.2299637, 38.6401338.
 *
 * What stands now: OSM way/202425813 was redrawn for the expansion
 * (start_date 2025-11-25): the 1925 hall (x -47.6..10, y -17.8..27), the
 * new curved lobby wrapping its south end towards the corner of Grand and
 * Samuel Shepard Dr (to y -38.6), and the new east wing (x 10..52). The
 * 2017 lidar predates the expansion, and I found no licensed photo of it,
 * so the new parts follow the OSM outline and the published descriptions:
 * a large arched glass curtain wall facing south-west towards Grand, a
 * second three-storey glass wall facing east, "scalloped walls, a grainy
 * brick facade and glazed arches", a "glass ribbon" where new meets old
 * (SLSO, Dezeen 2022, AIA New York). Their heights are estimates.
 *
 * Identity of the old hall (p1, p2): a long buff terracotta and brick front
 * on Grand Blvd, a row of tall round-arched windows in arched surrounds,
 * medallions and a deep cornice; at its south end a taller pavilion with a
 * giant arched window over the entrance canopy.
 *
 * Heights: the old hall from USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018
 * (1 m, class 18 kept), y = 0 the Grand Blvd pavement (2 m over the box's
 * ground_min): the Grand Blvd range 27–28.5, the auditorium 30–31, its
 * stage end 31–34, the south pavilion 28.5. Estimated: the new lobby 14 m
 * (three storeys of glass; a 27 ft artwork fills it), the east wing 18 m,
 * their arches.
 * Left out: the ornament's detail, the signs.
 *
 * Night: the new glass walls and the old arched windows glow.
 *
 * Photos (EVIDENCE):
 *  p1  "Powell Symphony hall", Matthew Black, CC BY-SA 2.0 (Flickr 1236268411; Grand Blvd side, before 2023)
 *  p2  "Powell Symphony Hall", Chris Yunker, CC BY 2.0 (Flickr 4608213398)
 * Published: slso.org ("Powell Hall's expansion design honors past, looks to the future";
 * "Get to know the Jack C. Taylor Music Center"); dezeen.com 6 May 2022; aiany.org.
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { archShape, box, cornice, onWall, prism, rectShape, save, type XY } from './atl-tech-tower'
import { ccw, edgePanels, at, offset } from './atl-flatiron-building'
import { discShape } from './stl-cathedral-basilica'

const terra = new Part(), brick = new Part(), win = new Part(), roof = new Part(), newBrick = new Part(), glass = new Part()
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// ── The 1925 hall ──
box(terra, -47.6, -38.0, -17.8, 27.0, 0, 27.8, null, 0) // the Grand Blvd range
cornice(terra, rect(-47.6, -38.0, -17.8, 27.0), 26.8, 1.0, 0.5, roof)
box(brick, -38.0, 10.0, -17.8, 27.0, 0, 30.5, roof, 0.3) // the auditorium
box(brick, 2.0, 10.0, -11.0, 22.0, 30.5, 33.5, roof, 0.2) // the stage end
box(terra, -47.6, -36.0, -17.8, -5.0, 27.8, 28.8, roof, 0.2) // the south pavilion's attic
{
  const a: XY = [-47.6, 27.0], b: XY = [-47.6, -17.8], L = 44.8
  // the giant arched window over the entrance, in the south pavilion
  onWall(terra, a, b, archShape(L - 6.4, 7.8, 6.0, 18.0, 12), 0.08)
  onWall(win, a, b, archShape(L - 6.4, 6.0, 6.5, 18.0, 12), 0.14)
  for (const d of [-1.5, 0, 1.5]) onWall(terra, a, b, rectShape(L - 6.4 + d - 0.13, L - 6.4 + d + 0.13, 6.5, 18.5), 0.18)
  onWall(terra, a, b, discShape(L - 6.4, 19.6, 1.3, 12), 0.18)
  // the entrance canopy
  box(roof, -51.0, -47.6, -16.5, -4.0, 5.2, 6.0, roof, 0.1, true)
  // the row of round-arched windows along Grand Blvd, medallions over the piers
  for (let k = 0; k < 5; k++) {
    const s = 3.6 + k * 6.6
    onWall(terra, a, b, archShape(s, 4.0, 7.5, 14.0, 10), 0.08)
    onWall(win, a, b, archShape(s, 3.0, 8.0, 14.0, 10), 0.12)
    onWall(win, a, b, rectShape(s - 1.1, s + 1.1, 1.0, 4.2), 0.06) // doors and shop windows
  }
  for (let k = 0; k < 5; k++) onWall(terra, a, b, discShape(6.9 + k * 6.6, 19.0, 0.8, 10), 0.1)
}
edgePanels(win, [10, 27], [-38, 27], 4, 26, { group: 7, gap: 2, bay: 8, pier: 5, margin: 3, out: 0.05 })

// ── The 2025 expansion ──
// the curved lobby wrapping the south end (OSM outline), a scalloped glass front
const LOBBY: XY[] = ccw([[-37.8, -17.8], [-37.6, -27.7], [-34.5, -28.8], [-31.4, -30.5], [-28.6, -32.5], [-25.4, -35.2], [-23.0, -38.3], [-18.6, -37.4], [-13.4, -36.6], [-8.5, -36.4], [-3.9, -36.8], [0.1, -37.6], [3.8, -38.6], [5.6, -37.2], [8.4, -35.2], [11.7, -33.7], [14.8, -32.8], [17.8, -32.4], [17.9, -29.5], [18.1, -26.6], [18.1, -17.8]])
prism(newBrick, LOBBY, 0, 14.0, roof, 0.3)
// glass on every curved face: glazed arches over the full height
for (let i = 0; i < LOBBY.length; i++) {
  const a = LOBBY[i], b = LOBBY[(i + 1) % LOBBY.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 2.5 || (a[1] > -18 && b[1] > -18)) continue
  onWall(glass, a, b, archShape(L / 2, L - 0.5, 0.3, 13.6 - (L - 0.5) / 2, 6), 0.06)
}
// the east wing: grainy brick with a three-storey glass wall facing east
const WING: XY[] = ccw([[10.0, -17.8], [18.1, -26.6], [42.7, -26.8], [42.7, 16.7], [43.0, 21.6], [52.2, 21.5], [52.2, 34.0], [36.8, 34.3], [-4.4, 31.4], [-4.3, 27.0], [10.0, 27.0]])
prism(newBrick, WING, 0, 18.0, roof, 0.3)
{
  const o = offset(WING, 0.3)
  newBrick.loft([at(WING, 17.2), at(o, 17.4)]); newBrick.loft([at(o, 17.4), at(WING, 18.0)])
}
onWall(glass, [42.7, -26.8], [42.7, 16.7], rectShape(3, 40.5, 0.3, 13.5), 0.06)
for (const [a, b] of [[[52.2, 34.0], [36.8, 34.3]], [[36.8, 34.3], [-4.4, 31.4]], [[18.1, -26.6], [42.7, -26.8]]] as [XY, XY][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / 7))
  for (let k = 0; k < n; k++) onWall(glass, a, b, archShape(((k + 0.5) * L) / n, Math.min(4.5, L / n - 1.4), 1.0, 11.5, 8), 0.06)
}
// the "glass ribbon" where the new meets the old on Grand Blvd
box(glass, -48.0, -37.6, -18.4, -17.2, 0, 26.0, glass, 0)

const lit = (p: V3, n: V3) => (p[0] < -47 && Math.abs(n[0]) > 0.7 ? 0.7 : 0)
await save('stl-powell-hall', 'Powell Hall at the Jack C. Taylor Music Center', [
  { part: terra, material: { ...finish('stl-powell-terracotta', 0xe2d3b4), floodlight: lit } },
  { part: brick, material: finish('stl-powell-brick', 0xc7ad86) },
  { part: newBrick, material: finish('stl-powell-new-brick', 0xb99f86) },
  { part: win, material: PALETTE.window },
  { part: glass, material: windowVariant(2, 0x8ea5b4) },
  { part: roof, material: PALETTE.roof },
], { height: 33.5, anchor: [38.6401338, -90.2299637], bearing: 29.3 })
