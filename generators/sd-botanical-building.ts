/**
 * The Botanical Building, Balboa Park, San Diego. Carleton Winslow with
 * Thomas B. Hunter, 1915, for the Panama-California Exposition: a redwood
 * lath conservatory on a steel frame (from a Santa Fe railway station
 * shed), a domed rotunda between two long barrel-vaulted wings, behind the
 * Lily Pond. The lath was replaced in 2002 and 2017 on the same form.
 *
 * Frame: bearing 0 (the wings run due east–west). +x east, +y north, z up,
 * metres; origin at the anchor -117.14923, 32.73251 (0.6 m from the
 * outline's area centroid). z = 0 is the ground round the building (lidar
 * 7.0 m above the box's ground_min, which is in the pond).
 *
 * Replaces: the outline way/25775425 (building=greenhouse) and its parts:
 * the rotunda roof way/1146822818, the wings way/1573861954 and
 * way/1573861955, the front pavilions way/1573861942 and way/1573861943,
 * and the north annex parts way/1573861944 and way/1573861945. The pond is
 * the map's and is not drawn.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): the outline (72.4 × 28 m) and parts.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), 0.5 m grid:
 *   wing crest 13.5 m, wing section a semicircle of r ≈ 9 m on near-vertical
 *   sides (fitted to the crest and the 9 m reading at 7.5 m off the axis);
 *   dome crown 17.8, the dome's edge 14–15 at 8.5 m out; lantern top 21.8;
 *   front pavilions 8.4; north annex 5.5 (all measured).
 * - USGS NAIP orthophoto: plan, the brown lath.
 * - Published: Wikipedia "Botanical Building": 250 × 75 ft, 60 ft high
 *   (the dome; lidar 17.8 m + lantern), lath, 1915, Winslow / Hunter.
 * Photos (evidence, Wikimedia Commons):
 * - "Balboa Park Botanical Building 02.jpg", Bernard Gagnon, CC BY-SA 3.0
 *   (south front across the pond): https://commons.wikimedia.org/wiki/File:Balboa_Park_Botanical_Building_02.jpg
 * - "Balboa Park Botanical Building 04.jpg", Bernard Gagnon, CC BY-SA 3.0
 *   (from the south-east): https://commons.wikimedia.org/wiki/File:Balboa_Park_Botanical_Building_04.jpg
 * - "Balboa Park Botanical Building Exterior 02.jpg", GualdimG, CC BY-SA 4.0
 *   (east wing from the south-east): https://commons.wikimedia.org/wiki/File:Balboa_Park_Botanical_Building_Exterior_02.jpg
 * - "Balboa Park Botanical Building - DSC06789.JPG", Daderot, CC0
 *   (front pavilions and arcade): https://commons.wikimedia.org/wiki/File:Balboa_Park_Botanical_Building_-_DSC06789.JPG
 * - "Balboa park botanical building summer 2022.jpg", Librarybell, CC0
 *   (colour of the restored lath): https://commons.wikimedia.org/wiki/File:Balboa_park_botanical_building_summer_2022.jpg
 * - "Balboa Park Gardens, night.jpg", ArthurDeCosta, CC BY-SA 4.0 (night:
 *   the great arch glows from inside, the wings are floodlit, and the
 *   proportions of arch, base and dome in a frontal view):
 *   https://commons.wikimedia.org/wiki/File:Balboa_Park_Gardens,_night.jpg
 *
 * Numbers
 * - Front stucco base to 6.7, the great arch springing at 6.9: inner lath
 *   lunette r 6.4, archivolt to r 8.5 (top 15.4) — scaled from the frontal
 *   night photo against the lidar wing crest (estimated).
 * - Three arched openings 3.6 m wide in the base, pavilion doors — scaled
 *   from the same photo and Gagnon 02 (estimated).
 * - Wing rib spacing 4.6 m (six bays a wing) and the dome's 16 radial ribs,
 *   counted from Gagnon 02 and GualdimG 02 (estimated).
 * - Lath colour: the restored redwood's warm brown from the 2018–2022
 *   photos, pulled to the palette's lightness; the darker see-through lath
 *   of the great arch and the arcade, a darker brown.
 *
 * Simplified / doubts
 * - The lath itself is a flat brown surface. Its lattice is drawn as raised
 *   ribs across each bay and four lighter bands along each wing, so it reads
 *   as a grid of big cells at phone size rather than a fine texture.
 * - The north side and the annex behind the rotunda are drawn from lidar
 *   only (a flat 5.5 m block); no photo shows them.
 * - The wing ends are plain semicircular lath walls; no photo shows one
 *   closely.
 * - The balustrade, urns and planters round the pond are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, rect, cylinder } from './dc-white-house'
import {
  BP_STUCCO, archPoly, faceAt, facePoly, faceSlab, ngon, orientTo, patternDome, ringPrism, saveModel, southFace, northFace, type XY,
} from './sd-california-tower'

const LATH = finish('botanical-lath', 0x96684f)
const RIB = finish('botanical-lath-rib', 0xb38c71)
/** The see-through lath of the great arch and the arcade: dark by day, lit from inside at night. */
const SCREEN = finish('window', 0x5d4a3e, 0.6)

