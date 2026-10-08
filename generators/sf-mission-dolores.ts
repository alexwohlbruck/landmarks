/**
 * Mission Dolores (the Old Mission and the Basilica), San Francisco —
 * original procedural geometry, CC0-1.0.
 * bun generators/sf-mission-dolores.ts
 *
 * Frame: built turned to the Basilica, BEARING 355.5 (its axis runs 85.5°,
 * nearly east-west). x along the churches (+x = the Dolores Street fronts,
 * east), y across (+y north, towards 16th Street), z up, metres. The Old
 * Mission's axis is turned 3.5° from the Basilica's (bearing 82), and is
 * built in its own frame and turned into this one. Origin = the centroid of
 * the two OSM outlines together.
 *
 * Evidence
 * - OSM way/256442760 (the Basilica, height 14) and way/256442765 (the Old
 *   Mission, height 8). Both outlines sit ~2-3 m west of the lidar; the lidar
 *   wins.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.5 m, in these frames
 *   (/tmp/city/sf/work/sf-mission-dolores). y = 0 is 23.3 m NAVD88, the
 *   Dolores Street sidewalk in front of the Old Mission (the lowest ground);
 *   the ground rises 2.5 m to the west. Above that:
 *   Old Mission: 48 x 12 m under one low gabled roof, eaves 8.6, ridge 11,
 *   front at x 33; a low side wing (4.5-5.5) to its south.
 *   Basilica: nave x -29..22, 14 m wide, eaves 15.5, ridge 17.5; aisles 9.5;
 *   transept x -16..-1.5 out to y -8 and 21, 18.5; an octagonal drum over the
 *   crossing (r 7) to 22 with a tiled roof and lantern to 29.5; low sacristies
 *   7-7.5 at the west end; the front at x 29 with the north tower (7 m
 *   square) to 25-26.5, two belfry stages to 32 and 38.3 and its dome's top at
 *   44.5, and the south tower to 20.5, one belfry stage to 27.5 and its
 *   dome's top at 31.5; the frontispiece between them to 25.5.
 * - Published (Wikipedia, California Historical Landmark No. 327, SF
 *   Landmark No. 1): the Old Mission (Misión San Francisco de Asís) was
 *   dedicated in 1791, adobe, the oldest intact building in San Francisco;
 *   the Basilica was built 1913-1918 in the Mission Revival style, its
 *   Churrigueresque front added in 1926; the towers are unequal.
 * - Commons daylight photos: "Mission San Francisco de Asis and Dolores
 *   Basilica (2025).jpg" (Ligocsicnarf89, CC BY 4.0, both fronts from
 *   Dolores Street), "Mission San Francisco de Asís, or Mission Dolores.jpg"
 *   (LesyaCA, CC BY-SA 4.0, the Old Mission's front head-on), "Mission
 *   Dolores Basilica, San Francisco.jpg" (Markhenrik, CC BY-SA 4.0, the
 *   transept gable, drum and both towers' tops), "Mission Dolores
 *   Basilica.JPG" (Marco Zanoli, CC BY-SA 3.0), MARELBU's panoramio set (CC BY
 *   3.0, the towers and the Old Mission from the north-east and south-east).
 *
 * Estimated from the photos (scaled to the lidar): the Old Mission's front
 * (four columns on stepped plinths, the balcony at 6.5, three bell niches,
 * the arched door, the deep eaves); the towers' stages, arched openings,
 * pinnacles and tiled domes; the frontispiece's arched window, door and
 * pilasters, drawn as a few bold whitewash panels (its carving is far too
 * fine to model); the transept's round-topped gable and window; the
 * windows along the nave.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const BEARING = 355.5
const ANCHOR = { lng: -122.42692, lat: 37.764314 }
const stone = new Part(), white = new Part(), tile = new Part(), dome = new Part(), wood = new Part(), win = new Part()

// --- Helpers ---
type Seg = { a: XY; t: XY; n: XY; len: number }
function seg(a: XY, b: XY): Seg {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
  return { a, t, n: [t[1], -t[0]], len }
}
const P = (g: Seg, s: number, d: number, z: number): V3 => [g.a[0] + g.t[0] * s + g.n[0] * d, g.a[1] + g.t[1] * s + g.n[1] * d, z]
function wall(part: Part, g: Seg, s0: number, s1: number, z0: number, z1: number, d = 0) {
  part.quad(P(g, s0, d, z0), P(g, s1, d, z0), P(g, s1, d, z1), P(g, s0, d, z1))
}
const fan = (part: Part, pts: V3[]) => { for (let i = 1; i < pts.length - 1; i++) part.tri(pts[0], pts[i], pts[i + 1]) }
/** A round-headed panel, flush on the face. */
function arched(part: Part, g: Seg, sc: number, w: number, z0: number, z1: number, d = 0, n = 8) {
  const r = w / 2, spring = Math.max(z0, z1 - r), o = d + 0.05
  const pts: V3[] = [P(g, sc - r, o, z0), P(g, sc + r, o, z0)]
  for (let k = 0; k <= n; k++) pts.push(P(g, sc + r * Math.cos((k * Math.PI) / n), o, spring + r * Math.sin((k * Math.PI) / n)))
  const c = P(g, sc, o, (z0 + spring) / 2)
  for (let i = 0; i < pts.length; i++) part.tri(c, pts[i], pts[(i + 1) % pts.length])
}
/** A box-section moulding or pier along a face: (d, z) profile, with end caps. */
function band(part: Part, g: Seg, s0: number, s1: number, prof: [number, number][]) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [d0, z0] = prof[k], [d1, z1] = prof[k + 1]
    part.quad(P(g, s0, d0, z0), P(g, s1, d0, z0), P(g, s1, d1, z1), P(g, s0, d1, z1))
  }
  fan(part, prof.map(([d, z]) => P(g, s0, d, z)))
  fan(part, [...prof].reverse().map(([d, z]) => P(g, s1, d, z)))
}
const pier = (part: Part, g: Seg, sc: number, w: number, d: number, z0: number, z1: number) =>
  band(part, g, sc - w / 2, sc + w / 2, [[0, z0], [d, z0], [d, z1], [0, z1]])
