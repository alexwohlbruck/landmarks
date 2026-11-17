/**
 * HVB Tower (Hypo-Haus), Arabellapark, Munich-Bogenhausen: Walther and Bea
 * Betz, 1975-81, for the Bayerische Hypotheken- und Wechsel-Bank; facade
 * renewed by Henn Architekten 2013-15. Original procedural geometry,
 * CC0-1.0.
 * bun generators/munich-hvb-tower.ts
 *
 * Map frame: x east, y north, z up, metres, origin at the anchor on the
 * ground. Anchor = area centroid of the tower's OSM outline way/211447642
 * (relation/2833590), 48.1498111, 11.6173211. Its walls
 * run north-south, east-west and on the diagonals, so bearing 0.
 *
 * Note on identity: the assignment named way/30441563, which OSM tags
 * "HVB Tower" by its address (Arabellastraße 14), but that is the low
 * office block with the glass atrium 110 m east. The 114 m tower is the
 * "Hypo-Haus" building relation/2833590 (outline way/211447642, wikidata
 * Q896364), confirmed on the Bavarian open orthophoto (DOP40, CC BY 4.0) by
 * its round shafts and long shadow. This model is placed there.
 *
 * Identity, in order: three triangular office wings of different heights
 * (106, 90 and 70 m), turned like a pinwheel round a core, hanging from 17 m
 * above an open ground floor; five round aluminium-clad shafts standing
 * proud of the wings, the tallest 114 m; the heavy collars ("Kragen") at
 * 40-50 m where the wings are hung, each with its scoop running into the
 * wing; an open technical floor under the collars; the silver aluminium
 * grid and dark glass of the wings.
 *
 * Evidence:
 *  - plan and heights (OSM, measured in the frame; heights tagged on the
 *    parts and consistent with the photos): wings way/135353407 (east,
 *    to 106 m), 196660573 (west, 17-90 m), 210584887 (south, 17-70 m);
 *    core way/211450796 (to 70 m); shafts way/135350828 (r 6.4, 114 m),
 *    196660576 (r 3.3, 110 m), 196660575 (r 3.8, 112 m), 135353405 (r 3.7,
 *    94 m), 196660574 (r 3.7, 79 m); the collar parts 210584882/883/885
 *    (40-50 m). Published: 113.7 m (de.wikipedia; 114 in the infobox), 27
 *    floors; six floors (5th to 10th) hung from the central frame.
 *  - estimated: the east wing drawn hung from 17 m like the others (OSM
 *    gives it no min_height; the photos show every wing floating over the
 *    open ground floor); the open floor 40-43.5 m set back 1.5 m; the
 *    collar sleeves 1.7 m proud and the scoops' shapes (from Esch's and
 *    Klack's photos; drawn as a sleeve and a rounded elbow turning down onto
 *    the wing face); the open ground floor: under 17 m only a slim glazed
 *    lobby (to 8.5 m) and a dark stair and lift stem stand inside the
 *    shafts, as Esch's photo shows clear through under the wings (OSM's
 *    core part way/211450796 is drawn from 17 m up); window bays 2.4 m and
 *    two floors (7.2 m) a group.
 *  - colours: light silver aluminium skin and shafts, narrow dark grey-blue
 *    panes in an even grid (photos).
 *  - night: the offices are lit: the wing glazing is `window`.
 *  - elevation 0. No lidar (none in Germany); no Bavarian 3D city model
 *    used (the DOP40 orthophoto only located the tower).
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - HVB-Tower_in_München.jpg (HypoVereinsbank / HG Esch, CC BY-SA 4.0):
 *    from the west, the main reference for shafts, collars and wings.
 *  - HVB-Tower.jpg (HypoVereinsbank / HG Esch, CC BY-SA 4.0): from the
 *    south-west at a distance, the relative heights.
 *  - 2019-03-04-Hypo-Bank-Hochhaus-1.jpg (Gunnar Klack, CC BY-SA 4.0): from
 *    the west at dusk.
 *  - München_-_Hypohaus_-_August_2016.jpg (Kajebi II., CC BY-SA 4.0):
 *    from the south-west.
 *  - HypoHochhaus01.jpg (Ordercrazy, public domain): the hung wing's
 *    underside and a shaft at the foot.
 *  - HVB-Tower_Munich,_June_2017.jpg (Martin Falbisoner, CC BY-SA 4.0):
 *    looking up between the wings.
 * Orthophoto: Bayerische Vermessungsverwaltung DOP40 (CC BY 4.0), used to
 * locate the building only.
 * No commercial imagery, no 3D city models, no look-only sources.
 *
 * Left out: the aluminium ribbing on the shafts, the window mullions, the
 * low wings and podium round the foot (other OSM buildings), roof plant.
 *
 * Doubts: the wing undersides and the north side are seen in few photos;
 * the scoops are drawn as simple rounded blocks.
 */
