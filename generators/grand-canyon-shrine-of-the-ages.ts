/**
 * Shrine of the Ages, Grand Canyon Village (South Rim): procedural, CC0-1.0.
 * bun generators/grand-canyon-shrine-of-the-ages.ts
 *
 * The National Park Service's 1970 auditorium and meeting hall among the
 * pines south of the rim, rehabilitated in 2010. What makes it read:
 * - two long blocks of random-coursed buff limestone, each under a band of
 *   dark board fascia, joined by a recessed glass entrance hall;
 * - the auditorium block's roof, a warped (hyperbolic-paraboloid) plane:
 *   level along its east wall, rising along its west wall from about 8 m
 *   at the entrance to over 11 m at the north end;
 * - the two big arched timber portals in front of the glass entrance hall,
 *   in the courtyard between the blocks on the west side;
 * - the meeting rooms' large windows in the stone.
 *
 * Uses the shared kit in grand-canyon-bright-angel-lodge.ts.
 *
 * Frame: x, y, z up, metres, turned to bearing 350 (the long walls), so +y
 * runs north-north-west along the building and +x east-north-east. Anchor
 * (-112.12364, 36.05433), inside OSM way/204082736 (Shrine of the Ages).
 *
 * Sources:
 * - OSM way/204082736, ODbL (name, identity, the H-shaped plan).
 * - USGS 3DEP lidar AZ_GrandCanyonNP_1_2019 (flown 2019), 1 m grid, read
 *   in the model's frame, heights over ground_min 2113.89 m: auditorium
 *   block x -15..7, y 8.5..33, its roof 7.0 along the east wall and from
 *   8.4 (y 10) to 11.6 (y 32) along the west wall; the south block x
 *   -15..7, y -21..-7 and the entrance hall x -3..7 between them, flat
 *   roofs 7.0-7.5; ground 0.3-0.9 on the west, 1.5-1.7 on the east.
 * - USGS NAIP aerial (public domain): the plan, the pale grey roofs, the
 *   west courtyard and the auditorium's longer shadow.
 * - Photos (EVIDENCE):
 *   - "Grand Canyon National Park Shrine of Ages 0030 (7451155900).jpg",
 *     Grand Canyon NPS, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Grand_Canyon_National_Park_Shrine_of_Ages_0030_(7451155900).jpg
 *     (panorama of the courtyard front: the two stone blocks, fascia, the
 *     arched portals and the glass hall);
 *   - "Grand Canyon National Park Shrine of Ages 0019 (7451160908).jpg",
 *     Grand Canyon NPS, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Grand_Canyon_National_Park_Shrine_of_Ages_0019_(7451160908).jpg
 *     (the meeting-room wing: big windows, the sign, the fascia band);
 *   - "Shrine of the Ages - Front of Building (d97f1258-...).JPG", NPS,
 *     public domain,
 *     https://commons.wikimedia.org/wiki/File:Shrine_of_the_Ages_-_Front_of_Building_(d97f1258-f230-4fc0-a8a6-ba00634ff41a).JPG
 *     (close-up of the stone and a glazed door: the stone colour).
 *
 * Numbers, above y = 0 = ground_min + 0.3 m (the lowest ground under the
 * footprint, the west side):
 * - flat roofs 6.8, auditorium roof 6.7 (east) and 8.2-11.5 (west):
 *   lidar, measured;
 * - fascia band 1.2 m: estimated from photos 0019 and 0030 (a fifth of the
 *   wall);
 * - portals: span 5.6 m, springing 3.0, crown 5.8: estimated from photo
 *   0030; windows from photo 0019.
 *
 * Not modelled: downpipes, the lettering, the walks and planting.
 *
 * Doubts: no photo shows the east side or the auditorium's north end; they
 * are drawn as plain stone under the fascia. The meeting-room windows are
 * placed on the south block's south face from photo 0019, whose direction
 * is not recorded.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, face, panels, prism, rect, save, type XY } from './grand-canyon-bright-angel-lodge'

const stone = new Part(), fascia = new Part(), roof = new Part(), win = new Part()

const FLAT = 6.8, BAND = 1.2

// The auditorium block's warped roof: level along the east wall (x 7),
// rising northward along the west wall (x -15).
const AX0 = -15, AX1 = 7, AY0 = 8.5, AY1 = 33
const west = (y: number) => 8.2 + ((y - AY0) / (AY1 - AY0)) * (11.5 - 8.2)
const zr = ([x, y]: XY) => 6.7 + ((AX1 - x) / (AX1 - AX0)) * (west(y) - 6.7)
const AUD = rect(AX0, AX1, AY0, AY1)
prism(stone, AUD, 0, (p) => zr(p) - BAND, 0, null)
prism(fascia, AUD, (p) => zr(p) - BAND, zr, 0, null)
{
  const NX = 4, NY = 4
  for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) {
    const x0 = AX0 + ((AX1 - AX0) * i) / NX, x1 = AX0 + ((AX1 - AX0) * (i + 1)) / NX
    const y0 = AY0 + ((AY1 - AY0) * j) / NY, y1 = AY0 + ((AY1 - AY0) * (j + 1)) / NY
    const P = (x: number, y: number): V3 => [x, y, zr([x, y])]
    face(roof, [P(x0, y0), P(x1, y0), P(x1, y1)], [0, 0, 1])
    face(roof, [P(x0, y0), P(x1, y1), P(x0, y1)], [0, 0, 1])
  }
}

// The south block and the entrance hall between, flat-roofed.
for (const r of [rect(-15, 7, -21, -7), rect(-3, 7, -7.2, 8.7)]) {
  prism(stone, r, 0, FLAT - BAND, 0, null)
  prism(fascia, r, FLAT - BAND, FLAT, 0, null)
  prism(roof, r, FLAT, FLAT + 0.05, 0.05)
}

// The glass entrance hall's west wall, in the courtyard.
panels(win, [-3, 8.7], [-3, -7.2], 3, 4.4, 0.6, 5.6, 0.6)
// The east side's glazed doors (the service entrance).
panels(win, [7, -7.2], [7, 8.7], 1, 3.0, 1.5, 4.2, 6)

// The two arched timber portals in front of the glass, with a fascia beam
// over them: semicircular heads on square jambs.
const PX0 = -5.2, PX1 = -4.2, SPRING = 3.0, R = 2.8, RIB = 0.7
for (const yc of [-2.6, 4.5]) {
  for (const s of [-1, 1]) box(fascia, PX0, PX1, yc + s * R - RIB / 2, yc + s * R + RIB / 2, 0, SPRING, 0)
  const N = 10
  for (let k = 0; k < N; k++) {
    const a0 = (Math.PI * k) / N, a1 = (Math.PI * (k + 1)) / N
    const ring = (r: number, a: number): [number, number] => [yc + r * Math.cos(a), SPRING + r * Math.sin(a)]
    const [yo0, zo0] = ring(R + RIB / 2, a0), [yo1, zo1] = ring(R + RIB / 2, a1)
    const [yi0, zi0] = ring(R - RIB / 2, a0), [yi1, zi1] = ring(R - RIB / 2, a1)
    const q = (x: number, y: number, z: number): V3 => [x, y, z]
    const mid = (a0 + a1) / 2, out: V3 = [0, Math.cos(mid), Math.sin(mid)]
    face(fascia, [q(PX0, yo0, zo0), q(PX1, yo0, zo0), q(PX1, yo1, zo1), q(PX0, yo1, zo1)], out)
    face(fascia, [q(PX0, yi0, zi0), q(PX1, yi0, zi0), q(PX1, yi1, zi1), q(PX0, yi1, zi1)], [0, -out[1], -out[2]])
    for (const [x, n] of [[PX0, -1], [PX1, 1]] as const) face(fascia, [q(x, yo0, zo0), q(x, yo1, zo1), q(x, yi1, zi1), q(x, yi0, zi0)], [n, 0, 0])
  }
}
// The flat canopy from the portals back to the hall.
box(fascia, PX0, -3, -7.2, 8.7, FLAT - BAND, FLAT, 0, null)
box(roof, PX0, -3, -7.2, 8.7, FLAT, FLAT + 0.05, 0)

// The meeting rooms' big windows in the south block.
panels(win, [-15, -21], [7, -21], 2, 3.4, 1.0, 4.4, 2)
panels(win, [-15, -7], [-15, -21], 2, 3.4, 1.0, 4.4, 2)

await save('grand-canyon-shrine-of-the-ages', 'Shrine of the Ages', [
  // Buff random-coursed limestone, the dark grey-green board fascia and
  // timber portals, pale grey roofs.
  { part: stone, material: finish('shrine-stone', 0xd8c09c) },
  { part: fascia, material: finish('shrine-fascia', 0x6b716c) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
], { bearing: 350, elevation: 0, height: 11.5 })
