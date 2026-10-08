/**
 * Old Post Office (now the Waldorf Astoria Washington DC) — procedural,
 * CC0-1.0, no textures. bun generators/dc-old-post-office.ts
 *
 * Also a small kit for this batch's Penn Quarter models (dc-hoover-building,
 * dc-national-building-museum, dc-house-of-the-temple): the edge-based
 * helpers below are exported and the model is only built when this file is
 * run directly. They sit on the polygon kit in dc-nmaahc.ts.
 *
 * Map frame: x east, y north, z up, metres; bearing 0°, the outline's walls
 * running due north–south and east–west. The anchor is the area centroid of
 * the OSM outline way/66418840 (lng -77.0275777, lat 38.8940953).
 *
 * What it is: Willoughby J. Edbrooke's Richardsonian Romanesque post office
 * (1892–99) in pale grey granite, a block of about nine storeys round a
 * glass-roofed atrium, under steep slate roofs, with its 315 ft clock tower
 * on the Pennsylvania Avenue (north) front. The identifying features, in
 * order: the tower (a plain square shaft, clock faces on all four sides, an
 * arcaded belfry, a corbelled parapet with four round corner turrets, and a
 * steep slate pyramid); the north front's two corner pavilions with tall
 * pyramid roofs and big stone gable dormers; round turrets with conical caps
 * on every corner and either side of each recessed centre; the rock-faced
 * granite base with its three entrance arches under the tower; the dormered
 * slate mansard; and the long glazed atrium roof.
 *
 * Covers and replaces: way/66418840 (the outline, building=hotel),
 * way/452899001 (building:part, the atrium, height 60, hipped) and
 * way/452899002 (building:part, the tower, height 96, pyramidal). The
 * building=roof way/1238674768 is 63 m to the west, a canopy, and is left.
 *
 * Evidence
 * - OSM (measured): the outline, 62.9 × 100.2 m: north front recessed to
 *   y 44.3 between pavilions reaching y 49.6; the 12th Street (west) front
 *   recessed 4.5 m for y -6.5…11.3; the 11th Street (east) front 1.4 m for
 *   y -5.8…11.2; a south projection 30 m wide and 5.3 m deep; round bumps
 *   for the turrets. The tower part x -5.6…5.4, y 32.3…44.3 (11 × 12 m), its
 *   north face in the north front. The atrium part x -14.4…16.7, y -24.5…32.4.
 * - Published: tower 315 ft (96 m), observation deck 270 ft (82 m), atrium
 *   196 ft (Wikipedia "Old Post Office (Washington, D.C.)"); OSM tags the
 *   atrium part at 60 m.
 * - Photos (Wikimedia Commons), heights read off the HABS view with
 *   corrected verticals, scaled by the tower's 96 m: "PENNSYLVANIA AVENUE AND
 *   TWELFTH STREET ELEVATIONS - U.S. Post Office Department … HABS
 *   DC,WASH,533A-2" (HABS, public domain, from the north-west): main cornice
 *   about 39 m, pavilion cornice 41 m, pavilion roof apex about 53 m, tower
 *   shaft to 72 m, belfry 72–80 m, parapet to 83.5 m, turret tips 89 m, clock
 *   centre 65 m and about 4.6 m across. "Old Post Office Building,
 *   Washington, D.C.jpg" (Mike Peel, CC BY-SA 4.0, the north front head on);
 *   "Old Post Office Building Washington DC.JPG" (AgnosticPreachersKid, CC
 *   BY-SA 3.0, from the north-east); "Old Post Office Pavilion, Washington,
 *   D.C., USA.jpg" (Diego Delso, CC BY-SA 3.0, the 11th Street front);
 *   "Old Post Office Pavilion, 1911.jpg" (Harris & Ewing, public domain);
 *   aerial "Federal Triangle - facing east.jpg" (Carol M. Highsmith, public
 *   domain): the 12th Street front, the mansard and its dormers, the glass
 *   atrium roof with slate hip ends, the recessed centre; aerial "Aerial
 *   view of Federal Triangle - facing west.jpg" (Highsmith, public domain):
 *   the 11th Street side.
 * - Estimated: storey bands and window groups (one broad panel per bay and
 *   storey group, not per window); mansard 39 → 47.5 m with a flat deck;
 *   the atrium's glass hip to 55.5 m (OSM tags 60; drawn lower because no licensed view shows it that high and a taller one dominated the street views); pavilion depth (17.6 m) from
 *   the aerial; turrets 1.6 m in radius, bodies to 44 m, cones to 49.5 m.
 *   The south front, which no licensed photo shows, is drawn like the
 *   others, without pavilions. The East Atrium addition (1983) lies outside
 *   the outline and is not drawn.
 * - Simplified: corbel tables are one projecting band; the arches round the
 *   clock faces, the finials, flagpoles and the tower's slit windows are
 *   left out. Colours: the granite is a light warm grey, pulled to the
 *   palette's lightness; the rock-faced base a shade darker; the slate a
 *   mid blue-grey.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, cap, ccw, lathe, offset, orient, save, walls } from './dc-nmaahc'

// ===========================================================================
// Kit, shared with dc-hoover-building, dc-national-building-museum and
// dc-house-of-the-temple. Edges are a→b along a counter-clockwise ring, so
// their outward normal is to the right.

export type Edge = [XY, XY]

/** The edges of a ring, counter-clockwise. */
export function edges(ring: XY[]): Edge[] {
  const R = ccw(ring)
  return R.map((a, i) => [a, R[(i + 1) % R.length]] as Edge)
}

