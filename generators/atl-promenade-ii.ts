/**
 * Promenade II, Atlanta (1990, Thompson, Ventulett, Stainback & Associates)
 * — original procedural geometry, CC0-1.0.
 * bun generators/atl-promenade-ii.ts [out.glb]
 *
 * Uses the kit in atl-one-atlantic-center.ts.
 *
 * Identity. OSM maps it as "Promenade Tower" (way/269637575, 40 levels,
 * height 211, at 1230 Peachtree St); Wikipedia's Promenade II (1990, 691 ft,
 * 38 floors) stands there, and AAK's and Mark Larson's photos titled
 * "Promenade 2" show this tower beside 1180 Peachtree and One Atlantic
 * Center. The lead's note of a pink granite tower does not match: every
 * photo shows a tower of dark smoky glass and pale grey-beige stone.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline, 33.787882, -84.385141.
 * Bearing 45: the tower stands diagonal to the street grid, so the model's
 * +y (its long faces' normal) points north-east.
 *
 * What makes it recognisable (JJonahJackalope's, AtlChampion's and Mark
 * Larson's photos):
 *  - the stepped "gothic" crown: every face steps up in two-storey (8 m)
 *    setbacks to a central point, five steps a side, the step tops edged in
 *    pale stone, so the top reads as a stepped pyramid from every side;
 *  - a cluster of short pinnacles at the top with a tall thin white spire;
 *  - in the middle of each face a broad curtain wall of dark glass rising
 *    from the tenth floor into the steps, flanked by pale stone bands with
 *    dark ribbon windows; the lowest ten floors are banded all round;
 *  - notched corners: the plan steps in twice at each corner.
 *
 * Evidence:
 *  - plan: OSM way/269637575 and part way/1451518609: in the model frame a
 *    body 56 m by 40.4 m (y = ±20.2) with 22 m end bays out to x = ±33.6;
 *    the corner notches from lidar (the strip x = ±21–28, y = ±16–20 stands
 *    only to 44 m; OSM's 9-level corner parts way/1424485343, 1424485344,
 *    1424485351, 1424485352). Symmetrised.
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 0.5 m,
 *    read in the model frame above the street on the south (294.0 m): the
 *    steps sit on an 8 m rhythm, 140/148/156/164/172/180 m across the end
 *    bays and the middle, 165/157/149/141 m a band in, 157/149/141/133 m
 *    on the long faces; the pinnacle cluster to 189 m. Spire tip 210.6 m
 *    is published (691 ft, Wikipedia/Emporis); the mast is too thin for the
 *    lidar.
 *  - the glass zones, ribbon-window grouping and the 44 m banded base:
 *    estimated from the photos.
 *  - colours: smoky dark glass (palette window), pale warm grey stone,
 *    white copings and spire, as in the daylight photos.
 *  - y = 0 is the lowest street (south, 294.0 m); the ground rises about
 *    4 m to the north, where the walls sink into it. Elevation 0.
 *
 * Photos (EVIDENCE):
 *  - Promenade_II_1.jpg and Promenade_II_2.jpg, JJonahJackalope,
 *    CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Promenade_II_1.jpg
 *    and https://commons.wikimedia.org/wiki/File:Promenade_II_2.jpg
 *  - APromenadeIIMT2511-0713.jpg, AtlChampion, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:APromenadeIIMT2511-0713.jpg
 *  - Promenade_2-1180_Peachtree.jpg, Mark Larson, CC BY-SA 2.0,
 *    https://commons.wikimedia.org/wiki/File:Promenade_2-1180_Peachtree.jpg
 *  - Promenade_2,_1180_Peachtree.jpg, AAK, public domain,
 *    https://commons.wikimedia.org/wiki/File:Promenade_2,_1180_Peachtree.jpg
 *  - "Midtown Atlanta at Night", thombo2, CC BY 2.0,
 *    https://www.flickr.com/photos/17383471@N00/180785520 (dusk: lit crown)
 * Look-only (not relied on): "Promenade II - Atlanta Midtown", SeeMidTN.com,
 * CC BY-NC 2.0, https://www.flickr.com/photos/94502827@N00/8257310320.
 * No commercial imagery.
 *
 * Doubts: the real crown has more, smaller steps and nested gables inside
 * the glass zones than this five-step pyramid; the lidar is sparse on the
 * south-west half and the crown is mirrored. The pinnacle cluster is
 * simplified. The low one-storey wings OSM puts at two corners
 * (way/1424485342, way/1425865586) are drawn as plain 5 m blocks.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, wall, panels, prism, pinnacle, pyramid, ringWalls, write } from './atl-one-atlantic-center'

const stone = new Part(), trim = new Part(), glass = new Part(), roof = new Part()

const BASE = 44 // the banded base, all round
const XE = [0, 3, 9, 15, 21, 27, 28, 33.6]
const YE = [0, 11, 16, 20.2]
// heights by band (|y| ≤ 11, ≤ 16, ≤ 20.2) and x cell; 0 = no building
const H = [
  [180, 172, 164, 156, 148, 140, 140],
  [165, 165, 157, 149, 141, 141, 0],
  [157, 149, 141, 133, BASE, BASE, 0],
]
const xs = [...XE.slice(1).map((v) => -v).reverse(), ...XE.slice(1)] // signed edges, -33.6 … 33.6
const ys = [...YE.slice(1).map((v) => -v).reverse(), ...YE.slice(1)]
// with the centre cells merged: drop the ±3 / ±11 split at zero
const xEdges = xs.filter((v) => v !== 0 && Math.abs(v) !== 0)
const yEdges = ys
function cellX(i: number) { return [xEdges[i], xEdges[i + 1]] as const }
function cellY(j: number) { return [yEdges[j], yEdges[j + 1]] as const }
const nx = xEdges.length - 1, ny = yEdges.length - 1
const bandOf = (y0: number, y1: number) => {
  const m = Math.abs((y0 + y1) / 2)
  return m <= 11 ? 0 : m <= 16 ? 1 : 2
}
const colOf = (x0: number, x1: number) => {
  const m = Math.abs((x0 + x1) / 2)
  for (let k = 0; k < XE.length - 1; k++) if (m >= XE[k] && m < XE[k + 1]) return k
  return -1
}
const height = (i: number, j: number) => {
  if (i < 0 || j < 0 || i >= nx || j >= ny) return 0
  const [x0, x1] = cellX(i), [y0, y1] = cellY(j)
  return H[bandOf(y0, y1)][colOf(x0, x1)] ?? 0
}

const FLOOR = 4.0
const ribbon = { group: 2 * FLOOR, spandrel: 2.6, bays: 1, pier: 0.7, origin: 0 }

/** A wall of one column face between z0 and z1, dressed by zone. */
function face(a: XY, b: XY, z0: number, z1: number, glassZone: boolean, top: boolean) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const zb = Math.min(z1, Math.max(z0, BASE))
  if (zb > z0) {
    wall(stone, a, b, z0, zb)
    panels(glass, a, b, z0 + 4.5, zb, { ...ribbon, bays: Math.max(1, Math.round(L / 3.2)) })
  }
  if (z1 <= zb) return
  const capH = top ? 1.0 : 0
  if (glassZone) {
    // dark curtain wall with a pale floor line every four storeys
    wall(glass, a, b, zb, z1 - capH)
    const n: XY = [b[1] - a[1], a[0] - b[0]], l = Math.hypot(n[0], n[1])
    const o: XY = [n[0] / l * 0.05, n[1] / l * 0.05]
    for (let z = BASE + 8; z < z1 - capH - 2; z += 8) {
      wall(trim, [a[0] + o[0], a[1] + o[1]], [b[0] + o[0], b[1] + o[1]], z - 0.3, z + 0.3)
    }
    // vertical mullion lines about 6 m apart, at the cell's edges and middle
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const k = Math.max(1, Math.round(L / 6))
    for (let m = 0; m <= k; m++) {
      const s = Math.min(L - 0.3, Math.max(0.3, (L * m) / k))
      const p: XY = [a[0] + t[0] * s + o[0], a[1] + t[1] * s + o[1]]
      wall(trim, [p[0] - t[0] * 0.3, p[1] - t[1] * 0.3], [p[0] + t[0] * 0.3, p[1] + t[1] * 0.3], zb, z1 - capH)
    }
  } else {
    wall(stone, a, b, zb, z1 - capH)
    panels(glass, a, b, zb, z1 - capH, { ...ribbon, bays: Math.max(1, Math.round(L / 3.2)) })
  }
  if (capH) wall(trim, a, b, z1 - capH, z1)
}

