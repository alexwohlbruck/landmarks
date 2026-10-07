/**
 * Merchandise Mart (222 West Merchandise Mart Plaza, 1930, Graham, Anderson,
 * Probst & White, designer Alfred Shaw), Chicago — original procedural
 * geometry, CC0-1.0.
 * bun generators/chi-merchandise-mart.ts
 *
 * This file also exports the small polygon kit the other models by the same
 * builder use (333 Wacker, Union Station, Thompson Center, Harold Washington
 * Library); the Mart itself is only written when this file runs.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/28293211,
 * 41.8885491,-87.6353729. Its long walls run at 89.0° / 269.0°, so the
 * catalog bearing is 359 and the block is square to this frame.
 *
 * Identity, in order: the enormous flat-topped limestone block on the river,
 * two blocks long; the 25-storey central tower over the river front, with
 * chamfered corners, two setbacks and a green hipped roof; the tower-like
 * corner pavilions rising two storeys over the cornice, with a set-back
 * stage and a small green hipped roof (taller pair, four storeys, inboard
 * on the south half); the close vertical ribbon of window slots
 * between piers over a three-storey base, under an attic of arched windows.
 *
 * Evidence:
 *  - plan: OSM outline (simplified to its eight corners and the straight
 *    diagonal west wall along the river's North Branch) and parts: the tower
 *    way/1432322251 (32 x 44 m, chamfered, 25 levels, height 104), the four
 *    corner turrets way/1432322252..55 (octagons ~16 m across, 19 levels),
 *    the two inboard turrets way/1432322256/57 (22 levels), and the two
 *    8-level light-court parts way/1432322258/59. Positions checked on USGS
 *    NAIP (the turret domes and the tower roof).
 *  - heights: 104 m to the top of the tower (OSM, published 104.5 m / 25
 *    storeys). Measured on Daniel Schwen's view across the river, scaled by
 *    the tower (~0.2 m/px at the river front): main cornice ~71 m (18
 *    storeys), tower setbacks ~85 and ~92.5 m, eaves ~98.5 m, so a ~6 m hipped
 *    roof, which seligmanwaite's rooftop photo confirms. Pavilion heights
 *    follow the OSM level counts (19 and 22) at ~4.2 m a storey; their
 *    setback stages and roof heights are estimates.
 *  - facade: slot pitch ~4 m on the long faces (counted ~21 slots between
 *    the SW pavilion and the tower on JeremyA's view), drawn here at 4.2 m
 *    as panels in three-storey groups; punched windows on the pavilions and
 *    the tower; the attic's arched windows as one row of panels.
 *  - colour: warm grey Bedford limestone, a shade greyer than `stone`; the
 *    tower roof and turret domes weathered green copper.
 *
 * Photos (Wikimedia Commons): Merchandise_Mart.jpg (Daniel Schwen, CC BY-SA
 * 4.0); Merchandise_Mart_080405.jpg (JeremyA, CC BY-SA 3.0);
 * North_Side_of_the_Merch_Mart.jpg (Robert Werner, CC BY-SA 3.0);
 * Rooftop_-_Chicago_Merchandise_Mart_(43590422992).jpg (seligmanwaite, CC
 * BY 2.0); Chicago_-_Merchandise_Mart_from_Marina_City_(4279842177).jpg
 * (Roger W, CC BY-SA 2.0). USGS NAIP for the plan. No commercial imagery.
 *
 * Left out: the light courts (two small wells in the roof), rooftop
 * mechanical penthouses, the chiefs' frieze, the CTA station on the north
 * side (a separate OSM building, not replaced).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'

// ---------------------------------------------------------------------------
// Kit, shared by this builder's chi- models.

export type XY = [number, number]

export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
export const circle = (cx: number, cy: number, r: number, seg = 16, a0 = 0): XY[] =>
  Array.from({ length: seg }, (_, i) => [cx + r * Math.cos(a0 + (i / seg) * 2 * Math.PI), cy + r * Math.sin(a0 + (i / seg) * 2 * Math.PI)] as XY)
/** A regular octagon with apothem `a` (flat faces on the axes). */
export const octagon = (cx: number, cy: number, a: number): XY[] => circle(cx, cy, a / Math.cos(Math.PI / 8), 8, Math.PI / 8)
export const area = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2

