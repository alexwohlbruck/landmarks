/**
 * Alexander Hamilton U.S. Custom House, 1 Bowling Green — procedural, CC0-1.0, no textures.
 * bun generators/nyc-custom-house.ts
 *
 * Map frame: x = model east (Whitehall Street), y = model north (Bowling
 * Green, the main front), z up, metres. Placed at bearing 1.4°, the
 * outline's minimum-rectangle axis. Anchor: area centroid of the OSM
 * multipolygon relation/3695753. Kit from nyc-city-hall.ts.
 *
 * Evidence
 * - OSM relation/3695753 (outer way/278053595: a trapezoid, 58 m on Bowling
 *   Green, 86 m on Bridge Street, the long sides slanting; inner rings the
 *   four light wells round the rotunda) and its parts 1002205137 (the main
 *   block, 29 m), 972087770 (the low south block), 972087763/764/767 (the
 *   rotunda, a dome tagged #97ae9e), 972087765/766/771/772 (light-well roofs),
 *   1002205138–146 (rooftop structures).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017) in the model frame, against the
 *   street at ~4 m NAVD88: main cornice 27.5 m, the attic and mansard's
 *   foot 34–35 m, the flat roof 39.5–40.5 m, rooftop structures to 44 m, the
 *   central sculpture group on the front ~39 m; the rotunda's drum 19.5 m
 *   rising to 24.5 m at its crown; the light wells open to near the ground;
 *   the south block between the rear corners only 21–22.5 m.
 * - NAIP orthophoto (USGS, public domain): the U of the upper floors open to
 *   the south, a flat grey roof edged by the mansard, the elliptical rotunda
 *   roof (a green copper ring round a ribbed skylight).
 * - Published: Cass Gilbert, 1907, Beaux-Arts; seven storeys; a rusticated
 *   6.1 m ground storey; 44 engaged Corinthian columns through storeys two to
 *   four (12 north, 12 east, 12 west, 8 south); a full-storey entablature
 *   with small windows; a red-slate mansard with dormers and copper
 *   cresting; twelve 3.4 m statues of seafaring nations over the main
 *   cornice; the 26 × 41 m elliptical rotunda (Wikipedia; NRHP 72000889).
 * - Photos (Wikimedia Commons): /tmp/city/nyc/work/nyc-custom-house/photos/credits.txt.
 *   The north front and east side from the north-east (ajay_suresh, public
 *   domain); interior and detail photos by Epicgenius and King of Hearts were
 *   looked at but show no exterior.
 *
 * Estimated: storey heights within the lidar's cornice (base to 7.3 m,
 * columns 7.8–21 m), column size (0.75 m radius), the corner pavilions'
 * width (10 m), window sizes, the south columns (four on each rear corner,
 * the low south block having none), the attic's set-back, the dormer
 * rhythm, the statues (bold standing figures) and the central group. Only
 * the north and east sides are confirmed by a licensed photo; the west side
 * is drawn as the east's mirror and the south from the lidar and NAIP. The
 * grand stair and Daniel Chester French's Four Continents stand outside the
 * outline and are not modelled, apart from the stair itself.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, capPoly, insetRing, area, type XY } from './nyc-570-lexington'
import { block, column, rectPanel, archPanel, wallFrame, spread, band, parapet } from './nyc-city-hall'
import { circle } from './nyc-570-lexington'

/** A plain standing statue: a six-sided robed body tapering to the shoulders, and a head. */
function statue(p: Part, x: number, y: number, z0: number, h: number) {
  const s = h / 3.4
  const rings: V3[][] = [[0.55, 0], [0.45, 2.3], [0.3, 2.75]].map(([r, z]) => circle(x, y, r * s, 6).map(([a, b]) => [a, b, z0 + z * s] as V3))
  p.loft(rings); p.cap(rings[2], true)
  block(p, x - 0.17 * s, y - 0.17 * s, x + 0.17 * s, y + 0.17 * s, z0 + 2.75 * s, z0 + 3.4 * s)
}

const stone = new Part(), win = new Part(), roof = new Part(), shade = new Part(), patina = new Part(), glass = new Part()

