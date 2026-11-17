/**
 * Parkway Central Library, Free Library of Philadelphia — procedural,
 * CC0-1.0, no textures.  bun generators/phl-free-library-parkway.ts
 *
 * What it is: Horace Trumbauer's (Julian Abele) Beaux-Arts library on the
 * north side of Logan Square (1917-27), a twin of the Family Court across
 * the Parkway, both after Gabriel's palaces on the Place de la Concorde. A
 * rusticated ground storey with arched windows; over it a giant Corinthian
 * order two storeys high: on the front a loggia of twelve free columns
 * between two end pavilions, each with four engaged columns and a
 * pediment; on the sides engaged columns with tall windows between; a
 * balustrade all round; the pavilions' temple roofs, copper on their inner
 * slopes; the slate-grey attic storey and its pyramidal skylight in the
 * middle of the roof.
 *
 * Map frame: x along bearing 99 (east), y along bearing 9 (north), z up,
 * metres; the front faces -y (south, onto Vine Street and Logan Square).
 * Placed at bearing 9.0, the walls (OSM edges 9.0-9.5°). Anchor: area
 * centroid of the outline way/32122450, -75.171018 39.959592. The model is
 * symmetrical about x = -0.2, the outline's axis.
 *
 * z = 0 is the floor of the dry areaways along the west and east sides
 * (lidar 4.5 m over ground_min), the lowest ground the building touches;
 * the street in front is at z 2.0, the rear at 3.8.
 *
 * Covers and replaces: way/32122450 (outline) and its building:parts
 * way/343581381 and way/349397345 (the pavilions' roofs), way/349876639
 * (the attic storey), way/349876640 (the skylight).
 *
 * Evidence
 * - OSM (2026-11), in this frame: outline x -46.5..46.1, y -31.6..30.8;
 *   pavilion roofs centred x -36.2 and 34.0; attic x -18..15.9, y -10.6..
 *   18.8; skylight x -3.8..1.8, y 3.4..9.1.
 * - USGS 3DEP lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown
 *   2015), 1 m grid read in this frame (measured, above z = 0): main
 *   cornice 24.9, balustrade 26.6, pavilion ridges 28.2 at x +-35.3 front
 *   to back, attic roof 29.3 over x -26..19, y -11..13, skylight 32.
 * - Photos: HABS PA-6749 (Joseph Elliott, 2008, public domain, Wikimedia
 *   Commons): "SOUTH FRONT ELEVATION" (-2), square on, scaled to the
 *   outline's 92.6 m width and the lidar (0.096 m a pixel): pavilions
 *   x +-24.2..46.3, their columns at +-28.3, 32.5, 36.8, 41.2; twelve loggia
 *   columns at 4.1 m centres; rusticated base to 10.7, capitals to 21.3,
 *   cornice 24.4; arched ground-floor windows 2.5-7.8; "WEST SIDE
 *   ELEVATION" (-4): fourteen engaged columns, eleven tall windows, plain
 *   corner bays, five arched windows below; "PERSPECTIVE VIEW OF LIBRARY IN
 *   ENVIRONMENT CONTEXT" (-1) from the Franklin Institute's roof: the
 *   massing, roof and balustrade; "VIEW OF ROOF TERRACE, LOOKING WEST"
 *   (-12); "NORTH REAR ELEVATION" (-5).
 *   "Philadelphia October 2017 06 (Free Library of Philadelphia Parkway
 *   Central Library).jpg" (Michael Barera, CC BY-SA 4.0) and "Free Library
 *   of Philadelphia Front 3008px.jpg" (Derek Ramsey, CC BY-SA 2.5): colour
 *   (pale grey-buff limestone), the dark loggia.
 * - USGS NAIP (public domain): the roof: copper on the pavilions' inner
 *   slopes, dark outer slopes, the dark attic roof and its skylight, pale
 *   flat roofs and the front roof terrace.
 * - Estimated: loggia depth 3.6 m; window sizes; the rear elevation
 *   treated like the sides.
 * - Simplified: the pediment sculpture, cartouches, balusters (a solid
 *   parapet band), and the light courts beside the attic (flat roof here).
 *
 * Night: the stone is floodlit faintly; windows are dark recesses on a
 * non-glowing material (none of the photos is at night).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, rect, cylinder, panel, qf, tf, type Side } from './dc-white-house'
import { saveModel } from './dc-nga-west'

const stone = new Part(), shade = new Part(), win = new Part(), roof = new Part(), copper = new Part()

const XC = -0.2, HX = 46.3, Y0 = -31.3, Y1 = 30.8
const BASE = 10.7, CAP = 21.3, CORN = 24.4, ROOFZ = 24.9, BAL = 26.6, RIDGE = 28.2
const X = (x: number) => XC + x
const PAV0 = 24.2 // pavilions' inner edge, |x|
const LOG_BACK = Y0 + 3.6

// ---------------------------------------------------------------------------
// The body: rusticated base, upper walls, cornice, balustrade, roof.
const body = rect(X(-HX), X(HX), Y0, Y1)
cbox(stone, rect(body.x0 - 0.25, body.x1 + 0.25, body.y0 - 0.25, body.y1 + 0.25), 0, BASE, { top: false })
// the rusticated base's joints, as a few faint bands: drawn as the shadowed set-back
cbox(stone, rect(body.x0 - 0.35, body.x1 + 0.35, body.y0 - 0.35, body.y1 + 0.35), BASE - 0.6, BASE, { b: 0.15, top: false, bottom: true })
// upper walls (the front's middle is set back to the loggia's back wall)
for (const s of [-1, 1]) {
  const xa = s < 0 ? body.x0 : X(PAV0), xb = s < 0 ? X(-PAV0) : body.x1
  cbox(stone, rect(xa, xb, Y0, Y1), BASE, CORN - 1.6, { top: false })
}
cbox(stone, rect(X(-PAV0), X(PAV0), LOG_BACK, Y1), BASE, CORN - 1.6, { top: false })
// the loggia's back wall and ceiling in shade
panel(shade, 's', LOG_BACK, X(-PAV0), X(PAV0), BASE, CAP, 0.02)
qf(shade, [X(-PAV0), Y0, CAP - 0.02], [X(PAV0), Y0, CAP - 0.02], [X(PAV0), LOG_BACK, CAP - 0.02], [X(-PAV0), LOG_BACK, CAP - 0.02], [0, 0, -1])
// entablature (over the loggia too) and cornice
cbox(stone, rect(body.x0, body.x1, Y0, Y1), CAP, CORN - 0.6, { top: false, bottom: true })
cbox(stone, rect(body.x0 - 0.6, body.x1 + 0.6, Y0 - 0.6, Y1 + 0.6), CORN - 0.6, CORN, { b: 0.3, top: false, bottom: true })
// the roof and the balustrade band (solid), set back a little
cbox(roof, rect(body.x0 + 0.2, body.x1 - 0.2, Y0 + 0.2, Y1 - 0.2), CORN - 0.1, ROOFZ, { top: true })
{
  const o = rect(body.x0 - 0.1, body.x1 + 0.1, Y0 - 0.1, Y1 + 0.1), t = 0.6
  for (const r of [rect(o.x0, o.x1, o.y0, o.y0 + t), rect(o.x0, o.x1, o.y1 - t, o.y1), rect(o.x0, o.x0 + t, o.y0, o.y1), rect(o.x1 - t, o.x1, o.y0, o.y1)])
    cbox(stone, r, ROOFZ, BAL, { b: 0.15 })
}

// ---------------------------------------------------------------------------
// The loggia: twelve columns on the line y = Y0 + 0.9.
function column(x: number, y: number, r: number) {
  cbox(stone, rect(x - r * 1.3, x + r * 1.3, y - r * 1.3, y + r * 1.3), BASE, BASE + 0.9, { b: 0.1 })
  cylinder(stone, x, y, r, BASE + 0.9, CAP - 1.4, 10, r * 0.88)
  cylinder(stone, x, y, r * 0.88, CAP - 1.4, CAP - 0.35, 10, r * 1.3)
  cbox(stone, rect(x - r * 1.35, x + r * 1.35, y - r * 1.35, y + r * 1.35), CAP - 0.35, CAP, { bottom: true, top: false })
}
for (let k = 0; k < 12; k++) column(X(-22.55 + 4.1 * k), Y0 + 0.9, 0.62)
// a parapet between the columns at the base (the loggia's balustrade)
cbox(stone, rect(X(-PAV0), X(PAV0), Y0 + 0.3, Y0 + 0.6), BASE, BASE + 1.1, { b: 0.1 })
// tall windows on the loggia's back wall, between the columns
for (let k = 0; k < 11; k++) {
  const x = X(-20.5 + 4.1 * k)
  panel(win, 's', LOG_BACK, x - 1.0, x + 1.0, BASE + 1.4, CAP - 2.0, 0.05)
}

// ---------------------------------------------------------------------------
// The pavilions: four engaged columns, windows between, a pediment; the
// temple roof front to back.
for (const s of [-1, 1]) {
  const xs = [28.3, 32.5, 36.8, 41.2].map((x) => X(s * x))
  for (const x of xs) column(x, Y0 - 0.45, 0.6)
  for (const x of [30.4, 34.65, 39.0]) panel(win, 's', Y0, X(s * x) - 1.0, X(s * x) + 1.0, BASE + 1.4, CAP - 2.0, 0.05)
  // roof: ridge along y at x = +-35.25, from cornice line 24.4 to 28.2
  const xa = X(s * PAV0), xb = X(s * HX), xm = X(s * 35.25)
  const lo = Math.min(xa, xb), hi = Math.max(xa, xb)
  const inner = s < 0 ? hi : lo, outer = s < 0 ? lo : hi
  qf(copper, [inner, Y0 - 0.6, ROOFZ], [inner, Y1 + 0.6, ROOFZ], [xm, Y1 + 0.6, RIDGE], [xm, Y0 - 0.6, RIDGE], [inner - xm, 0, (RIDGE - ROOFZ) * Math.sign(inner - xm) * Math.sign(inner - xm)])
  qf(roof, [outer, Y0 - 0.6, ROOFZ], [outer, Y1 + 0.6, ROOFZ], [xm, Y1 + 0.6, RIDGE], [xm, Y0 - 0.6, RIDGE], [outer - xm, 0, RIDGE - ROOFZ])
  // pediments at both ends, a raking frame round a recessed tympanum
  for (const e of [-1, 1]) {
    const y = e < 0 ? Y0 - 0.6 : Y1 + 0.6, n: V3 = [0, e, 0]
    const W = (hi - lo) / 2 + 0.6
    const A = RIDGE + 0.6, k = (A - CORN) / W, Wi = W - 1.4, Ai = A - 0.9, base = CORN + 0.2
    qf(stone, [xm - W, y, CORN], [xm + W, y, CORN], [xm + Wi, y, base], [xm - Wi, y, base], n)
    for (const t of [-1, 1]) qf(stone, [xm + t * W, y, CORN], [xm + t * Wi, y, base], [xm, y, Ai], [xm, y, A], n)
    const yb = y - e * 0.4
    tf(stone, [xm - Wi, yb, base], [xm + Wi, yb, base], [xm, yb, Ai], n)
    qf(stone, [xm - Wi, y, base], [xm + Wi, y, base], [xm + Wi, yb, base], [xm - Wi, yb, base], [0, 0, 1])
    for (const t of [-1, 1]) qf(stone, [xm + t * Wi, y, base], [xm, y, Ai], [xm, yb, Ai], [xm + t * Wi, yb, base], [-t * k, 0, 1])
    // raking cornice caps
    for (const t of [-1, 1]) qf(copper, [xm + t * W, y, CORN], [xm, y, A], [xm, y - e * 1.0, A], [xm + t * W, y - e * 1.0, CORN], [t * k * 0.2, e * 0.1, 1])
    // close the gable behind
    tf(stone, [xm - W, y - e * 1.0, CORN], [xm + W, y - e * 1.0, CORN], [xm, y - e * 1.0, A], [0, -e, 0])
  }
}

// ---------------------------------------------------------------------------
// Sides and rear: engaged columns with tall windows between; arched windows
// in the rusticated base.
function sideFace(side: Side, at: number, a0: number, a1: number, n: number) {
  const step = (a1 - a0) / n
  for (let k = 0; k <= n; k++) {
    const a = a0 + step * k
    const [x, y] = side === 'e' || side === 'w' ? [at + (side === 'e' ? 0.3 : -0.3), a] : [a, at + (side === 'n' ? 0.3 : -0.3)]
    cylinder(stone, x, y, 0.55, BASE, CAP - 1.3, 8, 0.5)
    cylinder(stone, x, y, 0.5, CAP - 1.3, CAP, 8, 0.75)
  }
  for (let k = 0; k < n; k++) {
    const c = a0 + step * (k + 0.5)
    panel(win, side, at, c - 1.0, c + 1.0, BASE + 3.4, CAP - 2.2, 0.05)
    panel(win, side, at, c - 0.35, c + 0.35, BASE + 1.4, BASE + 2.3, 0.05)
  }
}
for (const [side, at] of [['w', X(-HX)], ['e', X(HX)]] as [Side, number][]) {
  sideFace(side, at, Y0 + 7.0, Y1 - 7.0, 11)
  for (let k = 0; k < 9; k++) {
    const c = Y0 + 9 + k * 5.4
    panel(win, side, at + (side === 'e' ? 0.25 : -0.25), c - 1.0, c + 1.0, 2.6, 7.4, 0.05)
  }
}
sideFace('n', Y1, X(-HX + 7.0), X(HX - 7.0), 14)
for (let k = 0; k < 13; k++) {
  const c = X(-36 + k * 6)
  panel(win, 'n', Y1 + 0.25, c - 1.0, c + 1.0, 4.4, 8.6, 0.05)
}
// the front's arched ground-floor windows: seven under the loggia, two on each pavilion
for (let k = 0; k < 7; k++) panel(win, 's', Y0 - 0.25, X(-12.3 + k * 4.1) - 1.0, X(-12.3 + k * 4.1) + 1.0, 2.5, 7.8, 0.05)
for (const s of [-1, 1]) for (const x of [30.4, 39.0]) panel(win, 's', Y0 - 0.25, X(s * x) - 0.9, X(s * x) + 0.9, 3.2, 7.4, 0.05)

// ---------------------------------------------------------------------------
// The attic storey and its skylight.
cbox(roof, rect(X(-26), X(19.5), -11, 13), ROOFZ, 29.3, { b: 0.3 })
for (const s of [-1, 1]) for (let k = 0; k < 8; k++) panel(win, s < 0 ? 's' : 'n', s < 0 ? -11 : 13, X(-23 + k * 5.8) - 1.0, X(-23 + k * 5.8) + 1.0, 26.0, 28.2, 0.05)
{
  const cx = X(-1.0), cy = 6.2, h = 2.9
  const p = (dx: number, dy: number, z: number): V3 => [cx + dx, cy + dy, z]
  const c: V3 = p(0, 0, 32.0)
  tf(copper, p(-h, -h, 29.3), p(h, -h, 29.3), c, [0, -1, 1])
  tf(copper, p(h, -h, 29.3), p(h, h, 29.3), c, [1, 0, 1])
  tf(copper, p(h, h, 29.3), p(-h, h, 29.3), c, [0, 1, 1])
  tf(copper, p(-h, h, 29.3), p(-h, -h, 29.3), c, [-1, 0, 1])
}

const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : n[1] < -0.5 ? 0.8 : 0.5)
/** A material with its night floodlighting (written as `_FLOODLIGHT`). */
function withFlood<T extends object>(m: T, floodlight: (p: V3, n: V3) => number) {
  return { ...m, floodlight }
}
if (import.meta.main) {
  await saveModel('phl-free-library-parkway', 'Parkway Central Library', [
    { part: stone, material: withFlood(finish('library-limestone', 0xe0d8c8), lit) },
    { part: shade, material: finish('library-loggia-shade', 0x77716a) },
    { part: win, material: finish('library-window-recess', 0x4d5156, 0.5) },
    { part: roof, material: PALETTE.roof },
    { part: copper, material: finish('library-copper', 0x8fb5a3) },
  ], { source: 'generators/phl-free-library-parkway.ts', bearing: 9, osm: 'way/32122450', height: 32.0 }, 6500)
}
