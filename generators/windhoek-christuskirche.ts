/**
 * Christuskirche, Windhoek (Gottlieb Redecker, 1907-10): procedural,
 * CC0-1.0.
 * bun generators/windhoek-christuskirche.ts
 *
 * The Lutheran church on its roundabout at the top of Robert Mugabe Avenue:
 * quarry-faced golden sandstone with white-rendered trim, steep red-tiled
 * roofs, the curved stepped (Art Nouveau) gables of the two transept ends
 * and the west front, and the tall north-west tower with its four clock
 * gables and slender tiled spire.
 *
 * Frame: origin at the area centroid of OSM way/903001192 (17.087320,
 * -22.567746); bearing 0, the church's axis runs east-west (the outline's
 * sides are within 0.6 degrees of the compass). The plan follows OSM's
 * building:parts (mapped in detail, 2021): the nave way/909064788
 * (x -12.5..8.0, y -6.5..2.6), the transept way/909064784 (x -4.8..3.9,
 * y -6.5..7.4), the tower way/909064786 (x -12.5..-7.7, y 2.6..7.5), the
 * polygonal chancel way/909064785, the north aisle way/909243888, the
 * north-east block way/909064787 and annex way/909070901, the south-east
 * vestry way/909283503, the west porch way/909261673, and the two- and
 * three-stage buttresses (the small skillion parts at 7, 14 and 20 m).
 *
 * Heights. Published: the tower is 42 m (de.wikipedia "Christuskirche
 * (Windhoek)"); OSM's tower part agrees (42 m, spire 15 m). OSM gives the
 * nave and transept 25 m with a 10 m roof, but the photos don't bear that
 * out: in p4 the north transept gable and the tower stand in one plane, and
 * the cross is 2.07 times as high as the gable's top, so with the
 * published 42 m the gable top is at 20.3 m and the eaves at 11.4 m; the
 * near-frontal west view p5 gives the same within a metre (eaves 10-11 m,
 * gable top 20-21 m). So every OSM height but the tower's is scaled by
 * 0.77 (OSM's 25 / 15 / 22 / 20 / 18 / 14 / 7 become 19.3 / 11.3 / 17.3 /
 * 15.4 / 13.9 / 10.8 / 5.4 m). Measured in p4 with the same scale: the
 * tower's shaft to 24.5 m, its clock gables to 29.7 m, the spire to 39.6 m
 * and the ball and cross to 42 m; its windows in stages at 9.2-11.1 (three
 * lights), 13.8-15.7 (one), 17-21 (the belfry pair) and 22.3-24.2 m (three
 * small lights); the transept's great window 4.6-12.6 m, 3.4 m wide; the
 * west rose 3.6 m across centred at 11 m (p5); the north-east annex
 * lower than OSM's 15 m (7 m eaves, 9.5 m ridge, from p1). Estimated: the
 * gables' step profile (three rounded steps a side and a round crown,
 * traced on p4, p6, p7), the window widths, the buttress caps.
 *
 * Ground: the church stands on the top of a low rise inside its roundabout;
 * the map's terrain (Mapterhorn z12 only; z13-z15 404) is checked in the
 * report. Elevation 0.
 *
 * Colours, from daylight photos: the sandstone is a golden tan (#bc8e5e to
 * #c49666 in sun in p1), #c9a173; the render trim white (`trim`); the roof
 * and spire tiles a brick red (#a65c44 sunlit roof, #933522 spire in p4),
 * #a95a44; windows `window`; the doors and the clock faces dark oak.
 *
 * Night: the church is floodlit: the stone and the white trim carry
 * `_FLOODLIGHT`, strongest low down; the windows glow (`window`).
 *
 * Simplified or left out: the quarry-faced coursing, the rose window's
 * tracery (drawn as a plain disc in a white ring), the tracery of the
 * great windows beyond two mullions, the porch's columns, the railings and
 * the garden wall; the north-east annex's small gable faces east (p1).
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - p1 "Iglesia de Cristo, Windhoek, Namibia, 2018-08-04, DD 02.jpg", Diego Delso, CC BY-SA 4.0 (from the north-east)
 *   https://commons.wikimedia.org/wiki/File:Iglesia_de_Cristo,_Windhoek,_Namibia,_2018-08-04,_DD_02.jpg
 * - p2 "Iglesia de Cristo, Windhoek, Namibia, 2018-08-04, DD 05.jpg", Diego Delso, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Iglesia_de_Cristo,_Windhoek,_Namibia,_2018-08-04,_DD_05.jpg
 * - p3 "Windhuk Christuskirche Chor 1.jpg", Zairon, CC BY-SA 4.0 (the chancel, east)
 *   https://commons.wikimedia.org/wiki/File:Windhuk_Christuskirche_Chor_1.jpg
 * - p4 "Windhuk Christuskirche Nordseite 1.jpg", Zairon, CC BY-SA 4.0 (north side; main ruler)
 *   https://commons.wikimedia.org/wiki/File:Windhuk_Christuskirche_Nordseite_1.jpg
 * - p5 "Windhuk Christuskirche Fassade 3.jpg", Zairon, CC BY-SA 4.0 (west front)
 *   https://commons.wikimedia.org/wiki/File:Windhuk_Christuskirche_Fassade_3.jpg
 * - p6 "Windhuk Christuskirche Südseite 4.jpg", Zairon, CC BY-SA 4.0 (south side)
 *   https://commons.wikimedia.org/wiki/File:Windhuk_Christuskirche_S%C3%BCdseite_4.jpg
 * - p7 "Windhuk Christuskirche Nordseite 9.jpg", Zairon, CC BY-SA 4.0 (the north gable)
 *   https://commons.wikimedia.org/wiki/File:Windhuk_Christuskirche_Nordseite_9.jpg
 * - p8 "Christ Church in Windhoek, Namibia.jpg", Christoph Strässler, CC BY-SA 2.0 (from above)
 *   https://commons.wikimedia.org/wiki/File:Christ_Church_in_Windhoek,_Namibia.jpg
 * - p10 "Windhoek Christuskirche Church.jpg", Gwasheya, CC0 (from above)
 *   https://commons.wikimedia.org/wiki/File:Windhoek_Christuskirche_Church.jpg
 * Look-only: none.
 *
 * Doubts: the scaled heights (OSM's 25 m nave against the photos); the
 * south-west corner part way/909064789 (18 m, under the nave's roof here);
 * window counts on the long sides, which are partly hidden by trees in
 * every photo.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, lathe, panel, type Mat } from './cairo-cairo-tower'
import { fquad, ftri, offsetRing, ccw, type XY } from './casablanca-hassan-ii-mosque'
import { polyTris } from './berlin-oberbaum-bridge'

const K = 0.77 // OSM height scale for everything but the tower
const EAVE = 15 * K, RIDGE = 25 * K // 11.55, 19.25
const GTOP = RIDGE + 1.2

const lit = (p: V3, n: V3) => (n[1] > 0.7 ? 0.2 : Math.max(0.35, 0.95 - p[1] / 50))
const M = {
  stone: { ...finish('christuskirche-sandstone', 0xc9a173), floodlight: lit } as MaterialSpec,
  trim: { ...PALETTE.trim, floodlight: lit } as MaterialSpec,
  tile: finish('christuskirche-tiles', 0xa95a44) as MaterialSpec,
  window: PALETTE.window as MaterialSpec,
  door: finish('christuskirche-oak', 0x6f4d36) as MaterialSpec,
}

let stone: Part, trim: Part, tile: Part, win: Part, door: Part

// ───────────────────────────── helpers ─────────────────────────────

/** Walls of a ring (any winding) from z0 to z1, faces outward. */
function walls(p: Part, ring: XY[], z0: number, z1: number) {
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    fquad(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0])
  }
}
function cap(p: Part, ring: XY[], z: number, up = true) {
  for (const [a, b, c] of polyTris(ccw(ring))) ftri(p, [a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z], [0, 0, up ? 1 : -1])
}
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
function block(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = p) {
  walls(p, rect(x0, x1, y0, y1), z0, z1)
  if (top) cap(top, rect(x0, x1, y0, y1), z1)
}

