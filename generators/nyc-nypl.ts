/**
 * New York Public Library, Stephen A. Schwarzman Building, Fifth Avenue at
 * 42nd Street — procedural, CC0-1.0, no textures.
 * bun generators/nyc-nypl.ts
 *
 * Map frame: x = model east (Fifth Avenue), y = model north (42nd Street),
 * z up, metres. Placed at bearing 29°, the Manhattan grid. Anchor: area
 * centroid of the OSM outline way/265302076.
 *
 * Identifying features (from the photos):
 * 1. The Fifth Avenue portico: three tall round arches between free-standing
 *    Corinthian columns, paired between the arches and single at the ends,
 *    under an entablature and a high attic with six statues, the low
 *    pediment of the central block showing above it.
 * 2. The broad stairs and terraces in front, up from the avenue to the
 *    portico.
 * 3. The long, lower wings either side: a giant order of engaged columns
 *    between the bays, arched windows below, square ones above, a
 *    balustrade, and end pavilions at 40th and 42nd Streets.
 * 4. The Rose Main Reading Room along the whole west side: a tall block
 *    with a row of fifteen great arched windows over Bryant Park, the stack
 *    windows (tall narrow slits) below them, and a long grey hipped roof.
 * 5. White Vermont marble throughout.
 *
 * Evidence
 * - OSM way/265302076 (outline, 86 × 113 m) and its parts 292055454–458,
 *   292055802–807 (wings 22 m, reading room and central block 35 m with
 *   hipped and gabled roofs, the courts 15 m).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), resampled in the model frame
 *   (/tmp/city/nyc/work/nyc-nypl/rot.png), above the Fifth Avenue sidewalk
 *   (the lowest ground): the building spans x −43.5…43 and y −64…59.5 (the
 *   OSM outline sits 4–7 m inside it to the east and south; the lidar's
 *   123 m matches the published 390 ft front, so the model follows the
 *   lidar); the portico projects to x = 49 between y −19.5 and 14, its
 *   attic about 24–26 m; the wings 23–25 m with low roofs to 28 m; the
 *   reading room block eaves 36 m, ridge 42 m, over x −43.5…−7, y −51…47;
 *   the central block a gable along x to a 37 m ridge, ending at x = 29.5;
 *   the north court 12–15 m, the south court roofed at 25 m; the terraces
 *   about 2 m above the avenue.
 * - Published: Carrère and Hastings, 1911; 390 × 270 ft; the reading room
 *   297 × 78 ft (Wikipedia; NRHP 66000547).
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-nypl/photos/credits.txt: the Fifth Avenue front
 *   head-on (ajay_suresh, CC BY 2.0; New York Public Library panorama, CC
 *   BY-SA 4.0), the portico (bryansjs, CC BY-SA 2.0; Another Believer, CC
 *   BY-SA 3.0), the west front over Bryant Park (Beyond My Ken, CC BY-SA
 *   4.0).
 *
 * Estimated: the portico's storeys (photos scaled to the lidar's attic,
 * 3.5 m podium, 12.7 m columns, 3.8 m entablature, 6 m attic), column
 * spacing and size, the wings' bay rhythm, the end pavilions' width, the
 * stack windows, the terraces' depth and the stair (both outside the OSM
 * outline, as the real ones are). No licensed photo of the 40th or 42nd
 * Street fronts was used; they carry the wings' order. The lions, urns,
 * fountains and flagpoles are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, massing, circle, type XY } from './nyc-570-lexington'
import { column, rectPanel, archPanel, wallFrame } from './nyc-city-hall'

// ===========================================================================
// Kit, shared with the other museum models of this batch
// ===========================================================================

/** A box on a wall a→b (counter-clockwise ring order): along s0..s1, out from the face d0..d1, z0..z1. */
export function onWall(p: Part, a: XY, b: XY, s0: number, s1: number, d0: number, d1: number, z0: number, z1: number, bottom = false) {
  const f = wallFrame(a, b, 0)
  const r: V3[] = [f.at(s0, z0, d1), f.at(s1, z0, d1), f.at(s1, z0, d0), f.at(s0, z0, d0)]
  const t = r.map(([x, y]) => [x, y, z1] as V3)
  p.loft([r, t]); p.cap(t, true); if (bottom) p.cap(r, false)
}

/** An axis-aligned box. */
export function cube(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bottom = false) {
  const r: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const t = r.map(([x, y]) => [x, y, z1] as V3)
  p.loft([r, t]); p.cap(t, true); if (bottom) p.cap(r, false)
}

