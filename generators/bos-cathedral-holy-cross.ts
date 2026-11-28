/**
 * Cathedral of the Holy Cross, Boston (1866–75, Patrick C. Keely): Roxbury
 * puddingstone with grey limestone trim, Gothic Revival, a long nave with
 * lean-to aisles and a steep slate roof, transepts, a polygonal apse, and
 * two unequal west towers that never got their spires — original
 * procedural geometry, CC0-1.0.
 * bun generators/bos-cathedral-holy-cross.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Anchor = the centre of OSM way/29612019, -71.06953,
 * 42.34077. Bearing 22.5: +x runs down the nave (compass 112.5) from the
 * west front on Washington Street (-x) to the apse (+x); +y is the north
 * side (Union Park Street), -y the south (Monsignor Reynolds Way).
 *
 * Identity (from the photos below):
 *  1. The west front: the tall south-west tower, square, with pale
 *     limestone corner buttresses, three stages of lancets and a flat top
 *     with low corner turrets (the spire was never built); the shorter
 *     north-west tower with two slate-capped turrets; between them the
 *     gable with the great rose window over three lancets and the deep
 *     pointed portal.
 *  2. The long sides: buttressed aisles with big traceried windows under
 *     lean-to slate roofs, the clerestory's paired lancets, and the steep
 *     dark slate main roof.
 *  3. The transepts' gables, each with a huge traceried window.
 *  4. The polygonal apse at the east end.
 *  5. Warm grey-tan puddingstone, pale limestone trim, dark slate.
 *
 * Plan: OSM way/29612019 turned to bearing 22.5 (it outlines the nave,
 * transepts, towers and chancel but leaves the aisles out; the lidar shows
 * them): nave x -45.8..44, y -11..5; aisles to y 12.5 and -17.5 from the
 * towers to the transepts, and on the south along the chancel (north of the
 * chancel stands a separate building, way/29571795, left to the map);
 * transepts x 15..30.4, y -25.9..20.8; south-west
 * tower x -46..-34.5, y -22..-10.5; north-west tower x -42.5..-33,
 * y 5.8..16.2; the apse three-sided to x 48.5.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021 flight), 1 m
 * grid, read with tools/lidar_frame.py at bearing 22.5; y = 0 is the
 * ground round the church (2.3 m above the grid's ground_min; it varies
 * about 1.3 to 3.9, an areaway on the south side being the lowest).
 * Measured: nave and transept ridges 35.3 (published height 120 ft /
 * 36.6 m, Wikipedia), eaves about 25; aisle roofs from 17.5 at the
 * clerestory to 14.5 at the outer walls; south-west tower's walls 47.8,
 * corner turrets about 49.6, its low pyramid 51; north-west tower 34 (flat), its turrets' caps drawn to 38.6 from the photo.
 *
 * Estimated from Farragutful's photos (scaled between the lidar heights):
 * the rose window (radius 3.6 at 19.5), the front lancets and portal, the
 * aisles' windows (seven bays a side, 2.6 m wide, 4–11.5), the clerestory's
 * paired lancets (18.6–23.4), the transept windows (7 m wide, 9–21), the
 * towers' stages and openings, the turrets.
 *
 * Night: the west front and the towers are floodlit; the windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE): Farragutful, CC BY-SA 4.0:
 *  - Holy Cross Cathedral - Boston 01.jpg (the west front and towers)
 *    https://commons.wikimedia.org/wiki/File:Holy_Cross_Cathedral_-_Boston_01.jpg
 *  - Holy Cross Cathedral - Boston 03.jpg (a transept and the east end)
 *    https://commons.wikimedia.org/wiki/File:Holy_Cross_Cathedral_-_Boston_03.jpg
 *  - Holy Cross Cathedral - Boston 04.jpg (the south side square on)
 *    https://commons.wikimedia.org/wiki/File:Holy_Cross_Cathedral_-_Boston_04.jpg
 *  - Holy Cross Cathedral - Boston 05.jpg (the apse and east end)
 *    https://commons.wikimedia.org/wiki/File:Holy_Cross_Cathedral_-_Boston_05.jpg
 * Published facts: Wikipedia, "Cathedral of the Holy Cross (Boston)"
 * (120 ft tall, 364 ft long; puddingstone and limestone; the towers never
 * completed). No commercial imagery.
 *
 * Doubts: the north side is drawn as the mirror of the south. The apse's
 * chapels and the sacristies are simplified into the three-sided apse; the
 * tracery is reduced to a mullion or two; the small dormers on the roof
 * and the gables' pinnacles are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, gableRoof, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { prism } from './atl-flatiron-building'

const stone = new Part(), lime = new Part(), slate = new Part(), win = new Part(), door = new Part()

type F = [XY, XY]
const faces = (x0: number, x1: number, y0: number, y1: number) => ({
  W: [[x0, y1], [x0, y0]] as F, E: [[x1, y0], [x1, y1]] as F,
  S: [[x0, y0], [x1, y0]] as F, N: [[x1, y1], [x0, y1]] as F,
})
const flen = (f: F) => Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])

/** A pointed (equilateral) arch: width w centred at s, from z0, springing at zs. */
function pointed(s: number, w: number, z0: number, zs: number, seg = 5): [number, number][] {
  const r = w, pts: [number, number][] = [[s - w / 2, z0], [s + w / 2, z0]]
  const a1 = Math.acos(0.5) // the apex angle seen from either centre
  for (let i = 0; i <= seg; i++) { // right side, centred on the left jamb
    const a = (a1 * i) / seg
    pts.push([s - w / 2 + r * Math.cos(a), zs + r * Math.sin(a)])
  }
  for (let i = seg - 1; i >= 0; i--) { // left side, centred on the right jamb
    const a = (a1 * i) / seg
    pts.push([s + w / 2 - r * Math.cos(a), zs + r * Math.sin(a)])
  }
  return pts
}
/** A traceried lancet: a limestone surround, the glass, and `n` - 1 mullions. */
function lancet(f: F, s: number, w: number, z0: number, zs: number, n = 1, glass = win) {
  onWall(lime, f[0], f[1], pointed(s, w + 0.6, z0 - 0.3, zs), 0.04)
  onWall(glass, f[0], f[1], pointed(s, w, z0, zs), 0.08)
  for (let k = 1; k < n; k++) {
    const m = s - w / 2 + (w * k) / n
    onWall(lime, f[0], f[1], rectShape(m - 0.09, m + 0.09, z0, zs + 0.2), 0.11)
  }
}
const disc = (s: number, z: number, r: number, n = 16): [number, number][] =>
  Array.from({ length: n }, (_, i) => [s + r * Math.cos((i / n) * Math.PI * 2), z + r * Math.sin((i / n) * Math.PI * 2)] as [number, number])

