/**
 * Römer, Römerberg, Frankfurt am Main: the town hall's front of five
 * houses on the Römerberg, from south to north Alt-Limpurg, Haus zum Römer
 * and Löwenstein (the three stepped gables, 15th century, the fronts
 * re-dressed 1896-1900 by Max Meckel and Franz von Hoven and rebuilt after
 * 1944), then Frauenstein and the Salzhaus (rebuilt 1950s in simplified
 * form). Original procedural geometry, CC0-1.0.
 * bun generators/frankfurt-roemer.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the five OSM outlines, 50.1105192,
 * 8.6816174. The fronts run at about 16 degrees (from the OSM front edges,
 * Alt-Limpurg's front 13 degrees off the rest), so the catalog bearing is
 * 16.2 and the square (Römerberg) is +x. The party walls are not square to
 * the fronts: they run back at about 23 degrees past -x (OSM), and the roofs
 * follow them.
 *
 * Identity, in order: the three pink stepped gables side by side, the
 * middle one (Haus zum Römer) tallest, with its little octagonal lantern on
 * top, a clock and two coats of arms; finials on every step; the red
 * sandstone balcony across Haus zum Römer on corbels, with the four
 * emperor statues between its five tall windows above; the arched ground
 * floor (three pointed doorways at Zum Römer, two broad round arches at
 * Löwenstein, four small round arches at Alt-Limpurg); the steep dark
 * slate roofs behind; the two plain steep gables of Frauenstein (pale grey)
 * and the Salzhaus (pink) to the north on a sandstone arcade.
 *
 * Evidence:
 *  - plan: OSM outlines way/72449456 (Alt-Limpurg), 72449466 (Haus zum
 *    Römer), 174469545 (Löwenstein), 174469544 (Frauenstein), 174469543
 *    (Salzhaus), read in the turned frame. The front edges and party walls
 *    are taken from them; each house is drawn as the parallelogram between
 *    its front edge and its party walls, to its OSM depth.
 *  - heights (no lidar in Germany; OSM has none): scaled from Dietmar
 *    Rabich's near-frontal photo (6695-9) and AlbusTheWhite's frontal photo,
 *    0.044 m/px from the 12.6 m front of Haus zum Römer (OSM; Frauenstein's
 *    7.6 m checks), then, after review, everything drawn 8 % taller to match
 *    the photos' height to width: eaves of the stepped gables 13.5 m; gable
 *    tops Alt-Limpurg 20.8, Zum Römer 23.5 (lantern to 27.6), Löwenstein
 *    23.0; Frauenstein and Salzhaus eaves 16.8, apex 25.3 (gable height 1.1
 *    times the front, as in the photo); balcony 5.4-7.0; the tall windows
 *    7.5-12.2; ground-floor arches and window rows as measured off the same
 *    photos. Steps: 6, 8 and 7 a side. Löwenstein's gable front is 10.6 m,
 *    not OSM's 13.4 m (235 px against Zum Römer's 285 px in Rabich's
 *    photo); the remaining 2.8 m is a narrow plain bay. Roof ridges behind
 *    the gables are estimated, stop 7 m back and are hipped behind, so the
 *    roofs (which run back askew along the party walls) stay hidden behind
 *    the steps from the square, as in every photo.
 *  - colours from the daylight photos: pale pink render, darker red sandstone
 *    dressings,
 *    dark slate roofs, the pale grey Frauenstein front.
 *  - night: J. Heribert Pohl's dusk photo: fronts floodlit, windows lit.
 *  - elevation 0 (the Römerberg is nearly flat).
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Frankfurt am Main, Römer -- 2015 -- 6695-9.jpg (Dietmar Rabich, CC BY-SA 4.0)
 *    https://commons.wikimedia.org/wiki/File:Frankfurt_am_Main,_R%C3%B6mer_--_2015_--_6695-9.jpg
 *  - Frankfurt city centre.jpg (AlbusTheWhite, CC BY-SA 4.0)
 *    https://commons.wikimedia.org/wiki/File:Frankfurt_city_centre.jpg
 *  - Frankfurt, Römer (Rathaus) auf dem Römerberg (13552663995).jpg
 *    (Heribert Pohl, CC BY-SA 2.0), dusk
 *    https://commons.wikimedia.org/wiki/File:Frankfurt,_R%C3%B6mer_(Rathaus)_auf_dem_R%C3%B6merberg_--_Frankfurt,_Roemer_(city_hall)_on_the_Roemer_Hill_(13552663995).jpg
 *  - Facade details city hall Römer Frankfurt Hesse Germany.JPG (ArcCan, CC BY-SA 3.0)
 *    https://commons.wikimedia.org/wiki/File:Facade_details_city_hall_R%C3%B6mer_Frankfurt_Hesse_Germany.JPG
 * No commercial imagery, no 3D city models (Hessen LoD2 not used). No
 * look-only sources.
 *
 * Left out: the tracery of the balcony parapet (drawn as sunk panels), the
 * figures' attributes, the painted ornament of the Salzhaus and the diaper
 * pattern of the Frauenstein gable, the flagpoles, the backs of the houses
 * (seen in no photo; drawn as plain walls and gables).
 *
 * Doubts: the depth and roof ridges of each house are from OSM and
 * estimates; the backs face courtyards no photo shows. Frauenstein and
 * Salzhaus heights are photo estimates with perspective.
 *
 * This file also holds the kit shared by this builder's other frankfurt-
 * generators (dom, paulskirche, alte-nikolaikirche, goethe-haus); merge it
 * first.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { cap, inset, lathe, rect, save, triangulate, walls, spire, area, type XY } from './chi-aon-center'
import { along, face } from './phl-independence-hall'
import { ball, wallSlab } from './amsterdam-westerkerk'

// ---------------------------------------------------------------------------
// Kit for this builder's Frankfurt models.

export const FRANKFURT_CREDITS = 'OnlyHudson (creator), Claude (Claude Opus 5.5, procedural modeling)'
export { save, rect, lathe, walls, cap, inset, spire, triangulate, area, along, face, ball, wallSlab }
export type { XY }

/**
 * Write a model's low GLB (held to `lowTris` and 250 KB) and, when given,
 * its detail GLB (40,000 triangles, 1.5 MB), six materials each.
 */
