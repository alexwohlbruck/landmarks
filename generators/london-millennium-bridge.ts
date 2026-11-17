/**
 * Millennium Bridge, London (2000; Foster + Partners, Arup, Sir Anthony
 * Caro) — procedural, CC0-1.0, no textures.
 * bun generators/london-millennium-bridge.ts
 *
 * The whole footbridge as one placement, from the landing in front of Tate
 * Modern to Peter's Hill: the pale aluminium deck and its walking surface
 * (a footbridge, so the model owns it), the edge tubes, the balustrade, the
 * two bundles of four suspension cables slung beside the deck, the
 * transverse arms every 8 m that clamp the cables and carry the deck, the
 * two river piers with their Y-shaped steel arms, the south landing with
 * its ramps and cable anchorages, and the north abutment. Writes a low
 * model (deck, cable bundles as flat ribbons, every arm, piers, landing,
 * handrails, sparse lamps) and a detail model (the eight cables apart, the
 * curved balustrade posts and wires, the cable clamps, every lamp), which
 * the map draws from detailZoom up.
 *
 * Frame: x across the bridge (east), y along it toward the City (north), z
 * up, metres. Placed at bearing 2.41°, the line from the south pier's
 * centroid to the north one's (OSM way/166458270 to way/166458268, 140.4 m
 * apart); the anchor is midway between them.
 *
 * Height. z = 0 is the river, the lowest ground under the footprint: the
 * Environment Agency lidar reads the water at 3.07 m AOD on its flight and
 * Mapterhorn at 3.11 m, so z = height AOD − 3.1. The model owns the walking
 * surface; it was built to the lidar deck, measured along the centre line:
 * 6.5 m above the water where the deck splits into the south ramps
 * (y = −135), 9.5 m at the south pier, 10.6 m at midspan, 11.1 m at the
 * north pier (the crest) and 8.2 m where it meets Peter's Hill (y = 150.7).
 * The ramps fall to the south landing at 4.85 m.
 *
 * Feet on the terrain: the piers stand in the river at z = 0. The south
 * landing's block, its cable anchor blocks and the north abutment run down
 * to the ground under them vertex by vertex, from 4 m tables of Mapterhorn
 * heights in this frame (SOUTH_GROUND, NORTH_GROUND), less 3.11 m.
 *
 * Sources:
 * - OSM: the outline relation/10224724 (way/376237881 with the stair well
 *   way/376237918 as its inner ring), from y = −173.8 to 150.7 (324.5 m);
 *   way/659424463, an older outline of the same bridge without the south
 *   ramps; the piers way/166458268 and way/166458270 (bridge:support=pylon),
 *   7.6–8.1 m across the bridge by 3.7–3.8 m; the balustrades as fences
 *   way/166319260 and way/166319319; the deck's footway area
 *   relation/5606794; the footways (way/7225371 etc.) for the split ramps.
 * - Lidar: Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government
 *   Licence v3.0 (surveys of about 2000–2022), read in this frame: the deck
 *   profile above; the cable bundles 1.6–3.1 m above the deck over the
 *   piers (15.75 m AOD at both, so 12.65 m here) and 0.3 m under the deck
 *   at midspan; the side spans' cables (south: 9.8 m at y = −96, 8.3 at
 *   −112, 7.1 at −128; north: 11.0 at 88, 10.3 at 96); the structure's
 *   width, about ±5.5 m across the main span, ±7.5–8 m at the piers and on
 *   the south side span, ±4–4.5 m on the north side span; the landing at
 *   7.95 m AOD, ±9.5 m wide; the south bank ground 5.3 m AOD.
 * - Published (Wikipedia "Millennium Bridge, London"; Arup): 325 m long,
 *   4 m wide aluminium deck; spans 81, 144 and 108 m; eight cables, four a
 *   side, 120 mm; sag 2.3 m over the main span; transverse arms every 8 m;
 *   opened June 2000, closed and stiffened with dampers 2000–2002.
 * - Photos (Wikimedia Commons): "From the top of St Paul's Cathedral -
 *   Looking down at the Millennium Bridge" (Chris Gorringe, CC BY-SA 2.0;
 *   the plan, the cables' kinks at the piers and the flared south landing);
 *   "2017 London Millennium Bridge from tour boat 01" (Jordiferrer, CC BY-SA
 *   4.0; the north pier and its Y); "Millennium Bridge from the Tate Modern,
 *   London" (Christine Matthews, CC BY-SA 2.0; the tapered pier, the arms
 *   and transverse arms); "Millennium Bridge and St Paul's Cathedral from the
 *   Tate Modern" (Robert Lamb, CC BY-SA 2.0; the ramps and stair well); "End
 *   of the Millennium Bridge" (Matt Brown, CC BY 2.0; the south landing, the
 *   four-barrel cable ends and backstays); "Millennium Bridge River Thames
 *   London England from Paul's Walk 01" and "03" (Acabashi, CC BY-SA 4.0;
 *   the edge tubes, curved balustrade posts and wires, the arm and cable
 *   clamps); "London Millennium Bridge at night 2025-01-24" (LimeSpiked, CC
 *   BY 2.0; the lit deck edges and piers).
 * - Estimated from photos: the piers' taper (8.0 × 3.8 m at the water to
 *   5.8 × 2.8 m at the top, 3.3 m above the water); the Y arms' size and
 *   lean (from the pier top to ±7.4 m at 12.0 m); the cables' plan between
 *   the lidar readings; the deck's section (edge tubes 0.56 m, 0.55 m deep
 *   overall); the balustrade (1.15 m, posts every 1.5 m in the detail
 *   model, every one of the real ~1.3 m spacing would shimmer); the north
 *   abutment and anchor blocks, which no photo shows clearly; the
 *   backstays' line at the south landing.
 * - Drawn bolder than real, as STYLE.md asks of bridges: each cable 0.26 m
 *   thick against the real 0.12 m; the bundles in the low model as one flat
 *   ribbon 1.2 m wide.
 * - Left out: the stairs in the south stair well and the stair towers at
 *   the north end; the tuned-mass dampers under the deck.
 *
 * Night: the deck edges are lit along their whole length (the "blade of
 * light"), drawn as `lamp` beads along both edges; the piers and their Y
 * arms are uplit, so they carry a `_FLOODLIGHT` wash.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { band, bead, groundAt, merged, piecewise, stations, type GroundGrid } from './bridge-kit'
import { finish } from './palette'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const norm = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

// ---- Geometry helpers --------------------------------------------------------

/**
 * A tube along a path with an elliptical section: `a` across (horizontal,
 * perpendicular to the path) and `b` the other way, per point; smooth-shaded.
 * Ends capped when `caps`.
 */
