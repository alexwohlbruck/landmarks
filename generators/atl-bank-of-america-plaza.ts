/**
 * Bank of America Plaza (1992, Kevin Roche John Dinkeloo and Associates),
 * Atlanta — original procedural geometry, CC0-1.0.
 * bun generators/atl-bank-of-america-plaza.ts
 *
 * Map frame turned to the building: +x and +y are face normals, z up, metres.
 * BEARING 46.15 (the faces run 46° off the compass; the tower is turned 45°
 * to Peachtree Street's grid). Origin = centroid of OSM way/39449840, which
 * is also the centre of the square plan. y = 0 is the lowest ground under the
 * footprint, at the frame's (-x, +y) corner (compass north).
 *
 * What makes it recognisable, each drawn as plain geometry:
 * - a square shaft whose corners step back in tiers (outer corner blocks to
 *   173 m, the next blocks to 217 m, an inner corner tower to 235 m, the face
 *   slabs to 240 m), split down every corner by a deep re-entrant slot of dark
 *   glass running the full shaft height between two granite piers;
 * - brown-rose granite, bronze-tinted glass in tall window bays on the faces
 *   (four grouped bays each side of a broad stone pier down each face
 *   centre), a dark glass reveal where each face meets its corner blocks,
 *   punched windows on the corner blocks, flared pylon caps at the street;
 * - the crown: a stepped pyramid of dark bronze open lattice with bright
 *   gold-leaf bands at its ledges, carrying a pale obelisk spire. It is lit
 *   gold at night, so the pyramid materials are `neon-*`; the spire is
 *   floodlit white.
 *
 * Evidence
 * - OSM way/39449840 (building=office, 55 levels, height 311.8, roof:height
 *   27, pyramidal, wikidata Q499486): a 49.6 m square whose corners step in
 *   at ~12 m and ~18 m from the axes. Lidar shows this is the plan of the top
 *   of the shaft. No building:part is mapped.
 * - USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 0.5 m and 1 m grids
 *   read in the building frame with tools/lidar_frame.py and folded into one
 *   octant of the plan. Heights above the lowest ground under the footprint
 *   (lidar ground_min + 3.6 m, the north corner):
 *   - every roof between the podium (~26 m) and the face tops is at 173.4,
 *     (a few cells) 189.4, 217.1, 235.0 or 240.4 m: there is no lower outer
 *     setback;
 *   - along each face (lateral distance from the axis): the 240.4 m face slab
 *     to ~12 m, a 235 m sliver, the 217.1 m blocks to ~16 m, the 173.4 m
 *     blocks to ~20.8 m, then the corner notch open to the ground;
 *   - behind the blocks an inner corner tower ~19.5 m from the axes to 235 m;
 *   - empty cells reaching down to the podium run diagonally into each
 *     corner from the notch to ~14-15 m: the dark glass slot;
 *   - pyramid ledges at ~247 and ~259 m, platform ~290 m, spire tip 312.8 m
 *     (published 311.8 m, Wikipedia / CTBUH);
 *   - the lidar square is ~51 m across and sits ~1 m east and north of OSM;
 *     the model uses a 50 m square (H = 25), between the two.
 * - Setback heights against the DXR north photo (cmp-n-overlay.png in the
 *   scratch folder): with the render scaled so the 173.4 m and 240.4 m steps
 *   on the near corner (photo rows 1630 and 835, original pixels) line up,
 *   the shaft's silhouette width matches the photo too, and the ground falls
 *   at row ~3690, ~550 px below the photo's frame (3137; trees and the frame
 *   hide the base). Measured from the frame bottom, the far corners' steps
 *   (rows ~1750 and ~1240) sit at ~59% and ~82% of the shaft and the near
 *   corner's at 65% and 89%; measured from the ground they are at 67-72% and
 *   86-91%, the far corners lower because they stand ~35 m farther from the
 *   camera. That agrees with lidar (72% and 90%), which shows no lower outer
 *   setback, so the lidar heights are kept.
 * - Published: 312 m (1,023 ft), 55 floors, completed 1992, KRJDA; gold-leaf
 *   open steel pyramid with a spire (Wikipedia "Bank of America Plaza
 *   (Atlanta)").
 * - Photos (Wikimedia Commons, all daylight unless noted):
 *   "Bank of America Plaza, Atlanta, North view 20160717 1.jpg" (DXR, CC BY-SA
 *   4.0; the north corner, the slot and steps, the pyramid's tiers, the
 *   spire); "Bank of America Plaza (Atlanta) Oct 2021.jpg" (Thomson200, CC0;
 *   a corner head-on: the dark slot between granite piers, narrow below 173 m
 *   and wide above); "View of Atlanta's Bank of America Plaza from the
 *   Atlanta Botanical Garden's Skyline Garden.jpg" (Marc Merlin, CC BY-SA 4.0;
 *   distant, from the north-east); "Bank of America Plaza (Atlanta) viewed
 *   from the northeast corner of Ponce and Piedmont.jpg" (Marc Merlin, CC BY-SA
 *   4.0; granite colour); "2013.01.26.112606 Bank of America Plaza Atlanta
 *   Georgia.jpg" (Hermann Luyken, CC0; the crown from Centennial Olympic
 *   Park: dark lattice, gold bands, ledge heights); "Bank of America Plaza
 *   Atlanta GA.jpg" (JJonahJackalope, CC BY-SA 4.0; a face from the street:
 *   the centre pier, the reveals, the flared corner pylons at the base);
 *   "Bank of America Plaza at night, Dec 2016.jpg" (Thomson200, CC0; night:
 *   the whole pyramid glows gold, the spire white).
 * - Mapterhorn terrain: ground under the footprint falls ~5 m to the north
 *   corner; the model stands on that corner and sinks into the rest.
 *
 * Estimated: the slot's width (drawn 3.6 m below 173 m and ~5 m above, where
 * it opens between the 217 m blocks; the real lower slot is ~1-2 m, widened
 * so it reads at 200 px) and its inner end (14.5 m from the axes); the
 * pyramid's ledge heights 248/260/278 m from the DXR and Luyken photos (lidar
 * confirms 247 and 259), its plan shrinking linearly to a 4 m half-width
 * platform; the spire's section (a 4 m square base to 295 m, a collar to
 * 299 m, a 2.1 m shaft to 310.3 m and a gilded point; from the DXR crown
 * against the lidar tip); the reveal width (1.6 m); the pylon caps (flare
 * 20-23.5 m, 1 m out, top at 26 m, from the JJonahJackalope photo). The
 * 189 m and 235 m slivers are folded into the neighbouring tiers; the 235-
 * 240 m band round the inner tower's corners is drawn as lattice (the open
 * steel under the pyramid's corners in the DXR crown photo). Windows are
 * three floors a panel and four bays per half face; the real faces carry
 * about eight narrow continuous strips per half face.
 * Colours (from the daylight photos, pulled to the palette's lightness): the
 * granite reads brown-rose (#b38f80); the lattice reads dark bronze (#936a32,
 * kept warm so its neon glow reads gold at night); the gold-leaf ledge bands
 * are bright gold (#f2c94c, 2.4 m, about twice real so they carry at phone
 * size); the slot's glass a darker slate (window-2, #4e6273).
 * Replaces: way/39449840 only. osm.py buildings shows no building:part in the
 * outline; the 3-level podium way/886044291 abuts the south-west face along
 * a shared edge and is a separate building, left to the map.
 * Photo comparisons (cmp-n, cmp-n-overlay, cmp-ne, cmp-sw, cmp-corner,
 * cmp-face, cmp-night) are in the scratch work folder.
 * Look-only references: none.
 *
 * Doubts: the open lattice is drawn as a solid stepped pyramid, and its gold
 * leaf as full rings where photos show it brightest on the face centres; the
 * slot is drawn wider than real; the corners' smaller jogs (the 189 m and
 * 235 m slivers) are folded away; the slot walls meet the inner tower in
 * 45-degree wedges, blunted; the podium (way/886044291, not replaced) is
 * left to the map; at night the map's window glow on the shaft is about as
 * bright as the crown, where in photos the crown is clearly the brightest.
 *
 * Photo URLs: https://commons.wikimedia.org/wiki/File: + the file names above
 * (spaces as underscores).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 46.15
const ANCHOR = { lng: -84.3861396, lat: 33.7708628 }

type XY = [number, number]

const granite = new Part(), glass = new Part(), slotGlass = new Part()
const pyramid = new Part(), gold = new Part(), spire = new Part()

// ---------- dimensions (lidar, folded into one octant of the plan) ----------
const H = 25.0 // face half-width (OSM 24.8, lidar ~25.5)
const F = 12.0 // the face slab's half-width: the 240 m faces
const RB = 16.0 // outer edge of the 217 m blocks
const RC = 20.8 // outer edge of the 173 m blocks; beyond it the corner notch
const D = 19.5 // the inner corner tower (to 235 m)
const JS = 14.5 // the diagonal slot runs in to (JS, JS)
const W = 1.8 // the slot's half-width below 173 m (real ~1-1.2 m, widened to read at phone size)
const T1 = 173.4, T2 = 217.1, T3 = 235.0, TOP = 240.4 // tier tops (lidar)
const PYR_TOP = 290, TIP = 312.8
const FLOOR = 4.3, G0 = 12.6, GROUP = 3 * FLOOR
const CH = 0.5 // chamfer on convex vertical edges
const BEV = 0.45 // bevel at each tier's top edge
const R2 = Math.SQRT2

// ---------- plan helpers ----------
/** One quadrant (x, y >= 0) of a plan, from the +x axis round to the +y axis; mirrored to a full CCW ring. */
function fullRing(q: XY[]): XY[] {
  const out: XY[] = []
  for (let k = 0; k < 4; k++) for (const [x, y] of q) {
    const p: XY = k === 0 ? [x, y] : k === 1 ? [-y, x] : k === 2 ? [-x, -y] : [y, -x]
    out.push(p)
  }
  // drop exact duplicates where quadrants meet
  return out.filter((p, i) => {
    const n = out[(i + 1) % out.length]
    return Math.hypot(p[0] - n[0], p[1] - n[1]) > 1e-6
  })
}
const cross2 = (a: XY, b: XY) => a[0] * b[1] - a[1] * b[0]
const unit2 = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
/** Cut each convex corner of a CCW ring by `c`. */
function chamfer(r: XY[], c: number): XY[] {
  const out: XY[] = []
  r.forEach((p, i) => {
    const a = r[(i + r.length - 1) % r.length], b = r[(i + 1) % r.length]
    const t0 = unit2([p[0] - a[0], p[1] - a[1]]), t1 = unit2([b[0] - p[0], b[1] - p[1]])
    if (cross2(t0, t1) > 1e-6) {
      // the 45-degree wedges at the slot's mouth get a broader cut
      const cc = t0[0] * t1[0] + t0[1] * t1[1] < -0.5 ? Math.max(c, 1.1) : c
      out.push([p[0] - t0[0] * cc, p[1] - t0[1] * cc], [p[0] + t1[0] * cc, p[1] + t1[1] * cc])
    } else out.push(p)
  })
  return out
}
/** Move a CCW ring inward by d (mitred; negative d moves it out). */
function inset(r: XY[], d: number): XY[] {
  return r.map((p, i) => {
    const a = r[(i + r.length - 1) % r.length], b = r[(i + 1) % r.length]
    const t0 = unit2([p[0] - a[0], p[1] - a[1]]), t1 = unit2([b[0] - p[0], b[1] - p[1]])
    const n0: XY = [-t0[1], t0[0]], n1: XY = [-t1[1], t1[0]]
    const k = d / (1 + n0[0] * n1[0] + n0[1] * n1[1])
    return [p[0] + (n0[0] + n1[0]) * k, p[1] + (n0[1] + n1[1]) * k]
  })
}
const at = (p: XY, z: number): V3 => [p[0], p[1], z]
/** Planar polygon wound to face `hint`. */
function poly(part: Part, pts: V3[], hint: V3) {
  const [a, b, c] = pts
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  const p = n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < p.length - 1; i++) part.tri(p[0], p[i], p[i + 1])
}
/** Star-shaped (from the origin) cap. */
function fan(part: Part, r: XY[], z: number, up = true) {
  r.forEach((p, i) => {
    const q = r[(i + 1) % r.length]
    poly(part, [[0, 0, z], at(p, z), at(q, z)], [0, 0, up ? 1 : -1])
  })
}
/** Flat cap over any simple CCW ring (ear clipping). */
function cap(part: Part, r: XY[], z: number) {
  const idx = r.map((_, i) => i)
  const inTri = (p: XY, a: XY, b: XY, c: XY) =>
    cross2([b[0] - a[0], b[1] - a[1]], [p[0] - a[0], p[1] - a[1]]) > 1e-9 &&
    cross2([c[0] - b[0], c[1] - b[1]], [p[0] - b[0], p[1] - b[1]]) > 1e-9 &&
    cross2([a[0] - c[0], a[1] - c[1]], [p[0] - c[0], p[1] - c[1]]) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const a = r[idx[(k + idx.length - 1) % idx.length]], b = r[idx[k]], c = r[idx[(k + 1) % idx.length]]
      const turn = cross2([b[0] - a[0], b[1] - a[1]], [c[0] - b[0], c[1] - b[1]])
      if (Math.abs(turn) <= 1e-9) { idx.splice(k, 1); cut = true; break } // collinear: drop
      if (turn < 0) continue
      if (idx.some((j) => { const p = r[j]; return p !== a && p !== b && p !== c && inTri(p, a, b, c) })) continue
      poly(part, [at(a, z), at(b, z), at(c, z)], [0, 0, 1])
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) throw new Error('cap: no ear')
  }
  poly(part, idx.map((i) => at(r[i], z)), [0, 0, 1])
}

