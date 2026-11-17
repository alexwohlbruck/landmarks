/**
 * North Island Credit Union Amphitheatre (opened 1998 as Coors Amphitheatre;
 * later Cricket Wireless, Sleep Train, Mattress Firm), Chula Vista: the
 * stage house of the 20,000-capacity outdoor amphitheatre. A broad curved
 * shell roof, highest at the front and arched across, its ends dropping onto
 * two tan pylons that carry the video screens either side of the big stage
 * opening; the tan stage house and the low backstage buildings behind; the
 * blue lit venue sign on the front of the roof. Original procedural
 * geometry, CC0-1.0.   bun generators/sd-niccu-amphitheatre.ts
 *
 * What isn't modelled, and why: the reserved seats are a fan of seat rows on
 * graded ground and the lawn is grass; both are the map's (as for the
 * Hollywood Bowl and the Skyla amphitheatre). The lead's note asked for "the
 * fan-shaped roof/canopy over the reserved seating": there is none. NAIP
 * (2022) shows the seat sections open to the sky, and every photo (2009-2026)
 * shows open seats in front of the stage shell. The only roof is the stage's.
 * The concourse kiosks and gate buildings round the bowl are left to the map.
 *
 * Frame and placement: the model is the stage house, OSM way/223961641, so
 * the anchor is that outline's centroid, -117.00636, 32.58765 (about 95 m
 * south-west of the lead's venue anchor, which sits in the seats). Bearing
 * 48: +y points north-east, from the stage towards the seats. x to its right,
 * z up, metres. The shell's axis is at x = -6.
 *
 * Ground: y = 0 is the lowest ground under the outline, the orchestra pit in
 * front of the stage (lidar ground, 0.1 above the box's ground_min); the
 * backstage yard is 0.7-1.6 m higher. Elevation 0.
 *
 * Evidence
 * - OSM way/223961641 (building=yes): the stage house outline, front edge an
 *   arc from (-32, 12) through (-2, 22) to (20, 20), the stage block back to
 *   y = -18, backstage wings west (-38..-21, -16..0) and east (18..35,
 *   -23..9). The venue way/101600253 (building=no, amenity=theatre) is the
 *   whole site and isn't replaced.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014; the venue is 1998),
 *   0.5 m grid in this frame (~/landmarks-scratch/sd/work/
 *   sd-niccu-amphitheatre/lidar.json), heights above the pit: shell 24.7 at
 *   the front on the axis, 20.5 at the back (y = -8); across, 22.2 at
 *   x = -24 and 21.0 at x = +20 at the front; the ends drop to 13.9 (x = -32)
 *   and 6 (x = +24); backstage buildings 5.4-5.6; the east wing 7.7-9.8 at
 *   its outer edge.
 * - USGS NAIP (2022): the grey shell roof, the stage house, the open seat
 *   fan, the lawn.
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   "North Island Credit Union Amphitheatre in 2024.jpg" (Pink Floyd Fan
 *     101, CC BY-SA 4.0): the shell from the side, its tan underside and
 *     fascia, the stage-left pylon and screen, the stage opening and its
 *     lighting grid, the sign;
 *   "Phish - Chula Vista 10 25 14 (15333046983).jpg" (Trevor Bexon, CC BY
 *     2.0): face-on from the seats, the arched shell, both pylons with their
 *     sloping outer faces and screens;
 *   "North Island Credit Union Amphitheater.jpg" (AnnoyingBee, CC0, 2026):
 *     at night, the blue lit sign on the roof front;
 *   "Cricket Wireless Amphitheatre in Chula Vista.jpg" (Ewen Roberts, CC BY
 *     2.0): the tan, green-trimmed gate buildings (not modelled);
 *   "Def Leppard (4120855799).jpg" (Nick Ares, CC BY-SA 2.0): the stage at
 *     night.
 *
 * Estimated: the shell's thickness (1.6 m fascia), the pylons' width and
 * slope (from the face-on photo), the screens' size, the opening's height
 * (to the lighting grid, 19.4 m), the colours (tan stucco from the 2024 photo, grey roof from NAIP),
 * the sign's place and size (no lettering).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, report, writeGlb, type XY } from './sf-de-young'
import { panel } from './sf-opera-house'

const tan = new Part(), shellTop = new Part(), dark = new Part(), win = new Part(), sign = new Part(), trim = new Part()

const AX = -6 // the shell's axis
const HALF = 30 // half-width of the shell, to the tips
const Y0 = -9, Y1 = 22.5 // back and front edges of the shell
/** Height of the shell's top at (x, y): arched across, falling to the back. */
function zTop(x: number, y: number) {
  const u = Math.min(1, Math.abs(x - AX) / HALF)
  const front = 24.7 - 3.2 * u * u - (u > 0.86 ? ((u - 0.86) / 0.14) ** 1.6 * 9 : 0)
  const t = (Y1 - y) / (Y1 - Y0) // 0 at the front, 1 at the back
  return front - 4.2 * t
}
const TH = 1.6
const NX = 20, NY = 4
const xs = Array.from({ length: NX + 1 }, (_, i) => AX - HALF + (2 * HALF * i) / NX)
const ys = Array.from({ length: NY + 1 }, (_, j) => Y0 + ((Y1 - Y0) * j) / NY)
// front edge bows forward on the axis (the outline's arc): push y by a sag
const bow = (x: number) => 3 * (1 - ((x - AX) / HALF) ** 2)
const P = (i: number, j: number, under = false): V3 => {
  const x = xs[i], y = ys[j] + (j === NY ? bow(x) : (bow(x) * j) / NY)
  return [x, y, zTop(x, ys[j]) - (under ? TH : 0)]
}
for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) {
  shellTop.quad(P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1))
  tan.quad(P(i, j, true), P(i, j + 1, true), P(i + 1, j + 1, true), P(i + 1, j, true))
}
// fascias: front (faces +y), back (-y), and the two tips
for (let i = 0; i < NX; i++) {
  trim.quad(P(i, NY, true), P(i, NY), P(i + 1, NY), P(i + 1, NY, true))
  tan.quad(P(i + 1, 0, true), P(i + 1, 0), P(i, 0), P(i, 0, true))
}
for (let j = 0; j < NY; j++) {
  tan.quad(P(0, j, true), P(0, j), P(0, j + 1), P(0, j + 1, true))
  tan.quad(P(NX, j + 1, true), P(NX, j + 1), P(NX, j), P(NX, j, true))
}

