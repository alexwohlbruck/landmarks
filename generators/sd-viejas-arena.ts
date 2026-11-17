/**
 * Viejas Arena (ex-Cox Arena), San Diego State University: the 12,400-seat
 * basketball arena opened in 1997, built down into the old Aztec Bowl. A
 * round cream drum with a faint panel grid and a row of small red squares,
 * under a nearly flat white roof; round it, at plaza level, a ring of tan
 * split-face block piers with red gates between them under a white eave and a
 * block parapet; red arched canopies with the oval VIEJAS sign over the south
 * (main) and north entrances; on the north, where the bowl falls away to the
 * loading yard, two storeys of cream wall with small red-framed windows below
 * the concrete terrace. Original procedural geometry, CC0-1.0.
 *   bun generators/sd-viejas-arena.ts
 *
 * Style note: the lead's note expected "a scalloped/tiered roof and
 * Spanish-style detailing matching SDSU's Mission Revival campus". The photos
 * show neither: the roof is a smooth, nearly flat white membrane (NAIP) and
 * the walls are plain modern cream panels and tan block, with SDSU-red trim.
 * The model follows the photos.
 *
 * Frame: bearing 0 (the plan is close to round; its long axis runs east-west).
 * x east, y north, z up, metres, origin at the lead's anchor -117.07454,
 * 32.77381. y = 0 is the loading yard north of the arena (lidar ground_min,
 * 117.5 m NAVD88; the map's terrain agrees, 117.57 m), the lowest ground the
 * building touches. The plaza round the arena on the other three sides is at
 * 15.6 m, measured in both the lidar and the map terrain. Elevation 0.
 *
 * Evidence
 * - OSM way/31248345 (building=yes, "Viejas Arena", note "site of former Aztec
 *   Bowl"): the outline, x -60.7..60.8, y -54.6..55.3.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014; the arena is 1997), 1 m
 *   grid (~/landmarks-scratch/sd/work/sd-viejas-arena/lidar.json), measured
 *   above ground_min: plaza 15.6; drum parapet 26.3-26.5 on an ellipse of
 *   semi-axes 55 (E-W) x 47 (N-S) about (0.5, 1.5); roof 24.2 at the parapet
 *   rising to 27.5 at the centre (a 3.3 m camber); the outer ring of piers
 *   and eaves 19.5-21.9 out to the outline; the sign arches to 26.5 over the
 *   south and north entrances.
 * - USGS NAIP (2022): the white roof with four small skylights, the grey ring
 *   of lower roofs and the plaza.
 * - Map terrain (Mapterhorn): flat at 15.6 across the site, falling to 0 in
 *   the loading yard and the old bowl to the north.
 * - Published (Wikipedia "Viejas Arena"): opened 1997, capacity 12,414, built
 *   on the site of the Aztec Bowl.
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   "USA CA SanDiego SDSU 001 2013 - Viejas Arena.jpg" (Der-wuppertaler,
 *     CC BY-SA 3.0): south front face-on, drum, ring, entrance canopy, sign;
 *   "Cox arena front.JPG" (CC BY-SA 3.0, uploader unnamed): the same front,
 *     2000s;
 *   "Welcome to Viejas Arena - 4 Apr 2024.jpg" (Kire1975, CC0): the drum's
 *     panels and red squares, the block piers, red gates, white eave;
 *   "Viejas Arena located in the Aztec Bowl.jpg" (LeeZee, public domain):
 *     the north side, the terrace fascia, the cream lower wall, windows,
 *     balcony and loading door, and the old bowl's stands beside it;
 *   "Viejas Arena Loading Area - Nicki Minaj Tour, September 27, 2024.jpg"
 *     (Kire1975, CC0): the north side at night (lit sign, lit drum).
 *
 * The VIEJAS sign is a plain lit oval (`entrance`, glows at night); its
 * lettering is left off.
 *
 * Estimated: the drum colour (cream, from the 2013 and 2024 photos), the
 * pier spacing (about 9 m), the eave depth, the sign's size, the window
 * rhythm on the north wall. The east and west sides have no close photo;
 * they repeat the south ring. The old Aztec Bowl stands to the north-west are
 * not part of the building and are left to the map.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, report, writeGlb, type XY } from './sf-de-young'
import { panel } from './sf-opera-house'

const cream = new Part(), block = new Part(), red = new Part(), white = new Part(), win = new Part(), signFace = new Part()

const PLAZA = 15.6
const C: XY = [0.5, 1.5]
const N = 48
/** A superellipse ring (counter-clockwise), semi-axes a, b, exponent p. */
const ring = (a: number, b: number, p = 2.3, c: XY = C): XY[] =>
  Array.from({ length: N }, (_, i) => {
    const t = (2 * Math.PI * i) / N, ct = Math.cos(t), st = Math.sin(t)
    return [c[0] + a * Math.sign(ct) * Math.abs(ct) ** (2 / p), c[1] + b * Math.sign(st) * Math.abs(st) ** (2 / p)] as XY
  })
