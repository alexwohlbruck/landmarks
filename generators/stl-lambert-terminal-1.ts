/**
 * Lambert–St. Louis Municipal Airport Terminal (Terminal 1 main terminal),
 * 1956; Minoru Yamasaki (Hellmuth, Yamasaki & Leinweber), engineered by
 * Anton Tedesko — original procedural geometry, CC0-1.0.
 * bun generators/stl-lambert-terminal-1.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 32.2: +x runs along the row of vaults. Anchor =
 * the centre of the four vault units (the four OSM building=roof ways
 * way/176906196, way/176906202, way/176906197, way/176906199),
 * -90.3659872, 38.7427700.
 *
 * Scope: only the original vaulted hall. OSM's "Terminal 1" outline
 * (way/25750752) covers the hall plus the later wings, link buildings and
 * concourse connectors (about 360 x 105 m), so it is NOT in `replaces`:
 * replacing it would blank the later parts. The map will keep drawing that
 * outline (untagged height: a low extrusion) inside and around the vaults;
 * the lead may prefer to split it in OSM.
 *
 * Identity (from the photos below):
 *  1. Four identical intersecting-barrel (cross) vaults in a row, each
 *     44.6 m square, their dark standing-seam metal roofs meeting in valleys
 *     between units; a continuous barrel runs the length of the row.
 *  2. Every vault end is a huge glazed lunette under a thick, pale concrete
 *     arch rim that comes nearly to the ground at the corners.     (p6, p8)
 *
 * Geometry: each unit is the union of two barrels of elliptical section
 * (z = H·√(1 − (d/22.3)²)), which fits the lidar's sections; their union
 * splits each unit into four triangular barrel sectors meeting on the
 * diagonals (the groins).
 *
 * Heights: USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018 (flown 2017),
 * 1 m grid with class 18 kept; y = 0 is the ground on the airfield (north)
 * side, 1 m over the box's ground_min; the departures drive on the south
 * side is a deck about 8 m up. Measured: the crowns 18.5 above that ground,
 * the barrel section 16 at 8 m off the crown line, 12 at 16 m, 8 at 20 m.
 * Estimated from p6, p8: the rim (1.2 m deep, 1.4 m thick), the lunettes'
 * mullion grid (about 3.6 m, a transom at 9 m).
 * Left out: the roof's seams, the skylight strips between units, the later
 * additions round the hall.
 *
 * Night: the lunettes glow; the rims are floodlit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  p6, p8  "Terminal 1, St. Louis Lambert International Airport, St. Louis, MO - 52832831855.jpg" and
 *          "... - 52832875783.jpg", w_lemay,
 *          CC BY-SA 2.0 (a lunette end, the roof)
 *  p1  "Lambert-terminal.jpg", CC BY-SA 3.0 (inside: the vaults and the arch ribs)
 *  p5  "Main Terminal, Lambert-St. Louis International Airport.jpg", Matthew Hurst, CC BY-SA 2.0 (inside)
 * No look-only sources. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { finish, windowVariant } from './palette'
import { save, type XY } from './atl-tech-tower'

const roof = new Part(), rim = new Part(), glass = new Part(), frame = new Part()
const HW = 22.3, H = 18.5
const E = (d: number) => H * Math.sqrt(Math.max(0, 1 - (d / HW) ** 2))
const tri = (p: Part, a: V3, b: V3, c: V3, out: V3) => {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}
const CENTRES = [-66.9, -22.3, 22.3, 66.9]
const ROWS = 6, COLS = 12

for (const cx of CENTRES) {
  // four sectors: dir is the barrel's outward axis (the lunette side), d is across it
  for (const [ax, ay] of [[0, 1], [0, -1], [1, 0], [-1, 0]] as [number, number][]) {
    const across: XY = [ay, -ax] // perpendicular in plan
    const P = (t: number, s: number): V3 => {
      const along = t * HW, d = s * t * HW
      return [cx + ax * along + across[0] * d, ay * along + across[1] * d, E(d)]
    }
    for (let i = 0; i < ROWS; i++) for (let j = 0; j < COLS; j++) {
      const t0 = i / ROWS, t1 = (i + 1) / ROWS, s0 = -1 + (2 * j) / COLS, s1 = -1 + (2 * (j + 1)) / COLS
      const a = P(t0, s0), b = P(t0, s1), c = P(t1, s1), d = P(t1, s0)
      const o: V3 = [0, 0, 1]
      if (i === 0) tri(roof, a, c, d, o)
      else { tri(roof, a, b, c, o); tri(roof, a, c, d, o) }
    }
    // the outer ends only: the y-sectors of every unit, the x-sectors of the end units
    const endX = ax !== 0 && ((ax > 0 && cx === CENTRES[3]) || (ax < 0 && cx === CENTRES[0]))
    if (ax !== 0 && !endX) continue
    // the lunette glazing in the end plane, a mullion grid, and the pale rim
    const plane = HW, o: V3 = [ax, ay, 0]
    const at = (d: number, z: number, out = 0): V3 => [cx + ax * (plane + out) + across[0] * d, ay * (plane + out) + across[1] * d, z]
    const N = 16
    const arch: V3[] = []
    for (let k = 0; k <= N; k++) { const d = -HW + (2 * HW * k) / N; arch.push(at(d, E(d) - 0.6, -0.3)) }
    const base = at(0, 0, -0.3)
    for (let k = 0; k < N; k++) tri(glass, base, arch[k], arch[k + 1], o)
    // mullions every ~3.6 m and a transom at 9 m
    for (let d = -HW + 3.7; d < HW - 1; d += 3.7) {
      const zTop = E(d) - 0.7
      tri(frame, at(d - 0.1, 0, -0.15), at(d + 0.1, 0, -0.15), at(d + 0.1, zTop, -0.15), o)
      tri(frame, at(d - 0.1, 0, -0.15), at(d + 0.1, zTop, -0.15), at(d - 0.1, zTop, -0.15), o)
    }
    const dT = HW * Math.sqrt(1 - (9 / H) ** 2) - 0.8 // the transom at 9 m
    tri(frame, at(-dT, 8.9, -0.15), at(dT, 8.9, -0.15), at(dT, 9.1, -0.15), o)
    tri(frame, at(-dT, 8.9, -0.15), at(dT, 9.1, -0.15), at(-dT, 9.1, -0.15), o)
    // the rim: a thick band following the arch, standing proud of the glass
    for (let k = 0; k < N; k++) {
      const d0 = -HW + (2 * HW * k) / N, d1 = -HW + (2 * HW * (k + 1)) / N
      const p0 = at(d0, E(d0) + 0.1, 0.9), p1 = at(d1, E(d1) + 0.1, 0.9), q0 = at(d0, E(d0) - 1.4, 0.9), q1 = at(d1, E(d1) - 1.4, 0.9)
      tri(rim, p0, p1, q1, o); tri(rim, p0, q1, q0, o) // the face
      const r0 = at(d0, E(d0) - 1.4, -0.3), r1 = at(d1, E(d1) - 1.4, -0.3)
      tri(rim, q0, q1, r1, [0, 0, -1]); tri(rim, q0, r1, r0, [0, 0, -1]) // the soffit
      const t0 = at(d0, E(d0) + 0.1, -0.3), t1 = at(d1, E(d1) + 0.1, -0.3)
      tri(rim, p0, p1, t1, [0, 0, 1]); tri(rim, p0, t1, t0, [0, 0, 1]) // the top
    }
  }
}

const lit = (p: V3, n: V3) => (Math.abs(n[2]) < 0.6 ? 0.9 : 0.2)
await save('stl-lambert-terminal-1', 'Lambert Airport Terminal 1 (Yamasaki vaults)', [
  { part: roof, material: finish('stl-lambert-roof', 0x5f6872) },
  { part: rim, material: { ...finish('stl-lambert-concrete', 0xe6e2d8), floodlight: lit } },
  { part: glass, material: windowVariant(2, 0xa9bfd1) },
  { part: frame, material: finish('stl-lambert-mullions', 0xc9cdd0) },
], { height: H, anchor: [38.74277, -90.3659872], bearing: 32.2 })
