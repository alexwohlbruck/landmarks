/**
 * Russ Building, San Francisco — original procedural geometry, CC0-1.0.
 * bun generators/sf-russ-building.ts
 *
 * Frame: built turned to the block, BEARING 351 (the outline runs 9°
 * anticlockwise of north). x across the block (+x = the Montgomery Street
 * front, east), y along it (+y north), z up, metres. Origin = centroid of the OSM
 * outline way/129142347.
 *
 * Evidence
 * - OSM way/129142347 and parts 941918062/063 (2 levels, the light courts),
 *   1091964668/669 (16-level end wings), 1091964670-678 (22-32 levels, the
 *   tower, height 127.4; a 132.6 m finial). The outline sits ~2.5 m west of
 *   the lidar; the lidar wins.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.5 m in the turned frame
 *   (/tmp/city/sf/work/fd/{grid,prof}.py); y = 0 is the lowest ground (7.6 m
 *   NAVD88), ground varies 2.3 m. An E plan opening west: the tower bar on
 *   Montgomery Street (22 x 34.5 m) to 128 m, with 22-storey shoulders (92 m)
 *   north and south of it, a 22-storey middle arm (91.5 m) running west, two
 *   16-storey end wings (67-68 m), and two-storey light courts (12.5 m)
 *   between them. A small finial/flagstaff base on the tower roof reads 142 m.
 * - Published (Wikipedia, SF Landmark): 1927, George Kelham, 133 m, 31-32
 *   floors, neo-Gothic, the tallest building in San Francisco until 1964.
 * - Commons daylight photos: "Russ Building San Francisco May 2014.jpg"
 *   (grizzlehizzle, CC BY-SA 3.0, from above, the E plan, crowns and
 *   pinnacles), "RussBuildingWithItsTopInSanFrancisco.jpg" (Goodshoped35110s,
 *   public domain, the Montgomery front from below), "Russ Building front
 *   1.JPG" (BrokenSphere, CC BY-SA 3.0), "235 Montgomery St - Russ Building -
 *   Looking Up.jpg" (Douglaswth, CC BY-SA 4.0).
 *
 * Estimated: storey heights (base 6.3 m each, then ~3.6 m), window grouping
 * (one panel per ~6.8 m structural bay, i.e. per pair of windows between the
 * main piers, in three-storey groups with stone spandrel bands; the main piers
 * stand 0.25 m proud), the gothic arched top storeys and
 * crown pinnacles (2.6 m on the wings, 4 m on the tower, at the corners and
 * every few bays), the finial (drawn to 135 m, the flagstaff left out).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 351
const ANCHOR = { lng: -122.4028624, lat: 37.7914192 }
const terracotta = new Part(), windows = new Part(), roof = new Part(), trim = new Part()

type Box = { x0: number; x1: number; y0: number; y1: number; z: number; crown?: number }
const BASE = 12.5
const BOXES: Box[] = [
  { x0: -24.5, x1: 24, y0: -45, y1: 40, z: BASE }, // two-storey base over the whole lot
  { x0: -24.5, x1: -20, y0: -30.5, y1: 24, z: 16 }, // west strip along the courts
  { x0: -25.5, x1: 24, y0: 24, y1: 40, z: 68, crown: 2.6 }, // north wing
  { x0: 5, x1: 24, y0: 20, y1: 24.2, z: 68 },
  { x0: -19, x1: 24, y0: -45, y1: -30.5, z: 67.5, crown: 2.6 }, // south wing
  { x0: 13.5, x1: 24, y0: -30.7, y1: -24, z: 67.5 },
  { x0: -20, x1: 2.2, y0: -10, y1: 6, z: 91.5, crown: 2.6 }, // middle arm
  { x0: 2, x1: 24, y0: 14.3, y1: 20.2, z: 92, crown: 2.6 }, // tower shoulders
  { x0: 2, x1: 24, y0: -24.2, y1: -19.8, z: 92, crown: 2.6 },
  { x0: 2, x1: 24, y0: -20, y1: 14.5, z: 128, crown: 4 }, // the tower
]

/** Inside some box at least as tall as z: a panel there would never be seen. */
const buried = (x: number, y: number, z: number) =>
  BOXES.some((b) => x > b.x0 + 0.05 && x < b.x1 - 0.05 && y > b.y0 + 0.05 && y < b.y1 - 0.05 && z < b.z)

