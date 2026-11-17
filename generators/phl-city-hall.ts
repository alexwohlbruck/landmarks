/**
 * Philadelphia City Hall (Penn Square, 1871-1901, John McArthur Jr.;
 * sculpture and the William Penn statue by Alexander Milne Calder) —
 * original procedural geometry, CC0-1.0.
 * bun generators/phl-city-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. The building is square to Penn Square's grid, walls at 9.2° /
 * 99.2° (OSM outline edges), so the catalog bearing is 9.2 and the model is
 * square to its own frame. Anchor 39.952413, -75.16359: the centre of the
 * OSM outline's turned bounding box (within ~3 m of its centroid), chosen so
 * the east and west halves mirror. Elevation 0: an ordinary building; the
 * court is at street level (lidar first returns), though the terrain dips
 * there from a few low ground returns (subway entrance).
 *
 * Identity, in order: the 548 ft tower on the court's north side — stepped
 * white stages, the clock stage with four 26 ft clocks under arched hoods,
 * the tall octagonal helmet dome with Calder's four bronze groups and
 * eagles at its foot, the lantern, and the bronze Penn; the square block of
 * Second Empire ranges round the court, pale marble under dark convex
 * mansards with rows of white dormers; the four centre pavilions with their
 * portals, paired columns, segmental pediments, tall mansards with a great
 * dormer and pale hip rolls, and square attics; the four corner pavilions'
 * steep mansards; the twin turrets and the tower's apse in the court.
 *
 * Night: the four fronts and the tower are floodlit (`floodlight` on the
 * marble, strongest on the outer fronts, rising up the tower); the clock
 * dials glow warm (`window-clock`: dark teal by day, a `window*` name so
 * the map lights them at night); only the four
 * portals are `window`. The facade and tower windows are dark recesses in
 * the mansard slate, as they are dark in the night photos. Penn and the
 * bronze groups are lit a little.
 *
 * Evidence
 *  - OSM: multipolygon relation/4720912 (outer way/42784676, courtyard
 *    inners way/42784681, /42784945, /42784946) and 29 building:part ways
 *    inside it (replaces). Its outline is ~3 m smaller all round than the
 *    lidar and the published size, so the plan follows the lidar.
 *  - Lidar: USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015), 1 m
 *    grid. Measured above the sidewalk (3.3 m above the box's ground_min):
 *    overall 143.5 m E-W × 150 m N-S over the centre pavilions; wings' outer
 *    walls x ±63.5, y +61 / -66; corner pavilions 15.5 m square at x ±52.5..68,
 *    y 50.5..66 and -71..-55.5; centre pavilions to y +74.5 / -75.5 and x ±72;
 *    flanking pavilions to 65.5 / 69.5 / 66; court x ±32.5, y -21..34 with
 *    the south recess and two light wells (x ±26..43, y -46..-34.5); tower
 *    27 m square centred (0, 34.5). Heights: wing mansard flats 36-37,
 *    flanking pavilions 39-40, corner pavilions 45-46 rising to ~49,
 *    centre pavilions 49-50 with the attic at 58-59, clock-stage roof
 *    117-120, lantern ring ~150, top of Penn's hat 167.1.
 *  - Published (HABS PA-1530, Library of Congress, written data pages,
 *    public domain): 486 × 470 ft; centre pavilions 90 ft wide, 202 ft 10 in
 *    high; wings 128 ft; corner towers 51 ft square, 161 ft; basement
 *    18'3", principal storey 35'7", second 33'6", the centre pavilions'
 *    third 26'6" (so the main cornice at 26.6 m, the third storey to 34.7 m);
 *    centre archways 18 × 36 ft; tower 548 ft, base 90 ft square, an octagon
 *    50 ft across at the dome's springing; clock centre 361 ft; Penn 37 ft;
 *    the corner groups 24 ft; eagles 12 ft span. Wikipedia: clock faces
 *    26 ft. HABS photo 43 (section and plans of the tower) for the apse and
 *    the dome's helmet profile; photos 5, 47 for the roofs and the corner
 *    pavilions.
 *  - Photo-measured: tower stage breaks at ~58, ~80, ~102 and ~119 m and the
 *    dome's widths (17 m across at its springing, drawing in to the 9 m
 *    lantern ring) from Zhicheng Zhao's telephoto up South Broad, scaled by
 *    the statue (11.3 m) and the clock centre (110 m); stage widths 27.4,
 *    26, 24, 23.2 m from the same photo and the lidar.
 *  - Estimated: the attic (12.4 m square, to 56 m, cap to 61.5), the apse
 *    (16.4 m wide, 26 m high, from the OSM part way/354994858 and lidar),
 *    the turrets (from OSM cone parts and lidar 33-41 m), dormer sizes and
 *    counts (a dormer a bay), window bays (7.8 m: 486 ft over 19 bays).
 *  - Colours from the photos, pulled to the palette's lightness: grey-white
 *    marble wings; the tower whiter (its iron top is painted to match);
 *    the mansards dark slate, kept dark as a defining feature; bronze.
 *
 * Photos (Wikimedia Commons, evidence):
 *  - Philadelphia_City_Hall,_aerial_view,_cropped.png, Toniklemm, CC BY-SA 4.0
 *  - Philadelphia_city_hall.jpg, Toniklemm, CC BY-SA 4.0
 *  - Philadelphia_City_Hall,_Tower(S_Broad_St_View).jpg, Zhicheng Zhao, CC BY-SA 4.0
 *  - Philadelphia_City_Hall_South.jpg, Magiluke, CC BY-SA 4.0
 *  - Philadelphia_City_Hall_Cloudy.jpg, Nate Lee, CC BY-SA 4.0
 *  - Philadelphia_City_Hall_-_3.JPG, Max Binder, CC BY-SA 3.0 (west front)
 *  - City_Hall_and_Masonic_Temple,_Philadelphia.jpg, Peetlesnumber1, CC BY-SA 4.0
 *  - City_Hall,_Philadelphia_PA.jpg, John Phelan, CC BY-SA 3.0
 *  - Philadelphia_City_Hall_courtyard.jpg, Nickvud, CC BY-SA 4.0
 *  - Philadelphia_City_Hall_at_night.jpg, David Torres, CC BY-SA 3.0
 *  - Spectacular_Philadelphia_City_Hall.jpg, Weizheng Fang, CC BY-SA 4.0
 *  HABS PA-1530 photos 5, 43, 47 (Library of Congress, public domain).
 *  USGS NAIP for the plan. No look-only sources; no commercial imagery.
 *
 * Left out: the sculpture, columns and pilasters along the wings, the
 * basement's low windows, mullions, balustrades, the lettering, the dome's
 * louvres and small lucarnes (four big ones kept), the copper patches on
 * some roofs. The cornices' undersides are drawn only on the tower.
 *
 * Doubts: the east front has no photo of its own (built as the west, which
 * HABS describes as matching); the court's ranges are simplified to plain
 * windows in two groups; the light wells' depth and the south ranges'
 * layout are read from lidar only; the 73-75 m single-cell lidar spikes on
 * the centre pavilions are taken as flagpoles and left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, lathe, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'

// ---------------------------------------------------------------------------
// Parts, one per material.

const stone = new Part() // the wings' marble and granite
const white = new Part() // the tower and cornices: whiter marble and painted iron
const slate = new Part() // mansards and flat roofs
// Windows are dark recesses in the slate colour: at night the real wings'
// windows are mostly dark under the floodlit stone (David Torres' night
// photo), so only the four portals glow.
const win = slate
const portal = new Part() // the four portals, lit at night
const bronze = new Part() // Penn, the corner groups, the eagles, clock rims
const clock = new Part() // the four clock dials, lit at night

// ---------------------------------------------------------------------------
// Small geometry helpers. Map frame: x east, y north, z up.

type Ring = XY[]

/** `walls`, leaving out the edges in `skip` (faces buried in a neighbouring block). */
function wallsSkip(p: Part, r: Ring, z0: number, z1: number, r1: Ring = r, skip: number[] = []) {
  for (let i = 0; i < r.length; i++) {
    if (skip.includes(i)) continue
    const j = (i + 1) % r.length
    p.quad([r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [r1[j][0], r1[j][1], z1], [r1[i][0], r1[i][1], z1])
  }
}

/** Ring of a convex polygon offset outward by d (negative: inward). */
const grow = (r: Ring, d: number) => inset(r, -d)

/** A band (cornice, string course) round ring r, projecting `out`, z0..z1. */
function band(p: Part, r: Ring, z0: number, z1: number, out: number, skip: number[] = [], under = false) {
  const o = grow(r, out)
  wallsSkip(p, o, z0, z1, o, skip)
  for (let i = 0; i < r.length; i++) {
    if (skip.includes(i)) continue
    const j = (i + 1) % r.length
    // The underside only where it carries a shadow line that reads (the
    // tower's cornices): the map mostly looks down on the rest.
    if (under) p.quad([r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [o[j][0], o[j][1], z0], [o[i][0], o[i][1], z0])
    // top, facing up
    p.quad([o[i][0], o[i][1], z1], [o[j][0], o[j][1], z1], [r[j][0], r[j][1], z1], [r[i][0], r[i][1], z1])
  }
}

/**
 * A wall block with a cornice and a mansard: walls to zW, a cornice band in
 * `trim`, then a mansard from the cornice to zT, `ins` in from the wall.
 * `convex` gives the steep-then-flatter curve of the wings' mansards.
 */
function mansardBlock(wall: Part, trim: Part, roof: Part, r: Ring, zW: number, zT: number, ins: number, convex = true, flat: Part | null = roof, skip: number[] = []) {
  wallsSkip(wall, r, 0, zW - 1.1, r, skip)
  band(trim, r, zW - 1.1, zW, 0.55, skip)
  const h = zT - zW
  const rings = convex
    ? [[0, zW], [0.3 * ins, zW + 0.62 * h], [ins, zT]]
    : [[0, zW], [ins, zT]]
  const loftR = rings.map(([d, z]) => ({ r: inset(r, d), z }))
  for (let k = 0; k < loftR.length - 1; k++) wallsSkip(roof, loftR[k].r, loftR[k].z, loftR[k + 1].z, loftR[k + 1].r, skip)
  const top = loftR[loftR.length - 1]
  if (flat) cap(flat, top.r, top.z)
  return top.r
}

/**
 * A rectangular range of the building: per side (south, east, north, west)
 * 'm' for a facade with its cornice and mansard, 'w' for a sheer wall to
 * the roof (a light well), 'p' for a party side buried in a neighbour (no
 * faces; the roof runs to the edge). The roof is flat at zT.
 */
function range(x0: number, y0: number, x1: number, y1: number, zW: number, zT: number, ins: number, sides: string, convex = true, parts = { wall: stone, trim: white, roof: slate }) {
  const { wall, trim, roof } = parts
  const r = rect(x0, y0, x1, y1)
  const lv = convex ? [[0, zW], [0.3, zW + 0.62 * (zT - zW)], [1, zT]] : [[0, zW], [1, zT]]
  const ring = (k: number): Ring => {
    const d = (i: number) => (sides[i] === 'm' ? ins * k : 0)
    return rect(x0 + d(3), y0 + d(0), x1 - d(1), y1 - d(2))
  }
  const grown = grow(r, 0.55)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const P = (q: Ring, z: number, k: number): V3 => [q[k][0], q[k][1], z]
    if (sides[i] === 'w') wall.quad(P(r, 0, i), P(r, 0, j), P(r, zT, j), P(r, zT, i))
    if (sides[i] !== 'm') continue
    wall.quad(P(r, 0, i), P(r, 0, j), P(r, zW - 1.1, j), P(r, zW - 1.1, i))
    trim.quad(P(grown, zW - 1.1, i), P(grown, zW - 1.1, j), P(grown, zW, j), P(grown, zW, i))
    trim.quad(P(grown, zW, i), P(grown, zW, j), P(r, zW, j), P(r, zW, i))
    for (let k = 0; k < lv.length - 1; k++) {
      const a = ring(lv[k][0]), b = ring(lv[k + 1][0])
      roof.quad(P(a, lv[k][1], i), P(a, lv[k][1], j), P(b, lv[k + 1][1], j), P(b, lv[k + 1][1], i))
    }
  }
  cap(roof, ring(1), zT)
}

/** A hipped roof (pyramid when square) over rectangle r from z0 to z1, with a flat top `topIns` in. */
function hip(p: Part, r: Ring, z0: number, z1: number, topIns: number, topP: Part = p) {
  const t = inset(r, topIns)
  walls(p, r, z0, z1, t)
  cap(topP, t, z1)
}

/** An arched panel (rectangle with a semicircular head) on wall a→b, centred s, width w. */
function archPanel(p: Part, a: XY, b: XY, s: number, w: number, z0: number, zs: number, out = 0.05, seg = w > 3 ? 8 : 4) {
  const { P } = onWall(a, b)
  const r = w / 2
  p.quad(P(s - r, z0, out), P(s + r, z0, out), P(s + r, zs, out), P(s - r, zs, out))
  const c = P(s, zs, out)
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * Math.PI, t1 = ((i + 1) / seg) * Math.PI
    p.tri(c, P(s + r * Math.cos(t0), zs + r * Math.sin(t0), out), P(s + r * Math.cos(t1), zs + r * Math.sin(t1), out))
  }
}

