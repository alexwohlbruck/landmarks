/**
 * Pirates of the Caribbean and the Blue Bayou, New Orleans Square,
 * Disneyland Park (Anaheim) — procedural, CC0-1.0.
 * bun generators/dlr-pirates-blue-bayou.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * centre of the cupola (OSM way/123303445), on the ground, at
 * -117.920831, 33.811236.
 *
 * What it is: the attraction's front building at the river end of New
 * Orleans Square, which also houses the Blue Bayou restaurant. A pink
 * stucco French Quarter townhouse facing north over the queue terrace: a
 * narrow west wing and a wider east wing under gabled roofs, each with a
 * white pedimented dormer, and between them a taller centre with a white
 * round-headed attic dormer and, behind it, an octagonal cupola under a
 * copper dome. Across the centre stands the two-storey slate-blue cast-iron
 * gallery with the "Pirates of the Caribbean" sign on its railing, a hipped
 * roof with a round-headed dormer and two little gables, and iron stairs
 * running down to either side. Below it, three arched doors.
 *
 * OSM draws the whole attraction as one outline, way/824031784 (height 10):
 * this building, the Blue Bayou and the ride's flume, and the plain show
 * building outside the berm. Nothing smaller covers the plain part, so the
 * model carries it too: the outline south of the front building, extruded
 * to OSM's 10 m as the flat-roofed box the map would have drawn. That is
 * what lets it replace the outline; with the outline left in, its 10 m box
 * would stand in front of the facade.
 *
 * Evidence
 * - OSM (measured): the outline way/824031784 (91 nodes, used as tagged for
 *   the show building); its north end gives the facade line (y = 4), the
 *   gallery's projection (x -4..4, out to y 6.3-7.0) and the east wing's
 *   chamfered corner; the round part way/123303445 places the cupola, on
 *   the gallery's axis. Parts way/123303434, /123303466, /123303460 and
 *   /123303438 lie inside and are replaced too.
 * - USGS NAIP orthophoto (public domain): the pink-and-grey roof of the
 *   front building, the oval queue terrace in front of it and the flat grey
 *   show-building roofs behind.
 * - Photos: front, from the terrace (Jeremy Thompson, "POTC at Disneyland
 *   2022" and "2025", CC BY 2.0, Commons); front-east three-quarter, 1979
 *   (Distraction Limited, Flickr 3777009722, CC BY 2.0); gallery and sign
 *   from below (SolarSurfer, "Pirates of the Caribbean Entrance.JPG",
 *   public domain); gallery and fountain (Jonnyboyca,
 *   "Disneyland-POTC entrance.jpg", public domain); cupola and the dormer
 *   from the west, 1985 (Figaro, "Pirates of the Caribbean building -
 *   Disneyland-1985-6.jpg", public domain); the west stair and cupola
 *   (Ken Lund, Flickr 17192780128, CC BY-SA 2.0).
 * - Estimated from the photos, scaled on the gallery's OSM width (8 m):
 *   ground floor 4.6 m to the gallery deck, gallery eave 8.5 m, wing
 *   cornice 10 m (= OSM's height), centre parapet 12 m, attic dormer 14.3 m,
 *   cupola 15.2 m, dome 17 m, finial 18 m. Wing dormers at +-5.4 m, mirrored
 *   about the cupola as the front photo shows.
 * - Invented or simplified: the building's depth (11-13 m, to where NAIP
 *   shows the flat show roofs), the back and side walls, which no photo
 *   shows; the wing roofs (gabled east-west, as the 1979 photo suggests);
 *   the west wing's notch in OSM is squared off. The lacework is drawn as
 *   solid dark railing and frieze bands, the doors as glazed arches.
 */
import { Part, cross, len, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const TAU = Math.PI * 2

const pink = new Part()    // the stucco
const stone = new Part()   // cornices, dormer fronts, cupola, the show building's walls
const roof = new Part()    // wing roofs, flat roofs
const iron = new Part()    // gallery, stairs, shutters
const dome = new Part()    // the cupola's copper dome
const glazing = new Part() // windows and the glazed doors

// ---------------------------------------------------------------------------
// Kit

const unit = (v: V3): V3 => { const l = len(v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]

/** A triangle whose winding is fixed to agree with its normals. */
function tri(p: Part, a: V3, b: V3, c: V3, n: V3[]) {
  const f = cross([b[0] - a[0], b[1] - a[1], b[2] - a[2]], [c[0] - a[0], c[1] - a[1], c[2] - a[2]])
  if (len(f) < 1e-9) return
  if (dot(f, add(add(n[0], n[1]), n[2])) >= 0) p.tri(a, b, c, undefined, undefined, undefined, n)
  else p.tri(a, c, b, undefined, undefined, undefined, [n[0], n[2], n[1]])
}
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3 | V3[]) {
  const N = Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3, n as V3]
  tri(p, a, b, c, [N[0], N[1], N[2]])
  tri(p, a, c, d, [N[0], N[2], N[3]])
}
const faceN = (a: V3, b: V3, c: V3): V3 => unit(cross([b[0] - a[0], b[1] - a[1], b[2] - a[2]], [c[0] - a[0], c[1] - a[1], c[2] - a[2]]))

