/**
 * Tempe Center for the Arts, Tempe, Arizona (2007, Barton Myers Associates
 * with Architekton) — original procedural geometry, CC0-1.0.
 * bun generators/phx-tempe-center-for-the-arts.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * centroid of OSM way/288087998 (-111.9485828, 33.4318120). Bearing 0.
 *
 * What is drawn: OSM way/288087998, which outlines the big flat canopy
 * roof, with the loading-dock annex to the south and the walled garden
 * wedge to the south-east that the same outline takes in. The small
 * building way/288087996 to the west stands apart and is left to the map.
 *
 * Identity (from the photos below):
 *  1. The big folded, faceted standing-seam metal roof over the theatre:
 *     a flat-topped crest over the stage at the west, a steep west and
 *     south face, long shallow facets falling to the north and east.
 *                                               (nwc, pan3, east, south)
 *  2. The thin dark canopy roof floating over the whole building at about
 *     11 m, overhanging the walls.                     (pan3, east, nwc)
 *  3. The glass lobby wall facing Tempe Town Lake on the north.    (pan3)
 *  4. The curved board-formed concrete drum on the south and west with a
 *     dark brown slatted band under the canopy.               (nwc, south)
 *  5. The inverted-cone canopy on one column at the west entrance.  (nwc)
 *
 * Plan: OSM, which matches the canopy edge in the lidar within a metre.
 * The walls are drawn 2.5 m inside the canopy edge (photos: the canopy
 * overhangs by roughly a storey's width). Heights: USGS 3DEP lidar
 * AZ_MaricopaPinal_1_2020 (flown 2020), 1 m grid, above the surrounding
 * ground 353.4 m: the roof crest is at 29–30 over x -41..-12, y -10..10
 * here, with returns of 33.4–35.1 at its four corners (the peaks, the
 * north-west one highest, 35.1 at -39, 7); the steep south and west planes
 * fall to the canopy in 6 m, the east and north ones in 30–50 m;
 * the canopy 11.3 (lidar 11–12); the loading annex 9; the garden wedge's
 * walls about 4.
 *
 * Rework (lead review, Nov 2026): the roof was one soft hipped lump; it is
 * now separate tilted triangular planes rising to four distinct peaks at
 * the lidar's corner returns, with notches and valley folds between them
 * (nwc, south, east photos; NAIP fold lines), in a mid-grey metal. The
 * entrance cone is enlarged to a broad shallow funnel (rim 22 m across,
 * about a third of the front in nwc) on one tapered post.
 *
 * Estimated: the valley and fold lines (from the photos and NAIP); the
 * notch depths (lidar crest 29–30, notches drawn at 28.5); the
 * concrete drum's height (6.3) and the slatted band (6.3–9.6) from the
 * south and nwc photos against the canopy; the lobby's glass height;
 * the entrance cone's size (rim radius 11 at 12.4 m, from nwc) and place
 * (west entrance, as before; the 2020 lidar shows no return for the thin
 * metal cone, so its place rests on the photo).
 *
 * Photos (evidence, Wikimedia Commons):
 *  nwc   "Tempe Center for the Arts - NWC - 2009-09-04.JPG", Cygnusloop99,
 *        CC BY-SA 3.0
 *        https://commons.wikimedia.org/wiki/File:Tempe_Center_for_the_Arts_-_NWC_-_2009-09-04.JPG
 *  south "Tempe Center for the Arts - South - 2009-09-04.jpg", Cygnusloop99,
 *        CC BY-SA 3.0
 *        https://commons.wikimedia.org/wiki/File:Tempe_Center_for_the_Arts_-_South_-_2009-09-04.jpg
 *  east  "Tempe Center for the Arts - East - 2009-09-04.JPG", Cygnusloop99,
 *        CC BY-SA 3.0
 *        https://commons.wikimedia.org/wiki/File:Tempe_Center_for_the_Arts_-_East_-_2009-09-04.JPG
 *  pan3  "Tempe Center for the Arts, Tempe, Arizona - panoramio (3).jpg",
 *        davidpinter, CC BY 3.0 (from across the lake, north)
 *        https://commons.wikimedia.org/wiki/File:Tempe_Center_for_the_Arts,_Tempe,_Arizona_-_panoramio_(3).jpg
 *  night "Northern View, Tempe Center for the Arts, Tempe, Arizona -
 *        panoramio.jpg", davidpinter, CC BY 3.0 (the lobby at night)
 *        https://commons.wikimedia.org/wiki/File:Northern_View,_Tempe_Center_for_the_Arts,_Tempe,_Arizona_-_panoramio.jpg
 * USGS NAIP orthophoto (public domain) for the plan. No look-only sources.
 * No commercial imagery.
 *
 * Doubts: the exact fold lines of the roof (simplified to one fold per
 * face); the east side's back-of-house walls (seen only from afar); the
 * garden wedge is drawn as a solid low block. Elevation 0: flat site.
 *
 * Night: the lobby glass glows (window); the roof stays dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, ccw, offset, prism, save, wall, type XY } from './atl-flatiron-building'

const concrete = new Part(), slat = new Part(), metal = new Part(), win = new Part()

/** A flat polygon (3 or 4 corners) wound to face `want`. */
function face(p: Part, q: V3[], want: V3) {
  const b = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], c = [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]]
  const g = [b[1] * c[2] - b[2] * c[1], b[2] * c[0] - b[0] * c[2], b[0] * c[1] - b[1] * c[0]]
  const r = g[0] * want[0] + g[1] * want[1] + g[2] * want[2] < 0 ? [...q].reverse() : q
  if (r.length === 3) p.tri(r[0], r[1], r[2])
  else p.quad(r[0], r[1], r[2], r[3])
}

