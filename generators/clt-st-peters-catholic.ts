/**
 * St. Peter's Catholic Church (507 S Tryon St, 1893, Gothic Revival), Charlotte
 * — original procedural geometry, CC0-1.0.
 * bun generators/clt-st-peters-catholic.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the
 * centroid of the OSM outline way/500195164) on the lowest ground. Placed at
 * bearing 46.3, square to Uptown's grid: the west front (-x) faces South
 * Tryon Street, the bell tower stands at its south (-y) corner, Duke Energy
 * Plaza rises behind it to the south.
 *
 * Identity, in order:
 *  - red brick nave under one steep slate roof, its gable front on Tryon
 *    with a big pointed traceried window over the main doors;
 *  - the bell tower at the front's south corner: brick shaft with granite
 *    bands, a pointed louvred belfry opening on each face, a corbel table,
 *    then a slender octagonal broach spire in slate with tall gabled
 *    lucarnes and four thin corner pinnacles, a gilt cross on top;
 *  - the lower front gable over the north aisle with its tall lancet, and
 *    granite caps and bands on the buttresses;
 *  - the long sides: brick buttresses with tall lancets between;
 *  - a low brick sacristy wing across the back (east).
 *
 * Evidence:
 *  - OSM: outline way/500195164 (23 m tag): the nave 37 x 16.3 m and the
 *    rear wing. The rectory to the south (way/500195162, 12 m) is a separate
 *    building and is not drawn or replaced.
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17), 0.5 m grid,
 *    read in this frame. Ground under the church 2.6-3.5 m above the crop's
 *    lowest return (front higher); the model's base is 2.7. Measured: ridge
 *    17.3 m along y = 1.3; eaves 9.3 m; spire tip 34 m (cross included);
 *    tower about 5 m square at x -20.5..-15.5, y -6.8..-1.8; rear wing
 *    6-8.5 m.
 *  - Published: cornerstone 1893 (Commons photo of the cornerstone, below).
 *  - Photos (Wikimedia Commons, daylight):
 *    "Saint Peter Catholic Church (Charlottle, North Carolina) - view from
 *    across S. Tryon Street.JPG" (Nheyob, CC BY-SA 4.0: the whole front,
 *    face on; the openings were measured off it, scaled to the lidar ridge,
 *    https://commons.wikimedia.org/wiki/File:Saint_Peter_Catholic_Church_(Charlottle,_North_Carolina)_-_view_from_across_S._Tryon_Street.JPG);
 *    "St. Peters church front view (April 2022).jpg" (Kiran891, CC BY-SA
 *    4.0: the front and the north side, buttresses and lancets,
 *    https://commons.wikimedia.org/wiki/File:St._Peters_church_front_view_(April_2022).jpg);
 *    "Saint Peter Catholic Church (Charlotte, North Carolina) - view from
 *    Duke Energy Building.jpg" (Nheyob, CC BY-SA 4.0: the south side, the
 *    tower's belfry and spire, the rectory in front,
 *    https://commons.wikimedia.org/wiki/File:Saint_Peter_Catholic_Church_(Charlotte,_North_Carolina)_-_view_from_Duke_Energy_Building.jpg);
 *    "Duke Energy Plaza November 2022.jpg" (City Dweller 2, CC BY-SA 4.0:
 *    the roof and rear from the north-east,
 *    https://commons.wikimedia.org/wiki/File:Duke_Energy_Plaza_November_2022.jpg).
 *    No commercial imagery. No look-only sources.
 *  - Terrain (Mapterhorn): about 1 m of fall from Tryon to the back;
 *    elevation 0.
 *
 * Estimated: every opening's size from the face-on photo; the side lancets
 * (six bays a side) and the buttresses from the oblique photo; the rear
 * wing's hipped roof from the lidar; the spirelets and lucarnes' size.
 * Checked against the face-on and north-side photos over three passes; the
 * roof's slate end triangles and eave strip, which hid the brick front gable
 * and its big window, were removed on the second.
 * Lead review (pass 4): the spire was a broad square pyramid. Now octagonal,
 * 4 m across the flats at its foot with 2.2 m broaches, lucarnes a third of
 * the way up, cross top kept at the lidar's 34.0 m (highest return 36.9 m
 * above the crop's lowest, ground 2.9). The tower's brick now stops at 19.5
 * m, clearly above the 17.3 m nave ridge: in the face-on photo the corbel
 * table sits level with the gable apex, which stands forward of the ridge;
 * belfry stage and bands (7.8, 10.8, 13.1 m) placed by their share of the
 * tower's height in that photo. The front's big window is now 3.1 m wide,
 * 6.7 to 13.0 m, with a rose in its head, and the gable vent moved up.
 * Doubts: the spire is about two thirds the tower's height, as the lidar
 * top allows; the photo, taken from below, makes it look nearly as tall. The
 * east (back) end is seen only from above; the aisle front gable
 * is drawn as a cross gable on the main roof, which is how the lidar reads.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { onWall, save, walls, type XY } from './chi-aon-center'

const BEARING = 46.3
const ANCHOR: [number, number] = [35.2238468, -80.847309]

const brick = new Part(), slate = new Part(), granite = new Part(), win = new Part(), oak = new Part(), gold = new Part()

/** A flat polygon, fanned from its first point, wound to face `n`. */
function face(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i + 1 < pts.length; i++) p.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n])
}
/** A box, x0..x1, y0..y1, z0..z1. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = p) {
  walls(p, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1)
  if (top) face(top, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1])
}
/** A shape on wall a→b (counter-clockwise ring) from (s, z) points, `out` proud of it. */
function onFace(p: Part, a: XY, b: XY, pts: [number, number][], out = 0.05) {
  const { P, n } = onWall(a, b)
  face(p, pts.map(([s, z]) => P(s, z, out)), [n[0], n[1], 0])
}
/** A pointed (equilateral) arch opening: jambs s0..s1 from z0 to the springing zs. */
function lancet(s0: number, s1: number, z0: number, zs: number, seg = 5): [number, number][] {
  const w = s1 - s0, pts: [number, number][] = [[s0, z0], [s1, z0], [s1, zs]]
  for (let i = 1; i <= seg; i++) { const t = (i / seg) * Math.PI / 3; pts.push([s0 + w * Math.cos(t), zs + w * Math.sin(t)]) }
  for (let i = seg - 1; i >= 1; i--) { const t = (i / seg) * Math.PI / 3; pts.push([s1 - w * Math.cos(t), zs + w * Math.sin(t)]) }
  return pts
}
/** Lancet window with a pale surround and the glazing inside it. */
function window(a: XY, b: XY, s: number, w: number, z0: number, z1: number) {
  const zs = z1 - w * Math.sin(Math.PI / 3)
  onFace(granite, a, b, lancet(s - w / 2 - 0.22, s + w / 2 + 0.22, z0 - 0.25, zs), 0.04)
  onFace(win, a, b, lancet(s - w / 2, s + w / 2, z0, zs), 0.07)
}

