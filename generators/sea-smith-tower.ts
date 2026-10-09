/**
 * Smith Tower (1914, Gaggin & Gaggin), Seattle — original procedural
 * geometry, CC0-1.0.
 * bun generators/sea-smith-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the OSM
 * outline's area centroid) on the lowest ground under the footprint, at the
 * corner of 2nd Avenue and Yesler Way (11.9 m NAVD88). Built square to the
 * Pioneer Square grid, the long axis of the base on the model's y axis;
 * placed at bearing 61.5°.
 *
 * Form: a 21-storey white terracotta block with a heavy cornice, and rising
 * from its south-west end, flush with that face, a slender shaft to the
 * 35th-floor observation balcony, then a steep pyramidal roof with rows of
 * small dormers, crowned by a glass globe. A small penthouse sits on the
 * block's roof behind the shaft.
 *
 * Sources
 * - OSM: outline way/52781661; parts way/418140386 (the shaft, 35 floors,
 *   141 m), way/418140384 (the globe), way/418140385 (the finial). OSM sits
 *   ~1.5 m north-west of the lidar, so the plan is taken from the lidar.
 * - Lidar (measured): USGS 3DEP WA_KingCo_1_2021, heights above the lowest
 *   ground: block roof 73–76 m, penthouse 82 m, shaft balcony 115 m at
 *   19 x 23 m over the cornice, pyramid rising ~2.6 m per metre inwards to
 *   the globe at 141 m; the block's plan (39 x 42 m with a cut south-west
 *   corner).
 * - Published: 141 m to the globe (149 m to the finial), 38 storeys
 *   (Wikipedia, "Smith Tower").
 * - Photos (Wikimedia Commons): from the north (elevated), the south-east,
 *   and Elliott Bay; credits in the batch report.
 * Estimated: the shaft's wall line inside the balcony cornice (0.8 m), the
 * dormer layout (three rows, simplified), window grouping (three storeys).
 * Left out: the finial (too thin to read), the light-well notch on the
 * block's north-west face.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Prism, type Grid, ccw, capRing, chamfer, edgeBase, edgePanels, finishGlb, wallEdge } from './sea-columbia-center'

function build() {
  // (u, v): u along the block towards the north-east (bearing 61.5°), v
  // towards the north-west, about the local point (-10.2, -2.8) m. Model
  // coordinates: x = -v - 2.40, y = u - 10.30.
  const M = ([u, v]: XY): XY => [-v - 2.4, u - 10.3]
  const rect = (u0: number, u1: number, v0: number, v1: number): XY[] => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]
  const mr = (r: XY[], ch = 0.5) => chamfer(ccw(r.map(M)), ch)

  const BLOCK: XY[] = [[-10, 15.5], [-10, -12.5], [8.5, -26], [28.5, -26], [28.5, 15.5]]
  const BLOCK_CORNICE: XY[] = [[-10.7, 16.2], [-10.7, -12.9], [8.3, -26.7], [29.2, -26.7], [29.2, 16.2]]
  const SHAFT = rect(-10, 8.0, -11.4, 10.0) // flush with the block's south-west face
  const BALCONY = rect(-10.8, 8.8, -12.2, 10.8)
  const PLINTH = rect(-9.4, 7.4, -10.8, 9.4)
  const PENT = rect(4, 16, -4.5, 4.5)

  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), pyr = new Part(), globe = new Part()
  const prisms: Prism[] = [
    { ring: mr(BLOCK), z1: 71, wall: stone, roof, kind: 'block' },
    { ring: mr(BLOCK_CORNICE), z0: 71, z1: 74.5, wall: trim, roof, kind: 'cornice' },
    { ring: mr(PENT), z0: 74.5, z1: 82, wall: stone, roof, kind: 'plain' },
    { ring: mr(SHAFT), z1: 112, wall: stone, roof, kind: 'shaft' },
    { ring: mr(BALCONY), z0: 112, z1: 115.5, wall: trim, roof, kind: 'cornice' },
    { ring: mr(PLINTH), z0: 115.5, z1: 117.5, wall: stone, roof, kind: 'plain' },
  ]
  // A storey is ~3.6 m. One tall panel per bay spans three storeys with only
  // a narrow spandrel between groups, so each face reads as vertical stripes
  // of white pier and window, as the photos do.
  const shaftGrid: Grid = { group: 3 * 3.6, spandrel: 1.8, pier: 2.2, bayW: 4.6, head: 1.5, foot: 2, inset: 1.3 }
  const blockGrid: Grid = { ...shaftGrid, bayW: 5.8, pier: 2.6, foot: 7 }
  for (const P of prisms) {
    const r = P.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = edgeBase(prisms, P, i)
      if (z0 >= P.z1 - 0.01) continue
      wallEdge(P.wall, r, i, z0, P.z1)
      if (P.kind === 'block' || P.kind === 'shaft') edgePanels(win, r, i, z0, P.z1, P.kind === 'block' ? blockGrid : shaftGrid, false)
    }
    capRing(P.roof, r, P.z1)
  }

  // The pyramid: from the plinth to the globe's neck.
  const Z0 = 117.5, Z1 = 136.5, NECK = 1.0
  const base = PLINTH.map(M).map(([x, y]): V3 => [x, y, Z0])
  const cx = base.reduce((s, p) => s + p[0] / 4, 0), cy = base.reduce((s, p) => s + p[1] / 4, 0)
  const top = base.map(([x, y]): V3 => [cx + (x - cx) * (NECK / 9), cy + (y - cy) * (NECK / 9), Z1])
  const ring0 = ccw(base.map(([x, y]) => [x, y] as XY))
  const order = ring0.map((p) => base.findIndex((q) => q[0] === p[0] && q[1] === p[1]))
  for (let i = 0; i < 4; i++) {
    const a = order[i], b = order[(i + 1) % 4]
    pyr.quad(base[a], base[b], top[b], top[a])
    // dormers: small flush triangles in three rows, fewer going up
    const n: V3 = (() => {
      const e1 = [base[b][0] - base[a][0], base[b][1] - base[a][1], 0], e2 = [top[a][0] - base[a][0], top[a][1] - base[a][1], Z1 - Z0]
      const c = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
      const l = Math.hypot(c[0], c[1], c[2])
      return [c[0] / l, c[1] / l, c[2] / l]
    })()
    const at = (s: number, t: number, lift = 0.06): V3 => {
      // s across the face 0..1 at height fraction t
      const L: V3 = [base[a][0] + (top[a][0] - base[a][0]) * t, base[a][1] + (top[a][1] - base[a][1]) * t, Z0 + (Z1 - Z0) * t]
      const R: V3 = [base[b][0] + (top[b][0] - base[b][0]) * t, base[b][1] + (top[b][1] - base[b][1]) * t, Z0 + (Z1 - Z0) * t]
      return [L[0] + (R[0] - L[0]) * s + n[0] * lift, L[1] + (R[1] - L[1]) * s + n[1] * lift, L[2] + (R[2] - L[2]) * s + n[2] * lift]
    }
    for (const [t, cols] of [[0.12, 4], [0.36, 3], [0.6, 2]] as [number, number][]) {
      for (let k = 0; k < cols; k++) {
        const s = (k + 1) / (cols + 1), w = 0.055 / (1 - t)
        win.tri(at(s - w, t), at(s + w, t), at(s, t + 0.11))
      }
    }
  }
  // The globe: a glass ball on the pyramid's tip.
  const R = 2.1, GZ = Z1 + R - 0.4, SEG = 12, RINGS = 6
  const pt = (i: number, j: number): V3 => {
    const th = (Math.PI * j) / RINGS, ph = (2 * Math.PI * i) / SEG
    return [cx + R * Math.sin(th) * Math.cos(ph), cy + R * Math.sin(th) * Math.sin(ph), GZ + R * Math.cos(th)]
  }
  const nn = (p: V3): V3 => [(p[0] - cx) / R, (p[1] - cy) / R, (p[2] - GZ) / R]
  for (let j = 0; j < RINGS; j++)
    for (let i = 0; i < SEG; i++) {
      const a = pt(i, j), b = pt(i, j + 1), c = pt(i + 1, j + 1), d = pt(i + 1, j)
      if (j > 0) globe.tri(a, b, d, undefined, undefined, undefined, [nn(a), nn(b), nn(d)])
      if (j < RINGS - 1) globe.tri(b, c, d, undefined, undefined, undefined, [nn(b), nn(c), nn(d)])
    }

  return finishGlb('sea-smith-tower', 'Smith Tower', [
    { part: stone, material: PALETTE.stone },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: pyr, material: finish('smith-pyramid', 0xd3cdc2) },
    { part: globe, material: PALETTE.glass },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 61.5, height: GZ + R, replaces: ['way/52781661', 'way/418140386', 'way/418140384', 'way/418140385'] })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/sea-smith-tower.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
