/**
 * Highland Park Manufacturing Company Mill No. 3 (Highland Mill Lofts),
 * 2901 N. Davidson St, NoDa, Charlotte — procedural, CC0-1.0.
 * bun generators/clt-highland-park-mill-3.ts
 *
 * The 1903–04 mill by Stuart W. Cramer and its c.1946 weave room, listed on
 * the National Register in 1988 (Wikipedia; Wikidata Q14707968). An L of
 * two-storey brick mill wings with low gabled roofs behind a cornice, the
 * four-storey tower on the railway (north-west) side "capped by fancy
 * corbelling and crenelated parapets", grey stair towers with round windows
 * on the courtyard faces, and the boiler house ruins with the stump of the
 * mill stack by the North Brevard Street gate. Converted to apartments; the
 * brick has since been painted, pale above and mid-grey on the lower storey
 * (all 2024 photos), and the model takes that paint, not the red brick of
 * older photos. The stack and the ruins are left unpainted.
 *
 * The Heist Brewery building (way/323201833, 2909 N. Davidson St) stands
 * in the mill yard, painted with the complex, and is folded in here as a
 * one-storey block; it is probably one of the mill's c.1925 outbuildings
 * (the district lists a dye house, gate house and waste house), not confirmed.
 *
 * Evidence:
 *  - OSM: way/323193350 (the mill outline), way/323201833 (Heist),
 *    way/323192273 (the boiler house ruins). No building:parts.
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m (ground_min 212.82 m
 *    NAVD88). Base (lowest ground) is 2.8 m above ground_min, at the north-
 *    west wing's railway side; ground rises ~2.5 m to the south-east. Heights
 *    above base: wing eaves 10.2 m, the low ridges 11.6–11.8 m (the long block
 *    ridge on its axis, the north-west wing's ridge 18 m in from its east
 *    face), the tower 24.2 m to its parapet and 25.2 m on the merlons, the
 *    stair towers 13.2 m, Heist 9.2 m (≈7 m over its own ground), the strip
 *    along the long block's courtyard face 8.6 m, the stack 12.2 m, ruins
 *    about 3 m.
 *  - Photos (Commons): City Dweller 2, April 2024, CC BY-SA 4.0: "Highland
 *    Mill Lofts near Benny's Pizza", "… at North Brevard St", "… along North
 *    Davidson St", "… parking lot along North Davidson St", "… along North
 *    Davidson near Benny's Pizza"; James Willamor, "Highland Park
 *    Manufacturing Company Mill.jpg", CC BY-SA 3.0 (the tower from the
 *    railway, before painting: arched windows, a row of oculi, corbel table,
 *    crenellations). USGS NAIP for the plan and the white roofs.
 *
 * Estimated: window counts and pitch (photos, ~3.4 m), the storey split,
 * the tower's openings per face (two arched windows, three oculi), the
 * courtyard strip's form (lidar shows it but no photo does), the ruins' wall
 * heights.
 *
 * This file also holds the small kit the NoDa mill models share: faces with
 * explicit normals, prisms with low gabled or parapeted roofs and
 * two-tone walls, windows per bay, oculi, towers, stacks. Its own model is
 * built only when it is run directly.
 *
 * Model frame: bearing 55 (model +y runs along the north-west wing, 55° east
 * of north); metres above the base.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'

export type XY = [number, number]

// ---------------------------------------------------------------------------
// Polygons and faces.

const area2 = (P: XY[]) => P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
/** Counter-clockwise, without repeated or collinear corners. */
export function clean(P: XY[]): XY[] {
  let Q = P.filter((p, i) => { const q = P[(i + 1) % P.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.05 })
  if (area2(Q) < 0) Q = Q.reverse()
  for (let again = true; again && Q.length > 3;) {
    again = false
    for (let i = 0; i < Q.length; i++) {
      const a = Q[(i + Q.length - 1) % Q.length], b = Q[i], c = Q[(i + 1) % Q.length]
      const cr = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])
      if (Math.abs(cr) / Math.max(Math.hypot(c[0] - a[0], c[1] - a[1]), 1e-6) < 0.02) { Q.splice(i, 1); again = true; break }
    }
  }
  return Q
}
export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
/** Keep the part of P to the left of the line through `a` along `d`. */
export function clip(P: XY[], a: XY, d: XY): XY[] {
  const side = (p: XY) => d[0] * (p[1] - a[1]) - d[1] * (p[0] - a[0])
  const out: XY[] = []
  for (let i = 0; i < P.length; i++) {
    const p = P[i], q = P[(i + 1) % P.length], sp = side(p), sq = side(q)
    if (sp >= 0) out.push(p)
    if ((sp >= 0) !== (sq >= 0)) { const t = sp / (sp - sq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]) }
  }
  return out
}
export function inside(P: XY[], p: XY) {
  let c = false
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const [xi, yi] = P[i], [xj, yj] = P[j]
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
export const centroid = (P: XY[]): XY => {
  const Q = clean(P); let a = 0, x = 0, y = 0
  for (let i = 0; i < Q.length; i++) {
    const p = Q[i], q = Q[(i + 1) % Q.length], c = p[0] * q[1] - q[0] * p[1]
    a += c; x += (p[0] + q[0]) * c; y += (p[1] + q[1]) * c
  }
  return [x / (3 * a), y / (3 * a)]
}
/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
export function earcut(pts: XY[]): [number, number, number][] {
  const idx = pts.map((_, i) => i), out: [number, number, number][] = []
  const cz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const tin = (p: XY, a: XY, b: XY, c: XY) => cz(a, b, p) > 1e-9 && cz(b, c, p) > 1e-9 && cz(c, a, p) > 1e-9
  for (let guard = 0; idx.length > 3 && guard < 10000; guard++) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      if (cz(pts[i0], pts[i1], pts[i2]) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && tin(pts[j], pts[i0], pts[i1], pts[i2]))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
/** The polygon moved inward by `w` (mitred; fine for the small offsets used here). */
export function inset(P: XY[], w: number): XY[] {
  const n = P.length
  const nrm = P.map((A, i) => { const B = P[(i + 1) % n], L = Math.hypot(B[0] - A[0], B[1] - A[1]); return [(B[1] - A[1]) / L, (A[0] - B[0]) / L] as XY })
  return P.map((p, i) => {
    const j = (i + n - 1) % n, a = nrm[j], b = nrm[i]
    const m: XY = [a[0] + b[0], a[1] + b[1]], d = (m[0] * b[0] + m[1] * b[1]) || 1
    return [p[0] - m[0] * w / d, p[1] - m[1] * w / d] as XY
  })
}

const unit = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
/** A triangle facing `n` (or its own normal), winding fixed to agree. */
export function tri(p: Part, a: V3, b: V3, c: V3, n?: V3) {
  const e1: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const f: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (Math.hypot(...f) < 1e-9) return
  const N = unit(n ?? f)
  if (f[0] * N[0] + f[1] * N[1] + f[2] * N[2] >= 0) p.tri(a, b, c, undefined, undefined, undefined, [N, N, N])
  else p.tri(a, c, b, undefined, undefined, undefined, [N, N, N])
}
export function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n?: V3) { tri(p, a, b, c, n); tri(p, a, c, d, n) }
/** A flat polygon (any simple ring) at height z, facing up or down. */
export function cap(p: Part, ring: XY[], z: number | ((q: XY) => number), up = true) {
  const R = clean(ring), Z = typeof z === 'number' ? () => z : z
  for (const [i, j, k] of earcut(R)) {
    const V = (q: XY): V3 => [q[0], q[1], Z(q)]
    tri(p, V(R[i]), V(R[j]), V(R[k]), typeof z === 'number' ? [0, 0, up ? 1 : -1] : undefined)
  }
}
/** A prism over a ring between two heights, with a lid. */
export function prism(p: Part, ring: XY[], z0: number, z1: number, lid: Part | null = p) {
  const R = clean(ring)
  R.forEach((A, i) => {
    const B = R[(i + 1) % R.length]
    quad(p, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1], [B[1] - A[1], A[0] - B[0], 0])
  })
  if (lid) cap(lid, R, z1)
}
/**
 * A box with chamfered upright edges and a chamfered lip at the top, for
 * towers: the soft edges catch the light. `ring` is a convex CCW rectangle.
 */
