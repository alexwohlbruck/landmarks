/**
 * Tech Tower (Lettie Pate Whitehead Evans Administration Building), Georgia
 * Institute of Technology, Atlanta (1888, Bruce & Morgan) — original
 * procedural geometry, CC0-1.0.
 * bun generators/atl-tech-tower.ts
 *
 * This file also holds the small kit the other B9 Atlanta models import
 * (atl-kessler-campanile, atl-fox-theatre, atl-high-museum,
 * atl-millennium-gate, atl-rhodes-hall): hip and gable roofs, pyramids,
 * solids of revolution, arched and flat panels on a wall plane. It builds on
 * the B4 kit in generators/atl-flatiron-building.ts (already merged). The
 * Tech Tower's own build runs only when this file is run directly.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 0: the plan is OSM's outline as drawn (its walls
 * run within a degree of north-south). Anchor = centroid of OSM
 * way/42706709 ("Lettie Pate Whithead Evans Administration Building",
 * short_name Tech Tower, Georgia Tech building 35), 33.772472, -84.394686.
 * The building:part way/28951319 ("Tech Tower", building:part=tower) lies
 * inside it.
 *
 * Identity: a four-storey red-brick High Victorian block on a hill top, its
 * main front facing south down a lawn and a long flight of steps. Cream
 * stone string courses and window heads; a grey slate hip roof with gabled
 * end pavilions on the front; a square central tower rising through the
 * front with a big round-arched window, a plain upper shaft, a cornice
 * carrying the gold "TECH" letters on all four sides between little
 * corner pinnacles, and a steep pale green-blue slate spire with a gold
 * finial. A lower two-storey north wing with tall round-arched windows over
 * a grey stone base. The letters are lit at night; the tower is floodlit.
 *
 * Evidence:
 *  - plan: OSM way/42706709 as drawn for the walls. The tower, the wings
 *    and the low north wing are split from it along the lines the lidar
 *    roof heights show.
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 0.5 m
 *    grid, above ground_min 296.5 m; the ground at the building's low east
 *    and south-east side is about 3 m above that, which is y = 0 here.
 *    Measured (model metres): main eaves about 19, main ridges 23–24,
 *    the low north wing eaves about 10.5 and ridge 14.5, the tower's cornice
 *    31.5 (lidar 34.5), the spire's top about 40 (lidar 39–43). The tower
 *    shaft measures about 7.5 m square at x -5..2, y -17..-10, which is
 *    where it is drawn (OSM's tower part sits 1.7 m north of the lidar).
 *  - storeys, string courses, windows and the letters: scaled from the
 *    Mistercontributer photos (the tower is the scale: 7 m wide). The
 *    letters are about 1.8 m tall, standing on the tower cornice.
 *  - ground: Mapterhorn falls 3 m across the footprint, from about 5 m on
 *    the north-west to 2 m at the south-east corner; elevation 0. The
 *    walls on the uphill west and north run down to y = 0 and sink in.
 *  - colours: red brick, cream stone trim, grey slate, the spire's pale
 *    patina-blue slate and the gold letters, all from the daylight photos.
 *
 * Famous sign: the "TECH" letters are the landmark's identity, so they are
 * modelled as lettering (STYLE.md, "Famous signs"), traced from the photos:
 * a bold Roman with bracketed slab serifs. Each letter is about 1.8 m tall
 * on a 7 m face, between the corner pinnacles, standing on the cornice top
 * just inside its edge. Material `neon-tech-gold`: they are lit at night.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Tech Tower Building - 2.jpg, Mistercontributer, CC0 (south front, from
 *    the steps) https://commons.wikimedia.org/wiki/File:Tech_Tower_Building_-_2.jpg
 *  - Tech Tower Building - 11.jpg, Mistercontributer, CC0 (from the
 *    south-west) https://commons.wikimedia.org/wiki/File:Tech_Tower_Building_-_11.jpg
 *  - Tech Tower Building - 7.jpg, Mistercontributer, CC0 (the west side and
 *    the tower) https://commons.wikimedia.org/wiki/File:Tech_Tower_Building_-_7.jpg
 *  - Tech Tower Building - 1.jpg, Mistercontributer, CC0 (the north wing
 *    and the east side) https://commons.wikimedia.org/wiki/File:Tech_Tower_Building_-_1.jpg
 *  - Tech Tower in Atlanta.jpg, Tyler Lahti, CC BY-SA 2.0 (from the south
 *    lawn, far) https://commons.wikimedia.org/wiki/File:Tech_Tower_in_Atlanta.jpg
 *  - Tech Tower sideview.jpg, Mistercontributer, CC BY-SA 3.0 (the letters)
 *    https://commons.wikimedia.org/wiki/File:Tech_Tower_sideview.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the north and east sides are seen only through trees (ttb-1);
 * their window rhythm is drawn like the south and west. The dormers, the
 * chimneys, the porch on the east bay and the entrance arcade's columns are
 * left out. The roof is simplified to hips and front gables.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { Pen, strokes } from './lettering'
import { at, box, capPoly, ccw, cornice, edgePanels, offset, prism, save, split, wall, type XY } from './atl-flatiron-building'

// ─────────────────────────────────── kit ───────────────────────────────────

/**
 * A hip roof over a rectangle: eaves at z0 all round, ridge at z1 along the
 * longer side (a pyramid when square). `over` is the eave overhang.
 */
