/**
 * Los Angeles Memorial Coliseum (1923, John and Donald Parkinson; press and
 * suite tower 2019) — procedural, CC0-1.0. bun generators/la-coliseum.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the field's long
 * axis runs east-west to within a degree, from the LARIAC footprint's
 * moments). The anchor is the area centroid of the grandstand's outer ring
 * (OSM relation/6100581, LARIAC 474901827615). y = 0 is the lowest ground
 * under the footprint as the map's terrain has it (53.5 m, USGS 3DEP).
 *
 * The bowl is sunk: the field is 13 m below the surrounding park (42 m in
 * the 2006 lidar), so only the upper part of the stands stands above
 * ground. The terrain model fills the bowl at street level, so the model
 * draws the stands from the cross-aisle at ground level up to the rim and
 * leaves the lower bowl and the field to the map.
 *
 * What makes it the Coliseum: the long oval of cardinal seats with its rim
 * banded cardinal and gold over a concrete wall of piers and openings; the
 * peristyle closing the east end, a colonnade of round arches either side
 * of the great central arch with the Olympic torch on top, between two tall
 * plain towers; the 2019 press and suite tower stacked over the south stands.
 *
 * Sources:
 * - Plan: LARIAC 2020 footprint 474901827615 (outer ring 321 × 233 m, the
 *   field opening 182 × 80 m), OSM relation/6100581 (building=grandstand,
 *   34.9 m), OSM way/174863998 and way/174863999 (the colonnade's end
 *   towers), USGS NAIP orthophoto (the 2019 tower's plan, aisles, colours).
 * - Heights: LA County 2006 lidar surface model, 4 m grid over the bowl and
 *   2 m over the peristyle, against 3DEP ground: rim 22.5 m above the map's
 *   ground all round; the east-end stands 9-10 m; central arch 24 m, torch
 *   36.5 m; colonnade 14 m; the two plain towers 30.5 m; the colonnade's
 *   end towers 16.5 m. The 2019 tower is 35 m (LARIAC 2020 maximum for the
 *   building; the 2006 lidar predates it), stepped back from the field.
 * - Photos (Wikimedia Commons): MikeJiroch's 2013 series of the exterior
 *   and peristyle (CC BY-SA 3.0; the wall, its bands, the arches);
 *   "LA Coliseum Dec 2022" and "LA Coliseum Dec 23 2022" (CanonStarGal,
 *   CC BY-SA 4.0; the peristyle from the west, square on);
 *   "LA Memorial Coliseum During Busch Light Clash" (Natecation, CC BY-SA
 *   4.0); "USC vs University of Oregon November 2019" (CanonStarGal, CC
 *   BY-SA 4.0) and "RamsvSeahawks2019" (PontiacAurora, CC BY-SA 4.0; the
 *   2019 tower); "LA Memorial Coliseum aerial view, August 2017" (Ron
 *   Reiring, CC BY 2.0).
 * - Estimated: the arch and colonnade proportions (from the square-on
 *   photos: seven arches a side; the central block 17.5 m wide, its arch
 *   7.2 m wide with the crown at 14.4 m), the dark panels standing for the
 *   arches' shadowed depth, the
 *   torch's shape, the 2019 tower's steps and glazing, the facade openings.
 * - Left out: the lower bowl and field (below the map's ground), the
 *   statues, flagpoles, light masts, scoreboard faces and signs.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const concrete = new Part(), seats = new Part(), gold = new Part(), glass = new Part(), white = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
function quad(p: Part, P: V3[], hint: V3) {
  const f = add(cross(sub(P[1], P[0]), sub(P[2], P[0])), cross(sub(P[2], P[0]), sub(P[3], P[0])))
  const ord = dot(f, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const t = (a: number, b: number, c: number) => {
    const A = P[ord[a]], B = P[ord[b]], C = P[ord[c]]
    if (Math.hypot(...cross(sub(B, A), sub(C, A))) < 1e-9) return
    p.tri(A, B, C)
  }
  t(0, 1, 2)
  t(0, 2, 3)
}
/** An axis-aligned box with a bevelled top edge; open underneath. */
function block(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part = p, bev = 0.4) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const ri: XY[] = [[x0 + bev, y0 + bev], [x1 - bev, y0 + bev], [x1 - bev, y1 - bev], [x0 + bev, y1 - bev]]
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4], ai = ri[i], bi = ri[(i + 1) % 4]
    const o: V3 = [(a[0] + b[0]) / 2 - (x0 + x1) / 2, (a[1] + b[1]) / 2 - (y0 + y1) / 2, 0]
    quad(p, [P(a, z0), P(b, z0), P(b, z1 - bev), P(a, z1 - bev)], o)
    quad(p, [P(a, z1 - bev), P(b, z1 - bev), P(bi, z1), P(ai, z1)], add(unit(o), [0, 0, 1]))
  }
  quad(top, [P(ri[0], z1), P(ri[1], z1), P(ri[2], z1), P(ri[3], z1)], [0, 0, 1])
}

