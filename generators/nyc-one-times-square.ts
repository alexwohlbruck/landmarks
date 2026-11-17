/**
 * One Times Square (the Times Tower, 1904; Cyrus L. W. Eidlitz; reclad
 * 1966, screens since the 1990s, renovated 2022-25), 1475 Broadway, between
 * Broadway and Seventh Avenue at 42nd-43rd Street. Procedural, CC0-1.0.
 *   bun generators/nyc-one-times-square.ts
 *
 * What makes it itself, from the photos: the narrow wedge tower closing
 * Times Square to the south; the stack of LED screens down its north face,
 * set forward of the wall on cabinets and wider than the 6.7 m face; a
 * second stack on the taller southern tower's north face above the lower
 * block's roof; the top screen standing on the roof with the year numerals
 * on top; the New Year's Eve ball resting on its mast just above the
 * numerals, the mast running on another 20 m; and the "zipper" news ticker
 * wrapping the base above the shopfronts.
 *
 * Map frame: x east, y north, z up, metres, turned by the placement's
 * bearing 29.5 (the Manhattan grid; OSM's 42nd Street face is at 119.5).
 * Model +y runs up the wedge toward 43rd Street. Origin: the centroid of
 * OSM way/266170825 (-73.9865372, 40.7561966). y = 0 is the street at the
 * 43rd Street (north) end, the lowest ground in the lidar (1.3 m above the
 * box's ground_min; the 42nd Street end is 0.7 m higher).
 *
 * OSM (ODbL), fetched with tools/osm.py buildings:
 * - way/266170825, building=commercial "One Times Square": the outline,
 *   S (1.38,-21.18) SW (-15.2,-11.8) W (-4.97,4.47) N (6.49,24.7)
 *   NE (12.29,21.42) E (6.53,-0.87), metres east/north of the anchor;
 * - way/109285744 building:part height 110.6 (the southern tower) and
 *   way/109285746 building:part height 80 (the northern block), split on W-E;
 * - way/266774911 building:part "Times Square Ball", 110.6-133.6 m.
 * All four are replaced. The NYPD substation (way/258646143, 258646148)
 * and the canopy way/1117680745 east of the building stand apart and stay.
 *
 * Lidar (measured): USGS NY_NewYorkCity, 2017 flight, 0.5 m grid
 * (tools/lidar.py grid ... 35 --res 0.5, read with lidar_frame.py at
 * bearing 29.5). Heights above the 43rd Street kerb:
 * - northern block roof 69.7 (71.0 above ground_min) where OSM says 80;
 * - southern tower parapet 104.3 (105.6; OSM 110.6 and Wikipedia's 363 ft
 *   (111 m) include the sign frames on top); a sunk deck ~100 in the middle;
 * - a 3 m deep structure across the tower roof at y -5..-8, 117-122,
 *   to 123.8 at its middle: the top screen and the numerals above it;
 * - the mast at (0.5, -9.5) to 147.2, the ball (2017) to 128.6;
 * - frames on the tower's north face to ~88 above the lower roof.
 * The flight predates the 2022-25 renovation: heights may have moved a
 * little at the top; photos from 2024-26 (s2, c1) show the same order of
 * screen, numerals, ball and mast.
 *
 * Published: the ball 12 ft (3.7 m) across (Wikipedia "Times Square
 * Ball"); 25 storeys (Wikipedia "One Times Square"), so ~4.1 m a storey.
 *
 * Estimated: the screen layout follows the renovated stack as n3 (2025)
 * shows it from Duffy Square, scaled on the lidar roof heights: one tall
 * screen on the lower block's north face (15-69 m), a square screen on
 * the tower's north face (75-88), the tower's glazed top floors (92-103),
 * the roof screen (105-121, 13 m wide, wider than the shaft as in n3 and
 * s2), the numerals (121-124) and the ball. Widths (10.8-13 m against the
 * 6.7 m face) from the screens' proportions in n3, p1 and s2. Side screens
 * on Seventh Avenue and Broadway (p1, n2 show lit screens down both flanks
 * of the lower block; their extent is a guess); the base ring of screens
 * below the zipper and the big screen above it on 42nd Street (q1); the
 * zipper at 12.6-14.2 m (p1, p5, q1); cabinet depth 0.5-1 m.
 * Screens are bold colour blocks in three colours, as the stack reads
 * from the square: blue, red and amber (the tall screen split blue over
 * amber, as n3 shows it); the content rotates, so no lettering, and the
 * numerals are a plain amber block. The ball is drawn 4.4 m across, a
 * fifth over its real 3.7 m, so it still shows at phone size.
 * Invented: the window grouping on the tower's flanks and the south face
 * above 31 m (dark glazed panels, two storeys a panel); no licensed photo
 * shows those faces squarely since the renovation.
 *
 * Night: every screen face, the zipper, the shopfronts (lit signage) and
 * the numerals are `neon-*`; the ball is `neon-ball` (lit crystal; it glows
 * at the top of the stack in every night photo). The flanks' glazing is
 * `glass` and stays dark, as the tower's flanks are dark in p4, n2 and n3.
 * The cladding, cabinets and mast stay dark. The mast has no lamp beads:
 * no photo shows any.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - p1 "One Times Square May 2014.jpg", TastyPoutine, CC BY-SA 3.0: from
 *   the north, the whole stack, ball on its mast above the numerals.
 *   https://commons.wikimedia.org/wiki/File:One_Times_Square_May_2014.jpg
 * - p4 "One Times Square, Manhattan, New York (7237736932).jpg", Ken Lund,
 *   CC BY-SA 2.0: from the north at night.
 *   https://commons.wikimedia.org/wiki/File:One_Times_Square,_Manhattan,_New_York_(7237736932).jpg
 * - p6 "Pano timesquare.jpg", Kerrbenj, CC BY-SA 3.0: from the north, the
 *   screens' cabinets and outriggers, the tower's flank.
 *   https://commons.wikimedia.org/wiki/File:Pano_timesquare.jpg
 * - p5 "Times Square New York City FLIKR 4 One Times Square Close.jpg",
 *   click-see, CC BY-SA 2.0: a screen cabinet and the zipper below it.
 *   https://commons.wikimedia.org/wiki/File:Times_Square_New_York_City_FLIKR_4_One_Times_Square_Close.jpg
 * - n2 "One Time Square (6454704097).jpg", Maarten Heerlien, CC BY 2.0:
 *   night, from the north-west, the Seventh Avenue flank lit.
 *   https://commons.wikimedia.org/wiki/File:One_Time_Square_(6454704097).jpg
 * - n3 "Times Square, NYC at night - August 2025.jpg", Nielsoncaetanosalmeron,
 *   CC BY 4.0: the renovated stack at night from Duffy Square.
 *   https://commons.wikimedia.org/wiki/File:Times_Square,_NYC_at_night_-_August_2025.jpg
 * - p7 "One Times Square New Year's Ball.jpg", Scu ba, CC0: the ball on
 *   its mast, from the roof; mast and ball proportions.
 *   https://commons.wikimedia.org/wiki/File:One_Times_Square_New_Year%27s_Ball.jpg
 * - p2 "Times Square Ball from above.jpg", Anthony Quintano, CC BY 2.0:
 *   from the mast top, the roof deck and the ball at the mast's foot.
 *   https://commons.wikimedia.org/wiki/File:Times_Square_Ball_from_above.jpg
 * - r1 "Refurbishing Times Tower 2024 jeh.jpg", Jim.henderson, CC BY-SA 4.0:
 *   the frame stripped in 2024; the wedge plan and the tower's flanks.
 *   https://commons.wikimedia.org/wiki/File:Refurbishing_Times_Tower_2024_jeh.jpg
 * - s2 "NASA Artemis II Crew Visits Times Square Skywalk (NHQ202604300012).jpg",
 *   NASA/public domain: the renovated top, dark glazed block, roof screen,
 *   numerals and mast.
 *   https://commons.wikimedia.org/wiki/File:NASA_Artemis_II_Crew_Visits_Times_Square_Skywalk_(NHQ202604300012).jpg
 * - q1 "42nd Street, Midtown Manhattan, at Times Square (7237734226).jpg",
 *   Ken Lund, CC BY-SA 2.0: night, the 42nd Street corner, zipper and screens.
 *   https://commons.wikimedia.org/wiki/File:42nd_Street,_Midtown_Manhattan,_at_Times_Square_(7237734226).jpg
 * - c1 "Constellation Ball at Times Square, 2026.jpg", User697755, CC0: the
 *   2026 ball resting just above the numerals.
 *   https://commons.wikimedia.org/wiki/File:Constellation_Ball_at_Times_Square,_2026.jpg
 *
 * Doubts: the southern flanks and the 42nd Street face above 31 m are
 * drawn as glazed cladding; the 2025 renovation added glazed observation
 * floors and a skywalk near the top, drawn only as glazing; screen sizes
 * are photo estimates; the lidar is from before the renovation, and OSM's
 * 80 m for the lower block disagrees with the lidar's 69.7 m (used).
 * The top screen's back (south) is drawn dark: no photo shows it.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

type XY = [number, number]
const clad = new Part(), win = new Part(), blue = new Part(), red = new Part(), amber = new Part(), ball = new Part()

// --------------------------------------------------------------- the plan
const BEARING = 29.5
const rot = ([e, n]: XY): XY => {
  const b = (BEARING * Math.PI) / 180
  return [e * Math.cos(b) - n * Math.sin(b), e * Math.sin(b) + n * Math.cos(b)]
}
// OSM way/266170825, metres east/north of the anchor, turned into the frame.
const S = rot([1.38, -21.18]), SW = rot([-15.2, -11.8]), W = rot([-4.97, 4.47])
const N = rot([6.49, 24.7]), NE = rot([12.29, 21.42]), E = rot([6.53, -0.87])

const Z_LOW = 69.7 // northern block roof (lidar)
const Z_TOP = 104.3 // southern tower parapet (lidar)
const CHAMFER = 0.45

const up: V3 = [0, 0, 1], down: V3 = [0, 0, -1]
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  p.tri(a, c, d, undefined, undefined, undefined, [n, n, n])
}
const outward = (a: XY, b: XY): V3 => {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1])
  return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l, 0]
}
/** Cut the listed corners of a ring (counter-clockwise) by `c` metres. */
function chamfer(ring: XY[], corners: number[], c = CHAMFER): XY[] {
  const out: XY[] = []
  ring.forEach((b, i) => {
    if (!corners.includes(i)) { out.push(b); return }
    const a = ring[(i + ring.length - 1) % ring.length], d = ring[(i + 1) % ring.length]
    const la = Math.hypot(a[0] - b[0], a[1] - b[1]), ld = Math.hypot(d[0] - b[0], d[1] - b[1])
    out.push([b[0] + ((a[0] - b[0]) * c) / la, b[1] + ((a[1] - b[1]) * c) / la])
    out.push([b[0] + ((d[0] - b[0]) * c) / ld, b[1] + ((d[1] - b[1]) * c) / ld])
  })
  return out
}
/** Walls (skipping edges that start at a `skip` corner) and caps of a convex ring. */
function prism(p: Part, ring: XY[], z0: number, z1: number, opts: { skip?: XY[]; top?: boolean; bottom?: boolean } = {}) {
  ring.forEach((a, i) => {
    const b = ring[(i + 1) % ring.length]
    if (opts.skip?.some((s) => Math.hypot(s[0] - a[0], s[1] - a[1]) < 1e-6)) return
    quadN(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], outward(a, b))
  })
  const fan = (z: number, n: V3) => {
    for (let i = 1; i < ring.length - 1; i++) p.tri([ring[0][0], ring[0][1], z], [ring[i][0], ring[i][1], z], [ring[i + 1][0], ring[i + 1][1], z], undefined, undefined, undefined, [n, n, n])
  }
  if (opts.top !== false) fan(z1, up)
  if (opts.bottom) fan(z0, down)
}

