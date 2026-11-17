/**
 * Imperial Gate (Bâb-ı Hümâyûn, Saltanat Kapısı), Topkapı Palace,
 * Istanbul (1478, Mehmed II; marble revetment 1867, Abdülaziz) — original
 * procedural geometry, CC0-1.0.
 * bun generators/istanbul-topkapi-imperial-gate.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Bearing 43.2: the model's −y face is the outer front (compass
 * 223°, towards the Fountain of Ahmed III and Hagia Sophia), +y the side
 * of the First Courtyard. 43.2 squares the outline's long walls (43.2° /
 * 133.3° in OSM). Anchor = centroid of the OSM outline way/335364925
 * (building=yes, historic=city_gate, name Bâb-ı Hümâyûn), 28.981487,
 * 41.008597.
 *
 * Identity (from the photos below):
 *  1. A long, flat-topped wall-block of pinkish brick with a dentilled
 *     stone cornice, a grey ashlar zone round the portal.   (haklai, galeotti)
 *  2. The tall white marble portal frame: a deep pointed-arch recess, the
 *     gilt calligraphy in its tympanum, the round-arched passage beneath,
 *     which runs right through the gate.            (haklai, galeotti, dosseman-in)
 *  3. A narrower marble frame on each side, with a pointed niche and a
 *     small inscription plaque.                             (haklai, galeotti)
 *  4. The plainer courtyard side: a marble pointed portal and arched
 *     openings into the guard rooms, small windows above.        (osama-in)
 *  The upper storey (a timber pavilion) is gone; the top is flat.
 *
 * Plan: OSM (© OpenStreetMap contributors, ODbL) outline 41.0 × 14.7 m,
 * x −20.5…20.5, y −7.3…7.4 in this frame. The 14 m defensive tower
 * way/401191731 to the west and the 1728 fountain are separate buildings,
 * left to the map.
 *
 * Heights (estimated from haklai, a near-level frontal view, scaled by the
 * OSM width of 41.0 m = 1195 px): cornice top 12.6 m (dentil band from
 * 11.7 m); central marble frame 7.0 m wide to 12.0 m; recess arch 5.5 m
 * wide, springing at 7.9 m, apex 11.1 m; gilt calligraphy in its head,
 * inscription panel 6.2–7.4 m; passage 2.8 m wide, crown 5.6 m; side
 * frames 3.8 m wide to 8.4 m with niches 2.5 m wide to 6.1 m, plaques
 * 7.2–7.9 m; small grilled windows 5.2–6.2 m. Courtyard side (osama-in,
 * oblique, read with the defensive tower to the NW for orientation): the
 * portal frame to 11.4 m, its recess 4.4 m wide to 9.8 m, a niche frame
 * each side, two guard-room arches to the SE and one to the NW, 2.6 m
 * wide, 4.6 m high. Nothing published.
 *
 * Photos (Wikimedia Commons, evidence):
 *  - haklai: Imperial Gate (Topkapı Palace).jpg (Yair Haklai, CC BY-SA 4.0)
 *  - galeotti: Imperial Gate - Topkapı Palace, Cankurtaran, Fatih, İstanbul,
 *    Turkey - October 10, 2025.jpg (Giorgio Galeotti, CC BY-SA 4.0)
 *  - dosseman-out: Topkapı Imperial Gate outer side 2006 01 0922.jpg
 *    (Dosseman, CC BY-SA 4.0)
 *  - dosseman-in: Topkapı Imperial Gate First Courtyard side 2018 06 6314.jpg
 *    (Dosseman, CC BY-SA 4.0)
 *  - osama-in: The Imperial Gate, Bâb-ı Hümâyûn, Topkapi Palace, Istanbul,
 *    Turkey. Shooting from the inner (first) courtyard.jpg (Osama Shukir
 *    Muhammed Amin, CC BY-SA 4.0)
 * No look-only sources. No commercial imagery.
 *
 * Ground: the outer square and the First Courtyard are about level here;
 * no terrain check (no lidar, no Mapterhorn z15 tiles in Istanbul).
 *
 * Left out: the calligraphy itself (a dark-gilt panel), the tughra
 * medallion, the columns in the recess, the window grilles, the
 * defensive walls running on from each end.
 *
 * Doubts: the courtyard side's arch positions are read from one oblique
 * photo; the top (flat, behind the cornice) is not seen in any photo.
 *
 * Night: the gate front is floodlit.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { face } from './bridge-kit'
import { PALETTE, finish } from './palette'

const brick = new Part(), ashlar = new Part(), marble = new Part(), roof = new Part(), win = new Part(), gilt = new Part()

type XZ = [number, number]

/** Ear-clipping for a simple polygon, counter-clockwise in its own plane. */
export function earcut(pts: XZ[]): [number, number, number][] {
  const idx = pts.map((_, i) => i), out: [number, number, number][] = []
  const area = (a: XZ, b: XZ, c: XZ) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XZ, a: XZ, b: XZ, c: XZ) =>
    area(a, b, p) > 1e-9 && area(b, c, p) > 1e-9 && area(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const a = pts[ia], b = pts[ib], c = pts[ic]
      const ar = area(a, b, c)
      if (Math.abs(ar) < 1e-10) { idx.splice(i, 1); cut = true; break } // collinear: drop
      if (ar < 0) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inside(pts[j], a, b, c))) continue
      out.push([ia, ib, ic]); idx.splice(i, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** Opening profiles, from the left foot up and over to the right foot. */
export function roundArch(c: number, a: number, z0: number, spring: number, seg = 8): XZ[] {
  const p: XZ[] = [[c - a, z0]]
  for (let k = 0; k <= seg; k++) { const t = Math.PI * (1 - k / seg); p.push([c + a * Math.cos(t), spring + a * Math.sin(t)]) }
  p.push([c + a, z0])
  return p
}
/** A two-centred pointed arch rising `rise` above its springing. */
export function pointedArch(c: number, a: number, z0: number, spring: number, rise: number, seg = 8): XZ[] {
  const d = Math.max(0, (rise * rise - a * a) / (2 * a)), r = a + d
  const h = seg / 2, p: XZ[] = [[c - a, z0]]
  const top = Math.atan2(rise, d) // angle of the apex seen from each centre
  for (let k = 0; k <= h; k++) { const t = Math.PI - (Math.PI - top) * k / h; p.push([c + d + r * Math.cos(t), spring + r * Math.sin(t)]) }
  for (let k = h - 1; k >= 0; k--) { const t = Math.PI - (Math.PI - top) * k / h; p.push([c - d - r * Math.cos(t), spring + r * Math.sin(t)]) }
  p.push([c + a, z0])
  return p
}

/**
 * A wall slab along x (x0…x1) between y = yf (front, facing −y) and y = yb
 * (back, facing +y), z0…z1, with openings that reach its foot and run
 * right through it. `front`/`back` choose each face's part (null = not
 * drawn); `soffit` gets the reveals.
 */
export function slab(x0: number, x1: number, yf: number, yb: number, z0: number, z1: number, ops: XZ[][],
  front: Part | null, back: Part | null, soffit: Part, top: Part | null = null, ends: Part | null = null) {
  const poly: XZ[] = [[x0, z0]]
  for (const o of [...ops].sort((a, b) => a[0][0] - b[0][0])) poly.push(...o)
  poly.push([x1, z0], [x1, z1], [x0, z1])
  const tris = earcut(poly)
  if (front) for (const [a, b, c] of tris) {
    const n: V3 = [0, -1, 0], P = (i: number): V3 => [poly[i][0], yf, poly[i][1]]
    front.tri(P(a), P(b), P(c), undefined, undefined, undefined, [n, n, n])
  }
  if (back) for (const [a, b, c] of tris) {
    const n: V3 = [0, 1, 0], P = (i: number): V3 => [poly[i][0], yb, poly[i][1]]
    back.tri(P(a), P(c), P(b), undefined, undefined, undefined, [n, n, n])
  }
  for (const o of ops) for (let k = 0; k + 1 < o.length; k++) {
    const [xa, za] = o[k], [xb, zb] = o[k + 1], dx = xb - xa, dz = zb - za, l = Math.hypot(dx, dz)
    if (l < 1e-6) continue
    face(soffit, [xa, yf, za], [xb, yf, zb], [xb, yb, zb], [xa, yb, za], [dz / l, 0, -dx / l])
  }
  if (top) face(top, [x0, yf, z1], [x1, yf, z1], [x1, yb, z1], [x0, yb, z1], [0, 0, 1])
  if (ends) {
    face(ends, [x0, yf, z0], [x0, yb, z0], [x0, yb, z1], [x0, yf, z1], [-1, 0, 0])
    face(ends, [x1, yf, z0], [x1, yb, z0], [x1, yb, z1], [x1, yf, z1], [1, 0, 0])
  }
}

/** A flat panel on a face at y (facing −y when `out` < 0, +y when > 0). */
export function panel(p: Part, pts: XZ[], y: number, out: number) {
  const tris = earcut(pts), n: V3 = [0, out, 0]
  for (const [a, b, c] of tris) {
    const P = (i: number): V3 => [pts[i][0], y, pts[i][1]]
    if (out < 0) p.tri(P(a), P(b), P(c), undefined, undefined, undefined, [n, n, n])
    else p.tri(P(a), P(c), P(b), undefined, undefined, undefined, [n, n, n])
  }
}
/** An axis-aligned box. */
export function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, topPart: Part | null = p, bottom = false) {
  face(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  face(p, [x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [0, 1, 0])
  face(p, [x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [-1, 0, 0])
  face(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
  if (topPart) face(topPart, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
  if (bottom) face(p, [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [0, 0, -1])
}
/** A flat arch-shaped panel: an opening profile (feet included) drawn flush on a face. */
export function archPanel(p: Part, profile: XZ[], y: number, out: number) {
  panel(p, profile.slice().reverse(), y, out)
}

if (import.meta.main) {
  const X0 = -20.5, X1 = 20.5, YF = -7.3, YB = 7.35
  const ZC = 11.7, ZT = 12.6 // cornice foot and top
  const C = -0.3 // the passage axis
  // Passage: round arch 2.8 m wide, crown 5.6 m; it runs through the body.
  const passage = roundArch(C, 1.4, 0, 4.2, 8)

  // Outer layer: the marble frame with the deep pointed recess (1.5 m).
  const YR = YF + 1.5 // the recess back wall
  const FX0 = C - 3.5, FX1 = C + 3.5
  const recess = pointedArch(C, 2.75, 0, 7.9, 3.2, 8)
  slab(FX0, FX1, YF - 0.2, YR, 0, 12.0, [recess], marble, null, ashlar, marble, marble)
  // Brick and ashlar either side, the outer face of the body.
  const ZONE = 7.4 // ashlar from −7.8 to +6.9 round the portal (haklai)
  // Body between the recess and the courtyard side, with the passage.
  // Courtyard layer: a 1.0 m pointed recess in a marble frame.
  const YI = YB - 1.0
  const inner = pointedArch(C, 2.2, 0, 7.0, 2.8, 8)
  slab(C - 3.0, C + 3.0, YI, YB + 0.15, 0, 11.4, [inner], null, marble, ashlar, marble, marble)
  slab(FX0, FX1, YR, YI, 0, ZC, [passage], marble, ashlar, ashlar, null, null)
  // The rest of the body, solid, its faces split by colour.
  const outer = (x0: number, x1: number, p: Part) => face(p, [x0, YF, 0], [x1, YF, 0], [x1, YF, ZC], [x0, YF, ZC], [0, -1, 0])
  outer(X0, C - ZONE - 0.1, brick); outer(C - ZONE - 0.1, FX0, ashlar); outer(FX1, C + ZONE - 0.2, ashlar); outer(C + ZONE - 0.2, X1, brick)
  const backFace = (x0: number, x1: number) => face(ashlar, [x1, YB, 0], [x0, YB, 0], [x0, YB, ZC], [x1, YB, ZC], [0, 1, 0])
  backFace(X0, C - 3.0); backFace(C + 3.0, X1)
  face(ashlar, [C + 3.0, YB, 11.4], [C - 3.0, YB, 11.4], [C - 3.0, YB, ZC], [C + 3.0, YB, ZC], [0, 1, 0])
  face(ashlar, [X0, YB, 0], [X0, YF, 0], [X0, YF, ZC], [X0, YB, ZC], [-1, 0, 0])
  face(ashlar, [X1, YF, 0], [X1, YB, 0], [X1, YB, ZC], [X1, YF, ZC], [1, 0, 0])
  // Recess back wall round the passage, and the frame's sides inside the body.
  // (The slabs above draw the recess reveals and the passage soffits.)

  // Cornice: a dentilled band all round, 0.35 m proud, and the flat top.
  const E = 0.35
  box(marble, X0 - E, X1 + E, YF - E, YB + E, ZC, ZT, roof, true)

  // Gilt tympanum and inscription band at the back of the recess.
  // A grey moulded ring round the recess, which the photos show as its edge.
  {
    const outerP = pointedArch(C, 3.15, 0, 7.9, 3.65, 8), innerP = pointedArch(C, 2.75, 0, 7.9, 3.2, 8)
    panel(ashlar, [...outerP, ...innerP.slice().reverse()].reverse(), YF - 0.24, -1)
  }
  // The gilt calligraphy fills the pointed head; a dark inscription panel
  // runs below it, then white marble over the passage (the tughra left out).
  archPanel(gilt, pointedArch(C, 2.4, 7.9, 7.9, 2.8, 8), YR - 0.04, -1)
  panel(gilt, [[C - 2.0, 6.2], [C + 2.0, 6.2], [C + 2.0, 7.4], [C - 2.0, 7.4]], YR - 0.04, -1)
  // Side frames with pointed niches and plaques (marble, 0.15 m proud).
  for (const [x0, x1] of [[C - 7.45, C - 3.65], [C + 3.65, C + 7.45]]) {
    box(marble, x0, x1, YF - 0.15, YF, 0, 8.4, marble)
    const cx = (x0 + x1) / 2
    archPanel(ashlar, pointedArch(cx, 1.25, 0.6, 4.9, 1.2, 6), YF - 0.19, -1)
    panel(gilt, [[cx - 1.0, 7.2], [cx + 1.0, 7.2], [cx + 1.0, 7.9], [cx - 1.0, 7.9]], YF - 0.19, -1)
  }
  // The courtyard side has the same pair of niche frames (osama-in).
  for (const [x0, x1] of [[C - 6.4, C - 3.0], [C + 3.0, C + 6.4]]) {
    box(marble, x0, x1, YB, YB + 0.12, 0, 7.6, marble)
    archPanel(ashlar, pointedArch((x0 + x1) / 2, 1.1, 0.6, 4.6, 1.1, 6), YB + 0.16, 1)
  }
  // Small grilled windows in the brick (outer) and the courtyard side.
  for (const x of [-13.4, 10.3]) panel(win, [[x - 0.4, 5.2], [x + 0.4, 5.2], [x + 0.4, 6.2], [x - 0.4, 6.2]], YF - 0.04, -1)
  for (const x of [15.0, 10.8, -9.8]) {
    archPanel(win, roundArch(x, 1.3, 0, 3.3, 6), YB + 0.04, 1)
  }
  for (const x of [15.0, 10.8, 6.4, -6.4, -9.8, -14.4]) {
    archPanel(win, roundArch(x, 0.45, 7.4, 8.4, 4), YB + 0.04, 1)
  }

  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : n[1] < -0.5 ? 0.95 : 0.6)
  const parts = [
    { part: brick, material: { ...finish('gate-brick', 0xd9b6a6), floodlight: lit } },
    { part: ashlar, material: { ...finish('gate-ashlar', 0xdcd6cb), floodlight: lit } },
    { part: marble, material: { ...finish('gate-marble', 0xf2f0ea), floodlight: lit } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: gilt, material: finish('gate-gilt', 0x8f7d4c, 0.5) },
  ]
  const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
  const glb = writeGlb('Imperial Gate', parts, {
    frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [41.008597, 28.981487], bearing: 43.2,
  })
  if (triangles > 5000 || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
  const out = process.argv[2] ?? new URL('../models/istanbul-topkapi-imperial-gate.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