export async function writeLods(id: string, name: string, anchor: [number, number], bearing: number, low: { part: Part; material: MaterialSpec }[], detail: { part: Part; material: MaterialSpec }[] | null, lowTris = 6500) {
  const one = async (file: string, parts: { part: Part; material: MaterialSpec }[], maxTris: number, maxBytes: number) => {
    const used = parts.filter((x) => x.part.triangles > 0)
    const tris = used.reduce((t, x) => t + x.part.triangles, 0)
    if (used.length > 6) throw new Error(`${file}: ${used.length} materials`)
    const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor, bearing })
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url).pathname, glb)
    if (tris > maxTris || glb.length > maxBytes) throw new Error(`${file}: budget exceeded`)
  }
  if (detail) await one(`${id}.detail.glb`, detail, 40_000, 1_536_000)
  await one(`${id}.glb`, low, lowTris, 250_000)
}

/** A ring made counter-clockwise. */
export const ccw = (r: XY[]): XY[] => (area(r) < 0 ? [...r].reverse() : r)

/** A facade: wall a→b of a counter-clockwise ring; s along, z up, o out. */
export type Fac = ReturnType<typeof fac>
export function fac(a: XY, b: XY) {
  const { L, u, n, P } = along(a, b)
  const N: V3 = [n[0], n[1], 0], U: V3 = [u[0], u[1], 0]
  /** A vector in facade terms (ds along, dz up, do out). */
  const V = (ds: number, dz: number, dn: number): V3 => [u[0] * ds + n[0] * dn, u[1] * ds + n[1] * dn, dz]
  return { a, b, L, u, n, P, N, U, V }
}

/**
 * A box standing on a facade: s0..s1 along, z0..z1 up, o0..o1 out. The back
 * (o0) is left off when it sits in the wall (o0 <= 0).
 */
export function boxF(p: Part, F: Fac, s0: number, s1: number, z0: number, z1: number, o0: number, o1: number, bottom = true) {
  const P = F.P
  face(p, [P(s0, z0, o1), P(s1, z0, o1), P(s1, z1, o1), P(s0, z1, o1)], F.N)
  face(p, [P(s0, z1, o0), P(s1, z1, o0), P(s1, z1, o1), P(s0, z1, o1)], [0, 0, 1])
  if (bottom) face(p, [P(s0, z0, o0), P(s1, z0, o0), P(s1, z0, o1), P(s0, z0, o1)], [0, 0, -1])
  face(p, [P(s0, z0, o0), P(s0, z0, o1), P(s0, z1, o1), P(s0, z1, o0)], F.V(-1, 0, 0))
  face(p, [P(s1, z0, o0), P(s1, z0, o1), P(s1, z1, o1), P(s1, z1, o0)], F.V(1, 0, 0))
  if (o0 > 0) face(p, [P(s0, z0, o0), P(s1, z0, o0), P(s1, z1, o0), P(s0, z1, o0)], F.V(0, 0, -1))
}

export type ArchKind = 'round' | 'pointed' | 'flat' | 'seg'

/**
 * The head of an opening centred at c, half-width hw, springing at zs, from
 * the left jamb over to the right one. A pointed head is two arcs whose
 * centres sit `e` inside the opposite jambs (e = hw: equilateral); a wider
 * frame round it keeps the same centres, so it stays concentric.
 */
export function archPts(c: number, hw: number, zs: number, kind: ArchKind, n = 8, e = hw, rise = hw * 0.35): XY[] {
  const pts: XY[] = []
  if (kind === 'flat') return [[c - hw, zs], [c + hw, zs]]
  if (kind === 'round') {
    for (let k = 0; k <= n; k++) { const t = Math.PI - (k / n) * Math.PI; pts.push([c + hw * Math.cos(t), zs + hw * Math.sin(t)]) }
    return pts
  }
  if (kind === 'seg') {
    // A segmental head rising `rise` over the span.
    const R = (hw * hw + rise * rise) / (2 * rise), zc = zs + rise - R, a0 = Math.asin(hw / R)
    for (let k = 0; k <= n; k++) { const t = -a0 + (k / n) * 2 * a0; pts.push([c + R * Math.sin(t), zc + R * Math.cos(t)]) }
    return pts
  }
  // pointed: left half from the left jamb up to the apex, centre at c + e - ... (right arc centred at c - e)
  const R = hw + e, h = Math.sqrt(R * R - e * e), m = Math.max(2, Math.round(n / 2))
  const left: XY[] = []
  const tA = Math.atan2(h, -e) // angle of the apex seen from the left arc's centre (c + e)
  for (let k = 0; k <= m; k++) { const t = Math.PI + (k / m) * (tA - Math.PI); left.push([c + e + R * Math.cos(t), zs + R * Math.sin(t)]) }
  const right = left.slice(0, -1).reverse().map(([s, z]) => [2 * c - s, z] as XY)
  return [...left, ...right]
}