/** An axis-aligned box with chamfered vertical edges. */
function block(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, ch = 0.2, top: Part | null = part) {
  const r: XY[] = [[x0 + ch, y0], [x1 - ch, y0], [x1, y0 + ch], [x1, y1 - ch], [x1 - ch, y1], [x0 + ch, y1], [x0, y1 - ch], [x0, y0 + ch]]
  for (let i = 0; i < 8; i++) {
    const a = r[i], b = r[(i + 1) % 8]
    part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (top) fan(top, r.map(([x, y]) => [x, y, z1] as V3))
}
/** A solid of revolution about (cx, cy), smooth-shaded. */
function lathe(part: Part, prof: [number, number][], cx: number, cy: number, n = 12, phase = 0) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const dr = r1 - r0, dz = z1 - z0, l = Math.hypot(dr, dz) || 1
    for (let i = 0; i < n; i++) {
      const t0 = phase + (i / n) * 2 * Math.PI, t1 = phase + ((i + 1) / n) * 2 * Math.PI
      const p = (r: number, z: number, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
      const nn = (t: number): V3 => [(Math.cos(t) * dz) / l, (Math.sin(t) * dz) / l, -dr / l]
      if (r1 < 1e-6) { part.tri(p(r0, z0, t0), p(r0, z0, t1), [cx, cy, z1], undefined, undefined, undefined, [nn(t0), nn(t1), [0, 0, 1]]); continue }
      part.tri(p(r0, z0, t0), p(r0, z0, t1), p(r1, z1, t1), undefined, undefined, undefined, [nn(t0), nn(t1), nn(t1)])
      part.tri(p(r0, z0, t0), p(r1, z1, t1), p(r1, z1, t0), undefined, undefined, undefined, [nn(t0), nn(t1), nn(t0)])
    }
  }
}
/** Flat-faced revolution (an octagon with n = 8). */
function prism(part: Part, prof: [number, number][], cx: number, cy: number, n = 8, phase = Math.PI / 8) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    for (let i = 0; i < n; i++) {
      const t0 = phase + (i / n) * 2 * Math.PI, t1 = phase + ((i + 1) / n) * 2 * Math.PI
      const p = (r: number, z: number, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
      if (r1 < 1e-6) part.tri(p(r0, z0, t0), p(r0, z0, t1), [cx, cy, z1])
      else part.quad(p(r0, z0, t0), p(r0, z0, t1), p(r1, z1, t1), p(r1, z1, t0))
    }
  }
}
/**
 * A gabled roof over a box along x (or y), from a0 to a1, centred across at
 * c: walls to the eaves, gable ends, tiled roof planes with an overhang.
 */
