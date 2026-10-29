/**
 * St. George Ferry Terminal, Staten Island — procedural, CC0-1.0, no textures.
 * bun generators/nyc-st-george-terminal.ts
 *
 * The Staten Island end of the ferry, rebuilt 1951 and renovated 2005: a
 * long deck over the railway and bus ramps, a glass waiting room whose roof
 * rises towards the harbour, four brick slip houses fanning along the water
 * with flat cantilevered steel roofs, and a white steel arch over the ramp
 * on the north-west side.
 *
 * Map frame: x = compass 146° (along the waterfront, south-east), y = compass
 * 56° (towards the harbour), z up, metres. Placed at bearing 56. Anchor:
 * area centroid of the OSM outline way/241853804.
 * z = 0 is the harbour (lidar water surface, -0.6 m NAVD88), the lowest
 * ground under the footprint; Richmond Terrace is about 3 m above it.
 * Not modelled: the water, the ferries, the fender racks, the gangways and
 * transfer bridges inside the slips, the bus ramps and shelters outside the
 * outline, the arch's thin masts. The slip houses are included: they are
 * the fingers of the OSM outline. The outline covers the slips' houses but
 * not the open water of the slips beyond them.
 *
 * Evidence
 * - OSM: outline way/241853804 (building=transportation, height 18.5); no
 *   parts. In this frame it spans x -100…110, y -98…67: the terminal, the
 *   west lobe over the railway, and four fingers on the harbour (the slip
 *   houses).
 * - Lidar: USGS 3DEP NY_NewYorkCity (flown 2017), 1 m grid in this frame,
 *   heights above the water: the deck 13.1 over most of the outline; the
 *   west lobe 8…10 (9.0 used); the waiting room x -8…53, y -8…35, its roof
 *   one plane from 15.8 (land side) to 19.4 (harbour side); the slip
 *   houses' roofs 17.4…19.4, rising towards the water, about 20 m deep; the
 *   arch, straight in plan from (-104, -38) to (-13, -1), crown 27.7 m.
 * - Published: terminal of 1951, renovated 2005 (Wikipedia "St. George
 *   Terminal"); serves the Staten Island Ferry and the Staten Island Railway.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   harbour front, frontal: "St. George Ferry Terminal, Staten Island, New York City, 20231002 1621.jpg",
 *     Jakub Hałun, CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:St._George_Ferry_Terminal,_Staten_Island,_New_York_City,_20231002_1621.jpg
 *   a slip house close up: "Docking at St. George Terminal (9739245386).jpg", Shannon from Huntsville, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Docking_at_St._George_Terminal_(9739245386).jpg
 *   harbour front at dusk: "Staten Island Ferry Terminal (29271095528).jpg", Eric Kilby, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Staten_Island_Ferry_Terminal_(29271095528).jpg
 *   harbour front with the arch: "St. George from Staten Island Ferry (7231533884).jpg", InSapphoWeTrust, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:St._George_from_Staten_Island_Ferry_(7231533884).jpg
 *   the arch from Richmond Terrace: "Staten Island Ferry Terminal (7231534458).jpg", InSapphoWeTrust, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Staten_Island_Ferry_Terminal_(7231534458).jpg
 *   the roof deck: "Staten Island Ferry Terminal at St. George and Lower Manhattan skyline….jpg",
 *     Andre Carrotflower, CC BY-SA 4.0
 *   land side (deck edge, ramps): "St. George Terminal td (2022-06-19) 001.jpg", Tdorante10, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:St._George_Terminal_td_(2022-06-19)_001.jpg
 *   Aerial plan: USGS NAIP (public domain).
 *
 * Numbers
 * - Measured: footprint (OSM), all heights above (lidar), the waiting room
 *   and slip houses' extents (lidar, NAIP).
 * - Estimated from the photos: the slip houses' brick piers 5.5 m wide rising
 *   to the roof slab (16.9 m), the slip openings 11 m high under a cream steel lintel with
 *   a curved soffit, the roofs overhanging the brick by 3 m at the front;
 *   the arch's section (4.4 m wide in the lidar, 1.4 m deep, drawn as a solid
 *   ribbon though it is a truss); the glazing between the
 *   slip houses (3…12.5 m).
 * - Colours from daylight photos: red-brown brick (pulled light), pale
 *   concrete and steel, light grey glass, grey roofs.
 *
 * Doubts: the land side is mostly hidden behind the bus ramps and only
 * seen in passing in photos; its walls are drawn plain. The west lobe's
 * roof (over the railway) is drawn flat at 9 m. The arch's ends are placed
 * from the lidar crown line; where its feet land is estimated.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, prism, finishModel, capPoly, area } from './nyc-570-lexington'
import { wallFrame } from './nyc-city-hall'

const stone = new Part(), brick = new Part(), roof = new Part(), win = new Part(), glass = new Part()

/** A planar polygon, wound so its normal points along `n`. */
function face(p: Part, pts: V3[], n: V3) {
  const [a, b, c] = pts
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const k = (u[1] * v[2] - u[2] * v[1]) * n[0] + (u[2] * v[0] - u[0] * v[2]) * n[1] + (u[0] * v[1] - u[1] * v[0]) * n[2]
  const q = k < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}
