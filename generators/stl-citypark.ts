/**
 * Energizer Park (opened 2022 as CITYPARK), 2100 Market St, St. Louis — the
 * home of St. Louis City SC (HOK with Snow Kreilich Architects) — original
 * procedural geometry, CC0-1.0.  bun generators/stl-citypark.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * pitch. Bearing 14.8, the stadium's own axis (OSM's long walls run at
 * 14.8°): the pitch runs along y. Anchor = the centroid of the first outer
 * ring of OSM relation/11502812, -90.21024, 38.6315451.
 *
 * Identity (from the photos and sources below):
 *  1. A thin, flat, pale canopy roof floating over the stands on slender
 *     white columns, with a deep cantilever towards the pitch; all four
 *     corners are open, so it reads as four flat roofs.   (p1, p3; HOK, IBJ)
 *  2. The bowl sunk into the old rail yard: the pitch 40 ft below the
 *     street, the stands rising from it, a low pale precast base at street
 *     level; open light courts at the two north corners.   (HOK; OSM inners)
 *
 * Note on the brief: it calls the canopy translucent. That was the 2019
 * concept (ETFE); the built canopy is metal-clad with solid soffit panels
 * (AISC, Dezeen), so it is drawn opaque and pale, as the photos show.
 *
 * Elevation: the pitch is 40 ft (12.2 m) below the street (HOK, Mortenson,
 * St. Louis City SC; Dezeen gives 17 ft below the concourse). The model's
 * y = 0 is the pitch; the placement's elevation is -12.2. The map's terrain
 * predates the dig (it shows the site flat), so the map hides the bowl's
 * lower part as it should.
 *
 * Plan: OSM relation/11502812 turned to bearing 14.8: the west, north and
 * east stands round the pitch (x -43.2..43.7, y -90.6..45.3) in the first
 * outer ring; the south stand is the second outer ring (y -121.3..-94.5,
 * OSM height 18, and its roof way/1469620556 of relation/20127811); the
 * two north corners are open courts (inner rings way/1268400175,
 * way/1268400176).
 *
 * Heights: built after the 2017–18 lidar, so none are measured. Published:
 * the pitch depth (above), the canopy's 120 ft (36.6 m) cantilever with a
 * 25 ft back span, 80% bowl coverage (AISC, Mortenson), capacity 22,500.
 * Estimated from p1 and p3: the canopy 18 m over the street (30.2 over the
 * pitch), 1.2 m deep at its edge; the stands' backs 24 (west), 20 (east),
 * 17–18 (north and south); columns 0.7 m across about every 10 m.
 * Left out: the seats' colours (a muted red rake), the screens, the lights.
 *
 * Night: the canopy's edge is floodlit; the concourse glazing glows.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  p1  "Centene Stadium (52449556638).jpg", Chris Yunker, CC BY 2.0 (the canopy and columns from the plaza)
 *  p2  "Centene Stadium (52448517197).jpg", Chris Yunker, CC BY 2.0 (the concourse)
 *  p3  "STL City S.C. CityPark.jpg", Bluefiredragon09, CC BY-SA 4.0
 * IBJ ("A big move"): open-air corners and separate roof structures.
 * Published: hok.com (St. Louis CITY SC's CITYPARK); mortenson.com
 * (Celebrating Energizer Park); AISC "Ideas2" 2024; dezeen.com, 13 Nov 2024.
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'

const pre = new Part(), seat = new Part(), canopy = new Part(), win = new Part()
const STREET = 12.2
const tri = (p: Part, a: V3, b: V3, c: V3, out: V3) => {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}
const quad = (p: Part, a: V3, b: V3, c: V3, d: V3, out: V3) => { tri(p, a, b, c, out); tri(p, a, c, d, out) }

/**
 * A stand: a rake rising from the pitch edge (`inner`, at 1.5) to `top` at
 * `rakeEnd`, then a flat back to `outer`; along `axis` ('x' = rises along
 * x, spanning y0..y1). inner < outer or inner > outer gives the direction.
 */
