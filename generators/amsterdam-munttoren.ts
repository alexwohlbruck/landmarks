/**
 * Munttoren (Regulierstoren), Muntplein, Amsterdam: original procedural
 * geometry, CC0-1.0.
 * bun generators/amsterdam-munttoren.ts
 *
 * The west tower of the Regulierspoort (1480-87). After the fire of 1618
 * only the lower brick tower was kept; in 1619-20 Hendrick de Keyser gave it
 * an octagonal upper stage, a clock stage with four dials and an open
 * lantern (carillon by Hemony, 1668) under an openwork crown.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/57862728,
 * 52.367057, 4.893212. Bearing 32: the octagons' faces, as OSM's stage
 * parts draw them, face 32, 122, 212 and 302 degrees, so in this frame
 * every octagon has a flat face to each axis.
 *
 * Identity, in order: the stack of a brick base, a grey octagon with big
 * arched panels and segmental pediments, the clock stage with four black
 * and gold dials standing out past its corners, the open arched belfry
 * with its bells, and the openwork crown with a gilt ball and vane; the
 * dark red-brown brick base under all that grey.
 *
 * Evidence:
 *  - plan: OSM outline way/57862728 and its parts, read in the turned
 *    frame: the brick tower 751683819 (a 5.7 m circle; the base is drawn
 *    as an octagon 5.8 m across the flats, as the photos show its faces),
 *    stage parts 751698384 (5.4 m octagon, 14 m), 751698383 (4.2 m,
 *    13-19 m), 751698382 (2.9 m, 18-24 m), the annex 751683816 (x 2.3-4.6,
 *    y -0.1-1.2, 7 m, gabled) and the annex 751683817 (x -4.4--2.2, y 0-1.6,
 *    10 m, gabled).
 *  - height: 35 m to the vane, published (nl.wikipedia, "Munttoren
 *    (Amsterdam)": "De Munttoren is 35 meter hoog").
 *  - stage heights and widths estimated from Massimo Catarinella's distant,
 *    level telephoto (22.4 px/m when the vane top is 35 m): brick base to
 *    11.2 m (6 m across), grey octagon to 16.4 m (5.2 m across), pediments
 *    to 17.9, clock stage to 21.0 (3.7 m across), belfry to 24.5 (3.6 m
 *    across), crown about 25.8-28.3 (2.2 m wide, drawn 2.5 m), ball 29.6,
 *    vane 35. Dials 2.2 m across. The OSM stage heights (14/19/24) are
 *    rough and not used.
 *  - the base tiers (stone quoins to about 6 m, then two tiers of blind
 *    arches) from Rudolphous's and Dietmar Rabich's close photos.
 *  - colours from the daylight photos: dark red-brown brick pulled to the
 *    palette's lightness; the upper stages' sandstone, wood and lead read
 *    dark warm grey-brown in daylight (Michielverbeek's 2024 photo), drawn
 *    #625c56 with the arched panels charcoal; cornices pale sandstone;
 *    black dials with gilt rims; the crown's hoops drawn gilt and bold so
 *    the openwork reads at phone size (in reality grey with gilding);
 *    gilt balls and vane.
 *  - night: the whole tower is floodlit (Catarinella's dusk photo).
 *  - elevation 0 (flat, about 0-2 m NAP). No lidar (AHN is not read by the
 *    repo's tools).
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Munttoren_Amsterdam.jpg (Massimo Catarinella, CC BY 3.0): the whole
 *    tower at dusk, distant telephoto, floodlit.
 *  - Amsterdam,_de_Munttoren_RM3729_IMG_3346_2024-06-24_11.41.jpg
 *    (Michielverbeek, CC BY 4.0): the tower from the north-west over the
 *    Singel, 2024.
 *  - Amsterdam_(NL),_Munttoren_--_2015_--_7236.jpg (Dietmar Rabich,
 *    CC BY-SA 4.0): base, octagon and lantern from below.
 *  - Belfry_of_Munttoren_-_Muntplein_-_Amsterdam_-_2016-09-13-6642.jpg
 *    (Slaunger, CC BY-SA 4.0): clock stage, belfry, crown.
 *  - Munttoren_2085.jpg (C messier, CC BY-SA 4.0): the octagon, dials and
 *    crown in evening sun.
 *  - Munttoren-Amsterdam.jpg (Yair Haklai, CC BY-SA 3.0): the open belfry.
 *  - Amsterdam_-_De_Munttoren_v1.JPG (Rudolphous, CC BY-SA 3.0 nl): the
 *    whole tower and the annexes from the street.
 * No commercial imagery. No look-only sources.
 *
 * Left out: the 1887 guardhouse (OSM way/976474361, a separate building,
 * left to the map), the blind arches of the base (brick on brick), clock
 * hands and numerals, the balusters, the bells' frames, the vane's
 * cockerel (a gilt plate).
 *
 * Doubts: the north side of the base is hidden by its neighbours in every
 * photo and is drawn like the south. Stage heights are photo estimates.
 *
 * This file also holds the kit for this builder's other Amsterdam towers
 * and gates (montelbaanstoren, schreierstoren, waag, muiderpoort,
 * haarlemmerpoort); merge it first.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, lathe, rect, save, walls, type XY } from './chi-aon-center'
import { along, arcade, archOn, bbox, face, rectOn } from './phl-independence-hall'

// ---------------------------------------------------------------------------
// Kit for this builder's Amsterdam towers and gates.

export type Seg = [XY, XY]

/**
 * A regular n-gon about (cx, cy), counter-clockwise, `f` from the centre to
 * the middle of each face; face 0 faces south (-y), face n/4 east, and so on.
 */
