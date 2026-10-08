/**
 * Seattle Central Library — procedural, CC0-1.0.
 * bun generators/sea-central-library.ts        (GRID=0 for the plain skin)
 *
 * Map frame: x east, y north, z up, metres; origin at the OSM outline's
 * centroid, on the lowest ground under the footprint (the 4th Avenue and
 * Madison Street corner). Built in the block's own frame: x runs from 4th
 * Avenue to 5th Avenue, y from Madison Street to Spring Street, and the model
 * is placed at bearing 328.3° so those line up with the street grid.
 *
 * OMA / Rem Koolhaas with LMN, 2004. Platforms stacked off-centre (the
 * glazed base, the living room, the mixing chamber, the book spiral, the
 * reading room and the offices on top) with one diamond-grid glass skin
 * pulled taut between their edges, so the envelope is a set of flat facets:
 * roofs that slope down to the street, undersides that lean out over it, and
 * cantilevers on every side.
 *
 * The model is that envelope as five overlapping volumes, each a stack of
 * horizontal sections lofted into one another, and the skin's diamond grid
 * drawn coarsely as broad flush steel strips on every facet.
 *
 * Evidence:
 * - Lidar (USGS 3DEP WA_KingCo_1_2021, 0.5 m), every upward-facing surface:
 *   the roof plateau at 54 m above the tile's lowest ground (51.3 m model),
 *   43 m x 55 m; the reading room's glass roof sloping down 12–13 m to edges
 *   at 42 m on the 4th Avenue and Spring Street sides, its south corner
 *   chamfered; the mixing-chamber ledge at 24 m standing 3 m proud of the 4th
 *   Avenue face from Spring to two-thirds of the way to Madison; the living
 *   room's skin on Madison sloping from 22 m down to 14 m at the street
 *   edge; the penthouse at 62 m. The ground falls 10 m from 5th Avenue to
 *   4th Avenue, so the base is two storeys on 4th and buried under 5th.
 * - OSM way/37056442 (outline, height 60) and its four roof parts: the
 *   outermost extents, 71 m x 74 m, and the south corner's chamfer.
 * - Photos (credits in /tmp/city/sea/work/sea-central-library/credits.txt):
 *   the faces lidar can't see — the glazed base, the undersides of the
 *   offices' cantilever over 5th Avenue and Madison, the book spiral's
 *   set-back faces, the tall glass triangle at the south corner — read from
 *   views at the 4th/Madison, 5th/Madison and 4th/Spring corners and up 5th
 *   Avenue. Those heights and set-backs are estimates, good to a few metres.
 * - Simplified: the chamfered corners are square except the south one; the
 *   skin's grid (real diamonds about 2.5 m x 4 m) is drawn at about 7 m x
 *   12 m so it reads without shimmering.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const GRID = process.env.GRID !== '0'
const Z0 = 2.7 // the lowest ground, 4th Avenue at Madison, above the lidar tile's minimum

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (a: V3) => mul(a, 1 / Math.hypot(...a))

/**
 * The envelope as five overlapping volumes, each a stack of horizontal
 * sections lofted into one another. A section is a list of corners (u, v):
 * u from Spring Street (−) to Madison Street (+), v from 4th Avenue (−) to
 * 5th Avenue (+), metres from the outline's centroid, counter-clockwise from
 * above starting at the south (4th/Madison) corner; z is height above the
 * lidar tile's minimum, and a corner may carry its own. Between two sections
 * every face is flat, or folds into two triangles where a corner moves on its
 * own, as the skin does.
 */
