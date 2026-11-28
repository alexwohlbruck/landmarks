/**
 * Chase Field (Arizona Diamondbacks, 1998, Ellerbe Becket), Phoenix,
 * Arizona — procedural, CC0-1.0.
 * bun generators/phx-chase-field.ts
 *
 * What makes it Chase Field: the huge pale retractable roof, a shallow
 * barrel vaulted north-south whose panels step down east and west (each
 * half is three moving panels telescoping over a fixed end panel); the
 * sage-green fascia on the roof's arched east and west ends with the open
 * steel arch truss under it, a pale upper wall showing through; the tall
 * blocks in the middle of the east and west sides (pale panels between
 * glass pilasters, a dark louvre band, glass corner towers) on a sage-green
 * steel and red-brick base; the curved home-plate stand at the south end
 * on its brick podium; and the glazed north (outfield) wall under the low
 * roof eave, with the low centre-field block in front of it.
 *
 * Frame: bearing 0, built north-up (x east, y north, metres). The anchor
 * is the area centroid of OSM way/24635438 (building=stadium, height 73.7,
 * start_date 1998), -112.066772 33.445381.
 *
 * Ground: y = 0 is the field. Published: "the playing field is actually
 * 25 feet below street level" (nowhitting.com, "Chase Field construction
 * facts"; baseballpilgrimages.com), so the street is S = 7.6 m up; lidar
 * gives about 8.5 m (ground under the roof is interpolated). Everything is
 * drawn as heights above the street plus S; walls run down to y = 0. The
 * map's terrain (Mapterhorn) is at street level across the footprint (the
 * pit isn't in it), apart from an east service ramp down to field level.
 * Catalog elevation 0, not -7.6: the lowest Mapterhorn ground under the
 * footprint is the east ramp's foot at field level (322.7 m), so the map
 * already puts y = 0 at the field; `terrain.ts check` with -7.6 buried
 * 4,900 m2 of tops by 4.3 m, with 0 it prints ok twice.
 *
 * Heights (lidar, USGS 3DEP AZ_MaricopaPinal_1_2020, flown 2020 with the
 * roof closed; read with tools/lidar_frame.py, metres above the street):
 * - the roof's seven strips, west to east: x -98..-79 61, -79..-55 63,
 *   -55..-25 65, -25..35 67 (the two inner panels meeting), 35..59 65,
 *   59..83 63, 83..109 61, at their crown (y about +6); the vault falls to
 *   about 45 at the north eave (y = 91) and 48 at the south (y = -77):
 *   modelled as a circular arc of radius 169.5 m;
 * - the east and west tall blocks 41 (y -30..46), the bowl's corners 20;
 * - the south home-plate stand 44 at the bowl falling to 36 at its curved
 *   front, its podium 20; the north centre-field block 10; the west
 *   appendage and south-east block 6.
 * - published: OSM height 73.7 (field to crown) against lidar 67 + 7.6.
 * - estimated from the photos: the facade bands (brick to 9 m, green steel
 *   to 20, pale panels to 38, louvres to 41), the arch truss depth (8 m),
 *   the roof panel thickness (3 m), the glass towers' size.
 *
 * Photos (Wikimedia Commons), compared against the renders:
 * - "Chase Field aerial.jpg", Dicklyon, CC BY-SA 4.0: from the south, roof
 *   part open, the stacked panels, the curved home-plate stand, the plan;
 * - "Chase Field - 2011-07-11 - Exterior North West.jpg", Cygnusloop99,
 *   CC BY-SA 3.0: the west side, the arch truss and green fascia;
 * - "Chase Field - 2011-07-11 - Exterior North East (1).jpg", Cygnusloop99,
 *   CC BY-SA 3.0: the east side's tall block, glass pilasters, louvres;
 * - "Chase Field-1.jpg", Visitor7, CC BY-SA 3.0: the south-east corner,
 *   brick podium, pale block and glass tower, the arch truss;
 * - "Chase Field (6377888151).jpg", Alan Stark, CC BY-SA 2.0: the west
 *   side at night, the floodlit wall under the arch truss;
 * - "Chase field satellite view.png", NASA, public domain: the plan, the
 *   roof open, the south arc.
 *
 * Left out: the field and stands (under the roof), the scoreboard, signage
 * and banners, the entry canopies (the APS Solar Pavilion is its own OSM
 * building), the sunken east service ramp, the garage (way/100227494).
 *
 * Doubts: the north wall and centre-field block have no close licensed
 * photo (drawn green steel and glass); the roof's panel seams and the
 * curve of each panel are simplified to one arc; facade band heights are
 * estimated from photos, not measured.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const roof = new Part(), green = new Part(), brick = new Part(), pale = new Part(), win = new Part(), steel = new Part()

const S = 7.6 // street above the field (published 25 ft)
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function face(p: Part, P: V3[], hint: V3) {
  let n: V3 = [0, 0, 0]
  for (let i = 1; i < P.length - 1; i++) {
    const c = cross(sub(P[i], P[0]), sub(P[i + 1], P[0]))
    n = [n[0] + c[0], n[1] + c[1], n[2] + c[2]]
  }
  const flip = dot(n, hint) < 0
  for (let i = 1; i < P.length - 1; i++) {
    const a = P[0], b = P[i], c = P[i + 1]
    if (Math.hypot(...cross(sub(b, a), sub(c, a))) < 1e-7) continue
    if (flip) p.tri(a, c, b)
    else p.tri(a, b, c)
  }
}
/** Vertical prism over a convex-or-CCW ring; sides in `side` (or per-edge). */
function prism(p: Part | ((i: number) => Part), q: XY[], z0: number, z1: number, top?: Part) {
  const n = q.length
  const cx = q.reduce((s, a) => s + a[0], 0) / n, cy = q.reduce((s, a) => s + a[1], 0) / n
  for (let i = 0; i < n; i++) {
    const a = q[i], b = q[(i + 1) % n]
    const part = typeof p === 'function' ? p(i) : p
    face(part, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0])
  }
  face(top ?? (typeof p === 'function' ? p(0) : p), q.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
}
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
/** A flat panel on an axis-aligned wall: `ax` 'x' = wall at x = c facing ±x; 'y' likewise. */
function panel(p: Part, ax: 'x' | 'y', c: number, out: number, s0: number, s1: number, z0: number, z1: number, d = 0.05) {
  const w = c + out * d
  const P: V3[] = ax === 'x'
    ? [[w, s0, z0], [w, s1, z0], [w, s1, z1], [w, s0, z1]]
    : [[s0, w, z0], [s1, w, z0], [s1, w, z1], [s0, w, z1]]
  face(p, P, ax === 'x' ? [out, 0, 0] : [0, out, 0])
}
/** A box proud of an axis-aligned wall by d (fins, bands, piers). */
function proud(p: Part, ax: 'x' | 'y', c: number, out: number, s0: number, s1: number, z0: number, z1: number, d: number) {
  const w0 = c, w1 = c + out * d
  const q: XY[] = ax === 'x' ? rect(Math.min(w0, w1), s0, Math.max(w0, w1), s1) : rect(s0, Math.min(w0, w1), s1, Math.max(w0, w1))
  prism(p, q, z0, z1)
}

