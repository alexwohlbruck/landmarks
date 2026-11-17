/**
 * ArcelorMittal Orbit, Queen Elizabeth Olympic Park, Stratford — original
 * procedural geometry, CC0-1.0.
 * bun generators/london-arcelormittal-orbit.ts
 * writes models/london-arcelormittal-orbit.glb (low) and
 * models/london-arcelormittal-orbit.detail.glb (the red tubes opened into
 * full lattices, the slide's tight coils, finer stair and hoop).
 *
 * Map frame, unturned (BEARING 0): +x east, +y north, z up, metres. Origin =
 * centroid of the OSM outline way/149637725, on the plaza.
 *
 * What it is: Anish Kapoor and Cecil Balmond's 2012 sculpture-tower. A red
 * steel lattice tube (octagonal rings 4 m apart, diagonal connectors) loops
 * round a central column that carries the lifts and a 455-step stair clad in
 * silver mesh, up to a two-level observation "doughnut" under a large thin
 * red hoop, with a hairpin loop standing over the top and a second loop
 * jutting out west-north-west at 60–75 m. Since 2016 a 178 m stainless tunnel
 * slide (Carsten Höller) winds down from the platform: a run across the
 * south, tight corkscrew coils on the west side, wide turns round the column
 * and a long straight run out to the south-east.
 *
 * Evidence
 * - OSM way/149637725 (building=yes, man_made=tower, height 114.5,
 *   wikidata Q631871): the tripod's footprint, about 41 × 42 m, lobes at the
 *   south-west, east/south-east and north-east, which is where the feet go.
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (pre-2016 flight: no slide in it). Ground flat, 3.2–3.9 m above
 *   ground_min (6.8 m AOD). Top 116.0 m above ground_min at (-4, 4) = 112.6 m
 *   above the plaza; high points of the top loop run from (3, 11) at ~95 m
 *   over (-4, 3) to (-15, -4)/(-17, -6) at 105–92 m, so the top loop stands in
 *   a vertical plane running NE–SW. The doughnut's roof reads 88–91 (≈ 86 m
 *   above the plaza) over x -6..8, y -10..10; the west-north-west loop shows
 *   at x ≈ -20, y 12–18 at 55–61 m and round to (-8, 28) at ~72 m.
 * - Published (Wikipedia, "ArcelorMittal Orbit"): 114.5 m; two indoor
 *   viewing levels; trunk 37 m across at the base, narrowing to 5 m and
 *   widening to 9.6 m under the deck; octagonal rings 4 m apart joined by
 *   sixteen diagonals; 455-step stair; 2,000 t of steel; the 2016 slide
 *   178 m long.
 * - Photos (Wikimedia Commons, all EVIDENCE; bearing = from the tower to the
 *   camera):
 *   s189 "ArcelorMittal Orbit - geograph.org.uk - 3372259.jpg", Mr Biz,
 *     CC BY-SA 2.0 (2013, 457 m, level): the whole silhouette — doughnut
 *     75–89 m, lift housing to 94 m, hoop at ~81 m, loop legs 19 m apart,
 *     west loop to 24 m out at 65–73 m, east lobe at 37–52 m, base 32 m wide;
 *   p5 "ArcelorMittal Orbit and access to the stadium - geograph.org.uk -
 *     5077128.jpg", David Smith, CC BY-SA 2.0 (2016, 195°, 300 m): the same
 *     with the slide; stair bands every ~11.5 m, 14 m across;
 *   p4 "ArcelorMittal Orbit - geograph.org.uk - 6402523.jpg", Ian S,
 *     CC BY-SA 2.0 (2020, 184°, 35 m): slide coils on the west, its last run
 *     out to the east, the splayed east foot;
 *   p3 "ArcelorMittal Orbit, Queen Elizabeth Olympic Park - geograph.org.uk -
 *     6559856.jpg", Oast House Archive, CC BY-SA 2.0 (2020, 162°, close): the
 *     lattice — chords, rings, diagonals; slide coils; stair cladding;
 *   n336 "ArcelorMittal Orbit - geograph.org.uk - 6220805.jpg", Ian Capper,
 *     CC BY-SA 2.0 (2019, 336°, 377 m): the top loop broad on the west, the
 *     east lobe low on the left;
 *   e61 "ArcelorMittal Orbit, Olympic Park - geograph.org.uk - 7405842.jpg",
 *     Bryn Holmes, CC BY-SA 2.0 (2020, 61°, 207 m): the top loop edge-on;
 *   p2 "ArcelorMittal Orbit from Victoria Park 2024-08-02.jpg", Matt Brown,
 *     CC BY 2.0 (284°, 1.6 km): the top loop face-on over the trees;
 *   p1 "ArcelorMittal Orbit 08112025 (1).jpg", Timmy96, CC0: hoop, doughnut
 *     underside, slide coils, from below;
 *   p6 "ArcelorMittal Orbit 2015.jpg", Barney Moss, CC BY 2.0: at night, the
 *     red lattice floodlit, stair bands lit;
 *   p7 "Orbit2.jpg", Danesman1, CC BY-SA 3.0: the base canopy cone
 *     (weathering steel) inside the feet.
 *
 * Measured: overall height and the top loop's plan (lidar), platform heights
 * (photo s189 scaled to 114.5 m), the hoop and loop spans (s189, p5).
 * Published: 114.5 m, trunk widths, slide length. Estimated: the 3D path of
 * every red loop below the platform — drawn as one smooth spline through
 * control points chosen so that the silhouettes from 189°, 195°, 336° and 61°
 * match the photos; the true member-by-member lattice is not reproduced. The
 * lattice tube is drawn 4.2 m across (rings ~4.5 m in reality), members
 * 0.5–0.6 m (real ~0.4–0.8 m). The slide's path is traced from p4, p5 and
 * p1; its turns are fewer than the real one's. The hoop's 10° tilt (p5).
 * Lead review pass: the lift core is no longer drawn as a grey mast (the
 * red cage is the column); the loops below 72 m are pulled in to 74 % of
 * their traced radius so the trunk reads narrow as in s189; the doughnut is a
 * wider, flatter disc (lower level 28.4 m across, 75–84.8 m), hoop 36 m.
 * Doubts: no aerial photo; the lidar is pre-slide and a lattice reads
 * noisily in a 1 m DSM. Which tube passes in front of which below 40 m is
 * simplified.
 */
