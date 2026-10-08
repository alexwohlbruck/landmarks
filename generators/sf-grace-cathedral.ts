/**
 * Grace Cathedral, San Francisco — original procedural geometry, CC0-1.0.
 * bun generators/sf-grace-cathedral.ts
 *
 * Frame: built turned to the Nob Hill street grid, BEARING 351. x along the
 * church (+x = the Taylor Street front with the twin towers, which faces east:
 * the cathedral is occidented), y across it (+y = the Sacramento Street side,
 * north), z up, metres. Origin = centroid of the OSM outline way/32946942.
 *
 * Evidence
 * - OSM way/32946942 (outline, height 53) and its parts way/939433954 (the
 *   whole outline again, 28 m), 939433955 (the flèche, 75 m), 939433956 and
 *   939433957 (the towers, 53 m). The OSM outline is ~2.5 m narrower each side
 *   than the lidar at the aisles, towers and transept ends; the lidar wins.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.5 m, in this frame
 *   (/tmp/city/sf/work/sf-grace-cathedral). The site slopes: ground 89 m
 *   NAVD88 along California Street (south-east), 93.5 on the front plaza, 94-98
 *   at the west end. y = 0 is 88.5 m, the lowest ground under the walls.
 *   Above that: nave and chancel x -43..43.5, walls to y ±9.3, eaves 34.4,
 *   ridge 44; aisles x -9..33 out to y ±16, roofs 25-26; transept x -23..-9,
 *   arms to y ±24.5, ridge 42; a polygonal apse r ~9.5 at the west end; towers
 *   x 33..43.5, y ±6.5..±17.3, roofs at 53 (parapet edges read 50-52); the front
 *   screen behind the rose window tops out at 38.5, the gable at 44; the
 *   porch x 43.5..48, y ±4.6, apex 22; the flèche centred at x -16 over the
 *   crossing, an octagon r ~3 to ~56 and the needle's top at 80.
 * - Published (Wikipedia; SF Landmark No. 171 nominations): Episcopal
 *   cathedral, Lewis P. Hobart, built 1928-1964 in reinforced concrete in the
 *   French Gothic manner (after Notre-Dame de Paris); bronze-clad flèche;
 *   Ghiberti "Gates of Paradise" casts in the main portal.
 * - Commons daylight photos: "Grace Cathedral San Francisco 2.jpg" (anonymous,
 *   CC BY-SA 3.0, the south side and front from California St and Taylor),
 *   "Grace Cathedral, San Francisco.jpg" (Supercarwaar, CC BY-SA 4.0, same
 *   corner, wider), "Grace Cathedral (5).JPG" (Chris06, CC BY-SA 4.0, the front
 *   head-on), "Grace Cathedral-Nob Hill-San francisco.jpg" (Yair Haklai, CC
 *   BY-SA 3.0, the front from the north-east), "View of Grace Cathedral from
 *   Huntington Park in San Francisco.jpg" (Junipercypress, CC BY-SA 4.0, the
 *   front from the east), "The spire of Grace Cathedral, San Francisco.JPG"
 *   (HaeB, CC BY-SA 4.0, the flèche and roof close up).
 *
 * Estimated from the photos (scaled to the lidar): the towers' stages
 * (balcony band at 25, two open belfry lancets a face 38.4-49.6, parapet to 53,
 * corner pinnacles to 56),
 * the rose window (r 4.6 at 28, ringed), the arcaded gallery over it, the
 * porch's pointed arch, six aisle bays of a tall lancet and a roundel, a pair
 * of clerestory lancets a bay, the flying buttresses, the transept ends'
 * windows and corner turrets, the flèche's stages. Colours from the photos,
 * pulled to the palette's lightness: pale warm-grey concrete, slate-grey
 * roofs (the NAIP aerial; they read mauve-brown only in low sun), pale flat
 * aisle roofs (NAIP), a dark green-bronze flèche.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const BEARING = 351
const ANCHOR = { lng: -122.41347, lat: 37.79185 }
const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), bronze = new Part(), door = new Part()
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return v.map((n) => n / l) as V3 }

// --- Heights (m above the lowest ground) ---
const EAVE = 34.4, RIDGE = 44, HW = 9.3 // nave/chancel
const AISLE = 16, AISLE_Z = 25.2
const TR0 = -23, TR1 = -9, TRW = 24.5, TR_EAVE = 35, TR_RIDGE = 42 // transept
const APSE_X = -43, FRONT = 43.5
const TW0 = 33, TW1 = FRONT, TV0 = 6.5, TV1 = 17.3, TOWER = 53
const PLAZA = 5.0 // the front plaza, 93.5 m

// --- Helpers ---
type Seg = { a: XY; t: XY; n: XY; len: number }
function seg(a: XY, b: XY): Seg {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
  return { a, t, n: [t[1], -t[0]], len }
}
const P = (g: Seg, s: number, d: number, z: number): V3 => [g.a[0] + g.t[0] * s + g.n[0] * d, g.a[1] + g.t[1] * s + g.n[1] * d, z]
function wall(part: Part, g: Seg, s0: number, s1: number, z0: number, z1: number, d = 0) {
  part.quad(P(g, s0, d, z0), P(g, s1, d, z0), P(g, s1, d, z1), P(g, s0, d, z1))
}
const fan = (part: Part, pts: V3[]) => { for (let i = 1; i < pts.length - 1; i++) part.tri(pts[0], pts[i], pts[i + 1]) }
/** A pointed (equilateral) lancet, flush on the face: sides to the springing, two arcs to the apex. */
function lancet(part: Part, g: Seg, sc: number, w: number, z0: number, z1: number, d = 0, n = 4) {
  const o = d + 0.05, h = w / 2
  const spring = Math.max(z0, z1 - w * Math.sin(Math.PI / 3))
  const pts: V3[] = [P(g, sc - h, o, z0), P(g, sc + h, o, z0)]
  // right arc: centred at the left springing point, radius w, from 0 to 60°
  for (let k = 0; k <= n; k++) { const a = (k / n) * (Math.PI / 3); pts.push(P(g, sc - h + w * Math.cos(a), o, spring + w * Math.sin(a))) }
  for (let k = n - 1; k >= 0; k--) { const a = (k / n) * (Math.PI / 3); pts.push(P(g, sc + h - w * Math.cos(a), o, spring + w * Math.sin(a))) }
  // fan from the centre so the concave-free outline triangulates cleanly
  const c = P(g, sc, o, (z0 + spring) / 2)
  for (let i = 0; i < pts.length; i++) part.tri(c, pts[i], pts[(i + 1) % pts.length])
}
/** A flush disc, or a ring between two radii. */
function disc(part: Part, g: Seg, sc: number, zc: number, r1: number, r0 = 0, d = 0, n = 20) {
  const pt = (r: number, a: number) => P(g, sc + r * Math.cos(a), d + 0.05, zc + r * Math.sin(a))
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * 2 * Math.PI, a1 = ((i + 1) / n) * 2 * Math.PI
    if (r0 <= 0) part.tri(P(g, sc, d + 0.05, zc), pt(r1, a0), pt(r1, a1))
    else part.quad(pt(r0, a0), pt(r0, a1), pt(r1, a1), pt(r1, a0))
  }
}
/** A moulding along a face: (d, z) profile, with end caps. */
function band(part: Part, g: Seg, s0: number, s1: number, prof: [number, number][]) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [d0, z0] = prof[k], [d1, z1] = prof[k + 1]
    part.quad(P(g, s0, d0, z0), P(g, s1, d0, z0), P(g, s1, d1, z1), P(g, s0, d1, z1))
  }
  fan(part, prof.map(([d, z]) => P(g, s0, d, z)))
  fan(part, [...prof].reverse().map(([d, z]) => P(g, s1, d, z)))
}
/** An axis-aligned box with chamfered vertical edges. */
function block(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, ch = 0.3, top: Part | null = part) {
  const r: XY[] = [[x0 + ch, y0], [x1 - ch, y0], [x1, y0 + ch], [x1, y1 - ch], [x1 - ch, y1], [x0 + ch, y1], [x0, y1 - ch], [x0, y0 + ch]]
  for (let i = 0; i < 8; i++) {
    const a = r[i], b = r[(i + 1) % 8]
    part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (top) fan(top, r.map(([x, y]) => [x, y, z1] as V3))
}
/** A solid of revolution about (cx, cy); `seg` sides, smooth unless `flat`. */
function lathe(part: Part, prof: [number, number][], cx: number, cy: number, seg = 8, phase = Math.PI / 8, flat = true) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    for (let i = 0; i < seg; i++) {
      const t0 = phase + (i / seg) * 2 * Math.PI, t1 = phase + ((i + 1) / seg) * 2 * Math.PI
      const p = (r: number, z: number, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
      if (flat) {
        if (r1 < 1e-6) part.tri(p(r0, z0, t0), p(r0, z0, t1), [cx, cy, z1])
        else if (r0 < 1e-6) part.tri([cx, cy, z0], p(r1, z1, t1), p(r1, z1, t0))
        else part.quad(p(r0, z0, t0), p(r0, z0, t1), p(r1, z1, t1), p(r1, z1, t0))
        continue
      }
      const dr = r1 - r0, dz = z1 - z0, l = Math.hypot(dr, dz) || 1
      const nn = (t: number): V3 => unit([(Math.cos(t) * dz) / l, (Math.sin(t) * dz) / l, -dr / l])
      part.tri(p(r0, z0, t0), p(r0, z0, t1), p(r1, z1, t1), undefined, undefined, undefined, [nn(t0), nn(t1), nn(t1)])
      part.tri(p(r0, z0, t0), p(r1, z1, t1), p(r1, z1, t0), undefined, undefined, undefined, [nn(t0), nn(t1), nn(t0)])
    }
  }
}
/** A slim octagonal pinnacle: shaft then spire. */
const pinnacle = (part: Part, x: number, y: number, r: number, z0: number, z1: number, z2: number) =>
  lathe(part, [[r, z0], [r, z1], [r * 1.15, z1 + 0.2], [0, z2]], x, y, 8)

