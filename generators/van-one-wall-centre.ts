/**
 * One Wall Centre (Sheraton Wall Centre North Tower), 1088 Burrard Street,
 * Vancouver: procedural, CC0-1.0, no textures.
 *   bun generators/van-one-wall-centre.ts
 *
 * Bruno Freschi's 2001 elliptical tower: a shaft of dark blue mirror glass
 * on an ellipse about 46 x 23 m, its long axis east-west, under a crown of
 * light silver glass on a smaller ellipse whose top curves down from a
 * flat west end (with a mast) to the shaft's cornice at the east end.
 * Only the elliptical tower is drawn; the Wall Centre podium
 * (way/327005466), the Suites tower (way/238787872) and the South Tower
 * are separate and keep their own extrusions.
 *
 * Map frame: x east', y north', z up, metres, turned to bearing 6.6, so x
 * runs along the ellipse's long axis (bearing 96.6, OSM way/91998089).
 * Anchor: the centroid of way/91998089, lng -123.1255557, lat 49.2805245.
 * Elevation 0.
 *
 * Evidence
 *  - OSM (ODbL): way/91998089 (One Wall Centre, hotel, height 150, 48
 *    levels, Q683915): the shaft's ellipse, semi-axes 22.8 x 11.5;
 *    way/91998091 (part, 150): the crown's ellipse, 20.4 x 9.5, its centre
 *    2.1 m east; way/1363418928 and way/1363418929 (hotel and apartment
 *    parts on the same ellipse).
 *  - City of Vancouver building-footprints-2009 (City 2009 lidar; Contains
 *    information licensed under the Open Government Licence - Vancouver),
 *    bldgid 144629: top 148.0 m over a 32.6 m base (the crown's high end).
 *  - Published (Wikipedia "One Wall Centre"): 150 m, 157.8 m to the mast.
 *  - The crown, from klazu (from the south, the North Shore behind; the
 *    long side face-on at about 5.3 px/m): the shaft's cornice at about
 *    130 m, the crown 18 m tall at its flat west end, curving down to the
 *    cornice at the east end; the mast on the west end.
 *  - Photos (Wikimedia Commons, EVIDENCE):
 *    - klazu: Klazu, "One Wall Centre.jpg", CC BY-SA 4.0.
 *      https://commons.wikimedia.org/wiki/File:One_Wall_Centre.jpg
 *    - itza: ItzaFineDay, "Vancouver Wall Centre.jpg", CC BY 2.0 (the
 *      narrow end, the pale floor lines).
 *      https://commons.wikimedia.org/wiki/File:Vancouver_Wall_Centre.jpg
 *    - ymb: Ymblanter, "One Wall Centre from the crossing of Burrard and
 *      Nelson Streets.jpg", CC BY-SA 4.0 (the glass's colour).
 *      https://commons.wikimedia.org/wiki/File:One_Wall_Centre_from_the_crossing_of_Burrard_and_Nelson_Streets.jpg
 *  No commercial imagery.
 *
 * Estimated, and doubts:
 *  - The crown's curve (a quarter ellipse in elevation) and where its flat
 *    west face stands (x = -16) are read from one photo.
 *  - The glass is pulled lighter than the real blue-black, as STYLE.md
 *    asks for large dark surfaces; a few pale floor lines stand for the
 *    real banding.
 *  - Night: the crown is lit in reality and is `neon` here; the shaft is
 *    `window`.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { triangulate, type XY } from './chi-aon-center'

export const BEARING = 6.6
export const ANCHOR = { lng: -123.1255557, lat: 49.2805245 }
const SEG = 28
const Z_SHAFT = 130.5, Z_CROWN = 148, Z_MAST = 157.8
const ell = (cx: number, a: number, b: number): XY[] => Array.from({ length: SEG }, (_, i) => [cx + a * Math.cos((i / SEG) * 2 * Math.PI), b * Math.sin((i / SEG) * 2 * Math.PI)] as XY)

/** Smooth-shaded walls of an elliptical ring between per-vertex heights. */
function ringWalls(p: Part, r: XY[], z0: (q: XY) => number, z1: (q: XY) => number, cx: number, a: number, b: number, open = false) {
  const nrm = (q: XY): V3 => { const nx = (q[0] - cx) / (a * a), ny = q[1] / (b * b), l = Math.hypot(nx, ny) || 1; return [nx / l, ny / l, 0] }
  for (let i = 0; i < r.length - (open ? 1 : 0); i++) {
    const j = (i + 1) % r.length, A = r[i], B = r[j]
    const a0: V3 = [A[0], A[1], z0(A)], b0: V3 = [B[0], B[1], z0(B)], b1: V3 = [B[0], B[1], z1(B)], a1: V3 = [A[0], A[1], z1(A)]
    const nA = nrm(A), nB = nrm(B)
    p.tri(a0, b0, b1, undefined, undefined, undefined, [nA, nB, nB])
    p.tri(a0, b1, a1, undefined, undefined, undefined, [nA, nB, nA])
  }
}
function capAt(p: Part, r: XY[], z: (q: XY) => number, up: boolean) {
  for (const [i, j, k] of triangulate(r)) {
    const P = (q: XY): V3 => [q[0], q[1], z(q)]
    if (up) p.tri(P(r[i]), P(r[j]), P(r[k])); else p.tri(P(r[i]), P(r[k]), P(r[j]))
  }
}

