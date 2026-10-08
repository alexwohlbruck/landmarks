/**
 * TCL Chinese Theatre (Grauman's Chinese, 1927, Meyer & Holler), Hollywood —
 * original procedural geometry, CC0-1.0.
 * bun generators/la-chinese-theatre.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the OSM outline's
 * centroid on the lowest ground under it (the east end of the Hollywood
 * Blvd frontage). Bearing 0: the outline is square to north; Hollywood Blvd
 * runs along the south (−y) edge.
 *
 * What makes it the Chinese Theatre: the gate over the entrance — a steep
 * green-bronze pagoda roof on a pale stone frame with upswept horns, carried
 * by two coral-red columns, a dark recess behind; low wings each side with a
 * coral coping; the curved forecourt walls ending on the boulevard in two
 * screen walls with copper-capped obelisks; the plain auditorium and stage
 * house behind. The forecourt paving is the map's.
 *
 * Sources:
 * - Plan: OSM way/424105908 (one outline: auditorium, stage house, the
 *   gate's 12 m projection, the wings, the curved forecourt walls and the
 *   two screen walls on the boulevard). No building:parts.
 * - Heights: LA County 2006 lidar surface model (2 m grid) over USGS 3DEP
 *   bare earth (lowest ground 118.2 m): stage house 22 m; auditorium roof a
 *   gable, eaves 13 m, ridge 17.5 m over the middle, flat 12.5 m at its
 *   front; wings 9.5 m; gate frame 16 m; pagoda ridge 22.5–23 m; screen
 *   walls 14 m; curved forecourt walls ≈ 10 m. LARIAC 2020 footprint
 *   458449859785: 18.1 m. The lidar sits ≈ 2 m west of the OSM outline;
 *   plan follows OSM.
 * - Gate proportions: photo p1 (straight on, from the forecourt), scaled by
 *   the OSM projection's 11.8 m width: columns 1.7 m across, 9.5 m tall,
 *   4.5 m either side of the gate's axis; piers with coral panels to 13.8 m;
 *   frame to 16.2 m; horns to ≈ 23.5 m; ridge finials to ≈ 24.5 m.
 * - Obelisks: ≈ 20.5 m with their caps, from photos p2 and p3 against the
 *   14 m screen walls.
 * - Colours: pagoda roof the sage bronze-green of p1/p5 in sun; columns the
 *   coral red of every photo, pulled to the palette's lightness; walls pale
 *   stone; the recess a dark grey-green.
 *
 * Photos (Wikimedia Commons): p1 "Grauman's Chinese Theatre, by Carol
 * Highsmith fixed & straightened" (Carol M. Highsmith, public domain, from
 * the forecourt, south); p2 "Grauman's Chinese Theatre 2" (RightCowLeftCoast,
 * CC BY-SA 4.0, from across Hollywood Blvd, south); p3 "Grauman's Chinese
 * Theatre (2571115290)" (Rob Young, CC BY 2.0, south); p4 "Grauman's Chinese
 * Theatre" (Antoine Taveneaux, CC BY-SA 3.0, south-west); p5 "Grauman's
 * Chinese Theatre juillet 2022" (Benoît Prieur, CC0, south-east, the
 * auditorium box behind); p6 "The Chinese Movie Theater (TCL), Hollywood"
 * (Sergiy Galyonkin, CC BY-SA 4.0, the columns and west forecourt wall).
 *
 * Estimated: the pagoda roof's depth (no photo from the side shows it
 * square on; taken as 7 m from p4), the curved walls' height (lidar 8–12 m,
 * drawn at 10 m), the horns' curve. Left out: the guardian lions, the
 * dragon relief (drawn as a plain bronze panel), the masks on the columns,
 * the screen walls' shrine niches and the signs.
 */
