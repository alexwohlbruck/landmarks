/**
 * Spectrum Center, Charlotte (Charlotte Hornets arena) — procedural,
 * CC0-1.0, no textures.  bun generators/spectrum-center.ts
 *
 * Map frame: x across the arena, y along it, z up, metres. Placed at bearing
 * 45°, the Uptown grid: +y points north-east to 5th Street, -y south-west to
 * Trade Street, -x north-west to Brevard Street, +x south-east to Caldwell.
 * The origin is the centroid of the OSM outline (way/773909122); every plan
 * coordinate below is an OSM building:part in this frame.
 *
 * What makes it read as itself, from the photos:
 * - a round drum (a true circle, 69 m in radius, OSM and NAIP) of red brick
 *   with pale stone bands, broad window bands and a dark metal louvre band
 *   under a white roof edge;
 * - the high core roof: a white vault 68 m wide spanning the drum from
 *   Trade Street to 5th Street, 37 m at its ends and 44 m at mid-span, with
 *   dark louvre walls along its sides; the rest of the drum roof is white too;
 * - flat grey metal panel faces either side of the core's ends, each edged
 *   by a tall glass slot, and the tall dark tower beside the Trade Street
 *   one on the Caldwell side;
 * - on Trade Street, the brick face under the core with its tall green glass
 *   curtain, and the glass entrance box at the Brevard corner under a white
 *   roof slab;
 * - lower brick wings round the drum: 24 m along Brevard and Caldwell, a low
 *   podium on Caldwell and the 15–19 m blocks on 5th Street.
 *
 * Evidence
 * - OSM: outline way/773909122 and its building:parts (core 43 m, drum 35 m,
 *   wings 23 m, blocks 18, 14, 9 and 7 m, the 38 m tower).
 * - Measured, lidar (USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m) in this
 *   frame, less the 2 m from the lowest returns (a loading pit outside the
 *   outline) to the lowest ground under it: core 37 m at its ends to 44 m at
 *   mid-span and level across its width; drum roof 36–37 m; wings 24 m; 5th
 *   Street blocks 15 and 19 m; podiums 8–10 m; the tower 39 m.
 * - Measured, USGS NAIP: the drum is a circle; every roof is white.
 * - Published: opened 2005, Ellerbe Becket with Odell; about 19,000 seats.
 * - Photos (Wikimedia Commons): Matthew D. Britt, "Spectrum Center 2018"
 *   (CC BY 2.0, from Fahrenheit across Trade Street, the key view) and
 *   "Spectrum Center, Charlotte, NC" (CC BY 2.0, the Trade Street entrance
 *   at night); Mark Clifton, "CityLynx Streetcar 402 at Spectrum Center"
 *   (CC BY-SA 2.0, Trade Street panel face); Justin Ruckman,
 *   "CharlotteBobcatsArenaexterior08" (CC BY 2.0, the glass entrance box);
 *   HangingCurve, "TWCArena2012" (CC BY-SA 3.0); Tnbailey09, "TWCArena2015"
 *   (CC BY-SA 4.0, a panel face and its glass slot by day); John Ashley /
 *   Second Ward panoramio (CC BY 2.0 / CC BY-SA 3.0, from Caldwell).
 *   Mapillary street images (CC BY-SA 4.0) from 5th Street.
 *
 * Estimated: the facade bands' heights (scaled from the Trade Street photo),
 * the panel faces' extent round the drum (photo), the 5th Street face (taken
 * as the mirror of Trade Street's panels; its curtain is not shown), the
 * glass box's roof slab. The lower wings' facades are brick with window bands
 * as photographed on Caldwell; Brevard's is seen only at night.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]
const brick = new Part(), panel = new Part(), white = new Part(), louvre = new Part()
const win = new Part(), glass = new Part()

const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const lerp2 = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

/** Quad a-b-c-d, counter-clockwise seen from its front, with optional corner normals. */
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n?: [V3, V3, V3, V3]) {
  p.tri(a, b, c, undefined, undefined, undefined, n && [n[0], n[1], n[2]])
  p.tri(a, c, d, undefined, undefined, undefined, n && [n[0], n[2], n[3]])
}