export function hipRoof(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, over = 0.4) {
  x0 -= over; x1 += over; y0 -= over; y1 += over
  const w = x1 - x0, d = y1 - y0
  const a: V3 = [x0, y0, z0], b: V3 = [x1, y0, z0], c: V3 = [x1, y1, z0], e: V3 = [x0, y1, z0]
  if (w >= d) {
    const h = d / 2, ym = (y0 + y1) / 2
    const r0: V3 = [x0 + h, ym, z1], r1: V3 = [x1 - h, ym, z1]
    p.quad(a, b, r1, r0); p.quad(c, e, r0, r1); p.tri(b, c, r1); p.tri(e, a, r0)
  } else {
    const h = w / 2, xm = (x0 + x1) / 2
    const r0: V3 = [xm, y0 + h, z1], r1: V3 = [xm, y1 - h, z1]
    p.quad(b, c, r1, r0); p.quad(e, a, r0, r1); p.tri(a, b, r0); p.tri(c, e, r1)
  }
  p.quad(a, e, c, b) // soffit
}

/**
 * A gable roof over a rectangle, ridge along `axis` at z1, eaves at z0; the
 * gable triangles go in `gable` (wall material). `over` overhangs the eaves
 * and `rake` the gable ends.
 */
export function gableRoof(p: Part, gable: Part | null, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, axis: 'x' | 'y', over = 0.4, rake = 0.3) {
  if (axis === 'y') {
    const xm = (x0 + x1) / 2
    const s = (z1 - z0) / ((x1 - x0) / 2)
    const lo = z0 - over * s
    const A: V3 = [x0 - over, y0 - rake, lo], B: V3 = [xm, y0 - rake, z1], C: V3 = [x1 + over, y0 - rake, lo]
    const A2: V3 = [x0 - over, y1 + rake, lo], B2: V3 = [xm, y1 + rake, z1], C2: V3 = [x1 + over, y1 + rake, lo]
    p.quad(A2, A, B, B2); p.quad(C, C2, B2, B)
    p.quad(A, A2, C2, C) // soffit
    // the roof's thickness at the rakes
    const t = 0.25
    p.quad([A[0], A[1], A[2] - t], [C[0], C[1], C[2] - t], C, A)
    if (gable) {
      gable.tri([x0, y0, z0], [x1, y0, z0], [xm, y0, z1 - 0.05])
      gable.tri([x1, y1, z0], [x0, y1, z0], [xm, y1, z1 - 0.05])
    }
  } else {
    const ym = (y0 + y1) / 2
    const s = (z1 - z0) / ((y1 - y0) / 2)
    const lo = z0 - over * s
    const A: V3 = [x0 - rake, y0 - over, lo], B: V3 = [x0 - rake, ym, z1], C: V3 = [x0 - rake, y1 + over, lo]
    const A2: V3 = [x1 + rake, y0 - over, lo], B2: V3 = [x1 + rake, ym, z1], C2: V3 = [x1 + rake, y1 + over, lo]
    p.quad(A, A2, B2, B); p.quad(C2, C, B, B2)
    p.quad(A2, A, C, C2)
    if (gable) {
      gable.tri([x0, y1, z0], [x0, y0, z0], [x0, ym, z1 - 0.05])
      gable.tri([x1, y0, z0], [x1, y1, z0], [x1, ym, z1 - 0.05])
    }
  }
}

