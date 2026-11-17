/**
 * Hartsfield-Jackson Atlanta International Airport air traffic control tower
 * ("Atlanta Tower", FAA; opened 2006, 121 m, the tallest control tower in North
 * America when built) — original procedural geometry, CC0-1.0.
 * bun generators/atl-hartsfield-jackson-control-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, origin at the anchor on the
 * ground. Anchor = centroid of OSM way/169785102 ("Atlanta Tower",
 * aeroway=tower, tower:type=airport_control, height 121), a 14 m circle,
 * 33.6417075, -84.4216905. Bearing 0: the tower is round.
 *
 * What makes it this tower, from the photos below: a tall plain cream
 * concrete shaft; stepped corbels flaring out under a cream collar ring;
 * a dark recessed band; a big drum-shaped head, wider at the top, banded in
 * cream with two light glazed bands, each with a strip of darker windows;
 * then a narrower cab of dark outward-leaning glass under a grey metal roof,
 * and a small penthouse with masts on top.
 *
 * Evidence:
 *  - footprint: OSM way/169785102 (r 7.0 m). The lidar's shaft face lies about
 *    5.5 m from the centre and the photos make the shaft 11.5–12.7 m across,
 *    so the shaft is drawn at r 6.2 tapering to 5.8.
 *  - heights: USGS 3DEP lidar GA_Central_5_2018 (2018 flight; the statewide
 *    B2/B3 sets have no points here), 0.5 m grid, above the apron (291.8 m):
 *    the collar's top is a ring of returns at 83.8 m, radius 10.2 m. The flight
 *    has no returns on the head or cab, so everything above the collar is
 *    scaled from photos at that collar (JGlover's near-elevation telephoto,
 *    6.1 px/m): head 87.1–106.8 m, cab base 107–110, cab glass 110–115, roof
 *    to 116.6, penthouse to 120.5. Published height 121 m (398 ft;
 *    Wikipedia, FAA); OSM height 121.
 *  - widths (photo-scaled at the same 6.1 px/m): corbels flaring to r 9 under
 *    the collar; head r 10.3 at its foot to r 11.9 at its top; cab r 8.6–9.4;
 *    penthouse 9 m across.
 *  - band layout of the head: from Mav's close-up.
 *  - colours: cream concrete, light grey-blue glazing with darker window
 *    strips, dark cab glass, grey metal roof, from the daylight photos.
 *  - y = 0 is the apron (flat within 0.5 m; Mapterhorn agrees); elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - ATL-Tower.jpg, J. Glover (Atlanta), CC BY 3.0 US
 *    https://commons.wikimedia.org/wiki/File:ATL-Tower.jpg (elevation, used to scale)
 *  - ATL_tower_closeup.JPG, Mav, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:ATL_tower_closeup.JPG (head and cab)
 *  - ControlTowerATL-Sunset-Dec2012_(33297413075).jpg, formulanone, CC BY-SA 2.0
 *    https://commons.wikimedia.org/wiki/File:ControlTowerATL-Sunset-Dec2012_(33297413075).jpg
 *    (the whole tower from the apron)
 *  - Control_Tower_at_Hartsfield-Jackson_Atlanta_International_Airport_-_panoramio.jpg,
 *    qwesy qwesy, CC BY 3.0
 *    https://commons.wikimedia.org/wiki/File:Control_Tower_at_Hartsfield-Jackson_Atlanta_International_Airport_-_panoramio.jpg
 *  - Delta_N345NW_Airbus_A320_Rear_-_Atlanta_Control_Tower_(43770376420).jpg,
 *    formulanone, CC BY-SA 2.0
 *    https://commons.wikimedia.org/wiki/File:Delta_N345NW_Airbus_A320_Rear_-_Atlanta_Control_Tower_(43770376420).jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the head and cab heights rest on photo scaling, not lidar. The
 * shaft's shallow vertical grooves, the balcony railings, the radar and the
 * thin antennas are left out (one bold mast stands in for them). The low base
 * building beside the shaft is another OSM building (way/450317737).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const N = 16
const ring = (r: number, z: number, rot = 0.5): V3[] =>
  Array.from({ length: N }, (_, i) => {
    const a = ((i + rot) / N) * 2 * Math.PI
    return [r * Math.cos(a), r * Math.sin(a), z]
  })

const concrete = new Part(), glazing = new Part(), dark = new Part(), metal = new Part(), roofP = new Part()
const cab = new Part() // cab glass and the head's darker window strips

/** A lofted drum through [radius, z] stations. */
const drum = (p: Part, st: [number, number][]) => p.loft(st.map(([r, z]) => ring(r, z)))
/** A flat annulus facing up (or down) between two radii. */
function annulus(p: Part, r0: number, r1: number, z: number, up = true) {
  const a = ring(r0, z), b = ring(r1, z)
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    if (up) p.quad(a[i], b[i], b[j], a[j])
    else p.quad(a[i], a[j], b[j], b[i])
  }
}

