/**
 * Urban District Market (Lintmen's), 2315 N Davidson St, NoDa / Villa
 * Heights, Charlotte — procedural, CC0-1.0.
 * bun generators/clt-urban-district-market.ts
 *
 * The former Lawrence Knitting Mills (1950s), later a cork works, an auto
 * shop and a concrete plant, reopened in 2022-23 as Lintmen's, with the
 * Urban District Market food hall in its north-western half and shops and a
 * gym in the rest. One tall storey of red brick under two side-by-side
 * shallow barrel vaults of pale membrane, running the length of the
 * building. What makes it itself, each drawn as plain geometry:
 *  - the twin barrel roofs, their arches showing on the end walls;
 *  - red brick walls with a black band along the top;
 *  - the greenway (north-west) end: the solid "FOOD HALL" corner bay, the
 *    porch under a sloping metal canopy with tall black-framed openings, and
 *    the entrance at the top of its stairs under the tall weathering-steel
 *    frame carrying the "Urban District Market" letters (lettering not
 *    modelled; the frame and its rails are), beside a lower brick wing;
 *  - on the North Davidson Street (south-east) end, the vaults sloping
 *    down behind a plain parapet.
 *
 * Map frame: x across the building (north-east +, 46.6°), y along it
 * (bearing 316.6, the outline's long axis: + toward the greenway), z up,
 * metres. Origin = centroid of OSM way/323201452, lng -80.8144199,
 * lat 35.2407037.
 *
 * Evidence:
 *  - OSM way/323201452 (building, height 9, 2315 N Davidson St): 45.5 ×
 *    58-71 m. The food court, way/1105368103 (amenity=food_court, not a
 *    building), is its north-western half; the shops' nodes sit in the rest.
 *  - Lidar, USGS 3DEP USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17,
 *    before the 2022 conversion), 0.5 m grid sampled in this frame: two
 *    barrel vaults split at the outline's jog (x = -1.2): the south-west one
 *    22.4 m wide, eaves 6.0 m and crown 8.3 m above y = 0 at x = -12; the
 *    north-east one 23.2 m wide, crown 7.7 m at x = 10. They end at y = 25.4
 *    (south-west) and 30.3 (north-east) at the greenway end; a 5.1 m flat
 *    strip (the canopy and corner bay) runs to the outline at y = 27.4; the
 *    entrance wing (x 12-22, y 30-40) is flat at 4.7 m. At the street end the
 *    vaults slope down over their last 3.5 m to a 6.4 m parapet. A narrow
 *    8 m return at the jog just outside the street front (a pole or a
 *    sign, gone or unidentified) is left out. Ground: ground_min 207.00 m
 *    at the north-west; y = 0 is ground_min + 1.1 m, rising 2.2 m to the
 *    street end. The lidar footprint matches the OSM outline.
 *  - USGS NAIP: the pale roof over the whole outline, two vaults.
 *  - Published: Charlotte-Mecklenburg Historic Landmarks Commission news,
 *    10 Sep 2020 ("Lawrence Knitting Mills Gaining New Life as Food Hall");
 *    lintmens.com (Lawrence Knitting Mills, 1950s, later uses; Cluck Design
 *    Collaborative); Liles Construction (completed October 2022); Axios
 *    Charlotte 2023-04-13 (food hall opened April 2023).
 *  - Photos (Wikimedia Commons, City Dweller 2, CC BY-SA 4.0):
 *    · "Urban District Market Porch Late March 2024.jpg" — the greenway end
 *      from the west: the FOOD HALL bay, porch and canopy, both vaults'
 *      arches, the steel sign frame beyond.
 *      https://commons.wikimedia.org/wiki/File:Urban_District_Market_Porch_Late_March_2024.jpg
 *    · "Urban District Market Sign Late March 2024.jpg" — the entrance in
 *      the north-east vault's end wall head-on: the frame, door, windows,
 *      black band, brick.
 *      https://commons.wikimedia.org/wiki/File:Urban_District_Market_Sign_Late_March_2024.jpg
 *    · "Little Sugar Creek Greenway Urban District Section at 26th St Early
 *      March 2025.jpg" — the same end from the greenway: flat-topped end
 *      walls with the pale vault ends rising behind them, the frame.
 *      https://commons.wikimedia.org/wiki/File:Little_Sugar_Creek_Greenway_Urban_District_Section_at_26th_St_Early_March_2025.jpg
 *
 * Numbers: plan from OSM; every roof and wall height from lidar. Estimated
 * from the head-on entrance photo, scaled by its 1.8 m double door
 * (111 px/m): the 1.6 m landing, the door, windows and lintels, the frame
 * (3.56 m wide; top 9.8 m, the photo looking up, so a lower bound; 2016
 * lidar predates it) and its rails; the porch's 1.1 m floor, the canopy's
 * slope and the 0.45 m black band from the porch photo. The end walls are
 * flat-topped at the eaves with the vault ends showing above them, as both
 * greenway photos show. The valley gutter is drawn 1.8 m wide, broader
 * than the real one, so the two vaults read apart at phone size.
 *
 * Doubts: no licensed photo shows the North Davidson Street end, the
 * 26th Street (south-west) side or the north-east side. Those walls are
 * drawn plain brick with the black band, no openings; the street end's
 * sloping vault ends are the 2016 lidar's and may have changed in 2022.
 * Mapillary was not available. The FOOD HALL and sign letters are left out.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n?: V3) {
  const N = n && ([n, n, n] as V3[])
  p.tri(a, b, c, undefined, undefined, undefined, N)
  p.tri(a, c, d, undefined, undefined, undefined, N)
}
/** An axis-aligned box, top edges chamfered by `b`; `sides` = S(-y), E, N, W. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0, top: Part = p, sides = [true, true, true, true]) {
  const zt = z1 - b
  if (sides[0]) quad(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, zt], [x0, y0, zt], [0, -1, 0])
  if (sides[1]) quad(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, zt], [x1, y0, zt], [1, 0, 0])
  if (sides[2]) quad(p, [x1, y1, z0], [x0, y1, z0], [x0, y1, zt], [x1, y1, zt], [0, 1, 0])
  if (sides[3]) quad(p, [x0, y1, z0], [x0, y0, z0], [x0, y0, zt], [x0, y1, zt], [-1, 0, 0])
  if (b > 0) {
    const i0 = x0 + b, i1 = x1 - b, j0 = y0 + b, j1 = y1 - b
    quad(p, [x0, y0, zt], [x1, y0, zt], [i1, j0, z1], [i0, j0, z1], unit([0, -1, 1]))
    quad(p, [x1, y0, zt], [x1, y1, zt], [i1, j1, z1], [i1, j0, z1], unit([1, 0, 1]))
    quad(p, [x1, y1, zt], [x0, y1, zt], [i0, j1, z1], [i1, j1, z1], unit([0, 1, 1]))
    quad(p, [x0, y1, zt], [x0, y0, zt], [i0, j0, z1], [i0, j1, z1], unit([-1, 0, 1]))
    quad(top, [i0, j0, z1], [i1, j0, z1], [i1, j1, z1], [i0, j1, z1], [0, 0, 1])
  } else quad(top, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
}

/**
 * A vertical wall face from plan point A to B (outward to the right when
 * walking A → B seen from above, i.e. A → B anticlockwise round the
 * building). `panel` draws on it in (along, z) coordinates, `d` proud.
 */
