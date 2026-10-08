/**
 * Truist Center (formerly Hearst Tower, 2002, Smallwood, Reynolds, Stewart,
 * Stewart), 214 N Tryon St, Charlotte — original procedural geometry, CC0-1.0.
 * bun generators/truist-center-charlotte.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Placed at bearing 48°, so the tower's faces, square to Uptown's
 * street grid, are square to this frame.
 *
 * What makes it itself, and what this model keeps:
 *  1. a square shaft of pale stone that flares slightly as it rises, strongly
 *     vertical: deep stone piers with tall glass bays between;
 *  2. a blue glazed bay turning each corner, set back a little from the stone
 *     faces, with pale floor lines;
 *  3. flared silver horns where each corner bay stops, the "wings" under the
 *     crown;
 *  4. the crown: the middle of each face carries on past the corners as a
 *     stone block whose glass bays end in pointed (gothic) gables between
 *     piers that rise as finials, stepping down to lower shoulders; behind
 *     them a steep ribbed glass hip roof climbs to a flat top crossed by two
 *     ridges, with a small lantern at the peak;
 *  5. stone podiums north and south of the tower, their parapets broken by
 *     pier finials.
 *
 * Evidence (2026 rework):
 *  - Lidar: USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m DSM resampled into
 *    this frame. y=0 is the lowest ground at the footprint (its east side);
 *    the published 659 ft (200.9 m) matches the lidar's peak, 200.9.
 *    Measured: tower centred 18 m south of the anchor, ±26 m at the top;
 *    corner bays end at 168, horns to ≈173; shoulders 173–175; the middle
 *    blocks ±11 m wide, ≈9.5 m deep, top 184 with a front parapet at 187;
 *    hip roof rising from the corners at 169 to a flat ±12.5 m square at
 *    ≈195, ridges along both axes at 198, peak 200.9. North podium 58 in the
 *    middle and 54 on either side; south podium 54; low strips along the
 *    east and west sides of the base at ≈18 m (40 m in places, not modelled).
 *  - OSM: way/131139746 (height 200, 47 levels) for the block outline; its
 *    building:parts carry no heights.
 *  - Published: 200.9 m (659 ft), 47 floors (Wikipedia; Emporis).
 *  - Photos (Wikimedia Commons, all checked by eye): patriarca12, "Charlotte
 *    hearst tower.jpg" CC BY 2.5 (whole tower, crown, flare and horns);
 *    Ken Lund, "Hearst Tower, Charlotte, North Carolina" CC BY-SA 2.0 (face
 *    on: piers, pointed gables, stepped top, corner glazing);
 *    Chuck Allen, "Hearst Tower in Charlotte" CC BY-SA 2.0 (piers, podium
 *    parapets); Backupcoolmen, "Hearst Tower 2" public domain (corner bays,
 *    podium); John Ashley, "Hearst Tower, Charlotte, B&W" CC BY 2.0 (podium
 *    finials, horns).
 *  - Estimated: the flare (a 24 m half-width at the corner bays' feet, from
 *    the photos), the corner bays' 6.5 m panes, bay and floor counts, the
 *    shoulders' depth.
 *
 * Earlier versions measured the massing from Google's 3D renders; this one is
 * rebuilt from lidar, OSM and licensed photos only. The lidar has no 196 m
 * stone gable standing on each face, as the old model had: the face tops are
 * flat at 187, and the gable reads from the pointed bay heads and the hip roof
 * behind them, as in the photos.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
type V = V3
const at = (p: XY, z: number): V => [p[0], p[1], z]
const rot = (p: XY, s: number): XY => {
  let [x, y] = p
  for (let k = 0; k < s; k++) [x, y] = [-y, x]
  return [x, y]
}
const L = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const add = (a: V, b: V, k = 1): V => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
const unit = (a: V): V => { const l = Math.hypot(...a); return [a[0] / l, a[1] / l, a[2] / l] }
const cross3 = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

// One glass for the faces and the corner bays: Ken Lund's face-on photo shows
// the same reflective blue in both.
const stone = new Part(), windows = new Part(), notch = windows
const trim = new Part(), glass = new Part(), deck = new Part()

function normal(a: V, b: V, c: V): V {
  return unit(cross3(add(b, a, -1), add(c, a, -1)))
}
function triFacing(part: Part, a: V, b: V, c: V, n: V) {
  const m = normal(a, b, c)
  if (m[0] * n[0] + m[1] * n[1] + m[2] * n[2] >= 0) part.tri(a, b, c)
  else part.tri(a, c, b)
}
function quadFacing(part: Part, a: V, b: V, c: V, d: V, n: V) {
  triFacing(part, a, b, c, n); triFacing(part, a, c, d, n)
}
const wall = (part: Part, a: XY, b: XY, z0: number, z1: number) =>
  part.quad(at(a, z0), at(b, z0), at(b, z1), at(a, z1))
/** Fan cap over a ring that is star-shaped about `c`. */
function cap(part: Part, ring: XY[], z: number, c: XY) {
  ring.forEach((a, i) => part.tri(at(c, z), at(a, z), at(ring[(i + 1) % ring.length], z)))
}
/** A box standing on the ground plan `a→b` (front edge), `depth` behind it. */
function box(part: Part, a: XY, b: XY, depth: number, z0: number, z1: number, open = false) {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / l, -(b[0] - a[0]) / l]
  const c: XY = [b[0] - n[0] * depth, b[1] - n[1] * depth], d: XY = [a[0] - n[0] * depth, a[1] - n[1] * depth]
  wall(part, a, b, z0, z1); wall(part, b, c, z0, z1); wall(part, d, a, z0, z1)
  if (!open) wall(part, c, d, z0, z1)
  part.quad(at(a, z1), at(b, z1), at(c, z1), at(d, z1))
}

