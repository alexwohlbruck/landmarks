/**
 * Sejong Center for the Performing Arts (세종문화회관), Grand Theater,
 * Seoul (1978, Eom Deok-mun): procedural, CC0-1.0.
 * bun generators/seoul-sejong-center.ts
 *
 * Frame: bearing 359 (the outline's edges run 1 degree west of the
 * compass), model +x is compass 89, +y compass 359. The colonnaded fronts
 * face east onto Sejong-daero and Gwanghwamun Square (+x) and south onto
 * the grand stair (-y). Origin at the area centroid of the Grand Theater's
 * outline (OSM way/223158436); y = 0 is the pavement of Sejong-daero. The
 * stair plaza to the south falls away below it; that ground is the map's,
 * and the walls on that side run down to y = 0 only. Elevation 0. Terrain
 * could not be checked (no z15 tiles over Seoul).
 *
 * OSM: way/223158436 (5 levels), 122 x 73 m. The Chamber Hall
 * (way/223158439) and the Sejong Gallery (way/543729862) to the south are
 * separate buildings and stay the map's.
 * Published: opened 1978; the design abstracts a Korean timber hall in
 * concrete and granite: tall piers with bracket capitals, a beam, rafter
 * ends and a deep hipped eave (Wikipedia, "Sejong Center").
 *
 * From the photos, scaled to the outline's 73 m east front (j2, level and
 * frontal; 9.1 px/m): the piers 15.4 m to the beam, the beam 2.2 m, the
 * rafter course 1.3 m, the eave's thick fascia to 22.4 m, overhanging the
 * beam by 5.5 m, and its sloping top to 25.8 m (j2, j5); the piers about
 * 6.4 m apart, ten along the east front, four along the south, each a chamfered square shaft flaring into a stepped
 * capital, the capitals well apart so dark gaps show between them under
 * the beam (j1, j2, j5); the solid granite pylon with its relief at the
 * south-east corner (j1, j5); the recessed front 6 m behind the piers,
 * a near-black bronze fret screen over glass doors (j1, j5; sampled about
 * #2b2623, drawn #3b3734); the eave and roof charcoal (j2 sampled about
 * #222d2c, pulled up to #50565c); the eave's deep
 * soffit on closely spaced rafter ends that fan at the corners (j5); the
 * stage house rising behind (j1, j4).
 * Estimated: every height (photo scaling only), the depth of the portico,
 * the rafter spacing (2 m), the stage house's size and place (to
 * 31.5 m), the eave's slope; the north and west fronts (j4 only shows them far off).
 * Left out: the relief on the pylon, the stair and its plaza (ground), the
 * statues, the media facade.
 *
 * Night: the granite is floodlit (_FLOODLIGHT, j5); the doors and windows
 * are `window`; the bronze screen stays dark.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - j1 "Sejong Center for the Performing Arts(20240413).jpg", YellowTurtle9, CC BY-SA 4.0 (south-east)
 *   https://commons.wikimedia.org/wiki/File:Sejong_Center_for_the_Performing_Arts(20240413).jpg
 * - j2 "Sejong Center (세종문화회관) - panoramio - 골뱅이.jpg", 골뱅이, CC BY-SA 3.0 (east front, level)
 *   https://commons.wikimedia.org/wiki/File:Sejong_Center_(%EC%84%B8%EC%A2%85%EB%AC%B8%ED%99%94%ED%9A%8C%EA%B4%80)_-_panoramio_-_%EA%B3%A8%EB%B1%85%EC%9D%B4.jpg
 * - j5 "Night view of the Sejong Center in May 2025.jpg", DtSeoul, CC0 (south-east corner, dusk)
 *   https://commons.wikimedia.org/wiki/File:Night_view_of_the_Sejong_Center_in_May_2025.jpg
 * - j4 "Sejongno, Jongno-gu, Seoul, South Korea - panoramio (7).jpg", Schölla Schwarz, CC BY 3.0 (from above, far)
 *   https://commons.wikimedia.org/wiki/File:Sejongno,_Jongno-gu,_Seoul,_South_Korea_-_panoramio_(7).jpg
 * - j6 "Sejong-daero, Seoul.jpg", Tristan Surtel, CC BY-SA 4.0 (from the square)
 *   https://commons.wikimedia.org/wiki/File:Sejong-daero,_Seoul.jpg
 * No look-only references used.
 * Doubts: heights rest on photo scaling alone; the north and west fronts
 * and the stage house are drawn from distant views; the south stair's
 * drop is not modelled.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { abox, save, type P2 } from './seoul-city-hall'
import { box as kbox } from './seoul-geunjeongjeon'
import { flat, prism as polyPrism } from './seoul-n-seoul-tower'

const stone = new Part(), roof = new Part(), bronze = new Part(), win = new Part()
const sbox = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, skip = 'b') => kbox(p, x0, y0, z0, x1, y1, z1, skip, true)

const E = 60.7, S = -34.7, N = 38.3, W = -62.0 // the beam lines
const ZB = 15.4, ZT = 17.6, ZS = 18.9, ZF = 22.4, ZR = 25.8 // beam bottom, top, soffit, fascia top, roof top
const PD = 6.0 // portico depth
const OV = 5.5 // eave overhang beyond the beam

/** A pier: chamfered square shaft, a flaring stepped capital, abacus. Centre (x, y). */
function pier(x: number, y: number) {
  const r = 0.68, c = 0.24
  const oct = (h: number, z: number): V3[] => {
    const k = h - c
    return [[x + h, y - k, z], [x + h, y + k, z], [x + k, y + h, z], [x - k, y + h, z], [x - h, y + k, z], [x - h, y - k, z], [x - k, y - h, z], [x + k, y - h, z]] as V3[]
  }
  stone.loft([oct(r + 0.15, 1.2), oct(r, 1.8), oct(r, ZB - 2.6)])
  // the capital: flares outward in two steps to the abacus
  // the bracket capital: a straight-sided flare, a collar, a second flare, the block under the beam
  const sq = (h: number, z: number): V3[] => oct(h, z).map(([px, py]) => [x + Math.sign(px - x) * Math.min(Math.abs(px - x) + 0.15, h), y + Math.sign(py - y) * Math.min(Math.abs(py - y) + 0.15, h), z] as V3)
  stone.loft([oct(r, ZB - 2.2), sq(r + 0.28, ZB - 1.5)])
  sbox(stone, x - r - 0.32, x + r + 0.32, y - r - 0.32, y + r + 0.32, ZB - 1.5, ZB - 1.15)
  stone.loft([sq(r + 0.28, ZB - 1.15), sq(r + 0.5, ZB - 0.45)])
  sbox(stone, x - 1.2, x + 1.2, y - 1.2, y + 1.2, ZB - 0.45, ZB)
}

