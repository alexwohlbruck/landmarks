/**
 * Park Street Church, 1 Park Street at Tremont Street, Boston (1809, Peter
 * Banner) — original procedural geometry, CC0-1.0.
 * bun generators/bos-park-street-church.ts
 *
 * Map frame: x, y, z up, metres; origin at the anchor on the lowest ground.
 * Bearing 318.8: the church runs north-west from Tremont Street, so -y is
 * the front with the steeple, on Tremont Street at the corner of the
 * Common; -x is the Park Street side, facing the Common. Anchor = the centroid of OSM
 * way/240317867 ("Park Street Church"), -71.0620295, 42.3568442.
 *
 * Identity (from the photos below):
 *  1. The tall white steeple on a red-brick tower: the tower with a clock on
 *     three faces and a round-headed window, then four white stages — a
 *     belfry with a louvred arch, corner columns and a pediment on each
 *     face; a second louvred stage; a windowed stage, both with urns; a
 *     short drum with oculi — and a tall white needle spire with a gilt
 *     ball and vane.
 *  2. A plain red-brick meeting house with a white eaves cornice, a hipped
 *     slate roof, tall round-headed windows over small square ones.
 *  3. The two curved porches either side of the tower: brick bows with
 *     white columns and cornices.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021), 0.5 m grid,
 * read with tools/lidar_frame.py. y = 0 is Tremont Street at the front;
 * Park Street rises about 3 m to the back (the Mapterhorn terrain agrees),
 * so the back walls run down into the slope. Measured: eaves 16.0, hip
 * ridge 21.5; the brick tower 24.4; the white stages' tops 33.2, 39.9,
 * 46.0 and 48.9; the bows 10.0; the spire's top 65.9 (the vane; the needle's
 * apex is drawn at 64.4). Wikipedia gives 217 ft (66.1 m).
 *
 * Plan: the nave from OSM's outline, squared (x -13..13, y -15.5..14.5);
 * the tower from the lidar (11 × 10 m, centred at x -0.5, y -13.5, about
 * 1.5 m off OSM's tower parts); the stages' widths from the lidar's rings
 * (about 9.4, 7.0, 5.8 and 3.6 m), checked against the Beyond My Ken photo.
 *
 * Estimated from the photos: the windows (seven bays on the long sides,
 * Farragutful), the clock (2.6 m across), the tower's window, the bows'
 * radius and columns, the stages' openings and urns (Beyond My Ken), the
 * spire's swelling base.
 *
 * Night: the steeple is floodlit; the windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - 2024 Park Street Church - Boston 01.jpg, Farragutful, CC BY-SA 4.0
 *    (the Park Street side and the front from the south)
 *    https://commons.wikimedia.org/wiki/File:2024_Park_Street_Church_-_Boston_01.jpg
 *  - Park Street Church Boston DSC 0070 AD.JPG, Adavyd, CC BY-SA 3.0 (from
 *    the Common, the Park Street side)
 *    https://commons.wikimedia.org/wiki/File:Park_Street_Church_Boston_DSC_0070_AD.JPG
 *  - 2017 Park Street Church steeple.jpg, Beyond My Ken, CC BY-SA 4.0 (the
 *    steeple's stages close up)
 *    https://commons.wikimedia.org/wiki/File:2017_Park_Street_Church_steeple.jpg
 *  - Park Street headhouse and Park Street Church, June 2008.jpg, Eric
 *    Kilby, CC BY-SA 2.0 (dusk, the lit steeple)
 *    https://commons.wikimedia.org/wiki/File:Park_Street_headhouse_and_Park_Street_Church,_June_2008.jpg
 * Published: Wikipedia, "Park Street Church": 1809, Peter Banner, 217 ft.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the back and the south-west side (against the Granary Burying
 * Ground and the neighbouring offices) are not photographed; they repeat
 * the Park Street side. The roof's front end is hidden behind the tower in
 * every photo and is drawn hipped. The urns, balusters and louvre slats are
 * left out; the corner columns are drawn as pilaster strips.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, save, split, type XY } from './atl-flatiron-building'
import { archShape, band, hipRoof, onWall, rectShape, revolve } from './atl-tech-tower'

const brick = new Part(), white = new Part(), slate = new Part(), win = new Part(), gold = new Part()

type F = [XY, XY]
const faces = (x0: number, x1: number, y0: number, y1: number): Record<'s' | 'e' | 'n' | 'w', F> => ({
  s: [[x0, y0], [x1, y0]], e: [[x1, y0], [x1, y1]], n: [[x1, y1], [x0, y1]], w: [[x0, y1], [x0, y0]],
})
const circle = (s: number, z: number, r: number, n = 14): [number, number][] =>
  Array.from({ length: n }, (_, i) => [s + r * Math.cos((i / n) * Math.PI * 2), z + r * Math.sin((i / n) * Math.PI * 2)] as [number, number])

// ── The meeting house ──
const X0 = -13, X1 = 13, Y0 = -15.5, Y1 = 14.5, EAVE = 16.0, RIDGE = 21.5
box(brick, X0, X1, Y0, Y1, 0, EAVE - 0.9, null, 0)
box(white, X0 - 0.15, X1 + 0.15, Y0 - 0.15, Y1 + 0.15, EAVE - 0.9, EAVE, white, 0.25) // the eaves cornice
// the granite base course, with a vertex every 1.5 m so every plan cell has its ground contact at y = 0
band(white, split([[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]], 1.5), 0, 0.9, 0.06)
hipRoof(slate, X0, X1, Y0, Y1, EAVE, RIDGE, 0.45)
{
  const F0 = faces(X0, X1, Y0, Y1)
  for (const f of [F0.e, F0.w]) {
    // seven bays; the front one is behind the bow on the Park Street side
    for (let k = 0; k < 7; k++) {
      const s = 3.4 + k * 3.85
      onWall(white, f[0], f[1], archShape(s, 2.0, 7.6, 12.6, 10), 0.03)
      onWall(win, f[0], f[1], archShape(s, 1.6, 7.9, 12.6, 10), 0.06)
      onWall(white, f[0], f[1], rectShape(s - 0.85, s + 0.85, 2.0, 5.2), 0.03)
      onWall(win, f[0], f[1], rectShape(s - 0.65, s + 0.65, 2.2, 5.0), 0.06)
    }
  }
  for (const f of [F0.n]) for (let k = 0; k < 5; k++) {
    const s = 3.6 + k * 4.7
    onWall(win, f[0], f[1], archShape(s, 1.6, 8.5, 12.6, 10), 0.06)
  }
  // the front wall either side of the tower, above the bows
  for (const s of [3.0, 23.0]) onWall(win, F0.s[0], F0.s[1], archShape(s, 1.6, 10.8, 13.2, 10), 0.06)
}

// ── The bows: curved brick porches with white columns ──
const TX0 = -6.0, TX1 = 5.0, TY0 = -18.5, TY1 = -8.5, TOP = 24.4
for (const side of [-1, 1]) {
  const cx = side < 0 ? TX0 - 3.5 : TX1 + 3.5, cy = Y0, R = 3.5, n = 12
  const arc = (r: number, z: number): V3[] => Array.from({ length: n + 1 }, (_, i) => {
    const a = Math.PI + (i / n) * Math.PI
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
  })
  // the curved wall, faced outward
  for (const [p, r, z0, z1] of [[brick, R, 0, 8.6], [white, R + 0.5, 8.6, 9.6]] as [Part, number, number, number][]) {
    const lo = arc(r, z0), hi = arc(r, z1)
    for (let i = 0; i < n; i++) p.quad(lo[i], lo[i + 1], hi[i + 1], hi[i])
    // the top, a half disc
    const c: V3 = [cx, cy, z1]
    for (let i = 0; i < n; i++) (p === white ? slate : brick).tri(c, hi[i], hi[i + 1])
  }
  // the low dome of the bow's roof
  const ring = arc(R + 0.5, 9.6), apex: V3 = [cx, cy, 10.0]
  for (let i = 0; i < n; i++) slate.tri(ring[i], ring[i + 1], apex)
  // four columns standing in front of the wall, and the windows between
  for (let k = 0; k < 4; k++) {
    const a = Math.PI + ((k + 0.5) / 4) * Math.PI
    revolve(white, [cx + (R + 0.45) * Math.cos(a), cy + (R + 0.45) * Math.sin(a)], [[0.24, 0], [0.24, 1.0], [0.2, 1.0], [0.17, 8.5], [0.28, 8.6]], 8, 0, false, true)
  }
  for (let k = 0; k < 3; k++) {
    const a = Math.PI + ((k + 1) / 4) * Math.PI, b: XY = [cx + R * Math.cos(a), cy + R * Math.sin(a)], t: XY = [-Math.sin(a), Math.cos(a)]
    // a small panel on the curve's tangent (outside on the right of t)
    const A: XY = [b[0] - t[0] * 0.6 * -1, b[1] - t[1] * 0.6 * -1], B: XY = [b[0] + t[0] * 0.6 * -1, b[1] + t[1] * 0.6 * -1]
    for (const z of [1.8, 5.3]) onWall(win, B, A, rectShape(0, 1.2, z, z + 2.0), 0.08)
  }
}

// ── The tower ──
const C: XY = [(TX0 + TX1) / 2, (TY0 + TY1) / 2]
box(brick, TX0, TX1, TY0, TY1, 0, TOP - 0.9, null, 0)
box(white, TX0 - 0.25, TX1 + 0.25, TY0 - 0.25, TY1 + 0.25, TOP - 0.9, TOP, white, 0.25)
band(white, split([[TX0, TY0], [TX1, TY0], [TX1, TY1], [TX0, TY1]], 1.5), 0, 0.9, 0.06)
{
  const T = faces(TX0, TX1, TY0, TY1), w = TX1 - TX0, d = TY1 - TY0
  // the front: the door, the tall window, the clock
  onWall(white, T.s[0], T.s[1], archShape(w / 2, 2.6, 0, 3.0, 10), 0.03)
  onWall(slate, T.s[0], T.s[1], rectShape(w / 2 - 0.9, w / 2 + 0.9, 0.3, 3.2), 0.06)
  onWall(win, T.s[0], T.s[1], archShape(w / 2, 1.8, 4.6, 6.4, 10), 0.06)
  onWall(white, T.s[0], T.s[1], archShape(w / 2, 2.0, 12.0, 16.0, 10), 0.03)
  onWall(win, T.s[0], T.s[1], archShape(w / 2, 1.6, 12.2, 16.0, 10), 0.06)
  for (const [f, L] of [[T.s, w], [T.e, d], [T.w, d]] as [F, number][]) {
    const s = f === T.s ? L / 2 : f === T.e ? 1.5 : d - 1.5
    onWall(white, f[0], f[1], circle(s, 20.6, 1.45, 16), 0.04)
    onWall(slate, f[0], f[1], circle(s, 20.6, 1.15, 16), 0.08)
    onWall(gold, f[0], f[1], rectShape(s - 0.06, s + 0.06, 20.55, 21.4), 0.1)
    onWall(gold, f[0], f[1], [[s - 0.05, 20.55], [s + 0.65, 20.4], [s + 0.62, 20.55], [s - 0.05, 20.7]], 0.1)
  }
}

// ── The white stages ──
/** A square stage of half-width h: wall, corner pilasters, a cornice, an opening on each face. */
function stage(h: number, z0: number, z1: number, open: { w: number; z0: number; zs: number; louvre: boolean }, pediment = false) {
  box(white, C[0] - h, C[0] + h, C[1] - h, C[1] + h, z0, z1 - 0.7, null, 0)
  box(white, C[0] - h - 0.3, C[0] + h + 0.3, C[1] - h - 0.3, C[1] + h + 0.3, z1 - 0.7, z1, white, 0.2)
  box(white, C[0] - h - 0.15, C[0] + h + 0.15, C[1] - h - 0.15, C[1] + h + 0.15, z0, z0 + 0.5, null, 0.1)
  const S = faces(C[0] - h, C[0] + h, C[1] - h, C[1] + h)
  for (const f of [S.s, S.e, S.n, S.w]) {
    onWall(white, f[0], f[1], archShape(h, open.w + 0.4, open.z0 - 0.2, open.zs, 10), 0.05)
    onWall(open.louvre ? slate : win, f[0], f[1], archShape(h, open.w, open.z0, open.zs, 10), 0.09)
    // corner pilasters
    for (const s of [0.35, 2 * h - 0.35]) onWall(white, f[0], f[1], rectShape(s - 0.3, s + 0.3, z0 + 0.5, z1 - 0.7), 0.12)
    if (pediment) {
      // a pediment over the face, standing on the cornice
      const L = 2 * h
      onWall(white, [f[0][0], f[0][1]], [f[1][0], f[1][1]], [[-0.3, z1], [L + 0.3, z1], [L / 2, z1 + 1.6]], 0.3)
    }
  }
  // the urns at the corners
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) revolve(white, [C[0] + sx * h, C[1] + sy * h], [[0.15, z1], [0.3, z1 + 0.35], [0.12, z1 + 0.8], [0, z1 + 0.95]], 6, 0, true, false)
}
stage(4.4, TOP, 33.2, { w: 2.0, z0: 26.0, zs: 30.4, louvre: true }, true)
// the pediments sit on the cornice; behind them, the base of the next stage
stage(3.4, 33.2, 39.9, { w: 1.6, z0: 35.0, zs: 37.9, louvre: true })
stage(2.75, 39.9, 46.0, { w: 1.3, z0: 41.2, zs: 43.9, louvre: false })
// the drum with oculi, and the spire
{
  const n = 8, r = 1.8 / Math.cos(Math.PI / n)
  revolve(white, C, [[r, 46.0], [r, 48.3], [r + 0.25, 48.4], [r + 0.25, 48.9], [r - 0.2, 48.9]], n, Math.PI / n, true, false)
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI / n + (i / n) * Math.PI * 2, a1 = a0 + (Math.PI * 2) / n
    const A: XY = [C[0] + r * Math.cos(a0), C[1] + r * Math.sin(a0)], B: XY = [C[0] + r * Math.cos(a1), C[1] + r * Math.sin(a1)]
    const L = Math.hypot(B[0] - A[0], B[1] - A[1])
    if (i % 2 === 0) onWall(slate, A, B, circle(L / 2, 47.2, 0.42, 10), 0.03)
  }
  revolve(white, C, [[r - 0.2, 48.9], [1.25, 49.2], [1.15, 52.5], [0.75, 55.0], [0.06, 64.4]], n, Math.PI / n, false, false)
  revolve(gold, C, [[0.06, 64.3], [0.2, 64.45], [0.24, 64.65], [0.2, 64.85], [0.05, 64.95], [0.05, 65.9], [0, 66.0]], 8, 0, false, false)
  box(gold, C[0] - 0.04, C[0] + 0.04, C[1] - 0.7, C[1] + 0.7, 65.2, 65.3, gold, 0)
  box(gold, C[0] - 0.04, C[0] + 0.04, C[1] - 0.15, C[1] + 0.9, 65.5, 65.85, gold, 0)
}

const lit = (p: V3) => (p[2] > TOP - 1 ? 0.9 : 0)
await save('bos-park-street-church', 'Park Street Church', [
  { part: brick, material: finish('psc-brick', 0xa65d4c) },
  { part: white, material: { ...finish('psc-white', 0xf6f1e8), floodlight: lit } },
  { part: slate, material: finish('psc-slate', 0x666c74) },
  { part: win, material: PALETTE.window },
  { part: gold, material: { ...finish('psc-gold', 0xd2ad55), floodlight: () => 0.8 } },
], { height: 66.0, anchor: [42.3568442, -71.0620295], bearing: 318.8 })
