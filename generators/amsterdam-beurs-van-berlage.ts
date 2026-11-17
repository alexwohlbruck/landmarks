/**
 * Beurs van Berlage, Damrak, Amsterdam — procedural, CC0-1.0, no textures.
 * bun generators/amsterdam-beurs-van-berlage.ts
 *
 * H.P. Berlage's commodity exchange of 1898–1903: a long, restrained brick
 * block on the Damrak with small stone-coped gables, three glass-roofed
 * trading halls inside, and the square clock tower on the corner of the
 * Damrak and the Beursplein.
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 37.3°, the straight Damrak front (−x). The Beursplein front is
 * −y with the clock tower on its west corner; the Beursstraat front (+x)
 * runs askew. Anchor: area centroid of the OSM outline way/57858502.
 *
 * Evidence
 * - OSM way/57858502 (outline, 141 m along the Damrak, 37–54 m deep) and
 *   its parts: the clock tower 749918639 (40 m), the big hall 749918653
 *   (30 m, gabled) inside 749918641 (27 m), the second hall 749918631
 *   (16 m), the east wing 749918654 (24 m, gabled), the Damrak wings
 *   749918645/647 (24 and 20 m, gabled), the corner towers 749918648/650
 *   (24 m, pyramidal) and 749918652 (23 m), the small towers on the Damrak
 *   749918642/643 (25 m) and 749931382/383 (22 m), the Beursplein gable
 *   block 749918651 (25 m), the east tower 749918629 (35 m, pyramidal), the
 *   boiler chimney 749918635 (38 m), and the low parts listed in `replaces`.
 * - Published: 1898–1903 by Hendrik Petrus Berlage; tower about 40 m
 *   (nl.wikipedia "Beurs van Berlage"; OSM 40); the clock with the motto
 *   "Beidt uw tijd".
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   - A. J. van der Wal (RCE), "Damrak met toren - Amsterdam - 20368626 -
 *     RCE.jpg", CC BY-SA 4.0 — the tower and the Beursplein and Damrak fronts.
 *     https://commons.wikimedia.org/wiki/File:Damrak_met_toren_-_Amsterdam_-_20368626_-_RCE.jpg
 *   - C messier, "Beurs van Berlage 2506.jpg", "2508.jpg", "1709.jpg",
 *     CC BY-SA 4.0 — the Damrak front both ways, the Beursstraat side with
 *     the east tower and chimney.
 *     https://commons.wikimedia.org/wiki/File:Beurs_van_Berlage_2506.jpg
 *     https://commons.wikimedia.org/wiki/File:Beurs_van_Berlage_2508.jpg
 *     https://commons.wikimedia.org/wiki/File:Beurs_van_Berlage_1709.jpg
 *   - Gerard Dukker (RCE), "Gezicht op de Beurs van Berlage, met op de
 *     achtergrond de Oudekerkstoren en het Centraal Station - 20286195",
 *     CC BY-SA 4.0 — from above: the roofs and the hall's glass ridge.
 *     https://commons.wikimedia.org/wiki/File:Gezicht_op_de_Beurs_van_Berlage,_met_op_de_achtergrond_de_Oudekerkstoren_en_het_Centraal_Station_-_Amsterdam_-_20286195_-_RCE.jpg
 *   - Txllxt TxllxT, "Amsterdam - Beurs van Berlage 1898-1903 II.jpg" (the
 *     clock) and "... View NE on Beurs van Berlage 1898-1903 II.jpg" (the
 *     Beursplein gable), CC BY-SA 4.0.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_-_Beurs_van_Berlage_1898-1903_II.jpg
 *   - Steven Lek, "Beurs van Berlage 2010-1.JPG", public domain — the tower
 *     from up the Damrak. https://commons.wikimedia.org/wiki/File:Beurs_van_Berlage_2010-1.JPG
 *
 * Heights from OSM (published where tagged above); estimated from the
 * photos: the Damrak eaves at 17.5 m with the wing roofs to 23 m, the
 * tower's stages (shaft to 31 m, belfry arch 31.5–37.5 m, corbelled parapet
 * to 40 m, clock at 28 m), the hall's brick clerestory to 22.5 m under the
 * glass to 28 m (OSM parts: 27 and 30 m), window bays (about 4.5 m) and the small dormer gables.
 * The Beursstraat front and the north end are drawn plainly from the
 * aerial and one street photo.
 *
 * Colour: Berlage's warm red-brown brick, sparing pale stone (copings,
 * sills, corbels), grey roofs, the halls' glass.
 *
 * Night: the tower and the Damrak front are floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, circle, type XY, spire, insetRing, capPoly } from './nyc-570-lexington'
import { rectPanel, archPanel, band, block, discPanel } from './nyc-city-hall'

const brick = new Part(), trim = new Part(), win = new Part(), roof = new Part(), glass = new Part()

// ---------------------------------------------------------------- outline
const ring: XY[] = [
  [-23.4, -76.1], [13.0, -76.2], [13.0, -70.1], [15.4, -57.0], [15.7, -37.2], [18.5, -37.1], [22.2, -14.6], [25.7, 11.4], [29.1, 35.8],
  [30.6, 46.7], [30.6, 57.3], [30.3, 66.0], [27.4, 65.7], [-23.4, 65.4], [-23.6, 11.1], [-23.7, -12.0],
]
const EAVE = 17.5, RIDGE = 23.0
prism({ wall: brick, win: null, roof: null, ring, z0: 0, z1: EAVE, facade: null, bevel: 0.3 })
band(trim, ring, 0, 0.7, 0.1)
band(trim, ring, 5.3, 5.6, 0.06)
band(trim, ring, EAVE - 0.5, EAVE, 0.25)

// Ring of wing roofs: up from the eaves to a ridge 6 m in, down to the
// courts 12 m in; the courts roofed flat at the eaves.
{
  const o = insetRing(ring, -0.2), r = insetRing(ring, 6.0), i = insetRing(ring, 12.0)
  for (let k = 0; k < ring.length; k++) {
    const j = (k + 1) % ring.length
    roof.quad([o[k][0], o[k][1], EAVE - 0.1], [o[j][0], o[j][1], EAVE - 0.1], [r[j][0], r[j][1], RIDGE], [r[k][0], r[k][1], RIDGE])
    roof.quad([r[k][0], r[k][1], RIDGE], [r[j][0], r[j][1], RIDGE], [i[j][0], i[j][1], EAVE], [i[k][0], i[k][1], EAVE])
  }
  capPoly(roof, i, EAVE)
}

// ---------------------------------------------------------------- windows
// Ground floor: round-arched openings; three storeys of paired windows above.
function bays(a: XY, b: XY, skip: (s: number) => boolean = () => false) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 3) return
  const n = Math.max(1, Math.round((L - 1.5) / 4.6)), p = (L - 1.5) / n
  for (let k = 0; k < n; k++) {
    const s = 0.75 + p * (k + 0.5)
    if (skip(s)) continue
    archPanel(win, a, b, s, 2.6, 1.0, 4.9, 0.05, 8)
    rectPanel(win, a, b, s, 2.3, 6.4, 8.9)
    rectPanel(win, a, b, s, 2.3, 9.9, 12.3)
    rectPanel(win, a, b, s, 2.3, 13.3, 15.6)
  }
}
for (let k = 0; k < ring.length; k++) {
  const a = ring[k], b = ring[(k + 1) % ring.length]
  // the tower covers the first metres of the Damrak and Beursplein fronts
  if (k === 0) bays(a, b, (s) => s < 8.5)
  else if (k === ring.length - 1) bays(a, b, (s) => s > Math.hypot(b[0] - a[0], b[1] - a[1]) - 7)
  else bays(a, b)
}

/** A small stone-coped gable dormer standing on the eave line of a wall a→b. */
function gablet(a: XY, b: XY, s: number, w = 4.0, h = 4.2) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
  const P = (ss: number, d: number, z: number): V3 => [a[0] + ux * ss + nx * d, a[1] + uy * ss + ny * d, z]
  const z0 = EAVE - 0.1, dd = -2.5
  brick.quad(P(s - w / 2, 0, z0), P(s + w / 2, 0, z0), P(s + w / 2, 0, z0 + h * 0.45), P(s - w / 2, 0, z0 + h * 0.45))
  brick.quad(P(s - w / 2, 0, z0 + h * 0.45), P(s + w / 2, 0, z0 + h * 0.45), P(s + 0.4, 0, z0 + h), P(s - 0.4, 0, z0 + h))
  roof.quad(P(s + w / 2, 0.05, z0 + h * 0.45), P(s + w / 2, dd, z0 + h * 0.45), P(s + 0.4, dd, z0 + h), P(s + 0.4, 0.05, z0 + h))
  roof.quad(P(s - w / 2, dd, z0 + h * 0.45), P(s - w / 2, 0.05, z0 + h * 0.45), P(s - 0.4, 0.05, z0 + h), P(s - 0.4, dd, z0 + h))
  roof.quad(P(s - 0.4, 0.05, z0 + h), P(s + 0.4, 0.05, z0 + h), P(s + 0.4, dd, z0 + h), P(s - 0.4, dd, z0 + h))
  // stone coping blocks at the shoulders and the top
  trim.quad(P(s - 0.55, 0.08, z0 + h - 0.1), P(s + 0.55, 0.08, z0 + h - 0.1), P(s + 0.55, 0.08, z0 + h + 0.35), P(s - 0.55, 0.08, z0 + h + 0.35))
  rectPanel(win, a, b, s, 1.8, z0 + 0.4, z0 + 2.4)
}
{
  const D0: XY = [-23.4, 65.4], D1: XY = [-23.7, -12.0], L = Math.hypot(D1[0] - D0[0], D1[1] - D0[1])
  for (let s = 12; s < L - 3; s += 9.2) { const y = 65.4 - s; if (y > 4 && y < 14.5) continue; gablet(D0, D1, s) }
  const D2: XY = [-23.7, -12.0], D3: XY = [-23.4, -76.1]
  for (const s of [9, 18, 27, 36]) gablet(D2, D3, s)
}