// --- Nave: x -20.2..11.6, y -6.8..9.5; ridge 17.3 at y 1.35, eaves 9.3.
const NX0 = -20.2, NX1 = 11.6, NY0 = -6.8, NY1 = 9.5, RIDGE = 17.3, EAVE = 9.3, RY = 1.35
const BASE = 0.9 // granite water table
walls(brick, [[NX0, NY0], [NX1, NY0], [NX1, NY1], [NX0, NY1]], 0, EAVE)
box(granite, NX0 - 0.15, NX1 + 0.15, NY0 - 0.15, NY1 + 0.15, 0, BASE, null)
for (const x of [NX0, NX1]) {
  const n: V3 = [x < 0 ? -1 : 1, 0, 0]
  face(brick, [[x, NY0, EAVE], [x, NY1, EAVE], [x, RY, RIDGE]], n)
}
{
  const o = 0.5 // eaves overhang
  const L: V3 = [NX0 - 0.4, NY0 - o, EAVE - 0.4], R: V3 = [NX1 + 0.4, NY0 - o, EAVE - 0.4]
  const L2: V3 = [NX0 - 0.4, NY1 + o, EAVE - 0.4], R2: V3 = [NX1 + 0.4, NY1 + o, EAVE - 0.4]
  const T0: V3 = [NX0 - 0.4, RY, RIDGE + 0.3], T1: V3 = [NX1 + 0.4, RY, RIDGE + 0.3]
  face(slate, [L, R, T1, T0], [0, -0.7, 0.7])
  face(slate, [R2, L2, T0, T1], [0, 0.7, 0.7])
  // no slate end triangles: the brick gables close the roof (they hid the front window)
}

