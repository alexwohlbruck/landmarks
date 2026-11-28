/**
 * The Quadrangle, Fort Sam Houston, San Antonio: procedural, CC0-1.0.
 * bun generators/sat-fort-sam-quadrangle.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * lidar grid's centre near the middle of the courtyard (-98.4623556,
 * 29.4444277); the clock tower stands at (0.5, 9). y = 0 is the ground,
 * flat within 0.6 m across the whole quadrangle (2017 lidar ground).
 *
 * Built 1876-79 by George Henry Griebel for the Quartermaster Corps, the
 * oldest structure on the post: long ranges of rough-cut limestone round a
 * courtyard of about 180 by 175 m, under gabled roofs, and in the middle
 * Montgomery Meigs's watchtower: a tall square limestone shaft that held a
 * water tank, with a watchman's balcony at 60 ft, an arcaded stage over it,
 * a clock stage (the clock replaced the tank in 1882) and a corniced top.
 *
 * Published (the post's own sign at the tower, photographed by Articseahorse):
 * 90 ft (27.4 m) tall, 16 ft (4.9 m) square at the base, the watchman's
 * station at 60 ft (18.3 m); Wikipedia, "Fort Sam Houston": 87 ft.
 * Measured (lidar USGS_LPC_TX_Central_B2_2017_LAS_2019, flown 2017;
 * heights above y = 0):
 * - the tower's cornice 28.7 m (about 6 m across), a small lantern on it
 *   to 30.7 m; the balcony about 20 m (7 m across);
 * - the south range: eaves 8.7 m, ridge 11.6 m (10 m deep); the west and
 *   east ranges: eaves 5.5 m, ridge 7.4 m (11-12 m deep); the north
 *   buildings about 5-6 m.
 * From photos: the limestone, the tower's stages, the balcony, the paired
 * arched openings, the clock faces, the cornice.
 * Estimated: the stage heights between the lidar's levels (balcony at
 * 18.3-19.7 m from the sign, arcade to 23.3 m, clock stage to 27.6 m),
 * the shaft's taper (4.9 to 4.5 m), the ranges' windows, the roofs' colour
 * (not seen in any photo; the palette's roof grey).
 * Left out: the courtyard's trees, the flagpoles, the cannon, the peafowl.
 *
 * OSM: the quadrangle's U of ranges is way/130623065 (one building); the
 * north side's two buildings are way/130623048 and way/130623053. The model
 * draws all three as the one quadrangle with its tower, so all three are
 * replaced. OSM does not map the tower.
 *
 * Night: the tower is floodlit, the clock faces with it (pale trim); the
 * ranges' and arcade's openings are `window`.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Fort Sam Houston Quadrangle Clock Tower (26097884708).jpg" and
 *   "(26097885368).jpg", Nan Palmero, CC BY 2.0
 * - "Quadrangle, Fort Sam Houston 03.jpg" and "05.jpg", Articseahorse, CC BY-SA 4.0 (the sign, the stone)
 * - "Fort Sam Houston Quadrangle, San Antonio, Texas, US.jpg", Clyde Charles Brown, CC BY-SA 4.0
 *
 * Doubts: whether the north buildings belong to the quadrangle (they close
 * its north side in OSM and the lidar); the ranges' facades on the
 * courtyard side.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ring, walls, capPoly, box, bayPanels, type XY } from './sat-frost-tower'

const stone = new Part()
const roofP = new Part()
const win = new Part()
const trim = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function tf(p: Part, a: V3, b: V3, c: V3, n: V3) {
  if (dot(cross(sub(b, a), sub(c, a)), n) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
const qf = (p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) => { tf(p, a, b, c, n); tf(p, a, c, d, n) }
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => ring([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])

/** A gabled range: walls to the eaves, the ridge along its length, gable ends. */
function range(x0: number, x1: number, y0: number, y1: number, eave: number, ridge: number) {
  const P = rect(x0, x1, y0, y1)
  walls(stone, P, 0, eave)
  bayPanels(win, P, [[1.4, eave - 1.6]], 1.2, 3.0, 3)
  const alongX = x1 - x0 > y1 - y0, o = 0.4
  if (alongX) {
    const ym = (y0 + y1) / 2
    for (const [x, s] of [[x0, -1], [x1, 1]] as const) tf(stone, [x, y0, eave], [x, y1, eave], [x, ym, ridge], [s, 0, 0])
    for (const s of [-1, 1]) qf(roofP, [x0 - o, s < 0 ? y0 - o : y1 + o, eave - 0.2], [x1 + o, s < 0 ? y0 - o : y1 + o, eave - 0.2], [x1 + o, ym, ridge], [x0 - o, ym, ridge], [0, s, 1])
  } else {
    const xm = (x0 + x1) / 2
    for (const [y, s] of [[y0, -1], [y1, 1]] as const) tf(stone, [x0, y, eave], [x1, y, eave], [xm, y, ridge], [0, s, 0])
    for (const s of [-1, 1]) qf(roofP, [s < 0 ? x0 - o : x1 + o, y0 - o, eave - 0.2], [s < 0 ? x0 - o : x1 + o, y1 + o, eave - 0.2], [xm, y1 + o, ridge], [xm, y0 - o, ridge], [s, 0, 1])
  }
}

