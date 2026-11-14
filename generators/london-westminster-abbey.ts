/**
 * Westminster Abbey (the Collegiate Church of Saint Peter at Westminster),
 * London — procedural, CC0-1.0, no textures. bun generators/london-westminster-abbey.ts
 *
 * Also the small kit for the London church group (london-westminster-abbey,
 * london-westminster-cathedral, london-st-martin-in-the-fields): the wall
 * with real openings, turrets, ogee caps and the flyer below are exported,
 * and the model is only built when this file is run directly. They sit on
 * the DC church kit (dc-national-cathedral.ts, dc-white-house.ts,
 * dc-smithsonian-castle.ts).
 *
 * Map frame: x along the church's axis towards the altar (compass 95°), y to
 * its left (liturgical north, compass 5°), z up, metres. Placement bearing 5.
 * Anchor: the area centroid of the OSM outline way/364313092
 * (lng -0.1274101, lat 51.4994041). The nave's axis sits at y = +0.3.
 *
 * What it is: the Gothic abbey church of Henry III (1245–) and its nave
 * (completed c. 1500), with Henry VII's Lady Chapel (1503–19) at the east
 * end and Nicholas Hawksmoor's west towers (1722–45). Pale stone under
 * grey lead roofs; the Lady Chapel in a warmer honey stone.
 *
 * Covers and replaces the outline way/364313092 and every building:part
 * inside it (329 parts, the whole OSM 3D mapping of the church: towers,
 * turrets, pinnacles, nave, flyers, transepts, crossing, choir, chevet and
 * the Lady Chapel). The Great Cloister (way/1149648663) is a separate
 * building and is not modelled; the strip of its north walk that the
 * outline takes in along the nave's south aisle (y −12.6 … −16.8) and the
 * east walk beside the south transept are drawn as the low 8 m lean-to they
 * are, so the outline can be hidden.
 *
 * Evidence
 * - OSM (measured): outline and parts, read in this frame with a local
 *   script: west towers x −76.2…−63.5, north tower y 4.2…16.9, south tower
 *   y −15.8…−3.3, octagonal corner turrets 3.6 m across; centre bay of the
 *   west front with its flanking buttresses to x −78.6; nave roof y −6.4…7.0
 *   (vessel 13.4 m); aisle walls y +13.3 and −12.6, the south walk of the
 *   outline at −16.8 and the outer flyer piers to −21.2; buttress bays at
 *   x −58.9, −53.0, −47.4, −41.5, −35.7, −29.9, −24.1, −18.3, −12.6, −7.3;
 *   transepts x −0.5…12.8, north front y 30.4 with porches to 35.2, south
 *   front y −31.8; choir to x 29.6 and its apse to 37.9; chevet chapels to
 *   y ±19…21; Lady Chapel x 47.6…81.5, vessel y ±6.2, aisle chapels to ±11.5,
 *   its turrets every 4.3 m.
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (flights c. 2000–2022), measured above the street (2.8 m above the
 *   box's ground_min): west tower parapets 59.2 m, pinnacles at least 65 m
 *   (thin tips are under-read); nave and transept ridges 41.7 m, eaves about
 *   33 m; aisle and chevet lead roofs 22 m; crossing tower parapet 45.7 m
 *   (drawn 46.3 m, the thin parapet under-read), its low pyramid to 49.6 m;
 *   cloister walk 8 m; Lady Chapel parapet 24 m, its ridge 25.5 m, its
 *   aisle chapels 12–17 m (drawn 14 m, from the photos) and their turrets
 *   to ~18 m.
 *   Mapterhorn terrain: flat to within a metre.
 * - Published: west towers 68.6 m (225 ft) to the pinnacles (Wikipedia,
 *   "Westminster Abbey"); nave vault 31 m inside (102 ft); Historic
 *   England list entry 1291494 (Grade I).
 * - Photos (Wikimedia Commons):
 *   "Westminster from the dome on Methodist Central Hall.jpg" (Colin,
 *   CC BY-SA 4.0; high view of the west front from the west-south-west, used
 *   for every stage height of the towers and the west front);
 *   "London - View from London Eye - Westminster Abbey - panoramio.jpg"
 *   (giggel, CC BY 3.0; high view from the north-east: crossing lantern,
 *   roofs, north transept, towers); "Westminster Abbey from inside the
 *   London Eye (8658660241).jpg" (Mikey from Wythenshawe, CC BY 2.0);
 *   "The West front of Westminster Abbey and Victoria Tower.jpg" (Ozeye,
 *   CC BY-SA 3.0); "North Transept, Westminster Abbey - geograph.org.uk -
 *   2517097.jpg" (Philip Pankhurst, CC BY-SA 2.0); "London, Westminster
 *   Abbey -- 2016 -- 4811.jpg" (Dietmar Rabich, CC BY-SA 4.0; north transept
 *   flyers and turrets); "Westminster Abbey and St Margaret's.jpg" (Tristan
 *   Surtel, CC BY-SA 4.0; north side); "View of Westminster Abbey from
 *   Parliament Square - geograph.org.uk - 4112697.jpg" (Robert Lamb,
 *   CC BY-SA 2.0); "London - Old Palace Yard - Henry VII Lady Chapel of
 *   Westminster Abbey - Retouched by Gothic Revival Architect Sir George
 *   Gilbert Scott.jpg" and "London - St Margaret Street - Henry VII Lady
 *   Chapel ..." (Txllxt TxllxT, CC BY-SA 4.0; the Lady Chapel's turrets).
 * - Read off the photos (estimated, scaled to the lidar parapet): tower
 *   cornice 32.2 m, clock stage to 41.2 m, belfry openings 42.7–52.2 m;
 *   west window 13–29.5 m; west gable 34.5–42.5 m; north rose 10.6 m
 *   across, centred at 29 m; its flanking turrets to 45.5 m, the outer ones
 *   to 40 m; north porches to 12 m with gables to 17.8 m.
 * - Levels of detail: the detail model (models/<id>.detail.glb) has every
 *   feature; the low model drops the second flyer tier, aisle and chapel
 *   windows, merlons, transoms and small pinnacles to fit 250 KB.
 * - Simplified: tracery, statues, crockets and the pierced parapets are
 *   left out; flyers are two bold struts per bay; the Lady Chapel's bow
 *   windows are flat panels on straight walls; the chevet chapels are one
 *   flat-roofed ring on the outline.
 * - Look-only references: none.
 *
 * Night: the west front and towers are floodlit, the rest more softly.
 */
import { Part, cross, len, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cylinder } from './dc-white-house'
import { beam, cbox, gable, grow, ngon, ngonPrism, qf, rect, roundWin, save, spire, tf, type Rect, type Side } from './dc-national-cathedral'

export { cylinder, beam, cbox, gable, grow, ngon, ngonPrism, qf, rect, roundWin, save, spire, tf }
export type { Rect, Side }

// ===========================================================================
// Kit for the London church group.

export type XY = [number, number]
/** A wall plane: a point at a, z and depth d off it is o + u·a + n·d + z. */
export type Face = { o: V3; u: V3; n: V3 }

const NRM: Record<Side, V3> = { n: [0, 1, 0], s: [0, -1, 0], e: [1, 0, 0], w: [-1, 0, 0] }
/** The wall plane of a side at `at` (y for n/s, x for e/w), a running along x or y. */
export function face(side: Side, at: number): Face {
  const ns = side === 'n' || side === 's'
  return { o: ns ? [0, at, 0] : [at, 0, 0], u: ns ? [1, 0, 0] : [0, 1, 0], n: NRM[side] }
}
/** The wall plane through two plan points, facing right of a→b (outward for a CCW ring). */
export function faceAB(a: XY, b: XY): Face {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
  const u: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0]
  return { o: [a[0], a[1], 0], u, n: [u[1], -u[0], 0] }
}
export const fp = (f: Face, a: number, z: number, d = 0): V3 => [f.o[0] + f.u[0] * a + f.n[0] * d, f.o[1] + f.u[1] * a + f.n[1] * d, z]
const inPlane = (f: Face, va: number, vz: number): V3 => [f.u[0] * va, f.u[1] * va, vz]
const neg = (v: V3): V3 => [-v[0], -v[1], -v[2]]

