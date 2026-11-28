/**
 * Hillbrow Tower (Telkom Joburg Tower, formerly the JG Strijdom Tower;
 * 1968-1971), Hillbrow, Johannesburg: original procedural geometry,
 * CC0-1.0, no textures.
 *   bun generators/johannesburg-hillbrow-tower.ts
 * Writes models/johannesburg-hillbrow-tower.glb (low: the mast as four
 * legs and a few bands) and models/johannesburg-hillbrow-tower.detail.glb
 * (detail: the mast's lattice, the dishes on the top deck).
 *
 * Map frame: x east, y north, z up, metres; origin on the lowest ground
 * under the footprint. Anchor = area centroid of OSM way/62930800
 * (building=yes, "Hillbrow Tower", the base block), lng 28.0492796,
 * lat -26.1870345. Bearing 0 (a round tower; the base block is drawn on
 * its OSM outline).
 *
 * Identity, in order: the tall plain concrete shaft; the head of stacked
 * levels at its top — the banded cylinder of the old public floors, a
 * dark neck, the wide dark upper pod of three overhanging deck rings (the
 * revolving restaurant and the observation floors), a smaller capping
 * deck with dishes; the red-and-white lattice mast above.
 *
 * Evidence
 *  - Published: 269 m overall; observation floor at 197 m; six public
 *    floors at the top, a revolving restaurant (Wikipedia "Hillbrow
 *    Tower"; Structurae).
 *  - OSM maps the tower in parts, which give its levels and diameters:
 *    way/759038978 base block 6 m (the OSM outline); way/759038972 the
 *    shaft, 12.9 m across, to 180 m, centred 5 m north of the anchor;
 *    way/759038973 the banded cylinder 182-207 m, 19.7 m across;
 *    ways 759038975-977 the restaurant disc's roofs at 212-222 m, 30.3 m
 *    across; way/759038974 the upper deck 212-226 m, 22.6 m; way/
 *    759038979 the core to 233 m; way/759038980 the mast 233-270 m,
 *    4.2 m at its foot. Drawn to those, with the tip at the published
 *    269 m. They agree with h4 (frontal, the whole tower): the disc at
 *    0.79 of the height there, 212 m. The published observation floor
 *    (197 m) is the cylinder's widest window band, as drawn.
 *    The shaft's foot (14.8 m) and the base block's 9.4 m on its low west
 *    side (6 m over the uphill ground) are ESTIMATED: no licensed photo
 *    shows them clearly.
 *  - The head's tiers, reworked after review against h2 and h4 (cropped
 *    in work/johannesburg-hillbrow-tower/heads.png): the lower cylinder
 *    (182-207 m) is light concrete in five bands with dark glazing between
 *    them and lips top and bottom; a short dark neck (207-210 m); the
 *    upper pod (210-225 m) 1.4-1.5 times as wide, dark glazing between
 *    three projecting deck slabs, the top one overhanging; the cap
 *    (225-233 m) with its ring of dishes. h5 (2020) shows a blue Telkom
 *    sign band on the lower cylinder; on review it is not drawn (h2 and h4
 *    show none), and the glazing is a dark glass grey (#50565d). Night: the
 *    glazing is lit (h7); the head was lit blue in a 2015 night view, not
 *    drawn; red aviation lights are left out.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - h2 Jorge Láscar, "Hillbrow Tower (4612443934).jpg", CC BY 2.0 —
 *      from the south-west: head stack, mast colours.
 *      https://commons.wikimedia.org/wiki/File:Hillbrow_Tower_(4612443934).jpg
 *    - h4 Thuvack, "Hillbrow Tower-1.jpg", CC BY-SA 3.0 — the whole tower,
 *      frontal: the main proportion source.
 *      https://commons.wikimedia.org/wiki/File:Hillbrow_Tower-1.jpg
 *    - h5 Bertrand van der Berg, "View of Hillbrow skyline with Hillbrow
 *      Tower, Johannesburg, South Africa.jpg", CC BY-SA 4.0 (2020) — the
 *      concrete colour (and the 2020 sign band, not drawn).
 *      https://commons.wikimedia.org/wiki/File:View_of_Hillbrow_skyline_with_Hillbrow_Tower,_Johannesburg,_South_Africa.jpg
 *    - h7 Nico Roets, "Joburg at night.jpg", CC BY 2.0 — night.
 *      https://commons.wikimedia.org/wiki/File:Joburg_at_night.jpg
 *  No look-only sources. No commercial imagery. No lidar here. Terrain:
 *  Mapterhorn z12 only (z13-z15 404); the ground falls about 4 m across
 *  the base block to the west; the block runs down to y = 0.
 *
 * Invented or simplified: the head's many floors are grouped into the
 * bands and decks above; the dishes are a few discs (detail only); the
 * mast is a square lattice tapering from 4.2 m to 1.2 m, banded red and white
 * in five bands (h2 shows the bands; their count is estimated).
 * Colours: concrete #cdc7bc (h2, h4, h5 pulled to the palette's
 * lightness), head #d9d6cf, glazing #50565d, mast red #c0473c and white.
 * Doubts: the OSM part heights are unsourced in OSM (they match h4); the
 * base block; the shaft's taper.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { cap, lathe, walls, type XY } from './chi-aon-center'
import { face } from './phl-independence-hall'
import { box, cyl, writeModel, type Slot } from './pretoria-union-buildings'

const ID = 'johannesburg-hillbrow-tower'
const NAME = 'Hillbrow Tower'
const ANCHOR: [number, number] = [28.0492796, -26.1870345]

// OSM way/62930800 in this frame, counter-clockwise.
const BASE: XY[] = ([[0.5, 11.5], [3.5, 10.3], [11.3, 11.2], [13.6, -8.6], [-11.2, -11.6], [-13.6, 8.2], [-5.3, 9.2], [-2.9, 11.0]] as XY[]).reverse()

/** A straight bar between two points, square section w. */
export function bar(p: Part, a: V3, b: V3, w: number) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d)
  const t: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const ref: V3 = Math.abs(t[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  let u: V3 = [t[1] * ref[2] - t[2] * ref[1], t[2] * ref[0] - t[0] * ref[2], t[0] * ref[1] - t[1] * ref[0]]
  const ul = Math.hypot(...u); u = [u[0] / ul, u[1] / ul, u[2] / ul]
  const v: V3 = [t[1] * u[2] - t[2] * u[1], t[2] * u[0] - t[0] * u[2], t[0] * u[1] - t[1] * u[0]]
  const h = w / 2
  const corner = (P: V3, su: number, sv: number): V3 => [P[0] + (u[0] * su + v[0] * sv) * h, P[1] + (u[1] * su + v[1] * sv) * h, P[2] + (u[2] * su + v[2] * sv) * h]
  const sides: [number, number][] = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
  for (let i = 0; i < 4; i++) {
    const [s0, t0] = sides[i], [s1, t1] = sides[(i + 1) % 4]
    const n: V3 = [(u[0] * (s0 + s1) + v[0] * (t0 + t1)), (u[1] * (s0 + s1) + v[1] * (t0 + t1)), (u[2] * (s0 + s1) + v[2] * (t0 + t1))]
    face(p, [corner(a, s0, t0), corner(a, s1, t1), corner(b, s1, t1), corner(b, s0, t0)], n)
  }
}

function build(detail: boolean) {
  const concrete = new Part(), head = new Part(), win = new Part(), red = new Part(), white = new Part()
  const S = detail ? 24 : 16

  // --- Base block on the OSM outline: 9.4 m on the low (west) side, about 6 m over the uphill ground.
  walls(concrete, BASE, 0, 9.4)
  cap(head, BASE, 9.4)

  // --- The shaft, centred on the OSM shaft part (way/759038972), 14.8 m
  // at the foot tapering to its mapped 12.9 m, to 180 m.
  const X = -0.35, Y = 5.05, Z0 = 9.4, ZS = 180
  lathe(concrete, X, Y, [[7.4, 0], [7.4, Z0], [7.0, 70], [6.7, 130], [6.45, ZS], [6.45, ZS + 0.01]], S)
  // a slim ring band low on the shaft (h2)
  cyl(head, X, Y, 7.25, 52, 53.2, S, true, true)

  // --- The head, bottom up (OSM parts 759038973-759038979; tiers from h2, h4).
  // the lower cylinder (182-207 m): lips, five concrete bands, dark glazing between
  const R1 = 9.85
  lathe(head, X, Y, [[6.45, ZS - 0.3], [8.8, ZS + 0.8], [10.4, ZS + 1.2], [10.4, ZS + 2.4], [R1, ZS + 2.5]], S)
  cyl(win, X, Y, R1 - 0.3, ZS + 2.4, ZS + 26, S, false)
  for (const [z0, z1] of [[2.4, 5.6], [7.4, 11.0], [12.8, 16.4], [18.2, 21.8], [23.4, 25.6]] as [number, number][]) cyl(head, X, Y, R1, ZS + z0, ZS + z1, S, true, true)
  cyl(head, X, Y, 10.4, ZS + 25.4, ZS + 27, S, true, true) // top lip
  // the dark neck
  cyl(win, X, Y, 8.0, ZS + 27, ZS + 30, S, false)
  // the upper pod (210-225 m): three deck slabs with dark glazing between, the top overhanging
  const RP = 14.2
  cyl(win, X, Y, RP, ZS + 30, ZS + 44.5, S, false)
  lathe(head, X, Y, [[8.0, ZS + 29.6], [12.5, ZS + 30.2], [15.15, ZS + 30.6], [15.15, ZS + 31.6], [RP, ZS + 31.7]], S)
  for (const z of [35.6, 39.6]) cyl(head, X, Y, 15.15, ZS + z, ZS + z + 1.0, S, true, true)
  cyl(head, X, Y, 15.9, ZS + 43.6, ZS + 45, S, true, true)
  // the cap (225-233 m), with dishes
  cyl(head, X, Y, 11.3, ZS + 45, ZS + 46, S, true)
  cyl(head, X, Y, 7.5, ZS + 46, ZS + 51.5, S, false)
  cyl(win, X, Y, 7.56, ZS + 47.2, ZS + 49.5, S, false)
  lathe(head, X, Y, [[8.2, ZS + 51.5], [8.2, ZS + 52.3], [6.0, ZS + 52.6], [6.0, ZS + 53], [0, ZS + 53.01]], S)
  if (detail) for (let k = 0; k < 8; k++) {
    const t = (k + 0.5) * Math.PI / 4, cx = X + 7.6 * Math.cos(t), cy = Y + 7.6 * Math.sin(t), z = ZS + 50.2 - (k % 2) * 1.8
    const n: V3 = [Math.cos(t), Math.sin(t), 0], tt: V3 = [-Math.sin(t), Math.cos(t), 0]
    const C: V3 = [cx + n[0] * 0.5, cy + n[1] * 0.5, z]
    for (let q = 0; q < 10; q++) {
      const a = q / 10 * 2 * Math.PI, b = (q + 1) / 10 * 2 * Math.PI, r = 1.2
      face(white, [C, [C[0] + tt[0] * r * Math.cos(a), C[1] + tt[1] * r * Math.cos(a), z + r * Math.sin(a)], [C[0] + tt[0] * r * Math.cos(b), C[1] + tt[1] * r * Math.cos(b), z + r * Math.sin(b)]], n)
    }
  }

  // --- The mast (OSM way/759038980, 233-270 m, 4.2 m across at its foot):
  // a square lattice tapering to 1.2 m, banded red and white; tip at the
  // published 269 m.
  const M0 = ZS + 53, M1 = 269
  const half = (z: number) => 2.1 - 1.5 * (z - M0) / (M1 - M0)
  const NB = 5
  for (let b = 0; b < NB; b++) {
    const z0 = M0 + (M1 - M0) * b / NB, z1 = M0 + (M1 - M0) * (b + 1) / NB
    const mat = b % 2 ? white : red
    const corners = (z: number) => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([sx, sy]) => [X + sx * half(z), Y + sy * half(z), z] as V3)
    const A = corners(z0), B = corners(z1)
    for (let i = 0; i < 4; i++) bar(mat, A[i], B[i], detail ? 0.4 : 0.6)
    if (detail) {
      for (let h = 0; h < 2; h++) {
        const za = z0 + (z1 - z0) * h / 2, zb = z0 + (z1 - z0) * (h + 1) / 2
        const a = corners(za), c = corners(zb)
        for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; bar(mat, a[i], c[j], 0.22); bar(mat, a[j], c[i], 0.22); bar(mat, a[i], a[j], 0.22) }
      }
    } else for (let i = 0; i < 4; i++) bar(mat, A[i], A[(i + 1) % 4], 0.45)
  }
  cyl(white, X, Y, 0.35, M1 - 0.5, M1, 6)

  const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.6)
  return [
    { part: concrete, material: { ...finish('hbt-concrete', 0xcdc7bc), floodlight: (p: V3, n: V3) => (p[2] < 30 ? lit(p, n) : 0) } },
    { part: head, material: finish('hbt-head', 0xd9d6cf) },
    { part: win, material: { ...PALETTE.window, color: 0x50565d } },
    { part: red, material: finish('hbt-mast-red', 0xc0473c) },
    { part: white, material: finish('hbt-mast-white', 0xeeeae2) },
  ] as Slot[]
}

if (import.meta.main) {
  const extras = { anchor: ANCHOR, bearing: 0 }
  await writeModel(`${ID}.glb`, NAME, build(false), extras, 5000, 250_000)
  await writeModel(`${ID}.detail.glb`, NAME, build(true), extras, 40_000, 1_536_000)
}
