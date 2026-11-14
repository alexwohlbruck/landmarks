/**
 * Shakespeare's Globe, New Globe Walk, Bankside, London (the reconstruction
 * by Theo Crosby and Jon Greenfield for Sam Wanamaker, opened 1997).
 * Original procedural geometry, CC0-1.0.
 *   bun generators/london-shakespeares-globe.ts
 *
 * Frame: turned to BEARING 47.5, the theatre's axis: +y points from the
 * stage across the yard toward the two stair turrets (compass 47.5, the
 * river side), the stage is at -y (south-west). +x = compass 137.5, z up,
 * metres. Origin = the area centroid of the outer ring of OSM relation
 * 1239793 (-0.0971125, 51.5081073), on the ground. z = 0 is the lowest
 * ground round the building (Park Street side, south; EA lidar DTM 0.5 m
 * above the box's ground_min); the yard and the river-side piazza are 2.5 m
 * higher (lidar DSM: yard 3.0, piazza 2.6-2.9 above ground_min). The walls
 * run down to z = 0 all round.
 *
 * The Sam Wanamaker Playhouse (way/82459276) and the foyer and education
 * buildings are separate OSM buildings outside this outline; they are not
 * drawn.
 *
 * What makes it the Globe, and how each is drawn
 * - The 20-sided ring, 32.8 m across: white lime plaster with real raised
 *   oak framing on every side (corner and mid posts, the sill and two floor
 *   rails, the wall plate, the pointed-arch braces of the lowest storey and
 *   the knee braces under the plate), small recessed windows in the upper
 *   storeys.
 * - The thatched roof ring: a gabled ring (inner and outer slopes, a rounded
 *   ridge, thick eaves) round an open centre; the yard is a real hole, open
 *   to the sky. Over the tiring house (behind the stage) the ring is 1.4 m
 *   higher, as the lidar shows.
 * - The three open galleries facing the yard: oak posts at every side, the
 *   floors, the balustrade fronts, the wall plate, shaded backs.
 * - The stage: the platform, the frons scenae with its three doors and the
 *   lords' gallery (real recesses), the two great columns on their plinths,
 *   the painted "heavens" canopy and the thatched stage roof with its gable
 *   facing the yard.
 * - The two stair turrets on the river side: gabled, timber framed, thatched,
 *   gable ends facing out.
 * - Night: the windows glow; the plaster is not floodlit.
 *
 * Evidence
 * - OSM (ODbL): relation/1239793 (Shakespeare's Globe, wikidata Q7725501),
 *   outer way/24642603 and the yard inner way/82459264; inside it 125
 *   building:parts mapped in 3D (way/1128334586-1128334690, way/1128448031-
 *   1128448038, way/1137840420-1137840429, way/1170521401-1170521402,
 *   way/1426366136-1426366137): walls 10 m, thatch 10-14 m, tiring-house
 *   thatch 10-15 m, stage 1.45 m, columns 3-9 m, gallery rails and posts,
 *   turrets 10-13.9 m. way/166457411 (a building=yes over the whole block)
 *   also has its centroid in the ring but is the larger neighbouring
 *   building; it is not replaced.
 * - Environment Agency LIDAR Composite DSM/DTM 1 m (0.5 m grid), Open
 *   Government Licence v3.0 (composite of flights ~2000-2022). Measured above
 *   the lowest street (z = 0): yard 2.5; ring ridge 15.6 at r = 13.2; inner
 *   eave edge r = 9.9, about 10.4; tiring-house ridge 17.0; stage roof ridge
 *   17.5 running back from r = 4.
 * - Published: 20 sides, about 100 ft (30 m) across, three galleries, open
 *   yard, thatched with Norfolk reed (Wikipedia "Shakespeare's Globe").
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Panorama del globe desde fuera 1.jpg", Juara66, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Panorama_del_globe_desde_fuera_1.jpg
 *     (from the east: the ring, framing, windows, a turret);
 *   "Shakespeare's Globe, exterior (June 2006)(165463229).jpg", Thomas
 *     Roessler, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Shakespeare%27s_Globe,_exterior_(June_2006)(165463229).jpg
 *     (river side: the framing pattern and the turret gable);
 *   "Shakespeare's Globe exterior 2025-10-05.jpg", Ian Hughes, CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Shakespeare%27s_Globe_exterior_2025-10-05.jpg;
 *   "Globe Theatre Buehne.jpg", Tohma, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Globe_Theatre_Buehne.jpg
 *     (the stage, columns, heavens and frons scenae);
 *   "Millennium Bridge and Tate Modern from St Paul's Cathedral, London.jpg",
 *     orangeaurochs, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Millennium_Bridge_and_Tate_Modern_from_St_Paul%27s_Cathedral,_London.jpg
 *     (from above, north: the thatch ring, the turret, the stage-roof gable
 *     rising behind);
 *   "View of the Tate Modern chimney and Shakespeare Globe Theatre from the
 *     South Bank - geograph.org.uk - 5548520.jpg", Robert Lamb, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:View_of_the_Tate_Modern_chimney_and_Shakespeare_Globe_Theatre_from_the_South_Bank_-_geograph.org.uk_-_5548520.jpg
 * - Look-only: none.
 *
 * Estimated (from the photos against the lidar): the storey lines (floors
 * 0.55, 3.3 and 6.05 m above the yard), the wall plate at 11.0, the gallery
 * front radius 11.6, the framing layout per side, the window positions (one
 * per upper storey per side, alternating), the turret size (4.7 x 3.8 m,
 * ridge 15.9), the stage (13.2 x 10 m, 1.45 m high, from OSM), the frons and
 * heavens heights.
 *
 * Doubts
 * - The thatch colour: the weathered grey-brown with a moss-green cast of
 *   the photos (#86815f), so it contrasts with the white walls; the eaves
 *   have a thick rounded lip (0.85 m).
 * - The turned balusters of the gallery fronts are drawn as solid bands;
 *   the painted decoration of the frons and heavens is left out.
 * - The tiring house's outside (south-west) was not photographed face on;
 *   it carries the same framing as the ring.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { writeFileSync } from 'node:fs'

export const BEARING = 47.5
const ID = 'london-shakespeares-globe'

// ---------------------------------------------------------------------------
// Kit: planar facets with real recessed openings
// ---------------------------------------------------------------------------
type P2 = [number, number]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scl = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const subv = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (a: V3): V3 => scl(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1))

/** A convex polygon, wound so its face points along `want` (flipped if not). */
function poly(p: Part, pts: V3[], want?: V3) {
  if (pts.length < 3) return
  let q = pts
  if (want) {
    let n: V3 = [0, 0, 0]
    for (let i = 0; i < q.length; i++) n = add(n, crs(q[i], q[(i + 1) % q.length]))
    if (dot(n, want) < 0) q = [...q].reverse()
  }
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}

