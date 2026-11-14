/**
 * Albert Bridge, Chelsea (1873; Rowland Mason Ordish; strengthened by Sir
 * Joseph Bazalgette 1884–87; central piers 1973) — procedural, CC0-1.0, no
 * textures.
 * bun generators/london-albert-bridge.ts
 *
 * The whole bridge as one placement, toll booth to toll booth: the four
 * cast-iron towers on their cylindrical piers, with their banded clustered
 * shafts, lantern tops and spires and the arched, latticed portal girder
 * across each pair; Ordish's fans of straight stays from each tower top;
 * Bazalgette's suspension chains and their hangers; the pink parapets and
 * deck-edge girders; the deck's dark underside; the two 1973 central piers;
 * the four octagonal toll booths; and the night lights strung along the
 * stays and chains. The road and its footways are the map's (OSM draws
 * them, way/591291859 and the sidewalks); nothing here is a slab at road
 * level. Writes a low model (towers, piers, portals, chains and stays as
 * solid bars, parapet bands, sparse lamps) and a detail model (the same
 * with the hangers, parapet posts and medallions, the portal lattice,
 * lantern posts and pinnacles, every bulb), which the map draws from
 * detailZoom up.
 *
 * Frame: x across the bridge (east), y along it toward Chelsea (north), z
 * up, metres. Placed at bearing 342.6°, the line from the midpoint of the
 * Battersea towers (way/857860925, way/857860926) to that of the Chelsea
 * towers (their halves in the outline way/378295023); the anchor is midway
 * between, at the 1973 central piers.
 *
 * Height. z = 0 is the river: Mapterhorn reads the water at 3.0–3.4 m AOD
 * here (the lidar 3.0–3.4), and the map stands the model on the lowest
 * ground under its footprint, so z = height AOD − 3.0. The parapets and
 * girders were built to the lidar roadway (Environment Agency LIDAR
 * Composite DSM 1 m, the road's centre line): 4.6 m above z = 0 at the
 * Battersea river wall (y = −105), 6.6 m at the towers, 7.6 m at the
 * central piers (y = 0), 6.6 m at the Chelsea towers and 4.6 m at the
 * Chelsea river wall (y = 105); the approaches on land 4.4 m (south end)
 * and 3.9 m (north end, y = 126). OSM has no `ele` or `height` on the road
 * ways (way/591291859, way/1188809166), so the map guesses its deck from
 * the ground and water; these are the heights to give it.
 *
 * Feet on the terrain: the tower and central piers stand in the river at
 * z = 0; the abutments at the two ends run down to the ground under them
 * vertex by vertex, from 4 m tables of Mapterhorn heights in this frame
 * (SOUTH_GROUND, NORTH_GROUND) less 3.0 m.
 *
 * Sources:
 * - OSM: the outline way/378295023 (man_made=bridge, 14.5 m wide, from
 *   y = −111.4 to 126.5, bulging round the towers and central piers); the
 *   Battersea towers way/857860925 and way/857860926 (building, height=20,
 *   round, 5 m across, 17 m apart; the Chelsea pair 17.3 m apart), the
 *   central piers way/857860923 and way/857860924 (y = 0.3, x = ±9), and the
 *   toll booths way/250356517, way/250356518, way/378295025, way/378295026
 *   ("originally toll booths", 4.9 m octagons) at y = ±108–110.
 * - Lidar: Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government
 *   Licence v3.0: the road profile above; the tower tops 29.9–31.8 m AOD
 *   (26.9–28.8 here), which is the lantern stage; the spires are too thin
 *   for a 1 m grid.
 * - Published (Wikipedia "Albert Bridge, London"; Historic England list
 *   entry 1358138, Grade II*): 710 ft (216 m) long, 41 ft (12.5 m) roadway
 *   and footways, main span 384 ft (117 m); an Ordish–Lefeuvre cable-stayed
 *   bridge, given suspension chains by Bazalgette in 1884–87 and two
 *   concrete central piers in 1973; repainted in pastel colours in 1992 and
 *   2011, with about 4,000 bulbs outlining it at night.
 * - Photos (Wikimedia Commons): "Albert Bridge, London - Oct 2012" and
 *   "Albert Bridge at night, London, UK - Diliff" (Diliff, CC BY-SA 3.0; the
 *   elevation, stays, chains and lights); "Albert Bridge London 2020 01"
 *   (Julian Herzog, CC BY 4.0; a portal, the stays and parapet from the
 *   road); "1358138 II Star Albert Bridge, from N ..." and "... 20250609
 *   0007" and "... NW tollbooth ..." (Tilman2007, CC BY-SA 4.0; the towers'
 *   colours, the pink parapet with rosettes, a toll booth); "Albert Bridge,
 *   London, from the northwest" (ketrin1407, CC BY 2.0; the piers and the
 *   side elevation); "Albert Bridge in close up" (Mermayden, CC BY-SA 4.0;
 *   the portal arch, lattice spandrels and tower capitals).
 * - Estimated from photos (scaled from the lidar tower tops and the road):
 *   the towers' stages — a white plinth to 2.6 m above the road, a shaft of
 *   a pale green core with four pale blue corner columns and three white
 *   bands, the capital at 25.6 m, the lantern to 28.8 m and the spire to
 *   32.3 m; the portal arch (springing 22.6 m, crown 24.9 m); the stays,
 *   six toward the main span and five toward the side span from each
 *   tower, leaving it between 17.4 and 21.4 m (well below the capital, as
 *   in the photos) and landing on the deck edge 8–49 m out; the chains'
 *   line (from 22.3 m on the towers to the deck at midspan and at the river
 *   walls); the hangers every 6 m; the parapet (1.15 m) and the girder's
 *   depth (2.0 m under the road, so the pink face reads as a 2.7 m band);
 *   the piers' size (5 m across, OSM) and cornice; the 1973 piers as plain
 *   concrete cylinders; the toll booths' height (3.6 m walls, a pyramid
 *   roof to 4.7 m).
 * - Drawn bolder than real: the stays 0.65 × 0.5 m in the detail model and
 *   about 0.7 m in the low one, the chains 1.0 m deep, the hangers 0.12 m,
 *   the bulbs 0.32 m.
 * - Colour: the towers' core a pale green, their ribs pale blue, the
 *   bands, capitals, lanterns, portals, stays and chains white, the
 *   parapet and girder face pale pink, the rosettes picked out in the
 *   towers' green, the girders' underside and the central piers concrete
 *   grey — the 1992/2011 scheme in daylight photos, pulled to the palette's
 *   lightness.
 *
 * Night: `lamp` beads along every stay and chain (sparser in the low model)
 * and up the towers' corners; the towers and portals carry a `_FLOODLIGHT`
 * wash.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { band, bead, groundAt, piecewise, stations, type GroundGrid } from './bridge-kit'
import { finish } from './palette'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const norm = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

// ---- Geometry helpers ------------------------------------------------------------

/** A tube along a path with an elliptical section (a, b per point), smooth or flat, optionally capped. */
function sweep(p: Part, path: V3[], radii: [number, number][], sides: number, caps = false, flat = false, phase = 0.5) {
  const rings: { pts: V3[]; ns: V3[] }[] = []
  for (let i = 0; i < path.length; i++) {
    const t = norm(sub(path[Math.min(i + 1, path.length - 1)], path[Math.max(i - 1, 0)]))
    const s = norm(Math.abs(t[2]) > 0.95 ? cross(t, [0, 1, 0]) : cross(t, [0, 0, 1]))
    const u = cross(s, t)
    const [a, b] = radii[i]
    const pts: V3[] = [], ns: V3[] = []
    for (let k = 0; k < sides; k++) {
      const th = (2 * Math.PI * (k + phase)) / sides
      const c = Math.cos(th), sn = Math.sin(th)
      pts.push(add(path[i], add(mul(s, a * c), mul(u, b * sn))))
      ns.push(norm(add(mul(s, c / a), mul(u, sn / b))))
    }
    rings.push({ pts, ns })
  }
  for (let i = 0; i < rings.length - 1; i++)
    for (let k = 0; k < sides; k++) {
      const j = (k + 1) % sides, A = rings[i], B = rings[i + 1]
      if (flat) {
        const h = add(A.ns[k], A.ns[j])
        p.tri(A.pts[k], B.pts[k], B.pts[j], undefined, undefined, undefined, flatN(A.pts[k], B.pts[k], B.pts[j], h))
        p.tri(A.pts[k], B.pts[j], A.pts[j], undefined, undefined, undefined, flatN(A.pts[k], B.pts[j], A.pts[j], h))
      } else {
        p.tri(A.pts[k], B.pts[k], B.pts[j], undefined, undefined, undefined, [A.ns[k], B.ns[k], B.ns[j]])
        p.tri(A.pts[k], B.pts[j], A.pts[j], undefined, undefined, undefined, [A.ns[k], B.ns[j], A.ns[j]])
      }
    }
  if (caps)
    for (const [ring, i, dir] of [[rings[0], 0, -1], [rings[rings.length - 1], path.length - 1, 1]] as const) {
      const t = norm(sub(path[Math.min(i + 1, path.length - 1)], path[Math.max(i - 1, 0)]))
      const n = mul(t, dir)
      for (let k = 0; k < sides; k++) p.tri(path[i], ring.pts[k], ring.pts[(k + 1) % sides], undefined, undefined, undefined, [n, n, n])
    }
}
function flatN(a: V3, b: V3, c: V3, hint: V3): V3[] {
  let n = norm(cross(sub(b, a), sub(c, a)))
  if (dot(n, hint) < 0) n = mul(n, -1)
  return [n, n, n]
}
/** A straight bar from a to b, w across (horizontal) by h, flat-shaded and capped. */
function bar(p: Part, a: V3, b: V3, w: number, h: number) {
  const r: [number, number] = [(w / 2) * Math.SQRT2, (h / 2) * Math.SQRT2]
  sweep(p, [a, b], [r, r], 4, true, true)
}
/** A ring of n corners round (cx, cy) at z, radius r, CCW from above. */
function ring(cx: number, cy: number, r: number, n: number, z: number, rot = Math.PI / n): V3[] {
  return Array.from({ length: n }, (_, i) => {
    const a = rot + (2 * Math.PI * i) / n
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3
  })
}
/** Lofted horizontal rings (same count, CCW from above), capped on top (and bottom). Smooth sides when `smooth`. */
function loft(p: Part, rings: V3[][], { bottom = false, top = true, smooth = false } = {}) {
  const n = rings[0].length
  const c = (r: V3[]): V3 => mul(r.reduce((s, q) => add(s, q), [0, 0, 0] as V3), 1 / r.length)
  for (let k = 0; k < rings.length - 1; k++) {
    const A = rings[k], B = rings[k + 1], ca = c(A), cb = c(B)
    const nr = (q: V3, o: V3): V3 => norm([q[0] - o[0], q[1] - o[1], 0])
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      if (smooth) {
        p.tri(A[i], A[j], B[j], undefined, undefined, undefined, [nr(A[i], ca), nr(A[j], ca), nr(B[j], cb)])
        p.tri(A[i], B[j], B[i], undefined, undefined, undefined, [nr(A[i], ca), nr(B[j], cb), nr(B[i], cb)])
      } else {
        const h = nr(add(A[i], A[j]), add(ca, ca))
        p.tri(A[i], A[j], B[j], undefined, undefined, undefined, flatN(A[i], A[j], B[j], h))
        p.tri(A[i], B[j], B[i], undefined, undefined, undefined, flatN(A[i], B[j], B[i], h))
      }
    }
  }
  const up: V3[] = [[0, 0, 1], [0, 0, 1], [0, 0, 1]], dn: V3[] = [[0, 0, -1], [0, 0, -1], [0, 0, -1]]
  if (top) { const T = rings[rings.length - 1], ct = c(T); for (let i = 0; i < n; i++) p.tri(ct, T[i], T[(i + 1) % n], undefined, undefined, undefined, up) }
  if (bottom) { const B = rings[0], cb = c(B); for (let i = 0; i < n; i++) p.tri(cb, B[(i + 1) % n], B[i], undefined, undefined, undefined, dn) }
}
/** A prism: one ring shape lofted from z0 to z1. */
const prism = (p: Part, mk: (z: number) => V3[], z0: number, z1: number, o: { bottom?: boolean; top?: boolean; smooth?: boolean } = {}) => loft(p, [mk(z0), mk(z1)], o)
/** A chamfered square (half-size h, chamfer c) round (cx, cy) at z. */
const csq = (cx: number, cy: number, h: number, c: number, z: number): V3[] =>
  [[h - c, -h], [h, -h + c], [h, h - c], [h - c, h], [-h + c, h], [-h, h - c], [-h, -h + c], [-h + c, -h]].map(([x, y]) => [cx + x, cy + y, z] as V3)
