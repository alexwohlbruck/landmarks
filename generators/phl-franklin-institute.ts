/**
 * The Franklin Institute, Philadelphia — procedural, CC0-1.0, no textures.
 * bun generators/phl-franklin-institute.ts
 *
 * What it is: John T. Windrim's neoclassical museum on Logan Circle
 * (1930-34), pale Indiana limestone: a rusticated ground storey, a giant
 * Corinthian order of pilasters with two rows of windows, a deep
 * entablature and panelled balustrades; three temple porticoes, each of six
 * columns in antis under a pediment with a plain attic block rising behind
 * it: the main one on 20th Street (east, over the Fels Planetarium doors,
 * with its flight of steps), one on Race Street (south) and one on Winter
 * Street (north). Inside the east front, the Benjamin Franklin National
 * Memorial rotunda rises over the roofs as a square attic with a low
 * pyramidal roof and a skylight. To the west: the round Tuttleman theatre
 * (1990) under a glass pyramid, and the plainer later blocks, including the
 * Nicholas and Athena Karabots Pavilion (2014) at the north-west corner,
 * which OSM includes in the outline and the lidar (2015) already shows.
 *
 * Map frame: x along bearing 99.5 (east, towards Logan Circle), y along
 * bearing 9.5 (north), z up, metres; placed at bearing 9.5, the walls (OSM
 * edges 9-10°). Anchor: area centroid of the outline way/50189935,
 * -75.173123 39.958276. z = 0 is the street on the north and east (lidar
 * 3.3 m over ground_min).
 *
 * Covers and replaces: way/50189935 (outline) and all its building:parts:
 * way/340218748, 348799949, 348799950, 348799951, 348799956, 348799961,
 * 348861027, 348861046, 349265879, 349265880, 349265882, 349265906,
 * 349325913, 349325914.
 *
 * Evidence
 * - OSM (2026-11), in this frame: east front x 44.9 from y -62.3 to 50.4,
 *   its portico x 44.1..50.2, y -17.1..6.7, the steps' cheek walls to x
 *   60.7; south front y -62..-65 with the Race Street portico x 5.8..27.6;
 *   north portico x -22.8..1.5 to y 55.9; rotunda block x 3.2..31.1, y
 *   -20.8..9.9; theatre drum about (-41.5, 3.8), r 16.3; Karabots and west
 *   blocks x -66.7..-25.5, y 32.7..51.4.
 * - USGS 3DEP lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015),
 *   1 m grid read in this frame (measured, above z = 0): ranges' balustrade
 *   24.5, the east portico's block 26.7 and pediment apex 27.7; rotunda
 *   attic eaves ~29.7 rising to 34.7; north block 27.3; south-west block
 *   26.5; low west block 19.2; the theatre's drum 21.7, its pyramid 30.7;
 *   Karabots and the north-west blocks 21.7-24.7; south portico ~22.
 * - Photos (Wikimedia Commons): "Philadelphia October 2017 25 (The Franklin
 *   Institute).jpg" and "... 10 ...jpg" (Michael Barera, CC BY-SA 4.0): the
 *   east front square on, scaled to the lidar (0.094 m a pixel): rusticated
 *   base to 5.6, pilasters 5.6-18.8, entablature to 22.1, balustrade to
 *   24.5; lower windows 7.5-12.2, upper 14.6-17.4, base windows 1.4-4.2; the
 *   portico's columns 6.1-19.7, pediment apex 27.4, the attic block behind
 *   it; the corner of two fronts and a second portico; "Franklin Institute
 *   from southeast.jpg" and "Franklin Institute Felt Planetarium.jpg"
 *   (Beyond My Ken, CC BY-SA 4.0): pilasters, windows, a portico close up
 *   (six fluted columns in antis, balconies between, rusticated base);
 *   "Franklin Institute (53574514629).jpg" (ajay_suresh, CC BY 2.0, 2024):
 *   the front across Logan Circle with the steps.
 * - USGS NAIP (public domain): the plan of the roofs, the rotunda's square
 *   roof with its skylight, the theatre's glass pyramid.
 * - Estimated: bay spacing (4.7 m), window widths, the porticoes' depth
 *   (4 m), the columns' diameter (1.36 m, slim enough that the dark porch
 *   reads between them, as in the photos); the west blocks' and Karabots Pavilion's facades (no licensed
 *   photo found: drawn plain, with window bands).
 *
 * Doubts
 * - Which inscription is on which portico is not settled by the photos;
 *   the three porticoes are drawn alike.
 * - The Karabots Pavilion (2014) is drawn from the 2015 lidar and OSM
 *   only.
 *
 * Night: the stone is floodlit faintly, the porticoes more; windows are
 * dark recesses on a non-glowing material.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, rect, cylinder, panel, qf, tf, block, type Rect, type Side } from './dc-white-house'
import { saveModel } from './dc-nga-west'

const stone = new Part(), shade = new Part(), win = new Part(), roof = new Part(), glass = new Part()

const BASE = 5.6, CAPS = 18.8, CORN = 22.1, BAL = 24.5

/** A classical range: base, body, entablature, cornice, balustrade band, roof. */
function range(r: Rect, top = BAL) {
  cbox(stone, rect(r.x0 - 0.2, r.x1 + 0.2, r.y0 - 0.2, r.y1 + 0.2), 0, BASE, { top: false })
  cbox(stone, r, BASE, CAPS, { top: false })
  cbox(stone, rect(r.x0 - 0.1, r.x1 + 0.1, r.y0 - 0.1, r.y1 + 0.1), CAPS, CORN - 0.6, { top: false })
  cbox(stone, rect(r.x0 - 0.6, r.x1 + 0.6, r.y0 - 0.6, r.y1 + 0.6), CORN - 0.6, CORN, { b: 0.3, top: false, bottom: true })
  cbox(stone, r, CORN, top, { b: 0.2, top: roof })
}

