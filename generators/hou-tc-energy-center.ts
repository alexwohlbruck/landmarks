/**
 * TC Energy Center (700 Louisiana; built 1983 as RepublicBank Center, later
 * Bank of America Center), Houston. Philip Johnson and John Burgee.
 * Original procedural geometry, CC0-1.0.
 * bun generators/hou-tc-energy-center.ts
 *
 * Frame: built turned to Houston's downtown grid, BEARING 34.6: +y runs
 * north-east along the block (Louisiana St side), +x south-east, z up, metres.
 * Origin = centroid of the OSM outline way/54169596 (-95.3664587, 29.7606448).
 *
 * What it is: a 56-storey tower in three tiers along the block, each tier a
 * slab 36 m wide whose roof is a stepped Dutch gable (five 2-storey steps a
 * side and a 6 m top), the gables facing north-east and south-west, with a
 * granite spire at every step corner. The tiers step down to the north-east,
 * so from the north-east the three gables nest. Beside it on the south-east
 * half of the block is the low 1983 banking hall: the same stepped gable
 * roof, spires on its gable ends, and a glass barrel vault crossing it at
 * mid-block. Red ("Napoleon red") granite throughout with punched windows.
 *
 * Evidence
 * - OSM: outline way/54169596 (tagged height=40, which is the banking hall's
 *   height, not the tower's) and its parts way/469467449 (238 m), 469474539
 *   (194 m), 469560065 (134 m), all gabled, and way/470270252 (40 m, gabled:
 *   the banking hall).
 * - USGS 3DEP lidar TX_Coastal_B1_2018 (flight 2018), 0.5 m grid sampled in
 *   this frame (SCRATCH/work/hou-tc-energy-center/lidar.json). y = 0 is the
 *   lowest ground under the outline (north corner, 0.5 m above the grid's
 *   ground_min); heights below are above that. Measured:
 *   tower x -37.5..-1.5; tiers y -40.5..-5, -5..22.5, 22.5..38;
 *   eaves 189.9 / 146.3 / 86.9; every gable step 3 m wide and 7.9 m high
 *   (two storeys), top step 6 m wide and 10.4 m high: peaks 232.1 / 188.8 /
 *   129.3. Banking hall x 4.5..37.5, y -40.5..37.5, stepped roof across x in
 *   3 m steps: 20.3, 25.5, 29.5, 33.3, 37.4, ridge 41.9; a 6 m link between
 *   hall and tower at 18.3; a cross barrel vault at y -11..10 with its crown
 *   at 32.7 (drawn as a semicircle, r 11 m, springing 21.7).
 * - Published (Wikipedia, CTBUH): 780 ft (238 m) to the spire tips, 56
 *   floors, 1983, Johnson/Burgee, red granite.
 * - Commons daylight photos (EVIDENCE):
 *   "Bank of America Center Houston.JPG" (W0lfie, CC BY-SA 2.5) — nested
 *     gables from the north-east;
 *   "Bank of America Center (Houston).jpg" (PSE02, public domain) — aerial
 *     from JPMorgan Chase Tower, the three tiers and roofs from the south-east;
 *   "Bank of America Center in Downtown Houston.JPG" (Agsftw, CC BY-SA 3.0) —
 *     base, gables and spires from the north-east/north-west;
 *   "Bank of America Center Houston 1.jpg" (Jim Porter, CC BY 2.0) — tower and
 *     banking-hall gable with its glass vault;
 *   "BOAC bottom.jpg" (Dhanix, CC BY-SA 3.0) — the hall's stepped gable and
 *     spires close up;
 *   "Pennzoil Place in Houston - Dec 2013.JPG" (Agsftw, CC BY-SA 3.0) — the
 *     hall's gable end and stepped metal roof.
 *
 * Round 2 (lead review): granite deepened to the Napoleon red's brown-red
 * (#a86f60, from the photos); spires granite, a shade lighter, not white; the
 * tower's gable treads granite as in the photos (the hall's roof stays grey
 * metal).
 *
 * Estimated: the spire sizes (drawn bolder than the real ones, 2.2 m square
 * and 9 m tall, so they read on a phone), the window grouping (one panel per
 * 3 m bay and two storeys, so the panels line up with the gable steps), the
 * granite colour (photos' red-brown granite), the base (granite below 9 m, no openings drawn), the hall's
 * concave scalloped gable steps drawn as plain steps.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const BEARING = 34.6
const granite = new Part(), windows = new Part(), roof = new Part(), spire = new Part(), vault = new Part()

const STEP = 7.9 // two storeys: one gable step, one window group
const PROUD = 0.05

/** A vertical rectangle on the plane through a→b (outward = right of a→b), z0..z1. */
function wall(part: Part, a: XY, b: XY, z0: number, z1: number) {
  if (z1 - z0 < 1e-6) return
  part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
}

