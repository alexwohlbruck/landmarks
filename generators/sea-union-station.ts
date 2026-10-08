/**
 * Union Station (Oregon-Washington Station, 1911, Daniel J. Patterson),
 * Seattle: procedural, CC0-1.0.
 * bun generators/sea-union-station.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the walls run true
 * north-south in the lidar). The origin is the area centroid of OSM
 * way/45569666. y = 0 is the lowest ground the walls touch, on the 4th
 * Avenue side to the east (6.2 m NAVD88); the ground rises to the west and
 * to the Jackson Street plaza on the north, 6-7 m higher, so the west and
 * north walls sink into the slope and their detail starts at that level.
 *
 * Form: a great hall under a gable roof (barrel-vaulted inside) running
 * north-south, flanked by three-storey brick office wings with white stone
 * bands and cornices under low hipped red-tile roofs. On the north, the
 * entrance pavilion stands taller, its gable front carrying a white pediment
 * with a round clock window, three tall windows and a marquee over three
 * doors. The south gable end holds the hall's great semicircular window in
 * a brick arch, above a low white two-storey addition.
 *
 * Measured (USGS 3DEP WA_KingCo_1_2021, 0.5 m surface model, heights above
 * y = 0): the hall's eaves 23.2 m and ridge 27.2 m, 22 m wide; the pavilion
 * 24 m wide and 10 m deep, eaves 27.2 m and ridge 31.2 m, its front cornice
 * 20.2 m; the wings 10.8-11.2 m wide, eaves 22.2 m, rising to 24.2 m; the
 * south addition 13.2 m; the marquee 12.2 m; the plaza 7 m and the west
 * sidewalk 6.2 m above the 4th Avenue side.
 * Published: 1911; 1999 restoration (Wikipedia, "Union Station (Seattle)").
 * From photos: the pediment, clock window and three-bay front; the white
 * band over the second storey and the cornice of the wings; the brick arch
 * and window in the south gable (about three quarters of the hall's
 * width, rising nearly to the eaves); the addition's arched
 * windows; the red tile of the wing roofs; the bay rhythm (about 4 m).
 * Estimated: the arch's radius and springing, the pediment's pitch, window
 * grouping (the lower storeys in one panel per bay, the top storey in
 * another), the marquee's depth.
 * Left out: the lettering on the marquee (signage), balustrades and dentils,
 * the glass office tower east of the addition (another building).
 *
 * Photos: /tmp/city/sea/work/sea-union-station/credits.txt (Joe Mabel,
 * CC BY-SA 3.0, the north front and the south-east; Steve Morgan, CC BY-SA
 * 4.0; Adam Moss, CC BY-SA 2.0; SounderBruce, CC BY-SA 4.0, from above).
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

const brick = new Part(), trim = new Part(), roof = new Part(), tile = new Part(), win = new Part(), green = new Part()

function poly(p: Part, P: V3[], n: V3) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const Q = dot(f, n) >= 0 ? P : [...P].reverse()
  for (let i = 1; i < Q.length - 1; i++) p.tri(Q[0], Q[i], Q[i + 1])
}
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
function chamferRect(x0: number, y0: number, x1: number, y1: number, c: number): XY[] {
  return [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
}
function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false) {
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const [ax, ay] = ring[i], [bx, by] = ring[(i + 1) % n]
    p.quad([ax, ay, z0], [bx, by, z0], [bx, by, z1], [ax, ay, z1])
  }
  if (top) poly(p, ring.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, ring.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
/** A panel on a wall; arched top when `arch`. */
function panel(p: Part, o: XY, t: XY, n: XY, w: number, z0: number, z1: number, arch = false, off = 0.05) {
  const at = (s: number, z: number): V3 => [o[0] + t[0] * s + n[0] * off, o[1] + t[1] * s + n[1] * off, z]
  const nn: V3 = [n[0], n[1], 0]
  if (!arch) return poly(p, [at(-w / 2, z0), at(w / 2, z0), at(w / 2, z1), at(-w / 2, z1)], nn)
  const r = w / 2, zs = z1 - r, seg = w > 6 ? 16 : 10
  const pts: V3[] = [at(-r, z0), at(r, z0)]
  for (let k = 0; k <= seg; k++) {
    const a = (k / seg) * Math.PI
    pts.push(at(r * Math.cos(a), zs + r * Math.sin(a)))
  }
  poly(p, pts, nn)
}
/** A ring (or disc, r0 = 0) on a wall. */
function ring(p: Part, o: XY, t: XY, n: XY, zc: number, r0: number, r1: number, off: number, seg = 16, a0 = 0, a1 = 2 * Math.PI) {
  const P = (a: number, r: number): V3 => [o[0] + n[0] * off + t[0] * r * Math.cos(a), o[1] + n[1] * off + t[1] * r * Math.cos(a), zc + r * Math.sin(a)]
  const nn: V3 = [n[0], n[1], 0]
  for (let k = 0; k < seg; k++) {
    const u = a0 + ((a1 - a0) * k) / seg, v = a0 + ((a1 - a0) * (k + 1)) / seg
    if (r0 <= 0) poly(p, [P(u, 0), P(u, r1), P(v, r1)], nn)
    else poly(p, [P(u, r0), P(u, r1), P(v, r1), P(v, r0)], nn)
  }
}
/** A hipped roof over an axis-aligned rectangle, ridge along its long side. */
function hip(p: Part, x0: number, y0: number, x1: number, y1: number, ze: number, zr: number) {
  const w = x1 - x0, l = y1 - y0
  const E = (x: number, y: number): V3 => [x, y, ze]
  if (l >= w) {
    const h = w / 2, xm = x0 + h
    const A: V3 = [xm, y0 + h, zr], B: V3 = [xm, y1 - h, zr]
    poly(p, [E(x1, y0), E(x1, y1), B, A], [0, 0, 1])
    poly(p, [E(x0, y1), E(x0, y0), A, B], [0, 0, 1])
    poly(p, [E(x0, y0), E(x1, y0), A], [0, 0, 1])
    poly(p, [E(x1, y1), E(x0, y1), B], [0, 0, 1])
  }
}
/** A gable roof along y, with brick gable-end triangles. */
function gable(x0: number, x1: number, y0: number, y1: number, ze: number, zr: number, over = 0.6) {
  const xm = (x0 + x1) / 2
  const a = x0 - over, b = x1 + over, ez = ze - (zr - ze) * over / ((x1 - x0) / 2)
  poly(roof, [[a, y0 - over, ez], [xm, y0 - over, zr], [xm, y1 + over, zr], [a, y1 + over, ez]], [0, 0, 1])
  poly(roof, [[xm, y0 - over, zr], [b, y0 - over, ez], [b, y1 + over, ez], [xm, y1 + over, zr]], [0, 0, 1])
  // Undersides, so the overhang isn't see-through from below.
  poly(roof, [[a, y0 - over, ez], [xm, y0 - over, zr], [xm, y1 + over, zr], [a, y1 + over, ez]], [0, 0, -1])
  poly(roof, [[xm, y0 - over, zr], [b, y0 - over, ez], [b, y1 + over, ez], [xm, y1 + over, zr]], [0, 0, -1])
  for (const [y, s] of [[y0, -1], [y1, 1]] as [number, number][]) {
    poly(brick, [[x0, y, ze], [x1, y, ze], [xm, y, zr]], [0, s, 0])
    // A white raking cornice along the gable's edge.
    for (const [ex, sx] of [[x0, -1], [x1, 1]] as [number, number][]) {
      const lo: V3 = [ex + sx * over, y + s * 0.35, ez], hi: V3 = [xm, y + s * 0.35, zr]
      const dz = 0.9
      poly(trim, [lo, hi, [hi[0], hi[1], hi[2] - dz], [lo[0], lo[1], lo[2] - dz]], [0, s, 0])
    }
  }
}

