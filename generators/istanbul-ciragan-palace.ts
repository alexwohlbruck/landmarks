/**
 * Çırağan Palace, Beşiktaş, Istanbul: procedural, CC0-1.0.
 * bun generators/istanbul-ciragan-palace.ts
 *
 * Built 1863-1871 for Abdülaziz (Nigoğayos Balyan), burnt out in 1910,
 * restored 1987-1992 as part of the Kempinski hotel. Only the historic
 * palace is modelled: a long white marble block on the Bosphorus shore, two
 * tall storeys over a low basement, the sea front divided into a central
 * block and two end blocks that stand forward of two recessed bays, every
 * bay framed by paired columns with Moorish-inspired arched windows between
 * them, a heavy cornice and an attic parapet, and low green copper hipped
 * roofs, raised over the three forward blocks. A double stair runs down to
 * the quay from the centre.
 *
 * Frame: x along the shore (world 66.7), y inland (world 336.7); z up.
 * Placed with bearing 336.7 (OSM edges run 66.8 / 156.5). Origin at the
 * centroid of OSM way/498861861 (29.015310, 41.043471). Flat shore fill:
 * elevation 0. No terrain check could run (Mapterhorn has no z15 terrain
 * here).
 *
 * OSM (ODbL), fetched 2026-11: way/498861861 (building=yes, historic=castle,
 * castle_type=palace, wikidata Q273225, checked: "Çırağan Palace"). Plan:
 * x -61.2..60.8, y -21.7..20.6; the sea front stands forward (y -21.7) in
 * three blocks, x -61.2..-30.0, -18.5..18.2 and 29.7..60.8, between two
 * bays set back 3.8 m. The modern hotel wing (way/498861863) and the
 * palace's bridge (way/895150392) are separate buildings, not replaced.
 *
 * Estimated from the level telephoto from the Asian shore (mike, about
 * 8.0 px/m on the 1280 px file against the 122 m front): basement 0-3.8 m,
 * ground-floor windows 3.8-8.2 m, string course 10 m, upper windows
 * 11.3-16.3 m, cornice 18.2 m, attic parapet 20.7 m, copper roofs to about
 * 22.6 m and over the three forward blocks to 24 m; 30 bays along the front
 * (about 4 m each).
 * Invented / simplified: one arched window panel per bay and storey (the
 * real bays hold paired or triple openings), the columns as flat paired
 * pilasters, the carved spandrels and attic balustrade as plain bands, the
 * land facade drawn like the sea facade with wider (6 m) bays.
 *
 * Colours from daylight photos, pulled to the palette: cream-white marble
 * (#e7e1d5), whiter columns and cornices (trim), green copper roofs
 * (#8fb19f). Night: floodlit (stone and trim carry _FLOODLIGHT); windows
 * glow (a hotel, lit).
 *
 * Photos (EVIDENCE, all Wikimedia Commons):
 * - "Çırağan Palace from the Bosphorus - 20250825.jpg", mike, CC BY-SA 4.0
 *   (level telephoto from the south-east: the ruler)
 *   https://commons.wikimedia.org/wiki/File:%C3%87%C4%B1ra%C4%9Fan_Palace_from_the_Bosphorus_-_20250825.jpg
 * - "Çırağan Palace from the Bosphorus Strait (cropped).jpg", flowcomm,
 *   CC BY 2.0 (front, bays and columns)
 *   https://commons.wikimedia.org/wiki/File:%C3%87%C4%B1ra%C4%9Fan_Palace_from_the_Bosphorus_Strait_(cropped).jpg
 * - "Çırağan Palace - Istanbul, Turkey - October 11, 2025.jpg", Giorgio
 *   Galeotti, CC BY-SA 4.0 (from the south-west, end block)
 *   https://commons.wikimedia.org/wiki/File:%C3%87%C4%B1ra%C4%9Fan_Palace_-_Istanbul,_Turkey_-_October_11,_2025.jpg
 * - "Ciragan Palace 2014.JPG", Wolfgang Moroder, CC BY-SA 3.0 (from the
 *   south-west along the quay)
 *   https://commons.wikimedia.org/wiki/File:Ciragan_Palace_2014.JPG
 * - "Çırağan Palace in 2008.jpg", Sam amcalar, public domain
 *   https://commons.wikimedia.org/wiki/File:%C3%87%C4%B1ra%C4%9Fan_Palace_in_2008.jpg
 * Look-only: A. Savin's "Istanbul asv2020-02 img59/65/66" (Free Art
 * License, tagged look-only by the photo tool) and the SALT Research
 * archive scans were not used.
 *
 * Doubts: the land facade and side faces are not photographed here (drawn
 * like the sea front); roof heights are photo-scaled from one view.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const TAU = Math.PI * 2

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part()
const lead = roof, gilt = trim
void TAU; void lead; void gilt

// Helpers (as in istanbul-blue-mosque.ts).

function poly(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    const g = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}
function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false) {
  p.loft([ring.map(([x, y]) => [x, y, z0] as V3), ring.map(([x, y]) => [x, y, z1] as V3)])
  if (top) poly(p, ring.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, ring.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
function rect(x0: number, x1: number, y0: number, y1: number, c = 0): XY[] {
  if (c <= 0) return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  return [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
}
function circle(cx: number, cy: number, r: number, n: number, phase = 0): XY[] {
  return Array.from({ length: n }, (_, k) => [cx + r * Math.cos(phase + (k * TAU) / n), cy + r * Math.sin(phase + (k * TAU) / n)] as XY)
}
function revolve(p: Part, cx: number, cy: number, prof: [number, number][], n: number, a0 = 0, a1 = TAU, smooth: boolean | 'ring' = true) {
  const m = prof.length
  const nrm2 = prof.map((_, i) => {
    const pa = prof[Math.max(0, i - 1)], pb = prof[Math.min(m - 1, i + 1)]
    const dr = pb[0] - pa[0], dz = pb[1] - pa[1], l = Math.hypot(dr, dz) || 1
    return [dz / l, -dr / l] as [number, number]
  })
  for (let k = 0; k < n; k++) {
    const t0 = a0 + ((a1 - a0) * k) / n, t1 = a0 + ((a1 - a0) * (k + 1)) / n
    for (let i = 0; i < m - 1; i++) {
      const P = (j: number, t: number): V3 => [cx + prof[j][0] * Math.cos(t), cy + prof[j][0] * Math.sin(t), prof[j][1]]
      const N = (j: number, t: number): V3 => [nrm2[j][0] * Math.cos(t), nrm2[j][0] * Math.sin(t), nrm2[j][1]]
      const dr = prof[i + 1][0] - prof[i][0], dz = prof[i + 1][1] - prof[i][1], l = Math.hypot(dr, dz) || 1
      const S = (t: number): V3 => [(dz / l) * Math.cos(t), (dz / l) * Math.sin(t), -dr / l]
      const nA = smooth === 'ring' ? S(t0) : smooth ? N(i, t0) : S((t0 + t1) / 2), nB = smooth === 'ring' ? S(t1) : smooth ? N(i, t1) : S((t0 + t1) / 2)
      const nC = smooth === 'ring' ? S(t1) : smooth ? N(i + 1, t1) : S((t0 + t1) / 2), nD = smooth === 'ring' ? S(t0) : smooth ? N(i + 1, t0) : S((t0 + t1) / 2)
      const a = P(i, t0), b = P(i, t1), c = P(i + 1, t1), d = P(i + 1, t0)
      if (prof[i][0] > 1e-6) p.tri(a, b, c, undefined, undefined, undefined, [nA, nB, nC])
      if (prof[i + 1][0] > 1e-6) p.tri(a, c, d, undefined, undefined, undefined, [nA, nC, nD])
    }
  }
}
function domeProfile(r: number, z: number, h: number, rings: number): [number, number][] {
  const R = (r * r + h * h) / (2 * h), zc = z + h - R, top = Math.asin(r / R)
  return Array.from({ length: rings + 1 }, (_, k) => {
    const a = top * (1 - k / rings)
    return [R * Math.sin(a), zc + R * Math.cos(a)] as [number, number]
  })
}
function alem(cx: number, cy: number, z: number, h: number) {
  const w = Math.max(0.22, h * 0.07)
  revolve(gilt, cx, cy, [[w * 1.6, z - 0.2], [w * 2.6, z + h * 0.3], [w * 0.9, z + h * 0.55], [0, z + h]], 5)
}
/** A flat panel on a vertical wall from a to b (plan), offset out along n. */
function panel(p: Part, a: XY, b: XY, z0: number, z1: number, n: XY, arch = false, out = 0.05) {
  const o: XY = [n[0] * out, n[1] * out]
  const A: V3 = [a[0] + o[0], a[1] + o[1], z0], B: V3 = [b[0] + o[0], b[1] + o[1], z0]
  const N3: V3 = [n[0], n[1], 0]
  if (!arch) { poly(p, [A, B, [B[0], B[1], z1], [A[0], A[1], z1]], N3); return }
  const w = Math.hypot(b[0] - a[0], b[1] - a[1]), r = w / 2, zs = z1 - r
  poly(p, [A, B, [B[0], B[1], zs], [A[0], A[1], zs]], N3)
  const ux = (b[0] - a[0]) / w, uy = (b[1] - a[1]) / w, cx = (A[0] + B[0]) / 2, cy = (A[1] + B[1]) / 2
  const pts: V3[] = []
  for (let k = 0; k <= 6; k++) { const t = Math.PI - (Math.PI * k) / 6; pts.push([cx + ux * r * Math.cos(t), cy + uy * r * Math.cos(t), zs + r * Math.sin(t)]) }
  poly(p, pts, N3)
}