function sweep(p: Part, path: V3[], radii: [number, number][], sides: number, caps = false, flat = false) {
  const rings: { pts: V3[]; ns: V3[] }[] = []
  for (let i = 0; i < path.length; i++) {
    const t = norm(sub(path[Math.min(i + 1, path.length - 1)], path[Math.max(i - 1, 0)]))
    const s = norm(Math.abs(t[2]) > 0.95 ? cross(t, [0, 1, 0]) : cross(t, [0, 0, 1]))
    const u = cross(s, t)
    const [a, b] = radii[i]
    const pts: V3[] = [], ns: V3[] = []
    for (let k = 0; k < sides; k++) {
      const th = (2 * Math.PI * (k + 0.5)) / sides
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
        p.tri(A.pts[k], B.pts[k], B.pts[j], undefined, undefined, undefined, outward3(A.pts[k], B.pts[k], B.pts[j], add(A.ns[k], A.ns[j])))
        p.tri(A.pts[k], B.pts[j], A.pts[j], undefined, undefined, undefined, outward3(A.pts[k], B.pts[j], A.pts[j], add(A.ns[k], A.ns[j])))
      } else {
        p.tri(A.pts[k], B.pts[k], B.pts[j], undefined, undefined, undefined, [A.ns[k], B.ns[k], B.ns[j]])
        p.tri(A.pts[k], B.pts[j], A.pts[j], undefined, undefined, undefined, [A.ns[k], B.ns[j], A.ns[j]])
      }
    }
  if (caps)
    for (const [ring, dir] of [[rings[0], -1], [rings[rings.length - 1], 1]] as const) {
      const i = dir < 0 ? 0 : path.length - 1
      const t = norm(sub(path[Math.min(i + 1, path.length - 1)], path[Math.max(i - 1, 0)]))
      const n = mul(t, dir)
      for (let k = 0; k < sides; k++) p.tri(path[i], ring.pts[k], ring.pts[(k + 1) % sides], undefined, undefined, undefined, [n, n, n])
    }
}
/** A flat normal for a triangle, turned to agree with `hint`. */
function outward3(a: V3, b: V3, c: V3, hint: V3): V3[] {
  let n = norm(cross(sub(b, a), sub(c, a)))
  if (dot(n, hint) < 0) n = mul(n, -1)
  return [n, n, n]
}

