/**
 * Choctaw Stadium (The Ballpark in Arlington, 1994; Globe Life Park until
 * 2019), Arlington, Texas — procedural, CC0-1.0.
 * bun generators/dal-choctaw-stadium.ts
 *
 * What makes it the Ballpark in Arlington: the square red-brick and pale
 * granite wall all round, a long arcade of tall round-arched openings
 * between granite pilasters over a granite ground storey; the eight square
 * brick towers with green pyramid roofs, two at each chamfered corner, and
 * the gate block between them with its big central arch; above the wall,
 * set back, the dark-green roof over the upper deck that wraps three sides
 * of the bowl, with the white light racks on it; and inside, closing the
 * old centre field, the four-storey office building with its white steel
 * galleries and the Home Run Porch under its roof and big video board.
 * Modelled as it stands now (football/soccer since 2021), from the street
 * up: the mezzanine, upper deck, roof and everything round the field above
 * street level.
 *
 * Frame: bearing 0, built north-up (x east, y north). The anchor is the
 * area centroid of OSM way/28270489 (the stadium outline), -97.082563
 * 32.751252. The outline's walls run within 0.5° of north and east.
 *
 * Ground: y = 0 is the field. The street outside is 6.7 m above it
 * (published: "the field sits 22 feet below street level", Wikipedia,
 * "Choctaw Stadium"); the lidar agrees (field 164.0 m, the streets and
 * plazas all round 170.3-170.7 m). Catalog `elevation` is -6.7: the map
 * takes y = 6.7 as the model's ground and lays the street-level ring on
 * the street. Nothing that faces up is drawn below the street: the lower
 * deck and the 2021 east stand lie below it, and the map's terrain
 * (Mapterhorn) already shows the bowl there, so they are left to the map
 * (as dal-cotton-bowl does). Only vertical walls run down to y = 0, out of
 * sight. `bun tools/terrain.ts check models/dal-choctaw-stadium.glb --lng
 * -97.082563 --lat 32.751252 --bearing 0 --elevation -6.7` prints ok.
 *
 * Heights and plan, measured from USGS 3DEP lidar TX_Pecos_Dallas_B3_2018
 * (2018 flight; nothing outside changed in the 2021 conversion), 1 m grid,
 * read north-up with tools/lidar_frame.py; heights above the field:
 * - the outer wall: 27 m to its cornice, 10 m deep, the outline as OSM
 *   (the lidar's walls fall within 1 m of it); 20 m deep along the south,
 *   behind the porch;
 * - the eight towers: 10 m square, walls to 33.5 m, pyramids to 39 m; their
 *   centres taken halfway between OSM's bumps and the lidar's (they differ
 *   by 2-4 m);
 * - the bowl, read along rays from the field's centre every 5° (BOWL): the
 *   lower deck from the field's edge up to 6 m, the mezzanine's front, the
 *   mezzanine 14-19 m, the upper deck 24-30.5 m, the roof over it (grey on top,
 *   as NAIP shows it; green fascia and back slope, as the photos) 39 m
 *   at its front to 40.5 m, falling behind it over the upper concourse
 *   (33-35 m) to the wall: drawn as one green slope to 31 m over a dark
 *   band, as the photos show it from outside;
 * - the light racks on the roof: tops 48-49 m (two on the office, 52 m);
 * - the Home Run Porch: its roof 29 m at the back rising to 34.5 m under
 *   the board and 30 m at its front (y = -76); the board 36 m wide, its top
 *   51 m;
 * - the office building: 27 m, its field face at x = 93 and y = -93;
 * - the terrace before it, in the old centre field: 11 m.
 * The current field's edge is OSM's inner way/1412163718 (mapped after the
 * conversion), which agrees with USGS NAIP (2022): on the north the lower
 * rows are gone and the field runs up to the mezzanine's foot.
 *
 * Estimated from the photos: the arcade's bays (7.5 m), arch sizes, the
 * granite base (5 m), string course and cornice, the pilasters every third
 * bay; the towers' arched windows; the gate blocks' big arch; the office's
 * gallery levels; the porch's columns.
 *
 * Photos (Wikimedia Commons), compared against the renders:
 * - "Richard Greene Linear Park June 2020 04/06/08/12/13/15/20 (Globe Life
 *   Park in Arlington).jpg", Michael Barera, CC BY-SA 4.0: the west and
 *   north-west sides across the lake, the towers, the arcade and the roof;
 * - "Globe Life Park, the home field of the Texas Rangers ...
 *   LCCN2015630514.tif" and "... LCCN2015630684.tif", Carol M. Highsmith,
 *   public domain: a long side and a corner with its two towers;
 * - "The Ballpark, home of the Texas Rangers major-league baseball team,
 *   Arlington, Texas LCCN2011633379.tif", Carol M. Highsmith, public
 *   domain: a corner gate between its towers, close up;
 * - "Rangers Ball Park Home Plate Enterance Panorama.jpg", Supportstorm,
 *   public domain: the home-plate gate;
 * - "Globe Life Park in 2018.jpg", KENGRIFFEY24FAN, CC BY-SA 4.0, and
 *   "Rangers Ballpark Arlington.jpg", Oyoyoy, CC BY-SA 3.0: the bowl, the
 *   office building and the porch from behind home plate;
 * - "Arlington - Texas 2010 010.jpg", Veronidae, CC BY-SA 3.0: the porch's
 *   white steel and its board, the office's galleries;
 * - "Ballpark in Arlington May 2009.jpg", Rich Anderson, CC BY-SA 2.0: the
 *   bowl at night, the lights;
 * - Plan: USGS NAIP orthophoto (public domain).
 *
 * Left out: the field (the map's), signs and lettering, the flags, the
 * seats' rows and aisles, the truss under the roof's edge, the plazas.
 *
 * Doubts: the south and east sides have no licensed close photo and are
 * drawn like the west; the lower deck and east stand are the terrain's; the office building's field face is from photos of 2010-2018.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const S = 6.7 // the street, above the field
const TOP = 27 // the wall's cornice

const brick = new Part(), granite = new Part(), win = new Part(), green = new Part(), white = new Part(), roof = new Part()

// ---------------------------------------------------------------- helpers
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
/** A planar polygon (convex, or fan-safe from its first corner), wound to face `hint`. */
function face(p: Part, P: V3[], hint: V3) {
  let n: V3 = [0, 0, 0]
  for (let i = 1; i < P.length - 1; i++) {
    const c = cross(sub(P[i], P[0]), sub(P[i + 1], P[0]))
    n = [n[0] + c[0], n[1] + c[1], n[2] + c[2]]
  }
  const flip = dot(n, hint) < 0
  for (let i = 1; i < P.length - 1; i++) {
    const a = P[0], b = P[i], c = P[i + 1]
    if (Math.hypot(...cross(sub(b, a), sub(c, a))) < 1e-7) continue
    if (flip) p.tri(a, c, b)
    else p.tri(a, b, c)
  }
}
/** A box on a plan quad (corners CCW), from z0 to z1, with its top; bottom optional. */
function prism(p: Part, q: XY[], z0: number, z1: number, bottom = false) {
  const n = q.length
  const cx = q.reduce((s, a) => s + a[0], 0) / n, cy = q.reduce((s, a) => s + a[1], 0) / n
  for (let i = 0; i < n; i++) {
    const a = q[i], b = q[(i + 1) % n]
    const m: V3 = [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0]
    face(p, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], m)
  }
  face(p, q.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) face(p, q.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
/** A rotated box: centre, half-sizes along the unit direction u and across it. */
function obox(p: Part, c: XY, u: XY, hl: number, hw: number, z0: number, z1: number) {
  const v: XY = [-u[1], u[0]]
  const q: XY[] = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [c[0] + u[0] * hl * a + v[0] * hw * b, c[1] + u[1] * hl * a + v[1] * hw * b])
  prism(p, q, z0, z1)
}
/** Ear-clipping triangulation of a simple polygon in plan, at height z, facing up. */
function capPolygon(p: Part, poly: XY[], z: number) {
  const area = poly.reduce((s, a, i) => { const b = poly[(i + 1) % poly.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
  const idx = poly.map((_, i) => i)
  if (area < 0) idx.reverse()
  const crs = (o: XY, a: XY, b: XY) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const inside = (q: XY, a: XY, b: XY, c: XY) => crs(a, b, q) >= 0 && crs(b, c, q) >= 0 && crs(c, a, q) >= 0
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const a = poly[ia], b = poly[ib], c = poly[ic]
      if (crs(a, b, c) <= 1e-9) continue
      if (idx.some((k) => k !== ia && k !== ib && k !== ic && inside(poly[k], a, b, c))) continue
      p.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
      idx.splice(i, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) {
    const [a, b, c] = idx.map((k) => poly[k])
    p.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
  }
}
/** Inset a convex CCW polygon, each edge by its own distance. */
function inset(P: XY[], d: number[]): XY[] {
  const n = P.length
  const lines = P.map((a, i) => {
    const b = P[(i + 1) % n]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L // inward for CCW
    return { p: [a[0] + nx * d[i], a[1] + ny * d[i]] as XY, t: [(b[0] - a[0]) / L, (b[1] - a[1]) / L] as XY }
  })
  return lines.map((_, i) => {
    const A = lines[(i + n - 1) % n], B = lines[i]
    const den = A.t[0] * B.t[1] - A.t[1] * B.t[0]
    const s = ((B.p[0] - A.p[0]) * B.t[1] - (B.p[1] - A.p[1]) * B.t[0]) / den
    return [A.p[0] + A.t[0] * s, A.p[1] + A.t[1] * s] as XY
  })
}
/** Distance along a ray from the origin to a convex polygon's edge. */
function rayHit(P: XY[], t: number): number {
  const dx = Math.cos(t), dy = Math.sin(t)
  let best = Infinity
  for (let i = 0; i < P.length; i++) {
    const [x1, y1] = P[i], [x2, y2] = P[(i + 1) % P.length]
    const ex = x2 - x1, ey = y2 - y1
    const den = dx * ey - dy * ex
    if (Math.abs(den) < 1e-9) continue
    const s = (x1 * ey - y1 * ex) / den, u = (x1 * dy - y1 * dx) / den
    if (s > 0 && u >= -1e-9 && u <= 1 + 1e-9) best = Math.min(best, s)
  }
  return best
}
/** A round-arched flush panel on a wall: base centre `c`, along unit `u`, facing `n`. */
function arch(p: Part, c: V3, u: XY, n: XY, w: number, z0: number, zSpring: number, off = 0.06, seg = 8) {
  const at = (s: number, z: number): V3 => [c[0] + u[0] * s + n[0] * off, c[1] + u[1] * s + n[1] * off, z]
  const hint: V3 = [n[0], n[1], 0]
  face(p, [at(-w / 2, z0), at(w / 2, z0), at(w / 2, zSpring), at(-w / 2, zSpring)], hint)
  const r = w / 2
  for (let k = 0; k < seg; k++) {
    const a0 = (Math.PI * k) / seg, a1 = (Math.PI * (k + 1)) / seg
    face(p, [at(0, zSpring), at(r * Math.cos(a0), zSpring + r * Math.sin(a0)), at(r * Math.cos(a1), zSpring + r * Math.sin(a1))], hint)
  }
}
/** A flat rectangular panel on a wall. */
function panel(p: Part, c: V3, u: XY, n: XY, w: number, z0: number, z1: number, off = 0.06) {
  const at = (s: number, z: number): V3 => [c[0] + u[0] * s + n[0] * off, c[1] + u[1] * s + n[1] * off, z]
  face(p, [at(-w / 2, z0), at(w / 2, z0), at(w / 2, z1), at(-w / 2, z1)], [n[0], n[1], 0])
}
/** A band standing proud of a wall from s0 to s1 along it: `d` proud, z0 to z1. */
function band(p: Part, a: XY, u: XY, n: XY, s0: number, s1: number, z0: number, z1: number, d: number) {
  const P = (s: number, o: number): XY => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o]
  const A = P(s0, 0), B = P(s1, 0), C = P(s1, d), D = P(s0, d)
  const nn: V3 = [n[0], n[1], 0]
  face(p, [[D[0], D[1], z0], [C[0], C[1], z0], [C[0], C[1], z1], [D[0], D[1], z1]], nn)
  face(p, [[D[0], D[1], z1], [C[0], C[1], z1], [B[0], B[1], z1], [A[0], A[1], z1]], [0, 0, 1])
  face(p, [[A[0], A[1], z0], [D[0], D[1], z0], [D[0], D[1], z1], [A[0], A[1], z1]], [-u[0], -u[1], 0])
  face(p, [[C[0], C[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [C[0], C[1], z1]], [u[0], u[1], 0])
  if (z0 > S + 0.5) face(p, [[D[0], D[1], z0], [A[0], A[1], z0], [B[0], B[1], z0], [C[0], C[1], z0]], [0, 0, -1])
}

// ---------------------------------------------------------------- the outer wall
// OSM way/28270489, simplified: four walls and four chamfered corners,
// counter-clockwise from the south-west gate.
const OUT: XY[] = [
  [-117.3, -97.1], [-102.2, -112.2], [-92.4, -117.4], [99.7, -117.4], [117.8, -100.2], [120.3, -88], [120.3, 89.5],
  [118.7, 98.6], [102.9, 114], [93, 117.5], [-89, 117.5], [-98, 112], [-114, 96.2], [-120.4, 87], [-120.4, -88],
]
const CHAMFERS = new Set([0, 3, 7, 11]) // edges that are corner gates
const DEPTH = OUT.map((_, i) => (i === 2 ? 18 : 10))
const IN = inset(OUT, DEPTH)
const GB = 5 // the granite ground storey, above the street
const BAY = 7.5

for (let i = 0; i < OUT.length; i++) {
  const a = OUT[i], b = OUT[(i + 1) % OUT.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const n: XY = [u[1], -u[0]] // outward for CCW
  const nn: V3 = [n[0], n[1], 0]
  const ai = IN[i], bi = IN[(i + 1) % OUT.length]
  // the wall: granite base, brick, granite cornice (proud)
  face(granite, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], S + GB], [a[0], a[1], S + GB]], nn)
  face(brick, [[a[0], a[1], S + GB], [b[0], b[1], S + GB], [b[0], b[1], TOP], [a[0], a[1], TOP]], nn)
  band(granite, a, u, n, 0, L, TOP - 1.6, TOP, 0.35)
  // the roof of the wall's building, out to the inner edge
  face(roof, [[a[0], a[1], TOP], [b[0], b[1], TOP], [bi[0], bi[1], TOP], [ai[0], ai[1], TOP]], [0, 0, 1])
  // its inner face, down to the stands (mostly hidden)
  face(brick, [[ai[0], ai[1], 14], [bi[0], bi[1], 14], [bi[0], bi[1], TOP], [ai[0], ai[1], TOP]], [-n[0], -n[1], 0])
  if (CHAMFERS.has(i)) {
    // a gate block: the big central arch, two small doors, a raised parapet
    const c: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0]
    arch(win, c, u, n, 8.4, S + 2.5, S + 12)
    for (const s of [-L / 2 + 3.2, L / 2 - 3.2]) arch(win, [c[0] + u[0] * s, c[1] + u[1] * s, 0], u, n, 2.6, S + 0.5, S + 3)
    band(granite, a, u, n, L / 2 - 6, L / 2 + 6, S + 17.5, S + 18.5, 0.3)
    const m: XY = [c[0], c[1]]
    const q: XY[] = [[-6, 0.4], [6, 0.4], [6, -6], [-6, -6]].map(([s, o]) => [m[0] + u[0] * s + n[0] * o, m[1] + u[1] * s + n[1] * o])
    prism(brick, q.reverse(), TOP - 1, TOP + 3)
    band(granite, [m[0] + n[0] * 0.4, m[1] + n[1] * 0.4], u, n, -6.2, 6.2, TOP + 2.4, TOP + 3.3, 0.3)
    continue
  }
  // the arcade: bays of tall arches, a granite pilaster every third bay,
  // a string course, and a row of small windows above
  const nb = Math.max(1, Math.round((L - 10) / BAY))
  const bw = (L - 10) / nb
  band(granite, a, u, n, 3, L - 3, S + 15.6, S + 16.6, 0.25)
  for (let k = 0; k < nb; k++) {
    const s = 5 + bw * (k + 0.5)
    const c: V3 = [a[0] + u[0] * s, a[1] + u[1] * s, 0]
    arch(win, c, u, n, bw * 0.76, S + GB + 0.4, S + 11.6, 0.06, 5)
    panel(win, c, u, n, bw * 0.5, S + 17.6, S + 19.4)
  }
  for (let k = 0; k <= nb; k += 3) {
    const s = 5 + bw * k
    band(granite, a, u, n, s - 0.7, s + 0.7, 0, TOP - 1.6, 0.3)
  }
}

// --- the eight towers, two at each corner, with green pyramid roofs
const TOWERS: XY[] = [
  [-119, 90.7], [-92.2, 116], [98.5, 115], [121, 93], [119.3, -93.5], [93.5, -118.3], [-96.2, -117.1], [-119, -92.7],
]
const TH = 5, TE = 33.5, TP = 39
for (const [cx, cy] of TOWERS) {
  const q: XY[] = [[cx - TH, cy - TH], [cx + TH, cy - TH], [cx + TH, cy + TH], [cx - TH, cy + TH]]
  for (let i = 0; i < 4; i++) {
    const a = q[i], b = q[(i + 1) % 4]
    const u: XY = [(b[0] - a[0]) / (2 * TH), (b[1] - a[1]) / (2 * TH)]
    const n: XY = [u[1], -u[0]]
    const nn: V3 = [n[0], n[1], 0]
    face(granite, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], S + GB], [a[0], a[1], S + GB]], nn)
    face(brick, [[a[0], a[1], S + GB], [b[0], b[1], S + GB], [b[0], b[1], TE], [a[0], a[1], TE]], nn)
    const c: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0]
    // a band of three arched windows near the top, one tall arch below
    arch(win, c, u, n, 6.4, TOP + 0.6, TOP + 2.6, 0.06, 6)
    arch(win, c, u, n, 3, S + 9, S + 15, 0.06, 6)
  }
  // two granite bands round the tower, at the cornice and under the eave
  for (const [z0, z1] of [[TOP - 1.6, TOP], [TE - 0.9, TE]]) {
    const o = TH + 0.35
    prism(granite, [[cx - o, cy - o], [cx + o, cy - o], [cx + o, cy + o], [cx - o, cy + o]], z0, z1)
  }
  // the pyramid, with a small eave
  const e = TH + 0.7
  const base: V3[] = [[cx - e, cy - e, TE], [cx + e, cy - e, TE], [cx + e, cy + e, TE], [cx - e, cy + e, TE]]
  const apex: V3 = [cx, cy, TP]
  for (let i = 0; i < 4; i++) {
    const a = base[i], b = base[(i + 1) % 4]
    face(green, [a, b, apex], [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 1])
  }
  face(green, base, [0, 0, -1])
}