const NX0 = -45.8, NX1 = 44, NY0 = -11, NY1 = 5, NE = 25, NR = 35.3, AX = (NY0 + NY1) / 2
const TX0 = 15, TX1 = 30.4, TY0 = -25.9, TY1 = 20.8

// ── Nave and chancel: walls, clerestory, steep slate roof ──
box(stone, NX0, NX1, NY0, NY1, 0, NE, null, 0)
gableRoof(slate, stone, NX0, NX1, NY0, NY1, NE, NR, 'x', 0.5, 0.3)
// the cross on the west gable
box(lime, NX0 - 0.1, NX0 + 0.25, AX - 0.12, AX + 0.12, NR, NR + 2.4, lime, 0)
box(lime, NX0 - 0.1, NX0 + 0.25, AX - 0.7, AX + 0.7, NR + 1.4, NR + 1.7, lime, 0)

// ── The apse: three sides, its roof hipped up to the ridge ──
{
  const ring: XY[] = [[NX1, NY0], [48.5, NY0 + 4], [48.5, NY1 - 5], [NX1, NY1]]
  prism(stone, [...ring, [NX1 - 0.5, AX]] as XY[], 0, NE, null, 0)
  const R: V3 = [NX1 - 1.5, AX, NR], o = 0.5
  const out: XY[] = [[NX1, NY0 - o], [48.5 + o, NY0 + 4 - o * 0.4], [48.5 + o, NY1 - 5], [NX1, NY1 + o]]
  for (let i = 0; i < 3; i++) slate.tri([out[i][0], out[i][1], NE - 0.3], [out[i + 1][0], out[i + 1][1], NE - 0.3], R)
  for (let i = 0; i < 3; i++) {
    const a = ring[i], b = ring[i + 1]
    lancet([a, b], Math.hypot(b[0] - a[0], b[1] - a[1]) / 2, 2.4, 13.5, 20.5, 2)
    lancet([a, b], Math.hypot(b[0] - a[0], b[1] - a[1]) / 2, 2.0, 4, 9.5, 2)
  }
}