import { writeFileSync } from 'node:fs'
import { Part, writeGlb, cross, sub, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'

const ID = 'london-arcelormittal-orbit'

// ---------------------------------------------------------------- vectors
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scl = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const nrm = (a: V3): V3 => scl(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1))
const dist = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])

/** Centripetal Catmull-Rom through the points, resampled every `step` metres. */
function spline(ctrl: V3[], step: number, closed = false): V3[] {
  const P = closed ? [ctrl[ctrl.length - 1], ...ctrl, ctrl[0], ctrl[1]] : [add(ctrl[0], sub(ctrl[0], ctrl[1])), ...ctrl, add(ctrl[ctrl.length - 1], sub(ctrl[ctrl.length - 1], ctrl[ctrl.length - 2]))]
  const dense: V3[] = []
  for (let i = 1; i < P.length - 2; i++) {
    const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]]
    const t0 = 0, t1 = t0 + Math.sqrt(dist(p0, p1)), t2 = t1 + Math.sqrt(dist(p1, p2)), t3 = t2 + Math.sqrt(dist(p2, p3))
    const N = 40
    for (let k = 0; k < N; k++) {
      const t = t1 + ((t2 - t1) * k) / N
      const L = (a: V3, b: V3, ta: number, tb: number): V3 => add(scl(a, (tb - t) / (tb - ta)), scl(b, (t - ta) / (tb - ta)))
      const A1 = L(p0, p1, t0, t1), A2 = L(p1, p2, t1, t2), A3 = L(p2, p3, t2, t3)
      const B1 = L(A1, A2, t0, t2), B2 = L(A2, A3, t1, t3)
      dense.push(L(B1, B2, t1, t2))
    }
  }
  dense.push(closed ? ctrl[0] : ctrl[ctrl.length - 1])
  return resample(dense, step)
}

