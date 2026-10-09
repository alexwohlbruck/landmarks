/**
 * Caesars Palace, Las Vegas: the hotel towers, the Colosseum and the casino
 * podium they stand on. Procedural, CC0-1.0.
 * bun generators/lv-caesars-palace.ts
 *
 * This file also exports the small plan-and-facade kit that the other
 * Las Vegas resorts built alongside it (lv-paris-resort) import. The model itself is only written when the
 * file is run directly.
 *
 * Map frame: x east, y north, z up, metres. Bearing 1.8°: the towers' long
 * walls run 1.5–2.3° clockwise of east in OSM, so the plans are turned by
 * that much and squared to this frame. The origin is the area centroid of
 * the resort's outline, way/115672893.
 *
 * Published (Wikipedia, "Caesars Palace"; Skyscraper Center): the Palace
 * Tower (1997) is 29 storeys, the Augustus Tower (2005) 26 and the Octavius
 * Tower (2009/2012) 23; the original 1966 tower (now Julius) 14 storeys and
 * the Forum Tower (1979) 22. The Colosseum (2003) is a round 4,300-seat
 * theatre on the north side of the site, modelled on its namesake.
 *
 * Measured, from OSM: every footprint, the towers' heights (Palace 133 m,
 * Augustus 111, Octavius 107, Forum 71, Julius 52 and its extension 45,
 * Nobu 40) and the Colosseum's 35 m and outline (way/34000314, an indoor
 * room, so not in `replaces`). The casino outline is simplified to 1 m.
 *
 * From the USGS NAIP orthophoto (public domain), which leans the towers'
 * roofs some 13–35 m west but keeps their shape: the Palace Tower's roof is
 * three red-tiled hip roofs on its two end pavilions and its centre one,
 * with flat roofs between; Augustus has a big red hip on its centre
 * pavilion and red mansard slopes along both long sides of each wing, as
 * does Octavius, whose centre is flat.
 *
 * Photos (Wikimedia Commons):
 * - "Caesars Palace - South East - 2010-12-12.jpg", Cygnusloop99,
 *   CC BY-SA 3.0, and "Caesars Palace & The Mirage, Las Vegas
 *   (42491485504).jpg" and "Caesars Palace, Las Vegas (39801633275).jpg",
 *   Mike McBey, CC BY 2.0: the whole resort from the Paris Eiffel Tower,
 *   south-east. The cream towers, their red roofs and white pediments, the
 *   row of arched attic windows under the cornice, the Colosseum drum;
 * - "Las Vegas, Caesars Palace 01.jpg", CC BY-SA 3.0, from Flamingo Road
 *   to the south-west: the end faces' three dark full-height window
 *   recesses, the belt course under the attic, the pediments on the ends;
 * - "Caesars Palace. Las Vegas. (37399855570).jpg", Bernard Spragg, CC0,
 *   and "Caesar's Palace Hotel and Casino with Forum Shops ...", Jim
 *   Gateley, CC BY 3.0: Augustus's long south face from the Bellagio lake,
 *   its centre pediment over a recessed colonnade;
 * - "Colosseum at Caesars Palace in Las Vegas.jpg", Supercarwaar,
 *   CC BY-SA 4.0: the drum's plain base, two arcaded tiers and plain attic.
 *
 * Estimated: the cornice at 7–9 m under the OSM heights, the red roofs
 * taking the rest; the attic at 9 m; the casino podium at 12 m everywhere
 * (it really ranges from two to four storeys); the pediments' widths from
 * the photos; the Colosseum's tiers. The Forum, Julius and Nobu towers are
 * drawn plainly (cream walls and window bays), as they read from the Strip.
 * Left out: the fountains, statues, porticoes and temple fronts on the
 * podium, signs, and the Colosseum's stage house.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

// ================================================================ the kit

export type XY = [number, number]

export const signedArea = (poly: XY[]) =>
  poly.reduce((s, p, i) => {
    const q = poly[(i + 1) % poly.length]
    return s + p[0] * q[1] - q[0] * p[1]
  }, 0) / 2

/** The ring wound counter-clockwise from above. */
export const ccw = (poly: XY[]): XY[] => (signedArea(poly) < 0 ? [...poly].reverse() : poly)

