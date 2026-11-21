/**
 * Bright Angel Lodge, Grand Canyon Village (South Rim): procedural, CC0-1.0.
 * bun generators/grand-canyon-bright-angel-lodge.ts
 *
 * Mary Colter's 1935 lodge for the Fred Harvey Company: a low, rambling
 * rustic building of rubble stone and red-brown logs, set back from the rim
 * between Lookout Studio and the Thunderbird Lodge. What makes it read:
 * - the entrance hall facing the village road: a stone gable under a broad
 *   brown shingle roof carried forward over a deep porch on red log posts;
 * - the red-brown vertical-log palisade wall east of the entrance;
 * - long, low wings, stone on the rim side, red-brown on the road side,
 *   under brown shingle gables and flat roofs, with a big stone chimney on
 *   the rim side (the History Room's "geologic fireplace").
 *
 * This file also exports the small geometry kit shared by the other
 * grand-canyon-* generators of this builder (Lookout Studio, Kolb Studio,
 * Power House): build it, and merge it, first. Its own build runs only under
 * `import.meta.main`.
 *
 * Frame: x east, y north, z up, metres, turned to bearing 29.5 (the
 * lodge's walls run at 29.5 and 119.5 degrees), so +y faces the rim (NNE)
 * and -y the road. The anchor (-112.140678, 36.056878) is the area-weighted
 * centroid of the two OSM outlines it replaces, way/164580573 (west part,
 * tagged tourism=hotel, wikidata Q4967380) and way/164580572 (east part),
 * which together are one continuous building in the NAIP aerial.
 *
 * Not included: Buckey O'Neill Cabin (way/204085786, Q4983043), 3.5 m west
 * of the lodge and its own listed building, and the guest cabins further
 * west (ways 204085788, 204085797, 204085807, ...). They are separate OSM
 * buildings the map keeps drawing; the model stops at the lodge's walls.
 *
 * Sources:
 * - OSM way/164580572, way/164580573 (footprint), ODbL.
 * - USGS 3DEP lidar, AZ_GrandCanyonNP_1_2019 (flown 2019), 1 m grid: roof
 *   heights. Ground under the footprint runs from 2093.4 m (south-west) to
 *   about 2096.6 m (north-east); y = 0 is the lowest, 2093.4 m.
 * - USGS NAIP aerial: roof plan and colours (brown shingle gables, pale flat
 *   roofs over the middle and east).
 * - Photos (all EVIDENCE):
 *   - "Bright Angel Lodge NPS1.jpg", National Park Service, public domain,
 *     https://commons.wikimedia.org/wiki/File:Bright_Angel_Lodge_NPS1.jpg
 *     (entrance, square on from the road);
 *   - "Bright Angel Lodge Grand Canyon Village 09 2017 5333.jpg" and "5334",
 *     Mariordo (Mario Roberto Durán Ortiz), CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Bright_Angel_Lodge_Grand_Canyon_Village_09_2017_5333.jpg
 *     (entrance and the log palisade to its east);
 *   - "Grand Canyon National Park Bright Angel Lodge 1007 (7412152968).jpg",
 *     Grand Canyon NPS, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Grand_Canyon_National_Park_Bright_Angel_Lodge_1007_(7412152968).jpg;
 *   - "00836 Grand Canyon Historic Bright Angel Lodge Exterior 1935
 *     (5897848998).jpg", Grand Canyon NPS, CC BY 2.0 (rim side: low stone
 *     walls, low roofs, chimneys).
 *
 * Numbers (above y = 0):
 * - entrance ridge 10.7 m (lidar 56.0 over ground_min 45.3); porch eave
 *   4.5 m and the 1 m porch deck: estimated from NPS1 (steps, posts);
 * - ground: lidar rises from y = 0 at the south-west corner to 1 m along
  the road front and 2.3-3.3 m along the rim side of the east half; window
  sills follow the local ground, not y = 0;
- middle flat roofs 5.4-5.8 m (lidar 49.9-51.4); west wing ridge 5.6 m
 *   (lidar 48-50); east block 6.6 m (lidar 51-53); rim-side stone wing ridge
 *   8.3 m (lidar 52-53.8); east end hip 7.3 m (lidar 52.6);
 * - plan: OSM, except that the entrance gable's stone hall is drawn 1.3 m
 *   inside the OSM protrusion (porch posts on its south edge). Lidar puts
 *   the entrance ridge about 5 m west of the OSM protrusion's middle; OSM
 *   was kept, as it matches the NAIP roof.
 * - the rim-side chimney's place and height (10 m): estimated, from the
 *   1935 photo; no current photo of the rim side was found.
 *
 * Doubts: the rim (north) side and the east end have no current licensed
 * photo; their walls (stone on the rim, red-brown elsewhere) follow the
 * 1935 photo and the cabins' colours. The pale flat roofs of the middle and
 * east blocks are later kitchen and service roofs seen in NAIP.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

// ---------------------------------------------------------------------------
// Shared kit.

export type XY = [number, number]
export type Z = (p: XY) => number
export const flat = (z: number): Z => () => z

const norm = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A convex planar polygon, fan-triangulated and wound to face `want`. */
export function face(p: Part, pts: V3[], want: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const n = crs(sub3(b, a), sub3(c, a))
    if (Math.hypot(...n) < 1e-9) continue
    if (dot(n, want) >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}

/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
export function earcut(pts: XY[]): [number, number, number][] {
  const idx = pts.map((_, i) => i), out: [number, number, number][] = []
  const cz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (q: XY, a: XY, b: XY, c: XY) => cz(a, b, q) > 0 && cz(b, c, q) > 0 && cz(c, a, q) > 0
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      if (cz(pts[i0], pts[i1], pts[i2]) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(pts[j], pts[i0], pts[i1], pts[i2]))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** Move every edge of a counter-clockwise ring inward by d (mitred). */
export function inset(pts: XY[], d: number): XY[] {
  const n = pts.length
  return pts.map((q, i) => {
    const a = pts[(i + n - 1) % n], b = pts[(i + 1) % n]
    const e0 = norm([q[0] - a[0], q[1] - a[1], 0]), e1 = norm([b[0] - q[0], b[1] - q[1], 0])
    const n0: XY = [-e0[1], e0[0]], n1: XY = [-e1[1], e1[0]]
    const m = norm([n0[0] + n1[0], n0[1] + n1[1], 0]), k = d / Math.max(0.5, m[0] * n0[0] + m[1] * n0[1])
    return [q[0] + m[0] * k, q[1] + m[1] * k]
  })
}

/** Axis-aligned rectangle, counter-clockwise. */
export const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** An oriented frame: centre, angle of the long axis (radians from +x, counter-clockwise). */
export type Frame = { c: XY; a: number }
export const at = (f: Frame, u: number, v: number): XY =>
  [f.c[0] + Math.cos(f.a) * u - Math.sin(f.a) * v, f.c[1] + Math.sin(f.a) * u + Math.cos(f.a) * v]
/** An oriented rectangle, half-length hu along the axis and hv across, counter-clockwise. */
export const orect = (f: Frame, hu: number, hv: number): XY[] => [at(f, -hu, -hv), at(f, hu, -hv), at(f, hu, hv), at(f, -hu, hv)]

/**
 * A prism over a counter-clockwise ring from `bottom` up to `top`, its sides
 * cut into pieces no longer than `seg` metres (so the map's terrain drape can
 * bend them), with a 45-degree bevel of `b` round the top edge, the lid in
 * `lid` and an optional bottom.
 */
export function prism(p: Part, ring: XY[], bottom: number | Z, top: number | Z, b = 0, lid: Part | null = p, bottomLid: Part | null = null, seg = 5) {
  const zb: Z = typeof bottom === 'number' ? flat(bottom) : bottom
  const zt: Z = typeof top === 'number' ? flat(top) : top
  const n = ring.length, inner = b > 0 ? inset(ring, b) : ring
  for (let i = 0; i < n; i++) {
    const A = ring[i], B = ring[(i + 1) % n]
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]); if (L < 1e-6) continue
    const out: V3 = [(B[1] - A[1]) / L, (A[0] - B[0]) / L, 0]
    const k = Math.max(1, Math.ceil(L / seg))
    for (let j = 0; j < k; j++) {
      const P = (t: number): XY => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]
      const p0 = P(j / k), p1 = P((j + 1) / k)
      face(p, [[p0[0], p0[1], zb(p0)], [p1[0], p1[1], zb(p1)], [p1[0], p1[1], zt(p1) - b], [p0[0], p0[1], zt(p0) - b]], out)
    }
    if (b > 0) {
      const a2 = inner[i], b2 = inner[(i + 1) % n]
      face(p, [[A[0], A[1], zt(A) - b], [B[0], B[1], zt(B) - b], [b2[0], b2[1], zt(b2)], [a2[0], a2[1], zt(a2)]], [out[0], out[1], 1])
    }
  }
  if (lid) for (const [i, j, k] of earcut(inner)) {
    const P = (q: XY): V3 => [q[0], q[1], zt(q)]
    face(lid, [P(inner[i]), P(inner[j]), P(inner[k])], [0, 0, 1])
  }
  if (bottomLid) for (const [i, j, k] of earcut(ring)) {
    const P = (q: XY): V3 => [q[0], q[1], zb(q)]
    face(bottomLid, [P(ring[i]), P(ring[j]), P(ring[k])], [0, 0, -1])
  }
}

