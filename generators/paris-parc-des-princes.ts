/**
 * Parc des Princes, Paris 16e (Roger Taillibert, 1968-72): procedural,
 * CC0-1.0, no textures. bun generators/paris-parc-des-princes.ts
 *
 * Map frame: x across the stadium, y along its long axis (model +y is
 * compass 36.3, towards the Auteuil end; -y is the Boulogne end), z up,
 * metres, BEARING 36.3. Anchor: the area centroid of the OSM outline,
 * relation/152838, lng 2.2530715, lat 48.8414341. z = 0 is the pitch. The
 * street outside stands G = 3.2 m above it: the map's Mapterhorn grid over
 * the site reads the bowl 3.1-3.5 m under the street round it, so
 * `elevation` stays 0 and the map's lowest ground under the footprint is the
 * pitch itself. The pitch and the ground are the map's and are not drawn.
 *
 * What makes it the Parc des Princes, and how each is drawn
 * - The fifty raw-concrete ribs (portiques en porte-à-faux) standing round
 *   the whole oval: thin blades rising from the street, their outer edge
 *   leaning outward as it climbs to a sharp tip, their top edge falling
 *   steeply inward to the roof and running on over it as a pale beam to the
 *   roof's inner edge (gv16, ch1, jb, boul).
 * - The convex concrete shells bulging out between the ribs in the upper
 *   band, rounded over at the top into the roof (jb, gv16, boul).
 * - The open band under the shells, where the raking underside of the
 *   upper tier shows, over a two-storey glazed concourse (boul, gv16).
 * - The grey roof ring covering every seat, with its lights along the inner
 *   edge; the two tiers of seats, red below and PSG blue above (vd1, kil).
 *
 * Evidence
 * - OSM (ODbL): relation/152838 (building=stadium, architect Roger
 *   Taillibert, height=48, start_date 1972), outer way/87946639 and inner
 *   way/35470731; the grounds way/53559935 (leisure=stadium, wikidata
 *   Q193431). In this frame the outer way is a superellipse, semi-axes
 *   88.2 x 118.4 m, exponent 2.1, centred on the anchor (0.4 m rms); the
 *   inner way (the roof's opening) is about 50 x 82 m, exponent 3, with a
 *   small notch on the -x side that is not drawn.
 * - Published (fr.wikipedia "Parc des Princes"): an ellipse 251.5 x 191 m
 *   (taken here as the ribs' tips, 7 m out from the OSM wall line at the
 *   top), carried on cantilevered portiques in thirteen different models;
 *   164 m between the Auteuil and Boulogne stands; the first stadium in
 *   Europe with its lighting built into the roof.
 * - Mapterhorn terrain (tools/terrain.ts grid): the pitch 3.1-3.5 m below
 *   the street.
 * - Photos, each as evidence:
 *   gv16 "Parc des Princes @ Paris 16 (32835075813).jpg", Guilhem Vellut,
 *     CC BY 2.0 (three ribs end on: the leaning outer edge, the steep top,
 *     the shells, the open band and its struts)
 *     https://commons.wikimedia.org/wiki/File:Parc_des_Princes_@_Paris_16_(32835075813).jpg
 *   ch1 "Avenue Parc Princes - Paris XVI (FR75) - 2021-08-11 - 1.jpg",
 *     Chabe01, CC BY-SA 4.0 (the long side in perspective: the rib row, the
 *     taller ribs mid-side)
 *     https://commons.wikimedia.org/wiki/File:Avenue_Parc_Princes_-_Paris_XVI_(FR75)_-_2021-08-11_-_1.jpg
 *   jb "Paris Stade Jean-Bouin.jpg", Arne Müseler, CC BY-SA 3.0 de (from
 *     above: the corner of the stadium, the shells' rounded tops, the pale
 *     beams over the grey roof)
 *     https://commons.wikimedia.org/wiki/File:Paris_Stade_Jean-Bouin.jpg
 *   gvb "Parc des Princes @ Ballon de Paris @ Parc André Citroën @ Paris
 *     (28822113445).jpg", Guilhem Vellut, CC BY 2.0 (from far off: the
 *     low, long silhouette above the roofs)
 *     https://commons.wikimedia.org/wiki/File:Parc_des_Princes_@_Ballon_de_Paris_@_Parc_Andr%C3%A9_Citro%C3%ABn_@_Paris_(28822113445).jpg
 *   vd1 "Paris Parc des Princes 1.jpg", Валерий Дед, CC BY 3.0 (the bowl:
 *     the tiers, the seat colours, the roof's edge and lights)
 *     https://commons.wikimedia.org/wiki/File:Paris_Parc_des_Princes_1.jpg
 *   kil "Parc des princes - Ligue 1.jpg", Kilyac, CC BY-SA 4.0 (the bowl at
 *     night, the lit roof edge)
 *     https://commons.wikimedia.org/wiki/File:Parc_des_princes_-_Ligue_1.jpg
 *   boul "La tribune Boulogne du Parc des Princes vue de l'extérieur",
 *     psgmag.net, CC BY 2.0 (the Boulogne end at night: floodlit ribs, the
 *     lit soffit and concourse) https://www.flickr.com/photos/10671903@N00/3019232349
 *   peri "Parc des Princes et Périph'", psgmag.net, CC BY 2.0 (the east
 *     side over the périphérique at night)
 *     https://www.flickr.com/photos/10671903@N00/3255424514
 * - Estimated (from the photos, scaled by the rib pitch of about 14 m): the
 *   rib tips 36 m above the street at the ends and 40 m mid-side; the
 *   shells from 18.5 to 29.5 m; the open band from 8 to 18.5 m; the concourse
 *   two storeys to 8 m; the roof 1.5 m thick, falling 3 m to its inner
 *   edge; the tiers' sections; the ribs 2.6 m thick.
 * - Look-only references: the IGN orthophotos on Commons (Licence Ouverte,
 *   tagged look-only by tools/photos.py) were not used.
 * - Doubts: OSM's height=48 is higher than the photos suggest for any rib
 *   (about 41 m over the pitch here); the thirteen rib models are drawn as
 *   one form scaled in height; the ribs are spaced evenly; the struts in
 *   the open band, the scoreboards, the banners and the entrance kiosks
 *   are left out.
 *
 * Night: the ribs and the soffit are floodlit (`_FLOODLIGHT`), the shells
 * barely; the concourse and the box ring glow (`window`), and lamps run round
 * the roof's inner edge (`lamp`).
 */
