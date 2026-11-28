/**
 * Old Adobe Mission (Our Lady of Perpetual Help), Scottsdale, Arizona
 * (1933) — original procedural geometry, CC0-1.0.
 * bun generators/phx-old-adobe-mission.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin on the
 * ground at the centroid of OSM way/552954306 (building=church, "Old Adobe
 * Mission Catholic Church", -111.92429, 33.492004), which it replaces.
 *
 * Identity (photos below):
 *  1. Whitewashed adobe, all white.                              (tony)
 *  2. The curved Mission parapet over the west front: a bell-shaped
 *     gable with concave shoulders and a rounded top.           (tony, cog2)
 *  3. The three-stage bell tower at the north-west corner, each stage
 *     set in, round-arched openings, a small dome and a cross.  (tony, cog2)
 *  4. The round-arched entrance in the middle of the front, a tall
 *     window over it and two small windows beside it.               (tony)
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020), 0.5 m grid
 * in this frame, above ground 0.4 (flat site): the nave's eaves 5.7 and
 * ridge 7.5 (ridge at y -2.5, nave y -8.6..3.1); the front parapet's crown
 * 8.1; the tower top 11.4 over x -7..-2.5, y 1..5.5; the lean-to along the
 * north side 3.9–4.6; the east block 4.4, with a part at 5.9.
 * Estimated from the photos against the door (about 2.4 m wide): the
 * tower's stage heights (6.0 / 8.6 / 10.3) and set-backs, the arch sizes,
 * the parapet's curve, the cross (1.5 m, above the lidar's dome top).
 *
 * Photos (evidence):
 *  tony "SD-Old Adobe Mission 1933.jpg", Tony the Marine, CC BY-SA 3.0
 *       (the west front and tower from the south-west)
 *       https://commons.wikimedia.org/wiki/File:SD-Old_Adobe_Mission_1933.jpg
 *  cog2 "Old Adobe Mission in Scottsdale", cogdogblog (Alan Levine), CC0
 *       (the tower and parapet at sunset)
 *       https://www.flickr.com/photos/37996646802@N01/2275635991
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the east end and north side are unphotographed here and drawn
 * plain from the lidar; the roof covering is drawn grey (not seen in the
 * photos). The lower arcaded building north of the church is a separate
 * OSM building and is left to the map.
 *
 * Night: the windows glow; the white walls are floodlit low down.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, save, type XY } from './atl-flatiron-building'

const wall = new Part(), roof = new Part(), win = new Part(), dark = new Part(), door = new Part()
const z = (H: number) => H - 0.4

function face(p: Part, q: V3[], want: V3) {
  const b = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], c = [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]]
  const g = [b[1] * c[2] - b[2] * c[1], b[2] * c[0] - b[0] * c[2], b[0] * c[1] - b[1] * c[0]]
  const r = g[0] * want[0] + g[1] * want[1] + g[2] * want[2] < 0 ? [...q].reverse() : q
  if (r.length === 3) p.tri(r[0], r[1], r[2])
  else p.quad(r[0], r[1], r[2], r[3])
}
const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = p, bev = 0.15) =>
  prism(p, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, top, bev)

/**
 * A flush round-headed opening on a wall plane. `axis` 'x' = a wall facing
 * ±x at x = c; 'y' = facing ±y at y = c. u is the position along the wall.
 */
function arch(p: Part, axis: 'x' | 'y', c: number, dir: number, u: number, w: number, z0: number, spring: number, n = 8) {
  const pts: [number, number][] = [[u - w / 2, z0], [u + w / 2, z0], [u + w / 2, spring]]
  for (let i = 1; i < n; i++) {
    const a = (i / n) * Math.PI
    pts.push([u + (w / 2) * Math.cos(a), spring + (w / 2) * Math.sin(a)])
  }
  pts.push([u - w / 2, spring])
  const P = ([s, zz]: [number, number]): V3 => (axis === 'x' ? [c + dir * 0.05, s, zz] : [s, c + dir * 0.05, zz])
  const want: V3 = axis === 'x' ? [dir, 0, 0] : [0, dir, 0]
  const m: [number, number] = [u, (z0 + spring) / 2]
  for (let i = 0; i < pts.length; i++) face(p, [P(m), P(pts[i]), P(pts[(i + 1) % pts.length])], want)
}
function rect(p: Part, axis: 'x' | 'y', c: number, dir: number, u0: number, u1: number, z0: number, z1: number) {
  const P = (s: number, zz: number): V3 => (axis === 'x' ? [c + dir * 0.05, s, zz] : [s, c + dir * 0.05, zz])
  face(p, [P(u0, z0), P(u1, z0), P(u1, z1), P(u0, z1)], axis === 'x' ? [dir, 0, 0] : [0, dir, 0])
}

