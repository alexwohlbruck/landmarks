/**
 * London Aquatics Centre, Queen Elizabeth Olympic Park — original procedural
 * geometry, CC0-1.0.
 * bun generators/london-aquatics-centre.ts
 *
 * Model frame turned to BEARING 316.8 (the roof's long axis, from the OSM
 * outline's principal axis): +y toward the north-west end (the bridge
 * entrance), +x toward the north-east side, z up, metres. Origin = centroid
 * of the OSM outline way/1169737833, on the riverside ground.
 *
 * The current (post-2014) form: Zaha Hadid's 160 m wave roof — a thin,
 * smooth, doubly curved shell, a lens in plan, highest just south-east of the
 * middle and falling to both ends, its long edges rising above its spine (a
 * saddle across) and lifting into a crisp lip at the north-west (bridge)
 * end; a long curved band of glazing under it on a stepped concrete plinth.
 * The 2012 temporary seating wings are gone.
 *
 * Evidence
 * - OSM way/1169737833 (building=stadium, "London Aquatics Centre",
 *   wikidata Q308874): the roof's lens, 158 × 94 m. The parts
 *   way/1490925532–1490925548 nearby are a different building (checked:
 *   outside the outline).
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0. THE LIDAR DECIDED THE PROFILE. Ground 2.6 m above ground_min
 *   (3.4 m AOD); the bridge deck at the north-west end 8 m above it. Spine
 *   above the ground: 14.5 m at y 80, 18 at y 64, 20.7 at y 40, 24.7 at y 16,
 *   26.8 at y -8 (highest), 26.1 at y -32, 21 at y -56, 14.6 at y -72, 10 at
 *   y -80. The long edges rise up to 5.3 m above the spine in the middle,
 *   most strongly on the north-west half, and stand 1.5 m over it at the
 *   north-west tip (the lip). Lens ±46 m wide in the middle. (A review pass
 *   that followed one photo's apparent direction and made the north-west end
 *   the high end was reverted to these measurements.)
 * - Published (Wikipedia, "London Aquatics Centre"): Zaha Hadid Architects,
 *   2011; roof 160 m long and up to 80 m wide, steel frame clad in
 *   aluminium outside and timber underneath; the temporary wings removed
 *   2013–14.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "Aquatics Centre - geograph.org.uk - 4038483.jpg", Oast House Archive,
 *     CC BY-SA 2.0 (2014, from 257°, 149 m): the side elevation after the
 *     wings came off — the long thin north-west tip, the high rounded
 *     south-east nose, glazing under the roof, concrete plinth;
 *   "London Aquatics Centre, 2023.jpg", Thomas Dahlstrøm Nielsen,
 *     CC BY-SA 4.0 (196°, 119 m): the south-west side and the roof's dark
 *     underside at the end;
 *   "London Aquatics Centre 2025-05-05.jpg", The wub, CC BY-SA 4.0 (283°):
 *     the aluminium top's colour, the lip and the end glazing;
 *   "London Aquatics Centre - Olympic Park.jpg", Sumit Surai, CC BY-SA 4.0:
 *     at dusk, the glazing lit, the plinth;
 *   "London Aquatics Centre (25266696922).jpg", Tom Parnell, CC BY-SA 2.0
 *     (226°, close): the aluminium strips and white edge trim;
 *   "London Aquatics Centre exterior.jpg", Cmglee, CC BY-SA 3.0 (2012, with
 *     the wings): the roof's nose seen from above.
 *
 * Measured (lidar): the spine profile, the edge rise, the lens widths, the
 * plinth level (the bridge deck). Published: length, materials. Estimated
 * (photos): the roof's thickness (1 m: a thin shell with a sharp edge), the
 * glazing line 10 % in from the roof's edge, the plinth 8 m tall, stepping
 * down under the roof toward the ends. Doubts: the photos' camera directions
 * disagree with each other about which end is which; no aerial after 2014.
 */
import { writeFileSync } from 'node:fs'
import { Part, writeGlb, cross, sub, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'

const ID = 'london-aquatics-centre'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scl = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const nrm = (a: V3): V3 => scl(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Piecewise-linear table lookup, smoothed with a cosine ease between rows. */
function table(rows: [number, number][]): (x: number) => number {
  return (x: number) => {
    if (x <= rows[0][0]) return rows[0][1]
    for (let i = 1; i < rows.length; i++)
      if (x <= rows[i][0]) {
        const t = (x - rows[i - 1][0]) / (rows[i][0] - rows[i - 1][0])
        return lerp(rows[i - 1][1], rows[i][1], (1 - Math.cos(Math.PI * t)) / 2)
      }
    return rows[rows.length - 1][1]
  }
}

// ----------------------------------------------------------- the roof
const L = 79.5 // half-length (OSM: -79.6..78.8)
/** Half-width of the roof's lens at y (OSM outline, lidar edges). */
const W = (y: number) => 46.5 * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(y) / L, 2.2)), 0.75)
/** Spine height above the ground (lidar). */
const SPINE = table([
  [-80, 10], [-72, 14.6], [-64, 18.4], [-56, 21], [-48, 23.3], [-40, 24.8], [-32, 26.1], [-24, 26.7], [-16, 27], [-8, 26.8],
  [0, 26.4], [8, 25.7], [16, 24.7], [24, 23.4], [32, 22.3], [40, 20.7], [48, 19.6], [56, 18.6], [64, 18], [72, 17.2], [80, 14.5],
])
/** How far the long edges rise over the spine (lidar: +5.3 m), and the crisp lift at the north-west lip (lidar: edges 1.5 m over the spine at y 80). */
const EDGE = (y: number) => 5.3 * Math.pow(Math.max(0, 1 - Math.pow(y / L, 2)), 1.5) + (y > 62 ? (y - 62) * 0.12 : 0)
const PLINTH = 8 // the bridge deck / plinth top

