/**
 * Cathedral of Christ the Light, Oakland — original procedural geometry,
 * CC0-1.0.
 * bun generators/sf-christ-the-light.ts
 *
 * Frame: built along the nave, BEARING 356. x across it (+x = east-north-
 * east, Harrison Street), y along it (+y = north-north-west, the Alpha window
 * over Grand Avenue and the lake), z up, metres. Origin = the plan's centre of
 * symmetry (lidar), 6.7 m north of OSM's anchor point. The plan has a
 * half-turn symmetry, not a mirror: each shell's arc bulges toward the far
 * end of the other, and every part below is drawn for one shell and turned
 * half a turn for the other.
 *
 * Evidence
 * - OSM way/26720620 (the cathedral, height 41) and its parts way/782773169
 *   (the glass shells, building:material glass, height 41), 782773174 (the
 *   north base, 1 level), 782773173 and 782773175 (the south base and the
 *   entrance canopy, 1 level). Relation/10864077 is the whole complex (plaza,
 *   conference centre, chancery, parking) and is left to the map. OSM's
 *   outline sits about 1.6 m west of the lidar; the lidar is used.
 * - USGS 3DEP lidar (CA_AlamedaCo_2_2021) at 0.5 m in this frame
 *   (/tmp/city/sf/work/sf-christ-the-light). y = 0 is 5.6 m NAVD88, the
 *   ground at the north tip on Grand Avenue; the plaza round the cathedral
 *   is 2.55 m higher (8.15). Measured above the plaza: the two shells rise
 *   from the base arcs (west from (-17, 24) out to (-22.6, 4) and round to
 *   (0, -29); the east the same turned) and lean in, slightly convex, to top
 *   arcs 32 m across and 47 m long; the glass ends at 36, the fins along it
 *   reach 41.4; the roof inside sits at 33-36; at each end the shells' tops
 *   meet in a V whose foot, the apex of the end window, is at ~30; the north
 *   base and the south base and canopy are 4.4-5.2 high.
 * - Published (Wikipedia; SOM): 2008, Craig W. Hartman of Skidmore, Owings &
 *   Merrill; a vesica-shaped plan; a glulam timber frame inside a skin of
 *   fritted glass louvres; the Omega window over the altar and the Alpha
 *   window at the north end; a concrete "reliquary" base; 41 m.
 * - Commons daylight photos: "Oak Cathdrl 1.jpg" and "Oak Cathdrl 2.jpg"
 *   (Skier Dude, CC BY-SA 3.0, the Grand Avenue end: the two shells, the V at
 *   the top, the pointed-arch window with its frame and fold, the timber
 *   behind clear glass beside it, the fins, the base and steps), "The
 *   Cathedral of Christ the Light - Flickr - Joe Parks.jpg" (CC BY 2.0, from
 *   Lake Merritt), "Cathedral of Christ the Light and Health Net HQ in
 *   Oakland.jpg" (John Martinez Pavliga, CC BY 2.0), "Catedral de Oakland
 *   (4734075798).jpg" (Eneas De Troya, CC BY 2.0, the entrance end and its
 *   canopy), "The Cathedral of Christ the Light 2724.JPG" (Pedro Xing, CC0,
 *   the north end head-on), "Cathedral on Lake Merritt.jpg" (Poshotenk,
 *   CC BY-SA 4.0). Interior photos by Carol M. Highsmith (public domain)
 *   for the timber ribs and the Omega window.
 *
 * Contrary to the brief, the shells lean in, not out: the lidar's slopes and
 * every photo show a footprint wider than the top.
 *
 * Estimated: the shells' convex profile (fitted to three lidar heights), the
 * end windows' outline (an equilateral pointed arch from the shells' edges
 * to the V), their frame, the fold up the middle, the fins' spacing and
 * thickness (drawn thicker and fewer than the real rods so they read), the
 * concrete plinth's height on the long sides, the entrance doors. The south
 * end is drawn as the north turned, apart from its canopy.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const BEARING = 356
const ANCHOR = { lng: -122.263119, lat: 37.81056 }
const glass = new Part(), win = new Part(), timber = new Part(), concrete = new Part(), metal = new Part(), door = new Part()

// --- Dimensions (m above the lowest ground; the plaza is PL) ---
const PL = 2.55
const H = 36 // the glass's top edge above the plaza
const FIN = 41.4 // the fins' tips above the plaza
const APEX = 30 // the V's foot and the end window's apex, above the plaza
const ROOF = 34 // the roof's middle, above the plaza
const PLINTH = 1.5 // concrete band under the glass on the long sides, above the plaza
const BASE_TOP = 4.8 // the north and south base blocks, above the plaza

// The west shell, north end to south end (the east one is this turned half
// a turn). Base from OSM shifted onto the lidar; top from the lidar.
const BASE_W: XY[] = [[-17.15, 24.3], [-19.95, 20.7], [-21.95, 13.3], [-22.55, 5.1], [-21.9, -1.0], [-20.6, -7.1], [-17.4, -14.1], [-12.3, -20.9], [-7.9, -24.8], [-3.3, -27.9], [-0.15, -29.0]]
const TOP_W: XY[] = [[-10.5, 21], [-12.2, 18.8], [-13.6, 15], [-14.9, 10], [-15.8, 4], [-15.9, -0.6], [-14.9, -4.5], [-13.4, -8.5], [-11.2, -12.5], [-7.6, -16.4], [-3.4, -20.3], [1.5, -23.2]]
const CREASE_BASE: XY = [-4.85, 17.6], CREASE_TOP: XY = [-6.5, 18.5] // the fold up the middle of the north window

const turn = ([x, y, z]: V3): V3 => [-x, -y, z]
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

/** A smooth curve through the points (Catmull-Rom), resampled to n+1 points evenly by length. */
function resample(pts: XY[], n: number): XY[] {
  const dense: XY[] = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]
    for (let k = 0; k < 20; k++) {
      const t = k / 20, t2 = t * t, t3 = t2 * t
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3)
      dense.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])])
    }
  }
  dense.push(pts[pts.length - 1])
  const acc = [0]
  for (let i = 1; i < dense.length; i++) acc.push(acc[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]))
  const out: XY[] = []
  for (let k = 0, j = 0; k <= n; k++) {
    const target = (acc[acc.length - 1] * k) / n
    while (j < acc.length - 2 && acc[j + 1] < target) j++
    const f = (target - acc[j]) / (acc[j + 1] - acc[j] || 1)
    out.push([dense[j][0] + (dense[j + 1][0] - dense[j][0]) * f, dense[j][1] + (dense[j + 1][1] - dense[j][1]) * f])
  }
  return out
}