/** Cut every convex corner of a counter-clockwise ring by `d` along both edges. */
export function chamfer(r: XY[], d: number): XY[] {
  const out: XY[] = []
  r.forEach((c, i) => {
    const p = r[(i - 1 + r.length) % r.length], n = r[(i + 1) % r.length]
    const cr = (c[0] - p[0]) * (n[1] - c[1]) - (c[1] - p[1]) * (n[0] - c[0])
    const lp = Math.hypot(c[0] - p[0], c[1] - p[1]), ln = Math.hypot(n[0] - c[0], n[1] - c[1])
    if (cr <= 0 || d <= 0) { out.push(c); return }
    const k = Math.min(d, lp / 2.2, ln / 2.2)
    out.push([c[0] + (p[0] - c[0]) * k / lp, c[1] + (p[1] - c[1]) * k / lp], [c[0] + (n[0] - c[0]) * k / ln, c[1] + (n[1] - c[1]) * k / ln])
  })
  return out
}

/** Offset a counter-clockwise ring inwards by d (mitred). */
export function inset(r: XY[], d: number): XY[] {
  const n = r.length
  const nrm = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l] }
  return r.map((c, i) => {
    const n1 = nrm(r[(i - 1 + n) % n], c), n2 = nrm(c, r[(i + 1) % n])
    const k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    return [c[0] + (n1[0] + n2[0]) / Math.max(k, 0.2) * d, c[1] + (n1[1] + n2[1]) / Math.max(k, 0.2) * d] as XY
  })
}

/** Clip a counter-clockwise ring to a convex counter-clockwise ring. */
export function clip(r: XY[], by: XY[]): XY[] {
  let out = r
  for (let i = 0; i < by.length; i++) {
    const a = by[i], b = by[(i + 1) % by.length]
    const side = (p: XY) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])
    const src = out
    out = []
    for (let k = 0; k < src.length; k++) {
      const p = src[k], q = src[(k + 1) % src.length], sp = side(p), sq = side(q)
      if (sp >= 0) out.push(p)
      if ((sp >= 0) !== (sq >= 0)) { const t = sp / (sp - sq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]) }
    }
  }
  return out
}

/** Ear clipping for a simple counter-clockwise ring. */
export function triangulate(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 20000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i - 1 + idx.length) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      if (cr(r[ia], r[ib], r[ic]) <= 1e-9) continue
      if (idx.some(j => j !== ia && j !== ib && j !== ic && inside(r[j], r[ia], r[ib], r[ic]))) continue
      out.push([ia, ib, ic]); idx.splice(i, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** Walls of a counter-clockwise ring from z0 to z1, optionally to a second ring of the same length. */
export function walls(p: Part, r: XY[], z0: number, z1: number, r1: XY[] = r) {
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    p.quad([r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [r1[j][0], r1[j][1], z1], [r1[i][0], r1[i][1], z1])
  }
}
export function cap(p: Part, r: XY[], z: number, up = true) {
  for (const [a, b, c] of triangulate(r)) {
    const A: V3 = [r[a][0], r[a][1], z], B: V3 = [r[b][0], r[b][1], z], C: V3 = [r[c][0], r[c][1], z]
    if (up) p.tri(A, B, C); else p.tri(A, C, B)
  }
}
/** A flat-topped block with a bevelled top edge; returns the top ring. */
export function block(wall: Part, top: Part | null, r: XY[], z0: number, z1: number, bevel = 0.5): XY[] {
  if (bevel <= 0) { walls(wall, r, z0, z1); if (top) cap(top, r, z1); return r }
  const ins = inset(r, bevel)
  walls(wall, r, z0, z1 - bevel)
  walls(wall, r, z1 - bevel, z1, ins)
  if (top) cap(top, ins, z1)
  return ins
}
/** A ring at z0 lofted to a second ring at z1 and capped, e.g. a hipped roof. */
export function roofTo(p: Part, r0: XY[], z0: number, r1: XY[], z1: number) {
  walls(p, r0, z0, z1, r1)
  cap(p, r1, z1)
}
/** Scale a ring about (cx, cy). */
export const scaleAbout = (r: XY[], cx: number, cy: number, kx: number, ky = kx): XY[] => r.map(([x, y]) => [cx + (x - cx) * kx, cy + (y - cy) * ky] as XY)

/** A point on the wall a→b of a counter-clockwise ring: s along it, at height z, `out` outside it. */
export function onWall(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number, out = 0): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, z]
  return { L, u, n, P }
}
/** A flat panel on wall a→b from s0 to s1 along it and z0 to z1 up it. */
export function panel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out = 0.05) {
  const { P } = onWall(a, b)
  p.quad(P(s0, z0, out), P(s1, z0, out), P(s1, z1, out), P(s0, z1, out))
}
/** A flat round-headed panel: rectangle s0..s1 from z0 up to the springing z1, then a semicircle. */
export function archPanel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out = 0.05, seg = 8) {
  const { P } = onWall(a, b)
  const r = (s1 - s0) / 2, c = s0 + r
  p.quad(P(s0, z0, out), P(s1, z0, out), P(s1, z1, out), P(s0, z1, out))
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * Math.PI, t1 = ((i + 1) / seg) * Math.PI
    p.tri(P(c, z1, out), P(c + r * Math.cos(t0), z1 + r * Math.sin(t0), out), P(c + r * Math.cos(t1), z1 + r * Math.sin(t1), out))
  }
}
/**
 * Evenly spaced bays along wall a→b: `w`-wide panels on a `pitch`, `end`
 * clear at each end, over the storey groups. `skip(s)` drops a bay by its
 * centre's distance along the wall.
 */
