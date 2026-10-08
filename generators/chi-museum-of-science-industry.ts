/**
 * Museum of Science and Industry, Chicago (1893 Palace of Fine Arts, Charles
 * B. Atwood; rebuilt in stone 1930s) — original procedural geometry, CC0-1.0.
 * bun generators/chi-museum-of-science-industry.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/24826230, 41.790714,
 * -87.582761. Bearing 0: the outline's long edges run 89.2°/269.5°.
 *
 * Identity: the Beaux-Arts palace on the Jackson Park lagoon. A long, pale
 * limestone main block on a raised basement, symmetrical about a cross of
 * gabled green roofs; a low copper-green dome on a drum at the crossing; a
 * hexastyle portico with a pediment centred on the north (entrance) and the
 * south (lagoon) fronts; long Ionic colonnades along the wings; and two
 * smaller domed pavilions to the north-west and north-east, linked to the
 * main block by low connectors. The Henry Crown Space Center's grey dome
 * (1986) sits south of the east pavilion inside the same outline.
 *
 * Abstraction: wing colonnades are square-ish piers standing just proud of
 * a dark loggia band; caryatid porches, sculpture, attic reliefs, the
 * quadrants' skylights and rooftop plant are left out. The quadrant roofs
 * are flat behind a green sloped rim, as NAIP and the lawn photos show. Pavilion and connector plans are rectangles
 * fitted to the outline and NAIP.
 *
 * Evidence:
 *  - plan: OSM way/24826230 (one outline round the whole complex) laid over
 *    USGS NAIP (0.42 m/px). Main block 174 x 82 m; cross arms 28 m wide;
 *    dome ≈ 32 m across; north and south porticos 36 m wide, 10 m deep;
 *    pavilions ≈ 70 x 58 m; space center 54 x 47 m with a ≈ 28 m dome. All
 *    measured off NAIP and the outline, ±2 m.
 *  - heights: nothing published in OSM or Wikipedia. Measured in GD333's
 *    near-frontal north photo against the 36 m portico width: basement
 *    ≈ 4.5 m, wing cornice ≈ 21 m, portico attic ≈ 27 m, pediment apex ≈ 35
 *    m, dome top ≈ 48 m (the dome is farther from the camera, so ± 4 m).
 *    Pavilions (≈ 15 m) and connectors (≈ 9 m) estimated from the aerial
 *    and the south photo.
 *  - colour: pale buff limestone, green copper/tile roofs, a lighter
 *    green dome (Ludowici tile, 1930), grey space center dome.
 *
 * Photos (Wikimedia Commons): Museum_of_Science_and_Industry_Chicago_
 * exterior_01.jpg and _02.jpg (GualdimG, CC BY-SA 4.0); Museum_of_Science_
 * and_Industry_-_Hyde_Park_Neighborhood_-_Chicago_-_Illinois_-_USA.jpg (Adam
 * Jones, CC BY 2.0); Museum_of_Science_and_Industry_(Chicago).jpg (zooey,
 * CC BY 2.0); Museum_of_Science_and_Industry_1_(31683458414).jpg
 * (daryl_mitchell, CC BY-SA 2.0); Museum_of_Science_and_Industry_
 * (2020-01-01).jpg (ShadZ01, CC BY-SA 4.0); Museum_of_Science_and_Industry_
 * (Chicago)_-_Joy_of_Museums.jpg (Joyofmuseums, CC BY-SA 4.0); Aerial View
 * of Chicago, Museum of Science and Industry, 1930 (Chicago Aerial Survey,
 * public domain). USGS NAIP. No commercial imagery.
 *
 * The kit below (rings, ear clipping, bevelled blocks, columns, lathe,
 * gables) is adapted from chi-field-museum.ts and exported for this
 * builder's other Chicago models.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, type Swatch } from './palette'

// ---------------------------------------------------------------------------
// Kit

export type XY = [number, number]

export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
export const circle = (cx: number, cy: number, r: number, seg = 16, a0 = 0): XY[] =>
  Array.from({ length: seg }, (_, i) => [cx + r * Math.cos(a0 + (i / seg) * 2 * Math.PI), cy + r * Math.sin(a0 + (i / seg) * 2 * Math.PI)] as XY)

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

export const signedArea = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
/** The ring counter-clockwise. */
export const ccw = (r: XY[]) => (signedArea(r) < 0 ? [...r].reverse() : r)

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
export function block(wall: Part, top: Part | null, r: XY[], z0: number, z1: number, bevel = 0.4): XY[] {
  if (bevel <= 0) { walls(wall, r, z0, z1); if (top) cap(top, r, z1); return r }
  const ins = inset(r, bevel)
  walls(wall, r, z0, z1 - bevel)
  walls(wall, r, z1 - bevel, z1, ins)
  if (top) cap(top, ins, z1)
  return ins
}
/** A projecting cornice band round a ring: out by `d`, from z0 to z1, bevelled under and over. */
export function cornice(p: Part, r: XY[], z0: number, z1: number, d = 0.5) {
  const o = inset(r, -d), h = z1 - z0
  walls(p, r, z0, z0 + h * 0.35, o)
  walls(p, o, z0 + h * 0.35, z1 - h * 0.25)
  walls(p, o, z1 - h * 0.25, z1, inset(r, -d * 0.4))
}

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
/** A box standing proud of wall a→b (back face omitted): pilasters, capitals, piers. */
export function relief(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, d: number, top = true) {
  const { P } = onWall(a, b)
  p.quad(P(s0, z0, d), P(s1, z0, d), P(s1, z1, d), P(s0, z1, d))
  p.quad(P(s0, z0, 0), P(s0, z0, d), P(s0, z1, d), P(s0, z1, 0))
  p.quad(P(s1, z0, d), P(s1, z0, 0), P(s1, z1, 0), P(s1, z1, d))
  if (top) p.quad(P(s0, z1, d), P(s1, z1, d), P(s1, z1, 0), P(s0, z1, 0))
}
/** An engaged half column on wall a→b at s: smooth shaft, block base and capital. */
export function halfColumn(shaft: Part, blocks: Part, a: XY, b: XY, s: number, z0: number, z1: number, r: number, seg = 6) {
  const { u, n, P } = onWall(a, b)
  const cb = Math.min(0.9, (z1 - z0) * 0.07), cc = Math.min(0.9, (z1 - z0) * 0.08)
  relief(blocks, a, b, s - r * 1.25, s + r * 1.25, z0, z0 + cb, r * 1.2)
  relief(blocks, a, b, s - r * 1.3, s + r * 1.3, z1 - cc, z1, r * 1.25)
  const at = (k: number, z: number, rr: number) => {
    const t = Math.PI - (k * Math.PI) / seg
    return P(s + rr * Math.cos(t), z, rr * Math.sin(t))
  }
  const nm = (k: number): V3 => {
    const t = Math.PI - (k * Math.PI) / seg
    return [u[0] * Math.cos(t) + n[0] * Math.sin(t), u[1] * Math.cos(t) + n[1] * Math.sin(t), 0]
  }
  for (let k = 0; k < seg; k++) {
    const A = at(k, z0 + cb, r), B = at(k + 1, z0 + cb, r), C = at(k + 1, z1 - cc, r * 0.9), D = at(k, z1 - cc, r * 0.9)
    shaft.tri(A, B, C, undefined, undefined, undefined, [nm(k), nm(k + 1), nm(k + 1)])
    shaft.tri(A, C, D, undefined, undefined, undefined, [nm(k), nm(k + 1), nm(k)])
  }
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
/** A free-standing classical column: plinth block, tapering smooth shaft, capital block. */
export function column(shaft: Part, blocks: Part, cx: number, cy: number, z0: number, z1: number, r: number, seg = 10) {
  const cb = Math.min(0.8, (z1 - z0) * 0.06), cc = Math.min(0.9, (z1 - z0) * 0.08)
  block(blocks, blocks, rect(cx - r * 1.2, cy - r * 1.2, cx + r * 1.2, cy + r * 1.2), z0, z0 + cb, 0.12)
  lathe(shaft, cx, cy, [[r, z0 + cb], [r * 0.86, z1 - cc]], seg)
  block(blocks, blocks, rect(cx - r * 1.3, cy - r * 1.3, cx + r * 1.3, cy + r * 1.3), z1 - cc, z1, 0.15)
}

/**
 * A gabled block whose ridge runs along y: eaves at z0 along x0 and x1,
 * ridge at z1 on the centre line, triangular gable walls (pediments) at y0
 * and y1 in `gableP`, sloping roof in `roofP`.
 */
export function gableY(roofP: Part, gableP: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const xm = (x0 + x1) / 2
  roofP.quad([x1, y0, z0], [x1, y1, z0], [xm, y1, z1], [xm, y0, z1])
  roofP.quad([x0, y1, z0], [x0, y0, z0], [xm, y0, z1], [xm, y1, z1])
  gableP.tri([x0, y0, z0], [x1, y0, z0], [xm, y0, z1])
  gableP.tri([x1, y1, z0], [x0, y1, z0], [xm, y1, z1])
}
/** A raking cornice: a slim bevelled lip along a pediment's two slopes, on the gable plane y = yf facing `dir`. */
export function rakingCornice(p: Part, x0: number, x1: number, yf: number, dir: 1 | -1, z0: number, z1: number, t = 0.6, d = 0.5) {
  const xm = (x0 + x1) / 2
  for (const [xa, xb] of [[x0, xm], [x1, xm]]) {
    const A: V3 = [xa, yf, z0], B: V3 = [xb, yf, z1]
    const o = (v: V3, dz: number, dy: number): V3 => [v[0], v[1] + dir * dy, v[2] + dz]
    const q = (a: V3, b: V3, c: V3, e: V3) => {
      // Wind to face outwards along `dir`, whichever slope this is.
      const nY = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2])
      if (Math.sign(nY || 1) === dir) p.quad(a, b, c, e); else p.quad(a, e, c, b)
    }
    q(o(A, -t, d), o(B, -t, d), o(B, 0, d), o(A, 0, d))
    // Top surface of the lip, sloping with the roof.
    const up = (v: V3, dy: number): V3 => [v[0], v[1] + dir * dy, v[2]]
    const topA = up(A, d), topB = up(B, d), backA = up(A, 0), backB = up(B, 0)
    const n = (b: V3, a: V3, c: V3) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    if (n(topB, topA, backA) * (xb - xa) * dir < 0) p.quad(topA, topB, backB, backA); else p.quad(topA, backA, backB, topB)
  }
}