function resample(pts: V3[], step: number): V3[] {
  const acc = [0]
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + dist(pts[i], pts[i - 1]))
  const total = acc[acc.length - 1], n = Math.max(1, Math.round(total / step)), out: V3[] = []
  let k = 1
  for (let i = 0; i <= n; i++) {
    const s = (total * i) / n
    while (k < pts.length - 1 && acc[k] < s) k++
    const t = (s - acc[k - 1]) / (acc[k] - acc[k - 1] || 1)
    out.push(add(pts[k - 1], scl(sub(pts[k], pts[k - 1]), t)))
  }
  return out
}

const pathLength = (p: V3[]) => p.slice(1).reduce((s, q, i) => s + dist(q, p[i]), 0)

/** Rotation-minimising frames along a path: [tangent, normal, binormal]. */
function frames(path: V3[]): [V3, V3, V3][] {
  const T = path.map((_, i) => nrm(sub(path[Math.min(i + 1, path.length - 1)], path[Math.max(i - 1, 0)])))
  let N = nrm(Math.abs(T[0][2]) > 0.9 ? cross(T[0], [1, 0, 0]) : cross(T[0], [0, 0, 1]))
  const out: [V3, V3, V3][] = []
  for (let i = 0; i < path.length; i++) {
    if (i > 0) {
      N = nrm(sub(N, scl(T[i], dot(N, T[i]))))
    }
    out.push([T[i], N, cross(T[i], N)])
  }
  return out
}

/** A smooth round tube along a path with rotation-minimising frames; capped ends optional. */
function tube(p: Part, path: V3[], r: number | ((i: number) => number), sides: number, caps = false) {
  const F = frames(path)
  const R = typeof r === 'number' ? () => r : r
  const rings = path.map((c, i) => {
    const [, n, b] = F[i]
    return Array.from({ length: sides }, (_, k) => {
      const a = (2 * Math.PI * k) / sides
      const d = add(scl(n, Math.cos(a)), scl(b, Math.sin(a)))
      return { p: add(c, scl(d, R(i))), n: d }
    })
  })
  for (let i = 0; i < rings.length - 1; i++)
    for (let k = 0; k < sides; k++) {
      const j = (k + 1) % sides, a = rings[i], b = rings[i + 1]
      p.tri(a[k].p, b[k].p, b[j].p, undefined, undefined, undefined, [a[k].n, b[k].n, b[j].n])
      p.tri(a[k].p, b[j].p, a[j].p, undefined, undefined, undefined, [a[k].n, b[j].n, a[j].n])
    }
  if (caps)
    for (const [ring, t] of [[rings[0], scl(F[0][0], -1)], [rings[rings.length - 1], F[F.length - 1][0]]] as const) {
      const c = ring.reduce((s, q) => add(s, scl(q.p, 1 / ring.length)), [0, 0, 0] as V3)
      for (let k = 0; k < sides; k++) p.tri(c, ring[k].p, ring[(k + 1) % sides].p, undefined, undefined, undefined, [t, t, t])
    }
}

const rod = (p: Part, a: V3, b: V3, r: number, sides = 4) => tube(p, [a, b], r, sides)

/**
 * The Orbit's lattice tube: `chords` longitudinal members on a circle of
 * radius R, a ring every `ringEvery` bays and a zigzag of diagonals between
 * neighbouring chords — real members with real gaps.
 */
function latticeTube(p: Part, path: V3[], R: number, o: { chords: number; member: number; sides: number; ringEvery: number; diagonals: boolean; twist?: number }) {
  const F = frames(path)
  const at = (i: number, k: number): V3 => {
    const [, n, b] = F[i]
    const a = (2 * Math.PI * k) / o.chords + (o.twist ?? 0) * i
    return add(path[i], add(scl(n, R * Math.cos(a)), scl(b, R * Math.sin(a))))
  }
  for (let k = 0; k < o.chords; k++) tube(p, path.map((_, i) => at(i, k)), o.member, o.sides)
  for (let i = 0; i < path.length; i++) {
    if (o.ringEvery > 0 && i % o.ringEvery === 0)
      for (let k = 0; k < o.chords; k++) rod(p, at(i, k), at(i, k + 1), o.member * 0.8, o.sides)
    if (o.diagonals && i < path.length - 1)
      for (let k = 0; k < o.chords; k++) rod(p, at(i, k + (i % 2)), at(i + 1, k + 1 - (i % 2)), o.member * 0.75, o.sides)
  }
}

