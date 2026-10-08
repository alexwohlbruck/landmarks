/**
 * Chicago Board of Trade Building (141 West Jackson, 1930, Holabird & Root),
 * with Helmut Jahn's 1980 annex and the 1997 trading-floor building, which
 * share its OSM outline — original procedural geometry, CC0-1.0.
 * bun generators/chi-board-of-trade.ts
 *
 * Also exports the few helpers the other chi- models by the same builder use
 * (Rookery, Chase Tower, Chicago Temple, 311 South Wacker); the CBOT model is
 * only written when this file runs itself.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/28951633,
 * 41.877411,-87.631869. Its walls run at 359.2° / 89.2°, so the catalog
 * bearing is 359.2 and the model is square to its own frame.
 *
 * Identity, in order: the pale limestone tower at the foot of LaSalle Street,
 * stepping in to a steep grey hipped pyramid carrying the aluminium Ceres;
 * the two 21-storey wings flanking a deep court over the base; the base's
 * six tall trading-room windows under the clock; behind it the dark 1980
 * annex with its own glazed hipped roof.
 *
 * Evidence:
 *  - plan: OSM outline and parts (way/685519267 tower 40.4 × 18.6 m,
 *    way/685519269 the 21-storey mass with the court notched out of its
 *    north side, way/1425860169 the annex's hipped top, way/685519266 the
 *    1997 building). Published: the 1930 site is 174 ft (53 m) on Jackson.
 *  - heights: 184 m to the top of Ceres (published, OSM). Ceres is 31 ft
 *    (9.4 m, published). Measured on TonyTheTiger's long telephoto up
 *    LaSalle, scaled by Ceres and the 13 ft clock (~23 px/m, consistent):
 *    pyramid eaves ~163 m, its apex ~173 m under Ceres' ~3 m frame,
 *    tower setbacks at ~148 m and ~134 m, wing parapets ~95 m (penthouses
 *    to ~102 m), clock centre ~51 m. Tower widths from the same photo:
 *    30 m at the top tier (both eaves of the pyramid in frame), 35 m, then
 *    the 40.4 m of OSM; the pyramid's ridge is short (~5 m). Depth N-S:
 *    OSM says 18.6 m, Paul Sableman's side view of the top suggests ~22 m;
 *    the model uses 22.6 m below and 20 m at the top (estimate).
 *  - annex: 23 storeys, 275 ft (84 m), published; the hipped glazed roof,
 *    ridge north-south, from Ken Lund's view down from the Willis Tower.
 *    Its eaves (~70 m) and the side wings (~62 m) are estimates.
 *  - 1997 building: five tall trading storeys (published), OSM 7 levels;
 *    34 m is an estimate.
 *  - colour: grey Indiana limestone (stone); the pyramid's weathered metal a
 *    silvery green-grey finish sampled from the telephoto, shared by the
 *    flat roofs; Ceres and the clock ring aluminium; the annex black and
 *    silver glass (a dark window variant, pulled to the palette's
 *    lightness), its roof glazing in the same.
 *
 * Photos (Wikimedia Commons): 20120929_Chicago_Board_of_Trade_Building.JPG
 * (TonyTheTiger, CC BY-SA 3.0); Big_Board_of_Trade_(16914319605).jpg
 * (Amaury Laporte, CC BY 2.0); Board_of_Trade.JPG (Blhayes87, CC BY-SA
 * 3.0); Chicago_Board_of_Trade_Building_(26945016856).jpg (Paul Sableman,
 * CC BY 2.0); Chicago_Board_of_Trade_Building,_Chicago,_Illinois_
 * (41583872700).jpg (Ken Lund, CC BY-SA 2.0); Three_exchanges_CBOT,_CME,
 * _and_Chicago_Stock_Exchange_(3371956274).jpg (JohnPickenPhoto, CC BY
 * 2.0); Closeup_of_bacskide_of_Board_of_Trade_(2330832267).jpg (Dan Perry,
 * CC BY 2.0). USGS NAIP for the plan. No commercial imagery.
 *
 * Left out: the hooded figures at the tower's corners, the bulls, the
 * lettering, mullions, the annex's octagonal ornament.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { block, cap, chamfer, inset, panel, rect, rows, save, walls, type XY } from './chi-aon-center'

// ---------------------------------------------------------------------------
// Helpers shared by this builder's chi- models.

/**
 * A hipped roof over the rectangle x0..x1, y0..y1 from z0 to z1; the ridge
 * runs along the longer side. `ridge` overrides the ridge's half-length.
 */