/** A straight box member from a to b, w wide (horizontal) and h deep, flat-shaded, capped. */
function member(p: Part, a: V3, b: V3, w: number, h: number) {
  sweep(p, [a, b], [[w / 2 * Math.SQRT2, h / 2 * Math.SQRT2], [w / 2 * Math.SQRT2, h / 2 * Math.SQRT2]], 4, true, true)
}

/** A closed loft through horizontal rings (each CCW from above, same count), capped top and optionally bottom. */
function loft(p: Part, rings: V3[][], bottom = false, smooth = true) {
  const n = rings[0].length
  const c = (r: V3[]): V3 => mul(r.reduce((s, q) => add(s, q), [0, 0, 0] as V3), 1 / r.length)
  for (let k = 0; k < rings.length - 1; k++) {
    const A = rings[k], B = rings[k + 1], ca = c(A), cb = c(B)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      if (smooth) {
        const nr = (q: V3, o: V3): V3 => norm([q[0] - o[0], q[1] - o[1], 0])
        p.tri(A[i], A[j], B[j], undefined, undefined, undefined, [nr(A[i], ca), nr(A[j], ca), nr(B[j], cb)])
        p.tri(A[i], B[j], B[i], undefined, undefined, undefined, [nr(A[i], ca), nr(B[j], cb), nr(B[i], cb)])
      } else {
        p.tri(A[i], A[j], B[j])
        p.tri(A[i], B[j], B[i])
      }
    }
  }
  const top = rings[rings.length - 1], ct = c(top)
  for (let i = 0; i < n; i++) p.tri(ct, top[i], top[(i + 1) % n], undefined, undefined, undefined, [[0, 0, 1], [0, 0, 1], [0, 0, 1]])
  if (bottom) {
    const b0 = rings[0], cb = c(b0)
    for (let i = 0; i < n; i++) p.tri(cb, b0[(i + 1) % n], b0[i], undefined, undefined, undefined, [[0, 0, -1], [0, 0, -1], [0, 0, -1]])
  }
}

/** A stadium (rounded rectangle) ring, a across x and b along y, CCW from above. */
function stadium(cy: number, a: number, b: number, z: number, seg = 4): V3[] {
  const r = b / 2, hx = a / 2 - r, out: V3[] = []
  for (const [cx, a0] of [[hx, -Math.PI / 2], [-hx, Math.PI / 2]] as const)
    for (let i = 0; i <= seg; i++) {
      const th = a0 + (Math.PI * i) / seg
      out.push([cx + r * Math.cos(th), cy + r * Math.sin(th), z])
    }
  return out
}

/** A wall-footed block: plan polygon (CCW) from the ground up to `top`, edges split for the drape. */
function footedBlock(p: Part, plan: [number, number][], ground: (x: number, y: number) => number, top: number | ((x: number, y: number) => number), step = 3) {
  const T = typeof top === 'number' ? () => top : top
  for (let i = 0; i < plan.length; i++) {
    const a = plan[i], b = plan[(i + 1) % plan.length]
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step))
    for (let k = 0; k < n; k++) {
      const pa: [number, number] = [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]
      const pb: [number, number] = [a[0] + ((b[0] - a[0]) * (k + 1)) / n, a[1] + ((b[1] - a[1]) * (k + 1)) / n]
      p.quad([pa[0], pa[1], ground(...pa)], [pb[0], pb[1], ground(...pb)], [pb[0], pb[1], T(...pb)], [pa[0], pa[1], T(...pa)])
    }
  }
  const cx = plan.reduce((s, q) => s + q[0], 0) / plan.length, cy = plan.reduce((s, q) => s + q[1], 0) / plan.length
  for (let i = 0; i < plan.length; i++) {
    const a = plan[i], b = plan[(i + 1) % plan.length]
    p.tri([cx, cy, T(cx, cy)], [a[0], a[1], T(...a)], [b[0], b[1], T(...b)])
  }
}

// ---- The bridge's lines ---------------------------------------------------------

const PIER = 70.2                 // piers at y = ±PIER (OSM, 140.4 m apart)
const NORTH_END = 150.7           // the outline's north end, at Peter's Hill
const SPLIT = -135                // where the deck splits into the south ramps
const LAND = [-174, -160] as const // the south landing, along y
const LAND_TOP = 4.85             // its walking surface (lidar 7.95 m AOD)
const LAND_W = 7.5                // its half-width (the cable ends stand out past it)