// ---------------------------------------------------------------------------
// The shells: each a ruled surface from its base arc to its top arc, bowed
// slightly outward (the fraction of the way in at height t is t - 0.5 t(1-t)).
const NS = 18, NT = 8
const bw = resample(BASE_W, NS), tw = resample(TOP_W, NS)
const frac = (t: number) => t - 0.5 * t * (1 - t)
/** West shell point: s from the north end (0) to the south end (1), t up. */
const shellW = (i: number, t: number): V3 => {
  const f = frac(t)
  return [bw[i][0] + (tw[i][0] - bw[i][0]) * f, bw[i][1] + (tw[i][1] - bw[i][1]) * f, PL + H * t]
}
/** The same at any s in 0..NS, between the samples. */
const shellAt = (s: number, t: number): V3 => {
  const i = Math.max(0, Math.min(NS - 1, Math.floor(s))), f = s - i
  return lerp3(shellW(i, t), shellW(i + 1, t), f)
}
/** The north end's surface: a from the west shell's edge (-1) through the fold (0) to the east shell's edge (+1). */
const creaseAt = (t: number): V3 => [CREASE_BASE[0] + (CREASE_TOP[0] - CREASE_BASE[0]) * t, CREASE_BASE[1] + (CREASE_TOP[1] - CREASE_BASE[1]) * t, PL + APEX * t]
const endN = (a: number, t: number): V3 => {
  const edge = a < 0 ? shellW(0, t) : turn(shellW(NS, t)) // the east shell's north end is the west's south end turned
  return lerp3(creaseAt(t), edge, Math.abs(a))
}

