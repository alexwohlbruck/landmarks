/**
 * Jongno Tower, Jongno 2-ga, Seoul — original procedural geometry, CC0-1.0.
 * bun generators/seoul-jongno-tower.ts
 *
 * Rafael Viñoly's tower (1999): a curved green-glass body carried on three
 * steel cores, an open gap of three storeys under the top, and the ring of
 * the "Top Cloud" crown floating in the gap's roof between the two tall
 * lattice legs.
 *
 * Frame: x east, y north (BEARING 0), z up, metres. Origin = area centroid of
 * the OSM outline way/1206228046. y = 0 is the street; elevation 0. Terrain
 * could not be checked: Mapterhorn has no z15 tiles over Seoul.
 *
 * Form, from OSM (which maps the tower in detail) and the photos:
 * - the base drum, 0-50 m (way/142096703): a fan-shaped plan with a convex
 *   glass front, green glass, under a pale projecting lip at 50 m;
 * - the upper body, 50-90 m (way/1203371172): a 12 m glass slab along the
 *   diagonal between the two legs;
 * - the gap, 90-120 m: open sky, crossed only by the legs and the third,
 *   central core;
 * - the crown, 120-130 m (relation/21361312): a lens-shaped ring with a
 *   lens-shaped hole (way/1203368746 outer, way/1203368747 inner), its glass
 *   band leaning out over a pale sill, under a pale roof rim, its underside
 *   dishing down towards the central core (as in the panoramio photo);
 * - two lattice legs at the tips of the lens (way/1203368744 and
 *   way/1203368745, 133 m, steel, round 10.8 m footprints in OSM): drawn as
 *   real square trusses, four chords with X bracing on every face, bolder
 *   than real so they survive at 80 px; the third core (way/1203371173,
 *   0-120 m) as a smaller truss rising from the lip through the gap to
 *   carry the crown.
 *
 * Evidence
 * - OSM: way/1206228046 "종로타워" (height 133, 24 levels, start 1999) and its
 *   parts with heights, min_heights and colours (steel #d3dede, glass
 *   #b0d4ce), fetched 2026-11-13. (The brief's point, 126.98310 37.57030, is
 *   50 m west of the tower; way/1203371664 and way/1203371665 there belong to
 *   the neighbouring building and are not replaced.)
 * - Photos (EVIDENCE):
 *   "Jongno Tower Seoul - panoramio.jpg", Schölla Schwarz, CC BY 3.0,
 *     https://commons.wikimedia.org/wiki/File:Jongno_Tower_Seoul_-_panoramio.jpg
 *     from the east along Jong-ro: legs, drum and lip, slab, gap, central
 *     core, crown with its leaning glass band and pale rim;
 *   "Bosingak Bell Pavilion, Seoul (1) (26259311707).jpg", Richard Mortel,
 *     CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Bosingak_Bell_Pavilion,_Seoul_(1)_(26259311707).jpg
 *     the legs' X-braced trusses and the crown's underside from the south;
 *   "Incidental view of Jongno Tower in August 2024.jpg", Immanuelle, CC BY
 *     4.0, https://commons.wikimedia.org/wiki/File:Incidental_view_of_Jongno_Tower_in_August_2024.jpg
 *     the silhouette from the west;
 *   "Jongno Tower ―Rafael Viñoly Architects", anokarina (Flickr), CC BY-SA
 *     2.0, https://www.flickr.com/photos/30760976@N04/6281928827 (a leg and
 *     the crown from below).
 *   Colours: glass green-cyan ~#8fb6b2 in sun, drawn #8fb2b2; steel white,
 *   drawn #dfe5e5.
 *
 * Estimated: the truss sizes (legs 7.6 m square, the third core 6 m, chords 1.5 m, braces
 * 0.9 m, drawn bolder than real; panels ~8.3 m), the lip (2.5 m out, 1.6 m deep), the crown's lean
 * (4.2 m), its struts and ribs, and rim. No lidar exists for Korea.
 *
 * Night: the office glass and the crown restaurant are lit (window-2,
 * window-3); the steel is floodlit up the legs.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 0
const ANCHOR = { lng: 126.983621, lat: 37.570745 }

type P2 = [number, number]
const DRUM: P2[] = [[-25.7, 16.4], [-18.2, 22.7], [-14.7, 26.1], [-4.0, 25.5], [9.3, 19.5], [16.3, 12.3], [22.2, 1.1], [25.2, -11.6], [24.2, -18.0], [22.5, -22.0], [17.6, -27.1], [12.7, -30.7], [2.4, -26.7], [-2.9, -23.9], [-9.3, -19.5], [-14.2, -15.0], [-19.0, -9.7], [-23.4, -3.3], [-26.7, 3.6], [-28.4, 9.1], [-29.3, 15.8]]
const SLAB: P2[] = [[-22.7, 16.3], [-21.2, 14.8], [-22.5, 13.5], [10.2, -24.2], [12.6, -22.3], [14.6, -24.1], [23.7, -15.7], [-13.3, 24.5]]
const CROWN_OUT: P2[] = [[-25.6, 18.2], [-23.7, 8.5], [-16.5, -6.4], [-3.6, -19.4], [3.8, -24.3], [16.7, -28.7], [19.9, -30.1], [23.3, -29.2], [25.5, -26.5], [25.6, -23.1], [24.8, -21.5], [26.7, -10.5], [24.8, -0.3], [20.1, 10.7], [13.0, 19.3], [-0.1, 25.9], [-8.4, 27.4], [-20.4, 27.4], [-23.8, 27.4], [-26.7, 25.0], [-27.4, 21.4]]
const CROWN_IN: P2[] = [[-10.2, 13.5], [-13.6, 10.7], [-8.3, 0.6], [-4.4, -5.7], [1.6, -11.5], [8.3, -15.0], [11.7, -12.6], [9.2, -3.4], [6.3, 1.6], [-2.0, 9.5]]
const LEG_A: P2 = [-22.1, 22.2], LEG_B: P2 = [20.4, -24.6] // the two tall legs (133 m)
const CORE_C: P2 = [11.6, 11.4] // the third core (0-120 m), centre of way/1203371173

const steel = new Part(), body = new Part(), crown = new Part(), roof = new Part(), sill = new Part()

const ccw = (r: P2[]) => {
  let a = 0
  for (let i = 0; i < r.length; i++) { const p = r[i], q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1] }
  return a > 0 ? r : [...r].reverse()
}
function earClip(poly: P2[]): [number, number, number][] {
  const idx = poly.map((_, i) => i), tris: [number, number, number][] = []
  const area = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: P2, a: P2, b: P2, c: P2) => area(a, b, p) > 0 && area(b, c, p) > 0 && area(c, a, p) > 0
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let done = false
    for (let k = 0; k < idx.length; k++) {
      const ia = idx[(k + idx.length - 1) % idx.length], ib = idx[k], ic = idx[(k + 1) % idx.length]
      if (area(poly[ia], poly[ib], poly[ic]) <= 1e-9) continue
      if (idx.some((m) => m !== ia && m !== ib && m !== ic && inside(poly[m], poly[ia], poly[ib], poly[ic]))) continue
      tris.push([ia, ib, ic]); idx.splice(k, 1); done = true; break
    }
    if (!done) idx.splice(0, 1)
  }
  if (idx.length === 3) tris.push([idx[0], idx[1], idx[2]])
  return tris
}
/** A vertical prism over a plan polygon, with its own top and (optionally) bottom. */
function prism(p: Part, poly: P2[], z0: number, z1: number, top: Part | null, bottom: Part | null = null) {
  const r = ccw(poly)
  p.loft([r.map(([x, y]) => [x, y, z0] as V3), r.map(([x, y]) => [x, y, z1] as V3)])
  for (const [a, b, c] of earClip(r)) {
    if (top) top.tri([...r[a], z1] as V3, [...r[b], z1] as V3, [...r[c], z1] as V3)
    if (bottom) bottom.tri([...r[a], z0] as V3, [...r[c], z0] as V3, [...r[b], z0] as V3)
  }
}
/** Offset a plan polygon outward by d (per-vertex, averaged edge normals). */
function grow(poly: P2[], d: number): P2[] {
  const r = ccw(poly), n = r.length
  return r.map((p, i) => {
    const a = r[(i + n - 1) % n], b = r[(i + 1) % n]
    const e1 = [p[0] - a[0], p[1] - a[1]], e2 = [b[0] - p[0], b[1] - p[1]]
    const l1 = Math.hypot(e1[0], e1[1]), l2 = Math.hypot(e2[0], e2[1])
    const nx = e1[1] / l1 + e2[1] / l2, ny = -e1[0] / l1 - e2[0] / l2, l = Math.hypot(nx, ny) || 1
    return [p[0] + (nx / l) * d, p[1] + (ny / l) * d] as P2
  })
}

