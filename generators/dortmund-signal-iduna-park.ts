/**
 * Signal Iduna Park (Westfalenstadion), Dortmund: original procedural
 * geometry, CC0-1.0, no textures.  bun generators/dortmund-signal-iduna-park.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/dortmund-signal-iduna-park.glb, the low model (<= 6,500 triangles);
 * - models/dortmund-signal-iduna-park.detail.glb, drawn from zoom 16
 *   (<= 40,000): the pylons as boxed lattice masts, the grey roof girders
 *   as open trusses with diagonals, stepped stands.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 351.9 (the
 * pitch's long edges, OSM inner way/1248312352, 118.8 x 73.4 m): model +y
 * runs along the pitch to the north stand, -y to the Südtribüne. Anchor =
 * the pitch centre, lng 7.4518179, lat 51.4926047. In this frame the OSM
 * outline (way/17235929, leisure=stadium, outer of building
 * relation/531985) runs x -95.6..97.5, y -122..116: the south stand is the
 * deeper one, as the Yellow Wall is.
 *
 * Identity, in order: the eight bright yellow pylons standing outside the
 * facade near the corners (two to a corner, one on each side), each a
 * tall mast with its arm and ties reaching over the roof; the boxy plan
 * with its corners filled and rounded; the grey roof girders along the
 * opening's four edges, hung from the pylons; the pale roof with its dark
 * solar panels; the steep single-tier Südtribüne (Yellow Wall) against the
 * two-tier west, north and east stands; black seats in yellow bands; the
 * pale concrete stair towers of the facade between dark glass.
 *
 * Evidence
 *  - OSM (measured in this frame): outline way/17235929 as above, corner
 *    radius about 32 m (fitted); pitch inner way/1248312352; east stand
 *    way/652233026 (building=grandstand, x 86-118 band) and the west
 *    annexes way/591653301 (building=stadium) and way/1205867056
 *    (construction) at the facade. Stadion Rote Erde (south-east) is not
 *    part of this model.
 *  - Published (de.wikipedia "Signal Iduna Park"): roof carried by
 *    "außengeführten, leuchtend gelben Stahlpylone"; Südtribüne one tier,
 *    24,454 standing; west and east upper tiers 1995-99, north upper tier
 *    later, corners filled 2002-03; 81,365 capacity; the north stand's
 *    outside glazed.
 *  - Facade: pale concrete with three glass bands (ground floor, the
 *    concourse levels, the ribbon under the fascia) behind the stair
 *    towers, as in vonoben and am5.
 *  - Heights: ESTIMATED, scaled from vonoben (the long side from the
 *    Florianturm, 2.9 px/m on the 238 m length): facade 0-33, roof edge
 *    36, roof rising to 40 at the opening, girders to 47, pylons 62;
 *    tiers from am5 and am6.
 *  - Elevation 0: the map's Mapterhorn z15 terrain has the pitch at the
 *    lowest point under the footprint and the ground round the stadium
 *    1-7 m above it (rising to the south-east); the facade runs down to
 *    the pitch's level and sinks into the higher ground.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - am1-am7: Arne Müseler / www.arne-mueseler.com, "Signal iduna park
 *      stadium dortmund 1.jpg" ... "7.jpg", CC BY-SA 3.0 de: drone views
 *      from every side: pylons, girders, roof and solar panels, seats.
 *      https://commons.wikimedia.org/wiki/File:Signal_iduna_park_stadium_dortmund_5.jpg
 *      https://commons.wikimedia.org/wiki/File:Signal_iduna_park_stadium_dortmund_6.jpg
 *    - vonoben: Hornymanatee (uploader; no author named), "Westfalenstadion
 *      von oben.jpg", CC BY-SA 3.0: the long
 *      side from the Florianturm, for heights.
 *      https://commons.wikimedia.org/wiki/File:Westfalenstadion_von_oben.jpg
 *    - flor2: Zairon, "Dortmund Blick vom Florianturm auf den Signal Iduna
 *      Park 2.jpg", CC BY-SA 4.0.
 *      https://commons.wikimedia.org/wiki/File:Dortmund_Blick_vom_Florianturm_auf_den_Signal_Iduna_Park_2.jpg
 *    - unger: Markus Unger, "2012-02-26 Dortmund01 (6791756854).jpg", CC BY
 *      2.0: the Südtribüne from inside.
 *      https://commons.wikimedia.org/wiki/File:2012-02-26_Dortmund01_(6791756854).jpg
 *    - westnw: Matthias Nonnenmacher, "Westfalenstadion Signal-Iduna-Park
 *      Westtribüne von-NW März-2013.JPG", CC BY-SA 4.0, at night: lit pylons.
 *      https://commons.wikimedia.org/wiki/File:Westfalenstadion_Signal-Iduna-Park_Westtrib%C3%BCne_von-NW_M%C3%A4rz-2013.JPG
 *  No lidar or NAIP exists here (outside the US); no commercial imagery.
 *
 * Invented or simplified, and doubts:
 *  - The plan is a rounded rectangle fitted to the OSM outline; tiers are
 *    plain rakes on rounded rectangles; the box bands are drawn on the
 *    west, north and east only.
 *  - Pylon positions: about 68 m from the centre line on the long sides
 *    and 60 m on the ends, 7 m out from the facade, scaled from am5 and
 *    vonoben (no OSM nodes for them). Each pylon is drawn as a mast with
 *    one arm over the roof and two ties from its head to the roof; the
 *    real heads are more intricate.
 *  - The solar panels are dark fields on the long sides' roofs and the
 *    ends; the BVB logo on the south roof is left out.
 *  - Seats: black with yellow bands at about every third bay; the
 *    Südtribüne yellow-and-black in wider bands.
 *  - Night: the pylons are floodlit yellow (westnw); the facade glazing
 *    is `window`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { rrect, ring, band, bar, truss, writeLods, type XY } from './milan-san-siro'
import { face, vadd, vsub, vmul, vlerp, nrm3 } from './seoul-world-cup-stadium'

const BEARING = 351.9

// Rings (west, east, south, north half-extents; corner radius).
const R_FRONT = rrect(43, 43, 66, 66, 8)
const R_L1 = rrect(66, 66, 89, 86, 18) // lower tier back
const R_U1 = rrect(68, 68, 91, 88, 20) // upper tier front
const R_U2 = rrect(91, 92.5, 117, 111, 28) // upper tier back
const R_FAC = rrect(95.6, 97.5, 122, 116, 32) // facade
const R_OPEN = rrect(42, 42, 63, 63, 4) // roof opening

const FAC_TOP = 33
const EDGE = 36
const OPEN_Z = 40

/** How much of the angle phi belongs to the Südtribüne (1 on it, 0 elsewhere). */
const southness = (f: number) => {
  const s = -Math.sin(f)
  return Math.min(1, Math.max(0, (s - 0.72) / 0.12))
}

