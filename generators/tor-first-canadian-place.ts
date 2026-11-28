/**
 * First Canadian Place, Toronto (1975, Edward Durell Stone with Bregman +
 * Hamann; recladding in white glass 2009-12) — original procedural
 * geometry, CC0-1.0.
 * bun generators/tor-first-canadian-place.ts
 *
 * Frame: x east-north-east +, y north-north-west +, z up, metres; origin
 * at the anchor on the ground. Bearing 343.3 (the Toronto street grid; the
 * OSM outline runs true in it). Anchor = area centroid of OSM way/27767627:
 * -79.3816906, 43.6487663.
 *
 * Identity (from the photos):
 *  1. Canada's tallest office tower: a plain white square shaft, 72
 *     storeys, its faces banded by white spandrels and glass.  (fcp, findist)
 *  2. The notched corners: each corner is cut back in a square re-entrant
 *     notch, which reads as a dark slot running the full height.     (fcp)
 *  3. The BMO sign high on each face: the red roundel and the letters
 *     "BMO", lit at night.                                            (fcp)
 *
 * Plan: OSM way/27767627 (57.2 x 55.4 m, notches 4.2-5.6 m deep in the
 * outline); drawn symmetric about its centre: 58.0 x 55.4 m with 4.5 m
 * square notches (measured from the outline's notch vertices).
 * Heights (no lidar in Canada):
 *  - published: 298 m to the roof, 72 storeys (Wikipedia, "First Canadian
 *    Place"); OSM height 292 (outline), 298 (way/289330446, the
 *    rooftop mechanical block, 29.6 x 21.6 m).
 *  - City of Toronto 3D Massing 2025 (https://open.toronto.ca/dataset/3d-massing/):
 *    287.4 m (one block). Used: the shaft's parapet at 290, the rooftop
 *    block to 298 behind it.
 *  - estimated from fcp: the windowless sign band, the top 14 m; the
 *    roundel about 8 m across and the letters 14 m wide.
 *  - ground: Mapterhorn z15 near flat here; elevation 0.
 * The podium around the tower (way/61429747, "building=office", layer 5)
 * and the Exchange Tower block are separate OSM buildings that the model
 * does not cover (0% of the podium lies under the tower outline); left to
 * the map. The base's BMO pavilion is part of that podium.
 *
 * Colours: white glass spandrels pulled a touch warm (fcp); the vision
 * glass a light reflective grey-blue (windowVariant rule for reflective
 * glass); the BMO red and blue.
 *
 * Night: the offices glow (window); the signs are neon in their colours.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  fcp     "First Canadian Place August 2017 01.jpg", Arild Vågen, CC BY-SA 4.0 —
 *          from King Street (north-west), the notches and the sign.
 *          https://commons.wikimedia.org/wiki/File:First_Canadian_Place_August_2017_01.jpg
 *  findist "Toronto Financial District August 2017.jpg", Arild Vågen,
 *          CC BY-SA 4.0 — looking up at King and Bay: the white banding.
 *          https://commons.wikimedia.org/wiki/File:Toronto_Financial_District_August_2017.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the antenna masts on the roof are left out (thin); the sign's
 * lettering is a plain blue panel (a sign, not the landmark's identity).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cornice, edgePanels, prism, save, type XY } from './atl-flatiron-building'

const white = new Part(), win = new Part(), roof = new Part(), red = new Part(), blue = new Part()

const HX = 29.0, HY = 27.7, N = 4.5, TOP = 290, MECH = 298, SIGN = TOP - 14
const plan: XY[] = [
  [-HX + N, -HY], [HX - N, -HY], [HX - N, -HY + N], [HX, -HY + N], [HX, HY - N], [HX - N, HY - N], [HX - N, HY],
  [-HX + N, HY], [-HX + N, HY - N], [-HX, HY - N], [-HX, -HY + N], [-HX + N, -HY + N],
]
prism(white, plan, 0, TOP, roof, 0.4)
cornice(white, plan, TOP - 0.8, 0.8, 0.25, null)
prism(white, [[13.7, -11.0], [13.6, 10.6], [-15.9, 10.6], [-15.9, -11.0]], TOP - 1, MECH, roof, 0.3)

// Window panels: three storeys a group, bays between white piers.
for (let i = 0; i < plan.length; i++) {
  const a = plan[i], b = plan[(i + 1) % plan.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const notch = L < 6
  edgePanels(win, a, b, 7.5, SIGN - 1.5, notch
    ? { group: 12, gap: 1.0, bay: 9, pier: 0, margin: 0.3, min: 1 }
    : { group: 12, gap: 3.8, bay: 8.5, pier: 0.7, margin: 1.0 })
}
// Lobby glazing at the base.
for (let i = 0; i < plan.length; i++) {
  const a = plan[i], b = plan[(i + 1) % plan.length]
  edgePanels(win, a, b, 0.4, 6.0, { group: 6, gap: 0, bay: 9, pier: 1.0, margin: 0.6, min: 1 })
}

// The BMO sign on each main face: the letters left of centre, the roundel right.
function disc(p: Part, c: XY, t: XY, nrm: XY, z: number, r: number) {
  const n = 14, out = 0.08
  const P = (k: number): V3 => {
    const a = (k / n) * Math.PI * 2
    return [c[0] + t[0] * r * Math.cos(a) + nrm[0] * out, c[1] + t[1] * r * Math.cos(a) + nrm[1] * out, z + r * Math.sin(a)]
  }
  const C: V3 = [c[0] + nrm[0] * out, c[1] + nrm[1] * out, z]
  for (let k = 0; k < n; k++) p.tri(C, P(k), P(k + 1))
}
const faces: [XY, XY][] = [ // a→b left to right seen from outside
  [[HX - N, -HY], [-HX + N, -HY]].reverse() as [XY, XY],
  [[HX, -HY + N], [HX, HY - N]],
  [[HX - N, HY], [-HX + N, HY]],
  [[-HX, HY - N], [-HX, -HY + N]],
]
for (const [a, b] of faces) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nrm: XY = [t[1], -t[0]]
  const at = (s: number): XY => [a[0] + t[0] * s, a[1] + t[1] * s]
  // letters: a blue panel 14 x 5 m
  const s0 = L / 2 - 12, s1 = L / 2 + 2, z0 = SIGN + 4.5, z1 = SIGN + 9.5
  const A = at(s0), B = at(s1), o = 0.08
  blue.quad([A[0] + nrm[0] * o, A[1] + nrm[1] * o, z0], [B[0] + nrm[0] * o, B[1] + nrm[1] * o, z0], [B[0] + nrm[0] * o, B[1] + nrm[1] * o, z1], [A[0] + nrm[0] * o, A[1] + nrm[1] * o, z1])
  // roundel: tri(C, P(k), P(k+1)) turns from t toward up, so it faces t x up = out
  disc(red, at(L / 2 + 7.5), t, nrm, SIGN + 7, 4.0)
}

await save('tor-first-canadian-place', 'First Canadian Place', [
  { part: white, material: finish('fcp-white', 0xf1efe9) },
  { part: win, material: { ...PALETTE.window, color: 0x8ea3b4 } },
  { part: roof, material: PALETTE.roof },
  { part: red, material: finish('neon-bmo-red', 0xd8343a) },
  { part: blue, material: finish('neon-bmo-blue', 0x3a6fb8) },
], { anchor: [43.6487663, -79.3816906], bearing: 343.3 }, 6500)