function build() {
  // ---- the body: recessed fronts behind the colonnade
  const body: P2[] = [[-60.4, -40.5], [-12.5, -40.5], [-12.4, -33.4], [22.1, -33.4], [22.1, S + PD], [E - PD, S + PD], [E - PD, 38.2], [-13.9, 38.2], [-13.9, 32.4], [-38.9, 32.4], [-39.0, 34.0], [-62.0, 34.0], [-61.9, 4.5], [-54.9, 4.5], [-54.9, -6.9], [-60.5, -6.9]]
  polyPrism(stone, null, body, 0, ZT)
  // the podium under the colonnade
  abox(stone, 22.1, E + 1.2, S - 1.2, N + 1.0, 0, 1.2, stone)

  // ---- the corner pylon (south-east), solid granite, slightly flared foot
  abox(stone, E - 9.4, E + 0.6, S - 0.6, S + 9.4, 1.2, ZB, null)
  // its flared foot
  stone.loft([
    [[E - 9.9, S - 1.1, 1.2], [E + 1.1, S - 1.1, 1.2], [E + 1.1, S + 9.9, 1.2], [E - 9.9, S + 9.9, 1.2]] as V3[],
    [[E - 9.4, S - 0.6, 3.4], [E + 0.6, S - 0.6, 3.4], [E + 0.6, S + 9.4, 3.4], [E - 9.4, S + 9.4, 3.4]] as V3[],
  ])

  // ---- the piers
  const eastY: number[] = [], southX: number[] = []
  for (let k = 1; k <= 10; k++) eastY.push(S + 9 + 6.4 * k - 0.4)
  for (let k = 1; k <= 4; k++) southX.push(E - 9 - 6.4 * k)
  for (const y of eastY) pier(E - 0.9, y)
  for (const x of southX) pier(x, S + 0.9)

  // ---- the beam round the whole building
  const beam = (x0: number, x1: number, y0: number, y1: number) => abox(stone, x0, x1, y0, y1, ZB, ZT, null)
  beam(E - 1.9, E + 0.4, S - 0.4, N + 0.4)
  beam(22.1, E - 1.9, S - 0.4, S + 1.9)
  beam(W - 0.4, 22.1, -40.9, -40.1) // the south front behind the chamber hall: a band
  beam(W - 0.4, W + 0.4, -40.9, N + 0.4)
  beam(W - 0.4, E - 1.9, N - 0.4, N + 0.4)
  // the portico's ceiling under the beam line
  flat(stone, [[E - PD, S + PD, ZB], [E - PD, N, ZB], [E, N, ZB], [E, S + PD, ZB]].map((p) => p as V3), [0, 0, -1])
  flat(stone, [[22.1, S, ZB], [22.1, S + PD, ZB], [E, S + PD, ZB], [E, S, ZB]].map((p) => p as V3), [0, 0, -1])

  // ---- rafter ends under the eave, all round; fanning at the corners
  const RS = 2.0
  const rafterX = (x: number, y0: number, y1: number) => sbox(roof, x - 0.28, x + 0.28, Math.min(y0, y1), Math.max(y0, y1), ZT, ZS)
  const rafterY = (y: number, x0: number, x1: number) => sbox(roof, Math.min(x0, x1), Math.max(x0, x1), y - 0.28, y + 0.28, ZT, ZS)
  for (let y = S + 2; y <= N - 2; y += RS) { rafterY(y, E - 1.5, E + OV - 0.8); rafterY(y, W + 1.5, W - OV + 0.8) }
  for (let x = W + 2; x <= E - 2; x += RS) { rafterX(x, S - OV + 0.8, S + 1.5); rafterX(x, N + OV - 0.8, N - 1.5) }
  // diagonal rafters at the four corners
  for (const [cx, cy, sx, sy] of [[E, S, 1, -1], [E, N, 1, 1], [W, S, -1, -1], [W, N, -1, 1]] as [number, number, number, number][]) {
    const L = OV * 1.25, d = 0.28
    const ux = sx / Math.SQRT2, uy = sy / Math.SQRT2, nx = -uy, ny = ux
    const P = (t: number, s: number, z: number): V3 => [cx + ux * t + nx * s, cy + uy * t + ny * s, z]
    let pts = [P(-1.5, -d, ZT), P(L, -d, ZT), P(L, d, ZT), P(-1.5, d, ZT)]
    const a2 = pts.reduce((s, p, i) => { const q = pts[(i + 1) % 4]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
    if (a2 < 0) pts = pts.reverse()
    roof.loft([pts, pts.map((p) => [p[0], p[1], ZS] as V3)])
    roof.cap(pts, false)
  }

  // ---- the eave: soffit, fascia, sloping top, flat roof
  const ro = { x0: W - OV, x1: E + OV, y0: S - OV, y1: N + OV }
  const ring = (ins: number, z: number): V3[] => [[ro.x0 + ins, ro.y0 + ins, z], [ro.x1 - ins, ro.y0 + ins, z], [ro.x1 - ins, ro.y1 - ins, z], [ro.x0 + ins, ro.y1 - ins, z]]
  roof.loft([ring(0, ZS), ring(0, ZF)]) // fascia
  roof.loft([ring(0, ZF), ring(7, ZR)]) // the hipped slope
  roof.cap(ring(7, ZR), true)
  // soffit: from the fascia back to the beam line, facing down
  const bi: V3[] = [[W + 0.4, S + 1.9, ZS], [E - 1.9, S + 1.9, ZS], [E - 1.9, N - 0.4, ZS], [W + 0.4, N - 0.4, ZS]]
  const bo = ring(0, ZS)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    flat(roof, [bo[i], bi[i], bi[j], bo[j]], [0, 0, -1])
  }

  // ---- the stage house behind
  abox(stone, -46, -20, -16, 20, ZR - 1, 31.5, stone)
  abox(stone, -46.4, -19.6, -16.4, 20.4, 30.6, 31.5, null)

  // ---- the recessed fronts: glass doors below, a bronze fret screen above
  const front = (axis: 'x' | 'y', at: number, a: number, b: number, n: V3) => {
    const P = (u: number, z: number, o = 0): V3 => (axis === 'x' ? [at + n[0] * o, u, z] : [u, at + n[1] * o, z])
    flat(win, [P(a, 1.2, 0.06), P(b, 1.2, 0.06), P(b, 5.2, 0.06), P(a, 5.2, 0.06)], n)
    flat(bronze, [P(a, 6.0, 0.06), P(b, 6.0, 0.06), P(b, ZB, 0.06), P(a, ZB, 0.06)], n)
    // the fret: proud bronze bars, vertical every 1.6 m, three rails
    for (let u = a + 0.8; u < b - 0.4; u += 1.6) {
      if (axis === 'x') sbox(bronze, at + n[0] * 0.06, at + n[0] * 0.3, u - 0.12, u + 0.12, 6.0, ZB - 0.6, 'bt')
      else sbox(bronze, u - 0.12, u + 0.12, at + n[1] * 0.06, at + n[1] * 0.3, 6.0, ZB - 0.6, 'bt')
    }
    for (const z of [6.0, 9.6, 13.2]) {
      if (axis === 'x') sbox(bronze, Math.min(at, at + n[0] * 0.32), Math.max(at, at + n[0] * 0.32), a, b, z, z + 0.25)
      else sbox(bronze, a, b, Math.min(at, at + n[1] * 0.32), Math.max(at, at + n[1] * 0.32), z, z + 0.25)
    }
    // a stone band between doors and screen
    if (axis === 'x') abox(stone, at, at + n[0] * 0.4, a, b, 5.2, 6.0, stone)
    else abox(stone, a, b, Math.min(at, at + n[1] * 0.4), Math.max(at, at + n[1] * 0.4), 5.2, 6.0, stone)
  }
  front('x', E - PD, S + 9.6, N - 0.2, [1, 0, 0])
  front('y', S + PD, 22.3, E - 9.6, [0, -1, 0])
  // north and west fronts: rows of tall windows under the eave
  for (let x = -12; x < E - 8; x += 4.0) for (const [z0, z1] of [[2, 5.5], [8, 13]]) flat(win, [[x + 0.8, 38.26, z0], [x - 0.8, 38.26, z0], [x - 0.8, 38.26, z1], [x + 0.8, 38.26, z1]], [0, 1, 0])
  for (let y = -36; y < 30; y += 4.0) if (y < -7 || y > 5) for (const [z0, z1] of [[8, 13]]) flat(win, [[-62.06, y + 0.8, z0], [-62.06, y - 0.8, z0], [-62.06, y - 0.8, z1], [-62.06, y + 0.8, z1]], [-1, 0, 0])

  const lit = (p: V3, n: V3) => (n[2] > 0.6 ? 0.1 : n[2] < -0.6 ? 0.6 : Math.max(0.3, 1 - p[2] / 24))
  save('seoul-sejong-center', 'Sejong Center for the Performing Arts', [
    { part: stone, material: { ...finish('sejong-granite', 0xdcd8cf), floodlight: lit } },
    { part: roof, material: { ...PALETTE.roof, color: 0x50565c } },
    { part: bronze, material: finish('sejong-bronze', 0x3b3734) },
    { part: win, material: PALETTE.window },
  ], 359, 31.5)
}

if (import.meta.main) build()
