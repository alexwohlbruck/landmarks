/**
 * Gate Tower Building (TKPゲートタワービル), Fukushima, Osaka: procedural, CC0-1.0.
 * bun generators/osaka-gate-tower-building.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * centre of OSM's round outline (way/136809309); y = 0 is the street (flat).
 *
 * A 16-storey round office tower (1992) through which the Hanshin
 * Expressway's Umeda exit ramp (route 11 Ikeda line, exit 11-03) passes, at
 * the 5th to 7th floors; the building's lifts skip those floors. The model
 * is the tower and the ramp's segment through it: the hooded deck from 16 m
 * west of the outline, where the approach viaduct comes in from the west, to
 * ~24 m beyond it to the north-east, where the ramp curves away north, and
 * the pier at the north-east portal. The map draws the rest of the ramp.
 *
 * OSM:
 * - way/136809309, building=commercial, height=71.9, 16 levels: a circle
 *   of radius 12.0 m (measured);
 * - the ramp: way/151798488 (viaduct, layer 3) from the west to the
 *   outline, way/151798486 (tunnel=building_passage, layer 1) through it,
 *   way/151798490 (viaduct, layer 2) beyond; their nodes give the ramp's
 *   centre line here (measured). The passage passes ~2 m from the centre.
 *
 * Published: 71.9 m (OSM; ja.wikipedia gives 71.9 m), 16 storeys above
 * ground and 2 below, the expressway through 5F-7F (ja.wikipedia
 * "TKPゲートタワービル").
 *
 * Estimated from photos:
 * - storeys 4.5 m: the base (1F-4F) to 18 m, the ramp floors (5F-7F) to
 *   31.5 m, the office floors above (DVMG panoramio: 4, 3 and 9 bands);
 * - at 5F-7F the drum is cut away round the ramp, leaving a curved wall on
 *   the north-west and dark back walls (Rubio, DVMG);
 * - the base drum ~0.8 m wider than the tower above it;
 * - the real windows are one ribbon a storey, ~1.7 m deep; they are drawn
 *   grouped, one 3.4 m band to two storeys (the same glass area), broken by
 *   five tan piers round the drum, so they read as broad bands rather than a
 *   per-floor grid (STYLE.md; lead review);
 * - left out at the lead's request: the stair/lift shaft standing ~3.5 m
 *   proud of the drum on the south-east (DVMG shows it, with a vertical
 *   glass strip); the drum is drawn whole there;
 * - the crown: a dark recessed band and the round helipad deck overhanging
 *   the drum on a ring of posts, ~13.5 m radius (ignis, from above);
 * - the ramp: a one-lane deck 8.5 m wide on a box girder with rounded
 *   soffit edges, 2.4 m deep; deck at ~21 m (5F); enclosed by a hood with
 *   rounded corners 6.8 m high, an enclosed grey tube over the whole
 *   segment: through the building, 16 m west of the outline and ~24 m
 *   north-east along OSM's curve (the portals in "Gate Tower Building Umeda
 *   Exit" and Hiroshi Nakai's photo; ignis from above shows the hooded
 *   approach); the real approaches have open sound walls further out;
 *   a stone-clad pier with a white steel cross-head at the north-east
 *   portal (Rubio 2206807411);
 * - colours: the cladding a grey-beige granite tile (#a8a196 in shade to
 *   #c9c2b6 in sun), drawn #cbc3b6; the ribbons reflective sky blue, drawn
 *   #8fa8c0; the ramp's panels a pale green-grey (#b5bcb2), drawn grey #b4b8b6;
 *   the helipad deck roof grey with a dark rim.
 * Invented: the inside of the recess (dark), the helipad's posts' count.
 * Terrain: see the report; elevation 0.
 *
 * Night: the ribbons are `window` and glow; the ramp and the helipad stay
 * unlit (the ramp's lights are left out).
 *
 * Photos (Wikimedia Commons, evidence):
 * - "TKP Gate Tower Building - panoramio.jpg", DVMG, CC BY 3.0 (from the north-east)
 * - "Gate tower building - Osaka (2206807411).jpg", Daniel Rubio, CC BY-SA 2.0 (ramp, pier)
 * - "Gate Tower Building, Osaka (2582691905).jpg" and "(2582713951)", Daniel Rubio, CC BY-SA 2.0
 * - "Building penetrated by an expressway 001 OSAKA JPN.jpg", ignis, CC BY-SA 3.0 (from above, the north)
 * - "Gate Tower Building Umeda Exit.jpg", ja:User:ユニ, CC BY-SA 3.0 (portal from the ramp)
 * - "Gate Tower Bldg DSC00218 (6503327115).jpg", Hiroshi Nakai, CC BY 2.0 (portal)
 * - "TKP GATE TOWER BUILDING.jpg", Tokumeigakarinoaoshima, CC BY-SA 4.0
 * - "TKP Gate Tower Building - panoramio (5).jpg", DVMG, CC BY 3.0
 * Look-only: none.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { TAU, add, box, fquad, ftri, mul, unit, writeLods, type Mat, type XY } from './osaka-umeda-sky-building'

const R = 12.0, RB = 12.8, H = 71.9
const BASE_TOP = 18, RECESS_TOP = 31.5, ST = 4.5
const DECK = 21 // road surface through the building

// The ramp's centre line (OSM, shifted to this origin), west to north-east.
const PATH: XY[] = [[-27.4, -7.7], [-18.2, -6.0], [-11.3, -4.3], [-8.5, -3.5], [-4.6, -2.1], [-1.0, -0.4], [1.8, 1.4], [4.2, 3.3], [7.1, 6.0], [9.1, 7.9], [12.7, 12.2], [15.7, 18.5], [17.9, 25.1], [19.2, 34.6]]

/** Resample a polyline every `step` metres, with a smoothed left normal at each point. */
function resample(p: XY[], step: number) {
  const out: XY[] = [p[0]]
  let carry = 0
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i], b = p[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    let s = step - carry
    while (s < L) { out.push([a[0] + ((b[0] - a[0]) * s) / L, a[1] + ((b[1] - a[1]) * s) / L]); s += step }
    carry = L - (s - step)
  }
  const last = p[p.length - 1], end = out[out.length - 1]
  if (Math.hypot(last[0] - end[0], last[1] - end[1]) > step * 0.3) out.push(last)
  else out[out.length - 1] = last
  const left = out.map((q, i) => {
    const a = out[Math.max(0, i - 1)], b = out[Math.min(out.length - 1, i + 1)]
    const t = unit([b[0] - a[0], b[1] - a[1], 0])
    return [-t[1], t[0]] as XY
  })
  const along: number[] = [0]
  for (let i = 1; i < out.length; i++) along.push(along[i - 1] + Math.hypot(out[i][0] - out[i - 1][0], out[i][1] - out[i - 1][1]))
  return { pts: out, left, along }
}

