/**
 * Wrigley Building, Chicago (1921 south building, 1924 north addition;
 * Graham, Anderson, Probst & White) — original procedural geometry, CC0-1.0.
 * bun generators/chi-wrigley-building.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area-weighted centroid of the two outer ways of the OSM
 * multipolygon relation/17460539, 41.889740,-87.624884. Bearing 0: both
 * buildings are drawn straight from their OSM outlines, which already carry
 * the Michigan Avenue and river angles.
 *
 * Identity: two bright white glazed-terracotta blocks of the same family,
 * the south one carrying the tall clock tower (modelled on the Giralda) at
 * its river corner: square shaft, a clock on each face, a smaller arcaded
 * stage, a round colonnade, a little dome and a spire. The north addition
 * has its own small corner-turreted pavilion. Two bridges cross the plaza
 * between them. Whiteness is the identity, so the body is the whitest
 * colour in the set.
 *
 * Evidence:
 *  - plan: OSM outer ways 68831071 (north) and 1271821350 (south) and the
 *    tower part way/686197567 (12 × 12 m, turned 34°), used as drawn.
 *  - heights: tower 133.5 m to the spire (OSM; Wikipedia 425 ft to the
 *    lantern). The rest measured on Daderot's photo from the south-east and
 *    daryl_mitchell's from the south-west, scaled to that height: south
 *    building cornice ≈ 71 m; north addition cornice ≈ 69 m, its pavilion
 *    to ≈ 86 m with a finial to ≈ 90 m (OSM gives 89.6 m for the north
 *    part, which matches the finial); tower shaft to the clock stage ≈ 96 m,
 *    clock centres ≈ 101 m, clock-stage cornice ≈ 108 m, arcaded stage to
 *    ≈ 117 m, colonnade to ≈ 123 m, dome to ≈ 126 m. Expect ±3 m.
 *  - estimated: the pavilion sits at the middle of the north addition's
 *    plaza front (both photos show it near the middle of that face); the
 *    two bridges' position along the plaza (3rd and 14th floors are
 *    published; the x position is a guess near Michigan Avenue).
 *  - colour: glazed white terracotta, as bright as the palette allows.
 *
 * Photos (Wikimedia Commons): Wrigley_Building_-_Chicago,_Illinois.JPG
 * (Daderot, CC BY-SA 3.0); Wrigley_Building_1_(31887261212).jpg
 * (daryl_mitchell, CC BY-SA 2.0); The_Wrigley_Building_(52039374040).jpg
 * (Chris Rycroft, CC BY 2.0); Wrigley_Building_(51265926963).jpg (Joe Passe,
 * CC BY-SA 2.0); Wrigley_Building_(53923925274).jpg (Matthew Bellemare,
 * CC BY-SA 2.0); Wrigley_Building_(15439588237).jpg (Tony Hisgett, CC BY
 * 2.0). No commercial imagery.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const body = new Part(), roof = new Part(), win = new Part(), metal = new Part(), clock = new Part()

type XY = [number, number]
const ringAt = (pts: XY[], z: number): V3[] => pts.map(([x, y]) => [x, y, z])
const edges = (ring: XY[]) => ring.map((a, i) => [a, ring[(i + 1) % ring.length]] as [XY, XY])
const elen = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])

/** Ear-clipping cap for a simple counter-clockwise ring (convex or not). */
function capAny(p: Part, pts: XY[], z: number) {
  const idx = pts.map((_, i) => i)
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (q: XY, a: XY, b: XY, c: XY) => cr(a, b, q) > 0 && cr(b, c, q) > 0 && cr(c, a, q) > 0
  let guard = 0
  while (idx.length > 3 && guard++ < 1000) {
    for (let k = 0; k < idx.length; k++) {
      const a = pts[idx[(k - 1 + idx.length) % idx.length]], b = pts[idx[k]], c = pts[idx[(k + 1) % idx.length]]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => { const q = pts[j]; return q !== a && q !== b && q !== c && inside(q, a, b, c) })) continue
      p.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
      idx.splice(k, 1)
      break
    }
  }
  if (idx.length === 3) p.tri([...pts[idx[0]], z] as V3, [...pts[idx[1]], z] as V3, [...pts[idx[2]], z] as V3)
}
/** Offset each vertex inward along its corner bisector (fine for mild corners). */
function inset(pts: XY[], d: number): XY[] {
  const n = pts.length
  return pts.map((p, i) => {
    const a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n]
    const d1 = norm([p[0] - a[0], p[1] - a[1]]), d2 = norm([b[0] - p[0], b[1] - p[1]])
    const n1: XY = [-d1[1], d1[0]], n2: XY = [-d2[1], d2[0]] // inward for CCW
    const m = norm([n1[0] + n2[0], n1[1] + n2[1]])
    const k = d / Math.max(0.3, m[0] * n1[0] + m[1] * n1[1])
    return [p[0] + m[0] * k, p[1] + m[1] * k]
  })
}
const norm = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/** Walls, a bevelled cornice that steps out and back, and the roof. */
function building(ring: XY[], top: number) {
  body.loft([ringAt(ring, 0), ringAt(ring, top - 2.2)])
  const out = inset(ring, -0.45), back = inset(ring, 0.5)
  body.loft([ringAt(ring, top - 2.2), ringAt(out, top - 1.7), ringAt(out, top - 0.9), ringAt(ring, top - 0.6), ringAt(ring, top), ringAt(back, top + 0.3)])
  capAny(roof, back, top + 0.3)
}
function panel(p: Part, a: XY, b: XY, u0: number, u1: number, z0: number, z1: number, off = 0.05) {
  const [ux, uy] = norm([b[0] - a[0], b[1] - a[1]])
  const P = (u: number, z: number): V3 => [a[0] + ux * u + uy * off, a[1] + uy * u - ux * off, z]
  p.quad(P(u0, z0), P(u1, z0), P(u1, z1), P(u0, z1))
}
/** Window bays on every wall of a ring: a panel per bay per group of floors. */
function facade(ring: XY[], top: number, skip: (a: XY, b: XY) => boolean = () => false) {
  for (const [a, b] of edges(ring)) {
    const L = elen(a, b)
    if (L < 2.5 || skip(a, b)) continue
    // Punched windows read small against the white terracotta, so the
    // panels are narrow and the spandrels between floor groups generous.
    const bays = Math.max(1, Math.round(L / 3.3)), pitch = L / bays, w = Math.min(1.25, pitch * 0.38)
    for (let i = 0; i < bays; i++) {
      const uc = pitch * (i + 0.5)
      panel(win, a, b, uc - w / 2, uc + w / 2, 3, 8.5) // tall ground-floor openings
      for (let z = 11.5; z + 3.5 < top - 3; z += 8) panel(win, a, b, uc - w / 2, uc + w / 2, z, Math.min(z + 5.6, top - 3.5))
    }
  }
}

