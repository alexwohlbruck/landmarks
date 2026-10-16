/**
 * Camp North End: Hercules South (Army Quartermaster Building No. 2) and the
 * Big Roof — procedural, CC0-1.0.
 * bun generators/clt-cne-hercules-south.ts
 *
 * The first of the warehouses the Army Quartermaster Corps put up beside the
 * Ford plant in 1941–43, named Hercules South by Camp North End after the
 * Nike Hercules missiles built here in the 1950s; 1830 Statesville Avenue. A
 * one-storey brick box 367 × 56 m (1,200 × 185 ft), its short west end on
 * Statesville Avenue, almost windowless: its light comes from ten clerestory
 * monitors that cross the roof at 36.6 m intervals, clad in corrugated metal
 * painted red, glazed on all four sides. Concrete loading platforms and
 * canopies line the north side, three loading-dock bays are cut into the
 * south side, and a small hip-roofed guardhouse stands at the south-west
 * corner. North of it, the Big Roof: an open steel gantry shed built in the
 * 1950s for the overhead cranes that loaded the missiles onto rail cars,
 * spanning the yard between this building and Building 3.
 *
 * Identity: the long red box with its row of raised red-and-glass monitors
 * across the white roof, and the tall grey Big Roof beside it.
 *
 * Evidence:
 *  - OSM: the outline way/324611653 (height 9) and its 30 parts
 *    way/835823888–835823917: the ten monitors (height 9) at their x
 *    extents, the main roof between them (6.9), the south annexes and dock
 *    canopies (5.8; 835823893, 835823905, 835823912 have min_height 5.7, so
 *    open canopies), the north canopies (6). The Big Roof is way/497199335
 *    (building=roof, min_height 8.9, height 9).
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m (measured, NAVD88):
 *    ground 220.7–220.9 all round (flat site; y = 0 is 220.7); roof deck
 *    228.0 (7.3 m), parapet 228.4–228.6 (7.8 m); monitor tops 230.8
 *    (10.1 m), flat, 13–14 m wide, full depth except over the dock bays;
 *    south annexes and dock canopies 226.6 (5.9 m); north canopies 226.6,
 *    north platforms 222.0 (1.3 m); Big Roof 231.2–231.5 (10.6 m), highest
 *    along its middle. OSM's heights are each about a metre low; the lidar
 *    is followed.
 *  - Charlotte-Mecklenburg Historic Landmarks Commission survey and research
 *    report, "Ford Motor Company Assembly Plant / Quartermaster Depot /
 *    Charlotte Army Missile Plant" (2017,
 *    landmarkscommission.org/wp-content/uploads/2017/06/Ford-Motor-Co-Plant-SR.pdf),
 *    Building No. 2 (published): 180 × 1,200 ft, one storey, brick in common
 *    bond with six-course headers, "essentially a long brick box, with
 *    almost no visible fenestration", "10 clerestory skylights placed at
 *    regular intervals along the length of the building that transverse the
 *    building's width", the monitors "pressed corrugated sheet-metal painted
 *    red with a bank of 15-pane windows ... on the short sides and a series
 *    of 4/2-sash windows along the long ... sides"; a guardhouse at the
 *    south-west corner, two bays by four, under a partial hip roof; long
 *    concrete loading platforms on the north side, whose face 1940s photos
 *    show "punctuated by numerous industrial service doors"; and the open
 *    steel-framed crane structure "with a rectangular footprint and a slight
 *    gable", built for Douglas Aircraft.
 *  - Mecklenburg County tax parcel 07903101 (CAMP LANDOWNER LP): built 1943,
 *    face brick and modular metal.
 *  - Camp North End leasing brochure (2023, camp.nc): the names "Hercules
 *    South & Big Roof", 230,000 sq ft.
 *  - USGS NAIP orthophoto (public domain): the white membrane roof over
 *    building, monitors and the south dock canopies, the darker north
 *    canopies, the grey metal Big Roof, the plan; the monitors show only as
 *    the shadow lines of their sides.
 *
 * Look-only: the 2023 brochure's site rendering (names only).
 *
 * No licensed photo of the building exists on Commons, Openverse or
 * Mapillary (Mapillary has no imagery on Statesville or Woodward Avenue
 * here). So every colour and opening is from the survey's text and NAIP:
 *  - the brick colour is the campus Kahn brick (`clt-cne-ford-plant.ts`),
 *    estimated;
 *  - the monitors' red is the survey's "painted red", hue estimated; the
 *    2023–25 renovation may have repainted them;
 *  - window bands on the monitors, their sizes and grouping: estimated from
 *    the survey's description;
 *  - the north service doors (one per 12.2 m, 3.6 × 3.3 m): invented
 *    spacing, from the survey's description;
 *  - the guardhouse's size (5 × 8 m, eaves 3.4, ridge 4.8 m): estimated from
 *    "two bays by four" and the lidar's 4.6–5.4 m returns at that corner;
 *  - the Big Roof's columns (every 12.8 m) and fascia depth: invented; its
 *    slight gable from the lidar.
 *
 * This file also holds the small kit the other north-campus models share
 * (`clt-cne-building-3`, `clt-cne-raceway-building`, `clt-cne-200-camp-road`,
 * `clt-cne-crossroad-shed`); its own model is built only when it is
 * run directly.
 *
 * Frame: the Ford plant's grid. x runs along the long axis (bearing 96.3°),
 * y across it (bearing 6.3°), z up, metres; placement bearing 6.3. The
 * origin is the outline's centroid, lng −80.8334757, lat 35.2482131.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { BRICK, box, quad, tri, type XY } from './clt-cne-ford-plant'
import { cap } from './clt-highland-park-mill-3'

// ---------------------------------------------------------------------------
// Kit.

export { BRICK }
/** The white membrane roofs NAIP shows on the 1940s warehouses, pulled grey. */
export const WHITE_ROOF = finish('cne-white-roof', 0xd2d6d8)
/** The charcoal roofs NAIP shows on Building 3 and 200 Camp Road, pulled light. */
export const DARK_ROOF = finish('cne-dark-roof', 0x80878e)
/** The monitors' red-painted corrugated metal (survey), a cooler red than the brick. */
export const MONITOR_RED = finish('monitor-red', 0xb4554b)