// ── the canopy, from the OSM outline (the annex and garden wedge cut off) ──
const canopyRing: XY[] = ccw([
  [-52.36, 36.32], [-54.12, 38.83], [-60.81, 48.45], [-49.18, 49.14], [-42.85, 49.45], [-28.52, 60.15], [-17.22, 58.42],
  [-17.27, 40.8], [15.35, 29.42], [18.11, 38.39], [41.74, 30.88], [41.41, 29.69], [44.08, 19.5], [47.22, 17.03], [49.81, 15.26],
  [49.56, 11.67], [47.46, 6.51], [42.36, -1.83], [37.95, -21.87], [35.99, -23.49], [34.35, -25.21], [30.32, -22.45], [21.26, -29.56],
  [20.33, -30.02], [-17.17, -36.79], [-23.28, -34.85], [-33.72, -29.88], [-42.79, -22.73], [-46.1, -18.87], [-47.63, -17.17],
  [-53.01, -8.27], [-56.47, 1.53], [-57.85, 11.82], [-57.11, 22.18], [-54.27, 32.17],
])
const annex: XY[] = ccw([[20.33, -30.02], [20.56, -54.47], [8.13, -57.94], [-6.1, -59.57], [-6.31, -42.9], [-17.27, -43.05], [-17.17, -36.79]])
const wedge: XY[] = ccw([[42.36, -1.83], [64.11, -9.19], [59.13, -21.24], [54.09, -30.05], [49.36, -35.3], [37.95, -21.87]])

const CAN = 11.3, CT = 0.8 // canopy top and thickness
// the canopy: dark edge and underside, a pale metal top
const at = (ring: XY[], z: number): V3[] => ring.map(([x, y]) => [x, y, z])
slat.loft([at(canopyRing, CAN - CT), at(canopyRing, CAN)])
capPoly(slat, canopyRing, CAN - CT, false)
capPoly(concrete, canopyRing, CAN, true)

