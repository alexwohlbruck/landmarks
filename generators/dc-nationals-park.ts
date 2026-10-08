/**
 * Nationals Park, Washington (MLB, Washington Nationals) — procedural,
 * CC0-1.0, no textures.  bun generators/dc-nationals-park.ts
 *
 * Map frame: x across the park (first-base side +x), y from home plate
 * toward centre field, z up, metres. Placed at bearing 30°, the line from
 * home plate to second base in OSM (infield relation/2205878: home-plate
 * circle at (1.6, -35.4), second-base corner of the grass at (1.2, 0.5) in
 * this frame). The anchor is the area centroid of the stadium outline
 * (building=stadium relation/1066168, outer way/67260011).
 *
 * The stands only: the field, warning track and infield dirt are the map's
 * (STYLE.md, "Don't model the ground"). z = 0 is the playing field, the
 * lowest ground under the outline; the streets on the south and west stand
 * about 7 m higher, so the facade detail there starts at about 10 m.
 *
 * How it is built. The bowl is lofted round a centre C = (0, -10) near the
 * pitcher's mound: at each angle θ (clockwise from centre field) a section
 * is drawn outward from the field wall, whose radius comes from the OSM
 * field ring (the outline's inner way/67260403). The section's radii and
 * heights are measured, angle by angle, from the DC Office of the Chief
 * Technology Officer's 2024 lidar surface model (imagery.dcgis.dc.gov,
 * Lidar/DSM_2024, 1 m), and checked against the 2018 survey:
 *   - the upper-deck front (first point over 17 m), the canopy front and
 *     back (over 33 m), the 30 m perimeter roof behind it, and the outer
 *     wings, in 4° steps (tables BLOCK_A, BLOCK_B, below);
 *   - the canopy over the home-plate and third-base block stands 40.0 m
 *     above the field all round; over the first-base block, 33.5 m;
 *   - the upper deck is split between home plate and the first-base block
 *     (θ ≈ 100°–108°), the "homage to Griffith Stadium" (Wikipedia);
 *   - the lower bowl rises to 6–9 m at its back.
 * Two blocks of grandstand result: A, first base and right field, and B,
 * home plate round to the left-field pole. Each is a lower bowl of navy
 * seats with a pale cross aisle, the club and suite levels as glass bands
 * under the upper deck's overhang, the upper deck in navy rising under a
 * white canopy with its lamp banks along the front edge, the grey 30 m
 * roof behind and the precast-and-glass outer wall.
 *
 * The outfield is open, as it is: low left-field bleachers, the round Red
 * Loft in left-centre (OSM's outline bump, 21 m in the lidar), a 16 m
 * terrace behind centre and right field with the right-field stands in
 * front of it, the 20 m north-east wing on Half Street's side, and the
 * scoreboard in right-centre: 101 ft × 47 ft (31 × 14 m, Wikipedia) plus
 * its side panels, about 50 m long in the lidar, top 44 m, with its lamp
 * bank on the left and the red NATIONALS letters on top (drawn as one red
 * bar, not lettering). The left-field light tower stands at the end of the
 * third-base block, 48 m.
 *
 * Evidence
 * - OSM: outline relation/1066168 (outer way/67260011, inner way/67260403,
 *   DC GIS 2008 footprint), infield relation/2205878.
 * - Measured: DC lidar DSM 2024 and 2018 (heights, radii, every mass above);
 *   USGS NAIP orthophoto (plan, roof colours).
 * - Published: capacity 41,339; architects HOK Sport with Devrouax &
 *   Purnell; scoreboard 101 × 47 ft; split upper deck (Wikipedia).
 * - Photos (Wikimedia Commons): Carol M. Highsmith, "Aerial view of
 *   Nationals Park" (three crops, public domain, from the south-west);
 *   Paulo O, "Nationals Stadium (3601384119)" (CC BY 2.0, from the north
 *   over the centre-field gate); Famartin, "View towards home base from the
 *   Visitors Dugout" and "View across the playing field from the outfield
 *   stands" (CC BY-SA 4.0); Nymfan9, "Nationals Park front" (CC BY-SA 3.0);
 *   Airtuna08, "NationalsParkCaptiol" (CC BY 3.0, Red Loft); 1st Lt. Nathan
 *   Wallin, "Major League flyover 141003-Z-ON144-0402" (public domain,
 *   scoreboard).
 * Estimated: the heights of the glass bands on the suite face and the outer
 * walls (from the photos, not measured); the lamp banks' number and size;
 * the east (First Street) facade, which no usable photo shows, follows the
 * lidar massing and the west facade's banding. Colours: seats navy, as the
 * Nationals' seats are, pulled to the style's lightness; precast `stone`;
 * the canopy white `trim`; roofs `roof`; glass `window`; the Red Loft and
 * the scoreboard letters a muted Nationals red.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

export type XY = [number, number]

// ---------------------------------------------------------------------------
// Small geometry kit, shared with dc-audi-field.ts.

export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
export const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A quad (or triangle, if two corners coincide), wound to face `hint`. */
export function quad(p: Part, P: V3[], hint: V3, ns?: V3[]) {
  const face = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const face2 = cross(sub(P[2], P[0]), sub(P[3], P[0]))
  const f = Math.hypot(...face) > Math.hypot(...face2) ? face : face2
  const ord = dot(f, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const n = ns?.map(unit)
  const t = (a: number, b: number, c: number) => {
    const A = P[ord[a]], B = P[ord[b]], C = P[ord[c]]
    if (Math.hypot(...cross(sub(B, A), sub(C, A))) < 1e-6) return
    p.tri(A, B, C, undefined, undefined, undefined, n && [n[ord[a]], n[ord[b]], n[ord[c]]])
  }
  t(0, 1, 2)
  t(0, 2, 3)
}

const area2 = (p: XY[]) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)