/** Smooth-shaded quad grid over a parametric surface, normals pointing away from `inside`. */
function grid(part: Part, f: (u: number, v: number) => V3, us: number[], vs: number[], inside: V3 | null, map = (p: V3) => p, smooth = true) {
  const nrm = (u: number, v: number): V3 => {
    const e = 1e-3
    const n = unit(crs(sub(f(u + e, v), f(u - e, v)), sub(f(u, v + e), f(u, v - e))))
    if (!inside) return n
    const p = f(u, v), c = sub(p, inside)
    return c[0] * n[0] + c[1] * n[1] + c[2] * n[2] < 0 ? [-n[0], -n[1], -n[2]] : n
  }
  for (let i = 0; i < us.length - 1; i++) for (let j = 0; j < vs.length - 1; j++) {
    const uv: [number, number][] = [[us[i], vs[j]], [us[i + 1], vs[j]], [us[i + 1], vs[j + 1]], [us[i], vs[j + 1]]]
    const p = uv.map(([u, v]) => map(f(u, v))), n = uv.map(([u, v]) => map(nrm(u, v)))
    for (const [a, b, c] of [[0, 1, 2], [0, 2, 3]]) {
      const fn = crs(sub(p[b], p[a]), sub(p[c], p[a]))
      const ok = fn[0] * n[a][0] + fn[1] * n[a][1] + fn[2] * n[a][2] >= 0
      if (!smooth) { if (ok) part.tri(p[a], p[b], p[c]); else part.tri(p[a], p[c], p[b]); continue }
      if (ok) part.tri(p[a], p[b], p[c], undefined, undefined, undefined, [n[a], n[b], n[c]])
      else part.tri(p[a], p[c], p[b], undefined, undefined, undefined, [n[a], n[c], n[b]])
    }
  }
}
const steps = (n: number, a = 0, b = 1) => Array.from({ length: n + 1 }, (_, k) => a + ((b - a) * k) / n)
const CENTRE: V3 = [0, 0, PL + 10]
const t0 = PLINTH / H

for (const map of [(p: V3) => p, turn]) {
  // the shell's frosted glass
  grid(glass, shellAt, steps(NS, 0, NS), steps(NT, t0, 1), CENTRE, map)
  // the end wall at its north end: timber behind clear glass, framing the
  // pointed-arch window
  const ends = (a: number, t: number) => endN(a, t)
  grid(timber, ends, steps(4, -1, 0), steps(NT, BASE_TOP / H, 1), CENTRE, map, false)
  grid(timber, ends, steps(4, 0, 1), steps(NT, BASE_TOP / H, 1), CENTRE, map, false)
  // the window: an equilateral pointed arch from near the shells' edges at
  // the base to the V's foot (a = ±w·half(t), apex at the fold's top), laid
  // on the end wall with a pale frame round it
  const half = (t: number) => Math.max(0, Math.sqrt(4 - 3 * t * t) - 1)
  for (const [part, w, d] of [[metal, 0.96, 0.06], [win, 0.9, 0.12]] as [Part, number, number][]) {
    for (const side of [-1, 1]) {
      const on = (k: number, t: number): V3 => {
        const a = side * w * half(t) * k
        const p = endN(a, t), q = endN(a + side * 0.01, t), r = endN(a, Math.min(1, t + 0.01))
        let n = unit(crs(sub(q, p), sub(r, p)))
        if ((p[0] - CENTRE[0]) * n[0] + (p[1] - CENTRE[1]) * n[1] < 0) n = [-n[0], -n[1], -n[2]]
        return [p[0] + n[0] * d, p[1] + n[1] * d, p[2] + n[2] * d]
      }
      const ts = steps(14, (BASE_TOP / APEX) * 0.9, 1)
      for (let i = 0; i < ts.length - 1; i++) {
        const q = [on(0, ts[i]), on(1, ts[i]), on(1, ts[i + 1]), on(0, ts[i + 1])].map(map)
        const fn = crs(sub(q[1], q[0]), sub(q[2], q[0])), out = sub(q[0], [0, 0, q[0][2]])
        if (fn[0] * out[0] + fn[1] * out[1] >= 0) part.quad(q[0], q[1], q[2], q[3])
        else part.quad(q[0], q[3], q[2], q[1])
      }
    }
  }
}

