/**
 * Alte Oper, Opernplatz, Frankfurt am Main: the opera house of 1873-80 by
 * Richard Lucae (completed by Albert Becker and Edgar Giesecke), Italian
 * Renaissance revival, burnt out in 1944 and rebuilt outside as it was in
 * 1976-81 as a concert hall. Original procedural geometry, CC0-1.0.
 * bun generators/frankfurt-alte-oper.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/384153099,
 * 50.1160350, 8.6719798. The long axis runs at 19.9 degrees (OSM
 * roof:direction 199.89 on the front parts and the outline's edges), so
 * the catalog bearing is 19.9: the main front faces -y (Opernplatz, to the
 * south-south-west), the building is symmetric about x = 0.
 *
 * Identity, in order: the stepped front, a projecting portico with a
 * three-arched entrance porch carrying a balcony, a five-arched loggia
 * between Corinthian columns, the entablature ("DEM WAHREN SCHOENEN
 * GUTEN") and a sculpted pediment, the green bronze chariot group on its
 * apex; behind it the tall auditorium block with its own sculpted
 * pediment and the dark bronze Pegasus on the apex, statue groups on its
 * corners; the two curved quadrants either side of the portico; the long
 * side wings of two storeys under balustrades, with projecting pavilions
 * of three tall round-arched windows; the subtly ochre-tinted frieze under the
 * main cornice; the pale green copper roofs.
 *
 * Evidence:
 *  - plan: OSM outline way/384153099 and its parts 929915107-929915119
 *    read in the turned frame. Main block (929915119): x +-14.8, y -30.8
 *    to 40.8, 34 m with a 3 m gabled roof. Wings (929915108/111/113-116)
 *    24 m with skillion roofs: pavilions to x +-24, the middle to +-19.4.
 *    Quadrants (929915107/109): quarter circles r 8.4 about (+-11, -34.8).
 *    Portico (929915117): x +-11 to y -48, 23 m gabled. Porch
 *    (929915118): y -48.8 to -53.7, 10 m flat; drawn 15.2 m wide where
 *    OSM has 13.4 m, from the photos (the porch spans most of the loggia).
 *    Rear block (929915112): 22 m to y 46.8.
 *  - heights: OSM part heights (above). The porch (10 m), the loggia
 *    (arches to 15.1 m, columns to 17.3 m), the portico entablature (18.7
 *    m) and pediment apex (22.4 m), the upper storey's windows (25.3-28 m)
 *    and the main cornice (31 m) are scaled from Leonhard Lenz's frontal
 *    photo with the porch's 10 m as the scale; side storeys from the 2024
 *    side photo. Pegasus about 4.5 m (estimated against the pediment).
 *  - colours from the daylight photos: pale warm limestone, the pale green
 *    copper roofs (the aerial "and surroundings"; OSM roof:colour #ccffd9),
 *    the faint ochre tint of the frieze panels, the dark bronze Pegasus, the
 *    green bronze chariot group. Mohammad Nemat Zadeh's photos are
 *    colour-graded pink and were used for form only.
 *  - night: the fronts are floodlit (Thomas Wolf's evening photo, the
 *    Lenz blue-hour series); windows and the loggia lit.
 *  - terrain: Mapterhorn shows the Opernplatz flat (+-0.5 m) but a hollow
 *    about 2 m deep inside the footprint under the rear of the main block
 *    (not in any photo; the square and the streets round it are level).
 *    The map grounds the model on that hollow, so the porch steps read
 *    about 2 m under the drawn square in `terrain.ts check`. Kept true to
 *    the photos; elevation 0.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Alte Oper, Frankfurt, South view 20190914 1.jpg (DXR, CC BY-SA 4.0)
 *    https://commons.wikimedia.org/wiki/File:Alte_Oper,_Frankfurt,_South_view_20190914_1.jpg
 *  - Alte Oper Frankfurt 2019.jpg (Thomas Wolf, www.foto-tw.de, CC BY-SA 3.0 de)
 *    https://commons.wikimedia.org/wiki/File:Alte_Oper_Frankfurt_2019.jpg
 *  - Alte Oper Frankfurt am Main 2012.jpg (Felix König, CC BY 3.0)
 *    https://commons.wikimedia.org/wiki/File:Alte_Oper_Frankfurt_am_Main_2012.jpg
 *  - Alte Oper Frankfurt am Main 2019-09-15 02.jpg (Leonhard Lenz, CC0)
 *    https://commons.wikimedia.org/wiki/File:Alte_Oper_Frankfurt_am_Main_2019-09-15_02.jpg
 *  - Alte Oper front facade - Frankfurt am Main - 2026-10-17.jpg (Norbert Nagel, CC BY-SA 4.0)
 *    https://commons.wikimedia.org/wiki/File:Alte_Oper_front_facade_-_Frankfurt_am_Main_-_2026-10-17.jpg
 *  - Frankfurt-Alte Oper-08-2016-gje.jpg, -14-2016-gje.jpg (Gerd Eichmann, CC BY 4.0)
 *    https://commons.wikimedia.org/wiki/File:Frankfurt-Alte_Oper-08-2016-gje.jpg
 *    https://commons.wikimedia.org/wiki/File:Frankfurt-Alte_Oper-14-2016-gje.jpg
 *  - Alte Oper Frankfurt am Main 2024-10-02 05.jpg (Leonhard Lenz, CC0): east side.
 *    https://commons.wikimedia.org/wiki/File:Alte_Oper_Frankfurt_am_Main_2024-10-02_05.jpg
 *  - Alte Oper am Opernplatz in Frankfurt am Main Mohammad Nemat Zadeh 24.jpg
 *    (Mohammad Nemat Zadeh, CC BY-SA 4.0): the north-east corner.
 *    https://commons.wikimedia.org/wiki/File:Alte_Oper_am_Opernplatz_in_Frankfurt_am_Main_Mohammad_Nemat_Zadeh_24.jpg
 *  - Alte Oper Frankfurt and surroundings.jpg (Jorgecft, CC BY-SA 4.0): aerial from the south.
 *    https://commons.wikimedia.org/wiki/File:Alte_Oper_Frankfurt_and_surroundings.jpg
 *  - Alte Oper Frankfurt abends 2011-07.jpg (Thomas Wolf, CC BY-SA 3.0): night.
 *    https://commons.wikimedia.org/wiki/File:Alte_Oper_Frankfurt_abends_2011-07.jpg
 * No commercial imagery, no 3D city models (Hessen LoD2 not used). No
 * look-only sources.
 *
 * Left out: the inscription, the rustication joints, the fine relief of
 * the frieze and the window aedicules, the iron balcony railing's pattern
 * (a dark band between stone posts), the candelabra on the square, the
 * glazed roof strip over the east wing, flagpoles.
 *
 * Doubts: the north end is seen only obliquely (Nemat Zadeh 24 and the
 * side photos) and the main roof's rear end only from far off; the rear
 * gable is drawn plain. The pediment reliefs are figure groups at their
 * real positions and poses, not portraits. The wing roofs' pitch is from
 * OSM's skillion tags and the aerial.
 *
 * This file also holds the kit shared by this builder's other models
 * (frankfurt-staedel, -senckenberg, -festhalle); merge it first.
 */
import { Part, writeGlb, cross, sub, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, lathe, rect, walls, triangulate, area, type XY } from './chi-aon-center'
import { face, along, arcade } from './phl-independence-hall'

export { cap, inset, lathe, rect, walls, triangulate, area, face, along, arcade }
export type { XY }

// ---------------------------------------------------------------------------
// Kit