/** A cone from a ring to an apex. */
function cone(p: Part, base: V3[], apex: V3) {
  const n = base.length
  for (let i = 0; i < n; i++) {
    const a = base[i], b = base[(i + 1) % n]
    p.tri(a, b, apex)
  }
}
/** A block from the ground up to `top`, plan CCW, sides split every `step` m for the drape. */
function footedBlock(p: Part, plan: [number, number][], ground: (x: number, y: number) => number, top: (x: number, y: number) => number, step = 3) {
  for (let i = 0; i < plan.length; i++) {
    const a = plan[i], b = plan[(i + 1) % plan.length]
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step))
    for (let k = 0; k < n; k++) {
      const pa: [number, number] = [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]
      const pb: [number, number] = [a[0] + ((b[0] - a[0]) * (k + 1)) / n, a[1] + ((b[1] - a[1]) * (k + 1)) / n]
      const ga = Math.min(ground(...pa), top(...pa) - 0.05), gb = Math.min(ground(...pb), top(...pb) - 0.05)
      p.quad([pa[0], pa[1], ga], [pb[0], pb[1], gb], [pb[0], pb[1], top(...pb)], [pa[0], pa[1], top(...pa)])
    }
  }
  const cx = plan.reduce((s, q) => s + q[0], 0) / plan.length, cy = plan.reduce((s, q) => s + q[1], 0) / plan.length
  for (let i = 0; i < plan.length; i++) {
    const a = plan[i], b = plan[(i + 1) % plan.length]
    p.tri([cx, cy, top(cx, cy)], [a[0], a[1], top(...a)], [b[0], b[1], top(...b)])
  }
}