/**
 * A hipped roof over an axis-aligned rectangle from eaves z0 to a ridge at
 * z1, the ridge along the longer side; `gableX` makes the ends on x gabled
 * instead (a ridge running along x the full length, triangular gables).
 */
export function roofOn(p: Part, gable: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, mode: 'hip' | 'gableX' | 'gableY' = 'hip') {
  const A: V3 = [x0, y0, z0], B: V3 = [x1, y0, z0], C: V3 = [x1, y1, z0], D: V3 = [x0, y1, z0]
  const w = x1 - x0, d = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  if (mode === 'gableX') {
    const r0: V3 = [x0, cy, z1], r1: V3 = [x1, cy, z1]
    p.quad(A, B, r1, r0); p.quad(C, D, r0, r1)
    if (gable) { gable.tri(B, C, r1); gable.tri(D, A, r0) }
    return
  }
  if (mode === 'gableY') {
    const r0: V3 = [cx, y0, z1], r1: V3 = [cx, y1, z1]
    p.quad(B, C, r1, r0); p.quad(D, A, r0, r1)
    if (gable) { gable.tri(A, B, r0); gable.tri(C, D, r1) }
    return
  }
  const k = Math.min(w, d) / 2
  if (w >= d) {
    const r0: V3 = [x0 + k, cy, z1], r1: V3 = [x1 - k, cy, z1]
    p.quad(A, B, r1, r0); p.quad(C, D, r0, r1); p.tri(B, C, r1); p.tri(D, A, r0)
  } else {
    const r0: V3 = [cx, y0 + k, z1], r1: V3 = [cx, y1 - k, z1]
    p.quad(B, C, r1, r0); p.quad(D, A, r0, r1); p.tri(A, B, r0); p.tri(C, D, r1)
  }
}

/** A bold standing statue: a robed body on a block and a head, facing out along `n`. */
export function statue(p: Part, x: number, y: number, z0: number, h: number) {
  const s = h / 3.4
  const rings: V3[][] = [[0.55, 0], [0.48, 2.2], [0.32, 2.7]].map(([r, z]) => circle(x, y, r * s, 6).map(([a, b]) => [a, b, z0 + z * s] as V3))
  p.loft(rings); p.cap(rings[2], true)
  cube(p, x - 0.18 * s, y - 0.18 * s, x + 0.18 * s, y + 0.18 * s, z0 + 2.7 * s, z0 + 3.4 * s)
}

/** A run of steps against a wall a→b: `n` treads from the ground up to z1, `depth` out from the face. */
export function stair(p: Part, a: XY, b: XY, s0: number, s1: number, d0: number, depth: number, z0: number, z1: number, n: number) {
  for (let k = 0; k < n; k++) onWall(p, a, b, s0, s1, d0 - 0.01, d0 + depth * (1 - k / n), k ? z0 + (z1 - z0) * (k / n) : 0, z0 + (z1 - z0) * ((k + 1) / n))
}

// ===========================================================================
// The library
// ===========================================================================

