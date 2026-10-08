/**
 * The Mob Museum, Las Vegas: the former United States Post Office and
 * Courthouse (1933), a three-storey neoclassical block on Stewart Avenue.
 * Its front is a rusticated stone base with an arcade of arched doorways
 * up a broad flight of steps, a giant order of pilasters framing two
 * storeys of tall windows, an inscribed entablature and a balustraded
 * parapet, between brick end pavilions; the sides repeat the pilasters on
 * brick. Procedural, CC0-1.0.
 * bun generators/lv-mob-museum.ts
 *
 * Map frame: x along the Stewart Avenue front, y back from it, z up,
 * metres. The front faces −y; the placement's bearing (28.4°) turns it to
 * face 208° (south-south-west), as it does. The origin is the area
 * centroid of OSM way/206128504.
 *
 * Measured:
 * - OSM way/206128504 (building=commercial, 3 levels): a U, 36.9 m along
 *   the front and 24.4 m deep, its rear light court 16.3 m wide and 12.5 m
 *   deep, open to the north-north-east. The USGS NAIP orthophoto (public
 *   domain) shows a low roof filling the court, drawn here one storey high;
 * - heights, from p4 (square on to the front, scaled by the bay pitch,
 *   4.27 m: seven bays between eight pilasters over 30 m) and p2 (the side,
 *   scaled by its 24.4 m): the base 9 m to the sill band over 1.5 m of
 *   steps, the pilasters 9.6 m, the entablature 2.6 m, the parapet 1.5 m;
 *   22.7 m in all;
 * - the brick end pavilions, 3.45 m wide, and the side bays: five between
 *   six pilasters, with 3.3 m of brick at each end.
 *
 * Photos (Wikimedia Commons):
 * - p4 "The Mob Museum -2022 (1).jpg", Alberto-g-rovi, CC BY 3.0: the
 *   front, square on;
 * - p7 "Las Vegas USPS gf 374.jpg", Gillfoto, CC BY-SA 4.0: from the
 *   south-east, front and east side;
 * - p2 "Las Vegas Post Office and Courthouse, Las Vegas, Nevada.jpg", Ken
 *   Lund, CC BY-SA 2.0: from the south-west, front and west side;
 * - p1 "Las Vegas Mob Museum 2012.jpg", Wtstoffs, CC BY-SA 3.0: the front.
 *
 * Estimated: the back and the court walls (no licensed photo shows them):
 * plain brick with a window per bay per floor; the court's low roof; the
 * steps' depth. Left out: the balusters (the parapet is solid), the
 * inscription, the pilasters' capitals, the green spandrel panels (the
 * two windows of each bay are separate panels), the banners and lamps.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, prism, cap, type XY } from './lv-wynn'

const stone = new Part()
const brick = new Part()
const roof = new Part()
const glass = new Part()

// ---------------------------------------------------------------- massing
const X0 = -18.45, X1 = 18.4 // the front's ends
const YF = -10.45, YB = 14.2 // front and back
const CX0 = -8.0, CX1 = 8.35, CY = 1.55 // the rear court
const U: XY[] = [[X0, YF], [X1, YF], [X1, YB], [CX1, YB], [CX1, CY], [CX0, CY], [CX0, YB], [X0, YB]]

const Z_BASE = 9.0 // top of the rusticated base, the sill band
const Z_ORDER = 18.6 // top of the pilasters
const Z_ENT = 21.2 // top of the cornice
const Z_TOP = 22.7 // top of the parapet
const Z_ROOF = 20.8 // the flat roof, inside the parapet

prism(stone, null, U, 0, Z_BASE, 0, 0)
prism(brick, null, U, Z_BASE, Z_ORDER, 0, 0)
prism(stone, null, U, Z_ORDER, Z_ENT, 0, 0)
// The cornice: a lip standing 0.45 m proud round the top of the entablature.
{
  const lip = (d: number): XY[] => {
    // offset the U outwards by d (its corners are all right angles)
    const s = (v: number, lo: number, hi: number) => (v === lo ? lo - d : v === hi ? hi + d : v)
    return U.map(([x, y]) => {
      const inCourt = x === CX0 || x === CX1 ? true : false
      const nx = inCourt ? (x === CX0 ? x + d : x - d) : s(x, X0, X1)
      const ny = y === CY ? y + d : s(y, YF, YB)
      return [nx, ny] as XY
    })
  }
  // its outer face, and rings over and under it (the wall fills the middle)
  const L = lip(0.45)
  prism(stone, null, L, Z_ENT - 0.6, Z_ENT, 0, 0)
  for (let i = 0; i < U.length; i++) {
    const j = (i + 1) % U.length
    stone.quad([...U[i], Z_ENT], [...L[i], Z_ENT], [...L[j], Z_ENT], [...U[j], Z_ENT])
    stone.quad([...U[j], Z_ENT - 0.6], [...L[j], Z_ENT - 0.6], [...L[i], Z_ENT - 0.6], [...U[i], Z_ENT - 0.6])
  }
}
// The parapet: a solid wall round the roof's edge, the roof inside it.
{
  const T = 0.5
  const outer = U
  const inner: XY[] = [[X0 + T, YF + T], [X1 - T, YF + T], [X1 - T, YB - T], [CX1 + T, YB - T], [CX1 + T, CY + T], [CX0 - T, CY + T], [CX0 - T, YB - T], [X0 + T, YB - T]]
  prism(stone, null, outer, Z_ENT, Z_TOP, 0, 0)
  // the inner face and the coping
  const lift = (r: XY[], z: number) => r.map(([x, y]): V3 => [x, y, z])
  stone.loft([lift([...inner].reverse(), Z_ROOF), lift([...inner].reverse(), Z_TOP)])
  for (let i = 0; i < outer.length; i++) {
    const j = (i + 1) % outer.length
    stone.quad([...inner[i], Z_TOP], [...outer[i], Z_TOP], [...outer[j], Z_TOP], [...inner[j], Z_TOP])
  }
  cap(roof, inner, Z_ROOF)
}
// The court's low roof.
prism(stone, roof, [[CX0, CY], [CX1, CY], [CX1, YB], [CX0, YB]], 0, 5.5, 0.4, 0)

// ---------------------------------------------------------------- facades
/** A wall face: origin on the wall, tangent along it, outward normal. */
type Face = { o: XY; t: XY; n: XY }
const P = (f: Face, s: number, z: number, d: number): V3 => [f.o[0] + f.t[0] * s + f.n[0] * d, f.o[1] + f.t[1] * s + f.n[1] * d, z]
const FRONT: Face = { o: [0, YF], t: [1, 0], n: [0, -1] }
const BACK_W: Face = { o: [(X0 + CX0) / 2, YB], t: [-1, 0], n: [0, 1] }
const BACK_E: Face = { o: [(CX1 + X1) / 2, YB], t: [-1, 0], n: [0, 1] }
const EAST: Face = { o: [X1, (YF + YB) / 2], t: [0, 1], n: [1, 0] }
const WEST: Face = { o: [X0, (YF + YB) / 2], t: [0, -1], n: [-1, 0] }

