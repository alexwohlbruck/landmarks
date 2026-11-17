/**
 * Philadelphia Museum of Art — procedural, CC0-1.0, no textures.
 * bun generators/phl-museum-of-art.ts
 *
 * (The museum called itself the "Philadelphia Art Museum" from October 2025
 * until 4 February 2026, when it went back to "Philadelphia Museum of Art";
 * the id is `phl-museum-of-art`.)
 *
 * Map frame: x towards the court of honour (south-east, down the Parkway),
 * y along the wings (north-east), z up, metres. Placed at bearing 43.6°, the
 * outline's walls (OSM way/28533972; all 34 edges agree to 0.01°). The
 * anchor is the outline's centroid (lng -75.18106, lat 39.96568). The model
 * is symmetrical about y = -0.4, the outline's own axis.
 *
 * What it is: Horace Trumbauer with Zantzinger, Borie & Medary (1919–28),
 * golden-buff Minnesota dolomite. Three Greek temples round an east-facing
 * court of honour on top of Fairmount: the central temple, a long Corinthian
 * temple with an eight-column portico towards the court and a six-column
 * portico in antis towards the river; the back ranges either side of it,
 * each a long temple running along y with a pediment at each outer end; and
 * the two wings running forward to end pavilions, each a temple across the
 * wing with a pediment on its court front (six Ionic columns) and on its
 * outer end. Every roof is blue-grey glazed tile. Of the eight pediments
 * only the north wing's court pediment has its sculpture: C. Paul
 * Jennewein's "Western Civilization" (1933), polychrome glazed terracotta
 * figures on a blue ground. The others have plain red-brown tympana.
 *
 * Covers and replaces: way/28533972 (no building:parts). The central steps
 * from the court up to the east portico are drawn; the court's paving is
 * the map's.
 *
 * The Rocky Steps and the terraces down to Eakins Oval are not drawn. The
 * map's terrain (Mapterhorn, `tools/terrain.ts grid`) already shows them as
 * a 10 m slope from the court (x = 80) to the oval (x = 140). Drawing them
 * in this placement would spread its plan over that drop: the map stands a
 * model on the lowest ground of its plan and blends every vertex from the
 * ground under it to the plan's mean rise by 25 m up, so the temples, on
 * the high ground, would be pulled about 4 m shorter. They would need a
 * placement of their own.
 *
 * Evidence
 * - OSM way/28533972 (measured, in this frame): central temple x -64.4..6.8,
 *   y -18.8..18.3; back ranges x -35.9..-3.5, ends y -87.1 and 86.3; wings
 *   to y -81.9/-53.6 and 52.4/81.0; end pavilions x 41.1..70.1, y -87.0..
 *   -48.5 and 47.1..85.8.
 * - USGS 3DEP lidar, USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown
 *   2015), read with tools/lidar_frame.py at bearing 43.6 (measured). Ground
 *   (above the box's ground_min): court 10.9-11.2, sides 10.2-10.7, rear
 *   9.2-9.5. z = 0 here is the court and plateau ground (10.9): the map
 *   stands every vertex on the ground under it, so the rear's lower ground
 *   is the map's to supply. Roofs, from the slopes read either side of each
 *   ridge (0.30-0.33 m a metre) carried out to the cornice line: central
 *   temple ridge 45.1 (z 34.3) along y = -0.4, cornice 39.7 (z 28.8); back
 *   ranges, wings and pavilions ridges 35.8-36.0 (z 25.1), cornices 31.9
 *   (z 21.0); back-range ridge at x -20.5 and its court face at x -5.5
 *   (the outline's -3.5 is its plinth); wing ridges at y -67.8; pavilion
 *   ridges along y at x 56, east faces x 69.6. The central steps rise from
 *   11.3 at x 20 to 14.3 at x 8; the stylobate is put at z 4.0 from the
 *   frontal photos (twelve risers).
 * - USGS NAIP orthophoto (public domain): plan, the blue-grey roofs.
 * - Published (Wikipedia, "Philadelphia Museum of Art", and the museum's
 *   press release of 4 February 2026 on its name): Minnesota dolomite; eight
 *   pediments designed for sculpture, one finished ("Western Civilization",
 *   1933, Jennewein, coloured by Leon V. Solon); bronze griffins on the
 *   roofs.
 * - Photos (Wikimedia Commons):
 *   "Philadelphia Museum of Art, main building.jpg" (public domain), the
 *     east portico frontal: eight Corinthian columns, red-brown tympanum;
 *   "Philadelphia Museum of Art, Philadelphia, Pennsylvania LCCN2011633567.tif"
 *     (Carol M. Highsmith, public domain), the east portico square on: every
 *     portico height below is scaled from it against the lidar apex and the
 *     outline's 37.1 m width (0.038 m a pixel): column 2.2 m across,
 *     capitals 19.3 m over the stylobate, cornice 24.8 m over it;
 *   "PhiladelphiaMuseumOfArt2017.jpg" (Meihe Chen, CC BY-SA 4.0), the court
 *     from the top of the steps: both wing pavilions' court fronts;
 *   "Philadelphia Museum of Art Main Building, June 18th, 2022.jpg"
 *     (DerekPhilipAu, CC BY-SA 4.0), the whole east front from the
 *     Washington Monument: the plain east walls of the pavilions, the roofs;
 *   "Philadelphia Museum of Art, Philadelphia, USA.jpg",
 *     "...USA - 51036147413.jpg" and "...USA - 51036979497.jpg" (dconvertini,
 *     CC BY-SA 2.0): the court, the south pavilion from the steps, the north
 *     pavilion's Ionic portico, podium and tall windows;
 *   "Philadelphia Museum of Art - Philadelphia - Pennsylvania - 01.jpg" and
 *     "- 02.jpg" (Adam Jones, CC BY-SA 3.0): the north pediment's figures;
 *   "Philadelphia Museum of Art & Fairmount Water Works.jpg" (Zhicheng Zhao,
 *     CC BY-SA 4.0) and "Schuylkill River, Philadelphia Museum of Art,
 *     Philadelphia, Pennsylvania LCCN2011631111.tif" (Carol M. Highsmith,
 *     public domain, at dusk): the river side, the six-column portico in
 *     antis at the rear, the blank sides of the rear temple, the two rows of
 *     windows on the back ranges, the pediments with four columns in antis
 *     at the outer ends; the floodlighting;
 *   "Aerial view of Philadelphia Museum of Art - 01.jpg" (HABS, public
 *     domain): the roof plan.
 * - Estimated from those photos: the range walls' three window rows
 *   (basement z 1.0-2.2, then 4.4-7.8 and 11.4-14.6, 1.4 m wide, about 4.3 m a bay),
 *   entablature bands, the pavilion podium (z 3.7), Ionic columns 1.5 m
 *   across to z 17.4, the porches' back walls in shade, the portico
 *   depths (5 m east, 4.9 m at the rear, 3.5 m at the outer ends), the tall
 *   windows behind the columns, the figures' heights.
 * - Simplified: capitals are a flared bell (Corinthian) or a broad volute
 *   block (Ionic); the pediment figures are plain blocks; the griffins and
 *   anthemia are bold blocks in the roof's slate colour (dark against the
 *   sky, as the bronze reads; a patina material would be a seventh);
 *   antefixes, mouldings, pilaster
 *   strips and the attic's small windows are left out.
 *
 * Doubts
 * - The outer (north and south) ends are seen only obliquely (Zhao): four
 *   columns in antis assumed for both. Their tympana are drawn red-brown
 *   like the others; they could be plain stone.
 * - The wings' outer faces are seen only at a slant; windows as on the
 *   back ranges.
 * - The aerial of 1966 shows a skylight along the central ridge; the lidar
 *   shows none and it is left out.
 * - Lidar is from 2015; the Gehry "Core Project" (2019-21) was inside and
 *   under the court and changed nothing drawn here.
 *
 * Night: the stone is floodlit all round (Highsmith's dusk photo: the rear
 * portico lit gold, the ranges washed), brightest on the court fronts, so
 * the stone, the porches' shade, tympana and figures carry `_FLOODLIGHT`.
 * The windows are small dark recesses on a non-glowing material
 * (`pma-window-recess`): in the dusk photo the galleries' windows are dark
 * behind the floodlit stone, with only a few lit. The porches' back walls
 * and ceilings are a darker tone of the dolomite (`pma-dolomite-shade`), the
 * deep shadow every photo shows between the columns.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, cylinder, grow, panel, qf, rect, tf, type Rect, type Side } from './dc-white-house'
import { saveModel } from './dc-nga-west'

const stone = new Part(), shade = new Part(), roof = new Part(), win = new Part(), tymp = new Part(), blue = new Part()
const bronze = roof // the griffins and anthemia, dark against the sky

const YC = -0.4 // axis of symmetry
const G = 0 // the court and side ground; the map's drape brings the rear down

// ---- Heights (lidar, photos).
const RANGE_E = 21.0, RANGE_A = 25.1 // range cornice top and ridge
const CENT_E = 28.8, CENT_A = 34.3 // central temple
const STYLO = 4.0 // central stylobate
const POD = 3.7 // podium of the range temples' porticoes
const OVER = 0.55 // cornice projection

// ---------------------------------------------------------------------------
// Temple roof: two slopes and an end at each end: a pediment (a stone frame,
// a recessed tympanum), a plain stone gable, or nothing (buried).

type End = 'tymp' | 'blue' | 'closed' | 'none'
type Temple = { r: Rect; ridge: 'x' | 'y'; E: number; A: number; ends: [End, End] }

/** Local (across, along, z) → map, for a rect and a ridge axis. */
function frame(r: Rect, ridge: 'x' | 'y') {
  const cx = (r.x0 + r.x1) / 2, cy = (r.y0 + r.y1) / 2
  const W = ridge === 'x' ? (r.y1 - r.y0) / 2 : (r.x1 - r.x0) / 2
  const L = ridge === 'x' ? (r.x1 - r.x0) / 2 : (r.y1 - r.y0) / 2
  const P = (a: number, l: number, z: number): V3 => (ridge === 'x' ? [cx + l, cy + a, z] : [cx + a, cy + l, z])
  const D = (a: number, l: number, z: number): V3 => (ridge === 'x' ? [l, a, z] : [a, l, z])
  return { W, L, P, D }
}

