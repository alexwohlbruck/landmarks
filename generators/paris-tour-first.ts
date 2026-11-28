/**
 * Tour First, La Défense (Courbevoie) — original procedural geometry, CC0-1.0.
 * bun generators/paris-tour-first.ts
 *
 * The 1974 Tour UAP/Axa (a three-winged Y), reclad and raised by Kohn
 * Pedersen Fox and SRA in 2007-2011: three glass wings of different heights
 * round a core, each with a sloping (skillion) top, the faces folded into
 * vertical facets, and a glass blade crown on the tall wing's high corner.
 *
 * Frame: BEARING 25.1 (OSM minimum rectangle of the outline), +y compass
 * 25.1, +x compass 115.1, z up, metres. Origin = centroid of OSM
 * way/82466977 (2.2516124, 48.888825). y = 0 is the lowest ground under the
 * plan; elevation 0.
 *
 * Evidence
 * - OSM way/82466977 (building=tower, height 225, 52 levels, facade colour
 *   #A2E1FA, glass). Parts, drawn as given in plan:
 *   - wing A 226254484 (height 231, skillion, roof:height 25, roof:direction
 *     -30: it falls towards its north-west tip);
 *   - wing B 226254482 (190, skillion 25, direction 85: falls to its
 *     east-north-east tip) and its edge strip 227353364 (183);
 *   - wing C 226254483 (170, skillion 25, direction 205: falls to its
 *     south tip) and its edge strip 227353365 (173);
 *   - crown parts 226254481 (core block 220-240), 227324158 (a screen along
 *     wing A's south edge, 180-234), 227324160 (a screen on the core edge,
 *     225-244), 227324159 (235-250) and 227353363 (a spike to 259). OSM's
 *     crown heights run 10-28 m over the published total, so the crown is
 *     scaled to the published 231 m.
 *   - 226245904 (building=roof, 4-5 m): the lobby canopy round the wings,
 *     inside the outline.
 *   - 852634174 (building=roof, layer 4) reaches half outside the outline to
 *     the south-east; the model does not draw it, so it is not replaced.
 * - Published (Wikipedia FR/EN, CTBUH): 231 m to the top, 225 m roof, 52
 *   storeys, 2011; tallest building in France.
 * - Commons photos, in ~/landmarks-scratch/paris/work/paris-tour-first/photos/:
 *   - "Tours First et Saint-Gobain (42975144462).jpg", Arthur Weidmann,
 *     CC BY-SA 2.0 (weidmann.jpg): pale sky-blue glass in folded facets, the
 *     tall wing's top sloping away from a pointed blade at its high corner,
 *     a lower wing in front with its own sloping, serrated top.
 *   - "Tourfirst240309.jpg", Spartida, CC BY 3.0 (spartida.jpg): the frame
 *     in 2009, three wing heights stepping down.
 *   - "Paris Tour Eiffel Blick von der 3. Ebene auf La Défense 2.jpg",
 *     Zairon, CC BY-SA 4.0 (eiffel3.jpg): from the south-east, far: the
 *     slab with its sloping top among La Défense.
 *
 * Estimated: the wings' wall and ridge heights (A 196-218, B 165-190, C
 * 145-170, from OSM's skillion tags, A lowered so the blade reaches the
 * published 231), the blade (on the core edge, rising to 231 at its south
 * corner, read from weidmann.jpg), the parapet screens (3 m), the facet
 * folds (0.8 m deep, every 4.8 m, on the long outer faces), the lobby and
 * canopy (OSM 4-5 m over the ground; built to the map's terrain, which
 * climbs to the dalle along the north-west edge, so the canopy steps up
 * there to stay above it).
 *
 * Night: offices glow (`window-2`); the lobby glazing is `entrance`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { save } from './dc-white-house'

const BEARING = 25.1
const ANCHOR = { lng: 2.2516124, lat: 48.888825 }

type XY = [number, number]
const glassW = new Part(), trim = new Part(), roof = new Part(), blade = new Part(), lobby = new Part(), canopy = new Part()

const OUTLINE: XY[] = [[18.8, 28.9], [-27.8, 29.3], [-35.5, 13.2], [-37.0, 10.5], [-38.0, 7.0], [-38.3, 2.8], [-37.5, -1.3], [-36.4, -3.9], [-37.0, -4.6], [-35.0, -6.8], [-31.6, -10.3], [-29.2, -12.1], [-26.8, -13.8], [-22.4, -16.2], [-23.0, -17.4], [-20.0, -20.0], [-16.8, -23.1], [-11.9, -28.7], [-12.1, -29.6], [-9.5, -31.5], [-6.8, -33.1], [-2.6, -35.1], [0.9, -36.3], [0.9, -35.1], [3.4, -35.1], [3.4, -36.1], [17.8, -36.2], [27.1, -36.3], [27.2, -28.6], [27.6, 6.2], [27.6, 7.9], [26.4, 10.1], [36.3, 15.7], [36.7, 16.3], [36.9, 16.8], [36.9, 17.4], [36.8, 17.9], [33.4, 24.7], [30.8, 29.0], [28.8, 31.9], [28.4, 32.2], [28.1, 32.4], [27.5, 32.5], [26.9, 32.4], [19.3, 28.1]]
const CANOPY: XY[] = [[19.3, 28.1], [18.8, 28.9], [-27.8, 29.3], [-35.5, 13.2], [-37.0, 10.5], [-38.0, 7.0], [-38.3, 2.8], [-37.5, -1.3], [-36.4, -3.9], [-37.0, -4.6], [-35.0, -6.8], [-31.6, -10.3], [-29.2, -12.1], [-26.8, -13.8], [-22.4, -16.2], [-23.0, -17.4], [-20.0, -20.0], [-16.8, -23.1], [-11.9, -28.7], [-12.1, -29.6], [-9.5, -31.5], [-6.8, -33.1], [-2.6, -35.1], [0.9, -36.3], [0.9, -35.1], [3.4, -35.1], [3.4, -36.1], [17.8, -36.2], [27.1, -36.3], [27.2, -28.6], [27.6, 6.2], [27.6, 7.9], [26.4, 10.1], [23.1, 8.2], [23.1, 6.2], [22.6, -31.5], [22.2, -32.5], [21.3, -33.0], [20.7, -33.1], [13.1, -33.5], [7.6, -33.2], [4.8, -32.9], [3.7, -32.2], [3.4, -31.1], [3.6, -16.9], [3.6, -16.2], [-30.8, 3.9], [-31.3, 4.8], [-31.3, 5.8], [-29.2, 10.2], [-27.5, 13.2], [-24.1, 18.4], [-22.7, 20.2], [-21.8, 20.5], [-20.8, 20.4], [-20.1, 20.0], [-7.9, 12.8], [5.1, 20.1]]
const WING_B: XY[] = [[10.5, 1.0], [23.1, 8.2], [26.4, 10.1], [36.3, 15.7], [36.7, 16.3], [36.9, 16.8], [36.9, 17.4], [36.8, 17.9], [33.4, 24.7], [30.8, 29.0], [28.8, 31.9], [28.1, 32.4], [27.5, 32.5], [26.9, 32.4], [19.3, 28.1], [5.1, 20.1], [-7.9, 12.8], [7.2, 3.7], [8.1, 3.7], [9.9, 2.7], [10.4, 2.1], [10.5, 1.8]]
const WING_C: XY[] = [[3.6, -16.2], [8.1, -18.9], [8.6, -19.0], [9.5, -18.7], [10.2, -18.0], [10.4, -17.6], [10.5, -3.7], [10.5, 1.0], [23.1, 8.2], [23.1, 6.2], [22.6, -31.5], [22.2, -32.5], [21.3, -33.0], [20.7, -33.1], [13.1, -33.5], [7.6, -33.2], [4.8, -32.9], [3.7, -32.2], [3.4, -31.1], [3.6, -16.9]]
const WING_A: XY[] = [[10.4, -17.6], [10.5, -3.7], [10.5, 1.0], [10.5, 1.8], [10.4, 2.1], [9.9, 2.7], [8.1, 3.7], [7.2, 3.7], [-7.9, 12.8], [-20.1, 20.0], [-20.8, 20.4], [-21.8, 20.5], [-22.7, 20.2], [-24.1, 18.4], [-27.5, 13.2], [-29.2, 10.2], [-31.3, 5.8], [-31.3, 4.8], [-30.8, 3.9], [3.6, -16.2], [8.1, -18.9], [8.6, -19.0], [9.5, -18.7], [10.2, -18.0]]

// ---- Polygon helpers.
const area = (p: XY[]) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
const ccw = (p: XY[]) => (area(p) > 0 ? p : [...p].reverse())
function inside(pt: XY, poly: XY[]) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
/** Ear clipping: triangles (index triples) of a counter-clockwise simple polygon. */
function earcut(p: XY[]): [number, number, number][] {
  const idx = p.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k - 1 + idx.length) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = p[i0], b = p[i1], c = p[i2]
      if (cr(a, b, c) <= 1e-9) continue
      let ok = true
      for (const j of idx) {
        if (j === i0 || j === i1 || j === i2) continue
        const q = p[j]
        if (cr(a, b, q) >= 0 && cr(b, c, q) >= 0 && cr(c, a, q) >= 0) { ok = false; break }
      }
      if (!ok) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1) // degenerate sliver: drop it
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
/** Fold long outer edges into vertical facets (symmetric zigzag). */
function fold(poly: XY[], others: XY[][], period = 4.8, depth = 0.8): XY[] {
  const out: XY[] = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    out.push(a)
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy)
    if (L < 12) continue
    const nx = dy / L, ny = -dx / L, m: XY = [(a[0] + b[0]) / 2 + nx, (a[1] + b[1]) / 2 + ny]
    if (others.some((o) => inside(m, o))) continue // a shared wall
    const n = Math.round(L / period)
    for (let k = 0; k < n; k++) {
      const t = (k + 0.5) / n
      out.push([a[0] + dx * t + nx * depth, a[1] + dy * t + ny * depth])
      if (k < n - 1) { const t2 = (k + 1) / n; out.push([a[0] + dx * t2, a[1] + dy * t2]) }
    }
  }
  return out
}

