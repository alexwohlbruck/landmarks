/**
 * New Mosque (Yeni Cami), Eminönü, Istanbul: procedural, CC0-1.0.
 * bun generators/istanbul-new-mosque.ts
 *
 * Begun 1597 (Davud Ağa, then Dalgıç Ahmed Ağa), finished 1665 (Mustafa
 * Ağa) for Turhan Hatice Sultan. The prayer hall's pyramid of domes: a
 * central dome on a window drum with four octagonal weight turrets, four
 * semi-domes on window drums, four corner domes and small domes on the
 * corner turrets; the two-storey side porticoes under lead lean-to roofs;
 * the two minarets with three şerefes each, at the ends of the wall between
 * hall and courtyard; the square courtyard with its domed arcade (24 domes
 * on 20 columns: a 7 x 7 grid of bays with the middle 5 x 5 open), the
 * raised gate and the octagonal şadırvan.
 *
 * This file also exports the small mosque kit (domes, drums, semi-domes,
 * arcades, minarets) that istanbul-rustem-pasha-mosque, istanbul-fatih-
 * mosque and istanbul-mihrimah-sultan-edirnekapi import; the New Mosque's
 * own build runs only when this file is run directly.
 *
 * Frame: x across the axis (towards world 49, the Eminönü square side), y
 * along it towards the courtyard (world 319), z up; placed with bearing
 * 319. Origin at the centroid of the OSM outline (relation/7574356),
 * 28.972069, 41.016953. The site is flat (Eminönü, by the Golden Horn);
 * the hall and courtyard floors stand on a platform about 1.8 m above the
 * square (steps in photos a00, a15). Elevation 0. No terrain check could
 * run: Mapterhorn has no z15 terrain here, and there is no lidar for
 * Turkey.
 *
 * OSM (ODbL), fetched 2026-11: relation/7574356 (outline: hall y -36..0
 * with its side porticoes, x -25.8..28.8; courtyard y 0..41.3, x
 * -21.4..18.8; an inner ring for the open court x -11.3..11.1, y
 * 10.7..35.5; notches for the minaret bases). OSM has no parts or heights.
 * The outline is a little lopsided (the hall's centre is 1.5 m east of the
 * court's); the model is centred on the open court's axis and made
 * symmetric, as the photos show. The minaret notches differ between the two
 * sides (y 0..10 east, y 12..20 west); both minarets are put at y 5.5,
 * where the photos show them, at the ends of the hall's front wall.
 * The Hünkâr Kasrı (royal pavilion, way/939052267, "Padişah Mahfili"
 * node/12768472401) is a separate building outside the outline, so it is
 * left out, as the brief asks.
 *
 * Published (Wikipedia en "New Mosque, Istanbul", tr "Yeni Cami"):
 * - main dome 17.5 m across (tr: 16.2 m), 36 m high inside; four
 *   semi-domes; the interior 41 m square; two minarets with three şerefes,
 *   sixteen-sided shafts on square bases, lead caps;
 * - courtyard 39 m a side, 24 domed bays on 20 columns, an octagonal
 *   şadırvan; 66 domes and semi-domes in all.
 *
 * Estimated from photos. The level telephoto b01 from the Golden Horn,
 * near the axis, is the ruler: the courtyard front (40 m, OSM) spans 405 px
 * of the 1280 px image, 10.1 px/m, scaled by distance to about 9.6 px/m at
 * the minarets and 9.3 at the dome; the ground is hidden by boats and is
 * put where the 10 m courtyard wall puts it:
 * - minarets at the courtyard's corners, x +-21.6 (their spacing is the
 *   courtyard's width in b01); şerefes at 32.4, 39.4 and 46.4 m, cap base
 *   54.4 m, cap tip 64.6 m, alem to 67 m (b01 reads 64-67 m depending on
 *   where the hidden ground is put; the upper value matches the photo's
 *   proportion of minaret over dome, alem tip at 0.69 of the minaret);
 * - main dome 17.2 m across outside (published 16.2-17.5 inside), drum
 *   29.6-33.4 m, crown 40.3 m, alem to 46.3 m; weight turrets at +-10.2 m,
 *   domes 31-33.4 m;
 * - semi-domes 14 m across, window drums 19.6-23.4 m, crowns 27.6 m;
 * - corner domes 6.6 m across at +-13.9 m, 19.6-22.2 m; hall walls to
 *   16 m (the hall's front cornice reads 15.2 m); courtyard walls 10 m,
 *   their domes to 12.4 m; the wing along the hall (son cemaat yeri)
 *   higher, roof 13 m, domes to 15.4 m (b01 shows a second row of domes
 *   over the far wing at about 16-17 m);
 * - side porticoes' lean-to roofs 13.6 m at the wall to 11.4 m at the eave.
 * Invented / simplified: window counts and sizes (grouped: one panel per
 * real window); the exedra half-domes round the semi-domes and many of the
 * 66 small domes are merged into the drums and turrets; arches are drawn
 * round-headed or plainly pointed.
 *
 * Minarets drawn 2.8 m across (b01 reads the real shaft about 2.2 m
 * across, so about 1.3x) with bold şerefe rings projecting 1 m. The
 * height ratio was rechecked on b01 against the model's axis render.
 *
 * Colours from daylight photos pulled to the palette: grey-cream limestone
 * (#e2ddd2, the stone is weathered greyer than the Blue Mosque's), blue-grey
 * lead (#9aa3ad), gilt alems. Night (b11): the mosque is floodlit gold, so
 * stone and lead carry _FLOODLIGHT; windows glow.
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 * - b01 "New Mosque, Istanbul, from Bosphorus.jpg", Till Niermann, CC BY 3.0
 *   (from the Golden Horn on the axis, about 319; telephoto)
 *   https://commons.wikimedia.org/wiki/File:New_Mosque,_Istanbul,_from_Bosphorus.jpg
 * - a00 "Yeni Cami in Istanbul..00.jpg", Ddovah, CC BY-SA 4.0 (courtyard
 *   front from Eminönü square, about 330)
 *   https://commons.wikimedia.org/wiki/File:Yeni_Cami_in_Istanbul..00.jpg
 * - a15 "The New Mosque (Yeni Cami) (8393797619).jpg", Jorge Láscar,
 *   CC BY 2.0 (from the north-east, about 30: courtyard side, side portico)
 *   https://commons.wikimedia.org/wiki/File:The_New_Mosque_(Yeni_Cami)_(8393797619).jpg
 * - b05 "New Mosque Yeni Camii Istanbul.JPG", Wolfgang Moroder, CC BY-SA 3.0
 *   (qibla side from the south, about 160)
 *   https://commons.wikimedia.org/wiki/File:New_Mosque_Yeni_Camii_Istanbul.JPG
 * - a14 "La Yeni Cami et le Galata Köprüsü.jpg", Jean-Pierre Bazard,
 *   CC BY-SA 3.0 (from the Galata Tower, north, high: the plan)
 *   https://commons.wikimedia.org/wiki/File:La_Yeni_Cami_et_le_Galata_K%C3%B6pr%C3%BCs%C3%BC.jpg
 * - a12 "Detail of the domes - The New Mosque (Yeni Cami) (8393800623).jpg",
 *   Jorge Láscar, CC BY 2.0 (the cascade, close)
 *   https://commons.wikimedia.org/wiki/File:Detail_of_the_domes_-_The_New_Mosque_(Yeni_Cami)_(8393800623).jpg
 * - b11 "New-mosque-ottoman-night-scene-Istanbul.jpg", SeablueTravelOfficial,
 *   CC BY-SA 4.0 (night)
 *   https://commons.wikimedia.org/wiki/File:New-mosque-ottoman-night-scene-Istanbul.jpg
 * Look-only: none.
 *
 * Doubts: heights are photo-scaled, not measured; the side porticoes'
 * depth (5 m) and the west one's extent rest on the east side's photos
 * (a15, a14) and OSM; the courtyard's bay grid follows the published 24
 * domes on 20 columns, a little larger than OSM's inner ring (22 x 25 m
 * against 28 x 28 m).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

export type XY = [number, number]
export const TAU = Math.PI * 2

// ---------------------------------------------------------------------------
// Mosque kit. Frame: x, y plan, z up (the mesh.ts map frame, turned to the
// placement bearing).

/** A convex planar polygon, fan-triangulated and wound to face `n`. */
export function poly(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    const g = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}

