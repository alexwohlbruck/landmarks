/**
 * Basilica of Our Lady of Peace (Basilique Notre-Dame de la Paix),
 * Yamoussoukro (Pierre Fakhoury, 1985-89): procedural, CC0-1.0.
 * bun generators/yamoussoukro-basilica.ts
 *
 * Writes two levels of detail in the same frame and materials:
 * - models/yamoussoukro-basilica.glb (low, under 6,500 triangles);
 * - models/yamoussoukro-basilica.detail.glb (under 40,000): turned column
 *   bases and capitals, the drum's paired columns, the dome's framed oculi,
 *   the attic's pilaster blocks, door surrounds and the lantern's columns.
 *
 * Also exports a small colonnade kit used by this builder's other models
 * (`column`, `band`, `pathOf`, `annulus`).
 *
 * Frame: origin at the centre of the dome (OSM building:part
 * way/295958129, the lantern, centred on the dome part way/120564183
 * within 0.3 m); bearing 31.2, the basilica's axis: the OSM outline
 * way/89584501 has its edges square to it within 0.2 degrees. +y points
 * up the axis to the plaza (to the north-east), where the two colonnade
 * arms (way/89584498, way/120562630) embrace the esplanade.
 *
 * Plan, from OSM (measured in this frame):
 * - the body: way/89584501, x -76.8..75.1, y -83.5..122.9; a round core
 *   (its stepped outline lies on a circle of about 75 m) with a front
 *   block 60 m wide to y = 123 and a back block 59 m wide to y = -83.5;
 * - the dome part way/120564183, 98 m across (the drum with its
 *   buttresses);
 * - the arms: circles fitted to the OSM edges have centres (-63.5, 223.4)
 *   and (58.5, 221.3), radii 58.2 (inner) and 71.5 (outer). The model
 *   uses x = +-61, y = 222.3 (symmetric about the axis; OSM's 2.5 m
 *   asymmetry is taken as mapping error). Each arm is a half circle from
 *   104.9 to 248.5 degrees with straight tangent ends: 20 m beyond the far
 *   pavilion and 41 m beyond the near one, as OSM draws them;
 * - the four pavilions: OSM parts way/295958125-128, 16.5 m across, 50 m.
 *
 * Heights. Published (fr.wikipedia "Basilique Notre-Dame-de-la-Paix de
 * Yamoussoukro", en.wikipedia): 158 m overall; dome 90 m across; the
 * lantern 40 m; the esplanade's 128 Doric columns 21 m high, 2.2 m
 * across; the body's columns 21-26 m. OSM: dome part 120 m (from 60 m),
 * lantern part 158 m, arms 32 m, pavilions 50 m. Estimated from the photos
 * (scaled by the 21 m arm columns and the 90 m dome): the arms' entablature
 * and attic 22-28.4 m (0.3 of the columns, d4, d20); the pavilions' drum
 * 29-34.4 m and ribbed dome to 42.4 m, cross to 48 (OSM: 32 and 50 m,
 * which the photos don't bear out); the body's ring of columns to 24.5 m and its attic
 * to 34.3 m (the roof terrace at 33); the drum 33-70 m (its height 0.4 of
 * the dome's width, as in d16); the dome's rise 45 m (0.5 of its width,
 * d2, d16); the lantern's bronze ring 113.6-122, the open lantern to
 * 132.5, the ball 8 m across, the cross 14 m. (Revised after the photo
 * pass: the dome rises 52.5 m, 0.57 of its width as in d2, to 121.6; the
 * bronze ring 121-125.2; the open lantern to 134.5; the ball 6.6 m across;
 * the cross 13 m, to 158.)
 * Counted: 24 ribs and 24 pairs of drum columns (d16); the drum's bays
 * alternate tall arched stained-glass windows and blank panels; two rings
 * of 12 oculi on the dome. Arm columns: two rows, 30 a row per arm at
 * 6.4 m (published 128 in all).
 *
 * Ground: the map's terrain (Mapterhorn z12; z13-15 return 404) shows a
 * 10 m pit in front of the basilica that the photos don't (d11: a level
 * esplanade); it is a coarse-terrain artefact. Elevation 0.
 *
 * Simplified or left out: the colonnade's coffered ceilings (a plain
 * soffit), the light wells in the front block's roof, the stained glass's
 * figures, steps, railings and lamps. The back block (to the south-west)
 * has no licensed photo: it repeats the front block's colonnade.
 *
 * Colours from the daylight photos (d0, d1, d2, d16, d20; most are
 * backlit or underexposed, so the hue was read from the sunlit faces): the
 * marble cladding is a warm sand-beige, about #d6c3a2 in sun (a first
 * pass sampled it too pink), pulled to the palette's lightness; the domes are a pale
 * silver grey with a faint blue; the lantern ring, ball and crosses are
 * gilt bronze; the stained glass reads dark slate by day.
 *
 * Night: the basilica is floodlit (the stone and the dome carry
 * `_FLOODLIGHT`); the stained glass glows (`window`).
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - d0, d1, d2, d4, d9, d11, d12, d16, d20: "Basilique notre Dame de la
 *   Paix de Yamoussoukro" 1, 2, 4, 9, 11, 12, 16, 20 and the unnumbered
 *   one, Didierwiki, CC0, e.g.
 *   https://commons.wikimedia.org/wiki/File:Basilique_notre_Dame_de_la_Paix_de_Yamoussoukro.jpg
 *   https://commons.wikimedia.org/wiki/File:Basilique_notre_Dame_de_la_Paix_de_Yamoussoukro_1.jpg
 *   https://commons.wikimedia.org/wiki/File:Basilique_notre_Dame_de_la_Paix_de_Yamoussoukro_2.jpg
 *   https://commons.wikimedia.org/wiki/File:Basilique_notre_Dame_de_la_Paix_de_Yamoussoukro_4.jpg
 *   https://commons.wikimedia.org/wiki/File:Basilique_notre_Dame_de_la_Paix_de_Yamoussoukro_11.jpg
 *   https://commons.wikimedia.org/wiki/File:Basilique_notre_Dame_de_la_Paix_de_Yamoussoukro_12.jpg
 *   https://commons.wikimedia.org/wiki/File:Basilique_notre_Dame_de_la_Paix_de_Yamoussoukro_16.jpg
 *   https://commons.wikimedia.org/wiki/File:Basilique_notre_Dame_de_la_Paix_de_Yamoussoukro_20.jpg
 * - "Notre-Dame-de-la-Paix de Yamoussoukro 2.jpg", Gregor Rom, CC BY-SA 4.0
 *   (distant, across the lake)
 *   https://commons.wikimedia.org/wiki/File:Notre-Dame-de-la-Paix_de_Yamoussoukro_2.jpg
 * Look-only: none used.
 *
 * Doubts: the body's back block and the south-west side (no photo); the
 * split of height between the drum and the dome (published heights
 * disagree with OSM's 60 m dome springing; the photos were followed);
 * the body's ring is drawn round where OSM steps it.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { TAU, add, box, face, lathe, norm, obox, prism, quad, save, tri, type Mat, type XY } from './cairo-cairo-tower'

// ───────────────────────────── colonnade kit ──────────────────────────────

/**
 * A free-standing column at (x, y) from z0, h tall, radius r: a shaft
 * (seg sides), and in detail a plinth, a torus base, an echinus and an
 * abacus. `cap` is the abacus' half-width (0: none).
 */
