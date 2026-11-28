/**
 * Bevo Mill (now "Das Bevo"), 4749 Gravois Ave, St. Louis (1916–1917;
 * built for August A. Busch Sr.; Klipstein & Rathmann) — original procedural
 * geometry, CC0-1.0.  bun generators/stl-bevo-mill.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 28, the building's own axis (OSM walls run at 28°):
 * the mill stands at the south end (-y), facing the Gravois–Delor corner;
 * the restaurant wings run north along Gravois. Anchor = the centroid of
 * OSM way/624381546 ("Das Bevo"), -90.2668386, 38.5819017.
 *
 * Location note: the brief's point (-90.2636, 38.5844) and the candidate
 * way/776734236 are 400 m away (an untagged Microsoft footprint); the mill
 * is way/624381546 at 4749 Gravois (Nominatim; matches the photos' street
 * corner).
 *
 * Identity (from the photos below):
 *  1. The four big lattice sails, pale rose-brown, on the mill's south face;
 *     the hub high on the cap.                                    (p1, p2)
 *  2. A tapering white stucco tower with a green band at its top, small
 *     windows; a shingled, bulging cap with a dormer.            (p1, p2)
 *  3. A fieldstone base with arched doors under a timber balcony gallery
 *     round the tower.                                                (p1)
 *  4. Stucco and half-timbered restaurant wings with steep slate roofs and
 *     fieldstone chimneys.                                            (p1)
 *
 * Heights: USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018 (flown 2017),
 * 0.5 m grid with class 18 kept (sparse: about 1 point a m²); y = 0 is the
 * lowest ground, at the west (the Gravois side is 2 m higher). Measured:
 * the cap's top 22 at (1.5, -18); the wings' ridges 11–12; the chimneys
 * ~13. The sails are too thin for the cloud.
 * Estimated from p1 (the tower ~11 m across at the gallery): the stone base
 * to 6.0, the gallery 6.0–7.2, the tower from r 5.6 at 7.2 to r 3.9 at
 * 16.5, the cap (to 22), the hub at 17.6, the sails 11.5 m long (a 23 m
 * span) and 2.0 m wide, lattice drawn as a solid frame with three bold bars.
 * Left out: the lattice's fine grid, the windows' frames, signs.
 *
 * Night: the windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  p1  "Bevo Mill Restaurant 20150905-190.jpg", Kbh3rd, CC BY 4.0 (from Gravois, east)
 *  p2  "BevoMillOutAndAbout.jpg", binkle_28 / Tyson Blanchard (Flickr), CC BY-SA 2.0 (from the south)
 *  p3  "Bevo Mill Restaurant, Gravois Avenue & Morgonford Road, Saint Louis", John Margolies, public domain
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, gableRoof, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'

const stucco = new Part(), stone = new Part(), slate = new Part(), sail = new Part(), win = new Part(), green = new Part()
const C: XY = [1.5, -18.5]

// ── The restaurant wings ──
box(stucco, -7.7, 6.9, -13.2, 3.2, 0, 7.5, null, 0)
gableRoof(slate, stucco, -7.7, 6.9, -13.2, 3.2, 7.5, 12.0, 'y', 0.4, 0.3)
box(stucco, -8.5, 6.9, 3.2, 13.5, 0, 7.0, null, 0)
gableRoof(slate, stucco, -8.5, 6.9, 3.2, 13.5, 7.0, 11.5, 'x', 0.4, 0.3)
box(stucco, -10.6, 9.0, 13.5, 22.0, 0, 7.0, null, 0)
gableRoof(slate, stucco, -10.6, 9.0, 13.5, 22.0, 7.0, 11.5, 'x', 0.4, 0.3)
for (const [x, y] of [[6.0, -4.0], [-6.5, 8.0]]) box(stone, x - 0.8, x + 0.8, y - 0.8, y + 0.8, 0, 13.0, stone, 0.2) // the chimneys
for (const [a, b] of [[[6.9, -13.2], [6.9, 3.2]], [[-7.7, 3.2], [-7.7, -13.2]], [[9.0, 13.5], [9.0, 22.0]]] as [XY, XY][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  for (let k = 0; k < Math.floor(L / 3); k++) onWall(win, a, b, rectShape(1.5 + k * 3, 2.7 + k * 3, 2.6, 5.0), 0.06)
}

// ── The mill ──
revolve(stone, C, [[6.4, 0], [6.4, 6.0]], 12, Math.PI / 12, true, true) // the fieldstone base
for (let k = 0; k < 6; k++) { // arched doors and windows in the base
  const t0 = Math.PI * (1.05 + k * 0.17), t1 = t0 + Math.PI / 6
  const p0: XY = [C[0] + 6.45 * Math.cos(t0), C[1] + 6.45 * Math.sin(t0)], p1: XY = [C[0] + 6.45 * Math.cos(t1), C[1] + 6.45 * Math.sin(t1)]
  onWall(win, p0, p1, [[0.9, 0.5], [2.4, 0.5], [2.4, 3.6], [1.65, 4.2], [0.9, 3.6]], 0.05)
}
revolve(slate, C, [[7.6, 6.0], [7.6, 6.4], [7.6, 7.2], [5.4, 7.2]], 12, Math.PI / 12, true, true) // the balcony gallery
revolve(stucco, C, [[5.6, 7.2], [4.9, 11.5], [3.95, 16.4]], 12, 0, false, false) // the tapering tower
revolve(green, C, [[4.0, 16.0], [4.25, 16.2], [4.25, 17.0], [3.9, 17.1]], 12, 0, false, false) // the green band
revolve(slate, C, [[4.6, 17.0], [4.6, 17.6], [4.3, 19.0], [3.3, 20.6], [1.8, 21.6], [0.05, 22.0]], 12, 0, false, false) // the bulging cap
for (let k = 0; k < 8; k++) { // windows up the tower
  const t = (k / 8) * Math.PI * 2 + 0.3, z = k % 2 ? 9.5 : 13.0, r = k % 2 ? 5.15 : 4.5
  const p0: XY = [C[0] + r * Math.cos(t - 0.12), C[1] + r * Math.sin(t - 0.12)], p1: XY = [C[0] + r * Math.cos(t + 0.12), C[1] + r * Math.sin(t + 0.12)]
  onWall(win, p0, p1, rectShape(0, Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), z, z + 1.4), 0.06)
}
// the dormer on the cap's south face
box(sail, C[0] - 1.1, C[0] + 1.1, C[1] - 4.6, C[1] - 3.2, 17.6, 19.4, slate, 0.1)

// ── The sails, on the south face: four lattice sails, a 23 m span ──
const HUB: V3 = [C[0], C[1] - 5.4, 17.6], LEN = 11.5, WID = 2.0, ANG = (32 * Math.PI) / 180 // turned as in p2
box(sail, HUB[0] - 0.35, HUB[0] + 0.35, HUB[1], C[1] - 3.0, HUB[2] - 0.35, HUB[2] + 0.35, sail, 0) // the shaft
for (let k = 0; k < 4; k++) {
  const a = ANG + (k * Math.PI) / 2, u = [Math.cos(a), Math.sin(a)], v = [-Math.sin(a), Math.cos(a)]
  const P = (s: number, w: number, d: number): V3 => [HUB[0] + u[0] * s + v[0] * w, HUB[1] - d, HUB[2] + u[1] * s + v[1] * w]
  // the stock (the spar) from the hub to the tip
  const bar = (s0: number, s1: number, w0: number, w1: number, d: number) => {
    // a bold rectangular bar, swept (double-sided) from s0 to s1
    sail.sweep([[P(s0, w0, d), P(s0, w1, d), P(s0, w1, d + 0.2), P(s0, w0, d + 0.2)], [P(s1, w0, d), P(s1, w1, d), P(s1, w1, d + 0.2), P(s1, w0, d + 0.2)]])
  }
  bar(0, LEN, -0.2, 0.2, 0.1) // the stock
  bar(2.4, LEN, 0.2, 0.42, 0.15) // the lattice's inner rail
  bar(2.4, LEN, WID - 0.22, WID, 0.15) // the outer rail
  for (let s = 2.4; s <= LEN + 0.01; s += (LEN - 2.4) / 4) bar(s - 0.11, s + 0.11, 0.2, WID, 0.15) // bold cross bars
  bar(2.4, LEN, WID * 0.55 - 0.08, WID * 0.55 + 0.08, 0.15) // a middle rail
}
await save('stl-bevo-mill', 'Bevo Mill', [
  { part: stucco, material: finish('stl-bevo-stucco', 0xece8de) },
  { part: stone, material: finish('stl-bevo-fieldstone', 0x8d7c69) },
  { part: slate, material: finish('stl-bevo-slate', 0x7f827e) },
  { part: sail, material: finish('stl-bevo-sails', 0xc29a8a) },
  { part: green, material: finish('stl-bevo-green', 0x5f8a77) },
  { part: win, material: PALETTE.window },
], { height: HUB[2] + LEN, anchor: [38.5819017, -90.2668386], bearing: 28 })
