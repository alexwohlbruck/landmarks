/**
 * El Tovar Hotel, Grand Canyon Village, South Rim (1905, Charles Whittlesey
 * for the Santa Fe Railway and Fred Harvey) — original procedural geometry,
 * CC0-1.0.
 * bun generators/grand-canyon-el-tovar.ts
 *
 * Also the shared kit of the Grand Canyon Village models (Hopi House,
 * Verkamp's, the depot): `face`, `lofted`, `gable`, `dormer`, `post`,
 * `finial`, `parapet`, `place`. The build below runs only as a script.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of OSM way/144432994 (-112.137583, 36.057431),
 * bearing 0. The OSM outline sits about 5–7 m west of the building as the
 * lidar and NAIP show it; the geometry is drawn where lidar puts it (the
 * north wing at x 3.5..21 where OSM has −3..16), so it still lies inside
 * or just east of the outline.
 *
 * Identity: the long dark-stained log-and-board hotel on the rim. A north
 * wing and a south-east wing, both two or three storeys of log and board
 * under steep shingled mansards lined with gabled dormers, meet at a taller
 * central block crowned by the square belvedere turret with its bracketed,
 * flared pyramid roof. The south-east wing ends in the round bay: a
 * sandstone basement, a log storey with a balustraded balcony, a set-back
 * upper bay and a flat railed roof, with tall spike finials at the corners
 * (a second finialed pavilion stands at the north-west). East: the
 * one-storey lobby with the gabled entrance porch and its stone piers.
 * West: the lower dining room and service wings, and the stone chimney.
 *
 * Evidence:
 *  - plan: OSM way/144432994 for the outline (shifted ≈ +6 m east, +1 m
 *    north for the west wings); USGS NAIP 0.15 m (2022) for the roof plan;
 *    USGS 3DEP lidar AZ_GrandCanyonNP_1_2019 (1 m grid) for every wing's
 *    extent and height.
 *  - heights (measured, lidar, model z = metres above the lowest ground
 *    under the footprint, at the south-east bay, 2101 m): north wing
 *    eaves 14 (7.5 m above its own ground), mansard ridge 19; central
 *    block ridge 20.5–21; turret tip ≈ 25 in the 1 m grid, drawn 26.5;
 *    east cross wing ridge 20.3; lobby 10.8–13; south-east wing eaves 15,
 *    ridge 19, its flat end and bay roof 14.5–15, balcony 8; north-west
 *    pavilion 15; west wings 9.8–13 (5–6 m walls on ground at z 4).
 *    Ground: z 6.5 at the north wing, z 4 at the west wings, z 0 at the
 *    south-east bay; the walls run down to z 0 everywhere and sink into the
 *    slope uphill.
 *  - storeys, windows, dormers, finials, stone base, bay and turret
 *    proportions: estimated from the photos below.
 *  - colour (photos, pulled toward the palette's lightness): dark brown
 *    stained logs and boards, rust-brown shingle roofs, pink-tan sandstone
 *    base and chimney, grey flat roofs (NAIP).
 *
 * Photos (Wikimedia Commons, evidence):
 *  - El_Tovar_north_facing_the_rim.jpg, El_Tovar_north_face.jpg,
 *    El_Tovar_Hotel_s-aspect.JPG, El_Tovar_Hotel_on_the_south_rim_of_the_
 *    Grand_Canyon.JPG — Wolfgang Moroder, CC BY-SA 3.0.
 *  - Grand_Canyon_Village-El_Tovar_Hotel-1903.jpg — Marine 69-71,
 *    CC BY-SA 4.0 (the east entrance).
 *  - RAILWAY_STATION_AND_EL_TOVAR_HOTEL,_FACING_WNW ... 1994,_HAER.jpg —
 *    Brian C. Grogan, HAER, public domain (the south-east bay).
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the west service wings are drawn from lidar and NAIP only (no
 * photo shows them well); the dining-room chimney position is estimated;
 * window counts are representative, not counted bay by bay; the many small
 * porches, stairs and the north-end veranda railings are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, onWall, rect, save, walls, type XY } from './chi-museum-of-science-industry'

// ---------------------------------------------------------------------------
// Shared kit

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A flat convex polygon, wound to face along `hint`. */
export function face(p: Part, pts: V3[], hint: V3) {
  const a = pts[0], b = pts[1], c = pts[2]
  const n: V3 = [
    (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]),
    (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]),
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]),
  ]
  const q = dot(n, hint) < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}