/**
 * A wall along A→B (outward to its right, as in a counter-clockwise ring
 * seen from above), from z0 up to `top`: the face, a chamfered pale coping
 * and the parapet's inner face down to the deck.
 */
export function wallRun(m: { wall: Part; coping: Part }, A: XY, B: XY, z0: number, top: number, deck: number, cop = 0.45, ch = 0.15) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), d: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
  const n: V3 = [d[1], -d[0], 0], i: XY = [-d[1], d[0]]
  const at = (p: XY, k: number): XY => [p[0] + i[0] * k, p[1] + i[1] * k]
  const a1 = at(A, ch), b1 = at(B, ch), a2 = at(A, cop), b2 = at(B, cop)
  quad(m.wall, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], top - ch], [A[0], A[1], top - ch], n)
  quad(m.coping, [A[0], A[1], top - ch], [B[0], B[1], top - ch], [b1[0], b1[1], top], [a1[0], a1[1], top], [n[0], n[1], 1])
  quad(m.coping, [a1[0], a1[1], top], [b1[0], b1[1], top], [b2[0], b2[1], top], [a2[0], a2[1], top], [0, 0, 1])
  if (deck < top) quad(m.wall, [b2[0], b2[1], top], [a2[0], a2[1], top], [a2[0], a2[1], deck], [b2[0], b2[1], deck], [-n[0], -n[1], 0])
}

/** A flat-roofed block over a counter-clockwise ring: walls, coping, deck. */
export function block(m: { wall: Part; coping: Part; deck: Part }, ring: XY[], z0: number, top: number, para = 0.5, skip: number[] = []) {
  ring.forEach((A, k) => { if (!skip.includes(k)) wallRun(m, A, ring[(k + 1) % ring.length], z0, top, top - para) })
  cap(m.deck, ring, top - para + 0.02)
}

/** A point `a` along the wall A→B, `d` out from it, at height z. */
export function onWall(A: XY, B: XY) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), d: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
  const N: V3 = [d[1], -d[0], 0]
  const P = (a: number, z: number, o = 0.05): V3 => [A[0] + d[0] * a + N[0] * o, A[1] + d[1] * a + N[1] * o, z]
  return {
    L, N, P,
    /** A flat panel on the wall from a0 to a1 along it, z0 to z1 high. */
    panel(p: Part, a0: number, a1: number, z0: number, z1: number, o = 0.05) { quad(p, P(a0, z0, o), P(a1, z0, o), P(a1, z1, o), P(a0, z1, o), N) },
  }
}