import { Part, type V3 } from './mesh'
import { writeModel } from './london-buckingham-palace'
import { polyTris } from './berlin-oberbaum-bridge'

export const ID = 'paris-parc-des-princes'
export const BEARING = 36.3

type XY = [number, number]
const TAU = Math.PI * 2

// Rings (see header): the outer wall line, the roof's opening, the pitch's edge.
type Ring = { a: number; b: number; n: number }
const OUTER: Ring = { a: 88.2, b: 118.4, n: 2.1 }
const INNER: Ring = { a: 50, b: 82, n: 3.0 }
const FRONT: Ring = { a: 42, b: 61, n: 3.0 }
const G = 3.2 // the street above the pitch
const RIBS = 50
const N = RIBS * 2 // samples round the oval: ribs at even indices, mid-bays at odd ones

const ringPt = (r: Ring, t: number): XY => {
  const c = Math.cos(t), s = Math.sin(t), e = 2 / r.n
  return [r.a * Math.sign(c) * Math.abs(c) ** e, r.b * Math.sign(s) * Math.abs(s) ** e]
}
/** The outward normal of the outer ring at t. */
const outerNormal = (t: number): XY => {
  const [x, y] = ringPt(OUTER, t), n = OUTER.n
  const gx = (Math.sign(x) * Math.abs(x / OUTER.a) ** (n - 1)) / OUTER.a
  const gy = (Math.sign(y) * Math.abs(y / OUTER.b) ** (n - 1)) / OUTER.b
  const l = Math.hypot(gx, gy) || 1
  return [gx / l, gy / l]
}