/** Ear clipping for a simple polygon, counter-clockwise. */
function triangulate(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 20000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const a = idx[(i + idx.length - 1) % idx.length], b = idx[i], c = idx[(i + 1) % idx.length]
      if (cr(poly[a], poly[b], poly[c]) <= 1e-9) continue
      if (idx.some((j) => j !== a && j !== b && j !== c && inside(poly[j], poly[a], poly[b], poly[c]))) continue
      out.push([a, b, c]); idx.splice(i, 1); cut = true; break
    }
    if (!cut) throw new Error('triangulate: no ear')
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}
const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)

/** Walls of a polygon between two heights, and optionally its lid. */
function prism(walls: Part, r: XY[], z0: number, z1: number, lid?: Part) {
  r = ccw(r)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const n = unit([b[1] - a[1], -(b[0] - a[0]), 0])
    quad(walls, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], n)
  }
  if (lid) for (const [i, j, k] of triangulate(r)) tri(lid, [r[i][0], r[i][1], z1], [r[j][0], r[j][1], z1], [r[k][0], r[k][1], z1], [[0, 0, 1], [0, 0, 1], [0, 0, 1]])
}
/** A polygon pushed out by `d` on every side (mitred). */
function grow(r: XY[], d: number): XY[] {
  r = ccw(r)
  const n = r.length
  return r.map((p, i) => {
    const a = r[(i + n - 1) % n], b = r[(i + 1) % n]
    const e1 = unit([p[0] - a[0], p[1] - a[1], 0]), e2 = unit([b[0] - p[0], b[1] - p[1], 0])
    const n1: XY = [e1[1], -e1[0]], n2: XY = [e2[1], -e2[0]]
    const m = unit([n1[0] + n2[0], n1[1] + n2[1], 0]), cos = m[0] * n1[0] + m[1] * n1[1]
    const k = d / Math.max(cos, 0.4)
    return [p[0] + m[0] * k, p[1] + m[1] * k]
  })
}
/** A cornice round a polygon: a bevelled band standing `d` proud of the wall. */
function cornice(p: Part, r: XY[], z0: number, z1: number, d: number) {
  const o = grow(r, d), b = (z1 - z0) * 0.35
  r = ccw(r)
  for (let i = 0; i < o.length; i++) {
    const j = (i + 1) % o.length
    const n = unit([o[j][1] - o[i][1], -(o[j][0] - o[i][0]), 0])
    const sl = unit([n[0], n[1], -1]), up = unit([n[0], n[1], 1])
    // underside chamfer, face, top chamfer
    quad(p, [r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [o[j][0], o[j][1], z0 + b], [o[i][0], o[i][1], z0 + b], sl)
    quad(p, [o[i][0], o[i][1], z0 + b], [o[j][0], o[j][1], z0 + b], [o[j][0], o[j][1], z1 - b * 0.6], [o[i][0], o[i][1], z1 - b * 0.6], n)
    const ii = grow(r, d * 0.4)
    quad(p, [o[i][0], o[i][1], z1 - b * 0.6], [o[j][0], o[j][1], z1 - b * 0.6], [ii[j][0], ii[j][1], z1], [ii[i][0], ii[i][1], z1], up)
  }
}

/** An axis-aligned box; `skip` leaves faces off ('b' bottom, 't' top, 'n','s','e','w'). */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, skip = 'b') {
  if (!skip.includes('s')) quad(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  if (!skip.includes('n')) quad(p, [x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [0, 1, 0])
  if (!skip.includes('e')) quad(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
  if (!skip.includes('w')) quad(p, [x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [-1, 0, 0])
  if (!skip.includes('t')) quad(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
  if (!skip.includes('b')) quad(p, [x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z0], [0, 0, -1])
}

/** A face: origin on the wall, `u` along it (left to right from outside), outward `n`. */
type Face = { o: XY; u: XY; n: V3 }
const faceOf = (a: XY, b: XY): Face => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  return { o: a, u, n: [u[1], -u[0], 0] }
}
const NORTH: Face = { o: [0, 4.0], u: [-1, 0], n: [0, 1, 0] } // the facade; s measured westward from x = 0
const fx = (x: number) => -x // facade s from an x position
const at = (f: Face, s: number, z: number, d = 0): V3 => [f.o[0] + f.u[0] * s + f.n[0] * d, f.o[1] + f.u[1] * s + f.n[1] * d, z]
/** A flat convex shape on a face, `d` proud of it. */
function panel(p: Part, f: Face, pts: XY[], d = 0.05) {
  const v = pts.map(([s, z]) => at(f, s, z, d))
  for (let i = 1; i < v.length - 1; i++) tri(p, v[0], v[i], v[i + 1], [f.n, f.n, f.n])
}
/** A raised block on a face: front and its four returns. */
function relief(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d: number) {
  const u: V3 = [f.u[0], f.u[1], 0]
  quad(p, at(f, s0, z0, d), at(f, s1, z0, d), at(f, s1, z1, d), at(f, s0, z1, d), f.n)
  quad(p, at(f, s0, z1, 0), at(f, s0, z1, d), at(f, s1, z1, d), at(f, s1, z1, 0), [0, 0, 1])
  quad(p, at(f, s0, z0, 0), at(f, s1, z0, 0), at(f, s1, z0, d), at(f, s0, z0, d), [0, 0, -1])
  quad(p, at(f, s0, z0, 0), at(f, s0, z0, d), at(f, s0, z1, d), at(f, s0, z1, 0), [-u[0], -u[1], 0])
  quad(p, at(f, s1, z0, 0), at(f, s1, z1, 0), at(f, s1, z1, d), at(f, s1, z0, d), u)
}
/** Round-headed opening: a rectangle under a semicircle. */
function arch(s0: number, s1: number, z0: number, spring: number, seg = 8): XY[] {
  const r = (s1 - s0) / 2, c = s0 + r
  const pts: XY[] = [[s0, z0], [s1, z0]]
  for (let k = 0; k <= seg; k++) { const a = (k / seg) * Math.PI; pts.push([c + r * Math.cos(a), spring + r * Math.sin(a)]) }
  return pts
}
const rectS = (s0: number, s1: number, z0: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
const disc = (s: number, z: number, r: number, seg = 12): XY[] => Array.from({ length: seg }, (_, k) => [s + r * Math.cos((k / seg) * TAU), z + r * Math.sin((k / seg) * TAU)] as XY)

/**
 * A profile (x, z) extruded along y from y0 (back) to y1 (front): the
 * front and back faces and the sides, smooth across gentle bends.
 */
function extrudeY(p: Part, prof: XY[], y0: number, y1: number, back = true) {
  const n = prof.length
  for (let i = 1; i < n - 1; i++) {
    tri(p, [prof[0][0], y1, prof[0][1]], [prof[i][0], y1, prof[i][1]], [prof[i + 1][0], y1, prof[i + 1][1]], [[0, 1, 0], [0, 1, 0], [0, 1, 0]])
    if (back) tri(p, [prof[0][0], y0, prof[0][1]], [prof[i + 1][0], y0, prof[i + 1][1]], [prof[i][0], y0, prof[i][1]], [[0, -1, 0], [0, -1, 0], [0, -1, 0]])
  }
  const cx = prof.reduce((s, q) => s + q[0], 0) / n, cz = prof.reduce((s, q) => s + q[1], 0) / n
  for (let i = 0; i < n; i++) {
    const a = prof[i], b = prof[(i + 1) % n]
    let nn = unit([b[1] - a[1], 0, -(b[0] - a[0])])
    if (dot(nn, [a[0] - cx, 0, a[1] - cz]) < 0) nn = [-nn[0], 0, -nn[2]]
    quad(p, [a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]], nn)
  }
}

/** A surface of revolution about (cx, cy): `prof` is (radius, z) from the bottom up. */
function lathe(p: Part, cx: number, cy: number, prof: XY[], seg: number, phase = 0, smooth = true) {
  for (let k = 0; k < seg; k++) {
    const a0 = ((k + phase) / seg) * TAU, a1 = ((k + 1 + phase) / seg) * TAU
    for (let i = 0; i < prof.length - 1; i++) {
      const [r0, z0] = prof[i], [r1, z1] = prof[i + 1]
      const P = (r: number, a: number, z: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
      const sl = unit([z1 - z0, 0, -(r1 - r0)])
      const N = (a: number): V3 => unit([sl[0] * Math.cos(a), sl[0] * Math.sin(a), sl[2]])
      const am = (a0 + a1) / 2
      const n0 = smooth ? N(a0) : N(am), n1 = smooth ? N(a1) : N(am)
      if (r0 < 1e-6) tri(p, P(r0, am, z0), P(r1, a1, z1), P(r1, a0, z1), [N(am), n1, n0])
      else if (r1 < 1e-6) tri(p, P(r0, a0, z0), P(r0, a1, z0), P(r1, am, z1), [n0, n1, N(am)])
      else quad(p, P(r0, a0, z0), P(r0, a1, z0), P(r1, a1, z1), P(r1, a0, z1), [n0, n1, n1, n0])
    }
  }
}
const ball = (p: Part, x: number, y: number, z: number, r: number) =>
  lathe(p, x, y, Array.from({ length: 5 }, (_, i) => { const t = (i / 4) * Math.PI - Math.PI / 2; return [r * Math.cos(t), z + r * Math.sin(t)] as XY }), 8)

// ---------------------------------------------------------------------------
// The show building: the OSM outline south of the front building.

const ANCHOR: XY = [-117.920831, 33.811236]
const MX = 111320 * Math.cos((ANCHOR[1] * Math.PI) / 180), MY = 110574
const ll = ([lon, lat]: XY): XY => [(lon - ANCHOR[0]) * MX, (lat - ANCHOR[1]) * MY]

// way/824031784, closed ring without its repeated last node.
const OUTLINE_LL: XY[] = [
  [-117.9223552, 33.8105799], [-117.9222674, 33.8104846], [-117.9222281, 33.8104451], [-117.9219370, 33.8103670],
  [-117.9219150, 33.8103611], [-117.9216838, 33.8102990], [-117.9215873, 33.8102853], [-117.9214663, 33.8103583],
  [-117.9214035, 33.8105119], [-117.9214908, 33.8106059], [-117.9214768, 33.8106143], [-117.9214428, 33.8106348],
  [-117.9214262, 33.8106446], [-117.9214170, 33.8106500], [-117.9213633, 33.8106831], [-117.9213147, 33.8106288],
  [-117.9210653, 33.8106554], [-117.9209808, 33.8106635], [-117.9209581, 33.8106659], [-117.9209184, 33.8107308],
  [-117.9207457, 33.8110395], [-117.9207360, 33.8110575], [-117.9207303, 33.8110552], [-117.9207048, 33.8110963],
  [-117.9206861, 33.8111265], [-117.9206917, 33.8111286], [-117.9206919, 33.8111378], [-117.9206850, 33.8111378],
  [-117.9206854, 33.8111618], [-117.9206899, 33.8111616], [-117.9206899, 33.8111680], [-117.9206992, 33.8111679],
  [-117.9206998, 33.8112119], [-117.9206999, 33.8112186], [-117.9206999, 33.8112233], [-117.9207085, 33.8112226],
  [-117.9207262, 33.8112671], [-117.9207527, 33.8112665], [-117.9207522, 33.8112732], [-117.9207896, 33.8112724],
  [-117.9207898, 33.8112797], [-117.9207892, 33.8112884], [-117.9207930, 33.8112884], [-117.9207931, 33.8112935],
  [-117.9208152, 33.8112931], [-117.9208178, 33.8112994], [-117.9208236, 33.8112993], [-117.9208315, 33.8112992],
  [-117.9208401, 33.8112990], [-117.9208446, 33.8112990], [-117.9208491, 33.8112933], [-117.9208688, 33.8112938],
  [-117.9208690, 33.8112866], [-117.9208739, 33.8112868], [-117.9208744, 33.8112808], [-117.9208734, 33.8112730],
  [-117.9209045, 33.8112741], [-117.9209052, 33.8112614], [-117.9208850, 33.8112329], [-117.9208852, 33.8112285],
  [-117.9208872, 33.8112050], [-117.9208904, 33.8112006], [-117.9209041, 33.8111823], [-117.9209178, 33.8111627],
  [-117.9209355, 33.8111382], [-117.9209815, 33.8111208], [-117.9209952, 33.8111069], [-117.9210596, 33.8110724],
  [-117.9211216, 33.8110376], [-117.9211826, 33.8110052], [-117.9212224, 33.8110088], [-117.9212921, 33.8109970],
  [-117.9213374, 33.8109798], [-117.9214099, 33.8109435], [-117.9214331, 33.8109306], [-117.9214698, 33.8109119],
  [-117.9214883, 33.8109136], [-117.9215070, 33.8109034], [-117.9215461, 33.8108765], [-117.9215270, 33.8108548],
  [-117.9215047, 33.8108305], [-117.9215733, 33.8108021], [-117.9216273, 33.8107797], [-117.9217455, 33.8108975],
  [-117.9218636, 33.8108228], [-117.9218976, 33.8108613], [-117.9221098, 33.8107303], [-117.9221580, 33.8107011],
  [-117.9221649, 33.8106970], [-117.9222161, 33.8106656],
]
const OUTLINE = OUTLINE_LL.map(ll)
// The front building takes the outline north of the line between these two
// nodes (its east and west back corners); the show building is the rest.
const cutE = OUTLINE.findIndex(([x, y]) => Math.abs(x - 12.1) < 0.3 && Math.abs(y + 7.5) < 0.3)
const cutW = OUTLINE.findIndex(([x, y]) => Math.abs(x + 6.8) < 0.3 && Math.abs(y + 6.0) < 0.3)
if (cutE < 0 || cutW < 0 || cutW < cutE) throw new Error(`outline cut not found: ${cutE} ${cutW}`)
const SHOW_RING = [...OUTLINE.slice(0, cutE + 1), ...OUTLINE.slice(cutW)]
const SHOW_H = 10 // OSM height
// The show roofs are pale in NAIP, as the map's own extrusions are, so the
// box reads as the plain building it is, not as a dark slab.
const showRoof = stone
prism(stone, SHOW_RING, 0, SHOW_H - 0.4)
// The parapet's coping, a touch proud, catches the light round the flat roof.
cornice(stone, SHOW_RING, SHOW_H - 0.4, SHOW_H, 0.12)
for (const [i, j, k] of triangulate(ccw(SHOW_RING))) {
  const r = ccw(SHOW_RING)
  tri(showRoof, [r[i][0], r[i][1], SHOW_H - 0.05], [r[j][0], r[j][1], SHOW_H - 0.05], [r[k][0], r[k][1], SHOW_H - 0.05], [[0, 0, 1], [0, 0, 1], [0, 0, 1]])
}

// ---------------------------------------------------------------------------
// The front building.

const FRONT = 4.0       // facade line
const CORNICE = 9.4     // wings' cornice, level with the gallery's eave
const CENTRE_TOP = 11.6 // the taller centre
const BODY: XY[] = [[-6.8, -6.0], [12.1, -7.5], [12.1, -2.0], [9.4, FRONT], [-6.8, FRONT]]
prism(pink, BODY, 0, CORNICE - 0.5)
cornice(stone, BODY, CORNICE - 0.5, CORNICE, 0.3)
const lidZ = CORNICE - 0.02
for (const [i, j, k] of triangulate(ccw(BODY))) {
  const r = ccw(BODY)
  tri(roof, [r[i][0], r[i][1], lidZ], [r[j][0], r[j][1], lidZ], [r[k][0], r[k][1], lidZ], [[0, 0, 1], [0, 0, 1], [0, 0, 1]])
}

// The centre rises two metres above the wings.
const CX = 3.7, CB = -4.0
box(pink, -CX, CX, CB, FRONT, CORNICE, CENTRE_TOP - 0.45, 'bt')
cornice(stone, [[-CX, CB], [CX, CB], [CX, FRONT], [-CX, FRONT]], CENTRE_TOP - 0.45, CENTRE_TOP, 0.25)
box(roof, -CX, CX, CB, FRONT, CENTRE_TOP - 0.45, CENTRE_TOP - 0.02, 'bnsew')
// Balustrade along the centre's front either side of the attic dormer,
// ball finials on its end posts.
for (const sgn of [-1, 1]) {
  const xa = sgn * 1.0, xb = sgn * (CX - 0.15)
  box(stone, Math.min(xa, xb), Math.max(xa, xb), FRONT - 0.45, FRONT - 0.15, CENTRE_TOP, CENTRE_TOP + 0.55, 'b')
  box(stone, sgn * CX - 0.3, sgn * CX + 0.3, FRONT - 0.6, FRONT, CENTRE_TOP, CENTRE_TOP + 0.75, 'b')
  ball(stone, sgn * CX, FRONT - 0.3, CENTRE_TOP + 1.05, 0.32)
}

// The attic dormer on the centre: a white round-headed front.
{
  const prof = arch(-0.95, 0.95, CENTRE_TOP - 0.3, CENTRE_TOP + 1.4, 8).map(([s, z]) => [s, z] as XY)
  extrudeY(stone, [prof[0], prof[1], ...prof.slice(2)], FRONT - 1.6, FRONT - 0.1)
  panel(glazing, { o: [0, FRONT - 0.1], u: [1, 0], n: [0, 1, 0] }, arch(-0.55, 0.55, CENTRE_TOP + 0.15, CENTRE_TOP + 1.45, 6), 0.04)
}

// The cupola behind it: an octagonal drum, a cornice ring and the copper dome.
{
  const cx = 0, cy = -0.4, r = 1.45, z0 = CENTRE_TOP - 0.1, z1 = 15.0
  lathe(stone, cx, cy, [[r, z0], [r, z1]], 8, 0.5, false)
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * TAU, ca = Math.cos(a), sa = Math.sin(a)
    const apo = r * Math.cos(Math.PI / 8)
    const f: Face = { o: [cx + ca * apo, cy + sa * apo], u: [-sa, ca], n: [ca, sa, 0] }
    panel(glazing, f, arch(-0.3, 0.3, 12.7, 14.0, 4), 0.04)
  }
  lathe(stone, cx, cy, [[r, z1], [r + 0.22, z1 + 0.1], [r + 0.22, z1 + 0.3], [r - 0.05, z1 + 0.4]], 8, 0.5, false)
  // A bell-shaped dome, then a slim finial.
  lathe(dome, cx, cy, [[r - 0.05, 15.4], [r + 0.02, 15.75], [r - 0.15, 16.25], [r - 0.6, 16.75], [0.35, 17.0], [0, 17.1]], 12)
  lathe(stone, cx, cy, [[0.22, 17.0], [0.2, 17.4], [0.08, 18.2], [0, 18.3]], 6)
}

// Wing roofs: gabled, ridge east-west, eaves on the cornice line.
function wingRoof(x0: number, x1: number, gableAt: 'w' | 'e' | 'both') {
  const y0 = CB - 0.3, y1 = FRONT + 0.3, ym = (CB + FRONT) / 2, z0 = CORNICE, z1 = CORNICE + 2.0
  const nN = faceN([x0, y1, z0], [x1, y1, z0], [x1, ym, z1])
  quad(roof, [x0, y1, z0], [x1, y1, z0], [x1, ym, z1], [x0, ym, z1], nN.map((v, i) => (i === 2 ? Math.abs(v) : v)) as V3)
  const nS = faceN([x1, y0, z0], [x0, y0, z0], [x0, ym, z1])
  quad(roof, [x1, y0, z0], [x0, y0, z0], [x0, ym, z1], [x1, ym, z1], nS.map((v, i) => (i === 2 ? Math.abs(v) : v)) as V3)
  if (gableAt !== 'e') tri(pink, [x0, CB, z0], [x0, FRONT, z0], [x0, ym, z1 - 0.12], [[-1, 0, 0], [-1, 0, 0], [-1, 0, 0]])
  if (gableAt !== 'w') tri(pink, [x1, FRONT, z0], [x1, CB, z0], [x1, ym, z1 - 0.12], [[1, 0, 0], [1, 0, 0], [1, 0, 0]])
}
wingRoof(-6.8, -CX, 'w')
wingRoof(CX, 9.4, 'e')

// Wing dormers, mirrored about the cupola: pink cheeks, a white pediment,
// an arched window.
for (const x of [-4.6, 4.9]) {
  const y0 = FRONT - 1.8, y1 = FRONT - 0.15, z0 = CORNICE - 0.1, z1 = CORNICE + 1.55
  box(pink, x - 0.72, x + 0.72, y0, y1, z0, z1, 'bt')
  // pediment: a white triangular prism with a little roof
  const prof: XY[] = [[x - 0.9, z1 - 0.05], [x + 0.9, z1 - 0.05], [x, z1 + 0.75]]
  extrudeY(stone, prof, y0, y1 + 0.08)
  box(stone, x - 0.85, x + 0.85, y1 - 0.02, y1 + 0.08, z0 + 0.05, z0 + 0.2, 'b')
  panel(glazing, { o: [x, y1], u: [1, 0], n: [0, 1, 0] }, arch(-0.42, 0.42, z0 + 0.25, z1 - 0.42, 6), 0.04)
}

// ---------------------------------------------------------------------------
// The facade: arched doors, shuttered windows, oculi.

const BAYS_WING = [-4.6, 4.9, 7.4]
const BAYS_GALLERY = [-2.6, 0, 2.6]
for (const x of BAYS_GALLERY) {
  panel(glazing, NORTH, arch(fx(x) - 0.85, fx(x) + 0.85, 0.05, 3.0, 8))
  const w = x === 0 ? 0.65 : 0.6
  panel(glazing, NORTH, rectS(fx(x) - w, fx(x) + w, 4.75, 7.4))
  if (x !== 0) for (const sg of [-1, 1]) panel(iron, NORTH, rectS(fx(x) + sg * 0.65, fx(x) + sg * 1.15, 4.75, 7.4))
}
for (const x of BAYS_WING) {
  panel(glazing, NORTH, arch(fx(x) - 0.7, fx(x) + 0.7, 0.05, 2.9, 8))
  panel(glazing, NORTH, rectS(fx(x) - 0.55, fx(x) + 0.55, 4.9, 7.4))
  for (const sg of [-1, 1]) panel(iron, NORTH, rectS(fx(x) + sg * 0.6, fx(x) + sg * 1.08, 4.9, 7.4))
  relief(stone, NORTH, fx(x) - 0.75, fx(x) + 0.75, 7.95, 8.85, 0.07)
  panel(glazing, NORTH, disc(fx(x), 8.4, 0.5, 12).map(([s, z]) => [s, 8.4 + (z - 8.4) * 0.62] as XY), 0.1)
}
// The chamfered north-east corner and the east end get a bay each.
{
  const f = faceOf([9.4, FRONT], [12.1, -2.0]), L = Math.hypot(2.7, 6.0)
  for (const s of [L * 0.3, L * 0.72]) {
    panel(glazing, f, arch(s - 0.65, s + 0.65, 0.05, 2.9, 8))
    panel(glazing, f, rectS(s - 0.55, s + 0.55, 5.1, 7.6))
    for (const sg of [-1, 1]) panel(iron, f, rectS(s + sg * 0.6, s + sg * 1.05, 5.1, 7.6))
  }
  const e = faceOf([12.1, -2.0], [12.1, -7.5])
  for (const s of [1.6, 4.0]) {
    panel(glazing, e, rectS(s - 0.55, s + 0.55, 5.1, 7.6))
    panel(glazing, e, rectS(s - 0.55, s + 0.55, 1.0, 3.2))
  }
}

// ---------------------------------------------------------------------------
// The cast-iron gallery across the centre.

const GX = 4.1, GY = FRONT + 2.7, DECK = 4.4, EAVE = 8.8, CANT = 0.85
// Plan of the gallery: canted at both front corners, as the photos show.
const GPLAN: XY[] = [[-GX, FRONT], [-GX, GY - CANT], [-GX + CANT, GY], [GX - CANT, GY], [GX, GY - CANT], [GX, FRONT]]
/** A band along the gallery's open sides, `d` thick, set `inset` back from the edge. */
function galleryBand(z0: number, z1: number, inset: number, d: number) {
  const outer = GPLAN.map(([x, y]) => [x - Math.sign(x) * inset * 0.7, y - (y > FRONT + 0.01 ? inset * 0.7 : 0)] as XY)
  for (let i = 0; i < outer.length - 1; i++) {
    const a = outer[i], b = outer[i + 1]
    const n = unit([b[1] - a[1], -(b[0] - a[0]), 0])
    const ai: XY = [a[0] - n[0] * d, a[1] - n[1] * d], bi: XY = [b[0] - n[0] * d, b[1] - n[1] * d]
    quad(iron, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], n)
    quad(iron, [bi[0], bi[1], z0], [ai[0], ai[1], z0], [ai[0], ai[1], z1], [bi[0], bi[1], z1], [-n[0], -n[1], 0])
    quad(iron, [a[0], a[1], z1], [b[0], b[1], z1], [bi[0], bi[1], z1], [ai[0], ai[1], z1], [0, 0, 1])
  }
}
const POSTS: XY[] = [[-GX + 0.12, GY - CANT], [-GX + CANT, GY - 0.12], [-1.3, GY - 0.12], [1.3, GY - 0.12], [GX - CANT, GY - 0.12], [GX - 0.12, GY - CANT]]
for (const [x, y] of POSTS) {
  box(iron, x - 0.12, x + 0.12, y - 0.12, y + 0.12, 0, DECK, 'b')
  box(iron, x - 0.1, x + 0.1, y - 0.1, y + 0.1, DECK + 0.3, EAVE, 'bt')
}
// Deck with a deep fascia, the railing band and the lace frieze under the eave.
prism(iron, GPLAN, DECK - 0.05, DECK + 0.3, iron)
for (const [i, j, k] of triangulate(ccw(GPLAN))) {
  const r = ccw(GPLAN)
  tri(iron, [r[i][0], r[i][1], DECK - 0.05], [r[k][0], r[k][1], DECK - 0.05], [r[j][0], r[j][1], DECK - 0.05], [[0, 0, -1], [0, 0, -1], [0, 0, -1]])
}
galleryBand(DECK + 0.3, DECK + 1.3, 0.04, 0.1)
galleryBand(EAVE - 0.6, EAVE, 0.12, 0.18)
// The sign, cream on the railing's middle.
extrudeY(stone, [[-1.55, 4.95], [-1.2, 4.68], [1.2, 4.68], [1.55, 4.95], [1.55, 5.65], [1.25, 5.85], [-1.25, 5.85], [-1.55, 5.65]], GY - 0.06, GY + 0.08)
// Hipped roof against the wall, following the canted plan; a round-headed
// dormer in its middle and a small gable over each of the front posts.
{
  const o = 0.25, ez = EAVE, rz = 10.3, rx = 2.4
  const E = GPLAN.map(([x, y]) => [x + Math.sign(x) * o, y > FRONT + 0.01 ? y + o * 0.8 : y] as XY)
  const R0: V3 = [-rx, FRONT, rz], R1: V3 = [rx, FRONT, rz]
  const up = (a: V3, b: V3, c: V3): V3 => { const n = faceN(a, b, c); return n[2] < 0 ? [-n[0], -n[1], -n[2]] : n }
  const e = E.map(([x, y]) => [x, y, ez] as V3)
  const f = up(e[2], e[3], R1); quad(iron, e[2], e[3], R1, R0, f)
  const faces3: [V3, V3, V3][] = [[e[0], e[1], R0], [e[1], e[2], R0], [e[3], e[4], R1], [e[4], e[5], R1]]
  for (const [a, b, c] of faces3) { const n = up(a, b, c); tri(iron, a, b, c, [n, n, n]) }
  // a fascia under the eave
  for (let i = 0; i < E.length - 1; i++) {
    const a = E[i], b = E[i + 1], n = unit([b[1] - a[1], -(b[0] - a[0]), 0])
    quad(iron, [a[0], a[1], ez - 0.28], [b[0], b[1], ez - 0.28], [b[0], b[1], ez], [a[0], a[1], ez], n)
  }
  // the round-headed dormer, its fanlight
  extrudeY(iron, arch(-0.95, 0.95, ez - 0.2, 9.8, 8), FRONT, GY + 0.1)
  panel(glazing, { o: [0, GY + 0.1], u: [1, 0], n: [0, 1, 0] }, [[-0.62, 9.8], [0.62, 9.8], ...arch(-0.62, 0.62, 9.8, 9.8, 6).slice(2)], 0.03)
  for (const x of [-2.75, 2.75]) extrudeY(iron, [[x - 0.8, ez - 0.05], [x + 0.8, ez - 0.05], [x, ez + 0.65]], GY - 0.8, GY + o * 0.8 + 0.02)
}

// Iron stairs down from each end of the gallery, along the front.
for (const sg of [-1, 1]) {
  const xa = sg * GX, xb = sg * 8.6, y0 = FRONT + 0.05, y1 = FRONT + 1.1
  const A0: V3 = [xa, y0, DECK - 0.05], A1: V3 = [xa, y1, DECK - 0.05], B0: V3 = [xb, y0, 0], B1: V3 = [xb, y1, 0]
  let up = faceN(A0, A1, B1); if (up[2] < 0) up = [-up[0], -up[1], -up[2]]
  quad(iron, A0, A1, B1, B0, up)
  const t = 0.25
  quad(iron, add(A0, [0, 0, -t]), add(A1, [0, 0, -t]), add(B1, [0, 0, -t]), add(B0, [0, 0, -t]), [-up[0], -up[1], -up[2]])
  // the outer stringer and its railing, a solid band
  quad(iron, add(A1, [0, 0, -t]), add(B1, [0, 0, -t]), add(B1, [0, 0, 0.8]), add(A1, [0, 0, 0.8]), [0, 1, 0])
  quad(iron, add(A1, [0, -0.1, -t]), add(A1, [0, -0.1, 0.8]), add(B1, [0, -0.1, 0.8]), add(B1, [0, -0.1, -t]), [0, -1, 0])
  quad(iron, add(A1, [0, -0.1, 0.8]), add(B1, [0, -0.1, 0.8]), add(B1, [0, 0, 0.8]), add(A1, [0, 0, 0.8]), [0, 0, 1])
}

// ---------------------------------------------------------------------------

// Pink stucco is the building's identity, pulled to the palette's
// lightness; the cast iron is its slate blue, dark enough to read as the
// lace galleries do, lighter than charcoal; the dome its copper-rose.
const parts = [
  { part: pink, material: finish('pirates-pink', 0xf0c9c0) },
  { part: stone, material: PALETTE.stone },
  { part: roof, material: PALETTE.roof },
  { part: iron, material: finish('pirates-iron', 0x56697d) },
  { part: dome, material: finish('pirates-dome', 0xb48b7a) },
  { part: glazing, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Pirates of the Caribbean and Blue Bayou', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/dlr-pirates-blue-bayou.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