// ---------- facades ----------
// Windows are slate panels on the stone (STYLE.md, Windows): one per bay,
// three floors tall, the stone showing between bays as piers and between
// groups as spandrels. Groups count from the ground, so they line up across
// every face. Glass fills about two thirds of each bay, as in the face-on photo:
// slim pale piers between tall blue bays.
const FLOOR = 4.25, GROUP = 3 * FLOOR, SPANDREL = 1.8, PIER = 1.4, BAY = 4.3, PROUD = .04

/** A point on the quad a0→b0 (at z0), a1→b1 (at z1): `u` along, `v` up. */
function onQuad(a0: XY, b0: XY, z0: number, a1: XY, b1: XY, z1: number, u: number, v: number): V {
  return [...L(L(a0, b0, u), L(a1, b1, u), v), z0 + (z1 - z0) * v] as V
}
function faceNormal(a: XY, b: XY): XY {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1])
  return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l]
}
/** Rectangles PROUD of the wall a0→b0 (z0) … a1→b1 (z1), `bays` across, between heights lo and hi. */
function onWall(part: Part, a0: XY, b0: XY, z0: number, a1: XY, b1: XY, z1: number,
  bays: number, pier: number, lo: number, hi: number) {
  const n = faceNormal(a0, b0), len = Math.hypot(b0[0] - a0[0], b0[1] - a0[1])
  const off = (p: V): V => [p[0] + n[0] * PROUD, p[1] + n[1] * PROUD, p[2]]
  const v0 = (lo - z0) / (z1 - z0), v1 = (hi - z0) / (z1 - z0)
  for (let k = 0; k < bays; k++) {
    const u0 = (k + pier / 2 / (len / bays)) / bays, u1 = (k + 1 - pier / 2 / (len / bays)) / bays
    const q = (u: number, v: number) => off(onQuad(a0, b0, z0, a1, b1, z1, u, v))
    part.quad(q(u0, v0), q(u1, v0), q(u1, v1), q(u0, v1))
  }
}
/** A stone wall carrying window panels in bays about BAY wide. */
function stoneFace(a0: XY, b0: XY, z0: number, a1: XY, b1: XY, z1: number, bay = BAY) {
  stone.quad(at(a0, z0), at(b0, z0), at(b1, z1), at(a1, z1))
  const len = Math.hypot(b0[0] - a0[0], b0[1] - a0[1])
  if (len < PIER + 2) return
  const bays = Math.max(1, Math.round(len / bay))
  for (let g = Math.floor(z0 / GROUP); g * GROUP < z1; g++) {
    const lo = Math.max(g * GROUP + SPANDREL / 2, z0 + 1), hi = Math.min((g + 1) * GROUP - SPANDREL / 2, z1 - 1)
    if (hi - lo >= 3) onWall(windows, a0, b0, z0, a1, b1, z1, bays, PIER, lo, hi)
  }
}
/** A pane of the corner glazing, with a pale floor line every two floors. */
function notchPane(a0: XY, b0: XY, z0: number, a1: XY, b1: XY, z1: number) {
  notch.quad(at(a0, z0), at(b0, z0), at(b1, z1), at(a1, z1))
  for (let z = Math.ceil(z0 / (2 * FLOOR)) * 2 * FLOOR; z < z1 - 2; z += 2 * FLOOR)
    onWall(trim, a0, b0, z0, a1, b1, z1, 1, 0, z - .35, z + .35)
}

