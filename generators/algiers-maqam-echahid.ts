/**
 * Maqam Echahid, the Martyrs' Memorial (Bashir Yellès and Marian
 * Konieczny, 1982), on the heights of El Madania over Algiers: original
 * procedural geometry, CC0-1.0, no textures.
 *   bun generators/algiers-maqam-echahid.ts
 *
 * Map frame: x east, y north, z up, metres. Anchor = the OSM monument node
 * (lng 3.06973, lat 36.74571), at the centre where the three leaves meet.
 * Bearing 0.
 *
 * Identity, in order: three tall concrete palm leaves, each a curved blade
 * that sweeps out low across the platform at its foot and rises to a thin
 * tip at 92 m; the drum held between them near the top with its spire;
 * the bronze soldier at the foot of each leaf; the eternal flame under
 * them; the round platform.
 *
 * Evidence
 *  - Plan: OSM way/1271711154 (building, height 92; the three leaves'
 *    footprint, a three-bladed curve) and way/247632875 (historic=
 *    memorial, the same outline); the platform is OSM way/370342095 (a
 *    circle of radius 43 m round the leaves); the statues stand at the
 *    three tourism=artwork nodes at the leaves' tips ((-8, 40), (-31, -28),
 *    (39, -14) here). Each leaf is drawn as a thin blade (2.4 m thick at
 *    the foot, 1.6 m at the top; faces turned to the axis in a shade tone)
 *    cupped round the axis with a crease down its outer face, swept along
 *    a spine from a long low tip on the platform 38 m out, rising steeply
 *    to about 10 m off the axis at mid-height and splaying out at its top
 *    beside the drum. Across the face it is broad: 18-22 m over most of
 *    its height, held to the arc left between the three leaves less a
 *    slot, so the gaps are tall pointed slots, widest at the foot, closing
 *    to about a metre at two-thirds height and opening again to about 8 m
 *    round the drum near the top (a3, a5, a11). Read from the photos; the
 *    OSM footprint fixes the three directions and the reach of the feet.
 *  - Heights: 92 m to the tips of the leaves (OSM, published). The central
 *    column (6 m across, white, with a stack of small windows) up to the
 *    drum at 61-71 m with its band of windows, the small cupola over it,
 *    and the three-legged lattice mast to about 114 m over the lowest
 *    ground, are ESTIMATED from a7 and a11. Statues 6 m on 2.4 m
 *    pedestals (estimated from a3 and a8). Platform 4.6 m over the lowest
 *    ground, its edge a plain wall (a8, a11; steps are left out, as the
 *    uphill side buries them; the map's terrain here is only z12
 *    and includes the monument).
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    a1 "Maqam Echahid Algiers.jpg", CC BY 2.0 (from the south road)
 *      https://commons.wikimedia.org/wiki/File:Maqam_Echahid_Algiers.jpg
 *    a2 Riad Salih, "Maqam Echahid la nuit, Alger.jpg", CC BY-SA 4.0 (night, from under the leaves)
 *      https://commons.wikimedia.org/wiki/File:Maqam_Echahid_la_nuit,_Alger.jpg
 *    a3 Poudou99, "Alger Memorial-du-Martyr IMG 1160.JPG", CC BY 3.0 (a leaf's foot, a soldier, the arch between leaves)
 *      https://commons.wikimedia.org/wiki/File:Alger_Memorial-du-Martyr_IMG_1160.JPG
 *    a5 Mouh2jijel, "Alger Memorial-du-Martyr 2.jpg", CC BY-SA 3.0 (side: the leaf's sweep)
 *      https://commons.wikimedia.org/wiki/File:Alger_Memorial-du-Martyr_2.jpg
 *    a7 Boumediene15, "Martyrs Memorial. Algiers, Algeria.jpg", CC BY-SA 3.0 (the drum and spire)
 *      https://commons.wikimedia.org/wiki/File:Martyrs_Memorial._Algiers,_Algeria.jpg
 *    a8 Simona from Rome, "Monument of the Martyrs closeup.jpg", CC BY 2.0 (foot, statue, steps)
 *      https://commons.wikimedia.org/wiki/File:Monument_of_the_Martyrs_closeup.jpg
 *    a10 Habib kaki, "Ryadh El Feth رياض الفتح.jpg", CC0 (from the esplanade)
 *      https://commons.wikimedia.org/wiki/File:Ryadh_El_Feth_رياض_الفتح.jpg
 *    a11 Mehnimalik, "Martyrs Memorial Algiers.jpg", CC BY-SA 2.0 (from the stairs, the drum)
 *      https://commons.wikimedia.org/wiki/File:Martyrs_Memorial_Algiers.jpg
 *  - Colours: board-marked concrete, sunlit #d6cfc2 (a1, a5), warmer at
 *    evening (a7, a10); drawn #ddd6c8, and #b3ab9c on the faces turned
 *    in toward the axis, which stand in shade (a3, a11). Bronze statues drawn #7d6b58,
 *    pulled light. Night: floodlit (a2, a6), with the flame lit.
 *  No look-only sources. No commercial imagery. No lidar exists here.
 *
 * Invented or simplified: the leaves' curvature is a smooth stand-in for
 * the real folded shells; the three soldiers are one figure, turned; the
 * crypt and museum under the platform are not drawn. Doubts: the drum's
 * height and the platform's real level against the street.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY } from './chi-aon-center'
import { face } from './phl-independence-hall'
import { polyTris, beam } from './berlin-oberbaum-bridge'
import { cyl, writeModel, type Slot } from './pretoria-union-buildings'

const ID = 'algiers-maqam-echahid'
const NAME = 'Maqam Echahid'
const ANCHOR: [number, number] = [3.06973, 36.74571]
const BEARING = 0

/** The north leaf's footprint (OSM way/1271711154), from one junction round its tip to the other, then the centre. */
const LEAF: XY[] = [[4.3, 4.8], [7.0, 9.0], [8.2, 14.1], [7.2, 21.7], [4.6, 27.9], [1.2, 31.5], [-4.7, 35.8], [-5.4, 40.9], [-10.9, 39.6], [-10.2, 35.1], [-13.2, 29.6], [-14.4, 24.6], [-15.2, 19.0], [-15.1, 14.9], [-13.1, 10.3], [-10.3, 7.0], [-6.6, 3.2], [0, 0.6]]
const AXIS = Math.atan2(40.3, -8.2) // the north leaf's tip direction
const STATUES: XY[] = [[-8, 40], [-31, -28], [39, -14]]

