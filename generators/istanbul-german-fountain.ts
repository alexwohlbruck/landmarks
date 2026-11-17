/**
 * German Fountain (Alman Çeşmesi), Sultanahmet Meydanı, Istanbul — the
 * octagonal neo-Byzantine fountain pavilion given by Kaiser Wilhelm II,
 * built in Germany and assembled here in 1900 (designed by Spitta, built by
 * Schoele) — original procedural geometry, CC0-1.0.
 * bun generators/istanbul-german-fountain.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Bearing 37.6: the octagon's faces are set square to the
 * Hippodrome's axis (compass 37.6°), as the square's paving and the
 * photos suggest; OSM's outline is a round 18-gon and doesn't fix it.
 * Anchor = the centroid of OSM way/109874498 (amenity=fountain,
 * building=yes, wikidata Q322920), 28.976676, 41.007113.
 *
 * Identity (from the photos below):
 *  1. The green-patina octagonal dome, ribbed, with a small lantern finial.
 *  2. Eight round arches, white marble with a patterned rim, on dark
 *     porphyry columns, open all round: real openings.
 *  3. The gilt mosaic ceiling seen through the arches.      (dd38, ninara)
 *  4. The white marble octagonal podium with its drinking basins and the
 *     little marble dome of the fountain inside.             (dd37, haklai)
 *
 * Plan: OSM way/109874498, a circle 9.3 m across, taken as the podium
 * (circumradius 4.66 m). OSM has no height.
 *
 * Heights, estimated from the photos (dd37 and haklai, near-level views;
 * the ruler is the podium's width, 9.3 m from OSM): podium 0–2.2 m;
 * columns to 5.0 m; arches springing at 5.0 m, crowns about 6.25 m;
 * spandrels and entablature to 7.6 m, cornice to 8.05 m; dome rise 3.2 m
 * to 11.5 m; lantern finial to 12.75 m. Paired columns at each corner (outer and inner, dd37), the outer
 * drawn 0.32 m in radius (real ≈ 0.25). The arches' inner faces are gilt
 * like the ceiling (dd38, ninara).
 *
 * Ground: the square is level here; elevation 0. No lidar or Mapterhorn
 * z15 terrain in Istanbul.
 *
 * Night: the marble is floodlit and the gilt ceiling lit (dexter, dusk).
 *
 * Photos (evidence, Wikimedia Commons):
 *  dd37   "Fuente Alemana, Estambul, Turquía, 2024-09-30, DD 37.jpg", Diego Delso, CC BY-SA 4.0
 *  dd01   "Fuente Alemana, Estambul, Turquía, 2024-09-29, DD 01.jpg", Diego Delso, CC BY-SA 4.0
 *  dd38   "Fuente Alemana, Estambul, Turquía, 2024-09-30, DD 38.jpg", Diego Delso, CC BY-SA 4.0 (the mosaic ceiling)
 *  haklai "German Fountain (Istanbul).jpg", Yair Haklai, CC BY-SA 4.0
 *  ninara "Sultanahmet Square, German Fountain, Istanbul (52121614824).jpg", Ninara, CC BY 2.0
 *  jose   "German Fountain (Istanbul) in 2026.jpg", Joseolgon, CC BY 4.0
 *  kapac  "Alman Çeşmesi (The German Fountain).jpg", İlker R. Kapaç, CC BY-SA 4.0
 *  dexter "German Fountain and Sultanahmet Mosque.jpg", Scott Dexter, CC BY-SA 2.0 (dusk)
 * Look-only: none.
 *
 * Doubts: the octagon's rotation (no plan evidence); the steps on the
 * entrance face (ninara) are left out, as are the bronze capitals' detail
 * and the arches' ornament.
 *
 * Uses `arcade` from istanbul-little-hagia-sophia.ts.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, circle, save, smoothWall, wall, type XY } from './atl-flatiron-building'
import { revolve } from './atl-tech-tower'
import { arcade } from './istanbul-little-hagia-sophia'

const marble = new Part(), porphyry = new Part(), patina = new Part(), mosaic = new Part()

const PH = Math.PI / 8 // flats face ±x and ±y
const oct = (r: number): XY[] => circle([0, 0], r, 8, PH)
const at = (ring: XY[], z: number): V3[] => ring.map(([x, y]) => [x, y, z])

// 1. The podium: a plinth, the body with a moulded top, and the basins.
const RP = 4.66 // circumradius
marble.loft([at(oct(RP), 0), at(oct(RP), 0.35)])
marble.loft([at(oct(RP), 0.35), at(oct(RP - 0.2), 0.5)])
marble.loft([at(oct(RP - 0.2), 0.5), at(oct(RP - 0.2), 1.95)])
marble.loft([at(oct(RP - 0.2), 1.95), at(oct(RP - 0.05), 2.05)])
marble.loft([at(oct(RP - 0.05), 2.05), at(oct(RP - 0.05), 2.2)])
marble.cap(at(oct(RP - 0.05), 2.2), true)
for (let i = 0; i < 8; i++) {
  if (i === 6) continue // the entrance face (steps not modelled)
  const a = PH + ((i + 0.5) / 8) * Math.PI * 2, r = (RP - 0.2) * Math.cos(Math.PI / 8)
  const c: XY = [Math.cos(a) * (r + 0.32), Math.sin(a) * (r + 0.32)]
  // a basin: a short half-round bowl standing out from the face
  const ux = Math.cos(a), uy = Math.sin(a)
  const pts = Array.from({ length: 7 }, (_, k) => { const t = -Math.PI / 2 + (k / 6) * Math.PI; return [c[0] - ux * 0.32 + (ux * Math.cos(t) - uy * Math.sin(t) * 1.6) * 0.45, c[1] - uy * 0.32 + (uy * Math.cos(t) + ux * Math.sin(t) * 1.6) * 0.45] as XY })
  const ring = [...pts]
  const ccwRing = ((): XY[] => { let s = 0; for (let k = 0; k < ring.length; k++) { const p = ring[k], q = ring[(k + 1) % ring.length]; s += p[0] * q[1] - q[0] * p[1] } return s < 0 ? [...ring].reverse() : ring })()
  wall(marble, ccwRing, 0.45, 0.95)
  for (let k = 1; k < ccwRing.length - 1; k++) marble.tri([ccwRing[0][0], ccwRing[0][1], 0.95], [ccwRing[k][0], ccwRing[k][1], 0.95], [ccwRing[k + 1][0], ccwRing[k + 1][1], 0.95])
  for (let k = 1; k < ccwRing.length - 1; k++) marble.tri([ccwRing[0][0], ccwRing[0][1], 0.45], [ccwRing[k + 1][0], ccwRing[k + 1][1], 0.45], [ccwRing[k][0], ccwRing[k][1], 0.45])
}

// 2. The fountain's little marble dome inside.
smoothWall(marble, circle([0, 0], 1.7, 12), 2.2, 2.9)
revolve(marble, [0, 0], [[1.85, 2.9], [1.85, 3.05], [1.6, 3.1], [1.35, 3.6], [0.8, 3.95], [0, 4.1]], 12)

// 3. The colonnade: eight corner columns and eight open round arches.
const RC = 4.2, ZS = 5.0, ZT = 7.6, T = 0.75
const cols = oct(RC)
for (const c of cols) {
  revolve(marble, c, [[0.42, 2.2], [0.42, 2.45], [0.32, 2.55]], 8, 0, true, false)
  smoothWall(porphyry, circle(c, 0.32, 8), 2.5, ZS - 0.45)
  // the inner column of each pair, behind the outer one
  const ci: XY = [c[0] * (1 - (T - 0.05) / RC), c[1] * (1 - (T - 0.05) / RC)]
  smoothWall(porphyry, circle(ci, 0.26, 8), 2.2, ZS - 0.3)
  revolve(patina, ci, [[0.26, ZS - 0.3], [0.4, ZS]], 8, 0, true, false)
  revolve(patina, c, [[0.3, ZS - 0.45], [0.46, ZS - 0.05], [0.46, ZS]], 8, 0, true, false)
}
for (let i = 0; i < 8; i++) {
  // the octagon's edge, pushed out so the band's outer face is on the edge
  const a = cols[i], b = cols[(i + 1) % 8]
  // arcade(): the outside to the right of a→b; for a ccw ring that's b→a? No:
  // circle() is ccw, so the right of a→b is the outside.
  arcade(marble, porphyry, a, b, 1, 0.42, ZS, ZT, T, false, 8, mosaic)
}
// fill the corners over the capitals, where two bands meet
for (const c of cols) {
  const inward: XY = [c[0] * (1 - (T * 0.5) / RC), c[1] * (1 - (T * 0.5) / RC)]
  smoothWall(marble, circle(inward, 0.5, 8), ZS, ZT)
}
// the gilt mosaic ceiling, seen from below
{
  const ring = oct(RC - T * 0.6)
  for (let k = 1; k < 7; k++) mosaic.tri([ring[0][0], ring[0][1], ZT - 0.6], [ring[k + 1][0], ring[k + 1][1], ZT - 0.6], [ring[k][0], ring[k][1], ZT - 0.6])
}
// entablature top and cornice
marble.loft([at(oct(RC + 0.05), ZT), at(oct(RC + 0.35), ZT + 0.2)])
marble.loft([at(oct(RC + 0.35), ZT + 0.2), at(oct(RC + 0.35), ZT + 0.4)])
marble.loft([at(oct(RC + 0.35), ZT + 0.4), at(oct(RC + 0.05), ZT + 0.45)])
// the band's top: a flat ring from the arcade's inner face out to the cornice
{
  const o = oct(RC + 0.05), inr = oct(RC - T)
  for (let i = 0; i < 8; i++) { const j = (i + 1) % 8; marble.quad([inr[i][0], inr[i][1], ZT], [o[i][0], o[i][1], ZT], [o[j][0], o[j][1], ZT], [inr[j][0], inr[j][1], ZT]) }
}
wall(marble, oct(RC - T), ZT - 0.6, ZT) // the soffit's inner rim above the ceiling

// 4. The dome: eight faceted gores on a short drum, ribs, the lantern.
patina.loft([at(oct(RC + 0.05), ZT + 0.45), at(oct(RC - 0.05), ZT + 0.7)])
{
  const R = RC - 0.05, Z0 = ZT + 0.7, rise = 3.2
  const prof: [number, number][] = Array.from({ length: 6 }, (_, k) => { const t = (k / 5) * (Math.PI / 2); return [R * Math.cos(t) * (k === 5 ? 0 : 1), Z0 + rise * Math.sin(t)] as [number, number] })
  prof[5][0] = 0.35
  revolve(patina, [0, 0], prof, 8, PH, true, false)
  // the lantern: a small drum, cap, ball and spike
  const zt = Z0 + rise
  revolve(patina, [0, 0], [[0.35, zt - 0.05], [0.35, zt + 0.35], [0.5, zt + 0.42], [0.2, zt + 0.7], [0.28, zt + 0.85], [0.1, zt + 1.0], [0, zt + 1.25]], 8)
}

const lit = (_p: V3, n: V3) => (n[2] > 0.6 ? 0.2 : 0.7)
await save('istanbul-german-fountain', 'German Fountain', [
  { part: marble, material: { ...PALETTE.stone, floodlight: lit } },
  { part: porphyry, material: finish('alman-porphyry', 0x4f5751, 0.5) },
  { part: patina, material: { ...finish('alman-patina', 0x6aa797), floodlight: (p) => (p[2] > 8 ? 0.4 : 0) } },
  { part: mosaic, material: { ...finish('alman-mosaic', 0xd6a84a, 0.5), floodlight: () => 1 } },
], { height: 12.75, anchor: [41.007113, 28.976676], bearing: 37.6 })
