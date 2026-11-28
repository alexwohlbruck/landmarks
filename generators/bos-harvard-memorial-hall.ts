/**
 * Memorial Hall, Harvard University, 45 Quincy Street, Cambridge (1870–1878,
 * Ware & Van Brunt; tower rebuilt 1996–1999) — original procedural geometry,
 * CC0-1.0.
 * bun generators/bos-harvard-memorial-hall.ts
 *
 * This file also holds the few helpers the other B6 Harvard models import
 * (bos-widener-library, bos-harvard-memorial-church, bos-harvard-stadium):
 * an auto-wound flat polygon, a pointed-arch outline, banded gable and
 * frustum roofs. Memorial Hall's own build runs only when this file is run
 * directly.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 9: x runs along the nave (Annenberg Hall) at 99°,
 * west gable at -x, Sanders Theatre's apse at +x (Quincy Street); +y is the
 * north side (Kirkland Street), -y the south (Cambridge Street).
 * Anchor = the centroid of OSM way/29530473, -71.1150882, 42.3759776.
 *
 * Identity (from the photos below):
 *  1. The tall central tower: a square red-brick shaft, a belfry of pointed
 *     arches under a stone corbel cornice, slim corner pinnacles, and a
 *     steep truncated slate roof in coloured bands with a dormer on each
 *     face, iron cresting and four vanes on its flat top.
 *  2. The long, very steep nave roof (Annenberg Hall) in broad horizontal
 *     stripes of blue-grey, buff and red slate, over buttressed brick walls
 *     with tall pointed two-light windows.
 *  3. The transept ends (north and south): a gable with a great rose window
 *     in a pointed stone arch over a row of lancets and a porch, flanked by
 *     two square towers with steep banded spires.
 *  4. Sanders Theatre at the east end: a polygonal apse with gabled wall
 *     dormers and a steep banded polygonal roof, flat on top with cresting.
 *  5. Polychrome: red brick with buff sandstone bands, sills and copings.
 *
 * Plan: OSM. The outline way/29530473 holds the whole building, including a
 * low north annex (x -34..4, y 5.5..15.6) and a low block to its north-west
 * (the curved lobe, y 15.6..34.6); the Annenberg part way/842255489 is the
 * nave with its annex; the tower part way/1334154153 sits 2 m north of the
 * lidar's tower, which is drawn where the lidar has it (x 10.5..22.5,
 * y -11..1). The nave walls (y -15.5..5.5), the transept (x 4..28.3,
 * y -22.7..13.7) and Sanders' polygon (radius about 16 m about
 * (33.5, -4.8)) follow the OSM outline and the lidar roofs.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021), 1 m and 0.5 m
 * grids read with tools/lidar_frame.py, above the street round the building
 * (7.9 m; sparse returns, so the fine detail is gap-filled and only peaks and
 * broad planes are trusted). Measured: nave eaves 12.9, ridge 25.4; north
 * annex 7.4; Sanders eaves 12.9, flat top 26.8; transept roof eaves 26.8,
 * ridge 33.7; the end gables' ridge 25.0; the tower cornice 42.0, its roof's
 * flat top 57.6 and the vanes 63.7; the corner spires 31.4 at the
 * highest return; their tips are put at 32.2, the cross finials at 33.6
 * (estimated: a steep spire's last metre falls between the returns). Published: a
 * 1907 source gives 305 × 113 ft and 190 ft (57.9 m) at the tower, a 2012
 * one 195 ft (59.4 m; OSM's height tag on the tower) (Wikipedia, "Memorial
 * Hall (Harvard University)"). The lidar's 57.6 m roof top and 63.7 m vanes
 * agree with them.
 *
 * Estimated from the photos (scaled from the lidar's gable and tower):
 * window heads and sills, the rose window (centre 15.8, 3.4 m radius) and
 * its arch, the lancets, the porch, the belfry arcade (35–40), the
 * pinnacles, the roof dormers, the stripe pattern of the slate.
 *
 * No clock: Wikipedia (citing Harvard Magazine, 1999) says the tower was
 * rebuilt to its 1877–1897 appearance, before the four-faced clock of 1897;
 * the photos show none.
 *
 * Ground: the street is about 2.0 m above the model's y = 0, which the map
 * takes from the dip at the west end (the Loker Commons stair well,
 * Mapterhorn); the walls run down to 0 and the doors stand at the street.
 * elevation 0.
 *
 * Night: the windows glow (the transept's rose windows are lit from
 * within); the tower is floodlit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - USA-Harvard Memorial Hall0.jpg, Ingfbruno, CC BY-SA 3.0 (the south
 *    transept front close up: rose, inscription, spires, roof bands)
 *    https://commons.wikimedia.org/wiki/File:USA-Harvard_Memorial_Hall0.jpg
 *  - Harvard University Memorial Hall far.jpg, Ryan Pflaum, CC BY-SA 4.0
 *    (from the south-east, Quincy and Cambridge Streets: Sanders, tower)
 *    https://commons.wikimedia.org/wiki/File:Harvard_University_Memorial_Hall_far.jpg
 *  - Memorial Hall (Harvard University) - Akash Puthraya.jpg, Akashputhraya,
 *    CC BY-SA 4.0 (the south side square on)
 *    https://commons.wikimedia.org/wiki/File:Memorial_Hall_(Harvard_University)_-_Akash_Puthraya.jpg
 *  - Memorial Hall, Harvard University backside.jpg, Ario Barzan,
 *    CC BY-SA 4.0 (the north transept and Sanders from the north-east)
 *    https://commons.wikimedia.org/wiki/File:Memorial_Hall,_Harvard_University_backside.jpg
 *  - Memorial Hall at Harvard University.JPG, Pknelson, CC BY-SA 3.0 (from
 *    the south-west: the west gable, the nave and its porch, the tower)
 *    https://commons.wikimedia.org/wiki/File:Memorial_Hall_at_Harvard_University.JPG
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the north side of the nave and the west end are seen only
 * obliquely; the north annex and the curved north-west block are drawn as
 * plain low brick blocks from OSM and the lidar (no photo). The nave's bay
 * count (nine) is read from the Pknelson photo. The diaper brickwork,
 * gargoyles, the porches' carving and the slate's zigzags are left out (the
 * zigzag bands are drawn as plain red stripes).
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { onWall, rectShape, revolve, type XY } from './atl-tech-tower'
import { box, capPoly, ccw, cornice, prism, save } from './atl-flatiron-building'

// ─────────────────────────────────── kit ───────────────────────────────────

/** A flat polygon, wound to face `out`. */
export function poly(p: Part, pts: V3[], out: V3) {
  const n = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const q = n[0] * out[0] + n[1] * out[1] + n[2] * out[2] < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}

