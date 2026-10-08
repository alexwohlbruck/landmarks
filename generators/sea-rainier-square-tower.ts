/**
 * Rainier Square Tower (2020, NBBJ), Seattle — original procedural geometry, CC0-1.0.
 * bun generators/sea-rainier-square-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the OSM
 * outline's area centroid, -122.3348815, 47.6090211) on the lowest ground
 * under the footprint (4th Avenue, 40.7 m NAVD88). Built in the street grid's
 * frame: the model's y axis runs up 4th Avenue (NNW) and x along Union Street
 * (ENE), so the placement bearing is 328.8°.
 *
 * Form: a square silver-glass tower at the corner of 4th Avenue and Union
 * Street whose east side flares out toward the base in a stack of one-storey
 * setbacks, the "skirt" that steps down toward the Rainier Tower's pedestal.
 * The flare is concave: shallow near the top (a couple of metres between 147
 * and 97 m) and widening fast below 90 m, out to 5th Avenue at the podium. The
 * south face leans out by a few metres over the same height; the 4th Avenue
 * corner is scooped by a concave curve below 89 m. A white comb of fins
 * crowns the roof. South of the tower along 4th Avenue a 12-storey block and
 * low retail fill the rest of the outline.
 *
 * Sources
 * - OSM (exact, and checked against the lidar): outline way/686348108 and its
 *   29 parts way/686348092..686348118. The skirt is mapped floor by floor
 *   (4.19 m storeys); every step's height and east edge here is OSM's.
 * - Lidar (measured, USGS 3DEP WA_KingCo_1_2021, heights above 40.7 m):
 *   roof 255 m, crown fins to 260-261 m; the skirt's east edge matches the
 *   OSM steps to about a metre (59 m at x 24, 43 m at x 31, 27 m at x 39.5);
 *   podium deck 15-16 m; the 4th Avenue block 44 m with a 50 m penthouse;
 *   low retail 13-15 m. OSM's 37.4/40.7 m for that block are 5-10 m low, so
 *   the lidar heights are used there.
 * - Published: 259 m (850 ft), 58 storeys, completed 2020 (Wikipedia,
 *   "Rainier Square Tower").
 * - Photos (Wikimedia Commons, see the batch report): Dietmar Rabich 2022
 *   (crown fins, silver glass), SounderBruce 2019/2020 (the stepped skirt
 *   under construction and finished), Yuri Levchenko (the skirt's serrated
 *   edge from the north-east).
 * Estimated: storey grouping of the panels (three office floors per panel in
 * the skirt, about four residential floors above 147 m), the crown fins'
 * spacing, the 4th Avenue block's facade (no clear photo; drawn plainly).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant, type Swatch } from './palette'

export type XY = [number, number]

// ---------------------------------------------------------------- helpers
// Copied from sea-columbia-center.ts (another builder's file), plus a few of
// my own; shared by sea-rainier-tower, sea-1201-third-avenue, sea-seattle-tower.

// Shared by the sea- downtown towers (F5, Municipal Tower, Smith Tower).

export const area2 = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
/** Counter-clockwise from above, without a repeated closing point. */
export function ccw(r: XY[]): XY[] {
  let pts = r.slice()
  const a = pts[0], z = pts[pts.length - 1]
  if (Math.hypot(a[0] - z[0], a[1] - z[1]) < 1e-6) pts.pop()
  // drop repeated points
  pts = pts.filter((p, i) => { const q = pts[(i + 1) % pts.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.05 })
  return area2(pts) < 0 ? pts.reverse() : pts
}
export function inside(p: XY, r: XY[]) {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j]
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < xi + ((p[1] - yi) * (xj - xi)) / (yj - yi)) c = !c
  }
  return c
}
const nrm2 = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
/** Outward normal of a counter-clockwise edge. */
export const outward = (a: XY, b: XY): XY => nrm2([b[1] - a[1], a[0] - b[0]])
/** Turn at vertex i, degrees; positive is convex for a counter-clockwise ring. */
export function turn(r: XY[], i: number) {
  const p = r[(i - 1 + r.length) % r.length], q = r[i], s = r[(i + 1) % r.length]
  const a = Math.atan2(q[1] - p[1], q[0] - p[0]), b = Math.atan2(s[1] - q[1], s[0] - q[0])
  let d = ((b - a) * 180) / Math.PI
  while (d > 180) d -= 360
  while (d < -180) d += 360
  return d
}

