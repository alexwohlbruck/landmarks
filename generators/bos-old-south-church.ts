/**
 * Old South Church, 645 Boylston Street at Dartmouth Street, Copley Square,
 * Boston (1873, Cummings and Sears; campanile rebuilt 1935–37 by Allen &
 * Collens) — original procedural geometry, CC0-1.0.
 * bun generators/bos-old-south-church.ts
 *
 * Map frame: x, y, z up, metres; origin at the anchor on the lowest ground.
 * Bearing 339.6: +x runs east-north-east along Boylston Street toward
 * Dartmouth Street (the chancel end), +y north-north-west; Boylston Street
 * is the -y side. Anchor = the centroid of the outer way (way/815753668) of
 * OSM relation/11201377 ("Old South Church"), -71.0780346, 42.3502197.
 *
 * Identity (from the photos below):
 *  1. The tall square campanile on Boylston Street, striped in buff and red
 *     sandstone over puddingstone: a plain shaft with paired lancets, a
 *     corbelled ledge, an open belfry of three pointed arches a face on
 *     colonnettes, a corbel-table parapet with four corner pinnacles, and a
 *     steep slate spire with a red band and a tall finial.
 *  2. The green copper lantern over the crossing: a twelve-sided drum of
 *     red-painted Gothic windows under gablets, and a ribbed onion dome.
 *  3. A broad cross of steep gables in grey-brown Roxbury puddingstone with
 *     buff and red banding: the east gable on Dartmouth Street and the
 *     south transept on Boylston, each with a big rose window in a pointed
 *     arch over a row of lancets, pinnacles at the gable corners, and a red
 *     and grey striped slate roof.
 *  4. The gabled corner porch at Boylston and Dartmouth, the low arcaded
 *     porch between the tower and the transept, and the parish house west
 *     of the tower.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021), 0.5 m grid,
 * read with tools/lidar_frame.py. y = 0 is the lowest ground, the service
 * alley on the north side; Boylston Street is 1.4 m higher and Dartmouth
 * Street 1.5 (the Mapterhorn terrain agrees). Measured: the tower's ledge
 * 39.4, parapet 53.6, corner pinnacles 57.4, spire apex 67.6; the nave and
 * chancel ridge 22.1 and the transept ridge 22.4, the eaves about 16.5; the
 * gable apexes 25.2; the lantern's top 30.5; the west block's flat roof
 * 23.4 (a stair block on its north side 26.8); the parish house 18.9; the
 * porches 10.0–10.3; the north annex 9.2. The finial is too thin for the
 * lidar: scaled from the Beyond My Ken photo as about 6 m above the spire,
 * to 73.2, 71.8 above Boylston Street. Wikipedia gives the campanile as
 * 246 ft (75 m), 3 m more than the lidar and the photo give.
 *
 * Plan: the lidar, which puts the walls 1.5–2 m south of OSM's outline:
 * the tower 8.5 m square at x -13..-4.5, y -14.8..-6.2; the nave and
 * chancel x -9.5..30, y -11..9; the transept x 5..27, y -15..13; the
 * lantern centred at (16, -1). The west block and the parish house follow
 * OSM's outline and parts.
 *
 * Estimated from the photos: the tower's stages and openings (Beyond My
 * Ken, scaled to the lidar's ledge and parapet), the rose windows, lancets
 * and gable pinnacles (Farragutful), the lantern's drum and dome (Farragutful,
 * scaled to the lidar's top and OSM's 6 m lantern part), the roof's red
 * and grey bands, and the corner porch's two gables (Farragutful).
 *
 * Night: the windows glow; the campanile and the lantern are floodlit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Old South Church - Boston 01.jpg, Farragutful, CC BY-SA 4.0 (from
 *    Copley Square, the south-east: the tower, both gables, the porch and
 *    the lantern)
 *    https://commons.wikimedia.org/wiki/File:Old_South_Church_-_Boston_01.jpg
 *  - 2017 Old South Church tower, 645 Boylston Street, Boston,
 *    Massachusetts.jpg, Beyond My Ken, CC BY-SA 4.0 (the tower and the
 *    parish house from Boylston Street)
 *    https://commons.wikimedia.org/wiki/File:2017_Old_South_Church_tower,_645_Boylston_Street,_Boston,_Massachusetts.jpg
 *  - 2017 Prudential Skywalk - Old South Church (NE).jpg, Beyond My Ken,
 *    CC BY-SA 4.0 (from above, the south-west: the plan, the roofs and the
 *    spire)
 *    https://commons.wikimedia.org/wiki/File:2017_Prudential_Skywalk_-_Old_South_Church_(NE).jpg
 *  - Old South Church - Boston 07.jpg, Farragutful, CC BY-SA 4.0 (a portal
 *    close up: the banded arches)
 *    https://commons.wikimedia.org/wiki/File:Old_South_Church_-_Boston_07.jpg
 * Published: Wikipedia, "Old South Church": Cummings and Sears, 1873;
 * campanile 246 ft, rebuilt 1935–37; puddingstone with sandstone banding;
 * red and grey striped slate; the twelve-windowed copper lantern.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the north side and the west block are not photographed; the
 * north transept gable mirrors the south, the west block is plain. The
 * roof's iron cresting, the tower's corbel detail and the lantern's small
 * pinnacles are left out; the roof's stripes are drawn as three bands.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, capPoly, save, wall, type XY } from './atl-flatiron-building'
import { gableRoof, onWall, pyramid, rectShape, revolve } from './atl-tech-tower'

const stone = new Part(), trim = new Part(), slate = new Part(), red = new Part(), cu = new Part(), win = new Part()

type F = [XY, XY]
const faces = (x0: number, x1: number, y0: number, y1: number): Record<'s' | 'e' | 'n' | 'w', F> => ({
  s: [[x0, y0], [x1, y0]], e: [[x1, y0], [x1, y1]], n: [[x1, y1], [x0, y1]], w: [[x0, y1], [x0, y0]],
})

/** A pointed arch outline: width w centred at s, from z0, springing at zs (arcs of radius 0.8 w). */
function pointed(s: number, w: number, z0: number, zs: number, seg = 5): [number, number][] {
  const r = w * 0.8, th = Math.acos((w / 2 - r) / r), cl = s - w / 2 + r, cr = s + w / 2 - r
  const pts: [number, number][] = [[s - w / 2, z0], [s + w / 2, z0]]
  for (let i = 0; i <= seg; i++) { const a = (i / seg) * (Math.PI - th); pts.push([cr + r * Math.cos(a), zs + r * Math.sin(a)]) }
  for (let i = 1; i <= seg; i++) { const a = th + (i / seg) * (Math.PI - th); pts.push([cl + r * Math.cos(a), zs + r * Math.sin(a)]) }
  return pts
}
const circle = (s: number, z: number, r: number, n = 14): [number, number][] =>
  Array.from({ length: n }, (_, i) => [s + r * Math.cos((i / n) * Math.PI * 2), z + r * Math.sin((i / n) * Math.PI * 2)] as [number, number])
