/**
 * Ray and Maria Stata Center (MIT Building 32), Cambridge MA: original
 * procedural geometry, CC0-1.0.
 * bun generators/bos-mit-stata-center.ts
 *
 * Frank Gehry, 2004. A podium over a garage, its roof a plaza and lawn,
 * carrying a jumble of towers: two nine-storey salmon-brick blocks with
 * punched windows (the Gates side, west, and the Dreyfoos side, north and
 * east), leaning brushed-steel towers and drums between and above them, a
 * dark grey panelled block, a yellow drum over the "Student Street" roof,
 * a white curved form near Vassar Street, and a low curved steel roof over
 * the lecture halls in the south-east.
 *
 * Frame: map frame, bearing 0 (x east, y north, z up, metres). Origin = the
 * anchor, the centroid of OSM way/27078002.
 *
 * Evidence
 * - OSM way/27078002 (outline, 9 levels, height 43.1, Gehry). OSM's
 *   building:parts here carry no heights; not used for massing.
 * - USGS 3DEP lidar MA_CentralEastern_1_2021 (2021 flight), 1 m grid read
 *   in this frame (tools/lidar_frame.py). y = 0 is the street on the north
 *   (Vassar Street) side, 1.2 m above the box's ground_min. Measured, above
 *   y = 0: podium/plaza 5.5; Gates brick blocks 36 (west, x -72..-46) and
 *   40 (south, x -46..-25, y -41..-16), the west block's top tier 42;
 *   Dreyfoos brick blocks 38 (east, x 18..38, y 2..30) and 41 (north,
 *   x -10..16, y 31..46); steel towers 37-43; the dark block 29; the
 *   yellow drum 27 (centre (3, 9), r 6.3, also its place on NAIP); the
 *   Student Street roof 13; the lecture-hall roof 16.5; the south brick
 *   block 12; the north-west drum 23.
 * - USGS NAIP orthophoto (0.2 m): plan of every volume, the yellow drum,
 *   the silver drums and the curved steel roof.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - "Stata Center and Alumni Pool.jpg", Nickknack00, CC BY-SA 4.0 (from
 *     above, south: the whole cluster, colours of every volume):
 *     https://commons.wikimedia.org/wiki/File:Stata_Center_and_Alumni_Pool.jpg
 *   - "Stata Center in the Winter (MIT).jpg", Rizka, CC0 (from above,
 *     south-west):
 *     https://commons.wikimedia.org/wiki/File:Stata_Center_in_the_Winter_(MIT).jpg
 *   - "Ray and Maria Stata Center - MIT, Cambridge (16868722144).jpg", Tony
 *     Webster, CC BY 2.0 (street level: steel, brick, yellow, windows):
 *     https://commons.wikimedia.org/wiki/File:Ray_and_Maria_Stata_Center_-_MIT,_Cambridge_(16868722144).jpg
 *   - "Stata Center (05675p).jpg", Rhododendrites, CC BY-SA 4.0 (the
 *     curved steel roof and a steel funnel from the terrace):
 *     https://commons.wikimedia.org/wiki/File:Stata_Center_(05675p).jpg
 *   - "MIT Stata Center in Snow 20220107.png", Peacearth, CC BY-SA 4.0
 *     (street level: two brick towers with the steel tower between):
 *     https://commons.wikimedia.org/wiki/File:MIT_Stata_Center_in_Snow_20220107.png
 *   - "Stata-04.jpg", Sintakso, CC BY-SA 4.0 (the yellow drum's taper and
 *     tilt, the bundle of steel cylinders behind it):
 *     https://commons.wikimedia.org/wiki/File:Stata-04.jpg
 *   - "Stata Center (05659).jpg", Rhododendrites, CC BY-SA 4.0 (the
 *     curved steel roof and the flared steel funnel):
 *     https://commons.wikimedia.org/wiki/File:Stata_Center_(05659).jpg
 *   No look-only sources. No commercial imagery.
 *
 * Abstracted / estimated: the brick towers lean and splay (1-2.6 m shift,
 * up to 10% wider at the top) with stepped top tiers; leans read from the
 * photos, heights from lidar. The steel volumes are lofted irregular
 * seven-sided rings that lean, bulge, taper and twist a little, standing
 * for the panelled, crumpled forms; the yellow drum is a tilted tapering
 * cone with a sloped top; the funnel's size is estimated. The brick
 * towers' punched windows are grouped two storeys to a panel (STYLE); the
 * steel volumes' projecting windows are left out. The podium deck is roof
 * grey; the lawn on it is left grey too (a seventh material would be
 * needed for green).
 * Doubts: the north (Vassar Street) side is seen only in the aerials.
 *
 * Night: the brick blocks' windows glow.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { box, ccw, capPoly, revolve, save, wall, type XY } from './atl-tech-tower'

const brick = new Part(), steel = new Part(), dark = new Part(), yellow = new Part(), white = new Part(), win = new Part()

const OUTLINE: XY[] = ccw([[-12.8, 32.6], [-10.9, 44.7], [-4.1, 43.8], [-7.9, 47.5], [-3.8, 49.0], [-3.7, 52.2], [0.1, 51.8], [1.9, 54.8], [6.4, 55.8], [9.6, 51.3], [15.3, 56.0], [20.9, 49.5], [24.6, 53.2], [39.5, 40.7], [37.9, 43.1], [36.5, 45.2], [40.5, 49.4], [44.2, 52.4], [48.2, 51.5], [48.6, 49.7], [49.7, 51.3], [52.3, 51.5], [54.5, 48.7], [50.7, 43.7], [55.0, 40.4], [53.5, 38.5], [55.0, 37.3], [51.0, 31.9], [59.8, 11.7], [56.2, 11.1], [56.0, 7.5], [55.8, 4.0], [57.5, 3.9], [56.7, -9.1], [55.4, -8.5], [53.7, -8.2], [51.7, -8.4], [50.5, -9.1], [49.3, -10.6], [49.0, -12.3], [49.0, -14.0], [49.8, -15.5], [51.1, -16.7], [52.6, -17.4], [54.7, -17.3], [56.2, -16.6], [55.4, -29.1], [52.2, -29.2], [50.1, -30.4], [13.1, -46.9], [14.3, -49.6], [5.7, -53.4], [6.8, -47.7], [2.9, -47.2], [3.3, -44.1], [1.2, -43.8], [-0.1, -43.7], [0.3, -50.8], [-4.8, -51.2], [-3.5, -68.0], [-16.9, -73.9], [-17.8, -71.7], [-18.9, -69.2], [-8.8, -64.6], [-9.9, -48.8], [-13.2, -49.0], [-21.0, -49.6], [-21.5, -43.0], [-25.8, -42.7], [-42.5, -41.6], [-46.6, -41.2], [-45.5, -26.3], [-49.8, -26.2], [-52.8, -25.2], [-51.8, -14.8], [-52.4, -12.0], [-55.4, -13.4], [-56.1, -11.7], [-61.6, -14.3], [-64.8, -15.8], [-66.0, -13.0], [-66.6, -11.7], [-71.0, -1.9], [-71.7, -0.3], [-75.2, 8.0], [-74.7, 10.9], [-73.0, 10.4], [-71.8, 9.7], [-70.3, 9.4], [-72.0, 12.3], [-65.7, 16.6], [-63.0, 12.3], [-64.5, 18.4], [-57.6, 19.5], [-56.1, 15.0], [-42.4, 24.5], [-41.4, 23.0], [-39.5, 24.3], [-39.1, 27.8], [-38.2, 30.1], [-37.0, 31.8], [-34.7, 32.9], [-32.5, 32.9], [-30.5, 32.5], [-28.4, 31.1], [-26.9, 29.6], [-26.2, 32.2], [-24.7, 34.7], [-22.4, 37.0], [-20.3, 38.5], [-17.5, 39.7], [-14.4, 40.5], [-13.8, 35.6]])

const POD = 5.5
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const ellipse = (cx: number, cy: number, rx: number, ry: number, n = 16, rot = 0): XY[] =>
  Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2, x = rx * Math.cos(t), y = ry * Math.sin(t)
    return [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)] as XY
  })

const centroid = (r: XY[]): XY => [r.reduce((s, q) => s + q[0], 0) / r.length, r.reduce((s, q) => s + q[1], 0) / r.length]
/** A ring moved by (dx, dy) and scaled by k about its centroid. */
const xf = (r: XY[], dx: number, dy: number, k = 1): XY[] => {
  const [cx, cy] = centroid(r)
  return r.map(([x, y]) => [cx + (x - cx) * k + dx, cy + (y - cy) * k + dy] as XY)
}
type Level = { ring: XY[]; z: number }
/** Loft a stack of rings (same count, counter-clockwise), capping the top in `top`. */
function stack(p: Part, levels: Level[], top: Part | null = p) {
  const rs = levels.map((l) => ccw(l.ring).map(([x, y]) => [x, y, l.z] as V3))
  p.loft(rs)
  if (top) capPoly(top, ccw(levels[levels.length - 1].ring), levels[levels.length - 1].z, true)
}