/**
 * A roof lofted through successive insets of a counter-clockwise ring:
 * `steps` are [inset, z] (a negative inset is an eave overhang). The last
 * ring is capped in `top` (or `p`); an overhang gets a soffit underneath.
 */
export function lofted(p: Part, r: XY[], steps: [number, number][], top: Part | null = p) {
  const rings = steps.map(([d, z]) => inset(r, d).map(([x, y]) => [x, y, z] as V3))
  p.loft(rings)
  const [d0, z0] = steps[0]
  if (d0 < 0) {
    const o = inset(r, d0)
    for (let i = 0; i < r.length; i++) {
      const j = (i + 1) % r.length
      face(p, [[r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [o[j][0], o[j][1], z0], [o[i][0], o[i][1], z0]], [0, 0, -1])
    }
  }
  if (top) {
    const [d, z] = steps[steps.length - 1]
    cap(top, inset(r, d), z)
  }
}

/** A box from z0 to z1 over a counter-clockwise ring, with its top. */
export function prism(p: Part, r: XY[], z0: number, z1: number, top: Part | null = p) {
  walls(p, r, z0, z1)
  if (top) cap(top, r, z1)
}

/**
 * A gable roof over x0..x1, y0..y1 with the ridge along `axis`, eaves at
 * ze, ridge at zr, overhanging by `ov` all round; gable triangles on the
 * wall lines in `wallP`; the underside drawn too, so the eaves don't show
 * through from below.
 */
export function gable(roofP: Part, wallP: Part | null, x0: number, x1: number, y0: number, y1: number, ze: number, zr: number, ov: number, axis: 'x' | 'y') {
  if (axis === 'y') {
    const xm = (x0 + x1) / 2, k = (zr - ze) / ((x1 - x0) / 2), zl = ze - ov * k
    for (const [xe, sx] of [[x1 + ov, 1], [x0 - ov, -1]] as [number, number][]) {
      const pts: V3[] = [[xe, y0 - ov, zl], [xe, y1 + ov, zl], [xm, y1 + ov, zr], [xm, y0 - ov, zr]]
      face(roofP, pts, [sx, 0, 1])
      face(roofP, pts, [-sx, 0, -1])
    }
    if (wallP) {
      face(wallP, [[x0, y0, ze], [x1, y0, ze], [xm, y0, zr]], [0, -1, 0])
      face(wallP, [[x0, y1, ze], [x1, y1, ze], [xm, y1, zr]], [0, 1, 0])
    }
  } else {
    const ym = (y0 + y1) / 2, k = (zr - ze) / ((y1 - y0) / 2), zl = ze - ov * k
    for (const [ye, sy] of [[y1 + ov, 1], [y0 - ov, -1]] as [number, number][]) {
      const pts: V3[] = [[x0 - ov, ye, zl], [x1 + ov, ye, zl], [x1 + ov, ym, zr], [x0 - ov, ym, zr]]
      face(roofP, pts, [0, sy, 1])
      face(roofP, pts, [0, -sy, -1])
    }
    if (wallP) {
      face(wallP, [[x0, y0, ze], [x0, y1, ze], [x0, ym, zr]], [-1, 0, 0])
      face(wallP, [[x1, y0, ze], [x1, y1, ze], [x1, ym, zr]], [1, 0, 0])
    }
  }
}

/**
 * A gabled dormer on the wall a→b of a counter-clockwise ring, centred s
 * along it: its face `o` outside the wall line (negative: set back), w
 * wide, sill zb, eaves ze, peak zr, running `depth` back into the roof.
 */
export function dormer(wallP: Part, roofP: Part, winP: Part, a: XY, b: XY, s: number, w: number, zb: number, ze: number, zr: number, o: number, depth: number) {
  const { u, n, P } = onWall(a, b)
  const N: V3 = [n[0], n[1], 0], U: V3 = [u[0], u[1], 0]
  const h = w / 2, ob = o - depth
  face(wallP, [P(s - h, zb, o), P(s + h, zb, o), P(s + h, ze, o), P(s - h, ze, o)], N)
  face(wallP, [P(s - h, ze, o), P(s + h, ze, o), P(s, zr, o)], N)
  face(wallP, [P(s - h, zb, o), P(s - h, zb, ob), P(s - h, ze, ob), P(s - h, ze, o)], [-U[0], -U[1], 0])
  face(wallP, [P(s + h, zb, o), P(s + h, zb, ob), P(s + h, ze, ob), P(s + h, ze, o)], U)
  const e = 0.2, f = o + 0.3
  for (const sg of [-1, 1]) {
    const pts = [P(s + sg * (h + e), ze - 0.12, f), P(s, zr + 0.05, f), P(s, zr + 0.05, ob), P(s + sg * (h + e), ze - 0.12, ob)]
    face(roofP, pts, [sg * U[0], sg * U[1], 1])
    face(roofP, pts, [-sg * U[0], -sg * U[1], -1])
  }
  face(winP, [P(s - h * 0.62, zb + 0.25, o + 0.05), P(s + h * 0.62, zb + 0.25, o + 0.05), P(s + h * 0.62, ze - 0.15, o + 0.05), P(s - h * 0.62, ze - 0.15, o + 0.05)], N)
}

/** A square post of half-width r at (x, y). */
export function post(p: Part, x: number, y: number, z0: number, z1: number, r: number) {
  prism(p, rect(x - r, y - r, x + r, y + r), z0, z1)
}

/** A spike finial: a short square post, then a tapering spike to z1. */
export function finial(p: Part, x: number, y: number, z0: number, z1: number, r = 0.22) {
  walls(p, rect(x - r, y - r, x + r, y + r), z0, z0 + 0.7)
  const t = rect(x - r, y - r, x + r, y + r)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    p.tri([t[i][0], t[i][1], z0 + 0.7], [t[j][0], t[j][1], z0 + 0.7], [x, y, z1])
  }
}