// shaft: plain, slightly tapered, then stepped corbels flaring out
drum(concrete, [[6.2, 0], [5.8, 72.5]])
drum(concrete, [[5.8, 72.5], [7.0, 75.5], [7.0, 77], [8.4, 78.5], [8.4, 79.4], [9.4, 80.5]])
// collar ring with bevelled edges
drum(concrete, [[9.4, 80.5], [10.2, 81.0], [10.2, 83.3], [9.8, 83.8]])
annulus(concrete, 9.0, 9.8, 83.8)
// dark recessed band
drum(dark, [[9.0, 83.8], [9.0, 87.1]])
annulus(concrete, 9.0, 10.3, 87.1, false)

// head: a drum widening upward, cream with two glazed bands
const headR = (z: number) => 10.3 + (11.9 - 10.3) * (z - 87.1) / (105.4 - 87.1)
drum(concrete, [[headR(87.1), 87.1], [headR(105.4), 105.4]])
const band = (p: Part, z0: number, z1: number, proud: number) => drum(p, [[headR(z0) + proud, z0], [headR(z1) + proud, z1]])
band(glazing, 89.3, 94.2, 0.06)
band(cab, 91.0, 92.6, 0.12)
band(glazing, 96.0, 103.0, 0.06)
band(cab, 98.6, 100.4, 0.12)
// the head's top: a cream lip sloping in to the cab's base
drum(concrete, [[11.9, 105.4], [12.1, 105.9], [9.2, 106.8]])
annulus(roofP, 8.6, 9.2, 106.8)

// cab: cream base, dark glass leaning out, grey metal roof sloping in
drum(concrete, [[8.6, 106.8], [8.6, 110.0]])
annulus(concrete, 8.6, 8.8, 110.0, false)
drum(cab, [[8.8, 110.0], [9.5, 115.0]])
drum(metal, [[9.5, 115.0], [9.7, 115.4], [6.0, 116.6]])
annulus(metal, 0, 6.0, 116.6)
// penthouse and mast
const sq = (h: number, z: number): V3[] => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]]
concrete.loft([sq(4.0, 116.6), sq(4.0, 120.0)])
concrete.cap(sq(4.0, 120.0), true)
metal.loft([sq(0.35, 120.0), sq(0.2, 121.0)])
metal.cap(sq(0.2, 121.0), true)

const parts = [
  { part: concrete, material: { ...finish('atl-tower-concrete', 0xe3d6bc), floodlight: (p: V3, n: V3) => (p[2] > 70 && n[2] < 0.6 ? 0.6 : 0) } },
  { part: glazing, material: windowVariant(2, 0xa7b8c6) },
  { part: dark, material: finish('atl-tower-dark', 0x6c7682) },
  { part: cab, material: PALETTE.window },
  { part: metal, material: finish('atl-tower-metal', 0x9aa1a8) },
  { part: roofP, material: PALETTE.roof },
]
const tris = parts.reduce((n, { part }) => n + part.triangles, 0)
const glb = writeGlb('Hartsfield-Jackson Control Tower', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  bearing: 0, elevation: 0, height: 121, replaces: ['way/169785102'],
})
const out = process.argv[2] ?? new URL('../models/atl-hartsfield-jackson-control-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
