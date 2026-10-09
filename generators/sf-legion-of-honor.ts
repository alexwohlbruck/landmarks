/**
 * California Palace of the Legion of Honor, San Francisco — original
 * procedural geometry, CC0-1.0.
 * bun generators/sf-legion-of-honor.ts
 *
 * Map frame turned to the building: +y runs up the axis from the domed
 * rotunda at the back to the triumphal arch on the street front (compass
 * 49.1°), +x across it, z up, metres. BEARING 49.1. Origin = the centroid of
 * the OSM outline, on the ground along the sides and back of the building
 * (111.7 m NAVD88). The court of honour and the front terrace stand on a
 * podium 4.9 m and 4.5 m above that; the podium is the map's terrain, so the
 * court is left open and the colonnades' stylobates run down to y = 0.
 *
 * Evidence
 * - OSM relation/21115818 (multipolygon: outer way/1540340820, inner
 *   1540340819 = the court; building=museum, height 0.01, which is wrong):
 *   60.2 x 93.4 m. Its parts: the two wings 1540337302 and 1540337304, the
 *   central gallery 1540337303, the portico 1540337305, the court's side
 *   colonnades with the front screen 1540327029 and 1540327030, the arch
 *   1410202325, 1540333313, 1540333314, the rotunda 1410202318. Every plan
 *   dimension here is OSM's.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023, 0.5 m grid), above 111.7:
 *   court 4.9, front terrace 4.5; wings' walls 15.5-16.3 with a low roof to
 *   17.1-17.7; court colonnades 11.3 with their balustrade 12.4; the arch
 *   16.4; the portico 17.0-17.4; the central gallery a gabled roof, eaves
 *   17.2, ridge 20.0-20.3; rear galleries 13.3-16.7 with skylight bands; the
 *   rotunda's wall 15.5-16.4, its saucer dome springing r 5.5 at 19.6, crown
 *   22.4, finial 24.2. Narrow light wells beside the wings reach 108.7; the
 *   ground round the building is 111.7 and that is taken as y = 0.
 *   (The court held a temporary pavilion when the lidar was flown: ignored.)
 * - Published (Wikipedia; FAMSF): 1924, George Applegarth and Henri Guillaume,
 *   a three-quarter scale copy of the Palais de la Légion d'Honneur (Hôtel de
 *   Salm), Paris; the arch, the Ionic colonnades round the court and the
 *   Corinthian portico inscribed "Honneur et Patrie".
 * - Commons daylight photos: "The Legion of Honor - Joy of Museums 1.jpg"
 *   (GordonMakryllos, CC BY-SA 4.0, the street front on axis); "California
 *   Palace of the Legion of Honor, San Francisco, California
 *   LCCN2013630249.tif" (Carol M. Highsmith, public domain, the front at
 *   dusk, square on); "Legion of Honor - panoramio.jpg" (K Danko, CC BY-SA
 *   3.0, the arch); "California Palace of the Legion of Honor, 02.JPG" and
 *   "03.JPG" (sailko, CC BY-SA 3.0, the court and the portico);
 *   "California Palace of the Legion of Honor 117/163/184 2015-01-03.JPG"
 *   (FASTILY, CC BY-SA 4.0, the court's colonnades and portico);
 *   "Legion of Honor Museum, San Francisco.jpg" (Dan Nevill, CC BY 2.0, the
 *   front and the north wing's side); USGS NAIP (roofs: pale, with aqua
 *   skylight bands and a green gallery roof and dome).
 *
 * Estimated from the photos (scaled by the lidar): the column counts and
 *   spacing (16 Ionic columns a side in the court, two rows of five in each
 *   half of the front screen), the arch opening (5.6 m, crown 14.3 m), the
 *   portico's six columns, the niches and relief panels on the wings (one
 *   arched niche between two narrow ones on each front, a row of niches on
 *   the sides), the back elevations (no photo: plain walls). The rear
 *   galleries' skylights are simplified to one glazed lantern a side.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 49.1
const ANCHOR = { lng: -122.50074208, lat: 37.78454549 }
const REPLACES = ['relation/21115818', 'way/1540337302', 'way/1540337303', 'way/1540337304', 'way/1540337305',
  'way/1540327029', 'way/1540327030', 'way/1410202318', 'way/1410202325', 'way/1540333313', 'way/1540333314']

type XY = [number, number]
const stone = new Part(), roof = new Part(), patina = new Part(), glass = new Part(), win = new Part(), door = new Part()
const up: V3 = [0, 0, 1]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return v.map((n) => n / l) as V3 }

// ---- helpers ---------------------------------------------------------------
const area = (p: XY[]) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
const ccw = (p: XY[]) => (area(p) < 0 ? [...p].reverse() : p)
function earcut(p: XY[]): number[][] {
  const idx = p.map((_, i) => i), out: number[][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (q: XY, a: XY, b: XY, c: XY) => cr(a, b, q) >= 0 && cr(b, c, q) >= 0 && cr(c, a, q) >= 0
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      if (cr(p[ia], p[ib], p[ic]) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inside(p[j], p[ia], p[ib], p[ic]))) continue
      out.push([ia, ib, ic]); idx.splice(i, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
/** Vertical prism over a plan polygon; `skip` drops the top or bottom cap. */
function prism(part: Part, poly: XY[], z0: number, z1: number, top = true, bottom = false) {
  const p = ccw(poly)
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length]
    part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  const tris = earcut(p)
  if (top) for (const [i, j, k] of tris) part.tri([...p[i], z1] as V3, [...p[j], z1] as V3, [...p[k], z1] as V3)
  if (bottom) for (const [i, j, k] of tris) part.tri([...p[i], z0] as V3, [...p[k], z0] as V3, [...p[j], z0] as V3)
}
const box = (part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top = true, bottom = false) =>
  prism(part, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, top, bottom)
