/**
 * BT Tower (Post Office Tower), 60 Cleveland Street, London: procedural, CC0-1.0.
 * bun generators/london-bt-tower.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 328 (the
 * Cleveland Street grid, so the base block is square to the axes). The
 * origin is the centroid of the OSM outline way/5022282; y = 0 is the
 * street. Built 1961-65 (Eric Bedford, Ministry of Public Building and
 * Works), listed Grade II (NHLE 1350342). Shown as it is after 2011: the
 * microwave dishes are gone and the antenna section is an open core with
 * ring platforms and steel frames; the LED screen ring (2009) near the top.
 *
 * Published (Wikipedia "BT Tower"):
 * - 177 m to the roof, 189 m with the aerial rigging; 37 floors.
 * - the aerial section is 35 m tall, above the 16 floors of equipment;
 * - the LED screen is at 167 m over floors 36-37, 59 m round (18.8 m across);
 * - the revolving restaurant was the 34th floor.
 *
 * Measured, Environment Agency LIDAR Composite DSM/DTM 1 m (Open Government
 * Licence v3.0; London tiles mostly 2010s-2022 flights): the cap's flat top
 * reads 177.2-178 m above the street (published 177 m is used); the street
 * round the foot is flat within 1 m; the base block round the tower reads
 * 8-9 m (OSM tags its part 6 m; lidar is used). The lidar tower sits about
 * 3 m north-west of OSM's outline, a registration offset over 170 m of
 * height, so the OSM position is kept.
 *
 * Scaled from photos (Tilman2007 2025 telephoto, near level, so one scale
 * holds top to bottom; the restaurant tier's 20 m (OSM part way/331903531)
 * and the LED's 18.8 m agree on the scale to 2%):
 * - shaft 15.7 m across, no taper; glazed from 31 m to 108.4 m, a white
 *   collar 25-31 m, plain concrete below;
 * - aerial section 108.4-143.6 m: a core 7.4 m across with six white ring
 *   platforms at 111.3, 116.8, 123.8, 127.8, 133.3 and 140.4 m, open between,
 *   steel frames standing on the platforms;
 * - closed upper section: platform 143.6-145.6 m (r 8.25), lower glazed
 *   tier 146.7-153.7 (r 8.45), restaurant tier 153.8-161.8 (r 10.0), LED
 *   ring 161.9-166.8 (r 9.4), equipment deck and neck (r 3.2) to 171, the
 *   cap drum r 6.6, 172-177 m (Colin Smith's view reads it a little taller than the 2025 one), a lattice mast to 189 m.
 * OSM's parts (r 6.5 shaft, 16 m cap) are coarser than the photos; the
 * photo radii are used.
 *
 * Estimated: the base block's height (lidar), the number and size of the
 * steel frames, floor grouping (two floors per window band), mast taper.
 * Left out: dishes and small antennas, railings, the BT lettering on the
 * screen, the base building's west and south wings (the map draws them).
 *
 * OSM: way/5022282 (outline) and its parts way/331901551, 331901552,
 * 331903528, 331903529, 331903530, 331903531 (all the tower); the base
 * block parts way/331901553 (6 m) and way/192156427 (a 14-18 m slab the
 * lidar does not show) are covered by the base block and replaced.
 *
 * Night: the shaft's and the tiers' windows glow (`window`), the screen is
 * `neon-bt-screen`, the white rings and cap are floodlit lightly.
 *
 * Photos (Wikimedia Commons), EVIDENCE:
 * - "1350342 II BT COMMUNICATION TOWER, CLEVELAND MEWS Camden London 20250612_0003.jpg", Tilman2007, CC BY-SA 4.0 (from the south, telephoto: stage heights)
 * - "London - BT Tower - geograph.org.uk - 7763429.jpg", Colin Smith, CC BY-SA 2.0 (from the south-east, high)
 * - "BT Tower - geograph.org.uk - 2791557.jpg", Colin Smith, CC BY-SA 2.0 (from the north, Primrose Hill)
 * - "BT Tower-1.jpg", David Castor, public domain (from Fitzroy Square, the collar and foot)
 * - "BT Tower - geograph.org.uk - 3249532.jpg", Mr Biz, CC BY-SA 2.0 (from the south-east, street)
 * - "BT Tower, viewed from Whitfield Gardens.jpg", Robert-brook, CC0 (from the south-east)
 * - "BT Tower in London 2014.jpg", James Kevin McMahon, CC BY-SA 4.0
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

const white = new Part()  // concrete rings, collar, cap, base block
const core = new Part()   // the aerial core, neck: grey concrete
const win = new Part()    // the shaft and tier glazing (lit)
const steel = new Part()  // frames and the mast
const screen = new Part() // the LED ring

/** A quad facing `out`-ward by its normals. */
function face(p: Part, Q: V3[], N: V3[]) {
  const f = cross(sub(Q[1], Q[0]), sub(Q[2], Q[0]))
  const avg = N.reduce(add, [0, 0, 0] as V3)
  const [a, b, c, d] = dot(f, avg) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(Q[a], Q[b], Q[c], undefined, undefined, undefined, [N[a], N[b], N[c]])
  p.tri(Q[a], Q[c], Q[d], undefined, undefined, undefined, [N[a], N[c], N[d]])
}
const P = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]

