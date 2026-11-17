/**
 * Cathedral of Christ the King (1937-39, Henry Dagit and Sons), Atlanta:
 * procedural, CC0-1.0.
 * bun generators/atl-cathedral-christ-the-king.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 359 (the nave
 * runs a degree west of north). The twin-towered front faces model -y
 * (compass 179, Peachtree Way); the long west side faces Peachtree Road.
 * Origin: the area centroid of OSM way/267773212 (-84.3869172, 33.8280134).
 * y = 0 is the lowest ground under the footprint, on the east side (lidar
 * ground about 275.0 m; Mapterhorn 275.2 m). The site falls about 5.4 m from
 * Peachtree Road on the west to the parish buildings on the east, and the
 * front stands a storey above Peachtree Way, reached by a double stair.
 *
 * Form: a French Gothic limestone church: a tall nave under a steep slate
 * roof, its front a big gable with a deep pointed archivolt holding a
 * six-lobed rose over a lancet and a statue niche, a pointed portal above a
 * stone stair with a lower door; two slender square towers at the front
 * corners, each with an open lancet belfry, corner pinnacles and an
 * octagonal stone spire with a cross; shallow transepts whose gables carry
 * two pairs of lancets under oculi; four bays of paired lancets with oculi
 * along the nave between buttresses; lower flat-roofed sacristy and parish
 * wings behind (north) and to the east, all inside the OSM outline.
 *
 * Sources
 * - OSM way/267773212 (outline, building=cathedral). Its west and front
 *   edges sit 1 to 2 m inside the lidar's; the model follows the lidar.
 * - USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 1 m grid, heights
 *   above y = 0: nave walls x -12.5..3.5, eaves 17.9, ridge 22.8 at x -4.5
 *   (y -23..22); transept y 2.4..14.4, ridge 21.4, arms to x -14.5 and 8.5; the
 *   north wing roof 9.9, the east wings 8.7 and 12.0; the towers' spires
 *   reach at least 26.2 (the thin spire is undersampled).
 * - USGS NAIP (public domain): plan, roofs.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Farragutful, "Christ the King - Atlanta 01.jpg", "... 02.jpg",
 *     "... 03.jpg" (front), "... 05.jpg" (west side, transept),
 *     "... 10.jpg" (tower top), CC BY-SA 4.0;
 *   JJonahJackalope, "Cathedral of Christ the King, Atlanta.jpg",
 *     CC BY-SA 4.0 (west side from Peachtree Road);
 *   Tbook, "Cathedral Of Christ the King in Atlanta.jpg", public domain
 *     (front).
 * Published: built 1937-39, dedicated January 1939; cathedral of the
 *   Archdiocese of Atlanta (Wikipedia).
 * Estimated from photos: the towers' size and stages, the tower tops (to
 *   33.9 with the cross, scaled from the front gable in Farragutful 01; the
 *   lidar only catches the spires' lower part), window sizes, the stair.
 * Doubts: the east side is hidden by the parish buildings and barely
 *   photographed; the east wings are plain blocks at their lidar heights.
 *   The apse end is covered by the north wing and not modelled separately.
 *   The front stair stands outside OSM's outline, as it does in reality.
 * Colour: pale buff Indiana limestone (photos), a brownish-grey slate roof,
 *   dark lancet panels; stone trim in a lighter cream.
 * Night: the front and towers are floodlit; the windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, extrudeShape, lathe, arc, finishGlb, writeModel } from './sea-tacoma-union-station'

// ---------------------------------------------------------------- helpers

function qf(part: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) part.quad(a, b, c, d)
  else part.quad(d, c, b, a)
}
function tf(part: Part, a: V3, b: V3, c: V3, want: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) part.tri(a, b, c)
  else part.tri(a, c, b)
}
function box(wall: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bevel = 0.3) {
  prism(wall, top, bevel > 0 ? chamfer(rect(x0, y0, x1, y1), bevel) : rect(x0, y0, x1, y1), z0, z1)
}
const faceX = (x: number, sgn: 1 | -1): Face => ({ o: [x, 0, 0], n: [sgn, 0] })
const faceY = (y: number, sgn: 1 | -1): Face => ({ o: [0, y, 0], n: [0, sgn] })
const sOf = (f: Face, w: number) => (f.n[0] !== 0 ? (f.n[0] > 0 ? w : -w) : f.n[1] > 0 ? -w : w)
/** A pointed (equilateral) arch outline: jambs from z0, springing at zs. */
function pointed(sc: number, w: number, z0: number, zs: number, segs = 5): XY[] {
  const h = w / 2
  return [[sc - h, z0], [sc + h, z0], ...arc(sc - h, zs, w, 0, 60, segs), ...arc(sc + h, zs, w, 120, 180, segs).slice(1)]
}
/** A pointed band (archivolt) between widths w0 < w1, both springing at zs, jambs down to z0. */
function pointedBand(sc: number, w0: number, w1: number, z0: number, zs: number, segs = 6): XY[] {
  const inner = pointed(sc, w0, z0, zs, segs), outer = pointed(sc, w1, z0, zs + (w1 - w0) * 0.25, segs)
  return [outer[0], inner[0], ...inner.slice(2).reverse(), inner[1], outer[1], ...outer.slice(2)]
}
/** A gable roof over a rectangle, the ridge along y (axis 'y') or x, with eaves at z0 and the ridge at z1. */
function gableRoof(roof: Part, end: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, axis: 'x' | 'y', over = 0.4) {
  if (axis === 'y') {
    const xm = (x0 + x1) / 2
    qf(roof, [x0 - over, y0, z0], [x0 - over, y1, z0], [xm, y1, z1], [xm, y0, z1], [-(z1 - z0), 0, xm - x0])
    qf(roof, [x1 + over, y0, z0], [x1 + over, y1, z0], [xm, y1, z1], [xm, y0, z1], [z1 - z0, 0, x1 - xm])
    if (end) for (const [y, s] of [[y0, -1], [y1, 1]] as [number, number][]) tf(end, [x0, y, z0], [x1, y, z0], [xm, y, z1], [0, s, 0])
  } else {
    const ym = (y0 + y1) / 2
    qf(roof, [x0, y0 - over, z0], [x1, y0 - over, z0], [x1, ym, z1], [x0, ym, z1], [0, -(z1 - z0), ym - y0])
    qf(roof, [x0, y1 + over, z0], [x1, y1 + over, z0], [x1, ym, z1], [x0, ym, z1], [0, z1 - z0, y1 - ym])
    if (end) for (const [x, s] of [[x0, -1], [x1, 1]] as [number, number][]) tf(end, [x, y0, z0], [x, y1, z0], [x, ym, z1], [s, 0, 0])
  }
}