function templeRoof(t: Temple) {
  const { W, L, P, D } = frame(grow(t.r, OVER), t.ridge)
  const { E, A } = t
  for (const s of [-1, 1]) qf(roof, P(s * W, -L, E), P(s * W, L, E), P(0, L, A), P(0, -L, A), D(s * (A - E), 0, W))
  t.ends.forEach((end, i) => {
    if (end === 'none') return
    const e = i === 0 ? -1 : 1, l = e * L, n = D(0, e, 0)
    if (end === 'closed') { tf(stone, P(-W, l, E), P(W, l, E), P(0, l, A), n); return }
    const k = (A - E) / W, tv = Math.min(0.65, (A - E) * 0.16), base = E + 0.15
    const Wi = (A - tv - base) / k, Ai = A - tv, d = 0.35
    const fill = end === 'blue' ? blue : tymp
    // frame
    qf(stone, P(-W, l, E), P(W, l, E), P(Wi, l, base), P(-Wi, l, base), n)
    for (const s of [-1, 1]) qf(stone, P(s * W, l, E), P(s * Wi, l, base), P(0, l, Ai), P(0, l, A), n)
    // reveal and tympanum
    const lb = l - e * d
    qf(stone, P(-Wi, l, base), P(Wi, l, base), P(Wi, lb, base), P(-Wi, lb, base), [0, 0, 1])
    for (const s of [-1, 1]) qf(stone, P(s * Wi, l, base), P(0, l, Ai), P(0, lb, Ai), P(s * Wi, lb, base), D(-s * k, 0, -1))
    tf(fill, P(-Wi, lb, base), P(Wi, lb, base), P(0, lb, Ai), n)
  })
}

