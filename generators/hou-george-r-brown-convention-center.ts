/**
 * George R. Brown Convention Center, Houston (1987, Golemon & Rolfe,
 * John S. Chase, Haywood Jordan McCowan, Molina & Associates; extended
 * 2001-03; Grand Lobby 2016). Procedural, CC0-1.0, no textures.
 * bun generators/hou-george-r-brown-convention-center.ts
 *
 * What makes it read as itself: a very long white box, nearly half a
 * kilometre, "ship-like", with rows of big red bent ventilator stacks along
 * both long edges of its roof, each group a row of bent pipes turned out
 * over the edge like a liner's cowl vents; blue steel trusses on blue columns spanning the gaps along the
 * west front (Avenida de las Americas, facing Discovery Green); and that
 * front broken into glazed meeting-room blocks between white drum towers
 * with horizontal slits, the glazing marked with pairs of red discs. The
 * 2016 Grand Lobby stands out from the middle of the west front, glass with
 * two red drums.
 *
 * Frame: x across, y along the hall's long axis (turned to bearing 34.5,
 * the OSM outline's long edges), z up, metres; written as glTF +Y up. +x
 * points to bearing 124.5 (the east side, on the freeway), -x to the west
 * front. Anchor: the area centroid of OSM way/44129959, -95.3578636
 * 29.7521387. Ground is flat (lidar ground 13.0-13.3 m all round), so
 * y = 0 is the street. Elevation 0.
 *
 * Measured, USGS 3DEP lidar TX_Coastal_B1_2018 (2018 flight), 1 m grids,
 * read in this frame (G5b-tools/grbsamp.py over three tiles):
 * - the hall: x -61 to 73, y -240 to 238 (the OSM outline's long sides and
 *   ends within a metre), roof 30.3 m, parapet 31.4 m (OSM height=30);
 * - the stacks: 25 groups, their tops 36.5 m (6.2 m above the roof),
 *   along x = -59.5 (west) and x = 62 (east) and two at x = -50 near the
 *   ends; each group 5 m (two pipes) or 10 m (four pipes) long along y;
 * - the west front: the hall's wall at x -61 (parapet 31.4 m) behind
 *   meeting-room blocks 24.2 m high, x -73 to -61, at y 138-192, 63-108 and
 *   mirrored south; between them and at the ends the wall stands back at
 *   x -52, with entry halls 19.7 to 20.4 m high in front and a truss
 *   spanning the gap at the top (g10);
 * - the Grand Lobby: x -86 to -61, y -60 to 61, 30.8 m, a raised spine at
 *   x -76 to 32.6 m, and two drums (r 4 m) at y +-22.5 to 37.2 m. The lobby
 *   stands outside the OSM outline (way/44129959 ends at x -69.5); the
 *   lidar and NAIP both show it, so it is modelled.
 * Published: 1987, 100 ft (30 m) (Wikipedia); Grand Lobby 2016.
 * Estimated from the photos: each stack is a J, a vertical tube rising
 * from the roof and a quarter bend turning its open mouth outward over the
 * edge (g10 shows the west mouths face on from Discovery Green; g8 along
 * the edge). Measured against the 11 m drums (lidar), a pipe is 2.2 m
 * across in g10 and about 2.6 m in g1; taken as 2.4 m. Drawn a third
 * bolder, 3.2 m across with a 2 m bend radius, topping out at 37.3 m
 * against the lidar's 36.5, so the red still reads at phone size (STYLE:
 * signature features get bolder, not finer). Every cluster keeps its lidar
 * position and length; a four-pipe cluster is drawn as three of the bolder
 * pipes (3.4 m apart) to fit the same 10 m and the triangle budget.
 * Drums 5.5 m in radius with three dark slit bands; the red
 * discs 2.4 m across in pairs at the ends of each glazed block at the
 * second floor; the trusses 6 m deep in the plane of the main wall at its
 * top, Warren pattern, on columns at each end; the grey band (2.5-10 m)
 * round the east and end walls (g3); two red roll-up doors on the south
 * wall (g3).
 *
 * Photos (Wikimedia Commons), compared against the renders:
 * - g1 "George R. Brown Convention Center - Houston, Texas - DSC01321.JPG",
 *   Daderot, CC0 (2012): aerial from the north-west over the west front,
 *   the stacks on both edges, trusses, drums, glazed blocks, red discs;
 * - g2 "George R. Brown Convention Center 2.jpg", Brian Reading, CC BY-SA
 *   3.0 (2010), panorama of the west front from Discovery Green;
 * - g3 "George R. Brown Convention Center, Houston, Texas LCCN2011635365",
 *   Carol M. Highsmith, public domain: the south-west corner, south wall,
 *   blue column and truss;
 * - g5 "Discovery Green, 2012, water and convention center.JPG" and g10
 *   "GeorgeRBrownConvCenterFrontHouston.JPG" (Another Believer CC BY-SA 3.0;
 *   WhisperToMe, public domain): the west front face on;
 * - g6 "Houston Convention Center Exterior 1.jpg", Leijurv, CC BY-SA 4.0
 *   (2017): the Grand Lobby's glass and red drum;
 * - g8 "Houston Convention Center Nima.JPG", Zereshk, CC BY-SA 3.0: along
 *   the west roof edge looking north, the stacks' elbows and a truss.
 * NAIP (USGS, public domain): the white roof, the stacks, the lobby's roof.
 * Colours from g1, g3, g8 in sun: the panels white (#e9edf0), the stacks
 * fire red, pulled a little darker (#c8332e), the steel royal blue
 * (#3560a6); the band grey (#b7bbc5 in g3).
 *
 * Left out: the loading-dock recesses in the east wall (OSM notches at
 * x 63-73, under the roof), the canopies, flagpoles, skybridges to the
 * Hilton and Marriott, the rooftop units and solar array, lettering, the
 * 2023-25 Avenida work (no licensed photo found; the 2018 lidar predates
 * it).
 * Doubts: the east side's stack groups are read from lidar only (g1 shows
 * them from afar); two east clusters (y -146, y 144) spread across 13 m
 * and may be two groups side by side; drawn as one. The lobby's facade is
 * from one close photo (g6).
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { finish, PALETTE } from './palette'

const BEARING = 34.5
/** Stack radius: 2.4 m measured (g1, g10 against the 11 m drums), drawn a third bolder. */
const PIPE_R = 1.6
const TAU = Math.PI * 2
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

