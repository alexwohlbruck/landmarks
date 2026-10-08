/**
 * The Mark Twain Riverboat, Rivers of America, Disneyland Park (Anaheim) —
 * procedural, CC0-1.0.
 * bun generators/dlr-mark-twain.ts
 *
 * Model frame: x across the beam, y along the boat with the bow at +y, z up,
 * metres; the origin is amidships on the waterline. Placed at bearing 180,
 * bow south, lying at the Frontierland Landing as she does between trips.
 *
 * What it is: a 5/8-scale stern-wheel steamboat (1955), white, three decks:
 * the main deck (engine room aft, open forward), the boiler deck with its
 * saloon and gingerbread gallery, the hurricane deck with the texas cabin
 * and the pilot house; twin black stacks with gold bands, flared collars and
 * feathered crowns side by side ahead of the pilot house, the gilt spreader
 * between them; the dark stern wheel behind the name bulkhead; a low dark
 * hull with a fine bow, the jackstaff mast and the stage boom over the bow.
 *
 * It moves; OSM has no building for it, so it replaces nothing. The stern
 * wheel is its own node about the axle (static here), so it can turn later.
 *
 * Evidence
 * - Published (Wikipedia, "Disney riverboats"): 105 ft (32 m) hull, 5/8
 *   scale, three passenger levels, draws 18 in, 300 passengers.
 * - OSM (measured): the Mark Twain's guide-rail route way/117604594
 *   (relation/16491364) runs south along the Frontierland Landing pier
 *   (way/202045455, way/146430146); the boat's centreline is put on it,
 *   heading 180, centred on the landing.
 * - Photos: broadside, bow right (Jonnyboyca, "MarkTwainRiverboat50th.jpg",
 *   public domain); bow three-quarter (SolarSurfer, "Mark Twain
 *   Riverboat.JPG", public domain); stern three-quarter and the wheel
 *   (Quistnix, "Raderboot disneyland.jpg" and "...schoepenrad.jpg",
 *   CC BY-SA 3.0); bow-on at the landing (Benoît Prieur, "Mark Twain
 *   Riverboat July 2022.jpg", CC0); stern (Figaro, "Mark Twain padel wheel -
 *   Disneyland-1985-3b.jpg", public domain); the crowns from below
 *   (HarshLight, Flickr, CC BY 2.0).
 * - Estimated from the broadside photo scaled on the 32 m hull: main deck
 *   1.05 m, boiler deck 3.95 m, hurricane deck 6.9 m, texas roof 9.3 m, pilot
 *   house roof 11.6 m, stack crowns 19-19.8 m; beam over the guards ~9 m
 *   (not published; from the bow-on photos); wheel ~4 m across, ~6 m wide.
 * - Invented or simplified: the deck plans' rounded fronts, the cabins'
 *   window rhythm, the gingerbread (solid white railing bands and posts),
 *   the crest on the pilot house, the hull's lines below the water.
 *   The wheel is dark, as every photo shows, not red.
 */
