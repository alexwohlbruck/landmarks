/**
 * Tower of Justice (Adalet Kulesi), Topkapı Palace, Istanbul (15th c.;
 * the belvedere rebuilt in 1825 under Mahmud II, the windows under
 * Abdülaziz) — original procedural geometry, CC0-1.0.
 * bun generators/istanbul-topkapi-justice-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Bearing 26.7: the tower's walls run at 26.7° / 116.7° in OSM, so
 * it is square to this frame. Anchor = centroid of the OSM outline
 * way/335402653 (building=yes, man_made=tower, name Adalet kulesi,
 * wikidata Q20470393), 28.983341, 41.012458; 8.33 × 8.76 m.
 *
 * The Imperial Council hall (Dîvân-ı Hümâyûn, way/103907772) with its lead
 * roof and broad eaves stands against the tower's foot as a separate OSM
 * building, so it is left to the map: this model is the tower only, from
 * the ground, and the hall's map extrusion hides its lowest storeys as the
 * real hall does.
 *
 * Identity (from the photos below):
 *  1. The tall plain square stone shaft, a small window high on each face.
 *                                                     (gryff2007, kozlenko83)
 *  2. The projecting cornice and balcony where the shaft stops.   (gryff001)
 *  3. The square belvedere: paired columns at the corners and one tall
 *     round-headed window on each face, under an entablature with a
 *     curved (segmental) pediment on every face.        (gryff2007, haklai)
 *  4. The tall pointed lead cone and its gilt finial — the highest point
 *     of the palace.                              (gryff2007, haklai, kozlenko83)
 *
 * Heights: nothing published (tr Wikipedia only says it is the palace's
 * tallest structure). Estimated from kozlenko83 (a level view across the
 * Second Courtyard, scaled by the 8.5 m shaft): finial tip 37 m, cone
 * apex about 35.8 m. Ratios within the upper tower from haklai (a distant
 * view, shaft = 8.5 m): balcony top 17.5 m, belvedere 7.3 m wide and
 * about as tall, to the entablature at 23.8–24.6 m, pediment crowns
 * 25.9 m, cone 4.7 m across at its foot (25.8 m) and 10 m tall, finial
 * 1.2 m. The shaft's foot is
 * hidden by the hall in every photo; the shaft runs plain to the ground.
 *
 * Photos (Wikimedia Commons, evidence):
 *  - gryff2007: Tower of Justice Topkapi 2007.jpg (Gryffindor, public domain)
 *  - gryff001: Tower of Justice Topkapi 2007 001.jpg (Gryffindor, public domain)
 *  - gryffpano: Second Court Topkapi Istanbul 2007 Pano.JPG (Gryffindor, public domain)
 *  - haklai: Tower of Justice (Topkapı Palace)-.jpg (Yair Haklai, CC BY-SA 4.0)
 *  - kozlenko83: 2013-01-02 Topkapı Palace 83.jpg (Maksym Kozlenko, CC BY-SA 4.0)
 *  - joseluiz: Tower of Justice seen from the Second Courtyard of Topkapi
 *    Palace.jpg (José Luiz, CC BY-SA 3.0)
 * No look-only sources. No commercial imagery.
 *
 * Ground: the Second Courtyard is level here; no terrain check (no lidar,
 * no Mapterhorn z15 tiles in Istanbul).
 *
 * Left out: the balcony railing, the window grilles, the column
 * capitals, the brick bands at the foot of the shaft.
 *
 * Night: the tower is floodlit; the belvedere windows glow.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { face } from './bridge-kit'
import { PALETTE, finish } from './palette'

const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), gilt = new Part()
type XY = [number, number]
const ringAt = (pts: XY[], z: number): V3[] => pts.map(([x, y]) => [x, y, z])
/** A rectangle with chamfered corners, counter-clockwise from above. */
const rect = (hx: number, hy: number, c = 0.3): XY[] => [[-hx + c, -hy], [hx - c, -hy], [hx, -hy + c], [hx, hy - c],
  [hx - c, hy], [-hx + c, hy], [-hx, hy - c], [-hx, -hy + c]]