/** Top of the roof at a point of the lens, u = x / W(y) in -1..1. */
const topAt = (u: number, y: number) => SPINE(y) + EDGE(y) * Math.pow(Math.abs(u), 1.7)

/** The lens's edge point at angle th: y runs -L..L with cosine spacing (dense at the tips). */
function edge(th: number): [number, number] {
  const y = -L * Math.cos(th)
  return [W(y) * Math.sign(Math.sin(th) || 1) * (Math.abs(Math.sin(th)) < 1e-9 ? 0 : 1), y]
}

/**
 * The roof as one closed-around grid: columns run round the lens, rows run
 * from the middle of the top out over a rounded fascia and back in under the
 * soffit to the glazing line. Each row: [radial scale r, outward offset m,
 * drop below the top at that point m].
 */
const PROFILE: { r: number; out: number; drop: number; under?: boolean }[] = [
  { r: 0.0, out: 0, drop: 0 },
  { r: 0.3, out: 0, drop: 0 },
  { r: 0.55, out: 0, drop: 0 },
  { r: 0.75, out: 0, drop: 0 },
  { r: 0.9, out: 0, drop: 0 },
  { r: 1.0, out: 0, drop: 0 },
  { r: 1.0, out: 0.35, drop: 0.3 },
  { r: 1.0, out: 0.15, drop: 0.75 },
  { r: 0.97, out: 0, drop: 0.95, under: true },
  { r: 0.9, out: 0, drop: 1.05, under: true },
]

function surfaceGrid(p: Part, grid: V3[][], closedCols: boolean) {
  // Vertex normals from the grid's neighbours (rows i, columns j).
  const R = grid.length, Cn = grid[0].length
  const at = (i: number, j: number) => grid[Math.max(0, Math.min(R - 1, i))][closedCols ? (j + Cn) % Cn : Math.max(0, Math.min(Cn - 1, j))]
  const N = grid.map((row, i) =>
    row.map((_, j) => {
      const du = sub(at(i, j + 1), at(i, j - 1)), dv = sub(at(i + 1, j), at(i - 1, j))
      return nrm(cross(dv, du))
    }),
  )
  const cols = closedCols ? Cn : Cn - 1
  for (let i = 0; i < R - 1; i++)
    for (let j = 0; j < cols; j++) {
      const k = (j + 1) % Cn
      const a = grid[i][j], b = grid[i][k], c = grid[i + 1][k], d = grid[i + 1][j]
      const na = N[i][j], nb = N[i][k], nc = N[i + 1][k], nd = N[i + 1][j]
      if (Math.hypot(...sub(a, b)) > 1e-6) p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
      if (Math.hypot(...sub(c, d)) > 1e-6) p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
    }
}

const M = {
  alu: finish('aluminium', 0x85878a, 0.5),
  side: finish('aluminium-edge', 0xb9bbbd, 0.5),
  soffit: finish('timber-soffit', 0x6e5f52, 0.85),
  glass: { name: 'window', color: 0x7fb4c4, roughness: 0.3 } as MaterialSpec,
  plinth: { ...finish('concrete', 0xd7d4cd, 0.9), floodlight: (q: V3, n: V3) => (n[2] < 0.5 ? 0.35 : 0) } as MaterialSpec,
  trim: PALETTE.trim,
}