function hall(T: (p: V3) => V3, a0: number, a1: number, c: number, hw: number, eave: number, ridge: number, alongY: boolean, ends: [boolean, boolean], o = 0.5, wallPart = stone) {
  const M = (a: number, b: number, z: number): V3 => T(alongY ? [c - b, a, z] : [a, c + b, z])
  wallPart.quad(M(a0, -hw, 0), M(a1, -hw, 0), M(a1, -hw, eave), M(a0, -hw, eave))
  wallPart.quad(M(a1, hw, 0), M(a0, hw, 0), M(a0, hw, eave), M(a1, hw, eave))
  if (ends[1]) { wallPart.quad(M(a1, -hw, 0), M(a1, hw, 0), M(a1, hw, eave), M(a1, -hw, eave)); wallPart.tri(M(a1, -hw, eave), M(a1, hw, eave), M(a1, 0, ridge)) }
  if (ends[0]) { wallPart.quad(M(a0, hw, 0), M(a0, -hw, 0), M(a0, -hw, eave), M(a0, hw, eave)); wallPart.tri(M(a0, hw, eave), M(a0, -hw, eave), M(a0, 0, ridge)) }
  const ez = eave - (o * (ridge - eave)) / hw, e0 = ends[0] ? a0 - o : a0, e1 = ends[1] ? a1 + o : a1
  tile.quad(M(e0, -hw - o, ez), M(e1, -hw - o, ez), M(e1, 0, ridge + 0.05), M(e0, 0, ridge + 0.05))
  tile.quad(M(e1, hw + o, ez), M(e0, hw + o, ez), M(e0, 0, ridge + 0.05), M(e1, 0, ridge + 0.05))
  // undersides of the eaves and verges
  tile.quad(M(e1, -hw - o, ez), M(e0, -hw - o, ez), M(e0, -hw, eave), M(e1, -hw, eave))
  tile.quad(M(e0, hw + o, ez), M(e1, hw + o, ez), M(e1, hw, eave), M(e0, hw, eave))
  for (const [a, e, up] of [[a1, e1, true], [a0, e0, false]] as [number, number, boolean][]) {
    if (a === e) continue
    for (const sgn of [-1, 1]) {
      const q: V3[] = [M(e, sgn * (hw + o), ez), M(e, 0, ridge + 0.05), M(a, 0, ridge + 0.05), M(a, sgn * (hw + o), ez)]
      if ((sgn > 0) === up) wood.quad(q[0], q[1], q[2], q[3]); else wood.quad(q[3], q[2], q[1], q[0])
      // a dark timber fascia along the rake
      const f: V3[] = [M(e, sgn * (hw + o), ez - 0.4), M(e, 0, ridge - 0.35), M(e, 0, ridge + 0.05), M(e, sgn * (hw + o), ez)]
      if ((sgn > 0) !== up) wood.quad(f[0], f[1], f[2], f[3]); else wood.quad(f[3], f[2], f[1], f[0])
    }
  }
}
/** A flat-roofed (or gently pitched lean-to) box: walls and a tiled top. */
function lowBlock(T: (p: V3) => V3, x0: number, x1: number, y0: number, y1: number, z: number, part = stone, top = tile) {
  const c: V3[] = [[x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0]].map((p) => T(p as V3))
  for (let i = 0; i < 4; i++) {
    const a = c[i], b = c[(i + 1) % 4]
    part.quad(a, b, [b[0], b[1], z], [a[0], a[1], z])
  }
  top.quad(...(c.map((p) => [p[0], p[1], z + 0.05]) as [V3, V3, V3, V3]))
}

