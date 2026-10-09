/**
 * Supreme Court Building, Washington DC — procedural, CC0-1.0, no textures.
 * bun generators/dc-supreme-court.ts
 *
 * Map frame: x east, y north, z up, metres. The anchor is the area centroid
 * of the OSM multipolygon relation/286501 (lng -77.0044385, lat 38.8906244);
 * the outline's walls are turned 0.11° clockwise from the compass, so the
 * model is placed at bearing 0.11 and built square.
 *
 * What it is: Cass Gilbert's white marble temple of justice (1932–35). A
 * tall central block, a Corinthian temple with a pediment at each end and a
 * long gabled roof between, rises from two lower wings that wrap it to the
 * north and south, each wing round two light courts. The west front faces
 * the Capitol: a deep portico of sixteen columns in two rows of eight under
 * the pediment ("Equal Justice Under Law"), reached by a broad flight of
 * steps between two statue pedestals, from a raised oval plaza on First
 * Street. The east front has a shallower portico of eight columns before a
 * windowed wall.
 *
 * Covers and replaces: relation/286501 (one outer way, four inner courts).
 * No building:parts inside it. The plaza and the steps stand outside the
 * outline, as they do in reality.
 *
 * Evidence
 * - OSM (measured): outline 119.3 × 93.2 m; central block x ±59.65,
 *   y ±15.9; wings x ±45.1 to y ±46.6; light courts x ±13.4–31.4,
 *   y ±16.0–33.3. height=28.
 * - Published (Wikipedia, "United States Supreme Court Building"; the
 *   Court's architectural information sheets): four storeys, 92 ft (28 m);
 *   white Vermont marble outside; the west portico's double row of sixteen
 *   columns; bronze doors 17 ft high.
 * - Photos (Wikimedia Commons): "Panorama of United States Supreme Court
 *   Building at Dusk.jpg" (Joe Ravi, CC BY-SA 3.0), frontal from the west,
 *   used for every height below; "US Supreme Court.JPG" (Kjetil Ree, CC
 *   BY-SA 3.0) and "Supreme Court Building-2.jpg" (Smash the Iron Cage, CC
 *   BY-SA 4.0), the portico close; "Supreme Court Building Washington DC.jpg"
 *   (Mathieu Landretti, CC BY-SA 4.0), "Supreme Court Building-1.jpg"
 *   (Smash the Iron Cage, CC BY-SA 4.0) and "Supreme Court Building of the
 *   United States.JPG" (AgnosticPreachersKid, CC BY-SA 4.0), the west front
 *   from the south-west and north-west; "Supreme court east facade.jpg"
 *   (Jeff Kubina, CC BY-SA 2.0), the east portico; "Aerial view of the
 *   Supreme Court, Washington, D.C LCCN2011632816.tif" (Carol M. Highsmith,
 *   public domain), the roofs from the north-west.
 * - USGS NAIP orthophoto (public domain): the plan of the roofs and courts,
 *   the oval plaza, the pale roof colour.
 * - Measured from the frontal photo against the portico's OSM width
 *   (31.8 m): steps from the plaza (1.2 m) to the stylobate at 5.0 m;
 *   columns 5.0–19.5 m; entablature to 22.5 m; pediment apex 28 m (OSM);
 *   the wings' cornice about 14 m (the frontal photo gives 15.4, the oblique and aerial views 13.5), their roofs to 15.5 m; the statue
 *   pedestals to 6.5 m.
 * - Estimated: the second row of columns 5.8 m behind the first; the east
 *   portico's depth; the plaza's outline (from NAIP, x -98 to the wings,
 *   y ±40, rounded west corners) and its 1.2 m height; window sizes and
 *   rows (one tall panel per bay between pilasters, a small one below); the roof pitch of the wings; the
 *   flat-roofed block between each pair of courts at 18.2 m (aerial).
 * - Simplified: capitals are a flared bell and an abacus; the pediment
 *   sculpture, the inscriptions, the seated statues (drawn as plain blocks
 *   on their pedestals), lamp standards, flagpoles, fountains and the
 *   plaza's balustrade are left out.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cbox, cylinder, gable, grow, hip, panel, qf, rect, tf, type Rect, type Side } from './dc-white-house'
import { pslab, saveModel } from './dc-nga-west'

const marble = new Part(), shade = new Part(), roof = new Part(), win = new Part(), door = new Part()

// ---- Plan (OSM, symmetrical about both axes to within 0.3 m).
const XC = 59.65, YC = 15.9 // central block
const XW = 45.1, YW = 46.6 // wings
const CX0 = 13.6, CX1 = 31.4, CY1 = 33.3 // light courts, x ±CX0..CX1, y ±YC..CY1

// ---- Heights.
const PLAZA = 1.2, STYLO = 5.0, CAPS = 19.5, ENT = 22.5, APEX = 28.0
const W_CORNICE = 14.0, W_RIDGE = 15.5, MID = 18.2
const R = 0.82 // column radius

/** A Corinthian column: a plain base, a tapering shaft, the flared bell of the capital, an abacus. */
function column(x: number, y: number, z0 = STYLO, z1 = CAPS) {
  const seg = 10, bell = 1.8, pl = R * 1.3
  cbox(marble, rect(x - pl, x + pl, y - pl, y + pl), z0, z0 + 0.5, { b: 0.12 })
  cylinder(marble, x, y, R, z0 + 0.5, z1 - bell, seg, R * 0.87)
  cylinder(marble, x, y, R * 0.87, z1 - bell, z1 - 0.45, seg, R * 1.25)
  cbox(marble, rect(x - pl, x + pl, y - pl, y + pl), z1 - 0.45, z1, { bottom: true, top: false })
}