function build() {
  const stucco = new Part(), lath = new Part(), rib = new Part(), screen = new Part(), patina = new Part()

  // ---- Wing section: vertical sides to SPRING, then a semicircle (lidar).
  const YC = -0.75, HW = 9.0, SPRING = 4.5
  type P = { s: number; z: number; n: XY }
  const prof: P[] = [{ s: -HW, z: 0, n: [-1, 0] }]
  const SEG = 14
  for (let k = 0; k <= SEG; k++) {
    const t = Math.PI - (Math.PI * k) / SEG
    prof.push({ s: HW * Math.cos(t), z: SPRING + HW * Math.sin(t), n: [Math.cos(t), Math.sin(t)] })
  }
  prof.push({ s: HW, z: 0, n: [1, 0] })
  const at = (s: number, z: number, x: number, off = 0, n: XY = [0, 0]): V3 => [x, YC + s + n[0] * off, z + n[1] * off]
  /** The wing surface between x0 and x1, offset `off` outward (for ribs). */
  const sweep = (p: Part, x0: number, x1: number, off = 0) => {
    for (let k = 0; k < prof.length - 1; k++) {
      const A = prof[k], B = prof[k + 1]
      if (A.z === B.z && A.z === 0) continue
      const nA: V3 = [0, A.n[0], A.n[1]], nB: V3 = [0, B.n[0], B.n[1]]
      const flat = k === 0 || k === prof.length - 2
      const a0 = at(A.s, A.z, x0, off, A.n), b0 = at(B.s, B.z, x0, off, B.n), b1 = at(B.s, B.z, x1, off, B.n), a1 = at(A.s, A.z, x1, off, A.n)
      if (flat) orientTo(p, [a0, b0, b1, a1], nA)
      else {
        p.tri(a0, b0, b1, undefined, undefined, undefined, [nA, nB, nB])
        p.tri(a0, b1, a1, undefined, undefined, undefined, [nA, nB, nA])
      }
    }
  }
  /** A raised rib band across the wing at x, w wide, proud by d. */
  const ribBand = (x: number, w: number, d: number) => {
    sweep(rib, x - w / 2, x + w / 2, d)
    for (const [xx, sx] of [[x - w / 2, -1], [x + w / 2, 1]] as [number, number][])
      for (let k = 0; k < prof.length - 1; k++) {
        const A = prof[k], B = prof[k + 1]
        orientTo(rib, [at(A.s, A.z, xx), at(B.s, B.z, xx), at(B.s, B.z, xx, d, B.n), at(A.s, A.z, xx, d, A.n)], [sx, 0, 0])
      }
  }
  /** A raised band along the wing at profile parameter t (radians from the top), x0..x1. */
  const purlin = (t: number, x0: number, x1: number, w = 0.45, d = 0.1) => {
    const c = Math.PI / 2 + t
    const mk = (tt: number, off: number): V3 => [0, YC + (HW + off) * Math.cos(tt), SPRING + (HW + off) * Math.sin(tt)]
    const dt = w / 2 / HW
    const q0 = mk(c - dt, 0), q1 = mk(c - dt, d), q2 = mk(c + dt, d), q3 = mk(c + dt, 0)
    const n: V3 = [0, Math.cos(c), Math.sin(c)]
    const X = (v: V3, x: number): V3 => [x, v[1], v[2]]
    orientTo(rib, [X(q1, x0), X(q2, x0), X(q2, x1), X(q1, x1)], n)
    orientTo(rib, [X(q0, x0), X(q1, x0), X(q1, x1), X(q0, x1)], [0, Math.cos(c - Math.PI / 2), Math.sin(c - Math.PI / 2)])
    orientTo(rib, [X(q3, x0), X(q2, x0), X(q2, x1), X(q3, x1)], [0, Math.cos(c + Math.PI / 2), Math.sin(c + Math.PI / 2)])
    // ends
    orientTo(rib, [X(q0, x0), X(q1, x0), X(q2, x0), X(q3, x0)], [-1, 0, 0])
    orientTo(rib, [X(q0, x1), X(q1, x1), X(q2, x1), X(q3, x1)], [1, 0, 0])
  }
  /** The flat semicircular end wall at x, facing sx. */
  const endWall = (x: number, sx: number) => {
    const poly: V3[] = prof.map((P) => at(P.s, P.z, x))
    for (let k = 1; k < poly.length - 1; k++) orientTo(lath, [poly[0], poly[k], poly[k + 1]], [sx, 0, 0])
    // a raised frame round it
    for (let k = 1; k < prof.length - 2; k++) {
      const A = prof[k], B = prof[k + 1]
      const ia = at(A.s * 0.93, SPRING + (A.z - SPRING) * 0.93, x + sx * 0.12), ib = at(B.s * 0.93, SPRING + (B.z - SPRING) * 0.93, x + sx * 0.12)
      const oa = at(A.s, A.z, x + sx * 0.12), ob = at(B.s, B.z, x + sx * 0.12)
      orientTo(rib, [oa, ob, ib, ia], [sx, 0, 0])
    }
  }

  const ROT = { x0: -8.7, x1: 8.1, y0: -9.6, y1: 8.1 }
  const CX = (ROT.x0 + ROT.x1) / 2, CY = -0.8
  const WINGS: [number, number, number][] = [[ROT.x1, 35.8, 1], [-36.6, ROT.x0, -1]]
  for (const [x0, x1, sx] of WINGS) {
    sweep(lath, x0, x1)
    const outer = sx > 0 ? x1 : x0
    endWall(outer, sx)
    const L = x1 - x0, bays = 6, step = L / bays
    for (let i = 1; i < bays; i++) ribBand(x0 + i * step, 0.55, 0.22)
    ribBand(outer - sx * 0.35, 0.7, 0.26)
    for (const t of [-1.15, -0.45, 0.45, 1.15]) purlin(t, x0, x1)
    // a low stucco plinth along the foot of each wing
    for (const y of [YC - HW, YC + HW]) cbox(stucco, rect(x0, x1, y - 0.25, y + 0.25), 0, 0.6, { top: true })
  }

  // ---- The rotunda: a 16-sided lath drum, a shallow ribbed dome, the lantern.
  ringPrism(lath, ngon(CX, CY, 9.1, 16, Math.PI / 16), 0, 12.6, false)
  // spherical cap from r 9.3 at 12.6 to the crown at 17.8 (lidar)
  const RS = (9.3 * 9.3 + 5.2 * 5.2) / (2 * 5.2), ZC = 17.8 - RS
  const domeProf: XY[] = Array.from({ length: 7 }, (_, k) => {
    const r = 9.3 * (1 - k / 6)
    return [r, ZC + Math.sqrt(RS * RS - r * r)] as XY
  })
  patternDome(CX, CY, domeProf, 48, (c, r) => (c % 3 === 0 || r === 3 ? rib : lath), Math.PI / 16)

  // ---- The great arches, south and north: a dark lath lunette in a broad archivolt.
  const AW = 6.4, AO = 8.5, AS = 6.9
  for (const [F, side] of [[southFace(ROT.y0), 1], [northFace(ROT.y1), -1]] as [ReturnType<typeof faceAt>, number][]) {
    const uc = side > 0 ? CX : -CX
    // the screen wall the arch is set in, up to the arch's springing
    faceSlab(lath, F, archPoly(uc, AO * 2, AS - 0.2, AS), -0.3, 0.3)
    facePoly(screen, F, archPoly(uc, AW * 2, AS, AS, 12), 0.34)
    // archivolt: a ring of quads between r = AW and AO, proud
    const ring: XY[] = []
    for (let k = 0; k <= 12; k++) { const t = (Math.PI * k) / 12; ring.push([Math.cos(t), Math.sin(t)]) }
    const poly: XY[] = [...ring.map(([c, s]) => [uc + AO * c, AS + AO * s] as XY), ...ring.slice().reverse().map(([c, s]) => [uc + AW * c, AS + AW * s] as XY)]
    faceSlab(lath, F, poly, 0.2, 0.55)
    // rib frame on the archivolt's outer edge and its vertical mullions in the lunette
    const edge: XY[] = [...ring.map(([c, s]) => [uc + (AO + 0.05) * c, AS + (AO + 0.05) * s] as XY), ...ring.slice().reverse().map(([c, s]) => [uc + (AO - 0.6) * c, AS + (AO - 0.6) * s] as XY)]
    facePoly(rib, F, edge, 0.58)
    for (const du of [-4.2, -2.1, 0, 2.1, 4.2]) {
      const h = Math.sqrt(AW * AW - du * du)
      facePoly(rib, F, [[uc + du - 0.14, AS], [uc + du + 0.14, AS], [uc + du + 0.14, AS + h - 0.2], [uc + du - 0.14, AS + h - 0.2]], 0.38)
    }
    facePoly(rib, F, [[uc - AW, AS + 2.9], [uc + AW, AS + 2.9], [uc + AW * 0.98, AS + 3.25], [uc - AW * 0.98, AS + 3.25]], 0.38)
  }

  // ---- Front: stucco arcade base and the two domed pavilions.
  const BASE = rect(ROT.x0, ROT.x1, -14.3, ROT.y0)
  cbox(stucco, BASE, 0, 6.7, { b: 0.3, top: lath })
  cbox(stucco, rect(BASE.x0 - 0.15, BASE.x1 + 0.15, BASE.y0 - 0.15, BASE.y1), 6.1, 6.7, { b: 0.15, bottom: true, top: false })
  const SF = southFace(BASE.y0)
  for (const du of [-5.4, 0, 5.4]) {
    facePoly(screen, SF, archPoly(CX + du, 3.6, 0.6, 3.9, 10), 0.05)
    faceSlab(stucco, SF, [[CX + du - 2.05, 3.7], [CX + du + 2.05, 3.7], [CX + du + 2.05, 3.9], [CX + du - 2.05, 3.9]], 0, 0.15)
  }
  for (const [px0, px1] of [[8.1, 12.9], [-13.5, -8.7]]) {
    const pr = rect(px0, px1, -14.45, -8.9)
    cbox(stucco, pr, 0, 7.0, { c: 0.15, top: false })
    const pcx = (px0 + px1) / 2, pcy = (pr.y0 + pr.y1) / 2, hw = (px1 - px0) / 2
    // rounded "beehive" cap on the square: a 4-sided lathe turned 45°
    const k = Math.SQRT2
    patternDome(pcx, pcy, [[hw * k, 7.0], [hw * k * 0.92, 7.6], [hw * k * 0.7, 8.1], [hw * k * 0.35, 8.4], [0, 8.5]], 4, () => stucco, Math.PI / 4)
    facePoly(screen, southFace(pr.y0), archPoly(pcx, 2.0, 0.3, 3.4, 8), 0.05)
    const sideF = px0 > 0 ? faceAt(px1, 0, 90) : faceAt(px0, 0, 270)
    facePoly(screen, sideF, archPoly(px0 > 0 ? -pcy : pcy, 1.8, 0.3, 3.3, 8), 0.05)
  }

  // ---- North annex (lidar 5.5 m, flat).
  cbox(stucco, rect(-16.9, 16.2, ROT.y1 - 0.5, 13.1), 0, 5.5, { b: 0.25, top: lath })
  cbox(stucco, rect(-8.8, 8.0, 13.1, 13.5), 0, 5.5, { b: 0.25, top: lath })

  // ---- Lantern on the crown: open octagon on posts, a green cupola, finial.
  const LZ = 17.6
  lathe8(stucco, CX, CY, [[1.9, LZ - 0.1], [1.9, LZ + 0.3], [0.01, LZ + 0.3]])
  cylinder(screen, CX, CY, 1.05, LZ + 0.3, LZ + 2.2, 8)
  for (const [x, y] of ngon(CX, CY, 1.5, 8, Math.PI / 8)) cylinder(rib, x, y, 0.13, LZ + 0.3, LZ + 2.2, 6)
  lathe8(rib, CX, CY, [[1.85, LZ + 2.2], [1.85, LZ + 2.55], [0.01, LZ + 2.55]])
  patternDome(CX, CY, [[1.55, LZ + 2.55], [1.45, LZ + 3.2], [1.1, LZ + 3.75], [0.55, LZ + 4.05], [0.01, LZ + 4.1]], 12, () => patina)
  patternDome(CX, CY, [[0.25, LZ + 4.0], [0.2, LZ + 4.5], [0.08, LZ + 4.7], [0.02, LZ + 5.0]], 6, () => rib)
  // four spikes round the lantern's foot
  for (const [x, y] of ngon(CX, CY, 2.6, 4, Math.PI / 4)) patternDome(x, y, [[0.22, LZ - 0.6], [0.16, LZ + 0.6], [0.01, LZ + 1.3]], 4, () => rib)

  function lathe8(p: Part, cx: number, cy: number, prof: XY[]) { patternDome(cx, cy, prof, 8, () => p, Math.PI / 8) }

  // ---- Night: the great arch glows (window); the wings and dome are floodlit softly.
  const lit = (q: V3, n: V3) => (n[2] > 0.8 ? 0.2 : q[1] < -5 ? 0.6 : 0.45)
  return [
    { part: stucco, material: { ...BP_STUCCO, floodlight: lit } },
    { part: lath, material: { ...LATH, floodlight: lit } },
    { part: rib, material: { ...RIB, floodlight: lit } },
    { part: screen, material: SCREEN },
    { part: patina, material: PALETTE.patina },
  ]
}

if (import.meta.main) await saveModel('sd-botanical-building', 'Botanical Building', build())