const at = (r: XY[], z: number): V3[] => r.map(([x, y]) => [x, y, z])
/** Outward walls between two heights (rings may differ: a tapered wall). */
function wall(p: Part, r0: XY[], z0: number, z1: number, r1 = r0, skip?: (i: number) => boolean) {
  const A = at(r0, z0), B = at(r1, z1)
  for (let i = 0; i < N; i++) {
    if (skip?.(i)) continue
    const j = (i + 1) % N
    p.quad(A[i], A[j], B[j], B[i])
  }
}
/** A flat annulus between an inner and outer ring, facing up. */
function annulus(p: Part, inner: XY[], outer: XY[], z: number, zi = z, down = false) {
  const I = at(inner, zi), O = at(outer, z)
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    if (down) p.quad(I[i], I[j], O[j], O[i])
    else p.quad(I[i], O[i], O[j], I[j])
  }
}
const midOf = (r: XY[], i: number): XY => { const j = (i + 1) % N; return [(r[i][0] + r[j][0]) / 2, (r[i][1] + r[j][1]) / 2] }
const outN = (r: XY[], i: number): XY => { const j = (i + 1) % N; const d: XY = [r[j][0] - r[i][0], r[j][1] - r[i][1]], l = Math.hypot(d[0], d[1]); return [d[1] / l, -d[0] / l] }

// ---------------------------------------------------------------------------
// The base: from the loading yard (y = 0) up to the plaza, on the outline. Only
// the north side shows; the rest is under the plaza.
const BASE = ring(60.3, 54.6, 2.2, [0, 0.3])
wall(cream, BASE, 0, PLAZA - 0.15)
annulus(block, ring(57, 50.5, 2.3), BASE, PLAZA - 0.15)
// north wall: two storeys of small red-framed windows, the central balcony,
// a concrete band at the terrace edge
for (let i = 0; i < N; i++) {
  const m = midOf(BASE, i), n = outN(BASE, i)
  if (n[1] < 0.35) continue
  const j = (i + 1) % N, u: XY = [BASE[j][0] - BASE[i][0], BASE[j][1] - BASE[i][1]], l = Math.hypot(u[0], u[1])
  const e: XY = [u[0] / l, u[1] / l]
  for (const z of [4.2, 9.2]) panel(win, [m[0] - e[0] * 1.1, m[1] - e[1] * 1.1], [m[0] + e[0] * 1.1, m[1] + e[1] * 1.1], n, z, z + 1.9, 0.06)
  panel(white, BASE[i], BASE[j], n, PLAZA - 2.4, PLAZA - 0.15, 0.08)
}
box(white, [0, 55.6, 7.6], 11, 1.4, 0.5) // the balcony
panel(win, [-9, 54.95], [9, 54.95], [0, 1], 8.2, 10.6, 0.06)
panel(red, [-28, 50.6], [-22, 51.8], [0, 1], 0, 4.6, 0.3) // loading doors