/** A thin flat canopy slab on posts along its outer edge. */
export function canopy(roof: Part, posts: Part, x0: number, x1: number, y0: number, y1: number, z: number, postsAtY: number | null, step = 12) {
  box(roof, x0, x1, y0, y1, z - 0.4, z, roof)
  if (postsAtY === null) return
  const n = Math.max(1, Math.round((x1 - x0) / step))
  for (let k = 0; k <= n; k++) {
    const x = x0 + 0.3 + ((x1 - x0 - 0.6) * k) / n
    box(posts, x - 0.15, x + 0.15, postsAtY - 0.15, postsAtY + 0.15, 0, z - 0.4, null)
  }
}

/** A hipped roof over x0..x1, y0..y1 from eaves to ridge, with an overhang. */
export function hipRoof(p: Part, x0: number, x1: number, y0: number, y1: number, eave: number, ridge: number, over = 0.4) {
  x0 -= over; x1 += over; y0 -= over; y1 += over
  const alongX = x1 - x0 >= y1 - y0, h = (alongX ? y1 - y0 : x1 - x0) / 2
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  const A: V3 = alongX ? [x0 + h, cy, ridge] : [cx, y0 + h, ridge]
  const B: V3 = alongX ? [x1 - h, cy, ridge] : [cx, y1 - h, ridge]
  const sw: V3 = [x0, y0, eave], se: V3 = [x1, y0, eave], ne: V3 = [x1, y1, eave], nw: V3 = [x0, y1, eave]
  if (alongX) { quad(p, sw, se, B, A); quad(p, ne, nw, A, B); tri(p, se, ne, B); tri(p, nw, sw, A) }
  else { quad(p, se, ne, B, A); quad(p, nw, sw, A, B); tri(p, sw, se, A); tri(p, ne, nw, B) }
  quad(p, sw, nw, ne, se, [0, 0, -1])
}

/** A gabled roof, ridge along x (or y), between eaves and ridge, with overhangs; gable ends are walls of `ends`. */
export function gableRoof(p: Part, ends: Part, x0: number, x1: number, y0: number, y1: number, eave: number, ridge: number, alongX = true, over = 0.4) {
  if (alongX) {
    const cy = (y0 + y1) / 2
    quad(p, [x0 - over, y0 - over, eave], [x1 + over, y0 - over, eave], [x1 + over, cy, ridge], [x0 - over, cy, ridge])
    quad(p, [x1 + over, y1 + over, eave], [x0 - over, y1 + over, eave], [x0 - over, cy, ridge], [x1 + over, cy, ridge])
    tri(ends, [x0, y0, eave], [x0, y1, eave], [x0, cy, ridge], [-1, 0, 0])
    tri(ends, [x1, y1, eave], [x1, y0, eave], [x1, cy, ridge], [1, 0, 0])
  } else {
    const cx = (x0 + x1) / 2
    quad(p, [x1 + over, y0 - over, eave], [x1 + over, y1 + over, eave], [cx, y1 + over, ridge], [cx, y0 - over, ridge])
    quad(p, [x0 - over, y1 + over, eave], [x0 - over, y0 - over, eave], [cx, y0 - over, ridge], [cx, y1 + over, ridge])
    tri(ends, [x0, y0, eave], [x1, y0, eave], [cx, y0, ridge], [0, -1, 0])
    tri(ends, [x1, y1, eave], [x0, y1, eave], [cx, y1, ridge], [0, 1, 0])
  }
}

export type Built = { id: string; name: string; height: number; bearing: number; parts: { part: Part; material: Swatch }[] }
/** Check the budget and write `models/<id>.glb`; parts are already in the model's own frame. */
export async function write(b: Built, budget = 5000) {
  const parts = b.parts.filter((p) => p.part.triangles > 0)
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > budget) throw new Error(`${b.id}: triangle budget exceeded: ${triangles}`)
  if (parts.length > 6) throw new Error(`${b.id}: ${parts.length} materials`)
  const glb = writeGlb(b.name, parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: b.bearing, elevation: 0, height: b.height,
  })
  if (glb.length > 256000) throw new Error(`${b.id}: file budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${b.id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${parts.length} materials`)
}

