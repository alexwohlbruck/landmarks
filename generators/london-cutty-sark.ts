/**
 * Cutty Sark, Greenwich — original procedural geometry, CC0-1.0.
 * bun generators/london-cutty-sark.ts
 *
 * Writes two levels of detail in one frame:
 *   models/london-cutty-sark.glb (low): the black hull above the canopy with
 *     its gilt line and bow and quarter carving, the white figurehead
 *     (Nannie), deck, deckhouses and poop, the three masts with tops,
 *     crosstrees and every yard as a real tapered spar (braced 35°), the
 *     bowsprit and jib-boom, the standing rigging at half density as bold
 *     thin members (lower and topmast shrouds, topgallant shrouds, two
 *     backstays a side per mast, the fore-and-aft stays, bobstay and
 *     martingale), and the dry-dock canopy: glazed wall, sloping glass roof
 *     meeting the hull, white frame ribs and purlin.
 *   models/london-cutty-sark.detail.glb (detailZoom 17): the same with
 *     rounder spars, the full shroud count, futtock shrouds, a third
 *     backstay, inner and flying jib stays, braces and lifts to every yard,
 *     bowsprit shrouds, furled sails omitted, the canopy roof's triangulated
 *     frame, finer hull and figurehead.
 *
 * Frame: +y to the bow (bearing 343.5, the keel line of OSM way/25608663),
 * +x to starboard, z up, metres. Origin: area centroid of the hull outline
 * way/25608663 (-0.0095754, 51.4828451), on the street around the canopy
 * (y = 0; the street is level, 2.3 m above the box's ground_min). elevation 0.
 *
 * Evidence
 * - OSM (measured, read in this frame): hull at the rail way/25608663
 *   (building=ship, wikidata Q171255), 67.3 m stem to taffrail, beam 9.8 m
 *   at the rail; the canopy way/969672514 (surface=glass), a stadium
 *   20.8 x 88.8 m with semicircular ends, on the same centroid. Both are
 *   symmetric about the keel to ±0.4 m and are mirrored here.
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (via the batch's ealidar.py; composite of flights ~2010s-2022):
 *   street 2.3 m above ground_min; canopy rim 5.8 (3.5 above the street),
 *   rising to 7.3 (5.0 above the street) where it meets the hull and over
 *   the forward and after ends. The hull deck reads only 5.4 m above the
 *   street in the composite, which contradicts every photo (3.5-5 m of
 *   black hull show above the glass); the flight may predate the 2012
 *   re-erection or the returns may be mixed, so the hull height is taken
 *   from the photos instead (see Doubts). Masts and rigging are too thin to
 *   register.
 * - Published: length overall 85.3 m, hull 64.7 m, mainmast 46.3 m
 *   (Wikipedia "Cutty Sark"; Royal Museums Greenwich); 2012 restoration:
 *   hull raised 3 m in the dry dock under a glass and steel canopy
 *   (Grimshaw). The main truck is placed at 46.3 m above the street (the
 *   keel is near street level).
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "The Cutty Sark -2.jpg", Donnchadh H, CC BY 2.0 — broadside from the
 *     west: mast positions (fore 0.39, main 0.65, mizzen 0.83 of the hull
 *     from the stem), yard heights, mast heights relative to the hull,
 *     jib-boom length and rise, the canopy;
 *   "The Cutty Sark, Greenwich - geograph.org.uk - 3150174.jpg",
 *     PAUL FARMER, CC BY-SA 2.0 — bow quarter from the west-north-west:
 *     bowsprit rake, figurehead, gilt bow scroll, canopy wall (~3 m) and
 *     its sloping roof, braced yards;
 *   "The Cutty Sark -1.jpg", Donnchadh H, CC BY 2.0 — night: lit canopy
 *     wall, floodlit masts and rigging;
 *   "Helicopter Trip views 24th August 2022 - 06.jpg", Brian Adamson,
 *     CC BY 2.0 — from the air: the canopy's white rim and glass, the deck
 *     and deckhouses, the yards braced across the hull;
 *   "London MMB »0A5 River Thames and Cutty Sark.jpg", mattbuck, CC BY-SA
 *     4.0 — from across the river (north);
 *   "Cutty Sark 26-06-2012 (7471551668).jpg", "... (7471554106).jpg",
 *     Karen Roe, CC BY 2.0 — the figurehead (white, arm outstretched), the
 *     white bowsprit, gilt scrollwork, the canopy glass below;
 *   "Cutty Sark stern.jpg", Cmglee, CC BY-SA 3.0 — the Muntz metal (gold)
 *     lower hull under the canopy (not modelled: it is under the glass);
 *   "Cutty Sark Greenwich - panoramio.jpg", Lobster1, CC BY-SA 3.0 — from
 *     King William Walk (south);
 *   "Cutty Sark at night from King William Walk, Greenwich 01.jpg",
 *     Acabashi, CC BY-SA 4.0 — the masts floodlit white at night;
 *   "The Cutty Sark, Greenwich - geograph.org.uk - 3448033.jpg", S.C.C.
 *     Bate, CC BY-SA 2.0; "The Cutty Sark at Greenwich - geograph.org.uk -
 *     3516966.jpg", Steve Daniels, CC BY-SA 2.0 — the rigging from below;
 *   "Cutty Sark rigging 17RM0464.jpg", Ermell, CC BY-SA 4.0 — the tops.
 *   No look-only sources were used.
 *
 * Estimated from the photos (scaled to the OSM hull length and the lidar
 * canopy): rail 9.0 m above the street amidships, 10.5 at the bow, 9.7 at
 * the stern (sheer); deck 1 m below the rail; the gilt line 1.75-2.05 m under
 * the rail; mast stations y = 9.0, -8.3, -21.0; trucks 44.6 / 46.3 / 35.8;
 * tops at 22.0 / 22.4 / 18.8 and crosstrees at 31.2 / 31.8 / 26.2; yard
 * heights (main: 18.8, 24.4, 27.7, 33.0, 37.0, 40.6); yard lengths (main
 * course 23.8 m after the published spar plan, the rest scaled down); the
 * bowsprit/jib-boom 22 m beyond the stem at 23° (overall length 85.3 m);
 * deckhouse sizes; the figurehead's pose, drawn ~1.3x life size so she reads.
 * Invented/simplified: running rigging (low model), sails (none are bent),
 * flags and bunting, ratlines, boats, the entrance pavilion beside the
 * ship (way/384767800, not replaced) and its bridge.
 *
 * Doubts: the hull's height above the glass (photos and lidar disagree, see
 * above; taken from the photos); the yard bracing angle (35°, starboard
 * yardarms forward, from two photos); the canopy is opaque `glass` (its
 * glazing reads silvery from outside), so the gold lower hull under it is
 * not drawn.
 *
 * Night: the canopy's glazed wall is `window` (lit from inside, photo);
 * masts and white paint carry `_FLOODLIGHT` (floodlit white, photo), the
 * hull a little and the gilt.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'

// ---------------------------------------------------------------------------
// Small geometry kit (map frame: x east-ish, y along the model's north, z up).
// Every face is emitted with an explicit normal, so Part.tri winds it to face
// that way: nothing here depends on vertex order.

type XY = [number, number]
const norm = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const sb = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const ad = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sc = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const UP: V3 = [0, 0, 1], DN: V3 = [0, 0, -1]

/** A flat convex polygon facing n. */
function poly(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n])
}
/** A flat polygon whose normal is chosen to agree with `dir`. */
function polyDir(p: Part, pts: V3[], dir: V3) {
  let n = norm(crs(sb(pts[1], pts[0]), sb(pts[2], pts[0])))
  if (Math.hypot(...n) < 0.5 && pts.length > 3) n = norm(crs(sb(pts[2], pts[0]), sb(pts[3], pts[0])))
  if (dot(n, dir) < 0) n = sc(n, -1)
  poly(p, pts, n)
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
const ccw = (ring: XY[]) => { let a = 0; for (let i = 0; i < ring.length; i++) { const p = ring[i], q = ring[(i + 1) % ring.length]; a += p[0] * q[1] - q[0] * p[1] } return a > 0 ? ring : [...ring].reverse() }
function cap(p: Part, ring: XY[], z: number, up: boolean) {
  for (const [a, b, c] of triangulate(ring)) poly(p, [[...ring[a], z], [...ring[b], z], [...ring[c], z]], up ? UP : DN)
}
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
/** Vertical walls of a CCW ring between z0 and z1, facing out (or in). */
function walls(p: Part, ring: XY[], z0: number, z1: number, inward = false) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], o = outN(a, b), s = inward ? -1 : 1
    poly(p, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], [s * o[0], s * o[1], 0])
  }
}
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