const L = (f: F) => Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])
/** A lancet with a sandstone surround. */
function lancet(f: F, s: number, w: number, z0: number, zs: number, p: Part = win) {
  onWall(trim, f[0], f[1], pointed(s, w + 0.4, z0 - 0.2, zs), 0.03)
  onWall(p, f[0], f[1], pointed(s, w, z0, zs), 0.06)
}

/**
 * A gabled range: walls from 0 to the eaves, gable walls at both ends, and a
 * slate roof striped grey, red, grey. `axis` is the ridge's direction.
 */
function range(x0: number, x1: number, y0: number, y1: number, eave: number, ridge: number, axis: 'x' | 'y', ends: [boolean, boolean] = [true, true]) {
  box(stone, x0, x1, y0, y1, 0, eave, null, 0)
  const o = 0.5
  // in the range's own coordinates: u along the ridge, v across it
  const P = (u: number, v: number, z: number): V3 => (axis === 'x' ? [u, v, z] : [v, u, z])
  const [u0, u1, v0, v1] = axis === 'x' ? [x0, x1, y0, y1] : [y0, y1, x0, x1]
  const vm = (v0 + v1) / 2, half = (v1 - v0) / 2 + o, rise = ridge - eave, lo = eave - (o * rise) / ((v1 - v0) / 2)
  const bands: [number, Part][] = [[0, slate], [0.45, red], [0.72, slate], [1, slate]]
  for (const side of [-1, 1]) {
    for (let k = 0; k < bands.length - 1; k++) {
      const t0 = bands[k][0], t1 = bands[k + 1][0]
      const va = vm + side * half * (1 - t0), vb = vm + side * half * (1 - t1)
      const za = lo + (ridge - lo) * t0, zb = lo + (ridge - lo) * t1
      const a = P(u0 - 0.3, va, za), b = P(u1 + 0.3, va, za), c = P(u1 + 0.3, vb, zb), d = P(u0 - 0.3, vb, zb)
      const q = [a, b, c, d]
      // wind it to face up and out
      const n = [(b[1] - a[1]) * (d[2] - a[2]) - (b[2] - a[2]) * (d[1] - a[1]), (b[2] - a[2]) * (d[0] - a[0]) - (b[0] - a[0]) * (d[2] - a[2]), (b[0] - a[0]) * (d[1] - a[1]) - (b[1] - a[1]) * (d[0] - a[0])]
      const p = bands[k][1]
      if (n[2] > 0) p.quad(q[0], q[1], q[2], q[3]); else p.quad(q[3], q[2], q[1], q[0])
    }
  }
  // the soffit
  const s0 = P(u0 - 0.3, vm - half, lo), s1 = P(u1 + 0.3, vm - half, lo), s2 = P(u1 + 0.3, vm + half, lo), s3 = P(u0 - 0.3, vm + half, lo)
  if (axis === 'x') slate.quad(s0, s3, s2, s1); else slate.quad(s0, s1, s2, s3)
  // the gable walls and their sandstone copings
  for (const [i, u] of [[0, u0], [1, u1]] as [number, number][]) {
    if (!ends[i]) continue
    const A = P(u, v0, eave), B = P(u, v1, eave), C = P(u, vm, ridge + 0.9)
    const outward = i === 0 ? -1 : 1
    const n = axis === 'x' ? [outward, 0, 0] : [0, outward, 0]
    const tri = (p: Part, a: V3, b: V3, c: V3) => {
      const cr = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
      const nx = (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), ny = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2])
      void cr
      if (nx * n[0] + ny * n[1] > 0) p.tri(a, b, c); else p.tri(a, c, b)
    }
    tri(stone, A, B, C)
    // the coping: a band 0.6 m deep along each rake, standing 0.35 off the gable
    for (const [E, sgn] of [[A, -1], [B, 1]] as [V3, number][]) {
      void sgn
      const d = 0.35 * outward
      const off = (p: V3): V3 => (axis === 'x' ? [p[0] + d, p[1], p[2]] : [p[0], p[1] + d, p[2]])
      const back = (p: V3): V3 => (axis === 'x' ? [p[0] - 0.3 * outward, p[1], p[2]] : [p[0], p[1] - 0.3 * outward, p[2]])
      const up = (p: V3, h: number): V3 => [p[0], p[1], p[2] + h]
      const e0 = up(E, 0.25), c0 = up(C, 0.25)
      // outer face and top
      tri(trim, off(e0), off(c0), off(up(C, -0.45)))
      tri(trim, off(e0), off(up(C, -0.45)), off(up(E, -0.45)))
      const top = [off(e0), back(e0), back(c0), off(c0)]
      const nz = (top[1][0] - top[0][0]) * (top[2][1] - top[0][1]) - (top[1][1] - top[0][1]) * (top[2][0] - top[0][0])
      if (nz > 0) trim.quad(top[0], top[1], top[2], top[3]); else trim.quad(top[3], top[2], top[1], top[0])
    }
  }
}

