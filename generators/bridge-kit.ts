/**
 * A kit for complete suspension bridges: the steel between the towers, which
 * each bridge's generator draws its own towers and anchorages around.
 *
 * Frame: x across the bridge, y along it, z up, metres; y = 0 is midway
 * between the towers and z = 0 the waterline. A bridge model owns the
 * structure inside its OSM `man_made=bridge` outline and leaves every
 * trafficable top surface (roadways, walkways, rail beds) to the map, which
 * draws them from OSM at the heights `Deck.road` gives. So nothing here
 * draws a slab at road level: trusses rise beside the roadways, the
 * underside hangs below them, and the tops stay open.
 *
 * Two levels of detail come out of one description:
 * - low: cables, the girder or truss bands as solid fascias, the soffit;
 * - detail: the same with the trusses opened into chords and lattice, plus
 *   the thin parts the low model drops — suspenders, stays, floor beams,
 *   walkway frames.
 */
import { Part, cross, sub, type V3 } from './mesh'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scale = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const norm = (a: V3): V3 => scale(a, 1 / (Math.hypot(...a) || 1))
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** Evenly spaced numbers from a to b, both included, at most `step` apart. */
export function stations(a: number, b: number, step: number): number[] {
  const n = Math.max(1, Math.ceil(Math.abs(b - a) / step))
  return Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n)
}

/** A piecewise-linear function through [x, y] points, held flat past the ends. */
export function piecewise(points: [number, number][]): (x: number) => number {
  return (x) => {
    if (x <= points[0][0]) return points[0][1]
    for (let i = 1; i < points.length; i++) {
      const [x0, y0] = points[i - 1], [x1, y1] = points[i]
      if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
    }
    return points[points.length - 1][1]
  }
}

/** The parabola through three points, as a function of x. */
export function parabola([x0, y0]: [number, number], [x1, y1]: [number, number], [x2, y2]: [number, number]) {
  return (x: number) =>
    (y0 * (x - x1) * (x - x2)) / ((x0 - x1) * (x0 - x2)) +
    (y1 * (x - x0) * (x - x2)) / ((x1 - x0) * (x1 - x2)) +
    (y2 * (x - x0) * (x - x1)) / ((x2 - x0) * (x2 - x1))
}

/**
 * Ground heights on a regular (y, x) grid, read bilinearly. `z` rows run
 * along y from `y0`, columns across x from `x0`, `step` apart; heights are
 * metres above the waterline (the DEM plus whatever puts its water at 0).
 */
export type GroundGrid = { y0: number; x0: number; step: number; z: number[][] }

export function groundAt(g: GroundGrid, x: number, y: number): number {
  const fy = Math.min(Math.max((y - g.y0) / g.step, 0), g.z.length - 1.0001)
  const fx = Math.min(Math.max((x - g.x0) / g.step, 0), g.z[0].length - 1.0001)
  const r = Math.floor(fy), c = Math.floor(fx), ty = fy - r, tx = fx - c
  const at = (rr: number, cc: number) => g.z[rr][cc]
  return (at(r, c) * (1 - tx) + at(r, c + 1) * tx) * (1 - ty) + (at(r + 1, c) * (1 - tx) + at(r + 1, c + 1) * tx) * ty
}

/** A quad with one normal, wound to face `n`. */
export function face(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  const ok = dot(cross(sub(b, a), sub(c, a)), n) >= 0
  if (ok) {
    p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
    p.tri(a, c, d, undefined, undefined, undefined, [n, n, n])
  } else {
    p.tri(a, c, b, undefined, undefined, undefined, [n, n, n])
    p.tri(a, d, c, undefined, undefined, undefined, [n, n, n])
  }
}