// ---------------------------------------------------------------------------
// Plan (OSM): three forward blocks and two recessed bays on the sea front.

const X0 = -61.2, X1 = 60.8, YB = -21.7, YR = -17.9, YL = 20.6
const BASE = 3.8, STRING = 10.0, CORNICE = 18.2, ATTIC = 20.7

const outline: XY[] = [
  [X0, YB], [-30.0, YB], [-30.0, YR], [-18.5, YR], [-18.5, YB], [18.2, YB], [18.2, YR], [29.7, YR], [29.7, YB], [X1, YB],
  [X1, YL], [X0, YL],
]
// walls (the outline is not convex: loft it, cap the top as rectangles)
stone.loft([outline.map(([x, y]) => [x, y, 0] as V3), outline.map(([x, y]) => [x, y, CORNICE] as V3)])
// cornice: a projecting band round the whole
const grow = (r: XY[], d: number): XY[] => r.map(([x, y], i) => {
  // offset each vertex outwards along the bisector of an orthogonal polygon
  const p = r[(i + r.length - 1) % r.length], n = r[(i + 1) % r.length]
  const e1: XY = [x - p[0], y - p[1]], e2: XY = [n[0] - x, n[1] - y]
  const l1 = Math.hypot(...e1), l2 = Math.hypot(...e2)
  const n1: XY = [e1[1] / l1, -e1[0] / l1], n2: XY = [e2[1] / l2, -e2[0] / l2]
  const s = n1[0] * n2[0] + n1[1] * n2[1]
  const k = d / (1 + s)
  return [x + (n1[0] + n2[0]) * k, y + (n1[1] + n2[1]) * k] as XY
})
const corn = grow(outline, 0.5)
trim.loft([corn.map(([x, y]) => [x, y, CORNICE - 0.9] as V3), corn.map(([x, y]) => [x, y, CORNICE + 0.3] as V3)])
const par = grow(outline, 0.15)
stone.loft([par.map(([x, y]) => [x, y, CORNICE + 0.3] as V3), par.map(([x, y]) => [x, y, ATTIC] as V3)])
trim.loft([corn.map(([x, y]) => [x, y, ATTIC] as V3), corn.map(([x, y]) => [x, y, ATTIC + 0.35] as V3)])
// tops of the cornice and parapet, as rectangles
const rects: Array<[number, number, number, number]> = [[X0, -30.0, YB, YL], [-30.0, -18.5, YR, YL], [-18.5, 18.2, YB, YL], [18.2, 29.7, YR, YL], [29.7, X1, YB, YL]]
for (const [x0, x1, y0, y1] of rects) {
  const e = 0.5
  poly(trim, rect(x0 - (x0 === X0 ? e : 0), x1 + (x1 === X1 ? e : 0), y0 - e, y1 + e).map(([x, y]) => [x, y, ATTIC + 0.35] as V3), [0, 0, 1])
}
// basement band and string course: shallow projecting bands
const band = grow(outline, 0.25)
stone.loft([band.map(([x, y]) => [x, y, 0] as V3), band.map(([x, y]) => [x, y, BASE - 0.3] as V3)])
trim.loft([band.map(([x, y]) => [x, y, BASE - 0.3] as V3), band.map(([x, y]) => [x, y, BASE] as V3)])
for (const [x0, x1, y0, y1] of rects) poly(trim, rect(x0, x1, y0, y1).map(([x, y]) => [x, y, BASE] as V3), [0, 0, 1])
trim.loft([band.map(([x, y]) => [x, y, STRING - 0.35] as V3), band.map(([x, y]) => [x, y, STRING + 0.3] as V3)])
{
  // tops of the projecting bands (thin ledges)
  for (const z of [BASE, STRING + 0.3]) for (let i = 0; i < outline.length; i++) {
    const j = (i + 1) % outline.length
    poly(trim, [[outline[i][0], outline[i][1], z], [outline[j][0], outline[j][1], z], [band[j][0], band[j][1], z], [band[i][0], band[i][1], z]], [0, 0, 1])
  }
}