// ── The two buildings ────────────────────────────────────────────────────
const south: XY[] = [[20.5, -12.1], [19.5, -12.3], [17.4, -12.7], [14.6, -13.4], [2.4, -16.1], [1.4, -16.3], [0, -16.7], [-25.3, -23], [-24.6, -47.6], [-24.5, -50], [-1.6, -46.9], [1.2, -42.7], [4.9, -37.2], [6.6, -34.7], [13.5, -24.6], [21.3, -13]]
const north: XY[] = [[-11.9, 30.8], [-27, 30.5], [-25.9, -4.1], [-25.9, -6.3], [1.1, 0.1], [2.1, 0.3], [3.4, 0.7], [27.2, 6.3], [29.9, 6.9], [32.2, 7.4], [32.8, 7.6], [41.7, 30.5], [40.7, 32.5]]
// Merge near-collinear nodes so the bays run the full length of each wall.
function simplify(r: XY[]) {
  const out: XY[] = []
  r.forEach((p, i) => {
    const a = r[(i - 1 + r.length) % r.length], b = r[(i + 1) % r.length]
    const d1 = norm([p[0] - a[0], p[1] - a[1]]), d2 = norm([b[0] - p[0], b[1] - p[1]])
    if (d1[0] * d2[0] + d1[1] * d2[1] < 0.995) out.push(p)
  })
  return out
}
const S = simplify(south), N = simplify(north)
const S_TOP = 71, N_TOP = 69
building(S, S_TOP)
building(N, N_TOP)
// The tower's footprint is part of the south building's wall; skip bays where
// the tower shaft rises flush, so its own windows run on.
facade(S, S_TOP)
facade(N, N_TOP)

