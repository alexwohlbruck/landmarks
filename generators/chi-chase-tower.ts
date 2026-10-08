/**
 * Chase Tower (10 South Dearborn, 1969, C.F. Murphy Associates and Perkins
 * & Will; built as the First National Bank Building), Chicago — original
 * procedural geometry, CC0-1.0.
 * bun generators/chi-chase-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/230613007,
 * 41.881623,-87.630138. Its walls run at 359.2° / 89.2°, so the catalog
 * bearing is 359.2 and the tower is square to its own frame.
 *
 * Identity, in order: the two broad faces (north and south) sweeping inward
 * in one long concave curve from a deep base to a slim top, so the narrow
 * ends read as an A; the plain granite end cores standing straight up the
 * middle of each end; the close vertical piers over dark window bands on
 * the broad faces; the flat top with its mechanical blocks.
 *
 * Evidence:
 *  - plan: OSM outline and parts. Base 86.6 m E-W (faces at ±43.3) and
 *    59.4 m N-S; the end cores 20.8 m wide, standing 5.1 m out (to ±48.5);
 *    at the top the parts give 30 m N-S (strips at ±15). Published: floor
 *    plates diminish from about 200 ft (61 m) deep at the base; 60 storeys.
 *  - heights: 259 m (850 ft) to the roof, published; OSM 252 m for the main
 *    roof and 259 m for the cores and the middle strip, kept as such.
 *  - the curve: the depth runs 59.4 m → 30 m as a concave sweep, steepest
 *    at the base and nearly plumb at the top (d = 15 + 14.7 (1 − t)^2),
 *    fitted by eye to Andrew Horne's view from above (south-west) and the
 *    Chicago Architecture Today and SecretName101 views up the faces
 *    (estimate: no published profile).
 *  - piers: fourteen bays a broad face (GregMcCollum's photo from the
 *    north-east, John Picken's from the plaza); the windows are drawn as
 *    one panel per bay per four storeys, the piers and a spandrel band
 *    between groups showing in granite.
 *  - colour: pale grey granite (finish, pulled light), dark window bands.
 *
 * Photos (Wikimedia Commons): Chicago-00_(Chase_Tower).jpg (Andrew Horne,
 * CC BY 2.0); Chase_Tower_Chicago_March_29_2025.jpg (GregMcCollum, CC0);
 * Chase_Tower,_Chicago.jpg (John Picken, CC BY 2.0); Chase_Tower_exterior_1
 * _(7374045476).jpg (Chicago Architecture Today, CC BY 2.0);
 * Chase_Tower_20180613_151408.jpg (SecretName101, CC BY-SA 4.0);
 * Chase_Tower_in_Chicago.jpg (Monika Thorpe, CC BY 2.0);
 * Chase_Tower_060514.jpg (JeremyA, CC BY-SA 2.5). No commercial imagery.
 *
 * Left out: the sunken plaza (the map's), the lobby glazing's mullions,
 * the individual floors' window bands.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, save, walls, type XY } from './chi-aon-center'
import { box } from './chi-board-of-trade'

const granite = new Part(), win = new Part(), roof = new Part()

const CY = -0.5 // the plan's centre line N-S
const HX = 43.3, CX = 48.5, CORE = 10.4 // broad-face half-length, core face, core half-width
const D0 = 29.7, D1 = 15.0, TOP = 252, CORETOP = 259
const depth = (z: number) => D1 + (D0 - D1) * Math.pow(1 - z / TOP, 2.0)

/** The plan at height z, counter-clockwise from the south-west corner. */
const ring = (z: number): XY[] => {
  const d = depth(z)
  return [
    [-HX, CY - d], [HX, CY - d], [HX, CY - CORE], [CX, CY - CORE], [CX, CY + CORE], [HX, CY + CORE],
    [HX, CY + d], [-HX, CY + d], [-HX, CY + CORE], [-CX, CY + CORE], [-CX, CY - CORE], [-HX, CY - CORE],
  ]
}