// ---------------------------------------------------------------- halls
// The big exchange hall: brick clerestory walls above the wing roofs and a
// long glass gable (Dukker's aerial); the second hall lower, to the north.
function hall(x0: number, y0: number, x1: number, y1: number, wall: number, ridge: number, top: Part = glass, clere = true) {
  prism({ wall: brick, win: null, roof: null, ring: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0: EAVE - 0.5, z1: wall, facade: null, bevel: 0.2 })
  band(trim, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], wall - 0.4, wall, 0.15)
  const cx = (x0 + x1) / 2, o = 0.4
  top.quad([x1 + o, y0, wall - 0.2], [x1 + o, y1, wall - 0.2], [cx, y1, ridge], [cx, y0, ridge])
  top.quad([x0 - o, y1, wall - 0.2], [x0 - o, y0, wall - 0.2], [cx, y0, ridge], [cx, y1, ridge])
  brick.tri([x0, y0, wall], [x1, y0, wall], [cx, y0, ridge + 0.4]); brick.tri([x1, y1, wall], [x0, y1, wall], [cx, y1, ridge + 0.4])
  for (const y of [y0, y1]) block(trim, cx - 0.4, y - 0.4, cx + 0.4, y + 0.4, ridge + 0.2, ridge + 1.0)
  // clerestory windows along the long sides
  if (!clere) return
  const n = Math.round((y1 - y0) / 4.5)
  for (let k = 0; k < n; k++) {
    const s = ((y1 - y0) * (k + 0.5)) / n
    archPanel(win, [x1, y0], [x1, y1], s, 2.2, EAVE + 1.0, wall - 0.8, 0.05, 6)
    archPanel(win, [x0, y1], [x0, y0], s, 2.2, EAVE + 1.0, wall - 0.8, 0.05, 6)
  }
}
// The big hall: a glass ridge narrower than its OSM part (749918653, 30 m)
// and drawn to 28 m, between that part and the broad 27 m roof of
// 749918641 it sits in, so it does not loom over the Damrak front;
// the second hall is low (749918631, 16 m), so only a low skylight shows
// above the wing roofs; the Effectenbeurs wing (749918654, 24 m gabled) is tiled.
hall(-11.5, -54.5, 5.0, -15.0, 22.5, 28.0)
glass.quad([2.5, 15.0, EAVE + 0.1], [2.5, 46.0, EAVE + 0.1], [-4.5, 46.0, EAVE + 1.8], [-4.5, 15.0, EAVE + 1.8])
glass.quad([-11.5, 46.0, EAVE + 0.1], [-11.5, 15.0, EAVE + 0.1], [-4.5, 15.0, EAVE + 1.8], [-4.5, 46.0, EAVE + 1.8])
hall(5.0, 13.5, 18.5, 47.5, 18.0, 24.0, roof, false)