// Survey coordinates are local metres about (-118.28779, 34.01392); the
// model's origin is the grandstand's centroid, 12.37 m west and 13.53 m north.
const O: XY = [-12.37, 13.53]
const P = ([x, y]: XY, z: number): V3 => [x - O[0], y - O[1], z]

// ---------------------------------------------------------------------------
// The bowl, as rays from the field's centre: superellipses for the field
// opening and the outer rim, the outer one cut off by the peristyle at the
// east end.
const C: XY = [-5.5, 13.6]
const se = (a: number, b: number, n: number, th: number) =>
  1 / Math.pow(Math.pow(Math.abs(Math.cos(th)) / a, n) + Math.pow(Math.abs(Math.sin(th)) / b, n), 1 / n)
const X_PERI = 127 // back of the east-end stands, behind the colonnade
const rIn = (th: number) => se(91, 40.2, 3.2, th)
const rOut = (th: number) => {
  const r = se(174, 115.5, 2.2, th)
  const c = Math.cos(th)
  return c > 0 ? Math.min(r, (X_PERI - C[0]) / c) : r
}
const DEG = Math.PI / 180
const RIM = 22.5, FIELD = -11.5, EAST = 10
/** Rim height: 22.5 m all round, down to the 10 m east-end stands under the peristyle. */
const H = (th: number) => {
  const a = Math.abs(Math.atan2(Math.sin(th), Math.cos(th))) / DEG
  if (a <= 21) return EAST
  if (a >= 29) return RIM
  return EAST + ((a - 21) / 8) * (RIM - EAST)
}
const N = 96
const thAt = (k: number) => (k / N) * 2 * Math.PI
/** A point on the seat surface at fraction t from the field wall to the rim. */
const seat = (th: number, t: number, dz = 0): V3 => {
  const r = rIn(th) + (rOut(th) - rIn(th)) * t
  return P([C[0] + Math.cos(th) * r, C[1] + Math.sin(th) * r], FIELD + (H(th) - FIELD) * t + dz)
}
const tGround = (th: number) => -FIELD / (H(th) - FIELD) // where the seats come up through the map's ground
const outward = (th: number): V3 => [Math.cos(th), Math.sin(th), 0]