// ---------------------------------------------------------------- the roof
const R = 216, YC = 6.5, CROWN = S + 67, T = 3
const YS = -78, YN = 90
const sag = (y: number) => R - Math.sqrt(R * R - (y - YC) * (y - YC))
const zTop = (y: number, dz: number) => CROWN - dz - sag(y)
const STRIPS: [number, number, number][] = [[-98, -79, 6], [-79, -55, 4], [-55, -25, 2], [-25, 35, 0], [35, 59, 2], [59, 83, 4], [83, 109, 6]]
const NY = 16
const ys = Array.from({ length: NY + 1 }, (_, k) => YS + ((YN - YS) * k) / NY)
const XW = STRIPS[0][0], XE = STRIPS[STRIPS.length - 1][1]
STRIPS.forEach(([x0, x1, dz], i) => {
  for (let k = 0; k < NY; k++) {
    const ya = ys[k], yb = ys[k + 1]
    const za = zTop(ya, dz), zb = zTop(yb, dz)
    face(roof, [[x0, ya, za], [x1, ya, za], [x1, yb, zb], [x0, yb, zb]], [0, 0, 1])
    // the strip's sides: the steps between panels; green fascia on the outer ends
    const outerW = i === 0, outerE = i === STRIPS.length - 1
    const dW = outerW ? 4.5 : T, dE = outerE ? 4.5 : T
    face(outerW ? green : roof, [[x0, ya, za - dW], [x0, yb, zb - dW], [x0, yb, zb], [x0, ya, za]], [-1, 0, 0])
    face(outerE ? green : roof, [[x1, ya, za - dE], [x1, yb, zb - dE], [x1, yb, zb], [x1, ya, za]], [1, 0, 0])
  }
  // the eaves: green fascia at the north and south ends
  for (const [y, s] of [[YS, -1], [YN, 1]] as [number, number][]) {
    const z = zTop(y, dz)
    face(green, [[x0, y, z - T], [x1, y, z - T], [x1, y, z], [x0, y, z]], [0, s, 0])
  }
})

