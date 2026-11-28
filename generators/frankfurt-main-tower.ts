/**
 * Main Tower, Frankfurt am Main: procedural, CC0-1.0.
 * bun generators/frankfurt-main-tower.ts
 *
 * Schweger + Partner, 1996-1999, for Helaba: 200 m, 56 storeys, the
 * public observation platforms at about 192 and 198 m, and a 40 m red and
 * white broadcast mast to 240 m. A round tower in blue reflective glass
 * beside a lower rectangular tower in dark glass, the two held together by
 * a narrow dark block carrying the Helaba name.
 *
 * Identity, in order: the tall blue glass cylinder; the lower dark
 * rectangular tower beside it (to the north-west); the dark joint block
 * between them standing a little above the rectangle; the stepped
 * observation top with its railings; the red and white mast.
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin: the area
 * centroid of the OSM outline way/11526963 (50.112521, 8.672189).
 * y = 0 is the lowest ground under the footprint.
 *
 * Plan (measured from the OSM nodes): the cylinder is centred at
 * (1.65, -11.5), radius 15.95 (outline); the top drum radius 11 (OSM
 * 183071928 has 9.2; p2 shows it nearly as wide as the deck: estimated
 * between). The rectangular tower is OSM 1299371966, 26.3 x 20 m, its
 * long side at 32° from east; the joint block the quad between it and the
 * cylinder (OSM 183071934's corner at (17.8, 5.9)).
 *
 * Heights:
 * - cylinder roof 200, mast tip 240, decks 192 and 198: published
 *   (de.wikipedia "Main Tower"); OSM 183071934 193 (the lower deck),
 *   183071928 200, 183072519 240.
 * - the rectangular tower 178 m: measured on p2 (181) and p3 (178),
 *   scaled from the 200 m roof and the 40 m mast; OSM tags the outline 170.
 * - the joint block 195.5: measured on p2 and p3.
 *
 * Evidence:
 * - p1 https://commons.wikimedia.org/wiki/File:Maintower_Frankfurt.jpg
 *   Thomas Wolf (www.foto-tw.de), CC BY-SA 3.0 de: from the south-west,
 *   the whole height.
 * - p2 https://commons.wikimedia.org/wiki/File:2015-03-04_Top_of_Main_Tower_Frankfurt_Main_Hesse_Germany.jpg
 *   Norbert Nagel, CC BY-SA 3.0: the top: cylinder, joint block with the
 *   Helaba name, the rectangle's dark grid, the decks and the mast.
 * - p3 https://commons.wikimedia.org/wiki/File:Maintower_in_Frankfurt.jpg
 *   Matthias90Saar, CC BY-SA 3.0: from the south-east, the whole height.
 * - p4 https://commons.wikimedia.org/wiki/File:Maintower_(Taunusanlage)a.jpg
 *   brionv, CC BY 2.0: from the Taunusanlage (west), the rectangle's
 *   window grid and the cylinder's pale mullions.
 * - p5 https://commons.wikimedia.org/wiki/File:Kiefer_Maintower,_Frankfurt_(13568632993).jpg
 *   Kiefer. from Darmstadt, CC BY-SA 2.0.
 * - OSM (API, 2026-11): the outline and the parts in `replaces`.
 * - Published: de.wikipedia "Main Tower" (200 m, 240 m with the mast,
 *   56 storeys, decks at about 192 and 198 m).
 * - No lidar (none in Germany). Look-only: "Frankfurt Am Main-Main Tower
 *   von Westen-20120315.jpg" (Mylius, GFDL only), looked at, not used.
 *
 * The historic (neo-Renaissance) facades the lower floors are set into
 * belong to the neighbouring OSM outlines 174789461 and 174789449, not to
 * the Main Tower's outline, so they are left to the map.
 *
 * Colours from the daylight photos: the cylinder a strong mid blue
 * #6a98cc (p1, p4: sky-blue reflections) with pale mullion rings #dfe6ec
 * every three storeys; the rectangle's dark frame #59626d (p2: near black
 * blue, lifted to stay above charcoal) with blue-grey glass #7487a0 in
 * two-storey panels; the joint block #545a62; the mast red #c75b45 and
 * white.
 *
 * Night: both curtain walls are `window*`; the decks' railings are trim.
 *
 * Doubts: the rectangle's height rests on two photos (OSM says 170); the
 * joint block's plan is read from OSM's part edges only; the base under
 * the cylinder is hidden by trees and neighbours in every photo.
 */
import { Part, type V3 } from './mesh'
import { finish, windowVariant } from './palette'
import { prism, face, saveLods, ccw, type XY, type Layer } from './frankfurt-commerzbank-tower'
import { lathe } from './chi-aon-center'

const ID = 'frankfurt-main-tower'
const C: XY = [1.65, -11.5], R = 15.95, R_DRUM = 11
const DECK = 192, ROOF = 200, MAST = 240
const RECT_TOP = 178, JOINT_TOP = 195.5
const STOREY = 3.5

