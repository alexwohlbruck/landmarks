/**
 * Fuente de Petróleos (Monumento a la Expropiación Petrolera), the glorieta
 * where Paseo de la Reforma crosses the Anillo Periférico, Mexico City
 * (Vicente Mendiola, architect, with sculpture by Juan Olaguíbel; 1952):
 * procedural, CC0-1.0.
 *   bun generators/mexico-city-fuente-de-petroleos.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin: the centroid
 * of the round fountain in OSM (way/98280658, amenity=fountain, height=18),
 * on the plaza floor of the glorieta.
 *
 * Form: a tall stele of pale grey stone blocks, its plan a slab with one
 * rounded end (flat back, half-round front), tapering a little and cut off
 * on a slope at the top; it stands on a black granite base. Against the
 * rounded front a relief slab and a group of oil workers (a man with his
 * arm raised, standing and kneeling figures) in reddish-brown stone rise
 * from a pedestal above two tiered round basins. The whole stands in the
 * round pool of the glorieta, modelled as its rim only (no water).
 *
 * Sources
 * - OSM (ODbL): way/98280658 (the fountain, a 35.4 m circle, height=18,
 *   architect Vicente Mendiola, 1952, lit=yes). No building is mapped, so
 *   `replaces` is empty.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 Juan Carlos Fonseca Mata, "Fuente de Petróleos - Ciudad de México.jpg",
 *     CC BY-SA 4.0 (the stele's flat face, its taper and sloped top, the
 *     black base, the sculpture in profile, the tiered basins);
 *     https://commons.wikimedia.org/wiki/File:Fuente_de_Petr%C3%B3leos_-_Ciudad_de_M%C3%A9xico.jpg
 *   2 Juan Carlos Fonseca Mata, "...Detalle.jpg", CC BY-SA 4.0 (the
 *     sculpture's stone and colour);
 *     https://commons.wikimedia.org/wiki/File:Fuente_de_Petr%C3%B3leos_-_Ciudad_de_M%C3%A9xico_-_Detalle.jpg
 *   3 Sarumo74, "Fuente de Petroleos Reforma Mex D.F.jpg", CC BY-SA 4.0 (the
 *     rounded front from the east with the group on the basins; Torre
 *     Reforma 115 at right fixes the direction);
 *     https://commons.wikimedia.org/wiki/File:Fuente_de_Petroleos_Reforma_Mex_D.F.jpg
 *   4 Eric Menjívar, "Monumento a Fuente de Petróleos DF.jpg", CC BY-SA 2.0,
 *     and Eneas, "Monumento a Fuente de Petróleos V.jpg", CC BY 2.0 (from
 *     the south, Plaza Scotiabank behind: the slim rounded silhouette);
 *     https://commons.wikimedia.org/wiki/File:Monumento_a_Fuente_de_Petr%C3%B3leos_DF.jpg
 *     https://commons.wikimedia.org/wiki/File:Monumento_a_Fuente_de_Petr%C3%B3leos_V.jpg
 *   5 JEDIKNIGHT1970, "GLORIETA DE PETROLEOS MEXICANOS.jpg", CC BY 2.5.
 *     https://commons.wikimedia.org/wiki/File:GLORIETA_DE_PETROLEOS_MEXICANOS.jpg
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s);
 *   the glorieta is on the flat lake-bed basin (~2,240 m) and is level.
 * - Published/OSM: total height 18 m (OSM height=18). Estimated from photo
 *   1, scaled by the sculpture's figures (~3 m): black base 3.2 m, stele
 *   4.5 m across tapering to 3.9 m, about 6.5 m front to back, top sloping
 *   from 16.8 m (back) to 18 m (front); the group's figures drawn
 *   ~4 m tall and a third thicker than life so they read at map size; the
 *   group reaches about 11 m.
 * - Orientation estimated from the towers behind the photos (Plaza
 *   Scotiabank to the north, Torre Reforma 115 to the north-west): the
 *   rounded front, the group and the basins face east, down Reforma
 *   towards the city. This is the main doubt.
 * - Doubts: the position of the stele within the pool (centred here); the
 *   back (west) face is not photographed and is drawn plain; the figures
 *   are a bold abstraction of the group (five figures and a relief slab),
 *   not a likeness.
 *
 * Night: the stele and the group are floodlit (OSM lit=yes); the base and
 *   basins stay dark.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { body, ellipsoid, prism, rect, save, tube, TAU, type XY } from './dc-wwii-memorial'

const stele = new Part(), granite = new Part(), sculpt = new Part()

// ---- The pool rim: a low kerb round the 35.4 m circle. ----
{
  const n = 32, r0 = 17.0, r1 = 17.8, h = 0.6
  const P = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * TAU, a1 = ((i + 1) / n) * TAU
    stele.quad(P(r1, a0, 0), P(r1, a1, 0), P(r1, a1, h), P(r1, a0, h))
    stele.quad(P(r0, a1, 0), P(r0, a0, 0), P(r0, a0, h), P(r0, a1, h))
    stele.quad(P(r0, a0, h), P(r1, a0, h), P(r1, a1, h), P(r0, a1, h))
  }
}

// ---- The black granite base. Stele centre at x = -2.6. ----
const SX = -2.6
prism(granite, rect(SX - 1.0, 0, 4.3, 3.4, 0, 0.3), 0, 0.5, 0.1)
prism(granite, rect(SX - 0.9, 0, 4.1, 3.1, 0, 0.2), 0.5, 3.2, 0.15)

// ---- The stele: flat back, half-round front, tapering, sloped top. ----
{
  const z0 = 3.2, zb = 16.8, zf = 18.0
  // Plan at scale k: back at -2.65, straight sides to x = -0.4, then a
  // half circle of radius w to the front.
  const plan = (k: number): XY[] => {
    const w = 2.25 * k, xb = -4.2 * k, xc = -0.4 * k
    const pts: XY[] = [[xb, -w]]
    for (let i = 0; i <= 10; i++) {
      const a = -Math.PI / 2 + (i / 10) * Math.PI
      pts.push([xc + w * Math.cos(a), w * Math.sin(a)])
    }
    pts.push([xb, w])
    return pts.map(([x, y]) => [SX + x, y] as XY)
  }
  const top = (x: number) => zb + ((x - (SX - 4.2)) / 6.45) * (zf - zb)
  const lo = plan(1).map(([x, y]) => [x, y, z0] as V3)
  const hi = plan(0.87).map(([x, y]) => [x, y, top(x)] as V3)
  stele.loft([lo, hi])
  stele.cap(hi, true)
  // A shallow stone band at the foot.
  prism(stele, plan(1.05), z0, z0 + 0.5, 0.1)
}

// ---- The fountain: two tiered basins in front (east) of the stele. ----
function basin(p: Part, cx: number, r: number, zLip: number, depth: number, stemR: number) {
  // Bowl: a stem rising into a flaring dish with a thick lip.
  body(p, [
    [0, stemR, stemR, cx, 0],
    [zLip - depth, stemR, stemR, cx, 0],
    [zLip - depth * 0.45, r * 0.75, r * 0.75, cx, 0],
    [zLip, r, r, cx, 0],
    [zLip + 0.35, r, r, cx, 0],
    [zLip + 0.36, r - 0.4, r - 0.4, cx, 0],
  ], 20, 50)
}
basin(granite, 3.4, 5.6, 2.2, 1.4, 2.6)
basin(granite, 2.4, 2.6, 4.3, 1.1, 1.2)

// ---- The sculpture group, on a pedestal over the upper basin. ----
prism(sculpt, rect(1.2, 0, 1.8, 2.6, 0, 0.15), 4.0, 5.0, 0.1)
// The relief slab behind the figures, hugging the stele's rounded front.
smooth_slab: {
  const n = 9, R0 = 2.15, R1 = 2.9, z0 = 5.0, z1 = 8.8
  for (let i = 0; i < n; i++) {
    const a0 = -1.25 + (i / n) * 2.5, a1 = -1.25 + ((i + 1) / n) * 2.5
    const P = (r: number, a: number, z: number): V3 => [SX - 0.4 + r * Math.cos(a), r * Math.sin(a), z]
    const zt = (a: number) => z1 - 1.6 * Math.abs(a) / 1.25 // a crested top, high at the centre
    sculpt.quad(P(R1, a0, z0), P(R1, a1, z0), P(R1, a1, zt(a1)), P(R1, a0, zt(a0)))
    sculpt.quad(P(R0, a0, zt(a0)), P(R1, a0, zt(a0)), P(R1, a1, zt(a1)), P(R0, a1, zt(a1)))
  }
  for (const s of [-1, 1]) {
    const a = s * 1.25, zt = z1 - 1.6
    const P = (r: number, z: number): V3 => [SX - 0.4 + r * Math.cos(a), r * Math.sin(a), z]
    if (s > 0) sculpt.quad(P(R1, z0), P(R0, z0), P(R0, zt), P(R1, zt))
    else sculpt.quad(P(R0, z0), P(R1, z0), P(R1, zt), P(R0, zt))
  }
}

/** A standing or kneeling figure facing +x, feet at (x, y, z), `h` tall. */
function figure(p: Part, x: number, y: number, z: number, h: number, pose: 'raise' | 'stand' | 'kneel' | 'lean') {
  const s = h / 1.8, t = 1.35 // t: bolder than life, to read at map size
  const kz = pose === 'kneel' ? 0.45 * s : 0
  const hip = z + 0.95 * s - kz, sh = z + 1.5 * s - kz
  // Legs, apart.
  for (const k of [-1, 1]) {
    if (pose === 'kneel' && k < 0)
      tube(p, [[x, y + k * 0.13 * s, hip], [x + 0.45 * s, y + k * 0.13 * s, z + 0.45 * s], [x + 0.45 * s, y + k * 0.13 * s, z]], [0.12 * s * t, 0.1 * s * t, 0.09 * s * t], undefined, 6)
    else
      tube(p, [[x, y + k * 0.12 * s, hip], [x + (pose === 'lean' ? 0.15 * s : 0), y + k * 0.17 * s, z + 0.08]], [0.13 * s * t, 0.09 * s * t], undefined, 6)
  }
  // Torso, shoulders broad.
  body(p, [[hip - 0.05 * s, 0.13 * s * t, 0.18 * s * t, x, y], [hip + 0.25 * s, 0.14 * s * t, 0.2 * s * t, x, y], [sh, 0.15 * s * t, 0.26 * s * t, x + 0.02 * s, y]], 8, 60)
  ellipsoid(p, [x + 0.03 * s, y, sh + 0.2 * s], [0.11 * s * t, 0.1 * s * t, 0.13 * s * t], 8, 4)
  // Arms.
  for (const k of [-1, 1]) {
    const raised = (pose === 'raise' && k > 0)
    const end: V3 = raised ? [x + 0.1 * s, y + k * 0.42 * s, sh + 0.75 * s] : [x + 0.18 * s, y + k * 0.3 * s, hip - 0.05 * s]
    tube(p, [[x, y + k * 0.24 * s, sh - 0.02 * s], end], [0.08 * s * t, 0.065 * s * t], undefined, 6)
  }
}
figure(sculpt, 1.2, 0.1, 5.0, 4.6, 'raise')
figure(sculpt, 0.7, -1.45, 5.0, 4.0, 'stand')
figure(sculpt, 0.8, 1.5, 5.0, 3.9, 'lean')
figure(sculpt, 2.1, -0.85, 5.0, 3.4, 'kneel')
figure(sculpt, 2.2, 1.0, 5.0, 3.3, 'kneel')

const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.55 + 0.4 * Math.min(1, p[2] / 18))
await save('mexico-city-fuente-de-petroleos', 'Fuente de Petróleos', [
  { part: stele, material: { ...finish('stele-stone', 0xcfc8b8), floodlight: lit } },
  { part: granite, material: finish('black-granite', 0x52565b, 0.5) },
  { part: sculpt, material: { ...finish('sculpture-stone', 0x9a7262), floodlight: lit } },
], { bearing: 0 }, 5000)