/** A round disc on wall a→b at s, height z. */
function disc(p: Part, a: XY, b: XY, s: number, z: number, r: number, out = 0.06, seg = 16) {
  const { P } = onWall(a, b)
  const c = P(s, z, out)
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * 2 * Math.PI, t1 = ((i + 1) / seg) * 2 * Math.PI
    p.tri(c, P(s + r * Math.cos(t0), z + r * Math.sin(t0), out), P(s + r * Math.cos(t1), z + r * Math.sin(t1), out))
  }
}

/**
 * A flat profile (u, z) extruded out of wall a→b from out0 to out1: front,
 * the edges, and no back (it stands against the wall). Profile convex,
 * counter-clockwise seen from outside.
 */
function relief(p: Part, a: XY, b: XY, prof: [number, number][], out0: number, out1: number) {
  const { P } = onWall(a, b)
  const f = prof.map(([s, z]) => P(s, z, out1)), k = prof.map(([s, z]) => P(s, z, out0))
  for (let i = 1; i < f.length - 1; i++) p.tri(f[0], f[i], f[i + 1])
  for (let i = 0; i < f.length; i++) {
    const j = (i + 1) % f.length
    p.quad(k[i], k[j], f[j], f[i])
  }
}

/**
 * A pedimented dormer standing on a mansard behind the cornice of wall a→b:
 * a stone box from z0, `w` wide, `h` to the eaves, a gable `g` high, going
 * `d` into the roof, with its window.
 */