// Roofs: a low copper hip over the whole body, raised hips over the three
// forward blocks.
function hip(x0: number, x1: number, y0: number, y1: number, z0: number, h: number) {
  const m = Math.min(x1 - x0, y1 - y0) / 2
  const r0: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const top: V3[] = [[x0 + m, y0 + m, z0 + h], [x1 - m, y0 + m, z0 + h], [x1 - m, y1 - m, z0 + h], [x0 + m, y1 - m, z0 + h]]
  for (let k = 0; k < 4; k++) {
    const j = (k + 1) % 4
    const e: XY = [r0[j][0] - r0[k][0], r0[j][1] - r0[k][1]], L = Math.hypot(...e)
    const n: V3 = [(e[1] / L) * h, (-e[0] / L) * h, m]
    if (Math.hypot(top[j][0] - top[k][0], top[j][1] - top[k][1]) < 1e-6) poly(roof, [r0[k], r0[j], top[k]], n)
    else poly(roof, [r0[k], r0[j], top[j], top[k]], n)
  }
}
const RZ = ATTIC - 0.4
hip(X0 + 1.2, X1 - 1.2, YR + 1.2, YL - 1.2, RZ, 2.3)
// the raised blocks: their ridge at about 24 m
hip(X0 + 1.2, -31.2, YB + 1.2, YL - 1.2, RZ, 3.4)
hip(30.9, X1 - 1.2, YB + 1.2, YL - 1.2, RZ, 3.4)
hip(-17.3, 17.0, YB + 1.2, YL - 1.2, RZ, 3.5)