// Sample parameters spaced evenly along the outer ring's length.
const T: number[] = (() => {
  const M = 8000, cum = [0], ts: number[] = []
  let prev = ringPt(OUTER, 0)
  for (let k = 1; k <= M; k++) {
    const p = ringPt(OUTER, (TAU * k) / M)
    cum.push(cum[k - 1] + Math.hypot(p[0] - prev[0], p[1] - prev[1]))
    prev = p
  }
  // Start half a bay off the long axis so the axis falls between two ribs.
  for (let i = 0; i < N; i++) {
    const s = (cum[M] * (i + 1)) / N
    let j = cum.findIndex((v) => v >= s)
    if (j < 1) j = 1
    const f = (s - cum[j - 1]) / (cum[j] - cum[j - 1] || 1)
    ts.push((TAU * (j - 1 + f)) / M)
  }
  return ts
})()

const lerp2 = (p: XY, q: XY, f: number): XY => [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f]
/** Roof and exterior points: between the roof's opening (s = 0) and the wall line (s = 1), then o metres out along the wall's normal. */
const P = (i: number, s: number, o: number, z: number): V3 => {
  const t = T[((i % N) + N) % N]
  const q = lerp2(ringPt(INNER, t), ringPt(OUTER, t), s), nn = outerNormal(t)
  return [q[0] + nn[0] * o, q[1] + nn[1] * o, z]
}
/** Stand points: between the pitch's edge (f = 0) and the wall line (f = 1). */
const S = (i: number, f: number, z: number): V3 => {
  const t = T[((i % N) + N) % N]
  const q = lerp2(ringPt(FRONT, t), ringPt(OUTER, t), f)
  return [q[0], q[1], z]
}

const subv = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/** A flat triangle facing the side of `hint`, with its true normal. */
function tri(p: Part, a: V3, b: V3, c: V3, hint: V3) {
  let n = unit(crs(subv(b, a), subv(c, a)))
  if (dot(n, hint) < 0) n = [-n[0], -n[1], -n[2]]
  p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
}
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, hint: V3) {
  tri(p, a, b, c, hint)
  tri(p, a, c, d, hint)
}

/** The horizontal outward direction at sample i, for hints. */
const outAt = (i: number): V3 => { const nn = outerNormal(T[((i % N) + N) % N]); return [nn[0], nn[1], 0] }
const UP: V3 = [0, 0, 1], DOWN: V3 = [0, 0, -1]
const mix = (a: V3, b: V3, k: number): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]

/** A band swept all the way round between two section points given as functions of the sample index. */
function band(p: Part, A: (i: number) => V3, B: (i: number) => V3, hint: (i: number) => V3) {
  // Smooth round the ring, so neighbouring quads share their corners.
  const nrm = (i: number): V3 => {
    const M = (j: number): V3 => { const a = A(j), b = B(j); return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2] }
    let n = unit(crs(subv(M(i + 2), M(i - 2)), subv(B(i), A(i))))
    if (dot(n, hint(i)) < 0) n = [-n[0], -n[1], -n[2]]
    return n
  }
  // One quad per bay, rib to rib: the ribs cover the corners.
  for (let i = 0; i < N; i += 2) {
    const n0 = nrm(i), n1 = nrm(i + 2)
    smoothQuad(p, [A(i), A(i + 2), B(i + 2), B(i)], [n0, n1, n1, n0])
  }
}
/** A quad with per-corner normals; Part.tri winds it to agree with them. */
function smoothQuad(p: Part, q: V3[], n: V3[]) {
  p.tri(q[0], q[1], q[2], undefined, undefined, undefined, [n[0], n[1], n[2]])
  p.tri(q[0], q[2], q[3], undefined, undefined, undefined, [n[0], n[2], n[3]])
}

type Mats = { concrete: Part; roof: Part; blue: Part; red: Part; win: Part; lamp: Part }

