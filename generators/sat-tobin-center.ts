/**
 * Tobin Center for the Performing Arts, San Antonio: procedural, CC0-1.0.
 * bun generators/sat-tobin-center.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is OSM's
 * outline centroid (way/296769581: -98.4886981, 29.4306853). y = 0 is the
 * lowest ground under the footprint, the River Walk on the north side;
 * the streets on the south are 6.5 m higher (2017 lidar ground).
 *
 * The 1926 Municipal Auditorium (Atlee B. and Robert M. Ayres, with George
 * Willis and Emmett Jackson), rebuilt in 2014 by LMN Architects with
 * Marmon Mok: the limestone Spanish Colonial / Moorish front on the south
 * (a loggia of five round arches between two towers capped by small yellow
 * tile domes) was kept, and the hall behind it wrapped and topped by a new
 * hall and fly tower clad in a skin of perforated aluminium panels, lit by
 * LEDs in changing colours at night.
 *
 * Measured (lidar USGS_LPC_TX_Central_B2_2017_LAS_2019, flown 2017, after
 * the 2014 rebuild; heights above y = 0):
 * - the fly tower box 36.5 m (x -11..30, y 15..30), its skin rising to
 *   about 39 m at the edges;
 * - the hall 29.5 m (x -14..22, y -30..14);
 * - the historic front block 20 m (x -26..12, y -45..-31), its towers
 *   centred at x -21 and +9, to about 26 m with their domes;
 * - the west wing 18.5 m, the east wing 14 m, lower wings 11-13 m.
 * From photos: the five arches, the towers' belfry arches and domes, the
 * limestone, the skin's light silver and its dense vertical slits (drawn,
 * after review, as grouped relief: shallow fins in threes, 0.9 m apart,
 * 1.8 m of plain skin between groups; the fly tower's top 3.6 m a
 * screen band standing out from the wall, the perforated crown), the glass lobby on the
 * east.
 * Estimated: the tower plan (6.8 m square), the domes (6 m across,
 * 4 m high, on the lidar's 26.6 m top), the arches' height and width,
 * the domes' size, the lobby's extent, the wings' plans (rectangles fitted
 * to the lidar).
 * Left out: the plaza steps, the LED screen on the east lobby, ornament.
 *
 * OSM: way/296769581 (outline, no parts), replaced. The model stays inside
 * it; the low parts of the outline the lidar shows at ground level are
 * left open.
 *
 * Night: the metal skin is `neon`, washed in its own pale colour (the real
 * LEDs change colour; kept neutral here); the limestone front is floodlit;
 * the arches and lobby glass are `window`.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Tobin Center (48875069586).jpg", Eden, Janine and Jim, CC BY 2.0 (the historic front)
 * - "Tobin Center.jpg", Corey Leopold, CC BY 2.0 (from the River Walk, north-west)
 * - "TCFTPA Nima 01.JPG", "TCFTPA Nima 04.JPG", Nightryder84, CC BY-SA 4.0 (the skin, the east lobby)
 * No look-only sources used.
 *
 * Doubts: the wings' exact plans; the north (river) side, seen only from afar.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ring, walls, capPoly, box, bayPanels, type XY } from './sat-frost-tower'

const stone = new Part()
const skin = new Part()
const win = new Part()
const roofP = new Part()
const dome = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
/** A triangle / quad wound to face direction n. */
function tf(p: Part, a: V3, b: V3, c: V3, n: V3) {
  if (dot(cross(sub(b, a), sub(c, a)), n) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
const qf = (p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) => { tf(p, a, b, c, n); tf(p, a, c, d, n) }
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => ring([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
const block = (p: Part, P: XY[], z1: number, z0 = 0) => {
  walls(p, P, z0, z1)
  capPoly(roofP, P, z1, true)
}

// ---------------------------------------------------------- the new hall ---
block(skin, rect(-11, 30, 15, 30), 36.5)
// the skin's raised edge round the fly tower's roof
{
  const O = rect(-11, 30, 15, 30), I = rect(-10.6, 29.6, 15.4, 29.6)
  walls(skin, O, 36.5, 38.8)
  walls(skin, I.slice().reverse() as XY[], 36.5, 38.8)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    qf(skin, [O[i][0], O[i][1], 38.8], [O[j][0], O[j][1], 38.8], [I[j][0], I[j][1], 38.8], [I[i][0], I[i][1], 38.8], [0, 0, 1])
  }
}
block(skin, rect(-14, 22, -30, 15), 29.5)
/**
 * The skin's relief: shallow vertical fins in groups of three, 0.9 m
 * apart, with 1.8 m of plain skin between groups, on every outer wall of
 * a skin block from z0 to z1, skipping edges in `skip`.
 */
function fins(P: XY[], z0: number, z1: number, skip: (i: number) => boolean = () => false) {
  const W = 0.22, D = 0.4
  for (let i = 0; i < P.length; i++) {
    if (skip(i)) continue
    const a = P[i], b = P[(i + 1) % P.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
    const N: V3 = [n[0], n[1], 0]
    const groups: number[] = []
    for (let u = 1.6; u + 1.8 < L - 1.0; u += 4.5) groups.push(u, u + 0.9, u + 1.8)
    for (const u of groups) {
      const c: XY = [a[0] + t[0] * u, a[1] + t[1] * u]
      const p = (du: number, dn: number, z: number): V3 => [c[0] + t[0] * du + n[0] * dn, c[1] + t[1] * du + n[1] * dn, z]
      qf(skin, p(-W, D, z0), p(W, D, z0), p(W, D, z1), p(-W, D, z1), N)
      qf(skin, p(W, 0, z0), p(W, D, z0), p(W, D, z1), p(W, 0, z1), [t[0], t[1], 0])
      qf(skin, p(-W, D, z0), p(-W, 0, z0), p(-W, 0, z1), p(-W, D, z1), [-t[0], -t[1], 0])
      qf(skin, p(-W, 0, z1), p(W, 0, z1), p(W, D, z1), p(-W, D, z1), [0, 0, 1])
    }
  }
}
// rect(...) rings run south, east, north, west (edges 0..3)
fins(rect(-11, 30, 15, 30), 1.0, 32.6)
fins(rect(-14, 22, -30, 15), 1.0, 28.6, (i) => i === 2)
fins(rect(-44, -14, -26, 14), 1.0, 17.8, (i) => i === 1)
fins(rect(22, 46, 8, 38), 1.0, 13.4, (i) => i === 3)
fins(rect(-30, 6, 34, 42), 1.0, 11.8)
fins(rect(-48, -38, 26, 42), 1.0, 11.8)
// The fly tower's crown: a perforated screen band standing 0.5 m out of
// the wall over its top 3.6 m.
{
  const O = rect(-11.5, 30.5, 14.5, 30.5)
  walls(skin, O, 32.9, 36.5)
}
// wings
block(skin, rect(-44, -14, -26, 14), 18.5)
block(skin, rect(22, 46, 8, 38), 14.0)
block(skin, rect(-48, -38, 26, 42), 12.5)
block(skin, rect(-30, 6, 34, 42), 12.5)
block(stone, rect(-46, -26, -44, -31), 13.0)
block(stone, rect(12, 32, -44, -36), 12.5)
// the glass lobby on the east side, between the hall and the east wing
block(win, rect(22, 32, -30, 8), 12.0)

// ------------------------------------------------- the historic front ---
const STREET = 6.5
block(stone, rect(-26, 12, -45, -31), 20.0)
// the loggia: five round-headed arches on the south face between the towers
{
  const y = -45.06, xs = -16.6, xe = 4.6, n = 5, w = (xe - xs) / n, aw = w * 0.72
  for (let k = 0; k < n; k++) {
    const cx = xs + w * (k + 0.5), z0 = STREET + 0.3, z1 = STREET + 10.0, r = aw / 2
    qf(win, [cx + r, y, z0], [cx - r, y, z0], [cx - r, y, z1], [cx + r, y, z1], [0, -1, 0])
    for (let j = 0; j < 8; j++) {
      const a0 = (Math.PI * j) / 8, a1 = (Math.PI * (j + 1)) / 8
      tf(win, [cx, y, z1], [cx + r * Math.cos(a1), y, z1 + r * Math.sin(a1)], [cx + r * Math.cos(a0), y, z1 + r * Math.sin(a0)], [0, -1, 0])
    }
  }
  // windows along the front block's upper floor
  bayPanels(win, rect(-26, 12, -45, -31), [[STREET + 12.5, STREET + 15.5]], 1.6, 2.2, 3, (i) => i === 0)
}
// the towers: square shafts with a belfry arch on each face, a cornice and a dome
for (const cx of [-21, 9]) {
  const cy = -42.2, h = 3.4, top = 23.2
  box(stone, cx, cy, h, h, 0, top)
  box(stone, cx, cy, h + 0.4, h + 0.4, top - 0.8, top)
  // belfry openings, flush dark arches on each face
  for (const [nx, ny] of [[0, -1], [0, 1], [1, 0], [-1, 0]] as XY[]) {
    const fx = cx + nx * (h + 0.04), fy = cy + ny * (h + 0.04), tx = -ny, ty = nx, r = 1.0
    const P = (u: number, z: number): V3 => [fx + tx * u, fy + ty * u, z]
    const z0 = 15.2, z1 = 19.4
    const q = [P(-r, z0), P(r, z0), P(r, z1), P(-r, z1)]
    qf(win, q[0], q[1], q[2], q[3], [nx, ny, 0])
    for (let j = 0; j < 6; j++) {
      const a0 = (Math.PI * j) / 6, a1 = (Math.PI * (j + 1)) / 6
      tf(win, P(0, z1), P(r * Math.cos(a0), z1 + r * Math.sin(a0)), P(r * Math.cos(a1), z1 + r * Math.sin(a1)), [nx, ny, 0])
    }
  }
  // the yellow tile dome on a short drum
  const K = 12, R = 3.0
  const ringAt = (rr: number, z: number): V3[] => Array.from({ length: K }, (_, k) => [cx + rr * Math.cos((2 * Math.PI * k) / K), cy + rr * Math.sin((2 * Math.PI * k) / K), z])
  const prof: [number, number][] = [[R, top], [R, top + 0.6], [R * 0.95, top + 1.5], [R * 0.78, top + 2.6], [R * 0.5, top + 3.5], [0.01, top + 4.0]]
  for (let s = 0; s < prof.length - 1; s++) {
    const A = ringAt(prof[s][0], prof[s][1]), B = ringAt(prof[s + 1][0], prof[s + 1][1])
    for (let k = 0; k < K; k++) {
      const k2 = (k + 1) % K
      const m = A[k], nn: V3 = [m[0] - cx, m[1] - cy, 0.6]
      qf(dome, A[k], A[k2], B[k2], B[k], nn)
    }
  }
}

// ----------------------------------------------------------------- output ---
// Colours from daylight photos, pulled to the palette's lightness: the
// cream limestone, the skin's pale silver, the domes' yellow tile.
const frontLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : p[1] < -30 ? 0.85 : 0.2)
const parts = [
  { part: stone, material: { ...finish('tobin-limestone', 0xeadcc3), floodlight: frontLit } },
  { part: skin, material: finish('neon-tobin-skin', 0xd0d3d7) },
  { part: win, material: PALETTE.window },
  { part: roofP, material: PALETTE.roof },
  { part: dome, material: { ...finish('tobin-dome-tile', 0xd9b968), floodlight: () => 0.6 } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Tobin Center for the Performing Arts', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 38.8, anchor: [29.4306853, -98.4886981], replaces: ['way/296769581'],
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/sat-tobin-center.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
