/**
 * New York City Hall — procedural, CC0-1.0, no textures.
 * bun generators/nyc-city-hall.ts
 *
 * Also a small kit for the civic buildings of this batch (nyc-federal-hall,
 * nyc-custom-house, nyc-trinity-church import `box`, `column`, `archPanel`
 * and friends from here). The model itself is only written when this file is
 * run directly.
 *
 * Map frame: x = model east, y = model north, z up, metres. The front, with
 * the portico and the steps, faces model south (onto City Hall Park, true
 * bearing ~213°). Placed at bearing 33.4°, the long walls' axis turned a
 * right angle. Anchor: area centroid of the OSM outline way/575213527.
 *
 * Evidence
 * - OSM way/575213527 (outline, 66.4 × 33 m plus the rear centre's 3 m
 *   projection), and its parts: 1015701476 (the whole floor plate, 13.7 m),
 *   1015701479–482 (wing and link roofs, hipped, 13.7–16.7 m), 214788065
 *   (centre block, 17 m), 1015701478 (its hipped roof, 17–20 m),
 *   1015701477 (rotunda skylight roof), 214788066 (portico, 7.7 m),
 *   214788062/068/063/064/067 (the cupola's base, drum, dome and statue).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), resampled into the model frame
 *   (/tmp/city/nyc/work/nyc-city-hall/rot.png): wing and link roofs 16–19 m,
 *   the centre block 19–23 m, the cupola's base ~23–25 m, the dome 34–36 m
 *   and Justice's top 40 m above the plaza (12.7 m NAVD88). Trees cover the
 *   edges.
 * - Published: 1803–1812, Mangin and McComb; French Renaissance outside,
 *   Federal detail; a central pavilion with projecting wings, a columned
 *   entrance portico capped by a balustrade, a roof balustrade, the domed
 *   cupola (rebuilt 1917) with the statue of Justice. The Massachusetts
 *   marble front and brownstone rear were both reclad in Alabama limestone
 *   above a Missouri granite base in 1954–56 (Wikipedia; NRHP 66000539), so
 *   the rear is drawn in the same pale limestone as the front today.
 * - Photos (Wikimedia Commons): /tmp/city/nyc/work/nyc-city-hall/photos/credits.txt.
 *   Front (MusikAnimal 2016 panorama, Nielsoncaetanosalmeron 2025), the
 *   portico and east wing from the south-east (Cc2723), the west front
 *   (Ken Lund), the rear and north-east corner ("Self", CityHallNYCRear).
 *
 * Estimated: storey heights (granite base 1.8 m, ground floor to 7.6 m,
 * upper floor to 13 m, the centre's attic to 17 m, from the panorama scaled
 * to the 66 m front), window sizes and counts per face (from the photos;
 * the wing ends and the rear are drawn with the front's rhythm), the
 * cupola's stage sizes (photos scaled to the lidar's 40 m top), the statue
 * (a bold standing figure with the scales raised, 3.8 m).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, finishModel, circle, capPoly, unit } from './nyc-570-lexington'

// ===========================================================================
// Civic kit
// ===========================================================================

/** A box with softened vertical edges, a coping and a flat top. */
export function box(wall: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bevel = 0.25) {
  prism({ wall, win: null, roof: top, ring: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, facade: null, bevel })
}

/** A sharp box (all six faces). For thin slabs, plinths, cornices. */
export function block(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bottom = false) {
  const r: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const t: V3[] = r.map(([x, y]) => [x, y, z1])
  p.loft([r, t]); p.cap(t, true); if (bottom) p.cap(r, false)
}

