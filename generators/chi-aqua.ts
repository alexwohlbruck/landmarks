/**
 * Aqua (2009, Jeanne Gang / Studio Gang), Chicago — original procedural
 * geometry, CC0-1.0.
 * bun generators/chi-aqua.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. The anchor is the area centroid of the OSM outline (way/95486962),
 * 41.88631, -87.619901: the podium, which fills the block. Bearing 0.
 *
 * Form: a plain rectangular glass tower whose white concrete floor slabs
 * reach out as balconies by up to 3.7 m (12 ft, Wikipedia), each floor's
 * outline a little different, so the facade ripples like a contour map.
 * Where the balconies pull back to the glass, still "pools" of blue glass
 * open up the face. The tower stands on the north-west corner of a podium
 * whose roof is one of the city's largest roof gardens.
 *
 * Drawn as: the glass box, and one slab every three floors (26 in all),
 * each a ring offset from the box by a smooth wave field. Slab edges are
 * thin (0.4 m in the pools, 2.1 m at full reach) against 9.3 m of glass
 * between them, so the tower reads as aqua glass crossed by rippling white
 * lines, with the pools as open glass. Full reach is drawn 4.2 m against the
 * real 3.7 m so the ripple still reads at phone size. The wave field is invented:
 * the real outlines are bespoke per floor; the field is tuned so the pools
 * are tall ovals in the middle of each face, a storey band to two thirds of
 * a face wide, like the photos.
 *
 * Sources:
 *  - Podium: OSM outline way/95486962 (and its identical 2-level part
 *    way/686330072). OSM tags no height; 20 m is estimated from photos
 *    (about four storeys above the park-level drive on the east).
 *  - Tower: OSM has no tower part. Its plan is measured on the USGS NAIP
 *    orthophoto: the roof, balconies included, spans x −49…8 m, y 6…39 m
 *    from the anchor. The glass box is that less 3 m all round, 51 × 26.5 m,
 *    which matches the published ~16,000 sq ft floor plate (Wikipedia).
 *  - Height 262 m, 82 storeys (Wikipedia, 261.8 m).
 *  - Colours: white concrete slabs (photos); the glass Aqua's aqua-green
 *    tint (#7fb4b8), held near the palette's window lightness.
 *
 * Photos (Wikimedia Commons): Aqua_(Building).jpg (Potro, CC BY-SA 4.0, from
 * the west on Columbus Drive); Aqua_(5192333603).jpg (vxla, CC BY 2.0,
 * looking up a face); Aqua_(29028743675).jpg (Tomošius, CC BY 2.0);
 * Aqua_(9567856351).jpg (Chetiya Sahabandu, CC BY 2.0, the crown);
 * Aqua_(107284131).jpeg (Michael Davis, CC BY 3.0, from the south-west);
 * 2020-01-01_4904x7356_chicago_aqua.jpg (J. Crocker, attribution, from the
 * south-east with the podium); Aqua_(3869860926).jpg (Ethan Kan, CC BY-SA
 * 2.0). USGS NAIP for the plan. No commercial imagery or 3D tiles.
 *
 * Replaces the podium outline, its 2-level part and the eight small
 * building=roof cabanas mapped on the podium roof.
 *
 * Left out: balcony railings, the podium pool, cabanas and paths, the Aqua
 * Parkhomes (separate OSM buildings east of the podium, not replaced).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]

const glass = new Part()
const slab = new Part()
const roof = new Part()
const garden = new Part()
const lobby = new Part()

// ---------- helpers ----------

const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)
const nrm2 = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
const outward = (a: XY, b: XY): XY => nrm2([b[1] - a[1], -(b[0] - a[0])])

/** Ear-clipping triangulation of a simple ccw ring. */
function earcut(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), tris: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k - 1 + idx.length) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = r[i0], b = r[i1], c = r[i2]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(r[j], a, b, c))) continue
      tris.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) tris.push([idx[0], idx[1], idx[2]])
  return tris
}

/**
 * A closed band round a ccw ring: top at `top`, bottom per vertex, sides
 * smooth-shaded where the ring bends gently.
 */
function band(part: Part, r: XY[], top: number, bottom: number[], capPart: Part = part, smooth = 0.7) {
  const n = r.length, en = r.map((p, i) => outward(p, r[(i + 1) % n]))
  const vn = (i: number, e: number): V3 => {
    const a = en[(i - 1 + n) % n], b = en[i]
    const m = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1]))) < smooth ? nrm2([a[0] + b[0], a[1] + b[1]]) : en[e]
    return [m[0], m[1], 0]
  }
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, a = r[i], b = r[j], na = vn(i, i), nb = vn(j, i)
    const a0: V3 = [a[0], a[1], bottom[i]], b0: V3 = [b[0], b[1], bottom[j]], a1: V3 = [a[0], a[1], top], b1: V3 = [b[0], b[1], top]
    part.tri(a0, b0, b1, undefined, undefined, undefined, [na, nb, nb])
    part.tri(a0, b1, a1, undefined, undefined, undefined, [na, nb, na])
  }
  for (const [a, b, c] of earcut(r)) {
    capPart.tri([r[a][0], r[a][1], top], [r[b][0], r[b][1], top], [r[c][0], r[c][1], top])
    part.tri([r[a][0], r[a][1], bottom[a]], [r[c][0], r[c][1], bottom[c]], [r[b][0], r[b][1], bottom[b]])
  }
}

// ---------- podium ----------

