/**
 * Istanbul University main gate (Seraskerat Kapısı, the old War Ministry
 * gate on Beyazıt Square), Istanbul (1866, for Abdülaziz) — original
 * procedural geometry, CC0-1.0.
 * bun generators/istanbul-university-gate.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Bearing 349: the gate's long front faces the square to the
 * south (compass 169°), −y here; its front wall runs at 79° in OSM.
 * Anchor = centroid of the OSM outline way/110016998 (building=yes,
 * historic=building, name Seraskerlik Kapısı, wikidata Q134728582 —
 * "Istanbul University Seraskerat Gate", checked), 28.964231, 41.010991.
 * The two "Kapı Köşkü" pavilions in OSM (way/110016988, way/110017005,
 * Q132081845/Q132081843) stand 45 m either side and are separate
 * buildings, left to the map.
 *
 * Plan (OSM, © OpenStreetMap contributors, ODbL, read in this frame): the
 * outline is 31.5 m wide, symmetric about x = −0.2: a central arch block
 * 16.4 m wide from y −5.3 (front) to 6.1 (back), and a turreted pavilion
 * each side, x ±8.2…±16, y −9.0…7.9, its four corners cut back about
 * 2.4 m.
 *
 * Identity (from the photos below):
 *  1. The great horseshoe arch in the middle, its voussoirs striped red
 *     and white, a smaller horseshoe arch each side, all three real
 *     passages, between green marble columns.       (haklai, sezenkerem, medelam)
 *  2. The tall central block: latticed panels over the side arches, three
 *     green-and-gold inscription panels, moulded friezes, and a stepped,
 *     crenellated crest with the tughra medallion.   (haklai, medelam)
 *  3. The two lower crenellated pavilions with cut corners, a corbelled
 *     arched frieze under the merlons, a clock on the front, arched windows
 *     above and pointed doorways below.              (haklai, medelam, danbury)
 *  4. Pale grey-cream limestone.                     (all photos)
 *
 * Heights (estimated from medelam, a distant near-level view, scaled by
 * the OSM central width of 16.4 m): central cornice 16.6 m, crest to
 * 17.9 m; pavilions' merlon tops 11.1 m (crenel floor 10.4 m). From haklai
 * (closer, frontal): main arch 5.1 m across at its widest, its centre at
 * 6.1 m, apex 8.65 m; side arches 2.3 m across, apex 5.45 m; inscription
 * panels 10.2–11.6 m; lattice panels 6.0–9.8 m; pavilion windows
 * 4.6–7.1 m, clock 8.4 m, doorways to 3.4 m. Nothing published.
 *
 * Photos (Wikimedia Commons, evidence):
 *  - haklai: Main gate of Istanbul University-.jpg (Yair Haklai, CC BY-SA 4.0)
 *  - medelam: Istanbul University Entrance Gate, 2025.jpg (Medelam, CC BY-SA 4.0)
 *  - sezenkerem: İstanbul Üniversitesi Seraskerat Kapısı.jpg (Sezenkerem,
 *    CC BY-SA 3.0)
 *  - danbury: İstanbul Üniversitesi.JPG (Danbury, CC BY-SA 3.0)
 *  - botev: Main gate of Istanbul University.jpg (Radosław Botev, CC BY 3.0 pl)
 * No look-only sources. No commercial imagery.
 *
 * Ground: the gate stands on a terrace above the square, reached by
 * steps; the terrace and steps are the map's (not modelled). No terrain
 * check (no lidar, no Mapterhorn z15 tiles in Istanbul).
 *
 * Left out: the gilt lettering "T.C. İSTANBUL ÜNİVERSİTESİ", the lattice
 * pattern itself (a grey panel), the iron gates, the lamps, the clock
 * hands, the muqarnas of the friezes.
 *
 * Doubts: the campus (north) side is not in any photo used; it is drawn
 * with the same arches and rings but without the inscriptions.
 *
 * Night: the gate is floodlit.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { slab, panel, box, earcut } from './istanbul-topkapi-imperial-gate'

const stone = new Part(), marble = new Part(), red = new Part(), green = new Part(), win = new Part(), lattice = new Part()
type XZ = [number, number]
type XY = [number, number]
const XC = -0.2 // the outline's axis of symmetry

/** A round horseshoe arch: circle radius a centred at (c, zc), carried `below` radians under its centre. */
function horseshoe(c: number, a: number, z0: number, zc: number, below = 0.44, seg = 10): XZ[] {
  const p: XZ[] = [[c - a * Math.cos(below), z0]]
  for (let k = 0; k <= seg; k++) {
    const t = Math.PI + below - (Math.PI + 2 * below) * k / seg
    p.push([c + a * Math.cos(t), zc + a * Math.sin(t)])
  }
  p.push([c + a * Math.cos(below), z0])
  return p
}
/** Striped voussoirs round a horseshoe arch, flush on a face at y, alternating red and white. */
function voussoirs(c: number, a: number, w: number, zc: number, y: number, out: number, below = 0.44, n = 13) {
  for (let k = 0; k < n; k++) {
    const t0 = Math.PI + below - (Math.PI + 2 * below) * k / n, t1 = Math.PI + below - (Math.PI + 2 * below) * (k + 1) / n
    const pts: XZ[] = [[c + a * Math.cos(t0), zc + a * Math.sin(t0)], [c + (a + w) * Math.cos(t0), zc + (a + w) * Math.sin(t0)],
      [c + (a + w) * Math.cos(t1), zc + (a + w) * Math.sin(t1)], [c + a * Math.cos(t1), zc + a * Math.sin(t1)]]
    // Counter-clockwise in (x, z) seen from the front (−y).
    const ccw = ((pts[1][0] - pts[0][0]) * (pts[2][1] - pts[0][1]) - (pts[1][1] - pts[0][1]) * (pts[2][0] - pts[0][0])) > 0
    panel(k % 2 ? marble : red, ccw ? pts : pts.slice().reverse(), y, out)
  }
}
const ringAt = (pts: XY[], z: number): V3[] => pts.map(([x, y]) => [x, y, z])
function prism(p: Part, pts: XY[], z0: number, z1: number, top: Part | null = p) {
  p.loft([ringAt(pts, z0), ringAt(pts, z1)])
  if (top) top.cap(ringAt(pts, z1), true)
}
const shift = (pts: XY[]) => pts.map(([x, y]) => [x + XC, y] as XY)
/** Flat panel helper in the gate's own x (shifted to XC). */
const pnl = (p: Part, pts: XZ[], y: number, out: number) => panel(p, pts.map(([x, z]) => [x + XC, z] as XZ), y, out)