// Southern tower: below the lower roof its north side is inside the block.
const towerRing: XY[] = [SW, S, E, W]
prism(clad, chamfer(towerRing, [0, 1]), 0, Z_LOW, { skip: [E] })
prism(clad, chamfer(towerRing, [0, 1, 2, 3]), Z_LOW, Z_TOP)
// Northern block, the narrow end on 43rd Street; its south side is inside.
const blockRing: XY[] = [W, E, NE, N]
prism(clad, chamfer(blockRing, [2, 3]), 0, Z_LOW, { skip: [W] })

// ------------------------------------------------------- facade helpers
/** A point on wall a->b: s along it, height z, d out from it. */
function wallPoint(a: XY, b: XY) {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / l, (b[1] - a[1]) / l]
  const n = outward(a, b)
  return { l, n, v: (s: number, z: number, d: number): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z] }
}
/** Flat window panels in bays across a wall, between heights. */
function windows(a: XY, b: XY, bands: [number, number][], bay = 6.2, margin = 1.0, part = win) {
  const { l, n, v } = wallPoint(a, b)
  const usable = l - 2 * margin, count = Math.max(1, Math.round(usable / bay)), step = usable / count, w = step * 0.74
  for (const [z0, z1] of bands)
    for (let k = 0; k < count; k++) {
      const s0 = margin + step * (k + 0.5) - w / 2
      quadN(part, v(s0, z0, 0.05), v(s0 + w, z0, 0.05), v(s0 + w, z1, 0.05), v(s0, z1, 0.05), n)
    }
}
/**
 * An LED screen on its cabinet in front of wall a->b: from s0 to s1 along
 * it (beyond the ends where it cantilevers past a corner), z0 to z1. The
 * cabinet stands 0.3 m off the wall and is `depth` deep; only its face is lit.
 */
