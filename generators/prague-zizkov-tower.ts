/**
 * Žižkov Television Tower (Žižkovský vysílač), Prague: procedural, CC0-1.0.
 *   bun generators/prague-zizkov-tower.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/prague-zizkov-tower.glb, the low model;
 * - models/prague-zizkov-tower.detail.glb, drawn from zoom 16: rounder pods,
 *   the radome's panels, the open lattice under the mast, the railed
 *   equipment decks with their dishes, and finer babies.
 *
 * Uses the kit exported by generators/prague-dancing-house.ts.
 *
 * Frame: not turned (BEARING 0): +x east, +y north, z up, metres. Origin =
 * the axis of the main column (the anchor 14.45106 E, 50.08102 N, OSM
 * way/457404360); y = 0 is the ground at its foot.
 *
 * Evidence
 * - OSM way/457404360 (Žižkovský vysílač, height 216) and relation/3917957
 *   with its outline way/294809058 and parts: way/50938190 (the main column,
 *   r 3.2, 132 m), way/50938191 and way/50938192 (the two side columns, r
 *   2.4, domed, 134 m, centred at (8.25, 9.05) and (11.25, -4.1)),
 *   way/98887860 (the lowest pods, 61-72 m), way/98887857 (92-101),
 *   way/98887854 (103-112), way/4929921 (the core between the columns,
 *   92-125), way/294809059 (the entrance block between the columns, three
 *   levels), way/654993103 (the white radome, r 3.6, 132-175) and
 *   way/660445112 (the grey ring above it, 175-180). The pods' plan is
 *   OSM's: one on each side of the columns' triangle, about 12 m along the
 *   side and reaching 10-11.7 m out from the line between the column axes.
 * - Published (en/cs.wikipedia "Žižkov Television Tower"): 216 m; built
 *   1985-1992, Václav Aulický (architect) and Jiří Kozák (structure); three
 *   steel tubular columns, the main one 6.4 m across, the others 4.8 m;
 *   restaurant at 66 m, observation deck at 93 m; David Černý's "Miminka",
 *   ten crawling babies added in 2000, replaced by new casts in 2017.
 * - Commons photos (EVIDENCE):
 *   "Žižkov Television Tower (Jan 2014).jpg" (Sebaso, CC BY-SA 3.0; a level
 *   telephoto from far off: every height below is measured on it, 7.6 px/m,
 *   checked against OSM's pods and radome and the 216 m tip);
 *   "Žižkov tv tower.jpg" (Norbert Požár, CC BY-SA 3.0; the pods and babies
 *   from below); "Žižkov Television Tower (1).jpg" (Huhulenik, CC BY 3.0;
 *   the pods' rounded section and window bands); "Wide angle view of Žižkov
 *   Television Tower from street level, 2014-03-09.jpg" (Sage Ross, CC BY-SA
 *   3.0; the base); "Žižkov Television Tower Prague - babies by David
 *   Černý-6446.jpg" (Raimond Spekking, CC BY-SA 4.0; the babies' pose and
 *   the equipment decks); "CZ-Prag-zizkov-tv-turm-babies.jpg" (Balou46, CC
 *   BY-SA 3.0; the babies close up); "Zizkov tower from Vitkov.jpg"
 *   (Bystroushaak, CC BY-SA 4.0; distant, proportions).
 *
 * Measured (Sebaso): side columns' domes 134 m; radome 132-180 m, about
 * 7.2 m across; an open lattice 180-190 m; the red and white mast 190-216
 * m, seven bands; pods 61-72, 92-101, 103-112 (OSM agrees within a metre);
 * the equipment decks between 112 and 132 m; babies from 30 to 90 m up, on
 * all three columns, drawn 3.5 m long (Balou46's close photo puts one at
 * 0.58 of the 6.4 m column; the distant photo reads nearer 2.6 m). The
 * pods: vertical outer faces with the window band at their foot, a long
 * curved underside into the columns, a tight rounded top (Spekking,
 * Balou46). Estimated: the pods' rounding (2.5 m
 * in section, 2 m in plan) and their window bands; the decks' railings and
 * dishes (the real decks are a thicket of antennas); the babies' exact
 * places (ten, spread round the columns as the photos show them) and their
 * pose (head up, belly to the column, one arm reaching, knees bent; the
 * real casts have a barcode slot for a face, left out).
 *
 * Left out: the lift and stair inside the columns, the lights on the
 * pods, the smaller antennas.
 *
 * Doubts: the map's terrain dips about 4 m at the tower's foot (the
 * sunken entrance court); y = 0 is the foot of the columns, elevation 0.
 *
 * Night: the columns are floodlit (in the Czech colours on some nights:
 * drawn as a white wash); the pods' windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  TAU, add, mul, sub, unit, cross, lathe, loftSmooth, tube, rod, box, prism, triN, quadN, saveLods, triangulate,
  type PartList, type XY,
} from './prague-dancing-house'

type Lod = { detail: boolean }

const A: XY = [0, 0], B: XY = [8.25, 9.05], C: XY = [11.25, -4.1]
const RA = 3.2, RS = 2.4
const G: XY = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3]
// pods: [z0, z1]
const PODS: [number, number][] = [[61, 72], [92, 101], [103, 112]]
// sides of the columns' triangle, each with its pod's span along it and its reach out (OSM)
const SIDES: { p: XY; q: XY; s0: number; s1: number; out: number }[] = [
  { p: A, q: C, s0: 0.2, s1: 12.4, out: 11.0 },
  { p: C, q: B, s0: 0.3, s1: 12.3, out: 10.8 },
  { p: B, q: A, s0: 0.2, s1: 10.6, out: 10.3 },
]

/** A rounded rectangle in (s, t), counter-clockwise, corner radius r, `k` steps per corner. */
function roundRect(s0: number, s1: number, t0: number, t1: number, r: number, k: number): XY[] {
  const pts: XY[] = []
  const corners: [number, number, number][] = [[s1 - r, t0 + r, -Math.PI / 2], [s1 - r, t1 - r, 0], [s0 + r, t1 - r, Math.PI / 2], [s0 + r, t0 + r, Math.PI]]
  for (const [cs, ct, a0] of corners)
    for (let i = 0; i <= k; i++) {
      const a = a0 + (i / k) * (Math.PI / 2)
      pts.push([cs + r * Math.cos(a), ct + r * Math.sin(a)])
    }
  return pts
}

