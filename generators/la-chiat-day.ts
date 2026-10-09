/**
 * Chiat/Day Building ("Binoculars Building"), 340 Main Street, Venice
 * (1991, Frank Gehry; binoculars by Claes Oldenburg and Coosje van
 * Bruggen) — procedural, CC0-1.0.
 * bun generators/la-chiat-day.ts
 *
 * Map frame: x along Main Street (toward the south-east, 147.5°), y away
 * from the street (north-east, 57.5°), z up, metres; placed at bearing
 * 57.5°. The street front faces the model's south. Origin at the centroid
 * of OSM way/413241944; y = 0 is the lowest ground under it (USGS 3DEP
 * 7.3 m at the back, north-east corner). The street front stands 1.2 m
 * higher (3DEP 8.4–8.5 m; the lidar surface model's street 1.1–1.3 m over
 * y = 0), so the front's detail starts at FRONT = 1.2 m and everything runs
 * down to y = 0 behind it.
 *
 * What makes it the Binoculars Building: the giant charcoal binoculars
 * standing on the street as the garage entrance — two barrels on pedestals
 * with a driveway between, flanged bodies, the bridge frame and hinge
 * between them, and two eyepieces on top; to their left the white curved
 * "boat" wing with its rows of deep windows; to their right the copper
 * "tree" wing, a thick overhanging roof plate on a forest of slanting
 * copper struts over a low copper plinth.
 *
 * Sources:
 * - Plan: OSM way/413241944 (the whole building, 13.8 m, wikidata Q194004),
 *   its outline rotated into this frame: the boat wing's bowed front, the
 *   binoculars' scalloped lobes, the copper wing and the long main block
 *   behind. USGS NAIP orthophoto confirms the outline, the white roofs and
 *   the two dark eyepiece discs.
 * - Heights (LA County 2020 lidar surface model, 2 m grid over the whole
 *   building and 1 m over the binoculars, minus y = 0 at 7.3 m): eyepiece
 *   tops 13.9–14.1 m (12.8 m over the street); binocular shoulders ~11 m;
 *   copper roof plate 12.4 m; main block roof 11.1 m with two plant rooms
 *   at ~13 m; boat wing front 10.7 m, its rear strip 13.5 m.
 * - Published: binoculars 45 ft (13.7 m) tall (Wikipedia "Binoculars
 *   Building"); the lidar gives 12.8 m over the street, used.
 * - Photos (Wikimedia Commons): "052607-006-Chiat-Day" and
 *   "052607-007-Chiat-Day-wide" (Bobak Ha'Eri, CC BY 3.0; from across Main
 *   Street, the south-west: all three parts); "Binoculars Building"
 *   (YaGeek, CC BY-SA 3.0; south-west, close: the binoculars' parts);
 *   "Los Angeles02 flickr" (ilpo's Soujurn, CC BY 2.0).
 * - Estimated from photos, scaled by the lidar: every binocular section
 *   (pedestals 3.2 m across with a 2.6 m driveway between, flanges 5 m,
 *   eyepieces 2.6 m), the boat wing's window rows, the copper wing's
 *   struts, plinth and recessed glass.
 * - Not seen in any photo: the main block's back walls (north-west,
 *   north-east, south-east); drawn as brick like the part seen behind the
 *   binoculars, with a window per bay on each floor, estimated.
 */
import { Part, type V3 } from './mesh'
import { writeGlb } from './mesh'
import { PALETTE, finish } from './palette'
import { block, ccw, countDrawn, rect, beam, wallPanel, type XY, TAU } from './la-pacific-wheel'

const FRONT = 1.2 // street level over y = 0

const stone = new Part(), roof = new Part(), win = new Part(), copper = new Part(), brick = new Part(), bino = new Part()

// --- Plan (OSM way/413241944 in this frame) ---------------------------------
const BOAT: XY[] = ccw([
  [-3.89, -4.81], [-5.91, -15.53], [-10.71, -15.46], [-8.7, -25.7], [-14.82, -27.86], [-18.16, -28.47], [-23.75, -28.87],
  [-28.13, -29.11], [-36.25, -29.06], [-41.05, -28.75], [-44.63, -28.22], [-49.0, -27.34], [-43.48, -21.58],
  [-39.41, -17.11], [-49.5, -18.6], [-49.5, -10.44],
])
const BOAT_REAR: XY[] = ccw([[-49.5, -18.6], [-49.5, -10.44], [-26, -7.5], [-26, -15.2], [-39.41, -17.11]])
// The brick piece behind the binoculars (photos), and the rest of the main
// block, painted pale (Mapillary, the back street).
const BRICK: XY[] = ccw([[-6.2, -22.5], [5.7, -22.5], [5.7, -15.3], [-5.9, -15.3]])
const MAIN: XY[] = ccw([
  [-5.9, -15.3], [5.7, -15.3], [5.7, -18.2], [25.45, -18.21], [25.69, 36.5], [24.14, 36.5], [24.16, 43.8],
  [2.66, 41.27], [2.67, 38.36], [-4.04, 38.35], [-3.89, -4.81],
])
const COPPER: XY[] = ccw([[5.68, -28.33], [22.99, -27.62], [23.01, -25.45], [24.24, -25.45], [24.28, -18.2], [5.7, -18.2]])

