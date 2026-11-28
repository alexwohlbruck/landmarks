/**
 * Marina 101, Dubai Marina — original procedural geometry, CC0-1.0.
 * bun generators/dubai-marina-101.ts   (writes the low model and the detail LOD)
 *
 * Also exports the small facade kit (Face, rectFaces, onFace, facePanel, faceBox, rowsOf,
 * baysOf, panelGrid, punched, wallsExcept, shell, gableRing, blade, bladeP, shard) that
 * dubai-princess-tower.ts and dubai-23-marina.ts import: merge this generator first.
 *
 * Frame: bearing 40.6 (the OSM part's long sides). Origin = area centroid of the tower part
 * way/195527261 (55.1486244 E, 25.0890563 N), on the ground. Elevation 0.
 *
 * Form, as read from OSM and the photos:
 * - a slender square shaft (OSM part 38.0 x 41.1 m) with notched corners and a proud bay
 *   in the middle of each face, rising straight to 381 m;
 * - the lower shaft (to ~300 m) in grey-beige stone with grouped punched windows, broken by
 *   a pale band at ~208 m; the upper shaft (300-381 m) in pale reflective glass with cream
 *   piers (the photos' change of tone two-thirds of the way up);
 * - the crown (381-425 m): blue glass shards in two rings on every face, stepping up and
 *   back toward the middle with tops sloping down toward the corners, round a small inner
 *   tier whose faces rise to points (face-on: a middle peak flanked by two sharp peaks,
 *   then two steps down to each corner);
 * - the three-storey podium (OSM way/1074877791).
 *
 * Evidence
 * - OSM (API, fetched 2026-11-27): tower part way/195527261 (building:part, 101 levels,
 *   height 432, wikidata Q1165269, checked against Wikidata: "Marina 101" at 25.08898,
 *   55.14863); podium way/1074877791 (building=yes, 3 levels). No outline relation.
 * - Published: architectural height 425 m, 101 floors, top floor 371 m (Wikipedia "Marina
 *   101", CTBUH). OSM's 432 m was not used.
 * - Photos (Wikimedia Commons):
 *   "Dubai Marina Skyline.jpg", Norlando Pobre, CC BY 2.0, 2020, from the north-west
 *   (~320 deg, telephoto): crown shards, shaft tone change, relative heights of the three
 *   towers; https://commons.wikimedia.org/wiki/File:Dubai_Marina_Skyline.jpg
 *   "The Tallest Block (29839279175).jpg", Steven Straiton, CC BY 2.0, 2016, from the west
 *   (~290 deg): crown (under construction, unclad top), colours of the stone and glass;
 *   https://commons.wikimedia.org/wiki/File:The_Tallest_Block_(29839279175).jpg
 *   "Marina 101.png", Jackedi07, CC0: elevation diagram, proportions of the crown;
 *   https://commons.wikimedia.org/wiki/File:Marina_101.png
 * - No lidar, NAIP or Mapillary here. Terrain: Mapterhorn z12 only (z13-15 404).
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 425 m top. Measured (OSM): the plan and the podium. Estimated (photos): the
 *   shaft top 381 m and the shard heights (383, 397, 410 m), the tone change at 300 m, the
 *   band at 208 m, the bay (13 m wide, 0.9 m proud) and corner notches (1.6 m); the podium
 *   height (15 m, from 3 levels). Invented: the punched-window grouping (three storeys).
 *
 * Doubts
 * - The south and east sides are only seen in distant skyline shots; the faces are drawn
 *   alike (the building is symmetric in every photo).
 * - The real crown has more, thinner shards; drawn as two rings and an inner tier.
 * - The tone change and the colours rest on two photos four years apart (the 2016 one shows
 *   the tower unfinished).
 *
 * Night: the windows (`window`, `window-2`) glow; the crown shards are dark `glass`.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { K, type P2 } from './taipei-101'
import { face, saveLods, type Layer } from './auckland-sky-tower'

// ============================================================ shared kit (also used by
// dubai-princess-tower.ts and dubai-23-marina.ts)

/** One straight face of a plan: centre, unit tangent (CCW from above), outward normal, half length. */
export type Face = { c: P2; t: P2; n: P2; L: number }

