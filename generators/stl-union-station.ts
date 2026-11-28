/**
 * St. Louis Union Station (1891–1894; headhouse by Theodore C. Link, train
 * shed by George H. Pegram) — original procedural geometry, CC0-1.0.
 * bun generators/stl-union-station.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Bearing 14.85: the model's north is the
 * Market Street front. The station's walls run at 14.8° / 104.8° (OSM
 * way/108705187, every long edge within 0.3°). Anchor = the centroid of that
 * outline, -90.2081157, 38.6281556.
 *
 * One landmark: the headhouse on Market Street, the Midway behind it and the
 * train shed south of that. OSM maps them as one outline (way/108705187,
 * NHL, 59,000 m²) with the headhouse (way/481462775) and the clock tower
 * (way/481462774) drawn again on top, so the model owns all of it.
 *
 * Identity (from the photos below):
 *  1. The clock tower at the east end of the front: a tall square limestone
 *     shaft with a stack of slit windows, a clock on each face under a
 *     corbelled frieze, a belfry stage with lunettes, a bracketed eave and a
 *     steep red-tile pyramid; a round stair turret on its north-west corner
 *     rises past the eave to a pointed stone spire.        (tower, boucher)
 *  2. Steep red-tile roofs over rock-faced grey limestone: the big hip roof
 *     over the Grand Hall, two round turrets with tall cones flanking the
 *     Grand Hall front, the east pavilion's tall pyramid hip, the hotel
 *     wing's long roof with Flemish-gabled dormers and the west pavilion's
 *     gable.                                   (batt, lemay215, boucher)
 *  3. Round arches: the Grand Hall's six arched windows over its entrance,
 *     the hotel wing's ground-floor arcade with a balustraded terrace on top.
 *  4. Behind it the vast grey train shed: a broad, shallow arched roof across
 *     the main span with lean-tos either side, striped across its length by
 *     sunken glazed bands, a raised monitor down the middle.
 *                                                 (NAIP, lidar, highsmith)
 *
 * Evidence:
 *  - plan: OSM way/108705187 (outline), way/481462775 (headhouse),
 *    way/481462774 (tower), way/1297482014 (west canopy), all turned to the
 *    model frame; USGS NAIP for the roofs.
 *  - heights: USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018 (2017
 *    flight), 1 m grid over the whole site and 0.5 m over the tower, read in
 *    the model frame above 136.7 m (the lowest ground under the footprint,
 *    at the shed's west side). Market Street in front rises from 3 m (west)
 *    to 7 m (east) above that. Measured: tower eave 65.1; the pyramid's slopes
 *    rise ~2:1 (67.3 at 1 m in from the eave, 71.5 at 3 m), so its sharp
 *    apex, which the cells miss (72.1 read at the centre), is at ≈77; drawn
 *    77.5, which is also 230 ft (published) above Market Street. Turret
 *    spire 73.9+ read, drawn 77.3 (level with the apex in boucher); tower
 *    plan 9.6 m square at x 73.2–82.8, y 132–141.6, turret at the NW
 *    corner; Grand Hall hip ridge 37.3 (x 30–50, y 129), eaves 26–28; east
 *    pavilion hip peak 45–46 at x 88, eaves 27; hotel wing ridge 30 at y
 *    125.5, eaves 22–24, front terrace 13.8–14; west pavilion ridge 32.5
 *    along y at x −64; turret cones 32.1 (east), ~30 (west); Midway roof
 *    13.8; west annex 14, west low block 9.3; shed: main span symmetric
 *    about x 9, h = 27.9 − 0.0019·d², from x −56.5 to 74.5, monitor 30.3 at
 *    x 3–15, lean-tos 16.4 → 10.0 at the outer walls; sunken bands 3.1 m
 *    lower, 7 m wide, every 18 m (high bands at y −145+18k … −134+18k).
 *    OSM tower height=70 (published 230 ft); the model stands ≈70 m above
 *    Market Street to the turret spire.
 *  - Mapterhorn terrain: ~4.4–5.5 m above 132.6 m under the shed, Market
 *    Street 7–12 m: the north front sinks 3–7 m into the street, so its
 *    doors and windows start at the street (g(x) below). Elevation 0.
 *  - estimated from the photos (scaled from the tower's 9.6 m width):
 *    the tower's stages (shaft 9.0 m to 47, clock stage 9.6 m above),
 *    the
 *    turret's Ø3.3 m, window and arch sizes, the doors. Review round 1:
 *    the tower top re-measured front-on in boucher (16.5 px/m on the 9.6 m
 *    face): clock centre 52.7, Ø3.1; corbel band 57.4–60.2; frieze to
 *    62.3; lunette stage to the eave at 65.1; eave projecting 0.55 m; the
 *    turret's tall paired openings 65.9–70.8. The Flemish gables (four on
 *    the hotel wing, three on the Grand Hall front) are stepped walls with
 *    shoulder pinnacles and a finial (lemay215, marelbu_aloe); their peaks
 *    (31.2, 33.4) sit 1.8–3 m over the 1 m lidar's 29.4 / 30.5, which
 *    undersamples thin gable walls. The east pavilion's front: a steep
 *    hipped roof with a finial over its middle bay and slim pinnacle
 *    turrets (boucher). No round turret stands there: OSM's outline is
 *    straight and boucher shows a flat wall; the big cones in lemay215 and
 *    batt are the two flanking the Grand Hall.
 *  - left out: chimneys, the shed's
 *    trusses and red arches, the hotel and aquarium buildings inside the
 *    shed (hidden by its roof), the porte-cochère canopy.
 *
 * Night: the tower and the headhouse front are floodlit; the windows and
 *   the clock faces glow; the shed's glazed bands stay dark (glass).
 *
 * Photos (all EVIDENCE):
 *  batt     "St. Louis Union Station (17577826564).jpg", Dustin Batt,
 *           CC BY-SA 2.0 (north front from Aloe Plaza)
 *           https://commons.wikimedia.org/wiki/File:St._Louis_Union_Station_(17577826564).jpg
 *  lemay215 "St. Louis Union Station, Market Street, St. Louis, MO -
 *           53050963215.jpg", w_lemay, CC BY-SA 2.0 (north front from the
 *           west) https://commons.wikimedia.org/wiki/File:St._Louis_Union_Station,_Market_Street,_St._Louis,_MO_-_53050963215.jpg
 *  tower    "Tower, St. Louis Union Station, Market Street, St. Louis,
 *           MO.jpg", w_lemay, CC BY-SA 2.0 (the tower top)
 *           https://commons.wikimedia.org/wiki/File:Tower,_St._Louis_Union_Station,_Market_Street,_St._Louis,_MO.jpg
 *  boucher  "St. Louis Union Station (1986).jpg", Jack Boucher (HABS),
 *           public domain (from the north-east: tower, east pavilion)
 *           https://commons.wikimedia.org/wiki/File:St._Louis_Union_Station_(1986).jpg
 *  marelbu_aloe "St. Louis, Missouri, USA - Aloe Plaza - Carl Milles fountain
 *           The Meeting of the Waters 1936-40 - Union Station - panoramio.jpg",
 *           MARELBU, CC BY 3.0 (the Grand Hall front and its gables)
 *           https://commons.wikimedia.org/wiki/File:St._Louis,_Missouri,_USA_-_Aloe_Plaza_-_Carl_Milles_fountain_The_Meeting_of_the_Waters_1936-40_-_Union_Station_-_panoramio.jpg
 *  aloe1983 "St. Louis Union Station & The Aloe Plaza (1983).jpg",
 *           Dwaynep2018, CC BY-SA 4.0
 *           https://commons.wikimedia.org/wiki/File:St._Louis_Union_Station_%26_The_Aloe_Plaza_(1983).jpg
 *  artistmac "St. Louis' Union Station", artistmac, CC BY-SA 2.0 (the
 *           18th Street entrance and the shed's east side)
 *           https://www.flickr.com/photos/26329029@N06/7173191659
 *  highsmith "Ferris wheel called, simply, 'The St. Louis Wheel'", Carol M.
 *           Highsmith, CC0 (the shed's south end behind the wheel)
 *           https://www.loc.gov/item/2020742812/
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the shed's south and west sides are seen only far off; their
 * walls are drawn as plain glazing. The west annex and west block are drawn
 * as plain boxes. The hotel wing's dormer count and spacing are read from
 * the lidar and two oblique photos.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, capPoly, ccw, onWall, prism, rectShape, revolve, save, type XY } from './atl-tech-tower'

const stone = new Part(), tile = new Part(), roof = new Part(), win = new Part(), glass = new Part(), door = new Part()

// ─────────────────────────────── helpers ───────────────────────────────
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
/** A flat convex polygon, wound to face along `out`. */
function face(p: Part, pts: V3[], out: V3) {
  const n = crs(sub3(pts[1], pts[0]), sub3(pts[2], pts[0]))
  const q = n[0] * out[0] + n[1] * out[1] + n[2] * out[2] < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
/** A box with plain walls and a top in `top`. */
const block = (w: Part, top: Part | null, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bev = 0.3) =>
  prism(w, rect(x0, x1, y0, y1), z0, z1, top, bev)

/**
 * A hip roof over [x0,x1]×[y0,y1] (plus `over`) with eaves at z0 and a ridge
 * from r0 to r1 at z1; the ridge may sit off centre.
 */
function hip(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, r0: XY, r1: XY, z1: number, over = 0.6) {
  x0 -= over; x1 += over; y0 -= over; y1 += over
  const a: V3 = [x0, y0, z0], b: V3 = [x1, y0, z0], c: V3 = [x1, y1, z0], d: V3 = [x0, y1, z0]
  const R0: V3 = [r0[0], r0[1], z1], R1: V3 = [r1[0], r1[1], z1]
  // r0 is the south / west end of the ridge
  if (Math.abs(r1[0] - r0[0]) >= Math.abs(r1[1] - r0[1])) {
    face(p, [a, b, R1, R0], [0, -1, 1]); face(p, [c, d, R0, R1], [0, 1, 1])
    face(p, [b, c, R1], [1, 0, 1]); face(p, [d, a, R0], [-1, 0, 1])
  } else {
    face(p, [b, c, R1, R0], [1, 0, 1]); face(p, [d, a, R0, R1], [-1, 0, 1])
    face(p, [a, b, R0], [0, -1, 1]); face(p, [c, d, R1], [0, 1, 1])
  }
  face(p, [a, d, c, b], [0, 0, -1])
}

/**
 * A gable roof, ridge along y at x = xr (gable ends north and south) or along
 * x at y = yr; gable triangles in `gab`.
 */
function gableY(p: Part, gab: Part | null, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, over = 0.5, rake = 0.4) {
  const xm = (x0 + x1) / 2, s = (z1 - z0) / ((x1 - x0) / 2), lo = z0 - over * s
  const A: V3 = [x0 - over, y0 - rake, lo], B: V3 = [xm, y0 - rake, z1], C: V3 = [x1 + over, y0 - rake, lo]
  const A2: V3 = [x0 - over, y1 + rake, lo], B2: V3 = [xm, y1 + rake, z1], C2: V3 = [x1 + over, y1 + rake, lo]
  face(p, [A, A2, B2, B], [-1, 0, 1]); face(p, [C, B, B2, C2], [1, 0, 1]); face(p, [A, C, C2, A2], [0, 0, -1])
  face(p, [[A[0], A[1], lo - 0.3], [C[0], C[1], lo - 0.3], C, B, A], [0, -1, 0])
  face(p, [[A2[0], A2[1], lo - 0.3], [C2[0], C2[1], lo - 0.3], C2, B2, A2], [0, 1, 0])
  if (gab) {
    face(gab, [[x0, y0, z0], [x1, y0, z0], [xm, y0, z1 - 0.05]], [0, -1, 0])
    face(gab, [[x0, y1, z0], [x1, y1, z0], [xm, y1, z1 - 0.05]], [0, 1, 0])
  }
}
function gableX(p: Part, gab: Part | null, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, over = 0.5, rake = 0.4, yr = (y0 + y1) / 2) {
  const sS = (z1 - z0) / (yr - y0), sN = (z1 - z0) / (y1 - yr)
  const A: V3 = [x0 - rake, y0 - over, z0 - over * sS], B: V3 = [x0 - rake, yr, z1], C: V3 = [x0 - rake, y1 + over, z0 - over * sN]
  const A2: V3 = [x1 + rake, y0 - over, z0 - over * sS], B2: V3 = [x1 + rake, yr, z1], C2: V3 = [x1 + rake, y1 + over, z0 - over * sN]
  face(p, [A, A2, B2, B], [0, -1, 1]); face(p, [C, B, B2, C2], [0, 1, 1]); face(p, [A, C, C2, A2], [0, 0, -1])
  face(p, [[A[0], A[1], A[2] - 0.3], [C[0], C[1], C[2] - 0.3], C, B, A], [-1, 0, 0])
  face(p, [[A2[0], A2[1], A2[2] - 0.3], [C2[0], C2[1], C2[2] - 0.3], C2, B2, A2], [1, 0, 0])
  if (gab) {
    face(gab, [[x0, y0, z0], [x0, y1, z0], [x0, yr, z1 - 0.05]], [-1, 0, 0])
    face(gab, [[x1, y0, z0], [x1, y1, z0], [x1, yr, z1 - 0.05]], [1, 0, 0])
  }
}
/** A round turret: drum to z1, a small ledge, a cone to apex. */
function turret(c: XY, r: number, z0: number, z1: number, apex: number, n = 14) {
  revolve(stone, c, [[r, z0], [r, z1 - 0.6], [r + 0.25, z1 - 0.4], [r + 0.25, z1]], n, 0, false, false)
  revolve(tile, c, [[r + 0.45, z1], [r * 0.55, z1 + (apex - z1) * 0.45], [0, apex]], n, 0, false, true)
}
/** A convex outline [s, z] extruded back from a north-facing wall plane at y, 0.6 m thick. */
function slabN(p: Part, xc: number, y: number, pts: [number, number][], t = 0.6) {
  const F = pts.map(([u, z]) => [xc + u, y, z] as V3), B = pts.map(([u, z]) => [xc + u, y - t, z] as V3)
  face(p, F, [0, 1, 0]); face(p, B, [0, -1, 0])
  const cx = pts.reduce((a, q) => a + q[0], 0) / pts.length, cz = pts.reduce((a, q) => a + q[1], 0) / pts.length
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length, nx = pts[j][1] - pts[i][1], nz = -(pts[j][0] - pts[i][0])
    const sg = nx * (pts[i][0] - cx) + nz * (pts[i][1] - cz) > 0 ? 1 : -1
    face(p, [F[i], F[j], B[j], B[i]], [nx * sg, 0, nz * sg])
  }
}
/** A pinnacle: a square shaft with a pointed cap. */
function pinnacle(x: number, y: number, z0: number, z1: number, h = 0.32) {
  prism(stone, rect(x - h, x + h, y - h, y + h), z0, z1, null, 0.05)
  const a: V3[] = [[x - h - 0.05, y - h - 0.05, z1], [x + h + 0.05, y - h - 0.05, z1], [x + h + 0.05, y + h + 0.05, z1], [x - h - 0.05, y + h + 0.05, z1]]
  for (let i = 0; i < 4; i++) face(stone, [a[i], a[(i + 1) % 4], [x, y, z1 + 1.6]], [a[i][0] + a[(i + 1) % 4][0] - 2 * x, a[i][1] + a[(i + 1) % 4][1] - 2 * y, 0.3])
}
/**
 * A stepped Flemish gable on a north wall plane at y: a wide base to zStep,
 * shouldered in to w2, steep sides up to the apex, pinnacles on the outer
 * shoulders and a finial at the top (lemay215, aloe photos).
 */
