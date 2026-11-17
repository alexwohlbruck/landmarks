/**
 * LOVE Park (John F. Kennedy Plaza), Philadelphia — procedural, CC0-1.0,
 * no textures.  bun generators/phl-love-park.ts
 *
 * What it is: the park's three things that stand up. Robert Indiana's LOVE
 * (1976, painted aluminium: red faces, green sides, purple insides, the
 * tilted O) on its open stainless-steel frame at the park's south-east end;
 * the round "flying saucer" welcome centre (Roy F. Larson of Harbeson,
 * Hough, Livingston & Larson, 1959-60; the Fairmount Park Welcome Center /
 * Philadelphia Hospitality Center) at the south-west corner: a thin flat
 * disc of a roof with a sloped soffit, cantilevered over a glass drum, a
 * small drum on top; and the round fountain of the 2016-18 rebuild, a
 * flush splash pad (only its edge is drawn) with a steel standpipe and one
 * tall jet in the middle. Paving, lawns and water surfaces are the map's.
 *
 * Map frame: x east, y north, z up, metres. Bearing 0 (the park holds three
 * separate objects at their own angles). Anchor: the LOVE sculpture, OSM
 * node/666320452, -75.16547 39.95415.
 *
 * Covers and replaces: the welcome centre, way/349876653 and its
 * building:part way/349876654. The park (way/50171181, leisure=park) and
 * the sculpture and fountain nodes are not buildings and draw nothing.
 *
 * SCALE: the sculpture is drawn at LOVE_SCALE = 2 times its real size. Its
 * real letters are 6 ft x 6 ft x 3 ft (1.83 x 1.83 x 0.91 m, published,
 * Association for Public Art / Wikipedia "Love (image)") on a frame about
 * 1.9 m tall, 3.7 m in all: at zoom 16-17 that is two or three pixels.
 * The lead asked for letters bold enough to read at those zooms (STYLE.md:
 * signature features get bolder at phone size), so the whole sculpture,
 * frame included, is doubled. Set LOVE_SCALE = 1 for true size.
 *
 * Evidence
 * - OSM (2026-11): saucer outline way/349876653, radius 11.1 m about
 *   (-56.6, -5.0) here; its inner part way/349876654, radius 3.7 m, same
 *   centre; fountain node/14129310723 at (-26.0, 25.9); sculpture node at
 *   the origin.
 * - USGS 3DEP lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015;
 *   the saucer predates it and kept its shape in the 2018-21 retrofit),
 *   0.5 m grid, radial profile about its centre (measured): flat roof
 *   6.3 m over the ground round it, out to r 11.2; roof drum r 3.3, top
 *   7.8 m. Centre (-56.35, -5.5), within 0.3 m of OSM.
 * - USGS NAIP orthophoto (public domain), after the rebuild: the round pale
 *   roof with its central drum; the fountain's dark wet circle, radius about
 *   9.5 m, centred (-26.3, 29.5) at the north-west end of the elliptical
 *   plaza, in line with the sculpture; the plaza's long axis, and the
 *   sculpture's facing, at bearing 135 (towards 15th Street and City Hall).
 * - Photos (Wikimedia Commons):
 *   "Love sculpture in LOVE Park in Philadelphia looking northwest.jpeg"
 *     (Dough4872, CC BY-SA 4.0, 2026), square on to the front: every letter
 *     outline below was traced from it (unit square, the block is square);
 *     the steel frame and the fountain jet behind;
 *   "Escultura Love-2023 01.jpg" and "- 02.jpg" (Alberto-g-rovi, CC BY 3.0,
 *     2023): the colours by face (red front, green sides on L and V, purple
 *     on the O's rim and the E's counters), the frame from the side;
 *   "Love Statue, Philadelphia.jpg" and "Philadelphia City Hall from LOVE
 *     Park.jpg" (Abhiram Juvvadi, CC BY-SA 4.0, 2023): the sculpture from
 *     below; the 2018 fountain: flush paving, a steel standpipe and a single
 *     tall jet;
 *   "JOHN F. KENNEDY PLAZA IN CENTER CITY - NARA - 552726.jpg" (Dick
 *     Swanson, public domain, 1973) and "Philadelphia John F. Kennedy Plaza
 *     Love Park at night 1978.jpg" (Acabashi, CC BY-SA 4.0): the saucer
 *     from above and at night: the thin disc with its sloped edge, the
 *     recessed glass drum lit inside, the small drum on the roof.
 * - Published: the 2018 repaint to red, green and purple (City of
 *   Philadelphia, "The LOVE is back!", 13 Feb 2018); the saucer's
 *   floor-to-ceiling glass and wrap-around terrace under a projecting
 *   cornice (Hidden City Philadelphia, Oct 2025); Philadelphia Register
 *   designation 2025.
 * - Estimated: the glass drum's radius 9.0 m (the 1978 photo: drum about
 *   0.8 of the disc) and the soffit's slope; the disc's edge 0.8 m deep;
 *   the frame 1.9 m tall and 1.1 times the letters' depth (photo-scaled
 *   against the 1.83 m letters); the standpipe 2.0 m, the jet 9 m (scaled
 *   from the standpipe in the 2023 photo; it varies).
 *
 * Doubts
 * - No licensed photo of the saucer since its 2018-21 retrofit was found;
 *   its form is from the 2015 lidar, the 1973 and 1978 photos and the
 *   post-rebuild NAIP. The new glazing's mullion rhythm is a guess.
 * - The back faces of the letters are drawn red like the fronts.
 * - The fountain's edge is a 0.12 m steel line; the real one is flush.
 *
 * Night: the letters are floodlit (`_FLOODLIGHT` on the red faces); the
 * saucer's glass drum is lit inside (`window`, as in the 1978 photo).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { earcut, lathe, type XY } from './dc-nga-west'
import { cylinder, cbox, rect } from './dc-white-house'
import { saveModel } from './dc-nga-west'

const red = new Part(), green = new Part(), purple = new Part(), steel = new Part(), white = new Part(), glass = new Part()

// ===========================================================================
// LOVE

const LOVE_SCALE = 2
const S = 1.83 * LOVE_SCALE // letter block, square
const D = 0.915 * LOVE_SCALE // depth
const FRAME_H = 1.9 * LOVE_SCALE
const FACING = 135 // compass bearing the letters face

const fr = (FACING * Math.PI) / 180
const F: XY = [Math.sin(fr), Math.cos(fr)] // out of the front
const R: XY = [-F[1], F[0]] // the reader's right, facing the front: F turned clockwise
// letter units (u 0..1 right, v 0..1 up, w -0.5..0.5 toward the reader) → map
const place = (u: number, v: number, w: number): V3 => {
  const a = (u - 0.5) * S, b = w * D
  return [a * R[0] + b * F[0], a * R[1] + b * F[1], FRAME_H + v * S]
}

// Outlines traced from Dough4872's frontal photo, in its crop's pixels
// (x right, y down); the block spans x 28..952, y 30..935.
const px = (pts: [number, number][]): XY[] => pts.map(([x, y]) => [(x - 28) / 924, (935 - y) / 905] as XY)
const L = px([[28, 30], [290, 30], [290, 75], [235, 75], [235, 440], [372, 440], [470, 255], [500, 255], [500, 495], [85, 495], [85, 75], [28, 75]])
const V = px([[35, 495], [258, 495], [332, 745], [400, 495], [520, 495], [520, 545], [470, 545], [380, 935], [290, 935], [95, 545], [35, 545]])
const E = px([[545, 485], [952, 485], [952, 640], [905, 640], [905, 525], [745, 525], [745, 655], [830, 655], [830, 615], [870, 615],
  [870, 760], [830, 760], [830, 720], [745, 720], [745, 880], [905, 880], [905, 760], [952, 760], [952, 935], [545, 935]])

const ccwXY = (r: XY[]) => {
  let a = 0
  for (let i = 0; i < r.length; i++) { const p = r[i], q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1] }
  return a < 0 ? [...r].reverse() : r
}

/** A flat letter: front and back faces red, walls in `side`. */
function letter(outline: XY[], side: Part) {
  const o = ccwXY(outline)
  for (const [a, b, c] of earcut(o)) {
    red.tri(place(...o[a], 0.5), place(...o[b], 0.5), place(...o[c], 0.5))
    red.tri(place(...o[a], -0.5), place(...o[c], -0.5), place(...o[b], -0.5))
  }
  for (let i = 0; i < o.length; i++) {
    const p = o[i], q = o[(i + 1) % o.length]
    side.quad(place(...q, -0.5), place(...q, 0.5), place(...p, 0.5), place(...p, -0.5))
  }
}
letter(L, green)
letter(V, green)
letter(E, purple)

