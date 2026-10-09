/**
 * 30 Hudson Yards — procedural, CC0-1.0, no textures.
 * bun generators/nyc-30-hudson-yards.ts
 *
 * Also the small glass-tower kit for this builder's Hudson Yards models
 * (`wall`, `volume`, `fan`): walls that may lean and have sloping tops, laid
 * with broad glass bays between pale piers. The model is only written when
 * this file is run directly.
 *
 * Map frame: x = model east (Tenth Avenue), y = model north (West 33rd
 * Street), z up, metres. Placed at bearing 29°, the Manhattan grid. Anchor:
 * area centroid of the OSM outline way/264656626.
 *
 * Evidence
 * - OSM way/264656626 and its parts, which map the tower as interlocking
 *   volumes:
 *   - the tall north-west volume (1485848980–82, 395 m), whose east face is
 *     a skillion leaning from x 10.6 at 140 m to x −19 at the top;
 *   - the lower south-east volume (1485516282/83, 310 m) wrapping it on the
 *     south and east, its east face leaning from x 17.7 at 130 m to x −0.4;
 *   - the Tenth Avenue podium (1485516277/78/80/81, 130–140 m, its avenue
 *     face leaning from 20 m to 130 m) and a 10 m strip (1485516279);
 *   - the Edge deck (1485516284, 335–340 m), a triangle on the south side
 *     reaching east past the tower's east face.
 * - Published: roof 387 m (1,270 ft), 73 floors, Kohn Pedersen Fox, 2019.
 *   Edge: outdoor deck on the 100th floor at 335 m (1,100 ft), jutting
 *   about 24 m (80 ft) (Wikipedia). The tall volume's top here peaks at
 *   387 m, the published roof, not OSM's 395 m.
 * - No lidar: the 2017 USGS flight predates the top of the tower.
 * - Photos (Wikimedia Commons, daylight; from the south on the High Line,
 *   from the north-east, from the west across the Hudson, from below):
 *   /tmp/city/nyc/work/nyc-30-hudson-yards/photos/credits.txt.
 *
 * The photos fix the top: it is cut by one sloping plane, highest at the
 * south-east corner (seen from the south it rises to the east, from the
 * north-east it rises to the south), and the Edge's wedge hangs under its
 * deck, pointing east from the south-east corner. The plane's fall (37 m to
 * the south-west and north-east corners, a flat roof at 345 m beyond) is
 * estimated from the photos, as are the Edge's soffit depth (18 m) and its reach (27 m, drawn a little bolder than the published 24 m), the
 * pale louvre band at the top of the south-east volume, the bay width and
 * the four-storey panel rhythm. The south face's 4 m lean is left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { finishModel, capPoly, type XY } from './nyc-570-lexington'

// ===========================================================================
// Kit
// ===========================================================================

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const nrm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

export type Bays = {
  /** Target bay pitch, metres, and the pier width between bays. */
  bay: number; pier: number
  /** Panel row height (storeys × floor height) and the spandrel between rows. */
  row: number; brk: number
  /** Solid wall kept at the bottom and under the top edge. */
  foot?: number; head?: number
  /** Walls narrower than this get no panels. */
  minWidth?: number
}

/**
 * One planar wall: bottom edge a→b (counter-clockwise ring order, so it
 * faces out), top edge A→B above it. The top may slope (A and B at
 * different heights) and the wall may lean (A, B offset from a, b). Backing
 * in `back`, then glass panels 0.06 m proud in bays and rows of absolute
 * height; panel tops follow a sloping top edge.
 */
