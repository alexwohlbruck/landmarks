/**
 * Hassan II Mosque, Casablanca (Michel Pinseau, 1986-93): procedural, CC0-1.0.
 * bun generators/casablanca-hassan-ii-mosque.ts   (writes the low and the detail GLB)
 *
 * Also the shared Moroccan kit for the Africa batch's Morocco models
 * (marrakesh-koutoubia, rabat-hassan-tower, rabat-mausoleum-mohammed-v):
 * walls with real recessed niches (`wall`, `Niche`), Moroccan arch outlines
 * (`arch`), stepped merlons (`merlons`), chamfered blocks, frusta, lathes
 * and a rigid `merge` for parts built in their own frame. Exported below;
 * this file's own build runs only under `import.meta.main`.
 *
 * Frame: x along the prayer hall's long axis (bearing 93.3), y across it
 * (bearing 3.3, toward the sea), z up, metres. Placed at bearing 3.3, the
 * hall's short sides (OSM way/416251749 edges run 3.3 / 93.3 degrees).
 * Anchor: the area centroid of the outline multipolygon relation/12679400,
 * -7.632522, 33.608451.
 *
 * Evidence
 * - OSM (ODbL), fetched 2026-11: outline relation/12679400 (the building
 *   relation/6002963 groups it with its parts) and building:parts:
 *   hall body way/416471474 (h 27), set-back clerestory way/416251749
 *   (27-40), lower green roof way/416471475 (40-50, "quadruple_saltbox"),
 *   raised central roof way/416251741 (50-60) between the flat flanks
 *   way/416985501 and /502 (min 50), the minaret shaft way/416251743 (h 172),
 *   its lantern way/416251746 (172-190), dome way/416546889 (190-194) and
 *   finial way/416595299 (195-210); the qibla annex way/118173667 (h 15) with
 *   its roof pavilions way/416755069 (pyramidal, 20), way/416755072 (20) and
 *   the octagon way/780656143 (15-20, mansard); the courtyard wings
 *   way/57853969 (h 15) with their three pavilions way/416815759, /761, /764
 *   (h 17). Every footprint here is drawn from those outlines.
 * - The minaret's square stands turned 45 degrees to the hall in OSM
 *   (edges at 48 / 138 degrees, the hall's south wall notched around its
 *   north corner). The photos agree: from the esplanade (general, dusk) and
 *   from the city to the south-east (panorama) the shaft shows a corner
 *   with two faces, while the hall's front reads square on. Kept as mapped.
 * - Published (Wikipedia, "Hassan II Mosque"): minaret 210 m to the finial,
 *   25 m square at the base; prayer hall about 200 x 100 m; completed 1993.
 * - Photos (Wikimedia Commons), used for proportions and colour:
 *   general: File:Hassan_II_Mosque_-_general_framing,_Casablanca,_Morocco.jpg, Tinuzzo, CC BY 4.0
 *   minaret: File:Minaret_tower_of_the_Hassan_II_Mosque,_Casablanca,_Morocco.jpg, Tinuzzo, CC BY 4.0
 *   front: File:Mosquée_Hassan_2_front_view.jpg, Cesar.mx22, CC BY-SA 4.0
 *   dahbi1/2: File:Hassan_II_Mosque_and_Its_Minaret_in_Casablanca,_Morocco(_2).jpg, Dahbi fatima zahrae, CC BY-SA 4.0
 *   dusk: File:Whispers_of_Gold_-_Hassan_II_Mosque_at_Dusk.jpg, OussamaHamama, CC BY-SA 4.0
 *   framing: File:Framing_Heritage_-_Hassan_II_Mosque.jpg, OussamaHamama, CC BY-SA 4.0
 *   openarea: File:The_Open_Area_of_Hassan_II_Mosque_-_Casablanca_Morocco.jpg, Ayman.mesa25, CC BY-SA 4.0
 *   panorama: File:Casablanca_panorama.jpg, Sgroey, CC BY 4.0
 *   panoramio: File:Mosquee_Hassan_II_-_panoramio.jpg, Jürgen Schneider, CC BY-SA 3.0
 *   farid2 (night): File:Minaret_de_Casablanca_-2-.jpg, Farid mernissi, CC BY-SA 4.0
 *   nikos: File:Hassan_II_Casablanca.jpg, Nikos Moumouris, CC BY 2.0
 * - Map terrain (Mapterhorn z12, coarse, a surface model that blurs the
 *   building into the ground round it): lowest 2.4 m at the shore, about
 *   9-11 m on the esplanade to the south.
 *
 * Numbers
 * - Footprints and the hall's tiers (27, 40, 50, 60 m): OSM; every height
 *   in OSM and here is above the 9 m deck.
 * - The 9 m deck the hall stands on (PLINTH, its sea face a row of pile
 *   slots): the pile wall stands about 7 m over the rocks in the front photo
 *   (a quarter of the hall wall), and the esplanade the hall opens onto sits
 *   about 9 m above the model's base on the map terrain. The deck runs 5 m
 *   past the hall on the seaward sides, as the front photo shows; it is not
 *   in OSM. Terrain check: 122 m² of the courtyard arcades' sills end up to
 *   1.2 m under the drawn ground at the footprint's south edge, where the
 *   coarse surface model rises over the real esplanade; the photos show
 *   the arcades standing on it, so the model is left true to them.
 * - Minaret stages: published 210 m total, with the stages scaled from the
 *   front photo taken from far off (lantern 0.58 of the shaft's width and
 *   1.16 of its own width tall; dome 8 m; finial 13 m), which puts the
 *   merlon tips at 165 m and the lantern at 161-189 m. OSM's 172 / 190 m
 *   stage heights are a few metres higher; the total matches either way.
 *   Lantern side 15 m (photo; OSM draws 17 m).
 * - Shaft face zones from the same photo: zellige band 16.5 m under the
 *   merlons, arch zone 112-140 m, sebka lattice 50-108 m.
 * - The portico in front of the south wall (16 m, 10 m deep), a row of
 *   tall open horseshoe bays: from the general and dahbi2 photos; OSM
 *   draws the whole hall at 27 m.
 * - The minaret's lower shaft carries a framed horseshoe-arch panel
 *   (30-46 m) under the sebka field (50-110 m), as in the general photo;
 *   the low model draws the lattice as flush lozenges in a recessed
 *   panel, the detail model as relief.
 * - Stone pulled toward the warm pinkish beige of the west and south
 *   photos (front: #f5cdb3 in sun).
 * - Estimated: portal and arcade spacing, niche depths, the wings' bays.
 * - Invented/simplified: the laser beam; the hall's sliding roof is drawn
 *   closed; zellige patterns are a single green; the sebka lattice is a grid
 *   of diamond recesses in the detail model and a plain recessed panel in
 *   the low one.
 * - Look-only references: none.
 * - Doubts: the east (qibla) annex and its pavilions have no good photo and
 *   are plain from OSM; the north (sea) facade is seen only from far off.
 *
 * Night: the stone, the minaret most of all, is floodlit (`_FLOODLIGHT`);
 * the lantern and the arched windows are `window`. The laser is not drawn.
 */