/** Both halves: a box and its mirror across x = 0. */
const box2 = (part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top = true, bottom = false) => {
  box(part, x0, x1, y0, y1, z0, z1, top, bottom)
  box(part, -x1, -x0, y0, y1, z0, z1, top, bottom)
}
function column(part: Part, c: XY, r: number, z0: number, z1: number, seg = 8, r1 = r) {
  for (let i = 0; i < seg; i++) {
    const a0 = (i / seg) * 2 * Math.PI, a1 = ((i + 1) / seg) * 2 * Math.PI
    const q = (a: number, z: number, rr: number): V3 => [c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a), z]
    const n = (a: number): V3 => [Math.cos(a), Math.sin(a), 0]
    part.tri(q(a0, z0, r), q(a1, z0, r), q(a1, z1, r1), undefined, undefined, undefined, [n(a0), n(a1), n(a1)])
    part.tri(q(a0, z0, r), q(a1, z1, r1), q(a0, z1, r1), undefined, undefined, undefined, [n(a0), n(a1), n(a0)])
  }
}
/** A column with a square base block and a square capital slab. */
function order(c: XY, r: number, z0: number, z1: number) {
  box(stone, c[0] - r * 1.3, c[0] + r * 1.3, c[1] - r * 1.3, c[1] + r * 1.3, z0, z0 + 0.5)
  column(stone, c, r, z0 + 0.5, z1 - 0.45, 8, r * 0.88)
  box(stone, c[0] - r * 1.35, c[0] + r * 1.35, c[1] - r * 1.35, c[1] + r * 1.35, z1 - 0.45, z1, false, true)
}
function lathe(part: Part, prof: [number, number][], seg = 16, c: XY = [0, 0], a0 = 0, a1 = 2 * Math.PI) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const dr = r1 - r0, dz = z1 - z0, l = Math.hypot(dr, dz) || 1
    for (let i = 0; i < seg; i++) {
      const t0 = a0 + ((a1 - a0) * i) / seg, t1 = a0 + ((a1 - a0) * (i + 1)) / seg
      const p = (r: number, z: number, t: number): V3 => [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t), z]
      const nn = (t: number): V3 => unit([(Math.cos(t) * dz) / l, (Math.sin(t) * dz) / l, -dr / l])
      if (r1 < 1e-6) { part.tri(p(r0, z0, t0), p(r0, z0, t1), [c[0], c[1], z1], undefined, undefined, undefined, [nn(t0), nn(t1), up]); continue }
      part.tri(p(r0, z0, t0), p(r0, z0, t1), p(r1, z1, t1), undefined, undefined, undefined, [nn(t0), nn(t1), nn(t1)])
      part.tri(p(r0, z0, t0), p(r1, z1, t1), p(r1, z1, t0), undefined, undefined, undefined, [nn(t0), nn(t1), nn(t0)])
    }
  }
}
/**
 * An arch-headed niche let into a wall: `o` is the wall plane's point under
 * the niche's centre, `n` its outward normal (in plan), `w` the width, z0 to
 * the crown z1, `d` deep. Drawn as the recess only (the wall face around it
 * is the caller's).
 */