const BASE = 7.3, COL0 = 7.8, COL1 = 21.0, CORN = 27.5, ATTIC = 34.0, TOP = 39.5

// The U of the upper floors (counter-clockwise), open to the south between x = ±15.
const U: XY[] = [[-42.3, -42.6], [-15, -42.8], [-15, 19], [15, 19], [15, -42.85], [43.4, -42.9], [30.5, 45.3], [28.1, 46.4], [-29.6, 45.8], [-31.8, 44.3]]
if (area(U) < 0) throw new Error('U must be counter-clockwise')

// --- Main body to the cornice ---
prism({ wall: stone, win: null, roof: null, ring: U, z0: 0, z1: CORN, facade: null, bevel: 0.4 })
band(stone, U, 0, BASE, 0.35) // rusticated base storey, a little proud
band(stone, U, COL1, COL1 + 1.2, 0.6) // architrave over the columns
band(stone, U, CORN - 1.7, CORN, 1.5) // the main cornice

// --- Attic storey, mansard, flat roof, copper cresting ---
const att = insetRing(U, 0.6)
prism({ wall: stone, win: null, roof: null, ring: att, z0: CORN, z1: ATTIC, facade: null, bevel: 0.3 })
band(stone, att, ATTIC - 0.8, ATTIC, 0.35)
parapet(stone, insetRing(U, -0.9), CORN, CORN + 1.1, 0.35) // balustrade on the cornice
const top = insetRing(U, 2.4)
roof.loft([att.map(([x, y]) => [x, y, ATTIC] as V3), top.map(([x, y]) => [x, y, TOP] as V3)])
capPoly(roof, top, TOP)
parapet(patina, top, TOP, TOP + 0.7, 0.3)

// --- The low south block between the rear corners (lidar 21–22.5 m) ---
prism({ wall: stone, win: null, roof, ring: [[-15, -39.2], [15, -39.2], [15, -25], [-15, -25]], z0: 0, z1: 22.0, facade: null, bevel: 0.3 })
band(stone, [[-15, -39.2], [15, -39.2], [15, -25], [-15, -25]], 0, BASE, 0.3)
for (const s of spread(1.5, 28.5, 7)) {
  const a: XY = [-15, -39.2], b: XY = [15, -39.2]
  rectPanel(win, a, b, s, 1.8, 1.6, 5.2, 0.4)
  rectPanel(win, a, b, s, 1.8, 8.6, 12.6)
  rectPanel(win, a, b, s, 1.6, 14.2, 17.0)
  rectPanel(win, a, b, s, 1.6, 18.2, 20.4)
}

