/**
 * United States Capitol, Washington, DC — procedural, CC0-1.0, no textures.
 * bun generators/dc-us-capitol.ts
 *
 * Map frame: x east, y north, z up, metres. Anchor is the centroid of the OSM
 * outline way/66418809 (-77.00900, 38.88981); the plan is built axis-aligned
 * and placed at bearing 0.2°, the outline's measured skew. The building is
 * mirrored about y = 0 (the east–west axis), as the real one is to within
 * 0.4 m in OSM.
 *
 * Evidence
 * - OSM (measured): outline way/66418809, height 87.6; parts 657315658
 *   (central block, 21.2), 311181726/311181727 (House and Senate wings,
 *   24.2 with 3 m hipped roofs), 507459309 (east portico gable, 21.2–25),
 *   507459324 (dome base, 21.2–27), 507459322 peristyle (27–39.3, Ø 38),
 *   507459321 attic (39.3–49.4, Ø 33), 507842343 (49.4–51.8, Ø 30),
 *   507459320 dome (51.8–67.3, Ø 27), 507459319/318/316/315 lantern tiers
 *   (65.3–76.2, Ø 10/8/6/8), 507459314 cap (76.2–81.7), 507832690 Statue of
 *   Freedom (to 87.6); 507459311/313 the low domes over the old chambers
 *   (21.2–25, Ø 21) and 507459310/312 their lanterns (to 27);
 *   1301380219/20/21 the east stairs (8 m).
 * - Published: dome 288 ft (87.8 m) to the top of the statue, 36 peristyle
 *   columns (Wikipedia, "United States Capitol dome"); Statue of Freedom
 *   19.5 ft (5.9 m); building 751 × 350 ft (229 × 107 m), which matches the
 *   OSM outline (228 × 108 m).
 * - Photos (Wikimedia Commons, looked at, not traced):
 *   east front, Martin Falbisoner, CC BY-SA 3.0, File:US_Capitol_east_side.JPG;
 *   west front, Architect of the Capitol, public domain,
 *   File:United_States_Capitol_-_west_front.jpg;
 *   dome, Diliff, CC BY 2.5, File:US_Capitol_dome_Jan_2006.jpg;
 *   dome, Andreas Praefcke, CC BY 3.0, File:Capitol_dome_Washington_DC_2007.jpg;
 *   aerial from the west, Carol M. Highsmith, public domain,
 *   File:Aerial_view,_United_States_Capitol_building,_Washington,_D.C_LCCN2010630477.jpg;
 *   north-east, Beethoven, CC BY-SA 4.0, File:2018-03-26_–_United_States_Capitol_East_Front,_viewed_from_the_northeast_…jpg;
 *   south-west, AgnosticPreachersKid, CC BY-SA 3.0,
 *   File:Southwest_corner_of_the_United_States_Capitol.JPG;
 *   House wing, Architect of the Capitol, public domain,
 *   File:Flickr_-_USCapitol_-_South_Wing_of_the_United_States_Capitol.jpg.
 *
 * Estimated from the photos: storey heights (ground floor 6.7 m, giant order
 * to 17.8 m, cornice to 19.8, balustrade to 21.2), the column counts of each
 * portico and colonnade, the attic over the west front's centre (to 24.4),
 * the dome profile between the OSM tiers (a raised curve, 14.6 m semi-axis
 * over a 13.6 m radius), the pediment pitch (16°) and the stair runs. The
 * pediments of the wing porticos are not in OSM; the photos show them.
 * Not modelled: the West Front terraces and stairs (way/904789847, outside
 * the outline), lawns, the reflecting pool, sculpture, lettering.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), bronze = new Part(), shade = new Part()

const unit = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
function tri(p: Part, a: V3, b: V3, c: V3, n?: V3[]) { p.tri(a, b, c, undefined, undefined, undefined, n) }
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n?: [V3, V3, V3, V3]) {
  tri(p, a, b, c, n && [n[0], n[1], n[2]])
  tri(p, a, c, d, n && [n[0], n[2], n[3]])
}

// ---------------------------------------------------------------------------
// Elevation (estimated from the photos against OSM's 21.2 m wall height).

const GROUND_TOP = 6.7 // rusticated ground floor
const ORDER0 = 7.3, ORDER1 = 17.8 // giant Corinthian order
const CORNICE = 19.8 // top of the entablature
const PARAPET = 21.2 // top of the balustrade (OSM)
const ROOF = PARAPET // flat roofs, level with the balustrade's top

// ---------------------------------------------------------------------------
// Plan: the outer wall line of the central block, links and wings, north
// half from the east portico round to the west front (OSM, rounded to 0.1 m),
// mirrored for the south half. Counter-clockwise from above.

const NORTH: XY[] = [
  [31, 11.6], [28, 11.6], [28, 24.8], [24.4, 24.8], [24.4, 52.7], [17.6, 52.7], [17.6, 67.3],
  [34.7, 67.3], [34.7, 76.8], [38.1, 76.8], [38.1, 99.8], [34.7, 99.8], [34.7, 110.5],
  [13, 110.5], [13, 113.9], [-23.7, 113.9], [-23.7, 110.7], [-42, 110.7], [-42, 105.5],
  [-45.3, 105.5], [-45.3, 72.7], [-42.1, 72.7], [-42.1, 67.1], [-13.4, 67.1], [-13.4, 52.6],
  [-23.9, 52.6], [-23.9, 26.1], [-46, 26.1], [-46, 15.9], [-49.5, 15.9],
]
const PLAN: XY[] = [...NORTH, ...[...NORTH].reverse().map(([x, y]): XY => [x, -y])]

/** Inset a rectilinear counter-clockwise ring by d (negative grows it). */
function inset(ring: XY[], d: number): XY[] {
  const n = ring.length
  return ring.map((p, i) => {
    const a = ring[(i + n - 1) % n], c = ring[(i + 1) % n]
    const l0 = Math.hypot(p[0] - a[0], p[1] - a[1]), l1 = Math.hypot(c[0] - p[0], c[1] - p[1])
    const n0: XY = [-(p[1] - a[1]) / l0, (p[0] - a[0]) / l0], n1: XY = [-(c[1] - p[1]) / l1, (c[0] - p[0]) / l1]
    // For right-angled corners the inset vertex is p + d (n0 + n1).
    const straight = Math.abs(n0[0] - n1[0]) + Math.abs(n0[1] - n1[1]) < 1e-6
    return straight ? [p[0] + d * n0[0], p[1] + d * n0[1]] : [p[0] + d * (n0[0] + n1[0]), p[1] + d * (n0[1] + n1[1])]
  })
}

