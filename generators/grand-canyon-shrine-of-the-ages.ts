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
 * - portals: span 7 m, springing 2.9, outer crown 7.4: estimated from
 *   photo 0030; windows from photo 0019.
 *
 * Rework (lead review): the walls carry flush darker stones over their
 * faces in the photos' warmer tan and brown (#d2b993 and #b39570, pulled to
 * the palette's lightness); the board fascia is dark charcoal-green; the
 * two portals are rebuilt to photo 0030's proportions (spring 2.9, outer
 * crown 7.4, ribs 1.0 m, one shared middle pier) in weathered grey-brown
 * timber, standing just above the canopy so they read from above, and
 * the canopy's front fascia block that hid them is moved behind them.
 * Stone placement is invented (seeded). Plan, anchor, bearing and the
 * warped roof are unchanged.
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

const stone = new Part(), rubble = new Part(), fascia = new Part(), timber = new Part(), roof = new Part(), win = new Part()

// Seeded random numbers, so the stonework is the same on every build.
let seed = 1970
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
const lerp = (a: number, b: number) => a + (b - a) * rnd()

/**
 * Flush darker stones on a wall face from A to B (outward to the right of
 * A→B), bottom z0 to top z1 (a number or a function of the distance along
 * the face), skipping the spans in `gaps`, so the wall reads as
 * random-coursed limestone (photos 0019 and the front close-up).
 */
function stones(A: XY, B: XY, z0: number, z1: number | ((t: number) => number), n: number, gaps: [number, number, number, number][] = []) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
  const nrm: V3 = [u[1], -u[0], 0], top = typeof z1 === 'number' ? () => z1 : z1
  for (let k = 0, tries = 0; k < n && tries < n * 6; tries++) {
    const w = lerp(0.6, 1.2), h = lerp(0.35, 0.6)
    const s = lerp(0.15, L - 0.15 - w)
    const zt = Math.min(top(s), top(s + w)) - 0.1
    if (zt - h < z0) continue
    const z = lerp(z0, zt - h)
    if (gaps.some(([g0, g1, h0, h1]) => s < g1 && s + w > g0 && z < h1 && z + h > h0)) continue
    const P = (t: number, zz: number): V3 => [A[0] + u[0] * t + nrm[0] * 0.03, A[1] + u[1] * t + nrm[1] * 0.03, zz]
    face(rubble, [P(s, z), P(s + w, z), P(s + w, z + h), P(s, z + h)], nrm)
    k++
  }
}

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

// The two arched timber portals in front of the glass (photo 0030): big
// laminated arches that spring low and meet the fascia at their crowns,
// sharing a middle pier. They stand a little proud of the canopy so they
// read from above.
const PX0 = -5.9, PX1 = -4.2, SPRING = 2.9, R = 3.5, RIB = 1.0
for (const yc of [-2.6, 4.5]) {
  for (const s of [-1, 1]) box(timber, PX0, PX1, yc + s * R - RIB / 2, yc + s * R + RIB / 2, 0, SPRING, 0)
  const N = 10
  for (let k = 0; k < N; k++) {
    const a0 = (Math.PI * k) / N, a1 = (Math.PI * (k + 1)) / N
    const ring = (r: number, a: number): [number, number] => [yc + r * Math.cos(a), SPRING + r * Math.sin(a)]
    const [yo0, zo0] = ring(R + RIB / 2, a0), [yo1, zo1] = ring(R + RIB / 2, a1)
    const [yi0, zi0] = ring(R - RIB / 2, a0), [yi1, zi1] = ring(R - RIB / 2, a1)
    const q = (x: number, y: number, z: number): V3 => [x, y, z]
    const mid = (a0 + a1) / 2, out: V3 = [0, Math.cos(mid), Math.sin(mid)]
    face(timber, [q(PX0, yo0, zo0), q(PX1, yo0, zo0), q(PX1, yo1, zo1), q(PX0, yo1, zo1)], out)
    face(timber, [q(PX0, yi0, zi0), q(PX1, yi0, zi0), q(PX1, yi1, zi1), q(PX0, yi1, zi1)], [0, -out[1], -out[2]])
    for (const [x, n] of [[PX0, -1], [PX1, 1]] as const) face(timber, [q(x, yo0, zo0), q(x, yo1, zo1), q(x, yi1, zi1), q(x, yi0, zi0)], [n, 0, 0])
  }
}
// The flat canopy from the portals back to the hall, its fascia behind them.
box(fascia, PX1, -3, -7.2, 8.7, FLAT - BAND, FLAT, 0, null)
box(roof, PX1, -3, -7.2, 8.7, FLAT, FLAT + 0.05, 0)

// The meeting rooms' big windows in the south block.
panels(win, [-15, -21], [7, -21], 2, 3.4, 1.0, 4.4, 2)
panels(win, [-15, -7], [-15, -21], 2, 3.4, 1.0, 4.4, 2)

// Random-coursed stone over every stone face, round the openings.
const audTop = (x: number, y: number) => zr([x, y]) - BAND
stones([-15, 8.5], [-3, 8.5], 0.2, (t) => audTop(-15 + t, 8.5), 14)
stones([7, 8.5], [7, 33], 0.2, (t) => audTop(7, 8.5 + t), 26)
stones([7, 33], [-15, 33], 0.2, (t) => audTop(7 - t, 33), 26)
stones([-15, 33], [-15, 8.5], 0.2, (t) => audTop(-15, 33 - t), 34)
const S = FLAT - BAND
stones([-15, -21], [7, -21], 0.2, S, 22, [[4.7, 8.3, 0.9, 4.5], [13.7, 17.3, 0.9, 4.5]])
stones([-15, -7], [-15, -21], 0.2, S, 14, [[4.7, 8.3, 0.9, 4.5], [10, 14, 0.9, 4.5]])
stones([7, -21], [7, -7], 0.2, S, 16)
stones([-3, -7], [-15, -7], 0.2, S, 14)
stones([7, -7.2], [7, 8.7], 0.2, S, 12, [[6.3, 9.6, 1.4, 4.3]])

await save('grand-canyon-shrine-of-the-ages', 'Shrine of the Ages', [
  // Warm tan random-coursed limestone and its darker brown stones, the dark
  // board fascia, the weathered grey-brown timber portals, pale grey roofs.
  { part: stone, material: finish('shrine-stone', 0xd2b993) },
  { part: rubble, material: finish('shrine-rubble', 0xb39570) },
  { part: fascia, material: finish('shrine-fascia', 0x4d524f) },
  { part: timber, material: finish('shrine-timber', 0x8c7f6c) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
], { bearing: 350, elevation: 0, height: 11.5 })