// Heights (above the pitch).
const Z_CONC = G + 8 // the concourse's top, the open band's foot
const Z_SHELL0 = G + 18.5 // the shells' foot
const Z_ROOF_OUT = G + 29.5 // the roof's top at the wall line
const Z_ROOF_IN = G + 26.5 // the roof's top at its inner edge
const ROOF_T = 1.5
const roofTop = (s: number) => Z_ROOF_IN + (Z_ROOF_OUT - Z_ROOF_IN) * s
/** The rib tip's height at sample i: 36 m over the street at the ends, 40 m mid-side. */
const ribTip = (i: number) => {
  const [x] = ringPt(OUTER, T[i])
  return G + 36 + 4 * (x / OUTER.a) ** 2
}

function bowl(m: Mats) {
  const inw = (i: number): V3 => { const o = outAt(i); return [-o[0], -o[1], 0] }
  // Stands: the pitch wall, the lower tier, the box ring, the upper tier, the back wall.
  band(m.concrete, (i) => S(i, 0, 0), (i) => S(i, 0, 1.7), inw)
  band(m.red, (i) => S(i, 0, 1.7), (i) => S(i, 0.33, 12), (i) => mix(UP, inw(i), 0.6))
  band(m.concrete, (i) => S(i, 0.33, 12), (i) => S(i, 0.33, 12.6), inw)
  band(m.win, (i) => S(i, 0.33, 12.6), (i) => S(i, 0.33, 15.0), inw)
  band(m.concrete, (i) => S(i, 0.33, 15.0), (i) => S(i, 0.37, 15.5), (i) => mix(UP, inw(i), 0.5))
  band(m.blue, (i) => S(i, 0.37, 15.5), (i) => S(i, 0.93, 29.5), (i) => mix(UP, inw(i), 0.6))
  band(m.concrete, (i) => S(i, 0.93, 29.5), (i) => S(i, 0.93, G + 28.1), inw)
  // The roof: top, inner edge, underside.
  const zIn = Z_ROOF_IN, oEdge = -3
  band(m.roof, (i) => P(i, 0, 0, zIn), (i) => P(i, 1, oEdge, Z_ROOF_OUT), () => UP)
  band(m.roof, (i) => P(i, 0, 0, zIn), (i) => P(i, 0, 0, zIn - 1.0), inw)
  band(m.roof, (i) => P(i, 0, 0, zIn - 1.0), (i) => P(i, 1, oEdge, Z_ROOF_OUT - ROOF_T), () => DOWN)
  // Outside: the concourse wall, its top ledge, the upper tier's raking underside.
  band(m.concrete, (i) => P(i, 1, -4, 0), (i) => P(i, 1, -4, Z_CONC), outAt)
  band(m.roof, (i) => P(i, 1, -4, Z_CONC), (i) => P(i, 1, -12, Z_CONC), () => UP)
  band(m.roof, (i) => P(i, 1, -12, Z_CONC), (i) => P(i, 1, -2, Z_SHELL0), (i) => mix(DOWN, outAt(i), 1))
  // Concourse glazing: one panel per bay over both storeys.
  for (let k = 0; k < RIBS; k++) {
    const i0 = 2 * k, i1 = 2 * k + 2
    // Inset from the ribs (1.8 m thick) along the wall.
    const at = (f: number, z: number): V3 => {
      const a = P(i0, 1, -3.94, z), b = P(i1, 1, -3.94, z)
      return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, z]
    }
    for (const [z0, z1] of [[G + 0.6, G + 7.2]]) quad(m.win, at(0.14, z0), at(0.86, z0), at(0.86, z1), at(0.14, z1), outAt(i0 + 1))
  }
}

/**
 * The shells between the ribs: a section rising from the open band's top,
 * bulging out and rounding over into the roof's outer edge; each bay also
 * bulges out in plan between its two ribs.
 */