export function ngonF(cx: number, cy: number, f: number, n = 8): XY[] {
  const R = f / Math.cos(Math.PI / n)
  return Array.from({ length: n }, (_, k) => {
    const a = -Math.PI / 2 - Math.PI / n + (2 * Math.PI * k) / n
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)] as XY
  })
}
export const segs = (r: XY[]): Seg[] => r.map((a, i) => [a, r[(i + 1) % r.length]] as Seg)
export const grow = (r: XY[], d: number) => inset(r, -d)

/** A closed prism. */
export function prism(p: Part, r: XY[], z0: number, z1: number, top = true, bottom = false) {
  walls(p, r, z0, z1)
  if (top) cap(p, r, z1)
  if (bottom) cap(p, r, z0, false)
}

/** A cornice or band: the ring grown by `out`, both edges chamfered by `b`. */
export function band(p: Part, r: XY[], z0: number, z1: number, out = 0.25, b = 0.12, top = true, bottom = true) {
  b = Math.min(b, (z1 - z0) / 2.5, out)
  const o = grow(r, out), i = grow(r, out - b)
  walls(p, i, z0, z0 + b, o)
  walls(p, o, z0 + b, z1 - b)
  walls(p, o, z1 - b, z1, i)
  if (top) cap(p, i, z1)
  if (bottom) cap(p, i, z0, false)
}

/** A frustum (sloped roof skirt) from ring r0 at z0 to ring r1 at z1, same length. */
export function frustum(p: Part, r0: XY[], z0: number, r1: XY[], z1: number) {
  walls(p, r0, z0, z1, r1)
}

/** A pyramid or cone from ring r at z0 to an apex. */
export function pyramid(p: Part, r: XY[], z0: number, apex: V3) {
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    p.tri([r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], apex)
  }
}

/** A sphere. */
export function ball(p: Part, x: number, y: number, z: number, r: number, seg = 8) {
  const prof: XY[] = []
  for (let i = 0; i <= 6; i++) { const a = -Math.PI / 2 + (i / 6) * Math.PI; prof.push([Math.max(0, r * Math.cos(a)), z + r * Math.sin(a)]) }
  prof[0][0] = 0; prof[6][0] = 0
  lathe(p, x, y, prof, seg)
}

/**
 * An open stage: every face of the ring is a wall `t` thick with one round
 * arch cut right through it, leaving a post of `post` at each corner. The
 * openings run from z0 to the springline zs; the wall stands to z1. Square
 * corner posts close the joints between the faces.
 */