// The O: a near-round ring (traced centre x 718 y 262, radius 219 px) round
// a narrow lens of a counter tilted 46° up to the right (403 x 95 px).
{
  const c: XY = [(718 - 28) / 924, (935 - 262) / 905]
  const ro = 219 / 914, a = 201 / 914, b = 50 / 914, tilt = (46 * Math.PI) / 180
  const N = 28
  const inner: XY[] = [], outer: XY[] = []
  for (let k = 0; k < N; k++) {
    const t = (2 * Math.PI * k) / N
    const lx = a * Math.cos(t), ly = b * Math.sin(t)
    const ix = lx * Math.cos(tilt) - ly * Math.sin(tilt), iy = lx * Math.sin(tilt) + ly * Math.cos(tilt)
    inner.push([c[0] + ix, c[1] + iy])
    const ang = Math.atan2(iy, ix)
    outer.push([c[0] + ro * Math.cos(ang), c[1] + ro * Math.sin(ang)])
  }
  for (let k = 0; k < N; k++) {
    const j = (k + 1) % N
    for (const w of [0.5, -0.5]) {
      const q = [place(...outer[k], w), place(...outer[j], w), place(...inner[j], w), place(...inner[k], w)]
      if (w > 0) red.quad(q[0], q[1], q[2], q[3])
      else red.quad(q[3], q[2], q[1], q[0])
    }
    purple.quad(place(...outer[k], -0.5), place(...outer[j], -0.5), place(...outer[j], 0.5), place(...outer[k], 0.5))
    purple.quad(place(...inner[j], -0.5), place(...inner[k], -0.5), place(...inner[k], 0.5), place(...inner[j], 0.5))
  }
}