export function wallBays(p: Part, a: XY, b: XY, rows: [number, number][], o: { pitch: number; w: number; end?: number; skip?: (s: number, P: XY) => boolean; arch?: boolean; out?: number }) {
  const { L, u } = onWall(a, b)
  const end = o.end ?? 1, use = L - 2 * end
  if (use < o.w) return
  const n = Math.max(1, Math.round(use / o.pitch)), pitch = use / n
  for (let k = 0; k < n; k++) {
    const s = end + (k + 0.5) * pitch
    if (o.skip?.(s, [a[0] + u[0] * s, a[1] + u[1] * s])) continue
    for (const [z0, z1] of rows) {
      if (o.arch) archPanel(p, a, b, s - o.w / 2, s + o.w / 2, z0, z1 - o.w / 2, o.out)
      else panel(p, a, b, s - o.w / 2, s + o.w / 2, z0, z1, o.out)
    }
  }
}
/** Storey groups from z0 to z1: n bands with a `gap` spandrel between. */
export const rows = (z0: number, z1: number, n: number, gap = 0.8): [number, number][] =>
  Array.from({ length: n }, (_, i) => [z0 + i * (z1 - z0) / n + gap / 2, z0 + (i + 1) * (z1 - z0) / n - gap / 2] as [number, number])