const area = (pts: XY[]) => pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
const ccw = (pts: XY[]) => (area(pts) < 0 ? [...pts].reverse() : pts)

/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
function earcut(pts: XY[]): [number, number, number][] {
  const idx = pts.map((_, i) => i), out: [number, number, number][] = []
  const crossz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => crossz(a, b, p) > 0 && crossz(b, c, p) > 0 && crossz(c, a, p) > 0
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = pts[i0], b = pts[i1], c = pts[i2]
      if (crossz(a, b, c) <= 1e-9) continue
      if (idx.some(j => j !== i0 && j !== i1 && j !== i2 && inside(pts[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
function capPoly(p: Part, pts: XY[], z: number) {
  const q = ccw(pts)
  for (const [a, b, c] of earcut(q)) p.tri([q[a][0], q[a][1], z], [q[b][0], q[b][1], z], [q[c][0], q[c][1], z])
}
/** Douglas–Peucker on a closed ring: OSM's half-metre jogs only cost triangles. */
function simplify(pts: XY[], tol: number): XY[] {
  const dp = (a: number, b: number, ring: XY[], keep: boolean[]) => {
    let best = -1, bd = tol
    const [x1, y1] = ring[a], [x2, y2] = ring[b], L = Math.hypot(x2 - x1, y2 - y1) || 1
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs((x2 - x1) * (y1 - ring[i][1]) - (x1 - ring[i][0]) * (y2 - y1)) / L
      if (d > bd) { bd = d; best = i }
    }
    if (best >= 0) { keep[best] = true; dp(a, best, ring, keep); dp(best, b, ring, keep) }
  }
  // Split at the two most distant vertices so the ring is two open chains.
  let i0 = 0, i1 = 0, dmax = -1
  pts.forEach((p, i) => pts.forEach((q, j) => { const d = Math.hypot(p[0] - q[0], p[1] - q[1]); if (d > dmax) { dmax = d; i0 = i; i1 = j } }))
  const [a, b] = [Math.min(i0, i1), Math.max(i0, i1)]
  const ring = [...pts, pts[0]], keep = ring.map((_, i) => i === a || i === b)
  dp(a, b, ring, keep); dp(b, pts.length, ring, keep)
  if (a > 0) dp(0, a, ring, keep)
  keep[0] = true
  return pts.filter((_, i) => keep[i])
}
function inside([x, y]: XY, poly: XY[]) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [x1, y1] = poly[i], [x2, y2] = poly[j]
    if ((y1 > y) !== (y2 > y) && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1) c = !c
  }
  return c
}

// ---------------------------------------------------------------------------
// The drum: a circle, centre and radius fitted to the OSM drum and core parts
// (every vertex within 0.3 m) and the NAIP roof.

const CX = -12, CY = -8, R = 69
const EAVE = 34.5, FASCIA = 36, ROOF = 36.4
const at = (deg: number, r = R): XY => [CX + r * Math.cos((deg * Math.PI) / 180), CY + r * Math.sin((deg * Math.PI) / 180)]

// The core spans x −46…22: on the circle, 240°–300° on Trade Street and
// 60°–120° on 5th Street. Grey panel faces flank it, each one flat chord.
const PANELS: [number, number][] = [[210, 240], [300, 330], [30, 60], [120, 150]]
const inPanel = (d: number) => PANELS.some(([a, b]) => d > a + 1e-6 && d < b - 1e-6)
const ANG = Array.from({ length: 48 }, (_, k) => k * 7.5).filter(d => !inPanel(d))
const panelAt = (a: number, b: number) => PANELS.some(([p, q]) => Math.abs(p - a) < 1e-6 && Math.abs(q - (b === 0 ? 360 : b)) < 1e-6)
// The tall green glass curtain on Trade Street, under the core's end.
const CURTAIN: [number, number] = [270, 285]

// ---------------------------------------------------------------------------
// The lower parts, from OSM, with their lidar heights.

type Block = { pts: XY[]; h: number; glassEnd?: boolean }
const BLOCKS: Block[] = [
  // Brevard wing (way/773909126); its south end is the glass entrance box.
  { h: 24, glassEnd: true, pts: [[-43.4,65.5],[-44.7,65.0],[-49.5,63.1],[-61.2,56.9],[-67.4,52.7],[-73.6,47.4],[-79.5,41.3],[-84.4,35.4],[-90.4,25.8],[-94.3,18.0],[-97.4,9.4],[-99.7,2.7],[-100.6,-4.8],[-100.7,-10.4],[-100.5,-15.3],[-100.0,-22.5],[-98.8,-30.1],[-97.2,-37.5],[-94.0,-46.9],[-74.5,-36.8],[-76.5,-32.5],[-78.7,-26.6],[-80.1,-20.6],[-80.9,-13.9],[-80.9,-2.5],[-79.6,5.2],[-78.0,12.0],[-75.1,19.9],[-72.4,25.2],[-69.3,30.6],[-66.6,34.4],[-61.5,40.5],[-57.6,44.2],[-46.7,51.6],[-43.7,53.7],[-43.7,58.6],[-42.1,58.7]] },
  // Caldwell wing (way/773909123).
  { h: 24, pts: [[21.8,61.0],[19.5,62.0],[18.5,58.3],[21.9,57.7],[21.8,52.8],[27.1,49.4],[32.9,44.9],[37.7,40.5],[42.7,34.6],[45.7,30.5],[50.5,21.5],[51.3,19.7],[53.2,13.8],[54.9,7.3],[56.0,1.3],[56.6,-3.3],[56.6,-6.7],[56.0,-16.6],[52.2,-28.9],[49.1,-35.6],[55.1,-38.9],[51.9,-44.7],[50.9,-44.1],[49.7,-46.2],[53.1,-48.1],[57.9,-50.5],[61.6,-42.9],[65.0,-31.9],[66.0,-27.5],[67.3,-17.7],[67.2,-8.7],[66.4,-1.6],[64.6,6.0],[62.1,14.6],[59.8,20.5],[57.2,25.8],[52.9,33.0],[47.2,41.0],[41.7,46.7],[38.0,50.2],[31.3,55.1],[27.8,57.3],[25.5,58.8],[24.7,59.2]] },
  // Caldwell podium (way/773909124).
  { h: 8, pts: [[61.6,-42.9],[66.3,-45.2],[89.0,-45.1],[89.0,-43.6],[89.6,-43.6],[89.6,-35.4],[89.7,-28.5],[101.9,-28.0],[101.9,-27.2],[101.6,-27.2],[101.7,-25.9],[102.1,-25.9],[102.3,-16.2],[101.4,-16.2],[101.5,-14.4],[102.3,-14.4],[102.5,-4.1],[101.7,-4.1],[101.7,-2.5],[102.6,-2.5],[102.8,7.9],[101.8,7.9],[101.9,9.9],[102.9,9.9],[103.2,21.7],[102.2,21.7],[102.2,22.3],[101.8,23.1],[102.9,23.7],[99.9,28.9],[97.1,34.4],[96.3,35.5],[95.5,35.0],[94.4,36.1],[95.0,36.7],[62.7,70.5],[62.4,70.1],[60.7,71.9],[60.1,71.3],[38.0,50.2],[41.7,46.7],[47.2,41.0],[52.9,33.0],[57.2,25.8],[59.8,20.5],[62.1,14.6],[64.6,6.0],[66.4,-1.6],[67.2,-8.7],[67.3,-17.7],[66.0,-27.5],[65.0,-31.9]] },
  // 5th Street blocks (way/773909125, way/1352235646).
  { h: 15, pts: [[19.5,62.0],[21.8,61.0],[22.0,88.0],[-13.9,88.1],[-14.7,76.9],[-15.3,69.5],[-12.7,69.3],[-13.3,60.9],[-2.6,60.6],[7.3,59.8],[18.5,58.3]] },
  { h: 19, pts: [[-43.4,65.5],[-39.0,66.8],[-33.3,68.0],[-25.9,69.2],[-18.7,69.7],[-15.3,69.5],[-12.7,69.3],[-13.3,60.9],[-16.9,61.0],[-28.0,60.2],[-38.3,59.2],[-42.1,58.7]] },
  // Trade Street podiums (way/984713008, way/984713013) and the Brevard
  // sliver (way/984713012).
  { h: 9.5, pts: [[-9.0,-73.5],[-9.3,-76.7],[45.5,-76.9],[39.7,-65.5],[42.8,-62.1],[46.3,-58.1],[49.9,-53.1],[53.1,-48.1],[49.7,-46.2],[50.9,-44.1],[46.6,-41.7],[40.9,-54.8],[38.5,-52.7],[37.0,-54.7],[30.2,-64.8],[28.5,-62.3],[26.0,-64.2],[18.0,-71.6],[18.0,-73.4]] },
  { h: 9.5, pts: [[-55.6,-64.0],[-56.9,-66.8],[-61.4,-66.5],[-62.2,-67.9],[-66.2,-74.9],[-64.3,-74.9],[-48.8,-75.4],[-27.2,-76.1],[-46.4,-72.5],[-46.2,-67.8]] },
  { h: 9, pts: [[-97.1,28.6],[-90.4,25.8],[-94.3,18.0],[-97.4,9.4],[-99.7,2.7],[-101.4,-4.0],[-102.4,-9.6],[-102.8,-13.1],[-104.0,-13.0],[-104.1,-11.7],[-104.6,-11.3],[-104.9,-5.9],[-104.2,5.1],[-102.2,13.8],[-99.9,21.0]] },
].map(b => ({ ...b, pts: simplify(b.pts as XY[], 0.9) }))
// The tall dark tower beside the south-east panel face (way/984713007), 39 m.
const TOWER: XY[] = [[46.6,-41.7],[51.9,-44.7],[55.1,-38.9],[48.1,-35.0],[44.9,-40.8]]
const TOWER_H = 39

/** Height of whatever stands at a point outside the drum: the walls start there. */
const heightAt = (p: XY) => {
  let h = 0
  for (const b of BLOCKS) if (inside(p, b.pts)) h = Math.max(h, b.h)
  if (inside(p, TOWER)) h = Math.max(h, TOWER_H)
  return h
}
/** Street level by side: 5th Street and Brevard stand a few metres up (lidar). */
const street = ([x, y]: XY) => (y > 50 ? 4 : x < -85 ? 3 : 1)

// ---------------------------------------------------------------------------
// Walls: a flat face from z0 to z1, with window bands between piers.

type Band = { lo: number; hi: number; mat: Part }
function wall(A: XY, B: XY, z0: number, z1: number, mat: Part, bands: Band[], bay = 11, nA?: XY, nB?: XY, piers: [boolean, boolean] = [true, true]) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1])
  if (L < 0.2 || z1 - z0 < 0.2) return
  const sn: V3 = unit([B[1] - A[1], A[0] - B[0], 0])
  const na: V3 = nA ? [nA[0], nA[1], 0] : sn, nb: V3 = nB ? [nB[0], nB[1], 0] : sn
  const P = (t: number, z: number, d = 0): V3 => { const q = lerp2(A, B, t); return [q[0] + sn[0] * d, q[1] + sn[1] * d, z] }
  const nAt = (t: number) => unit([na[0] * (1 - t) + nb[0] * t, na[1] * (1 - t) + nb[1] * t, 0])
  const flat = (p: Part, t0: number, t1: number, a: number, b: number, d = 0) => {
    if (t1 - t0 < 1e-6 || b - a < 1e-6) return
    const n0 = nAt(t0), n1 = nAt(t1)
    quadN(p, P(t0, a, d), P(t1, a, d), P(t1, b, d), P(t0, b, d), [n0, n1, n1, n0])
  }
  flat(mat, 0, 1, z0, z1)
  const use = bands.filter(b => b.lo >= z0 && b.hi <= z1)
  if (!use.length || L < 4) return
  const bays = Math.max(1, Math.round(L / bay)), pier = Math.min(0.9 / L, 0.12 / bays)
  for (let k = 0; k < bays; k++) {
    const t0 = k / bays + (k > 0 || piers[0] ? pier : 0), t1 = (k + 1) / bays - (k < bays - 1 || piers[1] ? pier : 0)
    for (const b of use) flat(b.mat, t0, t1, b.lo, b.hi, 0.04)
  }
}
/** A pale chamfered parapet lip on a wall's top edge. */
function lipEdge(A: XY, B: XY, z: number, out = 0.6) {
  const sn = unit([B[1] - A[1], A[0] - B[0], 0])
  const P = (p: XY, d: number, h: number): V3 => [p[0] + sn[0] * d, p[1] + sn[1] * d, h]
  const nO: V3 = [sn[0], sn[1], 0], nT = unit([sn[0], sn[1], 1.2])
  quadN(white, P(A, 0, z - 1.0), P(B, 0, z - 1.0), P(B, out, z - 0.9), P(A, out, z - 0.9), [unit([sn[0], sn[1], -1]), unit([sn[0], sn[1], -1]), nO, nO])
  quadN(white, P(A, out, z - 0.9), P(B, out, z - 0.9), P(B, out, z - 0.35), P(A, out, z - 0.35), [nO, nO, nO, nO])
  quadN(white, P(A, out, z - 0.35), P(B, out, z - 0.35), P(B, 0, z), P(A, 0, z), [nT, nT, nT, nT])
}