export type Mat = { part: Part; material: MaterialSpec }

/** Write the low GLB (held to `lowTris`, 250 KB) and the detail GLB (40,000, 1.5 MB). */
export async function writeLods(id: string, name: string, anchor: [number, number], bearing: number, low: Mat[], detail: Mat[] | null, lowTris = 6500) {
  const one = async (file: string, parts: Mat[], maxTris: number, maxBytes: number) => {
    const used = parts.filter((x) => x.part.triangles > 0)
    const tris = used.reduce((t, x) => t + x.part.triangles, 0)
    if (used.length > 6) throw new Error(`${file}: ${used.length} materials`)
    const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor, bearing })
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url).pathname, glb)
    if (tris > maxTris || glb.length > maxBytes) throw new Error(`${file}: budget exceeded`)
  }
  if (detail) await one(`${id}.detail.glb`, detail, 40_000, 1_536_000)
  await one(`${id}.glb`, low, lowTris, 250_000)
}

/** Floodlit walls: faces lit, tops a little. */
export const floodWalls = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.85)

export const ccw = (r: XY[]): XY[] => (area(r) < 0 ? [...r].reverse() : r)
const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
const scl = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]

/** A closed prism over a ring (any winding), walls plus top (and bottom). */
export function prism(p: Part, r: XY[], z0: number, z1: number, top = true, bottom = false) {
  const c = ccw(r)
  walls(p, c, z0, z1)
  if (top) cap(p, c, z1)
  if (bottom) cap(p, c, z0, false)
}

/** An axis-aligned box. */
export function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top = true, bottom = false) {
  prism(p, rect(Math.min(x0, x1), Math.min(y0, y1), Math.max(x0, x1), Math.max(y0, y1)), z0, z1, top, bottom)
}

/**
 * A wall surface: s along, z up, o out. Straight (from a→b, outside on the
 * right, as a counter-clockwise ring) or an arc.
 */
export type Wall = { L: number; M: (s: number, z: number, o: number) => V3; N: (s: number) => V3; curved: boolean }
export function straight(a: XY, b: XY): Wall {
  const { L, u, n } = along(a, b)
  return {
    L, curved: false,
    M: (s, z, o) => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o, z],
    N: () => [n[0], n[1], 0],
  }
}
/** An arc about (cx, cy), radius r, from angle t0 to t1 (radians, t1 > t0: outside is outward). */
export function arc(cx: number, cy: number, r: number, t0: number, t1: number): Wall {
  const L = r * (t1 - t0)
  const t = (s: number) => t0 + s / r
  return {
    L, curved: true,
    M: (s, z, o) => [cx + (r + o) * Math.cos(t(s)), cy + (r + o) * Math.sin(t(s)), z],
    N: (s) => [Math.cos(t(s)), Math.sin(t(s)), 0],
  }
}
/** Segment length along curved walls (set coarser for a low model). */
export let CURVE = 1.2
export const setCurve = (m: number) => { CURVE = m }
const along3 = (w: Wall, s: number): V3 => norm(sub(w.M(s + 0.01, 0, 0), w.M(s, 0, 0)))

/** A flat convex polygon on a wall, (s, z) points, `o` out. */
export function wpoly(p: Part, w: Wall, pts: XY[], o: number) {
  const sc = pts.reduce((a, q) => a + q[0], 0) / pts.length, zc = pts.reduce((a, q) => a + q[1], 0) / pts.length
  const C = w.M(sc, zc, o), n = w.N(sc)
  for (let i = 0; i < pts.length; i++) {
    const A = pts[i], B = pts[(i + 1) % pts.length]
    face(p, [C, w.M(A[0], A[1], o), w.M(B[0], B[1], o)], n)
  }
}
export function wrect(p: Part, w: Wall, s0: number, s1: number, z0: number, z1: number, o = 0.05) {
  const n = w.curved ? Math.max(1, Math.ceil((s1 - s0) / (CURVE * 1.25))) : 1
  for (let k = 0; k < n; k++) {
    const a = s0 + ((s1 - s0) * k) / n, b = s0 + ((s1 - s0) * (k + 1)) / n
    face(p, [w.M(a, z0, o), w.M(b, z0, o), w.M(b, z1, o), w.M(a, z1, o)], w.N((a + b) / 2))
  }
}
/** A box standing on a wall: s0..s1, z0..z1, o0..o1 (back left off when o0 <= 0). */
export function wbox(p: Part, w: Wall, s0: number, s1: number, z0: number, z1: number, o0: number, o1: number, bottom = true) {
  const M = w.M, n = w.N((s0 + s1) / 2), u = along3(w, (s0 + s1) / 2)
  face(p, [M(s0, z0, o1), M(s1, z0, o1), M(s1, z1, o1), M(s0, z1, o1)], n)
  face(p, [M(s0, z1, o0), M(s1, z1, o0), M(s1, z1, o1), M(s0, z1, o1)], [0, 0, 1])
  if (bottom) face(p, [M(s0, z0, o0), M(s1, z0, o0), M(s1, z0, o1), M(s0, z0, o1)], [0, 0, -1])
  face(p, [M(s0, z0, o0), M(s0, z0, o1), M(s0, z1, o1), M(s0, z1, o0)], scl(u, -1))
  face(p, [M(s1, z0, o0), M(s1, z0, o1), M(s1, z1, o1), M(s1, z1, o0)], u)
  if (o0 > 0) face(p, [M(s0, z0, o0), M(s1, z0, o0), M(s1, z1, o0), M(s0, z1, o0)], scl(n, -1))
}
/** A horizontal band (string course, cornice) along a wall, following a curve; ends closed. */
export function band(p: Part, w: Wall, s0: number, s1: number, z0: number, z1: number, o: number, bottom = true, ends = true) {
  const n = w.curved ? Math.max(2, Math.ceil((s1 - s0) / CURVE)) : 1
  for (let k = 0; k < n; k++) {
    const a = s0 + ((s1 - s0) * k) / n, b = s0 + ((s1 - s0) * (k + 1)) / n
    face(p, [w.M(a, z0, o), w.M(b, z0, o), w.M(b, z1, o), w.M(a, z1, o)], w.N((a + b) / 2))
    face(p, [w.M(a, z1, -0.05), w.M(b, z1, -0.05), w.M(b, z1, o), w.M(a, z1, o)], [0, 0, 1])
    if (bottom) face(p, [w.M(a, z0, 0), w.M(b, z0, 0), w.M(b, z0, o), w.M(a, z0, o)], [0, 0, -1])
  }
  if (ends) {
    face(p, [w.M(s0, z0, 0), w.M(s0, z0, o), w.M(s0, z1, o), w.M(s0, z1, -0.05)], scl(along3(w, s0), -1))
    face(p, [w.M(s1, z0, 0), w.M(s1, z0, o), w.M(s1, z1, o), w.M(s1, z1, -0.05)], along3(w, s1))
  }
}