// ------------------------------------------------------------- the plan ---
const N = 35.0, S = -22.1               // the main block's north and south faces
const HX = 11.0                          // the hall's half width
const WX = 22.0                          // the wings' outer faces
const PX = 12.0, PY = 24.9               // the pavilion's half width and back
const WEST_G = 6.2, NORTH_G = 7.0        // ground on the uphill sides

// ------------------------------------------------------------ the wings ---
for (const s of [-1, 1]) {
  const x0 = s < 0 ? -WX : HX, x1 = s < 0 ? -HX : WX
  const r = rect(x0, S, x1, N)
  prism(trim, r, 0, 1.0, false)
  prism(brick, r, 1.0, 12.8, false)
  prism(trim, rect(x0 - (s < 0 ? 0.3 : 0), S - 0.3, x1 + (s > 0 ? 0.3 : 0), N + 0.3), 12.8, 14.0, false, true)
  prism(brick, r, 14.0, 20.9, false)
  prism(trim, rect(x0 - (s < 0 ? 0.7 : 0), S - 0.7, x1 + (s > 0 ? 0.7 : 0), N + 0.7), 20.9, 22.2, true, true)
  hip(tile, x0 - (s < 0 ? 0.7 : 0), S - 0.7, x1 + (s > 0 ? 0.7 : 0), N + 0.7, 22.2, 24.4)
  // Windows: the outer face (east is the low side; west is uphill).
  const xo = s < 0 ? -WX : WX
  const g = s < 0 ? WEST_G : 0
  const t: XY = [0, s], nrm: XY = [s, 0]
  const bays = 13, step = (N - S - 3) / bays
  for (let k = 0; k < bays; k++) {
    const y = S + 1.5 + step * (k + 0.5)
    panel(win, [xo, y], t, nrm, 2.2, Math.max(1.8, g + 1.2), 11.9)
    panel(win, [xo, y], t, nrm, 2.2, 15.0, 19.8)
  }
  // The north and south ends of the wing: two bays each.
  for (const [yy, ny] of [[N, 1], [S, -1]] as [number, number][]) {
    for (const f of [0.3, 0.7]) {
      const x = x0 + (x1 - x0) * f
      const g2 = ny > 0 ? NORTH_G : (s < 0 ? WEST_G : 0)
      if (ny < 0) continue // the south end is behind the addition
      panel(win, [x, yy], [-ny, 0], [0, ny], 1.9, g2 + 1.4, 11.9)
      panel(win, [x, yy], [-ny, 0], [0, ny], 1.9, 15.0, 19.8)
    }
  }
}