// --- Central block with three real passages.
const YF = -5.3, YB = 6.1, ZC = 16.6
const main = horseshoe(XC, 2.55, 0, 6.1), sideL = horseshoe(XC - 5.6, 1.15, 0, 4.3), sideR = horseshoe(XC + 5.6, 1.15, 0, 4.3)
slab(XC - 8.2, XC + 8.2, YF, YB, 0, ZC, [sideL, main, sideR], stone, stone, stone, null, stone)
// Friezes: two moulded bands proud of the face, all round the block.
for (const [z0, z1, e] of [[12.0, 12.5, 0.15], [14.6, 15.3, 0.2], [ZC - 0.3, ZC + 0.1, 0.3]] as [number, number, number][])
  box(marble, XC - 8.2 - e, XC + 8.2 + e, YF - e, YB + e, z0, z1, z1 > ZC ? stone : marble)
// Crest: a stepped, crenellated block over the middle with the tughra medallion.
box(stone, XC - 3.4, XC + 3.4, YF + 0.3, YB - 0.3, ZC + 0.1, 17.1, stone)
for (let k = -2; k <= 2; k++) box(stone, XC + k * 1.35 - 0.4, XC + k * 1.35 + 0.4, YF + 0.3, YF + 1.0, 17.1, 17.9, stone)
for (const s of [-1, 1]) box(stone, XC + s * 4.1 - 0.35, XC + s * 4.1 + 0.35, YF + 0.3, YF + 0.9, ZC + 0.1, 17.2, stone)
for (const [y, out] of [[YF - 0.04, -1], [YB + 0.04, 1]] as [number, number][]) {
  // Striped voussoirs: main arch 0.75 m deep, side arches 0.45 m.
  voussoirs(XC, 2.55, 0.75, 6.1, y, out)
  voussoirs(XC - 5.6, 1.15, 0.45, 4.3, y, out, 0.44, 9)
  voussoirs(XC + 5.6, 1.15, 0.45, 4.3, y, out, 0.44, 9)
  // Lattice panels over the side arches.
  for (const cx of [-5.65, 5.65]) pnl(lattice, [[cx - 1.35, 6.4], [cx + 1.35, 6.4], [cx + 1.35, 9.8], [cx - 1.35, 9.8]], y, out)
  if (out > 0) continue
  // The three green-and-gold inscription panels and the tughra medallion (front only).
  for (const [x0, x1] of [[-7.0, -4.3], [-3.3, 3.3], [4.3, 7.0]]) pnl(green, [[x0, 10.2], [x1, 10.2], [x1, 11.6], [x0, 11.6]], y, out)
  const med: XZ[] = Array.from({ length: 10 }, (_, k) => [Math.cos(k * Math.PI / 5) * 0.9, 15.95 + Math.sin(k * Math.PI / 5) * 0.55])
  pnl(green, med, y, out)
}
// Green marble columns flanking the side arches, front and back, with capitals.
for (const y of [YF - 0.45, YB + 0.45]) for (const x of [-7.15, -4.15, -3.2, 3.2, 4.15, 7.15]) {
  const oct = (r: number): XY[] => Array.from({ length: 8 }, (_, k) => [XC + x + r * Math.cos((k + 0.5) * Math.PI / 4), y + r * Math.sin((k + 0.5) * Math.PI / 4)])
  prism(green, oct(0.32), 0, 4.0, null)
  prism(marble, oct(0.45), 4.0, 4.7)
  prism(marble, oct(0.42), 0, 0.5)
}

