/**
 * Hoover Dam Visitor Center (U.S. Bureau of Reclamation, opened 1995), on the
 * Nevada side of the canyon just downstream of the dam's crest.
 * Procedural, CC0-1.0. bun generators/lv-hoover-dam-visitor-center.ts
 *
 * What it is: a pale concrete drum, about 34 m across, standing out of the
 * canyon wall with its flat roof as the open overlook terrace, a parapet all
 * round; on its north side, facing the plaza, a bronze-glass block that steps
 * up in terraces toward the north-east, ending in an octagonal glass tower
 * under an octagonal patina dome with a finial. The plaza cuts a V into the
 * drum's north side: the glass faces line the V.
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (OSM's orientation).
 * Origin: the lead's anchor for way/89604268 (-114.739352, 36.016137).
 * y = 0 is 322.2 m NAVD88: the map stands the model on the lowest of its
 * 7 x 7 terrain grid over the model's bounds (tools/terrain.ts check), which
 * falls on the slope south-east of the drum. The terrain inside the outline
 * is no lower than about 345 m, so the drum's base runs on down under the
 * ground. elevation 0: the uphill (north) walls sink into the plaza.
 *
 * Sources
 * - OSM way/89604268 "Hoover Dam Visitor Center" (building=yes, no height):
 *   the drum's outline, the V notch from the plaza, and the round appendix
 *   to the north-east (the dome tower).
 * - USGS 3DEP lidar AZ_LowerColoradoRiver_B1_2018 (tools/lidar.py, 1 m),
 *   first returns, NAVD88: plaza 377 m; drum roof terrace 384.5 m, parapet
 *   385-386 m; glass block terraces 388.5 m, then 390 m next to the tower;
 *   tower walls 393 m, dome to 397 m, finial cell 400 m; tower 14 m across.
 *   The lidar features sit about 2.5 m east and 2 m south of the OSM outline:
 *   the model is drawn halfway between.
 * - Mapterhorn z15 (tools/terrain.ts): the terrain falls from the plaza
 *   (about 376.7 m) to about 345 m under the drum's south side.
 * - Photos (Wikimedia Commons):
 *   "Hoover Dam from Memorial Bridge.jpg", Noah Wulf, CC BY-SA 4.0
 *     https://commons.wikimedia.org/wiki/File:Hoover_Dam_from_Memorial_Bridge.jpg
 *     (from downstream: the plain concrete drum, the stepped glass block,
 *     the tower and its patina dome);
 *   "Hoover Dam, Nevada (Arizona-Nevada, USA) -- 2012 -- 6132.jpg", Dietmar
 *     Rabich, CC BY-SA 4.0
 *     https://commons.wikimedia.org/wiki/File:Hoover_Dam,_Nevada_(Arizona-Nevada,_USA)_--_2012_--_6132.jpg
 *     (the bronze-glass faces from the plaza, about three storeys);
 *   "Hoover Dam Visitor's Center.jpg", Michael180 (ThePlaz), CC BY-SA 2.5
 *     https://commons.wikimedia.org/wiki/File:Hoover_Dam_Visitor%27s_Center.jpg
 *     (the glass close on: bronze reflective panes in a pink-tan frame grid);
 *   "Hoover Dam Visitor Center and Exhibits - DSC3637 HDR - panoramio.jpg",
 *     Robert Dimov, CC BY-SA 3.0
 *     https://commons.wikimedia.org/wiki/File:Hoover_Dam_Visitor_Center_and_Exhibits_-_DSC3637_HDR_-_panoramio.jpg
 *     (the glass block and tower from the road).
 *
 * Measured (lidar): every height above, the tower's size and place, the
 * block's plan (about 8 m deep along the V's east arm). Measured (OSM): the
 * drum's radius (16-17 m; drawn 16.8) and the V. Estimated: the frame-grid
 * lines (drawn every storey, about 3.7 m, as pale bands), the dome's profile
 * (photo), the parapet's 1.5 m, the finial's size, the three terrace steps
 * (lidar shows 387.5-390 m in one band; the photo shows the steps). Doubts:
 * the drum's wall runs on down to y = 0, under the map's terrain (the real
 * wall meets the rock at about 338-345 m); the NW arc's finish above the plaza is not photographed
 * (drawn concrete); the parking structure way/89604273 is a separate
 * building 120 m west and is not part of this model.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save } from './lv-wynn'

const DEG = Math.PI / 180
type XY = [number, number]

// ---- heights: NAVD88 metres less BASE --------------------------------------------
/** y = 0: the lowest of the map's 7 x 7 terrain grid over the model's bounds (tools/terrain.ts check). */
const BASE = 322.2
const PLAZA = 377 - BASE
const DECK = 384.5 - BASE // the overlook terrace
const PARAPET = 386 - BASE
const STEPS: [number, number, number][] = [[-6, 4, 387.8 - BASE], [4, 12, 389 - BASE], [12, 21, 390.3 - BASE]] // s from, s to, top
const TOWER = 393 - BASE
const DOME = 397.2 - BASE
const FINIAL = 400.5 - BASE