const white = new Part(), grey = new Part(), glass = new Part(), red = new Part(), blue = new Part(), lobby = new Part()

/** A triangle wound to agree with its normals. */
function tri(p: Part, v: V3[], n: V3[]) {
  const f = cross(sub(v[1], v[0]), sub(v[2], v[0]))
  if (dot(f, add(add(n[0], n[1]), n[2])) >= 0) p.tri(v[0], v[1], v[2], undefined, undefined, undefined, n)
  else p.tri(v[0], v[2], v[1], undefined, undefined, undefined, [n[0], n[2], n[1]])
}
function face(p: Part, q: V3[], n: V3) {
  tri(p, [q[0], q[1], q[2]], [n, n, n])
  if (q.length > 3) tri(p, [q[0], q[2], q[3]], [n, n, n])
}
/** An axis-aligned box, every face but the bottom; `skip` drops sides ('w','e','s','n'). */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, skip = '') {
  if (!skip.includes('w')) face(p, [[x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1]], [-1, 0, 0])
  if (!skip.includes('e')) face(p, [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], [1, 0, 0])
  if (!skip.includes('s')) face(p, [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], [0, -1, 0])
  if (!skip.includes('n')) face(p, [[x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1]], [0, 1, 0])
  face(p, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1])
}
/** A flat panel on a wall facing `n` (one of ±x, ±y), between (a0,z0) and (a1,z1) along the wall at offset w. */
function panel(p: Part, axis: 'x' | 'y', w: number, s: number, a0: number, a1: number, z0: number, z1: number) {
  if (axis === 'x') face(p, [[w, a0, z0], [w, a1, z0], [w, a1, z1], [w, a0, z1]], [s, 0, 0])
  else face(p, [[a0, w, z0], [a1, w, z0], [a1, w, z1], [a0, w, z1]], [0, s, 0])
}
/** A disc on a wall facing ±x. */
function disc(p: Part, x: number, s: number, y: number, z: number, r: number, n = 12) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU, b = ((i + 1) / n) * TAU
    face(p, [[x, y, z], [x, y + r * Math.cos(a), z + r * Math.sin(a)], [x, y + r * Math.cos(b), z + r * Math.sin(b)]], [s, 0, 0])
  }
}
/** A vertical cylinder with a flat top; `from`..`to` limits its arc (radians, 0 = +x). */
function cylinder(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, n = 16, cap = true) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU, b = ((i + 1) / n) * TAU
    const A: V3 = [cx + r * Math.cos(a), cy + r * Math.sin(a), 0], B: V3 = [cx + r * Math.cos(b), cy + r * Math.sin(b), 0]
    const na: V3 = [Math.cos(a), Math.sin(a), 0], nb: V3 = [Math.cos(b), Math.sin(b), 0]
    tri(p, [[A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1]], [na, nb, nb])
    tri(p, [[A[0], A[1], z0], [B[0], B[1], z1], [A[0], A[1], z1]], [na, nb, na])
    if (cap) face(p, [[cx, cy, z1], [A[0], A[1], z1], [B[0], B[1], z1]], [0, 0, 1])
  }
}
/** A cylinder band (no cap), a little proud of the drum: the dark slits. */
function band(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, n = 16, keep: (a: number) => boolean = () => true) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU, b = ((i + 1) / n) * TAU
    if (!keep((a + b) / 2)) continue
    const na: V3 = [Math.cos(a), Math.sin(a), 0], nb: V3 = [Math.cos(b), Math.sin(b), 0]
    const A: V3 = [cx + r * na[0], cy + r * na[1], 0], B: V3 = [cx + r * nb[0], cy + r * nb[1], 0]
    tri(p, [[A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1]], [na, nb, nb])
    tri(p, [[A[0], A[1], z0], [B[0], B[1], z1], [A[0], A[1], z1]], [na, nb, na])
  }
}
/** A square member from a to b, half-width h. */
function member(p: Part, a: V3, b: V3, h: number) {
  const T = unit(sub(b, a))
  let N = cross([0, 0, 1], T)
  if (Math.hypot(...N) < 1e-6) N = [1, 0, 0]
  N = unit(N)
  const B = unit(cross(T, N))
  const c = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => add(mul(N, u * h), mul(B, v * h)))
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4, n = unit(add(c[k], c[l]))
    face(p, [add(a, c[k]), add(a, c[l]), add(b, c[l]), add(b, c[k])], n)
  }
}