function wall(A: XY, B: XY) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1])
  const u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
  const n: V3 = [u[1], -u[0], 0]
  const P = (a: number, z: number, d = 0): V3 => [A[0] + u[0] * a + n[0] * d, A[1] + u[1] * a + n[1] * d, z]
  return {
    L, n, P,
    panel(p: Part, a0: number, a1: number, z0: number, z1: number, d = 0.05) {
      quad(p, P(a0, z0, d), P(a1, z0, d), P(a1, z1, d), P(a0, z1, d), n)
    },
    /** A box standing out from the face: a pier, post or lintel. */
    block(p: Part, a0: number, a1: number, z0: number, z1: number, d0: number, d1: number) {
      const s: V3 = [u[0], u[1], 0], m: V3 = [-u[0], -u[1], 0]
      quad(p, P(a0, z0, d1), P(a1, z0, d1), P(a1, z1, d1), P(a0, z1, d1), n)
      quad(p, P(a1, z0, d1), P(a1, z0, d0), P(a1, z1, d0), P(a1, z1, d1), s)
      quad(p, P(a0, z0, d0), P(a0, z0, d1), P(a0, z1, d1), P(a0, z1, d0), m)
      quad(p, P(a0, z1, d1), P(a1, z1, d1), P(a1, z1, d0), P(a0, z1, d0), [0, 0, 1])
      quad(p, P(a0, z0, d0), P(a1, z0, d0), P(a1, z0, d1), P(a0, z0, d1), [0, 0, -1])
    },
  }
}

