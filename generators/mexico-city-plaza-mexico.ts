/**
 * Plaza México (Monumental Plaza de Toros México, 1944-46, Modesto C.
 * Rolland), Ciudad de los Deportes, Benito Juárez, Mexico City: the
 * world's largest bullring. Procedural, CC0-1.0.
 * bun generators/mexico-city-plaza-mexico.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0 (a round bowl).
 * Origin: the area centroid of OSM way/25337390 (the outer ring of
 * relation/8726671), lng -99.180102, lat 19.3829771.
 *
 * y = 0 is the ring (the sand floor, which is not modelled: it is the
 * map's ground). The ring lies about 20 m below the streets around it, so
 * the catalog elevation is -20: the bowl is a funnel dug into the ground,
 * and only its top ~16 m stands above the street.
 *
 * Form, from the photos: from the ring outward, a red barrera wall and the
 * red first rows, a broad band of blue numbered seats, grey concrete
 * tiers to a dark ring of vomitories, then the upper grey tiers to the
 * rim. Outside, at street level, the bowl's upper rake stands on an open
 * frame of ochre-yellow concrete columns with red feet and zigzag ramps
 * between them, under a cream parapet band at the top. The main gate on
 * the west side is a white stone portal carrying a bronze group of bulls
 * and a mounted rejoneador.
 *
 * Sources
 * - OSM (ODbL): relation/8726671 (building stadium, levels 3, concrete):
 *   outer way/25337390, a circle r 77.9-78.4 (measured), inner
 *   way/611773682 r 23.3-23.5 (the ring and callejón; measured).
 * - Published: ring ~43 m across; ring floor ~20 m below the surrounding
 *   streets (Ciudad de México tourism office, mexicocity.cdmx.gob.mx,
 *   "plaza de toros"; also chilango.com "La Monumental Plaza México": 20 m
 *   down and 15.9 m up); capacity 41,262.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 Arne Müseler, "Mexico city Monumental Plaza de Toros México.JPG",
 *     CC BY-SA 3.0 de (aerial from the south: seating bands, the vomitory
 *     ring, the ochre frame, red feet, cream parapet);
 *     https://commons.wikimedia.org/wiki/File:Mexico_city_Monumental_Plaza_de_Toros_M%C3%A9xico.JPG
 *   2 Arne Müseler, "Mexico city Estadio Ciudad de los Deportes Monumental
 *     Plaza de Toros México.JPG", CC BY-SA 3.0 de (the bowl in its block);
 *     https://commons.wikimedia.org/wiki/File:Mexico_city_Estadio_Ciudad_de_los_Deportes_Monumental_Plaza_de_Toros_M%C3%A9xico.JPG
 *   3 Mario Yaír TS, "Interior de la Monumental Plaza de Toros México.jpg",
 *     CC BY-SA 4.0 (red and blue seat bands);
 *     https://commons.wikimedia.org/wiki/File:Interior_de_la_Monumental_Plaza_de_Toros_M%C3%A9xico.jpg
 *   4 AlejandroLinaresGarcia, "EntrancePlazaTorosDF.JPG", CC BY-SA 4.0, and
 *     Jorge De la Vega, "Main entrance - Plaza Mexico.jpg", CC BY-SA 4.0
 *     (the gate and its bronze group; the frame and parapet from the street);
 *     https://commons.wikimedia.org/wiki/File:EntrancePlazaTorosDF.JPG
 *     https://commons.wikimedia.org/wiki/File:Main_entrance_-_Plaza_Mexico.jpg
 *   5 Jorge De la Vega, "La Plaza Mexico view.jpg", CC BY-SA 4.0, and
 *     JavierDo, "Plaza México - panoramio.jpg", CC BY-SA 3.0 (the bowl's
 *     section from the stands);
 *     https://commons.wikimedia.org/wiki/File:La_Plaza_Mexico_view.jpg
 *     https://commons.wikimedia.org/wiki/File:Plaza_M%C3%A9xico_-_panoramio.jpg
 * - Numbers: rim at 35.9 m above the ring (20 + 15.9, published); street
 *   level 20 m; seat bands (red to r 30, blue to r 40, vomitory ring at
 *   r 56-57, z 21-23.6) estimated from photos 1, 3 and 5; frame columns
 *   every 7.5 degrees (48, counted on photo 1, ~10 m bays); parapet band
 *   31-35.9 m; gate pillars 8 m, opening 6 m, bronze group ~3 m tall
 *   (estimated from photo 4, people for scale).
 * - Doubts: the gate's position (drawn on the west side, on Augusto
 *   Rodin, from photo 4's street; no plan source); the other entrances'
 *   statues of bullfighters are too small and left out; aisles, the
 *   judge's box, signage and lighting masts are left out.
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s);
 *   flat lake-bed basin (~2,240 m).
 * - Look-only: none.
 * - Night: the cream parapet and ochre frame are floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { slab, save, orient, type XY } from './dc-nmaahc'

const grey = new Part(), red = new Part(), blue = new Part(), ochre = new Part(), cream = new Part(), dark = new Part()

const N = 64
const STREET = 20.0, RIM = 35.9, R_OUT = 78.2
const ang = (k: number) => (k / N) * 2 * Math.PI
const pt = (k: number, r: number, z: number): V3 => [r * Math.cos(ang(k)), r * Math.sin(ang(k)), z]

/** A band of revolution from (r0, z0) to (r1, z1), facing toward `up` (+1: up and inward; -1: outward). */
function band(p: Part, r0: number, z0: number, r1: number, z1: number, inward = true) {
  for (let k = 0; k < N; k++) {
    const a = pt(k, r0, z0), b = pt(k + 1, r0, z0), c = pt(k + 1, r1, z1), d = pt(k, r1, z1)
    const m = (ang(k) + ang(k + 1)) / 2
    // profile normal: perpendicular to (dr, dz), pointing inward/up for a bowl
    const dr = r1 - r0, dz = z1 - z0
    let nr = -dz, nz = dr
    if (inward && nz < 0) { nr = -nr; nz = -nz }
    if (!inward && nr < 0) { nr = -nr; nz = -nz }
    if (Math.abs(dr) < 1e-6) { nr = inward ? -1 : 1; nz = 0 }
    orient(p, [a, b, c, d], [Math.cos(m) * nr, Math.sin(m) * nr, nz])
  }
}

