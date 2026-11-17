/**
 * Janss Steps (1929), UCLA, Westwood — original procedural geometry,
 * CC0-1.0.
 *
 *   bun generators/la-janss-steps.ts
 *
 * The 87-step brick staircase that climbs the hill from the lower campus
 * (Wilson Plaza) to the quad between Royce Hall and Powell Library: three
 * flights of red brick treads between cast-stone cheek walls, a long gently
 * stepped landing between the first and second flights, a short landing
 * before the last, square stone piers at every change, the stone
 * balustrade along the hilltop at the head of the stairs, and the lamp
 * posts that line both sides.
 *
 * Frame: x east, y north, z up, metres, bearing 0 (the steps run due east,
 * uphill, along OSM way/179397901 and its continuations). Origin on the
 * stairs' centre line half-way between the foot and the head, z = 0 at the
 * foot of the first flight, the lowest ground under the footprint. The
 * model is a real stepped solid: every riser and tread is modelled, set to
 * the ground the lidar measures along the stair, so it follows the hill
 * (see "Terrain" below).
 *
 * Evidence
 * - Plan: OSM ways 1528954541 (first flight, x -49.5..-35.0 from
 *   -118.44300, 34.07220), 1528954542 (landing), 1528954543 (second
 *   flight), 1528954544 (landing) and 179397901 (third flight, to x 12.2),
 *   all on y = -0.5. Those ways are lines (highway=steps / footway), not
 *   areas, and OSM maps no building here, so `replaces` is empty.
 * - Heights: USGS 3DEP lidar USGS_LPC_CA_LosAngeles_2016_LAS_2018 (2016
 *   flight), ground returns along the centre line (0.5 m grid): foot
 *   122.9 m, top of the first flight +4.6, top of the long landing +6.0,
 *   second flight to +9.8, flat landing, top +13.6 m. The lidar sits about
 *   1.5 m east of OSM here (as at Powell Library); the flight ends follow
 *   OSM, the heights follow lidar. Riser count: published, 87 steps
 *   (Wikipedia, "Janss Steps"); split 29 / 9 / 25 / 24 in proportion to
 *   the measured rise of each run (risers 0.15–0.16 m).
 * - Photos (Wikimedia Commons), compared with renders from the same side:
 *   j1 "Janss Steps, UCLA.jpg" (b r e n t, CC BY 2.0) — from the foot,
 *      looking east up all three flights;
 *   j2 "Janss Steps, Royce Hall in background, UCLA.jpg" (b r e n t,
 *      CC BY 2.0) — from the south-west, the cheek walls and piers;
 *   j3 "Janss Steps.jpg" (Kris Huynh, CC BY 2.0) — from the plaza at the
 *      foot: brick treads, stone cheeks and the top balustrade;
 *   j4 "View looking down Janss Steps towards soccer field, UCLA.jpg"
 *      (Neeta Lind, CC BY 2.0) — from the head, the long landing below;
 *   j5 "View of Wilson Plaza from Janss Steps, UCLA.jpg" (Simon Cobb, CC0);
 *   p10 "Powell Library overlooking Janss Steps, UCLA.jpg" (Andy Dietler,
 *      CC BY-SA 2.0) — the upper flights, the balustrade and lamp posts
 *      from the north-west.
 * - Landings: brick like the flights (j1, j2); stone only in the cheek
 *   walls, piers and balustrade.
 * - Colour: sampled from j3 and p10 (sunlit brick treads, buff cast stone),
 *   pulled to the palette's lightness; the stone matches Royce Hall's and
 *   Powell Library's cast stone.
 *
 * Measured: the rise of each run, the landing levels (lidar). From OSM: the
 * run positions. Estimated: the stair width (8.6 m between cheeks, from the
 * people on the flights in j1), the cheek walls (0.5 m thick, 0.75 m over
 * the nosings), pier sizes, the balustrade's length along the hilltop
 * (about 7 m each side), the lamp spacing (photos). Left out: the paving
 * of the plaza at the foot and the hilltop (ground), the benches and bins,
 * the flagpole.
 *
 * Terrain: Mapterhorn under the centre line follows the measured stair
 * within 0.3 m (0.1 m at the foot, 4.3 at x -16, 5.8 at 0, 9.8 at 16, 13.6
 * at the head), so the treads sit on the drawn ground and the cheek walls
 * stand 0.75 m above it; their outer faces run 2 m below the stair line so
 * nothing floats where the lawn dips beside them.
 *
 * Doubts: the long landing's broad steps (the lidar shows a steady 1.4 m
 * rise over 19 m; drawn as nine 2.1 m treads); which side of the flagpole
 * the balustrade stops.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { finish } from './palette'

const brick = new Part(), stone = new Part(), post = new Part(), lamp = new Part()

const unit = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  p.tri(a, c, d, undefined, undefined, undefined, [n, n, n])
}
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const c = (x: number, y: number, z: number): V3 => [x, y, z]
  quadN(p, c(x0, y0, z0), c(x1, y0, z0), c(x1, y0, z1), c(x0, y0, z1), [0, -1, 0])
  quadN(p, c(x1, y0, z0), c(x1, y1, z0), c(x1, y1, z1), c(x1, y0, z1), [1, 0, 0])
  quadN(p, c(x1, y1, z0), c(x0, y1, z0), c(x0, y1, z1), c(x1, y1, z1), [0, 1, 0])
  quadN(p, c(x0, y1, z0), c(x0, y0, z0), c(x0, y0, z1), c(x0, y1, z1), [-1, 0, 0])
  quadN(p, c(x0, y0, z1), c(x1, y0, z1), c(x1, y1, z1), c(x0, y1, z1), [0, 0, 1])
}

// ---------------------------------------------------------------------------
// The runs, foot to head: [x0, x1, z0, z1, risers]

type Run = { x0: number; x1: number; z0: number; z1: number; n: number; p: Part }
const RUNS: Run[] = [
  { x0: -31.0, x1: -16.5, z0: 0, z1: 4.6, n: 29, p: brick },
  { x0: -16.5, x1: 2.6, z0: 4.6, z1: 6.0, n: 9, p: brick },
  { x0: 2.6, x1: 14.6, z0: 6.0, z1: 9.8, n: 25, p: brick },
  { x0: 14.6, x1: 18.7, z0: 9.8, z1: 9.8, n: 0, p: brick },
  { x0: 18.7, x1: 30.7, z0: 9.8, z1: 13.6, n: 24, p: brick },
]
const HEAD = 30.7, TOP = 13.6
const HW = 4.3 // half the tread width, between the cheek walls
const CW = 0.5 // cheek wall thickness

/** The stair line: the nosing height at x. */
function line(x: number) {
  for (const r of RUNS) if (x >= r.x0 && x <= r.x1) return r.z0 + ((r.z1 - r.z0) * (x - r.x0)) / (r.x1 - r.x0)
  return x < RUNS[0].x0 ? 0 : TOP
}

