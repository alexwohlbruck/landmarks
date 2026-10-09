/**
 * One Wells Fargo Center ("the jukebox"; 1988, formerly First Union Center,
 * Thompson, Ventulett, Stainback & Associates), Charlotte — original
 * procedural geometry, CC0-1.0.
 * bun generators/one-wells-fargo-center.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the catalog anchor on the
 * ground. Placed at bearing 5°, so +x runs along the crown's barrel vault
 * (true bearing 95°) and Uptown's street grid lies on the diagonals.
 *
 * Plan (lidar, Mecklenburg 2016, USGS 3DEP NC Phase 4, 1 m; matches the OSM
 * outline way/380092606 to a metre on every side it records). A square on
 * the street grid, |x − 7.5| + |y| ≤ 37.5, cut by two end walls square to the
 * vault: the west one at x = −20 is only as wide as the vault's glass bay
 * (|y| ≤ 10), the east one at x = 20.5 runs 50 m (|y| ≤ 25). OSM's west tip
 * (to x = −33) is a low stepped lobby block, 20-30 m.
 *
 * Heights above the street (lidar; ground within a metre of the lowest
 * return): the north and south tips stop at 81 / 85 / 89 m in three steps;
 * the shaft (|y| ≤ 25.5) rises to 155 m, then steps in 4-5 m at a time to
 * 159, 164 and 170 m, each step a planted terrace (photos); the barrel vault,
 * radius 9.5 m, rises to 180 m. Published: 588 ft (179 m), 42 floors.
 * OSM's height=192 is too high.
 *
 * What makes it recognisable, each drawn as plain geometry:
 * - the barrel vault of pale glass, its ends filled by the "jukebox": a
 *   full-height glass bay on each end wall under a semicircular arch, with
 *   an outer and an inner pale ring and a dark slot rising into the inner
 *   arch (photos from the east and west);
 * - the stepped terraces either side of the vault;
 * - the sawtooth: every wall that runs square to the vault rather than on the
 *   street grid is notched into grid-aligned teeth, so the shaft's north and
 *   south faces and the east wall's flanks read as stepped corners (photo
 *   from S College St);
 * - rose granite with large square windows. Drawn per STYLE.md as one panel
 *   per bay and three floors, granite piers and spandrels between.
 *
 * Colours: the granite is reddish brown in photos; pulled to the palette's
 * lightness as a rose finish. Windows and the bay are reflective glass that
 * reads light blue in daylight, so a light window colour, not slate. The slot
 * is the one dark line; it is a defining feature and stays mid slate.
 *
 * Estimated: tooth size (2.2 m deep, from photos), the ring radii and slot
 * width (photos), the lobby block's steps (lidar, coarse), floor height 3.9 m.
 *
 * Photos: One_Wells_Fargo_Center_S_College.jpg and One_Wells_Fargo_Center_
 * November_2023.jpg (City Dweller 2, CC BY-SA 4.0, Commons); Wachoviahq.jpg
 * (CC BY-SA 3.0, Commons); One_Wells_Fargo_Center,_Three_Wells_Fargo_Center
 * .jpg (Kiran891, CC BY-SA 4.0, Commons); Flickr 2675013257 (James Willamor,
 * CC BY-SA 2.0; the crown). No commercial imagery or 3D tiles were used.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]
const granite = new Part(), windows = new Part(), slot = new Part(), glass = new Part()
const trim = new Part(), roof = new Part()

const CXD = 7.5, RD = 37.5          // the street-grid square
const XW = -20, XE = 20.5           // end walls
const RV = 9.5, SPRING = 170.5, TOP = SPRING + RV
const BAY = RV                      // the jukebox bay's half-width
const TOOTH = 2.2                   // sawtooth depth (45° faces 3.1 m wide)
const FLOOR = 3.9, GROUP = 2 * FLOOR
const LIFT = .04
const ARC = 12

const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return v.map(n => n / l) as V3 }

/** Clip a CCW convex ring by the half-plane f(p) ≥ 0. */
function clip(ring: XY[], f: (p: XY) => number): XY[] {
  const out: XY[] = []
  ring.forEach((a, i) => {
    const b = ring[(i + 1) % ring.length], fa = f(a), fb = f(b)
    if (fa >= 0) out.push(a)
    if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]) }
  })
  return out
}
const diamond: XY[] = [[CXD + RD, 0], [CXD, RD], [CXD - RD, 0], [CXD, -RD]]
/** The plan of a stage: the grid square, the end walls and |y| ≤ c. */
function basePlan(c: number): XY[] {
  let r = clip(diamond, p => p[0] - XW)
  r = clip(r, p => XE - p[0])
  r = clip(r, p => c - p[1])
  r = clip(r, p => p[1] + c)
  // drop near-duplicate points
  return r.filter((p, i) => { const q = r[(i + 1) % r.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > .05 })
}

/**
 * Notch the straight stretch s0..s1 of edge a→b into grid-aligned teeth: each
 * tooth is two 45° faces meeting TOOTH inside the line.
 */
function teeth(a: XY, b: XY, s0: number, s1: number): XY[] {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), d: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [-d[1], d[0]]
  const m = Math.max(1, Math.round((s1 - s0) / (2 * TOOTH))), w = (s1 - s0) / m
  const pts: XY[] = []
  const at = (s: number, k: number): XY => [a[0] + d[0] * s + n[0] * k, a[1] + d[1] * s + n[1] * k]
  for (let i = 0; i < m; i++) { pts.push(at(s0 + i * w, 0), at(s0 + (i + .5) * w, w / 2)) }
  pts.push(at(s1, 0))
  return pts
}