// ---- The bridge's lines --------------------------------------------------------------

const TY = 60.4          // towers at y = ±TY (OSM)
const TX = 8.5           // and x = ±TX
const WALL = 105         // the river walls, |y|
const ENDS = [-111.4, 126.5] as const
const EDGE = 7.3         // the deck's outer face (OSM outline)
const PARA_IN = 6.95     // the parapet's inner face

/** The road's centre line, metres above z = 0 (lidar, AOD − 3.0). */
const road = piecewise([
  [-111.4, 4.35], [-105, 4.62], [-100, 4.84], [-90, 5.4], [-80, 5.77], [-70, 6.25], [-60, 6.6], [-50, 6.93], [-40, 7.19],
  [-30, 7.37], [-20, 7.46], [-10, 7.57], [0, 7.59], [10, 7.57], [20, 7.54], [30, 7.4], [40, 7.19], [50, 6.94], [60, 6.64],
  [70, 6.27], [80, 5.83], [90, 5.39], [100, 4.78], [105, 4.58], [110, 4.42], [120, 4.07], [126.5, 3.85],
])
const PARA = 1.15        // parapet top above the road
const GIRDER = 2.0       // the girders' bottom below the road

// Tower stages, z above the water.
const ROAD_T = road(TY)                   // 6.6 at the towers
const PIER_TOP = 4.4, PIER_R = 2.35
const PLINTH_TOP = ROAD_T + 2.6
const CAP0 = 25.6, CAP1 = 26.4, LANTERN = 28.8, SPIRE = 32.3
const BANDS = [ROAD_T + 6.3, ROAD_T + 10.7, ROAD_T + 15.4]

