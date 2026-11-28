/**
 * Arizona Veterans Memorial Coliseum (1965, Lescher & Mahoney with T.Y. Lin),
 * Arizona State Fairgrounds, Phoenix. Procedural, CC0-1.0, no textures.
 *   bun generators/phx-veterans-memorial-coliseum.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0 (the drum is round and
 * the podium's sides run east-west and north-south in OSM). Anchor
 * -112.0966498, 33.4695985, the centroid of OSM way/1203515330 (the whole
 * building: drum plus the low concourse podium round it). The drum is OSM
 * way/61414635 (building:part, height 20), centred 1.5 m north of the anchor.
 * replaces: way/1203515330, way/61414635. No other building or part lies
 * under the model.
 *
 * Identity (photos below):
 *  1. The saddle roof: a hyperbolic paraboloid hung from a ring beam, the
 *     rim high at the north and south ends and low at the east and west
 *     sides, so the drum's top edge rises and falls round it.   (p1, p3, lidar)
 *  2. The leaning glass clerestory under the rim, crossed by white struts in
 *     a V / diamond pattern from the piers, with ball joints at the nodes.
 *                                                                  (p1, p2)
 *  3. The thick white concrete ring beam at the roof's edge.     (p1, p2, p3)
 *  4. Concrete piers between yellow-green tile panels below the glass. (p2)
 *  5. The low concourse podium round the drum: brown block walls under a
 *     white fascia band, a dark brown deck on top.          (p1, p2, NAIP)
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020), 1 m grid,
 * read in this frame with tools/lidar_frame.py; ground_min 329.5 m = model
 * z 0 (the lowest ground, just east of the podium; the ground rises to about
 * 1.5-2 m on the west, north and south). Measured: podium deck 5.7; roof
 * surface 21.3 at the centre, 20.0 at x = +-50 on the east-west axis and 28.4
 * at y = +-48 on the north-south axis, fitted as
 * z = 21.3 + 0.0031 y'^2 - 0.00052 x^2 (y' from the drum centre); the rim
 * reads 32.5 at the north and south apexes and 20.3 at east and west. The
 * drum's plan (radius 58.5) from the OSM part and the lidar roof edge.
 * Estimated (from p1/p2 scaled to the lidar rim): the glass base at 12.5 m (the tile band about as tall as the glass on the low sides, p2),
 * leaning out from radius 55.5 to 58; the ring beam 2 m deep; 20 bays
 * (counted in p2, about 17 m a bay); the strut pattern; the podium fascia
 * band. The podium's entrances are drawn as plain door panels where p2 shows
 * the main (east) doors; other doors are not drawn.
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 *  p1 "Phoenix-Arizona Veterans Memorial Coliseum-1965-1.jpg", Marine 69-71,
 *     CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Phoenix-Arizona_Veterans_Memorial_Coliseum-1965-1.jpg
 *     (oblique: the rim rising toward one end over the podium)
 *  p2 "Phoenix-Arizona Veterans Memorial Coliseum-1965-2.jpg", Marine 69-71,
 *     CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Phoenix-Arizona_Veterans_Memorial_Coliseum-1965-2.jpg
 *     (a low side, square on: piers, tile, glass, struts, entrance)
 *  p3 "Arizona Veterans Memorial Coliseum.jpg", Pacman5 (en.wikipedia),
 *     CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Arizona_Veterans_Memorial_Coliseum.jpg
 *     (from the I-10: the saddle's high end rising behind the rim)
 *  USGS NAIP orthophoto: the plan, the pale roof, the brown podium deck.
 * Published: opened 1965, about 14,000 seats (Wikipedia, "Arizona Veterans
 * Memorial Coliseum").
 * No look-only sources. No commercial imagery.
 * Doubts: the north and south (high) ends have no close photo, so their
 * glass and strut pattern repeat the low side's; the glass lean is read from
 * p2 by eye; the struts are drawn about twice their real thickness.
 *
 * Night: the glass glows (`window`); the rim beam is lightly floodlit.
 */
