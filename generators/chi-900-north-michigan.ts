/**
 * 900 North Michigan (1989, Kohn Pedersen Fox with Perkins & Will),
 * Chicago — original procedural geometry, CC0-1.0.
 * bun generators/chi-900-north-michigan.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/31064552,
 * 41.899615,-87.625590. The outline's edges run at 88.9° / 178.9°, so the
 * catalog bearing is 358.9; the outline is turned by 1.1° into this frame.
 *
 * Identity: the pale limestone tower standing behind the Michigan Avenue
 * podium, long side north-south; green glass in tall vertical bays between
 * stone piers; the crenellated cornice where the office floors give way to
 * the narrower upper shaft; the four corner pavilions at the top, each with
 * a glass lantern under a pale metal pyramid and finial.
 *
 * Evidence:
 *  - plan: the OSM outline (the whole block: mall podium, parking garage
 *    to Rush Street) and the tower part way/153966972, whose tower rectangle
 *    is 37.8 × 65.2 m at x 39.6-77.4.
 *  - height 265 m (871 ft, Wikipedia; OSM 265.4), 66 floors.
 *  - podium 38 m: estimated, the eight-storey Michigan front in Marketing900's
 *    street photo (the 12-storey garage behind reads about the same height).
 *  - tower massing, measured on the two aerials from 875 N Michigan (Roman
 *    Boed; anonymous 2004) and Marketing900's frontal photo, scaled by the
 *    65.2 m east face: office block to the crenellated band at ≈ 112 m
 *    (floor 28, Wikipedia's office floors 8-28); the upper shaft set in
 *    ≈ 2.5 m, its corners notched 2.5 m all the way up; the central roof at
 *    ≈ 236 m; the corner pavilions ≈ 14 m square, notched the same, to
 *    ≈ 244.5 m, the lanterns 10 m square, glass to ≈ 253.5 m and the
 *    pyramids to ≈ 262 m, finials to 265 m. Expect ±4 m on the breaks.
 *  - colour: cream limestone near `stone`; green-tinted glass drawn as a
 *    green-slate window; the lantern roofs pale silver metal.
 *
 * Photos (Wikimedia Commons): 900_North_Michigan_Avenue.jpg (Marketing900,
 * CC BY-SA 4.0); Chicago_900_North_Michigan_Avenue_(27940356553).jpg and
 * 900_North_Michigan_(14903590855).jpg (Roman Boed, CC BY 2.0);
 * 900_North_Michigan_top_from_John_Hancock_2004-11_img_2627.jpg (CC BY 2.0);
 * Hancock_View_14_(3539430653).jpg (Jaysin Trevino, CC BY 2.0). No
 * commercial imagery.
 *
 * Left out: the podium's round window and shopfronts, the roof garden on
 * the podium, the pavilions' open loggias and red merlon caps.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const stone = new Part(), win = new Part(), roof = new Part(), lantern = new Part(), cap = new Part()

type XY = [number, number]
const ringAt = (pts: XY[], z: number): V3[] => pts.map(([x, y]) => [x, y, z])

// OSM outline, turned into the model frame, counter-clockwise.
const outline: XY[] = ([[-32.4, -34.8], [-39.3, -34.8], [-45.1, -34.8], [-66.4, -34.8], [-92.6, -34.8], [-101.2, -8.6], [-112, 23.9],
  [-114, 30], [-107.6, 30.1], [-87.7, 30.2], [-69.1, 30.2], [-60.7, 30.3], [-54, 30.3], [-53.5, 28.7], [-46.6, 28.8], [-46.6, 29.9],
  [-42.2, 29.9], [5.5, 30.2], [32.6, 30.3], [32.6, 29.2], [39.6, 29.2], [39.6, 30.5], [77.6, 30.6], [77.6, 30], [82.2, 29.9],
  [82.3, 30.6], [101.7, 30.6], [101.8, -34.6], [82.5, -34.7], [82.5, -33.5], [77.1, -33.5], [77.1, -34.6], [38, -34.5],
  [38, -33.8], [33.1, -33.8], [33.2, -34.6], [13.4, -34.6], [13.4, -21.6], [-0.1, -21.6], [-1.9, -15.4], [-32.6, -15.2],
  [-38.4, -17.2], [-37.9, -18.8]] as XY[]).reverse()

/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
function triangulate(p: XY[]): [number, number, number][] {
  const idx = p.map((_, i) => i), out: [number, number, number][] = []
  const cross = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (q: XY, a: XY, b: XY, c: XY) => cross(a, b, q) >= 0 && cross(b, c, q) >= 0 && cross(c, a, q) >= 0
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    for (let k = 0; k < idx.length; k++) {
      const i = idx[(k + idx.length - 1) % idx.length], j = idx[k], l = idx[(k + 1) % idx.length]
      if (cross(p[i], p[j], p[l]) <= 1e-9) continue
      if (idx.some(m => m !== i && m !== j && m !== l && inTri(p[m], p[i], p[j], p[l]))) continue
      out.push([i, j, l]); idx.splice(k, 1); break
    }
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}

// Podium: the whole block to 38 m, a stone coping, a flat roof.
const PH = 38
stone.loft([ringAt(outline, 0), ringAt(outline, PH)])
for (const [a, b, c] of triangulate(outline)) roof.tri([...outline[a], PH], [...outline[b], PH], [...outline[c], PH])
// Podium windows: tall panels along every long wall, a stone band between.
for (let i = 0; i < outline.length; i++) {
  const a = outline[i], b = outline[(i + 1) % outline.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 12 || a[0] > 100 && b[0] > 100) continue
  const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy * .06, ny = -ux * .06
  const k = Math.floor((L - 4) / 7)
  for (let j = 0; j < k; j++) {
    const s0 = (L - k * 7) / 2 + j * 7 + 1.4, s1 = s0 + 4.2
    const P = (s: number, z: number): V3 => [a[0] + ux * s + nx, a[1] + uy * s + ny, z]
    for (const [z0, z1] of [[9, 20], [23, 34]]) win.quad(P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1))
  }
}
// Shopfront glazing and the upper podium window band on the Michigan front.
{
  const x = 101.8 + .06
  win.quad([x, -30, 1], [x, 26, 1], [x, 26, 6.5], [x, -30, 6.5])
  for (const y0 of [-30, -16, 12]) win.quad([x, y0, 25], [x, y0 + 14, 25], [x, y0 + 14, 33], [x, y0, 33])
}

// Tower frame: centre and half-sizes.
const CX = 58.5, CY = -2, HX = 18.9, HY = 32.6
const Z1 = 112, ZR = 236, ZP = 244.5
/** Window bays on a rectangular block's faces: vertical strips in groups of floors. */
function bays(hx: number, hy: number, z0: number, z1: number, every: number, skipEdge = 0) {
  const faces: [XY, XY, number, number][] = [[[0, -1], [1, 0], hy, hx], [[1, 0], [0, 1], hx, hy], [[0, 1], [-1, 0], hy, hx], [[-1, 0], [0, -1], hx, hy]]
  for (const [n, u, d, h] of faces) {
    const span = h - 1.6 - skipEdge, nb = Math.max(2, Math.round(2 * span / 4.6)), w = 2 * span / nb
    const groups = Math.max(1, Math.round((z1 - z0) / every)), gh = (z1 - z0) / groups
    for (let b = 0; b < nb; b++) {
      const s0 = -span + b * w + w * .2, s1 = -span + (b + 1) * w - w * .2
      const P = (s: number, z: number): V3 => [CX + n[0] * (d + .06) + u[0] * s, CY + n[1] * (d + .06) + u[1] * s, z]
      for (let g = 0; g < groups; g++) {
        const za = z0 + g * gh + .5, zb = z0 + (g + 1) * gh - .5
        win.quad(P(s0, za), P(s1, za), P(s1, zb), P(s0, zb))
      }
    }
  }
}
const rect = (hx: number, hy: number, c = .5): XY[] => [[CX - hx + c, CY - hy], [CX + hx - c, CY - hy], [CX + hx, CY - hy + c], [CX + hx, CY + hy - c],
  [CX + hx - c, CY + hy], [CX - hx + c, CY + hy], [CX - hx, CY + hy - c], [CX - hx, CY - hy + c]]