// ---------------------------------------------------------------------------
// Drum walls.

const LOUVRE_LO = 29.5
for (let i = 0; i < ANG.length; i++) {
  const a = ANG[i], b = ANG[(i + 1) % ANG.length], bb = b === 0 ? 360 : b
  const A = at(a), B = at(bb), mid = (a + bb) / 2
  const outPt = at(mid, R + 2.5)
  const z0 = heightAt(outPt)
  const isPanel = panelAt(a, b)
  const nA: XY = [Math.cos((a * Math.PI) / 180), Math.sin((a * Math.PI) / 180)], nB: XY = [Math.cos((bb * Math.PI) / 180), Math.sin((bb * Math.PI) / 180)]
  // The louvre band runs right round under the roof edge.
  wall(A, B, LOUVRE_LO, EAVE, louvre, [], 11, isPanel ? undefined : nA, isPanel ? undefined : nB)
  if (isPanel) {
    // A flat grey panel face, a little proud, with a tall glass slot at each
    // edge broken into three storey groups.
    wall(A, B, z0, LOUVRE_LO, panel, [])
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), s = 3 / L
    const g0 = Math.max(z0, street(A)) + 1
    const groups: [number, number][] = [[g0, 15.5], [17, 22], [23.5, 28.5]].filter(([lo, hi]) => hi - lo > 2) as [number, number][]
    for (const [t0, t1] of [[0.02, 0.02 + s], [0.98 - s, 0.98]])
      for (const [lo, hi] of groups) wall(lerp2(A, B, t0), lerp2(A, B, t1), lo, hi, glass, [], 99)
    continue
  }
  if (mid > CURTAIN[0] && mid < CURTAIN[1]) {
    // The green glass curtain, a broad glazed bay in the brick.
    wall(A, B, z0, LOUVRE_LO, brick, [{ lo: 11.5, hi: 28.5, mat: glass }], 99, nA, nB)
    continue
  }
  const g = street(outPt)
  const bands: Band[] = [
    { lo: g + 1.5, hi: g + 7, mat: win },   // storefronts
    { lo: 11.5, hi: 17.5, mat: win },       // the recessed concourse glazing
    { lo: 23.5, hi: 27, mat: win },         // upper concourse windows
  ]
  // Window bands run on as ribbons across the curve, with a broad pier
  // every third segment (about 27 m), as photographed.
  const k = Math.round(a / 7.5), kb = Math.round(bb / 7.5)
  wall(A, B, z0, LOUVRE_LO, brick, bands, 99, nA, nB, [k % 3 === 0 || panelAt(ANG[(i - 1 + ANG.length) % ANG.length], a), kb % 3 === 0])
}