// ---- treads and risers (split across the width so no face spans more than 4.3 m)
for (const r of RUNS) {
  const steps = Math.max(1, r.n)
  const t = (r.x1 - r.x0) / steps, h = r.n ? (r.z1 - r.z0) / r.n : 0
  for (let i = 0; i < steps; i++) {
    const xa = r.x0 + i * t, xb = xa + t, zb = r.z0 + (i + 1) * h, za = zb - h
    for (const [y0, y1] of [[-HW, 0], [0, HW]]) {
      if (h > 0) quadN(r.p, [xa, y0, za], [xa, y1, za], [xa, y1, zb], [xa, y0, zb], [-1, 0, 0])
      // long treads are split along the run as well (landings)
      const k = Math.ceil(t / 4.2)
      for (let j = 0; j < k; j++) {
        const x0 = xa + (t * j) / k, x1 = xa + (t * (j + 1)) / k
        quadN(r.p, [x0, y0, zb], [x1, y0, zb], [x1, y1, zb], [x0, y1, zb], [0, 0, 1])
      }
    }
  }
}

// ---- cheek walls: sloped copings 0.75 m over the stair line, faces 2 m below it
const WALL_H = 0.75, DROP = 2.0
const breaks = [RUNS[0].x0 + 0.6, ...RUNS.slice(1).map((r) => r.x0), HEAD - 0.6]
for (const side of [-1, 1]) {
  const yi = side * HW, yo = side * (HW + CW)
  for (let b = 0; b < breaks.length - 1; b++) {
    const xa = breaks[b] + 0.6, xb = breaks[b + 1] - 0.6
    if (xb - xa < 0.1) continue
    const k = Math.ceil((xb - xa) / 4)
    for (let j = 0; j < k; j++) {
      const x0 = xa + ((xb - xa) * j) / k, x1 = xa + ((xb - xa) * (j + 1)) / k
      const t0 = line(x0) + WALL_H, t1 = line(x1) + WALL_H
      const b0 = Math.max(0, line(x0) - DROP), b1 = Math.max(0, line(x1) - DROP)
      const out: V3 = [0, side, 0], inn: V3 = [0, -side, 0]
      quadN(stone, [x0, yo, b0], [x1, yo, b1], [x1, yo, t1], [x0, yo, t0], out)
      quadN(stone, [x0, yi, b0], [x1, yi, b1], [x1, yi, t1], [x0, yi, t0], inn)
      const up = unit([-(t1 - t0), 0, x1 - x0])
      quadN(stone, [x0, yi, t0], [x1, yi, t1], [x1, yo, t1], [x0, yo, t0], up)
      // a coping lip along the outside of the wall
      quadN(stone, [x0, yo + side * 0.08, t0 - 0.18], [x1, yo + side * 0.08, t1 - 0.18], [x1, yo + side * 0.08, t1], [x0, yo + side * 0.08, t0], out)
      quadN(stone, [x0, yo, t0 - 0.18], [x1, yo, t1 - 0.18], [x1, yo + side * 0.08, t1 - 0.18], [x0, yo + side * 0.08, t0 - 0.18], [0, 0, -1])
      quadN(stone, [x0, yo, t0], [x1, yo, t1], [x1, yo + side * 0.08, t1], [x0, yo + side * 0.08, t0], up)
    }
  }
  // ---- piers at the foot, at every change of run and at the head
  for (const x of breaks) {
    const z = Math.max(line(x - 0.6), line(x + 0.6))
    const big = x === breaks[0]
    const w = big ? 0.75 : 0.6, y0 = side > 0 ? HW - 0.05 : -HW - CW - (big ? 0.6 : 0.5), y1 = side > 0 ? HW + CW + (big ? 0.6 : 0.5) : -HW + 0.05
    const zt = z + (big ? 1.25 : 1.5)
    box(stone, x - w, y0, x + w, y1, Math.max(0, line(x - w) - DROP), zt)
    box(stone, x - w - 0.1, y0 - 0.1, x + w + 0.1, y1 + 0.1, zt, zt + 0.18)
    box(stone, x - w + 0.15, y0 + 0.15, x + w - 0.15, y1 - 0.15, zt + 0.18, zt + 0.3)
  }
}