function flemish(xc: number, y: number, z0: number, w: number, zStep: number, w2: number, zSh: number, zApex: number) {
  slabN(stone, xc, y, [[-w, z0], [w, z0], [w, zStep], [-w, zStep]])
  slabN(stone, xc, y, [[-w2, zStep - 0.01], [w2, zStep - 0.01], [w2, zSh], [0, zApex], [-w2, zSh]])
  for (const sd of [-1, 1]) pinnacle(xc + sd * (w - 0.3), y - 0.3, zStep, zStep + 2.2)
  pinnacle(xc, y - 0.3, zApex - 0.6, zApex + 0.6, 0.28)
  // its roof back into the main slope
  gableY(tile, null, xc - w2 + 0.1, xc + w2 - 0.1, y - 7, y - 0.6, zSh, zApex - 0.4, 0.15, 0)
}
/** Street level along the Market Street front (lidar ground at y 147–155). */
const g = (x: number) => 3.0 + 0.028 * Math.max(0, x + 30)

// The north front: a wall from east (a) to west (b) at y, outside to the north.
const north = (y: number, xe: number, xw: number) => ({ a: [xe, y] as XY, b: [xw, y] as XY, s: (x: number) => xe - x })
const south = (y: number, xw: number, xe: number) => ({ a: [xw, y] as XY, b: [xe, y] as XY, s: (x: number) => x - xw })
const east = (x: number, ys: number, yn: number) => ({ a: [x, ys] as XY, b: [x, yn] as XY, s: (y: number) => y - ys })
const west = (x: number, yn: number, ys: number) => ({ a: [x, yn] as XY, b: [x, ys] as XY, s: (y: number) => yn - y })