/** A gabled block whose ridge runs along x: the gable walls face west and east. */
export function gableX(roofP: Part, gableP: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const ym = (y0 + y1) / 2
  roofP.quad([x0, y0, z0], [x1, y0, z0], [x1, ym, z1], [x0, ym, z1])
  roofP.quad([x1, y1, z0], [x0, y1, z0], [x0, ym, z1], [x1, ym, z1])
  gableP.tri([x0, y1, z0], [x0, y0, z0], [x0, ym, z1])
  gableP.tri([x1, y0, z0], [x1, y1, z0], [x1, ym, z1])
}

/** Check the budget and write models/<id>.glb. */
export async function save(id: string, name: string, parts: { part: Part; material: Swatch }[], extras: Record<string, unknown>, maxTri = 5000) {
  const used = parts.filter((x) => x.part.triangles > 0)
  const triangles = used.reduce((s, x) => s + x.part.triangles, 0)
  console.log(used.map((x) => `${x.material.name}: ${x.part.triangles}`).join('\n'))
  if (used.length > 6) throw new Error(`${id}: ${used.length} materials`)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', ...extras })
  if (triangles > maxTri || glb.length > 250_000) throw new Error(`${id}: budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
  await Bun.write(new URL(`../models/${id}.glb`, import.meta.url), glb)
  console.log(`${id}.glb: ${triangles} triangles, ${glb.length} bytes`)
}

// ---------------------------------------------------------------------------
// Museum of Science and Industry

function build() {
  const stone = new Part(), trim = new Part(), roof = new Part(), green = new Part(), dome = new Part(), win = new Part()

  // Heights.
  const BASE = 4.5, COL0 = 5.2, COL1 = 16.2, CORNICE = 21, MANSARD = 23.5, ARM = 24.5, RIDGE = 30
  const P_ATT = 27.5, P_APEX = 35.5
  // Plan.
  const CX = -3, CY = -17                    // the crossing, under the dome
  const X0 = -90, X1 = 84, Y0 = -59, Y1 = 23 // main block
  const AW = 14                              // cross arms' half width
  const PW = 18, PD = 10                     // portico half width, depth

  // --- Main block: basement, walls, cornice, flat quadrant roofs.
  const main = rect(X0, Y0, X1, Y1)
  walls(stone, main, 0, BASE - 0.5)
  cornice(trim, main, BASE - 0.5, BASE, 0.35)
  walls(stone, main, BASE, CORNICE - 1.2)
  cornice(trim, main, CORNICE - 1.2, CORNICE, 0.6)
  // The quadrants' green roofs slope up from the cornice, as seen from the
  // lawn, to flat skylit roofs behind (NAIP).
  const flat = inset(main, 5)
  walls(green, inset(main, -0.25), CORNICE, MANSARD, flat)
  cap(roof, flat, MANSARD)

  // --- Cross arms: raised clerestory walls under green gabled roofs, with
  // a pediment at each of the four ends.
  const ns = rect(CX - AW, Y0, CX + AW, Y1), ew = rect(X0, CY - AW, X1, CY + AW)
  for (const r of [ns, ew]) {
    walls(stone, r, MANSARD - 1, ARM - 0.8)
    cornice(trim, r, ARM - 0.8, ARM, 0.45)
  }
  {
    const o = inset(ns, -0.3)
    gableY(green, trim, o[0][0], o[1][0], o[0][1], o[2][1], ARM, RIDGE)
    const e = inset(ew, -0.3)
    gableX(green, trim, e[0][0], e[1][0], e[0][1], e[2][1], ARM, RIDGE)
  }

  // --- Dome on a drum at the crossing.
  const DR = 16
  lathe(stone, CX, CY, [[DR + 1.5, ARM + 1], [DR + 1.5, ARM + 3], [DR, ARM + 3], [DR, 36]], 20)
  lathe(trim, CX, CY, [[DR, 36], [DR + 0.8, 36.4], [DR + 0.8, 37.4], [DR - 0.2, 37.6]], 20)
  // A shallow dome: a half-ellipse 11.5 m high, smooth-shaded.
  const prof: XY[] = []
  for (let i = 0; i <= 6; i++) {
    const t = (i / 6) * (Math.PI / 2)
    prof.push([(DR - 0.2) * Math.cos(t), 37.6 + 10.4 * Math.sin(t)])
  }
  lathe(dome, CX, CY, prof, 20)
  // A dark band of drum windows, 12 flush panels round the drum.
  for (let k = 0; k < 12; k++) {
    const a0 = ((k + 0.25) / 12) * 2 * Math.PI, a1 = ((k + 0.75) / 12) * 2 * Math.PI
    const P = (a: number, z: number): V3 => [CX + (DR + 0.05) * Math.cos(a), CY + (DR + 0.05) * Math.sin(a), z]
    win.quad(P(a0, 30.5), P(a1, 30.5), P(a1, 34.5), P(a0, 34.5))
  }

  // --- Porticos, north and south: six columns before a dark loggia, an
  // attic and a pediment.
  for (const s of [1, -1]) {
    const yw = s > 0 ? Y1 : Y0, yf = yw + s * PD
    const r = s > 0 ? rect(CX - PW, yw, CX + PW, yf) : rect(CX - PW, yf, CX + PW, yw)
    // Raised porch with its steps' landing, then the loggia wall behind.
    block(stone, stone, r, 0, BASE, 0.3)
    const a: XY = s > 0 ? [CX + PW, yw] : [CX - PW, yw], b: XY = s > 0 ? [CX - PW, yw] : [CX + PW, yw]
    panel(win, a, b, 2.5, 2 * PW - 2.5, BASE, COL1 + 1.2, 0.06)
    for (let i = 0; i < 6; i++) {
      const x = CX - PW + 3 + (i * (2 * PW - 6)) / 5
      column(stone, trim, x, yf - s * 1.6, BASE, COL1 + 1.5, 0.9, 10)
    }
    // Entablature and attic spanning the columns.
    const top = s > 0 ? rect(CX - PW, yw, CX + PW, yf) : rect(CX - PW, yf, CX + PW, yw)
    walls(stone, top, COL1 + 1.5, P_ATT - 1)
    cap(stone, top, COL1 + 1.5, false)
    cornice(trim, top, P_ATT - 1, P_ATT, 0.5)
    const o = inset(top, -0.3)
    gableY(green, trim, o[0][0], o[1][0], o[0][1], o[2][1], P_ATT, P_APEX)
  }

  // --- Wing colonnades along the north and south fronts: piers before a
  // dark loggia band, either side of the portico.
  const PITCH = 4.6
  for (const [yw, out] of [[Y1, 1], [Y0, -1]] as [number, number][]) {
    for (const [xa, xb] of [[X0 + 6, CX - PW - 3], [CX + PW + 3, X1 - 6]]) {
      const a: XY = out > 0 ? [xb, yw] : [xa, yw], b: XY = out > 0 ? [xa, yw] : [xb, yw]
      const L = xb - xa
      panel(win, a, b, 0, L, COL0, COL1, 0.05)
      const n = Math.floor(L / PITCH)
      for (let i = 0; i <= n; i++) relief(stone, a, b, (i * L) / n - 0.6, (i * L) / n + 0.6, COL0 - 0.4, COL1 + 0.4, 0.7)
    }
  }

  // --- Pavilions north-west and north-east, each with a small dome.
  const pavilion = (x0: number, y0: number, x1: number, y1: number) => {
    const r = rect(x0, y0, x1, y1)
    walls(stone, r, 0, BASE - 0.5)
    cornice(trim, r, BASE - 0.5, BASE, 0.3)
    walls(stone, r, BASE, 14.2)
    cornice(trim, r, 14.2, 15.2, 0.5)
    cap(roof, inset(r, -0.2), 15.2)
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
    lathe(stone, cx, cy, [[7.5, 15.2], [7.5, 18.5], [7, 18.5]], 14)
    const pr: XY[] = []
    for (let i = 0; i <= 4; i++) { const t = (i / 4) * (Math.PI / 2); pr.push([7 * Math.cos(t), 18.5 + 5 * Math.sin(t)]) }
    lathe(dome, cx, cy, pr, 14)
    // Dark windows between pilasters on the long fronts.
    for (const [a, b] of [[[x1, y1], [x0, y1]], [[x0, y0], [x1, y0]]] as [XY, XY][]) {
      const L = Math.abs(x1 - x0)
      for (let i = 0; i < 7; i++) panel(win, a, b, 5 + i * ((L - 10) / 7) + 1.2, 5 + (i + 1) * ((L - 10) / 7) - 1.2, 6.5, 11.5, 0.05)
    }
  }
  pavilion(-187, 25, -117, 82)
  pavilion(88, 25, 160, 85)

  // --- Connectors: low flat-roofed links.
  for (const [x0, y0, x1, y1] of [[-117, 8, X0, 30], [X1, 0, 92, 25], [92, -40, 104, 25]]) block(stone, roof, rect(x0, y0, x1, y1), 0, 9, 0.3)

  // --- Henry Crown Space Center: a plain block and its grey theatre dome.
  block(stone, roof, rect(104, -64, 158, -17), 0, 12, 0.4)
  const sc: XY[] = []
  for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); sc.push([14 * Math.cos(t), 11.5 + 11 * Math.sin(t)]) }
  lathe(roof, 140, -38, sc, 18)

  return [
    { part: stone, material: PALETTE.stone },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: green, material: PALETTE.patina },
    { part: dome, material: PALETTE.copper },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main) await save('chi-museum-of-science-industry', 'Museum of Science and Industry', build(), { height: 48 }, 6500)