import { Part, lerp, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const stone = new Part(), roof = new Part(), bronze = new Part(), coral = new Part(), dark = new Part(), sage = new Part()

/** Ear-clipping triangulation of a simple polygon. */
function earcut(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i)
  const crossz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (p: XY, a: XY, b: XY, c: XY) => crossz(a, b, p) >= 0 && crossz(b, c, p) >= 0 && crossz(c, a, p) >= 0
  const out: [number, number, number][] = []
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const a = poly[ia], b = poly[ib], c = poly[ic]
      if (crossz(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inTri(poly[j], a, b, c))) continue
      out.push([ia, ib, ic])
      idx.splice(i, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

const signedArea = (poly: XY[]) => poly.reduce((s, p, i) => { const q = poly[(i + 1) % poly.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2

/** A prism over a polygon, walls in `wall`, top in `top`. */
function extrude(poly: XY[], z0: number, z1: number, wall: Part, top: Part) {
  const ccw = signedArea(poly) > 0 ? poly : [...poly].reverse()
  for (let i = 0; i < ccw.length; i++) {
    const a = ccw[i], b = ccw[(i + 1) % ccw.length]
    wall.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  for (const [i, j, k] of earcut(ccw)) top.tri([ccw[i][0], ccw[i][1], z1], [ccw[j][0], ccw[j][1], z1], [ccw[k][0], ccw[k][1], z1])
}

/** An axis-aligned box with a small chamfered top edge. */
function box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, wall: Part, top = wall, lip = 0.3) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const ri: XY[] = [[x0 + lip, y0 + lip], [x1 - lip, y0 + lip], [x1 - lip, y1 - lip], [x0 + lip, y1 - lip]]
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4], ai = ri[i], bi = ri[(i + 1) % 4]
    wall.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1 - lip], [a[0], a[1], z1 - lip])
    wall.quad([a[0], a[1], z1 - lip], [b[0], b[1], z1 - lip], [bi[0], bi[1], z1], [ai[0], ai[1], z1])
  }
  top.quad([ri[0][0], ri[0][1], z1], [ri[1][0], ri[1][1], z1], [ri[2][0], ri[2][1], z1], [ri[3][0], ri[3][1], z1])
}

/** A flat panel on a south-facing wall at y, just proud of it. */
function southPanel(part: Part, x0: number, x1: number, y: number, z0: number, z1: number) {
  const yy = y - 0.04
  part.quad([x0, yy, z0], [x1, yy, z0], [x1, yy, z1], [x0, yy, z1])
}

/** A vertical round column. */
function column(part: Part, c: XY, r: number, z0: number, z1: number, n = 14) {
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * 2 * Math.PI, a1 = ((i + 1) / n) * 2 * Math.PI
    const p = (a: number, z: number): V3 => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z]
    const nn = (a: number): V3 => [Math.cos(a), Math.sin(a), 0]
    part.tri(p(a0, z0), p(a1, z0), p(a1, z1), undefined, undefined, undefined, [nn(a0), nn(a1), nn(a1)])
    part.tri(p(a0, z0), p(a1, z1), p(a0, z1), undefined, undefined, undefined, [nn(a0), nn(a1), nn(a0)])
  }
}

/** Rings of a rectangle (centre cx, cy; half sizes) for lofting. */
const rect = (cx: number, cy: number, hx: number, hy: number, z: number): V3[] => [
  [cx - hx, cy - hy, z], [cx + hx, cy - hy, z], [cx + hx, cy + hy, z], [cx - hx, cy + hy, z],
]

// ---------- auditorium and stage house ----------
const AX0 = -20.5, AX1 = 20.7, RIDGE_X = -1
// front part, flat
box(AX0, AX1, -22, -8, 0, 12.5, stone, roof, 0.4)
// gabled part: walls to the eaves, gable ends, two roof slopes
{
  const y0 = -8, y1 = 19, e = 13.5, r = 17.5
  const wallq = (a: V3, b: V3, c: V3, d: V3) => stone.quad(a, b, c, d)
  wallq([AX0, y1, 0], [AX0, y0, 0], [AX0, y0, e], [AX0, y1, e])
  wallq([AX1, y0, 0], [AX1, y1, 0], [AX1, y1, e], [AX1, y0, e])
  // gable ends (the south one rises over the flat front roof)
  stone.quad([AX0, y0, 12.5], [AX1, y0, 12.5], [AX1, y0, e], [AX0, y0, e])
  stone.tri([AX0, y0, e], [AX1, y0, e], [RIDGE_X, y0, r])
  roof.quad([AX0, y0, e], [RIDGE_X, y0, r], [RIDGE_X, y1, r], [AX0, y1, e])
  roof.quad([RIDGE_X, y0, r], [AX1, y0, e], [AX1, y1, e], [RIDGE_X, y1, r])
}
// stage house, and the lower strip east of it
box(-21.7, 12.5, 19, 31.5, 0, 22, stone, roof, 0.5)
box(12.5, 20.4, 19, 31.5, 0, 15, stone, roof, 0.4)