/**
 * A classical front: pilasters every `bay` along a0..a1, two rows of
 * windows between, small windows in the base. `skip` leaves bays plain
 * (behind a portico).
 */
function front(side: Side, at: number, a0: number, a1: number, n: number, skip: [number, number] = [0, 0]) {
  const step = (a1 - a0) / n
  for (let k = 0; k <= n; k++) {
    const a = a0 + step * k
    if (a > skip[0] && a < skip[1]) continue
    block(stone, side, at, a - 0.45, a + 0.45, BASE, CAPS, 0.35, false)
  }
  for (let k = 0; k < n; k++) {
    const c = a0 + step * (k + 0.5)
    if (c > skip[0] && c < skip[1]) continue
    panel(win, side, at, c - 0.85, c + 0.85, 7.5, 12.2, 0.05)
    panel(win, side, at, c - 0.75, c + 0.75, 14.6, 17.4, 0.05)
    panel(win, side, at + (side === 'e' || side === 'n' ? 0.2 : -0.2), c - 0.6, c + 0.6, 1.4, 4.2, 0.05)
  }
}

/**
 * A portico of six columns in antis on the face `side` at `at`, spanning
 * a0..a1, `depth` deep, with a pediment and the attic block behind (to
 * `attic`).
 */
function portico(side: Side, at: number, a0: number, a1: number, depth: number, attic: number, floor = 0.0) {
  const ns = side === 'n' || side === 's'
  const out = side === 'n' || side === 'e' ? 1 : -1
  const P = (a: number, d: number, z: number): V3 => (ns ? [a, at + out * d, z] : [at + out * d, a, z])
  const R = (aa: number, ab: number, da: number, db: number): Rect => {
    const p = P(aa, da, 0), q = P(ab, db, 0)
    return rect(Math.min(p[0], q[0]), Math.max(p[0], q[0]), Math.min(p[1], q[1]), Math.max(p[1], q[1]))
  }
  const W = a1 - a0, ant = 2.4, COL0 = 6.1, COL1 = 19.7, PCORN = 22.6, APEX = 27.4
  // podium and the porch's back wall in shade
  cbox(stone, R(a0, a1, 0, depth), 0, BASE + floor, { top: true })
  panel(shade, side, at, a0 + ant, a1 - ant, BASE + floor, COL1, 0.02)
  // antae
  for (const [aa, ab] of [[a0, a0 + ant], [a1 - ant, a1]]) cbox(stone, R(aa, ab, 0, depth), BASE, COL1, { top: false })
  // six columns
  const span = W - 2 * ant
  for (let k = 0; k < 6; k++) {
    const a = a0 + ant + span * (k + 0.5) / 6, [x, y] = P(a, depth - 1.0, 0)
    cylinder(stone, x, y, 0.68, COL0, COL1 - 1.4, 10, 0.6)
    cylinder(stone, x, y, 0.6, COL1 - 1.4, COL1 - 0.3, 10, 0.9)
    cbox(stone, rect(x - 0.95, x + 0.95, y - 0.95, y + 0.95), COL1 - 0.3, COL1, { bottom: true, top: false })
    cbox(stone, rect(x - 0.9, x + 0.9, y - 0.9, y + 0.9), BASE + floor, COL0, { b: 0.1 })
  }
  // ceiling, entablature, cornice
  const c = R(a0 + ant, a1 - ant, 0, depth)
  qf(shade, [c.x0, c.y0, COL1 - 0.02], [c.x1, c.y0, COL1 - 0.02], [c.x1, c.y1, COL1 - 0.02], [c.x0, c.y1, COL1 - 0.02], [0, 0, -1])
  cbox(stone, R(a0, a1, 0, depth), COL1, PCORN - 0.6, { bottom: true, top: false })
  cbox(stone, R(a0 - 0.5, a1 + 0.5, 0, depth + 0.5), PCORN - 0.6, PCORN, { b: 0.3, bottom: true, top: false })
  // the attic block behind, its top at `attic`
  cbox(stone, R(a0 - 0.5, a1 + 0.5, -14, 0), BAL - 0.5, attic, { b: 0.3, top: roof })
  // the pediment: roof slopes and a framed tympanum
  const am = (a0 + a1) / 2, hw = W / 2 + 0.5, d1 = depth + 0.5
  for (const s of [-1, 1]) qf(roof, P(am + s * hw, d1, PCORN), P(am + s * hw, 0, PCORN), P(am, 0, APEX), P(am, d1, APEX), ns ? [s * (APEX - PCORN), out * 0, hw] as V3 : [0, s * (APEX - PCORN), hw])
  const n: V3 = ns ? [0, out, 0] : [out, 0, 0]
  const k = (APEX - PCORN) / hw, wi = hw - 1.2, ai = APEX - 0.8, base = PCORN + 0.15
  qf(stone, P(am - hw, d1, PCORN), P(am + hw, d1, PCORN), P(am + wi, d1, base), P(am - wi, d1, base), n)
  for (const s of [-1, 1]) qf(stone, P(am + s * hw, d1, PCORN), P(am + s * wi, d1, base), P(am, d1, ai), P(am, d1, APEX), n)
  tf(stone, P(am - wi, d1 - 0.4, base), P(am + wi, d1 - 0.4, base), P(am, d1 - 0.4, ai), n)
  qf(stone, P(am - wi, d1, base), P(am + wi, d1, base), P(am + wi, d1 - 0.4, base), P(am - wi, d1 - 0.4, base), [0, 0, 1])
  for (const s of [-1, 1]) qf(stone, P(am + s * wi, d1, base), P(am, d1, ai), P(am, d1 - 0.4, ai), P(am + s * wi, d1 - 0.4, base), ns ? [-s * k, 0, 1] : [0, -s * k, 1])
  void W
}