const ID = (p: V3) => p

// ===========================================================================
// THE BASILICA
const FRONT = 29.0
const NAVE_C = 6.5, NAVE_HW = 7, NAVE_EAVE = 15.5, NAVE_RIDGE = 17.5
const TR_C = -8.75, TR_HW = 7.25, TR_EAVE = 16, TR_N = 21, TR_S = -8

hall(ID, -29.3, 22.2, NAVE_C, NAVE_HW, NAVE_EAVE, NAVE_RIDGE, false, [true, false])
// the transept, with round-topped gables (drawn below) instead of pointed ones
hall(ID, TR_S, TR_N, TR_C, TR_HW, TR_EAVE, TR_EAVE + 2.4, true, [false, false])
for (const [y, sgn] of [[TR_N, 1], [TR_S, -1]] as [number, number][]) {
  const g = sgn > 0 ? seg([TR_C + TR_HW, y], [TR_C - TR_HW, y]) : seg([TR_C - TR_HW, y], [TR_C + TR_HW, y])
  wall(stone, g, 0, g.len, 0, TR_EAVE)
  // the segmental crest, 3.5 m above the eaves, with a pale coping
  const n = 10, rise = 3.5, pts: V3[] = []
  for (let k = 0; k <= n; k++) { const s = (k / n) * g.len, u = (2 * k) / n - 1; pts.push(P(g, s, 0, TR_EAVE + rise * (1 - u * u))) }
  const crest = [P(g, g.len / 2, 0, TR_EAVE), ...[...pts].reverse()]
  fan(stone, crest)
  fan(stone, [crest[0], ...crest.slice(1).reverse()]) // its back, seen over the roof
  for (let k = 0; k < n; k++) {
    const a = pts[k], b = pts[k + 1], o: V3 = [g.n[0] * 0.35, g.n[1] * 0.35, 0]
    white.quad(a, b, [b[0], b[1], b[2] + 0.45], [a[0], a[1], a[2] + 0.45])
    white.quad([a[0] + o[0], a[1] + o[1], a[2] + 0.45], [b[0] + o[0], b[1] + o[1], b[2] + 0.45], [b[0], b[1], b[2] + 0.45], [a[0], a[1], a[2] + 0.45])
    white.quad([a[0] + o[0], a[1] + o[1], a[2]], [b[0] + o[0], b[1] + o[1], b[2]], [b[0] + o[0], b[1] + o[1], b[2] + 0.45], [a[0] + o[0], a[1] + o[1], a[2] + 0.45])
  }
  // the great arched window, framed
  arched(white, g, g.len / 2, 5.2, 7.4, 16.8, 0, 10)
  arched(win, g, g.len / 2, 4.0, 8.0, 16.2, 0.02, 10)
  band(white, g, -0.2, g.len + 0.2, [[0, TR_EAVE - 0.6], [0.35, TR_EAVE - 0.6], [0.35, TR_EAVE], [0, TR_EAVE]])
}
// the transept's roof ends tucked under the crests
// Aisles along the nave's east half, and low sacristies at the west end.
lowBlock(ID, 2, 22.2, NAVE_C + NAVE_HW, 19, 9.5)
lowBlock(ID, 2, 22.2, -6.1, NAVE_C - NAVE_HW, 9.5)
lowBlock(ID, -29.3, TR_C - TR_HW, NAVE_C + NAVE_HW, 20.7, 7.5)
lowBlock(ID, -29.3, TR_C - TR_HW, -12.5, NAVE_C - NAVE_HW, 7.0)
// a low polygonal apse at the west end
prism(stone, [[4.2, 0], [4.2, 7.5]], -29.3, NAVE_C, 8, Math.PI / 8)
prism(tile, [[4.5, 7.5], [0, 9.5]], -29.3, NAVE_C, 8, Math.PI / 8)
// clerestory windows along the nave and windows in the aisles
for (const side of [1, -1]) {
  const y = NAVE_C + side * NAVE_HW
  const g = side > 0 ? seg([22.2, y], [-29.3, y]) : seg([-29.3, y], [22.2, y])
  const sOf = (x: number) => (side > 0 ? 22.2 - x : x + 29.3)
  for (const x of [5, 10, 15, 20]) arched(win, g, sOf(x), 1.8, 11, 14.4)
  for (const x of [-26, -21]) arched(win, g, sOf(x), 1.8, 9.4, 14.4)
  const ya = side > 0 ? 19 : -6.1
  const ga = side > 0 ? seg([22.2, ya], [2, ya]) : seg([2, ya], [22.2, ya])
  for (const x of [5, 10, 15, 20]) arched(win, ga, side > 0 ? 22.2 - x : x - 2, 1.4, 3.6, 7.4)
}
// the octagonal drum over the crossing, its tiled roof and lantern
{
  const cx = TR_C, cy = NAVE_C
  prism(stone, [[7.0, 12], [7.0, 22]], cx, cy)
  prism(white, [[7.0, 22], [7.35, 22.3], [7.35, 22.8], [7.0, 22.8]], cx, cy)
  prism(tile, [[7.3, 22.8], [1.9, 25.6]], cx, cy)
  prism(white, [[1.6, 25.6], [1.6, 27.6], [1.9, 27.9], [0, 28.5]], cx, cy)
  lathe(dome, [[0.9, 28.2], [0.6, 28.9], [0.15, 29.5], [0, 29.6]], cx, cy, 8)
  // a round window on each face of the drum
  for (let i = 0; i < 8; i++) {
    const a = Math.PI / 8 + ((i + 0.5) / 8) * 2 * Math.PI, r = 7.0 * Math.cos(Math.PI / 8) + 0.05
    const nx = Math.cos(a), ny = Math.sin(a), tx = -ny, ty = nx
    const p = (t: number, z: number): V3 => [cx + nx * r + tx * t, cy + ny * r + ty * t, z]
    const pts: V3[] = []
    for (let k = 0; k < 10; k++) { const b = (k / 10) * 2 * Math.PI; pts.push(p(1.0 * Math.cos(b), 19.4 + 1.0 * Math.sin(b))) }
    fan(win, pts)
  }
}

