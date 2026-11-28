/**
 * Wrigley Mansion, Phoenix (1929-1932, built for William Wrigley Jr.; now a
 * club and restaurant). Procedural, CC0-1.0, no textures.
 *   bun generators/phx-wrigley-mansion.ts
 *
 * Map frame: x across the house (bearing 62, ENE), y along it (bearing 332,
 * NNW), z up, metres; placed at bearing 332 (the OSM walls run 152/62 deg).
 * Anchor -112.0267140, 33.5228344, the centroid of OSM way/156733794 (the
 * house, "building=commercial" on the knoll south of the Arizona Biltmore),
 * replaces: way/156733794. Nothing else in OSM lies under it.
 *
 * Identity (photos below):
 *  1. White stucco walls stepping along the top of the knoll, two and three
 *     storeys, with low red clay-tile hip roofs over every wing.  (v2, t2, NAIP)
 *  2. The entrance court front: a long white wall with dark-shuttered
 *     windows, a carved stone door surround, a balcony.                  (v2)
 *  3. The north end over the hill: a long white wing with a band of big
 *     windows, on a grassed slope and a stone retaining wall.            (t1)
 *  4. The south-west wing set at an angle to the rest.                 (NAIP)
 *
 * The site: the knoll falls about 9 m from the house's south side to its
 * north tip (lidar ground: z 0 at the north tip, 7-9 under the main body);
 * z 0 is the lowest ground under the outline (lidar 396.5 m). Walls run down
 * to z 0 everywhere; windows start at each wing's own ground.
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020), 0.5 m grid,
 * read in this frame (z = lidar - 12 above ground_min). Measured: the main
 * body's roofs 15-17.5 (eaves drawn 14.5, ridge 17.5) over ground 7-9; the
 * middle block 12-13 (eaves 11, ridge 13.2); the north wing 6-8 (eaves 5.6,
 * ridge 8.2); the east terrace roof 8-10 (flat 8.5); the south-east wing 11
 * (eaves 10, ridge 12.2); the south-west wing 12-14 (eaves 11.5, ridge 14).
 * The open courtyard between the middle and east blocks is ground (z 7).
 * Estimated: the window rows and sizes (from v2 and t2), the roof pitches
 * (about 22 deg, from t2), the overhangs (0.6 m), the door surround.
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 *  v2  "Wrigley Mansion-2.jpg", Visitor7, CC BY-SA 3.0,
 *      https://commons.wikimedia.org/wiki/File:Wrigley_Mansion-2.jpg
 *      (the entrance court, from the south-east)
 *  t1  "Phoenix-Wrigley Mansion-1929-1.JPG", Tony the Marine (Marine 69-71),
 *      CC BY-SA 3.0,
 *      https://commons.wikimedia.org/wiki/File:Phoenix-Wrigley_Mansion-1929-1.JPG
 *      (the north end on the slope)
 *  t2  "Phoenix-Wrigley Mansion-1929-2.JPG", Tony the Marine, CC BY-SA 3.0,
 *      https://commons.wikimedia.org/wiki/File:Phoenix-Wrigley_Mansion-1929-2.JPG
 *      (along the entrance front, balcony and tile roofs)
 *  USGS NAIP orthophoto: the plan, every red tile roof, the white terraces.
 * No look-only sources. No commercial imagery.
 * Doubts: t1 shows a flat-roofed, curved glazed wing with arches that is
 * probably the west terrace by the south-west wing (NAIP shows a pale flat
 * roof there); it is drawn only as that wing's windows. The west side (among
 * trees) has no other photo; the many small roof
 * pieces of the real house are merged into one hip per wing.
 *
 * Night: windows glow; the entrance door is `entrance`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, ccw, prism, save, at, type XY } from './atl-flatiron-building'
import { onWall, rectShape } from './atl-tech-tower'

const ANCHOR = { lng: -112.026714, lat: 33.5228344 }, BEARING = 332
const stucco = new Part(), tile = new Part(), win = new Part(), flat = new Part(), door = new Part()

const OUTLINE: XY[] = ccw([[22.62, 38.20], [22.64, 23.76], [26.60, 23.45], [26.50, 19.46], [30.92, 19.25], [30.82, -0.31], [25.54, -0.47], [25.63, -3.59], [25.35, -7.13], [20.66, -13.90], [19.11, -13.06], [12.77, -21.79], [10.50, -19.78], [7.60, -16.49], [5.88, -12.63], [5.05, -8.63], [-8.52, -8.42], [-10.34, -9.20], [-20.11, -11.33], [-20.25, -10.96], [-28.10, -15.58], [-28.64, -15.08], [-42.60, -22.48], [-48.37, -25.82], [-53.00, -17.94], [-48.22, -15.01], [-51.59, -8.95], [-51.55, -7.32], [-50.56, -6.38], [-39.63, -0.15], [-40.35, 1.46], [-26.90, 9.09], [-26.12, 7.57], [-23.95, 7.76], [-24.28, 8.42], [-10.89, 12.70], [-10.91, 15.45], [-0.41, 15.40], [-0.41, 22.05], [4.06, 22.04], [4.04, 38.29]])

// the low base: every wall of the outline up to 5.6 (the north wing's eaves);
// no roof of its own: the wings and the courtyard floor cover it
prism(stucco, OUTLINE, 0, 5.6, null, 0)

/**
 * A wing: a rectangle centred at c, its length along angle `a` (radians from
 * +x), walls from 0 to `eave`, a hip roof of clay tile to `ridge` with an
 * overhang; windows in rows from the wing's own ground `g`.
 */