// ── The clock tower ──────────────────────────────────────────────────────
// OSM part: (6.6,-34.7) (13.5,-24.6) (3.6,-17.9) (-3.3,-28.0).
const TC: XY = [5.1, -26.3]
const ang = Math.atan2(10.1, 6.9) // the tower's south-east face direction
const U: XY = [Math.cos(ang), Math.sin(ang)], V: XY = [-Math.sin(ang), Math.cos(ang)]
const T = (u: number, v: number): XY => [TC[0] + U[0] * u + V[0] * v, TC[1] + U[1] * u + V[1] * v]
// (u, v) is right-handed, so this order is counter-clockwise from above.
const sqr = (h: number): XY[] => [T(-h, -h), T(h, -h), T(h, h), T(-h, h)]
function stage(h: number, z0: number, z1: number, lip = 0.4) {
  const r = sqr(h)
  body.loft([ringAt(r, z0), ringAt(r, z1 - 1.0), ringAt(sqr(h + lip), z1 - 0.6), ringAt(sqr(h + lip), z1)])
  body.cap(ringAt(sqr(h + lip), z1), true)
}
const H = 6.05
stage(H, S_TOP - 1, 95.5, 0.35)
// Corner urns where the shaft leaves the main roof.
for (const [su, sv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  const c = T(su * (H + 1.6), sv * (H + 1.6))
  const r: XY[] = [[c[0] - 0.8, c[1] - 0.8], [c[0] + 0.8, c[1] - 0.8], [c[0] + 0.8, c[1] + 0.8], [c[0] - 0.8, c[1] + 0.8]]
  body.loft([ringAt(r, S_TOP), ringAt(r, S_TOP + 3.5)])
  const rr = ringAt(r, S_TOP + 3.5)
  for (let i = 0; i < 4; i++) body.tri(rr[i], rr[(i + 1) % 4], [c[0], c[1], S_TOP + 5])
}
// Shaft windows: three bays a face, in groups of floors.
for (const [a, b] of edges(sqr(H))) {
  for (const u of [3.2, 6.05, 8.9]) for (let z = S_TOP + 1.5; z < 93; z += 6) panel(win, a, b, u - 0.5, u + 0.5, z, Math.min(z + 4.2, 94))
}
// Clock stage, a touch wider, with a clock on every face.
stage(H + 0.3, 95.5, 108, 0.5)
for (const [a, b] of edges(sqr(H + 0.3))) {
  const L = elen(a, b), [ux, uy] = norm([b[0] - a[0], b[1] - a[1]])
  const c: XY = [a[0] + ux * L / 2 + uy * 0.08, a[1] + uy * L / 2 - ux * 0.08]
  const ring = (r: number, off: number) => Array.from({ length: 16 }, (_, i): V3 => {
    const t = (i / 16) * Math.PI * 2
    return [c[0] + ux * Math.cos(t) * r + uy * off, c[1] + uy * Math.cos(t) * r - ux * off, 101 + Math.sin(t) * r]
  })
  const outer = ring(2.5, 0), inner = ring(2.0, 0.04)
  for (let i = 0; i < 16; i++) {
    const j = (i + 1) % 16
    metal.quad(outer[i], outer[j], inner[j], inner[i])
    clock.tri([c[0] + uy * 0.04, c[1] - ux * 0.04, 101], inner[i], inner[j])
  }
  for (const u of [L * 0.3, L * 0.7]) panel(win, a, b, u - 0.55, u + 0.55, 104.2, 107)
}
// Arcaded upper stage, set in, with corner urns on the clock-stage roof.
stage(3.9, 108, 116.5, 0.4)
for (const [a, b] of edges(sqr(3.9))) {
  const L = elen(a, b)
  for (const u of [L * 0.3, L * 0.5, L * 0.7]) {
    // round-headed openings: rectangle plus a half-octagon head
    const [ux, uy] = norm([b[0] - a[0], b[1] - a[1]])
    const P = (s: number, z: number): V3 => [a[0] + ux * s + uy * 0.06, a[1] + uy * s - ux * 0.06, z]
    const w = 0.5, z0 = 109.8, sp = 114.2
    const pts: V3[] = [P(u - w, z0), P(u + w, z0)]
    for (let k = 0; k <= 4; k++) { const t = (k * Math.PI) / 4; pts.push(P(u + w * Math.cos(t), sp + w * Math.sin(t))) }
    for (let i = 1; i < pts.length - 1; i++) win.tri(pts[0], pts[i], pts[i + 1])
  }
}
for (const [su, sv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  const c = T(su * 5.3, sv * 5.3)
  const r: XY[] = [[c[0] - 0.55, c[1] - 0.55], [c[0] + 0.55, c[1] - 0.55], [c[0] + 0.55, c[1] + 0.55], [c[0] - 0.55, c[1] + 0.55]]
  body.loft([ringAt(r, 108), ringAt(r, 110.5)])
  const rr = ringAt(r, 110.5)
  for (let i = 0; i < 4; i++) body.tri(rr[i], rr[(i + 1) % 4], [c[0], c[1], 112])
}
// The round colonnade, drawn as a drum ringed by slim columns over dark
// openings, then the dome and spire.
{
  const circle = (r: number, z: number, n = 14): V3[] => Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2
    return [TC[0] + r * Math.cos(t), TC[1] + r * Math.sin(t), z]
  })
  body.loft([circle(2.9, 116.5), circle(2.9, 117.3)])
  body.cap(circle(2.9, 117.3), true)
  // Recessed core (reads dark between the columns).
  win.loft([circle(1.9, 117.3), circle(1.9, 122)])
  for (let i = 0; i < 8; i++) {
    const t = (i / 8) * Math.PI * 2, x = TC[0] + 2.45 * Math.cos(t), y = TC[1] + 2.45 * Math.sin(t)
    const r: XY[] = [[x - 0.28, y - 0.28], [x + 0.28, y - 0.28], [x + 0.28, y + 0.28], [x - 0.28, y + 0.28]]
    body.loft([ringAt(r, 117.3), ringAt(r, 122)])
  }
  body.loft([circle(2.9, 122), circle(3.0, 122.6), circle(2.6, 123)])
  // Dome: a few rings, smooth enough at this size.
  const rings: V3[][] = []
  for (let k = 0; k <= 4; k++) { const a = (k / 4) * (Math.PI / 2) * 0.92; rings.push(circle(2.6 * Math.cos(a), 123 + 2.8 * Math.sin(a))) }
  body.loft(rings)
  body.cap(rings[rings.length - 1], true)
  // Lantern and spire.
  body.loft([circle(0.5, 125.5, 8), circle(0.5, 127.3, 8)])
  const top = circle(0.5, 127.3, 8)
  for (let i = 0; i < 8; i++) metal.tri(top[i], top[(i + 1) % 8], [TC[0], TC[1], 133.5])
}

