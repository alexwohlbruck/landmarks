/**
 * Westhafen Tower, Frankfurt am Main: procedural, CC0-1.0.
 * bun generators/frankfurt-westhafen-tower.ts   (writes the low and the detail model)
 *
 * Schneider + Schumacher, 2001-2004: a glass cylinder 37.5 m across and
 * 112.3 m high, 30 storeys, on the Main at the old Westhafen. Its skin is
 * 3,556 triangular panes in a diamond net, which gave it the nickname "das
 * Gerippte" after the ribbed Frankfurt apple-wine glass.
 *
 * This file also exports the small kit the other `frankfurt-` towers of
 * this builder (Tower 185, Omniturm, Skyper, Japan Center, Grand Tower)
 * build with: `prism`, `face`, `capRing`, `capHoles`, `smoothWall`, `arc`,
 * `beam`, `ccw`, `saveLods`, `panels`, `bevelTop`, `local`. Most of it is
 * copied from `frankfurt-commerzbank-tower.ts` (same batch, not yet
 * committed). The model is only written when this file runs itself.
 *
 * Identity, in order: the plain round drum, the same width from foot to
 * top; the teal-green glass; the diamond net of pale frames over it,
 * the flat triangular panes faceting the drum; the rim and the low drum of
 * the plant floor on top.
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin: the area
 * centroid of the OSM outline way/33175111 (50.101251, 8.664409). The
 * circle fitted to that outline is centred at (0.15, 1.45), radius 18.75 m
 * (37.5 m published). y = 0 is the lowest ground under the footprint.
 *
 * Numbers:
 * - diameter 37.5 m, height 112.3 m, 30 storeys: published (de.wikipedia
 *   "Westhafen Tower"; en.wikipedia). OSM: height 109, 28 levels on the
 *   outline, the ring relation/20673838 27 levels and the core part
 *   way/1512255040 (radius 12.4 m) 28 levels: the core stands a storey
 *   above the glass ring.
 * - glass to 108.6 m with a 0.6 m rim (a, e); the core drum, radius
 *   12.4 m (OSM), to 112.3 m (published total): estimated from a and e,
 *   where a low pale ribbed cap shows over the rim.
 * - the net: the real one has about 59 diamonds round and a row of
 *   triangles a storey (3,556 panes over 30 storeys; e). The low model
 *   draws 34 round and 22 rows (4.7 m), with the helical frames 0.32 m
 *   wide and no ring frames, so it reads at map distance without
 *   shimmering; the detail model 48 round, 29 rows, frames 0.22-0.24 m.
 *   The panes are flat triangles, so the drum is faceted as the real one
 *   is; the real panes also tilt (e's saw-tooth silhouette), not drawn.
 * - the foot: 4 m of darker recessed glass behind the net (c, g).
 *
 * Evidence (all Wikimedia Commons):
 * - a https://commons.wikimedia.org/wiki/File:Westhafen_Tower_2019.jpg
 *   Thomas Wolf, www.foto-tw.de, CC BY-SA 3.0 de: from the north-east over
 *   the harbour basin, full height, the top cap.
 * - b https://commons.wikimedia.org/wiki/File:Westhafen_Tower,_Frankfurt,_East_view_20170514_1.jpg
 *   DXR, CC BY-SA 4.0: from the east, full height.
 * - c https://commons.wikimedia.org/wiki/File:Westhafen_Tower,_Frankfurt,_Southeast_view_20170205_1.jpg
 *   DXR, CC BY-SA 4.0: from the south-east over the Main, the foot.
 * - d https://commons.wikimedia.org/wiki/File:Frankfurt_am_Main,_de_Westhafen_Tower_IMG_1450_2024-05-26_09.50.jpg
 *   Michielverbeek, CC BY 4.0: from across the Main (south).
 * - e https://commons.wikimedia.org/wiki/File:Westhafen_Tower,_Frankfurt,_East_detail_view_20170205_1.jpg
 *   DXR, CC BY-SA 4.0: the top, the net, the tilted panes, the rim.
 * - f https://commons.wikimedia.org/wiki/File:Frankfurt_Westhafen_Tower_2011b.jpg
 *   Andreas Praefcke, CC BY 3.0: from the east along the river.
 * - g https://commons.wikimedia.org/wiki/File:Westhafen_Tower_01.jpg
 *   Immanuel Giel, CC BY-SA 4.0: from the north-west, the foot.
 * - OSM (API, 2026-11): way/33175111, way/1512255040, relation/20673838.
 * - No lidar (none in Germany). Look-only: none.
 *
 * Colours: the glass a deep teal green, about #2a7a6c in the photos, drawn
 * to #2f8070, kept dark and saturated so the glass dominates; the net's
 * frames a pale grey-green #b7cbc5, so the net reads fine and subtle; the rim and the
 * top drum grey #aab2b4 (a: the cap reads darker than the frames); the
 * foot glass darker #3f6f6a.
 *
 * Night: the glass is `window` (the offices behind it are lit); the foot is
 * `entrance`.
 *
 * Detail model: the net drawn finer, with every frame (above).
 *
 * Doubts: the top cap's height and form are only seen from below (a, e);
 * the net is coarser than the real one, on purpose.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { triangulate, type XY } from './chi-aon-center'
import { polyTris } from './berlin-oberbaum-bridge'

export type { XY }
export type Layer = { part: Part; material: MaterialSpec }

// ───────────────────────────── shared kit ─────────────────────────────────

const signedArea = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
/** The ring, counter-clockwise from above. */
export const ccw = (r: XY[]): XY[] => (signedArea(r) < 0 ? [...r].reverse() : r)

