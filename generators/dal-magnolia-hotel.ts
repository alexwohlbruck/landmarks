/**
 * Magnolia Building (Magnolia Hotel Dallas Downtown), 1401 Commerce Street,
 * Dallas, 1922 (Alfred C. Bossom), with the revolving red Pegasus of 1934
 * (rebuilt 1999) on its roof — original procedural geometry, CC0-1.0.
 * bun generators/dal-magnolia-hotel.ts
 *
 * Also exports the helpers this builder's other dal- models use
 * (dal-adolphus-hotel, dal-mercantile-national-bank); the Magnolia model is
 * only written when this file runs itself.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/30898509,
 * -96.799065, 32.780159. Its walls run at 345.8° / 75.8°, so the catalog
 * bearing is 345.8 and the model is square to its own frame: +y is "north"
 * up Akard toward Main Street, -y the Commerce Street front.
 *
 * Identity, in order: the red winged horse turning on its steel derrick
 * over the roof; the two buff limestone wings rising from a four-storey
 * base, with the deep light court between them open to Commerce Street and
 * spanned high up by a single round arch; the heavy bracketed cornices and
 * the string courses that band the wings; the stone penthouse and the tall
 * stair chimney with its green lantern that carry the derrick at the back.
 * At night the Pegasus is neon (`neon-pegasus`); the facade stays unlit
 * except its windows.
 *
 * Evidence:
 *  - plan: OSM outline way/30898509 (x -21.9..25.6, y -15.4..14.6 here).
 *    USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018 flight; it has no
 *    returns above ~52 m over downtown, so it gives walls and low parts
 *    only): the tower's east wall at x ~14 from Commerce to y 5.5 and a
 *    full-height projection to x ~20.6 behind that; the low east wing
 *    (x 14..20.1, Commerce to y 5.5) measured 15.7–17.1 m; the base cornice
 *    on Commerce 16.1 m; the strip east of x 20.6 at ~9 m (measured, 8.7).
 *  - height: OSM height 121.6 m = the published 400 ft (Wikipedia; NRHP),
 *    taken as the penthouse roof (29 storeys = 4 base + 21 + attic +
 *    3 penthouse storeys, counted in the photos).
 *  - wings and court: widths from Joe Mabel's panorama up the Commerce
 *    front (wing : court : wing = 305 : 150 : 295 px across the top), on
 *    the lidar's 36 m front: 14.4 + 7.2 + 14.4 m. Court depth 20.4 m (to
 *    y 5) is an estimate, the deepest the plan allows under a ~9 m rear
 *    block for the penthouse; no open photo looks down into it. Its walls
 *    are drawn in the window slate, as the shadowed, window-lined cut the
 *    photos show.
 *  - bands, counted in storeys on the panorama, JVanT's and Renelibrary's
 *    photos at ~3.74 m a storey: base cornice 16.5, string courses at
 *    ~39 and ~80, the arch springing at 80 and its bridge to 88, the attic
 *    course at ~102.5, main cornice 110 m (estimates from storey counts).
 *  - penthouse, chimney and derrick: Joe Mabel's "Magnolia Building roof
 *    01" (looking south from the north, ~24 px/m from the storey pitch):
 *    penthouse ~19 m wide and three storeys on the full-width rear roof, the
 *    chimney just east of it rising ~7 m over it, the derrick ~7 m high
 *    under the horse. The penthouse's depth (8 m) is an estimate.
 *  - the Pegasus: outline traced from Robert Kixmiller's daylight photo of
 *    the restored 1934 horse (the same design, now on its derrick by the
 *    Omni hotel), whose turntable and derrick also match the roof photo;
 *    12 m nose to tail, ~10.5 m tall (estimated from the roof photo, ~10 ×
 *    8 m, and the commonly quoted 40 × 32 ft), drawn 1.12× (13.5 m) so it
 *    reads at phone size. Drawn flat, 0.9 m thick, reading the same from
 *    both sides as the real back-to-back pair does; its plane is turned
 *    25° off the Commerce front so the south and south-west views see its
 *    side (the real one turns).
 *  - colour: cream-white limestone and terra cotta (#f0e9db, from the
 *    panorama's sunlit cream-white, a little cooler than the shaded buff); the horse the bright signal red it shows by day (Kixmiller,
 *    #d8262c sunlit), very slightly muted; the derrick pale grey-green
 *    steel; the chimney lantern green copper, drawn in the same steel.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Magnolia_Building_pano_01.jpg, Joe Mabel, CC BY-SA 3.0
 *  - Magnolia_Building_from_east.jpg, Joe Mabel, CC BY-SA 3.0
 *  - Dallas_-_Magnolia_Building_roof_01.jpg, Joe Mabel, CC BY-SA 3.0
 *  - Magnolia_Dallas.jpg, JVanT, CC BY 2.0
 *  - Magnolia_Hotel_Dallas_(1_of_1).jpg, Renelibrary, CC BY-SA 4.0
 *  - MagnoliaBuilding_Dallas.jpg, Dfwcre8tive, CC BY 3.0
 *  - Magnolia_Hotel.jpg and Magnolia_Hotel_front.jpg, RadicalBender, CC BY-SA 3.0
 *  - Reunion_Tower_Dallas_Texas_Mobil_Gas_Pegasus.jpg, Robert Kixmiller, CC BY-SA 4.0
 *  - Details from the Magnolia Building (LCCN2014632605), Carol M. Highsmith, public domain
 * USGS NAIP (too oblique to use for the plan), USGS 3DEP lidar. No
 * commercial imagery.
 *
 * Look-only (Flickr, CC BY-NC): "New neon Magnolia Pegasus - Dallas, TX"
 * (SeeMidTN.com), "A Common Sight" (fables98, BY-NC-SA), "Magnolia Bldg."
 * (cincity, BY-NC-SA). Looked at to confirm that the derrick stands on the
 * penthouse at the back of the roof; the licensed roof photo shows the same.
 *
 * Doubts: the court's depth; the penthouse's depth and exact place on the
 * roof (from one telephoto); the north face, seen only in that telephoto;
 * the Pegasus faces one way here — the real one turns.
 *
 * Left out: the sculpture group over the entrance, the arched entrance's
 * carving, brackets, balustrades, mullions, the railings round the roofs,
 * the derrick's spiral stair and lattice (drawn as a few chunky members).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, panel, rect, save, triangulate, walls, type XY } from './chi-aon-center'
import { strokes, type Pt } from './lettering'

// ---------------------------------------------------------------------------
// Helpers shared by this builder's dal- models.

/** A prism over ring r (counter-clockwise) from z0 to z1, top capped, optional bevel on the top edge. */
export function prism(wall: Part, top: Part | null, r: XY[], z0: number, z1: number, bevel = 0) {
  if (bevel > 0) {
    const i = inset(r, bevel)
    walls(wall, r, z0, z1 - bevel)
    walls(wall, r, z1 - bevel, z1, i)
    if (top) cap(top, i, z1)
  } else {
    walls(wall, r, z0, z1)
    if (top) cap(top, r, z1)
  }
}