/** Keep the part of a convex 2D polygon with a*s + b*t <= c. */
function clip2(pg: P2[], a: number, b: number, c: number): P2[] {
  const out: P2[] = []
  for (let i = 0; i < pg.length; i++) {
    const P = pg[i], Q = pg[(i + 1) % pg.length]
    const fp = a * P[0] + b * P[1] - c, fq = a * Q[0] + b * Q[1] - c
    if (fp <= 0) out.push(P)
    if ((fp < 0 && fq > 0) || (fp > 0 && fq < 0)) {
      const k = fp / (fp - fq)
      out.push([P[0] + (Q[0] - P[0]) * k, P[1] + (Q[1] - P[1]) * k])
    }
  }
  return out
}

/** Keep the part of a convex 3D polygon with n.p <= d. */
function clip3(pg: V3[], n: V3, d: number): V3[] {
  const out: V3[] = []
  for (let i = 0; i < pg.length; i++) {
    const P = pg[i], Q = pg[(i + 1) % pg.length]
    const fp = dot(n, P) - d, fq = dot(n, Q) - d
    if (fp <= 1e-9) out.push(P)
    if ((fp < -1e-9 && fq > 1e-9) || (fp > 1e-9 && fq < -1e-9)) {
      const k = fp / (fp - fq)
      out.push(add(P, scl(subv(Q, P), k)))
    }
  }
  return out
}

type Frame = { o: V3; u: V3; v: V3; n: V3 }
/** A facet's frame: n outward, u horizontal to the right seen from outside, v up the face. */
function frameOf(pg: V3[]): Frame {
  let n: V3 = [0, 0, 0]
  for (let i = 0; i < pg.length; i++) n = add(n, crs(pg[i], pg[(i + 1) % pg.length]))
  n = unit(n)
  let u = crs([0, 0, 1], n)
  if (Math.hypot(u[0], u[1], u[2]) < 1e-6) u = [1, 0, 0]
  u = unit(u)
  return { o: pg[0], u, v: crs(n, u), n }
}
const to2 = (f: Frame, p: V3): P2 => [dot(subv(p, f.o), f.u), dot(subv(p, f.o), f.v)]
const to3 = (f: Frame, s: number, t: number, d = 0): V3 => add(add(add(f.o, scl(f.u, s)), scl(f.v, t)), scl(f.n, d))

/** A recessed opening in facet coordinates. */
type Hole = { s0: number; s1: number; t0: number; t1: number; d: number; back: Part; side?: Part }

function inside2(pg: P2[], s: number, t: number) {
  for (let i = 0; i < pg.length; i++) {
    const P = pg[i], Q = pg[(i + 1) % pg.length]
    if ((Q[0] - P[0]) * (t - P[1]) - (Q[1] - P[1]) * (s - P[0]) < -1e-6) return false
  }
  return true
}

/**
 * A planar convex facet (counter-clockwise seen from outside) with
 * rectangular openings recessed into it: the face is cut into horizontal
 * strips at the openings' edges and each strip into cells, so the openings
 * are real holes with a back and reveals. Openings that do not fit inside
 * the facet, or overlap one already taken, are dropped.
 */
function facet(p: Part, pg3: V3[], holes: Hole[] = [], f = frameOf(pg3)) {
  const pg = pg3.map((q) => to2(f, q))
  const ok: Hole[] = []
  for (const h of holes) {
    if (!(h.s1 > h.s0 && h.t1 > h.t0)) continue
    if (![[h.s0, h.t0], [h.s1, h.t0], [h.s1, h.t1], [h.s0, h.t1]].every(([s, t]) => inside2(pg, s, t))) continue
    if (ok.some((k) => k.s0 < h.s1 && h.s0 < k.s1 && k.t0 < h.t1 && h.t0 < k.t1)) continue
    ok.push(h)
  }
  const ts = [...new Set([Math.min(...pg.map((q) => q[1])), Math.max(...pg.map((q) => q[1])), ...ok.flatMap((h) => [h.t0, h.t1])])].sort((a, b) => a - b)
  const emit = (cell: P2[]) => { if (cell.length >= 3) poly(p, cell.map(([s, t]) => to3(f, s, t)), f.n) }
  for (let i = 0; i < ts.length - 1; i++) {
    const ta = ts[i], tb = ts[i + 1]
    if (tb - ta < 1e-6) continue
    const strip = clip2(clip2(pg, 0, -1, -ta), 0, 1, tb)
    if (strip.length < 3) continue
    const act = ok.filter((h) => h.t0 <= ta + 1e-6 && h.t1 >= tb - 1e-6).sort((a, b) => a.s0 - b.s0)
    let from = -Infinity
    for (const h of act) {
      emit(clip2(from === -Infinity ? strip : clip2(strip, -1, 0, -from), 1, 0, h.s0))
      from = h.s1
    }
    emit(from === -Infinity ? strip : clip2(strip, -1, 0, -from))
  }
  for (const h of ok) recess(p, f, h)
}

