/**
 * Fuente de la Diana Cazadora (La Flechadora de las Estrellas del Norte),
 * Paseo de la Reforma at Río Mississippi / Sevilla, Mexico City (fountain
 * Vicente Mendiola Quezada, bronze Juan Fernando Olaguíbel, 1942; here
 * since 1992): procedural, CC0-1.0.
 *   bun generators/mexico-city-diana-cazadora.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 152: the
 * model's +y is the way Diana's body faces (south-south-east); she draws
 * her bow toward the model's -x, which is bearing 62, north-east up Reforma
 * toward the Ángel. Origin: the centre of the fountain's OSM outline
 * way/1114974166 (lng -99.171637, lat 19.425124), on the roundabout's
 * paving. The fountain is round and drawn so; only the statue has a front.
 *
 * Form, outside in: the low dark stone wall round the outer channel; the
 * great raised basin, 26 m across, whose dark rim wall the water sheets
 * down; the lower scalloped bowl on its stem; the upper bowl; the square
 * plinth and octagonal pedestal with the four bronze dog-head spouts; the
 * bronze rock and Diana, standing on her right leg, left leg kicked back,
 * body arched, left arm out and up holding the bow, right hand drawn back
 * to her cheek, aiming at the sky to the north-east. No water surface: the
 * basins are drawn as their stone floors and rims; the jets, the hedge on
 * the outer wall and the white rail round the pedestal are left out.
 *
 * Sources
 * - OSM (ODbL): way/1114974166 (amenity=fountain, the outer wall, a 15.3 m
 *   radius circle; not a building, so nothing is replaced);
 *   node/10613432749 (tourism=artwork, height=22: wrong, see below).
 * - Published (es.wikipedia "Fuente de la Diana Cazadora (Ciudad de
 *   México)"): the names, makers and dates; the present site lies on the
 *   line of the arrow shot from the first site at the Chapultepec gate
 *   (south-west), which is how the aim (north-east) is set.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 Jorge Láscar, "Diana Fountain - Paseo de la Reforma
 *     (4610531848).jpg", CC BY 2.0 (level, from across the roundabout: the
 *     main calibration photo, scaled on OSM's 30.6 m wall);
 *     https://commons.wikimedia.org/wiki/File:Diana_Fountain_-_Paseo_de_la_Reforma_(4610531848).jpg
 *   2 Diego Delso, "Fuente de la Diana Cazadora, México D.F., México,
 *     2014-10-13, DD 15.JPG", CC BY-SA 3.0 (level at dusk, lit: second
 *     calibration and the night look);
 *     https://commons.wikimedia.org/wiki/File:Fuente_de_la_Diana_Cazadora,_M%C3%A9xico_D.F.,_M%C3%A9xico,_2014-10-13,_DD_15.JPG
 *   3 Phyrexian, "Ciudad de México - Fuente de la Diana Cazadora
 *     0388.jpg", CC BY-SA 4.0 (telephoto from behind: the bowls, the
 *     octagonal pedestal and its spouts, the pose and the bow);
 *     https://commons.wikimedia.org/wiki/File:Ciudad_de_M%C3%A9xico_-_Fuente_de_la_Diana_Cazadora_0388.jpg
 *   4 Another Believer, "Mexico City (2018) - 020.jpg" and "- 022.jpg",
 *     CC BY-SA 4.0 (the statue side on and from behind);
 *     https://commons.wikimedia.org/wiki/File:Mexico_City_(2018)_-_020.jpg
 *     https://commons.wikimedia.org/wiki/File:Mexico_City_(2018)_-_022.jpg
 *   5 Andres Gil Ron, "Diana Cazadora Fountain.jpg", CC BY-SA 4.0 (from
 *     the north-east, Torre Reforma and BBVA behind: the statue's
 *     orientation);
 *     https://commons.wikimedia.org/wiki/File:Diana_Cazadora_Fountain.jpg
 *   6 PetrohsW, "VistaDesdeTorreDianaPiso30 ohs05.jpg", CC BY-SA 4.0
 *     (from above: the round plan, the basin and the bowls).
 *     https://commons.wikimedia.org/wiki/File:VistaDesdeTorreDianaPiso30_ohs05.jpg
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s);
 *   the site is on the flat lake-bed basin (~2,240 m); elevation 0.
 * - Heights (estimated from photos 1 and 2, 22.7 px/m on the OSM wall):
 *   outer wall 1.0 m; great basin rim 2.7 m, 26.2 m across; lower bowl rim
 *   4.4 m, 7 m across; upper bowl rim 5.8 m, 5.1 m across (widths
 *   checked against the 1.75 m pedestal in photo 3); pedestal to
 *   9.0 m, 1.75 m across the octagon; Diana about 3 m from her feet to her
 *   head and 3.8 m to the bow's tip, so the whole is about 13 m. OSM's
 *   height=22 on the artwork node is about 9 m too high and is not used.
 *   Diana and her bow are drawn 1.5 times life so the pose reads at
 *   phone size (bow tip 15.0 m).
 * - Colours from photos 1 and 3: grey cantera #b0aa9d for the bowls and
 *   pedestal, the darker basalt-grey #8a8780 of the basin walls, the dark
 *   bronze #635c50; the basin floors a dark green-grey #5f6866, as the
 *   water over them reads in photo 6 (no water surface is drawn).
 * - Doubts: the facing is read from photos 3-5 and the published arrow
 *   line, not from a plan; the bowls' scallops are drawn as a wavy rim.
 *
 * Night: the fountain is lit from the basins (photo 2); the bowls, the
 *   pedestal and the statue carry `floodlight`.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { body, ellipsoid, plus, prism, rect, save, tube, unit, type XY } from './dc-wwii-memorial'

const stone = new Part() // cantera bowls and pedestal
const dark = new Part() // basin walls
const bronze = new Part()
const floor = new Part() // basin floors, dark as the water over them

const TAU = Math.PI * 2
const circle = (r: number, n: number, rot = 0): XY[] =>
  Array.from({ length: n }, (_, i) => [r * Math.cos(rot + (i / n) * TAU), r * Math.sin(rot + (i / n) * TAU)])

/** An open ring wall (annulus) between radii r0 < r1, from z0 to z1, with its top. */
function ringWall(p: Part, r0: number, r1: number, z0: number, z1: number, n: number, inner = true) {
  const o = circle(r1, n), i = circle(r0, n)
  for (let k = 0; k < n; k++) {
    const l = (k + 1) % n
    p.quad([o[k][0], o[k][1], z0], [o[l][0], o[l][1], z0], [o[l][0], o[l][1], z1], [o[k][0], o[k][1], z1])
    if (inner) p.quad([i[l][0], i[l][1], z0], [i[k][0], i[k][1], z0], [i[k][0], i[k][1], z1], [i[l][0], i[l][1], z1])
    p.quad([i[k][0], i[k][1], z1], [o[k][0], o[k][1], z1], [o[l][0], o[l][1], z1], [i[l][0], i[l][1], z1])
  }
}
/** A flat disc (floor) at z, facing up. */
const disc = (p: Part, r: number, z: number, n: number) => p.cap(circle(r, n).map(([x, y]) => [x, y, z] as V3), true)