export function openStage(p: Part, ring: XY[], z0: number, z1: number, zs: number, post: number, t = 0.3, seg = 6) {
  for (const [a, b] of segs(ring)) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const M = (s: number, w: number, z: number): V3 => [a[0] + u[0] * s - n[0] * w, a[1] + u[1] * s - n[1] * w, z]
    arcade(p, M, 0, L, t, z0, z1, [{ c: L / 2, hw: L / 2 - post, zs }], seg, false)
  }
  // Corner posts: a small prism hugging each corner, outside and in.
  for (let k = 0; k < ring.length; k++) {
    const c = ring[k], pr = ring[(k - 1 + ring.length) % ring.length], nx = ring[(k + 1) % ring.length]
    const dp = norm2(sub2(pr, c)), dn = norm2(sub2(nx, c))
    const q = post * 0.7, e = 0.06
    // outward bisector
    const bis = norm2([-(dp[0] + dn[0]), -(dp[1] + dn[1])])
    const pts: XY[] = [
      [c[0] + bis[0] * e, c[1] + bis[1] * e],
      [c[0] + dn[0] * q + bis[0] * e * 0.5, c[1] + dn[1] * q + bis[1] * e * 0.5],
      [c[0] + dn[0] * q - bis[0] * t * 0.9, c[1] + dn[1] * q - bis[1] * t * 0.9],
      [c[0] + dp[0] * q - bis[0] * t * 0.9, c[1] + dp[1] * q - bis[1] * t * 0.9],
      [c[0] + dp[0] * q + bis[0] * e * 0.5, c[1] + dp[1] * q + bis[1] * e * 0.5],
    ]
    prism(p, ccw(pts), z0, z1)
  }
}
const sub2 = (a: XY, b: XY): XY => [a[0] - b[0], a[1] - b[1]]
const norm2 = (a: XY): XY => { const l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l] }
export const ccw = (r: XY[]) => (r.reduce((s, q, i) => { const w = r[(i + 1) % r.length]; return s + q[0] * w[1] - w[0] * q[1] }, 0) < 0 ? [...r].reverse() : r)

/**
 * A square-section tube bent along a circle (or an arc t0..t1) of radius R
 * about C in the plane of e1, e2; section half-size r.
 */
export function hoop(p: Part, C: V3, e1: V3, e2: V3, R: number, r: number, seg = 16, t0 = 0, t1 = 2 * Math.PI) {
  const N = norm3(cross(e1, e2))
  const at = (t: number) => {
    const rad: V3 = [Math.cos(t) * e1[0] + Math.sin(t) * e2[0], Math.cos(t) * e1[1] + Math.sin(t) * e2[1], Math.cos(t) * e1[2] + Math.sin(t) * e2[2]]
    const P: V3 = [C[0] + R * rad[0], C[1] + R * rad[1], C[2] + R * rad[2]]
    return [-1, 1].flatMap((sr) => [-1, 1].map((sn) => [P[0] + r * (sr * rad[0] + sn * N[0]), P[1] + r * (sr * rad[1] + sn * N[1]), P[2] + r * (sr * rad[2] + sn * N[2])] as V3))
  }
  // corners in order around the section: (-r,-n), (-r,+n), (+r,+n), (+r,-n)
  const order = [0, 1, 3, 2]
  for (let k = 0; k < seg; k++) {
    const ta = t0 + ((t1 - t0) * k) / seg, tb = t0 + ((t1 - t0) * (k + 1)) / seg
    const A = at(ta), B = at(tb)
    const tm = (ta + tb) / 2
    const radm: V3 = [Math.cos(tm) * e1[0] + Math.sin(tm) * e2[0], Math.cos(tm) * e1[1] + Math.sin(tm) * e2[1], Math.cos(tm) * e1[2] + Math.sin(tm) * e2[2]]
    const Cm: V3 = [C[0] + R * radm[0], C[1] + R * radm[1], C[2] + R * radm[2]]
    for (let j = 0; j < 4; j++) {
      const i0 = order[j], i1 = order[(j + 1) % 4]
      const q = [A[i0], A[i1], B[i1], B[i0]]
      const m = q.reduce((s, v) => [s[0] + v[0] / 4, s[1] + v[1] / 4, s[2] + v[2] / 4], [0, 0, 0] as V3)
      face(p, q, sub(m, Cm))
    }
  }
  if (t1 - t0 < 2 * Math.PI - 1e-6) {
    for (const [t, s] of [[t0, -1], [t1, 1]] as [number, number][]) {
      const A = at(t), tan: V3 = [-Math.sin(t) * e1[0] + Math.cos(t) * e2[0], -Math.sin(t) * e1[1] + Math.cos(t) * e2[1], -Math.sin(t) * e1[2] + Math.cos(t) * e2[2]]
      face(p, [A[0], A[1], A[3], A[2]], [tan[0] * s, tan[1] * s, tan[2] * s])
    }
  }
}
const norm3 = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/**
 * A clock dial standing proud of wall a→b: a gilt rim disc (`rim`) with a
 * dark face (`dial`), radius R, centred c along the wall at height z, from
 * o0 to o0 + d outside the wall.
 */