function build() {
  const marble = new Part(), shade = new Part(), win = new Part(), roof = new Part(), door = new Part(), flat = new Part()

  const X0 = -43.5, XE = 43, PX = 49, S = -64, N = 59.5
  const RR = -7 // reading room block's east edge
  const PY0 = -19.5, PY1 = 14 // portico block
  const WING = 19.5, BAL = 21.5, RRE = 36, RRR = 42, CB = 33, CBR = 37
  const TER = 2 // the terraces above the avenue

  massing({
    wall: marble, win: null, roof: flat, coping: marble, facade: null, bevel: 0.4,
    boxes: [
      [X0, S, XE, N, WING], // the wings round the courts, to the main cornice
      [X0, -51, RR, 47, RRE], // the reading room block
      [RR, -18, 29.5, PY1 - 0.5, CB], // the central block
      [29.5, PY0, XE, PY1, 22.0], // behind the portico
    ],
  })
  // Courts: the north court is open to a low roof; give its walls nothing
  // extra. The balustrade round the wings and the low roofs inside it.
  const wingRing: XY[] = [[X0, S], [XE, S], [XE, N], [X0, N]]
  const bal = (a: XY, b: XY) => onWall(marble, a, b, 0, wallFrame(a, b).L, -0.35, 0.05, WING, BAL)
  for (let i = 0; i < 4; i++) bal(wingRing[i], wingRing[(i + 1) % 4])
  // Main cornice round the wings.
  for (let i = 0; i < 4; i++) {
    const a = wingRing[i], b = wingRing[(i + 1) % 4], L = wallFrame(a, b).L
    onWall(marble, a, b, -0.9, L + 0.9, -0.05, 0.9, WING - 1.4, WING)
  }
  // The wings' roofs are flat terraces inside the balustrade (NAIP: pale).

  // The reading room's long hipped roof and the central block's gable,
  // its pediment end over the portico.
  roofOn(roof, null, X0 + 0.6, -50.4, RR - 0.6, 46.4, RRE, RRR, 'hip')
  onWall(marble, [X0, 47], [X0, -51], -0.8, 98.8, -0.05, 1.0, RRE - 1.2, RRE) // its cornice, Bryant Park side
  onWall(marble, [X0, -51], [RR, -51], -0.8, RR - X0 + 0.8, -0.05, 1.0, RRE - 1.2, RRE)
  onWall(marble, [RR, 47], [X0, 47], -0.8, RR - X0 + 0.8, -0.05, 1.0, RRE - 1.2, RRE)
  roofOn(roof, marble, RR, -18, 29.5, PY1 - 0.5, CB, CBR, 'gableX')
  onWall(marble, [29.5, -18], [29.5, PY1 - 0.5], -0.6, PY1 - 0.5 + 18 + 0.6, -0.05, 0.9, CB - 0.9, CB) // pediment base

  // --- Fifth Avenue: the terraces and the portico ---
  const fifth = (y0: number, y1: number): [XY, XY] => [[XE, y0], [XE, y1]]
  const [fa, fb] = fifth(S, N)
  onWall(marble, fa, fb, -4, N - S + 4, -0.05, 8.0, 0, TER) // the terraces, outside the outline
  // Portico block: the arches' wall at x = 47.5, columns standing proud to the lidar's x = 49.5.
  const pw: [XY, XY] = [[47.5, PY0], [47.5, PY1]]
  const PL = PY1 - PY0, mid = PL / 2
  const POD = 3.5, COL = POD + 13.2, ENT = COL + 3.8, ATT = ENT + 6.6
  cube(marble, XE - 0.1, PY0, 47.5, PY1, 0, ATT - 0.4) // the portico mass between wall and wings
  onWall(marble, pw[0], pw[1], 0, PL, -0.05, 2.9, TER, POD) // podium under the columns
  // The shaded loggia wall behind the columns.
  rectPanel(shade, pw[0], pw[1], mid, 26, POD, COL, 0.04)
  // The three arches, deep recesses with the doors at their foot.
  for (const k of [-1, 0, 1]) {
    const s = mid + k * 8
    archPanel(win, pw[0], pw[1], s, 5.4, POD, COL - 0.4, 0.07)
    rectPanel(door, pw[0], pw[1], s, 2.4, POD, POD + 4.6, 0.1)
  }
  // Columns: single at the ends, paired between the arches.
  const colS = [mid - 12, mid - 5, mid - 3, mid + 3, mid + 5, mid + 12]
  for (const s of colS) {
    const c = wallFrame(pw[0], pw[1], 0).at(s, 0, 2.0)
    column(marble, c[0], c[1], 0.9, POD, COL, { n: 12, base: 0.7, cap: 1.2, taper: 0.9 })
  }
  // Entablature breaking forward over the columns, the attic over it, and
  // the six statues standing on the entablature in front of the attic.
  onWall(marble, pw[0], pw[1], -0.6, PL + 0.6, -0.05, 3.2, COL, ENT)
  onWall(marble, pw[0], pw[1], -1.0, PL + 1.0, 2.4, 3.6, ENT - 1.0, ENT)
  onWall(marble, pw[0], pw[1], 0.2, PL - 0.2, -0.05, 2.0, ENT, ATT)
  onWall(marble, pw[0], pw[1], 0, PL, -0.05, 2.3, ATT - 0.8, ATT)
  for (const s of colS) {
    const c = wallFrame(pw[0], pw[1], 0).at(s, 0, 2.5)
    statue(marble, c[0], c[1], ENT, 4.4)
  }
  // The broad stair from the terrace up to the portico, and from the
  // avenue up to the terrace.
  stair(marble, pw[0], pw[1], -4, PL + 4, 2.95, 5.0, 0, POD, 9)

  // --- The wings' fronts: a giant order of engaged columns between bays,
  // arched windows below, square windows above, end pavilions ---
  type Run = { a: XY; b: XY; s0: number; s1: number; pav0: number; pav1: number }
  const wingFace = (r: Run) => {
    const { a, b } = r
    onWall(marble, a, b, r.s0, r.s1, -0.05, 0.3, 0, 8.2) // rusticated ground storey
    onWall(marble, a, b, r.s0, r.s1, -0.05, 0.45, 8.2, 9.0) // string course
    const bays0 = r.s0 + r.pav0, bays1 = r.s1 - r.pav1
    const n = Math.max(2, Math.round((bays1 - bays0) / 5.2)), bw = (bays1 - bays0) / n
    for (let k = 0; k < n; k++) {
      const c = bays0 + bw * (k + 0.5)
      archPanel(win, a, b, c, 2.4, 2.6, 7.6, 0.33)
      rectPanel(win, a, b, c, 2.2, 10.4, 15.4)
    }
    for (let k = 0; k <= n; k++) {
      const p = wallFrame(a, b, 0).at(bays0 + bw * k, 0, 0.45)
      column(marble, p[0], p[1], 0.55, 9.0, WING - 1.4, { n: 10, base: 0.5, cap: 0.8, taper: 0.92 })
    }
    // End pavilions: a little proud, a tall arched window, quoined.
    for (const [p0, p1] of [[r.s0, bays0], [bays1, r.s1]] as [number, number][]) {
      if (p1 - p0 < 3) continue
      onWall(marble, a, b, p0, p1, -0.05, 0.9, 0, WING - 1.4)
      const c = (p0 + p1) / 2
      archPanel(win, a, b, c, 3.0, 10.4, 16.6, 0.95)
      archPanel(win, a, b, c, 2.4, 2.6, 7.6, 0.95)
    }
  }
  // Fifth Avenue, either side of the portico: a niche bay next to it.
  wingFace({ a: fa, b: fb, s0: 0, s1: PY0 - S, pav0: 11, pav1: 7 })
  wingFace({ a: fa, b: fb, s0: PY1 - S, s1: N - S, pav0: 7, pav1: 11 })
  for (const s of [PY0 - S - 3.5, PY1 - S + 3.5]) archPanel(shade, fa, fb, s, 3.4, TER + 1, 14.5, 0.96) // the fountain niches
  // 42nd and 40th Streets.
  wingFace({ a: [XE, N], b: [X0, N], s0: 0, s1: XE - X0, pav0: 11, pav1: 9 })
  wingFace({ a: [X0, S], b: [XE, S], s0: 0, s1: XE - X0, pav0: 9, pav1: 11 })
  // The north and south wings' ends on Bryant Park.
  for (const [a, b] of [[[X0, S], [X0, -51]], [[X0, 47], [X0, N]]] as [XY, XY][]) {
    const L = wallFrame(a, b).L
    for (const s of [L * 0.3, L * 0.7]) { archPanel(win, a, b, s, 2.6, 2.6, 7.6); rectPanel(win, a, b, s, 2.2, 10.6, 15.6) }
  }

  // --- Bryant Park: the reading room's great arched windows over the
  // stack windows ---
  const bp: [XY, XY] = [[X0, 47], [X0, -51]]
  const BL = 98
  for (let k = 0; k < 15; k++) {
    const s = 4 + ((BL - 8) * (k + 0.5)) / 15
    archPanel(win, bp[0], bp[1], s, 3.6, 25.0, 32.6)
    if (k === 7) { archPanel(door, bp[0], bp[1], s, 3.2, 2.0, 8.0, 0.4); onWall(marble, bp[0], bp[1], s - 2.6, s + 2.6, -0.05, 0.4, 0, 9.4); continue }
    for (const d of [-1.0, 1.0]) rectPanel(win, bp[0], bp[1], s + d, 0.9, 4.0, 21.0)
  }
  onWall(marble, bp[0], bp[1], 0, BL, -0.05, 0.5, 22.4, 23.4) // string course under the arches
  onWall(marble, bp[0], bp[1], 0, BL, -0.05, 0.4, 0, 2.8) // base

  finishModel('New York Public Library, Stephen A. Schwarzman Building', 'nyc-nypl', [
    { part: marble, material: PALETTE.stone },
    { part: shade, material: finish('nypl-marble-shade', 0xcdbfaa) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: door, material: PALETTE.entrance },
    { part: flat, material: finish('nypl-terrace-roof', 0xd2d0c9) },
  ], { bearing: 29, osm: 'way/265302076', height: RRR }, 6500)
}

if (import.meta.main) build()