/** The back and reveals of an opening. The head (facing down) is left out. */
function recess(p: Part, f: Frame, h: Hole) {
  const s = h.side ?? p
  const F = (a: number, b: number) => to3(f, a, b), B = (a: number, b: number) => to3(f, a, b, -h.d)
  poly(h.back, [B(h.s0, h.t0), B(h.s1, h.t0), B(h.s1, h.t1), B(h.s0, h.t1)], f.n)
  poly(s, [F(h.s0, h.t0), F(h.s1, h.t0), B(h.s1, h.t0), B(h.s0, h.t0)], f.v) // sill
  poly(s, [F(h.s0, h.t0), B(h.s0, h.t0), B(h.s0, h.t1), F(h.s0, h.t1)], f.u) // left reveal
  poly(s, [F(h.s1, h.t0), F(h.s1, h.t1), B(h.s1, h.t1), B(h.s1, h.t0)], scl(f.u, -1)) // right reveal
}

/** Facet-frame s for a world point, and t for a world height on that facet. */
const sAt = (f: Frame, p: V3) => dot(subv(p, f.o), f.u)
const tAtZ = (f: Frame, z: number) => (z - f.o[2]) / f.v[2]

/** A vertical wall quad from a to b (plan points, counter-clockwise round the building) between z0 and z1. */
const wallPoly = (a: P2, b: P2, z0: number, z1: number): V3[] => [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]]

/** A box with its corners chamfered by c, top capped. */
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, c = 0.3, top = true) {
  const r = (z: number): V3[] => c > 0
    ? [[x0 + c, y0, z], [x1 - c, y0, z], [x1, y0 + c, z], [x1, y1 - c, z], [x1 - c, y1, z], [x0 + c, y1, z], [x0, y1 - c, z], [x0, y0 + c, z]]
    : [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  p.loft([r(z0), r(z1)])
  if (top) p.cap(r(z1), true)
}

/** Offset a counter-clockwise plan ring outward by d (mitred). */
function offsetRing(r: P2[], d: number): P2[] {
  const n = r.length
  return r.map((P, i) => {
    const A = r[(i - 1 + n) % n], C = r[(i + 1) % n]
    const e1 = unit([P[0] - A[0], P[1] - A[1], 0]), e2 = unit([C[0] - P[0], C[1] - P[1], 0])
    const n1: P2 = [e1[1], -e1[0]], n2: P2 = [e2[1], -e2[0]]
    const m: P2 = [n1[0] + n2[0], n1[1] + n2[1]]
    const k = d / (1 + n1[0] * n2[0] + n1[1] * n2[1])
    return [P[0] + m[0] * k, P[1] + m[1] * k] as P2
  })
}

/** A band standing proud of a plan ring by `out`, between z0 and z1 (a cornice or string course). */
function band(p: Part, r: P2[], z0: number, z1: number, out: number) {
  const o = offsetRing(r, out)
  const n = r.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    p.quad([o[i][0], o[i][1], z0], [o[j][0], o[j][1], z0], [o[j][0], o[j][1], z1], [o[i][0], o[i][1], z1])
    p.quad([r[i][0], r[i][1], z1], [o[i][0], o[i][1], z1], [o[j][0], o[j][1], z1], [r[j][0], r[j][1], z1])
    p.quad([r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [o[j][0], o[j][1], z0], [o[i][0], o[i][1], z0])
  }
}

/** Chamfer the convex corners of a counter-clockwise plan ring by c. */
function chamfer(r: P2[], c: number): { ring: P2[]; cut: boolean[] } {
  const ring: P2[] = [], cut: boolean[] = []
  const n = r.length
  r.forEach((P, i) => {
    const A = r[(i - 1 + n) % n], C = r[(i + 1) % n]
    const convex = (P[0] - A[0]) * (C[1] - P[1]) - (P[1] - A[1]) * (C[0] - P[0]) > 0
    if (!convex) { ring.push(P); cut.push(false); return }
    const a = unit([A[0] - P[0], A[1] - P[1], 0]), b = unit([C[0] - P[0], C[1] - P[1], 0])
    ring.push([P[0] + a[0] * c, P[1] + a[1] * c]); cut.push(false)
    ring.push([P[0] + b[0] * c, P[1] + b[1] * c]); cut.push(true) // edge into this point is the chamfer
  })
  return { ring, cut }
}

/** Ear-clipping cap for a simple counter-clockwise plan ring at height z. */
function capRing(p: Part, r: P2[], z: number) {
  const idx = r.map((_, i) => i)
  const area = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const a = r[idx[(k - 1 + idx.length) % idx.length]], b = r[idx[k]], c = r[idx[(k + 1) % idx.length]]
      if (area(a, b, c) <= 1e-9) continue
      const blocked = idx.some((m) => {
        const q = r[m]
        if (q === a || q === b || q === c) return false
        return area(a, b, q) > 0 && area(b, c, q) > 0 && area(c, a, q) > 0
      })
      if (blocked) continue
      p.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) p.tri([...r[idx[0]], z] as V3, [...r[idx[1]], z] as V3, [...r[idx[2]], z] as V3)
}