// ---------------------------------------------------------------------------
// Plan (OSM, in this frame) and levels (lidar, above y = 0).
const X0 = -23.55, XM = -1.2, X1 = 22.0
const YS = -30.75            // the North Davidson Street end
const YH = -27.2             // where the vaults start to slope down to it
const YW = 25.4, YE = 30.3   // the vaults' greenway ends
const YBAY = 27.4            // the corner bay and canopy line
const EAVE = 6.0, BAND = 0.45
const SEG = 12

const brick = new Part(), black = new Part(), membrane = new Part()
const steel = new Part(), win = new Part(), metal = new Part()

/** A circular-segment vault over [xa, xb]. */
function vault(xa: number, xb: number, crown: number) {
  const w = (xb - xa) / 2, h = crown - EAVE, xm = (xa + xb) / 2
  const R = (w * w + h * h) / (2 * h), cz = crown - R
  const z = (x: number) => cz + Math.sqrt(Math.max(0, R * R - (x - xm) ** 2))
  const xs = Array.from({ length: SEG + 1 }, (_, i) => xa + ((xb - xa) * i) / SEG)
  const nrm = (x: number): V3 => [(x - xm) / R, 0, (z(x) - cz) / R]
  return {
    xa, xb, z, xs,
    /** The membrane between two y lines, smooth across the curve. */
    roof(y0: number, y1: number) {
      for (let i = 0; i < SEG; i++) {
        const a = xs[i], b = xs[i + 1]
        const na = nrm(a), nb = nrm(b)
        membrane.tri([a, y0, z(a)], [b, y0, z(b)], [b, y1, z(b)], undefined, undefined, undefined, [na, nb, nb])
        membrane.tri([a, y0, z(a)], [b, y1, z(b)], [a, y1, z(a)], undefined, undefined, undefined, [na, nb, na])
      }
    },
    /**
     * An end at y, facing +y (`out` 1) or -y (-1): a flat-topped brick wall
     * from z0 to the eaves with the black band, and above it the vault's
     * arched end in the pale membrane, set just back.
     */
    end(y: number, out: 1 | -1, z0 = 0) {
      const n: V3 = [0, out, 0], d = out * 0.04, yb = y - out * 0.15
      for (let i = 0; i < SEG; i++) {
        const [l, r] = out > 0 ? [xs[i + 1], xs[i]] : [xs[i], xs[i + 1]]
        if (z0 < EAVE) {
          quad(brick, [l, y, z0], [r, y, z0], [r, y, EAVE], [l, y, EAVE], n)
          quad(black, [l, y + d, EAVE - BAND], [r, y + d, EAVE - BAND], [r, y + d, EAVE], [l, y + d, EAVE], n)
        }
        quad(membrane, [l, yb, EAVE], [r, yb, EAVE], [r, yb, z(r)], [l, yb, z(l)], n)
      }
    },
  }
}

