/**
 * Thirsty Beaver Saloon, 1225 Central Avenue, Plaza Midwood, Charlotte —
 * procedural, CC0-1.0.
 * bun generators/clt-thirsty-beaver.ts
 *
 * The one-storey honky-tonk (opened 2008) whose landlord would not sell, so
 * the Overton Row apartments (2018-2025) were built round it in a horseshoe.
 * A plain flat-roofed box of buff brick, about 6.5 × 18 m, end-on to Central
 * Avenue. What makes it itself, each drawn as plain geometry:
 *  - the street front: buff brick, a dark wooden fascia over a silver
 *    flashing strip, the big yellow "Thirsty Beaver Saloon" board centred
 *    over the door (lettering and shamrock not modelled; the board's colour
 *    is), the door and two barred windows either side;
 *  - the east flank painted orange, with the beaver mural near the front
 *    corner: a brown beaver in a white cowboy hat and boots, one paw raised,
 *    a menu in the other, a big dark tail behind (flat shapes on the wall);
 *  - the roof stepping down a little halfway back.
 *
 * Map frame: x across the front (east +), y back from Central Avenue
 * (bearing 10.4, the outline's long axis), z up, metres. The front faces
 * Central Avenue at 190°. Origin = centroid of OSM way/323198175,
 * lng -80.8173163, lat 35.2213364.
 *
 * Evidence:
 *  - OSM way/323198175 (name, wikidata Q123524350, no height): 6.47 × 18.38 m.
 *  - Lidar, USGS 3DEP USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17),
 *    0.5 m grid sampled in this frame: footprint 6 × 19 m, about 0.5 m east
 *    and 1.3 m south of the OSM outline (OSM kept, it is what the map
 *    hides); roof 5.3 m above ground_min (213.89 m) over the front half and
 *    4.5 m over the back half, the step about midway; ground 0.8-1.2 m on
 *    the west side, 1.7-1.8 m on the east and at the front. y = 0 is
 *    ground_min + 1.1 m (the west side).
 *  - Published: Wikipedia "Thirsty Beaver" — one storey, 1,200 sq ft
 *    (111 m²; the outline is 119 m²), opened 2008; "on an orange side of the
 *    building is a large beaver ... wearing a cowboy hat and boots".
 *  - Photos (Wikimedia Commons):
 *    · "Thirsty beaver.jpg", David D'Agostino, CC BY-SA 4.0 — the front
 *      head-on from the patio: the layout of the front, measured on it at
 *      6.47 m wide (102 px/m).
 *      https://commons.wikimedia.org/wiki/File:Thirsty_beaver.jpg
 *    · "Side view of the Thirsty Beaver.jpg" and "The Thirsty Beaver.jpg",
 *      David D'Agostino, CC BY-SA 4.0 — front and the orange east flank
 *      from the south-east; the mural's height and position.
 *      https://commons.wikimedia.org/wiki/File:Side_view_of_the_Thirsty_Beaver.jpg
 *      https://commons.wikimedia.org/wiki/File:The_Thirsty_Beaver.jpg
 *    · "The Thirsty Beaver in Charlotte North Carolina.jpg", John F.
 *      Roberts, 2018, public domain — the front from across Central Avenue.
 *      https://commons.wikimedia.org/wiki/File:The_Thirsty_Beaver_in_Charlotte_North_Carolina.jpg
 *    · "Thirsty beaver sign.jpg", David D'Agostino, CC BY-SA 4.0 — the
 *      board's colour.
 *      https://commons.wikimedia.org/wiki/File:Thirsty_beaver_sign.jpg
 *    · "Overton Row surrounding Thirsty Beaver Early April 2025.jpg", City
 *      Dweller 2, CC BY-SA 4.0 — the front from across Central Avenue in
 *      daylight, its height against the apartments.
 *      https://commons.wikimedia.org/wiki/File:Overton_Row_surrounding_Thirsty_Beaver_Early_April_2025.jpg
 *  - USGS NAIP: the roof is pale grey (too coarse for more at this size).
 *
 * Numbers: plan from OSM; roof levels and the step from lidar, the front
 * raised 0.2 m to the photo's 3.9 m wall over the front pavement (measured
 * on the head-on photo against the 6.47 m width; lidar gives 3.5 m, its
 * roof returns sit behind the fascia). Openings, board, fascia and flashing
 * measured on the head-on photo. The mural: its height (hat 4.0 m, boots
 * 1.35 m) from the south-east photo; its width from the beaver's own
 * proportions, the flank being too foreshortened to measure; its place,
 * centred 1.9 m behind the front corner, estimated from the same photo.
 *
 * Doubts: no photo shows the west wall, the back or the rear 15 m of the
 * east flank (the apartments stand within a few metres). The whole east
 * flank is painted orange here; only its front 3-4 m is photographed. The
 * west wall and back are drawn as plain buff brick.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n?: V3) {
  const N = n && ([n, n, n] as V3[])
  p.tri(a, b, c, undefined, undefined, undefined, N)
  p.tri(a, c, d, undefined, undefined, undefined, N)
}

/** An axis-aligned box; `b` chamfers its top edges; `sides` = S, E, N, W. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0, top: Part = p, sides = [true, true, true, true]) {
  const zt = z1 - b
  const S: V3 = [0, -1, 0], E: V3 = [1, 0, 0], N: V3 = [0, 1, 0], W: V3 = [-1, 0, 0]
  if (sides[0]) quad(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, zt], [x0, y0, zt], S)
  if (sides[1]) quad(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, zt], [x1, y0, zt], E)
  if (sides[2]) quad(p, [x1, y1, z0], [x0, y1, z0], [x0, y1, zt], [x1, y1, zt], N)
  if (sides[3]) quad(p, [x0, y1, z0], [x0, y0, z0], [x0, y0, zt], [x0, y1, zt], W)
  if (b > 0) {
    const i0 = x0 + b, i1 = x1 - b, j0 = y0 + b, j1 = y1 - b
    quad(p, [x0, y0, zt], [x1, y0, zt], [i1, j0, z1], [i0, j0, z1], unit([0, -1, 1]))
    quad(p, [x1, y0, zt], [x1, y1, zt], [i1, j1, z1], [i1, j0, z1], unit([1, 0, 1]))
    quad(p, [x1, y1, zt], [x0, y1, zt], [i0, j1, z1], [i1, j1, z1], unit([0, 1, 1]))
    quad(p, [x0, y1, zt], [x0, y0, zt], [i0, j0, z1], [i0, j1, z1], unit([-1, 0, 1]))
    quad(top, [i0, j0, z1], [i1, j0, z1], [i1, j1, z1], [i0, j1, z1], [0, 0, 1])
  } else quad(top, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
}

// ---------------------------------------------------------------------------
// Plan and levels.
const X0 = -3.23, X1 = 3.23, Y0 = -9.19, Y1 = 9.19
const STEP = 0.8          // where the roof steps down (lidar)
const TOP_F = 4.4         // front half, top of fascia
const TOP_R = 3.6         // back half (lidar, 0.8 m lower)
const PAVE = 0.5          // the front pavement and patio above y = 0
const FASCIA = 0.2, FLASH = 0.3

const brick = new Part(), orange = new Part(), board = new Part()
const brown = new Part(), win = new Part(), silver = new Part()

// The two halves: brick walls, the east flank in the orange-paint part.
box(brick, X0, X1, Y0, STEP, 0, TOP_F - FASCIA, 0, silver, [true, false, false, true])
box(brick, X0, X1, STEP, Y1, 0, TOP_R - FASCIA, 0, silver, [false, false, true, true])
quad(brick, [X1, STEP, TOP_R], [X0, STEP, TOP_R], [X0, STEP, TOP_F - FASCIA], [X1, STEP, TOP_F - FASCIA], [0, 1, 0])
const E: V3 = [1, 0, 0]
quad(orange, [X1, Y0, 0], [X1, STEP, 0], [X1, STEP, TOP_F - FASCIA], [X1, Y0, TOP_F - FASCIA], E)
quad(orange, [X1, STEP, 0], [X1, Y1, 0], [X1, Y1, TOP_R - FASCIA], [X1, STEP, TOP_R - FASCIA], E)

// The dark wooden fascia round both halves, chamfered, standing just proud.
const o = 0.08
box(brown, X0 - o, X1 + o, Y0 - o, STEP, TOP_F - FASCIA, TOP_F, 0.06, silver, [true, true, false, true])
box(brown, X0 - o, X1 + o, STEP, Y1 + o, TOP_R - FASCIA, TOP_R, 0.06, silver, [false, true, true, true])
quad(brown, [X1 + o, STEP, TOP_F - FASCIA], [X0 - o, STEP, TOP_F - FASCIA], [X0 - o, STEP, TOP_F], [X1 + o, STEP, TOP_F], [0, 1, 0])

// ---------------------------------------------------------------------------
// The street front, measured on the head-on photo (x from its centre).
const yf = Y0 - 0.04
const S: V3 = [0, -1, 0]
const southPanel = (p: Part, x0: number, x1: number, z0: number, z1: number, y = yf) =>
  quad(p, [x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1], S)

// The silver flashing under the fascia, either side of the board.
const zf0 = TOP_F - FASCIA - FLASH, zf1 = TOP_F - FASCIA
southPanel(silver, X0, X1, zf0, zf1)
// The board: a broad yellow panel in a thin dark frame, standing proud.
const BX0 = -1.0, BX1 = 1.57, BZ0 = PAVE + 2.45, BZ1 = PAVE + 3.73
box(brown, BX0 - 0.06, BX1 + 0.06, Y0 - 0.16, Y0, BZ0 - 0.06, BZ1 + 0.06, 0.03, brown, [true, true, false, true])
southPanel(board, BX0, BX1, BZ0, BZ1, Y0 - 0.17)
// The door (lit, open in the photos) and two barred windows, each in a
// silver frame.
const opening = (x0: number, x1: number, z0: number, z1: number) => {
  southPanel(silver, x0 - 0.1, x1 + 0.1, z0 - 0.1, z1 + 0.1, Y0 - 0.06)
  southPanel(win, x0, x1, z0, z1, Y0 - 0.08)
}
opening(-0.39, 0.7, PAVE, PAVE + 2.28)
opening(-2.1, -1.37, PAVE + 0.83, PAVE + 2.2)
opening(1.57, 2.25, PAVE + 0.83, PAVE + 2.2)

// ---------------------------------------------------------------------------
// The mural on the orange east flank: flat shapes a few centimetres proud,
// in wall coordinates (u back from the front corner, z up).
{
  const d = X1 + 0.03
  const shape = (p: Part, pts: XY[], lift = 0) => {
    // Convex, anticlockwise as seen from the east.
    const at = (q: XY): V3 => [d + lift, Y0 + q[0], q[1]]
    for (let i = 1; i < pts.length - 1; i++) p.tri(at(pts[0]), at(pts[i]), at(pts[i + 1]), undefined, undefined, undefined, [E, E, E])
  }
  const oval = (cu: number, cz: number, ru: number, rz: number, n = 12, tilt = 0): XY[] =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * 2 * Math.PI, u = ru * Math.cos(a), z = rz * Math.sin(a)
      return [cu + u * Math.cos(tilt) - z * Math.sin(tilt), cz + u * Math.sin(tilt) + z * Math.cos(tilt)]
    })
  const C = 1.9
  // The tail behind, broad and dark, leaning back.
  shape(brown, oval(C + 0.95, 2.4, 0.45, 0.8, 12, -0.35))
  // Boots, legs, body with its pale belly, head.
  for (const s of [-1, 1]) shape(brown, [[C + s * 0.24 - 0.18, 1.35], [C + s * 0.24 + 0.18, 1.35], [C + s * 0.24 + 0.15, 2.05], [C + s * 0.24 - 0.15, 2.05]], 0.01)
  shape(brown, oval(C, 2.55, 0.5, 0.72), 0.01)
  shape(silver, oval(C, 2.5, 0.2, 0.45, 10), 0.02)
  shape(brown, oval(C, 3.25, 0.36, 0.34), 0.01)
  // The raised paw, and the menu board held out in front.
  shape(brown, [[C + 0.35, 2.85], [C + 0.55, 2.8], [C + 0.85, 3.55], [C + 0.65, 3.62]], 0.01)
  shape(brown, [[C - 0.75, 2.45], [C - 0.35, 2.6], [C - 0.4, 2.78], [C - 0.8, 2.62]], 0.01)
  shape(silver, [[C - 1.15, 2.3], [C - 0.65, 2.2], [C - 0.55, 3.0], [C - 1.05, 3.1]], 0.02)
  // The white cowboy hat: a wide brim and a crown.
  shape(silver, [[C - 0.6, 3.5], [C + 0.6, 3.5], [C + 0.55, 3.68], [C - 0.55, 3.68]], 0.02)
  shape(silver, [[C - 0.26, 3.68], [C + 0.26, 3.68], [C + 0.22, 4.02], [C - 0.22, 4.02]], 0.02)
}

// ---------------------------------------------------------------------------
// Colours from the daylight photos: buff brick, orange paint, the yellow
// board, the dark brown fascia and beaver, and one pale silver for the
// flashing, the frames, the hat and the pale roof (NAIP).
const parts = [
  { part: brick, material: finish('beaver-brick', 0xe4c29a) },
  { part: orange, material: finish('beaver-orange', 0xf29545) },
  { part: board, material: finish('beaver-board', 0xf0b43c) },
  { part: brown, material: finish('beaver-brown', 0x765645) },
  { part: win, material: PALETTE.window },
  { part: silver, material: finish('beaver-silver', 0xd6d9db) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Thirsty Beaver Saloon', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 10.4, osm: 'way/323198175', height: TOP_F,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/clt-thirsty-beaver.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${parts.length} materials`)
