/**
 * Georgia State Capitol (1889, Edbrooke & Burnham), Atlanta: procedural, CC0-1.0.
 * bun generators/atl-georgia-state-capitol.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 33 (the
 * building's walls run 33 degrees east of north). Model +y is the long
 * north-south axis (compass 33); model -x is the west front on Washington
 * Street (compass 303), with the portico. Origin: the area centroid of OSM
 * way/113041732 (-84.3881566, 33.7490589); y = 0 is the lowest ground under
 * the footprint (the south-west corner; the site rises about 1 m to the east).
 *
 * Form: a cross plan in Indiana limestone. Long north-south wings, four
 * storeys (two rusticated, two under giant pilasters), ending in wider
 * pavilions with pediments facing east and west; a central cross arm with a
 * pedimented portico of six Corinthian columns over an arcaded base on the
 * west and a flat pedimented pavilion on the east; raised clerestory roofs
 * with lunettes over each wing's middle; over the crossing a skirt drum, a
 * colonnaded peristyle, an attic, the gilded ribbed dome, a gilded lantern
 * and the white statue of Miss Freedom.
 *
 * Sources
 * - OSM way/113041732 (outline, building=civic, 4 levels) and
 *   way/536753432 (building:part, the dome, roof:material=gold). In this
 *   frame: wings x -19.4..23.3; end pavilions x -25..29, y ±34..±50;
 *   west centre block x -28.8, arm to x -40.4, portico to x -45; east arm to
 *   x 39.2; south centre projection to y -54.2.
 * - HABS GA,61-ATLA,3- (Library of Congress, public domain, via Wikimedia
 *   Commons): sheet 13 "West elevation - overall" (scale bar 3/32" = 1'-0")
 *   gives every height, sheet 8 the roof plan (328'-10" by 176'-3"; the
 *   clerestory boxes 69' by 45'; the drum ring 73' across on a 77' square).
 *   https://commons.wikimedia.org/wiki/File:Georgia_State_Capitol,_Capitol_Square,_Atlanta,_Fulton_County,_GA_HABS_GA,61-ATLA,3-_(sheet_13_of_52).tif
 *   https://commons.wikimedia.org/wiki/File:Georgia_State_Capitol,_Capitol_Square,_Atlanta,_Fulton_County,_GA_HABS_GA,61-ATLA,3-_(sheet_8_of_52).tif
 * - USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 1 m grid: wing
 *   roofs 22.5-24 m, cross-arm ridge 26.9 (west) and 26 (east), clerestory
 *   roofs 30.5, drum skirt 31.8 at r 12.2, peristyle cornice 46.2, dome
 *   springing 50.3 at r 9.8, lantern platform 60, statue tip 79.3 (all above
 *   the footprint's lowest ground, 2.5 m above the box's ground_min).
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   DXR, "Georgia State Capitol, Atlanta, West view 20160716 1.jpg" and
 *   "... North view 20160716 1.jpg", CC BY-SA 4.0;
 *   ChrisC47, "Georgia-State-Capitol-NE-corner.jpg", CC0;
 *   Antony-22, "Georgia State Capitol 2019a.jpg" (east front), CC BY-SA 4.0;
 *   Andre m, "Atlanta-Georgia-State-Capitol.jpg", CC BY-SA 3.0;
 *   Harrison Keely, "The front of the Georgia State Capitol building in
 *   Atlanta.jpg" (west portico) and "The gold dome of the Georgia State
 *   Capitol building.jpg", CC BY 4.0.
 * Measured: plan (OSM), the heights above (lidar). Published/drawn: storey
 *   heights, portico, columns and dome profile (HABS sheet 13, scaled with
 *   its scale bar and checked against the lidar to within 1 m).
 * Estimated: window panel sizes and bay counts (HABS and photos; a panel per
 *   real window, as on a low building), the east pavilion's pediment height (photo), the
 *   lantern's and statue's widths.
 * The portico: its loggia's back wall is mostly glass in deep shadow, so it is
 *   one dark `window` panel behind the six columns, which makes the columns
 *   read as separate shafts.
 * Left out: pilasters and capitals, balustrades other than the drum's, the
 *   pediment sculpture, chimneys and roof hatches, the dome's lattice pattern.
 *   The west steps sit inside the arcade, drawn as a short flight in front.
 * Roofs: the flat roofs are pale grey membrane in NAIP (USGS, public domain),
 *   a light finish; the clerestory skylights and the gable slopes are `roof`.
 * Colour: the limestone is a warm beige (photos), pulled to the palette's
 *   lightness; the dome and lantern are gold leaf, a bold gold finish.
 * Night: the Capitol is floodlit; the dome brightest (`floodlight` on the
 *   stone, trim and gold). Windows are `window`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, onFace, lathe, disc, arc, archShape, finishGlb, writeModel } from './sea-tacoma-union-station'

// ---------------------------------------------------------------- shared helpers (also used by my other Atlanta models)

/** A quad wound so it faces `want`. */
export function qf(part: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) part.quad(a, b, c, d)
  else part.quad(d, c, b, a)
}
/** A triangle wound so it faces `want`. */
export function tf(part: Part, a: V3, b: V3, c: V3, want: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) part.tri(a, b, c)
  else part.tri(a, c, b)
}
/** A bevelled box: walls on `wall`, the top on `top` (or none). */
export function box(wall: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bevel = 0.35) {
  prism(wall, top, bevel > 0 ? chamfer(rect(x0, y0, x1, y1), bevel) : rect(x0, y0, x1, y1), z0, z1)
}
/**
 * A gable on a face: a triangular prism whose front gable sits on face `f`
 * between s0 and s1 (eaves at z0, apex z1), running dIn metres back into the
 * building. The front triangle goes to `front`, the slopes to `slope`.
 */
