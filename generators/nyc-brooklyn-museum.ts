/**
 * Brooklyn Museum — procedural, CC0-1.0, no textures.
 * bun generators/nyc-brooklyn-museum.ts
 *
 * Map frame: x = model east, y = model north (the Eastern Parkway front), z
 * up, metres. Placed at bearing 15°, the facade's normal (the outline's
 * dominant edge direction). Anchor: area centroid of the OSM outline
 * way/1432069915.
 *
 * Evidence
 * - OSM way/1432069915 (outline: the front range from x -96.5 to 53.4 with
 *   its face at y ≈ 23, the portico x -35.8…-8 to y 36, the glass entrance
 *   pavilion's half-round to y 58, the east block south to y -56 and a low
 *   strip east to x 69; height 50) and building:part 250229991. The
 *   museum's west wing and rear south-west of the outline are not mapped
 *   and are not modelled.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), in the model frame
 *   (/tmp/city/nyc/work/nyc-brooklyn-museum/bands.png). y = 0 is the lowest
 *   ground, at the rear (44 m NAVD88); the Eastern Parkway plaza in front is
 *   4.5 m higher. Above y = 0: the front ranges' attic 37–39 m; the east
 *   block's roof 38.6 m with a sunken skylit court (x 2…28, y -26…-2) at
 *   30 m; the central block (x -36…-8) 45.5 m; the dome, about 20 m across,
 *   to 52 m; the portico's pediment to ~40 m; the glass pavilion 8.4 m at
 *   its rim rising to ~12.5 m; the low east strip 8.4 m.
 * - Published: McKim, Mead & White, 1897–1927, Beaux-Arts; a hexastyle
 *   Ionic portico with a sculpted pediment; Daniel Chester French and
 *   others' 30 allegorical statues on the attic cornice; the grand stair
 *   removed in 1934–37; the glass entrance pavilion by Polshek Partnership,
 *   2004 (Wikipedia; NRHP).
 * - Photos, credits in /tmp/city/nyc/work/nyc-brooklyn-museum/photos/credits.txt:
 *   the whole front (ajay_suresh, CC BY 2.0), from the north-east
 *   (Jim.henderson, public domain), the portico and pavilion from the
 *   north-west (Suicasmo, CC BY-SA 4.0), the east range and statues
 *   (Kidfly182, CC BY-SA 4.0), Sailko (CC BY 3.0).
 *
 * Estimated: the storeys within the lidar's heights (base to 13 m, the
 * giant order to 28.5 m, cornice 30.5 m, attic to 38 m), bay and window
 * counts (from the front photo), the portico's single row of six 1.8 m
 * columns, the statues (bold standing figures, one per bay), the dome's
 * profile, the pavilion's tiers (five glass steps over a glass-walled
 * entrance hall). The east block's side and rear walls are drawn with the
 * front's window rhythm and no order.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, finishModel, circle } from './nyc-570-lexington'
import { archPanel, rectPanel, band, spread, block, column, wallFrame } from './nyc-city-hall'

const stone = new Part(), win = new Part(), roof = new Part(), glass = new Part(), trim = new Part(), dome = new Part()

const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const edges = (r: XY[]) => r.map((a, i) => [a, r[(i + 1) % r.length]] as [XY, XY])
const L = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])

const PLAZA = 4.5, BASE = 13, ORDER = 28.5, CORN = 30.5, ATTIC = 38
const CX = -21.9 // the axis of the portico and dome
const FRONT = 23.0

/** A plain standing statue on a small plinth: six-sided robed body and a head. */
function statue(x: number, y: number, z0: number, h: number) {
  const s = h / 3.4
  block(stone, x - 0.9, y - 0.9, x + 0.9, y + 0.9, z0, z0 + 0.5)
  const rings: V3[][] = [[0.75, 0.5], [0.62, 2.6], [0.42, 2.95]].map(([r, z]) => circle(x, y, r * s, 6).map(([a, b]) => [a, b, z0 + z * s] as V3))
  // The statues are weathered darker than the wall behind them; they share the dome's grey.
  dome.loft(rings); dome.cap(rings[2], true)
  block(dome, x - 0.24 * s, y - 0.24 * s, x + 0.24 * s, y + 0.24 * s, z0 + 2.95 * s, z0 + 3.5 * s)
}