// ---------------------------------------------------------------- the bowl
// Per ray from the field's centre (degrees, CCW from east): the field's
// edge, the mezzanine's front, the upper deck's front, the roof's front and
// back (lidar, cleaned); and the current field's edge (OSM way/1412163718).
const BOWL: [number, number, number, number, number, number, number][] = [
  // a, rf, osm, rm, ru, rc, rce
  [-10, 68.5, 36.7, 82.5, 94.5, 103, 113], [-5, 67.5, 36.3, 80.5, 91.5, 102.5, 112.5], [0, 67, 36.1, 81, 92, 101, 113],
  [5, 67.5, 36.2, 81.5, 92.5, 102.5, 112.5], [10, 69.5, 36.6, 82.5, 92.5, 104, 115], [15, 69.5, 37.3, 84, 95.5, 106, 117],
  [20, 71.5, 38.3, 85.5, 96, 105.5, 116], [25, 71, 72.5, 84, 95, 104.5, 116], [30, 68.5, 71.5, 83, 94.5, 104, 115.5],
  [35, 66.5, 68.7, 82, 94.5, 105, 116], [40, 59.5, 61.5, 79.5, 90.5, 101, 112.5], [45, 55.5, 56.1, 78, 89.5, 98, 110.5],
  [50, 56.5, 52.6, 76, 87.5, 97, 107.5], [55, 55, 66.3, 73.5, 84.5, 95.5, 107.5], [60, 52, 65.4, 70.5, 82, 92.5, 104],
  [65, 52, 64.1, 70, 81, 90.5, 102], [70, 51.5, 63.3, 68.5, 80, 89.5, 101.5], [75, 52, 63, 68.5, 80, 89.5, 100.5],
  [80, 51, 63.2, 69.5, 80.5, 90.5, 101], [85, 51.5, 63.9, 69.5, 81.5, 91.5, 102.5], [90, 52.5, 65, 71.5, 81.5, 92.5, 103.5],
  [95, 54.5, 66.1, 72.5, 83.5, 93.5, 104.5], [100, 55, 67.8, 74.5, 85.5, 94.5, 107], [105, 53, 70.1, 76, 88, 98.5, 111],
  [110, 55.5, 73.1, 79, 92, 102.5, 114], [115, 58.5, 77, 84, 95, 106, 118.5], [120, 66.5, 81.1, 89, 99.5, 110.5, 121.5],
  [125, 68.5, 77, 93, 103, 112.5, 123.5], [130, 74.5, 71.8, 95, 104.5, 115, 126.5], [135, 75, 73.4, 95, 105, 115, 126],
  [140, 76, 73, 95.5, 104.5, 115, 126.5], [145, 73.5, 70.1, 94, 103, 113.5, 125], [150, 70.5, 66.5, 91.5, 102, 111, 122.5],
  [155, 65.5, 61, 86.5, 97.5, 108.5, 120.5], [160, 59, 62.9, 82, 94, 104.5, 116], [165, 56, 60.5, 79, 91.5, 101.5, 114],
  [170, 55, 58.6, 76.5, 88.5, 98, 110], [175, 57.5, 52.3, 74.5, 86.5, 95.5, 107.5], [180, 56.5, 51.6, 74.5, 85.5, 94.5, 106.5],
  [185, 56.5, 50.5, 73.5, 84.5, 94.5, 105.5], [190, 54, 49.3, 73.5, 84.5, 94.5, 106], [195, 53, 50.7, 74, 85, 94.5, 107],
  [200, 52.5, 50.3, 74.5, 86.5, 96, 107.5], [205, 54.5, 50.3, 77.5, 88.5, 98.5, 110.5], [210, 54.5, 50.6, 80, 91.5, 102, 114.5],
  [215, 54.5, 53.3, 83.5, 95.5, 106.5, 118.5], [220, 55, 57.1, 85, 96.5, 106, 117], [225, 59.5, 61.9, 85, 95, 105, 116],
  [230, 65.5, 68.3, 85, 95.5, 106, 117], [235, 73.5, 73.8, 83, 93, 105, 118.5], [240, 74, 75.2, 81, 90.5, 101, 114],
  [248, 77, 77.2, 80, 89, 99, 111],
]
// heights (lidar): lower deck 0.8 -> 6, mezzanine 14 -> 19, upper 24 -> 30.5, roof 39 -> 40.5, concourse 33.5
const H = { lo0: 0.8, lo1: 6, mz0: 14, mz1: 19, up0: 24, up1: 30.5, rf0: 39, rf1: 40.5, rfU: 37.6, cc: 33.5 }
type Ring = { a: number; d: XY; r0: number; h0: number; rm: number; ru: number; rc: number; rce: number; rr: number }
const rings: Ring[] = BOWL.map(([a, rf, osm, rm, ru, rc, rce]) => {
  const t = (a * Math.PI) / 180
  // the current field's edge: OSM, except where the new east stand stands in front
  const r0 = osm > rf ? osm : rf
  const h0 = H.lo0 + ((H.lo1 - H.lo0) * (r0 - rf)) / (rm - rf)
  return { a, d: [Math.cos(t), Math.sin(t)], r0, h0, rm, ru, rc, rce, rr: rayHit(IN, t) }
})
const P3 = (g: Ring, r: number, z: number): V3 => [g.d[0] * r, g.d[1] * r, z]
for (let i = 0; i < rings.length - 1; i++) {
  const A = rings[i], B = rings[i + 1]
  const strip = (p: Part, ra: [number, number], rb: [number, number], za: [number, number], zb: [number, number], hint: V3) =>
    face(p, [P3(A, ra[0], za[0]), P3(B, rb[0], zb[0]), P3(B, rb[1], zb[1]), P3(A, ra[1], za[1])], hint)
  const mid = (A.a + B.a) / 2 * Math.PI / 180
  const inward: V3 = [-Math.cos(mid), -Math.sin(mid), 0]
  const outward: V3 = [Math.cos(mid), Math.sin(mid), 0]
  // the lower deck lies below the street: the map's terrain has it, so it
  // is left to the map. The mezzanine: its glazed front (suites) down to the
  // street, its seats
  strip(win, [A.rm, A.rm], [B.rm, B.rm], [S, H.mz0], [S, H.mz0], inward)
  strip(green, [A.rm, A.ru], [B.rm, B.ru], [H.mz0, H.mz1], [H.mz0, H.mz1], [inward[0], inward[1], 3])
  // the upper deck: its front and seats
  strip(roof, [A.ru, A.ru], [B.ru, B.ru], [H.mz1, H.up0], [H.mz1, H.up0], inward)
  strip(green, [A.ru, A.rc], [B.ru, B.rc], [H.up0, H.up1], [H.up0, H.up1], [inward[0], inward[1], 3])
  // the roof over the upper deck: its front fascia, top, back, underside
  strip(green, [A.rc, A.rc], [B.rc, B.rc], [H.rfU, H.rf0], [H.rfU, H.rf0], inward)
  strip(roof, [A.rc, A.rce], [B.rc, B.rce], [H.rf0, H.rf1], [H.rf0, H.rf1], [0, 0, 1])
  strip(roof, [A.rc, A.rce], [B.rc, B.rce], [H.rfU, H.rfU], [H.rfU, H.rfU], [0, 0, -1])
  // behind it the roof falls to the wall's cornice over the upper concourse
  // (lidar 33-35 m between), as the photos show it: one green slope
  strip(green, [A.rce, A.rr], [B.rce, B.rr], [H.rf1, TOP + 4], [H.rf1, TOP + 4], [outward[0], outward[1], 2])
  // and under its edge, the open upper concourse over the cornice, in shadow
  strip(win, [A.rr, A.rr], [B.rr, B.rr], [TOP, TOP + 4], [TOP, TOP + 4], outward)
  // the upper deck's back wall under the roof, from its last row to the roof's underside
  strip(roof, [A.rc, A.rc], [B.rc, B.rc], [H.up1, H.rfU], [H.up1, H.rfU], inward)
}
// the bowl's two ends, closed with a wall each
for (const [g, sgn] of [[rings[0], -1], [rings[rings.length - 1], 1]] as [Ring, number][]) {
  const t = (g.a * Math.PI) / 180
  const hint: V3 = [-Math.sin(t) * sgn, Math.cos(t) * sgn, 0]
  const prof: [number, number][] = [
    [g.rm, 0], [g.rm, H.mz0], [g.ru, H.mz1], [g.ru, H.up0], [g.rc, H.up1], [g.rc, H.rf0],
    [g.rce, H.rf1], [g.rr, TOP + 4], [g.rr, 0],
  ]
  // fan from the foot of the back, as a series of quads down to the field
  for (let k = 1; k < prof.length - 2; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    face(roof, [P3(g, r0, 0), P3(g, r1, 0), P3(g, r1, z1), P3(g, r0, z0)], hint)
  }
}