/** A pyramid over a square of half-size `h` about c, from z0 to apex z1. */
export function pyramid(p: Part, c: XY, h: number, z0: number, z1: number, n = 4, phase = Math.PI / 4) {
  const r = h / Math.cos(Math.PI / n)
  const ring: V3[] = Array.from({ length: n }, (_, i) => {
    const a = phase + (i / n) * Math.PI * 2
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z0]
  })
  const apex: V3 = [c[0], c[1], z1]
  for (let i = 0; i < n; i++) p.tri(ring[i], ring[(i + 1) % n], apex)
  p.cap(ring, false)
}

/**
 * A solid of revolution about the vertical axis through c: `prof` is a list
 * of [radius, z] from bottom to top. Smooth-shaded unless `flat`. A radius
 * of 0 at either end closes it to a point; otherwise the ends are capped.
 */
export function revolve(p: Part, c: XY, prof: [number, number][], n = 16, phase = 0, flat = false, caps = true) {
  const segN = prof.slice(0, -1).map(([r0, z0], k) => {
    const [r1, z1] = prof[k + 1]
    const nr = z1 - z0, nz = -(r1 - r0), l = Math.hypot(nr, nz) || 1
    return [nr / l, nz / l] as [number, number]
  })
  const vN = prof.map((_, k) => {
    const a = segN[Math.max(0, k - 1)], b = segN[Math.min(segN.length - 1, k)]
    const r = a[0] + b[0], z = a[1] + b[1], l = Math.hypot(r, z) || 1
    return [r / l, z / l] as [number, number]
  })
  const ang = (i: number) => phase + (i / n) * Math.PI * 2
  const P = (k: number, i: number): V3 => [c[0] + prof[k][0] * Math.cos(ang(i)), c[1] + prof[k][0] * Math.sin(ang(i)), prof[k][1]]
  const N = (k: number, i: number, seg?: number): V3 => {
    const q = seg !== undefined ? segN[seg] : vN[k]
    return [q[0] * Math.cos(ang(i)), q[0] * Math.sin(ang(i)), q[1]]
  }
  for (let k = 0; k < prof.length - 1; k++) {
    for (let i = 0; i < n; i++) {
      const j = i + 1
      const a = P(k, i), b = P(k, j), cc = P(k + 1, j), d = P(k + 1, i)
      if (flat) {
        if (prof[k][0] > 1e-6) p.tri(a, b, cc)
        if (prof[k + 1][0] > 1e-6) p.tri(a, cc, d)
        continue
      }
      const s = k
      const na = N(k, i, undefined), nb = N(k, j, undefined), nc = N(k + 1, j, undefined), nd = N(k + 1, i, undefined)
      void s
      if (prof[k][0] > 1e-6) p.tri(a, b, cc, undefined, undefined, undefined, [na, nb, nc])
      if (prof[k + 1][0] > 1e-6) p.tri(a, cc, d, undefined, undefined, undefined, [na, nc, nd])
    }
  }
  if (!caps) return
  const ringAt = (k: number): V3[] => Array.from({ length: n }, (_, i) => P(k, i))
  if (prof[0][0] > 1e-6) p.cap(ringAt(0), false)
  const last = prof.length - 1
  if (prof[last][0] > 1e-6) p.cap(ringAt(last), true)
}