/** Acroteria: a tall anthemion at the apex and a griffin block at each corner. */
function acroteria(t: Temple, ends: number[], big = 1) {
  const { W, L, P } = frame(grow(t.r, OVER), t.ridge)
  for (const e of ends) {
    const l = e * (L - 0.6)
    const [x, y] = P(0, l, 0)
    const h = 2.4 * big, w = 0.9 * big
    cbox(bronze, rect(x - w / 2, x + w / 2, y - w / 2, y + w / 2), t.A - 0.3, t.A + h * 0.35, { b: 0.1 })
    cbox(bronze, rect(x - w * 0.7, x + w * 0.7, y - w * 0.3, y + w * 0.3), t.A + h * 0.35, t.A + h, { b: 0.25 })
    for (const s of [-1, 1]) {
      const [gx, gy] = P(s * (W - 0.8), l, 0)
      const g = 0.75 * big
      cbox(bronze, rect(gx - g / 2, gx + g / 2, gy - g / 2, gy + g / 2), t.E - 0.1, t.E + 1.5 * big, { b: 0.2 })
    }
  }
}

// ---------------------------------------------------------------------------
// Columns.

function column(x: number, y: number, r: number, z0: number, z1: number, order: 'corinthian' | 'ionic', faceAlongX: boolean) {
  const pl = r * 1.25
  cbox(stone, rect(x - pl, x + pl, y - pl, y + pl), z0, z0 + 0.45, { top: true })
  if (order === 'corinthian') {
    const bell = r * 2.2
    cylinder(stone, x, y, r, z0 + 0.45, z1 - bell, 8, r * 0.88)
    cylinder(stone, x, y, r * 0.88, z1 - bell, z1 - 0.4, 8, r * 1.3)
    const a = r * 1.4
    cbox(stone, rect(x - a, x + a, y - a, y + a), z1 - 0.4, z1, { bottom: true, top: false })
  } else {
    const cap = r * 0.9
    cylinder(stone, x, y, r, z0 + 0.45, z1 - cap, 8, r * 0.88)
    // the volutes: a block broad along the face, shallow across it
    const u = r * 1.55, v = r * 0.95
    const box = faceAlongX ? rect(x - u, x + u, y - v, y + v) : rect(x - v, x + v, y - u, y + u)
    cbox(stone, box, z1 - cap, z1, { b: 0.12, bottom: true, top: false })
  }
}