/**
 * Surface of revolution from [r, z] points, outside on the left of the
 * profile's direction (walls run up, roofs run inward, undersides outward).
 */
function lathe(profile: [number, number][], part: Part | ((b: number) => Part), k = 32, smooth = 35) {
  const pick = typeof part === 'function' ? part : () => part
  const bandN = profile.slice(0, -1).map(([r0, z0], b) => {
    const [r1, z1] = profile[b + 1]
    const l = Math.hypot(r1 - r0, z1 - z0) || 1
    return [(z1 - z0) / l, -(r1 - r0) / l] as [number, number]
  })
  const cl = Math.cos((smooth * Math.PI) / 180)
  const vn = (b: number, end: 0 | 1): [number, number] => {
    const own = bandN[b], o = bandN[b + (end ? 1 : -1)]
    if (!o || own[0] * o[0] + own[1] * o[1] < cl) return own
    const s = [own[0] + o[0], own[1] + o[1]], l = Math.hypot(s[0], s[1])
    return [s[0] / l, s[1] / l]
  }
  for (let b = 0; b < profile.length - 1; b++) {
    const [r0, z0] = profile[b], [r1, z1] = profile[b + 1]
    if (r0 === 0 && r1 === 0) continue
    const n0 = vn(b, 0), n1 = vn(b, 1), pt = pick(b)
    const N = (n: [number, number], a: number): V3 => unit([n[0] * Math.cos(a), n[0] * Math.sin(a), n[1]])
    for (let s = 0; s < k; s++) {
      const a0 = (s / k) * TAU, a1 = ((s + 1) / k) * TAU
      const q = [P(r0, a0, z0), P(r0, a1, z0), P(r1, a1, z1), P(r1, a0, z1)]
      const nn = [N(n0, a0), N(n0, a1), N(n1, a1), N(n1, a0)]
      if (r0 === 0) pt.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nn[0], nn[2], nn[3]])
      else if (r1 === 0) pt.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nn[0], nn[1], nn[2]])
      else face(pt, q, nn)
    }
  }
}

/** A box from centre, half sizes, and z range, axis-aligned, flat-shaded. */
function box(p: Part, cx: number, cy: number, hx: number, hy: number, z0: number, z1: number) {
  const r = (z: number): V3[] => [[cx - hx, cy - hy, z], [cx + hx, cy - hy, z], [cx + hx, cy + hy, z], [cx - hx, cy + hy, z]]
  p.loft([r(z0), r(z1)])
  p.cap(r(z1), true)
  p.cap(r(z0), false)
}
/** A square post between two points (any direction), side w. */
function post(p: Part, a: V3, b: V3, w: number) {
  const d = unit(sub(b, a))
  const u = unit(Math.abs(d[2]) > 0.9 ? cross(d, [1, 0, 0]) : cross(d, [0, 0, 1]))
  const v = cross(d, u)
  const ring = (c: V3): V3[] => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([s, t]) => add(c, add(mul(u, (s * w) / 2), mul(v, (t * w) / 2))))
  const A = ring(a), B = ring(b)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const n = unit(add(mul(u, [-1, 1, 1, -1][i] + [-1, 1, 1, -1][j]), mul(v, [-1, -1, 1, 1][i] + [-1, -1, 1, 1][j])))
    const q = [A[i], A[j], B[j], B[i]]
    face(p, q, [n, n, n, n])
  }
  const nA = mul(d, -1)
  face(p, [A[0], A[1], A[2], A[3]], [nA, nA, nA, nA])
  face(p, [B[0], B[1], B[2], B[3]], [d, d, d, d])
}