/** A wing: folded walls from z0 to a sloping top, with a parapet screen. */
function wing(plan: XY[], others: XY[][], z0: number, zHigh: number, zLow: number, downCompass: number) {
  const base = ccw(plan)
  const d = ((downCompass - BEARING) * Math.PI) / 180, dir: XY = [Math.sin(d), Math.cos(d)]
  const s = base.map((p) => p[0] * dir[0] + p[1] * dir[1]), s0 = Math.min(...s), s1 = Math.max(...s)
  const top = (p: XY) => zHigh - ((zHigh - zLow) * (p[0] * dir[0] + p[1] * dir[1] - s0)) / (s1 - s0)
  const P = fold(base, others)
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length]
    glassW.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], top(b)], [a[0], a[1], top(a)])
    // the parapet screen, 3 m over the roof edge
    trim.quad([a[0], a[1], top(a)], [b[0], b[1], top(b)], [b[0], b[1], top(b) + 3], [a[0], a[1], top(a) + 3])
    trim.quad([b[0], b[1], top(b)], [a[0], a[1], top(a)], [a[0], a[1], top(a) + 3], [b[0], b[1], top(b) + 3])
  }
  for (const [i, j, k] of earcut(base)) roof.tri([...base[i], top(base[i])] as V3, [...base[j], top(base[j])] as V3, [...base[k], top(base[k])] as V3)
  return top
}

