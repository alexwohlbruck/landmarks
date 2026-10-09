/**
 * Lumen Field (2002, Ellerbe Becket with LMN), Seattle: procedural, CC0-1.0.
 * bun generators/sea-lumen-field.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the roofs' inner
 * edges run true north-south in the lidar). The origin is the centre of the
 * bowl, which the lidar puts at the middle of the playing field; y = 0 is
 * the street and plaza level around it (5.1 m NAVD88), which is flat.
 *
 * A stadium is its stands, roofs and towers, so the field is left to the
 * map. Form: an oval bowl, its outer wall in pink-red concrete with tall
 * glazed bays; two crescent roofs over the long sideline stands, each
 * hanging from a white arched truss that springs from a pink pylon at each
 * corner and rises 20 m over the roof's inner edge; a tall upper deck
 * closing the south end; the low Hawks Nest stand and the video board at
 * the open north end, which faces downtown.
 *
 * Measured (USGS 3DEP WA_KingCo_1_2021, 1 m surface model, heights above
 * y = 0):
 * - the bowl's outer edge: 226 m east-west, 242 m north-south, close to a
 *   superellipse (exponent 3.3); the field and its margins 92 x 126 m;
 * - the roofs: inner edges 53 m either side of the centre line, ends 118 m
 *   north and south of centre; 62 m high at the middle of the inner edge,
 *   falling to 54 m at the outer edge and about 50 m at the tips;
 * - the arches: 60 m either side of the centre line, crown 80 m (top of
 *   the truss) at the field's mid-line, landing at 44 m on the corner
 *   pylons 124-126 m north and south of centre (a circular arc fits the
 *   lidar to a metre at 60 and 100 m out); hanger nubs about every 11-14 m;
 * - the south upper deck to 48-49 m; the north corners to 28-30 m; the
 *   Hawks Nest rising to 24 m; the video board's top 73-74 m.
 * Published: arches span 720 ft; seating 68,740 (Wikipedia, "Lumen Field").
 * From photos: the pink concrete and glazed bays of the outer wall, the
 * white arches and their struts, the pale grey roof membrane with its white
 * fascia, the dark seating, the pylons, the board on its legs.
 * Estimated: the outer wall's height (24 m) and the recessed band above it;
 * the single rake of each stand; the arch truss section (4.5 x 6 m, drawn solid and a little deeper than the real open truss so it reads at phone size); the
 * hanger section; the board's legs and depth.
 * Left out: the field (the map's), the roof logo (signage), seats' detail,
 * the Event Center and its garage to the south (separate buildings).
 *
 * Photos: /tmp/city/sea/work/sea-lumen-field/credits.txt ("Aerial Qwest
 * Field Aug 2009", Jelson25, public domain, from the west; "Aerial
 * CenturyLink Field November 2011", Jelson25, CC BY-SA 3.0; "CenturyLink
 * Field Seattle WA", SounderBruce, CC BY-SA 2.0; "CenturyLink Field from the
 * east - from Jose Rizal Bridge in 2014", Steve Morgan, CC BY-SA 4.0).
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

const pink = new Part(), white = new Part(), roof = new Part(), seats = new Part(), win = new Part()

function poly(p: Part, P: V3[], n: V3) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const Q = dot(f, n) >= 0 ? P : [...P].reverse()
  for (let i = 1; i < Q.length - 1; i++) p.tri(Q[0], Q[i], Q[i + 1])
}
/** A box between two points' footprints: centre, half sizes, z range. */
function box(p: Part, cx: number, cy: number, hx: number, hy: number, z0: number, z1: number, bottom = false) {
  const c = Math.min(0.4, hx * 0.3, hy * 0.3)
  const r: XY[] = [[cx - hx + c, cy - hy], [cx + hx - c, cy - hy], [cx + hx, cy - hy + c], [cx + hx, cy + hy - c],
    [cx + hx - c, cy + hy], [cx - hx + c, cy + hy], [cx - hx, cy + hy - c], [cx - hx, cy - hy + c]]
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  poly(p, r.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, r.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}

// ------------------------------------------------------------- the plan ---
const A = 113, B = 121, NX = 3.3          // the bowl's outer edge
const FA = 46, FB = 63, FN = 8            // the field and its margins
const se = (a: number, b: number, n: number, t: number): XY => {
  const c = Math.cos(t), s = Math.sin(t)
  return [a * Math.sign(c) * Math.abs(c) ** (2 / n), b * Math.sign(s) * Math.abs(s) ** (2 / n)]
}
/** The outer edge's half width at a given y. */
const halfW = (y: number) => A * Math.max(0, 1 - Math.abs(y / B) ** NX) ** (1 / NX)

// The roofs: crescents between the inner edge and the outer wall.
const RI = 53, TIP = B * (1 - (RI / A) ** NX) ** (1 / NX) // 117.9
const zIn = (y: number) => 62.5 - 12 * (y / TIP) ** 2
const zOut = (y: number) => 54 - 3.5 * (y / TIP) ** 2
/** Roof height at (|x|, y), for |x| between the inner edge and the wall. */
function zRoof(ax: number, y: number) {
  const xo = Math.max(RI + 0.01, halfW(y) + 1.5)
  const t = Math.min(1, Math.max(0, (ax - RI) / (xo - RI)))
  return zIn(y) + (zOut(y) - zIn(y)) * t
}
const underRoof = (x: number, y: number) => Math.abs(x) > RI && Math.abs(y) < TIP

// --------------------------------------------------------------- the bowl ---
{
  const N = 112
  const NORTH_BACK = 104, NORTH_HALF = 36
  const pts = Array.from({ length: N }, (_, i) => {
    const t = (i / N) * 2 * Math.PI
    const o = se(A, B, NX, t), f = se(FA, FB, FN, t)
    if (o[1] > 0 && Math.abs(o[0]) < NORTH_HALF) o[1] = Math.min(o[1], NORTH_BACK)
    // The top of the bowl: under the roof it rises to meet it.
    let H: number
    const d: XY = [f[0] - o[0], f[1] - o[1]], dl = Math.hypot(...d)
    const inset: XY = [o[0] + (d[0] / dl) * 2.5, o[1] + (d[1] / dl) * 2.5]
    if (underRoof(inset[0], inset[1])) H = zRoof(Math.abs(inset[0]), inset[1]) - 2.2
    else if (o[1] > 60 && Math.abs(o[0]) < NORTH_HALF + 1) H = 24
    else if (o[1] > 60) H = 30
    else H = 48
    return { o, f, inset, H }
  })
  const WALL = 24
  for (let i = 0; i < N; i++) {
    const a = pts[i], b = pts[(i + 1) % N]
    const ha = Math.min(WALL, a.H), hb = Math.min(WALL, b.H)
    // Outer wall in pink, a pale ledge on top, a dark recessed band above.
    pink.quad([a.o[0], a.o[1], 0], [b.o[0], b.o[1], 0], [b.o[0], b.o[1], hb], [a.o[0], a.o[1], ha])
    poly(white, [[a.o[0], a.o[1], ha], [b.o[0], b.o[1], hb], [b.inset[0], b.inset[1], hb], [a.inset[0], a.inset[1], ha]], [0, 0, 1])
    if (a.H > WALL + 0.1 || b.H > WALL + 0.1)
      seats.quad([a.inset[0], a.inset[1], ha], [b.inset[0], b.inset[1], hb], [b.inset[0], b.inset[1], b.H], [a.inset[0], a.inset[1], a.H])
    // The stands: from the bowl's top down to the field wall.
    poly(seats, [[a.inset[0], a.inset[1], a.H], [b.inset[0], b.inset[1], b.H], [b.f[0], b.f[1], 3], [a.f[0], a.f[1], 3]], [-(a.f[0] + b.f[0]), -(a.f[1] + b.f[1]), 60])
    // The field wall.
    pink.quad([b.f[0], b.f[1], 0], [a.f[0], a.f[1], 0], [a.f[0], a.f[1], 3], [b.f[0], b.f[1], 3])
  }
  // Glazed bays in the outer wall, about every 13 m along it.
  let acc = 0
  for (let i = 0; i < N; i++) {
    const a = pts[i], b = pts[(i + 1) % N]
    const L = Math.hypot(b.o[0] - a.o[0], b.o[1] - a.o[1])
    acc += L
    if (acc < 13) continue
    acc = 0
    const t: XY = [(b.o[0] - a.o[0]) / L, (b.o[1] - a.o[1]) / L], n: XY = [t[1], -t[0]]
    const m: XY = [(a.o[0] + b.o[0]) / 2, (a.o[1] + b.o[1]) / 2]
    const w = Math.min(7, L * 0.8)
    const P = (s: number, z: number): V3 => [m[0] + t[0] * s + n[0] * 0.06, m[1] + t[1] * s + n[1] * 0.06, z]
    poly(win, [P(-w / 2, 3.5), P(w / 2, 3.5), P(w / 2, 15.5), P(-w / 2, 15.5)], [n[0], n[1], 0])
  }
}

// -------------------------------------------------------------- the roofs ---
{
  const NV = 28, NT = 4
  for (const s of [-1, 1]) {
    const at = (j: number, k: number): V3 => {
      const y = -TIP + (2 * TIP * j) / NV
      const xo = Math.max(RI, halfW(y) + 1.5)
      const ax = RI + (xo - RI) * (k / NT)
      return [s * ax, y, zRoof(ax, y)]
    }
    const nAt = (j: number, k: number): V3 => {
      const p = at(j, k)
      const e = 0.5
      const zx = (zRoof(Math.abs(p[0]) + e, p[1]) - zRoof(Math.abs(p[0]) - e, p[1])) / (2 * e)
      const zy = (zRoof(Math.abs(p[0]), p[1] + e) - zRoof(Math.abs(p[0]), p[1] - e)) / (2 * e)
      return unit([-s * zx, -zy, 1])
    }
    for (let j = 0; j < NV; j++) for (let k = 0; k < NT; k++) {
      const P = [at(j, k), at(j + 1, k), at(j + 1, k + 1), at(j, k + 1)]
      const Nn = [nAt(j, k), nAt(j + 1, k), nAt(j + 1, k + 1), nAt(j, k + 1)]
      const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
      const o = f[2] >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
      roof.tri(P[o[0]], P[o[1]], P[o[2]], undefined, undefined, undefined, [Nn[o[0]], Nn[o[1]], Nn[o[2]]])
      roof.tri(P[o[0]], P[o[2]], P[o[3]], undefined, undefined, undefined, [Nn[o[0]], Nn[o[2]], Nn[o[3]]])
      // underside
      const D = P.map((q) => [q[0], q[1], q[2] - 2.2] as V3)
      poly(roof, [D[0], D[1], D[2], D[3]], [0, 0, -1])
    }
    // White fascia round the edge: the outer curve and the inner edge beam.
    for (let j = 0; j < NV; j++) {
      for (const k of [0, NT]) {
        const p = at(j, k), q = at(j + 1, k)
        const n: V3 = k === 0 ? [-s, 0, 0] : unit([s * (p[0] === q[0] ? 1 : 1), 0, 0])
        const out = k === 0 ? -s * 0.05 : 0
        const P: V3[] = [[p[0] + out, p[1], p[2] + 0.4], [q[0] + out, q[1], q[2] + 0.4], [q[0] + out, q[1], q[2] - 2.6], [p[0] + out, p[1], p[2] - 2.6]]
        // Face it away from the roof's middle.
        const mid: V3 = [s * (RI + 25), 0, 0]
        const c: V3 = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, 0]
        poly(white, P, unit(sub(c, mid)))
        void n
      }
    }
  }
}