/** An octagonal pinnacle with a stone shaft and a sandstone spirelet. */
function pinnacle(c: XY, r: number, z0: number, z1: number, tip: number) {
  revolve(stone, c, [[r, z0], [r, z1]], 8, Math.PI / 8, true, false)
  revolve(trim, c, [[r + 0.12, z1], [r + 0.12, z1 + 0.35], [0, tip]], 8, Math.PI / 8, true, false)
}

// ── Main body: the nave and chancel, the transept ──
const NX0 = -9.5, NX1 = 30, NY0 = -11, NY1 = 9, EAVE = 16.5, RIDGE = 22.2
const TX0 = 5, TX1 = 27, TY0 = -15, TY1 = 13
range(NX0, NX1, NY0, NY1, EAVE, RIDGE, 'x', [false, true])
range(TX0, TX1, TY0, TY1, EAVE - 0.5, RIDGE + 0.2, 'y')
// the rose-window gables: east (Dartmouth Street) and the transept ends
{
  const E = faces(NX0, NX1, NY0, NY1).e, mid = (NY1 - NY0) / 2
  onWall(trim, E[0], E[1], pointed(mid, 11, 5.0, 13.3), 0.03)
  onWall(stone, E[0], E[1], pointed(mid, 10.2, 5.4, 13.3), 0.05)
  onWall(trim, E[0], E[1], circle(mid, 17.0, 3.45, 16), 0.07)
  onWall(win, E[0], E[1], circle(mid, 17.0, 3.0, 16), 0.1)
  for (let k = -2; k <= 2; k++) lancet(E, mid + k * 1.75, 1.1, 6.2, 12.6)
  for (const d of [-7.6, 7.6]) lancet(E, mid + d, 1.3, 4.5, 9.0)
  for (const d of [-7.6, 7.6]) lancet(E, mid + d, 1.0, 11.0, 13.8)
  const T = faces(TX0, TX1, TY0, TY1)
  for (const f of [T.s, T.n]) {
    const m = L(f) / 2
    onWall(trim, f[0], f[1], pointed(m, 9.4, 9.0, 13.2), 0.03)
    onWall(stone, f[0], f[1], pointed(m, 8.6, 9.4, 13.2), 0.05)
    onWall(trim, f[0], f[1], circle(m, 16.6, 2.9, 16), 0.07)
    onWall(win, f[0], f[1], circle(m, 16.6, 2.5, 16), 0.1)
    for (let k = -3; k <= 2; k++) lancet(f, m + (k + 0.5) * 1.35, 0.85, 10.0, 12.6)
    for (const d of [-7.5, 7.5]) lancet(f, m + d, 1.4, 4.0, 9.5)
    for (const d of [-3.2, 3.2]) lancet(f, m + d, 1.4, 3.5, 7.0)
  }
  // the nave and chancel side walls
  const N = faces(NX0, NX1, NY0, NY1)
  for (const x of [-2.5, 1.5, 28.5]) lancet(N.n, NX1 - x, 1.3, 9.8, 14.2) // north nave and chancel
  lancet(N.s, 28.5 - NX0, 1.3, 11.0, 14.4) // chancel south, over the corner porch
  for (const s of [7.5, 11.5]) lancet(N.s, s, 1.3, 11.0, 14.5) // nave south, over the porch
}
// gable-corner pinnacles
for (const y of [NY0, NY1]) pinnacle([NX1 + 0.1, y + (y < 0 ? 0.1 : -0.1)], 0.75, 0, 18.2, 22.0)
for (const x of [TX0, TX1]) for (const y of [TY0, TY1]) pinnacle([x + (x < 10 ? 0.1 : -0.1), y + (y < 0 ? 0.1 : -0.1)], 0.7, 0, 17.4, 21.2)
// a cross on each gable
for (const [c, ax] of [[[NX1 + 0.3, -1], 'x'], [[16, TY0 - 0.3], 'y'], [[16, TY1 + 0.3], 'y']] as [XY, 'x' | 'y'][]) {
  box(trim, c[0] - 0.15, c[0] + 0.15, c[1] - 0.15, c[1] + 0.15, RIDGE + 0.9, RIDGE + 3.0, trim, 0)
  if (ax === 'x') box(trim, c[0] - 0.15, c[0] + 0.15, c[1] - 0.6, c[1] + 0.6, RIDGE + 2.0, RIDGE + 2.3, trim, 0)
  else box(trim, c[0] - 0.6, c[0] + 0.6, c[1] - 0.15, c[1] + 0.15, RIDGE + 2.0, RIDGE + 2.3, trim, 0)
}