/** Ear-clipping triangulation of a simple polygon; returns index triples, counter-clockwise. */
export function triangulate(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i)
  if (area2(poly) < 0) idx.reverse()
  const out: [number, number, number][] = []
  const crossz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => crossz(a, b, p) > 1e-9 && crossz(b, c, p) > 1e-9 && crossz(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 5000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i - 1 + idx.length) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const a = poly[ia], b = poly[ib], c = poly[ic]
      if (crossz(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inside(poly[j], a, b, c))) continue
      out.push([ia, ib, ic])
      idx.splice(i, 1)
      cut = true
      break
    }
    if (!cut) { // degenerate remainder: drop a collinear vertex
      const i = idx.findIndex((_, k) => Math.abs(crossz(poly[idx[(k - 1 + idx.length) % idx.length]], poly[idx[k]], poly[idx[(k + 1) % idx.length]])) < 1e-6)
      if (i < 0) break
      idx.splice(i, 1)
    }
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** A vertical prism over a plan polygon: walls in `side`, a flat top in `top`. */
export function prism(poly: XY[], z0: number, z1: number, side: Part, top: Part | null) {
  const ccw = area2(poly) < 0 ? [...poly].reverse() : poly
  for (let i = 0; i < ccw.length; i++) {
    const a = ccw[i], b = ccw[(i + 1) % ccw.length]
    const out: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
    quad(side, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], out)
  }
  if (top) for (const [i, j, k] of triangulate(ccw)) top.tri([ccw[i][0], ccw[i][1], z1], [ccw[j][0], ccw[j][1], z1], [ccw[k][0], ccw[k][1], z1])
}

/** An oriented box: centre, three unit axes and half sizes; `bottom` adds the underside. */
export function box(p: Part, c: V3, ax: [V3, V3, V3], h: [number, number, number], bottom = false) {
  const P = (u: number, v: number, w: number) => add(add(add(c, mul(ax[0], u * h[0])), mul(ax[1], v * h[1])), mul(ax[2], w * h[2]))
  const faces: [V3[], V3][] = [
    [[P(-1, -1, -1), P(1, -1, -1), P(1, -1, 1), P(-1, -1, 1)], mul(ax[1], -1)],
    [[P(1, 1, -1), P(-1, 1, -1), P(-1, 1, 1), P(1, 1, 1)], ax[1]],
    [[P(1, -1, -1), P(1, 1, -1), P(1, 1, 1), P(1, -1, 1)], ax[0]],
    [[P(-1, 1, -1), P(-1, -1, -1), P(-1, -1, 1), P(-1, 1, 1)], mul(ax[0], -1)],
    [[P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1)], ax[2]],
  ]
  if (bottom) faces.push([[P(-1, -1, -1), P(-1, 1, -1), P(1, 1, -1), P(1, -1, -1)], mul(ax[2], -1)])
  for (const [pts, n] of faces) quad(p, pts, n)
}