function shells(m: Mats) {
  // Section: (o out from the wall line, z).
  const sec: XY[] = [[-2, Z_SHELL0], [-0.7, G + 22], [-0.4, G + 26], [-1.4, G + 28.7], [-3, Z_ROOF_OUT]]
  const bulge = [0, 1, 0] // plan bulge across the bay, times 1.6 m at mid-bay
  for (let k = 0; k < RIBS; k++) {
    const iA = 2 * k, iM = 2 * k + 1, iB = 2 * k + 2
    const pt = (u: number, j: number): V3 => {
      const [o, z] = sec[j]
      const lift = j === 0 || j === sec.length - 1 ? 0 : 1.6 * bulge[u]
      const ii = [iA, iM, iB][u]
      return P(ii, 1, o + lift, z)
    }
    const h = outAt(iM)
    // Smooth normals from the grid's central differences.
    const nr = (u: number, j: number): V3 => {
      const du = subv(pt(Math.min(2, u + 1), j), pt(Math.max(0, u - 1), j))
      const dz = subv(pt(u, Math.min(sec.length - 1, j + 1)), pt(u, Math.max(0, j - 1)))
      let n = unit(crs(du, dz))
      if (dot(n, mix(h, UP, 0.3)) < 0) n = [-n[0], -n[1], -n[2]]
      return n
    }
    for (let u = 0; u < 2; u++) for (let j = 0; j < sec.length - 1; j++) {
      smoothQuad(m.concrete, [pt(u, j), pt(u + 1, j), pt(u + 1, j + 1), pt(u, j + 1)], [nr(u, j), nr(u + 1, j), nr(u + 1, j + 1), nr(u, j + 1)])
    }
  }
}

/** The distance along -normal from the outer wall at sample i to the roof's opening. */
function depthToInner(i: number) {
  const t = T[i], [x0, y0] = ringPt(OUTER, t), [nx, ny] = outerNormal(t)
  const inside = (d: number) => {
    const x = x0 - nx * d, y = y0 - ny * d
    return Math.abs(x / INNER.a) ** INNER.n + Math.abs(y / INNER.b) ** INNER.n < 1
  }
  let lo = 0, hi = 80
  for (let k = 0; k < 40; k++) { const md = (lo + hi) / 2; if (inside(md)) hi = md; else lo = md }
  return lo
}

/** The ribs: a blade in the plane of the wall's normal, plus its beam over the roof. */
function ribs(m: Mats) {
  const TH = 2.6
  for (let k = 0; k < RIBS; k++) {
    const i = 2 * k
    const t = T[i], [x0, y0] = ringPt(OUTER, t), [nx, ny] = outerNormal(t)
    const tg: XY = [-ny, nx]
    const tip = ribTip(i), dIn = depthToInner(i)
    const zTopIn = Z_ROOF_IN + 0.7
    // The profile (o, z): outer edge leaning out to the tip, the top falling
    // inward to the roof, the beam over the roof to its inner edge.
    const prof: XY[] = [
      [-4, 0], [2.0, 0], [2.0, G + 5], [3.2, G + 13], [4.6, G + 21], [5.9, G + 28.5], [7.0, tip],
      [-3.0, Z_ROOF_OUT + 1.3], [-dIn * 0.5, roofTop(0.5) + 1.0], [-dIn, zTopIn], [-dIn, Z_ROOF_IN - 0.2],
      [-4, Z_ROOF_OUT - 2],
    ]
    const at = (o: number, z: number, w: number): V3 => [x0 + nx * o + tg[0] * w, y0 + ny * o + tg[1] * w, z]
    const sideL: V3 = [tg[0], tg[1], 0], sideR: V3 = [-tg[0], -tg[1], 0]
    // The beam over the roof is narrower than the blade.
    const halfW = (o: number) => (o < -4.5 ? 0.6 : TH / 2)
    for (const [a, b, c] of polyTris(prof)) {
      for (const sgn of [1, -1]) {
        const A = at(a[0], a[1], sgn * halfW(a[0])), B = at(b[0], b[1], sgn * halfW(b[0])), C = at(c[0], c[1], sgn * halfW(c[0]))
        tri(m.concrete, A, B, C, sgn > 0 ? sideL : sideR)
      }
    }
    // Edges round the profile; ccw is +1 if the profile runs counter-clockwise in (o, z).
    const ccw = prof.reduce((a, r, e) => { const q = prof[(e + 1) % prof.length]; return a + r[0] * q[1] - q[0] * r[1] }, 0) > 0 ? 1 : -1
    for (let e = 0; e < prof.length; e++) {
      const p = prof[e], q = prof[(e + 1) % prof.length]
      const hp = halfW(p[0]), hq = halfW(q[0])
      // Outward from the polygon in (o, z), from its winding (the profile is not convex).
      const eo = ccw * (q[1] - p[1]), ez = -ccw * (q[0] - p[0])
      const hint: V3 = [nx * eo, ny * eo, ez]
      quad(m.concrete, at(p[0], p[1], -hp), at(q[0], q[1], -hq), at(q[0], q[1], hq), at(p[0], p[1], hp), hint)
    }
  }
}