/**
 * Sweep a closed cross-section (s to the left, z up, counter-clockwise)
 * along part of the path, from along-distance d0 to d1; z is added to the
 * deck height there. Ends capped when asked.
 */
function sweep(part: Part, path: ReturnType<typeof resample>, sec: XY[], d0: number, d1: number, zAt: (d: number) => number, caps = true) {
  const idx = path.along.map((d, i) => i).filter((i) => path.along[i] >= d0 - 1e-6 && path.along[i] <= d1 + 1e-6)
  const ring = (i: number): V3[] => sec.map(([s, z]) => [path.pts[i][0] + path.left[i][0] * s, path.pts[i][1] + path.left[i][1] * s, zAt(path.along[i]) + z])
  const area = sec.reduce((t, a, i) => { const b = sec[(i + 1) % sec.length]; return t + a[0] * b[1] - b[0] * a[1] }, 0)
  for (let k = 0; k < idx.length - 1; k++) {
    const i = idx[k], j = idx[k + 1], A = ring(i), B = ring(j)
    for (let e = 0; e < sec.length; e++) {
      const f = (e + 1) % sec.length
      const es = sec[f][0] - sec[e][0], ez = sec[f][1] - sec[e][1]
      const sg = area > 0 ? 1 : -1
      const ns = sg * ez, nz = -sg * es
      // s runs to the left; a normal's s part points along the left normal
      const lf = path.left[i]
      fquad(part, A[e], A[f], B[f], B[e], [lf[0] * ns, lf[1] * ns, nz])
    }
  }
  if (caps) for (const [k, sgn] of [[idx[0], -1], [idx[idx.length - 1], 1]] as [number, number][]) {
    const r = ring(k), a = path.pts[Math.min(k + 1, path.pts.length - 1)], b = path.pts[Math.max(k - 1, 0)]
    const t = unit([a[0] - b[0], a[1] - b[1], 0])
    for (let e = 1; e < r.length - 1; e++) ftri(part, r[0], r[e], r[e + 1], mul(t, sgn))
  }
}

