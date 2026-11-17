/**
 * Xfinity Mobile Arena (formerly Wells Fargo Center, Wachovia Center,
 * CoreStates Center), Philadelphia (NHL Flyers, NBA 76ers; 1996, Ellerbe
 * Becket; renovated 2024-25) — procedural, CC0-1.0, no textures.
 * bun generators/phl-xfinity-mobile-arena.ts
 *
 * Map frame: x east-ish, y north-ish, turned to bearing 9° (the street grid
 * of the sports complex, and the minimum-area rectangle of the roof in the
 * lidar), z up, metres, origin at the area centroid of the OSM outline
 * (building=stadium way/25312366, already named "Xfinity Mobile Arena"):
 * -75.171919, 39.901166. z = 0 is the plaza and parking round it, which is
 * flat (lidar ground 5.7-6.4 m above the box's lowest return on every side).
 *
 * What makes it read as itself: the big white domed roof, a rounded
 * rectangle skewed a little off square, over the white drum of the bowl;
 * the lower blocks round it, now clad in dark grey louvred panels (the
 * 2024-25 renovation); the long curved white canopy over the glazed
 * concourse on the south-east and east; the white round tower on the
 * north-west corner; the giant LED screen on the south-west corner block.
 *
 * Evidence
 * - OSM: way/25312366 (the only building in the outline).
 * - Measured, lidar: USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown
 *   2015), 1 m: the roof's outline, traced on rays from its centre (-4.25,
 *   1.3) every 10° and fitted with a superellipse (55 x 72 m half axes,
 *   exponent 3.2, turned 10°); the dome, 31 m at the eave rising to 37 m at the centre,
 *   fitted as 29 + 8(1 - rho^2); the blocks round it: west concourse 5 m and
 *   13-23 m at its north end, the round north-west tower 23 m, the east
 *   concourse 12 m with the canopy line at 18-19 m, the north-east blocks
 *   20-24 m, the south concourse 9-13 m.
 * - Measured, USGS NAIP orthophoto (0.28 m): plan, the white roof, the
 *   north-west tower, the dark roofs of the west concourse.
 * - Photos (Wikimedia Commons):
 *   Dough4872, "Lincoln Financial Field and Wells Fargo Center from airplane
 *     approaching PHL" (CC BY-SA 4.0, April 2025, from the south-east: the
 *     renovated blocks, the LED screen, the curved canopy, the white roof)
 *     https://commons.wikimedia.org/wiki/File:Lincoln_Financial_Field_and_Wells_Fargo_Center_from_airplane_approaching_PHL.jpeg
 *   Phillyfan0419, "Wachovia Center, Philadelphia" (public domain, 2007,
 *     the white drum and the brick blocks before the renovation)
 *     https://commons.wikimedia.org/wiki/File:Wachovia_Center,_Philadelphia.jpg
 *   Sp. Union-Rail, "WellsFargoCenter-atDay" (CC BY-SA 3.0, 2011)
 *     https://commons.wikimedia.org/wiki/File:WellsFargoCenter-atDay.jpg
 *   PHL Approach, "Wells Fargo Center" (CC BY-SA 3.0, 2010, at night: the
 *     round tower and the glass front)
 *     https://commons.wikimedia.org/wiki/File:Wells_Fargo_Center.jpg
 *   TastyPoutine, "Wells Fargo Center night" (CC BY-SA 3.0, 2015)
 *     https://commons.wikimedia.org/wiki/File:Wells_Fargo_Center_night.jpg
 *   NASA, "South Philadelphia Sports Complex" (public domain, satellite)
 *     https://commons.wikimedia.org/wiki/File:South_Philadelphia_Sports_Complex.jpg
 * Estimated: the 2024-25 renovation is newer than the lidar and has only
 * one open photo (the April 2025 aerial, from the south-east). From it: the
 * dark grey louvred cladding on the south and north-east blocks, drawn at
 * 24 and 23 m; the LED screen on the south-west block (about 24 x 16 m) and
 * the block raised to 24 m; the canopy's sweep (95°-170° round the drum)
 * and its height (lidar line, 18 m). The north and west sides after the
 * renovation are not photographed: drawn from the lidar massing in the
 * same materials. The glass bands' heights. Colours from the 2025 aerial.
 * Doubts: the brief expected a dark roof; every open source, the 2025
 * aerial included, shows it white, so it is white. The blue lighting of the
 * drum's top seen in 2015 night photos is not confirmed after the
 * renovation and is left out; the screen and glass glow at night. No
 * signage or lettering.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { quad, box, loftSections, type XY, type SectionPt } from './dc-nationals-park'
import { save } from './phl-lincoln-financial-field'

const white = new Part(), charcoal = new Part(), grey = new Part(), glass = new Part(), screen = new Part()
const C: XY = [-4.25, 1.3]
const dirOf = (a: number): XY => [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)]

// The roof's outline: a superellipse fitted to the lidar's roof edge
// (rays from C every 10°: 53-55 m across, 70-72 m along, the corners
// 74-77 m), turned 10° clockwise in this frame as the lidar's principal
// axis is (19° from north). Plant on the roof and the north-east block
// spoil the raw rays at the corners, so the fit is used, not the rays.
const RA = 55, RB = 72, RN = 3.2, RT = 10
const R = (a: number) => {
  const t = ((a - RT) * Math.PI) / 180, s = Math.sin(t), c = Math.cos(t)
  return (Math.abs(s / RA) ** RN + Math.abs(c / RB) ** RN) ** (-1 / RN)
}
const EAVE = 29, CROWN = 37
const at = (a: number, r: number, z: number): V3 => { const d = dirOf(a); return [C[0] + d[0] * r, C[1] + d[1] * r, z] }

// The drum and the dome: a white wall to the eave, a lip, then the dome.
{
  const angles: number[] = []
  for (let a = 0; a <= 360; a += 5) angles.push(a)
  const rho = [1, 0.9, 0.75, 0.55, 0.3, 0]
  // Sections run from the crown outward and down, so each face's outside
  // is on the left (loftSections' rule).
  loftSections(C, angles, angles.map((a): SectionPt[] => {
    const r = R(a)
    return [
      ...[...rho].reverse().map((p): SectionPt => ({ r: r * p, z: EAVE + 0.6 + (CROWN - EAVE - 0.6) * (1 - p * p), part: white })),
      { r: r + 0.6, z: EAVE, part: white }, // the eave's lip
      { r, z: EAVE - 0.6, part: white },
      { r, z: 0, part: null },
    ]
  }), null)
}

const blk = (p: Part, x0: number, x1: number, y0: number, y1: number, h: number, top: Part = p) => {
  box(p, [(x0 + x1) / 2, (y0 + y1) / 2, h / 2], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [(x1 - x0) / 2, (y1 - y0) / 2, h / 2])
  if (top !== p) quad(top, [[x0 + 0.4, y0 + 0.4, h + 0.03], [x1 - 0.4, y0 + 0.4, h + 0.03], [x1 - 0.4, y1 - 0.4, h + 0.03], [x0 + 0.4, y1 - 0.4, h + 0.03]], [0, 0, 1])
}
/** A glass band on one face of a block: side 'n' | 's' | 'e' | 'w', between t0..t1 along it. */
function band(x0: number, x1: number, y0: number, y1: number, side: string, z0: number, z1: number, inset = 1.2) {
  const d = 0.06
  if (side === 's') quad(glass, [[x0 + inset, y0 - d, z0], [x1 - inset, y0 - d, z0], [x1 - inset, y0 - d, z1], [x0 + inset, y0 - d, z1]], [0, -1, 0])
  if (side === 'n') quad(glass, [[x0 + inset, y1 + d, z0], [x1 - inset, y1 + d, z0], [x1 - inset, y1 + d, z1], [x0 + inset, y1 + d, z1]], [0, 1, 0])
  if (side === 'e') quad(glass, [[x1 + d, y0 + inset, z0], [x1 + d, y1 - inset, z0], [x1 + d, y1 - inset, z1], [x1 + d, y0 + inset, z1]], [1, 0, 0])
  if (side === 'w') quad(glass, [[x0 - d, y0 + inset, z0], [x0 - d, y1 - inset, z0], [x0 - d, y1 - inset, z1], [x0 - d, y0 + inset, z1]], [-1, 0, 0])
}