// ---------- shaft ----------
// Lidar (GA 2018, folded into one octant, heights above the north corner):
// along each face the 240 m face slab runs out to ~12 m from the axis, the
// 217 m blocks to ~16 m, the 173 m blocks to ~21 m; past that the corner is
// open to the ground. Behind the blocks an inner corner tower, ~19.5 m from
// the axes, rises to 235 m. A narrow slot down the diagonal (the lidar sees
// through it to the podium) splits each corner from the notch in to ~15.5 m:
// the dark glass slot of the photos, running the full shaft height.
/** The diagonal slot, entered from a wall arriving along y = k (moving -x) or x = k (moving +y). */
function slot(k: number, alongY: boolean, w = W): XY[] {
  const m = w * R2, e = w / R2
  return [alongY ? [k + m, k] : [k, k - m], [JS + e, JS - e], [JS - e, JS + e], alongY ? [k, k + m] : [k - m, k]]
}
const qC: XY[] = [[H, 0], [H, RC], ...slot(RC, true), [RC, H], [0, H]]
// Above 173 m the slot opens out to the inner tower's whole corner, between
// the 217 m blocks (the wide dark glass of the upper corners in the photos).
const WU = (D - RB) / R2
const qB: XY[] = [[H, 0], [H, RB], ...slot(D, false, WU), [RB, H], [0, H]]
const qI: XY[] = [[H, 0], [H, F], [D, F], ...slot(D, false, WU), [F, D], [F, H], [0, H]]
const planC = chamfer(fullRing(qC), CH)
const planB = chamfer(fullRing(qB), CH)
const planI = chamfer(fullRing(qI), CH)

