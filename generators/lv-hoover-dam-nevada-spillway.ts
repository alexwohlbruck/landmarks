/**
 * Nevada Spillway, Hoover Dam: the side-channel spillway cut into the Nevada
 * abutment upstream of the dam, beside the Hoover Dam parking.
 *
 * The long ogee crest along Lake Mead with its four steel drum gates, each
 * 100 ft (30.5 m) long, between three piers and two end abutments (the
 * downstream one a taller block); the deep concrete channel behind the crest,
 * its far side a battered wall with a parapet; and the channel's run past the
 * crest to the tunnel inlet that drops to the old diversion tunnel. The
 * Arizona Spillway (lv-hoover-dam-arizona-spillway.ts) is its mirror image
 * and builds from the shared `buildSpillway` below, so this generator merges
 * first.
 *
 * Frame: anchor -114.737136, 36.018880 (the middle pier, NAIP), bearing 45°:
 * the model's north runs along the crest to its upstream (north-east) end,
 * the lake is to the east (+x), the channel to the west. The shared builder
 * works in a canonical frame `u` across the crest (lake at -u, channel at +u,
 * u = 0 the crest's top) and y along it; here x = 7 - u (Mapterhorn: the
 * crest top is at x = 6..8 along its whole length). y = 0 is the lowest
 * ground under the model, the bottom of the tunnel inlet (DEM about 325 m).
 *
 * On the terrain. The map's terrain (Mapterhorn, from USGS 3DEP lidar) keeps
 * the crest, the channel and its walls as ground, blurred over 2 m. As for
 * hoover-dam, the model is built on that terrain: the channel's surface is a
 * height field over the DEM table below, at the crisp profile measured from
 * lidar or 1 m over the DEM where the DEM stands higher (its blurred inside
 * corners), so the terrain never shows through; the lake-side and hill-side
 * edges stand 0.2 m under the DEM. Placement `elevation` 0.1 keeps it rigid,
 * where it was built.
 *
 * Sources
 * - OSM: way/30363513 and way/47682188 (NHD waterway and basin "Nevada
 *   Spillway"; no building or man_made outline, so `replaces` is empty),
 *   way/30363515 (the tunnel to the river), way/30366379 (Hoover Dam Parking,
 *   along the channel's lower east side). No road crosses this channel in OSM
 *   and none shows on NAIP: there is no bridge here (the Arizona Spillway's
 *   is the one bridge).
 * - USGS NAIP (public domain): plan, pier positions (y = -34, 0, 34, ±2 m),
 *   crest ends, the battered west wall's rim.
 * - Mapterhorn z15 (the map's terrain, from 3DEP): the crest top 368 m, the
 *   channel floor 353.7 m at its upstream end to 339 m past the crest, the
 *   west wall's foot and rim (378 m), the tunnel inlet. `bun tools/terrain.ts
 *   grid -114.737136 36.01888 150 2 --bearing 45`, 2026-11-20.
 *   https://mapterhorn.com/attribution
 * - USGS 3DEP lidar AZ_LowerColoradoRiver_B1_2018 over the Arizona Spillway
 *   (the same design, see that generator): the crest/ogee profile, the floor
 *   slope, pier tops 379.0 m, the downstream abutment 382.7 m, the wall's
 *   batter (1.95 in 1) and parapet. Used here because Mapterhorn matches it
 *   to 1 m on this crest and floor.
 * - Published (Wikipedia "Hoover Dam", USBR): four 100 × 16 ft (30 × 4.9 m)
 *   drum gates per spillway; the spillways empty into 50 ft (15 m) tunnels.
 * - Photos: "Spillway, Hoover Dam, NV-AZ", w_lemay, CC0
 *   (https://www.flickr.com/photos/59081381@N03/28222786198), the channel
 *   looking upstream: battered wall with coping, rust-brown drum gate, pier;
 *   "Hoover Dam and Arizona Spillway, 1983.jpg", Bureau of Reclamation, public
 *   domain (https://commons.wikimedia.org/wiki/File:Hoover_Dam_and_Arizona_Spillway,_1983.jpg),
 *   both spillways from the Arizona rim; "Boulder Dam, looking upstream
 *   through Nevada spillway channel from point on center line - NARA -
 *   293898", public domain
 *   (https://commons.wikimedia.org/wiki/File:Boulder_Dam,_looking_upstream_through_Nevada_spillway_channel_from_point_on_center_line_-_NARA_-_293898.jpg).
 *
 * Measured: the plan (NAIP), every height above (Mapterhorn, or the Arizona
 * lidar where marked). Published: the gate length. Estimated: the pier plan
 * (3.5 m wide, rounded nose 3 m upstream of the crest, from the 1983 photo
 * and the Arizona lidar), the drum gates drawn as the crest's own curve in
 * steel, the parapet (1.3 m), the dark tunnel inlet's extent (where the DEM
 * is flat at 349–350 m, y -80..-108, and the bowl beyond).
 * Doubts: the pier positions are from NAIP only (no lidar here), ±2 m. The
 * DEM's flat at 349–350 m past the crest is unexplained (the shaft mouth, a
 * cover, or interpolation); the model follows it. OSM's basin polygon
 * (natural=water, intermittent) may draw water in the channel.
 */
import { Part, cross, sub, type MaterialSpec, type V3, writeGlb } from './mesh'
import { PALETTE, finish } from './palette'

// ---- shared spillway builder ------------------------------------------------

export type Dem = { x0: number; z0: number; step: number; rows: string[] }

export type Site = {
  name: string
  /** Model x = s·u + off. */
  s: 1 | -1
  off: number
  dem: Dem
  /** The middle pier along y; the others are 33.75 m either side. */
  c: number
  /** Where the floor ends at the upstream (north-east) end. */
  yFloorNE: number
  /** Where the channel ends downstream, past the crest. */
  yEnd: number
  /** The far wall's foot across the channel. */
  wallFoot: (y: number) => number
  /** Past the crest's downstream end: the near wall's foot and its batter. */
  nearFoot: number
  nearBatter: number
  /** The tunnel inlet, drawn dark: from y0 down to y1, below z. */
  inlet: { y0: number; y1: number; z: number }
  bridge?: { u0: number; u1: number; y: number; width: number; spring: [number, number]; springZ: number; crownZ: number }
}

/** The road and parking level along the channel's top (lidar 377.6–377.8 m). */
const TOP = 377.7
const PARAPET = 1.3
const PIER_TOP = 379.0
const TOWER_TOP = 382.7
const BATTER = 1.95
const END_BATTER = 2.7
const FOOT = 0.2
const LIFT = 1.0
/** Pier centres from the middle one, and the end abutments' faces (gates 30.5 m, piers 3.5 m). */
const PIERS = [-33.75, 0, 33.75]
const END = 66
const PIER_W = 3.5

/** The crest and ogee, height against u (Arizona lidar averaged along the crest). */
const OGEE: [number, number][] = [
  [-6, 363.8], [-4, 366.3], [-2, 368.1], [0, 368.1], [2, 367.8], [4, 367.2], [6, 365.9], [8, 364.1],
  [10, 362.6], [12, 360.3], [14, 357.5], [16, 354.5], [18, 351.5], [20, 348.5], [22, 345], [24, 341.5],
  [26, 338], [28, 334.5], [32, 327.5],
]
function ogee(u: number): number {
  if (u < -6.5) return -Infinity
  if (u <= OGEE[0][0]) return OGEE[0][1]
  for (let i = 1; i < OGEE.length; i++) {
    const [u0, h0] = OGEE[i - 1], [u1, h1] = OGEE[i]
    if (u <= u1) return h0 + ((h1 - h0) * (u - u0)) / (u1 - u0)
  }
  return OGEE[OGEE.length - 1][1]
}
/** The channel floor (lidar): 353.8 m at y 58 to 339.4 m at y -62, held past the ends. */
const floorAt = (y: number) => 346.85 + 0.12 * y