/** A vertical cylinder (n sides), smooth-shaded walls, optional cap. */
export function cylinder(p: Part, c: XY, r: number, z0: number, z1: number, n = 16, top: Part | null = null) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI, b = ((i + 1) / n) * 2 * Math.PI
    const A: V3 = [Math.cos(a), Math.sin(a), 0], B: V3 = [Math.cos(b), Math.sin(b), 0]
    const pt = (d: V3, z: number): V3 => [c[0] + d[0] * r, c[1] + d[1] * r, z]
    quad(p, [pt(A, z0), pt(B, z0), pt(B, z1), pt(A, z1)], add(A, B), [A, B, B, A])
  }
  if (top) for (let i = 1; i < n - 1; i++) {
    const pt = (k: number): V3 => [c[0] + Math.cos((k / n) * 2 * Math.PI) * r, c[1] + Math.sin((k / n) * 2 * Math.PI) * r, z1]
    top.tri(pt(0), pt(i), pt(i + 1))
  }
}

/** First crossing of a ray from `o` along `d` with a closed ring, or Infinity. */
export function rayHit(ring: XY[], o: XY, d: XY) {
  let best = Infinity
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const e: XY = [b[0] - a[0], b[1] - a[1]]
    const den = d[0] * e[1] - d[1] * e[0]
    if (Math.abs(den) < 1e-12) continue
    const w: XY = [a[0] - o[0], a[1] - o[1]]
    const t = (w[0] * e[1] - w[1] * e[0]) / den, s = (w[0] * d[1] - w[1] * d[0]) / den
    if (t > 1e-6 && s >= 0 && s <= 1) best = Math.min(best, t)
  }
  return best
}

/** One edge of a lofted section: from this point to the next, in this part. */
export type SectionPt = { r: number; z: number; part: Part | null }

/**
 * Loft sections round a centre. `sections[k]` is the section at angle
 * `angles[k]` (degrees clockwise from +y); all sections have the same
 * number of points, listed so the outside of each edge lies to the left
 * walking along it in the (r, z) plane, i.e. from the field outward and
 * up. Faces are smooth across angles unless they kink. `caps` closes both
 * ends with the section polygon (closed back along z = 0).
 */
export function loftSections(C: XY, angles: number[], sections: SectionPt[][], capPart: Part | null) {
  const dir = (a: number): XY => [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)]
  const P = (k: number, i: number): V3 => {
    const d = dir(angles[k]), s = sections[k][i]
    return [C[0] + d[0] * s.r, C[1] + d[1] * s.r, s.z]
  }
  const nE = sections[0].length - 1
  const K = angles.length
  // Expected outside normal of edge i at section k (left of travel in the r,z plane).
  const want = (k: number, i: number): V3 => {
    const a = sections[k][i], b = sections[k][i + 1], d = dir(angles[k])
    const dr = b.r - a.r, dz = b.z - a.z
    return [-dz * d[0], -dz * d[1], dr]
  }
  const faceN: V3[][] = []
  for (let i = 0; i < nE; i++) {
    faceN.push([])
    for (let k = 0; k < K - 1; k++) {
      const q = [P(k, i), P(k + 1, i), P(k + 1, i + 1), P(k, i + 1)]
      let n = cross(sub(q[1], q[0]), sub(q[3], q[0]))
      if (Math.hypot(...n) < 1e-9) n = cross(sub(q[2], q[1]), sub(q[3], q[1]))
      if (Math.hypot(...n) < 1e-9) n = want(k, i)
      n = unit(n)
      if (dot(n, add(want(k, i), want(k + 1, i))) < 0) n = mul(n, -1)
      faceN[i].push(n)
    }
  }
  const vN = (i: number, k: number, own: number) => {
    const f = faceN[i][own], other = faceN[i][k === own ? k - 1 : k]
    if (!other || dot(f, other) < 0.94) return f
    return unit(add(f, other))
  }
  for (let i = 0; i < nE; i++) {
    for (let k = 0; k < K - 1; k++) {
      const part = sections[k][i].part
      if (!part) continue
      const q = [P(k, i), P(k + 1, i), P(k + 1, i + 1), P(k, i + 1)]
      const n0 = vN(i, k, k), n1 = vN(i, k + 1, k)
      quad(part, q, faceN[i][k], [n0, n1, n1, n0])
    }
  }
  if (capPart) for (const [k, sgn] of [[0, -1], [K - 1, 1]] as const) {
    const sec = sections[k]
    const poly: XY[] = sec.map((s) => [s.r, s.z])
    const last = sec[sec.length - 1], first = sec[0]
    if (last.z > 0.01) poly.push([last.r, 0])
    if (first.z > 0.01) poly.push([first.r, 0])
    const d = dir(angles[k])
    const side: V3 = [d[1] * sgn, -d[0] * sgn, 0] // clockwise tangent at the far end, back at the start
    const to3 = (p: XY): V3 => [C[0] + d[0] * p[0], C[1] + d[1] * p[0], p[1]]
    for (const [a, b, c] of triangulate(poly)) quad(capPart, [to3(poly[a]), to3(poly[b]), to3(poly[c]), to3(poly[c])], side)
  }
}