export function hipRoof(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, ridge?: number) {
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, w = x1 - x0, d = y1 - y0
  const alongX = w >= d
  const r = ridge ?? Math.max(0, (alongX ? w - d : d - w) / 2)
  const A: V3 = alongX ? [cx - r, cy, z1] : [cx, cy - r, z1]
  const B: V3 = alongX ? [cx + r, cy, z1] : [cx, cy + r, z1]
  const sw: V3 = [x0, y0, z0], se: V3 = [x1, y0, z0], ne: V3 = [x1, y1, z0], nw: V3 = [x0, y1, z0]
  if (alongX) {
    p.quad(sw, se, B, A) // south
    p.quad(ne, nw, A, B) // north
    p.tri(se, ne, B) // east
    p.tri(nw, sw, A) // west
  } else {
    p.quad(se, ne, B, A) // east
    p.quad(nw, sw, A, B) // west
    p.tri(sw, se, A) // south
    p.tri(ne, nw, B) // north
  }
}

/** Window bays on the four faces of a rectangle, `n` bays to a face (or by bay width). */
export function rectBays(p: Part, r: XY[], groups: [number, number][], o: { bay?: number; gap?: number; end?: number; out?: number; skip?: number[] } = {}) {
  const bay = o.bay ?? 2.6, gap = o.gap ?? 1.1, end = o.end ?? 1.2, out = o.out ?? 0.05
  for (let i = 0; i < r.length; i++) {
    if (o.skip?.includes(i)) continue
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < bay + 2 * end) continue
    const use = L - 2 * end, k = Math.max(1, Math.round((use + gap) / (bay + gap))), w = (use - (k - 1) * gap) / k
    for (let q = 0; q < k; q++) for (const [z0, z1] of groups) panel(p, a, b, end + q * (w + gap), end + q * (w + gap) + w, z0, z1, out)
  }
}

/**
 * Strips lying on a sloped quad a,b (eave) c,d (top), counter-clockwise from
 * outside: `n` strips across it, each `fill` of its share, set `out` proud.
 */
export function slopeStrips(p: Part, q: [V3, V3, V3, V3], n: number, fill = 0.55, t0 = 0.08, t1 = 0.9, out = 0.06) {
  const [a, b, c, d] = q
  const nr = cross(sub(b, a), sub(d, a)), l = Math.hypot(...nr), N: V3 = [nr[0] / l * out, nr[1] / l * out, nr[2] / l * out]
  const at = (s: number, t: number): V3 => {
    const e: V3 = [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, a[2] + (b[2] - a[2]) * s]
    const f: V3 = [d[0] + (c[0] - d[0]) * s, d[1] + (c[1] - d[1]) * s, d[2] + (c[2] - d[2]) * s]
    return [e[0] + (f[0] - e[0]) * t + N[0], e[1] + (f[1] - e[1]) * t + N[1], e[2] + (f[2] - e[2]) * t + N[2]]
  }
  for (let k = 0; k < n; k++) {
    const s0 = (k + (1 - fill) / 2) / n, s1 = (k + (1 + fill) / 2) / n
    p.quad(at(s0, t0), at(s1, t0), at(s1, t1), at(s0, t1))
  }
}

/** A rectangle with each corner notched `n` square, counter-clockwise. */
export function notched(x0: number, y0: number, x1: number, y1: number, n: number): XY[] {
  if (n <= 0) return rect(x0, y0, x1, y1)
  return [[x0 + n, y0], [x1 - n, y0], [x1 - n, y0 + n], [x1, y0 + n], [x1, y1 - n], [x1 - n, y1 - n], [x1 - n, y1], [x0 + n, y1], [x0 + n, y1 - n], [x0, y1 - n], [x0, y0 + n], [x0 + n, y0 + n]]
}

/** A box with a bevelled top edge and a flat roof in `top`. */
export function box(wall: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bevel = 0.4) {
  return block(wall, top, rect(x0, y0, x1, y1), z0, z1, bevel)
}

/** A round disc facing along the wall a→b's outward normal, centred s along it at height z. */
export function disc(p: Part, a: XY, b: XY, s: number, z: number, r: number, out = 0.06, seg = 16) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const c: V3 = [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, z]
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * 2 * Math.PI, t1 = ((i + 1) / seg) * 2 * Math.PI
    const P = (t: number): V3 => [c[0] + u[0] * r * Math.cos(t), c[1] + u[1] * r * Math.cos(t), c[2] + r * Math.sin(t)]
    p.tri(c, P(t0), P(t1))
  }
}