import { polyTris } from './berlin-oberbaum-bridge'
import { Part, type MaterialSpec, type V3 } from './mesh'
import { writeModel } from './london-buckingham-palace'
import { PALETTE, finish } from './palette'

// ───────────────────────────── shared Moroccan kit ─────────────────────────────

export type XY = [number, number]
const TAU = Math.PI * 2
export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const scl = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const subv = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => scl(a, 1 / (Math.hypot(...a) || 1))
const area2 = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
export const ccw = (r: XY[]) => (area2(r) < 0 ? [...r].reverse() : r)

/** A flat triangle wound to face `n`. */
export function ftri(p: Part, a: V3, b: V3, c: V3, n: V3) {
  const g = crs(subv(b, a), subv(c, a))
  if (Math.hypot(...g) < 1e-10) return
  if (dot(g, n) < 0) p.tri(a, c, b)
  else p.tri(a, b, c)
}
export function fquad(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  ftri(p, a, b, c, n)
  ftri(p, a, c, d, n)
}

/** A wall plane: point (s, t) is o + s·u + t·v; the face looks along u × v. */
export type Face = { o: V3; u: V3; v: V3 }
export const at = (f: Face, s: number, t: number, d = 0): V3 =>
  add(add(add(f.o, scl(f.u, s)), scl(f.v, t)), scl(normalOf(f), d))
export const normalOf = (f: Face) => unit(crs(f.u, f.v))
/** The face of a vertical wall along edge a→b of a ring counter-clockwise from above, t = z - z0. */
export const edgeFace = (a: XY, b: XY, z0: number): Face => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  return { o: [a[0], a[1], z0], u: [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0], v: [0, 0, 1] }
}

/**
 * A recess cut into a wall: its outline in the wall's (s, t), how deep it
 * goes, the part its back is drawn in (its reveals take `reveal`, or the
 * wall's own part), and recesses cut further into its back.
 */
export type Niche = { poly: XY[]; depth: number; back: Part; reveal?: Part; kids?: Niche[]; inlay?: boolean }
/** A flush shape laid on a wall (a tile panel, a door leaf, a window): no hole, 2 cm proud. */
export const inlay = (poly: XY[], back: Part): Niche => ({ poly, depth: 0, back, inlay: true })

const bbox = (r: XY[]) => {
  const xs = r.map((q) => q[0]), ys = r.map((q) => q[1])
  return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
}
/**
 * Triangles covering an outline less its holes. An upright rectangle is cut
 * into horizontal bands between rows of holes and each row into vertical
 * strips, one hole to a strip, so no cut line can graze another hole's
 * corner; anything else goes to `polyTris` whole.
 */
export function faceTris(outline: XY[], holes: XY[][]): [XY, XY, XY][] {
  if (!holes.length) return polyTris(outline)
  const [S0, S1, T0, T1] = bbox(outline)
  const isRect = outline.length === 4 && outline.every(([x, y]) => (Math.abs(x - S0) < 1e-6 || Math.abs(x - S1) < 1e-6) && (Math.abs(y - T0) < 1e-6 || Math.abs(y - T1) < 1e-6))
  if (!isRect) return polyTris(outline, holes)
  const out: [XY, XY, XY][] = []
  const quad = (s0: number, s1: number, t0: number, t1: number) => {
    if (s1 - s0 < 1e-6 || t1 - t0 < 1e-6) return
    out.push([[s0, t0], [s1, t0], [s1, t1]], [[s0, t0], [s1, t1], [s0, t1]])
  }
  const hb = holes.map((h) => ({ h, b: bbox(h) })).sort((a, b) => a.b[2] - b.b[2])
  // rows: holes whose t-ranges overlap
  const rows: { t0: number; t1: number; hs: typeof hb }[] = []
  for (const x of hb) {
    const r = rows[rows.length - 1]
    if (r && x.b[2] < r.t1) { r.hs.push(x); r.t1 = Math.max(r.t1, x.b[3]) } else rows.push({ t0: x.b[2], t1: x.b[3], hs: [x] })
  }
  let t = T0
  rows.forEach((r, i) => {
    const ta = i === 0 ? T0 : (rows[i - 1].t1 + r.t0) / 2, tb = i === rows.length - 1 ? T1 : (r.t1 + rows[i + 1].t0) / 2
    quad(S0, S1, t, ta) // nothing here: ta === t
    const hs = [...r.hs].sort((a, b) => a.b[0] - b.b[0])
    const disjoint = hs.every((x, k) => k === 0 || x.b[0] > hs[k - 1].b[1] + 0.02)
    if (!disjoint) out.push(...polyTris(rectST(S0, S1, ta, tb), hs.map((x) => x.h)))
    else {
      let s = S0
      hs.forEach((x, k) => {
        const a = k === 0 ? S0 : (hs[k - 1].b[1] + x.b[0]) / 2, b = k === hs.length - 1 ? S1 : (x.b[1] + hs[k + 1].b[0]) / 2
        quad(s, a, ta, tb)
        out.push(...polyTris(rectST(a, b, ta, tb), [x.h]))
        s = b
      })
      quad(s, S1, ta, tb)
    }
    t = tb
  })
  return out
}

/** A wall face over `outline` (in s, t) with real recessed niches. */
export function wall(p: Part, f: Face, outline: XY[], all: Niche[] = []) {
  const n = normalOf(f)
  for (const k of all.filter((q) => q.inlay))
    for (const [a, b, c] of polyTris(ccw(k.poly))) ftri(k.back, at(f, ...a, 0.02), at(f, ...b, 0.02), at(f, ...c, 0.02), n)
  const niches = all.filter((q) => !q.inlay)
  const holes = niches.map((k) => ccw(k.poly))
  for (const [a, b, c] of faceTris(ccw(outline), holes)) ftri(p, at(f, ...a), at(f, ...b), at(f, ...c), n)
  niches.forEach((k, i) => {
    const r = holes[i], rp = k.reveal ?? p
    for (let j = 0; j < r.length; j++) {
      const a = r[j], b = r[(j + 1) % r.length]
      // The reveal faces into the hole: the left of a counter-clockwise edge.
      const into = unit(add(scl(f.u, -(b[1] - a[1])), scl(f.v, b[0] - a[0])))
      fquad(rp, at(f, ...a), at(f, ...b), at(f, ...b, -k.depth), at(f, ...a, -k.depth), into)
    }
    const back: Face = { o: add(f.o, scl(n, -k.depth)), u: f.u, v: f.v }
    wall(k.back, back, k.poly, k.kids ?? [])
  })
}

export type ArchKind = 'round' | 'horseshoe' | 'pointed' | 'flat'
/**
 * An arched opening's outline, counter-clockwise in (s, t): jambs from t0 to
 * the springing ts, then the head. `horseshoe` returns past the jambs by
 * 20 degrees (the Moroccan horseshoe); `pointed` is the broken horseshoe of
 * the Almohad minarets, two arcs struck from a fifth of the span inside the
 * jambs.
 */
