/**
 * Dilworth Artisan Station, 118 East Kingston Avenue, South End, Charlotte —
 * procedural, CC0-1.0.
 * bun generators/clt-dilworth-artisan-station.ts
 *
 * Old brick warehouses on the Rail Trail turned into artists' studios, known
 * for their paint: a long three-storey red-brick warehouse whose window
 * openings are filled with painted panels (peach and orange, blue shapes),
 * with a buff-brick end block on the street; and, joined to it at the
 * Rail Trail end, the smaller two-storey building covered in murals — orange,
 * yellow and blue facing the parking lot, magenta with an orange sun facing
 * the Rail Trail and the Blue Line, orange and pink flowers on its south
 * side.
 *
 * The murals are drawn, as on neighborhood-theatre.ts, as a few broad flat
 * colour fields: the warm oranges and yellows as one orange, the reds,
 * pinks and magentas as one pink. The murals' blue fields (the right end of
 * the lot face, the left end of the Rail Trail face) and the teal on the
 * south side are folded into the neighbouring field: a third mural colour
 * would take the model past six materials, and the buff end block is as
 * much a part of the building as the blue.
 *
 * Model frame: bearing 42. Model +y runs along the long warehouse to the
 * north-east (the street end), +x to the south-east; the mural building
 * reaches to -x, the Rail Trail. Origin: the outline's centroid.
 *
 * Evidence:
 *  - OSM: way/432937709, the outline of both buildings (an L). Long
 *    warehouse x 3.7..21.4, y -30.4..44.7; mural building x -26.1..3.7,
 *    y -21.1..-0.1. way/1425192864 (Canopy Cocktails & Garden), the strip
 *    along the mural building's south side, is not modelled: the 2016 lidar
 *    shows open ground there and the photos a garden.
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 0.5 m (sampled in this
 *    frame; the ground is flat, 1.6 m above ground_min, which is y = 0
 *    here): warehouse roof 12.4, parapets 13.4, a stair head 15.9
 *    (x 3.7..8.5, y -6..-1), the warehouse's south-west end one storey,
 *    5.9; the mural building 9.4–10.4 with its Rail Trail parapet raised to
 *    11.4 in the middle; the link between the two 7.4.
 *  - Photos: City Dweller 2, CC BY-SA 4.0 (Wikimedia Commons): "Dilworth
 *    Artisan Station November 2022" and "... Smaller Building Early March
 *    2024" (the lot side: the painted windows and the mural building's
 *    orange face), "... Three Story Building Early March 2024" (the
 *    warehouse and its buff end block), "... from across Camden Rd Mid-April
 *    2024" (the magenta Rail Trail face), "... on the Rail Trail Early May
 *    2024" and "... along the Rail Trail Early May 2024", "South End Rail
 *    Trail Lights Dilworth Artisan March 2022" (the south side's flower
 *    mural). USGS NAIP (plan, white roofs).
 *
 * Estimated: window positions and which openings are painted (about half,
 * from the photos), the buff block's length (9.7 m), the mural fields'
 * outlines, the faces no photo shows (the warehouse's south-east side and
 * south-west end: plain brick with windows).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

// A small kit: chamfered boxes and flat shapes on axis-aligned faces.

type F = 'S' | 'N' | 'E' | 'W'
type AZ = [number, number]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const NRM: Record<F, V3> = { S: [0, -1, 0], N: [0, 1, 0], E: [1, 0, 0], W: [-1, 0, 0] }
const SIGN: Record<F, number> = { S: -1, N: 1, E: 1, W: -1 }
const UP: V3 = [0, 0, 1], DN: V3 = [0, 0, -1]

function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  p.tri(a, c, d, undefined, undefined, undefined, [n, n, n])
}

/** An axis-aligned box, its top edges chamfered by b; sides = [S, E, N, W]. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0, top: Part | null = p, sides = [true, true, true, true]) {
  if (x0 > x1) [x0, x1] = [x1, x0]
  if (y0 > y1) [y0, y1] = [y1, y0]
  const zt = z1 - b
  if (sides[0]) quadN(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, zt], [x0, y0, zt], NRM.S)
  if (sides[1]) quadN(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, zt], [x1, y0, zt], NRM.E)
  if (sides[2]) quadN(p, [x1, y1, z0], [x0, y1, z0], [x0, y1, zt], [x1, y1, zt], NRM.N)
  if (sides[3]) quadN(p, [x0, y1, z0], [x0, y0, z0], [x0, y0, zt], [x0, y1, zt], NRM.W)
  if (b > 0) {
    const i0 = x0 + b, i1 = x1 - b, j0 = y0 + b, j1 = y1 - b
    quadN(p, [x0, y0, zt], [x1, y0, zt], [i1, j0, z1], [i0, j0, z1], unit([0, -1, 1]))
    quadN(p, [x1, y0, zt], [x1, y1, zt], [i1, j1, z1], [i1, j0, z1], unit([1, 0, 1]))
    quadN(p, [x1, y1, zt], [x0, y1, zt], [i0, j1, z1], [i1, j1, z1], unit([0, 1, 1]))
    quadN(p, [x0, y1, zt], [x0, y0, zt], [i0, j0, z1], [i0, j1, z1], unit([-1, 0, 1]))
    if (top) quadN(top, [i0, j0, z1], [i1, j0, z1], [i1, j1, z1], [i0, j1, z1], UP)
  } else if (top) quadN(top, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], UP)
}
/** The underside of a slab. */
function soffit(p: Part, x0: number, x1: number, y0: number, y1: number, z: number) {
  if (x0 > x1) [x0, x1] = [x1, x0]
  if (y0 > y1) [y0, y1] = [y1, y0]
  quadN(p, [x0, y0, z], [x0, y1, z], [x1, y1, z], [x1, y0, z], DN)
}