function screen(a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, face: Part, depth = 0.8, off = 0.3, upper?: { z: number; part: Part }) {
  const { n, v } = wallPoint(a, b)
  const u: V3 = [(b[0] - a[0]), (b[1] - a[1]), 0], ul = Math.hypot(u[0], u[1])
  const un: V3 = [u[0] / ul, u[1] / ul, 0], neg = (q: V3): V3 => [-q[0], -q[1], -q[2]]
  const d0 = off, d1 = off + depth, r = 0.35 // the dark rim round the lit face
  const c = (s: number, z: number, d: number) => v(s, z, d)
  // lit face, inside a dark rim
  // (two colour blocks on one cabinet where the picture is split)
  const zs = upper ? upper.z : z1 - r
  quadN(face, c(s0 + r, z0 + r, d1), c(s1 - r, z0 + r, d1), c(s1 - r, zs, d1), c(s0 + r, zs, d1), n)
  if (upper) quadN(upper.part, c(s0 + r, zs, d1), c(s1 - r, zs, d1), c(s1 - r, z1 - r, d1), c(s0 + r, z1 - r, d1), n)
  quadN(clad, c(s0, z0, d1), c(s1, z0, d1), c(s1, z0 + r, d1), c(s0, z0 + r, d1), n)
  quadN(clad, c(s0, z1 - r, d1), c(s1, z1 - r, d1), c(s1, z1, d1), c(s0, z1, d1), n)
  quadN(clad, c(s0, z0 + r, d1), c(s0 + r, z0 + r, d1), c(s0 + r, z1 - r, d1), c(s0, z1 - r, d1), n)
  quadN(clad, c(s1 - r, z0 + r, d1), c(s1, z0 + r, d1), c(s1, z1 - r, d1), c(s1 - r, z1 - r, d1), n)
  // cabinet: top, bottom, ends, back
  quadN(clad, c(s0, z1, d0), c(s1, z1, d0), c(s1, z1, d1), c(s0, z1, d1), up)
  quadN(clad, c(s0, z0, d0), c(s1, z0, d0), c(s1, z0, d1), c(s0, z0, d1), down)
  quadN(clad, c(s0, z0, d0), c(s0, z0, d1), c(s0, z1, d1), c(s0, z1, d0), neg(un))
  quadN(clad, c(s1, z0, d0), c(s1, z0, d1), c(s1, z1, d1), c(s1, z1, d0), un)
  quadN(clad, c(s0, z0, d0), c(s1, z0, d0), c(s1, z1, d0), c(s0, z1, d0), neg(n))
}