/**
 * A salmon-brick tower that leans and splays: a box ring lofted through its
 * levels, punched windows grouped two storeys to a panel on every (tilted)
 * face, each panel set flat on its face.
 */
function brickTower(levels: Level[], roofTop = true) {
  stack(brick, levels, roofTop ? dark : brick)
  for (let k = 0; k < levels.length - 1; k++) {
    const r0 = ccw(levels[k].ring), r1 = ccw(levels[k + 1].ring), z0 = levels[k].z, z1 = levels[k + 1].z
    for (let i = 0; i < r0.length; i++) {
      const j = (i + 1) % r0.length
      const A: V3 = [r0[i][0], r0[i][1], z0], B: V3 = [r0[j][0], r0[j][1], z0], C: V3 = [r1[j][0], r1[j][1], z1], D: V3 = [r1[i][0], r1[i][1], z1]
      const L = Math.hypot(B[0] - A[0], B[1] - A[1]), H = z1 - z0
      const n = cross(sub(B, A), sub(D, A)), nl = Math.hypot(...n), off: V3 = [(n[0] / nl) * 0.06, (n[1] / nl) * 0.06, (n[2] / nl) * 0.06]
      const P = (u: number, v: number): V3 => {
        const b: V3 = [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u, A[2]]
        const t: V3 = [D[0] + (C[0] - D[0]) * u, D[1] + (C[1] - D[1]) * u, D[2]]
        return [b[0] + (t[0] - b[0]) * v + off[0], b[1] + (t[1] - b[1]) * v + off[1], b[2] + (t[2] - b[2]) * v + off[2]]
      }
      const bays = Math.floor((L - 2) / 3.6), rows = Math.floor((H - 1.5) / 8.6)
      if (bays < 1 || rows < 1) continue
      for (let q = 0; q < bays; q++) {
        const uc = (1 + (q + 0.5) * ((L - 2) / bays)) / L, hw = 0.85 / L
        for (let w = 0; w < rows; w++) {
          const v0 = (1.2 + w * 8.6) / H, v1 = (1.2 + w * 8.6 + 6.2) / H
          win.quad(P(uc - hw, v0), P(uc + hw, v0), P(uc + hw, v1), P(uc - hw, v1))
        }
      }
    }
  }
}

