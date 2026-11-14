/**
 * St Paul's Cathedral, City of London — original procedural geometry, CC0-1.0.
 * bun generators/london-st-pauls-cathedral.ts
 *
 * Writes two levels of detail in one frame:
 *   models/london-st-pauls-cathedral.glb (low, ≤ 6,500 tris / 250 KB): every
 *     column of the peristyle, porticoes, porches, tower colonnades and
 *     lantern as a real round shaft with real gaps; solid balustrades;
 *     windows as panels; no pilasters.
 *   models/london-st-pauls-cathedral.detail.glb (detailZoom 16): the same
 *     forms with rounder shafts, column bases and capitals, paired pilasters
 *     on every bay, keystones and sills, framed upper windows with raking
 *     pediments, open balustrades (real balusters) on the main cornice and
 *     the Stone Gallery, the Golden Gallery railing, the drum's windows and
 *     niches behind the peristyle, attic pilasters, a 14-row dome.
 *
 * Frame: plan turned to the nave: +x runs east along the nave axis
 * (bearing 84), +y north (bearing 354), z up, metres. BEARING 354. Origin =
 * area centroid of the OSM outline way/369161987 (-0.0984789, 51.5137735).
 * The plan is mirrored about the nave axis (the real one is symmetric to
 * within ~0.5 m in OSM). elevation 0.
 *
 * Evidence
 * - OSM (measured, read in this frame): outline way/369161987 (height 35,
 *   Grade I, wikidata Q173882) and its 110 building:parts, among them:
 *   peristyle columns 664529xxx/664533xxx (41–52 m, 1.28 m wide, 32 on a
 *   19.6 m radius at 11.25°, with 3.3 m solid screens on the diagonals
 *   22.5° + 45°k); drum base 61381786 (31–41, Ø41); gallery ring 398708092
 *   (52–56); drum/attic core 398708095 (41–66, Ø33.4); dome 664613340
 *   (66–85, Ø32); Golden Gallery 664613341 (83–86); lantern 398708100
 *   (86–95); cupola 664613339 (95–102); finial, ball and cross 398708094,
 *   664613338, 664534351 (to 111); west towers 629776388/664630391 (to 41),
 *   664624463/664630395 (41–52 colonnade, Ø~10.7), 664624466/664630388
 *   (52–61), 664626053/664630389 (58–65), 664625229/664630387 (to 68);
 *   west portico 664642006 (pediment 30–36), 664646815 (15–19), columns
 *   6646591xx; transept porches 399171088/399171089 (15–23 half-domes,
 *   semicircular, Ø~15) with columns 664648xxx/664651xxx (0–15);
 *   nave/choir roof 664642004 (31–35 gabled, ±7.8 m), transept roof
 *   398708101; aisle courts 664669344–52 (22 m) inside the outer walls
 *   relation/9235275 (31 m).
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (via the batch's ealidar.py; composite of flights ~2010s–2022),
 *   heights above the street (~5.7 m above the box's ground_min):
 *   outer walls 30.6–32, aisle courts 21.6–22.3, nave ridge 34.6, transept
 *   pediments ~34, Stone Gallery 55.7 (r 17–21), attic top ~65.8 (r 16),
 *   dome profile r 15→67.7, 14→72.8, 12→77.4, 10→79.7, 8→81.5, 6→82,
 *   lantern to ~102 (the cross is too thin to show), west towers ~60
 *   at r 1 (pineapples missed); plan footprint matches OSM to ~1 m.
 * - Published: 111 m to the top of the cross (Wikipedia "St Paul's
 *   Cathedral"); length ~158 m (OSM outline 156 m); Historic England list
 *   entry 1079157; west towers 221 ft (67.4 m); dome external diameter
 *   ~34 m (taken here as the attic cornice; the lead dome itself is drawn
 *   r 15.6 from the photos, OSM Ø32).
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "St Pauls Cathedral from West - Feb 2007.jpg", Diliff, CC BY 2.5 —
 *     west front: portico column pairs (lower ±3.2, ±9.15, ±14.85; upper
 *     ±3.2, ±8.9), tower stage proportions, clock and oculus, night look;
 *   "St Paul's Cathedral West Front City of London England 01.jpg",
 *     Acabashi, CC BY-SA 4.0;
 *   "St Paul's Cathedral from Millenium Bridge 2020.jpg", Julian Herzog,
 *     CC BY 4.0 — the dome stack from the south: drum, peristyle, gallery,
 *     attic windows, dome width and rise, lantern; the south porch;
 *   "St Paul's Cathedral from Tate Modern 2018-01-31.jpg", Colin, CC BY-SA 4.0;
 *   "St Paul's Cathedral Dome from One New Change - Square Crop.jpg",
 *     Colin, CC BY-SA 4.0 — the ribs, attic, lantern, ball and cross;
 *   "Aerial view of St Paul's Cathedral.jpg", Sean MacEntee, CC BY 2.0;
 *   "St Pauls aerial.jpg", Mark Fosh, CC BY 2.0 — the south side from
 *     the air: bays, windows, roofs, transept front and porch;
 *   "Aerial St.Paul's Cathedral.jpg", Rafa Esteve, CC BY-SA 3.0;
 *   "Aerial View of St Paul Cathedral.jpg", Rafesmar, CC BY-SA 3.0;
 *   "South west tower of St Paul's Cathedral.jpg", Julie Anne Workman,
 *     CC BY-SA 3.0 — the tower's colonnade, open upper stage, urns, bell
 *     cap and pineapple;
 *   "St Paul's East End2.jpg", David Underdown, CC BY-SA 4.0 — the apse
 *     and north transept from the north-east.
 *   No look-only sources were used.
 *
 * Estimated from the photos between the measured datums: storey heights
 * (lower order to 15.2, entablature to 17.4, upper order to 28.4, cornice
 * to 30, balustrade to 31); bay rhythm (~9.4 m) and window sizes; the
 * peristyle entablature 51.8–53.4; attic 53.4–64.4 and its cornice to 66;
 * dome rise 18 m over r 15.6 (photo ratio 0.6, checked against the lidar
 * profile); the lantern's column pairs and oculi; tower stages (clock stage
 * 31–41.4 and 12.8 m square, colonnade 41.4–51.6 nearly as wide (12.6 m)
 * with eight pairs of columns round a dark core, arched upper stage to 56.8
 * round a dark core, concave-sided lead cupola to 61.4 with a small open
 * lantern, gilt pineapple to ~67); porch radius and six columns;
 * apse radius 9.2. Invented/simplified: the crossing roof is flat lead
 * (lidar 32–33 m); the west steps (outside the outline) are not drawn;
 * statues, the tympanum reliefs (a flat panel in detail), the Queen Anne
 * statue and the corner scrolls of the towers are omitted.
 *
 * Doubts: three clock dials on the south-west tower (west, south, east) and
 * matching oculi on the north-west tower are inferred from two photos; the
 * west chapels' roofs are drawn flat at 30 m (OSM 31–32 gabled); the
 * upper-storey windows are blind niches in reality, drawn in a dark
 * `niche` finish that does not glow.
 *
 * Lead review (pass 4): towers widened and made bolder (colonnade stage and
 * upper stage widened, eight column pairs open onto a dark core, concave
 * cupola with its little lantern); the drum wall behind the peristyle set
 * back to r 15.6 in the dark `niche` finish so the columns read white
 * against shadow, as are the portico recesses; the low dome has 24 ribs
 * (the detail model keeps the real 32) to pay for it.
 *
 * Night: the stone is floodlit (`_FLOODLIGHT` on stone, and on trim in the
 * detail model; the low model's file budget leaves trim unlit), the dome's
 * lead half-lit; windows glow.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const BEARING = 354
const ANCHOR = { lng: -0.0984789, lat: 51.5137735 }
const DC: XY = [11.75, 0.2] // dome centre, plan frame

// ---------------------------------------------------------------------------
// Small geometry kit. Every face is emitted with an explicit normal, so
// Part.tri winds it to face that way: nothing here depends on vertex order.

const norm = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const sb = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const UP: V3 = [0, 0, 1], DN: V3 = [0, 0, -1]

/** A flat convex polygon facing n. */
function poly(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n])
}
/** A flat quad facing away from `inside`. */
function quadOut(p: Part, a: V3, b: V3, c: V3, d: V3, inside: V3) {
  let n = norm(crs(sb(b, a), sb(c, a)))
  const m: V3 = [(a[0] + c[0]) / 2 - inside[0], (a[1] + c[1]) / 2 - inside[1], (a[2] + c[2]) / 2 - inside[2]]
  if (n[0] * m[0] + n[1] * m[1] + n[2] * m[2] < 0) n = [-n[0], -n[1], -n[2]]
  poly(p, [a, b, c, d], n)
}