/** A projecting course: a ring pushed out `out` from r, from z0 to z1, with a sloped (bevelled) top back to r. */
export function course(p: Part, r: XY[], z0: number, z1: number, out: number) {
  const o = inset(r, -out)
  const zb = z1 - Math.min(out, (z1 - z0) / 2)
  walls(p, o, z0, zb)
  walls(p, o, zb, z1, r)
  // underside, facing down
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    p.quad([o[j][0], o[j][1], z0], [o[i][0], o[i][1], z0], [r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0])
  }
}

/** A box from x0..x1, y0..y1, z0..z1. */
export function box(wall: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bevel = 0) {
  prism(wall, top, rect(x0, y0, x1, y1), z0, z1, bevel)
}

/**
 * Window panels on wall a→b of a ring: `n` bays evenly spread between `end`
 * margins, each `fill` of its pitch wide, over the given row bands.
 */
export function bayRow(p: Part, a: XY, b: XY, n: number, rows: [number, number][], o: { end?: number; fill?: number; out?: number; from?: number; to?: number } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const s0 = o.from ?? 0, s1 = o.to ?? L
  const end = o.end ?? 1.2, fill = o.fill ?? 0.6, out = o.out ?? 0.05
  const pitch = (s1 - s0 - 2 * end) / n
  for (let k = 0; k < n; k++) {
    const c = s0 + end + (k + 0.5) * pitch, w = (pitch * fill) / 2
    for (const [z0, z1] of rows) panel(p, a, b, c - w, c + w, z0, z1, out)
  }
}