function niche(part: Part, o: XY, n: XY, w: number, z0: number, z1: number, d = 0.45, seg = 6) {
  const t: XY = [-n[1], n[0]], r = w / 2, spring = z1 - r
  const P = (s: number, dd: number, z: number): V3 => [o[0] + t[0] * s - n[0] * dd, o[1] + t[1] * s - n[1] * dd, z]
  // back wall: rectangle up to the springing plus a half-disc fan
  part.quad(P(-r, d, z0), P(r, d, z0), P(r, d, spring), P(-r, d, spring))
  const c = P(0, d, spring)
  for (let k = 0; k < seg; k++) {
    const a0 = (k / seg) * Math.PI, a1 = ((k + 1) / seg) * Math.PI
    part.tri(c, P(r * Math.cos(a0), d, spring + r * Math.sin(a0)), P(r * Math.cos(a1), d, spring + r * Math.sin(a1)))
    // the soffit
    part.quad(P(r * Math.cos(a1), d, spring + r * Math.sin(a1)), P(r * Math.cos(a0), d, spring + r * Math.sin(a0)), P(r * Math.cos(a0), 0, spring + r * Math.sin(a0)), P(r * Math.cos(a1), 0, spring + r * Math.sin(a1)))
  }
  part.quad(P(r, d, z0), P(r, 0, z0), P(r, 0, spring), P(r, d, spring))
  part.quad(P(-r, 0, z0), P(-r, d, z0), P(-r, d, spring), P(-r, 0, spring))
  part.quad(P(-r, 0, z0), P(r, 0, z0), P(r, d, z0), P(-r, d, z0)) // sill
}
/** A wall face with niches cut in: the face is drawn as strips round them. */
function nichedWall(part: Part, a: XY, b: XY, z0: number, z1: number, niches: { s: number; w: number; z0: number; z1: number }[]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const P = (s: number, z: number): V3 => [a[0] + t[0] * s, a[1] + t[1] * s, z]
  const ns = [...niches].sort((p, q) => p.s - q.s)
  let s0 = 0
  for (const q of ns) {
    const l = q.s - q.w / 2, r = q.s + q.w / 2, rad = q.w / 2, spring = q.z1 - rad
    part.quad(P(s0, z0), P(l, z0), P(l, z1), P(s0, z1))
    part.quad(P(l, z0), P(r, z0), P(r, q.z0), P(l, q.z0))
    // above the niche: strip between the arch and the wall top
    const N = 6
    for (let k = 0; k < N; k++) {
      const a0 = Math.PI - (k / N) * Math.PI, a1 = Math.PI - ((k + 1) / N) * Math.PI
      const x0 = q.s + rad * Math.cos(a0), x1 = q.s + rad * Math.cos(a1)
      part.quad(P(x0, spring + rad * Math.sin(a0)), P(x1, spring + rad * Math.sin(a1)), P(x1, z1), P(x0, z1))
    }
    // pier strips beside the niche's straight sides are covered by the outer strips
    niche(part, [a[0] + t[0] * q.s, a[1] + t[1] * q.s], n, q.w, q.z0, q.z1)
    s0 = r
  }
  part.quad(P(s0, z0), P(L, z0), P(L, z1), P(s0, z1))
}