/** The four faces of an axis-aligned rectangle of half sizes X, Y, CCW from the east face. */
export function rectFaces(X: number, Y: number): Face[] {
  return [
    { c: [X, 0], t: [0, 1], n: [1, 0], L: Y },
    { c: [0, Y], t: [-1, 0], n: [0, 1], L: X },
    { c: [-X, 0], t: [0, -1], n: [-1, 0], L: Y },
    { c: [0, -Y], t: [1, 0], n: [0, -1], L: X },
  ]
}

/** A point on a face: `s` along it, `out` beyond it. */
export const onFace = (f: Face, s: number, out: number): P2 => [f.c[0] + f.t[0] * s + f.n[0] * out, f.c[1] + f.t[1] * s + f.n[1] * out]

/** A flat quad on a face, s0..s1 along it, z0..z1, `out` in front of the face line. */
export function facePanel(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, out: number) {
  const a = onFace(f, s0, out), b = onFace(f, s1, out)
  face(p, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], [f.n[0], f.n[1], 0])
}

/** A proud box strip on a face (pier, fin or slab): s0..s1, z0..z1, standing `d` out from `out0`. */
export function faceBox(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, out0: number, d: number, top = true, bottom = false) {
  const r: P2[] = [onFace(f, s0, out0), onFace(f, s1, out0), onFace(f, s1, out0 + d), onFace(f, s0, out0 + d)]
  K.prism(p, r, z0, z1, top, bottom)
}

/** Window rows from z0 to z1: groups of `h` metres with `gap` spandrels between (the last row trimmed). */
export function rowsOf(z0: number, z1: number, h: number, gap: number): [number, number][] {
  const out: [number, number][] = []
  for (let z = z0; z + 0.5 * h <= z1; z += h) out.push([z + gap / 2, Math.min(z + h, z1) - gap / 2])
  return out
}

/** Bays across a span s0..s1: `n` panels with `pier` between them and at the ends. */
export function baysOf(s0: number, s1: number, n: number, pier: number): [number, number][] {
  const w = (s1 - s0 - pier * (n + 1)) / n
  return Array.from({ length: n }, (_, k) => [s0 + pier + k * (w + pier), s0 + pier + k * (w + pier) + w] as [number, number])
}

/** A grid of flat window panels on a face. */
export function panelGrid(p: Part, f: Face, bays: [number, number][], rows: [number, number][], out: number) {
  for (const [z0, z1] of rows) for (const [s0, s1] of bays) facePanel(p, f, s0, s1, z0, z1, out)
}

/**
 * A hollow shell standing on z0 whose top follows a ring of heights: the outer wall,
 * a rim `rim` wide and the inner wall back down to z0 (so it reads as a blade
 * from every side and from above). `ring` is CCW from above.
 */
export function shell(p: Part, ring: P2[], z0: number, top: number[], rim: number) {
  const inner = K.offset(ring, -rim)
  const lo = K.at(ring, z0), hi = K.at(ring, (i) => top[i])
  const ilo = K.at(inner, z0), ihi = K.at(inner, (i) => top[i])
  K.loft(p, lo, hi)
  K.loft(p, hi, ihi)
  K.loft(p, [...ihi].reverse(), [...ilo].reverse())
}

/** A ring of points round a rectangle with the corners and the face middles (and optional extra splits). */
export function gableRing(X: number, Y: number, split = 0): { ring: P2[]; mid: number[] } {
  // returns points CCW from (X,-Y); `mid` = 1 at a face middle, 0 at a corner, linear between
  const ring: P2[] = [], mid: number[] = []
  const corners: P2[] = [[X, -Y], [X, Y], [-X, Y], [-X, -Y]]
  const n = 2 + 2 * split
  for (let k = 0; k < 4; k++) {
    const a = corners[k], b = corners[(k + 1) % 4]
    for (let i = 0; i < n; i++) {
      const u = i / n
      ring.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u])
      mid.push(1 - Math.abs(2 * u - 1))
    }
  }
  return { ring, mid }
}