// ------------------------------------------------------- the north stack
// As renovated (n3, 2025; s2, 2026): one tall screen on the lower block's
// 43rd Street face (NE -> N, facing +y), a square screen on the tower's
// north face above the lower roof, the tower's glazed top floors, and the
// wide roof screen. Screens ~10.4-12 m wide, centred on their faces.
{
  const { l } = wallPoint(NE, N), s0 = l / 2 - 5.4, s1 = l / 2 + 5.4
  screen(NE, N, s0, s1, 4.8, 12.2, blue)
  screen(NE, N, s0, s1, 15.0, 68.8, amber, 0.8, 0.3, { z: 40.5, part: blue })
}
// The tower's north face above the lower roof, E -> W.
{
  const { l } = wallPoint(E, W), s0 = l / 2 - 6.0, s1 = l / 2 + 6.0
  screen(E, W, s0, s1, 74.6, 88.0, red)
  windows(E, W, [[92.4, 102.6]], 3.4, 0.9)
}
// The flanks of the lower block: Seventh Avenue (N -> W) and Broadway (E -> NE).
for (const [a, b, first, second] of [[N, W, red, blue], [E, NE, blue, red]] as [XY, XY, Part, Part][]) {
  const { l } = wallPoint(a, b)
  screen(a, b, 1.6, l - 1.6, 15.0, 30.4, first, 0.6)
  screen(a, b, 1.6, l - 1.6, 31.0, 46.4, second, 0.6)
  windows(a, b, [[48.4, 56.8], [58.6, 67.4]], 6.2, 1.2)
}