export function arch(s0: number, s1: number, t0: number, ts: number, kind: ArchKind, segs = 8): XY[] {
  const w = s1 - s0, sm = (s0 + s1) / 2
  const pts: XY[] = [[s0, t0], [s1, t0], [s1, ts]]
  if (kind === 'flat') return [...pts, [s0, ts]]
  if (kind === 'round') {
    for (let i = 1; i < segs; i++) { const a = (Math.PI * i) / segs; pts.push([sm + (w / 2) * Math.cos(a), ts + (w / 2) * Math.sin(a)]) }
  } else if (kind === 'horseshoe') {
    const a0 = 0.35, R = w / 2 / Math.cos(a0), tc = ts + R * Math.sin(a0)
    for (let i = 0; i <= segs; i++) { const a = -a0 + ((Math.PI + 2 * a0) * i) / segs; pts.push([sm + R * Math.cos(a), tc + R * Math.sin(a)]) }
  } else {
    const d = 0.2 * w, R = w / 2 + d, ph = Math.acos(d / R), h = Math.max(1, Math.floor(segs / 2))
    for (let i = 1; i <= h; i++) { const a = (ph * i) / h; pts.push([sm - d + R * Math.cos(a), ts + R * Math.sin(a)]) }
    for (let i = h - 1; i >= 1; i--) { const a = (ph * i) / h; pts.push([sm + d - R * Math.cos(a), ts + R * Math.sin(a)]) }
  }
  pts.push([s0, ts])
  return pts.filter((q, i) => i === 0 || Math.hypot(q[0] - pts[i - 1][0], q[1] - pts[i - 1][1]) > 1e-6)
}
export const archTop = (s0: number, s1: number, ts: number, kind: ArchKind) => {
  const w = s1 - s0
  if (kind === 'round') return ts + w / 2
  if (kind === 'horseshoe') { const R = w / 2 / Math.cos(0.35); return ts + R * Math.sin(0.35) + R }
  if (kind === 'pointed') { const d = 0.2 * w, R = w / 2 + d; return ts + R * Math.sin(Math.acos(d / R)) }
  return ts
}
export const circle = (cs: number, ct: number, r: number, segs = 12): XY[] =>
  Array.from({ length: segs }, (_, i) => [cs + r * Math.cos((TAU * i) / segs), ct + r * Math.sin((TAU * i) / segs)] as XY)
export const rectST = (s0: number, s1: number, t0: number, t1: number): XY[] => [[s0, t0], [s1, t0], [s1, t1], [s0, t1]]

/** A box on a face: s0..s1 along it, t0..t1 up it, d0..d1 out from it (no back). */
export function obox(p: Part, f: Face, s0: number, s1: number, t0: number, t1: number, d0: number, d1: number, bottom = false) {
  const n = normalOf(f), P = (s: number, t: number, d: number) => at(f, s, t, d)
  fquad(p, P(s0, t0, d1), P(s1, t0, d1), P(s1, t1, d1), P(s0, t1, d1), n)
  fquad(p, P(s0, t1, d0), P(s1, t1, d0), P(s1, t1, d1), P(s0, t1, d1), f.v)
  fquad(p, P(s0, t0, d0), P(s0, t0, d1), P(s0, t1, d1), P(s0, t1, d0), scl(f.u, -1))
  fquad(p, P(s1, t0, d0), P(s1, t0, d1), P(s1, t1, d1), P(s1, t1, d0), f.u)
  if (bottom) fquad(p, P(s0, t0, d0), P(s1, t0, d0), P(s1, t0, d1), P(s0, t0, d1), scl(f.v, -1))
}

/**
 * Stepped Moroccan merlons along the top of a face, outer faces flush with
 * it: `n` merlons, each `steps` tiers narrowing upward, as real blocks.
 */
export function merlons(p: Part, f: Face, s0: number, s1: number, t0: number, n: number, w: number, h: number, depth: number, steps = 3) {
  const pitch = (s1 - s0) / n
  for (let i = 0; i < n; i++) {
    const c = s0 + pitch * (i + 0.5)
    for (let k = 0; k < steps; k++) {
      const hw = (w / 2) * (steps > 1 ? 1 - (0.62 * k) / (steps - 1) : 1)
      obox(p, f, c - hw, c + hw, t0 + (h / steps) * k, t0 + (h / steps) * (k + 1), -depth, 0)
    }
  }
}

/** A ring of points around a centre, counter-clockwise from above. */
export const ringAt = (pts: XY[], z: number): V3[] => pts.map(([x, y]) => [x, y, z])
export const rectRing = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
export const chamferRect = (x0: number, y0: number, x1: number, y1: number, c: number): XY[] => c <= 0 ? rectRing(x0, y0, x1, y1) : [
  [x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c],
]
/** Offset a counter-clockwise ring outward by d (mitred). */
export function offsetRing(r: XY[], d: number): XY[] {
  return r.map((p, i) => {
    const a = r[(i + r.length - 1) % r.length], b = r[(i + 1) % r.length]
    const n1 = unit([p[1] - a[1], -(p[0] - a[0]), 0]), n2 = unit([b[1] - p[1], -(b[0] - p[0]), 0])
    const m = unit(add(n1, n2)), k = d / Math.max(0.3, dot(m, n1))
    return [p[0] + m[0] * k, p[1] + m[1] * k] as XY
  })
}

