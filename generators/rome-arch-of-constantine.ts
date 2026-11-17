/**
 * Arch of Constantine, Rome — procedural, CC0-1.0, no textures or source mesh.
 * bun generators/rome-arch-of-constantine.ts
 *
 * Map frame: x along the arch's long axis (east-south-east), y across it
 * (north-north-east toward the Colosseum), z up, metres. Placed at bearing
 * 12.9°, so the long axis runs at 102.9° as the OSM outline does and the
 * model's north face is the face toward the Colosseum.
 *
 * This file also exports the small sculpting kit (bevelled boxes, lathes,
 * tubes, raised reliefs, smooth placement) that `rome-trajans-column.ts`
 * imports; its own build only runs as a script. Merge it first.
 *
 * Sources
 * - OSM way/23590989 (building=triumphal_arch, height=21, wikidata Q5786):
 *   outline 25.4 × 6.9 m, long axis 102.9°. Centroid 12.490667, 41.889762.
 * - Published: Wikipedia "Arch of Constantine" — 21 m high, 25.9 m wide,
 *   7.4 m deep; central archway 11.5 m high × 6.5 m wide; side archways
 *   7.4 × 3.4 m; tondi about 2.4 m across.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   1. South face, frontal: "Arch of Constantine (Rome) - South side, from Via
 *      triumphalis.jpg", NikonZ7II (Paris Orlando), CC BY-SA 4.0,
 *      https://commons.wikimedia.org/wiki/File:Arch_of_Constantine_(Rome)_-_South_side,_from_Via_triumphalis.jpg
 *   2. North face from the Colosseum: "Arch of Constantine, North face, Rome
 *      (8130476116).jpg", Carole Raddato, CC BY-SA 2.0,
 *      https://commons.wikimedia.org/wiki/File:Arch_of_Constantine,_North_face,_Rome_(8130476116).jpg
 *   3. West end from above: "Arch of Constantine (Rome) ,lateral view.jpg",
 *      Livioandronico2013, CC BY-SA 4.0,
 *      https://commons.wikimedia.org/wiki/File:Arch_of_Constantine_(Rome)_,lateral_view.jpg
 *   4. From the Palatine: "Colosseum and Arch of Constantine seen from
 *      Palatine.jpg", Livioandronico2013, CC BY-SA 4.0,
 *      https://commons.wikimedia.org/wiki/File:Colosseum_and_Arch_of_Constantine_seen_from_Palatine.jpg
 *   5. A Dacian in profile: "ArcoCostDaceN1profilo.jpg", MM, CC BY-SA 4.0,
 *      https://commons.wikimedia.org/wiki/File:ArcoCostDaceN1profilo.jpg
 *   6. "Arch of Constantine from the Colosseum - Rome, Italy - DSC01410.jpg",
 *      Daderot, public domain (looked at for the north side and colours).
 * - Terrain: Mapterhorn z13 (z14+ not served here) falls about 1.3 m from
 *   the west end to the east end of the footprint; elevation stays 0.
 *
 * Numbers
 * - Published: overall 21.0 × 25.9 × 7.4 m (body); central opening 6.5 m
 *   wide; tondo diameter 2.3 m.
 * - Measured on photo 1 (frontal, verticals corrected; 37 px/m across, 34.5
 *   px/m up to make 25.9 × 21 m): column axes ±5.15 and ±11.95 m; side
 *   openings at ±8.1 m, 3.6 m wide, crown 7.25 m; central crown 11.25 m
 *   (photo 11.0, published 11.5); pedestals 3.8 m; column shafts to 11.75 m,
 *   capitals to 13.2 m; entablature 13.2–16.0 m; attic 16.0–21.0 m with the
 *   statue plinths 16.0–17.1 m; Dacians 3.2 m; Constantinian frieze band
 *   8.0–9.0 m; tondo centres 10.2 m; attic panels and inscription field.
 * - Estimated from photo 3: columns stand 1.1 m clear of the wall on
 *   pedestals projecting 2.25 m; the statues 1.25 m in front of the attic.
 * - Invented (abstracted): the figures inside every relief, drawn as a few
 *   raised silhouettes, and the Dacians' exact pose beyond photo 5's (head
 *   bowed, hands clasped in front, cloak, trousers).
 *
 * - Colours from photos 1 and 2: grey-white marble with the relief fields,
 *   frieze bands and attic panels a weathered darker grey and the carved
 *   figures between the two; the giallo antico columns only a pale
 *   weathered yellow-grey, a little warmer than the marble.
 * - The dedication is drawn as seven lines of word-length strokes, not
 *   letters: the lettering kit would cost several thousand triangles.
 * - The side passages are open straight through; each wall carries a relief
 *   field with a medallion bust, as on the real arch.
 *
 * Doubts: the photo scales disagree by 7% (width vs height); published
 * totals win. The OSM outline is 0.5 m narrower and shallower than the
 * published body. The east end has no photo of its own; it mirrors the
 * west end, as the real arch does. No look-only sources were used.
 *
 * Night: the arch is floodlit, so every stone material carries a
 * `floodlight` wash, brightest low on the faces.
 */
