/**
 * The Triangle Building and its clock tower, 210 West 47th Street, Country
 * Club Plaza, Kansas City, Missouri. Edward Buehler Delk, 1923, one of the
 * Plaza's first buildings: a one-storey shop block on a triangular lot,
 * its west tip carrying a square tower with a clock under a red cornice and
 * corner pinnacles, a brick upper stage and a yellow tiled dome.
 *
 * Frame: bearing 2.4 (the 47th Street front), +x east, +y north, z up,
 * metres. Origin at the outline's centroid, -94.589785 39.042594. z = 0 is
 * the lowest ground under the footprint, the south-east corner: 47th Street
 * falls ~2.4 m from the tower to there and the lot rises ~3-5 m to the
 * north (Mapterhorn grid, GROUND below). The tower is built from its own
 * foot and lifted 2.4 m onto the street; each shop bay sits at the street
 * in front of it; the walls run down to z = 0 and sink into the slope.
 *
 * What it covers: way/113102968 "Triangle Building" (building=retail, 1923,
 * Delk), the whole outline, tower included (OSM maps the tower as part of
 * the one building, and the block's pinnacled parapet is part of the
 * tower's look).
 *
 * Sources
 * - OSM (c) OpenStreetMap contributors: way/113102968.
 * - USGS 3DEP lidar MO_FEMANRCS_1_2020 (flown 2020), 0.5 m grid centred on
 *   the tower (work/kc-plaza-triangle-tower/lidar.json): tower 5.5 m
 *   square; clock-stage cornice and pinnacles 8.5-9.3 (z 7.3), upper stage
 *   cornice 13.2 (z 11.7), dome 15.7 (z 14.2); the block's roof 6.0 (z 4.5)
 *   and parapet 7.4 (z 5.9).
 * Photos (evidence, Wikimedia Commons):
 * - "Kansas City, Missouri - Country Club Plaza, Clock Tower -
 *   panoramio.jpg", MARELBU, CC BY 3.0 (from the south-west, with the block
 *   along 47th Street): https://commons.wikimedia.org/wiki/File:Kansas_City,_Missouri_-_Country_Club_Plaza,_Clock_Tower_-_panoramio.jpg
 * - "Country Club Plaza, KC MO - misc tower 2.JPG", public domain (from the
 *   west): https://commons.wikimedia.org/wiki/File:Country_Club_Plaza,_KC_MO_-_misc_tower_2.JPG
 *
 * Numbers for the tower (z above the street at its foot; +2.4 in the frame)
 * - Tower 5.8 m square at the base (lidar 5.5 at the cornice line, the
 *   corner piers bulge), clock-stage cornice 7.3, upper stage 4.0 m with
 *   chamfered corners to 11.2, cornice 11.7, dome to 14.2 (measured);
 *   finial and ship vane to 16.4 (photo-scaled from the panoramio view,
 *   42.7 px/m against the lidar cornice, estimated).
 * - Ground-stage arches, clock (1.8 m across, centre 6.0), pinnacles
 *   (to 9.2), the tile frieze: photo-scaled (estimated).
 * - Block (z above the SE corner; the lidar box lidarB.json has its
 *   ground_min within 0.05 m of that corner, so its heights read directly):
 *   flat roofs 6.3 on the south half and 7.9 on the north half (lidar
 *   6.0-6.7 and 7.9, measured); parapet 8.3 along the 47th Street front
 *   (lidar 8.2-8.5, measured), 8.6 on the north; red tile coping, small
 *   pinnacles every ~9 m (photo; the north and east sides have no photo,
 *   drawn the same). Next to the tower the parapet stands 5.9 m over the
 *   street, the dome 14.2 m: 2.4x, as in the photos.
 * - Shop bays of 4.5 m: dark glazing under a dark awning band (photo).
 * Colours from the daylight photos: tan brick tower and block walls,
 * cream cast stone (arch frames, clock rings, pinnacles), the red-brown cornices, the yellow dome.
 *
 * Simplified / doubts
 * - The dome's tile pattern (a quatrefoil medallion on each face) and the
 *   checker tile bands are drawn as plain yellow and a plain blue-grey
 *   frieze; the twisted columns between the ground arches are plain posts.
 * - Signs, the twisted columns and the shopfront detail are left out.
 * - Night: the tower is floodlit. Shop glass, openings and clock faces share
 *   one dark blue-grey material (six-material cap), so none of them glows.
 * - At 80 px the 62 m block's roof dominates and the 6 m tower is small;
 *   that is its true scale.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { pslab, ccw, poffset, type XY as XY2 } from './dc-nga-west'
import {
  squareFaces, facePoly, faceSlab, archPoly, rectPoly, ngon, ringPrism, ngonFaces, cbox, rect, lathe, saveModel,
  PLAZA_CREAM, towerFlood, type XY,
} from './kc-plaza-giralda-tower'

const BRICK = finish('triangle-brick', 0xc8a27c)
const RED = finish('triangle-cornice', 0xa9604c)
const YELLOW = finish('triangle-dome', 0xe0b443)
/** Shop glass, awnings, the tower's openings and the clock faces: a dark blue-grey that reads dark at 200 px. */
const DARK = finish('triangle-dark', 0x525a64)