/** Where stays and chains leave the tower (its outer half, a little in from the axis). */
const STAY_X = TX - 0.1
/** Stays: [distance out along the deck from the tower, height on the tower]. */
const MAIN_STAYS: [number, number][] = [[8, 17.4], [15, 18.2], [22, 19.0], [30, 19.8], [39, 20.6], [49, 21.4]]
const SIDE_STAYS: [number, number][] = [[8, 17.4], [15, 18.2], [22, 19.0], [30, 19.8], [38, 20.6]]
const CHAIN_TOP = 22.3

/** The chain's height: a parabola across the main span to the deck at midspan; flatter ones to the river walls. */
const mainChain = (y: number) => road(0) + PARA + 0.2 + (CHAIN_TOP - road(0) - PARA - 0.2) * (y / TY) ** 2
const sideChain = (a: number) => {
  // a = |y| from TY to WALL: from the tower top down to the parapet at the wall, sagging a little.
  const t = (a - TY) / (WALL - TY)
  const straight = CHAIN_TOP + (road(WALL) + PARA + 0.2 - CHAIN_TOP) * t
  return straight - 2.4 * t * (1 - t)
}
const chainZ = (y: number) => (Math.abs(y) <= TY ? mainChain(y) : sideChain(Math.abs(y)))

// Mapterhorn heights above z = 0 (AOD − 3.0) under the ends, 4 m apart in this frame.
const SOUTH_GROUND: GroundGrid = { y0: -128, x0: -16, step: 4, z: [
  [2.6, 2.6, 3.2, 3.6, 3.6, 3.6, 3.5, 3.1, 2.8],
  [2.5, 2.5, 3.2, 3.7, 3.7, 3.8, 3.6, 3.1, 2.7],
  [2.5, 2.5, 3.5, 3.9, 3.9, 4.0, 3.7, 2.6, 2.5],
  [2.4, 2.5, 3.4, 4.1, 4.1, 4.2, 2.9, 1.3, 1.2],
  [2.5, 2.5, 3.5, 4.2, 4.2, 4.1, 1.7, 0.9, 0.7],
  [1.8, 1.6, 2.7, 3.1, 3.2, 2.4, 0.6, 0.2, 0.2],
  [0.5, 0.5, 1.0, 1.5, 1.7, 0.7, 0.0, 0.0, 0.0],
  [0.4, 0.4, 0.5, 0.6, 0.5, 0.2, 0.0, 0.0, 0.0],
  [0.4, 0.4, 0.4, 0.4, 0.4, 0.2, 0.0, 0.0, 0.0],
] }
const NORTH_GROUND: GroundGrid = { y0: 98, x0: -16, step: 4, z: [
  [0.5, 0.5, 0.4, 0.4, 0.4, 0.4, 0.6, 0.6, 0.6],
  [0.5, 0.5, 0.4, 0.4, 0.4, 0.4, 0.6, 0.6, 0.6],
  [0.5, 0.5, 1.0, 1.5, 2.0, 2.2, 1.1, 0.9, 1.0],
  [1.3, 1.4, 3.1, 4.2, 4.3, 4.2, 1.8, 1.7, 1.8],
  [1.8, 1.7, 3.9, 4.3, 4.3, 4.3, 2.6, 1.7, 1.7],
  [1.9, 2.9, 4.1, 4.1, 4.2, 4.1, 3.8, 2.6, 1.9],
  [2.5, 3.6, 4.0, 4.0, 4.0, 4.0, 3.8, 3.2, 2.4],
  [3.3, 3.9, 3.9, 3.8, 3.9, 3.8, 3.9, 3.6, 3.1],
  [3.6, 3.9, 3.7, 3.7, 3.7, 3.7, 3.7, 3.6, 3.3],
] }
const ground = (x: number, y: number) => (y < 0 ? groundAt(SOUTH_GROUND, x, y) : groundAt(NORTH_GROUND, x, y))