// --- The north aisle's front gable: a cross gable on the main roof, ridge 12.1 at y 7.0.
{
  const y0 = 4.5, y1 = NY1, yc = (y0 + y1) / 2, top = 12.1, back = NX0 + 4
  face(brick, [[NX0, y0, EAVE], [NX0, y1, EAVE], [NX0, yc, top]], [-1, 0, 0])
  face(slate, [[NX0 - 0.4, y0 - 0.3, EAVE - 0.3], [NX0 - 0.4, yc, top + 0.3], [back, yc, top + 0.3], [back, y0 - 0.3, EAVE + 2.2]], [0, -0.7, 0.7])
  face(slate, [[NX0 - 0.4, y1 + 0.3, EAVE - 0.3], [back, y1 + 0.3, EAVE - 0.3], [back, yc, top + 0.3], [NX0 - 0.4, yc, top + 0.3]], [0, 0.7, 0.7])
}

// --- The front (x = NX0 face, wall a→b from north to south).
{
  const a: XY = [NX0, NY1], b: XY = [NX0, NY0] // s = NY1 - y
  const S = (y: number) => NY1 - y
  // main doors, pointed, at the head of the steps
  onFace(granite, a, b, lancet(S(1.05) - 1.35, S(1.05) + 1.35, 1.2, 4.0), 0.04)
  onFace(oak, a, b, lancet(S(1.05) - 1.05, S(1.05) + 1.05, 1.4, 3.8), 0.08)
  // flanking lancets
  window(a, b, S(3.2), 0.85, 2.6, 5.0)
  window(a, b, S(-1.1), 0.85, 2.6, 5.0)
  // granite string course over the doors
  onFace(granite, a, b, [[S(4.6), 6.1], [S(-1.8), 6.1], [S(-1.8), 6.5], [S(4.6), 6.5]], 0.06)
  // the big traceried window: three lights under the arch
  window(a, b, S(1.05), 3.1, 6.7, 13.0)
  for (const d of [-0.52, 0.52]) onFace(granite, a, b, [[S(1.05) + d - 0.1, 6.7], [S(1.05) + d + 0.1, 6.7], [S(1.05) + d + 0.1, 10.6], [S(1.05) + d - 0.1, 10.6]], 0.1)
  // the rose of tracery in the arch head
  onFace(granite, a, b, Array.from({ length: 10 }, (_, k) => [S(1.05) + 0.75 * Math.cos(k * Math.PI / 5), 11.55 + 0.75 * Math.sin(k * Math.PI / 5)] as [number, number]), 0.1)
  // vent in the gable
  onFace(granite, a, b, [[S(1.05) - 0.8, 14.6], [S(1.05) + 0.8, 14.6], [S(1.05) + 0.8, 15.4], [S(1.05) - 0.8, 15.4]], 0.06)
  // north aisle: its tall lancet
  window(a, b, S(7.0), 1.1, 2.8, 9.2)
}