// ───────────────────────────── the train shed ─────────────────────────────
const SY0 = -153, SY1 = 93, SXW = -83.4, SXE = 100.5
const XC = 9, D_MAIN = 65.5
const pMain = (x: number) => 27.9 - 0.0019 * (x - XC) ** 2
const pLean = (x: number) => 16.4 - 0.24 * (Math.abs(x - XC) - D_MAIN)
const MX0 = XC - D_MAIN, MX1 = XC + D_MAIN
const SINK = 3.1
// bands across the length: high strips at y −145+18k … −134+18k, k = 0..12
const bands: Array<[number, number, boolean]> = []
{
  let y = SY0
  for (let k = 0; k <= 12; k++) {
    const h0 = -145 + 18 * k, h1 = -134 + 18 * k
    bands.push([y, h0, false], [h0, h1, true])
    y = h1
  }
  bands.push([y, SY1, false])
}
const mxs: number[] = []
for (let i = 0; i <= 20; i++) mxs.push(MX0 + ((MX1 - MX0) * i) / 20)
for (const [y0, y1, high] of bands) {
  const o = high ? 0 : -SINK
  const P = high ? roof : glass
  for (let i = 0; i < mxs.length - 1; i++) {
    const xa = mxs[i], xb = mxs[i + 1]
    face(P, [[xa, y0, pMain(xa) + o], [xb, y0, pMain(xb) + o], [xb, y1, pMain(xb) + o], [xa, y1, pMain(xa) + o]], [0, 0, 1])
  }
  if (!high) continue
  // the clerestory steps down to the sunken bands either side
  for (const [y, dir] of [[y0, -1], [y1, 1]] as [number, number][]) {
    for (let i = 0; i < mxs.length - 1; i++) {
      const xa = mxs[i], xb = mxs[i + 1]
      face(glass, [[xa, y, pMain(xa) - SINK], [xb, y, pMain(xb) - SINK], [xb, y, pMain(xb)], [xa, y, pMain(xa)]], [0, dir, 0])
    }
  }
}
// lean-tos, west and east: one plane each
for (const [xo, xi] of [[SXW, MX0], [SXE, MX1]]) {
  const out: V3 = xo < xi ? [-0.24, 0, 1] : [0.24, 0, 1]
  face(roof, [[xo, SY0, pLean(xo)], [xi, SY0, pLean(xi)], [xi, SY1, pLean(xi)], [xo, SY1, pLean(xo)]], out)
  // the step up to the main span (clerestory)
  const dir = xo < xi ? -1 : 1
  for (const [y0, y1, high] of bands) {
    const top = pMain(xi) - (high ? 0 : SINK)
    face(glass, [[xi, y0, pLean(xi)], [xi, y1, pLean(xi)], [xi, y1, top], [xi, y0, top]], [dir, 0, 0])
  }
  // outer wall: glazed between the trusses, down to the ground
  face(glass, [[xo, SY0, 0], [xo, SY1, 0], [xo, SY1, pLean(xo)], [xo, SY0, pLean(xo)]], [dir, 0, 0])
}
// the end walls under the profile: south (glazed, to the ground) and north (over the Midway)
{
  const segs: Array<[number, number, number, number]> = [[SXW, pLean(SXW), MX0, pLean(MX0)], [MX0, pLean(MX0), MX0, pMain(MX0) - SINK]]
  for (let i = 0; i < mxs.length - 1; i++) segs.push([mxs[i], pMain(mxs[i]) - SINK, mxs[i + 1], pMain(mxs[i + 1]) - SINK])
  segs.push([MX1, pMain(MX1) - SINK, MX1, pLean(MX1)], [MX1, pLean(MX1), SXE, pLean(SXE)])
  for (const [y, z0, dir] of [[SY0, 0, -1], [SY1, 13.8, 1]] as [number, number, number][]) {
    for (const [xa, za, xb, zb] of segs) {
      if (xa === xb) continue
      face(glass, [[xa, y, z0], [xb, y, z0], [xb, y, zb], [xa, y, za]], [0, dir, 0])
    }
    // the steps up from the lean-tos, seen end-on: fill under the main span's edge
    face(glass, [[MX0, y, z0], [MX0 + 0.01, y, z0], [MX0 + 0.01, y, pMain(MX0) - SINK], [MX0, y, pMain(MX0) - SINK]], [0, dir, 0])
  }
}
// the monitor down the middle
prism(glass, rect(3, 15, SY0, SY1), 26.6, 30.3, roof, 0.2)