import { Part, addGltfTriangles, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'

// ---------------------------------------------------------------- the kit

export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const TAU = Math.PI * 2

/** A flat polygon with a known outward normal; any winding in, the right one out. */
export function face(p: Part, pts: V3[], n: V3) {
  const tris = earcut3(pts, n)
  for (const [a, b, c] of tris) {
    const g = cross(sub(pts[b], pts[a]), sub(pts[c], pts[a]))
    if (dot(g, n) >= 0) p.tri(pts[a], pts[b], pts[c])
    else p.tri(pts[a], pts[c], pts[b])
  }
}

/** Ear clipping of a simple planar polygon, projected along its normal. */
function earcut3(pts: V3[], n: V3): [number, number, number][] {
  const ax = Math.abs(n[0]) > Math.abs(n[1]) ? (Math.abs(n[0]) > Math.abs(n[2]) ? 0 : 2) : (Math.abs(n[1]) > Math.abs(n[2]) ? 1 : 2)
  const [i0, i1] = ax === 0 ? [1, 2] : ax === 1 ? [2, 0] : [0, 1]
  const P = pts.map((p) => [p[i0], p[i1]])
  let area = 0
  for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; area += a[0] * b[1] - b[0] * a[1] }
  const idx = P.map((_, i) => i)
  if (area < 0) idx.reverse()
  const out: [number, number, number][] = []
  const crossz = (a: number[], b: number[], c: number[]) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 1000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const ia = idx[(k + idx.length - 1) % idx.length], ib = idx[k], ic = idx[(k + 1) % idx.length]
      const a = P[ia], b = P[ib], c = P[ic]
      if (crossz(a, b, c) <= 1e-12) continue
      let inside = false
      for (const j of idx) {
        if (j === ia || j === ib || j === ic) continue
        const q = P[j]
        if (crossz(a, b, q) >= 0 && crossz(b, c, q) >= 0 && crossz(c, a, q) >= 0) { inside = true; break }
      }
      if (inside) continue
      out.push([ia, ib, ic]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/**
 * Copy a scratch part into `dst`, moved by `fn`, smooth-shaded within
 * `crease` degrees. `mirror` says `fn` is a reflection, so winding flips.
 */
export function place(dst: Part, src: Part, fn: (p: V3) => V3 = (p) => p, crease = 0, mirror = false) {
  const pos = new Float32Array(src.pos.length)
  for (let i = 0; i < src.pos.length; i += 9) {
    for (let k = 0; k < 3; k++) {
      const j = mirror ? [0, 2, 1][k] : k
      const o = i + j * 3
      const m: V3 = fn([src.pos[o], -src.pos[o + 2], src.pos[o + 1]])
      pos.set([m[0], m[2], -m[1]], i + k * 3)
    }
  }
  if (crease >= 180) {
    // Fully smooth: one area-weighted normal per position, so every corner
    // at a point welds into one vertex. For sculpture.
    const P = (i: number): V3 => [pos[i * 3], -pos[i * 3 + 2], pos[i * 3 + 1]]
    const key = (p: V3) => p.map((x) => Math.round(x * 1e4)).join(',')
    const sum = new Map<string, V3>()
    const tris: V3[][] = []
    for (let i = 0; i < pos.length / 3; i += 3) {
      const t = [P(i), P(i + 1), P(i + 2)]
      const g = cross(sub(t[1], t[0]), sub(t[2], t[0]))
      if (Math.hypot(...g) < 1e-12) continue
      tris.push(t)
      for (const q of t) sum.set(key(q), add(sum.get(key(q)) ?? [0, 0, 0], g))
    }
    for (const t of tris) dst.tri(t[0], t[1], t[2], undefined, undefined, undefined, t.map((q) => unit(sum.get(key(q))!)))
    return
  }
  const index = Uint32Array.from({ length: pos.length / 3 }, (_, i) => i)
  addGltfTriangles(dst, pos, index, crease > 0 ? { creaseDegrees: crease } : {})
}

/** Turn about z by `deg` (clockwise seen from above is negative) then move. */
export const turn = (deg: number, at: V3) => (p: V3): V3 => {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a)
  return [at[0] + p[0] * c - p[1] * s, at[1] + p[0] * s + p[1] * c, at[2] + p[2]]
}

/** A rectangle ring with chamfered corners (8 points, CCW from above). */
export function rectRing(x0: number, x1: number, y0: number, y1: number, z: number, c: number): V3[] {
  if (c <= 0) return [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  return [[x0 + c, y0, z], [x1 - c, y0, z], [x1, y0 + c, z], [x1, y1 - c, z],
    [x1 - c, y1, z], [x0 + c, y1, z], [x0, y1 - c, z], [x0, y0 + c, z]]
}

/**
 * A box, its vertical edges chamfered by `c` and its top edge by `t`,
 * smooth-shaded across the chamfers so the edges catch a soft highlight.
 */
export function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number,
  { c = 0, t = 0, b = 0, top = true, bottom = false } = {}) {
  const s = new Part()
  const rings: V3[][] = []
  if (b > 0) rings.push(rectRing(x0 + b, x1 - b, y0 + b, y1 - b, z0, Math.max(0, c - b * 0.4)))
  rings.push(rectRing(x0, x1, y0, y1, z0 + b, c))
  rings.push(rectRing(x0, x1, y0, y1, z1 - t, c))
  if (t > 0) rings.push(rectRing(x0 + t, x1 - t, y0 + t, y1 - t, z1, Math.max(0, c - t * 0.4)))
  s.loft(rings)
  if (top) s.cap(rings[rings.length - 1], true)
  if (bottom) s.cap(rings[0], false)
  place(p, s, undefined, c > 0 || t > 0 || b > 0 ? 50 : 0)
}

/** A surface of revolution about the vertical through (cx, cy): profile [r, z] bottom to top. */
export function lathe(p: Part, cx: number, cy: number, profile: [number, number][], n = 16,
  { top = true, bottom = false, crease = 60, phase = 0 } = {}) {
  const s = new Part()
  const rings = profile.map(([r, z]) => Array.from({ length: n }, (_, i): V3 => {
    const a = (i / n) * TAU + phase
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
  }))
  s.loft(rings)
  if (top && profile[profile.length - 1][0] > 1e-3) s.cap(rings[rings.length - 1], true)
  if (bottom && profile[0][0] > 1e-3) s.cap(rings[0], false)
  place(p, s, undefined, crease)
}

/** Elliptic ring at height z, CCW from above. */
export const ellipse = (cx: number, cy: number, z: number, rx: number, ry: number, n = 8, phase = 0): V3[] =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * TAU + phase
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a), z]
  })

