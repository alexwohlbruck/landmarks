/**
 * Shared kit for the Golden Gate Park models (sf-de-young, sf-cal-academy,
 * sf-conservatory-of-flowers, sf-spreckels-temple-of-music,
 * sf-dutch-windmill). The de Young's own geometry is further down, under
 * `import.meta.main`, so importing the kit builds nothing.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const DEYOUNG_REPLACES = ['relation/1652482', 'way/444230154', 'way/1418750068', 'way/1418750069', 'way/1418750070', 'way/1418750071', 'way/1418750072', 'way/1418750073', 'way/1418972816', 'way/1418972817']

export type XY = [number, number]
const UP: V3 = [0, 0, 1]
export const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const crossV = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

/** Signed area, > 0 when counter-clockwise. */
export const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
export const ccw = (r: XY[]) => (area(r) > 0 ? r : [...r].reverse())

/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
export function earcut(ring: XY[]): [number, number, number][] {
  const idx = ring.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 20000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = ring[i0], b = ring[i1], c = ring[i2]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(ring[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1) // degenerate remainder: drop a collinear point
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** Mitred offset of a counter-clockwise ring; d > 0 grows it. */
export function offset(ring: XY[], d: number): XY[] {
  return ring.map((b, i) => {
    const a = ring[(i + ring.length - 1) % ring.length], c = ring[(i + 1) % ring.length]
    const u = unit([b[1] - a[1], a[0] - b[0], 0]), v = unit([c[1] - b[1], b[0] - c[0], 0])
    const k = Math.max(0.35, 1 + u[0] * v[0] + u[1] * v[1])
    return [b[0] + ((u[0] + v[0]) * d) / k, b[1] + ((u[1] + v[1]) * d) / k]
  })
}

/** A flat polygon (any simple ring) at height z, facing up or down. */
export function flat(p: Part, ring0: XY[], z: number, up = true) {
  const ring = ccw(ring0)
  const n: V3 = up ? UP : [0, 0, -1]
  for (const [i, j, k] of earcut(ring)) {
    const a: V3 = [...ring[i], z], b: V3 = [...ring[j], z], c: V3 = [...ring[k], z]
    if (up) p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
    else p.tri(c, b, a, undefined, undefined, undefined, [n, n, n])
  }
}

/**
 * A prism over a ring: walls from z0 to z1 on `wall`, the roof on `top`.
 * `bevel` chamfers the top edge inward (a soft edge that catches the light).
 */
export function prism(wall: Part, ring0: XY[], z0: number, z1: number, top: Part | null = wall, bevel = 0, bottom = false) {
  const ring = ccw(ring0), n = ring.length
  const zw = bevel > 0 ? z1 - bevel : z1
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    wall.quad([...a, z0], [...b, z0], [...b, zw], [...a, zw])
  }
  let lid = ring
  if (bevel > 0) {
    lid = offset(ring, -bevel)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      wall.quad([...ring[i], zw], [...ring[j], zw], [...lid[j], z1], [...lid[i], z1])
    }
  }
  if (top) flat(top, lid, z1)
  if (bottom) flat(wall, ring, z0, false)
}

/** Smooth surface of revolution through (r, z) profile points, bottom to top, about c. */
export function lathe(p: Part, prof: [number, number][], n = 16, c: XY = [0, 0], a0 = 0, smooth = true) {
  const nrm = prof.map((_, k) => {
    const a = prof[Math.max(0, k - 1)], b = prof[Math.min(prof.length - 1, k + 1)]
    const dr = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dr, dz) || 1
    return [dz / l, -dr / l] as [number, number]
  })
  const ang = (i: number) => a0 + (2 * Math.PI * i) / n
  const Pt = (r: number, z: number, t: number): V3 => [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t), z]
  const N = (k: number, t: number): V3 => [nrm[k][0] * Math.cos(t), nrm[k][0] * Math.sin(t), nrm[k][1]]
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    for (let i = 0; i < n; i++) {
      const t0 = ang(i), t1 = ang(i + 1)
      const a = Pt(r0, z0, t0), b = Pt(r0, z0, t1), cc = Pt(r1, z1, t1), d = Pt(r1, z1, t0)
      const nm = smooth ? undefined : null
      if (r0 > 1e-6) p.tri(a, b, cc, undefined, undefined, undefined, nm === null ? undefined : [N(k, t0), N(k, t1), N(k + 1, t1)])
      if (r1 > 1e-6) p.tri(a, cc, d, undefined, undefined, undefined, nm === null ? undefined : [N(k, t0), N(k + 1, t1), N(k + 1, t0)])
    }
  }
}