/** Sections up the leaf: z, inner radius, outer radius, tangential scale. */
const PROFILE: [number, number, number, number][] = [
  [0, 7, 41, 0.6], [3, 6.5, 31, 0.5], [9, 6.0, 22, 0.42], [18, 5.5, 15.5, 0.36], [30, 5.0, 11.8, 0.42],
  [45, 4.6, 9.8, 0.44], [60, 4.4, 8.8, 0.4], [72, 4.2, 8.2, 0.37], [82, 3.9, 7.6, 0.33], [88, 3.7, 7.0, 0.28], [92, 3.6, 5.2, 0.22],
]
const PT = 4.6

/**
 * The leaf's spine at u (0 at the tip on the platform, 1 at the top): its
 * distance from the axis, height, width across, thickness, and how much the
 * thickness lies flat (1 where the foot runs along the platform).
 */
function spine(u: number) {
  const r = 6.2 + 32 * Math.pow(1 - u, 3.2) + 2 * Math.pow(u, 7)
  const z = 88 * Math.pow(u, 1.12) + (u > 0.93 ? (u - 0.93) * 50 : 0)
  // broad across the face: up to 22 m, held to the arc left between the three leaves less a slot
  // that is wide at the foot and closes to about a metre near the top (a5, a11)
  const target = u < 0.05 ? 5 + (u / 0.05) * 13 : u < 0.12 ? 18 + ((u - 0.05) / 0.07) * 4 : u < 0.6 ? 22 : 22 - 10 * ((u - 0.6) / 0.4)
  // ...and opens again near the top, where the drum stands in the slot (a11)
  const k = Math.max(0, Math.min(1, (u - 0.55) / 0.2)), slot = 1.2 + 30 * Math.pow(1 - u, 4) + 7.5 * k * k * (3 - 2 * k)
  const w = Math.min(target, (2 * Math.PI * r) / 3 - slot)
  const t = 1.6 + 0.8 * (1 - u)
  const lie = Math.max(0, 1 - u / 0.15)
  return { r, z, w: Math.max(w, 3.5), t, lie }
}
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