/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
export function triangulate(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i)
  const out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > -1e-9 && cr(b, c, p) > -1e-9 && cr(c, a, p) > -1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 100000) {
    let clipped = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inTri(poly[j], a, b, c))) continue
      out.push([i0, i1, i2])
      idx.splice(k, 1)
      clipped = true
      break
    }
    if (!clipped) {
      // Only collinear leftovers remain: drop the flattest vertex.
      idx.splice(1, 1)
    }
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** A flat cap over any simple ring at height z. */
export function cap(part: Part, poly: XY[], z: number, up = true) {
  const ring = ccw(poly)
  for (const [a, b, c] of triangulate(ring)) {
    const A: V3 = [...ring[a], z], B: V3 = [...ring[b], z], C: V3 = [...ring[c], z]
    if (up) part.tri(A, B, C)
    else part.tri(C, B, A)
  }
}

/** The walls of a ring from z0 to z1, facing out. */
export function walls(part: Part, poly: XY[], z0: number, z1: number) {
  const r = ccw(poly)
  part.loft([r.map(([x, y]): V3 => [x, y, z0]), r.map(([x, y]): V3 => [x, y, z1])])
}

/** A polygon extruded from z0 to z1: walls in `wall`, top in `top`. */
export function prism(wall: Part, top: Part | null, poly: XY[], z0: number, z1: number) {
  walls(wall, poly, z0, z1)
  if (top) cap(top, poly, z1)
}

const turn = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])

/**
 * Bevel every convex corner of a ring by `c` metres: the soft vertical
 * edges STYLE.md asks for. Corners on edges shorter than 3c are left sharp.
 */
export function chamfer(poly: XY[], c: number): XY[] {
  const r = ccw(poly), out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[(i + r.length - 1) % r.length], b = r[i], d = r[(i + 1) % r.length]
    const la = Math.hypot(b[0] - a[0], b[1] - a[1]), ld = Math.hypot(d[0] - b[0], d[1] - b[1])
    if (turn(a, b, d) > 0 && la > 3 * c && ld > 3 * c) {
      out.push([b[0] + ((a[0] - b[0]) / la) * c, b[1] + ((a[1] - b[1]) / la) * c])
      out.push([b[0] + ((d[0] - b[0]) / ld) * c, b[1] + ((d[1] - b[1]) / ld) * c])
    } else out.push(b)
  }
  return out
}

/** A ring pushed out by `d` (in by a negative d), mitred at the corners. */
export function offset(poly: XY[], d: number): XY[] {
  const r = ccw(poly)
  return r.map((b, i) => {
    const a = r[(i + r.length - 1) % r.length], c = r[(i + 1) % r.length]
    const n1 = norm([b[1] - a[1], -(b[0] - a[0])]), n2 = norm([c[1] - b[1], -(c[0] - b[0])])
    const m = norm([n1[0] + n2[0], n1[1] + n2[1]])
    const k = d / Math.max(0.35, m[0] * n1[0] + m[1] * n1[1])
    return [b[0] + m[0] * k, b[1] + m[1] * k] as XY
  })
}

export const norm = (v: XY): XY => {
  const l = Math.hypot(v[0], v[1]) || 1
  return [v[0] / l, v[1] / l]
}

/**
 * A cornice or belt course: the ring pushed out by `d` from z0 to z1, with
 * its top closing back to the wall. `full` caps the whole top
 * instead, for a cornice that is also the roof's rim.
 */
export function band(part: Part, poly: XY[], d: number, z0: number, z1: number, full = false) {
  const r = ccw(poly), o = offset(r, d)
  walls(part, o, z0, z1)
  if (full) cap(part, o, z1)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    if (!full) part.quad([...r[i], z1], [...r[j], z1], [...o[j], z1], [...o[i], z1])
    // No soffit: the map never looks up at one.
  }
}

export type Facade = {
  /** Target bay width, wall pier included. */
  bay: number
  /** Wall left between panels across a bay. */
  pier: number
  /** Height of a storey group, one panel tall. */
  group: number
  /** Wall left between groups. */
  spandrel: number
  /** Edges shorter than this get no windows. */
  minEdge?: number
  /** Semicircular heads, `segs` segments each. */
  arch?: number
  /** Only edges whose outward normal is within this many degrees of one of these. */
  faces?: XY[]
}

/** The edges of a ring as runs, with their outward normals and lengths. */
export function edges(poly: XY[]) {
  const r = ccw(poly)
  return r.map((a, i) => {
    const b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    return { a, b, L, t, n: [t[1], -t[0]] as XY }
  })
}

