/**
 * Fatih Mosque (Fatih Camii), Fatih, Istanbul: procedural, CC0-1.0.
 * bun generators/istanbul-fatih-mosque.ts
 *
 * The mosque of Mehmed II, built 1463-70 and rebuilt after the 1766
 * earthquake (1767-71, Mehmed Tahir Ağa). The rebuild: a central dome on
 * four semi-domes, octagonal weight turrets at the dome's corners, four
 * corner domes and small domes round the edges; the two very tall minarets
 * with two şerefes each (their lower shafts survive from the first
 * mosque), at the corners where the hall meets the courtyard; the large
 * courtyard of the first mosque with its domed arcade, the wing along the
 * hall higher than the other three, and the şadırvan. Mosque and courtyard
 * only; the külliye round it is left out.
 *
 * Uses the mosque kit exported by generators/istanbul-new-mosque.ts.
 *
 * Frame: x across the axis (towards world 52.8), y along it towards the
 * courtyard (world 322.8), z up; placed with bearing 322.8 (OSM's long
 * walls). Origin at the centroid of the OSM outline (relation/1661399),
 * 28.949762, 41.019748. The site is a level terrace on the Fatih hill.
 * Elevation 0. No terrain check could run: Mapterhorn has no z15 terrain
 * here, and there is no lidar for Turkey.
 *
 * OSM (ODbL), fetched 2026-11: relation/1661399 (outline 56 x 96.3 m with
 * the open court as its inner ring), relation/4277472 (the same rectangle
 * as a building:part, with holes for the court and the dome),
 * relation/4277469 (the dome, a circle 22.6 m across). No heights. The
 * plan: hall y -48..8 (56 m square), courtyard y 8..48. OSM's dome circle
 * sits 14 m towards the qibla from the hall's centre; it was traced from
 * oblique imagery, where a 48 m dome leans away, so the dome is put at the
 * hall's centre, as the aerial photo a02 and the axis view b17 show. OSM's
 * open court (37 x 27 m, x -20.8..16.5, y 11.4..38.9) is replaced by the
 * bay grid the photos show: 7 x 5 bays of 8 m, the middle 5 x 3 open
 * (40 x 24 m), 20 domes.
 *
 * Published: Wikipedia en "Fatih Mosque, Istanbul" (central dome 26 m on
 * four semi-domes; two minarets each with two galleries), tr "Fatih Camii"
 * (the courtyard wing parallel to the qibla wall is higher than the other
 * three; three courtyard gates; the minarets' stone caps were replaced by
 * lead).
 *
 * Estimated from photos. Widths from the aerial a02 (little perspective):
 * the minarets stand at the courtyard's corners against the hall, and the
 * outer lead dome is 0.40 of their spacing, 21 m (OSM's circle: 22.6 m),
 * against the published 26 m inside (the published figure may be the
 * first mosque's). The side views (b11, b13) show ablution galleries under
 * a lean-to along both sides, so the hall's own walls stand at x +-25 and
 * the galleries fill the outline to +-28. Heights: b10 (level, the
 * courtyard front square on) gives the courtyard wall 12.8 m against its
 * 56 m width and, with the camera about 50 m out, the dome crown about
 * 47.7 m and the minaret tip about 65 m; b17 (raised, on the axis, with
 * more perspective) gives the minaret tip about 24 m over the dome crown.
 * The two disagree by some metres; the model takes the middle:
 * - main drum 32-37.6 m, dome crown 44.8 m, alem to 50.8 m; weight turrets
 *   at +-13.2 m to 33.8 m with domes to 36.2 m;
 * - semi-domes 19.6 m across, drums 23-26.8 m, crowns 31.2 m;
 * - corner domes 9.6 m across at +-18.6 m, 21.3-25.5 m; hall walls 19.5 m;
 *   ablution galleries' lean-to 7 m at the wall to 5.6 m;
 * - minarets: şerefes 39 and 49 m, cap 59.5-68 m, alem to 70.2 m;
 * - courtyard roof 12.8 m with 8 m domes; the hall-side wing's roof
 *   15.6 m with taller domes and a raised portal dome.
 * Invented / simplified: window counts and sizes; the exedra half-domes
 * and the many small domes of the galleries merged into a few; the side
 * façades' great arches drawn as two rows of grouped windows.
 *
 * Minarets drawn 4.4 m across (real about 3.5 m), with bold şerefe rings.
 *
 * Colours from daylight photos, pulled to the palette: pale cream
 * limestone (#e7e1d4), blue-grey lead (#98a2ad), gilt alems. Night: the
 * mosque is floodlit (b28 shows it bright on its hill), so stone and lead
 * carry _FLOODLIGHT; windows glow.
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 * - a02 "Fatih Camii - Aerial view.jpg", Carlos Delgado, CC BY-SA 3.0
 *   (from the air, north-west: the plan)
 *   https://commons.wikimedia.org/wiki/File:Fatih_Camii_-_Aerial_view.jpg
 * - b17 "Sultan Muhammet Fatih camii (cropped).jpg", Ezzeldin.Elbaksawy,
 *   CC BY-SA 4.0 (on the axis from the north-west, raised)
 *   https://commons.wikimedia.org/wiki/File:Sultan_Muhammet_Fatih_camii_(cropped).jpg
 * - b10 "Fatih camii DSCF6840.jpg", Robert Prazeres, CC BY-SA 4.0
 *   (courtyard front from the north-west)
 *   https://commons.wikimedia.org/wiki/File:Fatih_camii_DSCF6840.jpg
 * - b11 "Fatih camii DSCF6684.jpg", Robert Prazeres, CC BY-SA 4.0 (the
 *   hall's north-east side)
 *   https://commons.wikimedia.org/wiki/File:Fatih_camii_DSCF6684.jpg
 * - b13 "Fatih camii DSCF6760.jpg", Robert Prazeres, CC BY-SA 4.0 (the
 *   hall's south-west side and a minaret)
 *   https://commons.wikimedia.org/wiki/File:Fatih_camii_DSCF6760.jpg
 * - b12 "Fatih camii DSCF3849.jpg", Robert Prazeres, CC BY-SA 4.0 (the
 *   courtyard, şadırvan and the hall-side wing)
 *   https://commons.wikimedia.org/wiki/File:Fatih_camii_DSCF3849.jpg
 * - a03 "Fatih Camii (Külliye).JPG", SeyyahLatif, CC BY-SA 3.0 (distant)
 *   https://commons.wikimedia.org/wiki/File:Fatih_Camii_(K%C3%BClliye).JPG
 * Look-only: none.
 *
 * Doubts: no published heights were found; every height rests on b10 and
 * b17 and estimated camera distances, and they disagree by several metres
 * (the minarets could be 65-75 m); the aerial a02 suggests six rows of
 * domes along the courtyard's sides where the model has five; the qibla
 * side was not photographed; the dome's outer width (21 m) is smaller than
 * the published 26 m.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { MosqueKit, type XY, TAU, circle, ccw, panel, poly, prism, rect, revolve, windowRow, lit } from './istanbul-new-mosque'

const stone = new Part(), lead = new Part(), win = new Part(), gilt = new Part()
const K = new MosqueKit(stone, lead, win, gilt)

const HX = 28, HY0 = -48, HY1 = 8 // hall and courtyard outer width (OSM: 56 m); hall taken square
const HW = 25 // the hall's own walls; the ablution galleries fill x 25..28 (b11)
const CY = 48 // far courtyard wall (OSM)
const WALL = 19.5
const DC: XY = [0, (HY0 + HY1) / 2]
const BH = 11.8 // semi-domes' centres from the dome's centre

// Hall body and cornice.
prism(stone, rect(-HW, HW, HY0, HY1, 0.6), 0, WALL, false)
prism(stone, rect(-HW - 0.35, HW + 0.35, HY0 - 0.35, HY1 + 0.35, 0.8), WALL - 1.0, WALL + 0.3, false)
poly(stone, rect(-HW - 0.35, HW + 0.35, HY0 - 0.35, HY1 + 0.35, 0.8).map(([x, y]) => [x, y, WALL + 0.3] as V3), [0, 0, 1])

// Windows: a low row, a pointed row, and a tall upper row, grouped by bay.
for (const [a, b, n] of [
  [[HW, HY0], [-HW, HY0], [0, -1]],
  [[HW, HY1], [HW, HY0], [1, 0]],
  [[-HW, HY0], [-HW, HY1], [-1, 0]],
] as Array<[XY, XY, XY]>) {
  windowRow(win, a, b, 7, 2.0, 2.0, 5.2, n)
  windowRow(win, a, b, 7, 2.0, 7.4, 11.6, n, 'pointed')
  windowRow(win, a, b, 5, 2.6, 13.2, 18.0, n, 'pointed')
}
windowRow(win, [-HW, HY1], [HW, HY1], 5, 2.4, 15.6, 18.4, [0, 1], 'pointed', (k) => k === 2)

// The ablution galleries along both sides: a lead lean-to on columns (b11, b13).
for (const sx of [-1, 1]) {
  const a: XY = sx > 0 ? [HX, HY1 - 1] : [-HX, HY0 + 1], b: XY = sx > 0 ? [HX, HY0 + 1] : [-HX, HY1 - 1]
  K.arcade(a, b, 9, 3.4, 5.2, [sx, 0], 0.7, 0.7, 0, 4)
  K.lean(sx > 0 ? HW : -HX - 0.5, sx > 0 ? HX + 0.5 : -HW, HY0 + 0.4, HY1 - 0.4, 7.0, 5.6, sx > 0 ? '-x' : '+x', 0.45)
}

// Small domes on the hall's corner turrets and over the side galleries.
for (const sx of [-1, 1]) for (const y of [HY0 + 2.2, HY1 - 2.2]) {
  const c: XY = [sx * (HW - 2.2), y]
  prism(stone, circle(c[0], c[1], 2.5, 8, Math.PI / 8), WALL, WALL + 3.0)
  K.dome(c[0], c[1], 2.4, WALL + 3.0, 2.0, 8, 2, 1.2, false)
}
for (const sx of [-1, 1]) {
  const c: XY = [sx * (HW - 3.4), DC[1]]
  prism(stone, circle(c[0], c[1], 3.0, 8, Math.PI / 8), WALL, WALL + 1.6)
  K.dome(c[0], c[1], 2.9, WALL + 1.6, 2.3, 8, 2, 1.2, false)
}

// Corner domes over the corner bays.
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const c: XY = [sx * 18.6, DC[1] + sy * 18.6]
  K.drum(c[0], c[1], 4.7, WALL, 21.3, 12, { every: 2, frac: 0.45, wz0: WALL + 0.4, wz1: 20.9 })
  K.dome(c[0], c[1], 4.8, 21.3, 4.2, 12, 3, 1.8)
}

// Semi-domes on window drums over stone bases (the exedrae under lead).
const SR = 9.8, S0 = 23, S1 = 26.8, SCROWN = 31.2
for (const a of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
  const c: XY = [DC[0] + BH * Math.cos(a), DC[1] + BH * Math.sin(a)]
  revolve(stone, c[0], c[1], [[SR + 1.2, WALL], [SR + 1.2, S0 - 0.7]], 8, a - Math.PI / 2, a + Math.PI / 2, false)
  revolve(lead, c[0], c[1], [[SR + 1.5, S0 - 0.7], [SR + 1.5, S0 - 0.35], [SR + 0.1, S0 + 0.4]], 8, a - Math.PI / 2, a + Math.PI / 2)
  K.semidome(c, SR, a, S0, S1, SCROWN, 10, true, 0)
}

// Dome square, weight turrets, drum and dome.
const MD0 = 32, MD1 = 37.6, MDR = 10.5
prism(stone, rect(DC[0] - 12.6, DC[0] + 12.6, DC[1] - 12.6, DC[1] + 12.6, 0.6), WALL, MD0)
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const c: XY = [DC[0] + sx * 13.2, DC[1] + sy * 13.2]
  prism(stone, circle(c[0], c[1], 2.5, 8, Math.PI / 8), WALL, 33.8)
  K.dome(c[0], c[1], 2.4, 33.8, 2.4, 8, 2, 1.8, false)
}
K.drum(DC[0], DC[1], MDR, MD0, MD1, 24, { every: 1, frac: 0.48, wz0: MD0 + 1.0, wz1: MD1 - 0.7 })
for (let k = 0; k < 24; k += 3) {
  const t = ((k + 0.5) * TAU) / 24 + Math.PI / 24
  const c: XY = [DC[0] + (MDR + 0.45) * Math.cos(t), DC[1] + (MDR + 0.45) * Math.sin(t)]
  const ux = Math.cos(t), uy = Math.sin(t), vx = -uy, vy = ux
  prism(stone, ccw([
    [c[0] - ux * 0.8 - vx * 0.5, c[1] - uy * 0.8 - vy * 0.5], [c[0] + ux * 0.8 - vx * 0.5, c[1] + uy * 0.8 - vy * 0.5],
    [c[0] + ux * 0.8 + vx * 0.5, c[1] + uy * 0.8 + vy * 0.5], [c[0] - ux * 0.8 + vx * 0.5, c[1] - uy * 0.8 + vy * 0.5],
  ]), MD0, MD1 - 0.3)
}
K.dome(DC[0], DC[1], MDR + 0.1, MD1, 7.2, 24, 5, 6)

// ---------------------------------------------------------------------------
// Courtyard: 7 x 5 bays of 8 m, the middle 5 x 3 open; 20 domes. The wing
// along the hall is higher (tr wiki, b17) with a raised portal dome.
const bx = (2 * HX) / 7, by = (CY - HY1) / 5
const IX = HX - bx, IY0 = HY1 + by, IY1 = CY - by
const ROOF = 12.8, FROOF = 15.6, SLAB = 1.1
prism(stone, rect(-HX, HX, HY1, IY0), FROOF - SLAB, FROOF, true, true)
prism(stone, rect(-HX, HX, IY1, CY), ROOF - SLAB, ROOF, true, true)
prism(stone, rect(-HX, -IX, IY0, IY1), ROOF - SLAB, ROOF, true, true)
prism(stone, rect(IX, HX, IY0, IY1), ROOF - SLAB, ROOF, true, true)
for (const sx of [-1, 1]) {
  prism(stone, rect(sx > 0 ? HX - 1.3 : -HX, sx > 0 ? HX : -HX + 1.3, IY0, CY), 0, ROOF - SLAB, false)
  prism(stone, rect(sx > 0 ? HX - 1.3 : -HX, sx > 0 ? HX : -HX + 1.3, HY1, IY0), 0, FROOF - SLAB, false)
}
prism(stone, rect(-HX, HX, CY - 1.3, CY), 0, ROOF - SLAB, false)
prism(stone, ccw(rect(-HX - 0.3, HX + 0.3, IY0, CY + 0.3)), ROOF - 0.8, ROOF + 0.15, false)
K.arcade([-IX, IY0], [IX, IY0], 5, 9.6, FROOF - SLAB, [0, 1], 1.1, 1.2)
K.arcade([IX, IY1], [-IX, IY1], 5, 7.0, ROOF - SLAB, [0, -1], 1.0, 1.1)
K.arcade([-IX, IY1], [-IX, IY0], 3, 7.0, ROOF - SLAB, [1, 0], 1.0, 1.1)
K.arcade([IX, IY0], [IX, IY1], 3, 7.0, ROOF - SLAB, [-1, 0], 1.0, 1.1)
for (let i = 0; i < 7; i++) for (let j = 0; j < 5; j++) {
  if (i > 0 && i < 6 && j > 0 && j < 4) continue
  const x = -HX + bx * (i + 0.5), y = HY1 + by * (j + 0.5)
  if (i === 3 && j === 4) continue // gate
  const front = j === 0
  if (front && i === 3) {
    // the raised portal bay in front of the hall's door
    prism(stone, rect(x - bx / 2, x + bx / 2, HY1, IY0), FROOF, FROOF + 1.8)
    K.dome(x, y, bx / 2 - 0.5, FROOF + 1.8, 3.0, 12, 3, 1.4)
    continue
  }
  K.dome(x, y, Math.min(bx, by) / 2 - 0.5, front ? FROOF : ROOF, front ? 3.0 : 2.7, 10, 2, 0, false)
}
// outer windows of the courtyard (two rows) and the gates
for (const s of [-1, 1]) {
  const a: XY = s > 0 ? [HX, HY1] : [-HX, CY], b: XY = s > 0 ? [HX, CY] : [-HX, HY1]
  windowRow(win, a, b, 5, 1.8, 2.0, 4.8, [s, 0], false, (k) => k === 2)
  windowRow(win, a, b, 5, 1.8, 6.6, 9.8, [s, 0], 'pointed')
  panel(win, s > 0 ? [HX, 26.2] : [-HX, 29.8], s > 0 ? [HX, 29.8] : [-HX, 26.2], 0.4, 6.0, [s, 0], 'pointed')
}
windowRow(win, [HX, CY], [-HX, CY], 7, 1.8, 2.0, 4.8, [0, 1], false, (k) => k === 3)
windowRow(win, [HX, CY], [-HX, CY], 7, 1.8, 6.6, 9.8, [0, 1], 'pointed', (k) => k === 3)
prism(stone, rect(-3.8, 3.8, CY - by, CY + 0.7, 0.3), ROOF - SLAB, ROOF + 0.6)
panel(win, [2.2, CY + 0.7], [-2.2, CY + 0.7], 0.4, 7.4, [0, 1], 'pointed')
K.dome(0, CY - by / 2, 3.2, ROOF + 0.6, 2.6, 10, 2, 1.0)

// Şadırvan: an octagonal canopy on columns.
{
  const c: XY = [0, (IY0 + IY1) / 2]
  for (const [x, y] of circle(c[0], c[1], 3.4, 8, Math.PI / 8)) prism(stone, circle(x, y, 0.35, 4, Math.PI / 4), 0, 3.6, false)
  prism(stone, circle(c[0], c[1], 4.0, 8, Math.PI / 8), 3.6, 4.3, true, true)
  K.dome(c[0], c[1], 3.4, 4.3, 2.4, 12, 2, 1.0)
}

// Minarets at the courtyard's corners against the hall.
for (const sx of [-1, 1]) {
  K.minaret(sx * 25.6, HY1 + 2.8, { R: 2.2, pedHalf: 2.5, ped: FROOF + 1.0, balconies: [39, 49], capBase: 59.5, capTip: 68, alem: 2.2, n: 12 })
}

const parts = [
  { part: stone, material: { ...finish('limestone', 0xe7e1d4), floodlight: lit(0.9) } },
  { part: lead, material: { ...finish('lead', 0x98a2ad), floodlight: () => 0.9 } },
  { part: win, material: PALETTE.window },
  { part: gilt, material: { ...finish('gilt', 0xcfa94f), floodlight: () => 0.8 } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Fatih Mosque', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 322.8, elevation: 0, height: 70.2,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/istanbul-fatih-mosque.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
