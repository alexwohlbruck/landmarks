/**
 * 345 California Center, San Francisco — original procedural geometry, CC0-1.0.
 * bun generators/sf-345-california.ts
 *
 * Frame: built turned to the block, BEARING 351 (the outline runs 9°
 * anticlockwise of north). x along the long (California Street) side, y across,
 * z up, metres. Origin = centroid of the OSM outline way/588355355 (the
 * four-storey podium, 84.6 x 41.4 m).
 *
 * Evidence
 * - OSM way/588355355 (48 levels, height 212) and parts 616812351-362: the
 *   podium, two 47-48 level towers drawn as squares turned 45°, the 36-38 level
 *   office block between them and two antennas. The parts sit ~2 m off the
 *   lidar; the lidar wins.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.5 m in the turned frame
 *   (/tmp/city/sf/work/fd/code.py): y = 0 is the lowest ground (California St);
 *   ground varies 1.1 m under the outline. Podium roof 19.5 m. The two hotel
 *   towers are squares turned 45°, half-diagonal 14.75 m, centred 20.5 m either
 *   side of the middle; their outer halves end at 185 m, inner halves at 189 m.
 *   The office block between them: 38 x 31.6 m to 141 m, a step to 148 m
 *   (34 x 24 m), a top block to 154 m (14 x 15.5 m). The glass link between the
 *   towers' inner corners reaches 187 m; the two spires on its ends read 198 m
 *   (lower shaft) and 210-219 m (upper shaft and mast).
 * - Published (Wikipedia, CTBUH): 212 m to the spires, 48 floors, SOM 1986;
 *   offices below, the hotel (Loews Regency, formerly Mandarin Oriental) in the
 *   twin tops, joined by glass skybridges.
 * - Commons daylight photos: "345 California Street.JPG" and "345 California
 *   Street from Coit Tower.jpg" (Daniel Schwen, CC BY-SA 2.5, from the north),
 *   "345 California Center 01.JPG" (sailko, CC BY-SA 3.0, from the north),
 *   "345CaliforniaCenterWithItsTweezerTop.jpg" (Goodshoped35110s, public
 *   domain), "345 California Center.jpg" (DestinationFearFan, CC BY-SA 4.0,
 *   from below), "345 California Center from ground.jpg" (Dead.rabbit, CC BY-SA
 *   4.0).
 *
 * Estimated: the spire sections (4 m and 2.4 m square; the thin mast left
 * out), the glass link's depth (3.2 m), storey heights, window grouping
 * (two-storey panels per ~4.6 m bay (pairs of windows) on the pale towers and the
 * dark office block), the podium's window band.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const BEARING = 351
const ANCHOR = { lng: -122.4004564, lat: 37.7925879 }
const pale = new Part(), dark = new Part(), windows = new Part(), roof = new Part(), glass = new Part()

const PODIUM = 19.5
const TW = { c: 20.5, mid: 0.5, r: 14.75, outer: 185, inner: 189 } // twin towers
const OFFICE = [
  { x0: -17.5, x1: 20.5, y0: -15.2, y1: 16.4, z: 141 },
  { x0: -15, x1: 19, y0: -11.5, y1: 12.5, z: 148 },
  { x0: -5.5, x1: 8.5, y0: -7, y1: 8.5, z: 154 },
]

// --- Helpers ---
const area = (p: XY[]) => p.reduce((a, q, i) => { const r = p[(i + 1) % p.length]; return a + q[0] * r[1] - r[0] * q[1] }, 0) / 2
/** A convex vertical prism with a flat top (and a bevelled top lip when bev > 0). */
function prism(part: Part, poly: XY[], z0: number, z1: number, top: Part = roof) {
  const p = area(poly) > 0 ? poly : [...poly].reverse()
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length]
    part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  for (let i = 1; i < p.length - 1; i++) top.tri([p[0][0], p[0][1], z1], [p[i][0], p[i][1], z1], [p[i + 1][0], p[i + 1][1], z1])
}
const rect = (x0: number, x1: number, y0: number, y1: number, ch = 0.5): XY[] =>
  [[x0 + ch, y0], [x1 - ch, y0], [x1, y0 + ch], [x1, y1 - ch], [x1 - ch, y1], [x0 + ch, y1], [x0, y1 - ch], [x0, y0 + ch]]