function dormer(body: Part, glass: Part | null, a: XY, b: XY, s: number, w: number, z0: number, h: number, g: number, d = 3, set = 0.6) {
  const { P } = onWall(a, b)
  const f = -set, k = -set - d, l = s - w / 2, r = s + w / 2, ze = z0 + h, zr = ze + g
  // Front and pediment, and the gabled roof running back into the mansard;
  // the cheeks are left out (the mansard closes behind the front).
  body.quad(P(l, z0, f), P(r, z0, f), P(r, ze, f), P(l, ze, f))
  body.tri(P(l, ze, f), P(r, ze, f), P(s, zr, f))
  body.quad(P(r, ze, f), P(r, ze, k), P(s, zr, k), P(s, zr, f))
  body.quad(P(l, ze, k), P(l, ze, f), P(s, zr, f), P(s, zr, k))
  if (glass) glass.quad(P(s - w * 0.28, z0 + 0.5, f + 0.05), P(s + w * 0.28, z0 + 0.5, f + 0.05), P(s + w * 0.28, ze - 0.4, f + 0.05), P(s - w * 0.28, ze - 0.4, f + 0.05))
}

/** Window panels in rows, one per bay along wall a→b between s0 and s1. */
function windowRow(p: Part, a: XY, b: XY, s0: number, s1: number, bay: number, w: number, rows: [number, number][], out = 0.05) {
  const n = Math.max(1, Math.round((s1 - s0) / bay)), step = (s1 - s0) / n
  for (let i = 0; i < n; i++) {
    const c = s0 + (i + 0.5) * step
    for (const [z0, z1] of rows) panel(p, a, b, c - w / 2, c + w / 2, z0, z1, out)
  }
}

/** Copy `src`'s triangles into `dst`, turned by θ (radians, counter-clockwise from above) about the origin. */
function appendTurned(dst: Part, src: Part, θ: number) {
  const c = Math.cos(θ), s = Math.sin(θ)
  // glTF frame (gx, gy, gz) = map (x, z, -y)
  const turn = (arr: number[], out: number[]) => {
    for (let i = 0; i < arr.length; i += 3) {
      const x = arr[i], y = -arr[i + 2]
      const x2 = x * c - y * s, y2 = x * s + y * c
      out.push(x2, arr[i + 1], -y2)
    }
  }
  turn(src.pos, dst.pos)
  turn(src.nrm, dst.nrm)
  dst.uv.push(...src.uv)
}

// ---------------------------------------------------------------------------
// Heights (metres above the sidewalk; HABS PA-1530 unless noted)