/**
 * A flat convex shape on a wall: the wall runs from a to b with its outside
 * to the right (a counter-clockwise ring's edge), and `pts` are [s, z] with
 * s along a→b. `out` lifts it off the wall.
 */
export function onWall(p: Part, a: XY, b: XY, pts: [number, number][], out = 0.05) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [t[1], -t[0]]
  const P = ([s, z]: [number, number]): V3 => [a[0] + t[0] * s + nn[0] * out, a[1] + t[1] * s + nn[1] * out, z]
  // Wind it to face out of the wall whichever way the points run.
  const ar = pts.reduce((acc, p0, i) => { const p1 = pts[(i + 1) % pts.length]; return acc + p0[0] * p1[1] - p1[0] * p0[1] }, 0)
  const q = (ar < 0 ? [...pts].reverse() : pts).map(P)
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}

/** The outline of a round-headed opening: width w centred at s, from z0, springing at zs. */
export function archShape(s: number, w: number, z0: number, zs: number, seg = 8): [number, number][] {
  const r = w / 2
  const pts: [number, number][] = [[s - r, z0], [s + r, z0]]
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI
    pts.push([s + r * Math.cos(a), zs + r * Math.sin(a)])
  }
  return pts
}

/** A rectangle [s0, s1] × [z0, z1] as an onWall shape. */
export const rectShape = (s0: number, s1: number, z0: number, z1: number): [number, number][] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]

/** A string course: a thin band standing `out` off every face of a ring. */
export function band(p: Part, ring: XY[], z: number, h: number, out = 0.12, top: Part | null = p) {
  const o = offset(ring, out)
  wall(p, o, z, z + h)
  p.loft([at(ring, z), at(o, z)])
  if (top) {
    // the band's top ledge
    const n = o.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      top.quad([ring[i][0], ring[i][1], z + h], [ring[j][0], ring[j][1], z + h], [o[j][0], o[j][1], z + h], [o[i][0], o[i][1], z + h])
    }
  }
}

export { at, box, capPoly, ccw, cornice, edgePanels, offset, prism, save, split, wall }
export type { XY }

// ────────────────────────────── the Tech Tower ─────────────────────────────