export function column(p: Part, x: number, y: number, z0: number, h: number, r: number, detail: boolean, cap = r * 1.3) {
  const seg = detail ? 8 : 4
  if (!detail) {
    lathe(p, x, y, [[r, z0], [r * 0.9, z0 + h]], seg, { phase: Math.PI / seg })
    return
  }
  const zb = z0 + r * 0.9, zc = z0 + h - r * 1.0
  box(p, p, x - cap, x + cap, y - cap, y + cap, z0, z0 + r * 0.45)
  lathe(p, x, y, [[r * 1.22, z0 + r * 0.45], [r * 1.22, z0 + r * 0.75], [r, zb], [r * 0.88, zc], [r * 1.2, zc + r * 0.55]], seg, { phase: Math.PI / seg })
  box(p, p, x - cap, x + cap, y - cap, y + cap, zc + r * 0.55, z0 + h)
}

/** A path sampled as points with unit tangents and arc length. */
export type PathPt = { p: XY; t: XY; s: number }
export function pathOf(pts: XY[]): PathPt[] {
  let s = 0
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    if (i > 0) s += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1])
    return { p, t: [(b[0] - a[0]) / L, (b[1] - a[1]) / L] as XY, s }
  })
}

/**
 * A band of half-width hw swept along a path (left side = +normal), from z0
 * to z1: its two sides, its top, optionally its underside and end caps.
 * Corners use the averaged tangent, so a curve stays one smooth band.
 */
export function band(side: Part, top: Part | null, P: PathPt[], hw: number, z0: number, z1: number, o: { bottom?: Part; ends?: boolean } = {}) {
  const L = (q: PathPt, k: number): XY => [q.p[0] - q.t[1] * hw * k, q.p[1] + q.t[0] * hw * k]
  for (let i = 0; i < P.length - 1; i++) {
    const a = P[i], b = P[i + 1]
    for (const k of [1, -1]) {
      const na: V3 = [-a.t[1] * k, a.t[0] * k, 0], nb: V3 = [-b.t[1] * k, b.t[0] * k, 0]
      const A = L(a, k), B = L(b, k)
      quad(side, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1], [na, nb, nb, na])
    }
    const al = L(a, 1), ar = L(a, -1), bl = L(b, 1), br = L(b, -1)
    if (top) quad(top, [ar[0], ar[1], z1], [br[0], br[1], z1], [bl[0], bl[1], z1], [al[0], al[1], z1], [0, 0, 1])
    if (o.bottom) quad(o.bottom, [ar[0], ar[1], z0], [al[0], al[1], z0], [bl[0], bl[1], z0], [br[0], br[1], z0], [0, 0, -1])
  }
  if (o.ends) for (const [q, sg] of [[P[0], -1], [P[P.length - 1], 1]] as [PathPt, number][]) {
    const l = L(q, 1), r = L(q, -1), n: V3 = [q.t[0] * sg, q.t[1] * sg, 0]
    quad(side, [l[0], l[1], z0], [r[0], r[1], z0], [r[0], r[1], z1], [l[0], l[1], z1], n)
  }
}

/** Points on an arc about (cx, cy), radius r, from angle a0 to a1 (radians), n steps. */
export const arcPts = (cx: number, cy: number, r: number, a0: number, a1: number, n: number): XY[] =>
  Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as XY })

/** A point and tangent at arc length s along a path. */
export function along(P: PathPt[], s: number): PathPt {
  let i = 0
  while (i < P.length - 2 && P[i + 1].s < s) i++
  const a = P[i], b = P[i + 1], f = Math.min(1, Math.max(0, (s - a.s) / (b.s - a.s || 1)))
  const t = norm([b.p[0] - a.p[0], b.p[1] - a.p[1], 0])
  return { p: [a.p[0] + (b.p[0] - a.p[0]) * f, a.p[1] + (b.p[1] - a.p[1]) * f], t: [t[0], t[1]], s }
}