// The stainless frame: four square posts, a top tray under the letters and
// a base frame on the ground.
{
  const hw = S * 0.52, hd = D * 0.55, t = 0.07 * LOVE_SCALE
  const at = (a: number, b: number): XY => [a * R[0] + b * F[0], a * R[1] + b * F[1]]
  const box = (a0: number, a1: number, b0: number, b1: number, z0: number, z1: number) => {
    const ring = [at(a0, b0), at(a1, b0), at(a1, b1), at(a0, b1)]
    const rr = ccwXY(ring)
    steel.loft([rr.map(([x, y]) => [x, y, z0] as V3), rr.map(([x, y]) => [x, y, z1] as V3)])
    steel.cap(rr.map(([x, y]) => [x, y, z1] as V3), true)
    steel.cap(rr.map(([x, y]) => [x, y, z0] as V3), false)
  }
  for (const sa of [-1, 1]) for (const sb of [-1, 1]) {
    const a = sa * (hw - t / 2), b = sb * (hd - t / 2)
    box(a - t / 2, a + t / 2, b - t / 2, b + t / 2, 0, FRAME_H)
  }
  box(-hw, hw, -hd, hd, FRAME_H - 0.06 * LOVE_SCALE, FRAME_H) // the tray
  for (const sb of [-1, 1]) box(-hw, hw, sb * hd - t / 2, sb * hd + t / 2, 0, 0.05 * LOVE_SCALE)
  for (const sa of [-1, 1]) box(sa * hw - t / 2, sa * hw + t / 2, -hd, hd, 0, 0.05 * LOVE_SCALE)
}