/** Lon/lat to local metres about an anchor. */
export const local = (lon0: number, lat0: number) => {
  const kx = 111320 * Math.cos((lat0 * Math.PI) / 180), ky = 110574
  return (lon: number, lat: number): XY => [(lon - lon0) * kx, (lat - lat0) * ky]
}

/** A flat face with its own normal; winding follows the normal. */
export function face(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n])
}

/** Flat cap over any simple ring at height z. */
export function capRing(p: Part, r: XY[], z: number, up = true) {
  const q = ccw(r)
  for (const [a, b, c] of triangulate(q)) {
    const A: V3 = [q[a][0], q[a][1], z], B: V3 = [q[b][0], q[b][1], z], C: V3 = [q[c][0], q[c][1], z]
    if (up) p.tri(A, B, C); else p.tri(A, C, B)
  }
}

/** Flat cap over a ring with holes (courtyards) at height z. */
export function capHoles(p: Part, r: XY[], holes: XY[][], z: number, up = true) {
  const n: V3 = [0, 0, up ? 1 : -1]
  for (const [a, b, c] of polyTris(r, holes)) face(p, [[a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z]], n)
}

/**
 * A vertical prism over ring r from z0 to z1, walls flat-shaded. `top` and
 * `bottom` cap it (bottom faces down: a soffit). `skip(i)` leaves out the
 * wall from r[i] to r[i+1]. `cw` builds the walls facing inward (a hole).
 */