/**
 * A thin vertical blade on a face from s0 to s1 (either order), standing on z0, its top
 * sloping from zt0 (at s0) to zt1 (at s1); `out` in front of the face line, `thick` deep
 * (it extends inward from there).
 */
export function blade(p: Part, f: Face, s0: number, s1: number, z0: number, zt0: number, zt1: number, out: number, thick: number) {
  const [a0, a1, zA, zB] = s0 < s1 ? [s0, s1, zt0, zt1] : [s1, s0, zt1, zt0]
  const fo = (s: number, o: number) => onFace(f, s, o)
  const A = fo(a0, out), B = fo(a1, out), Ai = fo(a0, out - thick), Bi = fo(a1, out - thick)
  const n: V3 = [f.n[0], f.n[1], 0], tv: V3 = [f.t[0], f.t[1], 0]
  const P = (q: P2, z: number): V3 => [q[0], q[1], z]
  face(p, [P(A, z0), P(B, z0), P(B, zB), P(A, zA)], n) // front
  face(p, [P(Bi, z0), P(Ai, z0), P(Ai, zA), P(Bi, zB)], [-n[0], -n[1], 0]) // back
  face(p, [P(Ai, z0), P(A, z0), P(A, zA), P(Ai, zA)], [-tv[0], -tv[1], 0]) // end at a0
  face(p, [P(B, z0), P(Bi, z0), P(Bi, zB), P(B, zB)], tv) // end at a1
  // the sloped top
  const L = a1 - a0, dz = zB - zA, l = Math.hypot(L, dz) || 1
  const tn: V3 = [(-dz / l) * tv[0], (-dz / l) * tv[1], L / l]
  face(p, [P(A, zA), P(B, zB), P(Bi, zB), P(Ai, zA)], tn)
}

/**
 * A thin vertical blade on a face whose top follows `top`, (s, z) points in either
 * direction along the face (a convex outline: rising, flat or falling once), standing on
 * z0, `out` in front of the face line and `thick` deep.
 */
export function bladeP(p: Part, f: Face, top: [number, number][], z0: number, out: number, thick: number) {
  const pts = top[0][0] < top[top.length - 1][0] ? top : [...top].reverse()
  const n: V3 = [f.n[0], f.n[1], 0], tv: V3 = [f.t[0], f.t[1], 0]
  const P = (s: number, o: number, z: number): V3 => { const q = onFace(f, s, o); return [q[0], q[1], z] }
  const s0 = pts[0][0], s1 = pts[pts.length - 1][0]
  const front: V3[] = [P(s0, out, z0), P(s1, out, z0), ...[...pts].reverse().map(([s, z]) => P(s, out, z))]
  const back: V3[] = [P(s1, out - thick, z0), P(s0, out - thick, z0), ...pts.map(([s, z]) => P(s, out - thick, z))]
  face(p, front, n)
  face(p, back, [-n[0], -n[1], 0])
  face(p, [P(s0, out - thick, z0), P(s0, out, z0), P(s0, out, pts[0][1]), P(s0, out - thick, pts[0][1])], [-tv[0], -tv[1], 0])
  const zl = pts[pts.length - 1][1]
  face(p, [P(s1, out, z0), P(s1, out - thick, z0), P(s1, out - thick, zl), P(s1, out, zl)], tv)
  for (let i = 0; i < pts.length - 1; i++) {
    const [sa, za] = pts[i], [sb, zb] = pts[i + 1]
    const L = sb - sa, dz = zb - za, l = Math.hypot(L, dz) || 1
    const tn: V3 = [(-dz / l) * tv[0], (-dz / l) * tv[1], L / l]
    face(p, [P(sa, out, za), P(sb, out, zb), P(sb, out - thick, zb), P(sa, out - thick, za)], tn)
  }
}