/** Points of a polygonal drum ring of n sides, radius r, from angle a0 to a1. */
const arc = (r: number, a0: number, a1: number, n: number): XY[] =>
  Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [r * Math.cos(a), r * Math.sin(a)] as XY })

/** Drum walls of n sides between z0 and z1 over the angle range (outward). */
function drum(p: Part, r: number, z0: number, z1: number, n: number, a0 = 0, a1 = TAU) {
  const k = Math.max(1, Math.round((n * (a1 - a0)) / TAU)), pts = arc(r, a0, a1, k)
  for (let i = 0; i < k; i++) {
    const a = pts[i], b = pts[i + 1], am = a0 + ((a1 - a0) * (i + 0.5)) / k
    fquad(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [Math.cos(am), Math.sin(am), 0])
  }
}
/** An annular (or full) flat ring between radii, facing up or down. */
function disc(p: Part, r0: number, r1: number, z: number, n: number, up: boolean) {
  const o = arc(r1, 0, TAU, n), i = arc(r0, 0, TAU, n)
  for (let k = 0; k < n; k++) {
    if (r0 > 0) fquad(p, [i[k][0], i[k][1], z], [o[k][0], o[k][1], z], [o[k + 1][0], o[k + 1][1], z], [i[k + 1][0], i[k + 1][1], z], [0, 0, up ? 1 : -1])
    else ftri(p, [0, 0, z], [o[k][0], o[k][1], z], [o[k + 1][0], o[k + 1][1], z], [0, 0, up ? 1 : -1])
  }
}
/** Window ribbon panels on a drum: one per facet, inset from the facet's ends. */
function ribbon(p: Part, r: number, z0: number, z1: number, n: number, skip: (a: number) => boolean, gap = 0.04) {
  const pts = arc(r + 0.05, 0, TAU, n)
  for (let i = 0; i < n; i++) {
    const am = ((i + 0.5) / n) * TAU
    if (skip(am)) continue
    const a = pts[i], b = pts[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), t = gap / L
    const A: XY = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], B: XY = [b[0] - (b[0] - a[0]) * t, b[1] - (b[1] - a[1]) * t]
    fquad(p, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1], [Math.cos(am), Math.sin(am), 0])
  }
}

/**
 * Broad window bands on a drum: `bays` bays round it with a tan pier of
 * `pier` metres between them, each band following the drum's facets.
 */
