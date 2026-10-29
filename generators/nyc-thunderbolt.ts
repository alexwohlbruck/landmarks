/**
 * Thunderbolt (Zamperla, 2014), Luna Park, Coney Island: procedural, CC0-1.0.
 * bun generators/nyc-thunderbolt.ts   (REPORT=1 for the element table and energy check)
 *
 * Map frame: x east, y north, z up, metres; bearing 0, so the frame is true
 * north. The park frame is metres east and north of lon -73.9778, lat 40.575
 * (`origin`, the Cyclone's); the model's origin is the middle of the track's
 * footprint (see anchor), on the ground. Coney Island is level beach fill
 * here, so the terrain grid is flat. Built with ./coaster-kit.ts.
 *
 * Sources. Ride data: RCDB 8788 (681 m of track, 114.8 ft / 35 m high, 90 km/h,
 * 4 inversions, 90° vertical angle, 4.3 g; elements: 114.8 ft vertical chain
 * lift, 98.4 ft loop, 82 ft zero-g roll, 112° overbanked curve, dive loop,
 * corkscrew; 15 x 260 m), Wikipedia "Thunderbolt (2014 roller coaster)" (the
 * ride in order: a 180° left turn out of the station, the vertical lift, the
 * 90° drop, the vertical loop, a zero-g roll to the left, a leftward Stengel
 * dive, a dive loop to the right, two airtime hills, a right-hand corkscrew,
 * an off-axis bunny hill, the brakes). Plan: the four OSM
 * `roller_coaster=track` ways (way/654800206, way/355344498, way/654800208,
 * way/654800209) and the station way/405891529, checked against a USGS NAIP
 * orthophoto (public domain): the station roof, the loop's shadow and the
 * long strip along West 15th Street sit on the trace.
 *
 * The OSM ways are drawn against the direction of travel: only reversed do
 * they give Wikipedia's 180° left turn out of the station and a left turn at
 * the Surf Avenue end. So the circuit runs from the station on the west leg
 * south, round the U-turn by the boardwalk, north up the east leg into the
 * lift tower, out along West 15th Street, round the Surf Avenue end and back
 * down the west side. OSM's scribble at the foot of the lift is left out, the
 * lift-to-loop run is drawn as one straight line at bearing 354° (the lift
 * and drop faces of the tower and the loop are in line in every photo), the
 * bend after the loop is eased, and the return run between y -30 and -75 is
 * moved about 2 m east, where OSM put the two runs closer than two trains.
 *
 * The ride as modelled (s along the polyline, heights of the running surface):
 *   station, west leg, 2.5 m (the platform is boardwalk height); U-turn left
 *   vertical lift up the south face of the tower, 36.3 m crest (published
 *     114.8 ft is the top of the structure), 90° drop down the north face,
 *     drawn as a `path`, both legs leaning 2° so the riders' up stays defined
 *   vertical loop, 27 m, s 101-130
 *   zero-g roll to the left on a 19 m hill, top 21.6 m, s 158-182
 *   low run along West 15th Street, then a straight climb to the Stengel
 *     dive at the Surf Avenue end: 24.5 m crest, banked 112° at the turn
 *   dive loop to the right on a 15 m hill, top 19.3 m, s 333-353 (drawn as a
 *     roll in line: OSM's return run has no reversal)
 *   two airtime hills (8 m, 5.5 m), under the outbound run at 1.3 m
 *   corkscrew to the right, s 440-458, then the off-axis bunny hill, brakes
 * Drawn track 686 m (published 681); top speed 93 km/h (published 90).
 *
 * Heights. The lift is published. Lidar (USGS NY_NewYorkCity, 2017) was
 * fetched but holds almost nothing of the ride: the tower, loop and track are
 * thin steel and come back as a few scattered returns (8-9 m at the Surf
 * Avenue turn), so every other height is estimated from photos taken from
 * known sides, matched against perspective renders: the loop at 27 m (RCDB's
 * 98.4 ft reads too tall beside the tower in the photos from the west and
 * south), the zero-g roll's top at 22 m (published 82 ft is 25 m), the Surf
 * Avenue crest at 24.5 m (from the photo from West 15th Street), the dive
 * loop, hills and corkscrew invented to fit the photos and the energy check.
 *
 * The profile is height over plan distance, so it can't hold the vertical
 * lift: under the drawn `path` it climbs to a 26 m stand-in crest and the
 * chain hands the train the rest of the 36.3 m as head (LIFT_HEAD), so the
 * energy walk after the drop is the real one. REPORT's "losses % of the lift
 * height" and its steepest pitch change (at s 75) refer to that stand-in,
 * which is not drawn.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *   "Thunderbolt 2014-08-11 view from west" and "... view from east", Qaswed,
 *     CC BY-SA 4.0
 *   "Thunderbolt roller coaster, Coney Island (June 2016)", MusikAnimal, CC BY-SA 4.0
 *   "Thunderbolt Coney Island" and "Thunderbolt Coney Island 2", Rhododendrites, CC BY-SA 4.0
 *   "Thunderbolt rollercoaster 2014 Coney Island", Steven Lek, CC BY-SA 4.0
 *   "Coney Island Brooklyn Jul 2019 06", "07", "08", "09", "19", Epicgenius, CC BY-SA 4.0
 *   "Coney Is Thunderbolt 01"-"04", Tdorante10, CC BY-SA 4.0
 * Look-only: none.
 *
 * Style: one broad orange ribbon (rails and spine in the photos' orange,
 * pulled to the palette's lightness), drawn bolder than the real track, on
 * chunky white columns and A-frames. The lift tower is four chunky white
 * corner columns with a band and one brace per face every 6.9 m (the real
 * one is a fine lattice), carrying a red THUNDERBOLT board with a white face
 * on its west and east faces, its stacked capitals built with ./lettering.ts
 * (the sign is the ride's best-known feature, STYLE.md "Famous signs"). A second board on a
 * white mast stands at the Surf Avenue end. The station is its blue canopy on
 * posts. The boardwalk entrance is the ticket booth (way/1017690947) under a
 * white truss gate with the arched red board between two red posts.
 *
 * Doubts: the order is published, but where each element stands along the
 * plan is read from photos; the dive loop is drawn as an in-line roll; OSM's
 * trace may be a few metres off the real track (the NAIP's lean hides it).
 */