/** Ear-clipping triangulation of a simple counter-clockwise ring. */
function triangulate(ring: XY[]): [number, number, number][] {
  const idx = ring.map((_, i) => i), out: [number, number, number][] = []
  const area2 = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => area2(a, b, p) > 1e-9 && area2(b, c, p) > 1e-9 && area2(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let clipped = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = ring[i0], b = ring[i1], c = ring[i2]
      const ar = area2(a, b, c)
      if (ar <= 1e-9) {
        if (Math.abs(ar) <= 1e-9) { idx.splice(k, 1); clipped = true; break } // collinear
        continue
      }
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(ring[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); clipped = true; break
    }
    if (!clipped) throw new Error('triangulation failed')
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
function flat(p: Part, ring: XY[], z: number, up = true) {
  for (const [a, b, c] of triangulate(ring)) {
    const A: V3 = [...ring[a], z], B: V3 = [...ring[b], z], C: V3 = [...ring[c], z]
    if (up) tri(p, A, B, C); else tri(p, A, C, B)
  }
}

// ---------------------------------------------------------------------------
// Facades. Each edge of the plan is a straight wall; features along it are
// placed by s, the distance from the edge's start, and d, the depth inward
// from the outline.

type Edge = { a: XY; b: XY; u: XY; n: XY; len: number }
const edges: Edge[] = PLAN.map((a, i) => {
  const b = PLAN[(i + 1) % PLAN.length], len = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
  return { a, b, u, n: [-u[1], u[0]], len } // n points inward
})
const at = (e: Edge, s: number, d: number, z: number): V3 => [e.a[0] + e.u[0] * s + e.n[0] * d, e.a[1] + e.u[1] * s + e.n[1] * d, z]
const outward = (e: Edge): V3 => [-e.n[0], -e.n[1], 0]
const findEdge = (a: XY, b: XY) => edges.findIndex((e) => Math.hypot(e.a[0] - a[0], e.a[1] - a[1]) < 0.05 && Math.hypot(e.b[0] - b[0], e.b[1] - b[1]) < 0.05)
/** An edge and its mirror image across y = 0 (reversed, since the ring is). */
const both = (a: XY, b: XY) => {
  const i = findEdge(a, b), j = findEdge([b[0], -b[1]], [a[0], -a[1]])
  if (i < 0 || j < 0) throw new Error(`no edge ${a} → ${b}`)
  return i === j ? [i] : [i, j]
}

/** A recessed colonnade in the giant order: depth of the back wall, column count. */
type Loggia = { s0: number; s1: number; depth: number; columns: number; colD?: number }
type Spec = { loggia?: Loggia; ground?: 'rect' | 'arch' | 'none'; parapet?: boolean; order?: 'windows' | 'none' }
const specs = new Map<number, Spec>()
const spec = (a: XY, b: XY, s: Spec | ((e: Edge) => Spec)) => {
  for (const i of both(a, b)) specs.set(i, typeof s === 'function' ? s(edges[i]) : s)
}
const whole = (depth: number, columns: number, colD?: number) => (e: Edge): Spec => ({ loggia: { s0: 0.9, s1: e.len - 0.9, depth, columns, colD } })

// East front: the central portico (8 columns under the pediment), its
// flanking screen colonnades (4 a side), and on each wing a pedimented
// portico of 8 with 3-column returns either side.
specs.set(findEdge([31, -11.6], [31, 11.6]), { loggia: { s0: 0.7, s1: 22.5, depth: 3.6, columns: 8, colD: 0.95 }, ground: 'none', parapet: false })
spec([31, 11.6], [28, 11.6], { parapet: false, order: 'none' })
spec([28, 11.6], [28, 24.8], whole(2.4, 4))
spec([34.7, 67.3], [34.7, 76.8], whole(2.1, 3))
spec([34.7, 99.8], [34.7, 110.5], whole(2.1, 3))
spec([38.1, 76.8], [38.1, 99.8], (e) => ({ loggia: { s0: 0.6, s1: e.len - 0.6, depth: 2.9, columns: 8, colD: 0.9 }, ground: 'none', parapet: false }))
spec([34.7, 76.8], [38.1, 76.8], { parapet: false, order: 'none', ground: 'none' })
spec([38.1, 99.8], [34.7, 99.8], { parapet: false, order: 'none', ground: 'none' })
// North and south ends of the wings: a colonnade of 10 on the projection.
spec([13, 113.9], [-23.7, 113.9], (e) => ({ loggia: { s0: 1.4, s1: e.len - 1.4, depth: 2.4, columns: 10 }, ground: 'arch' }))
// West sides of the wings: the long loggias of 10 over a ground-floor arcade.
spec([-45.3, 105.5], [-45.3, 72.7], (e) => ({ loggia: { s0: 1.4, s1: e.len - 1.4, depth: 2.6, columns: 10 }, ground: 'arch' }))
// West front: ten columns in antis at the centre, under the attic storey.
specs.set(findEdge([-49.5, 15.9], [-49.5, -15.9]), { loggia: { s0: 3.6, s1: 28.2, depth: 2.2, columns: 10 }, ground: 'arch', parapet: false })
spec([-46, 26.1], [-46, 15.9], { parapet: false })
spec([-46, 15.9], [-49.5, 15.9], { parapet: false })
spec([-23.9, 26.1], [-46, 26.1], { parapet: false })

// The moulding profile every wall carries, as (d, z) steps from the ground:
// rusticated base, belt course, giant order, entablature with a bevelled
// cornice, balustrade.
const D_BASE = 0.3, D_ORDER = 0.55, D_PARA = 0.3, D_PARA_IN = 0.9
type Step = { d0: number; z0: number; d1: number; z1: number; p: Part; key?: 'order' | 'para' }
const STEPS: Step[] = [
  { d0: D_BASE, z0: 0, d1: D_BASE, z1: GROUND_TOP, p: stone },
  { d0: D_BASE, z0: GROUND_TOP, d1: D_ORDER, z1: ORDER0, p: trim }, // belt course
  { d0: D_ORDER, z0: ORDER0, d1: D_ORDER, z1: ORDER1, p: stone, key: 'order' },
  { d0: D_ORDER, z0: ORDER1, d1: 0.3, z1: 18.95, p: trim }, // frieze
  { d0: 0.3, z0: 18.95, d1: 0, z1: 19.5, p: trim }, // cornice, bevelled out
  { d0: 0, z0: 19.5, d1: D_PARA, z1: CORNICE, p: trim }, // and back
  { d0: D_PARA, z0: CORNICE, d1: D_PARA, z1: PARAPET, p: trim, key: 'para' },
  { d0: D_PARA, z0: PARAPET, d1: D_PARA_IN, z1: PARAPET, p: trim, key: 'para' },
]

/** Along-edge position of the edge's ends once inset by d. */
const rings = new Map<number, XY[]>()
const ringAt = (d: number) => { if (!rings.has(d)) rings.set(d, inset(PLAN, d)); return rings.get(d)! }
function ends(i: number, d: number): [number, number] {
  const e = edges[i], r = ringAt(d), a = r[i], b = r[(i + 1) % r.length]
  return [(a[0] - e.a[0]) * e.u[0] + (a[1] - e.a[1]) * e.u[1], (b[0] - e.a[0]) * e.u[0] + (b[1] - e.a[1]) * e.u[1]]
}
/** A wall strip on an edge between s0..s1 at depth d0→d1, heights z0→z1. */
function strip(p: Part, e: Edge, s0a: number, s1a: number, d0: number, z0: number, s0b: number, s1b: number, d1: number, z1: number) {
  quad(p, at(e, s0a, d0, z0), at(e, s1a, d0, z0), at(e, s1b, d1, z1), at(e, s0b, d1, z1))
}

function windowPanel(e: Edge, s: number, w: number, d: number, z0: number, z1: number, arch = false) {
  const o = d - 0.05
  if (!arch) { quad(win, at(e, s - w / 2, o, z0), at(e, s + w / 2, o, z0), at(e, s + w / 2, o, z1), at(e, s - w / 2, o, z1)); return }
  const r = w / 2, spring = z1 - r
  quad(win, at(e, s - r, o, z0), at(e, s + r, o, z0), at(e, s + r, o, spring), at(e, s - r, o, spring))
  const seg = 4
  for (let k = 0; k < seg; k++) {
    const a0 = (k * Math.PI) / seg, a1 = ((k + 1) * Math.PI) / seg
    tri(win, at(e, s, o, spring), at(e, s + r * Math.cos(a0), o, spring + r * Math.sin(a0)), at(e, s + r * Math.cos(a1), o, spring + r * Math.sin(a1)))
  }
}

/** Evenly spaced bay centres along [s0, s1], about one per `pitch` metres. */
function bays(s0: number, s1: number, pitch = 4.6, margin = 1.1): number[] {
  const L = s1 - s0 - 2 * margin
  if (L < 1.6) return []
  const n = Math.max(1, Math.round(L / pitch))
  return Array.from({ length: n }, (_, k) => s0 + margin + (L * (k + 0.5)) / n)
}

/** A column: a smooth, slightly tapering prism, no caps. */
function column(p: Part, c: XY, z0: number, z1: number, r0: number, r1: number, sides = 6, phase = 0) {
  for (let k = 0; k < sides; k++) {
    const a0 = phase + (k * 2 * Math.PI) / sides, a1 = phase + ((k + 1) * 2 * Math.PI) / sides
    const n0: V3 = [Math.cos(a0), Math.sin(a0), 0], n1: V3 = [Math.cos(a1), Math.sin(a1), 0]
    quad(p, [c[0] + r0 * n0[0], c[1] + r0 * n0[1], z0], [c[0] + r0 * n1[0], c[1] + r0 * n1[1], z0],
      [c[0] + r1 * n1[0], c[1] + r1 * n1[1], z1], [c[0] + r1 * n0[0], c[1] + r1 * n0[1], z1], [n0, n1, n1, n0])
  }
}

edges.forEach((e, i) => {
  const sp = specs.get(i) ?? {}
  const parapet = sp.parapet !== false
  for (const st of STEPS) {
    if (st.key === 'para' && !parapet) continue
    const [a0, b0] = ends(i, st.d0), [a1, b1] = ends(i, st.d1)
    if (st.key === 'order' && sp.loggia) {
      const { s0, s1, depth, columns, colD } = sp.loggia
      const [A, B] = ends(i, D_ORDER)
      strip(stone, e, A, s0, D_ORDER, ORDER0, A, s0, D_ORDER, ORDER1)
      strip(stone, e, s1, B, D_ORDER, ORDER0, s1, B, D_ORDER, ORDER1)
      strip(shade, e, s0, s1, depth, ORDER0, s0, s1, depth, ORDER1) // back wall, in shadow
      quad(shade, at(e, s0, D_ORDER, ORDER0), at(e, s0, D_ORDER, ORDER1), at(e, s0, depth, ORDER1), at(e, s0, depth, ORDER0)) // jambs
      quad(shade, at(e, s1, depth, ORDER0), at(e, s1, depth, ORDER1), at(e, s1, D_ORDER, ORDER1), at(e, s1, D_ORDER, ORDER0))
      quad(shade, at(e, s0, D_ORDER, ORDER1), at(e, s1, D_ORDER, ORDER1), at(e, s1, depth, ORDER1), at(e, s0, depth, ORDER1)) // soffit
      quad(trim, at(e, s0, depth, ORDER0), at(e, s1, depth, ORDER0), at(e, s1, D_ORDER, ORDER0), at(e, s0, D_ORDER, ORDER0)) // floor
      const pitch = (s1 - s0) / columns, cd = colD ?? D_ORDER + 0.65
      for (let k = 0; k < columns; k++) {
        const p = at(e, s0 + pitch * (k + 0.5), cd, 0)
        column(trim, [p[0], p[1]], ORDER0, ORDER1, 0.66, 0.56, 5, Math.PI / 2)
      }
      continue
    }
    strip(st.p, e, a0, b0, st.d0, st.z0, a1, b1, st.d1, st.z1)
  }
  // Windows on the plain wall: two rows in the order, one in the base.
  const [A, B] = ends(i, D_ORDER)
  const free: [number, number][] = sp.loggia ? [[A, sp.loggia.s0], [sp.loggia.s1, B]] : [[A, B]]
  if (sp.order !== 'none') for (const [s0, s1] of free) for (const s of bays(s0, s1)) {
    windowPanel(e, s, 1.5, D_ORDER, 8.4, 12.7)
    windowPanel(e, s, 1.3, D_ORDER, 14.0, 16.2)
  }
  if (sp.ground !== 'none') {
    const [GA, GB] = ends(i, D_BASE)
    const arch = sp.ground === 'arch'
    const list = arch && sp.loggia ? bays(sp.loggia.s0, sp.loggia.s1, (sp.loggia.s1 - sp.loggia.s0) / (sp.loggia.columns - 1), 0) : bays(GA, GB)
    for (const s of list) windowPanel(e, s, arch ? 2.0 : 1.3, D_BASE, arch ? 1.0 : 1.8, arch ? 5.4 : 4.6, arch)
  }
})

// Flat roofs behind the balustrade, hipped roofs over the wings.
flat(roof, ringAt(D_PARA_IN), ROOF)
function hip(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const h = Math.min(x1 - x0, y1 - y0) / 2, xm0 = x0 + h, xm1 = x1 - h, ym = (y0 + y1) / 2
  const a: V3 = [x0, y0, z0], b: V3 = [x1, y0, z0], c: V3 = [x1, y1, z0], d: V3 = [x0, y1, z0]
  const r0: V3 = [xm0, ym, z1], r1: V3 = [xm1, ym, z1]
  quad(roof, a, b, r1, r0); quad(roof, c, d, r0, r1); tri(roof, b, c, r1); tri(roof, d, a, r0)
}
for (const s of [-1, 1]) {
  const [y0, y1] = s > 0 ? [68.2, 109.6] : [-109.6, -68.2]
  hip(-41.1, 33.8, y0, y1, ROOF, 23.2)
}

// The attic storey over the west front's centre.
{
  const ring: XY[] = [[-23.9, -26.1], [-23.9, 26.1], [-46, 26.1], [-46, 15.9], [-49.5, 15.9], [-49.5, -15.9], [-46, -15.9], [-46, -26.1]]
  const prof: [number, number, number, number, Part][] = [
    [D_PARA, CORNICE, D_PARA, 23.6, stone], [D_PARA, 23.6, 0.1, 23.9, trim], [0.1, 23.9, 0.1, 24.2, trim], [0.1, 24.2, 0.4, 24.4, trim],
  ]
  const rs = new Map<number, XY[]>()
  const r = (d: number) => { if (!rs.has(d)) rs.set(d, inset(ring, d)); return rs.get(d)! }
  for (const [d0, z0, d1, z1, p] of prof) {
    const A = r(d0), B = r(d1)
    for (let k = 0; k < ring.length; k++) {
      const l = (k + 1) % ring.length
      quad(p, [...A[k], z0], [...A[l], z0], [...B[l], z1], [...B[k], z1])
    }
  }
  flat(roof, r(0.4), 24.4)
}

// Pediments: the central east portico and the two wing porticos. Front
// gable over the cornice, roof slopes running back into the block.
function pediment(xFront: number, xBack: number, y0: number, y1: number, pitchDeg = 16) {
  const ym = (y0 + y1) / 2, rise = ((y1 - y0) / 2) * Math.tan((pitchDeg * Math.PI) / 180), z0 = CORNICE, z1 = CORNICE + rise
  // Raking cornice: a bevelled lip proud of the tympanum.
  const lip = 0.35
  tri(stone, [xFront - lip, y0 + 0.9, z0 + 0.25], [xFront - lip, y1 - 0.9, z0 + 0.25], [xFront - lip, ym, z1 - 0.55])
  const A: V3 = [xFront, y0, z0], B: V3 = [xFront, y1, z0], C: V3 = [xFront, ym, z1]
  const Ab: V3 = [xBack, y0, z0], Bb: V3 = [xBack, y1, z0], Cb: V3 = [xBack, ym, z1]
  // Trim frame round the tympanum (front face, ring between outer and inner triangles).
  const inA: V3 = [xFront, y0 + 0.9, z0 + 0.25], inB: V3 = [xFront, y1 - 0.9, z0 + 0.25], inC: V3 = [xFront, ym, z1 - 0.55]
  quad(trim, A, B, inB, inA); quad(trim, B, C, inC, inB); quad(trim, C, A, inA, inC)
  // Tympanum sides between frame and recessed face.
  const fA: V3 = [xFront - lip, y0 + 0.9, z0 + 0.25], fB: V3 = [xFront - lip, y1 - 0.9, z0 + 0.25], fC: V3 = [xFront - lip, ym, z1 - 0.55]
  quad(trim, inA, inB, fB, fA); quad(trim, inB, inC, fC, fB); quad(trim, inC, inA, fA, fC)
  // Roof slopes (marble in OSM, pale in the photos) and the soffit lip.
  quad(stone, B, Bb, Cb, C); quad(stone, Ab, A, C, Cb)
}
pediment(31, 15, -11.8, 11.8)
for (const s of [-1, 1]) {
  const [y0, y1] = s > 0 ? [76.8, 99.8] : [-99.8, -76.8]
  pediment(38.1, 28, y0, y1)
}

// Stairs on the east front: a flight to the main floor, between cheek
// blocks that rise with it (OSM 1301380219–21; kept inside their outlines).
function stair(x0: number, x1: number, y0: number, y1: number, top: number, cheeks: [number, number, number, number] | null) {
  const a: V3 = [x1, y0, 0], b: V3 = [x1, y1, 0], c: V3 = [x0, y1, top], d: V3 = [x0, y0, top]
  quad(stone, a, b, c, d)
  tri(stone, [x0, y0, 0], a, d); tri(stone, b, [x0, y1, 0], c)
  if (!cheeks) return
  const [cx0, w, h0, h1] = cheeks
  for (const [ya, yb] of [[y0 - w, y0], [y1, y1 + w]]) {
    const P = (x: number, y: number, z: number): V3 => [x, y, z]
    quad(stone, P(x1, ya, 0), P(x1, yb, 0), P(x1, yb, h0), P(x1, ya, h0))
    quad(trim, P(x1, ya, h0), P(x1, yb, h0), P(cx0, yb, h1), P(cx0, ya, h1))
    quad(stone, P(cx0, ya, 0), P(x1, ya, 0), P(x1, ya, h0), P(cx0, ya, h1))
    quad(stone, P(x1, yb, 0), P(cx0, yb, 0), P(cx0, yb, h1), P(x1, yb, h0))
    quad(stone, P(cx0, yb, 0), P(cx0, ya, 0), P(cx0, ya, h1), P(cx0, yb, h1))
  }
}
stair(31, 45.6, -9.4, 9.4, GROUND_TOP, [31, 1.0, 1.6, GROUND_TOP + 1.0])
for (const s of [-1, 1]) {
  const [y0, y1] = s > 0 ? [77.0, 100.0] : [-100.0, -77.0]
  stair(38.1, 57.6, y0, y1, GROUND_TOP, [47.2, 3.0, 1.8, 4.6])
}

// ---------------------------------------------------------------------------
// The dome. Lathe helpers: a profile of (r, z) points revolved about the
// dome's axis; each segment is its own band, creased from its neighbours.

const DX = -6.0, DY = 0 // dome axis (OSM rotunda tiers)
const SEG = 36
type Prof = [number, number][]
function lathe(p: Part, prof: Prof, seg = SEG, phase = 0, cx = DX, cy = DY) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const nr = z1 - z0, nz = r0 - r1, l = Math.hypot(nr, nz) || 1
    for (let i = 0; i < seg; i++) {
      const a0 = phase + (i * 2 * Math.PI) / seg, a1 = phase + ((i + 1) * 2 * Math.PI) / seg
      const c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1)
      const n0: V3 = [(c0 * nr) / l, (s0 * nr) / l, nz / l], n1: V3 = [(c1 * nr) / l, (s1 * nr) / l, nz / l]
      const P = (r: number, z: number, c: number, s: number): V3 => [cx + r * c, cy + r * s, z]
      if (r0 < 1e-6) tri(p, P(r0, z0, c0, s0), P(r1, z1, c1, s1), P(r1, z1, c0, s0), [n0, n1, n0])
      else if (r1 < 1e-6) tri(p, P(r0, z0, c0, s0), P(r0, z0, c1, s1), P(r1, z1, c0, s0), [n0, n1, n0])
      else quad(p, P(r0, z0, c0, s0), P(r0, z0, c1, s1), P(r1, z1, c1, s1), P(r1, z1, c0, s0), [n0, n1, n1, n0])
    }
  }
}