/** Ear-clipping triangulation of a simple counter-clockwise ring. */
function triangulate(ring: XY[]): [number, number, number][] {
  const idx = ring.map((_, i) => i), out: [number, number, number][] = []
  const area2 = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (q: XY, a: XY, b: XY, c: XY) => area2(a, b, q) > 1e-9 && area2(b, c, q) > 1e-9 && area2(c, a, q) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 100000) {
    let clipped = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = ring[i0], b = ring[i1], c = ring[i2], ar = area2(a, b, c)
      if (ar <= 1e-9) { if (Math.abs(ar) <= 1e-9) { idx.splice(k, 1); clipped = true; break } continue }
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(ring[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); clipped = true; break
    }
    if (!clipped) throw new Error('triangulation failed')
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
function cap(p: Part, ring: XY[], z: number, up: boolean) {
  for (const [a, b, c] of triangulate(ring)) poly(p, [[...ring[a], z], [...ring[b], z], [...ring[c], z]], up ? UP : DN)
}
/** Outward normal of the edge a→b of a counter-clockwise ring. */
const outN = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l] }
/** Mitred offset of a counter-clockwise ring, outward by d (negative insets). */
function offset(ring: XY[], d: number): XY[] {
  const n = ring.length
  return ring.map((q, i) => {
    const a = ring[(i + n - 1) % n], c = ring[(i + 1) % n]
    const n0 = outN(a, q), n1 = outN(q, c), k = 1 + n0[0] * n1[0] + n0[1] * n1[1]
    return [q[0] + (d * (n0[0] + n1[0])) / k, q[1] + (d * (n0[1] + n1[1])) / k]
  })
}
/** Vertical flat walls of a CCW ring between z0 and z1 (outward), or facing in. */
function walls(p: Part, ring: XY[], z0: number, z1: number, inward = false) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], o = outN(a, b), s = inward ? -1 : 1
    poly(p, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], [s * o[0], s * o[1], 0])
  }
}
/** Sloped/stepped band between two offset rings (a moulding), facing out. */
function band(p: Part, r0: XY[], z0: number, r1: XY[], z1: number) {
  for (let i = 0; i < r0.length; i++) {
    const j = (i + 1) % r0.length
    const a: V3 = [...r0[i], z0], b: V3 = [...r0[j], z0], c: V3 = [...r1[j], z1], d: V3 = [...r1[i], z1]
    const o = outN(r0[i], r0[j])
    const n = norm(crs(sb(b, a), sb(d, a)))
    // pick the side facing out of the ring (or up/down for flat annuli)
    const flat = Math.abs(z1 - z0) < 1e-6
    const want: V3 = flat ? (n[2] >= 0 ? n : [-n[0], -n[1], -n[2]]) : (n[0] * o[0] + n[1] * o[1] >= 0 ? n : [-n[0], -n[1], -n[2]])
    poly(p, [a, b, c, d], want)
  }
}
/** Flat annulus between two rings at z, facing up or down. */
function annulus(p: Part, outer: XY[], inner: XY[], z: number, up: boolean) {
  for (let i = 0; i < outer.length; i++) {
    const j = (i + 1) % outer.length
    poly(p, [[...outer[i], z], [...outer[j], z], [...inner[j], z], [...inner[i], z]], up ? UP : DN)
  }
}
const b0Of = (ring: XY[]) => offset(ring, -0.25)
function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false, topPart?: Part) {
  walls(p, ring, z0, z1)
  if (top) cap(topPart ?? p, ring, z1, true)
  if (bottom) cap(p, ring, z0, false)
}
const rect = (x0: number, x1: number, y0: number, y1: number, c = 0): XY[] =>
  c > 0
    ? [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
    : [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, c = 0, bottom = false, topPart?: Part) {
  prism(p, rect(x0, x1, y0, y1, c), z0, z1, true, bottom, topPart)
}
const circle = (cx: number, cy: number, r: number, seg: number, ph = 0): XY[] =>
  Array.from({ length: seg }, (_, i) => { const a = ph + (2 * Math.PI * i) / seg; return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as XY })

/**
 * A surface of revolution through (r, z) profile points, smooth-shaded.
 * `a0..a1` limits it to an arc (for the half-domes of the porches).
 */
function lathe(p: Part, cx: number, cy: number, prof: [number, number][], seg: number, ph = 0, a0 = 0, a1 = 2 * Math.PI, smooth = false) {
  const full = Math.abs(a1 - a0 - 2 * Math.PI) < 1e-9
  // A sharp profile: each segment is its own band, shaded by its own slope.
  if (!smooth && prof.length > 2) {
    for (let k = 0; k < prof.length - 1; k++) lathe(p, cx, cy, [prof[k], prof[k + 1]], seg, ph, a0, a1, true)
    return
  }
  // profile normals (outward in r, z): the tangent turned clockwise, so a
  // profile runs up the outside and inward over the top
  const pn = prof.map((_, k) => {
    const a = prof[Math.max(0, k - 1)], b = prof[Math.min(prof.length - 1, k + 1)]
    const dr = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dr, dz) || 1
    return [dz / l, -dr / l] as XY
  })
  const angs = Array.from({ length: seg + 1 }, (_, i) => a0 + ph + ((a1 - a0) * i) / seg)
  for (let i = 0; i < seg; i++) {
    if (full && i === seg) break
    const t0 = angs[i], t1 = angs[i + 1]
    for (let k = 0; k < prof.length - 1; k++) {
      const P = (t: number, q: number): V3 => [cx + prof[q][0] * Math.cos(t), cy + prof[q][0] * Math.sin(t), prof[q][1]]
      const N = (t: number, q: number): V3 => norm([pn[q][0] * Math.cos(t), pn[q][0] * Math.sin(t), pn[q][1]])
      const A = P(t0, k), B = P(t1, k), C = P(t1, k + 1), D = P(t0, k + 1)
      if (prof[k][0] > 1e-6) p.tri(A, B, C, undefined, undefined, undefined, [N(t0, k), N(t1, k), N(t1, k + 1)])
      if (prof[k + 1][0] > 1e-6) p.tri(A, C, D, undefined, undefined, undefined, [N(t0, k), N(t1, k + 1), N(t0, k + 1)])
    }
  }
}
/** A smooth round column shaft (no caps unless asked). */
function cyl(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, seg: number, top = false, ph = 0) {
  lathe(p, cx, cy, [[r, z0], [r, z1]], seg, ph)
  if (top) cap(p, circle(cx, cy, r, seg, ph), z1, true)
}
/** An ellipsoid (ball, pineapple), smooth. */
function ellipsoid(p: Part, cx: number, cy: number, cz: number, rx: number, rz: number, seg: number, rows: number) {
  const prof: [number, number][] = []
  for (let k = 0; k <= rows; k++) { const t = -Math.PI / 2 + (Math.PI * k) / rows; prof.push([rx * Math.cos(t), cz + rz * Math.sin(t)]) }
  prof[0][0] = 0; prof[rows][0] = 0
  lathe(p, cx, cy, prof, seg, 0, 0, 2 * Math.PI, true)
}