/** Ear-clipping triangulation of a simple polygon (counter-clockwise). */
function earcut(pts: [number, number][]): [number, number, number][] {
  const idx = pts.map((_, i) => i), out: [number, number, number][] = []
  const area = (a: number[], b: number[], c: number[]) => (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])
  let guard = 0
  while (idx.length > 3 && guard++ < 1000) {
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const A = pts[ia], B = pts[ib], C = pts[ic]
      if (area(A, B, C) <= 0) continue
      const inside = idx.some((j) => j !== ia && j !== ib && j !== ic &&
        area(A, B, pts[j]) >= 0 && area(B, C, pts[j]) >= 0 && area(C, A, pts[j]) >= 0)
      if (inside) continue
      out.push([ia, ib, ic]); idx.splice(i, 1); break
    }
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}
/** A vertical prism over a simple polygon, walls flat-shaded. */
function prism(p: Part, poly: [number, number][], z0: number, z1: number, roofPart = p) {
  let s = 0
  for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; s += a[0] * b[1] - b[0] * a[1] }
  const pts = s > 0 ? poly : [...poly].reverse()
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  for (const [a, b, c] of earcut(pts)) roofPart.tri([pts[a][0], pts[a][1], z1], [pts[b][0], pts[b][1], z1], [pts[c][0], pts[c][1], z1])
}

// ------------------------------------------------------------ base block ---
// OSM way/331901553 in the model frame; 8.5 m from lidar.
const BASE: [number, number][] = [[-16.4, 19.1], [6.0, 20.1], [6.4, 13.9], [9.6, 14.0], [10.0, 8.2], [10.9, -7.2],
  [11.2, -12.4], [-4.4, -13.2], [-14.7, -13.7], [-14.8, -10.6], [-15.9, 9.1]]
const roofP = new Part()
prism(white, BASE, 0, 8.5, roofP)
// A parapet band of dark ribbon glazing round the block's upper floor.
{
  let s = 0
  for (let i = 0; i < BASE.length; i++) { const a = BASE[i], b = BASE[(i + 1) % BASE.length]; s += a[0] * b[1] - b[0] * a[1] }
  const pts = s > 0 ? BASE : [...BASE].reverse()
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4) continue
    const t = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [t[1], -t[0]]
    const at = (u: number, z: number): V3 => [a[0] + t[0] * u + n[0] * 0.04, a[1] + t[1] * u + n[1] * 0.04, z]
    win.quad(at(0.8, 3.6), at(L - 0.8, 3.6), at(L - 0.8, 6.8), at(0.8, 6.8))
  }
}

// ---------------------------------------------------------------- shaft ---
const R = 7.85, K = 32
// Plain concrete foot, the white collar.
lathe([[R, 0], [R, 25]], core, K)
lathe([[R, 25], [8.15, 25.3], [8.15, 30.7], [R, 31]], white, K)
// Glazed shaft 31-108.4 m: bands of two floors (4.5 m each) of glass with
// white spandrel rings between, the glass flush with the wall.
{
  const Z0 = 31, Z1 = 108.4, n = 9, h = (Z1 - Z0) / n
  for (let i = 0; i < n; i++) {
    const a = Z0 + i * h, g0 = a + 1.0, g1 = a + h
    lathe([[R, a], [R, g0]], white, K)
    lathe([[R, g0], [R, g1]], win, K)
  }
}
// Shaft top ring.
lathe([[R, 108.4], [R + 0.25, 108.5], [R + 0.25, 109.6], [3.7, 109.6]], white, K)

// ------------------------------------------------------ aerial section ---
// Open: a grey core with ring platforms, the gaps between them real.
const CORE_R = 3.7, AER0 = 109.6, AER1 = 143.6
lathe([[CORE_R, AER0], [CORE_R, AER1]], core, 24)
// [bottom, top, radius] of each platform, from the 2025 photo.
const PLAT: [number, number, number][] = [[110.5, 112.1, 7.0], [116.0, 117.7, 7.8], [123.1, 124.5, 5.9],
  [127.0, 128.7, 7.1], [132.5, 134.2, 7.6], [139.7, 141.1, 5.0]]