// Dome base (OSM 507459324): a chamfered square on the roof, 42 m across,
// walled to 25.8 with a balustrade to 27.
{
  const H = 21.0, C = 7.5
  const ring: XY[] = [[H, -H + C], [H, H - C], [H - C, H], [-H + C, H], [-H, H - C], [-H, -H + C], [-H + C, -H], [H - C, -H]].map(([x, y]): XY => [DX + x, DY + y])
  const steps: [number, number, number, number, Part][] = [
    [0.4, ROOF, 0.4, 25.1, stone], [0.4, 25.1, 0.05, 25.8, trim],
    [0.05, 25.8, 0.4, 25.8, trim], [0.4, 25.8, 0.4, 26.9, trim], [0.4, 26.9, 0.9, 26.9, trim],
  ]
  const chamferInset = (r: XY[], d: number): XY[] => r.map(([x, y]) => {
    const dx = x - DX, dy = y - DY, ax = Math.abs(dx), ay = Math.abs(dy)
    // Every vertex of this octagon sits on one long and one chamfer face.
    const k = d * Math.tan(Math.PI / 8)
    const sx = Math.sign(dx), sy = Math.sign(dy)
    return ax > ay ? [x - sx * d, y - sy * k] : [x - sx * k, y - sy * d]
  })
  for (const [d0, z0, d1, z1, p] of steps) {
    const A = chamferInset(ring, d0), B = chamferInset(ring, d1)
    for (let k = 0; k < 8; k++) {
      const l = (k + 1) % 8
      quad(p, [...A[k], z0], [...A[l], z0], [...B[l], z1], [...B[k], z1])
    }
  }
  flat(roof, chamferInset(ring, 0.9), 25.8 + 0.01)
}