type Wall = { a: XY; b: XY; z0: number; z1: number }
const walls: Wall[] = []

/** A tier: walls (granite, or `latticeAt` walls in the crown's lattice), a bevelled top edge and a cap. */
function tier(r: XY[], z0: number, z1: number, latticeAt?: (m: XY) => boolean) {
  const ri = inset(r, BEV)
  r.forEach((p, i) => {
    const q = r[(i + 1) % r.length], pi = ri[i], qi = ri[(i + 1) % r.length]
    const t = unit2([q[0] - p[0], q[1] - p[1]])
    const n: V3 = [t[1], -t[0], 0]
    const lat = latticeAt?.([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2])
    if (lat) {
      poly(pyramid, [at(p, z0), at(q, z0), at(q, z1), at(p, z1)], n)
      return
    }
    poly(granite, [at(p, z0), at(q, z0), at(q, z1 - BEV), at(p, z1 - BEV)], n)
    poly(granite, [at(p, z1 - BEV), at(q, z1 - BEV), at(qi, z1), at(pi, z1)], [n[0], n[1], 1])
    walls.push({ a: p, b: q, z0, z1 })
  })
  cap(granite, latticeAt ? r : ri, z1)
}
tier(planC, 0, T1)
tier(planB, T1, T2)
tier(planI, T2, T3)
// 235-240 m: the face slabs carry on to the crown; round the inner tower's
// corner the crown's open steel shows (a lattice band under the pyramid).
tier(planI, T3, TOP, ([x, y]) => {
  const a = Math.abs(x), b = Math.abs(y)
  return !(Math.abs(Math.max(a, b) - H) < 0.6 || (Math.min(a, b) > F - 0.6 && Math.min(a, b) < F + 0.6 && Math.max(a, b) > D + 0.3))
})

