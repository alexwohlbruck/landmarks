/**
 * Sentinel Building (Columbus Tower), San Francisco — original procedural
 * geometry, CC0-1.0.
 * bun generators/sf-sentinel-building.ts
 *
 * Map frame: x east, y north, z up, metres, no rotation (bearing 0). Origin =
 * centroid of the OSM outline way/288485994. The footprint is that outline:
 * a flatiron wedge between Kearny Street (west) and Columbus Avenue (north-east),
 * a party wall against the Golden Coin Building (south), and a round turret at
 * the narrow north tip.
 *
 * Evidence
 * - OSM way/288485994: outline, 7 levels, height 29; the turret's circle is
 *   building:part way/1092161846 (r ~2.5 m).
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.5 m: ground falls from
 *   ~2.4 m (Kearny, north) to ~1.4 m (Columbus, south-east) above ground_min,
 *   so y = 0 is the south-east corner; main roof 29.5-30 m above it, cupola
 *   dome peak ~36.4 m. The thin finial is below lidar resolution.
 * - Published (Wikipedia, SF Landmark No. 33): 1907-09, Salfield & Kohlberg,
 *   seven storeys, copper-clad flatiron with a corner cupola.
 * - Commons daylight photos: "Columbus Tower, 916 Kearny St, San Francisco.jpg"
 *   (Dllu, CC BY-SA 4.0, from the north, both street fronts); "Columbus Tower,
 *   San Francisco.JPG" (Joe Fu, CC BY-SA 3.0, from the north-west, dusk);
 *   "Columbus Tower, SF front.JPG" and "Columbus Tower, SF side 1/2.JPG"
 *   (BrokenSphere, CC BY-SA 4.0); "Sentinel Building - San Francisco, CA.jpg"
 *   (Daderot, CC0).
 *
 * Estimated from the photos: storey heights (4.5 m ground floor, six of 3.8 m),
 * the oriel bays (three on Kearny, two on Columbus, 3.4 m wide, 0.9 m deep),
 * Columbus's cream render between its bays (the fire escape is left out),
 * the cream top storey with arched windows, the cornice, and the cupola's
 * drum, dome, lantern and finial proportions. The south party wall is plain.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const ANCHOR = { lng: -122.4050486, lat: 37.7965438 }

const copper = new Part(), cream = new Part(), glass = new Part(), dome = new Part(), roof = new Part(), gold = new Part()
const up: V3 = [0, 0, 1]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return v.map((n) => n / l) as V3 }
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n?: V3, n2?: V3) {
  if (!n) return p.quad(a, b, c, d)
  const m = n2 ?? n
  p.tri(a, b, c, undefined, undefined, undefined, [n, m, m])
  p.tri(a, c, d, undefined, undefined, undefined, [n, m, n])
}

// --- Plan ---
const C: XY = [-4.85, 7.3] // turret centre
const R = 2.48
const SW: XY = [-4.26, -7.19], SE: XY = [10.59, -4.75], E: XY = [11.2, -4.09]
const COL_END: XY = [-2.37, 7.47], KEA_END: XY = [-6.41, 5.42]
const a0 = Math.atan2(COL_END[1] - C[1], COL_END[0] - C[0])
const a1 = Math.atan2(KEA_END[1] - C[1], KEA_END[0] - C[0]) + 2 * Math.PI
const ARC = 10
type Edge = { a: XY; b: XY; kind: 'columbus' | 'kearny' | 'turret' | 'party'; n: V3; na: V3; nb: V3; len: number }
const pts: { p: XY; kind: Edge['kind'] }[] = [{ p: E, kind: 'columbus' }]
for (let i = 0; i <= ARC; i++) {
  const t = a0 + ((a1 - a0) * i) / ARC
  pts.push({ p: [C[0] + R * Math.cos(t), C[1] + R * Math.sin(t)], kind: i === ARC ? 'kearny' : 'turret' })
}
pts.push({ p: SW, kind: 'party' }, { p: SE, kind: 'party' })
const RING = pts.map((q) => q.p)
const EDGES: Edge[] = pts.map((q, i) => {
  const a = q.p, b = pts[(i + 1) % pts.length].p
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n: V3 = [(b[1] - a[1]) / len, -(b[0] - a[0]) / len, 0]
  const radial = (p: XY): V3 => unit([p[0] - C[0], p[1] - C[1], 0])
  const turret = q.kind === 'turret'
  return { a, b, kind: q.kind, n, len, na: turret ? radial(a) : n, nb: turret ? radial(b) : n }
})
const street = (e: Edge) => e.kind !== 'party'

/** Mitred outward offset of the ring. */
function offset(ring: XY[], d: number): XY[] {
  return ring.map((b, i) => {
    const a = ring[(i + ring.length - 1) % ring.length], c = ring[(i + 1) % ring.length]
    const u = unit([b[1] - a[1], a[0] - b[0], 0]), v = unit([c[1] - b[1], b[0] - c[0], 0])
    const k = 1 + u[0] * v[0] + u[1] * v[1]
    return [b[0] + ((u[0] + v[0]) * d) / k, b[1] + ((u[1] + v[1]) * d) / k]
  })
}