/** A box with chamfered vertical edges and a flat roof. */
function block(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, ch = 0.4, top: Part | null = roof) {
  const r: [number, number][] = [[x0 + ch, y0], [x1 - ch, y0], [x1, y0 + ch], [x1, y1 - ch], [x1 - ch, y1], [x0 + ch, y1], [x0, y1 - ch], [x0, y0 + ch]]
  for (let i = 0; i < 8; i++) {
    const a = r[i], b = r[(i + 1) % 8]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (top) for (let i = 1; i < 7; i++) top.tri([r[0][0], r[0][1], z1], [r[i][0], r[i][1], z1], [r[i + 1][0], r[i + 1][1], z1])
}

// Window rows: the base's two tall storeys, then three-storey groups.
const STOREY = 3.6
function rowsFor(top: number, crown: boolean): { z0: number; z1: number; arch: boolean }[] {
  const rows = [{ z0: 1.4, z1: 5.2, arch: false }, { z0: 7.4, z1: 11.4, arch: false }]
  const last = top - (crown ? 1.5 : 1.2)
  for (let z = BASE + 0.6; z + 3 * STOREY <= last + 0.01; z += 3 * STOREY) rows.push({ z0: z + 1.2, z1: z + 3 * STOREY - 1.2, arch: false })
  // the top storeys: tall arched windows under the crown
  const lastRow = rows[rows.length - 1]
  if (crown && last - lastRow.z1 > 3) rows.push({ z0: lastRow.z1 + 1.8, z1: last - 0.6, arch: true })
  else if (crown) lastRow.arch = true
  return rows
}
/** Panels along the wall a→b (outward to the right), on every bay not buried in a taller block. */
function facade(a: [number, number], b: [number, number], bottom: number, top: number, crown: boolean) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
  const n = Math.max(1, Math.round((L - 1.6) / 6.8)), w = (L - 1.6) / n
  const P = (s: number, z: number): V3 => [a[0] + ux * s + nx * 0.05, a[1] + uy * s + ny * 0.05, z]
  for (let k = 0; k < n; k++) {
    const s0 = 0.8 + w * k + 1.1, s1 = 0.8 + w * (k + 1) - 1.1, sm = (s0 + s1) / 2
    for (const r of rowsFor(top, crown)) {
      if (r.z1 > top - 0.5 || r.z0 < bottom) continue
      if (buried(a[0] + ux * sm + nx * 0.4, a[1] + uy * sm + ny * 0.4, r.z1)) continue
      if (!r.arch) { windows.quad(P(s0, r.z0), P(s1, r.z0), P(s1, r.z1), P(s0, r.z1)); continue }
      // a round-headed gothic opening: rectangle plus a semicircle, flush
      const rad = (s1 - s0) / 2, spring = r.z1 - rad
      windows.quad(P(s0, r.z0), P(s1, r.z0), P(s1, spring), P(s0, spring))
      for (let i = 0; i < 8; i++) {
        const t0 = (Math.PI * i) / 8, t1 = (Math.PI * (i + 1)) / 8
        windows.tri(P(sm, spring), P(sm + rad * Math.cos(t0), spring + rad * Math.sin(t0)), P(sm + rad * Math.cos(t1), spring + rad * Math.sin(t1)))
      }
    }
  }
  // the main piers between bays, slightly proud, from the base to the crown
  if (bottom > 0) for (let k = 1; k < n; k++) {
    const sm = 0.8 + w * k
    if (buried(a[0] + ux * sm + nx * 0.4, a[1] + uy * sm + ny * 0.4, bottom + 1)) continue
    const Q = (s: number, o: number, z: number): V3 => [a[0] + ux * s + nx * o, a[1] + uy * s + ny * o, z]
    const z0 = bottom + 0.2, z1 = top - 1.2, h = 0.45
    terracotta.quad(Q(sm - h, 0.25, z0), Q(sm + h, 0.25, z0), Q(sm + h, 0.25, z1), Q(sm - h, 0.25, z1))
    terracotta.quad(Q(sm - h, 0, z0), Q(sm - h, 0.25, z0), Q(sm - h, 0.25, z1), Q(sm - h, 0, z1))
    terracotta.quad(Q(sm + h, 0.25, z0), Q(sm + h, 0, z0), Q(sm + h, 0, z1), Q(sm + h, 0.25, z1))
  }
}

for (const b of BOXES) {
  const z0 = b.z === BASE ? 0 : BASE - 0.2
  block(terracotta, b.x0, b.x1, b.y0, b.y1, z0, b.z, 0.4, roof)
  const corners: [number, number][] = [[b.x0, b.y0], [b.x1, b.y0], [b.x1, b.y1], [b.x0, b.y1]]
  for (let i = 0; i < 4; i++) facade(corners[i], corners[(i + 1) % 4], z0, b.z, !!b.crown)
  if (!b.crown) continue
  // Crown: a pale cornice band and pinnacles
  // at the corners and every few bays along each face.
  block(trim, b.x0 - 0.3, b.x1 + 0.3, b.y0 - 0.3, b.y1 + 0.3, b.z - 1.2, b.z - 0.4, 0.5, null)
  const pin = (x: number, y: number, s: number) => {
    block(trim, x - s, x + s, y - s, y + s, b.z - 0.4, b.z + b.crown!, 0.2, trim)
  }
  for (let i = 0; i < 4; i++) {
    const [ax, ay] = corners[i], [bx, by] = corners[(i + 1) % 4]
    const L = Math.hypot(bx - ax, by - ay), n = Math.max(1, Math.round(L / 10))
    for (let k = 0; k < n; k++) {
      const t = k / n, x0 = ax + (bx - ax) * t, y0 = ay + (by - ay) * t
      const x = x0 + Math.sign((b.x0 + b.x1) / 2 - x0) * 0.55, y = y0 + Math.sign((b.y0 + b.y1) / 2 - y0) * 0.55
      if (buried(x, y, b.z + 1)) continue // only where the parapet is open to the sky
      pin(x, y, k === 0 ? 0.65 : 0.45)
    }
  }
}
// Finial on the tower roof (the flagstaff above it is left out).
{
  const x = 12, y = -3.5
  block(trim, x - 1.2, x + 1.2, y - 1.2, y + 1.2, 127, 132, 0.3, trim)
  const tip: V3 = [x, y, 135.5]
  const sq: V3[] = [[x - 0.9, y - 0.9, 132], [x + 0.9, y - 0.9, 132], [x + 0.9, y + 0.9, 132], [x - 0.9, y + 0.9, 132]]
  for (let i = 0; i < 4; i++) trim.tri(sq[i], sq[(i + 1) % 4], tip)
}

const parts = [
  { part: terracotta, material: finish('buff-terracotta', 0xe4d2b0) },
  { part: trim, material: PALETTE.trim },
  { part: windows, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Russ Building', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 135.5,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/129142347', 'way/941918062', 'way/941918063', ...[668, 669, 670, 671, 672, 673, 674, 675, 676, 677, 678].map((n) => `way/1091964${n}`)],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-russ-building.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