export function gable(front: Part, slope: Part, f: Face, s0: number, s1: number, z0: number, z1: number, dOut: number, dIn: number, back = true) {
  const sm = (s0 + s1) / 2
  const P = (s: number, z: number, d: number) => onFace(f, s, z, d)
  const out: V3 = [f.n[0], f.n[1], 0]
  tf(front, P(s0, z0, dOut), P(s1, z0, dOut), P(sm, z1, dOut), out)
  if (back) tf(front, P(s0, z0, -dIn), P(s1, z0, -dIn), P(sm, z1, -dIn), [-out[0], -out[1], 0])
  const t: V3 = [-f.n[1], f.n[0], 0]
  const nL: V3 = [-t[0] * (z1 - z0), -t[1] * (z1 - z0), sm - s0], nR: V3 = [t[0] * (z1 - z0), t[1] * (z1 - z0), s1 - sm]
  qf(slope, P(s0, z0, dOut), P(sm, z1, dOut), P(sm, z1, -dIn), P(s0, z0, -dIn), nL)
  qf(slope, P(s1, z0, dOut), P(sm, z1, dOut), P(sm, z1, -dIn), P(s1, z0, -dIn), nR)
}
/** n panels evenly spaced along s0..s1 on face f, each w wide, from z0 to z1 (arched if `arch`). */
export function bays(win: Part, f: Face, s0: number, s1: number, n: number, w: number, z0: number, z1: number, arch = false, d = 0.06) {
  const step = (s1 - s0) / n
  for (let k = 0; k < n; k++) {
    const sc = s0 + step * (k + 0.5)
    const poly: XY[] = arch ? archShape(sc, w, z0, z1 - w / 2, 8) : [[sc - w / 2, z0], [sc + w / 2, z0], [sc + w / 2, z1], [sc - w / 2, z1]]
    flatShape(win, f, poly, d)
  }
}
/** A face frame on a wall facing one of the four axis directions. */
export const faceX = (x: number, sgn: 1 | -1): Face => ({ o: [x, 0, 0], n: [sgn, 0] })
export const faceY = (y: number, sgn: 1 | -1): Face => ({ o: [0, y, 0], n: [0, sgn] })
/** Face coordinate s for a world coordinate along the face (s runs to the right, seen from outside). */
export const sOf = (f: Face, w: number) => (f.n[0] !== 0 ? (f.n[0] > 0 ? w : -w) : f.n[1] > 0 ? -w : w)

// ---------------------------------------------------------------- the model

const CORN = 22.6, TOP = 24.0, BELT = 9.5
const DX = 2.3, DY = 0 // the dome's axis

