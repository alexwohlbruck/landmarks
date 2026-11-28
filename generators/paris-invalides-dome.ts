/**
 * Église du Dôme des Invalides (Hardouin-Mansart, 1677–1706), with the
 * Cathédrale Saint-Louis-des-Invalides joined behind it — procedural,
 * CC0-1.0, no textures. bun generators/paris-invalides-dome.ts
 *
 * One building: the Dôme and the soldiers' church are joined above ground
 * through the sanctuary, so they are one model. The Hôtel's ranges round the
 * courts are a separate model (paris-invalides), as the lead allowed when
 * the whole hôtel does not fit one budget.
 *
 * Map frame: x east, y north in the church's frame (compass 4.2° is +y),
 * z up, metres. Placement bearing 4.2. Anchor: the area centroid of the
 * Dôme's OSM outline way/112452790 (lng 2.3125389, lat 48.8550339); the
 * Dôme's centre is at (0, −0.8); Saint-Louis runs north to y 102.
 *
 * Evidence
 * - OSM (measured, in this frame): Dôme outline and its 50 parts: the
 *   square body x ±25.1, y −25.8…24.4, its east/west frontispieces to
 *   x ±27.7 (y −9…7.4) under gables 28→33 m; the south frontispiece x ±13.5
 *   to y −28.8, its centre bay x ±7.4 to −31 with the pediment 28→33 m; the
 *   lower columns (2.3→13.1 m) at y −26.9 (x ±14.5, ±20.1), −29.9 (x ±7.9,
 *   ±12.1) and −31.8 (x ±3.8, ±6.3); steps 2.3 m; body 28 m; the six small
 *   corner cupolas (r 2.2, 27→30.8 m); the drum's base r 16.4 to 34.2 m
 *   with its sloping skirt (r 20.6, 36 m); the drum r 15.4 to 46.3 m and
 *   its balustrade r 16.4 to 48.1 m; the dome part r 14.2 to 72 m; the
 *   lantern r 4.7 to 77.6 m, its cap to 85.6 m, the spire to 100 m.
 *   Steps drawn 1.8 + 1.0 m (OSM 2.3 m) because the Mapterhorn ground rises
 *   ~1.7 m across the site to the parvis in front of the steps.
 *   Saint-Louis way/64955027: nave x ±7.6, y 36…102, roof to 35.6 m, aisles
 *   to x ±13.6 (15 m), the sanctuary x ±10, y 20…34.7 under a low dome
 *   to 36 m, small domes x ±(7.4…16.8), y 26…35 (15 m).
 * - Photo (Wikimedia Commons, evidence): "South facade of Dôme des
 *   Invalides.jpg" (Maksim Sokolov (maxergon.com), CC BY-SA 4.0; the south
 *   front, level, read against the 55 m body width for the façade (lower
 *   order to 12.5 m, its entablature to 15.8 m, upper order to 26 m, the
 *   pediment to 33 m) and, for the crown, against the dome's published
 *   27.5 m diameter (4.36 px/m; the drum's buttressed colonnade then
 *   reads r 17 m, outside OSM's r 15.4 m wall): attic with 12 arched
 *   windows 48.1→59.7 m (r 14.4), cornice to 60.5 m, dome r 13.75 m rising
 *   15.6 m to the lantern's ring at 76.1 m, lantern r 3.3 m to 83.8 m, its
 *   cupola to 86.4 m, the obelisk spire to 96 m, ball and cross to 99.4 m
 *   (OSM 100 m)); "Hôtel des Invalides, North View, Paris 7e 140402
 *   1.jpg" (DXR, CC BY-SA 3.0; the crown above the hôtel from the north).
 * - Published (Wikipedia FR "Dôme des Invalides"): 107 m high. The photo
 *   and OSM agree on about 100 m to the cross from the parvis; drawn 100.5 m.
 *   Doubt: the 7 m difference (perhaps measured from a lower datum).
 * - Gold: the dome's lead is gilded (ribs, trophies and garlands), which
 *   reads as a gold dome; drawn in one gold finish pulled to the palette's
 *   lightness, with 12 raised ribs and the dark lucarnes between them at mid-height.
 * - Estimated: the drum's 12 windows and paired columns (photo), window
 *   and niche sizes, Saint-Louis' wall heights (24 m nave, 15 m aisles).
 * - Simplified: statues, trophies, garlands, the scrolled buttresses of the
 *   attic, the drum's 40 columns drawn as 12 pairs on buttresses.
 * - Look-only references: none.
 *
 * Night: floodlit all round, the dome's gold strongly.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, grow, hip, qf, rect, save, tf, type Rect } from './dc-white-house'
import { ngon, ngonPrism, spire } from './dc-smithsonian-castle'
import { face, faceAB, holePanel, type XY } from './london-westminster-abbey'

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), gold = new Part(), door = new Part()
const CX = 0, CY = -0.8 // the dome's centre

// ---- The square body: two orders under a balustrade.
const body = rect(-25.1, 25.1, -25.8, 24.4)
const ew: Rect[] = [rect(-27.7, -25.1, -9.0, 7.4), rect(25.1, 27.7, -9.0, 7.4)]
const front = rect(-13.5, 13.5, -28.8, -25.8), centre = rect(-7.4, 7.4, -31.0, -28.8)
for (const r of [body, ...ew, front, centre]) {
  cbox(stone, r, 0, 26.0, { top: false })
  cbox(trim, grow(r, 0.35), 13.1, 15.8, { b: 0.2, bottom: true, top: false })
  cbox(trim, grow(r, 0.5), 26.0, 28.0, { b: 0.3, bottom: true, top: roof })
}
// Balustrades on the corner parts, the east/west and south pediments.
for (const [x0, x1, y0, y1] of [[-25.1, -13.5, -25.8, -24.9], [13.5, 25.1, -25.8, -24.9], [-25.1, -24.2, -25.8, 24.4], [24.2, 25.1, -25.8, 24.4]]) cbox(trim, rect(x0, x1, y0, y1), 28.0, 29.2, { b: 0.15 })
for (const s of [-1, 1]) {
  const x = s * 28.2, xi = s * 25.1
  tf(stone, [x, -9.4, 28.0], [x, 7.8, 28.0], [x, -0.8, 33.0], [s, 0, 0])
  qf(roof, [x, -9.4, 28.0], [x, -0.8, 33.0], [xi, -0.8, 33.0], [xi, -9.4, 28.0], [0, -1, 1.7])
  qf(roof, [x, 7.8, 28.0], [x, -0.8, 33.0], [xi, -0.8, 33.0], [xi, 7.8, 28.0], [0, 1, 1.7])
  for (const [y0, y1] of [[-9.4, -0.8], [7.8, -0.8]]) qf(trim, [x - s * 0.01, y0, 28.0], [x + s * 0.6, y0, 28.0], [x + s * 0.6, y1, 33.4], [x - s * 0.01, y1, 33.4], [s * 0.2, y0 < y1 ? -1 : 1, 1])
}
{
  const y = -31.6
  tf(stone, [-7.9, y, 28.0], [7.9, y, 28.0], [0, y, 33.0], [0, -1, 0])
  qf(roof, [-7.9, y, 28.0], [0, y, 33.0], [0, -28.8, 33.0], [-7.9, -28.8, 28.0], [-1, 0, 1.6])
  qf(roof, [7.9, y, 28.0], [0, y, 33.0], [0, -28.8, 33.0], [7.9, -28.8, 28.0], [1, 0, 1.6])
  qf(trim, [-7.9, y - 0.5, 28.0], [-7.9, y, 28.0], [0, y, 33.4], [0, y - 0.5, 33.4], [-0.6, -0.4, 1])
  qf(trim, [7.9, y - 0.5, 28.0], [7.9, y, 28.0], [0, y, 33.4], [0, y - 0.5, 33.4], [0.6, -0.4, 1])
}
// Steps and the south front's two orders of columns.
cbox(trim, rect(-21.4, 21.4, -33.6, -25.8), 0, 1.8, {})
cbox(trim, rect(-13.5, 13.5, -32.8, -25.8), 1.8, 2.8, {})
const col = (x: number, y: number, z0: number, z1: number, r: number, n = 8, p = stone) => {
  ngonPrism(p, x, y, r, n, z0, z1 - r * 0.9, { top: false, r1: r * 0.9 })
  cbox(trim, rect(x - r * 1.15, x + r * 1.15, y - r * 1.15, y + r * 1.15), z1 - r * 0.9, z1, { bottom: true, top: false })
}
for (const s of [-1, 1]) {
  for (const [x, y] of [[3.8, -31.8], [6.3, -31.8], [7.9, -29.9], [12.1, -29.9], [14.5, -26.9], [20.1, -26.9]]) col(s * x, y, x > 13 ? 1.8 : 2.8, 13.1, 0.75)
  for (const [x, y] of [[3.8, -31.6], [6.3, -31.6], [8.6, -29.4], [12.1, -29.4]]) col(s * x, y, 15.8, 26.0, 0.62)
  // Lower entablature over the outer columns of the side bays.
  cbox(trim, rect(Math.min(s * 13.5, s * 21.0), Math.max(s * 13.5, s * 21.0), -27.8, -25.8), 13.1, 15.8, { b: 0.2, bottom: true })
}
cbox(trim, rect(-7.9, 7.9, -32.6, -31.0), 13.1, 15.8, { b: 0.2, bottom: true })
cbox(trim, rect(-13.0, 13.0, -30.7, -28.8), 13.1, 15.8, { b: 0.2, bottom: true })
cbox(trim, rect(-7.9, 7.9, -32.4, -31.0), 26.0, 28.0, { b: 0.2, bottom: true })
cbox(trim, rect(-13.0, 13.0, -30.2, -28.8), 26.0, 28.0, { b: 0.2, bottom: true })
{
  const F = face('s', -31.0)
  holePanel(door, F, { a0: -2.0, a1: 2.0, zb: 2.8, zs: 8.6, head: 'round' }, 0.06)
  holePanel(win, F, { a0: -2.3, a1: 2.3, zb: 17.0, zs: 21.6, head: 'round' }, 0.06)
  const Fs = face('s', -25.8)
  for (const s of [-1, 1]) {
    holePanel(win, Fs, { a0: s * 18.3 - 1.7, a1: s * 18.3 + 1.7, zb: 4.0, zs: 9.4, head: 'flat' }, 0.06)
    holePanel(win, Fs, { a0: s * 18.3 - 1.7, a1: s * 18.3 + 1.7, zb: 17.6, zs: 22.6, head: 'flat' }, 0.06)
    holePanel(trim, face('s', -28.8), { a0: s * 10.0 - 1.0, a1: s * 10.0 + 1.0, zb: 3.0, zs: 8.5, head: 'round' }, 0.06)
    holePanel(trim, face('s', -28.8), { a0: s * 10.4 - 1.0, a1: s * 10.4 + 1.0, zb: 17.4, zs: 22.0, head: 'round' }, 0.06)
  }
  // Windows on the other three faces, two orders.
  for (const [side, at] of [['e', 25.1], ['w', -25.1], ['n', 24.4]] as Array<['e' | 'w' | 'n', number]>) {
    const Fx = face(side, at)
    for (const a of side === 'n' ? [-18.3, 18.3] : [-19.0, 15.8]) {
      holePanel(win, Fx, { a0: a - 1.7, a1: a + 1.7, zb: 4.0, zs: 9.4, head: 'round' }, 0.06)
      holePanel(win, Fx, { a0: a - 1.7, a1: a + 1.7, zb: 17.6, zs: 22.6, head: 'flat' }, 0.06)
    }
  }
  for (const s of [-1, 1]) holePanel(win, face(s > 0 ? 'e' : 'w', s * 27.7), { a0: -3.0, a1: 1.4, zb: 17.0, zs: 22.0, head: 'round' }, 0.06)
}
// The six small corner cupolas.
for (const [x, y] of [[22.5, 8.6], [-22.5, 9.0], [22.5, -9.7], [-22.5, -9.4], [9.4, -24.2], [-9.7, -24.2]] as XY[]) {
  ngonPrism(stone, x, y, 1.9, 8, 28.0, 29.4, { top: false })
  roof.loft([ngon(x, y, 2.1, 8, 29.4), ngon(x, y, 1.5, 8, 30.4)])
  spire(roof, ngon(x, y, 1.5, 8, 30.4), [x, y, 31.0])
}

// ---- The drum: base and skirt, windows between paired columns, balustrade.
const N = 24
ngonPrism(stone, CX, CY, 16.4, N, 28.0, 34.2, { top: false })
roof.loft([ngon(CX, CY, 20.6, N, 28.0), ngon(CX, CY, 16.5, N, 31.6)])
ngonPrism(trim, CX, CY, 16.8, N, 34.2, 35.0, { top: roof, bottom: true })
ngonPrism(stone, CX, CY, 15.0, N, 35.0, 45.2, { top: false })
for (let k = 0; k < 12; k++) {
  const t = (2 * Math.PI * k) / 12, tw = t + Math.PI / 12
  for (const o of [-0.07, 0.07]) col(CX + 16.9 * Math.cos(t + o), CY + 16.9 * Math.sin(t + o), 35.0, 45.2, 0.55, 6)
  cbox(stone, rect(CX + 16.0 * Math.cos(t) - 1.0, CX + 16.0 * Math.cos(t) + 1.0, CY + 16.0 * Math.sin(t) - 1.0, CY + 16.0 * Math.sin(t) + 1.0), 35.0, 45.2, { top: false })
  const a: XY = [CX + 15.0 * Math.cos(tw - 0.1), CY + 15.0 * Math.sin(tw - 0.1)], b: XY = [CX + 15.0 * Math.cos(tw + 0.1), CY + 15.0 * Math.sin(tw + 0.1)]
  holePanel(win, faceAB(a, b), { a0: 0, a1: Math.hypot(b[0] - a[0], b[1] - a[1]), zb: 36.6, zs: 42.2, head: 'round', seg: 4 }, 0.06)
}
ngonPrism(trim, CX, CY, 17.6, N, 45.2, 46.3, { top: roof, bottom: true })
ngonPrism(trim, CX, CY, 17.0, N, 46.3, 48.1, { top: false })
// The attic with its arched lucarnes and the cornice.
ngonPrism(stone, CX, CY, 14.4, N, 46.3, 59.7, { top: false })
for (let k = 0; k < 12; k++) {
  const tw = (2 * Math.PI * k) / 12 + Math.PI / 12
  const a: XY = [CX + 14.4 * Math.cos(tw - 0.08), CY + 14.4 * Math.sin(tw - 0.08)], b: XY = [CX + 14.4 * Math.cos(tw + 0.08), CY + 14.4 * Math.sin(tw + 0.08)]
  holePanel(win, faceAB(a, b), { a0: 0, a1: Math.hypot(b[0] - a[0], b[1] - a[1]), zb: 51.4, zs: 56.0, head: 'round', seg: 4 }, 0.06)
}
ngonPrism(trim, CX, CY, 14.8, N, 59.7, 60.5, { top: roof, bottom: true })

// ---- The gilded dome, ribs, lucarnes; lantern, spire and cross.
{
  const R = 13.75, B = 16.4, Z = 60.5, rows = 8, RT = 4.6
  const prof: Array<[number, number]> = []
  const tTop = Math.acos(RT / R)
  for (let i = 0; i <= rows; i++) { const t = (tTop * i) / rows; prof.push([R * Math.cos(t), Z + B * Math.sin(t)]) }
  gold.loft(prof.map(([r, z]) => ngon(CX, CY, r, N, z)))
  gold.cap(ngon(CX, CY, RT, N, prof[rows][1]), true)
  for (let k = 0; k < 12; k++) {
    const t = (2 * Math.PI * k) / 12
    for (let i = 0; i < rows; i++) {
      const [r0, z0] = prof[i], [r1, z1] = prof[i + 1]
      const P = (r: number, z: number, o: number): V3 => [CX + (r + 0.18) * Math.cos(t) - o * Math.sin(t), CY + (r + 0.18) * Math.sin(t) + o * Math.cos(t), z]
      qf(gold, P(r0, z0, -0.32), P(r0, z0, 0.32), P(r1, z1, 0.32), P(r1, z1, -0.32), [Math.cos(t), Math.sin(t), (r0 - r1) / (z1 - z0)])
    }
    // A dark lucarne between the ribs, low on the dome.
    const tw = t + Math.PI / 12, [r0, z0] = prof[3], [r1, z1] = prof[5]
    const L = (r: number, z: number, o: number): V3 => [CX + (r + 0.1) * Math.cos(tw) - o * Math.sin(tw), CY + (r + 0.1) * Math.sin(tw) + o * Math.cos(tw), z]
    qf(win, L(r0, z0, -1.0), L(r0, z0, 1.0), L(r1, z1, 0.8), L(r1, z1, -0.8), [Math.cos(tw), Math.sin(tw), 0.6])
  }
  const zl = prof[rows][1]
  ngonPrism(gold, CX, CY, 4.6, 16, zl, zl + 1.0, { top: false })
  ngonPrism(gold, CX, CY, 3.3, 12, zl + 1.0, 83.0, { top: false })
  for (let k = 0; k < 8; k++) {
    const t0 = (2 * Math.PI * k) / 8 + 0.1, t1 = t0 + 0.55
    const a: XY = [CX + 3.3 * Math.cos(t0), CY + 3.3 * Math.sin(t0)], b: XY = [CX + 3.3 * Math.cos(t1), CY + 3.3 * Math.sin(t1)]
    holePanel(win, faceAB(a, b), { a0: 0, a1: Math.hypot(b[0] - a[0], b[1] - a[1]), zb: zl + 2.0, zs: zl + 4.8, head: 'round', seg: 4 }, 0.06)
  }
  ngonPrism(gold, CX, CY, 3.7, 12, 83.0, 83.8, { top: false, bottom: true })
  gold.loft([ngon(CX, CY, 3.3, 12, 83.8), ngon(CX, CY, 2.4, 12, 85.6), ngon(CX, CY, 1.1, 12, 86.4)])
  spire(gold, ngon(CX, CY, 1.1, 8, 86.4), [CX, CY, 96.0])
  gold.loft([ngon(CX, CY, 0.25, 6, 95.4), ngon(CX, CY, 0.55, 6, 95.9), ngon(CX, CY, 0.25, 6, 96.4)])
  cbox(gold, rect(CX - 0.13, CX + 0.13, CY - 0.13, CY + 0.13), 96.4, 99.4, {})
  cbox(gold, rect(CX - 0.8, CX + 0.8, CY - 0.13, CY + 0.13), 98.1, 98.45, {})
}

// ---- Saint-Louis-des-Invalides behind: sanctuary, nave, aisles.
{
  const sanc = rect(-10.0, 10.0, 24.4, 34.7)
  cbox(stone, sanc, 0, 26.0, { top: false })
  cbox(trim, grow(sanc, 0.3), 26.0, 27.0, { bottom: true, top: false })
  hip(roof, grow(sanc, 0.2), 27.0, 36.0, 6.0)
  for (const s of [-1, 1]) {
    ngonPrism(stone, s * 12.1, 30.6, 4.4, 12, 0, 12.0, { top: false })
    roof.loft([ngon(s * 12.1, 30.6, 4.6, 12, 12.0), ngon(s * 12.1, 30.6, 3.0, 12, 14.2), ngon(s * 12.1, 30.6, 1.0, 12, 15.0)])
    const aisle = rect(Math.min(s * 7.6, s * 13.6), Math.max(s * 7.6, s * 13.6), 34.7, 102.0)
    cbox(stone, aisle, 0, 14.0, { top: false })
    cbox(trim, grow(aisle, 0.2), 14.0, 14.6, { bottom: true, top: roof })
    for (let y = 40.0; y < 100; y += 7.4) holePanel(win, face(s > 0 ? 'e' : 'w', s * 13.6), { a0: y - 1.3, a1: y + 1.3, zb: 4.5, zs: 10.0, head: 'round', seg: 4 }, 0.06)
  }
  const nave = rect(-7.6, 7.6, 34.7, 102.0)
  cbox(stone, nave, 0, 24.0, { top: false })
  cbox(trim, grow(nave, 0.3), 24.0, 25.0, { bottom: true, top: false })
  for (const s of [-1, 1]) {
    qf(roof, [s * 7.9, 34.7, 25.0], [s * 7.9, 102.3, 25.0], [0, 102.3, 35.6], [0, 34.7, 35.6], [s, 0, 0.8])
    for (let y = 40.0; y < 100; y += 7.4) holePanel(win, face(s > 0 ? 'e' : 'w', s * 7.6), { a0: y - 1.4, a1: y + 1.4, zb: 16.0, zs: 21.0, head: 'round', seg: 4 }, 0.06)
  }
  tf(stone, [-7.9, 102.3, 25.0], [7.9, 102.3, 25.0], [0, 102.3, 35.6], [0, 1, 0])
}

// Floodlit: the stone all round, the gold dome and lantern strongly.
const lit = (_q: V3, n: V3) => (n[2] > 0.8 ? 0.2 : 0.9)
await save('paris-invalides-dome', 'Dôme des Invalides', [
  { part: stone, material: { ...PALETTE.stone, floodlight: lit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
  { part: gold, material: { ...finish('invalides-gold', 0xdcc07a), floodlight: () => 1 } },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('invalides-bronze', 0xa08a5e) },
], { source: 'generators/paris-invalides-dome.ts' }, 6500)
