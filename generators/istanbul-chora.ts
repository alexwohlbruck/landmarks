/**
 * Chora Church (Kariye Camii), Edirnekapı, Istanbul: procedural, CC0-1.0.
 * bun generators/istanbul-chora.ts
 *
 * The church of the Holy Saviour in Chora: the naos rebuilt about 1077-81
 * and 1120, the inner and outer narthexes, the north annex and the
 * parecclesion (funerary chapel) added by Theodore Metochites about
 * 1315-21; a mosque from about 1511, with the brick-and-plaster minaret on
 * the south-west corner. Banded brick and stone walls in warm pink and
 * ochre; the main dome on a tall drum ringed by arched windows; the
 * parecclesion's dome on its own window drum and its apse; the two small
 * domes of the inner narthex; the three-sided main apse; lead roofs over
 * the naos's cross arms; the heavy later buttresses at the east end.
 *
 * Uses the small kit exported by generators/istanbul-new-mosque.ts.
 *
 * Frame: x along the church towards the apse (world 104.5), y towards its
 * north side (world 14.5), z up; placed with bearing 14.5 (OSM's walls).
 * Origin at the centroid of the OSM outline (relation/7614527),
 * 28.939023, 41.031204. The ground falls a little to the south and east;
 * y = 0 is the lowest ground, by the parecclesion's apse, and the walls
 * run down to it all round; doors are left out. Elevation 0. No terrain
 * check could run: Mapterhorn has no z15 terrain here, and there is no
 * lidar for Turkey.
 *
 * OSM (ODbL), fetched 2026-11: relation/7614527 (outline x -15.1..17,
 * y -16.4..15.8, with holes for four domes: the main dome at (7.1, 1.1),
 * 7.5 m across; the parecclesion's at (6.0, -9.5), 3.8 m; the inner
 * narthex's at (-2.5, -2.7) and (-2.8, 9.9), 3.8 m), way/1408839170 (the
 * minaret, x -15.2..-9.5, y -16.4..-11.6). The outline gives the three-
 * sided main apse (x 13.9..17) and the round parecclesion apse (centre
 * (14, -10), r 4) and a small block east of the main apse (x 17..21.3,
 * y 1..3.5), drawn low.
 *
 * Published (Wikipedia en "Chora Church"): main dome 7.7 m across inside;
 * the parecclesion's dome 4.5 m; exonarthex 4 x 23 m, esonarthex 4 x 18 m.
 *
 * Estimated from photos (no published heights; a14 from the east and a08
 * from the south-west scaled against the parecclesion's wall, about 10 m,
 * and the drone view a13):
 * - naos walls 12.5 m with lead gables over the cross arms to 15 m; main
 *   drum 14-18 m, dome crown 20.8 m;
 * - parecclesion walls 10 m, its drum 10.5-13.2 m, dome to 15 m; its apse
 *   8.5 m;
 * - narthexes 9 m with their two domes on drums to 13 m; the north annex
 *   10 m;
 * - main apse 11 m; the north-east buttress 16 m, the arched wall-
 *   buttress at the parecclesion's east end 13 m;
 * - minaret: brick base to 9.6 m, şerefe 24 m, cap 26.6-31.6 m, alem to
 *   32.8 m (a13 and a03 show its tip well above the main dome).
 * Invented / simplified: window counts; the blind arcades of the walls as
 *   grouped arched windows; the banding as three or four bold pale stone
 *   courses a wall (the real walls alternate many brick and stone
 *   courses); the narthexes' and parecclesion's vaults as one low lead dome
 *   a bay, in the rows the drone view a13 shows (bay counts estimated); the
 *   naos's cross vaults as plain lead gables; the north annex's roofs as
 *   low lead barrels.
 *
 * The minaret is drawn 2.1 m across (real about 1.6 m) with a bold şerefe.
 *
 * Colours from daylight photos pulled to the palette: brick (#d3a58f,
 * warm pink) with bold pale stone courses (palette stone), pink plaster on
 * the drums (#e8c7b7), the minaret pale stone and plaster (palette
 * stone), blue-grey lead
 * (#9aa3ad). Night: floodlit walls and domes (_FLOODLIGHT); windows glow.
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 * - a13 "Chora Church 2024.jpg", Tadam, CC0 (drone, from the south-east)
 *   https://commons.wikimedia.org/wiki/File:Chora_Church_2024.jpg
 * - a14 "Chora Church Constantinople 2007 panorama 003.jpg", Gryffindor,
 *   public domain (the east end: both apses, the north-east buttress)
 *   https://commons.wikimedia.org/wiki/File:Chora_Church_Constantinople_2007_panorama_003.jpg
 * - a03 "Exterior of Chora Church-Kariye Mosque.jpg", Alexander Hatley,
 *   public domain (the south side and the minaret)
 *   https://commons.wikimedia.org/wiki/File:Exterior_of_Chora_Church-Kariye_Mosque.jpg
 * - a08 "Exterior of Chora Church (04).jpeg", onceinawhile, CC BY-SA 3.0
 *   (the south side from the south-west)
 *   https://commons.wikimedia.org/wiki/File:Exterior_of_Chora_Church_(04).jpeg
 * - a11 "Exterior of Chora Church (03).jpeg", onceinawhile, CC BY-SA 3.0
 *   (the north-east)
 *   https://commons.wikimedia.org/wiki/File:Exterior_of_Chora_Church_(03).jpeg
 * - a00 "Chora Church exterior 16-06-2024 02.jpg", Rémih, CC BY-SA 4.0
 *   (the west and south)
 *   https://commons.wikimedia.org/wiki/File:Chora_Church_exterior_16-06-2024_02.jpg
 * Look-only: none.
 *
 * Doubts: every height is photo-scaled from close, wide-angle views and
 * the drone view; the west front (exonarthex) was seen only obliquely; the
 * division of the west block into the two narthexes is not modelled.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { MosqueKit, type XY, TAU, circle, panel, poly, prism, rect, revolve, windowRow } from './istanbul-new-mosque'

const brick = new Part(), plaster = new Part(), lead = new Part(), win = new Part(), stone = new Part(), gilt = new Part()
// The kit's "stone" is the brick here; drums and the minaret take plaster.
const K = new MosqueKit(brick, lead, win, gilt)
const KP = new MosqueKit(plaster, lead, win, gilt)
const KS = new MosqueKit(stone, lead, win, gilt) // the minaret is pale stone and plaster

/** A gabled lead roof over a rectangle, ridge along x or y. */
function gable(x0: number, x1: number, y0: number, y1: number, z: number, rise: number, along: 'x' | 'y') {
  const e = 0.35
  if (along === 'x') {
    const ym = (y0 + y1) / 2
    const a: V3[] = [[x0 - e, y0 - e, z], [x1 + e, y0 - e, z], [x1 + e, ym, z + rise], [x0 - e, ym, z + rise]]
    const b: V3[] = [[x1 + e, y1 + e, z], [x0 - e, y1 + e, z], [x0 - e, ym, z + rise], [x1 + e, ym, z + rise]]
    poly(lead, a, [0, -rise, (y1 - y0) / 2])
    poly(lead, b, [0, rise, (y1 - y0) / 2])
    poly(brick, [[x0, y0, z], [x0, y1, z], [x0, ym, z + rise - 0.2]], [-1, 0, 0])
    poly(brick, [[x1, y1, z], [x1, y0, z], [x1, ym, z + rise - 0.2]], [1, 0, 0])
  } else {
    const xm = (x0 + x1) / 2
    const a: V3[] = [[x0 - e, y1 + e, z], [x0 - e, y0 - e, z], [xm, y0 - e, z + rise], [xm, y1 + e, z + rise]]
    const b: V3[] = [[x1 + e, y0 - e, z], [x1 + e, y1 + e, z], [xm, y1 + e, z + rise], [xm, y0 - e, z + rise]]
    poly(lead, a, [-rise, 0, (x1 - x0) / 2])
    poly(lead, b, [rise, 0, (x1 - x0) / 2])
    poly(brick, [[x1, y0, z], [x0, y0, z], [xm, y0, z + rise - 0.2]], [0, -1, 0])
    poly(brick, [[x0, y1, z], [x1, y1, z], [xm, y1, z + rise - 0.2]], [0, 1, 0])
  }
}

