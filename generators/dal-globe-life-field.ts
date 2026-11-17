/**
 * Globe Life Field (Texas Rangers, 2020, HKS), Arlington, Texas —
 * procedural, CC0-1.0.
 * bun generators/dal-globe-life-field.ts
 *
 * What makes it Globe Life Field: the huge pale roof, a low hipped mass of
 * translucent ETFE cushions over everything, its steep ends and gentler
 * long sides rising to a nearly flat top crossed by the clear ETFE "racing
 * stripe"; the two rail trusses the roof rides on, running out past its
 * west end; under the roof's eave a band of dark glass; and at street level
 * the tall red-brick piers of the north concourse with the big brick arch
 * at its east corner, under a dark steel trellis, and the pale limestone
 * blocks of the east entrance.
 *
 * Frame: bearing 0, built north-up (x east, y north). The anchor is the
 * area centroid of OSM way/704674261 (the building, height 84),
 * -97.084199 32.747465; its long walls run 7-14° off north (the plan is a
 * skewed box) and the rail trusses' strips run due east-west.
 *
 * Ground: y = 0 is the field. Published: "the playing surface is anywhere
 * from 50' to 75' below street level", because the ground round it slopes
 * (Joe Mock, baseballparks.com, "Globe Life Field", 2018); Walter P Moore
 * (structural engineer) gives 70 ft and a site falling 40 ft. Catalog
 * `elevation` is -15.2 (50 ft, the low west side): the map takes y = 15.2
 * as the model's ground and lays the street-level walls on the street,
 * which rises to 21 m above the field on the east. The map's terrain has
 * the dig (a flat floor 15 m below the west street, 20 m below the east),
 * inside the published range. Nothing that faces up is drawn below the
 * street; the walls run down to y = 0, out of sight. `bun tools/terrain.ts
 * check models/dal-globe-life-field.glb --lng -97.084199 --lat 32.747465
 * --bearing 0 --elevation -15.2` prints ok.
 *
 * Heights: the building is newer than the only lidar here
 * (TX_Pecos_Dallas_B3_2018, flown during the dig), so none are measured.
 * - published: the roof's top 278 ft (84.7 m) above the field (Texas
 *   Rangers, "Globe Life Field facts & figures"; OSM height 84); the rail
 *   trusses 675 ft long, 650 ft apart, the roof sliding west on them
 *   (baseballparks.com); the ETFE stripe 650 by 180 ft and 18 brick-and-
 *   limestone arches 100 ft tall round the concourse (walterpmoore.com);
 * - from the NAIP orthophoto (2022, public domain): the roof's plan, its
 *   eave from x = -62 to 114 and y = ±102, the stripe ±27 m about the axis
 *   running over the top and down the east end, the steep east and west
 *   ends (about 40 m in plan) against the long north and south slopes
 *   (about 75 m);
 * - photo-scaled (Barera, the drone view and the 2025 view, against the
 *   published 84.7 m top): the eave 47 m above the field, the glass band
 *   under it 33-44 m, the north piers and trellis 44-46 m, the east
 *   limestone block to 33 m, the rail trusses 41-48 m.
 *
 * Photos (Wikimedia Commons), compared against the renders:
 * - "Arlington June 2020 5 (Globe Life Field).jpg", Michael Barera,
 *   CC BY-SA 4.0: the north-east corner, the roof's east end, the piers;
 * - "Globelifefield june2020.jpg", Drone To Fly, CC BY 3.0: the north-east
 *   corner from above the street, the corner arch, the trellis, the roof's
 *   ribbed end;
 * - "Globe Life Field exterior 2025.jpg", BullDawg2021, CC BY 4.0: the
 *   north-east corner and the long north slope of the roof;
 * - "Globe Life Field Exterior 2024.jpg", Brycenrichter, CC0: the north
 *   entrance at night, the lit trellis;
 * - "Richard Greene Linear Park June 2020 12 and 13 (Globe Life Park in
 *   Arlington).jpg", Michael Barera, CC BY-SA 4.0: the roof from the north-
 *   west, its west end and the rail truss running on past it;
 * - "20210523 globe life field interior.jpg", Ivansevil, CC BY-SA 4.0, and
 *   "GlobeLifeField2021.jpg", slgckgc, CC BY 2.0: the roof's trusses
 *   inside;
 * - Plan: USGS NAIP orthophoto (public domain).
 *
 * Left out: the T logos and lettering on the roof (signage), the ETFE
 * cushions' ribs, the field and stands (under the roof), the plazas.
 *
 * Doubts: the south and west sides have no licensed close photo; they are
 * drawn as the limestone-and-glass of the east. The heights are photo-
 * scaled, not measured. What stands between the west wall and the rail
 * trusses' ends (where the roof parks when open) is drawn as nothing.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const roof = new Part(), etfe = new Part(), brick = new Part(), stone = new Part(), win = new Part(), steel = new Part()

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
function prism(p: Part, q: XY[], z0: number, z1: number, bottom = false) {
  const n = q.length
  const cx = q.reduce((s, a) => s + a[0], 0) / n, cy = q.reduce((s, a) => s + a[1], 0) / n
  for (let i = 0; i < n; i++) {
    const a = q[i], b = q[(i + 1) % n]
    face(p, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0])
  }
  face(p, q.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) face(p, q.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
/** A band proud of a wall, from s0 to s1 along it, z0 to z1, `d` proud. */
function band(p: Part, a: XY, u: XY, n: XY, s0: number, s1: number, z0: number, z1: number, d: number, under = false) {
  const P = (s: number, o: number): XY => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o]
  const A = P(s0, 0), B = P(s1, 0), C = P(s1, d), D = P(s0, d)
  face(p, [[D[0], D[1], z0], [C[0], C[1], z0], [C[0], C[1], z1], [D[0], D[1], z1]], [n[0], n[1], 0])
  face(p, [[D[0], D[1], z1], [C[0], C[1], z1], [B[0], B[1], z1], [A[0], A[1], z1]], [0, 0, 1])
  face(p, [[A[0], A[1], z0], [D[0], D[1], z0], [D[0], D[1], z1], [A[0], A[1], z1]], [-u[0], -u[1], 0])
  face(p, [[C[0], C[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [C[0], C[1], z1]], [u[0], u[1], 0])
  if (under) face(p, [[D[0], D[1], z0], [A[0], A[1], z0], [B[0], B[1], z0], [C[0], C[1], z0]], [0, 0, -1])
}
function arch(p: Part, c: XY, u: XY, n: XY, w: number, z0: number, zs: number, off: number, seg = 10) {
  const at = (s: number, z: number): V3 => [c[0] + u[0] * s + n[0] * off, c[1] + u[1] * s + n[1] * off, z]
  const h: V3 = [n[0], n[1], 0]
  face(p, [at(-w / 2, z0), at(w / 2, z0), at(w / 2, zs), at(-w / 2, zs)], h)
  for (let k = 0; k < seg; k++) {
    const a0 = (Math.PI * k) / seg, a1 = (Math.PI * (k + 1)) / seg
    face(p, [at(0, zs), at((w / 2) * Math.cos(a0), zs + (w / 2) * Math.sin(a0)), at((w / 2) * Math.cos(a1), zs + (w / 2) * Math.sin(a1))], h)
  }
}
const edge = (a: XY, b: XY) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  return { L, u, n: [u[1], -u[0]] as XY } // n outward for a CCW ring
}