export function softBox(p: Part, ring: XY[], z0: number, z1: number, b: number, top: Part | null = p) {
  const c: XY = [ring.reduce((s, q) => s + q[0], 0) / ring.length, ring.reduce((s, q) => s + q[1], 0) / ring.length]
  const cut: XY[] = []
  ring.forEach((q, i) => {
    const a = ring[(i + ring.length - 1) % ring.length], d = ring[(i + 1) % ring.length]
    const to = (r: XY): XY => { const L = Math.hypot(r[0] - q[0], r[1] - q[1]); return [q[0] + (r[0] - q[0]) / L * b, q[1] + (r[1] - q[1]) / L * b] }
    cut.push(to(a), to(d))
  })
  const lid = cut.map((q) => { const dx = q[0] - c[0], dy = q[1] - c[1], L = Math.hypot(dx, dy); return [q[0] - dx / L * b * 1.2, q[1] - dy / L * b * 1.2] as XY })
  const n = cut.length
  for (let i = 0; i < n; i++) {
    const A = cut[i], B = cut[(i + 1) % n], a = lid[i], d = lid[(i + 1) % n]
    const o: V3 = [B[1] - A[1], A[0] - B[0], 0]
    quad(p, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1 - b], [A[0], A[1], z1 - b], o)
    quad(p, [A[0], A[1], z1 - b], [B[0], B[1], z1 - b], [d[0], d[1], z1], [a[0], a[1], z1], [o[0], o[1], 1])
  }
  if (top) for (let i = 1; i < n - 1; i++) tri(top, [lid[0][0], lid[0][1], z1], [lid[i][0], lid[i][1], z1], [lid[i + 1][0], lid[i + 1][1], z1], [0, 0, 1])
}
/** A round stack: smooth-shaded tapered shaft with a corbelled cap band. */
export function stack(p: Part, c: XY, r0: number, r1: number, z0: number, z1: number, capPart: Part = p, seg = 14) {
  const ring = (r: number, z: number): V3[] => Array.from({ length: seg }, (_, i) => { const a = (i / seg) * 2 * Math.PI; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z] as V3 })
  const band = (pa: Part, ra: number, rb: number, za: number, zb: number) => {
    const A = ring(ra, za), B = ring(rb, zb)
    for (let i = 0; i < seg; i++) {
      const j = (i + 1) % seg, na = (i / seg) * 2 * Math.PI, nb = (j / seg) * 2 * Math.PI
      const N = (a: number): V3 => [Math.cos(a), Math.sin(a), 0]
      pa.tri(A[i], A[j], B[j], undefined, undefined, undefined, [N(na), N(nb), N(nb)])
      pa.tri(A[i], B[j], B[i], undefined, undefined, undefined, [N(na), N(nb), N(na)])
    }
  }
  const zc = z1 - Math.max(0.8, (z1 - z0) * 0.05)
  band(p, r0, r1, z0, zc)
  // The cap: a step out, a short band, the rim and the dark mouth.
  const rc = r1 + 0.18
  const S = ring(r1, zc), C0 = ring(rc, zc), C1 = ring(rc, z1)
  for (let i = 0; i < seg; i++) { const j = (i + 1) % seg; quad(capPart, S[i], S[j], C0[j], C0[i], [0, 0, -1]) }
  band(capPart, rc, rc, zc, z1)
  const M = ring(r1 - 0.3, z1)
  for (let i = 0; i < seg; i++) { const j = (i + 1) % seg; quad(capPart, C1[i], C1[j], M[j], M[i], [0, 0, 1]) }
  for (let i = 1; i < seg - 1; i++) tri(p, M[0], M[i], M[i + 1], [0, 0, 1])
}