/** A surface of revolution through (r, z) profile points (smooth within a band). */
function lathe(p: Part, cx: number, cy: number, prof: [number, number][], seg: number, ph = 0, a0 = 0, a1 = 2 * Math.PI, smooth = false) {
  if (!smooth && prof.length > 2) {
    for (let k = 0; k < prof.length - 1; k++) lathe(p, cx, cy, [prof[k], prof[k + 1]], seg, ph, a0, a1, true)
    return
  }
  const pn = prof.map((_, k) => {
    const a = prof[Math.max(0, k - 1)], b = prof[Math.min(prof.length - 1, k + 1)]
    const dr = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dr, dz) || 1
    return [dz / l, -dr / l] as XY
  })
  const angs = Array.from({ length: seg + 1 }, (_, i) => a0 + ph + ((a1 - a0) * i) / seg)
  for (let i = 0; i < seg; i++) {
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
/** A smooth round column shaft. */
function cyl(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, seg: number, top = false, ph = 0) {
  lathe(p, cx, cy, [[r, z0], [r, z1]], seg, ph)
  if (top) cap(p, circle(cx, cy, r, seg, ph), z1, true)
}
/** An ellipsoid, smooth. */
function ellipsoid(p: Part, cx: number, cy: number, cz: number, rx: number, rz: number, seg: number, rows: number) {
  const prof: [number, number][] = []
  for (let k = 0; k <= rows; k++) { const t = -Math.PI / 2 + (Math.PI * k) / rows; prof.push([rx * Math.cos(t), cz + rz * Math.sin(t)]) }
  prof[0][0] = 0; prof[rows][0] = 0
  lathe(p, cx, cy, prof, seg, 0, 0, 2 * Math.PI, true)
}
/**
 * A straight member from a to b: an n-sided prism of radius r0 at a and r1
 * at b (smooth sides when n > 4), with optional end caps.
 */
function rod(p: Part, a: V3, b: V3, r0: number, r1 = r0, n = 4, caps = false, ph = Math.PI / 4, smooth = n > 4) {
  const ax = norm(sb(b, a))
  const ref: V3 = Math.abs(ax[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const u = norm(crs(ax, ref)), v = crs(ax, u)
  const dirs = Array.from({ length: n }, (_, i) => { const t = ph + (2 * Math.PI * i) / n; return ad(sc(u, Math.cos(t)), sc(v, Math.sin(t))) })
  const A = dirs.map((d) => ad(a, sc(d, r0))), B = dirs.map((d) => ad(b, sc(d, r1)))
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    if (smooth) p.tri(A[i], A[j], B[j], undefined, undefined, undefined, [dirs[i], dirs[j], dirs[j]]), p.tri(A[i], B[j], B[i], undefined, undefined, undefined, [dirs[i], dirs[j], dirs[i]])
    else polyDir(p, [A[i], A[j], B[j], B[i]], ad(dirs[i], dirs[j]))
  }
  if (caps) { polyDir(p, [...A].reverse(), sc(ax, -1)); polyDir(p, B, ax) }
}
/** A sphere, smooth. */
const sphere = (p: Part, c: V3, r: number, seg = 8, rows = 5) => ellipsoid(p, c[0], c[1], c[2], r, r, seg, rows)
/** An ellipsoid along an arbitrary axis from a to b, of radius r (smooth). */
function spindle(p: Part, a: V3, b: V3, r: number, seg = 8, rows = 6, rB = r) {
  const ax = norm(sb(b, a)), L = Math.hypot(...sb(b, a))
  const ref: V3 = Math.abs(ax[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const u = norm(crs(ax, ref)), v = crs(ax, u)
  const ring = (k: number) => {
    const t = -Math.PI / 2 + (Math.PI * k) / rows, rr = Math.cos(t) * r, h = (Math.sin(t) + 1) / 2
    return Array.from({ length: seg }, (_, i) => {
      const th = (2 * Math.PI * i) / seg, d = ad(sc(u, Math.cos(th)), sc(v, Math.sin(th) * (rB / r)))
      const pos = ad(ad(a, sc(ax, h * L)), sc(d, rr))
      const nn = norm(ad(sc(d, Math.cos(t)), sc(ax, Math.sin(t) * (r / (L / 2)))))
      return [pos, nn] as [V3, V3]
    })
  }
  const rings = Array.from({ length: rows + 1 }, (_, k) => ring(k))
  for (let k = 0; k < rows; k++) for (let i = 0; i < seg; i++) {
    const j = (i + 1) % seg, A = rings[k][i], B = rings[k][j], C = rings[k + 1][j], D = rings[k + 1][i]
    if (k > 0) p.tri(A[0], B[0], C[0], undefined, undefined, undefined, [A[1], B[1], C[1]])
    if (k < rows - 1) p.tri(A[0], C[0], D[0], undefined, undefined, undefined, [A[1], C[1], D[1]])
  }
}

// ---------------------------------------------------------------------------
// Frame: bearing 343.5 (the keel line, bow to the north-north-west), +y to
// the bow, +x to starboard, z up from the street around the canopy.

const ID = 'london-cutty-sark'
const BEARING = 343.5
const ANCHOR = { lng: -0.0095754, lat: 51.4828451 }

// OSM way/25608663 (the hull at the rail) in this frame, starboard half
// (x > 0), stern to bow; the port half mirrors it (OSM is symmetric to ±0.4 m).
const HULL_STBD: XY[] = [
  [0, -32.2], [2.0, -31.3], [3.3, -29.8], [3.9, -26.6], [4.3, -16.1], [4.9, -1.6], [4.9, 21.3], [4.0, 27.4], [2.5, 32.0], [0.9, 34.6], [0, 35.1],
]
const STERN = -32.2, BOW = 35.1
/** Half-beam at the rail at station y (OSM, mirrored mean of both sides). */
function hb(y: number): number {
  if (y <= STERN || y >= BOW) return 0
  for (let i = 0; i < HULL_STBD.length - 1; i++) {
    const [x0, y0] = HULL_STBD[i], [x1, y1] = HULL_STBD[i + 1]
    if (y >= y0 && y <= y1) return x0 + ((x1 - x0) * (y - y0)) / (y1 - y0)
  }
  return 0
}
// The canopy, OSM way/969672514 (mirrored mean): a stadium 20.8 x 88.8 m.
const CAN_HALF_W = 10.3, CAN_HALF_L = 44.4, CAN_R = 10.3

// Heights (see header): street 0; canopy rim 3.4 (lidar 3.5); the glass
// meets the hull at 4.9 (lidar 5.0); hull from 4.4 (hidden under the glass)
// to the rail; rail 8.6 amidships rising to 10.0 at the bow and 9.3 at the
// stern; deck 1.0 below the rail.
const CAN_RIM = 3.4, CAN_TOP = 4.9, HULL_LOW = 4.4
function rail(y: number) {
  const c = -2
  return y > c ? 9.0 + 1.5 * ((y - c) / (BOW - c)) ** 2 : 9.0 + 0.7 * ((c - y) / (c - STERN)) ** 2
}
const deck = (y: number) => rail(y) - 1.0

/** Hull surface point on side s (+1 starboard, -1 port) at station y and height z. */
function hullPt(s: number, y: number, z: number, out = 0): V3 {
  const zr = rail(y), t = Math.max(0, Math.min(1, (z - HULL_LOW) / (zr - HULL_LOW)))
  // flare: the sides tuck in toward the waterline, more at the ends
  const fine = Math.max(0, Math.abs(y + 2) / 33)
  const k = 1 - (1 - t) * (0.06 + 0.22 * fine * fine)
  // stem rake and stern counter: lower points drawn in toward midships
  const wb = Math.max(0, (y - 27) / 8.1), ws = Math.max(0, (-24 - y) / 8.2)
  const yy = y - (zr - z) * 0.45 * wb + (zr - z) * 0.55 * ws
  return [s * (hb(y) * k + out), yy, z]
}

type Mat = { part: Part; material: MaterialSpec }

function build(D: boolean): Mat[] {
  const hull = new Part(), gilt = new Part(), white = new Part(), wood = new Part(), glass = new Part(), wall = new Part()
  const black = hull

  // --- hull -----------------------------------------------------------------
  const ST: number[] = []
  const NS = D ? 44 : 26
  for (let i = 0; i <= NS; i++) {
    const t = i / NS
    // denser near the ends, where the plan curves
    const u = 0.5 - 0.5 * Math.cos(Math.PI * t)
    ST.push(STERN + 0.05 + (BOW - STERN - 0.1) * (0.6 * u + 0.4 * t))
  }
  const LV = D ? [0, 0.18, 0.4, 0.62, 0.82, 1] : [0, 0.3, 0.65, 1]
  for (const s of [-1, 1]) {
    for (let i = 0; i < ST.length - 1; i++) {
      const y0 = ST[i], y1 = ST[i + 1]
      for (let k = 0; k < LV.length - 1; k++) {
        const z = (y: number, f: number) => HULL_LOW + (rail(y) - HULL_LOW) * f
        const a = hullPt(s, y0, z(y0, LV[k])), b = hullPt(s, y1, z(y1, LV[k])), c = hullPt(s, y1, z(y1, LV[k + 1])), d = hullPt(s, y0, z(y0, LV[k + 1]))
        polyDir(hull, [a, b, c, d], [s, 0, 0])
      }
      // rail cap and the inner face of the bulwark down to the deck
      const r0 = hullPt(s, y0, rail(y0)), r1 = hullPt(s, y1, rail(y1))
      const i0: V3 = [r0[0] - s * 0.3, r0[1], r0[2]], i1: V3 = [r1[0] - s * 0.3, r1[1], r1[2]]
      if (Math.abs(r0[0]) > 0.35 && Math.abs(r1[0]) > 0.35) {
        polyDir(wood, [r0, r1, i1, i0], UP)
        const d0: V3 = [i0[0], i0[1], deck(y0)], d1: V3 = [i1[0], i1[1], deck(y1)]
        polyDir(hull, [i0, i1, d1, d0], [-s, 0, 0])
      }
    }
  }
  // the deck
  for (let i = 0; i < ST.length - 1; i++) {
    const y0 = ST[i], y1 = ST[i + 1]
    const w0 = Math.max(0, hullPt(1, y0, rail(y0))[0] - 0.3), w1 = Math.max(0, hullPt(1, y1, rail(y1))[0] - 0.3)
    polyDir(wood, [[-w0, y0, deck(y0)], [w0, y0, deck(y0)], [w1, y1, deck(y1)], [-w1, y1, deck(y1)]], UP)
  }
  // the stern's flat transom face above the counter and the bow's closing sliver
  // are covered by the converging stations (hb -> 0 at both ends).

  // gilt line: a bold band along each side 1.9 m under the rail, and the
  // carved scrollwork at the bow and the stern (flat panels on the hull)
  const band = (s: number, y0: number, y1: number, dz0: number, dz1: number, part: Part, n: number, off = 0.05) => {
    for (let i = 0; i < n; i++) {
      const ya = y0 + ((y1 - y0) * i) / n, yb = y0 + ((y1 - y0) * (i + 1)) / n
      const a = hullPt(s, ya, rail(ya) - dz0, off), b = hullPt(s, yb, rail(yb) - dz0, off)
      const c = hullPt(s, yb, rail(yb) - dz1, off), d = hullPt(s, ya, rail(ya) - dz1, off)
      polyDir(part, [a, b, c, d], [s, 0, 0])
    }
  }
  for (const s of [-1, 1]) {
    band(s, -30.5, 33.2, 1.75, 2.05, gilt, D ? 30 : 16)
    // the bow carving: a long scroll panel tapering forward along the head rails
    for (let i = 0; i < (D ? 8 : 4); i++) {
      const n = D ? 8 : 4, ya = 26 + (8.6 * i) / n, yb = 26 + (8.6 * (i + 1)) / n
      const h0 = 0.25 + 0.9 * (i / n), h1 = 0.25 + 0.9 * ((i + 1) / n)
      const a = hullPt(s, ya, rail(ya) - 0.35, 0.06), b = hullPt(s, yb, rail(yb) - 0.35, 0.06)
      const c = hullPt(s, yb, rail(yb) - 0.35 - h1, 0.06), d = hullPt(s, ya, rail(ya) - 0.35 - h0, 0.06)
      polyDir(gilt, [a, b, c, d], [s, 0.3, 0])
    }
    // stern quarter carving
    band(s, -31.6, -27.0, 0.3, 1.1, gilt, D ? 4 : 2, 0.06)
  }

  // --- deck fittings: forward and after deckhouses, the poop and skylights
  const house = (y0: number, y1: number, hw: number, h: number) => {
    const z0 = deck((y0 + y1) / 2) - 0.1
    box(white, -hw, hw, y0, y1, z0, z0 + h, 0.25, false, wood)
  }
  house(1.5, 7.5, 2.4, 2.1) // forward house, abaft the foremast
  house(-17.0, -10.5, 2.4, 2.1) // after house, abaft the mainmast
  // poop deck: raised 0.9 m from the mizzen aft
  {
    const ring: XY[] = []
    for (let i = 0; i <= 8; i++) { const y = -25 - (6.0 * i) / 8; ring.push([hullPt(1, y, rail(y))[0] - 0.35, y]) }
    const full = ccw([...ring, ...[...ring].reverse().map(([x, y]) => [-x, y] as XY)])
    prism(wood, full, deck(-27), deck(-27) + 0.9)
    box(white, -1.2, 1.2, -28.5, -26.0, deck(-27) + 0.9, deck(-27) + 1.7, 0.2, false, wood) // saloon skylight
  }
  box(white, -0.9, 0.9, 30.0, 32.0, deck(31), deck(31) + 0.8, 0.2, false, wood) // windlass / fo'c'sle

  // --- bowsprit and jib-boom: white bowsprit, varnished jib-boom ------------
  const stemHead: V3 = [0, BOW - 0.6, rail(BOW) - 0.2]
  const dir = norm([0, Math.cos(0.4), Math.sin(0.4)])
  const at = (l: number): V3 => ad(stemHead, sc(dir, l))
  rod(white, ad(stemHead, sc(dir, -3)), at(9), 0.42, 0.34, D ? 10 : 6, true)
  rod(wood, at(7.5), at(22.0), 0.24, 0.12, D ? 8 : 5, true)
  const tip = at(22.0)
  // dolphin striker under the bowsprit end
  const dsTop = at(8.6), dsBot: V3 = [dsTop[0], dsTop[1] - 0.6, dsTop[2] - 3.2]
  rod(black, dsTop, dsBot, 0.09, 0.07, 4)

  // --- figurehead: Nannie, leaning out under the bowsprit, her left arm
  //     reaching forward (she clutches the grey mare's tail) -------------------
  {
    const base: V3 = [0, BOW + 0.3, rail(BOW) - 2.0]
    const F = 1.3 // drawn a little over life size so she reads
    const lean = norm([0, 0.62, 0.78]) // torso axis, leaning forward
    const hip = base, chest = ad(base, sc(lean, 1.25 * F)), head = ad(base, sc(lean, 1.85 * F))
    spindle(white, ad(hip, sc(lean, -0.8 * F)), chest, 0.42 * F, D ? 10 : 7, D ? 7 : 5, 0.34) // draped body
    spindle(white, chest, ad(chest, sc(lean, 0.42 * F)), 0.36 * F, D ? 10 : 7, D ? 6 : 4, 0.3) // shoulders
    sphere(white, ad(head, [0, 0.05, 0.05]), 0.27 * F, D ? 10 : 7, D ? 6 : 4)
    // hair falling down her back
    spindle(white, ad(head, [0, -0.15, 0.05]), ad(head, [0, -0.35, -0.55]), 0.2, 6, 4)
    // the outstretched arm with its hand
    const sh: V3 = ad(chest, [-0.35, 0.1, 0.3]), hand: V3 = ad(sh, [-0.2, 1.6, 0.7])
    rod(white, sh, hand, 0.16, 0.12, D ? 8 : 5, true)
    sphere(white, hand, 0.2, 6, 4)
    // the other arm, down at her side
    rod(white, ad(chest, [0.32, 0.0, 0.15]), ad(chest, [0.42, 0.25, -0.75]), 0.12, 0.1, D ? 8 : 5, true)
    // trail-board knee carrying her, gilt
    rod(gilt, ad(hip, [0, -1.2, -0.9]), ad(hip, [0, 0.1, 0.1]), 0.28, 0.22, 4, true)
  }

  // --- masts, tops, yards ----------------------------------------------------
  type Mast = { y: number; truck: number; top: number; cross: number; tgHead: number; yards: [number, number][] }
  // [height, length] of each yard, course first (heights: photos scaled to the
  // hull; lengths: published spar plan where known, the rest estimated)
  const MASTS: Mast[] = [
    { y: 9.0, truck: 44.6, top: 22.0, cross: 31.2, tgHead: 39.0, yards: [[18.5, 22.4], [23.9, 20.0], [27.2, 17.4], [32.1, 13.6], [36.3, 10.2]] },
    { y: -8.3, truck: 46.3, top: 22.4, cross: 31.8, tgHead: 40.2, yards: [[18.8, 23.8], [24.4, 21.2], [27.7, 18.6], [33.0, 14.6], [37.0, 11.2], [40.6, 7.6]] },
    { y: -21.0, truck: 35.8, top: 18.8, cross: 26.2, tgHead: 31.6, yards: [[17.0, 17.6], [20.9, 15.2], [23.6, 13.2], [27.6, 10.6], [30.8, 8.2]] },
  ]
  const MSEG = D ? 10 : 6
  // the yards are braced round, starboard yardarms forward (photos)
  const BR = (35 * Math.PI) / 180
  const yardC = (m: Mast, z: number): V3 => [0.55 * -Math.sin(BR), m.y + 0.55 * Math.cos(BR), z]
  const yardEnd = (m: Mast, z: number, d: number, s: number): V3 => { const c = yardC(m, z); return [c[0] + s * d * Math.cos(BR), c[1] + s * d * Math.sin(BR), z] }
  for (const m of MASTS) {
    const z0 = deck(m.y) - 0.2
    // lower mast (white), topmast (varnished), topgallant/royal pole (varnished)
    rod(white, [0, m.y, z0], [0, m.y, m.top + 1.4], 0.45, 0.4, MSEG)
    rod(wood, [0, m.y + 0.0, m.top - 1.2], [0, m.y, m.cross + 1.0], 0.3, 0.24, MSEG, true)
    rod(white, [0, m.y, m.cross - 1.0], [0, m.y, m.truck], 0.2, 0.11, D ? 8 : 5, true)
    if (D) sphere(white, [0, m.y, m.truck + 0.1], 0.22, 6, 3) // the truck
    // the top: a black platform round the lower masthead
    box(black, -2.1, 2.1, m.y - 1.7, m.y + 1.2, m.top - 0.35, m.top, 0.3, true)
    // crosstrees
    box(black, -1.6, 1.6, m.y - 0.25, m.y + 0.25, m.cross - 0.25, m.cross, 0, true)
    if (D) box(black, -0.25, 0.25, m.y - 1.3, m.y + 1.0, m.cross - 0.25, m.cross, 0, true)
    // yards: black, tapering to the yardarms, slung just forward of the mast
    m.yards.forEach(([z, L], k) => {
      const r = k === 0 ? 0.3 : k < 3 ? 0.25 : 0.19
      const c = yardC(m, z), e = yardEnd(m, z, L / 2, 1), w = yardEnd(m, z, L / 2, -1)
      rod(black, c, e, r, r * 0.5, D ? 6 : 4, true)
      rod(black, c, w, r, r * 0.5, D ? 6 : 4, true)
    })
  }
  // spanker gaff and boom on the mizzen
  {
    const m = MASTS[2], zb = deck(m.y) + 1.6
    rod(wood, [0, m.y - 0.4, zb], [0, -34.0, zb + 0.6], 0.17, 0.11, D ? 6 : 4, true)
    rod(wood, [0, m.y - 0.4, 14.5], [0, -30.0, 17.3], 0.15, 0.1, D ? 6 : 4, true)
  }

  // --- standing rigging: shrouds, backstays and stays, as thin black members
  //     drawn thicker than real (0.13 m) at half density in the low model ----
  const RIG = D ? 0.07 : 0.085
  const line = (a: V3, b: V3) => rod(black, a, b, RIG, RIG, 4)
  const chain = (s: number, y: number): V3 => { const p = hullPt(s, y, rail(y), 0.25); return [p[0], p[1], rail(y) - 0.6] }
  MASTS.forEach((m, mi) => {
    const nLow = D ? 6 : 3, nTop = D ? 4 : 2
    for (const s of [-1, 1]) {
      for (let k = 0; k < nLow; k++) line(chain(s, m.y + 1.0 - (k * 3.2) / (nLow - 1 || 1)), [s * 0.45, m.y, m.top - 0.4])
      for (let k = 0; k < nTop; k++) line([s * 2.0, m.y - 0.3 - (k * 1.2) / (nTop - 1 || 1), m.top], [s * 0.3, m.y, m.cross - 0.3])
      line([s * 1.55, m.y - 0.1, m.cross], [s * 0.2, m.y, m.tgHead])
      if (D) line([s * 1.55, m.y + 0.1, m.cross], [s * 0.2, m.y, m.tgHead - 2.5])
      // futtock shrouds under the top
      if (D) line([s * 2.0, m.y, m.top - 0.3], [s * 0.4, m.y, m.top - 3.2])
      // backstays: topmast and topgallant
      line(chain(s, m.y - 4.2), [s * 0.3, m.y, m.cross - 0.1])
      line(chain(s, m.y - 5.6), [s * 0.2, m.y, m.tgHead])
      if (D) line(chain(s, m.y - 6.8), [s * 0.12, m.y, m.truck - 1.2])
    }
    // fore-and-aft stays
    if (mi === 0) {
      line([0, m.y + 0.4, m.top - 0.3], at(2.0)) // forestay to the bowsprit
      line([0, m.y + 0.3, m.cross - 0.2], at(11.5)) // fore topmast stay
      line([0, m.y + 0.2, m.tgHead], at(18.0)) // fore topgallant stay
      line([0, m.y + 0.1, m.truck - 1.5], tip) // royal stay
      if (D) {
        line([0, m.y + 0.3, m.cross + 1.0], at(15.0)) // inner jib stay
        line([0, m.y + 0.1, m.truck - 3.5], at(20.5)) // flying jib stay
      }
    } else {
      const f = MASTS[mi - 1]
      line([0, m.y + 0.4, m.top - 0.3], [0, f.y - 1.0, deck(f.y) + 0.3])
      line([0, m.y + 0.3, m.cross - 0.2], [0, f.y, f.top])
      line([0, m.y + 0.2, m.tgHead], [0, f.y, f.cross])
      if (D) line([0, m.y + 0.1, m.truck - 1.5], [0, f.y, f.tgHead])
    }
  })
  // bobstays and martingale under the bowsprit
  line(at(8.0), [0, BOW - 0.4, CAN_TOP + 0.6])
  line(dsBot, tip)
  line(dsBot, at(13.5))
  if (D) {
    line(dsBot, [0.0, BOW - 0.8, rail(BOW) - 1.0])
    line(at(4.0), [0, BOW - 0.2, CAN_TOP + 1.5])
    // bowsprit shrouds to the bows
    for (const s of [-1, 1]) line(at(6.0), hullPt(s, 31, rail(31) - 1.3, 0.1))
    // braces from the main and fore yardarms aft to the rail (detail only)
    MASTS.forEach((m) => m.yards.slice(0, 3).forEach(([z, L]) => {
      for (const s of [-1, 1]) line(yardEnd(m, z, L / 2 - 0.3, s), chain(s, m.y - 9 + s * 3))
    }))
    // lifts from the yardarms to the masthead
    MASTS.forEach((m) => m.yards.forEach(([z, L], k) => {
      const head = k === 0 ? m.top - 0.4 : k < 3 ? m.cross - 0.2 : Math.min(m.truck - 0.5, z + 2.6)
      for (const s of [-1, 1]) line(yardEnd(m, z, L / 2 - 0.2, s), [s * 0.25, m.y + 0.3, head])
    }))
  }

  // --- the dry-dock canopy: glazed wall, sloping glass roof meeting the
  //     hull, white steel frame -------------------------------------------------
  const N = D ? 96 : 56
  // a stadium ring, by arc length from the stern centre, counter-clockwise
  const stadium = (hw: number, hl: number, r: number, t: number): XY => {
    const straight = 2 * (hl - r), arc = Math.PI * r, P = 2 * straight + 2 * arc
    let s = ((t % 1) + 1) % 1 * P
    // start at stern centre (0, -hl), go toward +x
    if (s < arc / 2) { const a = -Math.PI / 2 + s / r; return [r * Math.cos(a), -(hl - r) + r * Math.sin(a)] }
    s -= arc / 2
    if (s < straight) return [hw, -(hl - r) + s]
    s -= straight
    if (s < arc) { const a = s / r; return [r * Math.cos(a), hl - r + r * Math.sin(a)] }
    s -= arc
    if (s < straight) return [-hw, hl - r - s]
    s -= straight
    const a = Math.PI + s / r; return [r * Math.cos(a), -(hl - r) + r * Math.sin(a)]
  }
  // the inner edge: the hull at the glass line, by matching arc-length
  const hullRing: XY[] = []
  {
    const pts: XY[] = []
    for (let i = 0; i <= 60; i++) { const y = STERN + 0.05 + ((BOW - STERN - 0.1) * i) / 60; const p = hullPt(1, y, CAN_TOP, 0.12); pts.push([p[0], p[1]]) }
    const ring = [...pts, ...[...pts].reverse().map(([x, y]) => [-x, y] as XY)]
    // resample by arc length starting at the stern centre
    const cum = [0]; for (let i = 1; i < ring.length; i++) cum.push(cum[i - 1] + Math.hypot(ring[i][0] - ring[i - 1][0], ring[i][1] - ring[i - 1][1]))
    const L = cum[cum.length - 1]
    for (let k = 0; k < N; k++) {
      const s = (L * k) / N
      let j = 1; while (j < cum.length - 1 && cum[j] < s) j++
      const f = (s - cum[j - 1]) / (cum[j] - cum[j - 1] || 1)
      hullRing.push([ring[j - 1][0] + (ring[j][0] - ring[j - 1][0]) * f, ring[j - 1][1] + (ring[j][1] - ring[j - 1][1]) * f])
    }
  }
  const outer: XY[] = Array.from({ length: N }, (_, k) => stadium(CAN_HALF_W, CAN_HALF_L, CAN_R, k / N))
  const rim = offset(ccw(outer), -0.45)
  // glazed wall (lit inside at night) with white mullions and a white fascia
  walls(wall, ccw(outer), 0, CAN_RIM - 0.3)
  walls(white, ccw(outer), CAN_RIM - 0.3, CAN_RIM)
  for (let k = 0; k < N; k++) {
    // fascia top between outer and rim
    const a = ccw(outer)[k], b = ccw(outer)[(k + 1) % N], c = rim[(k + 1) % N], d = rim[k]
    polyDir(white, [[...a, CAN_RIM], [...b, CAN_RIM], [...c, CAN_RIM], [...d, CAN_RIM]], UP)
  }
  // the cap above would fill the whole middle; it sits under the roof and the
  // hull, hidden. The roof: rim -> hull, rising, in two bands.
  const O = ccw(outer)
  const flip = O !== outer // ccw() may have reversed the ring
  const inner = flip ? [...hullRing].reverse() : hullRing
  const R2 = rim.map((p, k): V3 => [p[0], p[1], CAN_RIM])
  const MID = rim.map((p, k): V3 => { const q = inner[k]; return [p[0] * 0.45 + q[0] * 0.55, p[1] * 0.45 + q[1] * 0.55, CAN_RIM + (CAN_TOP - CAN_RIM) * 0.7] })
  const IN = inner.map((q): V3 => [q[0], q[1], CAN_TOP])
  for (let k = 0; k < N; k++) {
    const j = (k + 1) % N
    polyDir(glass, [R2[k], R2[j], MID[j], MID[k]], UP)
    polyDir(glass, [MID[k], MID[j], IN[j], IN[k]], UP)
  }
  // frame: ribs across the roof at every other station, a purlin along the
  // middle and the hull edge; mullions in the wall
  const FR = D ? 0.09 : 0.13
  for (let k = 0; k < N; k += 2) {
    const lift = (p: V3): V3 => [p[0], p[1], p[2] + 0.1]
    rod(white, lift(R2[k]), lift(MID[k]), FR, FR, 4)
    rod(white, lift(MID[k]), lift(IN[k]), FR, FR, 4)
    if (D) {
      // diagonals: the triangulated grid of the real roof
      rod(white, lift(R2[k]), lift(MID[(k + 1) % N]), FR * 0.8, FR * 0.8, 4)
      rod(white, lift(MID[(k + 1) % N]), lift(R2[(k + 2) % N]), FR * 0.8, FR * 0.8, 4)
      rod(white, lift(MID[k]), lift(IN[(k + 1) % N]), FR * 0.8, FR * 0.8, 4)
      rod(white, lift(IN[(k + 1) % N]), lift(MID[(k + 2) % N]), FR * 0.8, FR * 0.8, 4)
    }
    const o = O[k], n = outN(O[(k + N - 1) % N], O[(k + 1) % N])
    box(white, o[0] + n[0] * 0.02 - 0.12, o[0] + n[0] * 0.02 + 0.12, o[1] + n[1] * 0.02 - 0.12, o[1] + n[1] * 0.02 + 0.12, 0, CAN_RIM - 0.3, 0, false)
  }
  for (let k = 0; k < N; k++) {
    const j = (k + 1) % N, lift = (p: V3): V3 => [p[0], p[1], p[2] + 0.1]
    rod(white, lift(MID[k]), lift(MID[j]), FR, FR, 4)
  }

  return [
    { part: hull, material: { ...finish('hull-black', 0x4a4f57, 0.6), floodlight: (p, n) => (n[2] > 0.5 ? 0.1 : 0.45) } },
    { part: gilt, material: { ...finish('gilt', 0xd2a54a, 0.45), floodlight: () => 0.6 } },
    { part: white, material: { ...finish('paint-white', 0xf2eee6, 0.7), floodlight: (p) => (p[2] > 9 ? 0.8 : 0.3) } },
    { part: wood, material: finish('varnished-wood', 0xb58a5c, 0.7) },
    { part: glass, material: { ...PALETTE.glass, doubleSided: true } },
    { part: wall, material: PALETTE.window },
  ]
}

const REPLACES = ['way/25608663', 'way/969672514']

if (import.meta.main) {
  for (const [file, D, maxTri, maxBytes] of [
    [`${ID}.glb`, false, 6500, 256000],
    [`${ID}.detail.glb`, true, 40000, 1536 * 1024],
  ] as [string, boolean, number, number][]) {
    const parts = build(D)
    const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
    const glb = writeGlb('Cutty Sark', parts, {
      license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 46.3,
      frame: 'Y up, -Z north, +X east, metres; origin at the street anchor', replaces: REPLACES,
    })
    const out = new URL(`../models/${file}`, import.meta.url).pathname
    await Bun.write(out, glb)
    console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
    if (triangles > maxTri) console.error(`${file}: triangle budget exceeded: ${triangles}`)
    if (glb.length > maxBytes) console.error(`${file}: file budget exceeded: ${glb.length}`)
  }
}