export function dialOn(dial: Part, rim: Part, a: XY, b: XY, c: number, z: number, R: number, o0 = 0, d = 0.18, seg = 16) {
  const { P, n } = along(a, b)
  const N: V3 = [n[0], n[1], 0], B: V3 = [-n[0], -n[1], 0]
  const pt = (k: number, r: number, o: number) => P(c + r * Math.cos((2 * Math.PI * k) / seg), z + r * Math.sin((2 * Math.PI * k) / seg), o)
  for (let k = 0; k < seg; k++) {
    rim.tri(P(c, z, o0 + d), pt(k, R, o0 + d), pt(k + 1, R, o0 + d))
    face(rim, [P(c, z, o0), pt(k, R, o0), pt(k + 1, R, o0)], B)
    const m = (2 * Math.PI * (k + 0.5)) / seg
    const { u } = along(a, b)
    face(rim, [pt(k, R, o0), pt(k + 1, R, o0), pt(k + 1, R, o0 + d), pt(k, R, o0 + d)], [u[0] * Math.cos(m), u[1] * Math.cos(m), Math.sin(m)])
    face(dial, [P(c, z, o0 + d + 0.04), pt(k, R * 0.78, o0 + d + 0.04), pt(k + 1, R * 0.78, o0 + d + 0.04)], N)
  }
}

/** A mast with a cross arm and a gilt vane plate. */
export function vane(mast: Part, plate: Part, x: number, y: number, z0: number, z1: number, arm = 0.6, r = 0.07) {
  lathe(mast, x, y, [[r, z0], [r, z1], [0, z1]], 4)
  const za = z1 - 1.4
  bbox(mast, mast, x - arm, y - r, x + arm, y + r, za - r, za + r, 0.02)
  bbox(mast, mast, x - r, y - arm, x + r, y + arm, za - r, za + r, 0.02)
  const v: V3[] = [[x - 0.1, y, z1 - 0.8], [x + 0.9, y, z1 - 0.8], [x + 0.9, y, z1 - 0.15], [x - 0.1, y, z1 - 0.15]]
  face(plate, v, [0, -1, 0]); face(plate, v, [0, 1, 0])
}

