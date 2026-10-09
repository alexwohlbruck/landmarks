/**
 * Truist Center (formerly Hearst Tower, 2002, Smallwood, Reynolds, Stewart,
 * Stewart), 214 N Tryon St, Charlotte — original procedural geometry, CC0-1.0.
 * bun generators/truist-center-charlotte.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Placed at bearing 48°, so the tower's faces, square to Uptown's
 * street grid, are square to this frame.
 *
 * A square tower of pale granite on the south half of the block. Each corner
 * is notched: the stone face stops short of the corner, steps back, and a
 * blue glazed bay turns the corner inside the notch. The step grows going
 * up, so the faces widen slightly towards the top. Silver wings flare from
 * the notches' heads and feet. Above the notch heads the middle of each face
 * carries on as a stone block ending in a tall pointed gable; around and
 * behind the four gables a steep hip roof of pale ribbed glass climbs to a
 * flat square with a small lantern. Podiums with a crenellated top fill the
 * rest of the block north and south.
 *
 * What makes it recognisable, each drawn as plain geometry:
 * - the four tall stone gables and the ribbed glass hip roof behind them;
 * - the blue glazed corner notches, flared at both ends;
 * - bold granite piers running the full height of each face and on into the
 *   gable, with blue glass between them: on each 32 m face two narrow outer
 *   bays and three wide inner ones, each wide bay split by a minor pier
 *   (Ken Lund's photo from Tryon St, counted on the upper floors);
 * - the podiums' crenellated parapet of pier caps (John Ashley's photo).
 *
 * Sources and trust:
 * - Footprint and peak: OSM's outline (way/131139746, height 200 m;
 *   published 659 ft, 201 m, 47 floors). OSM's building:parts carry no
 *   heights.
 * - Measured (lidar, Mecklenburg 2016, USGS 3DEP NC Phase 4, 1 m): the
 *   tower's plan (48 m square at the top, centred 17-18 m south of the
 *   anchor), the notch heads (168-174 m), the face tops (184-188 m) and the
 *   peak (200-201 m); the podiums, 54-59 m. The north podium was 48 m and
 *   the south-east one 42 m on main; both are raised to the lidar here.
 * - Estimated: the gable's pitch (kept from the approved model; lidar shows
 *   the face tops flat at 184-188 m because the gable is a thin screen), the
 *   bay widths (photo counts scaled to the 32 m face), the three-floor panel
 *   grouping (an abstraction of the real one-floor spandrels), the notch
 *   wings' size, the entrance bay's size (OSM entrance node on the west face).
 * - Earlier versions of this model were shaped against Google's 3D renders.
 *   That geometry is unchanged in silhouette; every dimension above is now
 *   checked against lidar and licensed photos instead.
 *
 * Photos (Wikimedia Commons): "Hearst Tower, Charlotte, North Carolina" (Ken
 * Lund, CC BY-SA 2.0); "Charlotte hearst tower" (patriarca12, CC BY 2.5);
 * "Hearst Tower in Charlotte" (Chuck Allen, CC BY-SA 2.0); "Hearst Tower 2"
 * (Backupcoolmen, public domain); "Hearst Tower, Charlotte, B&W" (John Ashley,
 * CC BY 2.0); "One South at the Plaza, Omni Hotel, Bank of America Corporate
 * Center, Truist Center, Ritz-Carlton" (Kiran891, CC BY-SA 4.0).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]
type V = V3
const at = (p: XY, z: number): V3 => [p[0], p[1], z]
const rot = (p: XY, s: number): XY => {
  let [x, y] = p
  for (let k = 0; k < s; k++) [x, y] = [-y, x]
  return [x, y]
}
const L = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const add = (a: V, b: V, k = 1): V => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
const unit = (a: V): V => { const l = Math.hypot(...a); return [a[0] / l, a[1] / l, a[2] / l] }
const cross3 = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot3 = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

// Parts. Stone is the granite; trim the brighter frames, tracery, ribs and
// the silver wings; windows the blue glass of the faces, notch the deeper
// blue of the corner bays; roof the crown's pale glass; deck the flat roofs.
const stone = new Part(), trim = new Part(), windows = new Part(), notch = new Part()
const roof = new Part(), deck = new Part()

// ---------- helpers ----------

/** Unit normal of the plane through three points. */
function normal(a: V, b: V, c: V): V {
  return unit(cross3(add(b, a, -1), add(c, a, -1)))
}
function triFacing(part: Part, a: V, b: V, c: V, n: V) {
  if (dot3(normal(a, b, c), n) >= 0) part.tri(a, b, c)
  else part.tri(a, c, b)
}
const wall = (part: Part, a: XY, b: XY, z0: number, z1: number) =>
  part.quad(at(a, z0), at(b, z0), at(b, z1), at(a, z1))
