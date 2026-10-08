/**
 * Aon Center (200 East Randolph, 1973, Edward Durell Stone with Perkins &
 * Will), Chicago — original procedural geometry, CC0-1.0.
 * bun generators/chi-aon-center.ts
 *
 * This file also exports the small polygon kit the other `chi-` towers in
 * this batch build with (Carbide & Carbon, Two Prudential Plaza, Crain,
 * Jewelers, Mather); the Aon model is only written when it runs itself.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/64388609,
 * 41.885281,-87.621548. Its faces run at 89.0° / 179.0°, so the catalog
 * bearing is 359 and the tower is square to this frame.
 *
 * Identity, in order: the plain square white shaft, nothing but height; the
 * close-set V-section piers running from the plaza to the top, sixteen to a
 * face, with dark window slots between; the solid white notched corners; the
 * plain band at the top and the flat roof.
 *
 * Evidence:
 *  - plan: OSM outline, a 59.2 m square (published 194 ft) with every corner
 *    notched 5.5 m back and the salient edges chamfered. The OSM corners
 *    differ by a few decimetres; they are made identical here, as built.
 *  - height: 346.3 m to the roof (published, 83 floors). OSM tags the
 *    outline 340 m and a 31 m roof square (way/284775635) 346 m, but no
 *    photo shows anything standing above the white band, so the parapet is
 *    taken to 346.3 m and the penthouse is left inside it.
 *  - piers: counted on Paul R. Burley's telephoto of the top (sixteen piers,
 *    fifteen slots, each face); pier ~1.6 m wide on a 2.75 m pitch, the slot
 *    ~1.15 m, measured from the same photo against the 43.8 m face. Pier
 *    depth 0.9 m is estimated from the oblique views (Warren LeMay).
 *  - the top band, ~3.2 m of solid white over the slots, and the tallest
 *    dark slots of the mechanical floors just under it: same photo.
 *  - colour: the 1990s white granite recladding reads cool white in every
 *    daylight photo; a cool white finish, pulled to the palette's lightness.
 *    The slots are the palette window.
 *
 * Ground: the sunken plaza and the lower Randolph levels are the map's; y = 0
 * is the lowest ground under the tower, which the map finds.
 *
 * Photos (Wikimedia Commons): Aon_Center_Chicago_2020-2446.jpg (Paul R.
 * Burley, CC BY-SA 4.0); Aon_Center,_Randolph_Street,_Chicago,_IL
 * (28178465078).jpg (Warren LeMay, CC0); Aon_Center_2014.jpg (Tony Hisgett,
 * CC BY-SA 4.0); Aon_Center_in_Chicago_May_2016.jpg (MusikAnimal, CC BY-SA
 * 4.0); Aon-prudential.JPG (Spikebrennan, CC BY-SA 2.5). No commercial
 * imagery.
 *
 * Left out: floor lines in the slots, the glazed lobby behind the piers at
 * plaza level, the rooftop mast.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'

// ---------------------------------------------------------------------------
// Kit, shared by the chi- towers of this batch.

export type XY = [number, number]

export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
export const circle = (cx: number, cy: number, r: number, seg = 16, a0 = 0): XY[] =>
  Array.from({ length: seg }, (_, i) => [cx + r * Math.cos(a0 + (i / seg) * 2 * Math.PI), cy + r * Math.sin(a0 + (i / seg) * 2 * Math.PI)] as XY)
export const area = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
/** Turn a ring by `deg` counter-clockwise about the origin. */
export const turn = (r: XY[], deg: number): XY[] => {
  const c = Math.cos(deg * Math.PI / 180), s = Math.sin(deg * Math.PI / 180)
  return r.map(([x, y]) => [x * c - y * s, x * s + y * c] as XY)
}
/** Scale a ring about the origin. */
export const scale = (r: XY[], kx: number, ky = kx): XY[] => r.map(([x, y]) => [x * kx, y * ky] as XY)
export const shift = (r: XY[], dx: number, dy: number): XY[] => r.map(([x, y]) => [x + dx, y + dy] as XY)

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
/** A parapeted roof: lip ring r at z, a `lip` wide coping, roof sunk `sink` below. */
export function parapetRoof(wall: Part, roof: Part, r: XY[], z: number, lip = 0.6, sink = 0.9) {
  const i = inset(r, lip), lo = i.map(([x, y]) => [x, y] as XY)
  for (let k = 0; k < r.length; k++) {
    const j = (k + 1) % r.length
    wall.quad([r[k][0], r[k][1], z], [r[j][0], r[j][1], z], [i[j][0], i[j][1], z], [i[k][0], i[k][1], z])
    wall.quad([i[j][0], i[j][1], z], [i[k][0], i[k][1], z], [lo[k][0], lo[k][1], z - sink], [lo[j][0], lo[j][1], z - sink])
  }
  cap(roof, lo, z - sink)
}

/**
 * A point on the wall a→b of a counter-clockwise ring: s metres along it,
 * at height z, `out` metres outside the wall.
 */