/** A gabled roof over an axis box, ridge along x (alongX) or y; gable ends in `wall`. */
export function gabled(roof: Part, wall: Part | null, x0: number, y0: number, x1: number, y1: number, eave: number, ridge: number, alongX: boolean, o = 0.25) {
  if (alongX) {
    const ym = (y0 + y1) / 2, s = (ridge - eave) / ((y1 - y0) / 2), lo = eave - o * s
    face(roof, [[x0 - o, y0 - o, lo], [x1 + o, y0 - o, lo], [x1 + o, ym, ridge], [x0 - o, ym, ridge]], [0, -1, 1 / s])
    face(roof, [[x1 + o, y1 + o, lo], [x0 - o, y1 + o, lo], [x0 - o, ym, ridge], [x1 + o, ym, ridge]], [0, 1, 1 / s])
    face(roof, [[x0 - o, y0 - o, lo], [x1 + o, y0 - o, lo], [x1 + o, y1 + o, lo], [x0 - o, y1 + o, lo]], [0, 0, -1])
    for (const [x, nx] of [[x0 - o, -1], [x1 + o, 1]] as [number, number][]) face(roof, [[x, y0 - o, lo], [x, y1 + o, lo], [x, ym, ridge]], [nx, 0, 0])
    if (wall) for (const [x, nx] of [[x0, -1], [x1, 1]] as [number, number][]) face(wall, [[x, y0, eave], [x, y1, eave], [x, ym, ridge - 0.05]], [nx, 0, 0])
  } else {
    const xm = (x0 + x1) / 2, s = (ridge - eave) / ((x1 - x0) / 2), lo = eave - o * s
    face(roof, [[x0 - o, y1 + o, lo], [x0 - o, y0 - o, lo], [xm, y0 - o, ridge], [xm, y1 + o, ridge]], [-1, 0, 1 / s])
    face(roof, [[x1 + o, y0 - o, lo], [x1 + o, y1 + o, lo], [xm, y1 + o, ridge], [xm, y0 - o, ridge]], [1, 0, 1 / s])
    face(roof, [[x0 - o, y0 - o, lo], [x1 + o, y0 - o, lo], [x1 + o, y1 + o, lo], [x0 - o, y1 + o, lo]], [0, 0, -1])
    for (const [y, ny] of [[y0 - o, -1], [y1 + o, 1]] as [number, number][]) face(roof, [[x0 - o, y, lo], [x1 + o, y, lo], [xm, y, ridge]], [0, ny, 0])
    if (wall) for (const [y, ny] of [[y0, -1], [y1, 1]] as [number, number][]) face(wall, [[x0, y, eave], [x1, y, eave], [xm, y, ridge - 0.05]], [0, ny, 0])
  }
}

/** A segmental (or half-round) pediment slab standing on wall a→b. */
export function segPediment(p: Part, a: XY, b: XY, c: number, hw: number, z0: number, rise: number, d = 0.35, o0 = 0, seg = 8) {
  const { P, n, u } = along(a, b)
  // circle through (c-hw, z0), (c+hw, z0), (c, z0+rise)
  const R = (hw * hw + rise * rise) / (2 * rise), zc = z0 + rise - R, th = Math.asin(Math.min(1, hw / R))
  const pts: XY[] = []
  for (let k = 0; k <= seg; k++) { const t = -th + (2 * th * k) / seg; pts.push([c + R * Math.sin(t), zc + R * Math.cos(t)]) }
  const N: V3 = [n[0], n[1], 0]
  for (let k = 0; k < seg; k++) {
    face(p, [P(c, z0, o0 + d), P(pts[k][0], pts[k][1], o0 + d), P(pts[k + 1][0], pts[k + 1][1], o0 + d)], N)
    const m = (pts[k][0] + pts[k + 1][0]) / 2 - c
    face(p, [P(pts[k][0], pts[k][1], o0), P(pts[k + 1][0], pts[k + 1][1], o0), P(pts[k + 1][0], pts[k + 1][1], o0 + d), P(pts[k][0], pts[k][1], o0 + d)], [u[0] * m, u[1] * m, R])
  }
  face(p, [P(c - hw, z0, o0), P(c + hw, z0, o0), P(c + hw, z0, o0 + d), P(c - hw, z0, o0 + d)], [0, 0, -1])
}

export const floodAll = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : 0.9)

export { save, rect, lathe, walls, cap, inset, archOn, rectOn, face, bbox, along, arcade }
export type { XY }

// ---------------------------------------------------------------------------
// Munttoren