/** The head of a round-arched opening, left jamb to right jamb. */
export function archHead(c: number, hw: number, zs: number, n = 8): XY[] {
  return Array.from({ length: n + 1 }, (_, k) => { const t = Math.PI - (k / n) * Math.PI; return [c + hw * Math.cos(t), zs + hw * Math.sin(t)] as XY })
}
/** A flat round-arched (or square, zs = null) panel on a wall. */
export function warch(p: Part, w: Wall, c: number, hw: number, z0: number, zs: number | null, o = 0.05, n = 8) {
  if (zs === null) return wrect(p, w, c - hw, c + hw, z0, z0 + hw, o)
  wrect(p, w, c - hw, c + hw, z0, zs, o)
  const head = archHead(c, hw, zs, n)
  wpoly(p, w, [[c, zs], ...head.slice().reverse()].reverse() as XY[], o)
}
/** A raised surround (`fw` wide, `d` proud) round a round-arched opening, with its reveals. */
export function wframe(p: Part, w: Wall, c: number, hw: number, z0: number, zs: number, fw: number, d: number, n = 8) {
  const inner: XY[] = [[c - hw, z0], ...archHead(c, hw, zs, n), [c + hw, z0]]
  const outer: XY[] = [[c - hw - fw, z0], ...archHead(c, hw + fw, zs, n), [c + hw + fw, z0]]
  const M = w.M, N = w.N(c), u = along3(w, c)
  for (let i = 0; i < inner.length - 1; i++) {
    const a = inner[i], b = inner[i + 1], A = outer[i], B = outer[i + 1]
    face(p, [M(a[0], a[1], d), M(b[0], b[1], d), M(B[0], B[1], d), M(A[0], A[1], d)], N)
    const ds = b[0] - a[0], dz = b[1] - a[1]
    face(p, [M(a[0], a[1], 0), M(b[0], b[1], 0), M(b[0], b[1], d), M(a[0], a[1], d)], add(scl(u, dz), [0, 0, -ds]))
    const Ds = B[0] - A[0], Dz = B[1] - A[1]
    face(p, [M(A[0], A[1], 0), M(B[0], B[1], 0), M(B[0], B[1], d), M(A[0], A[1], d)], add(scl(u, -Dz), [0, 0, Ds]))
  }
}
/** A disc on a wall (an oculus or medallion). */
export function wdisc(p: Part, w: Wall, c: number, z: number, r: number, o = 0.05, n = 10) {
  wpoly(p, w, Array.from({ length: n }, (_, k) => [c + r * Math.cos((k / n) * 2 * Math.PI), z + r * Math.sin((k / n) * 2 * Math.PI)] as XY), o)
}
/**
 * A balustrade along a wall top: plinth, rail and, in detail, square
 * balusters at `pitch` (posts every `post` m); in low, a solid band.
 */
export function balustrade(p: Part, w: Wall, s0: number, s1: number, z: number, h: number, o: number, detail: boolean, t = 0.36, post = 3.2) {
  if (!detail) {
    const n = w.curved ? Math.max(2, Math.ceil((s1 - s0) / (CURVE * 1.25))) : 1
    for (let k = 0; k < n; k++) {
      const a = s0 + ((s1 - s0) * k) / n, b = s0 + ((s1 - s0) * (k + 1)) / n
      wbox(p, w, a, b, z, z + h, o - t, o, false)
    }
    return
  }
  const segs = w.curved ? Math.max(2, Math.ceil((s1 - s0) / CURVE)) : 1
  for (let k = 0; k < segs; k++) {
    const a = s0 + ((s1 - s0) * k) / segs, b = s0 + ((s1 - s0) * (k + 1)) / segs
    wbox(p, w, a, b, z, z + 0.2, o - t, o, false)
    wbox(p, w, a, b, z + h - 0.18, z + h, o - t - 0.04, o + 0.04, true)
  }
  const np = Math.max(1, Math.round((s1 - s0) / post))
  for (let k = 0; k <= np; k++) {
    const s = s0 + ((s1 - s0) * k) / np, a = Math.max(s0, s - 0.22), b = Math.min(s1, s + 0.22)
    wbox(p, w, a, b, z + 0.2, z + h - 0.18, o - t - 0.03, o + 0.03, false)
  }
  const nb = Math.round((s1 - s0) / 0.42)
  for (let k = 0; k < nb; k++) {
    const s = s0 + ((s1 - s0) * (k + 0.5)) / nb
    if (Math.abs(((s - s0) / ((s1 - s0) / np)) - Math.round((s - s0) / ((s1 - s0) / np))) * ((s1 - s0) / np) < 0.35) continue
    const m = w.M(s, 0, o - t / 2)
    lathe(p, m[0], m[1], [[0.0, z + 0.2], [0.13, z + 0.45], [0.06, z + h - 0.3], [0, z + h - 0.18]], 4, Math.PI / 4)
  }
}

/**
 * An engaged or free column at (x, y): base, a shaft with slight entasis
 * and a Corinthian capital (a flared bell under a square abacus).
 */
export function column(p: Part, x: number, y: number, z0: number, z1: number, r: number, seg: number, detail: boolean) {
  const cap0 = z1 - r * 2.3
  if (detail) {
    box(p, x - r * 1.35, y - r * 1.35, x + r * 1.35, y + r * 1.35, z0, z0 + r * 0.45)
    lathe(p, x, y, [[0, z0 + r * 0.45], [r * 1.2, z0 + r * 0.45], [r * 1.2, z0 + r * 0.75], [r * 1.05, z0 + r * 0.9], [r, z0 + r * 1.1], [r * 1.02, z0 + (cap0 - z0) * 0.35], [r * 0.86, cap0 - 0.1], [r * 0.95, cap0], [r * 1.15, cap0 + r * 0.9], [r * 1.45, z1 - r * 0.45], [0, z1 - r * 0.45]], seg)
    box(p, x - r * 1.5, y - r * 1.5, x + r * 1.5, y + r * 1.5, z1 - r * 0.45, z1)
  } else {
    lathe(p, x, y, [[0, z0], [r * 1.15, z0], [r, z0 + r * 0.6], [r * 0.9, cap0], [r * 1.4, z1 - r * 0.4], [r * 1.4, z1], [0, z1]], seg)
  }
}

/** An ellipsoid about c with (orthogonal) semi-axes a, b, c3, smooth-shaded. */
export function ellipsoid(p: Part, c: V3, a: V3, b: V3, h: V3, nu = 8, nv = 5) {
  const ra = Math.hypot(...a), rb = Math.hypot(...b), rh = Math.hypot(...h)
  const P = (u: number, v: number): [V3, V3] => {
    const cu = Math.cos(u), su = Math.sin(u), cv = Math.cos(v), sv = Math.sin(v)
    const pt = add(add(add(c, a, cv * cu), b, cv * su), h, sv)
    const n = norm(add(add(scl(a, (cv * cu) / (ra * ra)), b, (cv * su) / (rb * rb)), h, sv / (rh * rh)))
    return [pt, n]
  }
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
    const u0 = (i / nu) * 2 * Math.PI, u1 = ((i + 1) / nu) * 2 * Math.PI
    const v0 = -Math.PI / 2 + (j / nv) * Math.PI, v1 = -Math.PI / 2 + ((j + 1) / nv) * Math.PI
    const A = P(u0, v0), B = P(u1, v0), C = P(u1, v1), D = P(u0, v1)
    if (j > 0) p.tri(A[0], B[0], C[0], undefined, undefined, undefined, [A[1], B[1], C[1]])
    if (j < nv - 1) p.tri(A[0], C[0], D[0], undefined, undefined, undefined, [A[1], C[1], D[1]])
  }
}
/** A sphere-ish blob. */
export const blob = (p: Part, c: V3, rx: number, ry: number, rz: number, nu = 8, nv = 5) => ellipsoid(p, c, [rx, 0, 0], [0, ry, 0], [0, 0, rz], nu, nv)
/** An ellipsoid stretched between two points (a limb, a neck, a body), radius r across. */
export function limb(p: Part, A: V3, B: V3, r: number, nu = 6, nv = 4, r2 = r) {
  const c = scl(add(A, B), 0.5), ax = scl(sub(B, A), 0.5)
  const d = norm(ax), t = Math.abs(d[2]) < 0.9 ? norm(cross(d, [0, 0, 1])) : norm(cross(d, [1, 0, 0])), b = cross(d, t)
  ellipsoid(p, c, scl(t, r), scl(b, r2), ax, nu, nv)
}
/** A tapered round strut between two points, flat-capped. */
export function strut(p: Part, A: V3, B: V3, r0: number, r1: number, n = 6) {
  const d = norm(sub(B, A)), t = Math.abs(d[2]) < 0.9 ? norm(cross(d, [0, 0, 1])) : norm(cross(d, [1, 0, 0])), b = cross(d, t)
  const ring = (C: V3, r: number) => Array.from({ length: n }, (_, k) => add(add(C, t, r * Math.cos((k / n) * 2 * Math.PI)), b, r * Math.sin((k / n) * 2 * Math.PI)))
  const r0s = ring(A, r0), r1s = ring(B, r1)
  for (let k = 0; k < n; k++) {
    const j = (k + 1) % n, nk = norm(sub(r0s[k], A)), nj = norm(sub(r0s[j], A))
    p.tri(r0s[k], r0s[j], r1s[j], undefined, undefined, undefined, [nk, nj, nj])
    p.tri(r0s[k], r1s[j], r1s[k], undefined, undefined, undefined, [nk, nj, nk])
  }
  face(p, r1s, d)
  face(p, r0s, scl(d, -1))
}