/** Storey-group rows: from z0 to z1 in n bands with `gap` of wall between. */
export const bands = (z0: number, z1: number, n: number, gap = 2.0): [number, number][] =>
  Array.from({ length: n }, (_, i) => [z0 + (i * (z1 - z0)) / n + gap / 2, z0 + ((i + 1) * (z1 - z0)) / n - gap / 2] as [number, number])

/** An arched panel (rectangle with a semicircular head) on wall a→b, centred at s, width w, from z0 with springing at zs. */
export function archPanel(p: Part, a: XY, b: XY, s: number, w: number, z0: number, zs: number, out = 0.05, seg = 10) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (t: number, z: number): V3 => [a[0] + u[0] * t + n[0] * out, a[1] + u[1] * t + n[1] * out, z]
  const r = w / 2
  p.quad(P(s - r, z0), P(s + r, z0), P(s + r, zs), P(s - r, zs))
  for (let i = 0; i < seg; i++) {
    const t0 = (Math.PI * i) / seg, t1 = (Math.PI * (i + 1)) / seg
    p.tri(P(s, zs), P(s + r * Math.cos(t0), zs + r * Math.sin(t0)), P(s + r * Math.cos(t1), zs + r * Math.sin(t1)))
  }
}

/**
 * A flat shape extruded through a plane: ring in (u, v) (any winding),
 * placed by `place(u, v, w)`, solid from w0 to w1. Faces wound outward.
 */
export function slab(p: Part, ring: Pt[], w0: number, w1: number, place: (u: number, v: number, w: number) => V3) {
  let ar = 0
  for (let i = 0; i < ring.length; i++) { const a = ring[i], b = ring[(i + 1) % ring.length]; ar += a[0] * b[1] - b[0] * a[1] }
  const r = ar < 0 ? [...ring].reverse() : ring
  // `place` is right-handed (u right, v up, w toward the viewer), so a
  // counter-clockwise (u, v) ring faces +w.
  for (const [a, b, c] of triangulate(r as XY[])) {
    p.tri(place(r[a][0], r[a][1], w1), place(r[b][0], r[b][1], w1), place(r[c][0], r[c][1], w1))
    p.tri(place(r[a][0], r[a][1], w0), place(r[c][0], r[c][1], w0), place(r[b][0], r[b][1], w0))
  }
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    p.quad(place(r[i][0], r[i][1], w0), place(r[j][0], r[j][1], w0), place(r[j][0], r[j][1], w1), place(r[i][0], r[i][1], w1))
  }
}

/** A straight member of square section `t` from a to b (a chunky steel bar). */
export function bar(p: Part, a: V3, b: V3, t: number) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const L = Math.hypot(...d)
  const f: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const ref: V3 = Math.abs(f[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const cr = (x: V3, y: V3): V3 => [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]]
  let s = cr(f, ref); const sl = Math.hypot(...s); s = [s[0] / sl, s[1] / sl, s[2] / sl]
  const q = cr(s, f)
  const h = t / 2
  const ring = (c: V3) => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([i, j]) => [c[0] + (s[0] * i + q[0] * j) * h, c[1] + (s[1] * i + q[1] * j) * h, c[2] + (s[2] * i + q[2] * j) * h] as V3)
  const A = ring(a), B = ring(b)
  const c: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    quadOut(p, A[i], A[j], B[j], B[i], c)
  }
  quadOut(p, A[0], A[1], A[2], A[3], c)
  quadOut(p, B[0], B[1], B[2], B[3], c)
}

/** A quad wound to face away from point c. */
export function quadOut(p: Part, a: V3, b: V3, c: V3, d: V3, from: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  const m: V3 = [(a[0] + c[0]) / 2 - from[0], (a[1] + c[1]) / 2 - from[1], (a[2] + c[2]) / 2 - from[2]]
  if (n[0] * m[0] + n[1] * m[1] + n[2] * m[2] >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}

/** A square-plan pyramid cap over x0..x1, y0..y1 from z0 to an apex at z1. */
export function pyramid(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const r = rect(x0, y0, x1, y1), apex: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, z1]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    p.tri([r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], apex)
  }
}

// ---------------------------------------------------------------------------
// The Pegasus, traced in pixels from Kixmiller's photo (x right, y down).
// The horse faces +u (right).