export function wall(a: V3, b: V3, A: V3, B: V3, back: Part, glass: Part | null, f: Bays | null) {
  back.quad(a, b, B, A)
  if (!glass || !f) return
  const n = nrm(crs(sub(b, a), sub(A, a)))
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < (f.minWidth ?? 4)) return
  const bot = (u: number) => lerp3(a, b, u), top = (u: number) => lerp3(A, B, u)
  const at = (u: number, z: number): V3 => {
    const p = bot(u), q = top(u), t = (z - p[2]) / (q[2] - p[2])
    const r = lerp3(p, q, t)
    return [r[0] + n[0] * 0.06, r[1] + n[1] * 0.06, r[2] + n[2] * 0.06]
  }
  const foot = f.foot ?? f.brk, head = f.head ?? f.brk
  const z0 = Math.max(a[2], b[2]) + foot, z1 = Math.max(A[2], B[2]) - head
  if (z1 - z0 < f.row * 0.5) return
  const rows = Math.max(1, Math.round((z1 - z0) / f.row)), rh = (z1 - z0) / rows
  const bays = Math.max(1, Math.round(L / f.bay)), pu = f.pier / 2 / L
  for (let k = 0; k < bays; k++) {
    const u0 = k / bays + pu, u1 = (k + 1) / bays - pu
    const lim0 = top(u0)[2] - head, lim1 = top(u1)[2] - head
    for (let r = 0; r < rows; r++) {
      const lo = z0 + r * rh + (r ? f.brk / 2 : 0), hi = z0 + (r + 1) * rh - (r < rows - 1 ? f.brk / 2 : 0)
      const h0 = Math.min(hi, lim0), h1 = Math.min(hi, lim1)
      if (h0 - lo < 2 && h1 - lo < 2) continue
      glass.quad(at(u0, lo), at(u1, lo), at(u1, Math.max(lo + 0.5, h1)), at(u0, Math.max(lo + 0.5, h0)))
    }
  }
}

/**
 * A volume lofted through rings (same vertex count, counter-clockwise from
 * above, any z per vertex). `skin(level, edge)` picks each wall's glass and
 * bays, or null for a plain or hidden wall. The top ring is capped with a
 * fan when `roof` is given (it must be planar and convex) or left open.
 */
export function volume(rings: V3[][], back: Part, skin: (level: number, edge: number) => [Part, Bays] | null, roof: Part | null) {
  const n = rings[0].length
  for (let k = 0; k < rings.length - 1; k++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, s = skin(k, i)
    wall(rings[k][i], rings[k][j], rings[k + 1][i], rings[k + 1][j], back, s ? s[0] : null, s ? s[1] : null)
  }
  if (roof) fan(roof, rings[rings.length - 1])
}

/** A convex planar polygon, counter-clockwise from above, as an up-facing fan. */
export function fan(p: Part, poly: V3[]) {
  for (let i = 1; i < poly.length - 1; i++) p.tri(poly[0], poly[i], poly[i + 1])
}

export const at = (r: XY[], z: number): V3[] => r.map(([x, y]) => [x, y, z])

// ===========================================================================
// 30 Hudson Yards
// ===========================================================================

