/**
 * Chase Center, San Francisco: the Warriors' arena at Mission Bay, a white
 * drum of stepped horizontal bands under a thick rim, with a glass front on
 * the bay side and two layered prows at its corners. Original procedural
 * geometry, CC0-1.0.
 * bun generators/sf-chase-center.ts
 *
 * Frame: BEARING 0 (the drum is round). x east (Terry A. Francois Boulevard
 * and the bay), y north (16th Street is south), z up, metres. Origin = area
 * centroid of the OSM outline way/579646390. y = 0 is the street round the
 * arena, 3.4 m NAVD88; the only lower ground under the outline is a loading
 * ramp in the south-east corner, which dips to 0.9 and is left to the map.
 *
 * Evidence
 * - OSM way/579646390 ("Chase Center", building, height 38.1), no
 *   building:parts inside it.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 1 m
 *   (/tmp/city/sf/work/sf-chase-center): the drum's rim traced every 10
 *   degrees is a rounded oval 148-165 m across, longest from south-west to
 *   north-east (radius 82 to the south-west, 74 to the north-west and
 *   south-east, a flatter 77-79 along the east front); its parapet tops out at
 *   36-37.4 above the street, a gutter ring inside it at 34.1, and the roof
 *   rises from 38 at its edge to 41.6 in the middle. Two prows stand out at
 *   the north-east and south-east corners to radius 90 and 89, as high as 38.8.
 * - Published (Wikipedia, Manica Architecture): opened 2019, 18,064 seats.
 * - Photos (Wikimedia Commons): "Chase Center - East Side - San
 *   Francisco.jpg" (Tony Wasserman, CC BY-SA 2.0, the bay-side glass front
 *   under the overhanging white rim and its columns, the stepped white bands
 *   beside it); "Chase Center - July 2019 (7605).jpg", "(7753).jpg",
 *   "(7854).jpg" and "(7836).jpg" (Gregory Varnum, CC BY-SA 4.0: the glass
 *   front, a layered prow with its bronze soffits, the bands); "Chase Center -
 *   Warriors.jpg" (Christopher Michel, CC BY 2.0, from the air: the oval, the
 *   white bands, the pale roof, the rim and gutter); "San Francisco - Chase
 *   Center 001-004.jpg" (Américo Toledano, CC BY-SA 4.0); "Chase Arena May
 *   2019 - 1-4.jpg" (Cullen328, CC BY-SA 3.0).
 *
 * Estimated from the photos: the wall's profile (the lidar sees only the
 * rim): glass lobby to 8 m set 9 m in, five white bands each stepping out
 * over the one below up to the 7 m rim band; on the east front a glass wall
 * 7.5 m in under the rim, with columns; the prows as three stacked blades;
 * the gentle wave in the band lines. The roof lettering is left out.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { report } from './sf-de-young'

const BEARING = 0
const ANCHOR = { lng: -122.38739618, lat: 37.76787393 }

const skin = new Part(), roof = new Part(), lobby = new Part(), front = new Part(), soffit = new Part()

// Rim radius every 10 degrees from east, anticlockwise (lidar, prows smoothed out).
const RIM = [78.9, 77.1, 76.6, 77.3, 77.9, 79, 80, 80.5, 80.5, 80, 78.2, 76.4, 75.1, 74.5, 74.4, 73.9, 73.9, 75.1,
  76.5, 77.6, 79.2, 80.8, 82.2, 82.4, 82.4, 81.8, 80.6, 78.9, 77, 75.4, 74.5, 76, 77, 78, 78.6, 79]
const N = 72 // stations round the drum, every 5 degrees
const TH = Array.from({ length: N }, (_, i) => (2 * Math.PI * i) / N)
/** Rim radius at angle t, by cosine interpolation of the table. */
function R(t: number) {
  const f = ((t / (2 * Math.PI)) * 36 + 36) % 36, i = Math.floor(f), u = f - i
  const a = RIM[i], b = RIM[(i + 1) % 36], w = (1 - Math.cos(Math.PI * u)) / 2
  return a + (b - a) * w
}
const P = (t: number, off: number, z: number): V3 => { const r = R(t) - off; return [r * Math.cos(t), r * Math.sin(t), z] }
/** Outward normal of the drum's plan at t (perpendicular to the curve). */
function nOut(t: number, tiltZ = 0): V3 {
  const e = 0.01, a = P(t - e, 0, 0), b = P(t + e, 0, 0)
  const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty)
  const n: V3 = [ty / l, -tx / l, tiltZ]
  const m = Math.hypot(...n)
  return [n[0] / m, n[1] / m, n[2] / m]
}