/** Vertical prism over a counter-clockwise ring, flat-shaded. */
export function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false) {
  p.loft([ring.map(([x, y]) => [x, y, z0] as V3), ring.map(([x, y]) => [x, y, z1] as V3)])
  if (top) poly(p, ring.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, ring.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}

/** A rectangle, optionally with chamfered corners, counter-clockwise. */
export function rect(x0: number, x1: number, y0: number, y1: number, c = 0): XY[] {
  if (c <= 0) return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  return [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
}

export function circle(cx: number, cy: number, r: number, n: number, phase = 0): XY[] {
  return Array.from({ length: n }, (_, k) => {
    const a = phase + (k * TAU) / n
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as XY
  })
}

/** Ear-clipping triangulation of a counter-clockwise simple ring: index triples. */
export function earcut(r: XY[]): Array<[number, number, number]> {
  const idx = r.map((_, i) => i)
  const out: Array<[number, number, number]> = []
  const cross = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cross(a, b, p) > 1e-9 && cross(b, c, p) > 1e-9 && cross(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = r[i0], b = r[i1], c = r[i2]
      if (cross(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(r[j], a, b, c))) continue
      out.push([i0, i1, i2])
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** Vertical prism over any simple ring (concave allowed), flat top. */
export function prismPoly(p: Part, ring: XY[], z0: number, z1: number, top = true) {
  const r = ccw(ring)
  p.loft([r.map(([x, y]) => [x, y, z0] as V3), r.map(([x, y]) => [x, y, z1] as V3)])
  if (top) for (const [a, b, c] of earcut(r)) poly(p, [[r[a][0], r[a][1], z1], [r[b][0], r[b][1], z1], [r[c][0], r[c][1], z1]], [0, 0, 1])
}

/** Keep a ring counter-clockwise. */
export function ccw(ring: XY[]): XY[] {
  const a = ring.reduce((s, p, i) => { const q = ring[(i + 1) % ring.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
  return a > 0 ? ring : ring.slice().reverse()
}

/**
 * A surface of revolution about a vertical axis through (cx, cy). `prof`
 * runs [r, z] from the bottom up; r = 0 closes to a point. a0..a1 limits it
 * to part of a turn (semi-domes). smooth: true smooth everywhere; 'ring'
 * smooth round the axis and hard along the profile; false faceted.
 */
export function revolve(p: Part, cx: number, cy: number, prof: [number, number][], n: number, a0 = 0, a1 = TAU, smooth: boolean | 'ring' = true) {
  const m = prof.length
  const nrm2 = prof.map((_, i) => {
    const pa = prof[Math.max(0, i - 1)], pb = prof[Math.min(m - 1, i + 1)]
    const dr = pb[0] - pa[0], dz = pb[1] - pa[1]
    const l = Math.hypot(dr, dz) || 1
    return [dz / l, -dr / l] as [number, number]
  })
  for (let k = 0; k < n; k++) {
    const t0 = a0 + ((a1 - a0) * k) / n, t1 = a0 + ((a1 - a0) * (k + 1)) / n
    for (let i = 0; i < m - 1; i++) {
      const P = (j: number, t: number): V3 => [cx + prof[j][0] * Math.cos(t), cy + prof[j][0] * Math.sin(t), prof[j][1]]
      const N = (j: number, t: number): V3 => [nrm2[j][0] * Math.cos(t), nrm2[j][0] * Math.sin(t), nrm2[j][1]]
      const dr = prof[i + 1][0] - prof[i][0], dz = prof[i + 1][1] - prof[i][1]
      const l = Math.hypot(dr, dz) || 1
      const tm = (t0 + t1) / 2
      const F: V3 = [(dz / l) * Math.cos(tm), (dz / l) * Math.sin(tm), -dr / l]
      const S = (t: number): V3 => [(dz / l) * Math.cos(t), (dz / l) * Math.sin(t), -dr / l]
      const nA = smooth === 'ring' ? S(t0) : smooth ? N(i, t0) : F, nB = smooth === 'ring' ? S(t1) : smooth ? N(i, t1) : F
      const nC = smooth === 'ring' ? S(t1) : smooth ? N(i + 1, t1) : F, nD = smooth === 'ring' ? S(t0) : smooth ? N(i + 1, t0) : F
      const a = P(i, t0), b = P(i, t1), c = P(i + 1, t1), d = P(i + 1, t0)
      if (prof[i][0] > 1e-6) p.tri(a, b, c, undefined, undefined, undefined, [nA, nB, nC])
      if (prof[i + 1][0] > 1e-6) p.tri(a, c, d, undefined, undefined, undefined, [nA, nC, nD])
    }
  }
}

/** Points of a segmental dome: base radius r at z, rising h; `rings` steps. */
export function domeProfile(r: number, z: number, h: number, rings: number): [number, number][] {
  const R = (r * r + h * h) / (2 * h), zc = z + h - R
  const top = Math.asin(Math.min(1, r / R))
  const start = h > r ? Math.PI - top : top
  return Array.from({ length: rings + 1 }, (_, k) => {
    const a = start * (1 - k / rings)
    return [R * Math.sin(a), zc + R * Math.cos(a)] as [number, number]
  })
}

/** A flat panel on a vertical wall, from a to b along the wall, out by `out` along n. */
export function panel(p: Part, a: XY, b: XY, z0: number, z1: number, n: XY, arch: boolean | 'pointed' = false, out = 0.05) {
  const o: XY = [n[0] * out, n[1] * out]
  const A: V3 = [a[0] + o[0], a[1] + o[1], z0], B: V3 = [b[0] + o[0], b[1] + o[1], z0]
  const N3: V3 = [n[0], n[1], 0]
  if (!arch) {
    poly(p, [A, B, [B[0], B[1], z1], [A[0], A[1], z1]], N3)
    return
  }
  const w = Math.hypot(b[0] - a[0], b[1] - a[1]), r = w / 2
  const ux = (b[0] - a[0]) / w, uy = (b[1] - a[1]) / w
  const at = (d: number, z: number): V3 => [A[0] + ux * d, A[1] + uy * d, z]
  const pts: V3[] = []
  if (arch === 'pointed') {
    // two arcs of radius 0.8 w meeting at the crown
    const R = 0.8 * w, off = R - r, ht = Math.sqrt(R * R - off * off), zs = z1 - ht
    poly(p, [A, B, at(w, zs), at(0, zs)], N3)
    for (let k = 0; k <= 3; k++) {
      const t = Math.PI - (Math.acos(off / R) * k) / 3 // left arc, centre at d = r + off
      pts.push(at(r + off + R * Math.cos(t), zs + R * Math.sin(t)))
    }
    for (let k = 2; k >= 0; k--) {
      const t = (Math.acos(off / R) * k) / 3 // right arc mirrored
      pts.push(at(r - off + R * Math.cos(Math.PI - t) * -1, zs + R * Math.sin(t)))
    }
    poly(p, pts, N3)
    return
  }
  const zs = z1 - r
  poly(p, [A, B, at(w, zs), at(0, zs)], N3)
  for (let k = 0; k <= 4; k++) {
    const t = Math.PI - (Math.PI * k) / 4
    pts.push(at(r + r * Math.cos(t), zs + r * Math.sin(t)))
  }
  poly(p, pts, N3)
}

/** Window panels spread along a wall: `count` windows of width w, centred in equal bays. */
export function windowRow(p: Part, a: XY, b: XY, count: number, w: number, z0: number, z1: number, n: XY, arch: boolean | 'pointed' = false, skip: (k: number) => boolean = () => false) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  for (let k = 0; k < count; k++) {
    if (skip(k)) continue
    const m = (L * (k + 0.5)) / count
    panel(p, [a[0] + ux * (m - w / 2), a[1] + uy * (m - w / 2)], [a[0] + ux * (m + w / 2), a[1] + uy * (m + w / 2)], z0, z1, n, arch)
  }
}

export type MinaretSpec = {
  /** shaft radius (drawn bold) */
  R: number
  /** square pedestal half side and top */
  pedHalf: number
  ped: number
  /** şerefe floor heights */
  balconies: number[]
  capBase: number
  /** top of the lead cap; the alem rises above it */
  capTip: number
  alem: number
  n?: number
  /** bottom of the pedestal (default 0) */
  base?: number
  /** how far the şerefe ring projects (default 1.25) */
  ring?: number
}

/** Materials of a mosque, and the shapes built from them. */
export class MosqueKit {
  constructor(public stone: Part, public lead: Part, public win: Part, public gilt: Part) {}

  /** The gilt finial: a stem with a bulb, drawn bold. */
  alem(cx: number, cy: number, z: number, h: number) {
    const w = Math.max(0.2, h * 0.07)
    revolve(this.gilt, cx, cy, [[w * 1.6, z - 0.2], [w * 2.6, z + h * 0.3], [w * 0.9, z + h * 0.55], [0, z + h]], 5, 0, TAU, true)
  }

  /** A lead dome with a short lip, and its alem. */
  dome(cx: number, cy: number, r: number, z: number, h: number, n: number, rings: number, alemH = 0, lip = true) {
    if (lip) revolve(this.lead, cx, cy, [[r + 0.25, z - 0.35], [r + 0.25, z]], n, 0, TAU, 'ring')
    revolve(this.lead, cx, cy, lip ? [[r + 0.25, z], ...domeProfile(r, z, h, rings)] : domeProfile(r, z, h, rings), n)
    if (alemH > 0) this.alem(cx, cy, z + h, alemH)
  }

  /**
   * A polygonal stone drum with a window on every `every`-th face (or none),
   * and buttress-free flat faces. Phase puts a vertex at angle `phase`.
   */
  drum(cx: number, cy: number, r: number, z0: number, z1: number, n: number, o: { every?: number; frac?: number; wz0?: number; wz1?: number; arch?: boolean | 'pointed'; phase?: number } = {}) {
    const ph = o.phase ?? Math.PI / n
    prism(this.stone, circle(cx, cy, r, n, ph), z0, z1, false)
    const every = o.every ?? 1
    if (every <= 0) return
    const frac = o.frac ?? 0.55
    for (let k = 0; k < n; k += every) {
      const t0 = ph + (k * TAU) / n, t1 = ph + ((k + 1) * TAU) / n, tm = (t0 + t1) / 2
      const A: XY = [cx + r * Math.cos(t0), cy + r * Math.sin(t0)], B: XY = [cx + r * Math.cos(t1), cy + r * Math.sin(t1)]
      const f = (s: number): XY => [A[0] + (B[0] - A[0]) * s, A[1] + (B[1] - A[1]) * s]
      const nn = Math.cos(Math.PI / n)
      panel(this.win, f(0.5 - frac / 2), f(0.5 + frac / 2), o.wz0 ?? z0 + 0.6, o.wz1 ?? z1 - 0.5, [Math.cos(tm) / nn * nn, Math.sin(tm)], o.arch ?? 'pointed')
    }
  }

  /**
   * A semi-dome opening towards angle `a` (its flat side faces a + PI) from
   * centre c: a half drum with windows from z0 to z1, then a segmental half
   * dome to `crown`.
   */
  semidome(c: XY, r: number, a: number, z0: number, z1: number, crown: number, n = 10, windows = true, skirt = 0) {
    const a0 = a - Math.PI / 2, a1 = a + Math.PI / 2
    if (skirt > 0) revolve(this.lead, c[0], c[1], [[r + skirt, z0], [r + skirt, z0 + 0.8], [r + 0.2, z0 + 0.8 + skirt * 0.7]], n, a0, a1)
    revolve(this.stone, c[0], c[1], [[r, z0], [r, z1]], n, a0, a1, false)
    if (windows) {
      const wz0 = skirt > 0 ? z0 + 0.9 + skirt * 0.7 : z0 + 0.6
      for (let k = 0; k < n; k++) {
        const t0 = a0 + (Math.PI * k) / n, t1 = a0 + (Math.PI * (k + 1)) / n, tm = (t0 + t1) / 2
        const A: XY = [c[0] + r * Math.cos(t0), c[1] + r * Math.sin(t0)], B: XY = [c[0] + r * Math.cos(t1), c[1] + r * Math.sin(t1)]
        const f = (s: number): XY => [A[0] + (B[0] - A[0]) * s, A[1] + (B[1] - A[1]) * s]
        panel(this.win, f(0.24), f(0.76), wz0, z1 - 0.45, [Math.cos(tm), Math.sin(tm)], 'pointed')
      }
    }
    revolve(this.lead, c[0], c[1], [[r + 0.3, z1 - 0.3], [r + 0.3, z1], ...domeProfile(r, z1, crown - z1, 4)], n, a0, a1)
  }

  /** A lean-to lead roof over x0..x1, y0..y1 falling from zHi at the `high` edge to zLo. */
  lean(x0: number, x1: number, y0: number, y1: number, zHi: number, zLo: number, high: '+x' | '-x' | '+y' | '-y', thick = 0.5) {
    const z = (x: number, y: number) => {
      const t = high === '+x' ? (x - x0) / (x1 - x0) : high === '-x' ? (x1 - x) / (x1 - x0) : high === '+y' ? (y - y0) / (y1 - y0) : (y1 - y) / (y1 - y0)
      return zLo + (zHi - zLo) * t
    }
    const c: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    const top = c.map(([x, y]) => [x, y, z(x, y)] as V3), bot = c.map(([x, y]) => [x, y, z(x, y) - thick] as V3)
    const up = high === '+x' ? [-(zHi - zLo) / (x1 - x0), 0, 1] : high === '-x' ? [(zHi - zLo) / (x1 - x0), 0, 1] : high === '+y' ? [0, -(zHi - zLo) / (y1 - y0), 1] : [0, (zHi - zLo) / (y1 - y0), 1]
    poly(this.lead, top, up as V3)
    poly(this.lead, bot, [0, 0, -1])
    this.lead.loft([bot, top])
  }

  /**
   * An open arcade face from a to b: `bays` round arches on square piers,
   * piers `depth` deep behind the face (towards -n), springing at `spring`,
   * the spandrel wall up to `top`. Every bay is a real opening.
   */
  arcade(a: XY, b: XY, bays: number, spring: number, top: number, n: XY, pier = 0.9, depth = 1.0, base = 0, segs = 6) {
    const p = this.stone
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
    const bay = L / bays
    const at = (d: number, off: number, z: number): V3 => [a[0] + ux * d + n[0] * off, a[1] + uy * d + n[1] * off, z]
    const N3: V3 = [n[0], n[1], 0]
    for (let k = 0; k <= bays; k++) {
      const d = k * bay
      const d0 = Math.max(0, d - pier / 2), d1 = Math.min(L, d + pier / 2)
      const ring: XY[] = [at(d0, -depth, 0), at(d1, -depth, 0), at(d1, 0, 0), at(d0, 0, 0)].map((v) => [v[0], v[1]] as XY)
      prism(p, ccw(ring), base, spring, false)
    }
    for (let k = 0; k < bays; k++) {
      const c = (k + 0.5) * bay, r = bay / 2 - pier / 2
      const pts: Array<[number, number]> = []
      for (let i = 0; i <= segs; i++) {
        const t = Math.PI - (Math.PI * i) / segs
        pts.push([c + r * Math.cos(t), spring + r * Math.sin(t)])
      }
      const eL = c - bay / 2, eR = c + bay / 2
      const tx = (i: number) => eL + ((eR - eL) * i) / segs
      poly(p, [at(eL, 0, spring), at(pts[0][0], 0, spring), at(eL, 0, top)], N3)
      poly(p, [at(pts[segs][0], 0, spring), at(eR, 0, spring), at(eR, 0, top)], N3)
      for (let i = 0; i < segs; i++) {
        const [d0, z0] = pts[i]
        const [d1, z1] = pts[i + 1]
        poly(p, [at(d0, 0, z0), at(d1, 0, z1), at(tx(i + 1), 0, top), at(tx(i), 0, top)], N3)
        if (i % 2) continue
        const [d2, z2] = pts[i + 2]
        const mx = (d0 + d2) / 2 - c, mz = (z0 + z2) / 2 - spring
        poly(p, [at(d0, 0, z0), at(d2, 0, z2), at(d2, -depth, z2), at(d0, -depth, z0)], [-(ux * mx), -(uy * mx), -mz])
      }
    }
  }

  /** A minaret: square pedestal, polygonal shaft, corbelled şerefes, lead cone, alem. */
  minaret(cx: number, cy: number, m: MinaretSpec) {
    const n = m.n ?? 10, R = m.R
    prism(this.stone, rect(cx - m.pedHalf, cx + m.pedHalf, cy - m.pedHalf, cy + m.pedHalf, 0.3), m.base ?? 0, m.ped)
    // the tapered transition (pabuç) from the square to the shaft
    revolve(this.stone, cx, cy, [[m.pedHalf * 1.0, m.ped], [R * 1.12, m.ped + 2.2]], n, Math.PI / n, TAU + Math.PI / n, 'ring')
    let z = m.ped + 2.2
    for (const b of m.balconies) {
      revolve(this.stone, cx, cy, [[R * (z === m.ped + 2.2 ? 1.12 : 1), z], [R, b - 1.8]], n, 0, TAU, 'ring')
      const g = m.ring ?? 1.25
      revolve(this.stone, cx, cy, [[R, b - 1.8], [R + g, b], [R + g, b + 1.15], [R, b + 1.25]], n, 0, TAU, 'ring')
      z = b + 1.25
    }
    revolve(this.stone, cx, cy, [[R, z], [R * 0.94, m.capBase]], n, 0, TAU, 'ring')
    revolve(this.lead, cx, cy, [[R * 1.06, m.capBase - 0.2], [R * 1.06, m.capBase + 0.3], [0.28, m.capTip - 0.3], [0, m.capTip]], n)
    this.alem(cx, cy, m.capTip - 0.3, m.alem)
  }
}

export const lit = (k: number) => (_p: V3, nrm: V3) => k * (nrm[2] > 0.9 ? 0.45 : 1)

// ---------------------------------------------------------------------------
// The New Mosque.

function build() {
  const stone = new Part(), lead = new Part(), win = new Part(), gilt = new Part()
  const K = new MosqueKit(stone, lead, win, gilt)

  const F = 1.8 // floor platform above the square; estimated from the steps
  const HX = 21, HY0 = -36, HY1 = 1 // hall core (OSM: hall depth 36-37 m; inner 41 m square, published)
  const PX = 26.4 // side porticoes' outer face (OSM: -25.8 / 28.8)
  const CX = 20, CY = 41.3 // courtyard: x +-20 (40 m; published 39), far wall (OSM)
  const WALL = 16 // hall wall cornice; photo-scaled
  const DC: XY = [0, (HY0 + HY1) / 2] // main dome over the hall's centre
  const BH = 10.2 // half side of the dome square (turret centres at +-10.2 m in b01)

  // Hall core.
  prism(stone, rect(-HX, HX, HY0, HY1, 0.5), 0, WALL, false)
  prism(stone, rect(-HX - 0.35, HX + 0.35, HY0 - 0.35, HY1 + 0.35, 0.7), WALL - 0.9, WALL + 0.3, false)
  poly(stone, rect(-HX - 0.35, HX + 0.35, HY0 - 0.35, HY1 + 0.35, 0.7).map(([x, y]) => [x, y, WALL + 0.3] as V3), [0, 0, 1])

  // Qibla wall windows: a low rectangular row, two rows of pointed windows.
  {
    const a: XY = [HX, HY0], b: XY = [-HX, HY0], n: XY = [0, -1]
    windowRow(win, a, b, 7, 1.7, F + 1.2, F + 3.6, n)
    windowRow(win, a, b, 7, 1.7, F + 5.4, F + 8.6, n, 'pointed')
    windowRow(win, a, b, 5, 1.8, F + 10.2, WALL - 1.6, n, 'pointed')
  }
  // Front wall above the courtyard portico.
  windowRow(win, [-HX, HY1], [HX, HY1], 6, 1.6, 11.6, WALL - 1.4, [0, 1], 'pointed', (k) => k === 2 || k === 3)
  // Side walls: the upper row shows above the porticoes' roofs.
  for (const s of [-1, 1]) {
    const a: XY = s > 0 ? [HX, HY1] : [-HX, HY0], b: XY = s > 0 ? [HX, HY0] : [-HX, HY1]
    windowRow(win, a, b, 6, 1.6, 13.9, WALL - 0.7, [s, 0])
  }

  // Side porticoes: two storeys of open arches under a lead lean-to.
  for (const s of [-1, 1]) {
    const xo = s * PX, xi = s * HX
    const x0 = Math.min(xo, xi), x1 = Math.max(xo, xi)
    const a: XY = s > 0 ? [xo, HY1] : [xo, HY0], b: XY = s > 0 ? [xo, HY0] : [xo, HY1]
    // gallery floor slab between the tiers
    prism(stone, rect(x0, x1, HY0, HY1), 6.6, 7.4, true, true)
    K.arcade(a, b, 8, 4.3, 6.6, [s, 0], 1.0, 1.0, 0, 4)
    K.arcade(a, b, 8, 10.0, 11.6, [s, 0], 0.8, 0.8, 7.4, 4)
    // end walls
    prism(stone, rect(x0, x1, HY0, HY0 + 0.9), 0, 11.6, false)
    prism(stone, rect(x0, x1, HY1 - 0.9, HY1), 0, 11.6, false)
    K.lean(s > 0 ? HX : -PX - 0.6, s > 0 ? PX + 0.6 : -HX, HY0 - 0.6, HY1 + 0.6, 13.6, 11.4, s > 0 ? '-x' : '+x')
  }

  // Small domes on the hall's four corner turrets.
  for (const sx of [-1, 1]) for (const y of [HY0 + 1.6, HY1 - 1.6]) {
    const c: XY = [sx * (HX - 1.6), y]
    prism(stone, circle(c[0], c[1], 1.9, 8, Math.PI / 8), WALL, WALL + 2.6)
    K.dome(c[0], c[1], 1.8, WALL + 2.6, 1.5, 8, 2, 1.0, false)
  }

  // Corner domes over the hall's corner bays.
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const c: XY = [sx * 13.9, DC[1] + sy * 13.9]
    K.drum(c[0], c[1], 3.2, WALL, 19.6, 10, { every: 2, frac: 0.5 })
    K.dome(c[0], c[1], 3.3, 19.6, 2.6, 10, 2, 1.2)
  }

  // The four semi-domes on window drums, each over a lead skirt (the exedrae).
  const SR = 7.0, S0 = 19.6, S1 = 23.4, SCROWN = 27.6
  for (const a of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
    // the stone base of each semi-dome's drum, capped by a lead ring (the exedrae roofs)
    const c: XY = [DC[0] + BH * Math.cos(a), DC[1] + BH * Math.sin(a)]
    revolve(stone, c[0], c[1], [[SR + 1.1, WALL], [SR + 1.1, S0 - 0.6]], 8, a - Math.PI / 2, a + Math.PI / 2, false)
    revolve(lead, c[0], c[1], [[SR + 1.4, S0 - 0.6], [SR + 1.4, S0 - 0.3], [SR + 0.1, S0 + 0.3]], 8, a - Math.PI / 2, a + Math.PI / 2)
  }
  K.semidome([DC[0], DC[1] + BH], SR, Math.PI / 2, S0, S1, SCROWN, 8, true, 0)
  K.semidome([DC[0], DC[1] - BH], SR, -Math.PI / 2, S0, S1, SCROWN, 8, true, 0)
  K.semidome([DC[0] + BH, DC[1]], SR, 0, S0, S1, SCROWN, 8, true, 0)
  K.semidome([DC[0] - BH, DC[1]], SR, Math.PI, S0, S1, SCROWN, 8, true, 0)

  // Dome square: the block between the semi-domes up to the drum.
  const MD0 = 29.6, MD1 = 33.4, MDR = 8.6
  prism(stone, rect(DC[0] - BH, DC[0] + BH, DC[1] - BH, DC[1] + BH, 0.5), WALL, MD0)
  // the four octagonal weight turrets at its corners
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const c: XY = [DC[0] + sx * BH, DC[1] + sy * BH]
    prism(stone, circle(c[0], c[1], 2.2, 8, Math.PI / 8), WALL, 31)
    K.dome(c[0], c[1], 2.1, 31, 2.4, 8, 2, 1.6, false)
  }
  // main drum with its window ring, and the dome
  K.drum(DC[0], DC[1], MDR, MD0, MD1, 24, { every: 1, frac: 0.5, wz0: MD0 + 1.2, wz1: MD1 - 0.6 })
  for (let k = 0; k < 24; k += 3) {
    // small buttresses round the drum
    const t = ((k + 0.5) * TAU) / 24 + Math.PI / 24
    const c: XY = [DC[0] + (MDR + 0.4) * Math.cos(t), DC[1] + (MDR + 0.4) * Math.sin(t)]
    const ux = Math.cos(t), uy = Math.sin(t), vx = -uy, vy = ux
    prism(stone, ccw([
      [c[0] - ux * 0.7 - vx * 0.4, c[1] - uy * 0.7 - vy * 0.4], [c[0] + ux * 0.7 - vx * 0.4, c[1] + uy * 0.7 - vy * 0.4],
      [c[0] + ux * 0.7 + vx * 0.4, c[1] + uy * 0.7 + vy * 0.4], [c[0] - ux * 0.7 + vx * 0.4, c[1] - uy * 0.7 + vy * 0.4],
    ]), MD0, MD1 - 0.3)
  }
  K.dome(DC[0], DC[1], MDR + 0.2, MD1, 6.9, 24, 5, 6)

  // ---------------------------------------------------------------------
  // Courtyard: a 7 x 7 grid of bays, the middle 5 x 5 open; 24 domes.
  const bx = (2 * CX) / 7, by = (CY - HY1) / 7
  const IX = CX - bx, IY0 = HY1 + by, IY1 = CY - by
  const ROOF = 10.0, SPRING = 5.4, SLAB = 1.0
  // the wing along the hall (son cemaat yeri) stands higher: its domes show over the far wing in b01
  const FROOF = 13.0
  prism(stone, rect(-CX, CX, HY1, IY0), FROOF - SLAB, FROOF, true, true)
  for (const sx of [-1, 1]) prism(stone, rect(sx > 0 ? CX - 1.2 : -CX, sx > 0 ? CX : -CX + 1.2, HY1, IY0), ROOF - SLAB, FROOF - SLAB, false)
  prism(stone, rect(-CX, CX, IY1, CY), ROOF - SLAB, ROOF, true, true)
  prism(stone, rect(-CX, -IX, IY0, IY1), ROOF - SLAB, ROOF, true, true)
  prism(stone, rect(IX, CX, IY0, IY1), ROOF - SLAB, ROOF, true, true)
  prism(stone, rect(-CX, -CX + 1.2, HY1, CY), 0, ROOF - SLAB, false)
  prism(stone, rect(CX - 1.2, CX, HY1, CY), 0, ROOF - SLAB, false)
  prism(stone, rect(-CX, CX, CY - 1.2, CY, 0), 0, ROOF - SLAB, false)
  // a cornice round the outer walls
  prism(stone, ccw(rect(-CX - 0.3, CX + 0.3, HY1, CY + 0.3)), ROOF - 0.7, ROOF + 0.15, false)
  // inner arcades
  K.arcade([-IX, IY0], [IX, IY0], 5, SPRING + 2.4, FROOF - SLAB, [0, 1])
  K.arcade([IX, IY1], [-IX, IY1], 5, SPRING, ROOF - SLAB, [0, -1])
  K.arcade([-IX, IY1], [-IX, IY0], 5, SPRING, ROOF - SLAB, [1, 0])
  K.arcade([IX, IY0], [IX, IY1], 5, SPRING, ROOF - SLAB, [-1, 0])
  // the bay domes
  for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) {
    if (i > 0 && i < 6 && j > 0 && j < 6) continue
    const x = -CX + bx * (i + 0.5), y = HY1 + by * (j + 0.5)
    if (i === 3 && j === 6) continue // the gate has its own dome
    K.dome(x, y, Math.min(bx, by) / 2 - 0.35, j === 0 ? FROOF : ROOF, 2.4, 8, 2, 0, false)
  }
  // outer windows: two rows on the sides and the front
  for (const s of [-1, 1]) {
    const a: XY = s > 0 ? [CX, HY1] : [-CX, CY], b: XY = s > 0 ? [CX, CY] : [-CX, HY1]
    windowRow(win, a, b, 7, 1.5, F + 0.8, F + 3.0, [s, 0], false, (k) => k === 3)
    windowRow(win, a, b, 7, 1.4, F + 4.2, F + 6.6, [s, 0], 'pointed')
    // side gates
    panel(win, s > 0 ? [CX, 19.5] : [-CX, 22.8], s > 0 ? [CX, 22.8] : [-CX, 19.5], F, F + 4.6, [s, 0], true)
  }
  windowRow(win, [CX, CY], [-CX, CY], 7, 1.5, F + 0.8, F + 3.0, [0, 1], false, (k) => k === 3)
  windowRow(win, [CX, CY], [-CX, CY], 7, 1.4, F + 4.2, F + 6.6, [0, 1], 'pointed', (k) => k === 3)
  // the main gate: a raised block with a tall arch and its own dome
  prism(stone, rect(-3.6, 3.6, CY - by, CY + 0.6, 0.3), ROOF - SLAB, ROOF + 2.8)
  panel(win, [2.0, CY + 0.6], [-2.0, CY + 0.6], F, F + 5.6, [0, 1], 'pointed')
  K.dome(0, CY - by / 2, 2.6, ROOF + 2.8, 2.0, 10, 2, 1.0)

  // Şadırvan: octagonal, on arches, with a dome.
  {
    const c: XY = [0, (IY0 + IY1) / 2]
    for (const [x, y] of circle(c[0], c[1], 3.1, 8, Math.PI / 8)) prism(stone, circle(x, y, 0.35, 4, Math.PI / 4), 0, F + 3.2, false)
    prism(stone, circle(c[0], c[1], 3.6, 8, Math.PI / 8), F + 3.2, F + 4.1, true, true)
    K.dome(c[0], c[1], 3.1, F + 4.1, 2.2, 12, 2, 1.0)
  }

  // Minarets at the two ends of the hall's front wall.
  for (const sx of [-1, 1]) {
    K.minaret(sx * 21.6, HY1 + 4.2, { R: 1.4, ring: 1.0, pedHalf: 2.2, ped: 13.5, balconies: [32.4, 39.4, 46.4], capBase: 54.4, capTip: 64.6, alem: 2.4, n: 10 })
  }

  const parts = [
    { part: stone, material: { ...finish('limestone', 0xe2ddd2), floodlight: lit(0.9) } },
    { part: lead, material: { ...finish('lead', 0x9aa3ad), floodlight: () => 0.9 } },
    { part: win, material: PALETTE.window },
    { part: gilt, material: { ...finish('gilt', 0xcfa94f), floodlight: () => 0.8 } },
  ]
  return parts
}

if (import.meta.main) {
  const parts = build()
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('New Mosque', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 319, elevation: 0, height: 67,
  })
  if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
  const out = new URL('../models/istanbul-new-mosque.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