// ── The north addition's pavilion ────────────────────────────────────────
{
  // Middle of the plaza front, from (-25.9,-6.3) to (32.8,7.6).
  const a: XY = [-25.9, -6.3], b: XY = [32.8, 7.6], [ux, uy] = norm([b[0] - a[0], b[1] - a[1]])
  const m: XY = [(a[0] + b[0]) / 2 + -uy * 4.4, (a[1] + b[1]) / 2 + ux * 4.4]
  const P = (u: number, v: number): XY => [m[0] + ux * u - uy * v, m[1] + uy * u + ux * v]
  const r = (h: number): XY[] => [P(-h, -h), P(h, -h), P(h, h), P(-h, h)]
  body.loft([ringAt(r(4), N_TOP), ringAt(r(4), 80), ringAt(r(4.35), 80.5), ringAt(r(4.35), 81)])
  // A low pyramid roof to the finial.
  const rr = ringAt(r(4.35), 81)
  for (let i = 0; i < 4; i++) body.tri(rr[i], rr[(i + 1) % 4], [m[0], m[1], 85.5])
  const fin: XY[] = r(0.45)
  body.loft([ringAt(fin, 84), ringAt(fin, 86.5)])
  const ft = ringAt(fin, 86.5)
  for (let i = 0; i < 4; i++) metal.tri(ft[i], ft[(i + 1) % 4], [m[0], m[1], 90])
  for (const [pa, pb] of edges(r(4))) for (const u of [2.6, 5.4]) panel(win, pa, pb, u - 0.6, u + 0.6, N_TOP + 2, 78.5)
  // Corner turrets.
  for (const [su, sv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const c = P(su * 4.3, sv * 4.3), q: XY[] = [[c[0] - 0.6, c[1] - 0.6], [c[0] + 0.6, c[1] - 0.6], [c[0] + 0.6, c[1] + 0.6], [c[0] - 0.6, c[1] + 0.6]]
    body.loft([ringAt(q, 79), ringAt(q, 83)])
    const qt = ringAt(q, 83)
    for (let i = 0; i < 4; i++) body.tri(qt[i], qt[(i + 1) % 4], [c[0], c[1], 85])
  }
}

// ── Bridges over the plaza (3rd and 14th floors) ─────────────────────────
// Bridges run square to the plaza (bearing 76.7°), from the south building's
// north wall to the north addition's south wall, near Michigan Avenue.
{
  const along = norm([32.8 - -25.9, 7.6 - -6.3]), across: XY = [-along[1], along[0]]
  const base: XY = [-25.3 + along[0] * 9, -23 + along[1] * 9]
  for (const [z0, z1] of [[10.5, 14.8], [53, 57.2]]) {
    const w = 2.2
    const p0: XY = [base[0] - across[0] * 0.5, base[1] - across[1] * 0.5]
    const p1: XY = [base[0] + across[0] * 17.6, base[1] + across[1] * 17.6]
    const r: XY[] = [
      [p0[0] - along[0] * w, p0[1] - along[1] * w], [p0[0] + along[0] * w, p0[1] + along[1] * w],
      [p1[0] + along[0] * w, p1[1] + along[1] * w], [p1[0] - along[0] * w, p1[1] - along[1] * w],
    ]
    body.loft([ringAt(r, z0), ringAt(r, z1)])
    body.cap(ringAt(r, z1), true)
    body.cap(ringAt(r, z0), false)
    edges(r).forEach(([a, b], k) => { if (k % 2 === 1) for (let u = 2; u < elen(a, b) - 2; u += 2.6) panel(win, a, b, u, u + 1.4, z0 + 1, z1 - 1) })
  }
}

const parts = [
  { part: body, material: finish('wrigley-terracotta', 0xfdf8ee) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: metal, material: { ...PALETTE.metal, color: 0x6e6a63 } },
  { part: clock, material: finish('clock-face', 0xfffbf2) },
]
const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('Wrigley Building', parts, {
  frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [41.88974, -87.624884], bearing: 0,
})
if (triangles > 5000 || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out = process.argv[2] ?? new URL('../models/chi-wrigley-building.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