/**
 * A stage's ring with its sawtooth. `ns` notches the north and south faces;
 * the east wall is notched outside the bay wherever it is longer than it.
 */
function plan(c: number, ns: boolean): XY[] {
  const r = basePlan(c), out: XY[] = []
  r.forEach((a, i) => {
    const b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const horizontal = Math.abs(a[1] - b[1]) < 1e-6 && Math.abs(Math.abs(a[1]) - c) < 1e-6
    const east = Math.abs(a[0] - XE) < 1e-6 && Math.abs(b[0] - XE) < 1e-6
    if (ns && horizontal && L > 4) { out.push(...teeth(a, b, 0, L).slice(0, -1)); return }
    if (east && L > 2 * BAY + 4) {
      // The ring runs north along the east wall: flank, bay, flank.
      const flank = (L - 2 * BAY) / 2
      out.push(...teeth(a, b, 0, flank), ...teeth(a, b, flank + 2 * BAY, L).slice(0, -1))
      return
    }
    out.push(a)
  })
  return out
}

/** Walls of a ring from z0 to z1, smooth across shallow corners. */
function walls(p: Part, ring: XY[], z0: number, z1: number) {
  const n = ring.length
  const en = ring.map((a, i) => { const b = ring[(i + 1) % n]; return unit([b[1] - a[1], a[0] - b[0], 0]) })
  const vn = (i: number, e: number): V3 => {
    const other = e === i ? en[(i + n - 1) % n] : en[(i + 1) % n], own = en[e]
    return own[0] * other[0] + own[1] * other[1] > Math.cos(50 * Math.PI / 180) ? unit([own[0] + other[0], own[1] + other[1], 0]) : own
  }
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, a = ring[i], b = ring[j], na = vn(i, i), nb = vn(j, i)
    p.tri([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], undefined, undefined, undefined, [na, nb, nb])
    p.tri([a[0], a[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], undefined, undefined, undefined, [na, nb, na])
  }
}
function cap(p: Part, ring: XY[], z: number) {
  // ear-free fan from the centroid: every stage ring is star-shaped about it
  const c: XY = [ring.reduce((s, q) => s + q[0], 0) / ring.length, ring.reduce((s, q) => s + q[1], 0) / ring.length]
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    p.tri([c[0], c[1], z], [a[0], a[1], z], [b[0], b[1], z])
  }
}

