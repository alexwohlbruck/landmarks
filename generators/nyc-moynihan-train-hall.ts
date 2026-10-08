/**
 * Moynihan Train Hall / James A. Farley Building — procedural, CC0-1.0, no
 * textures.
 * bun generators/nyc-moynihan-train-hall.ts
 *
 * Map frame: x = model east (Eighth Avenue), y = model north (West 33rd
 * Street), z up, metres. Placed at bearing 29°, the Manhattan grid. Anchor:
 * area centroid of the OSM outline way/264667030, the whole block from
 * Eighth to Ninth Avenue.
 *
 * The granite Beaux-Arts block: a giant Corinthian colonnade of twenty
 * free-standing round columns (1.9 m across) across the Eighth Avenue
 * front, standing 4.6 m in front of a shaded wall under a pale
 * entablature, framed by the two end pavilions and raised on a
 * full-width stair of eight steps that runs out 7.6 m towards the avenue,
 * past the OSM outline as the real stair does; the side and Ninth Avenue
 * fronts drawn with the same giant order as pilasters between tall
 * two-storey windows, small attic windows above, and a run of arched
 * entrances midblock on 31st and 33rd Streets; a setback upper storey;
 * and the glass barrel vaults with arched steel trusses: four east–west
 * over the old mail court (the train hall) and one north–south over the
 * west court, as the USGS NAIP orthophoto shows them
 * (/tmp/city/nyc/work/nyc-moynihan-train-hall/cmp3.png).
 *
 * Evidence
 * - OSM way/264667030 (outline, 228 × 114 m) and its 46 parts: the outer
 *   ring (464922597/98), the raised inner blocks (464922596, -599, -642 and
 *   the skillions round the court), the four skylight vaults (890243248–51,
 *   x 37.5…85 here, in four bands across the court), the lower west court
 *   (1021258192), the rooftop pavilions (464922643/45/47, 1021258193/94/95,
 *   1021258264) and small roof structures.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), resampled in the model frame
 *   (/tmp/city/nyc/work/nyc-moynihan-train-hall/rot.png). Measured above the
 *   street: the outer roof 23–27 m, the inner raised roof about 28 m,
 *   rooftop pavilions about 34 m, the west court's roof about 10 m. The
 *   flight predates the train hall's new roof, so the vaults are from OSM
 *   and the published height below.
 * - Published: McKim, Mead & White, 1912–14, extended west 1935; Eighth
 *   Avenue colonnade of 20 Corinthian columns, 53 ft (16 m) tall, over a
 *   stair the width of the front (Wikipedia; NRHP 73001226). Moynihan Train
 *   Hall (SOM, 2021) under four curved skylights rising 92 ft (28 m) above
 *   the hall floor.
 * - Photos (Wikimedia Commons, daylight; from Eighth Avenue at 31st and
 *   33rd Streets, from 33rd Street, the south front):
 *   /tmp/city/nyc/work/nyc-moynihan-train-hall/photos/credits.txt.
 *
 * Heights used: cornice 27 m (OSM; the lidar's edge reads lower), the
 * setback storey 28.5 m (lidar), the hall's vaults springing at 18 m and
 * cresting at 29 m (published 28 m above the hall floor), the west court's
 * vault 16–25 m. Estimated: the storey divisions of the elevations (podium 5 m,
 * order to 21 m, entablature to 24 m, attic), the bay width (5.4 m, a little wider than the real 4.4 m), the
 * pilasters' size, the steps' depth, the vaults' rise, the place of the
 * arched street entrances (opposite the hall; the 33rd Street photo shows
 * them, their exact position along the street is estimated), the stair's
 * depth. The rooftop pavilions are plain boxes; the cornice's carving is
 * left out. No photo of the Ninth Avenue front was found, so it carries
 * the plain pilaster order.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, massing, type XY } from './nyc-570-lexington'

const stone = new Part(), win = new Part(), glass = new Part(), roof = new Part(), trim = new Part(), shade = new Part()

const CORNICE = 27, UPPER = 28.5, PODIUM = 5, ORDER = 21, ENT = 24

// Massing: the outer ring to the cornice, the setback upper storey, the
// courts and the rooftop pavilions, as a height field of boxes.
massing({
  wall: stone, win: null, roof, coping: trim, facade: null, bevel: 0.5,
  boxes: [
    // Outer ring (the portico zone on Eighth Avenue is left out).
    [-114, -57, -7.7, 57, CORNICE], [-7.7, -57, 12, -13, CORNICE], [-7.7, 45.7, 12, 57, CORNICE],
    [12, -57, 37.5, 57, CORNICE], [37.5, -57, 85, -34.5, CORNICE], [37.5, 34.9, 85, 57, CORNICE],
    [85, -57, 106, 57, CORNICE], [106, -57, 114, -44, CORNICE], [106, 44, 114, 57, CORNICE],
    // Setback upper storey.
    [-102.7, -44.5, -7.7, 44.5, UPPER], [-7.7, -44.5, 12, -13, UPPER], [12, -44.5, 37.5, 44.5, UPPER],
    [37.5, -44.5, 85, -34.5, UPPER], [37.5, 34.9, 85, 44.5, UPPER], [85, -44.5, 102, 44.5, UPPER],
    // The train hall court (under the vaults) and the lower west court.
    [37.5, -34.5, 85, 34.9, 18], [-7.7, -13, 12, 45.7, 16],
    // Rooftop pavilions on the west block.
    [-80.3, -17.5, -27, 18.6, 34], [-92.7, 5, -80, 34.6, 33], [-42.1, -41.2, -31.3, -29.9, 33], [-41.9, 21.3, -31.1, 32.6, 33],
  ],
})

/** A box from (x0, y0, z0) to (x1, y1, z1), five faces (no bottom). */
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
  p.quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1])
  p.quad([x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1])
  p.quad([x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1])
  p.quad([x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1])
  p.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1])
}