/** Ear-clipping triangulation of a simple counter-clockwise ring. */
export function triangulate(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k - 1 + idx.length) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = r[i0], b = r[i1], c = r[i2]
      if (cr(a, b, c) <= 1e-9) continue
      let ok = true
      for (const j of idx) {
        if (j === i0 || j === i1 || j === i2) continue
        const p = r[j]
        if (cr(a, b, p) >= -1e-9 && cr(b, c, p) >= -1e-9 && cr(c, a, p) >= -1e-9) { ok = false; break }
      }
      if (!ok) continue
      out.push([i0, i1, i2])
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
export function capRing(part: Part, r: XY[], z: number, up = true) {
  for (const [a, b, c] of triangulate(r)) {
    const A: V3 = [r[a][0], r[a][1], z], B: V3 = [r[b][0], r[b][1], z], C: V3 = [r[c][0], r[c][1], z]
    if (up) part.tri(A, B, C)
    else part.tri(A, C, B)
  }
}

/** Cut every convex corner sharper than `minTurn` with a chamfer of `c`. */
export function chamfer(r: XY[], c: number, minTurn = 35): XY[] {
  const out: XY[] = []
  r.forEach((q, i) => {
    const t = turn(r, i)
    if (t < minTurn) { out.push(q); return }
    const p = r[(i - 1 + r.length) % r.length], s = r[(i + 1) % r.length]
    const lp = Math.hypot(p[0] - q[0], p[1] - q[1]), ls = Math.hypot(s[0] - q[0], s[1] - q[1])
    const k1 = Math.min(c, lp / 3), k2 = Math.min(c, ls / 3)
    out.push([q[0] + ((p[0] - q[0]) / lp) * k1, q[1] + ((p[1] - q[1]) / lp) * k1])
    out.push([q[0] + ((s[0] - q[0]) / ls) * k2, q[1] + ((s[1] - q[1]) / ls) * k2])
  })
  return out
}

/** A vertex normal: the mean of its two edges' where the ring turns gently, else undefined. */
export function vertexNormal(r: XY[], i: number, smooth = 35): XY | undefined {
  if (Math.abs(turn(r, i)) >= smooth) return undefined
  const p = r[(i - 1 + r.length) % r.length], q = r[i], s = r[(i + 1) % r.length]
  const a = outward(p, q), b = outward(q, s)
  return nrm2([a[0] + b[0], a[1] + b[1]])
}

/** A wall quad over edge i of ring r, smooth-shaded across gentle turns. */
export function wallEdge(part: Part, r: XY[], i: number, z0: number, z1: number, smooth = 35) {
  const a = r[i], b = r[(i + 1) % r.length], n = outward(a, b)
  const na = vertexNormal(r, i, smooth) ?? n, nb = vertexNormal(r, (i + 1) % r.length, smooth) ?? n
  const A0: V3 = [a[0], a[1], z0], B0: V3 = [b[0], b[1], z0], B1: V3 = [b[0], b[1], z1], A1: V3 = [a[0], a[1], z1]
  const N = (v: XY): V3 => [v[0], v[1], 0]
  part.tri(A0, B0, B1, undefined, undefined, undefined, [N(na), N(nb), N(nb)])
  part.tri(A0, B1, A1, undefined, undefined, undefined, [N(na), N(nb), N(na)])
}

/**
 * A stack of prisms from a shared base. Each edge's wall starts where the
 * neighbouring prism (the one just outside that edge) ends, so faces hidden
 * inside a taller neighbour are not drawn.
 */