// White roof edge: a fascia standing 1 m out from the drum, bevelled.
{
  const ring = ANG.map(d => ({ p: at(d), n: [Math.cos((d * Math.PI) / 180), Math.sin((d * Math.PI) / 180)] as XY }))
  const m = ring.length
  for (let i = 0; i < m; i++) {
    const A = ring[i], B = ring[(i + 1) % m]
    const o = 1.0
    const P = (r: typeof A, d: number, z: number): V3 => [r.p[0] + r.n[0] * d, r.p[1] + r.n[1] * d, z]
    const nA: V3 = [A.n[0], A.n[1], 0], nB: V3 = [B.n[0], B.n[1], 0]
    const dn = (r: typeof A) => unit([r.n[0], r.n[1], -1]), up = (r: typeof A) => unit([r.n[0], r.n[1], 1.2])
    quadN(white, P(A, 0, EAVE), P(B, 0, EAVE), P(B, o, EAVE + 0.3), P(A, o, EAVE + 0.3), [dn(A), dn(B), nB, nA])
    quadN(white, P(A, o, EAVE + 0.3), P(B, o, EAVE + 0.3), P(B, o, FASCIA - 0.3), P(A, o, FASCIA - 0.3), [nA, nB, nB, nA])
    quadN(white, P(A, o, FASCIA - 0.3), P(B, o, FASCIA - 0.3), P(B, 0, ROOF), P(A, 0, ROOF), [up(A), up(B), up(B), up(A)])
  }
}