/**
 * Elevation detail on an outer wall a→b (counter-clockwise, so it faces
 * out): bays of about 4.6 m, each with a podium window, a tall two-storey
 * window in the order and a small attic window; pilasters of the giant
 * order between bays when `order` is set.
 */
function elevation(a: XY, b: XY, order: boolean, from = 0, to = 1, rows = 'poa', arches?: [number, number]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const n: XY = [uy, -ux]
  const s0 = L * from, s1 = L * to
  const bays = Math.max(1, Math.round((s1 - s0) / 5.4)), pitch = (s1 - s0) / bays
  const at = (s: number, z: number, d: number): V3 => [a[0] + ux * s + n[0] * d, a[1] + uy * s + n[1] * d, z]
  const panel = (p: Part, s: number, w: number, z0: number, z1: number, d = 0.06) =>
    p.quad(at(s - w / 2, z0, d), at(s + w / 2, z0, d), at(s + w / 2, z1, d), at(s - w / 2, z1, d))
  for (let k = 0; k < bays; k++) {
    const c = s0 + pitch * (k + 0.5)
    if (arches && c > arches[0] && c < arches[1]) {
      // An arched entrance through the podium and the order: a tall opening
      // with a semicircular head (10 segments).
      const w = pitch * 0.62, zs = ORDER - 4 - w / 2
      panel(win, c, w, 0.3, zs)
      for (let i = 0; i < 10; i++) {
        const t0 = Math.PI * i / 10, t1 = Math.PI * (i + 1) / 10
        win.tri(at(c, zs, 0.06), at(c + (w / 2) * Math.cos(t0), zs + (w / 2) * Math.sin(t0), 0.06), at(c + (w / 2) * Math.cos(t1), zs + (w / 2) * Math.sin(t1), 0.06))
      }
      if (rows.includes('a')) panel(win, c, pitch * 0.34, ENT + 0.6, CORNICE - 1.2)
    } else {
    if (rows.includes('p')) panel(win, c, pitch * 0.42, 1.4, PODIUM - 0.8)
    if (rows.includes('o')) panel(win, c, pitch * 0.4, PODIUM + 1.6, ORDER - 1.4)
    if (rows.includes('a')) panel(win, c, pitch * 0.34, ENT + 0.6, CORNICE - 1.2)
    }
    if (order && k > 0) {
      // Pilaster: a shallow box, with a pale capital block.
      const s = s0 + pitch * k, w = 1.3, d = 0.7
      const p0 = at(s - w / 2, 0, 0), p1 = at(s + w / 2, 0, 0)
      const q0 = at(s - w / 2, 0, d), q1 = at(s + w / 2, 0, d)
      const v = (p: V3, z: number): V3 => [p[0], p[1], z]
      stone.quad(v(q0, PODIUM), v(q1, PODIUM), v(q1, ORDER - 1), v(q0, ORDER - 1))
      stone.quad(v(p0, PODIUM), v(q0, PODIUM), v(q0, ORDER - 1), v(p0, ORDER - 1))
      stone.quad(v(q1, PODIUM), v(p1, PODIUM), v(p1, ORDER - 1), v(q1, ORDER - 1))
      const r0 = at(s - w / 2 - 0.25, 0, 0), r1 = at(s + w / 2 + 0.25, 0, 0), t0 = at(s - w / 2 - 0.25, 0, d + 0.25), t1 = at(s + w / 2 + 0.25, 0, d + 0.25)
      trim.quad(v(t0, ORDER - 1), v(t1, ORDER - 1), v(t1, ORDER), v(t0, ORDER))
      trim.quad(v(r0, ORDER - 1), v(t0, ORDER - 1), v(t0, ORDER), v(r0, ORDER))
      trim.quad(v(t1, ORDER - 1), v(r1, ORDER - 1), v(r1, ORDER), v(t1, ORDER))
      trim.quad(v(t0, ORDER), v(t1, ORDER), v(r1, ORDER), v(r0, ORDER))
    }
  }
  // A pale band at the entablature, the length of the wall.
  trim.quad(at(s0, ORDER, 0.08), at(s1, ORDER, 0.08), at(s1, ORDER + 0.9, 0.08), at(s0, ORDER + 0.9, 0.08))
}

