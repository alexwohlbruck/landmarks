/**
 * Cathedral of St. John the Divine, Amsterdam Avenue at 112th Street —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-st-john-the-divine.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Model north is
 * the liturgical east (the apse, towards Morningside Park); the west front
 * with its two towers is at −y on Amsterdam Avenue; +x is the south side
 * (110th Street). Placed at bearing 118.1°, the outline's long edges.
 * Anchor: area centroid of the OSM multipolygon relation/3624833 (outer
 * way/271461243, with the open court of the unbuilt north transept as its
 * inner ring, way/271461242). Gothic kit from nyc-riverside-church.ts.
 *
 * Evidence
 * - OSM relation/3624833: 183 m long outline, height 51.4 m.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 1 m, read in the model frame.
 *   y = 0 is the lowest ground under the outline, at the east end
 *   (34.9 m NAVD88); the ground falls ~4.5 m from Amsterdam Avenue to the
 *   apse. Heights above y = 0: nave ridge 58.3 m over x = 3, the clerestory
 *   eaves ~43 m at x = −9 and +15, the tall aisles' outer walls 39.5 m at
 *   x = −19.7 and +24.6, buttress pinnacles to ~57 m; the crossing dome's
 *   crown 55.2 m over (3, 14), its rim ~44 m some 18 m out, and the great
 *   arches on the transept sides to ~47 m; the choir ridge 51.7 m, the apse
 *   hipped down by y = 72; the choir's flanking ranges ~21 m and the ring of
 *   chapels ~12 m; the north-west tower's flat top 49.4 m (the south-west
 *   tower read 65.5 m in 2017, under restoration scaffolding, so it is drawn
 *   as the twin of the north-west one, as the photos show); the west gable
 *   to ~58 m between them.
 * - Published: begun 1892 (Heins & LaFarge, Romanesque–Byzantine choir and
 *   crossing), continued from 1909 by Ralph Adams Cram in French Gothic;
 *   601 ft (183 m) long; the nave vault 124 ft; the crossing's 1909
 *   Guastavino tile dome, meant to be temporary; the west towers and the
 *   transepts unfinished (Wikipedia; NRHP 82001189).
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-st-john-the-divine/photos/credits.txt: an aerial
 *   from the west (Gryffindor), the south side with the south-west tower
 *   from the Peace Fountain (Paulo JC Nogueira), a west tower and the nave
 *   side (Rochester), the south transept's great arch with the dome behind
 *   (Chris06), the south-west tower in scaffolding (Petri Krohn).
 *
 * Estimated: window sizes and the bay count (eight nave bays) from the
 * photos; the west portals and rose scaled from the aerial against the
 * 22 m centre bay; the great arches as near-semicircles springing at 31 m
 * on the crossing's 36 m sides (the photo of the south one); the dome as a low ellipsoidal cap on the lidar
 * crown and rim; the unbuilt transepts as their low stubs; the choir's
 * flanking ranges and the chapel ring as plain masses at the lidar heights.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, circle, type XY } from './nyc-570-lexington'
import { block, discPanel, dome } from './nyc-city-hall'
import { pointed, pinnacle, gableY } from './nyc-riverside-church'

const stone = new Part(), win = new Part(), roof = new Part(), cupola = new Part(), dark = new Part()
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const CX = 3.0 // the main axis

// --- Nave: tall aisles to 39.5 m, a clerestory to 43 m, a steep roof to 58.3 m ---
const AX0 = -18.5, AX1 = 23.4, NY0 = -74, NY1 = -4 // walls; the buttress piers reach the outline (−19.7, +24.6)
const CL0 = -9, CL1 = 15
prism({ wall: stone, win: null, roof, ring: rect(AX0, NY0, AX1, NY1), z0: 0, z1: 39.5, facade: null, bevel: 0.4 })
prism({ wall: stone, win: null, roof: null, ring: rect(CL0, NY0, CL1, NY1), z0: 39.4, z1: 43, facade: null, bevel: 0.2 })
gableY(roof, stone, CL0, NY0, CL1, NY1, 43, 58.3, 0.3)
{
  const bays = 8, pitch = (NY1 - NY0) / bays
  for (let i = 0; i <= bays; i++) {
    const y = NY0 + i * pitch
    // buttress piers on the aisle walls, with pinnacles; taller pinnacles flanking the clerestory
    for (const [x0, x1, xp] of [[AX0 - 1.2, AX0, AX0 - 0.6], [AX1, AX1 + 1.2, AX1 + 0.6]]) {
      if (i > 0 && i < bays) block(stone, x0, y - 0.8, x1, y + 0.8, 0, 38)
      pinnacle(stone, xp, y, 0.8, 38, 42, 47)
    }
    if (i > 0 && i < bays && i % 2 === 0) for (const xp of [CL0 - 3.5, CL1 + 3.5]) pinnacle(stone, xp, y, 1.0, 39.5, 47, 57)
  }
  for (let i = 0; i < bays; i++) {
    const yc = NY0 + (i + 0.5) * pitch
    for (const [a, b] of [[[AX0, NY1], [AX0, NY0]], [[AX1, NY0], [AX1, NY1]]] as [XY, XY][]) {
      const s = a[1] > b[1] ? a[1] - yc : yc - a[1]
      pointed(win, a, b, s, 4.4, 17, 35)
      pointed(win, a, b, s, 3.2, 5.5, 12.5)
    }
  }
}

// --- West front: two flat-topped towers flanking the rose and the portals ---
const WY0 = -89, WY1 = NY0
const T0: [number, number] = [-27.4, -8.0], T1: [number, number] = [2 * CX + 8.0, 2 * CX + 27.4]
const TOP = 49.4
for (const [x0, x1] of [T0, T1]) {
  prism({ wall: stone, win: null, roof, ring: rect(x0, WY0, x1, WY1), z0: 0, z1: TOP, facade: null, bevel: 0.4 })
  // corner buttresses stepping back, and the four corner turrets of the unfinished top
  for (const [xc, yc] of [[x0, WY0], [x1, WY0], [x0, WY1], [x1, WY1]] as XY[]) {
    const sx = xc === x0 ? 1 : -1, sy = yc === WY0 ? 1 : -1
    block(stone, Math.min(xc, xc + sx * 3.0), Math.min(yc, yc + sy * 3.0), Math.max(xc, xc + sx * 3.0), Math.max(yc, yc + sy * 3.0), TOP - 0.2, TOP + 3.2)
  }
  // parapet between the turrets
  for (const [a0, b0, a1, b1] of [[x0, WY0, x1, WY0 + 0.6], [x0, WY1 - 0.6, x1, WY1], [x0, WY0, x0 + 0.6, WY1], [x1 - 0.6, WY0, x1, WY1]]) block(stone, a0, b0, a1, b1, TOP - 0.2, TOP + 1.3)
  // openings: on the west and the outer faces, a pair of tall belfry lancets and a window below; the portal on the west
  const faces: [XY, XY][] = [[[x0, WY0], [x1, WY0]], x0 < 0 ? [[x0, WY1], [x0, WY0]] : [[x1, WY0], [x1, WY1]]]
  faces.forEach(([a, b], k) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (const j of [-1, 1]) pointed(win, a, b, L / 2 + j * 2.6, 3.4, 35, 46.5)
    for (const j of [-1, 1]) pointed(win, a, b, L / 2 + j * 2.6, 2.6, 24, 31)
    if (k === 0) { pointed(stone, a, b, L / 2, 8.6, 4.5, 19.5, 0.25); pointed(dark, a, b, L / 2, 6.4, 4.5, 17.5, 0.3) }
  })
}
// Centre bay: the gable front with the rose and the great portal.
{
  const x0 = T0[1], x1 = T1[0]
  prism({ wall: stone, win: null, roof: null, ring: rect(x0, WY0, x1, WY1), z0: 0, z1: 44, facade: null, bevel: 0.2 })
  gableY(roof, stone, x0, WY0, x1, WY1 + 0.5, 44, 58.3, 0.0)
  const a: XY = [x0, WY0], b: XY = [x1, WY0], s = (x1 - x0) / 2
  discPanel(stone, a, b, s, 34.5, 7.4, 0.12, 20)
  discPanel(win, a, b, s, 34.5, 6.4, 0.18, 20)
  pointed(stone, a, b, s, 13.0, 4.5, 25.5, 0.25)
  pointed(dark, a, b, s, 10.4, 4.5, 23.0, 0.3)
  // pinnacled gable ridge
  pinnacle(stone, CX, WY0 + 0.6, 0.9, 56.5, 59.5, 63.0)
}

// --- Crossing: a square block with the great arches on its transept sides and the dome ---
const XX0 = -16, XX1 = 22, XY0 = -4, XY1 = 32, XZ = 31
prism({ wall: stone, win: null, roof, ring: rect(XX0, XY0, XX1, XY1), z0: 0, z1: XZ, facade: null, bevel: 0.4 })
{
  // The great round arch on each transept face (a semicircle on the 36 m side, apex ~49 m, lidar 47–49), a broad band and an infilled tympanum.
  const half = (XY1 - XY0) / 2, yc = (XY0 + XY1) / 2, rise = 17.6, R = (half * half + rise * rise) / (2 * rise), zc = XZ + rise - R
  const n = 14, a0 = Math.asin(half / R)
  for (const [xf, sgn] of [[XX0, -1], [XX1, 1]] as [number, number][]) {
    const outer: [number, number][] = [], inner: [number, number][] = []
    for (let i = 0; i <= n; i++) {
      const t = -a0 + (2 * a0 * i) / n
      outer.push([yc + R * Math.sin(t), zc + R * Math.cos(t)])
      inner.push([yc + (R - 3.0) * Math.sin(t), zc + (R - 3.0) * Math.cos(t)])
    }
    // tympanum: fan from the arch's chord midpoint, set 1.2 m back (both windings so it reads from outside)
    const xt = xf - sgn * 1.2
    for (let i = 0; i < n; i++) {
      const A: V3 = [xt, inner[i][0], inner[i][1]], B: V3 = [xt, inner[i + 1][0], inner[i + 1][1]], C: V3 = [xt, yc, XZ]
      if (sgn > 0) stone.tri(C, A, B); else stone.tri(C, B, A)
    }
    // the arch band: front face, top and soffit
    for (let i = 0; i < n; i++) {
      const o0 = outer[i], o1 = outer[i + 1], i0 = inner[i], i1 = inner[i + 1]
      const f = (p: [number, number], x: number): V3 => [x, p[0], p[1]]
      if (sgn > 0) stone.quad(f(i0, xf), f(i1, xf), f(o1, xf), f(o0, xf))
      else stone.quad(f(o0, xf), f(o1, xf), f(i1, xf), f(i0, xf))
      // the extrados, back to the dome (both windings: a thin band)
      const xb = xf - sgn * 3.0
      stone.quad(f(o0, xb), f(o0, xf), f(o1, xf), f(o1, xb)); stone.quad(f(o1, xb), f(o1, xf), f(o0, xf), f(o0, xb))
    }
    // three blind pointed arches on the tympanum, glazed
    const a: XY = sgn > 0 ? [xt, XY0] : [xt, XY1], b: XY = sgn > 0 ? [xt, XY1] : [xt, XY0]
    for (const k of [-1, 0, 1]) pointed(win, a, b, half + k * 7.5, 4.6, XZ + 1.0, XZ + (k === 0 ? 11.5 : 8.5))
  }
  // The dome: a low cap, crown 55.2 m, rim 18 m out at 41 m.
  prism({ wall: stone, win: null, roof: null, ring: circle(CX, 14, 17.8, 24), z0: XZ - 0.2, z1: 41.5, facade: null, bevel: 0 })
  dome(cupola, CX, 14, 18.0, 41.5, 13.7, 24, 6)
  // Great windows in the crossing's lower walls on the transept sides.
  for (const [a, b] of [[[XX0, XY1], [XX0, XY0]], [[XX1, XY0], [XX1, XY1]]] as [XY, XY][]) for (const k of [-1, 1]) pointed(win, a, b, half + k * 9.5, 4.8, 15, 28)
}
// Transept stubs: low ranges round the unbuilt north transept's open court, a thin strip on the south.
for (const r of [rect(-44, -10.1, -30.5, 32.5), rect(-30.5, -10.1, XX0, 0), rect(-30.5, 29, XX0, 32.5)]) prism({ wall: stone, win: null, roof, ring: r, z0: 0, z1: 17, facade: null, bevel: 0.3 })
prism({ wall: stone, win: null, roof, ring: rect(XX1, -0.4, 25.2, 31.7), z0: 0, z1: 20, facade: null, bevel: 0.2 })

// --- Choir: flanking ranges, aisles, clerestory, apse; the ring of chapels ---
const CY0 = XY1, CY1 = 60
prism({ wall: stone, win: null, roof, ring: rect(-28.2, CY0, 37.1, 63), z0: 0, z1: 21, facade: null, bevel: 0.3 })
prism({ wall: stone, win: null, roof, ring: rect(-13, CY0, 19, CY1), z0: 20.8, z1: 39.5, facade: null, bevel: 0.3 })
prism({ wall: stone, win: null, roof: null, ring: rect(-7.5, CY0, 13.5, CY1), z0: 39.4, z1: 42, facade: null, bevel: 0.2 })
gableY(roof, stone, -7.5, CY0, 13.5, CY1, 42, 51.7, 0.3)
// Apse: a half-decagon of radius 10.5 m to 42 m with a half-cone roof up to the ridge's end.
{
  const R = 10.5, n = 8
  const ring: XY[] = [[CX - R, CY1]]
  for (let i = 1; i < n; i++) { const t = Math.PI - (Math.PI * i) / n; ring.push([CX + R * Math.cos(t), CY1 + R * Math.sin(t)]) }
  ring.push([CX + R, CY1])
  prism({ wall: stone, win: null, roof: null, ring, z0: 0, z1: 42, facade: null, bevel: 0.2 })
  for (let i = 0; i < ring.length - 1; i++) roof.tri([ring[i + 1][0], ring[i + 1][1], 42], [ring[i][0], ring[i][1], 42], [CX, CY1, 51.7])
  // tall apse windows
  for (let i = 0; i < ring.length - 1; i++) {
    const a = ring[i + 1], b = ring[i]
    pointed(win, a, b, Math.hypot(b[0] - a[0], b[1] - a[1]) / 2, 2.0, 24, 37)
  }
  // ring of chapels round the apse, ~12 m
  const chapels: XY[] = []
  for (let i = 0; i <= 10; i++) { const t = Math.PI - (Math.PI * i) / 10; chapels.push([CX + 25 * Math.cos(t), 63 + 25 * Math.sin(t)]) }
  prism({ wall: stone, win: null, roof, ring: [...chapels].reverse(), z0: 0, z1: 12, facade: null, bevel: 0.3 })
  for (let i = 0; i < chapels.length - 1; i++) {
    const a = chapels[i + 1], b = chapels[i]
    pointed(win, a, b, Math.hypot(b[0] - a[0], b[1] - a[1]) / 2, 2.4, 3.5, 9.5)
  }
}
// Choir aisle windows.
for (const [a, b] of [[[-13, CY1], [-13, CY0]], [[19, CY0], [19, CY1]]] as [XY, XY][]) for (const k of [0, 1, 2]) pointed(win, a, b, 4.7 + k * 9.3, 3.6, 24, 36)

finishModel('Cathedral of St. John the Divine', 'nyc-st-john-the-divine', [
  { part: stone, material: finish('divine-granite', 0xdcd5ca) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: cupola, material: finish('divine-tile-dome', 0xe6e4de) },
  { part: dark, material: { ...PALETTE.window, name: 'window-2', color: 0x5d6a74 } },
], { bearing: 118.1, osm: 'relation/3624833', height: 63.0 }, 6500)