/** A standing robed figure at (x, y, z), h tall, as a smooth lathe; `arms` adds bent arms (detail). */
export function figure(p: Part, x: number, y: number, z: number, h: number, seg = 7, arms = false, face0: V3 = [0, -1, 0]) {
  const k = h / 1.8
  if (seg <= 5) {
    lathe(p, x, y, [[0, z], [0.28 * k, z], [0.2 * k, z + 0.9 * k], [0.24 * k, z + 1.38 * k], [0.07 * k, z + 1.52 * k], [0.12 * k, z + 1.64 * k], [0, z + 1.8 * k]], seg)
    return
  }
  lathe(p, x, y, [
    [0.0, z], [0.3 * k, z], [0.27 * k, z + 0.3 * k], [0.2 * k, z + 0.85 * k], [0.19 * k, z + 1.1 * k],
    [0.24 * k, z + 1.38 * k], [0.17 * k, z + 1.48 * k], [0.07 * k, z + 1.52 * k], [0.06 * k, z + 1.56 * k],
    [0.11 * k, z + 1.62 * k], [0.11 * k, z + 1.72 * k], [0, z + 1.8 * k],
  ], seg)
  if (arms) {
    const side = norm(cross(face0, [0, 0, 1]))
    for (const s of [-1, 1]) {
      const sh = add([x, y, z + 1.4 * k], side, s * 0.24 * k), el = add(add([x, y, z + 1.05 * k], side, s * 0.3 * k), face0, 0.08 * k)
      const ha = s > 0 ? add(add([x, y, z + 1.5 * k], side, s * 0.35 * k), face0, 0.25 * k) : add(add([x, y, z + 0.95 * k], face0, 0.3 * k), side, s * 0.12 * k)
      limb(p, sh, el, 0.07 * k, 5, 3)
      limb(p, el, ha, 0.06 * k, 5, 3)
    }
  }
}
/** A reclining figure (pediment-corner river god): torso, head and legs, lying along `dir` (+-1 in x), facing -y, at the face y. */
export function recliner(p: Part, x: number, y: number, z: number, len: number, dir: number, nu = 6) {
  const k = len / 2.4, nv = nu <= 5 ? 3 : 4
  limb(p, [x, y - 0.25 * k, z + 0.25 * k], [x + dir * 1.25 * k, y - 0.3 * k, z + 0.2 * k], 0.24 * k, nu, nv)
  limb(p, [x - dir * 0.1 * k, y - 0.3 * k, z + 0.3 * k], [x - dir * 0.45 * k, y - 0.32 * k, z + 1.05 * k], 0.3 * k, nu, nv, 0.22 * k)
  blob(p, [x - dir * 0.55 * k, y - 0.34 * k, z + 1.32 * k], 0.15 * k, 0.15 * k, 0.17 * k, nu, nv)
  limb(p, [x - dir * 0.4 * k, y - 0.35 * k, z + 0.95 * k], [x - dir * 0.85 * k, y - 0.4 * k, z + 0.35 * k], 0.08 * k, 5, 3)
}
/** A seated figure facing -y. */
export function seated(p: Part, x: number, y: number, z: number, h: number, nu = 6) {
  const k = h / 1.4, nv = nu <= 5 ? 3 : 4
  limb(p, [x - 0.15 * k, y - 0.05 * k, z + 0.35 * k], [x - 0.15 * k, y - 0.55 * k, z + 0.4 * k], 0.12 * k, 5, 3)
  limb(p, [x + 0.15 * k, y - 0.05 * k, z + 0.35 * k], [x + 0.15 * k, y - 0.55 * k, z + 0.4 * k], 0.12 * k, 5, 3)
  limb(p, [x, y, z + 0.3 * k], [x, y + 0.02 * k, z + 1.05 * k], 0.27 * k, nu, nv, 0.2 * k)
  blob(p, [x, y - 0.02 * k, z + 1.25 * k], 0.12 * k, 0.12 * k, 0.15 * k, nu, nv)
  limb(p, [x, y - 0.4 * k, z], [x, y - 0.55 * k, z + 0.4 * k], 0.22 * k, nu, nv, 0.14 * k)
}

/**
 * A pediment standing on a wall: tympanum slab (`wall` material) from z0
 * to the apex z1 across c +- hw, and raking and level cornices (`trim`),
 * `d` proud.
 */
export function pediment(wallP: Part, trim: Part, w: Wall, c: number, hw: number, z0: number, z1: number, d: number, depth: number, corn = 0.55) {
  const M = w.M, N = w.N(c)
  // Tympanum: a triangular prism from o = -depth to 0.
  face(wallP, [M(c - hw, z0, 0), M(c + hw, z0, 0), M(c, z1, 0)], N)
  const sl = norm(add(scl(along3(w, c), -(z1 - z0)), [0, 0, hw])), sr = norm(add(scl(along3(w, c), z1 - z0), [0, 0, hw]))
  // Raking cornices: slabs along each slope, `corn` thick, from o=-depth to d.
  for (const [a, b, nn] of [[[c - hw - 0.5, z0 - 0.05], [c, z1], sl], [[c, z1], [c + hw + 0.5, z0 - 0.05], sr]] as [XY, XY, V3][]) {
    const lo = (q: XY): XY => [q[0], q[1] - corn * 0.9]
    face(trim, [M(a[0], a[1], d), M(b[0], b[1], d), M(b[0], b[1], -depth), M(a[0], a[1], -depth)], nn)
    face(trim, [M(a[0], a[1], d), M(lo(a)[0], lo(a)[1], d), M(lo(b)[0], lo(b)[1], d), M(b[0], b[1], d)], N)
    face(trim, [M(lo(a)[0], lo(a)[1], d), M(lo(a)[0], lo(a)[1], 0), M(lo(b)[0], lo(b)[1], 0), M(lo(b)[0], lo(b)[1], d)], scl(nn, -1))
  }
  // level cornice under the tympanum
  wbox(trim, w, c - hw - 0.45, c + hw + 0.45, z0 - corn, z0, -depth, d)
}

// ---------------------------------------------------------------------------
// Alte Oper

export const ID = 'frankfurt-alte-oper'
const BEARING = 19.9
const ANCHOR: [number, number] = [50.116035, 8.6719798]