// ---------- the tower ----------
const TY = -18          // tower centre, south of the anchor (lidar)
const A = 17            // half-width of each face's stone
const G0 = 6.8, G1 = 8.2 // a corner bay's pane, seen square on, at its foot and head: the flare
const D = .8            // the corner bay's set-back from the stone faces
const Z_NOTCH0 = 58     // corner bays start at the podium roofs
const Z_HOOD = 168      // corner bays end (lidar)
const T = (p: XY): XY => [p[0], p[1] + TY]
const C = T([0, 0])
const CH = .5

/**
 * The south-east corner's run of the plan for a pane `g` wide: the stone
 * face's chamfered end, the step back, the corner bay's two panes, the step
 * out and the next face's chamfered end.
 */
const corner = (g: number, d = D): XY[] => {
  const h = A + g + d
  return [[A - CH, -h], [A, -h + CH], [A, -h + d], [h - d, -h + d], [h - d, -A], [h - CH, -A], [h, -A + CH]]
}
const shaftWall = (part: Part, a0: XY, b0: XY, a1: XY, b1: XY) =>
  part.quad(at(a0, Z_NOTCH0), at(b0, Z_NOTCH0), at(b1, Z_HOOD), at(a1, Z_HOOD))

// base: the full square with chamfered corners, up to the corner bays' feet
{
  const h = A + G0 + D
  for (let s = 0; s < 4; s++) {
    const a = T(rot([-h + CH, -h], s)), b = T(rot([h - CH, -h], s)), c = T(rot([h, -h + CH], s))
    stoneFace(a, b, 0, a, b, Z_NOTCH0)
    wall(stone, b, c, 0, Z_NOTCH0)
  }
}
// shaft: stone faces, the bays' stepped returns, their glazed corners
const H0 = A + G0 + D, H1 = A + G1 + D
for (let s = 0; s < 4; s++) {
  const r = (p: XY) => T(rot(p, s))
  const lo = corner(G0).map(r), hi = corner(G1).map(r)
  stoneFace(r([-A + CH, -H0]), r([A - CH, -H0]), Z_NOTCH0, r([-A + CH, -H1]), r([A - CH, -H1]), Z_HOOD)
  shaftWall(stone, lo[0], lo[1], hi[0], hi[1])
  shaftWall(stone, lo[1], lo[2], hi[1], hi[2])
  notchPane(lo[2], lo[3], Z_NOTCH0, hi[2], hi[3], Z_HOOD)
  notchPane(lo[3], lo[4], Z_NOTCH0, hi[3], hi[4], Z_HOOD)
  shaftWall(stone, lo[4], lo[5], hi[4], hi[5])
  shaftWall(stone, lo[5], lo[6], hi[5], hi[6])
  // the corner bay's head, closed over
  cap(deck, [hi[2], hi[3], hi[4], r([A, -A])], Z_HOOD, r([A, -A]))
}

// ---------- the crown ----------
// Above the corner bays each face carries on: shoulders (|x| 11–17) to 174
// and the middle block (|x| < 11) to 184 with a parapet to 187. Five piers
// stand proud of the face from the podium roofs up and rise past the tops
// as finials; between them the top bays end in pointed gables, two on the
// block and one on each shoulder, as in Ken Lund's face-on photo.
const BLOCK_A = 11, BLOCK_DEPTH = 9.5, SHOULDER_DEPTH = 6
const Z_SHOULDER = 174, Z_BLOCK = 184, Z_PARAPET = 187, PARAPET_DEPTH = 1.2
const RIB_EDGE = A - .65
const PIERS = [-RIB_EDGE, -BLOCK_A, 0, BLOCK_A, RIB_EDGE]
const RIB_W = 1.3, RIB_T = .5, FINIAL = 3
const Z_ROOF_TOP = 195, ROOF_TOP = 12.5, RIDGE = 198, PEAK = 200.9, LANTERN = 2.5