// ------------------------------------------------- the arch trusses (east, west)
// Under each end strip's arched edge: a pale upper wall set back behind an
// open steel truss (two chords and diagonals), from the bowl's 20 m top.
for (const [x, s, dz] of [[XW, -1, 6], [XE, 1, 6]] as [number, number, number][]) {
  for (let k = 0; k < NY; k++) {
    const ya = ys[k], yb = ys[k + 1]
    const ua = zTop(ya, dz) - 4.5, ub = zTop(yb, dz) - 4.5
    face(pale, [[x, ya, S + 20], [x, yb, S + 20], [x, yb, ub], [x, ya, ua]], [s, 0, 0])
    // bottom chord, 8 m under the fascia
    const xo = x + s * 0.6
    face(steel, [[xo, ya, ua - 9.4], [xo, yb, ub - 9.4], [xo, yb, ub - 7.8], [xo, ya, ua - 7.8]], [s, 0, 0])
    // a diagonal per bay, alternating
    const [y0, y1, z0, z1] = k % 2 ? [ya, yb, ua - 8, ub] : [ya, yb, ua, ub - 8]
    const w = 1.1
    face(steel, [[xo, y0 - w, z0], [xo, y0 + w, z0], [xo, y1 + w, z1], [xo, y1 - w, z1]], [s, 0, 0])
  }
}

// ---------------------------------------------------------------- the bowl
// Outer walls of the bowl, x -108..118, y -77..91, to the street + 20 m:
// red brick to 9 m, sage-green steel above with grouped window panels.
const BX0 = -108, BX1 = 118, BY0 = -77, BY1 = 88.5
prism(brick, rect(BX0, BY0, BX1, BY1), 0, S + 9, roof)
prism(green, rect(BX0, BY0, BX1, BY1), S + 9, S + 20, roof)
function windowRow(ax: 'x' | 'y', c: number, out: number, s0: number, s1: number, z0: number, z1: number, bay = 12, pier = 2.5) {
  const n = Math.max(1, Math.round((s1 - s0) / bay))
  const w = (s1 - s0) / n
  for (let k = 0; k < n; k++) panel(win, ax, c, out, s0 + k * w + pier / 2, s0 + (k + 1) * w - pier / 2, z0, z1)
}
windowRow('x', BX1, 1, BY0 + 2, -32, S + 12, S + 17)
windowRow('x', BX1, 1, 48, BY1 - 2, S + 12, S + 17)
windowRow('x', BX0, -1, 57, BY1 - 2, S + 12, S + 17)
windowRow('y', BY0, -1, BX0 + 2, -54, S + 12, S + 17)
windowRow('y', BY0, -1, 64, BX1 - 2, S + 12, S + 17)