for (let k = 0; k < N; k++) {
  const a = thAt(k), b = thAt(k + 1), m = (a + b) / 2
  // the marathon tunnel under the central arch: no stands in front of it
  if (Math.abs(Math.atan2(Math.sin(m), Math.cos(m))) < 4.2 * DEG) continue
  const o = outward(m)
  const inn = mul(o, -1)
  const ta = tGround(a), tb = tGround(b)
  // cross-aisle at ground level, then the seats, a top walkway, the parapet
  const W = 0.035, TW = 0.94
  const lift = (th: number, t: number): V3 => { const p = seat(th, t); return [p[0], p[1], Math.max(p[2], 0.25)] }
  quad(concrete, [lift(a, ta - W), lift(b, tb - W), lift(b, tb), lift(a, ta)], [0, 0, 1])
  quad(seats, [lift(a, ta), lift(b, tb), seat(b, TW), seat(a, TW)], add(inn, [0, 0, 1]))
  quad(concrete, [seat(a, TW), seat(b, TW), seat(b, 1), seat(a, 1)], add(inn, [0, 0, 1]))
  quad(concrete, [seat(a, 1), seat(b, 1), seat(b, 1, 1.1), seat(a, 1, 1.1)], inn)
  quad(concrete, [seat(a, 1, 1.1), seat(b, 1, 1.1), seat(b, 1.004, 1.1), seat(a, 1.004, 1.1)], [0, 0, 1])
  // Outer wall, except where the peristyle stands in front of it.
  if (Math.abs(Math.atan2(Math.sin(m), Math.cos(m))) < 30 * DEG) {
    quad(concrete, [seat(a, 1.004, 0), seat(b, 1.004, 0), seat(b, 1.004, 1.1), seat(a, 1.004, 1.1)].map((p, i) => i < 2 ? [p[0], p[1], 0] as V3 : p), o)
    continue
  }
  const h = H(m) + 1.1
  const wa = (z: number, f = 0, d = 0): V3 => {
    const p = seat(a, 1.004), q = seat(b, 1.004)
    return [p[0] + (q[0] - p[0]) * f + o[0] * d, p[1] + (q[1] - p[1]) * f + o[1] * d, z]
  }
  // Cardinal and gold bands round the top of the wall, as painted.
  quad(seats, [wa(h - 2.1), wa(h - 2.1, 1), wa(h, 1), wa(h)], o)
  quad(gold, [wa(h - 3.0), wa(h - 3.0, 1), wa(h - 2.1, 1), wa(h - 2.1)], o)
  // Concrete wall of piers with two tiers of tall openings, a bay every two
  // segments (about 9 m), each opening straddling the segments' joint.
  quad(concrete, [wa(0), wa(0, 1), wa(h - 3.0, 1), wa(h - 3.0)], o)
  const [f0, f1] = k % 2 ? [0, 0.62] : [0.38, 1]
  quad(glass, [wa(1.5, f0, 0.05), wa(1.5, f1, 0.05), wa(8.5, f1, 0.05), wa(8.5, f0, 0.05)], o)
  quad(glass, [wa(11, f0, 0.05), wa(11, f1, 0.05), wa(17, f1, 0.05), wa(17, f0, 0.05)], o)
}