/** A pod: a box rounded in plan and in section, in the side's (s, t) frame. */
function pod(body: Part, win: Part, side: (typeof SIDES)[number], z0: number, z1: number, L: Lod, lowest: boolean) {
  const d: XY = [(side.q[0] - side.p[0]), (side.q[1] - side.p[1])]
  const len = Math.hypot(...d)
  const u: XY = [d[0] / len, d[1] / len]
  // outward: away from the triangle's centre
  let n: XY = [-u[1], u[0]]
  if ((side.p[0] - G[0]) * n[0] + (side.p[1] - G[1]) * n[1] < 0) n = [-n[0], -n[1]]
  const W = (s: number, t: number, z: number): V3 => [side.p[0] + u[0] * s + n[0] * t, side.p[1] + u[1] * s + n[1] * t, z]
  // the underside slopes in a long curve to the columns; the top is only rounded
  const rvb = (z1 - z0) * 0.4, rvt = 1.6, rp = 2.2
  const K = L.detail ? 5 : 2, KV = L.detail ? 5 : 2
  const rings: V3[][] = []
  const ringAt = (inset: number, z: number) => {
    const rr = roundRect(side.s0 + inset, side.s1 - inset, -1.5 + inset, side.out - inset, Math.max(0.4, rp - inset * 0.6), K)
    // (s,t) counter-clockwise; the map frame keeps the orientation only if n is to the left of u
    const flip = u[0] * n[1] - u[1] * n[0] < 0
    const ordered = flip ? [...rr].reverse() : rr
    return ordered.map(([s, t]) => W(s, t, z))
  }
  for (let i = 0; i <= KV; i++) {
    const phi = (i / KV) * (Math.PI / 2)
    rings.push(ringAt(rvb * 0.75 * (1 - Math.sin(phi)), z0 + rvb * (1 - Math.cos(phi))))
  }
  for (let i = KV; i >= 0; i--) {
    const phi = (i / KV) * (Math.PI / 2)
    rings.push(ringAt(rvt * (1 - Math.sin(phi)), z1 - rvt * (1 - Math.cos(phi))))
  }
  loftSmooth(body, rings, true)
  for (const [ring, up] of [[rings[0], false], [rings[rings.length - 1], true]] as [V3[], boolean][]) {
    const flat = ring.map((p): XY => [p[0], p[1]])
    for (const [i, j, k] of triangulate(flat)) {
      if (up) triN(body, ring[i], ring[j], ring[k], [0, 0, 1])
      else triN(body, ring[i], ring[k], ring[j], [0, 0, -1])
    }
  }
  // the window band round the outer three faces, just proud of the wall
  const zb0 = z0 + rvb + 0.4, zb1 = Math.min(z1 - rvt - 0.3, zb0 + (lowest ? 2.8 : 2.2))
  const band = (z: number) => ringAt(-0.05, z)
  const b0 = band(zb0), b1 = band(zb1)
  // only the faces looking out (t > 0.5): skip the segments on the inner side
  for (let i = 0; i < b0.length; i++) {
    const j = (i + 1) % b0.length
    const mid: XY = [(b0[i][0] + b0[j][0]) / 2 - side.p[0], (b0[i][1] + b0[j][1]) / 2 - side.p[1]]
    if (mid[0] * n[0] + mid[1] * n[1] < 1.0) continue
    const e = sub(b0[j], b0[i]), nn = unit(cross(e, [0, 0, 1]))
    quadN(win, b0[i], b0[j], b1[j], b1[i], nn)
  }
}

