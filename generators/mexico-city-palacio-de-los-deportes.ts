/**
 * Palacio de los Deportes (1966-68, Félix Candela, Antonio Peyri and
 * Enrique Castañeda Tamborrel), Viaducto Río de la Piedad, Ciudad
 * Deportiva Magdalena Mixhuca, Mexico City: procedural, CC0-1.0.
 * bun generators/mexico-city-palacio-de-los-deportes.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0 (the dome's plan is
 * turned 8 degrees clockwise inside the frame, as OSM draws it). Origin:
 * the area centroid of the outer way/126607350 of OSM relation/20951534
 * (lng -99.0997553, lat 19.405277).
 *
 * Form, from the photos: a raised esplanade of red terracotta paving, a
 * near-circle ~190 m across with stair arms, carries the arena. The dome
 * is a rounded square in plan, about 135 m across its sides and 158 m
 * across its corners, covered in a field of copper-clad pyramidal cells
 * (hyperbolic-paraboloid panels on tubular aluminium) whose upper faces
 * weather grey and lower faces copper red-brown; its edge sits on a white
 * concrete ring beam, carried round the whole perimeter by a zigzag of
 * white inclined struts (pairs: one nearly upright, one raking), whose feet
 * stand on red plinths on the esplanade; behind them the brick-clad piers
 * of the concourse with dark doorways between.
 *
 * Sources
 * - OSM (ODbL): relation/20951534 (building, outer way/126607350: the
 *   esplanade with its stair arms, measured: r 86-101 from the anchor, arms
 *   to r 127; five small inner rings, light wells/vents on the east side,
 *   left out); copper part way/1527624820 (building:part, material copper:
 *   the dome edge, centre (-4.4, 1.3), r 66 at the side mids to r 80 at the
 *   corners, the corners at compass 53/144/232/321, i.e. a square turned
 *   ~8 degrees; measured).
 * - Published: dome diameter 120 m (es.wikipedia, "Palacio de los
 *   Deportes (México)"; OSM's outline is ~135-158 m and is followed), area
 *   ~27,000 m2, hyperbolic paraboloids of tubular aluminium clad in copper
 *   on steel arches, concrete piers clad in brick, V-shaped inclined
 *   pillars carrying the outer ramp (es.wikipedia). No height published.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 ProtoplasmaKid, "Vista aérea del Palacio de los Deportes 05.jpg",
 *     CC BY-SA 4.0 (aerial from the south-east: plan, the cell field, strut
 *     rhythm, the red esplanade and the east stairs);
 *     https://commons.wikimedia.org/wiki/File:Vista_a%C3%A9rea_del_Palacio_de_los_Deportes_05.jpg
 *   2 ProtoplasmaKid, "Vista aérea del Palacio de los Deportes 01.jpg",
 *     CC BY-SA 4.0 (the struts and plinths from above);
 *     https://commons.wikimedia.org/wiki/File:Vista_a%C3%A9rea_del_Palacio_de_los_Deportes_01.jpg
 *   3 unknown author, "Palacio de los Deportes.JPG", CC BY-SA 3.0 (level
 *     elevation: esplanade steps, struts, ring beam, cell rows and the dome
 *     profile; heights scaled from it);
 *     https://commons.wikimedia.org/wiki/File:Palacio_de_los_Deportes.JPG
 *   4 ProtoplasmaKid, "Palacio de los deportes + sky.jpg", CC BY-SA 3.0
 *     (cells close up: grey upper and brown lower faces);
 *     https://commons.wikimedia.org/wiki/File:Palacio_de_los_deportes_%2B_sky.jpg
 *   5 pacomexico, "Palacio de los Deportes - panoramio - pacomexico.jpg",
 *     CC BY 3.0, and JavierDo, "Palacio de los Deportes, domo -
 *     panoramio.jpg", CC BY-SA 3.0 (the dome profile from the west);
 *     https://commons.wikimedia.org/wiki/File:Palacio_de_los_Deportes_-_panoramio_-_pacomexico.jpg
 *     https://commons.wikimedia.org/wiki/File:Palacio_de_los_Deportes,_domo_-_panoramio.jpg
 * - Heights (estimated from photo 3; no published figure): esplanade 3.5 m
 *   (about 20 steps), ring beam top 13 m above it (16.5 m), dome crown 26 m
 *   above the ring (42.5 m). Cells: 12 diamonds along a side (photos 1, 3).
 * - Left out / doubts: the steel arches over the dome edges (thin red
 *   members, too fine for the map); the cells are a regular diamond grid
 *   over a smooth rounded-square vault, not Candela's exact panel layout;
 *   the stair arms are drawn as one low 1.4 m step; the five small east-side
 *   inner rings of the relation are ignored.
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s);
 *   flat lake-bed basin (~2,240 m). Elevation 0.
 * - Look-only: none.
 * - Night: the struts and ring beam are floodlit; doorways glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { slab, save, orient, cap, walls, type XY } from './dc-nmaahc'

const copper = new Part(), grey = new Part(), white = new Part(), red = new Part(), door = new Part(), brick = new Part()

// --- Plan of the dome: a rounded square, turned ---------------------------
const CX = -4.4, CY = 1.3, A = 67.0, S = 0.33, ROT = (8 * Math.PI) / 180
const DECK = 3.5, RIM = 16.5, HD = 26.0
/** (u, v) in [-1, 1]^2 to plan x, y. */
const plan = (u: number, v: number): XY => {
  const x = A * u * (1 - (S * v * v) / 2), y = A * v * (1 - (S * u * u) / 2)
  // turned clockwise by ROT
  return [CX + x * Math.cos(ROT) + y * Math.sin(ROT), CY - x * Math.sin(ROT) + y * Math.cos(ROT)]
}
const height = (u: number, v: number) => RIM + HD * Math.pow(Math.max(0, (1 - u * u) * (1 - v * v)), 0.42)
const P = (u: number, v: number, lift = 0): V3 => {
  const [x, y] = plan(u, v)
  return [x, y, height(u, v) + lift]
}
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const normalAt = (u: number, v: number): V3 => {
  const e = 0.01
  const du = sub3(P(Math.min(1, u + e), v), P(Math.max(-1, u - e), v)), dv = sub3(P(u, Math.min(1, v + e)), P(u, Math.max(-1, v - e)))
  let n = unit(crs(du, dv))
  if (n[2] < 0) n = [-n[0], -n[1], -n[2]]
  // near the rim the surface is near vertical: push outward
  return n
}