// ---------------------------------------------------------------------------
// Facade bays: paired pilasters between bays, one arched window per bay and
// storey, a small basement window.

function pilaster(a: XY, n: XY, u: XY) {
  // a paired-column pier, drawn as one bold block, and a pedestal on the attic above it
  const w = 1.25, d = 0.55
  const ring: XY[] = [
    [a[0] - u[0] * w / 2, a[1] - u[1] * w / 2], [a[0] + u[0] * w / 2, a[1] + u[1] * w / 2],
    [a[0] + u[0] * w / 2 + n[0] * d, a[1] + u[1] * w / 2 + n[1] * d], [a[0] - u[0] * w / 2 + n[0] * d, a[1] - u[1] * w / 2 + n[1] * d],
  ]
  const area = ring.reduce((t, p, j) => { const q = ring[(j + 1) % 4]; return t + p[0] * q[1] - q[0] * p[1] }, 0)
  const r = area > 0 ? ring : ring.slice().reverse()
  trim.loft([r.map(([x, y]) => [x, y, BASE] as V3), r.map(([x, y]) => [x, y, CORNICE - 0.9] as V3)])
  const pd: XY[] = r.map(([x, y]) => [x - n[0] * 0.3, y - n[1] * 0.3] as XY)
  prism(trim, pd, ATTIC + 0.35, ATTIC + 1.2)
}
function facade(a: XY, b: XY, n: XY, bays: number, edges = true) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const at = (d: number): XY => [a[0] + u[0] * d, a[1] + u[1] * d]
  const bw = L / bays
  for (let k = edges ? 0 : 1; k <= (edges ? bays : bays - 1); k++) {
    const d = Math.min(L - 0.5, Math.max(0.5, k * bw))
    pilaster(at(d), n, u)
  }
  for (let k = 0; k < bays; k++) {
    const m = (k + 0.5) * bw, hw = Math.min(1.3, bw * 0.31)
    panel(win, at(m - hw), at(m + hw), BASE + 0.9, 8.6, n, true)
    panel(win, at(m - hw), at(m + hw), STRING + 1.3, 16.5, n, true)
    panel(win, at(m - 0.5), at(m + 0.5), 0.9, 2.4, n)
  }
}
// Sea front: end blocks 8 bays, recessed bays 3, central block 9 (about 4 m).
facade([X0, YB], [-30.0, YB], [0, -1], 8)
facade([-30.0, YR], [-18.5, YR], [0, -1], 3, false)
facade([-18.5, YB], [18.2, YB], [0, -1], 9)
facade([18.2, YR], [29.7, YR], [0, -1], 3, false)
facade([29.7, YB], [X1, YB], [0, -1], 8)
// Ends and the land side.
facade([X1, YB], [X1, YL], [1, 0], 10)
facade([X0, YL], [X0, YB], [-1, 0], 10)
facade([X1, YL], [X0, YL], [0, 1], 20)

// The central double stair down to the quay is outside the outline (on the
// quay) and is left to the map.

// ---------------------------------------------------------------------------

const lit = (k: number) => (_p: V3, n: V3) => k * (n[2] > 0.9 ? 0.45 : 1)
const parts = [
  { part: stone, material: { ...finish('marble', 0xe7e1d5), floodlight: lit(0.85) } },
  { part: trim, material: { ...PALETTE.trim, color: 0xf3eee4, floodlight: lit(0.9) } },
  { part: roof, material: finish('copper-roof', 0x8fb19f) },
  { part: win, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Çırağan Palace', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 336.7, elevation: 0, height: 24,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/istanbul-ciragan-palace.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