// ---- Parts --------------------------------------------------------------------------

type Set = { white: Part; pink: Part; yellow: Part; blue: Part; dark: Part; lamp: Part }
const mk = (): Set => ({ white: new Part(), pink: new Part(), yellow: new Part(), blue: new Part(), dark: new Part(), lamp: new Part() })
const low = mk(), det = mk()
const both = (f: (s: Set, d: boolean) => void) => { f(low, false); f(det, true) }

// ---- Towers -----------------------------------------------------------------------------

function tower(s: Set, d: boolean, tx: number, ty: number) {
  const n = d ? 16 : 8
  const S = (cx: number, cy: number, h: number, c: number, z: number): V3[] => d ? csq(cx, cy, h, c, z) : [[h, -h], [h, h], [-h, h], [-h, -h]].map(([x, y]) => [cx + x, cy + y, z] as V3)
  // Cast-iron pier: a cylinder with a cornice; the tidal lower part dark.
  prism(s.dark, (z) => ring(tx, ty, PIER_R, n, z), 0, 1.4, { top: false, smooth: true })
  prism(s.white, (z) => ring(tx, ty, PIER_R, n, z), 1.4, PIER_TOP - 0.5, { top: false, smooth: true })
  loft(s.white, [ring(tx, ty, PIER_R, n, PIER_TOP - 0.5), ring(tx, ty, PIER_R + 0.35, n, PIER_TOP - 0.15), ring(tx, ty, PIER_R + 0.35, n, PIER_TOP)], { smooth: true })
  // Plinth from the pier through the deck.
  prism(s.white, (z) => S(tx, ty, 1.65, 0.45, z), PIER_TOP, PLINTH_TOP - 0.35, { top: false })
  loft(s.white, [S(tx, ty, 1.65, 0.45, PLINTH_TOP - 0.35), S(tx, ty, 1.85, 0.5, PLINTH_TOP - 0.1), S(tx, ty, 1.85, 0.5, PLINTH_TOP)])
  // The shaft: a lime core, four blue corner columns, three white bands.
  prism(s.yellow, (z) => S(tx, ty, 1.05, 0.35, z), PLINTH_TOP, CAP0, { top: false })
  for (const [cx, cy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]])
    prism(s.blue, (z) => ring(tx + cx * 0.98, ty + cy * 0.98, 0.36, d ? 8 : 6, z), PLINTH_TOP, CAP0, { top: false, smooth: true })
  for (const b of BANDS) loft(s.white, [S(tx, ty, 1.5, 0.5, b - 0.25), S(tx, ty, 1.5, 0.5, b + 0.25)], { bottom: d })
  // Capital and lantern stage.
  loft(s.white, [S(tx, ty, 1.45, 0.45, CAP0), S(tx, ty, 1.75, 0.5, CAP0 + 0.4), S(tx, ty, 1.75, 0.5, CAP1)], { bottom: true })
  if (d) {
    // An open lantern: four corner posts round a slim core, a cornice, corner pinnacles.
    for (const [cx, cy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
      prism(s.white, (z) => S(tx + cx * 1.05, ty + cy * 1.05, 0.2, 0.05, z), CAP1, LANTERN - 0.4, { top: false })
      cone(s.white, ring(tx + cx * 1.5, ty + cy * 1.5, 0.2, 6, CAP1), [tx + cx * 1.5, ty + cy * 1.5, CAP1 + 1.3])
    }
    prism(s.yellow, (z) => ring(tx, ty, 0.62, 8, z), CAP1, LANTERN - 0.4, { top: false })
    for (const [cx, cy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]])
      prism(s.blue, (z) => ring(tx + cx * 0.6, ty + cy * 0.6, 0.12, 4, z), CAP1, LANTERN - 0.4, { top: false })
  } else {
    prism(s.yellow, (z) => S(tx, ty, 0.95, 0.3, z), CAP1, LANTERN - 0.4, { top: false })
    for (const [cx, cy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]])
      prism(s.white, (z) => S(tx + cx * 1.0, ty + cy * 1.0, 0.24, 0.06, z), CAP1, LANTERN - 0.4, { top: false })
  }
  loft(s.white, [S(tx, ty, 1.3, 0.4, LANTERN - 0.4), S(tx, ty, 1.4, 0.45, LANTERN - 0.15), S(tx, ty, 1.4, 0.45, LANTERN)], { bottom: true, top: false })
  // The spire: a short drum and a needle.
  loft(s.white, [S(tx, ty, 1.4, 0.45, LANTERN), S(tx, ty, 0.55, 0.15, LANTERN + 0.9)], { top: false })
  cone(s.white, ring(tx, ty, 0.55, 8, LANTERN + 0.9), [tx, ty, SPIRE])
}