import { Part, cross, len, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const TAU = Math.PI * 2

const white = new Part()   // the superstructure
const deck = new Part()    // deck tops, painted pale
const hull = new Part()    // hull, stacks, wheel: black
const gold = new Part()    // crowns, bands, crest
const glazing = new Part() // cabin windows

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
// Plans. The boat is drawn bow to +y, centred amidships; x across the beam.

/** A deck plan: straight sides, square stern, front corners rounded with radius r. */
function deckPlan(w: number, y0: number, y1: number, r: number, seg = 5): XY[] {
  const pts: XY[] = [[-w, y0], [w, y0]]
  for (let k = 0; k <= seg; k++) { const a = (k / seg) * (Math.PI / 2); pts.push([w - r + r * Math.cos(a), y1 - r + r * Math.sin(a)]) }
  for (let k = 0; k <= seg; k++) { const a = Math.PI / 2 + (k / seg) * (Math.PI / 2); pts.push([-w + r + r * Math.cos(a), y1 - r + r * Math.sin(a)]) }
  return pts
}
/** The hull's plan: parallel-sided, a square transom, a fine parabolic bow. */
function hullPlan(w: number, y0: number, yb: number, tip: number): XY[] {
  const side: XY[] = [[w, y0], [w, yb]]
  for (const t of [0.3, 0.55, 0.75, 0.9]) side.push([w * (1 - t * t), yb + (tip - yb) * t])
  return [...side, [0, tip], ...side.slice().reverse().map(([x, y]) => [-x, y] as XY)]
}
/** A slab between two heights over a plan, top and underside capped. */
function slab(p: Part, r: XY[], z0: number, z1: number, top: Part = p) {
  prism(p, r, z0, z1, top)
  const c = ccw(r)
  for (const [i, j, k] of triangulate(c)) tri(p, [c[i][0], c[i][1], z0], [c[k][0], c[k][1], z0], [c[j][0], c[j][1], z0], [[0, 0, -1], [0, 0, -1], [0, 0, -1]])
}
/** A thin band (railing, valance) along a plan's edge, set `inset` in from it; the stern edge is left open if `openAft`. */
function band(p: Part, r: XY[], z0: number, z1: number, inset: number, t = 0.08, openAft = false) {
  const o = grow(r, -inset), i = grow(r, -inset - t)
  for (let k = 0; k < o.length; k++) {
    const l = (k + 1) % o.length
    if (openAft && Math.abs(o[k][1] - o[l][1]) < 1e-6 && o[k][1] < 0 && Math.abs(o[k][0] - o[l][0]) > 1) continue
    const n = unit([o[l][1] - o[k][1], -(o[l][0] - o[k][0]), 0])
    quad(p, [o[k][0], o[k][1], z0], [o[l][0], o[l][1], z0], [o[l][0], o[l][1], z1], [o[k][0], o[k][1], z1], n)
    quad(p, [i[l][0], i[l][1], z0], [i[k][0], i[k][1], z0], [i[k][0], i[k][1], z1], [i[l][0], i[l][1], z1], [-n[0], -n[1], 0])
    quad(p, [o[k][0], o[k][1], z1], [o[l][0], o[l][1], z1], [i[l][0], i[l][1], z1], [i[k][0], i[k][1], z1], [0, 0, 1])
  }
}
/** Square posts round a plan's edge, about `pitch` apart, `inset` in from it. */
function posts(p: Part, r: XY[], z0: number, z1: number, inset: number, pitch: number, h = 0.1) {
  const o = grow(r, -inset)
  let per = 0
  const L = o.map((q, k) => { const n = o[(k + 1) % o.length]; return Math.hypot(n[0] - q[0], n[1] - q[1]) })
  const total = L.reduce((s, v) => s + v, 0), n = Math.round(total / pitch)
  for (let m = 0; m < n; m++) {
    let d = (m / n) * total, k = 0
    while (d > L[k]) { d -= L[k]; k++ }
    const a = o[k], b = o[(k + 1) % o.length], t = d / L[k]
    const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t
    if (y < Math.min(...o.map((q) => q[1])) + 0.3 && Math.abs(x) < Math.max(...o.map((q) => q[0])) - 0.3) continue // none across the stern
    box(p, x - h, x + h, y - h, y + h, z0, z1, 'bt')
    void per
  }
}
/** Window panels along the long sides (and front) of a rectangular cabin. */
function cabinWindows(x: number, y0: number, y1: number, z0: number, z1: number, w: number, pitch: number) {
  const n = Math.floor((y1 - y0) / pitch)
  for (const sg of [-1, 1]) {
    const f: Face = sg > 0 ? { o: [x, y0], u: [0, 1], n: [1, 0, 0] } : { o: [-x, y1], u: [0, -1], n: [-1, 0, 0] }
    for (let k = 0; k < n; k++) { const s = (k + 0.5) * ((y1 - y0) / n); panel(glazing, f, rectS(s - w / 2, s + w / 2, z0, z1), 0.04) }
  }
}

// ---------------------------------------------------------------------------
// Heights, from the side photos scaled on the 105 ft (32 m) hull.

const MAIN = 1.05, BOILER = 3.95, HURRICANE = 6.9, TEXAS = 9.3, PILOT = 11.6
const STERN = -15.0, BOW = 16.0

// Hull: dark below a white rubbing strake; draws 18 in, so it sits on the water.
const HULL = hullPlan(3.7, STERN, 8.5, BOW)
prism(hull, grow(HULL, -0.25), 0, 0.3)
const hl = grow(HULL, -0.25)
for (let k = 0; k < HULL.length; k++) {
  const l = (k + 1) % HULL.length, n = unit([HULL[l][1] - HULL[k][1], -(HULL[l][0] - HULL[k][0]), -0.6])
  quad(hull, [hl[k][0], hl[k][1], 0.3], [hl[l][0], hl[l][1], 0.3], [HULL[l][0], HULL[l][1], 0.75], [HULL[k][0], HULL[k][1], 0.75], n)
}
prism(hull, HULL, 0.75, 0.8)
// The main deck with its guards, the white strake its edge.
const MAIN_PLAN = hullPlan(4.3, STERN + 0.2, 9.0, BOW + 0.2)
slab(white, MAIN_PLAN, 0.8, MAIN, deck)

// The fantail: two dark timbers either side of the wheel, past the transom.
for (const sg of [-1, 1]) box(hull, sg * 3.4 - 0.2, sg * 3.4 + 0.2, STERN - 4.4, STERN + 0.5, 0.5, 1.4, '')

// Main deck: the closed engine room aft, the open deck forward with its
// boilers and stairs inside, posts and a white railing round the edge.
const ENGINE: XY[] = [[-4.1, STERN + 0.3], [4.1, STERN + 0.3], [4.1, -9.0], [-4.1, -9.0]]
prism(white, ENGINE, MAIN, BOILER - 0.05)
cabinWindows(4.1, STERN + 0.3, -9.0, 1.9, 2.8, 0.7, 1.6)
panel(glazing, { o: [-4.1, STERN + 0.3], u: [1, 0], n: [0, -1, 0] }, rectS(1.0, 2.2, 2.0, 2.9), 0.04)
panel(glazing, { o: [-4.1, STERN + 0.3], u: [1, 0], n: [0, -1, 0] }, rectS(6.0, 7.2, 2.0, 2.9), 0.04)
const CORE: XY[] = [[-2.5, -9.0], [2.5, -9.0], [2.5, 6.0], [-2.5, 6.0]]
prism(white, CORE, MAIN, BOILER - 0.05)
cabinWindows(2.5, -9.0, 6.0, MAIN + 0.35, BOILER - 0.35, 14.6, 15)
panel(glazing, { o: [2.5, 6.0], u: [-1, 0], n: [0, 1, 0] }, rectS(0.6, 4.4, 1.4, 3.3), 0.04)
const MAIN_RAIL = MAIN_PLAN.filter(([, y]) => y > -9.2).concat([[-4.3, -9.0], [4.3, -9.0]] as XY[])
band(white, hullPlan(4.3, -9.0, 9.0, BOW + 0.2), MAIN, MAIN + 0.9, 0.08, 0.1, true)
posts(white, hullPlan(4.3, -9.0, 9.0, BOW - 3.0), MAIN, BOILER, 0.2, 2.6)
void MAIN_RAIL

// Boiler deck: the saloon cabin, its gallery of posts, the gingerbread
// railing and the valance under the deck above.
const BOILER_PLAN = deckPlan(4.45, STERN - 0.2, 11.2, 3.2)
slab(white, BOILER_PLAN, BOILER - 0.05, BOILER + 0.2, deck)
const SALOON: XY[] = [[-3.0, STERN + 0.2], [3.0, STERN + 0.2], [3.0, 8.4], [-3.0, 8.4]]
prism(white, SALOON, BOILER + 0.2, HURRICANE - 0.05)
// Seen past the gallery posts the saloon reads dark, as it does in shade.
cabinWindows(3.0, STERN + 0.2, 8.4, BOILER + 0.35, HURRICANE - 0.4, 22.8, 23.2)
panel(glazing, { o: [3.0, 8.4], u: [-1, 0], n: [0, 1, 0] }, rectS(0.1, 5.9, BOILER + 0.35, HURRICANE - 0.4), 0.04)
band(white, BOILER_PLAN, BOILER + 0.2, BOILER + 1.0, 0.08, 0.1, true)
posts(white, BOILER_PLAN, BOILER + 0.2, HURRICANE - 0.1, 0.2, 2.0, 0.13)
// The stern bulkhead carries the name board above the wheel.
box(white, -4.45, 4.45, STERN - 0.25, STERN - 0.05, BOILER + 0.2, HURRICANE - 0.05, 'b')
panel(glazing, { o: [4.45, STERN - 0.25], u: [-1, 0], n: [0, -1, 0] }, rectS(2.2, 3.6, BOILER + 1.9, BOILER + 2.6), 0.04)
panel(glazing, { o: [4.45, STERN - 0.25], u: [-1, 0], n: [0, -1, 0] }, rectS(5.3, 6.7, BOILER + 1.9, BOILER + 2.6), 0.04)

// Hurricane deck: its railing, gold-edged as in the photos.
const HURR_PLAN = deckPlan(4.6, STERN - 0.3, 11.4, 3.3)
slab(white, HURR_PLAN, HURRICANE - 0.25, HURRICANE, deck)
band(white, grow(HURR_PLAN, 0.03), HURRICANE - 0.5, HURRICANE - 0.25, 0, 0.06)
prism(gold, grow(HURR_PLAN, 0.02), HURRICANE - 0.25, HURRICANE - 0.12)
band(white, HURR_PLAN, HURRICANE, HURRICANE + 0.75, 0.1, 0.08)
prism(gold, grow(BOILER_PLAN, 0.02), BOILER - 0.05, BOILER + 0.07)

// Texas cabin, and the pilot house on its fore end.
const TX: XY[] = [[-2.3, -7.0], [2.3, -7.0], [2.3, 5.6], [-2.3, 5.6]]
prism(white, TX, HURRICANE, TEXAS - 0.2)
cabinWindows(2.3, -7.0, 5.6, HURRICANE + 0.7, TEXAS - 0.8, 0.8, 1.6)
slab(white, [[-2.75, -7.4], [2.75, -7.4], [2.75, 6.0], [-2.75, 6.0]], TEXAS - 0.2, TEXAS, deck)
prism(gold, [[-2.77, -7.42], [2.77, -7.42], [2.77, 6.02], [-2.77, 6.02]], TEXAS - 0.2, TEXAS - 0.08)
const PH: XY[] = [[-1.45, 2.3], [1.45, 2.3], [1.45, 5.2], [-1.45, 5.2]]
prism(white, PH, TEXAS, PILOT - 0.2)
{
  // windows all round, the pilot's lookout
  const faces: Face[] = [
    { o: [1.45, 5.2], u: [-1, 0], n: [0, 1, 0] }, { o: [-1.45, 2.3], u: [1, 0], n: [0, -1, 0] },
    { o: [1.45, 2.3], u: [0, 1], n: [1, 0, 0] }, { o: [-1.45, 5.2], u: [0, -1], n: [-1, 0, 0] },
  ]
  for (const f of faces) for (const s of [0.5, 1.45, 2.4]) panel(glazing, f, rectS(s - 0.38, s + 0.38, TEXAS + 0.8, PILOT - 0.45), 0.04)
}
slab(white, [[-1.85, 1.9], [1.85, 1.9], [1.85, 5.6], [-1.85, 5.6]], PILOT - 0.2, PILOT, deck)
// The pilot house's crest: a gilded crown of scrolls, drawn as a stepped band.
{
  const c: XY[] = [[-1.7, 2.05], [1.7, 2.05], [1.7, 5.45], [-1.7, 5.45]]
  band(gold, c, PILOT, PILOT + 0.35, 0, 0.12)
  for (const [x, y] of c) box(gold, x - 0.14, x + 0.14, y - 0.14, y + 0.14, PILOT, PILOT + 0.85, 'b')
  extrudeY(gold, [[-0.9, PILOT + 0.3], [0.9, PILOT + 0.3], [0, PILOT + 0.95]], 5.33, 5.47)
  box(white, -0.25, 0.25, 3.5, 4.0, PILOT, PILOT + 0.6, 'b')
}

// The twin stacks, side by side ahead of the pilot house: black with gold
// bands, flared gold collars and feathered crowns, the gilt spreader between.
const STACK_Y = 7.2, STACK_X = 1.9, STACK_TOP = 19.0
for (const sg of [-1, 1]) {
  const x = sg * STACK_X, r = 0.45
  lathe(hull, x, STACK_Y, [[r + 0.25, HURRICANE], [r + 0.1, HURRICANE + 0.4], [r, HURRICANE + 0.6], [r, STACK_TOP - 1.0]], 12)
  for (const z of [12.0, 15.0]) lathe(gold, x, STACK_Y, [[r + 0.01, z], [r + 0.06, z + 0.05], [r + 0.06, z + 0.3], [r + 0.01, z + 0.35]], 12)
  lathe(gold, x, STACK_Y, [[r, STACK_TOP - 1.0], [r + 0.12, STACK_TOP - 0.7], [r + 0.08, STACK_TOP - 0.45], [r + 0.38, STACK_TOP - 0.05], [r + 0.38, STACK_TOP + 0.05], [0, STACK_TOP + 0.05]], 12)
  for (let k = 0; k < 7; k++) {
    const a = (k / 7) * TAU, px = x + (r + 0.3) * Math.cos(a), py = STACK_Y + (r + 0.3) * Math.sin(a)
    lathe(gold, px, py, [[0.13, STACK_TOP], [0, STACK_TOP + 0.75]], 4)
  }
  lathe(gold, x, STACK_Y, [[0.2, STACK_TOP], [0, STACK_TOP + 0.6]], 6)
}
box(gold, -STACK_X + 0.4, STACK_X - 0.4, STACK_Y - 0.07, STACK_Y + 0.07, 16.4, 16.65, 'b')
lathe(gold, 0, STACK_Y, [[0, 16.1], [0.3, 16.35], [0.3, 16.7], [0, 16.95]], 6)

// The jackstaff mast at the hurricane deck's fore end, and the stage boom
// swung up over the bow.
box(white, -0.12, 0.12, 10.6, 10.84, HURRICANE, 13.2, 'b')
{
  const a: V3 = [0, 11.0, MAIN + 1.2], b: V3 = [0, 17.6, 7.4], w = 0.13
  const d = unit([b[0] - a[0], b[1] - a[1], b[2] - a[2]]), s = unit(cross(d, [1, 0, 0]))
  const ring = (c: V3): V3[] => [add(add(c, [w, 0, 0]), s, w), add(add(c, [-w, 0, 0]), s, w), add(add(c, [-w, 0, 0]), s, -w), add(add(c, [w, 0, 0]), s, -w)]
  const A = ring(a), B = ring(b)
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4, m: V3 = unit(add(add(A[k], A[l]), [-2 * a[0], -2 * a[1], -2 * a[2]]))
    quad(white, A[k], A[l], B[l], B[k], m)
  }
}