/** The outline of an opening, clockwise in (s, z): up the left jamb, over the head, down the right. */
export function openingPath(c: number, hw: number, z0: number, zs: number, kind: ArchKind, n = 8, e = hw): XY[] {
  return [[c - hw, z0], ...archPts(c, hw, zs, kind, n, e), [c + hw, z0]]
}

/** A flat opening panel (window glass or door leaf) `o` out from the wall. */
export function pane(p: Part, F: Fac, c: number, hw: number, z0: number, zs: number, kind: ArchKind, o = 0.04, n = 8) {
  const path = openingPath(c, hw, z0, zs, kind, n)
  const C = F.P(c, (z0 + zs) / 2, o)
  for (let i = 0; i < path.length; i++) {
    const A = path[i], B = path[(i + 1) % path.length]
    face(p, [C, F.P(A[0], A[1], o), F.P(B[0], B[1], o)], F.N)
  }
}

/**
 * A 3D surround (jambs and arch, `w` wide, standing `d` proud) round an
 * opening, with its reveals. `sill` adds a ledge under it.
 */
export function surround(p: Part, F: Fac, c: number, hw: number, z0: number, zs: number, kind: ArchKind, w: number, d: number, n = 8, sill = 0) {
  const inner = openingPath(c, hw, z0, zs, kind, n)
  const outer = openingPath(c, hw + w, z0, zs, kind, n, hw)
  const P = F.P
  for (let i = 0; i < inner.length - 1; i++) {
    const a = inner[i], b = inner[i + 1], A = outer[i], B = outer[i + 1]
    face(p, [P(a[0], a[1], d), P(b[0], b[1], d), P(B[0], B[1], d), P(A[0], A[1], d)], F.N)
    const ds = b[0] - a[0], dz = b[1] - a[1]
    face(p, [P(a[0], a[1], 0), P(b[0], b[1], 0), P(b[0], b[1], d), P(a[0], a[1], d)], F.V(dz, -ds, 0))
    const Ds = B[0] - A[0], Dz = B[1] - A[1]
    face(p, [P(A[0], A[1], 0), P(B[0], B[1], 0), P(B[0], B[1], d), P(A[0], A[1], d)], F.V(-Dz, Ds, 0))
  }
  if (sill > 0) boxF(p, F, c - hw - w - 0.08, c + hw + w + 0.08, z0 - sill, z0, 0, d + 0.06)
}

/** A bar of rectangular section along a polyline in the facade plane, from o0 to o1. */
export function bar(p: Part, F: Fac, pts: XY[], bw: number, o0: number, o1: number) {
  const P = F.P
  for (let i = 0; i < pts.length - 1; i++) {
    const [s0, z0] = pts[i], [s1, z1] = pts[i + 1]
    const L = Math.hypot(s1 - s0, z1 - z0) || 1, ns = -(z1 - z0) / L * bw / 2, nz = (s1 - s0) / L * bw / 2
    const q = [[s0 + ns, z0 + nz], [s1 + ns, z1 + nz], [s1 - ns, z1 - nz], [s0 - ns, z0 - nz]] as XY[]
    face(p, q.map(([s, z]) => P(s, z, o1)), F.N)
    face(p, [P(q[0][0], q[0][1], o0), P(q[1][0], q[1][1], o0), P(q[1][0], q[1][1], o1), P(q[0][0], q[0][1], o1)], F.V(ns, nz, 0))
    face(p, [P(q[3][0], q[3][1], o0), P(q[2][0], q[2][1], o0), P(q[2][0], q[2][1], o1), P(q[3][0], q[3][1], o1)], F.V(-ns, -nz, 0))
  }
}

/**
 * Tracery in an opening: `lights` lights divided by mullions up to the
 * springing, and in a pointed head a fork of Y tracery from each mullion
 * plus, with `eye`, a ring in the head. Bars `bw` wide, `d` proud of the wall.
 */