/** A downward-facing shaded ceiling over the rectangle spanned by two corners. */
function box2shade(a: V3, b: V3, z: number) {
  const x0 = Math.min(a[0], b[0]), x1 = Math.max(a[0], b[0]), y0 = Math.min(a[1], b[1]), y1 = Math.max(a[1], b[1])
  qf(shade, [x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z], [0, 0, -1])
}

// ---------------------------------------------------------------------------
// Walls with windows.

/** Panels in rows along a wall, `n` bays evenly over a0..a1. */
function windowRows(side: Side, at: number, a0: number, a1: number, n: number, w: number, rows: [number, number][]) {
  const step = (a1 - a0) / n
  for (let k = 0; k < n; k++) {
    const c = a0 + step * (k + 0.5)
    for (const [z0, z1] of rows) panel(win, side, at, c - w / 2, c + w / 2, z0, z1, 0.05)
  }
}
const RANGE_ROWS: [number, number][] = [[G + 1.0, G + 2.2], [G + 4.4, G + 7.8], [G + 11.4, G + 14.6]]

/** A range's walls, plinth, entablature band and cornice over rect r. */
function rangeBody(r: Rect, plinth = G + 1.0) {
  cbox(stone, grow(r, 0.25), 0, plinth, { b: 0.15, top: false })
  cbox(stone, r, plinth, RANGE_E - 3.4, { top: false })
  cbox(stone, grow(r, 0.2), RANGE_E - 3.4, RANGE_E - 0.7, { top: false, bottom: true })
  cbox(stone, grow(r, OVER), RANGE_E - 0.7, RANGE_E, { b: 0.3, bottom: true, top: false })
}

/**
 * A range temple's end portico in antis on a podium: the cella wall set
 * back `depth`, square antae at the corners, `n` columns between, the
 * entablature carried over them. `e` = -1 for the low end along the ridge.
 */