// ───────────────────────────── low blocks ─────────────────────────────
// West low block (lidar 9.3) and the Midway (13.8) with its 18th Street entrance.
prism(stone, ccw([[-123.1, 95.3], [-123.1, 7.8], [-114.2, 7.8], [-114.2, -0.1], [-97.7, -0.1], [-97.7, -8.3], [SXW, -8.3], [SXW, 95.3]]), 0, 9.3, roof, 0.3)
prism(stone, ccw([[-84.4, 115.7], [-84.4, 93], [100.4, 93], [100.4, 115.7]]), 0, 13.8, roof, 0.3)
// west annex (14) on its stepped corner, and the canopy round it (7.4)
prism(stone, ccw([[-126.5, 140.4], [-126.5, 134.2], [-122.8, 134.2], [-122.8, 126.8], [-118.2, 126.8], [-118.2, 121], [-112.8, 121], [-112.8, 115.7], [-73, 115.7], [-73, 140.4]]), 0, 14, roof, 0.3)
{
  const can: XY[] = ccw([[-126.5, 133.9], [-126.5, 123.2], [-121.3, 123.2], [-121.3, 117.5], [-115.7, 117.5], [-115.8, 112.7], [-84.8, 112.7], [-84.8, 115.7], [-112.8, 115.7], [-112.8, 121], [-118.2, 121], [-118.2, 126.8], [-122.8, 126.8], [-122.8, 133.9]])
  prism(stone, can, 6.8, 7.5, roof, 0.1, true)
  for (const [x, y] of [[-125.6, 124.2], [-120.4, 118.4], [-114.8, 113.6], [-100, 113.6], [-86, 113.6]] as XY[]) prism(stone, rect(x - 0.35, x + 0.35, y - 0.35, y + 0.35), 0, 6.8, null, 0)
}
// 18th Street entrance on the Midway's east end: two stone gables (artistmac)
prism(stone, rect(100.4, 104.5, 96.9, 116.2), 0, 11.5, null, 0.2)
gableX(tile, stone, 100.4, 104.5, 96.9, 116.2, 11.5, 14.2, 0.3, 0.3)
for (const yc of [101.5, 111.6]) {
  face(stone, [[104.5, yc - 3.6, 11.5], [104.5, yc + 3.6, 11.5], [104.5, yc, 15]], [1, 0, 0])
  onWall(door, [104.5, yc - 3], [104.5, yc + 3], archShape(3, 3.6, 5.2, 8.4, 8), 0.06)
}