// --- Long sides: six bays of lancets between brick buttresses with granite caps.
for (const side of [-1, 1]) {
  const y = side < 0 ? NY0 : NY1
  const a: XY = side < 0 ? [NX0, NY0] : [NX1, NY1], b: XY = side < 0 ? [NX1, NY0] : [NX0, NY1]
  const len = NX1 - NX0, bay = len / 6
  for (let k = 0; k <= 6; k++) {
    const x = NX0 + k * bay
    if (side < 0 && x < -15) continue // the tower stands here
    const bx0 = Math.min(Math.max(x - 0.4, NX0), NX1 - 0.8), d = side * 0.7
    const y0 = side < 0 ? y + d : y, y1 = side < 0 ? y : y + d
    box(brick, bx0, bx0 + 0.8, y0, y1, 0, 6.2, granite)
    box(granite, bx0 - 0.05, bx0 + 0.85, side < 0 ? y0 - 0.05 : y0, side < 0 ? y1 : y1 + 0.05, 2.6, 3.0, null)
  }
  for (let k = 0; k < 6; k++) {
    const xc = NX0 + (k + 0.5) * (len / 6)
    if (side < 0 && xc < -14.5) continue
    const s = side < 0 ? xc - NX0 : NX1 - xc
    window(a, b, s, 1.1, 2.6, 8.2)
  }
}