function stand(axis: 'x' | 'y', inner: number, rakeEnd: number, outer: number, s0: number, s1: number, top: number) {
  const P = (u: number, s: number, z: number): V3 => (axis === 'x' ? [u, s, z] : [s, u, z])
  const dir = Math.sign(outer - inner), U: V3 = axis === 'x' ? [dir, 0, 0] : [0, dir, 0], S: V3 = axis === 'x' ? [0, 1, 0] : [1, 0, 0]
  // the rake (seats) and the flat back (concourse roof)
  quad(seat, P(inner, s0, 1.5), P(inner, s1, 1.5), P(rakeEnd, s1, top), P(rakeEnd, s0, top), [-U[0] * 0.3, -U[1] * 0.3, 1])
  quad(pre, P(rakeEnd, s0, top), P(rakeEnd, s1, top), P(outer, s1, top), P(outer, s0, top), [0, 0, 1])
  // the front wall to the pitch, the outer wall, the ends
  quad(pre, P(inner, s0, 0), P(inner, s1, 0), P(inner, s1, 1.5), P(inner, s0, 1.5), [-U[0], -U[1], 0])
  quad(pre, P(outer, s0, 0), P(outer, s1, 0), P(outer, s1, top), P(outer, s0, top), [U[0], U[1], 0])
  for (const [s, sg] of [[s0, -1], [s1, 1]] as [number, number][]) {
    const o: V3 = [S[0] * sg, S[1] * sg, 0]
    quad(pre, P(inner, s, 0), P(outer, s, 0), P(outer, s, top), P(rakeEnd, s, top), o)
    tri(pre, P(inner, s, 0), P(rakeEnd, s, top), P(inner, s, 1.5), o)
  }
  // concourse glazing at street level on the outer wall
  const a: XY = axis === 'x' ? [outer, dir > 0 ? s0 : s1] : [dir > 0 ? s1 : s0, outer]
  const b: XY = axis === 'x' ? [outer, dir > 0 ? s1 : s0] : [dir > 0 ? s0 : s1, outer]
  const L = Math.abs(s1 - s0)
  onWall(win, a, b, rectShape(2, L - 2, STREET + 0.4, STREET + 4.0), 0.06)
}

stand('x', -43.2, -75.0, -81.0, -90.6, 45.3, 24.0) // west, the main stand
stand('x', 43.7, 75.0, 80.9, -91.1, 45.3, 20.0) // east
stand('y', 45.3, 65.0, 71.1, -43.2, 43.7, 17.0) // north, the supporters' end
stand('y', -94.5, -115.0, -121.3, -80.5, 80.8, 18.0) // south
// the north corners: low blocks at street level round the open courts
for (const [x0, x1, hx0, hx1] of [[-81.0, -43.2, -68.2, -50.5], [43.7, 81.0, 50.4, 68.4]]) {
  box(pre, x0, x1, 45.3, 46.8, 0, STREET, pre, 0)
  box(pre, x0, x1, 64.6, 71.1, 0, STREET, pre, 0)
  box(pre, x0, hx0, 46.8, 64.6, 0, STREET, pre, 0)
  box(pre, hx1, x1, 46.8, 64.6, 0, STREET, pre, 0)
}
// the south corners between the stands (the gap band south of the pitch)
box(pre, -81.0, -43.2, -94.5, -90.6, 0, STREET, pre, 0)
box(pre, 43.7, 80.9, -94.5, -91.1, 0, STREET, pre, 0)

// ── The canopy: four thin flat roofs, one over each stand, the corners open ──
const CZ = 30.2, CT = 1.2
const roofs: [number, number, number, number][] = [
  [-84.0, -40.0, -88.0, 43.0], // west
  [41.0, 84.0, -88.0, 43.0], // east
  [-43.2, 43.7, 40.0, 74.0], // north
  [-43.2, 43.7, -124.0, -84.0], // south
]
for (const [x0, x1, y0, y1] of roofs) box(canopy, x0, x1, y0, y1, CZ, CZ + CT, canopy, 0, true)
// slender white columns along each roof's outer edge, about every 10 m
const posts: XY[] = []
for (let y = -84; y <= 40; y += 10.3) posts.push([-79.0, y], [79.0, y])
for (let x = -38; x <= 39; x += 9.6) posts.push([x, -119.5], [x, 69.5])
for (const p of posts) revolve(canopy, p, [[0.35, STREET], [0.35, CZ]], 6, 0, false, false)

const lit = (p: V3, n: V3) => (p[2] > CZ - 0.1 && Math.abs(n[2]) < 0.5 ? 1 : 0)
await save('stl-citypark', 'Energizer Park', [
  { part: pre, material: finish('stl-citypark-precast', 0xe2e0da) },
  { part: seat, material: finish('stl-citypark-seats', 0xb36a64) },
  { part: canopy, material: { ...finish('stl-citypark-canopy', 0xeef0f0), floodlight: lit } },
  { part: win, material: PALETTE.window },
], { height: CZ + CT, anchor: [38.6315451, -90.21024], bearing: 14.8, elevation: -STREET })