// --- the light racks on the roof, white frames on two legs
const RACKS: [XY, XY, number][] = [
  [[-29, 95.5], [-3, 95.5], 48.5], [[20, 88.5], [46, 81.5], 48.5], [[60, 77], [83, 63], 48], [[-98, 1], [-98, 28], 49],
  [[-93.5, -49], [-89.5, -22], 48.5], [[-85, -65], [-67, -84], 48], [[96, -60], [96, -44], 51.5], [[40, -100], [56, -100], 51.5],
]
for (const [a, b, top] of RACKS) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const c: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const base = top > 50 ? TOP : H.rf1
  obox(white, c, u, L / 2, 0.6, top - 5.5, top)
  for (const s of [-L * 0.3, L * 0.3]) obox(white, [c[0] + u[0] * s, c[1] + u[1] * s], u, 0.5, 0.5, base, top - 5.5)
}

// ---------------------------------------------------------------- centre field
// The Home Run Porch: seats under a roof that rises to the board, white
// steel columns and fascia, the video board on top.
{
  const X0 = -31, X1 = 31, YB = -99, YF = -76, YK = -84
  const zB = 29, zK = 34.5, zF = 30
  // roof: back slope and front slope
  face(roof, [[X0, YB, zB], [X1, YB, zB], [X1, YK, zK], [X0, YK, zK]], [0, 0.4, 1])
  face(roof, [[X0, YK, zK], [X1, YK, zK], [X1, YF, zF], [X0, YF, zF]], [0, -0.4, 1])
  face(roof, [[X0, YB, zB - 1.2], [X1, YB, zB - 1.2], [X1, YF, zF - 1.2], [X0, YF, zF - 1.2]], [0, 0, -1])
  // the roof's ends and its white fascia
  for (const x of [X0, X1]) face(white, [[x, YB, zB - 1.2], [x, YF, zF - 1.2], [x, YF, zF], [x, YK, zK], [x, YB, zB]], [Math.sign(x), 0, 0])
  band(white, [X0, YF], [1, 0], [0, 1], -0.3, X1 - X0 + 0.3, zF - 2.2, zF + 0.2, 0.5)
  // the seats under it, the front wall to the field
  face(green, [[X0, YF + 0.5, 13], [X1, YF + 0.5, 13], [X1, YB, 27], [X0, YB, 27]], [0, 1, 1])
  face(roof, [[X0, YF + 0.5, 0], [X1, YF + 0.5, 0], [X1, YF + 0.5, 13], [X0, YF + 0.5, 13]], [0, 1, 0])
  for (const x of [X0, X1]) face(roof, [[x, YF + 0.5, 0], [x, YB, 0], [x, YB, 27], [x, YF + 0.5, 13]], [Math.sign(x), 0, 0])
  // white steel columns along the front
  for (let k = 0; k <= 5; k++) obox(white, [X0 + 1 + ((X1 - X0 - 2) * k) / 5, YF + 1.2], [1, 0], 0.5, 0.5, 13, zF - 2)
  // the video board: a dark screen facing the field in a white frame, on legs
  const bx0 = -18, bx1 = 18, by0 = -85.5, by1 = -82, bz0 = 37, bz1 = 51
  prism(white, [[bx0, by0], [bx1, by0], [bx1, by1], [bx0, by1]], bz0, bz1, true)
  face(win, [[bx0 + 1, by1 + 0.06, bz0 + 1.2], [bx1 - 1, by1 + 0.06, bz0 + 1.2], [bx1 - 1, by1 + 0.06, bz1 - 1.2], [bx0 + 1, by1 + 0.06, bz1 - 1.2]], [0, 1, 0])
  for (const x of [-12, 0, 12]) obox(white, [x, (by0 + by1) / 2], [1, 0], 0.6, 1.2, zK - 0.5, bz0)
}