// ===========================================================================
// The saucer.
{
  const cx = -56.4, cy = -5.3
  const RR = 11.2, ROOF = 6.3, EDGE = 0.8, DRUM = 9.0, SOFFIT = 4.4, N = 32
  // base plinth
  lathe(white, cx, cy, [[DRUM + 0.4, 0], [DRUM + 0.4, 0.35], [DRUM, 0.35]], N, false)
  // the glass drum, with slim mullions
  const pts = (r: number, k: number): XY => [cx + r * Math.cos((2 * Math.PI * k) / N), cy + r * Math.sin((2 * Math.PI * k) / N)]
  for (let k = 0; k < N; k++) {
    const p = pts(DRUM, k), q = pts(DRUM, k + 1)
    glass.quad([p[0], p[1], 0.35], [q[0], q[1], 0.35], [q[0], q[1], SOFFIT], [p[0], p[1], SOFFIT])
    // a mullion at each facet corner
    const m0 = pts(DRUM + 0.06, k - 0.06), m1 = pts(DRUM + 0.06, k + 0.06)
    const n: XY = [Math.cos((2 * Math.PI * k) / N), Math.sin((2 * Math.PI * k) / N)]
    white.quad([m0[0], m0[1], 0.35], [m1[0], m1[1], 0.35], [m1[0], m1[1], SOFFIT], [m0[0], m0[1], SOFFIT])
    void n
  }
  // a door-height transom line round the drum
  lathe(white, cx, cy, [[DRUM + 0.07, 2.6], [DRUM + 0.07, 2.8]], N, false)
  // soffit, fascia with a bevel, roof, roof drum
  lathe(white, cx, cy, [[DRUM - 0.01, SOFFIT], [RR, ROOF - EDGE], [RR, ROOF - 0.25], [RR - 0.25, ROOF], [3.3, ROOF], [3.3, 7.6], [3.1, 7.8], [0, 7.8]], N, false)
}

// ===========================================================================
// The fountain: its edge, the standpipe, the jet.
{
  const cx = -26.3, cy = 29.5, N = 32
  lathe(steel, cx, cy, [[9.3, 0], [9.3, 0.12], [9.7, 0.12], [9.7, 0]].reverse() as [number, number][], N, false)
  lathe(steel, cx, cy, [[0.32, 0], [0.32, 1.9], [0.26, 2.0]], 12, false)
  lathe(white, cx, cy, [[0.26, 2.0], [0.45, 3.5], [0.65, 6.0], [0.75, 7.8], [0.6, 8.7], [0.3, 9.1], [0, 9.2]], 12, false)
}

const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : 0.9)
/** A material with its night floodlighting (written as `_FLOODLIGHT`). */
function withFlood<T extends object>(m: T, floodlight: (p: V3, n: V3) => number) {
  return { ...m, floodlight }
}
if (import.meta.main) {
  await saveModel('phl-love-park', 'LOVE Park', [
    { part: red, material: withFlood(finish('love-red', 0xd2332b), lit) },
    { part: green, material: finish('love-green', 0x2e8a52) },
    { part: purple, material: finish('love-purple', 0x6a5fb8) },
    { part: steel, material: finish('stainless', 0xb7bcc0, 0.4) },
    { part: white, material: { ...PALETTE.trim, name: 'saucer-white', color: 0xf2efe8 } },
    { part: glass, material: PALETTE.window },
  ], { source: 'generators/phl-love-park.ts', bearing: 0, osm: 'node/666320452', height: 9.2 })
}