/**
 * Window panels on every edge of a ring (STYLE.md, Windows): one panel per
 * bay and storey group, standing 0.05 m proud of the wall.
 */
export function facade(part: Part, poly: XY[], z0: number, z1: number, f: Facade) {
  for (const e of edges(poly)) {
    if (e.L < (f.minEdge ?? 6)) continue
    if (f.faces && !f.faces.some((n) => n[0] * e.n[0] + n[1] * e.n[1] > 0.9)) continue
    edgeFacade(part, e.a, e.b, z0, z1, f)
  }
}

/** Panels along one wall a→b (counter-clockwise, so the outside is on the right). */
export function edgeFacade(part: Part, a: XY, b: XY, z0: number, z1: number, f: Facade) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const bays = Math.max(1, Math.round(L / f.bay)), w = L / bays
  const span = z1 - z0
  const groups = Math.max(1, Math.round(span / f.group)), gh = span / groups
  const P = 0.05
  for (let k = 0; k < bays; k++) {
    const s0 = k * w + f.pier / 2, s1 = (k + 1) * w - f.pier / 2
    if (s1 - s0 < 0.6) continue
    const p0: XY = [a[0] + t[0] * s0 + n[0] * P, a[1] + t[1] * s0 + n[1] * P]
    const p1: XY = [a[0] + t[0] * s1 + n[0] * P, a[1] + t[1] * s1 + n[1] * P]
    for (let g = 0; g < groups; g++) {
      const lo = z0 + g * gh + f.spandrel / 2, hi = z0 + (g + 1) * gh - f.spandrel / 2
      if (hi - lo < 0.8) continue
      panel(part, p0, p1, lo, hi, f.arch)
    }
  }
}

/** One flat panel between two points on a wall, optionally round-headed. */
export function panel(part: Part, p0: XY, p1: XY, lo: number, hi: number, arch?: number) {
  if (!arch) {
    part.quad([...p0, lo], [...p1, lo], [...p1, hi], [...p0, hi])
    return
  }
  const r = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / 2
  const spring = Math.max(lo + 0.2, hi - r)
  part.quad([...p0, lo], [...p1, lo], [...p1, spring], [...p0, spring])
  const c: XY = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2], u: XY = [(p1[0] - p0[0]) / (2 * r), (p1[1] - p0[1]) / (2 * r)]
  const rise = hi - spring
  const pt = (i: number): V3 => {
    const ang = (Math.PI * i) / arch
    return [c[0] + u[0] * r * Math.cos(ang), c[1] + u[1] * r * Math.cos(ang), spring + rise * Math.sin(ang)]
  }
  for (let i = 0; i < arch; i++) part.tri([c[0], c[1], spring], pt(i), pt(i + 1))
}

/**
 * A hipped roof over an axis-aligned rectangle, ridge along the long side;
 * `top` > 0 truncates it into a mansard with a flat top of that inset.
 */
export function hip(slope: Part, flat: Part | null, x0: number, x1: number, y0: number, y1: number, z: number, h: number, top = 0) {
  hipAt(slope, flat, [(x0 + x1) / 2, (y0 + y1) / 2], [1, 0], (x1 - x0) / 2, (y1 - y0) / 2, z, h, top)
}

/**
 * The same over a rectangle centred on `c` with its long axis along the
 * unit vector `u`: half-length `a` along u, half-width `b` across it.
 */
export function hipAt(slope: Part, flat: Part | null, c: XY, u: XY, a: number, b: number, z: number, h: number, top = 0) {
  const v: XY = [-u[1], u[0]]
  const at = (s: number, t: number, zz: number): V3 => [c[0] + u[0] * s + v[0] * t, c[1] + u[1] * s + v[1] * t, zz]
  const base: V3[] = [at(-a, -b, z), at(a, -b, z), at(a, b, z), at(-a, b, z)]
  let tops: V3[]
  if (top > 0) tops = [at(-a + top, -b + top, z + h), at(a - top, -b + top, z + h), at(a - top, b - top, z + h), at(-a + top, b - top, z + h)]
  else if (a >= b) tops = [at(-a + b, 0, z + h), at(a - b, 0, z + h), at(a - b, 0, z + h), at(-a + b, 0, z + h)]
  else tops = [at(0, -b + a, z + h), at(0, -b + a, z + h), at(0, b - a, z + h), at(0, b - a, z + h)]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const same = Math.abs(tops[i][0] - tops[j][0]) < 1e-6 && Math.abs(tops[i][1] - tops[j][1]) < 1e-6
    if (same) slope.tri(base[i], base[j], tops[i])
    else slope.quad(base[i], base[j], tops[j], tops[i])
  }
  if (top > 0 && flat) flat.quad(tops[0], tops[1], tops[2], tops[3])
}

