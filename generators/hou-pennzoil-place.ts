/**
 * Pennzoil Place (1975, Philip Johnson and John Burgee), Houston.
 * Original procedural geometry, CC0-1.0.
 * bun generators/hou-pennzoil-place.ts
 *
 * Frame: built turned to the downtown grid, BEARING 34.6: +y runs north-east
 * along the block, +x south-east, z up, metres. Origin = centroid of the OSM
 * outline way/580965929 (-95.3656214, 29.7601211).
 *
 * What it is: two identical 36-storey towers of dark bronze glass, each a
 * trapezoid in plan (one corner cut off at 45 degrees), set 180 degrees to
 * each other on one square block so they stand 10 ft apart across a slot.
 * Each tower's roof is one plane sloping at 45 degrees, highest at the slot
 * and lowest at the street, so together the two read as a split block with
 * a pitched top. In the two triangles left between the towers' cut corners,
 * glass-roofed atria slope at about 45 degrees from the street up to the slot.
 *
 * Evidence
 * - OSM: outline way/580965929; parts way/260511513 and way/260511516 (the
 *   towers, 121 m skillion) and way/260511512 (the two atria and the slot,
 *   tagged 50 m gabled). OSM's tower heights are low against lidar and
 *   published figures.
 * - USGS 3DEP lidar TX_Coastal_B1_2018 (flight 2018), 0.5 m grid sampled in
 *   this frame (SCRATCH/work/hou-pennzoil-place/lidar.json). y = 0 is the
 *   lowest ground under the block, 0.3 m above the grid's ground_min.
 *   Measured: block x -38..38, y -38.5..38.5; south tower's cut face runs
 *   x = 2.5 - y (so it meets the east face at y = -35.5 and the slot at
 *   x = 4); roof 123.5 at the street face rising to 159.7 at the slot (45
 *   degrees); the slot about 1.5-2 m wide in the lidar (drawn 3 m, the
 *   published 10 ft); atrium glass rising from about 1.5 m at the street to
 *   about 37 m at the slot, sloping across x.
 * - Published (Wikipedia, CTBUH): 523 ft (159 m), 36 floors, 1975, bronze
 *   glass, towers 10 ft apart, 45-degree roofs and atria.
 * - Commons daylight photos (EVIDENCE):
 *   "Pennzoil Place in Houston.JPG" (Agsftw, CC BY-SA 3.0) — the slot and
 *     both sloped tops from the north-west;
 *   "Pennzoil Place in Houston - Dec 2013.JPG" (Agsftw, CC BY-SA 3.0) — the
 *     slot from the north;
 *   "Pennzoil Place, Houston, Texas LCCN2011630051.tif" (Carol M. Highsmith,
 *     public domain) — from a tower to the south-east: both roofs, the slot
 *     and an atrium;
 *   "PennzoilPlace.jpg" and "Pennzoil Place 1.jpg" (Rick Kimpel, CC BY-SA
 *     2.0) — atrium glass meeting the towers;
 *   "Building6 houston.jpg" (Anders Lagerås, CC BY-SA 3.0) — the slot above
 *     the atrium;
 *   "2024-0109-Pennzoil Place gap.jpg" (Bobak Ha'Eri, CC BY 3.0,
 *     https://commons.wikimedia.org/wiki/File:2024-0109-Pennzoil_Place_gap.jpg)
 *     — the slot from the plaza: a sky-thin gap over the atrium glass, and a
 *     sloped roof reading pale silver against the dark walls;
 *   "2024-0109-Pennzoil Place atrium.JPG" (Bobak Ha'Eri, CC BY 3.0) — the
 *     atrium glazing.
 *
 * Round 2 (lead review): the curtain wall is a window-prefixed bronze
 * ('window-bronze') so it lights at night; the sloped roofs are bronze glass
 * a shade lighter ('glass-bronze', dark at night); pale-bronze floor lines
 * every three floors join the vertical mullion lines; the atria carry a thin
 * pale glazing frame round their sloped roofs (photos: Rick Kimpel's).
 *
 * Rework (user review: "reads as a flat-topped dark block"):
 * - Massing re-checked and kept. Lidar profiles across the slot (x = -20..20,
 *   y every 2 m) climb 1.0 m per metre from 124.5 at the street faces to
 *   160.4 at the slot on both towers (45 degrees, rising toward the slot on
 *   each, so the two roofs face opposite ways); the row at y = 0 is atrium
 *   glass, 18.4 m at x = -20 rising to 37.2 m at x = 0, so the slot is open
 *   to the sky down to the atria. The plan (trapezoids, cut faces on
 *   x = 2.5 - y) matches lidar, p1 (NW), p4 (SE) and p6/p8 (the slot).
 * - The slot is drawn 6 m wide: twice the published 10 ft (3 m), a
 *   deliberate exaggeration so it survives at phone size. The towers keep
 *   their outer faces and cut lines; each slot face moves in 1.5 m, and the
 *   roofs keep the 123.5 m eave and the 159.7 m ridge (slope 45.6 degrees
 *   against the measured 45).
 * - Roof planes are a pale silver-bronze glass ('glass-bronze' #a9aeb0), set
 *   off from the dark bronze walls as the roofs catch the sky in p4 and p6,
 *   with thin bronze glazing ribs running up the fall (p4).
 * - A bold pale-bronze band (2.4 m on the walls, 2-2.6 m on the roofs) runs
 *   round every roof edge: the low eave, the raking gable edges on the end
 *   faces, the falling top of the cut faces and the ridge at the slot, so the
 *   45-degree gable profile and the two ridges read as pale lines.
 * - The two slot faces are a darker bronze ('window-slot'), so the slot reads
 *   as a dark gap with a pale ridge line on each side.
 * - The facade lines moved to their own quieter bronze ('pennzoil-mullion'):
 *   floor lines every three floors (10.3 m) and verticals every ~13 m. The
 *   atria keep their wedge form, with a bolder pale frame and two glazing bars.
 * - From the sheet's exact SW view (bearing 34.6, so the camera looks almost
 *   square onto the south tower's eave face) the near roof is seen face-on
 *   and its ridge hides the slot: what reads is the pale sloped roof framed
 *   in pale bronze, and the far tower's dark inner wall rising behind its
 *   falling cut edge to the same ridge height. The slot itself only shows
 *   from the NW, SE and along the block's long axis.
 *
 * Estimated: the colours (the photos' near-black bronze glass pulled up to a
 * bronze charcoal, the roofs a pale sky-catching silver-bronze, as they read
 * in p4 and p6); the lines, drawn one every 13 m and every three floors
 * rather than at the real 1.5 m mullion pitch; the edge bands' widths.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const BEARING = 34.6
const facade = new Part(), inner = new Part(), roof = new Part(), trim = new Part(), lines = new Part(), atrium = new Part()

// HALF is half the slot. Published 10 ft (3 m), lidar 1.5-2 m; drawn 6 m
// (2x the published width), a deliberate exaggeration so the slot survives
// at phone size. The cut faces stay on their lidar line x = 2.5 - y.
const HALF = Number(process.env.PZ_HALF ?? 3)
const EAVE = 123.5, PEAK = 159.7, Y_OUT = -38.5
const roofZ = (y: number) => EAVE + (PEAK - EAVE) * (y - Y_OUT) / (-HALF - Y_OUT)
const ridgeZ = PEAK
// The south tower, counter-clockwise from above; the north tower is it turned 180 degrees.
const SOUTH: XY[] = [[-38, -38.5], [38, -38.5], [38, -35.5], [2.5 + HALF, -HALF], [-38, -HALF]]
// which edge of SOUTH is the slot face (from [2.5+HALF,-HALF] to [-38,-HALF])
const SLOT_EDGE = 3

const area = (p: XY[]) => p.reduce((a, q, i) => { const r = p[(i + 1) % p.length]; return a + q[0] * r[1] - r[0] * q[1] }, 0) / 2
const at = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

/** A vertical strip on wall a→b (outward = right of a→b), offset `off` out, between z0 and a top that runs za→zb. */
function wall(part: Part, a: XY, b: XY, z0a: number, z0b: number, za: number, zb: number, off = 0) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = (b[1] - a[1]) / L * off, ny = -(b[0] - a[0]) / L * off
  part.quad([a[0] + nx, a[1] + ny, z0a], [b[0] + nx, b[1] + ny, z0b], [b[0] + nx, b[1] + ny, zb], [a[0] + nx, a[1] + ny, za])
}