// ---- the outer wall and the great basin --------------------------------------
// Outer wall round the channel: 15.3 m out, 1.0 m high, 1.6 m thick (its
// top carries the hedge, left to the map).
ringWall(dark, 13.7, 15.3, 0, 1.0, 48)
disc(floor, 13.7, 0.3, 24) // the channel floor
// The great basin: a drum with a rim that leans out, 26.2 m across at 2.7 m.
// Its inside is drawn as the basin floor, 0.5 m under the rim.
{
  const n = 48
  const rows: [number, number][] = [[0.3, 12.3], [1.8, 12.5], [2.45, 13.1], [2.7, 13.1]]
  const rings = rows.map(([z, r]) => circle(r, n).map(([x, y]) => [x, y, z] as V3))
  dark.loft(rings)
  ringWall(dark, 12.5, 13.1, 2.7, 2.7, n, false)
  // Inner face of the rim down to the floor, then the floor.
  const ri = circle(12.5, n)
  for (let k = 0; k < n; k++) {
    const l = (k + 1) % n
    dark.quad([ri[l][0], ri[l][1], 2.2], [ri[k][0], ri[k][1], 2.2], [ri[k][0], ri[k][1], 2.7], [ri[l][0], ri[l][1], 2.7])
  }
  disc(floor, 12.5, 2.2, 24)
}

