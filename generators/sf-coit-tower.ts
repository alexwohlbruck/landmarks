/**
 * Coit Tower, San Francisco — original procedural geometry, CC0-1.0.
 * bun generators/sf-coit-tower.ts
 *
 * Map frame: x east, y north, z up, metres, no rotation (bearing 0). Origin =
 * centroid of the OSM outline way/28824850, on the lowest ground under it.
 *
 * Evidence
 * - OSM way/28824850 (the mural lobby's outline, height 64) with parts
 *   way/451331530 (the column, r ~5.5 m), 451331532 (the lobby, = outline),
 *   451331533 (north entrance pavilion), 451331534 (the square pedestal round
 *   the column's foot, turned 14°), 451331535 (steps at the entrance).
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.5 m: the plaza round the
 *   tower is at 91.1 m NAVD88, the lowest ground under the outline 88.8 m (the
 *   west terrace), so y = 0 is 88.8 and the plaza is +2.3. Lobby roof 95.6
 *   (+6.8), pedestal 100.0 (+11.2), entrance pavilion ~99.9. Column: outer
 *   radius ~5.3 m at the top; shaft top 139.3 (+50.5); crown rim 143.3 (+54.5)
 *   on a ring of r ~4.5 m; the roof inside the crown 136.1 (+47.3). The column
 *   stands 52 m above the plaza: the published 64 m (210 ft) does not match
 *   the measured surface, so the lidar wins.
 * - USGS NAIP: the lobby's roof terraces and the roof inside the crown are
 *   red-brown (OSM roof:colour #8E5448); the pedestal top is pale.
 * - Published (Wikipedia, NRHP): 1933, Arthur Brown Jr. and Henry Howard,
 *   unpainted reinforced concrete, fluted column on Pioneer Park.
 * - Commons daylight photos: "San Francisco (CA, USA), Coit Tower -- 2022 --
 *   3082.jpg" (Dietmar Rabich, CC BY-SA 4.0, from the north-west entrance
 *   side); "Coit Tower 2021.jpg" (Chris6d, CC BY-SA 4.0, from the Columbus
 *   statue); "Coit Memorial Tower 03.jpg" (Almonroth, CC BY-SA 3.0, the shaft
 *   from below); "Coit Memorial Tower-2.jpg" (Almonroth, CC BY-SA 3.0) and
 *   "Coit Tower Telegraph Hill.jpg" (Brooklyn Peach, CC BY-SA 4.0), on the
 *   hill from the bay.
 *
 * Estimated from the photos (scaled by the measured column width): the
 * shaft's sixteen flat faces, eight broad ones (each with a loggia) between
 * eight narrow ones; the eight tall arched loggias (40.4-46.2 m) with three
 * small windows over each (47.9-49.2 m) and slit windows on the narrow
 * faces; the eight arched openings through the crown ring; the slight taper
 * (r 5.55 to 5.3); the ring at the column's foot; the lobby's blocks and the
 * entrance door. The lobby's stepped Art Deco massing is simplified to the
 * OSM outline at one height.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const ANCHOR = { lng: -122.40583383, lat: 37.80237416 }
const concrete = new Part(), windows = new Part(), roof = new Part(), door = new Part()
const up: V3 = [0, 0, 1]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return v.map((n) => n / l) as V3 }

// --- Plan (OSM, metres from the outline centroid) ---
const OUTLINE: XY[] = [[-8.39, 9.11], [-5.65, 9.81], [0.27, 11.33], [2.55, 11.92], [3.2, 9.42], [6.38, 10.24], [7.07, 7.63], [8.34, 7.96], [10.11, 5.17], [11.06, 1.07], [11.22, -3.08], [9.93, -3.4], [10.68, -6.26], [7.5, -7.08], [7.75, -8.42], [5.39, -9.94], [1.27, -11.23], [-2.74, -11.12], [-3.45, -9.89], [-6.3, -10.62], [-7.05, -7.77], [-7.98, -8.0], [-9.72, -5.6], [-10.9, -2.55], [-11.24, 0.02], [-10.85, 3.04], [-9.93, 3.28], [-10.61, 5.88], [-7.74, 6.61]]
const PEDESTAL: XY[] = [[-4.19, -7.03], [6.76, -4.22], [3.88, 6.82], [-7.06, 4.01]]
const PAVILION: XY[] = [[-3.47, 4.93], [0.69, 6.0], [-0.55, 10.74], [-4.7, 9.68]]
const C: XY = [-0.12, -0.06] // column centre

// --- Heights above y = 0 (88.8 m NAVD88) ---
const PLAZA = 2.3
const LOBBY = 6.8
const PED = 11.2
const SHAFT0 = PED, SHAFT1 = 50.5
const CROWN = 54.5
const DECK = 47.3
const R0 = 5.55, R1 = 5.3 // column radius at foot and top (to the flute arrises)
const RC = 4.55, RCI = 3.75 // crown ring, outer and inner
const N = 16 // flutes
const ROT = Math.PI / 2 // a flute centred on each cardinal direction

/** Signed area > 0 when counter-clockwise. */
const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) > 0 ? r : [...r].reverse())

