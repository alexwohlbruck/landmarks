/**
 * San Antonio Marriott Rivercenter: procedural, CC0-1.0.
 * bun generators/sat-marriott-rivercenter.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is OSM's
 * outline centroid (way/99940093: -98.4840863, 29.4233278), where the lidar
 * grid was centred. y = 0 is the lowest ground under the footprint: the
 * River Walk lagoon's edge on the north-west, 7 m below the streets on the
 * south and east (2017 lidar ground).
 *
 * RTKL Associates, 1988: a 38-storey hotel of pale rose granite meant to
 * recall the twin bell towers of Mission Concepción. A slab running north
 * and south rises to two towers at its ends, each stepping down to the west
 * in three setbacks and crowned by a white steel pyramid frame with a mast;
 * the middle of the slab is lower, with the red "Marriott" sign under its
 * top and a strip of blue glass down its face. It stands on a podium joined
 * to the Rivercenter mall.
 *
 * Published: 546 ft (166.4 m) to the tip, roof 441 ft (134 m), 38
 * storeys (Wikipedia, "San Antonio Marriott Rivercenter").
 *
 * Measured (lidar USGS_LPC_TX_Central_B2_2017_LAS_2019, flown 2017;
 * heights above y = 0):
 * - the podium 22.7 m, 28.7 m over its northern half;
 * - the middle slab 115.7 m; the towers' roofs 121.7 m with an upper
 *   block to 126.7 m (corner turrets to about 133; drawn to 129.5 so
 *   they don't hide the frames); the towers' west
 *   setbacks at 62.7, 83 and 101 m;
 * - the pyramid frames centred at (30.0, 15.2) and (20.2, -27.3), their
 *   apexes about 135 m, the masts' returns to 145.6 m.
 * The tip: the lidar loses the thin masts at 145.6 m and a face-on photo
 * (Billy Hathorn's) scales each mast at about 13 m above its pyramid, so
 * the tip is drawn at 148.5 m. The published 166.4 m could not be matched
 * by either, and is not used; flagged for review.
 * From photos: the granite colour, the window rhythm, the steps, the
 * frames, the sign and the blue glass strip.
 * Estimated: the plan of each tier (rectangles fitted to the lidar), the
 * frames' size (17 m square, most of the top as in the photo), member
 * sizes (drawn 0.9 m, thicker than real so they read), the sign's size and face
 * (west), the glass strip.
 * Left out: the turrets' detail, railings, the round glass bays.
 *
 * OSM: way/99940093 (outline, no parts) is all the model draws over, so
 * only it is replaced. The Rivercenter mall (way/99942673), Macy's
 * (way/79122995) and the Marriott Riverwalk across Commerce Street are
 * separate buildings, left to the map; the model stays inside the outline.
 *
 * Night: windows `window`; the sign `neon` in its red; the frames are not lit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Marriott Rivercenter.jpg", Raevaz, public domain
 * - "Marriottrivercentersantx.JPG", Sahmeditor, public domain
 * - "LookupatMarriottRivercenter.jpg", Stinkie Pinkie, CC BY 2.0
 * - "Marriott Hotel, San Antonio, TX IMG 7595 1 1.jpg", Billy Hathorn, CC BY 3.0 (the crown)
 * - "San Antonio, Texas (2018) - 061.jpg", Another Believer, CC BY-SA 4.0
 * No look-only sources used.
 *
 * Doubts: the tip height (see above); the east face, seen only from afar.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ring, walls, capPoly, bayPanels, box, type XY } from './sat-frost-tower'

const granite = new Part()
const win = new Part()
const roofP = new Part()
const frame = new Part()
const sign = new Part()
const blue = new Part()

const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => ring([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
const FL = 3.3
/** A tier: granite walls, a roof, window panels two storeys a panel. */
function tier(P: XY[], z0: number, z1: number, wins = true) {
  walls(granite, P, z0 === 0 ? 0 : z0, z1)
  capPoly(roofP, P, z1, true)
  if (!wins) return
  const bands: [number, number][] = []
  for (let z = Math.max(z0, 24) + 1.2; z + 2 * FL - 1.6 <= z1 - 1.0; z += 2 * FL) bands.push([z, z + 2 * FL - 1.6])
  bayPanels(win, P, bands, 1.4, 1.6, 3)
}
/** Clip a CCW ring to y >= c (Sutherland-Hodgman). */
function clipY(P: XY[], c: number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length], ina = a[1] >= c, inb = b[1] >= c
    if (ina) out.push(a)
    if (ina !== inb) {
      const t = (c - a[1]) / (b[1] - a[1])
      out.push([a[0] + t * (b[0] - a[0]), c])
    }
  }
  return ring(out)
}