/**
 * A gabled hall along x (or along y with `alongY`), centred across at `c`:
 * side walls to the eaves, gable ends, and the roof planes with a small
 * overhang.
 */
function hall(a0: number, a1: number, c: number, hw: number, eave: number, ridge: number, alongY: boolean, ends: [boolean, boolean], cornice = true) {
  // (a, b) -> map: along x, or turned a quarter so a runs along +y and b along -x
  const M = (a: number, b: number, z: number): V3 => (alongY ? [c - b, a, z] : [a, c + b, z])
  stone.quad(M(a0, -hw, 0), M(a1, -hw, 0), M(a1, -hw, eave), M(a0, -hw, eave))
  stone.quad(M(a1, hw, 0), M(a0, hw, 0), M(a0, hw, eave), M(a1, hw, eave))
  if (ends[1]) { stone.quad(M(a1, -hw, 0), M(a1, hw, 0), M(a1, hw, eave), M(a1, -hw, eave)); stone.tri(M(a1, -hw, eave), M(a1, hw, eave), M(a1, 0, ridge)) }
  if (ends[0]) { stone.quad(M(a0, hw, 0), M(a0, -hw, 0), M(a0, -hw, eave), M(a0, hw, eave)); stone.tri(M(a0, hw, eave), M(a0, -hw, eave), M(a0, 0, ridge)) }
  const o = 0.5, ez = eave - (o * (ridge - eave)) / hw
  roof.quad(M(a0, -hw - o, ez), M(a1, -hw - o, ez), M(a1, 0, ridge + 0.05), M(a0, 0, ridge + 0.05))
  roof.quad(M(a1, hw + o, ez), M(a0, hw + o, ez), M(a0, 0, ridge + 0.05), M(a1, 0, ridge + 0.05))
  roof.quad(M(a1, -hw - o, ez), M(a0, -hw - o, ez), M(a0, -hw, eave), M(a1, -hw, eave))
  roof.quad(M(a0, hw + o, ez), M(a1, hw + o, ez), M(a1, hw, eave), M(a0, hw, eave))
  if (!cornice) return
  trim.quad(M(a0, -hw - 0.3, eave - 1.0), M(a1, -hw - 0.3, eave - 1.0), M(a1, -hw - 0.3, eave), M(a0, -hw - 0.3, eave))
  trim.quad(M(a1, hw + 0.3, eave - 1.0), M(a0, hw + 0.3, eave - 1.0), M(a0, hw + 0.3, eave), M(a1, hw + 0.3, eave))
}
/** A sloping bar of rectangular section from A to B, `w` wide across x and `t` deep, for flying buttresses. */
function strut(part: Part, x: number, w: number, A: [number, number], B: [number, number], t: number) {
  const c = (y: number, z: number, sx: number, sz: number): V3 => [x + (sx * w) / 2, y, z + (sz * t) / 2]
  const [ya, za] = A, [yb, zb] = B
  const flip = yb < ya // keep the faces facing out whichever way the bar runs
  const q = (a: V3, b: V3, cc: V3, d: V3) => (flip ? part.quad(b, a, d, cc) : part.quad(a, b, cc, d))
  q(c(ya, za, -1, 1), c(ya, za, 1, 1), c(yb, zb, 1, 1), c(yb, zb, -1, 1)) // top
  q(c(ya, za, 1, -1), c(ya, za, -1, -1), c(yb, zb, -1, -1), c(yb, zb, 1, -1)) // bottom
  q(c(ya, za, 1, 1), c(ya, za, 1, -1), c(yb, zb, 1, -1), c(yb, zb, 1, 1)) // east
  q(c(ya, za, -1, -1), c(ya, za, -1, 1), c(yb, zb, -1, 1), c(yb, zb, -1, -1)) // west
}