// ---------------------------------------------------------------------------
/** A timber member raised `h` proud of a facet, along facet coords (s0,t0)-(s1,t1), width w. */
function member(p: Part, f: Frame, s0: number, t0: number, s1: number, t1: number, w: number, h: number) {
  const L = Math.hypot(s1 - s0, t1 - t0) || 1
  const ps = (-(t1 - t0) / L) * (w / 2), pt = ((s1 - s0) / L) * (w / 2)
  const c: P2[] = [[s0 - ps, t0 - pt], [s1 - ps, t1 - pt], [s1 + ps, t1 + pt], [s0 + ps, t0 + pt]]
  const lo = c.map(([s, t]) => to3(f, s, t, 0)), hi = c.map(([s, t]) => to3(f, s, t, h))
  poly(p, hi, f.n)
  for (const i of [0, 2]) { // the two long sides; the ends are too small to read
    const j = (i + 1) % 4
    const out = subv(scl(add(lo[i], lo[j]), 0.5), scl(add(add(lo[0], lo[1]), add(lo[2], lo[3])), 0.25))
    poly(p, [lo[i], lo[j], hi[j], hi[i]], out)
  }
}

/** A vertical prism round a polygon ring (counter-clockwise), sides only, plus optional top. */
function prism(p: Part, ring: P2[], z0: number, z1: number, top = true) {
  const a = ring.map(([x, y]) => [x, y, z0] as V3), b = ring.map(([x, y]) => [x, y, z1] as V3)
  p.loft([a, b])
  if (top) p.cap(b, true)
}
/** A square post (side w) round (x, y), turned to face direction ang. */
function post(p: Part, x: number, y: number, w: number, z0: number, z1: number, ang = 0, c = 0.06) {
  const ca = Math.cos(ang), sa = Math.sin(ang), h = w / 2
  const pts: P2[] = c > 0
    ? [[-h + c, -h], [h - c, -h], [h, -h + c], [h, h - c], [h - c, h], [-h + c, h], [-h, h - c], [-h, -h + c]]
    : [[-h, -h], [h, -h], [h, h], [-h, h]]
  prism(p, pts.map(([u, v]) => [x + u * ca - v * sa, y + u * sa + v * ca] as P2), z0, z1)
}
/** A round column, n sides. */
function column(p: Part, x: number, y: number, r: number, z0: number, z1: number, n = 12) {
  const ring = Array.from({ length: n }, (_, k) => [x + r * Math.cos((k / n) * Math.PI * 2), y + r * Math.sin((k / n) * Math.PI * 2), 0] as V3)
  const a = ring.map(([u, v]) => [u, v, z0] as V3), b = ring.map(([u, v]) => [u, v, z1] as V3)
  for (let k = 0; k < n; k++) {
    const j = (k + 1) % n
    const n0: V3 = unit([a[k][0] - x, a[k][1] - y, 0]), n1: V3 = unit([a[j][0] - x, a[j][1] - y, 0])
    p.tri(a[k], a[j], b[j], undefined, undefined, undefined, [n0, n1, n1])
    p.tri(a[k], b[j], b[k], undefined, undefined, undefined, [n0, n1, n0])
  }
  p.cap(b, true)
}

// ---------------------------------------------------------------------------
// Materials
// ---------------------------------------------------------------------------
const M = {
  plaster: finish('globe-lime-plaster', 0xf3eee4),
  oak: finish('globe-oak', 0x86705e),
  thatch: finish('globe-thatch', 0x86815f),
  window: PALETTE.window,
  yard: PALETTE.roof,
  shade: finish('globe-gallery-shade', 0x6f625a),
}

const plaster = new Part(), oak = new Part(), thatch = new Part(), win = new Part(), yard = new Part(), shade = new Part()

// ---------------------------------------------------------------------------
// The ring
// ---------------------------------------------------------------------------
const NS = 20
const RO = 16.4 // outer wall, circumradius
const RI = 11.6 // gallery front posts
const RB = 15.95 // back of the galleries (inside face of the outer wall)
const YARD = 2.5 // yard and piazza level above the lowest ground
const EAVE = 11.0 // wall plate, outer and inner
const LEVELS = [YARD + 0.55, YARD + 3.3, YARD + 6.05] // gallery floors
const ang = (k: number) => ((9 + 18 * k) * Math.PI) / 180 // vertex angles, clockwise from +y
const at = (r: number, a: number): P2 => [r * Math.sin(a), r * Math.cos(a)]
/** Side k runs from vertex k to k+1 (clockwise from +y); centred at 18(k+1) deg. */
const sideCentreDeg = (k: number) => (18 * (k + 1)) % 360
/** The stage sector: the five sides centred on 144..216 deg (behind the stage). */
const STAGE = (k: number) => { const c = sideCentreDeg(k); return c >= 144 && c <= 216 }
const TURRET = (k: number) => [54, 306].includes(sideCentreDeg(k))