/** The walking surface along the centre line, metres above the water (lidar). */
const deck = piecewise([
  [SPLIT, 6.52], [-128, 6.86], [-120, 7.2], [-112, 7.58], [-100, 8.17], [-92, 8.63], [-80, 9.17], [-70, 9.5],
  [-60, 9.79], [-40, 10.11], [-20, 10.4], [0, 10.63], [20, 10.84], [40, 10.96], [60, 11.05], [72, 11.06],
  [80, 10.88], [90, 10.5], [100, 10.11], [110, 9.77], [120, 9.42], [130, 9.04], [140, 8.64], [NORTH_END, 8.19],
])
/** The ramps from the split down to the landing. */
const ramp = piecewise([[LAND[1], LAND_TOP], [SPLIT, 6.52]])

const HALF = 2.0       // the deck's half-width (published 4 m)
const DEPTH = 0.55     // walking surface to the underside
const EDGE_R = 0.28    // the edge tubes
const EDGE_Z = 0.36    // their centre below the walking surface

/** The cable bundles' centre height (lidar): a parabola with 2.3 m sag between the piers. */
const SADDLE = 12.65, SAG = 2.3
const southCable = piecewise([[-170, 5.25], [-160, 5.45], [-150, 5.85], [-140, 6.4], [-128, 7.06], [-120, 7.7], [-112, 8.33], [-104, 9.03], [-96, 9.83], [-88, 10.76], [-80, 11.65], [-PIER, SADDLE]])
const northCable = piecewise([[PIER, SADDLE], [80, 11.8], [88, 11.05], [96, 10.3], [104, 9.6], [112, 8.9], [120, 8.2], [128, 7.5], [136, 6.8]])
const cableZ = (y: number) => Math.abs(y) <= PIER ? SADDLE - SAG + SAG * (y / PIER) ** 2 : y < 0 ? southCable(y) : northCable(y)
/** Their offset from the axis (lidar widths and the St Paul's photo). */
const cableX = piecewise([
  [-170, 9.2], [-160, 8.6], [-150, 8.1], [-140, 7.7], [-128, 7.4], [-112, 7.0], [-100, 6.9], [-88, 7.1], [-78, 7.4], [-PIER, 7.55],
  [-62, 6.7], [-54, 5.8], [-46, 5.45], [46, 5.45], [54, 5.8], [62, 6.7], [PIER, 7.55], [78, 6.6], [86, 5.2], [94, 4.3], [104, 3.95], [136, 3.75],
])
const CABLE_ENDS = [-170, 136] as const
const CABLE_R = 0.13   // each cable drawn 0.26 m thick (real 0.12 m)
const CABLE_GAP = 0.32 // centre to centre in a bundle

// Transverse arms: every 8 m from each pier into the side spans, and 18 equal
// bays (7.8 m) across the main span.
const ARMS = [
  ...stations(-PIER, PIER, 7.8),
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((k) => -PIER - 8 * k),
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((k) => PIER + 8 * k),
].sort((a, b) => a - b)

// Mapterhorn heights above the water (metres AOD − 3.11), 4 m apart in this
// frame, under the two ends: rows along y from y0, columns across from x0.
const NORTH_GROUND: GroundGrid = { y0: 120, x0: -20, step: 4, z: [
  [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.6, 1.6],
  [1.8, 1.9, 1.8, 1.6, 1.6, 1.6, 1.6, 1.4, 1.5, 1.6, 1.7],
  [2.1, 1.8, 1.8, 1.7, 1.7, 1.7, 1.3, 1.3, 1.7, 1.7, 1.7],
  [1.9, 2.1, 1.9, 1.8, 1.8, 1.8, 1.7, 1.7, 1.8, 1.7, 1.6],
  [1.7, 1.9, 2.0, 1.9, 1.9, 1.8, 1.8, 1.8, 1.8, 1.7, 1.6],
  [1.8, 1.9, 2.0, 2.0, 2.0, 1.9, 1.8, 1.8, 1.7, 1.7, 1.6],
  [1.7, 1.8, 1.9, 1.9, 1.9, 1.8, 1.8, 1.8, 1.7, 1.7, 1.7],
  [1.7, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.7, 1.7, 1.7, 1.6],
  [1.7, 1.7, 1.8, 1.8, 1.8, 1.7, 1.7, 1.7, 1.7, 1.6, 1.6],
  [1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.6, 1.6, 1.6],
  [1.6, 1.7, 1.7, 1.7, 1.7, 1.7, 1.6, 1.6, 1.6, 1.6, 1.6],
] }
const SOUTH_GROUND: GroundGrid = { y0: -184, x0: -20, step: 4, z: [
  [2.5, 2.5, 2.5, 2.4, 2.5, 2.5, 2.5, 2.4, 2.4, 2.5, 2.5],
  [2.5, 2.3, 2.3, 2.3, 2.3, 2.4, 2.3, 2.3, 2.4, 2.4, 2.4],
  [2.4, 2.3, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.3, 2.4, 2.4],
  [2.4, 2.2, 2.1, 2.1, 2.1, 2.1, 2.1, 2.2, 2.2, 2.4, 2.3],
  [2.4, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.4, 2.2],
  [2.4, 2.3, 2.2, 2.2, 2.2, 2.2, 2.3, 2.3, 2.3, 2.4, 2.2],
  [2.4, 2.4, 2.4, 2.3, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.2],
  [2.4, 2.5, 2.5, 2.5, 2.6, 2.6, 2.6, 2.6, 2.5, 2.4, 2.3],
  [2.4, 2.5, 2.7, 2.8, 3.2, 3.3, 2.8, 2.7, 2.6, 2.4, 2.3],
  [2.4, 2.6, 2.7, 2.9, 3.3, 3.4, 2.9, 2.7, 2.6, 2.4, 2.3],
  [2.4, 2.6, 2.7, 2.9, 3.1, 3.1, 3.0, 2.8, 2.6, 2.4, 2.2],
] }
const northGround = (x: number, y: number) => groundAt(NORTH_GROUND, x, y)
const southGround = (x: number, y: number) => groundAt(SOUTH_GROUND, x, y)