function wing(c: XY, a: number, L: number, W: number, eave: number, ridge: number | null, g: number, rows: { bay: number; skip?: number[] } = { bay: 3.6 }) {
  const u: XY = [Math.cos(a), Math.sin(a)], v: XY = [-u[1], u[0]]
  const P = (s: number, t: number): XY => [c[0] + u[0] * s + v[0] * t, c[1] + u[1] * s + v[1] * t]
  const ring: XY[] = [P(-L / 2, -W / 2), P(L / 2, -W / 2), P(L / 2, W / 2), P(-L / 2, W / 2)]
  prism(stucco, ring, 0, eave, ridge === null ? flat : null, ridge === null ? 0.25 : 0)
  // windows: one punched window per bay per storey, from the wing's ground
  for (let i = 0; i < 4; i++) {
    const A = ring[i], B = ring[(i + 1) % 4], len = Math.hypot(B[0] - A[0], B[1] - A[1])
    const n = Math.max(1, Math.floor((len - 2) / rows.bay))
    for (let k = 0; k < n; k++) {
      if (rows.skip?.includes(i * 100 + k)) continue
      const s = 1 + (len - 2) * ((k + 0.5) / n)
      for (let z = g + 0.9; z + 1.9 < eave - 0.4; z += 3.3) onWall(win, A, B, rectShape(s - 0.65, s + 0.65, z, z + 1.9), 0.05)
    }
  }
  if (ridge === null) return ring
  const o = 0.6, h = Math.min(L, W) / 2 + o
  const Q = (s: number, t: number, z: number): V3 => { const p = P(s, t); return [p[0], p[1], z] }
  const s0 = -L / 2 - o, s1 = L / 2 + o, t0 = -W / 2 - o, t1 = W / 2 + o
  const a0 = Q(s0, t0, eave), b0 = Q(s1, t0, eave), c0 = Q(s1, t1, eave), d0 = Q(s0, t1, eave)
  if (L >= W) {
    const r0 = Q(s0 + h, 0, ridge), r1 = Q(s1 - h, 0, ridge)
    tile.quad(a0, b0, r1, r0); tile.quad(c0, d0, r0, r1); tile.tri(b0, c0, r1); tile.tri(d0, a0, r0)
  } else {
    const r0 = Q(0, t0 + h, ridge), r1 = Q(0, t1 - h, ridge)
    tile.quad(b0, c0, r1, r0); tile.quad(d0, a0, r0, r1); tile.tri(a0, b0, r0); tile.tri(c0, d0, r1)
  }
  const eaveRing: XY[] = [P(s0, t0), P(s1, t0), P(s1, t1), P(s0, t1)]
  tile.loft([at(eaveRing, eave - 0.25), at(eaveRing, eave)])
  capPoly(tile, eaveRing, eave - 0.25, false)
  return ring
}