/** A round column: a square plinth, a smooth shaft and a square abacus. */
export function column(p: Part, x: number, y: number, r: number, z0: number, z1: number, o: { n?: number; base?: number; cap?: number; taper?: number } = {}) {
  const n = o.n ?? 10, base = o.base ?? r * 0.9, cap = o.cap ?? r * 0.8, taper = o.taper ?? 0.88
  const rb = r * 1.3
  block(p, x - rb, y - rb, x + rb, y + rb, z0, z0 + base)
  const s0 = z0 + base, s1 = z1 - cap
  const ring = (rr: number, z: number): V3[] => Array.from({ length: n }, (_, i) => { const a = (i * 2 * Math.PI) / n; return [x + rr * Math.cos(a), y + rr * Math.sin(a), z] as V3 })
  const a = ring(r, s0), b = ring(r * taper, s1)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const na = unit([a[i][0] - x, a[i][1] - y, 0]), nb = unit([a[j][0] - x, a[j][1] - y, 0])
    p.tri(a[i], a[j], b[j], undefined, undefined, undefined, [na, nb, nb])
    p.tri(a[i], b[j], b[i], undefined, undefined, undefined, [na, nb, na])
  }
  const rc = r * 1.25
  block(p, x - rc, y - rc, x + rc, y + rc, s1, z1)
}

/** Points on a wall a→b (counter-clockwise ring order, so the wall faces out), d metres proud. */
export function wallFrame(a: XY, b: XY, d = 0.05) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
  return { L, at: (s: number, z: number, dd = d): V3 => [a[0] + ux * s + nx * dd, a[1] + uy * s + ny * dd, z], n: [nx, ny, 0] as V3 }
}

/** A flat rectangular panel on a wall at along-wall position s (centre), width w. */
export function rectPanel(p: Part, a: XY, b: XY, s: number, w: number, z0: number, z1: number, d = 0.05) {
  const f = wallFrame(a, b, d)
  p.quad(f.at(s - w / 2, z0), f.at(s + w / 2, z0), f.at(s + w / 2, z1), f.at(s - w / 2, z1))
}

/** A flat round-headed panel (a true semicircle on a rectangle), top at zTop. */
export function archPanel(p: Part, a: XY, b: XY, s: number, w: number, z0: number, zTop: number, d = 0.05, segs = 10) {
  const f = wallFrame(a, b, d), r = w / 2, spring = zTop - r
  const pts: [number, number][] = [[s - r, z0], [s + r, z0]]
  for (let i = 0; i <= segs; i++) { const t = (i / segs) * Math.PI; pts.push([s + r * Math.cos(t), spring + r * Math.sin(t)]) }
  const c: [number, number] = [s, Math.max(z0, spring - r * 0.2)]
  for (let i = 0; i < pts.length; i++) {
    const A = pts[i], B = pts[(i + 1) % pts.length]
    if (Math.hypot(A[0] - B[0], A[1] - B[1]) < 1e-6) continue
    p.tri(f.at(c[0], c[1]), f.at(A[0], A[1]), f.at(B[0], B[1]))
  }
}

/** A flat disc on a wall, centre (s, z). */
export function discPanel(p: Part, a: XY, b: XY, s: number, z: number, r: number, d = 0.05, n = 12) {
  const f = wallFrame(a, b, d)
  for (let i = 0; i < n; i++) {
    const t0 = (i / n) * 2 * Math.PI, t1 = ((i + 1) / n) * 2 * Math.PI
    p.tri(f.at(s, z), f.at(s + r * Math.cos(t0), z + r * Math.sin(t0)), f.at(s + r * Math.cos(t1), z + r * Math.sin(t1)))
  }
}

/** Evenly spaced centres for `count` items across [s0, s1]. */
export const spread = (s0: number, s1: number, count: number) => Array.from({ length: count }, (_, k) => s0 + ((s1 - s0) * (k + 0.5)) / count)

/** A hipped roof on a rectangle, eaves at z0, ridge at z0 + h (ridge along the long side). */
export function hipRoof(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, h: number) {
  const w = x1 - x0, d = y1 - y0, k = Math.min(w, d) / 2
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  const A: V3 = [x0, y0, z0], B: V3 = [x1, y0, z0], C: V3 = [x1, y1, z0], D: V3 = [x0, y1, z0]
  if (w >= d) {
    const r0: V3 = [x0 + k, cy, z0 + h], r1: V3 = [x1 - k, cy, z0 + h]
    p.quad(A, B, r1, r0); p.quad(C, D, r0, r1); p.tri(B, C, r1); p.tri(D, A, r0)
  } else {
    const r0: V3 = [cx, y0 + k, z0 + h], r1: V3 = [cx, y1 - k, z0 + h]
    p.quad(B, C, r1, r0); p.quad(D, A, r0, r1); p.tri(A, B, r0); p.tri(C, D, r1)
  }
}