// ---------------------------------------------------------------------------
// Hercules South.

/** Lidar levels above y = 0 (220.7 m NAVD88). */
const TOP = 7.8, DECK = 7.3, MON = 10.1, LOW = 5.9, DOCK = 1.3, BIG = 10.6
const X0 = -180.6, X1 = 186.2, Y0 = -28.4, Y1 = 28.0
/** South dock bays (x extents): the enclosed annex, then the open canopy (OSM parts). */
const BAYS: { x0: number; x1: number; shut: [number, number]; open: [number, number] }[] = [
  { x0: -144.0, x1: -107.3, shut: [-144.0, -131.9], open: [-131.9, -107.3] },
  { x0: 2.5, x1: 39.2, shut: [2.5, 14.8], open: [14.8, 39.2] },
  { x0: 112.2, x1: 149.2, shut: [138.4, 149.2], open: [112.2, 138.4] },
]
const BACK = -16.0
/** The ten monitors' x extents (OSM parts, height 9). */
const MONITORS: [number, number][] = [[-168.5, -155.4], [-131.9, -118.6], [-95.5, -82.6], [-58.8, -45.6], [-22.0, -8.8], [14.3, 27.8], [51.2, 64.2], [87.9, 101.4], [124.5, 138.3], [161.0, 174.3]]