for (const [z0, z1, r] of PLAT) {
  lathe([[CORE_R, z0], [r - 0.25, z0], [r, z0 + 0.25], [r, z1], [CORE_R, z1]], white, 28)
}
// Steel aerial frames standing on the platforms: posts at r 6.0 between the
// platforms, alternate bays turned, with a ring rail at the top of each.
{
  const bays: [number, number, number][] = [] // [z0, z1, phase]
  const levels = [[109.6, 7.6], ...PLAT.map(([, z1, r]) => [z1, r])]
  for (let i = 0; i < PLAT.length; i++) {
    const zb = levels[i][0], zt = PLAT[i][0], rr = Math.min(levels[i][1], PLAT[i][2])
    if (rr < 5.5) continue
    bays.push([zb, zt, i % 2 ? 0.5 : 0])
    const n = 8, rp = rr - 1.2
    for (let k = 0; k < n; k++) {
      const a = ((k + (i % 2 ? 0.5 : 0)) / n) * TAU
      post(steel, P(rp, a, zb), P(rp, a, zt), 0.55)
      // A cross brace in every other bay, out to the next post.
      if (k % 2 === 0) {
        const a2 = ((k + 1 + (i % 2 ? 0.5 : 0)) / n) * TAU
        post(steel, P(rp, a, zb + 0.4), P(rp, a2, zt - 0.4), 0.3)
      }
    }
  }
}
// Closed upper section: platform, lower tier, restaurant tier.
lathe([[CORE_R, AER1], [8.0, AER1], [8.25, 143.9], [8.25, 145.3], [8.0, 145.6], [7.6, 145.6]], white, K)
lathe([[7.6, 145.6], [7.6, 146.7], [8.45, 146.7]], core, K)
lathe([[8.45, 146.7], [8.45, 148.0]], white, K)
lathe([[8.45, 148.0], [8.45, 149.6]], win, K)
lathe([[8.45, 149.6], [8.45, 150.3]], white, K)
lathe([[8.45, 150.3], [8.45, 153.2]], win, K)
lathe([[8.45, 153.2], [8.45, 153.7], [9.7, 153.8], [10.0, 154.1]], white, K)
lathe([[10.0, 154.1], [10.0, 155.8]], white, K)
lathe([[10.0, 155.8], [10.0, 160.4]], win, K)
lathe([[10.0, 160.4], [10.0, 160.9]], white, K)
lathe([[10.0, 160.9], [10.0, 161.8]], win, K)
lathe([[10.0, 161.8], [9.4, 161.9]], white, K)
// The LED screen ring, then its roof deck.
lathe([[9.4, 161.9], [9.4, 166.8]], screen, 48)
lathe([[9.4, 166.8], [9.1, 167.1], [3.2, 167.1]], white, 48)
// Neck with an equipment ring, the cap drum.
lathe([[3.2, 167.1], [3.2, 171.0]], core, 24)
lathe([[7.2, 167.1], [7.2, 168.3], [7.0, 168.3], [7.0, 167.1]], steel, 32) // railing ring, drawn solid
lathe([[3.2, 171.0], [5.6, 171.1], [6.6, 172.0], [6.6, 176.7], [6.3, 177.0], [1.6, 177.0]], white, K)
// Lattice mast: four legs tapering 3.2 m to 1.4 m, girts and diagonals.
{
  const Z0 = 177, Z1 = 188.0, hw = (z: number) => 1.6 - ((z - Z0) / (Z1 - Z0)) * 0.9
  const C = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  const pt = (k: number, z: number): V3 => [C[k][0] * hw(z), C[k][1] * hw(z), z]
  for (let k = 0; k < 4; k++) post(steel, pt(k, Z0), pt(k, Z1), 0.35)
  const girts = [Z0 + 0.2, 180.6, 184.3, Z1]
  for (const z of girts) for (let k = 0; k < 4; k++) post(steel, pt(k, z), pt((k + 1) % 4, z), 0.25)
  for (let g = 0; g < girts.length - 1; g++) for (let k = 0; k < 4; k++) {
    post(steel, pt(k, girts[g]), pt((k + 1) % 4, girts[g + 1]), 0.18)
  }
  // The whip to 189 m.
  post(steel, [0, 0, Z1 - 0.5], [0, 0, 189], 0.3)
  box(steel, 0, 0, 1.0, 1.0, Z1 - 0.2, Z1 + 0.2)
}

// --------------------------------------------------------------- output ---
// Colours: the rings and cap white concrete (trim); the shaft's tinted glass
// reads sea-green grey by day (pulled to the palette's window lightness);
// the core a mid grey; steel a pale grey; the screen BT violet-blue.
const ringLit = (p: V3, n: V3) => (p[2] > 140 && n[2] < 0.7 ? 0.6 : 0)
const parts = [
  { part: white, material: { ...PALETTE.trim, floodlight: ringLit } },
  { part: roofP, material: PALETTE.roof },
  { part: core, material: finish('bt-concrete', 0xb4b7b4) },
  { part: win, material: { ...PALETTE.window, color: 0x86a3a1 } },
  { part: steel, material: finish('bt-steel', 0x8e959b) },
  { part: screen, material: finish('neon-bt-screen', 0x5a4fd0) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('BT Tower', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 328, elevation: 0, height: 189,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/london-bt-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
