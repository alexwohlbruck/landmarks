/**
 * The Dome at America's Center (Trans World Dome, Edward Jones Dome), 701
 * Convention Plaza, St. Louis (1992–1995; HOK) — original procedural
 * geometry, CC0-1.0.  bun generators/stl-dome.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 15.1, the stadium's own axis (OSM's long walls
 * run at 105°): the field runs along y. Anchor = the centroid of OSM
 * way/24963449, -90.1885503, 38.6328219.
 *
 * Identity (from the photos below):
 *  1. A huge low box: red-brown brick lower walls with pale stone bands and
 *     tall glazed curtain-wall bays at the entrances, a grey metal-clad
 *     upper wall with a dark glazed band.                             (p3)
 *  2. The low dome: a pale grey, cushion-like roof on a rounded-rectangle
 *     plan, rising from the box's top to a broad flat crown.     (p2, lidar)
 *
 * Which outline is which: way/24963449 (building=stadium, "The Dome at
 * America's Center") is the stadium box; way/616870972 (building:part,
 * roof:shape=dome, height 62) is its roof, lying inside it. The convention
 * halls are a separate building (way/108706999, America's Center
 * Convention Complex) and are left to the map.
 *
 * Plan: OSM way/24963449 turned to bearing 15.1: about 194 x 236 m; on the
 * west a lower strip (x < -96) at the convention centre's side; the dome
 * part way/616870972 (186 x 227 m, rounded corners).
 *
 * Heights: USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018 (flown 2017),
 * 1 m grid with class 18 kept; y = 0 is the ground round the stadium (4 m
 * over the box's ground_min). Measured: the box's top 28 (corners to 35),
 * the dome's rim 45, its profile 48 at s 0.85, 51 at 0.77, 55 at 0.62,
 * 58.5 at 0.47, 61 at 0.32, its crown 63 (OSM 62); the west strip 18 and 6.
 * Estimated from p3: the brick's top (18), the stone bands, the curtain-
 * wall bays (one in the middle of each side), the dark band (20–23).
 * Left out: the entrance towers' carved caps, signs, the roof's ribs.
 *
 * Night: the curtain walls glow; the dome's rim is floodlit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  p1  "Edward Jones Dome (9721837046).jpg", Paul Sableman, CC BY 2.0 (inside; the roof's span)
 *  p2  "South to the Edward Jones Dome (6075476144).jpg", Paul Sableman, CC BY 2.0
 *  p3  "Edward Jones Dome August 2004 01.jpg", Michael Barera, CC BY-SA 4.0 (an entrance, close up)
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, onWall, prism, rectShape, save, type XY } from './atl-tech-tower'
import { ccw, capPoly, at, offset } from './atl-flatiron-building'

const brick = new Part(), stone = new Part(), metal = new Part(), win = new Part(), roof = new Part()
const OUT: XY[] = ccw(([[81.1, 117.4], [78.4, 117.7], [75.4, 117.8], [72.3, 117.1], [69.1, 116.0], [67.4, 114.9], [67.4, 119.0], [38.7, 119.2], [38.8, 114.5], [-46.2, 114.1], [-65.8, 114.3], [-65.7, 113.3], [-76.1, 113.3], [-76.1, 109.1], [-85.1, 109.1], [-85.0, 98.0], [-91.2, 98.0], [-91.2, 89.6], [-96.4, 89.6], [-96.4, 43.5], [-95.8, -18.7], [-96.1, -100.2], [-92.7, -100.1], [-88.0, -100.7], [-84.0, -102.0], [-80.2, -104.2], [-76.9, -106.9], [-74.5, -109.6], [-72.7, -112.2], [-64.7, -112.2], [-64.7, -116.8], [67.8, -116.4], [67.8, -111.3], [72.0, -113.1], [76.4, -113.8], [80.8, -113.8], [84.8, -112.5], [88.5, -110.5], [91.7, -107.6], [93.8, -105.0], [95.4, -102.1], [96.5, -98.8], [96.6, -95.1], [96.2, -91.3], [95.2, -87.9], [93.7, -85.0], [98.8, -85.0], [98.8, 89.3], [93.0, 89.4], [94.1, 91.3], [95.0, 93.5], [95.7, 96.7], [95.6, 100.3], [95.0, 104.1], [93.8, 107.4], [92.1, 110.1], [90.0, 112.5], [87.6, 114.7], [84.7, 116.4]] as XY[]))
const DOME: XY[] = ccw([[-88.8, -63.9], [-84.3, -76.4], [-76.3, -87.6], [-66.8, -97.0], [-56.6, -104.5], [-43.4, -109.5], [-31.6, -112.1], [33.7, -111.9], [46.6, -109.7], [58.9, -104.4], [70.0, -96.7], [79.5, -87.3], [85.9, -76.5], [91.5, -63.6], [93.9, -50.1], [93.7, 56.2], [90.6, 69.5], [85.7, 82.1], [78.3, 93.8], [69.3, 102.2], [59.8, 107.8], [49.4, 111.5], [37.3, 114.5], [-46.2, 114.1], [-56.9, 109.7], [-67.3, 102.6], [-76.8, 93.0], [-84.1, 81.4], [-89.4, 68.8], [-92.1, 55.0], [-91.7, -50.6]])
const BRICK = 18, TOP = 28, RIM = 45

// ── The box: brick to 18 with stone bands, metal cladding above ──
prism(brick, OUT, 0, BRICK, null, 0)
for (const z of [6.5, 12.5]) { const o = offset(OUT, 0.15); brick.loft([at(OUT, z), at(o, z)]); stone.loft([at(o, z), at(o, z + 1.0)]); brick.loft([at(o, z + 1.0), at(OUT, z + 1.0)]) }
prism(metal, OUT, BRICK, TOP, null, 0)
capPoly(roof, OUT, TOP, true)
// the west strip by the convention centre
box(brick, -108.2, -96.0, -3.4, 38.1, 0, 18, roof, 0)
box(brick, -112.6, -96.0, -18.6, -3.4, 0, 6, roof, 0)
// the dark glazed band in the metal wall, the curtain-wall bays at the entrances
for (let i = 0; i < OUT.length; i++) {
  const a = OUT[i], b = OUT[(i + 1) % OUT.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 6) continue
  onWall(win, a, b, rectShape(0.5, L - 0.5, 20.0, 23.0), 0.05)
  if (L > 60) for (const c of [L * 0.3, L * 0.7]) {
    onWall(win, a, b, rectShape(c - 7, c + 7, 1.5, BRICK - 1.5), 0.06)
    onWall(stone, a, b, rectShape(c - 7.6, c + 7.6, 0, 0.6), 0.08)
  }
}
// ── The dome: rings of the roof part scaled about its centre, to the lidar profile ──
const C: XY = [0.9, 1.2]
const ring = (k: number): XY[] => DOME.map(([x, y]) => [C[0] + (x - C[0]) * k, C[1] + (y - C[1]) * k] as XY)
prism(metal, DOME, TOP, RIM, null, 0) // the metal-clad drum between the box and the dome's rim
const prof: [number, number][] = [[1.0, RIM], [0.92, 46.2], [0.85, 48], [0.77, 51], [0.62, 55], [0.47, 58.5], [0.32, 61], [0.16, 62.6], [0.04, 63]]
for (let k = 0; k < prof.length - 1; k++) roof.loft([at(ring(prof[k][0]), prof[k][1]), at(ring(prof[k + 1][0]), prof[k + 1][1])])
capPoly(roof, ring(0.04), 63, true)

const lit = (p: V3, n: V3) => (n[2] < 0.5 ? 0.5 : 0)
await save('stl-dome', "The Dome at America's Center", [
  { part: brick, material: finish('stl-dome-brick', 0xb98468) },
  { part: stone, material: { ...finish('stl-dome-stone', 0xe7e1d4), floodlight: lit } },
  { part: metal, material: finish('stl-dome-metal', 0xb4b8bb) },
  { part: win, material: PALETTE.window },
  { part: roof, material: finish('stl-dome-roof', 0xd9dcdd) },
], { height: 63, anchor: [38.6328219, -90.1885503], bearing: 15.1 })