export function prism(p: Part, r: XY[], z0: number, z1: number, o: { top?: Part | null; bottom?: Part | null; skip?: (i: number) => boolean; inward?: boolean } = {}) {
  let q = ccw(r)
  if (o.inward) q = [...q].reverse()
  for (let i = 0; i < q.length; i++) {
    if (o.skip?.(i)) continue
    const a = q[i], b = q[(i + 1) % q.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (o.inward) return
  if (o.top !== null) capRing(o.top ?? p, q, z1, true)
  if (o.bottom) capRing(o.bottom, q, z0, false)
}

/**
 * A smooth vertical wall along an open polyline (outside on the right of
 * travel when the ring runs counter-clockwise), with per-vertex normals.
 */
export function smoothWall(p: Part, line: XY[], z0: number, z1: number, out = 0) {
  const n = line.map((c, i) => {
    const a = line[Math.max(0, i - 1)], b = line[Math.min(line.length - 1, i + 1)]
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1
    return [dy / l, -dx / l, 0] as V3
  })
  for (let i = 0; i < line.length - 1; i++) {
    const P = (k: number, z: number): V3 => [line[k][0] + n[k][0] * out, line[k][1] + n[k][1] * out, z]
    p.tri(P(i, z0), P(i + 1, z0), P(i + 1, z1), undefined, undefined, undefined, [n[i], n[i + 1], n[i + 1]])
    p.tri(P(i, z0), P(i + 1, z1), P(i, z1), undefined, undefined, undefined, [n[i], n[i + 1], n[i]])
  }
}

/** An arc of points about c from angle a0 to a1 (radians), seg segments. */
export const arc = (c: XY, r: number, a0: number, a1: number, seg: number): XY[] =>
  Array.from({ length: seg + 1 }, (_, i) => { const t = a0 + ((a1 - a0) * i) / seg; return [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)] as XY })

/** A beam of square section w from a to b (all four sides; ends open). */
export function beam(p: Part, a: V3, b: V3, w: number, h = w) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d)
  const t: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const ref: V3 = Math.abs(t[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const cr = (x: V3, y: V3): V3 => [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]]
  const nz = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
  const u = nz(cr(t, ref)), v = nz(cr(t, u))
  const C = (q: V3, i: number, j: number): V3 => [q[0] + (u[0] * i * w + v[0] * j * h) / 2, q[1] + (u[1] * i * w + v[1] * j * h) / 2, q[2] + (u[2] * i * w + v[2] * j * h) / 2]
  const sq = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
  for (let k = 0; k < 4; k++) {
    const [i0, j0] = sq[k], [i1, j1] = sq[(k + 1) % 4]
    const nn = nz([u[0] * (i0 + i1) + v[0] * (j0 + j1), u[1] * (i0 + i1) + v[1] * (j0 + j1), u[2] * (i0 + i1) + v[2] * (j0 + j1)])
    face(p, [C(a, i0, j0), C(a, i1, j1), C(b, i1, j1), C(b, i0, j0)], nn)
  }
}

/**
 * The top edge of a prism over ring r, chamfered: the walls run to z - b,
 * a sloped band takes them in by b to z, and the roof caps the inset ring.
 * Call with the prism built to z - b and `top: null`.
 */
export function bevelTop(wall: Part, roof: Part, r: XY[], z: number, b = 0.5) {
  const q = ccw(r), qi = insetRing(q, b)
  for (let i = 0; i < q.length; i++) {
    const j = (i + 1) % q.length
    wall.quad([q[i][0], q[i][1], z - b], [q[j][0], q[j][1], z - b], [qi[j][0], qi[j][1], z], [qi[i][0], qi[i][1], z])
  }
  capRing(roof, qi, z)
}

/** A ring moved inward by d (counter-clockwise rings; negative d grows it). */
export function insetRing(r: XY[], d: number): XY[] {
  const q = ccw(r), n = q.length
  const nrm = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l] }
  return q.map((c, i) => {
    const n1 = nrm(q[(i - 1 + n) % n], c), n2 = nrm(c, q[(i + 1) % n])
    const k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    return [c[0] + ((n1[0] + n2[0]) / Math.max(k, 0.2)) * d, c[1] + ((n1[1] + n2[1]) / Math.max(k, 0.2)) * d] as XY
  })
}

/**
 * Window panels on a straight wall from a to b (outside on the right of
 * travel), between z0 and z1: `bay` metres a bay, the panel `fill` of it,
 * `rows` storey groups, each panel `sill` short of its group's top and
 * bottom. Panels stand `out` in front of the wall.
 */
export function panels(p: Part, a: XY, b: XY, z0: number, z1: number, o: { bay: number; fill: number; rows: number; sill?: number; out?: number; end?: number }) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy)
  if (L < o.bay * 0.8) return
  const t: XY = [dx / L, dy / L], n: V3 = [t[1], -t[0], 0], out = o.out ?? 0.05, end = o.end ?? 0.6
  const nb = Math.max(1, Math.round((L - 2 * end) / o.bay)), bw = (L - 2 * end) / nb, w = bw * o.fill
  const h = (z1 - z0) / o.rows, sill = o.sill ?? 0.6
  for (let r = 0; r < o.rows; r++) {
    const za = z0 + r * h + sill, zb = z0 + (r + 1) * h - sill
    for (let k = 0; k < nb; k++) {
      const s0 = end + k * bw + (bw - w) / 2, s1 = s0 + w
      const P = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * out, a[1] + t[1] * s + n[1] * out, z]
      face(p, [P(s0, za), P(s1, za), P(s1, zb), P(s0, zb)], n)
    }
  }
}