{
  for (let s = 0; s < 4; s++) {
    const r = (p: XY) => T(rot(p, s))
    const r3 = (x: number, y: number, z: number): V => [...r([x, y]), z] as V
    const out: V = [...rot([0, -1], s), 0] as V
    const h = H1
    // shoulders, either side of the block
    for (const sg of [-1, 1]) {
      const a = r([sg < 0 ? -A + CH : BLOCK_A, -h]), b = r([sg < 0 ? -BLOCK_A : A - CH, -h])
      box(stone, a, b, SHOULDER_DEPTH, Z_HOOD, Z_SHOULDER, true)
    }
    // the block, its parapet, and the pointed bays between the piers
    const fl = r([-BLOCK_A, -h]), fr = r([BLOCK_A, -h])
    box(stone, fl, fr, BLOCK_DEPTH, Z_HOOD, Z_BLOCK, true)
    box(stone, fl, fr, PARAPET_DEPTH, Z_BLOCK, Z_PARAPET)
    for (let k = 0; k < 4; k++) {
      const x0 = PIERS[k] + RIB_W / 2 + .4, x1 = PIERS[k + 1] - RIB_W / 2 - .4, xm = (x0 + x1) / 2
      const mid = k === 1 || k === 2, lo = 166.5
      const sp = mid ? Z_BLOCK - 3 : Z_SHOULDER - 4.5, apex = mid ? Z_PARAPET - 1 : Z_SHOULDER - 1
      // the gables sit on the flaring face below the hood: follow it
      const yAt = (z: number) => z >= Z_HOOD ? -h : -(H0 + (h - H0) * (z - Z_NOTCH0) / (Z_HOOD - Z_NOTCH0))
      const p = (x: number, z: number): V => add(r3(x, yAt(z), z), out, PROUD)
      quadFacing(windows, p(x0, lo), p(x1, lo), p(x1, sp), p(x0, sp), out)
      triFacing(windows, p(x0, sp), p(x1, sp), p(xm, apex), out)
      // Tracery: thin stone outlines over the glass, the pointed arch and a
      // mullion up the middle, so the tops read pale and lacy.
      const m = (x: number, z: number): V => add(p(x, z), out, PROUD)
      const w = .35, run = Math.hypot(xm - x0, apex - sp), dx = w * (apex - sp) / run, dz = w * (xm - x0) / run
      quadFacing(stone, m(x0, sp), m(xm, apex), m(xm, apex - dz), m(x0 + dx, sp), out)
      quadFacing(stone, m(xm, apex), m(x1, sp), m(x1 - dx, sp), m(xm, apex - dz), out)
      quadFacing(stone, m(x0, sp - .3), m(x1, sp - .3), m(x1, sp + .2), m(x0, sp + .2), out)
      quadFacing(stone, m(xm - .25, lo), m(xm + .25, lo), m(xm + .25, apex - .8), m(xm - .25, apex - .8), out)
    }
    // piers: proud stone ribs from the podium roofs to finials over the parapet
    const h0 = H0
    for (const x of PIERS) {
      const zTop = (Math.abs(x) > BLOCK_A + 1 ? Z_SHOULDER : Z_PARAPET) + FINIAL
      const f0 = r3(x - RIB_W / 2, -h0, Z_NOTCH0), f1 = r3(x + RIB_W / 2, -h0, Z_NOTCH0)
      const m0 = r3(x - RIB_W / 2, -h, Z_HOOD), m1 = r3(x + RIB_W / 2, -h, Z_HOOD)
      const t0 = r3(x - RIB_W / 2, -h, zTop - 1.2), t1 = r3(x + RIB_W / 2, -h, zTop - 1.2)
      const o = (p: V): V => add(p, out, RIB_T)
      // the front, sloping with the flare to the hood, then upright
      quadFacing(stone, o(f0), o(f1), o(m1), o(m0), out)
      quadFacing(stone, o(m0), o(m1), o(t1), o(t0), out)
      // the sides
      const side: V = [...rot([1, 0], s), 0] as V
      for (const [a, b, c, sgn] of [[f0, m0, t0, -1], [f1, m1, t1, 1]] as [V, V, V, number][]) {
        const n = add([0, 0, 0], side, sgn)
        quadFacing(stone, a, o(a), o(b), b, n)
        quadFacing(stone, b, o(b), o(c), c, n)
      }
      // a pointed cap
      const tip = add(r3(x, -h, zTop), out, RIB_T / 2)
      triFacing(trim, o(t0), o(t1), tip, add(out, [0, 0, .5]))
      triFacing(trim, t0, o(t0), tip, add([0, 0, 0], side, -1))
      triFacing(trim, o(t1), t1, tip, side)
    }
    // Wings: each corner bay's head is roofed by a pale canopy that rises
    // from the stone on both sides and flares out to a point over the
    // corner (lidar: 168 at the bay, ≈173 at the tips).
    // The bays' feet carry smaller wings of the same kind (patriarca12's photo).
    const diag: V = unit([...rot([1, -1], s), 0] as V)
    for (const [g, z, rise, k] of [[A + G1, Z_HOOD, 5.5, 1.3], [A + G0, Z_NOTCH0, 3.5, .9]]) {
      const a1 = r3(A, -g - .3, z - 1), c1 = r3(A, -g - .3, z + .6)
      const a2 = r3(g + .3, -A, z - 1), c2 = r3(g + .3, -A, z + .6)
      const tip = r3(g + k, -g - k, z + rise)
      triFacing(trim, c1, c2, tip, [0, 0, 1])
      triFacing(trim, a1, a2, tip, add(diag, [0, 0, -1]))
      triFacing(trim, a1, c1, tip, out)
      triFacing(trim, a2, c2, tip, [...rot([1, 0], s), 0] as V)
    }
  }

  // The hip roof: pale glass with stone ribs fanning up from the corner bays'
  // heads (169 in the lidar) to a flat square at 195.
  const lift = (p: V, n: V): V => add(p, n, .05)
  const lerp3 = (a: V, b: V, t: number): V => add(a, add(b, a, -1), t)
  /** A raised strip on a plane with outward normal `n`. */
  function raised(part: Part, pts: V[], n: V, t: number) {
    const top = pts.map((p) => add(p, n, t))
    for (let i = 1; i < top.length - 1; i++) triFacing(part, top[0], top[i], top[i + 1], n)
    const c = pts.reduce((m, p) => add(m, p, 1 / pts.length), [0, 0, 0] as V)
    pts.forEach((a, i) => {
      const b = pts[(i + 1) % pts.length], e = add(add(a, b, 1), c, -2)
      const o = unit(add(e, n, -(e[0] * n[0] + e[1] * n[1] + e[2] * n[2])))
      triFacing(part, a, b, top[(i + 1) % pts.length], o)
      triFacing(part, a, top[(i + 1) % pts.length], top[i], o)
    })
  }
  /** A flat rib laid `t` off the plane: at map distance its sides never show. */
  function rib(part: Part, a: V, b: V, n: V, w: number, t: number) {
    const side = unit(cross3(n, add(b, a, -1)))
    const q = (p: V, k: number) => add(add(p, side, k * w / 2), n, t)
    quadFacing(part, q(a, -1), q(b, -1), q(b, 1), q(a, 1), n)
  }
  const R = A + G1
  const base = [0, 1, 2, 3].map((s) => T(rot([R, -R], s)))
  const top = [0, 1, 2, 3].map((s) => T(rot([ROOF_TOP, -ROOF_TOP], s)))
  for (let i = 0; i < 4; i++) {
    const j = (i + 3) % 4
    const b0 = at(base[j], Z_HOOD), b1 = at(base[i], Z_HOOD), t1 = at(top[i], Z_ROOF_TOP), t0 = at(top[j], Z_ROOF_TOP)
    glass.quad(b0, b1, t1, t0)
    const n = normal(b0, b1, t1)
    const mb = lerp3(b0, b1, .5), mt = lerp3(t0, t1, .5)
    for (const [cb, ct] of [[b0, t0], [b1, t1]] as [V, V][]) {
      const inward = unit(add(mb, cb, -1))
      raised(stone, [lift(cb, n), lift(ct, n), lift(add(ct, inward, .6), n), lift(add(cb, inward, .6), n)], n, .3)
      // Chevrons: ribs from the eave up to the hip, the two hips' sets
      // meeting as V's down the face (the herringbone in the photos).
      for (let k = 1; k <= 7; k++) {
        const e = k / 8
        rib(stone, lift(lerp3(cb, mb, e), n), lift(lerp3(cb, ct, Math.min(1, e + .1)), n), n, .9, .2)
      }
    }
    rib(stone, lift(mb, n), lift(mt, n), n, .9, .3)
  }
  cap(stone, top, Z_ROOF_TOP, C) // the flat top reads pale, like the ribs
  // two ridges crossing the flat top along the axes, gabled at each end
  for (let s = 0; s < 2; s++) {
    const q = (x: number, y: number, z: number): V => [...T(rot([x, y], s)), z] as V
    const w = 1.6, e = ROOF_TOP - .3
    for (const sg of [-1, 1]) {
      quadFacing(stone, q(-e, sg * w, Z_ROOF_TOP), q(e, sg * w, Z_ROOF_TOP), q(e, 0, RIDGE), q(-e, 0, RIDGE), [...rot([0, sg], s), 1] as V)
      triFacing(stone, q(sg * e, -w, Z_ROOF_TOP), q(sg * e, w, Z_ROOF_TOP), q(sg * e, 0, RIDGE), [...rot([sg, 0], s), 0] as V)
    }
  }
  // the lantern
  const lr = [0, 1, 2, 3].map((s) => T(rot([LANTERN, -LANTERN], s)))
  lr.forEach((a, i) => wall(trim, a, lr[(i + 1) % 4], Z_ROOF_TOP, RIDGE + .5))
  lr.forEach((a, i) => trim.tri(at(a, RIDGE + .5), at(lr[(i + 1) % 4], RIDGE + .5), at(C, PEAK)))
}