import { buildCoaster, type CoasterKit } from './coaster-kit'
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { Pen, strokes } from './lettering'

// The park frame: metres east and north of lon -73.9778, lat 40.575 (the
// Cyclone's frame), equirectangular.
const ORIGIN: [number, number] = [-73.9778, 40.575]

// The OSM circuit (way/654800206, way/355344498, way/654800208,
// way/654800209), node by node in the direction of travel, which is the
// reverse of the ways' drawn direction (see the header). It starts at the
// north end of the station on the west leg, heading south. OSM's scribble at
// the foot of the lift (a back-and-forth between y -148 and -162) is left
// out: the lift, crest and drop are drawn by the `path` below.
const CHAIN: [number, number][] = [
  [-371.0, -187.0], [-369.2, -201.2], [-368.1, -208.1], [-367.3, -210.3], [-365.6, -211.6], [-363.9, -211.8], [-362.2, -211.5],
  [-360.9, -210.6], [-359.9, -209.5], [-359.6, -207.8], [-361.3, -193.6], [-364.4, -177.5], [-367.0, -166.0], [-368.0, -156.1], [-369.5, -142.1], [-370.2, -135.2], [-371.0, -128.2], [-371.8, -120.3], [-372.6, -112.3],
  [-373.2, -107.6], [-375.8, -104.6], [-379.8, -101.2], [-384.9, -96.1], [-386.1, -90.4], [-386.4, -85.1], [-387.0, -78.6], [-385.5, -68.2], [-384.6, -60.8],
  [-383.9, -52.9], [-383.6, -45.6], [-385.3, -38.0], [-391.8, -22.4], [-394.8, -14.8], [-396.0, -6.4], [-397.0, 0.3],
  [-396.5, 6.9], [-390.6, 17.5], [-389.4, 22.8], [-390.3, 28.3], [-392.1, 31.8], [-395.9, 33.5], [-398.6, 32.3],
  [-400.6, 29.7], [-400.5, 24.4], [-398.7, 18.3], [-394.7, 11.9], [-391.0, 7.1], [-387.2, -5.0], [-384.3, -16.3],
  [-380.6, -31.8], [-378.9, -42.5], [-377.3, -58.2], [-377.1, -66.2], [-376.9, -75.0], [-378.2, -85.9], [-378.6, -92.9],
  [-380.6, -97.2], [-381.7, -103.0], [-378.9, -130.2], [-375.3, -158.9], [-374.3, -165.4], [-372.6, -175.9], [-371.7, -181.3],
]