/** A rectangular member from a to b: w across (horizontal where it can be), h the other way; capped. */
export function beam(p: Part, a: V3, b: V3, w: number, h = w, ref: V3 = UP) {
  const u = unit([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
  const r0 = Math.abs(u[0] * ref[0] + u[1] * ref[1] + u[2] * ref[2]) > 0.95 ? ([1, 0, 0] as V3) : ref
  const s = unit(crossV(u, r0)), t = crossV(s, u)
  const C = (o: V3, i: number): V3 => {
    const [cs, ct] = [[-1, -1], [1, -1], [1, 1], [-1, 1]][i]
    return [o[0] + s[0] * (w / 2) * cs + t[0] * (h / 2) * ct, o[1] + s[1] * (w / 2) * cs + t[1] * (h / 2) * ct, o[2] + s[2] * (w / 2) * cs + t[2] * (h / 2) * ct]
  }
  const A = [0, 1, 2, 3].map((i) => C(a, i)), B = [0, 1, 2, 3].map((i) => C(b, i))
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; p.quad(A[i], A[j], B[j], B[i]) }
  p.quad(A[3], A[2], A[1], A[0]); p.quad(B[0], B[1], B[2], B[3])
}

/** A box given its centre, half sizes along its own x/y and z, turned `rot` radians about z. */
export function box(p: Part, c: V3, hx: number, hy: number, hz: number, rot = 0, top: Part | null = p, bevel = 0) {
  const cs = Math.cos(rot), sn = Math.sin(rot)
  const ring: XY[] = [[-hx, -hy], [hx, -hy], [hx, hy], [-hx, hy]].map(([x, y]) => [c[0] + x * cs - y * sn, c[1] + x * sn + y * cs])
  prism(p, ring, c[2] - hz, c[2] + hz, top, bevel, true)
}

/** A flat polygon in a vertical or sloped plane: points given in the plane's (s, t) frame. */
export function planar(p: Part, o: V3, su: V3, tv: V3, pts: XY[], both = false) {
  const ring = ccw(pts)
  const W = (q: XY): V3 => [o[0] + su[0] * q[0] + tv[0] * q[1], o[1] + su[1] * q[0] + tv[1] * q[1], o[2] + su[2] * q[0] + tv[2] * q[1]]
  for (const [i, j, k] of earcut(ring)) {
    p.tri(W(ring[i]), W(ring[j]), W(ring[k]))
    if (both) p.tri(W(ring[k]), W(ring[j]), W(ring[i]))
  }
}

/** A regular polygon ring. */
export const ngon = (cx: number, cy: number, r: number, n: number, a0 = 0): XY[] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos(a0 + (2 * Math.PI * i) / n), cy + r * Math.sin(a0 + (2 * Math.PI * i) / n)] as XY)

export function report(name: string, parts: Array<{ part: Part }>, glb: Uint8Array, limit = 5000) {
  const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > limit) throw new Error(`${name}: triangle budget exceeded: ${triangles}`)
  if (glb.length > 256000) throw new Error(`${name}: file budget exceeded: ${glb.length}`)
  return triangles
}

export { writeGlb }


/**
 * Triangles covering a polygon with holes, by cutting it into horizontal
 * bands at every vertex and pairing the edges that cross each band. Rings
 * may wind either way; they must not cross each other.
 */