// ---------- podiums ----------
// Footprints from the OSM outline, heights from the lidar. Pier finials break
// the parapets, one per bay, as on the real podiums.
function finials(a: XY, b: XY, z: number) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(len / BAY))
  for (let k = 1; k < n; k++) {
    const t = k / n, w = .5 / len
    const p0 = L(a, b, t - w), p1 = L(a, b, t + w)
    box(stone, p0, p1, .8, z, z + 1.8)
  }
}
function block(ring: XY[], z1: number, c: XY, skip: number[] = []) {
  ring.forEach((a, i) => {
    const b = ring[(i + 1) % ring.length]
    stoneFace(a, b, 0, a, b, z1)
    if (!skip.includes(i)) finials(a, b, z1)
  })
  cap(deck, ring, z1, c)
}
// north: a 58 m middle between 54 m sides
const NY0 = TY + H0
block([[-27.8, NY0], [-19.5, NY0], [-19.5, 55.5], [-22, 56.2], [-21.9, 50.3], [-27.6, 50.3]], 54, [-24, 30], [1])
block([[19.5, NY0], [28, NY0], [28.1, 48.9], [21.5, 56.7], [19.5, 56.5]], 54, [24, 30], [4])
block([[-19.5, NY0], [19.5, NY0], [19.5, 56.5], [-19.5, 55.5]], 58, [0, 33], [0])
// south: one 54 m block
block([[-27.9, -57], [25.8, -57], [25.8, TY - H0], [-27.9, TY - H0]], 54, [-1, -50], [2])
// the low strips along the east and west of the base
for (const sg of [-1, 1]) {
  const x0 = sg * H0, x1 = sg * 27.8
  const ring: XY[] = sg > 0 ? [[x0, TY - H0], [x1, TY - H0], [x1, NY0], [x0, NY0]] : [[x1, TY - H0], [x0, TY - H0], [x0, NY0], [x1, NY0]]
  // only the long outer face shows: the ends meet the podiums
  const [a, b] = sg > 0 ? [ring[1], ring[2]] : [ring[3], ring[0]]
  stoneFace(a, b, 0, a, b, 18)
  cap(deck, ring, 18, [(x0 + x1) / 2, TY + 2])
}

// ---------- write ----------
// Pale stone and one reflective blue glass for the faces and corner bays,
// pale silver glass in the crown, as in the daylight photos.
const parts = [
  { part: stone, material: PALETTE.stone },
  { part: windows, material: { ...PALETTE.window, color: 0x7590ad } },
  { part: trim, material: PALETTE.trim },
  // The crown reads white and silver in the photos: pale glass, not palette blue.
  { part: glass, material: finish('truist-crown-glass', 0xd5e1e8, .3) },
  { part: deck, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Truist Center', parts, {
  license: 'CC0-1.0', bearing: 48, elevation: 0, height: PEAK,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/truist-center-charlotte.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