/** A horizontal line on wall a→b at height zl, clipped under the wall's sloped top (minus `gap`). */
function floorLine(a: XY, b: XY, za: number, zb: number, zl: number, h: number, gap: number) {
  const top0 = za - gap, top1 = zb - gap
  if (zl + h > Math.max(top0, top1)) return
  let t0 = 0, t1 = 1
  if (zl + h > Math.min(top0, top1)) {
    const tc = (zl + h - top0) / (top1 - top0)
    if (top0 > top1) t1 = tc; else t0 = tc
  }
  const p = at(a, b, t0), q = at(a, b, t1)
  wall(lines, p, q, zl - h, zl - h, zl + h, zl + h, 0.06)
}

function tower(sign: 1 | -1) {
  const pts = SOUTH.map(([x, y]) => [sign * x, sign * y] as XY)
  const z = (p: XY) => roofZ(sign * p[1])
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    const za = z(a), zb = z(b), L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const slot = i === SLOT_EDGE
    // the wall itself, in 5 m-ish columns so the low edge follows the terrain
    const n = Math.max(1, Math.ceil(L / 5))
    for (let k = 0; k < n; k++) {
      const p = at(a, b, k / n), q = at(a, b, (k + 1) / n)
      wall(slot ? inner : facade, p, q, 0, 0, za + (zb - za) * k / n, za + (zb - za) * (k + 1) / n)
    }
    // a bold pale-bronze band under every roof edge: the eave, the two raking
    // gable edges, the cut face's sloping top, and the ridge on the slot face
    const band = 2.4
    wall(trim, a, b, za - band, zb - band, za, zb, 0.06)
    if (slot) continue
    // calm pale floor lines every three floors (36 floors over the 123.5 m eave)
    for (let zl = 10.3; zl < PEAK; zl += 10.3) floorLine(a, b, za, zb, zl, 0.22, band + 1.5)
    // a few vertical mullion lines, one every ~13 m, plus the corners
    const m = Math.max(1, Math.round(L / 13))
    for (let k = 0; k <= m; k++) {
      const t = k / m, w = (k === 0 || k === m ? 0.45 : 0.3) / L
      const t0 = Math.max(0, t - w), t1 = Math.min(1, t + w)
      wall(lines, at(a, b, t0), at(a, b, t1), 0, 0, za + (zb - za) * t0 - band, za + (zb - za) * t1 - band, 0.06)
    }
  }
  // the sloped roof: one plane, lifted a hair, then pale bands round its edges
  const p = area(pts) > 0 ? pts : [...pts].reverse()
  for (let i = 1; i < p.length - 1; i++) roof.tri([p[0][0], p[0][1], z(p[0])], [p[i][0], p[i][1], z(p[i])], [p[i + 1][0], p[i + 1][1], z(p[i + 1])])
  const cx = p.reduce((s, q) => s + q[0], 0) / p.length, cy = p.reduce((s, q) => s + q[1], 0) / p.length
  for (let i = 0; i < p.length; i++) {
    const A = p[i], B = p[(i + 1) % p.length]
    const L = Math.hypot(B[0] - A[0], B[1] - A[1])
    let ix = -(B[1] - A[1]) / L, iy = (B[0] - A[0]) / L
    if (ix * (cx - (A[0] + B[0]) / 2) + iy * (cy - (A[1] + B[1]) / 2) < 0) { ix = -ix; iy = -iy }
    // the ridge (slot edge) gets a wider band so it reads as a pale line at phone size
    const ridge = Math.abs(sign * A[1] + HALF) < 0.01 && Math.abs(sign * B[1] + HALF) < 0.01
    const w = ridge ? 2.6 : 2.0
    // slide the band's ends along the neighbouring edges so it stays inside the roof
    const A2: XY = [A[0] + ix * w, A[1] + iy * w], B2: XY = [B[0] + ix * w, B[1] + iy * w]
    const v: V3[] = [[A[0], A[1], z(A) + 0.1], [B[0], B[1], z(B) + 0.1], [B2[0], B2[1], z(B2) + 0.1], [A2[0], A2[1], z(A2) + 0.1]]
    const g = (v[1][0] - v[0][0]) * (v[2][1] - v[0][1]) - (v[1][1] - v[0][1]) * (v[2][0] - v[0][0])
    if (g > 0) trim.quad(v[0], v[1], v[2], v[3]); else trim.quad(v[0], v[3], v[2], v[1])
  }
  // mullion lines running up the slope, continuing the eave face's verticals
  // (the Highsmith aerial shows the glazing ribs running from eave to ridge)
  for (const xs of [-25.3, -12.7, 0, 12.7, 25.3]) {
    const yTop = (x: number) => Math.min(-HALF, 2.5 - x) - 1.0
    const loc: XY[] = [[xs - 0.3, -38.5], [xs + 0.3, -38.5], [xs + 0.3, yTop(xs + 0.3)], [xs - 0.3, yTop(xs - 0.3)]]
    const [q0, q1, r1, r0] = loc.map(([x, y]) => [sign * x, sign * y] as XY)
    const zz = (q: XY) => z(q) + 0.12
    const v: V3[] = [[q0[0], q0[1], zz(q0)], [q1[0], q1[1], zz(q1)], [r1[0], r1[1], zz(r1)], [r0[0], r0[1], zz(r0)]]
    const g = (v[1][0] - v[0][0]) * (v[2][1] - v[0][1]) - (v[1][1] - v[0][1]) * (v[2][0] - v[0][0])
    if (g > 0) lines.quad(v[0], v[1], v[2], v[3]); else lines.quad(v[0], v[3], v[2], v[1])
  }
}
tower(1)
tower(-1)