/** A pointed (equilateral) arch outline: width w centred at s, from z0, springing at zs. */
export function pointed(s: number, w: number, z0: number, zs: number, seg = 5, k = 1): [number, number][] {
  const r = w * k, pts: [number, number][] = [[s - w / 2, z0], [s + w / 2, z0]]
  const a1 = Math.acos((r - w / 2) / r) // the arc from the right springer up to the apex
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * a1
    pts.push([s + w / 2 - r + r * Math.cos(a), zs + r * Math.sin(a)])
  }
  for (let i = seg - 1; i >= 0; i--) {
    const a = (i / seg) * a1
    pts.push([s - w / 2 + r - r * Math.cos(a), zs + r * Math.sin(a)])
  }
  return pts
}

/** The apex height of `pointed(s, w, ·, zs, ·, k)`. */
export const pointedApex = (w: number, zs: number, k = 1) => zs + Math.sqrt((w * k) ** 2 - (w * k - w / 2) ** 2)

/** Roof stripes: [fraction of the slope where the band ends, part], bottom up. */
export type Bands = [number, Part][]

/**
 * A gable roof with horizontal stripes. Ridge along `axis` at z1, eaves at
 * z0, `over` past the walls at the eaves and `rake` past the gable ends.
 * The gable triangles go in `gable` when given.
 */
export function gableBanded(bands: Bands, gable: Part | null, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, axis: 'x' | 'y', over = 0.4, rake = 0.3) {
  const along = axis === 'x'
  // u runs along the ridge, v across it.
  const u0 = (along ? x0 : y0) - rake, u1 = (along ? x1 : y1) + rake
  const v0 = along ? y0 : x0, v1 = along ? y1 : x1, vm = (v0 + v1) / 2
  const s = (z1 - z0) / ((v1 - v0) / 2), lo = z0 - over * s
  const P = (u: number, v: number, z: number): V3 => (along ? [u, v, z] : [v, u, z])
  const soff = 0.3
  for (const side of [-1, 1]) {
    const ve = side < 0 ? v0 - over : v1 + over
    let t0 = 0
    for (const [t1, part] of bands) {
      const va = ve + (vm - ve) * t0, vb = ve + (vm - ve) * t1
      const za = lo + (z1 - lo) * t0, zb = lo + (z1 - lo) * t1
      const out: V3 = along ? [0, side, 1] : [side, 0, 1]
      poly(part, [P(u0, va, za), P(u1, va, za), P(u1, vb, zb), P(u0, vb, zb)], out)
      t0 = t1
    }
    // the eave's edge and soffit
    const p0 = bands[0][1]
    poly(p0, [P(u0, ve, lo), P(u1, ve, lo), P(u1, ve, lo - soff), P(u0, ve, lo - soff)], along ? [0, side, 0] : [side, 0, 0])
    poly(p0, [P(u0, ve, lo - soff), P(u1, ve, lo - soff), P(u1, vm, z1 - soff), P(u0, vm, z1 - soff)], [0, 0, -1])
  }
  // the roof's thickness along the rakes
  for (const [u, sgn] of [[u0, -1], [u1, 1]] as [number, number][]) {
    for (const side of [-1, 1]) {
      const ve = side < 0 ? v0 - over : v1 + over
      poly(bands[0][1], [P(u, ve, lo), P(u, vm, z1), P(u, vm, z1 - soff), P(u, ve, lo - soff)], along ? [sgn, 0, 0] : [0, sgn, 0])
    }
  }
  if (gable) {
    for (const [u, sgn] of [[along ? x0 : y0, -1], [along ? x1 : y1, 1]] as [number, number][])
      poly(gable, [P(u, v0, z0), P(u, v1, z0), P(u, vm, z1 - 0.05)], along ? [sgn, 0, 0] : [0, sgn, 0])
  }
}