export type Prism = { ring: XY[]; z1: number; z0?: number; wall: Part; roof: Part; kind: string }
export function coverAt(prisms: Prism[], p: XY, self: Prism) {
  // Climb the neighbours stacked outside this point: one covers the wall
  // only from its own bottom, so a cornice hung higher up hides nothing below.
  let h = self.z0 ?? 0, moved = true
  while (moved) {
    moved = false
    for (const q of prisms)
      if (q !== self && (q.z0 ?? 0) <= h + 0.01 && q.z1 > h && inside(p, q.ring)) { h = q.z1; moved = true }
  }
  return h
}
export function edgeBase(prisms: Prism[], P: Prism, i: number) {
  const r = P.ring, a = r[i], b = r[(i + 1) % r.length], n = outward(a, b)
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  // the highest neighbour at three points along the edge, so an edge that
  // only partly meets a neighbour is still drawn where it is exposed
  let h = Infinity
  for (const t of [0.2, 0.5, 0.8]) {
    const m: XY = [a[0] + (b[0] - a[0]) * t + n[0] * 0.6, a[1] + (b[1] - a[1]) * t + n[1] * 0.6]
    h = Math.min(h, coverAt(prisms, m, P))
  }
  if (L < 0.01) return P.z1
  return Math.max(P.z0 ?? 0, h)
}

/**
 * Window panels over edge i of ring r. Groups of storeys, counted from the
 * ground so they line up across faces; `bays` > 0 splits a flat face with
 * piers, 0 makes a continuous band that runs on into the next edge across
 * gentle turns (a curved face).
 */
export type Grid = { group: number; spandrel: number; proud?: number; pier?: number; bayW?: number; head?: number; foot?: number; inset?: number }
export function edgePanels(part: Part, r: XY[], i: number, z0: number, z1: number, g: Grid, band: boolean) {
  const proud = g.proud ?? 0.05, pier = g.pier ?? 1.2, bayW = g.bayW ?? 6, inset = g.inset ?? 0.8
  const j = (i + 1) % r.length, a = r[i], b = r[j], n = outward(a, b)
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const lo0 = z0 + (g.foot ?? 1), hi0 = z1 - (g.head ?? 2)
  const runs: [XY, XY, XY, XY][] = [] // start, end, start normal, end normal
  if (band) {
    const na = vertexNormal(r, i), nb = vertexNormal(r, j)
    const s0 = na ? 0 : inset, s1 = na === undefined && nb === undefined ? inset : nb ? 0 : inset
    if (L - s0 - s1 < 1) return
    const A: XY = [a[0] + t[0] * s0, a[1] + t[1] * s0], B: XY = [b[0] - t[0] * s1, b[1] - t[1] * s1]
    runs.push([A, B, na ?? n, nb ?? n])
  } else {
    if (L < 2 * inset + 1.5) return
    const bays = Math.max(1, Math.round((L - 2 * inset) / bayW)), w = (L - 2 * inset) / bays
    for (let k = 0; k < bays; k++) {
      const s = inset + k * w + (k ? pier / 2 : 0), e = inset + (k + 1) * w - (k < bays - 1 ? pier / 2 : 0)
      runs.push([[a[0] + t[0] * s, a[1] + t[1] * s], [a[0] + t[0] * e, a[1] + t[1] * e], n, n])
    }
  }
  for (let k = Math.floor(lo0 / g.group); k * g.group < hi0; k++) {
    const lo = Math.max(k * g.group + g.spandrel / 2, lo0), hi = Math.min((k + 1) * g.group - g.spandrel / 2, hi0)
    if (hi - lo < 2.5) continue
    for (const [A, B, nA, nB] of runs) {
      // offset along the vertex normal, scaled so the panel stays `proud` off both facets
      const off = (p: XY, m: XY): XY => { const c = Math.max(0.5, m[0] * n[0] + m[1] * n[1]); return [p[0] + (m[0] * proud) / c, p[1] + (m[1] * proud) / c] }
      const P = off(A, nA), Q = off(B, nB)
      const N = (v: XY): V3 => [v[0], v[1], 0]
      part.tri([P[0], P[1], lo], [Q[0], Q[1], lo], [Q[0], Q[1], hi], undefined, undefined, undefined, [N(nA), N(nB), N(nB)])
      part.tri([P[0], P[1], lo], [Q[0], Q[1], hi], [P[0], P[1], hi], undefined, undefined, undefined, [N(nA), N(nB), N(nA)])
    }
  }
}