/** A panel on the planar quad a,b (bottom) c,d (top): u along, v up, set `out` proud. */
function onQuad(p: Part, q: [V3, V3, V3, V3], u0: number, u1: number, v0: number, v1: number, out = 0.06) {
  const [a, b, c, d] = q
  const e1: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2: V3 = [d[0] - a[0], d[1] - a[1], d[2] - a[2]]
  const n: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  const l = Math.hypot(...n)
  const at = (u: number, v: number): V3 => {
    const lo = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]
    const hi = [d[0] + (c[0] - d[0]) * u, d[1] + (c[1] - d[1]) * u, d[2] + (c[2] - d[2]) * u]
    return [lo[0] + (hi[0] - lo[0]) * v + n[0] / l * out, lo[1] + (hi[1] - lo[1]) * v + n[1] / l * out, lo[2] + (hi[2] - lo[2]) * v + n[2] / l * out]
  }
  p.quad(at(u0, v0), at(u1, v0), at(u1, v1), at(u0, v1))
}

// Levels: the lobby, then four-storey bands of ~16 m up to the roof. Each
// band is one window group: a panel per bay between the granite piers,
// with a spandrel band between groups (never a floor-by-floor grid).
const LOBBY = 12
const levels = [0, LOBBY]
for (let z = LOBBY; z < TOP - 1;) { z = Math.min(TOP, z + (TOP - LOBBY) / 15); levels.push(z) }
const rings = levels.map(ring)
for (let k = 0; k < levels.length - 1; k++) walls(granite, rings[k], levels[k], levels[k + 1], rings[k + 1])

// Roof with a bevelled parapet; the cores and the middle strip rise to 259 m.
{
  const r = ring(TOP)
  walls(granite, r, TOP, TOP + 0.6, inset(r, 0.4))
  cap(roof, inset(r, 0.4), TOP + 0.6)
  for (const s of [-1, 1]) box(granite, roof, s < 0 ? -CX : HX - 3, CY - CORE, s < 0 ? -HX + 3 : CX, CY + CORE, TOP, CORETOP, 0.4)
  // Mechanical blocks along the middle, with gaps between them.
  const n = 6, span = 2 * (HX - 3), w = span / n
  for (let i = 0; i < n; i++) {
    const x0 = -HX + 3 + i * w + 1.0, x1 = x0 + w - 2.0
    box(granite, roof, x0, CY - CORE + 1, x1, CY + CORE - 1, TOP, CORETOP - 1.5, 0.4)
  }
}

// Windows, segment by segment, on the planar faces between levels.
const BAYS = 14
for (let k = 0; k < levels.length - 1; k++) {
  const r0 = rings[k], r1 = rings[k + 1], z0 = levels[k], z1 = levels[k + 1]
  const lobby = k === 0
  const Q = (i: number): [V3, V3, V3, V3] => {
    const j = (i + 1) % r0.length
    return [[r0[i][0], r0[i][1], z0], [r0[j][0], r0[j][1], z0], [r1[j][0], r1[j][1], z1], [r1[i][0], r1[i][1], z1]]
  }
  const v0 = lobby ? 0.06 : 0.07, v1 = lobby ? 0.85 : 0.93
  // Broad faces (south i=0, north i=6): fourteen bays between the piers.
  for (const i of [0, 6]) {
    for (let b = 0; b < BAYS; b++) onQuad(win, Q(i), (b + 0.24) / BAYS, (b + 0.76) / BAYS, v0, v1)
  }
  // End walls either side of the cores: one band each, shrinking with the plan.
  for (const i of [1, 5, 7, 11]) onQuad(win, Q(i), 0.18, 0.82, v0, v1)
  // The cores' single slot of windows, and their glazed sides.
  for (const i of [3, 9]) onQuad(win, Q(i), 0.45, 0.55, v0, v1)
}

await save('chi-chase-tower', 'Chase Tower', [41.881623, -87.630138], 359.2, [
  { part: granite, material: finish('chase-granite', 0xe6e3dd) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
], 6500)