/** A solid parapet ring (balustrade) of thickness t along a closed counter-clockwise ring, inset 0..t. */
export function parapet(p: Part, ring: XY[], z0: number, z1: number, t = 0.35) {
  const n = ring.length
  // inward offset
  const inner = ring.map((b, i) => {
    const a = ring[(i + n - 1) % n], c = ring[(i + 1) % n]
    const u = unit([b[1] - a[1], a[0] - b[0], 0]), v = unit([c[1] - b[1], b[0] - c[0], 0])
    const k = 1 + u[0] * v[0] + u[1] * v[1]
    return [b[0] - (u[0] + v[0]) * t / k, b[1] - (u[1] + v[1]) * t / k] as XY
  })
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    p.quad([ring[i][0], ring[i][1], z0], [ring[j][0], ring[j][1], z0], [ring[j][0], ring[j][1], z1], [ring[i][0], ring[i][1], z1])
    p.quad([inner[j][0], inner[j][1], z0], [inner[i][0], inner[i][1], z0], [inner[i][0], inner[i][1], z1], [inner[j][0], inner[j][1], z1])
    p.quad([ring[i][0], ring[i][1], z1], [ring[j][0], ring[j][1], z1], [inner[j][0], inner[j][1], z1], [inner[i][0], inner[i][1], z1])
  }
}

/** Offset a counter-clockwise ring outward by d. */
export function grow(ring: XY[], d: number): XY[] {
  const n = ring.length
  return ring.map((b, i) => {
    const a = ring[(i + n - 1) % n], c = ring[(i + 1) % n]
    const u = unit([b[1] - a[1], a[0] - b[0], 0]), v = unit([c[1] - b[1], b[0] - c[0], 0])
    const k = 1 + u[0] * v[0] + u[1] * v[1]
    return [b[0] + (u[0] + v[0]) * d / k, b[1] + (u[1] + v[1]) * d / k] as XY
  })
}

/** A band (cornice / string course) d proud of a ring, z0..z1, with a top. */
export function band(p: Part, ring: XY[], z0: number, z1: number, d: number) {
  const g = grow(ring, d)
  for (let i = 0; i < g.length; i++) {
    const j = (i + 1) % g.length
    p.quad([g[i][0], g[i][1], z0], [g[j][0], g[j][1], z0], [g[j][0], g[j][1], z1], [g[i][0], g[i][1], z1])
    p.quad([g[i][0], g[i][1], z1], [g[j][0], g[j][1], z1], [ring[j][0], ring[j][1], z1], [ring[i][0], ring[i][1], z1])
    p.quad([g[j][0], g[j][1], z0], [g[i][0], g[i][1], z0], [ring[i][0], ring[i][1], z0], [ring[j][0], ring[j][1], z0])
  }
}

/** A dome (quarter-circle profile) of radius r on (cx, cy) from z0, `rings` latitude steps. */
export function dome(p: Part, cx: number, cy: number, r: number, z0: number, h = r, n = 14, rings = 5) {
  const R: V3[][] = []
  for (let k = 0; k <= rings; k++) {
    const t = (k / rings) * (Math.PI / 2)
    const rr = Math.max(r * Math.cos(t), k === rings ? 0.001 : 0)
    R.push(circle(cx, cy, rr, n).map(([x, y]) => [x, y, z0 + h * Math.sin(t)] as V3))
  }
  for (let k = 0; k < rings; k++) {
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const nm = (q: V3): V3 => unit([(q[0] - cx) / r, (q[1] - cy) / r, (q[2] - z0) / h])
      const a = R[k][i], b = R[k][j], c = R[k + 1][j], d = R[k + 1][i]
      p.tri(a, b, c, undefined, undefined, undefined, [nm(a), nm(b), nm(c)])
      if (k < rings - 1) p.tri(a, c, d, undefined, undefined, undefined, [nm(a), nm(c), nm(d)])
    }
  }
}