// ------------------------------------------------------------- the hall ---
// Walls between the wings only show above their roofs; the gable roof.
prism(brick, rect(-HX, S, HX, PY), 20.0, 23.2, false)
gable(-HX, HX, S, PY, 23.2, 27.2)
// The south gable end: the great window in a brick arch, above the addition.
{
  const zc = 14.0, R = 8.8 // span 17.6 m, four fifths of the hall's end; the ring rises into the gable
  ring(brick, [0, S], [-1, 0], [0, -1], zc, R, R + 1.2, 0.3, 16, 0, Math.PI)
  for (const sx of [-1, 1])   panel(win, [0, S], [-1, 0], [0, -1], 2 * R, 13.25, zc + R, true, 0.12)
  // Fill the hall's end wall below the eaves between the wings.
  poly(brick, [[-HX, S, 13.2], [HX, S, 13.2], [HX, S, 23.2], [-HX, S, 23.2]], [0, -1, 0])
}

// --------------------------------------------------------- the pavilion ---
{
  const r = rect(-PX, PY, PX, N + 0.4)
  prism(brick, r, 0, 27.2, false)
  prism(trim, rect(-PX - 0.3, N + 0.4, PX + 0.3, N + 0.9), NORTH_G - 0.4, NORTH_G + 0.8, true, true) // stone base course
  // The white band at the balustrade and the cornice under the pediment.
  prism(trim, rect(-PX - 0.4, N - 1, PX + 0.4, N + 1.0), 13.3, 14.4, true, true)
  prism(trim, rect(-PX - 0.6, N - 1, PX + 0.6, N + 1.2), 19.2, 20.4, true, true)
  gable(-PX, PX, PY, N + 0.4, 27.2, 31.2, 0.6)
  // The pediment: white raking cornices from the cornice ends to its apex.
  const yf = N + 0.4, ap = 25.4
  for (const sx of [-1, 1]) {
    const lo: V3 = [sx * (PX + 0.6), yf + 0.5, 20.4], hi: V3 = [0, yf + 0.5, ap]
    poly(trim, [lo, hi, [0, yf + 0.5, ap + 1.4], [lo[0], lo[1], 21.8]], [0, 1, 0])
    // its top and side so it reads as a moulding
    poly(trim, [[lo[0], yf, 21.8], [0, yf, ap + 1.4], [0, yf + 0.5, ap + 1.4], [lo[0], yf + 0.5, 21.8]], [0, 0, 1])
  }
  // The clock window in the pediment.
  ring(trim, [0, yf], [-1, 0], [0, 1], 22.6, 1.0, 1.6, 0.1, 16)
  ring(win, [0, yf], [-1, 0], [0, 1], 22.6, 0, 1.0, 0.1, 16)
  // Three tall windows over three doors, and the marquee between them.
  for (const x of [-5.2, 0, 5.2]) {
    panel(win, [x, yf], [-1, 0], [0, 1], 3.2, 14.9, 18.8)
    panel(win, [x, yf], [-1, 0], [0, 1], 2.8, NORTH_G + 0.8, 11.4, true)
  }
  for (const x of [-9.6, 9.6]) {
    panel(win, [x, yf], [-1, 0], [0, 1], 1.8, 14.9, 18.8)
    panel(win, [x, yf], [-1, 0], [0, 1], 1.8, NORTH_G + 1.5, 11.6)
  }
  prism(green, chamferRect(-8.2, yf, 8.2, yf + 3.6, 0.3), 11.8, 12.4, true, true)
}