// Peristyle: drum wall with 36 windows behind 36 columns, entablature and
// balustrade. Attic: arched windows, bracketed cornice. Then the short
// consoled band and the ribbed dome.
const R_STYLO = 19.0, R_COL = 17.9, R_DRUM = 15.8, R_ENT = 18.9, R_ATTIC = 15.4, R_BAND = 14.6, R_DOME = 13.6
const Z_STYLO = 27.0, Z_COL1 = 35.6, Z_ATTIC0 = 39.0, Z_ATTIC1 = 47.7, Z_BAND0 = 49.4, Z_DOME0 = 51.8, Z_DOME1 = 65.3
lathe(trim, [[R_STYLO, 25.8], [R_STYLO, Z_STYLO], [R_DRUM, Z_STYLO]], 24)
// The drum behind the columns reads dark in every photo: it is in their shade.
lathe(shade, [[R_DRUM, Z_STYLO], [R_DRUM, Z_COL1]], SEG, Math.PI / SEG)
lathe(trim, [
  [R_DRUM, Z_COL1], [R_ENT, Z_COL1], [R_ENT, 36.8], [19.25, 37.3], [18.5, 37.8],
  [18.5, Z_ATTIC0], [R_ATTIC, Z_ATTIC0],
])
lathe(trim, [[R_ATTIC, Z_ATTIC0], [R_ATTIC, Z_ATTIC1]], SEG, Math.PI / SEG)
lathe(trim, [
  [R_ATTIC, Z_ATTIC1], [16.5, 48.9], [R_BAND, Z_BAND0], [R_BAND, 51.4], [R_DOME, Z_DOME0],
])
for (let i = 0; i < 36; i++) {
  const a = ((i + 0.5) * 2 * Math.PI) / 36
  column(trim, [DX + R_COL * Math.cos(a), DY + R_COL * Math.sin(a)], Z_STYLO, Z_COL1, 0.62, 0.52, 6, a)
}
/** A flush panel on a drum of radius r, centred at angle a. */
function drumPanel(r: number, a: number, w: number, z0: number, z1: number, arch = false) {
  const c = Math.cos(a), s = Math.sin(a), t: V3 = [-s, c, 0], o = r + 0.05
  const P = (u: number, z: number): V3 => [DX + o * c + t[0] * u, DY + o * s + t[1] * u, z]
  if (!arch) { quad(win, P(-w / 2, z0), P(w / 2, z0), P(w / 2, z1), P(-w / 2, z1)); return }
  const rr = w / 2, sp = z1 - rr
  quad(win, P(-rr, z0), P(rr, z0), P(rr, sp), P(-rr, sp))
  for (let k = 0; k < 4; k++) {
    const a0 = (k * Math.PI) / 4, a1 = ((k + 1) * Math.PI) / 4
    tri(win, P(0, sp), P(rr * Math.cos(a0), sp + rr * Math.sin(a0)), P(rr * Math.cos(a1), sp + rr * Math.sin(a1)))
  }
}
for (let i = 0; i < 36; i++) {
  const a = (i * 2 * Math.PI) / 36
  drumPanel(R_DRUM * Math.cos(Math.PI / 36), a, 1.0, 29.0, 33.6)
  drumPanel(R_ATTIC * Math.cos(Math.PI / 36), a, 1.3, 40.8, 46.2, true)
}