// ---- Heights (above 111.7 m NAVD88) ---------------------------------------------
const COURT = 4.9, TERRACE = 4.5
const WING = 15.5, WING_CORNICE = 16.3, WING_ROOF = 17.3
const COL = 10.4, COL_ENT = 11.4, BAL = 12.4 // the Ionic order round the court and the screen
const ARCH_TOP = 16.4

// ---- Wings: x 17.8 to 30.1, from the back (y -43.1) to the street (y 44.7) --------
for (const sx of [1, -1]) {
  const X = (x: number) => x * sx
  // body, solid, its walls drawn per face so the niches can be cut in
  const xi = 17.8, xo = 30.1, yb = -43.1, yf = 44.7
  const cornerPts: XY[] = [[X(xi), yb], [X(xo), yb], [X(xo), yf], [X(xi), yf]]
  // walls: the front with three niches; the sides, back and inner walls plain
  const sideNiches: { s: number; w: number; z0: number; z1: number }[] = [] // the long sides are plain (photos)
  const front = { a: [X(xo), yf] as XY, b: [X(xi), yf] as XY }
  const side = { a: [X(xo), yb] as XY, b: [X(xo), yf] as XY }
  if (sx > 0) {
    nichedWall(stone, side.a, side.b, 0, WING, sideNiches)
    nichedWall(stone, front.a, front.b, 0, WING, [{ s: 2.6, w: 1.2, z0: 6.0, z1: 10.6 }, { s: 6.15, w: 2.7, z0: 5.4, z1: 10.1 }, { s: 9.7, w: 1.2, z0: 6.0, z1: 10.6 }])
  } else {
    nichedWall(stone, [X(xo), yf], [X(xo), yb], 0, WING, sideNiches.map((q) => ({ ...q, s: 87.8 - q.s })))
    nichedWall(stone, [X(xi), yf], [X(xo), yf], 0, WING, [{ s: 2.6, w: 1.2, z0: 6.0, z1: 10.6 }, { s: 6.15, w: 2.7, z0: 5.4, z1: 10.1 }, { s: 9.7, w: 1.2, z0: 6.0, z1: 10.6 }])
  }
  // back wall and the inner wall above the colonnade roof (the colonnade hides the rest)
  const quadS = (a: V3, b: V3, c: V3, d: V3) => (sx > 0 ? stone.quad(a, b, c, d) : stone.quad(d, c, b, a))
  quadS([X(xi), yb, 0], [X(xo), yb, 0], [X(xo), yb, WING_CORNICE], [X(xi), yb, WING_CORNICE])
  quadS([X(xi), yf, 0], [X(xi), yb, 0], [X(xi), yb, WING_CORNICE], [X(xi), yf, WING_CORNICE])
  // wall tops above the order: attic band with the relief panel on the front
  quadS([X(xo), yb, WING], [X(xo), yf, WING], [X(xo), yf, WING_CORNICE], [X(xo), yb, WING_CORNICE])
  quadS([X(xo), yf, WING], [X(xi), yf, WING], [X(xi), yf, WING_CORNICE], [X(xo), yf, WING_CORNICE])
  // cornice: a projecting band round the outer and front faces at the order's top
  box(stone, Math.min(X(xo - 0.1), X(xo + 0.6)), Math.max(X(xo - 0.1), X(xo + 0.6)), yb - 0.6, yf + 0.6, COL_ENT - 0.6, COL_ENT + 0.2)
  box(stone, Math.min(X(xi), X(xo + 0.6)), Math.max(X(xi), X(xo + 0.6)), yf - 0.1, yf + 0.6, COL_ENT - 0.6, COL_ENT + 0.2)
  box(stone, Math.min(X(xi - 0.2), X(xo + 0.5)), Math.max(X(xi - 0.2), X(xo + 0.5)), yb - 0.5, yf + 0.5, WING, WING + 0.5)
  // relief panel on the front attic band, and the corner pilasters
  box(stone, Math.min(X(xi + 1.4), X(xo - 1.4)), Math.max(X(xi + 1.4), X(xo - 1.4)), yf, yf + 0.25, 12.9, 14.6)
  for (const x of [xi + 0.6, xo - 0.6]) box(stone, Math.min(X(x - 0.7), X(x + 0.7)), Math.max(X(x - 0.7), X(x + 0.7)), yf, yf + 0.3, TERRACE, COL_ENT - 0.6)
  // roof: a low hip inside the parapet
  const r0 = WING_CORNICE - 0.4, rr: XY[] = [[X(xi + 0.4), yb + 0.4], [X(xo - 0.4), yb + 0.4], [X(xo - 0.4), yf - 0.4], [X(xi + 0.4), yf - 0.4]]
  const ridge = (x: number) => X(x)
  const xm = (xi + xo) / 2
  const Rq = (a: V3, b: V3, c: V3, d: V3) => (sx > 0 ? roof.quad(a, b, c, d) : roof.quad(d, c, b, a))
  const Rt = (a: V3, b: V3, c: V3) => (sx > 0 ? roof.tri(a, b, c) : roof.tri(a, c, b))
  // the long slopes carry a skylight band below the ridge (aqua in NAIP)
  const slope = (e0: V3, e1: V3, r1: V3, r0p: V3) => {
    const m = (e: V3, r: V3): V3 => [e[0] + (r[0] - e[0]) * 0.62, e[1] + (r[1] - e[1]) * 0.62, e[2] + (r[2] - e[2]) * 0.62]
    const m0 = m(e0, r0p), m1 = m(e1, r1)
    Rq(e0, e1, m1, m0)
    if (sx > 0) glass.quad(m0, m1, r1, r0p); else glass.quad(r0p, r1, m1, m0)
  }
  slope([X(xi + 0.4), yf - 0.4, r0], [X(xi + 0.4), yb + 0.4, r0], [ridge(xm), yb + 6, WING_ROOF], [ridge(xm), yf - 6, WING_ROOF])
  slope([X(xo - 0.4), yb + 0.4, r0], [X(xo - 0.4), yf - 0.4, r0], [ridge(xm), yf - 6, WING_ROOF], [ridge(xm), yb + 6, WING_ROOF])
  Rt([X(xi + 0.4), yb + 0.4, r0], [X(xo - 0.4), yb + 0.4, r0], [ridge(xm), yb + 6, WING_ROOF])
  Rt([X(xo - 0.4), yf - 0.4, r0], [X(xi + 0.4), yf - 0.4, r0], [ridge(xm), yf - 6, WING_ROOF])
  // the parapet's top ring
  for (const [a, b] of [[rr[0], rr[1]], [rr[1], rr[2]], [rr[2], rr[3]], [rr[3], rr[0]]] as [XY, XY][]) void a, void b
  Rq([X(xi), yb, WING_CORNICE], [X(xo), yb, WING_CORNICE], [X(xo - 0.4), yb + 0.4, WING_CORNICE], [X(xi + 0.4), yb + 0.4, WING_CORNICE])
  Rq([X(xo), yb, WING_CORNICE], [X(xo), yf, WING_CORNICE], [X(xo - 0.4), yf - 0.4, WING_CORNICE], [X(xo - 0.4), yb + 0.4, WING_CORNICE])
  Rq([X(xo), yf, WING_CORNICE], [X(xi), yf, WING_CORNICE], [X(xi + 0.4), yf - 0.4, WING_CORNICE], [X(xo - 0.4), yf - 0.4, WING_CORNICE])
  Rq([X(xi), yf, WING_CORNICE], [X(xi), yb, WING_CORNICE], [X(xi + 0.4), yb + 0.4, WING_CORNICE], [X(xi + 0.4), yf - 0.4, WING_CORNICE])
  void cornerPts
}