function bands(p: Part, r: number, z0: number, z1: number, n: number, bays: number, pier: number, skip: (a: number) => boolean = () => false, a0 = 0.31) {
  const g = pier / r
  for (let b = 0; b < bays; b++) {
    const s0 = a0 + (b / bays) * TAU + g / 2, s1 = a0 + ((b + 1) / bays) * TAU - g / 2
    // facet boundaries inside the bay
    const cuts = [s0]
    for (let i = 0; i <= n * 2; i++) { const a = (i / n) * TAU; if (a > s0 && a < s1) cuts.push(a) }
    cuts.push(s1)
    for (let i = 0; i < cuts.length - 1; i++) {
      const am = (cuts[i] + cuts[i + 1]) / 2
      if (skip(am)) continue
      // a point at angle a on the facet polygon of radius r
      const at = (a: number): XY => {
        const k = Math.floor((((a % TAU) + TAU) % TAU) / (TAU / n)), f0 = (k / n) * TAU, f1 = ((k + 1) / n) * TAU
        const A: XY = [r * Math.cos(f0), r * Math.sin(f0)], B: XY = [r * Math.cos(f1), r * Math.sin(f1)]
        // intersect the ray at angle a with the facet A-B
        const dx = Math.cos(a), dy = Math.sin(a), ex = B[0] - A[0], ey = B[1] - A[1]
        const t = (A[0] * ey - A[1] * ex) / (dx * ey - dy * ex)
        return [dx * (t + 0.05), dy * (t + 0.05)]
      }
      const P = at(cuts[i] + 1e-6), Q = at(cuts[i + 1] - 1e-6)
      fquad(p, [P[0], P[1], z0], [Q[0], Q[1], z0], [Q[0], Q[1], z1], [P[0], P[1], z1], [Math.cos(am), Math.sin(am), 0])
    }
  }
}