// ---------------------------------------------------------------------------
// Nave and chancel under one roof from the apse to the front; the transept across.
hall(APSE_X, FRONT - 0.6, 0, HW, EAVE, RIDGE, false, [false, true])
const TRC = (TR0 + TR1) / 2, TRH = (TR1 - TR0) / 2
hall(-TRW, TRW, TRC, TRH, TR_EAVE, TR_RIDGE, true, [true, true])

// The apse: half a ten-sided polygon round the west end, roofed as a half cone.
{
  const n = 5, ring = (r: number, z: number) => Array.from({ length: n + 1 }, (_, k) => {
    const a = Math.PI / 2 + (k * Math.PI) / n
    return [APSE_X + r * Math.cos(a), r * Math.sin(a), z] as V3
  })
  const b = ring(HW, 0), t = ring(HW, EAVE), o = 0.5, e = ring(HW + o, EAVE - (o * (RIDGE - EAVE)) / HW)
  const apex: V3 = [APSE_X, 0, RIDGE + 0.05]
  for (let k = 0; k < n; k++) {
    stone.quad(b[k], b[k + 1], t[k + 1], t[k])
    roof.tri(e[k], e[k + 1], apex)
    roof.quad(t[k + 1], t[k], e[k], e[k + 1])
    const g = seg([b[k][0], b[k][1]], [b[k + 1][0], b[k + 1][1]])
    band(trim, g, -0.2, g.len + 0.2, [[0, EAVE - 1.0], [0.3, EAVE - 1.0], [0.3, EAVE], [0, EAVE]])
    lancet(win, g, g.len / 2, 2.4, 13, 29)
    // a buttress at each angle
    if (k > 0) {
      const a = Math.PI / 2 + (k * Math.PI) / n, cx = APSE_X + (HW + 0.6) * Math.cos(a), cy = (HW + 0.6) * Math.sin(a)
      lathe(stone, [[0.9, 0], [0.9, 30], [0, 33]], cx, cy, 4, a + Math.PI / 4)
    }
  }
}