// ── the nave: gabled, y -8.6..3.1, eaves 5.3, ridge 7.1 ──
const NX0 = -6.7, NX1 = 16.0, NY0 = -8.6, NY1 = 3.1, EAVE = z(5.7), RIDGE = z(7.5), RY = -2.75
box(wall, NX0, NX1, NY0, NY1, 0, EAVE, null, 0)
{
  const o = 0.35
  const A: V3 = [NX0, NY0 - o, EAVE - 0.1], B: V3 = [NX1 + o, NY0 - o, EAVE - 0.1], C: V3 = [NX1 + o, RY, RIDGE], D: V3 = [NX0, RY, RIDGE]
  const E: V3 = [NX1 + o, NY1 + o, EAVE - 0.1], F: V3 = [NX0, NY1 + o, EAVE - 0.1]
  face(roof, [A, B, C, D], [0, -1, 2.5])
  face(roof, [D, C, E, F], [0, 1, 2.5])
  face(wall, [[NX1, NY0, EAVE], [NX1, NY1, EAVE], [NX1, RY, RIDGE]], [1, 0, 0]) // the east gable
  face(roof, [B, E, C], [1, 0, 0])
}
// side windows, one per bay (tony: deep-set small windows)
for (const x of [-1, 4, 9, 14]) rect(win, 'y', NY0, -1, x - 0.5, x + 0.5, 1.6, 3.4)

// ── the lean-to along the north side and the east block ──
box(wall, -3.0, NX1, NY1, 6.4, 0, z(4.3))
box(wall, NX1, 22.5, -9.6, 6.3, 0, z(4.4))
box(wall, 17.0, 22.3, 2.0, 5.8, z(4.4), z(5.9))
rect(win, 'y', -9.6, -1, 18, 20.5, 1.2, 2.6)

// ── the west front: wall, mouldings, the Mission parapet ──
const FX = NX0 - 0.5 // the front wall stands a little proud of the nave
box(wall, FX, NX0 + 0.2, NY0 - 0.3, 0.6, 0, EAVE + 0.1, wall, 0.1)
box(wall, FX - 0.15, NX0, NY0 - 0.45, 0.6, z(4.0), z(4.4), wall, 0.08) // the string course
{
  // the parapet: a raised-cosine bell from the shoulders (z 5.3) to the
  // crown (z 7.7), concave low down and round at the top
  const y0 = NY0 - 0.3, y1 = 0.6, zc = z(8.1), zs = EAVE + 0.1, n = 16, T = 0.6
  const ring: XY[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, yy = y0 + (y1 - y0) * t, s = Math.abs(2 * t - 1)
    ring.push([yy, zs + (zc - zs) * 0.5 * (1 + Math.cos(Math.PI * Math.min(1, s * 1.15)))])
  }
  for (let i = 0; i < n; i++) {
    const [ya, za] = ring[i], [yb, zb] = ring[i + 1]
    for (const [x, d] of [[FX, -1], [FX + T, 1]] as [number, number][]) face(wall, [[x, ya, zs], [x, yb, zs], [x, yb, zb], [x, ya, za]], [d, 0, 0])
    face(wall, [[FX, ya, za], [FX, yb, zb], [FX + T, yb, zb], [FX + T, ya, za]], [0, -(zb - za), yb - ya])
  }
  // the entrance: a round-arched door, a tall window over it, two small
  // windows beside it
  const yc = (y0 + y1) / 2
  arch(door, 'x', FX, -1, yc, 2.6, 0, 2.4)
  rect(win, 'x', FX, -1, yc - 0.35, yc + 0.35, 4.7, 6.2)
  rect(win, 'x', FX, -1, yc - 3.2, yc - 2.5, 1.4, 2.6)
  rect(win, 'x', FX, -1, yc + 2.5, yc + 3.2, 1.4, 2.6)
}