// ───────────────────────────── the headhouse ─────────────────────────────
const YF = 140.6, YR = 115.7, YU = 134.6 // front, rear, hotel wing's upper wall
// west pavilion: gable ends north and south, to the street line
prism(stone, rect(-73, -54.3, YR, 142.3), 0, 23, null, 0.3)
gableY(tile, stone, -73, -54.3, YR, 142.3, 23, 33.5, 0.6, 0.5)
// its north gable carries a stone finial
prism(stone, rect(-64.3, -62.9, 142.1, 143), 31.5, 35.4, null, 0.2)

// hotel wing: arcade and terrace to the street, upper floors set back
prism(stone, rect(-54.3, 14, YU, YF), 0, 14, roof, 0.25)
prism(stone, rect(-54.6, 14, YF - 0.25, YF + 0.25), 14, 15.1, null, 0.15) // terrace balustrade
prism(stone, rect(-54.3, 14, YR, YU), 0, 22.5, null, 0.3)
gableX(tile, null, -54.3, 14, YR, YU, 22.5, 30, 0.6, 0.0, 125.5)
// Flemish-gabled dormers on the north slope, flush with the upper wall
const DORMERS = [-43, -28.7, -14.4, -0.1]
for (const xc of DORMERS) {
  flemish(xc, YU, 22.5, 3.2, 25, 2.6, 26.6, 31.2)
  for (const dx of [-1.1, 1.1]) onWall(win, [xc + 3.2, YU], [xc - 3.2, YU], rectShape(3.2 + dx - 0.75, 3.2 + dx + 0.75, 22.9, 25.8), 0.05)
  onWall(win, [xc + 3.2, YU], [xc - 3.2, YU], archShape(3.2, 1.2, 26.6, 28.2, 6), 0.05)
}