/**
 * A brushed-steel (or painted) form: rings [z, rx, ry, dx, dy] lofted, so it
 * leans, bulges and tapers. With `crumple`, the ring is an irregular
 * polygon (a fixed per-corner jitter) that twists a little from level to
 * level, as Gehry's panelled steel volumes do; without it, a smooth ellipse.
 */
function blob(p: Part, cx: number, cy: number, rot: number, lv: Array<[number, number, number, number?, number?]>, n = 16, crumple = 0) {
  const seed = cx * 0.37 + cy * 0.11
  stack(p, lv.map(([z, rx, ry, dx = 0, dy = 0], k) => {
    const tw = rot + crumple * k * 0.12
    const ring = Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2, f = 1 + crumple * 0.16 * Math.sin(i * 2.7 + seed + k * 0.6)
      const x = rx * f * Math.cos(t), y = ry * f * Math.sin(t)
      return [cx + dx + x * Math.cos(tw) - y * Math.sin(tw), cy + dy + x * Math.sin(tw) + y * Math.cos(tw)] as XY
    })
    return { ring, z }
  }))
}

/** A pillow roof: a rounded mound over an ellipse, from z0 up by h. */
function pillow(p: Part, cx: number, cy: number, a: number, b: number, rot: number, z0: number, h: number) {
  const nu = 10, nv = 18
  const P = (i: number, j: number): V3 => {
    const r = i / nu, t = (j / nv) * Math.PI * 2
    const x = a * r * Math.cos(t), y = b * r * Math.sin(t)
    return [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot), z0 + h * Math.sqrt(Math.max(0, 1 - r ** 2.6))]
  }
  for (let i = 0; i < nu; i++)
    for (let j = 0; j < nv; j++) {
      const A = P(i, j), B = P(i + 1, j), C = P(i + 1, j + 1), D = P(i, j + 1)
      if (i === 0) p.tri(A, B, C)
      else p.quad(A, B, C, D)
    }
}