/** A flat panel a0..a1 × z0..z1 lifted d off a face. */
export function fpanel(p: Part, f: Face, a0: number, a1: number, z0: number, z1: number, d = 0.05) {
  qf(p, fp(f, a0, z0, d), fp(f, a1, z0, d), fp(f, a1, z1, d), fp(f, a0, z1, d), f.n)
}

/** Arch segment counts, coarser for the low model. */
export const kit = { seg: 3, round: 6 }
export type Head = 'round' | 'pointed' | 'flat' | 'segment'
/** An opening a0..a1 from its sill zb, its head springing at zs. */
export type Hole = { a0: number; a1: number; zb: number; zs: number; head: Head; seg?: number }

/** The head curve from (a0, zs) over to (a1, zs); its middle point is the apex. */
export function headPts(h: Hole): XY[] {
  const w = h.a1 - h.a0, am = (h.a0 + h.a1) / 2
  if (h.head === 'flat') return [[h.a0, h.zs], [am, h.zs], [h.a1, h.zs]]
  if (h.head === 'round' || h.head === 'segment') {
    const s = h.seg ?? kit.round, n = s % 2 ? s + 1 : s
    const rise = h.head === 'round' ? w / 2 : w / 5
    return Array.from({ length: n + 1 }, (_, k) => {
      const t = Math.PI - (Math.PI * k) / n
      return [am + (w / 2) * Math.cos(t), h.zs + rise * Math.sin(t)] as XY
    })
  }
  // Equilateral pointed arch: two arcs of radius w.
  const s = h.seg ?? kit.seg, out: XY[] = []
  for (let k = 0; k <= s; k++) { const t = Math.PI - (Math.PI / 3) * (k / s); out.push([h.a1 + w * Math.cos(t), h.zs + w * Math.sin(t)]) }
  for (let k = 1; k <= s; k++) { const t = Math.PI / 3 - (Math.PI / 3) * (k / s); out.push([h.a0 + w * Math.cos(t), h.zs + w * Math.sin(t)]) }
  return out
}
export const apexOf = (h: Hole) => { const p = headPts(h); return p[(p.length - 1) / 2][1] }

/**
 * A wall a0..a1 × z0..z1 on a face with real openings cut through it: each
 * hole has reveals `depth` deep and, unless `through`, a back panel in
 * `back` (a louvre, a window, a recess). `through` makes the wall a slab
 * `depth` thick, open to the sky behind, with its inner face drawn too: an
 * open arcade or loggia.
 */
export function wallHoles(p: Part, f: Face, a0: number, a1: number, z0: number, z1: number, holes: Hole[], o: { depth?: number; back?: Part; reveal?: Part; through?: boolean } = {}) {
  const d = o.depth ?? 0.6, rev = o.reveal ?? p
  const sides: Array<[number, number]> = o.through ? [[0, 1], [-d, -1]] : [[0, 1]]
  const hs = [...holes].sort((x, y) => x.a0 - y.a0)
  for (const [dd, sg] of sides) {
    const nn: V3 = sg > 0 ? f.n : neg(f.n)
    const Q = (aa0: number, aa1: number, zz0: number, zz1: number) => { if (aa1 - aa0 > 1e-6 && zz1 - zz0 > 1e-6) qf(p, fp(f, aa0, zz0, dd), fp(f, aa1, zz0, dd), fp(f, aa1, zz1, dd), fp(f, aa0, zz1, dd), nn) }
    let cur = a0
    for (const h of hs) {
      Q(cur, h.a0, z0, z1)
      Q(h.a0, h.a1, z0, h.zb)
      const pts = headPts(h), m = (pts.length - 1) / 2
      const TL = fp(f, h.a0, z1, dd), TR = fp(f, h.a1, z1, dd)
      for (let k = 0; k < pts.length - 1; k++) {
        const A = fp(f, pts[k][0], pts[k][1], dd), B = fp(f, pts[k + 1][0], pts[k + 1][1], dd)
        tf(p, k < m ? TL : TR, A, B, nn)
      }
      tf(p, TL, fp(f, pts[m][0], pts[m][1], dd), TR, nn)
      cur = h.a1
    }
    Q(cur, a1, z0, z1)
  }
  for (const h of hs) {
    const pts = headPts(h), am = (h.a0 + h.a1) / 2
    // Jambs and sill.
    qf(rev, fp(f, h.a0, h.zb, 0), fp(f, h.a0, h.zs, 0), fp(f, h.a0, h.zs, -d), fp(f, h.a0, h.zb, -d), inPlane(f, 1, 0))
    qf(rev, fp(f, h.a1, h.zb, 0), fp(f, h.a1, h.zs, 0), fp(f, h.a1, h.zs, -d), fp(f, h.a1, h.zb, -d), inPlane(f, -1, 0))
    if (h.zb > z0 + 1e-6 || o.through) qf(rev, fp(f, h.a0, h.zb, 0), fp(f, h.a1, h.zb, 0), fp(f, h.a1, h.zb, -d), fp(f, h.a0, h.zb, -d), [0, 0, 1])
    // The soffit of the head.
    for (let k = 0; k < pts.length - 1; k++) {
      const [pa, pz] = pts[k], [qa, qz] = pts[k + 1]
      const ma = (pa + qa) / 2 - am, mz = (pz + qz) / 2 - h.zs + 0.01
      qf(rev, fp(f, pa, pz, 0), fp(f, qa, qz, 0), fp(f, qa, qz, -d), fp(f, pa, pz, -d), inPlane(f, -ma, -mz))
    }
    if (!o.through && o.back) {
      const B = o.back
      qf(B, fp(f, h.a0, h.zb, -d), fp(f, h.a1, h.zb, -d), fp(f, h.a1, h.zs, -d), fp(f, h.a0, h.zs, -d), f.n)
      for (let k = 0; k < pts.length - 1; k++) tf(B, fp(f, am, h.zs, -d), fp(f, pts[k][0], pts[k][1], -d), fp(f, pts[k + 1][0], pts[k + 1][1], -d), f.n)
    }
  }
}

/** A flat window in the outline of a hole (round, pointed or flat headed), d off a face. */
export function holePanel(p: Part, f: Face, h: Hole, d = 0.05) {
  const pts = headPts(h), am = (h.a0 + h.a1) / 2
  if (h.zs > h.zb) qf(p, fp(f, h.a0, h.zb, d), fp(f, h.a1, h.zb, d), fp(f, h.a1, h.zs, d), fp(f, h.a0, h.zs, d), f.n)
  for (let k = 0; k < pts.length - 1; k++) tf(p, fp(f, am, h.zs, d), fp(f, pts[k][0], pts[k][1], d), fp(f, pts[k + 1][0], pts[k + 1][1], d), f.n)
}

/** A round window (rose, oculus or clock) on any face. */
export function disc(p: Part, f: Face, a: number, z: number, r: number, seg = 16, d = 0.05) {
  for (let k = 0; k < seg; k++) {
    const t0 = (2 * Math.PI * k) / seg, t1 = (2 * Math.PI * (k + 1)) / seg
    tf(p, fp(f, a, z, d), fp(f, a + r * Math.cos(t0), z + r * Math.sin(t0), d), fp(f, a + r * Math.cos(t1), z + r * Math.sin(t1), d), f.n)
  }
}
/** A ring (an annulus) on a face: a rose window's frame or a clock's rim. */
export function ringOn(p: Part, f: Face, a: number, z: number, r0: number, r1: number, seg = 16, d = 0.08) {
  for (let k = 0; k < seg; k++) {
    const t0 = (2 * Math.PI * k) / seg, t1 = (2 * Math.PI * (k + 1)) / seg
    const P = (r: number, t: number) => fp(f, a + r * Math.cos(t), z + r * Math.sin(t), d)
    qf(p, P(r0, t0), P(r1, t0), P(r1, t1), P(r0, t1), f.n)
  }
}