// ---------------------------------------------------------------------------
// Nationals Park.

// OSM in this frame (projected about the anchor, turned by the bearing).
// The field ring: inner way/67260403 of relation/1066168.
const FIELD: XY[] = [[-28.9, 77.9], [-58.8, 60.3], [-71.8, 37.8], [-73.3, 33.5], [-56.5, 16.8], [-56.1, 11.8], [-48.9, -1.7], [-40.4, -15.7], [-31.5, -24.3], [-33.2, -26.4], [-29.2, -30.2], [-28.1, -28.9], [-14.7, -42.0], [-15.8, -43.1], [-14.4, -44.4], [-12.0, -41.9], [-6.7, -46.4], [-4.1, -47.6], [-1.3, -48.3], [1.6, -48.6], [4.4, -48.3], [7.2, -47.6], [9.8, -46.3], [12.2, -44.7], [15.2, -41.4], [18.2, -44.1], [19.8, -42.4], [18.3, -41.1], [31.3, -27.9], [32.7, -29.2], [36.4, -25.3], [34.4, -23.5], [42.2, -15.5], [55.7, 9.8], [55.1, 15.9], [75.2, 37.6], [60.2, 64.7], [58.1, 63.4], [11.0, 82.9], [-4.5, 89.1], [-26.0, 76.4]]
// The outline: outer way/67260011.
const OUTLINE: XY[] = [[-28.1, 115.1], [-4.7, 128.8], [0.7, 118.6], [8.6, 115.6], [11.0, 111.0], [20.0, 108.0], [20.5, 107.9], [26.2, 121.9], [31.1, 119.5], [35.9, 127.2], [41.1, 135.7], [44.4, 137.7], [53.5, 143.2], [104.8, 52.1], [108.3, 43.5], [111.2, 34.5], [113.2, 25.4], [114.4, 16.2], [114.8, 6.8], [113.9, -6.7], [112.6, -14.6], [110.9, -21.7], [103.4, -19.4], [102.7, -21.3], [100.4, -27.2], [99.0, -30.8], [98.3, -32.4], [94.5, -30.6], [89.4, -39.9], [92.7, -42.1], [91.9, -43.3], [102.0, -50.6], [103.4, -49.3], [112.4, -55.0], [102.1, -64.0], [80.5, -81.9], [81.9, -83.8], [76.7, -88.5], [70.4, -81.0], [67.1, -83.9], [73.1, -91.7], [66.3, -96.9], [59.2, -101.7], [51.4, -105.9], [43.4, -109.4], [40.4, -104.3], [27.3, -109.7], [10.2, -113.4], [-5.6, -113.8], [-6.7, -118.5], [-9.9, -132.7], [-10.1, -133.7], [-11.0, -133.4], [-11.7, -135.6], [-9.9, -136.0], [-11.5, -141.7], [-13.6, -142.8], [-14.0, -144.1], [-12.7, -144.5], [-17.5, -161.1], [-16.9, -162.0], [-21.2, -176.8], [-60.8, -108.5], [-48.3, -108.6], [-42.6, -100.6], [-54.4, -92.4], [-62.8, -85.6], [-71.7, -77.4], [-79.9, -68.7], [-87.6, -59.4], [-95.6, -48.2], [-93.2, -47.1], [-100.4, -35.0], [-103.0, -36.3], [-149.8, 45.2], [-146.6, 45.4], [-138.3, 45.6], [-137.1, 43.5], [-112.1, 43.8], [-112.2, 44.8], [-107.8, 44.8], [-92.8, 45.1], [-74.4, 77.2], [-43.9, 94.4], [-46.7, 96.1], [-45.3, 98.2], [-43.6, 100.5], [-44.8, 103.7], [-44.9, 106.9], [-43.9, 110.3], [-42.3, 112.9], [-39.0, 115.5], [-35.4, 116.6], [-31.7, 116.5]]