export function tracery(p: Part, F: Fac, c: number, hw: number, z0: number, zs: number, kind: ArchKind, lights: number, bw = 0.16, d = 0.14, eye = false, transoms: number[] = []) {
  const o0 = 0.02
  for (let k = 1; k < lights; k++) {
    const s = c - hw + (2 * hw * k) / lights
    bar(p, F, [[s, z0], [s, zs]], bw, o0, d)
    if (kind === 'pointed' || kind === 'round') {
      // Y fork: from the mullion head to the head of the arch either side.
      const head = archPts(c, hw, zs, kind, 16)
      const reach = (target: number) => head.reduce((b, q) => (Math.abs(q[0] - target) < Math.abs(b[0] - target) ? q : b))
      const dl = (2 * hw) / lights
      const L = reach(s - dl * 0.5), R = reach(s + dl * 0.5)
      const lift = Math.min(L[1], R[1]) - zs
      bar(p, F, [[s, zs], [s - dl * 0.32, zs + lift * 0.55], [L[0] + dl * 0.05, L[1] - 0.12]], bw * 0.8, o0, d)
      bar(p, F, [[s, zs], [s + dl * 0.32, zs + lift * 0.55], [R[0] - dl * 0.05, R[1] - 0.12]], bw * 0.8, o0, d)
    }
  }
  for (const zt of transoms) bar(p, F, [[c - hw, zt], [c + hw, zt]], bw * 0.9, o0, d)
  if (eye && kind === 'pointed') {
    const top = archPts(c, hw, zs, kind)[Math.floor(archPts(c, hw, zs, kind).length / 2)][1]
    const r = Math.min(hw * 0.42, (top - zs) * 0.33), zc = zs + (top - zs) * 0.52
    const ring: XY[] = []
    for (let k = 0; k <= 10; k++) { const t = (k / 10) * 2 * Math.PI; ring.push([c + r * Math.cos(t), zc + r * Math.sin(t)]) }
    bar(p, F, ring, bw * 0.8, o0, d)
  }
}

/** A Gothic window: glass, a sandstone surround and its tracery. */
export function gothicWindow(glass: Part, frame: Part, F: Fac, c: number, hw: number, z0: number, zs: number, kind: ArchKind, o: { w?: number; d?: number; lights?: number; eye?: boolean; transoms?: number[]; sill?: number; bw?: number; n?: number } = {}) {
  pane(glass, F, c, hw, z0, zs, kind, 0.03, o.n ?? (kind === 'pointed' ? 8 : 10))
  if ((o.w ?? 0.3) > 0) surround(frame, F, c, hw, z0, zs, kind, o.w ?? 0.3, o.d ?? 0.2, o.n ?? 8, o.sill ?? 0)
  if ((o.lights ?? 1) > 1 || o.transoms?.length) tracery(frame, F, c, hw, z0, zs, kind, o.lights ?? 1, o.bw ?? 0.15, (o.d ?? 0.2) * 0.7, o.eye, o.transoms)
}

/** A square post (pinnacle shaft) with a pyramid cap, at a map point. */
export function pinnacle(p: Part, cx: number, cy: number, half: number, z0: number, z1: number, tip: number, ang = 0) {
  const r: XY[] = [0, 1, 2, 3].map((k) => {
    const a = ang + Math.PI / 4 + (k * Math.PI) / 2
    return [cx + half * Math.SQRT2 * Math.cos(a), cy + half * Math.SQRT2 * Math.sin(a)] as XY
  })
  walls(p, r, z0, z1)
  const r2 = inset(r, -half * 0.25)
  // a small capping band, then the spike
  walls(p, r2, z1, z1 + half * 0.5)
  face(p, [[r2[0][0], r2[0][1], z1], [r2[1][0], r2[1][1], z1], [r2[2][0], r2[2][1], z1], [r2[3][0], r2[3][1], z1]], [0, 0, -1])
  spire(p, r2, z1 + half * 0.5, [cx, cy, tip])
}

/**
 * A standing statue (a robed figure) on the point (x, y, z), `h` tall,
 * as a smooth lathe: robe, shoulders, neck, head and a crown.
 */
export function figure(p: Part, x: number, y: number, z: number, h: number, seg = 7, crown = true) {
  const k = h / 1.8
  lathe(p, x, y, [
    [0.0, z], [0.27 * k, z], [0.25 * k, z + 0.35 * k], [0.2 * k, z + 0.85 * k], [0.21 * k, z + 1.15 * k],
    [0.25 * k, z + 1.38 * k], [0.18 * k, z + 1.48 * k], [0.07 * k, z + 1.52 * k], [0.06 * k, z + 1.56 * k],
    [0.12 * k, z + 1.62 * k], [0.12 * k, z + 1.7 * k], [crown ? 0.13 * k : 0.08 * k, z + 1.74 * k], [crown ? 0.13 * k : 0, z + 1.82 * k], [0, z + 1.82 * k],
  ], seg)
}

/**
 * The flood of the night: walls lit, tops little. Shared by the frankfurt-
 * models, all floodlit stone.
 */
export const floodWalls = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.85)

/**
 * A gabled house block: front edge A (one corner) → B (the other), going
 * back along the unit `d` for `depth`; walls to `eave`, a saddle roof with
 * the ridge at `ridge` running back from the middle of the front. Walls in
 * `wall`, roof planes in `roof`, the back gable in `gable` (null: none).
 * The front gable is left open for the caller. With `hip`, the ridge stops
 * `hip` metres back and the rest of the roof is hipped down to the back eaves.
 */