function build(detail: boolean) {
  const concrete = new Part(), roof = new Part(), steel = new Part(), yellow = new Part(), dark = new Part(), win = new Part()
  const N = detail ? 160 : 64
  const phis = Array.from({ length: N }, (_, k) => -Math.PI + (k / N) * 2 * Math.PI)
  const IN = (q: V3): V3 => [-q[0], -q[1], 0]
  const OUT = (q: V3): V3 => [q[0], q[1], 0]
  const UP = (): V3 => [0, 0, 1]
  const DOWN = (): V3 => [0, 0, -1]
  const SEAT = (q: V3): V3 => [-q[0], -q[1], 150]
  const midf = (i: number) => phis[i] + Math.PI / N
  // seats: black, a yellow band every third segment; the south terrace two in three
  const seat = (i: number) => (southness(midf(i)) > 0.5 ? (i % 3 === 2 ? dark : yellow) : i % 3 === 0 ? yellow : dark)

  // --- The stands. The Südtribüne runs as one rake from the front to the
  // top; elsewhere a lower tier, the box band, an upper tier.
  const front = ring(R_FRONT, phis, 1.2)
  const top = ring(R_U2, phis, 38.5)
  const l1 = ring(R_L1, phis, 13).map((p, i) => {
    const w = southness(phis[i])
    // on the south, the point on the straight rake at the same plan position
    const t = Math.hypot(p[0] - front[i][0], p[1] - front[i][1]) / Math.hypot(top[i][0] - front[i][0], top[i][1] - front[i][1])
    return [p[0], p[1], 13 * (1 - w) + (1.2 + (38.5 - 1.2) * t) * w] as V3
  })
  const u1 = ring(R_U1, phis, 18).map((p, i) => {
    const w = southness(phis[i])
    const t = Math.hypot(p[0] - front[i][0], p[1] - front[i][1]) / Math.hypot(top[i][0] - front[i][0], top[i][1] - front[i][1])
    return [p[0], p[1], 18 * (1 - w) + (1.2 + (38.5 - 1.2) * t) * w] as V3
  })
  const steps = (A: V3[], B: V3[], n: number) => {
    if (!detail) { band(seat, A, B, SEAT); return }
    for (let s = 0; s < n; s++) {
      const a = A.map((p, i) => vlerp(p, B[i], s / n)), b = A.map((p, i) => vlerp(p, B[i], (s + 1) / n))
      const ar = a.map((q, i) => [q[0], q[1], b[i][2]] as V3)
      band(seat, a, ar, IN)
      band(seat, ar, b, UP)
    }
  }
  band(concrete, ring(R_FRONT, phis, 0), front, IN)
  steps(front, l1, 8)
  // box band: dark glazing between the tiers (vanishes on the south)
  const l1top = l1.map((p, i) => [p[0], p[1], Math.max(p[2], u1[i][2] - 1.2)] as V3)
  band(win, l1, l1top, IN)
  band(concrete, l1top, u1.map((p) => [p[0], p[1], p[2]] as V3), UP)
  steps(u1, top, 9)
  band(concrete, top, ring(R_U2, phis, 40), IN)

  // --- The facade: dark glass between pale stair towers, a ribbon of
  // windows under the white fascia.
  band(concrete, ring(R_FAC, phis, 0, -2.6), ring(R_FAC, phis, FAC_TOP, -2.6), OUT)
  for (const [z0, z1] of [[1.5, 6.8], [9.5, 27.8], [30, 32.4]]) band(win, ring(R_FAC, phis, z0, -2.56), ring(R_FAC, phis, z1, -2.56), OUT)
  for (const z of [8, 29]) {
    band(concrete, ring(R_FAC, phis, z - 1.2, -0.5), ring(R_FAC, phis, z, -0.5), OUT)
    band(concrete, ring(R_FAC, phis, z, -2.5), ring(R_FAC, phis, z, -0.5), UP)
    if (detail) band(concrete, ring(R_FAC, phis, z - 1.2, -2.5), ring(R_FAC, phis, z - 1.2, -0.5), DOWN)
  }
  band(concrete, ring(R_FAC, phis, FAC_TOP), ring(R_FAC, phis, EDGE + 0.4, 0.4), OUT) // fascia
  band(concrete, ring(R_FAC, phis, FAC_TOP, -2.5), ring(R_FAC, phis, FAC_TOP), DOWN)
  // stair towers on the straights
  const tower = (cx: number, cy: number, nx: number, ny: number, w: number) => {
    const tx = -ny, ty = nx, d = 3.2
    const pts: XY[] = [[cx - tx * w / 2 - nx, cy - ty * w / 2 - ny], [cx + tx * w / 2 - nx, cy + ty * w / 2 - ny], [cx + tx * w / 2 + nx * d, cy + ty * w / 2 + ny * d], [cx - tx * w / 2 + nx * d, cy - ty * w / 2 + ny * d]]
    const z0 = 0, z1 = FAC_TOP - 4
    for (let k = 0; k < 4; k++) {
      const a = pts[k], b = pts[(k + 1) % 4]
      const m: V3 = [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0]
      face(concrete, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], m)
    }
    face(concrete, pts.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  }
  for (const y of [-60, -34, -8, 18, 44]) { tower(-95.6, y + 5, -1, 0, 9); tower(97.5, y + 5, 1, 0, 9) }
  for (const x of [-52, -18, 18, 52]) { tower(x, -122, 0, -1, 9); tower(x, 116, 0, 1, 9) }

  // --- The roof: pale sheeting from the fascia up to the opening, dark
  // solar fields on it, the soffit under it.
  {
    const K = detail ? 3 : 1
    const outer = ring(R_FAC, phis, EDGE, 0.4), inner = ring(R_OPEN, phis, OPEN_Z)
    for (let k = 0; k < K; k++) {
      const A = outer.map((p, i) => vlerp(p, inner[i], k / K)), B = outer.map((p, i) => vlerp(p, inner[i], (k + 1) / K))
      band(roof, A, B, UP)
    }
    band(dark, inner, ring(R_OPEN, phis, OPEN_Z - 1.2), IN)
    band(concrete, ring(R_OPEN, phis, OPEN_Z - 1.2), ring(R_U2, phis, 38.6, 1), DOWN)
    // solar fields: dark panels lying just on the roof, on the straights
    const field = (x0: number, x1: number, y0: number, y1: number) => {
      const z = (x: number, y: number) => {
        // the roof's height at a plan point, by its place between outline and opening
        const f = Math.atan2(y, x)
        const ro = ring(R_FAC, [f], 0, 0.4)[0], ri = ring(R_OPEN, [f], 0)[0]
        const t = (Math.hypot(ro[0], ro[1]) - Math.hypot(x, y)) / (Math.hypot(ro[0], ro[1]) - Math.hypot(ri[0], ri[1]))
        return EDGE + (OPEN_Z - EDGE) * Math.min(1, Math.max(0, t)) + 0.25
      }
      const P = (x: number, y: number): V3 => [x, y, z(x, y)]
      const nx = detail ? 4 : 1
      for (let a = 0; a < nx; a++) {
        const xa = x0 + ((x1 - x0) * a) / nx, xb = x0 + ((x1 - x0) * (a + 1)) / nx
        face(dark, [P(xa, y0), P(xb, y0), P(xb, y1), P(xa, y1)], [0, 0, 1])
      }
    }
    for (const s of [-1, 1]) {
      field(s > 0 ? 52 : -80, s > 0 ? 80 : -52, -44, 44) // long sides
    }
    field(-32, 32, 72, 100) // north
    field(-32, 32, -106, -72) // south
  }

  // --- The grey girders along the opening, from pylon line to pylon line.
  {
    const GX = 45, GY = 66, ZB = 40.5, ZT = 47
    const lines: [XY, XY][] = [[[-GX, -112], [-GX, 106]], [[GX, -112], [GX, 106]], [[-90, -GY], [90, -GY]], [[-90, GY], [90, GY]]]
    for (const [A, B] of lines) {
      const L = Math.hypot(B[0] - A[0], B[1] - A[1])
      const n = Math.round(L / (detail ? 9 : 18))
      const at = (t: number, z: number): V3 => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, z]
      if (detail) {
        const sx = -(B[1] - A[1]) / L * 1.6, sy = (B[0] - A[0]) / L * 1.6
        for (const s of [-1, 1]) truss(steel, (t) => vadd(at(t, ZT), [sx * s, sy * s, 0]), (t) => vadd(at(t, ZB), [sx * s, sy * s, 0]), n, 0.9, 0.5, true)
      } else truss(steel, (t) => at(t, ZT), (t) => at(t, ZB), n, 1.4, 1.0, true)
    }
  }

  // --- The eight yellow pylons.
  {
    const H = 62
    const pylons: [number, number, number, number][] = [
      // x, y, outward normal x, y
      [-103, 68, -1, 0], [-103, -70, -1, 0], [105, 68, 1, 0], [105, -70, 1, 0],
      [-60, -129, 0, -1], [60, -129, 0, -1], [-60, 123, 0, 1], [60, 123, 0, 1],
    ]
    for (const [px, py, nx, ny] of pylons) {
      const base: V3 = [px, py, 0], head: V3 = [px, py, H]
      const n: V3 = [nx, ny, 0], t: V3 = [-ny, nx, 0]
      const mw = detail ? 3.2 : 3.2
      if (detail) {
        // a boxed lattice mast: four corner chords and cross bars
        const c = (s1: number, s2: number, z: number): V3 => vadd([px, py, z], vadd(vmul(n, s1 * mw / 2), vmul(t, s2 * mw / 2)))
        const C = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
        for (const [a, b] of C) bar(yellow, c(a, b, 0), c(a, b, H), 0.7, 0.7, n, true)
        for (let z = 6; z < H; z += 6)
          for (let k = 0; k < 4; k++) bar(yellow, c(C[k][0], C[k][1], z), c(C[(k + 1) % 4][0], C[(k + 1) % 4][1], z + 3), 0.4, 0.4, [0, 0, 1], false)
      } else bar(yellow, base, head, mw, mw, n, true)
      // the arm over the roof at 44 m and the ties from the head
      const reach = 20
      const armEnd = vadd([px, py, 44], vmul(n, -(reach + 8)))
      bar(yellow, [px, py, 44], armEnd, 1.8, 1.8, [0, 0, 1], false)
      for (const s of [-1, 1]) {
        const tieEnd = vadd(vadd([px, py, 41.5], vmul(n, -(reach + 8))), vmul(t, s * 14))
        bar(yellow, vadd(head, [0, 0, -1]), tieEnd, 1.5, 1.5, nrm3(vsub(tieEnd, head)).map((v, i) => (i === 2 ? 0 : v)) as V3, false)
      }
      bar(yellow, vadd(head, [0, 0, -1]), armEnd, 1.5, 1.5, t, false)
    }
  }

  const glow = () => 0.9
  return [
    { part: concrete, material: finish('sid-concrete', 0xe3e0d8) },
    { part: roof, material: finish('sid-roof', 0xd6d9da) },
    { part: steel, material: finish('sid-steel', 0x9aa1a8) },
    { part: yellow, material: { ...finish('sid-yellow', 0xf2cf1d), floodlight: glow } },
    { part: dark, material: finish('sid-dark', 0x5a6470) },
    { part: win, material: { ...PALETTE.window, color: 0x5f6b77 } },
  ]
}

if (import.meta.main)
  await writeLods('Signal Iduna Park', { bearing: BEARING, elevation: 0, height: 62 }, [
    { file: 'dortmund-signal-iduna-park.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'dortmund-signal-iduna-park.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1_500_000 },
  ])