/** Inside a solid that rises to at least z: used to drop window panels nobody can see. */
function covered(x: number, y: number, z: number) {
  return OFFICE.some((o) => x > o.x0 + 0.2 && x < o.x1 - 0.2 && y > o.y0 + 0.2 && y < o.y1 - 0.2 && z < o.z)
}
/** Window panels on the wall a→b (outward = right of a→b): bays of `bay` metres, rows of `rows`. */
function panels(a: XY, b: XY, rows: [number, number][], bay: number, fill: number, margin = 0.8) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy * 0.05, ny = -ux * 0.05
  const n = Math.max(1, Math.round((L - 2 * margin) / bay)), w = (L - 2 * margin) / n
  for (let k = 0; k < n; k++) {
    const s0 = margin + w * k + (w * (1 - fill)) / 2, s1 = s0 + w * fill
    const P = (s: number, z: number): V3 => [a[0] + ux * s + nx, a[1] + uy * s + ny, z]
    for (const [z0, z1] of rows) {
      const m = P((s0 + s1) / 2, (z0 + z1) / 2)
      if (covered(m[0] - nx * 4, m[1] - ny * 4, z1)) continue
      windows.quad(P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1))
    }
  }
}
const rowsFrom = (z0: number, z1: number, h: number, gap: number): [number, number][] => {
  const out: [number, number][] = []
  for (let z = z0; z + h <= z1 + 0.01; z += h) out.push([z + gap / 2, z + h - gap / 2])
  return out
}

// --- Podium: four storeys over the whole outline. ---
{
  const P = rect(-42.3, 42.3, -20.7, 20.7, 0.6)
  prism(pale, P, 0, PODIUM)
  for (let i = 0; i < P.length; i += 2) panels(P[i], P[i + 1], [[4.5, 8], [10, 17.5]], 5, 0.8)
}

// --- Twin hotel towers: squares turned 45°, the inner half a storey higher. ---
for (const sx of [-1, 1]) {
  const cx = TW.mid + sx * TW.c, r = TW.r
  const outerTip: XY = [cx + sx * r, 0], innerTip: XY = [cx - sx * r, 0], n: XY = [cx, r], s: XY = [cx, -r]
  // two halves split along the diagonal through n and s
  prism(pale, [outerTip, n, s].map(([x, y]) => [x, y] as XY), 0, TW.outer)
  prism(pale, [innerTip, n, s].map(([x, y]) => [x, y] as XY), 0, TW.inner)
  // windows: two-storey panels per bay on the four faces
  const faces: [XY, XY, number][] = sx > 0
    ? [[s, outerTip, TW.outer], [outerTip, n, TW.outer], [n, innerTip, TW.inner], [innerTip, s, TW.inner]]
    : [[n, outerTip, TW.outer], [outerTip, s, TW.outer], [s, innerTip, TW.inner], [innerTip, n, TW.inner]]
  const rows = (top: number) => rowsFrom(PODIUM + 1, top - 3, 3.75 * 2, 1.4)
  for (const [a, b, top] of faces) {
    if (top === TW.outer) { panels(a, b, rows(top), 4.6, 0.72, 1.2); continue }
    // The faces towards the gap: the 9 m next to the glass link is a blank
    // shaft in the photos (it carries on up as the spire), so windows stop short.
    const toTip = b === innerTip, L = Math.hypot(b[0] - a[0], b[1] - a[1]), f = 9 / L
    const m: XY = toTip ? [a[0] + (b[0] - a[0]) * (1 - f), a[1] + (b[1] - a[1]) * (1 - f)] : [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]
    if (toTip) panels(a, m, rows(top), 4.6, 0.72, 1.2)
    else panels(m, b, rows(top), 4.6, 0.72, 1.2)
  }
}

// --- Office block between the towers: dark granite, stepped top. ---
for (const [i, o] of OFFICE.entries()) {
  const P = rect(o.x0, o.x1, o.y0, o.y1, 0.4)
  prism(dark, P, i === 0 ? 0 : OFFICE[i - 1].z - 0.2, o.z)
  const lo = i === 0 ? PODIUM + 1 : OFFICE[i - 1].z + 0.6
  // north and south faces only: east and west run into the towers
  for (const k of [0, 4]) panels(P[k], P[k + 1], rowsFrom(lo, o.z - 2, 7.5, 1.8), 4.6, 0.72, 1)
}

// --- Glass link between the towers' inner corners, and the two spires on it. ---
prism(glass, rect(TW.mid - (TW.c - TW.r) - 1, TW.mid + (TW.c - TW.r) + 1, -1.6, 1.6, 0), 0, 187, roof)
for (const x of [-3.75, 4]) {
  prism(pale, rect(x - 2, x + 2, -0.8, 3.2, 0.3), 186, 199, pale)
  prism(pale, rect(x - 1.2, x + 1.2, 0, 2.4, 0.2), 198.8, 214, pale)
}

const parts = [
  { part: pale, material: finish('pale-granite', 0xe9e5dc) },
  { part: dark, material: finish('grey-granite', 0x9a989b) },
  { part: windows, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('345 California Center', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 214,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/588355355', ...[351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362].map((n) => `way/616812${n}`)],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-345-california.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
