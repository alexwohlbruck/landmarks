/**
 * Rumeli Hisarı (Rumelian Fortress), Istanbul: procedural, CC0-1.0.
 *   bun generators/istanbul-rumeli-hisari.ts
 *
 * Mehmed II's fortress of 1452 on the European shore at the narrows,
 * climbing the hill from the water: the three great towers (Sarıca Paşa to
 * the north and Zağanos Paşa to the south, both round, up the hill; Halil
 * Paşa's twelve-sided tower at the waterfront), each with its narrower upper
 * drum; the crenellated curtain walls following the slope; the small
 * watchtowers on the walls. As photographed in 2025, the towers have no
 * roofs: flat crenellated tops (the original lead cones are lost, and the
 * 2024-25 restoration shows none so far).
 *
 * Uses the kit exported by istanbul-maidens-tower.ts.
 *
 * Frame: x east, y north, z up, metres, bearing 0. Origin at the centroid of
 * the fortress outline (relation/7318154), on the lowest ground under it:
 * the shore road at the foot of the Halil Paşa tower.
 *
 * Sources
 * - OSM (ODbL): relation/7318154 (building=castle, wikidata Q90801): the
 *   courtyard edge of the walls (member way/866220487) and their outer edge
 *   with the tower circles (way/866220486; OSM has the inner/outer roles
 *   swapped). Coastline way/131406027 about 40 m east of the shore wall.
 * - Published: en.wikipedia "Rumelihisarı": Sarıca Paşa tower 23.30 m across,
 *   28 m high; Halil Paşa tower dodecagonal, 23.30 m across, 22 m high;
 *   Zağanos Paşa tower 26.70 m across, 21 m high; walls 250 m north-south;
 *   three main towers, one small, thirteen watchtowers.
 * - Photos (EVIDENCE):
 *   Hamdigumus, "Rumeli Hisarı - Otağtepeden Görünüşü.jpg", CC0,
 *     https://commons.wikimedia.org/wiki/File:Rumeli_Hisar%C4%B1_-_Ota%C4%9Ftepeden_G%C3%B6r%C3%BCn%C3%BC%C5%9F%C3%BC.jpg
 *     (the whole fortress from Otağtepe across the water, east: the main ruler).
 *   Giorgio Galeotti, "Rumeli Hisarı - Istanbul, Turkey - October 11, 2025.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Rumeli_Hisar%C4%B1_-_Istanbul,_Turkey_-_October_11,_2025.jpg
 *   mike, "Rumeli Hisarı Fortress in 2025.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Rumeli_Hisar%C4%B1_Fortress_in_2025.jpg
 *   Dosseman, "Rumeli Hisarı plan in 2006 3599b.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Rumeli_Hisar%C4%B1_plan_in_2006_3599b.jpg (site plan: tower names).
 *
 * Numbers
 * - Plan: OSM, measured; tower diameters published. The tower centres are
 *   moved out from OSM's smaller circles so their inner faces stay put.
 * - Ground: no terrain service here. Estimated from the Otağtepe photo,
 *   scaled by the published tower diameters: the ground rises about 0.4 m
 *   per metre westward from the shore wall, to about 30 m at the Sarıca
 *   tower and 42 m at Zağanos (lead brief: about 50 m over the site). Every
 *   wall and tower runs down to z = 0 (STYLE.md, Ground), so the uphill ones
 *   sink into the hill.
 * - Halil Paşa: the published 22 m is from the courtyard; from the shore
 *   road both 2025 photos give about 30 m to the main parapet and 37 m to
 *   the drum (scaled by its 23.3 m width). Sarıca: 23 m body + 5 m drum
 *   (28 published). Zağanos: 16 m body + 5 m drum (21 published); the body
 *   is drawn from its uphill ground, so it stands taller on the downhill side.
 * - Curtain walls 10 m above their ground, 4 m thick (OSM band 2-5 m);
 *   watchtowers 13 m: photo-scaled. Merlons drawn bolder and sparser than
 *   real (1.6 m, every 3.8 m).
 * - Colour: pale grey limestone and rubble from the daylight photos.
 *
 * Doubts
 * - The ground profile is the largest estimate. The barbican (Hisarpeçe) by
 *   Halil Paşa's tower, the gates and the small mosque minaret inside are
 *   left out (the minaret is its own OSM building, way/866220488).
 * - Watchtower shapes are all drawn round; six are polygonal in reality.
 * - Restoration hoardings in the 2025 photos; caps may be added later.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type P2, TAU, ccw, lathe, merlons, panel, ringMerlons, wall } from './istanbul-maidens-tower'

const A0: P2 = [-49.5, -17.4] // anchor, metres east/north of 29.05671, 41.08492
const C = (e: number, n: number): P2 => [e - A0[0], n - A0[1]]
// The courtyard edge of the walls (way/866220487), counter-clockwise.
const inner = ccw(([[-99.0, -98.8], [-95.0, -90.6], [-82.7, -65.4], [-80.3, -54.8], [-82.3, -45.0], [-83.7, -35.4], [-84.5, -25.8], [-84.7, -15.4], [-84.2, -5.1], [-83.1, 5.2], [-80.6, 21.9], [-78.6, 38.6], [-77.2, 55.3], [-76.2, 72.1], [-81.8, 99.8], [-75.1, 103.8], [-66.7, 106.2], [-55.8, 106.0], [-50.8, 104.6], [-47.0, 99.6], [-40.1, 89.5], [-35.7, 95.0], [-30.3, 95.4], [-27.8, 92.1], [-28.8, 78.0], [-34.9, 30.6], [-24.2, 12.6], [-4.1, -2.3], [-7.4, -27.2], [-2.5, -45.8], [-4.0, -117.4], [-23.4, -112.8], [-38.3, -111.2], [-48.4, -109.1], [-58.7, -103.8], [-69.8, -102.1], [-78.2, -102.7], [-87.2, -109.0], [-92.3, -101.5]] as number[][]).map(([e, n]) => C(e, n)))

// Ground above the shore road, rising westward up the hill.
const g = ([x, y]: P2) => Math.max(0, 0.4 * (-(x + A0[0]) - 4) + 0.03 * -(y + A0[1]))

// Great towers: centre, body radius, body height, drum radius, drum height
// (above the tower's ground), sides (12 for Halil Paşa's polygon).
const great = [
  { name: 'Sarıca Paşa', c: C(-83.5, 115.5), r: 11.65, h: 23, dr: 8.4, dh: 5, n: 20 },
  { name: 'Halil Paşa', c: C(4.5, -7.0), r: 11.65, h: 30, dr: 7.8, dh: 7, n: 12 },
  { name: 'Zağanos Paşa', c: C(-102.5, -114.0), r: 13.35, h: 16, dr: 9.5, dh: 5, n: 20 },
]
// Watchtowers on the walls (OSM's outer-edge bumps), radius 3-4.5 m.
const small: [P2, number][] = [
  [C(-16.5, 11.0), 4.6], [C(-84.5, 65.5), 3.4], [C(-84.0, 31.5), 3.6], [C(-86.5, 0.0), 3.4], [C(-88.0, -26.0), 3.2],
  [C(-86.5, -64.0), 3.4], [C(1.5, -46.0), 3.4], [C(1.5, -82.0), 3.2], [C(0.0, -115.5), 3.4], [C(-33.5, 96.5), 3.4],
]

const stone = new Part(), walk = new Part(), crest = new Part(), glaze = new Part()
const WH = 10, TH = 4
const MO = { w: 1.6, h: 1.3, th: 0.8, pitch: 3.8 }

// --- Curtain walls: each segment of the courtyard edge, set outward by half
// its thickness, top following the ground.
for (let i = 0; i < inner.length; i++) {
  const a = inner[i], b = inner[(i + 1) % inner.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: P2 = [u[1], -u[0]]
  const A: P2 = [a[0] + n[0] * TH / 2, a[1] + n[1] * TH / 2], B: P2 = [b[0] + n[0] * TH / 2, b[1] + n[1] * TH / 2]
  wall(stone, walk, A, B, TH, g(A) + WH, g(B) + WH, TH / 2)
  // Merlons on the outer edge, unless inside a tower.
  const mid: P2 = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
  if (great.some((t) => Math.hypot(mid[0] - t.c[0], mid[1] - t.c[1]) < t.r + 1)) continue
  const oa: P2 = [A[0] + n[0] * (TH / 2 - 0.45), A[1] + n[1] * (TH / 2 - 0.45)], ob: P2 = [B[0] + n[0] * (TH / 2 - 0.45), B[1] + n[1] * (TH / 2 - 0.45)]
  merlons(crest, walk, oa, ob, g(A) + WH, g(B) + WH, { ...MO, end: 1.0 })
}

// --- Great towers: battered body, crenellated parapet, narrower drum with its
// own merlons, slit windows.
for (const t of great) {
  const z0 = g(t.c), zb = z0 + t.h, zd = zb + t.dh, ph = t.n === 12 ? TAU / 24 : 0
  const R = t.n === 12 ? t.r / Math.cos(Math.PI / 12) : t.r
  lathe(stone, t.c[0], t.c[1], [[R + 0.6, 0], [R, zb]], t.n, { phase: ph, facet: t.n === 12 })
  lathe(walk, t.c[0], t.c[1], [[R, zb], [t.dr, zb]], t.n, { phase: ph })
  ringMerlons(crest, walk, t.c[0], t.c[1], t.r - 0.45, zb, Math.round((TAU * t.r) / 3.6), { w: 1.7, h: 1.3, th: 0.9 })
  lathe(stone, t.c[0], t.c[1], [[t.dr, zb - 0.1], [t.dr, zd]], 18)
  lathe(walk, t.c[0], t.c[1], [[t.dr, zd], [0, zd]], 18)
  ringMerlons(crest, walk, t.c[0], t.c[1], t.dr - 0.45, zd, Math.round((TAU * t.dr) / 3.4), { w: 1.6, h: 1.2, th: 0.8 })
  for (let i = 0; i < 8; i++) {
    const a = (TAU * i) / 8 + 0.2, n: V3 = [Math.cos(a), Math.sin(a), 0]
    const rr = (t.n === 12 ? t.r : t.r) + 0.15
    for (const z of [zb - 6, zb - 13]) if (z > z0 - 4) panel(glaze, [t.c[0] + n[0] * rr, t.c[1] + n[1] * rr, z - (i % 2) * 1.5], n, 0.8, 2.0, true, 3)
  }
}

// --- Watchtowers: round, a little above the wall, crenellated.
for (const [c, r] of small) {
  const zt = g(c) + WH + 3
  lathe(stone, c[0], c[1], [[r + 0.3, 0], [r, zt]], 12)
  lathe(walk, c[0], c[1], [[r, zt], [0, zt]], 12)
  ringMerlons(crest, walk, c[0], c[1], r - 0.4, zt, Math.max(5, Math.round((TAU * r) / 3.6)), { w: 1.5, h: 1.2, th: 0.8 })
}

const lit = (p: V3, n: V3): number => (n[2] > 0.85 ? 0.25 : 0.9)
const parts = [
  { part: stone, material: { ...finish('hisar-stone', 0xd3cbbb), floodlight: lit } },
  { part: crest, material: { ...finish('hisar-crest', 0xdcd5c6), floodlight: lit } },
  { part: walk, material: finish('hisar-walk', 0xaea596) },
  { part: glaze, material: { ...PALETTE.window, color: 0x56636e } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name, part.triangles)
const top = Math.max(...great.map((t) => g(t.c) + t.h + t.dh)) + 1.2
console.log('ground at towers', great.map((t) => [t.name, g(t.c).toFixed(1), (g(t.c) + t.h + t.dh).toFixed(1)]))
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Rumeli Hisarı', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 0, osm: 'relation/7318154', height: top,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/istanbul-rumeli-hisari.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
