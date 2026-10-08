/**
 * Mint Museum Uptown, Levine Center for the Arts, Charlotte (Machado
 * Silvetti, 2010) — procedural, CC0-1.0, no textures.
 * bun generators/mint-museum-uptown.ts
 *
 * Map frame: x across the building (the Duke Energy side -x, Levine Avenue of
 * the Arts +x), y from the Tryon front (-y) back towards Church Street (+y),
 * z up, metres. Placed at bearing 318.5°, the long axis of the OSM outline
 * (way/131139755, no building:parts).
 *
 * That outline runs all the way back to Church Street, but its rear 37 m is
 * the footprint of Museum Tower (way/649245473, which shares its nodes and
 * stays drawn from OSM). The museum itself is the front 42 × 60.5 m, and that
 * is what is modelled; the anchor is the centre of that rectangle.
 *
 * The building is a five-storey block clad in buff sandstone folded into big
 * tilted facets. Its identity is the Tryon front: a stone frame round a
 * deep void over the Duke Energy half, roofed by a dark wood soffit that
 * rises towards the street; below the void, a lower stone block with a tall
 * portal, the glass slot of the five-storey atrium beside it running up into
 * the glass across the back of the void; on the Levine half, a projecting
 * mass whose inner edge climbs on a diagonal to the roof, lifted over a
 * glass lobby on a single slim column at the corner. On Levine Avenue: a high
 * window recessed at the front corner, the full-height glass bay under a
 * rust-red panel, a tall slit window and shopfronts.
 *
 * Evidence
 * - Measured, Mecklenburg County 2016 lidar (USGS 3DEP NC Phase 4, 1 m): the
 *   roof at 33.5-34 m over the whole front, the void included (so the void
 *   is roofed, not a notch open to the sky); a screened mechanical yard
 *   about 5 m high in the middle of the roof (also in NAIP). OSM's 31 m and
 *   the old model's open notch were wrong.
 * - Photos: Commons "Mint Museum in uptown Charlotte, North Carolina.jpg"
 *   (Bz3rk, CC BY-SA 3.0), from the Tryon / Levine corner: the front's
 *   proportions (lower block 62% of the height, lobby opening 40%, soffit
 *   rising to within ~2 m of the roof at the front), the column at the
 *   corner, the high Levine window, the glass bay and rust panel; Commons
 *   "MintMuseumCharlotte.JPG" (Prasit Frazee, CC BY-SA 3.0): the portal and
 *   the atrium slot over the entrance steps; Commons "Mint Museum Uptown plaza
 *   lights Late December 26, 2025.jpg" (City Dweller 2, CC BY-SA 4.0).
 * - Estimated: the void's depth (17 m), the lobby's set-back (8 m), the
 *   depth of the folds (up to 5 m, drawn bold so the creases read at phone
 *   size), and the Duke Energy side, which no licensed photo shows: it is
 *   folded stone with no openings.
 * - Colours: golden buff sandstone (~#cdaa74 lit) pulled to palette
 *   lightness; dark-stained wood soffit, kept no darker than charcoal.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const stone = new Part(), roof = new Part(), metal = new Part()
const win = new Part(), glass = new Part(), wood = new Part()

const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
// ---------------------------------------------------------------------------
// Boxes with a material per face and optional rounded chamfers on the four
// vertical edges (sw, se, ne, nw). A chamfer's corners carry the normals of
// the faces either side, so it shades as a soft rounded edge.

type Faces = { s?: Part | null; e?: Part | null; n?: Part | null; w?: Part | null; top?: Part | null; bottom?: Part | null }
function box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number,
  f: Faces = {}, c: [number, number, number, number] = [0, 0, 0, 0]) {
  const S: V3 = [0, -1, 0], E: V3 = [1, 0, 0], N: V3 = [0, 1, 0], W: V3 = [-1, 0, 0]
  const pick = (k: keyof Faces) => (f[k] === undefined ? stone : f[k])
  // Ring counter-clockwise from above: each edge carries its material and
  // the normals at its two ends.
  type Edge = { a: [number, number]; b: [number, number]; p: Part | null; na: V3; nb: V3 }
  const [cs, ce, cn, cw] = c
  const edges: Edge[] = [
    { a: [x0 + cs, y0], b: [x1 - ce, y0], p: pick('s'), na: S, nb: S },
    { a: [x1 - ce, y0], b: [x1, y0 + ce], p: stone, na: S, nb: E },
    { a: [x1, y0 + ce], b: [x1, y1 - cn], p: pick('e'), na: E, nb: E },
    { a: [x1, y1 - cn], b: [x1 - cn, y1], p: stone, na: E, nb: N },
    { a: [x1 - cn, y1], b: [x0 + cw, y1], p: pick('n'), na: N, nb: N },
    { a: [x0 + cw, y1], b: [x0, y1 - cw], p: stone, na: N, nb: W },
    { a: [x0, y1 - cw], b: [x0, y0 + cs], p: pick('w'), na: W, nb: W },
    { a: [x0, y0 + cs], b: [x0 + cs, y0], p: stone, na: W, nb: S },
  ]
  const ring: [number, number][] = []
  for (const e of edges) {
    if (Math.hypot(e.b[0] - e.a[0], e.b[1] - e.a[1]) < 1e-6) continue
    ring.push(e.a)
    if (!e.p) continue
    const A0: V3 = [e.a[0], e.a[1], z0], B0: V3 = [e.b[0], e.b[1], z0], B1: V3 = [e.b[0], e.b[1], z1], A1: V3 = [e.a[0], e.a[1], z1]
    const isChamfer = e.na !== e.nb
    const na = isChamfer ? unit([e.na[0] + e.nb[0] * 0.2, e.na[1] + e.nb[1] * 0.2, 0]) : e.na
    const nb = isChamfer ? unit([e.nb[0] + e.na[0] * 0.2, e.nb[1] + e.na[1] * 0.2, 0]) : e.nb
    e.p.tri(A0, B0, B1, undefined, undefined, undefined, [na, nb, nb])
    e.p.tri(A0, B1, A1, undefined, undefined, undefined, [na, nb, na])
  }
  const top = pick('top'), bottom = f.bottom ?? null
  if (top) for (let i = 1; i < ring.length - 1; i++)
    top.tri([...ring[0], z1], [...ring[i], z1], [...ring[i + 1], z1])
  if (bottom) for (let i = 1; i < ring.length - 1; i++)
    bottom.tri([...ring[0], z0], [...ring[i + 1], z0], [...ring[i], z0])
}

// ---------------------------------------------------------------------------
// A moulding swept round the chamfered outline, for the parapet: each step
// runs from (d0, z0) to (d1, z1), d outward from the wall plane, with a 2D
// normal (out, up) at each end so the bevel rolls from face to top.

type Rect = { x0: number; x1: number; y0: number; y1: number; c: number }
function ring(r: Rect, d: number, z: number) {
  const x0 = r.x0 - d, x1 = r.x1 + d, y0 = r.y0 - d, y1 = r.y1 + d
  const c = Math.max(0.05, r.c + d * 0.414)
  const pts: V3[] = [[x0 + c, y0, z], [x1 - c, y0, z], [x1, y0 + c, z], [x1, y1 - c, z],
    [x1 - c, y1, z], [x0 + c, y1, z], [x0, y1 - c, z], [x0, y0 + c, z]]
  const nrm: V3[] = [[0, -1, 0], [0, -1, 0], [1, 0, 0], [1, 0, 0], [0, 1, 0], [0, 1, 0], [-1, 0, 0], [-1, 0, 0]]
  return { pts, nrm }
}
type Step = { p: Part; d0: number; z0: number; d1: number; z1: number; n0: [number, number]; n1: [number, number] }
function sweep(r: Rect, steps: Step[]) {
  for (const s of steps) {
    const a = ring(r, s.d0, s.z0), b = ring(r, s.d1, s.z1)
    const at = (h: V3, n: [number, number]): V3 => unit([h[0] * n[0], h[1] * n[0], n[1]])
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      const n = [at(a.nrm[i], s.n0), at(a.nrm[j], s.n0), at(a.nrm[j], s.n1), at(a.nrm[i], s.n1)]
      s.p.tri(a.pts[i], a.pts[j], b.pts[j], undefined, undefined, undefined, [n[0], n[1], n[2]])
      s.p.tri(a.pts[i], b.pts[j], b.pts[i], undefined, undefined, undefined, [n[0], n[2], n[3]])
    }
  }
}
const OUT: [number, number] = [1, 0], UP: [number, number] = [0, 1], IN: [number, number] = [-1, 0]

// ---------------------------------------------------------------------------
// Flat polygons and prisms for the carved front, and the crumpled stone.

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A flat polygon fanned from its first point (it must see every edge), wound to face `n`. */
function poly(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    if (dot(cross(sub(b, a), sub(c, a)), n) >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}

/**
 * A prism: a polygon in the x–z plane pushed back from y0 to y1. Only the
 * front face and the listed side faces are drawn; `sides[k]` is the material
 * of the edge from point k to k + 1, or null where a neighbour hides it.
 */
function prism(front: Part | null, pts: [number, number][], y0: number, y1: number, sides: (Part | null)[]) {
  // The outline may be concave, so each side's outward normal comes from the
  // winding (signed area), not from the direction to the centroid.
  const area = pts.reduce((s, P, k) => { const Q = pts[(k + 1) % pts.length]; return s + P[0] * Q[1] - Q[0] * P[1] }, 0)
  const w = Math.sign(area)
  if (front) poly(front, pts.map(([x, z]): V3 => [x, y0, z]), [0, -1, 0])
  pts.forEach((P, k) => {
    const Q = pts[(k + 1) % pts.length], part = sides[k]
    if (!part) return
    const n: V3 = [w * (Q[1] - P[1]), 0, -w * (Q[0] - P[0])]
    poly(part, [[P[0], y0, P[1]], [Q[0], y0, Q[1]], [Q[0], y1, Q[1]], [P[0], y1, P[1]]], n)
  })
}

/**
 * A panel of the sandstone folded into a few big tilted planes: every edge of
 * the outline stays in the wall plane, and the planes meet at an apex sunk
 * `depth` into the wall, so the folds read as the cladding's broad facets and
 * nothing passes the outline. `pts` must all be visible from the apex.
 */
function fold(p: Part, pts: V3[], apex: V3, facing: V3) {
  pts.forEach((P, k) => poly(p, [apex, P, pts[(k + 1) % pts.length]], facing))
}

/**
 * A long side wall at x = `x` (facing ±x), cut by recessed openings. The wall
 * between the openings is split into as few rectangles as possible, each
 * folded into four tilted planes round an apex set off its centre, so the
 * creases run on the diagonal as the real cladding's do. Each opening is a
 * panel of its own material set `depth` into the wall, with stone reveals.
 */
type Opening = { y0: number; y1: number; z0: number; z1: number; p: Part; depth?: number }
function facade(x: number, facing: 1 | -1, y0: number, y1: number, z0: number, z1: number, ops: Opening[], maxDepth = 5) {
  const cuts = (a: number, b: number, vs: number[]) => [...new Set([a, b, ...vs.filter(v => v > a && v < b)])].sort((p, q) => p - q)
  const ys = cuts(y0, y1, ops.flatMap(o => [o.y0, o.y1])), zs = cuts(z0, z1, ops.flatMap(o => [o.z0, o.z1]))
  const open = (y: number, z: number) => ops.some(o => y > o.y0 && y < o.y1 && z > o.z0 && z < o.z1)
  // Each column of the grid becomes its runs of solid wall; neighbouring
  // columns with the same run merge into one wider panel.
  type R = { y0: number; y1: number; z0: number; z1: number }
  const panels: R[] = []
  for (let i = 0; i < ys.length - 1; i++) {
    const cy = (ys[i] + ys[i + 1]) / 2
    for (let j = 0; j < zs.length - 1;) {
      if (open(cy, (zs[j] + zs[j + 1]) / 2)) { j++; continue }
      let k = j
      while (k + 1 < zs.length - 1 && !open(cy, (zs[k + 1] + zs[k + 2]) / 2)) k++
      const r = { y0: ys[i], y1: ys[i + 1], z0: zs[j], z1: zs[k + 1] }
      const prev = panels.find(q => q.y1 === r.y0 && q.z0 === r.z0 && q.z1 === r.z1)
      if (prev) prev.y1 = r.y1
      else panels.push(r)
      j = k + 1
    }
  }
  const n: V3 = [facing, 0, 0]
  for (const r of panels) {
    const w = r.y1 - r.y0, h = r.z1 - r.z0
    // Off-centre apex, alternating side, so neighbouring panels fold differently.
    const t = (Math.round(r.y0 + r.z0) % 2) ? 0.35 : 0.65
    const apex: V3 = [x - facing * Math.min(maxDepth, 0.25 * Math.min(w, h)), r.y0 + w * t, r.z0 + h * (1 - t)]
    fold(stone, [[x, r.y0, r.z0], [x, r.y1, r.z0], [x, r.y1, r.z1], [x, r.y0, r.z1]], apex, n)
  }
  for (const o of ops) {
    const xi = x - facing * (o.depth ?? 0.6)
    poly(o.p, [[xi, o.y0, o.z0], [xi, o.y1, o.z0], [xi, o.y1, o.z1], [xi, o.y0, o.z1]], n)
    if (o.z0 > z0) poly(stone, [[x, o.y0, o.z0], [xi, o.y0, o.z0], [xi, o.y1, o.z0], [x, o.y1, o.z0]], [0, 0, 1])
    if (o.z1 < z1) poly(stone, [[x, o.y0, o.z1], [xi, o.y0, o.z1], [xi, o.y1, o.z1], [x, o.y1, o.z1]], [0, 0, -1])
    poly(stone, [[x, o.y0, o.z0], [xi, o.y0, o.z0], [xi, o.y0, o.z1], [x, o.y0, o.z1]], [0, 1, 0])
    poly(stone, [[x, o.y1, o.z0], [xi, o.y1, o.z0], [xi, o.y1, o.z1], [x, o.y1, o.z1]], [0, -1, 0])
  }
}

// ---------------------------------------------------------------------------
// Plan and section.

const X0 = -21, X1 = 21          // Duke Energy side, Levine Avenue side
const Y0 = -30.25, Y1 = 30.25    // Tryon front, Museum Tower behind
const C = 0.5                    // chamfer on the building's outer corners
const ROOF = 33.4, TOP = 34      // roof membrane, parapet top (lidar)
const YB = Y0 + 17               // back of the void
const ATRIUM = YB - 1.2          // the atrium glass across the back of the void
const XM = 1                     // joint between the lower block and the projecting mass
const SLOT0 = -4.5               // the atrium slot runs from here to XM
const BLOCK = 21                 // top of the lower stone block
const FRAME = X0 + 1.6           // inner face of the frame's Duke Energy side
const XT = 6                     // where the mass's diagonal edge reaches the roof
const SOFFIT_FRONT = 31.8, SOFFIT_BACK = 28  // the wood soffit, rising to the front
const sw: [number, number, number, number] = [C, 0, 0, 0]
const diag = (z: number) => XM + ((z - BLOCK) / (ROOF - BLOCK)) * (XT - XM)

// The body behind the front zone. Its long sides are the facades below.
box(X0, X1, YB, Y1, 0, ROOF, { s: null, e: null, w: null, top: roof }, [0, 0, C, C])

// The lower block in the Duke Energy half, with a tall portal at its foot.
// Its top is the floor of the void, in the soffit's dark wood: in shade in
// reality, it is what shows the void from the usual high view.
const PORTAL0 = X0 + 3.4, PORTAL1 = SLOT0 - 2.6, PORTAL_TOP = 12, PORTAL_BACK = Y0 + 3
// (The corner pier's top is drawn only inside the frame: run out to the wall
// plane, it would show through the Duke Energy side's sunken facets.)
box(X0, PORTAL0, Y0, YB, 0, PORTAL_TOP, { top: null, n: null, w: null }, sw)
box(PORTAL1, SLOT0, Y0, YB, 0, PORTAL_TOP, { top: null, n: null, e: null })
box(PORTAL0, PORTAL1, PORTAL_BACK, YB, 0, PORTAL_TOP, { s: win, e: null, w: null, n: null, top: null })
box(X0, SLOT0, Y0, YB, PORTAL_TOP, BLOCK, { s: null, top: null, bottom: wood, n: null, w: null, e: null })
poly(wood, [[FRAME, Y0, BLOCK], [SLOT0, Y0, BLOCK], [SLOT0, YB, BLOCK], [FRAME, YB, BLOCK]], [0, 0, 1])
// The block's face over the portal, one big plane folded back 3.5 m.
fold(stone, [[X0, Y0, PORTAL_TOP], [SLOT0, Y0, PORTAL_TOP], [SLOT0, Y0, BLOCK], [X0, Y0, BLOCK]], [-9, Y0 + 3.5, 18.5], [0, -1, 0])
// The atrium: a slot of glass from the ground between the block and the mass,
// running up into the glass wall across the back of the void.
box(SLOT0, XM, Y0 + 2.5, ATRIUM, 0, BLOCK, { s: win, e: null, w: null, n: null, top: wood })
poly(win, [[FRAME, ATRIUM, BLOCK], [XM, ATRIUM, BLOCK], [diag(SOFFIT_BACK), ATRIUM, SOFFIT_BACK], [FRAME, ATRIUM, SOFFIT_BACK]], [0, -1, 0])

// The frame's Duke Energy side, and over the void the roof slab with the
// dark wood soffit, rising towards Tryon so it shows from the street as the
// big angled ceiling. The roof runs over it, as the lidar shows.
box(X0, FRAME, Y0, YB, BLOCK, ROOF, { e: stone, w: null, n: null, top: roof }, sw)
{
  const f0 = SOFFIT_FRONT, b0 = SOFFIT_BACK
  poly(wood, [[FRAME, Y0, f0], [XT, Y0, f0], [XT, ATRIUM, b0], [FRAME, ATRIUM, b0]], [0, -(f0 - b0), -(ATRIUM - Y0)])
  poly(stone, [[FRAME, Y0, f0], [diag(f0), Y0, f0], [XT, Y0, ROOF], [FRAME, Y0, ROOF]], [0, -1, 0])
  poly(roof, [[FRAME, Y0, ROOF], [XT, Y0, ROOF], [XT, YB, ROOF], [FRAME, YB, ROOF]], [0, 0, 1])
}

// The projecting mass: its inner edge climbs on a diagonal from the block to
// the roof. Below, it is lifted over a glass lobby: its underside slopes from
// LIFT at the front down to LOBBY at the glass, LOBBY_BACK behind the face,
// and a single slim column holds the corner.
const LIFT = 13.5, LOBBY = 10.5, LOBBY_BACK = Y0 + 8
const massFront: [number, number][] = [[X1 - C, LIFT], [X1 - C, ROOF], [XT, ROOF], [XM, BLOCK], [XM, LIFT]]
prism(null, massFront, Y0, YB, [null, roof, stone, stone, null])
poly(wood, [[XM, Y0, LIFT], [X1, Y0, LIFT], [X1, LOBBY_BACK, LOBBY], [XM, LOBBY_BACK, LOBBY]], [0, -(LIFT - LOBBY), -(LOBBY_BACK - Y0)])
poly(stone, [[XM, Y0, LIFT], [XM, LOBBY_BACK, LOBBY], [XM, LOBBY_BACK, LIFT]], [-1, 0, 0])
poly(stone, [[X1, Y0 + C, LIFT], [X1, LOBBY_BACK, LOBBY], [X1, LOBBY_BACK, LIFT]], [1, 0, 0])
box(XM, X1, LOBBY_BACK, YB, 0, LOBBY, { s: win, w: null, e: null, n: null, top: null })
poly(stone, [[X1 - C, Y0, LIFT], [X1, Y0 + C, LIFT], [X1, Y0 + C, ROOF], [X1 - C, Y0, ROOF]], [1, -1, 0])
{
  const cx = X1 - 1.1, cy = Y0 + 1.1, r = 0.5, seg = 12, top = LIFT - (LIFT - LOBBY) * (cy - Y0) / (LOBBY_BACK - Y0)
  for (let k = 0; k < seg; k++) {
    const a = (k / seg) * 2 * Math.PI, b = ((k + 1) / seg) * 2 * Math.PI
    const na: V3 = [Math.cos(a), Math.sin(a), 0], nb: V3 = [Math.cos(b), Math.sin(b), 0]
    const A0: V3 = [cx + r * na[0], cy + r * na[1], 0], B0: V3 = [cx + r * nb[0], cy + r * nb[1], 0]
    const A1: V3 = [A0[0], A0[1], top], B1: V3 = [B0[0], B0[1], top]
    stone.tri(A0, B0, B1, undefined, undefined, undefined, [na, nb, nb])
    stone.tri(A0, B1, A1, undefined, undefined, undefined, [na, nb, na])
  }
}
// The mass's Tryon face: two big tilted planes, creased on the diagonal from
// the overhang up to the right, as in the photo.
const BAND = 24, XBAND = diag(BAND)
{
  const at = (x: number, z: number): V3 => [x, Y0, z]
  const F: V3 = [0, -1, 0]
  fold(stone, [at(XM, LIFT), at(X1 - C, LIFT), at(X1 - C, BAND), at(XBAND, BAND), at(XM, BLOCK)], [8, Y0 + 4, 17.5], F)
  fold(stone, [at(XBAND, BAND), at(X1 - C, BAND), at(X1 - C, ROOF), at(XT, ROOF)], [13, Y0 + 3.5, 28.5], F)
}

// Levine Avenue side, front to back: the high window recessed at the front
// corner over the lobby; glazing low down; the full-height glass bay under
// its rust-red panel; one tall slit window; the rear shopfronts.
const BAY0 = Y0 + 22, BAY1 = Y0 + 29.5
facade(X1, 1, Y0 + C, LOBBY_BACK, LIFT, ROOF, [
  { y0: Y0 + 1.0, y1: LOBBY_BACK - 0.4, z0: 23.5, z1: 31.5, p: win, depth: 1.2 },
])
facade(X1, 1, LOBBY_BACK, Y1 - C, 0, ROOF, [
  { y0: Y0 + 13, y1: Y0 + 20, z0: 0, z1: 9, p: win, depth: 1 },
  { y0: BAY0, y1: BAY1, z0: 0, z1: 21, p: glass, depth: 1.5 },
  { y0: BAY0, y1: BAY1, z0: 21, z1: 30.5, p: metal, depth: 1.5 },
  { y0: 6, y1: 9.5, z0: 9, z1: 26, p: glass },
  { y0: 2, y1: 28.5, z0: 0, z1: 5, p: win, depth: 1 },
])

// Duke Energy side: no licensed photo shows it, so it is the same folded
// sandstone with no openings, in three big panels (estimated).
// The front panel folds shallower: the frame behind it is only 1.6 m thick.
for (const [ya, yb, d] of [[Y0 + C, -10, 1.4], [-10, 10, 5], [10, Y1 - C, 5]] as [number, number, number][])
  facade(X0, -1, ya, yb, 0, ROOF, [], d)

// The screened mechanical yard on the roof: two blocks 5 m high where the
// lidar shows them (also seen in NAIP).
box(-17, -5, -9, 3, ROOF, ROOF + 5, { top: roof, s: roof, e: roof, n: roof, w: roof }, [0.4, 0.4, 0.4, 0.4])
box(1, 7, -9, -3, ROOF, ROOF + 5, { top: roof, s: roof, e: roof, n: roof, w: roof }, [0.4, 0.4, 0.4, 0.4])

// Parapet round the whole roof: the stone wall runs up to a rounded lip.
const outline: Rect = { x0: X0, x1: X1, y0: Y0, y1: Y1, c: C }
sweep(outline, [
  { p: stone, d0: 0, z0: ROOF, d1: 0, z1: TOP - 0.4, n0: OUT, n1: OUT },
  { p: stone, d0: 0, z0: TOP - 0.4, d1: -0.4, z1: TOP, n0: OUT, n1: UP },
  { p: stone, d0: -0.4, z0: TOP, d1: -0.8, z1: TOP, n0: UP, n1: UP },
  { p: stone, d0: -0.8, z0: TOP, d1: -0.8, z1: ROOF, n0: IN, n1: IN },
])

// Materials. The buff sandstone is the building's identity, so it is a
// finish: the photos' golden buff pulled up to palette lightness. The
// soffit's dark-stained wood is the other defining colour, kept dark enough
// to read but no darker than charcoal; the rust-red panel on Levine Avenue
// is a finish too. The roof membrane, the mechanical screen and the corner
// column are `roof`; the wall openings, the lobby and the atrium glass (dark
// in the void's shade, lit at night) are `window`; the Levine bay and slit
// window read light in the photos, so they are a light `window-2`.
const parts = [
  { part: stone, material: finish('mint-sandstone', 0xdcc298) },
  { part: wood, material: finish('mint-soffit-wood', 0x6b4c39) },
  { part: roof, material: PALETTE.roof },
  { part: metal, material: finish('mint-rust-panel', 0xa8705a) },
  { part: win, material: PALETTE.window },
  { part: glass, material: windowVariant(2, 0xa9bfd1) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Mint Museum Uptown', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 318.5, osm: 'way/131139755', footprint: [X1 - X0, Y1 - Y0], height: ROOF + 5,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/mint-museum-uptown.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