// Grand Hall front: straight up to the eave, big hip roof
prism(stone, rect(14, 64, YR, YF), 0, 26.5, null, 0.3)
hip(tile, 14, 64, YR, YF, 26.5, [30, 129], [50, 129], 37.3, 0.7)
const GH_GABLES = [32.5, 39.5, 46.5]
for (const xc of GH_GABLES) {
  flemish(xc, YF, 26.5, 2.9, 28.6, 2.4, 29.6, 33.4)
  onWall(win, [xc + 2.9, YF], [xc - 2.9, YF], archShape(2.9, 1.7, 27.2, 29.6, 6), 0.05)
}
// between the east turret and the tower: arcade and terrace, upper wall set back
prism(stone, rect(64, 73.2, YU, YF), 0, 14, roof, 0.25)
prism(stone, rect(64, 73.2, YR, YU), 0, 23.5, null, 0.3)
gableX(tile, null, 64, 73.2, YR, YU, 23.5, 29.5, 0.5, 0.0, 125.5)
// the two round turrets flanking the Grand Hall front
const T1: XY = [17.3, 142.4], T2: XY = [61.3, 142.3]
turret(T1, 3.8, 0, 25.2, 32.5)
turret(T2, 3.7, 0, 25.6, 34.5)

// East pavilion: tall hip with its peak toward the tower, a north cross gable, a corner turret
prism(stone, rect(82.8, 100.3, YR, 141.5), 0, 27, null, 0.3)
hip(tile, 82.8, 100.3, YR, 141.5, 27, [88.5, 125], [88.5, 131], 45.5, 0.7)
prism(stone, rect(90.5, 99, 136, 141.5), 27, 28.2, null, 0.2)
hip(tile, 90.5, 99, 133, 141.5, 28.2, [94.75, 136.9], [94.75, 137.6], 37.5, 0.4)
pinnacle(94.75, 137.25, 37.2, 38.4, 0.25)
turret([91, 141.6], 1.0, 14, 28.5, 32.5, 10)
turret([100.1, 141.3], 1.7, 6, 29.5, 35.5, 12)
turret([84.3, 141.4], 1.4, 8, 28.5, 33.5, 12)

// ── The clock tower ──
const TX0 = 73.2, TX1 = 82.8, TY0 = 132, TY1 = 141.6, TC: XY = [(TX0 + TX1) / 2, (TY0 + TY1) / 2]
const sq = (h: number): XY[] => rect(TC[0] - h, TC[0] + h, TC[1] - h, TC[1] + h)
prism(stone, sq(4.5), 0, 46.6, null, 0)
// corbelled out to the clock stage
stone.loft([sq(4.5).map(([x, y]) => [x, y, 46.6] as V3), sq(4.8).map(([x, y]) => [x, y, 48.4] as V3)])
prism(stone, sq(4.8), 48.4, 57.4, null, 0)
// the corbelled frieze: a band standing out, then the belfry stage
stone.loft([sq(4.8).map(([x, y]) => [x, y, 57.4] as V3), sq(5.15).map(([x, y]) => [x, y, 60.2] as V3)])
prism(stone, sq(5.15), 60.2, 62.3, null, 0.2)
prism(stone, sq(4.7), 62.3, 65.1, null, 0)
// bracketed eave and the steep pyramid
{
  const e = 5.35, a = sq(e).map(([x, y]) => [x, y, 65.1] as V3)
  face(tile, [...a], [0, 0, -1])
  const apex: V3 = [TC[0], TC[1], 77.5]
  for (let i = 0; i < 4; i++) face(tile, [a[i], a[(i + 1) % 4], apex], [a[i][0] + a[(i + 1) % 4][0] - 2 * TC[0], a[i][1] + a[(i + 1) % 4][1] - 2 * TC[1], 1])
  const b = sq(e).map(([x, y]) => [x, y, 64.5] as V3)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    face(stone, [b[i], b[j], a[j], a[i]], [b[i][0] + b[j][0] - 2 * TC[0], b[i][1] + b[j][1] - 2 * TC[1], 0])
  }
  face(stone, b, [0, 0, -1])
}
// the NW stair turret, up past the eave to a stone spire
{
  const c: XY = [TX0 + 0.55, TY1 - 0.55]
  revolve(stone, c, [[1.65, 20], [1.65, 71.2], [1.9, 71.4], [1.9, 71.9], [1.55, 71.9], [0, 77.3]], 8, Math.PI / 8, true, false)
  for (let i = 0; i < 8; i++) {
    const a0 = Math.PI / 8 + (i / 8) * Math.PI * 2, a1 = a0 + Math.PI / 4, r = 1.65 / Math.cos(Math.PI / 8)
    const p0: XY = [c[0] + r * Math.cos(a0), c[1] + r * Math.sin(a0)], p1: XY = [c[0] + r * Math.cos(a1), c[1] + r * Math.sin(a1)]
    const mid = [(p0[0] + p1[0]) / 2 - c[0], (p0[1] + p1[1]) / 2 - c[1]]
    if (mid[0] > 0.3 && mid[1] < -0.3) continue // inside the tower
    if (mid[0] < -0.3 || mid[1] > 0.3 || i % 2 === 0) onWall(win, p0, p1, rectShape(0.2, 1.06, 65.9, 70.8), 0.04)
  }
}
// faces: clocks, the frieze's dark bays, belfry lunettes, the slit windows
const TFACES = [
  { a: [TX1, TY1] as XY, b: [TX0, TY1] as XY, out: 4.8 }, // north (east → west)
  { a: [TX0, TY1] as XY, b: [TX0, TY0] as XY, out: 4.8 }, // west
  { a: [TX0, TY0] as XY, b: [TX1, TY0] as XY, out: 4.8 }, // south
  { a: [TX1, TY0] as XY, b: [TX1, TY1] as XY, out: 4.8 }, // east
]
const clock = (r: number, zc: number, s: number): [number, number][] => Array.from({ length: 14 }, (_, k) => [s + r * Math.cos((k / 14) * Math.PI * 2), zc + r * Math.sin((k / 14) * Math.PI * 2)])
for (const f of TFACES) {
  // move the face out to each stage
  const along = (d: number) => {
    const L = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1]), t: XY = [(f.b[0] - f.a[0]) / L, (f.b[1] - f.a[1]) / L], n: XY = [t[1], -t[0]]
    const m: XY = [(f.a[0] + f.b[0]) / 2, (f.a[1] + f.b[1]) / 2]
    const k = d - 4.8
    return { a: [f.a[0] + n[0] * k - t[0] * k, f.a[1] + n[1] * k - t[1] * k] as XY, b: [f.b[0] + n[0] * k + t[0] * k, f.b[1] + n[1] * k + t[1] * k] as XY, half: L / 2 + k, m }
  }
  const s48 = along(4.8), s45 = along(4.5), s47 = along(4.7)
  onWall(win, s48.a, s48.b, clock(1.55, 52.7, s48.half), 0.06)
  onWall(win, s47.a, s47.b, archShape(s47.half, 2.2, 62.6, 63.8, 8), 0.05)
  for (const z of [22.5, 27.5, 32.5, 37.5, 42.3]) onWall(win, s45.a, s45.b, rectShape(s45.half - 0.4, s45.half + 0.4, z, z + 3), 0.05)
}

