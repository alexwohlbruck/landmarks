/**
 * Arlington Memorial Amphitheater — procedural, CC0-1.0, no textures.
 * bun generators/dc-memorial-amphitheater.ts
 *
 * Map frame: x east, y north, z up, metres. The anchor is the area centroid
 * of the outline's outer way (relation/15311889, outer way/38457132): lng
 * -77.0728838, lat 38.8764195. The building's east–west axis (through the
 * stage and the east entrance hall) is turned 2.6° clockwise from east,
 * fitted on the hall's three straight walls, so the model is placed at
 * bearing 2.6 and built square.
 *
 * What it is: Carrère and Hastings' open-air amphitheatre of 1915–20 in
 * white Danby (Vermont) marble. An elliptical bowl of marble benches, long
 * axis north–south, ringed by a continuous colonnade: paired columns on the
 * inside, a roofed walk, and an arcade wall outside, under one Ionic
 * entablature, on a podium a storey high. The ring opens at the west into a
 * tall entrance with four columns in antis under an inscribed attic, and at
 * the north and south ends of its short axis. At the east the stage stands
 * in a great arched apse under a pediment, backed by the two-storey entrance
 * hall, dark-roofed with two glass skylights, whose east front has six
 * columns in antis under a pediment, between balustraded terraces, over the
 * plaza of the Tomb of the Unknown Soldier.
 *
 * Covers and replaces: relation/15311889 (outer way/38457132: ring, stage
 * and hall; its inner way/1065498813 is the seating, leisure=bleachers) and
 * the building:part way/1065498812 (the stage and apse). The Tomb of the
 * Unknown Soldier is not a building in OSM and is not modelled; nor are the
 * plaza, the steps down to it or the sentry box (way/1519132354).
 *
 * Evidence
 * - OSM (measured, in the model frame): the bowl an ellipse 47.2 × 61.0 m
 *   (centre x −10.5), the ring's outer face an ellipse about 59 × 72.9 m;
 *   the west entrance 17 m wide reaching x −46.7; small exits at the ends
 *   of the short axis 8 m wide; the stage block 13.8 m wide from x 12.5,
 *   its cross arms 25.5 m wide; the hall and its terraces x 26–46.6, 42.5 m
 *   north–south. No heights.
 * - Published (Wikipedia, "Arlington Memorial Amphitheater"; ANC):
 *   elliptical, seating 4,000; Danby marble; colonnade with main entrances
 *   on the east and west axes; Doric capitals on Attic bases under an
 *   Ionic entablature; the stage a semicircular apse; a six-column portico
 *   on the east front of the entrance hall.
 * - Photos (Wikimedia Commons): "Arlington National Cemetery
 *   Amphitheater.jpg" (Susanne Bledsoe, USACE, public domain), from above
 *   the west entrance; "Arlington Memorial Amphitheater 2017.jpg" (Hunter
 *   Bloor, CC BY-SA 4.0), the bowl, colonnade and apse; "Arlington Memorial
 *   Amphitheater 1.jpg" (Ashokmehta72, CC BY-SA 4.0), the colonnade from
 *   the benches; "Arlington Memorial Amphitheater entrance 2011.jpg"
 *   (Wknight94, CC BY-SA 3.0), the west entrance; "Arlington Memorial
 *   Amphitheater and Tomb of the Unknown Soldier.JPG" (Reeganreegs, CC BY-SA
 *   3.0), the east front; "Arlington Memorial Amphitheater 2023.jpg"
 *   (David, CC BY 2.0), from the air: the hall's east front and the north
 *   side of the ring.
 * - USGS NAIP orthophoto (public domain): the white ring and benches, the
 *   stage's cross, the hall's pale roof, the plaza.
 * - Estimated from the photos (no published heights): the colonnade floor
 *   3.6 m up (a storey of podium outside, the benches' top row 1.4 m below
 *   it inside), columns to 10 m, entablature to 11.6 m, parapet 12.3 m; the
 *   west entrance's attic to 14.4 m; the apse frame's cornice 15.4 m and
 *   pediment 18 m; the hall's columns to 12.4 m, cornice 14.6 m, balustrade
 *   15.7 m, pediment 17.6 m. The hall itself about 30 m across (measured on
 *   the 2023 aerial against the ring), its portico 16.6 m, with terraces
 *   filling the outline to its 42.5 m. The hall's height is the least sure
 *   number here: the photos from the east read anywhere from 15 to 19 m.
 *   34 paired bays round the ring, drawn evenly. The ring is drawn
 *   concentric with the bowl, 5.9 m wide; OSM's outer way sits up to 2 m
 *   further east.
 * - Simplified: the arcade wall is solid, its arched openings drawn as
 *   shaded panels outside, and the walk behind the columns is drawn in
 *   shade (it is roofed and dark in every photo); the benches are six
 *   stepped elliptical tiers (the real rows are arcs round the stage); the
 *   balustrades are plain parapets; inscriptions, urns and the chapel are
 *   left out. y = 0 is the lowest ground, at the west entrance.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, cylinder, gable, hip, qf, rect, tf } from './dc-white-house'
import { saveModel } from './dc-nga-west'

// ---- Plan.
const CX = -9.5, CY = 0.3 // the bowl's and ring's centre
const A = 23.9, B = 30.5 // the bowl's edge (top row of benches)
const D_COL = 0.9 // inner columns, out from the bowl's edge
const D_ARC0 = 4.4, D_ARC1 = 5.5 // the outer arcade wall; the walk lies inside it
const D_OUT = 5.9 // the entablature's outer face
const T0 = (16 * Math.PI) / 180 // the ring runs from here round the west to −T0
const STAGE_X = 12.5, STAGE_Y = 6.9 // the stage block's front and half-width
const HALL_X0 = 26, HALL_X1 = 46.6, HALL_Y = 15
// ---- Heights.
const FLOOR = 3.6
const SEAT_TOP = 2.2, SEAT_RISE = 0.25, TIERS = 6
const COL_TOP = 10.0, ENT = 11.6, PARAPET = 12.3
const APSE_CORNICE = 15.4, APSE_APEX = 18.0
const HALL_COLS = 12.4, HALL_CORNICE = 14.6, HALL_BALUSTRADE = 15.7, HALL_APEX = 17.6

const E = (d: number, t: number, z = 0): V3 => [CX + (A + d) * Math.cos(t), CY + (B + d) * Math.sin(t), z]
const nrmAt = (t: number): V3 => {
  const nx = Math.cos(t) / A, ny = Math.sin(t) / B, l = Math.hypot(nx, ny)
  return [nx / l, ny / l, 0]
}

/** Angles along the ellipse at offset d, evenly spaced by arc length, from t0 to t1. */
function evenAngles(d: number, t0: number, t1: number, n: number): number[] {
  const S = 720, ts: number[] = [], acc: number[] = [0]
  for (let i = 0; i <= S; i++) ts.push(t0 + ((t1 - t0) * i) / S)
  for (let i = 1; i <= S; i++) {
    const p = E(d, ts[i - 1]), q = E(d, ts[i])
    acc.push(acc[i - 1] + Math.hypot(q[0] - p[0], q[1] - p[1]))
  }
  const L = acc[S]
  return Array.from({ length: n + 1 }, (_, k) => {
    const s = (L * k) / n
    let i = acc.findIndex((v) => v >= s)
    if (i <= 0) return ts[Math.max(0, i)]
    const f = (s - acc[i - 1]) / (acc[i] - acc[i - 1] || 1)
    return ts[i - 1] + (ts[i] - ts[i - 1]) * f
  })
}