/**
 * A round tube along a path, radius per point, closed at both ends — limbs,
 * wreaths, rolls. Rings are built so the surface faces out.
 */
export function tube(p: Part, path: V3[], radii: number[], n = 6, { caps = true, closed = false } = {}) {
  const rings: V3[][] = []
  let prevA: V3 | null = null
  const m = path.length
  for (let k = 0; k < m; k++) {
    const a = closed ? path[(k - 1 + m) % m] : path[Math.max(0, k - 1)]
    const b = closed ? path[(k + 1) % m] : path[Math.min(m - 1, k + 1)]
    const T = unit(sub(b, a))
    // A frame that turns as little as it can from the last one.
    let A: V3 = prevA ?? (Math.abs(T[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])
    A = unit(sub(A, mul(T, dot(A, T))))
    const B = cross(T, A)
    prevA = A
    rings.push(Array.from({ length: n }, (_, i) => {
      const t = (i / n) * TAU
      // A × B = T keeps the loft facing out (see Part.loft).
      return add(path[k], add(mul(A, radii[k] * Math.cos(t)), mul(B, radii[k] * Math.sin(t))))
    }))
  }
  if (closed) rings.push(rings[0])
  p.loft(rings)
  if (caps && !closed) {
    face(p, rings[0], unit(sub(path[0], path[1])))
    face(p, rings[rings.length - 1], unit(sub(path[m - 1], path[m - 2])))
  }
}

/** Closed loft of rings plus a top cap; for figures. */
export function body(p: Part, rings: V3[][], { top = true, bottom = false } = {}) {
  p.loft(rings)
  if (top) p.cap(rings[rings.length - 1], true)
  if (bottom) p.cap(rings[0], false)
}

/**
 * A raised relief: a silhouette in face coordinates (u right, v up) on the
 * plane O + uU + vV, standing `h` proud along N from `d0`. The front is
 * drawn a little smaller than the foot, so the sides slope like carving.
 */
export function raised(p: Part, O: V3, U: V3, V: V3, N: V3, outline: [number, number][], h: number, d0 = 0, slope = 0.85) {
  const cu = outline.reduce((s, q) => s + q[0], 0) / outline.length
  const cv = outline.reduce((s, q) => s + q[1], 0) / outline.length
  const at = (u: number, v: number, d: number): V3 => add(add(add(O, mul(U, u)), mul(V, v)), mul(N, d))
  const target = p
  p = new Part()
  const foot = outline.map(([u, v]) => at(u, v, d0))
  const front = outline.map(([u, v]) => at(cu + (u - cu) * slope, cv + (v - cv) * slope, d0 + h))
  face(p, front, N)
  if (h < 0.07) { place(target, p); return }
  // Winding of the walls from the outline's turning direction in (u, v).
  let area = 0
  for (let i = 0; i < outline.length; i++) {
    const a = outline[i], b = outline[(i + 1) % outline.length]
    area += a[0] * b[1] - b[0] * a[1]
  }
  for (let i = 0; i < outline.length; i++) {
    const j = (i + 1) % outline.length
    const [a, b, c, d] = area > 0 ? [foot[i], foot[j], front[j], front[i]] : [foot[j], foot[i], front[i], front[j]]
    const g = cross(sub(b, a), sub(c, a))
    if (Math.hypot(...g) < 1e-9) continue
    p.quad(a, b, c, d)
  }
  place(target, p, undefined, 180)
}

/** A flat-shaded quad with a known outward normal. */
export function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  p.tri(a, c, d, undefined, undefined, undefined, [n, n, n])
}

// ---------------------------------------------------------------- the arch

const W = 12.95, D = 3.7          // body half-width and half-depth
const BODY = 13.2                 // top of the arcaded block, underside of the architrave
type Opening = { cx: number; h: number; spring: number; seg: number }
const OPENINGS: Opening[] = [
  { cx: -8.1, h: 1.8, spring: 5.45, seg: 8 },
  { cx: 0, h: 3.25, spring: 8.0, seg: 12 },
  { cx: 8.1, h: 1.8, spring: 5.45, seg: 8 },
]
const COLS = [-11.95, -5.15, 5.15, 11.95]
const YC = D + 1.1                // column axis off the wall
const PED = 3.77                  // top of the pedestals
const SHAFT0 = 4.25, SHAFT1 = 11.75
const AT0 = 16.0, AT1 = 17.1, AT2 = 20.4, TOP = 21.0
const AW = W - 0.1, AD = D - 0.1