const PX0 = 575, PY0 = 985
const PEG_SCALE = 13.5 / 445 // 13.5 m from wing tip to front hoof: the real ~12 m, drawn 1.12x for phone size
const VSQ = 0.95 // the photo looks up at the horse; undo a little of its stretch

const NECK: Pt[] = [[790, 575], [805, 564], [835, 571], [868, 562], [890, 568], [897, 581], [886, 596], [868, 606], [854, 622], [866, 655], [887, 690], [872, 724], [820, 724], [798, 692], [784, 642], [781, 600]]
const BODY: Pt[] = [[700, 770], [740, 744], [800, 732], [860, 718], [902, 728], [912, 760], [884, 792], [842, 816], [792, 832], [746, 838], [712, 828], [698, 802]]
const WING_BACK: Pt[] = [[802, 690], [792, 650], [770, 624], [740, 616], [700, 620], [655, 628], [612, 636], [588, 642], [606, 654], [645, 662], [690, 668], [735, 676], [770, 690]]
const WING_FRONT: Pt[] = [[834, 738], [818, 704], [792, 684], [752, 668], [710, 662], [668, 668], [628, 684], [596, 699], [574, 712], [600, 726], [622, 722], [642, 736], [668, 732], [692, 746], [718, 741], [745, 752], [772, 746], [800, 750]]
const TAIL: Pt[] = [[712, 770], [688, 790], [658, 804], [634, 826], [617, 851], [614, 874], [630, 888], [646, 870], [660, 846], [690, 826], [714, 812]]
// Legs as centre-lines, stroked.
const LEGS: Pt[][] = [
  [[876, 752], [918, 734], [952, 726], [940, 762], [918, 806]], // near fore, folded
  [[866, 778], [912, 784], [956, 794], [1016, 808]], // far fore, reaching
  [[742, 826], [712, 870], [684, 912], [652, 958]], // hind
  [[778, 828], [752, 878], [722, 922], [698, 962]], // hind
]

const pg = ([x, y]: Pt): Pt => [(x - PX0) * PEG_SCALE, (PY0 - y) * PEG_SCALE * VSQ]

/**
 * The Pegasus in a plane: `place(u, v, w)` maps sign metres (u to the
 * horse's front, v up, w through the sign) into the model. Origin of u, v
 * is the traced frame's lower-left; the derrick socket is near u 6, v 4.
 */
export function pegasus(p: Part, place: (u: number, v: number, w: number) => V3, thick = 0.9) {
  const h = thick / 2
  for (const ring of [WING_BACK, TAIL, BODY, NECK]) slab(p, ring.map(pg), -h, h, place)
  // the near wing stands a little proud, so it reads over the body
  slab(p, WING_FRONT.map(pg), -h - 0.15, h + 0.15, place)
  const pathM = LEGS.map((l) => l.map(pg))
  const shifted = (u: number, v: number, w: number) => place(u, v, w - h)
  strokes(p, pathM, { width: 15 * PEG_SCALE, depth: thick, place: shifted, back: true })
}
export const PEG_SOCKET: Pt = pg([805, 835])