// Aisles along the nave, each with six bays of a tall lancet and a roundel,
// buttress piers between them carrying flying buttresses to the clerestory.
const BAYS = [-5.5, 1.5, 8.5, 15.5, 22.5, 29.5]
for (const side of [1, -1]) {
  const yo = side * AISLE, yi = side * HW
  const outer = side > 0 ? seg([TW0, yo], [TR1, yo]) : seg([TR1, yo], [TW0, yo])
  const sOf = (x: number) => (side > 0 ? TW0 - x : x - TR1)
  wall(stone, outer, 0, outer.len, 0, AISLE_Z)
  // lean-to roof from the clerestory wall down to the parapet
  const r0: V3 = [TR1, yi, AISLE_Z + 1.2], r1: V3 = [TW0, yi, AISLE_Z + 1.2], r2: V3 = [TW0, yo, AISLE_Z - 0.2], r3: V3 = [TR1, yo, AISLE_Z - 0.2]
  if (side > 0) stone.quad(r3, r2, r1, r0); else stone.quad(r0, r1, r2, r3)
  band(trim, outer, 0, outer.len, [[0, AISLE_Z - 1.0], [0.3, AISLE_Z - 1.0], [0.3, AISLE_Z + 0.5], [0, AISLE_Z + 0.5]])
  for (const xc of BAYS) {
    lancet(win, outer, sOf(xc), 2.4, 4.5, 18.5)
    disc(win, outer, sOf(xc), 21.2, 1.25, 0, 0, 12)
    // the clerestory's paired lancets
    const cl = side > 0 ? seg([TW0, yi], [APSE_X, yi]) : seg([APSE_X, yi], [TW0, yi])
    const cs = (x: number) => (side > 0 ? TW0 - x : x - APSE_X)
    lancet(win, cl, cs(xc - 1.3), 1.5, 27.6, 32.8)
    lancet(win, cl, cs(xc + 1.3), 1.5, 27.6, 32.8)
  }
  for (const xp of [-2, 5, 12, 19, 26]) {
    const y0 = side > 0 ? AISLE : -AISLE - 1.3, y1 = side > 0 ? AISLE + 1.3 : -AISLE
    block(stone, xp - 0.8, xp + 0.8, y0, y1, 0, 27.4, 0.3, stone)
    pinnacle(stone, xp, side * (AISLE + 0.65), 0.6, 27.4, 28.6, 31.2)
    strut(stone, xp, 0.8, [side * (AISLE - 0.2), 27.2], [side * (HW + 0.05), 31.6], 1.0)
  }
}
// The chancel's tall lancets, three a side.
for (const side of [1, -1]) {
  const g = side > 0 ? seg([TR0, HW], [APSE_X, HW]) : seg([APSE_X, -HW], [TR0, -HW])
  for (const xc of [-39.7, -33, -26.3]) lancet(win, g, side > 0 ? TR0 - xc : xc - APSE_X, 2.6, 13, 29.5)
}

