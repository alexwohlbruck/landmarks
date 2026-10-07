/**
 * Main Street, U.S.A. Station (Disneyland Railroad), Disneyland Park,
 * Anaheim — procedural, CC0-1.0.
 * bun generators/dlr-main-street-station.ts
 *
 * Map frame: x east, y north, z up, metres. Origin at the area centroid of
 * the OSM outline way/153044358 (-117.918960, 33.809971). Bearing 0: the
 * station's long side runs east–west along the railroad berm. The track and
 * platform are on the SOUTH side, facing the entrance esplanade and the
 * floral Mickey; Town Square is to the north. (Not the north, as one might
 * guess from the WDW station: OSM's platform, track and the floral Mickey
 * hedge all lie south of the building, and the photos agree.)
 *
 * A small Second Empire depot, asymmetric, with forced perspective in its
 * upper levels: a one-storey red-brick block under a tan fish-scale shingle
 * mansard with three dormers, a taller mansard pavilion at the west end, and
 * the two-storey brick clock tower at the east end under a steep shingle
 * pyramid with cream hip rolls, a clock in a cream frame on the north and
 * south faces, an iron crown and the flagpole. Cream quoins, cornices and
 * window hoods; the "DISNEYLAND / Population / Elevation 138 feet" board
 * over the south front (a plain cream board here). Low shingle-roofed
 * platform canopies run off both ends to the tunnels, with small gablets.
 *
 * Ground: the station stands on the railroad berm, which is earth and is in
 * the bare-earth terrain (USGS 3DEP point queries: 44.5–44.8 m along the berm
 * top under the whole footprint, against 41.8 m in Town Square and 41.2 m on
 * the esplanade). So y = 0 is the berm top, the station and canopy floor,
 * and the model does NOT include the berm, the Town Square terrace and its
 * retaining walls and stairs, the grass slope or the floral Mickey. Its
 * footprint (x −25.6…26.6, y −4.1…4.2) stays on the berm top between the two
 * tunnels, so the lowest ground under it is the berm, not the plazas.
 *
 * Evidence:
 *  - OSM, measured: the outline way/153044358 (17.0 × 7.6 m, h 7), its parts
 *    — west pavilion way/651349968 (h 8.2) and way/133729166 (h 8.2), the
 *    tower way/133729165 (h 9.5) with way/133729164 inside it (h 10.4) — the
 *    canopies way/193657779 and way/443327358 (building=roof, h 3.5) with
 *    the parts way/193657781 and way/193657780 under them, the platform
 *    (way/133729104, y −4.6) and track (way/176242740, y −6.5), and the two
 *    clock nodes at x 6.6 on the north and south faces, which put the tower
 *    at the east end.
 *  - Photos: south front with a long lens (Benoît Prieur, CC0, 2022) for
 *    every proportion and height; south front (Adam Smith, CC BY 2.0;
 *    Boris Dzhingarov, CC BY 2.0); south-west (Jonnyboyca, PD; Bryan
 *    Gosline, CC BY-SA 2.0); the Town Square side (Jonnyboyca, PD;
 *    HarshLight, CC BY 2.0; Dlrrmainstreet.JPG, PD); colours from the
 *    daylight shots.
 *  - Published: Wikipedia, Disneyland Railroad — Second Empire, with forced
 *    perspective in the upper levels.
 *
 * Heights are estimated from the CC0 long-lens photo, scaled on OSM's 17 m
 * length and checked against the doors (~2.4 m) and OSM's tags: pavilion
 * cornice 4.8 m, pavilion mansard 7.9 m (cresting 8.35, OSM 8.2), main eave
 * 3.5 m and mansard 6.6 m (cresting 6.95, OSM 7), tower cornice 8.4 m, roof
 * apex 13.1 m, crown 13.75 m, flagpole ~17.5 m. The photo alone gave the
 * mansards ~0.4 m lower; they were raised to OSM's heights after comparing
 * the roof-to-wall ratio in the north photos. The floor line is hidden by
 * the hedge in every south photo, so all heights share a ~0.3 m doubt.
 * The bay widths (pavilion 4.4 m, middle 8 m, tower 4.6 m) are the photo's
 * ratios on OSM's length. The north face follows OSM's outline (tower face
 * set back 1.5 m); its porch is a cream entablature on four posts over two
 * window panels. The tower is 4.6 × 5.4 m after OSM; no photo shows its
 * depth squarely. The canopies are the OSM roofs' rectangles at 2.55 m
 * eaves and a 3.45 m ridge (OSM 3.5). Invented: the canopy post spacing,
 * the gablets on the canopies' north slopes, the dormer depths, the
 * west-face pavilion dormer's exact size. Left out: the pavilion's
 * flagpole, the tower balcony, the bunting, and the handcar on its siding.
 */