// ---------------------------------------------------------------------------
// Roofs. The drum's two outer segments are white at 36.4 m; the core vault
// rises from 37 m at its ends to 44 m at mid-span, level across its width.

const XL = -46, XR = 22
const halfY = (x: number) => Math.sqrt(Math.max(0, R * R - (x - CX) * (x - CX)))
{
  // West segment: the arc from 120° to 240° closed by the core's edge.
  const west: XY[] = ANG.filter(d => d >= 120 && d <= 240).map(d => at(d))
  capPoly(white, west, ROOF)
  const east: XY[] = [...ANG.filter(d => d >= 300), ...ANG.filter(d => d <= 60)].map(d => at(d))
  capPoly(white, east, ROOF)
}
const VAULT_END = 37, VAULT_TOP = 44
const vz = (y: number) => { const t = (y - CY) / R; return VAULT_END + (VAULT_TOP - VAULT_END) * (1 - t * t) }
const vn = (y: number): V3 => unit([0, (2 * (VAULT_TOP - VAULT_END) * (y - CY)) / (R * R), 1])
{
  const COLS = 6, ROWS = 14
  const xs = Array.from({ length: COLS + 1 }, (_, k) => XL + ((XR - XL) * k) / COLS)
  const yAt = (c: number, r: number) => { const h = halfY(xs[c]); return CY - h + (2 * h * r) / ROWS }
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const P = (cc: number, rr: number): V3 => { const y = yAt(cc, rr); return [xs[cc], y, vz(y)] }
    const a = P(c, r), b = P(c + 1, r), cc = P(c + 1, r + 1), d = P(c, r + 1)
    quadN(white, a, b, cc, d, [vn(a[1]), vn(b[1]), vn(cc[1]), vn(d[1])])
  }
  // The vault's long sides: dark louvres from the drum roof up to a white
  // fascia that follows the arch.
  for (const [x, dir] of [[XL, -1], [XR, 1]] as [number, number][]) {
    const h = halfY(x)
    for (let r = 0; r < ROWS; r++) {
      let y0 = CY - h + (2 * h * r) / ROWS, y1 = CY - h + (2 * h * (r + 1)) / ROWS
      if (dir < 0) [y0, y1] = [y1, y0]
      const z0 = vz(y0), z1 = vz(y1), F = 1.0, o = 0.5 * dir
      quadN(louvre, [x, y0, ROOF], [x, y1, ROOF], [x, y1, z1 - F], [x, y0, z0 - F])
      const nO: V3 = [dir, 0, 0], nT = unit([dir, 0, 1.2]), nD = unit([dir, 0, -1])
      quadN(white, [x, y0, z0 - F], [x, y1, z1 - F], [x + o, y1, z1 - F + 0.25], [x + o, y0, z0 - F + 0.25], [nD, nD, nO, nO])
      quadN(white, [x + o, y0, z0 - F + 0.25], [x + o, y1, z1 - F + 0.25], [x + o, y1, z1 - 0.3], [x + o, y0, z0 - 0.3], [nO, nO, nO, nO])
      quadN(white, [x + o, y0, z0 - 0.3], [x + o, y1, z1 - 0.3], [x, y1, z1], [x, y0, z0], [nT, nT, nT, nT])
    }
  }
  // The vault's ends, on the drum, from the roof edge up to the vault eave.
  for (const [lo, hi] of [[240, 300], [60, 120]]) {
    const ds = ANG.filter(d => d >= lo && d <= hi)
    for (let i = 0; i < ds.length - 1; i++) {
      const A = at(ds[i]), B = at(ds[i + 1])
      const zA = vz(A[1]), zB = vz(B[1])
      const n0: V3 = [Math.cos((ds[i] * Math.PI) / 180), Math.sin((ds[i] * Math.PI) / 180), 0]
      const n1: V3 = [Math.cos((ds[i + 1] * Math.PI) / 180), Math.sin((ds[i + 1] * Math.PI) / 180), 0]
      quadN(louvre, [A[0], A[1], ROOF], [B[0], B[1], ROOF], [B[0], B[1], zB], [A[0], A[1], zA], [n0, n1, n1, n0])
    }
  }
}