// --- Boat wing: white, bowed front, three rows of deep windows ---------------
block(stone, BOAT, 0, 10.7, 0.35, roof)
block(stone, BOAT_REAR, 10.4, 13.5, 0.3, roof)
{
  // A window per bay on each floor along the bowed street front and its
  // north-west end, from the photos: ground floor glass, two upper rows.
  const front = BOAT.slice()
  const rows: [number, number][] = [[FRONT + 0.5, FRONT + 2.9], [FRONT + 3.7, FRONT + 6.0], [FRONT + 6.8, FRONT + 9.0]]
  for (let i = 0; i < front.length; i++) {
    const a = front[i], b = front[(i + 1) % front.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    // Only the street front and the bow: edges facing south-ish.
    const out: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    if (out[1] > -0.5 || L < 3) continue
    const n = Math.max(1, Math.round(L / 4.2)), w = L / n
    for (let k = 0; k < n; k++) for (const [z0, z1] of rows) wallPanel(win, a, b, k * w + 0.55, (k + 1) * w - 0.55, z0, z1)
  }
}

// --- Main block behind: pale walls, tall bay windows, two plant rooms ------
block(brick, BRICK, 0, 11.1, 0.35, roof)
for (let k = 0; k < 2; k++) for (const [z0, z1] of [[FRONT + 1.0, FRONT + 4.2], [FRONT + 5.4, FRONT + 8.8]])
  wallPanel(win, [-6.2, -22.5], [5.7, -22.5], 0.9 + k * 5.95, 5.95 * (k + 1) - 0.9, z0, z1)
block(stone, MAIN, 0, 11.1, 0.35, roof)
block(roof, ccw([[9, -6], [13.5, -6], [13.5, 10], [9, 10]]), 11.0, 13.0, 0.3)
block(roof, ccw([[16, 26], [24, 26], [24, 36], [16, 36]]), 11.0, 13.0, 0.3)
{
  // Tall windows between pilasters, a panel per bay on each of the two
  // levels, on the faces clear of the wings (the north-east face from a
  // Mapillary street photo; the others assumed alike).
  for (let i = 0; i < MAIN.length; i++) {
    const a = MAIN[i], b = MAIN[(i + 1) % MAIN.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
    if (L < 4 || my < -14) continue                 // against the brick piece and the copper wing
    if (mx < -3 && my < -4) continue                // against the boat wing
    if (mx < 0 && my < 0 && Math.abs(b[1] - a[1]) > 3) continue
    const n = Math.max(1, Math.round(L / 4.6)), w = L / n
    for (let k = 0; k < n; k++) for (const [z0, z1] of [[0.9, 4.6], [5.8, 9.6]])
      wallPanel(win, a, b, k * w + 1.0, (k + 1) * w - 1.0, z0, z1)
  }
}

// --- Copper "tree" wing ------------------------------------------------------
{
  // Recessed body behind the struts, with tall glass between copper piers.
  const body: XY[] = ccw([[6.2, -23.2], [23.6, -23.2], [23.6, -18.2], [6.2, -18.2]])
  block(copper, body, 0, 9.5, 0)
  const a: XY = [6.2, -23.2], b: XY = [23.6, -23.2]
  for (let k = 0; k < 5; k++) wallPanel(win, a, b, 0.7 + k * 3.48, 3.48 * (k + 1) - 0.7, FRONT + 3.2, 9.3)
  // The low copper plinth along the street, with the cube block by the binoculars.
  block(copper, ccw([[5.9, -28.1], [22.9, -27.4], [22.9, -24.6], [5.9, -24.6]]), 0, FRONT + 2.4, 0.3)
  block(copper, ccw([[6.2, -27.2], [10.4, -27.2], [10.4, -23.2], [6.2, -23.2]]), 0, FRONT + 4.4, 0.3)
  // The roof plate: a thick slab over the whole wing whose street fascia
  // leans out, so its top edge oversails the street by two metres.
  const lo: V3[] = [[5.6, -27.4, 9.4], [24.4, -27.1, 9.4], [24.4, -18.2, 9.4], [5.6, -18.2, 9.4]]
  const hi: V3[] = [[5.4, -29.5, 12.4], [24.6, -29.2, 12.4], [24.6, -18.2, 12.4], [5.4, -18.2, 12.4]]
  const lip: V3[] = hi.map(([x, y, zz], i) => [x + (i === 0 || i === 3 ? 0.35 : -0.35), y + (i < 2 ? 0.35 : 0), zz + 0.0] as V3)
  copper.loft([lo, hi.map(([x, y, zz]) => [x, y, zz - 0.35] as V3), hi.map((p, i) => [lip[i][0], lip[i][1], 12.4] as V3)])
  copper.cap(lo, false)
  roof.cap(lip.map((p) => [p[0], p[1], 12.4] as V3), true)
  // The struts ("branches"): bold copper members fanning out from the
  // plinth up to the plate, alternately leaning each way.
  const lean = [2.6, -1.4, 2.2, -2.4, 1.6, -2.2, 2.4, -1.8, 1.2]
  for (let k = 0; k < 9; k++) {
    const u = 7.6 + k * 1.95
    beam(copper, [u, -24.8, FRONT + 2.2], [u + lean[k], -27.2, 9.5], rect(0.62, 0.45, 0.12), rect(0.62, 0.45, 0.12), [0, 0, 1])
  }
}

// --- The binoculars ----------------------------------------------------------
// Porro-prism binoculars: the objective tubes (the pedestals the building's
// driveway passes between) stand outboard of the prism bodies, which all but
// touch in the middle, and the eyepieces sit inboard on top.
{
  const C: XY = [-0.4, -25.0]  // between the barrels
  const DX = 2.85              // body axes either side
  const OBJ = 3.7              // objective tubes (pedestals) either side
  const EYE = 2.35             // eyepieces either side
  const z = FRONT
  const ring = (cx: number, cy: number, r: number, zz: number, n = 16): V3[] =>
    Array.from({ length: n }, (_, i) => [cx + r * Math.cos(i / n * TAU), cy + r * Math.sin(i / n * TAU), zz] as V3)
  const lathe = (cx: number, cy: number, prof: [number, number][], top = false) => {
    bino.loft(prof.map(([r, zz]) => ring(cx, cy, r, zz)))
    const [r, zz] = prof[prof.length - 1]
    bino.cap(ring(cx, cy, r, zz), top)
    if (!top) bino.cap(ring(cx, cy, prof[0][0], prof[0][1]), false)
  }
  for (const s of [-1, 1]) {
    const y = C[1]
    // Pedestal: foot ring and objective tube, up under the body's flange.
    lathe(C[0] + s * OBJ, y, [[2.25, 0], [2.25, z + 0.5], [1.95, z + 0.5], [1.95, z + 3.25]], true)
    // Body: flange, tapering barrel, shoulder plate.
    lathe(C[0] + s * DX, y, [[2.5, z + 3.2], [2.75, z + 3.2], [2.75, z + 3.75], [2.65, z + 3.75], [2.45, z + 9.9], [2.55, z + 9.9], [2.55, z + 10.4]], true)
    // Eyepiece: neck, wider cap, chamfered top.
    lathe(C[0] + s * EYE, y, [[1.2, z + 10.35], [1.2, z + 10.9], [1.42, z + 10.9], [1.42, z + 12.45], [1.25, z + 12.8]], true)
    // The bridge's vertical straps on each body's inner front.
    beam(bino, [C[0] + s * 0.95, y - 2.25, z + 3.7], [C[0] + s * 0.95, y - 2.25, z + 10.0], rect(0.45, 0.35, 0.1), rect(0.45, 0.35, 0.1), [1, 0, 0])
  }
  // Bridge bars top and bottom, the plate over the gap, and the hinge.
  for (const zz of [z + 4.1, z + 9.5]) beam(bino, [C[0] - 1.4, C[1] - 2.25, zz], [C[0] + 1.4, C[1] - 2.25, zz], rect(0.4, 0.4, 0.1), rect(0.4, 0.4, 0.1), [0, 1, 0])
  beam(bino, [C[0] - 1.2, C[1], z + 10.1], [C[0] + 1.2, C[1], z + 10.1], rect(0.3, 1.6, 0.1), rect(0.3, 1.6, 0.1), [0, 1, 0])
  beam(bino, [C[0], C[1] - 1.5, z + 3.7], [C[0], C[1] - 1.5, z + 10.3], rect(0.5, 0.5, 0.15), rect(0.5, 0.5, 0.15), [1, 0, 0])
}

const BINO = finish('binocular-grey', 0x5d636b, 0.7)
const parts = [
  { part: stone, material: PALETTE.stone },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: copper, material: PALETTE.metal },
  { part: brick, material: PALETTE.terracotta },
  { part: bino, material: BINO },
]
if (process.env.ONLY_BINO) await Bun.write(process.env.ONLY_BINO, writeGlb('b', [{ part: bino, material: finish('binocular-grey', 0x5d636b) }]))
const triangles = countDrawn(parts)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Chiat/Day Building', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: 14.0, bearing: 57.5,
})
await Bun.write(new URL('../models/la-chiat-day.glb', import.meta.url), glb)
console.log(`la-chiat-day.glb: ${triangles} triangles, ${glb.length} bytes`)