type Shape = [number, number][]
// Relief silhouettes in metres about their foot point.
const FIG: Shape = [[-0.2, 0], [0.2, 0], [0.28, 1.3], [0.13, 1.5], [0.13, 1.85], [-0.13, 1.85], [-0.13, 1.5], [-0.28, 1.3]]
const MARCHER: Shape = [[-0.22, 0], [0.22, 0], [0.3, 1.3], [0.12, 1.85], [-0.12, 1.85], [-0.3, 1.3]]
const RIDER: Shape = [[-0.9, 0], [-0.7, 0.55], [-0.85, 0.95], [-0.3, 0.95], [-0.2, 1.6], [0.15, 1.6], [0.2, 0.95], [0.75, 0.95], [0.95, 1.3], [0.75, 0]]
const VICTORY: Shape = [[-0.3, 0.1], [0.3, 0.1], [0.35, 1.2], [0.8, 1.95], [0.15, 1.7], [0.13, 2.05], [-0.13, 2.05], [-0.15, 1.7], [-0.8, 1.95], [-0.35, 1.2]]
const CAPTIVE: Shape = [[-0.35, 0.1], [0.35, 0.1], [0.32, 1.2], [0.14, 1.6], [0.16, 1.95], [-0.14, 1.95], [-0.16, 1.6], [-0.38, 1.3]]
const fig = (shape: Shape, u: number, v: number, k: number, flip = 1): Shape => shape.map(([a, b]) => [u + a * k * flip, v + b * k])
const rect = (u0: number, u1: number, v0: number, v1: number): Shape => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]
const UP: V3 = [0, 0, 1]

const arcPts = (o: Opening) => Array.from({ length: o.seg + 1 }, (_, i) => {
  const a = Math.PI - (i * Math.PI) / o.seg
  return [o.cx + o.h * Math.cos(a), o.spring + o.h * Math.sin(a)] as [number, number]
})

/**
 * A standing Dacian prisoner, sculpted in the round after photo 5:
 * trousered legs, a knee-length belted tunic, a cloak full at the back,
 * arms hanging to hands clasped in front, head bowed under a soft Phrygian
 * cap, a full beard. Faces +y, feet at the origin, `h` tall.
 */
export function dacian(h = 3.2) {
  const p = new Part()
  const k = h / 3.2
  for (const sx of [-1, 1]) {
    tube(p, [[sx * 0.15 * k, 0.04 * k, 0], [sx * 0.13 * k, 0, 1.0 * k]], [0.12 * k, 0.14 * k], 4, { caps: false })
  }
  // Tunic skirt over the cloak, belt, chest, shoulders, neck.
  const R = (z: number, rx: number, ryF: number, ryB: number, dy = 0): V3[] =>
    Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * TAU + TAU / 16
      const ry = Math.sin(a) > 0 ? ryF : ryB
      return [rx * Math.cos(a) * k, (dy + ry * Math.sin(a)) * k, z * k]
    })
  body(p, [
    R(0.78, 0.44, 0.3, 0.4), R(1.75, 0.36, 0.24, 0.34),
    R(2.2, 0.42, 0.26, 0.33), R(2.46, 0.5, 0.23, 0.3), R(2.6, 0.24, 0.15, 0.19, 0.03),
  ], { bottom: true })
  // Head bowed forward, the beard spreading onto the chest.
  const H = (z: number, r: number, dy: number, ryF = r): V3[] =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * TAU + TAU / 12
      return [r * Math.cos(a) * k, (dy + (Math.sin(a) > 0 ? ryF : r) * Math.sin(a)) * k, z * k]
    })
  body(p, [H(2.4, 0.1, 0.16, 0.12), H(2.62, 0.17, 0.12, 0.21), H(2.84, 0.17, 0.07), H(2.97, 0.12, 0.04)])
  // Phrygian cap, its tip curling forward.
  tube(p, [[0, 0.02 * k, 2.92 * k], [0, 0.07 * k, 3.08 * k], [0, 0.2 * k, 3.15 * k]], [0.17 * k, 0.12 * k, 0.04 * k], 4)
  // Arms from the shoulders to the clasped hands at the front of the belt.
  for (const sx of [-1, 1]) {
    tube(p, [[sx * 0.45 * k, 0, 2.4 * k], [sx * 0.5 * k, 0.06 * k, 1.95 * k], [sx * 0.06 * k, 0.36 * k, 1.66 * k]], [0.14 * k, 0.12 * k, 0.1 * k], 4, { caps: false })
  }
  return p
}