// ---------------------------------------------------------------------------
// Mill blocks.

/** One row of windows: sill and head heights (m above base), width, and head shape. */
export type Row = { z0: number; z1: number; w: number; head?: 'flat' | 'segment' | 'round' }
export type Block = {
  poly: XY[]
  /** Eave or parapet height. */
  top: number
  /** A low gable: ridge parallel to `axis` at coordinate `at`, height `z`. */
  ridge?: { axis: 'x' | 'y'; at: number; z: number }
  /** A flat roof behind a coped parapet (default when there is no ridge). */
  wall: Part
  /** Lower paint band (or brick base), up to height `z`. */
  base?: { part: Part; z: number }
  rows?: Row[]
  pitch?: number
  /** Faces (by outward normal) that get no windows. */
  blank?: (o: XY, mid: XY) => boolean
  roof?: Part
  /** Walls only: the caller roofs it (e.g. `hipRoof`). */
  bare?: boolean
}
export type Kit = {
  win: Part; trim: Part; roof: Part
  /** Pale window frames: a margin round each panel, set just behind it. */
  frame?: Part
  /** Ground height (m above base) at a point, to keep windows out of the ground. */
  ground: (p: XY) => number
}
const roofZ = (b: Block, p: XY): number => {
  if (!b.ridge) return b.top
  const ys = b.poly.map((q) => (b.ridge!.axis === 'x' ? q[1] : q[0])), v = b.ridge.axis === 'x' ? p[1] : p[0]
  const lo = Math.min(...ys), hi = Math.max(...ys), at = b.ridge.at
  const f = v >= at ? (hi - v) / (hi - at) : (v - lo) / (at - lo)
  return b.top + (b.ridge.z - b.top) * Math.max(0, Math.min(1, f))
}
/** The outline with a corner added wherever an edge crosses the ridge line. */
function splitAtRidge(b: Block): XY[] {
  const P = clean(b.poly)
  if (!b.ridge) return P
  const k = b.ridge.axis === 'x' ? 1 : 0, at = b.ridge.at, out: XY[] = []
  P.forEach((A, i) => {
    const B = P[(i + 1) % P.length]
    out.push(A)
    if ((A[k] - at) * (B[k] - at) < 0) { const t = (at - A[k]) / (B[k] - A[k]); out.push([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]) }
  })
  return out
}
const PARA = 0.55, COPE = 0.4, BURY = 0.6