/** A round tube along a path, smooth-shaded, open at the ends. */
export function tube(p: Part, path: V3[], r: number, sides: number) {
  const rings: { pts: V3[]; ns: V3[] }[] = []
  for (let i = 0; i < path.length; i++) {
    const t = norm(sub(path[Math.min(i + 1, path.length - 1)], path[Math.max(i - 1, 0)]))
    const side = norm(Math.abs(t[2]) > 0.9 ? cross(t, [1, 0, 0]) : cross(t, [0, 0, 1]))
    const up = cross(side, t)
    const ns: V3[] = [], pts: V3[] = []
    for (let k = 0; k < sides; k++) {
      const a = (2 * Math.PI * k) / sides
      const n = add(scale(side, Math.cos(a)), scale(up, Math.sin(a)))
      ns.push(n)
      pts.push(add(path[i], scale(n, r)))
    }
    rings.push({ pts, ns })
  }
  for (let i = 0; i < rings.length - 1; i++)
    for (let k = 0; k < sides; k++) {
      const j = (k + 1) % sides, a = rings[i], b = rings[i + 1]
      const quad: [V3, V3][] = [[a.pts[k], a.ns[k]], [b.pts[k], b.ns[k]], [b.pts[j], b.ns[j]], [a.pts[j], a.ns[j]]]
      const n = add(add(quad[0][1], quad[1][1]), add(quad[2][1], quad[3][1]))
      const wind = dot(cross(sub(quad[1][0], quad[0][0]), sub(quad[2][0], quad[0][0])), n) >= 0
      const [q0, q1, q2, q3] = wind ? quad : [quad[0], quad[3], quad[2], quad[1]]
      p.tri(q0[0], q1[0], q2[0], undefined, undefined, undefined, [q0[1], q1[1], q2[1]])
      p.tri(q0[0], q2[0], q3[0], undefined, undefined, undefined, [q0[1], q2[1], q3[1]])
    }
}

/** A thin straight rod from a to b: a prism of `sides` faces, open at the ends. */
export function rod(p: Part, a: V3, b: V3, r: number, sides = 3) {
  tube(p, [a, b], r, sides)
}

/** A flat strip of width w from a to b, lying in the plane whose normal is n. For double-sided materials. */
export function strip(p: Part, a: V3, b: V3, w: number, n: V3) {
  const across = scale(norm(cross(n, sub(b, a))), w / 2)
  face(p, sub(a, across), add(a, across), add(b, across), sub(b, across), n)
}

/**
 * A longitudinal box from x0 to x1, its top and bottom following `top(y)`
 * and `bot(y)` through the given stations. Only the faces asked for are
 * drawn, so a band's hidden side costs nothing.
 */
export function band(
  p: Part,
  x0: number,
  x1: number,
  ys: number[],
  top: (y: number) => number,
  bot: (y: number) => number,
  faces: { out?: boolean; in?: boolean; top?: boolean; bottom?: boolean; ends?: boolean } = { out: true, in: true, top: true, bottom: true, ends: true },
) {
  // "out" is the face at the larger |x|, so one call serves both sides of the bridge.
  ys = [...ys].sort((a, b) => a - b)
  const outX = Math.abs(x1) >= Math.abs(x0) ? x1 : x0, inX = outX === x1 ? x0 : x1
  const sOut: V3 = [Math.sign(outX - inX), 0, 0], sIn: V3 = [-sOut[0], 0, 0]
  for (let i = 0; i < ys.length - 1; i++) {
    const ya = ys[i], yb = ys[i + 1]
    const ta = top(ya), tb = top(yb), ba = bot(ya), bb = bot(yb)
    if (faces.out) face(p, [outX, ya, ba], [outX, yb, bb], [outX, yb, tb], [outX, ya, ta], sOut)
    if (faces.in) face(p, [inX, ya, ba], [inX, yb, bb], [inX, yb, tb], [inX, ya, ta], sIn)
    const up = norm([0, -(tb - ta), yb - ya]), down = norm([0, bb - ba, -(yb - ya)])
    if (faces.top) face(p, [x0, ya, ta], [x1, ya, ta], [x1, yb, tb], [x0, yb, tb], up)
    if (faces.bottom) face(p, [x0, ya, ba], [x1, ya, ba], [x1, yb, bb], [x0, yb, bb], down)
  }
  if (faces.ends)
    for (const [y, s] of [[ys[0], -1], [ys[ys.length - 1], 1]] as [number, number][])
      face(p, [x0, y, bot(y)], [x1, y, bot(y)], [x1, y, top(y)], [x0, y, top(y)], [0, s, 0])
}

/**
 * An open truss in the plane x = xc: a top and a bottom chord, a post at
 * every panel point and one diagonal per panel, alternating, as a Warren
 * truss with verticals reads from a distance. Posts and diagonals are flat
 * strips, for a double-sided material.
 */