/**
 * A surface of revolution about the vertical axis at `c`: `prof` is [r, z]
 * from the bottom up; each profile segment is its own smooth band so creases
 * stay crisp. Faces outward (or inward with `inside`).
 */
function lathe(p: Part, c: [number, number], prof: [number, number][], seg: number, inside = false) {
  for (let s = 0; s < prof.length - 1; s++) {
    const [r0, z0] = prof[s], [r1, z1] = prof[s + 1]
    const dr = r1 - r0, dz = z1 - z0, L = Math.hypot(dr, dz) || 1
    for (let k = 0; k < seg; k++) {
      const a0 = (2 * Math.PI * k) / seg, a1 = (2 * Math.PI * (k + 1)) / seg
      const P = (r: number, z: number, a: number): V3 => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z]
      const Nn = (a: number): V3 => scl([(dz / L) * Math.cos(a), (dz / L) * Math.sin(a), -dr / L], inside ? -1 : 1)
      const q = [P(r0, z0, a0), P(r0, z0, a1), P(r1, z1, a1), P(r1, z1, a0)]
      const n = [Nn(a0), Nn(a1), Nn(a1), Nn(a0)]
      p.tri(q[0], q[1], q[2], undefined, undefined, undefined, [n[0], n[1], n[2]])
      p.tri(q[0], q[2], q[3], undefined, undefined, undefined, [n[0], n[2], n[3]])
    }
  }
}

/** A vertical ribbon along a path, `h` tall, drawn on both sides. */
function ribbon(p: Part, path: V3[], h: number) {
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i], b = path[i + 1]
    const t = nrm(sub(b, a)), out = nrm([t[1], -t[0], 0])
    const a2: V3 = [a[0], a[1], a[2] + h], b2: V3 = [b[0], b[1], b[2] + h]
    const nO = [out, out, out] as V3[], nI = [scl(out, -1), scl(out, -1), scl(out, -1)] as V3[]
    p.tri(a, b, b2, undefined, undefined, undefined, nO)
    p.tri(a, b2, a2, undefined, undefined, undefined, nO)
    p.tri(a, b2, b, undefined, undefined, undefined, nI)
    p.tri(a, a2, b2, undefined, undefined, undefined, nI)
  }
}

// ------------------------------------------------------------- the design
/** The column's axis (under the doughnut, from lidar and the photos). */
const AX: [number, number] = [1, 1.5]
/** Doughnut levels (s189 scaled to 114.5 m). */
const DECK0 = 75, DECK_MID = 79.8, DECK_TOP = 84.8
/** The red hoop: centre, radius, height, tilt (down toward the east-south-east). */
const HOOP = { c: [4.5, -0.5] as [number, number], r: 18, z: 80, tilt: (10 * Math.PI) / 180, dir: (-20 * Math.PI) / 180 }

/**
 * The red lattice tube, one continuous loop from the south-west foot to the
 * top of the doughnut, plus the two other feet's tubes. Control points in
 * the map frame [x east, y north, z up].
 */