/**
 * A solid shard on a face: its plan spans s0..s1 along the face and o0..o1 in front of it
 * (o1 < o0: further in), standing on z0; its top vertices take their height from T.
 */
export function shard(p: Part, f: Face, s0: number, s1: number, o0: number, o1: number, z0: number, T: (q: P2) => number) {
  const ring = K.ccw([onFace(f, s0, o0), onFace(f, s1, o0), onFace(f, s1, o1), onFace(f, s0, o1)])
  const top = ring.map((q) => [q[0], q[1], T(q)] as V3)
  const bot = ring.map((q) => [q[0], q[1], z0] as V3)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const e: P2 = [ring[j][0] - ring[i][0], ring[j][1] - ring[i][1]]
    face(p, [bot[i], bot[j], top[j], top[i]], [e[1], -e[0], 0])
  }
  const u = [top[1][0] - top[0][0], top[1][1] - top[0][1], top[1][2] - top[0][2]]
  const v = [top[3][0] - top[0][0], top[3][1] - top[0][1], top[3][2] - top[0][2]]
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  face(p, top, n[2] < 0 ? [-n[0], -n[1], -n[2]] : n)
}

/**
 * A punched wall on a face (s0..s1, z0..z1 on the face line): solid piers and spandrels in
 * `wall`, each opening (bays x rows) recessed `depth` with its reveals in `wall` and a
 * window panel at the back in `win`.
 */
export function punched(wall: Part, win: Part, f: Face, s0: number, s1: number, z0: number, z1: number, bays: [number, number][], rows: [number, number][], depth: number) {
  const n: V3 = [f.n[0], f.n[1], 0], tv: V3 = [f.t[0], f.t[1], 0]
  const P = (s: number, z: number, o = 0): V3 => { const q = onFace(f, s, o); return [q[0], q[1], z] }
  const quad = (p: Part, sa: number, sb: number, za: number, zb: number, o = 0) => face(p, [P(sa, za, o), P(sb, za, o), P(sb, zb, o), P(sa, zb, o)], n)
  // piers: before, between and after the bays, full height
  const edges = [s0, ...bays.flat(), s1]
  for (let i = 0; i < edges.length; i += 2) if (edges[i + 1] - edges[i] > 1e-6) quad(wall, edges[i], edges[i + 1], z0, z1)
  // spandrels inside each bay column, and the openings
  const zs = [z0, ...rows.flat(), z1]
  for (const [a, b] of bays) {
    for (let i = 0; i < zs.length; i += 2) if (zs[i + 1] - zs[i] > 1e-6) quad(wall, a, b, zs[i], zs[i + 1])
    for (const [ra, rb] of rows) {
      quad(win, a, b, ra, rb, -depth)
      face(wall, [P(a, ra, -depth), P(b, ra, -depth), P(b, ra, 0), P(a, ra, 0)], [0, 0, 1]) // sill
      face(wall, [P(a, rb, 0), P(b, rb, 0), P(b, rb, -depth), P(a, rb, -depth)], [0, 0, -1]) // head
      face(wall, [P(a, ra, -depth), P(a, ra, 0), P(a, rb, 0), P(a, rb, -depth)], tv) // jamb at a
      face(wall, [P(b, ra, 0), P(b, ra, -depth), P(b, rb, -depth), P(b, rb, 0)], [-tv[0], -tv[1], 0]) // jamb at b
    }
  }
}

/** Walls round a CCW ring from z0 to z1, leaving out the edges `skip` picks. */
export function wallsExcept(p: Part, ring: P2[], z0: number, z1: number, skip: (i: number) => boolean) {
  for (let i = 0; i < ring.length; i++) {
    if (skip(i)) continue
    const a = ring[i], b = ring[(i + 1) % ring.length]
    face(p, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], [b[1] - a[1], -(b[0] - a[0]), 0])
  }
}