// ── The podium: brick walls; its roof the plaza and garage deck (grey) ──
wall(brick, OUTLINE, 0, POD)
capPoly(dark, OUTLINE, POD, true)

// ── The brick towers, each leaning and splaying as in the aerials ──
{
  const gs = rect(-46, -25, -41, -16) // Gates, south: leans south-west, splays at the top
  brickTower([{ ring: gs, z: POD }, { ring: xf(gs, -0.5, -0.7, 1.03), z: 28 }, { ring: xf(gs, -1.6, -2.0, 1.1), z: 40 }])
  brickTower([{ ring: rect(-44, -33, -33, -19), z: 39.5 }, { ring: xf(rect(-44, -33, -33, -19), -0.8, -0.6, 1.04), z: 43 }])
  const gw = rect(-72, -46, -14, 13) // Gates, west: leans west
  brickTower([{ ring: gw, z: POD }, { ring: xf(gw, -0.8, 0.3, 1.02), z: 24 }, { ring: xf(gw, -2.0, 0.8, 1.05), z: 36 }])
  const gwt = rect(-65, -50, -12, 0)
  brickTower([{ ring: xf(gwt, -1.8, 0.6), z: 35.5 }, { ring: xf(gwt, -2.6, 0.2, 1.05), z: 42 }])
  const de = rect(18, 38, 2, 30) // Dreyfoos, east: leans east and flares, a stepped top
  brickTower([{ ring: de, z: POD }, { ring: xf(de, 0.8, -0.4, 1.02), z: 22 }, { ring: xf(de, 2.0, -1.2, 1.08), z: 38 }])
  brickTower([{ ring: rect(24, 36, 8, 22), z: 37.5 }, { ring: xf(rect(24, 36, 8, 22), 2.6, -1.0, 1.05), z: 41 }])
  const dn = rect(-10, 16, 31, 46) // Dreyfoos, north: leans toward Vassar Street
  brickTower([{ ring: dn, z: POD }, { ring: xf(dn, 0.2, 0.7, 1.02), z: 26 }, { ring: xf(dn, 0.6, 1.8, 1.06), z: 41 }])
  box(brick, -22, -4, -49, -28, POD, 12, dark, 0.4) // the south block
  box(brick, -28, 14, -12, 12, POD, 13, dark, 0.4) // under the Student Street roof
}