/** Walls of a ring (counter-clockwise from above) from z0 to z1, with a top. */
export function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, topPart = p) {
  if (z1 - z0 > 1e-6) p.loft([ringAt(ring, z0), ringAt(ring, z1)])
  if (top) for (const [a, b, c] of polyTris(ring)) ftri(topPart, [a[0], a[1], z1], [b[0], b[1], z1], [c[0], c[1], z1], [0, 0, 1])
}
/** A box with chamfered vertical edges and a chamfered top edge. */
export function block(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, c = 0) {
  if (c <= 0) return prism(p, rectRing(x0, y0, x1, y1), z0, z1)
  const r0 = chamferRect(x0, y0, x1, y1, c), r1 = chamferRect(x0 + c, y0 + c, x1 - c, y1 - c, c * 0.6)
  p.loft([ringAt(r0, z0), ringAt(r0, z1 - c)])
  p.loft([ringAt(r0, z1 - c), ringAt(r1, z1)])
  p.cap(ringAt(r1, z1), true)
}
/** A frustum from ring a at za to ring b at zb (same corner count), capped. */
export function frustum(p: Part, a: XY[], za: number, b: XY[], zb: number, cap = true) {
  p.loft([ringAt(a, za), ringAt(b, zb)])
  if (cap) for (const [q, r, s] of polyTris(b)) ftri(p, [q[0], q[1], zb], [r[0], r[1], zb], [s[0], s[1], zb], [0, 0, 1])
}
/** A pyramid from a ring to an apex. */
export function pyramid(p: Part, ring: XY[], z0: number, apex: V3) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const A: V3 = [a[0], a[1], z0], B: V3 = [b[0], b[1], z0]
    ftri(p, A, B, apex, crs(subv(B, A), subv(apex, A)))
  }
}
/** A smooth solid of revolution about (cx, cy): profile of [radius, z], bottom to top. */
export function lathe(p: Part, cx: number, cy: number, prof: [number, number][], segs = 16) {
  const pt = (r: number, z: number, a: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
  const nr = prof.map((_, k) => {
    const a = prof[Math.max(0, k - 1)], b = prof[Math.min(prof.length - 1, k + 1)]
    const dr = b[0] - a[0], dz = b[1] - a[1]
    return [dz, -dr] as XY // outward normal in (r, z)
  })
  for (let k = 0; k < prof.length - 1; k++) for (let i = 0; i < segs; i++) {
    const a0 = (TAU * i) / segs, a1 = (TAU * (i + 1)) / segs
    const N = (kk: number, a: number): V3 => unit([nr[kk][0] * Math.cos(a), nr[kk][0] * Math.sin(a), -nr[kk][1] * -1])
    const q = [pt(prof[k][0], prof[k][1], a0), pt(prof[k][0], prof[k][1], a1), pt(prof[k + 1][0], prof[k + 1][1], a1), pt(prof[k + 1][0], prof[k + 1][1], a0)]
    const ns = [N(k, a0), N(k, a1), N(k + 1, a1), N(k + 1, a0)]
    const bot = prof[k][0] > 1e-6, top = prof[k + 1][0] > 1e-6
    if (bot) p.tri(q[0], q[1], q[2], undefined, undefined, undefined, [ns[0], ns[1], ns[2]])
    if (top) p.tri(q[0], q[2], q[3], undefined, undefined, undefined, [ns[0], ns[2], ns[3]])
  }
}
export const ball = (p: Part, c: V3, r: number, segs = 12) =>
  lathe(p, c[0], c[1], Array.from({ length: segs > 8 ? 7 : 5 }, (_, k) => { const m = segs > 8 ? 6 : 4, a = -Math.PI / 2 + (Math.PI * k) / m; return [Math.max(0, r * Math.cos(a)), c[2] + r * Math.sin(a)] as [number, number] }), segs)

/** Copy a part's triangles into another, turned by `rot` about z and moved by `tr`. */
export function merge(dst: Part, src: Part, rot: number, tr: V3) {
  const c = Math.cos(rot), s = Math.sin(rot)
  const R = (x: number, y: number, z: number): V3 => [c * x - s * y, s * x + c * y, z]
  for (let i = 0; i < src.pos.length; i += 9) {
    const P: V3[] = [], N: V3[] = []
    for (let k = 0; k < 3; k++) {
      const j = i + k * 3
      P.push(add(R(src.pos[j], -src.pos[j + 2], src.pos[j + 1]), tr))
      N.push(R(src.nrm[j], -src.nrm[j + 2], src.nrm[j + 1]))
    }
    dst.tri(P[0], P[1], P[2], undefined, undefined, undefined, N)
  }
}

/** One part per material, by role. */
export type Mats = { stone: Part; shade: Part; zel: Part; roof: Part; win: Part; brass: Part }
export const mats = (): Mats => ({ stone: new Part(), shade: new Part(), zel: new Part(), roof: new Part(), win: new Part(), brass: new Part() })
export function mergeMats(dst: Mats, src: Mats, rot: number, tr: V3) {
  for (const k of Object.keys(src) as (keyof Mats)[]) merge(dst[k], src[k], rot, tr)
}

/**
 * A grid of diamond recesses filling a rectangle: the sebka lattice of
 * Almohad and Alaouite minarets, as real relief.
 */
export function sebka(back: Part, s0: number, s1: number, t0: number, t1: number, cw: number, ch: number, depth: number, avoid: XY[][] = [], fill = 0.36): Niche[] {
  const out: Niche[] = []
  const nx = Math.max(1, Math.floor((s1 - s0) / cw)), ny = Math.max(1, Math.floor((t1 - t0) / ch))
  const dx = (s1 - s0) / nx, dy = (t1 - t0) / ny
  for (let j = 0; j < ny * 2 - 1; j++) {
    const odd = j % 2 === 1, cnt = odd ? nx - 1 : nx
    for (let i = 0; i < cnt; i++) {
      const cs = s0 + dx * (i + (odd ? 1 : 0.5)), ct = t0 + dy * (j / 2 + 0.5)
      const hx = dx * fill, hy = dy * fill
      const poly: XY[] = [[cs, ct - hy], [cs + hx, ct], [cs, ct + hy], [cs - hx, ct]]
      const hit = avoid.some((r) => {
        const xs = r.map((q) => q[0]), ys = r.map((q) => q[1])
        return cs + hx > Math.min(...xs) - 0.3 && cs - hx < Math.max(...xs) + 0.3 && ct + hy > Math.min(...ys) - 0.3 && ct - hy < Math.max(...ys) + 0.3
      })
      if (!hit) out.push({ poly, depth, back })
    }
  }
  return out
}

/** Floodlit stone: walls bright, tops barely. */
export const flood = (k = 0.85) => (_p: V3, n: V3) => (n[2] > 0.8 ? 0.25 : k)

// ───────────────────────────── Hassan II Mosque ─────────────────────────────

export const ID = 'casablanca-hassan-ii-mosque'
export const BEARING = 3.3
const PLINTH = 9 // the deck and esplanade level above the model's base

export type Lod = { detail: boolean; seg: number }

/** The minaret in its own frame: centred on the origin, faces on ±x and ±y, t = 0 at the esplanade. */
function minaret(lod: Lod): Mats {
  const M = mats()
  let last = 0
  const mark = (label: string) => { const t = Object.values(M).reduce((a, p) => a + p.triangles, 0); if (process.env.DEBUG) console.error('  m', label, t - last); last = t }
  const W = 25.7, h = W / 2, c = 0.5, Wf = W - 2 * c
  const seg = lod.seg
  const faces: Face[] = [0, 1, 2, 3].map((k) => {
    const a = (k * Math.PI) / 2, n: V3 = [Math.cos(a), Math.sin(a), 0], u: V3 = [-Math.sin(a), Math.cos(a), 0]
    return { o: add(scl(n, h), scl(u, -(h - c))), u, v: [0, 0, 1] }
  })
  const chamfers = (p: Part, t0: number, t1: number, out = 0) => {
    for (let k = 0; k < 4; k++) {
      const f = faces[k], g = faces[(k + 1) % 4]
      fquad(p, at(f, Wf, t0, out), at(g, 0, t0, out), at(g, 0, t1, out), at(f, Wf, t1, out), unit(add(normalOf(f), normalOf(g))))
    }
  }
  /** A band all round the shaft, proud by `out`. */
  const band = (p: Part, t0: number, t1: number, out: number) => {
    for (const f of faces) obox(p, f, -out * 0.414, Wf + out * 0.414, t0, t1, 0, out, true)
    for (let k = 0; k < 4; k++) {
      const f = faces[k], g = faces[(k + 1) % 4], nn = unit(add(normalOf(f), normalOf(g)))
      const a = at(f, Wf + out * 0.414, 0, out), b = at(g, -out * 0.414, 0, out)
      fquad(p, add(a, [0, 0, t0]), add(b, [0, 0, t0]), add(b, [0, 0, t1]), add(a, [0, 0, t1]), nn)
      const a0 = at(f, Wf, 0, 0), b0 = at(g, 0, 0, 0)
      fquad(p, add(a0, [0, 0, t1]), add(b0, [0, 0, t1]), add(b, [0, 0, t1]), add(a, [0, 0, t1]), [0, 0, 1])
      fquad(p, add(a0, [0, 0, t0]), add(b0, [0, 0, t0]), add(b, [0, 0, t0]), add(a, [0, 0, t0]), [0, 0, -1])
    }
  }

  // Shaft stone zone, 0 (with a footing to the model's base) to 144 m.
  const cs = Wf / 2
  for (const f of faces) {
    const n: Niche[] = []
    // the door at the foot and the small lights of the stair
    if (lod.detail) n.push({ poly: arch(cs - 1.7, cs + 1.7, 0.05, 4.6, 'horseshoe', seg), depth: 0.8, back: M.brass })
    if (lod.detail) for (const ds of [-3, 0, 3]) n.push({ poly: arch(cs + ds - 0.5, cs + ds + 0.5, 46.9, 48.9, 'round', 4), depth: 0.4, back: M.win })
    // the framed horseshoe-arch panel under the lattice, with its window
    n.push({ poly: rectST(cs - 6.5, cs + 6.5, 30.0, 46.2), depth: 0.3, back: M.stone, reveal: M.stone, kids: [
      { poly: arch(cs - 4.5, cs + 4.5, 30.3, 38.0, 'horseshoe', lod.detail ? seg : 5), depth: 0.55, back: M.shade, reveal: M.stone, kids: [
        lod.detail ? { poly: arch(cs - 1.0, cs + 1.0, 30.6, 35.0, 'round', 4), depth: 0.4, back: M.win } : inlay(arch(cs - 1.0, cs + 1.0, 30.6, 35.0, 'round', 3), M.win)] },
      ...(lod.detail ? sebka(M.shade, cs - 6.3, cs + 6.3, 44.6, 46.0, 1.6, 1.4, 0, [], 0.42).map((d) => inlay(d.poly, M.shade)) : []),
    ] })
    // sebka panels: the wide centre and the two side strips
    const centre: [number, number] = [4.4, Wf - 4.4]
    const wins = [-1.6, 1.6].map((ds) => arch(cs + ds - 0.55, cs + ds + 0.55, 96, 98.6, 'round', 4))
    const spring = (w: number) => 109.8 - (archTop(0, w, 0, 'pointed'))
    const lat = (s0: number, s1: number, extra: XY[][] = []): Niche => lod.detail
      ? { poly: arch(s0, s1, 50, spring(s1 - s0), 'pointed', seg), depth: 0.25, back: M.stone, reveal: M.stone,
        kids: [...sebka(M.shade, s0 + 0.35, s1 - 0.35, 50.4, spring(s1 - s0) - 0.6, (s1 - s0 - 0.7) / 4, 3.8, 0.35, extra),
          ...extra.map((poly) => ({ poly, depth: 0.35, back: M.win }))] }
      : { poly: arch(s0, s1, 50, spring(s1 - s0), 'pointed', 2), depth: 0.35, back: M.stone, reveal: M.stone,
        kids: [...sebka(M.shade, s0 + 0.3, s1 - 0.3, 50.4, spring(s1 - s0) - 0.5, (s1 - s0 - 0.6) / 4, 4.3, 0, extra, 0.45).map((d) => inlay(d.poly, M.shade)),
          ...extra.map((poly) => inlay(poly, M.win))] }
    n.push(lat(centre[0], centre[1], wins))
    for (const [s0, s1] of [[1.3, 3.5], [Wf - 3.5, Wf - 1.3]]) n.push(lod.detail
      ? { poly: arch(s0, s1, 50, spring(s1 - s0), 'pointed', 2), depth: 0.25, back: M.stone, reveal: M.stone, kids: sebka(M.shade, s0 + 0.3, s1 - 0.3, 50.4, spring(s1 - s0) - 0.4, 1.6, 3.8, 0.35) }
      : { poly: arch(s0, s1, 50, spring(s1 - s0), 'pointed', 2), depth: 0.5, back: M.shade, reveal: M.stone })
    // the great arch: window arcade, green hood, green spandrels
    const arc: Niche[] = []
    for (let i = -2; i <= 2; i++) if (lod.detail || i % 2 === 0) arc.push({ poly: arch(cs + i * 2.3 - 0.6, cs + i * 2.3 + 0.6, 113, 116.6, lod.detail ? 'round' : 'flat', 4), depth: 0.45, back: M.win })
    if (!lod.detail) arc.push(inlay(arch(cs - 3.8, cs + 3.8, 119.8, 125.5, 'pointed', seg), M.zel))
    else arc.push({ poly: arch(cs - 3.8, cs + 3.8, 119.8, 125.5, 'pointed', seg), depth: 0.25, back: M.zel,
      kids: [{ poly: arch(cs - 2.7, cs + 2.7, 120.1, 125.5, 'pointed', seg), depth: 0.25, back: M.stone, reveal: M.zel }] })
    n.push({ poly: arch(4, Wf - 4, 111.5, 125.5, 'pointed', seg), depth: 0.7, back: M.stone, kids: arc })
    n.push(inlay([[0.9, 129], [8.6, 139.8], [0.9, 139.8]], M.zel))
    n.push(inlay([[Wf - 0.9, 129], [Wf - 0.9, 139.8], [Wf - 8.6, 139.8]], M.zel))
    wall(M.stone, f, rectST(0, Wf, -PLINTH, 144), n)
  }
  mark('faces')
  chamfers(M.stone, -PLINTH, 144)
  band(M.stone, 140.6, 144, 0.55) // the corbelled cornice under the tiles
  mark('cornice')
  // The zellige band, 144-160, flush.
  for (const f of faces) fquad(M.zel, at(f, 0, 144), at(f, Wf, 144), at(f, Wf, 160), at(f, 0, 160), normalOf(f))
  chamfers(M.zel, 144, 160)
  band(M.stone, 160, 161.2, 0.3) // coping
  const octo = (half: number, ch: number) => chamferRect(-half, -half, half, half, ch)
  prism(M.stone, octo(h - 0.01, c), 160.9, 161.2, true)
  for (const f of faces) merlons(M.stone, f, -0.2, Wf + 0.2, 161.2, lod.detail ? 8 : 6, 2.5, lod.detail ? 4 : 3.4, 0.9, lod.detail ? 3 : 1)

  mark('top+merlons')
  // The lantern, 161 to 189 m.
  const L = 15, lh = L / 2, lc = 0.3, Lf = L - 2 * lc
  const lf: Face[] = [0, 1, 2, 3].map((k) => {
    const a = (k * Math.PI) / 2, n: V3 = [Math.cos(a), Math.sin(a), 0], u: V3 = [-Math.sin(a), Math.cos(a), 0]
    return { o: add(scl(n, lh), scl(u, -(lh - lc))), u, v: [0, 0, 1] }
  })
  const lcs = Lf / 2
  for (const f of lf) {
    const n: Niche[] = []
    for (const ds of [-2.6, 0, 2.6]) {
      const w = arch(lcs + ds - 0.75, lcs + ds + 0.75, 163.4, 167.2, 'round', lod.detail ? 4 : 2)
      n.push(lod.detail ? { poly: w, depth: 0.5, back: M.win } : inlay(w, M.win))
    }
    n.push(lod.detail
      ? { poly: rectST(2.0, Lf - 2.0, 169, 180.6), depth: 0.2, back: M.stone, reveal: M.stone, kids: sebka(M.win, 2.3, Lf - 2.3, 169.3, 180.3, 1.75, 2.3, 0.3) }
      : { poly: rectST(2.0, Lf - 2.0, 169, 180.6), depth: 0.4, back: M.shade, reveal: M.stone })
    wall(M.stone, f, rectST(0, Lf, 160, 181.5), n)
    fquad(M.zel, at(f, 0, 181.5), at(f, Lf, 181.5), at(f, Lf, 184.6), at(f, 0, 184.6), normalOf(f))
    fquad(M.stone, at(f, 0, 184.6), at(f, Lf, 184.6), at(f, Lf, 186.3), at(f, 0, 186.3), normalOf(f))
    merlons(M.stone, f, -0.1, Lf + 0.1, 186.3, lod.detail ? 5 : 4, 1.7, 2.6, 0.6, lod.detail ? 3 : 1)
  }
  for (let k = 0; k < 4; k++) {
    const f = lf[k], g = lf[(k + 1) % 4], nn = unit(add(normalOf(f), normalOf(g)))
    for (const [t0, t1, p] of [[160, 181.5, M.stone], [181.5, 184.6, M.zel], [184.6, 186.3, M.stone]] as [number, number, Part][])
      fquad(p, at(f, Lf, t0), at(g, 0, t0), at(g, 0, t1), at(f, Lf, t1), nn)
  }
  prism(M.stone, octo(lh - 0.01, lc), 186.0, 186.3, true)
  mark('lantern')
  // Dome and finial: a cream dome on a short drum, three brass balls.
  const ds = lod.detail ? 20 : 12
  lathe(M.stone, 0, 0, lod.detail
    ? [[5.3, 186.3], [5.3, 187.6], [5.6, 188.4], [5.55, 190], [5.0, 192], [3.9, 193.9], [2.2, 195.4], [0.6, 196.2], [0, 196.4]]
    : [[5.4, 186.3], [5.6, 188.4], [5.3, 191], [3.9, 193.9], [1.4, 195.9], [0, 196.4]], ds)
  lathe(M.brass, 0, 0, [[0.45, 196.1], [0.35, 198], [0.35, 208.4], [0.12, 210], [0, 210]], 8)
  ball(M.brass, [0, 0, 199.4], 1.35, lod.detail ? 12 : 6)
  ball(M.brass, [0, 0, 202.4], 1.1, lod.detail ? 12 : 6)
  ball(M.brass, [0, 0, 205.0], 0.85, lod.detail ? 12 : 6)
  mark('dome')
  return M
}

/** The model, in the hall's frame. */
function build(lod: Lod): Mats {
  const M = mats(), seg = lod.seg
  const P = PLINTH
  let last = 0
  const mark = (label: string) => { const t = Object.values(M).reduce((a, p) => a + p.triangles, 0); if (process.env.DEBUG) console.error(label, t - last); last = t }

  // ── The deck: the hall's platform over the shore, pile slots on its sea faces.
  {
    const x0 = -127, x1 = 82, y0 = -43, y1 = 64
    const ring = rectRing(x0, y0, x1, y1)
    for (let i = 0; i < 4; i++) {
      const a = ring[i], b = ring[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const f = edgeFace(a, b, 0)
      const sea = i === 2 || i === 3 // north and west faces
      const n: Niche[] = []
      if (sea) {
        const pitch = lod.detail ? 5 : 24, cnt = Math.floor((L - 2) / pitch)
        for (let k = 0; k < cnt; k++) {
          const s = 1 + pitch * (k + 0.5) + (L - 2 - cnt * pitch) / 2
          n.push({ poly: arch(s - pitch * 0.22, s + pitch * 0.22, 0.05, P - 1.9, lod.detail ? 'round' : 'flat', 4), depth: 1.6, back: M.shade })
        }
      }
      wall(M.stone, f, rectST(0, L, 0, P), n)
    }
    prism(M.stone, [[x0, y0], [-122, y0], [-122, 59], [x1, 59], [x1, y1], [x0, y1]], P, P, true) // the terrace outside the hall
  }

  mark('deck')
  // ── The prayer hall: walls 27 m, a set-back clerestory to 40, green roofs to 50 and 60.
  const hx0 = -122, hx1 = 82, hy0 = -33, hy1 = 59
  const portal = (s: number, w = 9, t0 = 0.05): Niche => ({
    poly: arch(s - w / 2, s + w / 2, t0, t0 + 14, 'horseshoe', seg), depth: 1.4, back: M.shade, reveal: M.stone,
    kids: [
      inlay(arch(s - w * 0.28, s + w * 0.28, t0 + 0.15, t0 + 6.5, 'round', lod.detail ? seg : 3), M.brass),
      inlay(arch(s - w * 0.24, s + w * 0.24, t0 + 9.6, t0 + 12.2, 'round', lod.detail ? seg : 3), M.win),
    ],
  })
  const slim = (s: number, t0 = 3): Niche => ({ poly: arch(s - 1.1, s + 1.1, t0, t0 + 11, 'pointed', 4), depth: 0.6, back: M.shade })
  const hallRing = rectRing(hx0, hy0, hx1, hy1)
  hallRing.forEach((a, i) => {
    const b = hallRing[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1]), f = edgeFace(a, b, P)
    const n: Niche[] = []
    const xAt = (s: number) => a[0] + f.u[0] * s
    if (i === 0) {
      // south: above the portico, the upper halves of the bays
      const cnt = 9
      for (let k = 0; k < cnt; k++) {
        const s = (L * (k + 0.5)) / cnt, x = xAt(s)
        if (x > -42 && x < -2) continue // behind the minaret
        n.push({ poly: arch(s - 4, s + 4, 16.8, 20.2, 'horseshoe', seg), depth: 1.0, back: M.shade,
          kids: [inlay(arch(s - 2, s + 2, 17.1, 20.0, 'round', seg), M.win)] })
      }
    } else if (i === 1) {
      // east, over the annex
      if (lod.detail) for (let k = 0; k < 4; k++) { const s = (L * (k + 0.5)) / 4; n.push({ poly: arch(s - 3, s + 3, 16.5, 21, 'horseshoe', seg), depth: 0.8, back: M.shade }) }
    } else {
      const xs = i === 2 ? [70, 48, 26, 4, -60, -82, -104] : null
      const ss = xs ? xs.map((x) => (a[0] - x)) : [0.5, 1.5, 2.5].map((q) => (L * q) / 3)
      for (const s of ss) n.push(portal(s))
      const sorted = [...ss].sort((p, q) => p - q)
      if (lod.detail) for (let k = 0; k < sorted.length - 1; k++) if (sorted[k + 1] - sorted[k] > 16) n.push(slim((sorted[k] + sorted[k + 1]) / 2))
      if (i === 3 && lod.detail) n.push(slim(5), slim(L - 5))
    }
    wall(M.stone, f, rectST(0, L, 0, 27), n)
  })
  prism(M.stone, hallRing, P + 27, P + 27, true)
  block(M.stone, hx0 - 0.3, hy0 - 0.3, hx1 + 0.3, hy1 + 0.3, P + 26.2, P + 27.4, 0.4) // coping
  // the two porches on the sea side
  for (const [x0, x1] of [[-41.8, -32.7], [-14.7, -4.9]]) {
    const r = rectRing(x0, hy1, x1, 63.1)
    r.forEach((a, i) => {
      const b = r[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (i === 0) return
      wall(M.stone, edgeFace(a, b, P), rectST(0, L, 0, 24), i === 2 ? [portal(L / 2, 6.4)] : [])
    })
    block(M.stone, x0 - 0.3, hy1, x1 + 0.3, 63.4, P + 23.2, P + 24.6, 0.3)
  }
  mark('hallwalls')
  // Clerestory, 27-40.
  const cx0 = -112.5, cx1 = 70, cy0 = -29.4, cy1 = 52.6
  const cr = rectRing(cx0, cy0, cx1, cy1)
  cr.forEach((a, i) => {
    const b = cr[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1]), f = edgeFace(a, b, P + 27)
    const cnt = Math.round(L / (lod.detail ? 11 : 40)), n: Niche[] = []
    for (let k = 0; k < cnt; k++) {
      const s = (L * (k + 0.5)) / cnt
      n.push({ poly: arch(s - 2.9, s + 2.9, 1.6, 7.2, lod.detail ? 'horseshoe' : 'pointed', lod.detail ? seg : 2), depth: 0.6, back: M.shade,
        kids: [lod.detail ? { poly: circle(s, 7.6, 1.35, 12), depth: 0.25, back: M.win } : inlay(circle(s, 7.6, 1.35, 6), M.win)] })
    }
    wall(M.stone, f, rectST(0, L, 0, 13), n)
  })
  mark('clerestory')
  // Cedar eaves and the green roofs.
  block(M.shade, cx0 - 1, cy0 - 1, cx1 + 1, cy1 + 1, P + 39.6, P + 41, 0.3)
  frustum(M.roof, rectRing(cx0 - 1.2, cy0 - 1.2, cx1 + 1.2, cy1 + 1.2), P + 41, rectRing(-99, -16, 56.5, 39.4), P + 50)
  block(M.shade, -57, -11, 20.5, 37, P + 49.8, P + 51.2, 0.25)
  frustum(M.roof, rectRing(-57.2, -11.2, 20.7, 37.2), P + 51.2, rectRing(-48.5, -2.7, 12.2, 28.7), P + 59.6)
  block(M.roof, -48.5, -2.7, 12.2, 28.7, P + 59.6, P + 60, 0)

  mark('roofs')
  // ── The portico along the courtyard front, 16 m: tall open horseshoe bays.
  {
    const r = rectRing(-121.4, -43, 81.8, hy0)
    r.forEach((a, i) => {
      if (i === 2) return
      const b = r[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1]), f = edgeFace(a, b, P)
      const pitch = lod.detail ? 6.5 : 12, cnt = Math.max(1, Math.floor(L / pitch)), n: Niche[] = []
      for (let k = 0; k < cnt; k++) {
        const s = (L * (k + 0.5)) / cnt, x = a[0] + f.u[0] * s
        if (i === 0 && x > -40 && x < -4) continue
        n.push({ poly: arch(s - pitch * 0.39, s + pitch * 0.39, 0.05, 9.0, 'horseshoe', seg), depth: 3.0, back: M.shade, reveal: M.stone })
      }
      wall(M.stone, f, rectST(0, L, 0, 16), n)
    })
    prism(M.stone, r, P + 16, P + 16, true)
    block(M.stone, -121.7, -43.3, 81.8, hy0, P + 15.4, P + 16.6, 0.3)
  }

  mark('portico')
  // ── The minaret, turned 45 degrees, on its footing.
  mergeMats(M, minaret(lod), Math.PI / 4, [-22.08, -51.25, P])

  mark('minaret')
  // ── The qibla annex to the east, 15 m, with its green-roofed pavilions.
  const ext: XY[] = [[81.8, -33.9], [103.4, -34.1], [111.6, -32.5], [118.1, -30.1], [125.4, -25.7], [131.1, -20.6], [136.0, -14.3], [138.8, -9.4], [141.6, -1.4], [146.0, -1.2], [145.7, 17.7], [142.0, 17.7], [139.4, 26.0], [135.2, 33.6], [129.2, 40.5], [122.1, 45.9], [113.2, 50.0], [105.2, 51.9], [82.0, 51.5]]
  osmBlock(M, ccw(ext), 0, P + 15, lod, (L, i, a, b) => {
    if (Math.abs(a[0] - 82) < 0.5 && Math.abs(b[0] - 81.8) < 0.5) return null // against the hall
    if (L < 4) return []
    if (!lod.detail) return []
    const cnt = Math.max(1, Math.round(L / (lod.detail ? 8 : 12))), out: Niche[] = []
    for (let k = 0; k < cnt; k++) {
      const s = (L * (k + 0.5)) / cnt, w = Math.min(3.6, L / cnt - 1.4)
      out.push({ poly: arch(s - w / 2, s + w / 2, P + 0.05, P + 7, 'horseshoe', seg), depth: 1.2, back: M.shade })
    }
    return out
  })
  const pav = (ring: XY[], z1: number, top: number, inset: number) => {
    block(M.shade, ...bounds(ring, 0.6), P + 15, P + z1, 0.2)
    const r = rectRing(...bounds(ring, 0.8))
    if (inset <= 0) pyramid(M.roof, r, P + z1, [(r[0][0] + r[2][0]) / 2, (r[0][1] + r[2][1]) / 2, P + top])
    else frustum(M.roof, r, P + z1, rectRing(...bounds(ring, -inset)), P + top)
  }
  pav([[97.8, -16.3], [98.0, -31.4], [83.3, -31.7], [83.0, -16.6]], 16.2, 20.5, 0)
  pav([[100.5, 17.8], [82.5, 17.7], [82.6, -0.5], [100.5, -0.4]], 16.2, 20, 3.5)
  {
    const oct: XY[] = ccw([[100.5, 12.6], [103.4, 16.9], [108.7, 17.2], [112.7, 13.6], [113.3, 3.4], [109.9, -0.6], [104.7, -1.0], [100.5, 2.8]])
    prism(M.shade, oct, P + 14.8, P + 16.4, false)
    const c: XY = [106.9, 8.1], shrink = (k: number) => oct.map(([x, y]) => [c[0] + (x - c[0]) * k, c[1] + (y - c[1]) * k] as XY)
    frustum(M.roof, oct, P + 16.4, shrink(0.55), P + 20)
  }

  mark('annex')
  // ── The courtyard wings (15 m) and their pavilions (17 m).
  const wing: XY[] = [[-83.7, -43.0], [-75.3, -42.9], [-75.2, -67.5], [-73.1, -67.4], [-73.1, -74.0], [-68.1, -76.7], [-69.1, -78.4], [-28.8, -99.8], [-28.0, -98.4], [-22.8, -101.2], [-17.0, -97.9], [-16.3, -99.3], [23.3, -76.2], [22.7, -74.9], [28.0, -71.9], [27.3, -64.5], [28.5, -64.5], [28.1, -42.9], [37.0, -42.9], [37.3, -64.4], [37.4, -68.3], [38.9, -68.2], [39.0, -73.0], [39.2, -79.9], [34.6, -82.7], [28.5, -86.3], [27.7, -84.8], [-11.9, -108.4], [-11.1, -110.0], [-16.7, -113.3], [-22.8, -116.9], [-29.8, -113.6], [-34.6, -111.3], [-33.8, -110.0], [-75.2, -89.9], [-75.9, -91.7], [-82.4, -88.7], [-86.1, -86.9], [-86.2, -73.3], [-86.3, -68.1], [-83.6, -67.9]]
  const bays = (L: number, z0: number, tall: boolean): Niche[] => {
    if (L < 6) return []
    if (!lod.detail && L < 40) return []
    const pitch = lod.detail ? 6 : 30, cnt = Math.max(1, Math.floor(L / pitch)), out: Niche[] = []
    for (let k = 0; k < cnt; k++) {
      const s = (L * (k + 0.5)) / cnt
      out.push({ poly: arch(s - 1.7, s + 1.7, z0 + 0.05, z0 + (tall ? 6.5 : 4.4), 'horseshoe', seg), depth: 1.8, back: M.shade, reveal: M.stone })
      if (lod.detail) out.push({ poly: arch(s - 0.9, s + 0.9, z0 + 7.6, z0 + 10.4, 'round', lod.detail ? 6 : 4), depth: 0.4, back: M.win })
    }
    return out
  }
  osmBlock(M, ccw(wing), 0, P + 15, lod, (L) => bays(L, P, false), lod.detail ? 0.35 : 0)
  for (const pv of [
    [[-11.9, -108.4], [-16.3, -99.3], [-17.0, -97.9], [-22.8, -101.2], [-28.0, -98.4], [-28.8, -99.8], [-33.8, -110.0], [-34.6, -111.3], [-29.8, -113.6], [-22.8, -116.9], [-16.7, -113.3], [-11.1, -110.0]],
    [[-75.2, -89.9], [-69.1, -78.4], [-68.1, -76.7], [-73.1, -74.0], [-73.1, -67.4], [-75.2, -67.5], [-83.6, -67.9], [-86.3, -68.1], [-86.2, -73.3], [-86.1, -86.9], [-82.4, -88.7], [-75.9, -91.7]],
    [[28.5, -64.5], [37.3, -64.4], [37.4, -68.3], [38.9, -68.2], [39.0, -73.0], [39.2, -79.9], [34.6, -82.7], [28.5, -86.3], [27.7, -84.8], [25.7, -80.5], [23.3, -76.2], [22.7, -74.9], [28.0, -71.9], [27.3, -64.5]],
  ] as XY[][]) {
    const r = offsetRing(ccw(simplify(pv, 3)), 0.35)
    osmBlock(M, r, 0, P + 17, lod, (L) => (L >= (lod.detail ? 5 : 1e9) ? [{ poly: arch(L / 2 - 2, L / 2 + 2, P + 0.05, P + 8, 'horseshoe', seg), depth: 1.6, back: M.shade, reveal: M.stone },
      ...(lod.detail ? [{ poly: arch(L / 2 - 1.1, L / 2 + 1.1, P + 11.6, P + 13.9, 'round', 4), depth: 0.4, back: M.win }] : [])] : []))
  }
  mark('wings')
  return M
}