// ===========================================================================
// The classical ranges.
const EAST = rect(31.1, 44.9, -62.3, 50.4)
range(EAST)
range(rect(-0.7, 31.1, -62.0, -20.8)) // south range
range(rect(3.5, 31.1, 9.9, 50.6)) // north range, east part
front('e', EAST.x1, EAST.y0, EAST.y1, 24, [-18, 8])
front('s', EAST.y0, -0.7, EAST.x1, 10, [5.0, 28.4])
front('n', 50.6, 3.5, EAST.x1, 9)
// the east portico, its steps (treads only, cheek walls)
portico('e', EAST.x1, -17.1, 6.7, 4.0, 26.7, 0.0)
{
  const N = 12, X0 = 49.4, X1 = 60.4
  for (let k = 0; k < N; k++) {
    const xa = X1 - ((X1 - X0) * k) / N, xb = xa - (X1 - X0) / N, z = ((BASE * 0.7) * (k + 1)) / N
    qf(stone, [xa, -14.4, z - (BASE * 0.7) / N], [xa, 3.9, z - (BASE * 0.7) / N], [xa, 3.9, z], [xa, -14.4, z], [1, 0, 0])
    qf(stone, [xa, -14.4, z], [xa, 3.9, z], [xb, 3.9, z], [xb, -14.4, z], [0, 0, 1])
  }
  for (const [y0, y1] of [[-16.6, -14.4], [3.9, 5.6]]) cbox(stone, rect(X0, X1, y0, y1), 0, 1.6, { b: 0.2 })
}
// the south (Race Street) portico
portico('s', -62.0, 5.8, 27.6, 3.0, 24.5, 0.0)
// the north portico and the tall block behind it
cbox(stone, rect(-25.5, 3.5, 24.0, 52.3), 0, BASE, { top: false })
cbox(stone, rect(-25.5, 3.5, 24.0, 52.3), BASE, 25.6, { top: false })
cbox(stone, rect(-26.1, 4.1, 23.4, 52.9), 25.6, 27.3, { b: 0.3, top: roof, bottom: true })
front('n', 52.3, -25.5, 3.5, 6, [-23, 1.6])
portico('n', 52.3, -22.8, 1.5, 3.6, 27.3, 0.0)

