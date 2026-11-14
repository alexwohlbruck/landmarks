/**
 * Imperial War Museum London, Lambeth Road: the centre block of the former
 * Bethlem Royal Hospital (James Lewis, 1815; portico and dome by Sydney
 * Smirke, 1846), with the 1989 atrium. Grade II listed (NHLE 1385640).
 * Original procedural geometry, CC0-1.0.
 *   bun generators/london-imperial-war-museum.ts
 *
 * Frame: turned to BEARING 1.0 (the building's axis, the portico facing
 * north up the avenue to Lambeth Road). +y north, +x east, z up, metres.
 * Origin = the area centroid of the OSM outline way/8614496 (-0.1085940,
 * 51.4958202), on the ground. z = 0 is the lowest ground under the building,
 * at its rear (south); the front lawn and the portico steps are 2.4 m higher
 * (EA lidar DTM: 0.6 m above the box's ground_min at the rear, 2.9 at the
 * front); the walls run down to z = 0 all round and the windows follow the
 * ground.
 *
 * The two 15-inch guns are included: they stand on the lawn 11 m in front of
 * the portico (OSM node/540449834, historic=cannon, "15-inch Mk1 Naval Guns",
 * 23 m north of the outline), and they are the museum's best-known feature.
 * They are not an OSM building, so nothing extra is replaced for them.
 *
 * What makes it the Imperial War Museum, and how each is drawn
 * - The portico of six giant Ionic columns (real round columns on square
 *   plinths, capitals, the entablature, the pediment with its raking roof),
 *   up the steps from the lawn.
 * - The copper-green dome on its tall drum above the portico: the square
 *   stone attic with corner urns, the sixteen-sided drum with eight arched
 *   windows (real recesses, semicircular heads) between paired columns, the
 *   cornice, the stilted copper dome with eight stone-framed oculi, the
 *   lantern and finial.
 * - The long three-storey stock-brick front range with its stone cornice
 *   and balustraded parapet (real openings), the projecting centre; real
 *   recessed windows in three storeys (stone reveals), in bays.
 * - The body behind: brick walls, flat margins and slopes up to the glazed
 *   barrel vault of the atrium (ribs), as the lidar shows.
 * - The two 15-inch naval guns on their concrete cradle, real barrels
 *   (breech ring, jacket, tapering chase, muzzle swell), elevated 7 deg,
 *   pointing north to the street.
 * - The rear extensions plain.
 * - Night: the windows glow; the dome and portico are floodlit in reality
 *   but carry no _FLOODLIGHT here (kept simple).
 *
 * Evidence
 * - OSM (ODbL): way/8614496 (Imperial War Museum London, building=hospital,
 *   building:use=museum, old_name Bethlem Royal Hospital, wikidata Q749808);
 *   no building:parts inside it. node/540449834 (the guns).
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (composite ~2000-2022). Measured above z = 0: main parapets
 *   18.0-19.0; the roof slopes rising from 19.3 at 24 m off the axis to
 *   23.0 at 7 m; the atrium vault crown 28.2 over x +/-7, y -46..31; dome
 *   crown 40.8 at (axis, 45.5); the box's highest return 44.7 (the lantern
 *   finial); rear extension 19.7 and 12.5.
 * - Published: listed building record NHLE 1385640 (Historic England);
 *   Wikipedia "Imperial War Museum London", "Bethlem Royal Hospital"; the
 *   guns are 15-inch BL Mk I from HMS Ramillies and HMS Resolution, 16.5 m
 *   long (IWM).
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Imperial War Museum, London - north view.jpg", DeFacto, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Imperial_War_Museum,_London_-_north_view.jpg
 *     (portico, drum, dome, oculi, the guns from the north-east);
 *   "Imperial War Museum. London, UK.jpg", Ввласенко, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Imperial_War_Museum._London,_UK.jpg
 *     (the whole front from the north-west, level: storeys, bays, guns);
 *   "Imperial War Museum, London 1.jpg", Jwslubbock, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Imperial_War_Museum,_London_1.jpg
 *     (front on the axis: proportions scaled from it, 9.2 px/m);
 *   "Guns in front of the Imperial War Museum (geograph 2788057).jpg",
 *     Marathon, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Guns_in_front_of_the_Imperial_War_Museum_(geograph_2788057).jpg
 *     (the guns: barrel profile, cradle, elevation);
 *   "15 inch Naval Guns - Imperial War Museum - Joy of Museum.jpg",
 *     Joyofmuseums, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:15_inch_Naval_Guns_-_Imperial_War_Museum_-_Joy_of_Museum.jpg
 * - Look-only: none.
 *
 * Estimated (from the photos against the lidar): storey and window lines,
 * the column height (11.1 m) and spacing, the pediment (apex 18.3 m above the
 * lawn), the attic (to 23.1), the drum (to 30.6), the dome profile between
 * the lidar crown and the drum, the bay rhythm (3.0-3.7 m), the gun cradle.
 *
 * Doubts
 * - The atrium roof is drawn to the lidar (vault 28.2 m), so in a level
 *   orthographic view from the north it shows above the front parapet; from
 *   the park, in perspective, the parapet hides it. The glass is a muted
 *   grey (#a9b1b6).
 * - The east, west and rear walls were not photographed; they carry the
 *   front's window rhythm. The roof slopes are lidar shapes, simplified.
 * - The guns are centred on OSM node/540449834 (78 m north of the anchor,
 *   x -0.7): barrels 17 m (published 16.5 m), drawn bold (1.15 m radius at
 *   the jacket), axis 3.6 m above the lawn, elevated 8 deg, on a 8.4 x 8.5 m
 *   concrete cradle.
 * - The pediment sculpture, the inscription, the window architraves and the
 *   urns' detail are left out.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { writeFileSync } from 'node:fs'

export const BEARING = 1.0
const ID = 'london-imperial-war-museum'

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
// ---------------------------------------------------------------------------
// More kit: round things
// ---------------------------------------------------------------------------
/** A lathe: profile (r, z) swept round (cx, cy), n sides, smooth-shaded. */
function lathe(p: Part, cx: number, cy: number, prof: P2[], n = 16) {
  const pt = (r: number, z: number, k: number): V3 => [cx + r * Math.cos((k / n) * Math.PI * 2), cy + r * Math.sin((k / n) * Math.PI * 2), z]
  for (let i = 0; i < prof.length - 1; i++) {
    const [r0, z0] = prof[i], [r1, z1] = prof[i + 1]
    // Profile normal (outward, in the r-z plane).
    const dr = r1 - r0, dz = z1 - z0, L = Math.hypot(dr, dz) || 1
    const nr = dz / L, nz = -dr / L
    for (let k = 0; k < n; k++) {
      const a = pt(r0, z0, k), b = pt(r0, z0, k + 1), c = pt(r1, z1, k + 1), d = pt(r1, z1, k)
      const na: V3 = [nr * Math.cos((k / n) * Math.PI * 2), nr * Math.sin((k / n) * Math.PI * 2), nz]
      const nb: V3 = [nr * Math.cos(((k + 1) / n) * Math.PI * 2), nr * Math.sin(((k + 1) / n) * Math.PI * 2), nz]
      if (r1 < 1e-6) { p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nb]); continue }
      p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nb])
      p.tri(a, c, d, undefined, undefined, undefined, [na, nb, na])
    }
  }
  const [rl, zl] = prof[prof.length - 1]
  if (rl > 1e-6) poly(p, Array.from({ length: n }, (_, k) => pt(rl, zl, k)), [0, 0, 1])
}
/** A tube between two points, tapering r0 -> r1, n sides, capped at both ends. */
function tube(p: Part, a: V3, b: V3, r0: number, r1: number, n = 12, capA = true, capB = true) {
  const d = unit(subv(b, a))
  const u = unit(crs(d, Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), w = crs(d, u)
  const ring = (c: V3, r: number) => Array.from({ length: n }, (_, k) => {
    const t = (k / n) * Math.PI * 2
    return add(c, add(scl(u, r * Math.cos(t)), scl(w, r * Math.sin(t))))
  })
  const A = ring(a, r0), B = ring(b, r1)
  for (let k = 0; k < n; k++) {
    const j = (k + 1) % n
    const nk = unit(subv(A[k], a)), nj = unit(subv(A[j], a))
    p.tri(A[k], A[j], B[j], undefined, undefined, undefined, [nk, nj, nj])
    p.tri(A[k], B[j], B[k], undefined, undefined, undefined, [nk, nj, nk])
  }
  if (capA) poly(p, A, scl(d, -1))
  if (capB) poly(p, B, d)
}

// ---------------------------------------------------------------------------
// Materials
// ---------------------------------------------------------------------------
const M = {
  brick: finish('iwm-stock-brick', 0xab977b),
  stone: PALETTE.stone,
  copper: finish('iwm-copper', 0x7fa595),
  window: PALETTE.window,
  roof: PALETTE.roof,
  glass: { name: 'glass', color: 0xa9b1b6, roughness: 0.3 },
}
const brick = new Part(), stone = new Part(), copper = new Part(), win = new Part(), roof = new Part(), glass = new Part()

// ---------------------------------------------------------------------------
// Ground and the plan
// ---------------------------------------------------------------------------
const AX = -0.55 // the axis of symmetry
const LAWN = 2.4 // the front lawn and the portico steps, above the lowest (rear) ground
/** Ground under the walls: 2.4 at the front, falling to 0.1 at the rear (lidar DTM). */
const gnd = (y: number) => Math.max(0.1, Math.min(LAWN, 0.1 + ((y + 49) / 93) * (LAWN - 0.1)))
const PAR = 18.6 // parapet of the main block (lidar 18.5-19)
const X = (u: number) => AX + u

/** A vertical brick wall a->b (counter-clockwise round the building) with windows in bays. */
function wall(a: P2, b: P2, z1: number, bays: number, opts: { rows?: [number, number][]; skip?: (k: number) => boolean; mat?: Part } = {}) {
  const pg = wallPoly(a, b, 0, z1)
  const f = frameOf(pg)
  const W = Math.hypot(b[0] - a[0], b[1] - a[1])
  const holes: Hole[] = []
  const n = bays > 0 ? Math.round(W / bays) : 0
  for (let k = 0; k < n; k++) {
    if (opts.skip?.(k)) continue
    const sc = ((k + 0.5) / n) * W
    const P: V3 = add(f.o, scl(f.u, sc))
    const g = gnd(P[1])
    for (const [z0, z1r] of opts.rows ?? [[1.6, 4.3], [6.1, 9.0], [10.9, 12.7]]) {
      const ww = z0 > 10 ? 1.1 : z1r - z0 > 4 ? 1.6 : 1.3
      holes.push({ s0: sc - ww / 2, s1: sc + ww / 2, t0: tAtZ(f, g + z0), t1: tAtZ(f, g + z1r), d: 0.3, back: win, side: stone })
    }
  }
  facet(opts.mat ?? brick, pg, holes, f)
}

// The main body (the old hospital's centre block, with the 1989 atrium): y -49.3..32.
const BODY: P2[] = [[X(-27.6), -49.3], [X(27.2), -49.3], [X(27.2), 32.0], [X(-27.6), 32.0]]
// The front range, a little wider, and the projecting centre.
const FRONT: P2[] = [[X(-29.9), 32.0], [X(29.9), 32.0], [X(29.9), 44.0], [X(-29.9), 44.0]]
const CENTRE: P2[] = [[X(-20.55), 44.0], [X(20.55), 44.0], [X(20.55), 50.1], [X(-20.55), 50.1]]

// Body walls: east and west sides, the rear.
// The sides and rear: two storeys grouped in one panel above the ground-floor window.
const SIDE_ROWS: [number, number][] = [[1.6, 4.3], [6.1, 12.7]]
wall(BODY[0], BODY[1], PAR, 5.5, { rows: SIDE_ROWS, skip: (k) => k > 3 && k < 6 })
wall(BODY[1], BODY[2], PAR, 5.5, { rows: SIDE_ROWS })
wall(BODY[3], BODY[0], PAR, 5.5, { rows: SIDE_ROWS })
// Front range: its two short sides and its front either side of the centre.
wall(FRONT[1], FRONT[2], PAR, 4.0, { rows: SIDE_ROWS })
wall(FRONT[3], FRONT[0], PAR, 4.0, { rows: SIDE_ROWS })
wall(FRONT[2], [X(20.55), 44.0], PAR, 3.1)
wall([X(-20.55), 44.0], FRONT[3], PAR, 3.1)
// Centre block front and sides (the front wall is behind the portico).
wall(CENTRE[1], CENTRE[2], PAR, 3.0)
wall(CENTRE[3], CENTRE[0], PAR, 3.0)
wall(CENTRE[2], [X(10.5), 50.1], PAR, 3.3)
wall([X(-10.5), 50.1], CENTRE[3], PAR, 3.3)
wall([X(10.5), 50.1], [X(-10.5), 50.1], PAR, 3.5, { rows: [[1.0, 4.4], [6.1, 9.0]] })
// The front range's short south faces beside the body.
wall([X(-29.9), 32.0], [X(-27.6), 32.0], PAR, 0)
wall([X(27.2), 32.0], [X(29.9), 32.0], PAR, 0)

// Stone dressings: the cornice and the plinth band round the front, balustrade on the front range.
for (const r of [FRONT, CENTRE]) {
  const z0 = LAWN + 13.2
  band(stone, r, z0, z0 + 0.9, 0.35)
}
band(stone, BODY, 16.0, 16.7, 0.25)
// Balustrades: a stone parapet with real openings between the dies.
function balustrade(a: P2, b: P2, z0: number, h: number) {
  const pg = wallPoly(a, b, z0, z0 + h)
  const f = frameOf(pg)
  const W = Math.hypot(b[0] - a[0], b[1] - a[1])
  const holes: Hole[] = []
  for (let s = 0.9; s + 1.6 < W - 0.6; s += 2.4) holes.push({ s0: s, s1: s + 1.6, t0: tAtZ(f, z0 + 0.3), t1: tAtZ(f, z0 + h - 0.35), d: 0.35, back: stone, side: stone })
  facet(stone, pg, holes, f)
  prism(stone, [[a[0], a[1]], [b[0], b[1]], [b[0] - (b[1] - a[1]) / W * 0.4, b[1] + (b[0] - a[0]) / W * 0.4], [a[0] - (b[1] - a[1]) / W * 0.4, a[1] + (b[0] - a[0]) / W * 0.4]], z0 + h - 0.25, z0 + h)
}
for (const [a, b] of [[FRONT[2], [X(20.55), 44.0]], [[X(-20.55), 44.0], FRONT[3]]] as [P2, P2][]) balustrade(a, b, PAR, 1.3)
balustrade(CENTRE[2], [X(10.5), 50.1], PAR, 1.3)
balustrade([X(-10.5), 50.1], CENTRE[3], PAR, 1.3)

/** A vertical prism round a counter-clockwise ring, sides and top. */
function prism(p: Part, ring: P2[], z0: number, z1: number, top = true) {
  p.loft([ring.map(([x, y]) => [x, y, z0] as V3), ring.map(([x, y]) => [x, y, z1] as V3)])
  if (top) p.cap(ring.map(([x, y]) => [x, y, z1] as V3), true)
}

// ---------------------------------------------------------------------------
// Roofs: flat round the edge, pitched up to the glazed atrium vault
// ---------------------------------------------------------------------------
{
  const yS = -48.6, yN = 31.4, xi = 7.0, zi = 23.0, xe = 24.4, ze = 19.3
  for (const s of [-1, 1]) {
    const xo = s > 0 ? 27.2 : -27.6
    // Flat margin.
    poly(roof, [[X(xo), yS, PAR], [X(s * xe), yS, PAR], [X(s * xe), yN, PAR], [X(xo), yN, PAR]], [0, 0, 1])
    // Pitched slope (with its small upstand from PAR to ze).
    poly(roof, [[X(s * xe), yS, PAR], [X(s * xe), yN, PAR], [X(s * xe), yN, ze], [X(s * xe), yS, ze]], [-s, 0, 0])
    poly(roof, [[X(s * xe), yS, ze], [X(s * xi), yS, zi], [X(s * xi), yN, zi], [X(s * xe), yN, ze]], [-s * 0.2, 0, 1])
    // Gable ends of the slopes.
    for (const [y, dir] of [[yS, -1], [yN, 1]] as [number, number][]) poly(brick, [[X(s * xe), y, PAR], [X(s * xi), y, PAR], [X(s * xi), y, zi], [X(s * xe), y, ze]], [0, dir, 0])
  }
  // The atrium's glazed barrel vault with ribs.
  const n = 10, crown = 28.2
  const arc = Array.from({ length: n + 1 }, (_, k) => {
    const t = (k / n) * Math.PI
    return [X(xi * Math.cos(t)), zi + (crown - zi) * Math.sin(t)] as P2
  })
  for (let k = 0; k < n; k++) {
    const [x0, z0] = arc[k], [x1, z1] = arc[k + 1]
    const nx = Math.cos(((k + 0.5) / n) * Math.PI), nz = Math.sin(((k + 0.5) / n) * Math.PI)
    poly(glass, [[x0, yS, z0], [x0, yN, z0], [x1, yN, z1], [x1, yS, z1]], [nx, 0, nz])
  }
  for (const [y, dir] of [[yS, -1], [yN, 1]] as [number, number][]) {
    poly(glass, [...arc.map(([x, z]) => [x, y, z] as V3)], [0, dir, 0])
    poly(brick, [[X(-xi), y, PAR], [X(xi), y, PAR], [X(xi), y, zi], [X(-xi), y, zi]], [0, dir, 0])
  }
  for (let y = yS + 8; y < yN - 1; y += 16) {
    // Ribs over the vault.
    for (let k = 0; k < n; k++) {
      const [x0, z0] = arc[k], [x1, z1] = arc[k + 1]
      const m0: V3 = [x0, y, z0], m1: V3 = [x1, y, z1]
      const nn: V3 = unit([Math.cos(((k + 0.5) / n) * Math.PI), 0, Math.sin(((k + 0.5) / n) * Math.PI)])
      const o = scl(nn, 0.18)
      poly(roof, [add(m0, o), add(m1, o), add(add(m1, o), [0, 0.5, 0]), add(add(m0, o), [0, 0.5, 0])], nn)
    }
  }
  // Front range and centre block roofs (flat), under the attic.
  poly(roof, FRONT.map(([x, y]) => [x, y, PAR] as V3), [0, 0, 1])
  poly(roof, CENTRE.map(([x, y]) => [x, y, PAR] as V3), [0, 0, 1])
}

// ---------------------------------------------------------------------------
// The portico: six giant Ionic columns, entablature, pediment, steps
// ---------------------------------------------------------------------------
{
  const yW = 50.1, yF = 55.3, xh = 10.6, zc0 = LAWN + 1.2, zc1 = LAWN + 12.3, ze = LAWN + 14.6, zp = LAWN + 18.3
  // Steps and podium.
  prism(stone, [[X(-xh - 0.6), yW], [X(xh + 0.6), yW], [X(xh + 0.6), yF + 0.6], [X(-xh - 0.6), yF + 0.6]], LAWN - 0.6, zc0)
  prism(stone, [[X(-6), yF + 0.6], [X(6), yF + 0.6], [X(6), yF + 3.4], [X(-6), yF + 3.4]], LAWN - 0.4, LAWN + 0.6)
  // Columns.
  for (const u of [-9.45, -5.67, -1.89, 1.89, 5.67, 9.45]) {
    const cx = X(u), cy = yF - 1.0
    prism(stone, [[cx - 0.85, cy - 0.85], [cx + 0.85, cy - 0.85], [cx + 0.85, cy + 0.85], [cx - 0.85, cy + 0.85]], zc0, zc0 + 0.45)
    lathe(stone, cx, cy, [[0.68, zc0 + 0.45], [0.6, zc0 + 0.8], [0.52, zc1 - 0.35]], 10)
    // Ionic capital: a slab with the volutes as a wide flattened block.
    prism(stone, [[cx - 0.95, cy - 0.6], [cx + 0.95, cy - 0.6], [cx + 0.95, cy + 0.6], [cx - 0.95, cy + 0.6]], zc1 - 0.35, zc1)
  }
  // Pilasters on the wall behind.
  for (const u of [-9.45, 9.45]) prism(stone, [[X(u) - 0.6, yW], [X(u) + 0.6, yW], [X(u) + 0.6, yW + 0.35], [X(u) - 0.6, yW + 0.35]], zc0, zc1)
  // Entablature.
  prism(stone, [[X(-xh), yW], [X(xh), yW], [X(xh), yF], [X(-xh), yF]], zc1, ze)
  prism(stone, [[X(-xh - 0.3), yW], [X(xh + 0.3), yW], [X(xh + 0.3), yF + 0.3], [X(-xh - 0.3), yF + 0.3]], ze - 0.5, ze)
  // Pediment: tympanum, raking cornices, roof slopes back to the wall.
  poly(stone, [[X(-xh), yF, ze], [X(xh), yF, ze], [X(0), yF, zp]], [0, 1, 0])
  poly(roof, [[X(-xh - 0.3), yF + 0.3, ze], [X(0), yF + 0.3, zp + 0.25], [X(0), yW - 1.5, zp + 0.25], [X(-xh - 0.3), yW - 1.5, ze]], [-0.3, 0, 1])
  poly(roof, [[X(xh + 0.3), yF + 0.3, ze], [X(xh + 0.3), yW - 1.5, ze], [X(0), yW - 1.5, zp + 0.25], [X(0), yF + 0.3, zp + 0.25]], [0.3, 0, 1])
  poly(stone, [[X(-xh - 0.3), yF + 0.3, ze - 0.01], [X(xh + 0.3), yF + 0.3, ze - 0.01], [X(0), yF + 0.3, zp + 0.24]], [0, 1, 0])
}

// ---------------------------------------------------------------------------
// The dome: square attic, drum with columns and arched windows, copper dome, lantern
// ---------------------------------------------------------------------------
{
  const cx = X(0), cy = 45.5
  const zA0 = PAR, zA1 = 23.1, zD1 = 30.6, zC = 31.5, R = 5.6
  prism(stone, [[cx - 7.0, cy - 6.2], [cx + 7.0, cy - 6.2], [cx + 7.0, cy + 6.2], [cx - 7.0, cy + 6.2]], zA0, zA1)
  prism(stone, [[cx - 7.3, cy - 6.5], [cx + 7.3, cy - 6.5], [cx + 7.3, cy + 6.5], [cx - 7.3, cy + 6.5]], zA1 - 0.6, zA1)
  // Corner urns.
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) lathe(stone, cx + sx * 6.4, cy + sy * 5.6, [[0.45, zA1], [0.6, zA1 + 0.7], [0.3, zA1 + 1.4], [0.0, zA1 + 1.6]], 8)
  // Drum (16 sides) with the arched windows recessed between pilaster pairs.
  const n = 16
  const pt = (r: number, k: number, z: number): V3 => [cx + r * Math.cos((k / n) * Math.PI * 2 + Math.PI / n), cy + r * Math.sin((k / n) * Math.PI * 2 + Math.PI / n), z]
  for (let k = 0; k < n; k++) {
    const pg: V3[] = [pt(R, k, zA1), pt(R, k + 1, zA1), pt(R, k + 1, zD1), pt(R, k, zD1)]
    const f = frameOf(pg)
    const W = Math.hypot(pg[1][0] - pg[0][0], pg[1][1] - pg[0][1])
    const holes: Hole[] = k % 2 === 0 ? [{ s0: W / 2 - 0.65, s1: W / 2 + 0.65, t0: tAtZ(f, zA1 + 1.6), t1: tAtZ(f, zD1 - 1.6), d: 0.35, back: win, side: stone }] : []
    facet(stone, pg, holes, f)
    // Arch head over the window (a semicircle in a few steps, flush, in window colour).
    if (k % 2 === 0) {
      const sc = W / 2, t1 = tAtZ(f, zD1 - 1.6)
      const pts: V3[] = []
      for (let j = 0; j <= 6; j++) {
        const a = (j / 6) * Math.PI
        pts.push(to3(f, sc + 0.65 * Math.cos(a), t1 + 0.65 * Math.sin(a), 0.02))
      }
      poly(win, pts, f.n)
    } else {
      // Paired column standing proud on the odd faces.
      const m = scl(add(pg[0], pg[1]), 0.5)
      const o = scl(f.n, 0.45)
      for (const s of [-0.55, 0.55]) {
        const c = add(add(m, o), scl(f.u, s))
        lathe(stone, c[0], c[1], [[0.34, zA1], [0.3, zD1]], 6)
      }
    }
  }
  // Drum cornice.
  lathe(stone, cx, cy, [[R, zD1], [R + 0.7, zD1 + 0.3], [R + 0.7, zC], [R - 0.1, zC]], n)
  // Copper dome (stilted, taller than a hemisphere) and oculi dormers.
  const prof: P2[] = [[5.5, zC], [5.45, 33.4], [5.1, 35.4], [4.35, 37.3], [3.15, 38.9], [1.7, 40.2], [1.1, 40.6]]
  lathe(copper, cx, cy, prof, 16)
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2 + Math.PI / 8
    const ux = Math.cos(a), uy = Math.sin(a)
    const c: V3 = [cx + ux * 5.25, cy + uy * 5.25, 33.6]
    // Stone ring and the round window, facing out.
    const fr: V3[] = [], wn: V3[] = []
    for (let j = 0; j < 8; j++) {
      const t = (j / 8) * Math.PI * 2
      const off = (r: number): V3 => [c[0] - uy * r * Math.cos(t), c[1] + ux * r * Math.cos(t), c[2] + r * Math.sin(t)]
      fr.push(add(off(0.95), [ux * 0.35, uy * 0.35, 0]))
      wn.push(add(off(0.55), [ux * 0.4, uy * 0.4, 0]))
    }
    poly(stone, fr, [ux, uy, 0])
    poly(win, wn, [ux, uy, 0])
    for (let j = 0; j < 8; j++) {
      const j2 = (j + 1) % 8
      poly(stone, [fr[j], fr[j2], add(fr[j2], [-ux * 0.6, -uy * 0.6, 0]), add(fr[j], [-ux * 0.6, -uy * 0.6, 0])], subv(scl(add(fr[j], fr[j2]), 0.5), c))
    }
  }
  // Lantern: copper columns drum, cap, finial.
  lathe(copper, cx, cy, [[1.25, 40.5], [1.2, 42.4], [1.55, 42.6], [1.4, 42.9], [0.9, 43.6], [0.25, 44.1], [0.12, 44.7], [0, 44.8]], 10)
}

