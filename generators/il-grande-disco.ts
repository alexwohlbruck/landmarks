/**
 * Il Grande Disco, Arnaldo Pomodoro's bronze disc on the plaza at Trade and
 * Tryon, Charlotte — procedural, CC0-1.0.
 *
 *   bun generators/il-grande-disco.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, origin at the anchor (OSM node
 * 8415199023) on the paving. The catalog turns the model by bearing 20°, so a
 * true bearing b is model bearing b − 20°.
 *
 * Evidence
 * - Published: cast bronze, 1974, 15 ft (4.57 m) across (Charlotte public-art
 *   listings, Wikipedia's Independence Square article).
 * - Lidar (USGS 3DEP NC Phase 4, Mecklenburg 2016, 0.5 m): the disc shows as
 *   a 1 m-wide ridge whose top is 4.5 m above the paving around it (5.0 m
 *   above ground_min, paving at 0.4–0.6), running from (−0.5, +1.25) to
 *   (+1.0, −2.25) m around the anchor: the disc's plane lies along true
 *   bearing 157°/337°, so its faces look out at 67° and 247°. Its centre sits
 *   at (+0.1, −0.4) m true from the OSM node; the model puts it there.
 * - Photos (all Flickr via Openverse; looked at, proportions read off them):
 *   ucumari photography "Il Grande Disco" (CC BY-NC-ND 2.0, face-on),
 *   kcomesundone "KSM - Il Grande Disco" (CC BY-NC 2.0, face-on, other face),
 *   Keith Weston "Viewing the Grande Disco" and "Skateboarding at the Grande
 *   Disco" (CC BY-NC-SA 2.0, oblique and nearly edge-on).
 *
 * What the photos show, and how it is drawn
 * - The disc stands upright on its edge, straight on the paving, on a small
 *   dark foot hidden under it; no plinth. It is a thick slab, about 0.85 m
 *   (estimated from the edge-on photo and the lidar ridge width).
 * - Each face is polished gold bronze, broken by a starburst of deep dark
 *   channels round a dark rough core with a gold block at its heart. About
 *   ten channels of different lengths and widths; four of them run out
 *   through the rim and notch it, the rest stop short. The channel layout is
 *   read off the face-on photos (angles counter-clockwise from the
 *   horizontal as seen from the face). The back face uses the same layout
 *   mirrored, so a channel that breaks the rim breaks it through the whole
 *   thickness, as on the real disc.
 * - Here: gold face plates over a slightly smaller dark core; the channels
 *   are the gaps between the plates, so they are recessed 0.2 m into the
 *   disc with the dark core at their floor, and their floors carry a few
 *   bold dark blocks for the carved, toothed interior. The rim band is the
 *   dark rough bronze the edge-on photos show, with a gold bevel on each
 *   face's edge; where a channel breaks the rim it leaves a recessed notch.
 * - Colours from the daylight photos: the gold pulled down a little in
 *   saturation to sit in the palette; the dark bronze lifted to a warm
 *   umber, as dark as the palette allows for a defining feature.
 * - Estimated: thickness, channel depth, the back face's layout (the
 *   photos of the second face show the same scheme, not an identical one).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const GOLD = finish('gilded-bronze', 0xd2ad6a, 0.4)
const DARK = finish('bronze-dark', 0x5f5145)

const R = 4.57 / 2
const T = 0.85 // full thickness at the gold faces
const DEPTH = 0.22 // channels' depth below each face
const TC = T - 2 * DEPTH // the dark core's thickness
const RC = R - 0.03 // the dark core reaches the rim; a channel breaking the rim leaves a recess, not a hole
const BEVEL = 0.06
const SINK = 0.06 // the foot of the disc is set a little into the paving
const ZC = R - SINK // centre height

// The disc's frame in model coordinates (see the header).
const deg = Math.PI / 180
const PLANE = (157 - 20) * deg // model bearing of the disc's plane
const U: V3 = [Math.sin(PLANE), Math.cos(PLANE), 0] // along the face, "right" seen from +W
const W: V3 = [Math.cos(PLANE), -Math.sin(PLANE), 0] // face normal, model bearing 227° (true 247°)
const off = (() => {
  // true offset (+0.1 E, −0.4 N) turned into the model frame
  const a = -20 * deg, x = 0.1, y = -0.4
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]
})()
/** (u across the face, v up from the centre, w along the normal) → model frame. */
const P = (u: number, v: number, w: number): V3 => [
  off[0] + u * U[0] + w * W[0],
  off[1] + u * U[1] + w * W[1],
  ZC + v,
]

const gold = new Part()
const dark = new Part()

