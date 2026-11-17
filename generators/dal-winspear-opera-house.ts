/**
 * Margot and Bill Winspear Opera House, AT&T Performing Arts Center (2403
 * Flora Street, Dallas; Foster + Partners, 2009) — original procedural
 * geometry, CC0-1.0.
 * bun generators/dal-winspear-opera-house.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * anchor. Anchor = centroid of the OSM outline way/179918603 (the glass
 * house), 32.7909535, -96.7980084. Bearing 45.7: the sunshade canopy's
 * edges (way/312168249) run at 45.7° / 135.7°, so the canopy is square to
 * this frame; the house and its drum are turned against it (drum axis at
 * 166° true, -30.8° from +x here), as built.
 *
 * Identity, in order: the huge flat louvred sunshade canopy on slim round
 * columns, overhanging the house far on every side; the red glass drum of
 * the auditorium rising through it; the dark glass house under the canopy
 * through which the drum shows; the small dark flytower box on the drum's
 * north-west end.
 *
 * Evidence:
 *  - plan: canopy outline from OSM way/312168249, x -65.5..75.0,
 *    y -66.1..51.2 (140.5 x 117.3 m), confirmed by the lidar DSM; the 16
 *    columns at their OSM building:part positions (1414653500-515), on a
 *    ~30 x 26 m grid, set in from the canopy edge 4-17 m. The glass house
 *    is the OSM hexagon way/179918603. The drum: a stadium fitted to the
 *    lidar cells above 26 m: centre (-0.6, 0.6), axis -30.8° from +x,
 *    77 x 42 m (semicircular ends, radius 21). Flytower box: lidar cells
 *    above 33 m, 21 x 26.5 m centred (-9.7, 5.7).
 *  - heights: USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018 flight, 1 m
 *    grid), above the plaza at 141.6 m: canopy top 19.1 (measured, p10-p90
 *    18.9-19.4); house roof 20.2 (measured); drum top 31.4 (measured);
 *    flytower 33.8 (measured). OSM's canopy tags (min_height 9, height 10)
 *    and column heights (9) are wrong against the lidar and the photos and
 *    are not used.
 *  - canopy depth 1.3 m and its edge fascia, the louvre blades and the
 *    column size (~0.8 m round) from Praefcke's photos 22-28 and Tamayo's
 *    construction photo. Where the canopy's louvres are open (the lidar sees
 *    the ground through it: the north-west and north strips, the south-east
 *    corner; NAIP shows the same open cells) the cells are drawn as
 *    separate blades; elsewhere as solid louvre panels.
 *  - colour: drum deep red in every daylight photo, pulled slightly light
 *    (#b8423c); canopy silver-white aluminium (#e9ecec); columns grey steel
 *    (#a2a8ad); house and drum roofs dark grey as in NAIP (#6b7076); the house glass dark (#4a6475) and translucent (0.55), so the drum reads
 *    through it as in the photos.
 *  - night: the drum glows red through the glass at dusk (Highsmith
 *    LCCN2015631276, 630579), so it is `neon-winspear-red`; the glass stays
 *    `glass`.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Winspear_Opera_House_01, 02, 03, 20, 22-28.jpg — Andreas Praefcke,
 *    CC BY 3.0
 *  - Winspear_Exterior.JPG — Kayedavi, public domain
 *  - Dallas_Winspear_Opera_House_construction_canopy.jpg — Luis Tamayo,
 *    CC BY-SA 2.0
 *  - Dusk shot... LCCN2015631276.tif, Dusk view... LCCN2015630579.tif —
 *    Carol M. Highsmith, public domain
 * Aerial: USGS NAIP (public domain). No look-only sources. No commercial
 * imagery or 3D tiles.
 *
 * Doubts: the louvre zones are simplified to three open strips; the
 * canopy's primary beams are drawn on a regular grid through the columns,
 * not traced; the house's back-of-house side (north-west, under the open
 * louvres) is unphotographed and drawn as the same glass. Left out: the
 * drum's lit balcony bands, the AT&T roof lettering, the entrance canopy,
 * the "Sammons Park" landscape and pool.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { cap, inset, save, walls, type XY } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.7909535, -96.7980084]
const BEARING = 45.7

/** Canopy. */
const CX0 = -65.5, CX1 = 75.0, CY0 = -66.1, CY1 = 51.2, CTOP = 19.1, CDEPTH = 1.3
/** Column positions (OSM building:parts 1414653500-515). */
const COLS: XY[] = [
  [-62.0, 42.8], [-61.3, -61.3], [-61.2, -35.2], [-61.4, -9.5], [-61.5, 16.7], [-32.2, 43.2], [-2.1, 43.5], [28.2, 43.5],
  [58.3, 43.6], [58.4, 17.7], [58.5, -8.2], [59.4, -34.1], [59.2, -60.2], [29.0, -60.3], [-1.1, -60.4], [-31.1, -60.9],
]
/** The glass house: OSM way/179918603, counter-clockwise. */
const HOUSE: XY[] = [[15.5, -42.9], [44.9, -25.8], [45.1, 9.0], [-15.5, 42.9], [-45.5, 25.1], [-44.6, -9.3]]
const HOUSE_TOP = 20.2
/** The drum. */
const DC: XY = [-0.6, 0.6], DA = (-30.8 * Math.PI) / 180, DL = 77, DW = 42, DRUM = 31.4