/** Is this wall segment part of a jukebox bay (an end wall within |y| ≤ BAY)? */
const inBay = (a: XY, b: XY) =>
  (Math.abs(a[0] - XW) < 1e-6 || Math.abs(a[0] - XE) < 1e-6) && Math.abs(a[0] - b[0]) < 1e-6 &&
  Math.abs((a[1] + b[1]) / 2) < BAY + .01 && Math.abs(a[1] - b[1]) <= 2 * BAY + .02

/** Window panels: one per bay and three floors, granite between. */
function facade(ring: XY[], z0: number, z1: number) {
  const groups = Math.max(1, Math.round((z1 - z0) / GROUP)), step = (z1 - z0) / groups
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (inBay(a, b)) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 1.8) continue
    const d: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const v = (s: number, z: number): V3 => [a[0] + d[0] * s + d[1] * LIFT, a[1] + d[1] * s - d[0] * LIFT, z]
    const count = Math.max(1, Math.round(L / 5.2)), sp = L / count, w = sp * (L < 3 ? .5 : .66)
    for (let g = 0; g < groups; g++) {
      const za = z0 + g * step + 1, zb = z0 + (g + 1) * step - 1
      if (zb - za < 3) continue
      for (let k = 0; k < count; k++) {
        const s = sp * (k + .5)
        windows.quad(v(s - w / 2, za), v(s + w / 2, za), v(s + w / 2, zb), v(s - w / 2, zb))
      }
    }
  }
}

// ---------------------------------------------------------------- stages
const BASE = 6 // a plain granite plinth under the first window group
const stages = [
  { z0: 0, z1: 81, c: RD, ns: false },
  { z0: 81, z1: 85, c: 35.3, ns: false },
  { z0: 85, z1: 89, c: 31, ns: false },
  { z0: 89, z1: 155, c: 25.5, ns: true },
  { z0: 155, z1: 159, c: 22.5, ns: false },
  { z0: 159, z1: 164, c: 17.5, ns: false },
  { z0: 164, z1: SPRING, c: 13, ns: false },
]
for (const s of stages) {
  const ring = plan(s.c, s.ns)
  walls(granite, ring, s.z0, s.z1)
  facade(ring, s.z0 === 0 ? BASE : s.z0, s.z1 - .4)
  cap(roof, ring, s.z1)
  // a pale coping lip at each terrace
  walls(trim, ring.map(p => p), s.z1 - .5, s.z1)
}

// The stepped lobby block west of the tower (OSM's west tip; lidar steps).
const lobby: { x0: number; x1: number; y0: number; y1: number; z: number }[] = [
  { x0: -23, x1: XW + .2, y0: -9.5, y1: 9.5, z: 29.5 },
  { x0: -27, x1: -23, y0: -10, y1: 5, z: 25 },
  { x0: -31, x1: -27, y0: -8, y1: 1, z: 20 },
]
for (const b of lobby) {
  const ring: XY[] = [[b.x0, b.y0], [b.x1, b.y0], [b.x1, b.y1], [b.x0, b.y1]]
  walls(granite, ring, 0, b.z)
  cap(roof, ring, b.z)
  // a glazed band per floor group, on the three outward faces
  for (let z = 5; z + 6 < b.z; z += 8) {
    const g = (p: XY, q: XY, nx: number, ny: number) => windows.quad([p[0] + nx * LIFT, p[1] + ny * LIFT, z], [q[0] + nx * LIFT, q[1] + ny * LIFT, z], [q[0] + nx * LIFT, q[1] + ny * LIFT, z + 5], [p[0] + nx * LIFT, p[1] + ny * LIFT, z + 5])
    g([b.x0 + 1, b.y0], [b.x1 - 1, b.y0], 0, -1)
    g([b.x1 - 1, b.y1], [b.x0 + 1, b.y1], 0, 1)
    g([b.x0, b.y1 - 1], [b.x0, b.y0 + 1], -1, 0)
  }
}