/** A box between two plan rects of the same height range, drawn as four faces with openings and caps. */
export function boxHoles(p: Part, r: Rect, z0: number, z1: number, holes: Partial<Record<Side, Hole[]>>, o: { depth?: number; back?: Part; reveal?: Part; top?: Part | false; through?: boolean } = {}) {
  const F: Array<[Side, number, number, number]> = [['s', r.y0, r.x0, r.x1], ['n', r.y1, r.x0, r.x1], ['w', r.x0, r.y0, r.y1], ['e', r.x1, r.y0, r.y1]]
  for (const [side, at, a0, a1] of F) wallHoles(p, face(side, at), a0, a1, z0, z1, holes[side] ?? [], o)
  if (o.top !== false) (o.top ?? p).cap([[r.x0, r.y0, z1], [r.x1, r.y0, z1], [r.x1, r.y1, z1], [r.x0, r.y1, z1]], true)
}

/** A pinnacle: an n-gon shaft z0..z1, a thin band, and a spirelet to the tip. */
export function pinn(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, tip: number, n = 8, band?: Part) {
  ngonPrism(p, cx, cy, r, n, z0, z1, { top: false })
  if (band) {
    ngonPrism(band, cx, cy, r * 1.18, n, z1, z1 + r * 0.45, { top: false, bottom: true })
    spire(p, ngon(cx, cy, r * 1.05, n, z1 + r * 0.45), [cx, cy, tip])
  } else spire(p, ngon(cx, cy, r, n, z1), [cx, cy, tip])
}

/** An ogee (onion) cap on an n-gon of radius r at z, h tall to its point. */
export function ogee(p: Part, cx: number, cy: number, r: number, z: number, h: number, n = 8, coarse = false) {
  const prof: Array<[number, number]> = n > 6 ? [[1.0, 0], [1.22, 0.16], [1.12, 0.36], [0.62, 0.62], [0.22, 0.84]] : !coarse ? [[1.0, 0], [1.2, 0.24], [0.62, 0.62]] : [[1.0, 0], [1.25, 0.3]]
  const rings = prof.map(([k, t]) => ngon(cx, cy, r * k, n, z + t * h))
  p.loft(rings)
  spire(p, rings[rings.length - 1], [cx, cy, z + h])
}

/** Points on a closed polygon ring, anticlockwise: a regular half-polygon apse. */
export function apseRing(cx: number, cy: number, r: number, sides: number, a0 = -Math.PI / 2): XY[] {
  return Array.from({ length: sides + 1 }, (_, k) => [cx + r * Math.cos(a0 + (Math.PI * k) / sides), cy + r * Math.sin(a0 + (Math.PI * k) / sides)] as XY)
}

/** A vertical prism on a plan polygon (any winding; convex or not), walls only, plus an optional earcut top. */
export function polyPrism(p: Part, ring: XY[], z0: number, z1: number, top?: Part) {
  let a = 0
  for (let i = 0; i < ring.length; i++) { const q = ring[i], w = ring[(i + 1) % ring.length]; a += q[0] * w[1] - w[0] * q[1] }
  const r = a > 0 ? ring : [...ring].reverse()
  for (let i = 0; i < r.length; i++) {
    const A = r[i], B = r[(i + 1) % r.length]
    if (Math.hypot(B[0] - A[0], B[1] - A[1]) < 1e-6) continue
    p.quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1])
  }
  if (top) for (const [i, j, k] of earClip(r)) top.tri([r[i][0], r[i][1], z1], [r[j][0], r[j][1], z1], [r[k][0], r[k][1], z1])
}

/** Ear clipping for a simple anticlockwise polygon. */
export function earClip(P: XY[]): Array<[number, number, number]> {
  const idx = P.map((_, i) => i), out: Array<[number, number, number]> = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      if (cr(P[ia], P[ib], P[ic]) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && cr(P[ia], P[ib], P[j]) > 0 && cr(P[ib], P[ic], P[j]) > 0 && cr(P[ic], P[ia], P[j]) > 0)) continue
      out.push([ia, ib, ic]); idx.splice(i, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** A triangular gable wedge: a gable wall at x-face `at` running back to `back`, base half-width hw about yc. */
export function gableWedge(p: Part, xa: number, xb: number, yc: number, hw: number, z0: number, z1: number) {
  const x0 = Math.min(xa, xb), x1 = Math.max(xa, xb)
  tf(p, [x0, yc - hw, z0], [x0, yc + hw, z0], [x0, yc, z1], [-1, 0, 0])
  tf(p, [x1, yc - hw, z0], [x1, yc + hw, z0], [x1, yc, z1], [1, 0, 0])
  const sl = Math.hypot(hw, z1 - z0)
  qf(p, [x0, yc - hw, z0], [x1, yc - hw, z0], [x1, yc, z1], [x0, yc, z1], [0, -(z1 - z0) / sl, hw / sl])
  qf(p, [x0, yc + hw, z0], [x1, yc + hw, z0], [x1, yc, z1], [x0, yc, z1], [0, (z1 - z0) / sl, hw / sl])
}

/** A sloping strut between two centre points (w across, t deep), ends closed: a flyer. */
export const strut = beam

/** A strut with open ends (four sides only), for the low model. */
export function strutOpen(p: Part, A: V3, B: V3, w: number, t: number) {
  const L = len(sub(B, A)) || 1, ax: V3 = [(B[0] - A[0]) / L, (B[1] - A[1]) / L, (B[2] - A[2]) / L]
  const sd0 = cross(ax, [0, 0, 1]), sl = len(sd0) || 1, side: V3 = [sd0[0] / sl, sd0[1] / sl, sd0[2] / sl]
  const up = cross(side, ax)
  const C = (P: V3, a: number, b: number): V3 => [P[0] + side[0] * a + up[0] * b, P[1] + side[1] * a + up[1] * b, P[2] + side[2] * a + up[2] * b]
  const k: Array<[number, number]> = [[w / 2, t / 2], [-w / 2, t / 2], [-w / 2, -t / 2], [w / 2, -t / 2]]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, m = [(k[i][0] + k[j][0]) / 2, (k[i][1] + k[j][1]) / 2]
    qf(p, C(A, ...k[i]), C(A, ...k[j]), C(B, ...k[j]), C(B, ...k[i]), [side[0] * m[0] + up[0] * m[1], side[1] * m[0] + up[1] * m[1], side[2] * m[0] + up[2] * m[1]])
  }
}

/**
 * Write one level of detail with its budgets: the low model to
 * models/<id>.glb (6,500 triangles, 250 KB), the detail model to
 * models/<id>.detail.glb (40,000 triangles, 1.5 MB).
 */