// Heights
const WALL = 19.4 // wing cornice top / wall top
const BAL = 1.25 // balustrade height
const MAIN = 31.2 // main block cornice top
const RIDGE = 34.4
const PORCH = 10

function build(D: boolean): Mat[] {
  const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), bronze = new Part(), ochre = new Part()
  setCurve(D ? 1.2 : 2.6)
  const SEG = D ? 10 : 5, AN = D ? 8 : 5, FIG = D ? 8 : 5

  // ---- massing
  const MX = 14.8, MY0 = -30.8, MY1 = 40.8
  box(stone, -MX, MY0, MX, MY1, 0, MAIN)
  for (const sx of [-1, 1]) {
    const X = (x: number) => sx * x
    box(stone, X(MX), -14.3, X(19.4), 17.1, 0, WALL)
    box(stone, X(MX), -34.8, X(24), -14.3, 0, WALL)
    box(stone, X(MX), 17.1, X(24), 37.7, 0, WALL)
    // quadrant
    const q: XY[] = [[X(11), MY0], [X(11), -43.2]]
    for (let k = 1; k <= 8; k++) { const t = -Math.PI / 2 + (k / 8) * (Math.PI / 2); q.push([X(11 + 8.4 * Math.cos(t)), -34.8 + 8.4 * Math.sin(t)]) }
    q.push([X(MX), MY0])
    prism(stone, q, 0, WALL, false)
    cap(roof, ccw(q), WALL + 0.25)
  }
  box(stone, -19.5, 37.7, 19.5, 44.4, 0, WALL)
  box(stone, -6.8, 44.4, 6.8, 46.8, 0, WALL)

  // ---- wing roofs (copper skillions up to the main block)
  const RT = 21.2, RL = WALL + 0.3
  const skillion = (xo: number, xi: number, y0: number, y1: number) => {
    // xo: outer edge (low), xi: inner (high) — any sign
    const lo0: V3 = [xo, y0, RL], lo1: V3 = [xo, y1, RL], hi0: V3 = [xi, y0, RT], hi1: V3 = [xi, y1, RT]
    face(roof, [lo0, lo1, hi1, hi0], [Math.sign(xo - xi) * (RT - RL), 0, Math.abs(xo - xi)])
    face(roof, [lo0, hi0, [xi, y0, RL]], [0, -1, 0])
    face(roof, [lo1, hi1, [xi, y1, RL]], [0, 1, 0])
  }
  for (const sx of [-1, 1]) {
    skillion(sx * 23.4, sx * MX, -34.2, -14.9)
    skillion(sx * 18.8, sx * MX, -14.3, 17.1)
    skillion(sx * 23.4, sx * MX, 17.7, 37.1)
  }
  // rear block: skillion rising north→south to the main block
  face(roof, [[-18.9, 43.8, RL], [18.9, 43.8, RL], [18.9, MY1, RT], [-18.9, MY1, RT]], [0, RT - RL, 3])
  for (const sx of [-1, 1]) face(roof, [[sx * 18.9, 43.8, RL], [sx * 18.9, MY1, RT], [sx * 18.9, MY1, RL]], [sx, 0, 0])
  cap(roof, rect(-6.3, 43.8, 6.3, 46.2), RL)

  // ---- main roof: low gable along y, copper
  const EAVE = MAIN + 0.15
  face(roof, [[-MX - 0.6, MY0 - 0.2, EAVE], [0, MY0 - 0.2, RIDGE], [0, MY1 + 0.2, RIDGE], [-MX - 0.6, MY1 + 0.2, EAVE]], [-(RIDGE - EAVE), 0, MX])
  face(roof, [[MX + 0.6, MY0 - 0.2, EAVE], [0, MY0 - 0.2, RIDGE], [0, MY1 + 0.2, RIDGE], [MX + 0.6, MY1 + 0.2, EAVE]], [RIDGE - EAVE, 0, MX])
  // the ridge cresting
  box(trim, -0.25, MY0 + 0.4, 0.25, MY1 - 0.4, RIDGE - 0.2, RIDGE + 0.45)

  // ---- walls and their facades
  type Bay = { c: number; g: 'arch' | 'rect' | 'door' | 'none'; u: 'arch' | 'rect' | 'none' }
  const wingFace = (w: Wall, bays: Bay[], pil: number[]) => {
    const L = w.L
    if (D) band(trim, w, 0, L, 0, 0.9, 0.15) // plinth
    band(trim, w, 0, L, 9.5, 10.15, 0.3) // string course
    if (D) band(stone, w, 0, L, 17.4, 18.5, 0.18, false) // frieze
    band(trim, w, 0, L, 18.5, WALL, 0.75) // cornice
    balustrade(trim, w, 0, L, WALL, BAL, -0.05, D)
    for (const b of bays) {
      if (b.g === 'arch' || b.g === 'door') {
        warch(win, w, b.c, 1.05, 0.9, 5.2, 0.05, AN)
        if (D) wframe(trim, w, b.c, 1.05, 0.9, 5.2, 0.32, 0.16, AN)
      } else if (b.g === 'rect') {
        wrect(win, w, b.c - 0.75, b.c + 0.75, 2.2, 5.4, 0.05)
        if (D) wbox(trim, w, b.c - 0.95, b.c + 0.95, 1.95, 2.2, 0, 0.2)
      }
      if (b.u === 'arch') {
        warch(win, w, b.c, 1.15, 11.0, 14.9, 0.05, AN)
        if (D) {
          wframe(trim, w, b.c, 1.15, 11.0, 14.9, 0.3, 0.18, AN)
          wbox(trim, w, b.c - 1.55, b.c + 1.55, 10.75, 11.0, 0, 0.3)
        }
      } else if (b.u === 'rect') {
        wrect(win, w, b.c - 0.8, b.c + 0.8, 11.6, 15.2, 0.05)
        wdisc(win, w, b.c, 16.5, 0.45, 0.05, D ? 10 : 6)
        if (D) {
          wbox(trim, w, b.c - 1.05, b.c + 1.05, 11.35, 11.6, 0, 0.25)
          wbox(trim, w, b.c - 1.15, b.c + 1.15, 15.2, 15.55, 0, 0.3)
        }
      }
    }
    for (const s of pil) {
      wbox(stone, w, s - 0.42, s + 0.42, 10.15, 17.4, 0, 0.22, false)
      if (D) wbox(trim, w, s - 0.55, s + 0.55, 16.8, 17.4, 0, 0.34)
    }
  }
  const S = straight
  for (const sx of [-1, 1]) {
    // Each face given a→b in the east side's CCW order; mirrored (and reversed) for the west.
    const F = (a: XY, b: XY) => (sx > 0 ? S(a, b) : S([-b[0], b[1]], [-a[0], a[1]]))
    const mir = (L: number, bays: Bay[], pil: number[]) => (sx > 0 ? { bays, pil } : { bays: bays.map((b) => ({ ...b, c: L - b.c })), pil: pil.map((s) => L - s) })
    const face2 = (a: XY, b: XY, bays: Bay[], pil: number[]) => { const w = F(a, b); const m = mir(w.L, bays, pil); wingFace(w, m.bays, m.pil) }
    // quadrant
    const qa = sx > 0 ? arc(11, -34.8, 8.4, -Math.PI / 2, 0) : arc(-11, -34.8, 8.4, Math.PI, 1.5 * Math.PI)
    const QL = qa.L
    wingFace(qa, [1, 3, 5].map((k) => ({ c: (QL * k) / 6, g: 'arch' as const, u: 'arch' as const })), [0.5, QL / 3, (2 * QL) / 3, QL - 0.5])
    if (D) for (const s of [QL / 3, (2 * QL) / 3]) { const m = qa.M(s, 0, 0.55); column(trim, m[0], m[1], 10.15, 17.4, 0.4, SEG, D) }
    // pavilion, front
    face2([19.4, -34.8], [24, -34.8], [{ c: 2.3, g: 'rect', u: 'arch' }], [])
    const P3 = (L: number): Bay[] => [-4.6, 0, 4.6].map((d, i) => ({ c: L / 2 + d, g: i === 1 ? 'door' : 'rect', u: 'arch' }))
    const pil3 = (L: number) => [L / 2 - 6.9, L / 2 - 2.3, L / 2 + 2.3, L / 2 + 6.9]
    face2([24, -34.8], [24, -14.3], P3(20.5), pil3(20.5))
    face2([24, -14.3], [19.4, -14.3], [{ c: 2.3, g: 'rect', u: 'arch' }], [])
    face2([19.4, -14.3], [19.4, 17.1], [-7.8, -2.6, 2.6, 7.8].map((d, i) => ({ c: 15.7 + d, g: i === 1 || i === 2 ? 'door' : 'rect', u: 'rect' })), [15.7 - 10.4, 15.7 - 5.2, 15.7, 15.7 + 5.2, 15.7 + 10.4])
    face2([19.4, 17.1], [24, 17.1], [{ c: 2.3, g: 'rect', u: 'arch' }], [])
    face2([24, 17.1], [24, 37.7], P3(20.6), pil3(20.6))
    face2([24, 37.7], [19.5, 37.7], [{ c: 2.25, g: 'rect', u: 'arch' }], [])
    face2([19.5, 37.7], [19.5, 44.4], [{ c: 3.35, g: 'rect', u: 'rect' }], [])
    face2([19.5, 44.4], [6.8, 44.4], [{ c: 4.2, g: 'rect', u: 'arch' }, { c: 8.6, g: 'rect', u: 'arch' }], [2, 6.4, 10.8])
    face2([6.8, 44.4], [6.8, 46.8], [], [])
  }
  wingFace(S([6.8, 46.8], [-6.8, 46.8]), [-4.2, 0, 4.2].map((d) => ({ c: 6.8 + d, g: 'door' as const, u: 'arch' as const })), [0.6, 4.7, 8.9, 13])

  // ---- main block upper walls (above the wing roofs) — sides and rear
  for (const sx of [-1, 1]) {
    const w = sx > 0 ? S([MX, MY0], [MX, MY1]) : S([-MX, MY1], [-MX, MY0])
    upperSide(w)
  }
  upperSide(S([MX, MY1], [-MX, MY1]), true)
  function upperSide(w: Wall, rear = false) {
    const L = w.L, z0 = RT
    band(trim, w, 0, L, 25.6, 26.0, 0.25)
    band(trim, w, 0, L, 29.6, MAIN, 0.8)
    if (D) band(trim, w, 0, L, MAIN, MAIN + 0.3, 0.3, false)
    const n = Math.round(L / 4.4), step = L / n
    for (let k = 0; k < n; k++) {
      const a = k * step + 0.55, b = (k + 1) * step - 0.55
      wrect(ochre, w, a, b, 26.2, 29.35, 0.04)
      if (D) wdisc(stone, w, (a + b) / 2, 27.75, 0.55, 0.08, 10)
    }
    for (let k = 0; k <= n; k++) wbox(stone, w, k * step - 0.45, k * step + 0.45, z0, 29.6, 0, 0.25, false)
    if (D) for (let s = 0.5; s < L; s += 0.95) {
      // cresting (antefixae) along the eaves
      const m0 = w.M(s - 0.2, MAIN + 0.3, 0.15), m1 = w.M(s + 0.2, MAIN + 0.3, 0.15), t = w.M(s, MAIN + 0.85, 0.15)
      face(trim, [m0, m1, t], w.N(s))
    }
  }
  // rear gable (plain): triangle over the cornice
  face(stone, [[MX, MY1, MAIN], [-MX, MY1, MAIN], [0, MY1, RIDGE]], [0, 1, 0])

  // ---- main block front (above the portico and quadrants)
  const MF = S([-MX, MY0], [MX, MY0])
  band(trim, MF, 0, 2 * MX, 18.5, 19.8, 0.5)
  band(trim, MF, 0, 2 * MX, 29.6, MAIN, 0.8)
  band(stone, MF, 0, 2 * MX, 28.3, 29.6, 0.25, false)
  band(trim, MF, 0, 2 * MX, 24.6, 25.0, 0.25)
  const nich = [-13.7, -4.55, 4.55, 13.7]
  for (const wx of [-11.4, -9.1, -6.8, -2.3, 0, 2.3, 6.8, 9.1, 11.4]) {
    wrect(win, MF, MX + wx - 0.65, MX + wx + 0.65, 25.3, 27.9, 0.05)
    if (D) { wbox(trim, MF, MX + wx - 0.85, MX + wx + 0.85, 27.9, 28.2, 0, 0.22); wbox(trim, MF, MX + wx - 0.8, MX + wx + 0.8, 25.05, 25.3, 0, 0.2) }
  }
  for (const nx of nich) {
    wbox(stone, MF, MX + nx - 0.75, MX + nx + 0.75, 20, 29.6, 0, 0.28, false)
    if (D) warch(trim, MF, MX + nx, 0.5, 25.0, 27.6, 0.3, AN)
    figure(trim, nx, MY0 - 0.75, 25.1, 2.5, FIG, D)
  }
  pediment(stone, trim, MF, MX, MX + 0.2, MAIN, RIDGE + 0.9, 0.85, 1.2)
  // its relief: a central group, reclining figures towards the corners
  const RY = MY0 - 0.1
  if (D) {
    for (const [x, dir] of [[-10.5, -1], [10.5, 1]] as [number, number][]) recliner(trim, x, RY, MAIN + 0.05, 2.4, dir)
    for (const x of [-7.6, -5.3, -3, 3, 5.3, 7.6]) seated(trim, x, RY, MAIN + 0.05, 1.3 + (9 - Math.abs(x)) * 0.12)
    figure(trim, -1.1, RY - 0.25, MAIN + 0.05, 2.4, FIG, true)
    figure(trim, 1.1, RY - 0.25, MAIN + 0.05, 2.4, FIG, true)
    blob(trim, [0, RY - 0.25, MAIN + 1.4], 0.35, 0.25, 1.2, 8, 4)
  } else {
    for (const [x, dir] of [[-9.5, -1], [9.5, 1]] as [number, number][]) recliner(trim, x, RY, MAIN + 0.05, 2.6, dir, 4)
    for (const x of [-4.5, 4.5]) seated(trim, x, RY, MAIN + 0.05, 1.9, 4)
    figure(trim, 0, RY - 0.25, MAIN + 0.05, 2.6, 5)
  }
  // Pegasus on the apex
  box(stone, -0.9, MY0 - 1.1, 0.9, MY0 + 1.1, RIDGE + 0.5, RIDGE + 1.6)
  pegasus(bronze, 0, MY0, RIDGE + 1.6, D)
  // corner groups on the main cornice (front and rear)
  for (const sx of [-1, 1]) for (const [y, f] of [[MY0 + 0.9, -1], [MY1 - 0.9, 1]] as [number, number][]) {
    box(stone, sx * (MX - 1.1), y - 0.8, sx * (MX - 0.1), y + 0.8, MAIN, MAIN + 0.9)
    figure(trim, sx * (MX - 0.6), y - 0.35 * f, MAIN + 0.9, 2.0, FIG, D, [0, f, 0])
    if (D) figure(trim, sx * (MX - 0.6), y + 0.4 * f, MAIN + 0.9, 1.7, FIG, false, [0, f, 0])
  }

  // ---- portico
  const PY = -48, PX = 11, ARC_Y = -47, GAL_Y = -44.6
  box(stone, -PX, PY, PX, -43.2, 0, PORCH)
  box(stone, -PX, GAL_Y, PX, MY0, 0, 18.6)
  for (const sx of [-1, 1]) box(stone, sx * 9.65, PY, sx * PX, GAL_Y, PORCH, 17.4)
  // loggia arcade: 5 openings between 6 columns, 4.1 m on centre
  const LO = [-8.2, -4.1, 0, 4.1, 8.2]
  const front = S([-PX, PY], [PX, PY])
  arcade(stone, (u, wv, z) => front.M(u, z, -wv), 0, 2 * PX, ARC_Y - PY, PORCH, 17.4, LO.map((c) => ({ c: PX + c, hw: 1.45, zs: 13.65 })), AN)
  // gallery back wall: arched doors, lit
  const gal = S([-PX, GAL_Y], [PX, GAL_Y])
  for (const c of LO) warch(win, gal, PX + c, 1.45, PORCH, 13.65, 0.05, AN)
  cap(trim, rect(-9.65, ARC_Y, 9.65, GAL_Y), PORCH + 0.02)
  for (const x of [-10.25, -6.15, -2.05, 2.05, 6.15, 10.25]) {
    box(trim, x - 0.6, PY - 0.95, x + 0.6, PY + 0.2, PORCH, PORCH + 1.0)
    column(trim, x, PY - 0.45, PORCH + 1.0, 17.2, 0.4, SEG, D)
  }
  // statues in the end bays of the loggia (Goethe and Mozart)
  for (const sx of [-1, 1]) figure(trim, sx * 8.2, -46.3, PORCH, 2.3, FIG, D)
  // entablature and pediment
  box(stone, -PX - 0.3, PY - 0.9, PX + 0.3, GAL_Y, 17.2, 18.6)
  band(trim, front, -0.3, 2 * PX + 0.3, 17.2, 17.6, 0.98)
  const PF = S([-PX - 0.3, PY - 0.9], [PX + 0.3, PY - 0.9])
  pediment(stone, trim, PF, PX + 0.3, PX + 0.3, 19.2, 22.4, 0.5, 0.6, 0.6)
  wbox(trim, PF, -0.6, 2 * PX + 1.2, 18.55, 19.2, -0.6, 0.6)
  // portico roof: gable from the pediment back to the main block
  face(roof, [[-PX - 0.4, PY - 0.9, 18.95], [0, PY - 0.9, 22.3], [0, MY0, 22.3], [-PX - 0.4, MY0, 18.95]], [-3.35, 0, PX])
  face(roof, [[PX + 0.4, PY - 0.9, 18.95], [0, PY - 0.9, 22.3], [0, MY0, 22.3], [PX + 0.4, MY0, 18.95]], [3.35, 0, PX])
  for (const sx of [-1, 1]) {
    // portico side faces: string course and arched windows
    const side = sx > 0 ? S([PX, PY], [PX, -43.2]) : S([-PX, -43.2], [-PX, PY])
    band(trim, side, 0, side.L, 9.5, 10.15, 0.3)
    warch(win, side, side.L / 2, 1.0, 11.2, 14.6, 0.05, AN)
    warch(win, side, side.L / 2, 1.0, 0.9, 5.0, 0.05, AN)
  }
  // pediment sculpture: two reclining figures either side of the city arms
  const TY = PY - 1.0
  recliner(trim, -2.6, TY, 19.25, 3.6, -1, D ? 7 : 4)
  recliner(trim, 2.6, TY, 19.25, 3.6, 1, D ? 7 : 4)
  ellipsoid(trim, [0, TY - 0.15, 20.6], [0.65, 0, 0], [0, 0.2, 0], [0, 0, 0.9], D ? 10 : 6, 4)
  if (D) for (const sx of [-1, 1]) { blob(trim, [sx * 7.4, TY - 0.25, 19.6], 0.7, 0.25, 0.35, 6, 3); blob(trim, [sx * 1.2, TY - 0.2, 20.5], 0.3, 0.2, 0.5, 6, 3) }
  // corner acroteria statues
  for (const sx of [-1, 1]) { box(stone, sx * 10.6, PY - 1.4, sx * 11.6, PY - 0.3, 19.2, 19.7); figure(trim, sx * 11.1, PY - 0.85, 19.7, 2.4, FIG, D) }
  // the green bronze chariot group behind the apex
  chariot(roof, 0, PY - 0.2, 22.45, D)

  // ---- quadrant and portico ground floor: arched openings flanking the porch
  for (const sx of [-1, 1]) {
    warch(win, front, PX + sx * 9.3, 1.0, 0.9, 5.4, 0.05, AN)
    if (D) wframe(trim, front, PX + sx * 9.3, 1.0, 0.9, 5.4, 0.3, 0.15, AN)
  }
  band(trim, front, 0, 2 * PX, 9.5, 10.15, 0.3)
  band(trim, front, 0, 2 * PX, 0, 0.9, 0.15)

  // ---- porch: three arches, a balcony on top, steps
  const QX = 7.6, QY = -53.7
  const pf = S([-QX, QY], [QX, QY])
  arcade(stone, (u, wv, z) => pf.M(u, z, -wv), 0, 2 * QX, 1.2, 0, 8.0, [-4.5, 0, 4.5].map((c) => ({ c: QX + c, hw: 1.55, zs: 5.9 })), AN)
  for (const sx of [-1, 1]) {
    const ps = sx > 0 ? S([QX, QY], [QX, PY]) : S([-QX, PY], [-QX, QY])
    arcade(stone, (u, wv, z) => ps.M(u, z, -wv), 0, ps.L, 1.2, 0, 8.0, [{ c: ps.L / 2, hw: 1.25, zs: 5.6 }], AN, false)
  }
  for (const c of [-4.5, 0, 4.5]) warch(win, front, PX + c, 1.5, 0.9, 5.9, 0.05, AN)
  box(stone, -QX, QY, QX, PY, 8.0, PORCH - 0.4)
  box(trim, -QX - 0.25, QY - 0.3, QX + 0.25, PY, PORCH - 0.4, PORCH)
  if (D) {
    for (const x of [-6.75, -2.25, 2.25, 6.75]) wbox(stone, pf, QX + x - 0.75, QX + x + 0.75, 0.9, 7.9, 0, 0.25, false)
  }
  band(trim, pf, -0.25, 2 * QX + 0.25, 7.0, 8.0, 0.3)
  // balcony: stone posts and a dark iron railing
  const posts = [-QX + 0.2, -2.25, 2.25, QX - 0.2]
  for (const x of posts) box(trim, x - 0.3, QY - 0.1, x + 0.3, QY + 0.5, PORCH, PORCH + 1.15)
  for (const sx of [-1, 1]) { box(trim, sx * QX - 0.3, -51.2, sx * QX + 0.3, -50.6, PORCH, PORCH + 1.15) }
  box(bronze, -QX + 0.4, QY + 0.1, QX - 0.4, QY + 0.25, PORCH, PORCH + 1.0)
  for (const sx of [-1, 1]) box(bronze, sx * QX - 0.12, QY + 0.4, sx * QX + 0.03 * sx, PY, PORCH, PORCH + 1.0)
  // steps
  const NS = D ? 6 : 3
  for (let k = 0; k < NS; k++) box(stone, -QX - 0.4, QY - 3.3 + (k * 3.3) / NS, QX + 0.4, QY, 0, (1.08 * (k + 1)) / NS)

  // ---- quadrant: half-columns at the loggia level on the portico corners (low only: pilasters)
  if (!D) for (const sx of [-1, 1]) { const qa = sx > 0 ? arc(11, -34.8, 8.4, -Math.PI / 2, 0) : arc(-11, -34.8, 8.4, Math.PI, 1.5 * Math.PI); for (const s of [qa.L / 3, (2 * qa.L) / 3]) { const m = qa.M(s, 0, 0.5); column(trim, m[0], m[1], 10.15, 17.4, 0.38, 5, false) } }

  const sandstone = { ...finish('oper-limestone', 0xe8dcc6), floodlight: floodWalls }
  return [
    { part: stone, material: sandstone },
    { part: trim, material: { ...PALETTE.trim, color: 0xf7ecdb, floodlight: floodWalls } },
    { part: roof, material: finish('oper-copper', 0x8fb3a1) },
    { part: win, material: PALETTE.window },
    { part: bronze, material: finish('oper-bronze', 0x57534e) },
    { part: ochre, material: { ...finish('oper-ochre', 0xe2d2b0), floodlight: floodWalls } },
  ]
}

