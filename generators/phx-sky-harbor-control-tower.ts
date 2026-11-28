/**
 * Phoenix Sky Harbor International Airport air traffic control tower
 * (FAA tower, opened 2007) and its base building — original procedural
 * geometry, CC0-1.0.
 * bun generators/phx-sky-harbor-control-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * centre of OSM way/503702180 ("PHX Tower", man_made=tower,
 * tower:type=airport_control, height 99 m), -112.005883, 33.435319.
 * Bearing 0: the base building's walls run east-west and north-south.
 *
 * The tower way is not a building. It stands inside the two-storey base
 * building way/180190838 (3548 E Sky Harbor Blvd, building=yes, 2 levels),
 * whose outline runs round the tower's foot; the model draws that building
 * too, so `replaces` is [way/180190838].
 *
 * Identity (from the photos below):
 *  1. A plain tan concrete shaft, faceted (a square with broad chamfered
 *     corners), about 13 m across.                         (cyg, des)
 *  2. The flared crown below the cab: a cone widening upward, wrapped in
 *     orange-brown fins and broad panels that fan out and taper to points
 *     on the shaft, with white bands and dark window bands between them.
 *                                                          (cyg, des, brab)
 *  3. A white ledge on top of the crown, a white neck, the dark cab
 *     glazing leaning outward, and the white flat cab roof.  (cyg, des)
 *  4. The low base: a brown-clad block with a round drum at its east end,
 *     and a lower glazed block on the tower's north side.    (cyg, NAIP)
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020), 0.5 m grid
 * on the tower and 1 m on the base, above the apron and road round it
 * (ground_min + 4.8 m, flat within 0.3 m). Measured: the cab roof 96.6 with
 * its rim 97.8, roof radius about 8; the crown ledge 87.8 at radius 10.5;
 * the base's main block 15.1 (parapet 16.2), the drum's rim 17–18.5, the
 * north block 8.2. Published: 326 ft / 99 m overall (Wikipedia, OSM
 * height), which includes the masts on the roof.
 * Scaled from cyg (0.093 m a pixel, set by the lidar's 87.8 m ledge): the
 * cab glazing 90.1–95.2 m, the neck 87.9–90.1, the crown body 65.5–87.4
 * (radius 8.6 at the foot, 10.2 at the top), the fins' points 62.7, the
 * window bands, the shaft's width (12.8 m).
 * Plan of the base: lidar and NAIP (main block x 11..60, y -7..20.5; drum
 * centre (46.5, 9.5), radius 13.5; north block x -10..5, y 6..34), which
 * agree with OSM way/180190838 within a metre or two.
 *
 * Estimated: the number of fins (8 broad panels and 8 narrow blades, from
 * the half seen in cyg), the shaft's chamfers, the north block's glazing.
 *
 * Photos (evidence, Wikimedia Commons):
 *  cyg   "Sky Harbor - 2008-08-29 - Control Tower.jpg", Cygnusloop99,
 *        CC BY-SA 3.0, from the north-north-west on the apron
 *        https://commons.wikimedia.org/wiki/File:Sky_Harbor_-_2008-08-29_-_Control_Tower.jpg
 *  des   "PHX control tower 20250508.jpg", Designism, CC0, from the north
 *        https://commons.wikimedia.org/wiki/File:PHX_control_tower_20250508.jpg
 *  brab  "Phoenix-sky-harbor-control-tower.jpg", Braboowi at en.wikipedia,
 *        CC BY-SA 3.0, aerial with the base building
 *        https://commons.wikimedia.org/wiki/File:Phoenix-sky-harbor-control-tower.jpg
 *  NAIP  USGS NAIP orthophoto (public domain): the plan of the base and the
 *        white roofs.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the south and east faces of the crown are seen only in the
 * aerial; the fins are drawn evenly all round. The base's south side and
 * its entrances are in no photo, so no doors are drawn. The roof masts
 * (to 99 m) are left out.
 *
 * Night: the crown's window bands are offices (`window`); the cab glass
 * stays dark (`cab-glass`), as a working tower cab does.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, capPoly, ccw, circle, prism, save, smoothWall, type XY } from './atl-flatiron-building'
import { revolve } from './atl-tech-tower'

/** A flat face with its normal, fanned from the first corner. */
function face(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n])
}

/**
 * A plate standing in the vertical plane at angle `th`: `prof` is a convex
 * [r, z] outline, extruded `hw` either side along the tangent.
 */
function plate(p: Part, th: number, prof: [number, number][], hw: number) {
  const u: V3 = [Math.cos(th), Math.sin(th), 0], t: V3 = [-Math.sin(th), Math.cos(th), 0]
  const P = ([r, z]: [number, number], s: number): V3 => [u[0] * r + t[0] * s, u[1] * r + t[1] * s, z]
  face(p, prof.map((q) => P(q, hw)), t)
  face(p, prof.map((q) => P(q, -hw)), [-t[0], -t[1], 0])
  const cr = prof.reduce((a, q) => a + q[0], 0) / prof.length, cz = prof.reduce((a, q) => a + q[1], 0) / prof.length
  for (let i = 0; i < prof.length; i++) {
    const a = prof[i], b = prof[(i + 1) % prof.length]
    let nr = b[1] - a[1], nz = -(b[0] - a[0])
    if (nr * ((a[0] + b[0]) / 2 - cr) + nz * ((a[1] + b[1]) / 2 - cz) < 0) { nr = -nr; nz = -nz }
    const l = Math.hypot(nr, nz) || 1
    const n: V3 = [u[0] * nr / l, u[1] * nr / l, nz / l]
    face(p, [P(a, hw), P(b, hw), P(b, -hw), P(a, -hw)], n)
  }
}