const along = (e: Edge) => {
  const [a, b] = e, dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
  return { a, dx, dy, l, nx: dy / l, ny: -dx / l }
}

/** A point on an edge: s metres along it, d out from it, at height z. */
export function onEdge(e: Edge, s: number, d: number, z: number): V3 {
  const { a, dx, dy, l, nx, ny } = along(e)
  return [a[0] + (dx * s) / l + nx * d, a[1] + (dy * s) / l + ny * d, z]
}

/** A flat panel on an edge, s0..s1 metres along it, z0..z1, lifted d. */
export function edgePanel(p: Part, e: Edge, s0: number, s1: number, z0: number, z1: number, d = 0.05) {
  p.quad(onEdge(e, s0, d, z0), onEdge(e, s1, d, z0), onEdge(e, s1, d, z1), onEdge(e, s0, d, z1))
}

/**
 * A round-arched panel on an edge: a rectangle up to the springing and a
 * semicircular head (`seg` steps), total height to z1.
 */
export function edgeArch(p: Part, e: Edge, s0: number, s1: number, z0: number, z1: number, seg = 4, d = 0.05) {
  const r = (s1 - s0) / 2, sm = (s0 + s1) / 2, spring = Math.max(z0, z1 - r)
  if (spring > z0 + 0.01) edgePanel(p, e, s0, s1, z0, spring, d)
  const { nx, ny } = along(e)
  for (let k = 0; k < seg; k++) {
    const t0 = Math.PI * (1 - k / seg), t1 = Math.PI * (1 - (k + 1) / seg)
    orient(p, [onEdge(e, sm, d, spring), onEdge(e, sm + r * Math.cos(t0), d, spring + r * Math.sin(t0)),
      onEdge(e, sm + r * Math.cos(t1), d, spring + r * Math.sin(t1))], [nx, ny, 0])
  }
}

/** A round panel (a clock face, an oculus) on an edge, centred s along it at height z. */
export function edgeDisc(p: Part, e: Edge, s: number, z: number, r: number, seg = 12, d = 0.05) {
  const { nx, ny } = along(e)
  for (let k = 0; k < seg; k++) {
    const t0 = (2 * Math.PI * k) / seg, t1 = (2 * Math.PI * (k + 1)) / seg
    orient(p, [onEdge(e, s, d, z), onEdge(e, s + r * Math.cos(t0), d, z + r * Math.sin(t0)),
      onEdge(e, s + r * Math.cos(t1), d, z + r * Math.sin(t1))], [nx, ny, 0])
  }
}

/**
 * A block standing proud of an edge by `d` (a pier, a band, a cheek wall):
 * front, ends, top and bottom; the back is against the wall.
 */
