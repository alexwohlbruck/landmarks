/**
 * Rosson House, Heritage Square, Phoenix, Arizona (1895, A. P. Petit;
 * restored 1970s–80s, now the Rosson House Museum) — original procedural
 * geometry, CC0-1.0.
 * bun generators/phx-rosson-house.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: the walls run
 * north–south and east–west. Anchor -112.0659406, 33.4502015, the area
 * centroid of OSM's outline way/109818819 (house and porches), the only
 * OSM building the model covers; the carriage house and the Lath House
 * Pavilion nearby are separate buildings.
 *
 * Identity (from the photos below):
 *  1. Red brick, two tall storeys, under steep gold-painted metal roofs:
 *     a hip with gables on every side, and tall brick chimneys.  (w, nw)
 *  2. The octagonal turret at the north-west corner, rising a stage over
 *     the eaves, with a tall gold octagonal spire and a finial.  (w, nw)
 *  3. The wrap-around porch on the west, south and east, its roof on dark
 *     green turned posts with a green frieze, and the green gable trim.
 *                                                  (w, nw, gob)
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020, 0.5 m
 * grid, tools/lidar.py, read with tools/lidar_frame.py; ground 0.4 above
 * ground_min, flat; y = 0 is the ground). Measured: the eaves 9.0; the
 * main ridge 14.8 over x 0..4; the north gable 12.0; the turret's spire
 * 18.3 (the lidar's top over it; the finial drawn to 20); the chimneys
 * about 15 (drawn 15.6, the photos show them clear of the ridge); the
 * porch roofs 4.9. Mapterhorn: flat; elevation 0.
 * Plan: the house body x -6..10, y -5..7.3 and the porches from OSM's
 * outline and the lidar's roof edges; the turret centred on the lidar's
 * spire.
 *
 * Estimated: the gables' size and pitch, the window sizes and positions
 * (one panel per real window, from w and nw; the east face's windows are
 * not photographed and mirror the west's), the turret's radius (2.4 m),
 * the porch's post spacing. Left out: the iron cresting on the ridges,
 * the balcony railings, the gable fretwork, the picket fence.
 *
 * Photos (evidence, Wikimedia Commons):
 *  w   "2021 Heritage Square, Rosson House Museum from west.jpg",
 *      Beyond My Ken, CC BY-SA 4.0
 *      https://commons.wikimedia.org/wiki/File:2021_Heritage_Square,_Rosson_House_Museum_from_west.jpg
 *  nw  "2021 Heritage Square, Rosson House Museum from northwest.jpg",
 *      Beyond My Ken, CC BY-SA 4.0
 *      https://commons.wikimedia.org/wiki/File:2021_Heritage_Square,_Rosson_House_Museum_from_northwest.jpg
 *  gob "RossonHousePhoenix gobeirne.jpg", gobeirne, CC BY 2.5
 *      https://commons.wikimedia.org/wiki/File:RossonHousePhoenix_gobeirne.jpg
 * No look-only sources. No commercial imagery.
 *
 * Night: the windows are `window` and glow; the porch and lower walls are
 * lit in the night photos (nl1, nl2), so the walls, posts and frieze carry
 * a _FLOODLIGHT wash, strongest at the ground.
 *  nl1 "Rosson House 1 (6408552757).jpg", Alan Levine, CC BY-SA 2.0 (night)
 *      https://commons.wikimedia.org/wiki/File:Rosson_House_1_(6408552757).jpg
 *  nl2 "Rosson House 2 (6408552929).jpg", Alan Levine, CC BY-SA 2.0 (night)
 *      https://commons.wikimedia.org/wiki/File:Rosson_House_2_(6408552929).jpg
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const ID = 'phx-rosson-house'
type XY = [number, number]

const brick = new Part(), gold = new Part(), green = new Part(), win = new Part()
const P = (x: number, y: number, z: number): V3 => [x, y, z]
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
function box(part: Part, r: XY[], z0: number, z1: number, bottom = false) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    part.quad(P(a[0], a[1], z0), P(b[0], b[1], z0), P(b[0], b[1], z1), P(a[0], a[1], z1))
  }
  for (let i = 1; i < r.length - 1; i++) part.tri(P(...r[0], z1), P(...r[i], z1), P(...r[i + 1], z1))
  if (bottom) for (let i = 1; i < r.length - 1; i++) part.tri(P(...r[0], z0), P(...r[i + 1], z0), P(...r[i], z0))
}
/** A flat panel on the face a→b (outward to the right). */
function panel(part: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, off = 0.06) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy)
  const n: XY = [(dy / L) * off, (-dx / L) * off]
  const p = (s: number): XY => [a[0] + dx * s + n[0], a[1] + dy * s + n[1]]
  const [p0, p1] = [p(s0), p(s1)]
  part.quad(P(p0[0], p0[1], z0), P(p1[0], p1[1], z0), P(p1[0], p1[1], z1), P(p0[0], p0[1], z1))
}