// --- Bell tower: x -20.5..-15.5, y -6.95..-1.95; brick to 17.6, corbel table, spire to 33.
{
  const X0 = -20.5, X1 = -15.5, Y0 = -6.95, Y1 = -1.95, TOP = 19.5, SP = 32.2
  walls(brick, [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]], 0, TOP - 0.8)
  // corbel table: the top 0.8 m stepped out
  walls(brick, [[X0 - 0.2, Y0 - 0.2], [X1 + 0.2, Y0 - 0.2], [X1 + 0.2, Y1 + 0.2], [X0 - 0.2, Y1 + 0.2]], TOP - 0.8, TOP)
  face(brick, [[X0, Y0, TOP - 0.8], [X0 - 0.2, Y0 - 0.2, TOP - 0.8], [X0 - 0.2, Y1 + 0.2, TOP - 0.8], [X0, Y1, TOP - 0.8]], [0, 0, -1])
  face(brick, [[X1, Y0, TOP - 0.8], [X1, Y1, TOP - 0.8], [X1 + 0.2, Y1 + 0.2, TOP - 0.8], [X1 + 0.2, Y0 - 0.2, TOP - 0.8]], [0, 0, -1])
  face(brick, [[X0, Y0, TOP - 0.8], [X1, Y0, TOP - 0.8], [X1 + 0.2, Y0 - 0.2, TOP - 0.8], [X0 - 0.2, Y0 - 0.2, TOP - 0.8]], [0, 0, -1])
  face(brick, [[X0, Y1, TOP - 0.8], [X0 - 0.2, Y1 + 0.2, TOP - 0.8], [X1 + 0.2, Y1 + 0.2, TOP - 0.8], [X1, Y1, TOP - 0.8]], [0, 0, -1])
  const ring: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
  for (let i = 0; i < 4; i++) {
    const a = ring[i], b = ring[(i + 1) % 4], { L } = onWall(a, b)
    // granite bands
    for (const [z0, z1] of [[0, BASE], [7.8, 8.2], [10.8, 11.1], [13.1, 13.5]] as [number, number][]) onFace(granite, a, b, [[-0.06, z0], [L + 0.06, z0], [L + 0.06, z1], [-0.06, z1]], 0.06)
    // belfry: pointed louvred opening
    window(a, b, L / 2, 1.9, 13.7, 17.8)
    // the front face (x = X0, i === 3) has the tower door
    if (i === 3) {
      onFace(granite, a, b, lancet(L / 2 - 1.05, L / 2 + 1.05, 1.2, 3.6), 0.04)
      onFace(oak, a, b, lancet(L / 2 - 0.8, L / 2 + 0.8, 1.4, 3.4), 0.08)
    }
  }
  // spire: a slender octagonal broach spire. Its octagon sits just inside the corbel table; four
  // triangular broaches carry the square's corners up onto the diagonal faces.
  const cx = (X0 + X1) / 2, cy = (Y0 + Y1) / 2, R0 = 2.0, BROACH = 2.2
  const oct = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, k) => {
    const t = (k + 0.5) * Math.PI / 4 - Math.PI / 2 // vertex angles; flat faces on the four sides
    const rr = r / Math.cos(Math.PI / 8)
    return [cx + rr * Math.cos(t), cy + rr * Math.sin(t), z] as V3
  })
  const rAt = (z: number) => R0 * (SP - z) / (SP - TOP)
  const O = oct(R0, TOP), tip: V3 = [cx, cy, SP]
  for (let k = 0; k < 8; k++) {
    const a = O[k], b = O[(k + 1) % 8], m: V3 = [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0]
    face(slate, [a, b, tip], [m[0], m[1], 0.25])
  }
  // broaches: from each square corner (at the corbel's outer edge) up to a point on the diagonal face
  const e = 0.2
  const corners: XY[] = [[X1 + e, Y1 + e], [X0 - e, Y1 + e], [X0 - e, Y0 - e], [X1 + e, Y0 - e]]
  for (let q = 0; q < 4; q++) {
    const [x, y] = corners[q]
    const a = O[(2 * q) % 8], b = O[(2 * q + 1) % 8] // the diagonal face's base, facing this corner
    const d = [x - cx, y - cy], L = Math.hypot(d[0], d[1])
    const rz = rAt(TOP + BROACH) / Math.cos(Math.PI / 8) * Math.cos(Math.PI / 8)
    const up: V3 = [cx + d[0] / L * rz, cy + d[1] / L * rz, TOP + BROACH]
    const c: V3 = [x, y, TOP]
    face(slate, [a, c, up], [d[0] - (b[0] - a[0]), d[1] - (b[1] - a[1]), 0.6])
    face(slate, [c, b, up], [d[0] + (b[0] - a[0]), d[1] + (b[1] - a[1]), 0.6])
  }
  // tall gabled lucarnes on the four cardinal faces, a third of the way up
  for (const [nx, ny] of [[1, 0], [0, 1], [-1, 0], [0, -1]] as XY[]) {
    const u: XY = [-ny, nx]
    const z0 = TOP + 3.4, z1 = TOP + 6.4, zt = TOP + 7.3, w = 0.45
    const f0 = rAt(z0) + 0.15, back = rAt(zt) - 0.3
    const P = (sd: number, z: number, o: number): V3 => [cx + nx * o + u[0] * sd, cy + ny * o + u[1] * sd, z]
    face(granite, [P(-w, z0, f0), P(w, z0, f0), P(w, z1, f0), P(0, zt, f0), P(-w, z1, f0)], [nx, ny, 0])
    face(win, [P(-0.25, z0 + 0.3, f0 + 0.05), P(0.25, z0 + 0.3, f0 + 0.05), P(0.25, z1 - 0.1, f0 + 0.05), P(0, z1 + 0.45, f0 + 0.05), P(-0.25, z1 - 0.1, f0 + 0.05)], [nx, ny, 0])
    face(slate, [P(-w - 0.08, z1, f0 + 0.1), P(0, zt + 0.08, f0 + 0.1), P(0, zt + 0.08, back), P(-w - 0.08, z1, back)], [-u[0], -u[1], 1])
    face(slate, [P(w + 0.08, z1, f0 + 0.1), P(w + 0.08, z1, back), P(0, zt + 0.08, back), P(0, zt + 0.08, f0 + 0.1)], [u[0], u[1], 1])
    face(slate, [P(-w, z0, f0), P(-w, z1, f0), P(-w, z1, back), P(-w, z0, back)], [-u[0], -u[1], 0])
    face(slate, [P(w, z0, f0), P(w, z0, back), P(w, z1, back), P(w, z1, f0)], [u[0], u[1], 0])
  }
  // four thin pinnacles on the tower's corners, standing on the broaches' feet
  for (const [x, y] of corners) {
    const r = 0.18, z0 = TOP, z1 = TOP + 4.5
    const q: V3[] = [[x - r, y - r, z0], [x + r, y - r, z0], [x + r, y + r, z0], [x - r, y + r, z0]]
    for (let i = 0; i < 4; i++) {
      const a = q[i], b = q[(i + 1) % 4]
      face(slate, [a, b, [x, y, z1]], [(a[0] + b[0]) / 2 - x, (a[1] + b[1]) / 2 - y, 0.1])
    }
  }
  cross(cx, cy, SP - 0.2, 2.0) // cross top 34.0 m, the lidar's highest return
}
// gilt cross on the front gable and on the aisle gable
function cross(x: number, y: number, z: number, h: number) {
  const t = 0.16
  box(gold, x - t, x + t, y - t, y + t, z, z + h)
  box(gold, x - t, x + t, y - h * 0.33, y + h * 0.33, z + h * 0.55, z + h * 0.55 + 2 * t)
}
cross(NX0 + 0.3, RY, RIDGE, 1.5)
cross(NX0 + 0.3, 7.0, 12.1, 1.1)