const L = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)

// --- The slip houses: front edges from the OSM fingers (west to east), ~20 m deep ---
type House = { f1: XY; f2: XY; depth: number }
const HOUSES: House[] = [
  { f1: [-66.8, 43.2], f2: [-45.4, 51.0], depth: 18 },
  { f1: [-8.0, 66.8], f2: [15.0, 67.0], depth: 26.5 },
  { f1: [42.6, 64.3], f2: [63.0, 60.6], depth: 26 },
  { f1: [89.2, 54.0], f2: [109.4, 46.3], depth: 21 },
]
const back = (h: House): [XY, XY] => {
  const len = L(h.f1, h.f2), ux = (h.f2[0] - h.f1[0]) / len, uy = (h.f2[1] - h.f1[1]) / len
  const nx = uy, ny = -ux // landward
  return [[h.f1[0] + nx * h.depth, h.f1[1] + ny * h.depth], [h.f2[0] + nx * h.depth, h.f2[1] + ny * h.depth]]
}
const HB = HOUSES.map(back)

// --- The terminal: the OSM outline with the four fingers cut at the slip houses' backs ---
const TERM: XY[] = [
  HB[0][0], HB[0][1], [-34.8, 25.2], [-40.6, 22.8], [-38.2, 16.8], [-35.9, 17.3], [-28.5, 19.9], [-22.2, 21.8], [-18.4, 22.7],
  [-18.2, 39.7], HB[1][0], HB[1][1], [34.6, 38.2], HB[2][0], HB[2][1], [59.8, 33.7], [77.4, 29.0], HB[3][0], HB[3][1], [97.3, 10.7],
  [65.6, 21.6], [65.1, 13.2], [64.3, 5.9], [63.4, -2.4], [80.5, -2.2], [80.6, -9.2], [80.6, -16.7], [80.6, -19.7], [68.5, -19.8],
  [69.1, -16.9], [69.8, -14.0], [21.9, -13.9], [21.5, -24.1], [19.1, -25.6], [17.9, -26.4], [15.6, -28.3], [13.5, -30.3], [11.6, -32.4],
  [9.9, -34.8], [8.4, -37.2], [7.0, -39.8], [6.5, -41.1], [5.5, -43.9], [1.6, -43.7], [1.3, -45.5], [-51.2, -45.2],
  // the west lobe over the railway
  [-36.0, -88.6], [-36.7, -88.9], [-61.4, -97.6], [-81.0, -41.8], [-82.2, -38.3], [-93.7, -38.2],
  [-99.6, -38.2], [-92.2, -34.5], [-80.8, -29.5], [-78.8, -28.7], [-73.1, -26.4], [-69.2, -25.0], [-61.4, -22.4], [-53.1, -19.8],
  [-58.0, -6.9], [-59.9, -2.1], [-48.5, 2.8], [-50.0, 6.5], [-53.9, 17.9], [-58.7, 16.2], [-62.9, 27.8],
]
const LOBE0 = TERM.findIndex((p) => p[0] === -36.0 && p[1] === -88.6), LOBE1 = TERM.findIndex((p) => p[0] === -93.7)
// The deck leaves out the lobe's south part: from (-51.2, -45.2) straight across to (-93.7, -38.2).
const DECK: XY[] = [...TERM.slice(0, LOBE0), [-56.0, -41.0], ...TERM.slice(LOBE1)]

const LOW = 9.0, DECK_Z = 13.1
prism({ wall: stone, win: null, roof, ring: ccw(TERM), z0: 0, z1: LOW, facade: null, bevel: 0.3 })
prism({ wall: stone, win: null, roof, ring: ccw(DECK), z0: LOW, z1: DECK_Z, facade: null, bevel: 0.3 })

// Glazing on the harbour-facing walls between the slip houses.
{
  const r = ccw(DECK)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], len = L(a, b)
    if (len < 4) continue
    const f = wallFrame(a, b, 0.06)
    if (f.n[1] < 0.6 || Math.min(a[1], b[1]) < 15) continue // only the harbour side
    if (HB.some(([p, q]) => (L(p, a) < 0.1 && L(q, b) < 0.1) || (L(p, b) < 0.1 && L(q, a) < 0.1))) continue // a slip's back wall
    face(glass, [f.at(1.0, 3.0), f.at(len - 1.0, 3.0), f.at(len - 1.0, 12.5), f.at(1.0, 12.5)], f.n)
  }
}