/** A flat lead roof with a lip over a rectangle. */
function flatRoof(x0: number, x1: number, y0: number, y1: number, z: number) {
  prism(lead, rect(x0 - 0.3, x1 + 0.3, y0 - 0.3, y1 + 0.3), z, z + 0.45)
}

/** Two pale stone courses along each face of a block (the banding). */
function bands(x0: number, x1: number, y0: number, y1: number, zs: number[], skip: Array<'n' | 's' | 'e' | 'w'> = [], h = 0.8) {
  for (const z of zs) {
    const o = 0.07
    if (!skip.includes('s')) poly(stone, [[x0, y0 - o, z], [x1, y0 - o, z], [x1, y0 - o, z + h], [x0, y0 - o, z + h]], [0, -1, 0])
    if (!skip.includes('n')) poly(stone, [[x1, y1 + o, z], [x0, y1 + o, z], [x0, y1 + o, z + h], [x1, y1 + o, z + h]], [0, 1, 0])
    if (!skip.includes('e')) poly(stone, [[x1 + o, y0, z], [x1 + o, y1, z], [x1 + o, y1, z + h], [x1 + o, y0, z + h]], [1, 0, 0])
    if (!skip.includes('w')) poly(stone, [[x0 - o, y1, z], [x0 - o, y0, z], [x0 - o, y0, z + h], [x0 - o, y1, z + h]], [-1, 0, 0])
  }
}