const VW = vault(X0, XM, 8.3)
const VE = vault(XM, X1, 7.7)
VW.roof(YH, YW)
VE.roof(YH, YE)
VW.end(YW, 1)
VE.end(YE, 1)
// The valley gutter between the vaults, drawn a little broad so the two
// vaults still read apart at phone size.
{
  const g = 0.9, zg = EAVE + 0.03, zs = (x: number) => (x < XM ? VW.z(x) : VE.z(x)) + 0.03
  quad(metal, [XM - g, YH, zs(XM - g)], [XM, YH, zg], [XM, YW, zg], [XM - g, YW, zs(XM - g)])
  quad(metal, [XM, YH, zg], [XM + g, YH, zs(XM + g)], [XM + g, YE, zs(XM + g)], [XM, YE, zg])
}

// The long walls with their black band: 26th Street side and the north-east.
const SW = wall([X0, YW], [X0, YS])
SW.panel(brick, 0, SW.L, 0, EAVE, 0)
SW.panel(black, 0, SW.L, EAVE - BAND, EAVE)
const NE = wall([X1, YS], [X1, YE])
NE.panel(brick, 0, NE.L, 0, EAVE, 0)
NE.panel(black, 0, NE.L, EAVE - BAND, EAVE)
// The step in the greenway end where the two vaults' end walls meet.
const JOG = wall([XM, YE], [XM, YW])
JOG.panel(brick, 0, JOG.L, 0, EAVE, 0)
JOG.panel(black, 0, JOG.L, EAVE - BAND, EAVE)

// ---------------------------------------------------------------------------
// The street end: the vaults slope down over their last 3.5 m to a plain
// parapet, brick with the black band along its top (lidar).
{
  const PAR = 6.4
  quad(brick, [X0, YS, 0], [X1, YS, 0], [X1, YS, PAR], [X0, YS, PAR], [0, -1, 0])
  quad(black, [X0, YS - 0.04, PAR - BAND], [X1, YS - 0.04, PAR - BAND], [X1, YS - 0.04, PAR], [X0, YS - 0.04, PAR], [0, -1, 0])
  for (const v of [VW, VE]) {
    for (let i = 0; i < SEG; i++) {
      const a = v.xs[i], b = v.xs[i + 1]
      quad(membrane, [a, YS, PAR], [b, YS, PAR], [b, YH, v.z(b)], [a, YH, v.z(a)])
    }
  }
  // The parapet's ends stand a little above the long walls.
  for (const [x, o] of [[X0, -1], [X1, 1]] as [number, number][]) {
    const n: V3 = [o, 0, 0]
    const [y0, y1] = o > 0 ? [YS, YS + 0.4] : [YS + 0.4, YS]
    quad(black, [x, y0, EAVE], [x, y1, EAVE], [x, y1, PAR], [x, y0, PAR], n)
  }
}

// ---------------------------------------------------------------------------
// The greenway end, south-west vault: the corner bay, then the porch under
// its canopy with four tall black-framed openings.
const BAY1 = -17.0, FLOOR = 1.1
box(brick, X0, BAY1, YW, YBAY, 0, EAVE - BAND, 0, metal, [false, true, true, true])
box(black, X0 - 0.04, BAY1 + 0.04, YW, YBAY + 0.04, EAVE - BAND, EAVE, 0.08, metal, [false, true, true, true])
{
  const f = wall([XM, YW], [BAY1, YW])
  // Porch base, brick, the porch floor 1.1 m up.
  box(brick, BAY1, XM, YW, YBAY, 0, FLOOR, 0, metal, [false, true, true, false])
  const n = 4, pier = 1.3, w = (f.L - (n + 1) * pier) / n
  for (let k = 0; k < n; k++) {
    const a0 = pier + k * (w + pier)
    f.panel(black, a0 - 0.15, a0 + w + 0.15, FLOOR, 4.55)
    f.panel(win, a0, a0 + w, FLOOR, 4.4, 0.08)
  }
  // The canopy: corrugated metal sloping out over the porch.
  const zc0 = 5.2, zc1 = 4.55, t = 0.15
  const n0 = unit([0, zc0 - zc1, YBAY + 0.3 - YW])
  quad(metal, [BAY1, YW, zc0], [XM, YW, zc0], [XM, YBAY + 0.3, zc1], [BAY1, YBAY + 0.3, zc1], [n0[0], n0[1], n0[2]])
  quad(black, [BAY1, YBAY + 0.3, zc1 - t], [XM, YBAY + 0.3, zc1 - t], [XM, YBAY + 0.3, zc1], [BAY1, YBAY + 0.3, zc1], [0, 1, 0])
  quad(metal, [XM, YW, zc0 - t], [BAY1, YW, zc0 - t], [BAY1, YBAY + 0.3, zc1 - t], [XM, YBAY + 0.3, zc1 - t], [0, 0, -1])
}