// --- The waiting room: glass walls under a roof rising towards the harbour ---
{
  const x0 = -8, x1 = 53, y0 = -8, y1 = 35
  const rz = (y: number) => 15.8 + ((y - y0) / (y1 - y0)) * (19.4 - 15.8)
  const c: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  for (let i = 0; i < 4; i++) {
    const a = c[i], b = c[(i + 1) % 4], f = wallFrame(a, b, 0)
    face(glass, [[a[0], a[1], DECK_Z], [b[0], b[1], DECK_Z], [b[0], b[1], rz(b[1])], [a[0], a[1], rz(a[1])]], f.n)
    // Pale mullions every ~8 m and a fascia under the roof edge.
    const fd = wallFrame(a, b, 0.08), len = L(a, b), n = Math.round(len / 8)
    for (let k = 1; k < n; k++) {
      const s = (len * k) / n, zt = rz(a[1] + (b[1] - a[1]) * (s / len))
      face(stone, [fd.at(s - 0.25, DECK_Z), fd.at(s + 0.25, DECK_Z), fd.at(s + 0.25, zt), fd.at(s - 0.25, zt)], f.n)
    }
    face(stone, [fd.at(0, rz(a[1]) - 0.9), fd.at(len, rz(b[1]) - 0.9), fd.at(len, rz(b[1]) + 0.1), fd.at(0, rz(a[1]) + 0.1)], f.n)
  }
  // The roof overhangs by a metre all round; it is white in the aerial.
  const o = 1.0
  face(stone, [[x0 - o, y0 - o, rz(y0 - o)], [x1 + o, y0 - o, rz(y0 - o)], [x1 + o, y1 + o, rz(y1 + o)], [x0 - o, y1 + o, rz(y1 + o)]], [0, 0, 1])
  face(stone, [[x0 - o, y0 - o, rz(y0 - o) - 0.6], [x1 + o, y0 - o, rz(y0 - o) - 0.6], [x1 + o, y1 + o, rz(y1 + o) - 0.6], [x0 - o, y1 + o, rz(y1 + o) - 0.6]], [0, 0, -1])
  const e: XY[] = [[x0 - o, y0 - o], [x1 + o, y0 - o], [x1 + o, y1 + o], [x0 - o, y1 + o]]
  for (let i = 0; i < 4; i++) {
    const a = e[i], b = e[(i + 1) % 4], f = wallFrame(a, b, 0)
    face(stone, [[a[0], a[1], rz(a[1]) - 0.6], [b[0], b[1], rz(b[1]) - 0.6], [b[0], b[1], rz(b[1])], [a[0], a[1], rz(a[1])]], f.n)
  }
}