/**
 * Build blocks. Walls run from just below the base to the roof; window
 * panels sit 5 cm proud of the wall in bays centred on each face, and skip
 * any bay that another, taller block covers.
 */
export function build(blocks: Block[], kit: Kit) {
  const covered = (self: Block, q: XY, z: number) => blocks.some((o) => o !== self && inside(o.poly, q) && roofZ(o, q) > z - 0.2)
  for (const b of blocks) {
    const P = splitAtRidge(b), n = P.length, roof = b.roof ?? kit.roof
    const para = !b.ridge
    const Z = (q: XY) => roofZ(b, q)
    // Roof surface.
    if (b.bare) { /* roofed by the caller */ } else if (para) {
      const I = inset(P, COPE)
      cap(roof, I, b.top - PARA)
      // Coping ring, and the parapet's inner face down to the deck.
      P.forEach((A, i) => {
        const B = P[(i + 1) % n], a = I[i], c = I[(i + 1) % n]
        quad(kit.trim, [A[0], A[1], b.top], [B[0], B[1], b.top], [c[0], c[1], b.top], [a[0], a[1], b.top], [0, 0, 1])
        quad(b.wall, [a[0], a[1], b.top], [c[0], c[1], b.top], [c[0], c[1], b.top - PARA], [a[0], a[1], b.top - PARA], [a[1] - c[1], c[0] - a[0], 0])
      })
    } else {
      const k = b.ridge!.axis === 'x' ? 1 : 0, at = b.ridge!.at
      const dir: XY = k === 1 ? [1, 0] : [0, -1]
      for (const half of [clip(P, [at * (1 - k), at * k] as XY, dir), clip(P, [at * (1 - k), at * k] as XY, [-dir[0], -dir[1]])])
        if (half.length >= 3) cap(roof, clean(half), Z)
    }
    // Walls, cornice and windows.
    P.forEach((A, i) => {
      const B = P[(i + 1) % n], L = Math.hypot(B[0] - A[0], B[1] - A[1])
      if (L < 0.05) return
      const o: XY = [(B[1] - A[1]) / L, (A[0] - B[0]) / L], N: V3 = [o[0], o[1], 0]
      const zt = (q: XY) => Z(q) - (para ? 0 : 0)
      const zb = b.base ? (q: XY) => Math.min(b.base!.z, zt(q)) : null
      if (zb) {
        quad(b.base!.part, [A[0], A[1], -BURY], [B[0], B[1], -BURY], [B[0], B[1], zb(B)], [A[0], A[1], zb(A)], N)
        quad(b.wall, [A[0], A[1], zb(A)], [B[0], B[1], zb(B)], [B[0], B[1], zt(B)], [A[0], A[1], zt(A)], N)
      } else quad(b.wall, [A[0], A[1], -BURY], [B[0], B[1], -BURY], [B[0], B[1], zt(B)], [A[0], A[1], zt(A)], N)
      if (!para && !b.bare) {
        // A pale cornice under the eave: a shallow band standing 15 cm proud.
        const d = 0.15, h = 0.55
        const a2: XY = [A[0] + o[0] * d, A[1] + o[1] * d], b2: XY = [B[0] + o[0] * d, B[1] + o[1] * d]
        quad(kit.trim, [a2[0], a2[1], zt(A) - h], [b2[0], b2[1], zt(B) - h], [b2[0], b2[1], zt(B) + 0.05], [a2[0], a2[1], zt(A) + 0.05], N)
        quad(kit.trim, [A[0], A[1], zt(A) + 0.05], [B[0], B[1], zt(B) + 0.05], [b2[0], b2[1], zt(B) + 0.05], [a2[0], a2[1], zt(A) + 0.05], [o[0], o[1], 2])
        quad(kit.trim, [a2[0], a2[1], zt(A) - h], [b2[0], b2[1], zt(B) - h], [B[0], B[1], zt(B) - h], [A[0], A[1], zt(A) - h], [0, 0, -1])
      }
      const mid: XY = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
      if (!b.rows || L < 2.5 || b.blank?.(o, mid)) return
      const pitch = b.pitch ?? 3.4, count = Math.floor((L - 0.8) / pitch)
      if (count < 1) return
      const u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], start = (L - count * pitch) / 2
      for (let k = 0; k < count; k++) {
        const s = start + pitch * (k + 0.5), c: XY = [A[0] + u[0] * s, A[1] + u[1] * s]
        const probe: XY = [c[0] + o[0] * 0.5, c[1] + o[1] * 0.5]
        for (const r of b.rows) {
          if (kit.ground(c) > r.z0 - 0.3 || r.z1 > Z(c) - 0.6 || covered(b, probe, r.z1)) continue
          window(kit.win, c, u, o, r, kit.frame)
        }
      }
    })
  }
}
/** A window panel on a wall: centre `c` on the wall line, along `u`, facing `o`. */
export function window(p: Part, c: XY, u: XY, o: XY, r: Row, frame?: Part, d = 0.05) {
  if (frame) {
    // The frame is the same shape grown by a margin, 2 cm behind the panel.
    const m = 0.16
    window(frame, c, u, o, { ...r, z0: r.z0 - m, z1: r.z1 + m, w: r.w + 2 * m }, undefined, d - 0.02)
  }
  const N: V3 = [o[0], o[1], 0], w = r.w
  const P = (s: number, z: number): V3 => [c[0] + u[0] * s + o[0] * d, c[1] + u[1] * s + o[1] * d, z]
  if (!r.head || r.head === 'flat') { quad(p, P(-w / 2, r.z0), P(w / 2, r.z0), P(w / 2, r.z1), P(-w / 2, r.z1), N); return }
  const rise = r.head === 'round' ? w / 2 : 0.22 * w, h = r.z1 - rise
  quad(p, P(-w / 2, r.z0), P(w / 2, r.z0), P(w / 2, h), P(-w / 2, h), N)
  const R = (w * w / 4 + rise * rise) / (2 * rise), seg = r.head === 'round' ? 8 : 4
  const arc = Array.from({ length: seg + 1 }, (_, i) => { const x = (i / seg - 0.5) * w; return P(x, h + Math.sqrt(Math.max(0, R * R - x * x)) - (R - rise)) })
  for (let i = 0; i < seg; i++) tri(p, P(0, h), arc[i], arc[i + 1], N)
}
/** A round window, flush on a wall. */
export function oculus(p: Part, c: XY, u: XY, o: XY, z: number, r: number, seg = 10, d = 0.05) {
  const N: V3 = [o[0], o[1], 0]
  const P = (a: number, k = 1): V3 => [c[0] + u[0] * Math.cos(a) * r * k + o[0] * d, c[1] + u[1] * Math.cos(a) * r * k + o[1] * d, z + Math.sin(a) * r * k]
  for (let i = 0; i < seg; i++) tri(p, [c[0] + o[0] * d, c[1] + o[1] * d, z], P((i / seg) * 2 * Math.PI), P(((i + 1) / seg) * 2 * Math.PI), N)
}
/** The four faces of an axis-aligned rectangle: centre, along-vector, outward normal, length. */
export function faces(R: XY[]) {
  const P = clean(R)
  return P.map((A, i) => {
    const B = P[(i + 1) % P.length], L = Math.hypot(B[0] - A[0], B[1] - A[1])
    return { c: [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2] as XY, u: [(B[0] - A[0]) / L, (B[1] - A[1]) / L] as XY, o: [(B[1] - A[1]) / L, (A[0] - B[0]) / L] as XY, L }
  })
}
/** Merlons round the top of a rectangle: `k` per face, corners included. */
export function merlons(p: Part, R: XY[], z0: number, z1: number, k: number, w: number, depth = 0.5) {
  for (const f of faces(R)) {
    for (let i = 0; i < k; i++) {
      const s = k === 1 ? 0 : -f.L / 2 + w / 2 + (i * (f.L - w)) / (k - 1)
      const c: XY = [f.c[0] + f.u[0] * s, f.c[1] + f.u[1] * s]
      const a: XY = [c[0] - f.u[0] * w / 2, c[1] - f.u[1] * w / 2], b: XY = [c[0] + f.u[0] * w / 2, c[1] + f.u[1] * w / 2]
      const ring: XY[] = [a, b, [b[0] - f.o[0] * depth, b[1] - f.o[1] * depth], [a[0] - f.o[0] * depth, a[1] - f.o[1] * depth]]
      prism(p, ring, z0, z1)
    }
  }
}