// --- Rear (sacristy) wing: outline x 11.6..17.2, y -18.3..9.5; walls 6.0, hipped roof to 8.3.
{
  const X0 = NX1, X1 = 17.2, Y0 = -18.3, Y1 = NY1, Z = 6.0, T = 8.3
  walls(brick, [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]], 0, Z)
  box(granite, X0, X1 + 0.12, Y0 - 0.12, Y1 + 0.12, 0, BASE, null)
  const xm = (X0 + X1) / 2, o = 0.3
  const A: V3 = [X0 - o, Y0 - o, Z], B: V3 = [X1 + o, Y0 - o, Z], C: V3 = [X1 + o, Y1 + o, Z], D: V3 = [X0 - o, Y1 + o, Z]
  const R0: V3 = [xm, Y0 + 2.6, T], R1: V3 = [xm, Y1 - 2.6, T]
  face(slate, [A, B, R0], [0, -1, 1])
  face(slate, [B, C, R1, R0], [1, 0, 1])
  face(slate, [C, D, R1], [0, 1, 1])
  face(slate, [D, A, R0, R1], [-1, 0, 1])
  const ring: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
  for (let i = 0; i < 4; i++) {
    const a = ring[i], b = ring[(i + 1) % 4], { L } = onWall(a, b)
    if (i === 3) continue // against the nave (mostly)
    const n = Math.max(1, Math.round(L / 4.5))
    for (let k = 0; k < n; k++) {
      const s = (k + 0.5) * L / n
      onFace(win, a, b, [[s - 0.5, 1.6], [s + 0.5, 1.6], [s + 0.5, 4.2], [s, 4.8], [s - 0.5, 4.2]], 0.06)
    }
  }
}

// --- Steps up to the two front doors (granite), from the pavement to the sill.
box(granite, NX0 - 1.6, NX0, -0.9, 3.0, 0, 1.2)
box(granite, NX0 - 1.6, NX0 - 0.15, -6.6, -2.2, 0, 1.2)

if (import.meta.main) {
  await save('clt-st-peters-catholic', "St. Peter's Catholic Church", ANCHOR, BEARING, [
    { part: brick, material: finish('st-peters-brick', 0xa9604f) },
    { part: slate, material: finish('st-peters-slate', 0x80868d) },
    { part: granite, material: finish('st-peters-granite', 0xdcd6cc) },
    { part: win, material: PALETTE.window },
    { part: oak, material: finish('st-peters-oak', 0x8d5f3d) },
    { part: gold, material: finish('st-peters-gilt', 0xcfae55, 0.5) },
  ])
}