// ---------- the entrance pylons ----------
// The 173 m blocks stand on the street as plain granite pylons with a flared
// cap about 20-24 m up (JJonahJackalope photo); drawn as a flared band round
// each block's outside faces.
{
  const z0 = 20.0, z1 = 23.5, z2 = 26.0, out = 1.0
  const paths: XY[][] = []
  for (const k of [0, 1, 2, 3]) {
    const rot = (p: XY): XY => k === 0 ? p : k === 1 ? [-p[1], p[0]] : k === 2 ? [-p[0], -p[1]] : [p[1], -p[0]]
    paths.push(([[H, RB], [H, RC], [RC + W * R2, RC]] as XY[]).map(rot))
    paths.push(([[RC, RC + W * R2], [RC, H], [RB, H]] as XY[]).map(rot))
  }
  for (const path of paths) {
    // outward normals per segment (the path runs CCW round the building: outside is on the right)
    const segN = path.slice(0, -1).map((p, i) => { const t = unit2([path[i + 1][0] - p[0], path[i + 1][1] - p[1]]); return [t[1], -t[0]] as XY })
    const off = path.map((p, i) => {
      const n0 = segN[Math.max(0, i - 1)], n1 = segN[Math.min(segN.length - 1, i)]
      const k = out / (1 + n0[0] * n1[0] + n0[1] * n1[1]) * (i === 0 || i === path.length - 1 ? 2 : 1)
      const s: XY = i === 0 || i === path.length - 1 ? (i === 0 ? n1 : n0) : [n0[0] + n1[0], n0[1] + n1[1]]
      return [p[0] + s[0] * (i === 0 || i === path.length - 1 ? out : k), p[1] + s[1] * (i === 0 || i === path.length - 1 ? out : k)] as XY
    })
    for (let i = 0; i < path.length - 1; i++) {
      const n = segN[i]
      poly(granite, [at(path[i], z0), at(path[i + 1], z0), at(off[i + 1], z1), at(off[i], z1)], [n[0], n[1], 0.6])
      poly(granite, [at(off[i], z1), at(off[i + 1], z1), at(off[i + 1], z2), at(off[i], z2)], [n[0], n[1], 0])
      poly(granite, [at(off[i], z2), at(off[i + 1], z2), at(path[i + 1], z2), at(path[i], z2)], [0, 0, 1])
    }
    // end caps
    for (const [i, s] of [[0, -1], [path.length - 1, 1]] as [number, number][]) {
      const seg = i === 0 ? 0 : segN.length - 1
      const t = unit2([path[seg + 1][0] - path[seg][0], path[seg + 1][1] - path[seg][1]])
      const h: V3 = [t[0] * s, t[1] * s, 0]
      poly(granite, [at(path[i], z0), at(off[i], z1), at(path[i], z1)], h)
      poly(granite, [at(path[i], z1), at(off[i], z1), at(off[i], z2), at(path[i], z2)], h)
    }
  }
}