const MAIN: V3[] = [
  [-14, -15, 0], // south-west foot
  [-11, -14, 8],
  [-4, -13.5, 17],
  [5, -11.5, 25],
  [12, -6, 33],
  [14.5, 2, 41], // east lobe (s189: 37–52 m, +12 m)
  [12, 9, 49],
  [4, 12.5, 54],
  [-5, 11, 56],
  [-11, 7, 58],
  [-17, 9, 53], // out and down into the west-north-west loop
  [-23, 11, 54.5],
  [-26.5, 13, 61], // its tip (s189, p5: 24 m out, 47–72 m)
  [-24, 15.5, 68.5],
  [-17, 13, 72.5],
  [-11, 7, 74],
  [-16, -1, 79],
  [-18, -6, 87], // top loop, south-west leg
  [-16, -6, 98],
  [-11.5, -3, 107.5],
  [-5.5, 1.5, 112.3], // apex
  [0, 6, 109],
  [3.5, 10, 101],
  [4.5, 11, 93],
  [3, 9, 87.5], // into the doughnut's roof
]
/** The east/south-east foot, wrapping the north of the column. */
const LEG_E: V3[] = [
  [17, -8, 0],
  [14, -5, 9],
  [9, 1, 18],
  [2, 7.5, 26],
  [-6, 8, 33],
  [-11, 2, 40],
  [-10, -6, 47],
  [-3, -10, 53],
  [5, -9, 60],
  [9, -4, 66],
  [8, 2, 71],
  [5, 3, 74.5], // under the deck
]
/** The north-east foot, rising up the west side to the deck. */
const LEG_NE: V3[] = [
  [12, 15, 0],
  [8, 12, 10],
  [1, 10, 17],
  [-7, 6, 22],
  [-12, -1, 28],
  [-9, -8, 35],
  [-1, -10, 40],
  [7, -6, 45],
  [9, 1, 50],
  [5, 8, 55],
  [-2, 7, 61],
  [-6, 2, 67],
  [-4, -3, 72],
  [0, -3, 74.5],
]