// ---------------------------------------------------------------------------
// Rear extensions: plain
// ---------------------------------------------------------------------------
{
  const A: P2[] = [[13.7, -59.2], [26.7, -59.2], [26.7, -49.3], [13.7, -49.3]]
  for (let i = 0; i < 4; i++) wall(A[i], A[(i + 1) % 4], 19.7, 0)
  poly(roof, A.map(([x, y]) => [x, y, 19.7] as V3), [0, 0, 1])
  const B: P2[] = [[5.0, -51.7], [13.7, -51.7], [13.7, -49.3], [5.0, -49.3]]
  for (let i = 0; i < 4; i++) wall(B[i], B[(i + 1) % 4], 12.5, 0)
  poly(roof, B.map(([x, y]) => [x, y, 12.5] as V3), [0, 0, 1])
}

// ---------------------------------------------------------------------------
// The two 15-inch naval guns in front, pointing north to Lambeth Road
// ---------------------------------------------------------------------------
{
  const gy = 70.0, el = (8 * Math.PI) / 180, L = 17.0
  // Concrete cradle under the breeches.
  prism(roof, [[X(-4.4), gy - 2.0], [X(4.0), gy - 2.0], [X(4.0), gy + 6.5], [X(-4.4), gy + 6.5]], LAWN - 0.3, LAWN + 2.0)
  prism(roof, [[X(-3.9), gy - 1.4], [X(3.5), gy - 1.4], [X(3.5), gy + 5.9], [X(-3.9), gy + 5.9]], LAWN + 2.0, LAWN + 2.6)
  for (const [u, dz] of [[-2.0, 0.25], [1.6, 0]]) {
    const a: V3 = [X(u), gy, LAWN + 3.6 + dz]
    const dir: V3 = [0, Math.cos(el), Math.sin(el)]
    const at = (t: number): V3 => add(a, scl(dir, t))
    tube(roof, at(-1.8), at(0), 0.9, 1.15, 12) // breech ring
    tube(roof, at(0), at(5.5), 1.15, 1.05, 12, false, false) // jacket
    tube(roof, at(5.5), at(L - 1.3), 0.9, 0.62, 12, true, false) // chase
    tube(roof, at(L - 1.3), at(L), 0.76, 0.76, 12, true, true) // muzzle swell
  }
}

const parts = [
  { part: brick, material: M.brick },
  { part: stone, material: M.stone },
  { part: copper, material: M.copper },
  { part: win, material: M.window },
  { part: roof, material: M.roof },
  { part: glass, material: M.glass },
]
if (import.meta.main) {
  const tris = parts.reduce((s, { part }) => s + part.triangles, 0)
  const glb = writeGlb('Imperial War Museum', parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor' })
  writeFileSync(new URL(`../models/${ID}.glb`, import.meta.url), glb)
  console.log(`models/${ID}.glb: ${tris} triangles, ${glb.length} bytes`)
}