// ---------------------------------------------------------------- vault
const arc = Array.from({ length: ARC + 1 }, (_, k) => {
  const t = Math.PI * k / ARC
  return { y: RV * Math.cos(t), z: SPRING + RV * Math.sin(t), n: [0, Math.cos(t), Math.sin(t)] as V3 }
})
for (let k = 0; k < ARC; k++) {
  const p = arc[k], q = arc[k + 1]
  glass.tri([XE, p.y, p.z], [XW, p.y, p.z], [XW, q.y, q.z], undefined, undefined, undefined, [p.n, p.n, q.n])
  glass.tri([XE, p.y, p.z], [XW, q.y, q.z], [XE, q.y, q.z], undefined, undefined, undefined, [p.n, q.n, q.n])
}
// A few pale ribs over the vault (the real one is ribbed every bay).
for (const x of [-12, -4, 4, 12]) {
  for (let k = 0; k < ARC; k++) {
    const p = arc[k], q = arc[k + 1], o = .05
    const P = (e: typeof p, dx: number): V3 => [x + dx, e.y * (1 + o / RV), e.z - SPRING + SPRING + e.n[2] * o]
    trim.quad(P(p, .35), P(p, -.35), P(q, -.35), P(q, .35))
  }
}

// ---------------------------------------------------------------- jukebox
// Each end wall: the glass bay from the street to the arch, the half-disc of
// glass closing the vault, an outer and an inner pale ring whose legs run
// down the bay, and the dark slot rising into the inner arch.
for (const side of [1, -1]) {
  const X = side > 0 ? XE : XW
  const x = (d: number) => X + side * d
  const face = (p: Part, d: number, y0: number, y1: number, z0: number, z1: number) => {
    const [ya, yb] = side > 0 ? [y0, y1] : [y1, y0]
    p.quad([x(d), ya, z0], [x(d), yb, z0], [x(d), yb, z1], [x(d), ya, z1])
  }
  const fan = (p: Part, d: number, r0: number, r1: number, cz = SPRING) => {
    for (let k = 0; k < ARC; k++) {
      const t0 = Math.PI * k / ARC, t1 = Math.PI * (k + 1) / ARC
      const P = (r: number, t: number): V3 => [x(d), r * Math.cos(t), cz + r * Math.sin(t)]
      const [a, b] = side > 0 ? [t0, t1] : [t1, t0]
      if (r0 === 0) p.tri([x(d), 0, cz], P(r1, a), P(r1, b))
      else p.quad(P(r0, a), P(r1, a), P(r1, b), P(r0, b))
    }
  }
  const OUT = 1.1, IN0 = 3.4, IN1 = 4.2, SL = 1
  face(windows, .02, -BAY, BAY, 0, SPRING)
  fan(windows, 0, 0, RV)
  // outer ring and its legs
  fan(trim, .04, RV - OUT, RV)
  face(trim, .04, RV - OUT, RV, BASE, SPRING)
  face(trim, .04, -RV, -RV + OUT, BASE, SPRING)
  // inner ring and its legs
  fan(trim, .04, IN0, IN1)
  face(trim, .04, IN0, IN1, BASE, SPRING)
  face(trim, .04, -IN1, -IN0, BASE, SPRING)
  // the slot, with a round top inside the inner arch
  const slotTop = SPRING + 1.2
  face(slot, .05, -SL, SL, BASE, slotTop)
  fan(slot, .05, 0, SL, slotTop)
  // a granite lintel band over the entrance, across the bay
  face(granite, .04, -BAY, BAY, 0, BASE)
}

// ---------------------------------------------------------------- write
const parts = [
  { part: granite, material: finish('owf-granite', 0xd9b0a1) },
  // Reflective glass, light in daylight; glows at night.
  { part: windows, material: { ...PALETTE.window, color: 0x93abbf } },
  // The jukebox slot: the one dark line, a defining feature.
  { part: slot, material: windowVariant(2, 0x56687a) },
  // The vault reads a deeper blue than the bay in every photo.
  { part: glass, material: { ...PALETTE.glass, color: 0x86a3bb } },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('One Wells Fargo Center', parts, {
  license: 'CC0-1.0', bearing: 5, elevation: 0, height: TOP,
  frame: 'Y up, -Z north, +X east, metres; origin at the catalog anchor on the ground',
  replaces: ['way/380092606'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/one-wells-fargo-center.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
