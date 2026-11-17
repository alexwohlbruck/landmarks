/**
 * Yedikule Fortress (Fortress of the Seven Towers), Istanbul: procedural,
 * CC0-1.0.
 *   bun generators/istanbul-yedikule-fortress.ts
 *
 * Mehmed II's treasury fort of about 1457 built against the Theodosian land
 * walls at the Golden Gate: a pentagon of high crenellated curtain walls with
 * three round Ottoman towers (north, east, south), each with a narrower
 * crenellated drum on top; on the west, the land wall with the Golden Gate's
 * two square marble pylons and the triple gate between them, the round
 * land-wall tower at the north-west corner and a square land-wall tower at
 * the south-west corner; the outer wall before the gate. No roofs: flat
 * crenellated tops (photos 2014-2025).
 *
 * Uses the kit exported by istanbul-maidens-tower.ts.
 *
 * Frame: x east, y north, z up, metres, bearing 0. Origin at the centroid of
 * the fortress outline (way/1035943038), on its lowest ground (the south
 * side, toward the Sea of Marmara).
 *
 * Sources
 * - OSM (ODbL): fortress outline way/1035943038 (historic=castle, "Yedikule
 *   Zindanları", wikidata Q632795: it is the whole fortress, not only the
 *   dungeons); towers way/23272351 (north, "Tower of Cannon"), way/23272349
 *   (east), way/23272345 (south), way/23272337 (north-west land-wall tower);
 *   Golden Gate pylons way/23272338 and way/23272340 ("Porta Aurea");
 *   outer wall way/1485553552; land wall way/1478722718. All historic=ruins.
 * - Published: en.wikipedia "Yedikule Fortress": two towers and two pylons
 *   of the Porta Aurea inherited from the city walls, three round towers
 *   added, an almost pentagonal plan.
 * - Photos (EVIDENCE):
 *   Canercangul, "Yedikule Hisarı Hazine Kulesi.jpg", "Yedikule Hisarı Top Kulesi.jpg",
 *     "Yedikule Hisarı Zindan Kulesi.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Yedikule_Hisar%C4%B1_Hazine_Kulesi.jpg
 *   Elif Erol9, "YEDİKULE HİSARI.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:YED%C4%B0KULE_H%C4%B0SARI.jpg (courtyard from a tower).
 *   Richard Nevell, "Yedikule Fortress, September 2025 06.jpg" and "07", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Yedikule_Fortress,_September_2025_07.jpg (pylon and walls).
 *   Mister No, "Yedikule Hisari - panoramio.jpg", CC BY 3.0,
 *     https://commons.wikimedia.org/wiki/File:Yedikule_Hisari_-_panoramio.jpg (round tower and walls).
 *   Dick Osseman, "Yedikule-2.jpg", CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Yedikule-2.jpg (round tower and drum).
 *
 * Numbers
 * - Plan: OSM, measured; tower radii from OSM areas (9.4, 8.7, 8.2 m, the
 *   north-west tower 6.5 m); pylons from their OSM outlines.
 * - Heights photo-scaled, none published: curtain walls 12 m; round towers
 *   20 m body with a 4.5 m drum of 0.65 the radius (Canercangul's Hazine photo: body 1.7 and drum top 1.9 times the wall); pylons 20 m; the gate wall
 *   between them 15 m; the land-wall towers 17 m; the outer wall 6 m. Merlon caps are brick, as in
 *   the photos.
 * - The south-west land-wall tower is not in OSM: placed where the south
 *   wall meets the land wall, 10 m square (the seventh tower; estimated).
 * - Ground: no terrain service here; the courtyard is a level lawn in the
 *   photos, the site falls gently south: 4 m over 200 m, estimated. Walls run
 *   down to z = 0.
 *
 * Doubts
 * - Heights are estimates from close photos. The Zindan tower reads
 *   faceted in one photo; all three are drawn round.
 * - The small mosque and its minaret inside the court are left to the map.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type P2, TAU, ccw, centroid, lathe, merlons, obox, panel, prism, ringMerlons, wall } from './istanbul-maidens-tower'

const RAW = [[2.1, 95.9], [6.6, 96.0], [7.6, 94.6], [31.4, 61.4], [51.7, 45.8], [67.8, 33.5], [69.6, 30.0], [71.3, 28.4], [55.5, -8.3], [51.4, -60.4], [50.3, -61.7], [4.5, -70.2], [-34.2, -89.9], [-42.0, -93.9], [-65.2, -105.7], [-61.6, -88.0], [-51.2, -37.2], [-50.1, -31.9], [-54.3, -18.3], [-55.8, -13.6], [-62.3, 8.1], [-68.2, 27.2], [-81.7, 71.3], [-86.6, 76.7], [-83.4, 77.0], [-77.8, 77.5], [-29.4, 81.5], [0.1, 96.8]]
const A0 = centroid(RAW.map(([e, n]) => [e, n] as P2)) // metres east/north of 28.92330, 40.99308
const C = (e: number, n: number): P2 => [e - A0[0], n - A0[1]]
const ring = ccw(RAW.map(([e, n]) => C(e, n)))
const pylonN = ccw([[-77.9, 3.5], [-62.3, 8.1], [-68.2, 27.2], [-83.5, 22.7]].map(([e, n]) => C(e, n)))
const pylonS = ccw([[-66.0, -41.3], [-51.2, -37.2], [-50.1, -31.9], [-54.3, -18.3], [-71.1, -23.0]].map(([e, n]) => C(e, n)))
const outer = [[-83.5, 22.7], [-100.6, 17.7], [-82.2, -48.0], [-68.6, -44.9], [-76.8, -85.6]].map(([e, n]) => C(e, n))
const round = [
  { c: C(4.4, 105.1), r: 9.4 }, // north
  { c: C(76.3, 35.6), r: 8.7 }, // east
  { c: C(57.3, -66.0), r: 8.2 }, // south
]
const nwTower = { c: C(-89.2, 70.8), r: 6.5 }
const swTower = C(-62.5, -99.5)
const southTurret = { c: C(-37.6, -93.5), r: 3.8 }
const gate = { a: C(-55.8, -13.6), b: C(-62.3, 8.1) }

// Ground above the south side: a gentle rise north.
const g = ([, y]: P2) => Math.max(0, 0.02 * (y + A0[1] + 106))
console.log('anchor offset', A0.map((v) => v.toFixed(2)), 'north ground', g(round[0].c).toFixed(1))

const stone = new Part(), walk = new Part(), marble = new Part(), brick = new Part(), glaze = new Part()
const WH = 12, TH = 4.5
const MO = { w: 1.5, h: 1.3, th: 0.8, pitch: 3.4 }
const inTower = (p: P2) => [...round, nwTower].some((t) => Math.hypot(p[0] - t.c[0], p[1] - t.c[1]) < t.r + 0.5)
const near = (p: P2, a: P2, b: P2) => {
  const L2 = (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2, t = Math.max(0, Math.min(1, ((p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1])) / L2))
  return Math.hypot(p[0] - a[0] - t * (b[0] - a[0]), p[1] - a[1] - t * (b[1] - a[1]))
}

// --- Curtain walls, set inside the outline; the gate wall between the pylons
// is drawn apart.
for (let i = 0; i < ring.length; i++) {
  const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 0.5) continue
  const u: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: P2 = [-u[1], u[0]] // inward
  const A: P2 = [a[0] + n[0] * TH / 2, a[1] + n[1] * TH / 2], B: P2 = [b[0] + n[0] * TH / 2, b[1] + n[1] * TH / 2]
  const mid: P2 = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
  if (near(mid, gate.a, gate.b) < 1) continue
  wall(stone, walk, A, B, TH, g(A) + WH, g(B) + WH, TH / 2)
  if (inTower(mid) || L < 3) continue
  const oa: P2 = [A[0] - n[0] * (TH / 2 - 0.45), A[1] - n[1] * (TH / 2 - 0.45)], ob: P2 = [B[0] - n[0] * (TH / 2 - 0.45), B[1] - n[1] * (TH / 2 - 0.45)]
  merlons(stone, brick, oa, ob, g(A) + WH, g(B) + WH, { ...MO, end: 1.2 })
}
// The outer wall west of the gate.
for (let i = 0; i < outer.length - 1; i++) {
  const a = outer[i], b = outer[i + 1]
  wall(stone, walk, a, b, 3, g(a) + 6, g(b) + 6, 1.5)
  merlons(stone, brick, a, b, g(a) + 6, g(b) + 6, { w: 1.3, h: 1.1, th: 0.7, pitch: 3.6, end: 1.5 })
}

// --- Round Ottoman towers: battered body, brick band, crenellated parapet,
// drum with its own merlons, slits.
for (const t of round) {
  const z0 = g(t.c), zb = z0 + 20, zd = zb + 4.5, dr = t.r * 0.65
  lathe(stone, t.c[0], t.c[1], [[t.r + 0.4, 0], [t.r, zb]], 20)
  lathe(brick, t.c[0], t.c[1], [[t.r + 0.06, zb - 4.2], [t.r + 0.06, zb - 3.5]], 20)
  lathe(walk, t.c[0], t.c[1], [[t.r, zb], [dr, zb]], 20)
  ringMerlons(stone, brick, t.c[0], t.c[1], t.r - 0.45, zb, Math.round((TAU * t.r) / 3.2), { w: 1.5, h: 1.3, th: 0.85 })
  lathe(stone, t.c[0], t.c[1], [[dr, zb - 0.1], [dr, zd]], 16)
  lathe(walk, t.c[0], t.c[1], [[dr, zd], [0, zd]], 16)
  ringMerlons(stone, brick, t.c[0], t.c[1], dr - 0.4, zd, Math.round((TAU * dr) / 3.0), { w: 1.4, h: 1.2, th: 0.8 })
  for (let i = 0; i < 6; i++) {
    const a = (TAU * i) / 6 + 0.3, n: V3 = [Math.cos(a), Math.sin(a), 0]
    panel(glaze, [t.c[0] + n[0] * (t.r + 0.1), t.c[1] + n[1] * (t.r + 0.1), zb - 7 - (i % 2) * 5], n, 0.9, 2.0, true, 3)
  }
}
// The north-west land-wall tower (round) and the south-west one (square).
{
  const t = nwTower, zt = g(t.c) + 17
  lathe(stone, t.c[0], t.c[1], [[t.r + 0.3, 0], [t.r, zt]], 16)
  lathe(walk, t.c[0], t.c[1], [[t.r, zt], [0, zt]], 16)
  ringMerlons(stone, brick, t.c[0], t.c[1], t.r - 0.45, zt, Math.round((TAU * t.r) / 3.2), { w: 1.5, h: 1.3, th: 0.8 })
  const zs = g(swTower) + 17
  obox(stone, walk, swTower[0], swTower[1], [0.98, 0.2], 5, 5, 0, zs)
  const u: P2 = [0.98, 0.2], v: P2 = [-0.2, 0.98]
  const cs = ([[-1, -1], [1, -1], [1, 1], [-1, 1]] as P2[]).map(([s, w]) => [swTower[0] + (u[0] * s + v[0] * w) * 4.6, swTower[1] + (u[1] * s + v[1] * w) * 4.6] as P2)
  for (let i = 0; i < 4; i++) merlons(stone, brick, cs[i], cs[(i + 1) % 4], zs, zs, { w: 1.4, h: 1.2, th: 0.8, pitch: 3.0, end: 0.6 })
  const st = southTurret, zt2 = g(st.c) + WH + 2
  lathe(stone, st.c[0], st.c[1], [[st.r, 0], [st.r, zt2]], 12)
  lathe(walk, st.c[0], st.c[1], [[st.r, zt2], [0, zt2]], 12)
}

// --- The Golden Gate: two square marble pylons with a cornice, and the
// triple-arched gate wall between them (its arches walled up).
for (const p of [pylonN, pylonS]) {
  const zt = Math.max(...p.map(g)) + 20
  prism(marble, walk, p, 0, zt)
  const c = centroid(p)
  const out = p.map(([x, y]) => [c[0] + (x - c[0]) * 1.04, c[1] + (y - c[1]) * 1.04] as P2)
  prism(marble, marble, out, zt - 1.2, zt - 0.4)
}
{
  const { a, b } = gate, L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const zt = g(a) + 15
  wall(marble, walk, a, b, 5, zt, zt, 1.5)
  const n: V3 = [u[1], -u[0], 0] // outward (west)
  const at = (t: number): V3 => [a[0] + u[0] * t + n[0] * 2.5, a[1] + u[1] * t + n[1] * 2.5, g(a)]
  panel(stone, at(L / 2), n, 7.0, 12.5, true, 8, 0.06)
  panel(stone, at(L * 0.17), n, 3.6, 8.5, true, 6, 0.06)
  panel(stone, at(L * 0.83), n, 3.6, 8.5, true, 6, 0.06)
  panel(glaze, at(L / 2), n, 2.2, 3.6, false, 4, 0.1)
}

const lit = (p: V3, n: V3): number => (n[2] > 0.85 ? 0.25 : 0.9)
const parts = [
  { part: stone, material: { ...finish('yedikule-stone', 0xd6cdbd), floodlight: lit } },
  { part: marble, material: { ...PALETTE.trim, color: 0xe4ded1, floodlight: lit } },
  { part: walk, material: finish('yedikule-walk', 0xafa797) },
  { part: brick, material: finish('brick', 0xb4775c) },
  { part: glaze, material: { ...PALETTE.window, color: 0x56636e } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name, part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Yedikule Fortress', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 0, osm: 'way/1035943038', height: g(round[0].c) + 25.7,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/istanbul-yedikule-fortress.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