// ============================================================ Marina 101

const ID = 'dubai-marina-101'
const BEARING = 40.6
const ANCHOR = { lng: 55.1486244, lat: 25.0890563 } // area centroid of the tower part way/195527261
const proj = K.projector(ANCHOR.lng, ANCHOR.lat, BEARING)
// OSM outlines (lon, lat)
const TOWER_LL: P2[] = [[55.1486133, 25.0893085], [55.1483477, 25.0890263], [55.1486355, 25.0888041], [55.1489012, 25.0890863]]
const PODIUM_LL: P2[] = [[55.1486435, 25.0886585], [55.1481937, 25.0890188], [55.1485648, 25.0893923], [55.1490297, 25.0890209]]

const TOP = 425 // architectural height (CTBUH)
const PODIUM = 15 // three storeys (OSM building:levels 3)
const SHAFT = 381 // top of the shaft: the crown's glass blades start here
const UPPER = 300 // the curtain wall changes from punched to glazed here
const BANDS = [208, UPPER] // pale bands at the mechanical floors

// plan: half sizes from the OSM part (38.0 x 41.1 m), corner notches and a proud central bay
const tw = TOWER_LL.map(proj)
const HX = Math.max(...tw.map((p) => Math.abs(p[0]))), HY = Math.max(...tw.map((p) => Math.abs(p[1])))
const X = (Math.abs(tw[0][0]) + Math.abs(tw[1][0]) + Math.abs(tw[2][0]) + Math.abs(tw[3][0])) / 4
const Y = (Math.abs(tw[0][1]) + Math.abs(tw[1][1]) + Math.abs(tw[2][1]) + Math.abs(tw[3][1])) / 4
const NOTCH = 1.6 // corner step (photos: the vertical grooves at each corner)
const BAY_W = 6.5 // half-width of the proud central bay
const BAY_E = 0.9 // how far it stands out

const FACES = rectFaces(X - BAY_E, Y - BAY_E) // the main face line sits inside the OSM edge; the bay reaches it

/** The plan ring, CCW: per face its two side walls, the bay, and a notched corner. */
function plan(scale = 1, notch = NOTCH): P2[] {
  const r: P2[] = []
  for (const f0 of FACES) {
    const f: Face = { c: [f0.c[0] * scale, f0.c[1] * scale], t: f0.t, n: f0.n, L: f0.L * scale }
    const w = BAY_W * scale
    r.push(onFace(f, -f.L + notch, 0), onFace(f, -w, 0), onFace(f, -w, BAY_E), onFace(f, w, BAY_E), onFace(f, w, 0), onFace(f, f.L - notch, 0), onFace(f, f.L - notch, -notch))
  }
  return r
}

type Set = { stone: Part; win: Part; glassWall: Part; crown: Part; roof: Part; trim: Part }
const mk = (): Set => ({ stone: new Part(), win: new Part(), glassWall: new Part(), crown: new Part(), roof: new Part(), trim: new Part() })