// The base: screens between the shopfronts and the zipper all round, and a
// big screen above the zipper on 42nd Street (q1: the 42nd Street corner
// with the zipper turning it, screens above and below).
for (const [a, b, part] of [[SW, S, red], [S, E, blue], [W, SW, blue], [N, W, red], [E, NE, red]] as [XY, XY, Part][]) {
  const { l } = wallPoint(a, b)
  screen(a, b, 1.2, l - 1.2, 4.8, 12.2, part, 0.5, 0.2)
}
{
  const { l } = wallPoint(SW, S)
  screen(SW, S, 1.2, l - 1.2, 15.0, 30.4, amber, 0.8)
}

// ------------------------------------------------------- the top screen
// Standing across the tower roof at y -5.5..-6.7, facing 43rd Street, with
// the year's numerals on top (lidar: 117-122, numerals to 123.8).
{
  const a: XY = [6.6, -6.7], b: XY = [-6.4, -6.7] // wall line, facing +y
  screen(a, b, 0, 13, Z_TOP + 0.6, 121.2, blue, 1.0, 0)
  screen(a, b, 3.0, 10.0, 121.2, 123.8, amber, 0.6, 0.2)
}

// ------------------------------------------------------- the zipper
// The news ticker wraps the whole base: an amber band on a dark shelf.
{
  const ring: XY[] = [S, E, NE, N, W, SW]
  const off = (d: number): XY[] => ring.map((b, i) => {
    const a = ring[(i + ring.length - 1) % ring.length], c = ring[(i + 1) % ring.length]
    const n1 = outward(a, b), n2 = outward(b, c)
    const m: XY = [n1[0] + n2[0], n1[1] + n2[1]], k = d / (1 + n1[0] * n2[0] + n1[1] * n2[1])
    return [b[0] + m[0] * k, b[1] + m[1] * k]
  })
  const inner = off(0), outer = off(0.65), z0 = 12.6, z1 = 14.2
  ring.forEach((_, i) => {
    const j = (i + 1) % ring.length, o0 = outer[i], o1 = outer[j], i0 = inner[i], i1 = inner[j]
    quadN(amber, [o0[0], o0[1], z0], [o1[0], o1[1], z0], [o1[0], o1[1], z1], [o0[0], o0[1], z1], outward(o0, o1))
    quadN(clad, [i0[0], i0[1], z1], [o0[0], o0[1], z1], [o1[0], o1[1], z1], [i1[0], i1[1], z1], up)
    quadN(clad, [i0[0], i0[1], z0], [o0[0], o0[1], z0], [o1[0], o1[1], z0], [i1[0], i1[1], z0], down)
  })
}