export function bandTris(rings: XY[][]): [XY, XY, XY][] {
  const edges: [XY, XY][] = []
  for (const r of rings) for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (Math.abs(a[1] - b[1]) > 1e-9) edges.push(a[1] < b[1] ? [a, b] : [b, a])
  }
  const ys = [...new Set(rings.flat().map((p) => +p[1].toFixed(6)))].sort((a, b) => a - b)
  const out: [XY, XY, XY][] = []
  const xAt = ([a, b]: [XY, XY], y: number) => a[0] + ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1])
  for (let k = 0; k < ys.length - 1; k++) {
    const ya = ys[k], yb = ys[k + 1], ym = (ya + yb) / 2
    const cut = edges.filter(([a, b]) => a[1] <= ym && b[1] >= ym).map((e) => ({ a: xAt(e, ya), b: xAt(e, yb), m: xAt(e, ym) }))
    cut.sort((p, q) => p.m - q.m)
    for (let i = 0; i + 1 < cut.length; i += 2) {
      const l = cut[i], r = cut[i + 1]
      const p0: XY = [l.a, ya], p1: XY = [r.a, ya], p2: XY = [r.b, yb], p3: XY = [l.b, yb]
      if (r.a - l.a > 1e-6) out.push([p0, p1, p2])
      if (r.b - l.b > 1e-6) out.push([p0, p2, p3])
    }
  }
  return out
}

/** Split triangles along vertical lines x = cuts, so a roof bent along them stays planar per piece. */
export function splitX(tris: [XY, XY, XY][], cuts: number[]): [XY, XY, XY][] {
  let cur = tris
  for (const c of cuts) {
    const next: [XY, XY, XY][] = []
    for (const t of cur) {
      const side = t.map((p) => p[0] - c)
      if (side.every((s) => s >= -1e-9) || side.every((s) => s <= 1e-9)) { next.push(t); continue }
      // clip the triangle into the two half-planes; each piece is convex
      for (const sgn of [1, -1]) {
        const poly: XY[] = []
        for (let i = 0; i < 3; i++) {
          const a = t[i], b = t[(i + 1) % 3], sa = sgn * (a[0] - c), sb = sgn * (b[0] - c)
          if (sa >= 0) poly.push(a)
          if ((sa >= 0) !== (sb >= 0)) { const u = sa / (sa - sb); poly.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]) }
        }
        for (let i = 1; i + 1 < poly.length; i++) next.push([poly[0], poly[i], poly[i + 1]])
      }
    }
    cur = next
  }
  return cur
}

/** Point-in-polygon (even-odd). */
export function inside(p: XY, ring: XY[]) {
  let c = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i], b = ring[j]
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c
  }
  return c
}

