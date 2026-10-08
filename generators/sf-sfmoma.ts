/**
 * San Francisco Museum of Modern Art: Mario Botta's 1995 building on 3rd
 * Street, its stepped brick blocks round the black-and-white striped cylinder
 * cut at a slant into the oculus skylight, and behind it Snøhetta's 2016
 * expansion, a long white rippled block rising to ten storeys. Original
 * procedural geometry, CC0-1.0.
 * bun generators/sf-sfmoma.ts
 *
 * Frame: BEARING 45, turned to the South of Market grid: x runs south-east
 * along 3rd Street (towards Howard Street), y north-east away from it (the
 * Botta front faces -y, across 3rd Street to Yerba Buena Gardens). Origin =
 * area centroid of the OSM outline way/41692824. y = 0 is the street on the
 * museum's north-east side, 7.95 m NAVD88; 3rd Street runs about 1 m higher.
 * A loading ramp at the north-west corner dips 2.6 m lower and is left to the
 * map.
 *
 * Evidence
 * - OSM way/41692824 (the whole museum, architect Mario Botta, 7 levels) and
 *   its parts: way/1365384415 (Botta's blocks), 1365384410 (the cylinder,
 *   radius 9.6), 1365384412, 1365384413, 1365384414 (the blocks behind it),
 *   1365384411 (the Snøhetta expansion), 1365384416 (its two-storey strip on
 *   Natoma Street).
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.5 m in this frame
 *   (/tmp/city/sf/work/sf-sfmoma): Botta's front block 13.9 m above the datum,
 *   the brick trunk under the cylinder 16.7, the two side blocks 24.2, the
 *   block behind the cylinder 38; the cylinder's cut rising at 45 degrees from
 *   26.6 at its front edge to 45.8 at its back. The expansion: a ridge at 53.7
 *   over its north-west third rising to 62.3 from x = 10 on; a notch at 46.8
 *   on its Botta side; the north-east side stepping down to 45.8 / 39.8, then
 *   38.5 / 31.5 / 24.4; the north-west end rounding over from 31.7 to 55.
 * - Published (Wikipedia; SFMOMA): Botta building 1995, expansion by Snøhetta
 *   2016, ten storeys, clad in white fibre-reinforced polymer panels in
 *   rippling horizontal bands, with long ribbon windows.
 * - Photos (Wikimedia Commons): "2017 SFMOMA from Yerba Buena Gardens.jpg"
 *   (Beyond My Ken, CC BY-SA 4.0, the Botta front square on with the expansion
 *   behind: the lower brick wings, the upper blocks with dark recesses beside
 *   the cylinder, the striped trunk and cylinder, the radial stripes round the
 *   skylight); "San Francisco Museum of Modern Art, San Francisco.jpg"
 *   (Supercarwaar, CC BY-SA 4.0) and "San Francisco Museum of Modern Art
 *   Building.jpg" (Minette Lontsie, CC BY-SA 4.0), both with the expansion's
 *   white rippled wall and ribbon windows; "San Francisco Museum of Modern
 *   Art Full.jpg" (Vincent Bloch, public domain) and "San Francisco Museum of
 *   Modern Art.JPG" (Kjetil Ree, CC BY-SA 3.0), the Botta front before 2016;
 *   Openverse/Flickr "@snohetta's SFMOMA extension..." (diametrik, CC BY 2.0,
 *   the expansion's long side with its ribbon windows and ripples).
 *
 * Estimated from the photos: the stripe width (drawn 1.2 m, broader than the
 * real ones so they hold at map scale), the dark recesses beside the
 * cylinder, the skylight ring's 24 radial stripes, the expansion's ribbon
 * windows (positions and lengths) and its ripples (drawn as two shallow
 * horizontal swells), the bevel on its top edges.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { walls, type XY } from './sf-opera-house'
import { ccw, earcut, report } from './sf-de-young'

const BEARING = 45
const ANCHOR = { lng: -122.40066029, lat: 37.78589533 }

const brick = new Part(), dark = new Part(), white = new Part(), win = new Part(), glass = new Part(), roof = new Part()

/** A prism over a ring with a roof. */
function prism(wall: Part, top: Part | null, ring0: XY[], z0: number, z1: number) {
  const r = ccw(ring0)
  walls(wall, r, z0, z1)
  if (top) for (const [i, j, k] of earcut(r)) top.tri([r[i][0], r[i][1], z1], [r[j][0], r[j][1], z1], [r[k][0], r[k][1], z1])
}
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
/** A panel on a vertical face at y = const facing -y (the street side), between x0..x1, z0..z1. */
const faceS = (p: Part, y: number, x0: number, x1: number, z0: number, z1: number) => p.quad([x0, y - 0.06, z0], [x1, y - 0.06, z0], [x1, y - 0.06, z1], [x0, y - 0.06, z1])
const faceN = (p: Part, y: number, x0: number, x1: number, z0: number, z1: number) => p.quad([x1, y + 0.06, z0], [x0, y + 0.06, z0], [x0, y + 0.06, z1], [x1, y + 0.06, z1])

