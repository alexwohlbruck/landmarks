/**
 * Conservatory of Flowers, Golden Gate Park, San Francisco — original
 * procedural geometry, CC0-1.0.
 * bun generators/sf-conservatory-of-flowers.ts
 *
 * Map frame: x east, y north, z up, metres, built turned to bearing 354.5
 * (the wings run 5.5 degrees off east-west; the entrance faces south-south-
 * west). Origin = centroid of the OSM outline way/30675038.
 *
 * Evidence
 * - OSM way/30675038 (building=conservatory, height 15): the whole glasshouse,
 *   the back ranges included.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.5 m, in the turned
 *   frame: the lawn in front 75.2 m NAVD88 (y = 0); the central dome's top
 *   +18.5 at (0.4, -2), the upper dome r ~4.5-5; the pavilion under it about
 *   18 m across, ~+9 at its shoulders; the entrance porch x -2.6..3.4,
 *   y -19.5..-9, ridge +5.4; the wings y -8..+2, arched roofs cresting at
 *   +5.5; the end pavilions run north-south, x -35.5..-25.5 and 27..38,
 *   y -18..+2, cresting at +5.6 and rounded at their south ends; the back
 *   ranges behind (y 5-15) at +3.5 to +6.3.
 * - Published (Wikipedia; NRHP): 1879, wood and glass, the oldest municipal
 *   wooden conservatory in the US; white-painted; restored 2003.
 * - Commons daylight photos: "Front of Conservatory of Flowers, San
 *   Francisco.jpg" (Kefr4000, CC BY-SA 4.0, south front); "SF Conservatory
 *   of Flowers 3.jpg" (WolfmanSF, CC BY-SA 3.0, from the south-east); "San
 *   Francisco Conservatory of Flowers-5/-6/-7.jpg" (Almonroth, CC BY-SA 3.0,
 *   from the south-east, the dome and east pavilion); "Summer of Love 50th,
 *   Conservatory of Flowers San Francisco - 02.jpg" (Frank Schulenburg,
 *   CC BY-SA 4.0, the central pavilion face-on: wall, lower dome, clerestory,
 *   upper dome and finial in proportion).
 *
 * Estimated from the photos, scaled by the lidar: the central pavilion's
 * profile (walls to +5.4, the lower dome to +10.0, the clerestory to +12.7,
 * the upper dome to +18.5, the finial to ~+21.5); wall heights of the wings
 * and pavilions (~2.3 m to the eaves); the back ranges as plain low blocks.
 * The glazing bars, cresting and scrollwork are too fine to draw; the glass
 * is pale, as it reads in daylight, and the frames and cornices white.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { lathe, prism, report, flat, type XY } from './sf-de-young'

const ANCHOR = { lng: -122.46023301, lat: 37.77263055 }
const glass = new Part(), white = new Part(), roof = new Part(), door = new Part()

const C: XY = [0.4, -2.0] // central dome's axis

/** A long glasshouse with an arched roof, along x from x0 to x1, centred on y = yc. */
function hall(x0: number, x1: number, yc: number, half: number, eave: number, crest: number, endCaps: [boolean, boolean] = [true, true]) {
  const N = 8
  const prof: XY[] = Array.from({ length: N + 1 }, (_, i) => {
    const t = Math.PI - (Math.PI * i) / N
    return [half * Math.cos(t), eave + (crest - eave) * Math.sin(t)] as XY
  })
  // long walls
  glass.quad([x0, yc - half, 0], [x1, yc - half, 0], [x1, yc - half, eave], [x0, yc - half, eave])
  glass.quad([x1, yc + half, 0], [x0, yc + half, 0], [x0, yc + half, eave], [x1, yc + half, eave])
  // white eave rails
  for (const s of [-1, 1]) {
    const y = yc + s * (half + 0.12)
    const a: V3 = [x0, y, eave - 0.35], b: V3 = [x1, y, eave - 0.35], c: V3 = [x1, y, eave], d: V3 = [x0, y, eave]
    if (s < 0) white.quad(a, b, c, d); else white.quad(b, a, d, c)
  }
  // roof
  for (let i = 0; i < N; i++) {
    const [y0, z0] = prof[i], [y1, z1] = prof[i + 1]
    glass.quad([x0, yc + y0, z0], [x1, yc + y0, z0], [x1, yc + y1, z1], [x0, yc + y1, z1].map((v) => v) as V3)
  }
  // fix winding: profile runs from -y to +y over the top, so the quads above face up/outward
  // gable ends
  const ends: [number, boolean][] = [[x0, endCaps[0]], [x1, endCaps[1]]]
  for (const [x, on] of ends) {
    if (!on) continue
    const ring: XY[] = [[-half, 0], [half, 0], ...[...prof].reverse()]
    const P = (q: XY): V3 => [x, yc + q[0], q[1]]
    const pts = ring.map(P)
    // fan from the base centre
    const o: V3 = [x, yc, 0]
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length]
      if (x === x0) glass.tri(o, b, a); else glass.tri(o, a, b)
    }
  }
}