function build() {
  // The south-east volume's roof: OSM says 310 m; photos from the south and
  // north-east put it 35–40 m under the Edge's deck, so 298 m.
  const SE_TOP = 298
  const glass = new Part(), facet = new Part(), pier = new Part(), roof = new Part(), edge = new Part()
  const B: Bays = { bay: 6.2, pier: 1.6, row: 17.6, brk: 1.6, foot: 6, head: 2 }
  const band: Bays = { ...B, head: 11 } // the louvre band under the 310 m roof

  // The tall north-west volume: plumb to 140 m, then the east face leans to
  // x −19; the top is one plane falling from 387 m at the south-east corner
  // to 350 m at the south-west and north-east corners, flat at 345 m beyond.
  const W = -56.6, E0 = 10.6, E1 = -19, S = -15, N = 27.8
  const zTop = (x: number, y: number) => Math.max(345, 387 - 37 * (E1 - x) / (E1 - W) - 37 * (y - S) / (N - S))
  // Where the plane meets 345 m on the north and west faces.
  const xN = E1 - (E1 - W) * 5 / 37, yClamp = S + (N - S) * 5 / 37
  const top: V3[] = ([[E1, S], [E1, N], [xN, N], [W, N], [W, yClamp], [W, S]] as XY[]).map(([x, y]) => [x, y, zTop(x, y)])
  // Keep the lower rings' north-face vertex under the top one.
  const lower = (z: number): V3[] => [[E0, S, z], [E0, N, z], [xN, N, z], [W, N, z], [W, yClamp, z], [W, S, z]]
  volume([lower(0), lower(140), top], pier, (lvl, i) => (i === 0 && lvl === 1 ? [facet, B] : [glass, B]), null)
  // Top: the sloping facet and the flat roof beyond it.
  const [tSE, tNE, tNc, tNW, tWc, tSW] = top
  fan(facet, [tSE, tNE, tNc, tWc, tSW])
  fan(roof, [tNc, tNW, tWc])

  // The south-east volume, wrapping the tall one; east face leans above 130 m.
  const s0: XY[] = [[-50, -29], [17.7, -29], [17.7, 20], [-50, 20]]
  const s1: XY[] = [[-50, -29], [-4, -29], [-4, 20], [-50, 20]]
  volume([at(s0, 0), at(s0, 130), at(s1, SE_TOP)], pier, (lvl, i) => (i === 3 ? null : i === 1 && lvl === 1 ? [facet, band] : [glass, lvl === 1 ? band : B]), roof)

  // The Tenth Avenue podium: 130 m with the avenue face leaning in from
  // 20 m, a 133 m north part behind a diagonal, a 10 m strip at the corner.
  const p0: XY[] = [[17.7, -29], [55, -29], [55, 12.4], [17.7, 12.4]]
  const p1: XY[] = [[17.7, -29], [40, -29], [40, 12.4], [17.7, 12.4]]
  volume([at(p0, 0), at(p0, 20), at(p1, 130)], pier, (lvl, i) => (i === 3 || i === 2 ? null : i === 1 && lvl === 1 ? [facet, B] : [glass, B]), roof)
  const pn: XY[] = [[17.7, 12.4], [38.5, 12.4], [52.5, 27.5], [17.7, 27.5]]
  volume([at(pn, 0), at(pn, 133)], pier, (_, i) => (i === 3 ? null : [glass, B]), null)
  capPoly(roof, pn, 133)
  const low: XY[] = [[38.5, 12.4], [55, 12.4], [60.1, 21.4], [56.8, 29.1], [30.2, 29.1], [30.2, 27.5], [52.5, 27.5]]
  volume([at(low, 0), at(low, 10)], pier, () => null, null)
  capPoly(roof, low, 10)

  // The Edge: a triangular deck at 335 m reaching east past the tower's east
  // face along the south side, its soffit a wedge falling to the corner.
  const zd = 335, faceX = E1 + (E0 - E1) * (387 - zd) / (387 - 140) // east face at deck height
  const dA: V3 = [-46.6, -19.5, zd], dB: V3 = [faceX + 27, -19.5, zd], dC: V3 = [-11, 16, zd]
  const lift = (p: V3, dz: number): V3 => [p[0], p[1], p[2] + dz]
  // Deck slab (3 m, with the glass parapet's height folded in).
  const deck = [dA, dB, dC]
  for (let i = 0; i < 3; i++) { const a = deck[i], b = deck[(i + 1) % 3]; edge.quad(a, b, lift(b, 3), lift(a, 3)) }
  roof.tri(lift(dA, 2.9), lift(dB, 2.9), lift(dC, 2.9))
  // Soffit: from the deck's three corners down to a point at the tower's
  // south-east corner, 14 m below.
  const apex: V3 = [faceX - 1, -17, zd - 18]
  edge.tri(dB, dA, apex); edge.tri(dC, dB, apex); edge.tri(dA, dC, apex)

  finishModel('30 Hudson Yards', 'nyc-30-hudson-yards', [
    { part: glass, material: { ...windowVariant(1, 0xa9bfd1), name: 'window' } },
    { part: facet, material: windowVariant(2, 0x8ea7bb) },
    { part: pier, material: finish('hy30-fin', 0xe6e8e6) },
    { part: roof, material: PALETTE.roof },
    { part: edge, material: finish('hy30-edge', 0xcfc6b8) },
  ], { bearing: 29, osm: 'way/264656626', height: 387 })
}

if (import.meta.main) build()
