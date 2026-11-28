/**
 * Wainwright Building, 709 Chestnut St at 7th St, St. Louis (1890–1891;
 * Adler & Sullivan; Louis Sullivan's first skyscraper, a National Historic
 * Landmark) — original procedural geometry, CC0-1.0.
 * bun generators/stl-wainwright-building.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 17.4: -y is the Chestnut St front, +x the 7th St
 * front. Anchor = the centroid of OSM way/109152488, -90.1921392, 38.6270921.
 *
 * Identity (from the photos below):
 *  1. A red-brown cube: a two-storey sandstone base with big windows under
 *     a belt course; seven storeys of tall brick piers, one between every
 *     window, with wide plain piers at the corners; ornamented terracotta
 *     spandrels recessed between the piers.                       (p1, p4)
 *  2. A deep frieze of terracotta foliage pierced by round windows, under a
 *     thin, far-projecting slab cornice.                           (p1, p4)
 *  3. A U plan above the base, the light court opening to the north.
 *                                                          (lidar, NAIP)
 *
 * Plan: OSM way/109152488 turned to bearing 17.4 for the base (39 x 40 m).
 * Above the base the lidar shows the U: a south range to y -7, a west wing
 * x -17.2..-3 running to the north edge, an east wing x 5..19.4 to y 16,
 * the court between them open to the north. The Wainwright State Office
 * Complex (1981, Mitchell/Giurgola) wraps the site on the west and north;
 * it is a separate building and is not part of this model or `replaces`.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018 (flown 2017),
 * 0.5 m grid with class 18 kept; y = 0 is the box's ground_min, at the west
 * side (Chestnut St is 1 m up, 7th St 1–2 m). Measured: the roof and the
 * cornice's top 41.5 (OSM height 41; 10 storeys). A stair or tank on the
 * roof (to 47) is left out.
 * Estimated from p4 (at ~21.6 px/m on the corner): the base's belt course
 * 10.0, the frieze 34.0–40.3, the cornice slab 40.3–41.5 projecting 1.6 m;
 * seven storeys of 3.43 m in the shaft; 13 bays on Chestnut and 12 on 7th
 * between 3 m corner piers; piers 0.9 m wide and 0.3 m proud of a recessed
 * terracotta-coloured wall, windows 1.45 m wide; the court and alley faces are plain brick with
 * windows (not photographed; kept simple).
 * The base stands on a 1.6 m sandstone plinth: the street sides are up to
 * 1.5 m above y = 0 (Mapterhorn), so the shop windows start at 1.9.
 * Left out: the ornament itself, the entrance surrounds' carving.
 *
 * Night: windows glow; the street fronts are floodlit softly.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  p1  "Wainwright building st louis USA.jpg", public domain (HABS-style, from the south-east)
 *  p2  "Wainwright Building, St. Louis - 4.jpg", dwhartwig, CC BY 2.0
 *  p3  "Wainwright Building, St. Louis - 9.jpg", dwhartwig, CC BY 2.0
 *  p4  "Wainwright Building, 7th Street and Chestnut Street, St. Louis, MO.jpg",
 *      w_lemay, CC BY-SA 2.0 (from the south-east, 2021)
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { onWall, prism, rectShape, save, type XY } from './atl-tech-tower'
import { ccw, edgePanels, offset, wall, at } from './atl-flatiron-building'
import { discShape } from './stl-cathedral-basilica'

const brick = new Part(), orn = new Part(), sand = new Part(), win = new Part(), roof = new Part()

const BASE: XY[] = ccw([[-19.5, -18.6], [19.4, -18.9], [19.4, 16.0], [4.0, 15.9], [4.0, 21.4], [-17.2, 21.5], [-17.2, -4.5], [-19.6, -4.4]])
const U: XY[] = ccw([[-19.5, -18.6], [19.4, -18.9], [19.4, 16.0], [5.0, 16.0], [5.0, -7.0], [-3.0, -7.0], [-3.0, 21.4], [-17.2, 21.5], [-17.2, -4.5], [-19.6, -4.4]])
const BELT = 10.0, FRIEZE = 34.0, CORN = 40.3, TOP = 41.5, STOREY = (FRIEZE - BELT) / 7

// ── The base: two storeys of sandstone, big windows, the belt course ──
prism(sand, BASE, 0, BELT, roof, 0)
{
  const o = offset(BASE, 0.35)
  wall(sand, o, BELT - 0.9, BELT)
  sand.loft([at(BASE, BELT - 1.2), at(o, BELT - 0.9)])
}
// a low sandstone plinth round the base (the street sides are up to 1.5 m above y = 0)
{
  const o = offset(BASE, 0.3)
  wall(sand, o, 0, 1.6)
  sand.loft([at(o, 1.6), at(BASE, 1.75)])
}
// ── The shaft: brick body; the frieze; the slab cornice ──
prism(brick, U, BELT, FRIEZE, null, 0)
prism(orn, U, FRIEZE, CORN, null, 0)
{
  const o = offset(U, 1.6)
  orn.loft([at(U, CORN - 0.4), at(o, CORN)])
  wall(orn, o, CORN, TOP)
  // the top of the cornice and the roof
  const oi = offset(U, 1.45)
  orn.loft([at(o, TOP), at(oi, TOP + 0.08)])
  prism(roof, U, TOP - 0.3, TOP + 0.08, roof, 0)
}

// the street fronts: corner piers, a pier between every window, recessed spandrels
const fronts: [XY, XY, number][] = [[[-19.5, -18.6], [19.4, -18.9], 13], [[19.4, -18.9], [19.4, 16.0], 12]]
for (const [a, b, n] of fronts) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [t[1], -t[0]]
  const P = (s: number, d: number): XY => [a[0] + t[0] * s + nn[0] * d, a[1] + t[1] * s + nn[1] * d]
  const CP = 3.0, inner = L - 2 * CP, bay = inner / n, PW = 0.9
  // the recessed wall between the corner piers reads dark: terracotta spandrels and shadow
  onWall(orn, a, b, rectShape(CP, L - CP, BELT, FRIEZE), 0.02)
  // corner piers stand proud the full height of the shaft
  for (const s0 of [0, L - CP]) {
    const q0 = P(s0, 0), q1 = P(s0 + CP, 0), q2 = P(s0 + CP, 0.3), q3 = P(s0, 0.3)
    prism(brick, ccw([q0, q1, q2, q3]), BELT, FRIEZE, null, 0)
  }
  for (let k = 0; k <= n; k++) {
    const s = CP + k * bay
    if (k > 0 && k < n) {
      const q0 = P(s - PW / 2, 0), q1 = P(s + PW / 2, 0), q2 = P(s + PW / 2, 0.3), q3 = P(s - PW / 2, 0.3)
      prism(brick, ccw([q0, q1, q2, q3]), BELT, FRIEZE, null, 0)
    }
    if (k === n) break
    const c = CP + (k + 0.5) * bay, w = Math.min(bay - PW - 0.3, 1.45)
    for (let f = 0; f < 7; f++) {
      const z0 = BELT + f * STOREY
      onWall(win, a, b, rectShape(c - w / 2, c + w / 2, z0 + 0.9, z0 + 2.95), 0.05)
    }
    // round windows in the frieze, one a bay
    onWall(win, a, b, discShape(c, FRIEZE + 3.4, 0.38, 8), 0.05)
    // the base: a shop window and a second-floor window a bay
    onWall(win, a, b, rectShape(c - (bay - 0.7) / 2, c + (bay - 0.7) / 2, 1.9, 4.9), 0.05)
    onWall(win, a, b, rectShape(c - w / 2, c + w / 2, 5.9, 8.4), 0.05)
  }
  // the frieze's ornament reads as a darker band with a moulding under it
  onWall(brick, a, b, rectShape(0, L, FRIEZE - 0.05, FRIEZE + 0.35), 0.12)
}
// the entrances: on 7th St (east, centre) and Chestnut St (south, centre), sandstone surrounds
for (const [a, b] of [[[-19.5, -18.6], [19.4, -18.9]], [[19.4, -18.9], [19.4, 16.0]]] as [XY, XY][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  onWall(sand, a, b, rectShape(L / 2 - 1.8, L / 2 + 1.8, 0.0, 6.2), 0.32)
  onWall(win, a, b, rectShape(L / 2 - 1.1, L / 2 + 1.1, 1.0, 5.2), 0.36) // the glazed doors
}

// the court and alley faces: plain brick with windows, two storeys a panel
for (let i = 0; i < U.length; i++) {
  const a = U[i], b = U[(i + 1) % U.length]
  const street = (Math.abs(a[1] + 18.7) < 0.5 && Math.abs(b[1] + 18.7) < 0.5) || (Math.abs(a[0] - 19.4) < 0.2 && Math.abs(b[0] - 19.4) < 0.2)
  if (street) continue
  edgePanels(win, a, b, BELT + 0.9, FRIEZE - 0.8, { group: 2 * STOREY, gap: 1.4, bay: 2.6, pier: 0.9, margin: 1.2, out: 0.05, min: 3 })
}

const lit = (p: V3, n: V3) => ((n[1] < -0.7 || n[0] > 0.7) ? 0.5 : 0)
await save('stl-wainwright-building', 'Wainwright Building', [
  { part: brick, material: { ...finish('stl-wainwright-brick', 0xc27c5f), floodlight: lit } },
  { part: orn, material: { ...finish('stl-wainwright-terracotta', 0xa9644b), floodlight: lit } },
  { part: sand, material: { ...finish('stl-wainwright-sandstone', 0xc68a6f), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
], { height: TOP + 0.1, anchor: [38.6270921, -90.1921392], bearing: 17.4 }, 6500)