/** Ear-clipping triangulation of a simple polygon (counter-clockwise). */
function earcut(ring: XY[]): [number, number, number][] {
  const idx = ring.map((_, i) => i), out: [number, number, number][] = []
  const cross = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cross(a, b, p) > 1e-9 && cross(b, c, p) > 1e-9 && cross(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 5000) {
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = ring[i0], b = ring[i1], c = ring[i2]
      if (cross(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(ring[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); break
    }
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}

/** Mitred inward/outward offset (d > 0 outward) of a counter-clockwise ring. */
function offset(ring: XY[], d: number): XY[] {
  return ring.map((b, i) => {
    const a = ring[(i + ring.length - 1) % ring.length], c = ring[(i + 1) % ring.length]
    const u = unit([b[1] - a[1], a[0] - b[0], 0]), v = unit([c[1] - b[1], b[0] - c[0], 0])
    const k = Math.max(0.35, 1 + u[0] * v[0] + u[1] * v[1])
    return [b[0] + ((u[0] + v[0]) * d) / k, b[1] + ((u[1] + v[1]) * d) / k]
  })
}

/** A prism over a ring with a lip: walls, a parapet coping and a recessed roof. */
function prism(ring0: XY[], z0: number, z1: number, wall: Part, top: Part, lip = 0.35, drop = 0.4) {
  const ring = ccw(ring0)
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    wall.quad([...a, z0], [...b, z0], [...b, z1], [...a, z1])
  }
  const inner = offset(ring, -lip)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    wall.quad([...ring[i], z1], [...ring[j], z1], [...inner[j], z1], [...inner[i], z1])
    wall.quad([...inner[j], z1], [...inner[i], z1], [...inner[i], z1 - drop], [...inner[j], z1 - drop])
  }
  for (const [i, j, k] of earcut(inner)) top.tri([...inner[i], z1 - drop], [...inner[j], z1 - drop], [...inner[k], z1 - drop], undefined, undefined, undefined, [up, up, up])
}

// --- The mural lobby, the pedestal and the entrance pavilion ---
prism(OUTLINE, 0, LOBBY, concrete, roof)
prism(PEDESTAL, LOBBY - 0.5, PED, concrete, concrete, 0.3, 0.2)
prism(PAVILION, LOBBY - 0.5, PED - 0.6, concrete, roof, 0.3, 0.3)
{
  // the entrance on the pavilion's north face, above the plaza
  const a = PAVILION[3], b = PAVILION[2]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
  // the face runs west to east along the north side; its outward normal points north
  const P = (s: number, z: number): V3 => [a[0] + ux * s - nx * 0.05, a[1] + uy * s - ny * 0.05, z]
  const s0 = L / 2 - 0.9, s1 = L / 2 + 0.9
  door.quad(P(s1, PLAZA), P(s0, PLAZA), P(s0, PLAZA + 3.6), P(s1, PLAZA + 3.6))
}

// --- The column: sixteen flat faces, tapering slightly, with a ring at its foot ---
// Eight broad faces, each carrying a loggia, alternate with eight narrow ones
// (photos: the broad face reads ~1.6x the narrow one). Face 2m is broad and
// centred on ROT + m·45°; arris i sits at the end of face i.
const WIDE = (27 / 180) * Math.PI, NARROW = Math.PI / 4 - WIDE
const ang = (i: number) => {
  const m = Math.floor(i / 2), odd = ((i % 2) + 2) % 2
  return ROT + m * (Math.PI / 4) + (odd ? WIDE / 2 + NARROW : WIDE / 2)
}
const ringAt = (r: number, z: number): V3[] => Array.from({ length: N }, (_, i) => [C[0] + r * Math.cos(ang(i)), C[1] + r * Math.sin(ang(i)), z] as V3)
const Z0 = SHAFT0 + 1.2, Z1 = SHAFT1 - 0.9 // the plain shaft's ends
const rAt = (z: number) => R0 + ((R1 - R0) * (z - Z0)) / (Z1 - Z0)
// foot ring
concrete.loft([ringAt(R0 + 0.35, SHAFT0 - 0.1), ringAt(R0 + 0.35, SHAFT0 + 0.9)])
concrete.loft([ringAt(R0 + 0.35, SHAFT0 + 0.9), ringAt(R0, SHAFT0 + 1.2)])
// the loggia band (L0..L1) is built face by face below, so the niches can be cut in
const L0 = 39.6, L1 = 46.8
concrete.loft([ringAt(R0, Z0), ringAt(rAt(L0), L0)])
concrete.loft([ringAt(rAt(L1), L1), ringAt(R1, Z1)])
// a plain cornice band at the shaft's top, then the step in to the crown ring
concrete.loft([ringAt(R1, SHAFT1 - 0.9), ringAt(R1 + 0.2, SHAFT1 - 0.6), ringAt(R1 + 0.2, SHAFT1)])
{
  const o = ringAt(R1 + 0.2, SHAFT1), i = ringAt(RC, SHAFT1)
  for (let k = 0; k < N; k++) { const l = (k + 1) % N; concrete.quad(i[k], o[k], o[l], i[l]) }
}

/** Position on flute k's flat face: s across it (0 = centre), z up, `out` proud. */
function onFlute(k: number, s: number, z: number, out = 0.05): V3 {
  const a0 = ang(k - 1), a1 = ang(k), r = rAt(z)
  const A: XY = [C[0] + r * Math.cos(a0), C[1] + r * Math.sin(a0)], B: XY = [C[0] + r * Math.cos(a1), C[1] + r * Math.sin(a1)]
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), ux = (B[0] - A[0]) / L, uy = (B[1] - A[1]) / L
  const m: XY = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
  return [m[0] + ux * s + uy * out, m[1] + uy * s - ux * out, z]
}
/** A flush round-headed panel on a flute. */
function archOnFlute(p: Part, k: number, w: number, z0: number, z1: number) {
  const r = w / 2, spring = z1 - r
  p.quad(onFlute(k, -r, z0), onFlute(k, r, z0), onFlute(k, r, spring), onFlute(k, -r, spring))
  for (let i = 0; i < 8; i++) {
    const t0 = (Math.PI * i) / 8, t1 = (Math.PI * (i + 1)) / 8
    p.tri(onFlute(k, 0, spring), onFlute(k, r * Math.cos(t0), spring + r * Math.sin(t0)), onFlute(k, r * Math.cos(t1), spring + r * Math.sin(t1)))
  }
}
/** Face k's half width at height z (arris to arris). */
const halfW = (k: number, z: number) => {
  const a0 = ang(k - 1), a1 = ang(k)
  return (rAt(z) * Math.hypot(Math.cos(a1) - Math.cos(a0), Math.sin(a1) - Math.sin(a0))) / 2
}
const nicheAt: Record<number, { w: number; z0: number; z1: number }> = {}
/** A deep round-headed niche in broad face k: the loggia, glazed at the back. */
function niche(k: number, w: number, z0: number, z1: number) { nicheAt[k] = { w, z0, z1 } }
/** The loggia band, face by face; broad faces get their niche cut in. */
function band() {
  const DEEP = 0.85, SEGS = 8
  for (let k = 0; k < N; k++) {
    const nz = nicheAt[k]
    const wallQuad = (s0: number, s1: number, za0: number, za1: number, zb0: number, zb1: number) => {
      // a strip of face from s0 to s1 (±1e4 = the arrises); bottom heights za0 (at s0) / zb0 (at s1), tops za1 / zb1
      const e0 = (z: number) => (s0 <= -1e3 ? -halfW(k, z) : s0), e1 = (z: number) => (s1 >= 1e3 ? halfW(k, z) : s1)
      concrete.quad(onFlute(k, e0(za0), za0, 0), onFlute(k, e1(zb0), zb0, 0), onFlute(k, e1(zb1), zb1, 0), onFlute(k, e0(za1), za1, 0))
    }
    if (!nz) { wallQuad(-1e4, 1e4, L0, L1, L0, L1); continue }
    const r = nz.w / 2, spring = nz.z1 - r
    // jamb walls either side, the sill wall below and the spandrel above the arch
    wallQuad(-1e4, -r, L0, L1, L0, L1)
    wallQuad(r, 1e4, L0, L1, L0, L1)
    wallQuad(-r, r, L0, nz.z0, L0, nz.z0)
    for (let i = 0; i < SEGS; i++) {
      const t0 = Math.PI - (i * Math.PI) / SEGS, t1 = Math.PI - ((i + 1) * Math.PI) / SEGS
      const sa = r * Math.cos(t0), sb = r * Math.cos(t1), za = spring + r * Math.sin(t0), zb = spring + r * Math.sin(t1)
      wallQuad(sa, sb, za, L1, zb, L1)
      // the soffit of the arch, from the face back into the niche
      concrete.quad(onFlute(k, sb, zb, 0), onFlute(k, sa, za, 0), onFlute(k, sa, za, -DEEP), onFlute(k, sb, zb, -DEEP))
    }
    // jambs and sill of the niche
    concrete.quad(onFlute(k, -r, nz.z0, -DEEP), onFlute(k, -r, nz.z0, 0), onFlute(k, -r, spring, 0), onFlute(k, -r, spring, -DEEP))
    concrete.quad(onFlute(k, r, nz.z0, 0), onFlute(k, r, nz.z0, -DEEP), onFlute(k, r, spring, -DEEP), onFlute(k, r, spring, 0))
    concrete.quad(onFlute(k, -r, nz.z0, 0), onFlute(k, -r, nz.z0, -DEEP), onFlute(k, r, nz.z0, -DEEP), onFlute(k, r, nz.z0, 0))
    // the back of the niche: the glazed observation room behind the loggia
    const c = onFlute(k, 0, (nz.z0 + spring) / 2, -DEEP)
    const outline: V3[] = [onFlute(k, -r, nz.z0, -DEEP), onFlute(k, r, nz.z0, -DEEP)]
    for (let i = 0; i <= SEGS; i++) { const t = (i * Math.PI) / SEGS; outline.push(onFlute(k, r * Math.cos(t), spring + r * Math.sin(t), -DEEP)) }
    outline.push(outline[0])
    for (let i = 0; i < outline.length - 1; i++) windows.tri(c, outline[i], outline[i + 1])
  }
}

