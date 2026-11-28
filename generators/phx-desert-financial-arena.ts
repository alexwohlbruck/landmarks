/**
 * Desert Financial Arena (1974 as the ASU Activity Center; later Wells Fargo
 * Arena), Arizona State University, Tempe AZ. Procedural, CC0-1.0, no
 * textures.
 *   bun generators/phx-desert-financial-arena.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0 (the oval's axes run
 * east-west and north-south in OSM). Anchor -111.9310097, 33.4245085, the
 * centroid of OSM way/28753079, which is the only building the model covers
 * (replaces). The solar canopies east of it (building=roof) stand apart.
 *
 * Identity (photos below):
 *  1. A squat oval drum, its plan a rounded oval (superellipse, exponent
 *     2.25, fitted to the OSM outline: semi-axes 56.2 x 46.8 m).
 *  2. The folded concrete roof edge: a deep band of angled tan concrete
 *     plates, pleated, on corbelled steps, carried by sixteen big diagonal
 *     buttresses that lean out from the brick wall.               (tent, wf)
 *  3. A dark grey standing-seam metal mansard rising steeply behind the
 *     concrete edge to a low pale roof.                           (tent, wf)
 *  4. Red-brown brick walls, set back under the edge, and a lower concrete
 *     canopy ring on columns round the ground floor.              (tent, wf)
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020), 1 m grid,
 * read in this frame with tools/lidar_frame.py; ground_min 355.43 m. The
 * plaza round the arena is lidar 4.6; the lowest map ground under the
 * footprint is about 0.8 m below it, so model z = lidar - 3.8 and the plaza
 * is z 0.8. Measured: lower canopy ring top 8.7 lidar (z 4.9), its outer edge
 * reaching about 5 m outside the OSM outline (x +-61, y +-51) in the lidar,
 * but the photos show the canopy itself only about 2 m out (the rest is
 * planters and ramps round the base), so it is drawn 2 m out; the concrete edge's top
 * 18.5 (z 14.7) on the OSM line; the mansard's top ring 22.1-22.3 (z 18.3)
 * about 4 m in; the roof rising to 24.6 at the centre (z 20.8).
 * Estimated (from the tent photo, scaled to the lidar): the lower canopy band
 * depth (1.5 m), the concrete plates' height (4.7 m) and corbel steps, the
 * buttress profile, the brick wall set-backs (1.5 m ground floor, 4 m above),
 * the number of plates (96) and buttresses (16, wf shows about seven to a
 * side), the entrance positions at the four ends (wf shows the glazed west
 * entrance; the others are assumed).
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 *   tent  "Tent City at Wells Fargo Arena.jpg", Visitor7, CC BY-SA 3.0,
 *         https://commons.wikimedia.org/wiki/File:Tent_City_at_Wells_Fargo_Arena.jpg
 *         (the south-east side close up: brick, buttresses, plates, mansard)
 *   wf    "Wellsfargo.jpg", YF12s (en.wikipedia), CC BY 2.5,
 *         https://commons.wikimedia.org/wiki/File:Wellsfargo.jpg
 *         (the whole west side from the parking lot)
 *   int   "Desert Financial Arena - February 4, 2025.jpg", Dc55555, CC0,
 *         https://commons.wikimedia.org/wiki/File:Desert_Financial_Arena_-_February_4,_2025.jpg
 *         (interior; confirms the oval bowl only)
 *   USGS NAIP orthophoto: the plan, the pale roof with solar panel rows.
 * No look-only sources. No commercial imagery.
 * Doubts: the north and east sides have no close photo (drawn like the
 * others); the roof's solar panel rows and its "ASU" lettering are left
 * out (the roof is drawn one pale grey).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save } from './atl-flatiron-building'
import { quad, triangulate } from './dc-nationals-park'

const brick = new Part(), concrete = new Part(), metal = new Part(), roofP = new Part(), win = new Part(), door = new Part()

const A = 56.2, B = 46.8, EXP = 2.25
const PL = 0.8 // the plaza
const CANOPY = 4.9, EDGE0 = 10.0, EDGE1 = 14.7, MANS = 18.3, TOP = 20.8
const N = 192 // ring points: 96 plates, each folded once

// The outline and its outward normal at parameter t (radians, from +x).
const sp = (t: number): [number, number] => {
  const c = Math.cos(t), s = Math.sin(t)
  return [A * Math.sign(c) * Math.abs(c) ** (2 / EXP), B * Math.sign(s) * Math.abs(s) ** (2 / EXP)]
}
// parameters spaced evenly by arc length, so the plates come out even
const TS: number[] = (() => {
  const M = 4000, pts = Array.from({ length: M + 1 }, (_, i) => sp((i / M) * 2 * Math.PI))
  const acc = [0]
  for (let i = 1; i <= M; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const L = acc[M], out: number[] = []
  let j = 0
  for (let k = 0; k < N; k++) {
    const target = (k / N) * L
    while (acc[j + 1] < target) j++
    out.push(((j + (target - acc[j]) / (acc[j + 1] - acc[j])) / M) * 2 * Math.PI)
  }
  return out
})()
const normal = (t: number): [number, number] => {
  const a = sp(t - 1e-4), b = sp(t + 1e-4), ex = b[0] - a[0], ey = b[1] - a[1], l = Math.hypot(ex, ey)
  return [ey / l, -ex / l]
}
const at = (k: number, d: number, z: number): V3 => {
  const t = TS[((k % N) + N) % N], p = sp(t), n = normal(t)
  return [p[0] + n[0] * d, p[1] + n[1] * d, z]
}
const out = (k: number): V3 => { const n = normal(TS[((k % N) + N) % N]); return [n[0], n[1], 0] }

// A vertical wall round the ring at offset d; smooth normals.
function drum(p: Part, d: number, z0: number, z1: number) {
  for (let k = 0; k < N; k += 4) quad(p, [at(k, d, z0), at(k + 4, d, z0), at(k + 4, d, z1), at(k, d, z1)], out(k + 2), [out(k), out(k + 4), out(k + 4), out(k)])
}
// A horizontal ring between offsets d0 < d1 at height z, facing up or down.
function ledge(p: Part, d0: number, d1: number, z: number, up: boolean) {
  for (let k = 0; k < N; k += 4) quad(p, [at(k, d0, z), at(k + 4, d0, z), at(k + 4, d1, z), at(k, d1, z)], [0, 0, up ? 1 : -1])
}

// ── Ground floor and the lower canopy ring on columns ──
drum(brick, -1.5, 0, CANOPY - 1.5)
drum(concrete, 2, CANOPY - 1.5, CANOPY)
ledge(concrete, -1.5, 2, CANOPY - 1.5, false)
ledge(concrete, -4, 2, CANOPY, true)
for (let k = 0; k < N; k += 6) {
  const c = at(k, 1.2, 0), n = out(k), tg: V3 = [-n[1], n[0], 0], w = 0.45
  const P = (u: number, v: number, z: number): V3 => [c[0] + n[0] * u + tg[0] * v, c[1] + n[1] * u + tg[1] * v, z]
  const z1 = CANOPY - 1.5
  quad(concrete, [P(w, -w, 0), P(w, w, 0), P(w, w, z1), P(w, -w, z1)], n)
  quad(concrete, [P(-w, w, 0), P(-w, -w, 0), P(-w, -w, z1), P(-w, w, z1)], [-n[0], -n[1], 0])
  quad(concrete, [P(-w, -w, 0), P(w, -w, 0), P(w, -w, z1), P(-w, -w, z1)], [-tg[0], -tg[1], 0])
  quad(concrete, [P(w, w, 0), P(-w, w, 0), P(-w, w, z1), P(w, w, z1)], tg)
}

// ── The brick drum, the corbelled steps, the folded concrete edge ──
drum(brick, -4, CANOPY, EDGE0 - 1.6)
const steps: [number, number, number][] = [[-4, -2.7, EDGE0 - 1.6], [-2.7, -1.4, EDGE0 - 0.8], [-1.4, -0.3, EDGE0]]
for (const [d0, d1, z] of steps) {
  ledge(concrete, d0, d1, z, false)
  drum(concrete, d1, z, z + 0.8 > EDGE0 ? EDGE0 : z + 0.8)
}
// the plates: each plate's middle crease stands out, its edges in, and each
// leans out toward its top
const fold = (k: number, z: number) => at(k, (k % 2 ? 1.0 : 0) + (z === EDGE0 ? -0.3 : 0), z)
for (let k = 0; k < N; k++) {
  const a0 = fold(k, EDGE0), b0 = fold(k + 1, EDGE0), a1 = fold(k, EDGE1), b1 = fold(k + 1, EDGE1)
  quad(concrete, [a0, b0, b1, a1], out(k))
  // the soffit from the last corbel to the plates' foot
  if (k % 2 === 0) quad(concrete, [at(k, -1.4, EDGE0), at(k + 2, -1.4, EDGE0), fold(k + 2, EDGE0), a0], [0, 0, -1])
  if (k % 2 === 0) concrete.tri(a0, fold(k + 2, EDGE0), b0)
}
// the metal mansard from the folded edge up and in
for (let k = 0; k < N; k++) {
  const a = fold(k, EDGE1), b = fold(k + 1, EDGE1)
  quad(metal, [a, b, at(k + 1, -4, MANS), at(k, -4, MANS)], [out(k)[0], out(k)[1], 1])
}
// the low pale roof inside
const RINGS: [number, number][] = [[-4, MANS], [-12, 19.6], [-26, 20.5]]
for (let r = 0; r < RINGS.length - 1; r++) {
  const [d0, z0] = RINGS[r], [d1, z1] = RINGS[r + 1]
  for (let k = 0; k < N; k += 4) quad(roofP, [at(k, d0, z0), at(k + 4, d0, z0), at(k + 4, d1, z1), at(k, d1, z1)], [0, 0, 1])
}
const [dl, zl] = RINGS[RINGS.length - 1]
for (let k = 0; k < N; k += 4) roofP.tri(at(k, dl, zl), at(k + 4, dl, zl), [0, 0, TOP])

// ── Sixteen buttresses leaning out from the wall to the edge ──
const BUT: [number, number][] = [[-4, CANOPY], [-3, CANOPY], [-3, 6.6], [1.3, 11.2], [1.3, EDGE1 + 0.35], [-2, EDGE1 + 0.35], [-4, EDGE1 + 0.35]]
for (let i = 0; i < 16; i++) {
  const k = i * 12, t = TS[k], p = sp(t), n = normal(t), tg: [number, number] = [-n[1], n[0]], w = 0.9
  const P = ([d, z]: [number, number], s: number): V3 => [p[0] + n[0] * d + tg[0] * s, p[1] + n[1] * d + tg[1] * s, z]
  for (let j = 0; j < BUT.length - 1; j++) {
    const a = BUT[j], b = BUT[j + 1]
    // outward normal of the profile edge a→b (profile runs outward then back over the top)
    const dd = b[0] - a[0], dz = b[1] - a[1]
    const h: V3 = [n[0] * dz - 0, n[1] * dz, -dd]
    quad(concrete, [P(a, -w), P(b, -w), P(b, w), P(a, w)], h)
  }
  const poly = BUT
  for (const s of [-w, w]) {
    const side: V3 = [tg[0] * s, tg[1] * s, 0]
    for (const [a, b, c] of triangulate(poly)) quad(concrete, [P(poly[a], s), P(poly[b], s), P(poly[c], s), P(poly[c], s)], side)
  }
}

// ── Windows and entrances ──
// glazed entrances under the canopy at the four ends (wf: the west one)
for (const c of [0, N / 4, N / 2, (3 * N) / 4]) {
  for (let k = c - 8; k < c + 8; k += 4) quad(door, [at(k, -1.44, PL), at(k + 4, -1.44, PL), at(k + 4, -1.44, CANOPY - 1.7), at(k, -1.44, CANOPY - 1.7)], out(k))
}
// tall slot windows in the brick beside each buttress (tent)
for (let i = 0; i < 16; i++) {
  for (const o of [-3, 3]) {
    const k = i * 12 + o
    quad(win, [at(k, -3.94, CANOPY + 0.8), at(k + 1, -3.94, CANOPY + 0.8), at(k + 1, -3.94, EDGE0 - 2.2), at(k, -3.94, EDGE0 - 2.2)], out(k))
  }
}

if (import.meta.main) {
  await save('phx-desert-financial-arena', 'Desert Financial Arena', [
    { part: concrete, material: finish('dfa-concrete', 0xdccbb3) },
    { part: brick, material: finish('dfa-brick', 0xb87a66) },
    { part: metal, material: finish('dfa-metal', 0x737a82) },
    { part: roofP, material: finish('dfa-roof', 0xc9c7c0) },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
  ], { height: TOP, anchor: [33.4245085, -111.9310097], bearing: 0 }, 5000)
}
