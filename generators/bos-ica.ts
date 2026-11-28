/**
 * Institute of Contemporary Art, Boston (2006, Diller Scofidio + Renfro):
 * the gallery box of translucent channel glass cantilevered toward the
 * harbour over the Harborwalk, the mediatheque hanging beneath it, the
 * wooden grandstand steps and the zigzag outside stair — original
 * procedural geometry, CC0-1.0.
 * bun generators/bos-ica.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * Harborwalk deck. Bearing 30.5: +y runs along the box (compass 30.5) out
 * over the water's edge, the cantilever; -x is the long west-north-west face
 * toward the Fan Pier marina, the side every photo shows; +x faces Harbor
 * Shore Drive. Anchor -71.04295, 42.35281 = OSM way/117888922 (the only
 * OSM building here, a rough 40.6 × 44.2 m rectangle).
 *
 * Identity (from the photos below):
 *  1. The upper box, 43 × 53 m, a solid-looking slab of pale translucent
 *     channel glass with one horizontal joint, clear glass at the north end
 *     and wrapping the first part of the west face (the Founders Gallery);
 *     a grey steel fascia frames its underside.
 *  2. The cantilever: the north part of the box floats over the Harborwalk
 *     with only the wood-clad block and the grandstand under it; its soffit
 *     is wood.
 *  3. The mediatheque: a grey wedge hanging from the soffit, sloping down
 *     toward the water and ending in a tilted window.
 *  4. The grandstand: broad steps facing the harbour, rising south from the
 *     Harborwalk under the cantilever to the lobby terrace.
 *  5. The outside stair up the west face in two flights, and the dark glass
 *     lobby under the south part of the box.
 *  6. The roof's row of white sawtooth skylight monitors.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021 flight), 0.5 m
 * grid, read with tools/lidar_frame.py at bearing 30.5. The Harborwalk deck
 * is 7.6 m above the grid's ground_min (the water is at 3); it is z = 0.
 * Measured: the box's plan x -27.5..15.5, y -21..32.5 (lidar; the OSM
 * outline is 2–5 m short at both ends); its roof 20.8; the monitors' tops
 * 22.7 on a 4 m pitch across the roof; the mechanical penthouse 26.5 at
 * x -11..-1; the outside stair at x -30..-27.5: the first flight from
 * y 24 (z 0) to y 11 (z 4.5) beside the grandstand, which rises the same
 * way, a landing (the terrace) to y -2, the second flight to y -16 (z 10),
 * a landing at the south-west corner.
 *
 * Estimated from the photos (Ajay Suresh's and Beyond My Ken's views of the
 * west face, scaled to the lidar's 20.8 m roof): the box's underside 10.8
 * and its joint at 16.3; the clear glass 20 m back from the north end; the
 * mediatheque's bottom 7.6, its plan x -22..-9, y 12..27.5; the wood-clad
 * block 4.5–8.6 high at the top of the steps; the lobby's extent
 * (y -21..11); the grandstand's width (x -27.5..-6); and that the east side
 * matches the west (no photo shows the east face).
 *
 * Ground and elevation: the Harborwalk is a deck on the bulkhead; lidar
 * ground is level (7.6) right to the water's edge beyond the cantilever's
 * tip. Mapterhorn's 2 m pixels smear that edge, so the map's terrain falls
 * about 3.3 m inside the box's plan (y 26–33), and the map would set y = 0
 * at the bottom of that slope, burying the grandstand and the lobby floor
 * 2–3 m. The deck is something the terrain doesn't show, so the placement
 * takes elevation 3.4 (Mapterhorn's deck height above that low point, from
 * `terrain.ts grid` and `check`), which stands the base on the drawn deck.
 *
 * Night: the clear north galleries and the lobby glow (`window`), the
 * channel glass is lit softly from inside (floodlit), and the soffit is
 * dark (the night photo below).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Institute of Contemporary Art, Boston (54960644036).jpg, ajay_suresh,
 *    CC BY 4.0 (the west face across the marina)
 *    https://commons.wikimedia.org/wiki/File:Institute_of_Contemporary_Art,_Boston_(54960644036).jpg
 *  - 2017 Institute of Contemporary Art from Boston Harbor.jpg, Beyond My
 *    Ken, CC BY-SA 4.0 (the west face and the cantilever)
 *    https://commons.wikimedia.org/wiki/File:2017_Institute_of_Contemporary_Art_from_Boston_Harbor.jpg
 *  - ICA (36339).jpg, Rhododendrites, CC BY-SA 4.0 (from the west)
 *    https://commons.wikimedia.org/wiki/File:ICA_(36339).jpg
 *  - Institute of Contemporary Art, Boston, and Harborwalk.JPG, NewtonCourt,
 *    CC BY-SA 4.0 (under the cantilever: soffit, mediatheque window, steps)
 *    https://commons.wikimedia.org/wiki/File:Institute_of_Contemporary_Art,_Boston,_and_Harborwalk.JPG
 *  - The Institute of Contemporary Art Boston.jpg, Alacoolwiki, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:The_Institute_of_Contemporary_Art_Boston.jpg
 *  - ICA Boston at night.jpg, Bill Damon, CC BY 2.0 (night)
 *    https://commons.wikimedia.org/wiki/File:ICA_Boston_at_night.jpg
 * No commercial imagery.
 *
 * Doubts: the east and south faces are unphotographed and drawn like the
 * west; what stands under the cantilever's east half is a guess (the wood
 * block carried across); the "ICA" letters are left out (lettering is only
 * for a sign that is itself the landmark); railings are solid bands.
 * The grandstand's direction (rising south, facing the harbour) is read from
 * the lidar profile beside it and the photos' oblique views; the soffit hides
 * it from lidar. The two rooftop penthouse strips are from lidar only.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { box, onWall, rectShape } from './atl-tech-tower'
import { save, type XY } from './atl-flatiron-building'

const chan = new Part(), clear = new Part(), lobby = new Part(), steel = new Part(), wood = new Part(), roof = new Part()

const X0 = -27.5, X1 = 15.5, Y0 = -21, Y1 = 32.5
const UNDER = 10.8, JOINT = 16.3, TOP = 20.8, MON = 22.7, PENT = 26.5
const CLEAR = Y1 - 20 // the clear glass from here north

// ── the gallery box ──
// the channel-glass walls, split at the clear-glass corner; the box is closed
// below by the soffit and above by the roof.
{
  const q = (p: Part, a: XY, b: XY, z0: number, z1: number) => p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  const zb = UNDER + 0.9 // above the steel fascia
  // west face (outside toward -x): runs north→south seen from outside
  q(clear, [X0, Y1], [X0, CLEAR], zb, TOP)
  q(chan, [X0, CLEAR], [X0, Y0], zb, TOP)
  // north end: all clear
  q(clear, [X1, Y1], [X0, Y1], zb, TOP)
  // east face: clear at the north end too, channel glass south of it
  q(clear, [X1, CLEAR], [X1, Y1], zb, TOP)
  q(chan, [X1, Y0], [X1, CLEAR], zb, TOP)
  // south end
  q(chan, [X0, Y0], [X1, Y0], zb, TOP)
  // the horizontal joint in the channel glass and the clear glass's sill and transom
  const ring: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
  for (let i = 0; i < 4; i++) {
    const a = ring[i], b = ring[(i + 1) % 4]
    onWall(steel, a, b, rectShape(0, Math.hypot(b[0] - a[0], b[1] - a[1]), JOINT - 0.2, JOINT + 0.2), 0.05)
  }
  // the steel fascia round the underside and the roof's edge
  box(steel, X0 - 0.15, X1 + 0.15, Y0 - 0.15, Y1 + 0.15, UNDER, zb, null, 0, false)
  box(steel, X0 - 0.1, X1 + 0.1, Y0 - 0.1, Y1 + 0.1, TOP, TOP + 0.5, roof, 0.15)
  // the soffit: wood, a closed underside
  wood.quad([X0 - 0.15, Y0 - 0.15, UNDER], [X0 - 0.15, Y1 + 0.15, UNDER], [X1 + 0.15, Y1 + 0.15, UNDER], [X1 + 0.15, Y0 - 0.15, UNDER])
  // the galleries seen through the clear glass: a floor slab and a back wall
  box(steel, X0 + 0.3, X1 - 0.3, CLEAR, Y1 - 0.3, zb, zb + 0.4, steel, 0)
  q(chan, [X1 - 0.4, CLEAR], [X0 + 0.4, CLEAR], zb + 0.4, TOP - 0.1)
}
// the roof: the sawtooth monitors across the box, white, and the penthouse
{
  const pitch = 4, n = Math.floor((Y1 - Y0 - 2) / pitch)
  for (let k = 0; k < n; k++) {
    const y0 = Y0 + 1.5 + k * pitch, y1 = y0 + pitch - 0.6
    const xa = X0 + 0.8, xb = X1 - 0.8, zt = TOP + 0.5, zp = MON
    // a triangular prism: vertical glazed face to the north (y1), slope to the south
    const A: V3 = [xa, y0, zt], B: V3 = [xb, y0, zt], C: V3 = [xb, y1, zt], D: V3 = [xa, y1, zt]
    const E: V3 = [xa, y1, zp], F: V3 = [xb, y1, zp]
    chan.quad(A, B, F, E) // the sloping back
    clear.quad(C, D, E, F) // the glazed north face
    chan.tri(A, E, D); chan.tri(B, C, F)
  }
  for (const [a, b] of [[-10.5, -6.5], [-3.5, 0.5]]) box(roof, a, b, -16, 20, TOP + 0.5, PENT, roof, 0.3)
}

// ── under the box ──
// the lobby: dark glass under the south part
const LY = 11
box(lobby, X0 + 0.3, X1 - 0.3, Y0 + 0.3, LY, 0, UNDER, null, 0)
// mullions on the lobby glass, every 3 m, and the floor line
{
  const ring: XY[] = [[X0 + 0.3, Y0 + 0.3], [X1 - 0.3, Y0 + 0.3], [X1 - 0.3, LY], [X0 + 0.3, LY]]
  for (let i = 0; i < 4; i++) {
    const a = ring[i], b = ring[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (let s = 3; s < L - 1; s += 3) onWall(steel, a, b, rectShape(s - 0.12, s + 0.12, 0, UNDER), 0.05)
    onWall(steel, a, b, rectShape(0, L, 5.4, 5.7), 0.05)
  }
}
// the grandstand: broad wooden steps facing the harbour, rising south from
// the Harborwalk to the lobby terrace (lidar: 0 at y 24–26, 4.5 at y 11)
const GX0 = X0, GX1 = -6, GY1 = 26, GH = 4.5
{
  const n = 9
  for (let k = 0; k < n; k++) {
    const y = GY1 - ((GY1 - LY - 2) * k) / n
    box(steel, GX0, GX1, LY, y, 0, (GH * (k + 1)) / n, steel, 0)
  }
}
// the wood-clad block at the top of the steps, under the mediatheque
box(wood, GX0 + 0.5, GX1, LY, LY + 3.2, GH, 8.6, wood, 0.2)
// the mediatheque: a wedge hanging from the soffit, sloping down toward the
// water and ending in a tilted window facing the harbour
{
  const xa = -22, xb = -9, ya = LY + 1, yb = 24, yc = 27.5, zl = 7.6, U = UNDER
  for (const [x, out] of [[xa, -1], [xb, 1]] as [number, number][]) {
    const pts: V3[] = [[x, ya, U], [x, yc, U], [x, yb, zl]]
    if (out < 0) steel.tri(pts[0], pts[1], pts[2])
    else steel.tri(pts[0], pts[2], pts[1])
  }
  steel.quad([xa, yb, zl], [xb, yb, zl], [xb, ya, U], [xa, ya, U])
  {
    const dy = yc - yb, dz = U - zl, l = Math.hypot(dy, dz), ny = dz / l * 0.06, nz = -dy / l * 0.06
    const at = (x: number, t: number): V3 => [x, yb + dy * t + ny, zl + dz * t + nz]
    lobby.quad(at(xa + 0.5, 0.9), at(xb - 0.5, 0.9), at(xb - 0.5, 0.1), at(xa + 0.5, 0.1))
  }
  steel.quad([xa, yc, U], [xb, yc, U], [xb, yb, zl], [xa, yb, zl])
}

// ── the outside stair up the west face ──
{
  const xa = -30, xb = X0 - 0.05, t = 0.35, rail = 1.0
  const flight = (y0: number, z0: number, y1: number, z1: number) => {
    // a sloping slab with solid side bands for the railings
    const P = (x: number, y: number, z: number): V3 => [x, y, z]
    steel.quad(P(xa, y1, z1), P(xb, y1, z1), P(xb, y0, z0), P(xa, y0, z0))
    steel.quad(P(xa, y0, z0 - t), P(xb, y0, z0 - t), P(xb, y1, z1 - t), P(xa, y1, z1 - t))
    for (const x of [xa]) {
      // the outer railing, a band facing west and east
      steel.quad(P(x, y0, z0 - t), P(x, y1, z1 - t), P(x, y1, z1 + rail), P(x, y0, z0 + rail))
      steel.quad(P(x + 0.08, y1, z1 - t), P(x + 0.08, y0, z0 - t), P(x + 0.08, y0, z0 + rail), P(x + 0.08, y1, z1 + rail))
    }
  }
  flight(25, 0.35, LY, GH)
  box(steel, xa, xb, -2, LY, GH - 0.35, GH, steel, 0, true)
  flight(-2, 4.5, -16, 10.0)
  box(steel, xa, xb, Y0 + 0.2, -16, 9.65, 10.0, steel, 0, true)
  // posts under the landings
  for (const y of [-1.5, LY - 0.5, -16.5]) box(steel, xa + 0.2, xa + 0.5, y - 0.15, y + 0.15, 0, y < -10 ? 9.65 : GH - 0.35, null, 0)
}

// ── night ──
const glow = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : p[2] > UNDER ? 0.55 : 0)
await save('bos-ica', 'Institute of Contemporary Art', [
  { part: chan, material: { ...finish('ica-channel-glass', 0xe2e8e4, 0.5), floodlight: glow } },
  { part: clear, material: { ...windowVariant(2, 0xa9bfd1) } },
  { part: lobby, material: { ...PALETTE.window, color: 0x55666f } },
  { part: steel, material: finish('ica-steel', 0x8e959a, 0.6) },
  { part: wood, material: finish('ica-wood', 0x9a7b5f) },
  { part: roof, material: PALETTE.roof },
], { height: PENT, anchor: [42.35281, -71.04295], bearing: 30.5 }, 5000)