// ---------------------------------------------------------------------------
// The peristyle. The central arch tower carries the torch; seven round
// arches a side run along a gentle arc to the two end towers, and two tall
// plain towers stand just behind it.
const PY = 15 // its axis, a little north of the field's
const ARC_C: XY = [-35, PY], ARC_R = 170
const arcPt = (s: number, d = 0): XY => { // s: arc length from the axis, + north; d: outward offset
  const th = s / ARC_R
  return [ARC_C[0] + (ARC_R + d) * Math.cos(th), ARC_C[1] + (ARC_R + d) * Math.sin(th)]
}
const COL_H = 14, DEPTH = 6, ARCH_W = 4.6, SPRING = 8.2, ARCHES = 7, BAY = 6.6
const S0 = 8.75 // the arcades start at the central tower's side
for (const sg of [1, -1]) {
  for (let i = 0; i < ARCHES; i++) {
    const s0 = sg * (S0 + i * BAY), s1 = sg * (S0 + (i + 1) * BAY)
    const lo = Math.min(s0, s1), hi = Math.max(s0, s1)
    const mid = (lo + hi) / 2, half = ARCH_W / 2
    for (const d of [DEPTH / 2, -DEPTH / 2]) {
      const face = (s: number, z: number): V3 => P(arcPt(s, d), z)
      const n = d > 0 ? 1 : -1
      const o: V3 = (() => { const [x, y] = arcPt(mid, 0); return [n * (x - ARC_C[0]), n * (y - ARC_C[1]), 0] })()
      // piers and the wall over the arch
      quad(white, [face(lo, 0), face(mid - half, 0), face(mid - half, COL_H), face(lo, COL_H)], o)
      quad(white, [face(mid + half, 0), face(hi, 0), face(hi, COL_H), face(mid + half, COL_H)], o)
      const SEGS = 8
      for (let j = 0; j < SEGS; j++) {
        const a0 = Math.PI - (j * Math.PI) / SEGS, a1 = Math.PI - ((j + 1) * Math.PI) / SEGS
        const u0 = mid + half * Math.cos(a0), u1 = mid + half * Math.cos(a1)
        quad(white, [face(u0, SPRING + half * Math.sin(a0)), face(u1, SPRING + half * Math.sin(a1)), face(u1, COL_H), face(u0, COL_H)], o)
      }
    }
    // the arch's soffit and jambs, and the roof over the bay
    const thr = (s: number, z: number, d: number): V3 => P(arcPt(s, d), z)
    const SEGS = 8
    for (let j = 0; j < SEGS; j++) {
      const a0 = Math.PI - (j * Math.PI) / SEGS, a1 = Math.PI - ((j + 1) * Math.PI) / SEGS
      const u0 = mid + half * Math.cos(a0), u1 = mid + half * Math.cos(a1)
      const z0 = SPRING + half * Math.sin(a0), z1 = SPRING + half * Math.sin(a1)
      quad(white, [thr(u0, z0, DEPTH / 2), thr(u1, z1, DEPTH / 2), thr(u1, z1, -DEPTH / 2), thr(u0, z0, -DEPTH / 2)], [0, 0, -1])
    }
    for (const s of [mid - half, mid + half]) {
      const t = s < mid ? 1 : -1
      const [x0, y0] = arcPt(s, 0), [x1, y1] = arcPt(s + 0.1 * t, 0)
      quad(white, [thr(s, 0, DEPTH / 2), thr(s, 0, -DEPTH / 2), thr(s, SPRING, -DEPTH / 2), thr(s, SPRING, DEPTH / 2)], [x1 - x0, y1 - y0, 0])
    }
    quad(white, [thr(lo, COL_H, DEPTH / 2), thr(hi, COL_H, DEPTH / 2), thr(hi, COL_H, -DEPTH / 2), thr(lo, COL_H, -DEPTH / 2)], [0, 0, 1])
    // the arcade's shadowed depth: a dark panel in each arch, mid-depth
    {
      const M = (u: number, z: number): V3 => P(arcPt(u, 0), z)
      const [xa, ya] = arcPt(mid, 0)
      const out: V3 = [xa - ARC_C[0], ya - ARC_C[1], 0]
      for (const f of [out, mul(out, -1)]) {
        quad(glass, [M(mid - half, 0), M(mid + half, 0), M(mid + half, SPRING), M(mid - half, SPRING)], f)
        for (let j = 0; j < SEGS; j++) {
          const a0 = Math.PI - (j * Math.PI) / SEGS, a1 = Math.PI - ((j + 1) * Math.PI) / SEGS
          const A = M(mid + half * Math.cos(a0), SPRING + half * Math.sin(a0)), B = M(mid + half * Math.cos(a1), SPRING + half * Math.sin(a1)), Cc = M(mid, SPRING)
          if (dot(cross(sub(A, Cc), sub(B, Cc)), f) >= 0) glass.tri(Cc, A, B)
          else glass.tri(Cc, B, A)
        }
      }
    }
  }
  // end tower (OSM way/174863998, way/174863999) closing the arcade
  const sEnd = sg * (S0 + ARCHES * BAY)
  const [ex, ey] = arcPt(sEnd + sg * 3.5, 0)
  block(white, ex - 4, ex + 4, ey - 3.5, ey + 3.5, 0, 16.5)
  // the tall plain towers behind (lidar 30.5 m)
  const ty = PY + sg * 27
  block(white, 126, 131.5, ty - 6, ty + 6, 0, 30.5)
}