function build(detail: boolean): Slot[] {
  const concrete = new Part(), bronze = new Part(), paving = new Part(), win = new Part(), lamp = new Part(), inner = new Part()

  // --- the platform: a round terrace with a coping
  const SEGP = detail ? 48 : 32
  for (const [r, z0, z1] of [[42.4, 0, PT]] as [number, number, number][]) {
    cyl(paving, 0, 0, r, z0, z1, SEGP, true)
  }

  // --- the leaves: thin curved blades. Each is a shell cupped round the axis,
  // swept along a spine that runs from a long low tip on the platform up to
  // its top beside the drum, where it splays out a little (a5, a11).
  const NU = detail ? 36 : 16, NV = detail ? 8 : 4
  for (const turn of [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3]) {
    const outer: V3[][] = [], innerS: V3[][] = []
    for (let a = 0; a <= NU; a++) {
      const u = a / NU
      const g = spine(u), th0 = AXIS + turn - 0.18 * u
      const row: V3[] = [], rowI: V3[] = []
      for (let b = 0; b <= NV; b++) {
        const v = b / NV - 0.5
        const r = g.r, half = g.w / 2
        const th = th0 + (v * 2 * half) / Math.max(r, 1)
        // a crease down the middle of the outer face (a3)
        const crease = g.t * 0.5 * (1 - Math.abs(v) * 2)
        const ro = r + crease, ri = r - g.t
        row.push([ro * Math.cos(th), ro * Math.sin(th), PT + g.z])
        rowI.push([ri * Math.cos(th), ri * Math.sin(th), PT + g.z + g.t * g.lie])
      }
      outer.push(row); innerS.push(rowI)
    }
    const quad = (p: Part, A: V3, B: V3, C: V3, D: V3, want: V3) => {
      const n = cross3(sub3(B, A), sub3(D, A))
      if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] < 0) { p.tri(A, D, C); p.tri(A, C, B) } else { p.tri(A, B, C); p.tri(A, C, D) }
    }
    for (let a = 0; a < NU; a++) for (let b = 0; b < NV; b++) {
      const A = outer[a][b], B = outer[a][b + 1], C = outer[a + 1][b + 1], D = outer[a + 1][b]
      const m: V3 = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2, 0]
      quad(concrete, A, B, C, D, [m[0], m[1], 0.4])
      const Ai = innerS[a][b], Bi = innerS[a][b + 1], Ci = innerS[a + 1][b + 1], Di = innerS[a + 1][b]
      quad(inner, Ai, Bi, Ci, Di, [-m[0], -m[1], -0.2])
    }
    // the blade's two long edges and its top
    for (let a = 0; a < NU; a++) for (const b of [0, NV]) {
      const A = outer[a][b], D = outer[a + 1][b], Ai = innerS[a][b], Di = innerS[a + 1][b]
      const th = AXIS + turn + (b === 0 ? -1 : 1) * 1.2
      quad(concrete, A, D, Di, Ai, [Math.cos(th), Math.sin(th), 0])
    }
    for (let b = 0; b < NV; b++) {
      const A = outer[NU][b], B = outer[NU][b + 1], Ai = innerS[NU][b], Bi = innerS[NU][b + 1]
      quad(concrete, A, B, Bi, Ai, [0, 0, 1])
    }
  }
  // the central column between the leaves, white, with its stack of small windows, up to the drum (a11, a7)
  const SEG = detail ? 16 : 10
  cyl(concrete, 0, 0, 3.0, PT, PT + 56, SEG, false)
  for (let f = 0; f < 4; f++) {
    const a = AXIS + Math.PI / 3 + (f * Math.PI) / 2, n: V3 = [Math.cos(a), Math.sin(a), 0], t: V3 = [-Math.sin(a), Math.cos(a), 0]
    for (let z = PT + 8; z < PT + 54; z += detail ? 3.2 : 4.8) {
      const P = (s: number, h: number): V3 => [n[0] * 3.04 + t[0] * s, n[1] * 3.04 + t[1] * s, h]
      face(win, [P(-0.55, z), P(0.55, z), P(0.55, z + 1.6), P(-0.55, z + 1.6)], n)
    }
  }
  // the drum: a wider ring with its band of windows, then the small cupola
  cyl(concrete, 0, 0, 3.0, PT + 56, PT + 57.5, SEG, false, true, 3.9)
  cyl(concrete, 0, 0, 3.9, PT + 57.5, PT + 66, SEG, false)
  for (let k = 0; k < (detail ? 12 : 8); k++) {
    const n8 = detail ? 12 : 8, a0 = (k / n8) * 2 * Math.PI, a1 = a0 + ((Math.PI * 2) / n8) * 0.5
    const P = (a: number, z: number): V3 => [3.94 * Math.cos(a), 3.94 * Math.sin(a), z]
    face(win, [P(a0, PT + 60), P(a1, PT + 60), P(a1, PT + 63.5), P(a0, PT + 63.5)], [Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2), 0])
  }
  cyl(concrete, 0, 0, 4.2, PT + 66, PT + 66.8, SEG, false, true)
  {
    const prof: [number, number][] = []
    const K = detail ? 6 : 4
    for (let i = 0; i <= K; i++) { const a = (i / K) * Math.PI / 2; prof.push([3.8 * Math.cos(a), PT + 66.8 + 4.6 * Math.sin(a)]) }
    for (let i = 0; i < K; i++) cyl(concrete, 0, 0, prof[i][0], prof[i][1], prof[i + 1][1], SEG, i === K - 1, false, Math.max(prof[i + 1][0], 0.6))
  }
  cyl(concrete, 0, 0, 0.6, PT + 71.4, PT + 76, 8, false)
  // the lattice mast over the drum: three legs drawing together, braced, to about 114 m (a7, a11)
  {
    const z0 = PT + 76, z1 = PT + 107.5, legs = [0, 2.094, 4.189].map((a) => a + 0.5)
    const at = (a: number, z: number): V3 => { const r = 1.3 - (1.1 * (z - z0)) / (z1 - z0); return [r * Math.cos(a), r * Math.sin(a), z] }
    for (const a of legs) beam(concrete, at(a, z0), at(a, z1), 0.28, [0, 0, 1], true, 0.28)
    const rungs = detail ? 10 : 5
    for (let k = 0; k <= rungs; k++) {
      const z = z0 + ((z1 - z0) * k) / rungs
      for (let q = 0; q < 3; q++) beam(concrete, at(legs[q], z), at(legs[(q + 1) % 3], z), 0.18, [0, 0, 1], false, 0.18)
      if (detail && k < rungs) for (let q = 0; q < 3; q++) beam(concrete, at(legs[q], z), at(legs[(q + 1) % 3], z + (z1 - z0) / rungs), 0.12, [0, 0, 1], false, 0.12)
    }
    cyl(concrete, 0, 0, 0.12, z1, z1 + 2.5, 6, true, false, 0.03)
  }

  // --- the eternal flame under the leaves
  cyl(paving, 0, 0, 1.4, PT, PT + 0.9, 12, true)
  cyl(lamp, 0, 0, 0.55, PT + 0.9, PT + 2.4, 8, true, false, 0.05)

  // --- the soldiers, each on a pedestal at a leaf's tip, facing out
  for (const [sx, sy] of STATUES) soldier(bronze, paving, sx, sy, Math.atan2(sy, sx), detail)

  const flood = (_p: V3, n: V3) => (n[2] > 0.8 ? 0.3 : 0.95)
  return [
    { part: concrete, material: { ...finish('maqam-concrete', 0xddd6c8), floodlight: flood } },
    { part: bronze, material: finish('maqam-bronze', 0x7d6b58) },
    { part: paving, material: finish('maqam-platform', 0xcbc3b4) },
    { part: win, material: PALETTE.window },
    { part: lamp, material: finish('lamp-flame', 0xe0a050) },
    { part: inner, material: { ...finish('maqam-concrete-shade', 0xb3ab9c), floodlight: () => 0.7 } },
  ]
}