// West: the long low concourse on Broad Street's side, glazed, and its
// taller north end.
blk(grey, -84, -56, -50, 24, 5.5, charcoal)
band(-84, -56, -50, 24, 'w', 1, 4.5)
blk(charcoal, -82, -58, 24, 52, 14)
band(-82, -58, 24, 52, 'w', 2, 12)
// The round white tower at the north-west corner.
{
  const c: XY = [-75, 43]
  const angles: number[] = []
  for (let a = 0; a <= 360; a += 22.5) angles.push(a)
  loftSections(c, angles, angles.map((): SectionPt[] => [
    { r: 0, z: 23, part: white }, { r: 9, z: 23, part: white }, { r: 9.5, z: 22.5, part: white }, { r: 9.5, z: 0, part: null },
  ]), null)
  loftSections(c, angles.slice(4, 10), angles.slice(4, 10).map((): SectionPt[] => [{ r: 9.56, z: 18, part: glass }, { r: 9.56, z: 3, part: null }]), null)
}
// South-west: the corner block with the giant LED screen (2024-25).
blk(charcoal, -70, -40, -74, -52, 24)
quad(screen, [[-68, -74.06, 5], [-42, -74.06, 5], [-42, -74.06, 21.5], [-68, -74.06, 21.5]], [0, -1, 0])
// South: the concourse, and the new louvred block in its middle.
blk(grey, -40, 46, -84, -60, 10, charcoal)
band(-40, 46, -84, -60, 's', 2, 8)
blk(charcoal, -2, 40, -82, -56, 24)
for (let x = 1; x < 38; x += 6) quad(grey, [[x, -82.06, 12], [x + 4.6, -82.06, 12], [x + 4.6, -82.06, 22], [x, -82.06, 22]], [0, -1, 0])
band(-2, 40, -82, -56, 's', 2, 9, 2)
// East: the glazed concourse, under the long curved white canopy.
blk(grey, 46, 77, -56, 18, 12, charcoal)
band(46, 77, -56, 18, 'e', 1.5, 10.5)
band(40, 46, -84, -60, 'e', 2, 8, 0.5)
{
  const angles: number[] = []
  for (let a = 95; a <= 170; a += 5) angles.push(a)
  // the canopy: a thin white blade sweeping round the drum, 18 m up
  loftSections(C, angles, angles.map((a): SectionPt[] => {
    const r = R(a)
    return [
      { r: r + 0.2, z: 18.4, part: white },
      { r: r + 9.4, z: 18.4, part: white },
      { r: r + 9, z: 17.6, part: white },
      { r: r + 0.2, z: 16.6, part: null },
    ]
  }), null)
  for (const a of [95, 170]) {
    const r = R(a), s = a === 95 ? -1 : 1, d = dirOf(a)
    quad(white, [at(a, r + 0.2, 16.6), at(a, r + 9, 17.6), at(a, r + 9.4, 18.4), at(a, r + 0.2, 18.4)], [d[1] * s, -d[0] * s, 0])
  }
  // the curved glass wall under it
  loftSections(C, angles, angles.map((a): SectionPt[] => {
    const r = R(a)
    return [{ r: r + 0.08, z: 16, part: glass }, { r: r + 0.08, z: 10, part: null }]
  }), null)
}
// North-east: the louvred block and the glazed office block south of it.
blk(charcoal, 34, 80, 50, 78, 23)
band(34, 80, 50, 78, 'n', 3, 9, 2)
band(34, 80, 50, 78, 'e', 3, 9, 2)
blk(grey, 58, 80, 18, 50, 20, charcoal)
band(58, 80, 18, 50, 'e', 2, 8)
band(58, 80, 18, 50, 'e', 11, 17)

if (import.meta.main) {
  await save('phl-xfinity-mobile-arena', 'Xfinity Mobile Arena', [
    { part: white, material: finish('arena-white', 0xeef0f0) },
    { part: charcoal, material: finish('arena-louvres', 0x5d636b) },
    { part: grey, material: finish('arena-grey', 0xb4b8bb) },
    { part: glass, material: PALETTE.window },
    { part: screen, material: windowVariant(2, 0x8a5a55) },
  ], { bearing: 9, osm: 'way/25312366', height: 37 })
}