// ---- Court colonnades (x 15.0 to 17.8) and the front screen (y 39.8 to 43.6) --------
for (const sx of [1, -1]) {
  const X = (x: number) => x * sx
  const bx = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top = true, bottom = false) =>
    box(stone, Math.min(X(x0), X(x1)), Math.max(X(x0), X(x1)), y0, y1, z0, z1, top, bottom)
  // side colonnade: stylobate from the ground, 16 columns, entablature, balustrade
  bx(15.0, 17.8, -4.1, 39.8, 0, COURT)
  for (let k = 0; k < 16; k++) order([X(15.65), -1.85 + k * 2.7], 0.42, COURT, COL)
  bx(15.0, 17.8, -4.1, 43.6, COL, COL_ENT, true, true)
  bx(15.0, 15.4, -1.6, 39.8, COL_ENT, BAL)
  // the colonnade's return along the back of the court, beside the portico
  bx(6.4, 15.0, -4.1, -1.2, 0, COURT)
  for (const x of [8.1, 10.5, 12.9]) order([X(x), -1.85], 0.42, COURT, COL)
  bx(6.4, 17.8, -4.1, -1.2, COL, COL_ENT, true, true)
  bx(6.4, 15.0, -1.6, -1.2, COL_ENT, BAL)
  // windows and doors in the wall behind
  for (let k = 0; k < 8; k++) {
    const y = 1.6 + k * 5.1, x = X(17.8 - 0.05)
    const q: V3[] = [[x, y + 1.0, COURT + 0.4], [x, y - 1.0, COURT + 0.4], [x, y - 1.0, COURT + 4.2], [x, y + 1.0, COURT + 4.2]]
    if (sx > 0) win.quad(q[0], q[1], q[2], q[3]); else win.quad(q[3], q[2], q[1], q[0])
  }
  // front screen: two rows of five columns each side of the arch
  bx(5.5, 17.8, 39.8, 43.6, 0, TERRACE)
  for (let k = 0; k < 5; k++) for (const y of [40.4, 43.0]) order([X(7.2 + k * 2.15), y], 0.42, TERRACE, COL)
  bx(5.5, 17.8, 39.8, 43.6, COL, COL_ENT, true, true)
  bx(5.5, 17.8, 43.2, 43.6, COL_ENT, BAL)
  bx(5.5, 15.0, 39.8, 40.2, COL_ENT, BAL)
}

