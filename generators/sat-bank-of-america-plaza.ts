/**
 * Bank of America Plaza, San Antonio: procedural, CC0-1.0.
 * bun generators/sat-bank-of-america-plaza.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is OSM's
 * outline centroid (way/104470540: -98.4901731, 29.4295373). y = 0 is the
 * street round the tower (2 m above the 2017 lidar's lowest return).
 *
 * Skidmore, Owings & Merrill (Houston), opened 1984 as InterFirst Plaza.
 * A slab of rose-tan granite with bands of bronze glass, in three blocks
 * stepping down to the west (28, 25 and 22 storeys). Its long north and
 * south faces are folded into a row of pointed bays, each ending in a small
 * gable at the foot of a steep glass mansard that slopes back to the flat
 * roof: the serrated, slanted top that marks it on the skyline. The end
 * faces are flat, with an arched window under the top of the east one.
 *
 * Published: roof 118 m (387 ft), 28 storeys (Wikipedia, "Bank of America
 * Plaza (San Antonio)").
 *
 * Measured (lidar USGS_LPC_TX_Central_B2_2017_LAS_2019, flown 2017;
 * heights above y = 0):
 * - the three blocks' flat roofs 115.6, 103.3 and 91.6 m (east to west),
 *   between y -12 and +12; the mansards fall about 13 m to the bays'
 *   eaves at the north and south faces (y -17.5 and +17.3);
 * - a penthouse on the east block to about 119 m.
 * OSM: the blocks' splits at x -17.4 and -5.0 (parts way/639207311,
 * /639207312, /639207315, 22, 25 and 28 levels).
 * From photos (ZeChief's view from above, gillfoto from the north-east):
 * the bays (about 4.4 m wide, standing 1.2 m out), the window bands, the
 * granite and glass colours, the glass mansard, the arched window.
 * Estimated: bay depth and count, gable height (2.2 m), storey height
 * (4.1 m; the windows grouped three storeys a band, after review), the arched window's size.
 * Left out: the 2016 "Kinetic Skyline" artwork, mullions, the plaza.
 *
 * OSM: way/104470540 (outline) and its three parts; all replaced.
 *
 * Night: the office windows are `window`; the mansards are `glass`, dark.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Bank of America Plaza, San Antonio, cropped.JPG", ZeChief, CC BY-SA 3.0
 * - "San Antonio Texas 7106.jpg", gillfoto, CC BY-SA 4.0
 * - "San Antonio Skyline 2026.jpg", Medialecent, CC BY 4.0 (from the north)
 * No look-only sources used.
 *
 * Doubts: the bays' exact count per block; the west end face.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ring, walls, capPoly, bayPanels, box, type XY } from './sat-frost-tower'

const granite = new Part()
const win = new Part()
const glass = new Part()
const roofP = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function tf(p: Part, a: V3, b: V3, c: V3, n: V3) {
  if (dot(cross(sub(b, a), sub(c, a)), n) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
const qf = (p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) => { tf(p, a, b, c, n); tf(p, a, c, d, n) }

const YS = -17.5, YN = 17.3, DEPTH = 1.2, RIDGE = 12.0, GABLE = 2.2, FALL = 13.0
const BLOCKS = [
  { x0: -30.7, x1: -17.4, top: 91.6 },
  { x0: -17.4, x1: -5.0, top: 103.3 },
  { x0: -5.0, x1: 30.0, top: 115.6 },
]
const FL = 4.1
for (const b of BLOCKS) {
  const eave = b.top - FALL
  // the folded long faces: valleys on the inner line, points on the outer
  const n = Math.max(2, Math.round((b.x1 - b.x0) / 4.4)), w = (b.x1 - b.x0) / n
  const south: XY[] = [], north: XY[] = []
  const isApex: boolean[] = []
  for (let i = 0; i <= 2 * n; i++) {
    const x = b.x0 + (i * w) / 2, apex = i % 2 === 1
    south.push([x, apex ? YS : YS + DEPTH])
  }
  for (let i = 2 * n; i >= 0; i--) {
    const x = b.x0 + (i * w) / 2, apex = i % 2 === 1
    north.push([x, apex ? YN : YN - DEPTH])
  }
  const P = ring([...south, ...north])
  for (const p of P) isApex.push(Math.abs(p[1] - YS) < 0.01 || Math.abs(p[1] - YN) < 0.01)
  // walls: to the eave at the valleys and the block ends, a gable point at each apex
  walls(granite, P, 0, (i) => (isApex[i] ? eave + GABLE : eave))
  // window bands, two storeys a panel, on the folded faces and the ends
  const bands: [number, number][] = []
  for (let z = 5.0; z + 3 * FL - 3.4 <= eave - 0.6; z += 3 * FL) bands.push([z, z + 3 * FL - 3.4])
  bayPanels(win, P, bands, 3.0, 0.5, 2.0)
  // the glass mansards: from the valley line at the eave up to the ridge
  for (const side of [-1, 1]) {
    const yv = side < 0 ? YS + DEPTH : YN - DEPTH, yr = side * RIDGE
    const nrm: V3 = [0, side * FALL, Math.abs(yv - yr)]
    qf(glass, [b.x0, yv, eave], [b.x1, yv, eave], [b.x1, yr, b.top], [b.x0, yr, b.top], nrm)
    // the gables close against the mansard: each apex's two roof faces
    for (let i = 0; i < n; i++) {
      const xa = b.x0 + i * w, xm = xa + w / 2, xb = xa + w
      const ya = side < 0 ? YS : YN
      // the triangle from the apex top back to the mansard
      const t: V3 = [xm, ya, eave + GABLE]
      const zIn = eave
      const back: V3 = [xm, yv + (yr - yv) * (GABLE / FALL), eave + GABLE]
      tf(granite, [xa, yv, zIn], t, back, [-1, side * 0.3, 1])
      tf(granite, t, [xb, yv, zIn], back, [1, side * 0.3, 1])
    }
  }
  // the end walls above the eave, up to the mansard's section
  for (const [x, sx] of [[b.x0, -1], [b.x1, 1]] as const) {
    const nn: V3 = [sx, 0, 0]
    qf(granite, [x, YS + DEPTH, eave], [x, -RIDGE, b.top], [x, RIDGE, b.top], [x, YN - DEPTH, eave], nn)
  }
  // the flat roof between the ridges
  capPoly(roofP, ring([[b.x0, -RIDGE], [b.x1, -RIDGE], [b.x1, RIDGE], [b.x0, RIDGE]]), b.top, true)
}
// The arched window under the top of the east face.
{
  const x = 30.05, z0 = 99.5, z1 = 107.5, hw = 2.2
  qf(win, [x, -hw, z0], [x, hw, z0], [x, hw, z1], [x, -hw, z1], [1, 0, 0])
  const S = 10
  for (let j = 0; j < S; j++) {
    const a0 = (Math.PI * j) / S, a1 = (Math.PI * (j + 1)) / S
    tf(win, [x, 0, z1], [x, hw * Math.cos(a0), z1 + hw * Math.sin(a0)], [x, hw * Math.cos(a1), z1 + hw * Math.sin(a1)], [1, 0, 0])
  }
}
// The penthouse on the east block.
box(roofP, 9.0, 0, 4.5, 4.5, 115.6, 119.0)

// Colours from daylight photos, pulled to the palette's lightness: the
// rose-brown granite, bronze-tinted glass in broad bands (three storeys
// a panel, with a granite spandrel band between, running the width of each bay, as the ribbon windows read from
// afar), the mansard's bronze reflective glass.
const parts = [
  { part: granite, material: finish('boa-sa-granite', 0xc2a291) },
  { part: win, material: { name: 'window', color: 0x6a6f78, roughness: 0.35 } },
  { part: glass, material: { name: 'glass', color: 0x8e8682, roughness: 0.24 } },
  { part: roofP, material: PALETTE.roof },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Bank of America Plaza', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 119.0, anchor: [29.4295373, -98.4901731],
  replaces: ['way/104470540', 'way/639207311', 'way/639207312', 'way/639207315'],
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/sat-bank-of-america-plaza.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