// Walls in a local face frame: e = edge a→b of the plan (CCW), s along it,
// z up, d outward from the face.
type Edge = { a: XY; b: XY; u: XY; n: XY; len: number }
const edgeOf = (a: XY, b: XY): Edge => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  return { a, b, u: [(b[0] - a[0]) / len, (b[1] - a[1]) / len], n: outN(a, b), len }
}
const at = (e: Edge, s: number, z: number, d: number): V3 => [e.a[0] + e.u[0] * s + e.n[0] * d, e.a[1] + e.u[1] * s + e.n[1] * d, z]
/** A flat panel in the face (convex polygon in s, z), set out by d. */
function panel(p: Part, e: Edge, pts: XY[], d = 0.05) { poly(p, pts.map(([s, z]) => at(e, s, z, d)), [e.n[0], e.n[1], 0]) }
/** A relief block on a face: s0..s1, z0..z1, standing d0..d1 out from it. */
function relief(p: Part, e: Edge, s0: number, s1: number, z0: number, z1: number, d1: number, d0 = 0, top = true, bottom = false) {
  const nn: V3 = [e.n[0], e.n[1], 0], uu: V3 = [e.u[0], e.u[1], 0]
  poly(p, [at(e, s0, z0, d1), at(e, s1, z0, d1), at(e, s1, z1, d1), at(e, s0, z1, d1)], nn)
  poly(p, [at(e, s0, z0, d0), at(e, s0, z0, d1), at(e, s0, z1, d1), at(e, s0, z1, d0)], [-uu[0], -uu[1], 0])
  poly(p, [at(e, s1, z0, d1), at(e, s1, z0, d0), at(e, s1, z1, d0), at(e, s1, z1, d1)], uu)
  if (top) poly(p, [at(e, s0, z1, d0), at(e, s0, z1, d1), at(e, s1, z1, d1), at(e, s1, z1, d0)], UP)
  if (bottom) poly(p, [at(e, s0, z0, d0), at(e, s1, z0, d0), at(e, s1, z0, d1), at(e, s0, z0, d1)], DN)
}
/** A small pediment: a triangular relief over s0..s1 from z0 rising h. */
function pediment(p: Part, roof: Part, e: Edge, s0: number, s1: number, z0: number, h: number, d1: number, d0 = 0, back = false) {
  const sm = (s0 + s1) / 2, nn: V3 = [e.n[0], e.n[1], 0]
  poly(p, [at(e, s0, z0, d1), at(e, s1, z0, d1), at(e, sm, z0 + h, d1)], nn)
  const half = (s1 - s0) / 2, l = Math.hypot(half, h)
  const nl: V3 = norm([e.n[0] * 0 - e.u[0] * h / l, -e.u[1] * h / l, half / l])
  const nr: V3 = norm([e.u[0] * h / l, e.u[1] * h / l, half / l])
  poly(roof, [at(e, s0, z0, d0), at(e, s0, z0, d1), at(e, sm, z0 + h, d1), at(e, sm, z0 + h, d0)], nl)
  poly(roof, [at(e, sm, z0 + h, d0), at(e, sm, z0 + h, d1), at(e, s1, z0, d1), at(e, s1, z0, d0)], nr)
  if (back) poly(p, [at(e, s0, z0, d0), at(e, s1, z0, d0), at(e, sm, z0 + h, d0)], [-nn[0], -nn[1], 0])
}
/** Round-headed window outline in (s, z): sill z0, springing zs, width w. */
function archPts(sc: number, w: number, z0: number, zs: number, seg: number): XY[] {
  const r = w / 2, pts: XY[] = [[sc - r, z0], [sc + r, z0]]
  for (let k = 0; k <= seg; k++) { const t = (Math.PI * k) / seg; pts.push([sc + r * Math.cos(t), zs + r * Math.sin(t)]) }
  return pts
}

// ---------------------------------------------------------------------------
// Plan: the outer wall line (OSM way/369161987 read in the turned frame,
// squared up and mirrored about the nave axis y = 0; the real plan is
// symmetric to within ~0.5 m). x runs west→east along the nave.

const APSE: XY = [72.4, 0], APSE_R = 9.2
function plan(D: boolean): XY[] {
  const north: XY[] = []
  const aEnd = Math.acos((74.6 - APSE[0]) / APSE_R)
  const n = 3
  for (let k = 0; k <= n; k++) { const t = (aEnd * k) / n; north.push([APSE[0] + APSE_R * Math.cos(t), APSE[1] + APSE_R * Math.sin(t)]) }
  north.push(
    [74.6, 18.8], [36.9, 18.8], [36.9, 24.8], [30.2, 24.8], [30.2, 36.8],
    // the transept front's centre stands 0.8 m proud (the low model keeps it flush)
    ...(D ? ([[20.7, 36.8], [20.7, 37.6], [2.8, 37.6], [2.8, 36.8]] as XY[]) : []),
    [-7.0, 36.8], [-7.0, 24.8], [-13.8, 24.8], [-13.8, 18.8], [-42.0, 18.8],
    [-42.0, 27.2], [-58.9, 27.2], [-72.9, 27.2], [-72.9, 13.4], [-66.0, 13.4],
  )
  const south = [...north].reverse().map(([x, y]): XY => [x, -y])
  // north runs from the east axis point round to the west; the south half
  // continues from the west back to the east. Drop the duplicated axis point.
  return [...north, ...south.slice(0, south.length - 1)]
}

// ---------------------------------------------------------------------------
// Heights (lidar above the street ~5.7 m over the box's ground_min; OSM parts;
// photo proportions between them).

const PLINTH = 1.2
const L_TOP = 15.2, L_ENT = 17.4 // lower order, its entablature
const U_TOP = 28.4, CORN = 30.0, BAL = 31.0 // upper order, cornice, balustrade top
const COURT = 22.0 // aisle roofs behind the screen walls (OSM 22, lidar 21.6–22.3)
const SCREEN = 1.4 // screen wall thickness
const V_EAVE = 31.6, V_RIDGE = 35.0 // nave/choir/transept vessel roof (lidar ridge 34.6)