// ---------------------------------------------------------------------------
// The stern wheel: its own node about the axle, so it can turn later. A
// faceted drum of buckets between two rims.

const AXLE: V3 = [0, STERN - 2.2, 1.9]
const wheel = new Part()
{
  const R = 2.0, W = 2.9, n = 14
  for (let k = 0; k < n; k++) {
    const a0 = (k / n) * TAU, a1 = ((k + 1) / n) * TAU
    // the bucket band, stepped: every other facet stands proud like a paddle
    const r = k % 2 ? R : R + 0.18
    const p = (a: number, rr: number, x: number): V3 => [x, rr * Math.cos(a), rr * Math.sin(a)]
    const nm: V3 = [0, Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2)]
    quad(wheel, p(a0, r, -W), p(a1, r, -W), p(a1, r, W), p(a0, r, W), nm)
    for (const x of [-W, W]) {
      const nx: V3 = [Math.sign(x), 0, 0]
      quad(wheel, p(a0, 0.3, x), p(a1, 0.3, x), p(a1, r, x), p(a0, r, x), nx)
    }
    // the radial steps between a paddle and its neighbours
    const ra = R, rb = R + 0.18
    const t: V3 = [0, -Math.sin(a1), Math.cos(a1)]
    quad(wheel, p(a1, ra, -W), p(a1, rb, -W), p(a1, rb, W), p(a1, ra, W), k % 2 ? [-t[0], -t[1], -t[2]] : t)
  }
  // rims standing out at the ends
  for (const x of [-W - 0.15, W]) box(wheel, x, x + 0.15, -R - 0.25, R + 0.25, -0.18, 0.18, '')
  for (const x of [-W - 0.15, W]) box(wheel, x, x + 0.15, -0.18, 0.18, -R - 0.25, R + 0.25, '')
}

// ---------------------------------------------------------------------------

// White and gold are the boat's identity; the black of the hull, stacks and
// wheel is kept dark, at charcoal, as it reads in every photo.
const BLACK = finish('mark-twain-black', 0x4a4f57)
const parts = [
  { part: white, material: PALETTE.trim },
  { part: deck, material: PALETTE.stone }, // painted decks read pale from above
  { part: hull, material: BLACK },
  { part: gold, material: finish('mark-twain-gold', 0xd6b25e) },
  { part: glazing, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0) + wheel.triangles
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Mark Twain Riverboat', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 180, elevation: 0,
}, { nodes: [{ name: 'stern-wheel', parts: [{ part: wheel, material: BLACK }], translation: AXLE }] })
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/dlr-mark-twain.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