/**
 * A surface of revolution about the vertical through `c`: `profile` lists
 * [radius, z] from bottom to top, each band smooth-shaded around and its
 * own colour (`parts[k]` for the band from profile[k] to profile[k + 1]).
 * A zero radius closes the end to a point.
 */
export function lathe(parts: Part[], c: XY, profile: [number, number][], n = 16) {
  const ring = (r: number, z: number) => Array.from({ length: n }, (_, i): V3 => {
    const a = (2 * Math.PI * i) / n
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z]
  })
  for (let k = 0; k < profile.length - 1; k++) {
    const [r0, z0] = profile[k], [r1, z1] = profile[k + 1]
    const b = ring(r0, z0), t = ring(r1, z1)
    const dr = r1 - r0, dz = z1 - z0, l = Math.hypot(dr, dz) || 1
    const nrm = (i: number): V3 => {
      const a = (2 * Math.PI * i) / n
      return [(Math.cos(a) * dz) / l, (Math.sin(a) * dz) / l, -dr / l]
    }
    const part = parts[Math.min(k, parts.length - 1)]
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      if (r0 > 1e-6) part.tri(b[i], b[j], t[j], undefined, undefined, undefined, [nrm(i), nrm(j), nrm(j)])
      if (r1 > 1e-6) part.tri(b[i], t[j], t[i], undefined, undefined, undefined, [nrm(i), nrm(j), nrm(i)])
    }
  }
}

/**
 * A flat profile in a vertical plane, extruded: `profile` is a simple ring
 * of [s, z] points, s running along `u` from `o`; the solid runs `depth`
 * along the horizontal normal to u (to the right of u, seen from above).
 */
export function extrude(face: Part, side: Part, o: XY, u: XY, profile: [number, number][], depth: number) {
  const n: XY = [u[1], -u[0]]
  const P = signedArea(profile) < 0 ? [...profile].reverse() : profile // counter-clockwise in (s, z)
  const at = (s: number, z: number, d: number): V3 => [o[0] + u[0] * s + n[0] * d, o[1] + u[1] * s + n[1] * d, z]
  const tris = triangulate(P)
  // The front face looks along -n, where (s, z) is counter-clockwise as seen.
  for (const [a, b, c] of tris) {
    face.tri(at(...P[a], 0), at(...P[c], 0), at(...P[b], 0))
    face.tri(at(...P[a], depth), at(...P[b], depth), at(...P[c], depth))
  }
  for (let i = 0; i < P.length; i++) {
    const p = P[i], q = P[(i + 1) % P.length]
    side.quad(at(...q, 0), at(...q, depth), at(...p, depth), at(...p, 0))
  }
}

/**
 * A pediment: a low gable standing on a cornice at `p`, its white face
 * flush with the wall facing `n`, its two roof slopes running `depth` back.
 */
export function gable(face: Part, roof: Part, p: XY, n: XY, w: number, z: number, h: number, depth: number) {
  const t: XY = [-n[1], n[0]]
  const L: XY = [p[0] + t[0] * (w / 2), p[1] + t[1] * (w / 2)], R: XY = [p[0] - t[0] * (w / 2), p[1] - t[1] * (w / 2)]
  const back = (q: XY): XY => [q[0] - n[0] * depth, q[1] - n[1] * depth]
  // Seen from outside, R is on the left.
  face.tri([...R, z], [...L, z], [...p, z + h])
  roof.quad([...L, z], [...back(L), z], [...back(p), z + h], [...p, z + h])
  roof.quad([...back(R), z], [...R, z], [...p, z + h], [...back(p), z + h])
}

export const circle = (cx: number, cy: number, r: number, n: number, a0 = 0): XY[] =>
  Array.from({ length: n }, (_, i) => {
    const a = a0 + (2 * Math.PI * i) / n
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as XY
  })

/** Squared-up axis-aligned rectangle as a ring. */
export const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