// ── The lantern over the crossing ──
{
  const C: XY = [16, -1], n = 12, R = 3.3
  const ring = (r: number): XY[] => Array.from({ length: n }, (_, i) => [C[0] + r * Math.cos((i / n) * Math.PI * 2), C[1] + r * Math.sin((i / n) * Math.PI * 2)] as XY)
  const rg = ring(R)
  wall(cu, rg, RIDGE - 1.5, 25.6)
  for (let i = 0; i < n; i++) {
    const a = rg[i], b = rg[(i + 1) % n], w = Math.hypot(b[0] - a[0], b[1] - a[1])
    // wound outward: the ring runs counter-clockwise, so b→a has the outside on its right
    onWall(red, a, b, pointed(w / 2, w * 0.72, 22.6, 24.3, 4), 0.04)
    onWall(cu, a, b, [[0, 25.6], [w, 25.6], [w / 2, 27.0]], 0.02) // the gablets
  }
  revolve(cu, C, [[R - 0.1, 25.6], [R + 0.15, 26.2], [R + 0.05, 27.1], [2.6, 28.2], [1.5, 29.3], [0.5, 29.9], [0.35, 30.1]], 12, 0, false, false)
  revolve(cu, C, [[0.35, 30.1], [0.5, 30.4], [0.35, 30.7], [0.1, 30.8], [0.06, 31.6], [0, 31.8]], 8, 0, true, false)
}