export function edgeBlock(p: Part, e: Edge, s0: number, s1: number, z0: number, z1: number, d: number, top = true, bottom = true) {
  const { nx, ny, dx, dy, l } = along(e)
  const P = (s: number, k: number, z: number) => onEdge(e, s, k, z)
  orient(p, [P(s0, d, z0), P(s1, d, z0), P(s1, d, z1), P(s0, d, z1)], [nx, ny, 0])
  orient(p, [P(s0, 0, z0), P(s0, d, z0), P(s0, d, z1), P(s0, 0, z1)], [-dx / l, -dy / l, 0])
  orient(p, [P(s1, 0, z0), P(s1, d, z0), P(s1, d, z1), P(s1, 0, z1)], [dx / l, dy / l, 0])
  if (top) orient(p, [P(s0, 0, z1), P(s1, 0, z1), P(s1, d, z1), P(s0, d, z1)], [0, 0, 1])
  if (bottom) orient(p, [P(s0, 0, z0), P(s1, 0, z0), P(s1, d, z0), P(s0, d, z0)], [0, 0, -1])
}

/**
 * A projecting band round a whole ring (a cornice or string course): the
 * ring grown by `d` from z0 to z1, with its underside and top ledge, and a
 * chamfered top edge of `b`.
 */
export function band(p: Part, ring: XY[], z0: number, z1: number, d: number, b = 0) {
  const R = ccw(ring), O = offset(R, d)
  const lo = (r: XY[], z: number) => r.map(([x, y]) => [x, y, z] as V3)
  const rings = [lo(O, z0), lo(O, z1 - b)]
  if (b > 0) rings.push(lo(offset(R, d - b), z1))
  p.loft(rings)
  const top = b > 0 ? offset(R, d - b) : O
  for (let i = 0; i < R.length; i++) {
    const j = (i + 1) % R.length
    orient(p, [[...R[i], z0], [...O[i], z0], [...O[j], z0], [...R[j], z0]] as V3[], [0, 0, -1])
    orient(p, [[...R[i], z1], [...top[i], z1], [...top[j], z1], [...R[j], z1]] as V3[], [0, 0, 1])
  }
}

/** Evenly spaced bay centres along s0..s1 at about `pitch` apart. */
export function bayCentres(s0: number, s1: number, pitch: number) {
  const n = Math.max(1, Math.round((s1 - s0) / pitch)), step = (s1 - s0) / n
  return Array.from({ length: n }, (_, k) => s0 + step * (k + 0.5))
}

/** A hip (pyramid when it closes) over a rectangle ring, from z0 to z1 with the top inset ix, iy. */
export function hipRect(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, ix: number, iy = ix, top: Part | false = p) {
  ix = Math.min(ix, (x1 - x0) / 2 - 0.02); iy = Math.min(iy, (y1 - y0) / 2 - 0.02)
  const a: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const t: V3[] = [[x0 + ix, y0 + iy, z1], [x1 - ix, y0 + iy, z1], [x1 - ix, y1 - iy, z1], [x0 + ix, y1 - iy, z1]]
  p.loft([a, t])
  if (top) top.cap(t, true)
}

/** A round turret: a smooth shaft, a corbelled cap band, a conical roof. */
export function roundTurret(stone: Part, roof: Part, cx: number, cy: number, r: number, z0: number, z1: number, apex: number, n = 10) {
  lathe(stone, cx, cy, [[r, z0], [r, z1 - 1.0], [r + 0.3, z1 - 0.6], [r + 0.3, z1]], n, false)
  lathe(roof, cx, cy, [[r + 0.45, z1], [0, apex]], n, false)
  roof.cap(Array.from({ length: n }, (_, k) => [cx + (r + 0.45) * Math.cos((2 * Math.PI * k) / n), cy + (r + 0.45) * Math.sin((2 * Math.PI * k) / n), z1] as V3), false)
}

/**
 * A gabled dormer on a roof slope, its face on an edge `s` metres along it
 * and set `back` in from it: a box, a window, a little gable roof running
 * back into the slope.
 */
