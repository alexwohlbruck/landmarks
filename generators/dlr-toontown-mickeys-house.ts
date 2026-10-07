/**
 * Mickey's House, Mickey's Toontown, Disneyland Park, Anaheim — procedural,
 * CC0-1.0.
 * bun generators/dlr-toontown-mickeys-house.ts
 *
 * Mickey's crooked yellow cottage: board walls under a low, bell-flared red
 * shingle roof with two dormers under their own steep little gables, a
 * tall steep front gable with wide cream bargeboards over an arched
 * doorway between two fat bulbous cream columns, and a white picket fence
 * round the front yard. The green Toontown hill on the show building
 * behind is landscaping and is left to the map.
 *
 * Map frame: x east, y north, z up, metres, turned so the front door is
 * model south. Origin at the centre of the outline's extent
 * (-117.9193644, 33.8155436), on the ground. Bearing 310 (the house faces
 * 130°, square to OSM's front wall).
 *
 * Evidence:
 *  - OSM, measured: the house part way/185253879 (tagged 7 m), drawn and
 *    replaced; the outline way/186539115 (house, show building and yard)
 *    gives the fence line but isn't fully covered, so it isn't replaced.
 *  - Photos (licensed): the front, close, post-2023 (Contributor19, CC BY
 *    4.0, commons File:Mickey's house, Disneyland.jpg); the front from the
 *    Toontown fountain (Theme Park Tourist, CC BY 2.0, File:Toontown
 *    (28727562311).jpg, 2016, before the refurbishment); the porch (Theme
 *    Park Tourist, CC BY 2.0, File:Toontown (28773090076).jpg).
 *
 * Estimated: eaves 3.4 m, the hip roof 5.9 m, the front gable 11.8 m (OSM's
 * 7 m reads as the roof; the photos put the gable well above it), from the
 * close photo's proportions. The gable is centred on the front wall.
 * Invented: the sides and back of the house — no licensed photo shows
 * them; the roof is a hipped cover over the main block's hull, not the real
 * roof's crooked ridges. Left out: the chimney, shutters and the movie
 * barn's facade.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const TAU = Math.PI * 2

// ---------------------------------------------------------------------------
// OSM (lon, lat): the outline (way/186539115) and the house part
// (way/185253879, height 7).

const ANCHOR: XY = [-117.9193644, 33.8155436]
const BEARING = 310 // the house faces 130°, so model south is its front
const OUTLINE: XY[] = [[-117.9196270, 33.8156659], [-117.9196278, 33.8154721], [-117.9193892, 33.8154743], [-117.9193636, 33.8154537], [-117.9193482, 33.8154433], [-117.9193429, 33.8154390], [-117.9193389, 33.8154372], [-117.9193305, 33.8154267], [-117.9193223, 33.8154209], [-117.9193147, 33.8154213], [-117.9192992, 33.8154374], [-117.9192738, 33.8154473], [-117.9192810, 33.8154637], [-117.9192669, 33.8154816], [-117.9192581, 33.8154736], [-117.9192526, 33.8154694], [-117.9192611, 33.8154602], [-117.9192347, 33.8154360], [-117.9192163, 33.8154549], [-117.9191995, 33.8154375], [-117.9191760, 33.8154556], [-117.9191693, 33.8154504], [-117.9191602, 33.8154594], [-117.9191523, 33.8154654], [-117.9191457, 33.8154710], [-117.9191362, 33.8154787], [-117.9191440, 33.8154843], [-117.9191092, 33.8155027], [-117.9191018, 33.8155089], [-117.9191054, 33.8155111], [-117.9191100, 33.8155122], [-117.9191578, 33.8155375], [-117.9191670, 33.8155427], [-117.9191738, 33.8155455], [-117.9191936, 33.8155683], [-117.9191919, 33.8155845], [-117.9192063, 33.8156231], [-117.9192141, 33.8156663], [-117.9193657, 33.8156652], [-117.9196200, 33.8156659], [-117.9196270, 33.8156659]]
const HOUSE: XY[] = [[-117.9193382, 33.8154576], [-117.9193389, 33.8154372], [-117.9193429, 33.8154390], [-117.9193482, 33.8154433], [-117.9193636, 33.8154537], [-117.9193892, 33.8154743], [-117.9193657, 33.8156652], [-117.9192141, 33.8156663], [-117.9192063, 33.8156231], [-117.9191919, 33.8155845], [-117.9191936, 33.8155683], [-117.9192652, 33.8155130], [-117.9192431, 33.8154894], [-117.9192581, 33.8154736], [-117.9192669, 33.8154816], [-117.9192810, 33.8154637], [-117.9193138, 33.8154706], [-117.9193382, 33.8154576]]

const MX = 111320 * Math.cos((ANCHOR[1] * Math.PI) / 180), MY = 110574
const rad = (BEARING * Math.PI) / 180
const toModel = ([lon, lat]: XY): XY => {
  const e = (lon - ANCHOR[0]) * MX, n = (lat - ANCHOR[1]) * MY
  return [e * Math.cos(rad) - n * Math.sin(rad), e * Math.sin(rad) + n * Math.cos(rad)]
}

// ---------------------------------------------------------------------------
// Kit

const unit3 = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n?: [V3, V3, V3, V3]) {
  p.tri(a, b, c, undefined, undefined, undefined, n && [n[0], n[1], n[2]])
  p.tri(a, c, d, undefined, undefined, undefined, n && [n[0], n[2], n[3]])
}

function earClip(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i)
  const out: [number, number, number][] = []
  const cross = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (p: XY, a: XY, b: XY, c: XY) => cross(a, b, p) >= -1e-9 && cross(b, c, p) >= -1e-9 && cross(c, a, p) >= -1e-9
  while (idx.length > 3) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i = idx[(k + idx.length - 1) % idx.length], j = idx[k], l = idx[(k + 1) % idx.length]
      const [a, b, c] = [poly[i], poly[j], poly[l]]
      if (cross(a, b, c) <= 1e-9) continue
      if (idx.some((m) => m !== i && m !== j && m !== l && inTri(poly[m], a, b, c))) continue
      out.push([i, j, l]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) throw new Error('ear clipping failed')
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}

/** Drop repeated and collinear nodes, make counter-clockwise. */
function clean(ring: XY[]): XY[] {
  let p = ring.slice(0, -1)
  p = p.filter((q, i) => { const r = p[(i + 1) % p.length]; return Math.hypot(q[0] - r[0], q[1] - r[1]) > 0.05 })
  const area = p.reduce((s, q, i) => { const r = p[(i + 1) % p.length]; return s + q[0] * r[1] - r[0] * q[1] }, 0)
  return area < 0 ? p.reverse() : p
}