// ---------------------------------------------------------------------------
// Chicago Board of Trade

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), dark = new Part(), silver = new Part()

  // The 1930 building: lot x -59.9..-7.3, y 3.4..70.9.
  const W0 = -59.9, E0 = -7.3, S0 = 3.4, N0 = 70.9
  const CW = -41.4, CE = -25.7, CS = 35 // the court between the wings
  const BASE = 50, WING = 95
  const CX = (CW + CE) / 2

  // 21-storey U round the court, then the court's floor at the base cornice.
  const U: XY[] = [[W0, S0], [E0, S0], [E0, N0], [CE, N0], [CE, CS], [CW, CS], [CW, N0], [W0, N0]]
  walls(stone, U, 0, WING - 0.5)
  walls(trim, U, WING - 0.5, WING, inset(U, 0.4))
  cap(roof, inset(U, 0.4), WING)
  // Base across the court's mouth, with the clock frontispiece.
  box(stone, roof, CW, CS, CE, N0, 0, BASE, 0.4)
  box(trim, trim, CX - 6.5, N0 - 1.6, CX + 6.5, N0, BASE - 1, BASE + 6.5, 0.3)
  // The clock: a silver ring round a dark face, 13 ft across.
  disc(silver, [CE, N0], [CW, N0], CE - CX, BASE + 2.2, 2.7, 0.08)
  disc(win, [CE, N0], [CW, N0], CE - CX, BASE + 2.2, 2.0, 0.14)
  // Penthouses on the wings.
  box(stone, roof, W0 + 3, 44, CW - 3, N0 - 4, WING, 102, 0.4)
  box(stone, roof, CE + 3, 44, E0 - 3, N0 - 4, WING, 102, 0.4)

  // The tower: three tiers, the pyramid, Ceres.
  const TX = -33.4, TY = 23.7
  // Each tier: half-width E-W, half-depth N-S, corner notch, z0, z1. The
  // corners step in as the tower rises, which is what makes its edges read
  // as stepped from every side.
  const tiers: [number, number, number, number, number][] = [
    [20.2, 11.3, 1.5, WING - 1, 112],
    [20.2, 11.3, 3.0, 112, 134],
    [17.6, 10.6, 3.0, 134, 148],
    [15.0, 10.0, 3.0, 148, 162.7],
  ]
  const towerN = CS // the lower tiers' north face is the court's back wall
  const tierRing = ([hx, hy, n]: number[], i: number) => {
    const y1 = i < 2 ? towerN : TY + hy, y0 = i < 2 ? towerN - 2 * hy : TY - hy
    return notched(TX - hx, y0, TX + hx, y1, n)
  }
  tiers.forEach((t, i) => {
    const [, , , z0, z1] = t, r = tierRing(t, i)
    walls(stone, r, z0, z1 - 0.6)
    walls(trim, r, z1 - 0.6, z1, inset(r, 0.4))
    cap(roof, inset(r, 0.4), z1)
  })
  // The pyramid: steep, with a short ridge, on the 30 × 20 m top tier.
  hipRoof(roof, TX - 14.6, TY - 9.6, TX + 14.6, TY + 9.6, 162.7, 173, 2.5)
  // Ceres on her lantern frame: a stem, a platform, then the figure, all
  // aluminium. Drawn a little fuller than life (2.6 m across against ~2 m)
  // so she still reads as a figure at phone size.
  box(silver, silver, TX - 1.2, TY - 1.2, TX + 1.2, TY + 1.2, 171.5, 174.2, 0.15)
  box(silver, silver, TX - 2.1, TY - 2.1, TX + 2.1, TY + 2.1, 174.2, 174.8, 0.15)
  {
    const oct = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => [TX + r * Math.cos((i + 0.5) * Math.PI / 4), TY + r * Math.sin((i + 0.5) * Math.PI / 4), z] as V3)
    const prof: [number, number][] = [[1.3, 174.8], [1.05, 177.4], [1.15, 179.8], [1.35, 181.5], [0.9, 182.4], [0.45, 182.6]]
    const rings = prof.map(([r, z]) => oct(r, z))
    silver.loft(rings)
    const head = [oct(0.45, 182.6), oct(0.62, 183.3), oct(0.35, 184)]
    silver.loft(head)
    silver.cap(head[2], true)
  }

  // Windows. Storey groups of three floors (~3.9 m a floor).
  // Base, north front: six tall trading-room windows over the street storeys.
  const nFace: [XY, XY] = [[E0, N0], [W0, N0]]
  const fw = E0 - W0
  for (let k = 0; k < 6; k++) {
    const c = 9.5 + k * ((fw - 19) / 5)
    panel(win, nFace[0], nFace[1], c - 1.9, c + 1.9, 17, 41)
    panel(win, nFace[0], nFace[1], c - 1.9, c + 1.9, 3.5, 13)
  }
  // Wings, north faces and court sides; the U's other walls.
  const wingRows = rows(BASE + 1, WING - 2, 4, 1.2)
  const baseRows = rows(4, BASE - 3, 4, 1.2)
  for (const [x0, x1] of [[W0, CW], [CE, E0]]) {
    rectBays(win, rect(x0, CS, x1, N0), wingRows, { bay: 2.2, gap: 1.6, skip: [0] })
  }
  rectBays(win, rect(W0, S0, E0, N0), baseRows, { bay: 2.2, gap: 1.6, skip: [2] })
  rectBays(win, rect(W0, S0, E0, CS), wingRows, { bay: 2.2, gap: 1.6, skip: [2] })
  // The court wall (the tower's north face): close vertical strips.
  for (let k = 0; k < 5; k++) {
    const c = 2.2 + k * ((CE - CW - 4.4) / 4)
    for (const [z0, z1] of rows(BASE + 1, WING - 1, 4, 1.0)) panel(win, [CE, CS], [CW, CS], c - 1.1, c + 1.1, z0, z1)
  }
  // Tower tiers: vertical bays, wider dark strips on the long faces.
  tiers.forEach((t, i) => {
    const [, , , z0, z1] = t
    const n = Math.max(1, Math.round((z1 - z0 - 3) / 15.6))
    rectBays(win, tierRing(t, i), rows(z0 + (i === 0 ? 2 : 1), z1 - 2.2, n, 0.8), { bay: 1.8, gap: 1.3, end: i === 3 ? 3.0 : 1.6 })
  })

  // The 1980 annex: a dark glass block with lower side wings and a glazed
  // hipped roof, ridge north-south.
  const AS = -49, AN = S0
  const AW = -53.4, AE = -12.6, EAVE = 64, ATOP = 84, AWING = 62
  const annexWall = (r: XY[], z1: number) => {
    walls(dark, r, 0, z1 - 1.2)
    walls(roof, r, z1 - 1.2, z1, inset(r, 0.4))
    // The silver grid over the black glass: a band every three storeys and
    // a mullion line every ~6.5 m.
    for (let z = 12; z < z1 - 4; z += 11.4) walls(roof, inset(r, -0.05), z, z + 0.9)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.round(L / 6.5)
      for (let j = 1; j < k; j++) panel(roof, a, b, (j * L) / k - 0.3, (j * L) / k + 0.3, 0, z1 - 1.2, 0.06)
    }
  }
  annexWall(rect(AW, AS, AE, AN), EAVE)
  cap(roof, inset(rect(AW, AS, AE, AN), 0.4), EAVE)
  {
    // Metal hip with the atrium's glazing in dark strips down both long
    // slopes (in the annex's glass colour, to stay within six materials).
    const x0 = AW + 1.5, x1 = AE - 1.5, y0 = AS + 1.5, y1 = AN - 0.5, r = (y1 - y0 - (x1 - x0)) / 2, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
    hipRoof(roof, x0, y0, x1, y1, EAVE, ATOP)
    slopeStrips(dark, [[x1, y0, EAVE], [x1, y1, EAVE], [cx, cy + r, ATOP], [cx, cy - r, ATOP]], 6)
    slopeStrips(dark, [[x0, y1, EAVE], [x0, y0, EAVE], [cx, cy - r, ATOP], [cx, cy + r, ATOP]], 6)
  }
  for (const r of [rect(-65, -45.5, AW, AN), rect(AE, -43.5, -2, AN)]) {
    annexWall(r, AWING)
    cap(roof, inset(r, 0.4), AWING)
  }
  // The low link at the original's south-west corner, and the strip east of
  // the original that OSM gives the 21-storey mass.
  box(stone, roof, -65, AN, W0, 13.9, 0, 20, 0.3)
  box(stone, roof, E0, AN, -1.3, 14.1, 0, WING, 0.4)

  // The 1997 trading-floor building: a plain five-storey block.
  const east: XY[] = [[-1.3, 14.1], [-1.3, -39.6], [14.3, -39.6], [14.3, -48.9], [78.8, -48.9], [79.5, 24.9], [-7.1, 24.7], [-7.1, 14.1]]
  walls(stone, east, 0, 33.4)
  walls(trim, east, 33.4, 34, inset(east, 0.4))
  cap(roof, inset(east, 0.4), 34)
  for (const [a, b] of [[east[3], east[4]], [east[4], east[5]], [east[5], east[6]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (let s = 2; s + 3.2 < L - 1; s += 5.4) for (const [z0, z1] of [[3.5, 11], [13, 31]] as [number, number][]) panel(win, a, b, s, s + 3.2, z0, z1)
  }

  return [
    { part: stone, material: PALETTE.stone },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    // The pyramid's weathered metal, silvery green-grey in the photos
    // (#8eaabf backlit, #727579 in shade): the roofs share it.
    { part: roof, material: finish('cbot-metal', 0xa9b5b3) },
    { part: dark, material: windowVariant(2, 0x56636f) },
    { part: silver, material: finish('aluminium', 0xd9dcdd) },
  ]
}

if (import.meta.main) await save('chi-board-of-trade', 'Chicago Board of Trade Building', [41.877411, -87.631869], 359.2, build(), 6500)