if (import.meta.main) {
  const brick = new Part(), trim = new Part(), win = new Part(), roof = new Part(), spire = new Part(), gold = new Part()

  // OSM way/42706709 in the frame (bearing 0, about the anchor).
  const R = ccw([[3.17, 21.79], [3.15, 20.03], [6.33, 20.00], [6.24, 11.34], [6.22, 8.30], [18.80, 8.18], [18.80, 6.93], [18.68, -1.52], [19.71, -1.54], [21.77, -3.57], [21.73, -6.43], [19.63, -8.39], [16.26, -8.36], [16.19, -14.90], [7.20, -14.81], [7.19, -15.72], [1.89, -15.66], [1.88, -16.88], [-2.07, -16.83], [-3.86, -16.82], [-4.67, -16.81], [-4.65, -15.77], [-9.96, -15.53], [-9.94, -14.61], [-11.32, -14.59], [-12.19, -15.51], [-16.67, -15.45], [-17.12, -14.54], [-18.67, -14.67], [-18.82, -9.47], [-18.69, -3.22], [-16.34, -3.14], [-16.61, 10.59], [-8.22, 10.49], [-8.38, 20.15], [-5.20, 20.11], [-5.17, 21.88], [-3.39, 23.62], [1.43, 23.56], [3.06, 21.89]])
  // The full-height U: the front range and the two wings (lidar eaves ~19 m).
  const U = ccw([[6.22, 8.30], [18.80, 8.18], [18.80, 6.93], [18.68, -1.52], [19.71, -1.54], [21.77, -3.57], [21.73, -6.43], [19.63, -8.39], [16.26, -8.36], [16.19, -14.90], [7.20, -14.81], [7.19, -15.72], [1.89, -15.66], [1.88, -16.88], [-4.67, -16.81], [-4.65, -15.77], [-9.96, -15.53], [-9.94, -14.61], [-11.32, -14.59], [-12.19, -15.51], [-16.67, -15.45], [-17.12, -14.54], [-18.67, -14.67], [-18.82, -9.47], [-18.69, -3.22], [-16.34, -3.14], [-16.61, 10.59], [-8.22, 10.49], [-8.25, 0], [6.23, 0]])

  const BASE = 3.2 // the grey stone basement's top (the water table)
  const LOW = 10.5 // the north wing's eaves
  const EAVE = 19 // the main eaves
  const RIDGE = 22.3
  // Tower shaft (lidar), its cornice and the spire.
  const TX0 = -4.9, TX1 = 2.1, TY0 = -17.35, TY1 = -9.9, TC: XY = [(TX0 + TX1) / 2, (TY0 + TY1) / 2], TH = (TX1 - TX0) / 2
  const TCOR = 31.5, SPIRE = 40

  // ── Massing ──
  // The grey stone basement all round, then brick.
  const Rs = split(R, 5), Us = split(U, 5)
  wall(roof, Rs, 0, BASE)
  wall(brick, Rs, BASE, LOW)
  capPoly(roof, R, LOW, true)
  wall(brick, Us, LOW, EAVE)
  capPoly(roof, U, EAVE, true)
  // Cream stone: the water table, a course at each floor, and the eaves cornice.
  band(trim, Rs, BASE - 0.1, 0.45, 0.14)
  band(trim, Us, 11.9, 0.35, 0.1, null)
  cornice(trim, U, EAVE - 0.7, 0.7, 0.45, null)

  // Roofs: the front range, the two wings, the low north wing and the bay.
  hipRoof(roof, -18.75, 16.25, -15.6, -1.0, EAVE, RIDGE)
  hipRoof(roof, -16.5, -8.3, -6, 10.5, EAVE, RIDGE - 0.8)
  hipRoof(roof, 6.3, 18.75, -6, 8.2, EAVE, RIDGE - 0.8)
  hipRoof(roof, -8.3, 6.25, 0, 22.5, LOW, 14.5)
  hipRoof(roof, 16.3, 21.7, -8.3, -1.6, EAVE, 22)
  // The front pavilions' gables, facing south (the photos' two big gables).
  const gable = (x0: number, x1: number, yf: number) => {
    gableRoof(roof, brick, x0, x1, yf, -6, EAVE, 23.6, 'y', 0.35, 0.35)
    // a round-headed attic window in the gable
    onWall(win, [x0, yf], [x1, yf], archShape((x1 - x0) / 2, 1.5, EAVE + 0.4, EAVE + 1.6))
    // a cream coping line under the rake would be too thin; a stone sill instead
    box(trim, x0 + 0.2, x1 - 0.2, yf - 0.12, yf + 0.3, EAVE - 0.05, EAVE + 0.35, trim, 0.1)
  }
  gable(-18.6, -11.4, -15.45)
  gable(7.3, 16.2, -14.85)

  // ── The tower ──
  // The shaft (projecting through the front), a stone course at the main
  // eaves, the arched window storey, the belfry storey and the cornice.
  prism(brick, [[TX0, TY0], [TX1, TY0], [TX1, TY1], [TX0, TY1]], 0, TCOR - 1.2, null, 0)
  for (const z of [EAVE - 0.9, 24.0]) cornice(trim, ccw([[TX0, TY0], [TX1, TY0], [TX1, TY1], [TX0, TY1]]), z, 0.45, 0.18, trim)
  cornice(trim, ccw([[TX0, TY0], [TX1, TY0], [TX1, TY1], [TX0, TY1]]), TCOR - 1.2, 1.2, 0.55, trim)
  // Corner pinnacles on the cornice, with little pyramid caps.
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const cx = TC[0] + sx * (TH + 0.05), cy = TC[1] + sy * (TH + 0.05)
    box(trim, cx - 0.42, cx + 0.42, cy - 0.42, cy + 0.42, TCOR, TCOR + 1.6, null, 0.1)
    pyramid(spire, [cx, cy], 0.5, TCOR + 1.6, TCOR + 2.9)
  }
  // The spire: a steep pyramid, flared slightly at its foot.
  const SB = TH - 0.45
  revolve(spire, TC, [[(SB + 0.35) / Math.cos(Math.PI / 4), TCOR], [SB / Math.cos(Math.PI / 4), TCOR + 0.9], [0, SPIRE - 0.8]], 4, Math.PI / 4, true)
  // Gold finial.
  revolve(gold, TC, [[0.22, SPIRE - 1.0], [0.3, SPIRE - 0.6], [0.08, SPIRE - 0.2], [0.05, SPIRE + 0.6], [0, SPIRE + 0.7]], 6, 0, true)

  // The TECH letters: a bold Roman with bracketed slab serifs, cap height
  // 1, traced from the photos. Each glyph returns its pen and advance.
  const serif = 0.16
  function glyph(ch: string): [Pen, number] {
    const p = new Pen()
    switch (ch) {
      case 'T':
        p.moveTo([0, 0.9]).lineTo([0, 1]).lineTo([0.76, 1]).lineTo([0.76, 0.9])
        p.moveTo([0.38, 1]).lineTo([0.38, 0])
        p.moveTo([0.38 - serif, 0]).lineTo([0.38 + serif, 0])
        return [p, 0.76]
      case 'E':
        p.moveTo([0.66, 0.86]).lineTo([0.66, 1]).lineTo([0.08, 1]).lineTo([0.08, 0]).lineTo([0.68, 0]).lineTo([0.68, 0.16])
        p.moveTo([0.08, 0.52]).lineTo([0.48, 0.52])
        p.moveTo([0.48, 0.42]).lineTo([0.48, 0.62])
        p.moveTo([-0.06, 1]).lineTo([0.08, 1]); p.moveTo([-0.06, 0]).lineTo([0.08, 0])
        return [p, 0.72]
      case 'C':
        p.moveTo([0.68, 0.98]).lineTo([0.68, 0.74])
        p.moveTo([0.68, 0.8]).cubicTo([0.6, 1.04], [0.04, 1.08], [0.04, 0.5], 6).cubicTo([0.04, -0.08], [0.62, -0.04], [0.7, 0.2], 6)
        return [p, 0.74]
      case 'H':
        p.moveTo([0.06, 1]).lineTo([0.06, 0]); p.moveTo([0.7, 1]).lineTo([0.7, 0]); p.moveTo([0.06, 0.52]).lineTo([0.7, 0.52])
        for (const x of [0.06, 0.7]) for (const y of [0, 1]) p.moveTo([x - serif, y]).lineTo([x + serif, y])
        return [p, 0.76]
    }
    throw new Error(ch)
  }
  const word = new Pen()
  let u = 0
  for (const ch of 'TECH') {
    const [g, adv] = glyph(ch)
    word.add(g, u)
    u += adv + 0.14
  }
  const wordW = u - 0.14
  const CAP = 1.75, Z0 = TCOR + 0.25
  // One word on each face, centred, just inside the cornice edge.
  const faces: Array<{ n: XY; t: XY }> = [
    { n: [0, -1], t: [1, 0] }, // south: reader faces north, u runs east
    { n: [1, 0], t: [0, 1] }, // east
    { n: [0, 1], t: [-1, 0] }, // north
    { n: [-1, 0], t: [0, -1] }, // west
  ]
  for (const f of faces) {
    const d = TH + 0.12 // the letters' back face: on the cornice top, in front of the spire
    const place = (uu: number, v: number, w: number): V3 => {
      const s = (uu - wordW / 2) * CAP
      return [TC[0] + f.n[0] * (d + w * CAP) + f.t[0] * s, TC[1] + f.n[1] * (d + w * CAP) + f.t[1] * s, Z0 + v * CAP]
    }
    strokes(gold, word.paths, { width: 0.22, depth: 0.2, place, back: true })
  }

  // ── Windows ──
  // Storeys: basement (mostly below the lawn), then four floors of tall
  // windows in pairs and threes, about 3 m to a bay; one panel per window
  // group with brick piers between.
  const shaft = { group: 3.9, gap: 0.9, bay: 2.4, pier: 1.15, margin: 1.1, min: 2.6 }
  const isTower = (a: XY, b: XY) => Math.min(a[0], b[0]) > TX0 - 0.3 && Math.max(a[0], b[0]) < TX1 + 0.3 && Math.max(a[1], b[1]) < TY1
  for (let i = 0; i < U.length; i++) {
    const a = U[i], b = U[(i + 1) % U.length]
    if (isTower(a, b)) continue
    // The court walls over the low wing show only above its roof.
    const inner = Math.min(a[1], b[1]) > -0.1 && Math.min(a[0], b[0]) > -8.4 && Math.max(a[0], b[0]) < 6.4
    edgePanels(win, a, b, inner ? 15.0 : BASE + 0.9, EAVE - 0.9, inner ? { ...shaft, group: 3.2 } : shaft)
  }
  // The low north wing: tall round-headed windows over the stone base.
  for (let i = 0; i < R.length; i++) {
    const a = R[i], b = R[(i + 1) % R.length]
    if (a[1] < 10.4 || b[1] < 10.4) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.round(L / 3.4)
    for (let j = 0; j < k; j++) onWall(win, a, b, archShape((j + 0.5) * L / k, 1.7, BASE + 0.8, 8.2))
  }

  // The tower's front: the entrance arcade (two round arches), the
  // three-light window, the big round-arched window, the belfry windows.
  const tf: [XY, XY] = [[TX0, TY0], [TX1, TY0]], tw = TX1 - TX0
  onWall(win, tf[0], tf[1], archShape(tw / 2 - 1.15, 1.9, 2.2, 5.0))
  onWall(win, tf[0], tf[1], archShape(tw / 2 + 1.15, 1.9, 2.2, 5.0))
  onWall(win, tf[0], tf[1], rectShape(1.5, tw - 1.5, 7.4, 10.2))
  onWall(win, tf[0], tf[1], rectShape(1.5, tw - 1.5, 11.6, 14.6))
  onWall(win, tf[0], tf[1], archShape(tw / 2, 3.8, 18.4, 21.3, 10))
  // The belfry storey: three lights on every face above the roofs.
  const tRing = ccw([[TX0, TY0], [TX1, TY0], [TX1, TY1], [TX0, TY1]])
  for (let i = 0; i < 4; i++) {
    const a = tRing[i], b = tRing[(i + 1) % 4]
    onWall(win, a, b, rectShape(1.9, tw - 1.9, 25.4, 28.0))
  }
  // A stone entrance surround under the arches.
  onWall(trim, tf[0], tf[1], rectShape(0.7, tw - 0.7, 1.5, 6.4), 0.03)

  // Night: the windows glow, the letters are lit, and the tower is floodlit
  // from below (brightest on its upper shaft, fading toward the spire).
  const inTower = (p: V3) => p[0] > TX0 - 0.8 && p[0] < TX1 + 0.8 && p[1] > TY0 - 0.8 && p[1] < TY1 + 0.8 && p[2] > EAVE - 1
  await save('atl-tech-tower', 'Tech Tower', [
    { part: brick, material: { ...finish('tech-brick', 0xb4604c), floodlight: (p, n) => (inTower(p) && n[2] < 0.5 ? 0.85 : 0) } },
    { part: trim, material: { ...finish('tech-stone', 0xf0e2c8), floodlight: (p, n) => (inTower(p) && n[2] < 0.5 ? 0.85 : 0) } },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('tech-slate', 0x8a9097) },
    { part: spire, material: { ...finish('tech-spire-slate', 0x9cbfbd), floodlight: (p) => (p[2] < 34 ? 0.5 : 0.25) } },
    { part: gold, material: finish('neon-tech-gold', 0xe8b83a) },
  ], { height: SPIRE + 0.7, anchor: [33.772472, -84.394686], bearing: 0 }, 6500)
}