export function house(wall: Part, roof: Part, gable: Part | null, A: XY, B: XY, d: XY, depth: number, eave: number, ridge: number, o = 0.35, hip = 0) {
  const A2: XY = [A[0] + d[0] * depth, A[1] + d[1] * depth], B2: XY = [B[0] + d[0] * depth, B[1] + d[1] * depth]
  walls(wall, ccw([A, B, B2, A2]), 0, eave)
  const M: XY = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], M2: XY = [(A2[0] + B2[0]) / 2, (A2[1] + B2[1]) / 2]
  // Eaves pushed out by o across the party walls, and dropped to match the slope.
  const half = Math.hypot(B[0] - A[0], B[1] - A[1]) / 2, s = (ridge - eave) / half
  const out = (P: XY, toward: XY, k: number): XY => { const vx = P[0] - toward[0], vy = P[1] - toward[1], l = Math.hypot(vx, vy); return [P[0] + vx / l * k, P[1] + vy / l * k] }
  const Ao = out(A, M, o), A2o = out(A2, M2, o), Bo = out(B, M, o), B2o = out(B2, M2, o)
  const lo = eave - o * s
  const v = (q: XY, z: number): V3 => [q[0], q[1], z]
  const sideN = (P: XY, Q: XY): V3 => { const vx = P[0] - Q[0], vy = P[1] - Q[1]; return [vx, vy, 1 / s * Math.hypot(vx, vy)] }
  const R2: XY = hip > 0 ? [M[0] + d[0] * hip, M[1] + d[1] * hip] : M2
  face(roof, [v(Ao, lo), v(A2o, lo), v(R2, ridge), v(M, ridge)], sideN(A, M))
  face(roof, [v(Bo, lo), v(B2o, lo), v(R2, ridge), v(M, ridge)], sideN(B, M))
  if (hip > 0) face(roof, [v(A2o, lo), v(B2o, lo), v(R2, ridge)], [d[0], d[1], (depth - hip) / (ridge - eave)])
  // eave soffits
  face(roof, [v(A, eave), v(A2, eave), v(A2o, lo), v(Ao, lo)], [0, 0, -1])
  face(roof, [v(B, eave), v(B2, eave), v(B2o, lo), v(Bo, lo)], [0, 0, -1])
  if (gable && !(hip > 0)) {
    const back: V3 = [d[0], d[1], 0]
    face(gable, [v(A2, eave), v(B2, eave), v(M2, ridge)], back)
  }
  return { A2, B2, M, M2 }
}

/**
 * A stepped gable on facade F from s = 0 to F.L: steps of rise `rise`
 * rising from `eave` to `top`, the top block `topW` wide; a slab `t` thick
 * standing from o = -t + 0.05 to 0.05. Coping caps (in `trim`) on every
 * step and a finial (in `trim`) at each step's outer end. Returns the step
 * corners.
 */
export function steppedGable(wallP: Part, trim: Part, F: Fac, eave: number, top: number, steps: number, topW: number, t = 0.6, finial = 0.9) {
  const W = F.L, run = (W / 2 - topW / 2) / steps, rise = (top - eave) / (steps + 1)
  const left: XY[] = [[0, eave]]
  for (let k = 0; k < steps; k++) {
    left.push([k * run, eave + (k + 1) * rise])
    left.push([(k + 1) * run, eave + (k + 1) * rise])
  }
  left.push([steps * run, top])
  const right = [...left].reverse().map(([s, z]) => [W - s, z] as XY)
  const outline: XY[] = [...left, ...right]
  wallSlab(wallP, F.a, F.b, outline, t, -t + 0.05)
  // Copings and finials.
  const cw = 0.12
  for (let k = 0; k <= steps; k++) {
    const z = k < steps ? eave + (k + 1) * rise : top
    const s0 = k < steps ? k * run : steps * run, s1 = k < steps ? (k + 1) * run : W - steps * run
    for (const [a, b] of (k < steps ? [[s0, s1], [W - s1, W - s0]] : [[s0, s1]]) as [number, number][]) {
      boxF(trim, F, a - cw, b + cw, z, z + 0.22, -t + 0.05 - cw, 0.05 + cw)
      if (finial > 0 && k < steps) {
        const sf = a === s0 ? a + 0.22 : b - 0.22
        const C = F.P(sf, 0, 0.05 - t / 2)
        pinnacle(trim, C[0], C[1], 0.15, z + 0.22, z + 0.22 + finial * 0.45, z + 0.22 + finial, Math.atan2(F.u[1], F.u[0]))
      }
    }
  }
  return { run, rise }
}

// ---------------------------------------------------------------------------
// Römer

const ID = 'frankfurt-roemer'