// ---------- windows ----------
// Every wall gets bays of panels three floors tall, set 0.05 m proud:
// - main face (|along| < F on the outer face plane): four grouped bays each
//   side of a broad centre pier, for the real narrow vertical strips;
// - the reveal (F to F + 1.6 m on the faces of the 173 and 217 m tiers);
// - the corner slot: its walls, the 173 m blocks' ends at the notch, and the
//   inner tower's walls next to it above 173 m are dark glass, nearly wall to
//   wall, so the corner reads as a dark re-entrant slot;
// - everything else (corner blocks): punched windows, more stone showing.
const OUT = 0.05
const REVEAL = 1.6
function panel(part: Part, a: XY, b: XY, n: XY, s0: number, s1: number, z0: number, z1: number) {
  const t = unit2([b[0] - a[0], b[1] - a[1]])
  const p = (s: number): XY => [a[0] + t[0] * s + n[0] * OUT, a[1] + t[1] * s + n[1] * OUT]
  poly(part, [at(p(s0), z0), at(p(s1), z0), at(p(s1), z1), at(p(s0), z1)], [n[0], n[1], 0])
}
for (const w of walls) {
  const L = Math.hypot(w.b[0] - w.a[0], w.b[1] - w.a[1])
  if (L < 1.2) continue // chamfers
  const t = unit2([w.b[0] - w.a[0], w.b[1] - w.a[1]])
  const n: XY = [t[1], -t[0]]
  const m: XY = [(w.a[0] + w.b[0]) / 2, (w.a[1] + w.b[1]) / 2]
  const diagonal = Math.abs(Math.abs(t[0]) - Math.abs(t[1])) < 0.1
  const onFace = Math.abs(Math.abs(m[0]) - H) < 0.01 || Math.abs(Math.abs(m[1]) - H) < 0.01
  const along = (s: number): XY => [w.a[0] + t[0] * s, w.a[1] + t[1] * s]
  const lateralOf = (p: XY) => Math.abs(t[0]) > 0.5 ? Math.abs(p[0]) : Math.abs(p[1])
  const depth = Math.abs(t[0]) > 0.5 ? Math.abs(m[1]) : Math.abs(m[0])
  const styleAt = (s: number) => {
    const p = along(s), lat = lateralOf(p)
    if (diagonal) return 'slot'
    if (onFace) return lat < F - 0.1 ? 'face' : lat < F + REVEAL && w.z1 <= T2 ? 'reveal' : 'block'
    // the inner tower beside the slot (the 173 m blocks' ends at the notch
    // stay granite: the piers flanking the slot)
    if (Math.abs(depth - D) < 0.01 && lat > RB - 0.1) return 'slot'
    return 'block'
  }
  const runs: { s0: number; s1: number; style: string }[] = []
  for (let s = 0; s < L - 1e-6; s += 0.1) {
    const st = styleAt(Math.min(L, s + 0.05))
    const last = runs[runs.length - 1]
    if (last && last.style === st) last.s1 = Math.min(L, s + 0.1)
    else runs.push({ s0: s, s1: Math.min(L, s + 0.1), style: st })
  }
  for (const run of runs) {
    const len = run.s1 - run.s0
    if (len < 1.0) continue
    let bays: [number, number][] = []
    if (run.style === 'face') {
      // Each wall here is half a face (the ring splits faces at the axis).
      const fromCentre = lateralOf(along(run.s0)) < lateralOf(along(run.s1))
      const c0 = fromCentre ? run.s0 + 0.9 : run.s0 + 0.2, c1 = fromCentre ? run.s1 - 0.2 : run.s1 - 0.9
      const k = 4, w0 = (c1 - c0) / k
      for (let i = 0; i < k; i++) bays.push([c0 + i * w0 + 0.55, c0 + (i + 1) * w0 - 0.55])
    } else if (run.style === 'slot' || run.style === 'reveal') {
      bays.push([run.s0 + 0.12, run.s1 - 0.12])
    } else {
      const k = Math.max(1, Math.round(len / 3.2)), w0 = len / k
      for (let i = 0; i < k; i++) bays.push([run.s0 + i * w0 + 0.75, run.s0 + (i + 1) * w0 - 0.75])
      bays = bays.filter(([a, b]) => b - a > 0.8)
    }
    const dark = run.style === 'slot' || run.style === 'reveal'
    const part = dark ? slotGlass : glass
    const start = run.style === 'face' ? G0 : dark ? 6 : Math.max(G0 + GROUP, w.z0 + 1.2)
    const gap = run.style === 'block' ? 2.6 : dark ? 0.5 : 0.9
    for (let z = Math.max(start, w.z0 + (dark ? 0.4 : 1.0)); z + GROUP <= w.z1 - 1.0 + 1e-6; z += GROUP) {
      for (const [b0, b1] of bays) panel(part, w.a, w.b, n, b0, b1, z + gap / 2, z + GROUP - gap / 2)
    }
    // the lobby: tall glazing on the main faces below the first group
    if (run.style === 'face' && w.z0 === 0) {
      for (const [b0, b1] of bays) panel(glass, w.a, w.b, n, b0, b1, 4.5, G0 - 0.8)
    }
  }
}