import { Part, type V3 } from './mesh'
import { finish, windowVariant } from './palette'
import { cap, inset, lathe, walls, area, save, type XY } from './chi-aon-center'
import { faceN, wallAt } from './munich-propylaeen'
import { tube } from './munich-olympiaturm'

const ccw = (r: XY[]): XY[] => (area(r) < 0 ? [...r].reverse() : r)
const HANG = 17, OPEN0 = 40, OPEN1 = 43.5

type Shaft = { c: XY; r: number; h: number }
const SHAFTS: Shaft[] = [
  { c: [-0.5, 19.2], r: 6.4, h: 114 },
  { c: [-6.0, 12.0], r: 3.3, h: 110 },
  { c: [23.6, 1.0], r: 3.8, h: 112 },
  { c: [-22.3, -10.2], r: 3.7, h: 94 },
  { c: [-5.9, -25.9], r: 3.7, h: 79 },
]

function build(D: boolean) {
  const alu = new Part(), shaft = new Part(), glass = new Part(), dark = new Part()
  const SEG = D ? 24 : 16

  /** A wing: a prism over a triangle, hung from z0, with the open floor and grouped glazing. */
  const wing = (tri: XY[], z0: number, z1: number) => {
    const r = ccw(tri)
    const setback = inset(r, 1.5)
    // the hung floors below the open floor, the open floor set back, the floors above
    walls(alu, r, z0, OPEN0)
    cap(alu, r, z0, false)
    walls(dark, setback, OPEN0, OPEN1)
    cap(alu, r, OPEN0, true)
    cap(alu, r, OPEN1, false)
    walls(alu, r, OPEN1, z1)
    // a parapet and the roof
    const ri = inset(r, 0.8)
    walls(alu, [...ri].reverse(), z1 - 1.2, z1)
    for (let k = 0; k < r.length; k++) {
      const a = r[k], b = r[(k + 1) % r.length], ia = ri[k], ib = ri[(k + 1) % r.length]
      faceN(alu, [[a[0], a[1], z1], [b[0], b[1], z1], [ib[0], ib[1], z1], [ia[0], ia[1], z1]], [0, 0, 1])
    }
    cap(alu, ri, z1 - 1.2)
    // glazing: an even grid of narrow dark panes, 2.4 m bays, two floors a
    // group, the light aluminium showing as piers and spandrels between
    const FL = 3.6, G = 2 * FL
    for (let k = 0; k < r.length; k++) {
      const a = r[k], b = r[(k + 1) % r.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const w = wallAt(a, [(b[0] - a[0]) / L, (b[1] - a[1]) / L], [(b[1] - a[1]) / L, -(b[0] - a[0]) / L])
      const end = 1.0, n = Math.max(1, Math.round((L - 2 * end) / 2.4)), bay = (L - 2 * end) / n
      const bands: [number, number][] = []
      for (let z = z0 + 0.6; z + 2 < OPEN0; z += G) bands.push([z, Math.min(z + G - 1.7, OPEN0 - 0.6)])
      for (let z = OPEN1 + 0.6; z + 2 < z1 - 1.4; z += G) bands.push([z, Math.min(z + G - 1.7, z1 - 1.4)])
      for (const [b0, b1] of bands) for (let q = 0; q < n; q++) {
        const s0 = end + q * bay + 0.4, s1 = end + (q + 1) * bay - 0.4
        faceN(glass, [w.P(s0, b0, 0.05), w.P(s1, b0, 0.05), w.P(s1, b1, 0.05), w.P(s0, b1, 0.05)], [w.n[0], w.n[1], 0])
      }
    }
  }

  // ------------------------------------------------------------ the wings
  wing([[6.7, 4.8], [27.6, 4.9], [6.8, 25.0]], HANG, 106)
  wing([[-10.8, -5.4], [-10.7, 19.4], [-37.3, -5.5]], HANG, 90)
  wing([[-0.9, -3.8], [-0.9, -32.2], [28.1, -3.0]], HANG, 70)

  // the core between them, from the ground to 70 m, glazed lobby at the foot
  {
    const core = ccw([[-0.9, -3.8], [23.7, -3.1], [23.7, 4.8], [6.8, 4.7], [6.6, 19.4], [-10.7, 19.4], [-10.8, -3.7]])
    // under the hung wings the floor is open: only a slim glazed lobby and
    // the stair and lift core stand there, with clear space round them
    const lobby = ccw([[-4.5, -1.0], [16.0, -0.5], [16.0, 3.0], [3.5, 3.0], [3.5, 14.0], [-6.5, 14.0], [-7.5, -1.0]])
    const stem = ccw([[-2.5, 1.0], [8.0, 1.2], [8.0, 2.8], [2.5, 2.8], [2.5, 10.0], [-4.5, 10.0], [-4.5, 1.0]])
    walls(glass, lobby, 0, 8.5)
    cap(alu, lobby, 8.5)
    walls(dark, stem, 8.5, HANG)
    walls(alu, core, HANG, 70)
    cap(alu, core, HANG, false)
    cap(alu, core, 70)
    // dark open slots up the core where it shows between the wings
    for (let k = 0; k < core.length; k++) {
      const a = core[k], b = core[(k + 1) % core.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 4) continue
      const w = wallAt(a, [(b[0] - a[0]) / L, (b[1] - a[1]) / L], [(b[1] - a[1]) / L, -(b[0] - a[0]) / L])
      for (let z = HANG + 0.6; z < 68; z += 7.2) faceN(glass, [w.P(1.0, z, 0.05), w.P(L - 1.0, z, 0.05), w.P(L - 1.0, Math.min(z + 5.5, 69), 0.05), w.P(1.0, Math.min(z + 5.5, 69), 0.05)], [w.n[0], w.n[1], 0])
    }
  }

  // --------------------------------------------------- shafts and collars
  for (const s of SHAFTS) {
    const { c, r, h } = s
    lathe(shaft, c[0], c[1], [[r, 0], [r, h - 1.2], [r * 0.9, h - 0.35], [r * 0.6, h], [0, h]], SEG)
  }
  // the collars on the three shafts the wings hang from, and their scoops
  const collar = (s: Shaft, to?: XY) => {
    const R = s.r + 1.7
    lathe(shaft, s.c[0], s.c[1], [[s.r, 39.5], [R - 0.5, 40.3], [R, 41.2], [R, 49.2], [R - 0.5, 50], [s.r, 50.5]], SEG)
    if (!to) return
    // the scoop: a rounded elbow out of the sleeve, turning down onto the
    // wing face it carries (Esch's photo), drawn as a curved tube
    const d = [to[0] - s.c[0], to[1] - s.c[1]], L = Math.hypot(d[0], d[1]), u = [d[0] / L, d[1] / L]
    const P0: V3 = [s.c[0] + u[0] * (s.r + 0.2), s.c[1] + u[1] * (s.r + 0.2), 45.2]
    const P1: V3 = [to[0], to[1], 45.2], P2: V3 = [to[0], to[1], 36.5]
    const bez = (t: number): V3 => [0, 1, 2].map((i) => (1 - t) ** 2 * P0[i] + 2 * (1 - t) * t * P1[i] + t * t * P2[i]) as V3
    const n = D ? 6 : 4
    for (let i = 0; i < n; i++) {
      const t0 = i / n, t1 = (i + 1) / n
      const r0 = 3.2 - 1.2 * t0, r1 = 3.2 - 1.2 * t1
      tube(shaft, bez(t0), bez(t1), r0, r1, D ? 14 : 10, i === n - 1)
    }
  }
  collar(SHAFTS[3], [-12.0, -5.6])
  collar(SHAFTS[4], [-1.1, -17.5])
  collar(SHAFTS[0])

  return [
    { part: alu, material: finish('hvb-aluminium', 0xd4d7db) },
    { part: shaft, material: finish('hvb-shaft', 0xe2e4e6, 0.6) },
    { part: glass, material: windowVariant(2, 0x5b6d7e) },
    { part: dark, material: finish('hvb-shadow', 0x5c636b) },
  ]
}

if (import.meta.main) {
  await save('munich-hvb-tower', 'HVB Tower', [48.1498111, 11.6173211], 0, build(false), 6500)
}