/**
 * One of David Černý's babies crawling up a column: head up, belly to the
 * steel, one arm reaching. (cx, cy, r) the column, a the bearing round it
 * (maths angle), z the hips' height.
 */
function baby(p: Part, cx: number, cy: number, r: number, a: number, z: number, L: Lod, gait: number) {
  const w: V3 = [Math.cos(a), Math.sin(a), 0], v: V3 = [0, 0, 1], u: V3 = [-Math.sin(a), Math.cos(a), 0]
  const S = 1.35 // about 3.5 m from the feet to the top of the head
  const base: V3 = [cx + r * w[0], cy + r * w[1], z]
  const at = (x: number, y: number, d: number): V3 => add(add(add(base, mul(u, x * S)), mul(v, y * S)), mul(w, d * S))
  const seg = L.detail ? 12 : 6, rings = L.detail ? 8 : 4
  const ellipsoid = (c: V3, ru: number, rv: number, rw: number) => {
    const grid: V3[][] = []
    for (let k = 0; k <= rings; k++) {
      const ph = -Math.PI / 2 + (k / rings) * Math.PI
      grid.push(Array.from({ length: seg }, (_, i) => {
        const th = (i / seg) * TAU
        return add(c, add(add(mul(u, ru * S * Math.cos(ph) * Math.cos(th)), mul(w, rw * S * Math.cos(ph) * Math.sin(th))), mul(v, rv * S * Math.sin(ph))))
      }))
    }
    loftSmooth(p, grid, true, true)
  }
  // body, bottom and head
  ellipsoid(at(0, 0.95, 0.52), 0.42, 0.6, 0.36)
  ellipsoid(at(0, 0.42, 0.58), 0.46, 0.4, 0.4)
  ellipsoid(at(0, 1.92, 0.6), 0.39, 0.43, 0.4)
  const limbR = L.detail ? 0.15 : 0.17, sides = L.detail ? 8 : 4
  // arms: one reaching up, the other lower (the crawl's gait)
  for (const sx of [-1, 1]) {
    const reach = sx === gait
    const sh = at(0.36 * sx, 1.38, 0.5)
    const el = reach ? at(0.58 * sx, 1.8, 0.3) : at(0.62 * sx, 1.22, 0.3)
    const ha = reach ? at(0.5 * sx, 2.15, 0.1) : at(0.58 * sx, 1.55, 0.1)
    tube(p, [sh, el, ha], (i) => (i === 2 ? limbR * 0.9 : limbR), sides)
    // legs: thigh down and out to the knee, shin back up along the column
    const hip = at(0.3 * sx, 0.42, 0.55)
    const kn = reach ? at(0.55 * sx, 0.0, 0.14) : at(0.5 * sx, -0.18, 0.16)
    const ft = reach ? at(0.42 * sx, -0.6, 0.22) : at(0.36 * sx, -0.75, 0.26)
    tube(p, [hip, kn, ft], (i) => (i === 0 ? limbR * 1.4 : limbR * 1.1), sides)
  }
}