// ---------------------------------------------------------------- the body
// OSM way/704674261 without the rail trusses' strips, simplified, CCW from
// the south-west corner: south, the skewed east wall, north, the skewed west.
const BODY: XY[] = [[-97, -110], [127, -110], [146, -54], [116, 104], [-121, 104]]
const TOPW = 44 // the walls' top
const GLASS0 = 33 // the glass band's foot on the plain sides
for (let i = 0; i < BODY.length; i++) {
  const a = BODY[i], b = BODY[(i + 1) % BODY.length]
  const { L, u, n } = edge(a, b)
  const nn: V3 = [n[0], n[1], 0]
  const north = i === 3
  if (north) {
    // the north concourse: dark glass behind tall brick piers on limestone
    // feet, the big arch at the east corner, a dark cornice and trellis
    face(win, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], TOPW], [a[0], a[1], TOPW]], nn)
    const arch0 = 3, archW = 21
    band(brick, a, u, n, arch0, arch0 + archW, 0, TOPW - 1, 1.6)
    band(stone, a, u, n, arch0 - 0.2, arch0 + archW + 0.2, 0, 21, 1.8)
    arch(win, [a[0] + u[0] * (arch0 + archW / 2), a[1] + u[1] * (arch0 + archW / 2)], u, n, 11, 21, 34, 1.66)
    const P0 = arch0 + archW + 13, step = 14.5
    for (let s = P0; s < L - 8; s += step) {
      band(brick, a, u, n, s - 2.5, s + 2.5, 0, TOPW - 1, 1.6)
      band(stone, a, u, n, s - 2.7, s + 2.7, 0, 21.5, 1.8)
    }
    band(steel, a, u, n, -0.5, L + 0.5, TOPW - 1.2, TOPW + 0.6, 1.8)
    // the trellis: a dark steel canopy over the concourse, lit warm at night
    band(steel, a, u, n, 0, L, TOPW + 0.6, TOPW + 1.6, 6, true)
  } else {
    // limestone below, dark glass above, a dark cornice
    face(stone, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], GLASS0], [a[0], a[1], GLASS0]], nn)
    face(win, [[a[0], a[1], GLASS0], [b[0], b[1], GLASS0], [b[0], b[1], TOPW], [a[0], a[1], TOPW]], nn)
    band(steel, a, u, n, -0.3, L + 0.3, TOPW - 0.9, TOPW + 0.6, 0.6)
    // pale mullion lines across the glass, every 12 m
    for (let s = 12; s < L - 4; s += 12) band(stone, a, u, n, s - 0.35, s + 0.35, GLASS0, TOPW - 0.9, 0.2)
    band(stone, a, u, n, 0, L, GLASS0 - 0.4, GLASS0 + 0.6, 0.3)
  }
}
face(roof, BODY.map(([x, y]) => [x, y, TOPW] as V3), [0, 0, 1])