// ---- Triumphal arch (x ±5.5, y 39.1 to 44.0) ------------------------------------
{
  const y0 = 39.1, y1 = 44.0, AW = 2.8, SPR = 11.5, HW = 5.5, N = 10
  /** One face of the arch block, the opening cut out (as the palace's rotunda faces). */
  const face = (y: number, outward: boolean) => {
    const P = (x: number, z: number): V3 => [outward ? -x : x, y, z]
    const Q = (a: V3, b: V3, c: V3, d: V3) => stone.quad(a, b, c, d)
    Q(P(-HW, 0), P(-AW, 0), P(-AW, SPR), P(-HW, SPR))
    Q(P(AW, 0), P(HW, 0), P(HW, SPR), P(AW, SPR))
    const H = ARCH_TOP - SPR, uLen = 2 * H + 2 * HW
    const U = (f: number): [number, number] => {
      let d = f * uLen
      if (d <= H) return [HW, SPR + d]
      d -= H
      if (d <= 2 * HW) return [HW - d, ARCH_TOP]
      return [-HW, ARCH_TOP - (d - 2 * HW)]
    }
    for (let k = 0; k < N; k++) {
      const t0 = (k / N) * Math.PI, t1 = ((k + 1) / N) * Math.PI
      const [u0, w0] = U(k / N), [u1, w1] = U((k + 1) / N)
      Q(P(AW * Math.cos(t0), SPR + AW * Math.sin(t0)), P(u0, w0), P(u1, w1), P(AW * Math.cos(t1), SPR + AW * Math.sin(t1)))
    }
  }
  face(y1, true)
  face(y0, false)
  // the sides, the opening's jambs and its barrel vault, the top
  for (const sx of [1, -1]) {
    const Q = (a: V3, b: V3, c: V3, d: V3) => (sx > 0 ? stone.quad(a, b, c, d) : stone.quad(d, c, b, a))
    Q([sx * HW, y0, 0], [sx * HW, y1, 0], [sx * HW, y1, ARCH_TOP], [sx * HW, y0, ARCH_TOP])
    Q([sx * AW, y1, 0], [sx * AW, y0, 0], [sx * AW, y0, SPR], [sx * AW, y1, SPR])
  }
  for (let k = 0; k < N; k++) {
    const a0 = (k / N) * Math.PI, a1 = ((k + 1) / N) * Math.PI
    stone.quad([AW * Math.cos(a1), y0, SPR + AW * Math.sin(a1)], [AW * Math.cos(a0), y0, SPR + AW * Math.sin(a0)], [AW * Math.cos(a0), y1, SPR + AW * Math.sin(a0)], [AW * Math.cos(a1), y1, SPR + AW * Math.sin(a1)])
  }
  stone.quad([-HW, y0, ARCH_TOP], [HW, y0, ARCH_TOP], [HW, y1, ARCH_TOP], [-HW, y1, ARCH_TOP])
  box(stone, -5.9, 5.9, y0 - 0.4, y1 + 0.4, 15.0, 15.6, true, true) // attic cornice
  for (const sx of [1, -1]) {
    // the impost: the screen's entablature carried across the piers
    box(stone, Math.min(sx * AW, sx * 5.9), Math.max(sx * AW, sx * 5.9), y0 - 0.3, y1 + 0.3, COL_ENT - 0.6, COL_ENT + 0.2, true, true)
    for (const y of [y0 - 0.5, y1 + 0.5]) order([sx * 3.4, y], 0.42, TERRACE, COL_ENT - 0.6)
  }
}