// The transept ends: a great lancet, a roundel in the gable, corner turrets;
// tall lancets along the arms where no aisle covers them.
for (const side of [1, -1]) {
  const y = side * TRW
  const end = side > 0 ? seg([TR1, y], [TR0, y]) : seg([TR0, y], [TR1, y])
  lancet(win, end, end.len / 2, 5.6, 11, 30, 0, 6)
  disc(win, end, end.len / 2, 37.6, 1.5, 0, 0, 12)
  band(trim, end, 0, end.len, [[0, 9.4], [0.3, 9.4], [0.3, 10.2], [0, 10.2]])
  for (const x of [TR0, TR1]) pinnacle(stone, x, y, 1.3, 0, 38.6, 43)
  const east = side > 0 ? seg([TR1, AISLE], [TR1, TRW]) : seg([TR1, -TRW], [TR1, -AISLE])
  lancet(win, east, east.len / 2 + (side > 0 ? -0.4 : 0.4), 2.4, 8, 24)
  const west = side > 0 ? seg([TR0, TRW], [TR0, HW]) : seg([TR0, -HW], [TR0, -TRW])
  lancet(win, west, west.len / 2, 2.4, 14, 30)
}

// ---------------------------------------------------------------------------
// The front: the twin towers, the screen with the rose window, the porch.
for (const side of [1, -1]) {
  const ya = side > 0 ? TV0 : -TV1, yb = side > 0 ? TV1 : -TV0
  const C = 2.0, B = 0.4 // corner buttress size and projection
  block(stone, TW0 + B, TW1 - B, ya + B, yb - B, 0, TOWER, 0.4, roof)
  // corner buttresses, with pinnacles above the parapet
  for (const [x0, x1] of [[TW0, TW0 + C], [TW1 - C, TW1]]) for (const [y0, y1] of [[ya, ya + C], [yb - C, yb]]) {
    block(stone, x0, x1, y0, y1, 0, TOWER - 0.6, 0.5, stone)
    pinnacle(trim, (x0 + x1) / 2, (y0 + y1) / 2, 0.7, TOWER - 0.6, TOWER + 0.9, TOWER + 3.0)
  }
  // the parapet's cornice
  block(trim, TW0 + B - 0.25, TW1 - B + 0.25, ya + B - 0.25, yb - B + 0.25, TOWER - 2.9, TOWER - 2.2, 0.3, null)
  const faces = [
    seg([TW1 - B, ya + B], [TW1 - B, yb - B]), // east
    seg([TW0 + B, yb - B], [TW0 + B, ya + B]), // west
    side > 0 ? seg([TW1 - B, yb - B], [TW0 + B, yb - B]) : seg([TW0 + B, ya + B], [TW1 - B, ya + B]), // outer
    side > 0 ? seg([TW0 + B, ya + B], [TW1 - B, ya + B]) : seg([TW1 - B, yb - B], [TW0 + B, yb - B]), // inner
  ]
  faces.forEach((g, i) => {
    const m = g.len / 2
    for (const d of [-1.75, 1.75]) {
      lancet(win, g, m + d, 2.7, 38.4, 49.6) // the open belfry
      lancet(win, g, m + d, 1.3, 34.4, 37.2) // small lancets under it
      if (i !== 3) lancet(trim, g, m + d, 2.7, 26.4, 33.0) // blind arcade
    }
    if (i === 0 || i === 2) band(trim, g, 0, g.len, [[0, 24.6], [0.4, 24.6], [0.4, 25.6], [0, 25.6]]) // balcony
  })
  // side doors in the towers' bases, at the plaza
  wall(door, faces[0], faces[0].len / 2 - 1.1, faces[0].len / 2 + 1.1, PLAZA, PLAZA + 3.8, 0.06)
  lancet(trim, faces[0], faces[0].len / 2, 3.2, PLAZA + 3.8, PLAZA + 7.4)
}
{
  // The screen between the towers: gallery, rose window, porch.
  block(stone, FRONT - 1.4, FRONT, -TV0, TV0, 0, 38.6, 0.01, stone)
  const g = seg([FRONT, -TV0], [FRONT, TV0])
  const m = g.len / 2
  for (let k = -3; k <= 3; k++) lancet(win, g, m + k * 1.75, 1.15, 34.6, 37.9)
  band(trim, g, 0, g.len, [[0, 33.6], [0.3, 33.6], [0.3, 34.2], [0, 34.2]])
  disc(trim, g, m, 28.0, 5.1, 4.35, 0, 20)
  disc(win, g, m, 28.0, 4.35, 0, 0, 20)
  disc(trim, g, m, 28.0, 1.0, 0, 0.02, 10)
  band(trim, g, 0, g.len, [[0, 22.3], [0.3, 22.3], [0.3, 22.9], [0, 22.9]])
  // the porch: a gabled bay in front of the main doors
  const PX = 48, PH = 4.6
  hall(FRONT - 0.5, PX, 0, PH, 15.2, 22, false, [false, true], false)
  const pf = seg([PX, -PH], [PX, PH])
  lancet(win, pf, PH, 6.0, PLAZA, 15.6, 0, 6)
  wall(door, pf, PH - 1.8, PH + 1.8, PLAZA, PLAZA + 6.2, 0.08)
  for (const y of [-PH, PH]) pinnacle(stone, PX, y, 0.65, 0, 17.6, 21.4)
  for (const side of [-1, 1]) {
    const sg = side > 0 ? seg([PX, PH], [FRONT, PH]) : seg([FRONT, -PH], [PX, -PH])
    lancet(win, sg, sg.len / 2, 1.6, PLAZA + 2, 12.5)
  }
}