const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, c = 0.08) => {
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  const r = rect((x1 - x0) / 2, (y1 - y0) / 2, c).map(([x, y]) => [x + cx, y + cy] as XY)
  p.loft([ringAt(r, z0), ringAt(r, z1)])
  p.cap(ringAt(r, z1), true)
}
function prism(p: Part, pts: XY[], z0: number, z1: number, top: Part | null = p) {
  p.loft([ringAt(pts, z0), ringAt(pts, z1)])
  if (top) top.cap(ringAt(pts, z1), true)
}
/** A point on face `f` (0 south, 1 east, 2 north, 3 west) of a box of half-sizes hx, hy: s across, z up, d out. */
function onFace(f: number, hx: number, hy: number) {
  const n: XY = ([[0, -1], [1, 0], [0, 1], [-1, 0]] as XY[])[f]
  const t: XY = [-n[1], n[0]]
  const h = f % 2 ? hx : hy
  return (s: number, z: number, d = 0): V3 => [n[0] * (h + d) + t[0] * s, n[1] * (h + d) + t[1] * s, z]
}
const faceN = (f: number): V3 => ([[0, -1, 0], [1, 0, 0], [0, 1, 0], [-1, 0, 0]] as V3[])[f]

const HX = 4.165, HY = 4.38 // the OSM outline, 8.33 × 8.76 m

// 1. Shaft and its windows.
prism(stone, rect(HX, HY, 0.3), 0, 16.2, null)
for (let f = 0; f < 4; f++) {
  const q = onFace(f, HX, HY), n = faceN(f)
  face(win, q(-0.45, 11.6, 0.04), q(0.45, 11.6, 0.04), q(0.45, 13.0, 0.04), q(-0.45, 13.0, 0.04), n)
  face(win, q(-0.4, 6.2, 0.04), q(0.4, 6.2, 0.04), q(0.4, 7.4, 0.04), q(-0.4, 7.4, 0.04), n)
}
// 2. Corbelled cornice and the balcony slab.
stone.loft([ringAt(rect(HX, HY, 0.3), 16.2), ringAt(rect(HX + 0.45, HY + 0.45, 0.3), 16.8)])
prism(trim, rect(HX + 0.45, HY + 0.45, 0.3), 16.8, 17.5, roof)

// 3. Belvedere: walls, corner column pairs, a tall round-headed window per face.
const BH = 3.65, Z0 = 17.5, Z1 = 23.8
prism(stone, rect(BH, BH, 0.2), Z0, Z1, null)
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  // A pair of columns at each corner, read as one bold corner pier 0.25 m proud.
  const xa = sx * (BH - 0.85), xb = sx * (BH + 0.25), ya = sy * (BH - 0.85), yb = sy * (BH + 0.25)
  box(trim, Math.min(xa, xb), Math.max(xa, xb), Math.min(ya, yb), Math.max(ya, yb), Z0, Z1)
}
for (let f = 0; f < 4; f++) {
  const q = onFace(f, BH, BH), n = faceN(f)
  // Columns flanking the window.
  for (const s of [-1.75, 1.75]) {
    const a = q(s - 0.28, Z0, 0), b = q(s + 0.28, Z0, 0.3)
    box(trim, Math.min(a[0], b[0]), Math.max(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[1], b[1]), Z0, Z1, 0.06)
  }
  // The window: 2.1 m wide, sill 18.3 m, round head springing at 21.8 m.
  const w = 1.05, spring = 21.8, pts: V3[] = [q(-w, 18.3, 0.04), q(w, 18.3, 0.04)]
  for (let k = 0; k <= 8; k++) { const t = Math.PI * k / 8; pts.push(q(w * Math.cos(t), spring + w * Math.sin(t), 0.04)) }
  for (let i = 1; i + 1 < pts.length; i++) win.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n])
}
// Entablature.
stone.loft([ringAt(rect(BH, BH, 0.2), Z1), ringAt(rect(BH + 0.35, BH + 0.35, 0.2), Z1 + 0.25)])
prism(trim, rect(BH + 0.35, BH + 0.35, 0.2), Z1 + 0.25, 24.6, roof)

