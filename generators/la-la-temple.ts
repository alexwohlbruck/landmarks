/**
 * Los Angeles California Temple (1956, Edward O. Anderson), Westwood —
 * original procedural geometry, CC0-1.0.
 *
 *   bun generators/la-la-temple.ts
 *
 * Frame: x toward bearing 144.4° (south-east, the temple's front and its
 * forecourt), y toward 54.4° (north-east, along the long main block), z up,
 * metres. Placed at bearing 54.4°. Origin at (22.9, 12.2) m from
 * (-118.43417, 34.05259), the middle of the main block's front face, on
 * the lowest ground under the footprint (87.6 m; the hilltop is flat to
 * within 0.9 m under the whole building, USGS 3DEP).
 *
 * A long white block with a taller central mass, and from its front edge a
 * square tower in two stages, a stepped spire and the gold statue of the
 * angel Moroni. Low annex wings run forward from both ends round the
 * forecourt. The tower and the gold figure, the long white block and the
 * tall screen windows are the identity.
 *
 * Evidence
 * - Plan: OSM way/216534845, which matches LA County LARIAC 2020 lidar
 *   footprint 430223841846 vertex for vertex; every edge is square to this
 *   frame and used as given.
 * - Heights: LA County lidar surface model (LACounty_Dynamic/Elevation
 *   layer 8, 2.5 m grid) over the 87.5 m ground: main block 28.0 m, central
 *   mass 33.9 m with 30.2 m shoulders, front block 10.8 m, annex wings 7–8.8
 *   m, tower shaft over 55 m in a 9 m square; LARIAC roof 163.2 m, so 75.6 m
 *   to the top of the statue. Published: 257 ft (78 m) including the 15.5 ft
 *   statue (Wikipedia; lidar used).
 * - Tower stages, measured off photo t1: shaft to 58 m, upper stage 6 m
 *   square to 66.5 m, spire to 71 m.
 * - Photos (Wikimedia Commons), compared with renders from the same side:
 *   t1 "Los Angeles California Temple, Color" (Altus Photo Design, CC BY
 *      2.0) — from the south, the long front and the tower at dusk;
 *   t2 "Los Angeles California Temple, August 2024" (Alexis Doine, CC0) —
 *      from the south-west on Santa Monica Boulevard, daylight;
 *   t3 "Mormon Temple, West Los Angeles" (InSapphoWeTrust, CC BY-SA 2.0) —
 *      the front face-on from the forecourt side, the wings' ends;
 *   t4 "Los Angeles L.D.S. Temple" (Ken Lund, CC BY-SA 2.0) — the tower
 *      over the trees from the south.
 *   USGS NAIP for the roofs (about 10 m misregistered here; lidar used).
 * - Colour: white cast stone (Mo-Sai), the palette's stone; the gilded statue.
 *
 * Estimated: the tall screen windows (three per side of the tower on the
 * long front and back, read off t1 and t3), the tower's column of square
 * screens, the statue's form (a bold figure with its trumpet), the spire's
 * steps. Left out: the forecourt, its pool and gardens, the flagpole.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, lngLat, rect, prism, panel, cap, walls, inset, save, quadN } from './la-getty-center'

const O = [-118.43417, 34.05259] as const
const BEARING = 54.4
const ORIGIN: XY = [22.9, 12.2]

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), gold = new Part()

/** A white block with a soft top edge and a thin parapet lip. */
function block(r: XY[], h: number, lip = 0.9, z0 = 0) {
  prism(stone, null, r, z0, h, { corner: 0.3, bevel: 0.35 })
  const t = inset(r, 0.35)
  const i = inset(r, lip)
  for (let k = 0; k < t.length; k++) {
    const j = (k + 1) % t.length
    trim.quad([t[k][0], t[k][1], h], [t[j][0], t[j][1], h], [i[j][0], i[j][1], h], [i[k][0], i[k][1], h])
  }
  walls(trim, i, h - 0.6, h, true)
  cap(roof, i, h - 0.6)
}

// main block, 28 m
const MAIN = rect(-29.7, -47.7, -7.0, 44.9)
block(MAIN, 28)
// central mass, 33.9 m, from the back bump to the front, with 30.2 m shoulders
block(rect(-38.3, -9.1, 2.0, 8.5), 33.9)
block(rect(-32.0, 8.5, -4.0, 14.7), 30.2)
block(rect(-32.0, -15.3, -4.0, -9.1), 30.2)
// front block, 10.8 m
block(rect(-7.0, -17.2, 11.3, 14.3), 10.8)
// annex wings round the forecourt, 8 m
block([[-7, 14.3], [8.1, 14.3], [8.1, 28.6], [30.9, 28.6], [30.9, 27.3], [44.3, 27.3], [44.3, 54.2], [25.9, 54.2], [25.9, 49.6], [19, 49.6], [19, 44.8], [-7, 44.8]], 8)
block([[-7, -47.7], [-4.3, -47.7], [-4.3, -45.6], [30.5, -45.6], [30.5, -57.7], [44.3, -57.7], [44.3, -29.9], [30.1, -29.9], [30.1, -31.5], [6.8, -31.5], [6.8, -17.2], [-7, -17.2]], 8)

