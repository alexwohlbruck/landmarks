/**
 * Hotel San Carlos, Phoenix (1928, G. Lescher & M. Kibbey; Italian
 * Renaissance Revival) — original procedural geometry, CC0-1.0.
 * bun generators/phx-hotel-san-carlos.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * anchor. Bearing 0: OSM's walls run within half a degree of north–south.
 * Anchor -112.0741846, 33.4506110, the centroid of OSM way/37057883 (202 N
 * Central Avenue), an L on the north-west corner of Central Avenue (east)
 * and Monroe Street (south); the hotel's POI is node/2470073524 inside it.
 *
 * Identity (from the photos below):
 *  1. The tall black blade sign standing out diagonally from the corner of
 *     Central and Monroe, "SAN CARLOS" stacked down it and a wider head
 *     on top reading "Hotel" in script, rising to the cornice; lit in neon
 *     at night.                                        (cygn, pinter, stark)
 *  2. A seven-storey block of warm sandstone-coloured render with plain
 *     punched windows, under a deep frieze and bracketed cornice.   (cygn)
 *  3. A set-back roof storey with arched dormers under maroon awnings,
 *     and a few maroon awnings and balconies on the fronts.  (cygn, pinter)
 *  4. A ground floor of shopfronts under maroon and black canopies.  (cygn)
 *
 * Plan: OSM way/37057883 as drawn: the Monroe bar x -11.5..19.7, y
 * -15..0.4; the Central bar x 4.1..19.7, y 0.4..15.3. The sidewalk canopy
 * along Monroe is OSM way/1086578117 (building=roof), y -16.8..-15; it is
 * drawn, and carried round the corner along Central (cygn). The two-storey
 * neighbour way/144358749 fills the L's inner corner and is left to the map.
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (2020 flight), 0.5 m
 * grid; the street 331.5 m is y = 0. Measured (model metres): the main
 * roof and cornice 23.5–24; the roof storey 27–28; the stair tower 29.5;
 * the canopy 3.5–4. The lidar sits about 2 m east of OSM here; OSM is kept.
 * Published: seven storeys, 1928 (National Register, Wikipedia).
 * Estimated from cygn scaled to the lidar: the storey lines (a 5 m ground
 * storey, 3 m floors), the frieze 19.9–22.4 and the cornice above, the
 * roof storey set 1.6 m back, the windows (1 m wide, about 2.6 m apart),
 * the blade sign (7–20.5 m, 1.3 m out, the head to 23.5 m, 3.8 m out).
 * The letters are traced from pinter: plain upright capitals, "Hotel" a
 * bold upright script.
 *
 * Photos (evidence, Wikimedia Commons):
 *  cygn   "Hotel San Carlos - South East Corner - 2009-12-08.JPG",
 *         Cygnusloop99, CC BY-SA 3.0: the corner, both fronts, the roof storey
 *         https://commons.wikimedia.org/wiki/File:Hotel_San_Carlos_-_South_East_Corner_-_2009-12-08.JPG
 *  pinter "Hotel San Carlos, Copper Square, Phoenix, Arizona - panoramio.jpg",
 *         davidpinter, CC BY 3.0: the blade sign's letters and the cornice
 *         https://commons.wikimedia.org/wiki/File:Hotel_San_Carlos,_Copper_Square,_Phoenix,_Arizona_-_panoramio.jpg
 *  stark  "San Carlos (6962485526).jpg", Alan Stark, CC BY-SA 2.0: from the
 *         north along Central at night, the lit sign, the north wall
 *         https://commons.wikimedia.org/wiki/File:San_Carlos_(6962485526).jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the west wall is seen in no photo; it is drawn like the north
 * wall. The roof storey's plan is read from the lidar at 0.5 m and photos
 * of two sides only. The frieze's panels, the brackets, the balconies'
 * balusters and the shopfront signs are left out.
 *
 * Night: the windows glow; the shopfronts are `entrance`; the sign's letters
 * are neon (lit white-blue, stark); the stone is lightly floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, ccw, cornice, offset, onWall, prism, rectShape, save, type XY } from './atl-tech-tower'
import { Pen, strokes } from './lettering'
import { curtain, exposed, type Block } from './phx-chase-tower'

const stone = new Part(), win = new Part(), maroon = new Part(), sign = new Part(), neon = new Part(), shop = new Part()

const L: XY[] = ccw([[19.75, -14.87], [19.58, 15.46], [4.09, 15.32], [4.20, 0.40], [-11.46, 0.42], [-11.51, -15.12]])
const BODY: Block = { ring: L, z0: 0, z1: 23.5 }
const NEIGH: Block = { ring: ccw([[-23.51, -15.22], [-11.51, -15.12], [-11.46, 0.42], [4.2, 0.4], [4.09, 15.32], [-21.1, 15.1], [-23.73, 8.94]]), z0: 0, z1: 9 }
const ROOFST: Block = { ring: offset(L, -1.6), z0: 23.5, z1: 27 }

// ── Massing: the body, the frieze band, the cornice, the roof storey ──
prism(stone, L, 0, 23.5, stone, 0.3)
cornice(stone, L, 4.8, 0.6, 0.25, null) // over the shopfronts
cornice(stone, L, 19.6, 0.5, 0.25, null) // under the frieze
cornice(stone, L, 22.3, 1.2, 0.85, stone) // the bracketed main cornice
prism(stone, ROOFST.ring, 23.5, 27, stone, 0.25)
prism(maroon, offset(ROOFST.ring, 0.25), 26.7, 27.15, stone, 0.12) // the roof storey's tile coping
box(stone, 0, 4, -6.5, -2, 27, 29.5, stone, 0.25) // the stair tower

// ── Windows: one panel per window, a row per floor ──
const FLOORS = [5.6, 8.6, 11.6, 14.6, 17.6] // sills, floors 2–6
const isFront = (a: XY, c: XY) => Math.abs(a[1] - c[1]) < 0.5 ? a[1] < -14 : a[0] > 19 // Monroe or Central
for (const [a, c, zf] of exposed(BODY, [BODY, NEIGH])) {
  const Lf = Math.hypot(c[0] - a[0], c[1] - a[1])
  const n = Math.max(1, Math.round((Lf - 2.4) / 2.6)), w = (Lf - 2.4) / n
  for (let k = 0; k < n; k++) {
    const s = 1.2 + (k + 0.5) * w
    for (const z of FLOORS) if (z > zf) onWall(win, a, c, rectShape(s - 0.5, s + 0.5, z, z + 1.75))
    // the seventh floor's short windows in the frieze
    if (20.2 > zf) onWall(win, a, c, rectShape(s - 0.45, s + 0.45, 20.5, 21.7))
  }
  // the ground floor: shopfronts on the two street fronts
  if (isFront(a, c)) for (let k = 0; k < n; k += 2) {
    const s0 = 1.2 + k * w + 0.3, s1 = Math.min(Lf - 1.2, 1.2 + (k + 2) * w - 0.3)
    if (s1 - s0 > 1) onWall(shop, a, c, rectShape(s0, s1, 0, 3.4))
  }
}
// the roof storey: arched dormers on the street fronts, each under an awning
for (const [a, c] of exposed(ROOFST, [ROOFST])) {
  if (!isFront(a, c) && !(Math.abs(a[1] - c[1]) < 0.5 && a[1] < -12) && !(a[0] > 17)) continue
  const Lf = Math.hypot(c[0] - a[0], c[1] - a[1]), n = Math.max(1, Math.round((Lf - 2) / 3.6)), w = (Lf - 2) / n
  const t: XY = [(c[0] - a[0]) / Lf, (c[1] - a[1]) / Lf], nn: XY = [t[1], -t[0]]
  for (let k = 0; k < n; k++) {
    const s = 1 + (k + 0.5) * w
    onWall(win, a, c, rectShape(s - 0.55, s + 0.55, 24.0, 25.4))
    // the awning: a sloped hood over the dormer
    const P = (ss: number, d: number, z: number): V3 => [a[0] + t[0] * ss + nn[0] * d, a[1] + t[1] * ss + nn[1] * d, z]
    const s0 = s - 0.75, s1 = s + 0.75
    maroon.quad(P(s0, 0.05, 26.3), P(s0, 0.9, 25.2), P(s1, 0.9, 25.2), P(s1, 0.05, 26.3))
    maroon.tri(P(s0, 0.05, 26.3), P(s0, 0.05, 25.2), P(s0, 0.9, 25.2))
    maroon.tri(P(s1, 0.05, 26.3), P(s1, 0.9, 25.2), P(s1, 0.05, 25.2))
  }
}
// two of the balconies' awnings on the fronts (cygn): small hoods at the fourth floor
for (const [a, c, s] of [[[-11.51, -15.12], [19.75, -14.87], 9.5], [[19.75, -14.87], [19.58, 15.46], 19.5]] as Array<[XY, XY, number]>) {
  const Lf = Math.hypot(c[0] - a[0], c[1] - a[1]), t: XY = [(c[0] - a[0]) / Lf, (c[1] - a[1]) / Lf], nn: XY = [t[1], -t[0]]
  const P = (ss: number, d: number, z: number): V3 => [a[0] + t[0] * ss + nn[0] * d, a[1] + t[1] * ss + nn[1] * d, z]
  box(stone, Math.min(P(s - 1, 0, 0)[0], P(s + 1, 1, 0)[0]), Math.max(P(s - 1, 0, 0)[0], P(s + 1, 1, 0)[0]), Math.min(P(s - 1, 0, 0)[1], P(s + 1, 1, 0)[1]), Math.max(P(s - 1, 0, 0)[1], P(s + 1, 1, 0)[1]), 13.9, 14.4, stone, 0.08)
  maroon.quad(P(s - 0.8, 0.05, 17.3), P(s - 0.8, 0.9, 16.3), P(s + 0.8, 0.9, 16.3), P(s + 0.8, 0.05, 17.3))
}

// ── The sidewalk canopies along Monroe (OSM way/1086578117) and Central ──
prism(maroon, ccw([[-11.5, -16.8], [21.25, -16.8], [21.25, -14.87], [-11.5, -14.87]]), 3.5, 4.1, sign, 0.1, true)
prism(maroon, ccw([[19.75, -14.87], [21.25, -14.87], [21.25, 6], [19.7, 6]]), 3.5, 4.1, sign, 0.1, true)

// ── The blade sign on the corner, diagonal, and its head ──
const CORNER: XY = [19.75, -14.87]
const D: XY = [Math.SQRT1_2, -Math.SQRT1_2], Nn: XY = [Math.SQRT1_2, Math.SQRT1_2] // out along the diagonal; the faces' normal
function slab(p: Part, s0: number, s1: number, z0: number, z1: number, th: number) {
  const q = (s: number, w: number): XY => [CORNER[0] + D[0] * s + Nn[0] * w, CORNER[1] + D[1] * s + Nn[1] * w]
  prism(p, ccw([q(s0, -th / 2), q(s1, -th / 2), q(s1, th / 2), q(s0, th / 2)]), z0, z1, p, 0.08, true)
}
slab(sign, 0.2, 1.5, 6.6, 21.0, 0.5)
slab(sign, 0.2, 4.0, 21.0, 23.6, 0.6)

// letters: SAN CARLOS stacked on both faces, Hotel across the head
type Glyph = (p: Pen, y: number) => void // a letter 1 tall by about 0.7 wide, its foot at y
const Gs: Record<string, Glyph> = {
  S: (p, y) => { p.moveTo([0.62, y + 0.84]).cubicTo([0.52, y + 1.02], [0.06, y + 1.02], [0.06, y + 0.74], 3).cubicTo([0.06, y + 0.5], [0.64, y + 0.54], [0.64, y + 0.26], 4).cubicTo([0.64, y - 0.03], [0.12, y - 0.03], [0.04, y + 0.16], 3) },
  A: (p, y) => { p.moveTo([0.02, y]).lineTo([0.35, y + 1]).lineTo([0.68, y]); p.moveTo([0.15, y + 0.36]).lineTo([0.55, y + 0.36]) },
  N: (p, y) => { p.moveTo([0.06, y]).lineTo([0.06, y + 1]).lineTo([0.64, y]).lineTo([0.64, y + 1]) },
  C: (p, y) => { p.moveTo([0.64, y + 0.82]).cubicTo([0.5, y + 1.04], [0.04, y + 1.02], [0.04, y + 0.5], 4).cubicTo([0.04, y - 0.02], [0.5, y - 0.04], [0.64, y + 0.18], 4) },
  R: (p, y) => { p.moveTo([0.06, y]).lineTo([0.06, y + 1]).lineTo([0.36, y + 1]).cubicTo([0.68, y + 1], [0.68, y + 0.5], [0.36, y + 0.5], 4).lineTo([0.06, y + 0.5]); p.moveTo([0.34, y + 0.5]).lineTo([0.66, y]) },
  L: (p, y) => { p.moveTo([0.08, y + 1]).lineTo([0.08, y]).lineTo([0.62, y]) },
  O: (p, y) => { p.circle([0.35, y + 0.5], 0.31, 0.5, 10) },
}
const stack = new Pen()
const letters = 'SANCARLOS'
letters.split('').forEach((ch, i) => Gs[ch](stack, (letters.length - 1 - i) * 1.42))
// "Hotel": a bold upright script, traced from pinter
const hotel = new Pen()
hotel.moveTo([0.1, 0]).quadTo([0.05, 0.6], [0.25, 1.0], 3) // H, left stem with its lead-in curl
hotel.moveTo([0.75, 1.0]).lineTo([0.7, 0])
hotel.moveTo([0.0, 0.5]).quadTo([0.4, 0.58], [0.9, 0.5], 3)
hotel.moveTo([1.35, 0.32]).circle([1.35, 0.3], 0.22, 0.28, 8) // o
hotel.moveTo([1.85, 0.95]).quadTo([1.75, 0.3], [1.85, 0.02], 3).quadTo([1.95, -0.02], [2.05, 0.12], 2) // t
hotel.moveTo([1.68, 0.6]).lineTo([2.05, 0.6])
hotel.moveTo([2.3, 0.3]).quadTo([2.75, 0.4], [2.5, 0.58], 3).quadTo([2.15, 0.45], [2.35, 0.05], 3).quadTo([2.55, -0.05], [2.75, 0.12], 2) // e
hotel.moveTo([2.95, 1.05]).quadTo([2.85, 0.3], [2.98, 0.02], 3).quadTo([3.1, -0.02], [3.2, 0.12], 2) // l

for (const side of [1, -1]) {
  // u runs across the face to the reader's right; for the NE face that is
  // toward the building (-D), for the SW face away from it (+D)
  const face = (s: number, w: number, z: number): V3 => [CORNER[0] + D[0] * s + Nn[0] * w * side, CORNER[1] + D[1] * s + Nn[1] * w * side, z]
  const k = 0.95 // letter height on the blade
  strokes(neon, stack.paths, {
    width: 0.2, depth: 0.12,
    place: (u, v, w) => face(0.85 + side * (0.35 - u) * k, 0.25 + w * k, 7.1 + v * k),
  })
  const hk = 1.05
  strokes(neon, hotel.paths, {
    width: 0.16, depth: 0.1,
    place: (u, v, w) => face(2.1 + side * (1.6 - u) * hk, 0.3 + w * hk, 21.9 + v * hk),
  })
}

void PALETTE
await save('phx-hotel-san-carlos', 'Hotel San Carlos', [
  { part: stone, material: { ...finish('san-carlos-stone', 0xdfcba6), floodlight: (p, n) => (n[2] < 0.5 && p[2] < 6 ? 0.4 : 0) } },
  { part: win, material: PALETTE.window },
  { part: maroon, material: finish('san-carlos-awning', 0x8c3a3e) },
  { part: sign, material: finish('san-carlos-sign', 0x4a4f57) },
  { part: neon, material: finish('neon-san-carlos', 0xe8eef2) },
  { part: shop, material: { ...PALETTE.entrance, color: 0x6f6a62 } },
], { height: 29.5, anchor: [33.450611, -112.0741846], bearing: 0 })