// --- The front: the frontispiece between two unequal towers ---
const TC = 25.75, HS = 3.6 // tower centre (x) and half size
const TN = 16, TS = -2.5 // tower centres (y)
function tower(cy: number, body: number, stages: { half: number; top: number }[], domeTop: number) {
  block(stone, TC - HS, TC + HS, cy - HS, cy + HS, 0, body, 0.25, null)
  block(white, TC - HS - 0.3, TC + HS + 0.3, cy - HS - 0.3, cy + HS + 0.3, body - 0.9, body, 0.25, white)
  // small slit windows up the plain shaft, as in the photos
  const east = seg([TC + HS, cy - HS], [TC + HS, cy + HS])
  wall(win, east, HS - 0.45, HS + 0.45, body - 5.6, body - 3.4, 0.05)
  let z = body
  stages.forEach((st, i) => {
    const h = st.half
    block(i === 0 ? stone : white, TC - h, TC + h, cy - h, cy + h, z, st.top, 0.6, null)
    block(white, TC - h - 0.25, TC + h + 0.25, cy - h - 0.25, cy + h + 0.25, st.top - 0.6, st.top, 0.4, white)
    const faces = [seg([TC + h, cy - h], [TC + h, cy + h]), seg([TC + h, cy + h], [TC - h, cy + h]), seg([TC - h, cy + h], [TC - h, cy - h]), seg([TC - h, cy - h], [TC + h, cy - h])]
    for (const g of faces) {
      arched(win, g, g.len / 2, h * 0.75, z + 0.8, st.top - 1.0, 0, 8)
      // ornamented corner piers, pale
      pier(white, g, 0.45, 0.9, 0.2, z, st.top - 0.6)
      pier(white, g, g.len - 0.45, 0.9, 0.2, z, st.top - 0.6)
    }
    // finials at the corners of each stage
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) lathe(white, [[0.32, st.top], [0.32, st.top + 0.6], [0, st.top + 1.5]], TC + sx * (h - 0.3), cy + sy * (h - 0.3), 6)
    z = st.top
  })
  // the drum and the green-tiled dome with a finial
  const r = stages[stages.length - 1].half * 0.75
  lathe(white, [[r, z], [r, z + 1.1], [r + 0.15, z + 1.3]], TC, cy, 12)
  const prof: [number, number][] = []
  for (let k = 0; k <= 5; k++) { const t = (k / 5) * (Math.PI / 2); prof.push([0.25 + r * Math.cos(t), z + 1.3 + (domeTop - 1.2 - z - 1.3) * Math.sin(t)]) }
  lathe(dome, prof, TC, cy, 12)
  lathe(dome, [[0.25, domeTop - 1.2], [0.25, domeTop - 0.6], [0.45, domeTop - 0.4], [0, domeTop]], TC, cy, 6)
}
tower(TN, 25.0, [{ half: 2.9, top: 32.0 }, { half: 2.4, top: 38.3 }], 44.5)
tower(TS, 20.5, [{ half: 2.8, top: 27.5 }], 31.5)
// the frontispiece: wall to 20, a stepped crest to 25.5, the Churrigueresque
// centre drawn as pale pilasters round an arched window, and the door
{
  const y0 = TS + HS, y1 = TN - HS, x0 = 22.2
  block(stone, x0, FRONT, y0, y1, 0, 20, 0.01, stone)
  const g = seg([FRONT, y0], [FRONT, y1]), m = g.len / 2
  // crest: steps rising to a central peak
  const steps: [number, number, number][] = [[m - 4.2, m + 4.2, 21.2], [m - 3.0, m + 3.0, 22.6], [m - 1.8, m + 1.8, 24.0], [m - 0.7, m + 0.7, 25.5]]
  for (const [s0, s1, z1] of steps) band(white, g, s0, s1, [[-1.4, 19.9], [0.1, 19.9], [0.1, z1], [-1.4, z1]])
  // the ornamented centre: a pale field with pilasters
  band(white, g, m - 4.6, m + 4.6, [[0, 0.6], [0.12, 0.6], [0.12, 20], [0, 20]])
  for (const s of [m - 4.2, m - 2.6, m + 2.6, m + 4.2]) pier(white, g, s, 0.7, 0.55, 0.6, 19.4)
  arched(win, g, m, 2.8, 11.6, 18.4, 0.12, 8)
  arched(wood, g, m, 3.0, 0.6, 7.6, 0.12, 8)
  band(white, g, m - 4.8, m + 4.8, [[0, 9.4], [0.7, 9.4], [0.7, 10.2], [0, 10.2]])
  // side doors in the towers' bases
  for (const cy of [TN, TS]) {
    const t = seg([TC + HS, cy - HS], [TC + HS, cy + HS])
    band(white, t, HS - 1.6, HS + 1.6, [[0, 0.6], [0.12, 0.6], [0.12, 6.8], [0, 6.8]])
    arched(wood, t, HS, 2.2, 0.6, 5.4, 0.12, 8)
  }
  // a broad flight of steps is ground; left out. A cornice across the front.
  band(white, g, 0, g.len, [[0, 19.4], [0.4, 19.4], [0.4, 20.1], [0, 20.1]])
}

