/**
 * Tempe City Hall (Tempe Municipal Building), Tempe, Arizona (1971,
 * Michael and Kemper Goodwin) — original procedural geometry, CC0-1.0.
 * bun generators/phx-tempe-city-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * centroid of OSM way/182798022 (-111.9384113, 33.4249199). Bearing 0;
 * the square's sides run at 45 and 135 degrees, as in OSM.
 *
 * What is drawn: way/182798022, the inverted pyramid, and the pale
 * concrete stair tower beside its south-east face with the two bridges
 * that join them (in the photos; OSM doesn't map the tower). The sunken
 * garden court round the base is ground and left to the map.
 *
 * Identity (from the photos below):
 *  1. An inverted pyramid: a square that widens storey by storey, its
 *     four glass faces leaning out at about 45 degrees.       (dad, v1, v5)
 *  2. Bronze-tinted glass in a bronze frame: floor bands and members
 *     running down the slope, converging to the narrow base.     (dad, v1)
 *  3. The flat roof with a deep bronze fascia.                     (dad)
 *  4. The tall, plain concrete stair tower with a sloping top, joined by
 *     two bridges.                                                  (dad)
 *
 * Plan: OSM, a square of side 38.6 m (centre (-3.3, 1.2) here); the
 * lidar's roof matches it within a metre. Heights: USGS 3DEP lidar
 * AZ_MaricopaPinal_1_2020 (flown 2020), 0.5 m grid: the street around it
 * 356.5 m; the roof 12.8 m above (flat); the stair tower's top 14.7.
 *
 * Estimated: the faces' lean (about 44 degrees, from the dad and v1
 * photos: the base square drawn 14.6 m across at the street, the roof
 * 38.6); four storeys (lobby at grade and three above, 3.2 m each, which
 * fills the lidar height); the frame members' spacing; the stair tower's
 * size (3 x 7.5 m, from NAIP and dad) and its sloping top; the bridges'
 * levels.
 *
 * Photos (evidence, Wikimedia Commons):
 *  dad  "Tempe City Hall - Tempe, AZ.JPG", Daderot, public domain
 *       https://commons.wikimedia.org/wiki/File:Tempe_City_Hall_-_Tempe,_AZ.JPG
 *  v1   "Tempe Municipal Building-1.jpg", Visitor7, CC BY-SA 3.0
 *       https://commons.wikimedia.org/wiki/File:Tempe_Municipal_Building-1.jpg
 *  v5   "Tempe Municipal Building-5.jpg", Visitor7, CC BY-SA 3.0 (the frame
 *       close up; the base meets the walkway level)
 *       https://commons.wikimedia.org/wiki/File:Tempe_Municipal_Building-5.jpg
 * USGS NAIP orthophoto (public domain) for the plan. No look-only sources.
 * No commercial imagery.
 *
 * Doubts: whether the lowest floor opens onto the sunken court below the
 * street (drawn with the base at street level, as v1 shows the walkway
 * meeting the bottom of the frame); the notch OSM cuts at the south
 * corner is not drawn. Elevation 0.
 *
 * Night: the glass faces glow (window); the frame stays bronze.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ccw, prism, save, type XY } from './atl-flatiron-building'

const glass = new Part(), bronze = new Part(), roofP = new Part(), concrete = new Part()

function face(p: Part, q: V3[], want: V3) {
  const b = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], c = [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]]
  const g = [b[1] * c[2] - b[2] * c[1], b[2] * c[0] - b[0] * c[2], b[0] * c[1] - b[1] * c[0]]
  const r = g[0] * want[0] + g[1] * want[1] + g[2] * want[2] < 0 ? [...q].reverse() : q
  if (r.length === 3) p.tri(r[0], r[1], r[2])
  else p.quad(r[0], r[1], r[2], r[3])
}

const C: XY = [-3.3, 1.2]
const H0 = 7.3, H1 = 19.3 // half-sides at the base and at the roof
const Z0 = 0, Z1 = 12.0, TOP = 12.8, FLOORS = [3.2, 6.4, 9.6]
// local axes: u along the 45-degree sides (north-east), v along 135 (south-east... turned)
const s2 = Math.SQRT1_2
const U: XY = [s2, s2], Vv: XY = [-s2, s2]
const P = (u: number, v: number, z: number): V3 => [C[0] + U[0] * u + Vv[0] * v, C[1] + U[1] * u + Vv[1] * v, z]
const half = (z: number) => H0 + ((H1 - H0) * (z - Z0)) / (Z1 - Z0)

// the four leaning faces; each face's outward direction in (u, v)
const sides: [number, number][] = [[1, 0], [0, 1], [-1, 0], [0, -1]]
for (const [du, dv] of sides) {
  // a point on the face at height z and position t (-1..1) across it
  const Q = (t: number, z: number, out = 0): V3 => {
    const h = half(z) + out
    return du ? P(du * h, t * half(z) * -du, z) : P(t * half(z) * dv, dv * h, z)
  }
  const n: V3 = (() => { const o = du ? P(du, 0, 0) : P(0, dv, 0); return [o[0] - C[0], o[1] - C[1], -0.98] })()
  // glass between the floor bands
  const bands = [Z0, ...FLOORS, Z1]
  for (let k = 0; k < bands.length - 1; k++) face(glass, [Q(-1, bands[k]), Q(1, bands[k]), Q(1, bands[k + 1]), Q(-1, bands[k + 1])], n)
  // the bronze floor bands, standing just proud of the glass
  for (const z of FLOORS) face(bronze, [Q(-1, z - 0.3, 0.08), Q(1, z - 0.3, 0.08), Q(1, z + 0.3, 0.08), Q(-1, z + 0.3, 0.08)], n)
  // members down the slope, converging on the base: 6 bays at the roof
  for (let i = 1; i < 6; i++) {
    const t = -1 + (2 * i) / 6, w = 0.35
    face(bronze, [Q(t - w / half(Z0), Z0, 0.1), Q(t + w / half(Z0), Z0, 0.1), Q(t + w / half(Z1), Z1, 0.1), Q(t - w / half(Z1), Z1, 0.1)], n)
  }
}
// the hips: bronze corner members
for (const [a, b] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
  const q0 = P(a * H0, b * H0, Z0), q1 = P(a * H1, b * H1, Z1)
  const out: V3 = [q1[0] - C[0], q1[1] - C[1], 0]
  const l = Math.hypot(out[0], out[1]), o: XY = [(out[0] / l) * 0.15, (out[1] / l) * 0.15]
  const side: XY = [-out[1] / l * 0.35, out[0] / l * 0.35]
  face(bronze, [[q0[0] + o[0] - side[0] * 0.5, q0[1] + o[1] - side[1] * 0.5, Z0], [q0[0] + o[0] + side[0] * 0.5, q0[1] + o[1] + side[1] * 0.5, Z0], [q1[0] + o[0] + side[0], q1[1] + o[1] + side[1], Z1], [q1[0] + o[0] - side[0], q1[1] + o[1] - side[1], Z1]], [out[0], out[1], -0.5])
}
// the bottom (the base of the pyramid) and the bronze fascia and flat roof
face(bronze, [P(H0, H0, Z0 + 0.02), P(-H0, H0, Z0 + 0.02), P(-H0, -H0, Z0 + 0.02), P(H0, -H0, Z0 + 0.02)], [0, 0, -1])
const roofRing: XY[] = ccw([[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([a, b]) => { const q = P(a * (H1 + 0.25), b * (H1 + 0.25), 0); return [q[0], q[1]] as XY }))
prism(bronze, roofRing, Z1, TOP, roofP, 0.2, true)

// ── the stair tower and its two bridges ──
// A 3 x 7.5 m concrete slab tower standing off the south-east face (u
// along the face), its top sloping up away from the pyramid.
{
  const v0 = -(H1 + 4.2), v1 = v0 - 3, u0 = -2, u1 = 5.5
  const ring: XY[] = ccw([[u0, v0], [u1, v0], [u1, v1], [u0, v1]].map(([u, v]) => { const q = P(u, v, 0); return [q[0], q[1]] as XY }))
  prism(concrete, ring, 0, 13.0, concrete, 0.25)
  // the sloping top: a wedge rising from 13.0 at the pyramid side to 14.7
  const a = P(u0, v0, 13), b = P(u1, v0, 13), c = P(u1, v1, 13), d = P(u0, v1, 13)
  const c2: V3 = [c[0], c[1], 14.7], d2: V3 = [d[0], d[1], 14.7]
  face(concrete, [a, b, c2, d2], [0, 0, 1])
  face(concrete, [c, d, d2, c2], P(0, -1, 0).map((x, k) => x - [C[0], C[1], 0][k]) as V3)
  face(concrete, [b, c, c2], P(1, 0, 0).map((x, k) => x - [C[0], C[1], 0][k]) as V3)
  face(concrete, [d, a, d2], P(-1, 0, 0).map((x, k) => x - [C[0], C[1], 0][k]) as V3)
  // the bridges at the second and fourth floors, from the tower to the glass
  for (const z of [3.2, 9.6]) {
    const vIn = -half(z) + 0.1
    const br: XY[] = ccw([[0, vIn], [3.5, vIn], [3.5, v0], [0, v0]].map(([u, v]) => { const q = P(u, v, 0); return [q[0], q[1]] as XY }))
    prism(concrete, br, z - 0.6, z + 1.1, concrete, 0.12, true)
  }
}

await save('phx-tempe-city-hall', 'Tempe City Hall', [
  { part: glass, material: { ...PALETTE.window, color: 0x7c7a74 } },
  { part: bronze, material: finish('tempe-bronze', 0x8d7458) },
  { part: roofP, material: finish('tempe-roof', 0xd5cbbb) },
  { part: concrete, material: finish('tempe-concrete', 0xcdc3b6) },
], { height: 14.7, anchor: [33.4249199, -111.9384113], bearing: 0 }, 5000)