/** The portal girder across a tower pair: a straight top chord and an arch under it, lattice in the spandrels. */
function portal(s: Set, d: boolean, ty: number) {
  const xi = TX - 1.1, top0 = CAP0 - 0.9, top1 = CAP0 - 0.35, spring = 22.6, crown = 24.75
  const arch = (x: number) => spring + (crown - spring) * (1 - (x / xi) ** 2)
  bar(s.white, [-xi, ty, (top0 + top1) / 2], [xi, ty, (top0 + top1) / 2], 0.55, top1 - top0)
  const xs = stations(-xi, xi, d ? 1.0 : 2.5)
  const path = xs.map((x) => [x, ty, arch(x) - 0.3] as V3)
  sweep(s.white, path, path.map(() => [0.3, 0.32] as [number, number]), 4, true, true)
  // Spandrels: solid near the towers in the low model, lattice in the detail.
  for (const sg of [-1, 1]) {
    if (d) {
      const xs2 = stations(0.8, xi - 0.2, 1.1)
      for (let i = 0; i < xs2.length - 1; i++) {
        const xa = sg * xs2[i], xb = sg * xs2[i + 1]
        const za = arch(xa), zb = arch(xb)
        if (top0 - Math.max(za, zb) < 0.3) continue
        bar(s.white, [i % 2 ? xa : xb, ty, i % 2 ? za : zb], [i % 2 ? xb : xa, ty, top0], 0.12, 0.12)
      }
    } else {
      const xa = sg * (xi - 2.6), xb = sg * xi
      const q: V3[] = [[xa, ty, top0], [xb, ty, top0], [xb, ty, arch(xb)], [xa, ty, arch(xa)]]
      for (const [yy, f] of [[ty - 0.2, -1], [ty + 0.2, 1]] as const) {
        const qq = q.map(([x, , z]) => [x, yy, z] as V3)
        const nn = norm(cross(sub(qq[1], qq[0]), sub(qq[2], qq[0])))
        if (nn[1] * f > 0) s.white.quad(qq[0], qq[1], qq[2], qq[3]); else s.white.quad(qq[0], qq[3], qq[2], qq[1])
      }
    }
  }
  // The finial over the crown.
  prism(s.white, (z) => csq(0, ty, 0.3, 0.08, z), top1, top1 + 0.6, { top: false })
  cone(s.white, csq(0, ty, 0.3, 0.08, top1 + 0.6), [0, ty, top1 + 1.5])
}

for (const ty of [-TY, TY]) {
  both((s, d) => {
    for (const tx of [-TX, TX]) tower(s, d, tx, ty)
    portal(s, d, ty)
  })
}

// ---- Central piers (1973) -------------------------------------------------------------------

both((s, d) => {
  const n = d ? 14 : 10
  for (const sg of [-1, 1]) {
    const cx = sg * 9.0
    // Plain concrete cylinders, no cornice.
    prism(s.dark, (z) => ring(cx, 0.3, 2.2, n, z), 0, road(0) - GIRDER - 0.6, { smooth: true })
  }
  // The steel cross-head under the deck.
  bar(s.dark, [-10.5, 0.3, road(0) - GIRDER - 0.3], [10.5, 0.3, road(0) - GIRDER - 0.3], 1.6, 0.6)
})

// ---- Deck edges: girders, parapets, underside ----------------------------------------------------