/**
 * A low hipped roof over a rectangle with deep overhanging eaves: the roof
 * planes run out `over` past the walls, a fascia band edges them and a
 * soffit closes them underneath. `eave` is the wall top.
 */
export function hipRoof(roof: Part, fascia: Part, R: XY[], eave: number, ridge: number, over: number) {
  const xs = R.map((p) => p[0]), ys = R.map((p) => p[1])
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys)
  const alongX = x1 - x0 >= y1 - y0, half = (alongX ? y1 - y0 : x1 - x0) / 2, k = (ridge - eave) / half
  const ze = eave - over * k
  const o: XY[] = rect(x0 - over, y0 - over, x1 + over, y1 + over)
  const r0: V3 = alongX ? [x0 + half, (y0 + y1) / 2, ridge] : [(x0 + x1) / 2, y0 + half, ridge]
  const r1: V3 = alongX ? [x1 - half, (y0 + y1) / 2, ridge] : [(x0 + x1) / 2, y1 - half, ridge]
  const E = o.map((p): V3 => [p[0], p[1], ze])
  // Corners: (x0,y0) (x1,y0) (x1,y1) (x0,y1). Each side gets a plane up to the ridge.
  const [a, b, c, d] = E
  // Each roof face lit by its own (upward) normal.
  const up = (p: V3, q: V3, r: V3) => {
    const e1 = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], e2 = [r[0] - p[0], r[1] - p[1], r[2] - p[2]]
    const f: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
    tri(roof, p, q, r, f[2] < 0 ? [-f[0], -f[1], -f[2]] : f)
  }
  const upQ = (p: V3, q: V3, r: V3, s: V3) => { up(p, q, r); up(p, r, s) }
  if (alongX) {
    upQ(a, b, r1, r0); upQ(c, d, r0, r1); up(d, a, r0); up(b, c, r1)
  } else {
    up(a, b, r0); upQ(b, c, r1, r0); up(c, d, r1); upQ(d, a, r0, r1)
  }
  // Fascia and soffit.
  const W = clean(R)
  E.forEach((A, i) => {
    const B = E[(i + 1) % 4], n: V3 = [B[1] - A[1], A[0] - B[0], 0]
    quad(fascia, [A[0], A[1], ze - 0.35], [B[0], B[1], ze - 0.35], B, A, n)
    const p = W[i], q = W[(i + 1) % 4]
    quad(fascia, [A[0], A[1], ze - 0.35], [p[0], p[1], eave - 0.1], [q[0], q[1], eave - 0.1], [B[0], B[1], ze - 0.35], [0, 0, -1])
  })
}