// Central arch tower: a broad block with one great round arch right through
// it, east to west, narrowing in a step at 19 m to the lettered upper block
// (lidar top 24 m), a stepped attic, and the torch on top. Proportions from
// the square-on photos: the block about 0.7 as wide as it is tall, the arch
// 0.4 of its width with its crown at 0.6 of its height.
{
  const x0 = 130, x1 = 141, HW = 8.75, ZL = 19, ZT = 24, AW = 3.6, AS = 10.8
  const y0 = PY - HW, y1 = PY + HW
  const segs = 10
  const arc = (j: number) => Math.PI - (j * Math.PI) / segs
  for (const x of [x0, x1]) {
    const o: V3 = [x === x0 ? -1 : 1, 0, 0]
    const F = (y: number, z: number): V3 => P([x, y], z)
    quad(white, [F(y0, 0), F(PY - AW, 0), F(PY - AW, ZL), F(y0, ZL)], o)
    quad(white, [F(PY + AW, 0), F(y1, 0), F(y1, ZL), F(PY + AW, ZL)], o)
    for (let j = 0; j < segs; j++) {
      const a0 = arc(j), a1 = arc(j + 1)
      quad(white, [F(PY + AW * Math.cos(a0), AS + AW * Math.sin(a0)), F(PY + AW * Math.cos(a1), AS + AW * Math.sin(a1)), F(PY + AW * Math.cos(a1), ZL), F(PY + AW * Math.cos(a0), ZL)], o)
    }
  }
  for (let j = 0; j < segs; j++) {
    const a0 = arc(j), a1 = arc(j + 1)
    const S = (x: number, a: number): V3 => P([x, PY + AW * Math.cos(a)], AS + AW * Math.sin(a))
    quad(white, [S(x0, a0), S(x1, a0), S(x1, a1), S(x0, a1)], [0, 0, -1])
  }
  for (const y of [y0, y1]) quad(white, [P([x0, y], 0), P([x1, y], 0), P([x1, y], ZL), P([x0, y], ZL)], [0, y === y0 ? -1 : 1, 0])
  for (const y of [PY - AW, PY + AW]) quad(white, [P([x0, y], 0), P([x1, y], 0), P([x1, y], AS), P([x0, y], AS)], [0, y < PY ? 1 : -1, 0])
  quad(white, [P([x0, y0], ZL), P([x1, y0], ZL), P([x1, y1], ZL), P([x0, y1], ZL)], [0, 0, 1])
  // the arch's shadowed depth, as a dark panel across its middle
  {
    const xm = (x0 + x1) / 2
    const M = (y: number, z: number): V3 => P([xm, y], z)
    quad(glass, [M(PY - AW, 0), M(PY + AW, 0), M(PY + AW, AS), M(PY - AW, AS)], [-1, 0, 0])
    for (let j = 0; j < segs; j++) {
      const a0 = arc(j), a1 = arc(j + 1)
      const A = M(PY + AW * Math.cos(a0), AS + AW * Math.sin(a0)), B = M(PY + AW * Math.cos(a1), AS + AW * Math.sin(a1)), Cc = M(PY, AS)
      glass.tri(Cc, A, B); glass.tri(Cc, B, A)
    }
    quad(glass, [M(PY - AW, AS), M(PY + AW, AS), M(PY + AW, 0), M(PY - AW, 0)], [1, 0, 0])
  }
  // upper block, stepped attic
  block(white, x0 + 0.8, x1 - 0.8, PY - 6.2, PY + 6.2, ZL, ZT)
  block(white, x0 + 2, x1 - 2, PY - 4.2, PY + 4.2, ZT, ZT + 1.6)
  block(white, x0 + 3.2, x1 - 3.2, PY - 2.9, PY + 2.9, ZT + 1.6, ZT + 2.8)
  // the torch: a tapering shaft carrying the bronze bowl (lidar 36.5 m)
  const cx = (x0 + x1) / 2
  const sq = (h: number, z: number): V3[] => [P([cx - h, PY - h], z), P([cx + h, PY - h], z), P([cx + h, PY + h], z), P([cx - h, PY + h], z)]
  const ring = (p: Part, h0: number, z0: number, h1: number, z1: number) => {
    const A = sq(h0, z0), B = sq(h1, z1)
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      quad(p, [A[i], A[j], B[j], B[i]], sub(add(A[i], A[j]), [2 * (cx - O[0]), 2 * (PY - O[1]), A[i][2] + A[j][2]]))
    }
  }
  ring(white, 2.0, ZT + 2.8, 1.4, 33.6)
  ring(gold, 1.4, 33.6, 2.7, 35.8)
  ring(gold, 2.7, 35.8, 2.7, 36.5)
  quad(gold, sq(2.7, 36.5), [0, 0, 1])
}