// ---------------------------------------------------------------- the model

const NX0 = -12.5, NX1 = 3.5, NY0 = -23.0, NY1 = 22.0, AX = -4.5 // the nave and its axis
const EAVE = 17.9, RIDGE = 22.8
const FLOOR = 6.0 // the church floor, a storey above Peachtree Way
const TY0 = 2.4, TY1 = 14.4, TX0 = -14.5, TX1 = 8.5, TRIDGE = 21.4 // the transept

function build() {
  const stone = new Part(), trim = new Part(), slate = new Part(), win = new Part(), flat = new Part(), door = new Part()

  // ---- the nave
  box(stone, null, NX0, NY0, NX1, NY1, 0, EAVE, 0.2)
  box(trim, null, NX0 - 0.25, NY0 - 0.25, NX1 + 0.25, NY1 + 0.25, EAVE - 0.5, EAVE, 0.15) // the eaves course
  gableRoof(slate, null, NX0, NY0 + 0.6, NX1, NY1, EAVE, RIDGE, 'y', 0.45)
  // the north gable end
  tf(stone, [NX0, NY1, EAVE], [NX1, NY1, EAVE], [AX, NY1, RIDGE], [0, 1, 0])

  // nave windows: four bays of paired lancets with an oculus, west side; the same above the east wing
  for (const f of [faceX(NX0, -1), faceX(NX1, 1)]) {
    for (let k = 0; k < 4; k++) {
      const y = -19.6 + k * 5.6, s = sOf(f, y)
      for (const d of [-0.75, 0.75]) flatShape(win, f, pointed(s + d, 1.05, 9.6, 15.0, 4), 0.06)
      flatShape(trim, f, arc(s, 16.6, 0.75, 0, 360, 10).slice(0, -1), 0.04)
      flatShape(win, f, arc(s, 16.6, 0.5, 0, 360, 10).slice(0, -1), 0.07)
      // buttresses between the bays, west side only (east is behind the wing)
      if (f.n[0] < 0) {
        const yb = y - 2.8
        box(stone, trim, NX0 - 0.8, yb - 0.45, NX0, yb + 0.45, 0, 15.5, 0.08)
      }
    }
    if (f.n[0] < 0) box(stone, trim, NX0 - 0.8, 0.6 - 0.45, NX0, 0.6 + 0.45, 0, 15.5, 0.08)
    // one bay north of the transept, above the north wing
    const s = sOf(f, 17.5)
    for (const d of [-0.75, 0.75]) flatShape(win, f, pointed(s + d, 1.05, 11.0, 15.0, 4), 0.06)
  }

  // ---- the transepts: shallow arms, gabled, two pairs of lancets under oculi
  box(stone, null, TX0, TY0, TX1, TY1, 0, EAVE, 0.2)
  box(trim, null, TX0 - 0.25, TY0 - 0.25, TX1 + 0.25, TY1 + 0.25, EAVE - 0.5, EAVE, 0.15)
  gableRoof(slate, stone, TX0, TY0, TX1, TY1, EAVE, TRIDGE, 'x', 0.45)
  for (const f of [faceX(TX0, -1), faceX(TX1, 1)]) {
    const sm = sOf(f, (TY0 + TY1) / 2)
    for (const c of [-2.2, 2.2]) {
      for (const d of [-0.7, 0.7]) flatShape(win, f, pointed(sm + c + d, 1.0, 7.6, 15.2, 4), 0.06)
      flatShape(trim, f, arc(sm + c, 16.8, 0.85, 0, 360, 10).slice(0, -1), 0.04)
      flatShape(win, f, arc(sm + c, 16.8, 0.58, 0, 360, 10).slice(0, -1), 0.07)
    }
    // the gable's coping
    const lo = Math.min(sOf(f, TY0), sOf(f, TY1)), hi = Math.max(sOf(f, TY0), sOf(f, TY1))
    extrudeShape(trim, f, [[lo - 0.1, EAVE], [sm, TRIDGE + 0.35], [hi + 0.1, EAVE], [hi - 0.7, EAVE], [sm, TRIDGE - 0.45], [lo + 0.7, EAVE]], 0, 0.25)
  }
  // the crossing's small flèche: a slender lead spirelet over the ridge
  lathe(slate, AX, (TY0 + TY1) / 2, [[0.7, RIDGE - 0.4], [0.7, RIDGE + 1.4], [0.01, RIDGE + 4.6]], 8)

  // ---- the front: the gable wall with its archivolt, rose and portal
  {
    const f = faceY(NY0, -1), sc = sOf(f, AX)
    // the gable rises a little above the roof, with a coping and a cross
    const hw = (NX1 - NX0) / 2 + 0.3
    extrudeShape(stone, f, [[sc - hw, EAVE - 0.6], [sc + hw, EAVE - 0.6], [sc, RIDGE + 0.9]], -0.6, 0.0)
    extrudeShape(trim, f, [[sc - hw - 0.2, EAVE - 0.6], [sc, RIDGE + 1.2], [sc + hw + 0.2, EAVE - 0.6], [sc + hw - 0.5, EAVE - 0.6], [sc, RIDGE + 0.4], [sc - hw + 0.5, EAVE - 0.6]], 0, 0.3)
    box(trim, null, AX - 0.15, NY0 - 0.25, AX + 0.15, NY0 + 0.05, RIDGE + 1.0, RIDGE + 2.8, 0)
    box(trim, null, AX - 0.7, NY0 - 0.25, AX + 0.7, NY0 + 0.05, RIDGE + 2.0, RIDGE + 2.3, 0)
    // the great archivolt, standing 0.4 m proud of the gable, holding the rose and the lancets
    const g: Face = { o: [0, NY0, 0], n: [0, -1] }
    extrudeShape(stone, g, [[sc - 5.2, FLOOR], [sc + 5.2, FLOOR], ...pointed(sc, 10.4, FLOOR, 13.2, 6).slice(2)], 0, 0.4)
    const h: Face = { o: [0, NY0 - 0.4, 0], n: [0, -1] }
    extrudeShape(trim, h, pointedBand(sc, 7.6, 9.4, 9.2, 13.2), 0, 0.15)
    flatShape(trim, h, pointed(sc, 7.6, 9.2, 13.2, 6), 0.02) // the recess's pale field
    // the six-lobed rose
    flatShape(win, h, arc(sc, 16.2, 2.5, 0, 360, 14).slice(0, -1), 0.06)
    // a lancet each side of the statue niche
    flatShape(win, h, pointed(sc + 1.7, 1.25, 9.6, 12.8, 4), 0.06)
    flatShape(win, h, pointed(sc - 1.7, 1.25, 9.6, 12.8, 4), 0.06)
    flatShape(stone, h, [[sc - 0.5, 9.4], [sc + 0.5, 9.4], [sc + 0.5, 13.4], [sc - 0.5, 13.4]], 0.12)
    // the pointed portal and its doors
    extrudeShape(trim, h, pointedBand(sc, 2.6, 3.6, FLOOR, FLOOR + 3.0), 0, 0.12)
    flatShape(door, h, pointed(sc, 2.6, FLOOR, FLOOR + 3.0, 5), 0.04)
  }

  // ---- the front stair: a stone platform at the church floor, a lower door in it, flights each side
  {
    const SY0 = NY0 - 6.4, SY1 = NY0 - 0.6
    box(stone, trim, AX - 3.6, SY0, AX + 3.6, SY1, 0, FLOOR, 0.15)
    for (const sgn of [-1, 1]) {
      // each flight climbs from the street at the front to the platform
      const x0 = sgn < 0 ? AX - 6.8 : AX + 3.6, x1 = sgn < 0 ? AX - 3.6 : AX + 6.8
      for (let k = 0; k < 4; k++) box(stone, trim, x0, SY0 + k * 1.4, x1, SY0 + (k + 1) * 1.4 + 0.02, 0, 1.5 + k * 1.5, 0)
    }
    const fs = faceY(SY0, -1)
    flatShape(door, fs, pointed(sOf(fs, AX), 1.9, 0.6, 2.4, 4), 0.06)
  }

  // ---- the towers: square shafts, an open lancet belfry, corner pinnacles, an octagonal spire
  for (const tx of [NX0, NX1]) {
    const T = 1.7, y0 = NY0 - 1.3, x0 = tx - T, x1 = tx + T, y1 = y0 + 2 * T, ty = y0 + T
    const SH = 22.0, BT = 26.4, TIP = 32.6
    box(stone, null, x0, y0, x1, y1, 0, SH, 0.25)
    // set-offs on the shaft
    box(trim, null, x0 - 0.15, y0 - 0.15, x1 + 0.15, y1 + 0.15, EAVE - 0.5, EAVE, 0.12)
    box(trim, null, x0 - 0.15, y0 - 0.15, x1 + 0.15, y1 + 0.15, SH - 0.4, SH, 0.12)
    // the belfry: an octagon of stone with tall open lancets on four faces
    const r8 = T - 0.2
    lathe(stone, tx, ty, [[r8, SH], [r8, BT]], 8, 22.5, 382.5)
    const c8 = r8 * Math.cos(Math.PI / 8)
    for (const f of [faceX(tx - c8, -1), faceX(tx + c8, 1), faceY(ty - c8, -1), faceY(ty + c8, 1)]) {
      const sc = f.n[0] !== 0 ? sOf(f, ty) : sOf(f, tx)
      flatShape(win, f, pointed(sc, 0.9, SH + 0.6, BT - 1.4, 4), 0.05)
    }
    // corner pinnacles on the shaft's top
    for (const px of [x0 + 0.3, x1 - 0.3]) for (const py of [y0 + 0.3, y1 - 0.3]) {
      box(stone, null, px - 0.28, py - 0.28, px + 0.28, py + 0.28, SH, BT - 0.6, 0.05)
      lathe(trim, px, py, [[0.4, BT - 0.6], [0.01, BT + 1.6]], 6)
    }
    // the slender spire, with a ball and a cross
    lathe(trim, tx, ty, [[r8 + 0.1, BT], [r8 + 0.1, BT + 0.4], [r8 - 0.25, BT + 0.6], [0.1, TIP]], 8, 22.5, 382.5)
    lathe(slate, tx, ty, [[0.01, TIP - 0.2], [0.28, TIP], [0.01, TIP + 0.3]], 6)
    box(slate, null, tx - 0.08, ty - 0.08, tx + 0.08, ty + 0.08, TIP + 0.2, TIP + 1.3, 0)
    box(slate, null, tx - 0.42, ty - 0.08, tx + 0.42, ty + 0.08, TIP + 0.75, TIP + 0.95, 0)
  }

  // ---- lower wings: the north (sacristy) wing and the east parish wings, flat-roofed limestone
  const wing = (x0: number, y0: number, x1: number, y1: number, top: number) => {
    box(stone, flat, x0, y0, x1, y1, 0, top - 0.5, 0.15)
    box(trim, flat, x0 - 0.15, y0 - 0.15, x1 + 0.15, y1 + 0.15, top - 0.5, top, 0.1)
  }
  wing(-13.9, NY1 - 0.4, 0.8, 27.3, 9.9)
  wing(-13.9, TY1, NX0 + 0.1, NY1, 9.9)
  wing(0.8, TY1, 3.1, 23.6, 9.9)
  wing(NX1 - 0.1, NY0 + 0.6, TX1, TY0, 8.7)
  wing(TX1, -21.0, 15.0, 10.5, 12.0)
  // windows in the wings: a row of small panels on the visible sides
  {
    const f = faceX(-13.9, -1)
    for (let k = 0; k < 4; k++) flatShape(win, f, [[sOf(f, 15 + k * 3.2) - 0.7, 6.3], [sOf(f, 15 + k * 3.2) + 0.7, 6.3], [sOf(f, 15 + k * 3.2) + 0.7, 8.4], [sOf(f, 15 + k * 3.2) - 0.7, 8.4]], 0.06)
    const g = faceY(27.3, 1)
    for (let k = 0; k < 4; k++) { const s = sOf(g, -11.5 + k * 3.6); flatShape(win, g, [[s - 0.7, 3.0], [s + 0.7, 3.0], [s + 0.7, 7.8], [s - 0.7, 7.8]], 0.06) }
    const e = faceX(15.0, 1)
    for (let k = 0; k < 6; k++) { const s = sOf(e, -18.5 + k * 5.2); flatShape(win, e, [[s - 0.9, 1.4], [s + 0.9, 1.4], [s + 0.9, 4.4], [s - 0.9, 4.4]], 0.06); flatShape(win, e, [[s - 0.9, 6.0], [s + 0.9, 6.0], [s + 0.9, 9.6], [s - 0.9, 9.6]], 0.06) }
  }

  const lit = (p: V3, n: V3) => (n[2] > 0.6 ? 0.1 : p[1] < -20 ? 0.9 : 0.45)
  return finishGlb('Cathedral of Christ the King', [
    { part: stone, material: { ...finish('ctk-limestone', 0xdcd2bd), floodlight: lit } as Swatch },
    { part: trim, material: { ...finish('ctk-dressings', 0xeee6d6), floodlight: lit } as Swatch },
    { part: slate, material: finish('ctk-slate', 0x7a736d) },
    { part: flat, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('ctk-oak-door', 0x7a4a33) },
  ], { bearing: 359, height: 33.9, replaces: ['way/267773212'] }, 5000)
}

if (import.meta.main) await writeModel('atl-cathedral-christ-the-king', build())