// ------------------------------------------------------------- the body
prism(body, DRUM, 0, 48.4, null)
// the pale lip at 50 m: a projecting slab over the drum
prism(sill, grow(DRUM, 2.5), 48.4, 50, roof, sill)
prism(body, SLAB, 50, 90, roof)

// ------------------------------------------------------------- the crown
// Resample the lens ring and its hole by angle about the hole's centre, so
// the two loft and cap as one ring.
const C0: P2 = [-0.3, -0.2]
function byAngle(poly: P2[], n: number): P2[] {
  const r = ccw(poly), out: P2[] = []
  for (let k = 0; k < n; k++) {
    const t = -Math.PI + (2 * Math.PI * k) / n, dx = Math.cos(t), dy = Math.sin(t)
    let best = 0
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      // ray from C0 along (dx, dy) against segment ab
      const ex = b[0] - a[0], ey = b[1] - a[1], ax = a[0] - C0[0], ay = a[1] - C0[1]
      const den = dx * ey - dy * ex
      if (Math.abs(den) < 1e-9) continue
      const s = (ax * ey - ay * ex) / den, u = (ax * dy - ay * dx) / den
      if (s > 0 && u >= 0 && u <= 1) best = Math.max(best, s)
    }
    out.push([C0[0] + dx * best, C0[1] + dy * best])
  }
  return out
}
const NC = 40
const outer = byAngle(CROWN_OUT, NC), inner = byAngle(CROWN_IN, NC)
const Z0 = 120, Z1 = 130, LEAN = 4.2, DISH = 8 // the soffit dishes down 8 m to the hole
const shrink = (p: P2, d: number): P2 => {
  const dx = p[0] - C0[0], dy = p[1] - C0[1], l = Math.hypot(dx, dy)
  return [p[0] - (dx / l) * d, p[1] - (dy / l) * d]
}
{
  // the sill band 120-121.5 (pale), drawn in from the outline by the lean
  const o0 = outer.map((p) => [...shrink(p, LEAN), Z0] as V3), o1 = outer.map((p) => [...shrink(p, LEAN * 0.85), Z0 + 1.5] as V3)
  sill.loft([o0, o1])
  // the glass band leaning out to the full outline at 128.4
  const o2 = outer.map((p) => [...p, Z1 - 1.6] as V3)
  crown.loft([o1, o2])
  // the pale roof rim 128.4-130
  const o3 = outer.map((p) => [...p, Z1] as V3)
  sill.loft([o2, o3])
  // the hole's walls (facing inward), glass, and the roof annulus
  const i0 = inner.map((p) => [...p, Z0 - DISH] as V3), i1 = inner.map((p) => [...p, Z1] as V3)
  crown.loft([[...i0].reverse(), [...i1].reverse()])
  for (let k = 0; k < NC; k++) {
    const j = (k + 1) % NC
    sill.quad(i1[k], o3[k], o3[j], i1[j]) // the pale frame over the crown
    // the soffit underneath, from the sill to the hole
    sill.quad(o0[k], i0[k], i0[j], o0[j])
  }
}