// Flute k is centred on angle ROT + k·(2π/16): k = 0 north, 4 west, 8 south, 12 east.
for (let k = 0; k < N; k += 2) {
  niche(k, 1.9, 40.4, 46.2) // the observation loggias
  // a balcony ledge under each loggia
  const z = 40.1
  const pts = [onFlute(k, -1.15, z, 0), onFlute(k, 1.15, z, 0), onFlute(k, 1.15, z, 0.3), onFlute(k, -1.15, z, 0.3)]
  const lift = (p: V3, dz: number): V3 => [p[0], p[1], p[2] + dz]
  concrete.quad(lift(pts[3], 0.5), lift(pts[2], 0.5), lift(pts[1], 0.5), lift(pts[0], 0.5))
  concrete.quad(pts[3], pts[2], lift(pts[2], 0.5), lift(pts[3], 0.5))
  concrete.quad(pts[2], pts[1], lift(pts[1], 0.5), lift(pts[2], 0.5))
  concrete.quad(pts[0], pts[3], lift(pts[3], 0.5), lift(pts[0], 0.5))
  concrete.quad(pts[0], pts[1], pts[2], pts[3])
  // three small windows above it
  for (const s of [-0.65, 0, 0.65]) windows.quad(onFlute(k, s - 0.2, 47.9), onFlute(k, s + 0.2, 47.9), onFlute(k, s + 0.2, 49.2), onFlute(k, s - 0.2, 49.2))
  // slit windows down the shaft, as on the stair
  for (const zz of [18, 26, 34]) windows.quad(onFlute(k + 1, -0.12, zz), onFlute(k + 1, 0.12, zz), onFlute(k + 1, 0.12, zz + 1.3), onFlute(k + 1, -0.12, zz + 1.3))
}
band()

