/**
 * Museum of Glass (2002, Arthur Erickson), Thea Foss Waterway, Tacoma:
 * procedural, CC0-1.0.
 * bun generators/sea-museum-of-glass.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; built in the street grid's
 * frame (bearing 351°, the OSM walls run 351.1-351.5°). The origin is the
 * area centroid of OSM way/30679724 (-122.4340127, 47.2459117); y = 0 is
 * the lowest ground the outline touches (3.7 m NAVD88). Dock Street and the
 * plaza the cone stands on are 3 m higher; the west side, along the
 * freeway, is about 2 m up.
 *
 * Form: the hot shop's cone, a right circular cone of stainless steel
 * shingles 30 m across at the base whose axis leans 17° (here towards the
 * north-east, as the lidar shows), cut off square to its axis near the top,
 * where a dark ventilation band rings the opening. North of it, the low
 * museum: a concrete block whose roof is a public plaza (the east half
 * lower than the west), a translucent glass box beside the cone, a second
 * raised box at the north end, and a long ramp running down from the plaza
 * past the cone's east side to Dock Street.
 *
 * Sources
 * - OSM: way/30679724 (outline, 2 levels, Q2894440). way/24656705 is the
 *   museum's site (tourism=museum), not a building. The cone's base is the
 *   rounded south end of the outline (centre (-8, -43), radius ~16).
 * - Lidar (measured, USGS 3DEP WA_PierceCounty_1_2020, 1 m surface model;
 *   the steel returns are sparse): cone foot x -22..6, y -56..-27 (base square to the axis: centre (-7, -40), radius 14),
 *   on the plaza at 3.0; its tip 29.6 above y = 0 (26.6 above the plaza) at
 *   (-1.5, -34.5), so the axis leans 7.8 m towards the north-east over its
 *   height, 16.5°; the steep side faces north-east, the long slope
 *   south-west. Museum roofs: east half 10.0, west half 12.1, glass box
 *   17.1 (x -21..-10, y -24..-4), north box 16.1 (x -15..-3, y 33..56); the
 *   ramp falling from 9.8 at y -30 to 3.5 at y -55 along x 8..20; a low
 *   terrace on the north-east at 6.6 (3.5 m over Dock Street).
 * - Published: the cone is 90 ft (27 m) tall, 100 ft (30 m) across at the
 *   base, tilted 17°, clad in 2,800 diamond-shaped stainless panels;
 *   75,000 sq ft; opened 6 July 2002 (Wikipedia, "Museum of Glass";
 *   museumofglass.org).
 * - Photos (Wikimedia Commons; credits in
 *   /tmp/city/sea/work/sea-museum-of-glass/credits.txt): Chris Light (from
 *   the west across the freeway, two), Loco Steve (from the west), Visitor7
 *   (the cone and its door; the glass box), Joe Mabel (from UW Tacoma, from
 *   the south-west), ZhengZhou (the cone from below at sunset), Deathgleaner
 *   (the roof plaza and its ramp), Corsario CL (the cone from the plaza).
 * From photos: the dark band under the cone's rim (about 2.4 m), the
 *   silver steel, the translucent green-white glass box, the dark glazing
 *   along the west front, the pale concrete plaza and walls.
 * Estimated: the half-angle of the cone (25°, from the base radius and the
 *   top opening, about 4 m across, in the photos), the glazing's extent,
 *   the ramp's walls.
 * Left out: the diamond shingle joints (too fine; they would read as a
 *   grid), the cone's door, the Bridge of Glass and its canopy (not this
 *   building), the outdoor steps down to Dock Street (landscape, on grade),
 *   railings and lamps.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, capRing, finishGlb, writeModel } from './sea-tacoma-union-station'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

const PLAZA = 3.0

function build() {
  const concrete = new Part(), steel = new Part(), dark = new Part(), win = new Part(), glass = new Part(), roof = new Part()
  const W = (f: Face, poly: XY[]) => flatShape(win, f, poly, 0.06)

  // ------------------------------------------------------------ the cone
  const TAU = (17 * Math.PI) / 180, LEAN = (45 * Math.PI) / 180 // lean towards the north-east
  const A: V3 = [Math.sin(TAU) * Math.sin(LEAN), Math.sin(TAU) * Math.cos(LEAN), Math.cos(TAU)]
  const E1 = unit(cross3([0, 0, 1], A)), E2 = cross3(A, E1)
  const B: V3 = [-7, -40, PLAZA]
  const TIP = 29.6, L = (TIP - PLAZA) / Math.cos(TAU)
  const RB = 14, RT = 2.0, TANA = (RB - RT) / L, COSA = 1 / Math.hypot(1, TANA), SINA = TANA * COSA
  const BAND = 2.4
  const SEG = 40
  const rAt = (a: number) => RB - a * TANA
  const at = (phi: number, a: number): V3 => {
    const R = add(mul(E1, Math.cos(phi)), mul(E2, Math.sin(phi)))
    return add(add(B, mul(A, a)), mul(R, rAt(a)))
  }
  const nAt = (phi: number): V3 => unit(add(mul(add(mul(E1, Math.cos(phi)), mul(E2, Math.sin(phi))), COSA), mul(A, SINA)))
  // where each generator meets the plaza
  const a0 = (phi: number) => {
    const Rz = E1[2] * Math.cos(phi) + E2[2] * Math.sin(phi)
    return (-RB * Rz) / (A[2] - TANA * Rz)
  }
  const ring = (fa: (phi: number) => number) => Array.from({ length: SEG + 1 }, (_, i) => { const phi = (2 * Math.PI * i) / SEG; return at(phi, fa(phi)) })
  const rows: { pts: V3[]; part: Part }[] = []
  const r0 = ring(a0), r1 = ring(() => L - BAND), r2 = ring(() => L)
  const band = (part: Part, lo: V3[], hi: V3[]) => {
    for (let i = 0; i < SEG; i++) {
      const p0 = (2 * Math.PI * i) / SEG, p1 = (2 * Math.PI * (i + 1)) / SEG
      part.tri(lo[i], lo[i + 1], hi[i + 1], undefined, undefined, undefined, [nAt(p0), nAt(p1), nAt(p1)])
      part.tri(lo[i], hi[i + 1], hi[i], undefined, undefined, undefined, [nAt(p0), nAt(p1), nAt(p0)])
    }
  }
  band(steel, r0, r1)
  band(dark, r1, r2)
  void rows
  // the top, square to the axis
  const top = add(B, mul(A, L))
  for (let i = 0; i < SEG; i++) dark.tri(top, r2[i], r2[i + 1], undefined, undefined, undefined, [A, A, A])
  // the concrete curb the cone stands in, following its foot
  const foot: XY[] = r0.slice(0, SEG).map((p) => {
    const d = Math.hypot(p[0] - B[0], p[1] - B[1])
    return [B[0] + ((p[0] - B[0]) * (d + 0.6)) / d, B[1] + ((p[1] - B[1]) * (d + 0.6)) / d] as XY
  })
  prism(concrete, concrete, foot, 0, PLAZA + 1.0, 25)

  // ------------------------------------------------------------ the museum
  // East half (lower plaza) and west half (upper plaza).
  const east = rect(0, -30, 19.5, 56.5), west = rect(-21, -27, 0, 56.5)
  prism(concrete, null, east, 0, 10.0)
  prism(concrete, null, west, 0, 12.1)
  capRing(roof, east, 10.0)
  capRing(roof, west, 12.1)
  // parapets
  for (const [r, z] of [[east, 10.0], [west, 12.1]] as [XY[], number][]) {
    const [x0, y0] = r[0], [x1, y1] = r[2]
    prism(concrete, concrete, chamfer(rect(x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2), 0.3), z, z + 1.0)
    // hollow the parapet: the plaza inside it, just below the coping
    capRing(roof, rect(x0 + 0.5, y0 + 0.5, x1 - 0.5, y1 - 0.5), z + 1.02)
  }
  // The translucent glass box beside the cone.
  const gbox = rect(-21.4, -24, -10, -4)
  prism(glass, null, gbox, 0, 16.4)
  prism(concrete, concrete, chamfer(rect(-21.6, -24.2, -9.8, -3.8), 0.3), 16.4, 17.1)
  // The raised box at the north end, by the Bridge of Glass.
  const nbox = rect(-15, 33, -3, 56.5)
  prism(concrete, null, nbox, 12.1, 13.0)
  prism(glass, null, nbox, 13.0, 15.4)
  prism(concrete, concrete, chamfer(rect(-15.2, 32.8, -2.8, 56.7), 0.3), 15.4, 16.1)
  // The ramp down from the plaza past the cone to Dock Street, between walls.
  const RX0 = 8.5, RX1 = 19.5, RY0 = -55, RY1 = -30, ZN = 9.8, ZS = PLAZA + 0.5
  {
    const z = (y: number) => ZS + ((y - RY0) / (RY1 - RY0)) * (ZN - ZS)
    // the walls: east (taller) and west, each topped a metre over the ramp
    for (const [x0, x1] of [[RX1 - 0.6, RX1], [RX0, RX0 + 0.6]]) {
      const P = (x: number, y: number, zz: number): V3 => [x, y, zz]
      const h = 1.1
      // outer faces
      concrete.quad(P(x1, RY0, 0), P(x1, RY1, 0), P(x1, RY1, z(RY1) + h), P(x1, RY0, z(RY0) + h))
      concrete.quad(P(x0, RY1, 0), P(x0, RY0, 0), P(x0, RY0, z(RY0) + h), P(x0, RY1, z(RY1) + h))
      concrete.quad(P(x0, RY0, 0), P(x1, RY0, 0), P(x1, RY0, z(RY0) + h), P(x0, RY0, z(RY0) + h))
      concrete.quad(P(x0, RY0, z(RY0) + h), P(x1, RY0, z(RY0) + h), P(x1, RY1, z(RY1) + h), P(x0, RY1, z(RY1) + h))
    }
    // the ramp's deck
    roof.quad([RX0 + 0.6, RY0, z(RY0)], [RX1 - 0.6, RY0, z(RY0)], [RX1 - 0.6, RY1, z(RY1)], [RX0 + 0.6, RY1, z(RY1)])
    concrete.quad([RX0 + 0.6, RY0, 0], [RX1 - 0.6, RY0, 0], [RX1 - 0.6, RY0, z(RY0)], [RX0 + 0.6, RY0, z(RY0)])
  }
  // The low terrace on the north-east (OSM's bump towards the waterway).
  const terrace: XY[] = [[19.5, -6], [30.2, 7.8], [19.5, 16.4]]
  prism(concrete, roof, terrace, 0, 6.6)

  // Glazing: dark glass along the west front under the upper plaza, and
  // along Dock Street; a panel per structural bay.
  const glaze = (f: Face, len: number, step: number, z0: number, z1: number) => {
    const k = Math.max(1, Math.round(len / step))
    for (let j = 0; j < k; j++) {
      const s = -len / 2 + (j + 0.5) * (len / k)
      W(f, [[s - (len / k) / 2 + 0.7, z0], [s + (len / k) / 2 - 0.7, z0], [s + (len / k) / 2 - 0.7, z1], [s - (len / k) / 2 + 0.7, z1]])
    }
  }
  glaze({ o: [-21, 26.25, 0], n: [-1, 0] }, 60.5, 7.5, 3.0, 10.5)
  glaze({ o: [19.5, 33, 0], n: [1, 0] }, 41, 7.5, 4.0, 8.8)
  glaze({ o: [9.75, 56.5, 0], n: [0, 1] }, 17.5, 6, 4.0, 8.8)
  glaze({ o: [-10.5, 56.5, 0], n: [0, 1] }, 19, 6, 3.0, 10.5)

  return finishGlb('Museum of Glass', [
    { part: concrete, material: finish('mog-concrete', 0xddd8ce) },
    { part: steel, material: finish('mog-steel', 0xc5cbd1, 0.4) },
    { part: dark, material: finish('mog-vent', 0x575d64) },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 351, height: TIP, replaces: ['way/30679724'] })
}

if (import.meta.main) await writeModel('sea-museum-of-glass', build())
