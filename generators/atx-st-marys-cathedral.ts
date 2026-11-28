/**
 * St. Mary Cathedral (1874-84, Nicholas J. Clayton, Gothic Revival), 203
 * East 10th Street, Austin — procedural, CC0-1.0, no textures.
 *   bun generators/atx-st-marys-cathedral.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 17.8, the downtown grid
 * (the nave's axis), so +y runs from the apse up the nave to the front on
 * 10th Street (north-north-east) and +x is east-south-east. Anchor = area
 * centroid of OSM way/328649889, -97.739999, 30.271080. z = 0 is the
 * lowest ground under the footprint, behind the apse; the ground rises 2.4
 * m to the landing in front of the west front (lidar ground and the map's
 * terrain agree), so the front's base is at z 2.4.
 *
 * Identity: the rough-faced cream limestone front: the tall square bell
 * tower on its left (east) corner, in three stages (paired lancets, a tall
 * Y-traceried lancet, a belfry of two louvred lancets), its four octagonal
 * corner shafts running up past the flat top into crocketed pinnacles, with
 * smaller pinnacles between; the steep nave gable with its rose window over
 * a gabled portal porch and its pointed door; the small stair turret with
 * an octagonal stone spire on the right; behind, the steep grey slate roof
 * with steep cross gables near the east end and the apse.
 *
 * Numbers (lidar = USGS 3DEP USGS_LPC_TX_Central_B1_2017_LAS_2019, flown
 * 2017, 0.5 m grid read in this frame; z = lidar - 2.0):
 *  - nave x -7.9..7.9, y -14..19.5, eaves 12.3, ridge 21.5, the front gable
 *    23.4; the cross gables at y -14..-6, apex 19.5 (lidar 20.5 with the
 *    finial); the half-octagon apse x -5.2..5.2 to y -19.2, eaves 13.0, its roof to
 *    19.5 (lidar 15.0 and 18.3 at its back); the low rear wings 8.1;
 *  - the tower x 4.6..10.4, y 14..19.6 (lidar; OSM part way/1033406107 is
 *    0.6 m smaller); its flat top 31.4; the corner pinnacles' tips 38.8
 *    (lidar, 40.8 over the grid's ground);
 *  - the stair turret x -8.6..-4.8, y 16..19.6, its spire's tip 26.8 (lidar);
 *  - the tower's stages, the openings, the rose, the porch and the door:
 *    measured on "f01" (taken square on to the front, verticals parallel)
 *    on the front's plane and scaled by 1.13, which brings the photo's
 *    tower top (25.6 m over the landing) to the lidar's (29.0) — the photo
 *    and lidar agree on the turret's spire with the same factor: string
 *    courses 11.7 and 20.3, paired lancets 5.9-8.9, the big lancet
 *    12.9-18.3 (2.2 wide), the belfry lancets 22.9-27.5, the rose centred
 *    at 15.4 with radius 3.3, the porch 6.4 wide to its eaves at 9.6 and
 *    apex 13.8, the door 2.9 wide to an apex of 8.6, the turret's octagon
 *    19.4-21.2;
 *  - the side bays (five lancets between buttresses each side): "f02",
 *    "f04"; the cross gables and the apse: "f04", "f05";
 *  - colours from "f01" and "f04" (sun), pulled to the palette's lightness:
 *    the limestone #e2d8c2, the slate #8f969d, the doors a dark oak #6e5444,
 *    the belfry louvres #5e6268.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  f01  "St. Mary - Austin 01.jpg", Farragutful, CC BY-SA 4.0 (the front)
 *       https://commons.wikimedia.org/wiki/File:St._Mary_-_Austin_01.jpg
 *  f02  "St. Mary - Austin 02.jpg", Farragutful, CC BY-SA 4.0 (front and west side)
 *       https://commons.wikimedia.org/wiki/File:St._Mary_-_Austin_02.jpg
 *  f03  "St. Mary - Austin 03.jpg", Farragutful, CC BY-SA 4.0 (front, tower)
 *       https://commons.wikimedia.org/wiki/File:St._Mary_-_Austin_03.jpg
 *  f04  "St. Mary - Austin 04.jpg", Farragutful, CC BY-SA 4.0 (the side, cross gables)
 *       https://commons.wikimedia.org/wiki/File:St._Mary_-_Austin_04.jpg
 *  f05  "St. Mary - Austin 05.jpg", Farragutful, CC BY-SA 4.0 (the apse and slate roof)
 *       https://commons.wikimedia.org/wiki/File:St._Mary_-_Austin_05.jpg
 *  f13  "St. Mary - Austin 13.jpg", Farragutful, CC BY-SA 4.0 (the tower top close up)
 *       https://commons.wikimedia.org/wiki/File:St._Mary_-_Austin_13.jpg
 *  f15  "St. Mary - Austin 15.jpg", Farragutful, CC BY-SA 4.0 (the turret's spire close up)
 *       https://commons.wikimedia.org/wiki/File:St._Mary_-_Austin_15.jpg
 *  uthman "St Mary Cathedral, Austin, Texas (HDR).jpg", Ed Uthman, CC BY-SA 2.0
 *       (the front from up 10th Street)
 *       https://commons.wikimedia.org/wiki/File:St_Mary_Cathedral,_Austin,_Texas_(HDR).jpg
 * Also OSM (ODbL) and the lidar. No look-only sources, no commercial imagery.
 *
 * Replaces the outline way/328649889 and the tower part way/1033406107.
 *
 * Doubts: the tower's top is a flat roof inside its pinnacles, as the lidar
 * shows: the tower has no tall spire (the assignment's "spire" is its crown
 * of pinnacles; the only real spire is the turret's). The rear wings and
 * the apse's eaves are read off the lidar without a clear photo. The front
 * steps are left to the map's ground; the arcaded frieze over the porch,
 * the statues and the crockets are left out. z = 0 was taken at the lidar
 * ground 2.0 behind the apse; the lowest ground at the apse's foot, past the
 * retaining wall, is 1.4, so the model may stand up to 0.6 m low.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, ccw, circle, prism, save, type XY } from './atl-flatiron-building'
import { flush, gableRoof, opening } from './atx-governors-mansion'

const stone = new Part(), slate = new Part(), win = new Part(), trim = new Part(), door = new Part(), louvre = new Part()

const XW = -7.9, XE = 7.9, YB = -14, YF = 19.5, EAVE = 12.3, RIDGE = 21.5, BASE = 2.4

/** An octagonal shaft from z0 to z1 and its spire to the tip. */
function pinnacle(c: XY, r: number, z0: number, z1: number, tip: number) {
  const ring = circle(c, r, 8, Math.PI / 8)
  prism(stone, ring, z0, z1, null, 0)
  const apex: V3 = [c[0], c[1], tip]
  for (let i = 0; i < 8; i++) {
    const a = ring[i], b = ring[(i + 1) % 8]
    stone.tri([a[0], a[1], z1], [b[0], b[1], z1], apex)
  }
}

