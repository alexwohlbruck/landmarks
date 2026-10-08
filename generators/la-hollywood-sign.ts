/**
 * The Hollywood Sign (1923 as "Hollywoodland"; rebuilt 1978), Mount Lee,
 * Los Angeles — original procedural geometry, CC0-1.0.
 * bun generators/la-hollywood-sign.ts [out.glb]
 *
 * A famous sign, so it carries its lettering (STYLE.md, "Towers, rides,
 * sculpture and signs"): nine white letters, each an extruded flat block
 * letter standing on steel legs on the slope. Nothing else.
 *
 * Map frame: x east, y north, z up, metres; origin at OSM node/3204926589
 * (the sign's node, under the Y), on the lowest ground under the sign
 * (475.8 m, in front of the D). Bearing 0: each letter is placed and turned
 * from its own OSM way, as the sign follows the hillside in a shallow curve.
 * The letters face 176–189° (south, a little east or west of it); the line
 * from H to D runs at 87°.
 *
 * Sources:
 * - Place and turn of each letter: OSM's nine letter ways
 *   (tourism=artwork, way/125433363 … way/125433362), each traced along a
 *   letter's foot. Their centres agree with a near-frontal aerial
 *   ("Aerial Hollywood Sign", Jelson25, public domain) to within a metre
 *   once scaled to the published length, except four: the two L's, which
 *   OSM draws overlapping, and the last two O's, which it draws too far
 *   from the D. They are moved 0.9, 1.9, 0.45 and 0.8 m east along their
 *   ways, and the D 1.0 m west, evening the gaps, to the aerial's spacing (the second L's foot then runs under the
 *   Y's arm, as it does in every photo).
 * - Size: letters 45 ft (13.7 m) tall, the sign about 350 ft (107 m) long
 *   (Hollywood Sign Trust; Wikipedia). Letter widths from the same aerial at
 *   8.34 px/m: H 10.5, O 10.3, L 9.7, L 9.6, Y 10.3, W 11.7, O 10.3, O 10.3,
 *   D 10.2 m (published: 31 to 39 ft); stroke widths and the O and D
 *   counters from it too.
 * - Heights: LA County 2006 lidar surface model (layer 8, 1.5 m grid) caught
 *   the tops of six letters at 494.2–495.7 m: the tops run nearly level
 *   while the ground under them (USGS 3DEP bare earth, 476–482 m) does not,
 *   so the letters near the ends stand on legs about 2 m clear of the
 *   hill and the L's sit almost on it — as the photos show. The tops of the
 *   H, the first L and the D, which the lidar missed, are taken from their
 *   neighbours.
 * - Photos (Wikimedia Commons): "Hollywood Sign (Zuschnitt)" (Thomas Wolf,
 *   CC BY-SA 3.0; from the south-west, below), "View from behind Hollywood
 *   Sign overlooking LA" (Michael E. Arth, CC BY-SA 4.0; the backs and their
 *   framing), "Aerial Hollywood Sign" (Jelson25, public domain).
 * - Simplified: the letters are solid 0.6 m slabs (really sheet steel on a
 *   frame); the scaffold behind them is left out; the legs are drawn as a
 *   few square posts.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const white = new Part(), steel = new Part()

const G0 = 475.8 // lowest ground under the sign, m
const LH = 13.7 // letter height
const T = 0.3 // half the letter's thickness

/**
 * Each letter: its centre and turn (OSM), width (aerial), top (lidar, m),
 * and the ground under its foot at five points across it (3DEP, m: front,
 * on the line, behind, 1 m apart).
 */
