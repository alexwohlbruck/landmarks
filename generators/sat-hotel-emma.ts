/**
 * Hotel Emma (the Pearl Brewery brewhouse), San Antonio: procedural, CC0-1.0.
 * bun generators/sat-hotel-emma.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * lidar grid's centre, OSM's outline centroid (way/80319865:
 * -98.4811729, 29.4426794). y = 0 is the lowest ground under the
 * footprint, the River Walk side on the west; the brewery's streets are
 * 4.3 m higher (2017 lidar ground).
 *
 * The 1894 brewhouse of the San Antonio Brewing Association (Pearl),
 * by August Maritzen: buff brick, Second Empire and Romanesque, its tall
 * tower capped by a mansard and a domed cupola; converted with its later
 * brick additions into Hotel Emma in 2015 (Roman and Williams), including
 * the plain brown brick block with the tall "EMMA" panel.
 *
 * Measured (lidar USGS_LPC_TX_Central_B2_2017_LAS_2019, flown 2017;
 * heights above y = 0):
 * - the brewhouse's main block 36.5 m (x -7..27, y -22..-7), its north
 *   front 31 m; the east wing 26.5 m; the main tower centred on the east
 *   front (x 45.5..53, y -18.25..-10.75; the front itself y -22..-7): shaft 34 m, a bell-shaped mansard
 *   dome to about 40.6 m, a lantern and cap to 45.3 m; two smaller domes on
 *   the main block's east corners to 41.6 and 42.3 m (revised after review,
 *   from the lidar's three peaks and Sarahstrunk's and Another Believer's
 *   photos: the domes are the crown);
 * - the brown brick annex 27.5 m (x -40..-2, y 8..30), its centre 30.5 m;
 * - the low wings between 12.5-17.5 m.
 * From photos: the buff and brown brick, the dark mansard and cupola,
 * the window rhythm, the dark "EMMA" panel (drawn plain, as the brief
 * asks: no lettering).
 * Estimated: the blocks' plans (rectangles fitted to the lidar, inside
 * OSM's outline), the domes' profiles, the stepped gables on the east
 * front (drawn either side of the tower, after the photos), window sizes.
 * Left out: the Pearl and EMMA lettering, ornament, fire stairs.
 *
 * OSM: way/80319865 (outline, no parts), replaced. The Culinary Institute
 * (way/80319767) and the tall block south of the outline (way/80319864)
 * are separate and left to the map.
 *
 * Night: windows `window`; the brewhouse's buff brick is floodlit (Bilestone's night photo).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Hotel-Emma-Exterior.jpg", Sarahstrunk, CC BY-SA 4.0
 * - "Hotel Emma at Pearl Fountain (2015-03-22 12.11.25 by Nan Palmero).jpg", CC BY 2.0
 * - "San Antonio, Texas (2018) - 065.jpg" and "- 071.jpg", Another Believer, CC BY-SA 4.0
 * - "Pearl Brewing Company, San Antonio, Texas, September 2017.jpg", Bilestone, CC BY-SA 4.0 (dusk)
 *
 * Doubts: the plans of the low wings; the tower's exact plan.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ring, walls, capPoly, box, bayPanels, type XY } from './sat-frost-tower'

const buff = new Part()
const brown = new Part()
const win = new Part()
const roofP = new Part()
const dark = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function tf(p: Part, a: V3, b: V3, c: V3, n: V3) {
  if (dot(cross(sub(b, a), sub(c, a)), n) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => ring([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
const STREET = 4.3, FL = 4.0
function block(p: Part, x0: number, x1: number, y0: number, y1: number, h: number, bay = 1.6, pier = 1.8) {
  const P = rect(x0, x1, y0, y1)
  walls(p, P, 0, h)
  capPoly(roofP, P, h, true)
  const bands: [number, number][] = []
  for (let z = STREET + 1.2; z + 2 * FL - 1.6 <= h - 1.2; z += 2 * FL) bands.push([z, z + 2 * FL - 1.6])
  bayPanels(win, P, bands, bay, pier, 4)
}
/** A mansard cap: a truncated pyramid from a rectangle at z0 to an inset at z1. */
function mansard(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, inset: number) {
  const A = rect(x0, x1, y0, y1), B = rect(x0 + inset, x1 - inset, y0 + inset, y1 - inset)
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, m: V3 = [(A[i][0] + A[j][0]) / 2 - cx, (A[i][1] + A[j][1]) / 2 - cy, 3]
    tf(p, [A[i][0], A[i][1], z0], [A[j][0], A[j][1], z0], [B[j][0], B[j][1], z1], m)
    tf(p, [A[i][0], A[i][1], z0], [B[j][0], B[j][1], z1], [B[i][0], B[i][1], z1], m)
  }
  capPoly(p, B, z1, true)
}