// ── Doors and windows on the headhouse front ──
const N_HW = north(YF, 14, -54.3)
// arcade: round arches every 6.2 m, glazed, doors in the middle three
for (let k = 0; k < 11; k++) {
  const x = 10.9 - k * 6.2, z0 = g(x)
  onWall(Math.abs(k - 5) <= 1 ? door : win, N_HW.a, N_HW.b, archShape(N_HW.s(x), 3.6, z0, z0 + 5.6, 8), 0.06)
}
// hotel wing upper floors: two-storey panels per bay, set-back wall at YU
const N_UP = north(YU, 14, -54.3)
for (let x = 11; x > -53; x -= 3.4) {
  if (DORMERS.some((d) => Math.abs(d - x) < 3.3)) continue
  for (const [z0, z1] of [[15.4, 18.4], [19.0, 21.8]]) onWall(win, N_UP.a, N_UP.b, rectShape(N_UP.s(x) - 0.9, N_UP.s(x) + 0.9, z0, z1), 0.05)
}
for (const xc of DORMERS) for (const [z0, z1] of [[15.4, 18.4], [19.0, 21.8]]) for (const dx of [-1.25, 1.25]) onWall(win, N_UP.a, N_UP.b, rectShape(N_UP.s(xc + dx) - 0.8, N_UP.s(xc + dx) + 0.8, z0, z1), 0.05)
// west pavilion front: windows over a door
{
  const W = north(142.3, -54.3, -73)
  for (const [z0, z1] of [[9, 13.5], [15, 21.5]]) for (const x of [-68.5, -63.6, -58.7]) onWall(win, W.a, W.b, rectShape(W.s(x) - 1.1, W.s(x) + 1.1, z0, z1), 0.05)
  onWall(win, W.a, W.b, archShape(W.s(-63.6), 2.6, 24, 26.4, 6), 0.05)
  onWall(door, W.a, W.b, archShape(W.s(-63.6), 3, g(-63.6), g(-63.6) + 3.4, 6), 0.05)
}
// Grand Hall front: the entrance arches below, six round-arched windows above
{
  const G = north(YF, 64, 14)
  for (const x of [31, 39.5, 48]) onWall(door, G.a, G.b, archShape(G.s(x), 4.4, g(x), g(x) + 5, 8), 0.06)
  for (const x of [24.5, 55]) onWall(win, G.a, G.b, archShape(G.s(x), 2.6, g(x) + 1.5, g(x) + 5.5, 6), 0.06)
  for (let k = 0; k < 6; k++) {
    const x = 27.3 + k * 4.85
    onWall(win, G.a, G.b, archShape(G.s(x), 3, 13.6, 20.4, 8), 0.06)
  }
  for (const x of [22, 58]) for (const [z0, z1] of [[14, 17.5], [19, 22.5]]) onWall(win, G.a, G.b, rectShape(G.s(x) - 0.8, G.s(x) + 0.8, z0, z1), 0.05)
}
// the turrets' windows (front half) and the strip between turret and tower
for (const [c, r] of [[T1, 3.8], [T2, 3.7]] as [XY, number][]) {
  for (let k = -2; k <= 2; k++) {
    const a = Math.PI / 2 + (k * Math.PI) / 7, a0 = a - Math.PI / 14, a1 = a + Math.PI / 14
    const p0: XY = [c[0] + r * Math.cos(a1), c[1] + r * Math.sin(a1)], p1: XY = [c[0] + r * Math.cos(a0), c[1] + r * Math.sin(a0)]
    const half = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / 2
    for (const [z0, z1] of [[10, 13], [15, 18.5], [20, 23.5]]) onWall(win, p1, p0, rectShape(half - 0.55, half + 0.55, z0, z1), 0.08)
  }
}
{
  const E = north(YU, 73.2, 64)
  for (const x of [66.6, 70.4]) for (const [z0, z1] of [[15.4, 18.4], [19.0, 21.8]]) onWall(win, E.a, E.b, rectShape(E.s(x) - 0.8, E.s(x) + 0.8, z0, z1), 0.05)
  const A = north(YF, 73.2, 64)
  onWall(win, A.a, A.b, archShape(A.s(68.6), 3.4, g(68.6), g(68.6) + 5.2, 8), 0.06)
}
// east pavilion: north and east faces
{
  const N = north(141.5, 100.3, 82.8)
  for (const x of [86, 94.75]) onWall(win, N.a, N.b, archShape(N.s(x), 2.6, g(x) + 1, g(x) + 5.4, 6), 0.06)
  for (const x of [92.5, 97]) for (const [z0, z1] of [[13, 17.5], [19, 23.5]]) onWall(win, N.a, N.b, rectShape(N.s(x) - 1, N.s(x) + 1, z0, z1), 0.05)
  for (const [z0, z1] of [[13, 17.5], [19, 23.5]]) onWall(win, N.a, N.b, rectShape(N.s(86) - 1, N.s(86) + 1, z0, z1), 0.05)
  onWall(win, [99, 141.5], [90.5, 141.5], archShape(4.25, 2.2, 28.8, 31.2, 6), 0.05)
  const E = east(100.3, YR, 141.5)
  for (let y = 119.5; y < 139; y += 4.2) {
    for (const [z0, z1] of [[13, 17.5], [19, 23.5]]) onWall(win, E.a, E.b, rectShape(E.s(y) - 1, E.s(y) + 1, z0, z1), 0.05)
    onWall(win, E.a, E.b, archShape(E.s(y), 2.4, 6.5, 10, 6), 0.05)
  }
}
// the rear (south) face above the Midway roof: hotel rooms and the Grand Hall
{
  const S = south(YR, -73, 100.3)
  for (let x = -70.5; x < 99; x += 3.6) {
    if (x > 72.5 && x < 83.5) continue
    for (const [z0, z1] of [[15.6, 18.6], [19.3, 22.1]]) onWall(win, S.a, S.b, rectShape(S.s(x) - 0.9, S.s(x) + 0.9, z0, z1), 0.05)
  }
}
// west faces of the west pavilion above the annex, and the annex's west windows
{
  const W = west(-73, 142.3, YR)
  for (let y = 139; y > 117; y -= 3.6) onWall(win, W.a, W.b, rectShape(W.s(y) - 0.9, W.s(y) + 0.9, 15.5, 21), 0.05)
  const A = west(-126.5, 140.4, 134.2)
  onWall(win, A.a, A.b, rectShape(0.8, 5.4, 8.5, 12.5), 0.05)
  const N = north(140.4, -73, -126.5)
  for (let x = -77; x > -125; x -= 4.4) onWall(win, N.a, N.b, rectShape(N.s(x) - 1.2, N.s(x) + 1.2, 8.5, 12.5), 0.05)
}

const floodlit = (p: V3, n: V3) => {
  if (n[2] > 0.8) return 0.1
  if (p[0] > TX0 - 1 && p[0] < TX1 + 1 && p[1] > TY0 - 1 && p[1] < TY1 + 1) return p[2] > 40 ? 1 : 0.7
  if (p[1] > YF - 2 && n[1] > 0.3) return 0.8 // the Market Street front
  if (p[1] > YR - 0.5) return 0.4
  return 0
}
await save('stl-union-station', 'St. Louis Union Station', [
  { part: stone, material: { ...finish('stl-limestone', 0xe4dccd), floodlight: floodlit } },
  { part: tile, material: finish('stl-red-tile', 0xb35a42, 0.9) },
  { part: roof, material: finish('stl-shed-roof', 0x8f979d) },
  { part: win, material: PALETTE.window },
  { part: glass, material: finish('glass', 0xa6bccb, 0.3) },
  { part: door, material: finish('stl-door', 0x6e5c4a) },
], { height: 77.5, anchor: [38.6281556, -90.2081157], bearing: 14.85 }, 6500)