// ---------------------------------------------------------------------------
// Botta's building

const FRONT = -45.6, BACK = 3.3, X0 = -42.5, X1 = 22.5
const CYL: XY = [-10.2, -14.4], CR = 9.2
const cut = (y: number) => 35.9 + (y - CYL[1]) // the cylinder's top: a plane rising 45 degrees to the back

// Three brick tiers stepping back from 3rd Street (lidar; the full front in
// "San Francisco Museum of Modern Art Full.jpg"): the lower tier across the
// whole front, with a slot window over the entrance; the middle tier in two
// blocks either side of the striped trunk; the top tier, two blocks flanking
// the cylinder with black recesses beside it.
prism(brick, roof, rect(X0, FRONT, X1, -37), 0, 13.9)
faceS(win, FRONT, -12.1, -10.6, 3, 12.6) // the slot window
faceS(win, FRONT, -19, -3.5, 0, 2.8) // the entrance
prism(brick, roof, rect(X0, -37, -15.4, BACK), 0, 24.2)
prism(brick, roof, rect(-7.3, -37, X1, BACK), 0, 24.2)
prism(brick, roof, rect(-32, -10.8, -22.1, BACK), 0, 38.8)
prism(brick, roof, rect(1.7, -10.8, 12, BACK), 0, 38.8)
prism(dark, roof, rect(-22.1, -8, -18.7, BACK), 0, 38.8)
prism(dark, roof, rect(-1.7, -8, 1.7, BACK), 0, 38.8)
prism(brick, roof, rect(-18.7, -5, -1.7, BACK), 0, 38.8) // behind the cylinder

// The striped trunk under the cylinder, from the entrance up to it
{
  const x0 = -15.4, x1 = -7.3, y0 = -37, y1 = -22.5
  const STRIPE = 1.2
  for (let z = 13.9, k = 0; z < 16.7 - 1e-6; z += STRIPE, k++) {
    const zz = Math.min(16.7, z + STRIPE), p = k % 2 ? dark : white
    // front and both sides
    p.quad([x0, y0, z], [x1, y0, z], [x1, y0, zz], [x0, y0, zz])
    p.quad([x1, y0, z], [x1, y1, z], [x1, y1, zz], [x1, y0, zz])
    p.quad([x0, y1, z], [x0, y0, z], [x0, y0, zz], [x0, y1, zz])
  }

  white.quad([x0, y0, 16.7], [x1, y0, 16.7], [x1, y1, 16.7], [x0, y1, 16.7])
}