/** An end pavilion: a hall running north-south with a rounded (apsidal) south end. */
function endPavilion(xc: number, y0: number, y1: number, half: number, eave: number, crest: number) {
  const N = 8
  const ys = y0 + half // where the apse begins
  // walls along y
  glass.quad([xc + half, ys, 0], [xc + half, y1, 0], [xc + half, y1, eave], [xc + half, ys, eave])
  glass.quad([xc - half, y1, 0], [xc - half, ys, 0], [xc - half, ys, eave], [xc - half, y1, eave])
  for (let i = 0; i < N; i++) {
    const t0 = (Math.PI * i) / N, t1 = (Math.PI * (i + 1)) / N
    const P = (t: number, y: number): V3 => [xc + half * Math.cos(t), y, eave + (crest - eave) * Math.sin(t)]
    glass.quad(P(t0, ys), P(t0, y1), P(t1, y1), P(t1, ys))
  }
  // north gable
  {
    const o: V3 = [xc, y1, 0]
    const ring: V3[] = [[xc + half, y1, 0], ...Array.from({ length: N + 1 }, (_, i) => { const t = (Math.PI * i) / N; return [xc + half * Math.cos(t), y1, eave + (crest - eave) * Math.sin(t)] as V3 }), [xc - half, y1, 0]]
    for (let i = 0; i + 1 < ring.length; i++) glass.tri(o, ring[i + 1], ring[i])
  }
  // the apse: a half-cylinder wall and a quarter-ellipsoid roof, facing south
  for (let i = 0; i < N; i++) {
    const a0 = -(Math.PI * i) / N, a1 = -(Math.PI * (i + 1)) / N // from east round the south to west
    const W = (a: number, z: number): V3 => [xc + half * Math.cos(a), ys + half * Math.sin(a), z]
    glass.quad(W(a1, 0), W(a0, 0), W(a0, eave), W(a1, eave))
    for (let k = 0; k < 4; k++) {
      const p0 = (k * Math.PI) / 8, p1 = ((k + 1) * Math.PI) / 8
      const D = (a: number, p: number): V3 => [xc + half * Math.cos(a) * Math.cos(p), ys + half * Math.sin(a) * Math.cos(p), eave + (crest - eave) * Math.sin(p)]
      glass.tri(D(a1, p0), D(a0, p0), D(a0, p1))
      if (k < 3) glass.tri(D(a1, p0), D(a0, p1), D(a1, p1))
    }
  }
  // a white entrance bay at the apse's foot, and finials
  prism(white, [[xc - 1.3, y0 - 0.6], [xc + 1.3, y0 - 0.6], [xc + 1.3, y0 + 1.5], [xc - 1.3, y0 + 1.5]], 0, 3.2, white, 0.2)
  door.quad([xc - 0.7, y0 - 0.63, 0], [xc + 0.7, y0 - 0.63, 0], [xc + 0.7, y0 - 0.63, 2.4], [xc - 0.7, y0 - 0.63, 2.4])
  lathe(white, [[0.35, crest - 0.2], [0.35, crest + 0.6], [0.12, crest + 2.0], [0, crest + 2.3]], 8, [xc, ys])
  // a plinth course round the foot
  prism(white, [[xc - half - 0.15, ys], [xc + half + 0.15, ys], [xc + half + 0.15, y1], [xc - half - 0.15, y1]], 0, 0.6, null)
}