export function dormer(wall: Part, roof: Part, win: Part, e: Edge, s: number, back: number, z0: number, w = 2.4, h = 2.6, depth = 3.0, pitch = 1.8) {
  const P = (u: number, k: number, z: number) => onEdge(e, s + u, -back - k, z)
  const { nx, ny, dx, dy, l } = along(e)
  const hw = w / 2
  // Front face and its gable, then the sides.
  orient(wall, [P(-hw, 0, z0), P(hw, 0, z0), P(hw, 0, z0 + h), P(-hw, 0, z0 + h)], [nx, ny, 0])
  orient(wall, [P(-hw, 0, z0 + h), P(hw, 0, z0 + h), P(0, 0, z0 + h + pitch)], [nx, ny, 0])
  orient(wall, [P(-hw, 0, z0), P(-hw, depth, z0), P(-hw, depth, z0 + h), P(-hw, 0, z0 + h)], [-dx / l, -dy / l, 0])
  orient(wall, [P(hw, 0, z0), P(hw, depth, z0), P(hw, depth, z0 + h), P(hw, 0, z0 + h)], [dx / l, dy / l, 0])
  // Roof: two slopes from the eaves to the ridge.
  orient(roof, [P(-hw - 0.15, 0, z0 + h), P(-hw - 0.15, depth, z0 + h), P(0, depth, z0 + h + pitch), P(0, 0, z0 + h + pitch)], [-dx / l, -dy / l, 1])
  orient(roof, [P(hw + 0.15, 0, z0 + h), P(hw + 0.15, depth, z0 + h), P(0, depth, z0 + h + pitch), P(0, 0, z0 + h + pitch)], [dx / l, dy / l, 1])
  edgePanel(win, e, s - hw * 0.55, s + hw * 0.55, z0 + 0.3, z0 + h - 0.2, -back + 0.05)
}

// ===========================================================================
// The Old Post Office.