/** A thin wall following a counter-clockwise ring (a parapet or balustrade), t thick. */
export function parapet(p: Part, r: XY[], z0: number, z1: number, t: number) {
  const i = inset(r, t)
  walls(p, r, z0, z1)
  walls(p, [...i].reverse(), z0, z1)
  for (let k = 0; k < r.length; k++) {
    const l = (k + 1) % r.length
    face(p, [[r[k][0], r[k][1], z1], [r[l][0], r[l][1], z1], [i[l][0], i[l][1], z1], [i[k][0], i[k][1], z1]], [0, 0, 1])
  }
}

/**
 * Copy `src` into `dst`, turned `deg` clockwise (a compass bearing: the
 * source's north ends up pointing that way) and moved by (tx, ty).
 */
export function place(src: Part, dst: Part, deg: number, tx: number, ty: number) {
  const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t)
  // Part stores glTF (x, z, −y).
  for (let i = 0; i < src.pos.length; i += 3) {
    const x = src.pos[i], y = -src.pos[i + 2]
    dst.pos.push(x * c + y * s + tx, src.pos[i + 1], -(-x * s + y * c + ty))
    const nx = src.nrm[i], ny = -src.nrm[i + 2]
    dst.nrm.push(nx * c + ny * s, src.nrm[i + 1], -(-nx * s + ny * c))
  }
  dst.uv.push(...src.uv)
}

/** Window panels along wall a→b: one per `step` metres, w wide, for each [z0, z1] row. */
export function windowRow(winP: Part, a: XY, b: XY, rows: [number, number][], w: number, step: number, s0 = 1.2, s1?: number) {
  const { L, P, n } = onWall(a, b)
  const end = s1 ?? L - 1.2
  const k = end - s0 < 0.01 ? 0 : Math.max(1, Math.round((end - s0) / step))
  const N: V3 = [n[0], n[1], 0]
  for (let i = 0; i <= k; i++) {
    const s = k ? s0 + ((end - s0) * i) / k : s0
    for (const [z0, z1] of rows) face(winP, [P(s - w / 2, z0, 0.06), P(s + w / 2, z0, 0.06), P(s + w / 2, z1, 0.06), P(s - w / 2, z1, 0.06)], N)
  }
}