// Office block, from the podium roof to the crenellated band.
stone.loft([ringAt(rect(HX, HY), PH), ringAt(rect(HX, HY), Z1)])
bays(HX, HY, PH + 2, Z1 - 4, 14)
// The cornice band, proud, with merlons along its top.
{
  const b = rect(HX + .5, HY + .5, .6)
  stone.loft([ringAt(rect(HX, HY), Z1 - 3.5), ringAt(b, Z1 - 3), ringAt(b, Z1)])
  roof.cap(ringAt(b, Z1), true)
  for (const [n, u, d, h] of [[[0, -1], [1, 0], HY, HX], [[1, 0], [0, 1], HX, HY], [[0, 1], [-1, 0], HY, HX], [[-1, 0], [0, -1], HX, HY]] as [XY, XY, number, number][]) {
    const k = Math.round(2 * h / 4.4)
    for (let i = 0; i < k; i++) {
      const s = -h + (i + .5) * 2 * h / k
      const P = (ss: number, dd: number): XY => [CX + n[0] * (d + .5 - dd) + u[0] * ss, CY + n[1] * (d + .5 - dd) + u[1] * ss]
      const r: XY[] = [P(s - .8, 0), P(s + .8, 0), P(s + .8, 1.2), P(s - .8, 1.2)]
      stone.loft([ringAt(r, Z1), ringAt(r, Z1 + 1.6)]); stone.cap(ringAt(r, Z1 + 1.6), true)
    }
  }
}
// Upper shaft, set in 2.5 m, its corners notched; the middle of every face
// recessed 1.2 m between stone corner zones (12 m wide on the long faces,
// 8 m on the short), the green glass in the recess.
const UX = HX - 2.5, UY = HY - 2.5, N = 2.5, R = 1.2
const zone = (h: number) => h > 20 ? 12 : 8
const sides: [XY, XY, number, number][] = [[[0, -1], [1, 0], UY, UX], [[1, 0], [0, 1], UX, UY], [[0, 1], [-1, 0], UY, UX], [[-1, 0], [0, -1], UX, UY]]
const shaft: XY[] = []
for (const [n, u, d, h] of sides) {
  const P = (s: number, dd: number): XY => [CX + n[0] * dd + u[0] * s, CY + n[1] * dd + u[1] * s]
  const c = h - zone(h)
  shaft.push(P(-h + N, d), P(-c, d), P(-c, d - R), P(c, d - R), P(c, d), P(h - N, d), P(h - N, d - N + 0))
  // The notch: from (h-N, d) in to (h-N, d-N) then out along the next face.
  shaft.pop(); shaft.push(P(h - N, d - N))
}
stone.loft([ringAt(shaft, Z1), ringAt(shaft, ZR)])
for (const [a, b, c] of triangulate(shaft)) roof.tri([...shaft[a], ZR], [...shaft[b], ZR], [...shaft[c], ZR])
for (const [n, u, d, h] of sides) {
  const c = h - zone(h)
  const P = (s: number, z: number, dd: number): V3 => [CX + n[0] * (dd + .06) + u[0] * s, CY + n[1] * (dd + .06) + u[1] * s, z]
  // Recess: tall glass bays, three floors to a group.
  const span = c - .6, nb = Math.max(2, Math.round(2 * span / 4.2)), w = 2 * span / nb
  const groups = Math.round((ZR - Z1 - 6) / 12), gh = (ZR - Z1 - 6) / groups
  for (let b = 0; b < nb; b++) {
    const s0 = -span + b * w + w * .14, s1 = -span + (b + 1) * w - w * .14
    for (let g = 0; g < groups; g++) {
      const za = Z1 + 3 + g * gh + .35, zb = Z1 + 3 + (g + 1) * gh - .35
      win.quad(P(s0, za, d - R), P(s1, za, d - R), P(s1, zb, d - R), P(s0, zb, d - R))
    }
  }
  // Corner zones: punched windows, two per bay, a floor pair to a row.
  for (const side of [-1, 1]) {
    const lo = c + .8, hi = h - N - .8, k = Math.max(1, Math.round((hi - lo) / 3.2)), ww = (hi - lo) / k
    const rows = Math.round((ZR - Z1 - 6) / 8), rh = (ZR - Z1 - 6) / rows
    for (let j = 0; j < k; j++) for (let r = 0; r < rows; r++) {
      const sa = side * (lo + j * ww + ww * .22), sb = side * (lo + (j + 1) * ww - ww * .22)
      const [s0, s1] = side < 0 ? [sb, sa] : [sa, sb]
      const za = Z1 + 3 + r * rh + 1.6, zb = Z1 + 3 + (r + 1) * rh - 1.6
      win.quad(P(s0, za, d), P(s1, za, d), P(s1, zb, d), P(s0, zb, d))
    }
  }
}
// Corner piers below the pavilions and the four pavilions with lanterns.
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  const px = CX + sx * (UX - N / 2), py = CY + sy * (UY - N / 2)
  const sq = (h: number, ox = px, oy = py): XY[] => [[ox - h, oy - h], [ox + h, oy - h], [ox + h, oy + h], [ox - h, oy + h]]
  // Pavilion: 12 m square in the corner, flush with the shaft's faces and
  // notched like them, rising from the central roof.
  const PX = CX + sx * (UX - 7), PY = CY + sy * (UY - 7)
  const ox = CX + sx * UX, oy = CY + sy * UY, ix = CX + sx * (UX - 14), iy = CY + sy * (UY - 14)
  const pav: XY[] = [[ix, iy], [ox, iy], [ox, oy - sy * N], [ox - sx * N, oy - sy * N], [ox - sx * N, oy], [ix, oy]]
  if (sx * sy < 0) pav.reverse()
  stone.loft([ringAt(pav, ZR - .5), ringAt(pav, ZP)])
  for (const [a, b, c] of triangulate(pav)) roof.tri([...pav[a], ZP], [...pav[b], ZP], [...pav[c], ZP])
  // Pavilion windows on its two outer faces.
  for (const [n, u] of [[[sx, 0], [0, sx]], [[0, sy], [-sy, 0]]] as [XY, XY][]) {
    const P = (s: number, z: number): V3 => [PX + n[0] * 7.06 + u[0] * s, PY + n[1] * 7.06 + u[1] * s, z]
    for (const s of [-3.6, 0, 3.6]) for (let g = 0; g < 1; g++) {
      const za = ZR + .8, zb = ZP - .8
      win.quad(P(s - 1.05, za), P(s + 1.05, za), P(s + 1.05, zb), P(s - 1.05, zb))
    }
  }
  // Lantern: a glass box on a short stone base, a pyramid, a finial.
  const L = sq(5, PX, PY)
  stone.loft([ringAt(L, ZP + 1), ringAt(L, ZP + 1.8)])
  lantern.loft([ringAt(L, ZP + 1.8), ringAt(L, 253.5)])
  const eave = sq(5.7, PX, PY)
  cap.loft([ringAt(L, 253.5), ringAt(eave, 253.9), ringAt(eave, 254.5)])
  const top = ringAt(eave, 254.5)
  for (let i = 0; i < 4; i++) cap.tri(top[i], top[(i + 1) % 4], [PX, PY, 262])
  const f = sq(.3, PX, PY)
  cap.loft([ringAt(f, 261.4), ringAt(f, 264.4)])
  const ft = ringAt(f, 264.4)
  for (let i = 0; i < 4; i++) cap.tri(ft[i], ft[(i + 1) % 4], [PX, PY, 265.4])
}

const parts = [
  { part: stone, material: finish('cream-limestone', 0xf0e6d4) },
  { part: win, material: { ...PALETTE.window, color: 0x5d7774 } },
  { part: roof, material: PALETTE.roof },
  { part: lantern, material: PALETTE.glass },
  { part: cap, material: finish('lantern-metal', 0xd2d7da, .45) },
]
const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('900 North Michigan', parts, {
  frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [41.899615, -87.62559], bearing: 358.9,
})
if (triangles > 5000 || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out = process.argv[2] ?? new URL('../models/chi-900-north-michigan.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