// North-east vault's greenway end: the food hall's entrance at the top of
// its stairs, as in the head-on photo (scaled by the 1.8 m double door): the
// door under the weathering-steel frame, a window either side under a black
// lintel. The stairs and the 1.6 m landing are not modelled.
{
  const f = wall([12.2, YE], [XM, YE])
  const m = 12.2 - 5.5, LAND = 1.6
  f.panel(black, m - 1.05, m + 1.05, LAND, LAND + 3.05, 0.05)
  f.panel(win, m - 0.9, m + 0.9, LAND, LAND + 2.9, 0.08)
  for (const [c, hw, z0, z1] of [[m - 3.3, 1.15, 3.4, 4.4], [m + 3.4, 1.1, 2.4, 4.6]] as [number, number, number, number][]) {
    f.panel(black, c - hw - 0.1, c + hw + 0.1, z0 - 0.1, z1, 0.05)
    f.panel(win, c - hw, c + hw, z0, z1, 0.08)
    f.block(black, c - hw - 0.25, c + hw + 0.25, z1 + 0.05, z1 + 0.4, 0, 0.12)
  }
  // The frame: two posts, a beam under the black band, a beam at the top,
  // and three rails that carry the letters.
  const fw = 1.78, post = 0.35, d0 = 0.1, d1 = 0.5, TOP = 9.8
  for (const s of [-1, 1]) {
    const a = m + s * fw
    f.block(steel, Math.min(a, a - s * post), Math.max(a, a - s * post), 0, TOP, d0, d1)
  }
  f.block(steel, m - fw, m + fw, TOP - 0.35, TOP, d0, d1)
  f.block(steel, m - fw + post, m + fw - post, 5.2, 5.45, d0, d1)
  for (const z of [6.4, 7.0, 7.55]) f.block(black, m - fw + post, m + fw - post, z, z + 0.15, d0 + 0.08, d1 - 0.08)
}

// ---------------------------------------------------------------------------
// The lower wing in front of the north-east vault's end (OSM, lidar 4.7 m):
// plain brick under the black band; no photo shows its openings closely.
{
  const WING = 4.7
  const A: XY = [12.2, YE], B: XY = [12.5, 36.0], C: XY = [X1, 40.2], D: XY = [X1, YE]
  const faces: [XY, XY][] = [[A, B], [B, C], [C, D]]
  for (const [p, q] of faces) {
    const f = wall(q, p)
    f.panel(brick, 0, f.L, 0, WING, 0)
    f.panel(black, 0, f.L, WING - BAND, WING)
  }
  quad(metal, [A[0], A[1], WING], [D[0], D[1], WING], [C[0], C[1], WING], [B[0], B[1], WING], [0, 0, 1])
}

// ---------------------------------------------------------------------------
// Colours from the daylight photos: red brick, black band and frames, the
// pale vault membrane, weathering steel, grey corrugated canopy and flat
// roofs.
const parts = [
  { part: brick, material: finish('udm-brick', 0xb5624f) },
  { part: black, material: finish('udm-black', 0x4a4f57) },
  { part: membrane, material: finish('udm-membrane', 0xdcd3c2) },
  { part: steel, material: finish('udm-corten', 0x9a5536) },
  { part: win, material: PALETTE.window },
  { part: metal, material: PALETTE.roof },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Urban District Market', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 316.6, osm: 'way/323201452', height: 9.5,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/clt-urban-district-market.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${parts.length} materials`)
