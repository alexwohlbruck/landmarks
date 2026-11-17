/**
 * Estela de Luz, Paseo de la Reforma at the Puerta de los Leones of
 * Chapultepec, Mexico City (César Pérez Becerril, 2011-12; the bicentennial
 * monument): procedural, CC0-1.0.
 *   bun generators/mexico-city-estela-de-luz.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 333.8, so the
 * model's +x is the slabs' long axis (bearing 63.8, along Reforma) and +y
 * points across them (to bearing 333.8). Origin: the centre of the two slabs
 * in OSM (lng -99.1758528, lat 19.4229409), on the floor of the sunken plaza
 * of the Centro de Cultura Digital the monument stands in.
 *
 * Form: two parallel slabs, 9.1 m long and 0.8 m thick, 5.2 m apart centre
 * to centre (6 m over all), 104 m tall, their outer faces clad in pale
 * quartz panels; each slab stands on four short steel legs (its cladding
 * starts 3.3 m up); the narrow ends and the faces into the gap are a steel
 * frame of fins; four big steel tubes run the full height in the gap at its
 * ends; steel cross-frames tie the slabs together across the gap at
 * intervals, and a steel lift frame runs up the middle. The monument is
 * symmetric about both axes and is modelled so.
 *
 * Sources
 * - OSM (ODbL): way/311593047 (building=yes, height=104, the outline) and
 *   its parts way/1228354772, way/1228354773 (the two quartz slabs,
 *   height=104, one min_height=3) and way/1228354771 (the steel core
 *   between them). Plan measured from them: slabs 9.1 x 0.8 m, both spanning
 *   the same stretch of the axis (not staggered), centrelines 5.2 m apart.
 *   All are replaced.
 * - Published (es.wikipedia "Estela de Luz"): 104 m tall, 6 m wide, steel
 *   columns carrying two bodies clad in rows of quartz plates, lit by LEDs
 *   (Osram) at night.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 Diego Delso, "Estela de Luz y Torre Mayor, México D.F., México,
 *     2014-10-13, DD 02.JPG" and "DD 03.JPG", CC BY-SA 3.0 (the end and a
 *     broad face, level, by day: the tubes, the fin frame, the cladding);
 *     https://commons.wikimedia.org/wiki/File:Estela_de_Luz_y_Torre_Mayor,_M%C3%A9xico_D.F.,_M%C3%A9xico,_2014-10-13,_DD_02.JPG
 *     https://commons.wikimedia.org/wiki/File:Estela_de_Luz_y_Torre_Mayor,_M%C3%A9xico_D.F.,_M%C3%A9xico,_2014-10-13,_DD_03.JPG
 *   2 Luis Alvaz, "Vista de la Estela de Luz (conocida como Suavicrema)
 *     01.jpg" and "02.jpg", CC BY-SA 4.0 (the foot in the sunken plaza: the
 *     legs, the cladding's start, the plaza walls);
 *     https://commons.wikimedia.org/wiki/File:Vista_de_la_Estela_de_Luz_(conocida_como_Suavicrema)_01.jpg
 *     https://commons.wikimedia.org/wiki/File:Vista_de_la_Estela_de_Luz_(conocida_como_Suavicrema)_02.jpg
 *   3 Another Believer, "Mexico City (2018) - 027.jpg", CC BY-SA 4.0 (a
 *     broad face from Reforma: the cladding's colour);
 *     https://commons.wikimedia.org/wiki/File:Mexico_City_(2018)_-_027.jpg
 *   4 vladimix, "Estela de Luz Mexico City KR.jpg", CC BY-SA 2.0 (the end
 *     from below: the gap, the tubes, the cross-frames).
 *     https://commons.wikimedia.org/wiki/File:Estela_de_Luz_Mexico_City_KR.jpg
 * - Terrain and elevation: Mapterhorn has no z15 terrain here
 *   (tools/terrain.ts 404s); the site is on the flat lake-bed basin
 *   (~2,240 m). y = 0 is the sunken plaza's floor; elevation -4.5, the
 *   plaza's depth below Reforma, estimated from photo 2 (plaza walls about
 *   2.7 times a person's height). The 104 m is taken from the plaza floor.
 * - Estimated: legs 3.3 m (OSM min_height 3 and photo 2: about twice a
 *   person), leg and tube diameters (0.9 and 1.2 m), the cross-frames'
 *   spacing (drawn every 13 m, sparser than real) from photo 4.
 * - Colours: the quartz from photos 1-3, warm pale #dccab0; galvanised
 *   steel #a3a8ab.
 * - Doubts: the plaza depth and whether the published 104 m counts from
 *   the plaza or the street; the panel grid is left out (the faces are
 *   plain) because a grid would shimmer.
 *
 * Night: the slabs glow from inside (LEDs behind the quartz), so the quartz
 *   is `neon-quartz`, glowing in its own pale colour; the steel stays dark.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { prism, rect, save, tube } from './dc-wwii-memorial'

const quartz = new Part()
const steel = new Part()

const H = 104, LEG = 3.3, HU = 4.55, V0 = 2.6, HT = 0.4

for (const s of [-1, 1]) {
  const v = s * V0
  // The quartz slab, its edges softly bevelled.
  prism(quartz, rect(0, v, HU, HT, 0, 0.12), LEG, H, 0.15)
  // Its underside is steel: a plate under the cladding.
  prism(steel, rect(0, v, HU, HT + 0.05), LEG - 0.4, LEG, 0.05)
  // The steel fin frame on the face into the gap and round the ends.
  prism(steel, rect(0, v - s * (HT + 0.12), HU - 0.1, 0.14), LEG, H - 0.2, 0.04)
  for (const e of [-1, 1]) prism(steel, rect(e * (HU + 0.12), v, 0.14, HT + 0.05), LEG - 0.4, H - 0.2, 0.04)
  // Four legs under each slab.
  for (const u of [-3.4, -1.15, 1.15, 3.4]) tube(steel, [[u, v, 0], [u, v, LEG - 0.3]], [0.45, 0.45], [0.45, 0.45], 10)
}
// The four tubes in the gap, near its ends.
for (const e of [-1, 1]) for (const s of [-1, 1])
  tube(steel, [[e * 3.9, s * 1.55, 0], [e * 3.9, s * 1.55, H - 1.0]], [0.6, 0.6], [0.6, 0.6], 12)
// Cross-frames across the gap, every 13 m: a deep beam at each end and the
// middle, tying the slabs.
for (let z = 13; z < H - 4; z += 13)
  for (const u of [-3.9, 0, 3.9]) prism(steel, rect(u, 0, u === 0 ? 0.5 : 0.35, V0 - HT, 0), z, z + 1.1, 0.05)
// The lift frame up the middle of the gap: four posts.
for (const u of [-1.1, 1.1]) for (const v of [-1.0, 1.0]) prism(steel, rect(u, v, 0.18, 0.18), 0, H - 3, 0.03)

await save('mexico-city-estela-de-luz', 'Estela de Luz', [
  { part: quartz, material: finish('neon-quartz', 0xdccab0, 0.6) },
  { part: steel, material: finish('steel', 0xa3a8ab, 0.5) },
], { bearing: 333.8 }, 5000)