// --- The cell field --------------------------------------------------------
// Diamonds centred on grid points (i + j even), corners one step away along
// u and v, clamped to the square; each a low pyramid raised along the
// surface normal. Faces turned up read grey, those turned out copper.
const M = 24, step = 2 / M
const clampP = (u: number, v: number): [number, number] => [Math.max(-1, Math.min(1, u)), Math.max(-1, Math.min(1, v))]
for (let i = 0; i <= M; i++) for (let j = 0; j <= M; j++) {
  if ((i + j) % 2) continue
  const u = -1 + i * step, v = -1 + j * step
  const corners = [[u + step, v], [u, v + step], [u - step, v], [u, v - step]].map(([a, b]) => clampP(a, b))
  const n = normalAt(u, v)
  const c = P(u, v)
  const lift = 0.22 * step * A * 0.5 * 2.2
  const apex: V3 = [c[0] + n[0] * lift, c[1] + n[1] * lift, c[2] + n[2] * lift]
  for (let k = 0; k < 4; k++) {
    const a = corners[k], b = corners[(k + 1) % 4]
    if (a[0] === b[0] && a[1] === b[1]) continue
    const pa = P(a[0], a[1]), pb = P(b[0], b[1])
    const fn = unit(crs(sub3(pb, pa), sub3(apex, pa)))
    const out = fn[0] * n[0] + fn[1] * n[1] + fn[2] * n[2] >= 0 ? fn : ([-fn[0], -fn[1], -fn[2]] as V3)
    // up-facing relative to the surface: grey; the rest copper
    // faces leaning toward the crown (the upper faces seen from outside) weather grey
    const rx = c[0] - CX, ry = c[1] - CY, rl = Math.hypot(rx, ry) || 1
    const up = ((out[0] - n[0]) * rx + (out[1] - n[1]) * ry) / rl < 0 ? grey : copper
    orient(up, [pa, pb, apex], out)
  }
}