// ---- the balustrade along the hilltop, either side of the head
{
  const x = HEAD - 0.6, z = TOP
  for (const side of [-1, 1]) {
    const ya = side * (HW + CW + 0.5), yb = side * (HW + CW + 7.5)
    const y0 = Math.min(ya, yb), y1 = Math.max(ya, yb)
    box(stone, x - 0.3, y0, x + 0.3, y1, z - 2.0, z + 0.22) // plinth, run down past the drawn ground
    box(stone, x - 0.32, y0, x + 0.32, y1, z + 0.86, z + 1.02) // rail
    const n = Math.round((y1 - y0) / 0.42)
    for (let k = 0; k < n; k++) {
      const y = y0 + ((y1 - y0) * (k + 0.5)) / n
      box(stone, x - 0.09, y - 0.09, x + 0.09, y + 0.09, z + 0.22, z + 0.86)
    }
    // end pier
    const ye = side * (HW + CW + 7.5)
    box(stone, x - 0.45, ye - 0.45, x + 0.45, ye + 0.45, z - 2.0, z + 1.3)
    box(stone, x - 0.55, ye - 0.55, x + 0.55, ye + 0.55, z + 1.3, z + 1.45)
  }
}

// ---- lamp posts in the lawn on both sides
for (const side of [-1, 1]) {
  for (const x of [-26.5, -18.5, -9.0, 0.0, 8.5, 16.6, 24.5]) {
    const y = side * (HW + CW + 1.9), z = line(x)
    // slender dark poles, as in j1/j2: a small base, a 0.18 m shaft, the globe at 4 m
    box(post, x - 0.175, y - 0.175, x + 0.175, y + 0.175, Math.max(0, z - 1.5), z + 0.4) // base
    box(post, x - 0.09, y - 0.09, x + 0.09, y + 0.09, z + 0.4, z + 3.75) // shaft
    // the globe, as a squat bead
    const c: V3 = [x, y, z + 4.0], r = 0.3, h = 0.3
    const ring: V3[] = Array.from({ length: 6 }, (_, i) => [x + r * Math.cos((i * Math.PI) / 3), y + r * Math.sin((i * Math.PI) / 3), c[2]])
    for (let i = 0; i < 6; i++) {
      const a = ring[i], b = ring[(i + 1) % 6], top: V3 = [x, y, c[2] + h], bot: V3 = [x, y, c[2] - h]
      const mid = [(a[0] + b[0]) / 2 - x, (a[1] + b[1]) / 2 - y]
      lamp.tri(a, b, top, undefined, undefined, undefined, [unit([mid[0], mid[1], 0.6]), unit([mid[0], mid[1], 0.6]), unit([mid[0], mid[1], 0.6])])
      lamp.tri(b, a, bot, undefined, undefined, undefined, [unit([mid[0], mid[1], -0.6]), unit([mid[0], mid[1], -0.6]), unit([mid[0], mid[1], -0.6])])
    }
  }
}

if (import.meta.main) {
  const parts: { part: Part; material: MaterialSpec }[] = [
    { part: brick, material: finish('janss-brick', 0xbd7860) },
    { part: stone, material: finish('janss-stone', 0xe8d8bd) },
    { part: post, material: finish('iron', 0x4a4f57) },
    { part: lamp, material: finish('lamp', 0xe9e4d6) },
  ]
  const tris = parts.reduce((s, { part }) => s + part.triangles, 0)
  const glb = writeGlb('Janss Steps', parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the lowest ground', bearing: 0, elevation: 0, height: 15.9, replaces: [] })
  console.log(`la-janss-steps: ${tris} triangles, ${glb.length} bytes; ` + parts.map(({ part, material }) => `${material.name} ${part.triangles}`).join(', '))
  if (tris > 5000 || glb.length > 250 * 1024) throw new Error('over budget')
  Bun.write(new URL('../models/la-janss-steps.glb', import.meta.url).pathname, glb)
}
