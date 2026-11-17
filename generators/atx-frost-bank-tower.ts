/**
 * Frost Bank Tower, 401 Congress Avenue, Austin (2003, Duda/Paine Architects
 * with HKS) — original procedural geometry, CC0-1.0.
 * bun generators/atx-frost-bank-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 17.7: the model's axes follow Austin's street grid
 * (Congress Avenue runs along y). Anchor = area centroid of OSM
 * way/37546502 ("Frost Bank Tower", 33 levels, height 157), -97.7427211,
 * 30.2663845. The outline covers the whole block's building: the tower and
 * its parking podium (the Mexic-Arte Museum corner is a separate way and is
 * left alone).
 *
 * Identity (from the photos):
 *  1. The crown: a cluster of steep pointed glass spires, so that every face
 *     shows two tall "ears" with a V between them (the "owl"), over sloped
 *     glass shoulders. Lit white at night.
 *  2. A square tower whose four faces each carry a central bay that rises
 *     past the corners to the crown, with the Frost sunburst logo at its top
 *     (128 m, the highest logo in the city).
 *  3. Corners that step back up the tower and then chamfer, in sloped
 *     glass facets, into the bays and the crown.
 *  4. Silvery-blue reflective glass all over, with pale mullion lines.
 *
 * Evidence:
 *  - plan: OSM way/37546502 for the podium. The tower itself is not split
 *    out in OSM; it is placed from the lidar: a 42 m square centred at
 *    (-10.4, -2.5) in this frame, with a 24 m central bay on each face, 2 m
 *    proud below 104 m, and a lower wing on the east side.
 *  - heights: USGS 3DEP lidar USGS_LPC_TX_Central_B1_2017 (2017 flight),
 *    1 m grid, read in the frame with tools/lidar_frame.py, less 1 m for the
 *    ground (Mapterhorn: the block is within 1 m of flat). Measured: the
 *    central bays' tops 127 m; the corners at 96 m; the bays' projecting
 *    lower parts 104 m; the east wing 72 and 80 m; spire tips 155-159 m,
 *    four of them about 10 m apart round the centre; the crown's base about
 *    137 m; the podium 32 m, with a 20 m strip on the west.
 *  - published: 515 ft (157 m) roof, 33 storeys (Wikipedia, "Frost Bank
 *    Tower"; OSM height 157); logo at 420 ft (128 m).
 *  - estimated from the photos: the corner setbacks at 60 and 80 m (the
 *    lidar sees only the top of each corner), the shoulder slopes, the
 *    logo's size (about 6 m) and the floor-line spacing.
 *  - colours: the bright reflective blue glass, the pale crown and white logo, from the
 *    daylight photos; the podium's buff precast from "dad2".
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  dad1  "Frost Bank Tower - Austin, Texas - DSC08342.jpg", Daderot, CC0
 *        (from 6th Street, north-east) https://commons.wikimedia.org/wiki/File:Frost_Bank_Tower_-_Austin,_Texas_-_DSC08342.jpg
 *  dad2  "Frost Bank Tower - Austin, Texas - DSC08325.jpg", Daderot, CC0
 *        https://commons.wikimedia.org/wiki/File:Frost_Bank_Tower_-_Austin,_Texas_-_DSC08325.jpg
 *  lsm   "FrostBankTower-Jul2010-a.JPG", LoneStarMike, CC BY-SA 3.0 (a face
 *        and the crown at dusk) https://commons.wikimedia.org/wiki/File:FrostBankTower-Jul2010-a.JPG
 *  hans  "Frost Bank Tower Austin.jpg", HanFSolo, CC BY-SA 3.0
 *        https://commons.wikimedia.org/wiki/File:Frost_Bank_Tower_Austin.jpg
 *  high  "The upper reaches of Frost Bank Tower ... LCCN2014631900.tif",
 *        Carol M. Highsmith, public domain (the crown at night)
 *  cmbj  "Frostbanktoweraustintx.jpg", CMBJ, CC BY-SA 2.5 (from below)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the corner setbacks below 96 m are read off oblique photos. The
 * crown's many small facets are reduced to one connected set: chamfered
 * flank facets from 96 to 127 m, a sloped gable on each bay top, and four
 * spires; the real crown steps through more, smaller facets. The podium's facades are drawn plainly.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, prism, save, type XY } from './atl-flatiron-building'
import { quadOut, triOut, wallBand } from './atx-google-tower'

const glass = new Part(), crown = new Part(), logo = new Part(), trim = new Part(), roof = new Part(), podium = new Part()

const C: XY = [-10.4, -2.5] // the tower's centre
const HALF = 21, ARM = 12 // body half-width; central bay half-width
const Zc = 96, Zb = 104, Zt = 127, TIP = 157

// ─────────────────────────────── the podium ────────────────────────────────
// OSM way/37546502 in the frame (the outline, including the tower's footprint).
const OUTLINE: XY[] = [[-48.05, -30.9], [5.62, -30.58], [55.68, -30.3], [55.58, 21.49], [5.92, 21.2], [0.52, 21.17], [0.5, 38.57], [-35.16, 38.43], [-48.17, 38.39], [-48.15, 26.38], [-48.13, 17.81], [-48.12, 8.99]]
const WEST = -40.4 // the low west strip, 20 m
{
  const main: XY[] = [[WEST, -30.85], [5.62, -30.58], [55.68, -30.3], [55.58, 21.49], [5.92, 21.2], [0.52, 21.17], [0.5, 38.57], [WEST, 38.45]]
  const west: XY[] = [[-48.05, -30.9], [WEST, -30.85], [WEST, 38.45], [-48.17, 38.39]]
  prism(podium, main, 0, 32, roof, 0.4)
  prism(podium, west, 0, 20, roof, 0.4)
  // the garage's openings: long dark bands on the street faces
  const bands = (ring: XY[], top: number) => {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      for (let z = 4; z < top - 3; z += 6.5) wallBand(glass, a, b, z, z + 3.2, 0.06, 1.5)
    }
  }
  bands(main, 32); bands(west, 20)
  void OUTLINE
}

// ─────────────────────────────── the tower ─────────────────────────────────
const sq = (h: number, notch = 0): XY[] => {
  const [cx, cy] = C
  if (notch <= 0) return [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]]
  const n = notch
  return [
    [cx - h + n, cy - h], [cx + h - n, cy - h], [cx + h - n, cy - h + n], [cx + h, cy - h + n],
    [cx + h, cy + h - n], [cx + h - n, cy + h - n], [cx + h - n, cy + h], [cx - h + n, cy + h],
    [cx - h + n, cy + h - n], [cx - h, cy + h - n], [cx - h, cy - h + n], [cx - h + n, cy - h + n],
  ]
}

// The body: full square to 60 m, corners notched 3 m to 96 m.
prism(glass, sq(HALF), 32, 60, roof, 0.3)
prism(glass, sq(HALF, 3), 60, 80, roof, 0.3)
prism(glass, sq(HALF, 3), 80, Zc, null, 0)
// The central bays' projecting lower parts, 2 m proud, to 104 m.
const [cx, cy] = C
const bays: XY[][] = [
  [[cx - ARM, cy - HALF - 2], [cx + ARM, cy - HALF - 2], [cx + ARM, cy - HALF], [cx - ARM, cy - HALF]],
  [[cx + HALF, cy - ARM], [cx + HALF + 2, cy - ARM], [cx + HALF + 2, cy + ARM], [cx + HALF, cy + ARM]],
  [[cx - ARM, cy + HALF], [cx + ARM, cy + HALF], [cx + ARM, cy + HALF + 2], [cx - ARM, cy + HALF + 2]],
  [[cx - HALF - 2, cy - ARM], [cx - HALF, cy - ARM], [cx - HALF, cy + ARM], [cx - HALF - 2, cy + ARM]],
]
for (const b of bays) prism(glass, b, 32, Zb, roof, 0.3)
// The east wing: 72 m, its middle 80 m.
prism(glass, [[cx + HALF + 2, cy - 19], [cx + HALF + 10, cy - 19], [cx + HALF + 10, cy + 19], [cx + HALF + 2, cy + 19]], 32, 72, roof, 0.3)
prism(glass, [[cx + HALF + 2, cy - ARM], [cx + HALF + 10, cy - ARM], [cx + HALF + 10, cy + ARM], [cx + HALF + 2, cy + ARM]], 72, 80, roof, 0.3)

// Above 96 m: the cross of the four central bays, to 127 m.
const CROSS: XY[] = [
  [cx - ARM, cy - HALF], [cx + ARM, cy - HALF], [cx + ARM, cy - ARM], [cx + HALF, cy - ARM],
  [cx + HALF, cy + ARM], [cx + ARM, cy + ARM], [cx + ARM, cy + HALF], [cx - ARM, cy + HALF],
  [cx - ARM, cy + ARM], [cx - HALF, cy + ARM], [cx - HALF, cy - ARM], [cx - ARM, cy - ARM],
]
// 96 to 127 m: a faceted transition from the notched square to the cross.
// Each bay face stays vertical, narrowing from 36 to 24 m as its flanks
// chamfer back; over each corner the flanks become sloped glass facets
// rising to the cross's inner corner. One connected surface, no loose
// pieces (the photos' "shoulders").
{
  const r0 = sq(HALF, 3), r1 = CROSS
  for (let i = 0; i < 12; i++) {
    const j = (i + 1) % 12
    const A: V3 = [...r0[i], Zc] as V3, B: V3 = [...r0[j], Zc] as V3, Cc: V3 = [...r1[j], Zt] as V3, D: V3 = [...r1[i], Zt] as V3
    const m0: XY = [(r0[i][0] + r0[j][0]) / 2 - cx, (r0[i][1] + r0[j][1]) / 2 - cy]
    const vertical = i % 3 === 0 // the four bay faces
    const part = vertical ? glass : crown
    quadOut(part, A, B, Cc, D, [m0[0], m0[1], vertical ? 0 : 0.6])
  }
  capPoly(roof, CROSS, Zt, true)
}

// Above 127 m: on each arm a sloped glass gable rising back from the bay top
// into the spires, and four steep pyramidal spires, one on each quarter of
// the 24 m centre, to 157 m; from every side two of them stand up as the
// "ears", with the logo between them.
for (let k = 0; k < 4; k++) {
  const ang = (k * Math.PI) / 2, u: XY = [Math.cos(ang), Math.sin(ang)], v: XY = [-u[1], u[0]]
  const P = (along: number, out: number, z: number): V3 => [cx + v[0] * along + u[0] * out, cy + v[1] * along + u[1] * out, z]
  const A = P(-ARM, HALF, Zt), B = P(ARM, HALF, Zt), Cc = P(8, 9, 137), D = P(-8, 9, 137)
  quadOut(crown, A, B, Cc, D, [u[0], u[1], 0.8])
  triOut(crown, B, P(ARM, 9, Zt), Cc, [v[0], v[1], 0.3])
  triOut(crown, A, D, P(-ARM, 9, Zt), [-v[0], -v[1], 0.3])
}
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as [number, number][]) {
  const qc: XY = [cx + sx * ARM / 2, cy + sy * ARM / 2]
  const apex: V3 = [cx + sx * 5, cy + sy * 5, TIP]
  const base: XY[] = [[qc[0] - ARM / 2, qc[1] - ARM / 2], [qc[0] + ARM / 2, qc[1] - ARM / 2], [qc[0] + ARM / 2, qc[1] + ARM / 2], [qc[0] - ARM / 2, qc[1] + ARM / 2]]
  for (let i = 0; i < 4; i++) {
    const a = base[i], b = base[(i + 1) % 4]
    const m: XY = [(a[0] + b[0]) / 2 - qc[0], (a[1] + b[1]) / 2 - qc[1]]
    triOut(crown, [...a, Zt] as V3, [...b, Zt] as V3, apex, [m[0], m[1], 0.4])
  }
}
// A light mullion grid on the body: floor lines every three storeys round
// the shaft and across the bays.
for (let z = 44; z < Zc; z += 12) {
  const ring = z < 60 ? sq(HALF) : sq(HALF, 3)
  for (let i = 0; i < ring.length; i++) wallBand(trim, ring[i], ring[(i + 1) % ring.length], z, z + 0.5, 0.06, 0)
  for (const b of bays) for (let i = 0; i < 4; i++) wallBand(trim, b[i], b[(i + 1) % 4], z, z + 0.5, 0.06, 0)
}
// The bay tops: a parapet on each face carrying the logo.
const faces: [XY, XY][] = [
  [[cx - ARM, cy - HALF], [cx + ARM, cy - HALF]], [[cx + HALF, cy - ARM], [cx + HALF, cy + ARM]],
  [[cx + ARM, cy + HALF], [cx - ARM, cy + HALF]], [[cx - HALF, cy + ARM], [cx - HALF, cy - ARM]],
]
for (const [a, b] of faces) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  // parapet: 10 m wide, 127 to 134 m, its face flush with the bay
  const p0: XY = [m[0] - t[0] * 5, m[1] - t[1] * 5], p1: XY = [m[0] + t[0] * 5, m[1] + t[1] * 5]
  const q0: XY = [p0[0] - n[0] * 1, p0[1] - n[1] * 1], q1: XY = [p1[0] - n[0] * 1, p1[1] - n[1] * 1]
  prism(crown, [p0, p1, q1, q0].reverse() as XY[], Zt, 134, crown, 0.2)
  // the sunburst logo: a disc 6 m across on the parapet's face
  const R = 3.4, zc = 130.6, o = 0.08, seg = 14
  for (let i = 0; i < seg; i++) {
    const a0 = (i / seg) * Math.PI * 2, a1 = ((i + 1) / seg) * Math.PI * 2
    const P = (ang: number, r: number): V3 => [m[0] + t[0] * Math.cos(ang) * r + n[0] * o, m[1] + t[1] * Math.cos(ang) * r + n[1] * o, zc + Math.sin(ang) * r]
    triOut(logo, P(0, 0), P(a0, R), P(a1, R), [n[0], n[1], 0])
  }
  // pale mullion lines: the bay's edges and two lines inside it, 32 to 127 m
  for (const s of [-ARM + 0.3, -4, 4, ARM - 0.3]) {
    const A: XY = [m[0] + t[0] * (s - 0.3), m[1] + t[1] * (s - 0.3)], B: XY = [m[0] + t[0] * (s + 0.3), m[1] + t[1] * (s + 0.3)]
    const off = Math.abs(s) > ARM - 1 ? 0 : 2
    // the projecting lower part stands 2 m further out
    const lift = (q: XY, d: number): XY => [q[0] + n[0] * d, q[1] + n[1] * d]
    wallBand(trim, lift(A, off), lift(B, off), 33, Zb - 0.6, 0.06)
    wallBand(trim, A, B, Zb, Zt - 0.6, 0.06)
  }
}
void capPoly

if (import.meta.main) {
  await save('atx-frost-bank-tower', 'Frost Bank Tower', [
    { part: glass, material: { ...PALETTE.window, color: 0x86afd6 } },
    { part: crown, material: finish('neon-frost-crown', 0xc9dde6, 0.3) },
    { part: logo, material: finish('neon-frost-logo', 0xf6f2e6, 0.5) },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: podium, material: finish('frost-precast', 0xe2d6c0) },
  ], { bearing: 17.7, height: TIP, replaces: ['way/37546502'] })
}