for (let i = 0; i < nx; i++) {
  for (let j = 0; j < ny; j++) {
    const h = height(i, j)
    if (!h) continue
    const [x0, x1] = cellX(i), [y0, y1] = cellY(j)
    const band = bandOf(y0, y1)
    const cx = Math.abs((x0 + x1) / 2)
    // roof cap with a pale coping inset
    const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    roof.quad([x0, y0, h], [x1, y0, h], [x1, y1, h], [x0, y1, h])
    // walls where the neighbour is lower: east, west, north, south
    const sides: Array<[XY, XY, number, boolean]> = [
      [[x1, y0], [x1, y1], height(i + 1, j), band === 0],          // facing +x
      [[x0, y1], [x0, y0], height(i - 1, j), band === 0],          // facing -x
      [[x1, y1], [x0, y1], height(i, j + 1), cx < 15],             // facing +y
      [[x0, y0], [x1, y0], height(i, j - 1), cx < 15],             // facing -y
    ]
    for (const [a, b, hn, g] of sides) if (hn < h) face(a, b, hn, h, g, true)
    void r
  }
}

// The low one-storey wings OSM maps at two corners.
for (const [x0, x1, y0, y1] of [[28, 33, -19.3, -11], [-11.7, -7.4, -22, -20.2]]) {
  prism(stone, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 0, 5, roof, 0.3)
}