/** A prism over a polygon: walls in `wall`, top in `top`, optionally the underside. */
function prism(poly: XY[], z0: number, z1: number, wall: Part, top: Part | null, under: Part | null = null) {
  const N = poly.length
  for (let i = 0; i < N; i++) {
    const a = poly[i], b = poly[(i + 1) % N]
    quad(wall, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  for (const [i, j, k] of earClip(poly)) {
    if (top) top.tri([...poly[i], z1] as V3, [...poly[j], z1] as V3, [...poly[k], z1] as V3)
    if (under) under.tri([...poly[i], z0] as V3, [...poly[k], z0] as V3, [...poly[j], z0] as V3)
  }
}

function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = false) {
  const c = (x: number, y: number, z: number): V3 => [x, y, z]
  quad(p, c(x0, y0, z0), c(x1, y0, z0), c(x1, y0, z1), c(x0, y0, z1))
  quad(p, c(x1, y0, z0), c(x1, y1, z0), c(x1, y1, z1), c(x1, y0, z1))
  quad(p, c(x1, y1, z0), c(x0, y1, z0), c(x0, y1, z1), c(x1, y1, z1))
  quad(p, c(x0, y1, z0), c(x0, y0, z0), c(x0, y0, z1), c(x0, y1, z1))
  quad(p, c(x0, y0, z1), c(x1, y0, z1), c(x1, y1, z1), c(x0, y1, z1))
  if (bottom) quad(p, c(x0, y1, z0), c(x1, y1, z0), c(x1, y0, z0), c(x0, y0, z0))
}

/** A smooth cylinder or cone frustum about a vertical axis. */
function round(p: Part, cx: number, cy: number, r0: number, z0: number, r1: number, z1: number, n = 16, top = false) {
  const k = (r0 - r1) / (z1 - z0)
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU, b = ((i + 1) / n) * TAU
    const P = (t: number, r: number, z: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
    const N = (t: number): V3 => unit3([Math.cos(t), Math.sin(t), k])
    if (r1 <= 0.001) p.tri(P(a, r0, z0), P(b, r0, z0), [cx, cy, z1], [N(a), N(b), N((a + b) / 2)])
    else quad(p, P(a, r0, z0), P(b, r0, z0), P(b, r1, z1), P(a, r1, z1), [N(a), N(b), N(b), N(a)])
    if (top && r1 > 0.001) p.tri(P(a, r1, z1), P(b, r1, z1), [cx, cy, z1])
  }
}

// ---------------------------------------------------------------------------
// Dimensions (estimated from the photos, scaled on the OSM front: see header)

const EAVE = 3.4     // wall top under the eaves
const HIP = 5.9      // top of the hipped roof
const GABLE = 11.8   // ridge of the front gable

const walls = new Part()
const roofs = new Part()
const trim = new Part()
const glazing = new Part()
const door = new Part()

const cross2 = (o: XY, a: XY, b: XY) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
function hull(pts: XY[]): XY[] {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const lo: XY[] = [], up: XY[] = []
  for (const q of p) { while (lo.length > 1 && cross2(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q) }
  for (const q of [...p].reverse()) { while (up.length > 1 && cross2(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q) }
  return [...lo.slice(0, -1), ...up.slice(0, -1)]
}
/** A convex ring pushed out (d > 0) or pulled in (d < 0) along its corner bisectors. */
function grow(ring: XY[], d: number): XY[] {
  const N = ring.length
  return ring.map((p, i) => {
    const a = ring[(i + N - 1) % N], b = ring[(i + 1) % N]
    const ea: XY = [p[0] - a[0], p[1] - a[1]], eb: XY = [b[0] - p[0], b[1] - p[1]]
    const la = Math.hypot(...ea), lb = Math.hypot(...eb)
    const na: XY = [ea[1] / la, -ea[0] / la], nb: XY = [eb[1] / lb, -eb[0] / lb]
    const m: XY = [na[0] + nb[0], na[1] + nb[1]], lm = Math.hypot(...m)
    const k = d / Math.max(0.4, (m[0] / lm) * na[0] + (m[1] / lm) * na[1])
    return [p[0] + (m[0] / lm) * k, p[1] + (m[1] / lm) * k] as XY
  })
}
/** Lofted rings (counter-clockwise), smooth around, flat between levels. */
function loft(p: Part, rings: [XY[], number][], capTop = true) {
  for (let k = 0; k < rings.length - 1; k++) {
    const [r0, z0] = rings[k], [r1, z1] = rings[k + 1]
    for (let i = 0; i < r0.length; i++) {
      const j = (i + 1) % r0.length
      quad(p, [...r0[i], z0] as V3, [...r0[j], z0] as V3, [...r1[j], z1] as V3, [...r1[i], z1] as V3)
    }
  }
  if (capTop) {
    const [r, z] = rings[rings.length - 1]
    for (let i = 1; i < r.length - 1; i++) p.tri([...r[0], z] as V3, [...r[i], z] as V3, [...r[i + 1], z] as V3)
  }
  const [r, z] = rings[0]
  for (let i = 1; i < r.length - 1; i++) p.tri([...r[0], z] as V3, [...r[i + 1], z] as V3, [...r[i], z] as V3)
}

// ---------------------------------------------------------------------------
// The house: OSM's part, yellow board walls under a bell-flared hipped roof.

const house = clean(HOUSE.map(toModel))
prism(house, 0, EAVE, walls, null)
// the roof covers the main block; the entrance bay in front sits under the gable
const hh = hull(house.filter((p) => p[1] > -10.6))
loft(roofs, [
  [grow(hh, 0.9), EAVE - 0.15],
  [grow(hh, 0.35), EAVE + 0.35],
  [grow(hh, -2.2), EAVE + 1.6],
  [grow(hh, -4.6), HIP],
])
// the cream fascia under the eaves
loft(trim, [[grow(hh, 0.9), EAVE - 0.45], [grow(hh, 0.9), EAVE - 0.15]], false)

// ---------------------------------------------------------------------------
// The front gable, centred on the house's front wall, with its arched door,
// cream bargeboards and the two bulbous porch columns.

const GX = 4.5, GF = -12.2, GB = -1.5, GW = 3.0
{
  const front: XY[] = [[GX - GW, GF], [GX + GW, GF], [GX + GW, GB], [GX - GW, GB]]
  prism(front, 0, EAVE + 1.0, walls, null)
  const z0 = EAVE + 1.0, o = 0.6 // eave overhang at the gable
  // gable end walls (front and back triangles)
  for (const y of [GF, GB]) {
    const a: V3 = [GX - GW, y, z0], b: V3 = [GX + GW, y, z0], c: V3 = [GX, y, GABLE - 0.5]
    if (y === GF) walls.tri(a, b, c); else walls.tri(b, a, c)
  }
  // the two roof planes, overhanging the front
  for (const s of [-1, 1]) {
    const e0: V3 = [GX + s * (GW + o), GF - o, z0 - 0.5], e1: V3 = [GX + s * (GW + o), GB, z0 - 0.5]
    const r0: V3 = [GX, GF - o, GABLE], r1: V3 = [GX, GB, GABLE]
    if (s > 0) quad(roofs, e0, e1, r1, r0); else quad(roofs, e1, e0, r0, r1)
    // underside, so the overhang isn't see-through from below
    if (s > 0) quad(roofs, e0, r0, r1, e1); else quad(roofs, e1, r1, r0, e0)
    // bargeboard: a cream band along the front edge of the roof plane
    const t = 0.65
    const f0: V3 = [e0[0], GF - o - 0.02, e0[2]], f1: V3 = [GX, GF - o - 0.02, GABLE]
    const g0: V3 = [e0[0] - s * 0.1, GF - o - 0.02, e0[2] - t], g1: V3 = [GX, GF - o - 0.02, GABLE - t * 1.3]
    if (s > 0) quad(trim, g0, f0, f1, g1); else quad(trim, f0, g0, g1, f1)
  }
  // the arched doorway: a cream arch band around a green-framed door
  const arch = (r: number, z: number, y: number, p: Part, w: number) => {
    const pts: XY[] = [[-r, 0], [r, 0]]
    for (let i = 0; i <= 8; i++) { const t = (i / 8) * Math.PI; pts.push([r * Math.cos(t), z + r * Math.sin(t)]) }
    const ring: V3[] = [[GX - r, y, 0], [GX + r, y, 0], ...pts.slice(2).map(([x, zz]) => [GX + x, y, zz] as V3)]
    for (let i = 1; i < ring.length - 1; i++) p.tri(ring[0], ring[i], ring[i + 1])
    void w
  }
  arch(1.9, 3.0, GF - 0.04, trim, 0)
  arch(1.2, 2.3, GF - 0.08, door, 0)
  // bulbous columns either side of the door
  for (const s of [-1, 1]) {
    const cx = GX + s * 2.55, cy = GF - 0.9
    round(trim, cx, cy, 0.65, 0, 0.65, 0.8, 10)
    round(trim, cx, cy, 0.65, 0.8, 0.95, 1.5, 10)
    round(trim, cx, cy, 0.95, 1.5, 0.45, 2.6, 10)
    round(trim, cx, cy, 0.45, 2.6, 0.8, 3.2, 10)
    round(trim, cx, cy, 0.8, 3.2, 0.7, EAVE + 1.0, 10, true)
  }
}

// Windows with green shutters either side of the gable, and two dormers on
// the front roof.
for (const s of [-1, 1]) {
  const wx = GX + s * 6.2
  // front wall y at that x: interpolate the house's front edge
  const wy = s > 0 ? -9.3 : -9.6
  box(glazing, wx - 1.0, wx + 1.0, wy - 0.06, wy, 1.0, 2.5)
  // dormer
  const dx = GX + s * 5.8, dy = -9.2, dz = EAVE + 0.3
  box(walls, dx - 1.3, dx + 1.3, dy - 0.6, dy + 1.8, dz, dz + 1.5)
  box(glazing, dx - 0.75, dx + 0.75, dy - 0.66, dy - 0.6, dz + 0.25, dz + 1.3)
  // its own steep little gable roof, overhanging the dormer's face, with a
  // cream bargeboard like the big gable's
  const RZ = dz + 3.6, EZ = dz + 1.25, DF = dy - 1.0
  for (const t of [-1, 1]) {
    const e0: V3 = [dx + t * 1.55, DF, EZ], e1: V3 = [dx + t * 1.55, dy + 1.8, EZ]
    const r0: V3 = [dx, DF, RZ], r1: V3 = [dx, dy + 1.8, RZ]
    if (t > 0) { quad(roofs, e0, e1, r1, r0); quad(roofs, e0, r0, r1, e1) }
    else { quad(roofs, e1, e0, r0, r1); quad(roofs, e1, r1, r0, e0) }
    const f0: V3 = [e0[0], DF - 0.02, EZ], f1: V3 = [dx, DF - 0.02, RZ]
    const g0: V3 = [e0[0] - t * 0.05, DF - 0.02, EZ - 0.3], g1: V3 = [dx, DF - 0.02, RZ - 0.4]
    if (t > 0) quad(trim, g0, f0, f1, g1); else quad(trim, f0, g0, g1, f1)
  }
  walls.tri([dx - 1.3, dy - 0.6, dz + 1.5], [dx + 1.3, dy - 0.6, dz + 1.5], [dx, dy - 0.6, RZ - 0.3])
}


// The white picket fence round the front yard, along OSM's outline where it
// runs out in front of the house (the yard itself is the map's ground).
{
  const o = clean(OUTLINE.map(toModel))
  for (let i = 0; i < o.length; i++) {
    const a = o[i], b = o[(i + 1) % o.length]
    if ((a[1] + b[1]) / 2 > -10.5) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.2) continue
    const n: XY = [(b[1] - a[1]) / L * 0.12, -(b[0] - a[0]) / L * 0.12]
    const A0: XY = [a[0] + n[0], a[1] + n[1]], B0: XY = [b[0] + n[0], b[1] + n[1]]
    const A1: XY = [a[0] - n[0], a[1] - n[1]], B1: XY = [b[0] - n[0], b[1] - n[1]]
    const h = 0.95
    quad(trim, [...A0, 0] as V3, [...B0, 0] as V3, [...B0, h] as V3, [...A0, h] as V3)
    quad(trim, [...B1, 0] as V3, [...A1, 0] as V3, [...A1, h] as V3, [...B1, h] as V3)
    quad(trim, [...A0, h] as V3, [...B0, h] as V3, [...B1, h] as V3, [...A1, h] as V3)
  }
}

// ---------------------------------------------------------------------------

const parts = [
  { part: walls, material: finish('mickey-yellow', 0xeec77c) },
  { part: roofs, material: finish('mickey-shingle', 0xbd6a5c) },
  { part: trim, material: PALETTE.trim },
  { part: glazing, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((sum, { part }) => sum + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb("Mickey's House", parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: BEARING, elevation: 0, height: GABLE,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/dlr-toontown-mickeys-house.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