// ---------------------------------------------------------------------------
// The flèche over the crossing: octagonal base, open lantern, needle.
{
  const cx = TRC, cy = 0
  lathe(bronze, [[2.3, 40], [2.3, 55.4], [2.6, 55.7], [2.6, 56.4], [2.0, 56.4], [2.0, 62.0], [2.3, 62.3], [2.3, 62.8], [1.6, 63.4], [0.12, 79.4], [0, 80.2]], cx, cy, 8)
  for (let i = 0; i < 8; i++) {
    const a = Math.PI / 8 + ((i + 0.5) / 8) * 2 * Math.PI
    // a dark opening on each face of the octagon, flush on it
    const r = 2.0 * Math.cos(Math.PI / 8) + 0.05
    const p = (t: number, z: number): V3 => {
      const nx = Math.cos(a), ny = Math.sin(a), tx = -ny, ty = nx
      return [cx + nx * r + tx * t, cy + ny * r + ty * t, z]
    }
    win.quad(p(-0.42, 57.0), p(0.42, 57.0), p(0.42, 61.4), p(-0.42, 61.4))
  }
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + (i * Math.PI) / 2
    pinnacle(bronze, cx + 2.3 * Math.cos(a), cy + 2.3 * Math.sin(a), 0.26, 56.4, 59.6, 63.0)
  }
}

// Close the bottom so the shadow pass sees a solid.
stone.quad([APSE_X, -AISLE, 0], [APSE_X, AISLE, 0], [TW1, AISLE, 0], [TW1, -AISLE, 0])

const parts = [
  { part: stone, material: finish('grace-concrete', 0xe4e0d6) },
  { part: trim, material: finish('grace-trim', 0xf1eee7) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: bronze, material: finish('grace-fleche', 0x667470) },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Grace Cathedral', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 80.2,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/32946942', 'way/939433954', 'way/939433955', 'way/939433956', 'way/939433957'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-grace-cathedral.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