// ---------------------------------------------------------------- the Beursplein front
// The central gable block with its stone relief, the low arcaded block by
// the tower, and the corner turret on the Beursstraat.
{
  const x0 = -10.0, x1 = 1.8, y0 = -76.15, y1 = -64.0
  prism({ wall: brick, win: null, roof: null, ring: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0: 0, z1: 19.0, facade: null, bevel: 0.25 })
  const cx = (x0 + x1) / 2
  brick.tri([x0, y0, 19], [x1, y0, 19], [cx, y0, 25.2])
  roof.quad([x1 + 0.3, y0 - 0.3, 18.8], [x1 + 0.3, y1, 18.8], [cx, y1, 25.2], [cx, y0 - 0.3, 25.2])
  roof.quad([x0 - 0.3, y1, 18.8], [x0 - 0.3, y0 - 0.3, 18.8], [cx, y0 - 0.3, 25.2], [cx, y1, 25.2])
  // the stone gable face carrying the relief roundel
  trim.tri([x0 + 1.0, y0 - 0.08, 19.8], [x1 - 1.0, y0 - 0.08, 19.8], [cx, y0 - 0.08, 24.6])
  trim.quad([x0 + 1.0, y0 - 0.08, 18.6], [x1 - 1.0, y0 - 0.08, 18.6], [x1 - 1.0, y0 - 0.08, 19.8], [x0 + 1.0, y0 - 0.08, 19.8])
  discPanel(win, [x1, y0], [x0, y0], x1 - cx, 20.9, 1.5, 0.14, 12)
  // three big entrance arches under the gable
  for (const s of [2.4, 5.9, 9.4]) archPanel(win, [x0, y0], [x1, y0], s, 2.8, 0, 5.6, 0.06, 8)
}
// Arcade across the Beursplein front east of the gable block.
for (const s of [3, 6.5, 10]) archPanel(win, [1.8, -76.15], [13.0, -76.2], s, 2.8, 0, 5.4, 0.08, 8)
{
  const x0 = 7.0, x1 = 13.0, y0 = -76.2, y1 = -70.2
  prism({ wall: brick, win: null, roof: null, ring: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0: 0, z1: 19.5, facade: null, bevel: 0.2 })
  band(trim, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 19.0, 19.6, 0.15)
  spire(roof, [[x0 - 0.2, y0 - 0.2], [x1 + 0.2, y0 - 0.2], [x1 + 0.2, y1 + 0.2], [x0 - 0.2, y1 + 0.2]], 19.6, [(x0 + x1) / 2, (y0 + y1) / 2, 23.5])
}