const cyl = new Part(), rectWall = new Part(), rectWin = new Part(), trim = new Part(), dark = new Part(), red = new Part()

// ── the cylinder ──
lathe(cyl, C[0], C[1], [[R, 0], [R, DECK]], 32)
// pale mullion rings every three storeys
for (let z = 3 * STOREY + 4; z < DECK - 2; z += 3 * STOREY)
  lathe(trim, C[0], C[1], [[R + 0.05, z - 0.2], [R + 0.05, z + 0.2]], 32)
// the lower deck: a flat ring, a railing band at its rim
lathe(trim, C[0], C[1], [[R, DECK], [R, DECK + 1.2], [R - 0.2, DECK + 1.2], [R - 0.2, DECK + 0.1], [R_DRUM, DECK + 0.1]], 32)
// the drum to the upper deck and the roof
lathe(cyl, C[0], C[1], [[R_DRUM, DECK + 0.1], [R_DRUM, ROOF - 2]], 24)
lathe(trim, C[0], C[1], [[R_DRUM, ROOF - 2], [R_DRUM + 0.4, ROOF - 2], [R_DRUM + 0.4, ROOF - 0.8], [R_DRUM, ROOF - 0.8], [R_DRUM, ROOF], [3.2, ROOF]], 24)
// the plant house under the mast
lathe(dark, C[0], C[1], [[3.2, ROOF], [3.2, ROOF + 3.2], [0, ROOF + 3.2]], 12)
// the mast: red and white bands, ~5 m each (p2)
{
  const r0 = 0.85, r1 = 0.55
  const bands = 8
  for (let k = 0; k < bands; k++) {
    const z0 = ROOF + 3.2 + ((MAST - ROOF - 3.2) * k) / bands, z1 = ROOF + 3.2 + ((MAST - ROOF - 3.2) * (k + 1)) / bands
    const ra = r0 + (r1 - r0) * (k / bands), rb = r0 + (r1 - r0) * ((k + 1) / bands)
    lathe(k % 2 === 0 ? trim : red, C[0], C[1], k === bands - 1 ? [[ra, z0], [rb, z1], [0, z1]] : [[ra, z0], [rb, z1]], 8)
  }
}

// ── the rectangular tower ──
const RECT: XY[] = ccw([[-9.3, 0.0], [13.0, 14.0], [2.85, 30.4], [-21.3, 16.0]])
{
  // a bevelled parapet top
  prism(rectWall, RECT, 0, RECT_TOP - 0.5, { top: null })
  const ins = RECT.map(([x, y]) => [x + (-4.2 - x) * 0.035, y + (15.2 - y) * 0.035] as XY)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    rectWall.quad([RECT[i][0], RECT[i][1], RECT_TOP - 0.5], [RECT[j][0], RECT[j][1], RECT_TOP - 0.5], [ins[j][0], ins[j][1], RECT_TOP], [ins[i][0], ins[i][1], RECT_TOP])
  }
  prism(dark, ins, RECT_TOP, RECT_TOP + 0.01, { top: dark })
  // window panels: two storeys, bays ~3.6 m, the frame showing between
  for (let i = 0; i < 4; i++) {
    const a = RECT[i], b = RECT[(i + 1) % 4]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [u[1], -u[0], 0]
    const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * 0.05, a[1] + u[1] * s + n[1] * 0.05, z]
    const nb = Math.round(L / 3.6), w = L / nb, pier = 0.9
    const rows = Math.floor((RECT_TOP - 6 - 8) / (2 * STOREY))
    for (let r = 0; r < rows; r++) {
      const za = 8 + r * 2 * STOREY + 0.6, zb = za + 2 * STOREY - 1.2
      for (let k = 0; k < nb; k++) face(rectWin, [P(k * w + pier / 2, za), P((k + 1) * w - pier / 2, za), P((k + 1) * w - pier / 2, zb), P(k * w + pier / 2, zb)], n)
    }
    // the lobby: one tall glazed band
    face(rectWin, [P(1, 0.5), P(L - 1, 0.5), P(L - 1, 6.5), P(1, 6.5)], n)
  }
}

// ── the joint block (dark, with the Helaba name), from the rectangle to the cylinder ──
{
  const J: XY[] = ccw([[-9.3, 0.0], [9.5, 11.9], [13.6, 5.2], [9.9, 1.2], [1.6, 4.0]])
  prism(dark, J, 0, JOINT_TOP)
}

const parts: Layer[] = [
  { part: cyl, material: windowVariant(2, 0x6a98cc) },
  { part: rectWall, material: finish('main-tower-frame', 0x59626d) },
  { part: rectWin, material: { name: 'window', color: 0x7487a0, roughness: 0.35 } },
  { part: trim, material: finish('main-tower-trim', 0xd3dde6) },
  { part: dark, material: finish('main-tower-dark', 0x545a62) },
  { part: red, material: finish('main-tower-mast-red', 0xc75b45, 0.6) },
]
await saveLods(ID, 'Main Tower', parts, null, { anchor: [50.112521, 8.672189], bearing: 0, elevation: 0, height: MAST })