/**
 * A gabled roof over a rectangle, the ridge along x (axis 'x') or y, the
 * eaves overhanging the long sides by `o`; plain gable ends are stone
 * triangles where `ends` asks for them.
 */
function gabled(x0: number, x1: number, y0: number, y1: number, z0: number, zr: number, axis: 'x' | 'y', o = 0.35, ends: [boolean, boolean] = [true, true]) {
  // work in (a along the ridge, b across), then map back
  const [a0, a1, b0, b1] = axis === 'x' ? [x0, x1, y0, y1] : [y0, y1, x0, x1]
  const bm = (b0 + b1) / 2, hw = (b1 - b0) / 2, slope = (zr - z0) / hw
  const P = (a: number, b: number, z: number): V3 => (axis === 'x' ? [a, b, z] : [b, a, z])
  const ze = z0 - o * slope
  for (const s of [-1, 1]) {
    const n: V3 = axis === 'x' ? [0, s * slope, 1] : [s * slope, 0, 1]
    fquad(tile, P(a0, bm + s * (hw + o), ze), P(a1, bm + s * (hw + o), ze), P(a1, bm, zr), P(a0, bm, zr), n)
    // the soffit under the overhang
    fquad(tile, P(a0, bm + s * hw, ze), P(a1, bm + s * hw, ze), P(a1, bm + s * (hw + o), ze), P(a0, bm + s * (hw + o), ze), [0, 0, -1])
  }
  for (const [k, a] of [[0, a0], [1, a1]] as [number, number][]) {
    if (!ends[k]) continue
    const n: V3 = axis === 'x' ? [k ? 1 : -1, 0, 0] : [0, k ? 1 : -1, 0]
    ftri(stone, P(a, b0, z0), P(a, b1, z0), P(a, bm, zr), n)
    // white verge boards
    for (const s of [-1, 1]) {
      const e0 = P(a, bm + s * (hw + o), ze), e1 = P(a, bm, zr)
      const off: V3 = [n[0] * 0.08, n[1] * 0.08, 0]
      fquad(trim, [e0[0] + off[0], e0[1] + off[1], e0[2]], [e1[0] + off[0], e1[1] + off[1], e1[2]], [e1[0] + off[0], e1[1] + off[1], e1[2] - 0.45], [e0[0] + off[0], e0[1] + off[1], e0[2] - 0.45], n)
    }
  }
}
/** A pyramid roof from a ring at z0 to an apex. */
function pyramid(p: Part, ring: XY[], z0: number, apex: V3) {
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const A: V3 = [a[0], a[1], z0], B: V3 = [b[0], b[1], z0]
    const u: V3 = [B[0] - A[0], B[1] - A[1], 0], v: V3 = [apex[0] - A[0], apex[1] - A[1], apex[2] - A[2]]
    const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    ftri(p, A, B, apex, n)
  }
}