// ── Brushed steel, between and above the brick towers ──
const R = (d: number) => (d * Math.PI) / 180
// Gates: the long bulging steel mass between the two brick blocks, and a bundle of leaning cylinders over it
blob(steel, -41, 1, R(5), [[POD, 5.6, 12.5], [20, 6.6, 13.4, 0.8, 0], [31, 6.2, 12.8, 1.6, 0.4], [36.5, 5.0, 11.4, 2.2, 0.6]], 7, 1)
blob(steel, -38, -6, 0, [[13, 4.6, 4.6], [30, 5.2, 5.2, 0.8, 0.4], [42, 4.2, 4.2, 2.0, 1.0]], 7, 1)
blob(steel, -32, 2, 0, [[13, 4.2, 4.2], [27, 4.8, 4.8, 1.0, 0], [39, 3.8, 3.8, 2.2, 0.6]], 7, 1)
blob(steel, -40, 9, 0, [[20, 4.4, 4.0], [30, 5.0, 4.4, -0.6, 0.8], [38, 4.0, 3.6, -1.4, 1.8]], 7, 1)
blob(steel, -24, -21, 0, [[POD, 5.0, 5.0], [20, 5.4, 5.4, 0.6, 0.3], [29, 4.4, 4.4, 1.6, 0.8]]) // the south-west drum
blob(steel, -31, 28, 0, [[0, 6.0, 6.0], [14, 6.5, 6.5, 0.6, -0.3], [23, 5.4, 5.4, 1.4, -0.8]]) // the north-west drum
// Dreyfoos: the tall steel tower that leans out over the street, and its neighbour
blob(steel, -5, 22, R(12), [[13, 6.6, 7.8], [24, 7.4, 8.4, -0.6, 0.8], [34, 7.6, 8.4, -1.4, 1.6], [43, 5.8, 6.8, -2.4, 2.6]], 7, 1)
blob(steel, 9, 23, R(-15), [[13, 5.8, 6.6], [26, 6.6, 7.2, 1.0, 0.2], [38, 5.0, 5.8, 2.4, 0.6]], 7, 1)
// the dark grey panelled block, leaning out of the Student Street roof
blob(dark, -20, -9, R(20), [[13, 6.0, 6.6], [22, 6.6, 7.0, 0.8, -0.5], [29, 5.2, 5.8, 1.8, -1.2]], 6, 1)
// the lecture halls' curved steel roof, and the flared steel funnel over it
pillow(steel, 10, -16, 13, 8, R(60), POD, 11)
revolve(steel, [14, -17], [[1.3, 12], [1.5, 17], [2.2, 23], [3.0, 27]], 12, 0, false, true)

// ── The yellow drum: a tapering, tilted cone with a sloped top ──
{
  const lv: Array<[number, number, number, number, number]> = [[13, 6.7, 6.7, 0, 0], [20, 6.5, 6.5, 0.5, -0.3], [25, 6.0, 6.0, 1.1, -0.6]]
  stack(yellow, lv.map(([z, rx, ry, dx, dy]) => ({ ring: ellipse(3 + dx, 9 + dy, rx, ry, 16), z })), null)
  // the top slopes down to the south-east
  const top = ellipse(4.6, 8.0, 5.4, 5.4, 16), base = ellipse(4.1, 8.4, 6.0, 6.0, 16)
  const zt = ([x, y]: XY) => 27.4 + (x - 4.6) * -0.12 + (y - 8.0) * 0.12
  for (let i = 0; i < 16; i++) {
    const j = (i + 1) % 16
    yellow.quad([base[i][0], base[i][1], 25], [base[j][0], base[j][1], 25], [top[j][0], top[j][1], zt(top[j])], [top[i][0], top[i][1], zt(top[i])])
  }
  for (let i = 1; i < 15; i++) yellow.tri([top[0][0], top[0][1], zt(top[0])], [top[i][0], top[i][1], zt(top[i])], [top[i + 1][0], top[i + 1][1], zt(top[i + 1])])
}

// ── The white curved form by Vassar Street: billowing out, then drawn in ──
blob(white, -19, 29, R(30), [[POD, 5.4, 7.4], [17, 6.8, 8.8, 1.0, -0.6], [25, 6.2, 8.0, 1.8, -1.2], [29, 4.4, 5.8, 2.2, -1.6]])

// ── The glazed rotunda at the north-east corner ──
revolve(win, [47, 40], [[6.5, POD], [6.5, 12]], 16, 0, true, false)
revolve(dark, [47, 40], [[6.8, 12], [6.8, 12.4], [0, 12.6]], 16, 0, true, false)

await save('bos-mit-stata-center', 'Ray and Maria Stata Center', [
  { part: brick, material: finish('stata-brick', 0xdba585) },
  { part: steel, material: finish('stata-steel', 0xc8cdd2, 0.45) },
  { part: dark, material: PALETTE.roof },
  { part: yellow, material: finish('stata-yellow', 0xe5c04a) },
  { part: white, material: finish('stata-white', 0xf1ede6) },
  { part: win, material: PALETTE.window },
], { height: 43, anchor: [42.361621, -71.090569], bearing: 0 }, 6500)