// =============================================================================
// The hall
// =============================================================================
const X0 = -61, XW = -52, X1 = 73.2, Y0 = -239.8, Y1 = 238.2
const ROOF = 30.3, PARAPET = 31.4
const BAND0 = 2.5, BAND1 = 10
{
  // Walls: white above a grey band on the east and the two ends; the west
  // wall is behind the front's blocks, lobby and bays.
  const wall = (axis: 'x' | 'y', w: number, s: number, a0: number, a1: number, banded: boolean) => {
    if (banded) {
      panel(grey, axis, w, s, a0, a1, 0, BAND1)
      panel(white, axis, w, s, a0, a1, BAND1, PARAPET)
    } else panel(white, axis, w, s, a0, a1, 0, PARAPET)
  }
  wall('x', X1, 1, Y0, Y1, true)
  wall('x', XW, -1, Y1, Y0, false)
  wall('y', Y0, -1, XW, X1, true)
  wall('y', Y1, 1, X1, XW, true)
  // Roof and parapet: the roof 1.1 m below a 0.8 m parapet ring.
  const k = 0.8
  face(white, [[XW + k, Y0 + k, ROOF], [X1 - k, Y0 + k, ROOF], [X1 - k, Y1 - k, ROOF], [XW + k, Y1 - k, ROOF]], [0, 0, 1])
  face(white, [[XW, Y0, PARAPET], [X1, Y0, PARAPET], [X1 - k, Y0 + k, PARAPET], [XW + k, Y0 + k, PARAPET]], [0, 0, 1])
  face(white, [[X1, Y0, PARAPET], [X1, Y1, PARAPET], [X1 - k, Y1 - k, PARAPET], [X1 - k, Y0 + k, PARAPET]], [0, 0, 1])
  face(white, [[X1, Y1, PARAPET], [XW, Y1, PARAPET], [XW + k, Y1 - k, PARAPET], [X1 - k, Y1 - k, PARAPET]], [0, 0, 1])
  face(white, [[XW, Y1, PARAPET], [XW, Y0, PARAPET], [XW + k, Y0 + k, PARAPET], [XW + k, Y1 - k, PARAPET]], [0, 0, 1])
  // Parapet inner faces.
  face(white, [[XW + k, Y0 + k, ROOF], [XW + k, Y1 - k, ROOF], [XW + k, Y1 - k, PARAPET], [XW + k, Y0 + k, PARAPET]], [1, 0, 0])
  face(white, [[X1 - k, Y1 - k, ROOF], [X1 - k, Y0 + k, ROOF], [X1 - k, Y0 + k, PARAPET], [X1 - k, Y1 - k, PARAPET]], [-1, 0, 0])
  face(white, [[X1 - k, Y0 + k, ROOF], [XW + k, Y0 + k, ROOF], [XW + k, Y0 + k, PARAPET], [X1 - k, Y0 + k, PARAPET]], [0, 1, 0])
  face(white, [[XW + k, Y1 - k, ROOF], [X1 - k, Y1 - k, ROOF], [X1 - k, Y1 - k, PARAPET], [XW + k, Y1 - k, PARAPET]], [0, -1, 0])
  // The south wall's red roll-up doors (g3): one tall, then a low row.
  panel(red, 'y', Y0 - 0.05, -1, -12, -5, 0, 8)
  panel(red, 'y', Y0 - 0.05, -1, 4, 16, 0, 2.6)
}