// ── the nave ──
box(stone, XW, XE, YB, YF, 0, EAVE, null, 0)
gableRoof(slate, stone, XW, XE, YB, YF - 0.3, EAVE, RIDGE, 'y', 0.4)
// the front gable wall, a stone parapet standing a little proud of the roof
{
  const A = 23.4, y1 = YF, y0 = YF - 0.6
  stone.tri([XW, y1, EAVE], [0, y1, A], [XE, y1, EAVE]) // facing the street
  stone.tri([XE, y0, EAVE], [0, y0, A], [XW, y0, EAVE]) // facing the roof
  // the copings
  stone.quad([0, y1, A], [0, y0, A], [XE, y0, EAVE], [XE, y1, EAVE])
  stone.quad([0, y0, A], [0, y1, A], [XW, y1, EAVE], [XW, y0, EAVE])
}
// the cross gables near the east end, on both sides, a shallow bay under each with a tall lancet
for (const s of [-1, 1]) box(stone, s > 0 ? XE - 0.01 : XW - 0.3, s > 0 ? XE + 0.3 : XW + 0.01, YB + 0.2, -6, 0, EAVE, null, 0)
gableRoof(slate, stone, XW - 0.3, XE + 0.3, YB + 0.2, -6, EAVE, 19.5, 'x', 0)
for (const s of [-1, 1]) {
  const a: XY = s > 0 ? [XE + 0.3, -14] : [XW - 0.3, -6], b: XY = s > 0 ? [XE + 0.3, -6] : [XW - 0.3, -14]
  opening(win, a, b, 4, 2.2, 4.0, 11.5, 'pointed', 0.04)
  flush(trim, a, b, 3.92, 4.08, 4.0, 12.6, 0.06)
  box(stone, s > 0 ? XE + 0.3 : XW - 0.6, s > 0 ? XE + 0.6 : XW - 0.3, -10.25, -9.75, 19.0, 20.6, stone, 0)
  box(stone, s > 0 ? XE + 0.3 : XW - 0.6, s > 0 ? XE + 0.6 : XW - 0.3, -10.6, -9.4, 19.9, 20.2, stone, 0)
}
// the side bays: lancets between buttresses
for (const s of [-1, 1]) {
  const x = s > 0 ? XE : XW
  const a: XY = s > 0 ? [XE, YB] : [XW, YF], b: XY = s > 0 ? [XE, YF] : [XW, YB]
  const sOf = (y: number) => (s > 0 ? y - YB : YF - y)
  const bays = s > 0 ? [-4, 0, 4, 8, 12] : [-4, 0, 4, 8, 12]
  for (const y of bays) opening(win, a, b, sOf(y), 1.4, 3.6, 8.6, 'pointed', 0.04)
  for (const y of s > 0 ? [-6, -2, 2, 6, 10] : [-6, -2, 2, 6, 10, 14]) {
    box(stone, s > 0 ? x : x - 0.7, s > 0 ? x + 0.7 : x, y - 0.35, y + 0.35, 0, 9.0, stone, 0.2)
    box(stone, s > 0 ? x : x - 0.4, s > 0 ? x + 0.4 : x, y - 0.35, y + 0.35, 9.0, 11.0, stone, 0.2)
  }
}