/** A vertical wall plane: origin o, along u (unit, horizontal), outward normal n. */
type Wall = { o: XY; u: XY; n: XY }
const wallAt = (w: Wall, s: number, z: number, d = 0): V3 => [w.o[0] + w.u[0] * s + w.n[0] * d, w.o[1] + w.u[1] * s + w.n[1] * d, z]
const N3 = (w: Wall): V3 => [w.n[0], w.n[1], 0]

/** A window with a white surround: round-headed unless `flat`. */
function window(w: Wall, s: number, z0: number, z1: number, wd: number, opts: { bars?: number; flat?: boolean; surround?: number } = {}) {
  const sr = opts.surround ?? 0.25
  const arch = opts.flat ? false : 'round'
  panel(trim, wallAt(w, s, z0 - sr), N3(w), wd + 2 * sr, z1 - z0 + 2 * sr, arch, 8, 0.04)
  panel(win, wallAt(w, s, z0), N3(w), wd, z1 - z0, arch, 8, 0.08)
  const bars = opts.bars ?? 0
  for (let k = 1; k <= bars; k++) {
    const bs = s - wd / 2 + (wd * k) / (bars + 1)
    const top = opts.flat ? z1 : z1 - wd / 2
    fquad(trim, wallAt(w, bs - 0.09, z0, 0.1), wallAt(w, bs + 0.09, z0, 0.1), wallAt(w, bs + 0.09, top, 0.1), wallAt(w, bs - 0.09, top, 0.1), N3(w))
  }
}
/** A row of `n` small round-headed lights, `wd` wide, `gap` apart, in one white surround. */
function lights(w: Wall, s: number, z0: number, z1: number, n: number, wd: number, gap: number) {
  const span = n * wd + (n - 1) * gap
  panel(trim, wallAt(w, s, z0 - 0.25), N3(w), span + 0.5, z1 - z0 + 0.5, false, 8, 0.04)
  for (let k = 0; k < n; k++) panel(win, wallAt(w, s - span / 2 + wd / 2 + k * (wd + gap), z0), N3(w), wd, z1 - z0, 'round', 6, 0.08)
}
/** A disc on a wall (rose window, clock face, oculus). */
function disc(p: Part, w: Wall, s: number, z: number, r: number, off: number, seg = 16) {
  const c = wallAt(w, s, z, off)
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * Math.PI * 2, t1 = ((i + 1) / seg) * Math.PI * 2
    ftri(p, c, wallAt(w, s + r * Math.cos(t0), z + r * Math.sin(t0), off), wallAt(w, s + r * Math.cos(t1), z + r * Math.sin(t1), off), N3(w))
  }
}