/** Fan cap over a ring that is star-shaped about `c`. */
function cap(part: Part, ring: XY[], z: number, c: XY) {
  ring.forEach((a, i) => part.tri(at(c, z), at(a, z), at(ring[(i + 1) % ring.length], z)))
}
/**
 * A strip raised `t` off a plane with outward normal `n`: the polygon `pts`
 * (on the plane, convex) lifted, plus its side walls down to the plane.
 */
function raised(part: Part, pts: V[], n: V, t: number) {
  const top = pts.map((p) => add(p, n, t))
  for (let i = 1; i < top.length - 1; i++) triFacing(part, top[0], top[i], top[i + 1], n)
  const c = pts.reduce((m, p) => add(m, p, 1 / pts.length), [0, 0, 0] as V)
  pts.forEach((a, i) => {
    const b = pts[(i + 1) % pts.length], e = add(add(a, b, 1), c, -2)
    const out = unit(add(e, n, -dot3(e, n)))
    triFacing(part, a, b, top[(i + 1) % pts.length], out)
    triFacing(part, a, top[(i + 1) % pts.length], top[i], out)
  })
}
/** A raised rib of width `w` along a→b on a plane with normal `n`. */
function rib(part: Part, a: V, b: V, n: V, w: number, t: number) {
  const side = unit(cross3(n, add(b, a, -1)))
  raised(part, [add(a, side, -w / 2), add(b, side, -w / 2), add(b, side, w / 2), add(a, side, w / 2)], n, t)
}

// ---------- facades ----------
// A face is a plane that may lean slightly (the shaft flares): its centre
// line runs c0 at z0 to c1 at z1, `t` runs along it. Points on it are
// (s, z): s metres from the centre line, at height z.
type Face = { c0: XY; c1: XY; z0: number; z1: number; t: XY; n: V }
function face(c0: XY, c1: XY, z0: number, z1: number, t: XY): Face {
  const a: V = at(c0, z0), b: V = at([c0[0] + t[0], c0[1] + t[1]], z0), c: V = at(c1, z1)
  let n = normal(a, b, c)
  const out: XY = [t[1], -t[0]] // outward is to the right of t
  if (n[0] * out[0] + n[1] * out[1] < 0) n = [-n[0], -n[1], -n[2]]
  return { c0, c1, z0, z1, t, n }
}
function P(F: Face, s: number, z: number, lift = 0): V {
  const k = (z - F.z0) / (F.z1 - F.z0), c = L(F.c0, F.c1, k)
  return [c[0] + F.t[0] * s + F.n[0] * lift, c[1] + F.t[1] * s + F.n[1] * lift, z + F.n[2] * lift]
}
const PROUD = .05
/** A flat panel on the face, standing just proud of it. */
function panel(part: Part, F: Face, s0: number, s1: number, z0: number, z1: number) {
  part.quad(P(F, s0, z0, PROUD), P(F, s1, z0, PROUD), P(F, s1, z1, PROUD), P(F, s0, z1, PROUD))
}
/** A granite pier standing `t` proud of the face, from z0 to z1. */
function pier(F: Face, s0: number, s1: number, z0: number, z1: number, t = PIER_T, part = stone) {
  raised(part, [P(F, s0, z0), P(F, s1, z0), P(F, s1, z1), P(F, s0, z1)], F.n, t)
}