// Outer wall: one facet per side, plaster with raised oak framing and small windows.
const F_W = 0.32, F_H = 0.11 // member width, how proud
for (let k = 0; k < NS; k++) {
  const a0 = ang(k), a1 = ang(k + 1)
  // Counter-clockwise from outside means going from vertex k+1 to k (vertices run clockwise).
  const A = at(RO, a1), B = at(RO, a0)
  const pg: V3[] = [[A[0], A[1], 0], [B[0], B[1], 0], [B[0], B[1], EAVE], [A[0], A[1], EAVE]]
  const f = frameOf(pg)
  const W = Math.hypot(B[0] - A[0], B[1] - A[1]), mid = W / 2
  const tz = (z: number) => tAtZ(f, z)
  const holes: Hole[] = []
  const stage = STAGE(k)
  if (!TURRET(k)) {
    // One small window per upper storey, set to alternate sides of the mid post.
    const o = k % 2 ? 0.25 : 0.75
    holes.push({ s0: W * o - 0.4, s1: W * o + 0.4, t0: tz(LEVELS[1] + 1.0), t1: tz(LEVELS[1] + 1.8), d: 0.25, back: win, side: oak })
    holes.push({ s0: W * (1 - o) - 0.4, s1: W * (1 - o) + 0.4, t0: tz(LEVELS[2] + 0.9), t1: tz(LEVELS[2] + 1.6), d: 0.25, back: win, side: oak })
  }
  if (stage) holes.push({ s0: mid - 0.45, s1: mid + 0.45, t0: tz(YARD + 1.2), t1: tz(YARD + 1.9), d: 0.25, back: win, side: oak })
  facet(plaster, pg, holes, f)
  if (TURRET(k)) continue
  // Framing: mid post, rails at the floor lines, the wall plate, and the
  // pointed-arch braces of the lowest storey and the knee braces above.
  const z1 = YARD + 0.1, zr1 = LEVELS[1] - 0.2, zr2 = LEVELS[2] - 0.2
  member(oak, f, mid, tz(z1), mid, tz(EAVE - 0.3), F_W, F_H)
  for (const z of [YARD, zr1, zr2]) member(oak, f, 0.1, tz(z), W - 0.1, tz(z), F_W, F_H)
  member(oak, f, 0.1, tz(EAVE - 0.25), W - 0.1, tz(EAVE - 0.25), 0.4, F_H + 0.04)
  for (const [pa, pb] of [[0.2, mid - 0.15], [mid + 0.15, W - 0.2]] as [number, number][]) {
    // Lower storey: a pointed arch in each panel, two curved braces rising
    // from the posts to meet under the floor rail; each brace in two pieces.
    const pm = (pa + pb) / 2, zt = zr1 - 0.15, zb = YARD + 0.7
    for (const [ps, sg] of [[pa, 1], [pb, -1]] as [number, number][]) {
      const sk = ps + sg * (pm - ps) * 0.22, zk = zb + (zt - zb) * 0.62
      member(oak, f, ps, tz(zb), sk, tz(zk), 0.24, F_H)
      member(oak, f, sk, tz(zk), pm, tz(zt), 0.24, F_H)
    }
  }
  for (const [s0, s1] of [[0.25, mid], [W - 0.25, mid]] as [number, number][]) {
    // Top storey knee brace under the wall plate.
    member(oak, f, s0 + (s1 - s0) * 0.15, tz(EAVE - 0.4), s0, tz(EAVE - 1.6), 0.24, F_H)
  }

}
// Corner posts at every outer vertex.
for (let k = 0; k < NS; k++) {
  const [x, y] = at(RO + 0.06, ang(k))
  post(oak, x, y, 0.42, YARD - 0.05, EAVE, -ang(k))
}
// Plinth below the yard level (the undercroft): plaster with an oak sill.
// (Already the bottom of each facet, from z = 0.)