// ---------------------------------------------------------- the addition ---
// Two tall storeys in white stone across the south end, arched windows.
{
  const x0 = -WX, x1 = 19.8, y0 = -35.2, y1 = S
  prism(trim, chamferRect(x0, y0, x1, y1 + 0.2, 0.4), 0, 13.2, false)
  poly(roof, chamferRect(x0, y0, x1, y1 + 0.2, 0.4).map(([x, y]) => [x, y, 13.2] as V3), [0, 0, 1])
  for (const x of [-16, -9, -2, 5, 12]) {
    panel(win, [x, y0], [-1, 0], [0, -1], 4.6, 7.2, 12.0, true)
  }
  for (const y of [-31.5, -25.8]) {
    panel(win, [x1, y], [0, 1], [1, 0], 4.6, 7.2, 12.0, true)
    panel(win, [x1, y], [0, 1], [1, 0], 2.4, 1.0, 6.2)
  }
}

// ---------------------------------------------------------------- output ---
// Colours from the daylight photos: an orange-red brick pulled light, the
// white stone, a grey hall roof, red tile on the wings, the green marquee.
const parts = [
  { part: brick, material: finish('us-brick', 0xb8705e) },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: tile, material: finish('us-red-tile', 0xc47c5c) },
  { part: win, material: PALETTE.window },
  { part: green, material: finish('us-marquee-green', 0x5f8a72) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Union Station', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 31.2,
})
await Bun.write(new URL('../models/sea-union-station.glb', import.meta.url), glb)
console.log(`sea-union-station.glb: ${triangles} triangles, ${glb.length} bytes`)