// ── The house body ──────────────────────────────────────────────────────
const X0 = -6, X1 = 10, Y0 = -5, Y1 = 7.3, EAVE = 9, RIDGE = 14.8, OV = 0.5
box(brick, rect(X0, Y0, X1, Y1), 0, EAVE)
// a green cornice band under the eaves
for (const [a, b] of [[[X0, Y0], [X1, Y0]], [[X1, Y0], [X1, Y1]], [[X1, Y1], [X0, Y1]], [[X0, Y1], [X0, Y0]]] as [XY, XY][]) {
  panel(green, a, b, 0, 1, EAVE - 0.7, EAVE, 0.12)
}
// the hip roof, oversailing the walls by 0.5 m
{
  const x0 = X0 - OV, x1 = X1 + OV, y0 = Y0 - OV, y1 = Y1 + OV, h = (y1 - y0) / 2
  const r0: V3 = P(x0 + h, (y0 + y1) / 2, RIDGE), r1: V3 = P(x1 - h, (y0 + y1) / 2, RIDGE)
  const e = EAVE - 0.2
  gold.quad(P(x0, y0, e), P(x1, y0, e), r1, r0) // south
  gold.quad(P(x1, y1, e), P(x0, y1, e), r0, r1) // north
  gold.tri(P(x1, y0, e), P(x1, y1, e), r1) // east
  gold.tri(P(x0, y1, e), P(x0, y0, e), r0) // west
  // soffit
  gold.quad(P(x0, y0, e), P(x0, y1, e), P(x1, y1, e), P(x1, y0, e))
}
/**
 * A gable on a face: the brick wall carried up to a peak, and a gold
 * roof running back into the hip. `face` is the outward direction.
 */
function gable(face: 'n' | 's' | 'e' | 'w', c: number, half: number, peak: number) {
  const e = EAVE - 0.2, depth = 5
  // local: u along the face, v outward; map to world
  const at = (u: number, v: number, z: number): V3 => {
    if (face === 'n') return P(c + u, Y1 + v, z)
    if (face === 's') return P(c - u, Y0 - v, z)
    if (face === 'e') return P(X1 + v, c - u, z)
    return P(X0 - v, c + u, z)
  }
  // the gable wall (brick), flush with the face, and its green verge trim
  brick.tri(at(-half, 0, EAVE), at(0, 0, peak - 0.3), at(half, 0, EAVE))
  // the roof planes, oversailing the wall by 0.5 m
  const o = OV
  gold.quad(at(-half - o, -depth, e), at(0, -depth, peak), at(0, o, peak), at(-half - o, o, e))
  gold.quad(at(0, -depth, peak), at(half + o, -depth, e), at(half + o, o, e), at(0, o, peak))
  // the fronts' green bargeboards
  green.quad(at(-half - o, o + 0.02, e), at(0, o + 0.02, peak), at(0, o + 0.02, peak - 0.5), at(-half - o, o + 0.02, e - 0.5))
  green.quad(at(0, o + 0.02, peak), at(half + o, o + 0.02, e), at(half + o, o + 0.02, e - 0.5), at(0, o + 0.02, peak - 0.5))
  // a window in the gable
  const w0 = at(-0.6, 0.06, 0), w1 = at(0.6, 0.06, 0)
  win.quad([w0[0], w0[1], EAVE + 0.6], [w1[0], w1[1], EAVE + 0.6], [w1[0], w1[1], EAVE + 2.2], [w0[0], w0[1], EAVE + 2.2])
}
gable('n', 3.5, 3, 12.6)
gable('w', -1.8, 3, 13.2)
gable('s', 5, 3, 13)
gable('e', 1, 3, 13)