// ---------------------------------------------------------------------------
// Magnolia Building

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), red = new Part(), steel = new Part()

  // Plan (model frame).
  const W = -21.9, S = -15.4, N = 14.6, E = 14, PX = 20.6, PY = 5.5 // tower west/south/north/east, NE projection
  const CW = -7.6, CE = -0.4, CN = 5.0 // the light court, 20.4 m deep
  const BASE = 16.5, A0 = 38.6, A1 = 40.6, B0 = 79, B1 = 81.4, C0 = 101.8, C1 = 103.4, CORN = 108.2, ROOF = 110, PENT = 121.6

  // The base: the whole outline but the low NE strip, to the base cornice.
  const baseRing: XY[] = [[W, S], [20.1, S], [20.1, PY], [PX, PY], [PX, N], [W, N]]
  walls(stone, baseRing, 0, BASE - 1.2)
  course(trim, baseRing, BASE - 1.2, BASE, 0.5)
  cap(roof, baseRing, BASE)
  // The low strip east of the projection (~9 m, lidar).
  box(stone, roof, PX, PY, 25.6, N, 0, 9, 0.3)

  // The tower: a U round the court, plus the NE projection.
  const U: XY[] = [[W, S], [CW, S], [CW, CN], [CE, CN], [CE, S], [E, S], [E, PY], [PX, PY], [PX, N], [W, N]]
  const tiers: [number, number][] = [[BASE, A0], [A1, B0], [B1, C0], [C1, CORN]]
  // The court's walls are drawn in the window slate: in every photo the
  // court is a deep, shadowed cut lined with windows, and that dark cut is
  // what separates the two towers.
  for (const [z0, z1] of tiers) U.forEach((a, i) => {
    const b = U[(i + 1) % U.length]
    ;(i >= 1 && i <= 3 ? win : stone).quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  })
  for (const [z0, z1] of [[A0, A1], [B0, B1], [C0, C1]] as [number, number][]) course(trim, U, z0, z1, 0.35)
  // The main cornice: a heavy overhang, then the attic parapet.
  course(trim, U, CORN, ROOF - 0.6, 1.0)
  walls(trim, U, ROOF - 0.6, ROOF)
  cap(roof, U, ROOF)

  // The arch across the court: springing from the wings at B0, its bridge
  // to 88 m, set at the Commerce face.
  {
    const ys = S, ye = S + 2.2, r = (CE - CW) / 2, cx = (CW + CE) / 2, zs = B0, top = 88
    const prof: Pt[] = [[CE, zs]]
    for (let i = 1; i < 10; i++) { const t = (Math.PI * i) / 10; prof.push([cx + r * Math.cos(t), zs + r * Math.sin(t)]) }
    prof.push([CW, zs], [CW, top], [CE, top])
    // u = x, v = z, w = -y (toward the Commerce viewer)
    slab(stone, prof, -ye, -ys, (u, v, w) => [u, -w, v])
    box(trim, roof, CW, ys - 0.3, CE, ye, top, top + 1.0)
  }

  // Penthouse at the back of the roof, the stair chimney east of it.
  const PW = -14, PE = 5, PS = CN + 0.6, PN = 13.6
  walls(stone, rect(PW, PS, PE, PN), ROOF, PENT - 1.0)
  course(trim, rect(PW, PS, PE, PN), PENT - 1.0, PENT, 0.35)
  cap(roof, rect(PW, PS, PE, PN), PENT)
  box(stone, null, PE + 0.4, 4.6, PE + 3.4, 7.6, ROOF, 127.4)
  course(trim, rect(PE + 0.4, 4.6, PE + 3.4, 7.6), 127.4, 128.2, 0.3)
  box(steel, null, PE + 0.7, 4.9, PE + 3.1, 7.3, 128.2, 129.4)
  pyramid(steel, PE + 0.5, 4.7, PE + 3.3, 7.5, 129.4, 130.6)

  // Windows. Rows group two storeys, with a full storey-band of wall between,
  // as the photos read: punched windows in a lot of pale stone.
  const rowsAll: [number, number][] = [
    ...bands(BASE + 0.4, A0, 3, 2.2), ...bands(A1, B0, 5, 2.2), ...bands(B1, C0, 3, 2.2), [C1 + 1.0, CORN - 1.0],
  ]
  // Commerce faces of the wings: three bays each (pair, single, pair).
  bayRow(win, [W, S], [CW, S], 3, rowsAll, { end: 1.8, fill: 0.5 })
  bayRow(win, [CE, S], [E, S], 3, rowsAll, { end: 1.8, fill: 0.5 })
  // The court: its side walls and back.
  // West (Akard) and east faces, the north face, the projection.
  bayRow(win, [W, N], [W, S], 7, rowsAll, { end: 1.6, fill: 0.48 })
  bayRow(win, [E, S], [E, PY], 5, rowsAll, { end: 1.4, fill: 0.48 })
  bayRow(win, [PX, PY], [PX, N], 2, rowsAll, { end: 1.0, fill: 0.6 })
  bayRow(win, [E, PY], [PX, PY], 1, rowsAll, { end: 1.6, fill: 0.6 })
  bayRow(win, [PX, N], [W, N], 9, rowsAll, { end: 1.6, fill: 0.48 })
  // Penthouse: one band of tall windows.
  const pent: [number, number][] = [[ROOF + 1.6, PENT - 2.0]]
  bayRow(win, [PW, PS], [PE, PS], 4, pent, { end: 1.6, fill: 0.4 })
  bayRow(win, [PE, PN], [PW, PN], 4, pent, { end: 1.6, fill: 0.4 })
  bayRow(win, [PE, PS], [PE, PN], 2, pent, { end: 1.6, fill: 0.4 })
  bayRow(win, [PW, PN], [PW, PS], 2, pent, { end: 1.6, fill: 0.4 })

  // Base: shop fronts and the storeys over them; the entrance arch in the
  // middle of Commerce under the court.
  const baseRows: [number, number][] = [[1.0, 6.8], [8.6, 14.0]]
  bayRow(win, [W, S], [CW - 0.6, S], 3, baseRows, { end: 1.2, fill: 0.68 })
  bayRow(win, [CE + 0.6, S], [20.1, S], 4, baseRows, { end: 1.2, fill: 0.68 })
  archPanel(win, [W, S], [20.1, S], (CW + CE) / 2 - W, 5.6, 1.0, 10.6)
  bayRow(win, [W, N], [W, S], 7, baseRows, { end: 1.6, fill: 0.48 })
  bayRow(win, [20.1, S], [20.1, PY], 4, baseRows, { end: 1.2, fill: 0.48 })
  bayRow(win, [PX, N], [W, N], 9, baseRows.slice(1), { end: 1.6, fill: 0.48 })
  bayRow(win, [PX, PY], [PX, N], 2, baseRows.slice(1), { end: 1.0, fill: 0.6 })

  // The derrick on the penthouse roof: four tapering legs, two rings of
  // ties, X braces on each face, the turntable on top.
  const DX = -4.5, DY = (PS + PN) / 2, DZ = PENT, DH = 7.2, b0 = 2.6, b1 = 0.9
  const leg = (sx: number, sy: number, t: number): V3 => {
    const h = b0 + (b1 - b0) * t
    return [DX + sx * h, DY + sy * h, DZ + DH * t]
  }
  const corners: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  for (const [sx, sy] of corners) bar(steel, leg(sx, sy, 0), leg(sx, sy, 1), 0.45)
  for (const t of [0.04, 0.5, 0.97]) for (let i = 0; i < 4; i++) {
    const [ax, ay] = corners[i], [bx, by] = corners[(i + 1) % 4]
    bar(steel, leg(ax, ay, t), leg(bx, by, t), 0.32)
  }
  for (let i = 0; i < 4; i++) {
    const [ax, ay] = corners[i], [bx, by] = corners[(i + 1) % 4]
    bar(steel, leg(ax, ay, 0.04), leg(bx, by, 0.5), 0.26)
    bar(steel, leg(bx, by, 0.04), leg(ax, ay, 0.5), 0.26)
    bar(steel, leg(ax, ay, 0.5), leg(bx, by, 0.97), 0.26)
    bar(steel, leg(bx, by, 0.5), leg(ax, ay, 0.97), 0.26)
  }
  // turntable drum and mast into the horse
  {
    const seg = 12, r = 1.5, z0 = DZ + DH, z1 = z0 + 0.7
    const ring: XY[] = Array.from({ length: seg }, (_, i) => [DX + r * Math.cos((2 * Math.PI * i) / seg), DY + r * Math.sin((2 * Math.PI * i) / seg)] as XY)
    walls(steel, ring, z0, z1)
    cap(steel, ring, z1)
    cap(steel, ring, z0, false)
    box(steel, null, DX - 0.35, DY - 0.35, DX + 0.35, DY + 0.35, z1, z1 + 1.6)
  }
  // The horse: its plane turned 25° off the Commerce front, so it shows its
  // side to the south and south-west views (the real one turns), at the drum.
  const [su, sv] = PEG_SOCKET
  const pz = DZ + DH + 0.7 + 1.2, th = (-25 * Math.PI) / 180, c = Math.cos(th), s = Math.sin(th)
  pegasus(red, (u, v, w) => [DX + (u - su) * c + w * s, DY + (u - su) * s - w * c, pz + (v - sv)])

  return [
    { part: stone, material: finish('magnolia-limestone', 0xf0e9db) },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: red, material: finish('neon-pegasus', 0xd4302f) },
    { part: steel, material: finish('derrick-steel', 0x9fb2ae) },
  ]
}

if (import.meta.main) await save('dal-magnolia-hotel', 'Magnolia Building', [32.780159, -96.799065], 345.8, build())
