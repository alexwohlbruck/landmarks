/**
 * Bay Wellington Tower, Brookfield Place, Toronto (1990-92, Bregman +
 * Hamann with Skidmore, Owings & Merrill) — original procedural geometry,
 * CC0-1.0.
 * bun generators/tor-bay-wellington-tower.ts
 *
 * Frame: x east-north-east +, y north-north-west +, z up, metres; origin at
 * the anchor on the ground. Bearing 343.3 (the Toronto street grid; the OSM
 * outline runs true in it). Anchor = area centroid of the tower's outline
 * OSM way/286525278: -79.3783477, 43.6473472.
 *
 * Only the tower. The Allen Lambert Galleria (way/205385072, its glass roof
 * way/949547300), the five-storey podium blocks around the tower's foot
 * (way/949547294, way/949547295, way/949547296, way/949547297) and the TD
 * Canada Trust Tower are separate OSM buildings and parts; the map keeps
 * drawing them.
 *
 * Identity (from the photos):
 *  1. A broad slab, 69 x 40 m, in pale granite with green-tinted windows,
 *     its corners notched and chamfered and the middle of each long face
 *     notched in a shallow V, so each long face reads as two.  (simonp, jkliu)
 *  2. The top steps in three times and splits into two square towers with
 *     chamfered corners, one over each half: the twin crowns.   (simonp, jkliu)
 *  3. A short mast on the west crown.                                (simonp)
 *
 * Plan: OSM, turned into this frame: way/340695625 (= the outline), then
 * way/340695623, way/340695624 (the stepped upper tiers), way/340695621 and
 * way/340695622 (the two towers), way/340695628 and way/340695627 (their
 * chamfered tops), way/340695626 (the small block between them).
 * Heights (no lidar in Canada):
 *  - published: 207 m, 49 storeys (Wikipedia, "Brookfield Place (Toronto)").
 *  - OSM: 169.6, 182.3, 195.0, the towers 208, their tops 212, the block
 *    between 195-199.3.
 *  - City of Toronto 3D Massing 2025 (https://open.toronto.ca/dataset/3d-massing/):
 *    179 (whole plan), 192.7, the towers 204.9, their tops 208.6. Used:
 *    OSM's lower tiers; the towers 205 and their tops 208.6 (the massing;
 *    OSM's 208/212 over-reads the published 207).
 *  - estimated from simonp: the mast, 0.7 m square (drawn bolder than the
 *    real one), 9 m above the west top, 2.5 m in from its west face.
 *  - ground: Mapterhorn z15 near flat (within 1 m); elevation 0.
 * Facade: windows in pairs in pale granite (jkliu); grouped here as
 * panels per 3.2 m bay, three storeys (12.6 m) a band.
 *
 * Colours: the granite pale warm grey, the glass green-tinted (jkliu),
 * pulled to the palette's lightness; the setbacks grey roof; the mast metal.
 * Night: the offices glow (window).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  simonp "Bay Wellington Tower.jpg", SimonP at English Wikipedia, CC BY-SA 3.0 —
 *         from Front Street (south): the twin crowns and the mast.
 *         https://commons.wikimedia.org/wiki/File:Bay_Wellington_Tower.jpg
 *  jkliu  "Brookfield Place 2025-05-24.jpg", JK Liu, CC BY-SA 4.0 — from
 *         high up to the north: the granite, the glass, the stepped top.
 *         https://commons.wikimedia.org/wiki/File:Brookfield_Place_2025-05-24.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: no licensed photo of the east and west faces; the mast's height
 * and place; the window grid is grouped, not the real paired windows.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, save, type XY } from './atl-flatiron-building'

const granite = new Part(), win = new Part(), roof = new Part(), mast = new Part()

const T0: XY[] = [[-34.22, -12.24], [-31.90, -14.38], [-28.88, -14.45], [-28.87, -17.42], [-25.78, -20.03], [-3.64, -19.99], [0.16, -16.29], [3.90, -20.05], [26.08, -19.97], [29.19, -16.38], [29.04, -13.85], [31.82, -13.93], [34.34, -11.36], [34.29, 12.30], [32.33, 14.40], [29.16, 14.44], [28.94, 18.28], [26.97, 19.86], [2.86, 19.84], [-0.03, 17.31], [-2.83, 19.88], [-27.26, 19.36], [-29.20, 16.92], [-29.35, 14.17], [-32.51, 14.29], [-34.49, 11.71]]
const T1: XY[] = [[-34.28, -7.29], [-28.97, -12.23], [-28.88, -14.45], [-26.96, -14.41], [-21.51, -20.06], [-7.66, -20.03], [-2.08, -14.10], [1.96, -14.33], [7.69, -20.02], [21.53, -19.97], [27.03, -13.93], [29.04, -13.85], [29.23, -12.17], [34.33, -7.22], [34.30, 8.19], [29.17, 12.74], [29.16, 14.44], [27.55, 14.39], [22.32, 19.85], [7.04, 19.84], [2.13, 14.62], [-2.43, 14.62], [-7.21, 19.79], [-22.72, 19.45], [-27.58, 14.24], [-29.35, 14.17], [-29.32, 12.50], [-34.45, 7.54]]
const T2: XY[] = [[-30.47, -7.33], [-27.00, -10.71], [-27.22, -12.46], [-24.58, -12.57], [-21.72, -15.69], [-6.61, -15.77], [-3.72, -12.25], [-1.95, -12.18], [-1.89, -10.69], [2.17, -10.85], [2.38, -12.43], [4.09, -12.33], [7.44, -15.60], [22.11, -15.62], [25.48, -12.25], [27.39, -12.22], [27.31, -10.46], [30.78, -7.27], [30.61, 7.36], [27.01, 11.08], [27.17, 12.39], [25.56, 12.34], [22.22, 15.92], [7.17, 15.98], [3.67, 12.64], [2.01, 12.69], [1.85, 11.15], [-1.88, 11.14], [-1.98, 12.83], [-3.70, 12.66], [-6.93, 16.12], [-22.08, 15.83], [-25.37, 12.45], [-27.40, 12.53], [-27.30, 10.60], [-30.57, 7.28]]
const WEST: XY[] = [[-26.82, -7.06], [-25.20, -8.53], [-23.48, -8.74], [-23.48, -10.52], [-22.28, -11.83], [-7.31, -11.78], [-6.01, -10.74], [-5.83, -8.60], [-3.94, -8.64], [-2.58, -7.16], [-2.25, 7.39], [-3.55, 8.61], [-5.81, 8.69], [-5.79, 10.80], [-7.07, 12.09], [-21.79, 12.21], [-23.41, 10.65], [-23.52, 8.72], [-25.20, 8.69], [-26.53, 7.58]]
const EAST: XY[] = [[2.57, -7.30], [4.18, -8.75], [6.01, -8.92], [6.10, -10.77], [7.44, -11.87], [22.17, -11.90], [23.47, -10.42], [23.59, -8.59], [25.25, -8.61], [26.74, -6.87], [26.53, 7.83], [25.50, 8.89], [23.46, 8.91], [23.42, 10.90], [21.96, 12.14], [7.15, 12.26], [5.84, 10.94], [5.74, 8.83], [3.53, 8.80], [2.46, 7.57]]
const EAST_TOP: XY[] = [[5.59, -6.19], [8.54, -9.09], [20.87, -9.07], [23.97, -5.71], [23.87, 6.49], [20.78, 9.29], [8.26, 9.14], [5.47, 6.14]]
const WEST_TOP: XY[] = [[-23.64, -6.28], [-20.67, -9.09], [-8.01, -8.88], [-5.22, -5.67], [-5.19, 6.61], [-8.18, 9.22], [-20.85, 9.12], [-23.72, 5.97]]
const MID: XY[] = [[-2.41, -2.74], [2.52, -2.75], [2.52, 2.36], [-2.42, 2.38]]

const H0 = 169.6, H1 = 182.3, H2 = 195.0, HT = 205, HTOP = 208.6, HMID = 199.3
const TIERS: [XY[], number, number][] = [
  [T0, 0, H0], [T1, H0, H1], [T2, H1, H2], [WEST, H2, HT], [EAST, H2, HT], [WEST_TOP, HT, HTOP], [EAST_TOP, HT, HTOP], [MID, H2, HMID],
]
for (const [ring, z0, z1] of TIERS) prism(granite, ring, z0 - (z0 ? 0.5 : 0), z1, roof, 0.4)

const pip = (p: XY, poly: XY[]) => {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
/** How high the masses standing in front of a wall point reach. */
const cover = (q: XY) => Math.max(0, ...TIERS.filter(([r]) => pip(q, r)).map(([, , h]) => h))

