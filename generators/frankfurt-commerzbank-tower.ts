/**
 * Commerzbank Tower, Frankfurt am Main: procedural, CC0-1.0.
 * bun generators/frankfurt-commerzbank-tower.ts   (writes the low model and the detail model)
 *
 * Foster + Partners, 1994-1997: 56 office storeys, 259 m to the roof and
 * 300 m to the tip of the mast. A rounded equilateral triangle in plan:
 * three office wings, one on each side, between three rounded corners; each
 * corner is a glazed rounded bay held between a pair of white service
 * shafts. The wings are broken every eight office storeys by a four-storey
 * sky garden, nine in all, stepping round the tower clockwise as it rises.
 *
 * This file also exports the small kit the other `frankfurt-` towers of
 * this batch (Westend, Messeturm, Main Tower, Deutsche Bank, Opernturm)
 * build with: `prism`, `face`, `smoothWall`, `saveLods`, `Layer`. The model
 * is only written when this file runs itself.
 *
 * Identity, in order: the rounded triangle; the paired white corner shafts
 * standing proud of the grey wings and rising above them to three different
 * heights; the sky gardens as real four-storey recesses spiralling up the
 * faces; the dark crown block over the south-west corner with the red and
 * white mast; the yellow logo on the upper shafts.
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin: the area
 * centroid of the OSM outline way/183060777 (50.111177, 8.674362).
 * y = 0 is the lowest ground under the footprint (the site is flat:
 * Mapterhorn grid, see the report).
 *
 * Plan (measured from the OSM outline): the three corner circles (radius
 * 7 m) sit 27.2 m from the triangle's centre O = (-0.1, -0.8), at 90°
 * (north), 210° (south-west) and 330° (south-east); every face is 20.6 m
 * from O, its straight part 47.1 m long. The south face is straight and
 * east-west. The service shafts are 7.5 m of each face beside each corner
 * (OSM part boundaries at the -14.8/-19.0 and 19.4/-18.5 notches); the wings
 * run 32 m between them, 0.7 m behind the shafts' faces (the outline's
 * notches), back to the central triangular atrium, 17 m a side (OSM inner
 * part corners).
 *
 * Heights:
 * - roof 259 m, mast tip 300 m, 56 storeys: published (Wikipedia
 *   "Commerzbank Tower"; CTBUH). OSM: outline 259, the dark top part
 *   183060773 215-259 over the south-west corner, the mast parts 265/300.
 * - corner shafts: south-west 224 (white) under the dark block, south-east
 *   212, north 203: measured on p2 and p3 (scaled from the 259 m roof and
 *   the 300 m tip), OSM 220/210/200.
 * - wings: south 200 (OSM 11526498), north-west and north-east 195 (p1, p2).
 * - sky gardens, 15 m (four 3.75 m storeys) each: north-west 52, 100, 148;
 *   north-east 68, 116, 164; south 84, 132, 180 (bottom of each). Measured:
 *   the north-west 148 on p1, the north-east 69 and 117 on p2; the rest
 *   follow the published rule (every 12 storeys on a face, a third of a turn
 *   apart, clockwise). OSM tags the gardens at 10 m steps (S 60/100/140,
 *   NW 70/110/150, NE 80/120): the same spiral, phase from the photos.
 * - lobby glazing on the wings to 10 m: estimated from p4.
 * - the dark crown block: inset 3.4 m within the south-west corner, from
 *   214 m to 259 m (p3); the mast 3 m square at its foot, set half into the
 *   block's inner face from 230 m, tapering to the tip (p3, OSM 279967630).
 *
 * Evidence:
 * - p1 https://commons.wikimedia.org/wiki/File:Commerzbank_Tower_from_Main_Tower.jpg
 *   T. Gozdziewicz, CC BY-SA 2.0: from the Main Tower (north-west), the
 *   north-west face, a garden, the crown block, the mast and a logo.
 * - p2 https://commons.wikimedia.org/wiki/File:Commerzbank_Tower_Frankfurt.jpg
 *   Thomas Wolf (www.foto-tw.de), CC BY-SA 3.0 de: from the east, the
 *   north-east face full height, two gardens, the shafts' heights.
 * - p3 https://commons.wikimedia.org/wiki/File:2015-03-04_Top_of_Commerzbank_Tower_Frankfurt_Main_Hesse_Germany.jpg
 *   Norbert Nagel, CC BY-SA 3.0: the crown from the north-east.
 * - p4 https://commons.wikimedia.org/wiki/File:Frankfurt_Commerzbank_Tower_(Kaiserplatz).jpg
 *   Tilman AB, CC0: from Kaiserplatz (north-west), a rounded glazed corner
 *   between white shafts, garden recesses with their soffits.
 * - p5 https://commons.wikimedia.org/wiki/File:Frankfurt_Am_Main-Commerzbank_Tower-Ansicht_vom_Eisernen_Steg.jpg
 *   Mylius, CC BY-SA 3.0: from the south-east over the Main.
 * - p6 https://commons.wikimedia.org/wiki/File:Commerzbank_Tower_Night_View.jpg
 *   Andreas Trojak, CC BY 2.0: at night, the crown floodlit yellow and the
 *   gardens lit.
 * - OSM (API, 2026-11): the outline and the parts listed in `replaces`.
 * - Published: Wikipedia "Commerzbank Tower" (259 m, 300 m with mast,
 *   56 storeys, nine four-storey sky gardens), CTBUH.
 * - No lidar (none in Germany). Look-only: none.
 *
 * Colours from the daylight photos: the shafts a pale grey-white #e4e7e8
 * (p2, p4); the wings' aluminium cladding mid grey #b0b4b8; glass a grey
 * grey-green #86a09c (p2's corner glass and the wing windows); the crown block
 * dark grey #5d6167 (p3, lifted from about #45474a to stay above
 * charcoal), also used for the gardens' darker glazing (p2); the mast red #c4533f with white legs at its foot (p3); the
 * logo yellow #f0bd2a.
 *
 * Night: wing windows and the corner glass are `window`; the logos are
 * neon. The garden glazing shares the crown block's dark grey (so the
 * recesses read by day) and, with it, carries `_FLOODLIGHT`, as do the
 * shafts above 198 m (p6: the crown floodlit yellow, the gardens lit).
 *
 * Detail model (models/frankfurt-commerzbank-tower.detail.glb): the mast as
 * an open lattice (legs, rings and diagonals), rounder corners and
 * two-storey window groups on the wings.
 *
 * Doubts: the garden heights other than the three measured are from the
 * rule, not seen; the south face has no square-on open photo; the atrium is
 * left open to the sky (its roof glazing is not in any photo); the third
 * logo (south face) is not shown in any photo and is left out.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { triangulate, type XY } from './chi-aon-center'

export type { XY }
export type Layer = { part: Part; material: MaterialSpec }

// ───────────────────────────── shared kit ─────────────────────────────────

const signedArea = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
/** The ring, counter-clockwise from above. */
export const ccw = (r: XY[]): XY[] => (signedArea(r) < 0 ? [...r].reverse() : r)

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