/**
 * The curved stepped gable, on a wall plane with its outward face flush
 * with the wall: the outline of `steps` rounded steps a side and a round
 * crown, from half-width hw at z0 up to zt; a white coping border round a
 * sandstone face, 0.6 m thick.
 */
function steppedGable(w: Wall, sc: number, hw: number, z0: number, zt: number, steps = 3) {
  const xs = Array.from({ length: steps + 1 }, (_, k) => hw * [1, 0.72, 0.46, 0.23][Math.min(3, k)])
  const rc = xs[steps]
  const v = (zt - z0 - hw) / (steps + 1)
  const right: XY[] = [[hw, 0]]
  let z = 0
  for (let k = 0; k < steps; k++) {
    z += v
    right.push([xs[k], z])
    const r = xs[k] - xs[k + 1]
    for (let j = 1; j <= 4; j++) {
      const t = (j / 4) * (Math.PI / 2)
      right.push([xs[k + 1] + r * Math.cos(t), z + r * Math.sin(t)])
    }
    z += r
  }
  z += v
  right.push([rc, z])
  for (let j = 1; j < 6; j++) {
    const t = (j / 6) * (Math.PI / 2)
    right.push([rc * Math.cos(t), z + rc * Math.sin(t)])
  }
  const outline: XY[] = [...right.map(([x, zz]) => [x, zz] as XY), [0, z + rc], ...right.slice().reverse().map(([x, zz]) => [-x, zz] as XY)]
  const ring = ccw(outline)
  const inner = offsetRing(ring, -0.32)
  const slab = (p: Part, r: XY[], d0: number, d1: number) => {
    const P = (q: XY, d: number) => wallAt(w, sc + q[0], z0 + q[1], d)
    for (const [a, b, c] of polyTris(r)) {
      ftri(p, P(a, d1), P(b, d1), P(c, d1), N3(w))
      ftri(p, P(a, d0), P(b, d0), P(c, d0), [-w.n[0], -w.n[1], 0])
    }
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const t: XY = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(t[0], t[1]) || 1
      // outward in the gable's plane: (t.z, -t.s)
      const ns = t[1] / L, nz = -t[0] / L
      fquad(p, P(a, d0), P(b, d0), P(b, d1), P(a, d1), [w.u[0] * ns, w.u[1] * ns, nz])
    }
  }
  slab(trim, ring, -0.6, 0)
  slab(stone, inner, -0.64, 0.04)
}