const spans: [number, number][] = [[ENDS[0] + 0.3, -TY - 1.9], [-TY + 1.9, TY - 1.9], [TY + 1.9, ENDS[1] - 0.3]]
both((s, d) => {
  for (const [a, b] of spans) {
    const ys = stations(a, b, d ? 4 : 8)
    for (const sg of [-1, 1]) {
      const x0 = sg * PARA_IN, x1 = sg * EDGE
      // The pink face: girder and parapet in one band, outer face and inner face.
      band(s.pink, Math.min(x0, x1), Math.max(x0, x1), ys, (y) => road(y) + PARA - 0.12, (y) => road(y) - GIRDER + 0.3, { out: true })
      band(s.pink, Math.min(x0, x1), Math.max(x0, x1), ys, (y) => road(y) + PARA - 0.12, (y) => road(y) + 0.1, { in: true })
      // The white top rail, a little proud.
      band(s.white, sg > 0 ? PARA_IN - 0.08 : -EDGE - 0.08, sg > 0 ? EDGE + 0.08 : -PARA_IN + 0.08, ys, (y) => road(y) + PARA, (y) => road(y) + PARA - 0.14, d ? { out: true, in: true, top: true, bottom: true, ends: true } : { out: true, top: true })
      // The dark bottom flange of the edge girder.
      band(s.dark, sg > 0 ? PARA_IN : -EDGE - 0.1, sg > 0 ? EDGE + 0.1 : -PARA_IN, ys, (y) => road(y) - GIRDER + 0.3, (y) => road(y) - GIRDER, { out: true, bottom: true, ends: true })
    }
    // The deck's underside between the girders, facing down.
    band(s.dark, -PARA_IN, PARA_IN, ys.filter((y) => Math.abs(y) < WALL + 2 || ys.length < 3), (y) => road(y) - 0.4, (y) => road(y) - GIRDER + 0.25, { bottom: true })
  }
  // Across the tower piers: the parapet runs on round the plinths (the plinth covers it).
  if (d) {
    // Parapet posts and rosettes, both faces, every 2.25 m.
    for (const [a, b] of spans)
      for (const y of stations(a + 1, b - 1, 2.25))
        for (const sg of [-1, 1]) {
          const r = road(y)
          const post = (a: V3, b: V3, w: number, h: number) => { const rr: [number, number] = [(w / 2) * Math.SQRT2, (h / 2) * Math.SQRT2]; sweep(s.white, [a, b], [rr, rr], 4, false, true) }
          post([sg * (EDGE + 0.05), y, r - GIRDER + 0.35], [sg * (EDGE + 0.05), y, r + PARA - 0.14], 0.12, 0.2)
          post([sg * (PARA_IN - 0.04), y, r + 0.1], [sg * (PARA_IN - 0.04), y, r + PARA - 0.14], 0.1, 0.18)
          const mid = y + 1.125
          if (mid < b - 0.6) {
            const rm = road(mid)
            for (const [x, out] of [[sg * (EDGE + 0.05), sg], [sg * (PARA_IN - 0.05), -sg]] as const) {
              // A flat rosette, an octagon a hair proud of the face.
              const c: V3 = [x, mid, rm + 0.55], n: V3 = [out, 0, 0]
              const pts = Array.from({ length: 8 }, (_, i) => add(c, [0, 0.32 * Math.cos((i * Math.PI) / 4 + Math.PI / 8), 0.32 * Math.sin((i * Math.PI) / 4 + Math.PI / 8)]) as V3)
              for (let i = 1; i < 7; i++) s.yellow.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n])
            }
          }
        }
  }
})

// ---- Abutments at the ends: pale stone masonry from the ground up under the deck ------------------------------

both((s) => {
  for (const [y0, y1] of [[ENDS[0] + 0.3, -WALL + 1], [WALL - 1, 113]] as const)
    footedBlock(s.white, [[-EDGE, y0], [EDGE, y0], [EDGE, y1], [-EDGE, y1]], ground, (_x, y) => road(y) - 0.35, 2.5)
})

// ---- Stays, chains and hangers ----------------------------------------------------------------------

/** One stay: from its height on the tower to the deck edge `dist` out, toward `dir` (±1 in y). */
function stay(s: Set, d: boolean, sg: number, ty: number, dir: number, dist: number, h: number) {
  const y1 = ty + dir * dist
  const a: V3 = [sg * STAY_X, ty + dir * 0.9, h], b: V3 = [sg * (EDGE - 0.05), y1, road(y1) + PARA - 0.1]
  if (d) bar(s.white, a, b, 0.5, 0.65)
  else { const r: [number, number] = [0.34 * Math.SQRT2, 0.36 * Math.SQRT2]; sweep(s.white, [a, b], [r, r], 4, false, true) }
  return [a, b] as [V3, V3]
}
const chainPath = (sg: number, from: number, to: number, step: number): V3[] => stations(from, to, step).map((y) => [sg * (STAY_X - 0.1 + 0.25 * Math.min(1, Math.abs(Math.abs(y) - TY) / 20)), y, chainZ(y)] as V3)

both((s, d) => {
  const lampR = d ? 0.16 : 0.42, lampStep = d ? 2.6 : 9.0
  for (const sg of [-1, 1]) {
    for (const ty of [-TY, TY]) {
      const inward = -Math.sign(ty), outward = Math.sign(ty)
      for (const [dist, h] of MAIN_STAYS) {
        const [a, b] = stay(s, d, sg, ty, inward, dist, h)
        const L = Math.hypot(...sub(b, a)), nb = Math.max(1, Math.floor(L / lampStep))
        if (d || dist === 22) for (let i = 1; i < nb; i++) bead(s.lamp, add(lerp3(a, b, i / nb), [0, 0, 0.3]), lampR, !d)
      }
      for (const [dist, h] of SIDE_STAYS) {
        const [a, b] = stay(s, d, sg, ty, outward, dist, h)
        const L = Math.hypot(...sub(b, a)), nb = Math.max(1, Math.floor(L / lampStep))
        if (d || dist === 22) for (let i = 1; i < nb; i++) bead(s.lamp, add(lerp3(a, b, i / nb), [0, 0, 0.3]), lampR, !d)
      }
    }
    // Chains: across the main span, and down each side span to the river wall.
    const runs: [number, number][] = [[-TY + 1, TY - 1], [-WALL, -TY - 1], [TY + 1, WALL]]
    for (const [a, b] of runs) {
      const path = chainPath(sg, a, b, d ? 2.5 : 8)
      sweep(s.white, path, path.map(() => [0.34, 0.5] as [number, number]), 4, true, true)
      // Bulbs along the top of the chain.
      const L = b - a
      const nb = Math.round(L / lampStep)
      for (let i = 1; i < nb; i++) {
        const y = a + (L * i) / nb
        bead(s.lamp, [sg * (STAY_X - 0.1 + 0.25 * Math.min(1, Math.abs(Math.abs(y) - TY) / 20)), y, chainZ(y) + 0.45], lampR, !d)
      }
      // Hangers, every 6 m where the chain stands clear of the parapet.
      if (d)
        for (const y of stations(a + 3, b - 3, 6)) {
          const z = chainZ(y), r = road(y) + PARA
          if (z - r < 1.2) continue
          const x = sg * (STAY_X - 0.1 + 0.25 * Math.min(1, Math.abs(Math.abs(y) - TY) / 20))
          bar(s.white, [x, y, r - 0.05], [x, y, z - 0.2], 0.12, 0.12)
        }
    }
    // Bulbs up the towers' outer corners.
    if (d) for (const ty of [-TY, TY]) for (const cy of [-1, 1]) for (const z of stations(PLINTH_TOP + 0.5, CAP0 - 0.5, 2.4))
      bead(s.lamp, [sg * (TX + 1.36), ty + cy * 1.36, z], 0.13)
  }
  // Each chain's ends sit in a white shoe on the parapet at the river walls.
  for (const sg of [-1, 1]) for (const y of [-WALL, WALL])
    bar(s.white, [sg * (EDGE - 0.1), y - 1.2, road(y) + PARA + 0.05], [sg * (EDGE - 0.1), y + 1.2, road(y) + PARA + 0.05], 0.6, 0.5)
})