// The crown: a square core on the top step, a ring of pinnacles, a taller
// central lantern and the thin white spire (to 210.6 m, published).
{
  const TOP = 180
  const sq = (h: number, c: XY = [0, 0]): XY[] => [[c[0] - h, c[1] - h], [c[0] + h, c[1] - h], [c[0] + h, c[1] + h], [c[0] - h, c[1] + h]]
  prism(stone, sq(4.2), TOP, 184.5, roof, 0.3)
  for (const c of [[-3.4, -3.4], [3.4, -3.4], [3.4, 3.4], [-3.4, 3.4]] as XY[]) pinnacle(trim, c, 184.5, 7, 1.5, 0.5)
  for (const c of [[0, -3.6], [3.6, 0], [0, 3.6], [-3.6, 0]] as XY[]) pinnacle(trim, c, 184.5, 5, 1.3, 0.5)
  ringWalls(stone, sq(1.9), 184.5, 190)
  pyramid(trim, sq(1.9), 190, [0, 0, 192])
  pyramid(trim, sq(0.7), 191.5, [0, 0, 210.6])
}

const lit = (p: V3) => (p[2] > 128 ? 1 : 0)
await write('atl-promenade-ii', 'Promenade II', [
  { part: stone, material: { ...finish('promenade-stone', 0xd9d0c3), floodlight: lit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
  { part: glass, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
], {
  bearing: 45, elevation: 0, height: 210.6,
  replaces: ['way/269637575', 'way/1451518609', 'way/1424485342', 'way/1424485343', 'way/1424485344', 'way/1424485351', 'way/1424485352', 'way/1425865586'],
})