// ---- Lobby and canopy. The tower stands at the edge of the dalle: the
// map's terrain (Mapterhorn, metres over the lowest point under the plan,
// 10 m grid, rows north to south) climbs from ~5 m on the Courbevoie side
// to the dalle's ~11 m along the north-west edge, so the canopy (OSM 4-5 m
// over its ground) follows that ground.
const GRID = [ // y = 40 .. -40 (rows), x = -40 .. 40 (columns)
  [3.3, 11.3, 3.1, 11.4, 11.5, 11.5, 11.5, 11.5, 11.5],
  [4.5, 11.2, 3.7, 3.7, 3.9, 5.5, 10.7, 11.3, 11.3],
  [4.3, 6.6, 5.6, 4.4, 4.4, 5.5, 6.0, 5.7, 10.6],
  [3.8, 3.7, 3.4, 4.6, 5.6, 5.7, 5.8, 6.3, 11.1],
  [3.6, 1.8, 2.2, 4.3, 5.2, 5.4, 5.4, 5.4, 7.7],
  [4.5, 0.0, 0.8, 4.1, 4.8, 5.1, 5.1, 4.9, 5.8],
  [6.1, 5.2, 2.4, 3.6, 4.4, 4.8, 4.7, 4.8, 7.2],
  [5.8, 5.7, 5.6, 3.4, 4.1, 4.5, 4.5, 4.4, 4.3],
  [5.9, 5.8, 6.0, 5.7, 4.6, 4.4, 4.4, 4.5, 4.9],
]
/** The map's ground near a point: the highest grid value within 7 m (the edge of the dalle is abrupt). */
function ground(x: number, y: number) {
  let g = 0
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    const gx = -40 + 10 * c, gy = 40 - 10 * r
    if (Math.hypot(gx - x, gy - y) <= 7.1) g = Math.max(g, GRID[r][c])
  }
  return g
}
const canTop = (p: XY) => Math.max(5, ground(p[0], p[1]) + 1.2)
{
  const o = ccw(OUTLINE)
  for (let i = 0; i < o.length; i++) {
    const a = o[i], b = o[(i + 1) % o.length]
    lobby.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], canTop(b) - 1], [a[0], a[1], canTop(a) - 1])
  }
  const c = ccw(CANOPY)
  for (let i = 0; i < c.length; i++) {
    const a = c[i], b = c[(i + 1) % c.length]
    canopy.quad([a[0], a[1], canTop(a) - 1], [b[0], b[1], canTop(b) - 1], [b[0], b[1], canTop(b)], [a[0], a[1], canTop(a)])
  }
  for (const [i, j, k] of earcut(c)) {
    canopy.tri([...c[i], canTop(c[i])] as V3, [...c[j], canTop(c[j])] as V3, [...c[k], canTop(c[k])] as V3)
    canopy.tri([...c[i], canTop(c[i]) - 1] as V3, [...c[k], canTop(c[k]) - 1] as V3, [...c[j], canTop(c[j]) - 1] as V3)
  }
}