const C: XY = [0, -10]
const dirOf = (a: number): XY => [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)]
const wallR = (a: number) => rayHit(FIELD, C, dirOf(a))
const outlineR = (a: number) => rayHit(OUTLINE, C, dirOf(a))

const seats = new Part(), stone = new Part(), trim = new Part(), roof = new Part(), glass = new Part(), red = new Part()

/**
 * Grandstand radii from the lidar, every 4°: [θ, upper-deck front, canopy
 * front, canopy back, end of the perimeter roof, outer wall, wing height].
 * A wing height of 0 means the outer wall rises straight to the perimeter
 * roof. Smoothed over three samples; the west side's wings, which run far
 * past the bowl, are drawn as plan prisms instead (WINGS).
 */
type Row = [number, number, number, number, number, number, number]
const BLOCK_A: Row[] = [ // first base and right field: canopy 33.5 m, roof 32.4 m, east wing 20 m
  [50, 92.5, 100, 105.5, 115.5, 123.5, 20], [52, 92, 99.8, 105.2, 115.2, 123.2, 20], [56, 91, 99.5, 105, 115, 123, 20],
  [60, 90, 99, 103.5, 113.5, 121.5, 20], [64, 89.5, 98, 103, 113, 121, 20], [68, 88, 95, 102.5, 112.5, 120.5, 20],
  [72, 87.5, 94, 101, 111.5, 119, 20], [76, 86, 92, 99.5, 110, 118, 20], [80, 84.5, 91, 99, 109, 116.5, 20],
  [84, 83.5, 90, 97.5, 107, 115.5, 20], [88, 82.5, 88.5, 97, 105.5, 115, 20], [92, 81, 87.5, 95, 104.5, 114, 20],
  [96, 79, 85.5, 93.5, 103, 111.5, 20], [100, 78.5, 85, 92, 101.5, 104, 20],
]
const BLOCK_B: Row[] = [ // home plate to the left-field pole: canopy 40 m, roof 30 m
  [108, 72, 80, 94, 100, 110, 24], [112, 71.5, 79, 96, 104, 118, 25], [116, 70.5, 78, 96, 107, 119, 25],
  [120, 70, 77, 96, 106, 116, 24], [124, 69, 76.5, 95.5, 104.5, 113, 24], [128, 69, 76, 95, 103, 111.5, 25],
  [132, 68.5, 76, 94.5, 102, 104, 0], [136, 68, 75.5, 94, 101, 0, 0], [140, 68.5, 75.5, 94.5, 101, 0, 0],
  [144, 68.5, 75.5, 95, 101.5, 0, 0], [148, 69, 76, 95.5, 102.5, 0, 0], [152, 70, 78, 95.5, 102.5, 0, 0],
  [156, 70.5, 80.5, 97, 104, 0, 0], [160, 71, 81.5, 98, 104, 0, 0], [164, 71, 81.5, 98.5, 105, 0, 0],
  [168, 72, 81.5, 98.5, 105, 0, 0], [172, 73, 81.5, 98.5, 105.5, 0, 0], [176, 73, 81, 98.5, 105, 0, 0],
  [180, 72.5, 81, 99, 105.5, 0, 0], [184, 72, 81, 100, 105.5, 0, 0], [188, 72, 80, 101, 105, 0, 0],
  [192, 71.5, 80, 101, 105, 0, 0], [196, 70.5, 79, 100, 104.5, 0, 0], [200, 70, 79, 99, 103.5, 0, 0],
  [204, 69, 79, 95, 102.5, 0, 0], [208, 68, 77, 93.5, 101.5, 0, 0], [212, 68, 75, 93, 100, 0, 0],
  [216, 67.5, 74.5, 92.5, 99.5, 0, 0], [220, 67, 74.5, 92, 99.5, 0, 0], [224, 66.5, 74.5, 92, 99.5, 0, 0],
  [228, 67, 74.5, 92.5, 99.5, 0, 0], [232, 67.5, 74.5, 92.5, 99.5, 0, 0], [236, 67.5, 74.5, 93, 100, 0, 0],
  [240, 68.5, 75.5, 94, 101, 0, 0], [244, 69.5, 76.5, 95, 102, 0, 0], [248, 70, 78, 96, 102.5, 0, 0],
  [252, 71.5, 80, 97, 103, 0, 0], [256, 73.5, 82, 99, 105, 0, 0], [260, 75, 83.5, 101, 108.5, 0, 0],
  [264, 76.5, 84, 103, 111.5, 0, 0], [268, 78.5, 86.5, 105.5, 115, 0, 0], [272, 80.5, 88.5, 107.5, 116, 0, 0],
  [276, 83.5, 91, 110, 116, 0, 0], [280, 86.5, 94.5, 112, 116, 0, 0], [284, 89.5, 98, 109.5, 115, 0, 0],
  [288, 92, 100, 109, 114, 0, 0],
]