// Windows: one grid for the whole tower, bands of three storeys, bays of about 3.2 m.
const G = 12.6, GAP = 3.4, Z0 = 6.4
for (const [ring, z0, z1] of TIERS) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 2.4) continue
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
    const P = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * 0.06, a[1] + t[1] * s + n[1] * 0.06, z]
    const m = L < 5 ? 0.5 : 0.9, k = Math.max(1, Math.round((L - 2 * m) / 3.2)), w = (L - 2 * m) / k
    for (let j = 0; j < k; j++) {
      const s0 = m + j * w + 0.45, s1 = m + (j + 1) * w - 0.45, sm = (s0 + s1) / 2
      const lo = Math.max(z0, cover([a[0] + t[0] * sm + n[0] * 0.4, a[1] + t[1] * sm + n[1] * 0.4]))
      for (let g = 0; Z0 + g * G < z1; g++) {
        const za = Z0 + g * G + GAP / 2, zb = Math.min(Z0 + (g + 1) * G - GAP / 2, z1 - 1.2)
        if (za < lo + 0.4 || zb - za < 2.5) continue
        win.quad(P(s0, za), P(s1, za), P(s1, zb), P(s0, zb))
      }
      if (z0 === 0 && lo === 0) win.quad(P(s0, 0.4), P(s1, 0.4), P(s1, Z0 - 0.6), P(s0, Z0 - 0.6)) // lobby glazing
    }
  }
}

// The mast on the west top (simonp).
{
  const c: XY = [-21.0, 0.0], r = 0.35
  prism(mast, [[c[0] - r, c[1] - r], [c[0] + r, c[1] - r], [c[0] + r, c[1] + r], [c[0] - r, c[1] + r]], HTOP - 0.2, HTOP + 9, mast, 0.1)
}

if (import.meta.main) {
  await save('tor-bay-wellington-tower', 'Bay Wellington Tower', [
    { part: granite, material: finish('bwt-granite', 0xd9d3c8) },
    { part: win, material: { ...PALETTE.window, color: 0x7f9c98 } },
    { part: roof, material: PALETTE.roof },
    { part: mast, material: PALETTE.metal },
  ], { anchor: [43.6473472, -79.3783477], bearing: 343.3 }, 6500)
}