export function buildHerculesSouth(): Built {
  const wall = new Part(), trim = new Part(), win = new Part(), white = new Part(), red = new Part(), grey = new Part()

  // The main box: its ring runs round the three dock recesses on the south.
  const ring: XY[] = [[X0, Y0]]
  for (const b of BAYS) ring.push([b.x0, Y0], [b.x0, BACK], [b.x1, BACK], [b.x1, Y0])
  ring.push([X1, Y0], [X1, Y1], [X0, Y1])
  block({ wall, coping: trim, deck: white }, ring, 0, TOP, TOP - DECK)

  // The dock bays: an enclosed annex and an open canopy over a platform,
  // the recessed wall behind carrying loading doors.
  for (const b of BAYS) {
    block({ wall, coping: trim, deck: white }, [[b.shut[0], Y0], [b.shut[1], Y0], [b.shut[1], BACK], [b.shut[0], BACK]], 0, LOW, 0.3)
    canopy(white, grey, b.open[0], b.open[1], Y0 - 0.6, BACK, LOW, Y0 - 0.3)
    box(trim, b.open[0], b.open[1], Y0 + 2.0, BACK, 0, DOCK, trim)
    const f = onWall([b.open[0], BACK], [b.open[1], BACK])
    const n = Math.max(1, Math.round(f.L / 8))
    for (let k = 0; k < n; k++) { const m = ((k + 0.5) * f.L) / n; f.panel(grey, m - 1.8, m + 1.8, DOCK, DOCK + 3.3) }
  }

  // North side: the loading platform the full length, canopies over most of
  // it, and the row of service doors.
  box(trim, X0 + 1, X1 - 1, Y1, Y1 + 4.0, 0, DOCK, trim)
  canopy(grey, grey, -166, -51, Y1, Y1 + 4.4, LOW, Y1 + 4.0)
  canopy(grey, grey, 103.5, 165, Y1, Y1 + 4.4, LOW, Y1 + 4.0)
  {
    const f = onWall([X1, Y1], [X0, Y1])
    for (let a = 6.1; a < f.L - 3; a += 12.2) f.panel(grey, a - 1.8, a + 1.8, DOCK, DOCK + 3.3)
  }

  // The monitors: red corrugated boxes across the roof, glazed in bands on
  // the long sides (the 4/2 sashes) and a bank on each end (the 15-pane
  // windows), under a white lid with a small overhang.
  for (const [mx0, mx1] of MONITORS) {
    const over = BAYS.find((b) => mx0 < b.x1 - 1 && mx1 > b.x0 + 1)
    const my0 = (over ? BACK : Y0) + 0.5, my1 = Y1 - 0.5
    box(red, mx0, mx1, my0, my1, DECK, MON - 0.35, null)
    box(red, mx0 - 0.35, mx1 + 0.35, my0 - 0.35, my1 + 0.35, MON - 0.45, MON, white)
    const w0 = DECK + 0.75, w1 = MON - 0.75
    for (const [A, B] of [[[mx0, my1], [mx0, my0]], [[mx1, my0], [mx1, my1]]] as [XY, XY][]) {
      const f = onWall(A, B), n = Math.round(f.L / 8.5), g = 0.9, pw = (f.L - g * (n + 1)) / n
      for (let k = 0; k < n; k++) f.panel(win, g + k * (pw + g), g + k * (pw + g) + pw, w0, w1)
    }
    for (const [A, B] of [[[mx0, my0], [mx1, my0]], [[mx1, my1], [mx0, my1]]] as [XY, XY][]) {
      const f = onWall(A, B)
      f.panel(win, 1.4, f.L / 2 - 0.5, TOP + 0.25, w1)
      f.panel(win, f.L / 2 + 0.5, f.L - 1.4, TOP + 0.25, w1)
    }
  }

  // The guardhouse at the south-west corner: brick, under a hipped roof.
  {
    const gx0 = X0 - 5.0, gx1 = X0, gy0 = Y0 - 2.4, gy1 = Y0 + 5.6
    box(wall, gx0, gx1, gy0, gy1, 0, 3.4, null)
    hipRoof(grey, gx0, gx1, gy0, gy1, 3.4, 4.8, 0.5)
    const f = onWall([gx0, gy1], [gx0, gy0])
    f.panel(win, 1.5, 3.4, 1.2, 2.6)
    f.panel(win, 4.6, 6.5, 1.2, 2.6)
  }

  // The Big Roof: a long grey gantry shed on columns between this building
  // and Building 3, its fascia deep enough to read, a slight gable.
  {
    const bx0 = -50.9, bx1 = 103.2, by0 = Y1, by1 = 44.9, z0 = BIG - 1.2, mid = (by0 + by1) / 2
    quad(grey, [bx0, by0, z0 + 0.6], [bx1, by0, z0 + 0.6], [bx1, mid, BIG], [bx0, mid, BIG])
    quad(grey, [bx1, by1, z0 + 0.6], [bx0, by1, z0 + 0.6], [bx0, mid, BIG], [bx1, mid, BIG])
    // Fascia round the edge and the gable ends' triangles.
    quad(grey, [bx0, by0, z0], [bx1, by0, z0], [bx1, by0, z0 + 0.6], [bx0, by0, z0 + 0.6], [0, -1, 0])
    quad(grey, [bx1, by1, z0], [bx0, by1, z0], [bx0, by1, z0 + 0.6], [bx1, by1, z0 + 0.6], [0, 1, 0])
    for (const [x, s] of [[bx0, -1], [bx1, 1]] as [number, number][]) {
      quad(grey, [x, by0, z0], [x, by1, z0], [x, by1, z0 + 0.6], [x, by0, z0 + 0.6], [s, 0, 0])
      tri(grey, [x, by0, z0 + 0.6], [x, by1, z0 + 0.6], [x, mid, BIG], [s, 0, 0])
    }
    quad(grey, [bx0, by0, z0], [bx0, by1, z0], [bx1, by1, z0], [bx1, by0, z0], [0, 0, -1])
    const n = Math.round((bx1 - bx0) / 12.8)
    for (let k = 0; k <= n; k++) {
      const x = bx0 + 0.4 + ((bx1 - bx0 - 0.8) * k) / n
      for (const y of [by0 + 4.6, by1 - 0.5]) box(grey, x - 0.3, x + 0.3, y - 0.3, y + 0.3, 0, z0, null)
    }
  }

  return {
    id: 'clt-cne-hercules-south', name: 'Hercules South, Camp North End', height: BIG, bearing: 6.3,
    parts: [
      { part: wall, material: BRICK },
      { part: trim, material: PALETTE.trim },
      { part: win, material: PALETTE.window },
      { part: white, material: WHITE_ROOF },
      { part: red, material: MONITOR_RED },
      { part: grey, material: PALETTE.roof },
    ],
  }
}

if (import.meta.main) await write(buildHerculesSouth())
