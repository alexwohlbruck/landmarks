/**
 * Torres Venecianes (Venetian Towers), Plaça d'Espanya, Barcelona —
 * original procedural geometry, CC0-1.0.
 * bun generators/barcelona-venetian-towers.ts
 *
 * Also the shared kit for the Montjuïc batch (barcelona-mnac, -arenas,
 * -montjuic-tower, -olympic-stadium, -palau-sant-jordi, -montjuic-castle):
 * the helpers below are exported, and this file's own build runs only under
 * `import.meta.main`. Merge this generator before the others.
 *
 * Map frame: +x east, +y north, z up, metres. BEARING 333: the model's +x
 * runs along the line joining the two towers (compass 63°) and +y points to
 * compass 333°, towards the Gran Via; Av. Reina Maria Cristina runs between
 * the towers along y.
 * Origin = area centroid of OSM relation/21193576 (both tower outlines),
 * lng 2.149800, lat 41.374033. One model covers both towers.
 *
 * Evidence
 * - OSM relation/21193576 (building=tower, height 47, wikidata Q7919738,
 *   checked: "Venetian Towers", two towers in Barcelona, 41.3742 2.1500;
 *   architect Ramon Reventós, 1929) and its parts: shafts way/305825431
 *   and way/305825432 (0–35 m, 7.6 m square), galleries way/305825429 and
 *   way/305825433 (35–35.5 m, 9.5 m square), pyramids way/305825427 and
 *   way/305825428 (35–47 m), bases way/35816010 and way/305825430 (0–5 m,
 *   8.6 m square). Tower centres measured from the outlines at x = ±16.25 m,
 *   y = 0.4 m in the model frame; the squares are aligned to it.
 * - Commons photos (daylight, EVIDENCE):
 *   "Torres venecianes 20230913.jpg" (Horcrux, CC BY 4.0, 2023, from the
 *   north-west across the avenue: both towers clean after restoration);
 *   "Torres venecianes Barcelona 2013.jpg" (Felix König, CC BY 3.0, 2013,
 *   from the plaza: the tops under netting, the pyramids green-grey);
 *   "Barcelona - Torres Venecianes.jpg" (Fred Romero, CC BY 2.0, 2017);
 *   "Avinguda de la Reina Maria Cristina 2013.jpg" (Felix König, CC BY 3.0).
 * - Mapterhorn terrain (terrain.ts grid, bearing 333): the plaza is flat to
 *   within 0.5 m under both towers.
 *
 * Heights: total 47 m (OSM, also the published figure). The split, from the
 * Horcrux and König photos (scaled to 47 m, pixel ratios): pale stone base
 * 0–5 m (OSM); brick shaft to 33.6 m (tapering 7.6 → 7.2 m); a projecting stone
 * cornice and balcony 33.6–35.4 m (9.4 m square, OSM's 35–35.5 gallery);
 * an open stone belvedere 35.4–43.2 m with five tall openings a side
 * between columns; a low pyramid of green-grey copper 43.2–47 m. Estimated
 * within about a metre.
 *
 * Shaft faces: each face carries three tall blind arches (recessed strips
 * with round heads under the cornice), drawn as shallow raised pilaster
 * strips with semicircular heads, so the face reads as the real arcading.
 * The arrow-slit windows are left out (too fine).
 *
 * Colours from the 2023 photo, pulled to the palette: brick 0xb46f57 (the
 * photo's orange-red brick, lightened), base and belvedere `stone`, the
 * pyramids a grey-green copper finish (0x87998c). The belvedere openings are dark `window` panels.
 * Night: the towers are floodlit; brick and stone carry _FLOODLIGHT
 * (strongest low on the shaft and on the belvedere).
 *
 * Doubts: the exact belvedere height and the column count per face (five
 * openings counted on the 2023 photo); the pyramids look darker grey on
 * recent photos than the 2013 green-grey.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'

// ---------------------------------------------------------------- shared kit

export type P2 = [number, number]
const TAU = Math.PI * 2

/** Rotate a plan point by `a` radians counter-clockwise. */
export const rot = ([x, y]: P2, a: number): P2 => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]

/** Signed area of a plan ring (positive = counter-clockwise). */
export function area(r: P2[]) {
  let s = 0
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    s += a[0] * b[1] - b[0] * a[1]
  }
  return s / 2
}

