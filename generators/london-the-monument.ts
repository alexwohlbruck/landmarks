/**
 * The Monument to the Great Fire of London, Fish Street Hill (Sir
 * Christopher Wren and Robert Hooke, 1671-1677): original procedural
 * geometry, CC0-1.0.
 * bun generators/london-the-monument.ts
 * Writes models/london-the-monument.glb (low) and
 * models/london-the-monument.detail.glb (detail, detailZoom 16).
 * Imports `figure`/`place` from london-albert-memorial.ts (merge that first).
 *
 * Map frame, turned to BEARING 23.6 (the pedestal's sides, from OSM): +y is
 * compass 23.6, +x compass 113.6; the -x face looks west-north-west (the
 * "west face" with Cibber's relief, on Monument Street / Fish Street Hill).
 * z up, metres; z = 0 the lowest ground at the foot (the street falls ~0.6 m
 * across the site). Origin = the centroid of OSM relation/3374550.
 *
 * What makes it the Monument, and how each is drawn
 * - The fluted Roman Doric column of Portland stone - the flutes are real
 *   facets (alternating radii), the shaft tapering - on its torus base.
 * - The tall square pedestal: plinth, die (the relief panel on the west face,
 *   framed inscription panels on the others, the door), cornice, and the
 *   upper pedestal with a winged dragon at each corner (real figure forms:
 *   body, neck, head, wings, tail, legs).
 * - The capital and the square abacus carrying the gallery, its railing and
 *   the iron cage - posts, rails and curved bars bellying out and in to the
 *   drum - drawn as real 3D bars, bold.
 * - The drum and its cap, and the gilded flaming urn: the urn body with its
 *   garland and the ball of flames, spiky, bold so it reads at 80 px.
 *
 * Sources
 * - OSM relation/3374550 (Historic England 1193901, wikidata Q607700 - the
 *   brief's Q1365052 did not match; OSM's tag is used) and the parts
 *   way/128359205, 218598666, 218598667, 251489943-251489953, relations
 *   3374552 and 3374553. (c) OpenStreetMap contributors, ODbL.
 * - Published: 202 ft (61.57 m) high (Wikipedia; themonument.org.uk); the
 *   column 15 ft (4.6 m) in diameter.
 * - Lidar: Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government
 *   Licence v3.0: pedestal top ~12.3 m, gallery ~54-55 m, top 62.0 m above
 *   the street - agreeing with the published height.
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Monument great fire of London 01.jpg", MatthiasKabel, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Monument_great_fire_of_London_01.jpg
 *     (full height, frontal: every stage, scaled to 61.57 m);
 *   "Top of Monument to the Great Fire of London.jpg", Colin, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Top_of_Monument_to_the_Great_Fire_of_London.jpg
 *     (abacus, gallery railing, the cage, drum, urn and flames);
 *   "Base of Monument to the Great Fire of London.jpg", Colin, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Base_of_Monument_to_the_Great_Fire_of_London.jpg
 *     (the pedestal, relief and dragons);
 *   "Monumento al Gran Incendio de Londres, Londres, Inglaterra, 2014-08-11, DD 150.JPG",
 *     Diego Delso, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Monumento_al_Gran_Incendio_de_Londres,_Londres,_Inglaterra,_2014-08-11,_DD_150.JPG
 *   "London - Monument to the Great Fire of London (1666) 1671-1677.jpg",
 *     Txllxt TxllxT, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:London_-_Monument_to_the_Great_Fire_of_London_(1666)_1671-1677.jpg
 * - Look-only: none.
 *
 * Measured / published / estimated
 * - Published: 61.6 m overall, column 4.6 m across. Lidar agrees (62.0).
 * - Estimated from the Kabel and Colin photos, scaled to the published
 *   height: plinth 0-2.2, die 2.2-11.2, cornice to 12.7, upper pedestal to
 *   16.3, column base to 17.4, shaft to 48.8 (4.6 -> 3.7 m), capital to 51.4,
 *   abacus 5.0 m square to 53.6 (the gallery), railing 1.1 m, cage to 56.2,
 *   drum, cap, collar to 58.2, urn to 60.4, flames to 61.6.
 * - Invented: the relief's figures (a row of figures in relief), the
 *   dragons' poses (simplified), the number of cage bars (16).
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { lathe, tube, ellipsoid, slab, face, TAU } from './nyc-columbus-monument'
import { writeModel, cbox } from './london-buckingham-palace'
import { place, figure, frustum, LOW, HIGH, type Q } from './london-albert-memorial'

export const BEARING = 23.6

/** A winged dragon (wyvern) facing +y, sitting at the origin, `k` its scale (~body length / 2.4 m). */
function dragon(q: Part, Q: Q, k: number) {
  const P = (x: number, y: number, z: number): V3 => [x * k, y * k, z * k]
  const n = Q.detail ? Q.tube : 5
  // Body crouched, chest up; neck rising and the head turned forward-down.
  tube(q, [P(0, -0.7, 0.35), P(0, -0.2, 0.45), P(0, 0.35, 0.75)], [0.3 * k, 0.36 * k, 0.3 * k], n)
  tube(q, [P(0, 0.35, 0.8), P(0, 0.6, 1.25), P(0, 0.85, 1.4)], [0.22 * k, 0.17 * k, 0.15 * k], n)
  tube(q, [P(0, 0.85, 1.42), P(0, 1.25, 1.3)], [0.17 * k, 0.08 * k], n)
  // Tail curling round the side and down.
  tube(q, [P(0, -0.75, 0.35), P(0.35, -1.15, 0.2), P(0.75, -1.05, 0.1), P(0.9, -0.7, 0.15)], [0.18 * k, 0.12 * k, 0.08 * k, 0.04 * k], n)
  // Legs: claws gripping the cornice.
  for (const s of [-1, 1]) {
    tube(q, [P(s * 0.22, 0.25, 0.6), P(s * 0.3, 0.5, 0.3), P(s * 0.3, 0.6, 0.02)], [0.1 * k, 0.08 * k, 0.07 * k], 4)
    tube(q, [P(s * 0.25, -0.5, 0.35), P(s * 0.35, -0.3, 0.12), P(s * 0.35, -0.15, 0.02)], [0.12 * k, 0.09 * k, 0.07 * k], 4)
    // Wings: raised and spread back, bat-like.
    slab(q, P(s * 0.2, 0.0, 0.85), [s * 0.75, -0.25, 0.6], [0, -0.6, 0.8], [[0, 0], [1.6 * k, 0.3 * k], [1.4 * k, 1.1 * k], [0.75 * k, 0.8 * k], [0.15 * k, 1.1 * k]], 0.08 * k)
  }
  if (Q.detail) for (const s of [-1, 1]) tube(q, [P(s * 0.06, 0.95, 1.5), P(s * 0.1, 0.85, 1.75)], [0.05 * k, 0.01 * k], 4) // ears/horns
}