const BEARING = 2.4
/** OSM way/113102968, lon/lat offsets in metres from the tower lidar centre, then into this frame. */
const RAW: XY[] = [
  [54.9, -5.9], [-2.2, -3.6], [-3.5, 1.1], [1.2, 3.9], [11.9, 10.4], [21.2, 18.0], [31.9, 29.9],
  [39.8, 39.0], [44.2, 48.4], [50.2, 47.2], [58.7, -2.4],
]
const C0: XY = [28.0, 16.9]
const toFrame = ([x, y]: XY): XY => {
  const a = (BEARING * Math.PI) / 180, dx = x - C0[0], dy = y - C0[1]
  return [dx * Math.cos(a) - dy * Math.sin(a), dx * Math.sin(a) + dy * Math.cos(a)]
}
const OUTLINE = RAW.map(toFrame)
/** The part of a polygon on the side n.(p - p0) >= 0. */
function clipHalf(poly: XY2[], p0: XY2, n: XY2): XY2[] {
  const f = (p: XY2) => n[0] * (p[0] - p0[0]) + n[1] * (p[1] - p0[1])
  const out: XY2[] = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], fa = f(a), fb = f(b)
    if (fa >= 0) out.push(a)
    if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]) }
  }
  return out
}
/**
 * The map's ground (Mapterhorn z15, `terrain.ts grid`, 5 m step) in this
 * frame, metres above the lowest point under the footprint (the south-east
 * corner): 47th Street falls ~2.4 m from the tower east to the corner, and
 * the lot rises ~3 m to the north. Rows from y = +35 down to -35.
 */