// --- The bowl, from the ring out --------------------------------------------
band(red, 23.3, 0, 23.3, 1.7) // barrera wall, facing the ring
band(red, 23.3, 1.7, 24.6, 1.7) // its top and the callejón
band(red, 24.6, 1.7, 24.6, 2.6)
band(red, 24.6, 2.6, 30.0, 5.6) // red first rows
band(grey, 30.0, 5.6, 30.0, 6.0)
band(blue, 30.0, 6.0, 40.0, 12.0) // blue numbered seats
band(grey, 40.0, 12.0, 40.0, 12.6)
band(grey, 40.0, 12.6, 56.0, 21.0) // lower general tiers
band(dark, 56.0, 21.0, 56.0, 23.6) // the vomitory ring: a dark riser
band(dark, 56.0, 23.6, 57.2, 23.6) // its walkway
band(grey, 57.2, 23.6, 74.0, 34.2) // upper tiers
// the cream parapet at the rim
band(cream, 74.0, 34.2, 74.0, RIM)
band(cream, 74.0, RIM, R_OUT, RIM)
band(cream, R_OUT, 31.0, R_OUT, RIM, false)
// the rake's soffit over the street frame, and the outer wall below it
band(grey, R_OUT, 31.0, 75.0, 31.0, false)
band(grey, 75.0, 0, 75.0, 31.0, false)
// vomitory mouths in the dark riser: lighter frames every 22.5 degrees
for (let k = 0; k < N; k += 4) {
  const a = pt(k + 0.25, 55.9, 21.0), b = pt(k + 0.75, 55.9, 21.0)
  orient(cream, [a, b, [b[0], b[1], 23.6], [a[0], a[1], 23.6]], [-Math.cos(ang(k + 0.5)), -Math.sin(ang(k + 0.5)), 0])
}