function build() {
  const brick = new Part(), stone = new Part(), slate = new Part(), win = new Part(), gold = new Part(), dark = new Part()
  const TX = 0.05, TY = 0

  // ------------------------------------------------------- the brick base
  const BASE = 11.2
  const b0 = ngonF(TX, TY, 2.9)
  prism(brick, b0, 0, BASE, false)
  band(stone, b0, 0, 0.6, 0.06, 0.05, false, false)
  band(stone, b0, 6.0, 6.35, 0.1, 0.06, false, false)
  // Stone quoins on the corners of the lower tier.
  for (const c of b0) {
    const d = Math.hypot(c[0] - TX, c[1] - TY), ux = (c[0] - TX) / d, uy = (c[1] - TY) / d
    for (let z = 0.6, k = 0; z < 5.9; z += 1.05, k++) {
      const w = k % 2 ? 0.4 : 0.62, q: XY[] = [[c[0] + ux * 0.06, c[1] + uy * 0.06], [c[0] - ux * w + -uy * w * 0.8, c[1] - uy * w + ux * w * 0.8], [c[0] - ux * w * 1.2, c[1] - uy * w * 1.2], [c[0] - ux * w + uy * w * 0.8, c[1] - uy * w - ux * w * 0.8]]
      prism(stone, ccw(q), z, Math.min(z + 0.6, 5.95), true)
    }
  }
  // Small arched windows on the street faces, in stone surrounds.
  const bs = segs(b0)
  for (const k of [0, 1, 7, 6, 2]) {
    const [a, b] = bs[k], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (k !== 2) { archOn(stone, a, b, L / 2, 0.5, 4.3, 5.2, 0.04, 6); archOn(win, a, b, L / 2, 0.36, 4.45, 5.2, 0.07, 6) }
    archOn(win, a, b, L / 2, 0.36, 7.7, 8.5, 0.05, 6)
    archOn(win, a, b, L / 2, 0.34, 9.9, 10.6, 0.05, 6)
  }
  // The annexes: a low gabled one to the east, a taller one to the west.
  prism(brick, rect(2.3, -0.1, 4.6, 1.2), 0, 6.0, false)
  gabled(slate, brick, 2.3, -0.1, 4.6, 1.2, 6.0, 7.0, true, 0.15)
  prism(brick, rect(-4.4, 0.0, -2.2, 1.6), 0, 9.0, false)
  gabled(slate, brick, -4.4, 0.0, -2.2, 1.6, 9.0, 10.0, true, 0.15)

  // The white cornice on the brick.
  band(stone, b0, BASE - 0.1, BASE + 0.5, 0.3, 0.15)

  // ---------------------------------------------- the grey octagon stage
  const Z2 = BASE + 0.5, Z2T = 16.4
  const o2 = ngonF(TX, TY, 2.45)
  prism(slate, o2, Z2, Z2T, false)
  const s2 = segs(o2)
  s2.forEach(([a, b], k) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (k % 2 === 0) {
      // the big arched panel, slate-filled, in a stone frame
      archOn(slate, a, b, L / 2, 0.8, 12.3, 14.9, 0.1, 8)
      archOn(dark, a, b, L / 2, 0.6, 12.5, 14.9, 0.16, 8)
    } else {
      rectOn(dark, a, b, L / 2, 0.55, 12.4, 15.8, 0.05)
    }
  })
  // Corner pilasters.
  for (const c of o2) {
    const d = Math.hypot(c[0] - TX, c[1] - TY), ux = (c[0] - TX) / d, uy = (c[1] - TY) / d
    const q: XY[] = [[c[0] + ux * 0.22, c[1] + uy * 0.22], [c[0] - uy * 0.28, c[1] + ux * 0.28], [c[0] - ux * 0.3, c[1] - uy * 0.3], [c[0] + uy * 0.28, c[1] - ux * 0.28]]
    prism(slate, ccw(q), Z2, Z2T, false)
  }
  band(stone, o2, Z2T, Z2T + 0.6, 0.35, 0.15)
  // Segmental pediments over the axis faces.
  const ZP = Z2T + 0.6
  s2.forEach(([a, b], k) => {
    if (k % 2) return
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    segPediment(slate, a, b, L / 2, L / 2 + 0.25, ZP, 1.05, 0.5, -0.15)
  })
  // Lead roof skirt up to the clock stage.
  const Z3 = 17.6
  const o3 = ngonF(TX, TY, 1.85)
  frustum(slate, grow(o2, 0.2), ZP, grow(o3, 0.05), Z3 + 0.3)

  // ---------------------------------------------------- the clock stage
  const Z3T = 21.0
  prism(slate, o3, Z3, Z3T, false)
  for (const c of o3) {
    const d = Math.hypot(c[0] - TX, c[1] - TY), ux = (c[0] - TX) / d, uy = (c[1] - TY) / d
    const q: XY[] = [[c[0] + ux * 0.16, c[1] + uy * 0.16], [c[0] - uy * 0.2, c[1] + ux * 0.2], [c[0] - ux * 0.22, c[1] - uy * 0.22], [c[0] + uy * 0.2, c[1] - ux * 0.2]]
    prism(slate, ccw(q), Z3, Z3T, false)
  }
  segs(o3).forEach(([a, b], k) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (k % 2 === 0) dialOn(dark, gold, a, b, L / 2, 19.3, 1.1, 0.2, 0.16)
    else rectOn(dark, a, b, L / 2, 0.4, 19.8, 20.7, 0.04)
  })
  band(stone, o3, Z3T, Z3T + 0.35, 0.2, 0.1)

  // ------------------------------------------------ the open belfry
  const Z4 = Z3T + 0.35, Z4T = 24.5
  const o4 = ngonF(TX, TY, 1.75)
  openStage(slate, o4, Z4, Z4T, 23.5, 0.3, 0.28, 6)
  // Floor, and the bells hanging inside.
  cap(slate, o4, Z4 + 0.01)
  for (const [z, r] of [[21.7, 0.62], [22.75, 0.48], [23.6, 0.36]] as [number, number][]) {
    lathe(dark, TX, TY, [[r, z], [r * 0.95, z + 0.12], [r * 0.6, z + r * 0.9], [r * 0.5, z + r * 1.25], [0, z + r * 1.4]], 8)
  }
  lathe(dark, TX, TY, [[0.12, Z4], [0.12, Z4T], [0, Z4T]], 4)
  band(stone, o4, Z4T, Z4T + 0.6, 0.32, 0.15)
  const Z5 = Z4T + 0.6
  for (const c of grow(o4, 0.2)) ball(gold, c[0], c[1], Z5 + 0.2, 0.2, 6)

  // ---------------------------------------- the crown, ball and vane
  lathe(slate, TX, TY, [[1.55, Z5], [1.3, Z5 + 0.3], [0.85, Z5 + 0.55], [0.5, Z5 + 0.7], [0, Z5 + 0.72]], 8, Math.PI / 8)
  const CZ = 27.1, CR = 1.3, tr = 0.15
  for (let k = 0; k < 2; k++) {
    const phi = Math.PI / 4 + (k * Math.PI) / 2
    hoop(gold, [TX, TY, CZ], [Math.cos(phi), Math.sin(phi), 0], [0, 0, 1], CR, tr, 16)
  }
  hoop(gold, [TX, TY, CZ], [1, 0, 0], [0, 1, 0], CR + 0.02, tr * 1.1, 16)
  hoop(gold, [TX, TY, CZ - CR * 0.82], [1, 0, 0], [0, 1, 0], CR * 0.6, tr, 12)
  // The needle through the crown, the gilt ball, the vane.
  lathe(slate, TX, TY, [[0.32, Z5 + 0.6], [0.2, CZ], [0.22, CZ + CR + 0.1], [0.3, CZ + CR + 0.35], [0.12, CZ + CR + 0.9], [0.1, 29.3], [0, 29.35]], 8)
  ball(gold, TX, TY, 29.65, 0.4, 10)
  vane(dark, gold, TX, TY, 30.0, 35.0, 0.55, 0.07)

  const flood = floodAll
  return [
    { part: brick, material: { ...finish('munttoren-brick', 0x9c5a4a), floodlight: flood } },
    { part: stone, material: { ...finish('munttoren-stone', 0xd6d0c2), floodlight: flood } },
    { part: slate, material: { ...finish('munttoren-upper', 0x625c56), floodlight: flood } },
    { part: win, material: { ...PALETTE.window } },
    { part: gold, material: { ...finish('munttoren-gilt', 0xc9a24a, 0.45), floodlight: flood } },
    { part: dark, material: finish('munttoren-dark', 0x4a4f57) },
  ]
}

if (import.meta.main) await save('amsterdam-munttoren', 'Munttoren', [52.367057, 4.893212], 32, build(), 6500)