/** Windows in a row along a wall: n panels evenly over a0..a1, each w wide. */
function windows(side: Side, at: number, a0: number, a1: number, n: number, w: number, z0: number, z1: number) {
  const step = (a1 - a0) / n
  for (let k = 0; k < n; k++) {
    const c = a0 + step * (k + 0.5)
    panel(win, side, at, c - w / 2, c + w / 2, z0, z1, 0.05)
  }
}

// ===========================================================================
// The wings: four ranges round each pair of light courts, with low hips.
{
  const ranges: Rect[] = []
  for (const s of [-1, 1]) {
    const [y0, y1] = s < 0 ? [-YW, -CY1] : [CY1, YW]
    const [c0, c1] = s < 0 ? [-CY1, -YC] : [YC, CY1]
    ranges.push(rect(-XW, XW, y0, y1)) // the outer range
    ranges.push(rect(-XW, -CX1, c0, c1), rect(CX1, XW, c0, c1)) // the end ranges
    // Between the courts: a taller block with a flat roof, which the aerial
    // shows standing over the wing roofs against the central block.
    const mid = rect(-CX0, CX0, c0, c1)
    cbox(marble, mid, 0, MID - 0.6, { top: false })
    cbox(marble, grow(mid, 0.3), MID - 0.6, MID, { b: 0.25, bottom: true, top: roof })
    for (const sx of [-1, 1]) windows(sx < 0 ? 'w' : 'e', sx * CX0, c0 + 1, c1 - 1, 4, 1.6, 10.6, 16.4)
  }
  for (const r of ranges) {
    cbox(marble, r, 0, W_CORNICE - 0.7, { top: false })
    hip(roof, grow(r, 0.5), W_CORNICE, W_RIDGE, Math.min(r.x1 - r.x0, r.y1 - r.y0) / 2 + 0.5)
  }
  // The cornice band, round the outside only (the courts get a plain lip).
  for (const s of [-1, 1]) {
    const r = s < 0 ? rect(-XW, XW, -YW, -YC) : rect(-XW, XW, YC, YW)
    cbox(marble, grow(r, 0.55), W_CORNICE - 0.7, W_CORNICE, { b: 0.3, bottom: true, top: false })
    // a plinth course
    cbox(marble, grow(r, 0.2), 0, PLAZA + 1.0, { b: 0.12, top: false })
  }
  // Windows: tall, widely spaced, one per bay between shallow pilasters,
  // with a small window under each in the base, as the photos show.
  const bays = (side: Side, at: number, a0: number, a1: number, n: number) => {
    const step = (a1 - a0) / n
    for (let k = 0; k <= n; k++) {
      const a = a0 + k * step
      block(marble, side, at, Math.max(a0 - 1.2, a - 0.55), Math.min(a1 + 1.2, a + 0.55), PLAZA + 1.0, W_CORNICE - 0.7, 0.22, false, true)
    }
    windows(side, at, a0, a1, n, 2.0, 5.6, 10.6)
    windows(side, at, a0, a1, n, 1.5, 2.6, 4.0)
  }
  for (const s of [-1, 1]) {
    bays(s < 0 ? 's' : 'n', s * YW, -XW + 1.5, XW - 1.5, 12)
    for (const sx of [-1, 1]) {
      const [a0, a1] = s < 0 ? [-YW + 1.5, -YC - 1.0] : [YC + 1.0, YW - 1.5]
      bays(sx < 0 ? 'w' : 'e', sx * XW, a0, a1, 4)
    }
  }
}