// ---------------------------------------------------------------------------
// The plaza ring: block piers with red gates between, a white eave, a block
// parapet, flat grey roofs back to the drum.
const RING = ring(57, 50.5, 2.3)
const GATE = ring(55.6, 49.1, 2.3)
const DRUM = ring(55, 47, 2.3)
const EAVE0 = PLAZA + 3.0, EAVE1 = PLAZA + 3.7, PAR = PLAZA + 6.2
wall(red, GATE, PLAZA, EAVE0) // the gates, set back
annulus(white, GATE, RING, EAVE0, EAVE0, true) // the eave's soffit
wall(white, RING, EAVE0, EAVE1)
wall(block, RING, EAVE1, PAR)
annulus(block, ring(55.9, 49.4, 2.3), RING, PAR)
// inner face of the parapet and the low ring roof inside it
{
  const I = at(ring(55.9, 49.4, 2.3), PAR), Ib = at(ring(55.9, 49.4, 2.3), PAR - 1.2)
  for (let i = 0; i < N; i++) { const j = (i + 1) % N; block.quad(I[i], I[j], Ib[j], Ib[i]) }
  annulus(block, DRUM, ring(55.9, 49.4, 2.3), PAR - 1.2)
}
// piers: every second segment, from plaza to the eave
for (let i = 0; i < N; i += 2) {
  const m = midOf(RING, i), n = outN(RING, i)
  const c: XY = [m[0] - n[0] * 0.6, m[1] - n[1] * 0.6]
  box(block, [c[0], c[1], PLAZA + EAVE0 / 2 - PLAZA / 2], 0.9, 0.9, (EAVE0 - PLAZA) / 2, Math.atan2(n[1], n[0]), null)
}

// ---------------------------------------------------------------------------
// The drum: cream, from the ring roof to the parapet, with a row of small red
// squares near the top, and the nearly flat white roof (3.3 m camber).
const TOP = 26.4
wall(cream, DRUM, PAR - 1.2, TOP)
for (let i = 0; i < N; i += 2) {
  const m = midOf(DRUM, i), n = outN(DRUM, i)
  panel(red, [m[0] - n[1] * 0.75, m[1] + n[0] * 0.75], [m[0] + n[1] * 0.75, m[1] - n[0] * 0.75], n, TOP - 3.4, TOP - 1.9, 0.05)
}
// faint vertical joints (pale lines a step lighter), every fourth segment
for (let i = 1; i < N; i += 4) {
  const n = outN(DRUM, i), p = DRUM[(i + 1) % N]
  panel(white, [p[0] - n[1] * 0.18, p[1] + n[0] * 0.18], [p[0] + n[1] * 0.18, p[1] - n[0] * 0.18], n, PAR - 1.2, TOP - 0.5, 0.04)
}
// parapet cap and roof: rings stepping in and up to the crown
const RIN = ring(54.2, 46.2, 2.3)
annulus(white, RIN, DRUM, TOP)
{
  const I = at(RIN, TOP), Ib = at(RIN, TOP - 1.9)
  for (let i = 0; i < N; i++) { const j = (i + 1) % N; white.quad(I[j], I[i], Ib[i], Ib[j]) }
  let prev = RIN, zp = TOP - 1.9
  for (const [k, z] of [[0.7, 26.2], [0.4, 27.2]] as [number, number][]) {
    const r = ring(54.2 * k, 46.2 * k, 2.3)
    annulus(white, r, prev, zp, z)
    prev = r; zp = z
  }
  const c: V3 = [C[0], C[1], 27.5], P = at(prev, zp)
  for (let i = 0; i < N; i++) white.tri(P[i], P[(i + 1) % N], c)
}
// four small skylights (NAIP)
for (const [x, y] of [[-24, 22], [-9, 23], [-17, -25], [-1, -24]] as XY[]) box(block, [x + 4, y, 27.1], 1.6, 3.2, 0.5)

