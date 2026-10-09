/**
 * Camp North End: the Historic Ford Factory — procedural, CC0-1.0.
 * bun generators/clt-cne-ford-plant.ts
 *
 * Albert Kahn's Ford Motor Company Assembly Plant of 1924 on Statesville
 * Avenue, later the Army Quartermaster depot and missile plant, now the Ford
 * Building at Camp North End (renovated 2021–2023). A single-storey red-brick
 * shed 244 × 93 m, its long axis running a little south of east, with the
 * main front on Statesville Avenue to the west. Its identity, from the street
 * and from above, is the roof: two long raised monitors, each a pair of
 * sawtooth skylights back to back, their tall glazed faces turned outward
 * (one north, one south) and their pale roofs falling to a gutter between
 * them; and the Kahn walls: brick piers with steel window walls between
 * them from a brick knee wall to a brick band under the coping, and on the
 * west front a decorative brick frieze over pilasters.
 *
 * Evidence:
 *  - OSM: way/835067654 (the outline, "Historic Ford Factory", architect
 *    Albert Kahn). Inside it: way/324608492 (an older outline of the same
 *    shed), way/835828574–835828577 (flat roof strips), and the four skillion
 *    parts way/835800986, 835800987, 835800988, 838339976 (height 13, roof
 *    height 6) that are the two monitors' four sawteeth. Their roof:direction
 *    tags agree with the lidar: each tooth's high edge is the monitor's outer
 *    edge.
 *  - Lidar (USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m DSM and ground
 *    returns), sampled in the building's frame: flat roof deck 231.2 m
 *    NAVD88, parapet ~231.9, sawtooth crests 237.2–237.3, the gutter between
 *    each pair 232.4–232.6; the monitors run from 100.5 m west to 108 m east
 *    of the centroid and are 24.8 m wide; the lower east addition 229.05; the
 *    south awning 227.7. Ground 223.9 (north side, the lowest) to 225.1
 *    (south). y = 0 is 223.9 m. The flight predates the 2021–2023
 *    renovation, which kept the massing.
 *  - Charlotte-Mecklenburg Historic Landmarks Commission survey and
 *    designation report, Ford Motor Company Assembly Plant (MacRostie
 *    Historic Advisors, 2019; photos May 2018): single storey, long axis east
 *    to west, the west front of fourteen bays between brick pilasters with a
 *    cast-stone band at the window heads and decorative brick panels (red and
 *    yellow brick, diamond field, chevron capitals) under a dentil cornice,
 *    wrapping two bays round each corner; north, south and east walls of
 *    full-height multi-pane steel windows over a stucco-and-brick knee wall,
 *    in twenty bays; the west front's windows bricked in by the Army; "a
 *    flat roof with four sawtooth portions"; a later metal awning along the
 *    west end of the south wall; a lower brick loading addition on the east.
 *    Floor plan: the 20 × 7 column grid (12.2 m bays).
 *  - S9 Architecture's project page for Camp North End (the renovation's
 *    architect): "refurbished clerestories" — so the sawtooth faces are
 *    glazed again, drawn here as window panels.
 *  - USGS NAIP orthophoto (public domain): the plan, the pale monitor roofs
 *    against the dark grey flat roof.
 *
 * Look-only (not licensed for reuse; described, not copied): the survey
 * report's May 2018 photos (west front, north, east and south walls, the
 * window detail and the south-west corner's brickwork).
 *
 * Estimated: window head and knee heights (the report's photos), the frieze
 * band's height, pier widths, the glazing's height in the monitors, the
 * corner piers' height over the cornice. The west front is drawn as the
 * survey found it, its bays bricked in; whether the renovation reopened them
 * isn't confirmed by any licensed photo. No CC-licensed photo of the plant
 * itself was found on Commons, Openverse or Mapillary.
 *
 * This file also holds the small kit the Camp North End generators share
 * (the building frame, prisms, chamfered piers, wall panels, output). Its own
 * model is built only when it is run directly.
 *
 * Frame: the building's own grid. x runs along the long axis (bearing
 * 96.3°), y across it (bearing 6.3°), z up, metres; the placement's bearing
 * is 6.3. The origin is the outline's centroid, lng −80.8342425,
 * lat 35.2471457.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'

// ---------------------------------------------------------------------------
// Kit.

export type XY = [number, number]
const unit = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
/** A triangle with an explicit normal; winding fixed to agree with it. */
export function tri(p: Part, a: V3, b: V3, c: V3, n?: V3) {
  const e1: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const f: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (Math.hypot(...f) < 1e-9) return
  const N = unit(n ?? f)
  if (f[0] * N[0] + f[1] * N[1] + f[2] * N[2] >= 0) p.tri(a, b, c, undefined, undefined, undefined, [N, N, N])
  else p.tri(a, c, b, undefined, undefined, undefined, [N, N, N])
}
export function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n?: V3) { tri(p, a, b, c, n); tri(p, a, c, d, n) }

