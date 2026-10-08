/**
 * Wilshire Grand Center (2017, AC Martin), Los Angeles — original procedural
 * geometry, CC0-1.0.
 * bun generators/la-wilshire-grand.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the centroid of the
 * block outline (way/496246723) on the lowest ground under it (7th and
 * Figueroa). Placed at bearing 37.2°, so +x runs south-east along Wilshire
 * Boulevard and +y points north-east, across it.
 *
 * The tower is a lens in plan: two long glass faces bowing out, ends cut
 * flat, 59 m long at the base, 15 m across the ends and 23 m across the middle,
 * narrowing to about 45 m long under the sail. Its top is the sail: the long faces
 * rise in a curve from the north-west end to the south-east end, where the
 * spire stands; the sail is glazed, roof and all, so it reads from above
 * against the podium's roof. The podium fills the
 * rest of the block, a glass box cut back at the 7th and Figueroa plaza.
 *
 * Sources:
 * - Plan: OSM. The block outline is way/496246723. OSM part way/1307580959
 *   (73 levels, 245 m) traces the south-west half of the tower: its straight
 *   north-east edge is the axis, its curved edge the south-west face. The
 *   north-east face is mirrored from it. Spire node way/901739648.
 * - Heights: LA County LARIAC 2020 lidar footprint 201700195459, max 286.0 m
 *   (roof elevation 370.1 m; 3DEP ground at 7th and Figueroa 86.5 m, so
 *   283.6 m over the lowest ground) is the sail's high, south-east end.
 *   Published roof 928 ft (282.9 m), architectural top 335.3 m with a
 *   294 ft (90 m) spire (Wikipedia, CTBUH). The sail's north-west end
 *   (≈ 258 m), the taper (the length under the sail ≈ 0.78 of that over
 *   the podium, measured on w1) and the podium height (32 m)
 *   are estimated from photos w1, w4 and w17; lidar has one footprint for
 *   the whole block.
 * - Photos (Wikimedia Commons): w1 "Wilshire Grand Center, Los Angeles (July
 *   2022) from Aven…" (Benoît Prieur, CC BY-SA 4.0, broad south-west face,
 *   telephoto); w4 "Wilshire Grand.jpg" (Fredchang931124, CC BY-SA 4.0, from
 *   the west); w17 "Wilshire Grand office tower June 2017" (Downtowngal,
 *   CC BY-SA 4.0, north-west end); w10 "Wilshire Grand Center from Olive
 *   Sreet (July 2022)" (Benoît Prieur, CC0, from the east); w9 "Wilshire
 *   Grand Center under construction"/"Wilshire Grand - February 2024"
 *   (Missvain, CC BY 4.0, bowed face from below).
 *
 * Left out: the LED signs, the white chevron outrigger trusses (w4 shows
 * one over the podium; as plain bands they read as stripes), the spire's
 * lattice.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]

const frame = new Part(), glassWall = new Part(), crown = new Part(), roofs = new Part()

const BEARING = 37.2

// ---------- the tower ----------
const CX = 39.6, CY = 27.5          // tower centre in the block frame
const A0 = 29.3, A1 = 21.5          // half-length at the ground and at the sail top
const END0 = 7.3, MID0 = 11.7       // half-width at the ends and at the middle
const NARROW = 0.88                 // half-widths at the top, as a fraction
const Z_SAIL_LO = 258, Z_SAIL_HI = 283.6, CROWN = 13
const PODIUM = 32
const SEG_LONG = 8, SEG_END = 2, CHAMFER = 1.4

const sailTop = (u: number) => {
  // u from -1 (north-west end) to 1 (south-east end): a rising arc
  const t = (u + 1) / 2
  return Z_SAIL_LO + (Z_SAIL_HI - Z_SAIL_LO) * Math.sin((t * Math.PI) / 2)
}

/** The tower's plan at height z, counter-clockwise from the south-east end. */
function plan(z: number): { p: XY; u: number; face: 'long' | 'end' }[] {
  const k = Math.min(1, z / Z_SAIL_HI)
  const a = A0 + (A1 - A0) * k, s = 1 + (NARROW - 1) * k
  const e = END0 * s, m = MID0 * s
  const half = (x: number) => m - (m - e) * (x / a) ** 2
  const out: { p: XY; u: number; face: 'long' | 'end' }[] = []
  const xa = a - CHAMFER
  // south-east end, from the south-west corner to the north-east corner
  for (let i = 0; i <= SEG_END; i++) {
    const w = e - CHAMFER
    out.push({ p: [a, -w + (2 * w * i) / SEG_END], u: 1, face: 'end' })
  }
  // north-east face, south-east to north-west
  for (let i = 0; i <= SEG_LONG; i++) {
    const x = xa - (2 * xa * i) / SEG_LONG
    out.push({ p: [x, half(x)], u: x / a, face: 'long' })
  }
  for (let i = 0; i <= SEG_END; i++) {
    const w = e - CHAMFER
    out.push({ p: [-a, w - (2 * w * i) / SEG_END], u: -1, face: 'end' })
  }
  for (let i = 0; i <= SEG_LONG; i++) {
    const x = -xa + (2 * xa * i) / SEG_LONG
    out.push({ p: [x, -half(x)], u: x / a, face: 'long' })
  }
  return out.map((o) => ({ ...o, p: [o.p[0] + CX, o.p[1] + CY] as XY }))
}