// ---------------------------------------------------------------------------
// Entrance canopies: a red arched band with the oval sign at its crown, on
// the south (main) and north fronts; smaller red arches east and west.
function canopy(cx: number, side: number, half: number, rise: number, sign: boolean) {
  // band follows the ring face at the eave, arching up to the crown
  const yFace = (x: number) => side * (51.0 * (1 - Math.abs(x / 57.5) ** 2.3) ** (1 / 2.3)) + C[1]
  const seg = 10
  for (let k = 0; k < seg; k++) {
    const x0 = cx - half + (2 * half * k) / seg, x1 = cx - half + (2 * half * (k + 1)) / seg
    const z0 = EAVE1 + 0.4 + rise * Math.sin((Math.PI * (x0 - cx + half)) / (2 * half))
    const z1 = EAVE1 + 0.4 + rise * Math.sin((Math.PI * (x1 - cx + half)) / (2 * half))
    const A: V3 = [x0, yFace(x0) + side * 1.4, z0], B: V3 = [x1, yFace(x1) + side * 1.4, z1]
    const a: V3 = [x0, yFace(x0) - side * 3, z0], b: V3 = [x1, yFace(x1) - side * 3, z1]
    const t = 0.9
    // front face, top, bottom
    if (side < 0) {
      red.quad(A, B, [B[0], B[1], B[2] + t], [A[0], A[1], A[2] + t])
      red.quad([A[0], A[1], A[2] + t], [B[0], B[1], B[2] + t], [b[0], b[1], b[2] + t], [a[0], a[1], a[2] + t])
      white.quad(a, b, B, A)
    } else {
      red.quad(B, A, [A[0], A[1], A[2] + t], [B[0], B[1], B[2] + t])
      red.quad([B[0], B[1], B[2] + t], [A[0], A[1], A[2] + t], [a[0], a[1], a[2] + t], [b[0], b[1], b[2] + t])
      white.quad(b, a, A, B)
    }
  }
  if (sign) {
    // the oval sign: a white disc with a red rim, standing on the crown
    const yc = yFace(cx) + side * 1.6, zc = EAVE1 + 0.4 + rise + 2.4
    const pts = Array.from({ length: 14 }, (_, i) => { const t = (2 * Math.PI * i) / 14; return [cx + 5.2 * Math.cos(t), zc + 2.4 * Math.sin(t)] as XY })
    const ptsIn = pts.map(([x, z]) => [cx + (x - cx) * 0.84, zc + (z - zc) * 0.78] as XY)
    for (let i = 0; i < 14; i++) {
      const j = (i + 1) % 14
      const P = (q: XY, o: number): V3 => [q[0], yc + side * o, q[1]]
      const f = side < 0 ? (p: Part, a: V3, b: V3, c: V3) => p.tri(a, b, c) : (p: Part, a: V3, b: V3, c: V3) => p.tri(a, c, b)
      f(red, P(pts[i], 0.3), P(pts[j], 0.3), P(ptsIn[j], 0.3))
      f(red, P(pts[i], 0.3), P(ptsIn[j], 0.3), P(ptsIn[i], 0.3))
      f(signFace, P(ptsIn[i], 0.32), P(ptsIn[j], 0.32), [cx, yc + side * 0.32, zc])
      // back face
      f(red, P(pts[j], -0.3), P(pts[i], -0.3), [cx, yc - side * 0.3, zc])
    }
  }
}
canopy(0, -1, 22, 2.2, true)
canopy(0, 1, 20, 2.0, true)
// small red arched canopies over the east and west pavilions
for (const sx of [-1, 1]) {
  const x = C[0] + sx * 57.6
  for (let k = 0; k < 6; k++) {
    const y0 = C[1] - 6 + 2 * k, y1 = y0 + 2
    const z0 = EAVE1 + 0.3 + 1.2 * Math.sin((Math.PI * k) / 6), z1 = EAVE1 + 0.3 + 1.2 * Math.sin((Math.PI * (k + 1)) / 6)
    const A: V3 = [x, y0, z0], B: V3 = [x, y1, z1]
    if (sx > 0) red.quad(A, B, [B[0], B[1], B[2] + 0.8], [A[0], A[1], A[2] + 0.8])
    else red.quad(B, A, [A[0], A[1], A[2] + 0.8], [B[0], B[1], B[2] + 0.8])
    const Ai: V3 = [x - sx * 3, y0, z0 + 0.8], Bi: V3 = [x - sx * 3, y1, z1 + 0.8]
    if (sx > 0) red.quad([A[0], A[1], A[2] + 0.8], [B[0], B[1], B[2] + 0.8], Bi, Ai)
    else red.quad([B[0], B[1], B[2] + 0.8], [A[0], A[1], A[2] + 0.8], Ai, Bi)
  }
}

// ---------------------------------------------------------------------------
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : p[2] > PAR - 1 ? 0.55 : 0.25)
const parts = [
  { part: cream, material: { ...finish('viejas-cream-panel', 0xeadbb2), floodlight: lit } },
  { part: block, material: finish('viejas-tan-block', 0xd2c2a4) },
  { part: red, material: finish('sdsu-red', 0xb04a46) },
  { part: white, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: signFace, material: PALETTE.entrance },
]
const glb = writeGlb('Viejas Arena', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [32.77381, -117.07454],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', replaces: ['way/31248345'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('Viejas Arena', parts, glb, 5000)
const out = new URL('../models/sd-viejas-arena.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