// ---- Parts -----------------------------------------------------------------------

type Set = { alu: Part; steel: Part; cable: Part; concrete: Part; lamp: Part }
const newSet = (): Set => ({ alu: new Part(), steel: new Part(), cable: new Part(), concrete: new Part(), lamp: new Part() })
const low = newSet(), det = newSet()

/** The deck: walking surface, fascias, edge tubes and underside, between y0 and y1. */
function deckRun(s: Set, ys: number[], top: (y: number) => number, x0: number, x1: number, sides = 8) {
  band(s.alu, x0, x1, ys, top, (y) => top(y) - 0.16, { top: true, out: true, in: true })
  band(s.alu, x0 + 0.15, x1 - 0.15, ys, (y) => top(y) - 0.16, (y) => top(y) - DEPTH, { bottom: true, out: true, in: true })
  for (const x of [x0 - 0.05, x1 + 0.05])
    sweep(s.alu, ys.map((y) => [x, y, top(y) - EDGE_Z] as V3), ys.map(() => [EDGE_R, EDGE_R] as [number, number]), sides)
}

/** Balustrade along one deck edge at x: handrail (both models), posts and wires (detail). */
function balustrade(x: number, ys: number[], top: (y: number) => number, lowToo = true) {
  const out = Math.sign(x)
  const rail = (y: number): V3 => [x + out * 0.05, y, top(y) + 1.15]
  if (lowToo) band(low.steel, x + out * 0.0, x + out * 0.12, ys, (y) => top(y) + 1.2, (y) => top(y) + 1.08, { top: true, out: true, in: true, bottom: true })
  sweep(det.steel, ys.map(rail), ys.map(() => [0.07, 0.07] as [number, number]), 6)
  for (const h of [0.45, 0.8]) sweep(det.steel, ys.map((y) => [x + out * 0.08, y, top(y) + h] as V3), ys.map(() => [0.025, 0.025] as [number, number]), 3)
  const span = ys[ys.length - 1] - ys[0]
  const n = Math.max(1, Math.round(span / 1.5))
  for (let i = 0; i <= n; i++) {
    const y = ys[0] + (span * i) / n, t = top(y)
    // A curved post: out from the edge tube, up, and in under the rail.
    const path: V3[] = [[x + out * 0.3, y, t - EDGE_Z], [x + out * 0.34, y, t + 0.15], [x + out * 0.28, y, t + 0.6], [x + out * 0.12, y, t + 1.1]]
    sweep(det.steel, path, path.map(() => [0.05, 0.035] as [number, number]), 4)
  }
}