// --- Boundary helpers --------------------------------------------------------
// t in [0, 4): walks the square's edge anticlockwise from (1, -1)
const edgeUV = (t: number): [number, number] => {
  const s = Math.floor(t) % 4, f = t - Math.floor(t)
  const w = -1 + 2 * f
  return s === 0 ? [1, w] : s === 1 ? [-w, 1] : s === 2 ? [-1, -w] : [w, -1]
}
const edgeXY = (t: number, out = 0): XY => {
  const [u, v] = edgeUV(t)
  const [x, y] = plan(u, v)
  if (!out) return [x, y]
  const [x2, y2] = plan(...edgeUV(t + 0.002)), [x0, y0] = plan(...edgeUV(t - 0.002 + 4))
  const dx = x2 - x0, dy = y2 - y0, l = Math.hypot(dx, dy)
  return [x + (dy / l) * out, y - (dx / l) * out]
}
const NR = 72
const ringAt = (out: number): XY[] => Array.from({ length: NR }, (_, k) => edgeXY((4 * k) / NR + 1e-6, out))

// The dome's skirt: from the ring beam's top down onto the cell field edge.
// (The cells already meet height(±1, v) = RIM along the edge.)

// --- Ring beam -----------------------------------------------------------------
{
  const o = ringAt(1.2), i = ringAt(-1.5)
  walls(white, o, RIM - 1.8, RIM)
  for (let k = 0; k < NR; k++) {
    const l = (k + 1) % NR
    orient(white, [[...o[k], RIM - 1.8], [...o[l], RIM - 1.8], [...i[l], RIM - 1.8], [...i[k], RIM - 1.8]] as V3[], [0, 0, -1])
    orient(white, [[...o[k], RIM], [...o[l], RIM], [...i[l], RIM], [...i[k], RIM]] as V3[], [0, 0, 1])
  }
}

// --- Concourse: brick piers wall with dark doorways --------------------------
{
  const wall = ringAt(-3.5)
  walls(brick, wall, DECK, RIM - 1.8)
  const NODES = 40
  for (let k = 0; k < NODES; k++) {
    const t0 = (4 * (k + 0.22)) / NODES, t1 = (4 * (k + 0.78)) / NODES
    const a = edgeXY(t0, -3.42), b = edgeXY(t1, -3.42)
    orient(door, [[...a, DECK + 0.3], [...b, DECK + 0.3], [...b, DECK + 7.5], [...a, DECK + 7.5]] as V3[], [b[1] - a[1], -(b[0] - a[0]), 0])
  }
}

// --- Struts: at each node one nearly upright and one raking strut ----------
{
  const NODES = 40
  const beam = (p: Part, a: V3, b: V3, w: number, d: number, side: XY) => {
    // a box from a to b, width w along `side`, depth d perpendicular
    const ax = unit(sub3(b, a)), s3: V3 = [side[0], side[1], 0]
    let q = unit(crs(ax, s3))
    const sv = unit(crs(q, ax))
    const corner = (p0: V3, i: number, j: number): V3 => [p0[0] + sv[0] * i * w / 2 + q[0] * j * d / 2, p0[1] + sv[1] * i * w / 2 + q[1] * j * d / 2, p0[2] + sv[2] * i * w / 2 + q[2] * j * d / 2]
    const ring = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
    const ra = ring.map(([i, j]) => corner(a, i, j)), rb = ring.map(([i, j]) => corner(b, i, j))
    for (let k = 0; k < 4; k++) {
      const l = (k + 1) % 4
      const mid: V3 = [(ra[k][0] + ra[l][0]) / 2 - a[0], (ra[k][1] + ra[l][1]) / 2 - a[1], (ra[k][2] + ra[l][2]) / 2 - a[2]]
      orient(p, [ra[k], ra[l], rb[l], rb[k]], mid)
    }
    orient(p, rb, ax)
  }
  for (let k = 0; k < NODES; k++) {
    const t = (4 * k) / NODES + 0.05
    const top = edgeXY(t, 0.6)
    const T: V3 = [top[0], top[1], RIM - 1.2]
    const footA = edgeXY(t + 0.008, 6.5) // near upright, a little out
    const footB = edgeXY(t - 0.075, 9.5) // raking, back along the edge
    const tang: XY = [edgeXY(t + 0.01)[0] - edgeXY(t - 0.01)[0], edgeXY(t + 0.01)[1] - edgeXY(t - 0.01)[1]]
    const tl = Math.hypot(tang[0], tang[1])
    const side: XY = [tang[0] / tl, tang[1] / tl]
    beam(white, [footA[0], footA[1], DECK], T, 1.5, 1.3, side)
    beam(white, [footB[0], footB[1], DECK], T, 1.5, 1.3, side)
    // red plinths under the feet
    for (const f of [footA]) {
      const r = 1.1
      slab(red, [[f[0] - r, f[1] - r], [f[0] + r, f[1] - r], [f[0] + r, f[1] + r], [f[0] - r, f[1] + r]], DECK, DECK + 0.6, 0)
    }
  }
}