// ---------------------------------------------------------------------------
// The top: the roof (pale fritted glass and steel, drawn in the frame colour),
// dipping to the V at each end, and the fins along each
// shell's top edge.
{
  const ring: V3[] = []
  // anticlockwise from above: the west top arc runs north to south on the
  // west, then the south end's V, then the east arc south to north, then the
  // north end's V
  for (let i = 0; i <= NS; i++) ring.push(shellW(i, 1))
  ring.push(turn(creaseAt(1)))
  for (let i = 0; i <= NS; i++) ring.push(turn(shellW(i, 1)))
  ring.push(creaseAt(1))
  const c: V3 = [0, 0, PL + ROOF]
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const fn = crs(sub(a, c), sub(b, c))
    if (fn[2] >= 0) metal.tri(c, a, b)
    else metal.tri(c, b, a)
  }
  // fins: blades just inside the rim, over the middle of each top edge
  for (const map of [(p: V3) => p, turn]) {
    for (let k = 0; k < 13; k++) {
      const s = 2.5 + (k * (NS - 5)) / 12, i = Math.floor(s), f = s - i
      const p = lerp3(shellW(i, 1), shellW(i + 1, 1), f)
      const q = lerp3(shellW(i, 1), shellW(i + 1, 1), Math.min(1, f + 0.01))
      const tx = unit(sub(q, p)), nx: V3 = [tx[1], -tx[0], 0]
      const at = (u: number, v: number, z: number): V3 => map([p[0] + tx[0] * u + nx[0] * v, p[1] + tx[1] * u + nx[1] * v, z])
      const w = 0.18, d0 = 0.15, d1 = 0.55, z0 = PL + H - 0.3, z1 = PL + FIN
      const r = [at(-w, d0, 0), at(w, d0, 0), at(w, d1, 0), at(-w, d1, 0)]
      for (let e = 0; e < 4; e++) {
        const a = r[e], b = r[(e + 1) % 4]
        metal.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
        metal.quad([a[0], a[1], z0], [a[0], a[1], z1], [b[0], b[1], z1], [b[0], b[1], z0])
      }
    }
  }
}

// ---------------------------------------------------------------------------
// The concrete "reliquary" base: a plinth under the glass along the long
// sides, the blocks at each end in front of the windows, and the entrance
// canopy at the south end.
const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
function earcut(ring: XY[]): [number, number, number][] {
  const idx = ring.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 5000) {
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = ring[i0], b = ring[i1], c = ring[i2]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(ring[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); break
    }
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}
/** A prism over a polygon, walls from z0 to z1 and a flat top. */
function prism(ring0: XY[], z0: number, z1: number, wall: Part, top: Part | null) {
  const ring = area(ring0) > 0 ? ring0 : [...ring0].reverse()
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    wall.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (top) for (const [a, b, c] of earcut(ring)) top.tri([ring[a][0], ring[a][1], z1], [ring[b][0], ring[b][1], z1], [ring[c][0], ring[c][1], z1])
}
const turn2 = ([x, y]: XY): XY => [-x, -y]
// the plinth: a band round the shells' foot, the outline pushed out 0.4 m
{
  const out = (p: XY): XY => { const l = Math.hypot(p[0], p[1]); return [p[0] * (1 + 0.4 / l), p[1] * (1 + 0.4 / l)] }
  const ring: XY[] = [...bw.map(out), out(turn2(CREASE_BASE)), ...bw.map((p) => out(turn2(p))), out(CREASE_BASE)]
  prism(ring, 0, PL + PLINTH, concrete, concrete)
}
// the north base block (OSM way/782773174, on the lidar) and its turned twin at the south (way/782773173)
const NORTH_BASE: XY[] = [[-4.85, 17.6], [-17.15, 24.3], [-16.45, 25.3], [-11.05, 28.9], [-5.45, 30.1], [0.15, 28.9]]
prism(NORTH_BASE, 0, PL + BASE_TOP, concrete, concrete)
prism(NORTH_BASE.map(turn2), 0, PL + BASE_TOP, concrete, concrete)
// the entrance canopy (way/782773175): a curved concrete wall with the doors in its south face
const CANOPY: XY[] = [[-1.65, -37.9], [2.45, -38.9], [10.25, -38.9], [13.65, -37.9], [17.55, -35.7], [21.55, -32.7], [23.25, -30.3], [16.75, -25.6], [13.45, -28.0], [9.35, -29.7], [5.05, -30.1], [2.05, -29.7]]
prism(CANOPY, 0, PL + 5.0, concrete, concrete)
{
  // the doors: a recessed timber-and-glass bay in the canopy's south face
  const a: XY = [2.45, -38.9], b: XY = [10.25, -38.9]
  door.quad([a[0] + 1.2, a[1] - 0.06, PL], [b[0] - 1.2, b[1] - 0.06, PL], [b[0] - 1.2, b[1] - 0.06, PL + 3.6], [a[0] + 1.2, a[1] - 0.06, PL + 3.6])
}

const parts = [
  { part: glass, material: { ...PALETTE.glass, color: 0xbdd5d3 } },
  { part: win, material: { ...PALETTE.window, color: 0x8fb7b8 } },
  { part: timber, material: finish('ctl-timber', 0xd8bc93) },
  { part: concrete, material: finish('ctl-concrete', 0xc9c6bf) },
  { part: metal, material: finish('ctl-frame', 0xe4e6e4) },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Cathedral of Christ the Light', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: PL + FIN,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/26720620', 'way/782773169', 'way/782773173', 'way/782773174', 'way/782773175'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-christ-the-light.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