// The glass front faces the bay, from -38 to +44 degrees.
const G0 = (-38 * Math.PI) / 180, G1 = (44 * Math.PI) / 180

/** A smooth surface between two loops of stations (z and offset per station), facing out. */
function band(part: Part, ts: number[], lo: (t: number) => [number, number], hi: (t: number) => [number, number], closed: boolean) {
  const n = ts.length - (closed ? 0 : 1)
  for (let i = 0; i < n; i++) {
    const t0 = ts[i], t1 = ts[(i + 1) % ts.length]
    const [o0, z0] = lo(t0), [o1, z1] = lo(t1), [p0, w0] = hi(t0), [p1, w1] = hi(t1)
    const A = P(t0, o0, z0), B = P(t1, o1, z1), C = P(t1, p1, w1), D = P(t0, p0, w0)
    // normals: horizontal outward, tilted by the band's lean
    const lean0 = (o0 - p0) / Math.max(0.1, w0 - z0), lean1 = (o1 - p1) / Math.max(0.1, w1 - z1)
    const n0 = nOut(t0, -lean0), n1 = nOut(t1, -lean1)
    part.tri(A, B, C, undefined, undefined, undefined, [n0, n1, n1])
    part.tri(A, C, D, undefined, undefined, undefined, [n0, n1, n0])
  }
}

// Station lists: the white sides (from G1 round to G0) and the glass front (G0..G1).
const side: number[] = [], glass: number[] = []
for (let i = 0; i <= 56; i++) side.push(((44 + (278 * i) / 56) * Math.PI) / 180)
for (let i = 0; i <= 20; i++) glass.push(((-38 + (82 * i) / 20) * Math.PI) / 180)

// ---------------------------------------------------------------------------
// The white sides: a dark lobby base and three broad white bands up to the
// parapet. Each band stands a little proud of the one below, and the lines
// between them rise and fall round the drum (the high-resolution aerial).

const WAVE = (t: number, k: number) => 1.6 * Math.sin(2 * t + k * 2.1)
const TOP = 37.4
// band k: foot offset, top offset (inward from the rim line), base height
const BANDS = [
  { foot: 1.6, top: 1.1, z0: 8 },
  { foot: 0.8, top: 0.3, z0: 17.6 },
  { foot: 0, top: 0, z0: 27.2 },
]
const zb = (k: number, t: number) => (k === 0 ? 8 : k >= BANDS.length ? TOP : BANDS[k].z0 + WAVE(t, k))
const BASE = 4.5 // the lobby, set in under the lowest band
const LINE = 0.7 // the dark shadow line along the top of a band, under the lip of the next
band(lobby, side, () => [BASE, 0], () => [BASE, 8], false)
band(skin, side, () => [BASE, 8], () => [BANDS[0].foot, 8], false)
BANDS.forEach((b, k) => {
  const last = k === BANDS.length - 1
  const top = (t: number) => zb(k + 1, t), mid = (t: number) => top(t) - LINE
  const offAt = (f: number) => b.foot + (b.top - b.foot) * f // along the band's lean
  if (last) { band(skin, side, (t) => [b.foot, zb(k, t)], (t) => [b.top, top(t)], false); return }
  // white face, then the shadow line in the same plane, then the next band's lip
  band(skin, side, (t) => [b.foot, zb(k, t)], (t) => [offAt(0.93), mid(t)], false)
  band(lobby, side, (t) => [offAt(0.93), mid(t)], (t) => [b.top, top(t)], false)
  band(skin, side, (t) => [b.top, top(t)], (t) => [BANDS[k + 1].foot, top(t)], false)
})