/**
 * A banded frustum between two counter-clockwise rings of the same count
 * (the eave ring at z0 and the top ring at z1); the top is capped flat in
 * `top`, or brought to a point when the top ring is a single repeated point.
 */
export function frustumBanded(bands: Bands, lower: XY[], upper: XY[], z0: number, z1: number, top: Part | null) {
  const ring = (t: number): V3[] => lower.map((a, i) => [a[0] + (upper[i][0] - a[0]) * t, a[1] + (upper[i][1] - a[1]) * t, z0 + (z1 - z0) * t])
  let t0 = 0
  for (const [t1, part] of bands) {
    const A = ring(t0), B = ring(t1), n = A.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const deg = Math.hypot(B[i][0] - B[j][0], B[i][1] - B[j][1]) < 1e-6
      if (deg) part.tri(A[i], A[j], B[i])
      else part.quad(A[i], A[j], B[j], B[i])
    }
    t0 = t1
  }
  if (top) capPoly(top, upper, z1, true)
  // the eave's underside
  capPoly(bands[0][1], lower, z0, false)
}

/** A square ring of half-size h about c. */
export const sq = (c: XY, h: number, hy = h): XY[] => [[c[0] - h, c[1] - hy], [c[0] + h, c[1] - hy], [c[0] + h, c[1] + hy], [c[0] - h, c[1] + hy]]

// ─────────────────────────────── Memorial Hall ─────────────────────────────