/** A buttress of stages [depth, height]..., on a wall at s, `wd` wide, with white sloped caps. */
function buttress(w: Wall, s: number, wd: number, stages: [number, number][]) {
  let d0 = 0
  for (const [d, h] of stages) {
    const a = wallAt(w, s - wd / 2, 0, 0), b = wallAt(w, s + wd / 2, 0, d0 + d)
    const xs = [a[0], b[0]].sort((p, q) => p - q), ys = [a[1], b[1]].sort((p, q) => p - q)
    block(stone, xs[0], xs[1], ys[0], ys[1], 0, h, null)
    // the sloped white cap, falling outward
    const c0 = wallAt(w, s - wd / 2, h + 0.5, 0), c1 = wallAt(w, s + wd / 2, h + 0.5, 0)
    const e0 = wallAt(w, s - wd / 2, h, d0 + d), e1 = wallAt(w, s + wd / 2, h, d0 + d)
    fquad(trim, e0, e1, c1, c0, [w.n[0] * 0.5, w.n[1] * 0.5, d0 + d])
    const f0 = wallAt(w, s - wd / 2, h, 0), f1 = wallAt(w, s + wd / 2, h, 0)
    ftri(trim, f0, e0, c0, [-w.u[0], -w.u[1], 0])
    ftri(trim, f1, c1, e1, [w.u[0], w.u[1], 0])
    d0 += d
  }
}

// ───────────────────────────── the church ─────────────────────────────

const NAVE = { x0: -12.5, x1: 8.0, y0: -6.5, y1: 2.6 }
const TRANS = { x0: -4.8, x1: 3.9, y0: -6.5, y1: 7.4 }
const TOWER = { x0: -12.5, x1: -7.7, y0: 2.6, y1: 7.45 }
const APSE: XY[] = [[8.01, 1.99], [11.59, 1.97], [13.67, 0.09], [13.68, -4.01], [11.36, -5.67], [7.95, -5.66], [3.88, -5.63], [3.9, 2.0]]
const T_SHAFT = 24.5, T_GABLE = 29.7, T_SPIRE = 39.6, T_TOP = 42