const at = (p: XY, z: number): V3 => [p[0], p[1], z]
const lerp2 = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const outward = (a: XY, b: XY): XY => {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1])
  return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l]
}

// Window panels: one per facet, four floors (≈ 15.6 m) tall on the long
// faces; the ends, banded white by their balcony fins, take two floors with
// deeper spandrels.
const FLOOR = 3.9

{
  const base = plan(0), n = base.length
  const tops = base.map((v) => sailTop(v.u))
  const ringAt = (z: number) => plan(z).map((v) => v.p)
  // Walls: frame to the crown, glass crown above. Lofted from the ground
  // ring to each vertex's own top, so the taper is one straight run.
  // The crown leans in on the long faces, so from either end the top
  // narrows to a blade round the spire (photos w10, w17).
  const BLADE = 0.55
  const topRing = base.map((_, i) => {
    const p = ringAt(tops[i])[i]
    return [p[0], CY + (p[1] - CY) * BLADE] as XY
  })
  const crownRing = base.map((_, i) => ringAt(tops[i] - CROWN)[i])
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    frame.quad(at(base[i].p, 0), at(base[j].p, 0), at(crownRing[j], tops[j] - CROWN), at(crownRing[i], tops[i] - CROWN))
    crown.quad(at(crownRing[i], tops[i] - CROWN), at(crownRing[j], tops[j] - CROWN), at(topRing[j], tops[j]), at(topRing[i], tops[i]))
    // panels
    const end = base[i].face === 'end' && base[j].face === 'end'
    const group = end ? 2 * FLOOR : 4 * FLOOR, spandrel = end ? 2.6 : 1.1, pier = end ? 1.2 : 0.6
    const zTop = Math.min(tops[i], tops[j]) - CROWN - 1
    for (let g = 0; ; g++) {
      const lo = PODIUM + g * group + spandrel / 2, hi = PODIUM + (g + 1) * group - spandrel / 2
      if (hi > zTop) break
      const rl = ringAt(lo), rh = ringAt(hi)
      const L = Math.hypot(rl[j][0] - rl[i][0], rl[j][1] - rl[i][1])
      if (L < pier + 1) continue
      const t0 = pier / 2 / L, t1 = 1 - t0
      const o = outward(rl[i], rl[j]), off = (p: XY): XY => [p[0] + o[0] * 0.05, p[1] + o[1] * 0.05]
      glassWall.quad(
        at(off(lerp2(rl[i], rl[j], t0)), lo), at(off(lerp2(rl[i], rl[j], t1)), lo),
        at(off(lerp2(rh[i], rh[j], t1)), hi), at(off(lerp2(rh[i], rh[j], t0)), hi),
      )
    }
  }
  // The sail's roof: a low ridge along the axis, rising with the sail.
  const RIDGE = 2
  const ne = base.map((v, i) => i).filter((i) => base[i].face === 'long' && base[i].p[1] > CY)
  const sw = base.map((v, i) => i).filter((i) => base[i].face === 'long' && base[i].p[1] < CY)
  // ne runs south-east → north-west; sw runs north-west → south-east
  const ridge = ne.map((i) => {
    const p = topRing[i]
    return [p[0], CY, tops[i] + RIDGE] as V3
  })
  for (let k = 0; k < ne.length - 1; k++) {
    const a = ne[k], b = ne[k + 1]
    crown.quad(at(topRing[a], tops[a]), at(topRing[b], tops[b]), ridge[k + 1], ridge[k])
  }
  for (let k = 0; k < sw.length - 1; k++) {
    const a = sw[k], b = sw[k + 1]
    const ra = ridge[ne.length - 1 - k], rb = ridge[ne.length - 2 - k]
    crown.quad(at(topRing[a], tops[a]), at(topRing[b], tops[b]), rb, ra)
  }
  // hipped ends: fan from each ridge end over the end vertices
  const fan = (apex: V3, idx: number[]) => {
    for (let k = 0; k < idx.length - 1; k++) crown.tri(at(topRing[idx[k]], tops[idx[k]]), at(topRing[idx[k + 1]], tops[idx[k + 1]]), apex)
  }
  const seEnd = [sw[sw.length - 1], ...base.map((v, i) => i).filter((i) => base[i].face === 'end' && base[i].u === 1), ne[0]]
  const nwEnd = [ne[ne.length - 1], ...base.map((v, i) => i).filter((i) => base[i].face === 'end' && base[i].u === -1), sw[0]]
  fan(ridge[0], seEnd)
  fan(ridge[ridge.length - 1], nwEnd)

  // The spire: a slim tapered mast at the south-east end, from inside the
  // sail to 335.3 m.
  const sp = ringAt(250)[0]
  const sx = sp[0] - 3.5, sy = CY
  const ring = (r: number, z: number): V3[] => [[sx - r, sy - r, z], [sx + r, sy - r, z], [sx + r, sy + r, z], [sx - r, sy + r, z]]
  const r0 = ring(1.8, 250), r1 = ring(0.35, 335.3)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    frame.quad(r0[i], r0[j], r1[j], r1[i])
  }
  frame.tri(r1[0], r1[1], r1[2])
  frame.tri(r1[0], r1[2], r1[3])
}