// ---------------------------------------------------------------------------
// El Tovar

function build() {
  const logs = new Part(), shingle = new Part(), stone = new Part(), flat = new Part(), win = new Part()

  // --- North wing: two storeys of log and board, a dormered mansard. -----
  const NW = rect(3.5, 0, 21, 44)
  prism(stone, rect(3.4, 0, 21.1, 44.1), 0, 7.3, null)
  prism(logs, NW, 7.3, 14.0, null)
  lofted(shingle, NW, [[-0.7, 14.0], [1.9, 17.0], [7.9, 19.0]])
  windowRow(win, [3.5, 44], [3.5, 0], [[7.8, 9.4], [11.0, 12.6]], 1.3, 3.6, 2, 40)
  windowRow(win, [21, 0], [21, 44], [[7.8, 9.4], [11.0, 12.6]], 1.3, 3.6, 4, 42)
  windowRow(win, [21, 44], [3.5, 44], [[7.8, 9.4], [11.0, 12.6]], 1.3, 3.4, 3, 14.5)
  for (let s = 6; s <= 41; s += 4.4) {
    dormer(logs, shingle, win, [3.5, 44], [3.5, 0], s, 2.1, 14.2, 16.4, 17.5, -0.4, 2.2)
    dormer(logs, shingle, win, [21, 0], [21, 44], 44 - s, 2.1, 14.2, 16.4, 17.5, -0.4, 2.2)
  }
  // North veranda: a low hipped roof on log posts across the wing's end.
  for (const x of [3.8, 8.2, 12.6, 17.0, 20.7]) post(logs, x, 49.9, 6.0, 10.6, 0.22)
  lofted(shingle, rect(3.5, 44, 21, 50.2), [[-0.3, 10.6], [2.6, 11.8]])

  // --- North-west pavilion: three storeys, a railed flat roof, four spikes.
  const PV = rect(-9, 33, 3.6, 43)
  prism(stone, rect(-9.1, 32.9, 3.6, 43.1), 0, 6.8, null)
  prism(logs, PV, 6.8, 15.0, flat)
  parapet(logs, rect(-9.2, 32.8, 3.6, 43.2), 15.0, 16.0, 0.2)
  for (const [x, y] of [[-9.0, 33.0], [-9.0, 43.0], [3.4, 43.0], [3.4, 33.0]] as XY[]) finial(logs, x, y, 16.0, 19.6)
  windowRow(win, [-9, 43], [-9, 33], [[7.2, 8.8], [10.2, 11.8], [13.0, 14.4]], 1.3, 3.0)
  windowRow(win, [3.6, 43], [-9, 43], [[7.2, 8.8], [10.2, 11.8], [13.0, 14.4]], 1.3, 3.0)
  windowRow(win, [-9, 33], [3.5, 33], [[7.2, 8.8], [10.2, 11.8], [13.0, 14.4]], 1.3, 3.0)

  // --- Central block and the belvedere turret. -------------------------
  const CB = rect(4.5, -13.5, 22, 3)
  prism(stone, rect(4.4, -13.6, 22.1, 3), 0, 6.3, null)
  prism(logs, CB, 6.3, 15.0, null)
  lofted(shingle, CB, [[-0.8, 15.0], [1.6, 18.0], [5.2, 20.5]])
  windowRow(win, [4.5, 3], [4.5, -13.5], [[6.8, 8.4], [9.8, 11.4], [12.8, 14.2]], 1.3, 3.3)
  // The turret: a square storey with a bracketed flared pyramid roof.
  const T = rect(7.3, -7.3, 12.7, -1.9)
  prism(logs, T, 19.0, 22.3, null)
  for (const [a, b] of [[[7.3, -7.3], [12.7, -7.3]], [[12.7, -7.3], [12.7, -1.9]], [[12.7, -1.9], [7.3, -1.9]], [[7.3, -1.9], [7.3, -7.3]]] as [XY, XY][])
    windowRow(win, a, b, [[20.6, 21.8]], 1.0, 1.6, 1.2, 4.2)
  lofted(shingle, T, [[-1.3, 22.3], [0.3, 23.0], [2.6, 26.6]], null)

  // --- East cross wing (four storeys) and the one-storey lobby. ---------
  const EW = rect(22, -12, 36, -3)
  prism(stone, rect(22, -12.1, 36.1, -2.9), 0, 6.0, null)
  prism(logs, EW, 6.0, 15.0, null)
  lofted(shingle, EW, [[-0.7, 15.0], [4.3, 20.3]])
  windowRow(win, [36, -12], [36, -3], [[6.6, 8.2], [9.6, 11.2], [12.6, 14.0]], 1.3, 3.2)
  windowRow(win, [22, -12], [36, -12], [[6.6, 8.2], [9.6, 11.2], [12.6, 14.0]], 1.3, 3.4)
  const LB = rect(21, -2.5, 35, 16.5)
  prism(logs, LB, 0, 10.8, null)
  windowRow(win, [35, -2.5], [35, 16.5], [[8.0, 10.0]], 2.2, 3.6, 2, 17)
  lofted(shingle, rect(21, -2.5, 39.2, 16.5), [[-0.6, 10.8], [3.6, 12.6]])
  // The entrance porch: log posts, stone end piers, a gable over the steps.
  for (const y of [3.0, 6.0, 9.5, 12.5]) post(logs, 38.8, y, 6.5, 10.8, 0.25)
  prism(stone, rect(37.6, -2.0, 39.2, -0.2), 0, 10.0)
  prism(stone, rect(37.6, 13.7, 39.2, 15.5), 0, 10.0)
  gable(shingle, logs, 30, 39.2, 1.2, 11.3, 11.6, 14.6, 0.8, 'x')
  windowRow(win, [39.2, 1.2], [39.2, 11.3], [[12.0, 13.0]], 1.6, 2.2, 3, 7.2)

  // East entrance wing to the north of the lobby.
  const EP = rect(21.5, 18, 30.5, 29.5)
  prism(logs, EP, 0, 12.8, null)
  lofted(shingle, EP, [[-0.6, 12.8], [4.1, 16.0]])
  windowRow(win, [30.5, 18], [30.5, 29.5], [[8.4, 10.0], [11.0, 12.2]], 1.3, 3.2)
  windowRow(win, [30.5, 29.5], [21.5, 29.5], [[8.4, 10.0], [11.0, 12.2]], 1.3, 3.2)

  // --- South-east wing and its round bay, built along the wing and turned
  //     to bearing 333.4° (its axis runs SSE from the central block).
  const sl = new Part(), ss = new Part(), sst = new Part(), sf = new Part(), sw = new Part()
  const SW = rect(-7.2, 0, 7.2, 30)
  prism(sst, rect(-7.3, -0.1, 7.3, 30), 0, 3.4, null)
  prism(sl, SW, 3.4, 15.0, null)
  // Flat railed end over the bay, then the dormered mansard.
  cap(sf, rect(-7.2, 0, 7.2, 6.5), 15.0)
  parapet(sl, rect(-7.4, -0.2, 7.4, 6.5), 15.0, 15.9, 0.2)
  for (const [x, y] of [[-7.2, 0], [7.2, 0], [-7.2, 6.4], [7.2, 6.4]] as XY[]) finial(sl, x, y, 15.9, 19.6)
  lofted(ss, rect(-7.2, 6.5, 7.2, 30), [[-0.7, 15.0], [1.8, 17.6], [6.3, 19.0]])
  const rowsSE: [number, number][] = [[4.6, 6.2], [8.4, 10.0], [12.0, 13.6]]
  windowRow(sw, [7.2, 0], [7.2, 30], rowsSE, 1.3, 3.4, 1.6, 22)
  windowRow(sw, [-7.2, 30], [-7.2, 0], rowsSE, 1.3, 3.4, 8, 28.4)
  for (let y = 9.5; y <= 27; y += 4.4) {
    dormer(sl, ss, sw, [7.2, 0], [7.2, 30], y, 2.1, 15.2, 17.2, 18.2, -0.4, 2.2)
    dormer(sl, ss, sw, [-7.2, 30], [-7.2, 0], 30 - y, 2.1, 15.2, 17.2, 18.2, -0.4, 2.2)
  }
  // The bay: half-octagons about the wing's south wall.
  const half = (R: number): XY[] => {
    const pts: XY[] = []
    for (let k = 0; k <= 4; k++) {
      const t = Math.PI + (k * Math.PI) / 4
      pts.push([R * Math.cos(t) / Math.cos(Math.PI / 8), R * Math.sin(t) / Math.cos(Math.PI / 8)])
    }
    pts[0] = [-R, 0]; pts[4] = [R, 0]
    return pts
  }
  const lower = half(6.2), upper = half(4.8)
  prism(sst, lower, 0, 3.4, null)
  prism(sl, lower, 3.4, 7.6, null)
  lofted(sl, lower, [[-0.5, 7.6], [-0.5, 8.0]], sf)
  parapet(sl, half(6.6), 8.0, 8.9, 0.18)
  prism(sl, upper, 8.0, 14.4, null)
  lofted(sl, upper, [[-0.6, 14.4], [-0.6, 14.8]], sf)
  parapet(sl, half(5.3), 14.8, 15.5, 0.15)
  for (let k = 0; k < 4; k++) {
    const a = lower[k], b = lower[k + 1], c = upper[k], d = upper[k + 1]
    windowRow(sw, a, b, [[4.8, 6.6]], 1.3, 9, 2.4, 2.4)
    windowRow(sw, c, d, [[9.0, 10.8], [11.9, 13.6]], 1.2, 9, 1.85, 1.85)
    if (k === 1 || k === 2) windowRow(sw, a, b, [[0.9, 2.5]], 1.2, 9, 2.4, 2.4)
  }
  const SEB = 333.4, SX = 29.5, SY = -36.5
  place(sl, logs, SEB, SX, SY)
  place(ss, shingle, SEB, SX, SY)
  place(sst, stone, SEB, SX, SY)
  place(sf, flat, SEB, SX, SY)
  place(sw, win, SEB, SX, SY)

  // --- West: dining room and the lower service wings. ------------------
  const W1 = rect(-36, -31, -12, 13)
  prism(logs, W1, 0, 9.8, null)
  lofted(shingle, W1, [[-0.7, 9.8], [6.5, 12.6]], flat)
  windowRow(win, [-36, 13], [-36, -31], [[5.8, 7.6]], 1.4, 4.0)
  windowRow(win, [-12, 13], [-36, 13], [[5.8, 7.6]], 1.4, 4.0)
  windowRow(win, [-36, -31], [-12, -31], [[5.0, 6.8]], 1.4, 4.0)
  const W2 = rect(-12, -16, 4.5, 16)
  prism(logs, W2, 0, 10.2, null)
  lofted(shingle, W2, [[-0.8, 10.2], [5.0, 13.0]])
  windowRow(win, [4.5, 16], [-12, 16], [[6.6, 9.4]], 2.4, 3.4)
  windowRow(win, [-12, -16], [4.5, -16], [[5.6, 8.4]], 2.4, 3.4)
  const W3 = rect(-29, -40, -20, -31)
  prism(logs, W3, 0, 7.5, null)
  lofted(shingle, W3, [[-0.5, 7.5], [3.6, 9.2]])
  // Stone chimney by the dining-room porch.
  prism(stone, rect(-5.6, 15.6, -3.4, 17.8), 0, 15.6)

  return [
    { part: logs, material: finish('el-tovar-logs', 0x5f4b3b) },
    { part: shingle, material: finish('el-tovar-shingle', 0x9a6d52) },
    { part: stone, material: finish('el-tovar-sandstone', 0xcfae92) },
    { part: flat, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main) await save('grand-canyon-el-tovar', 'El Tovar Hotel', build(), { height: 26.6 }, 6500)