// ---------- forecourt walls ----------
const WEST: XY[] = [
  [-23.09, -43.95], [-12.0, -43.83], [-12.0, -44.14], [-9.95, -44.1], [-10.0, -41.43], [-12.04, -41.46], [-12.15, -41.86],
  [-14.85, -41.52], [-17.01, -40.41], [-18.44, -39.3], [-19.56, -38.04], [-20.67, -36.43], [-21.2, -35.08], [-21.36, -33.36],
  [-21.09, -28.31], [-20.56, -26.85], [-19.32, -24.75], [-17.22, -22.53], [-15.68, -21.37], [-20.42, -21.3],
  [-20.42, -24.18], [-21.9, -26.42], [-22.91, -29.73], [-22.94, -36.36], [-23.11, -42.81],
]
const EAST: XY[] = [
  [20.66, -44.08], [8.09, -44.07], [8.09, -41.49], [10.0, -41.49], [10.47, -42.09], [12.43, -41.6], [14.39, -40.69],
  [16.0, -39.67], [17.65, -38.06], [18.95, -36.08], [19.54, -34.76], [19.12, -28.05], [17.78, -25.74], [17.78, -22],
  [20.8, -22], [20.97, -24.13],
]
const WALL_H = 10, SCREEN_H = 14
extrude(WEST, 0, WALL_H, sage, roof)
extrude(EAST, 0, WALL_H, sage, roof)
// the screen walls on the boulevard, taller
box(-23.1, -9.95, -44.14, -41.45, 0, SCREEN_H, sage, roof, 0.4)
box(8.09, 20.66, -44.08, -41.45, 0, SCREEN_H, sage, roof, 0.4)
// their arched shopfronts: a panel with a semicircular head, flush
function archPanel(cx: number, y: number, w: number, z0: number, spring: number) {
  const r = w / 2, yy = y - 0.04, n = 10
  dark.quad([cx - r, yy, z0], [cx + r, yy, z0], [cx + r, yy, spring], [cx - r, yy, spring])
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI, a1 = ((i + 1) / n) * Math.PI
    dark.tri([cx, yy, spring], [cx + r * Math.cos(a0), yy, spring + r * Math.sin(a0)], [cx + r * Math.cos(a1), yy, spring + r * Math.sin(a1)])
  }
}
archPanel(-16.5, -44.14, 6.2, 0.4, 4.6)
archPanel(14.4, -44.08, 6.2, 0.4, 4.6)

// obelisks at the screen walls' corners: tapering shafts from the wall top,
// copper pyramid caps, a dark finial
function obelisk(c: XY, w0: number) {
  // dark bronze-green spires from the wall top, tapering to a pyramid cap
  const z0 = SCREEN_H - 0.3, z1 = 20.0, z2 = 23.0
  dark.loft([rect(c[0], c[1], w0, w0, z0), rect(c[0], c[1], w0 * 0.72, w0 * 0.72, z1)])
  dark.loft([rect(c[0], c[1], w0 * 0.72, w0 * 0.72, z1), rect(c[0], c[1], w0 * 0.85, w0 * 0.85, z1 + 0.15)])
  const top: V3 = [c[0], c[1], z2]
  const b = rect(c[0], c[1], w0 * 0.85, w0 * 0.85, z1 + 0.15)
  for (let i = 0; i < 4; i++) dark.tri(b[i], b[(i + 1) % 4], top)
  dark.loft([rect(c[0], c[1], 0.15, 0.15, z2 - 0.3), rect(c[0], c[1], 0.02, 0.02, z2 + 1.3)])
}
obelisk([-21.8, -42.8], 1.1)
obelisk([-11.2, -42.8], 1.2)
obelisk([9.3, -42.8], 1.2)
obelisk([19.4, -42.8], 1.1)