if (import.meta.main) {
  const brick = new Part(), stone = new Part(), slate = new Part(), win = new Part(), metal = new Part(), door = new Part()
  const red = brick, buff = metal // lead review: sandstone-coloured roof bands read far louder than the real dark slate bands; dark iron grey is closer
  const G = 2.0 // the street round the building, above the model's y = 0
  const h = (z: number) => G + z

  // The slate's stripes, bottom up (Pknelson, Akash Puthraya photos).
  const STRIPES: Bands = [[0.13, slate], [0.19, red], [0.34, buff], [0.45, slate], [0.52, red], [0.66, buff], [0.71, red], [1, slate]]
  const SPIRE: Bands = [[0.16, slate], [0.24, red], [0.38, buff], [0.48, slate], [0.56, red], [0.7, buff], [0.78, slate], [0.85, red], [1, slate]]

  type F = [XY, XY]
  const pointedWin = (f: F, s: number, w: number, z0: number, zs: number, frame = 0.3, mull = 0) => {
    const seg = w < 1.2 ? 2 : w < 3 ? 3 : 5
    onWall(stone, f[0], f[1], pointed(s, w + frame, z0 - frame / 2, zs, seg), 0.03)
    onWall(win, f[0], f[1], pointed(s, w, z0, zs, seg), 0.06)
    if (mull) for (let k = 1; k <= mull; k++) {
      const x = s - w / 2 + (k * w) / (mull + 1)
      onWall(stone, f[0], f[1], rectShape(x - 0.09, x + 0.09, z0, zs + 0.2), 0.09)
    }
  }
  const wallLen = (f: F) => Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])

  // ── Nave (Annenberg Hall) ──
  const NX0 = -45, NX1 = 10.5, NY0 = -15.5, NY1 = 5.5, NE = h(12.9), NR = h(25.4)
  box(brick, NX0, NX1, NY0, NY1, 0, NE, null, 0)
  cornice(stone, ccw([[NX0, NY0], [NX1, NY0], [NX1, NY1], [NX0, NY1]]), NE - 0.7, 0.7, 0.35, null)
  cornice(stone, ccw([[NX0, NY0], [NX1, NY0], [NX1, NY1], [NX0, NY1]]), h(3.6), 0.35, 0.15, null) // the sill course
  gableBanded(STRIPES, brick, NX0, NX1, NY0, NY1, NE, NR, 'x', 0.6, 0.35)
  // the west gable's stone coping
  for (const side of [-1, 1]) {
    const yE = side < 0 ? NY0 - 0.6 : NY1 + 0.6, ym = (NY0 + NY1) / 2
    const s = (NR - NE) / ((NY1 - NY0) / 2), lo = NE - 0.6 * s
    const sec = (y: number, z: number): V3[] => [[NX0 - 0.45, y, z + 0.3], [NX0 + 0.25, y, z + 0.3], [NX0 + 0.25, y, z - 0.2], [NX0 - 0.45, y, z - 0.2]]
    stone.sweep([sec(yE, lo), sec(ym, NR)])
  }
  revolve(metal, [NX0 - 0.1, (NY0 + NY1) / 2], [[0.25, NR], [0.25, NR + 0.6], [0.08, NR + 0.8], [0.08, NR + 2.4], [0, NR + 2.6]], 6, 0, true, false)
  // Bays: nine pointed two-light windows a side between buttresses.
  const SOUTH: F = [[NX0, NY0], [NX1, NY0]], NORTH: F = [[NX1, NY1], [NX0, NY1]]
  const bays = Array.from({ length: 8 }, (_, k) => -33.5 + k * 4.75) // from the porch to the transept
  for (const x of bays) {
    pointedWin(SOUTH, x - NX0, 3.0, h(4.8), h(9.2), 0.35, 1)
    // north side: above the low annex only
    pointedWin(NORTH, NX1 - x, 2.5, h(8.4), h(9.9), 0.35, 1)
  }
  for (const x of [...bays.map((b) => b - 2.375), bays[bays.length - 1] + 2.375]) {
    box(brick, x - 0.45, x + 0.45, NY0 - 0.85, NY0, 0, h(11.2), stone, 0.3)
  }
  // West gable: a great traceried window over a low arcade.
  const WEST: F = [[NX0, NY1], [NX0, NY0]]
  pointedWin(WEST, 10.5, 6.4, h(6.4), h(13.0), 0.5, 3)
  onWall(stone, WEST[0], WEST[1], rectShape(0.5, 20.5, h(5.6), h(6.0)), 0.05)
  for (let k = 0; k < 6; k++) pointedWin(WEST, 3.0 + k * 3.0, 1.6, h(1.4), h(4.0), 0.25)
  onWall(stone, WEST[0], WEST[1], pointed(10.5, 1.3, h(21.0), h(21.6), 4), 0.05) // the gable's little window
  // The low gabled porches at the west end, north and south.
  for (const [y0, y1, dir] of [[-18.5, NY0, -1], [NY1, 10.8, 1]] as [number, number, number][]) {
    box(brick, -44.8, -38.4, y0, y1, 0, h(6.2), null, 0)
    gableBanded([[0.4, slate], [0.55, red], [1, slate]], brick, -44.8, -38.4, y0, y1 + (dir < 0 ? 1 : -1), h(6.2), h(9.6), 'y', 0.3, 0.3)
    const face: F = dir < 0 ? [[-44.8, y0], [-38.4, y0]] : [[-38.4, y1], [-44.8, y1]]
    onWall(stone, face[0], face[1], pointed(3.2, 2.6, G, h(2.6)), 0.03)
    onWall(door, face[0], face[1], pointed(3.2, 2.0, G, h(2.6)), 0.06)
  }

  // ── North annex and the north-west block (plain, from OSM and lidar) ──
  box(brick, -34.2, 0.6, NY1, 15.6, 0, h(7.4), slate, 0.3)
  box(brick, 0.6, 4.1, NY1, 12.2, 0, h(7.4), slate, 0.3)
  cornice(stone, ccw([[-34.2, NY1], [0.6, NY1], [0.6, 15.6], [-34.2, 15.6]]), h(6.9), 0.5, 0.25, null)
  for (let k = 0; k < 7; k++) {
    const s = 2.5 + k * 5
    onWall(win, [0.6, 15.6], [-34.2, 15.6], rectShape(s - 0.8, s + 0.8, h(1.6), h(5.2)), 0.05)
  }
  const NW = ccw([[-34.2, 15.6], [-13.8, 15.6], [-13.6, 24.1], [-10.4, 24.1], [-14.5, 34.0], [-21.6, 31.4], [-24.7, 29.7], [-27.3, 28.2], [-29.7, 26.5], [-31.6, 24.7], [-33.2, 23.0], [-35.1, 22.6], [-35.0, 15.6]])
  prism(brick, NW, 0, h(6.0), slate, 0.3)

  // ── Transept ──
  const TX0 = 4.0, TX1 = 28.3, SY0 = -22.7, NYE = 13.7, BX0 = 11.2, BX1 = 21.1, TD = 7.2
  // the central body under the high roof, between the end bays
  box(brick, BX0, BX1, SY0 + TD, NYE - TD, 0, h(26.8), null, 0)
  gableBanded(STRIPES, brick, BX0, BX1, SY0 + TD, NYE - TD, h(26.8), h(33.7), 'y', 0.4, 0.3)
  // the end bays: gable fronts with the rose windows
  for (const end of [-1, 1]) {
    const y0 = end < 0 ? SY0 : NYE - TD, y1 = end < 0 ? SY0 + TD : NYE
    box(brick, BX0, BX1, y0, y1, 0, h(17.9), null, 0)
    gableBanded(STRIPES, null, BX0, BX1, y0, y1, h(17.9), h(25.0), 'y', 0.3, 0.2)
    const yf = end < 0 ? SY0 : NYE
    const face: F = end < 0 ? [[BX0, yf], [BX1, yf]] : [[BX1, yf], [BX0, yf]]
    const W = BX1 - BX0, m = W / 2, out: V3 = [0, end, 0]
    // the gable wall, its coping and the finial
    poly(brick, [[BX0, yf, h(17.9)], [BX1, yf, h(17.9)], [(BX0 + BX1) / 2, yf, h(25.0)]], out)
    for (const sx of [BX0 - 0.2, BX1 + 0.2]) {
      const sec = (x: number, z: number): V3[] => [[x, yf + end * 0.35, z + 0.35], [x, yf - end * 0.3, z + 0.35], [x, yf - end * 0.3, z - 0.15], [x, yf + end * 0.35, z - 0.15]]
      stone.sweep([sec(sx, h(17.7)), sec((BX0 + BX1) / 2, h(25.2))])
    }
    box(stone, m + BX0 - 0.35, m + BX0 + 0.35, yf - 0.35, yf + 0.35, h(24.8), h(26.4), stone, 0.1)
    // the great pointed arch with the rose and the lancets
    onWall(stone, face[0], face[1], pointed(m, 8.4, h(7.6), h(13.6), 7), 0.03)
    onWall(brick, face[0], face[1], pointed(m, 7.6, h(7.9), h(13.6), 7), 0.045)
    const rose = (r: number, n: number) => Array.from({ length: n }, (_, i) => [m + r * Math.cos((i / n) * Math.PI * 2), h(15.6) + r * Math.sin((i / n) * Math.PI * 2)] as [number, number])
    onWall(stone, face[0], face[1], rose(3.45, 20), 0.06)
    onWall(win, face[0], face[1], rose(3.1, 20), 0.08)
    onWall(stone, face[0], face[1], rose(0.5, 10), 0.1)
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a)
      onWall(stone, face[0], face[1], [[m + 0.5 * c - 0.09 * sn, h(15.6) + 0.5 * sn + 0.09 * c], [m + 3.1 * c - 0.09 * sn, h(15.6) + 3.1 * sn + 0.09 * c], [m + 3.1 * c + 0.09 * sn, h(15.6) + 3.1 * sn - 0.09 * c], [m + 0.5 * c + 0.09 * sn, h(15.6) + 0.5 * sn - 0.09 * c]], 0.1)
    }
    for (let k = -2; k <= 2; k++) pointedWin(face, m + k * 1.45, 1.05, h(8.3), h(11.4), 0.2)
    onWall(stone, face[0], face[1], rectShape(0.8, W - 0.8, h(20.0), h(21.4)), 0.04) // the inscription
    const ocu = Array.from({ length: 12 }, (_, i) => [m + 0.65 * Math.cos((i / 12) * Math.PI * 2), h(22.8) + 0.65 * Math.sin((i / 12) * Math.PI * 2)] as [number, number])
    onWall(win, face[0], face[1], ocu, 0.05)
    onWall(stone, face[0], face[1], rectShape(0, W, h(17.4), h(17.9)), 0.04)
    // the porch: a gabled stone-trimmed brick hood over the door
    const py0 = end < 0 ? yf - 1.6 : yf, py1 = end < 0 ? yf : yf + 1.6
    box(brick, m + BX0 - 3.0, m + BX0 + 3.0, py0, py1, 0, h(5.4), null, 0)
    gableBanded([[1, slate]], brick, m + BX0 - 3.0, m + BX0 + 3.0, py0 - (end < 0 ? 0.2 : 0), py1 + (end > 0 ? 0.2 : 0), h(5.4), h(7.6), 'y', 0.2, 0.15)
    const pf: F = end < 0 ? [[m + BX0 - 3.0, py0], [m + BX0 + 3.0, py0]] : [[m + BX0 + 3.0, py1], [m + BX0 - 3.0, py1]]
    onWall(stone, pf[0], pf[1], pointed(3.0, 3.6, G, h(3.2)), 0.03)
    onWall(door, pf[0], pf[1], pointed(3.0, 2.8, G, h(3.2)), 0.06)
    onWall(stone, face[0], face[1], rectShape(0, W, h(5.6), h(6.2)), 0.03)
    // the spire towers either side
    for (const [x0, x1] of [[TX0, BX0], [BX1, TX1]]) {
      box(brick, x0, x1, y0, y1, 0, h(19.2), null, 0)
      const ring = ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
      cornice(stone, ring, h(18.5), 0.7, 0.35, null)
      const c: XY = [(x0 + x1) / 2, (y0 + y1) / 2], hw = (x1 - x0) / 2
      frustumBanded(SPIRE, sq(c, hw + 0.3), sq(c, 0.0001), h(19.2), h(32.2), null)
      revolve(metal, c, [[0.12, h(32.0)], [0.12, h(33.4)], [0, h(33.6)]], 6, 0, true, false)
      box(metal, c[0] - 0.05, c[0] + 0.05, c[1] - 0.5, c[1] + 0.5, h(32.8), h(32.95), metal, 0)
      box(metal, c[0] - 0.5, c[0] + 0.5, c[1] - 0.05, c[1] + 0.05, h(32.8), h(32.95), metal, 0)
      // the front face: a row of small arches, three lancets, a dormer on the spire
      const fx: F = end < 0 ? [[x0, yf], [x1, yf]] : [[x1, yf], [x0, yf]]
      const L = wallLen(fx)
      for (let k = 0; k < 4; k++) pointedWin(fx, L / 2 + (k - 1.5) * 1.3, 0.8, h(15.6), h(16.9), 0.15)
      for (let k = -1; k <= 1; k++) pointedWin(fx, L / 2 + k * 1.6, 1.0, h(8.0), h(12.2), 0.2)
      const side: F = x0 < BX0 ? [[x0, y1], [x0, y0]] : [[x1, y0], [x1, y1]]
      for (let k = -1; k <= 1; k++) pointedWin(side, L / 2 + k * 1.6, 1.0, h(8.0), h(12.2), 0.2)
      // dormers on the spire's outer faces
      for (const [f, dir] of [[fx, [0, end] as XY], [side, [x0 < BX0 ? -1 : 1, 0] as XY]] as [F, XY][]) {
        const t: XY = [-dir[1], dir[0]]
        const base: XY = [c[0] + dir[0] * (hw + 0.3), c[1] + dir[1] * (hw + 0.3)]
        const P = (a: number, d: number, z: number): V3 => [base[0] + t[0] * a + dir[0] * d, base[1] + t[1] * a + dir[1] * d, z]
        const z0 = h(19.2), z1 = h(21.6), z2 = h(23.2), w = 0.9, back = 2.2
        poly(brick, [P(-w, -0.3, z0), P(w, -0.3, z0), P(w, -0.3, z1), P(0, -0.3, z2), P(-w, -0.3, z1)], [dir[0], dir[1], 0])
        poly(stone, [P(-0.45, -0.25, z0 + 0.3), P(0.45, -0.25, z0 + 0.3), P(0.45, -0.25, z1 - 0.2), P(-0.45, -0.25, z1 - 0.2)], [dir[0], dir[1], 0])
        poly(win, [P(-0.35, -0.22, z0 + 0.4), P(0.35, -0.22, z0 + 0.4), P(0.35, -0.22, z1 - 0.3), P(-0.35, -0.22, z1 - 0.3)], [dir[0], dir[1], 0])
        for (const sgn of [-1, 1]) {
          poly(slate, [P(sgn * (w + 0.15), -0.1, z1 - 0.15), P(0, -0.1, z2 + 0.1), P(0, -back, z2 + 0.1), P(sgn * (w + 0.15), -back, z1 - 0.15)], [t[0] * sgn, t[1] * sgn, 1])
          poly(brick, [P(sgn * w, -0.3, z0), P(sgn * w, -0.3, z1), P(sgn * w, -back, z1), P(sgn * w, -back, z0)], [t[0] * sgn, t[1] * sgn, 0])
        }
      }

    }
    void face
  }
  // the transept's sides behind the spire towers, under the high roof
  box(brick, TX0, BX0, SY0 + TD, NYE - TD, 0, h(14.0), slate, 0.3)
  box(brick, BX1, TX1, SY0 + TD, NYE - TD, 0, h(26.7), slate, 0.3) // and on the east, up to Sanders' flat top

  // ── Tower ──
  const C: XY = [16.5, -5.0], TW = 6.0, TC = h(42.0)
  box(brick, C[0] - TW, C[0] + TW, C[1] - TW, C[1] + TW, 0, TC, null, 0)
  const tring = sq(C, TW)
  cornice(stone, tring, h(33.6), 0.4, 0.15, null)
  cornice(stone, tring, h(34.6), 0.35, 0.12, null)
  cornice(stone, tring, TC - 1.4, 1.4, 0.6, stone) // the corbel cornice
  const faces: F[] = [[tring[0], tring[1]], [tring[1], tring[2]], [tring[2], tring[3]], [tring[3], tring[0]]]
  for (const f of faces) {
    for (let k = -2; k <= 2; k++) {
      const s = TW + k * 2.05
      onWall(stone, f[0], f[1], pointed(s, 1.75, h(35.0), h(38.6), 3), 0.03)
      onWall(metal, f[0], f[1], pointed(s, 1.3, h(35.2), h(38.6), 3), 0.06)
      // gablets over the arches
      onWall(stone, f[0], f[1], [[s - 0.95, h(39.5)], [s + 0.95, h(39.5)], [s, h(40.5)]], 0.04)
    }
  }
  for (const f of [faces[1], faces[3]]) for (const k of [-1, 1]) pointedWin(f, TW + k * 2.2, 0.9, h(29.0), h(31.0), 0.2)
  // corner buttresses and pinnacles
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const px = C[0] + sx * (TW - 0.2), py = C[1] + sy * (TW - 0.2)
    box(brick, px - 0.75, px + 0.75, py - 0.75, py + 0.75, h(26.0), h(43.4), stone, 0.15)
    revolve(stone, [px, py], [[0.65, h(43.4)], [0.65, h(44.2)], [0.0, h(49.5)]], 4, Math.PI / 4, true, false)
  }
  // the roof: a steep banded frustum, dormers, cresting and vanes
  const RT = h(57.6), RH = 2.8
  const TOWER_ROOF: Bands = [[0.22, slate], [0.3, red], [0.6, slate], [0.68, red], [1, slate]] // dark slate, two red zigzag bands
  frustumBanded(TOWER_ROOF, sq(C, TW + 0.1), sq(C, RH), TC, RT, slate)
  for (let i = 0; i < 4; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 2, dir: XY = [Math.cos(ang), Math.sin(ang)], t: XY = [-dir[1], dir[0]]
    // the roof face at height z stands this far from the centre
    const rAt = (z: number) => TW + 0.1 + ((RH - TW - 0.1) * (z - TC)) / (RT - TC)
    const z0 = h(46.0), z1 = h(49.6), z2 = h(52.4), w = 0.85
    const f0 = rAt(z0) + 0.4, back = rAt(z2) - 0.3
    const P = (a: number, r: number, z: number): V3 => [C[0] + dir[0] * r + t[0] * a, C[1] + dir[1] * r + t[1] * a, z]
    poly(slate, [P(-w, f0, z0), P(w, f0, z0), P(w, f0, z1), P(0, f0, z2), P(-w, f0, z1)], [dir[0], dir[1], 0])
    poly(win, [P(-0.4, f0 + 0.05, z0 + 0.4), P(0.4, f0 + 0.05, z0 + 0.4), P(0.4, f0 + 0.05, z1 - 0.3), P(-0.4, f0 + 0.05, z1 - 0.3)], [dir[0], dir[1], 0])
    for (const sgn of [-1, 1]) {
      poly(slate, [P(sgn * (w + 0.12), f0 + 0.1, z1 - 0.1), P(0, f0 + 0.1, z2 + 0.08), P(0, back, z2 + 0.08), P(sgn * (w + 0.12), back, z1 - 0.1)], [t[0] * sgn, t[1] * sgn, 1])
      poly(slate, [P(sgn * w, f0, z0), P(sgn * w, f0, z1), P(sgn * w, rAt(z1) - 0.2, z1), P(sgn * w, rAt(z0) - 0.2, z0)], [t[0] * sgn, t[1] * sgn, 0])
    }
  }
  // iron cresting round the flat top, and four vanes
  {
    const r0 = sq(C, RH - 0.05), r1 = sq(C, RH - 0.25)
    for (let i = 0; i < 4; i++) {
      const a = r0[i], b = r0[(i + 1) % 4]
      onWall(metal, a, b, rectShape(0, 2 * (RH - 0.05), RT, RT + 1.2), 0.0)
      const c2 = r1[i], d2 = r1[(i + 1) % 4]
      onWall(metal, d2, c2, rectShape(0, 2 * (RH - 0.25), RT, RT + 1.2), 0.0)
    }
    for (const q of r0) {
      revolve(metal, q, [[0.18, RT], [0.18, RT + 1.6], [0.08, RT + 1.8], [0.05, RT + 5.9], [0, RT + 6.1]], 4, 0, true, false)
      box(metal, q[0] - 0.04, q[0] + 0.04, q[1] - 0.05, q[1] + 0.85, RT + 4.6, RT + 5.2, metal, 0)
    }
  }

  // ── Sanders Theatre ──
  const SC: XY = [33.5, -4.8], SR = 16.2, SE = h(12.9), STOP = h(26.8)
  const angs = [90, 54, 18, -18, -54, -90].map((d) => (d * Math.PI) / 180)
  const apse = (r: number, west: number): XY[] => ccw([
    [west, SC[1] - r], ...angs.slice().reverse().map((a) => [SC[0] + r * Math.cos(a), SC[1] + r * Math.sin(a)] as XY), [west, SC[1] + r],
  ])
  const outer = apse(SR, TX1 - 0.3)
  prism(brick, outer, 0, SE, null, 0)
  cornice(stone, outer, SE - 0.6, 0.6, 0.35, null)
  cornice(stone, outer, h(6.6), 0.4, 0.15, null)
  const eave = apse(SR + 0.5, TX1 - 0.3), inner = apse(5.6, C[0] + TW)
  const SANDERS: Bands = [[0.1, slate], [0.18, red], [0.32, buff], [0.42, slate], [0.5, red], [0.64, buff], [0.72, red], [1, slate]]
  frustumBanded(SANDERS, eave, inner, SE, STOP, slate)
  // cresting and little flags on the flat top
  for (let i = 0; i < inner.length; i++) {
    const a = inner[i], b = inner[(i + 1) % inner.length]
    if (Math.min(a[0], b[0]) < C[0] + TW + 0.5) continue
    onWall(metal, b, a, rectShape(0, Math.hypot(b[0] - a[0], b[1] - a[1]), STOP, STOP + 0.9), 0.15)
  }
  for (const a of angs.slice(1, 5)) {
    const q: XY = [SC[0] + 5.2 * Math.cos(a), SC[1] + 5.2 * Math.sin(a)]
    revolve(metal, q, [[0.05, STOP], [0.05, STOP + 2.4], [0, STOP + 2.5]], 4, 0, true, false)
    box(metal, q[0] - 0.03, q[0] + 0.03, q[1], q[1] + 0.6, STOP + 1.8, STOP + 2.3, metal, 0)
  }
  // walls: two tiers of windows and a gabled wall dormer on each face
  for (let i = 0; i < outer.length; i++) {
    const a = outer[i], b = outer[(i + 1) % outer.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4 || (Math.abs(a[0] - b[0]) < 0.01 && a[0] < SC[0])) continue
    const f: F = [a, b], m = L / 2
    const dir: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L], t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    for (const k of L > 8 ? [-1.6, 1.6] : [0]) {
      onWall(stone, f[0], f[1], rectShape(m + k - 0.85, m + k + 0.85, h(2.3), h(5.9)), 0.03)
      onWall(win, f[0], f[1], rectShape(m + k - 0.65, m + k + 0.65, h(2.5), h(5.7)), 0.06)
      onWall(stone, f[0], f[1], rectShape(m + k - 0.85, m + k + 0.85, h(7.6), h(11.4)), 0.03)
      onWall(win, f[0], f[1], rectShape(m + k - 0.65, m + k + 0.65, h(7.8), h(11.2)), 0.06)
    }
    // the wall dormer: the face carried up into a gable, with a roof back into the slope
    const w = Math.min(2.6, L / 2 - 0.6), z1 = h(15.4), z2 = h(19.6), back = 4.0
    const P = (s: number, d: number, z: number): V3 => [a[0] + t[0] * s + dir[0] * d, a[1] + t[1] * s + dir[1] * d, z]
    poly(brick, [P(m - w, 0, SE - 0.6), P(m + w, 0, SE - 0.6), P(m + w, 0, z1), P(m, 0, z2), P(m - w, 0, z1)], [dir[0], dir[1], 0])
    onWall(stone, f[0], f[1], pointed(m, 1.9, SE + 0.4, h(15.6), 5), 0.03)
    onWall(win, f[0], f[1], pointed(m, 1.5, SE + 0.6, h(15.6), 5), 0.06)
    for (const sgn of [-1, 1]) {
      poly(slate, [P(m + sgn * (w + 0.25), 0.3, z1 - 0.2), P(m, 0.3, z2 + 0.15), P(m, -back, z2 + 0.15), P(m + sgn * (w + 0.25), -back, z1 - 0.2)], [t[0] * sgn, t[1] * sgn, 1])
      poly(brick, [P(m + sgn * w, 0, SE - 0.6), P(m + sgn * w, 0, z1), P(m + sgn * w, -back, z1), P(m + sgn * w, -back, SE - 0.6)], [t[0] * sgn, t[1] * sgn, 0])
    }
  }

  const floodTower = (p: V3) => (p[2] > h(26) && Math.abs(p[0] - C[0]) < TW + 1 && Math.abs(p[1] - C[1]) < TW + 1 ? 0.8 : 0)
  await save('bos-harvard-memorial-hall', 'Memorial Hall', [
    { part: brick, material: { ...finish('memhall-brick', 0xa65e4a), floodlight: floodTower } },
    { part: stone, material: { ...finish('memhall-sandstone', 0xdcc6a0), floodlight: floodTower } },
    { part: slate, material: { ...finish('memhall-slate', 0x7a8285), floodlight: floodTower } },
    { part: win, material: PALETTE.window },
    { part: metal, material: finish('memhall-iron', 0x4f555c) },
    { part: door, material: finish('memhall-oak', 0x7a5a3e) },
  ], { height: 63.7 + 2.0, anchor: [42.3759776, -71.1150882], bearing: 9 }, 6500)
}