// The cylinder: horizontal black and white stripes up to the slanted cut,
// then the skylight in the cut, ringed with radial stripes.
{
  const SEG = 32, STRIPE = 1.2, zBase = 13.9
  const ang = (i: number) => (2 * Math.PI * i) / SEG
  const at = (t: number, r: number, z: number): V3 => [CYL[0] + r * Math.cos(t), CYL[1] + r * Math.sin(t), z]
  for (let i = 0; i < SEG; i++) {
    const t0 = ang(i), t1 = ang(i + 1)
    const top0 = cut(CYL[1] + CR * Math.sin(t0)), top1 = cut(CYL[1] + CR * Math.sin(t1))
    const n0: V3 = [Math.cos(t0), Math.sin(t0), 0], n1: V3 = [Math.cos(t1), Math.sin(t1), 0]
    for (let z = zBase, k = 0; z < Math.max(top0, top1) - 1e-6; z += STRIPE, k++) {
      const p = k % 2 ? dark : white
      const za0 = Math.min(z, top0), za1 = Math.min(z, top1), zb0 = Math.min(z + STRIPE, top0), zb1 = Math.min(z + STRIPE, top1)
      if (zb0 - za0 < 1e-4 && zb1 - za1 < 1e-4) continue
      const A = at(t0, CR, za0), B = at(t1, CR, za1), C = at(t1, CR, zb1), D = at(t0, CR, zb0)
      p.tri(A, B, C, undefined, undefined, undefined, [n0, n1, n1])
      p.tri(A, C, D, undefined, undefined, undefined, [n0, n1, n0])
    }
  }
  // the cut face: an ellipse in the slanted plane, a striped ring round the skylight
  const RING = 0.72 // the skylight's radius as a fraction of the cylinder's
  for (let i = 0; i < SEG; i++) {
    const t0 = ang(i), t1 = ang(i + 1)
    const P = (t: number, f: number): V3 => { const p = at(t, CR * f, 0); return [p[0], p[1], cut(p[1]) + 0.02] }
    ;(i % 2 ? dark : white).quad(P(t0, RING), P(t0, 1), P(t1, 1), P(t1, RING))
    glass.tri(P(t0, RING), P(t1, RING), [CYL[0], CYL[1], cut(CYL[1]) + 0.02])
  }
}

// ---------------------------------------------------------------------------
// The Snøhetta expansion