const GROUND = [
  [5.8, 5.9, 6.1, 6.0, 5.5, 5.3, 5.0, 4.5, 4.5, 4.4, 4.2, 3.8, 3.4, 3.1, 2.9],
  [5.3, 5.3, 5.4, 5.5, 5.0, 4.7, 4.4, 4.3, 4.3, 4.3, 4.1, 3.7, 3.2, 2.9, 2.6],
  [5.0, 4.8, 4.9, 5.0, 4.5, 4.2, 4.1, 4.2, 4.2, 4.1, 3.8, 3.4, 2.9, 2.6, 2.3],
  [4.7, 4.5, 4.3, 4.4, 4.1, 4.0, 4.0, 4.1, 3.9, 3.9, 3.5, 3.1, 2.6, 2.3, 2.0],
  [4.3, 4.2, 4.0, 3.9, 3.8, 3.8, 3.8, 3.9, 3.9, 3.5, 3.1, 2.8, 2.4, 1.9, 1.7],
  [3.9, 3.8, 3.7, 3.6, 3.5, 3.6, 3.7, 3.8, 3.6, 3.2, 2.9, 2.4, 2.1, 1.7, 1.4],
  [3.6, 3.4, 3.4, 3.4, 3.5, 3.5, 3.5, 3.6, 3.3, 2.9, 2.5, 2.1, 1.8, 1.4, 1.1],
  [3.2, 3.2, 3.2, 3.2, 3.3, 3.4, 3.3, 3.1, 3.0, 2.6, 2.3, 1.9, 1.5, 1.1, 0.9],
  [2.9, 3.0, 3.1, 3.1, 3.3, 3.1, 2.9, 2.7, 2.6, 2.3, 1.9, 1.6, 1.2, 0.9, 0.6],
  [2.8, 2.9, 3.0, 3.1, 3.0, 2.7, 2.5, 2.3, 2.2, 1.9, 1.6, 1.3, 0.9, 0.7, 0.4],
  [2.7, 2.8, 3.0, 2.8, 2.6, 2.3, 2.1, 2.0, 1.8, 1.6, 1.2, 0.9, 0.7, 0.5, 0.3],
  [2.6, 2.5, 2.4, 2.3, 2.1, 1.9, 1.6, 1.5, 1.4, 1.2, 0.9, 0.7, 0.6, 0.4, 0.2],
  [2.1, 2.0, 1.9, 1.8, 1.6, 1.4, 1.3, 1.1, 1.0, 0.9, 0.7, 0.5, 0.3, 0.2, 0.0],
  [1.7, 1.5, 1.4, 1.3, 1.1, 1.0, 0.9, 0.8, 0.7, 0.5, 0.4, 0.3, 0.1, 0.0, 0.0],
  [1.4, 1.3, 1.2, 1.1, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.1],
]
function ground(x: number, y: number): number {
  const c = Math.min(13.999, Math.max(0, (x + 35) / 5)), r = Math.min(13.999, Math.max(0, (35 - y) / 5))
  const c0 = Math.floor(c), r0 = Math.floor(r), fc = c - c0, fr = r - r0
  const g = (i: number, j: number) => GROUND[i][j]
  return (g(r0, c0) * (1 - fc) + g(r0, c0 + 1) * fc) * (1 - fr) + (g(r0 + 1, c0) * (1 - fc) + g(r0 + 1, c0 + 1) * fc) * fr
}
/** Raise everything a part gained since `from` (a pos length) by dz. */
function lift(p: Part, from: number, dz: number) {
  for (let i = from; i < p.pos.length; i += 3) p.pos[i + 1] += dz // glTF y is up
}
/** The tower's centre (lidar). */
const T = toFrame([-0.3, -0.5])