const CORNICE = 26.6 // basement 18'3" + principal 35'7" + second 33'6"
const THIRD = 34.7 // the centre pavilions' third storey, 26'6" more
const WING_TOP = 36.2 // wings' mansard flat (lidar 36-37)
const SEC_TOP = 40 // the pavilions flanking the centre ones (lidar 39-40)
const CORNER_TOP = 45.5 // corner pavilions' mansard top (lidar 45-46)
const CORNER_PEAK = 49.2 // their caps: HABS 161 ft
const PAV_TOP = 49.5 // centre pavilions' mansard top (lidar 49-50)
const ATTIC = 56 // the attic above it
const PAV_PEAK = 61.5 // HABS 202 ft 10 in

const ROWS: [number, number][] = [[7.0, 14.6], [17.4, 24.6]] // principal and second storeys (the basement's low windows left out)
const COURT_ROWS: [number, number][] = [[2.4, 11.8], [13.8, 24.8]] // six floors in two groups of three

// ---------------------------------------------------------------------------
// One side of the building, built facing +y (north) and turned into place.

type Side = {
  turn: number // radians
  front: number // centre pavilion's main front, from the building centre
  porch: number // how far its frontispiece stands proud of that
  back: number // its back
  rearTop?: [number, number] // a lower rear part: from this distance, its top
  secFront: number // the flanking pavilions' front
  secBack: number
  wingFace: number // the wings' outer wall
  wingSegs: [number, number][] // wing stretches between flanking and corner pavilions
}

function side(sd: Side) {
  const S = { stone: new Part(), white: new Part(), slate: new Part(), win: new Part(), portal: new Part() }
  const HW = 13.7 // half of the 90 ft centre pavilion

  // Centre pavilion: walls through the third storey, the convex mansard, the attic and its cap.
  const pav = rect(-HW, sd.rearTop ? sd.rearTop[0] : sd.back, HW, sd.front)
  wallsSkip(S.stone, pav, 0, CORNICE - 1.1, pav, [0])
  band(S.white, pav, CORNICE - 1.1, CORNICE, 0.55, [0])
  wallsSkip(S.stone, pav, CORNICE, THIRD - 1.1, pav, [0])
  mansardTop(S, pav)
  if (sd.rearTop) {
    const [from, top] = sd.rearTop
    mansardBlock(S.stone, S.white, S.slate, rect(-HW + 1.5, sd.back, HW - 1.5, from), CORNICE, top, 2.4)
  }
  const ay = sd.front - 9 // attic centre
  const attic = rect(-6.2, ay - 6.2, 6.2, ay + 6.2)
  walls(S.stone, attic, PAV_TOP, ATTIC - 0.8)
  band(S.white, attic, ATTIC - 0.8, ATTIC, 0.45)
  hip(S.slate, inset(attic, 0.2), ATTIC, PAV_PEAK - 0.6, 3.6)
  band(S.white, inset(attic, 3.8), PAV_PEAK - 0.6, PAV_PEAK, 0.15)
  // Attic windows: an arched one each face.
  for (let i = 0; i < 4; i++) panel(S.win, attic[i], attic[(i + 1) % 4], 5.0, 7.4, PAV_TOP + 1, ATTIC - 2)

  // The frontispiece with its segmental pediment, paired columns and portal.
  const F = sd.front, P2 = F + sd.porch
  const fr: XY[] = rect(-8.6, F - 0.5, 8.6, P2)
  walls(S.stone, fr, 0, 30.6)
  {
    const a: XY = [8.6, P2], b: XY = [-8.6, P2] // front face, west→east as seen from outside? (outward +y)
    // a→b runs -x, so its outward normal is +y.
    const prof: [number, number][] = []
    for (let i = 0; i <= 6; i++) {
      const t = i / 6, s = t * 17.2
      prof.push([s, 30.6 + 3.4 * Math.sin(t * Math.PI) ** 0.75])
    }
    prof.reverse() // counter-clockwise from outside: along the top from the far end back
    relief(S.white, a, b, [[0, 30.0], [17.2, 30.0], ...prof.map(([s, z]) => [s, z] as [number, number])], -sd.porch - 0.5, 0.3)
    // Paired columns: one projecting frame each side, the full two storeys, then the third.
    for (const c of [3.0, 14.2]) {
      relief(S.white, a, b, [[c - 0.2, 0.8], [c + 2.6 - 0.2 + 0.4, 0.8], [c + 2.6 + 0.2, 26.0], [c - 0.2, 26.0]], 0, 1.1)
      relief(S.white, a, b, [[c + 0.2, 26.6], [c + 2.2, 26.6], [c + 2.2, 30.0], [c + 0.2, 30.0]], 0, 0.7)
    }
    // The portal (18 × 36 ft, round-headed), the arched window over it, the third-storey triplet.
    archPanel(S.portal, a, b, 8.6, 5.5, 0, 8.25, 0.06, 10)
    archPanel(S.win, a, b, 8.6, 3.0, 15.0, 20.5, 0.06)
    for (const o of [-2.2, 0, 2.2]) archPanel(S.win, a, b, 8.6 + o, 1.5, 27.0, 29.6, 0.06, 6)
    // Round windows beside the portal.
    for (const o of [-5.6, 5.6]) disc(S.win, a, b, 8.6 + o, 12.0, 0.75, 0.06, 10)
  }
  // Pavilion windows either side of the frontispiece, and on its flanks.
  {
    const a: XY = [HW, F], b: XY = [-HW, F]
    for (const s of [2.55, 24.85]) {
      for (const [z0, z1] of ROWS) panel(S.win, a, b, s - 1.1, s + 1.1, z0, z1)
      panel(S.win, a, b, s - 1.1, s + 1.1, 27.6, 32.6)
    }
    for (const [x, sgn] of [[HW, 1], [-HW, -1]] as [number, number][]) {
      const e: XY = sgn > 0 ? [x, sd.back] : [x, F], f: XY = sgn > 0 ? [x, F] : [x, sd.back]
      const L = F - (sd.rearTop ? sd.rearTop[0] : sd.back)
      const lim = Math.min(L, sd.front - sd.secFront)
      windowRow(S.win, e, f, sgn > 0 ? L - lim : 0, sgn > 0 ? L : lim, 4.5, 2.0, [...ROWS, [27.6, 32.6]])
    }
  }

  // The flanking pavilions: a little taller, standing forward of the wings.
  for (const sg of [1, -1]) {
    const x0 = sg > 0 ? HW : -28.2, x1 = sg > 0 ? 28.2 : -HW
    range(x0, sd.secBack, x1, sd.secFront, CORNICE, SEC_TOP, 3.0, sg > 0 ? 'mmmp' : 'mpmm', true, { wall: S.stone, trim: S.white, roof: S.slate })
    const a: XY = [x1, sd.secFront], b: XY = [x0, sd.secFront]
    windowRow(S.win, a, b, 0.8, 13.7, 4.6, 2.2, ROWS)
    for (const s of [3.4, 10.3]) dormer(S.stone, null, a, b, s, 2.8, CORNICE, 4.8, 1.5, 3, -0.15)
    // its outer flank, where it stands proud of the wing
    const depth = sd.secFront - sd.wingFace
    if (depth > 1.5) {
      const e: XY = sg > 0 ? [x1, sd.wingFace] : [x0, sd.secFront], f: XY = sg > 0 ? [x1, sd.secFront] : [x0, sd.wingFace]
      for (const [z0, z1] of ROWS) panel(S.win, e, f, depth / 2 - 0.7, depth / 2 + 0.7, z0, z1)
    }
  }

  // The wings' outer face: a window per bay in each storey, a dormer per bay.
  for (const [u0, u1] of sd.wingSegs) {
    const a: XY = [u1, sd.wingFace], b: XY = [u0, sd.wingFace]
    const L = u1 - u0
    windowRow(S.win, a, b, 0.4, L - 0.4, 7.8, 2.4, ROWS)
    const n = Math.max(1, Math.round(L / 7.8)), step = L / n
    for (let i = 0; i < n; i++) dormer(S.stone, null, a, b, (i + 0.5) * step, 2.8, CORNICE, 4.6, 1.5, 3, -0.15)
  }

  for (const [k, dst] of [['stone', stone], ['white', white], ['slate', slate], ['win', win], ['portal', portal]] as const) appendTurned(dst, S[k], sd.turn)
}

