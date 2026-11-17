/**
 * The King: Concourse Corporate Center VI, Sandy Springs (Thompson, Ventulett,
 * Stainback & Associates; 34 storeys) — original procedural geometry, CC0-1.0.
 * bun generators/atl-king-tower.ts [out.glb]
 *
 * This file also exports `concourseTower`, the shared King/Queen kit that
 * generators/atl-queen-tower.ts imports: the two towers are one design (same
 * plan, same storey heights, same absolute tier levels), and differ only in
 * their crowns and in the ground they stand on. The King's own build runs
 * only when this file is run directly.
 *
 * Identity. Wikipedia ("Concourse at Landmark Center") and the Commons file
 * names agree: the squared-top "king" is Corporate Center VI, the tower next
 * to GA-400 (the west one, OSM way/197315978, loc_name "King tower"); the
 * round-arched "queen" is Corporate Center V, east of it (way/64986738). The
 * batch plan had the two the other way round; the ids follow the crowns.
 *
 * Map frame: x, y, z up, metres, origin at the anchor on the lowest ground.
 * Anchor = area centroid of OSM way/197315978, 33.917047, -84.355811.
 * Bearing 45.5: the outline's faces run at 45.6° and 135.2° (OSM), so the
 * model's faces are square to its own axes and its corners point N, E, S, W.
 *
 * What makes it the King, from the photos below:
 *  - a dark blue mirror-glass shaft, banded with navy spandrels, on a square
 *    plan with a pointed prow in the middle of each face (a 45°-turned square
 *    through the main one) and a notch cut out of every corner;
 *  - a ziggurat top: the corners stop at storey ~28, the turned square
 *    (prows) at ~31, a smaller square core at the roof;
 *  - a big white crown of open square portal frames stepping up to a central
 *    cluster and a spire; lit white (or in colours) at night.
 *
 * Evidence:
 *  - plan: OSM way/197315978 (a 50 m square; edges 49.4–49.9 m), and the lidar
 *    footprint in the model frame (the lidar sits about 1.3 m east of OSM;
 *    OSM is followed): square ±24.8; corner notches 4.5 m deep; prows on the
 *    face centres to ±28.5 below 86 m and ±26.5 above, their sides on the line
 *    |x|+|y| = 30; the diamond tier |x|+|y| ≤ 30; top core ±17 with 1.8 m
 *    chamfers. Lidar slices (radial extent on the axes / diagonals): ≥30 m
 *    30 / 29; ≥88 m 26 / 29.5; ≥108 m 26 / 23.5; ≥120 m 20 / 22.5. The shaft
 *    is a straight prism (bar the corner notches) up to 106 m; all of the
 *    taper is in the top three tiers, top core 60% of the base face-on.
 *  - heights: USGS 3DEP lidar GA_Statewide_B3_2018 (2018 flight; B2 had no
 *    points here), 0.5 m grid, above the King's ground (292.35 m, flat within
 *    0.5 m; Mapterhorn agrees): corner notches floored at 27.0 m; prow tips
 *    86.4 m; main square 106.1 m; diamond 118.1 m; core roof 130.4 m; crown
 *    ring 137–141 m, corner frames 141–145, inner frames to 155, central
 *    cluster to 158.0 m (lidar maximum).
 *  - total height 168.6 m: OSM height (Wikipedia's pair, 173.7 and 168.6 m to
 *    the spire tops). The 10.6 m spire above the lidar top is consistent with
 *    the Queen, whose lidar top and OSM height differ by the same 10.6 m.
 *  - the Queen's tiers measure exactly 5.3 m higher above its own ground, and
 *    its ground is 5.3 m lower (287.05 against 292.35 m): the towers share
 *    absolute tier levels, which the kit takes as `dz`.
 *  - storeys: 34 (OSM, Wikipedia); 3.85 m office storeys over an 11 m
 *    three-storey granite base (estimated from Thomson200's base photo).
 *  - crown frame layout: estimated from Thomson200's crown photos, its
 *    footprint and tier heights from the lidar.
 *  - colours: from the daylight photos: dark teal-blue mirror glass (#4f6f80), navy spandrels
 *    (pulled to the palette's lightness, no darker than charcoal), white
 *    crown, pale grey-brown granite base.
 *  - y = 0 is the ground round the tower; elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Concourse_Corporate_Center_V_and_VI_June_2024.jpg, Thomson200, CC0
 *    https://commons.wikimedia.org/wiki/File:Concourse_Corporate_Center_V_and_VI_June_2024.jpg
 *    (both towers, from the south-west: King left, Queen right)
 *  - Concourse_Corporate_Center_VI_and_V,_July_2017_(cropped).jpg, Thomson200, CC0
 *    https://commons.wikimedia.org/wiki/File:Concourse_Corporate_Center_VI_and_V,_July_2017_(cropped).jpg
 *    (the King's crown and ziggurat top close up, the Queen behind)
 *  - Concourse_Corporate_Center_VI,_July_2017.jpg, Thomson200, CC0
 *    https://commons.wikimedia.org/wiki/File:Concourse_Corporate_Center_VI,_July_2017.jpg
 *  - Concourse_Corporate_Center_VI,_Sandy_Springs_July_2017_2.jpg, Thomson200, CC0
 *    https://commons.wikimedia.org/wiki/File:Concourse_Corporate_Center_VI,_Sandy_Springs_July_2017_2.jpg
 *    (the base, a prow and a corner notch from below)
 *  - The_King_and_Queen_towers.jpg, Maksim Sundukov, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:The_King_and_Queen_towers.jpg
 *    (night: both crowns lit white)
 *  - Concourse_at_Landmark_Center,_Office_Buildings.jpg, Mitch Featherston,
 *    CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Concourse_at_Landmark_Center,_Office_Buildings.jpg
 * USGS NAIP not needed (the lidar gives the plan). No look-only sources. No
 * commercial imagery.
 *
 * Doubts: the crown's many thin members are drawn as a few bold frames, about
 * twice their real thickness so they read on a phone; their exact layout is
 * estimated. The facade's per-storey banding is grouped three storeys to a
 * band. The granite base's piers are simplified; the low wings and the
 * parking deck beside the tower are other OSM buildings and are left out.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

// ─────────────────────────────── small kit ───────────────────────────────

type XY = [number, number]
const at = (p: XY, z: number): V3 => [p[0], p[1], z]
/** Turn a point a quarter turn anticlockwise k times. */
const rot = (p: XY, k: number): XY => {
  let [x, y] = p
  for (let i = 0; i < ((k % 4) + 4) % 4; i++) [x, y] = [-y, x]
  return [x, y]
}
const outward = (a: XY, b: XY): XY => {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
  return [(b[1] - a[1]) / l, (a[0] - b[0]) / l]
}
const lerp2 = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

