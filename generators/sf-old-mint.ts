/**
 * Old San Francisco Mint ("the Granite Lady") — original procedural
 * geometry, CC0-1.0.
 * bun generators/sf-old-mint.ts
 *
 * Frame: built turned to the South of Market grid, BEARING 315. x across
 * (+x = the Fifth Street front with the portico, facing north-east), y along
 * (+y = the Mission Street front, north-west), z up, metres. Origin =
 * centroid of the OSM outline way/32863779.
 *
 * Evidence
 * - OSM way/32863779 (height 16, 3 levels + 1 underground; architect Alfred
 *   B. Mullett, 1874; NRHP 66000231, NHL): a 58 x 68 m block with corner
 *   pavilions, a portico on Fifth Street and a pavilion at the back. It
 *   matches the lidar to within a metre and is used as drawn.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.5 m in this frame
 *   (/tmp/city/sf/work/sf-old-mint). y = 0 is 8.9 m NAVD88, the lowest ground
 *   (the south corner); the site is nearly flat (8.9-10). Above that: the
 *   parapets at 17-18; a central range 20 m wide under a low gabled roof,
 *   ridge 20, from the back pediment to the portico, broken by the open
 *   courtyard (x -14..-2.5, y ±14, its floor at 4.7, the main floor); the
 *   portico's podium and the head of its stairs at 4.7; two square brick
 *   chimneys (4.4 m) at x -19, y ±5.8, to 33.
 * - Published (Wikipedia; NPS NHL nomination): 1869-1874, Greek Revival,
 *   sandstone over a granite basement, a hexastyle Doric portico on Fifth
 *   Street, built around a central courtyard; survived the 1906 fire.
 * - Commons daylight photos: "Old US Mint in San Francisco 2023.jpg" (Olaf
 *   Meister, CC BY-SA 4.0, the Fifth and Mission corner), "Old US Mint (San
 *   Francisco) 2.JPG" (Sanfranman59, CC BY-SA 4.0, the portico head-on),
 *   "Old San Francisco Mint rear 06-2023.jpg" (Percival Kestreltail, CC BY-SA
 *   4.0, the back, roofs, courtyard and chimneys from above), "Old U-S- Mint
 *   2012-09-17 13-54-34.jpg" (tberning, CC BY-SA 3.0, the south side with the
 *   chimneys and the granite basement), "2017 Old San Francisco Mint
 *   Building.jpg" (Beyond My Ken, CC BY-SA 4.0).
 *
 * Estimated from the photos (scaled to the lidar): the storeys (granite
 * basement to 4.8, two storeys of windows, entablature 15-17.6), the window
 * bays (~4.2 m), the six columns (1.5 m across, 3.2 m apart, 4.8-14.6), the
 * entablature and pediments, the pilasters on the corner pavilions, the
 * stairs (six broad steps). Colours from the photos pulled to the palette's
 * lightness: buff-grey sandstone, a greyer granite basement, red brick.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const BEARING = 315
const ANCHOR = { lng: -122.407238, lat: 37.782728 }
const sand = new Part(), granite = new Part(), trim = new Part(), win = new Part(), roof = new Part(), brick = new Part()

// --- Heights ---
const BASE = 4.8, ENT = 15.2, TOP = 17.6, RIDGE = 20, COURT = 4.7
// The outline (counter-clockwise), from OSM in this frame, and the courtyard.
const OUTLINE: XY[] = [
  [26.1, 33.8], [12.7, 33.8], [12.7, 30.1], [-12.7, 30.1], [-12.7, 32.4], [-23.9, 32.4], [-23.9, 9.5], [-28.9, 9.5],
  [-28.9, -9.4], [-23.9, -9.4], [-23.9, -34.4], [-13.5, -34.4], [-13.5, -30.0], [13.6, -30.0], [13.6, -33.2], [24.8, -33.2],
  [24.8, -21.8], [21.5, -21.8], [21.5, -11.2], [29.0, -11.2], [29.0, 8.8], [21.5, 8.8], [21.5, 20.5], [26.1, 20.5],
]
const CY: [number, number, number, number] = [-14, -2.5, -14, 14] // courtyard x0, x1, y0, y1
// the portico (x 21.5..29) is open; its outline edges are drawn as the portico
const PORTICO = { x0: 21.5, x1: 29.0, y0: -11.2, y1: 8.8 }
const PC = (PORTICO.y0 + PORTICO.y1) / 2

// --- Helpers ---
type Seg = { a: XY; t: XY; n: XY; len: number }
function seg(a: XY, b: XY): Seg {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
  return { a, t, n: [t[1], -t[0]], len }
}
const P = (g: Seg, s: number, d: number, z: number): V3 => [g.a[0] + g.t[0] * s + g.n[0] * d, g.a[1] + g.t[1] * s + g.n[1] * d, z]
function wall(part: Part, g: Seg, s0: number, s1: number, z0: number, z1: number, d = 0) {
  part.quad(P(g, s0, d, z0), P(g, s1, d, z0), P(g, s1, d, z1), P(g, s0, d, z1))
}
const fan = (part: Part, pts: V3[]) => { for (let i = 1; i < pts.length - 1; i++) part.tri(pts[0], pts[i], pts[i + 1]) }
function band(part: Part, g: Seg, s0: number, s1: number, prof: [number, number][]) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [d0, z0] = prof[k], [d1, z1] = prof[k + 1]
    part.quad(P(g, s0, d0, z0), P(g, s1, d0, z0), P(g, s1, d1, z1), P(g, s0, d1, z1))
  }
  fan(part, prof.map(([d, z]) => P(g, s0, d, z)))
  fan(part, [...prof].reverse().map(([d, z]) => P(g, s1, d, z)))
}
/** An axis-aligned box, with optional top and bottom caps. */
function box(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = part, bottom: Part | null = null) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4]
    part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (top) top.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1])
  if (bottom) bottom.quad([x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z0])
}
function lathe(part: Part, prof: [number, number][], cx: number, cy: number, n = 12) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const dr = r1 - r0, dz = z1 - z0, l = Math.hypot(dr, dz) || 1
    for (let i = 0; i < n; i++) {
      const t0 = (i / n) * 2 * Math.PI, t1 = ((i + 1) / n) * 2 * Math.PI
      const p = (r: number, z: number, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
      const nn = (t: number): V3 => [(Math.cos(t) * dz) / l, (Math.sin(t) * dz) / l, -dr / l]
      part.tri(p(r0, z0, t0), p(r0, z0, t1), p(r1, z1, t1), undefined, undefined, undefined, [nn(t0), nn(t1), nn(t1)])
      part.tri(p(r0, z0, t0), p(r1, z1, t1), p(r1, z1, t0), undefined, undefined, undefined, [nn(t0), nn(t1), nn(t0)])
    }
  }
}
const inPoly = (x: number, y: number, poly: XY[]) => {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
const inCourt = (x: number, y: number) => x > CY[0] && x < CY[1] && y > CY[2] && y < CY[3]
const inPortico = (x: number, y: number) => x > PORTICO.x0 && x < PORTICO.x1 && y > PORTICO.y0 && y < PORTICO.y1

/** The face's storeys: granite basement, two storeys of windows in bays, cornice and blocking course. */
function facade(g: Seg, opts: { pilasters?: boolean; court?: boolean; recess?: boolean } = {}) {
  const z0 = opts.court ? COURT : 0
  if (!opts.court) wall(granite, g, 0, g.len, 0, BASE)
  // the wall behind the portico is in shadow all day: drawn in the greyer granite so the columns stand out
  wall(opts.recess ? granite : sand, g, 0, g.len, opts.court ? COURT : BASE, TOP)
  const n = Math.max(1, Math.round(g.len / 4.2)), w = g.len / n
  for (let k = 0; k < n; k++) {
    const sc = w * (k + 0.5)
    if (w < 2.6) continue
    if (!opts.court) wall(win, g, sc - 0.7, sc + 0.7, 1.4, 3.4, 0.05)
    wall(win, g, sc - 0.75, sc + 0.75, 6.0, 9.6, 0.05)
    wall(win, g, sc - 0.75, sc + 0.75, 10.8, 14.0, 0.05)
  }
  if (!opts.court) band(trim, g, 0, g.len, [[0, BASE - 0.4], [0.35, BASE - 0.4], [0.35, BASE + 0.2], [0, BASE + 0.2]])
  band(trim, g, 0, g.len, [[0, ENT + 0.6], [0.25, ENT + 0.6], [0.6, ENT + 1.2], [0.6, ENT + 1.6], [0, ENT + 1.6]])
  if (opts.pilasters && !opts.court) for (let k = 0; k <= n; k++) {
    const s = Math.min(g.len - 0.55, Math.max(0.55, w * k))
    band(sand, g, s - 0.55, s + 0.55, [[0, BASE + 0.2], [0.3, BASE + 0.2], [0.3, ENT + 0.6], [0, ENT + 0.6]])
  }
  void z0
}

// ---------------------------------------------------------------------------
// Outer walls, all round the outline, except the portico's open front.
for (let i = 0; i < OUTLINE.length; i++) {
  const a = OUTLINE[i], b = OUTLINE[(i + 1) % OUTLINE.length]
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
  if (inPortico(mx - 0.1, my) || (a[0] === 29.0 && b[0] === 29.0) || (Math.abs(a[0] - 21.5) < 0.01 && Math.abs(b[0] - 29) < 0.01) || (Math.abs(a[0] - 29) < 0.01 && Math.abs(b[0] - 21.5) < 0.01)) continue
  const g = seg(a, b)
  // the corner pavilions and the back pavilion carry pilasters
  const pav = (g.len < 16 && !(Math.abs(mx) > 28)) || mx < -28
  facade(g, { pilasters: pav })
}
// the wall behind the portico
facade(seg([PORTICO.x0, PORTICO.y0], [PORTICO.x0, PORTICO.y1]), { recess: true })
// courtyard walls (facing in)
{
  const [x0, x1, y0, y1] = CY
  for (const g of [seg([x0, y0], [x0, y1]), seg([x0, y1], [x1, y1]), seg([x1, y1], [x1, y0]), seg([x1, y0], [x0, y0])]) facade(g, { court: true })
  roof.quad([x0, y0, COURT], [x1, y0, COURT], [x1, y1, COURT], [x0, y1, COURT])
}

// The flat roofs: the outline cut into cells, less the courtyard and portico.
{
  const xs = [...new Set([...OUTLINE.map((p) => p[0]), CY[0], CY[1]])].sort((p, q) => p - q)
  const ys = [...new Set([...OUTLINE.map((p) => p[1]), CY[2], CY[3]])].sort((p, q) => p - q)
  for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) {
    const cx = (xs[i] + xs[i + 1]) / 2, cy = (ys[j] + ys[j + 1]) / 2
    if (!inPoly(cx, cy, OUTLINE) || inCourt(cx, cy) || inPortico(cx, cy)) continue
    roof.quad([xs[i], ys[j], TOP], [xs[i + 1], ys[j], TOP], [xs[i + 1], ys[j + 1], TOP], [xs[i], ys[j + 1], TOP])
    granite.quad([xs[i], ys[j + 1], 0], [xs[i + 1], ys[j + 1], 0], [xs[i + 1], ys[j], 0], [xs[i], ys[j], 0])
  }
}