// the small gabled dormers along both slopes of the nave roof ("f02", "f04")
for (const s of [-1, 1]) for (const y of [-2, 2, 6, 10]) {
  const xo = s * 5.2, zb = RIDGE - ((RIDGE - EAVE) * 5.2) / XE // the roof's height at x = ±5.2
  const xi = s * 3.6
  // a little gabled box: front face and two slopes, its back buried in the roof
  const y0 = y - 0.7, y1 = y + 0.7, zt = zb + 1.0, za = zt + 0.8
  const F = (yy: number, z: number): V3 => [xo, yy, z]
  if (s > 0) {
    stone.quad(F(y0, zb), F(y1, zb), F(y1, zt), F(y0, zt))
    stone.tri(F(y0, zt), F(y1, zt), F(y, za))
  } else {
    stone.quad(F(y1, zb), F(y0, zb), F(y0, zt), F(y1, zt))
    stone.tri(F(y1, zt), F(y0, zt), F(y, za))
  }
  for (const [ya, yb] of [[y0, y], [y, y1]]) {
    const up = ya === y0
    const q: V3[] = [[xo, ya, up ? zt : za], [xo, yb, up ? za : zt], [xi, yb, up ? za : zt], [xi, ya, up ? zt : za]]
    // both windings: the slope is thin and its far side shows from the ridge
    slate.quad(q[0], q[3], q[2], q[1])
    slate.quad(q[0], q[1], q[2], q[3])
  }
}