const LETTERS: { ch: string; c: XY; brg: number; w: number; top: number; g: number[][] }[] = [
  { ch: 'H', c: [-47.25, -7.7], brg: 90.0, w: 10.5, top: 494.3, g: [[476.59, 476.59, 476.95], [476.89, 477.07, 477.25], [478.17, 478.61, 479.08], [478.81, 479.09, 479.44], [479.35, 479.57, 479.92]] },
  { ch: 'O', c: [-34.4, -10.95], brg: 93.8, w: 10.3, top: 494.2, g: [[478.96, 479.34, 479.74], [479.38, 479.82, 480.06], [480.16, 480.72, 481.32], [480.74, 481.12, 481.42], [481.16, 481.36, 481.66]] },
  { ch: 'L', c: [-21.06, -8.48], brg: 82.5, w: 9.7, top: 495.2, g: [[481.64, 481.88, 484.04], [481.62, 481.8, 483.44], [481.67, 481.73, 482.35], [481.85, 481.85, 482.21], [481.89, 482.17, 483.01]] },
  { ch: 'L', c: [-10.77, -6.67], brg: 81.4, w: 9.6, top: 495.7, g: [[481.87, 482.07, 482.85], [481.83, 481.99, 482.59], [481.89, 482.39, 483.15], [481.81, 482.07, 482.75], [481.59, 481.75, 482.53]] },
  { ch: 'Y', c: [-3.35, -5.7], brg: 81.3, w: 10.3, top: 495.7, g: [[481.59, 481.75, 482.21], [481.5, 481.84, 481.84], [480.7, 480.88, 481.72], [480.44, 480.5, 480.9], [479.92, 480.36, 480.36]] },
  { ch: 'W', c: [8.85, -0.85], brg: 81.1, w: 11.7, top: 495.2, g: [[480.48, 480.74, 482.1], [480.36, 480.68, 481.64], [480.51, 481.03, 482.37], [480.41, 481.11, 481.85], [480.17, 480.53, 481.27]] },
  { ch: 'O', c: [21.95, 0.72], brg: 87.6, w: 10.3, top: 494.9, g: [[480.14, 480.8, 482.53], [479.7, 480.22, 482.15], [479.2, 480.48, 482.61], [478.84, 479.26, 480.71], [478.8, 479.26, 480.61]] },
  { ch: 'O', c: [34.95, 2.77], brg: 84.9, w: 10.3, top: 494.3, g: [[477.9, 478.37, 479.59], [477.65, 478.41, 480.27], [477.3, 478.26, 479.82], [476.94, 477.38, 478.1], [477.14, 477.66, 478.66]] },
  { ch: 'D', c: [47.85, -1.62], brg: 92.0, w: 10.2, top: 494.3, g: [[475.81, 476.13, 476.65], [476.31, 476.45, 476.77], [478.14, 478.56, 479.34], [478.98, 479.18, 479.44], [480.02, 480.6, 482.8]] },
]

