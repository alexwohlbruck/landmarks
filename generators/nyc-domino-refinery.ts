/**
 * The Refinery at Domino, 300 Kent Avenue, Williamsburg — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-domino-refinery.ts
 *
 * State modelled: as converted to offices (PAU, completed 2023–24): the
 * 1880s brick shell kept as a free-standing screen, a new glass building
 * inside it rising above the brick under a glass barrel vault, the restored
 * chimney stack on its tower, and the restored DOMINO SUGAR sign on the roof
 * facing the river. The 2017 lidar shows the shell before the vault; heights
 * above the brick come from OSM and the 2023 photos.
 *
 * Map frame: x across the building, y along it, z up, metres. The long walls
 * run 19.6° east of north, so the model is placed at bearing 19.6 and built
 * square: +y is NNE along the river front, -x faces the East River. Anchor:
 * area centroid of the OSM outline way/633535211 (-73.9673064, 40.7144184).
 *
 * Covers and replaces: the outline way/633535211 and every part inside it:
 * the brick shell way/1243440971, way/1243440972, way/1243440973 and its
 * base way/1243440974; the glass building way/1243440975; the chimney
 * way/1243440976 and way/1243440977; the tower way/1243440978 and its roof
 * pieces way/1243853673 to way/1243853676.
 *
 * Evidence
 * - OSM (measured, mapped as converted): the outline 44.3 × 76.3 m with the
 *   tower (5.1 × 9.3 m) standing out from the middle of the river front;
 *   the shell's west half 44 m, its east half 33 m; the glass building
 *   36 × 67 m, from 6 m to 47 m with an 18 m round roof (apex 65 m); the
 *   tower 54 m; the chimney an oval 4.2 × 7.4 m, 54–75 m.
 * - USGS lidar NY_NewYorkCity (2017, before the vault). Ground about 6 m.
 *   Measured above it: the shell 43.3–44.5 m (west half) and 32.6–33.5 m
 *   (east half), matching OSM; the tower 53–54 m; the chimney's top 78.8 m
 *   (drawn 78.5; OSM's 75 is low).
 * - Photos (Wikimedia Commons): "Domino Refinery in 2023.jpg", "Domino
 *   Refinery in 2023 (2).jpg" and "Domino Refinery and One Domino Square
 *   under construction (2023).jpg" (Kevin Payravi, CC BY-SA 4.0), the
 *   chimney, sign, vault and brick from the south-west and west; "Domino
 *   Sugar Refinery, New York City, 20231001 1133 1047.jpg" (Jakub Hałun,
 *   CC BY-SA 4.0), the whole river front with the finished vault; "Domino
 *   Sugar Refinery June 2022.jpg" (Kidfly182, CC BY-SA 4.0), the shell
 *   during the works.
 * - From the photos: the vault's near-semicircular section across the
 *   building, a true half-cylinder with flat semicircular glass ends; the glass reading pale sky-blue; the sign's
 *   yellow letters, DOMINO above SUGAR, standing on a light steel frame on
 *   the river half of the roof, south of the chimney; the brick's orange-red
 *   and its rows of small arched windows.
 *
 * Estimated: the sign's size and position (the D 7 m tall, SUGAR's
 *   capitals 3.9 m, both words about 23.5 m long, centred 18 m south of the
 *   chimney and clear of it, from the photos against the 44 m wall); the
 *   window rows
 *   (two storeys a panel, about 4 m bays).
 *
 * Exception noted: the sign carries its lettering, as a famous sign may
 * (STYLE.md, "Famous signs"), traced with generators/lettering.ts from
 * Kevin Payravi's 2023 close-ups ("Domino Refinery in 2023.jpg" and
 * "…(2).jpg"): the script "Domino" with its swash D and star-dotted i, and
 * the lightly serifed capitals of "SUGAR". The real letters are outlined
 * neon on a yellow face; they are drawn as solid yellow strokes.
 *
 * Doubts: the inland (east) side is seen only past the vault; the shell's
 * window rhythm there is assumed the same as the river front.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, rect } from './dc-white-house'
import { pslab, saveModel, type XY } from './nyc-dime-savings-bank'
import { Pen, strokes, type Pt } from './lettering'

const brick = new Part(), glass = new Part(), win = new Part(), roof = new Part(), sign = new Part(), steel = new Part()

const X0 = -21.8, X1 = 22.45, Y0 = -38.2, Y1 = 38.2, XM = 0.35
const WEST = 44, EAST = 33, GL0 = 30, GL1 = 47, APEX = 65
const GX0 = -18.2, GX1 = 17.7, GY = 33.5

// ---- The brick shell: west half taller than the east.
cbox(brick, rect(X0, XM, Y0, Y1), 0, WEST, { b: 0.3, top: roof })
cbox(brick, rect(XM, X1, Y0, Y1), 0, EAST, { b: 0.3, top: roof })

// Window panels: one per bay, two storeys tall, rows up each wall.
function rows(top: number) {
  const out: [number, number][] = []
  for (let z = 2.5; z + 6 <= top - 1.5; z += 8) out.push([z, z + 6])
  return out
}
function wall(at: number, axis: 'x' | 'y', sgn: number, a0: number, a1: number, top: number, skip?: [number, number]) {
  const n = Math.round((a1 - a0) / 4.2), step = (a1 - a0) / n
  for (let k = 0; k < n; k++) {
    const c = a0 + step * (k + 0.5)
    if (skip && c > skip[0] && c < skip[1]) continue
    for (const [z0, z1] of rows(top)) {
      const P = (a: number, z: number): V3 => (axis === 'x' ? [at + sgn * 0.05, a, z] : [a, at + sgn * 0.05, z])
      const [p, q] = sgn * (axis === 'x' ? 1 : -1) > 0 ? [c - 0.65, c + 0.65] : [c + 0.65, c - 0.65]
      win.quad(P(p, z0), P(q, z0), P(q, z1), P(p, z1))
    }
  }
}
wall(X0, 'x', -1, Y0 + 1, Y1 - 1, WEST, [-6, 6]) // river front, minus the tower
wall(X1, 'x', 1, Y0 + 1, Y1 - 1, EAST)
wall(Y0, 'y', -1, X0 + 1, XM - 0.5, WEST)
wall(Y0, 'y', -1, XM + 0.5, X1 - 1, EAST)
wall(Y1, 'y', 1, X0 + 1, XM - 0.5, WEST)
wall(Y1, 'y', 1, XM + 0.5, X1 - 1, EAST)

// ---- The glass building, rising out of the shell under a barrel vault.
{
  cbox(glass, rect(GX0, GX1, -GY, GY), GL0, GL1, { top: true })
  // the vault: a true half-cylinder (semicircular section across x) running
  // the glass building's full length, closed by flat semicircular glass ends
  const cx = (GX0 + GX1) / 2, half = (GX1 - GX0) / 2, rise = APEX - GL1, N = 12
  const yEnd = GY
  const pt = (th: number, y: number): V3 => [cx + half * Math.cos(th), y, GL1 + rise * Math.sin(th)]
  const nrm = (th: number): V3 => { const v: V3 = [Math.cos(th) / half, 0, Math.sin(th) / rise], l = Math.hypot(...v); return [v[0] / l, 0, v[2] / l] }
  for (let k = 0; k < N; k++) {
    const t0 = (k / N) * Math.PI, t1 = ((k + 1) / N) * Math.PI
    const a: V3 = pt(t0, -GY), b: V3 = pt(t1, -GY), c: V3 = pt(t1, GY), d: V3 = pt(t0, GY)
    const na = nrm(t0), nb = nrm(t1)
    glass.tri(a, b, c, undefined, undefined, undefined, [na, nb, nb])
    glass.tri(a, c, d, undefined, undefined, undefined, [na, nb, na])
    // flat ends: a fan from the springing line's midpoint
    const m0: V3 = [cx, -GY, GL1], m1: V3 = [cx, GY, GL1]
    glass.tri(m0, pt(t0, -GY), pt(t1, -GY))
    glass.tri(m1, pt(t1, GY), pt(t0, GY))
  }
  // steel ribs over the vault, every 6 m, standing a little proud
  for (let y = -yEnd + 0.2; y <= yEnd - 0.19; y += (2 * yEnd - 0.4) / 10) {
    for (let k = 0; k < N; k++) {
      const t0 = (k / N) * Math.PI, t1 = ((k + 1) / N) * Math.PI
      const o = 0.12
      const P = (t: number, yy: number): V3 => [cx + (half + o) * Math.cos(t), yy, GL1 + (rise + o) * Math.sin(t)]
      steel.quad(P(t0, y - 0.18), P(t0, y + 0.18), P(t1, y + 0.18), P(t1, y - 0.18))
    }
  }
  // the glass's floor lines, pale mullions every two storeys
  for (let z = GL0 + 4; z < GL1; z += 8) {
    for (const [x, sgn] of [[GX0, -1], [GX1, 1]] as [number, number][]) {
      const P = (y: number, zz: number): V3 => [x + sgn * 0.04, y, zz]
      if (sgn < 0) steel.quad(P(GY, z), P(-GY, z), P(-GY, z + 0.35), P(GY, z + 0.35))
      else steel.quad(P(-GY, z), P(GY, z), P(GY, z + 0.35), P(-GY, z + 0.35))
    }
  }
}

// ---- The tower on the river front and its chimney stack.
cbox(brick, rect(-26.9, X0 + 0.1, -4.65, 4.6), 0, 54, { b: 0.3, top: roof })
cbox(brick, rect(-27.3, X0 + 0.1, -5.05, 5.0), 52.6, 54, { b: 0.2, top: roof, bottom: true })
{
  // an oval stack, tapering, drawn as a squashed round shaft
  const cx = -23.9, cy = 0, rx = 2.1, ry = 3.7, seg = 12
  const ring = (z: number, k: number): XY[] => Array.from({ length: seg }, (_, i) => {
    const t = (i / seg) * Math.PI * 2
    return [cx + rx * k * Math.cos(t), cy + ry * k * Math.sin(t)] as XY
  })
  pslab(brick, ring(54, 1), 54, 56, 0, false)
  // lofted taper from 56 to 77.6, then a capping band
  const r0 = ring(56, 1), r1 = ring(77.6, 0.78)
  for (let i = 0; i < seg; i++) {
    const j = (i + 1) % seg
    brick.quad([r0[i][0], r0[i][1], 56], [r0[j][0], r0[j][1], 56], [r1[j][0], r1[j][1], 77.6], [r1[i][0], r1[i][1], 77.6])
  }
  pslab(brick, ring(77.6, 0.86), 77.6, 78.5, 0.15, roof)
}

// ---- The DOMINO SUGAR sign on its steel frame, facing the river.
// Letters traced from Kevin Payravi's 2023 close-ups: "Domino" in its
// forward-leaning script, a big swash D (its top stroke curling in from the left)
// and lowercase o-m-i-n-o standing on one baseline, the i dotted with a
// star; "SUGAR" beneath in wide, lightly serifed capitals spread to the same
// length. Letter units: the D is 1 tall.
{
  const D = new Pen()
  // D: the swash top curling in from the left, the round bowl, the slanted stem
  D.moveTo([0.03, 0.72]).cubicTo([-0.03, 0.88], [0.14, 0.98], [0.33, 0.95])
    .cubicTo([0.86, 0.92], [0.96, 0.14], [0.36, 0.03]).lineTo([0.08, 0.03])
  D.moveTo([0.21, 0.03]).lineTo([0.31, 0.93])
  // o
  D.circle([1.0, 0.27], 0.19, 0.26, 14)
  // m: a stem and two arches
  D.moveTo([1.3, 0.0]).lineTo([1.33, 0.52])
  D.moveTo([1.33, 0.36]).cubicTo([1.38, 0.57], [1.63, 0.57], [1.63, 0.36]).lineTo([1.61, 0.0])
  D.moveTo([1.63, 0.36]).cubicTo([1.68, 0.57], [1.93, 0.57], [1.93, 0.36]).lineTo([1.92, 0.0])
  // i, with its star
  D.moveTo([2.15, 0.0]).lineTo([2.18, 0.52])
  for (const a of [0, Math.PI / 3, (2 * Math.PI) / 3]) {
    const c: Pt = [2.21, 0.74], r = 0.11
    D.moveTo([c[0] - r * Math.cos(a), c[1] - r * Math.sin(a)]).lineTo([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)])
  }
  // n
  D.moveTo([2.42, 0.0]).lineTo([2.45, 0.52])
  D.moveTo([2.45, 0.36]).cubicTo([2.5, 0.57], [2.76, 0.57], [2.76, 0.36]).lineTo([2.74, 0.0])
  // o
  D.circle([3.13, 0.27], 0.19, 0.26, 14)

  const S = new Pen()
  // S
  S.moveTo([0.42, 0.47]).cubicTo([0.35, 0.57], [0.04, 0.58], [0.04, 0.42])
    .cubicTo([0.04, 0.27], [0.43, 0.31], [0.43, 0.14]).cubicTo([0.43, -0.03], [0.1, -0.03], [0.02, 0.08])
  // U, with serifs
  const U = 0.7
  S.moveTo([U, 0.55]).lineTo([U, 0.18]).cubicTo([U, -0.03], [U + 0.42, -0.03], [U + 0.42, 0.18]).lineTo([U + 0.42, 0.55])
  S.moveTo([U - 0.07, 0.55]).lineTo([U + 0.07, 0.55]).moveTo([U + 0.35, 0.55]).lineTo([U + 0.49, 0.55])
  // G
  const G = 1.4
  S.moveTo([G + 0.44, 0.45]).cubicTo([G + 0.36, 0.59], [G, 0.6], [G, 0.28]).cubicTo([G, -0.04], [G + 0.4, -0.04], [G + 0.46, 0.12])
    .lineTo([G + 0.46, 0.26]).lineTo([G + 0.27, 0.26])
  // A, with foot serifs
  const A = 2.1
  S.moveTo([A, 0.0]).lineTo([A + 0.24, 0.55]).lineTo([A + 0.48, 0.0])
  S.moveTo([A + 0.11, 0.18]).lineTo([A + 0.37, 0.18])
  S.moveTo([A - 0.07, 0.0]).lineTo([A + 0.07, 0.0]).moveTo([A + 0.41, 0.0]).lineTo([A + 0.55, 0.0])
  // R
  const R = 2.86
  S.moveTo([R, 0.0]).lineTo([R, 0.55]).lineTo([R + 0.22, 0.55]).cubicTo([R + 0.47, 0.55], [R + 0.47, 0.28], [R + 0.22, 0.28]).lineTo([R, 0.28])
  S.moveTo([R + 0.17, 0.28]).lineTo([R + 0.45, 0.0])
  S.moveTo([R - 0.08, 0.0]).lineTo([R + 0.08, 0.0])

  const XS = X0 + 2.0 // the letters' back, just inside the river wall
  const K = 7.0 // metres per letter unit: the D 7 m tall, the words about 23.5 m long
  const WORD = 3.35, yc = -18, yStart = yc + (WORD * K) / 2
  const zs = WEST + 2.6, zd = zs + 0.6 * K + 0.6
  // read from the river, looking east: u runs north to south (-y), w toward the river (-x)
  // `slant` leans the script forward, as the real Domino does (about 9°)
  // `climb` raises "Domino"'s baseline toward its end: the word rises to the
  // right, about 0.33 per unit along (Jakub Hałun's frontal river photo),
  // while SUGAR stays level beneath it, leaning slightly forward.
  const CLIMB = 0.33
  const place = (z0: number, slant = 0, climb = 0) => (u: number, v: number, w: number): V3 => [XS - w, yStart - (u + slant * v) * K, z0 + (v + climb * u) * K]
  strokes(sign, D.paths, { width: 0.16, depth: 0.08, place: place(zd, 0.16, CLIMB), back: true })
  strokes(sign, S.paths, { width: 0.13, depth: 0.08, place: place(zs, 0.12), back: true })
  // the light steel frame behind: posts rising with the word, a level rail
  // behind SUGAR and a sloping one behind Domino
  const y0 = yStart - WORD * K, y1 = yStart
  for (const f of [0.15, 0.5, 0.85]) { // three posts, as on the real frame
    const y = y0 + (y1 - y0) * f, u = (yStart - y) / K
    cbox(steel, rect(XS + 0.4, XS + 0.8, y - 0.2, y + 0.2), WEST, zd + (0.55 + CLIMB * u) * K, { top: true })
  }
  cbox(steel, rect(XS + 0.4, XS + 0.8, y0, y1), zs + 0.3 * K, zs + 0.3 * K + 0.3, { bottom: true })
  {
    const zr = (y: number) => zd + (0.3 + CLIMB * (yStart - y) / K) * K
    const xa = XS + 0.4, xb = XS + 0.8
    const r = (x: number, y: number, dz: number): V3 => [x, y, zr(y) + dz]
    steel.quad(r(xa, y1, 0), r(xa, y0, 0), r(xa, y0, 0.3), r(xa, y1, 0.3))
    steel.quad(r(xb, y0, 0), r(xb, y1, 0), r(xb, y1, 0.3), r(xb, y0, 0.3))
    steel.quad(r(xa, y1, 0.3), r(xa, y0, 0.3), r(xb, y0, 0.3), r(xb, y1, 0.3))
    steel.quad(r(xa, y0, 0), r(xa, y1, 0), r(xb, y1, 0), r(xb, y0, 0))
  }
}

await saveModel('nyc-domino-refinery', 'The Refinery at Domino', [
  { part: brick, material: finish('domino-brick', 0xbd8166) },
  { part: glass, material: { ...PALETTE.glass, color: 0x93adbd } },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: sign, material: finish('neon-domino-yellow', 0xe9b93c) },
  { part: steel, material: finish('domino-steel', 0xd9dcdc) },
], { source: 'generators/nyc-domino-refinery.ts', bearing: 19.6, osm: 'way/633535211', height: 78.5 }, 6500)