const linspace = (a: number, b: number, n: number) => Array.from({ length: n }, (_, i) => a + ((b - a) * i) / (n - 1))
const norm = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

/** Draws into a Part in the canonical frame, mirrored to the model's. */
class Mirror {
  constructor(readonly part: Part, readonly s: number, readonly off: number) {}
  p = (a: V3): V3 => [this.s * a[0] + this.off, a[1], a[2]]
  tri(a: V3, b: V3, c: V3) {
    if (this.s > 0) this.part.tri(this.p(a), this.p(b), this.p(c))
    else this.part.tri(this.p(a), this.p(c), this.p(b))
  }
  quad(a: V3, b: V3, c: V3, d: V3) { this.tri(a, b, c); this.tri(a, c, d) }
  smooth(a: V3, b: V3, c: V3, n: V3[]) {
    const m = n.map((v): V3 => [this.s * v[0], v[1], v[2]])
    this.part.tri(this.p(a), this.p(b), this.p(c), undefined, undefined, undefined, m)
  }
}

export function buildSpillway(site: Site) {
  const { s, off, dem, c } = site
  const ROWS = dem.rows.map(r => r.split(' ').map(v => Number(v) / 10))
  /** The map's ground at canonical (u, y). */
  const ground = (u: number, y: number) => {
    const x = s * u + off
    const fx = Math.min(Math.max((x - dem.x0) / dem.step, 0), ROWS[0].length - 1.0001)
    const fz = Math.min(Math.max((-y - dem.z0) / dem.step, 0), ROWS.length - 1.0001)
    const i = Math.floor(fx), j = Math.floor(fz), tx = fx - i, tz = fz - j
    return (ROWS[j][i] * (1 - tx) + ROWS[j][i + 1] * tx) * (1 - tz) + (ROWS[j + 1][i] * (1 - tx) + ROWS[j + 1][i + 1] * tx) * tz
  }
  const yNE = c + END, ySW = c - END
  const wallFoot = (y: number) => site.wallFoot(Math.max(y, -60))

  /** The structure's crisp top at (u, y): crest and ogee, floor, walls; TOP where it meets the road. */
  function crisp(u: number, y: number): number {
    const F = floorAt(Math.min(Math.max(y, site.yEnd), site.yFloorNE))
    const k = END_BATTER / BATTER
    const d = Math.hypot(Math.max(0, u - wallFoot(y)), Math.max(0, y - site.yFloorNE) * k, Math.max(0, site.yEnd - y) * k)
    const wall = F + BATTER * d
    const near = y >= ySW ? ogee(u) : F + site.nearBatter * Math.max(0, site.nearFoot - u)
    if (near === -Infinity) return -Infinity
    return Math.min(Math.max(near, wall), TOP)
  }
  type Vx = { p: V3; off: boolean; n: V3; h: number }
  function vertex(u: number, y: number): Vx {
    const h = crisp(u, y), g = ground(u, y)
    if (h === -Infinity) return { p: [u, y, g - FOOT], off: true, n: [0, 0, 0], h }
    if (h >= TOP - 0.01) return { p: [u, y, TOP], off: true, n: [0, 0, 0], h }
    return { p: [u, y, Math.max(h, g + LIFT)], off: false, n: [0, 0, 0], h }
  }
  /** The drawn surface's height, for footing piers and gates on it. */
  const surface = (u: number, y: number) => vertex(u, y).p[2]

  const CONCRETE: MaterialSpec = finish('hoover-concrete', 0xe9dfcd)
  const FLOOR: MaterialSpec = finish('spillway-floor', 0xd3c8b4)
  const GATE: MaterialSpec = PALETTE.metal
  const INLET: MaterialSpec = finish('tunnel-inlet', 0x4a4f57)
  const conc = new Mirror(new Part(), s, off), floor = new Mirror(new Part(), s, off)
  const gate = new Mirror(new Part(), s, off), inlet = new Mirror(new Part(), s, off)

  // ---- the channel: a height field, row by row along y -----------------------
  /** Stations across the channel in one row: lake foot, crest and ogee (or the near wall), floor, far wall. */
  function stationsAt(y: number): number[] {
    const F = floorAt(Math.min(Math.max(y, site.yEnd), site.yFloorNE))
    const uf = Math.max(wallFoot(y), 0)
    const ut = uf + (TOP - F) / BATTER
    let head: number[]
    if (y >= ySW) {
      let uo = -6
      while (uo < uf - 1 && ogee(uo + 0.25) > F) uo += 0.25
      head = [-8.5, ...linspace(-6, uo, 12)]
    } else {
      const top = site.nearFoot - (TOP - F) / site.nearBatter
      head = [top - 3, ...linspace(top, site.nearFoot, 12)]
    }
    const uo = head[head.length - 1]
    const fl = linspace(uo, Math.max(uf, uo + 1), 3).slice(1)
    const wl = linspace(fl[fl.length - 1], Math.max(ut, fl[fl.length - 1] + 1), 4).slice(1)
    return [...head, ...fl, ...wl]
  }
  const ys: number[] = []
  const yTopNE = site.yFloorNE + (TOP - floorAt(site.yFloorNE)) / END_BATTER + 1.5
  const yTopSW = site.yEnd - (TOP - floorAt(site.yEnd)) / END_BATTER - 1.5
  for (let y = yTopNE; y > ySW + 0.1; y -= 4) ys.push(y)
  ys.push(ySW)
  for (let y = ySW - 4.5; y > yTopSW; y -= 4) ys.push(y)
  ys.push(yTopSW)
  const grid = ys.map(y => stationsAt(y).map(u => vertex(u, y)))

  const tris: [Vx, Vx, Vx][] = []
  for (let i = 0; i + 1 < grid.length; i++)
    for (let j = 0; j + 1 < grid[i].length; j++) {
      const a = grid[i][j], b = grid[i][j + 1], cc = grid[i + 1][j + 1], d = grid[i + 1][j]
      tris.push([a, d, cc], [a, cc, b])
    }
  const faceN = (t: [Vx, Vx, Vx]) => norm(cross(sub(t[1].p, t[0].p), sub(t[2].p, t[0].p)))
  for (const t of tris) {
    const n = faceN(t)
    for (const v of t) for (let k = 0; k < 3; k++) v.n[k] += n[k]
  }
  for (const t of tris) {
    if (t.every(v => v.off)) continue
    const fn = faceN(t)
    // Smooth across the ogee's curve, crisp at the floor's and walls' creases.
    const ns = t.map(v => { const n = norm(v.n); return n[0] * fn[0] + n[1] * fn[1] + n[2] * fn[2] > 0.92 ? n : fn })
    const y = (t[0].p[1] + t[1].p[1] + t[2].p[1]) / 3
    const z = (t[0].p[2] + t[1].p[2] + t[2].p[2]) / 3
    const F = floorAt(Math.min(Math.max(y, site.yEnd), site.yFloorNE))
    const target = y <= site.inlet.y0 && y >= site.inlet.y1 && z < site.inlet.z ? inlet
      : t.every(v => !v.off && v.p[2] < F + LIFT + 0.6) && fn[2] > 0.97 ? floor : conc
    target.smooth(t[0].p, t[1].p, t[2].p, ns)
  }

  // ---- footed blocks ---------------------------------------------------------
  /** Walls from the drawn surface (0.3 m under it) up to z1 around a plan, counter-clockwise, and a top. */
  function block(m: Mirror, plan: [number, number][], z1: number, top = true) {
    for (let i = 0; i < plan.length; i++) {
      const a = plan[i], b = plan[(i + 1) % plan.length]
      const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 2.5))
      for (let k = 0; k < n; k++) {
        const p = [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]
        const q = [a[0] + ((b[0] - a[0]) * (k + 1)) / n, a[1] + ((b[1] - a[1]) * (k + 1)) / n]
        const zp = Math.min(surface(p[0], p[1]) - 0.3, z1 - 0.5), zq = Math.min(surface(q[0], q[1]) - 0.3, z1 - 0.5)
        m.quad([p[0], p[1], zp], [q[0], q[1], zq], [q[0], q[1], z1], [p[0], p[1], z1])
      }
    }
    if (top) {
      const cx = plan.reduce((t, p) => t + p[0], 0) / plan.length, cy = plan.reduce((t, p) => t + p[1], 0) / plan.length
      for (let i = 0; i < plan.length; i++) {
        const a = plan[i], b = plan[(i + 1) % plan.length]
        m.tri([cx, cy, z1], [a[0], a[1], z1], [b[0], b[1], z1])
      }
    }
  }
  const box = (u0: number, u1: number, y0: number, y1: number): [number, number][] => [[u0, y0], [u1, y0], [u1, y1], [u0, y1]]

  // Piers: a rounded nose to the lake, flat-topped, standing 11 m over the crest.
  for (const dy of PIERS) {
    const y = c + dy, r = PIER_W / 2
    const plan: [number, number][] = [[4.5, y - r], [4.5, y + r]]
    for (let k = 0; k <= 8; k++) {
      const a = Math.PI / 2 + (Math.PI * k) / 8
      plan.push([-3 + r * Math.cos(a), y + r * Math.sin(a)])
    }
    block(conc, plan, PIER_TOP)
    block(conc, box(-2.2, 3.7, y - r - 0.25, y + r + 0.25), PIER_TOP + 0.6)
  }
  // End abutments: the upstream one at the road, the downstream one a taller block (lidar 382.7 m).
  block(conc, box(-6.5, 7, yNE, yNE + 4), PIER_TOP)
  block(conc, box(-6.5, 7, ySW - 4.5, ySW), PIER_TOP)
  block(conc, box(-3.5, 3.5, ySW - 4, ySW - 0.5), TOWER_TOP)

  // Drum gates: the crest's curve in steel between the piers, 0.15 m proud of it.
  const faces = [ySW, ...PIERS.flatMap(dy => [c + dy - PIER_W / 2, c + dy + PIER_W / 2]), yNE]
  for (let g = 0; g < 4; g++) {
    const y0 = faces[2 * g], y1 = faces[2 * g + 1]
    const us = [-5, -3.5, -2, 0, 2, 4, 6]
    const yy = linspace(y0, y1, 7)
    for (let i = 0; i + 1 < yy.length; i++)
      for (let j = 0; j + 1 < us.length; j++) {
        const at = (u: number, y: number): V3 => [u, y, surface(u, y) + 0.15]
        gate.quad(at(us[j], yy[i]), at(us[j + 1], yy[i]), at(us[j + 1], yy[i + 1]), at(us[j], yy[i + 1]))
      }
  }

  // Parapets along the walls' tops: the far wall, and the near wall past the crest.
  const parapet = (pts: [number, number][], outward: number) => {
    for (let i = 0; i + 1 < pts.length; i++) {
      const [ua, ya] = pts[i], [ub, yb] = pts[i + 1]
      const t = 0.6 * outward
      const A: V3 = [ua, ya, TOP - 0.3], B: V3 = [ub, yb, TOP - 0.3]
      const A1: V3 = [ua, ya, TOP + PARAPET], B1: V3 = [ub, yb, TOP + PARAPET]
      const A2: V3 = [ua + t, ya, TOP + PARAPET], B2: V3 = [ub + t, yb, TOP + PARAPET]
      const A3: V3 = [ua + t, ya, TOP - 0.3], B3: V3 = [ub + t, yb, TOP - 0.3]
      const q = (a: V3, b: V3, cc: V3, d: V3) => (outward > 0 ? conc.quad(a, b, cc, d) : conc.quad(d, cc, b, a))
      q(A, B, B1, A1) // facing the channel
      q(A1, B1, B2, A2) // top
      q(B3, A3, A2, B2) // facing away
    }
  }
  const far: [number, number][] = []
  for (let y = site.yFloorNE; y > site.yEnd; y -= 6) {
    const F = floorAt(Math.min(y, site.yFloorNE))
    far.push([wallFoot(y) + (TOP - F) / BATTER, y])
  }
  far.push([wallFoot(site.yEnd) + (TOP - floorAt(site.yEnd)) / BATTER, site.yEnd])
  parapet(far, 1)
  const near: [number, number][] = []
  for (let y = ySW - 4.5; y > site.yEnd; y -= 6) near.push([site.nearFoot - (TOP - floorAt(y)) / site.nearBatter, y])
  near.push([site.nearFoot - (TOP - floorAt(site.yEnd)) / site.nearBatter, site.yEnd])
  parapet(near, -1)

  // ---- the road bridge (Arizona) ----------------------------------------------
  const b = site.bridge
  if (b) {
    const half = b.width / 2, y0 = b.y - half, y1 = b.y + half
    const DECK = TOP - 0.3, SOFFIT = TOP - 1.4
    // The deck slab, its top 0.3 m under the map's roadway.
    const slab = (u0: number, u1: number, z0: number, z1: number, ya: number, yb: number) => {
      const P = (u: number, y: number, z: number): V3 => [u, y, z]
      conc.quad(P(u0, ya, z1), P(u1, ya, z1), P(u1, yb, z1), P(u0, yb, z1))
      conc.quad(P(u0, yb, z0), P(u1, yb, z0), P(u1, ya, z0), P(u0, ya, z0))
      conc.quad(P(u0, ya, z0), P(u1, ya, z0), P(u1, ya, z1), P(u0, ya, z1))
      conc.quad(P(u1, yb, z0), P(u0, yb, z0), P(u0, yb, z1), P(u1, yb, z1))
      conc.quad(P(u1, ya, z0), P(u1, yb, z0), P(u1, yb, z1), P(u1, ya, z1))
      conc.quad(P(u0, yb, z0), P(u0, ya, z0), P(u0, ya, z1), P(u0, yb, z1))
    }
    slab(b.u0, b.u1, SOFFIT, DECK, y0, y1)
    // Parapets on its edges.
    slab(b.u0, b.u1, DECK, TOP + 1.1, y0, y0 + 0.45)
    slab(b.u0, b.u1, DECK, TOP + 1.1, y1 - 0.45, y1)
    // The arch: a circular segment from springing to springing, 1.3 m deep.
    const [sa, sb] = b.spring, mid = (sa + sb) / 2, halfSpan = (sb - sa) / 2
    const rise = b.crownZ - b.springZ
    const R = (halfSpan * halfSpan + rise * rise) / (2 * rise), cz = b.crownZ - R
    const th = Math.asin(halfSpan / R), N = 14, T = 1.3
    const ring = linspace(-th, th, N + 1).map(a => ({ a, iu: mid + R * Math.sin(a), iz: cz + R * Math.cos(a), eu: mid + (R + T) * Math.sin(a), ez: cz + (R + T) * Math.cos(a) }))
    const ay0 = y0 + 0.3, ay1 = y1 - 0.3
    for (let i = 0; i < N; i++) {
      const p = ring[i], q = ring[i + 1]
      conc.quad([p.iu, ay1, p.iz], [q.iu, ay1, q.iz], [q.iu, ay0, q.iz], [p.iu, ay0, p.iz]) // intrados, facing down
      conc.quad([p.eu, ay0, p.ez], [q.eu, ay0, q.ez], [q.eu, ay1, q.ez], [p.eu, ay1, p.ez]) // extrados
      conc.quad([p.iu, ay0, p.iz], [q.iu, ay0, q.iz], [q.eu, ay0, q.ez], [p.eu, ay0, p.ez]) // faces
      conc.quad([q.iu, ay1, q.iz], [p.iu, ay1, p.iz], [p.eu, ay1, p.ez], [q.eu, ay1, q.ez])
    }
    // Spandrel columns from the arch to the deck, the openings between them open.
    const extrados = (u: number) => cz + Math.sqrt(Math.max(0, (R + T) ** 2 - (u - mid) ** 2))
    for (let u = sa + 1.6; u < sb - 1; u += 3.8) {
      const w = 1.1, zb = Math.min(extrados(u - w / 2), extrados(u + w / 2)) - 0.3
      if (zb > SOFFIT - 0.8) continue
      slab(u - w / 2, u + w / 2, zb, SOFFIT + 0.05, ay0, ay1)
    }
    // The abutments: solid from the channel's walls up to the deck at each end.
    block(conc, box(b.u0, sa + 1.2, ay0, ay1), SOFFIT + 0.05, false)
    block(conc, box(sb - 1.2, b.u1, ay0, ay1), SOFFIT + 0.05, false)
  }

  // ---- out -----------------------------------------------------------------
  const parts = [
    { part: conc.part, material: CONCRETE },
    { part: floor.part, material: FLOOR },
    { part: gate.part, material: GATE },
    { part: inlet.part, material: INLET },
  ].filter(({ part }) => part.triangles)
  // y = 0 at the lowest point: the lowest ground the model stands on.
  let low = Infinity
  for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) low = Math.min(low, part.pos[i])
  for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) part.pos[i] -= low
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  console.log(`${site.name}: base ${low.toFixed(2)} m; ` + parts.map(({ part, material }) => `${material.name} ${part.triangles}`).join(', '))
  if (triangles > 6500) throw new Error(`${site.name}: ${triangles} triangles`)
  const glb = writeGlb(site.name, parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor' })
  if (glb.length > 250 * 1024) throw new Error(`${site.name}: ${glb.length} bytes`)
  return { glb, triangles, base: low }
}