// ---------- the podium ----------
// The block outline, in this frame (OSM way/496246723), less the tower's
// own protrusion at the south-east end.
const PODIUM_RING: XY[] = [
  [-47.0, -56.4], [-4.3, -44.8], [49.0, -30.4], [45.0, -20.6], [38.3, -13.0], [31.5, -9.3], [32.3, 0.7],
  [32.8, 6.4], [47.2, 6.3], [64.5, 8.3], [62.6, 20.1], [62.0, 27.4], [62.4, 40.6], [10.9, 40.4],
  [-47.2, 40.5], [-47.0, -30.5],
]

function signedArea(r: XY[]) {
  let s = 0
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    s += a[0] * b[1] - b[0] * a[1]
  }
  return s / 2
}

/** Ear-clipping triangulation of a simple polygon, counter-clockwise. */
function triangulate(r: XY[]): [XY, XY, XY][] {
  const pts = [...r]
  const out: [XY, XY, XY][] = []
  const cross = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cross(a, b, p) > 0 && cross(b, c, p) > 0 && cross(c, a, p) > 0
  let guard = 0
  while (pts.length > 3 && guard++ < 1000) {
    for (let i = 0; i < pts.length; i++) {
      const a = pts[(i + pts.length - 1) % pts.length], b = pts[i], c = pts[(i + 1) % pts.length]
      if (cross(a, b, c) <= 0) continue
      if (pts.some((p) => p !== a && p !== b && p !== c && inside(p, a, b, c))) continue
      out.push([a, b, c])
      pts.splice(i, 1)
      break
    }
  }
  out.push([pts[0], pts[1], pts[2]])
  return out
}

{
  const ring = signedArea(PODIUM_RING) > 0 ? PODIUM_RING : [...PODIUM_RING].reverse()
  const n = ring.length
  const LIP = 3
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    frame.quad(at(a, 0), at(b, 0), at(b, PODIUM), at(a, PODIUM))
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4) continue
    // glass box: storey-pair panels between slim piers, bays about 8 m
    const bays = Math.max(1, Math.round(L / 8)), o = outward(a, b)
    const off = (p: XY): XY => [p[0] + o[0] * 0.05, p[1] + o[1] * 0.05]
    for (let k = 0; k < bays; k++) {
      const p = off(lerp2(a, b, (k + 0.06) / bays)), q = off(lerp2(a, b, (k + 0.94) / bays))
      for (const [lo, hi] of [[1, 9.5], [11, 19.5], [21, PODIUM - LIP]] as [number, number][])
        glassWall.quad(at(p, lo), at(q, lo), at(q, hi), at(p, hi))
    }
  }
  for (const [a, b, c] of triangulate(ring)) roofs.tri(at(a, PODIUM), at(b, PODIUM), at(c, PODIUM))
}

// ---------- write ----------
const parts = [
  // silver mullions and spandrels; light, sky-blue reflective glass
  { part: frame, material: finish('wg-silver', 0xe3e7e9) },
  { part: glassWall, material: windowVariant(2, 0x93b2cc) },
  { part: crown, material: PALETTE.glass },
  { part: roofs, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Wilshire Grand Center', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, height: 335.3,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/496246723', 'way/1307580959', 'way/901739648'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/la-wilshire-grand.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