// ---------------------------------------------------------------------------
// de Young Museum — original procedural geometry, CC0-1.0.
// bun generators/sf-de-young.ts
//
// Map frame: x east, y north, z up, metres, built turned to bearing 317.8:
// +x runs along the museum's long axis (bearing 47.8), the Hamon tower at the
// +x (north-east) end. Origin = centroid of OSM relation/1652482.
//
// Evidence
// - OSM relation/1652482 (building=museum, height 13): the outline and five
//   inner rings (the light wells); building:parts way/444230154 (the tower's
//   base, "Hamon Tower") and the stacked tower floors way/1418750068-73,
//   1418972816-17 (13-51 m), whose plans keep their short ends parallel to
//   the museum while the long sides turn about 30 degrees.
// - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 1 m: the roof is a
//   147 x 78 m rectangle; the sunken walk along the north side, 69.9 m NAVD88,
//   is y = 0 (the concourse side is ~+6); the roof a shallow ridge, +16.9 at
//   the west end, +20.5 at x = -22, +17.2 at the east end; three light wells
//   and the slot under the tower's south end (positions from the lidar; OSM's
//   inner rings agree to 2-4 m); a plant box +22.6 at x 26-40; the tower's
//   cap roof +48.7 inside a rim at +50.0 (published 144 ft above the street),
//   its outline a parallelogram (south end x 53-66, north end x 69.5-82);
//   the west face leaning out under it, from x ~61 at the roof to ~67 at the
//   top, as the stacked OSM parts do.
// - USGS NAIP: the skylight strips on the roof (shifted 4 m to the lidar).
// - Published (Wikipedia; Herzog & de Meuron): 2005; perforated and dimpled
//   copper skin, weathering brown; the Hamon Observation Tower with a glazed
//   observation floor under its cap.
// - Commons daylight photos: "De Young Museum pano.jpg" (WolfmanSF, CC BY-SA
//   3.0, the south front and tower); "Hamon Tower.jpg" (Amadscientist, public
//   domain); "Hamon Tower De Young Museum 2009-02.jpg" (Helder Ribeiro, CC
//   BY-SA 2.0); "Hamon Tower, De Young Museum 2.JPG" (BrokenSphere, CC BY-SA
//   3.0); "De Young Museum roof from Hamon Observation Tower 01.jpg" (Joe
//   Mabel, CC BY 4.0, the roof, wells and skylights); "De Young Museum (2)
//   (21043282819).jpg" (Luiz Pantoja, CC BY 2.0, the copper, the café).
//
// Estimated: the tower's body under the cap (lidar sees only the cap and the
// north-west face) — a ruled loft from the base plan to the cap, in five
// bands that step back at each band as the photos' sawtooth corners do, with
// window ribbons under two; the observation glass band (+41.9 to +44.0) from
// the photos' proportions; ground-floor glazing positions; the roof's folds
// and grooves are left out. The copper is pulled to the palette's lightness;
// the roof reads grey from above.
// ---------------------------------------------------------------------------
function buildDeYoung() {
  // Everything below is first written in a frame centred on the roof's
  // rectangle (as the lidar measures it) and shifted to the anchor at the end.
  const O: XY = [0.66, 1.34] // the outline's centroid in that frame
  const T = (p: XY): XY => [p[0] - O[0], p[1] - O[1]]
  const copper = new Part(), roofTop = new Part(), win = new Part(), sky = new Part()

  // --- heights above y = 0 (69.9 m NAVD88, the sunken north walk) ---
  // Roof: a shallow ridge across the plan, 16.9 m at the west end, 20.5 m at
  // x = -22, 17.2 m at the east end (lidar, ±0.3 m).
  const roofZ = (x: number) => (x <= -22 ? 16.9 + ((x + 72.5) * (20.5 - 16.9)) / 50.5 : 20.5 + ((x + 22) * (17.2 - 20.5)) / 97.5)
  const FASCIA = 1.0

  // --- plan (rectangle frame) ---
  const W0 = -72.5, W1 = 75.5, S = -38.6, N = 38.6
  const TW0 = 61, TW1 = 72.5, TS = 10.3, TN = 38 // tower base
  // The outline: the long rectangle less the slot notched into its east end
  // (open to the sky, under the tower's south end) and the tower's own plan.
  const outline: XY[] = [[W0, S], [W1, S], [W1, 2.8], [32, 3.9], [14, 8.9], [TW0, 8.9], [TW0, N], [W0, N]]
  const holes: XY[][] = [
    // Light wells, from the lidar (they agree with OSM's inner rings to 2-4 m)
    [[-63.5, 14.8], [-56, 9.6], [-35, 9.6], [-8, 10.8], [-27, 14.8]],
    [[-66, -7.5], [-66, -20.5], [-60, -20.5], [-46, -17.5], [-27, -14.5], [-46, -9.5]],
    [[33, -7.5], [25.5, -9], [23, -17], [28, -20.5], [37, -21.5], [43, -19.5], [50, -16.5], [59.5, -14], [52, -10], [40, -7.5]],
  ]

  // Roof top surface
  const tris = splitX(bandTris([outline, ...holes]), [-22])
  for (const [a, b, c] of tris) {
    const P = (p: XY): V3 => [...T(p), roofZ(p[0])]
    roofTop.tri(P(a), P(b), P(c))
  }
  // Walls: the outline's walls carry the fascia; light-well walls drop to the ground.
  const wallRing = (ring: XY[], z0: number, part: Part) => {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      // split long edges so the bent roof line is followed
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / 25))
      for (let k = 0; k < n; k++) {
        const p = [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n] as XY
        const q = [a[0] + ((b[0] - a[0]) * (k + 1)) / n, a[1] + ((b[1] - a[1]) * (k + 1)) / n] as XY
        part.quad([...T(p), z0], [...T(q), z0], [...T(q), roofZ(q[0])], [...T(p), roofZ(p[0])])
      }
    }
  }
  wallRing(ccw(outline), 0, copper)
  for (const h of holes) wallRing([...ccw(h)].reverse(), 0, copper) // facing into the well
  // the ridge must also split wall edges that cross x = -22; long edges were split every 25 m
  // and the error is under 0.3 m, so the wall tops are re-joined to the roof below by the fascia.

  // Skylight strips on the roof (NAIP, shifted 4 m south to the lidar's frame)
  const skylights: [number, number, number, number][] = [
    [-46, 12, 31.3, 35.0],
    [-26, -15, -0.3, 1.5],
    [-40, 8, -7.8, -4],
    [-30, 0, -14, -10.3],
    [-24, 0, -22.8, -20.3],
    [-40, -2, -30.2, -26.5],
    [-40, -2, -37, -34],
  ]
  for (const [x0, x1, y0, y1] of skylights) {
    const cutsAt = [x0, ...(x0 < -22 && x1 > -22 ? [-22] : []), x1]
    for (let i = 0; i + 1 < cutsAt.length; i++) {
      const a = cutsAt[i], b = cutsAt[i + 1]
      const P = (x: number, y: number): V3 => [...T([x, y]), roofZ(x) + 0.06]
      sky.quad(P(a, y0), P(b, y0), P(b, y1), P(a, y1))
    }
  }

  // A plant-room box on the roof (lidar: 2-4 m above the roof at x 26-40)
  prism(copper, [[26, 22], [40, 22], [40, 27], [26, 27]].map((p) => T(p as XY)), 15, 22.6, roofTop, 0.3)

  // Ground-floor glazing, recessed under the copper (photos: south front and the east end café)
  const southGlass: [number, number][] = [[-62, -47], [-27, -12], [18, 46]]
  for (const [x0, x1] of southGlass) {
    const P = (x: number, z: number): V3 => [...T([x, S - 0.05]), z]
    win.quad(P(x0, 6.2), P(x1, 6.2), P(x1, 10.4), P(x0, 10.4))
  }
  {
    const P = (y: number, z: number): V3 => [...T([W1 + 0.05, y]), z]
    win.quad(P(-32, 6.2), P(-6, 6.2), P(-6, 10.4), P(-32, 10.4))
  }

  // --- The Hamon tower ---
  // Plan at each level: a parallelogram whose short ends stay parallel to the
  // museum (y = 10.3 and y = 38) while its long sides turn 30 degrees, so the
  // top's long faces run close to north-south. Lidar: the cap's outline,
  // and the west face's lean under it.
  const Z_BODY = 17.5, Z_GLASS = 41.9, Z_CAP = 44.0, Z_CAPROOF = 48.7, Z_RIM = 50.0
  type Plan = [number, number, number, number] // south end x0, x1; north end x0, x1
  const base: Plan = [TW0, TW1, TW0, TW1]
  const top: Plan = [53.8, 65.3, 70.2, 81.7]
  const capP: Plan = [53.0, 66.0, 69.5, 82.0]
  const mix = (a: Plan, b: Plan, t: number): Plan => a.map((v, i) => v + (b[i] - v) * t) as Plan
  const ring = (p: Plan, z: number, grow = 0): V3[] => {
    const s0 = TS - grow, s1 = TN + grow
    return [[p[0] - grow, s0], [p[1] + grow, s0], [p[3] + grow, s1], [p[2] - grow, s1]].map((q) => [...T(q as XY), z] as V3)
  }
  // lower body, straight up from the ground on the north walk
  copper.loft([ring(base, 0), ring(base, Z_BODY)])
  // The leaning body: five stacked bands, each leaning out a little more than
  // the tower as a whole, so the corners step back at every band (photos:
  // the sawtooth edges); a window ribbon runs under two of the steps.
  const levels = [Z_BODY, 22.4, 27.3, 32.2, 37.1, Z_GLASS]
  const tOf = (z: number) => (z - Z_BODY) / (Z_GLASS - Z_BODY)
  const STEP = 0.8
  for (let k = 0; k + 1 < levels.length; k++) {
    const z0 = levels[k], z1 = levels[k + 1]
    const lo = ring(mix(base, top, tOf(z0)), z0, k ? -STEP : 0), hi = ring(mix(base, top, tOf(z1)), z1)
    if (k === 2 || k === 4) {
      const zr = z0 + 1.1, tr = (zr - z0) / (z1 - z0)
      const mid = lo.map((p, i) => [p[0] + (hi[i][0] - p[0]) * tr, p[1] + (hi[i][1] - p[1]) * tr, zr] as V3)
      win.loft([lo, mid]); copper.loft([mid, hi])
    } else copper.loft([lo, hi])
    if (k + 2 < levels.length) {
      // the ledge where the next band starts, set back
      const nxt = ring(mix(base, top, tOf(z1)), z1, -STEP)
      for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; copper.quad(nxt[i], hi[i], hi[j], nxt[j]) }
    }
  }
  // observation floor: glass all round, set back under the cap
  const gl = mix(base, top, 1)
  win.loft([ring(gl, Z_GLASS, -0.8), ring(gl, Z_CAP, -0.8)])
  // the ledge the glass stands on
  {
    const o = ring(gl, Z_GLASS), i = ring(gl, Z_GLASS, -0.8)
    for (let k = 0; k < 4; k++) { const l = (k + 1) % 4; roofTop.quad(i[k], o[k], o[l], i[l]) }
  }
  // the cap: a copper box with a soft top edge, a parapet round its roof
  {
    const lo = ring(capP, Z_CAP), hi = ring(capP, Z_RIM - 0.35)
    copper.loft([lo, hi])
    const chamfer = ring(capP, Z_RIM, -0.35)
    copper.loft([hi, chamfer])
    const inner = ring(capP, Z_RIM, -0.75), innerLow = ring(capP, Z_CAPROOF, -0.75)
    for (let k = 0; k < 4; k++) { const l = (k + 1) % 4; copper.quad(chamfer[k], chamfer[l], inner[l], inner[k]) }
    copper.loft([[...innerLow].reverse(), [...inner].reverse()])
    roofTop.cap(innerLow, true)
    // underside of the overhang
    const under = ring(gl, Z_CAP, -0.8)
    for (let k = 0; k < 4; k++) { const l = (k + 1) % 4; copper.quad(lo[k], under[k], under[l], lo[l]) }
  }

  const parts = [
    { part: copper, material: finish('deyoung-copper', 0xa88272) },
    { part: roofTop, material: finish('deyoung-roof', 0xa39d97) },
    { part: win, material: PALETTE.window },
    { part: sky, material: PALETTE.glass },
  ]
  return { parts, height: Z_RIM }
}

if (import.meta.main) {
  const { parts, height } = buildDeYoung()
  const glb = writeGlb('de Young Museum', parts, {
    license: 'CC0-1.0', bearing: 317.8, elevation: 0, anchor: [37.77147861, -122.46871572], height,
    frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    replaces: DEYOUNG_REPLACES,
  })
  const tris = report('de Young', parts, glb)
  const out = new URL('../models/sf-de-young.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes, top ${height} m`)
}