// The dome shell: a raised curve, 36 ribbed panels. Each panel is flat
// across (so the ribs read as creases) and smooth up its meridian.
{
  // Row breaks chosen so the dormer ring (a quarter to two fifths of the
  // way up, in the photos) gets a row of its own.
  const T = [0, 0.13, 0.25, 0.43, 0.62, 0.81, 1]
  const rows = T.length - 1
  const prof: Prof = []
  for (let k = 0; k <= rows; k++) {
    const t = T[k]
    // Elliptical meridian (semi-axes 13.6 across, 14.6 up) cut at r 5.3.
    const zMax = 14.6 * Math.sqrt(1 - (5.3 / R_DOME) ** 2)
    const z = zMax * t
    const r = R_DOME * Math.sqrt(Math.max(0, 1 - (z / 14.6) ** 2))
    prof.push([r, Z_DOME0 + z * ((Z_DOME1 - Z_DOME0) / zMax)])
  }
  for (let k = 0; k < rows; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const prev = prof[Math.max(0, k - 1)], next = prof[Math.min(rows, k + 2)]
    const nAt = (pa: [number, number], pb: [number, number]) => { const nr = pb[1] - pa[1], nz = pa[0] - pb[0], l = Math.hypot(nr, nz); return [nr / l, nz / l] }
    const m0 = nAt(prev, prof[k + 1]), m1 = nAt(prof[k], next)
    for (let i = 0; i < SEG; i++) {
      const a0 = (i * 2 * Math.PI) / SEG, a1 = ((i + 1) * 2 * Math.PI) / SEG, am = (a0 + a1) / 2
      const cm = Math.cos(am), sm = Math.sin(am)
      const P = (r: number, z: number, a: number): V3 => [DX + r * Math.cos(a), DY + r * Math.sin(a), z]
      const N = (m: number[], a = am): V3 => unit([Math.cos(a) * m[0], Math.sin(a) * m[0], m[1]])
      // Normals splayed past the panel edges, so each rib reads as a crease.
      const e0 = am + (a0 - am) * 3, e1 = am + (a1 - am) * 3
      quad(trim, P(r0, z0, a0), P(r0, z0, a1), P(r1, z1, a1), P(r1, z1, a0), [N(m0, e0), N(m0, e1), N(m1, e1), N(m1, e0)])
      // A dormer window on the lower third of every panel.
      if (k === 2) {
        const f = 0.28, g = 0.06
        const lerp3 = (p: V3, q: V3, t: number): V3 => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t]
        const b0 = lerp3(P(r0, z0, a0), P(r0, z0, a1), f), b1 = lerp3(P(r0, z0, a0), P(r0, z0, a1), 1 - f)
        const t0 = lerp3(P(r1, z1, a0), P(r1, z1, a1), f), t1 = lerp3(P(r1, z1, a0), P(r1, z1, a1), 1 - f)
        const off = N([(m0[0] + m1[0]) / 2, (m0[1] + m1[1]) / 2]).map((v) => v * 0.06) as V3
        const lo0 = lerp3(b0, t0, g), lo1 = lerp3(b1, t1, g), hi0 = lerp3(b0, t0, 1 - g), hi1 = lerp3(b1, t1, 1 - g)
        const add = (p: V3): V3 => [p[0] + off[0], p[1] + off[1], p[2] + off[2]]
        quad(win, add(lo0), add(lo1), add(hi1), add(hi0))
      }
    }
  }
}