/** A triangle turned to face `out` (a direction in u, v, w). */
function tri(p: Part, a: V3, b: V3, c: V3, out: V3) {
  const A = P(...a), B = P(...b), C = P(...c)
  const e1 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], e2 = [C[0] - A[0], C[1] - A[1], C[2] - A[2]]
  const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (Math.hypot(n[0], n[1], n[2]) < 1e-9) return
  const o = [out[0] * U[0] + out[2] * W[0], out[0] * U[1] + out[2] * W[1], out[1]]
  if (n[0] * o[0] + n[1] * o[1] + n[2] * o[2] >= 0) p.tri(A, B, C)
  else p.tri(A, C, B)
}
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, out: V3) {
  tri(p, a, b, c, out)
  tri(p, a, c, d, out)
}

/**
 * The channels, read off the face-on photo: [axis angle°, reach as a
 * fraction of R (1 = through the rim), half-width at the root, half-width at
 * the end] in metres. Angles run counter-clockwise from "right" as seen from
 * the +W face.
 */
const CHANNELS: number[][] = [
  [8, 0.7, 0.16, 0.05],
  [28, 1.0, 0.24, 0.15],
  [62, 0.74, 0.12, 0.03],
  [84, 1.0, 0.24, 0.15],
  [112, 0.78, 0.2, 0.08],
  [158, 0.88, 0.24, 0.1],
  [186, 0.68, 0.12, 0.03],
  [227, 1.0, 0.27, 0.18],
  [268, 0.84, 0.17, 0.05],
  [312, 1.0, 0.27, 0.18],
]
/** The dark core's ragged outline: radius by angle. */
const core = (t: number) => 0.37 * R * (1 + 0.1 * Math.sin(3 * t + 0.6) + 0.06 * Math.sin(7 * t + 1.9))

function inChannel(r: number, t: number) {
  for (const [a, reach, w0, w1] of CHANNELS) {
    const d = t - a * deg
    const along = r * Math.cos(d), across = Math.abs(r * Math.sin(d))
    if (along <= 0) continue
    const L = reach >= 1 ? R + 0.5 : reach * R
    if (along > L) continue
    // Stair-stepped edges: the channels' sides are toothed, not straight.
    const step = Math.floor(along / 0.28 + a) % 2 === 0 ? 1.25 : 0.8
    const w = (w0 + (w1 - w0) * Math.min(1, along / L)) * step
    if (across < w) return true
  }
  return false
}

/** Where the gold starts along each ray: inside it, core or channel. */
const N = 180
const rays = Array.from({ length: N }, (_, i) => {
  const t = (i / N) * Math.PI * 2
  let rin = core(t)
  for (let r = R; r > rin; r -= 0.01) if (inChannel(r, t)) { rin = r; break }
  if (rin > R - BEVEL - 0.08) rin = R // too thin a sliver of gold: the channel breaks the rim
  return { t, rin, c: Math.cos(t), s: Math.sin(t) }
})

for (const side of [1, -1]) {
  // The photographed layout faces ENE (true 67°, the −W side, which the
  // face-on photos look at with One South behind); the WSW face carries it
  // mirrored, as the same channels seen from behind.
  const u = (x: number) => -x * side
  const wf = (side * T) / 2, wc = (side * TC) / 2
  for (let i = 0; i < N; i++) {
    const a = rays[i], b = rays[(i + 1) % N]
    const gA = a.rin < R, gB = b.rin < R
    const at = (ray: typeof a, r: number, w: number): V3 => [u(ray.c * r), ray.s * r, w]
    if (gA && gB) {
      // Gold face plate, from the channel edge to the bevel.
      quad(gold, at(a, a.rin, wf), at(a, R - BEVEL, wf), at(b, R - BEVEL, wf), at(b, b.rin, wf), [0, 0, side])
      // The bevel onto the rim.
      quad(gold, at(a, R - BEVEL, wf), at(a, R, wf - side * BEVEL), at(b, R, wf - side * BEVEL), at(b, R - BEVEL, wf), [u(a.c + b.c), a.s + b.s, side])
      // The rim: dark rough bronze, as in the edge-on photos.
      quad(dark, at(a, R, wf - side * BEVEL), at(a, R, 0), at(b, R, 0), at(b, R, wf - side * BEVEL), [u(a.c + b.c), a.s + b.s, 0])
      // The channel wall: gold, facing into the channel, from the face down to the core.
      quad(gold, at(a, a.rin, wf), at(b, b.rin, wf), at(b, b.rin, wc), at(a, a.rin, wc), [-u(a.c + b.c), -(a.s + b.s), 0])
    } else if (gA !== gB) {
      // The side wall where a channel breaks the rim.
      const g = gA ? a : b
      quad(gold, at(g, g.rin, wf), at(g, R, wf - side * BEVEL), at(g, R, wc), at(g, g.rin, wc), [u(gA ? -g.s : g.s), gA ? g.c : -g.c, 0])
      tri(gold, at(g, g.rin, wf), at(g, R - BEVEL, wf), at(g, R, wf - side * BEVEL), [u(gA ? -g.s : g.s), gA ? g.c : -g.c, 0])
    }
    // Radial walls where the gold's inner edge steps along a ray are covered
    // by the face strips' own edges; close the step with a wall.
    if (gA && gB && Math.abs(a.rin - b.rin) > 0.05) {
      const lo = a.rin < b.rin ? a : b, hi = a.rin < b.rin ? b : a
      const sgn = lo === a ? 1 : -1 // the wall faces from hi toward lo, across the channel
      const out: V3 = [u(-hi.s * sgn), hi.c * sgn, 0]
      quad(gold, at(hi, lo.rin, wf), at(hi, hi.rin, wf), at(hi, hi.rin, wc), at(hi, lo.rin, wc), out)
    }
  }
}