/** The 2016 slide, from the deck's south-east down to the exit run (p4, p5, p1). */
function slidePath(detail: boolean): V3[] {
  const pts: V3[] = [
    [9, -7, 75.5],
    [3, -11, 74],
    [-5, -10, 71.5],
    [-10, -6, 69],
  ]
  // Tight corkscrew coils on the west side (p3, p1): radius 2.6 m.
  const cc: [number, number] = [-13, -1.5]
  const coils = 3, top = 66, bot = 55
  for (let i = 0; i <= coils * 8; i++) {
    const t = i / (coils * 8), a = Math.PI * 0.25 + 2 * Math.PI * coils * t
    pts.push([cc[0] + 2.1 * Math.cos(a), cc[1] + 2.1 * Math.sin(a), lerp(top, bot, t)])
  }
  // Wide turns round the column, radius ~11 m, down to 9 m.
  const turns = 1.15, z0 = 49, z1 = 9
  for (let i = 1; i <= turns * 12; i++) {
    const t = i / (turns * 12), a = Math.PI * 0.95 - 2 * Math.PI * turns * t
    const r = 9.5 + 1.5 * Math.sin(Math.PI * t)
    pts.push([AX[0] + r * Math.cos(a), AX[1] + r * Math.sin(a), lerp(z0, z1, t)])
  }
  // The long exit run out to the east-south-east (p4).
  pts.push([16, -10, 5.5], [24, -14, 2.6], [29, -16, 1.6])
  return spline(pts, detail ? 1.2 : 2.6)
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/** The 455-step stair round the column, clad in silver mesh (bands ~11.5 m apart). */
function stairPath(step: number): V3[] {
  const pts: V3[] = [], z0 = 3, z1 = 73, pitch = 11.5, n = Math.ceil(((z1 - z0) / pitch) * (2 * Math.PI * 7) / step)
  for (let i = 0; i <= n; i++) {
    const t = i / n, z = lerp(z0, z1, t), a = Math.PI * 1.2 + (2 * Math.PI * (z - z0)) / pitch
    const r = z < 12 ? 7.9 : 7.4
    pts.push([AX[0] + r * Math.cos(a), AX[1] + r * Math.sin(a), z])
  }
  return pts
}

// ------------------------------------------------------------- materials
const M = {
  red: { ...finish('orbit-red', 0xb3313a, 0.7), floodlight: (q: V3) => (q[2] > 1 ? 0.85 : 0) } as MaterialSpec,
  steel: { ...finish('stainless', 0xc9cdd1, 0.45), floodlight: (q: V3) => (q[2] > 2 ? 0.6 : 0) } as MaterialSpec,
  roof: PALETTE.roof,
  window: PALETTE.window,
  core: finish('core-grey', 0x4f5359, 0.85),
  canopy: finish('weathering-steel', 0x7a4a3c, 0.9),
}

function build(detail: boolean) {
  const red = new Part(), steel = new Part(), roof = new Part(), win = new Part(), core = new Part(), canopy = new Part()

  // Red lattice tubes.
  const bay = detail ? 2.2 : 5.0
  const R = 2.25
  const opt = detail
    ? { chords: 6, member: 0.32, sides: 4, ringEvery: 2, diagonals: true }
    : { chords: 3, member: 0.72, sides: 3, ringEvery: 2, diagonals: true }
  // The lower loops hug the column (photo 189°): pulled in toward the axis
  // below 70 m, so the trunk reads narrow and the top loop is the widest part.
  const hug = (q: V3): V3 => {
    const k = q[2] >= 72 ? 1 : q[2] <= 50 ? 0.74 : lerp(0.74, 1, (q[2] - 50) / 22)
    return [AX[0] + (q[0] - AX[0]) * k, AX[1] + (q[1] - AX[1]) * k, q[2]]
  }
  for (const ctrl of [MAIN, LEG_E, LEG_NE]) latticeTube(red, spline(ctrl.map(hug), bay), R, opt)

  // The central column: a red cage of near-vertical chords round the lift
  // core, 37 m across at the feet, 5 m at the waist, 9.6 m under the deck.
  const cageR = (z: number) => (z < 40 ? lerp(8.5, 3.2, Math.pow(z / 40, 0.7)) : lerp(3.2, 4.8, (z - 40) / 34.5))
  const cageN = detail ? 8 : 6
  for (let k = 0; k < cageN; k++) {
    const pts: V3[] = []
    for (let z = 0; z <= DECK0 + 0.01; z += detail ? 3 : 7.45) {
      const a = (2 * Math.PI * k) / cageN + z * 0.02
      pts.push([AX[0] + cageR(z) * Math.cos(a), AX[1] + cageR(z) * Math.sin(a), z])
    }
    tube(red, pts, detail ? 0.35 : 0.45, detail ? 4 : 3)
  }
  for (let z = 4; z < DECK0; z += detail ? 4 : 9) {
      const ring: V3[] = []
      for (let k = 0; k <= 8; k++) {
        const a = (2 * Math.PI * k) / 8 + z * 0.02
        ring.push([AX[0] + cageR(z) * Math.cos(a), AX[1] + cageR(z) * Math.sin(a), z])
      }
      tube(red, ring, detail ? 0.25 : 0.4, detail ? 4 : 3)
    }
  // (The lift core sits inside the cage and is not drawn: it reads as part of the red column.)

  // Base canopy: the weathering-steel cone inside the feet (p7).
  lathe(canopy, AX, [[7, 0], [6.4, 2.5], [3.2, 8], [1.9, 10]], detail ? 20 : 10)

  // Stair: a silver-mesh band spiralling up the column.
  ribbon(steel, stairPath(detail ? 1.6 : 3.6), 3.2)

  // The doughnut: a flared underside, the lower glazed level, a terrace
  // ring, the upper glazed level, the roof and the lift housing.
  const seg = detail ? 32 : 16
  lathe(roof, AX, [[4.8, 72], [9.5, 73.6], [14.2, DECK0], [14.6, DECK0 + 0.7]], seg)
  lathe(win, AX, [[13.9, DECK0 + 0.7], [13.9, DECK_MID - 0.9]], seg)
  lathe(roof, AX, [[13.9, DECK_MID - 0.9], [14.8, DECK_MID - 0.5], [14.8, DECK_MID], [12.2, DECK_MID + 0.2]], seg)
  lathe(win, AX, [[12, DECK_MID + 0.2], [12, DECK_TOP - 1.2]], seg)
  lathe(roof, AX, [[12, DECK_TOP - 1.2], [12.6, DECK_TOP - 0.6], [11, DECK_TOP], [0, DECK_TOP + 0.2]], seg)
  lathe(core, AX, [[2.3, DECK_TOP], [2.3, 89.5], [1.4, 90.3], [0, 90.3]], detail ? 12 : 8)

  // The hoop: a thin red ring round the deck, tilted, on spokes from the deck.
  const hoop: V3[] = []
  const hn = detail ? 64 : 32
  const tiltZ = (a: number) => HOOP.z - HOOP.r * Math.sin(HOOP.tilt) * Math.cos(a - HOOP.dir)
  for (let k = 0; k <= hn; k++) {
    const a = (2 * Math.PI * k) / hn
    hoop.push([HOOP.c[0] + HOOP.r * Math.cos(a), HOOP.c[1] + HOOP.r * Math.sin(a), tiltZ(a)])
  }
  tube(red, hoop, detail ? 0.45 : 0.6, detail ? 6 : 4)
  const spokes = detail ? 12 : 6
  for (let k = 0; k < spokes; k++) {
    const a = (2 * Math.PI * (k + 0.5)) / spokes
    const rim: V3 = [HOOP.c[0] + HOOP.r * Math.cos(a), HOOP.c[1] + HOOP.r * Math.sin(a), tiltZ(a)]
    const under: V3 = [AX[0] + 6 * Math.cos(a), AX[1] + 6 * Math.sin(a), 71.5]
    const deck: V3 = [AX[0] + 13.9 * Math.cos(a), AX[1] + 13.9 * Math.sin(a), DECK_MID - 0.8]
    rod(red, under, rim, detail ? 0.3 : 0.42, detail ? 4 : 3)
    rod(red, deck, rim, detail ? 0.3 : 0.42, detail ? 4 : 3)
  }

  // The slide (2016), stainless, 1.6 m across.
  const sp = slidePath(detail)
  tube(steel, sp, 0.85, detail ? 10 : 5, true)
  if (detail) {
    // Its hangers to the lattice and column.
    for (let i = 4; i < sp.length - 8; i += 9) {
      const q = sp[i], d = nrm([AX[0] - q[0], AX[1] - q[1], 0])
      rod(steel, add(q, [0, 0, 0.8]), add(q, add(scl(d, 3), [0, 0, 3])), 0.12, 3)
    }
  }

  // Nothing below the plaza: the feet's tube walls are cut off at y = 0.
  // Triangles centred within 0.9 m of the plaza are dropped (they would sit
  // in the terrain's 0.4–0.8 m rise across the footprint).
  for (const q of [red, steel, roof, win, core, canopy]) {
    for (let i = 1; i < q.pos.length; i += 3) q.pos[i] = Math.max(0, q.pos[i])
    if (q === canopy || q === core) continue
    const keep = { pos: [] as number[], nrm: [] as number[], uv: [] as number[] }
    for (let t = 0; t < q.pos.length / 9; t++) {
      if (q.pos[t * 9 + 1] + q.pos[t * 9 + 4] + q.pos[t * 9 + 7] < 3 * 0.9) continue
      keep.pos.push(...q.pos.slice(t * 9, t * 9 + 9))
      keep.nrm.push(...q.nrm.slice(t * 9, t * 9 + 9))
      keep.uv.push(...q.uv.slice(t * 6, t * 6 + 6))
    }
    Object.assign(q, keep)
  }
  return [
    { part: red, material: M.red },
    { part: steel, material: M.steel },
    { part: roof, material: M.roof },
    { part: win, material: M.window },
    { part: core, material: M.core },
    { part: canopy, material: M.canopy },
  ]
}

if (import.meta.main) {
  const extras = { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor' }
  for (const [detail, file] of [[false, `models/${ID}.glb`], [true, `models/${ID}.detail.glb`]] as const) {
    const parts = build(detail)
    const tris = parts.reduce((s, { part }) => s + part.triangles, 0)
    const glb = writeGlb('ArcelorMittal Orbit', parts, extras)
    writeFileSync(new URL(`../${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
  console.log('slide length', pathLength(slidePath(true)).toFixed(0), 'm; main tube', pathLength(spline(MAIN, 1)).toFixed(0), 'm')
}