/**
 * A flat convex shape on face f (the plane x = d for E/W, y = d for S/N),
 * standing o metres proud of it. Points are (a, z): a is x on S/N faces and
 * y on E/W faces, listed anticlockwise with a increasing to the right.
 */
function shape(p: Part, f: F, d: number, pts: AZ[], o = 0.04) {
  const dd = d + SIGN[f] * o
  const P = ([a, z]: AZ): V3 => (f === 'S' || f === 'N' ? [a, dd, z] : [dd, a, z])
  // On N and W faces a increases to the viewer's left, so the order flips.
  const q = f === 'N' || f === 'W' ? [...pts].reverse() : pts
  const n = NRM[f]
  for (let i = 1; i < q.length - 1; i++) p.tri(P(q[0]), P(q[i]), P(q[i + 1]), undefined, undefined, undefined, [n, n, n])
}
const rect = (p: Part, f: F, d: number, a0: number, a1: number, z0: number, z1: number, o = 0.04) => {
  if (a0 > a1) [a0, a1] = [a1, a0]
  shape(p, f, d, [[a0, z0], [a1, z0], [a1, z1], [a0, z1]], o)
}
/** A straight bar of width w on a face, from (a0, z0) to (a1, z1). */
function bar(p: Part, f: F, d: number, a0: number, z0: number, a1: number, z1: number, w: number, o = 0.08) {
  const L = Math.hypot(a1 - a0, z1 - z0), pa = (-(z1 - z0) / L) * w / 2, pz = ((a1 - a0) / L) * w / 2
  let pts: AZ[] = [[a0 - pa, z0 - pz], [a1 - pa, z1 - pz], [a1 + pa, z1 + pz], [a0 + pa, z0 + pz]]
  // Keep the winding anticlockwise whichever way the bar runs.
  const area = pts.reduce((s, [a, z], i) => { const [b, y] = pts[(i + 1) % 4]; return s + a * y - b * z }, 0)
  if (area < 0) pts = pts.reverse()
  shape(p, f, d, pts, o)
}


// ---------------------------------------------------------------------------

const brick = new Part(), buff = new Part(), win = new Part(), roof = new Part(), orange = new Part(), pink = new Part()

// The long warehouse.
const WX0 = 3.7, WX1 = 21.4, WY0 = -30.4, WY1 = 44.7
const Y_LOW = -13.5, Y_BUFF = 35.0
const Z_W = 12.4, Z_PAR = 13.4, Z_LOW = 5.9, Z_STAIR = 15.9
// The mural building and the link.
const MX0 = -26.1, MX1 = -3.0, MY0 = -21.1, MY1 = -0.1, Z_M = 9.8, Z_MPAR = 11.4

// Warehouse: three-storey red brick, a buff end block, a one-storey tail.
box(brick, WX0, WX1, Y_LOW, Y_BUFF, 0, Z_PAR, 0.3, roof, [false, true, false, true])
box(buff, WX0, WX1, Y_BUFF, WY1, 0, Z_PAR + 0.4, 0.3, roof, [true, true, true, true])
box(brick, WX0, WX1, WY0, Y_LOW, 0, Z_LOW, 0.3, roof, [true, true, false, true])
box(brick, WX0, 8.5, -6, -1, Z_PAR - 0.3, Z_STAIR, 0.3, roof)
// Flat roof sunk a metre inside the parapet.
box(roof, WX0 + 0.5, WX1 - 0.5, Y_LOW + 0.5, Y_BUFF, Z_PAR - 1.2, Z_W, 0, roof, [false, false, false, false])
// The red block's end above the tail.
rect(brick, 'S', Y_LOW, WX0, WX1, Z_LOW - 0.3, Z_PAR - 0.3, 0)