function build(detail: boolean) {
  const alu = new Part(), side = new Part(), soffit = new Part(), glass = new Part(), plinth = new Part(), trim = new Part()
  const COLS = detail ? 160 : 72

  const ths = Array.from({ length: COLS }, (_, j) => (2 * Math.PI * j) / COLS)
  const E = ths.map(edge)
  /** Outward horizontal normal of the lens at column j. */
  const out = E.map((_, j) => {
    const a = E[(j - 1 + COLS) % COLS], b = E[(j + 1) % COLS]
    const n = nrm([b[1] - a[1], -(b[0] - a[0]), 0])
    return n
  })
  const point = (row: (typeof PROFILE)[number], j: number): V3 => {
    const [ex, ey] = E[j]
    const x = ex * row.r, y = ey * row.r
    const u = W(y) > 0.5 ? Math.max(-1, Math.min(1, x / W(y))) : Math.sign(ex)
    const z = topAt(u, y) - row.drop
    return [x + out[j][0] * row.out, y + out[j][1] * row.out, z]
  }
  const rows = PROFILE.map((row) => E.map((_, j) => point(row, j)))
  // Aluminium: the top and the fascia; timber: the soffit.
  const topRows = rows.slice(0, 6)
  const sideRows = rows.slice(5, 9)
  const underRows = rows.slice(8)
  surfaceGrid(alu, topRows, true)
  surfaceGrid(side, sideRows, true)
  surfaceGrid(soffit, underRows, true)
  // Glazing under the roof on the soffit's inner line: one long curved band
  // from the plinth top up to the roof, running out to nothing where the
  // roof comes down toward the south-east (no mullion grid: at map scale the
  // real glazing reads as one surface).
  const g = rows[PROFILE.length - 1]
  /** The plinth's top under column j: 8 m, or just under the roof where it comes lower. */
  const plTop = (j: number) => Math.max(0, Math.min(PLINTH, g[j][2] - 0.4))
  for (let j = 0; j < COLS; j++) {
    const k = (j + 1) % COLS
    const za = plTop(j), zb = plTop(k), ta = g[j][2], tb = g[k][2]
    if (ta <= za + 0.3 && tb <= zb + 0.3) continue
    const a: V3 = [g[j][0], g[j][1], za], b: V3 = [g[k][0], g[k][1], zb]
    const n = out[j], nn: V3[] = [n, n, n]
    const at: V3 = [g[j][0], g[j][1], Math.max(za, ta)], bt: V3 = [g[k][0], g[k][1], Math.max(zb, tb)]
    glass.tri(a, b, bt, undefined, undefined, undefined, nn)
    glass.tri(a, bt, at, undefined, undefined, undefined, nn)
  }
  // A slim pale sill line along the glazing's foot.
  for (let j = 0; j < COLS; j++) {
    const k = (j + 1) % COLS
    if (g[j][2] < plTop(j) + 1.5 || g[k][2] < plTop(k) + 1.5) continue
    const n = out[j], o = scl(n, 0.1), nn: V3[] = [n, n, n]
    const a: V3 = add([g[j][0], g[j][1], plTop(j)], o), b: V3 = add([g[k][0], g[k][1], plTop(k)], o)
    trim.tri(a, b, add(b, [0, 0, 0.6]), undefined, undefined, undefined, nn)
    trim.tri(a, add(b, [0, 0, 0.6]), add(a, [0, 0, 0.6]), undefined, undefined, undefined, nn)
  }

  // The concrete plinth, 3 m inside the glazing, ground to its top, with a
  // flat terrace out to the glazing.
  const pl = E.map(([ex, ey], j): V3 => [ex * 0.9 - out[j][0] * 3, ey * 0.9 - out[j][1] * 3, 0])
  for (let j = 0; j < COLS; j++) {
    const k = (j + 1) % COLS
    const za = plTop(j), zb = plTop(k)
    if (za < 0.3 && zb < 0.3) continue
    const n = out[j], nn: V3[] = [n, n, n]
    const a = pl[j], b = pl[k], at: V3 = [a[0], a[1], za], bt: V3 = [b[0], b[1], zb]
    plinth.tri(a, b, bt, undefined, undefined, undefined, nn)
    plinth.tri(a, bt, at, undefined, undefined, undefined, nn)
    const up: V3[] = [[0, 0, 1], [0, 0, 1], [0, 0, 1]]
    const ga: V3 = [g[j][0], g[j][1], za], gb: V3 = [g[k][0], g[k][1], zb]
    plinth.tri(at, bt, gb, undefined, undefined, undefined, up)
    plinth.tri(at, gb, ga, undefined, undefined, undefined, up)
  }

  // Nothing below the ground.
  for (const q of [alu, side, soffit, glass, plinth, trim]) for (let i = 1; i < q.pos.length; i += 3) q.pos[i] = Math.max(0, q.pos[i])

  return [
    { part: alu, material: M.alu },
    { part: side, material: M.side },
    { part: soffit, material: M.soffit },
    { part: glass, material: M.glass },
    { part: plinth, material: M.plinth },
    { part: trim, material: M.trim },
  ]
}

if (import.meta.main) {
  const extras = { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor' }
  const parts = build(false)
  const tris = parts.reduce((s, { part }) => s + part.triangles, 0)
  const glb = writeGlb('London Aquatics Centre', parts, extras)
  writeFileSync(new URL(`../models/${ID}.glb`, import.meta.url), glb)
  console.log(`models/${ID}.glb: ${tris} triangles, ${glb.length} bytes`)
}