// The galleries: posts, floors, balustrades, the wall plate, the back.
const inner = (r: number) => Array.from({ length: NS }, (_, k) => at(r, ang(k)))
for (let k = 0; k < NS; k++) {
  if (STAGE(k)) continue
  const a0 = ang(k), a1 = ang(k + 1)
  const i0 = at(RI, a0), i1 = at(RI, a1), b0 = at(RB, a0), b1 = at(RB, a1)
  // Floor slabs (tops and front edges), ceilings under the next floor.
  for (const z of LEVELS) {
    const t = 0.3
    poly(oak, [[i0[0], i0[1], z], [b0[0], b0[1], z], [b1[0], b1[1], z], [i1[0], i1[1], z]], [0, 0, 1])
    poly(oak, [[i0[0], i0[1], z - t], [i1[0], i1[1], z - t], [i1[0], i1[1], z], [i0[0], i0[1], z]], [-(i0[0] + i1[0]), -(i0[1] + i1[1]), 0])
    poly(shade, [[i0[0], i0[1], z - t], [b0[0], b0[1], z - t], [b1[0], b1[1], z - t], [i1[0], i1[1], z - t]], [0, 0, -1])
    // Balustrade: a solid oak band at the front (turned balusters at real scale are too fine).
    if (z > LEVELS[0]) {
      const r2 = RI + 0.15
      const j0 = at(r2, a0), j1 = at(r2, a1)
      poly(oak, [[j0[0], j0[1], z], [j1[0], j1[1], z], [j1[0], j1[1], z + 0.95], [j0[0], j0[1], z + 0.95]], [-(j0[0] + j1[0]), -(j0[1] + j1[1]), 0])
      poly(oak, [[j0[0], j0[1], z + 0.95], [j1[0], j1[1], z + 0.95], [i1[0], i1[1], z + 0.95], [i0[0], i0[1], z + 0.95]], [0, 0, 1])
    }
  }
  // Ground gallery front: a low oak front from the yard to its floor.
  poly(oak, [[i0[0], i0[1], YARD], [i1[0], i1[1], YARD], [i1[0], i1[1], LEVELS[0] + 0.9], [i0[0], i0[1], LEVELS[0] + 0.9]], [-(i0[0] + i1[0]), -(i0[1] + i1[1]), 0])
  poly(oak, [[i0[0], i0[1], LEVELS[0] + 0.9], [i1[0], i1[1], LEVELS[0] + 0.9], at(RI + 0.15, a1).concat(LEVELS[0] + 0.9) as V3, at(RI + 0.15, a0).concat(LEVELS[0] + 0.9) as V3], [0, 0, 1])
  // Back of the galleries: shaded, the benches and the inside of the outer wall.
  poly(shade, [[b0[0], b0[1], YARD], [b1[0], b1[1], YARD], [b1[0], b1[1], EAVE - 0.4], [b0[0], b0[1], EAVE - 0.4]], [-(b0[0] + b1[0]), -(b0[1] + b1[1]), 0])
  // Wall plate along the gallery front.
  const w0 = at(RI - 0.2, a0), w1 = at(RI - 0.2, a1), v0 = at(RI + 0.25, a0), v1 = at(RI + 0.25, a1)
  prism(oak, [w0, w1, v1, v0], EAVE - 0.55, EAVE - 0.1)
}
// Gallery ends beside the tiring house.
for (const [k, sgn] of [[7, 1], [12, -1]] as [number, number][]) {
  const a = ang(k), i = at(RI, a), b = at(RB, a)
  poly(plaster, [[i[0], i[1], YARD], [b[0], b[1], YARD], [b[0], b[1], EAVE], [i[0], i[1], EAVE]], [-Math.cos(a) * sgn, Math.sin(a) * sgn, 0])
}
// Gallery posts at the front.
for (let k = 0; k < NS; k++) {
  const c = sideCentreDeg(k) - 9 // vertex k angle in degrees
  if (c > 135 && c < 225) continue
  const [x, y] = at(RI - 0.05, ang(k))
  post(oak, x, y, 0.4, YARD, EAVE - 0.1, -ang(k))
}
// The yard floor (it is the roof of the undercroft, 2.5 m above the lowest street).
{
  const ring = inner(RI).map(([x, y]) => [x, y, YARD - 0.02] as V3)
  // Cut to the yard side of the stage front.
  const cut = clip3(ring, [0, -1, 0], 11.0)
  poly(yard, cut, [0, 0, 1])
}

// ---------------------------------------------------------------------------
// The thatched roof ring
// ---------------------------------------------------------------------------
/** Roof profile (radius, height) from the inner eave over the ridge to the outer eave and back underneath. */
const PROF = (lift: number): P2[] => [
  [9.85, 10.3 + lift], [9.7, 10.75 + lift], [9.85, 11.15 + lift], [12.75, 15.35 + lift], [13.2, 15.6 + lift], [13.65, 15.35 + lift],
  [16.95, 11.15 + lift], [17.1, 10.75 + lift], [16.95, 10.3 + lift],
]
function roofArc(k0: number, k1: number, lift: number, mat: Part) {
  const prof = PROF(lift)
  const rings = prof.map(([r, z]) => {
    const pts: V3[] = []
    for (let k = k1; k >= k0; k--) { const [x, y] = at(r, ang(k)); pts.push([x, y, z]) }
    return pts
  })
  // Loft along the profile; each strip runs round the arc. Close the underside.
  for (let i = 0; i < prof.length; i++) {
    const A = rings[i], B = rings[(i + 1) % prof.length]
    for (let j = 0; j < A.length - 1; j++) {
      const q: V3[] = [A[j], A[j + 1], B[j + 1], B[j]]
      // Outward: away from the profile's centre (r 13.2, z 12.8).
      const m = scl(add(add(q[0], q[1]), add(q[2], q[3])), 0.25)
      const rr = Math.hypot(m[0], m[1])
      const out: V3 = [(m[0] / rr) * (rr - 13.4), (m[1] / rr) * (rr - 13.4), m[2] - (12.6 + lift)]
      poly(i === prof.length - 1 ? shade : mat, q, out)
    }
  }
  // End caps (profile polygons) at both ends of the arc.
  for (const [k, sgn] of [[k0, 1], [k1, -1]] as [number, number][]) {
    const pts = prof.map(([r, z]) => { const [x, y] = at(r, ang(k)); return [x, y, z] as V3 })
    const tangent: V3 = [Math.cos(ang(k)) * -sgn, -Math.sin(ang(k)) * -sgn, 0]
    poly(mat, pts, tangent)
  }
}
// Main ring: vertices 7..18 wrap: sides not in the stage sector run from vertex
// 11 (207 deg) ... the stage sector is sides 7..11 (centres 144..216), vertices 7..12.
roofArc(12, 27, 0, thatch) // vertices 12..27 (= 12..19, 0..7 mod 20)
roofArc(7, 12, 1.4, thatch) // the tiring house, higher