// The lift tower's axis: from the foot of the lift towards the pull-out, in
// plan (bearing about 348°, along the east leg into the outbound run).
const B0: [number, number] = [-367.0, -166.0]
const U: [number, number] = [Math.sin((-6 * Math.PI) / 180), Math.cos((-6 * Math.PI) / 180)]
const along = (d: number, h: number): [number, number, number] => [B0[0] + U[0] * d, B0[1] + U[1] * d, h]
// Lift up the south face, a semicircular crest over the tower, drop down the
// north face. Both legs lean 2° off vertical so the riders' up stays defined
// on them (the kit takes it from the push of the track, which a truly
// vertical straight doesn't give).
const LIFT_D = 7.4, DROP_D = 13.0, TOP = 36.3, LEAN = (2 * Math.PI) / 180
const LIFT_PATH: [number, number, number][] = (() => {
  const pts: [number, number][] = [] // (d along the axis, height)
  const arc = (cd: number, ch: number, r: number, a0: number, a1: number, n: number) => {
    for (let k = 0; k <= n; k++) { const a = a0 + ((a1 - a0) * k) / n; pts.push([cd + r * Math.cos(a), ch + r * Math.sin(a)]) }
  }
  const R1 = 5, R2 = 9, Z0 = 2.5, Z1 = 1.2, T = Math.tan(LEAN)
  // The legs lean in towards each other by LEAN; the crest is the arc
  // joining their tops, which stand RC apart either side of the tower's axis.
  const RC = (DROP_D - LIFT_D) / 2 / Math.cos(LEAN), mid = (LIFT_D + DROP_D) / 2
  const legTop = TOP - RC
  const liftAt = (h: number) => LIFT_D - (legTop - h) * T, dropAt = (h: number) => DROP_D + (legTop - h) * T
  // Foot of the lift: level to the leg's lean, radius R1.
  const h1 = Z0 + R1 * (1 - Math.sin(LEAN))
  arc(liftAt(h1) - R1 * Math.cos(LEAN), Z0 + R1, R1, -Math.PI / 2, -LEAN, 10)
  for (let h = h1 + 4; h < legTop - 2; h += 5) pts.push([liftAt(h), h])
  arc(mid, legTop - RC * Math.sin(LEAN) + RC * Math.sin(LEAN), RC, Math.PI - LEAN, LEAN, 16)
  const h2 = Z1 + R2 * (1 - Math.sin(LEAN))
  for (let h = legTop - 4; h > h2 + 2; h -= 5) pts.push([dropAt(h), h])
  // Pull-out, radius R2.
  arc(dropAt(h2) + R2 * Math.cos(LEAN), Z1 + R2, R2, Math.PI + LEAN, 1.5 * Math.PI, 12)
  return pts.slice(1, -1).map(([d, h]) => along(d, h))
})()