// ---------- crown: the stepped gold pyramid ----------
// Plan: OSM's stepped square (no slot), scaled down linearly from the shaft
// face (24.8 m) to a 4 m half-width platform. Four tiers, each set 0.8 m in
// at its ledge, with a gold band round each ledge.
const pyrPlan: XY[] = fullRing([[H, 0], [H, F], [D, F], [D, D], [F, D], [F, H], [0, H]])
const scaled = (s: number) => pyrPlan.map(([x, y]) => [x * s, y * s] as XY)
const hwAt = (z: number) => {
  // a slight kick: the first tier is shallower, then a straight run to the platform
  if (z <= 248) return H - (z - TOP) * (3.0 / (248 - TOP))
  return 21.8 - (z - 248) * ((21.8 - 4) / (PYR_TOP - 248))
}
const LEDGES = [TOP, 248, 260, 278, PYR_TOP]
const band = 2.4 // gold-leaf bands, about twice real so they carry at phone size
function loftRings(part: Part, r0: XY[], z0: number, r1: XY[], z1: number) {
  for (let i = 0; i < r0.length; i++) {
    const j = (i + 1) % r0.length
    const t = unit2([r0[j][0] - r0[i][0], r0[j][1] - r0[i][1]])
    poly(part, [at(r0[i], z0), at(r0[j], z0), at(r1[j], z1), at(r1[i], z1)], [t[1], -t[0], 0.3])
  }
}
function annulus(part: Part, outer: XY[], inner: XY[], z: number) {
  for (let i = 0; i < outer.length; i++) {
    const j = (i + 1) % outer.length
    poly(part, [at(outer[i], z), at(outer[j], z), at(inner[j], z), at(inner[i], z)], [0, 0, 1])
  }
}
// The shaft's cornice: a gold band set just inside the top of the faces.
{
  const r = scaled((H - 0.6) / H)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    const t = unit2([r[j][0] - r[i][0], r[j][1] - r[i][1]])
    poly(gold, [at(r[i], TOP), at(r[j], TOP), at(r[j], TOP + band), at(r[i], TOP + band)], [t[1], -t[0], 0])
  }
}
for (let k = 0; k < LEDGES.length - 1; k++) {
  const z0 = LEDGES[k] + (k === 0 ? band : 0), z1 = LEDGES[k + 1]
  const s0 = (hwAt(LEDGES[k]) - (k === 0 ? 0.6 : 0.8)) / H
  const s1 = hwAt(z1) / H
  // gold band: vertical lip at the base of this tier (k > 0); tier 0 sits on the cornice band
  let base = scaled(s0)
  if (k > 0) {
    const lipTop = LEDGES[k] + band
    loftRings(gold, base, LEDGES[k], base, lipTop)
    const s0b = s0 - (band / (z1 - LEDGES[k])) * (s0 - s1)
    const b2 = scaled(s0b)
    annulus(gold, base, b2, lipTop)
    base = b2
    loftRings(pyramid, base, lipTop, scaled(s1), z1)
  } else loftRings(pyramid, base, z0, scaled(s1), z1)
  // ledge: from this tier's top out to the next tier's inset base
  if (k < LEDGES.length - 2) {
    const next = scaled((hwAt(z1) - 0.8) / H)
    annulus(gold, scaled(s1), next, z1)
  } else {
    fan(gold, scaled(s1), z1)
  }
}