// ---------------------------------------------------------------------------
// Naos: walls, lead gables over the cross arms, the main drum and dome.
const NX0 = -0.6, NX1 = 13.9, NY0 = -7.0, NY1 = 9.2, NW = 12.5
const MC: XY = [7.1, 1.1]
prism(brick, rect(NX0, NX1, NY0, NY1, 0.3), 0, NW)
bands(NX0, NX1, NY0, NY1, [1.0, 4.4, 7.6, 11.7], ['w'])
gable(NX0 + 2.5, NX1 - 0.2, MC[1] - 3.4, MC[1] + 3.4, NW, 2.6, 'x')
gable(MC[0] - 3.4, MC[0] + 3.4, NY0 + 0.2, NY1 - 0.2, NW, 2.6, 'y')
// the tall window drum (16 arched windows, plaster) and the dome
{
  const n = 16, r = 4.7, z0 = NW + 1.4, z1 = 18
  prism(plaster, circle(MC[0], MC[1], r + 0.2, n, Math.PI / n), NW, z0, false)
  KP.drum(MC[0], MC[1], r, z0, z1, n, { every: 1, frac: 0.5, wz0: z0 + 0.5, wz1: z1 - 0.4, arch: true })
  // the arched lead eyebrows over the windows read as a scalloped rim
  revolve(lead, MC[0], MC[1], [[r + 0.45, z1 - 0.2], [r + 0.45, z1 + 0.15]], n, Math.PI / n, TAU + Math.PI / n, 'ring')
  K.dome(MC[0], MC[1], r, z1 + 0.15, 2.8, 16, 4, 1.0, false)
}
// windows on the naos walls: a tall triple window high in each arm's end
windowRow(win, [NX1, NY0], [NX0, NY0], 3, 1.2, 8.8, 11.4, [0, -1], true)
windowRow(win, [NX0, NY1], [NX1, NY1], 3, 1.2, 8.8, 11.4, [0, 1], true)

// The three-sided main apse with its triple window.
{
  const ring: XY[] = [[NX1, -2.5], [16.2, -1.2], [17.0, 1.0], [17.0, 3.5], [15.9, 5.5], [NX1, 6.6]]
  prism(brick, ring, 0, 11.0, false)
  poly(lead, [[NX1, -2.9, 11.0], [16.5, -1.5, 11.0], [17.4, 1.0, 11.0], [17.4, 3.6, 11.0], [16.2, 5.8, 11.0], [NX1, 7.0, 11.0]], [0, 0, 1])
  prism(lead, ring.map(([x, y]) => [x, y] as XY), 11.0, 11.6, true)
  panel(win, [17.0, 1.2], [17.0, 3.3], 4.6, 9.4, [1, 0], true)
  panel(win, [16.25, -0.9], [16.85, 0.7], 5.2, 8.6, [0.95, -0.33], true)
  panel(win, [16.85, 3.8], [16.05, 5.2], 5.2, 8.6, [0.9, 0.45], true)
  // the low block east of the apse (OSM)
  prism(brick, rect(17.0, 21.3, 1.0, 3.5), 0, 4.2)
  flatRoof(17.0, 21.3, 1.0, 3.5, 4.2)
}

