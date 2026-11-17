/**
 * Anadolu Hisarı (Anatolian Fortress), Istanbul: procedural, CC0-1.0.
 *   bun generators/istanbul-anadolu-hisari.ts
 *
 * Bayezid I's fortress of 1393-94 on the Asian shore where the Göksu meets
 * the Bosphorus, with Mehmed II's outer walls of 1452: the square crenellated
 * keep with its round stair turret, the inner wall wrapped round its south and
 * west sides with round corner towers, the outer curtain walls and the three
 * round towers on the north and west. Rubble stone with brick-capped merlons;
 * no roofs (photos 2012-2025).
 *
 * Uses the kit exported by istanbul-maidens-tower.ts.
 *
 * Frame: x east, y north, z up, metres, bearing 0. Origin at the centroid of
 * the keep complex (relation/13234926), on the lowest ground under the
 * footprint (the foot of the west wall by the shore road).
 *
 * Sources
 * - OSM (ODbL): relation/13234926 (building, historic=castle, wikidata
 *   Q81650; members way/1386543332 keep, height 30; way/1386543334 stair
 *   turret, 30; way/1386543333 inner wall, 20); towers way/984747660,
 *   way/984747661, way/984747664 (building, man_made=tower, height 20); outer
 *   wall areas way/984747659, 984747662, 984747663, 984747665, 984747668
 *   (barrier=city_wall).
 * - Published: en.wikipedia "Anadoluhisarı": keep 25 m, "irregular pentagon"
 *   of inner walls; Mehmed II's 2 m outer wall and three towers;
 *   tr.wikipedia "Anadolu Hisarı": inner walls 3 m thick, outer walls 2.5 m,
 *   65 x 80 m overall; keep of four storeys.
 * - Photos (EVIDENCE):
 *   mike, "Anadolu Hisarı Fortress.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Anadolu_Hisar%C4%B1_Fortress.jpg (from the Bosphorus, west).
 *   flowcomm, "Anadolu Hisarı in 2024.jpg", CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Anadolu_Hisar%C4%B1_in_2024.jpg (from the west-south-west).
 *   Denizmiş, "Anadolu Hisarı, Summer of 2025.jpg", CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:Anadolu_Hisar%C4%B1,_Summer_of_2025.jpg (north tower and wall from the street).
 *   Furkan Akkurt, "Anadolu Hisari courtyard and tower Istanbul 2024.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Anadolu_Hisari_courtyard_and_tower_Istanbul_2024.jpg
 *   Dosseman, "Anadolu Hisarı from Bosporus in 2012 6243.jpg" and "Anadolu Hisarı in 2015 0880.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Anadolu_Hisar%C4%B1_from_Bosporus_in_2012_6243.jpg
 *
 * Numbers
 * - Plan: OSM, measured. The inner corner towers are drawn r 3.0 m (OSM's
 *   circles are under 1.5 m; the photos show stout round towers).
 * - Keep 25 m above its own ground (published), top 30 m above the shore
 *   (OSM 30). Outer towers 18 m above their ground (OSM 20 from the shore);
 *   inner wall 13 m, its towers 16 m; outer curtain 9 m: photo-scaled.
 * - Ground: no terrain service here (Mapterhorn has no z15 tiles); the site
 *   rises about 6.5 m from the shore road to the keep's mound, estimated from
 *   the photos. Every wall runs down to z = 0 (STYLE.md, Ground).
 * - Colours from the daylight photos: grey-brown rubble, brick merlon caps.
 *
 * Doubts
 * - The east side, inland, is seen in no photo; it is drawn from OSM alone.
 * - Merlon spacing and slit windows are schematic.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type P2, TAU, ccw, lathe, merlons, panel, ringMerlons, solid } from './istanbul-maidens-tower'

const A0: P2 = [-0.6, 0.4] // anchor, metres east/north of 29.06705, 41.08209
const R = (pts: number[][]): P2[] => ccw(pts.map(([e, n]) => [e - A0[0], n - A0[1]] as P2))
const C = (e: number, n: number): P2 => [e - A0[0], n - A0[1]]

const keep = R([[5.9, 8.0], [5.2, 3.9], [5.0, 2.0], [4.4, -2.6], [-5.1, -1.3], [-3.7, 9.3], [-0.3, 8.9], [1.7, 8.6]])
const innerWall = R([[9.2, 3.1], [5.2, 3.9], [5.0, 2.0], [6.9, 1.6], [5.5, -7.9], [-11.5, -2.2], [-5.9, 8.1], [-7.2, 9.6], [-13.2, -1.0], [-13.7, -3.6], [-12.3, -3.7], [4.5, -9.7], [7.5, -8.3], [8.6, -0.9], [8.9, 1.0]])
const outerWalls = [
  R([[8.6, -0.9], [18.7, -12.2], [8.9, -22.2], [-2.0, -26.2], [-40.8, 6.4], [-40.7, 6.9], [-40.6, 9.8], [-40.3, 21.1], [-41.2, 20.7], [-41.8, 20.6], [-42.2, 12.3], [-42.5, 5.8], [-2.1, -28.2], [10.2, -23.7], [21.4, -12.1], [10.1, 0.7], [8.9, 1.0]]),
  R([[-41.2, 26.8], [-33.9, 42.1], [-33.3, 41.5], [-32.7, 41.3], [-40.0, 26.1], [-40.2, 26.3]]),
  R([[-26.9, 46.7], [-19.0, 48.5], [-18.7, 47.3], [-26.7, 45.4], [-26.7, 45.8]]),
  R([[-7.0, 43.2], [15.3, 34.2], [21.3, 31.3], [18.6, 28.7], [18.3, 28.5], [19.7, 27.5], [22.9, 30.2], [24.2, 29.3], [26.1, 31.2], [24.2, 33.2], [23.3, 32.5], [-6.4, 44.6], [-6.5, 44.1]]),
  R([[1.7, 8.6], [-0.3, 8.9], [12.4, 23.7], [14.0, 22.6], [6.2, 13.8]]),
]
// Round towers: centre, radius, height above their ground.
const towers: { c: P2; r: number; h: number }[] = [
  { c: C(-42.1, 23.7), r: 3.3, h: 17.5 }, // way/984747660
  { c: C(-30.9, 45.0), r: 4.2, h: 18.5 }, // way/984747661
  { c: C(-9.5, 45.2), r: 3.3, h: 17.5 }, // way/984747664
  { c: C(-13.5, -2.6), r: 3.0, h: 16 }, // inner wall, south-west
  { c: C(6.2, -9.8), r: 3.0, h: 16 }, // inner wall, south-east
]
const turret = { c: C(-5.4, 9.8), r: 2.4 }

// Ground above the lowest point (the west wall by the road), rising inland.
const g = ([x, y]: P2) => Math.min(6.5, Math.max(0, 0.11 * (x + A0[0] + 44)))

const stone = new Part(), walk = new Part(), brick = new Part(), glaze = new Part()
const MO = { w: 0.95, h: 1.0, th: 0.7, pitch: 2.1 }

// --- Keep: 25 m above its own ground, crenellated, a few slit windows.
const KG = Math.min(...keep.map(g)), KT = KG + 25
solid(stone, walk, keep, 0, KT)
for (let i = 0; i < keep.length; i++) {
  const a = keep[i], b = keep[(i + 1) % keep.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 1.5) continue
  const u: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: P2 = [u[1], -u[0]]
  const ia: P2 = [a[0] - n[0] * 0.35, a[1] - n[1] * 0.35], ib: P2 = [b[0] - n[0] * 0.35, b[1] - n[1] * 0.35]
  merlons(stone, brick, ia, ib, KT, KT, { ...MO, end: 0.3 })
  if (L > 4) for (const t of [0.3, 0.7]) for (const z of [KG + 9, KG + 16, KG + 21]) {
    panel(glaze, [a[0] + u[0] * L * t, a[1] + u[1] * L * t, z], [n[0], n[1], 0], 0.6, 1.6, true, 3)
  }
}
// The stair turret on the keep's north-west corner, a little above the keep.
lathe(stone, turret.c[0], turret.c[1], [[turret.r, 0], [turret.r, KT + 1.6]], 14)
lathe(walk, turret.c[0], turret.c[1], [[turret.r, KT + 1.6], [0, KT + 1.6]], 14)
ringMerlons(stone, brick, turret.c[0], turret.c[1], turret.r - 0.35, KT + 1.6, 7, { w: 0.9, h: 1.0, th: 0.6 })

// --- Inner wall: 3 m thick round the keep's south and west, 13 m.
solid(stone, walk, innerWall, 0, (p) => g(p) + 13)
// --- Outer curtain walls, 9 m above their ground.
for (const w of outerWalls) solid(stone, walk, w, 0, (p) => g(p) + 6)
// Merlons along the wall areas' long edges (each wall area is a thin band).
for (const [ring, H] of [[innerWall, 13], ...outerWalls.map((w) => [w, 6] as const)] as [P2[], number][]) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 3) continue
    const u: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: P2 = [u[1], -u[0]]
    const ia: P2 = [a[0] - n[0] * 0.35, a[1] - n[1] * 0.35], ib: P2 = [b[0] - n[0] * 0.35, b[1] - n[1] * 0.35]
    // Skip edges that sit inside a tower.
    const mid: P2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    if (towers.some((t) => Math.hypot(mid[0] - t.c[0], mid[1] - t.c[1]) < t.r)) continue
    merlons(stone, brick, ia, ib, g(ia) + H, g(ib) + H, { ...MO, end: 0.8 })
  }
}

// --- Round towers: a slight batter, a crenellated top, slits.
for (const t of towers) {
  const zt = g(t.c) + t.h
  lathe(stone, t.c[0], t.c[1], [[t.r + 0.25, 0], [t.r, zt]], 16)
  lathe(walk, t.c[0], t.c[1], [[t.r, zt], [0, zt]], 16)
  ringMerlons(stone, brick, t.c[0], t.c[1], t.r - 0.35, zt, Math.round((TAU * t.r) / 2.2), { w: 1.0, h: 1.1, th: 0.7 })
  for (let i = 0; i < 3; i++) {
    const a = (TAU * i) / 3 + 0.4, n: V3 = [Math.cos(a), Math.sin(a), 0]
    panel(glaze, [t.c[0] + n[0] * (t.r + 0.05), t.c[1] + n[1] * (t.r + 0.05), zt - 6 - 3 * (i % 2)], n, 0.5, 1.5, true, 3)
  }
}

const lit = (p: V3, n: V3): number => (n[2] > 0.85 ? 0.25 : 0.85)
const parts = [
  { part: stone, material: { ...finish('hisar-stone', 0xc6bdae), floodlight: lit } },
  { part: walk, material: { ...finish('hisar-walk', 0xb8ab96) } },
  { part: brick, material: finish('brick', 0xb4775c) },
  { part: glaze, material: { ...PALETTE.window, color: 0x56636e } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name, part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Anadolu Hisarı', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 0, osm: 'relation/13234926', height: KT + 2.6,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/istanbul-anadolu-hisari.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