/** A vertical quad over edge a→b of a counter-clockwise ring, facing out. */
function wall(p: Part, a: XY, b: XY, z0: number, z1: number) {
  p.quad(at(a, z0), at(b, z0), at(b, z1), at(a, z1))
}

/** A flat cap over a convex counter-clockwise polygon. */
function cap(p: Part, ring: XY[], z: number, up = true) {
  for (let i = 1; i < ring.length - 1; i++) {
    if (up) p.tri(at(ring[0], z), at(ring[i], z), at(ring[i + 1], z))
    else p.tri(at(ring[0], z), at(ring[i + 1], z), at(ring[i], z))
  }
}

/** A box beam of square section `w` from a to b (both windings not needed: it is closed). */
export function beam(p: Part, a: V3, b: V3, w: number, d = w) {
  const ax: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const L = Math.hypot(...ax)
  const u: V3 = [ax[0] / L, ax[1] / L, ax[2] / L]
  // a side vector not parallel to the beam
  const ref: V3 = Math.abs(u[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  let s: V3 = [u[1] * ref[2] - u[2] * ref[1], u[2] * ref[0] - u[0] * ref[2], u[0] * ref[1] - u[1] * ref[0]]
  const sl = Math.hypot(...s)
  s = [s[0] / sl, s[1] / sl, s[2] / sl]
  const t: V3 = [u[1] * s[2] - u[2] * s[1], u[2] * s[0] - u[0] * s[2], u[0] * s[1] - u[1] * s[0]]
  const corner = (o: V3, i: number): V3 => {
    const [cs, ct] = [[-1, -1], [1, -1], [1, 1], [-1, 1]][i]
    return [o[0] + s[0] * cs * w / 2 + t[0] * ct * d / 2, o[1] + s[1] * cs * w / 2 + t[1] * ct * d / 2, o[2] + s[2] * cs * w / 2 + t[2] * ct * d / 2]
  }
  const A = [0, 1, 2, 3].map((i) => corner(a, i)), B = [0, 1, 2, 3].map((i) => corner(b, i))
  // sides: the ring (s,t) runs anticlockwise seen from +u
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    p.quad(A[i], A[j], B[j], B[i])
  }
  p.quad(B[0], B[1], B[2], B[3])
  p.quad(A[3], A[2], A[1], A[0])
}

/** An axis-aligned open portal frame in the plane through c0→c1 (two posts, a lintel and a sill). */
function portal(p: Part, c0: XY, c1: XY, z0: number, z1: number, w: number, sill = true) {
  const h = w / 2
  beam(p, at(c0, z0), at(c0, z1), w)
  beam(p, at(c1, z0), at(c1, z1), w)
  const n = Math.hypot(c1[0] - c0[0], c1[1] - c0[1])
  const t: XY = [(c1[0] - c0[0]) / n, (c1[1] - c0[1]) / n]
  const a: XY = [c0[0] + t[0] * h, c0[1] + t[1] * h], b: XY = [c1[0] - t[0] * h, c1[1] - t[1] * h]
  beam(p, at(a, z1 - h), at(b, z1 - h), w)
  if (sill) beam(p, at(a, z0 + h), at(b, z0 + h), w)
}

// ─────────────────────────────── the tower kit ───────────────────────────────

export type Crown = 'king' | 'queen'

export type ConcourseOptions = {
  crown: Crown
  /** How much higher every tier stands above this tower's own ground than the King's. */
  dz: number
  /** Spire tip above y = 0 (OSM height). */
  tip: number
}

/** Plan and tier constants, in the King's heights (add dz). */
export const PLAN = {
  half: 24.8, // main square
  notch: 4.5, // corner notches
  dia: 30, // the turned square: |x| + |y| ≤ dia
  prowLow: 28.5, // prow tip below PROW_TOP
  prowHigh: 26.5, // prow tip above it
  core: 17, // top core square
  coreCut: 1.8, // its corners chamfered (lidar: 22.5 m out along the diagonals)
}
export const TIERS = { notchFloor: 27.0, prowTop: 86.4, main: 106.1, diamond: 118.1, roof: 130.4, base: 11 }

const STOREY = 3.85, GROUP = 3 * STOREY, SPANDREL = 3.0

export function concourseTower(o: ConcourseOptions) {
  const body = new Part(), glass = new Part(), granite = new Part()
  const crown = new Part(), roof = new Part()
  const { half: A, notch: N, dia: D, prowLow: P0, prowHigh: P1, core: C, coreCut: K } = PLAN
  const T = Object.fromEntries(Object.entries(TIERS).map(([k, v]) => [k, v + o.dz])) as typeof TIERS
  const dy0 = D - A // where the prow sides leave the face (5.2)

  /** A wall segment with its glass bands above the base and the granite base below. */
  const face = (a: XY, b: XY, z0: number, z1: number, inset = 0.35) => {
    wall(body, a, b, z0, z1)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = outward(a, b)
    const s = Math.min(inset / L, 0.2), e = 1 - s
    const pa = lerp2(a, b, s), pb = lerp2(a, b, e)
    const A2: XY = [pa[0] + n[0] * 0.05, pa[1] + n[1] * 0.05], B2: XY = [pb[0] + n[0] * 0.05, pb[1] + n[1] * 0.05]
    // granite base: a band proud of the wall, with tall lobby glass in bays
    if (z0 < T.base) {
      const top = Math.min(T.base, z1)
      const G1: XY = [a[0] + n[0] * 0.3, a[1] + n[1] * 0.3], G2: XY = [b[0] + n[0] * 0.3, b[1] + n[1] * 0.3]
      wall(granite, G1, G2, z0, top)
      const bays = Math.max(1, Math.round(L / 6.5))
      for (let k = 0; k < bays; k++) {
        const u0 = (k + 0.2) / bays, u1 = (k + 0.8) / bays
        const q0 = lerp2(G1, G2, u0), q1 = lerp2(G1, G2, u1)
        wall(glass, [q0[0] + n[0] * 0.05, q0[1] + n[1] * 0.05], [q1[0] + n[0] * 0.05, q1[1] + n[1] * 0.05], Math.max(z0, top - 9.5), top - 1.2)
      }
      // the granite's top lip
      granite.quad(at(G1, top), at(G2, top), at(b, top), at(a, top))
    }
    for (let g = 0; ; g++) {
      const lo = Math.max(T.base + g * GROUP + SPANDREL / 2, z0 + 0.5)
      const hi = Math.min(T.base + (g + 1) * GROUP - SPANDREL / 2, z1 - 0.9)
      if (T.base + g * GROUP > z1) break
      if (hi - lo < 1.6) continue
      wall(glass, A2, B2, lo, hi)
    }
  }

  // One quarter of the plan (the +x face and the corner after it), turned round four times.
  for (let k = 0; k < 4; k++) {
    const r = (p: XY) => rot(p, k)
    // prow, low part: tip at P0
    face(r([A, -dy0]), r([P0, -(D - P0)]), 0, T.prowTop)
    face(r([P0, -(D - P0)]), r([P0, D - P0]), 0, T.prowTop)
    face(r([P0, D - P0]), r([A, dy0]), 0, T.prowTop)
    // prow, high part: tip at P1, from the low prow's ledge to the diamond's top
    face(r([A, -dy0]), r([P1, -(D - P1)]), T.prowTop, T.main) // below main this side is the diamond's edge from the face
    face(r([P1, -(D - P1)]), r([P1, D - P1]), T.prowTop, T.diamond)
    face(r([P1, D - P1]), r([A, dy0]), T.prowTop, T.main)
    // ledge on the low prow
    cap(roof, [r([P1, -(D - P1)]), r([P0, -(D - P0)]), r([P0, D - P0]), r([P1, D - P1])], T.prowTop)
    // the square face either side of the prow, and the corner notch
    face(r([A, dy0]), r([A, A - N]), 0, T.main)
    face(r([A, A - N]), r([A, A]), 0, T.notchFloor)
    face(r([A, A]), r([A - N, A]), 0, T.notchFloor)
    face(r([A, A - N]), r([A - N, A - N]), T.notchFloor, T.main)
    face(r([A - N, A - N]), r([A - N, A]), T.notchFloor, T.main)
    face(r([A - N, A]), r([dy0, A]), 0, T.main)
    cap(roof, [r([A - N, A - N]), r([A, A - N]), r([A, A]), r([A - N, A])], T.notchFloor)
    // the turned square above the main roof: from the prow to the next prow
    face(r([P1, D - P1]), r([A, dy0]), T.main, T.diamond)
    face(r([A, dy0]), r([dy0, A]), T.main, T.diamond)
    face(r([dy0, A]), r([D - P1, P1]), T.main, T.diamond)
    // the core
    face(r([C, -(C - K)]), r([C, C - K]), T.main, T.roof)
    face(r([C, C - K]), r([C - K, C]), T.main, T.roof)
  }
  // roofs: main (notched square), diamond (octagon), core
  const mainRing: XY[] = [], diaRing: XY[] = [], coreRing: XY[] = []
  for (let k = 0; k < 4; k++) {
    const r = (p: XY) => rot(p, k)
    mainRing.push(r([A, -(A - N)]), r([A, A - N]), r([A - N, A - N]), r([A - N, A]))
    diaRing.push(r([P1, -(D - P1)]), r([P1, D - P1]))
    coreRing.push(r([C, -(C - K)]), r([C, C - K]))
  }
  // the notched square isn't convex: cap it as a centre square plus four strips
  cap(roof, [[-(A - N), -(A - N)], [A - N, -(A - N)], [A - N, A - N], [-(A - N), A - N]], T.main)
  for (let k = 0; k < 4; k++) cap(roof, [rot([A - N, -(A - N)], k), rot([A, -(A - N)], k), rot([A, A - N], k), rot([A - N, A - N], k)], T.main)
  cap(roof, diaRing, T.diamond)
  cap(roof, coreRing, T.roof)

  if (o.crown === 'king') kingCrown(crown, T.roof, o.tip)
  else queenCrown(crown, T.roof, o.tip)

  const lit = () => 1
  return [
    { part: body, material: finish('concourse-navy', 0x323d4a) },
    { part: glass, material: { name: 'window', color: 0x4f6f80, roughness: 0.3 } },
    { part: granite, material: finish('concourse-granite', 0xc9bfb3) },
    { part: crown, material: { ...finish('neon-concourse-crown', 0xf4f3ee, 0.6), floodlight: lit } },
    { part: roof, material: PALETTE.roof },
  ] satisfies Array<{ part: Part; material: MaterialSpec }>
}

/**
 * The King's crown: open square portal frames stepping up in three rings to
 * a central cluster of four posts and a spire. Lidar (King heights): outer
 * ring 137–141, corner frames to 145, inner frames to 155, centre 158.
 */
function kingCrown(p: Part, z0: number, tip: number) {
  const W = 2.1
  for (let k = 0; k < 4; k++) {
    const r = (q: XY) => rot(q, k)
    // outer ring: a big frame on each face of the core with a smaller frame
    // set inside it (the "frame within a frame" of the photos)
    portal(p, r([15.4, -8]), r([15.4, 8]), z0, z0 + 11, W)
    portal(p, r([15.4, -3.6]), r([15.4, 3.6]), z0 + W, z0 + 7.4, W * 0.75, false)
    // corner frames, square, turned to the diagonals, taller
    portal(p, r([15.4, 10.6]), r([10.6, 15.4]), z0, z0 + 15.5, W)
    // inner ring: taller frames facing out, 9 m from the centre
    portal(p, r([9, -5.5]), r([9, 5.5]), z0, z0 + 22.5, W)
    // ties from the inner frames out to the corner frames, at their lintels
    beam(p, at(r([9, 5.5]), z0 + 14.5), at(r([10.6, 15.4]), z0 + 14.5), W * 0.8)
  }
  // central cluster: four posts, two lintel rings, then the spire
  const c = 3.2, zc = z0 + 27.6
  for (let k = 0; k < 4; k++) {
    const a = rot([c, -c], k), b = rot([c, c], k)
    beam(p, at(a, z0), at(a, zc), 2.2)
    beam(p, at(a, zc - 1), at(b, zc - 1), 1.9)
    beam(p, at(a, z0 + 22.5 - 1), at(b, z0 + 22.5 - 1), 1.7)
    beam(p, at(rot([9, 0], k), z0 + 22.5 - 1), at(rot([c, 0], k), z0 + 22.5 - 1), 1.7)
  }
  spire(p, zc, tip)
}

/**
 * The Queen's crown: four lattice corner towers, a low ring of lattice
 * frames, and two crossed semicircular arches over the core with the spire
 * at their crossing. Lidar (Queen heights, above its ground): ring 142–146,
 * corner towers to 149, arches crossing at about 160.
 */
function queenCrown(p: Part, z0: number, tip: number) {
  const W = 1.9
  for (let k = 0; k < 4; k++) {
    const r = (q: XY) => rot(q, k)
    // a corner tower: four posts, rings at the top and middle, on the core's corner
    const c: XY = [13, 13], s = 2.6
    const pts: XY[] = [[c[0] - s, c[1] - s], [c[0] + s, c[1] - s], [c[0] + s, c[1] + s], [c[0] - s, c[1] + s]].map((q) => r(q as XY))
    pts.forEach((q) => beam(p, at(q, z0), at(q, z0 + 15), W))
    for (const z of [z0 + 15 - W / 2, z0 + 7.5]) pts.forEach((q, i) => beam(p, at(q, z), at(pts[(i + 1) % 4], z), W * 0.85))
    // X-bracing on the tower's two outer faces
    beam(p, at(pts[0], z0 + 7.5), at(pts[1], z0 + 15 - W / 2), W * 0.6)
    beam(p, at(pts[1], z0 + 7.5), at(pts[2], z0 + 15 - W / 2), W * 0.6)
    // low lattice ring on each face of the core, between the corner towers
    portal(p, r([15.6, -9.6]), r([15.6, 9.6]), z0, z0 + 8.5, W)
    beam(p, at(r([15.6, -9.6]), z0 + 0.7), at(r([15.6, 9.6]), z0 + 8.5 - 0.7), W * 0.8)
  }
  // a square ring beam 9 m above the roof on four posts, and two crossed
  // semicircular arches springing from its corners along the diagonals
  const c = 11, zr = z0 + 9
  for (let k = 0; k < 4; k++) {
    const a = rot([c, -c], k), b = rot([c, c], k)
    beam(p, at(a, z0), at(a, zr + 0.8), W)
    beam(p, at(a, zr), at(b, zr), W * 0.9)
  }
  const R = c * Math.SQRT2, spring = zr, segs = 12, band = 3.0, depth = 2.2
  for (const dir of [[1, 1], [1, -1]] as XY[]) {
    const u: XY = [dir[0] / Math.SQRT2, dir[1] / Math.SQRT2]
    const v: XY = [-u[1], u[0]] // across the arch
    const sections: V3[][] = []
    for (let i = 0; i <= segs; i++) {
      const t = Math.PI * i / segs
      const cr = Math.cos(t), sr = Math.sin(t)
      const ring = (rr: number, side: number): V3 => [u[0] * rr * cr + v[0] * side, u[1] * rr * cr + v[1] * side, spring + rr * sr]
      sections.push([ring(R - band / 2, -depth / 2), ring(R + band / 2, -depth / 2), ring(R + band / 2, depth / 2), ring(R - band / 2, depth / 2)])
    }
    closedSweep(p, sections)
  }
  spire(p, spring + R + band / 2 - 0.5, tip)
}

/** A closed tube along sections (four corners each, same order), with end caps. */
function closedSweep(p: Part, sections: V3[][]) {
  for (let k = 0; k < sections.length - 1; k++) {
    const r0 = sections[k], r1 = sections[k + 1]
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      p.quad(r0[i], r0[j], r1[j], r1[i])
    }
  }
  const a = sections[0], b = sections[sections.length - 1]
  p.quad(a[3], a[2], a[1], a[0])
  p.quad(b[0], b[1], b[2], b[3])
}