// Segmental pediments, one per face: 7.0 m wide, crown 26.9 m, 0.45 m thick.
for (let f = 0; f < 4; f++) {
  const q = onFace(f, BH + 0.3, BH + 0.3), n = faceN(f)
  const W = 3.5, zb = 24.6, rise = 1.3, R = (W * W + rise * rise) / (2 * rise), zc = zb + rise - R
  const prof: [number, number][] = []
  for (let k = 0; k <= 8; k++) { const s = -W + 2 * W * k / 8; prof.push([s, zc + Math.sqrt(R * R - s * s)]) }
  // Front and back faces (fans from the base midpoint), top strips, ends.
  for (const [d, nn] of [[0, n], [-0.45, [-n[0], -n[1], 0] as V3]] as [number, V3][]) {
    const c = q(0, zb, d)
    const ring = [q(-W, zb, d), ...prof.map(([s, z]) => q(s, z, d)), q(W, zb, d)]
    for (let i = 0; i + 1 < ring.length; i++) {
      const g = [ring[i], ring[i + 1]]
      const cr = [(g[0][1] - c[1]) * (g[1][2] - c[2]) - (g[0][2] - c[2]) * (g[1][1] - c[1]),
        (g[0][2] - c[2]) * (g[1][0] - c[0]) - (g[0][0] - c[0]) * (g[1][2] - c[2])]
      if (cr[0] * nn[0] + cr[1] * nn[1] >= 0) trim.tri(c, g[0], g[1], undefined, undefined, undefined, [nn, nn, nn])
      else trim.tri(c, g[1], g[0], undefined, undefined, undefined, [nn, nn, nn])
    }
  }
  for (let k = 0; k < 8; k++) {
    const [sa, za] = prof[k], [sb, zb2] = prof[k + 1]
    const ms = (sa + sb) / 2, mz = (za + zb2) / 2
    const t: V3 = [-n[1], n[0], 0], ux = ms / R, uz = (mz - zc) / R
    face(trim, q(sa, za, 0), q(sb, zb2, 0), q(sb, zb2, -0.45), q(sa, za, -0.45), [t[0] * ux, t[1] * ux, uz])
  }
}

// 4. Roof: a low hip from the entablature, then the tall lead cone and the finial.
roof.loft([ringAt(rect(BH, BH, 0.2), 24.6), ringAt(rect(2.45, 2.45, 0.2), 25.8)])
const N = 16, RC = 2.35, ZA = 35.8
const cone: V3[] = Array.from({ length: N }, (_, i) => {
  const a = (i + 0.5) / N * Math.PI * 2
  return [RC * Math.cos(a), RC * Math.sin(a), 25.8]
})
const slope = RC / (ZA - 25.8)
for (let i = 0; i < N; i++) {
  const a = cone[i], b = cone[(i + 1) % N]
  const na: V3 = [a[0] / RC, a[1] / RC, slope], nb: V3 = [b[0] / RC, b[1] / RC, slope]
  const m: V3 = [(a[0] + b[0]) / 2 / RC, (a[1] + b[1]) / 2 / RC, slope]
  roof.tri(a, b, [0, 0, ZA], undefined, undefined, undefined, [na, nb, m])
}
roof.cap(ringAt(rect(2.45, 2.45, 0.2), 25.8), true)
// Finial: a gilt ball and rod, bolder than life to survive at phone size.
const ball = (c: V3, r: number) => {
  const pts: V3[] = [[c[0], c[1], c[2] + r], [c[0], c[1], c[2] - r]]
  const eq: V3[] = Array.from({ length: 6 }, (_, i) => [c[0] + r * Math.cos(i * Math.PI / 3), c[1] + r * Math.sin(i * Math.PI / 3), c[2]])
  for (let i = 0; i < 6; i++) {
    const a = eq[i], b = eq[(i + 1) % 6]
    gilt.tri(a, b, pts[0]); gilt.tri(b, a, pts[1])
  }
}
ball([0, 0, 35.9], 0.35)
gilt.loft([ringAt([[-0.1, -0.1], [0.1, -0.1], [0.1, 0.1], [-0.1, 0.1]], 35.5), ringAt([[-0.06, -0.06], [0.06, -0.06], [0.06, 0.06], [-0.06, 0.06]], 37.0)])
ball([0, 0, 36.6], 0.22)

const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : p[2] < 26 ? 0.9 : 0.5)
const parts = [
  { part: stone, material: { ...finish('justice-stone', 0xe4dfd5), floodlight: lit } },
  { part: trim, material: { ...finish('justice-marble', 0xf3f1eb), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: roof, material: finish('justice-lead', 0x98a1aa) },
  { part: gilt, material: finish('justice-gilt', 0xd4b05a, 0.5) },
]
const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('Tower of Justice', parts, {
  frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [41.012458, 28.983341], bearing: 26.7,
})
if (triangles > 5000 || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out = process.argv[2] ?? new URL('../models/istanbul-topkapi-justice-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