/** Ear-clipping triangulation of a simple polygon (any winding); returns index triples, CCW. */
export function earcut(ring: P2[]): [number, number, number][] {
  const idx = ring.map((_, i) => i)
  if (area(ring) < 0) idx.reverse()
  const out: [number, number, number][] = []
  const cross = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: P2, a: P2, b: P2, c: P2) => cross(a, b, p) >= 0 && cross(b, c, p) >= 0 && cross(c, a, p) >= 0
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = ring[i0], b = ring[i1], c = ring[i2]
      if (cross(a, b, c) <= 1e-9) continue
      let ok = true
      for (const j of idx) {
        if (j === i0 || j === i1 || j === i2) continue
        if (inside(ring[j], a, b, c)) { ok = false; break }
      }
      if (!ok) continue
      out.push([i0, i1, i2])
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** A flat cap over any simple plan ring at height z. */
export function capAny(p: Part, ring: P2[], z: number, up = true) {
  for (const [a, b, c] of earcut(ring)) {
    const A: V3 = [ring[a][0], ring[a][1], z], B: V3 = [ring[b][0], ring[b][1], z], C: V3 = [ring[c][0], ring[c][1], z]
    if (up) p.tri(A, B, C)
    else p.tri(A, C, B)
  }
}

/** Vertical walls of a plan ring between z0 and z1 (ring made CCW, faces outward). Long edges split into ≤ maxLen pieces. */
export function walls(p: Part, ring: P2[], z0: number, z1: number, maxLen = 1e9) {
  const r = area(ring) < 0 ? [...ring].reverse() : ring
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / maxLen))
    for (let k = 0; k < n; k++) {
      const s = k / n, t = (k + 1) / n
      const u: P2 = [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s], v: P2 = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      p.quad([u[0], u[1], z0], [v[0], v[1], z0], [v[0], v[1], z1], [u[0], u[1], z1])
    }
  }
}

/** A prism: walls plus top (and optional bottom) cap. */
export function prism(p: Part, ring: P2[], z0: number, z1: number, bottom = false, maxLen = 1e9) {
  walls(p, ring, z0, z1, maxLen)
  capAny(p, ring, z1, true)
  if (bottom) capAny(p, ring, z0, false)
}

/** Offset a convex-or-not ring outward by d (mitred), keeping its winding. */
export function offset(ring: P2[], d: number): P2[] {
  const ccw = area(ring) > 0 ? 1 : -1
  return ring.map((p, i) => {
    const a = ring[(i + ring.length - 1) % ring.length], b = ring[(i + 1) % ring.length]
    const n1 = norm2([p[1] - a[1], -(p[0] - a[0])]), n2 = norm2([b[1] - p[1], -(b[0] - p[0])])
    const m = norm2([n1[0] + n2[0], n1[1] + n2[1]])
    const cosh = m[0] * n1[0] + m[1] * n1[1]
    const k = (ccw * d) / Math.max(0.3, cosh)
    return [p[0] + m[0] * k, p[1] + m[1] * k] as P2
  })
}
const norm2 = (v: P2): P2 => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/** A rectangle ring (CCW) centred at (cx, cy), half sizes hx, hy, turned by a radians, corners cut by `ch`. */
export function rect(cx: number, cy: number, hx: number, hy: number, a = 0, ch = 0): P2[] {
  const pts: P2[] = ch > 0
    ? [[-hx + ch, -hy], [hx - ch, -hy], [hx, -hy + ch], [hx, hy - ch], [hx - ch, hy], [-hx + ch, hy], [-hx, hy - ch], [-hx, -hy + ch]]
    : [[-hx, -hy], [hx, -hy], [hx, hy], [-hx, hy]]
  return pts.map((q) => { const r = rot(q, a); return [r[0] + cx, r[1] + cy] as P2 })
}

/**
 * A bevelled block: chamfered vertical corners and a chamfered top edge
 * (STYLE.md: soft edges). `b` is the bevel; the base is open (it sits on
 * something) unless `bottom`.
 */
export function block(p: Part, cx: number, cy: number, hx: number, hy: number, z0: number, z1: number, b = 0.4, a = 0, bottom = false) {
  const lower = rect(cx, cy, hx, hy, a, b)
  const upper = rect(cx, cy, hx - b, hy - b, a, b * 0.6)
  const ring = (r: P2[], z: number): V3[] => r.map(([x, y]) => [x, y, z])
  p.loft([ring(lower, z0), ring(lower, z1 - b), ring(upper, z1)])
  capAny(p, upper, z1, true)
  if (bottom) capAny(p, lower, z0, false)
}