/**
 * A vertical prism over ring r from z0 to z1, walls flat-shaded. `top` and
 * `bottom` cap it (bottom faces down: a soffit). `skip(i)` leaves out the
 * wall from r[i] to r[i+1] (a wall buried against a neighbour).
 */
export function prism(p: Part, r: XY[], z0: number, z1: number, o: { top?: Part | null; bottom?: Part | null; skip?: (i: number) => boolean } = {}) {
  const q = ccw(r)
  for (let i = 0; i < q.length; i++) {
    if (o.skip?.(i)) continue
    const a = q[i], b = q[(i + 1) % q.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
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
export function beam(p: Part, a: V3, b: V3, w: number) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d)
  const t: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const ref: V3 = Math.abs(t[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const cr = (x: V3, y: V3): V3 => [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]]
  const nz = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
  const u = nz(cr(t, ref)), v = nz(cr(t, u))
  const C = (q: V3, i: number, j: number): V3 => [q[0] + (u[0] * i + v[0] * j) * w / 2, q[1] + (u[1] * i + v[1] * j) * w / 2, q[2] + (u[2] * i + v[2] * j) * w / 2]
  const sq = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
  for (let k = 0; k < 4; k++) {
    const [i0, j0] = sq[k], [i1, j1] = sq[(k + 1) % 4]
    const nn = nz([u[0] * (i0 + i1) + v[0] * (j0 + j1), u[1] * (i0 + i1) + v[1] * (j0 + j1), u[2] * (i0 + i1) + v[2] * (j0 + j1)])
    face(p, [C(a, i0, j0), C(a, i1, j1), C(b, i1, j1), C(b, i0, j0)], nn)
  }
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

// ───────────────────────────── Commerzbank Tower ─────────────────────────────

const ID = 'frankfurt-commerzbank-tower'
const DEG = Math.PI / 180
const O: XY = [-0.1, -0.8]
const D = 27.2, R = 7, TF = 20.6, L = 23.55 // corner distance, corner radius, face distance, half straight face
const SHAFT_S = 16 // the shafts run from |s| = 16 to L
const WING_T = 19.9 // wing face, behind the shafts
const ATR = 4.75 // atrium inradius
const GARDEN = 15

type Face = { phi: number; top: number; gardens: number[] }
// Faces by outward normal angle (anticlockwise from east).
const FACES: Record<'S' | 'NE' | 'NW', Face> = {
  S: { phi: -90, top: 200, gardens: [84, 132, 180] },
  NE: { phi: 30, top: 195, gardens: [68, 116, 164] },
  NW: { phi: 150, top: 195, gardens: [52, 100, 148] },
}
// Corners: angle, height, the face whose +s end it closes (A) and whose -s end (B).
const CORNERS = [
  { name: 'SE', ang: -30, top: 212, A: FACES.S, B: FACES.NE },
  { name: 'N', ang: 90, top: 203, A: FACES.NE, B: FACES.NW },
  { name: 'SW', ang: 210, top: 224, A: FACES.NW, B: FACES.S },
]

/** A point in a face's frame: s along it (anticlockwise), t out from O. */
const F = (f: Face, s: number, t: number): XY => {
  const c = Math.cos(f.phi * DEG), sn = Math.sin(f.phi * DEG)
  return [O[0] + c * t - sn * s, O[1] + sn * t + c * s]
}
const F3 = (f: Face, s: number, t: number, z: number): V3 => [...F(f, s, t), z] as V3
const nOf = (f: Face): V3 => [Math.cos(f.phi * DEG), Math.sin(f.phi * DEG), 0]

type Set = { white: Part; grey: Part; win: Part; dark: Part; mast: Part; logo: Part }
const mk = (): Set => ({ white: new Part(), grey: new Part(), win: new Part(), dark: new Part(), mast: new Part(), logo: new Part() })

function build(s: Set, detail: boolean) {
  const arcSeg = detail ? 12 : 6
  const storey = 3.75

  // ── wings, stacked: lobby, office blocks, garden recesses ──
  for (const f of Object.values(FACES)) {
    const ring = (t: number): XY[] => [F(f, -SHAFT_S, t), F(f, SHAFT_S, t), F(f, 8.23, ATR), F(f, -8.23, ATR)]
    // The two side walls (against the shafts) are buried; the face, the
    // atrium wall and the soffits show.
    const skipSides = (i: number) => i === 1 || i === 3
    const bands: [number, number, 'office' | 'garden' | 'lobby'][] = [[0, 10, 'lobby']]
    let z = 10
    for (const g of f.gardens) {
      bands.push([z, g, 'office'], [g, Math.min(g + GARDEN, f.top), 'garden'])
      z = g + GARDEN
    }
    if (z < f.top) bands.push([z, f.top, 'office'])
    for (const [z0, z1, kind] of bands) {
      if (z1 - z0 < 0.1) continue
      const t = kind === 'office' ? WING_T : kind === 'garden' ? WING_T - 3.2 : WING_T - 1.6
      const r = ring(t)
      // The outer wall of a recess is its glazing.
      const wallPart = kind === 'office' ? s.grey : kind === 'garden' ? s.dark : s.win
      const q = r
      // walls one by one so the face can take a different material
      for (let i = 0; i < 4; i++) {
        if (skipSides(i)) continue
        const a = q[i], b = q[(i + 1) % 4]
        const part = i === 0 ? wallPart : s.grey
        part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
      }
      if (kind === 'office') {
        // soffit and sill of the recesses above and below: the office block's
        // own caps, only the strip in front of the recess shows.
        capRing(s.grey, r, z0, false)
        if (z1 >= f.top - 0.01) capRing(s.grey, r, z1, true)
        else capRing(s.grey, r, z1, true)
        // windows: groups of three storeys (two in the detail), five bays
        const per = detail ? 2 : 3
        const nRows = Math.max(1, Math.round((z1 - z0) / (storey * per)))
        const h = (z1 - z0) / nRows
        const nb = 4, end = 1.2, gap = 1.6, w = (2 * SHAFT_S - 2 * end - (nb - 1) * gap) / nb
        for (let k = 0; k < nRows; k++) {
          const za = z0 + k * h + 1.5, zb = z0 + (k + 1) * h - 1.5
          for (let b = 0; b < nb; b++) {
            const sa = -SHAFT_S + end + b * (w + gap), sb = sa + w
            face(s.win, [F3(f, sa, WING_T + 0.05, za), F3(f, sb, WING_T + 0.05, za), F3(f, sb, WING_T + 0.05, zb), F3(f, sa, WING_T + 0.05, zb)], nOf(f))
          }
        }
      } else if (kind === 'garden') {
        // the recess floor at its foot is the office block's top; add mullion
        // posts at the recess front so the opening reads as a glazed garden
        const posts = detail ? 7 : 3
        for (let k = 1; k <= posts; k++) {
          const sp = -SHAFT_S + (2 * SHAFT_S * k) / (posts + 1)
          const tw = 0.45
          const pr: XY[] = [F(f, sp - tw, WING_T - 3.2), F(f, sp + tw, WING_T - 3.2), F(f, sp + tw, WING_T - 0.4), F(f, sp - tw, WING_T - 0.4)]
          prism(s.grey, pr, z0, z1, { top: null })
        }
      }
    }
  }

  // ── corners: the rounded glazed bay between a pair of white shafts ──
  for (const c of CORNERS) {
    const a = c.ang * DEG
    const cc: XY = [O[0] + D * Math.cos(a), O[1] + D * Math.sin(a)]
    const apex = F(c.A, 8.23, ATR)
    const aA = c.A.phi * DEG, aB = c.B.phi * DEG
    const aB2 = aB < aA ? aB + 2 * Math.PI : aB
    const bay = arc(cc, R - 0.6, aA, aB2, arcSeg)
    // the bay: arc plus a wedge back to the atrium corner
    const ringBay: XY[] = [apex, F(c.A, SHAFT_S, WING_T - 1), ...bay, F(c.B, -SHAFT_S, WING_T - 1)]
    const top = c.top
    prism(s.white, ringBay, 0, top, { skip: (i) => i === 0 || i === ringBay.length - 1 })
    // glass on the bay, in groups of three storeys, a white band between,
    // from the lobby to 7 m under the top (a dark louvre band above it)
    {
      const z0 = 6, z1 = top - 7, per = detail ? 2 : 3
      const nRows = Math.round((z1 - z0) / (storey * per)), h = (z1 - z0) / nRows
      for (let k = 0; k < nRows; k++) smoothWall(s.win, bay, z0 + k * h + 0.35, z0 + (k + 1) * h - 0.35, 0.05)
      smoothWall(s.dark, bay, top - 6, top - 1.2, 0.05)
    }
    // the shafts: white boxes on both faces, proud of the bay and the wings
    for (const [f, s0, s1] of [[c.A, SHAFT_S, L], [c.B, -L, -SHAFT_S]] as [Face, number, number][]) {
      const box: XY[] = [F(f, s0, TF - 7), F(f, s1, TF - 7), F(f, s1, TF), F(f, s0, TF)]
      // bevel the top edge: a 0.5 m chamfer
      const inner: XY[] = [F(f, s0 + 0.5, TF - 7.5), F(f, s1 - 0.5, TF - 7.5), F(f, s1 - 0.5, TF - 0.5), F(f, s0 + 0.5, TF - 0.5)]
      prism(s.white, box, 0, top - 0.5, { top: null })
      const q = ccw(box), qi = ccw(inner)
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4
        s.white.quad([q[i][0], q[i][1], top - 0.5], [q[j][0], q[j][1], top - 0.5], [qi[j][0], qi[j][1], top], [qi[i][0], qi[i][1], top])
      }
      capRing(s.white, qi, top)
    }
    capRing(s.white, ringBay, top)
  }

  // ── the crown block over the south-west corner, and the mast ──
  {
    const c = CORNERS[2], a = c.ang * DEG
    const cc: XY = [O[0] + D * Math.cos(a), O[1] + D * Math.sin(a)]
    const inset = 3.4
    const bay = arc(cc, R - inset, c.A.phi * DEG, c.B.phi * DEG + 2 * Math.PI * (c.B.phi < c.A.phi ? 1 : 0), arcSeg)
    const block: XY[] = [F(c.A, 9.5, ATR + 2.2), F(c.A, L - 1, TF - inset), ...bay, F(c.B, -L + 1, TF - inset)]
    prism(s.dark, block, 214, 259)
    // the white lift-shaft head standing on the block's roof
    const hx = F(c.A, 15, TF - 6.5)
    prism(s.dark, [[hx[0] - 2, hx[1] - 2], [hx[0] + 2, hx[1] - 2], [hx[0] + 2, hx[1] + 2], [hx[0] - 2, hx[1] + 2]], 259, 261.5)
    // the mast: from inside the block's inner face to the tip
    const m: XY = [O[0] + 12.4 * Math.cos(a), O[1] + 12.4 * Math.sin(a)]
    const z0 = 230, zTop = 296, tip = 300
    const half = (z: number) => 1.5 - ((z - z0) / (zTop - z0)) * 0.9
    if (!detail) {
      const sq = (z: number): XY[] => { const h = half(z); return [[m[0] - h, m[1] - h], [m[0] + h, m[1] - h], [m[0] + h, m[1] + h], [m[0] - h, m[1] + h]] }
      // red and white bands, about 8 m each (p3)
      const cuts = [z0, 259, 268, 276, 284, 291, zTop]
      for (let k = 0; k < cuts.length - 1; k++) {
        const r0 = sq(cuts[k]), r1 = sq(cuts[k + 1])
        const part = k % 2 === 0 ? s.mast : s.white
        for (let i = 0; i < 4; i++) {
          const j = (i + 1) % 4
          part.quad([r0[i][0], r0[i][1], cuts[k]], [r0[j][0], r0[j][1], cuts[k]], [r1[j][0], r1[j][1], cuts[k + 1]], [r1[i][0], r1[i][1], cuts[k + 1]])
        }
      }
      const rt = sq(zTop)
      for (let i = 0; i < 4; i++) s.mast.tri([rt[i][0], rt[i][1], zTop], [rt[(i + 1) % 4][0], rt[(i + 1) % 4][1], zTop], [m[0], m[1], tip])
    } else {
      // open lattice: four corner legs, a ring every 4.5 m, X bracing
      const corner = (z: number, i: number): V3 => { const h = half(z), sx = i === 0 || i === 3 ? -1 : 1, sy = i < 2 ? -1 : 1; return [m[0] + sx * h, m[1] + sy * h, z] }
      const levels: number[] = []
      for (let z = z0; z < zTop - 0.1; z += 4.5) levels.push(z)
      levels.push(zTop)
      for (let k = 0; k < levels.length - 1; k++) {
        const za = levels[k], zb = levels[k + 1], part = za < 259 || za >= 276 ? s.mast : s.mast
        for (let i = 0; i < 4; i++) {
          const j = (i + 1) % 4
          beam(za < 259 ? s.white : s.mast, corner(za, i), corner(zb, i), 0.35)
          beam(part, corner(za, i), corner(za, j), 0.22)
          beam(part, corner(za, i), corner(zb, j), 0.2)
        }
      }
      for (let i = 0; i < 4; i++) beam(s.mast, corner(zTop, i), [m[0], m[1], tip], 0.25)
    }
  }

  // ── logos: the yellow ribbon triangle on two upper shafts (p1, p2, p3) ──
  for (const [f, sc, z] of [[FACES.NE, -(SHAFT_S + L) / 2, 212 - 17], [FACES.NW, (SHAFT_S + L) / 2, 224 - 19]] as [Face, number, number][]) {
    const r = 3.0, w = 1.0, out = TF + 0.04
    const pts = [90, 210, 330].map((d) => [Math.cos(d * DEG), Math.sin(d * DEG)])
    for (let k = 0; k < 3; k++) {
      const [p, q] = [pts[k], pts[(k + 1) % 3]]
      const o = (v: number[], rr: number): [number, number] => [sc + v[0] * rr, z + v[1] * rr]
      const A = o(p, r), B = o(q, r), Ci = o(q, r - w * 2), Di = o(p, r - w * 2)
      face(s.logo, [A, B, Ci, Di].map(([ss, zz]) => F3(f, ss, out, zz)), nOf(f))
    }
  }
}

const crownLight = (p: V3) => (p[2] > 198 ? Math.min(1, (p[2] - 198) / 10) : 0)
const mats = (s: Set): Layer[] => [
  { part: s.white, material: { ...finish('cb-shaft-white', 0xe4e7e8), floodlight: crownLight } },
  { part: s.grey, material: finish('cb-wing-grey', 0xb0b4b8) },
  { part: s.win, material: { ...PALETTE.window, color: 0x86a09c } },
  { part: s.dark, material: { ...finish('cb-crown-dark', 0x5d6167), floodlight: () => 1 } },
  { part: s.mast, material: finish('cb-mast-red', 0xc4533f, 0.6) },
  { part: s.logo, material: finish('neon-commerzbank-yellow', 0xf0bd2a, 0.5) },
]

if (import.meta.main) {
  const low = mk(), det = mk()
  build(low, false)
  build(det, true)
  await saveLods(ID, 'Commerzbank Tower', mats(low), mats(det), {
    anchor: [50.111177, 8.674362], bearing: 0, elevation: 0, height: 300,
  })
}

