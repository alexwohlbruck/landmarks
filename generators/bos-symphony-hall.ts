/**
 * Symphony Hall, Boston (1900, McKim, Mead & White; acoustics by Wallace
 * Sabine): red brick and limestone, a shoebox hall with a low pitched roof,
 * flanked by lower wings, the Ionic portico on Huntington Avenue — original
 * procedural geometry, CC0-1.0.
 * bun generators/bos-symphony-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Anchor = the centre of OSM way/29560864, -71.08567,
 * 42.34281. Bearing 42: +x runs down the hall (compass 132) to the
 * Huntington Avenue front with its portico; -x is the plainer north-west
 * gable; +y is the Massachusetts Avenue side with the modern entrance
 * canopy; -y faces the Cohen Wing (way/181035612, a separate OSM building,
 * not modelled).
 *
 * Identity (from the photos below):
 *  1. The Huntington Avenue front: a brick pediment with dentils and an
 *     oculus over a large limestone panel, in front of it an Ionic portico
 *     of eight columns (a pair at each end, four between) carrying a
 *     limestone entablature and attic.
 *  2. The long brick shoebox with a low green roof, standing above lower
 *     flat-roofed wings, its clerestory of big round-arched windows with
 *     roundels between them.
 *  3. The Massachusetts Avenue side: the wing's round-arched bays and the
 *     long entrance canopy.
 *  4. Red brick with limestone cornices, string courses and trim.
 *
 * Plan: OSM way/29560864 and its building:part way/240474014 (the hall,
 * gabled), turned to bearing 42: the outline is a rectangle x -35..28.5,
 * y -21..25 (OSM) / -23..25 (lidar); the hall x -35..28.5, y -12.5..13.5.
 * The portico projects to x 31 (lidar).
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021 flight), 0.5 m
 * grid, read with tools/lidar_frame.py at bearing 42; y = 0 is the
 * sidewalk (4.8 m above the grid's ground_min; Mapterhorn varies about
 * 1.5 m over the site, lowest toward the north-west corner). Measured: the
 * hall's main cornice 21.6, eaves 22, ridge 26.6 (OSM's height 12 is the
 * wings only); the wings' roofs 12.4; the portico's attic 12.5; the
 * canopy 3.8.
 *
 * Estimated from the photos (Beyond My Ken's square-on Huntington front
 * scaled between the lidar's portico and cornice heights): columns 1.1 m in
 * diameter to 10.4, entablature 10.4–11.8, attic to 12.5; the oculus
 * radius 1.4 at 23.8; the limestone panel 17–20.5; the clerestory's nine
 * arched windows 3.4 m wide from 14.5 to 20 with roundels between (the
 * corner view); the wings' arched bays and windows; the canopy's depth.
 *
 * Ground: the map's terrain rises about 2 m from the north-west corner to
 * the Huntington front (lidar ground differs only 0.8 m; Mapterhorn is
 * coarser), so the portico stands on a 2.1 m podium built down to y = 0,
 * as the photos show it raised above the street. Elevation 0.
 *
 * Night: the portico and the Huntington front are floodlit, the windows
 * and the entrance doors glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - 2018 Symphony Hall Boston from southwest.jpg and 2018 Symphony Hall
 *    Boston.jpg, Beyond My Ken, CC BY-SA 4.0 (the Huntington front)
 *    https://commons.wikimedia.org/wiki/File:2018_Symphony_Hall_Boston_from_southwest.jpg
 *    https://commons.wikimedia.org/wiki/File:2018_Symphony_Hall_Boston.jpg
 *  - Symphony Hall corner view.jpg, MyCatIsAChonk, CC BY-SA 4.0 (the
 *    Massachusetts Avenue side and north-west gable)
 *    https://commons.wikimedia.org/wiki/File:Symphony_Hall_corner_view.jpg
 * No commercial imagery.
 *
 * Doubts: the south-west side is hidden by the Cohen Wing and drawn plain.
 * The dentils, carved panels, the POPS sign and the rooftop clutter are
 * left out. The roof's green is from the corner view only.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, band, box, gableRoof, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { circle, smoothWall } from './atl-flatiron-building'

const brick = new Part(), lime = new Part(), roof = new Part(), win = new Part(), door = new Part()

type F = [XY, XY]
const faces = (x0: number, x1: number, y0: number, y1: number) => ({
  W: [[x0, y1], [x0, y0]] as F, E: [[x1, y0], [x1, y1]] as F,
  S: [[x0, y0], [x1, y0]] as F, N: [[x1, y1], [x0, y1]] as F,
})
const flen = (f: F) => Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])
const ring = (s: number, z: number, r: number, n = 14): [number, number][] =>
  Array.from({ length: n }, (_, i) => [s + r * Math.cos((i / n) * Math.PI * 2), z + r * Math.sin((i / n) * Math.PI * 2)] as [number, number])

const X0 = -35, X1 = 28.5
const HY0 = -12.5, HY1 = 13.5, HC = 21.6, HE = 22, HR = 26.6
const WY0 = -23, WY1 = 25, WE = 12.4

// ── The wings either side of the hall ──
for (const [y0, y1] of [[WY0, HY0], [HY1, WY1]]) {
  box(brick, X0, X1, y0, y1, 0, WE - 1.0, null, 0)
  box(lime, X0 - 0.3, X1 + 0.3, y0 - (y0 < 0 ? 0.3 : 0), y1 + (y1 > 0 ? 0.3 : 0), WE - 1.0, WE, roof, 0.2)
  const rr: XY[] = [[X0, y0], [X1, y0], [X1, y1], [X0, y1]]
  band(lime, rr, 0, 1.0, 0.1, null) // the limestone base
  band(lime, rr, 4.6, 0.4, 0.1, null) // string course
}
// the Massachusetts Avenue side: round-arched bays below, windows above
{
  const N = faces(X0, X1, HY1, WY1).N, L = flen(N)
  for (let k = 0; k < 11; k++) {
    const s = 4 + k * ((L - 8) / 10)
    onWall(lime, N[0], N[1], archShape(s, 3.6, 1.0, 3.6, 8), 0.05)
    onWall(door, N[0], N[1], archShape(s, 2.8, 1.0, 3.4, 8), 0.09)
    onWall(win, N[0], N[1], rectShape(s - 0.7, s + 0.7, 6.4, 9.4), 0.06)
  }
  // the entrance canopy: a thin slab on posts along the street
  box(roof, -27, 7, WY1, WY1 + 3.8, 3.4, 3.8, roof, 0.05, true)
  for (const x of [-26.5, -15, -3.5, 6.5]) box(lime, x - 0.1, x + 0.1, WY1 + 3.5, WY1 + 3.7, 0, 3.4, null, 0)
}
// the south-west side, plain: a row of windows on the upper floor
{
  const S = faces(X0, X1, WY0, HY0).S, L = flen(S)
  for (let k = 0; k < 11; k++) onWall(win, S[0], S[1], rectShape(4 + k * ((L - 8) / 10) - 0.7, 4 + k * ((L - 8) / 10) + 0.7, 6.4, 9.4), 0.06)
}
// the wings' end walls: blind panels and a door each side of the portico
for (const f of [faces(X0, X1, WY0, HY0).E, faces(X0, X1, HY1, WY1).E, faces(X0, X1, WY0, HY0).W, faces(X0, X1, HY1, WY1).W]) {
  const L = flen(f)
  onWall(lime, f[0], f[1], rectShape(L / 2 - 2.6, L / 2 + 2.6, 5.4, 9.8), 0.04)
  onWall(brick, f[0], f[1], rectShape(L / 2 - 2.1, L / 2 + 2.1, 5.8, 9.4), 0.08)
  onWall(door, f[0], f[1], rectShape(L / 2 - 1.0, L / 2 + 1.0, 1.0, 4.0), 0.06)
}

// ── The hall ──
box(brick, X0, X1, HY0, HY1, 0, HC, null, 0)
{
  const rr: XY[] = [[X0, HY0], [X1, HY0], [X1, HY1], [X0, HY1]]
  band(lime, rr, HC - 0.2, 0.6, 0.45, null) // the main cornice
  band(lime, rr, WE + 1.4, 0.4, 0.1, null) // a course above the wings' roofs
  gableRoof(roof, brick, X0, X1, HY0, HY1, HE, HR, 'x', 0.6, 0.5)
  // the clerestory: nine round-arched windows a side with roundels between
  const F = faces(X0, X1, HY0, HY1)
  for (const f of [F.N, F.S]) {
    const L = flen(f), step = (L - 8) / 8
    for (let k = 0; k < 9; k++) {
      const s = 4 + k * step
      onWall(lime, f[0], f[1], archShape(s, 4.2, 14.2, 18.6, 10), 0.04)
      onWall(win, f[0], f[1], archShape(s, 3.4, 14.5, 18.6, 10), 0.08)
      if (k < 8) {
        onWall(lime, f[0], f[1], ring(s + step / 2, 18.0, 0.85, 10), 0.04)
        onWall(win, f[0], f[1], ring(s + step / 2, 18.0, 0.55, 10), 0.08)
      }
    }
  }
  // the gables: the pediment's raking cornices, an oculus in each
  for (const [f, xr] of [[F.E, X1], [F.W, X0]] as [F, number][]) {
    const L = flen(f)
    onWall(lime, f[0], f[1], ring(L / 2, 23.8, 1.45, 14), 0.05)
    onWall(win, f[0], f[1], ring(L / 2, 23.8, 1.0, 14), 0.1)
    // the pediment's horizontal cornice across the gable
    onWall(lime, f[0], f[1], rectShape(-0.3, L + 0.3, HC - 0.4, HC + 0.5), 0.35)
    // the limestone raking cornices up both sides of the pediment
    const out = xr > 0 ? 1 : -1, ym = (HY0 + HY1) / 2
    for (const ye of [HY0 - 0.6, HY1 + 0.6]) {
      const ze = HE - 0.6 * ((HR - HE) / ((HY1 - HY0) / 2))
      const sec = (y: number, z: number): V3[] => [[xr + out * 0.7, y, z + 0.25], [xr - out * 0.4, y, z + 0.25], [xr - out * 0.4, y, z - 0.55], [xr + out * 0.7, y, z - 0.55]]
      lime.sweep([sec(ye, ze), sec(ym, HR + 0.05)])
    }
  }
  // Huntington gable: the large limestone panel and the arched side windows
  const E = F.E, LE = flen(E)
  onWall(lime, E[0], E[1], rectShape(LE / 2 - 8.0, LE / 2 + 8.0, 16.8, 20.6), 0.06)
  for (const d of [-10.4, 10.4]) {
    onWall(lime, E[0], E[1], archShape(LE / 2 + d, 3.0, 14.4, 17.6, 10), 0.04)
    onWall(win, E[0], E[1], archShape(LE / 2 + d, 2.4, 14.6, 17.6, 10), 0.08)
  }
  // the north-west gable: a row of small square windows and three arched recesses
  const W = F.W, LW = flen(W)
  for (let k = 0; k < 9; k++) onWall(win, W[0], W[1], rectShape(LW / 2 - 8 + k * 2 - 0.45, LW / 2 - 8 + k * 2 + 0.45, 17.6, 18.8), 0.06)
  for (const d of [-6, 0, 6]) {
    onWall(lime, W[0], W[1], archShape(LW / 2 + d, 3.4, 12.8, 14.6, 10), 0.04)
    onWall(brick, W[0], W[1], archShape(LW / 2 + d, 2.6, 13.0, 14.6, 10), 0.08)
  }
}

// ── The Huntington Avenue portico ──
{
  const PB = 2.1 // the podium: the Huntington end's ground is about 2 m above the model's base
  const PX0 = X1, PX1 = 31.2, PY0 = -11.6, PY1 = 12.6, ZC = 10.4, ZE = 11.8, ZA = 12.5
  const cx = (PX0 + PX1) / 2 + 0.3
  // the pairs at the ends and four between, symmetric about the hall's axis
  const yc = (PY0 + PY1) / 2
  for (const d of [-11.0, -8.8, -4.4, -1.5, 1.5, 4.4, 8.8, 11.0]) {
    const c: XY = [cx, yc + d]
    smoothWall(lime, circle(c, 0.55, 10), PB + 0.4, ZC - 0.7)
    revolve(lime, c, [[0.55, ZC - 0.7], [0.85, ZC - 0.25], [0.85, ZC]], 10, 0, false, false)
    revolve(lime, c, [[0.75, PB], [0.75, PB + 0.4], [0.55, PB + 0.4]], 10, 0, false, false)
  }
  // entablature and attic, a solid slab over the columns
  box(lime, PX0, PX1 + 0.4, PY0 - 0.4, PY1 + 0.4, ZC, ZE, null, 0, true)
  box(lime, PX0, PX1 + 0.1, PY0 - 0.1, PY1 + 0.1, ZE, ZA, roof, 0.15)
  // the doors behind the columns
  const E = faces(X0, X1, HY0, HY1).E, LE = flen(E)
  for (const d of [-6.6, -2.9, 2.9, 6.6]) {
    onWall(door, E[0], E[1], rectShape(LE / 2 + d - 0.9, LE / 2 + d + 0.9, PB, 5.2), 0.06)
    onWall(lime, E[0], E[1], rectShape(LE / 2 + d - 1.1, LE / 2 + d + 1.1, 5.2, 5.7), 0.06)
  }
  for (const d of [-4.4, 0, 4.4]) {
    onWall(lime, E[0], E[1], ring(LE / 2 + d, 7.6, 0.7, 10), 0.04)
    onWall(win, E[0], E[1], ring(LE / 2 + d, 7.6, 0.45, 10), 0.08)
  }
  // the podium the portico stands on, built down to the base
  box(lime, PX0, PX1 + 1.2, PY0 - 0.8, PY1 + 0.8, 0, PB, lime, 0)
}

// ── Night: the Huntington front and the portico floodlit ──
const lit = (p: V3, n: V3) => {
  if (n[2] > 0.7) return 0.1
  if (p[0] > 26) return 0.85
  return 0.12
}
await save('bos-symphony-hall', 'Symphony Hall', [
  { part: brick, material: { ...finish('symphony-brick', 0xb8735f), floodlight: lit } },
  { part: lime, material: { ...finish('symphony-limestone', 0xefe6d6), floodlight: lit } },
  { part: roof, material: finish('symphony-roof', 0x8fa595) },
  { part: win, material: PALETTE.window },
  { part: door, material: { ...PALETTE.entrance, name: 'entrance', color: 0x8a6a4a } },
], { height: HR, anchor: [42.34281, -71.08567], bearing: 42 }, 5000)