// ===========================================================================
// The central block: walls to the entablature, a long gable between the two
// pediments, clerestory windows along its sides over the wings.
{
  const body = rect(-XW, XW, -YC, YC)
  cbox(marble, body, 0, ENT - 0.8, { top: false })
  for (const s of [-1, 1]) windows(s < 0 ? 's' : 'n', s * YC, -38, 38, 12, 1.8, 18.0, 20.8)
  // The entablature runs right round, over both porticos.
  const top = rect(-XC, XC, -YC, YC)
  cbox(marble, top, CAPS, ENT - 0.8, { bottom: true, top: false })
  cbox(marble, grow(top, 0.7), ENT - 0.8, ENT, { b: 0.35, bottom: true, top: false })
  // The roof: one gable from pediment to pediment, ridge along x.
  const g = grow(top, 0.7)
  gable(roof, marble, g, ENT, APEX, false)
  // the raking cornices: a pale lip under each slope at both ends
  for (const sx of [-1, 1]) {
    const f = sx * (g.x1 + 0.35)
    for (const sy of [-1, 1]) {
      qf(marble, [f, sy * g.y1, ENT - 0.05], [f, 0, APEX + 0.05], [f, 0, APEX - 0.6], [f, sy * g.y1, ENT - 0.6], [sx, 0, 0])
      qf(marble, [f, sy * g.y1, ENT - 0.6], [f, 0, APEX - 0.6], [sx * g.x1, 0, APEX - 0.6], [sx * g.x1, sy * g.y1, ENT - 0.6], [0, 0, -1])
    }
    // and a shallow tympanum recess, in shade, inside each pediment
    const t = sx * (g.x1 + 0.02), h = (APEX - ENT) - 1.6
    const half = (g.y1 - 1.6) * (h / (APEX - ENT - 0.6))
    tf(shade, [t, -half, ENT + 0.35], [t, half, ENT + 0.35], [t, 0, ENT + 0.35 + h * 0.86], [sx, 0, 0])
  }
}