function build(D: boolean) {
  const stone = new Part(), trim = new Part(), lead = new Part(), win = new Part(), gilt = new Part(), niche = new Part()
  const COLSEG = D ? 12 : 6
  let last = 0
  const mark = (label: string) => { const t = [stone, trim, lead, win, gilt, niche].reduce((n, q) => n + q.triangles, 0); if (process.env.DEBUG) console.log(label.padEnd(12), t - last); last = t }
  const RING = D ? 64 : 32

  // --- the outer body: solid to the court roofs, then screen walls --------
  const P = plan(D)
  const TF = D ? 37.6 : 36.8 // the transept front's centre
  walls(stone, P, 0, U_TOP)
  const inner = offset(P, -SCREEN)
  cap(lead, inner, COURT, true)
  walls(stone, inner, COURT, D ? CORN : BAL, true)
  if (D) {
    // plinth (a shallow step out) and its top
    const pl = offset(P, 0.3)
    walls(trim, pl, 0, PLINTH)
    annulus(trim, pl, P, PLINTH, true)
  }
  // lower entablature: bevelled underside, flat top
  const e1 = offset(P, 0.35)
  band(trim, P, L_TOP, e1, L_TOP + 0.5)
  walls(trim, e1, L_TOP + 0.5, L_ENT)
  annulus(trim, e1, P, L_ENT, true)
  // main cornice: bevel out, then a top that runs back over the screen wall
  const c1 = offset(P, 0.55)
  band(trim, P, U_TOP, c1, U_TOP + 0.9)
  walls(trim, c1, U_TOP + 0.9, CORN)
  annulus(trim, c1, D ? inner : b0Of(P), CORN, true)
  // balustrade, set back on the cornice
  const b0 = offset(P, -0.25), b1 = offset(P, -1.05)
  if (D) {
    // real balusters between a plinth and a coping rail
    walls(trim, b0, CORN, CORN + 0.25); walls(trim, b1, CORN, CORN + 0.25, true)
    walls(trim, b0, BAL - 0.22, BAL); walls(trim, b1, BAL - 0.22, BAL, true)
    annulus(trim, b0, b1, BAL, true); annulus(trim, b0, b1, BAL - 0.22, false); annulus(trim, b0, b1, CORN + 0.25, true)
    const mid = offset(P, -0.65)
    for (let i = 0; i < mid.length; i++) {
      const a = mid[i], b = mid[(i + 1) % mid.length], l = Math.hypot(b[0] - a[0], b[1] - a[1])
      const n = Math.floor(l / 0.55)
      for (let k = 1; k < n; k++) { const t = k / n; cyl(trim, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 0.13, CORN + 0.25, BAL - 0.22, 5) }
    }
  } else {
    // low model: the balustrade is the screen wall's top, set back on the cornice
    walls(trim, b0, CORN, BAL); annulus(trim, b0, inner, BAL, true)
  }

  mark('body')
  // --- facades: bays of paired pilasters, round-headed lower windows,
  //     pedimented upper windows (aedicules) ---------------------------------
  const BAY = 9.4
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length], e = edgeOf(a, b)
    if (e.len < 2.5) continue
    // the portico recess and the transept porch faces are dressed elsewhere
    if (Math.abs(a[0] + 66) < 0.01 && Math.abs(b[0] + 66) < 0.01) continue
    if (Math.abs(Math.abs(a[1]) - 13.4) < 0.01 && Math.abs(Math.abs(b[1]) - 13.4) < 0.01) continue
    const isTransFront = Math.abs(Math.abs(a[1]) - 37.6) < 0.01 && Math.abs(Math.abs(b[1]) - 37.6) < 0.01
    const isApse = Math.hypot(a[0] - APSE[0], a[1] - APSE[1]) < APSE_R + 0.01 && Math.hypot(b[0] - APSE[0], b[1] - APSE[1]) < APSE_R + 0.01 && a[0] > 74
    if (isTransFront) continue
    const nb = e.len < (isApse ? 3.5 : 5.2) ? 0 : Math.max(1, Math.round(e.len / BAY))
    const w = nb ? e.len / nb : e.len
    // pilasters at every bay boundary (paired in the detail model)
    const pw = D ? 0.75 : 1.2, pd = 0.32
    const bounds = nb ? Array.from({ length: nb + 1 }, (_, k) => k * w) : [0, e.len]
    for (const s of bounds) {
      const offs = D ? [-0.55, 0.55] : [0]
      for (const o of offs) {
        let s0 = s + o - pw / 2, s1 = s + o + pw / 2
        if (s0 < 0.05) { s0 = 0.05; s1 = s0 + pw } // keep inside the corner
        if (s1 > e.len - 0.05) { s1 = e.len - 0.05; s0 = s1 - pw }
        if (D) {
          relief(stone, e, s0, s1, PLINTH, L_TOP, pd, 0, false)
          relief(stone, e, s0, s1, L_ENT, U_TOP, pd, 0, false)
        }

      }
    }
    // the low model's flush transept front: bays only either side of the porch
    const wide = !D && Math.abs(Math.abs(a[1]) - 36.8) < 0.01 && e.len > 30
    const centers = wide ? [4.75, e.len - 4.9] : Array.from({ length: nb }, (_, k) => (k + 0.5) * w)
    for (const sc of centers) {
      const ww = Math.min(2.6, w - 2.6)
      if (ww < 1.2) continue
      panel(win, e, archPts(sc, ww, 4.2, 11.0, D ? 10 : 4))
      if (D) {
        // keystone and the arch's sill
        relief(trim, e, sc - 0.35, sc + 0.35, 11.0 + ww / 2 - 0.2, 11.0 + ww / 2 + 0.7, 0.25)
        relief(trim, e, sc - ww / 2 - 0.3, sc + ww / 2 + 0.3, 3.8, 4.2, 0.25)
      }
      // upper window with its frame and pediment
      const uw = Math.min(2.3, w - 3)
      if (D) relief(trim, e, sc - uw / 2 - 0.45, sc + uw / 2 + 0.45, 19.2, 26.0, 0.18, 0, true, true)
      panel(niche, e, [[sc - uw / 2, 19.7], [sc + uw / 2, 19.7], [sc + uw / 2, 25.6], [sc - uw / 2, 25.6]], D ? 0.22 : 0.05)
      if (D) pediment(trim, trim, e, sc - uw / 2 - 0.8, sc + uw / 2 + 0.8, 26.0, 1.3, 0.38)
      else poly(trim, [at(e, sc - uw / 2 - 0.8, 26.0, 0.06), at(e, sc + uw / 2 + 0.8, 26.0, 0.06), at(e, sc, 27.4, 0.06)], [e.n[0], e.n[1], 0])
    }
  }

  mark('facades')
  // --- central vessels: nave, choir and transepts, with lead roofs --------
  function vessel(x0: number, x1: number, y0: number, y1: number, alongX: boolean) {
    box(stone, x0, x1, y0, y1, COURT, V_EAVE, 0, false, lead)
    const mid = alongX ? (y0 + y1) / 2 : (x0 + x1) / 2
    if (alongX) {
      const A: V3 = [x0, y0, V_EAVE], B: V3 = [x1, y0, V_EAVE], C: V3 = [x1, mid, V_RIDGE], Dd: V3 = [x0, mid, V_RIDGE]
      quadOut(lead, A, B, C, Dd, [0, mid, 0]); quadOut(lead, [x0, y1, V_EAVE], [x1, y1, V_EAVE], C, Dd, [0, mid, 0])
      poly(stone, [[x0, y0, V_EAVE], [x0, mid, V_RIDGE], [x0, y1, V_EAVE]], [-1, 0, 0])
      poly(stone, [[x1, y0, V_EAVE], [x1, y1, V_EAVE], [x1, mid, V_RIDGE]], [1, 0, 0])
    } else {
      const C: V3 = [mid, y1, V_RIDGE], Dd: V3 = [mid, y0, V_RIDGE]
      quadOut(lead, [x0, y0, V_EAVE], [x0, y1, V_EAVE], C, Dd, [mid, 0, 0]); quadOut(lead, [x1, y0, V_EAVE], [x1, y1, V_EAVE], C, Dd, [mid, 0, 0])
      poly(stone, [[x0, y0, V_EAVE], [x1, y0, V_EAVE], [mid, y0, V_RIDGE]], [0, -1, 0])
      poly(stone, [[x0, y1, V_EAVE], [x1, y1, V_EAVE], [mid, y1, V_RIDGE]], [0, 1, 0])
    }
  }
  vessel(-66.0, -12.2, -7.8, 7.8, true)
  vessel(35.2, 74.0, -7.8, 7.8, true)
  vessel(3.4, 20.1, 23.5, 36.4, false)
  vessel(3.4, 20.1, -36.4, -23.5, false)
  // apse: a half-dome of lead against the choir's east gable
  lathe(lead, APSE[0] + 1.6, 0, [[7.4, V_EAVE - 2.0], [6.6, V_EAVE + 0.4], [4.6, V_EAVE + 2.2], [0, V_EAVE + 3.0]], D ? 16 : 8, 0, -Math.PI / 2, Math.PI / 2, true)
  box(stone, 64, APSE[0] + 1.6, -7.4, 7.4, COURT, V_EAVE - 2.0, 0, false, lead)
  // west chapels and tower cores fill the court behind the west front
  box(stone, -66.0, -42.6, 7.8, 25.8, COURT, CORN, 0, false, lead)
  box(stone, -66.0, -42.6, -25.8, -7.8, COURT, CORN, 0, false, lead)

  mark('vessels')
  // --- crossing: the block under the drum, flat lead (lidar 32–33 m) -------
  {
    const X0 = -12.2, X1 = 35.2, Y = 23.5
    box(stone, X0, X1, -Y, Y, COURT, BAL, 0, false, lead)
  }

  mark('crossing')
  // --- the dome --------------------------------------------------------------
  const [cx, cy] = DC
  // drum base (31–41): plain Portland stone ring, with a cornice step
  // the drum wall behind the peristyle stands well back (r 15.6, 4 m behind
  // the column line) in shadow, so the columns read white against it
  const DW = 15.6
  cyl(stone, cx, cy, 20.45, BAL, D ? 40.6 : 41.4, RING)
  if (D) {
    lathe(trim, cx, cy, [[20.45, 40.6], [20.95, 41.0], [20.95, 41.4]], RING)
    annulus(trim, circle(cx, cy, 20.95, RING), circle(cx, cy, 19.9, RING), 41.4, true)
    annulus(stone, circle(cx, cy, 19.9, RING), circle(cx, cy, DW, RING), 41.4, true)
  } else annulus(stone, circle(cx, cy, 20.45, RING), circle(cx, cy, DW, RING), 41.4, true)
  // the peristyle: 32 columns with real gaps; every fourth gap closed by a
  // buttress screen (OSM: columns at 11.25° spacing, screens on the
  // diagonals 22.5° + 45° k).
  const PC0 = 41.4, PC1 = 51.8, PR = 19.6, PCR = D ? 0.64 : 0.66
  for (let k = 0; k < 32; k++) {
    const a = ((5.625 + 11.25 * k) * Math.PI) / 180
    const x = cx + PR * Math.cos(a), y = cy + PR * Math.sin(a)
    cyl(stone, x, y, PCR, PC0 + (D ? 0.7 : 0), PC1 - (D ? 1.1 : 0), COLSEG, false, a)
    if (D) {
      const e = edgeOf([x - Math.sin(a), y + Math.cos(a)], [x + Math.sin(a), y - Math.cos(a)])
      // base and capital as blocks
      prism(trim, circle(x, y, 1.0, 4, a + Math.PI / 4), PC0, PC0 + 0.7)
      lathe(trim, x, y, [[PCR, PC1 - 1.1], [0.95, PC1 - 0.25], [1.0, PC1 - 0.25], [1.0, PC1], [0, PC1]], 8, a)
      void e
    }
  }
  for (let k = 0; k < 8; k++) {
    const a = ((22.5 + 45 * k) * Math.PI) / 180, ca = Math.cos(a), sa = Math.sin(a)
    // a solid screen between two columns: a block from the drum wall out
    const r0 = DW, r1 = 19.3, hw = 1.35
    const pt = (r: number, t: number): XY => [cx + r * ca - t * sa, cy + r * sa + t * ca]
    const ring: XY[] = [pt(r0, -hw), pt(r1, -hw), pt(r1, hw), pt(r0, hw)]
    walls(stone, ring, PC0, PC1)
    if (D) {
      // its niche: a dark round-headed recess on the outer face
      const e = edgeOf(pt(r1, -hw), pt(r1, hw))
      panel(niche, e, archPts(hw, 1.5, 44.0, 48.6, 8), 0.04)
    }
  }
  // drum wall behind the columns, then the attic (to 64.6)
  const ATT0 = 53.4, ATT1 = 64.4
  {
    const ring = circle(cx, cy, 16.8, 32, Math.PI / 32), ringP = circle(cx, cy, DW, 32, Math.PI / 32)
    walls(niche, ringP, PC0, PC1)
    walls(stone, ring, PC1, ATT1)
    // windows behind the peristyle: dark tall panels, one per intercolumniation
    // between the screens; attic windows above the gallery, one per bay
    for (let i = 0; i < 32; i++) {
      const e = edgeOf(ring[i], ring[(i + 1) % 32])
      const mid = Math.atan2((ring[i][1] + ring[(i + 1) % 32][1]) / 2 - cy, (ring[i][0] + ring[(i + 1) % 32][0]) / 2 - cx) * 180 / Math.PI
      const m = (((mid - 22.5) % 45) + 45) % 45
      const eP = edgeOf(ringP[i], ringP[(i + 1) % 32])
      if (D && m > 6 && m < 39) panel(win, eP, [[0.7, 43.5], [eP.len - 0.7, 43.5], [eP.len - 0.7, 49.8], [0.7, 49.8]], 0.04)
      panel(win, e, [[0.9, 57.4], [e.len - 0.9, 57.4], [e.len - 0.9, 59.2], [0.9, 59.2]], 0.04)
      if (D) {
        relief(stone, e, -0.05, 0.45, ATT0 + 0.3, ATT1 - 0.6, 0.18, 0, false)
        relief(stone, e, e.len - 0.45, e.len + 0.05, ATT0 + 0.3, ATT1 - 0.6, 0.18, 0, false)
      }
    }
  }
  mark('drum')
  // peristyle entablature, the Stone Gallery floor
  lathe(trim, cx, cy, [[DW, PC1], [20.6, PC1 + 0.4]], RING)
  const GAL = 55.6
  cyl(trim, cx, cy, 20.6, PC1 + 0.4, D ? ATT0 : GAL, RING)
  annulus(trim, circle(cx, cy, D ? 20.6 : 19.75, RING), circle(cx, cy, 16.8, RING), ATT0, true)
  // Stone Gallery balustrade (lidar top 55.6)
  if (D) {
    lathe(trim, cx, cy, [[20.3, ATT0], [20.3, ATT0 + 0.3], [19.8, ATT0 + 0.3]], RING)
    lathe(trim, cx, cy, [[19.8, GAL - 0.3], [20.35, GAL - 0.3], [20.35, GAL], [19.75, GAL], [19.75, GAL - 0.3]], RING)
    for (let k = 0; k < 160; k++) {
      const a = (2 * Math.PI * k) / 160
      cyl(trim, cx + 20.05 * Math.cos(a), cy + 20.05 * Math.sin(a), 0.14, ATT0 + 0.3, GAL - 0.3, 5)
    }
  } else {
    annulus(trim, circle(cx, cy, 20.6, RING), circle(cx, cy, 19.75, RING), GAL, true)
    walls(trim, circle(cx, cy, 19.75, RING), ATT0, GAL, true)
  }
  mark('gallery')
  // attic cornice, then the dome
  lathe(trim, cx, cy, D ? [[16.8, ATT1], [17.35, ATT1 + 0.6], [17.35, 65.6], [15.6, 66.0]] : [[16.8, ATT1], [17.35, 65.6], [15.6, 66.0]], RING)
  {
    // lead dome on 32 ribs: z = 66 + 18 sqrt(1 - (r/15.6)^2), cut at the
    // lantern's base (r 4.4). Ribs are ridges proud of the panels.
    const R = 15.6, Hd = 18, Z0 = 66.0
    const rows = D ? 14 : 6, ribs = D ? 32 : 24, M = ribs * 2
    const rr: number[] = [], zz: number[] = []
    const tEnd = Math.acos(4.4 / R)
    for (let k = 0; k <= rows; k++) {
      const t = (tEnd * k) / rows
      rr.push(R * Math.cos(t)); zz.push(Z0 + Hd * Math.sin(t))
    }
    const prof = rr.map((r, k) => {
      // outward normal of the ellipse at this point
      const t = (tEnd * k) / rows
      return norm([Math.cos(t) / R, 0, Math.sin(t) / Hd])
    })
    const ridge = (k: number) => 0.5 * Math.min(1, rr[k] / 8)
    const pos = (i: number, k: number): V3 => {
      const a = (2 * Math.PI * i) / M + Math.PI / ribs / 2
      const r = rr[k] + (i % 2 === 0 ? ridge(k) : 0)
      return [cx + r * Math.cos(a), cy + r * Math.sin(a), zz[k] + (i % 2 === 0 ? ridge(k) * prof[k][2] * 0.5 : 0)]
    }
    for (let i = 0; i < M; i++) {
      const j = (i + 1) % M
      const am = (2 * Math.PI * (i + 0.5)) / M + Math.PI / ribs / 2
      // horizontal facet direction: the chord's outward normal
      const A0 = pos(i, 0), B0 = pos(j, 0)
      const ch = norm([B0[1] - A0[1], -(B0[0] - A0[0]), 0])
      const hz: XY = ch[0] * Math.cos(am) + ch[1] * Math.sin(am) > 0 ? [ch[0], ch[1]] : [-ch[0], -ch[1]]
      for (let k = 0; k < rows; k++) {
        const n0: V3 = norm([hz[0] * prof[k][0], hz[1] * prof[k][0], prof[k][2]])
        const n1: V3 = norm([hz[0] * prof[k + 1][0], hz[1] * prof[k + 1][0], prof[k + 1][2]])
        const a = pos(i, k), b = pos(j, k), c = pos(j, k + 1), d = pos(i, k + 1)
        lead.tri(a, b, c, undefined, undefined, undefined, [n0, n0, n1])
        lead.tri(a, c, d, undefined, undefined, undefined, [n0, n1, n1])
      }
    }
    // the ring the lantern stands on
  }

  mark('dome')
  // --- the lantern, Golden Gallery, ball and cross ---------------------------
  {
    const G0 = 83.0
    lathe(stone, cx, cy, [[4.9, G0 - 0.4], [5.1, G0 + 0.5], [4.4, G0 + 0.5]], D ? 24 : 16)
    // gallery railing (a ring with a real gap under its rail in detail)
    if (D) {
      for (let k = 0; k < 40; k++) { const a = (2 * Math.PI * k) / 40; cyl(stone, cx + 4.85 * Math.cos(a), cy + 4.85 * Math.sin(a), 0.07, G0 + 0.5, G0 + 1.5, 4) }
      lathe(stone, cx, cy, [[4.75, G0 + 1.45], [4.95, G0 + 1.45], [4.95, G0 + 1.65], [4.75, G0 + 1.65], [4.75, G0 + 1.45]], 32)
    } else {
      lathe(stone, cx, cy, [[4.95, G0 + 0.5], [4.95, G0 + 1.5], [4.6, G0 + 1.5]], 16)
    }
    const L0 = G0 + 0.5, L1 = 91.3
    const core = circle(cx, cy, 2.4, D ? 16 : 8, Math.PI / 8)
    walls(stone, core, L0, L1 + 1)
    // dark window slots in the core, between the column pairs
    for (let i = 0; i < core.length; i++) {
      const e = edgeOf(core[i], core[(i + 1) % core.length])
      const mid = Math.atan2((core[i][1] + core[(i + 1) % core.length][1]) / 2 - cy, (core[i][0] + core[(i + 1) % core.length][0]) / 2 - cx)
      if (Math.abs(Math.sin(2 * mid)) < 0.5) panel(win, e, [[0.3, L0 + 1.6], [e.len - 0.3, L0 + 1.6], [e.len - 0.3, L1 - 1.6], [0.3, L1 - 1.6]], 0.03)
    }
    // columns in pairs on the diagonals
    for (let q = 0; q < 4; q++) for (const o of [-13, 13]) {
      const a = ((45 + 90 * q + o) * Math.PI) / 180
      cyl(stone, cx + 3.25 * Math.cos(a), cy + 3.25 * Math.sin(a), 0.36, L0, L1, D ? 10 : 6, false, a)
    }
    lathe(trim, cx, cy, [[0, L1], [3.75, L1], [3.75, L1 + 1.0], [2.5, L1 + 1.0]], D ? 24 : 8, Math.PI / 8)
    // upper drum with its four oculi
    const U1 = 95.3
    const up = circle(cx, cy, 2.3, D ? 16 : 8, Math.PI / 8)
    walls(stone, up, L1 + 1.0, U1)
    for (let i = 0; i < up.length; i++) {
      const e = edgeOf(up[i], up[(i + 1) % up.length])
      const mid = Math.atan2((up[i][1] + up[(i + 1) % up.length][1]) / 2 - cy, (up[i][0] + up[(i + 1) % up.length][0]) / 2 - cx)
      if (Math.abs(Math.sin(2 * mid)) < 0.3) panel(win, e, circle(e.len / 2, (L1 + 1 + U1) / 2, 0.55, 8).map((q) => q), 0.03)
    }
    lathe(trim, cx, cy, D ? [[2.3, U1], [2.75, U1 + 0.45], [2.75, U1 + 0.7], [2.2, U1 + 0.7]] : [[2.3, U1], [2.75, U1 + 0.6], [2.2, U1 + 0.7]], D ? 24 : 8, Math.PI / 8)
    // cupola (lead), then the gilt finial, ball and cross (published 111 m)
    lathe(lead, cx, cy, [[2.2, U1 + 0.7], [2.1, 96.6], [1.6, 97.9], [0.8, 98.7], [0, 99.0]], D ? 24 : 8, 0, 0, 2 * Math.PI, true)
    lathe(gilt, cx, cy, D ? [[0.95, 98.6], [0.75, 99.6], [0.42, 101.4], [0.62, 102.6], [0.7, 103.3], [0.3, 104.0], [0, 104.2]] : [[0.95, 98.6], [0.45, 101.0], [0.7, 103.2], [0, 104.2]], D ? 16 : 6, 0, 0, 2 * Math.PI, true)
    ellipsoid(gilt, cx, cy, 105.15, 1.05, 1.05, D ? 16 : 8, D ? 10 : 5)
    const t = D ? 0.26 : 0.3
    box(gilt, cx - t, cx + t, cy - t, cy + t, 106.0, 111.0, 0)
    box(gilt, cx - t, cx + t, cy - 1.25, cy + 1.25, 108.6, 109.4, 0, true)
  }

  mark('lantern')
  // --- transept porches: semicircular, columns, half-domes ------------------
  for (const s of [1, -1]) {
    const pc: XY = [cx, s * (TF - 0.2)], R0 = 6.4
    const a0 = s > 0 ? 0 : Math.PI, a1 = a0 + Math.PI
    const half = (r: number, n: number): XY[] => {
      const pts: XY[] = []
      for (let k = 0; k <= n; k++) { const t = a0 + (Math.PI * k) / n; pts.push([pc[0] + r * Math.cos(t), pc[1] + r * Math.sin(t)]) }
      return pts
    }
    // steps / stylobate
    lathe(trim, pc[0], pc[1], D ? [[R0 + 0.6, 0], [R0 + 0.6, 0.5], [R0, 0.5], [R0, 1.0], [0, 1.0]] : [[R0 + 0.3, 0], [R0 + 0.3, 1.0], [0, 1.0]], D ? 16 : 8, 0, a0, a1)
    // six columns
    const n = 6
    for (let k = 0; k < n; k++) {
      const t = a0 + (Math.PI * (k + 0.5)) / n
      cyl(stone, pc[0] + 5.2 * Math.cos(t), pc[1] + 5.2 * Math.sin(t), 0.62, 1.0, 14.2, COLSEG, false, t)
    }
    // entablature (a half ring) and the half-dome
    lathe(trim, pc[0], pc[1], D ? [[5.95, 14.2], [5.95, 15.9], [6.3, 16.4], [5.4, 16.4]] : [[5.95, 14.2], [5.95, 16.4], [5.4, 16.4]], D ? 16 : 8, 0, a0, a1)
    lathe(lead, pc[0], pc[1], [[5.6, 16.4], [5.4, 18.0], [4.6, 19.8], [3.0, 21.3], [0, 22.0]], D ? 16 : 8, 0, a0, a1, true)
    // under-side of the entablature ring over the columns
    const o = half(5.95, 8), i = half(4.4, 8)
    for (let k = 0; k < 8; k++) poly(trim, [[...o[k], 14.2], [...o[k + 1], 14.2], [...i[k + 1], 14.2], [...i[k], 14.2]], DN)
    // the door and the window over the porch, and the transept front's dress
    const e = edgeOf(s > 0 ? [20.7, TF] : [2.8, -TF], s > 0 ? [2.8, TF] : [20.7, -TF])
    const mid = e.len / 2
    panel(win, e, [[mid - 1.6, 1.0], [mid + 1.6, 1.0], [mid + 1.6, 8.6], [mid - 1.6, 8.6]], 0.04)
    for (const sx of [1.3, 4.2, e.len - 4.2 - 1.1, e.len - 1.3 - 1.1]) relief(stone, e, sx, sx + 1.1, L_ENT, U_TOP, 0.32, 0, false)
    relief(trim, e, mid - 2.2, mid + 2.2, 19.0, 26.6, 0.18, 0, true, true)
    panel(win, e, archPts(mid, 3.4, 19.5, 24.5, D ? 10 : 6), 0.22)
    // the transept pediment over the upper order
    {
      const z0 = BAL, h = 4.8, d0 = -1.0
      const E = edgeOf(s > 0 ? [20.9, TF] : [2.6, -TF], s > 0 ? [2.6, TF] : [20.9, -TF])
      pediment(stone, lead, E, 0, E.len, z0, h, 0.3, d0 - 8, true)
      // raking cornices
      pediment(trim, trim, E, -0.3, E.len + 0.3, z0 - 0.4, h + 0.45, 0.6, 0.29)
    }
  }

  mark('porches')
  // --- the west front: two-storey portico, pediment, towers ----------------
  {
    const FX = -74.6
    // stylobate and steps
    box(trim, FX - 0.6, -66.0, -16.3, 16.3, 0, PLINTH, 0)
    // back wall dress: doors below, windows above
    const back = edgeOf([-66.0, 13.4], [-66.0, -13.4])
    // the portico's depth is in shadow: a shaded back wall behind the columns
    panel(niche, back, [[0.1, PLINTH], [26.7, PLINTH], [26.7, L_TOP], [0.1, L_TOP]], 0.03)
    panel(niche, back, [[2.2, L_ENT + 0.2], [24.6, L_ENT + 0.2], [24.6, U_TOP], [2.2, U_TOP]], 0.03)
    for (const [sc, w, h] of [[13.4, 3.4, 9.0], [13.4 - 6.2, 2.2, 6.8], [13.4 + 6.2, 2.2, 6.8]] as [number, number, number][]) {
      panel(win, back, [[sc - w / 2, PLINTH], [sc + w / 2, PLINTH], [sc + w / 2, PLINTH + h], [sc - w / 2, PLINTH + h]], 0.07)
    }
    for (const sc of [13.4 - 6.2, 13.4, 13.4 + 6.2]) panel(win, back, archPts(sc, sc === 13.4 ? 3.2 : 2.2, L_ENT + 2.0, L_ENT + 7.5, D ? 10 : 6), 0.07)
    // the side walls of the recess (the towers' inner faces)
    for (const s of [1, -1]) {
      const e = s > 0 ? edgeOf([-72.9, 13.4], [-66.0, 13.4]) : edgeOf([-66.0, -13.4], [-72.9, -13.4])
      panel(niche, e, [[0.1, PLINTH], [e.len - 0.1, PLINTH], [e.len - 0.1, L_TOP], [0.1, L_TOP]], 0.03)
      panel(win, e, archPts(e.len / 2, 2.0, 3.8, 9.5, 6), 0.07)
    }
    // lower order: six pairs of columns (photo: pair centres ±3.2, ±9.15, ±14.85)
    for (const yc of [-14.85, -9.15, -3.2, 3.2, 9.15, 14.85]) for (const o of [-0.95, 0.95]) {
      const y = yc + o
      cyl(stone, -73.55, y, 0.72, PLINTH, L_TOP - (D ? 1.2 : 0), COLSEG)
      if (D) {
        box(trim, -74.45, -72.65, y - 0.9, y + 0.9, PLINTH, PLINTH + 0.5, 0)
        lathe(trim, -73.55, y, [[0.72, L_TOP - 1.2], [0.98, L_TOP - 0.2], [1.0, L_TOP], [0, L_TOP]], 8)
      }
    }
    // lower entablature / the upper portico's floor
    box(trim, FX + 0.05, -66.0, -16.3, 16.3, L_TOP, L_ENT + 0.2, 0.3, true)
    // upper order: four pairs (±3.2, ±8.9)
    for (const yc of [-8.9, -3.2, 3.2, 8.9]) for (const o of [-0.88, 0.88]) {
      const y = yc + o
      cyl(stone, -73.4, y, 0.62, L_ENT + 0.2, U_TOP - (D ? 1.0 : 0), COLSEG)
      if (D) {
        box(trim, -74.2, -72.6, y - 0.8, y + 0.8, L_ENT + 0.2, L_ENT + 0.6, 0)
        lathe(trim, -73.4, y, [[0.62, U_TOP - 1.0], [0.86, U_TOP - 0.15], [0.88, U_TOP], [0, U_TOP]], 8)
      }
    }
    // the upper portico's entablature between the towers, and the pediment
    box(trim, FX + 0.25, -66.0, -13.4, 13.4, U_TOP, CORN + 0.4, 0.3, true)
    const pe = edgeOf([FX + 0.15, 11.6], [FX + 0.15, -11.6])
    pediment(stone, lead, pe, 0, pe.len, CORN + 0.4, 6.0, 0.15, -8.5, true)
    pediment(trim, trim, pe, -0.35, pe.len + 0.35, CORN, 6.5, 0.5, 0.14)
    // a tympanum relief panel, bold and flat (Conversion of St Paul)
    if (D) poly(trim, [pe.len * 0.3, pe.len * 0.7, pe.len * 0.5].map((s, k) => at(pe, s, CORN + 1.0 + (k === 2 ? 3.2 : 0), 0.25)), [pe.n[0], pe.n[1], 0])
  }
  mark('portico')
  for (const s of [1, -1]) tower(s)
  mark('towers')

  function tower(s: number) {
    const tx = -65.9, ty = s * 20.3
    // core to the main cornice, inside the screen walls
    walls(stone, rect(tx - 5.6, tx + 5.6, ty - 5.6, ty + 5.6), COURT, BAL)
    // clock stage (31–40.4), chamfered, with its cornice
    const C0 = BAL, C1 = 40.4
    const cr = rect(tx - 6.4, tx + 6.4, ty - 6.4, ty + 6.4, 0.9)
    walls(stone, cr, C0, C1)
    const cc = offset(cr, 0.45)
    band(trim, cr, C1, cc, C1 + 0.5)
    walls(trim, cc, C1 + 0.5, C1 + 1.0)
    cap(trim, cc, C1 + 1.0, true)
    // clock faces (south tower) and oculi (north tower): west face and the
    // outer side face
    // Great Tom's tower (south-west) has three dials, west, south and east;
    // the north-west tower has oculi in the same places
    const faces = [
      edgeOf([tx - 6.4, ty + 5.5], [tx - 6.4, ty - 5.5]),
      edgeOf([tx + 6.4, ty - 5.5], [tx + 6.4, ty + 5.5]),
      s > 0 ? edgeOf([tx + 5.5, ty + 6.4], [tx - 5.5, ty + 6.4]) : edgeOf([tx - 5.5, ty - 6.4], [tx + 5.5, ty - 6.4]),
    ]
    for (const e of faces) {
      const zc = 36.0, m = e.len / 2
      if (s < 0) {
        panel(gilt, e, circle(m, zc, 2.15, D ? 20 : 12), 0.06)
        panel(win, e, circle(m, zc, 1.75, D ? 20 : 10), 0.1)
      } else {
        if (D) relief(trim, e, m - 2.2, m + 2.2, zc - 2.2, zc + 2.2, 0.15, 0, true, true)
        panel(win, e, circle(m, zc, 1.3, D ? 16 : 8), D ? 0.2 : 0.05)
      }
      // a segmental pediment hood over the dial, bold
      if (D) relief(trim, e, m - 2.8, m + 2.8, zc + 2.6, zc + 3.1, 0.35, 0, true, true)
    }
    // colonnade stage (bold, nearly as wide as the clock stage): a plinth,
    // eight pairs of columns, on the corners and the axes, open between the
    // pairs onto a dark core, under a broad entablature
    const K0 = C1 + 1.0, K1 = K0 + 1.2, K2 = 49.8, K3 = 51.6
    prism(stone, circle(tx, ty, 6.25, 8, Math.PI / 8), K0, K1)
    walls(niche, circle(tx, ty, 3.6, 8, Math.PI / 8), K1, K2)
    for (let q = 0; q < 360; q += 45) for (const o of [-6.5, 6.5]) {
      const a = ((q + o) * Math.PI) / 180, x = tx + 5.45 * Math.cos(a), y = ty + 5.45 * Math.sin(a)
      cyl(stone, x, y, 0.5, K1, K2 - (D ? 0.6 : 0), COLSEG, false, a)
      if (D) lathe(trim, x, y, [[0.5, K2 - 0.6], [0.72, K2], [0, K2]], 8)
    }
    const ent = circle(tx, ty, 6.3, D ? 24 : 12, Math.PI / 12)
    walls(trim, ent, K2, K3)
    cap(trim, ent, K2, false)
    cap(stone, ent, K3, true)
    // upper stage: four corner piers round a dark core, arched openings on
    // the axes (real gaps), under a ring and cornice
    const S0 = K3, S1 = 55.4, S2 = 56.2
    for (const [qx, qy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
      const x0 = tx + qx * 1.1, x1 = tx + qx * 3.7, y0 = ty + qy * 1.1, y1 = ty + qy * 3.7
      box(stone, Math.min(x0, x1), Math.max(x0, x1), Math.min(y0, y1), Math.max(y0, y1), S0, S1, D ? 0.5 : 0)
      if (D) {
        const ux = tx + qx * 4.25, uy = ty + qy * 4.25
        lathe(stone, ux, uy, [[0.4, S0], [0.4, S0 + 0.4], [0.2, S0 + 0.6], [0.5, S0 + 1.2], [0.15, S0 + 1.9], [0, S0 + 2.1]], 8, 0, 0, 2 * Math.PI, true)
      }
    }
    box(niche, tx - 1.1, tx + 1.1, ty - 1.1, ty + 1.1, S0, S1, 0)
    const top = circle(tx, ty, 4.2, D ? 16 : 8, Math.PI / 8)
    walls(stone, top, S1, S2)
    cap(stone, top, S1, false)
    lathe(trim, tx, ty, D ? [[4.2, S2], [4.6, S2 + 0.4], [4.6, S2 + 0.6], [4.4, S2 + 0.6]] : [[4.2, S2], [4.6, S2 + 0.6], [4.4, S2 + 0.6]], D ? 16 : 8, Math.PI / 8)
    // the lead cupola: concave-sided, flaring at its foot, then a convex
    // shoulder; on it a small open lantern; then the gilt pineapple (to 67.4)
    const B0 = S2 + 0.6
    lathe(lead, tx, ty, [[4.4, B0], [3.7, B0 + 0.5], [2.9, B0 + 1.3], [2.35, B0 + 2.3], [2.1, B0 + 3.1], [2.0, B0 + 3.5], [1.8, B0 + 4.0], [1.3, B0 + 4.4], [1.0, B0 + 4.6]], D ? 16 : 10, 0, 0, 2 * Math.PI, true)
    cap(lead, circle(tx, ty, 1.0, D ? 16 : 10), B0 + 4.6, true)
    const LN0 = B0 + 4.6, LN1 = B0 + 6.1
    walls(niche, circle(tx, ty, 0.45, 6), LN0, LN1)
    for (const q of [45, 135, 225, 315]) {
      const a = (q * Math.PI) / 180
      box(stone, tx + 0.8 * Math.cos(a) - 0.17, tx + 0.8 * Math.cos(a) + 0.17, ty + 0.8 * Math.sin(a) - 0.17, ty + 0.8 * Math.sin(a) + 0.17, LN0, LN1, 0)
    }
    lathe(lead, tx, ty, [[1.15, LN1], [1.15, LN1 + 0.2], [0.8, LN1 + 0.45], [0, LN1 + 0.6]], D ? 12 : 8)
    const F0 = LN1 + 0.55
    lathe(gilt, tx, ty, [[0.5, F0], [0.32, F0 + 0.5], [0.6, F0 + 0.85], [0.3, F0 + 1.0]], D ? 10 : 6)
    ellipsoid(gilt, tx, ty, F0 + 2.15, 0.75, 1.25, D ? 10 : 6, D ? 8 : 5)
  }

  const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : p[2] > 66 ? 0.75 : 0.9)
  const leadLit = (p: V3, n: V3) => (p[2] > 66 && p[2] < 83 ? 0.55 : 0)
  return [
    { part: stone, material: { ...finish('portland-stone', 0xece2d0), floodlight: flood } as MaterialSpec },
    // trim carries the floodlight only in the detail model: the low model's
    // file budget has no room for it, and its cornices read as shadow lines
    { part: trim, material: (D ? { ...PALETTE.trim, floodlight: flood } : PALETTE.trim) as MaterialSpec },
    { part: lead, material: { ...finish('lead', 0xb0b7bd), floodlight: leadLit } as MaterialSpec },
    { part: win, material: PALETTE.window },
    { part: gilt, material: finish('gilt', 0xd6ad4e, 0.5) },
    { part: niche, material: finish('niche', 0x5c6168) },
  ]
}