// --- The slip houses: brick piers each side, a cream lintel over the slip, a cantilevered roof ---
{
  const PIER = 5.5, BRICK_TOP = 16.9, OPEN_TOP = 11.0, OVER = 3.0
  HOUSES.forEach((h, i) => {
    const [b1, b2] = HB[i]
    const len = L(h.f1, h.f2), u: XY = [(h.f2[0] - h.f1[0]) / len, (h.f2[1] - h.f1[1]) / len], n: XY = [u[1], -u[0]]
    // Local point: s along the front (0 at f1), d landward from the front.
    const P = (s: number, d: number, z: number): V3 => [h.f1[0] + u[0] * s + n[0] * d, h.f1[1] + u[1] * s + n[1] * d, z]
    const toWater: V3 = [-n[0], -n[1], 0]
    // Brick piers.
    for (const [s0, s1] of [[0.5, 0.5 + PIER], [len - 0.5 - PIER, len - 0.5]]) {
      const ring: XY[] = [P(s0, OVER, 0), P(s1, OVER, 0), P(s1, h.depth, 0), P(s0, h.depth, 0)].map((p) => [p[0], p[1]] as XY)
      prism({ wall: brick, win: null, roof: brick, ring: ccw(ring), z0: 0, z1: BRICK_TOP, facade: null, bevel: 0.3 })
      // Two small windows high on each pier's front.
      const m = (s0 + s1) / 2
      face(win, [P(m - 1.6, OVER - 0.06, 9.0), P(m + 1.6, OVER - 0.06, 9.0), P(m + 1.6, OVER - 0.06, 11.0), P(m - 1.6, OVER - 0.06, 11.0)], toWater)
    }
    // The lintel over the slip: a cream steel band with a gently curved soffit, and the dark slip beyond.
    const s0 = 0.5 + PIER, s1 = len - 0.5 - PIER, segs = 8
    const soffit = (t: number) => OPEN_TOP + 1.2 * Math.sin(Math.PI * t) // rises 1.2 m at the middle
    for (let k = 0; k < segs; k++) {
      const t0 = k / segs, t1 = (k + 1) / segs, a = s0 + (s1 - s0) * t0, b = s0 + (s1 - s0) * t1
      face(stone, [P(a, OVER, soffit(t0)), P(b, OVER, soffit(t1)), P(b, OVER, BRICK_TOP), P(a, OVER, BRICK_TOP)], toWater)
      face(stone, [P(a, OVER, soffit(t0)), P(b, OVER, soffit(t1)), P(b, OVER + 2.0, soffit(t1)), P(a, OVER + 2.0, soffit(t0))], [0, 0, -1])
    }
    face(stone, [P(s0, OVER, BRICK_TOP), P(s1, OVER, BRICK_TOP), P(s1, h.depth, BRICK_TOP), P(s0, h.depth, BRICK_TOP)], [0, 0, 1])
    face(win, [P(s0, h.depth - 0.06, 0), P(s1, h.depth - 0.06, 0), P(s1, h.depth - 0.06, OPEN_TOP + 1.2), P(s0, h.depth - 0.06, OPEN_TOP + 1.2)], toWater)
    // The slip's ceiling between the lintel and the back.
    face(stone, [P(s0, OVER + 2.0, OPEN_TOP + 1.2), P(s1, OVER + 2.0, OPEN_TOP + 1.2), P(s1, h.depth, OPEN_TOP + 1.2), P(s0, h.depth, OPEN_TOP + 1.2)], [0, 0, -1])
    // The roof: a flat steel slab rising to the water, on the brick, overhanging 3 m at the front and 1 m at the sides.
    const zf = 19.2, zb = 17.4, T = 1.1
    const zr = (d: number) => zb + (zf - zb) * (1 - d / h.depth)
    const R = [P(-1, 0, 0), P(len + 1, 0, 0), P(len + 1, h.depth, 0), P(-1, h.depth, 0)]
    const top = R.map((p, j) => [p[0], p[1], zr(j < 2 ? 0 : h.depth)] as V3)
    const bot = top.map((p) => [p[0], p[1], p[2] - T] as V3)
    face(roof, top, [0, 0, 1])
    face(stone, bot, [0, 0, -1])
    for (let j = 0; j < 4; j++) {
      const k = (j + 1) % 4, m: V3 = [(top[j][0] + top[k][0]) / 2 - (R[0][0] + R[2][0]) / 2, (top[j][1] + top[k][1]) / 2 - (R[0][1] + R[2][1]) / 2, 0]
      face(stone, [bot[j], bot[k], top[k], top[j]], m)
    }
    // Brick rises to meet the roof's underside over the piers.
    void b1; void b2
  })
}

// --- The white steel arch over the ramp, straight in plan, crown 27.7 m ---
{
  const A: V3 = [-105.2, -35.6, 8.0], B: V3 = [-14.2, 2.2, DECK_Z], H = 27.7 // the lidar band's centre line
  const lift = H - (A[2] + B[2]) / 2
  const len = Math.hypot(B[0] - A[0], B[1] - A[1]), ux = (B[0] - A[0]) / len, uy = (B[1] - A[1]) / len
  const side: V3 = [-uy, ux, 0]
  const N = 16, W = 2.2, D = 0.7 // a trussed arch about 4.4 m wide, drawn as a solid ribbon
  const at = (t: number): V3 => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t + lift * 4 * t * (1 - t)]
  const sections: V3[][] = []
  for (let i = 0; i <= N; i++) {
    const t = i / N, c = at(t)
    const dz = (B[2] - A[2]) + lift * 4 * (1 - 2 * t), dl = len
    const tl = Math.hypot(dl, dz), up: V3 = [-ux * dz / tl, -uy * dz / tl, dl / tl] // normal to the curve, in its plane
    sections.push([[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) =>
      [c[0] + side[0] * a * W + up[0] * b * D, c[1] + side[1] * a * W + up[1] * b * D, Math.max(0, c[2] + up[2] * b * D)] as V3))
  }
  stone.sweep(sections)
}

finishModel('St. George Ferry Terminal', 'nyc-st-george-terminal', [
  { part: stone, material: PALETTE.stone },
  { part: brick, material: finish('st-george-brick', 0xa9634f) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: glass, material: windowVariant(2, 0xaebfcc) },
], { bearing: 56, osm: 'way/241853804', height: 28.5 }, 6500)