// ===========================================================================
// The west portico: two rows of eight over the steps.
{
  const front = -XC + R + 0.5, second = front + 5.8
  cbox(marble, rect(-XC, -XW, -YC, YC), 0, STYLO, { b: 0.2 })
  const ys = Array.from({ length: 8 }, (_, k) => -YC + 1.6 + ((2 * YC - 3.2) * k) / 7)
  for (const y of ys) column(front, y)
  for (const y of ys) column(second, y)
  // the shaded back wall, and the great bronze doors
  panel(shade, 'w', -XW, -YC, YC, STYLO, CAPS, 0.03)
  panel(door, 'w', -XW, -1.6, 1.6, STYLO, STYLO + 5.2, 0.08)
  // The steps from the plaza, between the statue pedestals.
  const N = 9, X0 = -XC - 12.0, W = 13.4
  for (let k = 0; k < N; k++) {
    const x0 = X0 + (k * (-XC - X0)) / N
    cbox(marble, rect(x0, -XC, -W, W), 0, PLAZA + ((k + 1) * (STYLO - PLAZA)) / N, { top: true })
  }
  for (const sy of [-1, 1]) {
    const [y0, y1] = sy < 0 ? [-YC - 1.2, -W] : [W, YC + 1.2]
    cbox(marble, rect(X0 - 0.6, -XC, y0, y1), 0, STYLO - 0.6, { b: 0.2 })
    // the pedestal with its seated statue, drawn as a plain block
    cbox(marble, rect(X0 - 0.6, X0 + 4.0, y0, y1), STYLO - 0.6, 6.6, { b: 0.2 })
    cbox(shade, rect(X0 + 0.2, X0 + 3.2, y0 + 0.4, y1 - 0.4), 6.6, 8.2, { b: 0.35 })
  }
}

// ===========================================================================
// The east portico: one row of eight before a windowed wall.
{
  const wall = XC - 2.9, front = XC - R - 0.4
  cbox(marble, rect(XW, XC, -YC, YC), 0, STYLO, { b: 0.2 })
  cbox(marble, rect(XW, wall, -YC, YC), STYLO, CAPS, { top: false })
  panel(shade, 'e', wall, -YC, YC, STYLO, CAPS, 0.03)
  const ys = Array.from({ length: 8 }, (_, k) => -YC + 1.6 + ((2 * YC - 3.2) * k) / 7)
  for (const y of ys) column(front, y)
  for (let k = 0; k < 7; k++) {
    const c = (ys[k] + ys[k + 1]) / 2
    panel(win, 'e', wall, c - 0.9, c + 0.9, 7.0, 10.6, 0.06)
    panel(win, 'e', wall, c - 0.9, c + 0.9, 13.0, 16.0, 0.06)
    panel(win, 'e', XC, c - 0.9, c + 0.9, 1.8, 3.8, 0.05)
  }
  panel(door, 'e', wall, -1.4, 1.4, STYLO, STYLO + 4.6, 0.08)
}

// ===========================================================================
// The plaza: a raised marble terrace before the west front, two low steps
// up from the sidewalk round its rounded west end.
{
  const X0 = -98, X1 = -XW, Y = 40, RC = 14
  const outline = (d: number) => {
    const pts: Array<[number, number]> = [[X1, -Y - d], [X1, Y + d]]
    for (let k = 0; k <= 6; k++) {
      const a = Math.PI / 2 + (k * Math.PI) / 12
      pts.push([X0 + RC + (RC + d) * Math.cos(a), Y - RC + (RC + d) * Math.sin(a)])
    }
    for (let k = 0; k <= 6; k++) {
      const a = Math.PI + (k * Math.PI) / 12
      pts.push([X0 + RC + (RC + d) * Math.cos(a), -Y + RC + (RC + d) * Math.sin(a)])
    }
    return pts
  }
  // two steps: the lower one a metre wider all round
  pslab(marble, outline(1.0), 0, PLAZA * 0.5, 0.1, true)
  pslab(marble, outline(0), 0, PLAZA, 0.1, true)
}

await saveModel('dc-supreme-court', 'Supreme Court of the United States', [
  { part: marble, material: finish('sc-marble', 0xf3eee6) },
  { part: shade, material: finish('sc-marble-shade', 0xd8d1c5) },
  { part: roof, material: finish('sc-roof-tile', 0xbdb6aa) },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
], { source: 'generators/dc-supreme-court.ts', bearing: 0.11, osm: 'relation/286501', footprint: [119.3, 93.2], height: APEX }, 6500)