// ===========================================================================
// The memorial rotunda: a square attic over the middle with a low hipped
// roof and a skylight.
{
  const r = rect(3.2, 31.1, -20.8, 9.9)
  cbox(stone, r, BAL - 0.5, 29.0, { top: false })
  cbox(stone, rect(r.x0 - 0.5, r.x1 + 0.5, r.y0 - 0.5, r.y1 + 0.5), 29.0, 29.7, { b: 0.25, top: false, bottom: true })
  const cx = (r.x0 + r.x1) / 2, cy = (r.y0 + r.y1) / 2, hx = (r.x1 - r.x0) / 2 + 0.5, hy = (r.y1 - r.y0) / 2 + 0.5, s = 4.0
  const ring = (dx: number, dy: number, z: number): V3[] => [[cx - dx, cy - dy, z], [cx + dx, cy - dy, z], [cx + dx, cy + dy, z], [cx - dx, cy + dy, z]]
  roof.loft([ring(hx, hy, 29.7), ring(s, s, 33.6)])
  glass.loft([ring(s, s, 33.6), ring(s * 0.4, s * 0.4, 34.7)])
  glass.cap(ring(s * 0.4, s * 0.4, 34.7), true)
  // a band of attic windows round it
  for (const [side, at, a0, a1] of [['e', r.x1, r.y0, r.y1], ['w', r.x0, r.y0, r.y1], ['n', r.y1, r.x0, r.x1], ['s', r.y0, r.x0, r.x1]] as [Side, number, number, number][]) {
    const n = 5, st = (a1 - a0) / n
    for (let k = 0; k < n; k++) panel(win, side, at, a0 + st * (k + 0.5) - 1.0, a0 + st * (k + 0.5) + 1.0, 25.6, 27.8, 0.05)
  }
}