export function truss(
  chords: Part,
  web: Part,
  xc: number,
  ys: number[],
  top: (y: number) => number,
  bot: (y: number) => number,
  { chordW = 0.5, topD = 0.55, botD = 0.75, member = 0.32, curve = ys } = {},
) {
  const x0 = xc - chordW / 2, x1 = xc + chordW / 2
  band(chords, x0, x1, curve, top, (y) => top(y) - topD, { out: true, in: true, top: true, bottom: true })
  band(chords, x0, x1, curve, (y) => bot(y) + botD, bot, { out: true, in: true, top: true, bottom: true })
  const n: V3 = [1, 0, 0]
  for (let i = 0; i < ys.length; i++) {
    const y = ys[i]
    strip(web, [xc, y, bot(y) + botD], [xc, y, top(y) - topD], member, n)
    if (i < ys.length - 1) {
      const y2 = ys[i + 1]
      const [ya, yb] = i % 2 ? [y, y2] : [y2, y]
      strip(web, [xc, ya, bot(ya) + botD], [xc, yb, top(yb) - topD], member, n)
    }
  }
}

/**
 * A wall from a terrain-following foot up to `top(t)`, along the plan line
 * from a to b (x, y), facing `n` (the outward normal in plan). Split every
 * `step` metres so the foot follows the ground the map draws, which is what
 * makes the map read the model as standing on its terrain.
 */
export function footedWall(
  p: Part,
  a: [number, number],
  b: [number, number],
  ground: (x: number, y: number) => number,
  top: (x: number, y: number) => number,
  n: V3,
  step = 4,
) {
  const ts = stations(0, 1, step / Math.hypot(b[0] - a[0], b[1] - a[1]))
  for (let i = 0; i < ts.length - 1; i++) {
    const at = (t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
    const [xa, ya] = at(ts[i]), [xb, yb] = at(ts[i + 1])
    face(p, [xa, ya, ground(xa, ya)], [xb, yb, ground(xb, yb)], [xb, yb, top(xb, yb)], [xa, ya, top(xa, ya)], n)
  }
}

/**
 * Points along a main cable, as a function of y, from y0 to y1 at
 * `step` metres.
 */
export function cablePath(x: number, y0: number, y1: number, z: (y: number) => number, step: number): V3[] {
  return stations(y0, y1, step).map((y) => [x, y, z(y)] as V3)
}

/** One part holding the triangles of several. */
export function merged(...parts: Part[]): Part {
  const out = new Part()
  for (const p of parts) for (const key of ['pos', 'nrm', 'uv'] as const) for (const v of p[key]) out[key].push(v)
  return out
}

/** A copy of a part moved `dy` metres along the bridge (map-frame y). */
export function movedAlong(p: Part, dy: number): Part {
  const out = merged(p)
  // Parts store glTF's frame, where map-frame y is -z.
  for (let i = 2; i < out.pos.length; i += 3) out.pos[i] -= dy
  return out
}

/**
 * A light point: a flat-shaded double hexagonal pyramid of radius `r` (12
 * faces), round enough to read as a dot from any side, or a tetrahedron (4)
 * for a low model.
 */
export function bead(p: Part, c: V3, r: number, tetra = false) {
  const at = (v: V3) => add(c, scale(v, r))
  if (tetra) {
    const [a, b, d, e] = ([[0, 0, 1], [0.943, 0, -0.333], [-0.471, 0.816, -0.333], [-0.471, -0.816, -0.333]] as V3[]).map(at)
    for (const [x, y, z] of [[a, b, d], [a, d, e], [a, e, b], [b, e, d]]) p.tri(x, y, z)
    return
  }
  const ring = Array.from({ length: 6 }, (_, i) => at([Math.cos((i * Math.PI) / 3), Math.sin((i * Math.PI) / 3), 0]))
  const top = at([0, 0, 1]), bottom = at([0, 0, -1])
  for (let i = 0; i < 6; i++) {
    const a = ring[i], b = ring[(i + 1) % 6]
    p.tri(top, a, b)
    p.tri(bottom, b, a)
  }
}

/**
 * `count` points spread evenly by length along a polyline, half a gap in
 * from each end: lights strung along a cable.
 */
export function along(path: V3[], count: number): V3[] {
  const lengths = [0]
  for (let i = 1; i < path.length; i++) lengths.push(lengths[i - 1] + Math.hypot(...sub(path[i], path[i - 1])))
  const total = lengths[lengths.length - 1], out: V3[] = []
  let k = 1
  for (let n = 0; n < count; n++) {
    const s = (total * (n + 0.5)) / count
    while (k < path.length - 1 && lengths[k] < s) k++
    const t = (s - lengths[k - 1]) / (lengths[k] - lengths[k - 1] || 1)
    out.push(add(path[k - 1], scale(sub(path[k], path[k - 1]), t)))
  }
  return out
}