// =============================================================================
// The west front
// =============================================================================
/** A meeting-room block: glazing between two white drums, red discs at its ends. */
function block(y0: number, y1: number) {
  const H = 24.2, R = 5.5, xf = -72.5, xc = xf + R
  const g0 = y0 + R, g1 = y1 - R
  // The glazed box: white floor slabs and roof, two glass bands, each two storeys.
  box(white, xf + 0.6, X0, g0, g1, 0, H - 0.6, 'ens')
  for (const [z0, z1] of [[1.2, 4.6], [5.6, 12.4], [13.4, 21.6]]) panel(glass, 'x', xf + 0.55, -1, g1, g0, z0, z1)
  for (const y of [g0 + 3, g1 - 3]) {
    const s = y < (g0 + g1) / 2 ? 1 : -1
    disc(red, xf + 0.5, -1, y, 8.4, 1.2)
    disc(red, xf + 0.5, -1, y + s * 2.7, 8.4, 1.2)
  }
  // The drums: white cylinders, three dark slit bands facing out.
  for (const yc of [g0, g1]) {
    cylinder(white, xc, yc, R, 0, H + 0.4, 16)
    const out = (a: number) => Math.cos(a) < 0.3
    for (const z of [7.4, 13.6, 19.8]) band(glass, xc, yc, R + 0.05, z, z + 0.9, 16, out)
  }
}
// The front of the hall: white walls to the parapet at x = -61 behind the
// blocks and the lobby; in the bays the hall's wall stands back at x = -52.
for (const [y0, y1] of [[138, 192], [-108, 108], [-192, -138]]) box(white, X0, XW, y0, y1, 0, PARAPET, 'e')
block(138, 192)
block(63, 108)
block(-108, -63)
block(-192, -138)