// South (31st Street), north (33rd Street) and west (Ninth Avenue) fronts.
// The train hall's 31st and 33rd Street entrances: a run of arched
// openings midblock on each street front, opposite the hall (x 50…72).
elevation([-114, -57], [114, -57], true, 0, 1, 'poa', [50 + 114, 72 + 114])
elevation([114, 57], [-114, 57], true, 0, 1, 'poa', [114 - 72, 114 - 50])
elevation([-114, 57], [-114, -57], true)
// The south and north corner pavilions' Eighth Avenue faces: an arched window each.
for (const [y0, y1] of [[-57, -44], [44, 57]]) {
  const yc = (y0 + y1) / 2, w = 4.2, zb = PODIUM + 1.5, zs = ORDER - 3.5
  win.quad([114.06, yc - w / 2, zb], [114.06, yc + w / 2, zb], [114.06, yc + w / 2, zs], [114.06, yc - w / 2, zs])
  for (let i = 0; i < 8; i++) {
    const a0 = Math.PI * i / 8, a1 = Math.PI * (i + 1) / 8
    win.tri([114.06, yc, zs], [114.06, yc + (w / 2) * Math.cos(a0), zs + (w / 2) * Math.sin(a0)], [114.06, yc + (w / 2) * Math.cos(a1), zs + (w / 2) * Math.sin(a1)])
  }
  win.quad([114.06, yc - 1.4, ENT + 0.6], [114.06, yc + 1.4, ENT + 0.6], [114.06, yc + 1.4, CORNICE - 1.2], [114.06, yc - 1.4, CORNICE - 1.2])
}