// ---- The three wings.
const topA = wing(WING_A, [WING_B, WING_C], 0, 218, 196, 330)
wing(WING_B, [WING_A, WING_C], 0, 190, 165, 85)
wing(WING_C, [WING_A, WING_B], 0, 170, 145, 205)

// ---- The crown: a glass blade on the core edge of wing A, rising to 231 at its south corner.
{
  const a: XY = [10.5, 2.0], b: XY = [10.4, -17.6], t = 1.2
  const za = topA(a) + 4, zb = 231
  const q = (p: XY, dx: number, z: number): V3 => [p[0] + dx, p[1], z]
  const za0 = topA(a), zb0 = topA(b)
  blade.quad(q(a, 0, za0), q(b, 0, zb0), q(b, 0, zb), q(a, 0, za)) // faces +x
  blade.quad(q(b, -t, zb0), q(a, -t, za0), q(a, -t, za), q(b, -t, zb))
  blade.quad(q(a, -t, za), q(a, 0, za), q(b, 0, zb), q(b, -t, zb)) // top edge
  blade.quad(q(b, 0, zb0), q(b, -t, zb0), q(b, -t, zb), q(b, 0, zb)) // the end
}

await save('paris-tour-first', 'Tour First', [
  { part: glassW, material: windowVariant(2, 0xa7c2d6) },
  { part: trim, material: finish('first-screen', 0xd5e2ea) },
  { part: roof, material: PALETTE.roof },
  { part: blade, material: { ...PALETTE.glass, color: 0xb9d2e2 } },
  { part: lobby, material: { ...PALETTE.entrance, color: 0x8fa3b2 } },
  { part: canopy, material: PALETTE.trim },
], { bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 231 }, 6500)