// ---- the Nevada Spillway --------------------------------------------------------

/** Mapterhorn z15 in this frame: rows along z (south) from z0, columns along x from x0, every 2 m, decimetres NAVD88. */
const DEM: Dem = { x0: -60, z0: -84, step: 2, rows: [
  '4103 4099 4089 4077 4058 4045 4031 4008 3974 3954 3947 3945 3945 3944 3944 3943 3940 3931 3918 3905 3889 3877 3867 3856 3848 3841 3838 3835 3831 3830 3830 3831 3830 3827 3818 3810 3796 3779 3759 3732 3710',
  '4089 4086 4077 4064 4043 4025 4010 3980 3958 3947 3944 3940 3937 3934 3933 3931 3928 3921 3908 3892 3881 3870 3861 3850 3839 3832 3828 3823 3820 3818 3819 3822 3823 3820 3814 3805 3791 3772 3739 3716 3697',
  '4072 4067 4060 4045 4018 3996 3974 3958 3947 3944 3937 3930 3926 3923 3922 3919 3914 3905 3885 3865 3853 3850 3835 3826 3819 3814 3810 3805 3802 3800 3801 3806 3810 3809 3803 3796 3785 3756 3718 3691 3677',
  '4054 4049 4039 4014 3982 3962 3953 3947 3945 3940 3932 3921 3914 3910 3909 3909 3900 3878 3852 3827 3813 3805 3795 3790 3788 3788 3786 3783 3783 3783 3781 3784 3789 3786 3782 3777 3763 3732 3690 3664 3642',
  '4039 4030 4013 3980 3955 3949 3947 3946 3944 3939 3928 3913 3902 3897 3897 3895 3876 3845 3815 3790 3783 3781 3778 3778 3777 3776 3776 3775 3773 3773 3772 3767 3766 3761 3756 3751 3722 3679 3653 3628 3605',
  '4013 3999 3981 3956 3948 3945 3943 3942 3941 3939 3926 3906 3893 3885 3883 3864 3837 3806 3785 3779 3775 3773 3769 3763 3759 3760 3751 3747 3748 3750 3743 3743 3741 3735 3730 3717 3671 3613 3598 3587 3571',
  '3981 3966 3955 3948 3944 3940 3936 3934 3933 3932 3918 3898 3883 3874 3843 3819 3794 3780 3775 3769 3762 3749 3735 3722 3710 3700 3691 3687 3686 3686 3692 3700 3709 3707 3702 3681 3612 3564 3558 3554 3554',
  '3959 3953 3949 3944 3939 3934 3929 3925 3921 3916 3904 3888 3875 3845 3809 3784 3779 3773 3761 3748 3728 3706 3685 3664 3644 3626 3618 3619 3635 3648 3658 3673 3684 3686 3679 3648 3578 3542 3543 3546 3547',
  '3955 3951 3946 3940 3934 3928 3922 3915 3908 3901 3890 3875 3850 3815 3784 3778 3772 3760 3739 3713 3686 3660 3633 3606 3582 3569 3574 3598 3620 3639 3656 3668 3676 3679 3675 3639 3567 3536 3537 3541 3543',
  '3954 3950 3944 3936 3929 3923 3916 3905 3897 3888 3876 3854 3819 3785 3778 3772 3758 3735 3706 3676 3645 3615 3585 3563 3548 3548 3570 3595 3619 3639 3655 3668 3676 3679 3674 3642 3567 3533 3532 3535 3537',
  '3955 3950 3941 3933 3925 3918 3908 3896 3886 3876 3863 3830 3791 3778 3774 3761 3737 3706 3673 3641 3609 3576 3555 3543 3541 3547 3568 3594 3618 3639 3655 3668 3676 3679 3674 3643 3566 3527 3525 3527 3526',
  '3957 3949 3940 3931 3922 3913 3901 3888 3876 3865 3844 3807 3781 3776 3766 3744 3713 3679 3645 3610 3576 3552 3540 3539 3539 3547 3567 3594 3618 3638 3654 3668 3676 3679 3676 3644 3569 3519 3516 3516 3514',
  '3957 3948 3938 3929 3920 3908 3894 3881 3866 3851 3827 3792 3779 3773 3756 3726 3691 3655 3619 3584 3554 3539 3536 3537 3537 3544 3567 3594 3617 3637 3654 3667 3675 3679 3676 3652 3571 3512 3503 3504 3500',
  '3957 3947 3937 3929 3918 3905 3890 3875 3861 3845 3820 3790 3778 3769 3743 3709 3672 3634 3597 3563 3540 3534 3534 3534 3535 3541 3566 3593 3617 3637 3654 3667 3676 3679 3676 3649 3568 3505 3492 3489 3483',
  '3958 3947 3938 3928 3915 3902 3888 3874 3859 3845 3819 3788 3777 3761 3731 3694 3656 3618 3580 3548 3532 3532 3532 3532 3532 3541 3565 3592 3616 3637 3654 3666 3675 3679 3676 3651 3574 3498 3483 3477 3470',
  '3960 3949 3938 3926 3912 3898 3885 3872 3859 3841 3813 3784 3774 3753 3720 3682 3643 3605 3567 3536 3530 3529 3530 3529 3530 3540 3564 3592 3616 3636 3653 3667 3675 3679 3677 3654 3576 3498 3477 3469 3463',
  '3960 3948 3935 3921 3907 3892 3879 3867 3855 3837 3804 3781 3770 3747 3712 3673 3634 3595 3556 3532 3527 3527 3527 3527 3528 3538 3564 3591 3616 3636 3653 3666 3675 3679 3676 3651 3577 3494 3473 3466 3459',
  '3958 3946 3931 3916 3901 3886 3872 3859 3846 3829 3795 3779 3768 3743 3707 3667 3628 3588 3549 3528 3524 3525 3525 3525 3526 3536 3563 3591 3615 3636 3653 3666 3675 3679 3675 3649 3575 3491 3467 3460 3455',
  '3954 3941 3926 3911 3896 3881 3866 3849 3832 3811 3790 3778 3768 3740 3702 3663 3623 3584 3546 3524 3522 3522 3522 3522 3523 3536 3563 3590 3614 3635 3652 3665 3675 3679 3676 3653 3574 3487 3461 3456 3453',
  '3952 3938 3923 3908 3892 3877 3861 3842 3818 3800 3786 3778 3768 3737 3698 3658 3619 3580 3543 3522 3520 3520 3520 3520 3521 3535 3562 3590 3614 3635 3652 3666 3674 3679 3676 3654 3574 3487 3458 3454 3452',
  '3951 3938 3923 3908 3892 3877 3861 3843 3822 3800 3784 3777 3764 3734 3694 3655 3615 3575 3538 3520 3517 3518 3518 3517 3519 3532 3561 3589 3614 3634 3651 3665 3675 3679 3676 3652 3578 3485 3458 3453 3451',
  '3950 3937 3923 3910 3894 3879 3863 3847 3828 3806 3784 3776 3761 3729 3691 3651 3611 3571 3534 3517 3515 3515 3515 3515 3517 3532 3560 3588 3613 3634 3651 3664 3674 3679 3676 3649 3578 3485 3458 3452 3450',
  '3950 3938 3924 3911 3897 3881 3864 3847 3829 3804 3785 3775 3758 3725 3687 3647 3607 3567 3532 3513 3513 3513 3513 3513 3514 3531 3559 3587 3612 3633 3651 3664 3674 3679 3672 3638 3549 3482 3455 3451 3449',
  '3949 3938 3924 3911 3898 3884 3865 3847 3826 3801 3784 3775 3755 3722 3683 3643 3603 3563 3528 3511 3510 3510 3510 3510 3512 3530 3558 3587 3611 3632 3650 3664 3674 3678 3668 3595 3516 3463 3455 3452 3449',
  '3947 3935 3923 3910 3898 3884 3866 3845 3823 3800 3782 3774 3752 3718 3679 3639 3600 3560 3523 3509 3507 3507 3508 3508 3511 3528 3558 3586 3611 3632 3649 3663 3674 3678 3658 3594 3508 3469 3457 3453 3450',
  '3944 3932 3920 3908 3896 3884 3866 3842 3822 3800 3783 3773 3750 3714 3675 3635 3596 3556 3520 3506 3505 3505 3505 3505 3508 3528 3558 3586 3610 3631 3649 3663 3674 3679 3670 3620 3552 3481 3462 3456 3451',
  '3941 3928 3916 3905 3894 3883 3865 3843 3825 3800 3783 3771 3747 3711 3671 3631 3591 3552 3518 3503 3503 3503 3503 3503 3507 3527 3557 3585 3610 3631 3649 3663 3673 3678 3677 3652 3587 3504 3464 3459 3453',
  '3936 3923 3911 3900 3891 3880 3864 3845 3827 3800 3782 3770 3743 3706 3667 3627 3588 3548 3514 3501 3500 3500 3500 3501 3504 3525 3556 3584 3610 3630 3648 3663 3673 3678 3677 3662 3599 3506 3469 3462 3456',
  '3929 3917 3904 3894 3885 3876 3863 3848 3826 3797 3780 3767 3739 3703 3663 3623 3584 3545 3510 3499 3498 3498 3498 3498 3503 3524 3555 3584 3609 3630 3648 3663 3674 3679 3677 3660 3606 3507 3473 3465 3458',
  '3922 3910 3898 3887 3878 3870 3860 3847 3822 3791 3779 3765 3736 3699 3659 3619 3579 3540 3508 3496 3496 3496 3496 3496 3501 3524 3555 3583 3608 3629 3647 3662 3673 3678 3678 3663 3606 3512 3475 3468 3460',
  '3915 3903 3891 3880 3871 3862 3854 3843 3818 3787 3777 3763 3733 3695 3655 3615 3576 3536 3505 3493 3493 3493 3493 3493 3499 3523 3554 3583 3608 3629 3647 3663 3673 3678 3678 3665 3605 3517 3475 3470 3464',
  '3908 3896 3884 3873 3863 3853 3845 3836 3807 3784 3776 3760 3729 3691 3651 3611 3572 3533 3501 3491 3491 3491 3491 3491 3497 3522 3553 3582 3607 3628 3646 3662 3673 3678 3678 3663 3606 3513 3478 3471 3466',
  '3901 3889 3877 3866 3856 3845 3834 3817 3796 3780 3776 3757 3725 3687 3647 3607 3568 3529 3497 3489 3488 3488 3489 3489 3496 3521 3553 3581 3606 3628 3647 3662 3673 3679 3678 3662 3610 3515 3482 3473 3465',
  '3894 3882 3871 3860 3849 3838 3826 3810 3790 3779 3774 3756 3721 3682 3643 3604 3565 3525 3495 3486 3486 3486 3486 3486 3494 3520 3552 3581 3606 3627 3646 3662 3672 3678 3678 3665 3611 3523 3484 3475 3466',
  '3888 3877 3866 3855 3845 3834 3823 3809 3791 3779 3772 3752 3718 3678 3639 3600 3560 3521 3492 3483 3483 3483 3483 3484 3492 3519 3552 3580 3605 3627 3646 3662 3672 3678 3678 3666 3610 3526 3481 3474 3466',
  '3884 3872 3862 3852 3843 3834 3824 3812 3791 3778 3772 3748 3714 3675 3635 3596 3557 3518 3488 3481 3481 3481 3481 3482 3491 3518 3551 3579 3604 3626 3646 3661 3672 3678 3678 3664 3610 3520 3482 3472 3464',
  '3883 3872 3862 3853 3844 3835 3827 3814 3791 3777 3771 3745 3710 3671 3632 3592 3553 3514 3484 3479 3479 3479 3479 3480 3489 3518 3550 3578 3604 3626 3646 3661 3672 3678 3678 3664 3612 3520 3483 3472 3464',
  '3886 3875 3866 3856 3845 3835 3825 3810 3787 3778 3768 3743 3707 3667 3628 3588 3549 3510 3483 3476 3476 3476 3476 3477 3488 3517 3549 3578 3603 3626 3646 3661 3672 3678 3679 3667 3610 3527 3486 3476 3468',
  '3889 3878 3867 3856 3845 3834 3822 3805 3785 3777 3767 3740 3703 3663 3624 3585 3546 3506 3479 3474 3474 3474 3474 3475 3486 3516 3548 3577 3602 3626 3645 3660 3671 3678 3679 3668 3612 3531 3489 3481 3475',
  '3887 3876 3866 3855 3845 3834 3820 3802 3784 3776 3766 3736 3699 3660 3620 3581 3542 3502 3475 3472 3471 3472 3472 3473 3485 3514 3547 3576 3602 3626 3645 3660 3671 3678 3678 3663 3612 3526 3496 3488 3484',
  '3884 3873 3862 3852 3843 3832 3818 3800 3783 3776 3764 3733 3696 3656 3617 3578 3539 3498 3473 3469 3469 3469 3469 3470 3483 3513 3546 3575 3601 3625 3644 3660 3671 3678 3679 3663 3608 3531 3505 3500 3498',
  '3879 3868 3858 3848 3838 3828 3816 3799 3781 3776 3761 3730 3692 3653 3614 3575 3536 3495 3471 3467 3467 3467 3467 3468 3482 3512 3545 3574 3601 3625 3644 3660 3671 3678 3679 3668 3611 3542 3514 3512 3509',
  '3876 3866 3856 3846 3837 3828 3817 3801 3783 3775 3759 3727 3689 3649 3610 3571 3531 3491 3468 3464 3464 3465 3465 3466 3480 3511 3544 3573 3601 3624 3644 3659 3671 3678 3679 3668 3618 3548 3519 3517 3516',
  '3877 3868 3858 3849 3841 3833 3822 3802 3785 3774 3758 3723 3685 3646 3607 3568 3526 3487 3464 3462 3462 3462 3462 3464 3479 3510 3543 3573 3601 3624 3643 3659 3671 3677 3679 3669 3632 3554 3525 3519 3518',
  '3880 3872 3864 3857 3850 3841 3825 3802 3785 3774 3753 3720 3681 3642 3603 3563 3521 3483 3463 3459 3460 3460 3460 3461 3477 3510 3543 3573 3601 3624 3643 3659 3670 3677 3679 3671 3635 3567 3532 3523 3517',
  '3886 3878 3872 3866 3858 3849 3828 3802 3782 3773 3750 3716 3677 3638 3599 3559 3516 3480 3460 3457 3457 3457 3457 3458 3476 3509 3542 3573 3600 3623 3643 3659 3670 3677 3679 3673 3630 3571 3542 3527 3518',
  '3893 3886 3880 3874 3862 3851 3835 3810 3788 3771 3748 3713 3673 3634 3595 3556 3513 3476 3457 3455 3455 3455 3455 3457 3474 3508 3541 3573 3600 3623 3642 3658 3670 3677 3679 3670 3628 3569 3546 3534 3523',
  '3901 3895 3891 3883 3870 3859 3846 3821 3793 3770 3744 3709 3670 3630 3592 3551 3509 3472 3454 3452 3452 3452 3452 3455 3473 3507 3540 3572 3599 3623 3642 3658 3670 3677 3679 3669 3631 3570 3550 3543 3536',
  '3909 3905 3902 3896 3882 3871 3854 3827 3797 3769 3740 3705 3666 3627 3588 3547 3505 3469 3452 3450 3450 3450 3450 3453 3472 3506 3541 3572 3599 3622 3641 3657 3669 3677 3679 3672 3637 3577 3553 3550 3547',
  '3918 3911 3908 3903 3892 3877 3854 3824 3796 3769 3737 3701 3662 3623 3584 3541 3500 3466 3449 3447 3448 3448 3448 3450 3471 3505 3539 3571 3598 3621 3641 3657 3669 3676 3679 3674 3643 3586 3553 3552 3552',
  '3919 3915 3911 3905 3895 3879 3853 3823 3795 3765 3735 3698 3659 3620 3580 3537 3497 3462 3446 3445 3445 3446 3445 3449 3470 3504 3540 3571 3598 3621 3641 3657 3669 3677 3679 3673 3650 3590 3558 3554 3554',
  '3917 3913 3909 3902 3893 3878 3852 3823 3793 3762 3731 3694 3655 3616 3575 3533 3493 3458 3444 3443 3443 3443 3443 3447 3468 3504 3540 3570 3597 3620 3640 3656 3669 3676 3679 3674 3653 3595 3562 3556 3557',
  '3912 3907 3902 3895 3888 3878 3852 3819 3790 3760 3728 3690 3651 3612 3570 3528 3489 3455 3441 3440 3440 3441 3440 3444 3467 3503 3539 3570 3596 3620 3640 3656 3668 3676 3679 3674 3652 3601 3562 3559 3561',
  '3905 3900 3895 3888 3880 3871 3849 3816 3785 3757 3724 3686 3647 3608 3566 3525 3485 3451 3438 3438 3438 3438 3438 3441 3466 3503 3539 3569 3596 3619 3639 3656 3668 3676 3679 3676 3653 3605 3566 3563 3564',
  '3899 3894 3888 3882 3874 3862 3845 3814 3783 3753 3721 3682 3644 3603 3560 3520 3481 3448 3436 3435 3435 3436 3435 3441 3465 3503 3538 3568 3595 3619 3639 3655 3668 3676 3679 3675 3656 3608 3574 3564 3565',
  '3894 3888 3882 3876 3867 3853 3835 3812 3781 3752 3717 3679 3640 3599 3557 3516 3477 3443 3433 3433 3433 3433 3433 3438 3463 3502 3537 3568 3595 3619 3639 3655 3668 3676 3679 3675 3655 3615 3578 3566 3564',
  '3888 3883 3876 3870 3862 3844 3824 3804 3780 3749 3714 3675 3636 3594 3552 3512 3472 3441 3431 3430 3431 3431 3431 3435 3463 3502 3536 3567 3594 3618 3638 3655 3667 3676 3679 3676 3654 3618 3582 3569 3567',
  '3882 3876 3870 3865 3857 3836 3812 3795 3776 3746 3710 3671 3632 3589 3549 3508 3468 3437 3428 3428 3428 3428 3428 3433 3463 3502 3536 3566 3594 3617 3638 3654 3667 3676 3680 3675 3655 3621 3589 3574 3572',
  '3876 3870 3864 3859 3851 3832 3803 3788 3771 3743 3707 3668 3627 3585 3544 3504 3465 3434 3426 3425 3426 3426 3426 3433 3463 3501 3535 3566 3593 3617 3637 3654 3667 3676 3679 3675 3658 3628 3598 3579 3575',
  '3871 3865 3859 3853 3847 3833 3810 3786 3768 3739 3703 3664 3623 3580 3540 3500 3461 3431 3424 3423 3423 3423 3423 3431 3463 3500 3534 3565 3593 3616 3637 3654 3667 3675 3679 3675 3658 3632 3604 3583 3575',
  '3865 3860 3854 3849 3842 3834 3813 3789 3766 3736 3699 3660 3617 3576 3536 3496 3457 3429 3421 3421 3421 3421 3421 3428 3462 3499 3533 3565 3592 3616 3636 3653 3666 3675 3679 3676 3658 3634 3609 3586 3577',
  '3859 3855 3850 3844 3838 3829 3812 3787 3762 3732 3695 3656 3613 3572 3532 3493 3454 3425 3418 3418 3418 3418 3418 3429 3461 3499 3533 3564 3591 3615 3636 3653 3666 3675 3679 3675 3660 3637 3612 3590 3579',
  '3852 3849 3846 3841 3833 3823 3806 3783 3759 3729 3691 3651 3608 3568 3529 3489 3451 3422 3416 3416 3416 3416 3416 3428 3460 3498 3532 3563 3591 3615 3635 3652 3666 3675 3679 3675 3661 3638 3614 3593 3583',
  '3846 3844 3842 3837 3829 3819 3798 3779 3757 3725 3687 3646 3604 3564 3525 3485 3446 3420 3414 3414 3414 3414 3414 3426 3459 3497 3532 3563 3590 3614 3635 3652 3666 3674 3679 3675 3661 3638 3614 3594 3584',
  '3842 3838 3836 3831 3823 3814 3795 3777 3754 3722 3684 3642 3601 3561 3521 3481 3442 3417 3411 3411 3411 3411 3412 3424 3459 3496 3531 3562 3590 3614 3634 3652 3665 3674 3679 3677 3661 3639 3614 3594 3586',
  '3838 3833 3826 3821 3814 3805 3793 3776 3751 3718 3680 3637 3597 3557 3517 3477 3439 3413 3409 3409 3409 3409 3410 3424 3458 3495 3530 3561 3589 3613 3634 3652 3665 3674 3679 3676 3662 3639 3615 3595 3586',
  '3834 3826 3817 3811 3806 3798 3788 3774 3748 3715 3676 3633 3593 3553 3513 3473 3435 3410 3406 3406 3407 3407 3407 3423 3457 3495 3530 3561 3589 3613 3634 3651 3665 3675 3679 3676 3662 3640 3616 3596 3587',
  '3830 3820 3813 3806 3800 3793 3784 3770 3745 3712 3671 3629 3589 3549 3509 3469 3431 3408 3404 3404 3404 3404 3406 3420 3456 3494 3529 3560 3588 3612 3633 3651 3664 3674 3679 3677 3663 3640 3616 3595 3587',
  '3833 3822 3812 3804 3798 3790 3782 3768 3743 3708 3667 3625 3585 3545 3505 3465 3427 3405 3401 3402 3402 3402 3404 3419 3455 3493 3528 3559 3587 3612 3633 3651 3664 3674 3679 3677 3663 3641 3616 3595 3588',
  '3838 3826 3815 3806 3798 3787 3778 3767 3740 3704 3662 3621 3581 3542 3501 3461 3424 3402 3399 3399 3400 3399 3401 3419 3454 3492 3527 3558 3586 3611 3633 3650 3664 3674 3678 3676 3664 3641 3617 3596 3587',
  '3838 3829 3819 3810 3799 3785 3777 3766 3737 3700 3657 3617 3577 3537 3497 3457 3421 3399 3397 3397 3397 3397 3399 3417 3453 3491 3526 3558 3586 3611 3632 3649 3664 3674 3678 3676 3664 3641 3617 3597 3587',
  '3838 3830 3822 3810 3796 3782 3776 3763 3734 3694 3653 3613 3573 3533 3493 3454 3415 3397 3395 3395 3395 3395 3397 3415 3452 3491 3526 3557 3585 3610 3631 3649 3664 3674 3679 3677 3664 3642 3618 3597 3589',
  '3838 3831 3823 3810 3792 3780 3774 3760 3731 3690 3649 3609 3569 3529 3489 3450 3413 3394 3392 3392 3392 3392 3395 3414 3451 3490 3525 3557 3585 3609 3630 3647 3665 3678 3682 3681 3670 3650 3622 3596 3589',
  '3839 3832 3823 3810 3792 3780 3775 3759 3729 3686 3645 3605 3565 3525 3485 3446 3410 3391 3390 3390 3390 3390 3392 3416 3452 3490 3526 3558 3587 3611 3634 3657 3684 3705 3711 3712 3704 3691 3659 3605 3590',
  '3841 3833 3824 3812 3794 3781 3775 3769 3734 3684 3641 3600 3561 3521 3482 3442 3406 3389 3388 3388 3388 3391 3406 3433 3470 3507 3543 3577 3611 3649 3677 3698 3730 3753 3756 3755 3752 3749 3709 3632 3595',
  '3845 3838 3830 3818 3800 3782 3777 3771 3740 3680 3637 3597 3557 3517 3478 3438 3402 3390 3387 3387 3389 3403 3431 3468 3507 3542 3578 3614 3661 3710 3741 3759 3766 3773 3775 3776 3774 3763 3726 3646 3622',
  '3851 3846 3837 3824 3804 3784 3776 3772 3735 3678 3633 3593 3553 3513 3473 3434 3401 3386 3384 3385 3390 3406 3442 3482 3521 3561 3600 3638 3686 3743 3771 3774 3776 3776 3776 3776 3776 3763 3722 3676 3657',
  '3861 3854 3843 3828 3806 3785 3776 3776 3736 3678 3629 3589 3549 3509 3469 3430 3399 3385 3378 3386 3390 3405 3442 3482 3522 3562 3602 3642 3694 3753 3773 3775 3776 3776 3776 3776 3776 3772 3736 3697 3682',
  '3870 3865 3854 3835 3809 3785 3777 3773 3741 3676 3626 3585 3545 3505 3466 3426 3396 3387 3386 3387 3389 3405 3442 3482 3522 3561 3601 3642 3698 3754 3774 3775 3776 3776 3776 3776 3776 3773 3749 3710 3694',
  '3878 3872 3864 3843 3813 3786 3778 3772 3742 3675 3623 3581 3541 3501 3462 3423 3393 3388 3387 3388 3389 3406 3441 3481 3520 3560 3600 3642 3704 3755 3774 3775 3775 3776 3776 3776 3776 3773 3756 3718 3704',
  '3886 3878 3871 3850 3818 3790 3778 3773 3740 3676 3618 3577 3537 3497 3458 3420 3397 3389 3390 3391 3393 3405 3440 3480 3520 3559 3599 3644 3708 3760 3775 3775 3775 3776 3776 3776 3776 3775 3760 3729 3715',
  '3893 3885 3877 3860 3823 3793 3778 3773 3739 3676 3614 3573 3533 3495 3461 3442 3429 3424 3422 3423 3424 3428 3445 3481 3519 3558 3598 3647 3712 3766 3774 3775 3775 3776 3776 3776 3776 3776 3764 3735 3720',
  '3899 3892 3886 3871 3840 3800 3781 3771 3742 3674 3614 3570 3531 3497 3485 3481 3481 3478 3476 3475 3475 3472 3477 3487 3520 3558 3598 3649 3719 3764 3775 3775 3775 3776 3776 3776 3776 3775 3769 3737 3723',
  '3906 3898 3894 3885 3861 3824 3789 3773 3744 3677 3613 3568 3530 3502 3495 3495 3495 3495 3495 3494 3494 3494 3494 3498 3520 3558 3600 3653 3724 3765 3775 3775 3775 3776 3776 3776 3776 3775 3767 3737 3727',
  '3913 3905 3900 3896 3878 3848 3805 3777 3743 3679 3611 3567 3528 3502 3495 3495 3495 3495 3495 3495 3495 3495 3495 3499 3522 3559 3600 3660 3729 3770 3775 3775 3775 3775 3776 3776 3775 3773 3759 3740 3733',
  '3917 3909 3904 3897 3885 3863 3820 3776 3742 3679 3611 3565 3527 3500 3494 3494 3494 3493 3493 3494 3494 3494 3494 3499 3523 3561 3603 3667 3735 3772 3775 3775 3775 3775 3775 3775 3775 3774 3762 3749 3747',
  '3923 3913 3907 3901 3890 3873 3824 3778 3741 3681 3613 3565 3525 3499 3493 3492 3492 3491 3491 3491 3492 3492 3493 3499 3524 3563 3608 3672 3742 3769 3774 3775 3775 3775 3775 3775 3775 3774 3771 3760 3757',
  '3930 3920 3914 3909 3900 3880 3834 3783 3740 3681 3613 3564 3525 3498 3492 3490 3489 3488 3488 3489 3489 3490 3492 3499 3527 3565 3612 3679 3743 3768 3774 3775 3775 3775 3775 3775 3775 3775 3773 3767 3764',
  '3937 3927 3919 3915 3908 3891 3853 3792 3740 3680 3611 3563 3525 3498 3489 3488 3486 3485 3485 3486 3486 3488 3490 3501 3529 3567 3615 3685 3741 3768 3774 3775 3775 3775 3775 3775 3775 3774 3772 3769 3768',
  '3942 3932 3924 3918 3911 3898 3863 3796 3741 3681 3612 3563 3525 3496 3487 3484 3482 3481 3481 3482 3483 3485 3488 3501 3531 3569 3621 3691 3743 3765 3773 3774 3775 3775 3775 3775 3775 3774 3771 3770 3771',
  '3947 3938 3931 3923 3914 3904 3866 3801 3738 3684 3614 3562 3523 3494 3484 3480 3478 3476 3476 3477 3479 3482 3486 3501 3533 3572 3628 3699 3745 3763 3772 3774 3775 3775 3775 3775 3775 3774 3772 3772 3772',
  '3953 3945 3937 3930 3920 3904 3876 3808 3742 3684 3614 3561 3521 3492 3480 3476 3473 3471 3471 3472 3474 3478 3484 3500 3534 3575 3634 3705 3745 3763 3772 3774 3775 3775 3775 3775 3775 3774 3774 3773 3773',
  '3960 3951 3942 3936 3925 3907 3874 3807 3740 3683 3614 3559 3519 3490 3476 3471 3467 3465 3465 3467 3470 3474 3480 3501 3535 3577 3640 3707 3745 3764 3772 3774 3775 3775 3775 3775 3775 3775 3775 3774 3774',
  '3965 3957 3947 3939 3931 3912 3875 3805 3734 3682 3615 3557 3517 3486 3472 3465 3461 3459 3459 3460 3464 3469 3478 3500 3535 3579 3648 3712 3745 3762 3772 3775 3775 3775 3775 3775 3775 3775 3775 3775 3775',
  '3969 3962 3951 3944 3936 3920 3877 3806 3735 3683 3615 3556 3514 3481 3467 3459 3454 3452 3452 3454 3458 3464 3475 3498 3535 3584 3653 3715 3743 3762 3772 3775 3775 3775 3775 3775 3775 3775 3775 3776 3776',
  '3973 3966 3958 3950 3943 3922 3874 3802 3734 3681 3614 3553 3509 3477 3460 3451 3446 3444 3444 3446 3451 3458 3470 3498 3535 3588 3660 3714 3745 3764 3773 3775 3775 3775 3775 3775 3775 3775 3776 3776 3776',
  '3977 3971 3964 3957 3949 3924 3869 3798 3732 3679 3615 3548 3504 3471 3453 3444 3438 3436 3436 3439 3444 3452 3465 3495 3535 3590 3666 3715 3747 3765 3774 3775 3775 3775 3775 3775 3775 3776 3776 3776 3776',
  '3980 3975 3968 3961 3953 3930 3869 3796 3729 3679 3613 3546 3498 3464 3445 3435 3430 3427 3427 3430 3436 3445 3462 3492 3533 3595 3669 3723 3757 3768 3773 3775 3775 3775 3775 3776 3776 3776 3776 3776 3776',
  '3981 3978 3971 3963 3952 3926 3871 3797 3728 3678 3611 3542 3492 3457 3437 3426 3420 3417 3418 3421 3428 3438 3457 3489 3531 3601 3674 3729 3763 3771 3775 3775 3775 3775 3776 3776 3776 3776 3776 3776 3776',
  '3978 3976 3971 3962 3943 3911 3866 3793 3722 3672 3609 3536 3487 3450 3427 3416 3410 3407 3408 3411 3419 3431 3450 3484 3533 3605 3677 3732 3763 3772 3775 3775 3775 3775 3776 3776 3776 3776 3776 3776 3776',
  '3971 3971 3968 3959 3934 3901 3859 3786 3713 3666 3607 3533 3480 3442 3418 3406 3399 3396 3397 3401 3410 3422 3444 3480 3534 3610 3677 3728 3760 3771 3775 3776 3775 3776 3776 3776 3776 3776 3776 3776 3776',
  '3959 3960 3959 3952 3932 3895 3849 3776 3702 3660 3602 3531 3471 3431 3408 3395 3387 3384 3385 3390 3399 3413 3438 3476 3533 3612 3672 3716 3753 3769 3775 3776 3776 3776 3776 3776 3776 3776 3776 3776 3776',
  '3943 3945 3944 3941 3927 3894 3842 3768 3693 3653 3598 3526 3463 3420 3397 3383 3375 3372 3374 3379 3389 3404 3431 3471 3537 3614 3668 3707 3742 3765 3774 3776 3776 3776 3776 3776 3776 3776 3776 3776 3776',
  '3926 3927 3927 3927 3922 3894 3841 3764 3690 3645 3594 3519 3456 3411 3385 3371 3363 3360 3361 3367 3378 3395 3422 3467 3539 3614 3666 3703 3733 3761 3774 3776 3776 3776 3776 3776 3776 3776 3776 3776 3776',
  '3916 3915 3914 3913 3909 3891 3845 3760 3685 3639 3586 3512 3445 3399 3373 3358 3350 3346 3348 3355 3366 3384 3415 3465 3540 3614 3665 3702 3732 3760 3775 3776 3776 3776 3776 3776 3776 3776 3776 3776 3777',
  '3913 3910 3908 3905 3898 3883 3840 3760 3683 3631 3577 3506 3434 3386 3360 3344 3335 3332 3335 3341 3353 3374 3408 3462 3541 3610 3663 3702 3732 3760 3774 3776 3776 3776 3776 3776 3776 3776 3776 3777 3777',
  '3912 3909 3906 3902 3892 3870 3828 3755 3680 3623 3569 3497 3423 3374 3346 3330 3321 3318 3320 3327 3340 3362 3399 3459 3539 3607 3660 3700 3731 3761 3775 3776 3776 3776 3776 3776 3776 3776 3776 3777 3777',
  '3911 3907 3905 3901 3886 3862 3819 3747 3676 3616 3560 3487 3411 3360 3330 3314 3306 3303 3304 3312 3327 3350 3388 3457 3534 3601 3658 3698 3731 3761 3775 3776 3776 3776 3776 3776 3776 3776 3776 3777 3777',
  '3907 3903 3901 3897 3885 3855 3809 3739 3670 3608 3549 3475 3397 3345 3315 3298 3290 3287 3289 3297 3313 3337 3380 3452 3530 3593 3649 3698 3732 3762 3775 3776 3776 3776 3776 3776 3776 3776 3776 3777 3777',
  '3899 3895 3892 3890 3880 3852 3794 3729 3665 3594 3536 3463 3384 3330 3299 3282 3273 3270 3273 3282 3297 3323 3373 3447 3525 3583 3642 3698 3736 3763 3775 3776 3776 3776 3776 3776 3776 3776 3776 3776 3777',
  '3892 3886 3883 3881 3873 3844 3785 3723 3660 3584 3522 3454 3386 3321 3285 3267 3257 3254 3257 3265 3279 3309 3367 3446 3515 3575 3635 3696 3738 3763 3775 3776 3776 3776 3776 3776 3776 3775 3776 3776 3776',
  '3886 3881 3875 3870 3866 3839 3782 3717 3650 3572 3510 3478 3420 3357 3307 3281 3269 3263 3254 3261 3300 3346 3413 3463 3512 3566 3625 3692 3738 3764 3775 3776 3776 3775 3775 3775 3775 3775 3775 3776 3776',
  '3884 3877 3868 3860 3855 3835 3777 3713 3645 3562 3516 3501 3481 3428 3397 3371 3343 3338 3333 3349 3400 3468 3483 3495 3514 3560 3627 3689 3738 3765 3775 3776 3776 3775 3775 3775 3775 3775 3776 3776 3776',
  '3883 3876 3865 3853 3845 3825 3775 3715 3652 3583 3543 3531 3517 3506 3486 3470 3457 3447 3442 3460 3506 3512 3515 3516 3522 3572 3637 3696 3743 3765 3775 3776 3776 3775 3775 3775 3775 3775 3775 3776 3776',
  '3883 3876 3865 3849 3839 3820 3783 3733 3687 3646 3617 3595 3578 3555 3539 3533 3522 3514 3516 3520 3521 3527 3530 3531 3546 3591 3658 3712 3751 3769 3775 3776 3775 3775 3775 3775 3775 3775 3775 3775 3776',
  '3885 3878 3866 3849 3837 3825 3801 3776 3746 3723 3714 3704 3675 3645 3617 3600 3587 3573 3563 3563 3566 3573 3583 3588 3605 3644 3690 3733 3763 3775 3775 3775 3775 3775 3774 3774 3775 3775 3775 3775 3775',
  '3889 3880 3867 3853 3843 3834 3824 3812 3800 3790 3781 3772 3766 3749 3725 3711 3692 3668 3659 3654 3661 3673 3674 3674 3687 3705 3727 3751 3771 3775 3775 3775 3775 3774 3774 3774 3774 3775 3775 3775 3775',
  '3895 3884 3872 3862 3855 3853 3846 3839 3831 3823 3818 3812 3809 3807 3799 3793 3787 3778 3751 3737 3732 3741 3739 3737 3741 3744 3753 3761 3770 3775 3775 3775 3774 3774 3774 3774 3774 3774 3775 3775 3775',
] }

if (import.meta.main) {
  const { glb, triangles } = buildSpillway({
    name: 'Nevada Spillway',
    s: -1,
    off: 7,
    dem: DEM,
    c: 0,
    yFloorNE: 62,
    yEnd: -140,
    // Mapterhorn: the west wall's foot 30 m from the crest upstream, 33 m downstream.
    wallFoot: (y) => 31 - 0.03 * y,
    nearFoot: 23,
    nearBatter: 2.3,
    inlet: { y0: -80, y1: -140, z: 352 },
  })
  await Bun.write(new URL('../models/lv-hoover-dam-nevada-spillway.glb', import.meta.url).pathname, glb)
  console.log(`models/lv-hoover-dam-nevada-spillway.glb: ${triangles} triangles, ${(glb.length / 1024).toFixed(1)} KiB`)
}
