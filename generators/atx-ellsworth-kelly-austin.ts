/**
 * "Austin" by Ellsworth Kelly (designed 1986, built 2018), the stone
 * chapel at the Blanton Museum of Art, University of Texas, Austin —
 * procedural, CC0-1.0, no textures.
 *   bun generators/atx-ellsworth-kelly-austin.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 4.5 (the arms of the
 * OSM outline), so +y runs up the long south arm to the apse. Anchor = area
 * centroid of OSM way/575579280, -97.737822, 30.281686. z = 0 is the
 * building's own floor line on the lawn.
 *
 * Identity: a white stone Latin cross of four barrel-vaulted arms, all the
 * same section (vertical walls and a rounded, flattened vault), the north
 * arm ending in a round apse with a half-dome; set flush in the end walls,
 * the three coloured-glass windows: the 3 x 3 grid of squares over the oak
 * door on the south front, the ring of twelve "tumbling" squares on the
 * east end, and the twelve-bladed starburst on the west end.
 *
 * Numbers:
 *  - plan: the OSM outline (arms 7.3 to 7.6 m wide, drawn 7.5; the south
 *    arm to y -12.1, the west to x -9.7, the east to x 10.0, the apse to
 *    y 10.4); the apse is drawn round where OSM squares it off, as every
 *    photo from the north shows ("north", "nw");
 *  - not in the lidar (USGS_LPC_TX_Central_B1_2017_LAS_2019, flown 2017,
 *    when the site was a dig), so the height is photo-scaled: 8.8 m to the
 *    crown from the face-on "east" (330 px for the 7.5 m end wall, 390 px
 *    tall) and the apse in "north" (440 px wide, 520 px tall); the vault
 *    springs at 6.4 m and rises 2.4 m (estimated from "east", "se" and
 *    "north");
 *  - the windows, scaled from "se" (the grid: 0.71 m squares at 1.37 m
 *    centres, rows centred 3.8, 5.2 and 6.5 m; the door 2.0 x 2.8 m),
 *    "east" (the ring: radius 2.15 m about a centre 5.1 m up, squares
 *    0.86 m) and "west" (the blades: 0.7 to 2.5 m from a centre 5.1 m up):
 *    estimated; the squares are drawn 0.85 m, a little bolder than real, to
 *    hold up at phone size;
 *  - colours from the photos: the stone #aeadb0 in the sun on "east",
 *    pulled up to a cool white #e8e6e4; the door oak #6a4021 -> #8a6a4e;
 *    the glass as it reads from outside: mostly dark (the palette's
 *    window, darkened to #4a5560, near the charcoal floor), with the yellow, red and green panes where the photos show
 *    them lit (pulled to the palette's lightness).
 *
 * Sources (all EVIDENCE):
 *  se     "Austin Building Southeast Corner 2018.jpg", Larry D. Moore,
 *         CC BY 4.0  https://commons.wikimedia.org/wiki/File:Austin_Building_Southeast_Corner_2018.jpg
 *  west   "Austin Building West Elevation 2018.jpg", Larry D. Moore,
 *         CC BY 4.0  https://commons.wikimedia.org/wiki/File:Austin_Building_West_Elevation_2018.jpg
 *  east   "Austin Building East Elevation 2018.jpg", Larry D. Moore,
 *         CC BY 4.0  https://commons.wikimedia.org/wiki/File:Austin_Building_East_Elevation_2018.jpg
 *  nw     "Ellsworth Kelly's Austin from the northwest--photo by Steven
 *         Saylor.jpg", Stevensaylor, CC BY-SA 4.0
 *         https://commons.wikimedia.org/wiki/File:Ellsworth_Kelly%27s_Austin_from_the_northwest--photo_by_Steven_Saylor.jpg
 *  north  "Ellsworth Kelly's Austin from the north--photo by Steven
 *         Saylor.jpg", Stevensaylor, CC BY-SA 4.0
 *         https://commons.wikimedia.org/wiki/File:Ellsworth_Kelly%27s_Austin_from_the_north--photo_by_Steven_Saylor.jpg
 * Also OSM (ODbL). No look-only sources, no commercial imagery.
 *
 * Replaces the outline way/575579280 (no parts).
 *
 * Doubts: the height and the vault's rise are photo-scaled, not measured;
 * the map's terrain still shows the 2017 construction pit (about 3 m deep)
 * under the site, so the building may stand lower than the lawn round it
 * there until the terrain is refreshed. The small grey service door on the
 * north arm's west side is left out (it is the colour of the stone). The
 * coloured panes follow how they read from outside in the photos, not the
 * full spectrum seen inside.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { save } from './atl-flatiron-building'

if (import.meta.main) {
  const stone = new Part(), oak = new Part(), dark = new Part(), yellow = new Part(), red = new Part(), green = new Part()

  const HW = 3.75, SPRING = 6.1, RISE = 2.7, SEG = 12
  const CY = 1.75 // the crossing's centre line, east-west
  const S = -12.13, W = -9.7, E = 9.96, AC = 6.7 // the south, west and east ends, the apse's centre

  // the section: (u across, z up) from one wall foot over the vault to the other, with its normals
  const sec: { u: number; z: number; n: [number, number] }[] = [{ u: -HW, z: 0, n: [-1, 0] }]
  for (let k = 0; k <= SEG; k++) {
    const a = Math.PI - (Math.PI * k) / SEG, c = Math.cos(a), s = Math.sin(a)
    const nu = c / HW, nz = s / RISE, l = Math.hypot(nu, nz)
    sec.push({ u: HW * c, z: SPRING + RISE * s, n: [nu / l, nz / l] })
  }
  sec.push({ u: HW, z: 0, n: [1, 0] })

  /** A barrel arm along x or y, from t0 to t1, centred on `c` across. */
  function barrel(axis: 'x' | 'y', c: number, t0: number, t1: number) {
    const P = (u: number, z: number, t: number): V3 => (axis === 'y' ? [c + u, t, z] : [t, c + u, z])
    const N = (n: [number, number]): V3 => (axis === 'y' ? [n[0], 0, n[1]] : [0, n[0], n[1]])
    for (let k = 0; k < sec.length - 1; k++) {
      const a = sec[k], b = sec[k + 1]
      const na = N(a.n), nb = N(b.n) // the springing points' normals are the walls'
      stone.tri(P(a.u, a.z, t0), P(b.u, b.z, t0), P(b.u, b.z, t1), undefined, undefined, undefined, [na, nb, nb])
      stone.tri(P(a.u, a.z, t0), P(b.u, b.z, t1), P(a.u, a.z, t1), undefined, undefined, undefined, [na, nb, na])
    }
  }
  /** The flat end wall of an arm at t, facing `dir` (+1 or -1) along the axis. */
  function endWall(axis: 'x' | 'y', c: number, t: number, dir: number) {
    const P = (u: number, z: number): V3 => (axis === 'y' ? [c + u, t, z] : [t, c + u, z])
    const n: V3 = axis === 'y' ? [0, dir, 0] : [dir, 0, 0]
    const o = P(0, SPRING / 2)
    for (let k = 0; k < sec.length; k++) {
      const a = sec[k], b = sec[(k + 1) % sec.length]
      stone.tri(o, P(a.u, a.z), P(b.u, b.z), undefined, undefined, undefined, [n, n, n])
    }
  }

  barrel('y', 0, S, AC) // the nave, through the crossing into the apse
  barrel('x', CY, W, E) // the transept
  endWall('y', 0, S, -1)
  endWall('x', CY, W, -1)
  endWall('x', CY, E, 1)

  // the apse: a half-round wall and a half-dome of the same section
  {
    const n = 12, m = 6, ring = (th: number, r: number, z: number): V3 => [r * Math.cos(th), AC + r * Math.sin(th), z]
    for (let i = 0; i < n; i++) {
      const t0 = (Math.PI * i) / n, t1 = (Math.PI * (i + 1)) / n
      const n0: V3 = [Math.cos(t0), Math.sin(t0), 0], n1: V3 = [Math.cos(t1), Math.sin(t1), 0]
      stone.tri(ring(t0, HW, 0), ring(t1, HW, 0), ring(t1, HW, SPRING), undefined, undefined, undefined, [n0, n1, n1])
      stone.tri(ring(t0, HW, 0), ring(t1, HW, SPRING), ring(t0, HW, SPRING), undefined, undefined, undefined, [n0, n1, n0])
      for (let j = 0; j < m; j++) {
        const f0 = ((Math.PI / 2) * j) / m, f1 = ((Math.PI / 2) * (j + 1)) / m
        const pt = (th: number, f: number) => ring(th, HW * Math.cos(f), SPRING + RISE * Math.sin(f))
        const nm = (th: number, f: number): V3 => {
          const v: V3 = [(Math.cos(f) * Math.cos(th)) / HW, (Math.cos(f) * Math.sin(th)) / HW, Math.sin(f) / RISE], l = Math.hypot(...v)
          return [v[0] / l, v[1] / l, v[2] / l]
        }
        stone.tri(pt(t0, f0), pt(t1, f0), pt(t1, f1), undefined, undefined, undefined, [nm(t0, f0), nm(t1, f0), nm(t1, f1)])
        if (j < m - 1) stone.tri(pt(t0, f0), pt(t1, f1), pt(t0, f1), undefined, undefined, undefined, [nm(t0, f0), nm(t1, f1), nm(t0, f1)])
      }
    }
  }

  // ── the windows, flush on the end walls ──
  const OUT = 0.04
  /**
   * A rectangle hu x hz (half sizes) in the end wall of the arm centred on
   * `ac` across, at t facing dir; centred u to the viewer's right of the
   * arm's centre line (seen from outside) and z up, turned by rot.
   */
  function pane(p: Part, axis: 'x' | 'y', ac: number, t: number, dir: number, u: number, z: number, hu: number, hz: number, rot = 0) {
    const tt = t + dir * OUT, c = Math.cos(rot), s = Math.sin(rot), sgn = axis === 'y' ? -dir : dir
    const P = (du: number, dz: number): V3 => {
      const uu = ac + sgn * (u + du * c - dz * s), zz = z + du * s + dz * c
      return axis === 'y' ? [uu, tt, zz] : [tt, uu, zz]
    }
    const n: V3 = axis === 'y' ? [0, dir, 0] : [dir, 0, 0]
    const q = [P(-hu, -hz), P(hu, -hz), P(hu, hz), P(-hu, hz)]
    p.tri(q[0], q[1], q[2], undefined, undefined, undefined, [n, n, n])
    p.tri(q[0], q[2], q[3], undefined, undefined, undefined, [n, n, n])
  }

  // the south front: the oak door and the 3 x 3 colour grid (read left to right, top to bottom, from "se")
  pane(oak, 'y', 0, S, -1, 0, 1.4, 1.0, 1.4)
  const grid = [[dark, yellow, dark], [dark, dark, red], [dark, dark, dark]]
  grid.forEach((row, r) => row.forEach((p, k) => pane(p, 'y', 0, S, -1, (k - 1) * 1.37, 6.49 - r * 1.32, 0.425, 0.425)))

  // the east end: twelve tumbling squares in a ring, clockwise from the top as seen from outside ("east")
  const ringCols = [yellow, green, green, dark, dark, dark, dark, dark, dark, red, red, yellow]
  for (let k = 0; k < 12; k++) {
    const a = Math.PI / 2 - (k * Math.PI) / 6
    pane(ringCols[k], 'x', CY, E, 1, 2.15 * Math.cos(a), 5.1 + 2.15 * Math.sin(a), 0.43, 0.43, Math.PI / 4 - (k * Math.PI) / 24)
  }

  // the west end: the starburst, twelve dark blades
  for (let k = 0; k < 12; k++) {
    const a = (k * Math.PI) / 6, r = 1.6
    pane(dark, 'x', CY, W, -1, r * Math.cos(a), 5.1 + r * Math.sin(a), 0.9, 0.15, a)
  }

  await save('atx-ellsworth-kelly-austin', 'Austin (Ellsworth Kelly)', [
    { part: stone, material: finish('kelly-marble', 0xe8e6e4) },
    { part: oak, material: finish('kelly-oak', 0x8a6a4e) },
    { part: dark, material: { ...PALETTE.window, color: 0x4a5560 } }, // the panes read near black from outside: the window slate pulled to charcoal
    { part: yellow, material: windowVariant(2, 0xd2a64a) },
    { part: red, material: windowVariant(3, 0xb85a44) },
    { part: green, material: windowVariant(4, 0x5f8f62) },
  ], { bearing: 4.5, replaces: ['way/575579280'] }, 5000)
}