// --- The esplanade (OSM outer way/126607350) -------------------------------
const OUTER: XY[] = [[-85.9, 51.0], [-82.6, 55.9], [-75.0, 64.6], [-66.5, 72.2], [-57.7, 78.7], [-48.4, 84.0], [-35.1, 89.2], [-36.5, 94.3], [-41.7, 114.3], [-32.6, 116.8], [-27.2, 97.0], [-25.8, 91.7], [-17.7, 93.0], [-5.4, 93.6], [3.7, 93.1], [14.1, 91.3], [25.4, 88.0], [35.6, 83.4], [37.9, 87.5], [48.8, 106.3], [56.9, 101.6], [46.3, 83.2], [43.7, 78.9], [54.4, 71.0], [62.8, 62.9], [69.4, 54.6], [75.0, 45.5], [78.5, 38.5], [81.3, 31.0], [83.4, 23.4], [113.9, 31.1], [115.6, 24.2], [116.7, 15.0], [117.1, 7.0], [117.5, -0.8], [117.1, -7.3], [116.6, -14.1], [115.3, -21.5], [113.1, -31.1], [110.7, -39.5], [107.7, -47.1], [104.0, -54.5], [101.6, -59.5], [74.5, -43.6], [71.1, -49.7], [65.5, -57.6], [58.3, -65.5], [50.2, -72.8], [40.1, -79.4], [30.9, -84.1], [22.3, -87.5], [23.6, -92.3], [28.8, -111.9], [19.3, -114.6], [13.9, -94.8], [12.5, -89.9], [0.6, -91.9], [-10.2, -91.9], [-20.4, -91.0], [-30.7, -88.9], [-40.2, -85.9], [-49.0, -81.9], [-50.9, -85.2], [-61.4, -103.5], [-69.5, -98.8], [-59.0, -80.5], [-56.9, -77.0], [-65.8, -71.1], [-73.9, -63.7], [-81.1, -55.4], [-86.8, -47.1], [-91.6, -38.1], [-96.3, -27.6], [-101.5, -29.1], [-121.7, -34.8], [-124.1, -25.4], [-103.9, -19.5], [-98.8, -18.1], [-100.1, -10.3], [-100.8, 0.3], [-100.5, 10.2], [-98.7, 20.1], [-95.6, 31.3], [-90.8, 42.3], [-96.0, 45.4], [-113.9, 56.0], [-109.2, 64.5], [-91.0, 53.9]]
// whole outline as a low first step (the stair arms), the main deck on top
slab(red, OUTER, 0, 1.4, 0.3)
const MAIN = OUTER.filter(([x, y]) => Math.hypot(x, y) < 99 && !(x > 80 && Math.abs(y) < 60 && x > 83.5))
// the east stair block's foot is the deck's edge there; keep the deck round
const deck: XY[] = []
for (let k = 0; k < 48; k++) {
  const a = (k / 48) * 2 * Math.PI
  // deck radius: the OSM main ring, sampled; close to a circle of r ~ 92 about (-8, 1)
  let best = 1e9, bx = 0, by = 0
  for (const [x, y] of MAIN) {
    const ang = Math.atan2(y - 1, x + 8)
    const d = Math.abs(Math.atan2(Math.sin(ang - a), Math.cos(ang - a)))
    if (d < best) { best = d; bx = x; by = y }
  }
  const r = Math.min(Math.hypot(bx + 8, by - 1), 93.5)
  deck.push([-8 + r * Math.cos(a), 1 + r * Math.sin(a)])
}
slab(red, deck, 1.4, DECK, 0.3)
// the dome's floor disc is hidden; close the concourse top under the cells
cap(brick, ringAt(-3.5), RIM - 1.8, true)

const strutLit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.2 : p[2] > DECK + 0.5 && p[2] < RIM + 0.5 ? 0.9 : 0.3)

await save('mexico-city-palacio-de-los-deportes', 'Palacio de los Deportes', [
  { part: copper, material: finish('palacio-copper', 0x946a58) },
  { part: grey, material: finish('palacio-weathered-copper', 0x8e8d87) },
  { part: white, material: { ...finish('palacio-concrete', 0xece6dc), floodlight: strutLit } as any },
  { part: red, material: PALETTE.terracotta },
  { part: brick, material: finish('palacio-brick', 0xa57460) },
  { part: door, material: PALETTE.window },
], { name: 'Palacio de los Deportes' }, 6500)