// ---- plan ---------------------------------------------------------------------
const C: XY = [-3.5, -7] // drum centre
const R = 16.8
const V: XY = [-5.5, -1.5] // the plaza notch's vertex
const WEST: XY = [-0.72, 0.694] // the notch's arms, from V outward
const EAST: XY = [0.733, 0.68]
const T: XY = [15, 14.5] // tower centre
const TR = 7

const CONCRETE: MaterialSpec = finish('hoover-concrete', 0xe9dfcd)
const BRONZE: MaterialSpec = { ...PALETTE.window, color: 0x97765f }
const FRAME: MaterialSpec = finish('vc-frame', 0xd4b59c)
const DECKM: MaterialSpec = finish('hoover-roof-deck', 0xe4e0d8)
const PATINA: MaterialSpec = PALETTE.patina

const concrete = new Part(), glass = new Part(), frame = new Part(), deck = new Part(), patina = new Part()

const cross2 = (a: XY, b: XY) => a[0] * b[1] - a[1] * b[0]
/** Where the ray V + t·d meets the drum's circle. */
function hit(d: XY): number {
  const ox = V[0] - C[0], oy = V[1] - C[1]
  const b = ox * d[0] + oy * d[1], c = ox * ox + oy * oy - R * R
  return -b + Math.sqrt(b * b - c)
}
const angle = (p: XY) => Math.atan2(p[1] - C[1], p[0] - C[0])

/** The drum's outline, counter-clockwise from above: the arc from the notch's west arm round the south to its east arm, then V. */
function drumOutline(): XY[] {
  const pw: XY = [V[0] + WEST[0] * hit(WEST), V[1] + WEST[1] * hit(WEST)]
  const pe: XY = [V[0] + EAST[0] * hit(EAST), V[1] + EAST[1] * hit(EAST)]
  let a0 = angle(pw), a1 = angle(pe)
  while (a1 <= a0) a1 += 2 * Math.PI
  const n = 26
  const pts: XY[] = []
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n
    pts.push(i === 0 ? pw : i === n ? pe : [C[0] + R * Math.cos(a), C[1] + R * Math.sin(a)])
  }
  pts.push(V)
  return pts
}

/** Offset a counter-clockwise ring inward by `d` (miter). */
function inset(ring: XY[], d: number): XY[] {
  const n = ring.length
  return ring.map((p, i) => {
    const a = ring[(i - 1 + n) % n], b = ring[(i + 1) % n]
    const e1 = norm([p[0] - a[0], p[1] - a[1]]), e2 = norm([b[0] - p[0], b[1] - p[1]])
    const n1: XY = [-e1[1], e1[0]], n2: XY = [-e2[1], e2[0]] // left normals = inward for CCW
    const m = norm([n1[0] + n2[0], n1[1] + n2[1]])
    const k = d / Math.max(0.3, m[0] * n1[0] + m[1] * n1[1])
    return [p[0] + m[0] * k, p[1] + m[1] * k]
  })
}
function norm(v: XY): XY {
  const l = Math.hypot(v[0], v[1]) || 1
  return [v[0] / l, v[1] / l]
}
const at = (r: XY[], z: number): V3[] => r.map(([x, y]) => [x, y, z])