// ── the apse and the low rear wings ──
{
  const C: XY = [0, YB], R = 5.2, ring: XY[] = []
  for (let k = 0; k <= 4; k++) { const a = Math.PI + (k * Math.PI) / 4; ring.push([C[0] + R * Math.cos(a), C[1] + R * Math.sin(a)]) }
  // half an octagon south of the nave's end
  prism(stone, ccw(ring), 0, 13.0, null, 0)
  for (let i = 0; i < ring.length - 1; i++) {
    const p = ring[i], q = ring[i + 1]
    slate.tri([p[0], p[1], 13.0], [q[0], q[1], 13.0], [C[0], C[1] + 0.01, 19.5])
    const L = Math.hypot(q[0] - p[0], q[1] - p[1])
    opening(win, p, q, L / 2, 1.0, 4.5, 10.6, 'pointed', 0.04)
    // a gablet over each window, rising past the eaves ("f04")
    const t: XY = [(q[0] - p[0]) / L, (q[1] - p[1]) / L], n: XY = [t[1], -t[0]]
    const G = (u: number, z: number, o: number): V3 => [p[0] + t[0] * (L / 2 + u) + n[0] * o, p[1] + t[1] * (L / 2 + u) + n[1] * o, z]
    stone.tri(G(-1.3, 13.0, 0.02), G(1.3, 13.0, 0.02), G(0, 15.4, 0.02))
    stone.tri(G(1.3, 13.0, -0.4), G(-1.3, 13.0, -0.4), G(0, 15.4, -0.4))
    stone.quad(G(0, 15.4, 0.02), G(1.3, 13.0, 0.02), G(1.3, 13.0, -0.4), G(0, 15.4, -0.4))
    stone.quad(G(-1.3, 13.0, 0.02), G(0, 15.4, 0.02), G(0, 15.4, -0.4), G(-1.3, 13.0, -0.4))
  }
}
box(stone, -8.3, -4.9, -18.6, YB, 0, 8.1, slate, 0.25)
box(stone, 4.9, 12.9, -18.6, YB, 0, 8.1, slate, 0.25)
box(stone, XE, 12.9, YB - 0.01, -12.5, 0, 8.1, slate, 0.25)
for (const [a, b, s] of [[[-8.3, -18.6], [-4.9, -18.6], 1.7], [[4.9, -18.6], [12.9, -18.6], 2.2], [[4.9, -18.6], [12.9, -18.6], 5.8]] as [XY, XY, number][]) {
  flush(win, a, b, s - 0.6, s + 0.6, 2.2, 5.6, 0.04)
}

// ── the front ──
const FA: XY = [XE + 3, YF], FB: XY = [XW - 3, YF] // along the front from east to west, the street to its right
const fs = (x: number) => FA[0] - x
// the rose window: a disc, its stone ring, and eight bold spokes
{
  const c: XY = [-0.2, YF + 0.05], zc = 15.4, R = 3.3, n = 16
  for (let k = 0; k < n; k++) {
    const a0 = (k / n) * 2 * Math.PI, a1 = ((k + 1) / n) * 2 * Math.PI
    const P = (r: number, a: number, o: number): V3 => [c[0] - r * Math.cos(a), YF + o, zc + r * Math.sin(a)]
    win.tri(P(0, 0, 0.04), P(R, a0, 0.04), P(R, a1, 0.04))
    trim.quad(P(R, a0, 0.07), P(R + 0.45, a0, 0.07), P(R + 0.45, a1, 0.07), P(R, a1, 0.07))
  }
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI, w = 0.09
    const d: XY = [Math.cos(a), Math.sin(a)], q: XY = [-d[1] * w, d[0] * w]
    const P = (t: number, sgn: number): V3 => [c[0] - (d[0] * t + q[0] * sgn), YF + 0.08, zc + d[1] * t + q[1] * sgn]
    trim.quad(P(-R, 1), P(-R, -1), P(R, -1), P(R, 1))
  }
}
// the porch: a gabled mass round the pointed door
{
  const x0 = -3.7, x1 = 3.3, y1 = YF + 1.6, ze = 9.6, za = 12.4
  box(stone, x0, x1, YF - 0.1, y1, 0, ze, null, 0)
  gableRoof(stone, stone, x0, x1, YF - 0.1, y1, ze, za, 'y', 0)
  const a: XY = [x1, y1], b: XY = [x0, y1]
  const xm = (x0 + x1) / 2
  opening(trim, a, b, x1 - xm, 4.4, BASE, 4.6, 'pointed', 0.03)
  opening(door, a, b, x1 - xm, 2.9, BASE, 4.6, 'pointed', 0.06)
  // two steps down from the porch towards the street (the rest of the flight is the map's ground)
  box(stone, xm - 1.8, xm + 1.8, y1, y1 + 0.4, 0, BASE - 0.35, stone, 0)
  box(stone, xm - 1.8, xm + 1.8, y1 + 0.4, y1 + 0.8, 0, BASE - 0.65, stone, 0)
}
// the nave front either side of the porch, under the rose: two small lancets
for (const x of [-4.2, 3.8]) opening(win, FA, FB, fs(x), 0.8, 6.0, 8.6, 'pointed', 0.04)