// The main deck, split into the south ramps.
const deckYs = stations(-128, NORTH_END, 4), deckYsLow = stations(-128, NORTH_END, 8)
deckRun(det, deckYs, deck, -HALF, HALF)
deckRun(low, deckYsLow, deck, -HALF, HALF, 5)
// The widening to the ramps (y −135 to −128): the deck grows to ±4.2.
for (const s of [low, det]) {
  const y0 = SPLIT, y1 = -128, z0 = deck(y0), z1 = deck(y1)
  const T = (x: number, y: number) => z0 + ((z1 - z0) * (y - y0)) / (y1 - y0)
  const plan: [number, number][] = [[-4.2, y0], [4.2, y0], [HALF, y1], [-HALF, y1]]
  // top
  s.alu.quad([plan[0][0], y0, T(0, y0)], [plan[1][0], y0, T(0, y0)], [HALF, y1, T(0, y1)], [-HALF, y1, T(0, y1)])
  // underside and sloped side fascias
  s.alu.quad([-HALF + 0.15, y1, T(0, y1) - DEPTH], [HALF - 0.15, y1, T(0, y1) - DEPTH], [4.0, y0, z0 - DEPTH], [-4.0, y0, z0 - DEPTH])
  for (const sg of [-1, 1]) {
    const a: V3 = [sg * 4.2, y0, z0], b: V3 = [sg * HALF, y1, z1]
    const q = [a, b, [b[0], b[1], z1 - DEPTH] as V3, [a[0], a[1], z0 - DEPTH] as V3]
    if (sg > 0) s.alu.quad(q[0], q[1], q[2], q[3]); else s.alu.quad(q[0], q[3], q[2], q[1])
  }
}
// Two ramps either side of the stair well, down to the landing.
const rampYs = stations(LAND[1], SPLIT, 5), rampYsLow = stations(LAND[1], SPLIT, 12.5)
for (const sg of [-1, 1]) {
  const [x0, x1] = sg > 0 ? [1.2, 4.2] : [-4.2, -1.2]
  deckRun(det, rampYs, ramp, x0, x1)
  deckRun(low, rampYsLow, ramp, x0, x1, 5)
  balustrade(sg * 4.25, rampYs, ramp)
  balustrade(sg * 1.15, rampYs, ramp, false)
}
// Balustrades along the main deck (they turn out along the widening).
for (const sg of [-1, 1]) balustrade(sg * (HALF + 0.05), stations(-128, NORTH_END, 4), deck)
for (const sg of [-1, 1]) {
  const a: V3 = [sg * 4.25, SPLIT, deck(SPLIT)], b: V3 = [sg * (HALF + 0.05), -128, deck(-128)]
  sweep(det.steel, [add(a, [0, 0, 1.15]), add(b, [0, 0, 1.15])], [[0.07, 0.07], [0.07, 0.07]], 6)
  member(low.steel, add(a, [0, 0, 1.14]), add(b, [0, 0, 1.14]), 0.12, 0.12)
}

// The south landing: a broad platform on a concrete block, the cables'
// four-barrel ends at its outer corners and backstays down to anchor blocks.
for (const s of [low, det]) {
  const [ya, yb] = LAND, t = LAND_TOP, ch = 2.5
  const plan: V3[] = [[-LAND_W + ch, ya, t], [LAND_W - ch, ya, t], [LAND_W, ya + ch, t], [LAND_W, yb, t], [-LAND_W, yb, t], [-LAND_W, ya + ch, t]]
  const under = plan.map(([x, y]) => [x * 0.97, y, t - 0.8] as V3)
  loft(s.alu, [under, plan], true, false)
  // The central block under it, footed on the ground.
  footedBlock(s.concrete, [[-3.8, ya + 1.5], [3.8, ya + 1.5], [3.8, yb - 0.5], [-3.8, yb - 0.5]], southGround, t - 0.8, 2.5)
  for (const sg of [-1, 1]) {
    // Anchor blocks, low wedges on the ground either side of the central block.
    footedBlock(s.concrete, sg > 0 ? [[3.8, ya + 2], [5.9, ya + 2], [5.9, ya + 7], [3.8, ya + 7]] : [[-5.9, ya + 2], [-3.8, ya + 2], [-3.8, ya + 7], [-5.9, ya + 7]],
      southGround, (x) => southGround(x, ya + 4) + 1.6 - 0.8 * (Math.abs(x) - 3.8) / 2.1, 2.1)
    // The steel wing from the platform's corner out to the cable ends.
    member(s.steel, [sg * (LAND_W - 0.6), CABLE_ENDS[0], t - 0.35], [sg * (cableX(CABLE_ENDS[0]) - 0.2), CABLE_ENDS[0], cableZ(CABLE_ENDS[0]) - 0.3], 1.6, 0.4)
  }
}
balustrade(-LAND_W, stations(LAND[0] + 2.5, LAND[1], 2.9), () => LAND_TOP)
balustrade(LAND_W, stations(LAND[0] + 2.5, LAND[1], 2.9), () => LAND_TOP)

