/**
 * United Nations Headquarters: the Secretariat and the General Assembly
 * Building — procedural, CC0-1.0, no textures.
 * bun generators/nyc-united-nations.ts
 *
 * Map frame: x = model east (the East River), y = model north, z up,
 * metres. Placed at bearing 29°, the Manhattan grid. Anchor: area centroid
 * of the Secretariat's OSM outline way/137989966; the General Assembly
 * Building stands 22 m north of it, its plan taken from OSM in the same frame.
 *
 * Evidence
 * - OSM: Secretariat way/137989966 (21.5 × 89.8 m, 39 levels) and its parts
 *   261256937/939 (the marble end walls, 156 m) and 261256941 (the glass
 *   slab); General Assembly way/261256936 (plan widening north from 49 to
 *   69 m, with concave flared sides), its dome 261256940 (r ≈ 17 m, 32 m)
 *   and the link block 261256938 (18 m) to the Conference Building.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017) in the model frame
 *   (/tmp/city/nyc/work/nyc-united-nations/grid.txt). The lowest ground
 *   under the footprint is on the east side (≈ 9.2 m NAVD88); the west
 *   plaza is 4 m higher. Above the low side: Secretariat parapet 155 m,
 *   roof screen behind it, a mechanical block to 158 m in the middle;
 *   General Assembly roof 20 m at the south end, level to the dome, then
 *   sweeping up to 26 m at the north front; dome 17 m wide in radius, top
 *   31 m; link block 17 m.
 * - Published: Secretariat 154 m, 39 floors, Harrison & Abramovitz with Le
 *   Corbusier and Niemeyer, 1952: green-glass curtain walls on the broad
 *   east and west faces, solid white Vermont marble end walls, and dark
 *   grilles at the mechanical floors (6th, 16th, 28th and the top). General
 *   Assembly Building, 1952: white marble with concave sides and a swept
 *   roof rising to the glazed north front, a shallow dome over the hall
 *   (Wikipedia; NRHP/HABS NY-6076).
 * - Photos (Wikimedia Commons, daylight): see
 *   /tmp/city/nyc/work/nyc-united-nations/photos/credits.txt.
 *
 * Estimated: the mechanical bands' heights (from a frontal photo: 25, 61,
 * 104 m and the top), the glass bay width (5.6 m), the dome's drum and
 * cap split, the General Assembly's roof curve between the lidar levels.
 * The Conference Building along the river is not modelled.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { finishModel, prism, capPoly, quadN, type XY } from './nyc-570-lexington'

const marble = new Part(), back = new Part(), glass = new Part(), grille = new Part(), roof = new Part()

// --- Secretariat ------------------------------------------------------------------
const X0 = -10.7, X1 = 10.7, Y0 = -44.8, Y1 = 45.0, TOP = 155
const BANDS = [25, 61, 104]

// Marble end walls: the full narrow faces, standing 0.4 m proud of the glass
// and 0.6 m above the parapet, as on the building.
for (const [y0, y1] of [[Y0 - 0.4, Y0 + 1.6], [Y1 - 1.6, Y1 + 0.4]]) {
  prism({ wall: marble, win: null, roof: marble, ring: [[X0 - 0.2, y0], [X1 + 0.2, y0], [X1 + 0.2, y1], [X0 - 0.2, y1]], z0: 0, z1: TOP + 0.6, facade: null, bevel: 0.3 })
}
// The slab between them, with its roof.
prism({ wall: back, win: null, roof, ring: [[X0, Y0 + 1.6], [X1, Y0 + 1.6], [X1, Y1 - 1.6], [X0, Y1 - 1.6]], z0: 0, z1: TOP - 0.4, facade: null, bevel: 0.05 })
// Mechanical block on the roof.
prism({ wall: grille, win: null, roof, ring: [[-6, -8], [6, -8], [6, 24], [-6, 24]], z0: TOP - 1, z1: TOP + 3, facade: null, bevel: 0.3 })

/** Glass bays on a broad face (x = xf, facing +x or −x): three storeys a panel, dark grille bands between. */
function curtain(xf: number, s: 1 | -1) {
  const ya = Y0 + 1.6, yb = Y1 - 1.6, L = yb - ya, bays = 16, pitch = L / bays, mull = 0.7
  const P = (y: number, z: number, d = 0.06): V3 => [xf + s * d, y, z]
  const q = (p: Part, y0: number, y1: number, z0: number, z1: number, d = 0.06) =>
    s > 0 ? p.quad(P(y0, z0, d), P(y1, z0, d), P(y1, z1, d), P(y0, z1, d)) : p.quad(P(y1, z0, d), P(y0, z0, d), P(y0, z1, d), P(y1, z1, d))
  // Grilles: the mechanical floors, and the top storeys behind the parapet screen.
  const grilles: [number, number][] = [...BANDS.map((z) => [z, z + 4.2] as [number, number]), [TOP - 6.5, TOP - 0.4]]
  for (const [z0, z1] of grilles) q(grille, ya, yb, z0, z1, 0.08)
  // Glass between: from the lobby (5 m) up, broken at each grille.
  const spans: [number, number][] = []
  let z = 5
  for (const [g0, g1] of grilles) { spans.push([z, g0]); z = g1 }
  for (const [z0, z1] of spans) {
    const rows = Math.max(1, Math.round((z1 - z0) / 11.2)), rh = (z1 - z0) / rows
    for (let r = 0; r < rows; r++) {
      const lo = z0 + r * rh + 0.35, hi = z0 + (r + 1) * rh - 0.35
      for (let k = 0; k < bays; k++) q(glass, ya + k * pitch + mull / 2, ya + (k + 1) * pitch - mull / 2, lo, hi)
    }
  }
  // Ground-floor glazing, set in the same bays.
  for (let k = 0; k < bays; k++) q(glass, ya + k * pitch + mull / 2, ya + (k + 1) * pitch - mull / 2, 0.6, 4.4)
}
curtain(X1, 1)
curtain(X0, -1)