function buildArch() {
  const marble = new Part()   // piers, walls, attic
  const white = new Part()    // mouldings, pedestals, statues, raised figures
  const relief = new Part()   // relief fields, weathered grey
  const giallo = new Part()   // the giallo antico columns
  const vault = new Part()    // passage soffits and jambs, in shade
  const roof = new Part()     // the attic's flat top

  // ------------------------------------------------ the arcaded block
  // The long faces as vertical strips, so the three openings are real holes.
  for (const s of [1, -1]) {
    const y = s * D, n: V3 = [0, s, 0]
    let x = -W
    for (const o of OPENINGS) {
      quadN(marble, [x, y, 0], [o.cx - o.h, y, 0], [o.cx - o.h, y, BODY], [x, y, BODY], n)
      const pts = arcPts(o)
      for (let i = 0; i < pts.length - 1; i++) {
        const [xa, za] = pts[i], [xb, zb] = pts[i + 1]
        quadN(marble, [xa, y, za], [xb, y, zb], [xb, y, BODY], [xa, y, BODY], n)
      }
      x = o.cx + o.h
    }
    quadN(marble, [x, y, 0], [W, y, 0], [W, y, BODY], [x, y, BODY], n)
    quadN(marble, [s * W, -D, 0], [s * W, D, 0], [s * W, D, BODY], [s * W, -D, BODY], [s, 0, 0])
  }
  // Jambs and barrel vaults through each opening.
  for (const o of OPENINGS) {
    for (const s of [-1, 1]) {
      const x = o.cx + s * o.h
      quadN(vault, [x, -D, 0], [x, D, 0], [x, D, o.spring], [x, -D, o.spring], [-s, 0, 0])
    }
    const pts = arcPts(o)
    for (let i = 0; i < pts.length - 1; i++) {
      const [xa, za] = pts[i], [xb, zb] = pts[i + 1]
      const na = unit([o.cx - xa, 0, o.spring - za]), nb = unit([o.cx - xb, 0, o.spring - zb])
      vault.tri([xa, -D, za], [xb, -D, zb], [xb, D, zb], undefined, undefined, undefined, [na, nb, nb])
      vault.tri([xa, -D, za], [xb, D, zb], [xa, D, za], undefined, undefined, undefined, [na, nb, na])
    }
  }
  // Archivolts: a moulded ring proud of both faces round every arch.
  for (const o of OPENINGS) {
    const width = o.h > 3 ? 0.85 : 0.55, proj = o.h > 3 ? 0.22 : 0.17
    for (const s of [1, -1]) {
      const y = s * D, fn: V3 = [0, s, 0]
      for (let i = 0; i < o.seg; i++) {
        const a = Math.PI - (i * Math.PI) / o.seg, b = Math.PI - ((i + 1) * Math.PI) / o.seg
        const at = (r: number, d: number, t: number): V3 => [o.cx + r * Math.cos(t), y + s * d, o.spring + r * Math.sin(t)]
        const radial = (t: number): V3 => [Math.cos(t), 0, Math.sin(t)]
        const ri = o.h, ro = o.h + width
        quadN(white, at(ri, proj, a), at(ro, proj, a), at(ro, proj, b), at(ri, proj, b), fn)
        white.tri(at(ro, 0, a), at(ro, proj, a), at(ro, proj, b), undefined, undefined, undefined, [radial(a), radial(a), radial(b)])
        white.tri(at(ro, 0, a), at(ro, proj, b), at(ro, 0, b), undefined, undefined, undefined, [radial(a), radial(b), radial(b)])
        if (o.h > 3) {
          const ia = mul(radial(a), -1), ib = mul(radial(b), -1)
          white.tri(at(ri, 0, a), at(ri, proj, b), at(ri, proj, a), undefined, undefined, undefined, [ia, ib, ia])
          white.tri(at(ri, 0, a), at(ri, 0, b), at(ri, proj, b), undefined, undefined, undefined, [ia, ib, ib])
        }
      }
    }
    // Impost mouldings where the arch springs, through the passage.
    for (const s of [-1, 1]) {
      const inner = o.cx + s * (o.h - 0.16), outer = o.cx + s * (o.h + (o.h > 3 ? 1.15 : 0.65))
      box(white, Math.min(inner, outer), Math.max(inner, outer), -D - 0.2, D + 0.2, o.spring - 0.45, o.spring, { t: 0.08, bottom: true })
    }
  }
  // Keystones of the central arch, bold blocks carrying a small figure.
  for (const s of [1, -1]) {
    const o = OPENINGS[1], y0 = s * D, y1 = s * (D + 0.45)
    box(white, -0.5, 0.5, Math.min(y0, y1), Math.max(y0, y1), o.spring + o.h - 0.25, o.spring + o.h + 1.2, { bottom: true })
  }

  // ------------------------------------------------ pedestals, pilasters, columns
  for (const xc of COLS) for (const s of [1, -1]) {
    const y0 = s * D, yc = s * YC
    const span = (a: number, b: number) => [Math.min(a, b), Math.max(a, b)] as const
    // Pilaster on the wall behind the column.
    const [p0, p1] = span(y0, y0 + s * 0.16)
    box(marble, xc - 0.5, xc + 0.5, p0, p1, PED, BODY, { top: false })
    // Pedestal: moulded foot, the die, a moulded cap.
    const yF = yc + s * 1.12
    const [f0, f1] = span(y0 - s * 0.05, yF + s * 0.16)
    box(white, xc - 1.28, xc + 1.28, f0, f1, 0, 0.55, { t: 0.14 })
    const [d0, d1] = span(y0 - s * 0.05, yF)
    box(marble, xc - 1.12, xc + 1.12, d0, d1, 0.55, 3.3, { top: false })
    box(white, xc - 1.28, xc + 1.28, f0, f1, 3.3, PED, { b: 0.14, t: 0.05, bottom: true })
    // Reliefs on the die: a Victory on the front, captives on the sides.
    raised(white, [xc, yF + s * 0.04, 0.75], [s, 0, 0], UP, [0, s, 0], fig(VICTORY, -0.22, 0, 1), 0.14)
    raised(white, [xc, yF + s * 0.04, 0.75], [s, 0, 0], UP, [0, s, 0], fig(CAPTIVE, 0.5, 0, 0.75), 0.06, 0, 1)
    for (const sx of [-1, 1]) {
      const mid: V3 = [xc + sx * 1.12, (d0 + d1) / 2, 0.75]
      const U: V3 = [0, -sx * s, 0]
      raised(white, add(mid, [sx * 0.04, 0, 0]), U, UP, [sx, 0, 0], CAPTIVE, 0.06, 0, 1)
    }
    column(xc, yc)
  }

  /** Fluted shaft with entasis, Attic base and a Corinthian capital. */
  function column(xc: number, yc: number) {
    lathe(white, xc, yc, [[0.7, PED], [0.66, PED + 0.3], [0.55, SHAFT0]], 8, { phase: Math.PI / 8, crease: 180, top: false })
    const s = new Part()
    const ring = (z: number, r: number) => Array.from({ length: 16 }, (_, i): V3 => {
      const a = (i / 16) * TAU, rr = i % 2 ? r * 0.9 : r
      return [xc + rr * Math.cos(a), yc + rr * Math.sin(a), z]
    })
    s.loft([ring(SHAFT0, 0.53), ring(SHAFT1, 0.46)])
    place(giallo, s, undefined, 50)
    // Capital: a bell wrapped in acanthus (lobed), then the abacus.
    const c = new Part()
    const lobed = (z: number, r: number, lobe: number) => Array.from({ length: 16 }, (_, i): V3 => {
      const a = (i / 16) * TAU, rr = i % 2 ? r : r + lobe
      return [xc + rr * Math.cos(a), yc + rr * Math.sin(a), z]
    })
    c.loft([lobed(SHAFT1, 0.47, 0.06), lobed(BODY - 0.24, 0.6, 0.2)])
    place(white, c, undefined, 180)
    box(white, xc - 0.74, xc + 0.74, yc - 0.74, yc + 0.74, BODY - 0.26, BODY, { bottom: true })
  }

  // ------------------------------------------------ entablature
  const ARCHI = [BODY, 14.05], FRIEZE = [14.05, 14.8], BED = [14.8, 15.25], CORONA = [15.25, 16.0]
  box(white, -W - 0.12, W + 0.12, -D - 0.12, D + 0.12, ARCHI[0], ARCHI[1], { b: 0.1, bottom: true })
  box(marble, -W, W, -D, D, FRIEZE[0], FRIEZE[1], { top: false })
  box(white, -W - 0.3, W + 0.3, -D - 0.3, D + 0.3, BED[0], BED[1], { b: 0.15, top: false, bottom: true })
  box(white, -W - 0.62, W + 0.62, -D - 0.62, D + 0.62, CORONA[0], CORONA[1], { c: 0.3, b: 0.12, bottom: true })
  // Breakfronts: the entablature steps forward over every column.
  for (const xc of COLS) for (const s of [1, -1]) {
    const y0 = s * D, f = (d: number) => [Math.min(y0, s * (YC + d)), Math.max(y0, s * (YC + d))] as const
    const [a0, a1] = f(0.72), [d0, d1] = f(1.2)
    box(white, xc - 0.78, xc + 0.78, a0, a1, ARCHI[0], FRIEZE[1], { top: false, bottom: true })
    box(white, xc - 1.22, xc + 1.22, d0, d1, BED[0], CORONA[1], { b: 0.4, t: 0.08, bottom: true })
  }

  // ------------------------------------------------ attic
  box(white, -AW - 0.12, AW + 0.12, -AD - 0.12, AD + 0.12, AT0, AT0 + 0.45, { bottom: true })
  box(marble, -AW, AW, -AD, AD, AT0 + 0.45, AT2, { c: 0.15, top: false })
  box(white, -AW - 0.22, AW + 0.22, -AD - 0.22, AD + 0.22, AT2, AT2 + 0.2, { b: 0.08, top: false, bottom: true })
  box(white, -AW - 0.42, AW + 0.42, -AD - 0.42, AD + 0.42, AT2 + 0.2, TOP, { c: 0.3, b: 0.12, top: false, bottom: true })
  face(roof, rectRing(-AW - 0.42, AW + 0.42, -AD - 0.42, AD + 0.42, TOP, 0.3), UP)
  // Statue plinths, forward over each column, and the Dacians on them.
  const DACIAN = dacian(3.3)
  for (const xc of COLS) for (const s of [1, -1]) {
    const y0 = s * AD, yF = s * (YC + 0.62)
    box(white, xc - 0.68, xc + 0.68, Math.min(y0, yF), Math.max(y0, yF), AT0, AT1, { t: 0.1 })
    place(white, DACIAN, turn(s > 0 ? 0 : 180, [xc, s * YC, AT1]), 180)
  }

  const hash01 = (n: number) => ((Math.sin(n * 12.9898) * 43758.5453) % 1 + 1) % 1
  /** A framed panel: grey field, a raised moulded frame, raised figures. */
  function panel(O: V3, U: V3, N: V3, u0: number, u1: number, v0: number, v1: number, figures: Shape[], fw = 0.18, field = relief) {
    raised(field, O, U, UP, N, rect(u0, u1, v0, v1), 0.03, 0, 1)
    const at = (u: number, v: number, d: number): V3 => add(add(add(O, mul(U, u)), mul(UP, v)), mul(N, d))
    const inner = [at(u0, v0, 0.12), at(u1, v0, 0.12), at(u1, v1, 0.12), at(u0, v1, 0.12)]
    const outer = [at(u0 - fw, v0 - fw, 0.12), at(u1 + fw, v0 - fw, 0.12), at(u1 + fw, v1 + fw, 0.12), at(u0 - fw, v1 + fw, 0.12)]
    const base = [at(u0 - fw, v0 - fw, 0), at(u1 + fw, v0 - fw, 0), at(u1 + fw, v1 + fw, 0), at(u0 - fw, v1 + fw, 0)]
    const sides: V3[] = [mul(UP, -1), U, UP, mul(U, -1)]
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      face(white, [outer[i], outer[j], inner[j], inner[i]], N)
      face(white, [base[i], base[j], outer[j], outer[i]], sides[i])
    }
    for (const f of figures) raised(marble, add(O, mul(N, 0.03)), U, UP, N, f, 0.12)
  }

  for (const s of [1, -1]) {
    const N: V3 = [0, s, 0], U: V3 = [s, 0, 0], O: V3 = [0, s * AD, 0]
    panel(O, U, N, -4.4, 4.4, 17.35, 20.05, [], 0.18, marble)
    // The seven lines of the dedication as thin dark lines of words (the
    // letters were once bronze in sunk grooves): real lettering would not
    // fit the budget, so each line is broken into word-length strokes.
    for (let k = 0; k < 7; k++) {
      const v = 19.72 - k * 0.34, half = k === 6 ? 3.1 : 3.9
      let u = -half
      for (let w = 0; u < half - 0.3; w++) {
        const len = Math.min(half - u, 0.9 + 1.4 * hash01(k * 7 + w))
        raised(relief, add(O, mul(N, 0.03)), U, UP, N, rect(u, u + len, v, v + 0.15), 0.02, 0, 1)
        u += len + 0.22
      }
    }
    for (const [a, b] of [[-10.45, -8.25], [-7.95, -5.9], [5.9, 7.95], [8.25, 10.45]]) {
      const mid = (a + b) / 2
      panel(O, U, N, a, b, 17.4, 19.95, [fig(MARCHER, mid - 0.5, 17.5, 1.2), fig(MARCHER, mid + 0.5, 17.5, 1.15)])
    }
  }
  for (const s of [1, -1]) {
    const N: V3 = [s, 0, 0], U: V3 = [0, s, 0], O: V3 = [s * AW, 0, 0]
    panel(O, U, N, -2.75, 2.75, 17.45, 20.0, [fig(RIDER, 1.2, 17.55, 1.3), fig(FIG, -0.55, 17.55, 1.2), fig(FIG, -1.6, 17.55, 1.15)])
  }

  // ------------------------------------------------ main storey ornament
  /** A tondo: grey disc, a bold rim, a horseman or a pair of figures. */
  function tondo(O: V3, U: V3, N: V3, cu: number, cv: number, r: number, scene: number) {
    const at = (u: number, v: number, d: number): V3 => add(add(add(O, mul(U, u)), mul(UP, v)), mul(N, d))
    const n = 10
    const pt = (i: number, rr: number, d: number) => at(cu + rr * Math.cos((i / n) * TAU), cv + rr * Math.sin((i / n) * TAU), d)
    face(relief, Array.from({ length: n }, (_, i) => pt(i, r - 0.1, 0.05)), N)
    const rim = new Part()
    for (let i = 0; i < n; i++) {
      const j = i + 1, rad = unit(sub(pt(i + 0.5, 1, 0), pt(0, 0, 0)))
      face(rim, [pt(i, r - 0.17, 0.17), pt(j, r - 0.17, 0.17), pt(j, r + 0.02, 0.17), pt(i, r + 0.02, 0.17)], N)
      face(rim, [pt(i, r + 0.02, 0), pt(j, r + 0.02, 0), pt(j, r + 0.02, 0.17), pt(i, r + 0.02, 0.17)], rad)
    }
    place(white, rim, undefined, 45)
    const k = r / 1.15
    const shapes = [scene % 2 ? fig(RIDER, cu, cv - 0.72 * k, 0.8 * k) : fig(RIDER, cu, cv - 0.72 * k, 0.8 * k, -1)]
    for (const f of shapes) raised(marble, add(O, mul(N, 0.05)), U, UP, N, f, 0.06, 0, 1)
  }
  /** A long frieze band of marching figures. */
  function frieze(O: V3, U: V3, N: V3, u0: number, u1: number, v0: number, v1: number) {
    raised(relief, O, U, UP, N, rect(u0, u1, v0, v1), 0.06, 0, 1)
    const n = Math.max(2, Math.round((u1 - u0) / 0.85))
    for (let i = 0; i < n; i++) {
      const u = u0 + ((i + 0.5) * (u1 - u0)) / n
      raised(marble, add(O, mul(N, 0.06)), U, UP, N, fig(MARCHER, u, v0 + 0.07, (v1 - v0 - 0.14) / 1.85), 0.05, 0, 1)
    }
  }

  for (const s of [1, -1]) {
    const N: V3 = [0, s, 0], U: V3 = [s, 0, 0], O: V3 = [0, s * D, 0]
    for (const side of [-1, 1]) {
      const cx = side * 8.15
      const [ua, ub] = [Math.min(s * (cx - 2.45), s * (cx + 2.45)), Math.max(s * (cx - 2.45), s * (cx + 2.45))]
      frieze(O, U, N, ua, ub, 7.98, 8.95)
      tondo(O, U, N, s * (cx - 1.25), 10.25, 1.15, 0)
      tondo(O, U, N, s * (cx + 1.25), 10.25, 1.15, 1)
      // String course under the cornice zone, between the pilasters.
      raised(white, O, U, UP, N, rect(ua, ub, 12.3, 12.55), 0.1, 0, 1)
      // Narrow relief panels on the piers flanking the central arch.
      const px = s * side * 4.1
      raised(relief, O, U, UP, N, rect(px - 0.33, px + 0.33, 1.2, 6.9), 0.04, 0, 1)
    }
    // Winged Victories in the central spandrels, flying toward the keystone.
    for (const side of [-1, 1]) {
      const v: Shape = [[3.95, 9.5], [3.55, 10.5], [2.7, 11.45], [1.4, 12.0], [0.75, 12.1], [1.3, 12.6], [2.4, 12.95], [3.3, 12.9], [4.0, 12.2], [4.3, 11.0]]
      raised(relief, O, U, UP, N, v.map(([a, b]) => [s * side * a, b] as [number, number]), 0.18)
    }
    // River gods reclining in the spandrels of the side arches.
    for (const cx of [-8.1, 8.1]) for (const side of [-1, 1]) {
      const v: Shape = [[2.3, 6.3], [2.05, 7.05], [1.25, 7.8], [2.15, 7.85], [2.45, 7.2]]
      raised(relief, O, U, UP, N, v.map(([a, b]) => [s * (cx + side * a), b] as [number, number]), 0.12)
    }
  }
  // The ends: frieze, the Sol and Luna tondi, the two small plaques.
  for (const s of [1, -1]) {
    const N: V3 = [s, 0, 0], U: V3 = [0, s, 0], O: V3 = [s * W, 0, 0]
    frieze(O, U, N, -2.95, 2.95, 7.98, 8.95)
    tondo(O, U, N, 0, 10.35, 1.2, 1)
    raised(white, O, U, UP, N, rect(-1.6, -0.45, 4.7, 6.6), 0.1, 0, 0.94)
  }
  // The great Trajanic battle frieze on the walls of the central passage.
  for (const s of [-1, 1]) {
    const N: V3 = [-s, 0, 0], U: V3 = [0, -s, 0], O: V3 = [s * 3.25, 0, 0]
    panel(O, U, N, -2.65, 2.65, 3.2, 6.7, [fig(RIDER, 0.6, 3.3, 1.55), fig(FIG, -1.05, 3.3, 1.6), fig(FIG, -1.85, 3.3, 1.5), fig(FIG, 1.95, 3.3, 1.5, -1)], 0.12)
  }
  // The side passages, open straight through: on each wall a relief field
  // with a medallion bust, as the real side passages carry.
  for (const o of [OPENINGS[0], OPENINGS[2]]) for (const s of [-1, 1]) {
    const N: V3 = [-s, 0, 0], U: V3 = [0, -s, 0], O: V3 = [o.cx + s * o.h, 0, 0]
    raised(relief, O, U, UP, N, rect(-2.2, 2.2, 1.4, 4.7), 0.03, 0, 1)
    raised(marble, add(O, mul(N, 0.03)), U, UP, N, Array.from({ length: 6 }, (_, i) => [0.75 * Math.cos((i / 6) * TAU), 3.1 + 0.75 * Math.sin((i / 6) * TAU)] as [number, number]), 0.12)
  }

  return { marble, white, relief, giallo, vault, roof }
}