/** Axis-aligned box. */
export const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0, lid: Part | null = p) =>
  prism(p, rect(x0, x1, y0, y1), z0, z1, b, lid)

/**
 * A gable roof over an oriented rectangle of walls (half-length hu along the
 * ridge, half-width hv), eaves at zE on the wall line, ridge at zR, with
 * overhang `o` all round and slab thickness `t`. The gable-end triangles
 * between the eave line and the roof go in `wall` (null: none, e.g. a hip).
 */
export function gable(roof: Part, wall: Part | null, f: Frame, hu: number, hv: number, zE: number, zR: number, o = 0.6, t = 0.3) {
  const s = (zR - zE) / hv
  const U = hu + o, V = hv + o, ze = zE - o * s
  const P = (u: number, v: number, z: number): V3 => { const q = at(f, u, v); return [q[0], q[1], z] }
  const ax: V3 = [Math.cos(f.a), Math.sin(f.a), 0], ac: V3 = [-Math.sin(f.a), Math.cos(f.a), 0]
  for (const sv of [-1, 1]) {
    const up: V3 = norm([ac[0] * sv * s, ac[1] * sv * s, 1])
    face(roof, [P(-U, sv * V, ze), P(U, sv * V, ze), P(U, 0, zR), P(-U, 0, zR)], up)
    face(roof, [P(-U, sv * V, ze - t), P(U, sv * V, ze - t), P(U, 0, zR - t), P(-U, 0, zR - t)], [-up[0], -up[1], -up[2]])
    face(roof, [P(-U, sv * V, ze), P(U, sv * V, ze), P(U, sv * V, ze - t), P(-U, sv * V, ze - t)], [ac[0] * sv, ac[1] * sv, 0])
    for (const su of [-1, 1]) {
      face(roof, [P(su * U, sv * V, ze), P(su * U, 0, zR), P(su * U, 0, zR - t), P(su * U, sv * V, ze - t)], [ax[0] * su, ax[1] * su, 0])
    }
  }
  if (wall) for (const su of [-1, 1]) face(wall, [P(su * hu, -hv, zE), P(su * hu, hv, zE), P(su * hu, 0, zR)], [ax[0] * su, ax[1] * su, 0])
}