/** A standing robed figure (statue), feet at z0, facing −y; `arm` raises one arm. */
export function figure(p: Part, x: number, y: number, z0: number, h: number, o: { raise?: -1 | 1 | 0; torch?: boolean } = {}) {
  const s = h / 4
  const body: V3[][] = [[0.55, 0], [0.5, 1.2], [0.42, 2.2], [0.36, 2.8], [0.28, 3.1]].map(([r, z]) => circle(x, y, r * s, 8).map(([a, b]) => [a, b, z0 + z * s] as V3))
  p.loft(body); p.cap(body[body.length - 1], true)
  // Head.
  const hd: V3[][] = [[0.12, 3.1], [0.2, 3.25], [0.2, 3.55], [0.08, 3.75]].map(([r, z]) => circle(x, y, r * s, 8).map(([a, b]) => [a, b, z0 + z * s] as V3))
  p.loft(hd); p.cap(hd[hd.length - 1], true)
  const raise = o.raise ?? 1
  if (raise) {
    // A raised arm: a square bar from the shoulder up and out.
    const sx = x + raise * 0.32 * s, t = 0.09 * s
    const sh: V3 = [sx, y, z0 + 2.8 * s], hand: V3 = [x + raise * 0.6 * s, y, z0 + 3.9 * s]
    const sq = (c: V3): V3[] => [[c[0] - t, c[1] - t, c[2]], [c[0] + t, c[1] - t, c[2]], [c[0] + t, c[1] + t, c[2]], [c[0] - t, c[1] + t, c[2]]]
    p.loft([sq(sh), sq(hand)]); p.cap(sq(hand), true)
    if (o.torch) block(p, hand[0] - 0.12 * s, y - 0.12 * s, hand[0] + 0.12 * s, y + 0.12 * s, hand[2], hand[2] + 0.3 * s)
    return hand
  }
  return null
}

// ===========================================================================
// City Hall
// ===========================================================================