// ------------------------------------------------------- windows
// Shopfronts all round; the tower's three outer faces in two-storey panels.
const shop: [number, number][] = [[0.4, 4.3]]
for (const [a, b] of [[SW, S], [S, E], [E, NE], [NE, N], [N, W], [W, SW]] as [XY, XY][]) windows(a, b, shop, 5.0, 0.8, amber)
const towerBands: [number, number][] = []
for (let z = 15.4; z + 7.2 <= Z_TOP - 2.6; z += 8.3) towerBands.push([z, z + 6.6])
windows(SW, S, towerBands.filter(([z0]) => z0 > 31), 6.3, 1.0)
windows(S, E, towerBands, 6.8, 1.0)
windows(W, SW, towerBands, 6.8, 1.0)

// ------------------------------------------------------- mast and ball
const MAST: XY = [0.5, -9.5], MAST_TOP = 147.2
{
  const seg = 12, rings: [number, number][] = [[Z_TOP, 0.75], [128.5, 0.62], [MAST_TOP - 0.4, 0.5]]
  const pts = rings.map(([z, r]) => Array.from({ length: seg }, (_, i): V3 => {
    const t = (2 * Math.PI * i) / seg
    return [MAST[0] + r * Math.cos(t), MAST[1] + r * Math.sin(t), z]
  }))
  clad.loft(pts)
  const tip: V3 = [MAST[0], MAST[1], MAST_TOP]
  const last = pts[pts.length - 1]
  for (let i = 0; i < seg; i++) clad.tri(last[i], last[(i + 1) % seg], tip)
}
// The ball: a faceted geodesic sphere (icosahedron, twice subdivided),
// 3.7 m across, resting just above the numerals.
{
  const R = 2.2, C: V3 = [MAST[0], MAST[1], 126.75]
  const t = (1 + Math.sqrt(5)) / 2
  let verts: V3[] = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]]
  let faces: number[][] = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]]
  const norm = (p: V3): V3 => { const l = Math.hypot(...p); return [p[0] / l, p[1] / l, p[2] / l] }
  verts = verts.map(norm)
  for (let k = 0; k < 2; k++) {
    const cache = new Map<string, number>(), next: number[][] = []
    const midpoint = (i: number, j: number) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (!cache.has(key)) { verts.push(norm([(verts[i][0] + verts[j][0]) / 2, (verts[i][1] + verts[j][1]) / 2, (verts[i][2] + verts[j][2]) / 2])); cache.set(key, verts.length - 1) }
      return cache.get(key)!
    }
    for (const [a, b, c] of faces) { const ab = midpoint(a, b), bc = midpoint(b, c), ca = midpoint(c, a); next.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]) }
    faces = next
  }
  const P = (i: number): V3 => [C[0] + verts[i][0] * R, C[1] + verts[i][1] * R, C[2] + verts[i][2] * R]
  for (const [a, b, c] of faces) {
    const n = norm([verts[a][0] + verts[b][0] + verts[c][0], verts[a][1] + verts[b][1] + verts[c][1], verts[a][2] + verts[b][2] + verts[c][2]])
    ball.tri(P(a), P(b), P(c), undefined, undefined, undefined, [n, n, n])
  }
}

// ------------------------------------------------------- write
const parts = [
  { part: clad, material: finish('cladding', 0x50555c) },
  { part: win, material: { name: 'glass', color: 0x6c7b88, roughness: 0.3 } },
  { part: blue, material: finish('neon-screen-blue', 0x3d86d6) },
  { part: red, material: finish('neon-screen-red', 0xd8363f) },
  { part: amber, material: finish('neon-screen-amber', 0xf0a132) },
  { part: ball, material: finish('neon-ball', 0xf3c9dd) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('One Times Square', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, height: MAST_TOP,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/266170825', 'way/109285744', 'way/109285746', 'way/266774911'],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-one-times-square.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