// ---------- 2D letter shapes: convex pieces in (s, z), s across, z up ----------
type P2 = [number, number]
/** Clip a convex polygon to the half-plane a·p <= b (Sutherland–Hodgman). */
function clip(poly: P2[], a: P2, b: number): P2[] {
  const out: P2[] = []
  const f = (p: P2) => a[0] * p[0] + a[1] * p[1] - b
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length], fp = f(p), fq = f(q)
    if (fp <= 0) out.push(p)
    if ((fp < 0 && fq > 0) || (fp > 0 && fq < 0)) {
      const t = fp / (fp - fq)
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t])
    }
  }
  return out
}
const rect = (s0: number, s1: number, z0: number, z1: number): P2[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
/** An octagon: a rectangle with its corners cut by `ch` (left corners too unless `squareLeft`). */
const octo = (w: number, h: number, ch: number, squareLeft = false): P2[] =>
  squareLeft
    ? [[0, 0], [w - ch, 0], [w, ch], [w, h - ch], [w - ch, h], [0, h]]
    : [[ch, 0], [w - ch, 0], [w, ch], [w, h - ch], [w - ch, h], [ch, h], [0, h - ch], [0, ch]]
/** A ring: a convex outline minus a centred rectangular counter, as four convex pieces. */
function ring(outline: P2[], s0: number, s1: number, z0: number, z1: number): P2[][] {
  return [
    clip(outline, [1, 0], s0),
    clip(outline, [-1, 0], -s1),
    clip(clip(clip(outline, [-1, 0], -s0), [1, 0], s1), [0, 1], z0),
    clip(clip(clip(outline, [-1, 0], -s0), [1, 0], s1), [0, -1], -z1),
  ]
}
/**
 * A V between s = 0 and w: two strokes `sw` wide at the top meeting in a
 * foot `bw` wide at height zb, each cut at the middle so they don't overlap.
 */
function vee(w: number, sw: number, bw: number, zb: number, zt: number): P2[][] {
  const m = w / 2
  const left: P2[] = [[0, zt], [sw, zt], [m + bw / 2, zb], [m - bw / 2, zb]]
  const right: P2[] = [[w - sw, zt], [w, zt], [m + bw / 2, zb], [m - bw / 2, zb]]
  return [clip(left, [1, 0], m), clip(right, [-1, 0], -m)]
}
const shift = (pieces: P2[][], ds: number) => pieces.map(p => p.map(([s, z]) => [s + ds, z] as P2))

/** The pieces of a letter `w` wide, s from 0 to w; and where its legs go (s). */
function glyph(ch: string, w: number): { pieces: P2[][]; legs: number[] } {
  const H = LH, S = 2.6 // stroke
  switch (ch) {
    case 'H':
      return { pieces: [rect(0, S, 0, H), rect(w - S, w, 0, H), rect(S, w - S, 5.3, 8.1)], legs: [S / 2, w - S / 2] }
    case 'O': {
      const c0 = (w - 3.2) / 2
      return { pieces: ring(octo(w, H, 2.0), c0, w - c0, 2.9, H - 2.5), legs: [1.6, w / 2, w - 1.6] }
    }
    case 'L':
      return { pieces: [rect(0, S, 0, H), rect(S, w, 0, 3.0)], legs: [S / 2, w / 2 + 1, w - 1] }
    case 'Y': {
      const m = w / 2, zj = 5.4
      return { pieces: [...vee(w, 3.0, S, zj, H), rect(m - S / 2, m + S / 2, 0, zj)], legs: [m] }
    }
    case 'W': {
      const h = w / 2
      return { pieces: [...vee(h, 2.3, 1.6, 0, H), ...shift(vee(h, 2.3, 1.6, 0, H), h)], legs: [h / 2, h + h / 2] }
    }
    case 'D':
      return { pieces: ring(octo(w, H, 2.4, true), 3.3, 6.8, 2.8, H - 2.6), legs: [1.4, w / 2, w - 1.8] }
  }
  throw new Error(ch)
}

// ---------- extrusion into the map frame ----------
/** Extrude a convex (s, z) polygon between t = −T (back) and +T (front, along n). */
function extrude(part: Part, poly: P2[], at: (s: number, z: number, t: number) => V3) {
  // make it counter-clockwise in (s, z)
  let a = 0
  for (let i = 0; i < poly.length; i++) { const p = poly[i], q = poly[(i + 1) % poly.length]; a += p[0] * q[1] - q[0] * p[1] }
  const P = a > 0 ? poly : [...poly].reverse()
  const front = P.map(([s, z]) => at(s, z, T)), back = P.map(([s, z]) => at(s, z, -T))
  part.cap(front, true) // viewed from the front, s runs right and z up: counter-clockwise faces the viewer
  part.cap(back, false)
  for (let i = 0; i < P.length; i++) {
    const j = (i + 1) % P.length
    part.quad(back[i], back[j], front[j], front[i])
  }
}
/** A square post centred on (x, y) from z0 to z1. */
function post(part: Part, x: number, y: number, h: number, z0: number, z1: number) {
  const r: V3[] = [[x - h, y - h, z0], [x + h, y - h, z0], [x + h, y + h, z0], [x - h, y + h, z0]]
  part.loft([r, r.map(([a, b]) => [a, b, z1] as V3)])
}

let lowest = Infinity
for (const L of LETTERS) {
  const b = (L.brg * Math.PI) / 180
  const u: XY = [Math.sin(b), Math.cos(b)] // along the letter, left to right seen from the front
  const n: XY = [u[1], -u[0]] // the front, downhill
  const bottom = L.top - LH - G0
  const at = (s: number, z: number, t: number): V3 => {
    const x = s - L.w / 2
    return [L.c[0] + u[0] * x + n[0] * t, L.c[1] + u[1] * x + n[1] * t, bottom + z]
  }
  const { pieces, legs } = glyph(L.ch, L.w)
  for (const p of pieces) if (p.length >= 3) extrude(white, p, at)
  // the legs, down to the ground on the line under the letter
  for (const s of legs) {
    const f = Math.min(4, Math.max(0, (s / L.w) * 4)), i = Math.min(3, Math.floor(f)), k = f - i
    const g = L.g[i][1] * (1 - k) + L.g[i + 1][1] * k - G0
    if (g < bottom - 0.3) {
      const [x, y] = at(s, 0, 0)
      post(steel, x, y, 0.25, Math.max(0, g - 0.6), bottom + 0.4)
    }
  }
  for (const row of L.g) lowest = Math.min(lowest, ...row)
}
if (Math.abs(lowest - G0) > 0.01) throw new Error(`origin isn't the lowest ground: ${lowest}`)

// ---------- write ----------
const parts = [
  { part: white, material: finish('hollywood-white', 0xf6f3ec) },
  { part: steel, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const height = Math.max(...LETTERS.map(l => l.top)) - G0
const glb = writeGlb('Hollywood Sign', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, height,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: [],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/la-hollywood-sign.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