/** A hip roof over an oriented rectangle of walls, ridge along the long axis. */
export function hip(roof: Part, f: Frame, hu: number, hv: number, zE: number, zR: number, o = 0.6, t = 0.3) {
  const s = (zR - zE) / hv
  const U = hu + o, V = hv + o, ze = zE - o * s, r = Math.max(0, hu - hv)
  const P = (u: number, v: number, z: number): V3 => { const q = at(f, u, v); return [q[0], q[1], z] }
  const ax: V3 = [Math.cos(f.a), Math.sin(f.a), 0], ac: V3 = [-Math.sin(f.a), Math.cos(f.a), 0]
  for (const sv of [-1, 1]) {
    face(roof, [P(-U, sv * V, ze), P(U, sv * V, ze), P(r, 0, zR), P(-r, 0, zR)], norm([ac[0] * sv * s, ac[1] * sv * s, 1]))
    face(roof, [P(-U, sv * V, ze), P(U, sv * V, ze), P(U, sv * V, ze - t), P(-U, sv * V, ze - t)], [ac[0] * sv, ac[1] * sv, 0])
  }
  for (const su of [-1, 1]) {
    face(roof, [P(su * U, -V, ze), P(su * U, V, ze), P(su * r, 0, zR)], norm([ax[0] * su * s, ax[1] * su * s, 1]))
    face(roof, [P(su * U, -V, ze), P(su * U, V, ze), P(su * U, V, ze - t), P(su * U, -V, ze - t)], [ax[0] * su, ax[1] * su, 0])
  }
  face(roof, [P(-U, -V, ze - t), P(U, -V, ze - t), P(U, V, ze - t), P(-U, V, ze - t)], [0, 0, -1])
}