// ---------------------------------------------------------------------------
// Stair turrets: gabled, timber framed, thatched
// ---------------------------------------------------------------------------
for (const deg of [54, 306]) {
  const a = (deg * Math.PI) / 180
  const u: P2 = [Math.sin(a), Math.cos(a)], v: P2 = [Math.cos(a), -Math.sin(a)] // out, across (to the right seen from outside)
  const r0 = RO * Math.cos(Math.PI / 20) - 0.3, r1 = 20.2, hw = 2.6
  const P = (r: number, s: number): P2 => [u[0] * r + v[0] * s, u[1] * r + v[1] * s]
  const ringT = [P(r0, -hw), P(r0, hw), P(r1, hw), P(r1, -hw)].reverse()
  // Walls with framing: three outward faces.
  const corners = [P(r1, -hw), P(r1, hw), P(r0, hw), P(r0, -hw)]
  const faces: [P2, P2][] = [[P(r0, -hw), P(r1, -hw)], [P(r1, -hw), P(r1, hw)], [P(r1, hw), P(r0, hw)]]
  for (const [A2, B2] of faces) {
    const pg: V3[] = [[A2[0], A2[1], 0], [B2[0], B2[1], 0], [B2[0], B2[1], EAVE], [A2[0], A2[1], EAVE]]
    // Make sure it faces out of the turret.
    const f0 = frameOf(pg)
    const cx = (A2[0] + B2[0]) / 2 - u[0] * (r0 + r1) / 2, cy = (A2[1] + B2[1]) / 2 - u[1] * (r0 + r1) / 2
    const pg2 = f0.n[0] * cx + f0.n[1] * cy < 0 ? [pg[1], pg[0], pg[3], pg[2]] : pg
    const f = frameOf(pg2)
    const W = Math.hypot(B2[0] - A2[0], B2[1] - A2[1])
    const tz = (z: number) => tAtZ(f, z)
    const holes: Hole[] = [
      { s0: W / 2 - 0.45, s1: W / 2 + 0.45, t0: tz(LEVELS[1] + 0.9), t1: tz(LEVELS[1] + 1.8), d: 0.25, back: win, side: oak },
      { s0: W / 2 - 0.45, s1: W / 2 + 0.45, t0: tz(LEVELS[2] + 0.9), t1: tz(LEVELS[2] + 1.8), d: 0.25, back: win, side: oak },
    ]
    facet(plaster, pg2, holes, f)
    for (const z of [YARD, LEVELS[1] - 0.2, LEVELS[2] - 0.2]) member(oak, f, 0.1, tz(z), W - 0.1, tz(z), F_W, F_H)
    member(oak, f, 0.1, tz(EAVE - 0.25), W - 0.1, tz(EAVE - 0.25), 0.4, F_H + 0.04)
    for (const s of [W * 0.25, W * 0.75]) member(oak, f, s, tz(YARD), s, tz(EAVE - 0.3), F_W, F_H)
    member(oak, f, 0.3, tz(YARD + 0.5), W * 0.25, tz(LEVELS[1] - 0.3), 0.26, F_H)
    member(oak, f, W - 0.3, tz(YARD + 0.5), W * 0.75, tz(LEVELS[1] - 0.3), 0.26, F_H)
  }
  for (const c of corners.slice(0, 2)) post(oak, c[0], c[1], 0.42, YARD - 0.05, EAVE, -a)
  // Gable roof, ridge running outward; gable end faces out.
  const RID = 15.9, ov = 0.45
  const e0 = P(r0 - 1.2, -hw - ov), e1 = P(r1 + ov, -hw - ov), e2 = P(r1 + ov, hw + ov), e3 = P(r0 - 1.2, hw + ov)
  const k0 = P(r0 - 1.2, 0), k1 = P(r1 + ov, 0)
  const Z = (p: P2, z: number): V3 => [p[0], p[1], z]
  poly(thatch, [Z(e0, EAVE - 0.1), Z(e1, EAVE - 0.1), Z(k1, RID), Z(k0, RID)], [-v[0], -v[1], 1])
  poly(thatch, [Z(e3, EAVE - 0.1), Z(k0, RID), Z(k1, RID), Z(e2, EAVE - 0.1)], [v[0], v[1], 1])
  poly(thatch, [Z(e1, EAVE - 0.1), Z(e2, EAVE - 0.1), Z(e2, EAVE - 0.5), Z(e1, EAVE - 0.5)], [u[0], u[1], 0])
  poly(thatch, [Z(e1, EAVE - 0.1), Z(e1, EAVE - 0.5), Z(e0, EAVE - 0.5), Z(e0, EAVE - 0.1)], [-v[0], -v[1], 0])
  poly(thatch, [Z(e2, EAVE - 0.5), Z(e2, EAVE - 0.1), Z(e3, EAVE - 0.1), Z(e3, EAVE - 0.5)], [v[0], v[1], 0])
  // Gable triangle (plaster) with a king post and collar, set under the thatch overhang.
  const g0 = P(r1, -hw), g1 = P(r1, hw), gk = P(r1, 0)
  const gpg: V3[] = [Z(g0, EAVE), Z(g1, EAVE), Z(gk, RID - 0.6)]
  const gf = frameOf(gpg)
  const gpg2 = gf.n[0] * u[0] + gf.n[1] * u[1] < 0 ? [gpg[1], gpg[0], gpg[2]] : gpg
  const g = frameOf(gpg2)
  facet(plaster, gpg2, [{ s0: sAt(g, Z(gk, 0)) - 0.35, s1: sAt(g, Z(gk, 0)) + 0.35, t0: tAtZ(g, EAVE + 1.0), t1: tAtZ(g, EAVE + 1.8), d: 0.2, back: win, side: oak }], g)
  const sg = sAt(g, Z(gk, 0))
  member(oak, g, sg, tAtZ(g, EAVE), sg, tAtZ(g, EAVE + 0.9), 0.3, F_H)
  member(oak, g, sg - 1.3, tAtZ(g, EAVE + 2.3), sg + 1.3, tAtZ(g, EAVE + 2.3), 0.28, F_H)
  void ringT
}