// --- The central pavilion ---
// walls (octagonal), plinth, cornice
{
  const R = 9.0, n = 16
  lathe(white, [[R + 0.2, 0], [R + 0.2, 0.7], [R, 0.75]], n, C, Math.PI / n, false)
  lathe(glass, [[R, 0.75], [R, 5.0]], n, C, Math.PI / n, false)
  lathe(white, [[R, 5.0], [R + 0.35, 5.1], [R + 0.35, 5.6], [R, 5.7]], n, C, Math.PI / n, false)
  // the lower dome: a broad bell from the cornice to the clerestory
  lathe(glass, [[R - 0.1, 5.7], [8.7, 7.0], [7.8, 8.4], [6.4, 9.5], [5.5, 10.0]], n, C, Math.PI / n, true)
  // the clerestory drum and its cornice
  lathe(white, [[5.5, 10.0], [5.2, 10.1], [5.2, 10.5]], n, C, Math.PI / n, false)
  lathe(glass, [[5.2, 10.5], [5.2, 12.3]], n, C, Math.PI / n, false)
  lathe(white, [[5.2, 12.3], [5.6, 12.4], [5.6, 12.9], [5.3, 13.0]], n, C, Math.PI / n, false)
  // the upper dome, slightly swelling, then the lantern and finial
  lathe(glass, [[5.3, 13.0], [5.5, 14.2], [5.1, 15.6], [4.2, 16.9], [2.8, 17.8], [1.0, 18.4], [0.6, 18.45]], n, C, Math.PI / n, true)
  lathe(white, [[0.6, 18.45], [0.75, 18.6], [0.75, 19.4], [0.3, 19.7], [0.25, 20.6], [0.1, 21.5], [0, 21.6]], 8, C)
}
// the entrance porch: a gabled glass vestibule on a white base
{
  const x0 = C[0] - 3.0, x1 = C[0] + 3.0, y0 = -19.5, y1 = -8.5, eave = 3.4, ridge = 5.4
  prism(white, [[x0 - 0.15, y0 - 0.15], [x1 + 0.15, y0 - 0.15], [x1 + 0.15, y1], [x0 - 0.15, y1]], 0, 0.7, null)
  glass.quad([x1, y0, 0.7], [x1, y1, 0.7], [x1, y1, eave], [x1, y0, eave])
  glass.quad([x0, y1, 0.7], [x0, y0, 0.7], [x0, y0, eave], [x0, y1, eave])
  const xm = (x0 + x1) / 2
  glass.quad([x1, y0, eave], [x1, y1, eave], [xm, y1, ridge], [xm, y0, ridge])
  glass.quad([xm, y0, ridge], [xm, y1, ridge], [x0, y1, eave], [x0, y0, eave])
  // the white pedimented front with its doors
  const f = y0 - 0.05
  white.quad([x0, f, 0.7], [x1, f, 0.7], [x1, f, eave], [x0, f, eave])
  white.tri([x0, f, eave], [x1, f, eave], [xm, f, ridge + 0.3])
  door.quad([xm - 1.1, f - 0.03, 0.7], [xm + 1.1, f - 0.03, 0.7], [xm + 1.1, f - 0.03, 2.9], [xm - 1.1, f - 0.03, 2.9])
  lathe(white, [[0.25, ridge + 0.2], [0.12, ridge + 1.6], [0, ridge + 1.8]], 8, [xm, y0])
}
// --- The wings and end pavilions ---
hall(-26.0, C[0] - 8.6, -3.0, 5.0, 2.3, 5.5, [false, false])
hall(C[0] + 8.6, 27.5, -3.0, 5.0, 2.3, 5.5, [false, false])
endPavilion(-30.5, -18.2, 2.0, 5.0, 2.0, 5.6)
endPavilion(32.5, -18.2, 2.0, 5.0, 2.0, 5.6)
// plinth under the wings
for (const [a, b] of [[-26.0, C[0] - 8.6], [C[0] + 8.6, 27.5]]) prism(white, [[a, -8.15], [b, -8.15], [b, 2.15], [a, 2.15]], 0, 0.6, null)

// --- The back ranges (lower glasshouses and service blocks behind) ---
prism(glass, [[-26, 2], [-4, 2], [-4, 15], [-26, 15]], 0, 3.8, roof, 0.3)
prism(glass, [[5, 2], [27.5, 2], [27.5, 15], [5, 15]], 0, 4.6, roof, 0.3)
prism(white, [[-3.6, 4], [4.4, 4], [4.4, 15], [-3.6, 15]], 0, 6.2, roof, 0.3)
prism(white, [[-25, 15], [-3, 15], [-3, 17.5], [-25, 17.5]], 0, 3.3, roof, 0.2)

const parts = [
  { part: glass, material: { name: 'glass', color: 0xe1e8ec, roughness: 0.3 } },
  { part: white, material: finish('conservatory-white', 0xf6f3ec) },
  { part: roof, material: finish('conservatory-roof', 0xc8cdd0) },
  { part: door, material: PALETTE.entrance },
]
const glb = writeGlb('Conservatory of Flowers', parts, {
  license: 'CC0-1.0', bearing: 354.5, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 21.6,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/30675038'],
})
const tris = report('Conservatory', parts, glb)
const out = new URL('../models/sf-conservatory-of-flowers.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