/**
 * Pegasus, rearing, facing -y with its wings spread and raised, standing on
 * its hind legs at (x, y, z). About 4.6 m to the wing tips.
 */
export function pegasus(p: Part, x: number, y: number, z: number, D: boolean) {
  const nu = D ? 8 : 5, nv = D ? 5 : 3
  const P = (dx: number, dy: number, dz: number): V3 => [x + dx, y + dy, z + dz]
  // body, tilted 35 degrees up at the front
  const a = (35 * Math.PI) / 180
  const bodyC = P(0, -0.2, 1.75)
  ellipsoid(p, bodyC, [0.42, 0, 0], [0, -1.05 * Math.cos(a), 1.05 * Math.sin(a)], [0, 0.48 * Math.sin(a), 0.48 * Math.cos(a)], nu, nv)
  // neck and head
  limb(p, P(0, -0.85, 2.3), P(0, -1.15, 3.2), 0.24, nu - 2, 3, 0.3)
  limb(p, P(0, -1.1, 3.25), P(0, -1.65, 3.05), 0.16, nu - 2, 3, 0.2)
  if (D) { limb(p, P(-0.08, -1.05, 3.35), P(-0.08, -1.0, 3.55), 0.04, 4, 2); limb(p, P(0.08, -1.05, 3.35), P(0.08, -1.0, 3.55), 0.04, 4, 2) }
  // hind legs to the plinth
  for (const s of [-1, 1]) {
    limb(p, P(s * 0.25, 0.55, 1.4), P(s * 0.25, 0.45, 0.65), 0.15, 5, 3)
    limb(p, P(s * 0.25, 0.45, 0.7), P(s * 0.25, 0.25, 0.05), 0.09, 5, 3)
  }
  // forelegs raised and bent
  for (const s of [-1, 1]) {
    limb(p, P(s * 0.22, -0.75, 1.95), P(s * 0.22, -1.2, 1.55), 0.12, 5, 3)
    limb(p, P(s * 0.22, -1.2, 1.55), P(s * 0.22, -1.05, 1.0 + (s > 0 ? 0.25 : 0)), 0.08, 5, 3)
  }
  // tail down to the plinth: a strut for stability as on the real group
  limb(p, P(0, 0.75, 1.5), P(0, 1.05, 0.3), 0.14, 5, 3)
  // wings: tapered slabs rising up and back from the shoulders, outer feathers splayed
  for (const s of [-1, 1]) {
    const root0 = P(s * 0.3, -0.75, 2.3), root1 = P(s * 0.3, 0.05, 2.0)
    const tip = P(s * 1.7, 0.35, 4.5), mid0 = P(s * 1.0, -0.35, 3.55), mid1 = P(s * 1.35, 0.7, 2.75)
    const t = 0.07
    const out: V3[] = [root0, mid0, tip, mid1, root1]
    const nrm = norm(cross(sub(tip, root0), sub(root1, root0)))
    const top = out.map((q) => add(q, nrm, t)), bot = out.map((q) => add(q, nrm, -t))
    face(p, top, nrm)
    face(p, bot, scl(nrm, -1))
    for (let i = 0; i < out.length; i++) {
      const j = (i + 1) % out.length
      const e = sub(out[j], out[i]), sn = norm(cross(e, nrm))
      face(p, [top[i], top[j], bot[j], bot[i]], sn)
    }
    if (D) for (let f = 0; f < 4; f++) {
      // primaries splayed out of the trailing edge
      const base = add(mid1, sub(tip, mid1), 0.15 + f * 0.22), end = add(base, [s * 0.35, 0.45, -0.25 + f * 0.1])
      strut(p, base, end, 0.07, 0.03, 4)
    }
  }
}