// Storeys are grouped three to a panel (STYLE.md, Windows): blue glass
// between the piers, granite spandrels between groups. Groups count from
// the ground, so they line up on every face.
const FLOOR = 4.2, GROUP = 3 * FLOOR, SPANDREL = 2.1
const groups = (z0: number, z1: number): [number, number][] => {
  const out: [number, number][] = []
  for (let g = Math.floor(z0 / GROUP); g * GROUP < z1; g++) {
    const lo = Math.max(g * GROUP + SPANDREL / 2, z0 + .8), hi = Math.min((g + 1) * GROUP - SPANDREL / 2, z1 - .8)
    if (hi - lo >= 3) out.push([lo, hi])
  }
  return out
}

/**
 * The bay layout of a 32 m tower face, s from the centre line. Major piers
 * at ±3.9 and ±11.7 stand proud; between them the glass bays, each wide one
 * split in two by a minor pier left flush (the wall shows through).
 */
const PIER_W = 1.8, PIER_T = .6, MINOR = .9
const MAJORS = [-11.7, -3.9, 3.9, 11.7]
const BAYS: [number, number][] = [
  [-15.4, -12.6], // outer
  [-10.6, -8.45], [-7.15, -5.0],
  [-2.8, -.65], [.65, 2.8],
  [5.0, 7.15], [8.45, 10.6],
  [12.6, 15.4],
]
function towerFace(F: Face, z0: number, z1: number, keep = (s0: number, s1: number) => true) {
  for (const [lo, hi] of groups(z0, z1)) for (const [s0, s1] of BAYS) if (keep(s0, s1)) panel(windows, F, s0, s1, lo, hi)
}

// ---------- the tower ----------
const TY = -17           // tower centre, south of the anchor
const A = 16.5           // half-width of each face's stone
const G = 7              // a notch's glazing, seen square on
const D0 = 0.9, D1 = 3.9 // the notch's step back at its foot and head: the flare
const Z_NOTCH0 = 58      // notches start above the base, just clear of the podiums (photo)
const Z_HOOD = 165       // notch heads; the crown starts
const PEAK = 200
const T = (p: XY): XY => [p[0], p[1] + TY]
const C = T([0, 0])
const CH = .5 // chamfer on the convex stone edges

/**
 * The south-east corner's run of the plan at step `d`: the stone face's
 * chamfered end, the step back, the two panes of the glazed notch, the step
 * out and the next face's chamfered end.
 */
const corner = (d: number): XY[] => {
  const h = A + G + d
  return [[A - CH, -h], [A, -h + CH], [A, -h + d], [h - d, -h + d], [h - d, -A], [h - CH, -A], [h, -A + CH]]
}
const shaftWall = (part: Part, a0: XY, b0: XY, a1: XY, b1: XY) =>
  part.quad(at(a0, Z_NOTCH0), at(b0, Z_NOTCH0), at(b1, Z_HOOD), at(a1, Z_HOOD))
/** A pane of the notch glazing, with a pale floor line every group. */
function notchPane(a0: XY, b0: XY, a1: XY, b1: XY) {
  notch.quad(at(a0, Z_NOTCH0), at(b0, Z_NOTCH0), at(b1, Z_HOOD), at(a1, Z_HOOD))
  const len = Math.hypot(b0[0] - a0[0], b0[1] - a0[1])
  const F = face(L(a0, b0, .5), L(a1, b1, .5), Z_NOTCH0, Z_HOOD, [(b0[0] - a0[0]) / len, (b0[1] - a0[1]) / len])
  for (let g = Math.ceil(Z_NOTCH0 / GROUP); g * GROUP < Z_HOOD - 2; g++) panel(trim, F, -len / 2, len / 2, g * GROUP - .4, g * GROUP + .4)
}