/** The grandstand section at one angle (see the header for the parts). */
function standSection(a: number, row: Row, canopy: number, roofZ: number, deckTop: number, lowBack: number): SectionPt[] {
  const [, ud, , cb, r30raw, routRaw, hw] = row
  const lim = outlineR(a) - 0.5
  const r30 = Math.min(r30raw, lim)
  const rout = hw > 0 ? Math.min(Math.max(routRaw, r30 + 0.01), lim) : r30 + 0.01
  const hout = hw > 0 ? hw : roofZ
  const rs = ud + 2 // the suites' glass, under the upper deck's overhang
  const wall = (r: number, h: number): SectionPt[] => [
    { r, z: h, part: roof }, // grey metal band at the top of the outer wall
    { r, z: h - 4, part: glass }, // the glass band of the concourses
    { r, z: 12, part: stone }, // precast base, its foot below the street on the south and west
  ]
  return [
    { r: ud - 1, z: lowBack, part: stone }, // the back of the lower bowl, a pale lip
    { r: rs, z: lowBack, part: stone },
    { r: rs, z: lowBack + 0.8, part: glass }, // club and suite levels
    { r: rs, z: 13, part: stone },
    { r: rs, z: 14.2, part: glass },
    { r: rs, z: 18.6, part: stone },
    { r: rs, z: 19, part: stone }, // underside of the upper deck's front
    { r: ud, z: 19, part: trim }, // its fascia
    { r: ud, z: 22, part: seats }, // upper deck
    { r: cb - 1, z: deckTop, part: roof }, // the back wall under the canopy
    { r: cb - 1, z: canopy - 1.2, part: roof },
    { r: cb, z: canopy - 1.2, part: trim }, // the white truss band above the perimeter roof
    { r: cb, z: roofZ, part: stone }, // perimeter roof, white in the aerials
    { r: r30, z: roofZ, part: stone }, // step down to a wing, if any
    { r: r30, z: hout, part: roof }, // wing roof
    ...wall(rout, hout),
    { r: rout, z: 0, part: null },
  ]
}

function lofted(rows: Row[], canopy: number, roofZ: number, deckTop: number, lowBack: number) {
  const angles = rows.map((r) => r[0])
  loftSections(C, angles, rows.map((r) => standSection(r[0], r, canopy, roofZ, deckTop, lowBack)), stone)
  // The canopy: a white slab from the canopy front to just past its back.
  loftSections(C, angles, rows.map(([, , cf, cb]) => [
    { r: cf, z: canopy - 1.2, part: trim }, // front fascia
    { r: cf, z: canopy, part: roof }, // top: the roof deck, light grey from above
    { r: cb + 0.6, z: canopy, part: trim }, // back fascia
    { r: cb + 0.6, z: canopy - 1.2, part: roof }, // underside
    { r: cf, z: canopy - 1.2, part: null },
  ]), trim)
}
lofted(BLOCK_A, 33.6, 32.4, 30.5, 9)
lofted(BLOCK_B, 40, 30, 36, 7.5)

// The split: below the gap in the upper deck, the suites and a 21 m roof.
{
  const rows: [number, number, number][] = [[100, 78.5, 101.5], [104, 75, 98], [108, 72, 96]]
  loftSections(C, rows.map((r) => r[0]), rows.map(([a, ud, ro]) => [
    { r: ud - 1, z: 8, part: stone },
    { r: ud + 2, z: 8, part: stone },
    { r: ud + 2, z: 8.8, part: glass },
    { r: ud + 2, z: 18, part: stone },
    { r: ud + 2, z: 21, part: roof },
    { r: Math.min(ro, outlineR(a) - 0.5), z: 21, part: roof },
    { r: Math.min(ro, outlineR(a) - 0.5), z: 17, part: glass },
    { r: Math.min(ro, outlineR(a) - 0.5), z: 12, part: stone },
    { r: Math.min(ro, outlineR(a) - 0.5), z: 0, part: null },
  ]), null)
}