// the brown brick annex with the EMMA panel on its east end
block(brown, -40, -2, 8, 30, 27.5)
block(brown, -19, -4, 11, 22, 30.5)
{
  const x = -1.94, n: V3 = [1, 0, 0]
  tf(dark, [x, 12, STREET + 3], [x, 17, STREET + 3], [x, 17, 26.5], n)
  tf(dark, [x, 12, STREET + 3], [x, 17, 26.5], [x, 12, 26.5], n)
}
// the low wings
block(brown, -45, -5, -18, 7, 13.5)
block(buff, 2, 35, -3, 9, 12.5)
block(buff, 35, 53, -3, 3, 17.5)
// the brewhouse
block(buff, -7, 27, -22, -7, 36.5)
block(buff, 2, 27, -7, -2, 31.0)
mansard(dark, -7, 27, -22, -7, 36.5, 38.3, 1.6)
block(buff, 27, 53, -22, -7, 26.5)
block(buff, 27, 35, -7, -3, 17.5)
/** A dark dome on a square base: a bell-shaped (mansard) dome, a lantern and a cap. */
function domeTower(cx: number, cy: number, half: number, z0: number, prof: [number, number][], K = 16) {
  const ringAt = (r: number, z: number): V3[] => Array.from({ length: K }, (_, k) => {
    // a square-ish ring for the lower dome (it sits on a square tower), round above
    const a = (2 * Math.PI * (k + 0.5)) / K, sq = r > half * 0.9 ? 1 / Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a))) : 1
    return [cx + r * sq * Math.cos(a), cy + r * sq * Math.sin(a), z]
  })
  for (let s = 0; s < prof.length - 1; s++) {
    const A = ringAt(prof[s][0], prof[s][1]), B = ringAt(prof[s + 1][0], prof[s + 1][1])
    for (let k = 0; k < K; k++) {
      const k2 = (k + 1) % K, m: V3 = [A[k][0] - cx, A[k][1] - cy, 0.6]
      tf(dark, A[k], A[k2], B[k2], m)
      tf(dark, A[k], B[k2], B[k], m)
    }
  }
  void z0
}
// The main tower, centred on the east front (the lidar's 45.3 m peak): a
// buff shaft with pinnacles, a big dark bell-shaped mansard dome, a lantern
// and its cap.
{
  const x0 = 45.5, x1 = 53, y0 = -18.25, y1 = -10.75, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  block(buff, x0, x1, y0, y1, 34.0, 1.2, 1.4)
  domeTower(cx, cy, 3.75, 34.0, [[3.9, 34.0], [3.9, 35.2], [3.6, 37.2], [3.0, 38.8], [2.1, 40.0], [1.5, 40.6], [1.5, 42.6], [1.8, 42.9], [1.2, 43.8], [0.5, 44.8], [0.05, 45.3]])
  for (const [x, y] of rect(x0, x1, y0, y1)) box(buff, x, y, 0.55, 0.55, 33.0, 37.0)
}
// two smaller dark domes on the main block's east corners (lidar peaks of
// 42-43 m at (26.5, -8) and (25.5, -17.5))
for (const [cx, cy, top] of [[26.5, -8, 42.3], [25.5, -17.5, 41.6]] as [number, number, number][]) {
  box(buff, cx, cy, 2.4, 2.4, 30, 37.0)
  domeTower(cx, cy, 2.4, 37.0, [[2.5, 37.0], [2.4, 38.0], [2.0, 39.4], [1.2, 40.6], [0.8, 41.0], [0.8, 41.6], [0.05, top]])
}
// stepped, curved-shouldered gables on the east front either side of the tower
for (const [ya, yb] of [[-22, -18.25], [-10.75, -7]] as [number, number][]) {
  const x = 53.05, n: V3 = [1, 0, 0], h0 = 26.5
  const w = yb - ya, steps = [[0, 0.18, 1.2], [0.18, 0.36, 2.4], [0.36, 0.64, 3.4], [0.64, 0.82, 2.4], [0.82, 1, 1.2]]
  if (w < 3) continue
  for (const [f0, f1, dh] of steps) {
    const y0 = ya + w * f0, y1 = ya + w * f1
    tf(buff, [x, y0, h0], [x, y1, h0], [x, y1, h0 + dh], n)
    tf(buff, [x, y0, h0], [x, y1, h0 + dh], [x, y0, h0 + dh], n)
    tf(buff, [x - 0.6, y0, h0 + dh], [x, y1, h0 + dh], [x, y0, h0 + dh], [0, 0, 1])
    tf(buff, [x - 0.6, y0, h0 + dh], [x - 0.6, y1, h0 + dh], [x, y1, h0 + dh], [0, 0, 1])
  }
}

// Colours from daylight photos, pulled to the palette's lightness.
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : 0.6)
const parts = [
  { part: buff, material: { ...finish('pearl-buff-brick', 0xe5d3ae), floodlight: lit } },
  { part: brown, material: finish('emma-brown-brick', 0xbd9273) },
  { part: win, material: PALETTE.window },
  { part: roofP, material: PALETTE.roof },
  { part: dark, material: finish('pearl-mansard', 0x4f5459) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Hotel Emma', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 45.3, anchor: [29.4426794, -98.4811729], replaces: ['way/80319865'],
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/sat-hotel-emma.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