function endPortico(rr: Rect, ridge: 'x' | 'y', e: number, n: number, order: 'corinthian' | 'ionic', depth: number, zBase: number, colTop: number, wins: number) {
  const { W, L, P } = frame(rr, ridge)
  const lf = e * L, lb = e * (L - depth)
  const ant = 2.0
  const box = (a0: number, a1: number, l0: number, l1: number, z0: number, z1: number, o: Parameters<typeof cbox>[4]) => {
    const p = P(a0, l0, 0), q = P(a1, l1, 0)
    cbox(stone, rect(Math.min(p[0], q[0]), Math.max(p[0], q[0]), Math.min(p[1], q[1]), Math.max(p[1], q[1])), z0, z1, o)
  }
  // podium under the porch
  box(-W - 0.25, W + 0.25, lb, lf + e * 0.25, 0, zBase, { b: 0.15 })
  // antae
  for (const s of [-1, 1]) box(s * W, s * (W - ant), lb, lf, zBase, RANGE_E - 3.4, { top: false })
  // columns
  const span = 2 * (W - ant), r = order === 'corinthian' ? 1.0 : 0.75
  const lc = e * (L - 0.9)
  for (let k = 0; k < n; k++) {
    const a = -span / 2 + span * (k + 0.5) / n
    const [x, y] = P(a, lc, 0)
    column(x, y, r, zBase, colTop, order, ridge === 'y')
  }
  // entablature band over the porch (seen from below)
  box(-W - 0.2, W + 0.2, lb, lf, colTop, RANGE_E - 0.7, { bottom: true, top: false })
  box(-W - OVER, W + OVER, lb, lf + e * OVER, RANGE_E - 0.7, RANGE_E, { b: 0.3, bottom: true, top: false })
  // tall windows on the back wall, between the middle columns
  const side: Side = ridge === 'y' ? (e > 0 ? 'n' : 's') : (e > 0 ? 'e' : 'w')
  const at = ridge === 'y' ? P(0, lb, 0)[1] : P(0, lb, 0)[0]
  const c0 = ridge === 'y' ? P(0, 0, 0)[0] : P(0, 0, 0)[1]
  // the back wall in the porch's shade
  panel(shade, side, at, c0 - W + ant, c0 + W - ant, zBase, colTop, 0.03)
  // and the porch ceiling, in shade, seen between the columns from below
  box2shade(P(-W + ant, lb, 0), P(W - ant, lf, 0), colTop - 0.02)
  const step = span / n
  for (let k = 0; k < wins; k++) {
    const a = (k - (wins - 1) / 2) * step
    panel(win, side, at, c0 + a - 1.0, c0 + a + 1.0, zBase + 1.4, colTop - 1.8, 0.05)
  }
}

// ===========================================================================
// The central temple.
const central: Temple = { r: rect(-64.4, 6.8, YC - 18.5, YC + 18.5), ridge: 'x', E: CENT_E, A: CENT_A, ends: ['tymp', 'tymp'] }
{
  const { r } = central
  const CAP = 23.3, ENT0 = 23.3, X_BACK = -59.5, X_FRONT = -0.6
  // podium / stylobate under the whole temple
  cbox(stone, grow(rect(-64.4, 6.8, r.y0, r.y1), 0.2), 0, STYLO, { b: 0.2 })
  // cella walls, including the rear temple's blank sides
  cbox(stone, rect(X_BACK, X_FRONT, r.y0, r.y1), STYLO, ENT0, { top: false })
  // rear antae, carrying the side walls out to the rear portico's face
  for (const s of [-1, 1]) {
    const y0 = s < 0 ? r.y0 : r.y1 - 2.2, y1 = s < 0 ? r.y0 + 2.2 : r.y1
    cbox(stone, rect(r.x0, X_BACK, y0, y1), STYLO, ENT0, { top: false })
  }
  // entablature and cornice, right round both porticoes
  cbox(stone, rect(r.x0, r.x1, r.y0, r.y1), ENT0, CENT_E - 0.7, { bottom: true, top: false })
  cbox(stone, grow(r, OVER), CENT_E - 0.7, CENT_E, { b: 0.3, bottom: true, top: false })
  templeRoof(central)
  acroteria(central, [-1, 1], 1.3)
  // east portico: eight Corinthian columns, prostyle
  for (let k = 0; k < 8; k++) column(4.6, YC - 15.25 + 4.357 * k, 1.1, STYLO, CAP, 'corinthian', false)
  // rear portico: six in antis
  const sp = (2 * 18.5 - 4.4) / 6
  for (let k = 0; k < 6; k++) column(-63.0, YC - 18.5 + 2.2 + sp * (k + 0.5), 1.1, STYLO, CAP, 'corinthian', false)
  // the great east window over the doors, and a tall one at the rear
  panel(shade, 'e', X_FRONT, r.y0, r.y1, STYLO, CAP, 0.03)
  panel(shade, 'w', X_BACK, r.y0 + 2.2, r.y1 - 2.2, STYLO, CAP, 0.03)
  box2shade([X_FRONT, r.y0, 0], [r.x1, r.y1, 0], ENT0 - 0.02)
  box2shade([r.x0, r.y0 + 2.2, 0], [X_BACK, r.y1 - 2.2, 0], ENT0 - 0.02)
  panel(win, 'e', X_FRONT, YC - 2.3, YC + 2.3, STYLO + 0.3, 18.0, 0.05)
  panel(win, 'w', X_BACK, YC - 1.8, YC + 1.8, STYLO + 1.0, 16.0, 0.05)
  // steps up from the court: twelve risers, x 6.8..19.5, between low
  // cheeks; treads and risers only, in 10 m lengths so the drape can bend them
  const N = 12, X0 = 19.5, X1 = 6.8, HW = 20.0, pieces = 4
  for (let j = 0; j < pieces; j++) {
    const y0 = YC - HW + (2 * HW * j) / pieces, y1 = YC - HW + (2 * HW * (j + 1)) / pieces
    for (let k = 0; k < N; k++) {
      const xa = X0 - ((X0 - X1) * k) / N, xb = xa - (X0 - X1) / N
      const zl = k === 0 ? 0 : G + ((STYLO - G) * k) / N, z = G + ((STYLO - G) * (k + 1)) / N
      qf(stone, [xa, y0, zl], [xa, y1, zl], [xa, y1, z], [xa, y0, z], [1, 0, 0])
      qf(stone, [xa, y0, z], [xa, y1, z], [xb, y1, z], [xb, y0, z], [0, 0, 1])
    }
  }
  for (const s of [-1, 1]) {
    const y0 = s < 0 ? YC - HW - 2.0 : YC + HW, y1 = s < 0 ? YC - HW : YC + HW + 2.0
    cbox(stone, rect(X1, X0, y0, y1), 0, G + 0.9, { b: 0.15 })
    cbox(stone, rect(X1, X1 + 6.0, y0, y1), 0, STYLO + 0.9, { b: 0.2 })
  }
}