/** The centre pavilion's convex mansard, its big dormer and porthole dormers. */
function mansardTop(S: { stone: Part; white: Part; slate: Part; win: Part }, pav: Ring) {
  band(S.white, pav, THIRD - 1.1, THIRD, 0.55)
  const h = PAV_TOP - THIRD, I = 3.4
  const r0 = pav, r1 = inset(pav, 0.28 * I), r2 = inset(pav, I)
  walls(S.slate, r0, THIRD, THIRD + 0.6 * h, r1)
  walls(S.slate, r1, THIRD + 0.6 * h, PAV_TOP, r2)
  cap(S.slate, r2, PAV_TOP)
  band(S.white, r2, PAV_TOP - 0.6, PAV_TOP, 0.25)
  // The pale rolls down the mansard's two front hips (the back ones are hidden by the wings and tower): a strip across each hip, lifted off the slates.
  for (let i = 2; i < 4; i++) {
    const c = [(r0[0][0] + r0[2][0]) / 2, (r0[0][1] + r0[2][1]) / 2]
    const pts: V3[] = [[r0[i][0], r0[i][1], THIRD], [r1[i][0], r1[i][1], THIRD + 0.6 * h], [r2[i][0], r2[i][1], PAV_TOP]]
    const ox = Math.sign(pts[0][0] - c[0]), oy = Math.sign(pts[0][1] - c[1])
    // across the hip: perpendicular to the diagonal, in plan
    const tx = -oy * 0.45, ty = ox * 0.45
    const at = (P: V3, k: number): V3 => [P[0] + ox * 0.15 + tx * k, P[1] + oy * 0.15 + ty * k, P[2] + 0.05]
    for (let k = 0; k < 2; k++) S.white.quad(at(pts[k], -1), at(pts[k], 1), at(pts[k + 1], 1), at(pts[k + 1], -1))
  }
  // On every face: the great centre dormer (37 ft) and a porthole dormer each side.
  // pav runs back, east, front, west: no dormers on the back.
  for (let i = 1; i < 4; i++) {
    const a = pav[i], b = pav[(i + 1) % 4], { L } = onWall(a, b)
    dormer(S.stone, S.win, a, b, L / 2, 6.4, THIRD, 9.2, 2.6, 4.5, 0.05)
    if (i === 2) for (const s of [L / 2 - 8.2, L / 2 + 8.2]) dormer(S.stone, null, a, b, s, 2.8, THIRD, 3.0, 1.0, 2.5, 0.1)
  }
}

// ---------------------------------------------------------------------------
// The wings, the corner pavilions and the courtyard.