/** A vertical band of the ring's wall at offset d, facing out (or in), z0..z1. */
function ringWall(p: Part, d: number, ts: number[], z0: number, z1: number, out: boolean) {
  for (let i = 0; i < ts.length - 1; i++) {
    const a = ts[i], b = ts[i + 1], m = (a + b) / 2
    const n = nrmAt(m).map((c) => (out ? c : -c)) as V3
    qf(p, E(d, a, z0), E(d, b, z0), E(d, b, z1), E(d, a, z1), n)
  }
}

/** A flat band of the ring between offsets d0 and d1 at z, facing up or down. */
function ringFlat(p: Part, d0: number, d1: number, ts: number[], z: number, up = true) {
  for (let i = 0; i < ts.length - 1; i++) {
    const a = ts[i], b = ts[i + 1]
    qf(p, E(d0, a, z), E(d0, b, z), E(d1, b, z), E(d1, a, z), [0, 0, up ? 1 : -1])
  }
}

/** A flat panel with a round head on the ring's face at offset d, centred on angle t. */
function ringArch(p: Part, d: number, t: number, w: number, z0: number, zs: number, out: boolean, seg = 6) {
  const n = nrmAt(t).map((c) => (out ? c : -c)) as V3
  const c = E(d + (out ? 0.04 : -0.04), t)
  const tan: V3 = [-n[1], n[0], 0]
  const P = (u: number, z: number): V3 => [c[0] + tan[0] * u, c[1] + tan[1] * u, z]
  const r = w / 2
  qf(p, P(-r, z0), P(r, z0), P(r, zs), P(-r, zs), n)
  for (let k = 0; k < seg; k++) {
    const a0 = (Math.PI * k) / seg, a1 = (Math.PI * (k + 1)) / seg
    tf(p, P(0, zs), P(r * Math.cos(a0), zs + r * Math.sin(a0)), P(r * Math.cos(a1), zs + r * Math.sin(a1)), n)
  }
}

