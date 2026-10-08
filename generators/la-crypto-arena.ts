/**
 * Crypto.com Arena (Staples Center, 1999, NBBJ), Los Angeles — procedural,
 * CC0-1.0. bun generators/la-crypto-arena.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The anchor is the
 * area centroid of OSM way/428021739 (building=stadium, 39.1 m), on the
 * lowest ground under it (72.0 m, USGS 3DEP; the site is flat to a metre).
 *
 * What makes it the arena: a round drum of white-silver metal panels, leaning
 * slightly out, standing on a ring of curved white walls; a roof that tips
 * down from the west to the east; the pointed "blade" that runs diagonally
 * across the roof from south-west to north-east and shoots out past the
 * drum as a prow over Star Plaza; the full-height curved glass entrance on
 * the south front, between the white walls.
 *
 * Sources:
 * - Plan: OSM way/428021739 and its part way/491696575 (46 m, the drum);
 *   LARIAC 2020 footprint 480754838193 (39.1 m). The drum is a circle of
 *   radius 69 m (from the lidar edge at eight bearings); the white ring's
 *   outer edge is read from the lidar every 15°.
 * - Heights: LA County 2006 lidar surface model, 4 m grid, over 3DEP ground.
 *   The roof is a plane falling from 42 m on the west to 30 m on the east
 *   (and 4 m from south to north), fitted to the lidar away from the blade;
 *   the blade stands 4-5 m above it, about 18 m wide at the middle, on an
 *   axis at bearing 53° through the drum's centre. The white ring is 23 m (26.5 m
 *   on the south front, from photos against the drum),
 *   the Star Plaza lobby under the prow 17 m.
 * - Photos (Wikimedia Commons): "Crypto.com arena drone shot early 2023"
 *   (InvadingInvader, CC BY-SA 4.0; the roof and blade from above),
 *   "The Staples Center sports arena 2013" (Carol M. Highsmith, public
 *   domain; the south front: drum, white walls, glass), "Staples Center
 *   from Pico Boulevard" (Cbl62, CC BY-SA 3.0), "Staples Center, LA, CA,
 *   jjron 22.03.2012" (jjron, GFDL 1.2), "Crypto.com Arena Star Plaza
 *   entrance" and "Crypto.com Arena - Star Plaza entrance" (Troutfarm27,
 *   CC BY-SA 4.0; the prow and the lobby), "Crypto.com Arena exterior 2023"
 *   (Troutfarm27, CC BY-SA 4.0).
 * - Estimated: the drum's lean, the glass front's extent (150-210° round
 *   the drum, from photos), the prow's length past the drum (22 m) and its
 *   underside.
 * - Left out: signage and the logo painted on the blade, the solar
 *   panels' rows (drawn as a few broad blocks), the marquees, canopies,
 *   balconies and stairs of the Star Plaza front.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const white = new Part(), drum = new Part(), roof = new Part(), blade = new Part(), glass = new Part(), solar = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
function quad(p: Part, P: V3[], hint: V3, ns?: V3[]) {
  const f = add(cross(sub(P[1], P[0]), sub(P[2], P[0])), cross(sub(P[2], P[0]), sub(P[3], P[0])))
  const ord = dot(f, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const n = ns?.map(unit)
  const t = (a: number, b: number, c: number) => {
    const A = P[ord[a]], B = P[ord[b]], C = P[ord[c]]
    if (Math.hypot(...cross(sub(B, A), sub(C, A))) < 1e-9) return
    p.tri(A, B, C, undefined, undefined, undefined, n && [n[ord[a]], n[ord[b]], n[ord[c]]])
  }
  t(0, 1, 2)
  t(0, 2, 3)
}
function tri(p: Part, A: V3, B: V3, C: V3, hint: V3) {
  if (dot(cross(sub(B, A), sub(C, A)), hint) >= 0) p.tri(A, B, C)
  else p.tri(A, C, B)
}

// Survey coordinates are local metres about (-118.26713, 34.04300); the
// model's origin is the OSM centroid, 4.55 m east and 9.26 m north of it.
const O: XY = [4.55, 9.26]
const P = (x: number, y: number, z: number): V3 => [x - O[0], y - O[1], z]

const CX = 0, CY = 6, R = 69 // drum, in survey coordinates
const roofZ = (x: number, y: number) => 36.5 - 0.095 * x - 0.04 * y
const SEG = 48
const ang = (i: number) => (i / SEG) * 2 * Math.PI // clockwise from north
const dir = (a: number): XY => [Math.sin(a), Math.cos(a)]

// Outer edge of the white ring (lidar, every 15° clockwise from north).
const RING = [78, 80, 84, 88, 0, 0, 0, 86, 86, 78, 84, 84, 80, 80, 74, 68, 0, 70, 74, 70, 76, 78, 80, 82]
const ringR = (a: number) => {
  const f = (((a * 180) / Math.PI) % 360) / 15, i = Math.floor(f), t = f - i
  const r0 = RING[i % 24], r1 = RING[(i + 1) % 24]
  if (!r0 || !r1) return 0
  return r0 + (r1 - r0) * t
}
const RING_H = 23
// The south front, its glass and the white slabs beside it, stand taller.
const ringH = (a: number) => { const d = (a * 180) / Math.PI; return d > 135 && d < 225 ? 26.5 : RING_H }
const isGlassFront = (a: number) => { const d = (a * 180) / Math.PI; return d > 152 && d < 208 }
const isLobby = (a: number) => { const d = (a * 180) / Math.PI; return d > 40 && d < 112 }
const LOBBY_R = (a: number) => { const d = (a * 180) / Math.PI; return d < 52 ? 88 : d > 100 ? 86 : 97 }

// ---------------------------------------------------------------------------
// The drum: from the ring's roof to the roof edge, leaning out 2 m, with a
// rounded shoulder into the roof. Smooth round the circle.
const R0 = R - 2.2, SH = 6 // the shoulder: a quarter round 6 m across and 6 m down
const SHN = 3
for (let i = 0; i < SEG; i++) {
  const a0 = ang(i), a1 = ang(i + 1)
  const [s0, c0] = dir(a0), [s1, c1] = dir(a1)
  const pt = (s: number, c: number, r: number, z: number): V3 => P(CX + s * r, CY + c * r, z)
  const top = (s: number, c: number) => roofZ(CX + s * R, CY + c * R)
  const n0: V3 = [s0, c0, 0.03], n1: V3 = [s1, c1, 0.03]
  quad(drum, [pt(s0, c0, R0, 0), pt(s1, c1, R0, 0), pt(s1, c1, R, top(s1, c1) - SH), pt(s0, c0, R, top(s0, c0) - SH)], [s0 + s1, c0 + c1, 0], [n0, n1, n1, n0])
  // rounded shoulder into the roof
  for (let j = 0; j < SHN; j++) {
    const b0 = (j / SHN) * (Math.PI / 2), b1 = ((j + 1) / SHN) * (Math.PI / 2)
    const sp = (s: number, c: number, b: number): V3 => pt(s, c, R - SH + SH * Math.cos(b), top(s, c) - SH + SH * Math.sin(b))
    const nn = (s: number, c: number, b: number): V3 => [s * Math.cos(b), c * Math.cos(b), Math.sin(b)]
    quad(drum, [sp(s0, c0, b0), sp(s1, c1, b0), sp(s1, c1, b1), sp(s0, c0, b1)], [s0 + s1, c0 + c1, 1], [nn(s0, c0, b0), nn(s1, c1, b0), nn(s1, c1, b1), nn(s0, c0, b1)])
  }
  // roof: a fan to the centre, on the plane
  tri(roof, pt(s0, c0, R - SH, top(s0, c0)), pt(s1, c1, R - SH, top(s1, c1)), P(CX, CY, roofZ(CX, CY)), [0, 0, 1])
}

// ---------------------------------------------------------------------------
// The white ring: curved walls with a flat roof, round the drum except on the
// west, where the drum comes down to the street; the south front is glass,
// and the lobby under the prow on Star Plaza is glass too, lower.
for (let i = 0; i < SEG; i++) {
  const a0 = ang(i), a1 = ang(i + 1), am = (a0 + a1) / 2
  let r0 = ringR(a0), r1 = ringR(a1), h = ringH(am), part = white
  if (isLobby(am)) { r0 = LOBBY_R(a0); r1 = LOBBY_R(a1); h = 17; part = glass }
  if (r0 < R + 2 || r1 < R + 2) continue
  const [s0, c0] = dir(a0), [s1, c1] = dir(a1)
  const pt = (s: number, c: number, r: number, z: number): V3 => P(CX + s * r, CY + c * r, z)
  const out: V3 = [Math.sin(am), Math.cos(am), 0]
  const n0: V3 = [s0, c0, 0], n1: V3 = [s1, c1, 0]
  if (isGlassFront(am)) {
    // full-height glass between a white plinth band and a white head
    quad(white, [pt(s0, c0, r0, 0), pt(s1, c1, r1, 0), pt(s1, c1, r1, 1.5), pt(s0, c0, r0, 1.5)], out, [n0, n1, n1, n0])
    quad(glass, [pt(s0, c0, r0, 1.5), pt(s1, c1, r1, 1.5), pt(s1, c1, r1, h - 3), pt(s0, c0, r0, h - 3)], out, [n0, n1, n1, n0])
    quad(white, [pt(s0, c0, r0, h - 3), pt(s1, c1, r1, h - 3), pt(s1, c1, r1, h - 0.5), pt(s0, c0, r0, h - 0.5)], out, [n0, n1, n1, n0])
    // a few pale mullion and floor lines on the curtain wall
    const M = (u: number, z: number, d = 0.06): V3 => {
      const s = s0 + (s1 - s0) * u, c = c0 + (c1 - c0) * u, r = r0 + (r1 - r0) * u
      return pt(s, c, r + d, z)
    }
    quad(white, [M(0.46, 1.5), M(0.54, 1.5), M(0.54, h - 3), M(0.46, h - 3)], out)
    for (const z of [8.5, 16]) quad(white, [M(0, z), M(1, z), M(1, z + 0.45), M(0, z + 0.45)], out)
  } else if (part === glass) {
    // Star Plaza lobby: two glazed floors between white slabs, under a white fascia
    const bands: [Part, number, number][] = [[glass, 0, 6.5], [white, 6.5, 7.6], [glass, 7.6, 14], [white, 14, h - 0.5]]
    for (const [pp, z0, z1] of bands) quad(pp, [pt(s0, c0, r0, z0), pt(s1, c1, r1, z0), pt(s1, c1, r1, z1), pt(s0, c0, r0, z1)], out, [n0, n1, n1, n0])
  } else {
    quad(part, [pt(s0, c0, r0, 0), pt(s1, c1, r1, 0), pt(s1, c1, r1, h - 0.5), pt(s0, c0, r0, h - 0.5)], out, [n0, n1, n1, n0])
  }
  const cap = part === glass ? white : white
  quad(cap, [pt(s0, c0, r0, h - 0.5), pt(s1, c1, r1, h - 0.5), pt(s1, c1, r1 - 0.5, h), pt(s0, c0, r0 - 0.5, h)], add(out, [0, 0, 1]))
  quad(roof, [pt(s0, c0, r0 - 0.5, h), pt(s1, c1, r1 - 0.5, h), pt(s1, c1, R0 + 0.5, h), pt(s0, c0, R0 + 0.5, h)], [0, 0, 1])
  // ends where the ring stops
  const prevA = ang(i - 1), nextA = ang(i + 2)
  const stop = (a: number) => ringR(a) < R + 2 && !isLobby(a)
  const sideKind = (aa: number) => (isLobby(aa) ? 'lobby' : 'ring')
  for (const [edge, other, s, c, r] of [[a0, prevA, s0, c0, r0], [a1, nextA, s1, c1, r1]] as [number, number, number, number, number][]) {
    const neighbourMid = (edge + other) / 2
    const differs = stop(neighbourMid) || sideKind(neighbourMid) !== sideKind(am) || ringR(other) < R + 2 || ringH(neighbourMid) !== h
    if (!differs) continue
    const hOther = isLobby(neighbourMid) && !isLobby(am) ? 17 : stop(neighbourMid) ? 0 : ringH(neighbourMid)
    if (hOther >= h) continue
    const t: V3 = [Math.cos(edge), -Math.sin(edge), 0]
    const face = other > edge ? t : mul(t, -1)
    quad(white, [pt(s, c, R0, hOther), pt(s, c, r, hOther), pt(s, c, r, h), pt(s, c, R0, h)], face)
  }
}

// ---------------------------------------------------------------------------
// The blade: a pointed lens across the roof, 4.5 m proud of it, on an axis
// at bearing 53° through the drum's centre, running out 22 m past the drum
// on the north-east as a prow over Star Plaza.
{
  const d: XY = [Math.sin((53 * Math.PI) / 180), Math.cos((53 * Math.PI) / 180)]
  const n: XY = [-d[1], d[0]]
  const T0 = -71, T1 = R + 22, TC = (T0 + T1) / 2, HALF = (T1 - T0) / 2, W = 9.5, UP = 4.5
  const K = 16
  const at = (t: number, s: number): XY => [CX + d[0] * t + n[0] * s, CY + d[1] * t + n[1] * s]
  const w = (t: number) => W * Math.max(0, 1 - ((t - TC) / HALF) ** 2)
  // Height of the blade's top: the roof plane plus UP; past the drum it
  // holds the roof-edge height and the underside slopes up to the tip.
  const topZ = (t: number) => {
    const tt = Math.min(t, R - 1)
    const [x, y] = at(tt, 0)
    return roofZ(x, y) + UP
  }
  const botZ = (t: number) => {
    if (t <= R - 2) { const [x, y] = at(t, 0); return roofZ(x, y) - 0.5 }
    const [x, y] = at(R - 2, 0)
    const z0 = roofZ(x, y) - 6
    return z0 + ((t - (R - 2)) / (T1 - (R - 2))) * (topZ(T1) - 0.6 - z0)
  }
  const ts = Array.from({ length: K + 1 }, (_, k) => T0 + ((T1 - T0) * k) / K)
  if (!ts.includes(R - 2)) { ts.push(R - 2); ts.sort((a, b) => a - b) }
  for (let k = 0; k < ts.length - 1; k++) {
    const ta = ts[k], tb = ts[k + 1]
    const L = (t: number, s: number, z: number): V3 => { const [x, y] = at(t, s); return P(x, y, z) }
    quad(blade, [L(ta, -w(ta), topZ(ta)), L(tb, -w(tb), topZ(tb)), L(tb, w(tb), topZ(tb)), L(ta, w(ta), topZ(ta))], [0, 0, 1])
    for (const sg of [-1, 1]) {
      quad(blade, [L(ta, sg * w(ta), botZ(ta)), L(tb, sg * w(tb), botZ(tb)), L(tb, sg * w(tb), topZ(tb)), L(ta, sg * w(ta), topZ(ta))], [n[0] * sg, n[1] * sg, 0])
    }
    if (ta >= R - 2.01) quad(blade, [L(ta, -w(ta), botZ(ta)), L(tb, -w(tb), botZ(tb)), L(tb, w(tb), botZ(tb)), L(ta, w(ta), botZ(ta))], [0, 0, -1])
  }
}

// ---------------------------------------------------------------------------
// The roof's solar arrays (2023 drone photo): broad dark blocks in a band
// out towards the edge either side of the blade, the middle left white. A few
// big panels, not their rows.
{
  const d: XY = [Math.sin((53 * Math.PI) / 180), Math.cos((53 * Math.PI) / 180)]
  const n: XY = [-d[1], d[0]]
  const RMAX = R - 8
  for (const [s0, s1] of [[34, 50], [-50, -34]]) {
    const sm = Math.max(Math.abs(s0), Math.abs(s1))
    const half = Math.sqrt(Math.max(0, RMAX * RMAX - sm * sm))
    const blocks = 3, gap = 4
    const len = (2 * half - gap * (blocks - 1)) / blocks
    for (let b = 0; b < blocks; b++) {
      const t0 = -half + b * (len + gap), t1 = t0 + len
      const Q = (t: number, sv: number): V3 => {
        const x = CX + d[0] * t + n[0] * sv, y = CY + d[1] * t + n[1] * sv
        return P(x, y, roofZ(x, y) + 0.3)
      }
      quad(solar, [Q(t0, s0), Q(t1, s0), Q(t1, s1), Q(t0, s1)], [0, 0, 1])
    }
  }
}

// ---------------------------------------------------------------------------
// Shared palette: white walls are `trim`; the drum's metal panels and the
// roof's membrane read white-silver in daylight photos, as pale finishes
// (cool, to set them off from the warm trim); the solar arrays a dark slate
// and the blade the arena's teal, both pulled to palette lightness; the
// glass `window`.
const parts = [
  { part: white, material: PALETTE.trim },
  { part: drum, material: finish('arena-panel-silver', 0xe0e3e6) },
  { part: roof, material: finish('arena-roof', 0xeceef0) },
  { part: blade, material: finish('arena-blade-teal', 0x5f8193) },
  { part: solar, material: finish('arena-solar', 0x5a6672) },
  { part: glass, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Crypto.com Arena', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 0, osm: 'way/428021739',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/la-crypto-arena.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