// the windows: tall, one panel per window, both storeys
{
  const lower: [number, number] = [1.3, 3.9], upper: [number, number] = [5.2, 7.8]
  const faces: [XY, XY, number[]][] = [
    [[X0, Y1], [X0, Y0], [3.4, 5.6, 9.0]], // west, measured from the north corner (turret near it)
    [[X1, Y1], [X0, Y1], [2, 5, 8, 11.5, 14]], // north
    [[X0, Y0], [X1, Y0], [2.5, 5.5, 10.5, 13.5]], // south
    [[X1, Y0], [X1, Y1], [2.5, 5.5, 8.5]], // east
  ]
  for (const [a, b, at] of faces) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (const d of at) for (const [z0, z1] of [lower, upper]) panel(win, a, b, (d - 0.55) / L, (d + 0.55) / L, z0, z1)
  }
}

// ── The turret at the north-west corner ────────────────────────────────
{
  const cx = -5.6, cy = 5.0, R = 2.4, TOP = 11.6, SPIRE = 18.3
  const ring: XY[] = []
  for (let k = 0; k < 8; k++) { const t = ((22.5 + 45 * k) * Math.PI) / 180; ring.push([cx + R * Math.cos(t), cy + R * Math.sin(t)]) }
  box(brick, ring, 0, TOP)
  // a green cornice and the windows of its top stage, one per face
  for (let k = 0; k < 8; k++) {
    const a = ring[k], b = ring[(k + 1) % 8]
    panel(green, a, b, 0, 1, TOP - 0.6, TOP, 0.1)
    panel(win, a, b, 0.25, 0.75, EAVE + 0.4, TOP - 0.9)
  }
  // the spire: an octagonal pyramid oversailing the cornice, and a finial
  const eR = R + 0.25, base: XY[] = ring.map(([x, y]) => [cx + ((x - cx) * eR) / R, cy + ((y - cy) * eR) / R])
  for (let k = 0; k < 8; k++) {
    const a = base[k], b = base[(k + 1) % 8]
    gold.tri(P(a[0], a[1], TOP), P(b[0], b[1], TOP), P(cx, cy, SPIRE))
  }
  box(gold, rect(cx - 0.12, cy - 0.12, cx + 0.12, cy + 0.12), SPIRE - 0.5, 20)
  box(gold, [[cx - 0.3, cy], [cx, cy - 0.3], [cx + 0.3, cy], [cx, cy + 0.3]], SPIRE - 0.1, SPIRE + 0.6)
}

// ── Chimneys ────────────────────────────────────────────────────────────
for (const [x, y] of [[1, 3.6], [-3.5, -3.6], [6.5, -1.5]] as XY[]) {
  box(brick, rect(x - 0.5, y - 0.5, x + 0.5, y + 0.5), EAVE, 15.6)
  box(brick, rect(x - 0.65, y - 0.65, x + 0.65, y + 0.65), 15.2, 15.6)
}