// ---------- the wings either side of the gate ----------
const WING_H = 9.5
box(-14.2, -6.9, -26.4, -22, 0, WING_H, sage, roof, 0.3)
extrude([[4.86, -26.05], [12.1, -26.5], [12.24, -25.0], [14.9, -28.34], [17.78, -25.74], [17.78, -22], [4.86, -22]], 0, WING_H, sage, roof)
// a lattice window per wing (photo p1), drawn as one panel
southPanel(dark, -12.0, -9.2, -26.4, 3.8, 6.8)
southPanel(dark, 7.3, 10.1, -26.28, 3.8, 6.8)
// the coral coping along each wing's front, its outer end swept up
function coping(xIn: number, xOut: number, yFront: number) {
  const s = Math.sign(xOut - xIn), z0 = WING_H - 0.7, z1 = WING_H + 0.15
  const yf = yFront - 0.5, yb = yFront + 1.2
  const lift = 1.6, xs = xOut - s * 2.2 // where the sweep starts
  // straight run: front, top, underside
  const run = (xa: number, xb: number, za0: number, za1: number, zb0: number, zb1: number) => {
    const [l, r] = s > 0 ? [xa, xb] : [xb, xa]
    const [l0, l1, r0, r1] = s > 0 ? [za0, za1, zb0, zb1] : [zb0, zb1, za0, za1]
    coral.quad([l, yf, l0], [r, yf, r0], [r, yf, r1], [l, yf, l1])
    coral.quad([l, yf, l1], [r, yf, r1], [r, yb, r1], [l, yb, l1])
    coral.quad([l, yb, l0], [r, yb, r0], [r, yf, r0], [l, yf, l0])
    coral.quad([r, yb, r0], [l, yb, l0], [l, yb, l1], [r, yb, r1])
  }
  run(xIn, xs, z0, z1, z0, z1)
  run(xs, xOut, z0, z1, z0 + lift, z1 + lift)
  // the end face
  const xe = xOut
  const e: V3[] = [[xe, yf, z0 + lift], [xe, yb, z0 + lift], [xe, yb, z1 + lift], [xe, yf, z1 + lift]]
  if (s > 0) coral.quad(e[0], e[1], e[2], e[3])
  else coral.quad(e[1], e[0], e[3], e[2])
}
coping(-6.9, -14.2, -26.4)
coping(4.86, 12.1, -26.3)

// ---------- the gate ----------
const GX = -1.0 // the gate's axis
const COL_DX = 4.5, COL_R = 0.85, COL_Y = -29.35, COL_H = 9.5
const FRONT = -30.5, BACK = -26.0
const PIER_HW = 1.2, BEAM0 = 13.8, BEAM1 = 16.2, GATE_HW = 6.2
// the dark recess wall between the piers, and the bronze dragon panel on it
dark.quad([GX - COL_DX, BACK - 0.02, 0], [GX + COL_DX, BACK - 0.02, 0], [GX + COL_DX, BACK - 0.02, BEAM0], [GX - COL_DX, BACK - 0.02, BEAM0])
southPanel(bronze, GX - 1.7, GX + 1.7, BACK - 0.02, 3.2, 10.6)
for (const s of [-1, 1]) {
  const cx = GX + s * COL_DX
  // the coral column
  column(coral, [cx, COL_Y], COL_R, 0, COL_H)
  // a stone pier behind it, full height, and the pier head over the column
  box(cx - PIER_HW, cx + PIER_HW, -28.2, BACK, 0, BEAM0, sage, sage, 0.2)
  box(cx - PIER_HW, cx + PIER_HW, FRONT, -28.2, COL_H, BEAM0, sage, sage, 0.2)
  // its coral panels, one tall panel on the front face
  southPanel(coral, cx - 0.85, cx + 0.85, FRONT, COL_H + 0.5, BEAM0 - 0.4)
}
// the frame's beam under the roof
box(GX - GATE_HW, GX + GATE_HW, FRONT - 0.3, BACK + 1.6, BEAM0, BEAM1, sage, sage, 0.3)