// The north facade (along Jefferson Street), full width up to the eave:
// pale panels (the banner field) between glass pilasters, a dark louvre
// band under the eave; the south wall over the stand, plain green.
STRIPS.forEach(([x0, x1, dz]) => {
  const top = zTop(YN, dz) - T
  face(pale, [[x0, BY1, S + 20], [x1, BY1, S + 20], [x1, BY1, S + 38], [x0, BY1, S + 38]], [0, 1, 0])
  face(steel, [[x0, BY1, S + 38], [x1, BY1, S + 38], [x1, BY1, top], [x0, BY1, top]], [0, 1, 0])
  // the roof's underside between the wall and the eave
  face(roof, [[x0, BY1, top], [x1, BY1, top], [x1, YN, top], [x0, YN, top]], [0, 0, -1])
  const ts = zTop(BY0, dz) - T
  face(green, [[x0, BY0, S + 20], [x1, BY0, S + 20], [x1, BY0, ts], [x0, BY0, ts]], [0, -1, 0])
})
for (let x = XW + 6; x < XE - 3; x += 17.5) proud(win, 'y', BY1, 1, x - 1.8, x + 1.8, S + 20, S + 38, 0.4)
windowRow('y', BY1, 1, -60, 78, S + 12, S + 17)
// glass towers at the north corners
for (const xc of [XW - 2, XE + 2]) {
  const q = rect(xc - 3.5, BY1 - 6, xc + 3.5, BY1 + 1)
  prism(win, q, S + 9, S + 46, green)
  prism(brick, q, 0, S + 9)
  panel(win, 'y', BY1 + 1, 1, xc - 2, xc + 2, S, S + 5)
  for (const z of [S + 20, S + 32]) proud(pale, 'y', BY1 + 1, 1, xc - 3.5, xc + 3.5, z, z + 0.8, 0.15)
}

// ---------------------------------------- the tall east and west blocks
// Middle of each long side, y -30..46, to street + 41: brick, green band,
// pale panels between glass pilasters, a dark louvre band; glass corner
// towers at both ends.
const TY0 = -30, TY1 = 46
for (const [xo, xi, s] of [[BX0, XW, -1], [BX1, XE, 1]] as [number, number, number][]) {
  const x0 = Math.min(xo, xi), x1 = Math.max(xo, xi)
  prism(pale, rect(x0, TY0, x1, TY1), S + 20, S + 38, roof)
  // red brick up to the 20 m line on the tall block's face
  proud(brick, 'x', xo, s, TY0, TY1, S + 9, S + 20, 0.3)
  prism(steel, rect(x0 - 0.3, TY0 - 0.3, x1 + 0.3, TY1 + 0.3), S + 38, S + 41.5, roof)
  // pilasters of glass every ~15 m on the outer face
  for (let y = TY0 + 7; y < TY1 - 3; y += 15.2) proud(win, 'x', xo, s, y - 1.6, y + 1.6, S + 20, S + 38, 0.4)
  // corner towers: glass shafts with green caps, a door at street level
  for (const yc of [TY0 - 2.5, TY1 + 2.5]) {
    const q = rect(xo - (s < 0 ? 1 : 6), yc - 3.5, xo + (s < 0 ? 6 : 1), yc + 3.5)
    prism(win, q, S + 9, S + 44, green)
    prism(brick, q, 0, S + 9)
    panel(win, 'x', xo + s * 1, s, yc - 2, yc + 2, S, S + 5)
    for (const z of [S + 20, S + 32]) proud(pale, 'x', xo + s * 1, s, yc - 3.5, yc + 3.5, z, z + 0.8, 0.15)
  }
}