// ===========================================================================
// THE OLD MISSION, in its own frame (bearing 352), turned into this one.
const rad = (d: number) => (d * Math.PI) / 180
const OM = (p: V3): V3 => {
  // frame 352 -> world -> frame 355.5, about the same anchor
  const b1 = rad(352), b2 = rad(BEARING)
  const x = p[0] * Math.cos(b1) + p[1] * Math.sin(b1), y = -p[0] * Math.sin(b1) + p[1] * Math.cos(b1)
  return [x * Math.cos(b2) - y * Math.sin(b2), x * Math.sin(b2) + y * Math.cos(b2), p[2]]
}
{
  const C = -15.5, HW = 5.6, EAVE = 8.6, RIDGE = 11, X0 = -15, X1 = 33
  hall(OM, X0, X1, C, HW, EAVE, RIDGE, false, [true, true], 0.9, white)
  // the side wing to the south, low and gabled
  hall(OM, 18.5, 31, -23.8, 2.3, 4.4, 5.6, false, [true, true], 0.4, white)
  // the front: plinths, four columns, the balcony, bell niches, the door
  const g0 = seg([X1, C - HW], [X1, C + HW])
  const g: Seg = { ...g0, a: [OM([X1, C - HW, 0])[0], OM([X1, C - HW, 0])[1]], t: [OM([0, 1, 0])[0], OM([0, 1, 0])[1]] as XY }
  g.n = [g.t[1], -g.t[0]]
  const m = g.len / 2
  for (const sgn of [-1, 1]) {
    // a stepped plinth under each pair of columns
    band(white, g, m + sgn * 3.25 - 2.0, m + sgn * 3.25 + 2.0, [[0, 0], [1.0, 0], [1.0, 1.6], [0.8, 1.9], [0.8, 2.6], [0, 2.6]])
    for (const off of [2.55, 3.95]) {
      const sc = m + sgn * off
      const c = P(g, sc, 0.55, 0)
      lathe(white, [[0.42, 2.6], [0.42, 6.0], [0.55, 6.2], [0.55, 6.45]], c[0], c[1], 10)
      const c2 = P(g, sc, 0.3, 0)
      lathe(white, [[0.3, 7.4], [0.3, 9.0], [0.4, 9.15]], c2[0], c2[1], 8)
    }
  }
  // the balcony: a dark timber deck and railing across the front
  band(wood, g, m - 4.6, m + 4.6, [[0, 6.3], [1.1, 6.3], [1.1, 6.55], [0, 6.55]])
  band(wood, g, m - 4.6, m + 4.6, [[1.0, 6.55], [1.1, 6.55], [1.1, 7.4], [1.0, 7.4]])
  // three bell niches between the upper columns, and the door
  for (const s of [m - 1.6, m, m + 1.6]) arched(win, g, s, 0.8, 7.6, 8.6, 0, 6)
  arched(white, g, m, 3.2, 0.3, 5.0, 0.05, 8)
  arched(wood, g, m, 2.5, 0.3, 4.5, 0.1, 8)
  // a cross on the gable
  const top = P(g, m, 0.2, 0)
  block(wood, top[0] - 0.12, top[0] + 0.12, top[1] - 0.12, top[1] + 0.12, RIDGE - 0.2, RIDGE + 2.2, 0.03)
  const bar = OM([X1 + 0.2, C, 0])
  block(wood, bar[0] - 0.12, bar[0] + 0.12, bar[1] - 0.7, bar[1] + 0.7, RIDGE + 1.3, RIDGE + 1.55, 0.03)
  // two small doors in the side wing's front
  const gw: Seg = { ...g, a: [OM([31, -26.1, 0])[0], OM([31, -26.1, 0])[1]], len: 4.6 }
  arched(wood, gw, 1.3, 1.1, 0.4, 2.8, 0, 6)
  arched(wood, gw, 3.2, 1.1, 0.4, 2.8, 0, 6)
  // small high windows along the nave's north side
  const gn: Seg = (() => {
    const a = OM([X1, C + HW, 0]), b = OM([X0, C + HW, 0])
    return seg([a[0], a[1]], [b[0], b[1]])
  })()
  for (const x of [6, 14, 22]) wall(win, gn, X1 - x - 0.5, X1 - x + 0.5, 5.2, 6.6, 0.05)
}

const parts = [
  { part: stone, material: PALETTE.stone },
  { part: white, material: finish('mission-whitewash', 0xf8f6f0) },
  { part: tile, material: PALETTE.terracotta },
  { part: dome, material: PALETTE.patina },
  { part: wood, material: finish('mission-timber', 0x6e5646) },
  { part: win, material: PALETTE.window },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Mission Dolores', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 44.5,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/256442760', 'way/256442765'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-mission-dolores.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