// ── the walls under it: 2.5 m in; the north faces are the glass lobby ──
// The prow at the north-west and the lobby's jogs are simplified to the
// inset ring of the main hall's walls.
const walls: XY[] = ccw([
  [-50.5, 37], [-30, 55], [-19.5, 55], [-19.5, 38.5], [16.5, 26.8], [19.5, 35.5], [39.5, 28.8], [45, 14.5], [40, -2.5],
  [35.5, -20.5], [18, -27.5], [-17.5, -34], [-33, -27], [-44.5, -16.5], [-51, -7], [-54.5, 2.5], [-55.5, 12], [-54.5, 22.5],
])
const DRUM = 6.3, BAND = 9.6
for (let i = 0; i < walls.length; i++) {
  const a = walls[i], b = walls[(i + 1) % walls.length]
  const ex = b[0] - a[0], ey = b[1] - a[1], L = Math.hypot(ex, ey), ny = -ex / L
  const seg = (p: Part, z0: number, z1: number) => face(p, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], [ey, -ex, 0])
  if (ny > 0.25) {
    // the lobby: glass to the canopy, with a slim concrete sill
    seg(concrete, 0, 0.6)
    seg(win, 0.6, CAN - CT)
  } else {
    seg(concrete, 0, DRUM)
    seg(slat, DRUM, BAND)
    seg(concrete, BAND, CAN - CT)
  }
}
// the south entrance's glazing in the concrete drum (nwc shows the doors
// at the west; the south photo shows the loading doors)
function onSeg(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number) {
  const ex = b[0] - a[0], ey = b[1] - a[1], L = Math.hypot(ex, ey), t: XY = [ex / L, ey / L], n: XY = [t[1], -t[0]]
  const P = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * 0.05, a[1] + t[1] * s + n[1] * 0.05, z]
  face(p, [P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1)], [n[0], n[1], 0])
}
onSeg(win, [-54.5, 2.5], [-51, -7], 1.5, 8.5, 0, 3.6) // the west entrance doors
onSeg(win, [-55.5, 12], [-54.5, 2.5], 2, 7.5, 0, 3.6)
onSeg(win, [-33, -27], [-44.5, -16.5], 4, 11, 0.8, 3.4) // south-west windows

// ── the folded roof ──
// Separate tilted triangular planes over the stage house, not one hipped
// lump. The lidar's crest (x -40..-12, y -10..10, 29.5–30, its corners
// returning up to 32.1) is where the planes meet; in the photos (nwc,
// south, east) its corners stand up as sharp points where the steep south
// and west planes lean out past each other, the north-west one (over the
// stage) the highest. Between the points the crest edges and the centre
// dip a little, so each edge reads as a notch between two peaks, and long
// valley folds run down the north and south faces (NAIP shows the north
// face broken along the line from the north-east point to the north edge).
// The planes come down to the canopy (11.3) along the foot ring read
// where the lidar meets canopy height.
const Z0 = CAN
const P = (x: number, y: number, z = Z0): V3 => [x, y, z]
// the peaks (crest corners, leaning out) and the notches between them
const A_NW = P(-41, 8.5, 35.1), A_SW = P(-42, -9, 33.4), A_SE = P(-11.5, -11.5, 33.5), A_NE = P(-11.5, 10, 33.7)
const M_W = P(-40, 0, 28.5), M_S = P(-26, -8.5, 28.5), M_E = P(-12.5, -0.5, 29), M_N = P(-26, 9, 28.5), C = P(-26, 0.5, 28.5)
// a fold point on the long east slope (NAIP)
const E1 = P(17, 13.5, 17)
// the foot ring at the canopy, anticlockwise from the south-west
const f: V3[] = [
  P(-45, -16), P(-26, -16.5), P(0, -16.8), P(27, -15), P(38, 0), P(34, 16), P(12, 27), P(-6, 34), P(-24, 40), P(-45, 40), P(-46, 22), P(-46, 1),
]
const facets: V3[][] = [
  // south: two steep planes meeting in a valley under the south notch
  [A_SW, f[0], f[1]], [A_SW, f[1], M_S], [M_S, f[1], A_SE], [f[1], f[2], A_SE],
  // the long east slope, folded at E1
  [A_SE, f[2], f[3]], [A_SE, f[3], f[4]], [A_SE, f[4], M_E], [M_E, f[4], E1], [M_E, E1, A_NE], [E1, f[4], f[5]], [E1, f[5], f[6]], [A_NE, E1, f[6]],
  // north-east and north, folded under the north notch
  [A_NE, f[6], f[7]], [A_NE, f[7], f[8]], [M_N, A_NE, f[8]], [A_NW, M_N, f[8]], [A_NW, f[8], f[9]],
  // west: near-vertical, split under the west notch
  [A_NW, f[9], f[10]], [A_NW, f[10], f[11]], [A_NW, f[11], M_W], [M_W, f[11], A_SW], [A_SW, f[11], f[0]],
  // the crest: a shallow dish between the four points
  [A_NW, M_W, C], [A_NW, C, M_N], [M_N, C, A_NE], [A_NE, C, M_E], [M_E, C, A_SE], [A_SE, C, M_S], [M_S, C, A_SW], [A_SW, C, M_W],
]
const core: V3 = [-18, 6, 0]
for (const q of facets) {
  const c = q.reduce((s, v) => [s[0] + v[0] / 3, s[1] + v[1] / 3, s[2] + v[2] / 3], [0, 0, 0] as V3)
  face(metal, q, [c[0] - core[0], c[1] - core[1], c[2] - core[2]])
}