/** A front range: rusticated base, giant pilasters with two rows of windows between, cornice, attic, statues. */
function range(x0: number, x1: number, bays: number, statues: boolean) {
  // The front faces north, so its wall runs east to west (counter-clockwise ring order).
  const a: XY = [x1, FRONT], b: XY = [x0, FRONT], len = x1 - x0, pitch = len / bays
  const f = wallFrame(a, b)
  for (let k = 0; k <= bays; k++) {
    const s = k * pitch
    // Pilasters: broad flat piers, a little proud, through the order.
    const p = f.at(Math.min(Math.max(s, 0.8), len - 0.8), 0, 0)
    block(stone, p[0] - 0.85, p[1] - 0.05, p[0] + 0.85, p[1] + 0.8, BASE, ORDER)
    if (statues && k > 0 && k < bays) statue(p[0], FRONT - 0.5, CORN, 3.8)
  }
  for (let k = 0; k < bays; k++) {
    const s = (k + 0.5) * pitch
    rectPanel(win, a, b, s, 2.4, BASE + 1.8, BASE + 6.6, 0.06)
    rectPanel(win, a, b, s, 2.4, BASE + 8.4, ORDER - 2.0, 0.06)
    rectPanel(win, a, b, s, 1.6, PLAZA + 2.0, PLAZA + 6.0, 0.06) // the base storey
  }
}

// --- Massing ---
const west = rect(-96.5, 2.3, -35.8, FRONT)
const centre = rect(-35.8, -5.0, -8.0, FRONT)
const east = rect(-8.0, -56.2, 53.4, FRONT)
for (const r of [west, east]) {
  prism({ wall: stone, win: null, roof, ring: r, z0: 0, z1: CORN, facade: null, bevel: 0.4 })
  band(stone, r, BASE - 0.8, BASE, 0.35) // the base's top course
  band(trim, r, ORDER, CORN, 0.7) // entablature and cornice
  // The attic stands back from the front, leaving a ledge for the statues.
  const att: XY[] = r.map(([x, y]) => [x, y >= FRONT - 0.1 ? FRONT - 1.6 : y] as XY)
  prism({ wall: stone, win: null, roof, ring: att, z0: CORN, z1: ATTIC, facade: null, bevel: 0.4 })
  band(trim, att, ATTIC - 0.9, ATTIC, 0.35) // attic coping
}
// The skylit court sunk in the east block's roof.
{
  const c = rect(2, -26, 28, -2)
  const z = ATTIC + 0.02
  glass.quad([2.2, -25.8, z], [27.8, -25.8, z], [27.8, -2.2, z], [2.2, -2.2, z])
  for (const [a, b] of edges(c)) {
    // a low glazed lantern standing just inside the parapet line
    const f = wallFrame(a, b, -0.8)
    glass.quad(f.at(0.8, z), f.at(L(a, b) - 0.8, z), f.at(L(a, b) - 0.8, z + 1.2), f.at(0.8, z + 1.2))
  }
}
// End pavilions, a little proud of the front, with a raised attic.
for (const [x0, x1] of [[-96.5, -80.5], [37.4, 53.4]]) {
  const r = rect(x0, FRONT - 0.5, x1, FRONT + 1.2)
  prism({ wall: stone, win: null, roof, ring: r, z0: 0, z1: ATTIC + 1.6, facade: null, bevel: 0.3 })
  band(trim, r, ORDER, CORN, 0.5)
  const a: XY = [x1, FRONT + 1.2], b: XY = [x0, FRONT + 1.2]
  for (const s of [4, x1 - x0 - 4]) {
    rectPanel(win, a, b, s, 2.4, BASE + 1.8, BASE + 6.6, 0.06)
    rectPanel(win, a, b, s, 2.4, BASE + 8.4, ORDER - 2.0, 0.06)
  }
  for (const s of [1.2, 8, x1 - x0 - 1.2]) { const p = wallFrame(a, b).at(s, 0, 0); block(stone, p[0] - 0.9, p[1] - 0.05, p[0] + 0.9, p[1] + 0.6, BASE, ORDER) }
}
range(-80.5, -35.8, 7, true)
range(-8.0, 37.4, 7, true)
// Side and rear walls: the same two rows of windows, no order.
for (const r of [west, east]) for (const [a, b] of edges(r)) {
  if (Math.abs(a[1] - FRONT) < 0.1 && Math.abs(b[1] - FRONT) < 0.1) continue
  const len = L(a, b)
  if (len < 8) continue
  // Skip the walls hidden against the central block.
  if (Math.abs(a[0] - b[0]) < 0.1 && (Math.abs(a[0] + 35.8) < 0.1 || Math.abs(a[0] + 8) < 0.1) && Math.max(a[1], b[1]) <= FRONT && Math.min(a[1], b[1]) >= -5) continue
  for (const s of spread(3, len - 3, Math.max(1, Math.round((len - 6) / 6.4)))) {
    rectPanel(win, a, b, s, 2.2, BASE + 1.8, BASE + 6.6)
    rectPanel(win, a, b, s, 2.2, BASE + 8.4, ORDER - 2.0)
    rectPanel(win, a, b, s, 1.6, 3, 8.5)
  }
}
// The low strip along the east side.
prism({ wall: stone, win: null, roof, ring: rect(53.4, -38.3, 69.3, 3.0), z0: 0, z1: 8.4, facade: null, bevel: 0.3 })