import { Part, len, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const TAU = Math.PI * 2

const brick = new Part()
const shingle = new Part()  // mansards, tower roof, canopy roofs
const cream = new Part()    // quoins, cornices, hoods, dormer frames, sign, posts
const glazing = new Part()
const iron = new Part()     // cresting, the crown, the flagpole
const gold = new Part()     // the clock surround and finials

// ---------------------------------------------------------------------------
// Kit

const unit = (a: V3): V3 => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
function tri(p: Part, a: V3, b: V3, c: V3, n?: V3[]) { p.tri(a, b, c, undefined, undefined, undefined, n) }
function quad(p: Part, a: V3, b: V3, c: V3, d: V3) { tri(p, a, b, c); tri(p, a, c, d) }

const area = (q: XY[]) => q.reduce((s, a, i) => { const b = q[(i + 1) % q.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2

/** A vertical prism over a convex counter-clockwise polygon, flat-shaded. */
function prism(p: Part, poly: XY[], z0: number, z1: number, o: { top?: boolean; bottom?: boolean } = {}) {
  if (area(poly) < 0) poly = [...poly].reverse()
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    quad(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (o.top !== false) for (let i = 1; i < poly.length - 1; i++) tri(p, [...poly[0], z1] as V3, [...poly[i], z1] as V3, [...poly[i + 1], z1] as V3)
  if (o.bottom) for (let i = 1; i < poly.length - 1; i++) tri(p, [...poly[0], z0] as V3, [...poly[i + 1], z0] as V3, [...poly[i], z0] as V3)
}

const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** A box with its vertical edges chamfered by c. */
function cbox(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, c = 0.3, o: { top?: boolean; bottom?: boolean } = {}) {
  prism(p, [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]], z0, z1, o)
}

/**
 * A mansard or truncated pyramid: sides from the rectangle at z0, stepping
 * in by `inset` at z1, with a flat top; corners chamfered by c.
 */
function mansard(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, inset: number, c = 0.2, bottom = false) {
  const ring = (d: number, z: number): V3[] => {
    const a = x0 + d, b = x1 - d, e = y0 + d, f = y1 - d
    return [[a + c, e, z], [b - c, e, z], [b, e + c, z], [b, f - c, z], [b - c, f, z], [a + c, f, z], [a, f - c, z], [a, e + c, z]]
  }
  const lo = ring(0, z0), hi = ring(inset, z1)
  for (let i = 0; i < 8; i++) { const j = (i + 1) % 8; quad(p, lo[i], lo[j], hi[j], hi[i]) }
  for (let i = 1; i < 7; i++) tri(p, hi[0], hi[i], hi[i + 1])
  if (bottom) for (let i = 1; i < 7; i++) tri(p, lo[0], lo[i + 1], lo[i])
}

/** A smooth frustum about a vertical axis; r1 = 0 makes a cone. */
function frustum(p: Part, cx: number, cy: number, r0: number, z0: number, r1: number, z1: number, n: number, both = false) {
  const k = (r0 - r1) / (z1 - z0)
  const at = (i: number, r: number, z: number): V3 => [cx + r * Math.cos((i / n) * TAU), cy + r * Math.sin((i / n) * TAU), z]
  const nrm = (i: number): V3 => unit([Math.cos((i / n) * TAU), Math.sin((i / n) * TAU), k])
  for (let i = 0; i < n; i++) {
    const j = i + 1
    tri(p, at(i, r0, z0), at(j, r0, z0), at(j, r1, z1), [nrm(i), nrm(j), nrm(j)])
    tri(p, at(i, r0, z0), at(j, r1, z1), at(i, r1, z1), [nrm(i), nrm(j), nrm(i)])
    if (both) {
      const f = (v: V3): V3 => [-v[0], -v[1], -v[2]]
      tri(p, at(i, r0, z0), at(j, r1, z1), at(j, r0, z0), [f(nrm(i)), f(nrm(j)), f(nrm(j))])
      tri(p, at(i, r0, z0), at(i, r1, z1), at(j, r1, z1), [f(nrm(i)), f(nrm(i)), f(nrm(j))])
    }
  }
}

type Face = 'n' | 's' | 'e' | 'w'
/** Map a wall-plane point (s along the wall, z up, d out from it) into the map frame. */
function onWall(face: Face, plane: number, u: number) {
  return (s: number, z: number, d: number): V3 =>
    face === 's' ? [u + s, plane - d, z] : face === 'n' ? [u - s, plane + d, z]
      : face === 'e' ? [plane + d, u + s, z] : [plane - d, u - s, z]
}

/**
 * A flat panel on a wall, `off` proud of it: a rectangle with a segmental
 * arch head of rise `rise` (0 = square head, w/2 = semicircle).
 */
function panel(p: Part, face: Face, plane: number, u: number, w: number, z0: number, z1: number, rise = 0, off = 0.05) {
  const to = onWall(face, plane, u)
  const pts: [number, number][] = [[-w / 2, z0], [w / 2, z0]]
  if (rise > 0) {
    // A circular arc through the springing points and the crown.
    const half = w / 2, R = (half * half + rise * rise) / (2 * rise), zc = z1 - R, a0 = Math.asin(Math.min(1, half / R))
    const n = 8
    // From the right springing over the crown to the left one.
    for (let i = 0; i <= n; i++) {
      const t = a0 - (2 * a0 * i) / n
      pts.push([R * Math.sin(t), zc + R * Math.cos(t)])
    }
  } else pts.push([w / 2, z1], [-w / 2, z1])
  // Fan from the bottom centre keeps the arch convex-safe.
  const c: [number, number] = [0, z0]
  const all = [c, ...pts.slice(1), pts[0]]
  for (let i = 1; i < all.length - 1; i++) tri(p, to(all[0][0], all[0][1], off), to(all[i][0], all[i][1], off), to(all[i + 1][0], all[i + 1][1], off))
}

/** An arched opening: a cream hood/frame behind a slate window panel. */
function opening(face: Face, plane: number, u: number, w: number, z0: number, z1: number, rise: number) {
  panel(cream, face, plane, u, w + 0.36, Math.max(0, z0 - 0.05), z1 + 0.2, rise + 0.05, 0.03)
  panel(glazing, face, plane, u, w, z0, z1, rise, 0.06)
}

/** Cream quoin piers at a box's four corners, proud of the brick by 0.05. */
function quoins(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, w = 0.32) {
  for (const [x, sx] of [[x0, -1], [x1, 1]] as [number, number][])
    for (const [y, sy] of [[y0, -1], [y1, 1]] as [number, number][]) {
      const xa = x - sx * w, xb = x + sx * 0.05, ya = y - sy * w, yb = y + sy * 0.05
      prism(cream, rect(Math.min(xa, xb), Math.max(xa, xb), Math.min(ya, yb), Math.max(ya, yb)), z0, z1, { top: false })
    }
}

/** A square bar from a to b, `w` across: a hip roll or a post. */
function bar(p: Part, a: V3, b: V3, w: number) {
  const d = unit([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
  const ref: V3 = Math.abs(d[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const u = unit([d[1] * ref[2] - d[2] * ref[1], d[2] * ref[0] - d[0] * ref[2], d[0] * ref[1] - d[1] * ref[0]])
  const v: V3 = [d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], d[0] * u[1] - d[1] * u[0]]
  const h = w / 2
  const sec = (c: V3) => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([s, t]) =>
    [c[0] + (u[0] * s + v[0] * t) * h, c[1] + (u[1] * s + v[1] * t) * h, c[2] + (u[2] * s + v[2] * t) * h] as V3)
  const A = sec(a), B = sec(b)
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; quad(p, A[i], A[j], B[j], B[i]) }
}

/** Cream rolls along a truncated pyramid's four hips, laid on its surface. */
function hipRolls(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, inset: number, w = 0.24) {
  for (const [x, sx] of [[x0, 1], [x1, -1]] as [number, number][])
    for (const [y, sy] of [[y0, 1], [y1, -1]] as [number, number][])
      bar(cream, [x, y, z0], [x + sx * inset, y + sy * inset, z1], w)
}

/** Iron cresting: a low dark band round a rectangle, both faces drawn. */
function cresting(x0: number, x1: number, y0: number, y1: number, z: number, h = 0.4) {
  const t = 0.08
  prism(iron, rect(x0, x1, y0, y1), z, z + h, { top: false })
  prism(iron, rect(x0 + t, x1 - t, y0 + t, y1 - t).reverse() as XY[], z, z + h, { top: false })
  // Inner faces wind the other way so the band reads from inside too.
  const r = rect(x0 + t, x1 - t, y0 + t, y1 - t)
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4]
    quad(iron, [b[0], b[1], z], [a[0], a[1], z], [a[0], a[1], z + h], [b[0], b[1], z + h])
  }
}

/**
 * A dormer on a roof slope: a cream box with a small shingle gable and a
 * cream pediment, an arched window on its face. `face` is the way it looks;
 * `plane` is its front face's position, `u` its centre along the wall.
 */
function dormer(face: Face, plane: number, u: number, z0: number, w: number, h: number, depth: number) {
  const to = onWall(face, plane, u)
  // Box: front at d = 0, back at d = -depth.
  const c = [[-w / 2, 0], [w / 2, 0], [w / 2, -depth], [-w / 2, -depth]] as [number, number][]
  const P = (k: number, z: number) => to(c[k][0], z, c[k][1])
  // Walls (front and two cheeks); the back is buried in the roof.
  for (const [i, j] of [[0, 1], [1, 2], [3, 0]]) quad(cream, P(i, z0), P(j, z0), P(j, z0 + h), P(i, z0 + h))
  const g = w * 0.42, ov = 0.12
  const L = (s: number, z: number, d: number) => to(s, z, d)
  // Pediment (cream triangle) on the front and the two shingle slopes.
  tri(cream, L(-w / 2 - ov, z0 + h, 0.02), L(w / 2 + ov, z0 + h, 0.02), L(0, z0 + h + g, 0.02))
  quad(shingle, L(w / 2 + ov, z0 + h, 0.02), L(w / 2 + ov, z0 + h, -depth), L(0, z0 + h + g, -depth), L(0, z0 + h + g, 0.02))
  quad(shingle, L(0, z0 + h + g, 0.02), L(0, z0 + h + g, -depth), L(-w / 2 - ov, z0 + h, -depth), L(-w / 2 - ov, z0 + h, 0.02))
  panel(glazing, face, plane, u, w * 0.64, z0 + 0.22, z0 + h - 0.12, w * 0.2, 0.05)
}

/** A flat disc on a wall plane, facing out. */
function disc(p: Part, face: Face, plane: number, u: number, zc: number, r: number, off: number, n = 14) {
  const to = onWall(face, plane, u)
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU, b = ((i + 1) / n) * TAU
    tri(p, to(0, zc, off), to(r * Math.cos(a), zc + r * Math.sin(a), off), to(r * Math.cos(b), zc + r * Math.sin(b), off))
  }
}

// ---------------------------------------------------------------------------
// Plan (OSM, in the model frame) and heights (estimated, see header)

const S = -3.4                      // south face of the pavilion and tower
const SM = -3.15                    // south face of the middle block
const PAV = { x0: -8.1, x1: -3.7, y1: 4.2 }
const MID = { x0: -3.7, x1: 4.3, y1: 3.5 }
const TOW = { x0: 4.3, x1: 8.9, y1: 2.0 }
const TX = (TOW.x0 + TOW.x1) / 2    // 6.6, the clock nodes' x

const P_CORN0 = 3.9, P_CORN1 = 4.8, P_TOP = 7.9
const M_EAVE = 3.5, M_CORN = 3.9, M_TOP = 6.6
const T_BELT0 = 3.9, T_BELT1 = 4.3, T_CORN0 = 7.1, T_CORN1 = 8.4, T_APEX = 13.1

// --- West pavilion ------------------------------------------------------------
cbox(brick, PAV.x0, PAV.x1, S, PAV.y1, 0, P_CORN0, 0.05, { top: false })
quoins(PAV.x0, PAV.x1, S, PAV.y1, 0, P_CORN0)
cbox(cream, PAV.x0 - 0.25, PAV.x1 + 0.25, S - 0.25, PAV.y1 + 0.25, P_CORN0, P_CORN1, 0.2)
{
  const x0 = PAV.x0 - 0.1, x1 = PAV.x1 + 0.1, y0 = S - 0.1, y1 = PAV.y1 + 0.1, ins = 1.3
  mansard(shingle, x0, x1, y0, y1, P_CORN1, P_TOP, ins, 0.15)
  hipRolls(x0 + 0.1, x1 - 0.1, y0 + 0.1, y1 - 0.1, P_CORN1, P_TOP, ins - 0.05)
  cresting(x0 + ins + 0.05, x1 - ins - 0.05, y0 + ins + 0.05, y1 - ins - 0.05, P_TOP, 0.45)
  const pc = (PAV.x0 + PAV.x1) / 2
  const slope = ins / (P_TOP - P_CORN1)
  const zd = P_CORN1 + 0.35
  dormer('s', y0 + slope * 0.35, pc, zd, 1.25, 1.55, 0.9)
  dormer('n', y1 - slope * 0.35, pc, zd, 1.25, 1.55, 0.9)
  dormer('w', x0 + slope * 0.35, (S + PAV.y1) / 2, zd, 1.25, 1.55, 0.9)
  // Ground floor: an arched door each side (the Baggage Claim door on the north).
  opening('s', S, pc, 1.7, 0, 2.5, 0.3)
  opening('n', PAV.y1, pc, 1.7, 0, 2.5, 0.3)
}

// --- Middle block -------------------------------------------------------------
cbox(brick, MID.x0, MID.x1, SM, MID.y1, 0, M_EAVE, 0.05, { top: false })
// Its east wall north of the set-back tower.
cbox(cream, MID.x0 - 0.1, MID.x1 + 0.2, SM - 0.25, MID.y1 + 0.25, M_EAVE, M_CORN, 0.15)
{
  const ins = 1.1
  // The roof runs west into the pavilion so its end is buried there.
  mansard(shingle, -5.9, MID.x1 + 0.1, SM - 0.15, MID.y1 + 0.15, M_CORN, M_TOP, ins, 0.15)
  cresting(-4.6, MID.x1 + 0.1 - ins - 0.05, SM - 0.15 + ins + 0.05, MID.y1 + 0.15 - ins - 0.05, M_TOP, 0.4)
  const slope = ins / (M_TOP - M_CORN)
  const zd = M_CORN + 0.3
  for (const x of [-2.2, 0.35, 2.9]) {
    dormer('s', SM - 0.15 + slope * 0.3, x, zd, 1.15, 1.45, 0.8)
    dormer('n', MID.y1 + 0.15 - slope * 0.3, x, zd, 1.15, 1.45, 0.8)
  }
  // South front: two windows and the central double door, arched, between
  // cream pilasters, under the DISNEYLAND board.
  opening('s', SM, -2.2, 0.95, 0.6, 2.45, 0.22)
  opening('s', SM, 0.35, 1.6, 0, 2.5, 0.3)
  opening('s', SM, 2.9, 0.95, 0.6, 2.45, 0.22)
  for (const x of [MID.x0 + 0.3, MID.x1 - 0.3]) prism(cream, rect(x - 0.28, x + 0.28, SM - 0.12, SM + 0.05), 0, M_EAVE, { top: false })
  cbox(cream, -2.75, 3.75, SM - 0.16, SM + 0.05, 2.85, 3.42, 0.05)
  // North front: the porch's two large windows and the arched door.
  opening('n', MID.y1, -2.2, 1.7, 0.5, 2.6, 0)
  opening('n', MID.y1, 0.35, 1.5, 0, 2.5, 0.3)
  opening('n', MID.y1, 2.9, 1.7, 0.5, 2.6, 0)
  // The porch: a cream entablature 0.9 m out on four cream posts.
  cbox(cream, MID.x0 + 0.05, MID.x1 - 0.05, MID.y1, MID.y1 + 0.9, M_EAVE - 0.45, M_EAVE + 0.05, 0.1, { bottom: true })
  for (const x of [MID.x0 + 0.3, -0.9, 1.6, MID.x1 - 0.3]) prism(cream, rect(x - 0.15, x + 0.15, MID.y1 + 0.6, MID.y1 + 0.9), 0, M_EAVE - 0.45, { top: false })
}

// --- Clock tower --------------------------------------------------------------
cbox(brick, TOW.x0, TOW.x1, S, TOW.y1, 0, T_CORN0, 0.05, { top: false })
quoins(TOW.x0, TOW.x1, S, TOW.y1, 0, T_CORN0)
cbox(cream, TOW.x0 - 0.15, TOW.x1 + 0.15, S - 0.15, TOW.y1 + 0.15, T_BELT0, T_BELT1, 0.1)
cbox(cream, TOW.x0 - 0.35, TOW.x1 + 0.35, S - 0.35, TOW.y1 + 0.35, T_CORN0, T_CORN1, 0.25)
{
  const x0 = TOW.x0 - 0.1, x1 = TOW.x1 + 0.1, y0 = S - 0.1, y1 = TOW.y1 + 0.1
  const ins = (x1 - x0) / 2 - 0.3
  mansard(shingle, x0, x1, y0, y1, T_CORN1, T_APEX, ins, 0.12)
  hipRolls(x0 + 0.08, x1 - 0.08, y0 + 0.08, y1 - 0.08, T_CORN1, T_APEX, ins - 0.03, 0.26)
  // The iron crown, an open flared ring, and the flagpole.
  frustum(iron, TX, (y0 + y1) / 2, 0.38, T_APEX - 0.05, 0.7, T_APEX + 0.65, 12, true)
  frustum(iron, TX, (y0 + y1) / 2, 0.09, T_APEX, 0.05, 17.5, 6)
  // Clock frames on the north and south faces: cream boxes standing on the
  // cornice in front of the roof, a gold surround and the white dial.
  const slope = ins / (T_APEX - T_CORN1)
  for (const [face, yf, s] of [['s', S - 0.05, -1], ['n', TOW.y1 + 0.05, 1]] as [Face, number, number][]) {
    // The dial is big: 1.25 m across on a 4.6 m tower in the CC0 photo.
    const back = yf - s * 1.8
    prism(cream, rect(TX - 0.95, TX + 0.95, Math.min(yf, back), Math.max(yf, back)), T_CORN1 - 0.3, 9.75)
    // A little shingle cap and the gold finial.
    mansard(shingle, TX - 1.0, TX + 1.0, Math.min(yf, back) - 0.05, Math.max(yf, back) + 0.05, 9.75, 10.1, 0.4, 0.05)
    frustum(gold, TX, yf - s * 0.6, 0.22, 10.05, 0, 10.75, 6)
    disc(gold, face, yf, TX, 8.95, 0.78, 0.03)
    disc(cream, face, yf, TX, 8.95, 0.63, 0.06)
  }
  // Small dormers on the roof's east and west faces.
  const zd = T_CORN1 + 0.5
  dormer('e', x1 - slope * 0.5, (y0 + y1) / 2, zd, 0.95, 1.25, 0.9)
  dormer('w', x0 + slope * 0.5, (y0 + y1) / 2, zd, 0.95, 1.25, 0.9)
  // Windows: the arched door and the upper window, south, north and east.
  for (const [face, plane] of [['s', S], ['n', TOW.y1]] as [Face, number][]) {
    opening(face, plane, TX, 1.6, 0, 2.5, 0.3)
    opening(face, plane, TX, 1.1, 5.0, 6.5, 0.35)
  }
  opening('e', TOW.x1, (S + TOW.y1) / 2, 1.1, 0.6, 2.5, 0.3)
  opening('e', TOW.x1, (S + TOW.y1) / 2, 1.0, 5.0, 6.4, 0.3)
}

// --- Platform canopies ---------------------------------------------------------
// Low hipped shingle roofs on cream posts, open below, with small gablets on
// both slopes, from the station's ends to the tunnels.
const C_EAVE = 2.55, C_FASCIA = 2.25, C_RIDGE = 3.45
function canopy(x0: number, x1: number, y0: number, y1: number, endAtStation: 'w' | 'e') {
  // A closed fascia slab, its underside the ceiling.
  prism(cream, rect(x0, x1, y0, y1), C_FASCIA, C_EAVE, { bottom: true })
  // The hip runs into the station wall at its inner end: a plain gable-less
  // end there, buried in the brick.
  const xi0 = endAtStation === 'w' ? x0 - 3 : x0, xi1 = endAtStation === 'e' ? x1 + 3 : x1
  const ym = (y0 + y1) / 2, h = (y1 - y0) / 2
  const a = Math.max(x0, xi0 + h), b = Math.min(x1, xi1 - h)
  const zr = C_RIDGE
  quad(shingle, [x0, y0, C_EAVE], [x1, y0, C_EAVE], [b, ym, zr], [a, ym, zr])
  quad(shingle, [x1, y1, C_EAVE], [x0, y1, C_EAVE], [a, ym, zr], [b, ym, zr])
  if (endAtStation !== 'e') tri(shingle, [x1, y0, C_EAVE], [x1, y1, C_EAVE], [b, ym, zr])
  if (endAtStation !== 'w') tri(shingle, [x0, y1, C_EAVE], [x0, y0, C_EAVE], [a, ym, zr])
  // Posts along both long sides.
  const n = Math.round((x1 - x0) / 3.6)
  for (let k = 0; k <= n; k++) {
    const x = x0 + 0.25 + (k * (x1 - x0 - 0.5)) / n
    for (const y of [y0 + 0.25, y1 - 0.25]) prism(cream, rect(x - 0.13, x + 0.13, y - 0.13, y + 0.13), 0, C_FASCIA, { top: false })
  }
  // Gablets: three on each slope, a cream face at the eave and a little
  // shingle roof back into the slope.
  const span = x1 - x0
  for (const f of [0.22, 0.5, 0.78]) {
    const x = x0 + span * f, w = 1.7, g = 0.85
    for (const [yy, s] of [[y0, -1], [y1, 1]] as [number, number][]) {
      const back = yy - s * 1.6
      tri(cream, [x - w / 2, yy, C_EAVE], [x + w / 2, yy, C_EAVE], [x, yy, C_EAVE + g])
      tri(cream, [x + w / 2, yy, C_EAVE], [x - w / 2, yy, C_EAVE], [x, yy, C_EAVE + g])
      tri(iron, [x - w * 0.28, yy + s * 0.03, C_EAVE + 0.12], [x + w * 0.28, yy + s * 0.03, C_EAVE + 0.12], [x, yy + s * 0.03, C_EAVE + g * 0.62])
      tri(iron, [x + w * 0.28, yy + s * 0.03, C_EAVE + 0.12], [x - w * 0.28, yy + s * 0.03, C_EAVE + 0.12], [x, yy + s * 0.03, C_EAVE + g * 0.62])
      const e0: V3 = [x - w / 2 - 0.08, yy + s * 0.04, C_EAVE - 0.03], e1: V3 = [x + w / 2 + 0.08, yy + s * 0.04, C_EAVE - 0.03]
      const r0: V3 = [x, yy + s * 0.04, C_EAVE + g + 0.05], r1: V3 = [x, back, C_EAVE + g + 0.05]
      const b0: V3 = [x - w / 2 - 0.08, back, C_EAVE - 0.03], b1: V3 = [x + w / 2 + 0.08, back, C_EAVE - 0.03]
      if (s < 0) { quad(shingle, e0, r0, r1, b0); quad(shingle, r0, e1, b1, r1) }
      else { quad(shingle, e0, b0, r1, r0); quad(shingle, r0, r1, b1, e1) }
    }
  }
}
canopy(-25.6, PAV.x0, -4.0, 2.0, 'e')
canopy(TOW.x1, 26.6, -4.1, 1.7, 'w')

// ---------------------------------------------------------------------------

// Red brick and the tan fish-scale shingle are the station's own colours,
// muted to the palette's range; cream stone and paint are the palette's trim;
// the cresting and crown stay dark, no darker than charcoal; the clock
// surround and finials are the palette's metal, reading as dull gold.
const parts = [
  { part: brick, material: finish('dlr-station-brick', 0xc47b68) },
  { part: shingle, material: finish('dlr-station-shingle', 0xc2a47f) },
  { part: cream, material: PALETTE.trim },
  { part: glazing, material: PALETTE.window },
  { part: iron, material: finish('dlr-station-iron', 0x4a4f57) },
  { part: gold, material: PALETTE.metal },
]

// Shift from the OSM frame used above to the outline's area centroid.
const OX = -0.03, OY = 0.13
for (const { part } of parts) for (let i = 0; i < part.pos.length; i += 3) {
  part.pos[i] -= OX
  part.pos[i + 2] += OY // glTF z is −y
}

const triangles = parts.reduce((sum, { part }) => sum + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Main Street, U.S.A. Station (Disneyland)', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 17.5,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/dlr-main-street-station.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