// The Eighth Avenue portico: the shaded wall 6 m behind the colonnade,
// the stylobate, the full-width stair down to the avenue, twenty giant
// columns 1.9 m across, and the entablature and attic over them.
const WALL_X = 106, COL_X = 110.6, STY_X = 112.6
shade.quad([WALL_X + 0.02, -44, PODIUM], [WALL_X + 0.02, 44, PODIUM], [WALL_X + 0.02, 44, ORDER], [WALL_X + 0.02, -44, ORDER])
elevation([WALL_X + 0.02, -44], [WALL_X + 0.02, 44], false, 0, 1, 'o')
shade.quad([WALL_X, 44, ORDER - 0.02], [114, 44, ORDER - 0.02], [114, -44, ORDER - 0.02], [WALL_X, -44, ORDER - 0.02]) // soffit
box(stone, WALL_X, -44, 0, STY_X, 44, PODIUM)                 // stylobate
// The stair: eight steps of 0.62 m, 0.95 m deep, the full width between the pavilions.
for (let i = 0; i < 8; i++) {
  const x0 = STY_X + i * 0.95, h = PODIUM * (1 - (i + 1) / 9)
  box(stone, x0, -44, 0, x0 + 0.95, 44, h)
}
// Entablature (a pale band, 3 m) and the attic over the portico.
box(trim, WALL_X, -44, ORDER, 114, 44, ENT)
box(stone, WALL_X, -44, ENT, 114, 44, CORNICE)
elevation([114, -44], [114, 44], false, 0, 1, 'a')
for (let k = 0; k < 20; k++) {
  const y = -41.6 + (83.2 * k) / 19, x = COL_X, r = 0.95, n = 12, top = ORDER - 1.6
  const ring = Array.from({ length: n }, (_, i) => [x + r * Math.cos((i * 2 * Math.PI) / n), y + r * Math.sin((i * 2 * Math.PI) / n)] as XY)
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    const na: V3 = [(a[0] - x) / r, (a[1] - y) / r, 0], nb: V3 = [(b[0] - x) / r, (b[1] - y) / r, 0]
    stone.tri([a[0], a[1], PODIUM + 0.8], [b[0], b[1], PODIUM + 0.8], [b[0], b[1], top], undefined, undefined, undefined, [na, nb, nb])
    stone.tri([a[0], a[1], PODIUM + 0.8], [b[0], b[1], top], [a[0], a[1], top], undefined, undefined, undefined, [na, nb, na])
  }
  box(trim, x - 1.25, y - 1.25, PODIUM, x + 1.25, y + 1.25, PODIUM + 0.8)  // base
  box(trim, x - 1.35, y - 1.35, top, x + 1.35, y + 1.35, ORDER)            // capital and abacus
}

// The train hall: four glass barrel vaults over the old mail court, axes
// east–west as in the NAIP orthophoto, springing at 18 m and cresting at
// 29 m, with an arched steel truss every 8 m.
/** A glass barrel vault from u0 to u1 along its axis, spanning v0…v1, with trusses. */
function vault(axis: 'x' | 'y', u0: number, u1: number, v0: number, v1: number, zs: number, rise: number) {
  const P = (u: number, v: number, z: number): V3 => (axis === 'x' ? [u, v, z] : [v, u, z])
  const vc = (v0 + v1) / 2, h = (v1 - v0) / 2, S = 10
  const pt = (i: number): [number, number] => { const t = Math.PI * i / S; return [vc - h * Math.cos(t), zs + rise * Math.sin(t)] }
  const flip = axis === 'y' // swapping axes mirrors the winding
  const q = (p: Part, a: V3, b: V3, c: V3, d: V3) => (flip ? p.quad(d, c, b, a) : p.quad(a, b, c, d))
  const t = (p: Part, a: V3, b: V3, c: V3) => (flip ? p.tri(a, c, b) : p.tri(a, b, c))
  for (let i = 0; i < S; i++) {
    const [va, za] = pt(i), [vb, zb] = pt(i + 1)
    q(glass, P(u0, va, za), P(u1, va, za), P(u1, vb, zb), P(u0, vb, zb))
    t(glass, P(u1, vc, zs), P(u1, vb, zb), P(u1, va, za))
    t(glass, P(u0, vc, zs), P(u0, va, za), P(u0, vb, zb))
  }
  const n = Math.max(2, Math.round((u1 - u0) / 8))
  for (let k = 0; k <= n; k++) {
    const u = u0 + 0.4 + ((u1 - u0 - 0.8) * k) / n
    for (let i = 0; i < S; i++) {
      const [va, za] = pt(i), [vb, zb] = pt(i + 1)
      q(trim, P(u - 0.35, va, za + 0.12), P(u + 0.35, va, za + 0.12), P(u + 0.35, vb, zb + 0.12), P(u - 0.35, vb, zb + 0.12))
    }
  }
}
for (const [y0, y1] of [[-34.4, -13.2], [-13.2, 1.6], [1.6, 16.3], [16.3, 34.9]]) vault('x', 37.5, 85, y0, y1, 18, 11)
// The west court's single vault, running north–south (NAIP), springing at
// 16 m and cresting at 25 m.
vault('y', -13, 45.7, -7.7, 12, 16, 9)

finishModel('Moynihan Train Hall', 'nyc-moynihan-train-hall', [
  { part: stone, material: finish('farley-granite', 0xe9e2d4) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
  { part: roof, material: PALETTE.roof },
  { part: shade, material: finish('farley-portico-shade', 0xb8b0a3) },
], { bearing: 29, osm: 'way/264667030', height: 34 }, 6500)