// The central range's low gabled roofs, with pediments at both fronts.
function range(x0: number, x1: number, c: number, hw: number, frontPed: boolean, backPed: boolean) {
  const o = 0.6
  const E = TOP, R = RIDGE
  roof.quad([x0, c - hw - o, E - 0.1], [x1, c - hw - o, E - 0.1], [x1, c, R], [x0, c, R])
  roof.quad([x1, c + hw + o, E - 0.1], [x0, c + hw + o, E - 0.1], [x0, c, R], [x1, c, R])
  for (const [x, sgn, ped] of [[x1, 1, frontPed], [x0, -1, backPed]] as [number, number, boolean][]) {
    const A: V3 = [x, c - sgn * hw, E], B: V3 = [x, c + sgn * hw, E], C: V3 = [x, c, R - 0.15]
    sand.tri(A, B, C)
    if (!ped) continue
    // raking and horizontal cornices of the pediment
    const g = sgn > 0 ? seg([x, c - hw - o], [x, c + hw + o]) : seg([x, c + hw + o], [x, c - hw - o])
    band(trim, g, 0, g.len, [[0, E - 0.7], [0.5, E - 0.7], [0.5, E], [0, E]])
    const L = g.len, rise = R - E
    for (const half of [0, 1]) {
      const sa = half ? L / 2 : 0, sb = half ? L : L / 2
      const za = half ? E + rise : E, zb = half ? E : E + rise
      const q: V3[] = [P(g, sa, 0.5, za - 0.05), P(g, sb, 0.5, zb - 0.05), P(g, sb, 0.5, zb + 0.4), P(g, sa, 0.5, za + 0.4)]
      trim.quad(q[0], q[1], q[2], q[3])
      trim.quad(P(g, sa, 0, za + 0.4), q[3], q[2], P(g, sb, 0, zb + 0.4))
    }
  }
}
range(-28.9, CY[0], 0, 10, false, true)
range(CY[1], PORTICO.x1 + 0.6, PC, 10, true, false)