function build(detail: boolean): Mat[] {
  const granite = new Part(), win = new Part(), ramp = new Part(), roof = new Part(), dark = new Part(), white = new Part()
  const N = detail ? 32 : 20

  // Base drum, 1F-4F, with two broad window bands and a ledge on top.
  drum(granite, RB, 0, BASE_TOP, N)
  disc(granite, R - 0.5, RB, BASE_TOP, N, true)
  bands(win, RB, 5.4, 8.6, N, 5, 1.6)
  bands(win, RB, 12.0, 15.2, N, 5, 1.6)
  // entrance glazing at street level on the north and west
  bands(win, RB, 0.6, 3.4, N, 5, 1.6, (a) => Math.sin(a) < -0.2)

  // 5F-7F: the drum is cut away round the ramp; a curved wall stands on the
  // north-west; the rest is a dark recess.
  drum(granite, R, BASE_TOP, RECESS_TOP, N, (100 / 180) * Math.PI, (170 / 180) * Math.PI)
  drum(granite, R - 0.8, BASE_TOP, RECESS_TOP, N, (100 / 180) * Math.PI, (170 / 180) * Math.PI)
  for (const a of [100, 170]) {
    const t = (a / 180) * Math.PI, c = Math.cos(t), s = Math.sin(t)
    fquad(granite, [(R - 0.8) * c, (R - 0.8) * s, BASE_TOP], [R * c, R * s, BASE_TOP], [R * c, R * s, RECESS_TOP], [(R - 0.8) * c, (R - 0.8) * s, RECESS_TOP], a === 100 ? [-s, c, 0] : [s, -c, 0])
  }
  bands(win, R, 23.2, 26.6, N, 5, 1.6, (a) => a < (101 / 180) * Math.PI || a > (169 / 180) * Math.PI)
  // the recess: a dark back wall far inside, and the soffit of 8F
  disc(dark, 0, R, RECESS_TOP, N, false)
  // the recess's back walls, 2 m in, either side of the ramp's path
  drum(dark, R - 2, BASE_TOP, RECESS_TOP, N, (76 / 180) * Math.PI, (166 / 180) * Math.PI)
  drum(dark, R - 2, BASE_TOP, RECESS_TOP, N, (236 / 180) * Math.PI, (366 / 180) * Math.PI)
  // and a dark fascia hanging over the hood (the 8F floor's deep beams)
  drum(dark, R - 2, DECK + 7.4, RECESS_TOP, N)

  // 8F-16F: the drum, a ribbon a storey, the crown.
  const TOWER_TOP = 69.6
  drum(granite, R, RECESS_TOP, TOWER_TOP, N)
  // two storeys to a band: the floors' ribbons grouped, the same glass area
  for (let f = 0; f < 9; f += 2) {
    const z = RECESS_TOP + f * ST, top = Math.min(z + 2 * ST, TOWER_TOP)
    const h = f === 8 ? 1.9 : 3.4, zc = (z + top) / 2
    bands(win, R, zc - h / 2, zc + h / 2, N, 5, 1.6)
  }
  // crown: a dark recessed band and the helipad deck on posts
  drum(dark, R - 0.9, TOWER_TOP, H - 0.6, N)
  disc(granite, R - 0.9, R, TOWER_TOP, N, true)
  const RH = 13.6, HP0 = H - 0.6, HP1 = H + 0.7
  drum(dark, RH, HP0, HP1, detail ? 40 : 24)
  disc(roof, 0, RH, HP1, detail ? 40 : 24, true)
  disc(dark, R - 0.9, RH, HP0, detail ? 40 : 24, false)
  // (the helipad's marking is left out)

  // --- The ramp through the building. ------------------------------------
  const path = resample(PATH, detail ? 1.2 : 2.4)
  const total = path.along[path.along.length - 1]
  // where the path crosses the outline (radius 12)
  const cross = path.along.filter((_, i) => Math.hypot(...path.pts[i]) <= R)
  const dIn = Math.min(...cross), dOut = Math.max(...cross)
  const zAt = (d: number) => DECK + 0.6 - (1.2 * d) / total // a gentle fall toward the exit
  const W = 4.25 // half the deck's width
  // the box girder, rounded at its soffit's edges
  const k = detail ? 4 : 2
  const girder: XY[] = [[-W - 0.3, 0], [-W - 0.3, -0.9]]
  for (let i = 1; i <= k; i++) { const a = (Math.PI / 2) * (i / k); girder.push([-W - 0.3 + 1.5 * (1 - Math.cos(a)), -0.9 - 1.5 * Math.sin(a)]) }
  for (let i = 0; i <= k; i++) { const a = (Math.PI / 2) * (i / k); girder.push([W + 0.3 - 1.5 * (1 - Math.sin(a)), -2.4 + 1.5 * (1 - Math.cos(a))]) }
  girder.push([W + 0.3, 0])
  sweep(ramp, path, girder.reverse(), 0, total, zAt)
  // open walls on the stubs, a hood from 7 m outside the outline through the building
  const H0 = 0, H1 = total // the hood runs the whole stub (the photos show it closed at the building)
  const hood: XY[] = [[W, 0], [W + 0.35, 0], [W + 0.35, 4.6]]
  for (let i = 1; i <= (detail ? 5 : 3); i++) { const a = (Math.PI / 2) * (i / (detail ? 5 : 3)); hood.push([W + 0.35 - 2.2 * (1 - Math.cos(a)), 4.6 + 2.2 * Math.sin(a)]) }
  const hoodFull = [...hood, ...hood.slice().reverse().map(([s, z]) => [-s, z] as XY)]
  const inner: XY[] = [[W, 0], [W, 4.6]]
  for (let i = 1; i <= (detail ? 5 : 3); i++) { const a = (Math.PI / 2) * (i / (detail ? 5 : 3)); inner.push([W - 1.85 * (1 - Math.cos(a)), 4.6 + 1.85 * Math.sin(a)]) }
  const innerFull = [...inner, ...inner.slice().reverse().map(([s, z]) => [-s, z] as XY)]
  sweep(ramp, path, [...hoodFull, ...innerFull.slice().reverse()], H0, H1, zAt, false)
  // a dark lining inside the hood, so the portals read as openings
  const lining = innerFull.map(([s, z]) => [s * 0.995, z * 0.995 + 0.02] as XY)
  sweep(dark, path, [...innerFull.map(([s, z]) => [s * 0.99, z * 0.99] as XY), ...lining.slice().reverse()].reverse(), H0 + 0.1, H1 - 0.1, zAt, false)
  sweep(dark, path, [[-W, 0], [W, 0], [W, 0.05], [-W, 0.05]], 0, total, zAt, false)
  // the tube's open ends: a dark portal inside, and the shell's rim
  for (const [i, sgn] of [[0, -1], [path.pts.length - 1, 1]] as [number, number][]) {
    const P = (q: XY): V3 => [path.pts[i][0] + path.left[i][0] * q[0], path.pts[i][1] + path.left[i][1] * q[0], zAt(path.along[i]) + q[1]]
    const a = path.pts[Math.min(i + 1, path.pts.length - 1)], b = path.pts[Math.max(i - 1, 0)]
    const t: V3 = mul(unit([a[0] - b[0], a[1] - b[1], 0]), sgn)
    const c = P([0, 3.2])
    const D = (q: XY): V3 => add(P(q), mul(t, 0.06))
    for (let k = 0; k < innerFull.length - 1; k++) ftri(dark, add(c, mul(t, 0.06)), D(innerFull[k]), D(innerFull[k + 1]), t)
    ftri(dark, add(c, mul(t, 0.06)), D(innerFull[innerFull.length - 1]), D(innerFull[0]), t)
    for (let k = 0; k < hoodFull.length - 1; k++) ftri(ramp, c, P(hoodFull[k]), P(hoodFull[k + 1]), mul(t, 1))
  }

  // the pier at the north-east portal: a stone-clad column and a white cross-head
  {
    const d = dOut + 4.5
    const i = path.along.reduce((b, x, j) => (Math.abs(x - d) < Math.abs(path.along[b] - d) ? j : b), 0)
    const [px, py] = path.pts[i], lf = path.left[i], zt = zAt(path.along[i]) - 2.4
    box(granite, px - 1.3, py - 1.3, px + 1.3, py + 1.3, 0, zt - 1.8, { top: false })
    const A = (s: number, z: number): V3 => [px + lf[0] * s, py + lf[1] * s, z]
    const t: V3 = [lf[1], -lf[0], 0]
    const hw = 1.2
    const q = (s0: number, s1: number, z0: number, z1: number) => {
      const c: V3[] = [add(A(s0, z0), mul(t, -hw)), add(A(s1, z0), mul(t, -hw)), add(A(s1, z1), mul(t, -hw)), add(A(s0, z1), mul(t, -hw))]
      const c2 = c.map((p) => add(p, mul(t, 2 * hw)))
      fquad(white, c[0], c[1], c[2], c[3], mul(t, -1))
      fquad(white, c2[1], c2[0], c2[3], c2[2], t)
      fquad(white, c[3], c[2], c2[2], c2[3], [0, 0, 1])
      fquad(white, c[1], c[0], c2[0], c2[1], [0, 0, -1])
      fquad(white, c[0], c[3], c2[3], c2[0], [-lf[0], -lf[1], 0])
      fquad(white, c[2], c[1], c2[1], c2[2], [lf[0], lf[1], 0])
    }
    q(-3.4, 3.4, zt - 1.8, zt)
  }

  return [
    { part: granite, material: finish('gate-granite', 0xcbc3b6) },
    { part: win, material: { ...PALETTE.window, color: 0x8fa8c0 } },
    { part: ramp, material: finish('gate-ramp', 0xb4b8b6) },
    { part: roof, material: PALETTE.roof },
    { part: dark, material: finish('gate-shadow', 0x4a4f57) },
    { part: white, material: PALETTE.trim },
  ]
}

if (import.meta.main) {
  await writeLods('osaka-gate-tower-building', 'Gate Tower Building', { bearing: 0, elevation: 0, height: H + 0.7 }, [
    { file: 'osaka-gate-tower-building.glb', parts: build(false), maxTris: 5000, maxBytes: 250_000 },
    { file: 'osaka-gate-tower-building.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1536 * 1024 },
  ])
}