// ---- the bowls ------------------------------------------------------------------
/** A bowl: stem, flaring underside, a scalloped rim and its floor. */
function bowl(c: number, stemR: number, z0: number, zFlare: number, R: number, zRim: number, scallops: number) {
  body(stone, [[z0, stemR, stemR], [zFlare, stemR, stemR], [zFlare + 0.2, stemR * 1.5, stemR * 1.5], [zRim - 0.7, R * 0.78, R * 0.78], [zRim - 0.4, R * 0.97, R * 0.97]], 24)
  // The rim: a band whose top waves in `scallops` lobes.
  const n = scallops * 4
  const o = circle(R, n), i = circle(R - 0.25, n)
  const top = (k: number) => zRim + (k % 4 === 0 ? -0.12 : k % 2 === 0 ? 0.08 : 0)
  for (let k = 0; k < n; k++) {
    const l = (k + 1) % n
    const zb = zRim - 0.45
    stone.quad([o[k][0], o[k][1], zb], [o[l][0], o[l][1], zb], [o[l][0], o[l][1], top(l)], [o[k][0], o[k][1], top(k)])
    stone.quad([i[l][0], i[l][1], zb + 0.25], [i[k][0], i[k][1], zb + 0.25], [i[k][0], i[k][1], top(k)], [i[l][0], i[l][1], top(l)])
    stone.quad([i[k][0], i[k][1], top(k)], [o[k][0], o[k][1], top(k)], [o[l][0], o[l][1], top(l)], [i[l][0], i[l][1], top(l)])
  }
  disc(floor, R - 0.25, zRim - 0.2, n)
  void c
}
bowl(0, 1.3, 2.2, 2.9, 3.5, 4.4, 12)
// The upper stem, a moulded drum, and the upper bowl.
body(stone, [[4.2, 1.25, 1.25], [4.5, 1.35, 1.35], [4.6, 1.15, 1.15], [4.9, 1.15, 1.15]], 20)
bowl(0, 1.0, 4.9, 4.95, 2.55, 5.8, 10)

// ---- the pedestal -------------------------------------------------------------------
prism(stone, rect(0, 0, 1.2, 1.2, 0, 0.3), 5.6, 6.25, 0.1)
// Octagonal shaft, 1.75 m across the flats.
const oct = circle(0.875 / Math.cos(Math.PI / 8), 8, Math.PI / 8)
prism(stone, oct, 6.25, 8.75, 0.08)
prism(stone, circle(1.02, 16), 8.75, 9.0, 0.08)
// Four bronze dog-head spouts on the faces, at 7.6 m.
for (let k = 0; k < 4; k++) {
  const a = (k / 4) * TAU, d: V3 = [Math.cos(a), Math.sin(a), 0]
  tube(bronze, [plus([0, 0, 7.6], [d[0] * 0.8, d[1] * 0.8, 0]), plus([0, 0, 7.55], [d[0] * 1.45, d[1] * 1.45, 0])], [0.24, 0.16], [0.24, 0.16], 6)
}