// --- General Assembly Building -----------------------------------------------------
const west: XY[] = [[-59.1, 67.4], [-59.0, 81.5], [-59.0, 96.7], [-59.5, 110.8], [-60.2, 126.2], [-62.2, 144.5], [-64.6, 161.2], [-66.7, 173.0], [-68.6, 183.1]]
const east: XY[] = [[-9.7, 67.6], [-10.2, 77.7], [-10.1, 103.6], [-9.8, 118.9], [-8.6, 132.0], [-6.3, 150.3], [-1.7, 173.0], [0.4, 183.7]]
const ga: XY[] = [...east, ...west.slice().reverse()] // counter-clockwise: east side north, then west side south
// Roof: level at 20 m to the dome, sweeping up to 26 m at the north front.
const roofZ = (y: number) => 20 + 6 * Math.pow(Math.max(0, (y - 118) / (183.5 - 118)), 1.7)
{
  // Walls, each running from the ground to the swept roof line.
  for (let i = 0; i < ga.length; i++) {
    const a = ga[i], b = ga[(i + 1) % ga.length]
    const n: V3 = (() => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [dy / l, -dx / l, 0] })()
    const north = Math.abs(a[1] - b[1]) < 2 && a[1] > 180
    quadN(marble, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], roofZ(b[1])], [a[0], a[1], roofZ(a[1])], [n, n, n, n])
    if (north) {
      // The glazed north front between marble piers: tall panels, 0.06 m proud.
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
      const cnt = 9, pitch = (L - 8) / cnt
      for (let k = 0; k < cnt; k++) {
        const s0 = 4 + k * pitch + 0.5, s1 = 4 + (k + 1) * pitch - 0.5
        const P = (s: number, z: number): V3 => [a[0] + ux * s + n[0] * 0.06, a[1] + uy * s + n[1] * 0.06, z]
        glass.quad(P(s0, 0.5), P(s1, 0.5), P(s1, roofZ(a[1]) - 3), P(s0, roofZ(a[1]) - 3))
      }
    }
    if (n[0] < -0.5 && Math.min(a[1], b[1]) >= 80 && Math.max(a[1], b[1]) <= 150) {
      // West side: the recessed glazed lobby band under the marble wall.
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
      const P = (s: number, z: number): V3 => [a[0] + ux * s + n[0] * 0.06, a[1] + uy * s + n[1] * 0.06, z]
      glass.quad(P(0.4, 0.5), P(L - 0.4, 0.5), P(L - 0.4, 6), P(0.4, 6))
    }
    if (Math.abs(a[1] - b[1]) < 2 && a[1] < 70) {
      // South front: a low glazed band at the foot of the marble wall.
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
      const P = (s: number, z: number): V3 => [a[0] + ux * s + n[0] * 0.06, a[1] + uy * s + n[1] * 0.06, z]
      glass.quad(P(6, 0.5), P(L - 6, 0.5), P(L - 6, 5), P(6, 5))
    }
  }
  // Roof surface, following the sweep.
  const tmp = new Part()
  capPoly(tmp, ga, 0, true)
  for (let i = 0; i < tmp.pos.length; i += 9) {
    const p = [0, 3, 6].map((k) => [tmp.pos[i + k], -tmp.pos[i + k + 2]] as XY)
    roof.tri([p[0][0], p[0][1], roofZ(p[0][1])], [p[1][0], p[1][1], roofZ(p[1][1])], [p[2][0], p[2][1], roofZ(p[2][1])])
  }
}
// The dome: a low drum and a shallow cap over the hall.
{
  const cx = -33.2, cy = 126.9, n = 24
  const ring = (r: number, z: number): V3[] => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * 2 * Math.PI), cy + r * Math.sin((i / n) * 2 * Math.PI), z] as V3)
  const rings: V3[][] = [ring(16.6, 19), ring(16.6, 23.5)]
  for (let k = 1; k <= 5; k++) { const t = (k / 5) * (Math.PI / 2); rings.push(ring(16.6 * Math.cos(t) + 0.01, 23.5 + 7.5 * Math.sin(t))) }
  // Smooth the cap: loft with per-vertex normals by hand.
  for (let k = 0; k < rings.length - 1; k++) {
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const nr = (p: V3, kk: number): V3 => { if (kk < 1 || (kk === 1 && k === 0)) return [(p[0] - cx) / 16.6, (p[1] - cy) / 16.6, 0]; const dz = (p[2] - 23.5) / 7.5, dr = Math.hypot(p[0] - cx, p[1] - cy) / 16.6; const l = Math.hypot(dr, dz) || 1; return [((p[0] - cx) / (Math.hypot(p[0] - cx, p[1] - cy) || 1)) * dr / l, ((p[1] - cy) / (Math.hypot(p[0] - cx, p[1] - cy) || 1)) * dr / l, dz / l] }
      const a = rings[k][i], b = rings[k][j], c = rings[k + 1][j], d = rings[k + 1][i]
      quadN(roof, a, b, c, d, [nr(a, k), nr(b, k), nr(c, k + 1), nr(d, k + 1)])
    }
  }
}
// The link block to the Conference Building (OSM 261256938).
prism({ wall: marble, win: null, roof, ring: [[-10.1, 77.7], [7.7, 77.8], [7.7, 103.6], [-10.1, 103.6]], z0: 0, z1: 17, facade: null, bevel: 0.3 })

finishModel('United Nations Headquarters', 'nyc-united-nations', [
  { part: marble, material: finish('un-marble', 0xefece5) },
  { part: back, material: finish('un-mullion', 0xc6d2cf) },
  { part: glass, material: windowVariant(2, 0x88a6a4) },
  { part: grille, material: finish('un-grille', 0x5c6468) },
  { part: roof, material: PALETTE.roof },
], { bearing: 29, osm: 'way/137989966', height: 158 })