// ---------------------------------------------- the arches and the pylons ---
{
  const AX = 60, END = 125, ZEND = 44, CROWN = 80 - 3.0
  const R = (END * END + (CROWN - ZEND) ** 2) / (2 * (CROWN - ZEND))
  const zc = CROWN - R
  const W = 2.25, D = 3.0 // half width, half depth of the truss
  const arcPt = (y: number, r: number): V3 => [0, y * (r / R), zc + Math.sqrt(Math.max(0, R * R - y * y)) * (r / R)]
  for (const s of [-1, 1]) {
    const NS = 26
    // A box section swept along the arc, with outward-facing sides.
    const ring = (y: number): V3[] => {
      const inner = arcPt(y, R - D), outer = arcPt(y, R + D)
      return [
        [s * AX - W, inner[1], inner[2]], [s * AX + W, inner[1], inner[2]],
        [s * AX + W, outer[1], outer[2]], [s * AX - W, outer[1], outer[2]],
      ]
    }
    const y0 = -END, ys = Array.from({ length: NS + 1 }, (_, k) => y0 + (2 * END * k) / NS)
    for (let k = 0; k < NS; k++) {
      const r0 = ring(ys[k]), r1 = ring(ys[k + 1])
      const mid: V3 = [s * AX, (ys[k] + ys[k + 1]) / 2, 0]
      const cen: V3 = [0, 0, zc]
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4
        const P = [r0[i], r0[j], r1[j], r1[i]]
        const c: V3 = [(r0[i][0] + r0[j][0]) / 2, (r0[i][1] + r0[j][1] + r1[i][1] + r1[j][1]) / 4, (r0[i][2] + r0[j][2] + r1[i][2] + r1[j][2]) / 4]
        const m: V3 = [mid[0], c[1], cen[2] + (c[2] - cen[2]) * 0 + (c[2] - (zc + Math.sqrt(Math.max(0, R * R - c[1] * c[1]))) ) ]
        // Outward: away from the section's centre line.
        const axis = arcPt(c[1], R)
        void m
        poly(white, P, unit(sub(c, [s * AX, axis[1], axis[2]])))
      }
    }
    // Hangers: struts from the truss down to the roof's inner edge beam.
    for (let y = -104; y <= 104.1; y += 13) {
      const top = arcPt(y, R - D)
      const zr = zRoof(RI + 2, y)
      if (top[2] - zr < 3) continue
      const x0 = s * (AX - 0.5), x1 = s * (RI + 1.5)
      const h = 0.7
      // A square strut leaning in from the arch to the roof edge.
      const A0: V3 = [x0, y, top[2] + 0.5], B0: V3 = [x1, y, zr]
      const corners = (P: V3): V3[] => [[P[0] - h, P[1] - h, P[2]], [P[0] + h, P[1] - h, P[2]], [P[0] + h, P[1] + h, P[2]], [P[0] - h, P[1] + h, P[2]]]
      const ca = corners(A0), cb = corners(B0)
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4
        const c: V3 = [(ca[i][0] + ca[j][0] + cb[i][0] + cb[j][0]) / 4, (ca[i][1] + ca[j][1]) / 2, 0]
        const axis: V3 = [(A0[0] + B0[0]) / 2, y, 0]
        poly(white, [cb[i], cb[j], ca[j], ca[i]], unit([c[0] - axis[0], c[1] - axis[1], 0]))
      }
    }
    // The pylons at the arch's feet, the truss landing on their tops.
    for (const e of [-1, 1]) box(pink, s * AX, e * END, 5.0, 5.0, 0, ZEND + 1.0)
  }
}

// ---------------------------------------------- the north video board ---
{
  const Y = 108
  for (const x of [-7.5, 7.5]) box(pink, x, Y + 1.5, 1.8, 1.8, 0, 46)
  box(pink, 0, Y + 1.5, 12.5, 2.2, 44, 72, true)
  // Its screen, facing the field, and its back.
  poly(seats, [[-11.5, Y - 0.75, 46], [11.5, Y - 0.75, 46], [11.5, Y - 0.75, 70.5], [-11.5, Y - 0.75, 70.5]], [0, -1, 0])
}

// ---------------------------------------------------------------- output ---
const parts = [
  { part: pink, material: finish('lumen-concrete', 0xc8968a) },
  { part: white, material: PALETTE.trim },
  { part: roof, material: finish('lumen-roof', 0xc9cdcd) },
  { part: seats, material: finish('lumen-seats', 0x5f6872) },
  { part: win, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Lumen Field', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 80,
})
await Bun.write(new URL('../models/sea-lumen-field.glb', import.meta.url), glb)
console.log(`sea-lumen-field.glb: ${triangles} triangles, ${glb.length} bytes`)