function wings() {
  // Wing blocks (lidar footprint: wings ±63.5 east-west, 61 north, -66 south;
  // court x ±32.5, y -21..34; light wells x ±26..43, y -46..-34.5).
  // Sides south, east, north, west: m facade and mansard, w sheer light-well wall, p buried.
  range(-52.6, 34, 52.6, 61, CORNICE, WING_TOP, 2.6, 'mpmp') // north wing
  range(-63.5, -34.5, -32.5, 50.6, CORNICE, WING_TOP, 2.6, 'pmpm') // west wing
  range(32.5, -34.5, 63.5, 50.6, CORNICE, WING_TOP, 2.6, 'pmpm') // east wing
  range(-52.6, -66, 52.6, -46, CORNICE, WING_TOP, 2.6, 'mpwp') // south wing, outer range
  range(-63.5, -55.6, -43, -34.5, CORNICE, WING_TOP, 2.6, 'pwpm') // south-west range by the light well
  range(43, -55.6, 63.5, -34.5, CORNICE, WING_TOP, 2.6, 'pmpw')
  range(-26, -46, 26, -34.5, CORNICE, WING_TOP, 2.6, 'pwww') // between the light wells
  range(-43, -34.5, -7, -21, CORNICE, WING_TOP, 2.6, 'wmmp') // the court's south ranges
  range(7, -34.5, 43, -21, CORNICE, WING_TOP, 2.6, 'wpmm')

  // Corner pavilions: 51 ft square, a straight steep mansard with a great
  // dormer on each face, a low hipped cap with cresting.
  for (const [cx, cy] of [[-60.25, 58.25], [60.25, 58.25], [-60.25, -63.25], [60.25, -63.25]]) {
    const r = rect(cx - 7.75, cy - 7.75, cx + 7.75, cy + 7.75)
    const top = mansardBlock(stone, white, slate, r, CORNICE, CORNER_TOP, 2.2, false, null)
    band(white, top, CORNER_TOP - 0.7, CORNER_TOP, 0.3)
    hip(slate, top, CORNER_TOP, CORNER_PEAK, 4.2)
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4], { n } = onWall(a, b)
      if (n[0] * cx + n[1] * cy < 0) continue // faces the wings
      dormer(stone, win, a, b, 7.75, 4.4, CORNICE, 7.4, 1.8, 3.2, 0.15)
      for (const [z0, z1] of ROWS) for (const s of [3.2, 12.3]) panel(win, a, b, s - 1.1, s + 1.1, z0, z1)
      for (const [z0, z1] of ROWS) panel(win, a, b, 6.55, 8.95, z0, z1)
    }
    // finial
    walls(white, rect(cx - 0.5, cy - 0.5, cx + 0.5, cy + 0.5), CORNER_PEAK, CORNER_PEAK + 0.8)
    hip(white, rect(cx - 0.5, cy - 0.5, cx + 0.5, cy + 0.5), CORNER_PEAK + 0.8, CORNER_PEAK + 4.5, 0.49)
  }

  // Court windows.
  const courtWalls: [XY, XY, number, number][] = [
    [[-32.5, 34], [-13.7, 34], 0, 18.8], // north range, west of the tower (faces south)
    [[13.7, 34], [32.5, 34], 0, 18.8],
    [[-32.5, -21], [-32.5, 34], 0, 55], // west range (faces east)
    [[32.5, 34], [32.5, -21], 0, 55],
    [[-7, -21], [-32.5, -21], 0, 25.5], // south ranges (face north)
    [[32.5, -21], [7, -21], 0, 25.5],
  ]
  for (const [a, b, s0, s1] of courtWalls) windowRow(win, a, b, s0 + 1, s1 - 1, 5.2, 1.8, COURT_ROWS)
  // The twin turrets at the court's south end, with conical roofs.
  for (const sg of [-1, 1]) {
    lathe(stone, sg * 9.6, -20.6, [[2.9, 0], [2.9, 31.5], [3.3, 31.5], [3.3, 32.3]], 12)
    lathe(slate, sg * 9.6, -20.6, [[3.1, 32.3], [0.01, 40.5]], 12)
  }
}

// ---------------------------------------------------------------------------
// The tower: 90 ft square on the court's north side, stepping in at each
// stage to the clock stage, the domed iron top, the lantern and Penn.

const TX = 0, TY = 34.5