function build(s: Set, d: boolean) {
  const ring = plan()
  // ---- podium (OSM way/1074877791), cream stone with a band of shopfront glazing
  const pod = K.ccw(PODIUM_LL.map(proj))
  K.prism(s.stone, pod, 0, PODIUM - 1.2, false)
  K.band(s.trim, pod, PODIUM - 1.2, PODIUM, 0.4, 0.4)
  K.cap(s.roof, pod, PODIUM, true, [ring])
  for (let i = 0; i < pod.length; i++) {
    const a = pod[i], b = pod[(i + 1) % pod.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: P2 = [t[1], -t[0]]
    const f: Face = { c: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], t, n, L: L / 2 }
    panelGrid(s.win, f, baysOf(-L / 2 + 2, L / 2 - 2, d ? 8 : 4, 1.6), [[1.0, 5.5], [7.0, 12.4]], 0.05)
  }

  // ---- the shaft: punched lower section, a pale band, then the glazed upper section
  // in the detail model the lower side walls are punched (real reveals); elsewhere flat walls
  const sideEdge = (i: number) => i % 7 === 0 || i % 7 === 4
  wallsExcept(s.roof, ring, PODIUM, UPPER, (i) => (d && sideEdge(i)) || i % 7 === 2)
  K.prism(s.glassWall, ring, UPPER, SHAFT, false)
  // windows on the lower section: 3 storeys a panel (3.67 m storeys), two bays per wall
  const FLOOR = 3.67
  for (const f of FACES) {
    const sides: [number, number][] = [[-f.L + NOTCH, -BAY_W], [BAY_W, f.L - NOTCH]]
    const rows = rowsOf(PODIUM + 1.5, BANDS[0] - 1.5, FLOOR * 3, 0.8).concat(rowsOf(BANDS[0] + 2, UPPER - 1.5, FLOOR * 3, 0.8))
    for (const [a, b] of sides) {
      if (d) punched(s.roof, s.win, f, a, b, PODIUM, UPPER, baysOf(a, b, 2, 1.1), rows, 0.45)
      else panelGrid(s.win, f, baysOf(a, b, 2, 1.1), rows, 0.05)
    }
    // the bay carries a taller glass strip broken at each group (it reads lighter in the photos)
    // the proud bay is punched in both models (its glass set back in real reveals)
    punched(s.roof, s.glassWall, { ...f, c: onFace(f, 0, BAY_E) }, -BAY_W, BAY_W, PODIUM, UPPER, baysOf(-BAY_W, BAY_W, d ? 2 : 1, 1.0), rows, 0.45)
    // cream piers on the upper glass: at the bay edges and mid-wall (proud strips)
    const piers = [-f.L + NOTCH + 0.9, (-f.L + NOTCH - BAY_W) / 2, -BAY_W + 0.5, BAY_W - 0.5, (f.L - NOTCH + BAY_W) / 2, f.L - NOTCH - 0.9]
    for (const sx of piers) {
      const onBay = Math.abs(sx) < BAY_W
      faceBox(s.stone, f, sx - 0.55, sx + 0.55, PODIUM, SHAFT - 0.6, onBay ? BAY_E : 0, 0.35)
    }
    if (d) {
      // spandrel lines on the upper glass every three storeys, faint and proud
      for (let z = UPPER + FLOOR * 3; z < SHAFT - 3; z += FLOOR * 3) {
        for (const [a, b] of sides) facePanel(s.trim, f, a + 0.2, b - 0.2, z - 0.35, z + 0.35, 0.08)
        facePanel(s.trim, f, -BAY_W + 0.2, BAY_W - 0.2, z - 0.35, z + 0.35, BAY_E + 0.08)
      }
    }
  }
  for (const z of BANDS) K.band(s.trim, ring, z - 1.2, z + 1.2, 0.45, 0.3)
  // shaft top: a parapet band, the roof inside the crown
  K.band(s.stone, ring, SHAFT - 1.4, SHAFT, 0.5, 0.3)
  K.cap(s.roof, ring, SHAFT, true)

  // ---- the crown (381 -> 425 m, photos 2016 and 2020): glass shards in two rings on every
  // face, stepping up and back toward the middle, each top sloping down toward the corner,
  // round a small square inner tier whose faces rise to points at their middles. Face-on
  // this gives the photos' outline: a middle peak, a sharp peak either side of it (the
  // inner tier's side faces, seen edge-on), then two steps down to each corner.
  const RINGS = [
    { s0: 0.3, s1: 0.42, o0: -1.5, o1: -6.5, z0: 410, z1: 410 }, // middle ring: a ledge,
    { s0: 0.42, s1: 0.7, o0: -1.5, o1: -6.5, z0: 410, z1: 396.5 }, // then the slope
    { s0: 0.62, s1: 0.74, o0: 0, o1: -5.0, z0: 396.5, z1: 396.5 }, // outer ring
    { s0: 0.74, s1: 1.0, o0: 0, o1: -5.0, z0: 396.5, z1: 383 },
  ]
  for (const f of FACES) {
    for (const h of [-1, 1]) {
      for (const r of RINGS) {
        const L = f.L
        const T = (q: P2) => {
          const sAlong = Math.abs((q[0] - f.c[0]) * f.t[0] + (q[1] - f.c[1]) * f.t[1]) / L
          const out = (q[0] - f.c[0]) * f.n[0] + (q[1] - f.c[1]) * f.n[1]
          const w = (r.o0 - out) / (r.o0 - r.o1) // 0 at the front of the shard, 1 at its back
          // the top also falls toward the front, so the shards read as facets from the side
          return r.z0 + 3 + ((r.z1 - r.z0) * (sAlong - r.s0)) / (r.s1 - r.s0) - 7 * (1 - w)
        }
        shard(s.crown, f, h * r.s0 * L, h * r.s1 * L, r.o0, r.o1, SHAFT, T)
        if (d) {
          // a pale mullion along the shard's outer top edge (the photos' bright edges)
          const n: V3 = [f.n[0], f.n[1], 0]
          const a0 = onFace(f, h * r.s0 * L, r.o0 + 0.05), a1 = onFace(f, h * r.s1 * L, r.o0 + 0.05)
          const za = T(onFace(f, h * r.s0 * L, r.o0)), zb = T(onFace(f, h * r.s1 * L, r.o0))
          face(s.trim, [[a0[0], a0[1], za - 0.8], [a1[0], a1[1], zb - 0.8], [a1[0], a1[1], zb], [a0[0], a0[1], za]], n)
        }
      }
    }
  }
  // the inner tier: a square, each face rising from 413 m at the corners to a point at its middle
  const IN = 6.2
  const { ring: ir, mid: im } = gableRing(IN, IN, d ? 1 : 0)
  const itop = im.map((m) => 406 + (TOP - 406) * m)
  K.loft(s.crown, K.at(ir, SHAFT), K.at(ir, (i) => itop[i]))
  const ic: V3 = [0, 0, TOP - 2.5]
  for (let i = 0; i < ir.length; i++) {
    const j = (i + 1) % ir.length
    s.crown.tri([ir[i][0], ir[i][1], itop[i]], [ir[j][0], ir[j][1], itop[j]], ic)
  }
  // the core inside the shards, up to the inner ring (so no gap shows between them)
  const core = rectFaces(X - BAY_E - 6, Y - BAY_E - 6)
  K.prism(s.crown, core.map((f) => onFace(f, f.L, 0)), SHAFT, 404, true)
}

