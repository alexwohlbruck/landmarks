/**
 * FMC Tower at Cira Centre South, Philadelphia (Pelli Clarke Pelli, 2016) —
 * original procedural geometry, CC0-1.0.
 * bun generators/phl-fmc-tower.ts
 *
 * Map frame: x east, y north, z up, metres. BEARING 0: the east edges of the
 * OSM parts run at 359 and 1.5 degrees. Origin = area centroid of the OSM
 * outline way/748885496 (-75.183525, 39.952051), on the ground.
 *
 * Form (from the photos below). Two glass volumes locked together:
 * - the tall slab (49 storeys, 222.5 m) on the south half, about 63 x 18 m,
 *   with both broad faces bowed outward in plan; its north face is the one
 *   that rises clear above the lower volume, its curved top edge carrying the
 *   red FMC sign near the east end;
 * - the lower volume (31 storeys, about 142 m) on the north half, its north
 *   face also bowed and its north-east corner rounded; its east end is cut
 *   by a sloping triangular facet that runs from the roof at the slab's east
 *   face down to the foot of the north-east corner, so from the north-east
 *   the junction of the two volumes reads as a pair of tall triangles (a
 *   narrow vertical one, apex up, and the tilted facet, apex down);
 * - a warm bronze soffit over the recessed lobby on the east side.
 *
 * Evidence
 * - OSM way/748885496 (FMC Tower, office, 222.5 m, 49 levels, glass) with
 *   building:parts way/748885493 (the slab, 222.5 m, 49 levels) and
 *   way/748885492 (the lower volume, 31 levels, no height). All replaced.
 *   The plan of both volumes is OSM's, curves included.
 * - Published: 730 ft (222.5 m), 49 storeys, Pelli Clarke Pelli, completed
 *   2016; offices below, AKA hotel suites and apartments above (Wikipedia,
 *   "FMC Tower at Cira Centre South").
 * - USGS 3DEP lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015)
 *   shows the tower under construction, so no height is measured from it.
 * - Mapterhorn terrain: flat site (about 1 m across); elevation 0.
 *
 * Photos (EVIDENCE):
 * - "FMC Tower at Cira Centre South a.jpg" and "b.jpg", Wobbanight, CC0
 *   (north-east, across the Schuylkill: the two volumes, the step, the sign)
 *   https://commons.wikimedia.org/wiki/File:FMC_Tower_at_Cira_Centre_South_a.jpg
 *   https://commons.wikimedia.org/wiki/File:FMC_Tower_at_Cira_Centre_South_b.jpg
 * - "Cira Centre South a.jpg", Wobbanight, CC0 (north-east)
 *   https://commons.wikimedia.org/wiki/File:Cira_Centre_South_a.jpg
 * - "FMC Tower 2016-11-05.jpg", Zombiyaic, CC BY-SA 4.0 (east-north-east:
 *   the junction facets, the bronze lobby soffit)
 *   https://commons.wikimedia.org/wiki/File:FMC_Tower_2016-11-05.jpg
 * - "FMCTower.jpg", TastyPoutine, CC BY-SA 4.0 (north-east: the facets)
 *   https://commons.wikimedia.org/wiki/File:FMCTower.jpg
 * - "Cira Centre South.jpg", TastyPoutine, CC BY-SA 3.0 (north-east)
 *   https://commons.wikimedia.org/wiki/File:Cira_Centre_South.jpg
 * - "Cira Centre South (53586793263).jpg", ajay_suresh, CC BY 2.0 (east,
 *   from across the river; glass colour, the lower volume's height)
 *   https://commons.wikimedia.org/wiki/File:Cira_Centre_South_(53586793263).jpg
 * - "FMC Tower 2019.jpg", MainlyTwelve, CC BY-SA 4.0 (from below: the bowed
 *   faces, the step between the volumes, glass colour in sun)
 *   https://commons.wikimedia.org/wiki/File:FMC_Tower_2019.jpg
 * - "FMC Tower, Clouds, Philadelphia", dbaron, Flickr, CC BY-SA 2.0 (south-
 *   east, from the Schuylkill trail)
 *   https://www.flickr.com/photos/14869313@N00/37462924551
 * ("Fmc-tower.jpg" on Commons is a stock mock-up of another building and was
 * not used.)
 *
 * Estimated: the lower volume's roof at 142 m (photo-scaled against the
 * published 222.5 m in Wobbanight a and ajay_suresh, which give 145 and
 * 141 m; 31 storeys); the facet's top corners (at the slab's east face and on
 * the north curve at x 21) from the TastyPoutine and Zombiyaic photos; the
 * sign plate 17 x 6 m (scaled from the photos; drawn as a plain red plate,
 * not lettering); the lobby soffit 9 m up; the curtain-wall lines (at the
 * OSM plan vertices, about 9 m apart, and every four storeys, 18.2 m) as
 * faint lines a step lighter than the glass.
 *
 * Colours (daylight photos, pulled to the palette's lightness): the curtain
 * wall a pale silver blue (window-2 #8ea8c6); the sign red (#c8343a); the
 * soffit bronze.
 *
 * Night: the curtain wall glows (window-2); the FMC sign is lit red
 * (`neon-fmc-red`).
 *
 * Doubts: every licensed photo is from the north-east, east or south-east;
 * the west and south faces are drawn plain, from the OSM plan. The brief
 * mentioned a cantilevered "hood" or open frame at the top: no licensed photo
 * shows one (the slab's top is a flat, slightly bowed parapet), so none is
 * modelled. Whether a second sign faces south is unknown; one is drawn on
 * the north face only.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { facePanel, saveTower, type P2 } from './phl-comcast-center'

const BEARING = 0
const ANCHOR = { lng: -75.183525, lat: 39.952051 }

const wall = new Part()  // curtain wall (window-2)
const mull = new Part()  // faint lines
const roof = new Part()
const sign = new Part()  // neon red sign plate
const soffit = new Part()

const TOP = 222.5  // published
const LOW = 142    // photo-scaled
const FLOOR = TOP / 49

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function face(part: Part, pts: V3[], centre: V3) {
  const c = pts.reduce((s, p) => [s[0] + p[0] / pts.length, s[1] + p[1] / pts.length, s[2] + p[2] / pts.length] as V3, [0, 0, 0] as V3)
  const n: V3 = [0, 0, 0] // Newell normal: robust for near-collinear first corners
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; n[0] += (a[1] - b[1]) * (a[2] + b[2]); n[1] += (a[2] - b[2]) * (a[0] + b[0]); n[2] += (a[0] - b[0]) * (a[1] + b[1]) }
  const q = dot(n, sub(c, centre)) < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < q.length - 1; i++) part.tri(q[0], q[i], q[i + 1])
}
const ccw = (p: P2[]): P2[] => {
  let a = 0
  for (let i = 0; i < p.length; i++) { const q = p[i], r = p[(i + 1) % p.length]; a += q[0] * r[1] - r[0] * q[1] }
  return a < 0 ? [...p].reverse() : p
}

// ---------- the slab (OSM way/748885493), counter-clockwise ----------
const SLAB: P2[] = ccw([
  [-29.0, 6.6], [-34.0, -9.7], [-32.7, -11.7], [-27.0, -13.8], [-18.3, -16.3], [-8.0, -18.8], [2.2, -20.4],
  [11.5, -20.9], [21.8, -21.2], [29.4, -20.9], [29.1, -2.9], [22.7, -0.7], [20.2, 0.1], [15.9, 1.5],
  [8.0, 3.4], [-0.5, 5.0], [-10.1, 6.3], [-18.8, 6.5], [-25.3, 6.7],
])
{
  const c: V3 = [-2, -8, TOP / 2]
  for (let i = 0; i < SLAB.length; i++) {
    const a = SLAB[i], b = SLAB[(i + 1) % SLAB.length]
    face(wall, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], TOP], [a[0], a[1], TOP]], c)
  }
  face(roof, SLAB.map(([x, y]) => [x, y, TOP] as V3), c)
  face(wall, SLAB.map(([x, y]) => [x, y, 0] as V3), c)
  // a low pale parapet lip round the roof
  for (let i = 0; i < SLAB.length; i++) {
    const a = SLAB[i], b = SLAB[(i + 1) % SLAB.length]
    facePanel(mull, a, b, 0, 1, TOP - 0.9, TOP, 0.06)
  }
}

// ---------- the lower volume (OSM way/748885492), with its east facet ----------
// Its south side is drawn as a straight chord that runs inside the slab.
const A0: P2 = [29.1, -2.9], B0: P2 = [34.6, 10.9], C0: P2 = [29.0, 13.1], D0: P2 = [21.2, 15.6]
const NORTH: P2[] = [[17.0, 16.6], [13.0, 17.6], [4.0, 19.3], [-2.7, 20.4], [-11.2, 20.9], [-18.9, 21.3], [-28.6, 21.2], [-29.0, 6.6]]
{
  const c: V3 = [2, 12, LOW / 2]
  const up = (p: P2, z: number): V3 => [p[0], p[1], z]
  const ring = [D0, ...NORTH, A0] // full-height ring from D round to A
  for (let i = 0; i < ring.length - 1; i++) {
    const a = ring[i], b = ring[i + 1]
    face(wall, [up(a, 0), up(b, 0), up(b, LOW), up(a, LOW)], c)
  }
  face(wall, [up(A0, 0), up(B0, 0), up(A0, LOW)], c)          // the narrow east triangle, apex up
  face(wall, [up(B0, 0), up(D0, LOW), up(A0, LOW)], c)        // the tilted facet, apex down
  face(wall, [up(B0, 0), up(C0, 0), up(D0, LOW)], c)          // the rounded corner's foot
  face(wall, [up(C0, 0), up(D0, 0), up(D0, LOW)], c)
  face(roof, ring.map((p) => up(p, LOW)), c)
  // pale creases along the facet's two sloping edges, so the cut reads at map distance
  const fa = up(A0, LOW), fb = up(B0, 0), fd = up(D0, LOW)
  const fn = (() => { const n = cross(sub(fd, fb), sub(fa, fb)); const l = Math.hypot(...n); return (dot(n, sub(fa, c)) < 0 ? n.map((v) => -v / l) : n.map((v) => v / l)) as V3 })()
  for (const [p, q] of [[fb, fa], [fb, fd]] as [V3, V3][]) {
    const d = sub(q, p), l = Math.hypot(...d), t = d.map((v) => v / l) as V3
    const s = cross(fn, t), w = 0.35, o = 0.08
    const P = (u: V3, k: number): V3 => [u[0] + s[0] * w * k + fn[0] * o, u[1] + s[1] * w * k + fn[1] * o, u[2] + s[2] * w * k + fn[2] * o]
    face(mull, [P(p, -1), P(q, -1), P(q, 1), P(p, 1)], sub(P(p, 0), fn))
  }
  face(wall, [A0, B0, C0, ...ring.slice(0, -1)].map((p) => up(p, 0)), c)
  for (let i = 0; i < ring.length - 1; i++) facePanel(mull, ring[i], ring[i + 1], 0, 1, LOW - 0.9, LOW, 0.06)
}

// ---------- faint curtain-wall lines ----------
// verticals at the plan vertices of the bowed faces, floor lines every four storeys.
function faceLines(pts: P2[], z0: number, z1: number, verticals = true) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1], l = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (verticals && i > 0) facePanel(mull, a, b, 0, 0.3 / l, z0, z1 - 1, 0.05)
    for (let z = Math.ceil(z0 / (4 * FLOOR)) * 4 * FLOOR; z < z1 - 3; z += 4 * FLOOR) {
      if (z < z0 + 2) continue
      facePanel(mull, a, b, 0, 1, z - 0.3, z + 0.3, 0.05)
    }
  }
}
// slab south face (west corner round to the south-east corner)
faceLines(SLAB.slice(SLAB.findIndex((p) => p[0] === -34.0), SLAB.findIndex((p) => p[0] === 29.4) + 1), 9, TOP)
// slab east face
faceLines([[29.4, -20.9], [29.1, -2.9]], 9, TOP, false)
// slab north face above the lower volume
faceLines(SLAB.slice(SLAB.findIndex((p) => p[0] === 29.1 && p[1] === -2.9), SLAB.length).concat([[-29.0, 6.6]]), LOW, TOP)
// lower volume's north face
faceLines([D0, ...NORTH], 9, LOW)

// ---------- the FMC sign: a red plate high on the slab's north face, near its east end ----------
{
  const a: P2 = [22.7, -0.7], b: P2 = [8.0, 3.4] // two north-face segments east of the middle
  const segs: Array<[P2, P2]> = [[[22.7, -0.7], [20.2, 0.1]], [[20.2, 0.1], [15.9, 1.5]], [[15.9, 1.5], [8.0, 3.4]]]
  void a; void b
  for (const [p, q] of segs) facePanel(sign, p, q, 0, 1, TOP - 15, TOP - 8, 0.25)
  // a short leading "+" bar, as the logo's cross reads from afar
  facePanel(sign, [8.0, 3.4], [-0.5, 5.0], 0.55, 1, TOP - 13, TOP - 10, 0.25)
}

// ---------- the bronze soffit over the east lobby ----------
{
  const z = 9, t = 0.9
  const pts: V3[] = [[29.4, -21.5, z], [33.5, -21.5, z], [33.5, -2.6, z], [29.1, -2.6, z]]
  const c: V3 = [31, -12, z - 5]
  face(soffit, pts.map(([x, y]) => [x, y, z - t] as V3), [31, -12, z + 5])
  face(soffit, pts.map(([x, y]) => [x, y, z] as V3), c)
  for (let i = 0; i < 4; i++) {
    const p = pts[i], q = pts[(i + 1) % 4]
    face(soffit, [[p[0], p[1], z - t], [q[0], q[1], z - t], [q[0], q[1], z], [p[0], p[1], z]], [31, -12, z - t / 2])
  }
}

await saveTower('phl-fmc-tower', 'FMC Tower at Cira Centre South', [
  { part: wall, material: windowVariant(2, 0x8ea8c6) },
  { part: mull, material: finish('fmc-mullion', 0xa9bdd3) },
  { part: roof, material: PALETTE.roof },
  { part: sign, material: finish('neon-fmc-red', 0xc8343a) },
  { part: soffit, material: finish('fmc-bronze', 0xb98a5a) },
], { bearing: BEARING, anchor: ANCHOR, height: TOP, replaces: ['way/748885496', 'way/748885493', 'way/748885492'] })