/** Smooth-shaded loft of closed rings (each CCW from above). */
export function smoothLoft(p: Part, rings: V3[][], open = false) {
  const n = rings[0].length, L = rings.length
  const acc: V3[][] = rings.map((r) => r.map(() => [0, 0, 0] as V3))
  const segs = open ? n - 1 : n
  for (let k = 0; k < L - 1; k++) for (let i = 0; i < segs; i++) {
    const j = (i + 1) % n
    const a = rings[k][i], b = rings[k][j], c = rings[k + 1][j]
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    let m: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    const l = Math.hypot(...m) || 1
    m = [m[0] / l, m[1] / l, m[2] / l]
    for (const [kk, ii] of [[k, i], [k, j], [k + 1, i], [k + 1, j]]) {
      const t = acc[kk][ii]; t[0] += m[0]; t[1] += m[1]; t[2] += m[2]
    }
  }
  const N = acc.map((r) => r.map((m) => { const l = Math.hypot(...m) || 1; return [m[0] / l, m[1] / l, m[2] / l] as V3 }))
  for (let k = 0; k < L - 1; k++) for (let i = 0; i < segs; i++) {
    const j = (i + 1) % n
    const a = rings[k][i], b = rings[k][j], c = rings[k + 1][j], d = rings[k + 1][i]
    if (Math.hypot(a[0] - d[0], a[1] - d[1], a[2] - d[2]) < 1e-6 && Math.hypot(b[0] - c[0], b[1] - c[1], b[2] - c[2]) < 1e-6) continue
    p.tri(a, b, c, undefined, undefined, undefined, [N[k][i], N[k][j], N[k + 1][j]])
    p.tri(a, c, d, undefined, undefined, undefined, [N[k][i], N[k + 1][j], N[k + 1][i]])
  }
}

/**
 * A lathe: profile [radius, z] pairs from bottom to top, swept round (cx, cy)
 * with `seg` segments; sx/sy stretch it into an ellipse. Smooth-shaded.
 * A profile ending at radius 0 closes the top.
 */
export function lathe(p: Part, profile: [number, number][], seg: number, cx = 0, cy = 0, sx = 1, sy = 1, a0 = 0) {
  const rings = profile.map(([r, z]) => Array.from({ length: seg }, (_, i) => {
    const t = a0 + (i / seg) * TAU
    return [cx + r * sx * Math.cos(t), cy + r * sy * Math.sin(t), z] as V3
  }))
  smoothLoft(p, rings)
}

/** A circle (or ellipse) ring in plan, CCW. */
export function circle(cx: number, cy: number, r: number, seg: number, sy = 1, a0 = 0): P2[] {
  return Array.from({ length: seg }, (_, i) => { const t = a0 + (i / seg) * TAU; return [cx + r * Math.cos(t), cy + r * sy * Math.sin(t)] as P2 })
}

/** A pyramid over a rectangle ring (from `rect`), apex at z1. */
export function pyramid(p: Part, base: P2[], z0: number, apex: V3) {
  for (let i = 0; i < base.length; i++) {
    const a = base[i], b = base[(i + 1) % base.length]
    p.tri([a[0], a[1], z0], [b[0], b[1], z0], apex)
  }
}

/**
 * A tube swept along a path of centres with radii (smooth-shaded), ends
 * capped. `up` is a hint for the section frame.
 */