function build() {
  const glass = new Part(), trim = new Part(), crown = new Part(), roof = new Part(), mast = new Part()

  // the shaft
  const S = ell(0, 22.8, 11.5)
  ringWalls(glass, S, () => 0, () => Z_SHAFT, 0, 22.8, 11.5)
  // pale floor lines, a few, and the cornice ring
  for (const z of [33, 66, 99]) {
    const out = ell(0, 22.86, 11.56)
    ringWalls(trim, out, () => z - 0.3, () => z + 0.3, 0, 22.86, 11.56)
  }
  // and a few pale mullion lines up the shaft
  for (let k = 0; k < 12; k++) {
    const t = ((k + 0.5) / 12) * 2 * Math.PI, w = 0.012
    const P = (tt: number, z: number): V3 => [22.86 * Math.cos(tt), 11.56 * Math.sin(tt), z]
    trim.quad(P(t - w, 0), P(t + w, 0), P(t + w, Z_SHAFT - 0.6), P(t - w, Z_SHAFT - 0.6))
  }
  const C = ell(0, 23.1, 11.8)
  ringWalls(trim, C, () => Z_SHAFT - 0.6, () => Z_SHAFT + 0.6, 0, 23.1, 11.8)
  capAt(roof, C, () => Z_SHAFT + 0.6, true)
  capAt(trim, C, () => Z_SHAFT - 0.6, false)

  // the crown: the smaller ellipse, cut flat at x = -16 on the west, its top
  // curving down eastward from 148 m to the cornice
  const cx = 2.1, a = 20.4, b = 9.5, xw = -16
  const ring: XY[] = []
  for (let i = 0; i <= SEG; i++) {
    const t = -Math.acos((xw - cx) / a) + (i / SEG) * 2 * Math.acos((xw - cx) / a) // from (xw,-yw) round the east end to (xw, yw)
    const q: XY = [cx + a * Math.cos(t), b * Math.sin(t)]
    ring.push(q)
  }
  const top = (q: XY) => {
    const u = Math.max(0, (q[0] - (xw + 4)) / (cx + a - (xw + 4)))
    return Z_SHAFT + 0.6 + (Z_CROWN - Z_SHAFT - 0.6) * Math.sqrt(Math.max(0, 1 - u * u)) + 0.01
  }
  ringWalls(crown, ring, () => Z_SHAFT + 0.6, top, cx, a, b, true)
  // the flat west face, glazed
  {
    const p0 = ring[ring.length - 1], p1 = ring[0]
    glass.quad([p0[0], p0[1], Z_SHAFT + 0.6], [p1[0], p1[1], Z_SHAFT + 0.6], [p1[0], p1[1], top(p1)], [p0[0], p0[1], top(p0)])
  }
  capAt(roof, ring, top, true)

  // the mast on the west end
  const mx = xw + 2.5, seg = 8
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * 2 * Math.PI, t1 = ((i + 1) / seg) * 2 * Math.PI
    const P = (t: number, r: number, z: number): V3 => [mx + r * Math.cos(t), r * Math.sin(t), z]
    mast.quad(P(t0, 0.5, Z_CROWN), P(t1, 0.5, Z_CROWN), P(t1, 0.25, Z_MAST), P(t0, 0.25, Z_MAST))
  }

  return [
    { part: glass, material: windowVariant(2, 0x51677c) as MaterialSpec },
    { part: trim, material: PALETTE.trim as MaterialSpec },
    { part: crown, material: finish('neon-owc-crown', 0xd5dade) as MaterialSpec },
    { part: roof, material: PALETTE.roof as MaterialSpec },
    { part: mast, material: PALETTE.metal as MaterialSpec },
  ]
}

if (import.meta.main) {
  const parts = build().filter((x) => x.part.triangles > 0)
  const tris = parts.reduce((s, x) => s + x.part.triangles, 0)
  const glb = writeGlb('One Wall Centre', parts, { frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [ANCHOR.lat, ANCHOR.lng], bearing: BEARING })
  if (tris > 5000 || glb.length > 250_000) throw new Error(`budget: ${tris} triangles / ${glb.length} bytes`)
  const out = new URL('../models/van-one-wall-centre.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}