const PODIUM: XY[] = ccw([[47.7, 49.8], [47.8, 44.4], [48.0, 30.4], [48.5, 4.7], [48.7, -6.7], [48.9, -19.7], [49.2, -35.8], [49.3, -44.9], [42.2, -45.0], [37.6, -45.1], [-12.9, -46.0], [-20.3, -45.9], [-45.8, -46.4], [-48.9, -46.4], [-49.0, -36.7], [-49.3, -2.6], [-49.4, 1.0], [-49.6, 33.1], [-48.6, 37.7], [-46.3, 41.4], [-44.2, 43.4], [-41.1, 45.9], [-36.5, 47.5], [-31.2, 47.7], [-12.7, 44.1], [7.8, 40.2], [10.0, 40.6], [11.3, 41.9], [12.7, 43.4], [14.3, 45.0], [17.9, 48.7], [19.8, 49.2], [37.3, 49.6]])
const PODIUM_H = 20, LOBBY_H = 6
band(lobby, PODIUM, LOBBY_H, PODIUM.map(() => 0), lobby)
band(slab, PODIUM, PODIUM_H, PODIUM.map(() => LOBBY_H), garden)

// ---------- tower ----------

const X0 = -46, X1 = 5, Y0 = 9, Y1 = 35.5, TOP = 262
const W = X1 - X0, D = Y1 - Y0, PER = 2 * (W + D)
{
  const box: V3[] = [[X0, Y0, PODIUM_H], [X1, Y0, PODIUM_H], [X1, Y1, PODIUM_H], [X0, Y1, PODIUM_H]]
  glass.loft([box, box.map(([x, y]) => [x, y, TOP - 1] as V3)])
  roof.cap(box.map(([x, y]) => [x, y, TOP - 0.5] as V3), true)
}

/**
 * Sample points round the box, counter-clockwise from the south-west
 * corner: each with its perimeter position s, outward normal, and the
 * corner it belongs to (corners get a quarter-circle of three points).
 */
type Sample = { p: XY; n: XY; s: number }
const samples: Sample[] = []
{
  const corners: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
  const edgeN: XY[] = [[0, -1], [1, 0], [0, 1], [-1, 0]]
  const counts = [8, 4, 8, 4]
  let s0 = 0
  for (let e = 0; e < 4; e++) {
    const a = corners[e], b = corners[(e + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    // corner arc at a: from the previous edge's normal to this edge's
    const nPrev = edgeN[(e + 3) % 4], nThis = edgeN[e]
    for (const t of [0.15, 0.5, 0.85]) {
      const n = nrm2([nPrev[0] * (1 - t) + nThis[0] * t, nPrev[1] * (1 - t) + nThis[1] * t])
      samples.push({ p: a, n, s: s0 })
    }
    for (let k = 1; k <= counts[e]; k++) {
      const u = k / (counts[e] + 1)
      samples.push({ p: [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u], n: nThis, s: s0 + L * u })
    }
    s0 += L
  }
}

const smooth = (a: number, b: number, x: number) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t) }

/**
 * The pools, where the balconies pull back to the glass: soft ovals, each
 * [perimeter centre s, height centre z, half-width, half-height]. The
 * perimeter runs counter-clockwise from the south-west corner: south face
 * 0–51, east 51–77.5, north 77.5–128.5, west 128.5–155. Placed after the
 * photos: a tall pool low in the middle of each long face and a smaller one
 * higher up off to one side, and one on each end.
 */
const POOLS: [number, number, number, number][] = [
  [21, 120, 13, 72], [38, 222, 10, 30],        // south
  [64, 160, 8, 55],                             // east
  [106, 115, 13, 70], [88, 225, 10, 28],        // north
  [142, 190, 8, 50], [140, 70, 7, 30],          // west
]
/** How far the balcony reaches at perimeter position s and height z, 0–1. */
function reach(s: number, z: number) {
  let pool = 0
  for (const [ps, pz, hw, hh] of POOLS) {
    let ds = Math.abs(s - ps); ds = Math.min(ds, PER - ds)
    const q = Math.hypot(ds / hw, (z - pz) / hh)
    pool = Math.max(pool, 1 - smooth(0.7, 1.15, q))
  }
  // outside the pools a slow ripple keeps every slab's outline different
  const u = (2 * Math.PI * s) / PER
  const ripple = 0.72 + 0.28 * Math.cos(7 * u + z / 19) * Math.cos(z / 33 - 3 * u)
  return ripple * (1 - pool)
}

const MAX = 4.2, MIN = 0.05, SLABS = 26, PITCH = (TOP - PODIUM_H) / SLABS
for (let k = 1; k <= SLABS; k++) {
  const zt = PODIUM_H + k * PITCH
  const atTop = k === SLABS
  const ring: XY[] = [], bottom: number[] = []
  for (const { p, n, s } of samples) {
    const r = atTop ? 0.85 : reach(s, zt)
    const d = MIN + (MAX - MIN) * r
    ring.push([p[0] + n[0] * d, p[1] + n[1] * d])
    bottom.push(zt - (0.4 + 1.7 * r))
  }
  band(slab, ring, zt, bottom, atTop ? roof : slab)
}

// ---------- write ----------

const parts = [
  { part: glass, material: windowVariant(2, 0x7fb4b8) },
  { part: slab, material: finish('aqua-concrete', 0xecebe6) },
  { part: roof, material: PALETTE.roof },
  { part: garden, material: finish('aqua-roof-garden', 0xa7b593) },
  { part: lobby, material: PALETTE.window },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Aqua', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, height: TOP,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/95486962', 'way/686330072', 'way/1178533833', 'way/1178533841', 'way/1178533854', 'way/1178533855', 'way/1178533856', 'way/1178533857', 'way/1178533858', 'way/1178533859'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/chi-aqua.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