// ---------------------------------------------------------------------------
// Parecclesion along the south side: walls, dome on a window drum, apse.
const PX0 = -9.5, PX1 = 13.9, PY0 = -14.2, PY1 = NY0, PW = 10.0
prism(brick, rect(PX0, PX1, PY0, PY1, 0.3), 0, PW)
bands(PX0, PX1, PY0, PY1, [1.0, 4.8, 9.1], ['n', 'e'])
// the parecclesion's roof: a row of low lead domical vaults, one a bay (a13)
for (let k = 0; k < 5; k++) {
  const x = PX0 + ((PX1 - PX0) * (k + 0.5)) / 5
  if (Math.abs(x - 6.0) < 2.5) continue // the bay under the drum dome
  K.dome(x, (PY0 + PY1) / 2, 2.5, PW + 0.5, 1.3, 8, 2, 0, true)
}
gable(PX0, PX1, PY0, PY1, PW, 0.7, 'x')
// two storeys of arched windows in the blind arcades of the south wall
windowRow(win, [PX1, PY0], [PX0, PY0], 6, 1.4, 1.8, 4.4, [0, -1], true)
windowRow(win, [PX1, PY0], [PX0, PY0], 6, 1.4, 5.8, 8.8, [0, -1], true)
{
  const c: XY = [6.0, -9.5]
  prism(plaster, circle(c[0], c[1], 2.8, 12, Math.PI / 12), PW, PW + 0.9)
  KP.drum(c[0], c[1], 2.6, PW + 0.9, 13.2, 12, { every: 1, frac: 0.5, arch: true })
  K.dome(c[0], c[1], 2.5, 13.2, 1.8, 12, 3, 0.7, true)
}
// the parecclesion's round apse (OSM: centre (14, -10), r 4)
{
  const c: XY = [13.9, -10.0]
  revolve(brick, c[0], c[1], [[3.9, 0], [3.9, 8.5]], 8, -Math.PI / 2, Math.PI / 2, false)
  revolve(lead, c[0], c[1], [[4.25, 8.5], [4.25, 8.9], [0.6, 10.2]], 8, -Math.PI / 2, Math.PI / 2)
  panel(win, [17.8, -10.8], [17.8, -9.2], 3.6, 7.2, [1, 0], true)
}
// the diaconicon's small dome between naos and parecclesion (a13)
{
  const c: XY = [11.9, -5.2]
  prism(plaster, circle(c[0], c[1], 1.8, 10, Math.PI / 10), NW, NW + 1.6)
  K.dome(c[0], c[1], 1.7, NW + 1.6, 1.2, 10, 2, 0, true)
}