// ---------------------------------------------------------------------------
// Lower parts: brick walls with storefront and upper window bands, a pale
// parapet lip, white roofs. The Brevard wing's south end is the glass
// entrance box under an overhanging white roof slab.

const outsideDrum = (p: XY) => Math.hypot(p[0] - CX, p[1] - CY) > R + 0.8
for (const blk of BLOCKS) {
  const pts = ccw(blk.pts), m = pts.length
  for (let i = 0; i < m; i++) {
    const A = pts[i], B = pts[(i + 1) % m]
    const M = lerp2(A, B, 0.5)
    if (!outsideDrum(A) && !outsideDrum(B)) continue
    const sn = unit([B[1] - A[1], A[0] - B[0], 0])
    const outside: XY = [M[0] + sn[0] * 1.2, M[1] + sn[1] * 1.2]
    const z0 = heightAt(outside)
    if (z0 >= blk.h - 0.5) continue
    const g = street(M)
    if (blk.glassEnd && M[1] < -20) {
      // Glass entrance: full-height light glazing between thin frames.
      wall(A, B, z0, blk.h, brick, [{ lo: Math.max(z0, g) + 0.3, hi: blk.h - 1.6, mat: glass }], 99)
      continue
    }
    const bands: Band[] = [{ lo: g + 1.5, hi: g + 6.5, mat: win }]
    if (blk.h - g > 16) bands.push({ lo: blk.h - 8, hi: blk.h - 3, mat: win })
    wall(A, B, z0, blk.h - 1, brick, bands)
    lipEdge(A, B, blk.h)
  }
  // The wings' flat roofs are the panel grey, so the white arena roof
  // stands out from them as it does from the street.
  capPoly(panel, blk.pts, blk.h)
}
// The entrance box's roof slab: a white plate 1.6 m thick reaching 4 m out
// over the glass on its Trade Street and Brevard sides.
{
  const SL = 1.6, H = BLOCKS[0].h, O = 4
  // The south end of the wing: its outer arc, its Trade Street face, and
  // back along the drum. Outer points move 4 m out from the drum's centre,
  // the Trade Street corner 4 m south-east along that face's normal.
  const outer: XY[] = [[-100.2, -20], [-98.8, -30.1], [-97.2, -37.5], [-94.0, -46.9]]
  const radial = (p: XY): XY => { const d = Math.hypot(p[0] - CX, p[1] - CY); return [p[0] + ((p[0] - CX) / d) * O, p[1] + ((p[1] - CY) / d) * O] }
  const sf = unit([-36.8 + 46.9, -(-74.5 + 94.0), 0]) // Trade Street face normal
  const s0: XY = [-74.5, -36.8]
  const slab: XY[] = [...outer.map(radial), [s0[0] + sf[0] * O, s0[1] + sf[1] * O], [-77.6, -29.5], [-79.5, -22]]
  const base: XY[] = [...outer, s0, [-77.6, -29.5], [-79.5, -22]]
  capPoly(white, slab, H + 0.3)
  const r = ccw(slab), q = area(slab) < 0 ? [...base].reverse() : base, n = r.length
  for (let i = 0; i < n; i++) {
    const A = r[i], B = r[(i + 1) % n]
    if (!outsideDrum(lerp2(A, B, 0.5)) || Math.hypot(A[0] - q[i][0], A[1] - q[i][1]) + Math.hypot(B[0] - q[(i + 1) % n][0], B[1] - q[(i + 1) % n][1]) < 0.1) continue
    const sn = unit([B[1] - A[1], A[0] - B[0], 0])
    quadN(white, [A[0], A[1], H + 0.3 - SL], [B[0], B[1], H + 0.3 - SL], [B[0], B[1], H + 0.3], [A[0], A[1], H + 0.3], [sn, sn, sn, sn])
    // Soffit, facing down, between the glass line and the slab edge.
    const a2 = q[i], b2 = q[(i + 1) % n]
    quadN(white, [a2[0], a2[1], H + 0.3 - SL], [A[0], A[1], H + 0.3 - SL], [B[0], B[1], H + 0.3 - SL], [b2[0], b2[1], H + 0.3 - SL])
  }
}