// ── Aisles: lean-to slate roofs, buttresses, big traceried windows ──
const AE = 14.5, AR = 17.5
for (const [y0, y1, outer] of [[NY1, 12.5, 1], [-17.5, NY0, -1]] as [number, number, number][]) {
  // north of the chancel stands a separate building (way/29571795); no aisle there
  for (const [x0, x1] of (outer > 0 ? [[-33, TX0]] : [[-33, TX0], [TX1, NX1]])) {
    box(stone, x0, x1, y0, y1, 0, AE, null, 0)
    // the lean-to: from the clerestory wall down to the outer wall
    const yi = outer > 0 ? y0 : y1, yo = outer > 0 ? y1 + 0.5 : y0 - 0.5
    const a: V3 = [x0, yi, AR], b: V3 = [x1, yi, AR], c: V3 = [x1, yo, AE - 0.3], d: V3 = [x0, yo, AE - 0.3]
    // wound to face up and outward (north aisle +y, south aisle -y)
    if (outer > 0) slate.quad(a, b, c, d)
    else slate.quad(a, d, c, b)
    // end triangles in stone
    const e0: V3 = [x0, yi, AE], e1: V3 = [x1, yi, AE]
    const t0: V3 = [x0, yo, AE - 0.3], t1: V3 = [x1, yo, AE - 0.3]
    stone.tri(...((outer > 0 ? [e0, a, t0] : [e0, t0, a]) as [V3, V3, V3]))
    stone.tri(...((outer > 0 ? [e1, t1, b] : [e1, b, t1]) as [V3, V3, V3]))
    // windows and buttresses on the outer wall
    const f = outer > 0 ? faces(x0, x1, y0, y1).N : faces(x0, x1, y0, y1).S
    const L = flen(f), bays = Math.max(1, Math.round(L / 6.6)), bw = L / bays
    for (let k = 0; k < bays; k++) lancet(f, bw * (k + 0.5), 2.6, 4.0, 10.0, 3)
    for (let k = 0; k <= bays; k++) {
      const x = outer > 0 ? x1 - bw * k : x0 + bw * k, yb = outer > 0 ? y1 : y0
      box(lime, x - 0.45, x + 0.45, Math.min(yb, yb + outer * 1.1), Math.max(yb, yb + outer * 1.1), 0, AE - 1.5, lime, 0.25)
    }
    // the clerestory's paired lancets above the aisle roof
    const cf = outer > 0 ? faces(x0, x1, NY0, NY1).N : faces(x0, x1, NY0, NY1).S
    const cs = outer > 0 ? x1 : x0
    for (let k = 0; k < bays; k++) {
      const xm = outer > 0 ? x0 + bw * (k + 0.5) : x0 + bw * (k + 0.5)
      for (const d of [-0.8, 0.8]) {
        const s = outer > 0 ? cs - xm + d : xm - cs + d
        lancet([cf[0], cf[1]] as F, outer > 0 ? s : s, 1.0, 18.6, 22.6)
      }
    }
  }
}

// ── Transepts ──
box(stone, TX0, TX1, TY0, TY1, 0, NE, null, 0)
gableRoof(slate, stone, TX0, TX1, TY0, TY1, NE, NR, 'y', 0.5, 0.3)
{
  const F4 = faces(TX0, TX1, TY0, TY1)
  for (const g of [F4.N, F4.S]) {
    const L = flen(g)
    lancet(g, L / 2, 7.0, 9.0, 18.0, 4)
    onWall(door, g[0], g[1], pointed(L / 2, 2.6, 0, 3.6), 0.06)
    // corner buttresses in limestone
    for (const s of [0.4, L - 0.4]) onWall(lime, g[0], g[1], rectShape(s - 0.6, s + 0.6, 0, NE + 1.5), 0.3)
  }
  // the transepts' side walls: two big lancets each side of the aisles
  for (const g of [F4.W, F4.E]) {
    const L = flen(g)
    for (const s of [3.4, L - 3.4]) lancet(g, s, 2.4, 12.0, 19.0, 2)
  }
}