// ===========================================================================
// The back ranges, the wings, the end pavilions (mirrored about y = YC).
for (const s of [-1, 1]) {
  const Y = (y: number) => YC - s * (y - YC) // y given for the south side
  const span = (a: number, b: number): [number, number] => [Math.min(Y(a), Y(b)), Math.max(Y(a), Y(b))]
  const sideOut: Side = s < 0 ? 's' : 'n', sideIn: Side = s < 0 ? 'n' : 's'

  // Back range: x -35.9..-5.5, from the central temple to the outer end.
  const BX0 = -35.9, BX1 = -5.5, BEND = -86.7, BWALL = BEND + 3.5
  {
    const [y0, y1] = span(BWALL, YC - 18.5)
    rangeBody(rect(BX0, BX1, y0, y1))
    endPortico(rect(BX0, BX1, ...span(BEND, YC)), 'y', s < 0 ? -1 : 1, 4, 'corinthian', 3.5, POD, RANGE_E - 3.4, 3)
    const t: Temple = { r: rect(BX0, BX1, ...span(BEND, YC - 18.5)), ridge: 'y', E: RANGE_E, A: RANGE_A, ends: s < 0 ? ['tymp', 'none'] : ['none', 'tymp'] }
    templeRoof(t)
    acroteria(t, [s < 0 ? -1 : 1])
    // windows: the river (west) face and the court (east) face
    const [w0, w1] = span(BWALL + 1.0, YC - 18.5 - 1.0)
    windowRows('w', BX0, w0, w1, 15, 1.4, RANGE_ROWS)
    const [c0, c1] = span(-53.6 - 0.5, YC - 18.5 - 0.5)
    windowRows('e', BX1, c0, c1, 8, 1.4, RANGE_ROWS)
  }

  // Wing: x -5.5..41.4, y -81.9..-53.6, ridge along x into both neighbours.
  const WY0 = -81.9, WY1 = -53.6, WX0 = BX1, WX1 = 41.4
  {
    const [y0, y1] = span(WY0, WY1)
    rangeBody(rect(WX0, WX1, y0, y1))
    templeRoof({ r: rect(-20.7 + OVER, 55.5 - OVER, y0, y1), ridge: 'x', E: RANGE_E, A: RANGE_A, ends: ['none', 'none'] })
    windowRows(sideOut, Y(WY0), WX0 + 1.0, WX1 - 0.5, 10, 1.4, RANGE_ROWS)
    windowRows(sideIn, Y(WY1), WX0 + 1.0, WX1 - 0.5, 10, 1.4, RANGE_ROWS)
  }

  // End pavilion: x 41.4..69.6, y -86.7..-48.5, ridge along y, a pediment
  // at each end; six Ionic columns on the court front, four in antis outside.
  const PX0 = 41.4, PX1 = 69.6, PEND = -86.7, PCOURT = -48.5
  {
    const [y0, y1] = span(PEND + 3.5, PCOURT - 2.4)
    rangeBody(rect(PX0, PX1, y0, y1), POD)
    const full = rect(PX0, PX1, ...span(PEND, PCOURT))
    endPortico(full, 'y', s < 0 ? -1 : 1, 4, 'ionic', 3.5, POD, 17.4, 3)
    endPortico(full, 'y', s < 0 ? 1 : -1, 6, 'ionic', 2.4, POD, 17.4, 3)
    const court: End = s > 0 ? 'blue' : 'tymp'
    const t: Temple = { r: full, ridge: 'y', E: RANGE_E, A: RANGE_A, ends: s < 0 ? ['tymp', court] : [court, 'tymp'] }
    templeRoof(t)
    acroteria(t, [-1, 1])
    // small basement windows on the blank east wall
    windowRows('e', PX1 + 0.25, y0 + 2, y1 - 2, 6, 1.0, [[G + 1.0, G + 2.2]])
  }
}