/** Fan cap over a ring that is star-shaped about `c`. */
function fan(p: Part, ring: XY[], c: XY, z: number, up = true) {
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    if (up) p.tri([c[0], c[1], z], [a[0], a[1], z], [b[0], b[1], z])
    else p.tri([c[0], c[1], z], [b[0], b[1], z], [a[0], a[1], z])
  }
}

/** One wall face of a ring edge between two heights, on `p`. */
function wall(p: Part, a: XY, b: XY, z0: number, z1: number, out = 0) {
  const e = norm([b[0] - a[0], b[1] - a[1]]), o: XY = [e[1] * out, -e[0] * out]
  p.quad([a[0] + o[0], a[1] + o[1], z0], [b[0] + o[0], b[1] + o[1], z0], [b[0] + o[0], b[1] + o[1], z1], [a[0] + o[0], a[1] + o[1], z1])
}
/** A pale frame band proud of a glass face, with its top and bottom lips. */
function band(a: XY, b: XY, z0: number, z1: number, out = 0.12) {
  const e = norm([b[0] - a[0], b[1] - a[1]]), o: XY = [e[1] * out, -e[0] * out]
  const A: XY = [a[0] + o[0], a[1] + o[1]], B: XY = [b[0] + o[0], b[1] + o[1]]
  wall(frame, a, b, z0, z1, out)
  frame.quad([a[0], a[1], z1], [A[0], A[1], z1], [B[0], B[1], z1], [b[0], b[1], z1])
  frame.quad([a[0], a[1], z0], [b[0], b[1], z0], [B[0], B[1], z0], [A[0], A[1], z0])
}

// ---- the drum -------------------------------------------------------------------
const outline = drumOutline()
const n = outline.length
const inner = inset(outline, 0.6)
const arcEdges = n - 2 // the last two edges are the notch's arms
for (let i = 0; i < n; i++) {
  const a = outline[i], b = outline[(i + 1) % n]
  if (i < arcEdges) {
    // the concrete drum, in two lifts so the terrain-draped base stays short
    wall(concrete, a, b, 0, 4)
    wall(concrete, a, b, 4, PARAPET - 0.4)
  } else {
    // the notch's faces: buried concrete under the plaza, glass above it
    wall(concrete, a, b, 0, PLAZA)
    wall(glass, a, b, PLAZA, PARAPET - 0.4)
    band(a, b, PLAZA + 3.7, PLAZA + 4.3)
    band(a, b, DECK - 0.4, PARAPET - 0.4)
  }
}
// parapet: a chamfered top, the inner face and the terrace
const chamfer = inset(outline, 0.4)
for (let i = 0; i < n; i++) {
  const j = (i + 1) % n
  const a = outline[i], b = outline[j], ca = chamfer[i], cb = chamfer[j], ia = inner[i], ib = inner[j]
  concrete.quad([a[0], a[1], PARAPET - 0.4], [b[0], b[1], PARAPET - 0.4], [cb[0], cb[1], PARAPET], [ca[0], ca[1], PARAPET])
  concrete.quad([ca[0], ca[1], PARAPET], [cb[0], cb[1], PARAPET], [ib[0], ib[1], PARAPET], [ia[0], ia[1], PARAPET])
  concrete.quad([ib[0], ib[1], DECK], [ia[0], ia[1], DECK], [ia[0], ia[1], PARAPET], [ib[0], ib[1], PARAPET])
}
fan(deck, inner, C, DECK)