// ---------------------------------------------------------------------------
// The 2019 press and suite tower over the south stands (NAIP plan), stepped
// back from the field in three tiers, with glazed suite floors facing the
// field, up to 35 m.
{
  // Between the bowl's rays at -132° and -67°, in three tiers by fraction t
  // of the way from the field wall to the rim: (t front, t back, top).
  const A0 = -132 * DEG, A1 = -67 * DEG, K = 12
  const tiers: [number, number, number, number][] = [[0.42, 0.55, 17, 9], [0.55, 0.735, 27.5, 17], [0.735, 1.004, 35, 27.5]]
  const at = (th: number, t: number, z: number): V3 => {
    const r = rIn(th) + (rOut(th) - rIn(th)) * t
    return P([C[0] + Math.cos(th) * r, C[1] + Math.sin(th) * r], z)
  }
  for (const [tf, tb, zt, zg] of tiers) {
    for (let k = 0; k < K; k++) {
      const a = A0 + ((A1 - A0) * k) / K, b = A0 + ((A1 - A0) * (k + 1)) / K
      const o = outward((a + b) / 2)
      quad(white, [at(a, tf, 0), at(b, tf, 0), at(b, tf, zt), at(a, tf, zt)], mul(o, -1))
      quad(glass, [at(a, tf - 0.003, zg + 1.2), at(b, tf - 0.003, zg + 1.2), at(b, tf - 0.003, zt - 1.6), at(a, tf - 0.003, zt - 1.6)], mul(o, -1))
      quad(white, [at(a, tf, zt), at(b, tf, zt), at(b, tb, zt), at(a, tb, zt)], [0, 0, 1])
      if (tb > 1) quad(white, [at(a, tb, 0), at(b, tb, 0), at(b, tb, zt), at(a, tb, zt)], o)
    }
    for (const th of [A0, A1]) {
      const t: V3 = [-Math.sin(th), Math.cos(th), 0]
      quad(white, [at(th, tf, 0), at(th, tb, 0), at(th, tb, zt), at(th, tf, zt)], th === A0 ? mul(t, -1) : t)
    }
  }
}

// ---------------------------------------------------------------------------
// Palette: the bowl's concrete a pale warm grey, as in the daylight photos,
// so the peristyle's cream (`trim`) stands out against it; the seats and the rim band the
// Coliseum's cardinal and gold, pulled to palette lightness; the peristyle,
// the plain towers and the 2019 tower `trim`; openings and glass `window`.
const parts = [
  { part: concrete, material: finish('coliseum-concrete', 0xd8d2c7) },
  { part: seats, material: finish('coliseum-cardinal', 0xb36a62) },
  { part: gold, material: finish('coliseum-gold', 0xe0b85a) },
  { part: white, material: PALETTE.trim },
  { part: glass, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Los Angeles Memorial Coliseum', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 0, osm: 'relation/6100581',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/la-coliseum.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