const X = 0
// the main body: three storeys on the court side, the long hip
wing([-1.5, -1.5], X, 53, 18, 14.5, 17.5, 7, { bay: 3.8, skip: [5, 6] })
// the middle block north of it, and its link to the north wing
wing([-1, 10.5], X, 19, 9, 11, 13.2, 5)
wing([1.8, 18.6], X, 4.4, 7.2, 11, 12.8, 4, { bay: 3 })
// the north wing over the slope: a long band of big windows (t1)
{
  const ring = wing([13.3, 30.2], Math.PI / 2, 16, 18.6, 5.6, 8.2, 1, { bay: 99 })
  for (let i = 0; i < 4; i++) {
    const A = ring[i], B = ring[(i + 1) % 4], len = Math.hypot(B[0] - A[0], B[1] - A[1])
    const n = Math.floor((len - 2) / 3.4)
    for (let k = 0; k < n; k++) { const s = 1 + (len - 2) * ((k + 0.5) / n); onWall(win, A, B, rectShape(s - 1.3, s + 1.3, 1.6, 4.4), 0.05) }
  }
}
// the east terrace block: flat roof, a low parapet
wing([27.7, 9.5], X, 6.4, 19.6, 8.5, null, 4, { bay: 3.4 })
// the courtyard floor, at its ground
prism(flat, ccw([[5, 1], [22, 1], [22, 22.5], [5, 22.5]]), 5.6, 7.2, flat, 0)
// the south-east wing
wing([15, -12], (-55 * Math.PI) / 180, 14, 11, 10, 12.2, 7, { bay: 3.4 })
// the south-west wing, set at an angle
wing([-41, -11.5], (208 * Math.PI) / 180, 25, 13.5, 11.5, 14, 6.5, { bay: 3.6 })

// the entrance (v2): a stone surround and the door on the court front,
// the south face of the main body
{
  const A: XY = [-28, -10.5], B: XY = [25, -10.5]
  onWall(flat, A, B, rectShape(19.6, 24.4, 7, 12.4), 0.08)
  onWall(door, A, B, rectShape(20.8, 23.2, 7, 10.4), 0.14)
}
// chimneys
for (const [x, y, top] of [[-12, -1.5, 19.3], [9, -6, 18.8], [-3, 12, 14.8]] as [number, number, number][]) prism(stucco, ccw([[x - 0.8, y - 0.6], [x + 0.8, y - 0.6], [x + 0.8, y + 0.6], [x - 0.8, y + 0.6]]), 12, top, stucco, 0.1)

await save('phx-wrigley-mansion', 'Wrigley Mansion', [
  { part: stucco, material: { ...finish('wrigley-stucco', 0xf2ede4), floodlight: (p, n) => (n[2] < 0.5 && p[2] > 5 ? 0.4 : 0) } },
  { part: tile, material: finish('wrigley-tile', 0xc0715a) },
  { part: win, material: { ...PALETTE.window, color: 0x56697c } },
  { part: flat, material: finish('wrigley-terrace', 0xddd6ca) },
  { part: door, material: { ...PALETTE.entrance, color: 0x6e5a48 } },
], { height: 19.3, anchor: [ANCHOR.lat, ANCHOR.lng], bearing: BEARING }, 5000)