// ---------------------------------------------------------------------------
// Output.

export type Built = { id: string; name: string; anchor: XY; height: number; parts: { part: Part; material: Swatch }[] }
/** Move parts so the anchor is the origin, check the budget and write the GLB. */
export async function write(b: Built, budget = 5000) {
  const parts = b.parts.filter((p) => p.part.triangles > 0).map(({ part, material }) => {
    const out = new Part()
    // Part stores glTF (x, z, -y): shift x by −anchor.x and glTF z by +anchor.y.
    out.pos = part.pos.map((v, i) => (i % 3 === 0 ? v - b.anchor[0] : i % 3 === 2 ? v + b.anchor[1] : v))
    out.nrm = part.nrm.slice(); out.uv = part.uv.slice()
    return { part: out, material }
  })
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > budget) throw new Error(`${b.id}: triangle budget exceeded: ${triangles}`)
  if (parts.length > 6) throw new Error(`${b.id}: ${parts.length} materials`)
  const glb = writeGlb(b.name, parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', height: b.height,
  })
  if (glb.length > 256000) throw new Error(`${b.id}: file budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${b.id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

/** Mill red brick, near the palette's lightness but red, not salmon. */
export const BRICK = finish('mill-brick', 0xad5c4b)
/** Pale membrane roofs. */
export const MILL_ROOF = finish('mill-roof', 0xc4cacf)

// ---------------------------------------------------------------------------
// Highland Park Mill No. 3.

/** Painted brick: pale above, mid-grey on the lower storey (2024 photos). */
const PAINT_PALE = finish('highland-paint', 0xe6e4df)
const PAINT_GREY = finish('highland-grey', 0xa5a8aa)

/** Ground above base, a plane fitted to the lidar ground round the complex (sd 0.4 m). */
const ground = (p: XY) => 1.16 + 0.0093 * p[0] + 0.0092 * p[1]

/** way/323193350 in the model frame, for the anchor. */
const OUTLINE: XY[] = [[59.6, 26.3], [59.5, 18.7], [52.7, 18.9], [52.8, 26.2], [15.4, 26.0], [15.2, 20.1], [8.9, 20.3], [8.8, 26.2], [0.4, 26.4], [0.4, -27.9], [9.0, -27.9], [8.9, -33.9], [0.5, -33.8], [0.2, -72.8], [-39.0, -72.6], [-38.8, -54.2], [-38.6, -47.5], [-38.8, -41.0], [-39.1, -35.3], [-38.5, -7.6], [-44.4, -7.2], [-44.5, -1.4], [-44.5, 0.6], [-45.0, 8.1], [-44.6, 27.3], [-38.7, 27.5], [-38.4, 63.7], [95.1, 64.3], [95.4, 26.4]]
/** way/323192273: the boiler house ruins. */
const RUINS: XY[] = [[25.3, -51.2], [22.8, -51.1], [22.9, -55.0], [14.1, -60.8], [11.4, -60.9], [11.4, -40.2], [18.0, -40.1], [19.1, -41.2], [21.6, -41.3], [21.5, -46.1], [25.1, -46.1]]

export function buildHighland(): Built {
  const pale = new Part(), grey = new Part(), win = new Part(), trim = new Part(), roof = new Part(), brick = new Part()
  const kit: Kit = { win, trim, roof, ground, frame: trim }
  const EAVE = 10.2, BAND = 4.6
  // Two storeys: segment-headed windows, the upper row much taller.
  const mill: Row[] = [{ z0: 1.6, z1: 3.9, w: 1.5, head: 'segment' }, { z0: 5.3, z1: 9.2, w: 1.7, head: 'segment' }]
  const blocks: Block[] = [
    // The long block on the north-east (the weave room), ridge on its axis.
    { poly: rect(-38.6, 26.2, 95.2, 64.2), top: EAVE, ridge: { axis: 'x', at: 46, z: 11.8 }, wall: pale, base: { part: grey, z: BAND }, rows: mill },
    // The north-west wing (the 1903–04 mill), its ridge 18 m in from the east face.
    { poly: rect(-38.8, -72.7, 0.4, 27.4), top: EAVE, ridge: { axis: 'y', at: -18, z: 11.6 }, wall: pale, base: { part: grey, z: BAND }, rows: mill },
    // The strip west of it, north of the tower, flat.
    { poly: rect(-44.8, -7.2, -38.8, 27.4), top: EAVE, wall: pale, base: { part: grey, z: BAND }, rows: mill },
    // The one-storey strip along the long block's courtyard face.
    { poly: rect(15.2, 22.4, 52.7, 26.2), top: 8.6, wall: grey, rows: [{ z0: 3.2, z1: 6.6, w: 1.6, head: 'segment' }] },
    // Heist Brewery: one storey, painted grey, tall segment-headed windows.
    { poly: [[91.0, -23.1], [64.7, -23.5], [64.6, -17.1], [37.8, -17.5], [37.7, -6.6], [34.9, -6.7], [34.9, -0.4], [37.5, -0.3], [88.1, 0.4], [90.7, 0.4]], top: 9.2, wall: grey, rows: [{ z0: 3.4, z1: 7.4, w: 1.7, head: 'segment' }], pitch: 3.8 },
  ]
  build(blocks, kit)
  // Four square roof hatches down the long block's ridge (NAIP), ~6.5 m.
  for (const x of [-21.6, 12.2, 44.2, 75.8]) softBox(trim, rect(x - 3.2, 42.8, x + 3.2, 49.2), 11.0, 12.2, 0.25, trim)

  // Stair towers on the courtyard faces: grey, a pale cornice, a round window
  // under it on each open face.
  const STAIRS: XY[][] = [rect(0.4, -33.9, 9.0, -27.9), rect(8.9, 18.8, 15.2, 26.2), rect(52.7, 18.8, 59.6, 26.2)]
  for (const R of STAIRS) {
    softBox(grey, R, -BURY, 13.2, 0.3, roof)
    softBox(trim, inset(R, -0.12), 12.6, 13.35, 0.15, roof)
    for (const f of faces(R)) {
      if (blocks.slice(0, 3).some((b) => inside(b.poly, [f.c[0] + f.o[0] * 0.5, f.c[1] + f.o[1] * 0.5]))) continue
      const ss = f.L > 7.5 ? [-2.4, 0, 2.4] : [0]
      for (const s of ss) {
        const c: XY = [f.c[0] + f.u[0] * s, f.c[1] + f.u[1] * s]
        oculus(win, c, f.u, f.o, 11.3, 0.6)
        window(win, c, f.u, f.o, { z0: 6.2, z1: 9.0, w: 1.3, head: 'segment' })
      }
    }
  }

  // The tower: four storeys on the railway side, pale; tall arched windows
  // and a row of oculi above the mill roof, a corbel table, crenellations.
  {
    const T = rect(-45.3, -5.1, -35.9, 4.3)
    softBox(pale, T, -BURY, 22.4, 0.35, null)
    // Corbel table: a band standing proud, pale trim under it.
    softBox(trim, inset(T, -0.35), 21.6, 22.3, 0.12, null)
    softBox(pale, inset(T, -0.35), 22.3, 24.2, 0.25, roof)
    merlons(pale, inset(T, -0.35), 24.0, 25.2, 4, 1.5, 0.7)
    for (const f of faces(T)) {
      const at = (s: number): XY => [f.c[0] + f.u[0] * s, f.c[1] + f.u[1] * s]
      for (const s of [-2.7, 0, 2.7]) window(win, at(s), f.u, f.o, { z0: 11.4, z1: 15.6, w: 1.25, head: 'round' })
      for (const s of [-2.7, 0, 2.7]) oculus(win, at(s), f.u, f.o, 17.7, 0.6)
      // Below the mill roof only the west face is open.
      if (f.o[0] < -0.9) for (const s of [-2.1, 2.1]) for (const r of [{ z0: 1.8, z1: 4.0 }, { z0: 5.4, z1: 9.0 }]) window(win, at(s), f.u, f.o, { ...r, w: 1.4, head: 'segment' })
    }
  }

  // The boiler house ruins (unpainted brick walls, roofless) and the stack stump.
  {
    const R = clean(RUINS), I = inset(R, 0.5)
    R.forEach((A, i) => {
      const B = R[(i + 1) % R.length], a = I[i], b = I[(i + 1) % R.length], h = 3.2
      quad(brick, [A[0], A[1], -BURY], [B[0], B[1], -BURY], [B[0], B[1], h], [A[0], A[1], h], [B[1] - A[1], A[0] - B[0], 0])
      quad(brick, [b[0], b[1], 0], [a[0], a[1], 0], [a[0], a[1], h], [b[0], b[1], h], [a[1] - b[1], b[0] - a[0], 0])
      quad(trim, [A[0], A[1], h], [B[0], B[1], h], [b[0], b[1], h], [a[0], a[1], h], [0, 0, 1])
    })
    stack(brick, [21.5, -40.0], 1.6, 1.35, -BURY, 12.2)
  }

  return {
    id: 'clt-highland-park-mill-3', name: 'Highland Park Mill No. 3', anchor: centroid(OUTLINE), height: 25.2,
    parts: [
      { part: pale, material: PAINT_PALE },
      { part: grey, material: PAINT_GREY },
      { part: roof, material: MILL_ROOF },
      { part: win, material: PALETTE.window },
      { part: trim, material: PALETTE.trim },
      { part: brick, material: BRICK },
    ],
  }
}

if (import.meta.main) await write(buildHighland())