// --- The central block, the portico and the dome ---
prism({ wall: stone, win: null, roof, ring: centre, z0: 0, z1: 45.5, facade: null, bevel: 0.4 })
band(trim, centre, ORDER, CORN, 0.7)
band(trim, centre, 44.3, 45.5, 0.6)
{
  // Blind panels on the central block's upper walls.
  for (const [a, b] of edges(centre)) {
    const len = L(a, b)
    if (len < 20) continue
    rectPanel(stone, a, b, len / 2, len * 0.55, CORN + 2.5, 42.5, 0.15)
  }
}
{
  const X0 = -35.8, X1 = -8.0, Y0 = FRONT, Y1 = 36.0, PEAK = 40.0, ENT = 32.0
  // Podium the columns stand on, at the main floor (the pavilion runs up to it).
  block(stone, X0, Y0, X1, Y1, 0, BASE)
  // Six Ionic columns in one row, bold, with antae at the back.
  const xs = spread(X0, X1, 6)
  for (const x of xs) column(stone, x, Y1 - 1.6, 1.05, BASE, ORDER, { n: 12, base: 0.8, cap: 1.0, taper: 0.88 })
  for (const x of [X0 + 1.2, X1 - 1.2]) block(stone, x - 1.0, Y0, x + 1.0, Y0 + 2.2, BASE, ORDER)
  // The deep shadowed wall behind the columns, with the doors and windows.
  for (const x of xs.slice(1, -1)) rectPanel(win, [X0, Y0], [X1, Y0], x - X0, 2.2, BASE + 1.5, BASE + 8, 0.06)
  // Entablature and pediment.
  const ent = rect(X0 - 0.4, Y0, X1 + 0.4, Y1 + 0.3)
  prism({ wall: trim, win: null, roof: null, ring: ent, z0: ORDER, z1: ENT, facade: null, bevel: 0.25 })
  const A: V3 = [X0 - 0.4, Y1 + 0.3, ENT], B: V3 = [X1 + 0.4, Y1 + 0.3, ENT], P: V3 = [(X0 + X1) / 2, Y1 + 0.3, PEAK]
  const A0: V3 = [X0 - 0.4, Y0, ENT], B0: V3 = [X1 + 0.4, Y0, ENT], P0: V3 = [(X0 + X1) / 2, Y0, PEAK]
  stone.tri(B, A, P) // the tympanum, facing north
  trim.quad(P0, P, A, A0); trim.quad(P, P0, B0, B) // the roof slopes in stone
  // A raking cornice standing proud along the pediment.
  for (const [q0, q1] of [[A, P], [P, B]] as [V3, V3][]) {
    const t = 0.45
    const sec = (c: V3): V3[] => [[c[0], c[1] - 0.2, c[2] - t], [c[0], c[1] + 0.6, c[2] - t], [c[0], c[1] + 0.6, c[2] + t], [c[0], c[1] - 0.2, c[2] + t]]
    trim.sweep([sec(q0), sec(q1)])
  }
  // Inner pediment panel: a slightly recessed shadowed triangle reads as the sculpture field.
  const k = 0.82
  const ia: V3 = [P[0] + (A[0] - P[0]) * k, Y1 + 0.35, P[2] + (A[2] - P[2]) * k + 0.6], ib: V3 = [P[0] + (B[0] - P[0]) * k, Y1 + 0.35, ia[2]]
  const ip: V3 = [P[0], Y1 + 0.35, P[2] - 1.2]
  dome.tri(ib, ia, ip)
}
{
  // Drum and the shallow stepped dome (lidar: ~20 m across, crown 52 m).
  const cy = 9.0, ring = (r: number, z: number, n = 20): V3[] => circle(CX, cy, r, n).map(([x, y]) => [x, y, z] as V3)
  stone.loft([ring(10.0, 45.5), ring(10.0, 47.3)])
  trim.loft([ring(10.0, 47.3), ring(10.4, 47.6), ring(9.8, 47.8)])
  dome.loft([ring(9.8, 47.8), ring(9.2, 48.6), ring(8.6, 48.7), ring(7.9, 49.6), ring(6.8, 50.6), ring(5.0, 51.4), ring(2.6, 51.9), ring(0.3, 52.0)])
}