// ── The wrap-around porch ──────────────────────────────────────────────
{
  const PR = 4.9, POST = 0.28
  // roof slabs: west, south and east runs
  const runs: XY[][] = [
    rect(-9.2, -7.6, X0, 6.6), // west, the full front, round the turret's foot
    rect(X0, -7.6, 8, Y0), // south
    rect(X1, -3.8, 12.4, 4.8), // east
  ]
  for (const r of runs) {
    box(gold, r, PR - 0.35, PR, true)
    // the green frieze under the roof's outer edges
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4]
      const onWall = (Math.abs(a[0] - b[0]) < 1e-6 && (Math.abs(a[0] - X0) < 1e-6 || Math.abs(a[0] - X1) < 1e-6)) || (Math.abs(a[1] - b[1]) < 1e-6 && Math.abs(a[1] - Y0) < 1e-6)
      if (onWall) continue
      panel(green, a, b, 0, 1, PR - 0.95, PR - 0.35, 0.02)
      // posts along the edge, about every 2.6 m
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / 2.6))
      for (let k = 0; k <= n; k++) {
        const s = k / n, x = a[0] + (b[0] - a[0]) * s, y = a[1] + (b[1] - a[1]) * s
        const ix = Math.min(Math.max(x, Math.min(...r.map((p) => p[0])) + POST), Math.max(...r.map((p) => p[0])) - POST)
        const iy = Math.min(Math.max(y, Math.min(...r.map((p) => p[1])) + POST), Math.max(...r.map((p) => p[1])) - POST)
        box(green, rect(ix - POST / 2, iy - POST / 2, ix + POST / 2, iy + POST / 2), 0, PR - 0.35)
      }
    }
  }
  // the porch's gabled entrance bay on the west (w)
  {
    const c = -2, half = 1.8, e = PR, peak = PR + 2.2, x = -9.4
    green.tri(P(x, c + half, e), P(x, c - half, e), P(x, c, peak))
    gold.quad(P(-6.5, c - half - 0.3, e), P(-6.5, c, peak), P(x - 0.3, c, peak), P(x - 0.3, c - half - 0.3, e))
    gold.quad(P(-6.5, c, peak), P(-6.5, c + half + 0.3, e), P(x - 0.3, c + half + 0.3, e), P(x - 0.3, c, peak))
  }
}

// the doors: the front door under the west porch's gable, a side door south
panel(win, [X0, Y1], [X0, Y0], (Y1 - -1.2) / (Y1 - Y0), (Y1 - -2.8) / (Y1 - Y0), 0.3, 3.4)

// ── Write ───────────────────────────────────────────────────────────────
// Floodlight: the porch lamps wash the lower walls and posts at night.
const low = (p: V3) => Math.max(0, Math.min(1, 1 - p[2] / 9))
const parts: { part: Part; material: MaterialSpec }[] = [
  { part: brick, material: { ...finish('rh-brick', 0xbd7a62), floodlight: low } },
  { part: gold, material: finish('rh-gold-roof', 0xdcc47e) },
  { part: green, material: { ...finish('rh-green', 0x67705f), floodlight: low } },
  { part: win, material: PALETTE.window },
]
const used = parts.filter((p) => p.part.triangles > 0)
const triangles = used.reduce((s, p) => s + p.part.triangles, 0)
if (used.length > 6) throw new Error(`${ID}: ${used.length} materials`)
if (triangles > 5000) throw new Error(`${ID}: ${triangles} triangles`)
const glb = writeGlb('Rosson House', used, {
  license: 'CC0-1.0',
  frame: 'Y up, -Z north, +X east, metres; origin on the ground at the outline centroid (-112.0659406, 33.4502015); bearing 0',
})
if (glb.length > 250_000) throw new Error(`${ID}: ${glb.length} bytes`)
const out = new URL(`../models/${ID}.glb`, import.meta.url).pathname
await Bun.write(out, glb)
console.log(used.map((p) => `${p.material.name}: ${p.part.triangles}`).join(', '))
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
