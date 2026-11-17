/**
 * El Caballito (Cabeza de Caballo), Sebastián (Enrique Carbajal), 1992:
 * the yellow steel horse's head at Paseo de la Reforma / Avenida Juárez /
 * Bucareli, Mexico City. Procedural, CC0-1.0.
 * bun generators/mexico-city-el-caballito.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 16 (the axes
 * of the OSM hexagon). Origin: the centroid of OSM way/217392300
 * (tourism=artwork, height=28; not a building), lng -99.1494009,
 * lat 19.4360946.
 *
 * Form: on a tall battered block of dark grey stone (5 m), a composition
 * of folded yellow steel read in profile from the south: on the west a
 * fan of four concentric arched bands (the mane) with gaps between them,
 * the inner two landing on the base, the outer two ending in the air; a
 * vertical band rising behind them and curling east over the top (the
 * neck's back); in front of it a tall faceted spike with a vertical crease
 * (the neck's front); and from the spike's apex a cluster of sharp folded
 * facets: the ear spike, the muzzle wedge pointing east, the creased jaw.
 * The bands are "folded plates" (outline on a mid plane, inset faces
 * either side); the neck and head are convex hulls of a few points, so
 * every facet is a flat, crisp plane.
 *
 * Sources
 * - OSM (ODbL): way/217392300, a 19.5 m hexagon (the planted island),
 *   height=28 (published as the sculpture's height; used as the top above
 *   the street).
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 AlejandroLinaresGarcia, "SculptureTorreCaballito3.jpg", CC BY-SA 3.0
 *     (from the south-west, the whole profile and the stone base: the main
 *     reference);
 *     https://commons.wikimedia.org/wiki/File:SculptureTorreCaballito3.jpg
 *   2 Sarumo74, "GLORIETA DEL CABALLITO SEBASTIAN.JPG", CC BY 3.0 (from
 *     the south, level and far: the overall proportions, 22 m wide);
 *     https://commons.wikimedia.org/wiki/File:GLORIETA_DEL_CABALLITO_SEBASTIAN.JPG
 *   3 Jubilo, "Caballito-sebastian.jpg", CC BY-SA 3.0 (the head's folds
 *     from below);
 *     https://commons.wikimedia.org/wiki/File:Caballito-sebastian.jpg
 *   4 Victormendozad, "El Caballito (The Horse).jpg", CC BY-SA 3.0, and
 *     Susana Colin, "Glorieta de El Caballito, Reforma, Ciudad de
 *     méxico.jpg", CC BY-SA 4.0 (from the west and south-west);
 *     https://commons.wikimedia.org/wiki/File:El_Caballito_(The_Horse).jpg
 *     https://commons.wikimedia.org/wiki/File:Glorieta_de_El_Caballito,_Reforma,_Ciudad_de_m%C3%A9xico.jpg
 * - Dimensions (estimated from photo 2, scaled to OSM's 28 m): base
 *   5.0 m (review round 1: photo 1 shows a tall stone block, not a low
 *   plinth); sculpture about 22 m east-west and 23 m tall on the base;
 *   mane bands r 3.2-5.4, 6.0-8.3, 8.9-11.0 and 11.6-13.3 (drawn units,
 *   x0.96) about the neck's foot, the outer two ending at 156 and 139
 *   degrees; ear tip at 23.4 units; plates 3.6-4.8 m deep.
 *   The thickness (north-south) of the composition is estimated from the
 *   oblique photos: about 7 m overall.
 * - Doubts: no licensed photo shows the north side square on; the
 *   composition is drawn the same from both sides (it is near symmetric
 *   about its mid plane in the oblique views). The base's size is from
 *   photo 1 (about 13 m across the top), smaller than OSM's island.
 * - Terrain: Mapterhorn has no z15 terrain here; flat lake-bed basin.
 * - Colour: the yellow is the identity and stays strongly yellow.
 * - Night: the sculpture is floodlit.
 * - replaces: none (the OSM way is an artwork area, not a building).
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { earcut, offset, save, type XY } from './dc-nmaahc'
import { qf, tf } from './dc-white-house'

const yellow = new Part(), stone = new Part()
const P0 = 5.0 // top of the stone base
const K = 0.96 // the sculpture is drawn 24 units tall, scaled to 23 m on the base
const W = (u: number, y: number, z: number): V3 => [u * K, y * K, z * K + P0]

/**
 * A folded plate: outline `poly` (u east, z up) on the plane y = yc, with
 * inset faces at y = yc +- d, so its sides fold to a crisp mid ridge.
 */