// ---------------------------------------------------------------- write

if (import.meta.main) {
  const { marble, white, relief, giallo, vault, roof } = buildArch()
  // Floodlit from the ground: faces brightest low down, tops barely lit.
  const lit = (p: V3, n: V3): number => Math.round(10 * (1 - 0.35 * Math.min(1, p[2] / 21)) * (n[2] > 0.7 ? 0.3 : 1)) / 10
  const mat = (name: string, color: number): MaterialSpec => ({ name, color, roughness: 0.85, floodlight: lit })
  const parts = [
    { part: marble, material: mat('arch-marble', 0xd9d3c6) },
    { part: white, material: mat('white-marble', 0xeeeae1) },
    { part: relief, material: mat('relief-grey', 0xb8af9e) },
    { part: giallo, material: mat('giallo-antico', 0xdfd5bb) },
    { part: vault, material: mat('vault-soffit', 0xcbc3b2) },
    { part: roof, material: mat('attic-roof', 0xdcd8ce) },
  ]
  const triangles = parts.reduce((sum, { part }) => sum + part.triangles, 0)
  for (const { part, material } of parts) console.log(material.name, part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Arch of Constantine', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 12.9, elevation: 0, footprint: [25.9, 7.4], height: 21,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/rome-arch-of-constantine.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