/** An axis-aligned box. `top` takes the lid; the bottom is never seen and is left open. */
export function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = p) {
  quad(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  quad(p, [x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [0, 1, 0])
  quad(p, [x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [-1, 0, 0])
  quad(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
  if (top) quad(top, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
}

/**
 * A box with its four upright edges chamfered by `b` and a chamfered lip of
 * `b` round its top: piers, corner blocks, the stack's casing. Soft edges
 * catch the light.
 */
export function softBox(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b: number, top: Part = p) {
  const ring: XY[] = [[x0 + b, y0], [x1 - b, y0], [x1, y0 + b], [x1, y1 - b], [x1 - b, y1], [x0 + b, y1], [x0, y1 - b], [x0, y0 + b]]
  const lid: XY[] = [[x0 + 2 * b, y0 + b], [x1 - 2 * b, y0 + b], [x1 - b, y0 + 2 * b], [x1 - b, y1 - 2 * b], [x1 - 2 * b, y1 - b], [x0 + 2 * b, y1 - b], [x0 + b, y1 - 2 * b], [x0 + b, y0 + 2 * b]]
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const A = ring[i], B = ring[(i + 1) % n], a = lid[i], d = lid[(i + 1) % n]
    const o: V3 = [B[1] - A[1], A[0] - B[0], 0]
    quad(p, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1 - b], [A[0], A[1], z1 - b], o)
    quad(p, [A[0], A[1], z1 - b], [B[0], B[1], z1 - b], [d[0], d[1], z1], [a[0], a[1], z1], [o[0], o[1], Math.hypot(o[0], o[1])])
  }
  for (let i = 1; i < n - 1; i++) tri(top, [lid[0][0], lid[0][1], z1], [lid[i][0], lid[i][1], z1], [lid[i + 1][0], lid[i + 1][1], z1], [0, 0, 1])
}

/**
 * One face of an axis-aligned wall: `side` is the outward direction
 * ('N' +y, 'S' −y, 'E' +x, 'W' −x), `at` the wall's coordinate. `P(a, z, d)`
 * is the point `a` along the face, at height `z`, `d` out from it; `a` runs
 * left to right as seen from outside.
 */
export function face(side: 'N' | 'S' | 'E' | 'W', at: number) {
  const o: XY = side === 'N' ? [0, 1] : side === 'S' ? [0, -1] : side === 'E' ? [1, 0] : [-1, 0]
  const u: XY = [-o[1], o[0]] // left to right as seen from outside
  const base: XY = side === 'N' || side === 'S' ? [0, at] : [at, 0]
  const P = (a: number, z: number, d = 0): V3 => [base[0] + u[0] * a + o[0] * d, base[1] + u[1] * a + o[1] * d, z]
  const N: V3 = [o[0], o[1], 0]
  return {
    o, u, N, P,
    /** The along-face coordinate of a plan point. */
    along: (q: XY) => (q[0] - base[0]) * u[0] + (q[1] - base[1]) * u[1],
    /** A flat panel on the face, `d` proud of it. */
    panel(p: Part, a0: number, a1: number, z0: number, z1: number, d = 0.05) {
      const [l, r] = a0 < a1 ? [a0, a1] : [a1, a0]
      quad(p, P(l, z0, d), P(r, z0, d), P(r, z1, d), P(l, z1, d), N)
    },
    /** A pier standing `d` proud between `a0` and `a1`, its outer edges chamfered by `b`. */
    pier(p: Part, a0: number, a1: number, z0: number, z1: number, d: number, b = 0.12, top: Part = p) {
      const [l, r] = a0 < a1 ? [a0, a1] : [a1, a0]
      quad(p, P(l + b, z0, d), P(r - b, z0, d), P(r - b, z1, d), P(l + b, z1, d), N)
      quad(p, P(l, z0, 0), P(l + b, z0, d), P(l + b, z1, d), P(l, z1, 0), [N[0] - u[0], N[1] - u[1], 0])
      quad(p, P(r - b, z0, d), P(r, z0, 0), P(r, z1, 0), P(r - b, z1, d), [N[0] + u[0], N[1] + u[1], 0])
      quad(top, P(l, z1, 0), P(l + b, z1, d), P(r - b, z1, d), P(r, z1, 0), [0, 0, 1])
    },
  }
}

/**
 * A flat-roofed block with a parapet: walls from `z0` to `top`, a pale
 * chamfered coping, the parapet's inner face and the roof deck `para` below
 * the top.
 */
export function parapetBlock(m: { wall: Part; deck: Part; coping: Part }, x0: number, x1: number, y0: number, y1: number, z0: number, top: number,
  o: { para?: number; cap?: number; ch?: number; open?: ('N' | 'S' | 'E' | 'W')[] } = {}) {
  const para = o.para ?? 0.6, cap = o.cap ?? 0.45, ch = o.ch ?? 0.15, open = o.open ?? []
  const deckZ = top - para
  const sides: ['S' | 'E' | 'N' | 'W', XY, XY][] = [['S', [x0, y0], [x1, y0]], ['E', [x1, y0], [x1, y1]], ['N', [x1, y1], [x0, y1]], ['W', [x0, y1], [x0, y0]]]
  const ins = (q: XY, k: number): XY => [q[0] + (q[0] === x0 ? k : -k), q[1] + (q[1] === y0 ? k : -k)]
  for (const [s, A, B] of sides) {
    if (open.includes(s)) continue
    const n: V3 = s === 'S' ? [0, -1, 0] : s === 'N' ? [0, 1, 0] : s === 'E' ? [1, 0, 0] : [-1, 0, 0]
    quad(m.wall, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], top - ch], [A[0], A[1], top - ch], n)
    const a1 = ins(A, ch), b1 = ins(B, ch), a2 = ins(A, cap), b2 = ins(B, cap)
    quad(m.coping, [A[0], A[1], top - ch], [B[0], B[1], top - ch], [b1[0], b1[1], top], [a1[0], a1[1], top], [n[0], n[1], 1])
    quad(m.coping, [a1[0], a1[1], top], [b1[0], b1[1], top], [b2[0], b2[1], top], [a2[0], a2[1], top], [0, 0, 1])
    quad(m.wall, [b2[0], b2[1], top], [a2[0], a2[1], top], [a2[0], a2[1], deckZ], [b2[0], b2[1], deckZ], [-n[0], -n[1], 0])
  }
  quad(m.deck, [x0 + cap, y0 + cap, deckZ], [x1 - cap, y0 + cap, deckZ], [x1 - cap, y1 - cap, deckZ], [x0 + cap, y1 - cap, deckZ], [0, 0, 1])
}

/** Bays of `count` equal widths between `a0` and `a1`: their [start, end]. */
export const bays = (a0: number, a1: number, count: number) =>
  Array.from({ length: count }, (_, k) => [a0 + ((a1 - a0) * k) / count, a0 + ((a1 - a0) * (k + 1)) / count] as [number, number])

/** Move parts by (dx, dy) so a model's origin is its own anchor. */
export function shift(part: Part, dx: number, dy: number): Part {
  const out = new Part()
  // Part stores glTF order: (x, z, −y).
  out.pos = part.pos.map((v, i) => (i % 3 === 0 ? v - dx : i % 3 === 2 ? v + dy : v))
  out.nrm = part.nrm.slice(); out.uv = part.uv.slice()
  return out
}

export type Built = { id: string; name: string; height: number; parts: { part: Part; material: Swatch }[] }
export async function write(b: Built, budget = 5000) {
  const parts = b.parts.filter((p) => p.part.triangles > 0)
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > budget) throw new Error(`${b.id}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(b.name, parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 6.3, elevation: 0, height: b.height,
  })
  if (glb.length > 256000) throw new Error(`${b.id}: file budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${b.id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${parts.length} materials`)
}

// The palette Camp North End's Kahn buildings share: the red brick pulled to
// the palette's lightness, pale cast stone for bands and copings, slate
// windows, the grey membrane roofs, and the silver of the monitors' metal
// roofs and cladding.
export const BRICK = finish('kahn-brick', 0xb96d58)
export const SILVER = finish('cne-silver', 0xd3d6d9)

/** Base levels, metres NAVD88 (lidar). */
export const FORD_BASE = 223.9

// ---------------------------------------------------------------------------
// The Ford plant.

/** The main shed, from OSM way/835067654 in the building frame. */
const X0 = -122.8, X1 = 121.2, Y0 = -46.2, Y1 = 46.8
/** Levels above the base: parapet top, roof deck, knee wall top, window heads. */
const TOP = 8.0, DECK = 7.3, KNEE = 2.2, HEAD = 6.2
/** Monitors: x extent, the outer edges of each, the crest, the gutter. */
const MX0 = -100.5, MX1 = 108.0, CREST = 13.4, GUTTER = 8.6, TOOTH = 10.6
const MONITORS: [number, number][] = [[-32.2, -7.4], [7.6, 32.4]]

export function buildFord(): Built {
  const wall = new Part(), frieze = new Part(), trim = new Part(), win = new Part(), roof = new Part(), silver = new Part()
  const BELOW = -1

  // The shed: brick walls, a pale coping, the dark membrane deck.
  parapetBlock({ wall, deck: roof, coping: trim }, X0, X1, Y0, Y1, BELOW, TOP, { para: TOP - DECK })

  // --- North, south and east walls: Kahn's window walls. Brick piers on the
  // column lines; between them three steel window sections from the knee
  // wall to the head, a brick band above. The west two bays on each long
  // side carry the front's frieze instead (the survey; the showroom's
  // windows there are bricked in).
  const CORNER = X0 + 13.2
  const longBays = bays(CORNER, X1, 19)
  for (const side of ['S', 'N'] as const) {
    const f = face(side, side === 'S' ? Y0 : Y1)
    // Bays run west to east; `along` flips with the side.
    for (const [b0, b1] of longBays) {
      const a0 = f.along([b0, 0]), a1 = f.along([b1, 0])
      const l = Math.min(a0, a1), r = Math.max(a0, a1), w = r - l
      // A pier on each column line (one per bay, the east end gets its own).
      f.pier(wall, l - 0.45, l + 0.45, BELOW, TOP - 0.15, 0.3, 0.12, trim)
      const g = 0.35, pw = (w - 0.9 - 2 * g) / 3
      for (let k = 0; k < 3; k++) {
        const s0 = l + 0.45 + k * (pw + g), s1 = s0 + pw
        f.panel(win, s0, s1, KNEE, HEAD)
      }
    }
    const end = f.along([X1, 0])
    f.pier(wall, end - 0.45, end + 0.45, BELOW, TOP - 0.15, 0.3, 0.12, trim)
  }
  // The south awning along the west end of the south wall (OSM, lidar 227.7).
  {
    const z = 227.7 - FORD_BASE
    box(silver, -109.4, -63.0, -51.3, Y0, z - 0.3, z, silver)
    for (const x of [-108.8, -97.4, -86.1, -74.7, -63.6]) box(trim, x - 0.15, x + 0.15, -51.0, -50.7, 1.0, z - 0.3, null)
  }
  // East wall: original windows on its south half; the north half is behind
  // the lower loading addition, with only the transoms showing over it.
  {
    const f = face('E', X1)
    const cols = bays(Y0, Y1, 7)
    for (const [b0, b1] of cols) {
      const a0 = f.along([0, b0]), a1 = f.along([0, b1])
      const l = Math.min(a0, a1), r = Math.max(a0, a1)
      f.pier(wall, l - 0.45, l + 0.45, BELOW, TOP - 0.15, 0.3, 0.12, trim)
      const mid = (b0 + b1) / 2
      const behind = mid > 7.9 && mid < 41.3
      const g = 0.35, pw = (r - l - 0.9 - 2 * g) / 3
      for (let k = 0; k < 3; k++) {
        const s0 = l + 0.45 + k * (pw + g)
        f.panel(win, s0, s0 + pw, behind ? 5.5 : KNEE, HEAD)
      }
    }
    const end = f.along([0, Y1])
    f.pier(wall, end - 0.45, end + 0.45, BELOW, TOP - 0.15, 0.3, 0.12, trim)
  }
  // The east loading addition (lidar 229.05) and the small south-east bay.
  parapetBlock({ wall, deck: roof, coping: trim }, X1, 129.1, 7.9, 41.3, BELOW, 229.05 - FORD_BASE + 0.4, { para: 0.4, open: ['W'] })
  parapetBlock({ wall, deck: roof, coping: trim }, X1, 124.7, -41.7, -33.9, BELOW, TOP, { para: 0.5, open: ['W'] })

  // --- The west front on Statesville Avenue: fourteen bays between brick
  // pilasters, the bays bricked in (the survey), a cast-stone band at the
  // old window heads, the diamond-and-chevron brick frieze over it, a
  // cornice; the frieze wraps two bays round each corner; the corners rise
  // as taller blocks.
  {
    const FR0 = 5.9, FR1 = 7.55
    const W = face('W', X0)
    const frontBays = bays(W.along([0, Y1]), W.along([0, Y0]), 14)
    // The cast-stone band and the frieze run the whole front; pilasters stand over them.
    W.panel(trim, W.along([0, Y1]), W.along([0, Y0]), FR0 - 0.4, FR0, 0.08)
    W.panel(frieze, W.along([0, Y1]), W.along([0, Y0]), FR0, FR1, 0.08)
    W.panel(trim, W.along([0, Y1]), W.along([0, Y0]), 0.6, 1.1, 0.06)
    for (const [l] of frontBays.slice(1)) W.pier(wall, l - 0.55, l + 0.55, BELOW, FR1 + 0.1, 0.45, 0.12, trim)
    // The wrap round the corners: two bays on the north and south walls.
    for (const side of ['S', 'N'] as const) {
      const f = face(side, side === 'S' ? Y0 : Y1)
      const a0 = f.along([X0, 0]), a1 = f.along([CORNER, 0])
      f.panel(trim, a0, a1, FR0 - 0.4, FR0, 0.08)
      f.panel(frieze, a0, a1, FR0, FR1, 0.08)
      f.panel(trim, a0, a1, 0.6, 1.1, 0.06)
      const m = (a0 + a1) / 2
      f.pier(wall, m - 0.55, m + 0.55, BELOW, FR1 + 0.1, 0.45, 0.12, trim)
    }
    // Corner blocks over the cornice (the south-west corner photo).
    for (const [y0, y1] of [[Y0 - 0.5, Y0 + 1.7], [Y1 - 1.7, Y1 + 0.5]]) softBox(wall, X0 - 0.5, X0 + 1.7, y0, y1, BELOW, TOP + 0.7, 0.2, trim)
  }

  // --- The monitors: two pairs of sawteeth back to back, glazed faces
  // outward, pale metal roofs falling to a gutter between them.
  for (const [ya, yb] of MONITORS) {
    const yc0 = ya + TOOTH, yc1 = yb - TOOTH, B = 0.35
    // Roof slopes (with a chamfer at each crest) and the gutter.
    for (const [yo, yi, s] of [[ya, yc0, 1], [yb, yc1, -1]] as [number, number, number][]) {
      const yr = yo + s * B
      quad(silver, [MX0, yo, CREST - B], [MX1, yo, CREST - B], [MX1, yr, CREST], [MX0, yr, CREST], [0, -s, 1])
      quad(silver, [MX0, yr, CREST], [MX1, yr, CREST], [MX1, yi, GUTTER], [MX0, yi, GUTTER], [0, s * (CREST - GUTTER), TOOTH])
    }
    quad(roof, [MX0, yc0, GUTTER], [MX1, yc0, GUTTER], [MX1, yc1, GUTTER], [MX0, yc1, GUTTER], [0, 0, 1])
    // End gables, clad in the same metal.
    for (const [x, n] of [[MX0, -1], [MX1, 1]] as [number, number][]) {
      const N: V3 = [n, 0, 0]
      quad(silver, [x, ya, DECK], [x, yc0, DECK], [x, yc0, GUTTER], [x, ya, CREST - B], N)
      tri(silver, [x, ya, CREST - B], [x, yc0, GUTTER], [x, ya + B, CREST], N)
      quad(silver, [x, yc0, DECK], [x, yc1, DECK], [x, yc1, GUTTER], [x, yc0, GUTTER], N)
      quad(silver, [x, yc1, DECK], [x, yb, DECK], [x, yb, CREST - B], [x, yc1, GUTTER], N)
      tri(silver, [x, yb, CREST - B], [x, yb - B, CREST], [x, yc1, GUTTER], N)
    }
    // The outer faces: metal frames round the refurbished clerestories, a
    // panel of glazing per half bay.
    for (const [side, y] of [['S', ya], ['N', yb]] as const) {
      const f = face(side, y)
      quad(silver, f.P(f.along([MX0, 0]), DECK), f.P(f.along([MX1, 0]), DECK), f.P(f.along([MX1, 0]), CREST - B), f.P(f.along([MX0, 0]), CREST - B), f.N)
      for (const [b0, b1] of bays(MX0, MX1, 34)) {
        const a0 = f.along([b0, 0]), a1 = f.along([b1, 0]), l = Math.min(a0, a1), r = Math.max(a0, a1)
        f.panel(win, l + 0.3, r - 0.3, DECK + 0.9, CREST - B - 0.5)
      }
    }
  }

  return {
    id: 'clt-cne-ford-plant', name: 'Historic Ford Factory, Camp North End', height: CREST,
    parts: [
      { part: wall, material: BRICK },
      { part: frieze, material: finish('kahn-frieze', 0xd6a585) },
      { part: trim, material: PALETTE.trim },
      { part: win, material: PALETTE.window },
      { part: roof, material: PALETTE.roof },
      { part: silver, material: SILVER },
    ],
  }
}

if (import.meta.main) await write(buildFord())