/** The roof lights: one bead per bay under the inner edge. */
function lamps(m: Mats) {
  for (let k = 0; k < RIBS; k++) {
    const c = P(2 * k + 1, 0.02, 0, Z_ROOF_IN - 1.3)
    const r = 0.8
    const v: V3[] = [0, 1, 2].map((j) => [c[0] + r * Math.cos((j * TAU) / 3), c[1] + r * Math.sin((j * TAU) / 3), c[2]] as V3)
    const top: V3 = [c[0], c[1], c[2] + r], bot: V3 = [c[0], c[1], c[2] - r]
    const nn = (q: V3) => unit(subv(q, c))
    for (let j = 0; j < 3; j++) {
      const a = v[j], b = v[(j + 1) % 3]
      m.lamp.tri(a, b, top, undefined, undefined, undefined, [nn(a), nn(b), nn(top)])
      m.lamp.tri(b, a, bot, undefined, undefined, undefined, [nn(b), nn(a), nn(bot)])
    }
  }
}

export function build(): Mats {
  const m: Mats = { concrete: new Part(), roof: new Part(), blue: new Part(), red: new Part(), win: new Part(), lamp: new Part() }
  bowl(m)
  shells(m)
  ribs(m)
  lamps(m)
  return m
}

if (import.meta.main) {
  const m = build()
  // Floodlit outside, from below (boul, peri): the ribs and the soffit of
  // the open band; the shells stay dim, faces looking up barely lit.
  const ringR = (p: V3) => Math.abs(p[0] / OUTER.a) ** OUTER.n + Math.abs(p[1] / OUTER.b) ** OUTER.n
  const radial = (p: V3, n: V3) => {
    const l = Math.hypot(p[0] / OUTER.a ** 2, p[1] / OUTER.b ** 2) || 1
    return (n[0] * p[0]) / OUTER.a ** 2 / l + (n[1] * p[1]) / OUTER.b ** 2 / l
  }
  const flood = (p: V3, n: V3) => {
    if (ringR(p) < 0.8) return 0
    if (n[2] > 0.7) return 0.12
    if (p[2] > Z_SHELL0 - 0.5 && p[2] < Z_ROOF_OUT + 0.5 && radial(p, n) > 0.75) return 0.2 // the shells
    return p[2] < G ? 0.3 : 0.85
  }
  const soffit = (p: V3, n: V3) => (ringR(p) > 0.8 && p[2] < Z_SHELL0 + 0.5 && n[2] < 0.2 ? 0.8 : 0)
  writeModel('Parc des Princes', ID, [
    { part: m.concrete, material: { name: 'concrete', color: 0xe0d8c8, roughness: 0.85, floodlight: flood } },
    { part: m.roof, material: { name: 'roof', color: 0x9da6ad, roughness: 0.85, floodlight: soffit } },
    { part: m.blue, material: { name: 'seats-blue', color: 0x5a6f9c, roughness: 0.85 } },
    { part: m.red, material: { name: 'seats-red', color: 0xb5766a, roughness: 0.85 } },
    { part: m.win, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
    { part: m.lamp, material: { name: 'lamp', color: 0xcfd2d4, roughness: 0.85 } },
  ], { bearing: BEARING, osm: 'relation/152838', height: Math.max(...T.map((_, i) => ribTip(i))) }, 6500)
}