/** Where the louvres are open (lidar and NAIP see the ground through them). */
const open = (x: number, y: number) => x < -33 || (y > 41 && x < 22) || (x > 47 && y < -27)

function build() {
  const canopy = new Part(), steel = new Part(), red = new Part(), glass = new Part(), roof = new Part()

  // --- Canopy: a fascia ring round the edge, primary beams on a grid
  // through the columns, and louvre panels or blades in every cell.
  const zb = CTOP - CDEPTH
  const outer: XY[] = [[CX0, CY0], [CX1, CY0], [CX1, CY1], [CX0, CY1]]
  const innerR = inset(outer, 0.9)
  walls(canopy, outer, zb, CTOP)
  walls(canopy, [...innerR].reverse(), zb, CTOP)
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    canopy.quad([innerR[k][0], innerR[k][1], CTOP], [outer[k][0], outer[k][1], CTOP], [outer[l][0], outer[l][1], CTOP], [innerR[l][0], innerR[l][1], CTOP])
    canopy.quad([innerR[k][0], innerR[k][1], zb], [innerR[l][0], innerR[l][1], zb], [outer[l][0], outer[l][1], zb], [outer[k][0], outer[k][1], zb])
  }
  // Beam lines: the column lines and one between each pair, plus lines
  // half a bay beyond the outer columns where the canopy runs on.
  const xs = [-61.5, -46.5, -31.6, -16.6, -1.6, 13.5, 28.6, 43.5, 58.4, 66.7].filter(x => x > CX0 + 1 && x < CX1 - 1)
  const ys = [-60.6, -47.6, -34.6, -21.7, -8.8, 4.2, 17.2, 30.2, 43.2].filter(y => y > CY0 + 1 && y < CY1 - 1)
  const X0 = CX0 + 0.9, X1 = CX1 - 0.9, Y0 = CY0 + 0.9, Y1 = CY1 - 0.9
  const beam = (a: XY, b: XY, w: number, z0: number, z1: number) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), n: XY = [(-dy / L) * w, (dx / L) * w]
    const r: XY[] = [[a[0] - n[0], a[1] - n[1]], [b[0] - n[0], b[1] - n[1]], [b[0] + n[0], b[1] + n[1]], [a[0] + n[0], a[1] + n[1]]]
    walls(canopy, r, z0, z1)
    cap(canopy, r, z1)
    cap(canopy, r, z0, false)
  }
  for (const x of xs) beam([x, Y0], [x, Y1], 0.35, zb + 0.1, CTOP - 0.05)
  for (const y of ys) beam([X0, y], [X1, y], 0.35, zb + 0.25, CTOP - 0.05)
  // Cells: solid louvre panels, or blades running along y where open.
  const gx = [X0, ...xs, X1], gy = [Y0, ...ys, Y1]
  for (let i = 0; i < gx.length - 1; i++) for (let j = 0; j < gy.length - 1; j++) {
    const x0 = gx[i] + 0.35, x1 = gx[i + 1] - 0.35, y0 = gy[j] + 0.35, y1 = gy[j + 1] - 0.35
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2
    if (!open(mx, my)) {
      const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
      cap(canopy, r, CTOP - 0.25)
      cap(canopy, r, CTOP - 0.55, false)
      continue
    }
    const n = Math.max(2, Math.round((x1 - x0) / 3.4))
    for (let k = 0; k < n; k++) {
      const c = x0 + ((k + 0.5) * (x1 - x0)) / n, w = 0.55
      const r: XY[] = [[c - w, y0], [c + w, y0], [c + w, y1], [c - w, y1]]
      cap(canopy, r, CTOP - 0.25)
      cap(canopy, r, CTOP - 0.55, false)
    }
  }

  // --- Columns: slim round steel, ground to the canopy's underside.
  const ring = (c: XY, r: number, seg: number, a0 = 0): XY[] =>
    Array.from({ length: seg }, (_, i) => [c[0] + r * Math.cos(a0 + (i / seg) * 2 * Math.PI), c[1] + r * Math.sin(a0 + (i / seg) * 2 * Math.PI)] as XY)
  for (const c of COLS) walls(steel, ring(c, 0.45, 8), 0, zb + 0.15)

  // --- The glass house: translucent walls, a dark roof, pale corner posts.
  walls(glass, HOUSE, 0, HOUSE_TOP - 0.9)
  walls(steel, HOUSE, HOUSE_TOP - 0.9, HOUSE_TOP)
  cap(roof, HOUSE, HOUSE_TOP)
  for (const [x, y] of HOUSE) walls(steel, ring([x, y], 0.35, 4, Math.PI / 4), 0, HOUSE_TOP - 0.9)
  // transoms at the floor levels, faint lines on the glass
  for (const z of [6.5, 13.0]) {
    const o = inset(HOUSE, -0.05)
    walls(steel, o, z - 0.2, z + 0.2)
  }

  // --- The red drum: a stadium in plan, through the house and above it.
  const u: XY = [Math.cos(DA), Math.sin(DA)], v: XY = [-u[1], u[0]]
  const R = DW / 2, S = (DL - DW) / 2
  const stadium = (r: number): XY[] => {
    const pts: XY[] = []
    const SEG = 10
    for (const [end, a0] of [[S, -Math.PI / 2], [-S, Math.PI / 2]] as [number, number][])
      for (let i = 0; i <= SEG; i++) {
        const a = a0 + (i / SEG) * Math.PI
        const s = end + r * Math.cos(a), t = r * Math.sin(a)
        pts.push([DC[0] + u[0] * s + v[0] * t, DC[1] + u[1] * s + v[1] * t])
      }
    return pts
  }
  const dr = stadium(R)
  walls(red, dr, 0, DRUM - 0.5)
  const lip = stadium(R - 0.6)
  walls(red, dr, DRUM - 0.5, DRUM, lip)
  walls(red, [...lip].reverse(), DRUM - 0.9, DRUM)
  cap(roof, lip, DRUM - 0.9)
  // Flytower box at the drum's north-west end.
  const fc: XY = [-9.7, 5.7], fa = 10.5, fb = 13.25
  const fly: XY[] = [[-fa, -fb], [fa, -fb], [fa, fb], [-fa, fb]].map(([s, t]) => [fc[0] + u[0] * s + v[0] * t, fc[1] + u[1] * s + v[1] * t] as XY)
  walls(steel, fly, DRUM - 0.9, 33.8 - 0.4)
  walls(steel, fly, 33.8 - 0.4, 33.8, inset(fly, 0.4))
  cap(roof, inset(fly, 0.4), 33.8)

  return [
    { part: canopy, material: finish('winspear-canopy', 0xe9ecec) },
    { part: steel, material: finish('winspear-steel', 0xa2a8ad) },
    { part: red, material: finish('neon-winspear-red', 0xb8423c) },
    { part: roof, material: finish('winspear-roof', 0x6b7076) },
    { part: glass, material: { name: 'glass', color: 0x4a6475, roughness: 0.2, opacity: 0.55, doubleSided: true } },
  ]
}

if (import.meta.main) await save('dal-winspear-opera-house', 'Winspear Opera House', ANCHOR, BEARING, build() as any, 5000)