// ---- Diana --------------------------------------------------------------------------------
// In her own frame: origin at her standing foot's sole, +y the way her body
// faces, the target on her left (-x), metres of the real ~3 m bronze;
// scaled 1.5 onto the pedestal.
{
  const S = 1.5, Z = 9.0
  const V = (p: V3): V3 => [p[0] * S, p[1] * S, Z + p[2] * S]
  const T = (path: V3[], w: number[], d = w, n = 8) => tube(bronze, path.map(V), w.map(v => v * S), d.map(v => v * S), n)
  const E = (c: V3, r: V3, n = 8, rows = 4) => ellipsoid(bronze, V(c), r.map(v => v * S) as V3, n, rows)
  // The bronze rock and waves under her.
  E([0.05, -0.1, 0.2], [0.75, 0.65, 0.35], 10, 4)
  E([0.25, -0.35, 0.55], [0.35, 0.3, 0.35], 6, 3)
  // Right leg, straight, carrying her (on her right, +x).
  T([[0.12, 0, 0.35], [0.14, 0.02, 0.95], [0.16, 0.0, 1.45]], [0.12, 0.13, 0.17])
  // Left leg: thigh down and back, knee bent, the foot kicked up behind.
  T([[-0.12, 0.0, 1.4], [-0.2, -0.25, 0.85], [-0.3, -0.75, 0.75]], [0.17, 0.13, 0.1])
  // Hips and torso, arching back as she aims high.
  T([[0, 0, 1.3], [-0.02, -0.04, 1.75], [-0.04, -0.12, 2.15], [-0.05, -0.2, 2.42]], [0.24, 0.2, 0.24, 0.22], [0.17, 0.14, 0.15, 0.13], 10)
  // Head, turned to the target and tipped up; the hair falling behind.
  E([-0.1, -0.2, 2.68], [0.12, 0.13, 0.14], 8, 4)
  T([[-0.03, -0.3, 2.68], [0.02, -0.38, 2.35]], [0.1, 0.06], [0.08, 0.05], 6)
  // Left arm: out to the target and up, holding the bow.
  const hand: V3 = [-0.95, -0.12, 3.05]
  T([[-0.18, -0.18, 2.42], [-0.55, -0.15, 2.75], hand], [0.07, 0.065, 0.055], undefined, 6)
  // Right arm: elbow up and back, hand drawn to her cheek.
  T([[0.18, -0.2, 2.42], [0.42, -0.35, 2.62], [0.02, -0.18, 2.72]], [0.07, 0.065, 0.055], undefined, 6)
  // The bow: a long curve through her hand, bellied toward the target,
  // drawn a bit thicker than real so it survives at phone size.
  const bow: V3[] = []
  const N = 8
  for (let i = 0; i <= N; i++) {
    const t = i / N, a = (t - 0.5) * 2.0 // radians round the bow's arc
    const R = 0.95
    // Grip at her hand; the tips curve back toward her (+x).
    bow.push([hand[0] + R * (1 - Math.cos(a)), hand[1] - 0.05 * a, hand[2] + R * Math.sin(a) + 0.15])
  }
  T(bow, bow.map((_, i) => (i === 0 || i === N ? 0.03 : 0.045)), undefined, 5)
  // The string, taut from tip to tip, drawn back to her right hand.
  T([bow[0], [0.02, -0.18, 2.72], bow[N]], [0.018, 0.018, 0.018], undefined, 4)
  void unit
}

// Night: lit from the basins below; faces looking up get less.
const flood = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.4 : 1)

await save('mexico-city-diana-cazadora', 'Fuente de la Diana Cazadora', [
  { part: stone, material: { ...finish('cantera-grey', 0xb0aa9d), floodlight: flood } },
  { part: dark, material: finish('basin-grey', 0x8a8780) },
  { part: bronze, material: { ...finish('bronze', 0x635c50), floodlight: flood } },
  { part: floor, material: finish('basin-floor', 0x5f6866) },
], { bearing: 152 }, 5000)