// --- Heights ---
const GROUND = 4.5
const STOREY = 3.8
const ATTIC0 = GROUND + 5 * STOREY // 23.5: the cream top storey starts
const CORNICE0 = ATTIC0 + 4.0 // 27.5
const ROOF = 29.6
const FLOORS = [0, 1, 2, 3, 4].map((k) => [GROUND + k * STOREY, GROUND + (k + 1) * STOREY])

// --- Walls, edge by edge ---
const at = (e: Edge, s: number, z: number, out = 0): V3 => {
  const t = s / e.len
  return [e.a[0] + (e.b[0] - e.a[0]) * t + e.n[0] * out, e.a[1] + (e.b[1] - e.a[1]) * t + e.n[1] * out, z]
}
for (const e of EDGES) {
  const wall = (p: Part, z0: number, z1: number) => quad(p, [...e.a, z0], [...e.b, z0], [...e.b, z1], [...e.a, z1], e.na, e.nb)
  if (!street(e)) { wall(cream, 0, ROOF); continue }
  // Columbus's front is cream render between its copper bays; Kearny's and the
  // turret's are copper to the top storey.
  const body = e.kind === 'columbus' ? GROUND : ATTIC0
  wall(copper, 0, body)
  wall(cream, body, CORNICE0)
  wall(copper, CORNICE0, ROOF)
}

/** A flat panel on a wall edge, `out` metres proud. */
function panel(p: Part, e: Edge, s0: number, s1: number, z0: number, z1: number, out = 0.04) {
  quad(p, at(e, s0, z0, out), at(e, s1, z0, out), at(e, s1, z1, out), at(e, s0, z1, out), e.n)
}
/** An arched window: a rectangle with a semicircular head, flush on the wall. */
function arched(p: Part, e: Edge, sc: number, w: number, z0: number, z1: number) {
  const r = w / 2, spring = z1 - r, out = 0.04
  const outline: XY[] = [[sc - r, z0], [sc + r, z0]]
  for (let k = 0; k <= 8; k++) outline.push([sc + r * Math.cos((k * Math.PI) / 8), spring + r * Math.sin((k * Math.PI) / 8)])
  const c = at(e, sc, (z0 + spring) / 2, out)
  for (let k = 0; k < outline.length; k++) {
    const q = outline[k], s = outline[(k + 1) % outline.length]
    p.tri(c, at(e, q[0], q[1], out), at(e, s[0], s[1], out), undefined, undefined, undefined, [e.n, e.n, e.n])
  }
}