// ── The campanile ──
const TC: XY = [-8.75, -10.5], H = 3.85
const sq = (h: number, z0: number, z1: number, p: Part, top: Part | null = p, bev = 0.15) => box(p, TC[0] - h, TC[0] + h, TC[1] - h, TC[1] + h, z0, z1, top, bev)
sq(H, 0, 39.4, stone, null, 0.2)
for (const z of [6, 12.5, 19, 25.5, 31.5]) sq(H + 0.04, z, z + 0.9, trim, null, 0) // the banded courses
sq(H + 0.4, 38.6, 40.4, trim, trim, 0.25) // corbelled ledge
sq(H + 0.1, 40.4, 51.8, stone, null, 0)
for (const z of [41.2, 50.2]) sq(H + 0.14, z, z + 0.7, trim, null, 0)
sq(H + 0.4, 51.8, 53.6, stone, slate, 0.2) // the corbel-table parapet
sq(H + 0.44, 52.0, 52.6, trim, null, 0)
{
  const T = faces(TC[0] - H, TC[0] + H, TC[1] - H, TC[1] + H)
  const Bf = faces(TC[0] - H - 0.1, TC[0] + H + 0.1, TC[1] - H - 0.1, TC[1] + H + 0.1)
  for (const f of [Bf.s, Bf.e, Bf.n, Bf.w]) {
    for (const k of [-1, 0, 1]) {
      onWall(trim, f[0], f[1], pointed(H + 0.1 + k * 2.3, 2.15, 42.0, 47.6), 0.03)
      onWall(slate, f[0], f[1], pointed(H + 0.1 + k * 2.3, 1.75, 42.2, 47.6), 0.07)
    }
  }
  for (const f of [T.s, T.e, T.n, T.w]) {
    // the belfry: three pointed arches on colonnettes, dark inside
    // the paired lancets under the ledge and a single one lower down
    for (const d of [-0.8, 0.8]) lancet(f, H + d, 0.75, 34.0, 37.3)
    lancet(f, H, 0.9, 22.0, 25.0)
  }
  // the door on Boylston Street
  onWall(trim, T.s[0], T.s[1], pointed(H, 2.4, 1.4, 4.6), 0.03)
  onWall(slate, T.s[0], T.s[1], pointed(H, 1.8, 1.4, 4.6), 0.07)
}
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const c: XY = [TC[0] + sx * (H - 0.2), TC[1] + sy * (H - 0.2)]
  box(stone, c[0] - 0.5, c[0] + 0.5, c[1] - 0.5, c[1] + 0.5, 53.6, 55.4, null, 0.1)
  pyramid(trim, c, 0.55, 55.4, 57.4)
}
// the spire: grey slate with a red band, and the finial
{
  const s = (z: number) => 3.45 * (67.6 - z) / (67.6 - 53.6)
  const frust = (p: Part, z0: number, z1: number) => {
    const a = s(z0), b = s(z1), r0 = a * Math.SQRT2, r1 = b * Math.SQRT2
    revolve(p, TC, [[r0, z0], [r1, z1]], 4, Math.PI / 4, true, false)
  }
  frust(slate, 53.6, 58.6)
  frust(red, 58.6, 61.0)
  frust(slate, 61.0, 64.6)
  revolve(cu, TC, [[s(64.6) * Math.SQRT2, 64.6], [0, 67.6]], 4, Math.PI / 4, true, false)
  revolve(cu, TC, [[0.12, 67.4], [0.28, 68.3], [0.12, 69.2], [0.1, 73.2], [0, 73.3]], 6, 0, true, false)
  box(cu, TC[0] - 0.08, TC[0] + 0.08, TC[1] - 0.7, TC[1] + 0.7, 71.6, 71.9, cu, 0)
}