function build(): Mat[] {
  stone = new Part(); trim = new Part(); tile = new Part(); win = new Part(); door = new Part()

  // ── Main masses and the white eaves band.
  block(stone, NAVE.x0, NAVE.x1, NAVE.y0, NAVE.y1, 0, EAVE, null)
  block(stone, TRANS.x0, TRANS.x1, TRANS.y0, TRANS.y1, 0, EAVE, null)
  walls(stone, APSE, 0, 17.3 - 6) // the chancel's walls to its eaves (OSM 22 m, roof 7 m, scaled)
  for (const r of [rect(NAVE.x0, NAVE.x1, NAVE.y0, NAVE.y1), rect(TRANS.x0, TRANS.x1, TRANS.y0, TRANS.y1), APSE])
    walls(trim, offsetRing(ccw(r), 0.06), EAVE - 0.4, EAVE)

  // ── Roofs.
  gabled(NAVE.x0, NAVE.x1, NAVE.y0, NAVE.y1, EAVE, RIDGE, 'x', 0.35, [false, true])
  gabled(TRANS.x0, TRANS.x1, TRANS.y0, TRANS.y1, EAVE, RIDGE, 'y', 0.35, [false, false])
  pyramid(tile, offsetRing(ccw(APSE.slice(0, 6)), 0.3), EAVE - 0.25, [9.3, -1.85, 17.3])
  // finial on the chancel roof
  lathe(trim, 9.3, -1.85, [[0.18, 17.2], [0.12, 18.4], [0, 18.5]], 6)

  // ── Stepped gables: north and south transept ends, the west front.
  const wN: Wall = { o: [TRANS.x1, TRANS.y1], u: [-1, 0], n: [0, 1] }
  const wS: Wall = { o: [TRANS.x0, TRANS.y0], u: [1, 0], n: [0, -1] }
  const wW: Wall = { o: [NAVE.x0, NAVE.y0], u: [0, 1], n: [-1, 0] }
  const thw = (TRANS.x1 - TRANS.x0) / 2, nhw = (NAVE.y1 - NAVE.y0) / 2
  steppedGable(wN, thw, thw, EAVE - 0.4, GTOP)
  steppedGable(wS, thw, thw, EAVE - 0.4, GTOP)
  steppedGable(wW, nhw, nhw, EAVE - 0.4, GTOP)

  // ── Transept ends: the great window, an oculus and a small light above.
  for (const w of [wN, wS]) {
    window(w, thw, 4.6, 12.6, 3.4, { bars: 2, surround: 0.35 })
    disc(trim, w, thw, 14.3, 0.75, 0.04, 12)
    disc(win, w, thw, 14.3, 0.5, 0.08, 12)
    window(w, thw, 16.2, 17.8, 0.6)
    for (const s of [0.95, 2 * thw - 0.95]) window(w, s, 3.2, 6.6, 0.8)
  }

  // ── West front: the rose, the porch with its round-headed door, two small lights.
  disc(trim, wW, nhw, 11.0, 2.1, 0.04, 20)
  disc(win, wW, nhw, 11.0, 1.75, 0.08, 20)
  for (const s of [nhw - 2.6, nhw + 2.6]) window(wW, s, 3.4, 5.0, 0.6)
  const P = { x0: -13.7, x1: NAVE.x0, y0: -4.1, y1: 0.2 }
  block(stone, P.x0, P.x1, P.y0, P.y1, 0, 4.6, null)
  gabled(P.x0, P.x1 + 0.3, P.y0, P.y1, 4.6, 7.6, 'x', 0.2, [true, false])
  const wP: Wall = { o: [P.x0, P.y0], u: [0, 1], n: [-1, 0] }
  panel(trim, wallAt(wP, 2.15, 0.2), N3(wP), 2.7, 4.6, 'round', 8, 0.04)
  panel(door, wallAt(wP, 2.15, 0.2), N3(wP), 1.9, 4.0, 'round', 8, 0.08)

  // ── Side windows (round-headed, white surrounds) between the buttresses.
  const wSn: Wall = { o: [NAVE.x0, NAVE.y0], u: [1, 0], n: [0, -1] }
  for (const x of [-10.15, -6.4, 5.6]) window(wSn, x - NAVE.x0, 3.4, 7.6, 1.3)
  const wNn: Wall = { o: [8.0, 7.41], u: [-1, 0], n: [0, 1] }
  window(wNn, 8.0 - 5.95, 3.4, 7.6, 1.3)

  // ── North aisle (lean-to between tower and transept) and north-east block.
  block(stone, -7.7, -4.8, 1.16, 7.44, 0, 18 * K - 3 * K, null)
  {
    const z0 = 18 * K - 3 * K, z1 = 18 * K
    fquad(tile, [-7.7, 7.8, z0], [-4.8, 7.8, z0], [-4.8, 3.0, z1], [-7.7, 3.0, z1], [0, 1, 1])
    window({ o: [-4.8, 7.44], u: [-1, 0], n: [0, 1] }, 1.45, 3.2, 7.4, 1.1)
  }
  block(stone, 3.9, 8.0, 2.6, 7.41, 0, 20 * K - 5 * K, null)
  pyramid(tile, rect(3.7, 8.2, 2.4, 7.6), 20 * K - 5 * K, [5.95, 5.0, 20 * K])
  lathe(trim, 5.95, 5.0, [[0.15, 20 * K - 0.1], [0.1, 20 * K + 1.0], [0, 20 * K + 1.1]], 6)
  // north-east annex, its small gable to the east
  block(stone, 8.0, 11.6, 1.97, 7.38, 0, 7.0, null)
  gabled(8.0, 11.6, 1.97, 7.38, 7.0, 9.5, 'x', 0.25, [false, true])
  lights({ o: [11.6, 1.97], u: [0, 1], n: [1, 0] }, 2.7, 3.0, 5.0, 3, 0.45, 0.25)
  // south-east vestry, its gable to the south
  block(stone, 7.95, 11.36, -10.83, -5.66, 0, 10 * K - 3 * K, null)
  gabled(7.95, 11.36, -10.83, -5.66, 10 * K - 3 * K, 10 * K, 'y', 0.25, [true, false])
  window({ o: [7.95, -10.83], u: [1, 0], n: [0, -1] }, 1.7, 1.6, 3.6, 0.9)

  // ── Chancel windows, on its three outer faces.
  for (const [a, b] of [[APSE[1], APSE[2]], [APSE[2], APSE[3]], [APSE[3], APSE[4]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const w: Wall = { o: a, u, n: [-u[1], u[0]] }
    // the ring runs clockwise here, so flip the normal outward
    const c: XY = [9.3, -1.85], m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    if ((m[0] - c[0]) * w.n[0] + (m[1] - c[1]) * w.n[1] < 0) w.n = [u[1], -u[0]]
    window(w, L / 2, 3.8, 8.6, 1.3)
  }

  // ── Buttresses (two-stage on the nave and transept, three-stage on the tower).
  const b2: [number, number][] = [[0.8, 14 * K], [0.8, 7 * K]]
  const b3: [number, number][] = [[0.55, 20 * K], [0.5, 14 * K], [0.5, 7 * K]]
  for (const x of [3.35, 7.45, -4.25]) buttress({ o: [0, -6.5], u: [1, 0], n: [0, -1] }, x, 1.1, b2)
  for (const x of [-8.45, -11.95]) buttress({ o: [0, -6.5], u: [1, 0], n: [0, -1] }, x, 1.1, b2)
  for (const x of [3.35, 7.45, -4.25]) buttress({ o: [0, 7.42], u: [-1, 0], n: [0, 1] }, -x, 1.1, b2)
  for (const x of [-8.25, -12.0]) buttress({ o: [0, 7.45], u: [-1, 0], n: [0, 1] }, -x, 1.0, b3)
  buttress({ o: [-12.5, 0], u: [0, 1], n: [-1, 0] }, 6.95, 1.1, b3)

  // ── The tower.
  const T = TOWER, tc: XY = [(T.x0 + T.x1) / 2, (T.y0 + T.y1) / 2], th = (T.x1 - T.x0) / 2
  block(stone, T.x0, T.x1, T.y0, T.y1, 0, T_SHAFT, null)
  walls(trim, offsetRing(ccw(rect(T.x0, T.x1, T.y0, T.y1)), 0.08), 16.2, 16.6) // the white ledge where the buttresses stop
  walls(trim, offsetRing(ccw(rect(T.x0, T.x1, T.y0, T.y1)), 0.08), T_SHAFT - 0.4, T_SHAFT)
  const faces: Wall[] = [
    { o: [T.x0, T.y0], u: [0, 1], n: [-1, 0] }, // west
    { o: [T.x1, T.y1], u: [-1, 0], n: [0, 1] }, // north
    { o: [T.x1, T.y0], u: [0, 1], n: [1, 0] }, // east
    { o: [T.x0, T.y0], u: [1, 0], n: [0, -1] }, // south
  ]
  const fw = T.x1 - T.x0
  faces.forEach((w, i) => {
    if (i < 2) {
      lights(w, fw / 2, 9.2, 11.1, 3, 0.5, 0.3)
      window(w, fw / 2, 13.8, 15.7, 0.6)
    }
    window(w, fw / 2 - 0.65, 17.0, 21.0, 0.85)
    window(w, fw / 2 + 0.65, 17.0, 21.0, 0.85)
    lights(w, fw / 2, 22.3, 24.0, 3, 0.4, 0.25)
    // the clock gable: a white-coped stone triangle with its clock, roofed back into the spire
    const A = wallAt(w, 0, T_SHAFT, 0), B = wallAt(w, fw, T_SHAFT, 0), C = wallAt(w, fw / 2, T_GABLE, 0)
    ftri(trim, A, B, C, N3(w))
    const ins = 0.35
    ftri(stone, wallAt(w, ins * 1.6, T_SHAFT + 0.05, 0.04), wallAt(w, fw - ins * 1.6, T_SHAFT + 0.05, 0.04), wallAt(w, fw / 2, T_GABLE - ins * 1.9, 0.04), N3(w))
    disc(door, w, fw / 2, 26.2, 0.8, 0.08, 14)
    const back = (s: number, z: number): V3 => [tc[0] + (wallAt(w, s, z, 0)[0] - tc[0]) * 0.15 + (s === fw / 2 ? 0 : 0), tc[1] + (wallAt(w, s, z, 0)[1] - tc[1]) * 0.15, z]
    const C2 = back(fw / 2, T_GABLE)
    // the gablet's two roof slopes, from the gable's edges back to the spire's axis
    const n1 = (() => { const u: V3 = [C[0] - A[0], C[1] - A[1], C[2] - A[2]], v: V3 = [C2[0] - A[0], C2[1] - A[1], C2[2] - A[2]]; return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]] as V3 })()
    const outward = (n: V3, ref: V3): V3 => (n[0] * ref[0] + n[1] * ref[1] + n[2] * ref[2] < 0 ? [-n[0], -n[1], -n[2]] : n)
    const mid = (p: V3, q: V3): V3 => [(p[0] + q[0]) / 2 - tc[0], (p[1] + q[1]) / 2 - tc[1], 1]
    ftri(tile, A, C, C2, outward(n1, mid(A, C)))
    const n2 = (() => { const u: V3 = [C[0] - B[0], C[1] - B[1], C[2] - B[2]], v: V3 = [C2[0] - B[0], C2[1] - B[1], C2[2] - B[2]]; return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]] as V3 })()
    ftri(tile, B, C2, C, outward(n2, mid(B, C)))
  })
  // the spire: a square pyramid over the shaft, its eaves just past the walls
  pyramid(tile, offsetRing(ccw(rect(T.x0, T.x1, T.y0, T.y1)), 0.15), T_SHAFT, [tc[0], tc[1], T_SPIRE])
  // ball and cross
  lathe(door, tc[0], tc[1], [[0.12, T_SPIRE - 0.3], [0.12, T_SPIRE + 0.2], [0.35, T_SPIRE + 0.45], [0.42, T_SPIRE + 0.75], [0.35, T_SPIRE + 1.05], [0.08, T_SPIRE + 1.25], [0, T_SPIRE + 1.25]], 8, { smooth: true })
  block(door, tc[0] - 0.07, tc[0] + 0.07, tc[1] - 0.07, tc[1] + 0.07, T_SPIRE + 1.2, T_TOP)
  block(door, tc[0] - 0.07, tc[0] + 0.07, tc[1] - 0.5, tc[1] + 0.5, T_TOP - 1.0, T_TOP - 0.75)
  void th

  return [
    { part: stone, material: M.stone },
    { part: trim, material: M.trim },
    { part: tile, material: M.tile },
    { part: win, material: M.window },
    { part: door, material: M.door },
  ]
}

if (import.meta.main) {
  await save('windhoek-christuskirche.glb', 'windhoek-christuskirche', build(), 6500, 250_000,
    { landmark: 'Christuskirche, Windhoek', source: 'generators/windhoek-christuskirche.ts' })
}