// --- Façades: bold engaged columns through storeys two to four, standing
// proud of a shaded loggia wall with the windows recessed between them,
// under a strong entablature; rusticated base; attic windows; dormers ---
type Face = { a: XY; b: XY; cols: number; pav: number; front?: boolean }
const faces: Face[] = [
  { a: U[0], b: U[1], cols: 4, pav: 6 }, // south face of the south-west corner
  { a: U[4], b: U[5], cols: 4, pav: 6 }, // south face of the south-east corner
  { a: U[5], b: U[6], cols: 12, pav: 10 }, // Whitehall Street
  { a: U[7], b: U[8], cols: 12, pav: 3.5, front: true }, // Bowling Green
  { a: U[9], b: U[0], cols: 12, pav: 10 }, // State Street
]
const CR = 0.7 // column radius: 1.4 m shafts
const at = (f: Face, s: number, d: number, z: number) => wallFrame(f.a, f.b, d).at(s, z)
/** A box standing on a face: along-wall s0..s1, out from the wall d0..d1, z0..z1, top capped. */
function faceBox(p: Part, f: Face, s0: number, s1: number, d0: number, d1: number, z0: number, z1: number) {
  const r: V3[] = [at(f, s0, d1, z0), at(f, s1, d1, z0), at(f, s1, d0, z0), at(f, s0, d0, z0)]
  const t = r.map(([x, y]) => [x, y, z1] as V3)
  p.loft([r, t]); p.cap(t, true)
}
for (const f of faces) {
  const L = wallFrame(f.a, f.b).L
  const xs = Array.from({ length: f.cols }, (_, k) => f.pav + ((L - 2 * f.pav) * k) / (f.cols - 1))
  // The projecting central bay of the Bowling Green front: three column bays.
  const P = f.front ? 1.8 : 0
  const pb0 = f.front ? xs[4] - 1.6 : 0, pb1 = f.front ? xs[7] + 1.6 : 0
  const proud = (s: number) => (f.front && s > pb0 && s < pb1 ? P : 0)
  if (f.front) {
    faceBox(stone, f, pb0, pb1, -0.2, P, 0, CORN)
    faceBox(stone, f, pb0 - 0.3, pb1 + 0.3, P - 0.2, P + 0.4, 0, BASE) // its rusticated base
    faceBox(stone, f, pb0 - 0.6, pb1 + 0.6, P - 0.2, P + 1.5, CORN - 1.7, CORN) // its cornice
    faceBox(stone, f, pb0 - 0.2, pb1 + 0.2, P - 0.2, P + 0.6, COL1, COL1 + 1.2)
  }
  // Shaded loggia wall between the end pavilions (and on the central bay).
  const s0 = xs[0] - 1.8, s1 = xs[xs.length - 1] + 1.8
  rectPanel(shade, f.a, f.b, (s0 + s1) / 2, s1 - s0, COL0, COL1, 0.03)
  if (f.front) rectPanel(shade, f.a, f.b, (pb0 + pb1) / 2, pb1 - pb0 - 0.6, COL0, COL1, P + 0.03)
  for (const s of xs) { const c = at(f, s, proud(s) + 0.45, 0); column(stone, c[0], c[1], CR, COL0, COL1, { n: 10, base: 0.6, cap: 0.8, taper: 0.9 }) }
  // Window bays between the columns, and two windows on each pavilion.
  const bays: number[] = []
  for (let k = 0; k < xs.length - 1; k++) bays.push((xs[k] + xs[k + 1]) / 2)
  const pav: number[] = f.pav >= 6 ? [f.pav * 0.3, f.pav * 0.7, L - f.pav * 0.3, L - f.pav * 0.7] : []
  const mid = Math.floor((xs.length - 1) / 2)
  bays.forEach((s, i) => {
    const d = proud(s)
    if (f.front && i === mid) {
      // The main entrance: a tall round arch at the head of the grand stair.
      archPanel(win, f.a, f.b, s, 4.8, BASE, 17.5, d + 0.06)
      return
    }
    rectPanel(win, f.a, f.b, s, 1.9, 1.8, 5.4, d + 0.4)
    rectPanel(win, f.a, f.b, s, 1.7, 8.8, 12.8, d + 0.06)
    rectPanel(win, f.a, f.b, s, 1.5, 14.2, 19.8, d + 0.06)
  })
  for (const s of pav) {
    rectPanel(win, f.a, f.b, s, 1.9, 1.8, 5.4, 0.4)
    rectPanel(win, f.a, f.b, s, 1.7, 8.8, 12.8)
    rectPanel(win, f.a, f.b, s, 1.5, 14.2, 19.8)
  }
  // Frieze windows in the full-storey entablature.
  for (const s of [...bays, ...pav]) rectPanel(win, f.a, f.b, s, 1.3, 22.6, 24.0, proud(s) + 0.06)
  // Attic windows and dormers.
  const n = wallFrame(f.a, f.b).n
  ;[...bays, ...pav].forEach((s, bi) => {
    if (f.front && s > pb0 && s < pb1) return
    rectPanel(win, f.a, f.b, s, 1.4, CORN + 1.6, ATTIC - 1.4, -0.55)
    if (bi % 2) return
    // Dormer: a stone face on the mansard with a copper hood.
    const p0 = at(f, s - 0.95, -1.4, 0), p1 = at(f, s + 0.95, -1.4, 0)
    const back = (q: V3): V3 => [q[0] - n[0] * 2.4, q[1] - n[1] * 2.4, q[2]]
    const up = (r: V3[], z: number) => r.map(([x, y]) => [x, y, z] as V3)
    const ring: V3[] = [p0, p1, back(p1), back(p0)]
    stone.loft([up(ring, ATTIC), up(ring, ATTIC + 2.8)])
    rectPanel(win, [p0[0], p0[1]], [p1[0], p1[1]], 0.95, 1.0, ATTIC + 0.5, ATTIC + 2.3, 0.05)
    const h0 = at(f, s - 1.15, -1.15, 0), h1 = at(f, s + 1.15, -1.15, 0)
    const hr: V3[] = [h0, h1, back(h1), back(h0)]
    patina.loft([up(hr, ATTIC + 2.8), up(hr, ATTIC + 3.4)])
    patina.cap(up(hr, ATTIC + 3.4), true)
  })
  if (!f.front) continue
  // The twelve statues of seafaring nations, one over each column.
  for (const s of xs) {
    const c = at(f, s, proud(s) + 0.5, 0)
    block(stone, c[0] - 0.7, c[1] - 0.7, c[0] + 0.7, c[1] + 0.7, CORN, CORN + 0.8)
    statue(stone, c[0], c[1], CORN + 0.8, 3.4)
  }
  // Raised attic over the central bay, crowned by the sculpture group (lidar ~39 m).
  faceBox(stone, f, pb0 + 0.4, pb1 - 0.4, -2.5, P - 0.6, CORN, 35.6)
  faceBox(stone, f, pb0 + 0.2, pb1 - 0.2, -2.7, P - 0.4, 35.6, 36.4)
  const sm = (pb0 + pb1) / 2
  faceBox(stone, f, sm - 2.6, sm + 2.6, -1.5, P - 1.2, 36.4, 37.4)
  faceBox(stone, f, sm - 1.2, sm + 1.2, -1.2, P - 1.5, 37.4, 39.6)
  for (const ds of [-3.6, 3.6]) { const c = at(f, sm + ds, P - 1.8, 0); statue(stone, c[0], c[1], 36.4, 3.0) }
  // The grand stair: a broad flight from the street up to the entrance storey.
  const steps = 8, run = 0.8, W = pb1 - pb0 + 6
  for (let k = 0; k < steps; k++) {
    const d0 = P + 0.4 + k * run
    faceBox(stone, f, sm - W / 2 - k * 0.2, sm + W / 2 + k * 0.2, d0 - 0.01, d0 + run, 0, BASE * (1 - k / steps))
  }
  // Cheek blocks flanking the stair (the Four Continents' pedestals).
  for (const sgn of [-1, 1]) faceBox(stone, f, sm + sgn * (W / 2 + 1.6) - 1.5, sm + sgn * (W / 2 + 1.6) + 1.5, P + 0.4, P + 0.4 + steps * run, 0, 2.2)
}

// --- The rotunda: an elliptical drum in the court, a copper ring and the skylight ---
{
  const cx = -0.9, cy = -2.45, A = 12.2, B = 20.0, N = 20
  const ell = (s: number, z: number): V3[] => Array.from({ length: N }, (_, i) => { const t = (i * 2 * Math.PI) / N; return [cx + A * s * Math.cos(t), cy + B * s * Math.sin(t), z] as V3 })
  stone.loft([ell(1, 0), ell(1, 19.5)])
  patina.loft([ell(1.02, 19.5), ell(0.92, 21.6), ell(0.68, 23.2)])
  glass.loft([ell(0.68, 23.2), ell(0.45, 24.1), ell(0.15, 24.5)])
  glass.cap(ell(0.15, 24.5), true)
}


finishModel('Alexander Hamilton U.S. Custom House', 'nyc-custom-house', [
  { part: stone, material: finish('customhouse-granite', 0xdcd7cd) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: shade, material: finish('customhouse-granite-shade', 0xbdb7ac) },
  { part: patina, material: PALETTE.copper },
  { part: glass, material: PALETTE.glass },
], { bearing: 1.4, osm: 'relation/3695753', height: 39 }, 6500)