// ---------- the atria ----------
// West atrium: between the street (x = -38), the south tower's slot face and
// the north tower's cut face, rising to the middle of the slot; the east one
// is it turned. The two meet under the slot at about 37.6 m.
function atriumRoof(sign: 1 | -1) {
  const pts: XY[] = ([[-38, -HALF], [0, -HALF], [0, HALF], [-(2.5 + HALF), HALF], [-38, 35.5]] as XY[]).map(([x, y]) => [sign * x, sign * y])
  const z = (p: XY) => 1.5 + 0.95 * (sign * p[0] + 38)
  const p = area(pts) > 0 ? pts : [...pts].reverse()
  for (let i = 1; i < p.length - 1; i++) atrium.tri([p[0][0], p[0][1], z(p[0])], [p[i][0], p[i][1], z(p[i])], [p[i + 1][0], p[i + 1][1], z(p[i + 1])])
  // a pale glazing frame round the wedge's sloped roof, and two glazing bars down its fall
  const cx = p.reduce((s, q) => s + q[0], 0) / p.length, cy = p.reduce((s, q) => s + q[1], 0) / p.length
  const strip = (A: XY, B: XY, ix: number, iy: number, w: number) => {
    const A2: XY = [A[0] + ix * w, A[1] + iy * w], B2: XY = [B[0] + ix * w, B[1] + iy * w]
    const v: V3[] = [[A[0], A[1], z(A) + 0.1], [B[0], B[1], z(B) + 0.1], [B2[0], B2[1], z(B2) + 0.1], [A2[0], A2[1], z(A2) + 0.1]]
    const g = (v[1][0] - v[0][0]) * (v[2][1] - v[0][1]) - (v[1][1] - v[0][1]) * (v[2][0] - v[0][0])
    if (g > 0) trim.quad(v[0], v[1], v[2], v[3]); else trim.quad(v[0], v[3], v[2], v[1])
  }
  for (let i = 0; i < p.length; i++) {
    const A = p[i], B = p[(i + 1) % p.length]
    const L = Math.hypot(B[0] - A[0], B[1] - A[1])
    if (L < 1) continue
    let ix = -(B[1] - A[1]) / L, iy = (B[0] - A[0]) / L
    if (ix * (cx - (A[0] + B[0]) / 2) + iy * (cy - (A[1] + B[1]) / 2) < 0) { ix = -ix; iy = -iy }
    strip(A, B, ix, iy, 1.2)
  }
  // glazing bars running up the fall (along x), at a third and two thirds of the street edge
  for (const t of [1 / 3, 2 / 3]) {
    const yl = -HALF + (35.5 + HALF) * t, xl = yl < HALF ? 0 : Math.min(0, -2.5 - yl)
    const A: XY = [sign * -38, sign * (yl - 0.4)], B: XY = [sign * xl, sign * (yl - 0.4)]
    strip(A, B, 0, sign, 0.8)
  }
  // the low glass wall along the street
  const a: XY = [sign * -38, sign * 35.5], b: XY = [sign * -38, sign * -HALF]
  wall(atrium, a, b, 0, 0, 1.5, 1.5)
}
atriumRoof(1)
atriumRoof(-1)

const parts = [
  { part: facade, material: { name: 'window-bronze', color: 0x5f5850, roughness: 0.35 } },
  { part: inner, material: { name: 'window-slot', color: 0x48433e, roughness: 0.35 } },
  { part: roof, material: { name: 'glass-bronze', color: 0xa9aeb0, roughness: 0.25 } },
  { part: trim, material: finish('pennzoil-bronze', 0xd2c3aa) },
  { part: lines, material: finish('pennzoil-mullion', 0x8c8072) },
  { part: atrium, material: PALETTE.glass },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Pennzoil Place', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [29.7601211, -95.3656214], height: ridgeZ,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/580965929', 'way/260511512', 'way/260511513', 'way/260511516'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/hou-pennzoil-place.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