/** An entry bay: a glazed hall in front of the main wall, under a blue truss. */
function bay(y0: number, y1: number, h: number, depth: number) {
  const xf = X0 - depth
  box(white, xf, XW, y0, y1, 0, h, 'e')
  for (const [z0, z1] of [[0.8, 7.6], [8.6, h - 1.2]]) panel(glass, 'x', xf - 0.05, -1, y1 - 1, y0 + 1, z0, z1)
}
bay(192, Y1, 20.4, 6)
bay(108, 138, 19.7, 3)
bay(-138, -108, 19.7, 3)
bay(Y0, -192, 20.4, 6)

/** A Warren truss in the plane x = xp, from y0 to y1, between z 24.6 and 30.8, on columns. */
function truss(y0: number, y1: number, foot0: number, foot1: number) {
  const xp = X0 - 0.9, zb = 24.8, zt = 30.6, h = 0.5
  member(blue, [xp, y0, zt], [xp, y1, zt], h)
  member(blue, [xp, y0, zb], [xp, y1, zb], h)
  const n = Math.max(2, Math.round((y1 - y0) / 6))
  for (let i = 0; i < n; i++) {
    const a = y0 + ((y1 - y0) * i) / n, b = y0 + ((y1 - y0) * (i + 1)) / n
    member(blue, i % 2 ? [xp, a, zt] : [xp, a, zb], i % 2 ? [xp, b, zb] : [xp, b, zt], h * 0.8)
  }
  // Columns at the ends, from what they stand on to above the truss.
  member(blue, [xp, y0, foot0], [xp, y0, zt + 1.2], 0.6)
  member(blue, [xp, y1, foot1], [xp, y1, zt + 1.2], 0.6)
}
truss(192, Y1 - 0.5, 24.6, 0)
truss(108, 138, 24.6, 24.6)
truss(-138, -108, 24.6, 24.6)
truss(Y0 + 0.5, -192, 0, 24.6)

// The Grand Lobby (2016): a glass hall out from the middle of the front, its
// roof on a raised spine, two red drums.
{
  const xf = -86, y0 = -60.5, y1 = 61, H = 30.8
  face(white, [[xf, y0, H], [X0, y0, H], [X0, y1, H], [xf, y1, H]], [0, 0, 1])
  // The glass walls, framed at the corners and along the top.
  panel(lobby, 'x', xf, -1, y1, y0, 0, H - 1.2)
  panel(lobby, 'y', y0, -1, xf, X0, 0, H - 1.2)
  panel(lobby, 'y', y1, 1, X0, xf, 0, H - 1.2)
  panel(white, 'x', xf, -1, y1, y0, H - 1.2, H)
  panel(white, 'y', y0, -1, xf, X0, H - 1.2, H)
  panel(white, 'y', y1, 1, X0, xf, H - 1.2, H)
  for (const y of [y0, -20, 20, y1]) member(white, [xf + 0.4, y, 0], [xf + 0.4, y, H - 1.2], 0.4)
  box(white, -77, -75, y0 + 1, y1 - 1, H, 32.6)
  for (const yc of [-22.5, 22.5]) cylinder(red, -70, yc, 4, H, 37.2, 16)
  // The drums run down through the glass to the ground (g6): red behind the front.
  for (const yc of [-22.5, 22.5]) band(red, -70, yc, 4, 0, H, 16)
}

// =============================================================================
// The stacks
// =============================================================================
/**
 * A ventilator: a vertical pipe from the roof, a 90-degree elbow, the
 * opening facing south (-y). Eight sides; the end capped red.
 */