// ---------------------------------------------------------------------------
// The stage, the frons scenae, the heavens and the stage roof
// ---------------------------------------------------------------------------
{
  const YF = -11.0, XF = 7.0 // frons scenae line and half-width
  const ST = YARD + 1.45 // stage top
  prism(oak, [[-6.6, YF], [6.6, YF], [6.6, -1.0], [-6.6, -1.0]], YARD, ST)
  // Frons scenae: oak-panelled wall with three doors and the lords' gallery above.
  const fr: V3[] = [[-XF, YF, YARD], [XF, YF, YARD], [XF, YF, EAVE + 1.4], [-XF, YF, EAVE + 1.4]]
  // It faces +y (into the yard): wind it counter-clockwise from +y.
  const frR: V3[] = [fr[1], fr[0], fr[3], fr[2]]
  const f = frameOf(frR)
  const tz = (z: number) => tAtZ(f, z)
  const sx = (x: number) => sAt(f, [x, YF, 0])
  const holes: Hole[] = [
    { s0: Math.min(sx(-1.3), sx(1.3)), s1: Math.max(sx(-1.3), sx(1.3)), t0: tz(ST), t1: tz(ST + 3.4), d: 0.9, back: shade, side: oak },
    { s0: Math.min(sx(-4.6), sx(-3.0)), s1: Math.max(sx(-4.6), sx(-3.0)), t0: tz(ST), t1: tz(ST + 2.8), d: 0.6, back: shade, side: oak },
    { s0: Math.min(sx(4.6), sx(3.0)), s1: Math.max(sx(4.6), sx(3.0)), t0: tz(ST), t1: tz(ST + 2.8), d: 0.6, back: shade, side: oak },
    { s0: Math.min(sx(-6.0), sx(6.0)), s1: Math.max(sx(-6.0), sx(6.0)), t0: tz(ST + 4.5), t1: tz(ST + 6.9), d: 1.4, back: shade, side: oak },
  ]
  facet(oak, frR, holes, f)
  // Balustrade of the lords' gallery.
  prism(oak, [[-6.0, YF + 0.05], [6.0, YF + 0.05], [6.0, YF + 0.35], [-6.0, YF + 0.35]], ST + 4.5, ST + 5.4)
  // Side walls from the frons to the first gallery posts.
  for (const sgn of [-1, 1]) {
    const g = at(RI, ang(sgn > 0 ? 7 : 12))
    const A: P2 = [sgn * XF, YF], B: P2 = [g[0], g[1]]
    const pg: V3[] = sgn < 0 ? [[A[0], A[1], YARD], [B[0], B[1], YARD], [B[0], B[1], EAVE + 1.4], [A[0], A[1], EAVE + 1.4]] : [[B[0], B[1], YARD], [A[0], A[1], YARD], [A[0], A[1], EAVE + 1.4], [B[0], B[1], EAVE + 1.4]]
    facet(plaster, pg)
  }
  // Tiring-house back wall top (closes the gap under the raised roof).
  // The heavens: a deep painted canopy on two columns.
  prism(oak, [[-5.8, YF], [5.8, YF], [5.8, -0.6], [-5.8, -0.6]], 11.3, 13.0)
  for (const sgn of [-1, 1]) {
    column(oak, sgn * 4.6, -3.2, 0.42, ST + 1.3, 11.3)
    post(yard, sgn * 4.6, -3.2, 1.0, ST, ST + 1.3, 0, 0.08)
  }
  // Stage roof: a thatched gable running back from the yard into the tiring-house roof.
  const yF = -0.4, yB = -13.6, xe = 6.1, ze = 12.9, zr = 17.4
  poly(thatch, [[-xe, yF, ze], [-xe, yB, ze], [0, yB, zr], [0, yF, zr]], [-1, 0, 1])
  poly(thatch, [[xe, yB, ze], [xe, yF, ze], [0, yF, zr], [0, yB, zr]], [1, 0, 1])
  poly(thatch, [[-xe, yF, ze - 0.45], [xe, yF, ze - 0.45], [xe, yF, ze], [-xe, yF, ze]], [0, 1, 0])
  // Gable end facing the yard, plaster with oak framing.
  const gpg: V3[] = [[xe - 0.5, yF - 0.3, ze], [-(xe - 0.5), yF - 0.3, ze], [0, yF - 0.3, zr - 0.5]]
  const gf = frameOf(gpg)
  facet(oak, gpg, [], gf)
  const sm = sAt(gf, [0, yF, 0])
  member(yard, gf, sm - 4.6, tAtZ(gf, ze + 0.2), sm + 4.6, tAtZ(gf, ze + 0.2), 0.4, F_H)
}

const parts = [
  { part: plaster, material: M.plaster },
  { part: oak, material: M.oak },
  { part: thatch, material: M.thatch },
  { part: win, material: M.window },
  { part: yard, material: M.yard },
  { part: shade, material: M.shade },
]
if (import.meta.main) {
  const tris = parts.reduce((s, { part }) => s + part.triangles, 0)
  const glb = writeGlb("Shakespeare's Globe", parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor' })
  writeFileSync(new URL(`../models/${ID}.glb`, import.meta.url), glb)
  console.log(`models/${ID}.glb: ${tris} triangles, ${glb.length} bytes`)
}