/** A standing soldier, 6 m, on a 2.4 m pedestal at (x, y), facing angle f. */
function soldier(p: Part, ped: Part, x: number, y: number, f: number, detail: boolean) {
  const z0 = PT + 2.4
  cyl(ped, x, y, 1.6, PT, z0, 4, true, false, 1.5)
  const c = Math.cos(f), s = Math.sin(f)
  // local: u forward (out from the monument), v to the figure's left, z up
  const L = (u: number, v: number, z: number): V3 => [x + u * c - v * s, y + u * s + v * c, z0 + z]
  const seg = detail ? 8 : 5
  const limb = (a: V3, b: V3, w: number) => beam(p, a, b, w, [0, 0, 1], true, w)
  // legs, slightly apart
  limb(L(0, 0.35, 0), L(0.1, 0.32, 2.7), 0.6)
  limb(L(0, -0.35, 0), L(-0.1, -0.32, 2.7), 0.6)
  // torso, a tapered column, and the head
  cyl(p, x, y, 0.62, z0 + 2.5, z0 + 4.6, seg, false, false, 0.72)
  cyl(p, x, y, 0.72, z0 + 4.6, z0 + 4.9, seg, true, false, 0.3)
  const h = L(0.05, 0, 5.3)
  cyl(p, h[0], h[1], 0.36, h[2] - 0.4, h[2] + 0.42, seg, true, false, 0.3)
  // the right arm raised high (the gesture in a3), the left holding a rifle at the side
  limb(L(0, -0.75, 4.5), L(0.25, -1.0, 6.4), 0.32)
  limb(L(0, 0.75, 4.5), L(0.15, 0.85, 3.0), 0.3)
  limb(L(0.2, 0.95, 1.2), L(0.2, 0.95, 4.6), 0.16)
  if (detail) {
    // a fist at the raised hand, a cap, a belt
    const fist = L(0.25, -1.0, 6.5)
    cyl(p, fist[0], fist[1], 0.22, fist[2] - 0.15, fist[2] + 0.2, 6, true)
    cyl(p, h[0], h[1], 0.4, h[2] + 0.2, h[2] + 0.45, seg, true, false, 0.36)
    cyl(p, x, y, 0.68, z0 + 2.9, z0 + 3.15, seg, false)
  }
}

if (import.meta.main) {
  const extras = { anchor: ANCHOR, bearing: BEARING }
  await writeModel(`${ID}.glb`, NAME, build(false), extras, 6500, 250_000)
  await writeModel(`${ID}.detail.glb`, NAME, build(true), extras, 40_000, 1_536_000)
}