// base: the full square with chamfered corners, up to the notch feet. The
// face bays carry on down; the corner zones, under the notches, are blue
// glass like the notches themselves (as in the photos from Tryon St).
const H0 = A + G + D0
{
  const ring: XY[] = []
  for (let s = 0; s < 4; s++) {
    const r = (p: XY) => T(rot(p, s))
    const a = r([-H0 + CH, -H0]), b = r([H0 - CH, -H0]), c = r([H0, -H0 + CH])
    wall(stone, a, b, 0, Z_NOTCH0)
    wall(stone, b, c, 0, Z_NOTCH0)
    ring.push(a, b)
    const F = face(r([0, -H0]), r([0, -H0]), 0, Z_NOTCH0, rot([1, 0], s))
    // The main entrance is on the west face (OSM's entrance node): a tall
    // glazed bay in a granite frame under a pale canopy.
    const west = s === 3, DOOR = 5.2, DOOR_H = 13.4
    for (const [lo, hi] of groups(0, Z_NOTCH0)) for (const [s0, s1] of BAYS)
      if (!(west && lo < DOOR_H && s1 > -DOOR - 1.5 && s0 < DOOR + 1.5)) panel(windows, F, s0, s1, lo, hi)
    for (const sg of [-1, 1]) {
      for (const [lo, hi] of groups(0, Z_NOTCH0)) {
        if (west && lo < DOOR_H) continue
        for (const k of [0, 1]) panel(notch, F, sg * (17.4 + k * 3.4), sg * (19.9 + k * 3.4), lo, hi)
      }
      for (const m of MAJORS) pier(F, m - PIER_W / 2, m + PIER_W / 2, 0, Z_NOTCH0)
      pier(F, sg * 16.3 - .9, sg * 16.3 + .9, 0, Z_NOTCH0)
    }
    if (west) {
      panel(windows, F, -DOOR, DOOR, 0, DOOR_H)
      raised(trim, [P(F, -DOOR - 1.4, DOOR_H), P(F, DOOR + 1.4, DOOR_H), P(F, DOOR + 1.4, DOOR_H + 1.6), P(F, -DOOR - 1.4, DOOR_H + 1.6)], F.n, 2.2)
    }
  }
  cap(deck, ring, Z_NOTCH0, C)
}
// shaft: stone faces with their piers and bays, the notches' stepped
// returns, their glazed corners
const h0 = A + G + D0, h1 = A + G + D1
const shaftFaces: Face[] = []
for (let s = 0; s < 4; s++) {
  const r = (p: XY) => T(rot(p, s))
  const lo = corner(D0).map(r), hi = corner(D1).map(r)
  stone.quad(at(r([-A + CH, -h0]), Z_NOTCH0), at(r([A - CH, -h0]), Z_NOTCH0), at(r([A - CH, -h1]), Z_HOOD), at(r([-A + CH, -h1]), Z_HOOD))
  const F = face(r([0, -h0]), r([0, -h1]), Z_NOTCH0, Z_HOOD, rot([1, 0], s))
  shaftFaces.push(F)
  towerFace(F, Z_NOTCH0, Z_HOOD)
  // the outer majors and the face's end piers stop at the hood; the inner
  // ones carry on up the crown block (below)
  for (const m of [-11.7, 11.7]) pier(F, m - PIER_W / 2, m + PIER_W / 2, Z_NOTCH0, Z_HOOD)
  for (const m of [-3.9, 3.9]) pier(F, m - PIER_W / 2, m + PIER_W / 2, Z_NOTCH0, Z_HOOD)
  for (const sg of [-1, 1]) pier(F, sg * 15.9 - .5, sg * 15.9 + .5, Z_NOTCH0, Z_HOOD, .35)
  shaftWall(stone, lo[0], lo[1], hi[0], hi[1])
  shaftWall(stone, lo[1], lo[2], hi[1], hi[2])
  notchPane(lo[2], lo[3], hi[2], hi[3])
  notchPane(lo[3], lo[4], hi[3], hi[4])
  shaftWall(stone, lo[4], lo[5], hi[4], hi[5])
  shaftWall(stone, lo[5], lo[6], hi[5], hi[6])
  // the notch head, closed over at the hood
  cap(deck, [hi[2], hi[3], hi[4], r([A, -A])], Z_HOOD, r([A, -A]))
}

// ---------- the crown ----------
// The middle of each face rises past the hood as a stone block eight metres
// deep that ends in a tall pointed gable: a bright stone frame round blue
// glass, the inner piers rising into it and a pointed arch in its middle
// bay. Around and behind the gables a hip roof of pale glass, pleated with
// pale ribs, climbs from the notch heads to a 28 m square and a small
// lantern. Silver wings flare from the notch heads and feet.
const BLOCK_A = 12.6, BLOCK_DEPTH = 8
const Z_EAVE = 183, Z_APEX = 196   // the gable's springing and apex
const SCREEN = 1
const Z_ROOF = 196, ROOF_TOP = 14, LANTERN = 6
const FRAME = 1.9