// The east entrance (on the skewed east wall): a flat canopy on four brick
// columns before the glass, at the east street (21 m).
{
  const a = BODY[2], b = BODY[3]
  const { u, n } = edge(a, b)
  const s0 = 70, w = 40
  for (const k of [0, 1, 2, 3]) {
    const s = s0 + (w * k) / 3 - w / 2
    const c: XY = [a[0] + u[0] * s + n[0] * 7, a[1] + u[1] * s + n[1] * 7]
    prism(brick, [[c[0] - 1.4, c[1] - 1.4], [c[0] + 1.4, c[1] - 1.4], [c[0] + 1.4, c[1] + 1.4], [c[0] - 1.4, c[1] + 1.4]], 0, 31)
  }
  const P = (s: number, o: number): XY => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o]
  prism(steel, [P(s0 - w / 2 - 3, 0), P(s0 + w / 2 + 3, 0), P(s0 + w / 2 + 3, 9.5), P(s0 - w / 2 - 3, 9.5)], 30, 31.5, true)
}

// ---------------------------------------------------------------- the roof
const X0 = -62, X1 = 114, Y0 = -102, Y1 = 102 // the eave (NAIP)
const PX0 = -20, PX1 = 72, PY = 27 // the plateau (NAIP)
const ZE = 47, ZP = 82.5, ZR = 84.7 // eave, plateau's edge, ridge (published top)
const SY = PY // the stripe's half-width
// the fascia: a pale band round the eave, over the glass
{
  const q: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
  for (let i = 0; i < 4; i++) {
    const a = q[i], b = q[(i + 1) % 4]
    const { u, n } = edge(a, b)
    band(roof, a, u, n, -0.8, Math.hypot(b[0] - a[0], b[1] - a[1]) + 0.8, TOPW - 0.5, ZE, 0.8, true)
  }
}
const E = (x: number, y: number): V3 => [x, y, ZE]
const T = (x: number, y: number): V3 => [x, y, ZP]
// north and south slopes (trapezoids from the eave to the plateau)
face(roof, [E(X0 - 0.8, Y1 + 0.8), E(X1 + 0.8, Y1 + 0.8), T(PX1, PY), T(PX0, PY)], [0, 0.45, 1])
face(roof, [E(X1 + 0.8, Y0 - 0.8), E(X0 - 0.8, Y0 - 0.8), T(PX0, -PY), T(PX1, -PY)], [0, -0.45, 1])
// the east and west ends: three pieces each, the stripe down the middle of the east one
for (const [ex, px, sx] of [[X1 + 0.8, PX1, 1], [X0 - 0.8, PX0, -1]] as [number, number, number][]) {
  // where the stripe's edges cross the hip from eave to plateau: the end face
  // is a trapezoid from (ex, ±Y) to (px, ±PY); split it at y = ±SY on both
  const ye = (Y1 + 0.8) * (SY / PY) // keep the stripe's edges parallel to the axis
  const yEdge = Math.min(ye, SY)
  const side = (s: number) => {
    face(roof, [E(ex, s * (Y1 + 0.8)), E(ex, s * yEdge), T(px, s * SY), T(px, s * PY)], [sx, 0, 1])
  }
  side(1)
  side(-1)
  const mid = sx > 0 ? etfe : roof
  face(mid, [E(ex, -yEdge), E(ex, yEdge), T(px, SY), T(px, -SY)], [sx, 0, 1])
}
// the plateau: the stripe, two gentle slopes to a ridge along the axis
face(etfe, [T(PX0, -PY), T(PX1, -PY), [PX1, 0, ZR], [PX0, 0, ZR]], [0, -0.1, 1])
face(etfe, [[PX0, 0, ZR], [PX1, 0, ZR], T(PX1, PY), T(PX0, PY)], [0, 0.1, 1])
face(etfe, [T(PX1, -PY), T(PX1, PY), [PX1, 0, ZR]], [1, 0, 0])
face(etfe, [T(PX0, PY), T(PX0, -PY), [PX0, 0, ZR]], [-1, 0, 0])