// ── the tower ──
{
  const x0 = 4.6, x1 = 10.4, y0 = 14.0, y1 = 19.6, TOP = 31.4
  box(stone, x0, x1, y0, y1, 0, TOP, stone, 0)
  // string courses and the cornice under the top
  for (const z of [11.7, 20.3]) box(stone, x0 - 0.2, x1 + 0.2, y0 - 0.2, y1 + 0.2, z - 0.35, z, stone, 0.1, true)
  box(stone, x0 - 0.3, x1 + 0.3, y0 - 0.3, y1 + 0.3, TOP - 0.7, TOP, stone, 0.15, true)
  // the corner shafts, full height, rising into the pinnacles
  for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]) pinnacle([x, y], 0.75, 0, TOP + 1.6, 38.6)
  // the smaller pinnacles in the middle of each face
  for (const [x, y] of [[(x0 + x1) / 2, y1], [(x0 + x1) / 2, y0], [x0, (y0 + y1) / 2], [x1, (y0 + y1) / 2]]) pinnacle([x, y], 0.38, TOP - 0.5, TOP + 0.6, 34.4)
  // the openings, on all four faces (the back one only above the nave roof)
  const faces: [XY, XY, boolean][] = [[[x1, y1], [x0, y1], true], [[x0, y0], [x1, y0], false], [[x1, y0], [x1, y1], true], [[x0, y1], [x0, y0], false]]
  for (const [a, b, low] of faces) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = L / 2
    // the belfry: two louvred lancets
    for (const d of [-0.8, 0.8]) opening(louvre, a, b, m + d, 1.1, 22.6, 26.6, 'pointed', 0.04)
    // the big Y-traceried lancet and the paired lancets, on the faces clear of the nave
    if (low) {
      opening(win, a, b, m, 2.2, 11.4, 16.2, 'pointed', 0.04)
      flush(trim, a, b, m - 0.09, m + 0.09, 11.4, 16.8, 0.06)
      for (const d of [-0.45, 0.45]) opening(win, a, b, m + d, 0.6, 4.0, 6.1, 'pointed', 0.04)
    }
  }
}

// ── the stair turret and its spire ──
{
  const x0 = -8.6, x1 = -4.8, y0 = 16.0, y1 = 19.6, c: XY = [(x0 + x1) / 2, (y0 + y1) / 2]
  box(stone, x0, x1, y0, y1, 0, 19.4, stone, 0.15)
  const oct = circle(c, 1.75, 8, Math.PI / 8)
  prism(stone, oct, 19.4, 21.2, null, 0)
  for (let i = 0; i < 8; i++) {
    const a = oct[i], b = oct[(i + 1) % 8]
    stone.tri([a[0], a[1], 21.2], [b[0], b[1], 21.2], [c[0], c[1], 26.4])
  }
  box(trim, c[0] - 0.08, c[0] + 0.08, c[1] - 0.08, c[1] + 0.08, 26.2, 26.9, trim, 0)
  const a: XY = [x1, y1], b: XY = [x0, y1]
  opening(win, a, b, 1.9, 0.9, 12.3, 15.8, 'pointed', 0.04)
  opening(win, a, b, 1.9, 0.7, 5.6, 8.4, 'pointed', 0.04)
}
// the crosses on the gables (bold, as they read from the street)
box(trim, -0.13, 0.13, YF - 0.45, YF - 0.15, 23.4, 25.6, trim, 0)
box(trim, -0.75, 0.75, YF - 0.45, YF - 0.15, 24.6, 24.9, trim, 0)

const lit = (p: V3, n: V3) => (n[2] < 0.6 && p[1] > 13 ? 0.7 : 0)
if (import.meta.main) {
  await save('atx-st-marys-cathedral', 'St. Mary Cathedral', [
    { part: stone, material: { ...finish('st-mary-limestone', 0xe2d8c2), floodlight: lit } },
    { part: slate, material: finish('st-mary-slate', 0x8f969d) },
    { part: win, material: PALETTE.window },
    { part: trim, material: PALETTE.trim },
    { part: door, material: { ...PALETTE.entrance, color: 0x6e5444 } },
    { part: louvre, material: finish('belfry-louvre', 0x5e6268) },
  ], { bearing: 17.8, replaces: ['way/328649889', 'way/1033406107'] }, 5000)
}