const bounds = (r: XY[], grow: number): [number, number, number, number] => {
  const xs = r.map((q) => q[0]), ys = r.map((q) => q[1])
  return [Math.min(...xs) - grow, Math.min(...ys) - grow, Math.max(...xs) + grow, Math.max(...ys) + grow]
}
/** Drop vertices closer than `d` to the previous one (OSM slivers). */
function simplify(r: XY[], d: number): XY[] {
  const out: XY[] = []
  for (const q of r) if (!out.length || Math.hypot(q[0] - out[out.length - 1][0], q[1] - out[out.length - 1][1]) >= d) out.push(q)
  while (out.length > 3 && Math.hypot(out[0][0] - out[out.length - 1][0], out[0][1] - out[out.length - 1][1]) < d) out.pop()
  return out
}

/**
 * An OSM footprint as walls (z0 to z1) with per-edge niches, a flat top and
 * a coping lip. `niches` returns null to leave an edge's wall out.
 */
export function osmBlock(M: Mats, ring: XY[], z0: number, z1: number, _lod: Lod, niches: (L: number, i: number, a: XY, b: XY) => Niche[] | null, coping = 0.35) {
  ring.forEach((a, i) => {
    const b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.05) return
    const n = niches(L, i, a, b)
    if (n === null) return
    if (!n.length) { fquad(M.stone, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [b[1] - a[1], a[0] - b[0], 0]); return }
    wall(M.stone, edgeFace(a, b, z0), rectST(0, L, 0, z1 - z0), n)
  })
  if (coping <= 0) prism(M.stone, ring, z1, z1, true)
  else {
    const o = offsetRing(ring, coping)
    prism(M.stone, o, z1 - 0.9, z1 + 0.5, true)
    for (const [a, b, c] of polyTris(o)) ftri(M.stone, [a[0], a[1], z1 - 0.9], [b[0], b[1], z1 - 0.9], [c[0], c[1], z1 - 0.9], [0, 0, -1])
  }
}