// ---------------------------------------------------------------- the rail trusses
// Box trusses along the north and south edges, the roof riding on them,
// running out past the roof's west end on columns (OSM's strips: the north
// one to x = -222, the south one to -174).
const RZ0 = 41, RZ1 = 48
for (const [y, xw] of [[100, -222], [-97, -174]] as [number, number][]) {
  const q: XY[] = [[xw, y - 2.5], [X0 + 2, y - 2.5], [X0 + 2, y + 2.5], [xw, y + 2.5]]
  prism(steel, q, RZ0, RZ1, true)
  // a lighter web: open panels shown as pale diagonals on both faces
  const nP = Math.round((X0 - xw) / 14)
  for (let k = 0; k < nP; k++) {
    const xa = xw + ((X0 - xw) * k) / nP, xb = xw + ((X0 - xw) * (k + 1)) / nP
    for (const s of [-1, 1]) {
      const yy = y + s * 2.56
      const [za, zb] = k % 2 ? [RZ0 + 1, RZ1 - 1] : [RZ1 - 1, RZ0 + 1]
      face(stone, [[xa, yy, za - 0.6], [xb, yy, zb - 0.6], [xb, yy, zb + 0.6], [xa, yy, za + 0.6]], [0, s, 0])
    }
  }
  // columns down to the ground, under the part past the body
  for (let x = xw + 2; x < BODY[4][0] - 5; x += 34) prism(steel, [[x - 1.5, y - 2], [x + 1.5, y - 2], [x + 1.5, y + 2], [x - 1.5, y + 2]], 0, RZ0)
}

// ---------------------------------------------------------------- materials and output
// From the daylight photos: the roof a pale cool white, its clear ETFE
// stripe brighter; the brick a dark red-brown pulled light; limestone;
// dark glass (lit at night); the trellis, cornices and trusses dark steel,
// the trellis lit warm from below at night.
const out = [
  { part: roof, material: finish('glf-roof', 0xdfe4e7) },
  { part: etfe, material: finish('glf-etfe', 0xf3f6f6) },
  { part: brick, material: finish('glf-brick', 0xa9604c) },
  { part: stone, material: PALETTE.stone },
  { part: win, material: PALETTE.window },
  {
    part: steel,
    material: { ...finish('glf-steel', 0x5b6169), floodlight: (p: V3, n: V3) => (p[1] > 100 && p[2] > TOPW && n[2] < 0.5 ? 0.8 : 0) },
  },
]
const triangles = out.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of out) console.log(material.name.padEnd(12), part.triangles)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Globe Life Field', out, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the field below the way/704674261 centroid; bearing 0',
  bearing: 0, elevation: -15.2, osm: 'way/704674261',
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const file = new URL('../models/dal-globe-life-field.glb', import.meta.url).pathname
await Bun.write(file, glb)
console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