// --- Oriel bays: three-sided copper bays, with a window on each side per storey. ---
// Kearny: three bays side by side. Columbus: two bays towards the south end;
// the stretch by the turret is flat wall behind the fire escape.
const BAYS: Record<string, number[]> = { columbus: [8.4, 12.6], kearny: [0.9, 4.6, 8.3] }
const BW = 3.4, BF = 1.9, BD = 0.9
for (const e of EDGES) {
  const centres = BAYS[e.kind]
  if (!centres) continue
  // Bay centres are measured from the edge end nearest the turret.
  const fromTip = (d: number) => (e.kind === 'columbus' ? e.len - d - 1.5 : d + 1.5)
  const used: [number, number][] = []
  for (const d of centres) {
    const sc = fromTip(d)
    used.push([sc - BW / 2, sc + BW / 2])
    // plan: back-left, front-left, front-right, back-right (s along edge, o out)
    const plan: [number, number][] = [[sc + BW / 2, 0], [sc + BF / 2, BD], [sc - BF / 2, BD], [sc - BW / 2, 0]]
    const z0 = GROUND + 0.3, z1 = ATTIC0 - 0.2
    for (let k = 0; k < 3; k++) {
      const [s0, o0] = plan[k], [s1, o1] = plan[k + 1]
      const A = at(e, s0, 0, o0), B = at(e, s1, 0, o1)
      // the bay faces run b→a along the edge, so walk them reversed for outward winding
      const fn = unit([B[1] - A[1], -(B[0] - A[0]), 0])
      const n: V3 = [-fn[0], -fn[1], 0]
      quad(copper, [B[0], B[1], z0], [A[0], A[1], z0], [A[0], A[1], z1], [B[0], B[1], z1], n)
      // windows on each bay face, one per storey
      const L = Math.hypot(B[0] - A[0], B[1] - A[1])
      for (const [fz0, fz1] of FLOORS) {
        const m = k === 1 ? 0.25 : 0.15, wz0 = fz0 + 0.9, wz1 = fz1 - 0.55
        const P = (t: number, z: number): V3 => [A[0] + (B[0] - A[0]) * t + n[0] * 0.04, A[1] + (B[1] - A[1]) * t + n[1] * 0.04, z]
        const ta = 1 - m / L * (k === 1 ? 1 : 2), tb = m / L * (k === 1 ? 1 : 2)
        quad(glass, P(ta, wz0), P(tb, wz0), P(tb, wz1), P(ta, wz1), n)
      }
    }
    // soffit and top of the bay
    const ringAt = (z: number) => plan.map(([s, o]) => at(e, s, z, o))
    const lo = ringAt(GROUND + 0.3), hi = ringAt(ATTIC0 - 0.2)
    quad(copper, lo[0], lo[3], lo[2], lo[1])
    quad(copper, hi[0], hi[1], hi[2], hi[3], up)
  }
  // flat windows between the bays, one per storey
  used.sort((p, q) => p[0] - q[0])
  let last = 0.6
  for (const [b0, b1] of [...used, [e.len - 0.6, e.len]] as [number, number][]) {
    const g0 = last + 0.45, g1 = b0 - 0.45
    if (g1 - g0 >= 0.9) {
      // paired sash windows, about 1.3 m wide with piers between
      const k = Math.max(1, Math.round((g1 - g0 + 0.6) / 1.9)), w = (g1 - g0 - 0.6 * (k - 1)) / k
      for (let j = 0; j < k; j++) for (const [fz0, fz1] of FLOORS) panel(glass, e, g0 + j * (w + 0.6), g0 + j * (w + 0.6) + w, fz0 + 0.9, fz1 - 0.55)
    }
    last = b1
  }
  // top storey: arched windows in the cream wall
  const n = Math.max(2, Math.round(e.len / 2.6))
  for (let k = 0; k < n; k++) arched(glass, e, (e.len * (k + 0.5)) / n, 1.3, ATTIC0 + 0.8, CORNICE0 - 0.6)
  // ground floor: shop glazing in broad panels
  const gn = Math.max(1, Math.round(e.len / 4))
  for (let k = 0; k < gn; k++) panel(glass, e, (e.len * k) / gn + 0.5, (e.len * (k + 1)) / gn - 0.5, 0.4, GROUND - 0.7)
}

// Turret windows: three per storey round the arc, plus the top storey.
{
  const turretEdges = EDGES.filter((e) => e.kind === 'turret')
  for (const idx of [2, 5, 8]) {
    const e = turretEdges[idx - 1] ?? turretEdges[0]
    for (const [fz0, fz1] of [...FLOORS, [ATTIC0, CORNICE0]]) panel(glass, e, 0.12, e.len - 0.12, fz0 + 0.9, fz1 - 0.55, 0.03)
  }
}