type UV = [number, number] | [number, number, number]
type Section = { z: number; c: UV[] }
const VOLUMES: Section[][] = [
  // The glazed base, set back under the overhangs (photos).
  [
    { z: 0, c: [[34, -31], [34, 35], [-31, 35], [-31, -31]] },
    { z: 13, c: [[34, -31], [34, 35], [-31, 35], [-31, -31]] },
  ],
  // The living room: its skin slopes from the street edge on Madison (lidar:
  // 14 m at u = 36, 19 m at u = 30, 22 m at u = 27) and on 5th up to the
  // spiral's foot. Its 4th Avenue side is the tall glass triangle under the
  // chamfered south corner (OSM outline, lidar: the skin's edge runs from
  // (20, −34) to (36, −26)), its foot climbing from the Madison skin's edge
  // to the end of the ledge (photo from the 4th & Madison Building).
  [
    { z: 13.5, c: [[13, -37, 20], [36.5, -26], [36.5, 37], [-31, 37], [-31, -34]] },
    { z: 26, c: [[20, -33.6], [22.5, -32.5], [22.5, 22.5], [-28, 22.5], [-28, -33.6]] },
  ],
  // The mixing chamber's ledge over 4th Avenue and Spring: an underside
  // leaning out from the base, a 6 m face, a top sloping back to the face
  // above (lidar: 24 m at v = −36, running from Spring to u = 13).
  [
    { z: 12.5, c: [[13, -31], [13, 22], [-31, 22], [-31, -31]] },
    { z: 18.5, c: [[13, -38], [13, 22], [-35.5, 22], [-35.5, -38]] },
    { z: 24.5, c: [[13, -38], [13, 22], [-35.5, 22], [-35.5, -38]] },
    { z: 26.5, c: [[13, -34], [13, 22], [-33.5, 22], [-33.5, -34]] },
  ],
  // The book spiral and the reading room: vertical faces on 4th and Spring
  // up to 42 m, then the reading room's glass roof sloping up to the plateau
  // (lidar), its south corner climbing diagonally from (21, −33) at 42 m to
  // (27.5, −18) at 54 m. On Madison and 5th the spiral stands back under the
  // offices, furthest at the east corner (photos from 5th/Madison). Each
  // face's top and bottom edges are kept parallel, so every facet is flat.
  [
    { z: 25.5, c: [[22, -33.5], [14, 22], [-33, 30], [-33, -33.5]] },
    { z: 42, c: [[22, -33], [13.9, 23.2], [-33, 31.2], [-33, -33]] },
    { z: 53.9, c: [[27.5, -18], [21.2, 26], [-15, 32.2], [-15, -18]] },
  ],
  // The offices on top, cantilevered over Madison and 5th. Their underside
  // springs from the spiral's faces along a line that drops from 41 m at the
  // south end to 28 m at the east corner and along 5th, so the overhang is
  // deepest there, 15 m (photos from 4th/Madison, 5th/Madison and up 5th);
  // the roof plateau is the lidar's, 54 m.
  [
    { z: 39, c: [[21.5, -18, 41], [13, 21.5, 28], [-15, 21.5, 28], [-15, -18, 41]] },
    { z: 46, c: [[28, -18], [28, 37], [-15, 37], [-15, -18]] },
    { z: 54, c: [[28, -18], [28, 37], [-15, 37], [-15, -18]] },
  ],
]

// Model x runs toward 5th Avenue (v), model y toward Spring Street (−u).
const ring = (s: Section): V3[] => s.c.map(([u, v, z]) => [v, -u, (z ?? s.z) - Z0] as V3)

const base = new Part(), clear = new Part(), skin = new Part(), roof = new Part(), grid = new Part()

// --- The coarse diamond grid ----------------------------------------------------
const DW = 12, DH = 16  // a diamond's width along the face and height up it
const GW = 0.8          // strip width
const LIFT = 0.04       // strips sit just proud of the glass

/**
 * Flush strips along the diamond grid's two families of diagonals, each one
 * piece from edge to edge of a flat facet, cut exactly at the facet's
 * outline. The grid is laid out in the facet's plane: s along its level
 * edge, from its own end, with the diamond's width stretched a little so a
 * whole number fits; t is the height on a vertical face, and on a sloped one
 * the height of its lower edge plus the distance up the slope, so lines meet
 * at the corners and folds wherever the faces allow.
 */
function diamonds(poly: V3[]) {
  const n = unit(cross(sub(poly[1], poly[0]), sub(poly[2], poly[0])))
  if (Math.abs(n[2]) > 0.97) return // roofs and soffits stay plain
  const h = unit(cross([0, 0, 1], n)), t = cross(n, h)
  const low = poly.reduce((m, p) => (p[2] < m[2] ? p : m), poly[0])
  const s0 = Math.min(...poly.map((p) => dot(p, h)))
  const to2 = (p: V3) => [dot(p, h) - s0, low[2] + dot(sub(p, low), t)]
  const o = add(sub(low, add(mul(h, dot(low, h) - s0), mul(t, low[2]))), mul(n, LIFT))
  const to3 = (x: number, y: number): V3 => add(o, add(mul(h, x), mul(t, y)))
  let P = poly.map(to2)
  P = P.filter((p, i) => Math.hypot(p[0] - P[(i + 1) % P.length][0], p[1] - P[(i + 1) % P.length][1]) > 0.05)
  if (P.length < 3) return
  if (signedArea(P) < 0) P.reverse()
  const width = Math.max(...P.map((p) => p[0]))
  const dw = width / Math.max(1, Math.round(width / DW))
  for (const sign of [1, -1]) {
    const d: [number, number] = [1 / dw, sign / DH]
    const vals = P.map(([x, y]) => d[0] * x + d[1] * y)
    for (let k = Math.ceil(Math.min(...vals) - 0.5); k <= Math.floor(Math.max(...vals) + 0.5); k++) {
      // The line's strip, overlong, then cut to the facet.
      const dl = Math.hypot(d[0], d[1]), nx = d[0] / dl, ny = d[1] / dl
      const c = [nx * k / dl, ny * k / dl], ex = -ny * 400, ey = nx * 400, wx = nx * GW / 2, wy = ny * GW / 2
      const strip = [[c[0] - ex - wx, c[1] - ey - wy], [c[0] + ex - wx, c[1] + ey - wy], [c[0] + ex + wx, c[1] + ey + wy], [c[0] - ex + wx, c[1] - ey + wy]]
      const cut = clipPoly(strip, P)
      if (cut.length < 3 || Math.abs(signedArea(cut)) < 0.05) continue
      const Q = cut.map(([x, y]) => to3(x, y))
      const fwd = dot(cross(sub(Q[1], Q[0]), sub(Q[2], Q[0])), n) > 0
      for (let i = 1; i < Q.length - 1; i++) fwd ? grid.tri(Q[0], Q[i], Q[i + 1]) : grid.tri(Q[0], Q[i + 1], Q[i])
    }
  }
}
const signedArea = (P: number[][]) => P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
/** Sutherland–Hodgman: a polygon cut to a convex counter-clockwise one. */
function clipPoly(S: number[][], C: number[][]): number[][] {
  let out = S
  for (let i = 0; i < C.length && out.length; i++) {
    const a = C[i], b = C[(i + 1) % C.length]
    const inside = (p: number[]) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) >= 0
    const hit = (p: number[], q: number[]) => {
      const d1 = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])
      const d2 = (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0])
      const f = d1 / (d1 - d2)
      return [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f]
    }
    const inp = out
    out = []
    for (let j = 0; j < inp.length; j++) {
      const p = inp[j], q = inp[(j + 1) % inp.length]
      if (inside(q)) { if (!inside(p)) out.push(hit(p, q)); out.push(q) }
      else if (inside(p)) out.push(hit(p, q))
    }
  }
  return out
}