function build() {
  const stone = new Part(), granite = new Part(), win = new Part(), roof = new Part(), dark = new Part(), glass = new Part()

  // Plan (OSM, model frame). Front faces −y.
  const WX = 33.2, WY0 = -18.7, WY1 = 14.6 // wings: |x| 20.6..33.2
  const LX = 20.6 // wing inner edge
  const LY0 = -11.7 // links' and centre's front line
  const CX = 9.1, CY1 = 17.6 // centre block |x| < 9.1, rear projection to 17.6
  const BASE = 1.8, GF = 7.6, SC = 8.1, UF = 13.0, CORN = 13.8, BAL = 15.0
  const ATT = 17.2, ATTC = 17.9

  // --- Wings, links and centre: the two-storey body ---
  const wingRing = (sx: 1 | -1): XY[] => {
    const r: XY[] = [[LX, WY0], [WX, WY0], [WX, WY1], [LX, WY1]]
    return (sx > 0 ? r : r.map(([x, y]) => [-x, y] as XY).reverse())
  }
  const bodyRing: XY[] = [[-LX - 0.1, LY0], [LX + 0.1, LY0], [LX + 0.1, WY1 - 0.2], [CX, WY1 - 0.2], [CX, CY1], [-CX, CY1], [-CX, WY1 - 0.2], [-LX - 0.1, WY1 - 0.2]]
  for (const sx of [1, -1] as const) {
    const r = wingRing(sx)
    prism({ wall: granite, win: null, roof: null, ring: r, z0: 0, z1: BASE, facade: null, bevel: 0.2 })
    prism({ wall: stone, win: null, roof: null, ring: r, z0: BASE, z1: CORN, facade: null, bevel: 0.3 })
    band(stone, r, GF, SC, 0.18)
    band(stone, r, UF, CORN, 0.35)
    parapet(stone, grow(r, 0.2), CORN, BAL, 0.4)
    capPoly(roof, r, CORN - 0.05)
    hipRoof(roof, r.reduce((m, p) => Math.min(m, p[0]), 99) + 2.2, WY0 + 2.2, r.reduce((m, p) => Math.max(m, p[0]), -99) - 2.2, WY1 - 2.2, CORN, 1.4)
  }
  prism({ wall: granite, win: null, roof: null, ring: bodyRing, z0: 0, z1: BASE, facade: null, bevel: 0.2 })
  prism({ wall: stone, win: null, roof: null, ring: bodyRing, z0: BASE, z1: CORN, facade: null, bevel: 0.3 })
  band(stone, bodyRing, GF, SC, 0.18)
  band(stone, bodyRing, UF, CORN, 0.35)
  capPoly(roof, bodyRing, CORN - 0.05)
  // Link roofs (hipped, 13.7–16.7 m) behind the balustrade.
  for (const sx of [1, -1]) {
    const xa = sx * (CX + 0.5), xb = sx * (LX - 0.5)
    hipRoof(roof, Math.min(xa, xb), LY0 + 2.0, Math.max(xa, xb), WY1 - 2.2, CORN, 1.3)
    // Link balustrade along the front and rear.
    const x0 = Math.min(sx * CX, sx * LX), x1 = Math.max(sx * CX, sx * LX)
    block(stone, x0, LY0 - 0.2, x1, LY0 + 0.25, CORN, BAL)
    block(stone, x0, WY1 - 0.65, x1, WY1 - 0.2, CORN, BAL)
  }

  // --- Centre block: attic storey, hipped roof ---
  const centreRing: XY[] = [[-CX, LY0], [CX, LY0], [CX, CY1], [-CX, CY1]]
  prism({ wall: stone, win: null, roof: null, ring: centreRing, z0: CORN, z1: ATT, facade: null, bevel: 0.3 })
  band(stone, centreRing, ATT, ATTC, 0.35)
  capPoly(roof, centreRing, ATTC - 0.05)
  parapet(stone, grow(centreRing, 0.15), ATTC, ATTC + 0.7, 0.35)
  // The rotunda's skylight, a low glazed pyramid behind the cupola (OSM 1015701477, NAIP).
  {
    const x0 = -3.2, x1 = 2.7, y0 = 1.8, y1 = 7.6, zt = ATTC + 0.5, apex: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, ATTC + 2.6]
    block(roof, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, ATTC - 0.05, zt)
    const r: V3[] = [[x0, y0, zt], [x1, y0, zt], [x1, y1, zt], [x0, y1, zt]]
    for (let i = 0; i < 4; i++) glass.tri(r[i], r[(i + 1) % 4], apex)
  }

  // --- Windows ---
  // Ground floor: round-headed windows; upper floor: tall rectangles.
  const gArch = (a: XY, b: XY, centres: number[], w = 1.75) => centres.forEach((s) => archPanel(win, a, b, s, w, BASE + 1.0, GF - 0.6))
  const uRect = (a: XY, b: XY, centres: number[], w = 1.5) => centres.forEach((s) => rectPanel(win, a, b, s, w, SC + 0.8, UF - 0.9))
  const both = (a: XY, b: XY, n: number, m = 1.0) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]); const c = spread(m, L - m, n); gArch(a, b, c); uRect(a, b, c) }
  for (const sx of [1, -1]) {
    const m = (p: XY): XY => [sx * p[0], p[1]]
    const seg = (p: XY, q: XY): [XY, XY] => (sx > 0 ? [m(p), m(q)] : [m(q), m(p)])
    // Wing front (12.6 m, three bays), wing end (33 m, seven bays), wing rear, wing inner return (7 m, one bay).
    both(...seg([LX, WY0], [WX, WY0]), 3, 1.6)
    both(...seg([WX, WY0], [WX, WY1]), 7, 1.8)
    both(...seg([WX, WY1], [LX, WY1]), 3, 1.6)
    both(...seg([LX, LY0], [LX, WY0]), 1, 1.0)
    // Links: four bays front and rear.
    both(...seg([CX, LY0], [LX, LY0]), 4, 1.0)
    both(...seg([LX, WY1 - 0.2], [CX, WY1 - 0.2]), 4, 1.0)
    // Centre side returns at the rear projection.
    both(...seg([CX, WY1 - 0.2], [CX, CY1]), 1, 0.6)
  }
  // Centre front: ground floor behind the portico (dark loggia), five tall
  // arched windows on the upper floor between engaged columns, five attic windows.
  const cf: [XY, XY] = [[-CX, LY0], [CX, LY0]]
  const five = spread(1.6, 2 * CX - 1.6, 5)
  five.forEach((s) => archPanel(win, cf[0], cf[1], s, 2.1, SC + 0.6, UF - 0.25))
  five.forEach((s) => rectPanel(win, cf[0], cf[1], s, 1.3, CORN + 0.8, ATT - 0.7))
  // Engaged columns between the arches (paired at the ends).
  const colY = LY0 - 0.35
  const cols = [0.35, 0.95, ...five.slice(0, 4).map((s, i) => (s + five[i + 1]) / 2), 2 * CX - 0.95, 2 * CX - 0.35]
  cols.forEach((s) => column(stone, -CX + s, colY, 0.3, SC, UF + 0.1, { n: 8, base: 0.35, cap: 0.4 }))
  // Centre rear: arched upper windows, attic windows.
  const cr: [XY, XY] = [[CX, CY1], [-CX, CY1]]
  spread(1.6, 2 * CX - 1.6, 5).forEach((s) => { archPanel(win, cr[0], cr[1], s, 1.75, BASE + 1.0, GF - 0.6); rectPanel(win, cr[0], cr[1], s, 1.5, SC + 0.8, UF - 0.9); rectPanel(win, cr[0], cr[1], s, 1.3, CORN + 0.8, ATT - 0.7) })
  // Attic side windows.
  for (const [a, b] of [[[CX, LY0], [CX, CY1]], [[-CX, CY1], [-CX, LY0]]] as [XY, XY][]) spread(1.5, CY1 - LY0 - 1.5, 6).forEach((s) => rectPanel(win, a, b, s, 1.2, CORN + 0.8, ATT - 0.7))

  // --- Portico: eight Ionic columns (paired at the ends) on the top of the
  // steps, an entablature and the balustraded balcony on top. ---
  const PY0 = -14.5, PX = 9.0, FLOOR = 2.4, PTOP = 7.7
  const pcols = [-8.3, -7.05, -4.2, -1.4, 1.4, 4.2, 7.05, 8.3]
  for (const x of pcols) column(stone, x, PY0 + 0.6, 0.5, FLOOR, PTOP - 1.1, { n: 10, base: 0.4, cap: 0.35 })
  // Entablature (a solid lintel over the columns, back to the wall) and the balcony balustrade.
  box(stone, roof, -PX, PY0, PX, LY0, PTOP - 1.1, PTOP, 0.2)
  parapet(stone, [[-PX, PY0], [PX, PY0], [PX, LY0 + 0.05], [-PX, LY0 + 0.05]], PTOP, PTOP + 1.0, 0.3)
  // Dark loggia: the recessed doors and windows behind the columns.
  spread(-PX + 0.6, PX - 0.6, 5).forEach((x) => archPanel(dark, cf[0], cf[1], x + CX, 2.2, FLOOR, PTOP - 1.6))
  // Portico floor and the broad flight of steps down to the plaza (part of the building's granite).
  block(granite, -PX - 0.6, PY0 - 0.2, PX + 0.6, LY0, 0, FLOOR)
  const steps = 6, SW = 13.0
  for (let k = 0; k < steps; k++) {
    const z = FLOOR * (1 - (k + 1) / (steps + 1))
    const y0 = PY0 - 0.2 - (k + 1) * 0.75
    block(stone, -SW / 2 - k * 0.25, y0, SW / 2 + k * 0.25, y0 + 0.75 + 0.01, 0, z + FLOOR / (steps + 1))
  }

  // --- The cupola: square plinth, the clock stage with paired corner
  // columns, cornice, drum with corner urns, dome, Justice. ---
  const cx = -0.2, cy = -3.0
  const P = 3.3
  box(stone, roof, cx - P, cy - P, cx + P, cy + P, ATTC, 21.6, 0.3)
  parapet(stone, [[cx - P - 0.1, cy - P - 0.1], [cx + P + 0.1, cy - P - 0.1], [cx + P + 0.1, cy + P + 0.1], [cx - P - 0.1, cy + P + 0.1]], 21.6, 22.3, 0.25)
  const C = 2.3, Z1 = 22.0, Z2 = 29.5
  prism({ wall: stone, win: null, roof: null, ring: [[cx - C, cy - C], [cx + C, cy - C], [cx + C, cy + C], [cx - C, cy + C]], z0: Z1, z1: Z2, facade: null, bevel: 0.2 })
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
    column(stone, cx + sx * (C + 0.35), cy + sy * (C - 0.45), 0.27, Z1, Z2 - 0.1, { n: 8, base: 0.3, cap: 0.35 })
    column(stone, cx + sx * (C - 0.45), cy + sy * (C + 0.35), 0.27, Z1, Z2 - 0.1, { n: 8, base: 0.3, cap: 0.35 })
  }
  // Arched window and clock on each face.
  const sq: XY[] = [[cx - C, cy - C], [cx + C, cy - C], [cx + C, cy + C], [cx - C, cy + C]]
  for (let i = 0; i < 4; i++) {
    const a = sq[i], b = sq[(i + 1) % 4]
    archPanel(win, a, b, C, 1.6, Z1 + 1.0, Z1 + 4.4)
    discPanel(dark, a, b, C, Z1 + 5.6, 0.8, 0.05)
    discPanel(stone, a, b, C, Z1 + 5.6, 0.64, 0.08)
  }
  box(stone, roof, cx - C - 0.9, cy - C - 0.9, cx + C + 0.9, cy + C + 0.9, Z2, Z2 + 0.9, 0.25)
  const Z3 = Z2 + 0.9
  prism({ wall: stone, win: null, roof: stone, ring: circle(cx, cy, 2.55, 14), z0: Z3, z1: Z3 + 1.4, facade: null, bevel: 0.15 })
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
    const ux = cx + sx * (C + 0.35), uy = cy + sy * (C + 0.35)
    block(stone, ux - 0.3, uy - 0.3, ux + 0.3, uy + 0.3, Z3, Z3 + 0.4)
    prism({ wall: stone, win: null, roof: stone, ring: circle(ux, uy, 0.32, 6), z0: Z3 + 0.4, z1: Z3 + 1.2, facade: null, bevel: 0.08 })
  }
  dome(stone, cx, cy, 2.5, Z3 + 1.4, 2.8, 14, 5)
  const Z4 = Z3 + 4.2
  prism({ wall: stone, win: null, roof: stone, ring: circle(cx, cy, 0.6, 8), z0: Z4 - 0.1, z1: Z4 + 0.7, facade: null, bevel: 0.1 })
  // Justice: a standing figure, the scales held high in her left hand.
  const hand = figure(stone, cx, cy, Z4 + 0.7, 3.9, { raise: 1 })
  if (hand) block(stone, hand[0] - 0.35, cy - 0.06, hand[0] + 0.35, cy + 0.06, hand[2] - 0.05, hand[2] + 0.05)

  finishModel('New York City Hall', 'nyc-city-hall', [
    { part: stone, material: finish('cityhall-limestone', 0xf0ece3) },
    { part: granite, material: finish('cityhall-granite', 0xd9c5bf) },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('cityhall-roof', 0xc3c6c6) },
    { part: dark, material: { ...PALETTE.window, name: 'window-2', color: 0x5d6c78 } },
    { part: glass, material: PALETTE.glass },
  ], { bearing: 33.4, osm: 'way/575213527', height: 39.8 }, 5000)
}

if (import.meta.main) build()