// --- Pavilions: chamfered blocks, crenellated, corbelled frieze, windows.
for (const sx of [-1, 1]) {
  const xi = 8.2, xo = 16.0, y0 = -9.0, y1 = 7.9, c = 2.4
  const plan = (e: number): XY[] => {
    const a = xi - e * 0, b = xo + e
    const pts: XY[] = [[a, y0 - e], [b - c, y0 - e], [b, y0 + c - e], [b, y1 - c + e], [b - c, y1 + e], [a, y1 + e]]
    return shift(sx > 0 ? pts : pts.map(([x, y]) => [-x, y] as XY).reverse())
  }
  prism(stone, plan(0), 0, 9.4, null)
  // Corbel table: a band 0.3 m proud, and the parapet with merlons.
  stone.loft([ringAt(plan(0), 9.4), ringAt(plan(0.3), 9.9)])
  prism(stone, plan(0.3), 9.9, 10.4)
  const P = plan(0.3)
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (Math.abs(a[0] - (XC + sx * 8.2)) < 0.01 && Math.abs(b[0] - (XC + sx * 8.2)) < 0.01) continue // the side against the arch block
    const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
    const m = Math.max(1, Math.round(L / 1.15))
    for (let k = 0; k < m; k++) {
      const s0 = L * (k + 0.2) / m, s1 = L * (k + 0.8) / m
      const q = (s: number, d: number): XY => [a[0] + ux * s - nx * d, a[1] + uy * s - ny * d]
      prism(stone, [q(s0, 0), q(s1, 0), q(s1, 0.5), q(s0, 0.5)], 10.4, 11.1)
    }
  }
  // Front face (y0): two arched windows, two pointed doorways, the clock.
  const xs = [10.6, 13.6].map((x) => sx * x)
  for (const x of xs) {
    pnl(win, horseshoe(x, 0.5, 4.6, 6.6, 0, 6).slice().reverse(), y0 - 0.04, -1)
    pnl(win, horseshoe(x, 0.85, 0, 2.6, 0, 6).slice().reverse(), y0 - 0.04, -1)
  }
  const clock: XZ[] = Array.from({ length: 10 }, (_, k) => [sx * 12.1 + 0.55 * Math.cos(k * Math.PI / 5), 8.45 + 0.55 * Math.sin(k * Math.PI / 5)])
  pnl(marble, clock, y0 - 0.05, -1)
  // Back face (y1): the same openings.
  for (const x of xs) {
    pnl(win, horseshoe(x, 0.5, 4.6, 6.6, 0, 6).slice().reverse(), y1 + 0.04, 1)
    pnl(win, horseshoe(x, 0.85, 0, 2.6, 0, 6).slice().reverse(), y1 + 0.04, 1)
  }
  // Outer side face (x = ±16): two windows and a doorway.
  const xo2 = XC + sx * (16.0 + 0.04), nrm: V3 = [sx, 0, 0]
  for (const [yy, z0, zs, w] of [[-3.0, 4.6, 6.6, 0.5], [3.0, 4.6, 6.6, 0.5], [0, 0, 2.6, 0.85]] as number[][]) {
    const prof = horseshoe(0, w, z0, zs, 0, 6).slice().reverse()
    const tris = earcut(prof)
    const P3 = (i: number): V3 => [xo2, yy + prof[i][0] * sx, prof[i][1]]
    for (const [a, b, cc] of tris) win.tri(P3(a), P3(b), P3(cc), undefined, undefined, undefined, [nrm, nrm, nrm])
  }
}

const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : n[1] < -0.5 ? 0.95 : 0.7)
const parts = [
  { part: stone, material: { ...finish('university-stone', 0xe3dccd), floodlight: lit } },
  { part: marble, material: { ...finish('university-marble', 0xf3f0e8), floodlight: lit } },
  { part: red, material: { ...finish('university-ablaq-red', 0xd2a093), floodlight: lit } },
  { part: green, material: finish('university-green-marble', 0x6f8b7c, 0.5) },
  { part: win, material: PALETTE.window },
  { part: lattice, material: finish('university-lattice', 0xb9b2a5) },
]
const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('Istanbul University Gate', parts, {
  frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [41.010991, 28.964231], bearing: 349,
})
if (triangles > 5000 || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out = process.argv[2] ?? new URL('../models/istanbul-university-gate.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
