/**
 * The Old Globe, Balboa Park, San Diego, with the rest of the Conrad Prebys
 * Theatre Center it stands in. The Globe was built in 1935 as a replica of
 * Shakespeare's Globe for the California Pacific International Exposition;
 * after the 1978 fire it was rebuilt in 1982 (Liebhardt, Weston & Associates)
 * as a many-sided Tudor drum: buff stucco and dark half-timbering, leaded
 * oriel windows on the upper storey, under a steep brown shingled roof with
 * a flat top, a horseshoe in plan whose rounded end faces the Globe plaza
 * (south-east), backed by a tall stage house.
 *
 * What it covers. OSM maps the Globe only as a node (node/8680715940 "Old
 * Globe Theater", wikidata Q7084094) inside the outline way/51538418
 * ("Conrad Prebys Theatre Center", formerly the Simon Edison Centre), which
 * also holds the Sheryl and Harvey White Theatre (the round block to the
 * north-east), the stage house, offices and shops. The outline has no
 * building:parts. So the model replaces the whole outline and draws all of
 * it: the Globe in full, the rest as plain stucco masses at their lidar
 * heights, so nothing of the old extrusion shows through. The Lowell Davies
 * Festival Theatre (way/51538419) to the east is not part of it.
 *
 * Frame: bearing 0. +x east, +y north, z up, metres; origin at the anchor
 * -117.15231, 32.73226 (0.4 m from the outline's centroid). z = 0 is the
 * lowest ground under the outline, its west edge (lidar 6.8 m above the
 * box's ground_min); the Globe plaza on the east and south is 3.8 m higher,
 * so the west walls run down the slope.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): outline, the Globe node. The drum's
 *   rounded end follows the outline's arc, a circle of r 14.3 about
 *   (8.5, −4) (measured from its vertices).
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), 0.5 m grid: Globe
 *   eave 11.7 (the drip edge, 7.9 m above the plaza), the shingled roof rising
 *   steeply from it (lidar climbs 3 m in the first 2 m in), flat roof top 16.2 (r ≈ 8.5), stage house 17.7, White
 *   Theatre 11.8, the rest 10–10.8, a tall block in the west at 16
 *   (all z, measured).
 * - USGS NAIP orthophoto: the horseshoe plan (a brown shingled ring round a
 *   pale flat top), the stage house as a pale rectangle turned 45° behind
 *   it, the White Theatre's round pale roof.
 * - Wikipedia "Old Globe Theatre": 1935, the 1978 fire, rebuilt 1982;
 *   about 600 seats.
 * Photos (evidence, Wikimedia Commons):
 * - "Balboa Park, San Diego, CA, USA - panoramio (171).jpg" and "(172)",
 *   Roman Eugeniusz, CC BY-SA 3.0 (the drum from the plaza; the timbering,
 *   oriels, doors and the string of lights at the eave):
 *   https://commons.wikimedia.org/wiki/File:Balboa_Park,_San_Diego,_CA,_USA_-_panoramio_(171).jpg
 * - "San Diego, 2016 - 319.jpg", Another Believer, CC BY-SA 4.0 (frontal):
 *   https://commons.wikimedia.org/wiki/File:San_Diego,_2016_-_319.jpg
 * - "Old Globe Theatre 2 2014-03-12.jpg", FASTILY, CC BY-SA 3.0 (from the
 *   south-east, the roof): https://commons.wikimedia.org/wiki/File:Old_Globe_Theatre_2_2014-03-12.jpg
 * - "Old globe theatre.jpg", Dan Anderson, CC BY-SA 3.0 (from the south):
 *   https://commons.wikimedia.org/wiki/File:Old_globe_theatre.jpg
 *
 * Numbers
 * - Drum wall r 13.6, eave r 14.2, 2 storeys (floor band at 3.8 m above the
 *   plaza) — the lidar eave and the photos; 24 facets round the full
 *   circle (counted on the photos: five to six facets across the front).
 * - Oriels: on every other upper facet, 1.9 m wide (estimated from Eugeniusz 171).
 * - Stage house corners (−13.5, 10.5), (0, 23.5), (11.5, 12), (−2, −1),
 *   from NAIP (measured).
 *
 * Doubts
 * - The stucco of the Globe is buff, not white, in every photo; that is
 *   what is drawn.
 * - The other parts of the centre (the White Theatre, offices, shops and
 *   the lobby) are plain masses from lidar; only their heights are known.
 * - The diagonal braces of the timbering are left out; posts and rails
 *   carry the pattern.
 * - The flat top is real and broad: lidar reads 23.0 ± 0.1 m (z 16.2) over a
 *   circle of r ≈ 9 about the drum's centre, and NAIP shows it pale. So the
 *   shingled roof is a steep ring 4.5 m tall (57% of the 7.9 m wall above
 *   the plaza; Eugeniusz 171 shows about 40%, the roof foreshortened from
 *   the plaza), not a cone to a small top; it reads as tall as the walls only
 *   from eye level near the drum.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { bead } from './bridge-kit'
import { orientTo, ringPrism, saveModel, facePoly, ngon, type Face, type XY } from './sd-california-tower'

const OUTLINE: XY[] = [[3.1, -17.0], [7.7, -17.8], [15.6, -16.4], [18.3, -13.4], [20.1, -11.4], [22.2, -6.4], [22.2, -0.9], [20.7, 1.5], [24.0, 0.7], [24.2, -5.7], [42.8, -5.4], [42.7, 2.9], [35.4, 19.4], [31.6, 24.1], [28.5, 26.6], [24.4, 27.9], [-0.2, 28.1], [-1.6, 26.6], [0.0, 25.1], [0.9, 25.1], [1.0, 22.6], [4.7, 22.6], [8.9, 18.1], [6.0, 15.4], [-2.6, 23.8], [-3.5, 23.0], [-6.0, 26.0], [-18.7, 26.5], [-31.5, 14.3], [-31.7, -31.1], [11.5, -31.3], [11.5, -23.5], [-1.6, -23.4], [-1.6, -17.2], [-6.3, -12.9], [-4.1, -10.6]]

const STUCCO = finish('globe-stucco', 0xdcc5a2)
const TIMBER = finish('globe-timber', 0x7b5b45)
const ROOF = finish('globe-roof', 0x6b5143)
const PALE = finish('globe-flat-roof', 0xd6d0c6)

function build() {
  const stucco = new Part(), timber = new Part(), roof = new Part(), pale = new Part(), glass = new Part(), lamp = new Part()
  const PLAZA = 3.8

  // ---- The rest of the centre: the outline at 10 m with the Globe's arc cut away
  // (the drum stands there), the White Theatre, the west block.
  const REST: XY[] = [[2.0, -8.0], [14.0, 0.5], ...OUTLINE.slice(7)]
  ringPrism(stucco, REST, 0, 10.0, pale)
  ringPrism(stucco, ngon(26.5, 15.5, 11, 16), 3, 11.8, pale)
  ringPrism(stucco, [[-28, 1], [-14, 1], [-14, 10], [-28, 10]], 0, 16.0, pale)

  // ---- Stage house, turned 45°.
  const STAGE: XY[] = [[-13.5, 10.5], [-2, -1], [11.5, 12], [0, 23.5]]
  ringPrism(stucco, STAGE, 0, 17.7, pale)

  // ---- The Globe: a horseshoe drum, rounded to the south-east.
  const C: XY = [8.5, -4.0]
  const ax = Math.atan2(0.85, -0.53) // toward the stage house
  const RW = 13.6, RE = 14.2, RT = 9.0, EAVE = 11.7, TOP = 16.2, L = 10
  const N = 12 // facets on the half circle
  const ring = (r: number, z: number): V3[] => {
    const pts: V3[] = []
    // back straight side, round the south-east, other straight side
    const a0 = ax + Math.PI / 2, a1 = ax + (3 * Math.PI) / 2
    pts.push([C[0] + r * Math.cos(a0) + L * Math.cos(ax), C[1] + r * Math.sin(a0) + L * Math.sin(ax), z])
    for (let k = 0; k <= N; k++) {
      const a = a0 + ((a1 - a0) * k) / N
      pts.push([C[0] + r * Math.cos(a), C[1] + r * Math.sin(a), z])
    }
    pts.push([C[0] + r * Math.cos(a1) + L * Math.cos(ax), C[1] + r * Math.sin(a1) + L * Math.sin(ax), z])
    return pts
  }
  // walls (only the rounded facets and the straight sides; the back is inside the stage house)
  const wall0 = ring(RW, 0), wall1 = ring(RW, EAVE)
  for (let k = 0; k < wall0.length - 1; k++) {
    const a = wall0[k], b = wall0[k + 1], m: V3 = [(a[0] + b[0]) / 2 - C[0], (a[1] + b[1]) / 2 - C[1], 0]
    orientTo(stucco, [a, b, wall1[k + 1], wall1[k]], m)
  }
  // the roof: eave ring (overhanging) up to the flat top; a soffit under the overhang
  const e0 = ring(RE, EAVE - 0.15), e1 = ring(RE, EAVE + 0.25), t = ring(RT, TOP)
  // a bell: a steep lower roof (about 57°) rising 2.7 m in 1.6 m, then a gentler upper
  // slope to the flat top's edge (lidar: 18.4 → 21.4 m over the first 2 m in from the drip edge)
  const mid = ring(RE - 1.6, EAVE + 0.25 + 2.45)
  for (let k = 0; k < e0.length - 1; k++) {
    const m: V3 = [(e0[k][0] + e0[k + 1][0]) / 2 - C[0], (e0[k][1] + e0[k + 1][1]) / 2 - C[1], 0]
    orientTo(roof, [e0[k], e0[k + 1], e1[k + 1], e1[k]], m)
    orientTo(roof, [e1[k], e1[k + 1], mid[k + 1], mid[k]], [m[0], m[1], 6])
    orientTo(roof, [mid[k], mid[k + 1], t[k + 1], t[k]], [m[0], m[1], 12])
    orientTo(timber, [wall1[k], wall1[k + 1], e0[k + 1], e0[k]], [0, 0, -1])
  }
  for (let k = 1; k < t.length - 1; k++) orientTo(pale, [t[0], t[k], t[k + 1]], [0, 0, 1])

  // ---- Half-timbering, oriels, doors and the string of lights, facet by facet.
  const facets: { F: Face; w: number; out: XY }[] = []
  for (let k = 1; k < wall0.length - 2; k++) {
    const a = wall0[k], b = wall0[k + 1]
    const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const n: V3 = [m[0] - C[0], m[1] - C[1], 0]
    const l = Math.hypot(n[0], n[1]); n[0] /= l; n[1] /= l
    facets.push({ F: { o: [m[0], m[1], 0], u: [-n[1], n[0], 0], n }, w: Math.hypot(b[0] - a[0], b[1] - a[1]), out: [n[0], n[1]] })
  }
  const FLOOR = PLAZA + 3.9
  facets.forEach(({ F, w }, i) => {
    const hw = w / 2
    // posts at the facet's corners, rails at the floor line and under the eave, a sill at the plaza
    for (const s of [-1, 1]) facePoly(timber, F, [[s * hw - 0.32 * s, PLAZA], [s * hw, PLAZA], [s * hw, EAVE], [s * hw - 0.32 * s, EAVE]].map(([u, z]) => [u, z] as XY), 0.06)
    facePoly(timber, F, [[-hw, FLOOR - 0.25], [hw, FLOOR - 0.25], [hw, FLOOR + 0.25], [-hw, FLOOR + 0.25]], 0.06)
    facePoly(timber, F, [[-hw, EAVE - 0.6], [hw, EAVE - 0.6], [hw, EAVE], [-hw, EAVE]], 0.06)
    facePoly(timber, F, [[-hw, PLAZA - 0.6], [hw, PLAZA - 0.6], [hw, PLAZA + 0.35], [-hw, PLAZA + 0.35]], 0.06)
    // a mid post on each storey
    facePoly(timber, F, [[-0.14, PLAZA], [0.14, PLAZA], [0.14, FLOOR], [-0.14, FLOOR]], 0.06)
    if (i % 2 === 0) {
      // the oriel: a shallow box with dark leaded glass, on the upper storey
      const z0 = FLOOR + 0.9, z1 = EAVE - 1.2, ow = 1.0, d = 0.55
      const P = (u: number, z: number, dd: number): V3 => [F.o[0] + F.u[0] * u + F.n[0] * dd, F.o[1] + F.u[1] * u + F.n[1] * dd, z]
      orientTo(glass, [P(-ow, z0, d), P(ow, z0, d), P(ow, z1, d), P(-ow, z1, d)], F.n)
      for (const s of [-1, 1]) orientTo(timber, [P(s * ow, z0, 0), P(s * ow, z0, d), P(s * ow, z1, d), P(s * ow, z1, 0)], [F.u[0] * s, F.u[1] * s, 0])
      orientTo(timber, [P(-ow - 0.1, z1, 0), P(ow + 0.1, z1, 0), P(ow + 0.1, z1, d + 0.1), P(-ow - 0.1, z1, d + 0.1)], [0, 0, 1])
      orientTo(timber, [P(-ow - 0.1, z1 + 0.25, d + 0.1), P(ow + 0.1, z1 + 0.25, d + 0.1), P(ow + 0.1, z1, d + 0.1), P(-ow - 0.1, z1, d + 0.1)], F.n)
      orientTo(timber, [P(-ow, z0, 0), P(ow, z0, 0), P(ow, z0, d), P(-ow, z0, d)], [0, 0, -1])
      orientTo(timber, [P(-ow, z0 - 0.3, 0), P(ow, z0 - 0.3, 0), P(ow, z0, d), P(-ow, z0, d)], [F.n[0], F.n[1], -1])
    } else {
      // a pair of brown doors on the ground storey
      facePoly(timber, F, [[-0.9, PLAZA], [0.9, PLAZA], [0.9, PLAZA + 2.6], [-0.9, PLAZA + 2.6]], 0.08)
    }
  })
  // lights along the eave
  for (let k = 0; k <= 30; k++) {
    const a = ax + Math.PI / 2 + (Math.PI * k) / 30
    bead(lamp, [C[0] + (RE + 0.05) * Math.cos(a), C[1] + (RE + 0.05) * Math.sin(a), EAVE - 0.35], 0.16, true)
  }

  // ---- Night: the drum's walls are lit from the plaza.
  const lit = (p: V3, n: V3) => (n[2] > 0.6 ? 0.1 : Math.hypot(p[0] - C[0], p[1] - C[1]) < RE + 1 && p[2] > PLAZA ? 0.6 : 0.15)
  return [
    { part: stucco, material: { ...STUCCO, floodlight: lit } },
    { part: timber, material: { ...TIMBER, floodlight: lit } },
    { part: roof, material: ROOF },
    { part: pale, material: PALE },
    { part: glass, material: finish('window', 0x5a5c5e, 0.35) },
    { part: lamp, material: finish('lamp', 0xe0d8c4) },
  ]
}

if (import.meta.main) await saveModel('sd-old-globe-theatre', 'The Old Globe', build())