/**
 * A facet's material follows its slope, as the real skin's look does:
 * roofs and sloped skins read silvery, the vertical walls of clear glass a
 * shade darker; the base is its own glazing, with no grid. A four-cornered
 * facet that is flat gets one grid; one that folds is two triangles.
 */
function facet(isBase: boolean, q: V3[]) {
  const tris = (pts: V3[]) => {
    const n = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
    const l = Math.hypot(...n)
    return l < 1e-6 ? null : mul(n, 1 / l)
  }
  const n1 = tris([q[0], q[1], q[2]]) ?? tris([q[0], q[2], q[3]])
  if (!n1) return
  const flat = Math.abs(dot(n1, sub(q[3], q[0]))) < 0.05 && Math.abs(dot(n1, sub(q[2], q[0]))) < 0.05
  const groups = flat ? [q] : [[q[0], q[1], q[2]], [q[0], q[2], q[3]]]
  for (const g of groups) {
    const n = tris(g.length === 4 && !tris([g[0], g[1], g[2]]) ? [g[0], g[2], g[3]] : g)
    if (!n) continue
    const target = isBase ? base : Math.abs(n[2]) > 0.25 ? skin : clear
    for (let i = 1; i < g.length - 1; i++) if (tris([g[0], g[i], g[i + 1]])) target.tri(g[0], g[i], g[i + 1])
    if (GRID && !isBase) diamonds(g)
  }
}
VOLUMES.forEach((vol, i) => {
  const rings = vol.map(ring)
  for (let k = 0; k < rings.length - 1; k++) {
    const r0 = rings[k], r1 = rings[k + 1], n = r0.length
    for (let j = 0; j < n; j++) {
      const l = (j + 1) % n
      facet(i === 0, [r0[j], r0[l], r1[l], r1[j]])
    }
  }
  const top = rings[rings.length - 1], bot = rings[0]
  if (i === VOLUMES.length - 1) roof.cap(top, true)
  else if (i !== 3) skin.cap(top, true)
  if (i !== 0) skin.cap(bot, false)
})

// The penthouse on the roof (lidar: 8 m over the plateau).
{
  const z0 = 54 - Z0, z1 = 62 - Z0
  const box = (z: number): V3[] => [[-16, -19, z], [-10, -19, z], [-10, -6, z], [-16, -6, z]]
  roof.loft([box(z0), box(z1)])
  roof.cap(box(z1), true)
}

// --- Materials ------------------------------------------------------------------
// The skin reads silvery pale grey-blue in daylight (glass with an expanded
// metal mesh between its panes), the clear glass of the vertical walls a
// shade darker, the street-level glazing darker again but of the same family;
// the grid is the steel's grey.
const SKIN = windowVariant(2, 0xbccad5)
const CLEAR = windowVariant(3, 0x9fb3c4)
const BASE = windowVariant(4, 0x91a6b7)
const STEEL = finish('steel', 0x7d8893)
const parts = [
  { part: skin, material: SKIN },
  { part: clear, material: CLEAR },
  { part: base, material: BASE },
  { part: roof, material: PALETTE.roof },
  { part: grid, material: STEEL },
]
const triangles = parts.reduce((n, p) => n + p.part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Seattle Central Library', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: 62 - Z0, bearing: 328.3,
})
await Bun.write(new URL('../models/sea-central-library.glb', import.meta.url), glb)
console.log(`sea-central-library.glb: ${triangles} triangles, ${glb.length} bytes${GRID ? '' : ' (plain)'}`)