/** An oriented box with an underside: centre (cx, cy), along u half hu, across half hv. */
export function obox6(side: Part, top: Part | null, bottom: Part | null, cx: number, cy: number, u: XY, hu: number, hv: number, z0: number, z1: number) {
  const v: XY = [-u[1], u[0]]
  const c = (su: number, sv: number): XY => [cx + u[0] * su + v[0] * sv, cy + u[1] * su + v[1] * sv]
  prism(side, top, [c(-hu, -hv), c(hu, -hv), c(hu, hv), c(-hu, hv)], z0, z1, bottom)
}

/** Segments in a panel's round head (set per level of detail). */
export const ARCH_SEGS = { n: 8 }

/**
 * A flat panel on a vertical plane: centre (cx, cy) on the wall, outward
 * normal n (horizontal), width w, from z0 to z1, with a semicircular head
 * when `round` (z1 is then the crown). `off` proud of the wall.
 */
export function wallPanel(p: Part, cx: number, cy: number, n: XY, w: number, z0: number, z1: number, round: boolean, segs = ARCH_SEGS.n, off = 0.06) {
  const u: XY = [-n[1], n[0]], o: XY = [cx + n[0] * off, cy + n[1] * off]
  const P = (s: number, z: number): V3 => [o[0] + u[0] * s, o[1] + u[1] * s, z]
  const r = w / 2, zs = round ? z1 - r : z1
  const pts: V3[] = [P(-r, z0), P(r, z0)]
  if (round) for (let i = 0; i <= segs; i++) { const a = (Math.PI * i) / segs; pts.push(P(r * Math.cos(a), zs + r * Math.sin(a))) }
  else pts.push(P(r, z1), P(-r, z1))
  face(p, pts, [n[0], n[1], 0])
}

/** A gable (triangular prism) on a box top: ridge along u through (cx, cy), the slopes facing ±v. */
export function gable(roof: Part, end: Part, cx: number, cy: number, u: XY, hu: number, hv: number, z: number, rise: number) {
  const v: XY = [-u[1], u[0]]
  const c = (su: number, sv: number, dz = 0): V3 => [cx + u[0] * su + v[0] * sv, cy + u[1] * su + v[1] * sv, z + dz]
  for (const sg of [1, -1]) {
    const n = norm([v[0] * sg * rise, v[1] * sg * rise, hv])
    quad(roof, c(-hu, hv * sg), c(hu, hv * sg), c(hu, 0, rise), c(-hu, 0, rise), n)
    tri(end, c(hu * sg, -hv), c(hu * sg, hv), c(hu * sg, 0, rise), [u[0] * sg, u[1] * sg, 0])
  }
}

// ───────────────────────────── the basilica ───────────────────────────────

const deg = Math.PI / 180

// The arms (left arm; the right one is its mirror in x = 0).
const ARM_C: XY = [-61, 222.3]
const ARM_R = 64.9, ARM_HW = 6.65, ROW = 5.0
const A_FAR = 104.9 * deg, A_NEAR = 248.5 * deg
const STUB_FAR = 20, STUB_NEAR = 41.4
const COL_Z0 = 1.0, COL_H = 21, COL_R = 1.1
const ENT_Z = 22, ATT_Z = 23.9, ATT_TOP = 28.4
const PAV_HU = 8, PAV_HV = 8.25

// The body.
const RING_R = 72, CORE_R = 66, BODY_R = 74.8
const B_COL_Z0 = 1.5, B_ENT = 24.5, TERRACE = 33, B_TOP = 34.3
const FRONT = { x: 30, y0: 57, y1: 122.9 }, BACK = { x: 29.5, y0: -83.5, y1: -57 }

// The drum and dome.
const NB = 24 // bays round the drum
const DRUM_R = 45.2, DRUM_Z0 = 35.8, DRUM_Z1 = 62.5, DOME_Z = 70, DOME_R = 46.2, DOME_RISE = 52.5

