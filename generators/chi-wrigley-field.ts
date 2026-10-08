/**
 * Wrigley Field, Chicago — procedural, CC0-1.0, no textures.
 * bun generators/chi-wrigley-field.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0. The ballpark sits on
 * the street grid, so the model is built in true north rather than along the
 * diamond. The anchor (-87.655543, 41.948193) is the area centroid of the
 * outer ring of the building multipolygon relation/17238872.
 *
 * Evidence
 * - OSM (measured): building relation/17238872 (outer ring = the ballpark's
 *   whole outline, inner ring = the field wall); building:part way/1265638385
 *   (the 1914 outer band of the grandstand, to the upper deck's back wall);
 *   way/1265638386 (the upper deck roof, back wall to front edge);
 *   way/1265761900 (centre-field bleacher block) and way/1265761901 (the
 *   scoreboard's D-shaped plan); way/1265781812 and way/1265761902 (the left
 *   and right field video boards); node/6421453599 (the marquee).
 * - Published: City of Chicago Landmark Designation Report (2004): the
 *   Addison and Clark facades are a 56 ft (17 m), three-storey open steel
 *   frame, with the 1927-28 upper deck, "one and a half storeys", set back
 *   behind it and floodlight frames (1988) on its roof; scoreboard 27 x 75 ft
 *   (8.2 x 22.9 m) over the centre-field bleachers; brick outfield wall
 *   11.5 ft (3.5 m). Wikipedia: left-field video board 3,990 sq ft, right
 *   field 2,400 sq ft; marquee (1934) red since 1960.
 * - Photos (Wikimedia Commons, all checked for this model): drone views by
 *   Sea Cow (CC BY-SA 4.0) "Wrigley Field NE.jpg", "Wrigley Field S.jpg",
 *   "Wrigley Field in line with home plate.jpg", "Wrigley Field in line with
 *   sign.jpg"; street views by David Wilson (CC BY 2.0) "20170915 06
 *   Wrigley Field", "20170915 03 Wrigley Field"; GabboT (CC BY-SA 2.0)
 *   "Cubs 008", "Cubs 017", "Cubs 036"; Brian Crawford (CC BY 2.0) "Dead and
 *   Company Wrigley Field 2019-06-14".
 * - USGS NAIP orthophoto (public domain): the light rigs on the first-base
 *   roof, at x = -15, 13 and 52 m.
 *
 * Estimated
 * - Upper-deck roof at 26.4 m: the 17 m facade plus the published one and a
 *   half storeys, checked against the drone photos (roof depth about twice
 *   the back wall's height).
 * - Upper and lower deck rakes and the deck front 3 m ahead of the roof edge,
 *   from the drone photos.
 * - Light rigs: 10 m frames on the back edge of the roof (photos). The three
 *   third-base rigs are placed from the photos at y = 2, 32, 58 m.
 * - Bleachers: back rising from 8.5 m at the foul poles to 12 m in centre
 *   field; scoreboard 15 to 23.2 m with the clock above; left-field board
 *   9 to 27 m and right-field board 9 to 24 m, all read off the photos.
 * - Marquee 13.5 x 7.5 m, its bottom 4.6 m up, scaled from the windows
 *   below it in the street photos and from the facade in the drone view.
 *
 * Exceptions: the marquee carries its lettering ("WRIGLEY FIELD", "HOME OF",
 * "CHICAGO CUBS") as flat block letters on the panel, as STYLE.md allows for
 * a famous sign. The field, the grass and the warning track are the map's.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

export type XY = [number, number]

// ---------------------------------------------------------------------------
// Small geometry kit, shared with chi-rate-field and chi-united-center.

export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A quad wound to face `hint`, flat-shaded unless normals are given. */
export function quad(p: Part, P: V3[], hint: V3, ns?: V3[]) {
  const face = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const f2 = cross(sub(P[2], P[0]), sub(P[3], P[0]))
  const f = Math.hypot(...face) > 1e-9 ? face : f2
  const ord = dot(f, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const n = ns?.map(unit)
  const t = (a: number, b: number, c: number) => {
    const A = P[ord[a]], B = P[ord[b]], C = P[ord[c]]
    if (Math.hypot(...cross(sub(B, A), sub(C, A))) < 1e-9) return
    p.tri(A, B, C, undefined, undefined, undefined, n && [n[ord[a]], n[ord[b]], n[ord[c]]])
  }
  t(0, 1, 2)
  t(0, 2, 3)
}

/** A triangle wound to face `hint`. */
export function tri(p: Part, a: V3, b: V3, c: V3, hint: V3) {
  const f = cross(sub(b, a), sub(c, a))
  if (Math.hypot(...f) < 1e-9) return
  if (dot(f, hint) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}

/** Ear-clipping triangulation of a simple 2D polygon; returns index triples. */
export function earcut(poly: XY[]): [number, number, number][] {
  const n = poly.length
  let area = 0
  for (let i = 0; i < n; i++) {
    const [x0, y0] = poly[i], [x1, y1] = poly[(i + 1) % n]
    area += x0 * y1 - x1 * y0
  }
  const idx = Array.from({ length: n }, (_, i) => i)
  if (area < 0) idx.reverse()
  const out: [number, number, number][] = []
  const crossZ = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (p: XY, a: XY, b: XY, c: XY) =>
    crossZ(a, b, p) >= -1e-9 && crossZ(b, c, p) >= -1e-9 && crossZ(c, a, p) >= -1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let clipped = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const a = poly[ia], b = poly[ib], c = poly[ic]
      if (crossZ(a, b, c) <= 1e-9) continue
      let ok = true
      for (const j of idx) {
        if (j === ia || j === ib || j === ic) continue
        if (inTri(poly[j], a, b, c)) { ok = false; break }
      }
      if (!ok) continue
      out.push([ia, ib, ic])
      idx.splice(i, 1)
      clipped = true
      break
    }
    if (!clipped) { // degenerate: drop a vertex
      idx.splice(0, 1)
    }
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** Fill a planar polygon given in 3D, triangulated in its own (u, v) plane. */
export function fill(p: Part, pts: V3[], uv: XY[], hint: V3) {
  for (const [a, b, c] of earcut(uv)) tri(p, pts[a], pts[b], pts[c], hint)
}

/** A vertical prism over a 2D ring: walls, and a top cap. */
export function prism(p: Part, ring: XY[], z0: number, z1: number, top: Part | null = p, bottom = false) {
  const n = ring.length
  let cx = 0, cy = 0
  ring.forEach(([x, y]) => { cx += x / n; cy += y / n })
  let area = 0
  for (let i = 0; i < n; i++) area += ring[i][0] * ring[(i + 1) % n][1] - ring[(i + 1) % n][0] * ring[i][1]
  const s = area >= 0 ? 1 : -1
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    const out: V3 = [s * (b[1] - a[1]), -s * (b[0] - a[0]), 0]
    quad(p, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], out)
  }
  if (top) fill(top, ring.map(([x, y]) => [x, y, z1] as V3), ring, [0, 0, 1])
  if (bottom) fill(p, ring.map(([x, y]) => [x, y, z0] as V3), ring, [0, 0, -1])
}

