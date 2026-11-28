/**
 * The Fabulous Fox (Fox Theatre), 527 N Grand Blvd, St. Louis (1929; C.
 * Howard Crane; "Siamese Byzantine") — original procedural geometry,
 * CC0-1.0.  bun generators/stl-fox-theatre.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 29.4, the building's own axis (OSM's walls run at
 * 29.4°): -x is the Grand Blvd front. Anchor = the centroid of OSM
 * way/202419428, -90.2323367, 38.6391226.
 *
 * Identity (from the photos below):
 *  1. The cream terracotta front on Grand Blvd: a tall block covered in
 *     ornament, a huge ogee-arched window in a deep arched surround in its
 *     middle, and an ornate pierced crest rising over the middle with
 *     finials along the parapet.                                       (p3)
 *  2. The marquee: a long black box with gold lettering, gilt griffins on
 *     its ends, lit underneath.                                    (p3, p4)
 *  3. The blade sign on the south side of the front: a tall dark panel
 *     with "FOX" stacked vertically in condensed capitals, a scrolled crest,
 *     gilt poles with ball finials either side; neon red and gold at night.
 *                                                                  (p3, p4)
 *  4. A plain buff brick auditorium and stage house behind.         (p3)
 *
 * Plan: OSM way/202419428 turned to bearing 29.4. The parking garage
 * (way/202419435) and the canopy way/1383890769 at the back are separate
 * and not replaced.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018 (flown 2017),
 * 1 m grid with class 18 kept; y = 0 is the Grand Blvd pavement (2 m over
 * the box's ground_min, at the back). Measured: the front block 29.5, the
 * blade sign's top 34–35, the auditorium 36.5 at its middle and 30–33 at its
 * sides, the stage house 31, the rear range 24, the south-east wing 11.
 * Estimated from p3 (the front is ~28 m wide): the crest (to 35), the arch
 * (8 m wide, 8–24 m), the marquee (22 m long, 5.5–9 m, 4 m out), the blade
 * sign (2.6 m wide, 10–29 m, finials to 33.5), the letters (cap height 3.4
 * m, condensed, traced from p4).
 * Famous-sign exception (STYLE.md): the blade's FOX letters are modelled.
 * Left out: the ornament's carving, the griffins' detail (blocks), the
 * marquee's lettering (a lit band).
 *
 * Night: the blade sign and the marquee are neon (red and gold, p4); the
 * front is floodlit; the arched window glows.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  p3  "Fox Theatre, Grand Boulevard, Grand Center, St. Louis, MO.jpg", w_lemay, CC BY-SA 2.0 (the front, 2024)
 *  p4  "Fox Theatre (St. Louis).jpg", Paul Sableman, CC BY 2.0 (the blade sign at dusk)
 *  p1  "Fabulous Fox Theatre - Flickr - m shipp22.jpg", Matthew from St. Louis, CC BY 2.0 (interior; not used for shape)
 * ("Fox Theatre at Night.jpg" turned out to be the Detroit Fox and is not used.)
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, cornice, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { edgePanels } from './atl-flatiron-building'
import { Pen, strokes } from './lettering'
import { discShape } from './stl-cathedral-basilica'

const terra = new Part(), brick = new Part(), win = new Part(), neonRed = new Part(), neonGold = new Part(), dark = new Part()
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const FX = -49.1 // the front plane

// ── The plain brick bulk behind ──
box(brick, -36.0, 16.0, -25.4, 27.7, 0, 32.0, brick, 0.3) // the auditorium's sides
box(brick, -28.0, 8.0, -20.0, 22.0, 32.0, 36.5, brick, 0.3) // its raised middle
box(brick, 16.0, 37.0, -25.2, 18.0, 0, 31.0, brick, 0.3) // the stage house
box(brick, 37.0, 51.3, -9.0, 18.0, 0, 24.0, brick, 0.3) // the rear range
box(brick, 37.0, 51.3, -25.2, -9.0, 0, 11.0, brick, 0.3)
box(brick, -43.0, -36.0, 19.2, 27.7, 0, 29.0, brick, 0.3) // the north return
for (const [a, b] of [[[16, 27.7], [-36, 27.7]], [[-36, -25.4], [16, -25.4]]] as [XY, XY][]) edgePanels(win, a, b, 4, 9, { group: 5, gap: 1, bay: 8, pier: 5, margin: 3, out: 0.05 })

// ── The terracotta front block ──
box(terra, FX, -36.0, -22.2, 19.2, 0, 29.5, null, 0)
cornice(terra, rect(FX, -36.0, -22.2, 19.2), 28.6, 0.9, 0.4, terra)
// the crest over the middle: stepped and swelling, with finials
const crest: [number, number, number][] = [[-12, 10, 31.2], [-8, 6, 32.8], [-4.5, 2.5, 34.2], [-2.2, 0.2, 35.0]]
for (const [y0, y1, z] of crest) box(terra, FX, FX + 3.0, y0, y1, 29.0, z, terra, 0.25)
for (const y of [-21.5, -17, -12.6, 9.6, 14.2, 18.5]) revolve(terra, [FX + 0.6, y], [[0.45, 29.5], [0.45, 30.5], [0.55, 31.0], [0.05, 32.0]], 6, 0, false, false)
const F: [XY, XY] = [[FX, 19.2], [FX, -22.2]] // the front face, left to right as seen from Grand Blvd
const sOf = (y: number) => 19.2 - y
// the arched surround and the great ogee window, with bold mullions
{
  const c = sOf(-1.0)
  const ogee = (w: number, z0: number, zs: number, zt: number): [number, number][] => {
    const pts: [number, number][] = [[c - w / 2, z0], [c + w / 2, z0]]
    for (let i = 0; i <= 6; i++) { const t = i / 6; pts.push([c + (w / 2) * Math.cos((t * Math.PI) / 2) * (1 - 0.15 * t), zs + (zt - zs) * 0.6 * Math.sin((t * Math.PI) / 2)]) }
    pts.push([c + w * 0.12, zt - 1.2], [c, zt])
    pts.push([c - w * 0.12, zt - 1.2])
    for (let i = 6; i >= 0; i--) { const t = i / 6; pts.push([c - (w / 2) * Math.cos((t * Math.PI) / 2) * (1 - 0.15 * t), zs + (zt - zs) * 0.6 * Math.sin((t * Math.PI) / 2)]) }
    return pts
  }
  onWall(terra, F[0], F[1], ogee(12.5, 9.0, 19.5, 27.0), 0.15) // the deep surround (stands proud)
  onWall(win, F[0], F[1], ogee(8.0, 10.0, 19.0, 25.2), 0.22)
  for (const d of [-2.0, 0, 2.0]) onWall(neonGold, F[0], F[1], rectShape(c + d - 0.12, c + d + 0.12, 10.0, 20.5), 0.26) // gilt mullions
  for (const z of [13.5, 17.0]) onWall(neonGold, F[0], F[1], rectShape(c - 4.0, c + 4.0, z - 0.1, z + 0.1), 0.26)
  // the side bays: small arched windows and roundels
  for (const d of [-10.5, 10.5]) {
    onWall(win, F[0], F[1], rectShape(c + d - 0.8, c + d + 0.8, 15.0, 19.0), 0.08)
    onWall(terra, F[0], F[1], discShape(c + d, 23.5, 1.1, 10), 0.12)
  }
}
// the lobby doors under the marquee
onWall(win, F[0], F[1], rectShape(sOf(9), sOf(-11), 0.4, 4.6), 0.06)

// ── The marquee ──
{
  const x0 = FX - 4.2, x1 = FX, y0 = -12.0, y1 = 10.0
  box(dark, x0, x1, y0, y1, 5.6, 8.9, dark, 0.15)
  box(neonGold, x0 - 0.05, x1, y0 - 0.05, y1 + 0.05, 5.3, 5.6, neonGold, 0) // the lit soffit band
  box(neonGold, x0 - 0.08, x0, y0 + 1.5, y1 - 1.5, 7.0, 8.0, null, 0) // the lettering band, gold
  for (const y of [y0 + 0.9, y1 - 0.9]) box(terra, x0 + 0.6, x0 + 2.4, y - 0.7, y + 0.7, 8.9, 11.0, terra, 0.3) // the griffins (blocks)
}

// ── The blade sign, standing out from the front on its south side ──
{
  const y = -14.6, x0 = FX - 4.4, x1 = FX - 0.4, z0 = 10.5, z1 = 28.6, half = 0.35
  box(dark, x0, x1, y - half, y + half, z0, z1, dark, 0.1)
  // scrolled crest and the point under it
  box(neonRed, x0 + 0.5, x1 - 0.5, y - half, y + half, z1, z1 + 1.6, neonRed, 0.4)
  box(neonRed, x0 + 1.2, x1 - 1.2, y - half, y + half, z0 - 1.0, z0, neonRed, 0.3)
  // gilt poles with ball finials on either edge
  for (const x of [x0 - 0.35, x1 + 0.35]) {
    revolve(neonGold, [x, y], [[0.18, z0 - 1.5], [0.18, z1 + 1.2], [0.45, z1 + 1.8], [0.45, z1 + 2.4], [0.05, z1 + 3.0]], 8, 0, false, false)
  }
  revolve(neonGold, [(x0 + x1) / 2, y], [[0.01, z1 + 1.6], [0.6, z1 + 2.2], [0.6, z1 + 2.8], [0.05, z1 + 4.9]], 8, 0, false, false)
  // the border in red neon on both faces
  for (const s of [-1, 1]) {
    const yy = y + s * (half + 0.02)
    const a: XY = s < 0 ? [x0, yy] : [x1, yy], b: XY = s < 0 ? [x1, yy] : [x0, yy]
    const L = x1 - x0
    for (const [u0, u1, v0, v1] of [[0.25, 0.45, z0 + 0.3, z1 - 0.3], [L - 0.45, L - 0.25, z0 + 0.3, z1 - 0.3]]) onWall(neonRed, a, b, rectShape(u0, u1, v0, v1), 0.01)
    // FOX, stacked, condensed capitals traced from p4 (cap height 3.4 m, 2.2 m wide)
    const W = 2.2, H = 3.4
    const xp = new Pen(); xp.moveTo([0, 0]).lineTo([W, H]); xp.moveTo([0, H]).lineTo([W, 0])
    const word = new Pen()
    const f = new Pen(); f.moveTo([0, 0]).lineTo([0, H]).lineTo([W, H]); f.moveTo([0, H * 0.55]).lineTo([W * 0.8, H * 0.55])
    const o = new Pen(); o.moveTo([0, H * 0.25]).lineTo([0, H * 0.75]).quadTo([0, H], [W / 2, H]).quadTo([W, H], [W, H * 0.75]).lineTo([W, H * 0.25]).quadTo([W, 0], [W / 2, 0]).quadTo([0, 0], [0, H * 0.25])
    word.add(f, 0, 2 * (H + 1.1)); word.add(o, 0, H + 1.1); word.add(xp, 0, 0)
    const zBase = z0 + 2.0, uLeft = (L - W) / 2
    const place = (u: number, v: number, w: number): V3 => {
      const along = uLeft + u
      const x = s < 0 ? x0 + along : x1 - along
      return [x, yy + s * w, zBase + v]
    }
    strokes(neonGold, word.paths, { width: 0.42, depth: 0.12, place })
  }
}

const lit = (p: V3, n: V3) => (p[0] < -35.9 && n[2] < 0.7 ? 0.9 : 0)
await save('stl-fox-theatre', 'The Fabulous Fox', [
  { part: terra, material: { ...finish('stl-fox-terracotta', 0xeadfc6), floodlight: lit } },
  { part: brick, material: finish('stl-fox-brick', 0xc9b48e) },
  { part: win, material: PALETTE.window },
  { part: neonRed, material: finish('neon-fox-red', 0xc0453c) },
  { part: neonGold, material: finish('neon-fox-gold', 0xd9b257) },
  { part: dark, material: finish('stl-fox-sign', 0x34302f) },
], { height: 35.0, anchor: [38.6391226, -90.2323367], bearing: 29.4 })