// --- Cornice: a projecting copper moulding round the street fronts and turret. ---
{
  const prof: [number, number][] = [[0, CORNICE0 + 0.2], [0.25, CORNICE0 + 0.5], [0.7, ROOF - 0.5], [0.7, ROOF], [0, ROOF]]
  for (let i = 0; i < EDGES.length; i++) {
    const e = EDGES[i]
    if (!street(e)) continue
    for (let k = 0; k < prof.length - 1; k++) {
      const [d0, z0] = prof[k], [d1, z1] = prof[k + 1]
      const A0 = offsetPoint(i, d0, 'a'), B0 = offsetPoint(i, d0, 'b'), A1 = offsetPoint(i, d1, 'a'), B1 = offsetPoint(i, d1, 'b')
      const dd = d1 - d0, dz = z1 - z0, l = Math.hypot(dd, dz)
      const tilt = (n: V3): V3 => unit([n[0] * (dz / l), n[1] * (dz / l), -dd / l])
      quad(dome, [...A0, z0], [...B0, z0], [...B1, z1], [...A1, z1], tilt(e.na), tilt(e.nb))
    }
    // square ends where the cornice stops at the party wall
    const nxt = EDGES[(i + 1) % EDGES.length], prv = EDGES[(i + EDGES.length - 1) % EDGES.length]
    if (!street(nxt)) quad(dome, [...e.b, CORNICE0 + 0.2], [...e.b, ROOF], [...offsetPoint(i, 0.7, 'b'), ROOF], [...offsetPoint(i, 0.7, 'b'), CORNICE0 + 0.5])
    if (!street(prv)) quad(dome, [...e.a, CORNICE0 + 0.2], [...offsetPoint(i, 0.7, 'a'), CORNICE0 + 0.5], [...offsetPoint(i, 0.7, 'a'), ROOF], [...e.a, ROOF])
  }
}
/** Endpoint of edge i offset outward by d, mitred with its street neighbours only. */
function offsetPoint(i: number, d: number, end: 'a' | 'b'): XY {
  const e = EDGES[i]
  const other = end === 'a' ? EDGES[(i + EDGES.length - 1) % EDGES.length] : EDGES[(i + 1) % EDGES.length]
  const p = end === 'a' ? e.a : e.b
  if (!street(other)) return [p[0] + e.n[0] * d, p[1] + e.n[1] * d]
  const u = e.n, v = other.n, k = 1 + u[0] * v[0] + u[1] * v[1]
  return [p[0] + ((u[0] + v[0]) * d) / k, p[1] + ((u[1] + v[1]) * d) / k]
}

// --- Roof: flat, with a low parapet lip. ---
{
  const inner = offset(RING, -0.35)
  for (let i = 0; i < RING.length; i++) {
    const j = (i + 1) % RING.length
    quad(street(EDGES[i]) ? dome : cream, [...RING[i], ROOF], [...RING[j], ROOF], [...inner[j], ROOF], [...inner[i], ROOF], up)
  }
  const c: V3 = [inner.reduce((s, p) => s + p[0], 0) / inner.length, inner.reduce((s, p) => s + p[1], 0) / inner.length, ROOF - 0.3]
  for (let i = 0; i < inner.length; i++) {
    const j = (i + 1) % inner.length
    roof.tri(c, [...inner[i], ROOF - 0.3], [...inner[j], ROOF - 0.3], undefined, undefined, undefined, [up, up, up])
    quad(cream, [...inner[j], ROOF - 0.3], [...inner[i], ROOF - 0.3], [...inner[i], ROOF], [...inner[j], ROOF])
  }
}