export const inside = ([x, y]: XY, poly: XY[]) => {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

/** A surface of revolution about (cx, cy) from a (radius, z) profile, smooth-shaded. */
export function lathe(p: Part, cx: number, cy: number, prof: XY[], seg = 16, a0 = 0) {
  const nrm = prof.map((_, i) => {
    const [r0, z0] = prof[Math.max(0, i - 1)], [r1, z1] = prof[Math.min(prof.length - 1, i + 1)]
    const l = Math.hypot(z1 - z0, r1 - r0) || 1
    return [(z1 - z0) / l, -(r1 - r0) / l] as XY
  })
  for (let k = 0; k < seg; k++) {
    const a = a0 + (k / seg) * 2 * Math.PI, b = a0 + ((k + 1) / seg) * 2 * Math.PI
    const P = ([r, z]: XY, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
    const N = (n: XY, t: number): V3 => [n[0] * Math.cos(t), n[0] * Math.sin(t), n[1]]
    for (let i = 0; i < prof.length - 1; i++) {
      const A = P(prof[i], a), B = P(prof[i], b), C = P(prof[i + 1], b), D = P(prof[i + 1], a)
      const nA = N(nrm[i], a), nB = N(nrm[i], b), nC = N(nrm[i + 1], b), nD = N(nrm[i + 1], a)
      if (prof[i][0] > 1e-6) p.tri(A, B, C, undefined, undefined, undefined, [nA, nB, nC])
      if (prof[i + 1][0] > 1e-6) p.tri(A, C, D, undefined, undefined, undefined, [nA, nC, nD])
    }
  }
}

/** Check the budget and write models/<id>.glb. */
export async function save(id: string, name: string, anchor: [number, number], bearing: number, parts: { part: Part; material: Swatch }[], maxTri = 5000) {
  const used = parts.filter(x => x.part.triangles > 0)
  const triangles = used.reduce((s, x) => s + x.part.triangles, 0)
  if (used.length > 6) throw new Error(`${id}: ${used.length} materials`)
  const glb = writeGlb(name, used, { frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor, bearing })
  if (triangles > maxTri || glb.length > 250_000) throw new Error(`${id}: budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
  const out = process.argv[2] ?? new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

// ---------------------------------------------------------------------------
// Merchandise Mart

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), green = new Part()

  const MAIN = 71 // main cornice
  // The outline, counter-clockwise from the south-west corner; the last edge
  // is the diagonal west wall along the North Branch.
  const F: XY[] = [[-73.8, -51.4], [96, -51.4], [101, -46.5], [101, 42.5], [96, 47.4], [-112.8, 47.2], [-119.6, 41.6], [-119.5, 34.3]]

  // Pavilions: [centre x, y, block top, setback stage top, roof apex]. The
  // four at the corners rise two storeys over the cornice, the taller
  // inboard pair on the south half four.
  const PAV: [number, number, number, number, number][] = [
    [-68.3, -44.3, 80, 84.5, 89],
    [93.2, -41.3, 80, 84.5, 89],
    [92.0, 40.3, 80, 84.5, 89],
    [-110.6, 35.9, 80, 84.5, 89],
    [-73.1, -16.1, 84, 89, 94],
    [81.8, -13.6, 84, 89, 94],
  ]
  const PH = 10 // pavilion half-size
  const pavRing = (cx: number, cy: number) => clip(chamfer(rect(cx - PH, cy - PH, cx + PH, cy + PH), 2.2), F)

  // Tower: chamfered 32 x 44 m, flush with the river front.
  const T0: XY[] = chamfer(rect(-5.2, -51.4, 27, -8.0), 4.2)
  const TOWER = 85, MID = 92.5, EAVE = 98.5, APEX = 104.5

  // Main block, base course, cornice and flat roof.
  walls(stone, F, 0, MAIN - 1.6)
  const lip = inset(F, -0.35)
  walls(trim, lip, MAIN - 1.6, MAIN - 0.5)
  walls(trim, lip, MAIN - 0.5, MAIN, inset(F, 0.3))
  cap(roof, inset(F, 0.3), MAIN)

  // Pavilions: a tower-like block over the cornice, a set-back upper stage,
  // and a small green hipped roof.
  for (const [cx, cy, z1, z2, z3] of PAV) {
    const corner = z1 < 78
    const r = corner ? pavRing(cx, cy) : chamfer(rect(cx - PH + 1, cy - PH + 1, cx + PH - 1, cy + PH - 1), 2.2)
    walls(stone, r, MAIN - 2, z1 - 0.8)
    walls(trim, inset(r, -0.3), z1 - 0.8, z1)
    cap(roof, r, z1)
    const up = chamfer(rect(cx - 7.2, cy - 7.2, cx + 7.2, cy + 7.2), 2.4)
    walls(stone, up, z1, z2 - 0.7)
    walls(trim, inset(up, -0.3), z2 - 0.7, z2)
    roofTo(green, inset(up, -0.3), z2, scaleAbout(up, cx, cy, 0.08), z3)
    // Arched windows on the upper stage, punched pairs on the block above the cornice.
    for (let i = 0; i < up.length; i += 2) archPanel(win, up[i + 1], up[(i + 2) % up.length], 2.4, 7.2, z1 + 0.9, z2 - 2.6, 0.05, 6)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 8) continue
      wallBays(win, a, b, [[MAIN + 0.6, z1 - 1.6]], { pitch: 3.6, w: 1.4, end: 2.6 })
    }
  }

  // Tower: lower stage to the first setback, a narrower middle stage, a
  // chamfered top stage, and the hipped copper roof.
  walls(stone, T0, MAIN - 0.2, TOWER - 0.8)
  walls(trim, inset(T0, -0.3), TOWER - 0.8, TOWER)
  cap(roof, T0, TOWER)
  const T1 = chamfer(rect(-2.6, -48.8, 24.4, -10.6), 5.0)
  walls(stone, T1, TOWER, MID - 0.8)
  walls(trim, inset(T1, -0.35), MID - 0.8, MID)
  cap(roof, T1, MID)
  const T2 = chamfer(rect(-0.4, -46.6, 22.2, -12.8), 6.0)
  walls(stone, T2, MID, EAVE - 1)
  walls(trim, inset(T2, -0.35), EAVE - 1, EAVE)
  const TC: XY = [10.9, -29.7]
  roofTo(green, inset(T2, -0.3), EAVE, scaleAbout(inset(T2, -0.3), TC[0], TC[1], 0.06, 0.3), APEX)

  // Windows. Storey groups: base display windows, the shaft's ribbon in
  // three-storey groups, the attic's arched row.
  const base: [number, number][] = [[2.2, 8.2], [9.4, 12.6]]
  const shaft = rows(14.6, 59.6, 4, 1.3)
  const attic: [number, number][] = [[61.2, 67.8]]
  const inPav = (P: XY) => PAV.slice(0, 4).some(([cx, cy]) => Math.abs(P[0] - cx) < PH + 0.5 && Math.abs(P[1] - cy) < PH + 0.5)
  const inTower = (P: XY) => P[0] > -6 && P[0] < 28 && P[1] < -7
  for (let i = 0; i < F.length; i++) {
    const a = F[i], b = F[(i + 1) % F.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 12) continue
    wallBays(win, a, b, shaft, { pitch: 4.2, w: 1.7, end: 1.5, skip: (_, P) => inPav(P) || inTower(P) })
    wallBays(win, a, b, attic, { pitch: 4.2, w: 1.7, end: 1.5, skip: (_, P) => inPav(P) || inTower(P), arch: true })
    wallBays(win, a, b, base, { pitch: 8.4, w: 5.6, end: 2, skip: (_, P) => inTower(P) })
  }
  // Pavilion faces: pairs of punched windows in two-storey groups.
  const pavRows = rows(14.6, 68.4, 7, 1.6)
  for (const [cx, cy] of PAV.slice(0, 4)) {
    const r = pavRing(cx, cy)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      // Only the faces that lie on the outline.
      const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      const onEdge = F.some((p, k) => {
        const q = F[(k + 1) % F.length], { L, u } = onWall(p, q)
        const d = (m[0] - p[0]) * u[1] - (m[1] - p[1]) * u[0], s = (m[0] - p[0]) * u[0] + (m[1] - p[1]) * u[1]
        return Math.abs(d) < 0.3 && s > 0 && s < L
      })
      if (!onEdge || Math.hypot(b[0] - a[0], b[1] - a[1]) < 6) continue
      wallBays(win, a, b, pavRows, { pitch: 3.6, w: 1.4, end: 2.6 })
    }
  }
  // Tower: punched windows in two-storey groups above the main roof, and
  // on its river face down to the base (its entrance bay in the middle).
  for (let i = 0; i < T0.length; i++) {
    const a = T0[i], b = T0[(i + 1) % T0.length]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 10) continue
    wallBays(win, a, b, rows(MAIN + 0.6, TOWER - 1.4, 2, 1.2), { pitch: 3.4, w: 1.4, end: 1.6 })
  }
  {
    // The tower's river face stands 0.8 m proud of the block from the ground
    // up, with the entrance's deep portal in the middle.
    const a: XY = [-1.4, -52.2], b: XY = [23.4, -52.2]
    block(stone, null, rect(-1.4, -52.2, 23.4, -51.2), 0, MAIN + 0.4, 0.3)
    wallBays(win, a, b, rows(14.6, 68.4, 7, 1.6), { pitch: 3.4, w: 1.4, end: 1.6 })
    panel(win, a, b, 12.4 - 2.6, 12.4 + 2.6, 0.5, 11.5, 0.08)
  }
  for (const [ring, z0, z1] of [[T1, TOWER + 0.8, MID - 1.4], [T2, MID + 0.8, EAVE - 2]] as [XY[], number, number][]) {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 8) continue
      wallBays(win, a, b, [[z0, z1]], { pitch: 2.6, w: 1.3, end: 1.4 })
    }
  }

  return [
    { part: stone, material: finish('mart-limestone', 0xe8dfd2) },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: green, material: PALETTE.copper },
  ]
}

if (import.meta.main) await save('chi-merchandise-mart', 'Merchandise Mart', [41.8885491, -87.6353729], 359, build(), 6500)