const EY0 = 3.2
/** Its north-east edge, which bows out a little towards Natoma Street (OSM). */
const NE = (x: number) => { const pts: XY[] = [[-42, 31.1], [-27, 32.5], [-15, 33.3], [0, 34.2], [7, 34.1], [27, 33.5], [46, 31.6], [66, 29.7]]; for (let i = 0; i < pts.length - 1; i++) if (x <= pts[i + 1][0]) { const [a, b] = [pts[i], pts[i + 1]]; return a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0]) } return 29.7 }
const RIDGE = (x: number) => (x <= -12 ? 53.7 : x >= 10 ? 62.3 : 53.7 + ((x + 12) / 22) * 8.6)
// Stations along x; at each, the cross-section from the Botta side to Natoma Street.
const XS = [-41.5, -40, -38, -36, -28, -12, 4, 8, 10, 26, 34, 58, 60, 66]
function section(x: number): [number, number][] {
  const ne = NE(x), r = RIDGE(x)
  // the north-west end rounds over: the last few metres are capped lower
  const capZ = x <= -41.5 ? 31.7 : x <= -40 ? 40 : x <= -38 ? 48 : Infinity
  const front = x >= -28 && x <= 4 ? 46.8 : r
  const t1 = x < 6 ? 45.8 : 39.8
  const t2 = x < -18 ? 31.5 : x <= 30 ? 38.5 : 24.4
  const s: [number, number][] = [
    [EY0, 0], [EY0, front - 1.5], [EY0 + 1.5, front], [EY0 + 4, front], [EY0 + 4.1, r - 1.5], [EY0 + 5.6, r],
    [ne - 9, r], [ne - 7.5, r - 1.5], [ne - 7, t1], [ne - 3.5, t1], [ne - 3.4, t2], [ne, t2], [ne, 0],
  ]
  return s.map(([y, z]) => [y, Math.min(z, capZ)])
}
{
  const secs = XS.map((x) => section(x))
  const n = secs[0].length
  for (let k = 0; k < XS.length - 1; k++) {
    const a = secs[k], b = secs[k + 1], xa = XS[k], xb = XS[k + 1]
    for (let i = 0; i < n - 1; i++) {
      const A: V3 = [xa, a[i][0], a[i][1]], B: V3 = [xb, b[i][0], b[i][1]], C: V3 = [xb, b[i + 1][0], b[i + 1][1]], D: V3 = [xa, a[i + 1][0], a[i + 1][1]]
      // the profile runs from the Botta side up, over and down: these face outwards
      const flat = Math.abs(a[i][1] - a[i + 1][1]) < 0.01 && a[i][1] > 0
      ;(flat ? roof : white).quad(A, B, C, D)
    }
  }
  // the end walls
  for (const [k, sgn] of [[0, -1], [XS.length - 1, 1]] as [number, number][]) {
    const s = secs[k], x = XS[k]
    const r = ccw(s.map(([y, z]) => [y, z] as XY))
    for (const [i, j, l] of earcut(r)) {
      const P = (q: XY): V3 => [x, q[0], q[1]]
      // orient by the face normal's x component
      const a = r[i], b = r[j], c = r[l]
      const nx = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) // > 0 for ccw in (y, z)
      if ((nx > 0) === (sgn > 0)) white.tri(P(a), P(b), P(c))
      else white.tri(P(a), P(c), P(b))
    }
  }
}
// Ribbon windows: long dark bands on the street faces of the expansion.
{
  const ribbons: [number, number, number, number][] = [
    // x0, x1, z, height  (on the Botta side, above the Botta roofs)
    [-26, 0, 42.5, 1.6], [-8, 40, 50.5, 1.8], [12, 58, 56.5, 1.5],
  ]
  for (const [x0, x1, z, h] of ribbons) faceS(win, EY0, x0, x1, z, z + h)
  // on the Natoma Street side, below the terraces
  for (const [x0, x1, z, h] of [[-36, -6, 26, 1.8], [-20, 30, 33.5, 1.8], [8, 56, 20.5, 1.6], [24, 62, 13.5, 1.6]] as [number, number, number, number][]) {
    for (let x = x0; x < x1; x += 4) {
      const xa = x, xb = Math.min(x + 4, x1)
      const ya = NE(xa), yb = NE(xb)
      win.quad([xb, yb + 0.06, z], [xa, ya + 0.06, z], [xa, ya + 0.06, z + h], [xb, yb + 0.06, z + h])
    }
  }
  // the ripples: two shallow horizontal swells along the Botta side
  for (const [z, x0, x1] of [[34, -38, 64], [47.5, 6, 64]] as [number, number, number][]) {
    const y = EY0, d = 0.7
    white.quad([x0, y, z - 1.2], [x1, y, z - 1.2], [x1, y - d, z], [x0, y - d, z])
    white.quad([x0, y - d, z], [x1, y - d, z], [x1, y, z + 1.2], [x0, y, z + 1.2])
  }
}
// The two-storey strip along Natoma Street (way/1365384416)
prism(white, roof, [[-42.1, 31.1], [-26.6, 32.5], [-14.7, 33.3], [-1.2, 34.2], [6.9, 34.1], [6.9, 38.9], [-42.1, 38.6]], 0, 11.7)

const parts = [
  { part: brick, material: finish('botta-brick', 0xbd7a62) },
  { part: dark, material: finish('botta-black', 0x4f545a) },
  { part: white, material: finish('frp-white', 0xf1f0ec) },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
  { part: roof, material: PALETTE.roof },
]
const glb = writeGlb('San Francisco Museum of Modern Art', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 62.3,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/41692824', 'way/1365384410', 'way/1365384411', 'way/1365384412', 'way/1365384413', 'way/1365384414', 'way/1365384415', 'way/1365384416'],
})
const tris = report('SFMOMA', parts, glb, 6500)
const out = new URL('../models/sf-sfmoma.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