/** Local metres of lon/lat about an anchor (equirectangular; fine over a block). */
export function localizer(lng0: number, lat0: number) {
  const kx = 111320 * Math.cos((lat0 * Math.PI) / 180), ky = 110574
  return (p: [number, number]): XY => [(p[0] - lng0) * kx, (p[1] - lat0) * ky]
}

export function finishGlb(id: string, name: string, parts: { part: Part; material: Swatch }[], extras: Record<string, unknown>, maxTri = 5000) {
  const live = parts.filter((p) => p.part.triangles)
  const triangles = live.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > maxTri) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(name, live, { license: 'CC0-1.0', elevation: 0, frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground', ...extras })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  return { glb, triangles }
}


// ---------------------------------------------------------------- more helpers (mine)

/** Model coordinates of a lon/lat for an anchor and a placement bearing (degrees). */
export function framer(lng0: number, lat0: number, bearing: number) {
  const loc = localizer(lng0, lat0), b = (bearing * Math.PI) / 180
  return (p: [number, number]): XY => {
    const [E, N] = loc(p)
    return [E * Math.cos(b) - N * Math.sin(b), E * Math.sin(b) + N * Math.cos(b)]
  }
}

/** The walls between two rings with the same corners (bottom at z0, top at z1), flat-shaded. */
export function loftRings(part: Part, bot: XY[], top: XY[], z0: number, z1: number, skip?: (i: number) => boolean) {
  for (let i = 0; i < bot.length; i++) {
    if (skip?.(i)) continue
    const j = (i + 1) % bot.length
    part.quad([bot[i][0], bot[i][1], z0], [bot[j][0], bot[j][1], z0], [top[j][0], top[j][1], z1], [top[i][0], top[i][1], z1])
  }
}

/**
 * Window panels on a planar (possibly leaning) face. `at(s, z)` is the point
 * on the face, already pushed `proud` off it; panels are bays of a grid of
 * width `bay` from s = 0, clipped to [s0, s1], with `pier` between them.
 */
export function facePanels(part: Part, at: (s: number, z: number) => V3, s0: number, s1: number, z0: number, z1: number, bay: number, pier: number, flip = false, minW = 1.5) {
  if (z1 - z0 < 1) return
  for (let k = Math.floor(s0 / bay); k * bay < s1; k++) {
    const a = Math.max(s0, k * bay + pier / 2), b = Math.min(s1, (k + 1) * bay - pier / 2)
    if (b - a < minW) continue
    if (flip) part.quad(at(b, z0), at(a, z0), at(a, z1), at(b, z1))
    else part.quad(at(a, z0), at(b, z0), at(b, z1), at(a, z1))
  }
}

/** Split [z0, z1] at the group boundaries `gz` (ascending). */
export function groupsIn(gz: number[], z0: number, z1: number): [number, number][] {
  const cuts = [z0, ...gz.filter((g) => g > z0 + 0.01 && g < z1 - 0.01), z1]
  return cuts.slice(1).map((b, i) => [cuts[i], b] as [number, number])
}

/**
 * A comb of triangular fins standing on a ring's edges, both faces drawn: a
 * solid band from z0 to zb, teeth from zb to z1, about `w` metres apart.
 */
export function finComb(part: Part, ring: XY[], z0: number, zb: number, z1: number, w: number) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.3) continue
    const P = (t: number, z: number): V3 => [a[0] + ((b[0] - a[0]) * t) / L, a[1] + ((b[1] - a[1]) * t) / L, z]
    const both = (p: V3, q: V3, r: V3) => { part.tri(p, q, r); part.tri(p, r, q) }
    both(P(0, z0), P(L, z0), P(L, zb)); both(P(0, z0), P(L, zb), P(0, zb))
    const n = Math.max(1, Math.round(L / w)), d = L / n
    for (let k = 0; k < n; k++) both(P(k * d, zb), P((k + 1) * d, zb), P((k + 0.5) * d, z1))
  }
}