// Lamp banks on the canopy's front edge: white frames on short posts.
function lampBank(a: number, r: number, z: number, w: number) {
  const d = dirOf(a), t: V3 = [d[1], -d[0], 0], n: V3 = [d[0], d[1], 0]
  const c: V3 = [C[0] + d[0] * r, C[1] + d[1] * r, z + 2.6]
  box(trim, c, [t, n, [0, 0, 1]], [w / 2, 0.8, 1.8], true)
  for (const s of [-1, 1]) box(roof, add([C[0] + d[0] * r, C[1] + d[1] * r, z + 0.4], mul(t, (s * w) / 3)), [t, n, [0, 0, 1]], [0.35, 0.35, 0.4])
}
const interp = (rows: Row[], a: number, col: number) => {
  for (let i = 0; i < rows.length - 1; i++) if (a >= rows[i][0] && a <= rows[i + 1][0]) {
    const f = (a - rows[i][0]) / (rows[i + 1][0] - rows[i][0])
    return rows[i][col] + (rows[i + 1][col] - rows[i][col]) * f
  }
  return rows[rows.length - 1][col]
}
for (const a of [58, 67, 76, 85, 94]) lampBank(a, interp(BLOCK_A, a, 2) + 1.2, 33.6, 8)
for (let a = 116; a <= 284; a += 12) lampBank(a, interp(BLOCK_B, a, 2) + 1.2, 40, 9)

// The lower bowl, foul pole to foul pole: navy seats from the field wall,
// a pale cross aisle two thirds of the way up, navy again to the back.
{
  const angles: number[] = []
  for (let a = 50; a <= 290; a += 4) angles.push(a)
  const udAt = (a: number) => (a <= 100 ? interp(BLOCK_A, a, 1) : a >= 108 ? interp(BLOCK_B, a, 1) : 78.5 + ((72 - 78.5) * (a - 100)) / 8)
  const backZ = (a: number) => (a <= 100 ? 9 : a >= 108 ? 7.5 : 8)
  loftSections(C, angles, angles.map((a) => {
    const rw = wallR(a), rb = udAt(a) - 1, zb = backZ(a)
    const rm = rw + (rb - rw) * 0.62, zm = 1.2 + (zb - 1.2) * 0.62
    return [
      { r: rw, z: 0, part: seats }, // field wall
      { r: rw, z: 1.2, part: seats },
      { r: rm, z: zm, part: stone }, // cross aisle
      { r: rm + 2, z: zm, part: stone },
      { r: rm + 2, z: zm + 0.7, part: seats },
      { r: rb, z: zb, part: stone },
      { r: rb, z: 0, part: null },
    ]
  }), stone)
}

// The outfield. Left field: low bleachers rising to the street-level
// concourse. Centre and right field: the right-field stands in front of a
// 16 m terrace running back to the outline.
{
  const angles: number[] = []
  for (let a = 290; a <= 344; a += 4) angles.push(a)
  loftSections(C, angles, angles.map((a) => {
    const rw = wallR(a), d = a < 296 ? 20 : 24
    return [
      { r: rw, z: 0, part: seats },
      { r: rw, z: 1.2, part: seats },
      { r: rw + d, z: 9.5, part: stone },
      { r: rw + d, z: 0, part: null },
    ]
  }), stone)
}
{
  const angles: number[] = []
  for (let a = 344; a <= 410; a += 4) angles.push(Math.min(a, 410))
  const mix = (a: number) => Math.max(0, Math.min(1, (a - 362) / 10)) // centre field → right field
  loftSections(C, angles, angles.map((a) => {
    const rw = wallR(a % 360), m = mix(a), ro = Math.min(outlineR(a % 360) - 0.5, rw + 48)
    const z1 = 3 + 2 * m, z2 = 3.4 + 7.6 * m, b = 12 + 4 * m, z3 = 8 + 7 * m
    return [
      { r: rw, z: 0, part: seats },
      { r: rw, z: 1.2, part: seats }, // lower right-field seats (a low wall in centre)
      { r: rw + 5, z: z1, part: glass },
      { r: rw + 5, z: z2, part: seats }, // the upper right-field stand
      { r: rw + b, z: z3, part: stone },
      { r: rw + b, z: 16, part: roof }, // the terrace roof
      { r: ro, z: 16, part: stone },
      { r: ro, z: 0, part: null },
    ]
  }), stone)
}