// --- The glass entrance pavilion (2004): a half-round of stepped glass over a glass-walled hall ---
{
  const cy = FRONT, R = 34.5, N = 18
  const arcPts = (r: number, z: number): V3[] => Array.from({ length: N + 1 }, (_, i) => { const t = (i / N) * Math.PI; return [CX + r * Math.cos(t), cy + r * Math.sin(t), z] as V3 })
  // The glass walls of the hall, set back under the canopy's rim.
  const wall = (r: number) => { const lo = arcPts(r, PLAZA), hi = arcPts(r, 8.2); for (let i = 0; i < N; i++) win.quad(lo[i + 1], lo[i], hi[i], hi[i + 1]) }
  wall(R - 2.2)
  // The flat canopy roof and its deep white edge.
  const rim0 = arcPts(R, 8.2), rim1 = arcPts(R, 9.4)
  for (let i = 0; i < N; i++) trim.quad(rim0[i + 1], rim0[i], rim1[i], rim1[i + 1])
  const steps: [number, number, number][] = [[R, 30.5, 9.4], [30.5, 26.5, 10.2], [26.5, 22.5, 11.0], [22.5, 18.5, 11.8], [18.5, 14.0, 12.6]]
  steps.forEach(([r0, r1, z], k) => {
    const o = arcPts(r0, z), i0 = arcPts(r1, z)
    const part = k === 0 ? trim : glass
    for (let i = 0; i < N; i++) part.quad(o[i], o[i + 1], i0[i + 1], i0[i])
    // The riser up to the next step.
    const next = steps[k + 1]
    if (next) { const lo = arcPts(r1, z), hi = arcPts(r1, next[2]); for (let i = 0; i < N; i++) glass.quad(lo[i + 1], lo[i], hi[i], hi[i + 1]) }
  })
}

finishModel('Brooklyn Museum', 'nyc-brooklyn-museum', [
  { part: stone, material: finish('bm-limestone', 0xe5dfd2) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: glass, material: PALETTE.glass },
  { part: dome, material: finish('bm-dome', 0xc9c4ba) },
], { bearing: 15, osm: 'way/1432069915', height: 52 }, 6500)