// The terrace in the old centre field, before the office building.
const TERR: XY[] = [[72, -31], [84, -18], [93, -18], [93, -93], [28, -93], [28, -74]]
prism(roof, TERR, 0, 11)

// The office building: an L along the east and south, 27 m, its field
// faces white steel galleries over glass.
{
  const east: XY[] = [[93, -93], [rayHit(IN, 0) - 0.5, -93], [rayHit(IN, 0) - 0.5, -18], [93, -18]]
  const south: XY[] = [[28, -99.6], [93, -99.6], [93, -93], [28, -93]]
  prism(white, east, TOP - 2, TOP)
  prism(white, south, TOP - 2, TOP)
  const gal = (a: XY, b: XY, n: XY) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    face(win, [[a[0], a[1], 11], [b[0], b[1], 11], [b[0], b[1], TOP - 2], [a[0], a[1], TOP - 2]], [n[0], n[1], 0])
    // floor bands and posts, white, proud of the glass
    for (const z of [15, 19, 23]) band(white, a, u, n, 0, L, z, z + 0.9, 0.5)
    const np = Math.round(L / 9)
    for (let k = 0; k <= np; k++) band(white, a, u, n, (L * k) / np - 0.35, (L * k) / np + 0.35, 11, TOP - 2, 0.6)
    // the white frame on top, posts and a rail
    band(white, a, u, n, 0, L, TOP + 2.2, TOP + 3.2, 0.5)
    for (let k = 0; k <= np; k += 3) band(white, a, u, n, (L * k) / np - 0.3, (L * k) / np + 0.3, TOP, TOP + 2.2, 0.5)
  }
  gal([93, -18], [93, -93], [-1, 0])
  gal([93, -93], [28, -93], [0, 1])
  face(white, [[28, -99.6, 11], [28, -93, 11], [28, -93, TOP], [28, -99.6, TOP]], [-1, 0, 0])
  face(white, [[93, -18, 11], [rayHit(IN, 0) - 0.5, -18, 11], [rayHit(IN, 0) - 0.5, -18, TOP], [93, -18, TOP]], [0, 1, 0])
}