// ---- Portico and central gallery --------------------------------------------------
{
  // portico: six Corinthian columns on the court floor (and one return
  // column a side), entablature, and the tall plain attic with the inscription
  box(stone, -6.4, 6.4, -0.3, 5.3, 0, COURT)
  for (const x of [-5.4, -3.25, -1.1, 1.1, 3.25, 5.4]) order([x, 4.6], 0.6, COURT, 13.4)
  for (const sx of [1, -1]) order([sx * 5.4, 1.9], 0.6, COURT, 13.4)
  box(stone, -6.4, 6.4, -0.3, 5.3, 13.4, 14.7, false, true)
  box(stone, -6.8, 6.8, -0.3, 5.7, 14.7, 15.5, true, true)
  box(stone, -6.3, 6.3, -0.3, 5.2, 15.5, 17.4)
  // gallery: walls to the eaves, gabled green roof
  box(stone, -6.4, 6.4, -39.5, -0.3, 0, 17.2, false)
  door.quad([-1.6, -0.24, COURT], [1.6, -0.24, COURT], [1.6, -0.24, COURT + 5.5], [-1.6, -0.24, COURT + 5.5])
  for (const sx of [1, -1]) {
    const q: V3[] = [[sx * 4.0, -0.24, COURT + 1.0], [sx * 2.6, -0.24, COURT + 1.0], [sx * 2.6, -0.24, COURT + 6.0], [sx * 4.0, -0.24, COURT + 6.0]]
    if (sx < 0) win.quad(q[1], q[0], q[3], q[2]); else win.quad(q[0], q[1], q[2], q[3])
  }
  const E = 17.2, R = 20.1
  glass.quad([0, -0.3, R], [0, -39.5, R], [6.6, -39.5, E], [6.6, -0.3, E])
  glass.quad([0, -39.5, R], [0, -0.3, R], [-6.6, -0.3, E], [-6.6, -39.5, E])
  stone.tri([-6.6, -0.3, E], [6.6, -0.3, E], [0, -0.3, R])
}