// ------------------------------------------------ the south (home-plate) stand
// A brick podium to 20 m, the curved stand on it: green steel, a dark
// window band, a green fascia; its top falls from 44 at the bowl to 36.
prism(brick, rect(-52, -115, 62, BY0), 0, S + 20, roof)
{
  const cx = 5, R2 = 62.4, cy = -114 + R2
  const t0 = Math.acos((cy - BY0) / R2)
  const N = 12
  const zs = (y: number) => S + 44 - (8 * Math.min(1, Math.max(0, (BY0 - y) / 37)))
  const arc: XY[] = Array.from({ length: N + 1 }, (_, k) => {
    const t = -t0 + (2 * t0 * k) / N
    return [cx + R2 * Math.sin(t), cy - R2 * Math.cos(t)]
  })
  for (let k = 0; k < N; k++) {
    const a = arc[k], b = arc[k + 1]
    const za = zs(a[1]), zb = zs(b[1])
    const out: V3 = [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0]
    face(green, [[a[0], a[1], S + 20], [b[0], b[1], S + 20], [b[0], b[1], zb], [a[0], a[1], za]], out)
    // the window band, set just proud
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const nn: XY = [u[1], -u[0]]
    const P = (s: number, z: number): V3 => [a[0] + u[0] * s + nn[0] * 0.06 * Math.sign(dot([nn[0], nn[1], 0], out)), a[1] + u[1] * s + nn[1] * 0.06 * Math.sign(dot([nn[0], nn[1], 0], out)), z]
    const zt = Math.min(za, zb) - 3.5
    face(win, [P(1, S + 25), P(L - 1, S + 25), P(L - 1, zt), P(1, zt)], out)
  }
  // the top, a fan over the arc and the chord
  face(roof, arc.map(([x, y]) => [x, y, zs(y)] as V3), [0, 0, 1])
  // a dark truss band along the front edge, under the fascia
  for (let k = 0; k < N; k++) {
    const a = arc[k], b = arc[k + 1]
    const out: V3 = [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0]
    const g = (p: XY, z: number): V3 => [cx + (p[0] - cx) * 1.012, cy + (p[1] - cy) * 1.012, z]
    face(green, [g(a, zs(a[1]) - 2.8), g(b, zs(b[1]) - 2.8), g(b, zs(b[1]) + 0.3), g(a, zs(a[1]) + 0.3)], out)
  }
}

// ------------------------------------------------------- the low blocks
// North: the centre-field block (OSM's curved north edge), 10 m.
const NORTH: XY[] = [[76.7, BY1], [76.7, 90.5], [70.7, 97.2], [55.6, 106.7], [31.4, 117], [6.3, 119.6], [-17.8, 117.8], [-44.7, 108.8], [-61.3, 96.8], [-61, BY1]]
prism(green, NORTH, S + 4, S + 10, roof)
prism(brick, NORTH, 0, S + 4, roof)
// West: the band of offices along the west side, 18 m, and the low
// appendage at the south-west, 6 m. South-east: a 6 m service block.
prism(green, rect(-123, -53, BX0, 55), S + 9, S + 18, roof)
prism(brick, rect(-123, -53, BX0, 55), 0, S + 9, roof)
windowRow('x', -123, -1, -51, 53, S + 11, S + 16)
prism(brick, rect(-158, -78, -123, -52), 0, S + 6, roof)
prism(brick, rect(62, -93, 111, BY0), 0, S + 6, roof)

// ---------------------------------------------------------------- output
const out = [
  { part: roof, material: finish('chase-roof', 0xdfe1dd) },
  { part: green, material: finish('chase-green', 0xa3b39d) },
  { part: brick, material: finish('chase-brick', 0xa8634f) },
  // the pale upper walls behind the arch trusses are floodlit at night
  // ("Chase Field (6377888151).jpg", the west side at night)
  { part: pale, material: { ...PALETTE.stone, floodlight: (p: V3) => (Math.abs(p[0] - XW) < 1 || Math.abs(p[0] - XE) < 1 ? 0.8 : 0) } },
  { part: win, material: PALETTE.window },
  { part: steel, material: finish('chase-steel', 0x5d646b) },
]
const triangles = out.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of out) console.log(material.name.padEnd(12), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Chase Field', out, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the field below the way/24635438 centroid; bearing 0',
  bearing: 0, osm: 'way/24635438',
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const file = new URL('../models/phx-chase-field.glb', import.meta.url).pathname
await Bun.write(file, glb)
console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