// The tall tower: grey panel, a glass slot on its street faces.
{
  const pts = ccw(TOWER), m = pts.length
  for (let i = 0; i < m; i++) {
    const A = pts[i], B = pts[(i + 1) % m]
    const M = lerp2(A, B, 0.5)
    const sn = unit([B[1] - A[1], A[0] - B[0], 0])
    const z0 = heightAt([M[0] + sn[0] * 1.2, M[1] + sn[1] * 1.2])
    wall(A, B, z0, TOWER_H - 0.8, louvre, [])
    lipEdge(A, B, TOWER_H, 0.4)
  }
  capPoly(white, TOWER, TOWER_H)
}

// ---------------------------------------------------------------------------
// Materials (six). The red brick is the arena's identity, its hue kept and
// pulled up to the palette's lightness; the panel faces are mid-grey metal,
// as are the wings' flat roofs (white in NAIP, greyed so the arena's white
// roof and roof edges read as its own mass); the louvre
// band is the dark metal photographed under the roof edge, at the style's
// charcoal floor. Slate windows; the light green-blue glass of the entrance
// box, the curtain and the slots is a lighter window variant, lit at night.
const parts = [
  { part: brick, material: finish('spectrum-brick', 0xbd7d69) },
  { part: panel, material: finish('spectrum-panel', 0xa6abb1) },
  { part: white, material: finish('spectrum-roof', 0xeceeee) },
  { part: louvre, material: finish('spectrum-louvre', 0x5a6068) },
  { part: win, material: PALETTE.window },
  { part: glass, material: windowVariant(2, 0xa3c1c4) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(18), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Spectrum Center', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 45, osm: 'way/773909122', footprint: [208, 165], height: 44,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/spectrum-center.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