/** A flat panel on a face, from s0 to s1 along it and z0 to z1, d proud. */
function rect(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d = 0.05) {
  p.quad(P(f, s0, z0, d), P(f, s1, z0, d), P(f, s1, z1, d), P(f, s0, z1, d))
}
/** A round-headed panel: straight jambs to `spring`, a semicircle above. */
function arch(p: Part, f: Face, s0: number, s1: number, z0: number, spring: number, d = 0.05) {
  const r = (s1 - s0) / 2, c = (s0 + s1) / 2
  rect(p, f, s0, s1, z0, spring, d)
  const N = 8
  for (let k = 0; k < N; k++) {
    const a0 = (k / N) * Math.PI, a1 = ((k + 1) / N) * Math.PI
    p.tri(P(f, c, spring, d), P(f, c + r * Math.cos(a0), spring + r * Math.sin(a0), d), P(f, c + r * Math.cos(a1), spring + r * Math.sin(a1), d))
  }
}
/** A pilaster standing `d` proud of a face: its front, sides and top. */
function pilaster(p: Part, f: Face, s: number, w: number, z0: number, z1: number, d = 0.4) {
  const a = s - w / 2, b = s + w / 2
  p.quad(P(f, a, z0, d), P(f, b, z0, d), P(f, b, z1, d), P(f, a, z1, d))
  p.quad(P(f, a, z0, 0), P(f, a, z0, d), P(f, a, z1, d), P(f, a, z1, 0))
  p.quad(P(f, b, z0, d), P(f, b, z0, 0), P(f, b, z1, 0), P(f, b, z1, d))
  p.quad(P(f, a, z1, d), P(f, b, z1, d), P(f, b, z1, 0), P(f, a, z1, 0))
}