export function materials(M: Mats, prefix: string, colors: { stone: number; shade: number; zel: number; roof: number; brass: number }, lit = flood()) {
  const all: Array<{ part: Part; material: MaterialSpec }> = [
    { part: M.stone, material: { ...finish(`${prefix}-stone`, colors.stone), floodlight: lit } },
    { part: M.shade, material: finish(`${prefix}-shade`, colors.shade) }, // recesses stay in shadow at night
    { part: M.zel, material: { ...finish(`${prefix}-zellige`, colors.zel, 0.5), floodlight: lit } },
    { part: M.roof, material: finish(`${prefix}-roof-tile`, colors.roof, 0.55) },
    { part: M.win, material: PALETTE.window },
    { part: M.brass, material: { ...finish(`${prefix}-brass`, colors.brass, 0.45), floodlight: () => 0.6 } },
  ]
  return all.filter(({ part }) => part.triangles > 0)
}

const COLORS = { stone: 0xe8cdb9, shade: 0xc7a994, zel: 0x4f8a7c, roof: 0x52795f, brass: 0xb8935a }

if (import.meta.main) {
  const extras = { bearing: BEARING, elevation: 0, height: PLINTH + 210 }
  writeModel('Hassan II Mosque', ID, materials(build({ detail: false, seg: 3 }), 'hassan', COLORS), extras, 6500)
  writeModel('Hassan II Mosque', ID, materials(build({ detail: true, seg: 8 }), 'hassan', COLORS), extras, 40000, `${ID}.detail`)
}