function build(L: Lod): PartList {
  const steel = new Part(), win = new Part(), white = new Part(), dark = new Part(), red = new Part(), babies = new Part()
  const SEG = L.detail ? 28 : 16

  // the three columns
  lathe(steel, A[0], A[1], [[RA, 0], [RA, 44], [RA, 88], [RA, 132]], SEG)
  for (const [x, y] of [B, C]) {
    const prof: XY[] = [[RS, 0], [RS, 66], [RS, 131.6]]
    const K = L.detail ? 6 : 3
    for (let i = 1; i <= K; i++) {
      const ph = (i / K) * (Math.PI / 2)
      prof.push([RS * Math.cos(ph), 131.6 + RS * Math.sin(ph)])
    }
    lathe(steel, x, y, prof, SEG)
  }

  // the pods, three to a level
  PODS.forEach(([z0, z1], li) => SIDES.forEach((s) => pod(steel, win, s, z0, z1, L, li === 0)))

  // the core between the columns, and the entrance block at the foot
  const tri: XY[] = [A, C, B].map(([x, y]) => [G[0] + (x - G[0]) * 0.92, G[1] + (y - G[1]) * 0.92] as XY)
  prism(steel, tri, 72, 125, steel, steel)
  prism(steel, tri, 0, 9.5, steel)
  {
    // a glazed band round the entrance block's three faces
    const outer = tri.map(([x, y]): XY => [G[0] + (x - G[0]) * 1.02, G[1] + (y - G[1]) * 1.02])
    for (let i = 0; i < 3; i++) {
      const a = outer[i], b = outer[(i + 1) % 3]
      const l = Math.hypot(b[0] - a[0], b[1] - a[1])
      quadN(win, [a[0], a[1], 1.0], [b[0], b[1], 1.0], [b[0], b[1], 4.2], [a[0], a[1], 4.2], [(b[1] - a[1]) / l, -(b[0] - a[0]) / l, 0])
    }
  }

  // the equipment decks between the upper pods and the column tops
  {
    const deck: XY[] = [A, C, B].map(([x, y]) => [G[0] + (x - G[0]) * 1.75, G[1] + (y - G[1]) * 1.75] as XY)
    for (const z of [116, 121.5, 127]) prism(steel, deck, z - 0.5, z, steel, steel)
    // the equipment on the decks: panel antennas standing round their edges
    for (const z of [116, 121.5]) {
      for (let i = 0; i < 3; i++) {
        const a = deck[i], b = deck[(i + 1) % 3]
        const l = Math.hypot(b[0] - a[0], b[1] - a[1]), u: V3 = [(b[0] - a[0]) / l, (b[1] - a[1]) / l, 0], n: V3 = [u[1], -u[0], 0]
        for (const t of L.detail ? [0.25, 0.5, 0.75] : [0.35, 0.65]) {
          const p: V3 = [a[0] + (b[0] - a[0]) * t - n[0] * 0.8, a[1] + (b[1] - a[1]) * t - n[1] * 0.8, z + 1.6]
          box(white, p, u, [0, 0, 1], n, 0.45, 1.6, -0.2, 0.2, true)
        }
      }
    }
    if (!L.detail) {
      // railings as a low open fence: a band of steel on posts, each a real member
      for (const z of [116, 127]) for (let i = 0; i < 3; i++) {
        const a = deck[i], b = deck[(i + 1) % 3]
        rod(steel, [a[0], a[1], z + 1.1], [b[0], b[1], z + 1.1], 0.09, 3, false)
      }
    }
    if (L.detail) {
      // railings: posts and a rail round each deck
      for (const z of [116, 121.5, 127]) {
        for (let i = 0; i < 3; i++) {
          const a = deck[i], b = deck[(i + 1) % 3]
          const n = 8
          for (let k = 0; k <= n; k++) {
            const p: XY = [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]
            rod(steel, [p[0], p[1], z], [p[0], p[1], z + 1.1], 0.05, 4, false)
          }
          rod(steel, [a[0], a[1], z + 1.1], [b[0], b[1], z + 1.1], 0.06, 4, false)
        }
      }
      // dishes and panel antennas on the decks
      const dishes: [number, number, number, number][] = [[2.0, 11.5, 118.0, 2.2], [16.0, 4.5, 118.0, 0.4], [6.5, -9.0, 118.0, -1.6], [0.0, -6.0, 123.5, -2.3], [14.5, 8.0, 123.5, 0.9], [-3.5, 4.0, 123.5, 2.9]]
      for (const [x, y, z, a] of dishes) {
        const w: V3 = [Math.cos(a), Math.sin(a), 0]
        const rings: V3[][] = []
        const u: V3 = [-Math.sin(a), Math.cos(a), 0]
        for (const [rr, dd] of [[0.0, -0.35], [0.6, -0.25], [1.0, 0]] as [number, number][])
          rings.push(Array.from({ length: 12 }, (_, i) => add([x, y, z], add(mul(w, dd), add(mul(u, rr * Math.cos((i / 12) * TAU)), mul([0, 0, 1], rr * Math.sin((i / 12) * TAU)))))))
        loftSmooth(white, rings, true)
        loftSmooth(white, [...rings].reverse(), true)
        rod(steel, [x, y, z - 1.4], add([x, y, z], mul(w, -0.35)), 0.08, 4)
      }
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * TAU
        const p: XY = [G[0] + 7.2 * Math.cos(a), G[1] + 7.2 * Math.sin(a)]
        box(white, [p[0], p[1], 121.5], [-Math.sin(a), Math.cos(a), 0], [0, 0, 1], [Math.cos(a), Math.sin(a), 0], 0.35, 1.2, -0.15, 0.15, true)
      }
    }
  }

  // the radome on the main column, its panels in rows, and the mast
  {
    const R = 3.6
    lathe(steel, A[0], A[1], [[RA, 132], [R, 132.4]], SEG)
    lathe(white, A[0], A[1], [[R, 132.4], [R, 179.0]], SEG)
    lathe(red, A[0], A[1], [[R, 179.0], [R + 0.1, 179.2], [R + 0.1, 180], [1.6, 180.1]], SEG)
    if (L.detail) {
      // the radome's raised panels, about a metre square, in staggered rows
      const ROWS = 30, PER = 14
      for (let k = 0; k < ROWS; k++)
        for (let i = 0; i < PER; i++) {
          const a = ((i + (k % 2) * 0.5) / PER) * TAU
          const w: V3 = [Math.cos(a), Math.sin(a), 0], u: V3 = [-Math.sin(a), Math.cos(a), 0]
          box(white, [R * w[0], R * w[1], 133.6 + k * 1.5], u, [0, 0, 1], w, 0.62, 0.55, -0.05, 0.12)
        }
      // the open lattice under the mast: four legs, rings and X braces
      const lr = 1.5, z0 = 180, z1 = 190
      const leg = (k: number, z: number): V3 => {
        const rr = lr - (lr - 0.8) * ((z - z0) / (z1 - z0))
        const a = (k / 4) * TAU + Math.PI / 4
        return [rr * Math.cos(a), rr * Math.sin(a), z]
      }
      const levels = [180, 182.5, 185, 187.5, 190]
      for (let k = 0; k < 4; k++) {
        rod(dark, leg(k, z0), leg(k, z1), 0.14, 4)
        for (let l = 0; l < levels.length - 1; l++) {
          rod(dark, leg(k, levels[l]), leg((k + 1) % 4, levels[l + 1]), 0.07, 4)
          rod(dark, leg((k + 1) % 4, levels[l]), leg(k, levels[l + 1]), 0.07, 4)
        }
        for (const z of levels) rod(dark, leg(k, z), leg((k + 1) % 4, z), 0.07, 4)
      }
      lathe(dark, 0, 0, [[0.45, 180], [0.45, 190]], 8)
    } else {
      // rings round the radome, where its panel rows read from afar
      for (let k = 1; k < 6; k++) lathe(white, A[0], A[1], [[R, 132.4 + k * 7.8 - 0.3], [R + 0.15, 132.4 + k * 7.8], [R, 132.4 + k * 7.8 + 0.3]], SEG)
      lathe(dark, A[0], A[1], [[1.5, 180.1], [0.8, 190]], 8)
    }
    // the mast: seven red and white bands, red at the top
    const MS = L.detail ? 12 : 8
    const bands = 7, m0 = 190, m1 = 214
    for (let b = 0; b < bands; b++) {
      const z0 = m0 + ((m1 - m0) * b) / bands, z1 = m0 + ((m1 - m0) * (b + 1)) / bands
      const r0 = 0.75 - 0.3 * ((z0 - m0) / (m1 - m0)), r1 = 0.75 - 0.3 * ((z1 - m0) / (m1 - m0))
      lathe((bands - 1 - b) % 2 === 0 ? red : white, 0, 0, [[r0, z0], [r1, z1]], MS)
    }
    lathe(red, 0, 0, [[0.45, 214], [0.3, 215], [0.12, 216], [0, 216]], MS)
    // platform ring round the mast's foot
    lathe(steel, 0, 0, [[1.9, 189.6], [1.9, 190], [0.75, 190.05]], MS)
  }

  // the babies: ten, crawling up all three columns
  const kids: [XY, number, number, number][] = [
    [A, RA, 200, 38], [A, RA, 160, 52], [A, RA, 240, 79], [A, RA, 130, 86],
    [B, RS, 95, 34], [B, RS, 140, 48], [B, RS, 60, 82],
    [C, RS, 300, 28], [C, RS, 340, 44], [C, RS, 10, 78],
  ]
  kids.forEach(([c, r, deg, z], i) => baby(babies, c[0], c[1], r, (deg * Math.PI) / 180, z, L, i % 2 ? 1 : -1))

  const lit = (p: V3, n: V3) => (n[2] < 0.7 && p[2] < 135 ? 0.6 : 0.2)
  return [
    { part: steel, material: { ...finish('zizkov-steel', 0xc3c7c9), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: white, material: { ...finish('zizkov-radome', 0xeef0ee), floodlight: (p: V3) => (p[2] > 130 ? 0.5 : 0) } },
    { part: dark, material: finish('zizkov-lattice', 0x6b7076) },
    { part: red, material: finish('zizkov-red', 0xc0574b) },
    { part: babies, material: finish('zizkov-babies', 0x4b4a4a) },
  ]
}

if (import.meta.main) {
  await saveLods('prague-zizkov-tower', 'Žižkov Television Tower', build({ detail: false }), build({ detail: true }), {
    anchor: [50.08102, 14.45106], bearing: 0, height: 216,
  })
}