// ===========================================================================
// The middle and west: the block behind the east range, the south-west
// blocks, the theatre and the north-west blocks (Karabots Pavilion).
cbox(stone, rect(-27, 3.2, -16, 24), 0, 21.7, { b: 0.3, top: roof })
cbox(stone, rect(3.2, 31.1, -20.8, 9.9), 0, BAL - 0.5, { top: false })
cbox(stone, rect(-27, -0.7, -43.5, -16), 0, 26.5, { b: 0.3, top: roof })
cbox(stone, rect(-44.4, -27, -43.4, -12.0), 0, 19.2, { b: 0.3, top: roof })
cbox(stone, rect(-27.5, -25.5, 18.8, 36.1), 0, 21.7, { top: roof })
cbox(stone, rect(-66.7, -25.5, 36.0, 51.4), 0, 21.7, { b: 0.3, top: roof })
cbox(stone, rect(-56.3, -49.2, 32.7, 36.0), 0, 21.7, { top: roof })
// window bands on the plainer blocks
for (const [side, at, a0, a1] of [['w', -66.7, 37.5, 50.0], ['n', 51.4, -65, -27], ['s', -43.5, -26, -2], ['w', -44.4, -42, -14], ['s', -43.4, -43, -28]] as [Side, number, number, number][]) {
  const n = Math.round((a1 - a0) / 4.5), st = (a1 - a0) / n
  for (let k = 0; k < n; k++) for (const z of [3.0, 9.0, 15.0]) panel(win, side, at, a0 + st * (k + 0.5) - 1.3, a0 + st * (k + 0.5) + 1.3, z, z + 3.2, 0.05)
}
// the theatre: a round drum under a glass pyramid
{
  const cx = -41.5, cy = 3.8, r = 16.3, N = 24
  for (let k = 0; k < N; k++) {
    const a0 = (2 * Math.PI * k) / N, a1 = (2 * Math.PI * (k + 1)) / N
    const p: V3 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0), 0], q: V3 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1), 0]
    const n: V3 = [Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2), 0]
    qf(stone, p, q, [q[0], q[1], 21.7], [p[0], p[1], 21.7], n)
    qf(roof, [p[0], p[1], 21.7], [q[0], q[1], 21.7], [cx + (q[0] - cx) * 0.97, cy + (q[1] - cy) * 0.97, 21.7], [cx + (p[0] - cx) * 0.97, cy + (p[1] - cy) * 0.97, 21.7], [0, 0, 1])
  }
  const h = r * 0.97 * Math.SQRT1_2, ring = (d: number, z: number): V3[] => [[cx - d, cy - d, z], [cx + d, cy - d, z], [cx + d, cy + d, z], [cx - d, cy + d, z]]
  // the deck: a disc over the drum, the pyramid standing on it
  for (let k = 0; k < N; k++) {
    const a0 = (2 * Math.PI * k) / N, a1 = (2 * Math.PI * (k + 1)) / N
    tf(roof, [cx, cy, 21.7], [cx + r * 0.97 * Math.cos(a0), cy + r * 0.97 * Math.sin(a0), 21.7], [cx + r * 0.97 * Math.cos(a1), cy + r * 0.97 * Math.sin(a1), 21.7], [0, 0, 1])
  }
  glass.loft([ring(h, 21.72), ring(0.3, 30.7)])
  glass.cap(ring(0.3, 30.7), true)
}

const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : 0.5)
/** A material with its night floodlighting (written as `_FLOODLIGHT`). */
function withFlood<T extends object>(m: T, floodlight: (p: V3, n: V3) => number) {
  return { ...m, floodlight }
}
if (import.meta.main) {
  await saveModel('phl-franklin-institute', 'The Franklin Institute', [
    { part: stone, material: withFlood(finish('fi-limestone', 0xdcd6ca), lit) },
    { part: shade, material: finish('fi-portico-shade', 0x5b5750) },
    { part: win, material: finish('fi-window-recess', 0x4b4f55, 0.5) },
    { part: roof, material: PALETTE.roof },
    { part: glass, material: { ...PALETTE.glass, color: 0x8fb3c4 } },
  ], { source: 'generators/phl-franklin-institute.ts', bearing: 9.5, osm: 'way/50189935', height: 34.7 }, 6500)
}