function tower() {
  const sq = (h: number, c = 0): Ring => {
    const r = rect(TX - h, TY - h, TX + h, TY + h)
    if (!c) return r
    const out: Ring = []
    for (let i = 0; i < 4; i++) {
      const p = r[i], q = r[(i + 3) % 4], n = r[(i + 1) % 4]
      const t = (u: XY, k: number): XY => [p[0] + (u[0] - p[0]) * k, p[1] + (u[1] - p[1]) * k]
      out.push(t(q, c / (2 * h)), t(n, c / (2 * h)))
    }
    return out
  }
  // Stage 1: the base, up through the wings to the first balcony.
  const s1 = sq(13.7)
  walls(white, s1, 0, 56.6)
  band(white, s1, 55.8, 58, 1.1, [], true)
  // The apse on the court side: a segmental bay, three storeys.
  {
    const apse: XY[] = []
    for (let i = 0; i <= 8; i++) {
      const a = Math.PI + (Math.PI * i) / 8 // west, round the south, to east
      apse.push([TX + 8.2 * Math.cos(a), TY - 13.7 + 4.6 * Math.sin(a)])
    }
    walls(stone, apse, 0, 26)
    band(white, apse, 25, 26, 0.4)
    cap(slate, apse, 26)
    for (let i = 1; i < apse.length - 2; i += 2) for (const [z0, z1] of COURT_ROWS) panel(win, apse[i], apse[i + 1], 0.25, onWall(apse[i], apse[i + 1]).L - 0.25, z0, Math.min(z1, 24.4))
  }
  // Stage 2: tall arched windows, corner piers.
  const s2 = sq(13.0)
  walls(white, s2, 58, 79)
  band(white, s2, 78.4, 80.5, 1.1, [], true)
  // Stage 3: the colonnade stage, columns clustered at the corners.
  const s3 = sq(12.0)
  walls(white, s3, 80.5, 101)
  band(white, s3, 100.6, 102.5, 1.1, [], true)
  // Stage 4: the clock stage, its corners cut.
  const s4 = sq(11.6, 3.4)
  walls(white, s4, 102.5, 117.6)
  band(white, s4, 117.2, 119, 0.8, [], true)
  cap(slate, grow(s4, 0.6), 119)

  // Corner piers on stages 1-3 and their faces' openings.
  for (let i = 0; i < 4; i++) {
    const θ = (i * Math.PI) / 2
    const c = Math.cos(θ), s = Math.sin(θ)
    const T = (x: number, y: number): XY => [TX + x * c - y * s, TY + x * s + y * c]
    // the south face of each stage, turned to each side in turn (i = 0: south)
    const face = (h: number): [XY, XY] => [T(-h, -h), T(h, -h)]
    // Stage 1, above the wing roofs (and the full height on the court side).
    {
      const [a, b] = face(13.7)
      for (const u of [-11.2, 11.2]) relief(white, a, b, [[13.7 + u - 2.3, i === 0 ? 0 : 36], [13.7 + u + 2.3, i === 0 ? 0 : 36], [13.7 + u + 2.3, 55.8], [13.7 + u - 2.3, 55.8]], 0, 0.9)
      if (i !== 2) {
        archPanel(win, a, b, 13.7, 3.4, 41, 51)
      }
      if (i === 0) archPanel(win, a, b, 13.7, 2.2, 29, 36)
    }
    // Stage 2: piers at the corners, a tall triple-arched window.
    {
      const [a, b] = face(13.0)
      for (const u of [-11, 11]) relief(white, a, b, [[13 + u - 2, 58], [13 + u + 2, 58], [13 + u + 2, 78.4], [13 + u - 2, 78.4]], 0, 0.9)
      archPanel(win, a, b, 13, 4.6, 62, 74.5)
    }
    // Stage 3: column clusters at the corners and the great arched opening with its balcony.
    {
      const [a, b] = face(12.0)
      for (const u of [-9.4, 9.4]) relief(white, a, b, [[12 + u - 2.6, 80.5], [12 + u + 2.6, 80.5], [12 + u + 2.6, 100.6], [12 + u - 2.6, 100.6]], 0, 1.1)
      archPanel(win, a, b, 12, 6.0, 85, 95.5)
      relief(white, a, b, [[12 - 3.6, 83.2], [12 + 3.6, 83.2], [12 + 3.6, 84.6], [12 - 3.6, 84.6]], 0, 1.0)
    }
    // Stage 4: the clock (26 ft, centre 361 ft above the ground) under its arched hood.
    {
      const [a, b] = face(11.6)
      // A pale ring round the deep green-teal dial (Toniklemm's aerials):
      // the dial is the published 26 ft (7.9 m), drawn a little bolder
      // (8.4 m) for phone size, the ring 9.6 m, about 40% of the stage as
      // in the photo.
      disc(white, a, b, 11.6, 110, 4.8, 0.08, 12)
      disc(clock, a, b, 11.6, 110, 4.2, 0.16, 12)
      // the arched hood rising over the cornice
      const hood: [number, number][] = []
      for (let k = 0; k <= 8; k++) {
        const t = (Math.PI * k) / 8
        hood.push([11.6 + 4.8 * Math.cos(t), 117.6 + 4.6 * Math.sin(t)])
      }
      relief(white, a, b, hood, -0.6, 0.65)
      // the eagle on the hood's crown (12 ft wingspan), wings spread
      relief(bronze, a, b, [[11.6 - 0.7, 121.8], [11.6 + 0.7, 121.8], [11.6 + 1.95, 123.0], [11.6 + 1.4, 123.9], [11.6 - 1.4, 123.9], [11.6 - 1.95, 123.0]], -0.3, 0.45)
    }
    // The bronze groups on the clock stage's corners (24 ft).
    {
      const [x, y] = T(-9.3, -9.3)
      lathe(bronze, x, y, [[1.3, 119], [0.95, 124.4], [0.6, 125.4], [0.01, 126.4]], 6)
    }
  }

  // The dome: an octagon 50 ft across at its springing, swelling a little
  // and drawn in to the lantern (the tall helmet the photos show).
  // Apothems from Zhicheng Zhao's telephoto up South Broad (17 m across at
  // the springing) and the lidar; the lathe takes corner radii.
  const dome: [number, number][] = [[8.4, 119], [8.4, 124], [8.0, 129], [7.3, 134], [6.2, 139], [4.9, 143], [3.6, 146.4], [3.0, 148]]
  lathe(white, TX, TY, dome.map(([a, z]) => [a / Math.cos(Math.PI / 8), z] as XY), 8, Math.PI / 8)
  // The dome's four lucarnes over the clocks, pale frames round dark arched lights.
  for (let i = 0; i < 4; i++) {
    const θ = (i * Math.PI) / 2, c = Math.cos(θ), s = Math.sin(θ)
    const T = (x: number, y: number): XY => [TX + x * c - y * s, TY + x * s + y * c]
    const a = T(-2, -8.9), b = T(2, -8.9)
    dormer(white, null, a, b, 2, 2.6, 123.2, 4.2, 1.3, 2.2, 0)
    archPanel(win, a, b, 2, 1.4, 124, 126.6, 0.05, 4)
  }
  // Lantern: the observation balcony, the drum, its cap.
  lathe(white, TX, TY, [[0.01, 147.9], [4.7, 147.9], [4.7, 149.0], [3.05, 149.0], [3.05, 152.6], [3.45, 153.1], [1.5, 155.2], [1.5, 155.8], [0.01, 155.8]], 12)
  // Lantern windows, one on each of the drum's twelve faces.
  for (let k = 0; k < 12; k += 2) {
    const t = ((k + 0.5) / 12) * 2 * Math.PI
    const w = 0.5, c = Math.cos(t), s = Math.sin(t), r = 3.05 * Math.cos(Math.PI / 12) + 0.04
    const A: V3 = [TX + r * c - w * s, TY + r * s + w * c, 149.6], B: V3 = [TX + r * c + w * s, TY + r * s - w * c, 149.6]
    win.quad(B, A, [A[0], A[1], 152.0], [B[0], B[1], 152.0])
  }
  // William Penn, 37 ft of bronze, facing north-east with his right arm out
  // over the city. Drawn as a few bold masses so he reads at phone size.
  penn()
}