// Lantern: balustraded ring on the dome's crown, the tholos of 12 columns
// round a lit core, its cornice and cap, then the bronze pedestal and the
// Statue of Freedom.
lathe(trim, [[5.3, Z_DOME1 - 0.3], [5.3, 66.5], [5.0, 67.3], [4.0, 67.3], [4.0, 69.9], [4.2, 70.2], [3.1, 70.2]], 12)
lathe(win, [[2.3, 70.2], [2.3, 74.8]], 12)
for (let i = 0; i < 12; i++) {
  const a = ((i + 0.5) * 2 * Math.PI) / 12
  column(trim, [DX + 3.2 * Math.cos(a), DY + 3.2 * Math.sin(a)], 70.2, 74.8, 0.3, 0.26, 6, a)
}
lathe(trim, [[2.0, 74.8], [3.9, 74.8], [3.9, 75.6], [3.6, 76.2], [3.0, 76.6], [2.0, 77.2], [1.4, 77.4]], 12)
lathe(bronze, [[1.6, 77.3], [1.1, 78.4], [0.75, 79.0], [0.75, 80.3], [1.0, 80.6], [0.9, 81.4], [0, 81.7]], 8)
// Freedom: a robed figure on the globe, facing east, helmet crest on top.
lathe(bronze, [[0.95, 81.7], [0.62, 85.3], [0.75, 85.7], [0.38, 86.2], [0.42, 86.75], [0, 87.1]], 8)
{
  // Crest of eagle feathers: a thin upright fin, east–west.
  const z0 = 86.7, z1 = 87.6
  const P = (x: number, z: number, y: number): V3 => [DX + x, DY + y, z]
  for (const y of [-0.12, 0.12]) {
    const s = y > 0 ? 1 : -1
    const a = P(-0.45, z0, y), b = P(0.45, z0, y), c = P(0.1, z1, y), d = P(-0.3, z1 - 0.15, y)
    if (s > 0) quad(bronze, a, b, c, d); else quad(bronze, b, a, d, c)
  }
  quad(bronze, P(0.45, 86.7, -0.12), P(0.45, 86.7, 0.12), P(0.1, 87.6, 0.12), P(0.1, 87.6, -0.12))
  quad(bronze, P(-0.3, 87.45, -0.12), P(-0.3, 87.45, 0.12), P(-0.45, 86.7, 0.12), P(-0.45, 86.7, -0.12))
  quad(bronze, P(0.1, 87.6, -0.12), P(0.1, 87.6, 0.12), P(-0.3, 87.45, 0.12), P(-0.3, 87.45, -0.12))
}