// ---- Toll booths --------------------------------------------------------------------------------------

const BOOTHS: [number, number][] = [[-7.57, -107.78], [6.86, -109.38], [-7.38, 109.89], [7.34, 108.48]]
both((s, d) => {
  for (const [cx, cy] of BOOTHS) {
    const z0 = road(cy) + 0.12, r = 2.25
    const oct = (rr: number, z: number) => ring(cx, cy, rr, 8, z, Math.PI / 8)
    loft(s.dark, [oct(r + 0.05, z0 - 0.3), oct(r + 0.05, z0 + 0.4)], { top: false })
    loft(s.yellow, [oct(r, z0 + 0.4), oct(r, z0 + 3.3)], { top: false })
    loft(s.white, [oct(r, z0 + 3.3), oct(r + 0.35, z0 + 3.55), oct(r + 0.6, z0 + 3.6)], { top: false })
    loft(s.white, [oct(r + 0.6, z0 + 3.6), oct(0.35, z0 + 4.55)])
    // Blue corner posts.
    for (const p of oct(r + 0.04, 0)) prism(s.blue, (z) => ring(p[0], p[1], 0.15, d ? 6 : 4, z), z0 + 0.4, z0 + 3.3, { top: false })
    if (d) for (const p of oct(r + 0.02, 0)) bead(s.lamp, [p[0], p[1], z0 + 3.75], 0.12)
  }
})

// ---- Materials and output ------------------------------------------------------------------------------

// The towers and portals are floodlit; the wash fades a little toward the top.
const towerLit = (p: V3, n: V3): number => {
  if (Math.abs(Math.abs(p[1]) - TY) > 2.6) return 0
  if (p[2] < PIER_TOP) return 0.3
  return (n[2] > 0.7 ? 0.3 : 1) * (1 - 0.3 * Math.min(1, Math.max(0, (p[2] - ROAD_T) / (SPIRE - ROAD_T))))
}
const WHITE = { ...finish('ivory-paint', 0xf3efe6), floodlight: towerLit }
const PINK = finish('parapet-pink', 0xe9c6bf)
const YELLOW = { ...finish('pastel-green', 0xd3dfc2), floodlight: towerLit }
const BLUE = { ...finish('pastel-blue', 0xa6c3d6), floodlight: towerLit }
const DARK = finish('concrete-grey', 0x9b968d)
const LAMP = { name: 'lamp', color: 0xf3efe6 }
const list = (s: Set, d: boolean) => [
  { part: s.white, material: d ? { ...WHITE, doubleSided: true } : WHITE },
  { part: s.pink, material: PINK },
  { part: s.yellow, material: YELLOW },
  { part: s.blue, material: BLUE },
  { part: s.dark, material: DARK },
  { part: s.lamp, material: LAMP },
]

const extras = {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the tower pairs, on the water',
  bearing: 342.6, elevation: 0, towers: [-TY, TY], waterAOD: 3.0,
  roadwaySouthWall: road(-WALL), roadwayAtTowers: ROAD_T, roadwayMidspan: road(0), roadwayNorthWall: road(WALL),
}
if (import.meta.main) {
  for (const [file, l, maxTris, maxBytes] of [
    ['london-albert-bridge.glb', list(low, false), 6500, 250 * 1024],
    ['london-albert-bridge.detail.glb', list(det, true), 40000, 1536 * 1024],
  ] as const) {
    let tris = 0
    for (const { part } of l) tris += part.triangles
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Albert Bridge', [...l], extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