// The east stand built in 2021 on the old left field stands below the
// street (its back is about 9 m above the field, 2.3 m above the street)
// and is left to the map, like the lower deck.

// ---------------------------------------------------------------- materials and output
// From the daylight photos: a warm red brick; the pale pink-grey granite of
// the base, bands and pilasters; the dark-green roofs, pyramids and seats;
// white steel; grey concrete and roofs; dark glass in the arches (they
// glow at night, as the concourses behind them are lit).
const out = [
  { part: brick, material: finish('choctaw-brick', 0xa95c4b) },
  {
    part: granite,
    material: { ...finish('choctaw-granite', 0xe6d2c3), floodlight: (p: V3) => (p[2] < S + 6 ? 0.5 : 0) },
  },
  { part: win, material: PALETTE.window },
  { part: green, material: finish('choctaw-green', 0x5c8469) },
  { part: white, material: finish('choctaw-white-steel', 0xeef0ec) },
  { part: roof, material: PALETTE.roof },
]
const triangles = out.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of out) console.log(material.name.padEnd(22), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Choctaw Stadium', out, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the field below the way/28270489 centroid; bearing 0',
  bearing: 0, elevation: -S, osm: 'way/28270489',
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const file = new URL('../models/dal-choctaw-stadium.glb', import.meta.url).pathname
await Bun.write(file, glb)
console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