/** A column: shaft, a flared capital and a square abacus. */
function column(p: Part, x: number, y: number, r: number, z0: number, z1: number, seg = 10) {
  cylinder(p, x, y, r * 1.12, z0, z0 + 0.35, seg, r * 1.12)
  cylinder(p, x, y, r, z0 + 0.35, z1 - 0.55, seg, r * 0.9)
  cylinder(p, x, y, r * 0.9, z1 - 0.55, z1 - 0.3, seg, r * 1.12)
  const a = r * 1.2
  cbox(p, rect(x - a, x + a, y - a, y + a), z1 - 0.3, z1, { bottom: true, top: false })
}

/** A flat arched panel on an axis-aligned wall. */
function axisArch(p: Part, n: V3, at: number, c: number, w: number, z0: number, zs: number, seg = 8) {
  const ns = n[0] === 0
  const off = at + (ns ? n[1] : n[0]) * 0.04
  const Q = (a: number, z: number): V3 => (ns ? [a, off, z] : [off, a, z])
  const r = w / 2
  qf(p, Q(c - r, z0), Q(c + r, z0), Q(c + r, zs), Q(c - r, zs), n)
  for (let k = 0; k < seg; k++) {
    const a0 = (Math.PI * k) / seg, a1 = (Math.PI * (k + 1)) / seg
    tf(p, Q(c, zs), Q(c + r * Math.cos(a0), zs + r * Math.sin(a0)), Q(c + r * Math.cos(a1), zs + r * Math.sin(a1)), n)
  }
}

/** A flat rectangle on an axis-aligned wall. */
function axisPanel(p: Part, n: V3, at: number, a0: number, a1: number, z0: number, z1: number, d = 0.05) {
  const ns = n[0] === 0
  const off = at + (ns ? n[1] : n[0]) * d
  const Q = (a: number, z: number): V3 => (ns ? [a, off, z] : [off, a, z])
  qf(p, Q(a0, z0), Q(a1, z0), Q(a1, z1), Q(a0, z1), n)
}