// ---------------------------------------------------------------------------
// The narthexes (west block) with the inner narthex's two domes, and the
// north annex.
const WX0 = -15.1, WX1 = NX0, WY0 = -11.6, WY1 = 15.8, WW = 9.0
prism(brick, rect(WX0, WX1, WY0, WY1, 0.3), 0, WW)
bands(WX0, WX1, WY0, WY1, [0.6, 4.8, 8.1], ['e'])
// the narthexes' roofs: rows of low lead domes and domical vaults, one a
// bay, in three strips (exonarthex, esonarthex and the bays between), as
// the drone view a13 shows; no flat lead roof
for (const [xa, xb] of [[WX0, -10.2], [-10.2, -5.4], [-5.4, WX1]] as Array<[number, number]>) {
  const bays = 6
  for (let k = 0; k < bays; k++) {
    const y = WY0 + ((WY1 - WY0) * (k + 0.5)) / bays, x = (xa + xb) / 2
    if (Math.hypot(x - -2.5, y - -2.7) < 2.6 || Math.hypot(x - -2.8, y - 9.9) < 2.6) continue
    K.dome(x, y, Math.min(xb - xa, (WY1 - WY0) / bays) / 2 - 0.1, WW + 0.4, 1.3, 8, 2, 0, true)
  }
  gable(xa, xb, WY0, WY1, WW, 0.5, 'y')
}
// the exonarthex's west front: a row of arches, two storeys
windowRow(win, [WX0, WY1], [WX0, WY0], 7, 1.6, 1.4, 4.6, [-1, 0], true)
windowRow(win, [WX0, WY1], [WX0, WY0], 7, 1.2, 5.6, 8.0, [-1, 0], true)
for (const c of [[-2.5, -2.7], [-2.8, 9.9]] as XY[]) {
  prism(plaster, circle(c[0], c[1], 2.2, 10, Math.PI / 10), WW, WW + 1.0)
  KP.drum(c[0], c[1], 2.0, WW + 1.0, 11.6, 10, { every: 1, frac: 0.5, arch: true })
  K.dome(c[0], c[1], 1.9, 11.6, 1.4, 10, 2, 0, true)
}
// north annex, stepped as OSM has it
{
  const ring: XY[] = [[WX1, NY1], [NX1, NY1], [NX1, 11.1], [10.4, 11.1], [10.4, 13.7], [6.9, 13.7], [6.9, WY1], [WX1, WY1]]
  prism(brick, [[WX1, NY1], [NX1, NY1], [NX1, 11.1], [WX1, 11.1]], 0, 10.0)
  prism(brick, [[WX1, 11.1], [10.4, 11.1], [10.4, 13.7], [WX1, 13.7]], 0, 10.0)
  prism(brick, [[WX1, 13.7], [6.9, 13.7], [6.9, WY1], [WX1, WY1]], 0, 10.0)
  // the annex's lead barrel roofs, ridge along the church
  gable(WX1, NX1, NY1, 11.1, 10.0, 0.9, 'x')
  gable(WX1, 6.9, 13.7, WY1, 10.0, 0.9, 'x')
  bands(WX1, NX1, NY1, 11.1, [1.0, 4.8], ['s', 'w', 'e'])
  windowRow(win, [WX1, WY1], [6.9, WY1], 3, 1.3, 5.6, 8.4, [0, 1], true)
  void ring
}

// ---------------------------------------------------------------------------
// The later buttresses: the tall one at the north-east (a14, a11) and the
// wall-buttress with an arch at the parecclesion's east end (a03).
prism(brick, rect(10.6, 13.9, 8.4, 11.1, 0.2), 0, 15.6)
prism(lead, rect(10.4, 14.1, 8.2, 11.3), 15.6, 16.0)
K.arcade([13.9, -15.6], [13.9, -7.4], 1, 6.0, 12.6, [1, 0], 1.6, 1.4, 0, 6)
K.arcade([12.5, -7.4], [12.5, -15.6], 1, 6.0, 12.6, [-1, 0], 1.6, 0.01, 5.99, 6)
prism(brick, rect(12.5, 13.9, -15.6, -7.4), 12.6, 13.2)

// ---------------------------------------------------------------------------
// Minaret on the south-west corner: a stone and brick base to the roof,
// then a plastered shaft with one şerefe.
prism(stone, rect(-14.35, -10.35, -16.0, -12.0, 0.3), 0, 9.6)
KS.minaret(-12.35, -14.0, { R: 1.05, pedHalf: 1.5, ped: 10.4, balconies: [24], capBase: 26.6, capTip: 31.6, alem: 1.2, n: 10, base: 9.6 })

const parts = [
  { part: brick, material: { ...finish('chora-brick', 0xd3a58f), floodlight: (_p: V3, n: V3) => (n[2] > 0.9 ? 0.3 : 0.75) } },
  { part: plaster, material: { ...finish('chora-plaster', 0xe8c7b7), floodlight: () => 0.8 } },
  { part: stone, material: { ...PALETTE.stone, floodlight: () => 0.7 } },
  { part: lead, material: { ...finish('lead', 0x9aa3ad), floodlight: () => 0.6 } },
  { part: win, material: PALETTE.window },
  { part: gilt, material: finish('gilt', 0xcfa94f) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Chora Church', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 14.5, elevation: 0, height: 32.8,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/istanbul-chora.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