export function tube(p: Part, path: V3[], radii: number[] | number, seg = 10, ry?: number[] | number) {
  const R = (k: number) => (Array.isArray(radii) ? radii[k] : radii)
  const RY = (k: number) => (ry === undefined ? R(k) : Array.isArray(ry) ? ry[k] : ry)
  const rings: V3[][] = path.map((c, k) => {
    const a = path[Math.max(0, k - 1)], b = path[Math.min(path.length - 1, k + 1)]
    let t: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
    const tl = Math.hypot(...t) || 1
    t = [t[0] / tl, t[1] / tl, t[2] / tl]
    const ref: V3 = Math.abs(t[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
    let u: V3 = [t[1] * ref[2] - t[2] * ref[1], t[2] * ref[0] - t[0] * ref[2], t[0] * ref[1] - t[1] * ref[0]]
    const ul = Math.hypot(...u); u = [u[0] / ul, u[1] / ul, u[2] / ul]
    const v: V3 = [t[1] * u[2] - t[2] * u[1], t[2] * u[0] - t[0] * u[2], t[0] * u[1] - t[1] * u[0]]
    return Array.from({ length: seg }, (_, i) => {
      const q = (i / seg) * TAU, cu = Math.cos(q) * R(k), sv = Math.sin(q) * RY(k)
      return [c[0] + u[0] * cu + v[0] * sv, c[1] + u[1] * cu + v[1] * sv, c[2] + u[2] * cu + v[2] * sv] as V3
    })
  })
  // make each ring wind counter-clockwise looking down the path direction
  smoothLoft(p, rings)
  const first = rings[0], last = rings[rings.length - 1]
  const c0 = path[0], c1 = path[path.length - 1]
  for (let i = 0; i < seg; i++) {
    const j = (i + 1) % seg
    p.tri(c0, first[j], first[i])
    p.tri(c1, last[i], last[j])
  }
}

/** A flat panel (window, door) on a wall: from a to b along the wall at z0..z1, set `out` metres off it along `n`. */
export function panel(p: Part, a: P2, b: P2, z0: number, z1: number, n: P2, out = 0.05) {
  const A: V3 = [a[0] + n[0] * out, a[1] + n[1] * out, z0], B: V3 = [b[0] + n[0] * out, b[1] + n[1] * out, z0]
  p.quad(A, B, [B[0], B[1], z1], [A[0], A[1], z1])
}

/** A round-headed panel (arched window) on a flat wall: width w centred at c along unit t, springing at zs, top of the semicircle at zs + w/2. */
export function archPanel(p: Part, c: P2, t: P2, n: P2, w: number, z0: number, zs: number, out = 0.05, seg = 8) {
  const pt = (s: number, z: number): V3 => [c[0] + t[0] * s + n[0] * out, c[1] + t[1] * s + n[1] * out, z]
  p.quad(pt(-w / 2, z0), pt(w / 2, z0), pt(w / 2, zs), pt(-w / 2, zs))
  const r = w / 2
  for (let i = 0; i < seg; i++) {
    const a0 = (i / seg) * Math.PI, a1 = ((i + 1) / seg) * Math.PI
    p.tri(pt(0, zs), pt(r * Math.cos(a0), zs + r * Math.sin(a0)), pt(r * Math.cos(a1), zs + r * Math.sin(a1)))
  }
}

/** Write a model with the batch's usual checks and print its stats. */
export async function emit(id: string, name: string, parts: Array<{ part: Part; material: MaterialSpec }>, extras: Record<string, unknown>, maxTris = 5000) {
  const used = parts.filter((q) => q.part.triangles > 0)
  if (used.length > 6) throw new Error(`${id}: ${used.length} materials`)
  const triangles = used.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${id}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...extras })
  if (glb.length > 250 * 1024) throw new Error(`${id}: file budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}

/** A floodlight falloff: 1 at z0 fading to `lo` at z1, faces looking up dimmed. */
export const floodFade = (z0: number, z1: number, lo = 0.4) => (q: V3, n: V3) => {
  const t = Math.min(1, Math.max(0, (q[2] - z0) / (z1 - z0)))
  return (1 - t * (1 - lo)) * (n[2] > 0.7 ? 0.35 : 1)
}

// ---------------------------------------------------------------- the towers

if (import.meta.main) {
  const BEARING = 333
  const ANCHOR = { lng: 2.149800, lat: 41.374033 }
  const brickMat: MaterialSpec = { ...finish('venetian-brick', 0xb46f57), floodlight: floodFade(4, 34, 0.55) }
  const stoneMat: MaterialSpec = { ...PALETTE.stone, floodlight: (q, n) => (n[2] > 0.7 ? 0.3 : 0.9) }
  const brick = new Part(), stone = new Part(), copper = new Part(), win = new Part()

  const H_BASE = 5, H_SHAFT = 33.6, H_CORN = 35.4, H_BELV = 43.2, H_TOP = 47
  for (const cx of [-16.25, 16.25]) {
    const cy = 0.4
    // base: plinth with a chamfered top edge and a thin band
    block(stone, cx, cy, 4.3, 4.3, 0, H_BASE - 0.5, 0.35)
    block(stone, cx, cy, 4.05, 4.05, H_BASE - 0.5, H_BASE, 0.2)
    // shaft: slight taper, chamfered corners
    const w0 = 3.8, w1 = 3.6, ch = 0.3
    const sq = (h: number, z: number): V3[] => rect(cx, cy, h, h, 0, ch).map(([x, y]) => [x, y, z])
    brick.loft([sq(w0, H_BASE), sq(w1, H_SHAFT)])
    // blind arcading: three raised strips per face with round heads, as the pilasters between recessed arches
    for (let f = 0; f < 4; f++) {
      const a = (f * Math.PI) / 2
      const zs = H_SHAFT - 2.6 // arch springing
      const piers = [-3.1, -1.05, 1.05, 3.1]
      for (const s of piers) {
        const half = 0.3
        const lerpW = (z: number) => w0 + ((w1 - w0) * (z - H_BASE)) / (H_SHAFT - H_BASE)
        const pt = (u: number, z: number, o: number): V3 => {
          const w = lerpW(z) * (s / 3.8)
          const base = rot([w + u, -lerpW(z) - o], a)
          return [cx + base[0], cy + base[1], z]
        }
        const z0 = H_BASE + 0.6, z1 = zs
        // front face of the strip and its two sides (0.12 m proud)
        brick.quad(pt(-half, z0, 0.25), pt(half, z0, 0.25), pt(half, z1, 0.25), pt(-half, z1, 0.25))
        brick.quad(pt(-half, z0, 0), pt(-half, z0, 0.25), pt(-half, z1, 0.25), pt(-half, z1, 0))
        brick.quad(pt(half, z0, 0.25), pt(half, z0, 0), pt(half, z1, 0), pt(half, z1, 0.25))
      }
      // arch heads: three semicircular raised bands between the piers
      for (const m of [-2.075, 0, 2.075]) {
        const r = 0.95, seg = 8, zc = zs
        const W = w1 + ((w0 - w1) * (H_SHAFT - zs)) / (H_SHAFT - H_BASE)
        for (let i = 0; i < seg; i++) {
          const q0 = (i / seg) * Math.PI, q1 = ((i + 1) / seg) * Math.PI
          const P = (q: number, rr: number, o: number): V3 => {
            const b = rot([(m * W) / 3.8 + rr * Math.cos(q), -W - o], a)
            return [cx + b[0], cy + b[1], zc + rr * Math.sin(q)]
          }
          brick.quad(P(q1, r - 0.3, 0.25), P(q0, r - 0.3, 0.25), P(q0, r + 0.3, 0.25), P(q1, r + 0.3, 0.25))
          brick.quad(P(q0, r + 0.3, 0), P(q1, r + 0.3, 0), P(q1, r + 0.3, 0.25), P(q0, r + 0.3, 0.25))
          brick.quad(P(q1, r - 0.3, 0), P(q0, r - 0.3, 0), P(q0, r - 0.3, 0.25), P(q1, r - 0.3, 0.25))
        }
      }
    }
    // cornice + balcony: corbelled course flaring out, then the balcony slab
    const sqr = (h: number, z: number, c = 0.35): V3[] => rect(cx, cy, h, h, 0, c).map(([x, y]) => [x, y, z])
    stone.loft([sqr(w1, H_SHAFT), sqr(w1 + 0.15, H_SHAFT + 0.5), sqr(4.55, H_SHAFT + 1.2), sqr(4.7, H_SHAFT + 1.25), sqr(4.7, H_CORN), sqr(4.5, H_CORN + 0.05)])
    capAny(stone, rect(cx, cy, 4.5, 4.5, 0, 0.35), H_CORN + 0.05)
    // belvedere: pale stone box with five tall openings a side, a frieze and a cornice
    const bw = 3.75, z0 = H_CORN + 0.05, zo0 = z0 + 1.0, zo1 = H_BELV - 1.6
    block(stone, cx, cy, bw, bw, z0, H_BELV - 0.6, 0.25)
    const fr: V3[][] = [sqr(bw, H_BELV - 0.6, 0.25), sqr(bw + 0.3, H_BELV - 0.3, 0.3), sqr(bw + 0.45, H_BELV, 0.3)]
    stone.loft(fr)
    capAny(stone, rect(cx, cy, bw + 0.45, bw + 0.45, 0, 0.3), H_BELV)
    for (let f = 0; f < 4; f++) {
      const a = (f * Math.PI) / 2
      const n: P2 = rot([0, -1], a), t: P2 = rot([1, 0], a)
      for (let k = 0; k < 5; k++) {
        const s = -2.8 + k * 1.4
        const c: P2 = [cx + n[0] * bw + t[0] * s, cy + n[1] * bw + t[1] * s]
        panel(win, [c[0] - t[0] * 0.42, c[1] - t[1] * 0.42], [c[0] + t[0] * 0.42, c[1] + t[1] * 0.42], zo0, zo1, n, 0.04)
      }
    }
    // pyramid
    pyramid(copper, rect(cx, cy, bw + 0.2, bw + 0.2), H_BELV, [cx, cy, H_TOP])
  }

  await emit('barcelona-venetian-towers', 'Torres Venecianes', [
    { part: brick, material: brickMat },
    { part: stone, material: stoneMat },
    { part: copper, material: finish('venetian-copper', 0x87998c) },
    { part: win, material: PALETTE.window },
  ], { bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 47, replaces: [
    'relation/21193576', 'way/305825427', 'way/305825428', 'way/305825429', 'way/305825430', 'way/305825431', 'way/305825432', 'way/305825433', 'way/35816010',
  ] })
}