function foldedPlate(p: Part, poly: XY[], yc: number, d: number, inset: number) {
  const area = poly.reduce((s, a, i) => { const b = poly[(i + 1) % poly.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
  const R = area < 0 ? [...poly].reverse() : poly
  const I = offset(R, -inset)
  const P = (q: XY, y: number): V3 => W(q[0], y, q[1])
  for (const s of [-1, 1]) {
    const y = yc + s * d, n: V3 = [0, s, 0]
    for (const [i, j, k] of earcut(I)) tf(p, P(I[i], y), P(I[j], y), P(I[k], y), n)
    for (let i = 0; i < R.length; i++) {
      const j = (i + 1) % R.length
      const a = R[i], b = R[j], ai = I[i], bi = I[j]
      const eu = b[0] - a[0], ez = b[1] - a[1], L = Math.hypot(eu, ez) || 1
      const nn: V3 = [(ez / L) * d, s * inset, (-eu / L) * d]
      qf(p, P(a, yc), P(b, yc), P(bi, y), P(ai, y), nn)
    }
  }
}

/** Points of an annular sector (u,z), centre (cu,cz), angles in degrees a0 -> a1. */
function sector(cu: number, cz: number, r0: number, r1: number, a0: number, a1: number, n: number): XY[] {
  const pts: XY[] = []
  for (let i = 0; i <= n; i++) { const t = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180; pts.push([cu + r1 * Math.cos(t), cz + r1 * Math.sin(t)]) }
  for (let i = n; i >= 0; i--) { const t = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180; pts.push([cu + r0 * Math.cos(t), cz + r0 * Math.sin(t)]) }
  return pts
}

/**
 * A crisp faceted solid: the convex hull of a few points (u, y, z), each
 * face flat. Brute force over triples, fine for the dozen points here.
 */
function hull(p: Part, pts: [number, number, number][]) {
  const P = pts.map(([u, y, z]) => W(u, y, z))
  const c: V3 = [0, 1, 2].map((k) => P.reduce((s, q) => s + q[k], 0) / P.length) as V3
  const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
  const cr = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  const n = P.length
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) {
    let nrm = cr(sub(P[j], P[i]), sub(P[k], P[i]))
    if (Math.hypot(...nrm) < 1e-6) continue
    if (dot(nrm, sub(c, P[i])) > 0) nrm = [-nrm[0], -nrm[1], -nrm[2]]
    let ok = true
    for (let m = 0; m < n && ok; m++) if (m !== i && m !== j && m !== k && dot(nrm, sub(P[m], P[i])) > 1e-6) ok = false
    if (!ok) continue
    // skip a triple that is not a face's own triangle when 4+ points are coplanar
    const cop = P.filter((q, m) => m !== i && m !== j && m !== k && Math.abs(dot(nrm, sub(q, P[i]))) <= 1e-6)
    if (cop.length) continue
    tf(p, P[i], P[j], P[k], nrm)
  }
}

// --- Mane: a fan of four concentric arched bands about the foot of the
// neck, with gaps between them; the inner two land on the base, the outer
// two end in the air, the outermost shortest in sweep.
const mane: [number, number, number, number, number][] = [
  // r0, r1, end angle, mid-plane y, half depth
  [3.2, 5.4, 180, 0.0, 2.4],
  [6.0, 8.3, 180, 0.4, 2.3],
  [8.9, 11.0, 156, 0.8, 2.1],
  [11.6, 13.3, 139, 1.2, 1.8],
]
for (const [r0, r1, a1, yc, d] of mane) foldedPlate(yellow, sector(0.5, 0, r0, r1, 90, a1, 20), yc, d, 0.35)

// --- Neck ribbon: a vertical band rising behind the mane and curling east
// over the top, a folded plate.
{
  const N = 10
  const pts: XY[] = [[0.0, 0], [3.2, 0], [3.2, 15.2]]
  for (let i = 0; i <= N; i++) { const t = Math.PI - (Math.PI / 2) * (i / N); pts.push([6.6 + 3.4 * Math.cos(t), 15.2 + 3.6 * Math.sin(t)]) }
  for (let i = N; i >= 0; i--) { const t = Math.PI - (Math.PI / 2) * (i / N); pts.push([6.6 + 6.6 * Math.cos(t), 15.2 + 6.6 * Math.sin(t)]) }
  pts.splice(pts.length - 1, 1)
  pts.push([0.0, 15.2])
  foldedPlate(yellow, pts, 0.6, 2.2, 0.45)
}

// --- Neck column: a tall faceted spike with a vertical crease at its
// front, its facets meeting at the apex A under the head.
const A: [number, number, number] = [6.4, -0.8, 19.6]
hull(yellow, [[2.6, -2.8, 0], [6.0, -4.4, 0], [9.8, -2.2, 0], [9.6, 2.6, 0], [2.8, 3.0, 0], A, [3.2, -1.6, 15.0], [3.4, -0.8, 18.4]])

// --- Head: a cluster of folded facets fanning from A: the ear spike up to
// the top, the muzzle wedge east, the creased jaw below.
hull(yellow, [A, [5.0, 0.2, 21.6], [7.0, -2.8, 21.4], [7.6, 2.5, 21.2], [9.8, -0.8, 23.4], [10.6, 0.4, 21.8]])
hull(yellow, [A, [7.4, -2.6, 20.4], [8.0, 2.2, 20.2], [13.2, -0.6, 18.6], [12.6, -0.2, 17.0], [9.6, 0.6, 21.4]])
hull(yellow, [A, [12.6, -0.2, 17.0], [9.0, -2.0, 15.2], [9.0, 1.8, 15.4], [6.6, 0.2, 15.6]])

// --- Base: a tall battered block of dark grey stone (photo 1), hexagonal
// like the OSM island it stands in.
{
  const hex = (r: number, z: number): V3[] => Array.from({ length: 6 }, (_, i) => {
    const t = ((i * 60 + 30) * Math.PI) / 180
    return [r * Math.cos(t), r * Math.sin(t), z] as V3
  })
  const b = hex(7.8, 0), t = hex(7.0, P0 - 0.35), t2 = hex(6.7, P0)
  stone.loft([b, t, t2])
  stone.cap(t2, true)
}

const lit = (_p: V3, n: V3) => (n[2] > 0.8 ? 0.4 : 0.95)
await save('mexico-city-el-caballito', 'El Caballito', [
  { part: yellow, material: { ...finish('caballito-yellow', 0xefbf26, 0.55), floodlight: lit } as any },
  { part: stone, material: { ...finish('caballito-base-stone', 0x77746f), floodlight: (_p: V3, n: V3) => (n[2] > 0.8 ? 0 : 0.35) } as any },
], { name: 'El Caballito' }, 5000)