// ---------------------------------------------------------------- small towers
function squareTower(x0: number, y0: number, x1: number, y1: number, h: number, top: number | null) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  prism({ wall: brick, win: null, roof: top ? null : roof, ring: r, z0: 0, z1: h, facade: null, bevel: 0.2 })
  band(brick, r, h - 0.6, h, 0.15)
  if (top) spire(roof, [[x0 - 0.2, y0 - 0.2], [x1 + 0.2, y0 - 0.2], [x1 + 0.2, y1 + 0.2], [x0 - 0.2, y1 + 0.2]], h, [(x0 + x1) / 2, (y0 + y1) / 2, top])
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (h > EAVE + 3) archPanel(win, a, b, L / 2, Math.min(2.0, L * 0.4), EAVE + 1.0, h - 1.2, 0.05, 6)
  }
}
squareTower(-23.7, -12.2, -15.8, -7.8, 25.0, null)
squareTower(-23.6, 7.0, -15.6, 11.4, 25.0, null)
squareTower(-23.4, -61.3, -15.7, -57.2, 22.0, null)
squareTower(7.6, -61.1, 15.4, -56.9, 22.0, null)
squareTower(-23.4, 56.8, -15.2, 64.7, 20.0, 24.0)
squareTower(22.6, 57.0, 30.4, 65.2, 20.0, 24.0)
squareTower(20.6, 7.1, 25.0, 11.4, 31.0, 35.0)
// the boiler-house chimney on the Beursstraat
prism({ wall: brick, win: null, roof: trim, ring: circle(21.7, -13.5, 1.05, 12), z0: 0, z1: 38.0, facade: null, bevel: 0.1 })
band(trim, circle(21.7, -13.5, 1.05, 12), 36.6, 37.2, 0.18)