// ---------------------------------------------------------------------------
// The stage house under the shell: a tan box with the big dark stage opening
// on its front, and the lighting grid as a dark band under the roof front.
prism(tan, [[-24, -9], [14, -9], [14, 12], [-24, 12]], 0, 20.2, shellTop)
panel(dark, [-22.5, 12], [12.5, 12], [0, 1], 1.2, 19.4, 0.06)
// the stage deck in front of the opening
prism(dark, [[-22, 12], [12, 12], [12, 17], [-22, 17]], 0, 1.4, trim)
// the lighting grid hung under the front of the shell
{
  const zg = 19.4
  prism(dark, [[-22, 13], [12, 13], [12, 19.5], [-22, 19.5]], zg, zg + 0.6, dark)
}
// The pylons either side: tan, the outer face sloping, a screen on the front;
// the shell's tips rest on them.
function pylon(xIn: number, xOut: number, top: number) {
  const s = Math.sign(xOut - xIn)
  const ring: XY[] = [[xIn, 2], [xOut, 2], [xOut, 20], [xIn, 20]]
  prism(tan, ring, 0, top - 6, tan)
  // sloping outer top: wedge from (xOut, top-6) up to (xIn, top)
  const a: V3 = [xIn, 2, top], b: V3 = [xIn, 20, top], c: V3 = [xOut, 20, top - 6], d: V3 = [xOut, 2, top - 6]
  if (s > 0) { tan.quad(a, d, c, b) } else { tan.quad(a, b, c, d) }
  const e: V3 = [xIn, 2, top - 6], f: V3 = [xIn, 20, top - 6]
  if (s > 0) { tan.quad(e, a, b, f); tan.tri(d, a, e); tan.tri(f, b, c) } else { tan.quad(f, b, a, e); tan.tri(e, a, d); tan.tri(c, b, f) }
  // screen on the front face
  const xa = Math.min(xIn, xOut) + 1.2, xb = Math.max(xIn, xOut) - 1.2
  panel(win, [xa, 20], [xb, 20], [0, 1], 6.5, 13.5, 0.06)
}
pylon(-24, -36, 17)
pylon(14, 26, 15)

// ---------------------------------------------------------------------------
// Backstage: the low buildings behind and beside the stage house (lidar 5.5).
prism(tan, [[-36, -16], [-21, -14], [-21, 0], [-38, -1]], 0, 5.5, shellTop)
prism(tan, [[-21, -18], [18, -13], [18, -9], [-21, -9]], 0, 6.6, shellTop)
prism(tan, [[18, -23], [35, -20.5], [31, 8.5], [18, 6.5]], 0, 5.5, shellTop)
// the venue sign on the shell's front fascia (lit blue at night)
{
  const x0 = -18, x1 = -8
  const y0 = ys[NY] + bow(x0) + 0.08, y1 = ys[NY] + bow(x1) + 0.08
  const z0 = zTop(x0, Y1), z1 = zTop(x1, Y1)
  sign.quad([x0, y0, z0 - TH + 0.1], [x1, y1, z1 - TH + 0.1], [x1, y1, z1 + 2.6], [x0, y0, z0 + 2.6])
  sign.quad([x1, y1 - 0.3, z1 - TH + 0.1], [x0, y0 - 0.3, z0 - TH + 0.1], [x0, y0 - 0.3, z0 + 2.6], [x1, y1 - 0.3, z1 + 2.6])
}

// ---------------------------------------------------------------------------
const parts = [
  { part: tan, material: { ...finish('niccu-tan-stucco', 0xcfb995), floodlight: (p: V3, n: V3) => (n[1] > 0.5 ? 0.5 : 0.15) } },
  { part: shellTop, material: PALETTE.roof },
  { part: dark, material: finish('stage-black', 0x4a4f57) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: sign, material: finish('neon-niccu-blue', 0x3f63b5) },
]
const glb = writeGlb('North Island Credit Union Amphitheatre', parts, {
  license: 'CC0-1.0', bearing: 48, elevation: 0, anchor: [32.58765, -117.00636],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', replaces: ['way/223961641'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('NICCU Amphitheatre', parts, glb, 5000)
const out = new URL('../models/sd-niccu-amphitheatre.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