/** The chariot group on the portico pediment: a seated figure in a car drawn by two panthers, facing -y. Green bronze. */
export function chariot(p: Part, x: number, y: number, z: number, D: boolean, k = 1.35) {
  const nu = D ? 7 : 4
  const Q = (dx: number, dy: number, dz: number): V3 => [x + dx * k, y + dy * k, z + dz * k]
  const bx = (x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) => { const a = Q(x0, y0, z0), b = Q(x1, y1, z1); box(p, a[0], a[1], b[0], b[1], a[2], b[2]) }
  bx(-1.5, -0.4, 1.5, 1.5, -0.25, 0.15)
  // the car, its wheels
  bx(-0.7, 0.2, 0.7, 1.3, 0.15, 1.0)
  for (const s of [-1, 1]) ellipsoid(p, Q(s * 0.78, 0.8, 0.65), [0.06 * k, 0, 0], [0, 0.5 * k, 0], [0, 0, 0.5 * k], nu + 1, 2)
  // the figure, seated high in the car, an arm raised with a lyre
  const f = Q(0, 0.75, 0.9)
  seated(p, f[0], f[1], f[2], 1.6 * k, nu)
  limb(p, Q(0.25, 0.7, 2.05), Q(0.5, 0.5, 2.75), 0.08 * k, 4, 2)
  if (D) bx(0.32, 0.4, 0.68, 0.56, 2.6, 3.15)
  // two panthers leaping forward
  for (const s of [-1, 1]) {
    const px = s * 0.65
    ellipsoid(p, Q(px, -0.6, 0.85), [0.22 * k, 0, 0], [0, -0.75 * k, 0.25 * k], [0, 0.08 * k, 0.24 * k], nu, 4)
    blob(p, Q(px, -1.4, 1.2), 0.18 * k, 0.22 * k, 0.17 * k, nu, 3)
    limb(p, Q(px, -1.05, 0.85), Q(px, -1.45, 0.35), 0.07 * k, 4, 2)
    limb(p, Q(px, -0.1, 0.7), Q(px, 0.05, 0.15), 0.08 * k, 4, 2)
    limb(p, Q(px, 0.05, 0.95), Q(px + s * 0.1, 0.55, 0.6), 0.04 * k, 4, 2)
  }
}

if (import.meta.main && process.env.STATS) for (const D of [false, true]) console.log(D, build(D).map((m) => `${m.material.name}:${m.part.triangles}`).join(' '))
else if (import.meta.main) await writeLods(ID, 'Alte Oper', ANCHOR, BEARING, build(false), build(true))