// The outline, every building:part inside it (peristyle columns, towers,
// porticoes, porches, roofs, the lantern stack), and the multipolygon part of
// the outer walls.
const REPLACES = [
  ...`369161987 1147334230 1147334231 1147334232 1147334233 398708092 398708094 398708095 398708096 398708100 398708101 399171088 399171089 61381786 629776388 664526611 664529613 664529617 664529626 664529631 664529633 664529638 664529641 664529645 664529649 664529655 664529658 664529662 664529670 664529680 664533509 664533511 664533514 664533517 664533520 664533523 664533526 664533529 664533533 664533535 664533538 664533540 664533544 664533547 664533551 664533555 664533556 664533557 664533558 664533559 664533560 664533561 664533562 664533563 664533564 664533565 664534351 664613338 664613339 664613340 664613341 664624463 664624466 664625229 664626053 664630387 664630388 664630389 664630391 664630395 664642003 664642004 664642005 664642006 664646814 664646815 664646817 664646818 664647541 664648687 664648693 664648699 664648705 664651197 664651198 664651199 664651200 664659167 664659169 664659173 664659177 664659182 664659187 664659191 664659194 664659197 664659200 664659203 664659207 664659211 664662380 664662383 664669344 664669345 664669346 664669347 664669348 664669349 664669350 664669351 664669352`
    .split(' ').map((n) => `way/${n}`),
  'relation/9235275',
]

if (import.meta.main) {
  for (const [file, D, maxTri, maxBytes] of [
    ['london-st-pauls-cathedral.glb', false, 6500, 256000],
    ['london-st-pauls-cathedral.detail.glb', true, 40000, 1536 * 1024],
  ] as [string, boolean, number, number][]) {
    const parts = build(D)
    const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
    const glb = writeGlb("St Paul's Cathedral", parts, {
      license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 111,
      frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
      replaces: REPLACES,
    })
    const out = new URL(`../models/${file}`, import.meta.url).pathname
    await Bun.write(out, glb)
    console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
    if (triangles > maxTri) console.error(`${file}: triangle budget exceeded: ${triangles}`)
    if (glb.length > maxBytes) console.error(`${file}: file budget exceeded: ${glb.length}`)
  }
}