// ----------------------------------------------------------------- podium ---
// OSM way/99940093, moved into this frame (minus the centroid 2.3, 8.6).
const OUT = ring(([
  [-24.4, 47.6], [-30.2, 22.2], [-41.0, 24.6], [-44.0, 11.6], [-39.1, 10.5], [-44.7, -14.1], [-34.2, -16.5], [-32.7, -10.2],
  [-29.1, -11.0], [-29.8, -14.2], [-20.6, -16.2], [-21.1, -18.3], [12.5, -25.9], [33.8, -30.7], [46.4, 24.8], [47.9, 31.3],
] as XY[]).map(([x, y]): XY => [x - 2.3, y - 8.6]))
tier(OUT, 0, 22.7, false)
bayPanels(win, OUT, [[9.0, 12.4], [14.6, 18.0]], 2.4, 2.0, 4)
const NORTH = clipY(OUT, 10)
walls(granite, NORTH, 22.7, 28.7)
capPoly(roofP, NORTH, 28.7, true)

// ---------------------------------------------------------- the tower ---
// the middle slab
tier(rect(16, 34, -16, 8), 22.7, 115.7)
// the two towers and their west setbacks
for (const t of [
  { x0: 18, x1: 40, y0: 8, y1: 26, steps: [[2, 8, 62.7], [8, 14, 83], [14, 18, 101]], sx: 30.0, sy: 15.2 },
  { x0: 12, x1: 32, y0: -36, y1: -16, steps: [[0, 4, 62.7], [4, 8, 83], [8, 12, 101]], sx: 20.2, sy: -27.3 },
]) {
  const yA = t.y0 + (t.y1 > 0 ? 2 : 2), yB = t.y1 - 2
  for (const [x0, x1, z] of t.steps) tier(rect(x0, x1 + 0.01, yA, yB), 22.7, z)
  tier(rect(t.x0, t.x1, t.y0, t.y1), 22.7, 121.7)
  // the upper block and its corner turrets
  const U = rect(t.x0 + 2, t.x1 - 2, t.y0 + 2, t.y1 - 2)
  walls(granite, U, 121.7, 126.7)
  capPoly(roofP, U, 126.7, true)
  for (const [x, y] of U) box(granite, x, y, 1.3, 1.3, 121.7, 129.5)
  // the white pyramid frame: four corner legs to the apex, a base ring, the mast
  const B = 8.5, APEX = 136.0, Z0 = 126.7, T = 0.45
  const corners: XY[] = [[t.sx - B, t.sy - B], [t.sx + B, t.sy - B], [t.sx + B, t.sy + B], [t.sx - B, t.sy + B]]
  for (let i = 0; i < 4; i++) {
    const a = corners[i], b = corners[(i + 1) % 4]
    beam([a[0], a[1], Z0], [t.sx, t.sy, APEX], T)
    beam([a[0], a[1], Z0 + 1.4], [b[0], b[1], Z0 + 1.4], T)
  }
  box(frame, t.sx, t.sy, 0.4, 0.4, APEX - 0.5, 148.5)
}
/** A square beam of half-width w between two points. */
function beam(a: V3, b: V3, w: number) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d)
  const t: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const up: V3 = Math.abs(t[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const u0: V3 = [t[1] * up[2] - t[2] * up[1], t[2] * up[0] - t[0] * up[2], t[0] * up[1] - t[1] * up[0]]
  const ul = Math.hypot(...u0), u: V3 = [u0[0] / ul, u0[1] / ul, u0[2] / ul]
  const v: V3 = [t[1] * u[2] - t[2] * u[1], t[2] * u[0] - t[0] * u[2], t[0] * u[1] - t[1] * u[0]]
  const c = (p: V3, s: number, r: number): V3 => [p[0] + (u[0] * s + v[0] * r) * w, p[1] + (u[1] * s + v[1] * r) * w, p[2] + (u[2] * s + v[2] * r) * w]
  const A = [c(a, -1, -1), c(a, 1, -1), c(a, 1, 1), c(a, -1, 1)], Bq = [c(b, -1, -1), c(b, 1, -1), c(b, 1, 1), c(b, -1, 1)]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    // both windings, so a thin beam never shows a hole
    frame.quad(A[i], A[j], Bq[j], Bq[i])
    frame.quad(A[i], Bq[i], Bq[j], A[j])
  }
}
// The blue glass strip down the middle of the west face, and the sign.
{
  const x = 15.9
  const q = (p: Part, y0: number, y1: number, z0: number, z1: number) => p.quad([x, y1, z0], [x, y0, z0], [x, y0, z1], [x, y1, z1])
  q(blue, -6.5, -1.5, 30, 104)
  q(sign, -9.5, 1.5, 107.5, 111.5) // drawn at x 15.9, just proud of the panels
}

// Colours from daylight photos, pulled to the palette's lightness.
const parts = [
  { part: granite, material: finish('marriott-granite', 0xe0cdc2) },
  { part: win, material: PALETTE.window },
  { part: blue, material: { name: 'window-2', color: 0x7f9fbd, roughness: 0.3 } },
  { part: roofP, material: PALETTE.roof },
  { part: frame, material: PALETTE.trim },
  { part: sign, material: finish('neon-marriott-red', 0xc0403c) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('San Antonio Marriott Rivercenter', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 148.5, anchor: [29.4233278, -98.4840863], replaces: ['way/99940093'],
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/sat-marriott-rivercenter.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