import { Part, type V3, cross, sub } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, ccw, prism, save, toFrame, wall, at, type XY } from './atl-flatiron-building'
import { onWall, rectShape } from './atl-tech-tower'

const ANCHOR = { lng: -112.0966498, lat: 33.4695985 }
const concrete = new Part(), roof = new Part(), glass = new Part(), tile = new Part(), block = new Part(), door = new Part()

// The podium: OSM way/1203515330 in this frame.
const OUTLINE: XY[] = ccw([
  [-17.44, 69.62], [-17.56, 76.99], [-57.9, 77.24], [-58.02, 59.07], [-59.6, 58.91], [-59.18, 21.78], [-65.94, 22.09], [-65.65, -21.5],
  [-62.86, -21.39], [-62.82, -29.56], [-59.39, -29.6], [-59.32, -58.58], [-57.57, -58.65], [-57.64, -76.66], [-16.88, -76.86], [-16.92, -69.8],
  [-50.29, -69.6], [-50.29, -58.76], [-16.69, -58.89], [-16.69, -60.43], [-6.89, -60.31], [-6.77, -74.01], [6.02, -74.08], [6.05, -60.43],
  [16.48, -60.48], [16.48, -58.53], [49.73, -58.33], [49.88, -69.52], [16.72, -69.52], [16.68, -76.75], [57.03, -76.51], [56.96, -58.29],
  [58.84, -58.26], [58.68, -40.76], [67.27, -40.96], [67.23, -11.28], [60.59, -11.31], [60.36, 17.01], [58.56, 17.01], [58.47, 39.32],
  [70.51, 39.0], [70.63, 57.69], [58.44, 57.77], [58.35, 59.44], [56.63, 59.47], [56.68, 77.24], [16.4, 76.97], [16.52, 69.71],
  [49.48, 69.98], [49.69, 59.39], [16.08, 59.24], [16.08, 61.22], [-17.16, 61.14], [-17.09, 59.24], [-50.53, 58.99], [-50.45, 69.9],
])
void toFrame

const CY = 1.5 // the drum's centre, north of the anchor
const R = 58.5 // roof / ring beam radius
const RG = 55.5 // the glass's foot and the tile wall
const DECK = 5.7, GLASS0 = 12.5, BEAM = 2
const BAYS = 20, SEG = BAYS * 4
const surf = (x: number, y: number) => 21.3 + 0.0031 * y * y - 0.00052 * x * x
const ang = (i: number) => (i / SEG) * Math.PI * 2
const pt = (r: number, i: number): XY => [r * Math.cos(ang(i)), CY + r * Math.sin(ang(i))]
const rimZ = (i: number) => { const a = ang(i); return surf(R * Math.cos(a), R * Math.sin(a)) + 0.8 }

// ── Podium: brown block walls with a white fascia band, the brown deck ──
prism(block, OUTLINE, 0, DECK - 1.4, null, 0)
prism(concrete, OUTLINE, DECK - 1.4, DECK, block, 0.2)
// the main doors on the east side (p2): a glazed run under a canopy
onWall(door, [67.27, -40.96], [67.23, -11.28], rectShape(6, 24, 0.3, 3.4), 0.05)
for (const [a, b] of [[[-65.65, -21.5], [-65.94, 22.09]]] as [XY, XY][]) onWall(door, a, b, rectShape(12, 32, 1.6, 4.0), 0.05)