// ---------------------------------------------------------------------------
// The glass front under the rim, its columns and the rim's bronze soffit.

band(lobby, glass, () => [9, 0], () => [9, 8], false)
band(front, glass, () => [7.5, 8], () => [6.9, 26.5], false)
band(soffit, glass, () => [9, 8], () => [7.5, 8], false)
band(skin, glass, () => [6.9, 26.5], () => [7.3, 26.5], false) // the glass wall's cap
band(lobby, glass, () => [7.3, 26.5], () => [7.3, 30], false) // the open gap under the rim, in shadow
// soffit under the rim: faces down, so wind it from the outside in
band(soffit, glass, () => [7.3, 30], () => [0, 30], false)
band(skin, glass, () => [0, 30], () => [0, TOP], false)
for (let a = -32; a <= 40; a += 9) {
  const t = (a * Math.PI) / 180, c = P(t, 5.5, 0)
  const s = 8
  for (let i = 0; i < s; i++) {
    const a0 = (2 * Math.PI * i) / s, a1 = (2 * Math.PI * (i + 1)) / s
    const n0: V3 = [Math.cos(a0), Math.sin(a0), 0], n1: V3 = [Math.cos(a1), Math.sin(a1), 0]
    const A: V3 = [c[0] + 0.6 * n0[0], c[1] + 0.6 * n0[1], 0], B: V3 = [c[0] + 0.6 * n1[0], c[1] + 0.6 * n1[1], 0]
    for (const [za, zz] of [[0, 8], [26.5, 30]]) {
      const A2: V3 = [A[0], A[1], za], B2: V3 = [B[0], B[1], za]
      skin.tri(A2, B2, [B[0], B[1], zz], undefined, undefined, undefined, [n0, n1, n1])
      skin.tri(A2, [B[0], B[1], zz], [A[0], A[1], zz], undefined, undefined, undefined, [n0, n1, n0])
    }
  }
}
// End walls where the white sides meet the glass front: the area between the
// two wall profiles, filled in strips between every height where either
// profile turns.
for (const t of [G0, G1]) {
  const tang: V3 = t === G1 ? [Math.sin(t), -Math.cos(t), 0] : [-Math.sin(t), Math.cos(t), 0] // faces into the glass sector
  const S: [number, number][] = [[BASE, 0], [BASE, 8]]
  BANDS.forEach((b, k) => { S.push([b.foot, zb(k, t)], [b.top, zb(k + 1, t)]) })
  const Gp: [number, number][] = [[9, 0], [9, 8], [7.5, 8], [6.9, 26.5], [7.3, 26.5], [7.3, 30], [0, 30], [0, TOP]]
  // offset of a profile at height z, just above (up) or just below (!up) any step there
  const at = (p: [number, number][], z: number, up: boolean) => {
    for (let i = 0; i < p.length - 1; i++) {
      const [o0, z0] = p[i], [o1, z1] = p[i + 1]
      if (z1 - z0 < 1e-6) continue
      if ((up ? z >= z0 - 1e-6 && z < z1 - 1e-6 : z > z0 + 1e-6 && z <= z1 + 1e-6)) return o0 + ((o1 - o0) * (z - z0)) / (z1 - z0)
    }
    return p[up ? 0 : p.length - 1][0]
  }
  const zs = [...new Set([...S, ...Gp].map((q) => +q[1].toFixed(4)))].sort((x, y) => x - y)
  for (let i = 0; i < zs.length - 1; i++) {
    const za = zs[i], zz = zs[i + 1]
    const A = P(t, at(S, za, true), za), B = P(t, at(Gp, za, true), za), C = P(t, at(Gp, zz, false), zz), D = P(t, at(S, zz, false), zz)
    for (const [p, q, r] of [[A, B, C], [A, C, D]] as [V3, V3, V3][]) {
      const cr = [(q[1] - p[1]) * (r[2] - p[2]) - (q[2] - p[2]) * (r[1] - p[1]), (q[2] - p[2]) * (r[0] - p[0]) - (q[0] - p[0]) * (r[2] - p[2])]
      const d = cr[0] * tang[0] + cr[1] * tang[1]
      if (Math.abs(d) < 1e-9) continue
      if (d > 0) skin.tri(p, q, r)
      else skin.tri(p, r, q)
    }
  }
}