/** A tapering square spire with a small base collar. */
function spire(p: Part, z0: number, tip: number) {
  beam(p, [0, 0, z0 - 1], [0, 0, z0 + 1.2], 2.4)
  const b = 1.0, m = 0.45, zm = z0 + (tip - z0) * 0.7
  const sq = (h: number, z: number): V3[] => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]]
  p.loft([sq(b, z0 + 1.2), sq(m, zm)])
  for (let i = 0; i < 4; i++) {
    const r = sq(m, zm)
    p.tri(r[i], r[(i + 1) % 4], [0, 0, tip])
  }
}

export async function writeConcourse(id: string, name: string, parts: Array<{ part: Part; material: MaterialSpec }>, extras: Record<string, unknown>) {
  const tris = parts.reduce((n, { part }) => n + part.triangles, 0)
  if (tris > 5000) throw new Error(`Triangle budget exceeded: ${tris}`)
  const glb = writeGlb(name, parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground', ...extras })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = process.argv[2] ?? new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}

if (import.meta.main) {
  await writeConcourse('atl-king-tower', 'The King (Concourse Corporate Center VI)', concourseTower({ crown: 'king', dz: 0, tip: 168.6 }), {
    bearing: 45.5, elevation: 0, height: 168.6, replaces: ['way/197315978'],
  })
}
