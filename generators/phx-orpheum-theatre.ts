/**
 * Orpheum Theatre, Phoenix (1929, Lescher & Mahoney; Spanish Baroque
 * Revival) — original procedural geometry, CC0-1.0.
 * bun generators/phx-orpheum-theatre.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * anchor. Bearing 0: the OSM walls run north–south and east–west. Anchor
 * -112.0768695, 33.4490172, the centroid of OSM way/109819768 ("Orpheum
 * Theatre", 203 W Adams Street, wikidata Q7103970), at the south-west
 * corner of Adams Street (north) and 2nd Avenue (east). Phoenix City Hall
 * stands against its west and south sides.
 *
 * Identity (from the photos below):
 *  1. The octagonal corner tower at Adams and 2nd Avenue: plain cast-stone
 *     shaft with ornate windows and round rose windows, a carved band and
 *     balustrade, and an arcaded lantern under a tile roof and finial;
 *     floodlit gold at night.                          (lemay, tony, l4)
 *  2. The maroon marquee across the tower's foot with ORPHEUM in tall
 *     capitals, lit at night.                               (lemay, l4)
 *  3. Two-storey street ranges along Adams and 2nd Avenue under a deep
 *     ornamented frieze of roundels and niches; the 2nd Avenue front has a
 *     long balcony at its south end.                    (tony, kroll, l2)
 *  4. Behind them the big smooth auditorium, its roof a broad vault with
 *     rounded shoulders, and the taller flat-topped stage house to the
 *     west; a tall round chimney at the auditorium's south-east corner.
 *                                                        (tony, kroll, l2)
 *
 * Plan: OSM way/109819768, simplified: the stage house x -26.6..-10,
 * y -21.4..10.5; the auditorium x -10..18.5, y -21.4..10; the street
 * ranges along the north (y 10..21) and east (x 18.5..26.5); the tower an
 * octagon 10.5 m across centred at (22.2, 18.5), its north-east face on
 * OSM's corner chamfer. The building parts way/209097280 (auditorium),
 * way/209097291 (stage house), way/209097292 and way/209097293 (tower and
 * lantern) and way/209950210 (chimney) are drawn by this model.
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (2020 flight), 1 m grid;
 * the street 0.7 m above ground_min 330.62 is y = 0. Measured (model
 * metres): stage house roof 24.3, its parapet 25.6; auditorium eaves 16,
 * crown 18.5; street ranges' parapet and frieze top 10.9; the tower
 * 16.5–18.3 (the lantern top is too slim for the 1 m grid; 20.8 is from
 * the photos). OSM's 22.4/28 m tower and 16.8 m outline heights disagree
 * with the lidar and are not used.
 * Estimated from lemay and tony scaled to the lidar: the frieze band
 * (8.4–10.9), the marquee (4.3–6.0, wrapped round three faces of the tower, 1.8 m out), the tower's
 * band, balustrade and lantern, the window rows, the balcony (5–6.3),
 * the chimney (to 26; OSM 28).
 *
 * Photos (evidence, Wikimedia Commons):
 *  tony  "Phoenix-Orpheum Theatre-1929.jpg", Tony the Marine, CC BY-SA 3.0:
 *        from the north-east, the vault and the chimney
 *        https://commons.wikimedia.org/wiki/File:Phoenix-Orpheum_Theatre-1929.jpg
 *  lemay "Orpheum Theatre, Adams Street and 2nd Avenue, Phoenix, AZ.jpg",
 *        w_lemay, CC BY-SA 2.0: from the north-east at dusk
 *        https://commons.wikimedia.org/wiki/File:Orpheum_Theatre,_Adams_Street_and_2nd_Avenue,_Phoenix,_AZ.jpg
 *  l2    "Orpheum Theatre, Adams Street and 2nd Avenue, Phoenix, AZ -
 *        54442797911.jpg", w_lemay, CC BY-SA 2.0: from the south-east
 *        along 2nd Avenue
 *        https://commons.wikimedia.org/wiki/File:Orpheum_Theatre,_Adams_Street_and_2nd_Avenue,_Phoenix,_AZ_-_54442797911.jpg
 *  l4    "Orpheum Theatre, Adams Street and 2nd Avenue, Phoenix, AZ -
 *        54442982829.jpg", w_lemay, CC BY-SA 2.0: the tower at night
 *        https://commons.wikimedia.org/wiki/File:Orpheum_Theatre,_Adams_Street_and_2nd_Avenue,_Phoenix,_AZ_-_54442982829.jpg
 *  kroll "The Orpheum Theatre.JPG", Jamie Kroll, CC BY-SA 3.0: from the
 *        north-east, the stage house behind
 *        https://commons.wikimedia.org/wiki/File:The_Orpheum_Theatre.JPG
 * No look-only sources. No commercial imagery.
 *
 * Sign: the marquee's ORPHEUM is the theatre's sign, so it carries its
 * letters (STYLE.md, "Famous signs"): tall plain capitals with small
 * serifs, traced from lemay. The historic vertical blade sign no longer
 * stands in any current photo, so it is not drawn.
 *
 * Doubts: the west and south walls stand against City Hall and are seen
 * in no photo. The roundels, niches and figures of the frieze are drawn as
 * a plain band. The auditorium's east end is drawn square in plan (OSM
 * rounds it slightly).
 *
 * Night: the tower is floodlit, the frieze lit; the letters are neon; the
 * windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, ccw, onWall, prism, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { Pen, strokes } from './lettering'
import { edges, ngon, profileSlab, wallLen } from './phx-st-marys-basilica'

const stone = new Part(), trim = new Part(), win = new Part(), maroon = new Part(), neon = new Part(), roof = new Part()

// ── The stage house ──
prism(stone, ccw([[-26.6, -21.4], [-10, -21.4], [-10, 10.5], [-26.6, 10.5]]), 0, 25.6, roof, 0.3)

// ── The auditorium: a vault with rounded shoulders, extruded east–west ──
const AY0 = -21.4, AY1 = 10, AX0 = -10, AX1 = 18.5
const vault: Array<[number, number]> = [[AY0, 0], [AY1, 0]]
{
  const r = 3.2, wallTop = 14.6, crown = 18.5, mid = -5.5
  // north shoulder then the gentle crown to the south shoulder
  const arc: Array<[number, number]> = []
  for (let i = 0; i <= 5; i++) { const a = (i / 5) * (Math.PI / 2); arc.push([AY1 - r + r * Math.cos(a), wallTop + r * Math.sin(a)]) }
  const top0 = wallTop + r
  for (let i = 1; i < 8; i++) { const t = i / 8, y = AY1 - r + (AY0 + r - (AY1 - r)) * t; arc.push([y, top0 + (crown - top0) * (1 - ((y - mid) / ((AY1 - AY0) / 2 - r)) ** 2)]) }
  for (let i = 5; i >= 0; i--) { const a = (i / 5) * (Math.PI / 2); arc.push([AY0 + r - r * Math.cos(a), wallTop + r * Math.sin(a)]) }
  vault.push(...arc.map(([y, z]) => [y, z] as [number, number]))
  // the roof skin over the crown, between the shoulders
  for (let k = 5; k < arc.length - 6; k++) {
    const [ya, za] = arc[k], [yb, zb] = arc[k + 1]
    roof.quad([AX0, ya, za + 0.04], [AX0, yb, zb + 0.04], [AX1, yb, zb + 0.04], [AX1, ya, za + 0.04])
  }
}
// profile [s = y, z], extruded along x (n = +x)
profileSlab(stone, [0, 0], [0, 1], vault, AX0, AX1)
for (const y of [-14, -3]) onWall(win, [AX1, AY0], [AX1, AY1], rectShape(y - AY0 - 0.5, y - AY0 + 0.5, 12.2, 13.4))

// the chimney at the auditorium's south-east corner
revolve(stone, [17.6, -19.6], [[1.0, 0], [1.0, 25.4], [1.2, 25.4], [1.2, 26]], 12, 0, false, true)

// ── The street ranges along Adams and 2nd Avenue ──
const RANGE = ccw([[-26.6, 10.5], [-10, 10.5], [-10, 10], [AX1, 10], [AX1, -21.4], [26.5, -21.4], [26.5, 14.6], [19.6, 21.2], [-26.6, 21.1]])
prism(stone, RANGE, 0, 10.9, roof, 0.2)
// the frieze: a pale band round the two street fronts, under a coping
const N0: XY = [19.6, 21.2], N1: XY = [-26.6, 21.1] // Adams (outside to the north)
const E0: XY = [26.5, -21.4], E1: XY = [26.5, 14.6] // 2nd Avenue (outside to the east)
for (const [a, b] of [[N0, N1], [E0, E1]] as Array<[XY, XY]>) {
  const L = wallLen(a, b)
  onWall(trim, a, b, rectShape(0, L, 8.3, 10.6), 0.12)
  // the roundels of the frieze, a pale disc every 2.6 m
  const n = Math.floor((L - 2) / 2.6)
  for (let k = 0; k < n; k++) {
    const s = 1.5 + k * 2.6
    onWall(stone, a, b, Array.from({ length: 10 }, (_, i) => [s + 0.6 * Math.cos((i / 10) * 2 * Math.PI), 9.45 + 0.6 * Math.sin((i / 10) * 2 * Math.PI)] as [number, number]), 0.18)
  }
  box(trim, Math.min(a[0], b[0]) - (a[1] === b[1] ? 0 : 0.35), Math.max(a[0], b[0]) + (a[1] === b[1] ? 0 : 0.35), Math.min(a[1], b[1]) - (a[1] === b[1] ? 0.35 : 0), Math.max(a[1], b[1]) + (a[1] === b[1] ? 0.35 : 0), 10.6, 11.1, trim, 0.1)
}
// Adams Street: a row of upper windows, shopfronts under maroon frames
{
  const L = wallLen(N0, N1)
  for (let s = 2.2; s < L - 2; s += 2.6) onWall(win, N0, N1, rectShape(s - 0.55, s + 0.55, 5.4, 7.4))
  for (let s = 1.5; s < 30; s += 5.4) {
    onWall(maroon, N0, N1, rectShape(s, s + 4.4, 0.6, 4.2), 0.06)
    onWall(win, N0, N1, rectShape(s + 0.3, s + 4.1, 0.9, 3.4), 0.1)
  }
}
// 2nd Avenue: windows and doors at the north end, the balcony at the south
{
  const L = wallLen(E0, E1)
  for (let s = 22; s < L - 2; s += 3.2) onWall(win, E0, E1, rectShape(s - 0.55, s + 0.55, 5.4, 7.4))
  for (const s of [3.5, 7.5, 11.5]) onWall(win, E0, E1, rectShape(s - 0.6, s + 0.6, 6.4, 8.0))
  for (let s = 2.2; s < 16; s += 3.2) onWall(maroon, E0, E1, rectShape(s - 0.6, s + 0.6, 0, 2.6), 0.06)
  box(stone, 26.5, 28.0, -19.6, -6.6, 5.0, 5.5, stone, 0.1) // the balcony floor on its corbels
  box(trim, 27.7, 28.0, -19.6, -6.6, 5.5, 6.4, trim, 0.05) // its balustrade
  box(trim, 26.5, 28.0, -19.6, -19.3, 5.5, 6.4, trim, 0.05)
  box(trim, 26.5, 28.0, -6.9, -6.6, 5.5, 6.4, trim, 0.05)
}

// ── The corner tower ──
const TH = 5.25, TC: XY = [22.2, 18.5], TR = TH / Math.cos(Math.PI / 8) // 10.5 m across the flats
const OCT = ngon(TC, TR, 8, Math.PI / 8) // flats facing N, NE, E, ...
prism(stone, OCT, 0, 14.4, null, 0)
prism(trim, ngon(TC, TR + 0.4, 8, Math.PI / 8), 14.4, 16.4, stone, 0) // the carved band
prism(trim, ngon(TC, TR + 0.1, 8, Math.PI / 8), 16.4, 16.9, stone, 0.1) // the balustrade's rail
edges(OCT, (a, b, i) => {
  const L = wallLen(a, b)
  const out = i <= 2 || i === 7 // faces seen from the streets (E, NE, N, and SE)
  if (!out) return
  onWall(trim, a, b, Array.from({ length: 12 }, (_, k) => [L / 2 + 0.95 * Math.cos((k / 12) * 2 * Math.PI), 12.6 + 0.95 * Math.sin((k / 12) * 2 * Math.PI)] as [number, number]), 0.05)
  onWall(win, a, b, Array.from({ length: 12 }, (_, k) => [L / 2 + 0.7 * Math.cos((k / 12) * 2 * Math.PI), 12.6 + 0.7 * Math.sin((k / 12) * 2 * Math.PI)] as [number, number]), 0.09)
  // an ornate-headed window under each rose
  onWall(trim, a, b, [[L / 2 - 0.85, 7.0], [L / 2 + 0.85, 7.0], [L / 2 + 0.85, 9.6], [L / 2, 10.6], [L / 2 - 0.85, 9.6]], 0.05)
  onWall(win, a, b, rectShape(L / 2 - 0.6, L / 2 + 0.6, 7.3, 9.6), 0.09)
  // the lunette over the entrance on the three street faces
  if (i <= 2) onWall(trim, a, b, archShape(L / 2, 2.4, 6.1, 6.1, 8), 0.05)
})
// the lantern: an arcaded octagon, its cornice, a tile roof and a finial
const LR = 3.1 / Math.cos(Math.PI / 8)
prism(stone, ngon(TC, LR, 8, Math.PI / 8), 16.9, 19.6, null, 0)
edges(ngon(TC, LR, 8, Math.PI / 8), (a, b) => {
  const L = wallLen(a, b)
  onWall(win, a, b, archShape(L / 2, 1.2, 17.3, 18.7, 6), 0.06)
})
prism(trim, ngon(TC, LR + 0.35, 8, Math.PI / 8), 19.6, 20.0, null, 0.1)
revolve(maroon, TC, [[LR + 0.45, 20.0], [LR * 0.5, 20.7], [0.3, 21.1], [0, 21.15]], 8, Math.PI / 8, true, true)
box(trim, TC[0] - 0.1, TC[0] + 0.1, TC[1] - 0.1, TC[1] + 0.1, 21.1, 22.4, trim, 0.03)

// ── The marquee across the tower's north-east face ──
const D: XY = [Math.SQRT1_2, Math.SQRT1_2] // out of the north-east face
const T: XY = [-Math.SQRT1_2, Math.SQRT1_2] // along it, left to right as seen from outside
const FACE: XY = [TC[0] + D[0] * TH, TC[1] + D[1] * TH]
const M = (s: number, d: number): XY => [FACE[0] + T[0] * s + D[0] * d, FACE[1] + T[1] * s + D[1] * d]
// a band wrapped round the tower's east, north-east and north faces, 1.8 m deep
{
  const ang = (k: number) => Math.PI / 8 + (k * Math.PI) / 4
  const at = (k: number, h: number): XY => { const r = h / Math.cos(Math.PI / 8); return [TC[0] + r * Math.cos(ang(k)), TC[1] + r * Math.sin(ang(k))] }
  const ks = [-1, 0, 1, 2] // vertices from the east face round to the north face
  const outer = ks.map((k) => at(k, TH + 2.0)), inner = ks.map((k) => at(k, TH + 0.2)).reverse()
  prism(maroon, ccw([...outer, ...inner]), 4.3, 6.0, maroon, 0.12, true)
}
// the pale soffit lights' strip and the two piers at the doors
for (const s of [-2.4, 2.4]) {
  const c = M(s, 0.7)
  box(stone, c[0] - 0.35, c[0] + 0.35, c[1] - 0.35, c[1] + 0.35, 0, 4.3, null, 0)
}

// ORPHEUM: tall capitals with small serifs, traced from lemay (each glyph 1 tall)
type Glyph = (p: Pen, x: number) => number // draws at x, returns the advance
const G: Record<string, Glyph> = {
  O: (p, x) => { p.circle([x + 0.33, 0.5], 0.3, 0.5, 12); return 0.78 },
  R: (p, x) => { p.moveTo([x + 0.05, 0]).lineTo([x + 0.05, 1]).lineTo([x + 0.36, 1]).cubicTo([x + 0.68, 1], [x + 0.68, 0.5], [x + 0.36, 0.5], 4).lineTo([x + 0.05, 0.5]); p.moveTo([x + 0.34, 0.5]).lineTo([x + 0.62, 0]); return 0.76 },
  P: (p, x) => { p.moveTo([x + 0.05, 0]).lineTo([x + 0.05, 1]).lineTo([x + 0.36, 1]).cubicTo([x + 0.68, 1], [x + 0.68, 0.48], [x + 0.36, 0.48], 4).lineTo([x + 0.05, 0.48]); return 0.74 },
  H: (p, x) => { p.moveTo([x + 0.05, 0]).lineTo([x + 0.05, 1]); p.moveTo([x + 0.6, 0]).lineTo([x + 0.6, 1]); p.moveTo([x + 0.05, 0.52]).lineTo([x + 0.6, 0.52]); return 0.78 },
  E: (p, x) => { p.moveTo([x + 0.56, 1]).lineTo([x + 0.05, 1]).lineTo([x + 0.05, 0]).lineTo([x + 0.56, 0]); p.moveTo([x + 0.05, 0.52]).lineTo([x + 0.44, 0.52]); return 0.7 },
  U: (p, x) => { p.moveTo([x + 0.05, 1]).lineTo([x + 0.05, 0.32]).cubicTo([x + 0.05, -0.08], [x + 0.6, -0.08], [x + 0.6, 0.32], 4).lineTo([x + 0.6, 1]); return 0.78 },
  M: (p, x) => { p.moveTo([x + 0.04, 0]).lineTo([x + 0.04, 1]).lineTo([x + 0.38, 0.3]).lineTo([x + 0.72, 1]).lineTo([x + 0.72, 0]); return 0.9 },
}
const word = new Pen()
let adv = 0
for (const ch of 'ORPHEUM') adv += G[ch](word, adv)
{
  const h = 0.9, w = adv * h
  // on the marquee's front face, d = 2.0, centred, from z 4.6
  strokes(neon, word.paths, {
    width: 0.15, depth: 0.08,
    place: (u, v, wd) => { const q = M(-w / 2 + u * h, 2.0 + wd * h); return [q[0], q[1], 4.7 + v * h] as V3 },
  })
}

await save('phx-orpheum-theatre', 'Orpheum Theatre', [
  {
    part: stone,
    material: {
      ...finish('orpheum-stone', 0xdfcdb2),
      // the tower is floodlit gold at night (l4)
      floodlight: (p, n) => (Math.hypot(p[0] - TC[0], p[1] - TC[1]) < TR + 1 && n[2] < 0.5 ? 0.9 : 0),
    },
  },
  { part: trim, material: { ...finish('orpheum-ornament', 0xf0e2c8), floodlight: (_p, n) => (n[2] < 0.5 ? 0.7 : 0) } },
  { part: win, material: PALETTE.window },
  { part: maroon, material: finish('orpheum-maroon', 0x8a4a42) },
  { part: neon, material: finish('neon-orpheum', 0xf1e3c4) },
  { part: roof, material: PALETTE.roof },
], { height: 26, anchor: [33.4490172, -112.0768695], bearing: 0 })