// ---------------------------------------------------------------------------
// The roof: a flat parapet ring, the gutter, and the shallow dome.

const all = TH
// parapet, the terrace inside it, a narrow gutter, the low inner wall
band(roof, all, () => [0, TOP], () => [2, TOP], true)
band(skin, all, () => [2, TOP], () => [2, 36.1], true)
band(roof, all, () => [2, 36.1], () => [13, 36.1], true)
band(skin, all, () => [13, 36.1], () => [13, 34], true)
band(roof, all, () => [13, 34], () => [15, 34], true)
band(skin, all, () => [15, 34], () => [15, 38.1], true)
{
  // dome rings as fractions of (R - 15)
  const rings: [number, number][] = [[1, 38.1], [0.8, 39.6], [0.58, 40.6], [0.33, 41.3], [0, 41.6]]
  const at = (t: number, f: number, z: number): V3 => { const r = (R(t) - 15) * f; return [r * Math.cos(t), r * Math.sin(t), z] }
  for (let k = 0; k < rings.length - 1; k++) {
    for (let i = 0; i < N; i++) {
      const t0 = TH[i], t1 = TH[(i + 1) % N]
      const [f0, z0] = rings[k], [f1, z1] = rings[k + 1]
      if (f1 === 0) roof.tri(at(t0, f0, z0), at(t1, f0, z0), [0, 0, z1])
      else roof.quad(at(t0, f0, z0), at(t1, f0, z0), at(t1, f1, z1), at(t0, f1, z1))
    }
  }
}

// ---------------------------------------------------------------------------
// The prows at the north-east and south-east corners: three stacked white
// blades, each a pointed lens standing out from the rim, bronze underneath.

function blade(tc: number, span: number, reach: number, z0: number, z1: number) {
  const n = 8, pts: [number, number][] = [] // (angle, extra radius) along the outer edge, pointed in the middle
  for (let i = 0; i <= n; i++) {
    const u = i / n, t = tc + (u - 0.5) * span
    pts.push([t, reach * (1 - Math.abs(2 * u - 1)) ** 1.4])
  }
  const outer = (i: number, z: number): V3 => { const [t, e] = pts[i]; const r = R(t) + e; return [r * Math.cos(t), r * Math.sin(t), z] }
  const inner = (i: number, z: number): V3 => { const [t] = pts[i]; const r = R(t) - 2; return [r * Math.cos(t), r * Math.sin(t), z] }
  for (let i = 0; i < n; i++) {
    skin.quad(outer(i, z0), outer(i + 1, z0), outer(i + 1, z1), outer(i, z1))
    skin.quad(inner(i, z1), outer(i, z1), outer(i + 1, z1), inner(i + 1, z1))
    soffit.quad(inner(i, z0), inner(i + 1, z0), outer(i + 1, z0), outer(i, z0))
  }
}
for (const [deg, top] of [[60, 38.8], [-38, 38.4]] as [number, number][]) {
  const tc = (deg * Math.PI) / 180
  blade(tc, 0.46, 13, top - 3.4, top)
  blade(tc, 0.4, 10, top - 8.2, top - 5)
  blade(tc, 0.34, 7, top - 13, top - 9.8)
}

const parts = [
  { part: skin, material: finish('chase-white', 0xeeeeeb) },
  { part: roof, material: finish('chase-roof', 0xc9cdcf) },
  { part: lobby, material: PALETTE.window },
  { part: front, material: windowVariant(2, 0x8eadc8) },
  { part: soffit, material: PALETTE.metal },
]
const glb = writeGlb('Chase Center', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 41.6,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/579646390'],
})
const tris = report('Chase Center', parts, glb, 6500)
const out = new URL('../models/sf-chase-center.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