// ── The west front between the towers ──
{
  const W = faces(NX0, NX1, NY0, NY1).W, L = flen(W), m = L / 2
  onWall(lime, W[0], W[1], disc(m, 19.5, 4.1, 20), 0.05)
  onWall(win, W[0], W[1], disc(m, 19.5, 3.5, 20), 0.1)
  for (let k = 0; k < 8; k++) { // the rose's spokes
    const a = (k / 8) * Math.PI
    const c = Math.cos(a), s = Math.sin(a)
    onWall(lime, W[0], W[1], [[m - 3.5 * c - 0.1 * s, 19.5 - 3.5 * s + 0.1 * c], [m + 3.5 * c - 0.1 * s, 19.5 + 3.5 * s + 0.1 * c], [m + 3.5 * c + 0.1 * s, 19.5 + 3.5 * s - 0.1 * c], [m - 3.5 * c + 0.1 * s, 19.5 - 3.5 * s - 0.1 * c]], 0.13)
  }
  onWall(lime, W[0], W[1], pointed(m, 9.4, 14.6, 19.0, 6), 0.03)
  onWall(stone, W[0], W[1], pointed(m, 8.8, 14.9, 19.0, 6), 0.035)
  for (const d of [-2.4, -0.8, 0.8, 2.4]) lancet(W, m + d, 1.0, 9.6, 12.8)
  // the portal: a deep pointed arch with the doors
  onWall(lime, W[0], W[1], pointed(m, 5.6, 0, 5.4, 6), 0.05)
  onWall(stone, W[0], W[1], pointed(m, 4.6, 0, 5.3, 6), 0.08)
  onWall(door, W[0], W[1], pointed(m, 3.6, 0, 4.8, 6), 0.11)
  // limestone buttresses at the gable's corners and a coping up the rakes
  for (const s of [0.5, L - 0.5]) onWall(lime, W[0], W[1], rectShape(s - 0.7, s + 0.7, 0, NE + 1.0), 0.35)
}

// ── Towers ──
function tower(x0: number, x1: number, y0: number, y1: number, top: number, stages: { z0: number; zs: number; n: number; w: number }[]) {
  box(stone, x0, x1, y0, y1, 0, top, slate, 0.2)
  const c = 1.1, o = 0.35
  // limestone corner buttresses, stepping in near the top
  for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] as XY[]) {
    const sx = x === x0 ? 1 : -1, sy = y === y0 ? 1 : -1
    box(lime, Math.min(x - sx * o, x + sx * c), Math.max(x - sx * o, x + sx * c), Math.min(y - sy * o, y + sy * c), Math.max(y - sy * o, y + sy * c), 0, top - 6, lime, 0.15)
    box(lime, Math.min(x, x + sx * c), Math.max(x, x + sx * c), Math.min(y, y + sy * c), Math.max(y, y + sy * c), top - 6, top + 1.8, lime, 0.15)
  }
  // string courses between the stages
  for (const st of stages) for (const g of Object.values(faces(x0, x1, y0, y1))) onWall(lime, g[0], g[1], rectShape(0, flen(g), st.z0 - 1.0, st.z0 - 0.6), 0.15)
  for (const g of Object.values(faces(x0, x1, y0, y1))) {
    const L = flen(g)
    for (const st of stages) {
      for (let k = 0; k < st.n; k++) lancet(g, L / 2 + (k - (st.n - 1) / 2) * (st.w + 0.8), st.w, st.z0, st.zs)
    }
  }
}
tower(-46, -34.5, -22, -10.5, 47.8, [
  { z0: 13.0, zs: 15.6, n: 1, w: 1.3 },
  { z0: 26.0, zs: 29.4, n: 3, w: 1.0 },
  { z0: 33.4, zs: 35.2, n: 2, w: 1.0 },
  { z0: 39.0, zs: 44.4, n: 2, w: 1.5 },
])
// its low pyramid roof inside the parapet
revolve(slate, [-40.25, -16.25], [[5.4, 47.6], [0, 51]], 4, Math.PI / 4, true, false)
// the north-west tower with its two slate-capped turrets on the front
tower(-42.5, -33, 5.8, 16.2, 33.5, [
  { z0: 13.0, zs: 15.6, n: 1, w: 1.2 },
  { z0: 23.5, zs: 27.0, n: 2, w: 1.0 },
])
for (const y of [6.6, 15.4]) {
  box(stone, -43.4, -41.6, y - 0.9, y + 0.9, 0, 35.3, null, 0)
  revolve(slate, [-42.5, y], [[1.35, 35.1], [0, 38.6]], 4, Math.PI / 4, true, false)
}

// ── Night: the west front and the towers floodlit ──
const lit = (p: V3, n: V3) => {
  if (n[2] > 0.7) return 0.1
  if (p[0] < -32) return 0.85
  return 0.1
}
await save('bos-cathedral-holy-cross', 'Cathedral of the Holy Cross', [
  { part: stone, material: { ...finish('holycross-puddingstone', 0xb3a591), floodlight: lit } },
  { part: lime, material: { ...finish('holycross-limestone', 0xe6dcc8), floodlight: lit } },
  { part: slate, material: finish('holycross-slate', 0x6d747b) },
  { part: win, material: PALETTE.window },
  { part: door, material: { ...PALETTE.entrance, color: 0x6b5140 } },
], { height: 51, anchor: [42.34077, -71.06953], bearing: 22.5 }, 6500)