// --- Cupola: turret storey, ring cornice, windowed drum, dome, lantern, gold ball, finial. ---
const SEG = 16
function lathe(p: Part, profile: [number, number][], smooth = true, cx = C[0], cy = C[1]) {
  for (let k = 0; k < profile.length - 1; k++) {
    const [r0, z0] = profile[k], [r1, z1] = profile[k + 1]
    const dr = r1 - r0, dz = z1 - z0, l = Math.hypot(dr, dz) || 1
    for (let i = 0; i < SEG; i++) {
      const t0 = (i / SEG) * 2 * Math.PI, t1 = ((i + 1) / SEG) * 2 * Math.PI
      const P = (r: number, z: number, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
      const N = (t: number): V3 => unit([Math.cos(t) * dz / l, Math.sin(t) * dz / l, -dr / l])
      if (r1 < 1e-6) { p.tri(P(r0, z0, t0), P(r0, z0, t1), P(0, z1, 0), undefined, undefined, undefined, smooth ? [N(t0), N(t1), up] : undefined); continue }
      if (smooth) quad(p, P(r0, z0, t0), P(r0, z0, t1), P(r1, z1, t1), P(r1, z1, t0), N(t0), N(t1))
      else p.quad(P(r0, z0, t0), P(r0, z0, t1), P(r1, z1, t1), P(r1, z1, t0))
    }
  }
}
const T0 = ROOF, T1 = ROOF + 1.9 // the turret's own short storey above the roof
lathe(copper, [[R, T0], [R, T1]])
lathe(dome, [[R, T1], [R + 0.35, T1 + 0.3], [R + 0.35, T1 + 0.65], [1.95, T1 + 0.65]]) // ring cornice
lathe(copper, [[1.95, T1 + 0.65], [1.95, T1 + 2.0], [2.15, T1 + 2.2]]) // drum
const D0 = T1 + 2.2, DH = 2.3
const domeProfile: [number, number][] = []
for (let k = 0; k <= 6; k++) {
  const t = (k / 6) * (Math.PI / 2)
  domeProfile.push([0.45 + 1.7 * Math.cos(t), D0 + DH * Math.sin(t)])
}
lathe(dome, [[2.15, D0], ...domeProfile.slice(1)])
lathe(copper, [[0.45, D0 + DH], [0.45, D0 + DH + 0.7], [0.6, D0 + DH + 0.8], [0, D0 + DH + 0.85]]) // lantern
const B0 = D0 + DH + 0.85
const ball: [number, number][] = []
for (let k = 0; k <= 6; k++) { const t = -Math.PI / 2 + (k / 6) * Math.PI; ball.push([0.42 * Math.cos(t) + 1e-4, B0 + 0.42 + 0.42 * Math.sin(t)]) }
ball[ball.length - 1][0] = 0
lathe(gold, ball)
lathe(dome, [[0.09, B0 + 0.8], [0, B0 + 2.6]], false) // finial
// Windows on the drum and on the turret storey, four round.
for (const [r, z0, z1, w] of [[R, T0 + 0.4, T1 - 0.3, 0.55], [1.95, T1 + 0.85, T1 + 1.85, 0.4]] as [number, number, number, number][]) {
  for (let i = 0; i < 4; i++) {
    const t = (i / 4) * 2 * Math.PI + Math.PI / 4, ta = t - w / 2, tb = t + w / 2
    const P = (a: number, z: number): V3 => [C[0] + (r + 0.04) * Math.cos(a), C[1] + (r + 0.04) * Math.sin(a), z]
    quad(glass, P(ta, z0), P(tb, z0), P(tb, z1), P(ta, z1), [Math.cos(t), Math.sin(t), 0])
  }
}

// Close the bottom so the shadow pass sees a solid.
{
  const c: V3 = [RING.reduce((s, p) => s + p[0], 0) / RING.length, RING.reduce((s, p) => s + p[1], 0) / RING.length, 0]
  for (let i = 0; i < RING.length; i++) cream.tri(c, [...RING[(i + 1) % RING.length], 0], [...RING[i], 0])
}

const parts = [
  { part: copper, material: finish('verdigris', 0x7fae98) },
  { part: cream, material: PALETTE.stone },
  { part: glass, material: PALETTE.window },
  { part: dome, material: PALETTE.patina },
  { part: roof, material: PALETTE.roof },
  { part: gold, material: finish('gilt', 0xd8b65e, 0.5) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const top = B0 + 2.6
const glb = writeGlb('Sentinel Building', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: top,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/288485994', 'way/1092161846'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-sentinel-building.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB), top ${top.toFixed(1)} m`)