// The north abutment: a concrete block under the deck's end, and an anchor
// block either side where the cables end.
for (const s of [low, det]) {
  footedBlock(s.concrete, [[-2.6, 138], [2.6, 138], [2.6, NORTH_END], [-2.6, NORTH_END]], northGround, (x, y) => deck(y) - DEPTH - 0.02, 2.5)
  for (const sg of [-1, 1]) {
    const xa = sg * 3.0, xb = sg * 4.6
    footedBlock(s.concrete, sg > 0 ? [[xa, 135], [xb, 135], [xb, 141], [xa, 141]] : [[xb, 135], [xa, 135], [xa, 141], [xb, 141]], northGround, () => cableZ(136) + 0.55, 2)
  }
}

// ---- Cables ------------------------------------------------------------------------

for (const sg of [-1, 1]) {
  // Low: the bundle as one flat ribbon, 1.2 m wide and 0.34 m deep.
  const path = [...stations(CABLE_ENDS[0], -PIER, 7), ...stations(-PIER, PIER, 7.8).slice(1), ...stations(PIER, CABLE_ENDS[1], 6.6).slice(1)]
    .map((y) => [sg * cableX(y), y, cableZ(y)] as V3)
  sweep(low.cable, path, path.map(() => [0.6, 0.17] as [number, number]), 6, true)
  // Detail: four cables side by side.
  for (let k = 0; k < 4; k++) {
    const off = (k - 1.5) * CABLE_GAP
    const p = [...stations(CABLE_ENDS[0], -PIER, 3.5), ...stations(-PIER, PIER, 3.9).slice(1), ...stations(PIER, CABLE_ENDS[1], 3.3).slice(1)]
      .map((y) => [sg * (cableX(y) + off), y, cableZ(y)] as V3)
    sweep(det.cable, p, p.map(() => [CABLE_R, CABLE_R] as [number, number]), 8, true)
    // South: the four-barrel ends at the landing corner, then the backstay down to its anchor.
    const end: V3 = [sg * (cableX(CABLE_ENDS[0]) + off), CABLE_ENDS[0], cableZ(CABLE_ENDS[0])]
    sweep(det.cable, [end, add(end, [0, -2.4, 0])], [[0.24, 0.24], [0.24, 0.24]], 10, true)
    const anchor: V3 = [sg * (5.2 + off * 0.6), LAND[0] + 4.5, southGround(sg * 5.2, LAND[0] + 4.5) + 1.0]
    sweep(det.cable, [add(end, [0, -0.6, -0.2]), anchor], [[CABLE_R, CABLE_R], [CABLE_R, CABLE_R]], 6)
  }
  // Low: the barrels and the backstay as one band each.
  const end: V3 = [sg * cableX(CABLE_ENDS[0]), CABLE_ENDS[0], cableZ(CABLE_ENDS[0])]
  sweep(low.cable, [end, add(end, [0, -2.4, 0])], [[0.62, 0.26], [0.62, 0.26]], 6, true)
  sweep(low.cable, [add(end, [0, -0.6, -0.2]), [sg * 5.2, LAND[0] + 4.5, southGround(sg * 5.2, LAND[0] + 4.5) + 1.0]], [[0.5, 0.17], [0.5, 0.17]], 4)
}

// ---- Transverse arms and cable clamps --------------------------------------------------

for (const y of ARMS) {
  if (y < SPLIT || y > CABLE_ENDS[1] - 2) continue
  const top = y < SPLIT + 7 ? deck(SPLIT) : deck(y)
  const under = top - DEPTH - 0.18
  const xc = cableX(y), zc = cableZ(y)
  for (const s of [low, det]) {
    // Under the deck from edge to edge, then out to each bundle.
    if (s === det) member(s.steel, [-HALF + 0.3, y, under], [HALF - 0.3, y, under], 0.45, 0.32)
    for (const sg of [-1, 1]) {
      const a: V3 = [sg * (HALF - 0.4), y, under], b: V3 = [sg * (xc - 0.5), y, zc - 0.3]
      member(s.steel, a, b, s === low ? 0.5 : 0.42, 0.34)
      if (s === det) {
        // The clamp: a casting the bundle sits in.
        member(s.steel, [sg * (xc - 0.75), y, zc - 0.28], [sg * (xc + 0.75), y, zc - 0.28], 0.6, 0.3)
        member(s.steel, [sg * (xc + 0.72), y, zc - 0.3], [sg * (xc + 0.72), y, zc + 0.2], 0.55, 0.12)
      }
    }
  }
}

// ---- Piers: tapered concrete with the steel Y on top ------------------------------------

