/**
 * Rüstem Pasha Mosque (Rüstem Paşa Camii), Tahtakale, Istanbul: procedural,
 * CC0-1.0.
 * bun generators/istanbul-rustem-pasha-mosque.ts
 *
 * Mimar Sinan, about 1561-63, for the grand vizier Rüstem Pasha. A small
 * mosque raised on a platform over vaulted shops (the shops level is part of
 * its identity: the mosque is reached by stairs from the market streets);
 * a single dome on a
 * polygonal window drum over a square base with four small corner turrets
 * and big arched tympana; side galleries with small domes; the double
 * portico (an inner one of five domes on six columns, an outer one under a
 * lead lean-to roof on columns); a single minaret with one şerefe.
 *
 * Uses the mosque kit exported by generators/istanbul-new-mosque.ts.
 *
 * Frame: x across the axis (towards world 45.5, the Hasırcılar street
 * side), y along it towards the portico (world 315.5), z up; placed with
 * bearing 315.5. Origin at the centroid of the OSM outline (way/175518494),
 * 28.968738, 41.017662. y = 0 is the street on the north-east side; the
 * market streets round it are taken as level (they fall only slightly
 * towards the Golden Horn). Elevation 0. No terrain check could run:
 * Mapterhorn has no z15 terrain here, and there is no lidar for Turkey.
 *
 * OSM (ODbL), fetched 2026-11: way/175518494 (the platform's outline, no
 * parts or heights): a narrow block at the qibla end, x -14.2..13.4,
 * y -21.7..-8, and a wider part x -22..21/24, y -8..17.7 holding the
 * terrace, the porticoes and the minaret. The platform is built to this
 * outline as it is (it is not symmetric); the hall is centred on the narrow
 * block's axis, x = -0.4.
 *
 * Published: Wikipedia en "Rüstem Pasha Mosque" (raised on a terrace over
 * vaulted shops; dome on four semi-domes on the diagonals, i.e. an
 * octagonal baldachin), tr "Rüstem Paşa Camii" (the inner portico has six
 * columns and five domes); Wikidata Q1137511 height 22.8 m, taken as the
 * dome's crown above the street.
 *
 * Estimated from photos (a04, from the east across Eminönü, telephoto and
 * nearly level, is the ruler: the outer dome 16.5 m across spans 265 px,
 * 16 px/m, and the crown at 22.8 m puts the street where the trees hide it):
 * - shops and platform to 5 m (the lattice windows of the galleries start
 *   just above it);
 * - side galleries' cornice 9.8 m, with big round-arched lattice windows
 *   5.6-8.6 m;
 * - the square dome base 9.8-13.3 m with a big arched tympanum each side;
 *   corner turrets to 14.6 m with small domes;
 * - the sixteen-sided window drum 13.3-17.1 m, dome rise 5.7 m to 22.8 m,
 *   alem 2.4 m;
 * - the minaret's şerefe at 26 m, cap 32.8-39.8 m, alem to 41.6 m (a04 and
 *   c01 agree within a metre);
 * - inner portico roof 11.2 m with five domes; the outer portico's wide,
 *   low lead lean-to (35.6 m across, 7 m deep, c01) from 10.5 m at the
 *   inner portico to an eave at 8.9 m.
 * Left out: the open arcade that fences part of the terrace (c00, a13):
 * the photographed stretch could not be placed on the outline with
 * confidence, and the raised views show none elsewhere.
 * Invented / simplified: the shop fronts as
 *   one arched panel per 4 m bay; the gallery domes (two a side); the
 *   scalloped lead eave over the drum windows is drawn as a plain lip; the
 *   stairs up from the streets are left out.
 *
 * The minaret is drawn 2.0 m across (real about 1.5-1.9 m, slim) with a
 * bold şerefe ring.
 *
 * Colours from daylight photos, pulled to the palette: grey limestone
 * (#ddd8ce; the stone here is darker and greyer than at the imperial
 * mosques), blue-grey lead (#9aa3ad), gilt alems. Night: the mosque is lit
 * modestly; stone and lead carry a little _FLOODLIGHT; the shop fronts and
 * windows glow.
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 * - a04 "Rüstem Pasha Mosque in 2024 5321.jpg", Dosseman, CC BY-SA 4.0
 *   (from the east, about 110, telephoto)
 *   https://commons.wikimedia.org/wiki/File:R%C3%BCstem_Pasha_Mosque_in_2024_5321.jpg
 * - c01 "Istanbul - Rüstem-Pascha-Moschee - panoramio (cropped and
 *   retouched).jpg", giggel, CC BY-SA 3.0 (from the north-west, raised:
 *   portico roof, dome, minaret)
 *   https://commons.wikimedia.org/wiki/File:Istanbul_-_R%C3%BCstem-Pascha-Moschee_-_panoramio_(cropped_and_retouched).jpg
 * - c00 "676-Istanbul Rüstem Pasha Mosque-0910-1836.jpg", Dosseman,
 *   CC BY-SA 4.0 (street: shops and the terrace arcade over them)
 *   https://commons.wikimedia.org/wiki/File:676-Istanbul_R%C3%BCstem_Pasha_Mosque-0910-1836.jpg
 * - a13 "Rüstem Pasha Mosque from street 236.jpg", Dosseman, CC BY-SA 4.0
 *   (street: shops, terrace arcade, corner kiosk)
 *   https://commons.wikimedia.org/wiki/File:R%C3%BCstem_Pasha_Mosque_from_street_236.jpg
 * - c04 "RÜSTEM PAŞA CAMİİ2026-01-01 at 16.48.29 (1).jpg", RramazanŞahin,
 *   CC0 (the double portico's columns and arches)
 *   https://commons.wikimedia.org/wiki/File:R%C3%9CSTEM_PA%C5%9EA_CAM%C4%B0%C4%B02026-01-01_at_16.48.29_(1).jpg
 * - a36 "Süleymaniye Mosque and Rüstem Pasha Mosque in 2024 6715.jpg",
 *   Dosseman, CC BY-SA 4.0 (from the Golden Horn, distant)
 *   https://commons.wikimedia.org/wiki/File:S%C3%BCleymaniye_Mosque_and_R%C3%BCstem_Pasha_Mosque_in_2024_6715.jpg
 * Look-only: none.
 *
 * Doubts: no photo shows the qibla end or the south-west side clearly, so
 * the shop fronts there and the minaret's exact place (south-west end of the
 * portico, behind the dome in a04, at the portico's right end in c01) are
 * estimates; the depth of the two porticoes is read from c01 and the
 * outline, not measured; the terrace's extent comes from OSM.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { MosqueKit, type XY, TAU, circle, panel, prism, prismPoly, rect, revolve, windowRow, lit } from './istanbul-new-mosque'

const stone = new Part(), lead = new Part(), win = new Part(), gilt = new Part()
const K = new MosqueKit(stone, lead, win, gilt)

const P = 5.0 // platform (terrace) level over the shops
const X0 = -0.4 // hall axis
const HW = 13.8 // hall half width (OSM: x -14.2..13.4)
const HY0 = -21.7, HY1 = -1.5 // hall, qibla wall to the inner portico
const DC: XY = [X0, (HY0 + HY1) / 2]
const GALLERY = 9.8 // side galleries' cornice
const BASE1 = 12.6 // top of the square dome base
const B = 8.4 // half side of the dome base

// The platform: the OSM outline, shops below, terrace on top.
const outline: XY[] = [
  [-22.09, 17.78], [-22.09, 9.65], [-20.64, 9.64], [-20.64, 0.67], [-22.09, 0.69], [-22.09, -7.76], [-14.25, -7.81],
  [-14.23, -21.57], [13.4, -21.75], [13.38, -8.11], [20.99, -8.42], [19.95, 8.44], [24.1, 8.42], [24.09, 17.48],
]
prismPoly(stone, outline, 0, P)
// a cornice band at the terrace level
{
  const n = outline.length
  for (let i = 0; i < n; i++) {
    const a = outline[i], b = outline[(i + 1) % n]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 2) continue
    const nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L // outward for a counter-clockwise ring
    // shop fronts: one arched opening per 4 m bay
    const bays = Math.max(1, Math.round(L / 4.2))
    windowRow(win, a, b, bays, Math.min(2.6, (L / bays) * 0.62), 0.3, 4.0, [nx, ny], 'pointed')
  }
}

// Hall: walls from the ground (the platform's own walls below), galleries
// to 9.8 m, the dome base above.
prism(stone, rect(X0 - HW, X0 + HW, HY0, HY1, 0.4), P, GALLERY, false)
prism(stone, rect(X0 - HW - 0.3, X0 + HW + 0.3, HY0 - 0.3, HY1 + 0.3, 0.5), GALLERY - 0.6, GALLERY + 0.25, false)
prism(stone, rect(X0 - HW - 0.3, X0 + HW + 0.3, HY0 - 0.3, HY1 + 0.3, 0.5), GALLERY + 0.25, GALLERY + 0.25)
// big round-arched lattice windows, three a side; smaller ones on the qibla wall
for (const s of [-1, 1]) {
  const a: XY = s > 0 ? [X0 + HW, HY1] : [X0 - HW, HY0], b: XY = s > 0 ? [X0 + HW, HY0] : [X0 - HW, HY1]
  windowRow(win, a, b, 3, 3.6, P + 0.6, P + 3.6, [s, 0], true)
}
windowRow(win, [X0 + HW, HY0], [X0 - HW, HY0], 5, 2.0, P + 0.8, P + 3.4, [0, -1], true)

// Gallery domes, two a side.
for (const s of [-1, 1]) for (const dy of [-6.6, 0, 6.6]) {
  const c: XY = [X0 + s * 11.3, DC[1] + dy]
  prism(stone, circle(c[0], c[1], 2.1, 8, Math.PI / 8), GALLERY + 0.25, GALLERY + 0.9)
  K.dome(c[0], c[1], 2.0, GALLERY + 0.9, 1.5, 8, 2, 0.9, false)
}

// The square dome base with a big arched tympanum on each face.
prism(stone, rect(DC[0] - B, DC[0] + B, DC[1] - B, DC[1] + B, 0.4), GALLERY + 0.25, BASE1)
{
  const z0 = GALLERY + 0.6, z1 = BASE1 - 0.4
  panel(win, [DC[0] - 3.4, DC[1] - B], [DC[0] + 3.4, DC[1] - B], z0, z1, [0, -1], true)
  panel(win, [DC[0] + 3.4, DC[1] + B], [DC[0] - 3.4, DC[1] + B], z0, z1, [0, 1], true)
  panel(win, [DC[0] + B, DC[1] - 3.4], [DC[0] + B, DC[1] + 3.4], z0, z1, [1, 0], true)
  panel(win, [DC[0] - B, DC[1] + 3.4], [DC[0] - B, DC[1] - 3.4], z0, z1, [-1, 0], true)
}
// four corner turrets with small domes
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const c: XY = [DC[0] + sx * (B - 0.6), DC[1] + sy * (B - 0.6)]
  prism(stone, circle(c[0], c[1], 1.5, 8, Math.PI / 8), BASE1, 14.6)
  K.dome(c[0], c[1], 1.4, 14.6, 1.2, 8, 2, 0.9, false)
}
// sixteen-sided window drum and the dome
K.drum(DC[0], DC[1], B, BASE1, 17.1, 16, { every: 1, frac: 0.52, wz0: BASE1 + 0.6, wz1: 16.6, arch: true })
K.dome(DC[0], DC[1], B - 0.1, 17.1, 5.7, 20, 4, 2.4)

// Inner portico: five domes on six columns.
const PI0 = HY1, PI1 = HY1 + 6.0, PROOF = P + 6.2
prism(stone, rect(X0 - HW, X0 + HW, PI0, PI1), PROOF - 0.9, PROOF, true, true)
K.arcade([X0 - HW, PI1], [X0 + HW, PI1], 5, P + 3.6, PROOF - 0.9, [0, 1], 0.7, 0.7, P)
prism(stone, rect(X0 - HW, X0 - HW + 0.8, PI0, PI1), P, PROOF - 0.9, false)
prism(stone, rect(X0 + HW - 0.8, X0 + HW, PI0, PI1), P, PROOF - 0.9, false)
for (let k = 0; k < 5; k++) {
  const x = X0 - HW + ((2 * HW) * (k + 0.5)) / 5
  K.dome(x, (PI0 + PI1) / 2, 2.4, PROOF, 1.8, 8, 2, k === 2 ? 0.8 : 0, false)
}
// the hall's front wall windows inside the portico
windowRow(win, [X0 - HW, HY1], [X0 + HW, HY1], 5, 1.6, P + 0.8, P + 3.0, [0, 1], false, (k) => k === 2)
panel(win, [X0 - 1.3, HY1], [X0 + 1.3, HY1], P, P + 4.0, [0, 1], 'pointed')

// Outer portico: a lead lean-to on columns, wider than the hall (c01, c04).
const PO1 = PI1 + 7.0, PW = HW + 3.8
K.arcade([X0 - PW, PO1], [X0 + PW, PO1], 9, P + 2.4, P + 3.5, [0, 1], 0.55, 0.55, P)
K.arcade([X0 + PW, PO1], [X0 + PW, PI1], 2, P + 2.4, P + 3.5, [1, 0], 0.55, 0.55, P)
K.arcade([X0 - PW, PI1], [X0 - PW, PO1], 2, P + 2.4, P + 3.5, [-1, 0], 0.55, 0.55, P)
K.lean(X0 - PW - 1.0, X0 + PW + 1.0, PI1, PO1 + 1.0, P + 5.5, P + 3.9, '-y', 0.5)

// The minaret at the south-west end of the porticoes.
K.minaret(X0 - HW - 2.2, PI0 + 1.0, { R: 1.0, ring: 0.8, pedHalf: 1.5, ped: P + 4.5, balconies: [26], capBase: 32.8, capTip: 39.8, alem: 1.8, n: 10 })

const parts = [
  { part: stone, material: { ...finish('limestone', 0xddd8ce), floodlight: lit(0.6) } },
  { part: lead, material: { ...finish('lead', 0x9aa3ad), floodlight: () => 0.6 } },
  { part: win, material: PALETTE.window },
  { part: gilt, material: { ...finish('gilt', 0xcfa94f), floodlight: () => 0.6 } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Rüstem Pasha Mosque', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 315.5, elevation: 0, height: 41.6,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/istanbul-rustem-pasha-mosque.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
void TAU; void revolve