/**
 * Flush panels on wall edge A→B of a counter-clockwise ring, `off` metres
 * proud: `count` panels of width w spread evenly with `margin` kept clear at
 * each end, each from z0 to z1.
 */
export function panels(p: Part, A: XY, B: XY, count: number, w: number, z0: number, z1: number, margin = 1, off = 0.05) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1])
  if (count < 1 || L < w + 2 * margin) return
  const u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], n: V3 = [u[1], -u[0], 0]
  const step = (L - 2 * margin) / count
  for (let k = 0; k < count; k++) {
    const c = margin + step * (k + 0.5)
    const P = (s: number, z: number): V3 => [A[0] + u[0] * s + n[0] * off, A[1] + u[1] * s + n[1] * off, z]
    face(p, [P(c - w / 2, z0), P(c + w / 2, z0), P(c + w / 2, z1), P(c - w / 2, z1)], n)
  }
}
/** One panel on edge A→B centred `s` metres from A. */
export function panelAt(p: Part, A: XY, B: XY, s: number, w: number, z0: number, z1: number, off = 0.05) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], n: V3 = [u[1], -u[0], 0]
  const P = (t: number, z: number): V3 => [A[0] + u[0] * t + n[0] * off, A[1] + u[1] * t + n[1] * off, z]
  face(p, [P(s - w / 2, z0), P(s + w / 2, z0), P(s + w / 2, z1), P(s - w / 2, z1)], n)
}

/** A round post (a log) from z0 to z1, `sides`-gon. */
export function post(p: Part, c: XY, r: number, z0: number, z1: number, sides = 6) {
  const ring: XY[] = Array.from({ length: sides }, (_, i) => [c[0] + r * Math.cos((2 * Math.PI * i) / sides), c[1] + r * Math.sin((2 * Math.PI * i) / sides)])
  prism(p, ring, z0, z1, 0, p)
}