// ── the loading annex, the garden wedge, the entrance cone ──
prism(concrete, annex, 0, 9, concrete, 0.3)
for (let i = 0; i < annex.length; i++) {
  const a = annex[i], b = annex[(i + 1) % annex.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L > 10 && Math.abs(b[0] - a[0]) < 3) onSeg(metal, a, b, 3, L - 3, 1.2, 8.2) // the silver louvres (south)
}
prism(concrete, wedge, 0, 4, concrete, 0.25)
{
  // A broad, shallow funnel on one tapered post (nwc: its rim about a third
  // of the front's width, at about canopy height, standing in front of the
  // west doors and reaching over the canopy's edge).
  const c: XY = [-62, -1.5], R0 = 1.0, R1 = 11, Za = 5.2, Zb = 12.4, Zd = 11.4, n = 20
  const Q = (r: number, a: number, z: number): V3 => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z]
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * 2 * Math.PI, a1 = ((i + 1) / n) * 2 * Math.PI, am = (a0 + a1) / 2
    // the underside, seen from below and outside
    face(metal, [Q(R0, a0, Za), Q(R0, a1, Za), Q(R1, a1, Zb), Q(R1, a0, Zb)], [Math.cos(am), Math.sin(am), -1.3])
    // the top: a shallow dish
    face(metal, [Q(R1, a0, Zb), Q(R1, a1, Zb), [c[0], c[1], Zd]], [0, 0, 1])
  }
  // the post, flaring to the ground
  const m = 10
  for (let i = 0; i < m; i++) {
    const a0 = (i / m) * 2 * Math.PI, a1 = ((i + 1) / m) * 2 * Math.PI, am = (a0 + a1) / 2
    face(concrete, [Q(1.1, a0, 0), Q(1.1, a1, 0), Q(0.45, a1, Za + 0.2), Q(0.45, a0, Za + 0.2)], [Math.cos(am), Math.sin(am), 0.3])
  }
}
void wall; void offset

await save('phx-tempe-center-for-the-arts', 'Tempe Center for the Arts', [
  { part: concrete, material: finish('tca-concrete', 0xd2cdc4) },
  { part: slat, material: finish('tca-dark', 0x6a5a50) },
  { part: metal, material: { ...finish('tca-metal', 0xa3abb3, 0.5), floodlight: (p, n) => (p[2] < 12 && n[2] < -0.3 ? 0.4 : 0) } },
  { part: win, material: { ...PALETTE.window, color: 0x8ca2b4 } },
], { height: 31.5, anchor: [33.431812, -111.9485828], bearing: 0 }, 5000)