// ===========================================================================
// "Western Civilization": the figures on the north pavilion's court pediment,
// standing on its blue ground, tallest at the centre, reclining at the ends.
{
  const W = (69.6 - 41.4) / 2 + OVER, xc = (41.4 + 69.6) / 2
  const yFace = YC - (-48.5 - YC) - OVER // north court face (faces -y)
  const k = (RANGE_A - RANGE_E) / W, tv = Math.min(0.65, (RANGE_A - RANGE_E) * 0.16)
  const base = RANGE_E + 0.15, top = (a: number) => RANGE_A - tv - k * Math.abs(a)
  const yb = yFace + 0.35, y0 = yb - 0.6 // set into the recess, proud of the ground
  const figs: [number, number, number][] = [ // centre offset, width, height share
    [0, 1.3, 0.95], [-2.1, 1.1, 0.9], [2.1, 1.1, 0.9], [-4.3, 1.5, 0.82], [4.3, 1.5, 0.82],
    [-6.8, 1.3, 0.72], [6.8, 1.3, 0.72],
  ]
  for (const [a, w, h] of figs) {
    const zt = base + (top(Math.abs(a) + w / 2) - base) * h
    cbox(stone, rect(xc + a - w / 2, xc + a + w / 2, y0, yb), base, zt, { b: 0.25 })
  }
  // reclining figures towards the corners
  for (const s of [-1, 1]) {
    const a0 = s * 8.6, a1 = s * 11.8
    const zt = base + (top(Math.max(Math.abs(a0), Math.abs(a1))) - base) * 0.75
    cbox(stone, rect(xc + Math.min(a0, a1), xc + Math.max(a0, a1), y0, yb), base, Math.max(base + 0.5, zt), { b: 0.2 })
  }
}

// Floodlit: every wall, brightest on the court (east) fronts; tops faint.
const lit = (p: V3, n: V3): number => {
  if (n[2] > 0.7) return 0.15
  if (n[2] < -0.7) return 0.35
  return n[0] > 0.5 ? 1.0 : 0.85
}
const DOLOMITE = { ...finish('pma-dolomite', 0xdcc08f), floodlight: lit }
const TYMPANUM = { ...PALETTE.terracotta, floodlight: lit }
const BLUE = { ...finish('pma-blue-terracotta', 0x5b84b8), floodlight: lit }
if (import.meta.main) {
  await saveModel('phl-museum-of-art', 'Philadelphia Museum of Art', [
    { part: stone, material: DOLOMITE },
    { part: shade, material: { ...finish('pma-dolomite-shade', 0x7f6a4e), floodlight: (p: V3, n: V3) => lit(p, n) * 0.6 } },
    { part: roof, material: finish('pma-roof-tile', 0x7a8a9b) },
    { part: win, material: finish('pma-window-recess', 0x4b4a47, 0.5) },
    { part: tymp, material: TYMPANUM },
    { part: blue, material: BLUE },
  ], { source: 'generators/phl-museum-of-art.ts', bearing: 43.6, osm: 'way/28533972', footprint: [134.5, 173.4], height: CENT_A }, 6500)
}