function build() {
  const granite = new Part(), rustic = new Part(), slate = new Part(), win = new Part(), glass = new Part(), door = new Part()

  // ---- Heights.
  const BASE = 10.5 // top of the rock-faced base
  const EAVE = 39.0, PAV_EAVE = 40.5
  const DECK = 47.5, INSET = 4.0 // the mansard's flat top and how far in it stands
  const PAV_APEX = 53.0
  const ATRIUM_RIDGE = 55.5

  // ---- Plan (OSM, simplified to its straight walls; turrets added below).
  const PAV_S = 32.0 // the north pavilions run from here to the north front
  const W: XY[] = [
    [-31.5, -44.7], [-15.2, -44.7], [-15.2, -50.0], [14.9, -50.0], [14.9, -44.7], [30.9, -44.7],
    [30.9, -6.0], [29.5, -6.0], [29.5, 11.2], [30.9, 11.2], [30.9, 49.6], [13.6, 49.6], [13.6, 44.3],
    [-14.2, 44.3], [-14.2, 49.6], [-31.5, 49.6], [-31.5, 11.3], [-27.0, 11.3], [-27.0, -6.5], [-31.5, -6.5],
  ]
  const PAVS: Array<[number, number]> = [[-31.5, -14.2], [13.6, 30.9]] // x ranges

  // ---- Walls: the rock-faced base, the smooth granite above.
  walls(rustic, W, 0, BASE)
  walls(granite, W, BASE, EAVE)
  for (const [x0, x1] of PAVS) {
    walls(granite, [[x0, PAV_S], [x1, PAV_S], [x1, 49.6], [x0, 49.6]], EAVE, PAV_EAVE)
  }
  band(rustic, W, BASE - 0.6, BASE, 0.35, 0.15) // the base's top course
  band(granite, W, EAVE - 1.1, EAVE, 0.55, 0.25) // the corbelled cornice
  for (const [x0, x1] of PAVS) band(granite, [[x0, PAV_S], [x1, PAV_S], [x1, 49.6], [x0, 49.6]], PAV_EAVE - 0.9, PAV_EAVE, 0.55, 0.25)

  // ---- Windows, bay by bay on every straight wall: broad panels for the
  // storey groups (the photos' rhythm), round-arched where the real ones are.
  const TOWER_X0 = -5.6, TOWER_X1 = 5.4
  for (const e of edges(W)) {
    const { l, nx, ny } = along(e)
    if (l < 3) continue
    const mid = onEdge(e, l / 2, 0, 0)
    const northCentre = ny > 0.9 && Math.abs(mid[1] - 44.3) < 0.1
    const pav = ny > 0.9 && mid[1] > 49
    const lo = 1.9, hi = l - 1.9 // keep clear of the turrets
    for (const c of bayCentres(lo, hi, l < 10 ? 4.0 : 4.3)) {
      const p = onEdge(e, c, 0, 0)
      if (northCentre && p[0] > TOWER_X0 - 1.2 && p[0] < TOWER_X1 + 1.2) continue // the tower front, drawn below
      const w = 2.3
      edgeArch(win, e, c - w / 2, c + w / 2, 2.2, 8.4) // base: tall arched ground storey
      edgePanel(win, e, c - w / 2, c + w / 2, 12.0, 18.6)
      edgeArch(win, e, c - w / 2, c + w / 2, 20.4, 28.4)
      edgePanel(win, e, c - w / 2, c + w / 2, 30.0, 34.4)
      edgeArch(win, e, c - w / 2 + 0.2, c + w / 2 - 0.2, 35.4, 37.6)
      if (pav) edgePanel(win, e, c - w / 2 + 0.3, c + w / 2 - 0.3, 39.0, 39.9) // the pavilions' extra arcade
    }
    void nx
  }

  // ---- Turrets: the corners and either side of each recessed centre.
  const TURRETS: XY[] = [
    [-31.3, 49.4], [-14.4, 49.4], [13.8, 49.4], [30.7, 49.4], // north front
    [-31.2, -44.4], [30.6, -44.4], // south corners
    [-15.4, -44.9], [15.1, -44.9], // either side of the south projection
    [-30.0, 11.6], [-30.0, -6.8], // the 12th Street recess
    [30.6, 11.6], [30.6, -6.4], // the 11th Street recess
  ]
  for (const [x, y] of TURRETS) roundTurret(granite, slate, x, y, 1.6, 0, 44.0, 49.5)

  // ---- The mansard: steep slate from the eaves to a flat deck, round the
  // whole block except the north pavilions, which carry their own roofs.
  const M: XY[] = [
    [-31.5, -44.7], [-15.2, -44.7], [-15.2, -50.0], [14.9, -50.0], [14.9, -44.7], [30.9, -44.7],
    [30.9, -6.0], [29.5, -6.0], [29.5, 11.2], [30.9, 11.2], [30.9, PAV_S], [13.6, PAV_S], [13.6, 44.3],
    [-14.2, 44.3], [-14.2, PAV_S], [-31.5, PAV_S], [-31.5, 11.3], [-27.0, 11.3], [-27.0, -6.5], [-31.5, -6.5],
  ]
  const MR = ccw(M), MI = offset(MR, -INSET)
  slate.loft([MR.map(([x, y]) => [x, y, EAVE] as V3), MI.map(([x, y]) => [x, y, DECK] as V3)])
  cap(slate, MI, DECK)

  // Dormers along the mansard's outer slopes, as in the aerial: gabled,
  // a storey tall, set a metre in from the eaves.
  for (const e of edges(M)) {
    const { l, nx, ny } = along(e)
    const mid = onEdge(e, l / 2, 0, 0)
    if (l < 6 || ny < -0.9 && mid[1] > 30) continue // skip the pavilions' backs
    if (Math.abs(mid[1] - PAV_S) < 0.1) continue
    if (mid[1] > PAV_S && mid[1] < 44.4 && Math.abs(nx) > 0.9 && Math.abs(mid[0]) < 15) continue // the pavilions' inner sides
    for (const c of bayCentres(2.5, l - 2.5, 6.5)) {
      const p = onEdge(e, c, 0, 0)
      if (Math.abs(mid[1] - 44.3) < 0.1 && p[0] > TOWER_X0 - 2 && p[0] < TOWER_X1 + 2) continue
      dormer(granite, slate, win, e, c, 1.2, EAVE + 0.4, 2.2, 2.6, 2.4, 1.6)
    }
  }

  // ---- The north pavilions: tall pyramid roofs, each with stone gable
  // dormers on its street faces.
  for (const [x0, x1] of PAVS) {
    const cx = (x0 + x1) / 2, cy = (PAV_S + 49.6) / 2
    hipRect(slate, x0 - 0.3, x1 + 0.3, PAV_S - 0.3, 49.9, PAV_EAVE, PAV_APEX, (x1 - x0) / 2 - 0.3, (49.6 - PAV_S) / 2 - 0.3)
    // North gable: a stone wall rising from the cornice to a point, its own
    // roof running back into the pyramid; a round window in it.
    const gw = 3.4, gTop = PAV_EAVE + 8.0, back = 6.5
    const gN: Edge = [[x0, 49.6], [x1, 49.6]].reverse() as Edge // a→b westward: outward is north
    void gN
    const yF = 49.6 - 0.6
    orient(granite, [[cx - gw, yF, PAV_EAVE], [cx + gw, yF, PAV_EAVE], [cx + gw, yF, PAV_EAVE + 3.0], [cx - gw, yF, PAV_EAVE + 3.0]], [0, 1, 0])
    orient(granite, [[cx - gw, yF, PAV_EAVE + 3.0], [cx + gw, yF, PAV_EAVE + 3.0], [cx, yF, gTop]], [0, 1, 0])
    orient(slate, [[cx - gw - 0.2, yF, PAV_EAVE + 3.0], [cx - gw - 0.2, yF - back, PAV_EAVE + 3.0], [cx, yF - back, gTop], [cx, yF, gTop]], [-1, 0, 1])
    orient(slate, [[cx + gw + 0.2, yF, PAV_EAVE + 3.0], [cx + gw + 0.2, yF - back, PAV_EAVE + 3.0], [cx, yF - back, gTop], [cx, yF, gTop]], [1, 0, 1])
    for (const s of [-1, 1]) orient(granite, [[cx + s * gw, yF, PAV_EAVE], [cx + s * gw, yF - 3, PAV_EAVE], [cx + s * gw, yF - 3, PAV_EAVE + 3.0], [cx + s * gw, yF, PAV_EAVE + 3.0]], [s, 0, 0])
    edgePanel(win, [[cx - gw, yF], [cx + gw, yF]].reverse() as Edge, gw - 1.6, gw + 1.6, PAV_EAVE + 0.4, PAV_EAVE + 2.6, 0.05)
    edgeDisc(win, [[cx + gw, yF], [cx - gw, yF]] as Edge, gw, PAV_EAVE + 4.6, 0.8, 8)
    void cy
    // A side gable on the street-side face (12th or 11th Street), smaller.
    const outerX = x0 < 0 ? x0 + 0.6 : x1 - 0.6, sx = x0 < 0 ? -1 : 1, gy = 41.0, sw = 2.6, sTop = PAV_EAVE + 6.5
    orient(granite, [[outerX, gy - sw, PAV_EAVE], [outerX, gy + sw, PAV_EAVE], [outerX, gy + sw, PAV_EAVE + 2.6], [outerX, gy - sw, PAV_EAVE + 2.6]], [sx, 0, 0])
    orient(granite, [[outerX, gy - sw, PAV_EAVE + 2.6], [outerX, gy + sw, PAV_EAVE + 2.6], [outerX, gy, sTop]], [sx, 0, 0])
    orient(slate, [[outerX, gy - sw - 0.2, PAV_EAVE + 2.6], [outerX - sx * 5, gy - sw - 0.2, PAV_EAVE + 2.6], [outerX - sx * 5, gy, sTop], [outerX, gy, sTop]], [0, -1, 1])
    orient(slate, [[outerX, gy + sw + 0.2, PAV_EAVE + 2.6], [outerX - sx * 5, gy + sw + 0.2, PAV_EAVE + 2.6], [outerX - sx * 5, gy, sTop], [outerX, gy, sTop]], [0, 1, 1])
    for (const s of [-1, 1]) orient(granite, [[outerX, gy + s * sw, PAV_EAVE], [outerX - sx * 2.5, gy + s * sw, PAV_EAVE], [outerX - sx * 2.5, gy + s * sw, PAV_EAVE + 2.6], [outerX, gy + s * sw, PAV_EAVE + 2.6]], [0, s, 0])
    const sideE: Edge = sx < 0 ? [[outerX, gy + sw], [outerX, gy - sw]] : [[outerX, gy - sw], [outerX, gy + sw]]
    edgePanel(win, sideE, sw - 1.2, sw + 1.2, PAV_EAVE + 0.4, PAV_EAVE + 2.3, 0.05)
  }

  // ---- The glazed atrium roof: a hip, glass on its long slopes, slate on
  // the hip ends (as the aerial shows), ridge north–south.
  {
    const x0 = -14.4, x1 = 16.7, y0 = -24.5, y1 = 32.4, hw = (x1 - x0) / 2, xm = (x0 + x1) / 2
    const r0 = y0 + hw, r1 = y1 - hw
    orient(glass, [[x0, y0, DECK], [x0, y1, DECK], [xm, r1, ATRIUM_RIDGE], [xm, r0, ATRIUM_RIDGE]], [-1, 0, 1])
    orient(glass, [[x1, y0, DECK], [x1, y1, DECK], [xm, r1, ATRIUM_RIDGE], [xm, r0, ATRIUM_RIDGE]], [1, 0, 1])
    orient(slate, [[x0, y0, DECK], [x1, y0, DECK], [xm, r0, ATRIUM_RIDGE]], [0, -1, 1])
    orient(slate, [[x0, y1, DECK], [x1, y1, DECK], [xm, r1, ATRIUM_RIDGE]], [0, 1, 1])
  }

  // ---- The clock tower.
  {
    const x0 = TOWER_X0, x1 = TOWER_X1, y0 = 32.3, y1 = 44.6 // north face 0.3 m proud of the front
    const SHAFT = 72.0, BELFRY = 80.0, PARAPET = 83.5, APEX = 96.0
    const T: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    walls(rustic, T, 0, BASE)
    walls(granite, T, BASE, BELFRY)
    band(rustic, T, BASE - 0.6, BASE, 0.35, 0.15)
    band(granite, T, EAVE - 1.1, EAVE, 0.55, 0.25)
    band(granite, T, SHAFT - 0.7, SHAFT, 0.35, 0.15) // the belfry's sill course
    band(granite, T, BELFRY, BELFRY + 1.1, 0.7, 0.3) // the corbelled cornice
    const P: XY[] = [[x0 + 0.2, y0 + 0.2], [x1 - 0.2, y0 + 0.2], [x1 - 0.2, y1 - 0.2], [x0 + 0.2, y1 - 0.2]]
    walls(granite, P, BELFRY + 1.1, PARAPET)
    band(granite, P, PARAPET - 0.5, PARAPET, 0.25, 0.15)
    // The steep slate pyramid, from just inside the parapet to the apex.
    const cxT = (x0 + x1) / 2, cyT = (y0 + y1) / 2
    hipRect(slate, x0 + 0.5, x1 - 0.5, y0 + 0.5, y1 - 0.5, PARAPET, APEX, (x1 - x0) / 2 - 0.55, (y1 - y0) / 2 - 0.55, false)
    // Four round corner turrets on the parapet.
    for (const [x, y] of [[x0 + 0.6, y0 + 0.6], [x1 - 0.6, y0 + 0.6], [x1 - 0.6, y1 - 0.6], [x0 + 0.6, y1 - 0.6]] as XY[]) {
      roundTurret(granite, slate, x, y, 0.9, BELFRY + 1.0, 86.5, 90.0, 8)
    }
    // Each face: three arched belfry openings and a clock face.
    for (const e of edges(T)) {
      const { l } = along(e)
      const w = (l - 2.4) / 3
      for (let k = 0; k < 3; k++) edgeArch(win, e, 1.2 + k * w + 0.25, 1.2 + (k + 1) * w - 0.25, SHAFT + 0.6, BELFRY - 0.6, 4)
      edgeDisc(door, e, l / 2, 65.0, 2.3, 12, 0.1)
      edgeBlock(granite, e, l / 2 - 3.2, l / 2 + 3.2, 61.6, 62.2, 0.2) // the clock's sill
    }
    // The north front's three entrance arches at the tower's foot.
    const front: Edge = [[x1, y1], [x0, y1]]
    for (const c of [-4.6, 0, 4.6]) edgeArch(door, [[13.6, 44.3], [-14.2, 44.3]], 13.6 - c - 2.0, 13.6 - c + 2.0, 0.6, 8.0, 6, 0.4)
    // Above them, the tower front's tall arched window and the paired windows.
    edgeArch(win, front, 3.5, 7.5, 20.4, 28.4)
    edgePanel(win, front, 3.5, 7.5, 12.0, 18.6)
    edgePanel(win, front, 3.0, 8.0, 30.0, 34.4)
    void cxT; void cyT
  }

  // ---- The 12th Street entrance: one big arch in the recessed centre.
  edgeArch(door, [[-27.0, 11.3], [-27.0, -6.5]], 6.4, 11.4, 0.6, 8.0, 6, 0.4)

  return [
    { part: granite, material: finish('opo-granite', 0xe4ded4) },
    { part: rustic, material: finish('opo-rock-faced', 0xd3ccc1) },
    { part: slate, material: finish('opo-slate', 0x8a949e) },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) {
  await save('dc-old-post-office', 'Old Post Office', build(), {
    bearing: 0, osm: 'way/66418840', footprint: [62.9, 100.2], height: 96,
  }, 6500)
}