/** Window panels on the wall a→b: bays across, two-storey rows between zlo and the column top. */
function panels(a: XY, b: XY, bays: number, zlo: number, zhi: number, pier = 1.5, start = 9) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy * PROUD, ny = -ux * PROUD
  const bay = L / bays
  for (let g = Math.floor(start / STEP); g * STEP < zhi; g++) {
    const lo = Math.max(g * STEP + 1.2, start, zlo + 1.0), hi = Math.min((g + 1) * STEP - 1.2, zhi - 1.2)
    if (hi - lo < 2.5) continue
    for (let k = 0; k < bays; k++) {
      const s0 = k * bay + pier / 2, s1 = (k + 1) * bay - pier / 2
      const P = (s: number, z: number): V3 => [a[0] + ux * s + nx, a[1] + uy * s + ny, z]
      windows.quad(P(s0, lo), P(s1, lo), P(s1, hi), P(s0, hi))
    }
  }
}

/** A square spire standing on (x, y, z). */
function spike(x: number, y: number, z: number, w = 1.1, h = 9) {
  const c: V3[] = [[x - w, y - w, z], [x + w, y - w, z], [x + w, y + w, z], [x - w, y + w, z]]
  const t: V3 = [x, y, z + h]
  for (let i = 0; i < 4; i++) spire.tri(c[i], c[(i + 1) % 4], t)
}

/**
 * A stepped-gable block: columns across x (edges xs, heights hs), extruded
 * along y from y0 to y1. `endLow[0|1]` gives, per column, the height of
 * whatever stands against the y0 / y1 end (window panels only above it).
 */
type Block = { xs: number[]; hs: number[]; y0: number; y1: number; endLow: [(x: number) => number, (x: number) => number]; win: boolean; spires: boolean; sideLow?: number; tread?: Part }
function block(b: Block) {
  const { xs, hs, y0, y1 } = b, n = hs.length
  // long sides
  wall(granite, [xs[0], y1], [xs[0], y0], 0, hs[0])
  wall(granite, [xs[n], y0], [xs[n], y1], 0, hs[n - 1])
  if (b.win) {
    const bays = Math.max(1, Math.round((y1 - y0) / 3))
    panels([xs[0], y1], [xs[0], y0], bays, b.sideLow ?? 0, hs[0])
    panels([xs[n], y0], [xs[n], y1], bays, b.sideLow ?? 0, hs[n - 1])
  }
  for (let i = 0; i < n; i++) {
    const xa = xs[i], xb = xs[i + 1], h = hs[i]
    // step tops
    ;(b.tread ?? roof).quad([xa, y0, h], [xb, y0, h], [xb, y1, h], [xa, y1, h])
    // risers between columns, facing the lower side
    if (i < n - 1) {
      const h2 = hs[i + 1]
      if (h2 > h) wall(granite, [xb, y1], [xb, y0], h, h2)
      else if (h2 < h) wall(granite, [xb, y0], [xb, y1], h2, h)
    }
    // end caps: y0 face looks to -y, y1 face to +y
    const mid = (xa + xb) / 2
    const lowA = b.endLow[0](mid), lowB = b.endLow[1](mid)
    if (h > lowA) wall(granite, [xa, y0], [xb, y0], lowA, h)
    if (h > lowB) wall(granite, [xb, y1], [xa, y1], lowB, h)
    if (b.win) {
      const bays = Math.max(1, Math.round((xb - xa) / 3))
      if (h > lowA + 3) panels([xa, y0], [xb, y0], bays, lowA, h)
      if (h > lowB + 3) panels([xb, y1], [xa, y1], bays, lowB, h)
    }
  }
  if (b.spires) {
    // a spire at every step's outer corner and both ends of the top, on both gable ends
    for (const [y, inward] of [[y0, 1.2], [y1, -1.2]] as [number, number][]) {
      for (let i = 0; i < n; i++) {
        const h = hs[i], up = (i === 0 || hs[i - 1] < h), dn = (i === n - 1 || hs[i + 1] < h)
        if (up) spike(xs[i] + 1.0, y + inward, h)
        if (dn) spike(xs[i + 1] - 1.0, y + inward, h)
      }
    }
  }
}