// ---------------------------------------------------------------- the clock tower
// Square (8.0 × 6.6 m, OSM) on the Damrak × Beursplein corner: a plain brick
// shaft, the clock under the belfry, one great round-arched opening on each
// face, a corbelled stone-trimmed parapet with corner posts.
{
  const x0 = -23.4, x1 = -15.4, y0 = -76.1, y1 = -69.5
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const SHAFT = 38.0, TOP = 40.0
  prism({ wall: brick, win: null, roof: null, ring: r, z0: 0, z1: SHAFT, facade: null, bevel: 0.25 })
  band(trim, r, 0, 0.8, 0.1)
  band(trim, r, 30.8, 31.4, 0.18) // the belfry balcony
  band(trim, r, SHAFT - 0.6, SHAFT, 0.45) // corbel table
  // parapet: four walls with a stone coping, and corner posts
  const t = 0.5
  block(brick, x0 - 0.3, y0 - 0.3, x1 + 0.3, y0 - 0.3 + t, SHAFT, TOP)
  block(brick, x0 - 0.3, y1 + 0.3 - t, x1 + 0.3, y1 + 0.3, SHAFT, TOP)
  block(brick, x0 - 0.3, y0 - 0.3, x0 - 0.3 + t, y1 + 0.3, SHAFT, TOP)
  block(brick, x1 + 0.3 - t, y0 - 0.3, x1 + 0.3, y1 + 0.3, SHAFT, TOP)
  roof.quad([x0, y0, SHAFT - 0.2], [x1, y0, SHAFT - 0.2], [x1, y1, SHAFT - 0.2], [x0, y1, SHAFT - 0.2])
  for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] as XY[]) block(trim, x - 0.6, y - 0.6, x + 0.6, y + 0.6, TOP - 0.3, TOP + 0.9)
  block(trim, x0 - 0.35, y0 - 0.35, x1 + 0.35, y0 + 0.2, TOP - 0.25, TOP + 0.05)
  block(trim, x0 - 0.35, y1 - 0.2, x1 + 0.35, y1 + 0.35, TOP - 0.25, TOP + 0.05)
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    archPanel(win, a, b, L / 2, Math.min(3.6, L * 0.5), 31.4, 37.4, 0.06, 10)
    // a column of small windows up the shaft
    rectPanel(win, a, b, L / 2, 0.9, 19.0, 21.0)
    rectPanel(win, a, b, L / 2, 0.9, 12.0, 14.0)
  }
  // the clock (south and west faces): a square stone frame and the dial
  for (const [a, b] of [[r[0], r[1]], [r[3], r[0]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    rectPanel(trim, a, b, L / 2, 3.1, 26.4, 29.6, 0.08)
    discPanel(win, a, b, L / 2, 28.0, 1.25, 0.12, 12)
  }
}

// ---------------------------------------------------------------- write
const lit = (p: V3, n: V3): number => {
  if (n[2] > 0.7) return 0.15
  if (p[0] < -15 && p[1] < -60) return 1 // the tower
  return n[0] < -0.5 || n[1] < -0.5 ? 0.8 : 0.35
}
finishModel('Beurs van Berlage', 'amsterdam-beurs-van-berlage', [
  { part: brick, material: { ...finish('beurs-brick', 0xa87a63), floodlight: lit } },
  { part: trim, material: { ...finish('beurs-stone', 0xece0c6), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: roof, material: finish('beurs-roof', 0x8e8f93) },
  { part: glass, material: { ...PALETTE.glass, color: 0x8495a2 } },
], { bearing: 37.3, osm: 'way/57858502', height: 40.9 }, 6500)