export async function saveLod(id: string, name: string, parts: Array<{ part: Part; material: MaterialSpec }>, extras: Record<string, unknown>, detail = false, maxTris = detail ? 40000 : 5000) {
  const used = parts.filter(({ part }) => part.triangles)
  const triangles = used.reduce((s, { part }) => s + part.triangles, 0)
  const maxBytes = detail ? 1.5 * 1024 * 1024 : 250 * 1024
  if (triangles > maxTris) throw new Error(`${id}: triangle budget exceeded: ${triangles}`)
  if (used.length > 6) throw new Error(`${id}: ${used.length} materials`)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...extras })
  if (glb.length > maxBytes) throw new Error(`${id}: file budget exceeded: ${triangles} triangles, ${glb.length} bytes`)
  const out = new URL(`../models/${id}${detail ? '.detail' : ''}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}

void cross; void len; void sub

// ===========================================================================
// The abbey.

export function build(lo = true) {
  kit.seg = lo ? 2 : 3; kit.round = lo ? 4 : 6
  const PN = lo ? 6 : 8, SN = lo ? 4 : 6, OG = lo ? 6 : 8
  const fly = (p: Part, A: V3, B: V3, w: number, t: number) => (lo ? strutOpen(p, A, B, w, t) : beam(p, A, B, w, t))
  // In the low model a small pinnacle is its spirelet alone, standing on its pier.
  const pin = (p: Part, cx: number, cy: number, r: number, z0: number, z1: number, tip: number, n: number, band?: Part) => (lo && n <= 4 ? spire(p, ngon(cx, cy, r * 1.1, 4, z0, Math.PI / 4), [cx, cy, tip]) : pinn(p, cx, cy, r, z0, z1, tip, n, band))
  const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), lady = new Part(), shade = new Part()

  const YC = 0.3 // the vessels' axis
  const Y = (v: number) => YC + v
  const HW = 6.65 // half-width of nave, choir and transepts
  const EAVE = 33, RIDGE = 41.7, AISLE = 19.5, AROOF = 22
  const NAVE_X0 = -76.2, CROSS0 = -0.5, CROSS1 = 12.8, CHOIR_X1 = 29.6

  // ---- The main vessels: walls to the eaves under steep lead roofs.
  const nave = rect(-63.5, CROSS0, Y(-HW), Y(HW))
  const choir = rect(CROSS1, CHOIR_X1, Y(-HW), Y(HW))
  const transN = rect(CROSS0, CROSS1, Y(HW), 30.4)
  const transS = rect(CROSS0, CROSS1, -31.8, Y(-HW))
  for (const r of [nave, choir]) cbox(stone, r, 0, EAVE, { top: false })
  for (const r of [transN, transS]) cbox(stone, r, 0, EAVE, { top: false })
  // Eaves parapets: a bevelled band round each vessel.
  for (const r of [nave, choir]) cbox(trim, grow(r, 0, 0.35), EAVE - 0.9, EAVE + 0.5, lo ? { top: false } : { b: 0.3, top: false, bottom: true })
  for (const r of [transN, transS]) cbox(trim, grow(r, 0.35, 0), EAVE - 0.9, EAVE + 0.5, lo ? { top: false } : { b: 0.3, top: false, bottom: true })
  gable(roof, stone, rect(NAVE_X0 + 1.2, CROSS1, Y(-HW - 0.2), Y(HW + 0.2)), EAVE, RIDGE, false, [false, false])
  gable(roof, stone, rect(CROSS1, CHOIR_X1, Y(-HW - 0.2), Y(HW + 0.2)), EAVE, RIDGE, false, [false, false])
  gable(roof, stone, rect(CROSS0 - 0.2, CROSS1 + 0.2, -31.8, 30.4), EAVE, RIDGE, true, [true, true])
  // The choir's apse: five sides of a decagon, hipped up to the ridge.
  {
    const AC = CHOIR_X1 + 1.6, R = HW
    const ap = apseRing(AC, YC, R, 5)
    const ring: XY[] = [[CHOIR_X1, Y(-HW)], ...ap.map(([x, y]) => [Math.max(x, CHOIR_X1), y] as XY), [CHOIR_X1, Y(HW)]]
    for (let i = 0; i < ring.length - 1; i++) {
      const A = ring[i], B = ring[i + 1]
      if (Math.hypot(B[0] - A[0], B[1] - A[1]) < 1e-3) continue
      qf(stone, [A[0], A[1], 0], [B[0], B[1], 0], [B[0], B[1], EAVE], [A[0], A[1], EAVE], [B[1] - A[1], -(B[0] - A[0]), 0])
    }
    const R2 = R + 0.3
    const rr = apseRing(AC, YC, R2, 5).map(([x, y]) => [x, y, EAVE] as V3)
    for (let k = 0; k < rr.length - 1; k++) {
      const m: V3 = [(rr[k][0] + rr[k + 1][0]) / 2 - AC, (rr[k][1] + rr[k + 1][1]) / 2 - YC, 3]
      tf(roof, rr[k], rr[k + 1], [AC, YC, RIDGE], m)
    }
    qf(roof, [CHOIR_X1, Y(-R2), EAVE], rr[0], [AC, YC, RIDGE], [CHOIR_X1, YC, RIDGE], [0, -1, 1])
    qf(roof, [CHOIR_X1, Y(R2), EAVE], rr[5], [AC, YC, RIDGE], [CHOIR_X1, YC, RIDGE], [0, 1, 1])
    for (let k = 0; k < 5; k++) {
      const a = ap[k], b = ap[k + 1], f = faceAB(a, b), L = Math.hypot(b[0] - a[0], b[1] - a[1])
      holePanel(win, f, { a0: L / 2 - 1.3, a1: L / 2 + 1.3, zb: 23.5, zs: 29, head: 'pointed' })
      cbox(trim, rect(a[0] - 0.9, a[0] + 0.9, a[1] - 0.9, a[1] + 0.9), EAVE - 0.9, EAVE + 0.5, { b: 0.3, bottom: true })
    }
  }

  // ---- Aisles, transept aisles and the chevet: flat lead roofs at 22 m.
  const aisleN = rect(-63.5, CROSS0, Y(HW), 13.3)
  const aisleS = rect(-63.5, CROSS0, -12.6, Y(-HW))
  const taW_N = rect(-7.4, CROSS0, Y(HW), 30.4), taE_N = rect(CROSS1, 20.3, Y(HW), 30.4)
  const taW_S = rect(-7.7, CROSS0, -31.7, Y(-HW)), taE_S = rect(CROSS1, 20.0, -31.8, Y(-HW))
  for (const r of [aisleN, aisleS, taW_N, taE_N, taW_S, taE_S]) {
    cbox(stone, r, 0, AISLE, { top: false })
    cbox(trim, grow(r, 0.25), AISLE - 0.8, AISLE + 0.6, lo ? { top: false } : { b: 0.25, bottom: true, top: false })
    cbox(roof, grow(r, -0.2), AISLE, AROOF - 0.6, { top: true })
  }
  // The chevet: ambulatory and its ring of chapels, on the OSM outline.
  const CHEVET: XY[] = [[20.2, 13.0], [20.2, 18.7], [27.1, 18.2], [31.1, 20.2], [35.3, 19.1], [37.4, 15.6], [41.1, 15.9], [45.3, 14.8], [47.6, 11.0], [47.7, -11.7],
    [46.1, -14.2], [42.5, -16.4], [38.7, -15.6], [36.0, -19.0], [32.0, -20.7], [27.6, -19.2], [25.8, -17.0], [22.6, -18.8], [20.0, -18.8], [20.0, -13.0]]
  polyPrism(stone, CHEVET, 0, AISLE - 0.5)
  if (!lo) polyPrism(trim, CHEVET.map(([x, y]) => [x + Math.sign(x - 33) * 0.15, y + Math.sign(y) * 0.2] as XY), AISLE - 1.2, AISLE + 0.3)
  polyPrism(roof, CHEVET.map(([x, y]) => [x - Math.sign(x - 33) * 0.2, y - Math.sign(y) * 0.3] as XY), AISLE + 0.3, AROOF - 0.8, roof)
  // Chapel windows round the chevet.
  if (!lo) for (let i = 1; i < CHEVET.length - 1; i++) {
    const a = CHEVET[i], b = CHEVET[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 3.2 || a[0] > 47 && b[0] > 47) continue
    holePanel(win, faceAB(b, a), { a0: L / 2 - 1.0, a1: L / 2 + 1.0, zb: 6, zs: 12.5, head: 'pointed' })
  }

  // ---- Nave and choir windows, one per bay, aisle and clerestory.
  const naveBays = [-63.5, -58.9, -53.0, -47.4, -41.5, -35.7, -29.9, -24.1, -18.3, -12.6, -7.3]
  for (let i = 0; i < naveBays.length - 1; i++) {
    const c = (naveBays[i] + naveBays[i + 1]) / 2
    holePanel(win, face('n', Y(HW)), { a0: c - 1.5, a1: c + 1.5, zb: AROOF + 1, zs: 28.6, head: 'pointed' })
    holePanel(win, face('s', Y(-HW)), { a0: c - 1.5, a1: c + 1.5, zb: AROOF + 1, zs: 28.6, head: 'pointed' })
    if (!lo) holePanel(win, face('n', 13.3), { a0: c - 1.4, a1: c + 1.4, zb: 5.5, zs: 13.2, head: 'pointed' })
    if (c < -48) holePanel(win, face('s', -12.6), { a0: c - 1.4, a1: c + 1.4, zb: 9.5, zs: 14, head: 'pointed' })
  }
  for (const c of [16.2, 21.2, 25.9]) {
    holePanel(win, face('n', Y(HW)), { a0: c - 1.4, a1: c + 1.4, zb: AROOF + 1, zs: 28.6, head: 'pointed' })
    holePanel(win, face('s', Y(-HW)), { a0: c - 1.4, a1: c + 1.4, zb: AROOF + 1, zs: 28.6, head: 'pointed' })
  }
  // Transept clerestories and aisle windows (east and west sides).
  for (const yc of [15.6, 21.0, 27.1, -14.9, -20.5, -27.0]) {
    holePanel(win, face('w', CROSS0), { a0: yc - 1.4, a1: yc + 1.4, zb: AROOF + 1, zs: 28.6, head: 'pointed' })
    holePanel(win, face('e', CROSS1), { a0: yc - 1.4, a1: yc + 1.4, zb: AROOF + 1, zs: 28.6, head: 'pointed' })
    if (yc > 0) {
      if (!lo) holePanel(win, face('w', -7.4), { a0: yc - 1.3, a1: yc + 1.3, zb: 5.5, zs: 13, head: 'pointed' })
      if (!lo) holePanel(win, face('e', 20.3), { a0: yc - 1.3, a1: yc + 1.3, zb: 5.5, zs: 13, head: 'pointed' })
    }
  }

  // ---- Buttresses, pinnacles and flying buttresses.
  // A pier standing out from a wall, stepped near its top, with a pinnacle;
  // `dir` is the unit plan vector away from the church.
  const pier = (x: number, y: number, dir: XY, depth: number, w: number, top: number, tip: number, part = stone, pp = trim) => {
    const ex = dir[0] * depth, ey = dir[1] * depth, px = Math.abs(dir[1]) * w / 2, py = Math.abs(dir[0]) * w / 2
    const r = rect(Math.min(x, x + ex) - px, Math.max(x, x + ex) + px, Math.min(y, y + ey) - py, Math.max(y, y + ey) + py)
    if (lo) cbox(part, r, 0, top, {})
    else {
      const r2 = rect(Math.min(x, x + ex * 0.7) - px, Math.max(x, x + ex * 0.7) + px, Math.min(y, y + ey * 0.7) - py, Math.max(y, y + ey * 0.7) + py)
      cbox(part, r, 0, top - 2.2, { top: false })
      qf(part, [r.x0, r.y0, top - 2.2], [r.x1, r.y0, top - 2.2], [r.x1, r.y1, top - 2.2], [r.x0, r.y1, top - 2.2], [0, 0, 1])
      cbox(part, r2, top - 2.2, top, { b: 0.2 })
    }
    const cx = x + dir[0] * depth * 0.35, cy = y + dir[1] * depth * 0.35
    pin(pp, cx, cy, Math.min(0.75, w * 0.42), top, top + 1.6, tip, SN)
  }
  // Two struts, one over the other, from a pier's head to the clerestory.
  const flyers = (x: number, yPier: number, yWall: number, zp: number) => {
    fly(trim, [x, yPier, zp], [x, yWall, zp + 3.6], 0.9, 1.3)
    if (!lo) fly(trim, [x, yPier, zp - 5.5], [x, yWall, zp - 3.0], 0.8, 1.0)
  }
  for (const x of naveBays.slice(1)) {
    pier(x, 13.3, [0, 1], 3.3, 1.5, 25.5, 33.8)
    flyers(x, 14.0, Y(HW) + 0.1, 26.8)
    if (x > -48) {
      // South: an inner pier on the aisle wall, an outer one beyond the cloister walk.
      pier(x, -12.6, [0, -1], 0.9, 1.5, 25.5, 33.8)
      pier(x, -16.8, [0, -1], 4.4, 1.4, 18, 23.4)
      fly(trim, [x, -17.4, 17.2], [x, -12.9, 21.6], 0.8, 1.0)
      flyers(x, -13.0, Y(-HW) - 0.1, 26.8)
    } else {
      pier(x, -12.6, [0, -1], 3.6, 1.5, 25.5, 33.8)
      flyers(x, -13.4, Y(-HW) - 0.1, 26.8)
    }
  }
  // The cloister's north and east walks where the outline takes them in.
  {
    const walk = rect(-47.8, -7.7, -16.8, -12.6), east = rect(-11.0, -7.7, -31.5, -16.8)
    for (const r of [walk, east]) {
      cbox(stone, r, 0, 7.2, { top: false })
      cbox(roof, grow(r, 0.15), 7.2, 8.2, lo ? {} : { b: 0.6 })
    }
  }
  // Transept aisle piers (west and east sides of both arms) and the choir's.
  for (const y of [18.2, 24.1]) {
    pier(-7.4, y, [-1, 0], 3.0, 1.4, 25.5, 33.8); flyers2(-8.0, y)
    pier(20.3, y, [1, 0], 2.9, 1.3, 25.5, 33.8); flyers3(20.9, y)
  }
  for (const y of [-17.6, -23.5]) {
    pier(-7.7, y, [-1, 0], 3.0, 1.4, 25.5, 33.8); flyers2(-8.3, y)
    pier(20.0, y, [1, 0], 2.7, 1.3, 25.5, 33.8); flyers3(20.6, y)
  }
  function flyers2(x: number, y: number) {
    fly(trim, [x + 0.6, y, 26.8], [CROSS0 - 0.1, y, 30.4], 0.9, 1.3)
    if (!lo) fly(trim, [x + 0.6, y, 21.3], [CROSS0 - 0.1, y, 23.8], 0.8, 1.0)
  }
  function flyers3(x: number, y: number) {
    fly(trim, [x - 0.6, y, 26.8], [CROSS1 + 0.1, y, 30.4], 0.9, 1.3)
    if (!lo) fly(trim, [x - 0.6, y, 21.3], [CROSS1 + 0.1, y, 23.8], 0.8, 1.0)
  }
  // Choir and apse: piers on the chevet roof, flyers to the clerestory.
  {
    const AC = CHOIR_X1 + 1.6
    const pts: XY[] = [[19.3, Y(12.0)], [24.2, Y(12.0)], [19.3, Y(-12.0)], [24.2, Y(-12.0)]]
    for (let k = 0; k <= 4; k++) { const t = -Math.PI / 2 + (Math.PI * (k + 0.5)) / 5; pts.push([AC + 12.3 * Math.cos(t), YC + 12.3 * Math.sin(t)]) }
    for (const [x, y] of pts) {
      const dx = x - (x < AC ? x : AC), dy = y - YC, L = Math.hypot(dx, dy)
      const ux = dx / L, uy = dy / L
      cbox(stone, rect(x - 0.8, x + 0.8, y - 0.8, y + 0.8), AISLE, 25.5, lo ? {} : { b: 0.2 })
      pin(trim, x, y, 0.72, 25.5, 27.1, 33.8, SN)
      const wx = x < AC ? x : AC + (HW + 0.1) * ux, wy = YC + (HW + 0.1) * uy
      fly(trim, [x - ux * 0.6, y - uy * 0.6, 24.5], [wx, wy, 29.6], 0.9, 1.2)
    }
    // The chevet's outer pinnacles.
    for (const [x, y] of [[26.9, 18.8], [31.5, 20.8], [36.1, 19.2], [38.2, 16.0], [41.6, 16.4], [46.1, 14.7], [26.9, -19.1], [31.5, -21.0], [36.1, -19.6], [38.1, -16.3], [41.8, -16.9], [46.1, -15.0]] as XY[]) {
      if (!lo) pin(trim, x, y, 0.65, AISLE, 21.5, 23.6, SN)
    }
  }

  // ---- The crossing lantern: a squat square tower, low lead pyramid.
  {
    const r = rect(CROSS0 + 0.1, CROSS1 - 0.1, Y(-HW + 0.1), Y(HW - 0.1)), TOP = 46.3
    cbox(stone, r, EAVE, TOP - 0.9, { top: false, c: 0.4 })
    cbox(trim, grow(r, 0.3), TOP - 1.0, TOP, { b: 0.3, bottom: true, top: false })
    const xm = (r.x0 + r.x1) / 2
    qf(roof, [r.x0 + 0.3, r.y0 + 0.3, TOP - 0.4], [r.x1 - 0.3, r.y0 + 0.3, TOP - 0.4], [xm, YC, 49.6], [xm, YC, 49.6], [0, -1, 1])
    for (const [a, b] of [[[r.x0 + 0.3, r.y0 + 0.3], [r.x1 - 0.3, r.y0 + 0.3]], [[r.x1 - 0.3, r.y0 + 0.3], [r.x1 - 0.3, r.y1 - 0.3]], [[r.x1 - 0.3, r.y1 - 0.3], [r.x0 + 0.3, r.y1 - 0.3]], [[r.x0 + 0.3, r.y1 - 0.3], [r.x0 + 0.3, r.y0 + 0.3]]] as Array<[XY, XY]>) {
      tf(roof, [a[0], a[1], TOP - 0.4], [b[0], b[1], TOP - 0.4], [xm, YC, 49.6], [(a[0] + b[0]) / 2 - xm, (a[1] + b[1]) / 2 - YC, 6])
    }
    for (const k of [-1, 1]) {
      const a = k * 2.6
      for (const [side, at, c] of [['n', r.y1, xm], ['s', r.y0, xm], ['e', r.x1, YC], ['w', r.x0, YC]] as Array<[Side, number, number]>) {
        holePanel(win, face(side, at), { a0: c + a - 1.0, a1: c + a + 1.0, zb: 36.2, zs: 41.6, head: 'pointed' })
      }
    }
    if (!lo) for (const [x, y] of [[r.x0, r.y0], [r.x1, r.y0], [r.x1, r.y1], [r.x0, r.y1]] as XY[]) pin(trim, x, y, 0.7, TOP - 1, TOP + 0.4, TOP + 3.6, SN)
  }

  // ---- North transept front: rose, flanking turrets, outer turrets, porches.
  {
    const F = face('n', 30.4), xm = (CROSS0 + CROSS1) / 2
    // The gable above the eaves, carrying a cross.
    tf(stone, [CROSS0 - 0.2, 30.45, EAVE + 0.5], [CROSS1 + 0.2, 30.45, EAVE + 0.5], [xm, 30.45, 43.2], [0, 1, 0])
    tf(stone, [CROSS0 - 0.2, 29.6, EAVE + 0.5], [CROSS1 + 0.2, 29.6, EAVE + 0.5], [xm, 29.6, 43.2], [0, -1, 0])
    qf(trim, [CROSS0 - 0.2, 29.6, EAVE + 0.5], [CROSS0 - 0.2, 30.45, EAVE + 0.5], [xm, 30.45, 43.2], [xm, 29.6, 43.2], [-1, 0, 1])
    qf(trim, [CROSS1 + 0.2, 29.6, EAVE + 0.5], [CROSS1 + 0.2, 30.45, EAVE + 0.5], [xm, 30.45, 43.2], [xm, 29.6, 43.2], [1, 0, 1])
    cbox(trim, rect(xm - 0.2, xm + 0.2, 29.9, 30.3), 43.0, 45.0, {})
    cbox(trim, rect(xm - 0.8, xm + 0.8, 29.9, 30.3), 44.0, 44.4, {})
    // Rose window in a deep round frame, and the gallery below it.
    disc(shade, F, xm, 28.6, 5.6, lo ? 16 : 20, 0.04)
    disc(win, F, xm, 28.6, 5.0, lo ? 16 : 20, 0.07)
    ringOn(trim, F, xm, 28.6, 5.0, 5.6, lo ? 16 : 20, 0.1)
    if (!lo) ringOn(trim, F, xm, 28.6, 1.1, 1.6, 10, 0.1)
    for (let k = 0; k < 6; k++) holePanel(win, F, { a0: CROSS0 + 1.2 + k * 2.02, a1: CROSS0 + 2.6 + k * 2.02, zb: 19.6, zs: 21.6, head: 'pointed' })
    // Turrets flanking the rose, and the outer corner turrets with conical spires.
    for (const x of [CROSS0 + 0.1, CROSS1 - 0.1]) {
      ngonPrism(stone, x, 31.0, 1.7, 8, 0, 38.5, { top: false })
      pin(trim, x, 31.0, 1.45, 38.5, 40.5, 46.0, PN, lo ? undefined : trim)
    }
    for (const x of [-6.6, 19.6]) {
      ngonPrism(stone, x, 31.9, 1.6, 8, 0, 33.0, { top: false })
      cbox(trim, rect(x - 1.9, x + 1.9, 30.0, 33.8), 32.6, 33.4, { b: 0.2, bottom: true })
      spire(roof, ngon(x, 31.9, 1.75, 8, 33.4), [x, 31.9, 40.0])
      // A flyer from each outer turret to the rose's turret.
      fly(trim, [x + Math.sign(xm - x) * 1.4, 31.4, 28.6], [x < xm ? CROSS0 - 1.2 : CROSS1 + 1.2, 31.0, 32.4], 0.9, 1.4)
    }
    // Aisle fronts: tall lancets above the porches.
    for (const [a0, a1] of [[-7.3, CROSS0], [CROSS1, 20.3]]) {
      const c = (a0 + a1) / 2
      holePanel(win, F, { a0: c - 1.3, a1: c + 1.3, zb: 15.5, zs: 22, head: 'pointed' })
      disc(win, F, c, 25.3, 1.4, 10)
    }
    // Three porches projecting to y 35.2, under gables, with deep doors.
    const porch = rect(-7.3, 20.3, 30.4, 35.2)
    cbox(stone, porch, 0, 12, { top: false })
    cbox(trim, grow(porch, 0.25, 0.25), 11.2, 12.4, { b: 0.25, bottom: true, top: roof })
    const P = face('n', 35.2)
    for (const [c, w, gz] of [[xm, 5.0, 17.8], [-3.2, 3.6, 15.2], [16.4, 3.6, 15.2]] as Array<[number, number, number]>) {
      tf(stone, [c - w / 2 - 0.9, 35.25, 12.4], [c + w / 2 + 0.9, 35.25, 12.4], [c, 35.25, gz], [0, 1, 0])
      tf(stone, [c - w / 2 - 0.9, 34.0, 12.4], [c + w / 2 + 0.9, 34.0, 12.4], [c, 34.0, gz], [0, -1, 0])
      qf(trim, [c - w / 2 - 0.9, 34.0, 12.4], [c - w / 2 - 0.9, 35.25, 12.4], [c, 35.25, gz], [c, 34.0, gz], [-1, 0, 0.8])
      qf(trim, [c + w / 2 + 0.9, 34.0, 12.4], [c + w / 2 + 0.9, 35.25, 12.4], [c, 35.25, gz], [c, 34.0, gz], [1, 0, 0.8])
      holePanel(shade, P, { a0: c - w / 2, a1: c + w / 2, zb: 0, zs: 9.5 - w * 0.866, head: 'pointed' })
    }
    if (!lo) for (const x of [-7.3, CROSS0 - 0.6, CROSS1 + 0.6, 20.3]) pin(trim, x, 35.0, 0.6, 12.4, 13.5, 16.5, SN)
  }
  // South transept front: the gable and rose over the cloister roofs.
  {
    const F = face('s', -31.8), xm = (CROSS0 + CROSS1) / 2
    tf(stone, [CROSS0 - 0.2, -31.85, EAVE + 0.5], [CROSS1 + 0.2, -31.85, EAVE + 0.5], [xm, -31.85, 43.2], [0, -1, 0])
    tf(stone, [CROSS0 - 0.2, -31.0, EAVE + 0.5], [CROSS1 + 0.2, -31.0, EAVE + 0.5], [xm, -31.0, 43.2], [0, 1, 0])
    qf(trim, [CROSS0 - 0.2, -31.0, EAVE + 0.5], [CROSS0 - 0.2, -31.85, EAVE + 0.5], [xm, -31.85, 43.2], [xm, -31.0, 43.2], [-1, 0, 1])
    qf(trim, [CROSS1 + 0.2, -31.0, EAVE + 0.5], [CROSS1 + 0.2, -31.85, EAVE + 0.5], [xm, -31.85, 43.2], [xm, -31.0, 43.2], [1, 0, 1])
    disc(win, F, xm, 27.5, 4.9, 18, 0.07)
    ringOn(trim, F, xm, 27.5, 4.9, 5.5, 18, 0.1)
    for (const x of [CROSS0 + 0.1, CROSS1 - 0.1]) {
      ngonPrism(stone, x, -32.6, 1.6, 8, 0, 38.5, { top: false })
      pin(trim, x, -32.6, 1.4, 38.5, 40.5, 46.0, PN, lo ? undefined : trim)
    }
  }

  // ---- The west towers (Hawksmoor): four stages, open belfries, corner turrets.
  const TX0 = NAVE_X0, TX1 = -63.5, TW = TX1 - TX0
  const CORNICE = 32.2, CLOCK = 41.2, BEL1 = 57.4, PARA = 59.2, TIP = 68.6
  for (const sgn of [1, -1]) {
    const ty = Y(sgn * 10.1), h = TW / 2
    const r = rect(TX0, TX1, ty - h, ty + h), xm = (TX0 + TX1) / 2
    // Lower stage (to the main cornice) and the clock stage, solid.
    cbox(stone, r, 0, CLOCK, { top: false })
    cbox(trim, grow(r, 0.35), CORNICE - 0.8, CORNICE + 0.4, { b: 0.3, bottom: true, top: false })
    cbox(trim, grow(r, 0.3), CLOCK - 0.7, CLOCK + 0.3, { b: 0.25, bottom: true, top: false })
    // Belfry: a tall pointed opening on every face, louvred deep inside, with a mullion.
    // Paired lights under one pointed head, about 45% of the face.
    const hole = (c: number): Hole => ({ a0: c - 2.75, a1: c + 2.75, zb: 42.6, zs: 48.0, head: 'pointed' })
    boxHoles(stone, rect(r.x0 + 0.5, r.x1 - 0.5, r.y0 + 0.5, r.y1 - 0.5), CLOCK + 0.3, BEL1, { n: [hole(xm)], s: [hole(xm)], e: [hole(ty)], w: [hole(ty)] }, { depth: 1.1, back: shade, top: false })
    for (const [side, at, c] of [['n', r.y1 - 0.5, xm], ['s', r.y0 + 0.5, xm], ['e', r.x1 - 0.5, ty], ['w', r.x0 + 0.5, ty]] as Array<[Side, number, number]>) {
      const F = face(side, at)
      // A stone mullion and a transom, standing in the opening.
      const m0 = fp(F, c - 0.3, 0, -0.3), m1 = fp(F, c + 0.3, 0, -0.75)
      cbox(trim, rect(Math.min(m0[0], m1[0]), Math.max(m0[0], m1[0]), Math.min(m0[1], m1[1]), Math.max(m0[1], m1[1])), 42.6, 52.5, {})
      const t0 = fp(F, c - 2.75, 0, -0.3), t1 = fp(F, c + 2.75, 0, -0.75)
      cbox(trim, rect(Math.min(t0[0], t1[0]), Math.max(t0[0], t1[0]), Math.min(t0[1], t1[1]), Math.max(t0[1], t1[1])), 46.2, 46.8, { bottom: true })
      // Blind panels flanking the opening on the clock stage, and the stage's window.
      if ((side === "s" && sgn > 0) || (side === "n" && sgn < 0)) continue
      holePanel(win, F, { a0: c - 1.5, a1: c + 1.5, zb: 18.5, zs: 27.2, head: "pointed" }, 0.55)
    }
    // Parapet band, battlements and the low roof.
    const rp = rect(r.x0 + 0.2, r.x1 - 0.2, r.y0 + 0.2, r.y1 - 0.2)
    cbox(trim, rp, BEL1, PARA, { b: 0.25, top: roof, bottom: true })
    for (const [side, c] of [['n', xm], ['s', xm], ['e', ty], ['w', ty]] as Array<[Side, number]>) {
      for (const k of lo ? [] : [-3, -1, 1, 3]) {
        const a = c + k * (lo ? 1.45 : 1.15)
        const R = side === 'n' || side === 's'
          ? rect(a - 0.45, a + 0.45, side === 'n' ? rp.y1 - 0.5 : rp.y0, side === 'n' ? rp.y1 : rp.y0 + 0.5)
          : rect(side === 'e' ? rp.x1 - 0.5 : rp.x0, side === 'e' ? rp.x1 : rp.x0 + 0.5, a - 0.45, a + 0.45)
        cbox(trim, R, PARA, PARA + 0.9, {})
      }
      // A pinnacle in the middle of each parapet.
      const [px, py] = side === 'n' ? [xm, rp.y1 - 0.4] : side === 's' ? [xm, rp.y0 + 0.4] : side === 'e' ? [rp.x1 - 0.4, ty] : [rp.x0 + 0.4, ty]
      pin(trim, px, py, 0.55, PARA, PARA + 1.4, 64.2, SN)
    }
    // Corner turrets: clasping buttresses below the cornice, octagonal above,
    // each carrying a big pinnacle.
    for (const [x, y0] of [[r.x0, r.y0], [r.x1, r.y0], [r.x1, r.y1], [r.x0, r.y1]] as XY[]) {
      // The turrets on the inner (centre-bay) side stand within the tower,
      // leaving the west window's bay its full width.
      const y = Math.abs(y0 - YC) < 6 ? y0 + Math.sign(y0 - YC) * 1.5 : y0
      cbox(stone, rect(x - 1.5, x + 1.5, y - 1.5, y + 1.5), 0, CORNICE - 0.8, { c: lo ? 0 : 0.5, top: false })
      cylinder(stone, x, y, 1.75, CORNICE - 0.8, PARA + 1.2, 8)
      if (!lo) ngonPrism(trim, x, y, 2.0, 8, PARA + 1.2, PARA + 2.0, { top: false, bottom: true })
      pin(trim, x, y, 1.45, PARA + 2.0, PARA + 3.6, TIP, 8, lo ? undefined : trim)
    }
    // Tall lancet on the lower stage's outer face and the clock (north) or roundel (south).
    const outer = face('w', r.x0)
    holePanel(shade, outer, { a0: ty - 1.4, a1: ty + 1.4, zb: 3, zs: 9.5, head: 'pointed' })
    if (sgn > 0) { disc(lady, outer, ty, 36.6, 1.8, 14, 0.08); ringOn(trim, outer, ty, 36.6, 1.8, 2.15, 14, 0.1) }
    else { disc(win, outer, ty, 36.6, 1.6, 14, 0.08); ringOn(trim, outer, ty, 36.6, 1.6, 2.1, 14, 0.1) }
  }

  // ---- The west front's centre bay: great west window, gable, porch.
  {
    const XF = -77.4, r = rect(XF, TX0 + 0.5, Y(-4.95), Y(4.95)), F = face('w', XF)
    // The bay's west wall, with the great porch cut deep into it.
    const porch: Hole = { a0: YC - 2.3, a1: YC + 2.3, zb: 0, zs: 3.8, head: 'pointed' }
    wallHoles(stone, F, r.y0, r.y1, 0, 34.5, [porch], { depth: 1.6, back: shade })
    for (const [side, at] of [['n', r.y1], ['s', r.y0]] as Array<[Side, number]>) qf(stone, [r.x0, at, 0], [r.x1, at, 0], [r.x1, at, 34.5], [r.x0, at, 34.5], side === 'n' ? [0, 1, 0] : [0, -1, 0])
    cbox(trim, grow(r, 0.3, 0), 33.7, 34.9, { b: 0.25, bottom: true, top: roof })
    gableWedge(stone, XF + 0.3, TX0 + 1.5, YC, 4.8, 34.9, 42.6)
    cbox(trim, rect(XF + 0.4, XF + 0.8, YC - 0.2, YC + 0.2), 42.3, 44.4, {})
    cbox(trim, rect(XF + 0.4, XF + 0.8, YC - 0.7, YC + 0.7), 43.4, 43.8, {})
    holePanel(win, face('w', XF + 0.3), { a0: YC - 1.0, a1: YC + 1.0, zb: 36.4, zs: 38.6, head: 'pointed' })
    // The great west window: about 70% of the bay, from above the statue
    // band to the cornice, five lights between four bold mullions, two transoms.
    const W = 3.5, ww: Hole = { a0: YC - W, a1: YC + W, zb: 12.2, zs: 27.2, head: 'pointed', seg: lo ? 3 : 5 }
    holePanel(shade, F, { ...ww, a0: ww.a0 - 0.25, a1: ww.a1 + 0.25, zb: ww.zb - 0.4, seg: lo ? 3 : 5 }, 0.04)
    holePanel(win, F, ww, 0.07)
    for (const u of [-2.1, -0.7, 0.7, 2.1]) {
      const top = ww.zs + Math.sqrt(4 * W * W - (W + Math.abs(u)) ** 2) - 0.2
      cbox(trim, rect(XF - 0.2, XF + 0.05, YC + u - 0.18, YC + u + 0.18), ww.zb, top, {})
    }
    for (const z of [19.6, 25.0]) cbox(trim, rect(XF - 0.2, XF + 0.05, ww.a0, ww.a1), z, z + 0.4, { bottom: true })
    // The statue gallery band over the porch.
    fpanel(shade, F, YC - 4.0, YC + 4.0, 8.4, 11.3, 0.04)
    // The buttresses flanking the centre bay, with pinnacles.
    for (const s of [-1, 1]) {
      const y = Y(s * 4.2)
      cbox(stone, rect(-78.4, TX0, y - 0.45, y + 0.45), 0, 31.0, { top: false })
      pin(trim, -77.9, y, 0.45, 31.0, 31.8, 35.0, SN)
    }
  }

  // ---- The Lady Chapel (Henry VII's): honey stone, turrets with ogee caps.
  {
    const LX0 = 47.6, LX1 = 70.6, LYH = 6.2, AC = LX1, AR = LYH
    // The connecting vestibule to the choir's apse.
    cbox(lady, rect(43.5, LX0 + 0.5, Y(-4.6), Y(4.6)), 0, 11, { top: roof })
    // Aisle chapels, with the apse's radiating chapels round the east end.
    const outerRing: XY[] = [[LX0, Y(-11.5)], [69.0, Y(-11.5)], [74.2, Y(-10.6)], [78.0, Y(-7.6)], [80.9, Y(-4.4)], [81.6, Y(-0.3)], [80.8, Y(3.9)], [78.5, Y(7.4)], [74.5, Y(10.4)], [69.0, Y(11.3)], [LX0, Y(11.3)]]
    polyPrism(lady, outerRing, 0, 14.0)
    polyPrism(trim, outerRing.map(([x, y]) => [x + (x > 60 ? Math.sign(x - 70) * 0.2 : 0), y + Math.sign(y - YC) * 0.2] as XY), 13.6, 14.6)
    polyPrism(roof, outerRing.map(([x, y]) => [x - (x > 60 ? 0.2 : 0), y - Math.sign(y - YC) * 0.3] as XY), 14.6, 15.2, roof)
    for (let i = 0; i < outerRing.length - 1; i++) {
      const a = outerRing[i], b = outerRing[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const f = faceAB(a, b)
      const n = Math.max(1, Math.round(L / 4.3))
      for (let k = 0; k < n && !lo; k++) {
        const c = (L * (k + 0.5)) / n
        holePanel(win, f, { a0: c - 1.45, a1: c + 1.45, zb: 3.2, zs: 11.0, head: 'segment' })
      }
    }
    // The vessel, its polygonal east end, and a low-pitched lead roof.
    const ves: XY[] = [[LX0, Y(-LYH)], [LX1, Y(-LYH)], ...apseRing(AC, YC, AR, 5).slice(1, -1), [LX1, Y(LYH)], [LX0, Y(LYH)]]
    polyPrism(lady, ves, 0, 23.4)
    polyPrism(lady, ves.map(([x, y]) => [x + (x > LX1 ? (x - AC) * 0.05 : x === LX0 ? -0.2 : 0), y + Math.sign(y - YC) * 0.25] as XY), 22.6, 24.0)
    const rv = ves.map(([x, y]) => [x, y, 24.0] as V3)
    for (let i = 0; i < rv.length; i++) {
      const A = rv[i], B = rv[(i + 1) % rv.length]
      const top = (q: V3): V3 => [Math.min(Math.max(q[0], LX0 + 1), LX1), YC, 25.5]
      const tA = top(A), tB = top(B)
      if (Math.hypot(tA[0] - tB[0], tA[1] - tB[1]) < 1e-3) tf(roof, A, B, tA, [(A[0] + B[0]) / 2 - tA[0], (A[1] + B[1]) / 2 - YC, 10])
      else qf(roof, A, B, tB, tA, [0, Math.sign((A[1] + B[1]) / 2 - YC), 3])
    }
    // Clerestory windows between the turrets and round the apse.
    const tx = [LX0 + 0.9, 51.6, 55.9, 60.2, 64.5, 68.8]
    for (let i = 0; i < tx.length - 1; i++) {
      const c = (tx[i] + tx[i + 1]) / 2
      holePanel(win, face('n', Y(LYH)), { a0: c - 1.55, a1: c + 1.55, zb: 14.0, zs: 20.0, head: 'segment' })
      holePanel(win, face('s', Y(-LYH)), { a0: c - 1.55, a1: c + 1.55, zb: 14.0, zs: 20.0, head: 'segment' })
    }
    const ap = apseRing(AC, YC, AR, 5)
    for (let k = 0; k < 5; k++) {
      const a = ap[k], b = ap[k + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      holePanel(win, faceAB(a, b), { a0: L / 2 - 1.3, a1: L / 2 + 1.3, zb: 14.0, zs: 20.0, head: 'segment' })
    }
    // Turrets: on the vessel (up past the parapet to ogee caps) and on the
    // aisle chapels, joined by flyers.
    const upper: XY[] = [...tx.flatMap((x) => [[x, Y(LYH)], [x, Y(-LYH)]] as XY[]), ...ap.slice(1, -1)]
    for (const [x, y] of upper) {
      cylinder(lady, x, y, 1.05, 14.0, 25.2, OG)
      ogee(lady, x, y, 1.05, 25.2, 3.6, OG, lo)
      if (!lo) cbox(trim, rect(x - 0.08, x + 0.08, y - 0.08, y + 0.08), 28.4, 29.6, {})
    }
    for (const x of tx.slice(1)) for (const s of [-1, 1]) {
      const yo = Y(s * 11.0)
      cylinder(lady, x, yo, 1.1, 0, 18.4, OG)
      if (lo) spire(lady, ngon(x, yo, 1.1, OG, 18.4), [x, yo, 21.6]); else
      ogee(lady, x, yo, 1.1, 18.4, 3.2, OG)
      if (!lo) fly(lady, [x, yo - s * 0.6, 16.6], [x, Y(s * (LYH + 0.6)), 21.4], 0.7, 1.1)
    }
    for (const t of [0.25, 0.5, 0.75]) {
      const ang = -Math.PI / 2 + Math.PI * t, x = AC + 10.4 * Math.cos(ang), y = YC + 10.4 * Math.sin(ang)
      cylinder(lady, x, y, 1.1, 0, 18.4, OG)
      ogee(lady, x, y, 1.1, 18.4, 3.2, OG)
      if (!lo) fly(lady, [x - 0.6 * Math.cos(ang), y - 0.6 * Math.sin(ang), 16.6], [AC + (AR + 0.6) * Math.cos(ang), YC + (AR + 0.6) * Math.sin(ang), 21.4], 0.7, 1.1)
    }
    // The tall west turrets of the chapel.
    for (const s of [-1, 1]) {
      ngonPrism(lady, 48.7, Y(s * 5.5), 1.25, OG, 11, 27.0, { top: false })
      if (lo) spire(lady, ngon(48.7, Y(s * 5.5), 1.25, OG, 27.0), [48.7, Y(s * 5.5), 30.6]); else ogee(lady, 48.7, Y(s * 5.5), 1.25, 27.0, 3.6, OG)
    }
  }

  // At night the west front and its towers are floodlit, the rest softly.
  const lit = (q: V3, n: V3): number => (n[2] > 0.8 ? 0.2 : q[0] < -60 ? 0.95 : q[2] > 30 ? 0.6 : 0.4)
  return [
    { part: stone, material: { ...PALETTE.stone, floodlight: lit } },
    { part: trim, material: { ...PALETTE.trim, ...(lo ? {} : { floodlight: lit }) } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: lady, material: { ...finish("abbey-lady-chapel", 0xd8c09c), ...(lo ? {} : { floodlight: (q: V3, n: V3) => (n[2] > 0.8 ? 0.15 : 0.5) }) } },
    // Deep recesses: the belfry louvres, the porch doors, the statue band.
    { part: shade, material: finish('abbey-recess', 0x8f8a84) },
  ]
}

if (import.meta.main) {
  const extras = { source: 'generators/london-westminster-abbey.ts' }
  await saveLod('london-westminster-abbey', 'Westminster Abbey', build(false), extras, true)
  await saveLod('london-westminster-abbey', 'Westminster Abbey', build(true), extras, false, 6500)
}