/** An oriented box: centre, three unit axes, half extents. All six faces. */
export function box(p: Part, c: V3, ax: [V3, V3, V3], h: [number, number, number], skipBottom = false) {
  const P = (a: number, b: number, d: number) =>
    add(add(add(c, mul(ax[0], a * h[0])), mul(ax[1], b * h[1])), mul(ax[2], d * h[2]))
  for (const [i, sgn] of [[0, 1], [0, -1], [1, 1], [1, -1], [2, 1], [2, -1]] as [number, number][]) {
    if (skipBottom && i === 2 && sgn === -1) continue
    const o = [0, 1, 2].filter(x => x !== i)
    const corner = (a: number, b: number) => {
      const v = [0, 0, 0]
      v[i] = sgn; v[o[0]] = a; v[o[1]] = b
      return P(v[0], v[1], v[2])
    }
    quad(p, [corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)], mul(ax[i], sgn))
  }
}

/** An upright box from two plan points (a wall or beam), between z0 and z1. */
export function wallBox(p: Part, a: XY, b: XY, thick: number, z0: number, z1: number, skipBottom = true) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0]
  const v: V3 = [-u[1], u[0], 0]
  box(p, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (z0 + z1) / 2], [u, v, [0, 0, 1]], [L / 2, thick / 2, (z1 - z0) / 2], skipBottom)
}

/** Distance along a ray to a polyline: the nearest hit past the origin, or the farthest. */
export function rayHit(o: XY, d: XY, poly: XY[], farthest = false): number | null {
  let best: number | null = null
  for (let i = 0; i < poly.length - 1; i++) {
    const [x1, y1] = poly[i], [x2, y2] = poly[i + 1]
    const ex = x2 - x1, ey = y2 - y1, den = d[0] * ey - d[1] * ex
    if (Math.abs(den) < 1e-12) continue
    const t = ((x1 - o[0]) * ey - (y1 - o[1]) * ex) / den
    const s = ((x1 - o[0]) * d[1] - (y1 - o[1]) * d[0]) / den
    if (t > 1e-6 && s >= -1e-9 && s <= 1 + 1e-9) {
      if (best === null || (farthest ? t > best : t < best)) best = t
    }
  }
  return best
}

/**
 * A swept cross-section: `samples` are rays (origin, direction) across a
 * stand, `outline(k)` the closed cross-section at sample k as (t, z) points
 * counter-clockwise (t outward along the ray). Each outline edge becomes a
 * strip of quads to the next sample in the material `mat(k, edge)` (null
 * skips it), and both ends are capped.
 */