// horns: upswept crescent blades rising from the beam's outer ends, drawn
// as a flat crescent with thickness, stone with dark tips
function horn(sx: number) {
  const n = 6, y0 = -29.4, y1 = -27.6
  const tip: [number, number] = [GATE_HW + 2.9, 24.0]
  const outer: [number, number][] = [], inner: [number, number][] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    // outer edge: leaves the beam's end nearly level and curls up steeply
    outer.push([lerp(GATE_HW - 0.4, tip[0], Math.sin((t * Math.PI) / 2)), lerp(BEAM1 - 0.7, tip[1], 1 - Math.cos((t * Math.PI) / 2))])
    // inner edge: starts higher and further in, meets the tip
    inner.push([lerp(GATE_HW - 2.4, tip[0], Math.sin((t * Math.PI) / 2) ** 1.4), lerp(BEAM1 + 0.2, tip[1], (1 - Math.cos((t * Math.PI) / 2)) ** 0.8)])
  }
  const P = (q: [number, number], y: number): V3 => [GX + sx * q[0], y, q[1]]
  for (let i = 0; i < n; i++) {
    const part = i >= n - 2 ? dark : sage
    const o0 = outer[i], o1 = outer[i + 1], i0 = inner[i], i1 = inner[i + 1]
    // faces south and north, and the two edges; wound by side
    const quad = (a: V3, b: V3, c: V3, d: V3) => (sx > 0 ? part.quad(a, b, c, d) : part.quad(b, a, d, c))
    quad(P(o0, y0), P(o1, y0), P(i1, y0), P(i0, y0))
    quad(P(i0, y1), P(i1, y1), P(o1, y1), P(o0, y1))
    quad(P(o0, y1), P(o1, y1), P(o1, y0), P(o0, y0))
    quad(P(i0, y0), P(i1, y0), P(i1, y1), P(i0, y1))
  }
}
horn(-1)
horn(1)

// the pagoda roof: a steep, tall hipped roof, concave, its eaves flared
// past the frame with the corners turned up, a short ridge with two dark
// finials
{
  const cy = -28.0
  // an 8-point ring: corners and edge midpoints, counter-clockwise
  const ring8 = (hx: number, hy: number, z: number, lift = 0): V3[] => [
    [GX - hx, cy - hy, z + lift], [GX, cy - hy, z], [GX + hx, cy - hy, z + lift], [GX + hx, cy, z],
    [GX + hx, cy + hy, z + lift], [GX, cy + hy, z], [GX - hx, cy + hy, z + lift], [GX - hx, cy, z],
  ]
  const Z_TOP = 24.5
  const rings = [
    ring8(6.4, 4.1, BEAM1 - 0.3, 1.1), // the flared eave, corners up
    ring8(5.3, 3.3, BEAM1 + 0.5, 0.3),
    ring8(4.3, 2.5, BEAM1 + 2.6),
    ring8(3.3, 1.6, BEAM1 + 5.2),
    ring8(2.3, 0.5, Z_TOP),
  ]
  bronze.loft(rings)
  const topR = rings[rings.length - 1], botR = rings[0]
  for (let i = 1; i < 7; i++) bronze.tri(topR[0], topR[i], topR[i + 1])
  for (let i = 1; i < 7; i++) bronze.tri(botR[0], botR[i + 1], botR[i])
  for (const s of [-1, 1]) {
    const fx = GX + s * 2.0
    dark.loft([rect(fx, cy, 0.32, 0.32, Z_TOP), rect(fx, cy, 0.2, 0.2, Z_TOP + 1.0), rect(fx, cy, 0.03, 0.03, Z_TOP + 2.0)])
  }
}

// ---------- write ----------
const parts = [
  { part: stone, material: PALETTE.stone },
  // NAIP shows the auditorium's roofs pale, not the palette's slate grey
  { part: roof, material: finish('chinese-roof', 0xcfcabf) },
  { part: sage, material: finish('chinese-sage', 0xc3cbbd) },
  { part: bronze, material: finish('chinese-jade', 0x86ad95) },
  { part: coral, material: finish('chinese-coral', 0xd9825f) },
  { part: dark, material: finish('chinese-bronze-dark', 0x4f5a54) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('TCL Chinese Theatre', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, height: 26.5,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/424105908'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/la-chinese-theatre.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