// OSM in this frame (OSM's local coordinates shifted by (-14, +8))
range(-95.1, 95.7, -86.5, -76.0, 8.7, 11.6)     // south range
range(-95.8, -84.4, -76.0, 85.5, 5.5, 7.4)       // west range
range(84.3, 95.7, -76.0, 86.1, 5.5, 7.4)       // east range
range(-95.9, -19.7, 93.6, 102.6, 4.6, 6.4)       // north building, west (way/130623053)
range(4.5, 95.0, 94.4, 103.1, 4.6, 6.4)          // north building, east (way/130623048)

// ------------------------------------------------------- the clock tower ---
{
  const cx = 0.5, cy = 9
  // the shaft, tapering a little
  const S0 = rect(cx - 2.45, cx + 2.45, cy - 2.45, cy + 2.45), S1 = rect(cx - 2.25, cx + 2.25, cy - 2.25, cy + 2.25)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, n: V3 = [(S0[i][0] + S0[j][0]) / 2 - cx, (S0[i][1] + S0[j][1]) / 2 - cy, 0.02]
    qf(stone, [S0[i][0], S0[i][1], 0], [S0[j][0], S0[j][1], 0], [S1[j][0], S1[j][1], 18.3], [S1[i][0], S1[i][1], 18.3], n)
  }
  // the watchman's balcony: a projecting slab and a solid parapet
  box(trim, cx, cy, 3.5, 3.5, 18.3, 18.8)
  walls(stone, rect(cx - 3.5, cx + 3.5, cy - 3.5, cy + 3.5), 18.8, 19.7)
  // the arcaded stage: paired round arches on each face
  walls(stone, S1, 18.3, 23.3)
  for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as XY[]) {
    for (const u of [-0.8, 0.8]) {
      const tx = -ny, ty = nx, fx = cx + nx * 2.3 + tx * u, fy = cy + ny * 2.3 + ty * u, r = 0.5
      const P = (du: number, z: number): V3 => [fx + tx * du, fy + ty * du, z]
      qf(win, P(-r, 20.2), P(r, 20.2), P(r, 22.2), P(-r, 22.2), [nx, ny, 0])
      for (let k = 0; k < 6; k++) {
        const a0 = (Math.PI * k) / 6, a1 = (Math.PI * (k + 1)) / 6
        tf(win, P(0, 22.2), P(r * Math.cos(a0), 22.2 + r * Math.sin(a0)), P(r * Math.cos(a1), 22.2 + r * Math.sin(a1)), [nx, ny, 0])
      }
    }
  }
  // string course, the clock stage with a clock face each side, the cornice
  box(trim, cx, cy, 2.5, 2.5, 23.3, 23.8)
  walls(stone, S1, 23.8, 27.6)
  for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as XY[]) {
    const tx = -ny, ty = nx, fx = cx + nx * 2.3, fy = cy + ny * 2.3, r = 1.25, zc = 25.7
    for (let k = 0; k < 12; k++) {
      const a0 = (2 * Math.PI * k) / 12, a1 = (2 * Math.PI * (k + 1)) / 12
      tf(trim, [fx, fy, zc], [fx + tx * r * Math.cos(a0), fy + ty * r * Math.cos(a0), zc + r * Math.sin(a0)], [fx + tx * r * Math.cos(a1), fy + ty * r * Math.cos(a1), zc + r * Math.sin(a1)], [nx, ny, 0])
    }
  }
  box(trim, cx, cy, 3.0, 3.0, 27.6, 28.7)
  capPoly(roofP, rect(cx - 2.9, cx + 2.9, cy - 2.9, cy + 2.9), 28.71, true)
  // the small lantern on top
  box(stone, cx, cy, 0.8, 0.8, 28.7, 30.0)
  box(trim, cx, cy, 1.0, 1.0, 30.0, 30.7)
}

// Colours from daylight photos, pulled to the palette's lightness.
const towerLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : Math.hypot(p[0] - 0.5, p[1] - 9) < 5 ? 0.9 : 0)
const parts = [
  { part: stone, material: { ...finish('quadrangle-limestone', 0xe3d6bb), floodlight: towerLit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: towerLit } },
  { part: roofP, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('The Quadrangle, Fort Sam Houston', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 30.7, anchor: [29.4444277, -98.4623556], replaces: ['way/130623065', 'way/130623048', 'way/130623053'],
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/sat-fort-sam-quadrangle.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