// ---------------------------------------------------------------- the model

export const RST_ANCHOR: [number, number] = [-122.3348815, 47.6090211]
export const RST_BEARING = 328.8

function build() {
  const glassWall = new Part(), band = new Part(), roof = new Part()

  // The east edge of the tower and skirt against height, through the outer
  // corners of OSM's floor-by-floor steps (the lidar agrees to about a metre):
  // a smooth concave sweep, drawn as one lofted face rather than storey steps.
  const KNOTS: [number, number][] = [
    [25.9, 43.1], [34.28, 37.5], [42.66, 32.0], [51.04, 27.7], [59.42, 23.9], [67.8, 20.6], [76.18, 17.7],
    [84.56, 15.3], [88.75, 14.1], [97.14, 12.1], [109.71, 10.0], [126.47, 7.9], [147.42, 6.2], [160, 4.1],
  ]
  const xeOf = (z: number) => {
    if (z <= KNOTS[0][0]) return KNOTS[0][1]
    for (let i = 1; i < KNOTS.length; i++) {
      const [z0, x0] = KNOTS[i - 1], [z1, x1] = KNOTS[i]
      if (z <= z1) return x0 + ((x1 - x0) * (z - z0)) / (z1 - z0)
    }
    return KNOTS[KNOTS.length - 1][1]
  }
  const ROOF = 255, TOP = 259.5
  const XW = -32.2, YN = 43.7
  // The south face leans out from y 7.0 at 147 m to 0.5 at 26 m (OSM).
  const ys = (z: number) => (z <= 25.9 ? 0.5 : z >= 147.42 ? 7.0 : 0.5 + (6.5 * (z - 25.9)) / (147.42 - 25.9))
  // The 4th Avenue / Union Street corner is scooped below 88.75 m.
  const CURVE: XY[] = [[-20.6, 43.7], [-22.2, 42.1], [-24.0, 40.8], [-25.9, 39.6], [-28.0, 38.7], [-30.2, 38.1], [-32.2, 37.8]]
  const SCOOP = 88.75
  /** The plan at height z, pushed `off` outward (for bands standing proud of the glass). */
  const ringAt = (z: number, off = 0, lower = z < SCOOP): XY[] => {
    const xe = xeOf(z) + off, y0 = ys(z) - off, xw = XW - off, yn = YN + off
    let corner: XY[] = [[xw, yn]]
    if (lower) {
      const c = ccw([[XW, 0], [10, 0], [10, YN], ...CURVE])
      // the scoop is full depth up to 40 m and dies away into the square
      // corner at 88.75 m, a swoosh of curved glass rather than a ledge
      const f = Math.max(0.02, Math.min(1, (SCOOP - z) / (SCOOP - 40)))
      corner = CURVE.map((p) => {
        const i = c.findIndex((q) => q[0] === p[0] && q[1] === p[1])
        const n = vertexNormal(c, i, 60) ?? outward(c[(i - 1 + c.length) % c.length], p)
        const q: XY = [XW + (p[0] - XW) * f, YN + (p[1] - YN) * f]
        return [q[0] + n[0] * off, q[1] + n[1] * off] as XY
      })
    }
    return chamfer([[xw, y0], [xe, y0], [xe, yn], ...corner], 0.6)
  }
  // Two stacks: the scooped one below 88.75 m, the square one above.
  const LOWER = [0, 25.9, 34.28, 40, 46.85, 51.04, 59.42, 67.8, 76.18, 84.56, SCOOP]
  const UPPER = [SCOOP, 97.14, 109.71, 126.47, 147.42, 160, ROOF]
  const stack = (levels: number[], lower: boolean) => {
    for (let k = 0; k + 1 < levels.length; k++) {
      const z0 = levels[k], z1 = levels[k + 1]
      const bot = ringAt(z0, 0, lower), top = ringAt(z1, 0, lower)
      for (let i = 0; i < bot.length; i++) {
        const j = (i + 1) % bot.length
        // the chamfered corners are the pale vertical lines
        const short = Math.hypot(bot[j][0] - bot[i][0], bot[j][1] - bot[i][1]) < 1
        ;(short ? band : glassWall).quad([bot[i][0], bot[i][1], z0], [bot[j][0], bot[j][1], z0], [top[j][0], top[j][1], z1], [top[i][0], top[i][1], z1])
      }
    }
  }
  stack(LOWER, true)
  stack(UPPER, false)
  // plain pale parapet over the roof
  const pr = ringAt(ROOF, 0, false)
  loftRings(band, pr, pr, ROOF, TOP)
  capRing(roof, pr, TOP)
  // faint floor bands every six office storeys, standing just proud of the glass
  for (let z = 25.9 + 25.14; z < ROOF - 6; z += 25.14) {
    const lower = z + 0.9 < SCOOP
    loftRings(band, ringAt(z, 0.06, lower), ringAt(z + 0.9, 0.06, lower), z, z + 0.9)
  }

  // The podium, the 4th Avenue block and the low retail south of the tower.
  const prisms: Prism[] = [
    { ring: ccw([[-32.2, -10.5], [-11.4, -10.5], [-11.4, -16.4], [43.2, -16.4], [43.2, 0.5], [-32.2, 0.5]]), z1: 16, wall: glassWall, roof, kind: 'podium' },
    { ring: ccw([[-32.1, -57.6], [-11.4, -57.6], [-11.4, -10.5], [-32.1, -10.5]]), z1: 44, wall: glassWall, roof, kind: 'block' },
    { ring: ccw([[-32.1, -64], [0.5, -64], [0.5, -16.4], [-11.4, -16.4], [-11.4, -57.6], [-32.1, -57.6]]), z1: 14, wall: glassWall, roof, kind: 'low' },
    { ring: ccw([[-20.4, -46.4], [-11.9, -46.4], [-11.9, -17.4], [-20.4, -17.4]]), z0: 44, z1: 50, wall: glassWall, roof, kind: 'pent' },
    // the skirt's footprint, so the podium hides nothing it shouldn't
    { ring: ccw([[XW, 0.5], [43.1, 0.5], [43.1, YN], [XW, YN]]), z1: 25.9, wall: new Part(), roof: new Part(), kind: 'ghost' },
  ]
  for (const P of prisms) {
    if (P.kind === 'ghost') continue
    P.ring = chamfer(P.ring, 0.5)
    const r = P.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = Math.max(P.z0 ?? 0, edgeBase(prisms, P, i))
      if (z0 >= P.z1 - 0.01) continue
      // light glass with a pale parapet line, like the tower
      if (P.z1 - 1 > z0) wallEdge(P.wall, r, i, z0, P.z1 - 1)
      wallEdge(band, r, i, Math.max(z0, P.z1 - 1), P.z1)
    }
    capRing(P.roof, r, P.z1)
  }

  return finishGlb('sea-rainier-square-tower', 'Rainier Square Tower', [
    { part: glassWall, material: { ...PALETTE.window, color: 0xa9bfd1 } },
    { part: band, material: finish('rst-silver', 0xdfe5ea, 0.5) },
    { part: roof, material: PALETTE.roof },
  ], { bearing: RST_BEARING, height: TOP, replaces: RST_REPLACES })
}

export const RST_REPLACES = ['way/686348108', ...[
  92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118,
].map((n) => `way/686348${String(n).padStart(3, '0')}`)]

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/sea-rainier-square-tower.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