export function onWall(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number, out = 0): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, z]
  return { L, u, n, P }
}
/** A flat panel on wall a→b from s0 to s1 along it and z0 to z1 up it. */
export function panel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out = 0.04) {
  const { P } = onWall(a, b)
  p.quad(P(s0, z0, out), P(s1, z0, out), P(s1, z1, out), P(s0, z1, out))
}
/**
 * Window panels on every wall of a ring at least `minLen` long: `bay`-wide
 * bays with `gap` of wall between, over the given storey groups.
 */
export function bays(p: Part, r: XY[], rows: [number, number][], o: { bay?: number; gap?: number; end?: number; minLen?: number; out?: number } = {}) {
  const bay = o.bay ?? 2.4, gap = o.gap ?? 1.0, end = o.end ?? 1.0, minLen = o.minLen ?? 4, out = o.out ?? 0.04
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < minLen) continue
    const use = L - 2 * end, k = Math.max(1, Math.round((use + gap) / (bay + gap))), w = (use - (k - 1) * gap) / k
    for (let q = 0; q < k; q++) for (const [z0, z1] of rows) panel(p, a, b, end + q * (w + gap), end + q * (w + gap) + w, z0, z1, out)
  }
}
/** Storey groups from z0 to z1: n bands with a `gap` spandrel between. */
export const rows = (z0: number, z1: number, n: number, gap = 0.8): [number, number][] =>
  Array.from({ length: n }, (_, i) => [z0 + i * (z1 - z0) / n + gap / 2, z0 + (i + 1) * (z1 - z0) / n - gap / 2] as [number, number])

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
/** A pyramid or spire from ring r at z0 up to a point. */
export function spire(p: Part, r: XY[], z0: number, tip: V3) {
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    p.tri([r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], tip)
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
// Aon Center

function build() {
  const granite = new Part(), win = new Part(), roof = new Part()

  const H = 29.6 // half the face
  const ROOF = 346.3, BAND = 343.1
  const NOTCH = 5.5, FACE_END = 21.9, CH = 2.2 // corner notch, face half-length, chamfer
  const D = 0.9 // pier depth: the slots' wall sits this far behind the face
  const PITCH = 2.75, PIER = 1.6, NPIER = 16

  // One corner (south-east), counter-clockwise; the others are it turned.
  const corner: XY[] = [[FACE_END, -H], [H - NOTCH, -H + CH], [H - NOTCH, -H + NOTCH], [H - CH, -H + NOTCH], [H, -FACE_END]]
  const full: XY[] = [0, 90, 180, 270].flatMap(a => turn(corner, a))
  // The shaft below the band: each face set back by D between the end strips.
  const END = PITCH * (NPIER - 1) / 2 + PIER / 2 // outer edge of the outermost pier
  const face: XY[] = [[-FACE_END, -H], [-END, -H], [-END, -H + D], [END, -H + D], [END, -H]]
  const shaft: XY[] = [0, 90, 180, 270].flatMap(a => [...turn(face.slice(1, 5), a), ...turn(corner, a)])

  walls(granite, shaft, 0, BAND)
  walls(granite, full, BAND, ROOF - 0.5)
  walls(granite, full, ROOF - 0.5, ROOF, inset(full, 0.5))
  parapetRoof(granite, roof, inset(full, 0.5), ROOF, 0.6, 1.0)
  // Underside of the band over each recessed face.
  for (const a of [0, 90, 180, 270]) {
    const [p, q, r, s] = turn([[-END, -H], [-END, -H + D], [END, -H + D], [END, -H]], a)
    granite.quad([p[0], p[1], BAND], [q[0], q[1], BAND], [r[0], r[1], BAND], [s[0], s[1], BAND])
  }

  // Piers and slots, face by face.
  const groups = [...rows(6.5, 332, 20), [332.4, BAND - 0.8] as [number, number]]
  for (const a of [0, 90, 180, 270]) {
    const T = (x: number, y: number): XY => turn([[x, y]], a)[0]
    for (let i = 0; i < NPIER; i++) {
      const c = (i - (NPIER - 1) / 2) * PITCH
      // V-section pier: two faces from the slot wall to a ridge on the face line.
      if (i > 0 && i < NPIER - 1) {
        const l = T(c - PIER / 2, -H + D), tip = T(c, -H), r = T(c + PIER / 2, -H + D)
        for (const [p, q] of [[l, tip], [tip, r]]) granite.quad([p[0], p[1], 0], [q[0], q[1], 0], [q[0], q[1], BAND], [p[0], p[1], BAND])
      }
      if (i < NPIER - 1) {
        // Slot between pier i and i+1: window panels on the recessed wall.
        const s0 = c + PIER / 2, s1 = c + PITCH - PIER / 2
        const wa = T(-END, -H + D), wb = T(END, -H + D)
        for (const [z0, z1] of groups) panel(win, wa, wb, s0 + END, s1 + END, z0, z1, 0.04)
      }
    }
  }
  return [
    { part: granite, material: finish('aon-granite', 0xebeae5) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('chi-aon-center', 'Aon Center', [41.885281, -87.621548], 359, build())