/** A silver wing: a square foot flaring out and up to a point, leaning to (dx, dy). */
function wing(r3: (x: number, y: number, z: number) => V, c1: XY, z: number, rise: number, reach: number) {
  const sq: XY[] = [[c1[0] - .9, c1[1] - .9], [c1[0] + .9, c1[1] - .9], [c1[0] + .9, c1[1] + .9], [c1[0] - .9, c1[1] + .9]]
  const apex = r3(c1[0] + reach, c1[1] - reach, z + rise)
  const ring = sq.map((p) => r3(p[0], p[1], z - .3))
  const mid = r3(c1[0], c1[1], z)
  ring.forEach((a, i) => {
    const b = ring[(i + 1) % 4], e = add(add(a, b, .5), mid, -1)
    triFacing(trim, a, b, apex, unit([e[0], e[1], .4]))
  })
}

{
  const h = h1
  const slope = (Z_APEX - Z_EAVE) / BLOCK_A
  const zf = Z_EAVE + slope * CH // the gable's foot, over the chamfers
  const half = BLOCK_A - CH, rise = Z_APEX - zf
  const cosA = half / Math.hypot(half, rise)
  /** The gable's inner edge (under the frame) at s. */
  const zIn = (s: number) => zf + rise * (1 - Math.abs(s) / half) - FRAME / cosA
  for (let s = 0; s < 4; s++) {
    const r = (p: XY) => T(rot(p, s))
    const r3 = (x: number, y: number, z: number): V => [...r([x, y]), z] as V
    const out: V = [...rot([0, -1], s), 0] as V
    const yb = -h + BLOCK_DEPTH
    // the block: chamfered front corners, walls to the eave, a gabled top
    const fl = r([-BLOCK_A + CH, -h]), fr = r([BLOCK_A - CH, -h])
    const cl = r([-BLOCK_A, -h + CH]), cr = r([BLOCK_A, -h + CH])
    const bl = r([-BLOCK_A, yb]), br = r([BLOCK_A, yb])
    stone.quad(at(fl, Z_HOOD), at(fr, Z_HOOD), at(fr, zf), at(fl, zf))
    stone.quad(at(fr, Z_HOOD), at(cr, Z_HOOD), at(cr, Z_EAVE), at(fr, zf))
    stone.quad(at(cl, Z_HOOD), at(fl, Z_HOOD), at(fl, zf), at(cl, Z_EAVE))
    wall(stone, cr, br, Z_HOOD, Z_EAVE)
    wall(stone, bl, cl, Z_HOOD, Z_EAVE)
    wall(stone, br, bl, Z_HOOD, Z_EAVE)
    stone.quad(at(fl, Z_EAVE), at(fr, Z_EAVE), at(br, Z_EAVE), at(bl, Z_EAVE))
    stone.tri(at(fr, Z_EAVE), at(cr, Z_EAVE), at(br, Z_EAVE))
    stone.tri(at(fl, Z_EAVE), at(bl, Z_EAVE), at(cl, Z_EAVE))
    // the block's face: the same bays as the shaft, up to the gable's foot
    const F = face(r([0, -h]), r([0, -h]), Z_HOOD, PEAK, rot([1, 0], s))
    towerFace(F, Z_HOOD, zf, (s0, s1) => Math.abs(s0) < half && Math.abs(s1) < half)
    // The gable is a screen a metre thick standing on the block's front,
    // free of the roof behind it: a solid triangular prism.
    const ridgeF = r3(0, -h, Z_APEX), ridgeB = r3(0, -h + SCREEN, Z_APEX)
    for (const sg of [-1, 1]) {
      const fF = r3(sg * half, -h, zf), fB = r3(sg * half, -h + SCREEN, zf)
      const hint = add([0, 0, 1], [...rot([sg, 0], s), 0] as V, slope)
      triFacing(stone, fF, ridgeF, ridgeB, hint)
      triFacing(stone, fF, ridgeB, fB, hint)
    }
    triFacing(stone, r3(half, -h + SCREEN, zf), r3(-half, -h + SCREEN, zf), ridgeB, [-out[0], -out[1], 0])
    for (const sg of [-1, 1]) triFacing(stone, r3(sg * half, -h, zf), r3(sg * BLOCK_A, -h + CH, Z_EAVE), r3(sg * half, -h + SCREEN, zf), [0, 0, 1])
    // the gable's face: blue glass inside a bold, bright frame
    triFacing(windows, add(r3(-half, -h, zf), out, PROUD), add(r3(half, -h, zf), out, PROUD), add(ridgeF, out, PROUD), out)
    const sinA = rise / Math.hypot(half, rise)
    const innerApex = r3(0, -h, Z_APEX - FRAME / cosA)
    for (const sg of [-1, 1]) {
      const footO = r3(sg * half, -h, zf), footI = r3(sg * (half - FRAME / sinA), -h, zf)
      raised(trim, [footO, ridgeF, innerApex, footI], out, .7)
    }
    // a sill across the gable's foot
    const SILL = 1.3, inset = SILL / Math.tan(Math.atan2(rise, half))
    raised(trim, [r3(-half, -h, zf), r3(half, -h, zf), r3(half - inset, -h, zf + SILL), r3(-half + inset, -h, zf + SILL)], out, .5)
    // the inner majors carry on up the block and into the gable, ending
    // under the frame; the outer ones end at the block's corners in caps
    for (const m of [-3.9, 3.9]) {
      const s0 = m - PIER_W / 2, s1 = m + PIER_W / 2
      raised(stone, [P(F, s0, Z_HOOD), P(F, s1, Z_HOOD), P(F, s1, zIn(s1)), P(F, s0, zIn(s0))], F.n, PIER_T)
    }
    for (const m of [-11.7, 11.7]) pier(F, m - PIER_W / 2, Math.sign(m) * half, Z_HOOD, zf + 1.5)
    // a pointed arch in the middle bay, between the inner majors
    const legZ = zf + SILL + 3.5, archTop = Z_APEX - FRAME / cosA - 2.2
    for (const sg of [-1, 1]) {
      rib(trim, P(F, sg * 3.0, zf + SILL), P(F, sg * 3.0, legZ), F.n, .7, .45)
      rib(trim, P(F, sg * 3.0, legZ), P(F, 0, archTop), F.n, .7, .45)
    }
    rib(trim, P(F, 0, zf + SILL), P(F, 0, archTop), F.n, .5, .3)
    // the shaft's stone shoulders either side of the block, at the hood
    deck.quad(at(r([BLOCK_A, -h]), Z_HOOD), at(r([A - CH, -h]), Z_HOOD), at(r([A, -h + CH]), Z_HOOD), at(r([BLOCK_A, -h + CH]), Z_HOOD))
    deck.quad(at(r([BLOCK_A, -h + CH]), Z_HOOD), at(r([A, -h + CH]), Z_HOOD), at(r([A, yb]), Z_HOOD), at(r([BLOCK_A, yb]), Z_HOOD))
    deck.quad(at(r([-A + CH, -h]), Z_HOOD), at(r([-BLOCK_A, -h]), Z_HOOD), at(r([-BLOCK_A, yb]), Z_HOOD), at(r([-A, yb]), Z_HOOD))
    deck.tri(at(r([-A + CH, -h]), Z_HOOD), at(r([-A, yb]), Z_HOOD), at(r([-A, -h + CH]), Z_HOOD))
    // Wings: each notch's two outer stone corners flare out and up into a
    // pointed silver wing, at its head and again at its foot, all leaning
    // towards the south-east corner, (+x, −y) in this frame.
    for (const c1 of [[A - .9, -h + .9], [h - .9, -A + .9]] as XY[]) wing(r3, c1, Z_HOOD, 7, 2.4)
    for (const c1 of [[A - .9, -h0 + .9], [h0 - .9, -A + .9]] as XY[]) wing(r3, c1, Z_NOTCH0, 5, 1.6)
  }
  // the hip roof: pale glass, pleated with bright ribs from the eaves up
  const R = h - D1
  const base = [0, 1, 2, 3].map((s) => T(rot([R, -R], s)))
  const top = [0, 1, 2, 3].map((s) => T(rot([ROOF_TOP, -ROOF_TOP], s)))
  const lerp3 = (a: V, b: V, t: number): V => add(a, add(b, a, -1), t)
  for (let i = 0; i < 4; i++) {
    const j = (i + 3) % 4 // corners run SE, NE, NW, SW; face i spans corner j → i
    const b0 = at(base[j], Z_HOOD), b1 = at(base[i], Z_HOOD), t1 = at(top[i], Z_ROOF), t0 = at(top[j], Z_ROOF)
    roof.quad(b0, b1, t1, t0)
    const n = normal(b0, b1, t1)
    const lift = (p: V): V => add(p, n, .05)
    const mb = lerp3(b0, b1, .5)
    for (const [cb, ct] of [[b0, t0], [b1, t1]] as [V, V][]) {
      // the hip itself, half a rib on each facet
      const inward = unit(add(mb, cb, -1))
      raised(trim, [lift(cb), lift(ct), lift(add(ct, inward, .7)), lift(add(cb, inward, .7))], n, .35)
    }
    // pleats: ribs straight up the facet from the eave to the top square
    for (let k = 1; k < 9; k++) rib(trim, lift(lerp3(b0, b1, k / 9)), lift(lerp3(t0, t1, k / 9)), n, 1.0, .35)
  }
  cap(deck, top, Z_ROOF, C)
  const lr = [0, 1, 2, 3].map((s) => T(rot([LANTERN, -LANTERN], s)))
  lr.forEach((a, i) => wall(trim, a, lr[(i + 1) % 4], Z_ROOF, PEAK - 2))
  lr.forEach((a, i) => roof.tri(at(a, PEAK - 2), at(lr[(i + 1) % 4], PEAK - 2), at(C, PEAK)))
}