// ---------- the tower ----------
const TX0 = -37.5, TX1 = -1.5
const towerXs = [TX0, TX0 + 3, TX0 + 6, TX0 + 9, TX0 + 12, TX0 + 15, TX0 + 21, TX0 + 24, TX0 + 27, TX0 + 30, TX0 + 33, TX1]
const gable = (eave: number, top: number) => [0, 1, 2, 3, 4].map((k) => eave + k * STEP).concat([top], [4, 3, 2, 1, 0].map((k) => eave + k * STEP))
const tiers = [
  { y0: -40.5, y1: -5, hs: gable(189.9, 232.1) },
  { y0: -5, y1: 22.5, hs: gable(146.3, 188.8) },
  { y0: 22.5, y1: 38, hs: gable(86.9, 129.3) },
]
const colH = (hs: number[]) => (x: number) => {
  for (let i = 0; i < hs.length; i++) if (x >= towerXs[i] && x <= towerXs[i + 1]) return hs[i]
  return 0
}
const ground = () => 0
tiers.forEach((t, i) => block({
  xs: towerXs, hs: t.hs, y0: t.y0, y1: t.y1,
  endLow: [i > 0 ? colH(tiers[i - 1].hs) : ground, i < tiers.length - 1 ? colH(tiers[i + 1].hs) : ground],
  win: true, spires: true, tread: granite,
}))
// tier 1's south-west face shows down to the ground; its windows start above the 9 m granite base (handled in panels)

// ---------- link between tower and hall ----------
{
  const x0 = -1.5, x1 = 4.5, y0 = -37, y1 = 27, h = 18.3
  wall(granite, [x0, y0], [x1, y0], 0, h)
  wall(granite, [x1, y1], [x0, y1], 0, h)
  roof.quad([x0, y0, h], [x1, y0, h], [x1, y1, h], [x0, y1, h])
}

// ---------- the banking hall ----------
const hallXs = [4.5, 7.5, 10.5, 13.5, 16.5, 19.5, 22.5, 25.5, 28.5, 31.5, 34.5, 37.5]
const hallHs = [20.3, 25.5, 29.5, 33.3, 37.4, 41.9, 37.4, 33.3, 29.5, 25.5, 20.3]
block({ xs: hallXs, hs: hallHs, y0: -40.5, y1: 37.5, endLow: [ground, ground], win: false, spires: true })
// the hall's tall arched windows: one tall panel per bay on its long south-east side and gable ends
{
  const L = 78, bays = 13, x = 37.5
  for (let k = 0; k < bays; k++) {
    const y0 = -40.5 + k * L / bays + 1.5, y1 = -40.5 + (k + 1) * L / bays - 1.5
    if (y1 > -12 && y0 < 11) continue // the vault's end window
    windows.quad([x + PROUD, y0, 4], [x + PROUD, y1, 4], [x + PROUD, y1, 16], [x + PROUD, y0, 16])
  }
  for (const [y, s] of [[-40.5, -1], [37.5, 1]] as [number, number][]) {
    for (let k = 0; k < 5; k++) {
      const xa = 7 + k * 6.2, xb = xa + 3.6
      const P = (xx: number, z: number): V3 => [xx, y + s * PROUD, z]
      if (s < 0) windows.quad(P(xa, 4), P(xb, 4), P(xb, 16), P(xa, 16))
      else windows.quad(P(xb, 4), P(xa, 4), P(xa, 16), P(xb, 16))
    }
  }
}

// ---------- the glass barrel vault across the hall ----------
{
  const R = 11, yc = -0.5, zc = 21.7, SEG = 12, x0 = -1.5, x1 = 37.6
  const arc: [number, number][] = []
  for (let i = 0; i <= SEG; i++) {
    const a = Math.PI * i / SEG
    arc.push([yc + R * Math.cos(a), zc + R * Math.sin(a)])
  }
  for (let i = 0; i < SEG; i++) {
    const [ya, za] = arc[i], [yb, zb] = arc[i + 1]
    vault.quad([x0, ya, za], [x0, yb, zb], [x1, yb, zb], [x1, ya, za])
  }
  // the arched end window on the hall's south-east face, with a granite sill wall below
  for (let i = 0; i < SEG; i++) {
    const [ya, za] = arc[i], [yb, zb] = arc[i + 1]
    vault.tri([x1, yc, zc], [x1, ya, za], [x1, yb, zb])
  }
  windows.quad([37.6, yc - 6, 4], [37.6, yc + 6, 4], [37.6, yc + 6, zc - 1], [37.6, yc - 6, zc - 1])
}

const parts = [
  { part: granite, material: finish('tc-red-granite', 0xa86f60) },
  { part: windows, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: spire, material: finish('tc-spire', 0xb47c6d) },
  { part: vault, material: PALETTE.glass },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('TC Energy Center', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [29.7606448, -95.3664587], height: 241.1,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/54169596', 'way/469467449', 'way/469474539', 'way/469560065', 'way/470270252'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/hou-tc-energy-center.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