// The north-east wing along the outline's straight edge, 20 m.
prism([[53.5, 143.2], [104.8, 52.1], [93.5, 45.7], [42.2, 136.8]], 0, 20, stone, roof)
// The west wing on South Capitol Street, 26 m, and the south-west wing, 21 m.
prism([[-103, -36.3], [-149.8, 45.2], [-137.1, 45.4], [-92.6, -30.3]], 0, 26, stone, roof)
prism([[-60.8, -108.5], [-48.3, -108.6], [-5.6, -113.8], [-6.7, -118.5], [-9.9, -132.7], [-12.7, -144.5], [-17.5, -161.1], [-21.2, -176.8]], 0, 21, stone, roof)
// Their glass bands, on the street faces.
for (const [a, b, z0, z1] of [[[-103, -36.3], [-149.8, 45.2], 12, 22], [[-60.8, -108.5], [-21.2, -176.8], 12, 17]] as [XY, XY, number, number][]) {
  const e: XY = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(...e)
  let out: V3 = [(e[1] / l) * 0.05, (-e[0] / l) * 0.05, 0]
  if (dot(out, [a[0] - C[0], a[1] - C[1], 0]) < 0) out = mul(out, -1) // away from the bowl
  const P = (t: number, z: number): V3 => add([a[0] + e[0] * t, a[1] + e[1] * t, z], out)
  quad(glass, [P(0.04, z0), P(0.96, z0), P(0.96, z1), P(0.04, z1)], out)
}

// The Red Loft: a red drum in left-centre with its LED ring.
cylinder(red, [-34.5, 105.5], 10, 0, 16.5, 16, null)
cylinder(seats, [-34.5, 105.5], 10.3, 16.5, 20.5, 16, roof)

// The scoreboard in right-centre, facing home plate.
{
  const A: XY = [10, 103.3], B: XY = [65.8, 78.3]
  const e = unit([B[0] - A[0], B[1] - A[1], 0]), n: V3 = [-e[1], e[0], 0] // n points to the field
  const toHome = dot(n, [1.6 - A[0], -35.4 - A[1], 0]) > 0 ? n : mul(n, -1)
  const mid: V3 = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, 0]
  const at = (u: number, z: number): V3 => add(add(mid, mul(e, u)), [0, 0, z])
  box(seats, at(0, 32), [e, toHome, [0, 0, 1]], [25, 1.3, 8], true) // the board, 50 × 16 m
  box(trim, add(at(0, 32), mul(toHome, 1.35)), [e, toHome, [0, 0, 1]], [25.2, 0.05, 8.2]) // its white frame
  box(seats, add(at(0, 32), mul(toHome, 1.42)), [e, toHome, [0, 0, 1]], [23.5, 0.05, 6.8]) // the screen inside it
  for (const u of [-18, 0, 18]) box(roof, at(u, 20), [e, toHome, [0, 0, 1]], [0.9, 0.9, 4]) // legs to the terrace
  box(trim, at(-19, 42.5), [e, toHome, [0, 0, 1]], [5.5, 0.8, 2.5], true) // lamp bank, top left
  box(red, at(6, 41.8), [e, toHome, [0, 0, 1]], [12, 0.5, 1.8], true) // NATIONALS
}

// The left-field light tower at the end of the third-base block.
box(roof, [-101.5, 36.5, 37], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0.8, 0.8, 9])
box(trim, [-101, 36.5, 45.5], [[0, 1, 0], [-1, 0, 0], [0, 0, 1]], [6.5, 1, 2.5], true)

// ---------------------------------------------------------------------------
const parts = [
  { part: seats, material: finish('nationals-navy', 0x4c5b7d) },
  { part: stone, material: PALETTE.stone },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: glass, material: PALETTE.window },
  { part: red, material: finish('nationals-red', 0xb4544f) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Nationals Park', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 30, osm: 'relation/1066168', height: 46,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/dc-nationals-park.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