function penn() {
  const Z = 155.8
  // He faces north-east (world ~45°, model frame ~36°); his outstretched
  // right arm points about east (world ~80°, model ~71°).
  const face = (36 * Math.PI) / 180
  const fx = Math.sin(face), fy = Math.cos(face) // forward
  const rx = Math.cos(face), ry = -Math.sin(face) // his right
  const at = (f: number, r: number): XY => [TX + fx * f + rx * r, TY + fy * f + ry * r]
  // Base and legs.
  lathe(bronze, TX, TY, [[1.35, Z], [1.35, Z + 0.4], [0.01, Z + 0.4]], 8)
  lathe(bronze, TX, TY, [[0.95, Z + 0.4], [1.0, Z + 2.6]], 8)
  // The long coat and the body, to the shoulders.
  lathe(bronze, TX, TY, [[1.35, Z + 2.4], [1.05, Z + 6.6], [1.2, Z + 8.3], [0.45, Z + 8.8], [0.01, Z + 8.8]], 8)
  // Head and the broad-brimmed hat.
  lathe(bronze, TX, TY, [[0.45, Z + 8.75], [0.62, Z + 9.4], [0.58, Z + 9.9], [1.1, Z + 9.95], [1.1, Z + 10.2], [0.58, Z + 10.25], [0.5, Z + 11.3], [0.01, Z + 11.3]], 8)
  // Right arm held out (east), palm down.
  {
    const ax = 0.945, ay = 0.329 // arm direction, model frame
    const sh: V3 = [...at(0.1, 1.05), Z + 8.0] as V3
    const hand: V3 = [sh[0] + ax * 3.0, sh[1] + ay * 3.0, Z + 7.3]
    const px = -ay * 0.38, py = ax * 0.38
    const ring = (p: V3, h: number): V3[] => [[p[0] - px, p[1] - py, p[2] - h], [p[0] + px, p[1] + py, p[2] - h], [p[0] + px, p[1] + py, p[2] + h], [p[0] - px, p[1] - py, p[2] + h]]
    const r0 = ring(sh, 0.42), r1 = ring(hand, 0.3)
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      bronze.quad(r0[i], r0[j], r1[j], r1[i])
    }
    bronze.quad(r1[0], r1[1], r1[2], r1[3])
  }
  // Left arm down at his side, holding the charter.
  {
    const [x, y] = at(0.15, -1.15)
    lathe(bronze, x, y, [[0.01, Z + 4.6], [0.42, Z + 4.8], [0.4, Z + 8.0], [0.01, Z + 8.3]], 6)
  }
}

// ---------------------------------------------------------------------------

function build() {
  wings()
  // Sides: north (the tower side), south, east and west. Lidar: the north
  // and south centre pavilions reach 74.5 and 75.5 m from the centre, the
  // east and west ones 72; the flanking pavilions 65.5 / 69.5 / 66.
  side({ turn: 0, front: 72, porch: 2.5, back: 47.5, secFront: 65.5, secBack: 34, wingFace: 61, wingSegs: [[-52.6, -28.2], [28.2, 52.6]] })
  side({ turn: Math.PI, front: 72, porch: 3.5, back: 46, rearTop: [50, 44], secFront: 69.5, secBack: 46, wingFace: 66, wingSegs: [[-52.6, -28.2], [28.2, 52.6]] })
  side({ turn: -Math.PI / 2, front: 70, porch: 2, back: 34.5, rearTop: [48, 45], secFront: 66, secBack: 32.5, wingFace: 63.5, wingSegs: [[-50.6, -28.2], [28.2, 55.6]] })
  side({ turn: Math.PI / 2, front: 70, porch: 2, back: 34.5, rearTop: [48, 45], secFront: 66, secBack: 32.5, wingFace: 63.5, wingSegs: [[-55.6, -28.2], [28.2, 50.6]] })
  tower()

  // Night: the four fronts and the tower are floodlit, the clocks glow.
  const inCourt = (p: V3) => Math.abs(p[0]) < 33 && p[1] > -35 && p[1] < 34.5 && p[2] < 40
  const wingLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : inCourt(p) ? 0.3 : 0.8)
  const towerLit = (p: V3, n: V3) => {
    if (Math.hypot(p[0] - TX, p[1] - TY) > 16) return wingLit(p, n)
    return (n[2] > 0.7 ? 0.35 : 1) * (0.55 + 0.45 * Math.min(1, p[2] / 150))
  }
  return [
    { part: stone, material: { ...finish('phl-marble', 0xe0ddd4), floodlight: wingLit } },
    { part: white, material: { ...finish('phl-tower-white', 0xf0eee8), floodlight: towerLit } },
    { part: slate, material: { ...finish('phl-mansard', 0x58616b), floodlight: (_p: V3, n: V3) => (n[2] > 0.85 ? 0.05 : 0.35) } },
    { part: portal, material: PALETTE.window },
    { part: bronze, material: { ...finish('phl-bronze', 0x56524a), floodlight: (p: V3) => (p[2] > 150 ? 0.7 : 0.4) } },
    // The dials: deep green-teal by day (#0c3643 sampled in sun, pulled to
    // the palette's lightness but kept clearly darker than the stone). Named
    // `window-*` rather than `neon-*`: neon glows in its own (here dark)
    // colour, while a window glows warm yellow-white at night, as the dials
    // do in Weizheng Fang's dusk photo.
    { part: clock, material: finish('window-clock', 0x3d6166) },
  ]
}

if (import.meta.main) await save('phl-city-hall', 'Philadelphia City Hall', [39.952413, -75.16359], 9.2, build(), 6500)