/**
 * A flat strip from a to b, w wide, lying on a surface whose outward
 * direction is horizontal and radial from the z axis through `c` (a frame
 * line on a round skin), standing `out` in front of it.
 */
export function strip(p: Part, a: V3, b: V3, w: number, c: XY = [0, 0], out = 0.07) {
  const m: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0]
  const rl = Math.hypot(m[0] - c[0], m[1] - c[1]) || 1
  const n: V3 = [(m[0] - c[0]) / rl, (m[1] - c[1]) / rl, 0]
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  // across = n x d, normalised
  let u: V3 = [n[1] * d[2] - n[2] * d[1], n[2] * d[0] - n[0] * d[2], n[0] * d[1] - n[1] * d[0]]
  const ul = Math.hypot(...u) || 1
  u = [(u[0] / ul) * w / 2, (u[1] / ul) * w / 2, (u[2] / ul) * w / 2]
  const o = (q: V3, sgn: number): V3 => [q[0] + n[0] * out + u[0] * sgn, q[1] + n[1] * out + u[1] * sgn, q[2] + u[2] * sgn]
  face(p, [o(a, -1), o(b, -1), o(b, 1), o(a, 1)], n)
}

/** Write the low model and, when given, the detail model, checking the budgets. */
export async function saveLods(id: string, name: string, low: Layer[], detail: Layer[] | null, extras: Record<string, unknown>, lowMax = 5000) {
  const out: [string, Layer[], number, number][] = [[`${id}.glb`, low, lowMax, 250 * 1024]]
  if (detail) out.push([`${id}.detail.glb`, detail, 40000, 1536 * 1024])
  for (const [file, layers, maxT, maxB] of out) {
    const used = layers.filter((l) => l.part.triangles > 0)
    const tris = used.reduce((s, l) => s + l.part.triangles, 0)
    if (tris > maxT) throw new Error(`${file}: ${tris} triangles, over ${maxT} (${used.map((l) => `${l.material.name} ${l.part.triangles}`).join(', ')})`)
    if (used.length > 6) throw new Error(`${file}: ${used.length} materials`)
    const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...extras })
    if (glb.length > maxB) throw new Error(`${file}: ${glb.length} bytes, over ${maxB}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes (${used.map((l) => `${l.material.name} ${l.part.triangles}`).join(', ')})`)
  }
}

// ───────────────────────────── Westhafen Tower ─────────────────────────────

const ID = 'frankfurt-westhafen-tower'
const C: XY = [0.15, 1.45]
const R = 18.75
const STOREY = 3.6, FOOT = 4, GLASS_TOP = 108.6, RIM = 0.6
const CORE_R = 12.4, TOP = 112.3

type Set = { glass: Part; frame: Part; pale: Part; foot: Part }
const mk = (): Set => ({ glass: new Part(), frame: new Part(), pale: new Part(), foot: new Part() })

/**
 * A ribbon along a polyline on a round skin about the vertical axis through
 * c: w wide, `out` in front, smooth-shaded so neighbouring segments share
 * their vertices.
 */
export function ribbon(p: Part, pts: V3[], w: number, c: XY, out: number) {
  const nrm = (q: V3): V3 => { const l = Math.hypot(q[0] - c[0], q[1] - c[1]) || 1; return [(q[0] - c[0]) / l, (q[1] - c[1]) / l, 0] }
  const side = pts.map((q, k) => {
    const a = pts[Math.max(0, k - 1)], b = pts[Math.min(pts.length - 1, k + 1)]
    const t: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], n = nrm(q)
    const u: V3 = [n[1] * t[2] - n[2] * t[1], n[2] * t[0] - n[0] * t[2], n[0] * t[1] - n[1] * t[0]]
    const l = Math.hypot(...u) || 1
    const o = (sg: number): V3 => [q[0] + n[0] * out + (u[0] / l) * sg * w / 2, q[1] + n[1] * out + (u[1] / l) * sg * w / 2, q[2] + (u[2] / l) * sg * w / 2]
    return { L: o(-1), R: o(1), n }
  })
  for (let k = 0; k < pts.length - 1; k++) {
    const A = side[k], B = side[k + 1]
    p.tri(A.L, B.L, B.R, undefined, undefined, undefined, [A.n, B.n, B.n])
    p.tri(A.L, B.R, A.R, undefined, undefined, undefined, [A.n, B.n, A.n])
  }
}