if (import.meta.main) {
  const shaft = new Part(), white = new Part(), fin = new Part(), win = new Part(), cab = new Part(), clad = new Part()

  // ── The shaft: a 12.8 m square with broad chamfers, to the crown. ──
  const H = 6.4, C = 2.2
  const SHAFT: XY[] = ccw([[H, -H + C], [H, H - C], [H - C, H], [-H + C, H], [-H, H - C], [-H, -H + C], [-H + C, -H], [H - C, -H]])
  prism(shaft, SHAFT, 0, 66, null, 0)

  // ── The crown: a 16-sided cone from r 8.6 at 65.5 to r 10.2 at 87.4. ──
  const Z0 = 65.5, Z1 = 87.4, R0 = 8.6, R1 = 10.2, N = 16
  const rAt = (z: number) => R0 + ((R1 - R0) * (z - Z0)) / (Z1 - Z0)
  // underside: a cone from the shaft out to the crown's foot
  revolve(white, [0, 0], [[6.2, 64.2], [R0, Z0]], N, Math.PI / N, true, false)
  // white body, with three dark window bands set just proud of it
  revolve(white, [0, 0], [[R0, Z0], [R1, Z1]], N, Math.PI / N, true, false)
  for (const [a, b] of [[67.4, 70.6], [72.5, 76.2], [79.0, 81.6], [83.0, 84.4]] as const) {
    revolve(win, [0, 0], [[rAt(a) + 0.08, a], [rAt(b) + 0.08, b]], N, Math.PI / N, true, false)
  }
  // the ledge: a thin white disc overhanging the crown
  revolve(white, [0, 0], [[R1, Z1], [10.8, Z1], [10.8, 87.9], [8.2, 87.9]], N, Math.PI / N, true, false)

  // fins: 8 broad panels and 8 narrow blades, alternating, fanning out
  // with the cone and tapering to points on the shaft.
  for (let k = 0; k < 16; k++) {
    const th = (k / 16) * Math.PI * 2 + Math.PI / 16
    const broad = k % 2 === 0
    const d = broad ? 0.5 : 1.3, hw = broad ? 1.5 : 0.3
    // the point on the shaft, then the lower and upper parts along the cone
    plate(fin, th, [[6.0, 62.7], [R0 + d + 0.3, Z0], [R0 - 0.1, Z0]], hw)
    plate(fin, th, [[R0 - 0.1, Z0], [R0 + d + 0.3, Z0], [R1 + d, Z1 + 0.3], [R1 - 0.1, Z1 + 0.3]], hw)
  }

  // ── The cab: a white neck, glazing leaning out, a white roof. ──
  revolve(white, [0, 0], [[8.0, 87.9], [7.6, 90.1], [6.9, 90.1]], N, Math.PI / N, true, false)
  revolve(cab, [0, 0], [[6.9, 90.1], [7.7, 95.2]], N, Math.PI / N, true, false)
  revolve(white, [0, 0], [[7.7, 95.2], [8.3, 95.4], [8.3, 97.6], [7.5, 97.8], [0, 97.8]], N, Math.PI / N, true, false)

  // ── The base building (way/180190838). ──
  // Main block: brown cladding, white roof, a parapet; the drum at its east end.
  box(clad, 11, 47, -7, 20.5, 0, 16.2, white, 0.4)
  const drum = circle([46.5, 9.5], 13.5, 20)
  smoothWall(clad, drum, 0, 17.6)
  capPoly(white, ccw(drum), 17.6, true)
  // a link round the tower's foot to the main block
  box(clad, 4, 11.2, -9, 8, 0, 8.2, white, 0.3)
  // North block: 8.2 m, pale with two glazed bands.
  box(shaft, -10, 5, 5.5, 34, 0, 8.2, white, 0.3)
  for (const [z0, z1] of [[1.2, 3.4], [4.6, 6.9]] as const) {
    box(win, -10.08, 5.08, 8.5, 31.5, z0, z1, null, 0) // west & east faces
    box(win, -7.5, 2.5, 31.5, 34.08, z0, z1, null, 0) // north face
  }

  await save('phx-sky-harbor-control-tower', 'Phoenix Sky Harbor Air Traffic Control Tower', [
    { part: shaft, material: finish('phx-tower-concrete', 0xd8c8a2) },
    { part: white, material: PALETTE.trim },
    { part: fin, material: finish('phx-tower-orange', 0xd28f55) },
    { part: win, material: PALETTE.window },
    { part: cab, material: finish('cab-glass', 0x56656f, 0.3) },
    { part: clad, material: finish('phx-tower-brown', 0xa8765e) },
  ], { height: 97.8, anchor: [33.435319, -112.005883], bearing: 0 })
}