// The portico: podium, six Doric columns, the entablature, the stairs.
{
  const { x0, x1, y0, y1 } = PORTICO
  box(granite, x0, x1, y0, y1, 0, BASE, granite)
  band(trim, seg([x1, y0], [x1, y1]), -0.3, y1 - y0 + 0.3, [[0, BASE - 0.4], [0.35, BASE - 0.4], [0.35, BASE + 0.2], [0, BASE + 0.2]])
  // entablature over the columns, closed underneath
  box(sand, x0, x1 + 0.3, y0, y1, 14.6, TOP, null, sand)
  for (const g of [seg([x1 + 0.3, y0], [x1 + 0.3, y1]), seg([x0, y0], [x1 + 0.3, y0]), seg([x1 + 0.3, y1], [x0, y1])]) {
    band(trim, g, -0.2, g.len + 0.2, [[0, 15.9], [0.25, 15.9], [0.6, 16.5], [0.6, TOP - 0.1], [0, TOP - 0.1]])
    band(trim, g, 0, g.len, [[0, 14.6], [0.15, 14.6], [0.15, 15.0], [0, 15.0]])
  }
  for (const d of [-8.0, -4.8, -1.6, 1.6, 4.8, 8.0]) {
    const cy = PC + d, cx = x1 - 1.2
    lathe(trim, [[0.8, BASE + 0.2], [0.72, 13.6], [0.66, 13.9], [0.95, 14.2]], cx, cy, 12)
    box(trim, cx - 1.0, cx + 1.0, cy - 1.0, cy + 1.0, 14.2, 14.6)
    box(trim, cx - 1.0, cx + 1.0, cy - 1.0, cy + 1.0, BASE, BASE + 0.25)
  }
  // the main doors behind the columns
  const back = seg([x0, y0], [x0, y1])
  wall(win, back, (y1 - y0) / 2 - 1.2, (y1 - y0) / 2 + 1.2, BASE + 0.2, BASE + 5.2, 0.06)
  // broad stairs up to the portico, between granite cheeks
  const S0 = PC - 5.4, S1 = PC + 5.4, N = 6
  for (let k = 0; k < N; k++) {
    const z = ((k + 1) / N) * BASE, xo = x1 + (N - k) * 0.7
    box(granite, x1 - 0.01, xo, S0, S1, 0, z, granite)
  }
  box(granite, x1, x1 + N * 0.7 + 0.3, S0 - 1.2, S0, 0, BASE * 0.6, granite)
  box(granite, x1, x1 + N * 0.7 + 0.3, S1, S1 + 1.2, 0, BASE * 0.6, granite)
}

// The two brick chimneys over the back range.
for (const cy of [5.8, -5.8]) {
  box(brick, -21.4, -16.9, cy - 2.2, cy + 2.2, TOP - 1, 32.4, null)
  box(trim, -21.7, -16.6, cy - 2.5, cy + 2.5, 32.4, 33.0, trim, trim)
}

const parts = [
  { part: sand, material: finish('mint-sandstone', 0xe2dccf) },
  { part: granite, material: finish('mint-granite', 0xcdcac3) },
  { part: trim, material: finish('mint-trim', 0xeeeae1) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: brick, material: PALETTE.terracotta },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Old San Francisco Mint', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 33,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/32863779'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-old-mint.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