// ---- Rear galleries (x 6.4 to 17.8, y -43.1 to -4) ----------------------------------
for (const sx of [1, -1]) {
  const X = (x: number) => x * sx
  const bx = (part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top = true) =>
    box(part, Math.min(X(x0), X(x1)), Math.max(X(x0), X(x1)), y0, y1, z0, z1, top)
  bx(stone, 6.4, 17.8, -18, -4.1, 0, 16.5)
  bx(stone, 6.4, 17.8, -43.1, -18, 0, 14.2)
  // a glazed lantern along the middle of the lower block
  const xa = X(9), xb = X(15.2), xm = X(12.1), y0 = -40, y1 = -20, z0 = 14.2, z1 = 15.8
  const Gq = (a: V3, b: V3, c: V3, d: V3) => (sx > 0 ? glass.quad(a, b, c, d) : glass.quad(d, c, b, a))
  const Gt = (a: V3, b: V3, c: V3) => (sx > 0 ? glass.tri(a, b, c) : glass.tri(a, c, b))
  Gq([xa, y1, z0], [xa, y0, z0], [xm, y0, z1], [xm, y1, z1])
  Gq([xb, y0, z0], [xb, y1, z0], [xm, y1, z1], [xm, y0, z1])
  Gt([xa, y0, z0], [xb, y0, z0], [xm, y0, z1])
  Gt([xb, y1, z0], [xa, y1, z0], [xm, y1, z1])
}

// ---- The rotunda at the back: half-round wall, drum, saucer dome --------------------
{
  const C: XY = [0, -41.9]
  // half-round wall projecting past the back (y < -41.9), r 6.7 (OSM), to 15.8
  lathe(stone, [[6.7, 0], [6.7, 15.0], [7.1, 15.3], [7.1, 15.8], [6.2, 15.8]], 10, C, Math.PI, 2 * Math.PI)
  // drum and dome over the crossing, centred a little further in (lidar)
  const D: XY = [0, -39.5]
  lathe(stone, [[5.9, 15.8], [5.9, 19.0], [6.2, 19.3], [5.5, 19.6]], 16, D)
  const prof: [number, number][] = []
  for (let i = 0; i <= 5; i++) { const t = (i / 5) * (Math.PI / 2); prof.push([5.5 * Math.cos(t) + 0.0001, 19.6 + 2.8 * Math.sin(t)]) }
  prof[prof.length - 1][0] = 0.9
  prof.push([0.9, 23.4], [0.5, 23.8], [0, 24.2])
  lathe(patina, prof, 16, D)
}

// ---- Write -----------------------------------------------------------------
const parts = [
  { part: stone, material: finish('limestone', 0xece6da) },
  { part: roof, material: { ...PALETTE.roof, color: 0xccd0d1 } }, // pale membrane roofs in NAIP
  { part: patina, material: finish('verdigris', 0x9dbdb1) }, // the dome, pale green in NAIP
  { part: glass, material: { ...PALETTE.glass, color: 0xb0cfcb } }, // aqua skylights and the gallery's glazed roof in NAIP
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
for (const { part, material } of parts) console.log(`  ${material.name}: ${part.triangles}`)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('California Palace of the Legion of Honor', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 24.2,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: REPLACES,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-legion-of-honor.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