// ---------- podiums ----------
// Footprints from the OSM outline; heights from lidar (54-59 m). Windows in
// pairs between granite piers, three floors to a panel, and a crenellated
// parapet: a pier cap standing over every second pier.
const P_BAY = 4.2, P_WIN = 2.2
function podium(ring: XY[], z1: number, c: XY) {
  ring.forEach((a, i) => {
    const b = ring[(i + 1) % ring.length]
    wall(stone, a, b, 0, z1)
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (len < 4) return
    const t: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
    const F = face(L(a, b, .5), L(a, b, .5), 0, z1, t)
    const bays = Math.max(1, Math.round(len / P_BAY)), bay = len / bays
    for (const [lo, hi] of groups(0, z1 - 2.5))
      for (let k = 0; k < bays; k++) {
        const m = -len / 2 + (k + .5) * bay
        panel(windows, F, m - P_WIN / 2, m + P_WIN / 2, lo, hi)
      }
    // the crenellations: caps 1.4 m wide, 3.2 m tall, every second pier
    for (let k = 0; k <= bays; k += 2) {
      const m = -len / 2 + k * bay, s0 = Math.max(-len / 2, m - 1.1), s1 = Math.min(len / 2, m + 1.1)
      raised(stone, [P(F, s0, z1 - 6), P(F, s1, z1 - 6), P(F, s1, z1 + 4.5), P(F, s0, z1 + 4.5)], F.n, .8)
      // its top, so the cap reads as a block from above
      trim.quad(P(F, s0, z1 + 4.5), P(F, s1, z1 + 4.5), P(F, s1, z1 + 4.5, .8), P(F, s0, z1 + 4.5, .8))
    }
  })
  cap(deck, ring, z1, c)
}
podium([[-27.8, 10], [28, 10], [28.1, 48.9], [21.5, 56.7], [-22, 56.2], [-21.9, 50.3], [-27.6, 50.3]], 57, [0, 33])
podium([[-27.9, -57], [8, -57], [8, -44], [-27.9, -44]], 55, [-10, -50])
podium([[8, -57], [25.8, -57], [25.8, -44], [8, -44]], 54, [17, -50])

// ---------- write ----------
// Pale granite, blue glass in two blues (the faces' and the deeper corner
// notches'), bright trim for the gable frames, roof ribs and wings, the
// crown's pale glass, and grey flat roofs.
const parts = [
  { part: stone, material: finish('truist-granite', 0xeeeae2) },
  { part: windows, material: { ...PALETTE.window, color: 0x86a2bf } },
  { part: notch, material: windowVariant(2, 0x6587ae) },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: { ...PALETTE.glass, color: 0xc8d8e4 } },
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