// ── The porches ──
// between the tower and the transept: a low arcaded porch on Boylston Street
box(stone, -4.9, TX0, -15, NY0, 0, 9.0, red, 0.25)
{
  const f: F = [[-4.9, -15], [TX0, -15]]
  for (let k = 0; k < 3; k++) {
    const s = 1.65 + k * 3.3
    onWall(trim, f[0], f[1], pointed(s, 2.6, 1.4, 5.6), 0.03)
    onWall(slate, f[0], f[1], pointed(s, 2.1, 1.4, 5.6), 0.07)
  }
}
// the corner porch at Boylston and Dartmouth: two gabled arches
box(stone, 24.6, 30.6, -18.2, -11, 0, 6.6, null, 0.2)
{
  // a cross-gabled roof: one gable to Boylston Street, one to Dartmouth Street
  gableRoof(slate, stone, 24.6, 30.6, -18.2, -11, 6.6, 10.3, 'y', 0.3, 0.3)
  gableRoof(slate, stone, 27.6, 30.6, -16.6, -12.6, 6.6, 10.3, 'x', 0.3, 0.3)
  for (const f of [[[24.6, -18.2], [30.6, -18.2]], [[30.6, -18.2], [30.6, -11]]] as F[]) {
    const m = L(f) / 2
    onWall(trim, f[0], f[1], pointed(m, 4.4, 1.4, 4.6), 0.03)
    onWall(slate, f[0], f[1], pointed(m, 3.6, 1.4, 4.6), 0.07)
    onWall(trim, f[0], f[1], circle(m, 8.0, 0.8, 10), 0.03)
  }
}
// the north annex by the chancel
box(stone, 24.3, 30, NY1, 13.8, 0, 9.2, slate, 0.2)

