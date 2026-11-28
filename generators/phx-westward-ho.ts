/**
 * Westward Ho, Phoenix (1928, Fisher, Lake & Traver; broadcast mast 1949),
 * a hotel now senior housing — original procedural geometry, CC0-1.0.
 * bun generators/phx-westward-ho.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * anchor. Bearing 0: OSM's walls run within a degree of north–south.
 * Anchor -112.0745618, 33.4551692, the centroid of OSM way/37057962
 * ("Westward Ho", 618 N Central Avenue), which covers the whole block: the
 * cross-shaped tower on Central Avenue (east) and the low ranges round the
 * courtyard to the west.
 *
 * Identity (from the photos below):
 *  1. The tall red-and-white lattice broadcast mast on the roof: four legs
 *     splayed wide over the top stage, narrowing fast into a slender mast
 *     about as tall again as the building.          (afar, top, t1929)
 *  2. The pink "WESTWARD HO" letters standing on the roof, round the top
 *     stage under the mast's legs; lit at night.          (top, afar)
 *  3. A cross-plan tower in pale grey-beige stucco: four 11-storey wings
 *     round a 16-storey centre, stepping to a top stage with big windows.
 *                                                        (t1929, afar)
 *  4. Low two- and three-storey ranges round a courtyard, west.   (afar)
 *
 * Plan: the podium is OSM way/37057962 as drawn. The tower is placed from
 * the lidar, moved 1.5 m west (the lidar sits that far east of OSM on this
 * block, as on the others downtown), and made symmetric about its centre
 * (29.5, -9): wings x 7.7..51.3 by y -17..-1, and y -39..21 by x
 * 20.5..38.5; the centre x 20.5..38.5, y -23..5; the upper centre and top
 * stage smaller, as the lidar shows. The mast's foot is centred at
 * (32, -9), 2.5 m east of the tower's axis, where the lidar puts its top
 * (p-top shows the legs landing off-centre too).
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (2020 flight), 1 m and
 * 2 m reads; the street 331.3 m is y = 0 (Mapterhorn flat within 0.7 m).
 * Measured (model metres): the wings 37.5 (the north wing 39.5); the centre
 * 52.5; the upper centre 57.5; the top stage 63.5; the mast's top 137; the
 * west range 14, the north range 13, the middle range 12, the rest of the
 * podium 9. Published: 16 storeys, 1928; the mast added later for KTAR/
 * KPHO television (Wikipedia, "Westward Ho (Phoenix, Arizona)").
 * Estimated from the "afar" photo scaled to the lidar: the mast's profile
 * (legs 9 m apart on the top stage's roof, 6 m at 72 m, 2.5 m at 96 m, then a slender
 * mast), its paint bands; the letters 1.35 m tall, traced from "top"
 * (a bold upright sans: pointed W's, round O); the window rhythm.
 *
 * Photos (evidence, Wikimedia Commons):
 *  afar   "Westward Ho Afar.jpg", Alan Stark, CC BY-SA 2.0, at night from
 *         the east across the park: the whole mast, the sign, the ranges
 *         https://commons.wikimedia.org/wiki/File:Westward_Ho_Afar.jpg
 *  t1929  "Phoenix-Westward Ho Hotel-1929.jpg", Marine 69-71, CC BY-SA 3.0,
 *         from the south-east on Central: the wings, the top stage, the mast
 *         https://commons.wikimedia.org/wiki/File:Phoenix-Westward_Ho_Hotel-1929.jpg
 *  top    "Westward Ho Building Tower Top.jpg", Alan Levine, CC BY 2.0: the
 *         top stage, the letters and the mast's legs
 *         https://commons.wikimedia.org/wiki/File:Westward_Ho_Building_Tower_Top.jpg
 *  lajurgen "Westward Ho Hotel.jpg", Lajurgen, CC BY-SA 4.0 (looked at for
 *         the colour) https://commons.wikimedia.org/wiki/File:Westward_Ho_Hotel.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the letters are seen on two faces (top); they are drawn on all
 * four. The mast is drawn as legs and bracing to 96 m and a solid tapering
 * mast above (the real one is lattice all the way). The courtyard ranges'
 * red tile roofs and their windows are drawn plain. The ornament round the
 * wings' top windows and the entrance canopy's ironwork are left out.
 *
 * Night: the tower's stucco is floodlit and its windows glow; the letters
 * are neon pink.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, ccw, cornice, onWall, prism, rectShape, save, type XY } from './atl-tech-tower'
import { Pen, strokes } from './lettering'
import { curtain, exposed, type Block } from './phx-chase-tower'

const stucco = new Part(), trim = new Part(), win = new Part(), red = new Part(), pink = new Part(), door = new Part()

// ── The podium: the OSM outline, 9 m, with the higher ranges ──
const OUTLINE: XY[] = ccw([[2.53, 59.99], [2.46, 46.40], [2.39, 31.63], [-8.62, 31.70], [-8.67, 45.93], [-11.68, 45.93], [-11.66, 48.83], [-29.22, 48.95], [-29.17, 19.90], [-27.46, 19.89], [-27.57, 12.59], [-28.56, 12.57], [-28.59, 9.22], [-27.37, 9.19], [-27.41, -3.07], [-26.65, -4.70], [-26.68, -10.36], [3.86, -10.31], [5.91, -6.82], [8.01, -6.79], [8.00, -2.81], [5.01, -2.76], [3.22, 0.60], [2.36, 4.18], [2.03, 8.13], [2.68, 13.58], [3.46, 16.55], [4.94, 19.72], [6.74, 19.78], [6.79, 23.77], [11.04, 23.80], [11.04, 26.18], [16.83, 26.17], [16.86, 23.83], [41.69, 23.9], [41.71, 18.72], [51.31, 18.76], [51.18, -37.24], [8.34, -37.10], [8.34, -40.04], [-40.19, -39.96], [-40.01, 34.05], [-39.51, 59.85]])
const PODIUM: Block = { ring: OUTLINE, z0: 0, z1: 9 }
const WESTR: Block = { ring: ccw([[-40.0, -10.3], [-29.2, -10.3], [-29.2, 48.9], [-39.8, 48.9]]), z0: 0, z1: 14 }
const NORTHR: Block = { ring: ccw([[-39.8, 48.9], [2.5, 48.9], [2.53, 59.99], [-39.51, 59.85]]), z0: 0, z1: 13 }
const MIDR: Block = { ring: ccw([[-8.65, 31.7], [2.4, 31.63], [2.46, 48.9], [-8.67, 48.9]]), z0: 0, z1: 12 }

// ── The tower ──
const CX = 29.5, CY = -9
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
const WINGW: Block = { ring: rect(7.7, 20.5, -17, -1), z0: 0, z1: 37.5 }
const WINGE: Block = { ring: rect(38.5, 51.3, -17, -1), z0: 0, z1: 37.5 }
const WINGN: Block = { ring: rect(20.5, 38.5, 5, 21), z0: 0, z1: 39.5 }
const WINGS: Block = { ring: rect(20.5, 38.5, -39, -23), z0: 0, z1: 37.5 }
const CENTRE: Block = { ring: rect(20.5, 38.5, -23, 5), z0: 0, z1: 52.5 }
const UPPER: Block = { ring: rect(20.5, 38.5, -17, -1), z0: 52.5, z1: 57.5 }
const STAGE: Block = { ring: rect(22.5, 36.5, -15, -3), z0: 57.5, z1: 63.5 }
const LOW = [PODIUM, WESTR, NORTHR, MIDR]
const TOWER = [WINGW, WINGE, WINGN, WINGS, CENTRE, UPPER, STAGE]
const ALL = [...LOW, ...TOWER]

for (const b of LOW) prism(stucco, b.ring, 0, b.z1, stucco, 0.3)
for (const b of TOWER) {
  prism(stucco, b.ring, b.z0, b.z1, stucco, 0.35)
  cornice(trim, b.ring, b.z1 - 1.3, 0.6, 0.3, null)
}

// ── Windows ──
// The tower: a panel per window column, two storeys a panel (3.2 m floors
// over a 6 m ground storey); the top stage a band of big windows.
const FL = 3.2, G0 = 6.4
for (const b of [WINGW, WINGE, WINGN, WINGS, CENTRE, UPPER]) {
  for (const [a, c, zf] of exposed(b, ALL)) curtain(win, a, c, Math.max(zf, G0), b.z1 - 1.6, { group: FL * 2, gap: 1.7, bay: 3.0, mull: 1.6, zBase: G0, margin: 1.0 })
}
for (const [a, c] of exposed(STAGE, ALL)) curtain(win, a, c, 58.6, 62.2, { group: 3.6, gap: 0, bay: 2.8, mull: 0.5, margin: 0.8 })
// the low ranges: a panel per window, one storey a band
for (const b of LOW) {
  for (const [a, c, zf] of exposed(b, ALL)) {
    if (zf >= b.z1 - 3) continue
    curtain(win, a, c, Math.max(zf, 1.0), b.z1 - 1.2, { group: b === PODIUM ? 4.2 : 4.4, gap: 2.0, bay: 3.6, mull: 2.0, zBase: 1.0, margin: 1.5 })
  }
}
// entrances: Central Avenue (the east wing's foot) and the south wing
onWall(door, [51.3, -17], [51.3, -1], rectShape(5, 11, 0, 4.4), 0.06)
onWall(door, [38.5, -39], [20.5, -39], rectShape(6, 12, 0, 4.4), 0.06)
box(trim, 51.3, 53.3, -9.5 - 4, -9.5 + 4, 4.4, 5.0, trim, 0.1) // the canopy

// ── The sign: WESTWARD HO in bold upright capitals, standing on the roof
// edge of the top stage, on every face ──
type Glyph = [(p: Pen, x: number) => void, number]
const G: Record<string, Glyph> = {
  W: [(p, x) => { p.moveTo([x, 1]).lineTo([x + 0.24, 0]).lineTo([x + 0.5, 0.82]).lineTo([x + 0.76, 0]).lineTo([x + 1, 1]) }, 1],
  E: [(p, x) => { p.moveTo([x + 0.56, 1]).lineTo([x, 1]).lineTo([x, 0]).lineTo([x + 0.56, 0]); p.moveTo([x, 0.52]).lineTo([x + 0.46, 0.52]) }, 0.56],
  S: [(p, x) => { p.moveTo([x + 0.56, 0.84]).cubicTo([x + 0.48, 1.02], [x + 0.02, 1.02], [x + 0.02, 0.74], 3).cubicTo([x + 0.02, 0.5], [x + 0.58, 0.54], [x + 0.58, 0.26], 4).cubicTo([x + 0.58, -0.03], [x + 0.08, -0.03], [x, 0.16], 3) }, 0.58],
  T: [(p, x) => { p.moveTo([x, 1]).lineTo([x + 0.6, 1]); p.moveTo([x + 0.3, 1]).lineTo([x + 0.3, 0]) }, 0.6],
  A: [(p, x) => { p.moveTo([x, 0]).lineTo([x + 0.33, 1]).lineTo([x + 0.66, 0]); p.moveTo([x + 0.13, 0.36]).lineTo([x + 0.53, 0.36]) }, 0.66],
  R: [(p, x) => { p.moveTo([x, 0]).lineTo([x, 1]).lineTo([x + 0.32, 1]).cubicTo([x + 0.64, 1], [x + 0.64, 0.5], [x + 0.32, 0.5], 4).lineTo([x, 0.5]); p.moveTo([x + 0.3, 0.5]).lineTo([x + 0.6, 0]) }, 0.6],
  D: [(p, x) => { p.moveTo([x, 0]).lineTo([x, 1]).lineTo([x + 0.24, 1]).cubicTo([x + 0.68, 1], [x + 0.68, 0], [x + 0.24, 0], 5).lineTo([x, 0]) }, 0.6],
  H: [(p, x) => { p.moveTo([x, 0]).lineTo([x, 1]); p.moveTo([x + 0.58, 0]).lineTo([x + 0.58, 1]); p.moveTo([x, 0.52]).lineTo([x + 0.58, 0.52]) }, 0.58],
  O: [(p, x) => { p.circle([x + 0.34, 0.5], 0.34, 0.5, 10) }, 0.68],
  ' ': [() => {}, 0.3],
}
const word = new Pen()
let ux = 0
for (const ch of 'WESTWARD HO') { G[ch][0](word, ux); ux += G[ch][1] + 0.24 }
const wordW = ux - 0.24, CAP = 1.3
// one sign per face of the top stage, centred, standing on its roof edge
const faces: Array<[XY, XY]> = [[[22.5, -15], [36.5, -15]], [[36.5, -15], [36.5, -3]], [[36.5, -3], [22.5, -3]], [[22.5, -3], [22.5, -15]]]
for (const [a, b] of faces) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const scale = Math.min(CAP, (L + 1.6) / wordW), s0 = L / 2 - (wordW * scale) / 2
  const place = (u: number, v: number, w: number): V3 => {
    const s = s0 + u * scale, d = -0.6 + w * scale
    return [a[0] + t[0] * s + n[0] * d, a[1] + t[1] * s + n[1] * d, 63.5 + 0.3 + v * scale]
  }
  strokes(pink, word.paths, { width: 0.2, depth: 0.2, place, back: true })
}

// ── The mast: four legs splayed over the top stage, braced, narrowing into
// a slender mast; red and white bands ──
const MX = 32, MY = -9, TOPZ = 137
const prof: [number, number][] = [[63.5, 4.5], [72, 3.0], [83, 2.0], [96, 1.25]]
const legAt = (k: number, i: number): V3 => {
  const [z, h] = prof[k], sx = i === 0 || i === 3 ? -1 : 1, sy = i < 2 ? -1 : 1
  return [MX + sx * h, MY + sy * h, z]
}
// a bar between two points: a square section of side w
function bar(p: Part, A: V3, B: V3, w: number) {
  const d: V3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], L = Math.hypot(...d)
  const u: V3 = Math.abs(d[2]) / L > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const cr = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  const nz = (v: V3): V3 => { const l = Math.hypot(...v); return [v[0] / l, v[1] / l, v[2] / l] }
  const e1 = nz(cr(d, u)), e2 = nz(cr(d, e1)), h = w / 2
  const off = (P: V3, a: number, b: number): V3 => [P[0] + e1[0] * a + e2[0] * b, P[1] + e1[1] * a + e2[1] * b, P[2] + e1[2] * a + e2[2] * b]
  const ca = [off(A, -h, -h), off(A, h, -h), off(A, h, h), off(A, -h, h)], cb = [off(B, -h, -h), off(B, h, -h), off(B, h, h), off(B, -h, h)]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const o: V3 = [(ca[i][0] + ca[j][0]) / 2 - A[0], (ca[i][1] + ca[j][1]) / 2 - A[1], (ca[i][2] + ca[j][2]) / 2 - A[2]]
    const nn = cr([ca[j][0] - ca[i][0], ca[j][1] - ca[i][1], ca[j][2] - ca[i][2]], [cb[i][0] - ca[i][0], cb[i][1] - ca[i][1], cb[i][2] - ca[i][2]])
    if (nn[0] * o[0] + nn[1] * o[1] + nn[2] * o[2] > 0) p.quad(ca[i], ca[j], cb[j], cb[i])
    else p.quad(ca[i], cb[i], cb[j], ca[j])
  }
}
for (let k = 0; k < prof.length - 1; k++) {
  const part = k % 2 === 0 ? red : trim
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    bar(part, legAt(k, i), legAt(k + 1, i), 0.6)
    bar(red, legAt(k + 1, i), legAt(k + 1, j), 0.45) // the ring at the top of the section
    bar(red, legAt(k, i), legAt(k + 1, j), 0.3) // an X of bracing on each face
    bar(red, legAt(k, j), legAt(k + 1, i), 0.3)
  }
}
// the slender mast above: a tapering square shaft in red and white bands
const bands = 7, z0 = 96, h0 = 1.25, h1 = 0.3
for (let b = 0; b < bands; b++) {
  const za = z0 + ((TOPZ - 2 - z0) * b) / bands, zb = z0 + ((TOPZ - 2 - z0) * (b + 1)) / bands
  const ha = h0 + ((h1 - h0) * b) / bands, hb = h0 + ((h1 - h0) * (b + 1)) / bands
  const p = b % 2 === 0 ? red : trim
  const ra: V3[] = [[MX - ha, MY - ha, za], [MX + ha, MY - ha, za], [MX + ha, MY + ha, za], [MX - ha, MY + ha, za]]
  const rb: V3[] = [[MX - hb, MY - hb, zb], [MX + hb, MY - hb, zb], [MX + hb, MY + hb, zb], [MX - hb, MY + hb, zb]]
  p.loft([ra, rb])
  if (b === bands - 1) p.cap(rb, true)
}
bar(red, [MX, MY, TOPZ - 2.2], [MX, MY, TOPZ], 0.25)

const lit = (p: V3, n: V3) => (p[2] > 30 && n[2] < 0.5 ? 0.7 : n[2] < 0.5 ? 0.3 : 0)
await save('phx-westward-ho', 'Westward Ho', [
  { part: stucco, material: { ...finish('westward-stucco', 0xd8d1c3), floodlight: lit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: (p) => (p[2] < 64 ? 0.5 : 0) } },
  { part: win, material: PALETTE.window },
  { part: red, material: finish('westward-mast-red', 0xc8603f) },
  { part: pink, material: finish('neon-westward-pink', 0xe2679f) },
  { part: door, material: { ...PALETTE.entrance, color: 0x7b6a58 } },
], { height: TOPZ, anchor: [33.4551692, -112.0745618], bearing: 0 }, 6500)