function build(Q: Q) {
  const stone = new Part(), trim = new Part(), iron = new Part(), gilt = new Part()
  const bev = Q.detail ? 0.15 : 0.1
  const sq = (h: number, z0: number, z1: number, p: Part = stone, c = bev) => cbox(p, -h, -h, h, h, z0, z1, c)

  // ===== Pedestal ==========================================================
  sq(4.9, 0, 1.0, trim)
  sq(4.6, 1.0, 2.2)
  sq(4.25, 2.2, 11.2)
  sq(4.45, 2.2, 2.6, trim, 0)
  sq(4.6, 11.2, 11.8, trim, 0)
  sq(4.75, 11.8, 12.7, trim)
  sq(3.85, 12.7, 16.0)
  sq(4.0, 15.8, 16.3, trim, 0)
  // Panels on the die: the relief on the west face (-x), inscriptions on the others, the door (+x).
  for (let k = 0; k < 4; k++) {
    const a = k * Math.PI / 2, c = Math.cos(a), s = Math.sin(a)
    const P = (u: number, z: number, d: number): V3 => [c * (4.25 + d) - s * u, s * (4.25 + d) + c * u, z]
    const fr = 3.4, z0 = 3.4, z1 = 10.3
    for (const [u0, u1, a0, a1] of [[-fr, fr, z0, z0 + 0.25], [-fr, fr, z1 - 0.25, z1], [-fr, -fr + 0.25, z0, z1], [fr - 0.25, fr, z0, z1]])
      face(trim, P(u0, a0, 0.12), P(u1, a0, 0.12), P(u1, a1, 0.12), P(u0, a1, 0.12), [0, 0, (z0 + z1) / 2])
    if (k === 2) {
      // West face: Cibber's relief - a raised ground with figures.
      face(stone, P(-fr + 0.25, z0 + 0.25, 0.06), P(fr - 0.25, z0 + 0.25, 0.06), P(fr - 0.25, z1 - 0.25, 0.06), P(-fr + 0.25, z1 - 0.25, 0.06), [0, 0, 6])
      if (Q.detail) for (let i = 0; i < 7; i++) {
        const u = -2.6 + i * 0.87, base = P(u, z0 + 0.5 + (i % 3) * 0.5, 0.0)
        place(stone, base, a - Math.PI / 2, 1, (q) => figure(q, LOW, 3.6 - (i % 3) * 0.4, { seated: i === 1 || i === 4, arms: [[[0.13, 0, 0.78], [0.22, 0.08, 0.6], [0.2, 0.15, 0.5]]], girth: 1.05 }))
      }
    }
    if (k === 0) face(iron, P(-0.8, 0.05, 0.05), P(0.8, 0.05, 0.05), P(0.8, 2.15, 0.05), P(-0.8, 2.15, 0.05), [0, 0, 1])
  }
  // The four dragons on the corners of the upper pedestal, facing out.
  for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
    place(stone, [sx * 3.95, sy * 3.95, 12.7], Math.atan2(sy, sx) - Math.PI / 2, 1, (q) => dragon(q, Q, 1.55), 75)
  }
  // Column base: square plinth and torus.
  sq(2.95, 16.3, 16.8, trim, 0.1)
  lathe(trim, [[2.75, 16.8], [2.85, 17.0], [2.6, 17.25], [2.35, 17.4]], Q.detail ? 32 : 16, 0, 0, false)

  // ===== The fluted shaft ==================================================
  {
    const nf = Q.detail ? 24 : 20, m = nf * 2
    const ring = (z: number, r: number): V3[] => Array.from({ length: m }, (_, k): V3 => {
      const a = k * TAU / m, rr = k % 2 ? r * 0.93 : r
      return [rr * Math.cos(a), rr * Math.sin(a), z]
    })
    const levels = Q.detail ? [17.4, 25, 33, 41, 48.8] : [17.4, 33, 48.8]
    const rad = (z: number) => 2.3 - 0.45 * (z - 17.4) / (48.8 - 17.4)
    stone.loft(levels.map((z) => ring(z, rad(z))))
  }

  // ===== Capital, abacus, gallery ==========================================
  lathe(trim, [[1.88, 48.8], [1.95, 49.2], [1.85, 49.5], [2.0, 49.8], [2.4, 50.8], [2.45, 51.4]], Q.detail ? 32 : 16, 0, 0, false)
  sq(2.5, 51.4, 53.3, trim, 0.1)
  sq(2.55, 53.3, 53.6, trim, 0)
  // Gallery railing on the abacus edge: posts and two rails; then the cage.
  const G = 2.4, ZG = 53.6
  const perim = (t: number): [number, number] => {
    const side = Math.floor(t * 4) % 4, f = t * 4 - Math.floor(t * 4)
    const c = [[-G, -G], [G, -G], [G, G], [-G, G]]
    const a = c[side], b = c[(side + 1) % 4]
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]
  }
  const nPost = Q.detail ? 40 : 16
  for (let i = 0; i < nPost; i++) {
    const [x, y] = perim(i / nPost), w = Q.detail ? 0.045 : 0.07
    cbox(iron, x - w, y - w, x + w, y + w, ZG, ZG + 1.1, 0)
  }
  for (const z of [ZG + 0.12, ZG + 1.05]) for (let s = 0; s < 4; s++) {
    const [x0, y0] = perim(s / 4), [x1, y1] = perim((s + 1) / 4)
    cbox(iron, Math.min(x0, x1) - 0.05, Math.min(y0, y1) - 0.05, Math.max(x0, x1) + 0.05, Math.max(y0, y1) + 0.05, z - 0.04, z + 0.04, 0)
  }
  // Cage bars: from the rail out and up, bellying, then in to the drum's shoulder.
  const nBar = Q.detail ? 24 : 12
  for (let i = 0; i < nBar; i++) {
    const t = (i + 0.5) / nBar, [x, y] = perim(t), r = Math.hypot(x, y), ux = x / r, uy = y / r
    const pt = (rr: number, z: number): V3 => [ux * rr, uy * rr, z]
    tube(iron, [[x, y, ZG + 1.05], pt(r + 0.1, ZG + 1.5), pt(r - 0.15, ZG + 2.1), pt(1.95, ZG + 2.45), pt(1.62, ZG + 2.6)], [0.07, 0.07, 0.07, 0.07, 0.07], 4)
  }
  // Ring where the bars meet the drum.
  lathe(iron, [[1.66, ZG + 2.5], [1.66, ZG + 2.65]], Q.detail ? 24 : 12, 0, 0, false)

  // ===== Drum, cap, collar ================================================
  lathe(stone, [[1.4, ZG], [1.46, ZG + 1.8], [1.5, ZG + 2.4], [1.62, ZG + 2.55], [1.62, ZG + 2.95], [1.25, ZG + 3.1], [1.0, ZG + 3.7], [0.62, ZG + 4.05]], Q.detail ? 24 : 12, 0, 0, false)
  lathe(trim, [[0.62, ZG + 4.05], [0.95, ZG + 4.15], [0.98, ZG + 4.5], [0.6, ZG + 4.6]], Q.detail ? 24 : 12, 0, 0, false)

  // ===== The gilded urn and its flames =====================================
  {
    const n = Q.detail ? 20 : 10
    lathe(gilt, [[0.6, ZG + 4.6], [0.55, ZG + 4.8], [0.7, ZG + 5.05], [0.92, ZG + 5.45], [0.88, ZG + 5.85], [0.55, ZG + 6.15], [0.38, ZG + 6.4], [0.5, ZG + 6.7], [0.75, ZG + 6.85]], n, 0, 0, false)
    // Garland bosses round the belly.
    for (let i = 0; i < (Q.detail ? 8 : 4); i++) {
      const a = i * TAU / (Q.detail ? 8 : 4)
      ellipsoid(gilt, [0.92 * Math.cos(a), 0.92 * Math.sin(a), ZG + 5.5], [0.22, 0.22, 0.28], 6, 3)
    }
    // The ball of flames: a core and spikes radiating up and out.
    ellipsoid(gilt, [0, 0, ZG + 7.35], [0.85, 0.85, 0.7], Q.detail ? 14 : 8, Q.detail ? 7 : 4)
    const rows = Q.detail ? [[0.2, 12], [0.6, 12], [1.0, 9], [1.35, 5]] : [[0.3, 8], [0.85, 6], [1.3, 3]]
    for (const [el, cnt] of rows) for (let i = 0; i < cnt; i++) {
      const a = i * TAU / cnt + el, ce = Math.cos(el), se = Math.sin(el)
      const base: V3 = [0.7 * ce * Math.cos(a), 0.7 * ce * Math.sin(a), ZG + 7.35 + 0.55 * se]
      const tip: V3 = [1.1 * ce * Math.cos(a), 1.1 * ce * Math.sin(a), ZG + 7.35 + 0.85 * se + 0.25]
      tube(gilt, [base, tip], [0.16, 0.02], 4)
    }
    void frustum
  }
  return { stone, trim, iron, gilt }
}

function write(Q: Q, file: string, maxTris: number) {
  const { stone, trim, iron, gilt } = build(Q)
  const lit = (p: V3, n: V3) => (n[2] > 0.95 ? 0.3 : Math.min(1, 0.45 + p[2] / 70))
  writeModel('The Monument', 'london-the-monument', [
    { part: stone, material: { ...mat('portland-stone', 0xece3d2), floodlight: lit } },
    { part: trim, material: { ...mat('trim', 0xf6eddc), floodlight: lit } },
    { part: iron, material: mat('monument-iron', 0x4a4f57, 0.6) },
    { part: gilt, material: { ...mat('monument-gilt', 0xe2b445, 0.4), floodlight: () => 1 } },
  ], { bearing: BEARING, osm: 'relation/3374550', height: 61.6 }, maxTris, file)
}

function mat(name: string, color: number, roughness = 0.85): MaterialSpec {
  return { name, color, roughness }
}

if (import.meta.main) {
  write(LOW, 'london-the-monument', 5000)
  write(HIGH, 'london-the-monument.detail', 40000)
}