// ── The west block and the parish house ──
{
  // the parish building between the parish house and the tower: four storeys under a slate mansard
  const x0 = -23, x1 = NX0, y0 = -12.8, y1 = 12.5, z0 = 19.2, z1 = 23.4, i = 1.8
  box(stone, x0, x1, y0, y1, 0, z0, null, 0.2)
  box(trim, x0 - 0.15, x1, y0 - 0.15, y1 + 0.15, z0 - 0.5, z0, null, 0)
  const A: V3 = [x0, y0, z0], B: V3 = [x1, y0, z0], C: V3 = [x1, y1, z0], D: V3 = [x0, y1, z0]
  const a: V3 = [x0 + i, y0 + i, z1], b: V3 = [x1 - 0.2, y0 + i, z1], c: V3 = [x1 - 0.2, y1 - i, z1], d: V3 = [x0 + i, y1 - i, z1]
  slate.quad(A, B, b, a); slate.quad(C, D, d, c); slate.quad(D, A, a, d)
  capPoly(slate, [[a[0], a[1]], [b[0], b[1]], [c[0], c[1]], [d[0], d[1]]], z1, true)
  const S: F = [[x0, y0], [x1, y0]]
  for (const s of [2.6, 6.8, 11.0]) {
    box(stone, x0 + s - 0.9, x0 + s + 0.9, y0 + 0.3, y0 + 1.6, z0, 21.8, null, 0)
    gableRoof(slate, stone, x0 + s - 1.0, x0 + s + 1.0, y0 + 0.2, y0 + 1.7, 21.8, 22.9, 'y', 0.1, 0.1)
    onWall(win, [x0 + s - 0.9, y0 + 0.3], [x0 + s + 0.9, y0 + 0.3], rectShape(0.4, 1.4, z0 + 0.4, 21.4), 0.04)
    for (const z of [6.8, 10.6, 14.4]) onWall(win, S[0], S[1], rectShape(s - 0.7, s + 0.7, z, z + 2.4), 0.05)
  }
  // the big banded Gothic window over the door
  onWall(trim, S[0], S[1], pointed(6.8, 4.6, 1.4, 4.0), 0.03)
  onWall(win, S[0], S[1], pointed(6.8, 3.8, 1.7, 4.0), 0.06)
}
box(stone, -31, -23, 4, 12.5, 0, 23.4, slate, 0.3)
box(stone, -14, -4.5, 7, 12.5, 0, 26.8, slate, 0.3)
box(stone, -31, -23, -14.5, 4, 0, 14.2, null, 0.2)
{
  // the parish house's mansard roof
  const x0 = -31.3, x1 = -22.7, y0 = -14.8, y1 = 4.3, z0 = 14.2, z1 = 18.9, i = 1.6
  const A: V3 = [x0, y0, z0], B: V3 = [x1, y0, z0], C: V3 = [x1, y1, z0], D: V3 = [x0, y1, z0]
  const a: V3 = [x0 + i, y0 + i, z1], b: V3 = [x1 - i, y0 + i, z1], c: V3 = [x1 - i, y1 - i, z1], d: V3 = [x0 + i, y1 - i, z1]
  slate.quad(A, B, b, a); slate.quad(B, C, c, b); slate.quad(C, D, d, c); slate.quad(D, A, a, d)
  capPoly(slate, [[a[0], a[1]], [b[0], b[1]], [c[0], c[1]], [d[0], d[1]]], z1, true)
  const S: F = [[-31, -14.5], [-23, -14.5]]
  for (const s of [1.6, 4.0, 6.4]) for (const z of [4.0, 7.6, 11.0]) onWall(win, S[0], S[1], rectShape(s - 0.6, s + 0.6, z, z + 2.0), 0.05)
  onWall(trim, S[0], S[1], pointed(4.0, 2.6, 1.4, 2.6), 0.03)
  onWall(slate, S[0], S[1], pointed(4.0, 1.8, 1.4, 2.6), 0.07)
  // the west block's north face on the alley
  const Nw: F = [[NX0, 12.5], [-31, 12.5]]
  for (let k = 0; k < 7; k++) for (const z of [3.0, 10.0, 16.5]) onWall(win, Nw[0], Nw[1], rectShape(1.6 + k * 3.0, 2.8 + k * 3.0, z, z + 4.2), 0.05)
}
// a sandstone string course round the nave, chancel and transept
box(trim, NX0, NX1 + 0.12, NY0 - 0.12, NY1 + 0.12, 9.0, 9.6, null, 0)
box(trim, TX0 - 0.12, TX1 + 0.12, TY0 - 0.12, TY1 + 0.12, 9.0, 9.6, null, 0)

const lit = (p: V3) => (p[2] > 30 && Math.hypot(p[0] - TC[0], p[1] - TC[1]) < 6 ? 0.8 : Math.hypot(p[0] - 16, p[1] + 1) < 4 && p[2] > 21 ? 0.6 : 0)
await save('bos-old-south-church', 'Old South Church', [
  { part: stone, material: { ...finish('osc-puddingstone', 0xb09d8c), floodlight: lit } },
  { part: trim, material: { ...finish('osc-sandstone', 0xd4bf9f), floodlight: lit } },
  { part: slate, material: finish('osc-slate', 0x6e7379) },
  { part: red, material: finish('osc-red-slate', 0xa5675d) },
  { part: cu, material: { ...PALETTE.patina, floodlight: lit } },
  { part: win, material: PALETTE.window },
], { height: 73.3, anchor: [42.3502197, -71.0780346], bearing: 339.6 }, 6500)