const PIER_TOP = 3.9
for (const py of [-PIER, PIER]) {
  for (const s of [low, det]) {
    const seg = s === low ? 3 : 5
    const rings = [stadium(py, 7.6, 4.4, 0, seg), stadium(py, 6.5, 3.9, PIER_TOP - 1.3, seg), stadium(py, 5.5, 3.4, PIER_TOP - 0.25, seg), stadium(py, 5.2, 3.2, PIER_TOP, seg)]
    loft(s.concrete, rings, false, true)
    // The Y: a short boot, then two arms leaning out to the cable saddles.
    const sides = s === low ? 6 : 12
    const boot: V3[] = [[0, py, PIER_TOP - 0.05], [0, py, PIER_TOP + 1.0]]
    sweep(s.steel, boot, [[2.3, 1.5], [2.1, 1.4]], sides, true)
    for (const sg of [-1, 1]) {
      const x1 = sg * (cableX(py) - 0.2), z1 = SADDLE - 0.55
      const path: V3[] = [[sg * 0.6, py, PIER_TOP + 0.6], [sg * 1.9, py, PIER_TOP + 2.2], [sg * 4.6, py, (PIER_TOP + z1) * 0.56], [x1, py, z1]]
      sweep(s.steel, path, [[1.35, 1.2], [1.2, 1.2], [0.95, 1.0], [0.6, 0.7]], sides, true)
      // The saddle the bundle rides over.
      sweep(s.steel, [[x1, py - 2.0, z1 + 0.25], [x1, py + 2.0, z1 + 0.25]], [[0.55, 0.32], [0.55, 0.32]], s === low ? 4 : 8, true)
    }
  }
}

// ---- Lamps along the deck edges ----------------------------------------------------------

for (const sg of [-1, 1]) {
  for (const y of stations(-127, NORTH_END - 1, 4)) bead(det.lamp, [sg * (HALF + 0.28), y, deck(y) + 0.02], 0.2)
  for (const y of stations(-124, NORTH_END - 4, 10)) bead(low.lamp, [sg * (HALF + 0.3), y, deck(y) + 0.1], 0.45, true)
  for (const y of stations(LAND[1] + 1, SPLIT - 1, 6)) bead(det.lamp, [sg * 4.45, y, ramp(y) + 0.02], 0.2)
}

// ---- Materials and output --------------------------------------------------------------

// The piers and their Y arms are uplit at night; nothing else is floodlit.
const pierLit = (p: V3, n: V3): number => {
  if (Math.abs(Math.abs(p[1]) - PIER) > 4) return 0
  if (Math.abs(p[0]) > 8.2 || p[2] > SADDLE + 0.6) return 0
  return (n[2] > 0.7 ? 0.25 : 0.9) * (p[2] < PIER_TOP + 0.2 ? 0.7 : 1)
}
// Colours from daylight photos, pulled to the palette: the deck's pale
// brushed aluminium, the painted steel of the arms and Y a touch greyer, the
// cables darker so they read against the water, the piers' weathered concrete.
const ALU = finish('aluminium', 0xd9dcdb)
const STEEL = { ...finish('steel', 0xc2c7c9), floodlight: pierLit }
const CABLE = finish('cable-steel', 0x9aa2a7)
const CONCRETE = { ...finish('concrete', 0xc9c2b4), floodlight: pierLit }
const LAMP = { name: 'lamp', color: 0xd9dcdb }

const lowList = [
  { part: low.alu, material: ALU },
  { part: low.steel, material: STEEL },
  { part: low.cable, material: CABLE },
  { part: low.concrete, material: CONCRETE },
  { part: low.lamp, material: LAMP },
]
const detailList = [
  { part: det.alu, material: ALU },
  { part: det.steel, material: { ...STEEL, doubleSided: true } },
  { part: det.cable, material: CABLE },
  { part: det.concrete, material: CONCRETE },
  { part: det.lamp, material: LAMP },
]
void merged

const extras = {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the piers, on the water',
  bearing: 2.41, elevation: 0, piers: [-PIER, PIER], ends: [LAND[0], NORTH_END], waterAOD: 3.1,
  walkwaySouthSplit: deck(SPLIT), walkwaySouthPier: deck(-PIER), walkwayMidspan: deck(0), walkwayNorthPier: deck(PIER),
  walkwayNorthEnd: deck(NORTH_END), landing: LAND_TOP,
}
if (import.meta.main) {
  for (const [file, list, maxTris, maxBytes] of [
    ['london-millennium-bridge.glb', lowList, 6500, 250 * 1024],
    ['london-millennium-bridge.detail.glb', detailList, 40000, 1536 * 1024],
  ] as const) {
    let tris = 0
    for (const { part } of list) tris += part.triangles
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Millennium Bridge', [...list], extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