function build() {
  const brick = new Part(), cream = new Part(), red = new Part(), yellow = new Part(), dark = new Part(), roofP = new Part()

  // ---- the shop block: tan brick walls, flat roofs in two levels (the lot
  // rises ~2 m to the north), a parapet with red tile coping and small
  // pinnacles, shop windows under a dark awning band
  const BL = ccw(OUTLINE as XY2[])
  const ROOF_S = 6.3, ROOF_N = 7.9, PAR = 8.3, SPLIT = -4
  pslab(brick, BL, 0, ROOF_S, 0, roofP)
  const north = ccw(clipHalf(BL, [0, SPLIT], [0, 1]))
  pslab(brick, poffset(north, -0.4), ROOF_S, ROOF_N, 0, roofP)
  for (let i = 0; i < BL.length; i++) {
    const a = BL[i], b = BL[(i + 1) % BL.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
    const nx = -uy, ny = ux // inward for a counter-clockwise ring
    const top = Math.max(a[1], b[1]) > SPLIT + 6 ? ROOF_N + 0.7 : PAR
    // parapet wall on the outline, and the red tile coping on it
    pslab(brick, [a, b, [b[0] + nx * 0.3, b[1] + ny * 0.3], [a[0] + nx * 0.3, a[1] + ny * 0.3]], ROOF_S - 0.1, top - 0.3, 0, false)
    pslab(red, [[a[0] - nx * 0.15, a[1] - ny * 0.15], [b[0] - nx * 0.15, b[1] - ny * 0.15], [b[0] + nx * 0.45, b[1] + ny * 0.45], [a[0] + nx * 0.45, a[1] + ny * 0.45]], top - 0.3, top, 0.12, true, true)
    if (L < 6) continue
    // shop bays ~4.5 m: glazing, an awning band over it, brick piers between
    const n = Math.max(1, Math.floor((L - 2) / 4.5))
    const P = (t: number, d: number): XY2 => [a[0] + ux * t - nx * d, a[1] + uy * t - ny * d]
    for (let k = 0; k < n; k++) {
      const t0 = (L - n * 4.5) / 2 + k * 4.5 + 0.6, t1 = t0 + 3.3
      const p0 = P(t0, 0.04), p1 = P(t1, 0.04)
      // each bay at the street's height in front of it
      const gz = Math.max(ground(p0[0], p0[1]), ground(p1[0], p1[1]))
      if (gz + 3.2 > top - 0.4) continue
      dark.quad([p0[0], p0[1], gz + 0.3], [p1[0], p1[1], gz + 0.3], [p1[0], p1[1], gz + 2.5], [p0[0], p0[1], gz + 2.5])
      pslab(dark, [P(t0 - 0.1, 0), P(t1 + 0.1, 0), P(t1 + 0.1, 0.7), P(t0 - 0.1, 0.7)], gz + 2.5, gz + 3.0, 0, true, true)
    }
    // small pinnacles on the parapet, every ~9 m
    const m = Math.max(1, Math.round(L / 9))
    for (let k = 0; k <= m; k++) {
      const t = (k * L) / m, q = P(t, -0.15)
      lathe(cream, q[0], q[1], [[0.28, top], [0.28, top + 0.4], [0.18, top + 0.5], [0.12, top + 1.4], [0.01, top + 1.8]], 4, false)
    }
  }

  // ---- the tower, square to the frame, built from its own foot and lifted onto the street
  const marks = [brick, cream, red, yellow, dark].map((q) => q.pos.length)
  const [tx, ty] = T
  const H1 = 2.9 // half-width of the ground and clock stages
  cbox(brick, rect(tx - H1 + 0.2, tx + H1 - 0.2, ty - H1 + 0.2, ty + H1 - 0.2), 0, 7.0, { top: false })
  // brick corner piers, the full height of the lower stages
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x = tx + sx * (H1 - 0.55), y = ty + sy * (H1 - 0.55)
    cbox(brick, rect(x - 0.55, x + 0.55, y - 0.55, y + 0.55), 0, 6.9, { c: 0.1, top: false })
  }
  for (const F of squareFaces(H1 - 0.2, tx, ty)) {
    // two tall arched openings with a post between them
    for (const du of [-0.9, 0.9]) {
      faceSlab(cream, F, archPoly(du, 1.6, 0.3, 3.75, 8), 0, 0.06)
      facePoly(dark, F, archPoly(du, 1.3, 0.4, 3.75, 8), 0.08)
    }
    faceSlab(cream, F, rectPoly(-0.13, 0.13, 0.3, 4.4), 0, 0.12)
    // the clock in a red ring, and a tile band either side
    facePoly(cream, F, ngon(0, 6.0, 1.12, 16), 0.06)
    facePoly(dark, F, ngon(0, 6.0, 0.86, 16), 0.09)
    facePoly(cream, F, rectPoly(-0.06, 0.06, 6.0, 6.6), 0.11)
    facePoly(cream, F, rectPoly(0, 0.45, 5.94, 6.06), 0.11)
    for (const s of [-1, 1]) facePoly(cream, F, rectPoly(s * 1.4, s * 2.0, 5.45, 6.05), 0.04)
  }
  // red cornice over the clock stage
  cbox(red, rect(tx - H1 - 0.3, tx + H1 + 0.3, ty - H1 - 0.3, ty + H1 + 0.3), 6.9, 7.4, { b: 0.15, bottom: true, top: red })
  // corner pinnacles
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x = tx + sx * (H1 - 0.35), y = ty + sy * (H1 - 0.35)
    cbox(cream, rect(x - 0.35, x + 0.35, y - 0.35, y + 0.35), 7.4, 7.9, { top: cream })
    lathe(cream, x, y, [[0.3, 7.9], [0.2, 8.0], [0.16, 8.9], [0.01, 9.3]], 6, false)
  }
  // ---- upper stage: brick, chamfered square, an arched window a face in a cream frame
  const R2 = 2.15 // corner radius of the chamfered square (8-gon with long and short sides)
  const oct = ngon(tx, ty, R2, 8, Math.PI / 8)
  ringPrism(brick, oct, 7.4, 10.6, false)
  ngonFaces(tx, ty, R2, 8, Math.PI / 8).forEach(({ F }, i) => {
    if (i % 2 === 0) {
      faceSlab(cream, F, archPoly(0, 1.3, 7.9, 9.4, 8), 0, 0.06)
      facePoly(dark, F, archPoly(0, 0.9, 8.1, 9.4, 8), 0.08)
    }
  })
  // tile frieze and the red cornice with the dome's drum
  ringPrism(cream, ngon(tx, ty, R2 + 0.02, 8, Math.PI / 8), 10.6, 11.2, false)
  ringPrism(red, ngon(tx, ty, R2 + 0.12, 8, Math.PI / 8), 10.45, 10.65, red)
  ringPrism(red, ngon(tx, ty, R2 + 0.4, 8, Math.PI / 8), 11.2, 11.7, red)
  // ---- the yellow dome, with red ribs, a cream lantern and the vane
  const prof: [number, number][] = [[1.85, 11.7], [1.85, 12.1], [1.78, 12.7], [1.55, 13.3], [1.15, 13.8], [0.55, 14.15], [0.01, 14.25]]
  lathe(yellow, tx, ty, prof, 16, false)
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4 + Math.PI / 8
    for (let i = 0; i < prof.length - 2; i++) {
      const [r0, z0] = prof[i], [r1, z1] = prof[i + 1]
      const p0: V3 = [tx + (r0 + 0.04) * Math.cos(a), ty + (r0 + 0.04) * Math.sin(a), z0], p1: V3 = [tx + (r1 + 0.04) * Math.cos(a), ty + (r1 + 0.04) * Math.sin(a), z1]
      const ox = -Math.sin(a) * 0.09, oy = Math.cos(a) * 0.09
      red.quad([p0[0] - ox, p0[1] - oy, p0[2]], [p0[0] + ox, p0[1] + oy, p0[2]], [p1[0] + ox, p1[1] + oy, p1[2]], [p1[0] - ox, p1[1] - oy, p1[2]])
    }
  }
  lathe(cream, tx, ty, [[0.35, 14.1], [0.4, 14.5], [0.22, 14.7], [0.3, 15.0], [0.01, 15.2]], 8, false)
  lathe(red, tx, ty, [[0.14, 15.15], [0.1, 15.5], [0.01, 16.4]], 6, false)
  cbox(red, rect(tx - 0.4, tx + 0.4, ty - 0.04, ty + 0.04), 15.7, 15.85, { top: true })

  const TZ = ground(T[0], T[1])
  ;[brick, cream, red, yellow, dark].forEach((q, i) => lift(q, marks[i], TZ))
  const lit = towerFlood(14.5 + TZ)
  const litTower = (p: V3, n: V3) => (Math.hypot(p[0] - tx, p[1] - ty) < 4.5 ? lit(p, n) : 0.15)
  return [
    { part: brick, material: { ...BRICK, floodlight: litTower } },
    { part: cream, material: { ...PLAZA_CREAM, floodlight: litTower } },
    { part: red, material: { ...RED, floodlight: litTower } },
    { part: yellow, material: { ...YELLOW, floodlight: litTower } },
    { part: dark, material: DARK },
    { part: roofP, material: PALETTE.roof },
  ]
}

if (import.meta.main) await saveModel('kc-plaza-triangle-tower', 'Triangle Building Clock Tower', build())