export type Ray = { o: XY; d: XY }
export function sweepSection(
  samples: Ray[],
  outline: (k: number) => XY[],
  mat: (k: number, e: number) => Part | null,
  cap: Part | null,
) {
  const P = (k: number, [t, z]: XY): V3 => [samples[k].o[0] + samples[k].d[0] * t, samples[k].o[1] + samples[k].d[1] * t, z]
  const outs = samples.map((_, k) => outline(k))
  for (let k = 0; k < samples.length - 1; k++) {
    const A = outs[k], B = outs[k + 1], n = A.length
    for (let e = 0; e < n; e++) {
      const m = mat(k, e)
      if (!m) continue
      const f = (e + 1) % n
      const dt = A[f][0] - A[e][0], dz = A[f][1] - A[e][1]
      // CCW in (t, z): outward normal is (dz, -dt).
      const dd: XY = [(samples[k].d[0] + samples[k + 1].d[0]) / 2, (samples[k].d[1] + samples[k + 1].d[1]) / 2]
      const hint: V3 = [dd[0] * dz, dd[1] * dz, -dt]
      quad(m, [P(k, A[e]), P(k, A[f]), P(k + 1, B[f]), P(k + 1, B[e])], hint)
    }
  }
  if (!cap) return
  for (const [k, sgn] of [[0, -1], [samples.length - 1, 1]] as [number, number][]) {
    const j = k === 0 ? 1 : k - 1
    const along: V3 = mul(unit([samples[k].o[0] - samples[j].o[0], samples[k].o[1] - samples[j].o[1], 0]), 1)
    // Tangent of the sweep at the end: away from the neighbouring sample.
    const mid0 = P(k, outs[k][0]), mid1 = P(j, outs[j][0])
    const away = unit(sub(mid0, mid1))
    fill(cap, outs[k].map(q => P(k, q)), outs[k], dot(away, along) !== 0 ? away : mul(along, sgn))
  }
}

/** Block letters, 5 x 7 cells, for the signs. */
const FONT: Record<string, string[]> = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10011', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
}

/**
 * Lettering laid flat on a sign face: `at(u, v)` maps face coordinates
 * (metres, u right, v up) to 3D, already offset off the face. Each letter's
 * cells merge into runs, so a letter costs a few quads.
 */
export function letters(p: Part, text: string, at: (u: number, v: number) => V3, normal: V3, u0: number, v0: number, h: number) {
  const c = h / 7
  let u = u0
  for (const ch of text) {
    const g = FONT[ch]
    if (!g) throw new Error(`no glyph ${ch}`)
    // Merge each row's runs, then stack identical runs on consecutive rows.
    const runs: { a: number; b: number; r0: number; r1: number }[] = []
    for (let r = 0; r < 7; r++) {
      const row = g[r]
      let i = 0
      while (i < 5) {
        if (row[i] !== '1') { i++; continue }
        let j = i
        while (j < 5 && row[j] === '1') j++
        const prev = runs.find(q => q.a === i && q.b === j && q.r1 === r)
        if (prev) prev.r1 = r + 1
        else runs.push({ a: i, b: j, r0: r, r1: r + 1 })
        i = j
      }
    }
    for (const q of runs) {
      const x0 = u + q.a * c, x1 = u + q.b * c
      const y1 = v0 + h - q.r0 * c, y0 = v0 + h - q.r1 * c
      quad(p, [at(x0, y0), at(x1, y0), at(x1, y1), at(x0, y1)], normal)
    }
    u += 6 * c
  }
}
export const textWidth = (text: string, h: number) => (text.length * 6 - 1) * (h / 7)

// ---------------------------------------------------------------------------