// ------------------------------------------------------------- the trusses
const AX = Math.atan2(LEG_B[1] - LEG_A[1], LEG_B[0] - LEG_A[0]) // the lens axis
function member(a: V3, b: V3, w: number) {
  // a square bar of side w from a to b
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], l = Math.hypot(...d)
  const t: V3 = [d[0] / l, d[1] / l, d[2] / l]
  const ref: V3 = Math.abs(t[2]) < 0.9 ? [0, 0, 1] : [Math.cos(AX), Math.sin(AX), 0]
  let u: V3 = [t[1] * ref[2] - t[2] * ref[1], t[2] * ref[0] - t[0] * ref[2], t[0] * ref[1] - t[1] * ref[0]]
  const ul = Math.hypot(...u); u = [u[0] / ul, u[1] / ul, u[2] / ul]
  const v: V3 = [t[1] * u[2] - t[2] * u[1], t[2] * u[0] - t[0] * u[2], t[0] * u[1] - t[1] * u[0]]
  const h = w / 2
  const sec = (p: V3): V3[] => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, j]) => [p[0] + (u[0] * i + v[0] * j) * h, p[1] + (u[1] * i + v[1] * j) * h, p[2] + (u[2] * i + v[2] * j) * h] as V3)
  const s0 = sec(a), s1 = sec(b)
  // corner normals: the bar shades as a round tube and its corners weld
  const cn = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, j]) => {
    const n: V3 = [u[0] * i + v[0] * j, u[1] * i + v[1] * j, u[2] * i + v[2] * j], l = Math.hypot(...n)
    return [n[0] / l, n[1] / l, n[2] / l] as V3
  })
  for (let k = 0; k < 4; k++) {
    const m = (k + 1) % 4
    steel.tri(s0[k], s0[m], s1[m], [0, 0], [0, 0], [0, 0], [cn[k], cn[m], cn[m]])
    steel.tri(s0[k], s1[m], s1[k], [0, 0], [0, 0], [0, 0], [cn[k], cn[m], cn[k]])
  }
}
/** A square truss centred at c, half-size s, from z0 to z1, X-braced on each face every `panel` m. */
function truss(c: P2, s: number, z0: number, z1: number, panel: number, chord: number, brace: number) {
  const cs = Math.cos(AX), sn = Math.sin(AX)
  const corner = (i: number, j: number, z: number): V3 => [c[0] + (i * cs - j * sn) * s, c[1] + (i * sn + j * cs) * s, z]
  const cs4: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  for (const [i, j] of cs4) {
    // chords as square prisms with caps
    const a = corner(i, j, z0), b = corner(i, j, z1)
    member(a, b, chord)
    const h = chord / 2
    steel.cap([[b[0] - h, b[1] - h, z1], [b[0] + h, b[1] - h, z1], [b[0] + h, b[1] + h, z1], [b[0] - h, b[1] + h, z1]], true)
  }
  const n = Math.max(1, Math.round((z1 - z0) / panel))
  for (let k = 0; k <= n; k++) {
    const z = z0 + ((z1 - z0) * k) / n
    for (let f = 0; f < 4; f++) {
      const [i0, j0] = cs4[f], [i1, j1] = cs4[(f + 1) % 4]
      if (k > 0) member(corner(i0, j0, z), corner(i1, j1, z), brace) // the ring
      if (k < n) {
        const zn = z0 + ((z1 - z0) * (k + 1)) / n
        const zb = k === 0 ? z + brace : z // keep the lowest braces above the ground
        member(corner(i0, j0, zb), corner(i1, j1, zn), brace) // the X
        member(corner(i1, j1, zb), corner(i0, j0, zn), brace)
      }
    }
  }
}
truss(LEG_A, 3.8, 0, 133, 8.3, 1.5, 0.9)
truss(LEG_B, 3.8, 0, 133, 8.3, 1.5, 0.9)
truss(CORE_C, 3.0, 48.4, 120, 7.9, 1.2, 0.75) // the third core, from the lip to the crown

// The crown's steel: struts up the leaning glass band and radial ribs under
// its soffit, as on the real crown's frame.
{
  const at = (p: P2, d: number, z: number): V3 => [...shrink(p, d), z] as V3
  for (let k = 0; k < NC; k += 2) {
    const o = outer[k]
    member(at(o, LEAN * 0.85 + 0.35, Z0 + 1.5), at(o, -0.35, Z1 - 1.6), 0.6)
  }
  for (let k = 0; k < NC; k += 4) {
    const o = outer[k], i = inner[k]
    member(at(o, LEAN, Z0 - 0.4), [i[0], i[1], Z0 - DISH - 0.4], 0.7)
  }
}

const steelFlood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : Math.max(0.35, 1 - p[2] / 200))
const parts = [
  { part: steel, material: { ...finish('jongno-steel', 0xdfe5e5, 0.5), floodlight: steelFlood } },
  { part: body, material: windowVariant(2, 0x8fb2b2) },
  { part: crown, material: windowVariant(3, 0xa6bec6) },
  { part: sill, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Jongno Tower', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 133,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/1206228046', 'way/142096703', 'way/1203371172', 'way/1203371173', 'way/1203368744', 'way/1203368745', 'relation/21361312'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/seoul-jongno-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