// ---- materials: colours sampled from the 2016 daylight photo and the 2020 dusk photo,
// pulled to the palette's lightness
const STONE: MaterialSpec = finish('m101-stone', 0xddd3c1)
const WIN: MaterialSpec = { ...PALETTE.window, color: 0x78838d }
const GLASS_WALL: MaterialSpec = windowVariant(2, 0xa9b9c5)
const CROWN: MaterialSpec = { ...PALETTE.glass, color: 0x8fa9c2 }
// the lower shaft's walls read grey-beige in the photos (they also serve as roofs)
const ROOF: MaterialSpec = finish('m101-stone-grey', 0xb4ada2)
const TRIM: MaterialSpec = PALETTE.trim
const layers = (s: Set): Layer[] => [
  { part: s.stone, material: STONE },
  { part: s.win, material: WIN },
  { part: s.glassWall, material: GLASS_WALL },
  { part: s.crown, material: CROWN },
  { part: s.roof, material: ROOF },
  { part: s.trim, material: TRIM },
]

if (import.meta.main) {
  const low = mk(), det = mk()
  build(low, false)
  build(det, true)
  void HX; void HY
  await saveLods(ID, 'Marina 101', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM tower part centroid, on the ground',
    bearing: BEARING, height: TOP,
  }, 6500)
}