function build() {
  const stone = new Part(), trim = new Part(), roof = new Part(), flat = new Part(), win = new Part(), gold = new Part()

  // A block of the main body: stone walls, a belt course, the cornice band and a flat roof.
  const block = (x0: number, y0: number, x1: number, y1: number, top = TOP) => {
    box(stone, null, x0, y0, x1, y1, 0, top - 1.4, 0.3)
    box(trim, null, x0 - 0.15, y0 - 0.15, x1 + 0.15, y1 + 0.15, BELT, BELT + 0.6, 0.3)
    box(trim, flat, x0 - 0.35, y0 - 0.35, x1 + 0.35, y1 + 0.35, top - 1.4, top, 0.35)
  }
  // Windows of one wall run: a two-storey panel per bay below the belt and one above it.
  const W = (f: Face, a: number, b: number, n: number, w = 2.0) => {
    const s0 = Math.min(sOf(f, a), sOf(f, b)), s1 = Math.max(sOf(f, a), sOf(f, b))
    bays(win, f, s0, s1, n, w, 1.5, 4.3, true)
    bays(win, f, s0, s1, n, w, 5.4, 8.4)
    bays(win, f, s0, s1, n, w, 11.2, 15.2)
    bays(win, f, s0, s1, n, w, 16.6, 20.6)
  }

  // ---- the wings and the end pavilions
  block(-19.4, -49.5, 23.3, 50.5)
  block(-24.8, 34.1, 29.0, 50.6) // north pavilion
  block(-25.3, -49.5, 28.4, -33.9) // south pavilion
  block(-10.9, 50.0, 15.3, 51.5) // north centre projection (shallow)
  block(-6.7, -54.2, 9.6, -49.0) // south centre projection
  // centre blocks either side of the crossing
  block(-28.8, -17.0, -19.0, 18.2)
  block(23.0, -12.0, 29.3, 12.6)

  // west wall runs
  W(faceX(-24.8, -1), 34.1, 50.6, 3)
  W(faceX(-19.4, -1), 18.2, 34.1, 4)
  W(faceX(-19.4, -1), -33.9, -17.0, 4)
  W(faceX(-25.3, -1), -49.5, -33.9, 3)
  W(faceX(-28.8, -1), 13.0, 18.2, 1)
  W(faceX(-28.8, -1), -17.0, -11.7, 1)
  W(faceY(18.2, 1), -28.8, -19.4, 2)
  W(faceY(-17.0, -1), -28.8, -19.4, 2)
  W(faceY(34.1, -1), -24.8, -19.4, 1)
  W(faceY(-33.9, 1), -25.3, -19.4, 1)
  // east wall runs
  W(faceX(29.0, 1), 34.1, 50.6, 3)
  W(faceX(23.3, 1), 12.6, 34.1, 5)
  W(faceX(23.3, 1), -33.9, -12.0, 5)
  W(faceX(28.4, 1), -49.5, -33.9, 3)
  W(faceY(12.6, 1), 23.3, 29.3, 1)
  W(faceY(-12.0, -1), 23.3, 29.3, 1)
  W(faceY(34.1, -1), 23.3, 29.0, 1)
  W(faceY(-33.9, 1), 23.3, 28.4, 1)
  // north and south ends
  W(faceY(51.5, 1), -10.9, 15.3, 6)
  W(faceY(50.6, 1), -24.8, -10.9, 3)
  W(faceY(50.6, 1), 15.3, 29.0, 3)
  W(faceY(-54.2, -1), -6.7, 9.6, 4)
  W(faceY(-49.5, -1), -25.3, -6.7, 4)
  W(faceY(-49.5, -1), 9.6, 28.4, 4)
  W(faceX(-6.7, -1), -54.2, -49.5, 1, 1.4)
  W(faceX(9.6, 1), -54.2, -49.5, 1, 1.4)

  // pediments on the end pavilions, facing west and east
  for (const [x, y0, y1, sgn] of [[-24.8, 34.1, 50.6, -1], [-25.3, -49.5, -33.9, -1], [29.0, 34.1, 50.6, 1], [28.4, -49.5, -33.9, 1]] as [number, number, number, 1 | -1][]) {
    const f = faceX(x, sgn)
    const a = sOf(f, y0), b = sOf(f, y1)
    gable(trim, roof, f, Math.min(a, b) - 0.35, Math.max(a, b) + 0.35, TOP, 26.4, 0.35, 6)
  }

  // ---- clerestory boxes over the wings' middles, lunettes east and west
  for (const [y0, y1] of [[15.5, 37.0], [-37.0, -15.5]]) {
    box(stone, null, -5.0, y0, 9.5, y1, TOP - 0.5, 29.6, 0.3)
    box(trim, roof, -5.3, y0 - 0.3, 9.8, y1 + 0.3, 29.6, 30.5, 0.3)
    for (const [x, sgn] of [[-5.0, -1], [9.5, 1]] as [number, 1 | -1][]) {
      const f = faceX(x, sgn)
      const a = sOf(f, y0), b = sOf(f, y1)
      bays(win, f, Math.min(a, b) + 0.6, Math.max(a, b) - 0.6, 4, 3.6, 24.6, 28.9, true)
    }
  }

  // ---- the west arm and portico (HABS sheet 13 for the heights, sheet 8 for the depth:
  // the arm runs 82'-7" (25.2 m) out from the wings' face to the portico's front)
  const PC = 0.8 // the portico's centre line (y)
  const ARM = 25.2 // the arm's cornice, a little above the wings'
  block(-40.6, -11.7, -28.5, 13.0, ARM)
  W(faceY(13.0, 1), -40.6, -28.8, 2)
  W(faceY(-11.7, -1), -40.6, -28.8, 2)
  const PX = -45.4 // the portico's front
  // the rusticated arcaded base: three big arched entrances between massive
  // piers, a smaller arched window each side
  box(stone, flat, PX, PC - 11.1, -40.4, PC + 11.1, 0, BELT, 0.3)
  for (const z of [3.2, 6.4]) box(stone, null, PX - 0.12, PC - 11.1, PX + 0.3, PC + 11.1, z - 0.25, z, 0) // rustication joints
  box(trim, null, PX - 0.2, PC - 11.3, -40.4, PC + 11.3, BELT - 0.7, BELT, 0.2)
  {
    const f = faceX(PX - 0.13, -1)
    for (const k of [-1, 0, 1]) flatShape(win, f, archShape(sOf(f, PC + 4 * k), 3.1, 0.8, 6.6, 10), 0.06)
    for (const k of [-2, 2]) flatShape(win, f, archShape(sOf(f, PC + 4 * k), 1.9, 2.6, 6.4, 8), 0.06)
    // a short flight of steps in front of the three doors
    const X0 = PX - 2.0, X1 = PX
    qf(trim, [X0, PC - 6.3, 0.15], [X0, PC + 6.3, 0.15], [X1, PC + 6.3, 1.0], [X1, PC - 6.3, 1.0], [-0.4, 0, 1])
    qf(trim, [X0, PC - 6.3, 0], [X0, PC + 6.3, 0], [X0, PC + 6.3, 0.15], [X0, PC - 6.3, 0.15], [-1, 0, 0])
    for (const sy of [-1, 1]) {
      const y = PC + sy * 6.3
      qf(trim, [X0, y, 0], [X1, y, 0], [X1, y, 1.0], [X0, y, 0.15], [0, sy, 0])
    }
  }
  // the loggia: its back wall, deep in shadow behind the columns and almost
  // all glazed (five tall arched windows), drawn as one dark panel; six giant
  // columns standing well forward of it, end piers, a balustrade
  const BACK = -41.2, CX = PX + 1.2
  box(roof, null, BACK - 0.4, PC - 11.1, -40.4, PC + 11.1, BELT, 19.8, 0)
  {
    const f = faceX(BACK - 0.4, -1)
    const a = sOf(f, PC - 9.9), b = sOf(f, PC + 9.9)
    flatShape(win, f, [[Math.min(a, b), BELT + 0.2], [Math.max(a, b), BELT + 0.2], [Math.max(a, b), 19.8], [Math.min(a, b), 19.8]], 0.06)
  }
  for (const sy of [-1, 1]) box(stone, null, PX, PC + sy * 11.1 - (sy > 0 ? 1.2 : 0), BACK, PC + sy * 11.1 + (sy < 0 ? 1.2 : 0), BELT, 19.8, 0.25)
  box(trim, null, PX, PC - 9.9, PX + 0.6, PC + 9.9, BELT, BELT + 1.1, 0.15)
  for (const k of [-5, -3, -1, 1, 3, 5]) {
    const y = PC + 1.8 * k
    box(trim, null, CX - 1.0, y - 1.0, CX + 1.0, y + 1.0, BELT, BELT + 1.4, 0.12) // pedestal
    lathe(trim, CX, y, [[0.85, BELT + 1.4], [0.74, 18.6]], 8)
    box(trim, null, CX - 1.0, y - 1.0, CX + 1.0, y + 1.0, 18.6, 19.8, 0.15) // capital
  }
  // the entablature and a tall, deep pediment, with a block on its apex
  const PB = 19.8, PE = 22.4, PA = 28.2
  box(trim, null, PX - 0.3, PC - 11.6, BACK, PC + 11.6, PB, PE, 0.3)
  {
    const f = faceX(PX - 0.3, -1)
    const a = sOf(f, PC - 11.6), b = sOf(f, PC + 11.6)
    gable(trim, roof, f, Math.min(a, b), Math.max(a, b), PE, PA, 0, 5.4, false)
    box(trim, null, PX - 0.1, PC - 1.2, PX + 1.4, PC + 1.2, PA - 0.6, PA + 0.6, 0.1)
    // the arm's roof behind the pediment, running back to the drum
    const g = faceX(-40.5, -1)
    const c = sOf(g, -11.9), d = sOf(g, 13.2)
    gable(stone, roof, g, Math.min(c, d), Math.max(c, d), ARM, 27.6, 0.1, 30.0, false)
  }

  // ---- the east arm: a flat pedimented pavilion with three tall arched windows
  block(29.0, -8.6, 39.2, 9.3)
  {
    const f = faceX(39.2, 1)
    const a = sOf(f, -8.6), b = sOf(f, 9.3)
    bays(win, f, a, b, 3, 2.0, 1.5, 4.3, true)
    bays(win, f, a, b, 3, 2.0, 5.4, 8.4)
    bays(win, f, a, b, 3, 2.6, 11.2, 20.8, true)
    gable(trim, roof, f, Math.min(a, b) - 0.35, Math.max(a, b) + 0.35, TOP, 26.6, 0.35, 0.35, false)
    const g = faceX(38.85, 1)
    gable(stone, roof, g, Math.min(a, b) - 0.35, Math.max(a, b) + 0.35, TOP, 26.6, 0, 24.0, false)
    W(faceY(9.3, 1), 29.3, 39.2, 2)
    W(faceY(-8.6, -1), 29.3, 39.2, 2)
  }

  // ---- the drum, peristyle, attic, dome, lantern and statue
  box(stone, null, DX - 12.6, DY - 12.6, DX + 12.6, DY + 12.6, TOP - 1, 25.0, 0.4)
  box(trim, flat, DX - 12.8, DY - 12.8, DX + 12.8, DY + 12.8, 25.0, 25.6, 0.4)
  lathe(stone, DX, DY, [[12.2, 25.6], [12.2, 31.6]], 24)
  lathe(trim, DX, DY, [[12.2, 31.6], [12.6, 31.8], [12.6, 32.4], [12.1, 32.4], [12.1, 33.4], [10.2, 33.4]], 24)
  lathe(stone, DX, DY, [[10.2, 33.4], [10.2, 44.6]], 24)
  const NCOL = 16
  for (let k = 0; k < NCOL; k++) {
    const a = ((k + 0.5) / NCOL) * 2 * Math.PI
    lathe(trim, DX + Math.cos(a) * 11.2, DY + Math.sin(a) * 11.2, [[0.62, 33.4], [0.55, 44.6]], 6)
    const aw = (k / NCOL) * 2 * Math.PI, c = Math.cos(aw), s = Math.sin(aw)
    const f: Face = { o: [DX + c * 10.2, DY + s * 10.2, 0], n: [c, s] }
    flatShape(win, f, [[-0.75, 34.6], [0.75, 34.6], [0.75, 40.2], [-0.75, 40.2]], 0.06)
    flatShape(win, f, arc(0, 42.0, 0.6, 0, 360, 8).slice(0, -1), 0.06)
  }
  lathe(trim, DX, DY, [[10.2, 44.6], [11.8, 44.6], [11.8, 45.6], [12.1, 46.2], [10.6, 46.2]], 24)
  lathe(stone, DX, DY, [[10.6, 46.2], [10.6, 49.8]], 24)
  lathe(trim, DX, DY, [[10.6, 49.8], [10.95, 50.0], [10.95, 50.5], [9.8, 50.5]], 24)
  // the dome: a stilted half-ellipse to the lantern ring, gold
  const R = 9.8, Z0 = 50.5, H = 10.4, RING = 3.4
  const tEnd = Math.acos(RING / R)
  const prof: [number, number][] = []
  for (let k = 0; k <= 8; k++) {
    const t = (tEnd * k) / 8
    // a slightly pointed (stilted) profile: steeper toward the crown
    prof.push([R * Math.cos(t), Z0 + H * Math.sin(t) ** 0.92])
  }
  lathe(gold, DX, DY, prof, 24)
  const zRing = prof[prof.length - 1][1]
  // 16 ribs standing proud of the gold
  const RIBS = 16, RW = 0.28, RD = 0.22
  for (let k = 0; k < RIBS; k++) {
    const a = (k / RIBS) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a)
    const P = (r: number, z: number, w: number, d: number): V3 => [DX + c * (r + d) - s * w, DY + s * (r + d) + c * w, z]
    for (let i = 0; i + 2 < prof.length; i += 2) {
      const [r0, z0] = prof[i], [r1, z1] = prof[i + 2]
      const out: V3 = [c * (z1 - z0), s * (z1 - z0), r0 - r1]
      qf(gold, P(r0, z0, -RW, RD), P(r0, z0, RW, RD), P(r1, z1, RW, RD), P(r1, z1, -RW, RD), out)
      qf(gold, P(r0, z0, RW, 0), P(r1, z1, RW, 0), P(r1, z1, RW, RD), P(r0, z0, RW, RD), [-s, c, 0])
      qf(gold, P(r0, z0, -RW, 0), P(r1, z1, -RW, 0), P(r1, z1, -RW, RD), P(r0, z0, -RW, RD), [s, -c, 0])
    }
  }
  // the lantern: a platform, the body, a cornice and a small gold cupola
  lathe(gold, DX, DY, [[RING, zRing - 0.2], [4.3, zRing + 0.1], [4.3, 62.2], [2.8, 62.2]], 16)
  lathe(gold, DX, DY, [[2.7, 62.2], [2.7, 67.2], [3.2, 67.4], [3.2, 68.0], [2.6, 68.1], [2.2, 69.2], [1.4, 70.0], [0.75, 70.4]], 12)
  disc(gold, DX, DY, 0.75, 70.4, 12)
  // Miss Freedom: pedestal, robed figure, head and the raised torch arm
  lathe(trim, DX, DY, [[0.75, 70.4], [0.75, 71.3], [0.62, 71.3], [0.62, 73.6], [0.42, 76.0], [0.3, 76.4], [0.34, 76.8], [0.3, 77.3], [0.01, 77.6]], 8)
  box(trim, null, DX + 0.25, DY - 0.18, DX + 0.55, DY + 0.18, 75.0, 78.6, 0)
  lathe(trim, DX + 0.4, DY, [[0.3, 78.6], [0.36, 78.9], [0.01, 79.3]], 6)

  // Floodlit at night: the walls, more the higher they are; the dome brightest.
  const wallLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.55 + 0.45 * Math.min(1, p[2] / 50))
  const domeLit = (_p: V3, n: V3) => (n[2] > 0.95 ? 0.7 : 1)
  return finishGlb('Georgia State Capitol', [
    { part: stone, material: { ...finish('gsc-limestone', 0xe7dbc6), floodlight: wallLit } as Swatch },
    { part: trim, material: { ...PALETTE.trim, floodlight: wallLit } as Swatch },
    { part: gold, material: { ...finish('gsc-gold-leaf', 0xd9ae45, 0.45), floodlight: domeLit } as Swatch },
    { part: roof, material: PALETTE.roof },
    { part: flat, material: finish('gsc-roof-membrane', 0xc6c5bf) },
    { part: win, material: PALETTE.window },
  ], { bearing: 33, height: 79.3, replaces: ['way/113041732', 'way/536753432'] }, 6500)
}

if (import.meta.main) await writeModel('atl-georgia-state-capitol', build())