// The front: the stone frontispiece between the brick end pavilions.
const FX = 15.0 // the frontispiece's half-width
rect(stone, FRONT, -FX, FX, Z_BASE, Z_ORDER, 0.12)
const BAY = (2 * FX) / 7
const PIL = 1.0 // pilaster width
for (let k = 0; k <= 7; k++) pilaster(stone, FRONT, -FX + k * BAY, PIL, Z_BASE, Z_ORDER, 0.5)
// Two storeys of windows in the middle five bays; the end bays are blind.
const UPPER: [number, number][] = [[9.5, 13.7], [14.3, 18.1]]
for (let k = 1; k <= 5; k++) {
  const c = -FX + (k + 0.5) * BAY, w = 2.3
  for (const [z0, z1] of UPPER) rect(glass, FRONT, c - w / 2, c + w / 2, z0, z1, 0.17)
}
// One window a floor in each brick pavilion.
for (const c of [(X0 - 0 + -FX) / 2, (FX + X1) / 2]) {
  for (const [z0, z1] of UPPER) rect(glass, FRONT, c - 0.8, c + 0.8, z0 + 0.3, z1 - 0.3)
  arch(glass, FRONT, c - 0.8, c + 0.8, 3.0, 6.2)
}
// The arcade: five doorways up the steps, an arched window each end.
for (let k = 0; k <= 6; k++) {
  const c = -FX + (k + 0.5) * BAY
  if (k === 0 || k === 6) arch(glass, FRONT, c - 1.15, c + 1.15, 2.8, 6.1)
  else arch(glass, FRONT, c - 1.3, c + 1.3, 1.5, 6.1)
}
// The steps up to the doorways.
for (let s = 0; s < 3; s++) {
  const y0 = YF - 3.6 + s * 1.2
  prism(stone, stone, [[-FX + BAY * 0.7, y0], [FX - BAY * 0.7, y0], [FX - BAY * 0.7, YF + 0.1], [-FX + BAY * 0.7, YF + 0.1]], 0, 0.5 * (s + 1), 0, 0)
}

// The sides: five bays between six stone pilasters on brick.
for (const f of [EAST, WEST]) {
  const L = YB - YF, end = 3.3, bay = (L - 2 * end) / 5
  const s0 = -L / 2 + end
  for (let k = 0; k <= 5; k++) pilaster(stone, f, s0 + k * bay, PIL, Z_BASE, Z_ORDER, 0.4)
  for (let k = 0; k < 5; k++) {
    const c = s0 + (k + 0.5) * bay, w = 2.2
    for (const [z0, z1] of UPPER) rect(glass, f, c - w / 2, c + w / 2, z0, z1)
    arch(glass, f, c - 1.0, c + 1.0, 2.6, 5.8)
  }
  // a window a floor in the brick ends
  for (const c of [-L / 2 + end / 2, L / 2 - end / 2]) for (const [z0, z1] of UPPER) rect(glass, f, c - 0.65, c + 0.65, z0 + 0.3, z1 - 0.3)
}

// The back of the two wings: plain brick, two windows a floor.
for (const f of [BACK_W, BACK_E]) {
  for (const c of [-2.6, 2.6]) {
    for (const [z0, z1] of UPPER) rect(glass, f, c - 0.8, c + 0.8, z0 + 0.3, z1 - 0.3)
    rect(glass, f, c - 0.8, c + 0.8, 2.6, 6.2)
  }
}
// The court walls above the low roof: a window a floor per bay.
{
  const COURT_BACK: Face = { o: [(CX0 + CX1) / 2, CY], t: [-1, 0], n: [0, 1] }
  for (const c of [-5.5, -1.8, 1.8, 5.5]) for (const [z0, z1] of UPPER) rect(glass, COURT_BACK, c - 0.8, c + 0.8, z0 + 0.3, z1 - 0.3)
  const COURT_W: Face = { o: [CX0, (CY + YB) / 2], t: [0, 1], n: [1, 0] }
  const COURT_E: Face = { o: [CX1, (CY + YB) / 2], t: [0, -1], n: [-1, 0] }
  for (const f of [COURT_W, COURT_E]) for (const c of [-3.2, 0, 3.2]) for (const [z0, z1] of UPPER) rect(glass, f, c - 0.7, c + 0.7, z0 + 0.3, z1 - 0.3)
}

const parts = [
  { part: stone, material: PALETTE.stone },
  { part: brick, material: finish('mob-brick', 0xc29a83) },
  { part: roof, material: PALETTE.roof },
  { part: glass, material: PALETTE.window },
]
if (import.meta.main) {
  await save('lv-mob-museum', 'The Mob Museum', parts, Z_TOP, 'Y up, -Z north, +X east, metres, origin at ground')
}
