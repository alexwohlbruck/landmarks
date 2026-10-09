/**
 * Crown Fountain (Jaume Plensa with Krueck + Sexton, 2004), Millennium Park,
 * Chicago — original procedural geometry, CC0-1.0.
 *
 *   bun generators/chi-crown-fountain.ts
 *
 * Map frame: x east, y north, z up, metres; origin midway between the two
 * towers (OSM way/126945440 north, way/126945441 south), on the pool. Their
 * outlines run at 89° / 179°, so the catalog bearing is 359 and the towers
 * are square to this frame. The towers' centroids are 51.0 m apart, the
 * southern one 1.5 m further east; in the turned frame that leaves it
 * 0.6 m east of the northern one, which the model keeps.
 *
 * Identity: two tall glass-block towers facing each other across the long
 * black reflecting pool, each with a giant face on the LED screen of its
 * inward wall.
 *
 * Evidence:
 *  - Published (Wikipedia, "Crown Fountain"): towers 50 x 23 x 16 ft
 *    (15.2 x 7.0 x 4.9 m), LED video on the inward faces, pool 48 x 232 ft.
 *  - OSM ways 126945440/126945441: 6.7 x 4.6 m footprints, height 15.24 —
 *    agree with the published size, used here.
 *  - USGS NAIP orthophoto: the two pale tower tops 51 m apart north-south.
 *  - Photos (Wikimedia Commons): 20070621_Crown_Fountain_Overview.JPG and
 *    20070616_Crown_Fountain.JPG (TonyTheTiger, CC BY-SA 3.0);
 *    20080517_Crown_Fountain_towers_from_overhead.jpg (jjlthree, CC BY 2.0);
 *    Chicago_-_Crown_Fountain.JPG (Betadg, CC BY-SA 3.0); Crown Fountain,
 *    Millennium Park (9179501813) (Ken Lund, CC BY-SA 2.0); The_Two_Walls.jpg.
 *  - Colour: the glass block reads a pale grey-green, lit from inside; the
 *    face screens read warm (skin tones) by day and glow at night, so they
 *    take a warm `window` colour; a thin stainless frame caps each tower.
 *
 * Left out: the pool (water is the map's), the horizontal LED support bands
 * every 1.5 m, the block joints, the spout.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

// The towers are glazing that stays as it is at night apart from the screen.
const GLASS = { name: 'glass', color: 0xb6c1b8, roughness: 0.24 }
const FRAME = finish('stainless', 0xd3d9de, 0.4)
// The LED faces: warm skin tones by day, lit at night.
const SCREEN = { name: 'window', color: 0xae978b, roughness: 0.35 }

const W = 7.0, D = 4.9, H = 15.2
const HALF_GAP = 25.5
const glass = new Part(), frame = new Part(), screen = new Part()

type XY = [number, number]
const ring = (pts: XY[], z: number): V3[] => pts.map(([x, y]) => [x, y, z])
/** A rectangle with chamfered corners, counter-clockwise. */
function rect(cx: number, cy: number, hx: number, hy: number, c: number): XY[] {
  return [[cx - hx + c, cy - hy], [cx + hx - c, cy - hy], [cx + hx, cy - hy + c], [cx + hx, cy + hy - c],
    [cx + hx - c, cy + hy], [cx - hx + c, cy + hy], [cx - hx, cy + hy - c], [cx - hx, cy - hy + c]]
}
function prism(p: Part, pts: XY[], z0: number, z1: number, top = true) {
  p.loft([ring(pts, z0), ring(pts, z1)])
  if (top) p.cap(ring(pts, z1), true)
}

/** One tower; `face` is +1 when its screen faces north, -1 south. */
function tower(cx: number, cy: number, face: 1 | -1) {
  // Glass body with softened corners, then a slim stainless cap whose top
  // edge is bevelled.
  prism(glass, rect(cx, cy, W / 2, D / 2, 0.3), 0, H - 0.35, false)
  prism(frame, rect(cx, cy, W / 2 + 0.02, D / 2 + 0.02, 0.32), H - 0.35, H - 0.12, false)
  frame.loft([ring(rect(cx, cy, W / 2 + 0.02, D / 2 + 0.02, 0.32), H - 0.12), ring(rect(cx, cy, W / 2 - 0.1, D / 2 - 0.1, 0.22), H)])
  frame.cap(ring(rect(cx, cy, W / 2 - 0.1, D / 2 - 0.1, 0.22), H), true)
  // The screen: the inward wall inside a narrow glass margin, set just proud.
  const y = cy + face * (D / 2 + 0.03)
  const x0 = cx - W / 2 + 0.45, x1 = cx + W / 2 - 0.45, z0 = 0.5, z1 = H - 0.8
  if (face > 0) screen.quad([x1, y, z0], [x0, y, z0], [x0, y, z1], [x1, y, z1])
  else screen.quad([x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1])
}

tower(-0.3, HALF_GAP, -1)
tower(0.3, -HALF_GAP, 1)

const parts = [{ part: glass, material: GLASS }, { part: frame, material: FRAME }, { part: screen, material: SCREEN }]
const tris = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('Crown Fountain', parts, {
  title: 'Crown Fountain',
  artist: 'Jaume Plensa',
  license: 'CC0-1.0',
  source: 'generators/chi-crown-fountain.ts',
})
const out = process.argv[2] ?? new URL('../models/chi-crown-fountain.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