// tall screen windows on the main block, three each side of the central
// mass, front (x = -7, facing +x) and back (x = -29.7)
for (const v of [-38, -29, -20, 20, 29, 38]) {
  panel(win, [-7.0, -60], [-7.0, 60], v + 60 - 1.3, v + 60 + 1.3, 13.0, 25.0, 0.06)
  panel(win, [-29.7, 60], [-29.7, -60], 60 - v - 1.3, 60 - v + 1.3, 13.0, 25.0, 0.06)
}
// and on the ends of the main block (y faces), two each
for (const u of [-23.5, -13.2]) {
  panel(win, [60, 44.9], [-60, 44.9], 60 - u - 1.3, 60 - u + 1.3, 13.0, 25.0, 0.06)
  panel(win, [-60, -47.7], [60, -47.7], u + 60 - 1.3, u + 60 + 1.3, 13.0, 25.0, 0.06)
}
// a wide screen on each forecourt-facing end of the wings
panel(win, [44.3, 27.3], [44.3, 54.2], 6, 21, 2.0, 6.5, 0.06)
panel(win, [44.3, -57.7], [44.3, -29.9], 6, 22, 2.0, 6.5, 0.06)

// ---------- tower ----------
const TX = -2.5, TY = -0.3
const sq = (h: number): XY[] => rect(TX - h, TY - h, TX + h, TY + h)
prism(stone, null, sq(4.5), 33.9, 58, { corner: 0.3, bevel: 0.35 })
block(sq(4.9), 58.6, 1.0, 57.8) // a cap band round the shaft top
prism(stone, null, sq(3.0), 58.6, 66.5, { corner: 0.25, bevel: 0.3 })
block(sq(3.3), 67.0, 0.6, 66.3)
// stepped spire
{
  const steps: [number, number, number][] = [[2.2, 67.0, 68.4], [1.6, 68.4, 69.6], [1.0, 69.6, 70.6], [0.55, 70.6, 71.2]]
  for (const [h, z0, z1] of steps) prism(trim, roof, sq(h), z0, z1, { corner: 0.15, bevel: 0.15 })
}
// a column of square screens on each face of the shaft, from the central
// mass's face up the tower (the front face starts low, at 14 m)
{
  const faces: [XY, XY, number][] = [
    [[TX + 4.5, TY - 4.5], [TX + 4.5, TY + 4.5], 14], // front (+x)
    [[TX - 4.5, TY + 4.5], [TX - 4.5, TY - 4.5], 35.5],
    [[TX + 4.5, TY + 4.5], [TX - 4.5, TY + 4.5], 35.5],
    [[TX - 4.5, TY - 4.5], [TX + 4.5, TY - 4.5], 35.5],
  ]
  for (const [a, b, z0] of faces)
    for (let z = z0; z + 2 <= 56; z += 3.4) panel(win, a, b, 3.5, 5.5, z, z + 2.0, 0.06)
  // the front block's face: the central entrance below the tower column
  panel(win, [11.3, -17.2], [11.3, 14.3], 13.5, 18.0, 1.0, 8.0, 0.06)
}

// ---------- Moroni ----------
// A bold standing figure on a small drum, facing east (the real statue
// faces east), raising a trumpet: body as a tapered octagon, a head, and
// the trumpet as a slim bar angled up.
{
  const cx = TX, cy = TY
  const oct = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 8 + Math.PI / 8
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3
  })
  const loft = (r0: number, z0: number, r1: number, z1: number) => {
    const A = oct(r0, z0), B = oct(r1, z1)
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      const n = (k: number): V3 => { const a = (Math.PI * 2 * k) / 8 + Math.PI / 8; return [Math.cos(a), Math.sin(a), 0.15] }
      quadN(gold, A[i], A[j], B[j], B[i], [n(i), n(j), n(j), n(i)])
    }
  }
  loft(0.55, 71.2, 0.75, 71.5) // drum
  loft(0.75, 71.5, 0.6, 72.3)
  loft(0.6, 72.3, 0.42, 74.4) // robe
  loft(0.42, 74.4, 0.3, 74.7) // shoulders
  loft(0.3, 74.7, 0.32, 75.2) // head
  loft(0.32, 75.2, 0.05, 75.6)
  // trumpet: from the shoulder, east (+x after placement ≈ east-south-east here) and up
  const t0: V3 = [cx + 0.2, cy, 74.5], t1: V3 = [cx + 1.6, cy, 75.3]
  const w = 0.14
  const s = (p: V3): V3[] => [[p[0], p[1] - w, p[2] - w], [p[0], p[1] + w, p[2] - w], [p[0], p[1] + w, p[2] + w], [p[0], p[1] - w, p[2] + w]]
  gold.sweep([s(t0), s(t1)])
}

if (import.meta.main) {
  const [lng, lat] = lngLat(ORIGIN, O[0], O[1])
  console.log(`anchor ${lng.toFixed(7)}, ${lat.toFixed(7)}`)
  save('la-la-temple', 'Los Angeles California Temple', [
    { part: stone, material: PALETTE.stone },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: { ...PALETTE.roof, color: 0xc4c8ca } },
    { part: win, material: { ...PALETTE.window, color: 0x9aa4ab } },
    { part: gold, material: finish('moroni-gold', 0xd9b866, 0.5) },
  ], { bearing: BEARING, elevation: 0, height: 75.6, replaces: ['way/216534845'] })
}