// ---- the stepped glass block along the notch's east arm -------------------------
const SE: XY = [EAST[1], -EAST[0]] // across the block, into the drum
const blk = (s: number, d: number): XY => [V[0] + EAST[0] * s + SE[0] * d, V[1] + EAST[1] * s + SE[1] * d]
const DEPTH = 8
function block(s0: number, s1: number, top: number, base: number, faces: { sw: boolean; ne: boolean }) {
  // corners counter-clockwise from above: NW face is d = 0
  const p = [blk(s0, DEPTH), blk(s1, DEPTH), blk(s1, 0), blk(s0, 0)]
  const edges: [XY, XY, boolean][] = [
    [p[0], p[1], true], // SE face
    [p[1], p[2], faces.ne],
    [p[2], p[3], true], // NW face, on the plaza
    [p[3], p[0], faces.sw],
  ]
  for (const [a, b, show] of edges) {
    if (!show) continue
    wall(glass, a, b, base, top - 1)
    band(a, b, top - 1, top, 0.15)
    for (let z = PLAZA + 3.7; z < top - 2; z += 3.7) if (z > base + 1) band(a, b, z, z + 0.5)
  }
  frame.cap(at(p, top), true)
}
// the NW face runs down to the plaza; inside the drum the block stands on the terrace
for (const [s0, s1, top] of STEPS) block(s0, s1, top, PLAZA, { sw: true, ne: false })
// the block's terrace tops: concrete over the frame cap, set in 0.5 m
for (const [s0, s1, top] of STEPS) {
  const q = [blk(s0 + 0.5, DEPTH - 0.5), blk(s1 - 0.5, DEPTH - 0.5), blk(s1 - 0.5, 0.5), blk(s0 + 0.5, 0.5)]
  deck.cap(at(q, top + 0.02), true)
}

// ---- the dome tower -----------------------------------------------------------
const oct = (r: number, rot = 22.5): XY[] =>
  Array.from({ length: 8 }, (_, i) => {
    const a = (rot + i * 45) * DEG
    return [T[0] + r * Math.cos(a), T[1] + r * Math.sin(a)]
  })
const tw = oct(TR)
for (let i = 0; i < 8; i++) {
  const a = tw[i], b = tw[(i + 1) % 8]
  wall(concrete, a, b, 0, PLAZA)
  wall(glass, a, b, PLAZA, TOWER - 1.4)
  for (const z of [PLAZA + 3.7, PLAZA + 7.4, PLAZA + 11.1]) band(a, b, z, z + 0.5)
  band(a, b, TOWER - 1.4, TOWER, 0.2)
}
frame.cap(at(oct(TR + 0.2), TOWER), true)
// the dome: eight faces curving in to a finial
const prof: [number, number][] = [[7.4, TOWER + 0.3], [6.6, TOWER + 1.3], [5.2, TOWER + 2.5], [3.4, TOWER + 3.5], [1.4, DOME - 0.1], [0.8, DOME]]
const domeRings = prof.map(([r, z]) => at(oct(r), z))
patina.loft(domeRings)
patina.cap(domeRings[domeRings.length - 1], true)
// finial: a slim octagonal mast with a bead
const fin = (r: number, z: number) => at(oct(r), z)
frame.loft([fin(0.8, DOME), fin(0.8, DOME + 1), fin(0.3, DOME + 1.2), fin(0.25, FINIAL - 1)])
frame.loft([fin(0.25, FINIAL - 1), fin(0.6, FINIAL - 0.6), fin(0.6, FINIAL - 0.3), fin(0.1, FINIAL)])

await save('lv-hoover-dam-visitor-center', 'Hoover Dam Visitor Center', [
  { part: concrete, material: CONCRETE },
  { part: deck, material: DECKM },
  { part: glass, material: BRONZE },
  { part: frame, material: FRAME },
  { part: patina, material: PATINA },
], FINIAL, 'Y up, -Z north, +X east, metres; origin at the way/89604268 anchor (-114.739352, 36.016137), on 322.2 m NAVD88; bearing 0')