// ---------- spire: a pale obelisk with a gold point ----------
{
  const sq = (h: number): XY[] => chamfer([[h, -h], [h, h], [-h, h], [-h, -h]].map(([x, y]) => [x, y] as XY).reverse().reverse(), Math.min(0.25, h * 0.2))
  // ensure CCW: (h,-h) → (h,h) → (-h,h) → (-h,-h) is CCW
  // DXR crown photo: a stout square base (~5 m), a tapered collar (~4 m),
  // a slender shaft about half as wide (~11 m) and a short gilded point.
  const z0 = PYR_TOP, z1 = 295, z2 = 299, z3 = 310.3
  const r0 = sq(2.0), r1 = sq(1.05)
  loftRings(spire, r0, z0, r0, z1)
  loftRings(spire, r0, z1, r1, z2)
  loftRings(spire, r1, z2, r1, z3)
  // pyramidion
  r1.forEach((p, i) => {
    const q = r1[(i + 1) % r1.length]
    const t = unit2([q[0] - p[0], q[1] - p[1]])
    poly(gold, [at(p, z3), at(q, z3), [0, 0, TIP]], [t[1], -t[0], 0.5])
  })
}

// ---------- write ----------
const parts = [
  { part: granite, material: finish('boa-atl-granite', 0xb38f80) },
  { part: glass, material: PALETTE.window },
  { part: slotGlass, material: windowVariant(2, 0x4e6273) },
  { part: pyramid, material: finish('neon-boa-gold-lattice', 0x936a32) },
  { part: gold, material: finish('neon-boa-gold-leaf', 0xf2c94c, 0.5) },
  { part: spire, material: { ...finish('boa-atl-spire', 0xeee3cf), floodlight: () => 0.9 } },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Bank of America Plaza', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TIP,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/39449840'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/atl-bank-of-america-plaza.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