// ── The drum below the glass: tile panels between concrete piers ──
const ringG = Array.from({ length: SEG }, (_, i) => pt(RG, i))
wall(tile, ringG, DECK - 0.5, GLASS0)
for (let k = 0; k < BAYS; k++) {
  const i = k * 4, a = ang(i), c: XY = [Math.cos(a), Math.sin(a)], t: XY = [-Math.sin(a), Math.cos(a)]
  const w = 0.9, d0 = RG - 0.2, d1 = RG + 1.0
  const ring: XY[] = ccw([[c[0] * d0 - t[0] * w, CY + c[1] * d0 - t[1] * w], [c[0] * d1 - t[0] * w, CY + c[1] * d1 - t[1] * w], [c[0] * d1 + t[0] * w, CY + c[1] * d1 + t[1] * w], [c[0] * d0 + t[0] * w, CY + c[1] * d0 + t[1] * w]])
  prism(concrete, ring, DECK - 0.5, GLASS0 + 0.6, concrete, 0.15)
}
// a ledge at the glass's foot
{
  const o = Array.from({ length: SEG }, (_, i) => pt(RG + 0.9, i)), inn = ringG
  wall(concrete, o, GLASS0 - 0.5, GLASS0)
  for (let i = 0; i < SEG; i++) {
    const j = (i + 1) % SEG
    concrete.quad([inn[i][0], inn[i][1], GLASS0], [o[i][0], o[i][1], GLASS0], [o[j][0], o[j][1], GLASS0], [inn[j][0], inn[j][1], GLASS0])
    concrete.quad([o[i][0], o[i][1], GLASS0 - 0.5], [inn[i][0], inn[i][1], GLASS0 - 0.5], [inn[j][0], inn[j][1], GLASS0 - 0.5], [o[j][0], o[j][1], GLASS0 - 0.5])
  }
}

// ── The leaning glass, from the ledge to the underside of the ring beam ──
for (let i = 0; i < SEG; i++) {
  const j = (i + 1) % SEG
  const a0 = pt(RG, i), a1 = pt(RG, j), b0 = pt(R - 0.3, i), b1 = pt(R - 0.3, j)
  glass.quad([a0[0], a0[1], GLASS0], [a1[0], a1[1], GLASS0], [b1[0], b1[1], rimZ(j) - BEAM], [b0[0], b0[1], rimZ(i) - BEAM])
}

// ── The ring beam: outer face, a chamfered top lip, underside ──
for (let i = 0; i < SEG; i++) {
  const j = (i + 1) % SEG
  const o0 = pt(R + 0.5, i), o1 = pt(R + 0.5, j), m0 = pt(R, i), m1 = pt(R, j), n0 = pt(R - 0.3, i), n1 = pt(R - 0.3, j), q0 = pt(R - 1.2, i), q1 = pt(R - 1.2, j)
  const zi = rimZ(i), zj = rimZ(j)
  concrete.quad([o0[0], o0[1], zi - BEAM], [o1[0], o1[1], zj - BEAM], [o1[0], o1[1], zj - 0.4], [o0[0], o0[1], zi - 0.4])
  concrete.quad([o0[0], o0[1], zi - 0.4], [o1[0], o1[1], zj - 0.4], [m1[0], m1[1], zj], [m0[0], m0[1], zi])
  // inner lip down to the roof surface
  concrete.quad([m0[0], m0[1], zi], [m1[0], m1[1], zj], [q1[0], q1[1], zj - 0.8], [q0[0], q0[1], zi - 0.8])
  concrete.quad([n0[0], n0[1], zi - BEAM], [n1[0], n1[1], zj - BEAM], [o1[0], o1[1], zj - BEAM], [o0[0], o0[1], zi - BEAM])
}

// ── The saddle: the hypar surface inside the beam, smooth shaded ──
{
  const RINGS = [0, 0.2, 0.4, 0.6, 0.8, 1]
  const P = (f: number, i: number): V3 => { const q = pt(f * (R - 1.2), i); return [q[0], q[1], surf(q[0], q[1] - CY)] }
  const N = (p: V3): V3 => { const gx = -2 * 0.00052 * p[0], gy = 2 * 0.0031 * (p[1] - CY), l = Math.hypot(gx, gy, 1); return [-gx / l, -gy / l, 1 / l] }
  const step = 2
  for (let k = 0; k < RINGS.length - 1; k++) {
    for (let i = 0; i < SEG; i += step) {
      const j = (i + step) % SEG
      const a = P(RINGS[k], i), b = P(RINGS[k], j), c = P(RINGS[k + 1], j), d = P(RINGS[k + 1], i)
      if (k === 0) roof.tri(a, c, d, undefined, undefined, undefined, [N(a), N(c), N(d)])
      else { roof.tri(a, b, c, undefined, undefined, undefined, [N(a), N(b), N(c)]); roof.tri(a, c, d, undefined, undefined, undefined, [N(a), N(c), N(d)]) }
    }
  }
}