export function build(detail: boolean): Mat[] {
  ARCH_SEGS.n = detail ? 8 : 4
  const stone = new Part() // marble cladding
  const shade = new Part() // recesses, soffits, door openings
  const lead = new Part() // the domes
  const ribP = new Part() // the domes' pale ribs and oculus frames
  const glassW = new Part() // stained glass
  const gold = new Part() // lantern ring, balls, crosses
  const tops = stone

  // ── The arms ──────────────────────────────────────────────────────────
  const armPath = (): { P: PathPt[]; pav: number[] } => {
    const n = detail ? 40 : 16
    const pf: XY = [ARM_C[0] + ARM_R * Math.cos(A_FAR), ARM_C[1] + ARM_R * Math.sin(A_FAR)]
    const pn: XY = [ARM_C[0] + ARM_R * Math.cos(A_NEAR), ARM_C[1] + ARM_R * Math.sin(A_NEAR)]
    const tf: XY = [Math.sin(A_FAR), -Math.cos(A_FAR)] // pointing toward the axis at the far end
    const tn: XY = [-Math.sin(A_NEAR), Math.cos(A_NEAR)]
    const pts: XY[] = [[pf[0] + tf[0] * STUB_FAR, pf[1] + tf[1] * STUB_FAR], ...arcPts(ARM_C[0], ARM_C[1], ARM_R, A_FAR, A_NEAR, n),
      [pn[0] + tn[0] * STUB_NEAR, pn[1] + tn[1] * STUB_NEAR]]
    const P = pathOf(pts)
    return { P, pav: [P[1].s, P[P.length - 2].s] }
  }
  const { P, pav } = armPath()
  const total = P[P.length - 1].s
  const armL = { stone: new Part(), shade: new Part(), lead: new Part(), gold: new Part(), rib: new Part() }
  // podium step, entablature (with its soffit), attic and coping
  if (detail) band(armL.stone, armL.stone, P, ARM_HW + 0.6, 0, COL_Z0, { ends: true })
  band(armL.stone, null, P, ARM_HW + 0.1, ENT_Z, ATT_Z, { bottom: armL.shade, ends: true })
  if (detail) {
    band(armL.stone, null, P, ARM_HW - 0.15, ATT_Z, ATT_TOP - 0.5, { ends: true })
    band(armL.stone, armL.stone, P, ARM_HW, ATT_TOP - 0.5, ATT_TOP, { ends: true })
  } else band(armL.stone, armL.stone, P, ARM_HW - 0.1, ATT_Z, ATT_TOP, { ends: true })
  // columns: two rows, evenly spaced in the runs between the pavilions
  const runs: [number, number, number][] = [[0.8, pav[0] - PAV_HU, 2], [pav[0] + PAV_HU, pav[1] - PAV_HU, 23], [pav[1] + PAV_HU, total - 0.8, 5]]
  for (const [s0, s1, n] of runs) {
    const step = (s1 - s0) / n
    for (let k = 0; k < n; k++) {
      // runs ending free put their last column at the end
      const s = s0 === 0.8 ? s0 + COL_R + k * ((s1 - s0 - COL_R - step / 2) / (n - 0.5)) : s1 === total - 0.8 ? s1 - COL_R - k * ((s1 - s0 - COL_R - step / 2) / (n - 0.5)) : s0 + step * (k + 0.5)
      const q = along(P, s)
      for (const sg of [1, -1]) {
        const x = q.p[0] - q.t[1] * ROW * sg, y = q.p[1] + q.t[0] * ROW * sg
        column(armL.stone, x, y, detail ? COL_Z0 : 0, ENT_Z - (detail ? COL_Z0 : 0), COL_R, detail, 1.35)
        if (detail) {
          // the attic's pilaster block over each column, both faces
          const n: XY = [-q.t[1] * sg, q.t[0] * sg]
          const cxo = q.p[0] + n[0] * (ARM_HW - 0.15), cyo = q.p[1] + n[1] * (ARM_HW - 0.15)
          obox6(armL.stone, armL.stone, null, cxo, cyo, q.t, 1.3, 0.3, ATT_Z, ATT_TOP - 0.5)
        }
      }
    }
  }
  // the pavilions: a square tower through the colonnade, a gabled attic,
  // a square drum with an oculus each face, a ribbed octagonal dome, the
  // ball and the cross
  for (const s of pav) {
    const q = along(P, s), u = q.t, v: XY = [-u[1], u[0]]
    const [cx, cy] = q.p
    obox6(armL.stone, armL.stone, null, cx, cy, u, PAV_HU, PAV_HV, 0, ATT_TOP)
    // corner pilasters
    for (const a of [-1, 1]) for (const b of [-1, 1]) {
      const px = cx + u[0] * a * (PAV_HU - 0.9) + v[0] * b * (PAV_HV - 0.2), py = cy + u[1] * a * (PAV_HU - 0.9) + v[1] * b * (PAV_HV - 0.2)
      obox6(armL.stone, null, null, px, py, u, 0.9, 0.4, 0, ENT_Z)
    }
    // the entablature's band round the tower
    obox6(armL.stone, armL.stone, armL.shade, cx, cy, u, PAV_HU + 0.25, PAV_HV + 0.5, ENT_Z, ATT_Z)
    gable(armL.stone, armL.stone, cx, cy, v, PAV_HV + 0.3, PAV_HU * 0.7, ATT_TOP, 1.7)
    for (const sg of [1, -1]) {
      const n: XY = [v[0] * sg, v[1] * sg]
      const fx = cx + n[0] * (PAV_HV + 0.4), fy = cy + n[1] * (PAV_HV + 0.4)
      // the door: a dark opening in a stone surround with a pediment
      wallPanel(armL.shade, fx, fy, n, 3.0, 1.0, 8.2, false)
      if (detail) {
        obox6(armL.stone, armL.stone, null, fx - n[0] * 0.05, fy - n[1] * 0.05, u, 2.2, 0.25, 8.2, 8.9)
        gable(armL.stone, armL.stone, fx + n[0] * 0.05, fy + n[1] * 0.05, n, 0.3, 2.3, 8.9, 1.1)
        for (const a of [-1, 1]) obox6(armL.stone, null, null, fx + u[0] * a * 1.85, fy + u[1] * a * 1.85, u, 0.35, 0.2, 1.0, 8.2)
      }
    }
    const DR = 5.6, DZ0 = ATT_TOP + 0.6, DZ1 = ATT_TOP + 5.3, OZ = ATT_TOP + 2.9
    obox6(armL.stone, armL.stone, null, cx, cy, u, DR, DR, ATT_TOP - 0.2, DZ1)
    obox6(armL.stone, armL.stone, armL.shade, cx, cy, u, DR + 0.35, DR + 0.35, DZ1, DZ1 + 0.7)
    for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const n: XY = [u[0] * a + v[0] * b, u[1] * a + v[1] * b]
      const ox = cx + n[0] * DR, oy = cy + n[1] * DR, ox2 = ox + n[0] * 0.07, oy2 = oy + n[1] * 0.07
      // the oculus: a round window in a stone ring
      const rr = 1.15, ring: V3[] = [], win: V3[] = [], segs = detail ? 12 : 8
      for (let i = 0; i < segs; i++) {
        const t = (TAU * i) / segs, uu: XY = [-n[1], n[0]]
        ring.push([ox + uu[0] * Math.cos(t) * (rr + 0.4), oy + uu[1] * Math.cos(t) * (rr + 0.4), OZ + Math.sin(t) * (rr + 0.4)])
        win.push([ox2 + uu[0] * Math.cos(t) * rr, oy2 + uu[1] * Math.cos(t) * rr, OZ + Math.sin(t) * rr])
      }
      if (detail) face(armL.stone, ring.map((p) => [p[0] + n[0] * 0.04, p[1] + n[1] * 0.04, p[2]] as V3), [n[0], n[1], 0])
      face(armL.shade, win, [n[0], n[1], 0])
      void DZ0
    }
    // the dome: eight ribbed facets, a bell profile
    const B = DZ1 + 0.7
    const prof: [number, number][] = (detail ? [[6.3, 0], [6.25, 1.9], [5.9, 3.6], [5.1, 5.2], [3.9, 6.5], [2.3, 7.5], [0.7, 7.9], [0, 7.95]]
      : [[6.3, 0], [6.1, 2.8], [5.1, 5.2], [3.1, 7.1], [0, 7.95]]).map(([r, z]) => [r, B + z] as [number, number])
    const ang = Math.atan2(u[1], u[0])
    lathe(armL.lead, cx, cy, prof, 8, { facet: true, phase: ang + Math.PI / 8 })
    if (detail) {
      // ribs on the facet edges
      for (let i = 0; i < 8; i++) {
        const t = ang + Math.PI / 8 + (TAU * i) / 8
        const rib = prof.slice(0, -1).map(([r, z]) => [r + 0.18, z + 0.05] as [number, number])
        lathe(armL.rib, cx, cy, rib, 1, { a0: t - 0.04, a1: t + 0.04 })
      }
    }
    lathe(armL.gold, cx, cy, (detail ? [[0.2, 7.9], [0.75, 8.2], [0.8, 8.8], [0.4, 9.4], [0, 9.5]] : [[0.2, 7.9], [0.8, 8.6], [0, 9.5]]).map(([r, z]) => [r, B + z] as [number, number]), detail ? 8 : 6, { smooth: true })
    cross(armL.gold, cx, cy, u, B + 9.3, B + 13.6, 2.3, 0.3)
  }
  // mirror the left arm to the right
  const mirror = (src: Part, dst: Part) => {
    for (let t = 0; t < src.pos.length / 9; t++) {
      const P3 = [0, 1, 2].map((k) => { const i = t * 9 + k * 3; return [src.pos[i], -src.pos[i + 2], src.pos[i + 1]] as V3 })
      const N3 = [0, 1, 2].map((k) => { const i = t * 9 + k * 3; return [src.nrm[i], -src.nrm[i + 2], src.nrm[i + 1]] as V3 })
      for (const [Q, M] of [[P3, N3], [P3.map(([x, y, z]) => [-x, y, z] as V3), N3.map(([x, y, z]) => [-x, y, z] as V3)]] as [V3[], V3[]][])
        dst.tri(Q[0], Q[1], Q[2], [0, 0], [0, 0], [0, 0], M)
    }
  }
  mirror(armL.stone, stone); mirror(armL.shade, shade); mirror(armL.lead, lead); mirror(armL.gold, gold); mirror(armL.rib, ribP)

  // ── The body: a round core in a ring of columns, the front and back
  // blocks, the attic and the roof terrace ─────────────────────────────
  const inBlock = (x: number, y: number, m = 0) =>
    (Math.abs(x) < FRONT.x + m && y > FRONT.y0 - m && y < FRONT.y1 + m) || (Math.abs(x) < BACK.x + m && y > BACK.y0 - m && y < BACK.y1 + m)
  const bz = detail ? B_COL_Z0 : 0
  const RS = detail ? 72 : 32
  if (detail) lathe(stone, 0, 0, [[BODY_R + 0.8, 0], [BODY_R + 0.8, B_COL_Z0], [CORE_R, B_COL_Z0]], RS)
  lathe(stone, 0, 0, [[CORE_R, bz], [CORE_R, B_ENT]], RS)
  // the attic ring: soffit, entablature, attic, coping, the parapet's inner
  // face and the terrace
  lathe(shade, 0, 0, [[CORE_R, B_ENT], [BODY_R, B_ENT]], RS)
  lathe(stone, 0, 0, [[BODY_R, B_ENT], [BODY_R, 27], [BODY_R - 0.35, 27], [BODY_R - 0.35, B_TOP - 1.1], [BODY_R + 0.1, B_TOP - 1.1],
    [BODY_R + 0.1, B_TOP], [BODY_R - 1.3, B_TOP], [BODY_R - 1.3, TERRACE], [DRUM_R + 4.6, TERRACE]], RS)
  // the ring's columns and its stained-glass windows behind them
  const NC = 48
  for (let k = 0; k < NC; k++) {
    const a = ((k + 0.5) * TAU) / NC, x = RING_R * Math.cos(a), y = RING_R * Math.sin(a)
    if (inBlock(x, y, 2)) continue
    column(stone, x, y, bz, B_ENT - bz, 1.2, detail, 1.45)
    if (k % 2 === 0) {
      const b = ((k + 1) * TAU) / NC, n: XY = [Math.cos(b), Math.sin(b)]
      if (!inBlock(CORE_R * n[0], CORE_R * n[1], 3)) wallPanel(glassW, CORE_R * n[0] * Math.cos(TAU / RS / 2), CORE_R * n[1] * Math.cos(TAU / RS / 2), n, 4.6, 3.5, 19.5, true)
    }
    if (detail) {
      const n: XY = [Math.cos(a), Math.sin(a)]
      obox6(stone, stone, null, n[0] * (BODY_R - 0.2), n[1] * (BODY_R - 0.2), [-n[1], n[0]], 1.5, 0.35, 27, B_TOP - 1.1)
    }
  }
  // the front and back blocks
  for (const [B, sgn] of [[FRONT, 1], [BACK, -1]] as const) {
    const yo = sgn > 0 ? B.y1 : B.y0 // the outer end
    const core = { x0: -B.x + 7, x1: B.x - 7, y0: sgn > 0 ? B.y0 : B.y0 + 6.5, y1: sgn > 0 ? B.y1 - 6.5 : B.y1 }
    if (detail) box(stone, null, -B.x - 0.8, B.x + 0.8, Math.min(B.y0, yo + sgn * 0.8) , Math.max(B.y1, yo + sgn * 0.8), 0, B_COL_Z0)
    if (detail) face(stone, [[-B.x - 0.8, B.y0, B_COL_Z0], [B.x + 0.8, B.y0, B_COL_Z0], [B.x + 0.8, B.y1 + (sgn > 0 ? 0.8 : 0), B_COL_Z0], [-B.x - 0.8, B.y1 + (sgn > 0 ? 0.8 : 0), B_COL_Z0]].map(
      (p) => (sgn < 0 && p[1] === B.y0 ? [p[0], B.y0 - 0.8, p[2]] : p) as V3), [0, 0, 1])
    box(stone, null, core.x0, core.x1, core.y0, core.y1, bz, B_ENT)
    // the entablature and attic block, its soffit, the roof
    prism(stone, null, [[-B.x - 0.3, B.y0], [B.x + 0.3, B.y0], [B.x + 0.3, B.y1], [-B.x - 0.3, B.y1]], B_ENT, B_TOP, shade)
    face(stone, [[-B.x - 0.3, B.y0, B_TOP], [B.x + 0.3, B.y0, B_TOP], [B.x + 0.3, B.y1, B_TOP], [-B.x - 0.3, B.y1, B_TOP]], [0, 0, 1])
    // columns round its three outer sides
    const cy = (B.y0 + B.y1) / 2
    for (let k = 0; k < 10; k++) {
      const x = -B.x + 2 + ((2 * B.x - 4) * k) / 9
      column(stone, x, yo - sgn * 2, bz, B_ENT - bz, 1.3, detail, 1.55)
    }
    for (const sx of [-1, 1]) for (let k = 0; k < 9; k++) {
      const y = yo - sgn * (2 + 6.6 * (k + 1))
      if ((sgn > 0 && y < B.y0 + 1) || (sgn < 0 && y > B.y1 - 1)) continue
      if (Math.hypot(sx * (B.x - 2), y) < BODY_R + 1) continue
      column(stone, sx * (B.x - 2), y, bz, B_ENT - bz, 1.3, detail, 1.55)
    }
    // doors in the end wall: three tall arched openings
    const ny = sgn > 0 ? core.y1 : core.y0
    for (const x of [-9.5, 0, 9.5]) wallPanel(glassW, x, ny, [0, sgn], x === 0 ? 6 : 4.4, B_COL_Z0, x === 0 ? 19 : 15.5, true)
    // windows down its sides
    for (const sx of [-1, 1]) for (const f of [0.3, 0.7]) {
      const y = core.y0 + (core.y1 - core.y0) * f
      if (Math.hypot(core.x1, y) < BODY_R) continue
      wallPanel(glassW, sx * core.x1, y, [sx, 0], 4.2, 4, 18.5, true)
    }
    if (detail) for (let k = 0; k < 10; k++) {
      const x = -B.x + 2 + ((2 * B.x - 4) * k) / 9
      obox6(stone, stone, null, x, yo + sgn * 0.3, [1, 0], 1.5, 0.35, 27, B_TOP - 0.2)
    }
    void cy
  }

  // ── The drum ──────────────────────────────────────────────────────────
  lathe(stone, 0, 0, [[DRUM_R + 4.6, TERRACE], [DRUM_R + 4.6, DRUM_Z0], [DRUM_R, DRUM_Z0]], detail ? NB * 2 : NB)
  lathe(stone, 0, 0, [[DRUM_R, DRUM_Z0], [DRUM_R, DRUM_Z1]], NB, { facet: true })
  for (let k = 0; k < NB; k++) {
    const a = (k * TAU) / NB, n: XY = [Math.cos(a), Math.sin(a)], u: XY = [-n[1], n[0]]
    // the buttress: a pier with a pair of engaged columns, its capital block
    const pr = DRUM_R * Math.cos(Math.PI / NB)
    if (!detail) obox6(stone, stone, null, n[0] * (pr + 1.55), n[1] * (pr + 1.55), u, 2.6, 1.85, DRUM_Z0, DRUM_Z1)
    else obox6(stone, stone, null, n[0] * (pr + 1.0), n[1] * (pr + 1.0), u, 2.6, 1.3, DRUM_Z0, DRUM_Z1)
    if (detail) for (const sg of [-1, 1]) {
      const x = n[0] * (pr + 2.6) + u[0] * sg * 1.45, y = n[1] * (pr + 2.6) + u[1] * sg * 1.45
      column(stone, x, y, DRUM_Z0, DRUM_Z1 - DRUM_Z0, 0.78, true, 0.95)
    }
    // the bay: a tall arched stained-glass window, or a blank panel
    const b = a + Math.PI / NB, m: XY = [Math.cos(b), Math.sin(b)], d = DRUM_R * Math.cos(Math.PI / NB)
    if (k % 2 === 0) {
      wallPanel(glassW, m[0] * d, m[1] * d, m, 5.2, 40.5, 58, true)
      if (detail) wallPanel(stone, m[0] * d, m[1] * d, m, 6.4, 39.8, 58.9, true, 8, 0.03)
    } else {
      // a blank panel: a light stone field in a darker frame
      wallPanel(shade, m[0] * d, m[1] * d, m, 5.4, 41, 56.5, false)
      wallPanel(stone, m[0] * d, m[1] * d, m, 4.4, 41.8, 55.7, false, 8, 0.12)
    }
  }
  // the entablature, the attic band and its blocks over the buttresses
  lathe(stone, 0, 0, [[DRUM_R, DRUM_Z1], [DRUM_R + 4.1, DRUM_Z1], [DRUM_R + 4.1, 64.6], [DRUM_R + 4.6, 64.6], [DRUM_R + 4.6, 65.6],
    [DRUM_R + 1.4, 65.6], [DRUM_R + 1.4, DOME_Z - 0.3], [DOME_R + 0.4, DOME_Z - 0.3], [DOME_R + 0.4, DOME_Z], [DOME_R, DOME_Z]], detail ? NB * 2 : NB)
  if (detail) for (let k = 0; k < NB; k++) {
    const a = (k * TAU) / NB, n: XY = [Math.cos(a), Math.sin(a)]
    obox6(stone, stone, null, n[0] * (DRUM_R + 1.9), n[1] * (DRUM_R + 1.9), [-n[1], n[0]], 2.4, 0.6, 65.6, DOME_Z - 0.3)
  }

  // ── The dome: 24 facets with raised ribs, two rings of oculi ─────────
  const ring = detail ? 14 : 7
  const ztop = 121.6
  const domeAt = (t: number): [number, number] => [DOME_R * Math.cos(t), DOME_Z + DOME_RISE * Math.sin(t)]
  const tTop = Math.asin((ztop - DOME_Z) / DOME_RISE)
  const prof: [number, number][] = Array.from({ length: ring + 1 }, (_, i) => domeAt((tTop * i) / ring))
  lathe(lead, 0, 0, prof, NB, { facet: true })
  // ribs along the facet edges: raised strips 1.7 m wide, 0.6 m proud
  const rr = detail ? ring : 4
  const rp: [number, number][] = Array.from({ length: rr + 1 }, (_, i) => domeAt((tTop * i) / rr))
  for (let k = 0; k < NB; k++) {
    const a = (k * TAU) / NB, w = 1.1 / DOME_R
    const rib = rp.map(([r, z], i) => {
      const t = (tTop * i) / rr
      return [r + 0.8 * Math.cos(t), z + 0.8 * Math.sin(t)] as [number, number]
    })
    if (!detail) {
      // a ridge: two sloped faces from the dome's surface to the rib's crest
      for (const sg of [-1, 1]) for (let i = 0; i < rr; i++) {
        const e = a + sg * w
        const P0: V3 = [rp[i][0] * Math.cos(e), rp[i][0] * Math.sin(e), rp[i][1]], P1: V3 = [rp[i + 1][0] * Math.cos(e), rp[i + 1][0] * Math.sin(e), rp[i + 1][1]]
        const Q0: V3 = [rib[i][0] * Math.cos(a), rib[i][0] * Math.sin(a), rib[i][1]], Q1: V3 = [rib[i + 1][0] * Math.cos(a), rib[i + 1][0] * Math.sin(a), rib[i + 1][1]]
        const t = (tTop * (i + 0.5)) / rr, out: V3 = [Math.cos(t) * Math.cos(a), Math.cos(t) * Math.sin(a), Math.sin(t)]
        quad(ribP, P0, P1, Q1, Q0, norm(add(out, [-Math.sin(a) * sg, Math.cos(a) * sg, 0], 0.7)))
      }
      continue
    }
    lathe(ribP, 0, 0, rib, 1, { a0: a - w, a1: a + w })
    for (const sg of [-1, 1]) {
      const ang = a + sg * w, n: V3 = [-Math.sin(ang) * sg, Math.cos(ang) * sg, 0]
      for (let i = 0; i < rr; i++) {
        const [r0, z0] = rp[i], [r1, z1] = rp[i + 1], [R0, Z0] = rib[i], [R1, Z1] = rib[i + 1]
        const P0: V3 = [r0 * Math.cos(ang), r0 * Math.sin(ang), z0], P1: V3 = [r1 * Math.cos(ang), r1 * Math.sin(ang), z1]
        const Q0: V3 = [R0 * Math.cos(ang), R0 * Math.sin(ang), Z0], Q1: V3 = [R1 * Math.cos(ang), R1 * Math.sin(ang), Z1]
        quad(ribP, P0, P1, Q1, Q0, n)
      }
    }
  }
  // oculi: a lower ring over the window bays, an upper ring over the panels
  for (let k = 0; k < NB; k++) {
    const b = ((k + 0.5) * TAU) / NB, up = k % 2 === 1
    const t = up ? 0.62 : 0.3, [r, z] = domeAt(t)
    const nn = norm([Math.cos(t) / DOME_R * DOME_R, 0, Math.sin(t) * DOME_R / DOME_RISE])
    const n: V3 = norm([nn[0] * Math.cos(b), nn[0] * Math.sin(b), nn[2]])
    const fr = r * Math.cos(Math.PI / NB) // on the facet
    const c: V3 = [fr * Math.cos(b), fr * Math.sin(b), z]
    const uu: V3 = [-Math.sin(b), Math.cos(b), 0], vv = norm([-n[2] * Math.cos(b), -n[2] * Math.sin(b), nn[0]])
    const disc = (p: Part, rad: number, off: number, segs: number) => {
      const pts: V3[] = []
      for (let i = 0; i < segs; i++) {
        const a = (TAU * i) / segs
        pts.push(add(add(add(c, n, off), uu, rad * Math.cos(a)), vv, rad * Math.sin(a)))
      }
      face(p, pts, n)
    }
    if (detail) {
      // a framed oculus standing proud of the dome
      const segs = 10, R0 = 1.75, R1 = 1.2, H = 0.6
      for (let i = 0; i < segs; i++) {
        const a0 = (TAU * i) / segs, a1 = (TAU * (i + 1)) / segs
        const e = (a: number, rad: number, off: number) => add(add(add(c, n, off), uu, rad * Math.cos(a)), vv, rad * Math.sin(a))
        const rn = (a: number): V3 => norm(add(uu, vv, 0).map((_, j) => uu[j] * Math.cos(a) + vv[j] * Math.sin(a)) as V3)
        quad(ribP, e(a0, R0, -0.3), e(a1, R0, -0.3), e(a1, R0, H), e(a0, R0, H), [rn(a0), rn(a1), rn(a1), rn(a0)])
        quad(ribP, e(a0, R0, H), e(a1, R0, H), e(a1, R1, H), e(a0, R1, H), n)
      }
      disc(glassW, R1, H - 0.1, segs)
    } else disc(glassW, up ? 1.8 : 2.2, 0.15, 6)
  }

  // ── The lantern: the bronze ring, the open lantern, the ball, the cross
  lathe(gold, 0, 0, detail ? [[8.4, 121.0], [8.6, 122.0], [8.2, 123.0], [7.2, 124.0], [6.0, 124.8], [4.2, 125.2], [0, 125.2]] : [[8.4, 121.0], [8.6, 122.2], [6.6, 124.5], [4.2, 125.2], [0, 125.2]], detail ? 24 : 12, { smooth: true })
  lathe(shade, 0, 0, [[2.3, 125], [2.3, 134.5]], detail ? 12 : 6)
  const LC = 8
  for (let k = 0; k < LC; k++) {
    const a = ((k + 0.5) * TAU) / LC
    if (detail) column(gold, 3.3 * Math.cos(a), 3.3 * Math.sin(a), 125.2, 9.3, 0.38, true, 0.45)
    else lathe(gold, 3.3 * Math.cos(a), 3.3 * Math.sin(a), [[0.45, 125.2], [0.4, 134.5]], 4)
  }
  lathe(gold, 0, 0, [[4.0, 134.5], [4.0, 135.6], [3.4, 135.8], [2.5, 136.8], [1.2, 137.4], [0, 137.5]], detail ? 16 : 10, { smooth: false })
  const ball: [number, number][] = []
  for (let i = 0; i <= (detail ? 10 : 5); i++) {
    const t = -Math.PI / 2 + (Math.PI * i) / (detail ? 10 : 5)
    ball.push([3.3 * Math.cos(t), 140.6 + 3.3 * Math.sin(t)])
  }
  lathe(gold, 0, 0, ball, detail ? 16 : 10, { smooth: true })
  lathe(gold, 0, 0, [[0.8, 143.7], [0.6, 145.2], [0, 145.2]], 6)
  cross(gold, 0, 0, [1, 0], 145, 158, 6.5, 0.9)

  const lit = (p: V3, n: V3) => (n[2] > 0.85 ? 0.25 : 0.9)
  void tops
  return [
    { part: stone, material: { ...finish('yamoussoukro-marble', 0xd8c5a4), floodlight: lit } },
    { part: shade, material: finish('yamoussoukro-shade', 0xb09d80) },
    { part: lead, material: { ...finish('yamoussoukro-dome', 0xc9cfd1, 0.6), floodlight: lit } },
    { part: ribP, material: { ...finish('yamoussoukro-dome-rib', 0xeceeea, 0.6), floodlight: lit } },
    { part: glassW, material: PALETTE.window },
    { part: gold, material: { ...finish('yamoussoukro-gilt', 0xc9a463, 0.5), floodlight: (p) => (p[2] > 100 ? 0.8 : 0.4) } },
  ]
}

/** A Latin cross from z0 to z1, its arm `w` wide at three quarters up, bars `t` thick, facing u. */
export function cross(p: Part, cx: number, cy: number, u: XY, z0: number, z1: number, w: number, t: number) {
  const h = z1 - z0, za = z0 + h * 0.72
  obox6(p, p, null, cx, cy, u, t / 2, t / 2, z0, z1)
  obox6(p, p, p, cx, cy, u, w / 2, t / 2, za - t / 2, za + t / 2)
}

if (import.meta.main) {
  const extras = { bearing: 31.2, osm: 'way/89584501', height: 158 }
  await save('yamoussoukro-basilica.glb', 'Basilica of Our Lady of Peace', build(false), 6500, 250_000, extras)
  await save('yamoussoukro-basilica.detail.glb', 'Basilica of Our Lady of Peace', build(true), 40_000, 1536 * 1024, extras)
}