export const triangleCount = (parts: Array<{ part: Part }>) => parts.reduce((n, { part }) => n + part.triangles, 0)

// ================================================================ the model

if (import.meta.main) {
  const stone = new Part() // cream walls
  const trim = new Part() // cornices, belt courses, pediments
  const win = new Part() // window bays
  const red = new Part() // red tile roofs
  const flat = new Part() // flat roofs
  const arcade = new Part() // the Colosseum's arches

  const S: XY = [0, -1], N: XY = [0, 1], E: XY = [1, 0], W: XY = [-1, 0]

  // ---------------------------------------------------------- the casino
  // way/115672893, turned 1.8° and simplified to 1 m. It takes in the
  // convention centre (way/134949715) and the Colosseum's footprint.
  const outline: XY[] = [[82.0, 143.8], [68.8, 164.4], [76.9, 177.3], [72.3, 183.7], [30.5, 169.8], [15.3, 166.7], [1.1, 169.8], [1.2, 77.1], [-129.6, 77.2], [-129.5, 38.5], [-172.0, 39.0], [-172.0, 65.3], [-245.7, 65.7], [-245.6, 60.9], [-282.5, 60.9], [-284.4, -57.9], [-269.2, -117.2], [-177.8, -117.2], [-179.5, 1.0], [-31.5, -0.5], [-31.4, -4.3], [-17.8, -4.2], [-20.9, -7.1], [-15.6, -11.8], [-16.1, -17.7], [-24.3, -24.9], [-13.4, -34.9], [-6.5, -27.0], [-0.9, -26.7], [3.9, -31.9], [8.7, -27.1], [13.8, -31.5], [18.4, -27.1], [34.4, -34.2], [26.4, -48.6], [18.7, -40.6], [0.6, -40.0], [1.1, -49.3], [-6.6, -49.3], [-6.6, -58.6], [-9.5, -58.7], [-9.1, -75.4], [-6.5, -75.4], [-6.4, -84.8], [1.2, -84.8], [0.7, -119.1], [-40.9, -119.1], [-41.0, -116.6], [-78.0, -116.6], [-78.1, -119.2], [-117.2, -119.2], [-117.1, -150.3], [-78.0, -150.3], [-78.0, -153.1], [-41.0, -152.7], [-41.1, -150.8], [-2.2, -150.5], [-2.1, -140.4], [14.3, -141.1], [14.3, -154.2], [29.5, -154.2], [29.5, -157.9], [68.3, -157.8], [68.3, -162.5], [114.1, -162.4], [114.1, -157.7], [146.8, -157.7], [146.8, -154.2], [155.4, -154.2], [155.4, -166.1], [168.1, -165.9], [169.1, -117.7], [177.3, -117.4], [177.8, -77.8], [170.5, -77.6], [162.2, -65.7], [178.8, -55.6], [175.0, -49.1], [173.5, -40.4], [174.5, -32.5], [178.9, -23.7], [162.3, -14.1], [170.4, -3.8], [179.5, 2.2], [178.1, 6.2], [198.0, 14.3], [188.7, 35.5], [210.8, 44.7], [210.8, 58.6], [215.7, 58.9], [215.1, 82.2], [202.5, 82.0], [203.0, 88.7], [207.4, 89.0], [207.6, 97.3], [201.7, 97.5], [202.3, 116.7], [160.8, 116.2], [160.5, 112.4], [155.8, 112.2], [149.0, 117.8], [140.2, 111.7], [135.8, 117.8], [143.8, 123.1], [151.6, 132.4], [155.8, 142.5], [156.8, 154.0], [154.7, 163.9], [150.8, 171.9], [145.1, 178.7], [134.9, 185.5], [126.7, 188.2], [117.8, 189.0], [108.8, 187.6], [95.0, 180.4], [85.0, 167.8], [81.4, 155.1]]
  const PODIUM = 12
  prism(stone, flat, outline, 0, PODIUM)

  // ---------------------------------------------------------- the classical towers
  type Classic = {
    plan: XY[]
    /** Top of the main cornice; red roofs rise above it. */
    H: number
    /** The attic of arched windows under the cornice. */
    attic: number
    /** Midpoints of the pavilion faces that carry tall recesses, like the ends. */
    recess?: XY[]
  }
  const CORNICE = 1.8, ATTIC_BELT = 1.2
  // Long faces: a narrow panel per bay and per four-storey group, the cream
  // wall dominant, as in the photos.
  const BAYS: Facade = { bay: 8, pier: 5, group: 13, spandrel: 1.6, minEdge: 7 }
  // End and pavilion faces: three tall dark recesses between the pilasters.
  const RECESS: Facade = { bay: 10.5, pier: 6.3, group: 26, spandrel: 1.2, minEdge: 7 }
  function classic({ plan, H, attic, recess = [] }: Classic) {
    const p = chamfer(plan, 0.6)
    const shaftTop = H - CORNICE - attic
    walls(stone, p, 0, H - CORNICE)
    for (const e of edges(p)) {
      if (e.L < 7) continue
      const m: XY = [(e.a[0] + e.b[0]) / 2, (e.a[1] + e.b[1]) / 2]
      const tall = Math.abs(e.n[0]) > 0.9 || recess.some((q) => Math.hypot(q[0] - m[0], q[1] - m[1]) < 3)
      if (tall) {
        // three recesses, centred, whatever the face's width
        const w = Math.min(e.L, 3 * RECESS.bay), s0 = (e.L - w) / 2
        const a: XY = [e.a[0] + e.t[0] * s0, e.a[1] + e.t[1] * s0], b: XY = [a[0] + e.t[0] * w, a[1] + e.t[1] * w]
        edgeFacade(win, a, b, PODIUM + 1, shaftTop - 0.6, RECESS)
      } else edgeFacade(win, e.a, e.b, PODIUM + 1, shaftTop - 0.6, BAYS)
    }
    band(trim, p, 0.45, shaftTop, shaftTop + ATTIC_BELT)
    // Attic: a row of round-headed windows.
    facade(win, p, shaftTop + ATTIC_BELT + 1.2, H - CORNICE - 0.9, { bay: 8, pier: 4.4, group: 99, spandrel: 0, minEdge: 7, arch: 4 })
    band(trim, p, 0.8, H - CORNICE, H)
    cap(flat, p, H)
  }

  // Augustus Tower, way/1176928048: 111 m, a bar with a centre pavilion
  // standing proud of both faces.
  const AUG_H = 103
  classic({
    plan: [[14.3, -128.1], [30.6, -128.1], [30.6, -125.0], [68.9, -125.0], [68.9, -120.1], [107.5, -120.1], [107.5, -124.7], [146.2, -124.7], [146.2, -127.5], [155.5, -127.5], [155.5, -154.2], [146.8, -154.2], [146.8, -157.7], [114.1, -157.7], [114.1, -162.4], [68.3, -162.4], [68.3, -157.8], [29.5, -157.8], [29.5, -154.2], [14.3, -154.2]],
    H: AUG_H, attic: 9, recess: [[91.2, -162.4], [88.2, -120.1]],
  })
  // Red mansards on the wings, a tall hip on the centre pavilion.
  hip(red, flat, 16, 67, -155.5, -126.5, AUG_H, 4.5, 7.5)
  hip(red, flat, 115, 154, -155.5, -126, AUG_H, 4.5, 7.5)
  hip(red, null, 69.8, 112.6, -160.8, -121.7, AUG_H, 8)
  gable(trim, red, [91.2, -163.2], S, 30, AUG_H, 7, 10)
  gable(trim, red, [91.2, -119.3], N, 30, AUG_H, 7, 10)
  gable(trim, red, [156.3, -140.9], E, 25.5, AUG_H, 5.4, 9)
  gable(trim, red, [13.5, -141.2], W, 25.5, AUG_H, 5.4, 9)

  // Octavius Tower, way/126267789: 107 m, the same design a little lower,
  // its centre roof flat.
  const OCT_H = 100
  classic({
    plan: [[-117.2, -150.3], [-78.0, -150.3], [-78.0, -153.0], [-41.0, -153.0], [-41.0, -150.6], [-2.0, -150.6], [-2.0, -119.2], [-41.0, -119.2], [-41.0, -116.6], [-78.0, -116.6], [-78.0, -119.2], [-117.2, -119.2]],
    H: OCT_H, attic: 9, recess: [[-59.5, -153.0], [-59.5, -116.6]],
  })
  hip(red, flat, -116, -79, -149.2, -120.3, OCT_H, 4.5, 7.5)
  hip(red, flat, -40, -3, -149.5, -120.3, OCT_H, 4.5, 7.5)
  gable(trim, red, [-59.5, -153.8], S, 24, OCT_H, 5.6, 8)
  gable(trim, red, [-118, -134.7], W, 29.5, OCT_H, 6, 8)
  gable(trim, red, [-1.2, -134.9], E, 29.5, OCT_H, 6, 8)

  // Palace Tower, way/134944648: 133 m, the tallest. Three pavilions, each
  // a red hip with a pediment to the south, joined by flat-roofed links.
  const PAL_H = 124
  classic({ plan: rect(-142, 21.2, 4.8, 34.3), H: PAL_H, attic: 9 })
  for (const [x0, x1] of [[-141, -101], [-80, -40], [-20, 20.2]]) {
    hip(red, null, x0, x1, 5.8, 33.3, PAL_H, 8)
    gable(trim, red, [(x0 + x1) / 2, 4], S, 26, PAL_H, 6, 9)
  }

  // ---------------------------------------------------------- the plain towers
  // Forum (1979), Julius (1966) and its extension, Nobu (the old Centurion
  // Tower): cream walls with window bays and a flat roof behind a parapet.
  function plain(plan: XY[], H: number, f: Facade) {
    const p = chamfer(plan, 0.5)
    walls(stone, p, 0, H - 1.4)
    facade(win, p, PODIUM + 1, H - 2.4, f)
    band(trim, p, 0.4, H - 1.4, H)
    cap(flat, p, H)
  }
  // Julius and Nobu read as horizontal balcony bands; Forum as a grid.
  const RIBBON: Facade = { bay: 99, pier: 2, group: 7, spandrel: 3.2, minEdge: 6 }
  const GRID: Facade = { bay: 7.5, pier: 3.5, group: 13, spandrel: 1.6, minEdge: 6 }
  plain([[48.7, 117.1], [27.9, 105.6], [40.2, 84.0], [34.0, 73.2], [40.1, 69.3], [41.7, 71.9], [67.4, 57.2], [69.9, 61.7], [104.9, 62.0], [104.8, 85.5], [72.3, 85.3], [64.8, 89.3]], 71, GRID) // Forum, way/134949102
  plain([[40.8, -13.7], [51.6, -32.8], [51.7, -47.6], [40.4, -65.7], [56.4, -75.4], [67.6, -66.0], [73.3, -55.0], [77.6, -55.0], [77.5, -25.1], [73.2, -25.1], [60.2, -2.4]], 52, RIBBON) // Julius, way/134949098
  plain([[40.8, -13.7], [60.2, -2.4], [53.8, 9.5], [52.1, 25.0], [54.9, 36.0], [67.4, 57.2], [47.3, 68.7], [29.2, 35.1], [29.6, 7.1]], 45, RIBBON) // Julius extension, way/134949101
  plain(rect(65.9, 127.7, 5.4, 33.1), 40, RIBBON) // Nobu, way/134949402

  // ---------------------------------------------------------- the Colosseum
  // A 37.5 m drum (way/34000314) to 35 m: a plain base, two arcaded tiers
  // divided by a belt, and a plain attic under the cornice.
  {
    const C: XY = [119.1, 151.5], R = 37.5, SEG = 24
    const ring = circle(C[0], C[1], R, SEG, Math.PI / SEG)
    walls(stone, ring, 0, 33.6)
    for (const [z0, z1] of [[9, 17.6], [18.8, 27.4]]) {
      facade(arcade, ring, z0, z1, { bay: 99, pier: 3.6, group: 99, spandrel: 0, minEdge: 1, arch: 5 })
      band(trim, ring, 0.35, z1 + 0.2, z1 + 1.2)
    }
    band(trim, ring, 0.6, 33.6, 35)
    cap(flat, ring, 35)
  }

  // ---------------------------------------------------------- write
  const parts = [
    { part: stone, material: PALETTE.stone },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: red, material: finish('caesars-red', 0xc45a4b) },
    { part: flat, material: PALETTE.roof },
    { part: arcade, material: windowVariant(2, 0xc4ae90) },
  ]
  const triangles = triangleCount(parts)
  console.log(parts.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Caesars Palace', parts, {
    license: 'CC0-1.0',
    height: 133,
    frame: 'Y up, -Z north, +X east, metres; origin at the way/115672893 centroid; bearing 1.8',
  })
  if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/lv-caesars-palace.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