// ── The struts: V from each pier head to the mid-bay node, Λ back up to
// the rim over the next piers; a ball at each node ──
function beam(p: Part, A: V3, B: V3, w: number) {
  const d = sub(B, A), up: V3 = Math.abs(d[2]) > 0.9 * Math.hypot(...d) ? [1, 0, 0] : [0, 0, 1]
  let s = cross(d, up); const ls = Math.hypot(...s); s = s.map((v) => (v / ls) * w / 2) as V3
  let u = cross(s, d); const lu = Math.hypot(...u); u = u.map((v) => (v / lu) * w / 2) as V3
  const C = (P: V3, a: number, b: number): V3 => [P[0] + s[0] * a + u[0] * b, P[1] + s[1] * a + u[1] * b, P[2] + s[2] * a + u[2] * b]
  const ring = (P: V3) => [C(P, -1, -1), C(P, 1, -1), C(P, 1, 1), C(P, -1, 1)]
  const ra = ring(A), rb = ring(B)
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    p.quad(ra[l], ra[k], rb[k], rb[l])
  }
}
function ball(p: Part, c: V3, r: number) {
  const v: V3[] = [[c[0] + r, c[1], c[2]], [c[0] - r, c[1], c[2]], [c[0], c[1] + r, c[2]], [c[0], c[1] - r, c[2]], [c[0], c[1], c[2] + r], [c[0], c[1], c[2] - r]]
  const f = [[0, 2, 4], [2, 1, 4], [1, 3, 4], [3, 0, 4], [2, 0, 5], [1, 2, 5], [3, 1, 5], [0, 3, 5]]
  for (const [a, b, d] of f) p.tri(v[a], v[b], v[d])
}
const off = 1.1
const node = (i: number, f: number): V3 => {
  const z0 = GLASS0 + 0.3, z1 = rimZ(i) - BEAM, z = z0 + (z1 - z0) * f
  const r = RG + (R - 0.3 - RG) * ((z - GLASS0) / (z1 - GLASS0 + 1e-6)) + off
  const q = pt(r, i)
  return [q[0], q[1], z]
}
for (let k = 0; k < BAYS; k++) {
  const i = k * 4, m = i + 2, n = (i + 4) % SEG
  const foot = node(i, 0), mid = node(m, 0.55), top0 = node(i, 1), top1 = node(n, 1)
  beam(concrete, foot, mid, 0.45)
  beam(concrete, node(n, 0), mid, 0.45)
  beam(concrete, mid, top0, 0.45)
  beam(concrete, mid, top1, 0.45)
  ball(concrete, mid, 0.9)
  beam(concrete, node(i, 0), node(i, 1), 0.5) // the pier carried up as a mullion
}

await save('phx-veterans-memorial-coliseum', 'Arizona Veterans Memorial Coliseum', [
  { part: concrete, material: { ...finish('coliseum-concrete', 0xefebe3), floodlight: (p) => (p[2] > 16 ? 0.5 : 0) } },
  { part: roof, material: finish('coliseum-roof', 0xd8ccb6) },
  { part: glass, material: { ...PALETTE.window, color: 0x9fb3c2 } },
  { part: tile, material: finish('coliseum-tile', 0xd9d29e) },
  { part: block, material: finish('coliseum-block', 0xb98258) },
  { part: door, material: { ...PALETTE.entrance, color: 0x6f7b86 } },
], { height: 33, anchor: [ANCHOR.lat, ANCHOR.lng], bearing: 0 }, 5000)