function build() {
  const marble = new Part(), shade = new Part(), roof = new Part(), slate = new Part(), copper = new Part(), win = new Part()

  // ---- The bowl: stepped elliptical tiers of benches, closing toward the
  // stage. Tier k's edge shrinks and slides east, so the rows bunch round
  // the stage as the real arcs do.
  const N = 48
  const full = Array.from({ length: N + 1 }, (_, i) => (i * 2 * Math.PI) / N)
  const tierRing = (k: number, z: number) => {
    const f = 1 - (k / TIERS) * 0.72, sx = (k / TIERS) * 9
    return full.map((t) => [CX + sx + A * f * Math.cos(t), CY + B * f * Math.sin(t), z] as V3)
  }
  for (let k = 0; k < TIERS; k++) {
    const z = SEAT_TOP - k * SEAT_RISE, zn = z - SEAT_RISE
    const o = tierRing(k, z), i = tierRing(k + 1, z), iLow = tierRing(k + 1, zn)
    for (let j = 0; j < N; j++) {
      qf(marble, o[j], o[j + 1], i[j + 1], i[j], [0, 0, 1])
      // the riser, facing in toward the stage
      const m = (full[j] + full[j + 1]) / 2
      qf(shade, iLow[j], iLow[j + 1], i[j + 1], i[j], [-Math.cos(m), -Math.sin(m), 0])
    }
  }
  const floor = tierRing(TIERS, SEAT_TOP - TIERS * SEAT_RISE)
  const fc: V3 = [CX + 9, CY, floor[0][2]]
  for (let j = 0; j < N; j++) tf(marble, fc, floor[j], floor[j + 1], [0, 0, 1])

  // ---- The ring: free columns on the inside, a roofed walk, and the outer
  // arcade wall, all under one entablature.
  const ts = Array.from({ length: 49 }, (_, i) => T0 + ((2 * Math.PI - 2 * T0) * i) / 48)
  // podium: outer face from the ground, inner face above the top tier, floor
  ringWall(marble, D_ARC1, ts, 0, FLOOR, true)
  ringWall(marble, 0, ts, SEAT_TOP - 0.2, FLOOR, false)
  ringFlat(marble, 0, D_ARC1, ts, FLOOR)
  // the outer arcade wall
  ringWall(marble, D_ARC1, ts, FLOOR, COL_TOP, true)
  // the walk behind the columns is in shade: the outer wall's inner face and the ceiling
  ringWall(shade, D_ARC0, ts, FLOOR, COL_TOP, false)
  // entablature, the walk's ceiling under it, and the parapets on top
  ringWall(marble, D_OUT, ts, COL_TOP, ENT, true)
  ringWall(marble, 0.25, ts, COL_TOP, ENT, false)
  ringFlat(shade, 0.25, D_ARC0, ts, COL_TOP, false)
  ringFlat(marble, D_ARC1, D_OUT, ts, COL_TOP, false)
  ringWall(marble, D_OUT, ts, ENT, PARAPET, true)
  ringWall(marble, 0.25, ts, ENT, PARAPET, false)
  ringWall(marble, D_OUT - 0.45, ts, ENT, PARAPET, false)
  ringWall(marble, 0.7, ts, ENT, PARAPET, true)
  ringFlat(marble, 0.25, 0.7, ts, PARAPET)
  ringFlat(marble, D_OUT - 0.45, D_OUT, ts, PARAPET)
  ringFlat(roof, 0.7, D_OUT - 0.45, ts, ENT + 0.2)
  // the ring's two ends, where it meets the stage's links
  for (const t of [T0, 2 * Math.PI - T0]) {
    const tg: V3 = [-Math.sin(t) * A, Math.cos(t) * B, 0]
    const n = (t < Math.PI ? [-tg[0], -tg[1], 0] : tg) as V3
    qf(marble, E(0, t, SEAT_TOP - 0.2), E(D_OUT, t, SEAT_TOP - 0.2), E(D_OUT, t, PARAPET), E(0, t, PARAPET), n)
  }

  // Bays: a pair of columns on the inside at every pier, and an arch through
  // the outer wall between. The west entrance and the two side exits take
  // the place of a few bays.
  const NB = 38
  const tb = evenAngles(D_COL, T0 + 0.05, 2 * Math.PI - T0 - 0.05, NB)
  const skip = (t: number) => {
    const deg = ((t * 180) / Math.PI + 360) % 360
    return Math.abs(deg - 180) < 14 || Math.abs(deg - 90) < 6.5 || Math.abs(deg - 270) < 6.5
  }
  for (let i = 0; i <= NB; i++) {
    const t = tb[i]
    if (skip(t)) continue
    // plain shafts: at this size a capital is a pixel, and the entablature
    // sits right on them
    const ci = E(D_COL, t), n = nrmAt(t), tg = [-n[1], n[0]]
    for (const u of [-0.62, 0.62]) cylinder(marble, ci[0] + tg[0] * u, ci[1] + tg[1] * u, 0.4, FLOOR, COL_TOP, 10, 0.35)
    if (i < NB && !skip(tb[i + 1])) ringArch(shade, D_ARC1, (t + tb[i + 1]) / 2, 2.9, FLOOR + 0.9, 7.9, true)
  }

  // ---- West entrance: two massive piers, four columns, the attic, the steps.
  {
    const x1 = CX - A - D_OUT + 0.6, x0 = -44.6, y = 8.5
    for (const s of [-1, 1]) cbox(marble, rect(x0, x1, s < 0 ? -y : y - 2.6, s < 0 ? -y + 2.6 : y), 0, ENT, { top: false })
    cbox(marble, rect(x0, x1, -y + 2.6, y - 2.6), 0, FLOOR, { b: 0.1 })
    // the back of the porch: a flat wall against the ring, in shade
    const xb = CX - A - D_ARC1 - 0.4
    cbox(marble, rect(xb, x1, -y + 2.6, y - 2.6), FLOOR, COL_TOP, { top: false })
    axisPanel(shade, [-1, 0, 0], xb, -y + 2.6, y - 2.6, FLOOR, COL_TOP, 0.03)
    for (const yy of [-4.35, -1.45, 1.45, 4.35]) column(marble, x0 + 1.0, yy, 0.55, FLOOR, COL_TOP, 12)
    cbox(marble, rect(x0 - 0.3, x1, -y - 0.3, y + 0.3), COL_TOP, ENT, { bottom: true, top: false })
    cbox(marble, rect(x0 - 0.1, x1, -y - 0.1, y + 0.1), ENT, 14.4, { b: 0.25 })
    // steps down to the walk
    for (let k = 0; k < 3; k++) cbox(marble, rect(-46.7 + k * 0.7, x0, -y + 2.6, y - 2.6), 0, FLOOR * ((k + 1) / 3) - 0.05 * k, { top: true })
  }
  // ---- Side exits at the ends of the short axis.
  for (const s of [-1, 1]) {
    const y0 = CY + s * (B + D_OUT - 0.6), y1 = CY + s * (B + D_OUT + 2.0)
    cbox(marble, rect(CX - 4.1, CX + 4.1, Math.min(y0, y1), Math.max(y0, y1)), 0, PARAPET, { b: 0.2 })
    axisArch(shade, [0, s, 0], y1, CX, 3.6, FLOOR, 8.4)
  }

  // ---- The stage: platform, and the apse block's great arch under a pediment.
  cbox(marble, rect(STAGE_X - 3.6, STAGE_X, -STAGE_Y + 0.6, STAGE_Y - 0.6), 0, 2.6, { b: 0.1 })
  cbox(marble, rect(STAGE_X - 1.8, STAGE_X, -STAGE_Y + 0.6, STAGE_Y - 0.6), 0, 3.4, { b: 0.1 })
  cbox(marble, rect(STAGE_X, HALL_X0, -STAGE_Y, STAGE_Y), 0, APSE_CORNICE, { top: false })
  cbox(marble, rect(STAGE_X - 0.35, HALL_X0, -STAGE_Y - 0.35, STAGE_Y + 0.35), APSE_CORNICE - 0.7, APSE_CORNICE, { bottom: true, top: false })
  axisArch(shade, [-1, 0, 0], STAGE_X, 0, 8.0, FLOOR, 11.6, 10)
  gable(slate, marble, rect(STAGE_X - 0.35, HALL_X0, -STAGE_Y - 0.35, STAGE_Y + 0.35), APSE_CORNICE, APSE_APEX, false, [true, false])
  // Between the stage block, the ring's ends and the hall: flat-roofed links.
  for (const s of [-1, 1]) {
    const r = rect(STAGE_X + 1.2, HALL_X0, s < 0 ? -17.5 : STAGE_Y, s < 0 ? -STAGE_Y : 17.5)
    cbox(marble, r, 0, PARAPET, { top: roof, b: 0.2 })
  }

  // ---- The entrance hall: a block of marble under a balustrade, its middle
  // under a dark hipped roof (the OSM part's cross arms) with two low glass
  // skylights, and its east front of six columns in antis under a pediment.
  // Either side of it, down to the outline's ends, balustraded terraces at the
  // colonnade's floor.
  const RX = HALL_X1 - 1.8 // the recessed wall behind the columns
  const HC = HALL_COLS, HE = HALL_CORNICE, HY = HALL_Y, PY = 8.3
  cbox(marble, rect(HALL_X0, RX, -HY, HY), 0, HE, { top: roof })
  for (const s of [-1, 1]) cbox(marble, rect(RX, HALL_X1, s < 0 ? -HY : PY, s < 0 ? -PY : HY), 0, HE, { top: roof })
  cbox(marble, rect(RX, HALL_X1 + 0.3, -PY, PY), HC, HE, { bottom: true, top: roof })
  cbox(marble, rect(RX, HALL_X1 + 1.2, -PY, PY), 0, FLOOR, { b: 0.1 })
  axisPanel(shade, [1, 0, 0], RX, -PY, PY, FLOOR, HC, 0.03)
  for (const y of [-6.9, -4.15, -1.38, 1.38, 4.15, 6.9]) column(marble, HALL_X1 - 0.6, y, 0.5, FLOOR, HC, 12)
  tf(marble, [HALL_X1 + 0.3, -PY - 0.4, HE], [HALL_X1 + 0.3, PY + 0.4, HE], [HALL_X1 + 0.3, 0, HALL_APEX], [1, 0, 0])
  gable(slate, marble, rect(HALL_X1 - 6, HALL_X1 + 0.3, -PY - 0.4, PY + 0.4), HE, HALL_APEX, false, [false, false])
  hip(slate, rect(HALL_X0 - 1, HALL_X1 - 5, -12.8, 12.8), HE, HALL_APEX + 0.3, 5.0)
  for (const s of [-1, 1]) hip(copper, rect(HALL_X1 - 6.5, HALL_X1 - 2.0, s < 0 ? -14.2 : 9.4, s < 0 ? -9.4 : 14.2), HE, HE + 1.1, 1.4)
  // balustrade round the roof's edge, beside the pediment
  for (const [x0, x1, y0, y1] of [[HALL_X0, HALL_X1, HY - 0.4, HY], [HALL_X0, HALL_X1, -HY, -HY + 0.4], [HALL_X0, HALL_X0 + 0.4, -HY, HY],
    [HALL_X1 - 0.4, HALL_X1, PY + 0.4, HY], [HALL_X1 - 0.4, HALL_X1, -HY, -PY - 0.4]]) {
    cbox(marble, rect(x0, x1, y0, y1), HE, HALL_BALUSTRADE, { top: true })
  }
  // the terraces either side, with their parapets
  for (const s of [-1, 1]) {
    const y0 = s < 0 ? -21.2 : HY, y1 = s < 0 ? -HY : 21.2
    cbox(marble, rect(HALL_X0, HALL_X1 - 2, y0, y1), 0, FLOOR, { top: roof, b: 0.1 })
    const yo = s < 0 ? y0 : y1 - 0.4
    cbox(marble, rect(HALL_X0, HALL_X1 - 2, yo, yo + 0.4), FLOOR, FLOOR + 1.1, { top: true })
    cbox(marble, rect(HALL_X1 - 2.4, HALL_X1 - 2, Math.min(y0, y1), Math.max(y0, y1)), FLOOR, FLOOR + 1.1, { top: true })
  }
  // the bronze doors and the windows of the east front and the hall's sides: two storeys
  axisPanel(win, [1, 0, 0], RX, -1.3, 1.3, FLOOR, 8.6)
  for (const y of [-4.15, 4.15]) axisPanel(win, [1, 0, 0], RX, y - 0.8, y + 0.8, 5.0, 8.4)
  for (const y of [-4.15, 0, 4.15]) axisPanel(win, [1, 0, 0], RX, y - 0.8, y + 0.8, 9.8, 11.8)
  for (const s of [-1, 1]) {
    const y = s * 11.7
    axisPanel(win, [1, 0, 0], HALL_X1, y - 1.0, y + 1.0, 5.0, 8.6)
    axisPanel(win, [1, 0, 0], HALL_X1, y - 1.0, y + 1.0, 9.8, 12.0)
    for (const x of [37.0, 42.0]) {
      axisPanel(win, [0, s, 0], s * HY, x - 0.9, x + 0.9, 5.0, 8.6)
      axisPanel(win, [0, s, 0], s * HY, x - 0.9, x + 0.9, 9.8, 12.0)
    }
  }

  return [
    { part: marble, material: MARBLE },
    { part: shade, material: SHADE },
    { part: roof, material: ROOF },
    { part: slate, material: PALETTE.roof },
    { part: copper, material: PALETTE.copper },
    { part: win, material: PALETTE.window },
  ]
}

/** Danby "Mountain White" marble: whiter and cooler than the palette's stone. */
const MARBLE = finish('danby-marble', 0xf3f0ea)
/** The colonnade's walkway roof, the hall's flat roofs: pale marble paving and membrane (NAIP). */
const ROOF = finish('danby-roof', 0xd3d1cb)
/** The arcade's openings and the apse, in shadow behind the columns. */
const SHADE = finish('danby-marble-shade', 0xb9b7b2)

if (import.meta.main) {
  await saveModel('dc-memorial-amphitheater', 'Memorial Amphitheater', build(), { source: 'generators/dc-memorial-amphitheater.ts' }, 6500)
}