/** Write a model and check the budget. */
export async function save(id: string, name: string, parts: Array<{ part: Part; material: any }>, extras: Record<string, unknown>) {
  const used = parts.filter(({ part }) => part.triangles > 0)
  const triangles = used.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', ...extras })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

// ---------------------------------------------------------------------------
// Bright Angel Lodge.

async function build() {
  const stone = new Part(), log = new Part(), shingle = new Part(), roof = new Part(), win = new Part(), door = new Part()

  // Entrance hall: stone gable facing the road (-y), its roof carried 5 m
  // forward over the porch on red log posts. Ridge along y at x = -33.35.
  const ENT: Frame = { c: [-33.35, -3.2], a: Math.PI / 2 }
  const E_HU = 11.2 // along y: -14.4 .. 8
  const E_HV = 9.45 // across: x -42.8 .. -23.9
  prism(stone, rect(-41.6, -25.1, -9.4, 8), 0, 4.5, 0.25, null)
  // The stone gable wall under the porch roof, up to the roof line.
  {
    const s = (10.7 - 4.5) / E_HV
    const zAt = (x: number) => 4.5 + (E_HV - Math.abs(x - ENT.c[0])) * s - 0.35
    face(stone, [[-41.6, -9.4, 4.5], [-25.1, -9.4, 4.5], [-33.35, -9.4, zAt(-33.35)]], [0, -1, 0])
    face(stone, [[-41.6, 8, 4.5], [-33.35, 8, zAt(-33.35)], [-25.1, 8, 4.5]], [0, 1, 0])
    // Entrance doors and the window band over them (NPS1): a tall glazed
    // centre door in its painted frame, a row of three upper lights.
    panelAt(door, [-41.6, -9.4], [-25.1, -9.4], 8.25, 3.0, 1.0, 3.6)
    panelAt(win, [-41.6, -9.4], [-25.1, -9.4], 8.25, 3.6, 4.3, 5.7)
    for (const s0 of [3.2, 13.3]) panelAt(win, [-41.6, -9.4], [-25.1, -9.4], s0, 1.6, 1.3, 3.5)
    panels(win, [-25.1, 8], [-41.6, 8], 3, 1.8, 1.4, 3.4, 2)
    panels(win, [-41.6, 8], [-41.6, -9.4], 3, 1.8, 1.4, 3.4, 2)
  }
  gable(shingle, null, ENT, E_HU, E_HV, 4.5, 10.7, 0.8, 0.35)
  // Porch: a stone-faced deck 1 m up, the log posts and the log beam.
  prism(stone, rect(-42.6, -24.1, -14.4, -9.4), 0, 1.0, 0.15)
  for (let k = 0; k < 6; k++) {
    const x = -42.2 + (k * (42.2 - 24.5)) / 5
    post(log, [x, -14.0], 0.22, 1.0, 4.4)
  }
  box(log, -42.8, -23.9, -14.25, -13.75, 4.1, 4.45)

  // The palisade block east of the entrance: red-brown vertical logs, flat
  // roof (lidar 49.9-50.9 over 45.3).
  prism(log, rect(-25.1, -9.4, -8.9, 8), 0, 5.4, 0.25, roof)
  prism(log, rect(-9.4, 0.7, -10.8, 8), 0, 5.6, 0.25, roof)
  panels(win, [-25.1, -8.9], [-9.4, -8.9], 3, 1.6, 1.3, 3.3, 1.5)
  panels(win, [-9.4, -10.8], [0.7, -10.8], 2, 1.6, 1.3, 3.3, 1.5)

  // Rim side of the west half: stone, flat (lidar 50-51.9) and gabled.
  prism(stone, rect(-30.7, 0.6, 8, 15.6), 0, 5.8, 0.25, roof)
  prism(stone, rect(-14.4, 0.6, 15.6, 19.3), 0, 5.8, 0.25, roof)
  panels(win, [0.6, 19.3], [-14.4, 19.3], 4, 1.8, 2.8, 4.8, 1.2)
  panels(win, [-14.4, 15.6], [-30.7, 15.6], 4, 1.8, 2.4, 4.4, 1.2)
  // North-west stone wing, gable along x.
  {
    const f: Frame = { c: [-40.15, 13.95], a: 0 }
    prism(stone, orect(f, 9.45, 3.35), 0, 3.8, 0, null)
    gable(shingle, stone, f, 9.45, 3.35, 3.8, 6.0, 0.6)
    panels(win, [-30.7, 17.3], [-49.6, 17.3], 4, 1.6, 2.0, 3.4, 1.5)
  }
  // West wing: red-brown, gable along x (lidar 48-50).
  {
    const f: Frame = { c: [-50.85, 4.65], a: 0 }
    prism(log, orect(f, 7.95, 5.95), 0, 3.4, 0, null)
    gable(shingle, log, f, 7.95, 5.95, 3.4, 5.6, 0.6)
    panels(win, [-58.8, -1.3], [-42.9, -1.3], 3, 1.6, 1.0, 2.6, 1.5)
    panels(win, [-58.8, 10.6], [-58.8, -1.3], 2, 1.6, 1.0, 2.6, 1.5)
  }

  // East half (way/164580572): the tall one-storey block along the road, flat
  // pale roofs (NAIP), red-brown walls (lidar 51-53).
  prism(log, rect(0.6, 14.0, -16.0, 0.9), 0, 6.3, 0.25, roof)
  prism(log, rect(14.0, 44.9, -20.4, 0.9), 0, 6.6, 0.25, roof)
  // One row of windows: lidar puts the road here 0.8-1.2 m above y = 0
  // and the roofs only 5-5.5 m above it, a single tall storey.
  panels(win, [0.6, -16.0], [14.0, -16.0], 3, 1.7, 2.0, 4.2, 1.2)
  panels(win, [14.0, -20.4], [44.9, -20.4], 7, 1.7, 2.2, 4.6, 1.5)
  // A low brown hip roof along the road front, as the NAIP's brown rim
  // round the pale roofs shows.
  hip(shingle, { c: [29.45, -17.6], a: 0 }, 15.45, 2.8, 6.6, 7.6, 0.5, 0.25)
  // East end block, hip roof (lidar 52.6).
  {
    const f: Frame = { c: [50.45, -11.5], a: Math.PI / 2 }
    prism(log, orect(f, 6.9, 6.85), 0, 5.4, 0, null)
    hip(shingle, f, 6.9, 6.85, 5.4, 7.3, 0.6)
    // Ground here is 1.1-2.5 m above y = 0 (lidar).
    panels(win, [57.3, -18.4], [57.3, -4.6], 3, 1.6, 3.0, 4.8, 1.5)
    panels(win, [43.6, -18.4], [57.3, -18.4], 3, 1.6, 2.6, 4.6, 1.5)
  }
  // Rim side of the east half: stone, flat between, and the angled stone
  // wing with its gable along its own axis (20.3 degrees, lidar to 53.8).
  prism(stone, rect(0.6, 17.0, 0.9, 13.6), 0, 6.5, 0.25, roof)
  {
    const f: Frame = { c: [26.4, 11.1], a: (20.3 * Math.PI) / 180 }
    const ring = orect(f, 12.2, 6.3)
    prism(stone, ring, 0, 5.6, 0, null)
    gable(shingle, stone, f, 12.2, 6.3, 5.6, 8.3, 0.6)
    // The rim-side ground is 2.7-3.3 m above y = 0 here (lidar).
    panels(win, ring[2], ring[3], 5, 1.8, 3.5, 5.1, 1.5)
    panels(win, ring[1], ring[2], 2, 1.6, 3.4, 5.1, 2)
    // The History Room's big stone chimney on the rim side.
    const ch = at(f, 2, 6.9)
    prism(stone, orect({ c: ch, a: f.a }, 1.4, 0.9), 0, 10.0, 0.2)
  }
  panels(win, [17.0, 13.6], [0.6, 13.6], 3, 1.8, 3.2, 5.0, 1.5)

  // Colours from the daylight photos, pulled to the palette's lightness:
  // the lodge's brown-tan rubble stone, the red-brown logs and boards, the
  // brown shingles, the near-white flat roofs (NAIP) pulled to a pale grey, slate windows and the painted doors.
  await save('grand-canyon-bright-angel-lodge', 'Bright Angel Lodge', [
    { part: stone, material: finish('bright-angel-stone', 0xd2b99c) },
    { part: log, material: finish('bright-angel-log', 0xa9644f) },
    { part: shingle, material: finish('bright-angel-shingle', 0x8c705f) },
    { part: roof, material: finish('bright-angel-flat-roof', 0xd9d4ca) },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
  ], { bearing: 29.5, elevation: 0, height: 10.7 })
}

if (import.meta.main) await build()