// --- The street frame: ochre columns, red feet, zigzag ramps --------------
const C = 48, RC = 76.8
const box = (p: Part, cx: number, cy: number, w: number, d: number, a: number, z0: number, z1: number) => {
  const ux = Math.cos(a), uy = Math.sin(a), vx = -uy, vy = ux
  const r: XY[] = [[cx - ux * d - vx * w, cy - uy * d - vy * w], [cx + ux * d - vx * w, cy + uy * d - vy * w], [cx + ux * d + vx * w, cy + uy * d + vy * w], [cx - ux * d + vx * w, cy - uy * d + vy * w]]
  slab(p, r, z0, z1, 0, true)
}
for (let k = 0; k < C; k++) {
  const a = (k / C) * 2 * Math.PI
  const cx = RC * Math.cos(a), cy = RC * Math.sin(a)
  box(ochre, cx, cy, 0.7, 0.7, a, STREET + 1.6, 31.0)
  box(red, cx, cy, 0.8, 0.8, a, STREET - 1.0, STREET + 1.6)
  // a ramp flight between this column and the next, alternating up and down
  const b = ((k + 1) / C) * 2 * Math.PI, rr = 76.2
  const up = k % 2 === 0
  const z0 = up ? STREET + 1.0 : STREET + 5.2, z1 = up ? STREET + 5.2 : STREET + 1.0
  const A0: V3 = [rr * Math.cos(a + 0.012), rr * Math.sin(a + 0.012), z0], A1: V3 = [rr * Math.cos(b - 0.012), rr * Math.sin(b - 0.012), z1]
  const o0: XY = [Math.cos(a), Math.sin(a)], o1: XY = [Math.cos(b), Math.sin(b)]
  const t = 0.45, h = 0.9
  const q = (P: V3, o: XY, s: number, dz: number): V3 => [P[0] + o[0] * s, P[1] + o[1] * s, P[2] + dz]
  const outer = [q(A0, o0, t, 0), q(A1, o1, t, 0), q(A1, o1, t, h), q(A0, o0, t, h)]
  orient(ochre, outer, [(o0[0] + o1[0]) / 2, (o0[1] + o1[1]) / 2, 0])
  orient(ochre, [q(A0, o0, -t, h), q(A1, o1, -t, h), q(A1, o1, t, h), q(A0, o0, t, h)], [0, 0, 1])
  orient(ochre, [q(A0, o0, -t, 0), q(A1, o1, -t, 0), q(A1, o1, t, 0), q(A0, o0, t, 0)], [0, 0, -1])
}
// a ring beam tying the column heads under the parapet
band(ochre, RC + 0.75, 29.6, RC + 0.75, 31.0, false)

// --- The main gate, west side, with its bronze group ------------------------
{
  const a = (190 * Math.PI) / 180 // gate axis, slightly south of west
  const ox = Math.cos(a), oy = Math.sin(a), tx = -oy, ty = ox
  const R = 86.0
  const at = (s: number, d: number): XY => [ox * (R + d) + tx * s, oy * (R + d) + ty * s]
  const rectA = (s0: number, s1: number, d0: number, d1: number): XY[] => [at(s0, d0), at(s1, d0), at(s1, d1), at(s0, d1)]
  for (const s of [-1, 1]) slab(cream, rectA(s * 3.0, s * 5.2, -1.1, 1.1), STREET, STREET + 8.0, 0.25)
  slab(cream, rectA(-5.6, 5.6, -1.3, 1.3), STREET + 8.0, STREET + 9.6, 0.3)
  // the bronze group: a low mass of bulls with a horseman rising at one end
  slab(dark, rectA(-4.6, 4.6, -0.8, 0.8), STREET + 9.6, STREET + 11.4, 0.4)
  slab(dark, rectA(-4.0, 1.5, -0.6, 0.6), STREET + 11.4, STREET + 12.0, 0.25)
  slab(dark, rectA(2.2, 4.4, -0.7, 0.7), STREET + 11.4, STREET + 12.9, 0.3)
  slab(dark, rectA(3.0, 3.8, -0.35, 0.35), STREET + 12.9, STREET + 13.8, 0.15)
  // the gate's dark ironwork between the pillars
  const g0 = at(-3.0, 0.2), g1 = at(3.0, 0.2)
  orient(dark, [[...g0, STREET], [...g1, STREET], [...g1, STREET + 3.2], [...g0, STREET + 3.2]] as V3[], [ox, oy, 0])
  orient(dark, [[...g1, STREET], [...g0, STREET], [...g0, STREET + 3.2], [...g1, STREET + 3.2]] as V3[], [-ox, -oy, 0])
}

const lit = (p: V3, n: V3) => (p[2] > STREET && Math.hypot(p[0], p[1]) > 74.5 && n[2] < 0.6 ? 0.9 : 0)
await save('mexico-city-plaza-mexico', 'Plaza México', [
  { part: grey, material: finish('plaza-mexico-concrete', 0xbcb2a4) },
  { part: red, material: PALETTE.terracotta },
  { part: blue, material: finish('plaza-mexico-seats-blue', 0x7189b5) },
  { part: ochre, material: { ...finish('plaza-mexico-ochre', 0xd4b16e), floodlight: lit } as any },
  { part: cream, material: { ...PALETTE.stone, floodlight: lit } as any },
  { part: dark, material: finish('plaza-mexico-bronze', 0x4f4a45) },
], { name: 'Plaza México' }, 6500)