// --- The crown: a ring wall with eight round-headed openings, over a red roof ---
{
  const SEG = 48 // around the ring, plus extra samples across each opening
  const OPEN_W = 1.7, SILL = SHAFT1 + 0.15, TOPR = CROWN - 0.6 // opening crown
  const P = (r: number, t: number, z: number): V3 => [C[0] + r * Math.cos(t), C[1] + r * Math.sin(t), z]
  const N2 = (t: number, s = 1): V3 => [s * Math.cos(t), s * Math.sin(t), 0]
  // opening bottom/top heights as a function of angle (8 openings centred on the flute centres k = 0, 2, ...)
  const openAt = (t: number): [number, number] | null => {
    const bay = (2 * Math.PI) / 8
    let d = ((t - ROT) % bay + bay) % bay
    if (d > bay / 2) d -= bay
    const s = d * RC, r = OPEN_W / 2
    if (Math.abs(s) >= r - 1e-6) return null
    const spring = TOPR - r
    return [SILL, spring + Math.sqrt(r * r - s * s)]
  }
  const ts = Array.from({ length: SEG }, (_, i) => ROT + (i / SEG) * 2 * Math.PI - Math.PI / 8)
  // add sample angles across each opening so the arch reads round
  const bay = (2 * Math.PI) / 8, r = OPEN_W / 2 / RC
  const all = new Set<number>(ts.map((t) => +t.toFixed(6)))
  for (let k = 0; k < 8; k++) for (let j = 0; j <= 8; j++) all.add(+(ROT + k * bay - r + (2 * r * j) / 8).toFixed(6))
  const T = [...all].sort((a, b) => a - b)
  for (let i = 0; i < T.length; i++) {
    const t0 = T[i], t1 = i + 1 < T.length ? T[i + 1] : T[0] + 2 * Math.PI, tm = (t0 + t1) / 2
    const o = openAt(tm)
    const spans: [number, number][] = o ? [[SHAFT1, o[0]], [o[1], CROWN]] : [[SHAFT1, CROWN]]
    for (const [z0, z1] of spans) {
      // over an opening the upper span's lower edge follows the arch, sampled at each end
      const head = !!o && z0 === o[1]
      const lo0 = head ? (openAt(t0 + 1e-6)?.[1] ?? z0) : z0
      const lo1 = head ? (openAt(t1 - 1e-6)?.[1] ?? z0) : z0
      // outer face
      concrete.tri(P(RC, t0, lo0), P(RC, t1, lo1), P(RC, t1, z1), undefined, undefined, undefined, [N2(t0), N2(t1), N2(t1)])
      concrete.tri(P(RC, t0, lo0), P(RC, t1, z1), P(RC, t0, z1), undefined, undefined, undefined, [N2(t0), N2(t1), N2(t0)])
      // inner face, down to the roof inside the crown
      const a0 = z0 === SHAFT1 ? DECK : lo0, a1 = z0 === SHAFT1 ? DECK : lo1
      concrete.tri(P(RCI, t1, a1), P(RCI, t0, a0), P(RCI, t0, z1), undefined, undefined, undefined, [N2(t1, -1), N2(t0, -1), N2(t0, -1)])
      concrete.tri(P(RCI, t1, a1), P(RCI, t0, z1), P(RCI, t1, z1), undefined, undefined, undefined, [N2(t1, -1), N2(t0, -1), N2(t1, -1)])
      if (head) {
        // soffit of the arch
        concrete.quad(P(RCI, t0, lo0), P(RCI, t1, lo1), P(RC, t1, lo1), P(RC, t0, lo0))
      }
      if (o && z1 === o[0]) {
        concrete.quad(P(RC, t0, z1), P(RC, t1, z1), P(RCI, t1, z1), P(RCI, t0, z1)) // sill
      }
    }
    // cap
    concrete.quad(P(RCI, t0, CROWN), P(RC, t0, CROWN), P(RC, t1, CROWN), P(RCI, t1, CROWN))
    // opening jambs
    const oPrev = openAt(t0 - 1e-6), oNext = openAt(t0 + 1e-6)
    if (!!oPrev !== !!oNext) {
      const ob = (oPrev ?? oNext)!
      const zTop = Math.min(ob[1], TOPR)
      const q = [P(RCI, t0, SILL), P(RC, t0, SILL), P(RC, t0, zTop), P(RCI, t0, zTop)]
      if (oNext) concrete.quad(q[0], q[1], q[2], q[3])
      else concrete.quad(q[1], q[0], q[3], q[2])
    }
  }
  // the roof inside the crown
  for (let i = 0; i < 24; i++) {
    const t0 = (i / 24) * 2 * Math.PI, t1 = ((i + 1) / 24) * 2 * Math.PI
    roof.tri([C[0], C[1], DECK], P(RCI, t0, DECK), P(RCI, t1, DECK), undefined, undefined, undefined, [up, up, up])
  }
}

// Close the bottom so the shadow pass sees a solid.
{
  const ring = ccw(OUTLINE)
  for (const [i, j, k] of earcut(ring)) concrete.tri([...ring[k], 0], [...ring[j], 0], [...ring[i], 0])
}

const parts = [
  { part: concrete, material: finish('coit-concrete', 0xe6ded0) },
  { part: windows, material: PALETTE.window },
  { part: roof, material: PALETTE.terracotta },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Coit Tower', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: CROWN,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/28824850', 'way/451331530', 'way/451331532', 'way/451331533', 'way/451331534', 'way/451331535'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-coit-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB), top ${CROWN.toFixed(1)} m`)