// Windows: two upper rows per 3.4 m bay on the lot side, about half of
// them painted; a few ground-floor windows and doors.
{
  const n = Math.round((Y_BUFF - Y_LOW) / 3.4), m = (Y_BUFF - Y_LOW) / n
  const painted = (i: number, r: number) => ((i * 7 + r * 3) % 5) < 3
  for (let i = 0; i < n; i++) {
    const a = Y_LOW + i * m + 0.8, b = Y_LOW + (i + 1) * m - 0.8
    for (const [r, z0, z1] of [[0, 4.9, 7.6], [1, 8.8, 11.5]] as [number, number, number][]) {
      rect(painted(i, r) ? orange : win, 'W', WX0, a, b, z0, z1)
      rect(win, 'E', WX1, a, b, z0, z1)
    }
    if (i % 3 === 1) rect(win, 'W', WX0, a + 0.2, b - 0.2, 0.3, 3.0)
  }
}
// The buff block: big windows, two bays a side, three floors.
for (const [f, d, a0, a1] of [['W', WX0, Y_BUFF, WY1], ['E', WX1, Y_BUFF, WY1], ['N', WY1, WX0, WX1]] as [F, number, number, number][]) {
  const n = f === 'N' ? 4 : 2, m = (a1 - a0) / n
  for (let i = 0; i < n; i++) for (const [z0, z1] of [[0.4, 3.4], [4.9, 7.6], [8.8, 11.6]] as AZ[]) rect(win, f, d, a0 + i * m + 0.9, a0 + (i + 1) * m - 0.9, z0, z1)
}
// The one-storey tail.
for (const [f, d] of [['W', WX0], ['E', WX1]] as [F, number][]) for (let i = 0; i < 4; i++) {
  const a = WY0 + 1 + i * 4.1
  rect(win, f, d, a + 0.8, a + 3.0, 1.0, 3.6)
}

// The mural building, its stepped Rail Trail parapet, and the link.
box(brick, MX0, MX1, MY0, MY1, 0, Z_M, 0.3, roof, [true, false, true, true])
box(brick, MX0, MX0 + 0.5, -16.0, -6.5, Z_M - 0.3, Z_MPAR, 0.2, roof)
box(brick, MX1, WX0, MY0, MY1, 0, 7.4, 0.3, roof, [true, false, true, false])
box(brick, -0.3, WX0, -24.7, MY0, 0, Z_LOW, 0.3, roof, [true, false, false, true])

// Murals, flush on the walls as broad flat fields.
{
  // Lot side (north-east face): orange, with the pink figure at its east end.
  const y = MY1
  shape(orange, 'N', y, [[MX0 + 0.2, 0.3], [-9.0, 0.3], [-6.0, Z_M - 0.5], [MX0 + 0.2, Z_M - 0.5]], 0.03)
  shape(pink, 'N', y, [[-9.0, 0.3], [MX1, 0.3], [MX1, Z_M - 0.5], [-6.0, Z_M - 0.5]], 0.03)
  rect(pink, 'N', y, MX1, WX0, 0.3, 7.0, 0.03)
  // Its windows, and a door with a dark canopy under them.
  for (const c of [-20.5, -12.5]) rect(win, 'N', y, c - 1.0, c + 1.0, 5.6, 7.4, 0.06)
  rect(win, 'N', y, -24.6, -22.6, 0.3, 2.8, 0.06)
  // Rail Trail side (north-west face): magenta, an orange sun on the parapet.
  const x = MX0
  rect(pink, 'W', x, MY0 + 0.2, MY1 - 0.2, 0.3, Z_M - 0.5, 0.03)
  rect(pink, 'W', x, -15.8, -6.7, Z_M - 0.4, Z_MPAR - 0.3, 0.03)
  const sun: AZ[] = []
  for (let k = 0; k <= 10; k++) { const t = (k / 10) * Math.PI; sun.push([-11.25 + 3.6 * Math.cos(t), Z_M - 1.0 + 2.2 * Math.sin(t)]) }
  shape(orange, 'W', x, sun, 0.06)
  for (let i = 0; i < 6; i++) { const c = -18.6 + i * 3.4; rect(win, 'W', x, c - 0.8, c + 0.8, 5.4, 7.2, 0.06) }
  for (const c of [-15.0, -8.0]) rect(win, 'W', x, c - 1.0, c + 1.0, 1.0, 3.4, 0.06)
  // South side, over the garden: orange and pink flowers.
  shape(orange, 'S', MY0, [[MX0 + 0.2, 0.3], [-14.0, 0.3], [-10.0, Z_M - 0.5], [MX0 + 0.2, Z_M - 0.5]], 0.03)
  shape(pink, 'S', MY0, [[-14.0, 0.3], [MX1, 0.3], [MX1, Z_M - 0.5], [-10.0, Z_M - 0.5]], 0.03)
  for (const c of [-19.0, -8.0]) rect(win, 'S', MY0, c - 1.1, c + 1.1, 5.4, 7.4, 0.06)
}

// Colours from the daylight photos: weathered red brick and buff brick; the
// murals' oranges and yellows as one orange, their reds, pinks and magentas
// as one pink, both pulled to the palette's lightness.
const parts = [
  { part: brick, material: finish('artisan-brick', 0xb8735f) },
  { part: buff, material: finish('artisan-buff', 0xd9c393) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: orange, material: finish('mural-orange', 0xe9a46b) },
  { part: pink, material: finish('mural-pink', 0xd27aa6) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name}: ${part.triangles}`).join(', '))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Dilworth Artisan Station', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 42, osm: 'way/432937709', height: Z_STAIR,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/clt-dilworth-artisan-station.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