function build() {
  const green = new Part(), dark = new Part(), stone = new Part(), brick = new Part()
  const red = new Part(), win = new Part()

  // ---- Grandstand -----------------------------------------------------------
  // OSM polylines (local metres), from the left-field end round home plate to
  // the right-field end. Ends nudged along their own direction so every ray
  // finds them.
  const O: XY[] = [[-84.4,77.0],[-84.5,76.0],[-87.1,55.2],[-88.5,32.8],[-89.4,19.7],[-97.1,20.0],[-97.6,9.8],[-97.6,2.7],[-97.5,-4.6],[-96.8,-15.3],[-90.3,-15.2],[-89.2,-37.1],[-88.6,-46.7],[-88.0,-50.5],[-87.1,-54.2],[-86.0,-57.9],[-84.6,-61.5],[-83.1,-65.3],[-81.2,-69.0],[-79.5,-72.0],[-77.1,-75.1],[-73.0,-79.5],[-68.2,-84.0],[-65.4,-86.0],[-62.2,-88.2],[-57.9,-90.7],[-52.7,-93.2],[-49.1,-94.6],[-45.4,-95.7],[-41.6,-96.5],[-37.8,-97.2],[-34.0,-97.5],[-31.0,-97.5],[-26.5,-97.4],[4.1,-96.0],[10.8,-94.7],[21.9,-90.6],[80.9,-68.4],[86.1,-66.3],[90,-64.8]]
  // Back wall of the upper deck (way/1265638385's inner edge).
  const L1: XY[] = [[-73.9,78.0],[-74.0,75.5],[-78.6,6.4],[-77.5,-39.7],[-76.7,-48.5],[-74.4,-56.6],[-69.9,-64.6],[-63.9,-71.9],[-55.0,-78.3],[-45.8,-83.5],[-37.3,-85.0],[-11.0,-84.8],[2.6,-84.0],[9.7,-82.7],[23.6,-77.3],[81.5,-55.2],[86,-53.5]]
  // Front edge of the roof (way/1265638386).
  const R: XY[] = [[-55.0,78.0],[-55.2,73.9],[-60.4,10.1],[-60.6,-11.9],[-59.8,-41.5],[-57.5,-48.8],[-54.4,-55.3],[-51.7,-59.2],[-47.5,-62.3],[-41.3,-66.1],[-36.1,-67.6],[-9.2,-67.4],[0.9,-66.3],[9.0,-64.2],[75.5,-38.4],[86,-34.3]]
  // Field wall (inner ring of relation/17238872), dugout notches dropped.
  const F: XY[] = [[-36.7,78.0],[-36.6,76.3],[-33.5,38.4],[-36.0,-13.6],[-35.2,-40.1],[-32.5,-43.2],[-6.8,-42.7],[16.4,-36.2],[52.2,-21.2],[81.8,-17.9],[86,-17.5]]

  // Rays across the stand: straight across each wing, fanned round the
  // corner behind home plate from the field corner CC.
  const CC: XY = [-33, -42]
  const rays: Ray[] = []
  for (let i = 0; i <= 20; i++) { const y = 75.4 + (CC[1] - 75.4) * (i / 20); rays.push({ o: [-10, y], d: [-1, 0] }) }
  for (let i = 1; i < 9; i++) { const a = Math.PI + (i / 9) * (Math.PI / 2); rays.push({ o: CC, d: [Math.cos(a), Math.sin(a)] }) }
  for (let i = 0; i <= 19; i++) { const x = CC[0] + (81 - CC[0]) * (i / 19); rays.push({ o: [x, -10], d: [0, -1] }) }
  const isCorner = (k: number) => k > 20 && k < 29

  const ROOF = 26.4, ROOF_U = 25.2, TERRACE = 17, FAC = 16.4
  const T = rays.map(r => {
    const tO = rayHit(r.o, r.d, O, true)!, tL = rayHit(r.o, r.d, L1)!, tR = rayHit(r.o, r.d, R)!
    const tF = rayHit(r.o, r.d, F) ?? 0.5
    return { tO, tL, tR, tF }
  })
  T.forEach((t, k) => { if ([t.tO, t.tL, t.tR].some(v => v == null || isNaN(v))) throw new Error(`ray ${k} missed`) })

  // Cross-section A (the stand) and B (the roof slab), counter-clockwise.
  const secA = (k: number): XY[] => {
    const { tO, tL, tR, tF } = T[k]
    const front = tR - 3
    return [
      [tF, 0], [tO, 0], [tO, FAC], [tO - 0.5, TERRACE], [tL, TERRACE], [tL, ROOF_U], [tL - 0.5, ROOF_U],
      [tL - 0.5, 24], [front, 13.5], [front, 11], [tR + 1, 11], [tR + 1, 9.6], [tF, 1.3],
    ]
  }
  // Edge materials of A, in order: 0 bottom, 1 facade, 2 bevel, 3 terrace,
  // 4 back wall, 5 wall top, 6 wall inside, 7 upper seats, 8 deck fascia,
  // 9 deck underside, 10 back of the lower deck, 11 lower seats, 12 field wall.
  const matA = [null, null, stone, stone, null, green, green, green, dark, green, dark, green, green]
  sweepSection(rays, secA, (_, e) => matA[e], stone)
  const secB = (k: number): XY[] => {
    const { tL, tR } = T[k]
    return [[tR, ROOF_U], [tL + 0.4, ROOF_U], [tL + 0.4, ROOF], [tR + 0.5, ROOF], [tR, ROOF - 0.5]]
  }
  sweepSection(rays, secB, () => dark, dark)

  // Facades, bay by bay: cream masonry with punched windows below, the green
  // steel frame with its large openings above; the upper deck's back wall is
  // green with a band of windows. Red tile awnings over the gates round the
  // Clark and Addison corner.
  const at = (k: number, t: number, z: number): V3 => [rays[k].o[0] + rays[k].d[0] * t, rays[k].o[1] + rays[k].d[1] * t, z]
  for (let k = 0; k < rays.length - 1; k++) {
    const a = at(k, T[k].tO, 0), b = at(k + 1, T[k + 1].tO, 0)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0]
    let out: V3 = [u[1], -u[0], 0]
    const dm: V3 = [(rays[k].d[0] + rays[k + 1].d[0]) / 2, (rays[k].d[1] + rays[k + 1].d[1]) / 2, 0]
    if (dot(out, dm) < 0) out = mul(out, -1)
    const v = (s: number, z: number, d = 0): V3 => [a[0] + u[0] * s + out[0] * d, a[1] + u[1] * s + out[1] * d, z]
    quad(stone, [v(0, 0), v(L, 0), v(L, 7.4), v(0, 7.4)], out)
    quad(green, [v(0, 7.4), v(L, 7.4), v(L, FAC), v(0, FAC)], out)
    if (L > 2.5) {
      quad(win, [v(L * 0.22, 1.6, 0.05), v(L * 0.78, 1.6, 0.05), v(L * 0.78, 5.6, 0.05), v(L * 0.22, 5.6, 0.05)], out)
      quad(win, [v(L * 0.26, 9.4, 0.05), v(L * 0.74, 9.4, 0.05), v(L * 0.74, 14.6, 0.05), v(L * 0.26, 14.6, 0.05)], out)
    }
    // Awnings on the corner and the Addison side as far as the bleacher gate.
    const xMid = (a[0] + b[0]) / 2
    if (isCorner(k) || (k >= 28 && xMid < 25)) {
      const w0 = v(0, 4.3), w1 = v(L, 4.3), w2 = v(L, 3.5, 1.7), w3 = v(0, 3.5, 1.7)
      quad(brick, [w0, w1, w2, w3], add(out, [0, 0, 1.5]))
      quad(brick, [w3, w2, v(L, 3.1, 1.7), v(0, 3.1, 1.7)], out)
    }
    // Upper deck back wall.
    const c = at(k, T[k].tL, 0), e = at(k + 1, T[k + 1].tL, 0)
    const L2 = Math.hypot(e[0] - c[0], e[1] - c[1])
    const u2: V3 = [(e[0] - c[0]) / L2, (e[1] - c[1]) / L2, 0]
    let o2: V3 = [u2[1], -u2[0], 0]
    if (dot(o2, dm) < 0) o2 = mul(o2, -1)
    const w = (s: number, z: number, d = 0): V3 => [c[0] + u2[0] * s + o2[0] * d, c[1] + u2[1] * s + o2[1] * d, z]
    quad(green, [w(0, TERRACE), w(L2, TERRACE), w(L2, ROOF_U), w(0, ROOF_U)], o2)
    if (L2 > 2.5) quad(win, [w(L2 * 0.2, 19.0, 0.05), w(L2 * 0.8, 19.0, 0.05), w(L2 * 0.8, 23.4, 0.05), w(L2 * 0.2, 23.4, 0.05)], o2)
  }

  // Light rigs (1988): white frames on the back edge of the roof, each a row
  // of posts joined by round arches under a long lamp bar tipped to face the
  // field, braced back to the roof.
  const rig = (base: XY, along: XY, toField: XY, W: number) => {
    const A: V3 = [along[0], along[1], 0], N: V3 = [toField[0], toField[1], 0]
    const P = (s: number, f: number, z: number): V3 => [base[0] + A[0] * s + N[0] * f, base[1] + A[1] * s + N[1] * f, z]
    const posts = 4, span = W / (posts - 1)
    const z0 = ROOF, zw = ROOF + 3.4, zb = ROOF + 9.2
    for (let i = 0; i < posts; i++) {
      const s = -W / 2 + i * span
      box(stone, P(s, 0, (z0 + zb) / 2), [A, N, [0, 0, 1]], [0.45, 0.45, (zb - z0) / 2], true)
      // Brace from the post's top forward and down to the roof.
      const top = P(s, 0.3, zb - 0.6), foot = P(s, 6.5, z0)
      const ax = unit(sub(top, foot))
      const side = A
      const nrm = unit(cross(ax, side))
      box(stone, mul(add(top, foot), 0.5), [ax, side, nrm], [Math.hypot(...sub(top, foot)) / 2, 0.3, 0.3], false)
    }
    // Walkway beam.
    box(stone, P(0, 0, zw), [A, N, [0, 0, 1]], [W / 2 + 0.45, 0.8, 0.35])
    // Arches between posts, springing from the walkway to just under the bar.
    const r = span / 2 - 0.45
    for (let i = 0; i < posts - 1; i++) {
      const sc = -W / 2 + span * (i + 0.5)
      const seg = 8
      for (let j = 0; j < seg; j++) {
        const a0 = Math.PI - (j / seg) * Math.PI, a1 = Math.PI - ((j + 1) / seg) * Math.PI
        const pt = (aa: number, rr: number, f: number): V3 => P(sc + rr * Math.cos(aa), f, zw + 0.35 + rr * Math.sin(aa) * 1.25)
        for (const f of [-0.25, 0.25]) {
          quad(stone, [pt(a0, r, f), pt(a1, r, f), pt(a1, r - 0.55, f), pt(a0, r - 0.55, f)], mul(N, f > 0 ? 1 : -1))
        }
        quad(stone, [pt(a0, r, -0.25), pt(a1, r, -0.25), pt(a1, r, 0.25), pt(a0, r, 0.25)], unit(sub(pt((a0 + a1) / 2, r, 0), pt((a0 + a1) / 2, 0, 0))))
      }
    }
    // Lamp bar, tipped 25 degrees to face the field.
    const tilt = (25 * Math.PI) / 180
    const fwd: V3 = add(mul(N, Math.cos(tilt)), [0, 0, -Math.sin(tilt)])
    const upv: V3 = add(mul(N, Math.sin(tilt)), [0, 0, Math.cos(tilt)])
    box(stone, P(0, 0.4, zb + 1.1), [A, fwd, upv], [W / 2 + 0.8, 0.7, 1.3])
  }
  const onL1 = (q: XY, wing: 'west' | 'south'): { base: XY; along: XY; toField: XY } => {
    const r: Ray = wing === 'west' ? { o: [-10, q[1]], d: [-1, 0] } : { o: [q[0], -10], d: [0, -1] }
    const t = rayHit(r.o, r.d, L1)! - 0.6
    const base: XY = [r.o[0] + r.d[0] * t, r.o[1] + r.d[1] * t]
    const o2: XY = wing === 'west' ? [-10, q[1] + 1] : [q[0] + 1, -10]
    const t2 = rayHit(o2, r.d, L1)! - 0.6
    const b2: XY = [o2[0] + r.d[0] * t2, o2[1] + r.d[1] * t2]
    const l = Math.hypot(b2[0] - base[0], b2[1] - base[1])
    const along: XY = [(b2[0] - base[0]) / l, (b2[1] - base[1]) / l]
    let toField: XY = [-along[1], along[0]]
    if (toField[0] * -r.d[0] + toField[1] * -r.d[1] < 0) toField = [-toField[0], -toField[1]]
    return { base, along, toField }
  }
  for (const x of [-15, 13, 52]) { const g = onL1([x, 0], 'south'); rig(g.base, g.along, g.toField, 21) }
  for (const y of [2, 32, 58]) { const g = onL1([0, y], 'west'); rig(g.base, g.along, g.toField, 21) }

  // ---- Bleachers ---------------------------------------------------------------
  // Rays from home plate across the outfield stands, from the left-field
  // corner to the right-field corner.
  const H: XY = [-23, -31]
  const FB: XY[] = [[-86,76.4],[-36.6,76.3],[-8.4,76.6],[-4.4,74.0],[42.7,68.2],[47.1,67.1],[53.3,64.2],[59.1,60.6],[64.1,56.0],[68.1,50.5],[70.9,44.3],[72.4,37.7],[76.3,8.8],[81.8,2.6],[81.8,-17.9],[82.5,-62]]
  const OB: XY[] = [[-86,85.5],[-79.4,85.5],[-40.6,86.5],[5.4,87.6],[45.8,88.5],[74.4,89.2],[79.9,86.2],[83.8,82.7],[87.3,78.9],[89.5,75.5],[91.1,72.8],[91.6,46.8],[92.2,5.1],[92.6,-17.4],[93.3,-44.2],[93.5,-62]]
  const th0 = (117 * Math.PI) / 180, th1 = (-12 * Math.PI) / 180, NB = 44
  const bRays: Ray[] = Array.from({ length: NB + 1 }, (_, i) => {
    const a = th0 + (th1 - th0) * (i / NB)
    return { o: H, d: [Math.cos(a), Math.sin(a)] }
  })
  const CF = (47 * Math.PI) / 180
  const hb = (k: number) => {
    const a = Math.atan2(bRays[k].d[1], bRays[k].d[0])
    return 8.5 + 3.5 * Math.exp(-(((a - CF) / 0.24) ** 2))
  }
  const TB = bRays.map(r => ({ t1: rayHit(r.o, r.d, FB)!, t2: rayHit(r.o, r.d, OB)! }))
  const secC = (k: number): XY[] => {
    const { t1, t2 } = TB[k], D = t2 - t1, h = hb(k)
    return [[t1, 0], [t2, 0], [t2, h + 0.7], [t2 - 0.4, h + 1.1], [t2 - 0.7, h + 1.1], [t2 - 0.7, h], [t1 + 0.6 * D, h], [t1, 3.5]]
  }
  const isCF = (k: number) => Math.abs(Math.atan2(bRays[k].d[1], bRays[k].d[0]) - CF) < 0.2
  // 0 bottom, 1 outer wall, 2 bevel, 3 parapet top, 4 parapet inside,
  // 5 concourse, 6 seats, 7 the ivy wall.
  sweepSection(bRays, secC, (k, e) => [null, isCF(k) ? green : brick, stone, stone, green, stone, green, green][e], brick)
  // Window bays on the centre-field block, the steel-framed bleacher entrance.
  for (let k = 0; k < NB; k++) {
    if (!isCF(k) || !isCF(k + 1)) continue
    const p0 = TB[k].t2 + 0.05, p1 = TB[k + 1].t2 + 0.05
    const A = (t: number, z: number, kk: number): V3 => [bRays[kk].o[0] + bRays[kk].d[0] * t, bRays[kk].o[1] + bRays[kk].d[1] * t, z]
    const o: V3 = [(bRays[k].d[0] + bRays[k + 1].d[0]) / 2, (bRays[k].d[1] + bRays[k + 1].d[1]) / 2, 0]
    for (const [z0, z1] of [[1, 4.2], [5.2, 8.6]]) {
      const lerp = (t: number, a: V3, b: V3): V3 => add(a, mul(sub(b, a), t))
      const a0 = A(p0, z0, k), b0 = A(p1, z0, k + 1), a1 = A(p0, z1, k), b1 = A(p1, z1, k + 1)
      quad(win, [lerp(0.12, a0, b0), lerp(0.88, a0, b0), lerp(0.88, a1, b1), lerp(0.12, a1, b1)], o)
    }
  }

  // ---- Centre-field scoreboard (1937) -----------------------------------------
  // D-shaped in plan (way/1265761901): a flat 75 ft face to home plate, a
  // curved sheet-steel back. Green face, the back pale, with the blue Cubs
  // pennant that the L riders see; the clock on top. Four legs.
  {
    const fa: XY = [67.0, 80.3], fb: XY = [82.9, 65.4]
    const mx = (fa[0] + fb[0]) / 2, my = (fa[1] + fb[1]) / 2
    const L = Math.hypot(fb[0] - fa[0], fb[1] - fa[1])
    const ua: XY = [(fb[0] - fa[0]) / L, (fb[1] - fa[1]) / L]
    const back: XY = [-ua[1], ua[0]] // away from the field
    const hw = 22.9 / 2, depth = 4.6, z0 = 15, z1 = 23.2
    const seg = 10
    const ring: XY[] = []
    for (let i = 0; i <= seg; i++) {
      const a = Math.PI - (i / seg) * Math.PI // from +ua end... arc behind the face
      const s = -hw * Math.cos(Math.PI - a), d = depth * Math.sin(a)
      ring.push([mx + ua[0] * s + back[0] * d, my + ua[1] * s + back[1] * d])
    }
    // ring runs from -hw to +hw along the back; close along the face.
    const n = ring.length
    for (let i = 0; i < n - 1; i++) {
      const a = ring[i], b = ring[i + 1]
      const mid: XY = [(a[0] + b[0]) / 2 - mx, (a[1] + b[1]) / 2 - my]
      quad(stone, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], [mid[0], mid[1], 0])
    }
    const face: V3 = [-back[0], -back[1], 0]
    const e0 = ring[0], e1 = ring[n - 1]
    quad(green, [[e0[0], e0[1], z0], [e1[0], e1[1], z0], [e1[0], e1[1], z1], [e0[0], e0[1], z1]], face)
    fill(green, ring.map(([x, y]) => [x, y, z1] as V3), ring, [0, 0, 1])
    fill(green, ring.map(([x, y]) => [x, y, z0] as V3), ring, [0, 0, -1])
    // Score panels: three dark bands of the inning-by-inning slots.
    const F = (s: number, z: number): V3 => [mx + ua[0] * s - back[0] * 0.05, my + ua[1] * s - back[1] * 0.05, z]
    for (const [s0, s1] of [[-10.6, -1.6], [1.6, 10.6]])
      for (const [q0, q1] of [[15.7, 17.6], [18.2, 20.1]]) quad(dark, [F(s0, q0), F(s1, q0), F(s1, q1), F(s0, q1)], face)
    quad(dark, [F(-1.0, 16.2), F(1.0, 16.2), F(1.0, 21.6), F(-1.0, 21.6)], face)
    // The pennant on the back, at the top of the curve.
    const Bk = (s: number, z: number): V3 => [mx + ua[0] * s + back[0] * (depth + 0.06), my + ua[1] * s + back[1] * (depth + 0.06), z]
    tri(win, Bk(-9.6, 22.4), Bk(-9.6, 16.0), Bk(9.6, 19.2), [back[0], back[1], 0])
    // Clock.
    box(green, [mx + back[0] * 1.2, my + back[1] * 1.2, z1 + 1.4], [[ua[0], ua[1], 0], [back[0], back[1], 0], [0, 0, 1]], [2.0, 1.2, 1.4], true)
    const C = (s: number, z: number): V3 => [mx + ua[0] * s + back[0] * (1.2 - 1.25), my + ua[1] * s + back[1] * (1.2 - 1.25), z]
    quad(stone, [C(-1.2, z1 + 0.4), C(1.2, z1 + 0.4), C(1.2, z1 + 2.4), C(-1.2, z1 + 2.4)], face)
    // Legs down to the centre-field concourse.
    for (const s of [-8, 8]) for (const d of [0.8, 3.4]) {
      box(green, [mx + ua[0] * s + back[0] * d, my + ua[1] * s + back[1] * d, 11], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0.45, 0.45, 4], true)
    }
  }

  // ---- Video boards (2015) ---------------------------------------------------
  // Pale-cased boxes standing on the back of the bleachers, the screens to
  // the field.
  const board = (a: XY, b: XY, depth: number, z0: number, z1: number, s0: number, s1: number) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const n: XY = [-u[1], u[0]] // left of a→b: towards the field by construction
    const c: V3 = [(a[0] + b[0]) / 2 - n[0] * depth / 2, (a[1] + b[1]) / 2 - n[1] * depth / 2, (z0 + z1) / 2]
    box(stone, c, [[u[0], u[1], 0], [n[0], n[1], 0], [0, 0, 1]], [L / 2, depth / 2, (z1 - z0) / 2], true)
    const m = 0.06, sw = L / 2 - 0.8
    const S = (s: number, z: number): V3 => [(a[0] + b[0]) / 2 + u[0] * s + n[0] * m, (a[1] + b[1]) / 2 + u[1] * s + n[1] * m, z]
    quad(dark, [S(-sw, s0), S(sw, s0), S(sw, s1), S(-sw, s1)], [n[0], n[1], 0])
  }
  board([34.1, 85.0], [4.9, 85.0], 3.2, 9, 27, 13.2, 26.0) // left field, faces south
  board([88.4, -15.2], [88.4, 5.2], 3.6, 9, 24, 13.0, 23.0) // right field, faces west

  // ---- The marquee (1934) at Clark and Addison --------------------------------
  // On brackets off the curved corner facade (node/6421453599), facing
  // south-west down Clark Street.
  {
    const r: Ray = { o: CC, d: unit([-73.1 - CC[0], -79.5 - CC[1], 0]).slice(0, 2) as XY }
    const t = rayHit(r.o, r.d, O, true)! + 0.9
    const c: XY = [r.o[0] + r.d[0] * t, r.o[1] + r.d[1] * t]
    const n: V3 = [r.d[0], r.d[1], 0], u: V3 = [-r.d[1], r.d[0], 0] // u runs left to right as seen from the street
    const ur: V3 = dot(u, [1, 0, 0]) < 0 ? mul(u, -1) : u // viewer facing NE: right is to the south-east
    const Pm = (s: number, z: number, f = 0): V3 => [c[0] + ur[0] * s + n[0] * f, c[1] + ur[1] * s + n[1] * f, z]
    const W = 13.5, zb = 4.6, zt = 9.9, D = 0.8, cw = 5.3
    // Main panel and the stepped crest, as one outline extruded D deep.
    const outline: XY[] = [[-W / 2, zb], [W / 2, zb], [W / 2, zt], [cw + 0.7, zt], [cw + 0.7, zt + 1.0], [cw, zt + 1.0]]
    const arcN = 8
    for (let i = 0; i <= arcN; i++) {
      const a = (i / arcN) * Math.PI
      outline.push([cw * Math.cos(a), zt + 1.0 + 1.1 * Math.sin(a)])
    }
    outline.push([-cw, zt + 1.0], [-cw - 0.7, zt + 1.0], [-cw - 0.7, zt], [-W / 2, zt])
    const front = outline.map(([s, z]) => Pm(s, z, D / 2)), rear = outline.map(([s, z]) => Pm(s, z, -D / 2))
    fill(red, front, outline, n)
    fill(red, rear, outline, mul(n, -1))
    for (let i = 0; i < outline.length; i++) {
      const j = (i + 1) % outline.length
      const ds = outline[j][0] - outline[i][0], dz = outline[j][1] - outline[i][1]
      quad(red, [front[i], front[j], rear[j], rear[i]], add(mul(ur, dz), [0, 0, -ds]))
    }
    // Message board, and the lettering.
    const off = D / 2 + 0.05
    const L = (s: number, z: number): V3 => Pm(s, z, off)
    quad(dark, [L(-5.7, 5.3), L(5.7, 5.3), L(5.7, 7.6), L(-5.7, 7.6)], n)
    const t1 = 'CHICAGO CUBS', h1 = 1.1
    letters(stone, t1, L, n, -textWidth(t1, h1) / 2, 7.95, h1)
    const t2 = 'HOME OF', h2 = 0.55
    letters(stone, t2, L, n, -textWidth(t2, h2) / 2, 9.25, h2)
    const t3 = 'WRIGLEY FIELD', h3 = 0.85
    letters(stone, t3, L, n, -textWidth(t3, h3) / 2, 10.15, h3)
    // Two steel brackets back to the facade.
    for (const s of [-4.5, 4.5]) box(green, Pm(s, 7.2, -0.9), [ur, n, [0, 0, 1]], [0.25, 0.6, 2.6])
  }

  // ---- Write ------------------------------------------------------------------
  // The shared palette (STYLE.md) with three identity finishes: the Cubs'
  // painted-steel green (seats, steelwork, the scoreboard), pulled lighter
  // than the real deep green so it sits with the palette; the dark grey of
  // the roof and screens; and the marquee red. Brick is `terracotta`.
  const parts = [
    { part: green, material: finish('wrigley-green', 0x4f7d62) },
    { part: dark, material: finish('wrigley-roof', 0x5b6168) },
    { part: stone, material: PALETTE.stone },
    { part: brick, material: PALETTE.terracotta },
    { part: red, material: finish('marquee-red', 0xc8453c) },
    { part: win, material: PALETTE.window },
  ]
  return parts
}

if (import.meta.main) {
  const parts = build()
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Wrigley Field', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 0, osm: 'relation/17238872',
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/chi-wrigley-field.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