// The profile can't hold a vertical lift (it is height over plan distance),
// so under the drawn lift it climbs only to a 26 m stand-in crest, and the
// chain hands the train the rest of the 36.3 m crest's height as head.
const LIFT_HEAD = TOP - 26

const ORANGE = 0xe27a3c, WHITE = 'trim'

function tube(p: Part, a: V3, b: V3, r: number, sides = 6) {
  const ax = sub(b, a), L = Math.hypot(...ax), n: V3 = [ax[0] / L, ax[1] / L, ax[2] / L]
  const ref: V3 = Math.abs(n[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  let u = cross(n, ref); const ul = Math.hypot(...u); u = [u[0] / ul, u[1] / ul, u[2] / ul]
  const v = cross(n, u)
  const ring = (c: V3, k: number): [V3, V3] => {
    const t = (k / sides) * 2 * Math.PI, d: V3 = [u[0] * Math.cos(t) + v[0] * Math.sin(t), u[1] * Math.cos(t) + v[1] * Math.sin(t), u[2] * Math.cos(t) + v[2] * Math.sin(t)]
    return [[c[0] + d[0] * r, c[1] + d[1] * r, c[2] + d[2] * r], d]
  }
  for (let k = 0; k < sides; k++) {
    const [a0, n0] = ring(a, k), [a1, n1] = ring(a, k + 1), [b0] = ring(b, k), [b1] = ring(b, k + 1)
    p.tri(a0, a1, b1, undefined, undefined, undefined, [n0, n1, n1])
    p.tri(a0, b1, b0, undefined, undefined, undefined, [n0, n1, n0])
  }
}
/** A box with its long axis along plan direction (ux, uy), centred at c, half sizes [along, across, up]. */
function box(p: Part, c: V3, ux: number, uy: number, h: [number, number, number]) {
  const A: V3 = [ux * h[0], uy * h[0], 0], C: V3 = [-uy * h[1], ux * h[1], 0], Z: V3 = [0, 0, h[2]]
  const P = (i: number, j: number, k: number): V3 => [c[0] + A[0] * i + C[0] * j + Z[0] * k, c[1] + A[1] * i + C[1] * j + Z[1] * k, c[2] + A[2] * i + C[2] * j + Z[2] * k]
  const f = (a: V3, b: V3, cc: V3, d: V3) => { p.tri(a, b, cc); p.tri(a, cc, d) }
  f(P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1))
  f(P(-1, -1, -1), P(-1, 1, -1), P(1, 1, -1), P(1, -1, -1))
  f(P(1, -1, -1), P(1, 1, -1), P(1, 1, 1), P(1, -1, 1))
  f(P(-1, -1, -1), P(-1, -1, 1), P(-1, 1, 1), P(-1, 1, -1))
  f(P(-1, 1, -1), P(-1, 1, 1), P(1, 1, 1), P(1, 1, -1))
  f(P(-1, -1, -1), P(1, -1, -1), P(1, -1, 1), P(-1, -1, 1))
}


// The tower sign's letters, traced from the photos from the west and east
// ("Thunderbolt 2014-08-11 view from west / east", Qaswed): a bold condensed
// sans, each letter upright and stacked one under the next down the board.
// Centre-lines in units of the cap height; stroke 0.24.
const LETTER_H = 1.9, LETTER_PITCH = 2.15, LETTER_TOP = 31.4
const sg = (width: number, draw: (p: Pen) => void) => { const pen = new Pen(); draw(pen); return { width, pen } }
const SIGN_GLYPHS: Record<string, { width: number; pen: Pen }> = {
  T: sg(0.72, (p) => { p.moveTo([0.02, 0.9]).lineTo([0.7, 0.9]); p.moveTo([0.36, 0.9]).lineTo([0.36, 0]) }),
  H: sg(0.72, (p) => { p.moveTo([0.1, 0]).lineTo([0.1, 1]); p.moveTo([0.62, 0]).lineTo([0.62, 1]); p.moveTo([0.1, 0.5]).lineTo([0.62, 0.5]) }),
  U: sg(0.72, (p) => { p.moveTo([0.1, 1]).lineTo([0.1, 0.32]).arc([0.36, 0.32], Math.PI, 6).lineTo([0.62, 1]) }),
  N: sg(0.72, (p) => { p.moveTo([0.1, 0]).lineTo([0.1, 0.92]).lineTo([0.62, 0.08]).lineTo([0.62, 1]) }),
  D: sg(0.72, (p) => { p.moveTo([0.1, 0.1]).lineTo([0.1, 0.9]).lineTo([0.38, 0.9]).quadTo([0.62, 0.9], [0.62, 0.64], 4).lineTo([0.62, 0.36]).quadTo([0.62, 0.1], [0.38, 0.1], 4).lineTo([0.1, 0.1]) }),
  E: sg(0.68, (p) => { p.moveTo([0.6, 0.9]).lineTo([0.1, 0.9]).lineTo([0.1, 0.1]).lineTo([0.6, 0.1]); p.moveTo([0.1, 0.5]).lineTo([0.5, 0.5]) }),
  R: sg(0.72, (p) => { p.moveTo([0.1, 0]).lineTo([0.1, 0.9]).lineTo([0.42, 0.9]).arc([0.42, 0.7], -Math.PI, 6).lineTo([0.1, 0.5]); p.moveTo([0.38, 0.5]).lineTo([0.64, 0]) }),
  B: sg(0.72, (p) => { p.moveTo([0.1, 0.1]).lineTo([0.1, 0.9]).lineTo([0.4, 0.9]).arc([0.4, 0.7], -Math.PI, 6).lineTo([0.1, 0.5]); p.moveTo([0.1, 0.5]).lineTo([0.42, 0.5]).arc([0.42, 0.3], -Math.PI, 6).lineTo([0.1, 0.1]) }),
  O: sg(0.72, (p) => { p.circle([0.36, 0.5], 0.26, 0.4, 14) }),
  L: sg(0.66, (p) => { p.moveTo([0.1, 1]).lineTo([0.1, 0.1]).lineTo([0.6, 0.1]) }),
}

function extras(kit: CoasterKit) {
  if (process.env.DBG) { let L = 0, p = kit.at(0).p; for (let ps = 0.25; ps < 518; ps += 0.25) { const q = kit.at(ps).p; L += Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]); p = q } console.log('drawn length', L.toFixed(0)) }
  const white = kit.parts.supports
  const red = new Part()
  const m = (q: [number, number]) => kit.toModel(q)
  // The lift tower: a square lattice shaft between the lift and drop legs,
  // drawn as four chunky corner columns, a band every 6 m and one brace per
  // face per bay, with the service platform at the top.
  const c = along((LIFT_D + DROP_D) / 2, 0)
  const [cx, cy] = m([c[0], c[1]])
  const HW = (DROP_D - LIFT_D) / 2 - 1.3 // half width along the axis, inside the track spines
  const HC = 2.6                          // half width across
  const ux = U[0], uy = U[1], vx = -uy, vy = ux
  const corner = (i: number, j: number, z: number): V3 => [cx + ux * HW * i + vx * HC * j, cy + uy * HW * i + vy * HC * j, z]
  const corners: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  const TOWER = 33.5
  for (const [i, j] of corners) tube(white, corner(i, j, -0.5), corner(i, j, TOWER), 0.5)
  for (let z = 6; z <= TOWER; z += 6.9) {
    for (let k = 0; k < 4; k++) {
      const [i0, j0] = corners[k], [i1, j1] = corners[(k + 1) % 4]
      tube(white, corner(i0, j0, z), corner(i1, j1, z), 0.35, 4)
      if (z + 6.9 <= TOWER + 0.1) tube(white, corner(i0, j0, z), corner(i1, j1, z + 6.9), 0.28, 4)
    }
  }
  box(white, [cx, cy, TOWER + 0.4], ux, uy, [HW + 0.5, HC + 0.7, 0.4])
  // The THUNDERBOLT boards on the west and east faces of the tower: a red
  // board carrying a white face, lettered below.
  for (const sg of [1, -1]) {
    const wx = cx + vx * (HC + 0.45) * sg, wy = cy + vy * (HC + 0.45) * sg
    box(red, [wx, wy, 19.5], ux, uy, [1.25, 0.3, 13])
    box(white, [wx + vx * 0.35 * sg, wy + vy * 0.35 * sg, 19.5], ux, uy, [1.08, 0.08, 12.5])
    // The lettering: upright capitals stacked top to bottom, read from
    // outside the face (west face: the reader's right is south, -U; east
    // face: north, +U), standing 0.12 m proud of the white face.
    const fx = wx + vx * 0.43 * sg, fy = wy + vy * 0.43 * sg
    const rx = -ux * sg, ry = -uy * sg
    'THUNDERBOLT'.split('').forEach((ch, i) => {
      const g = SIGN_GLYPHS[ch], base = LETTER_TOP - LETTER_H - i * LETTER_PITCH
      const place = (u: number, v: number, w: number): V3 => {
        const du = (u - g.width / 2) * LETTER_H
        return [fx + rx * du + vx * sg * w, fy + ry * du + vy * sg * w, base + v * LETTER_H]
      }
      strokes(red, g.pen.paths, { width: 0.24, depth: 0.12, place })
    })
  }

  // The second THUNDERBOLT sign, at the Surf Avenue end: a tall red board
  // on a white mast, facing the corner of West 15th Street.
  const [nx, ny] = m([-392.5, 37.5])
  tube(white, [nx, ny, -0.5], [nx, ny, 7], 0.45)
  box(red, [nx, ny, 14], 1, 0, [0.35, 1.2, 8])
  box(white, [nx + 0.4, ny, 14], 1, 0, [0.06, 0.75, 7.3])

  // The entrance on the boardwalk: the ticket booth (way/1017690947) under a
  // white truss gate, drawn as a solid band whose top follows the arched red
  // THUNDERBOLT board, between two tall red posts.
  const booth = kit.parts.stone
  const b0 = m([-369.7, -216.6]), b1 = m([-362.6, -215.5])
  const bx = (b0[0] + b1[0]) / 2, by = (b0[1] + b1[1]) / 2 - 1.5
  const bl = Math.hypot(b1[0] - b0[0], b1[1] - b0[1]), ex = (b1[0] - b0[0]) / bl, ey = (b1[1] - b0[1]) / bl
  box(booth, [bx, by, 2.1], ex, ey, [3.7, 1.5, 2.1])
  box(white, [bx, by, 4.35], ex, ey, [7.2, 1.0, 0.2])
  const SPAN = 7.2, RISE = 1.8, BASE = 7.6
  const archZ = (x: number) => BASE + RISE * (1 - (x / SPAN) ** 2)
  for (const sg of [-1, 1]) {
    const px = bx + ex * (SPAN + 0.35) * sg, py = by + ey * (SPAN + 0.35) * sg
    box(red, [px, py, 5.7], ex, ey, [0.35, 0.35, 5.7])
  }
  const N = 8
  for (let k = 0; k < N; k++) {
    const x0 = -SPAN + (2 * SPAN * k) / N, x1 = x0 + (2 * SPAN) / N, xm = (x0 + x1) / 2, z = Math.min(archZ(x0), archZ(x1))
    const cxk = bx + ex * xm, cyk = by + ey * xm, L = SPAN / N + 0.02
    box(white, [cxk, cyk, (4.55 + z - 0.5) / 2], ex, ey, [L, 0.25, (z - 0.5 - 4.55) / 2])
    box(red, [cxk, cyk, z + 0.35], ex, ey, [L, 0.35, 0.85])
  }
  return [{ part: red, material: finish('neon-thunderbolt-red', 0xc7393f) }]
}