function build(s: Set, detail: boolean) {
  // N diamonds round; ROWS rows of triangles (the real net: about 59 round,
  // one storey a row; drawn coarser so it reads at map distance)
  const N = detail ? 48 : 34
  const rows = detail ? 29 : 22
  const h = (GLASS_TOP - FOOT) / rows
  // a node by half-step angle A and ring k
  const Q = (A: number, k: number, r = R): V3 => {
    const a = (A / (2 * N)) * 2 * Math.PI
    return [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a), FOOT + k * h]
  }
  for (let k = 0; k < rows; k++) {
    const off = k % 2
    for (let i = 0; i < N; i++) {
      // up-pane: base on ring k, apex on ring k+1; down-pane: base on ring k+1
      const a0 = Q(2 * i + off, k), a1 = Q(2 * i + 2 + off, k)
      const b0 = Q(2 * i + 1 + off, k + 1), b1 = Q(2 * i + 3 + off, k + 1)
      s.glass.tri(a0, a1, b0)
      s.glass.tri(a1, b1, b0)
    }
  }
  // the net: helical frames both ways, and (detail) a ring at every row
  const w = detail ? 0.24 : 0.32
  for (let j = 0; j < N; j++) {
    for (const dir of [1, -1]) {
      const pts = Array.from({ length: rows + 1 }, (_, k) => Q(2 * j + dir * k, k))
      ribbon(s.frame, pts, w, C, dir > 0 ? 0.08 : 0.12)
    }
  }
  if (detail) for (let k = 1; k < rows; k++) {
    const pts = Array.from({ length: 2 * N + 1 }, (_, A) => Q(A, k))
    ribbon(s.frame, pts, 0.22, C, 0.1)
  }
  // the foot: darker glass set 1.2 m back, under the first row's soffit
  const seg = detail ? 48 : 32
  const footRing = arc(C, R - 1.2, 0, 2 * Math.PI, seg).slice(0, -1)
  prism(s.foot, footRing, 0, FOOT, { top: null })
  const outer = Array.from({ length: N }, (_, i) => Q(2 * i, 0)).map((p) => [p[0], p[1]] as XY)
  capRing(s.frame, outer, FOOT, false)
  // a pale plinth under the foot glass (c, g)
  const plinth = arc(C, R - 1.0, 0, 2 * Math.PI, seg).slice(0, -1)
  prism(s.pale, plinth, 0, 0.5, { top: null })
  // the rim: a pale band round the top edge, and the roof inside it
  const rimRing = arc(C, R + 0.05, 0, 2 * Math.PI, N).slice(0, -1)
  smoothWall(s.pale, [...rimRing, rimRing[0]], GLASS_TOP, GLASS_TOP + RIM, 0)
  capRing(s.pale, rimRing, GLASS_TOP + RIM)
  // the plant drum on the roof: a pale ribbed ring (a, e)
  const coreSeg = detail ? 48 : 24
  const core = arc(C, CORE_R, 0, 2 * Math.PI, coreSeg).slice(0, -1)
  prism(s.pale, core, GLASS_TOP + RIM, TOP - 0.4, { top: null })
  bevelTop(s.pale, s.pale, core, TOP, 0.4)
}

const mats = (s: Set): Layer[] => [
  { part: s.glass, material: { ...PALETTE.window, color: 0x2f8070 } },
  { part: s.frame, material: finish('westhafen-frame', 0xb7cbc5) },
  { part: s.pale, material: finish('westhafen-rim', 0xaab2b4) },
  { part: s.foot, material: { ...PALETTE.entrance, color: 0x3f6f6a } },
]

if (import.meta.main) {
  const low = mk(), det = mk()
  build(low, false)
  build(det, true)
  await saveLods(ID, 'Westhafen Tower', mats(low), mats(det), {
    anchor: [50.101251, 8.664409], bearing: 0, elevation: 0, height: TOP,
  })
}