// ── the tower: three stages set in, a dome and a cross ──
const TX0 = -7.8, TX1 = -3.4, TY0 = 0.3, TY1 = 4.8
const S1 = z(6.4), S2 = z(9.0), S3 = z(10.7), TOP = z(11.4)
box(wall, TX0, TX1, TY0, TY1, 0, S1, wall, 0.12)
box(wall, TX0 - 0.15, TX1 + 0.15, TY0 - 0.15, TY1 + 0.15, S1 - 0.35, S1, wall, 0.08)
box(wall, TX0 + 0.3, TX1 - 0.3, TY0 + 0.3, TY1 - 0.3, S1, S2, wall, 0.1)
// stage 2's corner pilasters
for (const [x, y] of [[TX0 + 0.3, TY0 + 0.3], [TX1 - 0.3, TY0 + 0.3], [TX0 + 0.3, TY1 - 0.3], [TX1 - 0.3, TY1 - 0.3]] as XY[]) box(wall, x - 0.4, x + 0.4, y - 0.4, y + 0.4, S1, S2 + 0.2, wall, 0.08)
box(wall, TX0 + 0.15, TX1 - 0.15, TY0 + 0.15, TY1 - 0.15, S2 - 0.25, S2, wall, 0.06)
box(wall, TX0 + 0.75, TX1 - 0.75, TY0 + 0.75, TY1 - 0.75, S2, S3, wall, 0.08)
box(wall, TX0 + 0.6, TX1 - 0.6, TY0 + 0.6, TY1 - 0.6, S3 - 0.2, S3, wall, 0.05)
{
  // the openings: big arches in stage 2, small ones in stage 3, all sides
  const xm = (TX0 + TX1) / 2, ym = (TY0 + TY1) / 2
  for (const [axis, c, d, u] of [['x', TX0 + 0.3, -1, ym], ['x', TX1 - 0.3, 1, ym], ['y', TY0 + 0.3, -1, xm], ['y', TY1 - 0.3, 1, xm]] as ['x' | 'y', number, number, number][]) arch(dark, axis, c, d, u, 1.5, S1 + 0.6, S2 - 1.3)
  for (const [axis, c, d, u] of [['x', TX0 + 0.75, -1, ym], ['x', TX1 - 0.75, 1, ym], ['y', TY0 + 0.75, -1, xm], ['y', TY1 - 0.75, 1, xm]] as ['x' | 'y', number, number, number][]) arch(dark, axis, c, d, u, 0.8, S3 - 1.3, S3 - 0.75)
  // a window in stage 1's west face
  rect(win, 'x', TX0, -1, ym - 0.35, ym + 0.35, 1.6, 3.2)
  // the dome
  const R = 1.35, n = 12, m = 4
  for (let j = 0; j < m; j++) for (let i = 0; i < n; i++) {
    const a0 = (i / n) * 2 * Math.PI, a1 = ((i + 1) / n) * 2 * Math.PI, b0 = (j / m) * Math.PI / 2, b1 = ((j + 1) / m) * Math.PI / 2
    const P = (a: number, b: number): V3 => [xm + R * Math.cos(b) * Math.cos(a), ym + R * Math.cos(b) * Math.sin(a), S3 + (TOP - S3) * Math.sin(b)]
    const am = (a0 + a1) / 2, bm = (b0 + b1) / 2
    const want: V3 = [Math.cos(bm) * Math.cos(am), Math.cos(bm) * Math.sin(am), Math.sin(bm)]
    if (j === m - 1) face(wall, [P(a0, b0), P(a1, b0), P(a0, b1)], want)
    else face(wall, [P(a0, b0), P(a1, b0), P(a1, b1), P(a0, b1)], want)
  }
  // the cross
  box(wall, xm - 0.1, xm + 0.1, ym - 0.1, ym + 0.1, TOP - 0.1, TOP + 1.5, wall, 0.03)
  box(wall, xm - 0.1, xm + 0.1, ym - 0.45, ym + 0.45, TOP + 0.85, TOP + 1.05, wall, 0.03)
}

await save('phx-old-adobe-mission', 'Old Adobe Mission', [
  { part: wall, material: { ...finish('oam-whitewash', 0xf3efe8), floodlight: (p, n) => (n[2] > 0.5 ? 0 : Math.max(0, 0.6 - p[2] / 20)) } },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: dark, material: finish('oam-opening', 0x5d5a56) },
  { part: door, material: finish('oam-door', 0x8c6b4c) },
], { height: z(11.4) + 1.5, anchor: [33.492004, -111.92429], bearing: 0 }, 5000)