await buildCoaster({
  name: 'Thunderbolt',
  out: '../models/nyc-thunderbolt.glb',
  origin: ORIGIN,
  chain: CHAIN,
  anchor: [-380, -89],
  // Coney Island is level beach fill under the ride: a flat ground.
  ground: { x0: -500, y0: -300, step: 200, rows: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], base: 2 },
  profile: [
    { name: 'station', s: 0, z: 2.5 },
    { name: 'station, south end', s: 14, z: 2.5 },
    { name: 'U-turn left, out', s: 55, z: 2.5 },
    { name: 'foot of the vertical lift', s: 66, z: 2.5, r: 7 },
    { name: 'top of the lift (stand-in, see LIFT_HEAD)', s: 82, z: 26, r: 8 },
    { name: 'foot of the 90° drop', s: 100, z: 1.2, r: 8 },
    { name: 'vertical loop, in', s: 101, z: 1.2 },
    { name: 'vertical loop, out', s: 129.5, z: 1.2 },
    { name: 'zero-g roll, crest', s: 170, z: 19 },
    { name: 'valley', s: 202, z: 2 },
    { name: 'low run along West 15th Street', s: 226, z: 2.5 },
    { name: 'Stengel dive (112° overbanked), crest', s: 277, z: 24.5 },
    { name: 'foot of the dive', s: 310, z: 2.2 },
    { name: 'dive loop, crest', s: 343, z: 15 },
    { name: 'valley', s: 369, z: 3.5 },
    { name: 'airtime hill', s: 384, z: 8 },
    { name: 'valley', s: 400, z: 3.5 },
    { name: 'second airtime hill', s: 414, z: 5.5 },
    { name: 'under the outbound', s: 429, z: 1.2 },
    { name: 'corkscrew, in', s: 440, z: 2.6 },
    { name: 'corkscrew, out', s: 458, z: 2.6 },
    { name: 'off-axis bunny hill', s: 469, z: 4.5 },
    { name: 'final brakes', s: 478, z: 2.5 },
  ],
  lift: [66, 82],
  liftHead: LIFT_HEAD,
  brakes: [{ from: 478, to: 66, z: 2.5, head: 0.4 }],
  inversions: [
    { kind: 'path', name: 'vertical lift, crest and 90° drop', from: 64, to: 100, points: LIFT_PATH },
    { kind: 'loop', name: 'vertical loop', from: 101, to: 129.5, height: 27, offset: 2.5 },
    { kind: 'roll', name: 'zero-g roll', from: 158, to: 182, radius: 2, dir: 'left' },
    { kind: 'roll', name: 'dive loop', from: 332, to: 352, radius: 2.5, dir: 'right' },
    { kind: 'roll', name: 'corkscrew', from: 440, to: 458, radius: 3, dir: 'right' },
  ],
  banks: [{ from: 271, to: 293, deg: 112, name: 'Stengel dive' }],
  losses: [0.012, 0.0004],
  track: { W: 3.0, RAIL: 0.6, DEPTH: 1.6, SPINE: 1.1 }, // drawn bolder than the real 1.2 m track so it reads at map scale
  station: {
    ring: [[-373.8, -192.7], [-373.3, -192.6], [-366.7, -191.8], [-364.6, -206.5], [-370.0, -207.3], [-371.5, -207.5], [-371.9, -207.6]],
    posts: [[-373.2, -193.5], [-366.9, -192.6], [-365.2, -205.6], [-371.3, -206.6]],
    roofZ: 6.5,
  },
  colours: { deck: ['thunderbolt-orange', ORANGE], spine: 'deck', supports: WHITE, stationRoof: ['thunderbolt-blue', 0x5b7fbf] },
  supportR: [0.5, 0.62, 0.75],
  meta: { height: 36.3, trackLength: 681 },
  extras,
})