function build(DETAIL: boolean) {
  const pink = new Part(), sand = new Part(), slate = new Part(), win = new Part(), grey = new Part(), door = new Part()

  // Party walls run back at about 23 degrees past -x (OSM).
  const dAng = Math.PI + (23 * Math.PI) / 180
  const D: XY = [Math.cos(dAng), Math.sin(dAng)]

  // Front edges (south corner → north corner) and depths, from OSM in the turned frame.
  const houses = {
    limpurg: { A: [12.21, -20.17] as XY, B: [9.58, -8.86] as XY, depth: 20.5 },
    roemer: { A: [9.58, -8.86] as XY, B: [10.95, 3.78] as XY, depth: 23.0 },
    loewen: { A: [10.95, 3.78] as XY, B: [12.46, 17.07] as XY, depth: 20.0 },
    frauen: { A: [12.46, 17.07] as XY, B: [12.23, 24.63] as XY, depth: 17.5 },
    salz: { A: [12.23, 24.63] as XY, B: [11.12, 32.19] as XY, depth: 16.0 },
  }

  const EAVE = 12.5

  // --- The three stepped-gable houses -------------------------------------
  type Opening = { c: number; hw: number; z0: number; zs: number; kind: ArchKind; lights?: number }
  const stepped = (h: { A: XY; B: XY; depth: number }, top: number, ridge: number, steps: number, ground: Opening[], rows: Opening[], groundTop: number, pinkGround = false) => {
    const F = fac(h.A, h.B)
    // The ridge stops 7 m back and the roof is hipped behind it, so the
    // roofs, which run back askew along the party walls, stay hidden behind
    // the gables from the square (the backs are seen in no photo).
    house(pink, slate, pink, h.A, h.B, D, h.depth, EAVE, ridge, 0, 7)
    steppedGable(pink, sand, F, EAVE, top, steps, 1.5, 0.6, DETAIL ? 0.9 : 0)
    // The sandstone ground storey (pink at Alt-Limpurg) and the corner strips.
    boxF(pinkGround ? pink : sand, F, 0, F.L, 0, groundTop, 0, 0.12, false)
    boxF(sand, F, 0, F.L, groundTop, groundTop + 0.3, 0, 0.3)
    for (const s of [0, F.L - 0.55]) boxF(sand, F, s, s + 0.55, groundTop + 0.3, EAVE, 0, 0.14, false)
    boxF(sand, F, 0, F.L, EAVE - 0.35, EAVE, 0, 0.28)
    for (const o of ground) {
      pane(o.kind === 'pointed' || o.hw > 1.5 ? door : win, F, o.c, o.hw, o.z0, o.zs, o.kind, 0.16, DETAIL ? 8 : 6)
      surround(sand, F, o.c, o.hw, o.z0, o.zs, o.kind, 0.32, 0.3, DETAIL ? 8 : 6)
    }
    for (const o of rows) {
      pane(win, F, o.c, o.hw, o.z0, o.zs, o.kind, 0.05, DETAIL ? 6 : 4)
      surround(sand, F, o.c, o.hw, o.z0, o.zs, o.kind, 0.18, 0.16, DETAIL ? 6 : 4, DETAIL ? 0.16 : 0)
      if (DETAIL && (o.lights ?? 1) > 1) tracery(sand, F, o.c, o.hw, o.z0, o.zs, o.kind, o.lights!, 0.13, 0.12)
    }
    // Corner pinnacles at the eaves.
    for (const s of [0.3, F.L - 0.3]) {
      const C = F.P(s, 0, 0.05)
      pinnacle(sand, C[0], C[1], 0.28, EAVE, EAVE + 0.8, EAVE + 1.9, Math.atan2(F.u[1], F.u[0]))
    }
    return F
  }
  const pair = (c: number, w: number, z0: number, z1: number, kind: ArchKind = 'flat', lights = 2): Opening => ({ c, hw: w / 2, z0, zs: z1, kind, lights })

  // Alt-Limpurg (front 11.6 m): four small round arches, two rows of three
  // windows, then two and one in the gable.
  {
    const L = Math.hypot(houses.limpurg.B[0] - houses.limpurg.A[0], houses.limpurg.B[1] - houses.limpurg.A[1])
    const q = L / 4
    const ground = [0, 1, 2, 3].map((i) => ({ c: q * (i + 0.5), hw: 0.95, z0: 0, zs: 2.3, kind: 'round' as ArchKind }))
    const rows = [
      ...[0.2, 0.5, 0.8].map((f) => pair(L * f, 2.0, 4.9, 7.0, 'flat', 3)),
      ...[0.2, 0.5, 0.8].map((f) => pair(L * f, 1.7, 8.2, 9.6, 'round', 2)),
      pair(L * 0.36, 1.2, 13.0, 14.1), pair(L * 0.64, 1.2, 13.0, 14.1), pair(L * 0.5, 0.8, 15.4, 16.3, 'round', 1),
    ]
    stepped(houses.limpurg, 19.3, 15.8, 6, ground, rows, 3.7, true)
  }

  // Haus zum Römer (front 12.6 m): three pointed doorways, the balcony on
  // corbels, five tall windows with the four emperors between them, the
  // clock and coats of arms in the gable, the lantern on top.
  {
    const F = stepped(houses.roemer, 21.8, 17.6, 8,
      [2.2, 6.6, 10.4].map((c) => ({ c, hw: 1.0, z0: 0, zs: 2.7, kind: 'pointed' as ArchKind })),
      [
        ...[1.35, 3.9, 6.3, 8.7, 11.25].map((c, i) => pair(c, i === 2 ? 1.5 : 1.25, 6.9, 11.3, 'pointed', 2)),
        pair(4.1, 1.0, 14.3, 15.5), pair(8.5, 1.0, 14.3, 15.5), pair(5.6, 0.8, 17.0, 18.0), pair(7.0, 0.8, 17.0, 18.0), pair(6.3, 0.6, 19.3, 20.1, 'round', 1),
      ], 4.95)
    // The balcony: a slab on corbels across the front, its parapet sunk with panels.
    const B0 = 0.35, B1 = F.L - 0.35, OUT = 1.05
    boxF(sand, F, B0, B1, 5.0, 5.35, 0, OUT)
    boxF(sand, F, B0, B1, 5.35, 6.45, OUT - 0.28, OUT)
    for (const s of [B0, B1 - 0.25]) boxF(sand, F, s, s + 0.25, 5.35, 6.45, 0, OUT - 0.28, false)
    for (let k = 0; k < 8; k++) {
      const s = B0 + 0.55 + k * ((B1 - B0 - 1.1) / 7)
      // corbels: three stepped blocks under the slab
      boxF(sand, F, s - 0.22, s + 0.22, 4.55, 5.0, 0, OUT - 0.1)
      if (DETAIL) {
        boxF(sand, F, s - 0.18, s + 0.18, 4.15, 4.55, 0, OUT * 0.6)
        boxF(sand, F, s - 0.14, s + 0.14, 3.85, 4.15, 0, OUT * 0.3)
      }
      // the parapet's tracery panels, sunk between posts
      if (k < 7) {
        const sm = s + (B1 - B0 - 1.1) / 14
        boxF(pink, F, sm - 0.5, sm + 0.5, 5.6, 6.2, OUT + 0.0, OUT + 0.02)
      }
    }
    // The four emperors, on brackets under canopies, between the windows.
    for (const s of [2.62, 5.1, 7.5, 9.97]) {
      boxF(sand, F, s - 0.3, s + 0.3, 7.6, 7.85, 0, 0.6)
      const C = F.P(s, 0, 0.32)
      if (DETAIL) figure(grey, C[0], C[1], 7.85, 1.75, 10)
      else boxF(grey, F, s - 0.22, s + 0.22, 7.85, 9.55, 0.1, 0.5)
      boxF(sand, F, s - 0.32, s + 0.32, 9.75, 9.95, 0, 0.62)
      const T = F.P(s, 0, 0.32)
      pinnacle(sand, T[0], T[1], 0.26, 9.95, 10.4, 11.1, Math.atan2(F.u[1], F.u[0]))
    }
    // The clock and two coats of arms.
    const dial: XY[] = []
    for (let k = 0; k < 14; k++) { const t = (k / 14) * 2 * Math.PI; dial.push([6.3 + 0.75 * Math.cos(t), 15.0 + 0.75 * Math.sin(t)]) }
    bar(sand, F, [...dial, dial[0]], 0.22, 0, 0.16)
    const C = F.P(6.3, 15.0, 0.06)
    for (let k = 0; k < 14; k++) face(win, [C, F.P(dial[k][0], dial[k][1], 0.06), F.P(dial[(k + 1) % 14][0], dial[(k + 1) % 14][1], 0.06)], F.N)
    for (const s of [4.1, 8.5]) {
      const shield: XY[] = [[s - 0.45, 13.95], [s + 0.45, 13.95], [s + 0.45, 13.5], [s, 12.95], [s - 0.45, 13.5]]
      wallSlab(sand, F.a, F.b, shield, 0.14, 0)
    }
    // The lantern: an octagonal turret with arched openings and a slate cap.
    const T = F.P(F.L / 2, 0, -0.25)
    const oct = (r: number) => Array.from({ length: 8 }, (_, k) => [T[0] + r * Math.cos(Math.PI / 8 + (k * Math.PI) / 4), T[1] + r * Math.sin(Math.PI / 8 + (k * Math.PI) / 4)] as XY)
    walls(sand, oct(0.78), 21.8, 22.3); cap(sand, oct(0.78), 22.3)
    walls(pink, oct(0.62), 22.3, 23.7)
    const o8 = oct(0.62)
    for (let k = 0; k < 8; k++) {
      const Fk = fac(o8[k], o8[(k + 1) % 8])
      pane(win, Fk, Fk.L / 2, 0.14, 22.55, 23.25, 'round', 0.03, 4)
    }
    walls(sand, oct(0.72), 23.7, 23.95); cap(sand, oct(0.72), 23.95, false)
    lathe(slate, T[0], T[1], [[0.72, 23.95], [0.66, 24.3], [0.45, 24.7], [0.18, 25.0], [0.09, 25.15], [0.1, 25.3], [0, 25.6]], 8, Math.PI / 8)
    void 0
  }

  // Löwenstein: its gable front is 10.6 m (the photos: 235 px against Zum
  // Römer's 285 px for 12.6 m), on the south part of OSM's 13.4 m front; the
  // last 2.8 m is a plain narrow bay up to the eaves. Two broad round
  // arches, two rows of four paired windows over a sandstone panel band,
  // the gable's windows.
  {
    const LW = 10.6, A = houses.loewen.A, B0 = houses.loewen.B
    const t = LW / Math.hypot(B0[0] - A[0], B0[1] - A[1])
    const M: XY = [A[0] + (B0[0] - A[0]) * t, A[1] + (B0[1] - A[1]) * t]
    const F = stepped({ A, B: M, depth: houses.loewen.depth }, 21.3, 17.0, 7,
      [2.75, 7.85].map((c) => ({ c, hw: 1.95, z0: 0, zs: 2.85, kind: 'round' as ArchKind })),
      [
        ...[0.15, 0.38, 0.62, 0.85].map((f) => pair(LW * f, 1.6, 5.6, 7.6, 'flat', 2)),
        ...[0.15, 0.38, 0.62, 0.85].map((f) => pair(LW * f, 1.6, 9.0, 10.9, 'flat', 2)),
        pair(3.95, 1.6, 13.4, 14.6), pair(6.65, 1.6, 13.4, 14.6), pair(4.55, 1.0, 16.0, 17.0), pair(6.05, 1.0, 16.0, 17.0), pair(5.3, 0.6, 18.6, 19.4, 'round', 1),
      ], 5.0)
    // the narrow bay to Frauenstein
    const Fb = fac(M, B0)
    house(pink, slate, pink, M, B0, D, houses.loewen.depth, EAVE, EAVE + 1.4)
    boxF(sand, Fb, 0, Fb.L, 0, 5.0, 0, 0.12, false)
    boxF(sand, Fb, 0, Fb.L, EAVE - 0.35, EAVE, 0, 0.28)
    for (const [z0, z1] of [[5.6, 7.6], [9.0, 10.9]]) { pane(win, Fb, Fb.L / 2, 0.5, z0, z1, 'flat', 0.05); surround(sand, Fb, Fb.L / 2, 0.5, z0, z1, 'flat', 0.15, 0.12, 2, DETAIL ? 0.12 : 0) }
    pane(door, Fb, Fb.L / 2, 0.75, 0, 2.6, 'round', 0.16, 6)
    // The carved sandstone band between the window rows: a sill course and
    // sunk panels.
    boxF(sand, F, 0.55, F.L - 0.55, 8.0, 8.75, 0, 0.1)
    boxF(sand, F, 0.55, F.L - 0.55, 8.75, 8.9, 0, 0.2)
  }

  // --- Frauenstein and the Salzhaus: plain steep gables ----------------------
  const plain = (h: { A: XY; B: XY; depth: number }, front: Part, eave: number, apex: number, groundArches: Opening[]) => {
    const F = fac(h.A, h.B)
    house(front, slate, front, h.A, h.B, D, h.depth, eave, apex)
    // The front gable triangle, a little proud, with the slate verge over it.
    wallSlab(front, F.a, F.b, [[0, eave], [F.L, eave], [F.L / 2, apex]], 0.35, -0.3)
    const half = F.L / 2, s = (apex - eave) / half
    // The slate verges, a little proud of the gable.
    for (const e0 of [-0.3, F.L + 0.3]) bar(slate, F, [[e0, eave - 0.3 * s + 0.12], [F.L / 2, apex + 0.17]], 0.34, -0.3, 0.3)
    // The sandstone arcade storey.
    boxF(sand, F, 0, F.L, 0, 4.6, 0, 0.14, false)
    boxF(sand, F, 0, F.L, 4.6, 4.9, 0, 0.3)
    for (const o of groundArches) {
      pane(o.hw > 1 ? door : win, F, o.c, o.hw, o.z0, o.zs, o.kind, 0.18)
      surround(sand, F, o.c, o.hw, o.z0, o.zs, o.kind, 0.25, 0.3)
    }
    // Three storeys of window bands: four windows a storey, frames proud.
    for (const [z0, z1] of [[5.7, 7.9], [9.2, 11.4], [12.7, 14.9]]) {
      for (let k = 0; k < 4; k++) {
        const c = F.L * (k + 0.5) / 4
        pane(win, F, c, F.L / 8 - 0.22, z0, z1, 'flat', 0.05)
        surround(front === grey ? pink : grey, F, c, F.L / 8 - 0.22, z0, z1, 'flat', 0.12, 0.12, 2, DETAIL ? 0.12 : 0)
      }
    }
    pane(win, F, F.L / 2, 0.75, eave + 1.0, eave + 2.0, 'flat', 0.08)
    return F
  }
  plain(houses.frauen, grey, 15.6, 23.4, [
    { c: 1.9, hw: 1.3, z0: 0, zs: 2.6, kind: 'round' }, { c: 5.7, hw: 1.3, z0: 0, zs: 2.6, kind: 'round' },
  ])
  plain(houses.salz, pink, 15.6, 23.4, [
    { c: 1.9, hw: 1.3, z0: 0, zs: 2.6, kind: 'round' }, { c: 5.7, hw: 1.3, z0: 0, zs: 2.6, kind: 'round' },
  ])

  const flood = { floodlight: floodWalls }
  const parts: { part: Part; material: MaterialSpec }[] = [
    { part: pink, material: { ...finish('roemer-pink', 0xf7ddd6), ...flood } },
    { part: sand, material: { ...finish('roemer-sandstone', 0xa9665a), ...flood } },
    { part: slate, material: finish('roemer-slate', 0x6f7680) },
    { part: win, material: PALETTE.window },
    { part: grey, material: { ...finish('roemer-grey', 0xdcd8cf), ...flood } },
    { part: door, material: finish('roemer-door', 0x7d6a58) },
  ]
  // The whole front is drawn a little taller than the first pass (review:
  // the photos read taller and steeper than OSM's front widths gave): every
  // height times K, normals corrected.
  const K = 1.08
  for (const { part } of parts) {
    for (let i = 0; i < part.pos.length; i += 3) {
      part.pos[i + 1] *= K
      const nx = part.nrm[i], ny = part.nrm[i + 1] / K, nz = part.nrm[i + 2], l = Math.hypot(nx, ny, nz) || 1
      part.nrm[i] = nx / l; part.nrm[i + 1] = ny / l; part.nrm[i + 2] = nz / l
    }
  }
  return parts
}

if (import.meta.main) await writeLods(ID, 'Römer', [50.1105192, 8.6816174], 16.2, build(false), build(true))