function pipe(x: number, y: number, out: number) {
  const r = PIPE_R, rb = 2.0, zb = 37.3 - r - rb, n = 8
  const ring = (c: V3, T: V3, U: V3, rr = r): V3[] => Array.from({ length: n }, (_, i) => {
    const a = (i / n) * TAU
    return add(c, add(mul(U, rr * Math.cos(a)), mul(cross(T, U), rr * Math.sin(a))))
  })
  const centre = (t: number): V3 => [x + out * (rb - rb * Math.cos(t)), y, zb + rb * Math.sin(t)]
  const tang = (t: number): V3 => [out * Math.sin(t), 0, Math.cos(t)]
  const Y: V3 = [0, 1, 0]
  // The J: a vertical tube from the roof, then a quarter bend in two steps.
  const ts = [0, Math.PI / 4, Math.PI / 2]
  const cs: V3[] = [[x, y, ROOF - 0.2], ...ts.map(centre)]
  const rings = [ring(cs[0], [0, 0, 1], Y), ...ts.map((t, i) => ring(cs[i + 1], tang(t), Y))]
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const na = unit(sub(rings[k][i], cs[k])), nb = unit(sub(rings[k][j], cs[k]))
      const ma = unit(sub(rings[k + 1][i], cs[k + 1])), mb = unit(sub(rings[k + 1][j], cs[k + 1]))
      tri(red, [rings[k][i], rings[k][j], rings[k + 1][j]], [na, nb, mb])
      tri(red, [rings[k][i], rings[k + 1][j], rings[k + 1][i]], [na, mb, ma])
    }
  // The open mouth, facing out: the tube's inside wall runs 0.6 m back to a
  // closed end, so the mouth reads as an opening ringed by the pipe's lip.
  const end = rings[3], back = add(cs[3], [-out * 0.6, 0, 0])
  const inner = ring(back, tang(Math.PI / 2), Y, r * 0.97)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const ni = unit(sub(cs[3], end[i])), nj = unit(sub(cs[3], end[j]))
    tri(red, [end[i], inner[i], inner[j]], [[ni[0], ni[1], ni[2]] as V3, ni, nj])
    tri(red, [end[i], inner[j], end[j]], [ni, nj, nj])
  }
  const nn: V3 = [out, 0, 0]
  for (let i = 1; i < n - 1; i++) tri(red, [inner[0], inner[i], inner[i + 1]], [nn, nn, nn])
}
const GROUPS: [number, number, number][] = [
  // west edge, x, centre y, pipes
  [-59.5, -186, 2], [-59.5, -147, 4], [-59.5, -104, 2], [-59.5, -64.5, 4], [-60, -18.5, 4], [-60, 18, 4],
  [-59.5, 63, 4], [-59.5, 103, 2], [-59.5, 146.5, 4], [-59, 185.5, 2], [-50, -216, 4], [-50, 215, 4],
  // east edge
  [62, -232.5, 2], [62, -184.5, 4], [62, -161.5, 2], [65, -146, 4], [62, -104.5, 2], [62, -78, 2], [69.5, 1.5, 2],
  [64, 16, 4], [62, 76.5, 2], [62, 104, 2], [65, 144, 4], [62, 159.5, 2], [62, 185, 4], [63, 231, 2],
]
// Each cluster keeps its lidar position and length; a four-pipe cluster is
// drawn as three of the bolder pipes so it fills the same 10 m of edge.
for (const [x, yc, k] of GROUPS) {
  const m = k === 4 ? 3 : k
  for (let i = 0; i < m; i++) pipe(x, yc + (i - (m - 1) / 2) * 3.4, x < 0 ? -1 : 1)
}

const parts = [
  { part: white, material: finish('grb-white', 0xe9edf0) },
  { part: grey, material: finish('grb-grey', 0xb4b9bf) },
  { part: glass, material: PALETTE.window },
  { part: lobby, material: { name: 'window-2', color: 0x9fb8cc, roughness: 0.3 } },
  { part: red, material: finish('grb-red', 0xc8332e, 0.6) },
  { part: blue, material: finish('grb-blue', 0x3560a6, 0.6) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(12), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('George R. Brown Convention Center', parts, {
  license: 'CC0-1.0', bearing: BEARING, anchor: [29.7521387, -95.3578636], height: 37.2,
  frame: 'Y up, -Z along bearing 34.5, metres; origin on the street at the anchor',
  replaces: ['way/44129959'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/hou-george-r-brown-convention-center.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