// The two low domes over Statuary Hall and the Old Senate Chamber, with
// their round lanterns (OSM 507459310–313).
for (const s of [-1, 1]) {
  const cx = -6.2, cy = s * 38.5
  const prof: Prof = [[10.6, ROOF - 0.2]]
  for (let k = 1; k <= 3; k++) {
    const a = ((k / 3) * Math.PI) / 2 * 0.75
    prof.push([10.6 * Math.cos(a), ROOF - 0.2 + (2.6 * Math.sin(a)) / Math.sin((Math.PI / 2) * 0.75)])
  }
  prof.push([2.9, 23.6])
  lathe(roof, prof, 16, 0, cx, cy)
  lathe(trim, [[2.9, 23.3], [2.9, 26.4], [3.15, 26.6], [3.15, 26.9], [0, 27.0]], 8, 0, cx, cy)
  for (let i = 0; i < 4; i++) {
    const a = (i * 2 * Math.PI) / 4 + Math.PI / 8
    const c = Math.cos(a), sn = Math.sin(a), t: V3 = [-sn, c, 0], o = 2.9 * Math.cos(Math.PI / 8) + 0.04
    const P = (u: number, z: number): V3 => [cx + o * c + t[0] * u, cy + o * sn + t[1] * u, z]
    quad(win, P(-0.45, 24.4), P(0.45, 24.4), P(0.45, 25.9), P(-0.45, 25.9))
  }
}

// ---------------------------------------------------------------------------
// Colours: the painted sandstone and marble read warm white in daylight
// (palette stone); columns, cornices and the painted cast-iron dome are the
// brighter trim; roofs are pale grey-green in the aerials; the Statue of
// Freedom is dark bronze, pulled to the palette's charcoal floor.
const parts = [
  { part: stone, material: PALETTE.stone },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: finish('capitol-roof', 0xb0c3bc) },
  { part: win, material: PALETTE.window },
  { part: bronze, material: finish('bronze', 0x585e5a) },
  // The colonnades' back walls, in the shadow that makes them read in every photo.
  { part: shade, material: finish('portico-shade', 0xc2b8a8) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('United States Capitol', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 0.2, osm: 'way/66418809', footprint: [108, 228], height: 87.6,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/dc-us-capitol.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
for (const { part, material } of parts) console.log(`  ${material.name}: ${part.triangles}`)