// The dark core: a slab of radius RC between the channel floors.
{
  const M = 48
  const ring = Array.from({ length: M }, (_, i) => [Math.cos((i / M) * 2 * Math.PI), Math.sin((i / M) * 2 * Math.PI)])
  for (let i = 0; i < M; i++) {
    const [c0, s0] = ring[i], [c1, s1] = ring[(i + 1) % M]
    for (const side of [1, -1]) {
      tri(dark, [0, 0, (side * TC) / 2], [c0 * RC, s0 * RC, (side * TC) / 2], [c1 * RC, s1 * RC, (side * TC) / 2], [0, 0, side])
    }
    quad(dark, [c0 * RC, s0 * RC, -TC / 2], [c1 * RC, s1 * RC, -TC / 2], [c1 * RC, s1 * RC, TC / 2], [c0 * RC, s0 * RC, TC / 2], [c0 + c1, s0 + s1, 0])
  }
}

/** A box in the disc's frame: centre, half-sizes, turned by `rot` in the face plane. */
function box(p: Part, cu: number, cv: number, cw: number, hu: number, hv: number, hw: number, rot: number) {
  const c = Math.cos(rot), s = Math.sin(rot)
  const at = (a: number, b: number, w: number): V3 => [cu + a * c - b * s, cv + a * s + b * c, cw + w]
  const k = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  for (let i = 0; i < 4; i++) {
    const [a0, b0] = k[i], [a1, b1] = k[(i + 1) % 4]
    const mid: V3 = [((a0 + a1) / 2) * c - ((b0 + b1) / 2) * s, ((a0 + a1) / 2) * s + ((b0 + b1) / 2) * c, 0]
    quad(p, at(a0 * hu, b0 * hv, -hw), at(a1 * hu, b1 * hv, -hw), at(a1 * hu, b1 * hv, hw), at(a0 * hu, b0 * hv, hw), mid)
  }
  for (const z of [1, -1]) {
    quad(p, at(-hu, -hv, z * hw), at(hu, -hv, z * hw), at(hu, hv, z * hw), at(-hu, hv, z * hw), [0, 0, z])
  }
}

// The carved interior: bold dark teeth standing on the channel floors and
// round the core, at a few depths, so the channels read rough, not painted.
for (const side of [1, -1]) {
  const floor = (side * TC) / 2
  CHANNELS.forEach(([a, reach, w0, w1], k) => {
    const L = Math.min(reach, 0.95) * R
    const t = a * deg
    const n = reach >= 1 ? 4 : 3
    for (let j = 0; j < n; j++) {
      const along = core(t) * 0.9 + ((j + 0.5) / n) * (L - core(t) * 0.9)
      const h = DEPTH * (0.35 + 0.45 * (((k * 7 + j * 3) % 5) / 4))
      const wTooth = (w0 + (w1 - w0) * (along / L)) * 0.55
      const cu = -side * along * Math.cos(t), cv = along * Math.sin(t)
      box(dark, cu, cv, floor + (side * h) / 2, 0.11, wTooth, h / 2, -side * t)
    }
  })
  // The core's blocks, a ring of them round the gold heart.
  for (let j = 0; j < 7; j++) {
    const t = (j / 7) * 2 * Math.PI + 0.3
    const r = 0.5
    const h = DEPTH * (0.5 + 0.4 * ((j * 3) % 4) / 3)
    box(dark, -side * r * Math.cos(t), r * Math.sin(t), floor + (side * h) / 2, 0.14, 0.12, h / 2, -side * t)
  }
  // The gold block at the heart, flush with the face.
  box(gold, 0, 0, side * (TC / 2 + DEPTH / 2), 0.26, 0.26, DEPTH / 2, side * 0.35)
}

// The dark foot under the disc, mostly hidden.
{
  const hu = 0.4, hw = 0.22, top = 0.16
  const v0 = -ZC, v1 = -ZC + top
  box(dark, 0, (v0 + v1) / 2, 0, hu, (v1 - v0) / 2, hw, 0)
}

const parts = [{ part: gold, material: GOLD }, { part: dark, material: DARK }]
const tris = parts.reduce((n, { part }) => n + part.triangles, 0)
if (tris > 5000) throw new Error(`over budget: ${tris} triangles`)
const glb = writeGlb('Il Grande Disco', parts, {
  title: 'Il Grande Disco',
  artist: 'Arnaldo Pomodoro',
  license: 'CC0-1.0',
  source: 'generators/il-grande-disco.ts',
})
const out = process.argv[2] ?? new URL('../models/il-grande-disco.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
