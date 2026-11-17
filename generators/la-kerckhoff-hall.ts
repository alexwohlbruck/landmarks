/**
 * Kerckhoff Hall (1931, Allison & Allison), UCLA, Westwood — original
 * procedural geometry, CC0-1.0.
 *
 *   bun generators/la-kerckhoff-hall.ts
 *
 * Also the small kit the other UCLA brick halls import (la-haines-hall,
 * la-fowler-museum): real 3D arcades and recessed arched openings (round,
 * pointed or square-headed, as porches, loggias, blind recesses or open
 * screens), bay windows, gablets, merlons and spired turrets. Importing
 * this file builds nothing; Kerckhoff is only written when it is run
 * directly.
 *
 * Frame: x east, y north, z up, metres; bearing 0 (the outline is square to
 * the compass within 0.7°). Origin at the OSM outline's area centroid
 * (-118.443570, 34.070435), on the lowest ground under the footprint:
 * 127.7 m NAVD88, the north lawn and the south walk (USGS 3DEP). The
 * Kerckhoff patio on the east side is 4.3 m higher (132.0 m), so the
 * patio-side facade detail starts 4.3 m up.
 *
 * Collegiate Gothic student union in tapestry brick and buff cast stone: a
 * square entrance tower at the west end of the north front, with four
 * corner buttresses that turn into octagonal turrets and spires, a
 * crenellated parapet, a stone oriel and a porch of three pointed arches at
 * its foot; a four-storey north range with stone buttresses rising into
 * pinnacle stubs, gablets over the bays and two canted stone bay windows;
 * a pointed-arch arcade with a terrace on top along the patio. The tower,
 * its spires and the buttressed, gabled north front are the identity. The
 * roofs are flat behind parapets (NAIP and lidar), not pitched.
 *
 * Evidence
 * - Plan: OSM way/422876581 (building=university, height 25.9, 4 levels;
 *   LA County bld_id 427322848363). way/422876519 is the bridge to
 *   Ackerman Union and is left to the map.
 * - Heights: USGS_LPC_CA_LosAngeles_2016_LAS_2018 (2016 flight), 0.5 m
 *   grid, read in this frame over the 127.7 m ground (lidar_frame.py):
 *   tower roof 22.3, corner spire tips 25.0–29.4 (thin, under-read; 30.5
 *   used, from photos: the spires stand about a third of the tower above
 *   its parapet), north range 15.5 (16.4 at its east end), central block
 *   13.3, south pavilion 17.5 with corner peaks 18.5, south-east wing 11.4,
 *   patio arcade terrace 9.6, west wing 8.6, its low south part 4.6, the
 *   louvred penthouse 20.1. The tower and the north range match the photo
 *   proportions (tower parapet 1.4× the range).
 * - Photos (Wikimedia Commons), compared with renders from the same side:
 *   k1 "Kerckhoff Hall.JPG" (Josh Lee, CC BY-SA 3.0) — the north front
 *      and tower from the north-east;
 *   k2 "Kerckhoff Hall behind tree.JPG" (Josh Lee, CC BY-SA 3.0) — the
 *      north front, bay windows and tower from the north;
 *   k3 "Legally Blonde filming location at Kerckhoff Hall at UCLA.jpg"
 *      (Logan Ward, CC BY 2.0) — the north front from the north-east,
 *      the triple-arched porch;
 *   k4 "Kerckhoff Hall, UCLA (2007).jpg" (Nikhil Kulkarni, CC BY-SA 3.0) —
 *      the patio arcade, terrace and the tower's spires from the
 *      south-east;
 *   kn "Kerkhoff Hall, night, UCLA.jpg" (sebi ryffel, CC BY-SA 2.0) — the
 *      tower floodlit from below, lit windows;
 *   USGS NAIP for the flat roofs (neutral grey membrane, #abaaa4) and the patio.
 * - The large windows, bay windows and tower windows carry proud cast-stone
 *   mullions and transoms (2–4 lights, a transom about every 2 m), as in
 *   k1–k3; the unphotographed sides keep flat stone surrounds.
 * - Colour: sampled from the sunlit patio photo (k4): brick #b39a8f, cast
 *   stone #d6cfbf; pulled to the palette's lightness beside Royce Hall's
 *   brick and stone (la-royce-hall), a shade browner as Kerckhoff's
 *   tapestry brick is.
 *
 * Estimated: bay positions and window sizes (from k1–k3 against the lidar
 * heights), the porch depth (2.5 m), the oriel (from the OSM bump on the
 * tower's north face and k1), the buttress and gablet sizes, the patio
 * arcade bays (five, k4; four on the south-east wing's arcade, which only
 * lidar shows).
 * Doubts: no licensed photo shows the south and west sides or the
 * south-east wing: they are drawn plain from lidar, and the south
 * pavilion's canted bay from the OSM outline. The tower's east face is
 * drawn like its north face above the range.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, rect, prism, panel, archPanel, cap, cylinder, save, wallLen, onWall, walls } from './la-getty-center'

// ===========================================================================
// Kit
// ===========================================================================

/** The outward normal of wall a→b (a counter-clockwise ring edge: outside on the right). */
export function wallNormal(a: XY, b: XY): V3 {
  const L = wallLen(a, b)
  return [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]
}
const wallDir = (a: XY, b: XY): V3 => {
  const L = wallLen(a, b)
  return [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0]
}
type SZ = [number, number]
const area2 = (p: SZ, q: SZ, r: SZ) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])

/** A triangle in wall coordinates (s along a→b, z up), `out` in front of the wall, facing n. */
function wtri(p: Part, a: XY, b: XY, out: number, n: V3, A: SZ, B: SZ, C: SZ) {
  if (Math.abs(area2(A, B, C)) < 1e-6) return
  p.tri(onWall(a, b, A[0], A[1], out), onWall(a, b, B[0], B[1], out), onWall(a, b, C[0], C[1], out), undefined, undefined, undefined, [n, n, n])
}
function wquad(p: Part, a: XY, b: XY, out: number, n: V3, A: SZ, B: SZ, C: SZ, D: SZ) {
  wtri(p, a, b, out, n, A, B, C)
  wtri(p, a, b, out, n, A, C, D)
}

export type ArchKind = 'round' | 'pointed' | 'flat'
export type Opening = { o0: number; o1: number; zs: number; spring: number; crown: number; pts: SZ[] }

/**
 * An opening from o0 to o1 along a wall, from sill zs up to `crown`.
 * `round` is a true semicircle; `pointed` a two-centred arch whose arcs
 * have radius f × width (0.5 is round, 1 equilateral); `flat` is square-headed.
 */
export function opening(o0: number, o1: number, zs: number, crown: number, kind: ArchKind = 'round', f = 0.8, seg = 8): Opening {
  const w = o1 - o0, c = (o0 + o1) / 2
  if (kind === 'flat') return { o0, o1, zs, spring: crown, crown, pts: [[o0, crown], [c, crown], [o1, crown]] }
  if (kind === 'round') {
    const r = w / 2, spring = crown - r, pts: SZ[] = []
    for (let k = 0; k <= seg; k++) {
      const t = Math.PI - (Math.PI * k) / seg
      pts.push([c + r * Math.cos(t), spring + r * Math.sin(t)])
    }
    return { o0, o1, zs, spring, crown, pts }
  }
  const R = f * w, te = Math.acos(0.5 / f - 1), spring = crown - R * Math.sin(te), half = seg / 2, pts: SZ[] = []
  for (let k = 0; k <= half; k++) {
    const t = Math.PI - ((Math.PI - te) * k) / half
    pts.push([o0 + R + R * Math.cos(t), spring + R * Math.sin(t)])
  }
  for (let k = 1; k <= half; k++) {
    const t = Math.PI - te - ((Math.PI - te) * k) / half
    pts.push([o1 - R + R * Math.cos(t), spring + R * Math.sin(t)])
  }
  return { o0, o1, zs, spring, crown, pts }
}

/** The wall face of one bay [sb0, sb1] × [z0, zTop] with an opening cut out of it. */
function bayFace(p: Part, a: XY, b: XY, out: number, n: V3, sb0: number, sb1: number, z0: number, zTop: number, op: Opening) {
  const { o0, o1, zs, spring, pts } = op
  if (zs > z0 + 1e-3) wquad(p, a, b, out, n, [sb0, z0], [sb1, z0], [sb1, zs], [sb0, zs])
  if (o0 > sb0 + 1e-3 && spring > zs) wquad(p, a, b, out, n, [sb0, zs], [o0, zs], [o0, spring], [sb0, spring])
  if (sb1 > o1 + 1e-3 && spring > zs) wquad(p, a, b, out, n, [o1, zs], [sb1, zs], [sb1, spring], [o1, spring])
  if (zTop <= op.crown + 1e-3) {
    // only the spandrels below the crown line
    const L: SZ = [sb0, op.crown], R: SZ = [sb1, op.crown], m = Math.floor(pts.length / 2)
    wtri(p, a, b, out, n, L, [sb0, spring], pts[0])
    for (let k = 0; k < m; k++) wtri(p, a, b, out, n, L, pts[k], pts[k + 1])
    for (let k = m; k < pts.length - 1; k++) wtri(p, a, b, out, n, R, pts[k], pts[k + 1])
    wtri(p, a, b, out, n, R, pts[pts.length - 1], [sb1, spring])
    return
  }
  const L: SZ = [sb0, zTop], R: SZ = [sb1, zTop], m = Math.floor(pts.length / 2)
  wtri(p, a, b, out, n, L, [sb0, spring], pts[0])
  for (let k = 0; k < m; k++) wtri(p, a, b, out, n, L, pts[k], pts[k + 1])
  wtri(p, a, b, out, n, L, pts[m], R)
  for (let k = m; k < pts.length - 1; k++) wtri(p, a, b, out, n, R, pts[k], pts[k + 1])
  wtri(p, a, b, out, n, R, pts[pts.length - 1], [sb1, spring])
}

/** The reveals of an opening, from `out0` back to `out1`, facing into it. */
function reveals(p: Part, a: XY, b: XY, out0: number, out1: number, op: Opening, sill = false) {
  const u = wallDir(a, b)
  const q: SZ[] = [[op.o0, op.zs], ...op.pts, [op.o1, op.zs]]
  if (sill) q.push([op.o0, op.zs])
  for (let i = 0; i < q.length - 1; i++) {
    const ds = q[i + 1][0] - q[i][0], dz = q[i + 1][1] - q[i][1], l = Math.hypot(ds, dz)
    if (l < 1e-6) continue
    const ns = dz / l, nz = -ds / l
    const n: V3 = [u[0] * ns, u[1] * ns, nz]
    const A = onWall(a, b, q[i][0], q[i][1], out0), B = onWall(a, b, q[i + 1][0], q[i + 1][1], out0)
    const C = onWall(a, b, q[i + 1][0], q[i + 1][1], out1), D = onWall(a, b, q[i][0], q[i][1], out1)
    p.tri(A, B, C, undefined, undefined, undefined, [n, n, n])
    p.tri(A, C, D, undefined, undefined, undefined, [n, n, n])
  }
}

/** The opening's own shape as a flat panel at `out`, facing n: a door, a window, the dark of a recess. */
export function openingPanel(p: Part, a: XY, b: XY, out: number, op: Opening, inset = 0) {
  const n = wallNormal(a, b)
  const sh = inset ? opening(op.o0 + inset, op.o1 - inset, op.zs + inset * 0.5, op.crown - inset, 'round') : op
  const ring: SZ[] = [[op.o0 + inset, op.zs + inset * 0.5], ...(inset ? sh.pts : op.pts), [op.o1 - inset, op.zs + inset * 0.5]]
  const c: SZ = [(op.o0 + op.o1) / 2, op.zs + inset * 0.5]
  for (let i = 0; i < ring.length - 1; i++) wtri(p, a, b, out, n, c, ring[i], ring[i + 1])
}

export type ArcadeOpts = {
  /** extent along the wall */
  s0: number
  s1: number
  /** number of openings */
  n: number
  /** opening width */
  w: number
  /** foot of the front wall, sill of the openings, crown of the openings, top of the front wall */
  z0: number
  zs: number
  crown: number
  z1: number
  kind?: ArchKind
  f?: number
  seg?: number
  /** pier depth: how far the reveals run back */
  t: number
  /**
   * Depth from the front face to the back wall. Equal to t: blind recesses
   * with `back` panels at their back. Larger: a porch or loggia whose back
   * wall is the caller's own wall at -L.
   */
  L?: number
  /** panels at the back of each opening (window, entrance) */
  back?: Part | null
  /** open right through: a free-standing screen, both faces drawn */
  through?: boolean
  /** a porch standing proud: draw its end walls and its top */
  ends?: boolean
  top?: Part | null
  /** cap the porch ceiling at the crown */
  ceil?: boolean
  /** a floor inside the porch at the sill (for a raised loggia) */
  floor?: boolean
  /** close the underside of a proud arcade */
  bottom?: boolean
  /** extra openings fed by the caller, e.g. a wider centre arch */
  widths?: number[]
}

/**
 * A row of openings in a wall face a→b (the front face, outside on the
 * right): real 3D piers, arches and reveals. See ArcadeOpts.
 */
export function arcade(face: Part, a: XY, b: XY, o: ArcadeOpts) {
  const n = wallNormal(a, b), back: V3 = [-n[0], -n[1], 0]
  const L = o.L ?? o.t, bay = (o.s1 - o.s0) / o.n
  const ops: Opening[] = []
  for (let k = 0; k < o.n; k++) {
    const c = o.s0 + bay * (k + 0.5), w = o.widths?.[k] ?? o.w
    const op = opening(c - w / 2, c + w / 2, o.zs, o.crown, o.kind ?? 'round', o.f ?? 0.8, o.seg ?? 8)
    ops.push(op)
    const sb0 = o.s0 + bay * k, sb1 = sb0 + bay
    bayFace(face, a, b, 0, n, sb0, sb1, o.z0, o.z1, op)
    reveals(face, a, b, 0, -o.t, op, o.through || o.zs > o.z0 + 0.05)
    if (o.through) bayFace(face, a, b, -o.t, back, sb0, sb1, o.z0, o.z1, op)
    else if (L <= o.t + 1e-3) { if (o.back) openingPanel(o.back, a, b, -o.t, op) }
    else {
      // the back of the piers and spandrels, seen from inside the porch
      bayFace(face, a, b, -o.t, back, sb0, sb1, o.zs, op.crown, op)
      if (o.back) openingPanel(o.back, a, b, -L + 0.05, op, 0)
    }
  }
  const crown = Math.max(...ops.map((p) => p.crown))
  const u = wallDir(a, b)
  if (o.through || L > o.t + 1e-3) {
    if (L > o.t + 1e-3 && o.ceil !== false) {
      // porch ceiling at the crown, facing down
      const dn: V3 = [0, 0, -1]
      face.tri(onWall(a, b, o.s0, crown, -o.t), onWall(a, b, o.s1, crown, -o.t), onWall(a, b, o.s1, crown, -L), undefined, undefined, undefined, [dn, dn, dn])
      face.tri(onWall(a, b, o.s0, crown, -o.t), onWall(a, b, o.s1, crown, -L), onWall(a, b, o.s0, crown, -L), undefined, undefined, undefined, [dn, dn, dn])
      if (o.floor) {
        const up: V3 = [0, 0, 1]
        face.tri(onWall(a, b, o.s0, o.zs, -o.t), onWall(a, b, o.s1, o.zs, -o.t), onWall(a, b, o.s1, o.zs, -L), undefined, undefined, undefined, [up, up, up])
        face.tri(onWall(a, b, o.s0, o.zs, -o.t), onWall(a, b, o.s1, o.zs, -L), onWall(a, b, o.s0, o.zs, -L), undefined, undefined, undefined, [up, up, up])
      }
      // the porch's inner end walls, facing along the wall into it
      const e0: V3 = [u[0], u[1], 0], e1: V3 = [-u[0], -u[1], 0]
      for (const [s, nn] of [[o.s0, e0], [o.s1, e1]] as [number, V3][]) {
        const A = onWall(a, b, s, o.zs, -o.t), B = onWall(a, b, s, o.zs, -L), C = onWall(a, b, s, crown, -L), D = onWall(a, b, s, crown, -o.t)
        face.tri(A, B, C, undefined, undefined, undefined, [nn, nn, nn])
        face.tri(A, C, D, undefined, undefined, undefined, [nn, nn, nn])
      }
    }
  }
  const depth = o.through ? o.t : L
  if (o.ends || o.through) {
    const e0: V3 = [-u[0], -u[1], 0], e1: V3 = [u[0], u[1], 0]
    for (const [s, nn] of [[o.s0, e0], [o.s1, e1]] as [number, V3][]) {
      const A = onWall(a, b, s, o.z0, 0), B = onWall(a, b, s, o.z0, -depth), C = onWall(a, b, s, o.z1, -depth), D = onWall(a, b, s, o.z1, 0)
      face.tri(A, B, C, undefined, undefined, undefined, [nn, nn, nn])
      face.tri(A, C, D, undefined, undefined, undefined, [nn, nn, nn])
    }
  }
  if (o.top) {
    const up: V3 = [0, 0, 1]
    o.top.tri(onWall(a, b, o.s0, o.z1, 0), onWall(a, b, o.s1, o.z1, 0), onWall(a, b, o.s1, o.z1, -depth), undefined, undefined, undefined, [up, up, up])
    o.top.tri(onWall(a, b, o.s0, o.z1, 0), onWall(a, b, o.s1, o.z1, -depth), onWall(a, b, o.s0, o.z1, -depth), undefined, undefined, undefined, [up, up, up])
  }
  if (o.bottom) {
    const dn: V3 = [0, 0, -1]
    face.tri(onWall(a, b, o.s0, o.z0, 0), onWall(a, b, o.s1, o.z0, 0), onWall(a, b, o.s1, o.z0, -depth), undefined, undefined, undefined, [dn, dn, dn])
    face.tri(onWall(a, b, o.s0, o.z0, 0), onWall(a, b, o.s1, o.z0, -depth), onWall(a, b, o.s0, o.z0, -depth), undefined, undefined, undefined, [dn, dn, dn])
  }
  return ops
}

/**
 * Openings in an existing wall a→b: the arcade stands `t` proud of the
 * wall, so its reveals run back to the wall face and the panels behind the
 * openings lie on it. Reads as openings recessed `t` into a raised frame.
 */
export function proudArcade(face: Part, a: XY, b: XY, o: ArcadeOpts) {
  const n = wallNormal(a, b), d = o.t
  const A: XY = [a[0] + n[0] * d, a[1] + n[1] * d], B: XY = [b[0] + n[0] * d, b[1] + n[1] * d]
  return arcade(face, A, B, { ...o, t: d - 0.03, L: undefined, ends: true, top: o.top ?? face, bottom: o.bottom ?? o.z0 > 0.05 })
}

/**
 * A bay window standing `d` out from wall a→b over [s0, s1], z0 to z1:
 * canted sides (or square), a lid, a soffit when it starts above the
 * ground, and a window panel on every face between `zw0` and `zw1`.
 */
export function bayWindow(body: Part, win: Part | null, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, d: number, o: { canted?: boolean; zw?: [number, number][]; lid?: Part; margin?: number; grid?: { part: Part; lights?: number; side?: number; every?: number; bar?: number } } = {}) {
  const k = o.canted === false ? 0 : Math.min(d * 0.8, (s1 - s0) * 0.3)
  const plan: XY[] = [[s0, 0], [s0 + k, d], [s1 - k, d], [s1, 0]]
  const W = plan.map(([s, out]) => { const p = onWall(a, b, s, 0, out); return [p[0], p[1]] as XY })
  for (let i = 0; i < 3; i++) {
    const A = W[i], B = W[i + 1]
    if (wallLen(A, B) < 1e-3) continue
    body.quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1])
    const L = wallLen(A, B), m = Math.min(o.margin ?? 0.25, L * 0.2)
    if (win) for (const [w0, w1] of o.zw ?? [[z0 + 0.6, z1 - 0.6]]) {
      panel(win, A, B, m, L - m, w0, w1, 0.05)
      if (o.grid) {
        const g = o.grid, front = i === 1
        tracery(g.part, A, B, m, L - m, w0, w1, { lights: front ? g.lights ?? 3 : g.side ?? 1, every: g.every ?? 2.2, bar: g.bar, frame: false })
      }
    }
  }
  // lid and soffit over the bay's plan (A, B, C, D run along the outside; close on the wall)
  const ring: XY[] = [W[3], W[2], W[1], W[0]].reverse()
  cap(o.lid ?? body, ring, z1)
  if (z0 > 0.3) cap(body, ring, z0, false)
}

/** A proud stone bar on wall a→b over [s0, s1] × [z0, z1], `d` deep: front, sides, top and bottom. */
export function bar(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, d = 0.14, out = 0.02) {
  const n = wallNormal(a, b), u = wallDir(a, b), o1 = out + d
  wquad(p, a, b, o1, n, [s0, z0], [s1, z0], [s1, z1], [s0, z1])
  const side = (s: number, nn: V3) => {
    const A = onWall(a, b, s, z0, out), B = onWall(a, b, s, z0, o1), C = onWall(a, b, s, z1, o1), D = onWall(a, b, s, z1, out)
    p.tri(A, B, C, undefined, undefined, undefined, [nn, nn, nn]); p.tri(A, C, D, undefined, undefined, undefined, [nn, nn, nn])
  }
  side(s0, [-u[0], -u[1], 0]); side(s1, [u[0], u[1], 0])
  const flat = (z: number, nn: V3) => {
    const A = onWall(a, b, s0, z, out), B = onWall(a, b, s1, z, out), C = onWall(a, b, s1, z, o1), D = onWall(a, b, s0, z, o1)
    p.tri(A, B, C, undefined, undefined, undefined, [nn, nn, nn]); p.tri(A, C, D, undefined, undefined, undefined, [nn, nn, nn])
  }
  flat(z1, [0, 0, 1])
}

/**
 * Stone tracery over a window on wall a→b: `lights` lights divided by proud
 * mullions, a transom about every `every` metres, and a frame round it all.
 */
export function tracery(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, o: { lights?: number; every?: number; bar?: number; frame?: boolean; d?: number } = {}) {
  const w = o.bar ?? 0.2, n = o.lights ?? 2, d = o.d ?? 0.14
  const rows = Math.max(1, Math.round((z1 - z0) / (o.every ?? 2.2)))
  for (let k = 1; k < n; k++) { const s = s0 + ((s1 - s0) * k) / n; bar(p, a, b, s - w / 2, s + w / 2, z0, z1, d) }
  for (let k = 1; k < rows; k++) { const z = z0 + ((z1 - z0) * k) / rows; bar(p, a, b, s0, s1, z - w / 2, z + w / 2, d) }
  if (o.frame === true) {
    bar(p, a, b, s0 - w, s0, z0 - w, z1 + w, d); bar(p, a, b, s1, s1 + w, z0 - w, z1 + w, d)
    bar(p, a, b, s0, s1, z1, z1 + w, d); bar(p, a, b, s0, s1, z0 - w, z0, d)
  } else if (o.frame !== false) panel(p, a, b, s0 - w, s1 + w, z0 - w, z1 + w, 0.03)
}

/** A gablet: a triangular parapet of thickness out0→out1 standing on wall a→b from z up to z + h. */
export function gablet(p: Part, a: XY, b: XY, g0: number, g1: number, z: number, h: number, out0 = 0.15, out1 = -0.35) {
  const n = wallNormal(a, b), bk: V3 = [-n[0], -n[1], 0], c = (g0 + g1) / 2
  wtri(p, a, b, out0, n, [g0, z], [g1, z], [c, z + h])
  wtri(p, a, b, out1, bk, [g0, z], [g1, z], [c, z + h])
  // the two sloped copings
  const u = wallDir(a, b), half = (g1 - g0) / 2, l = Math.hypot(half, h)
  for (const [sA, sB, side] of [[g0, c, -1], [c, g1, 1]] as [number, number, number][]) {
    const nn: V3 = [u[0] * side * (h / l), u[1] * side * (h / l), half / l]
    const zA = sA === g0 ? z : z + h, zB = sB === g1 ? z : z + h
    const A = onWall(a, b, sA, zA, out0), B = onWall(a, b, sB, zB, out0), C = onWall(a, b, sB, zB, out1), D = onWall(a, b, sA, zA, out1)
    p.tri(A, B, C, undefined, undefined, undefined, [nn, nn, nn])
    p.tri(A, C, D, undefined, undefined, undefined, [nn, nn, nn])
  }
}

/** Merlons along each side of an axis-aligned rectangle: `n` per side, w wide, from z to z + h. */
export function merlons(p: Part, x0: number, y0: number, x1: number, y1: number, z: number, h: number, n: number, w: number, t = 0.45, skipEnds = 1.2) {
  for (const [ax, ay, bx, by] of [[x0, y0, x1, y0], [x1, y0, x1, y1], [x1, y1, x0, y1], [x0, y1, x0, y0]]) {
    const L = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / L, uy = (by - ay) / L, nx = uy, ny = -ux
    const span = L - 2 * skipEnds
    for (let k = 0; k < n; k++) {
      const s = skipEnds + (span * (k + 0.5)) / n
      const cx = ax + ux * s - nx * (t / 2), cy = ay + uy * s - ny * (t / 2)
      const hx = Math.abs(ux) * w / 2 + Math.abs(nx) * t / 2, hy = Math.abs(uy) * w / 2 + Math.abs(ny) * t / 2
      prism(p, p, rect(cx - hx, cy - hy, cx + hx, cy + hy), z, z + h, { corner: 0.05, bevel: 0.08 })
    }
  }
}

/** A spired turret: an octagonal shaft r from z0 to z1, a collar, and a spire to z2. */
export function turret(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, z2: number, seg = 8) {
  cylinder(p, cx, cy, r, z0, z1, seg)
  cylinder(p, cx, cy, r * 1.18, z1, z1 + 0.35, seg, { bottom: p })
  cylinder(p, cx, cy, r * 1.05, z1 + 0.35, z2, seg, { r1: 0.04 })
}

/** A plain flat-topped block with softened corners. */
export const block = (wall: Part, top: Part | null, r: XY[], z0: number, z1: number, corner = 0.2, bevel = 0.15) => prism(wall, top, r, z0, z1, { corner, bevel })

/** A flat semicircular ring (an arch's voussoirs) on wall a→b: centre s = c, radii r0 < r1, springing at z. */
export function archRing(p: Part, a: XY, b: XY, c: number, r0: number, r1: number, z: number, out = 0.03, seg = 10) {
  const n = wallNormal(a, b)
  for (let k = 0; k < seg; k++) {
    const t0 = Math.PI - (Math.PI * k) / seg, t1 = Math.PI - (Math.PI * (k + 1)) / seg
    const P = (r: number, t: number): SZ => [c + r * Math.cos(t), z + r * Math.sin(t)]
    wquad(p, a, b, out, n, P(r1, t0), P(r1, t1), P(r0, t1), P(r0, t0))
  }
}

/** A flat disc (a roundel, a rose window) on wall a→b at (s, z). */
export function disc(p: Part, a: XY, b: XY, s: number, z: number, r: number, out = 0.05, seg = 12) {
  const n = wallNormal(a, b)
  for (let k = 0; k < seg; k++) {
    const t0 = (2 * Math.PI * k) / seg, t1 = (2 * Math.PI * (k + 1)) / seg
    wtri(p, a, b, out, n, [s, z], [s + r * Math.cos(t0), z + r * Math.sin(t0)], [s + r * Math.cos(t1), z + r * Math.sin(t1)])
  }
}

/**
 * A gabled roof over an axis-aligned rectangle, ridge along its longer side,
 * eaves overhanging by `eave` on the long sides, flush at the gables. The
 * gable triangles are drawn in `gable`, in the wall planes.
 */
export function gableRoof(tile: Part, gable: Part, x0: number, y0: number, x1: number, y1: number, z: number, rise: number, eave = 0.5) {
  const alongX = x1 - x0 >= y1 - y0
  const [l0, l1, w0, w1] = alongX ? [x0, x1, y0, y1] : [y0, y1, x0, x1]
  const P = (l: number, w: number, zz: number): V3 => (alongX ? [l, w, zz] : [w, l, zz])
  const wm = (w0 + w1) / 2, half = (w1 - w0) / 2, drop = (eave * rise) / half
  // Part.tri with explicit normals fixes the winding, so give each face its outward normal
  const face = (part: Part, pts: V3[], n: V3) => {
    const l = Math.hypot(...n), m: V3 = [n[0] / l, n[1] / l, n[2] / l]
    for (let i = 1; i < pts.length - 1; i++) part.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [m, m, m])
  }
  const N = (dl: number, dw: number, dz: number): V3 => (alongX ? [dl, dw, dz] : [dw, dl, dz])
  face(tile, [P(l0, w0 - eave, z - drop), P(l1, w0 - eave, z - drop), P(l1, wm, z + rise), P(l0, wm, z + rise)], N(0, -rise, half))
  face(tile, [P(l1, w1 + eave, z - drop), P(l0, w1 + eave, z - drop), P(l0, wm, z + rise), P(l1, wm, z + rise)], N(0, rise, half))
  face(tile, [P(l1, w0 - eave, z - drop), P(l0, w0 - eave, z - drop), P(l0, w0, z), P(l1, w0, z)], N(0, rise * 0.2, -half))
  face(tile, [P(l0, w1 + eave, z - drop), P(l1, w1 + eave, z - drop), P(l1, w1, z), P(l0, w1, z)], N(0, -rise * 0.2, -half))
  face(gable, [P(l0, w1, z), P(l0, w0, z), P(l0, wm, z + rise)], N(-1, 0, 0))
  face(gable, [P(l1, w0, z), P(l1, w1, z), P(l1, wm, z + rise)], N(1, 0, 0))
}

/** Bands as `bands`, on one wall a→b only, leaving out the spans in `gaps`. */
export function wallBands(p: Part, a: XY, b: XY, zs: [number, number][], gaps: [number, number][] = [], out = 0.03) {
  const L = wallLen(a, b)
  const cuts = [0, ...gaps.flat(), L]
  for (const [z0, z1] of zs) for (let i = 0; i < cuts.length; i += 2) {
    const s0 = cuts[i], s1 = cuts[i + 1]
    if (s1 > s0 + 0.05) panel(p, a, b, s0, s1, z0, z1, out)
  }
}

/** The four faces of an axis-aligned rectangle as counter-clockwise wall edges a→b. */
export function faces(x0: number, y0: number, x1: number, y1: number) {
  return {
    S: [[x0, y0], [x1, y0]] as [XY, XY],
    E: [[x1, y0], [x1, y1]] as [XY, XY],
    N: [[x1, y1], [x0, y1]] as [XY, XY],
    W: [[x0, y1], [x0, y0]] as [XY, XY],
  }
}

/** Thin bands of a contrasting finish wrapped round an axis-aligned block, `out` proud. */
export function bands(p: Part, x0: number, y0: number, x1: number, y1: number, zs: [number, number][], out = 0.03, skip: string[] = []) {
  const f = faces(x0, y0, x1, y1)
  for (const [k, [a, b]] of Object.entries(f)) {
    if (skip.includes(k)) continue
    const L = wallLen(a, b)
    for (const [z0, z1] of zs) panel(p, a, b, -out, L + out, z0, z1, out)
  }
}

// ===========================================================================
// Kerckhoff Hall
// ===========================================================================

function buildKerckhoff() {
  const O = [-118.44357, 34.070435] as const
  const brick = new Part(), stone = new Part(), roof = new Part(), win = new Part(), door = new Part()
  const PATIO = 4.3
  /** a window with its stone mullions, transoms and surround */
  const W = (a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out = 0.05) => {
    panel(win, a, b, s0, s1, z0, z1, Math.max(out, 0.06))
    tracery(stone, a, b, s0, s1, z0, z1, { lights: Math.max(1, Math.round((s1 - s0) / 0.85)), every: 2.0, bar: 0.2, d: 0.16 })
  }
  /** a window on the unphotographed sides: a flat stone surround only */
  const Wp = (a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out = 0.05) => {
    panel(stone, a, b, s0 - 0.2, s1 + 0.2, z0 - 0.2, z1 + 0.2, 0.03)
    panel(win, a, b, s0, s1, z0, z1, Math.max(out, 0.06))
  }

  // ---------- massing ----------
  // central block (13.3), with its short return to the patio
  block(brick, roof, [[-10.2, -24.9], [8.1, -24.9], [8.1, -11.9], [12.5, -11.9], [12.5, -7.6], [8.1, -7.6], [8.1, 12.0], [-10.2, 12.0]], 0, 13.3)
  // west wing: two storeys (8.6), a one-storey south part (4.6)
  block(brick, roof, rect(-20.5, -3.5, -10.25, 29.1), 0, 8.6)
  block(brick, roof, rect(-22.7, -24.5, -10.25, -3.5), 0, 4.6)
  // north range (15.5) on a cast-stone ground storey
  block(stone, null, rect(2.55, 12.05, 25.85, 25.05), 0, 4.0, 0.2, 0)
  block(brick, roof, rect(2.6, 12.1, 25.8, 25.0), 4.0, 15.5)
  // south-east wing (11.4)
  block(brick, roof, rect(8.2, -25.3, 27.6, -14.0), 0, 11.4)
  // south pavilion (17.5)
  block(brick, roof, rect(-0.9, -26.3, 8.0, -19.6), 0, 17.5)
  // louvred penthouse on the north range (20.1)
  block(stone, roof, rect(6.6, 16.5, 11.0, 23.0), 15.0, 20.1)

  // copings: a stone band at every parapet
  const coping = (x0: number, y0: number, x1: number, y1: number, z: number) => bands(stone, x0, y0, x1, y1, [[z - 0.5, z]], 0.06)
  coping(2.6, 12.1, 25.8, 25.0, 15.5)
  coping(-20.5, -3.5, -10.25, 29.1, 8.6)
  coping(8.2, -25.3, 27.6, -14.0, 11.4)
  coping(-0.9, -26.3, 8.0, -19.6, 17.5)

  // ---------- the tower ----------
  const TX0 = -10.2, TX1 = 2.6, TY0 = 12.0, TY1 = 25.3, TOP = 22.3, PORCH = 6.6, PD = 2.4
  block(brick, null, rect(TX0, TY0, TX1, TY1 - PD), 0, PORCH, 0.1, 0)
  const tw = block(brick, roof, rect(TX0, TY0, TX1, TY1), PORCH, TOP + 0.6, 0.2, 0)
  cap(stone, tw.ring, PORCH, false) // the porch ceiling
  // stone string courses and the parapet
  bands(stone, TX0, TY0, TX1, TY1, [[PORCH, PORCH + 0.6], [TOP - 1.4, TOP - 0.8]], 0.06)
  bands(stone, TX0, TY0, TX1, TY1, [[TOP - 0.4, TOP + 0.6]], 0.12)
  merlons(stone, TX0, TY0, TX1, TY1, TOP + 0.6, 0.8, 3, 1.3, 0.45, 2.1)
  // corner buttresses → octagonal turrets → spires
  const B = 1.6
  for (const [cx, cy] of [[TX0, TY0], [TX1, TY0], [TX1, TY1], [TX0, TY1]] as XY[]) {
    const x = cx + (cx < 0 ? B / 2 - 0.35 : -B / 2 + 0.35), y = cy + (cy < 18 ? B / 2 - 0.35 : -B / 2 + 0.35)
    block(stone, stone, rect(x - B / 2, y - B / 2, x + B / 2, y + B / 2), 0, TOP + 0.2, 0.12, 0.15)
    turret(stone, x, y, 1.0, TOP + 0.2, TOP + 3.8, 30.5)
  }
  // pinnacles on the parapet, two a face
  for (const [x, y] of [[-6.0, TY1 - 0.1], [-1.6, TY1 - 0.1], [-6.0, TY0 + 0.1], [-1.6, TY0 + 0.1], [TX0 + 0.1, 16.4], [TX0 + 0.1, 20.9], [TX1 - 0.1, 16.4], [TX1 - 0.1, 20.9]] as XY[])
    cylinder(stone, x, y, 0.3, TOP + 1.4, TOP + 4.2, 4, { r1: 0.03 })
  // the porch: three pointed arches between the corner buttresses
  {
    const [a, b] = faces(TX0, TY0, TX1, TY1).N
    const ops = arcade(stone, a, b, { s0: 1.25, s1: 11.55, n: 3, w: 2.5, z0: 0, zs: 0, crown: 5.4, z1: PORCH, kind: 'pointed', f: 0.75, t: 0.7, L: PD, back: door })
    void ops
  }
  // the oriel over the porch and a tall window over it
  {
    const [a, b] = faces(TX0, TY0, TX1, TY1).N
    bayWindow(stone, win, a, b, 4.95, 9.35, 7.6, 15.6, 0.9, { grid: { part: stone, lights: 3, side: 1 }, zw: [[8.4, 11.2], [12.0, 14.8]] })
    W(a, b, 5.9, 8.4, 16.4, 20.2, 0.05)
    for (const s of [2.4, 10.4]) W(a, b, s - 0.55, s + 0.55, 9.0, 13.2, 0.05)
  }
  // the west face above the wing, the east face above the range, the south face above the block
  {
    const f = faces(TX0, TY0, TX1, TY1)
    for (const k of ['W', 'E'] as const) {
      const [a, b] = f[k], L = wallLen(a, b), z0 = k === 'W' ? 9.6 : 16.2
      for (const s of [L / 2 - 2.2, L / 2 + 2.2]) W(a, b, s - 0.75, s + 0.75, z0, k === 'W' ? 14.0 : 20.4, 0.05)
      if (k === 'W') for (const s of [L / 2 - 2.2, L / 2 + 2.2]) W(a, b, s - 0.75, s + 0.75, 16.2, 20.4, 0.05)
    }
    const [a, b] = f.S, L = wallLen(a, b)
    W(a, b, L / 2 - 1.6, L / 2 + 1.6, 15.2, 20.4, 0.05)
  }

  // ---------- the north range: buttresses, gablets, windows, bay windows ----------
  {
    const [a, b] = faces(2.6, 12.1, 25.8, 25.0).N, Lr = wallLen(a, b) // s runs west from x 25.8
    const sx = (x: number) => 25.8 - x
    // buttresses between the bays, rising into capped stubs above the parapet
    for (const x of [6.8, 11.45, 16.05, 20.7, 25.35]) {
      const c = 25.0
      block(stone, stone, rect(x - 0.4, c - 0.1, x + 0.4, c + 0.6), 0, 16.9, 0.1, 0.12)
      cylinder(stone, x, c + 0.25, 0.48, 16.9, 18.0, 4, { r1: 0.05 })
    }
    // five bays: window groups, two canted stone bay windows
    for (const [x, bay] of [[4.6, false], [9.1, true], [13.75, false], [18.4, true], [23.0, false]] as [number, boolean][]) {
      const s = sx(x)
      if (bay) bayWindow(stone, win, a, b, s - 1.6, s + 1.6, 0.4, 10.4, 0.8, { grid: { part: stone, lights: 3, side: 1 }, zw: [[1.2, 4.6], [5.4, 9.4]] })
      else {
        W(a, b, s - 1.25, s + 1.25, 1.1, 9.4, 0.06)
      }
      W(a, b, s - 1.1, s + 1.1, 10.9, 14.6, 0.06)
      gablet(stone, a, b, s - 1.7, s + 1.7, 15.5, 2.0)
    }
    void Lr
  }
  // east end of the range: a canted bay, windows
  {
    const [a, b] = faces(2.6, 12.1, 25.8, 25.0).E
    bayWindow(stone, win, a, b, 3.2, 8.8, 0.4, 10.4, 1.3, { grid: { part: stone, lights: 3, side: 1 }, zw: [[1.2, 4.6], [5.6, 9.6]] })
    for (const s of [1.6, 10.9]) W(a, b, s - 0.8, s + 0.8, 6.0, 14.0, 0.05)
  }

  // ---------- the patio arcade along the range, a terrace on top ----------
  {
    const A: XY = [8.2, 8.1], Bp: XY = [25.5, 8.1]
    arcade(stone, A, Bp, { s0: 0, s1: 17.3, n: 5, w: 2.95, z0: 0, zs: PATIO, crown: PATIO + 4.0, z1: 9.6, kind: 'pointed', f: 0.62, t: 0.6, L: 4.0, back: win, ends: true, top: roof })
    // shafts on the piers, up to the frieze
    for (let k = 0; k <= 5; k++) {
      const x = 8.2 + (17.3 / 5) * k, x0 = k === 0 ? x : x - 0.28, x1 = k === 5 ? x : x + 0.28
      block(stone, stone, rect(x0, 7.7, x1, 8.15), 0, PATIO + 4.1, 0.05, 0.1)
    }
    bands(stone, 8.2, 8.1, 25.5, 12.1, [[PATIO + 4.1, PATIO + 4.5]], 0.08, ['N'])
    // the porch's back wall is the range's south face (y 12.1); windows above the terrace
    const [ra, rb] = faces(2.6, 12.1, 25.8, 25.0).S
    for (const x of [10.4, 13.9, 23.6]) W(ra, rb, x - 2.6 - 1.0, x - 2.6 + 1.0, 10.4, 14.2, 0.05)
    bayWindow(stone, win, ra, rb, 14.0, 17.2, 10.0, 12.9, 0.9, { grid: { part: stone, lights: 3, side: 1 }, canted: false, zw: [[10.6, 12.4]] })
  }
  // the patio arcade along the south-east wing
  {
    const A: XY = [26.5, -11.9], Bp: XY = [12.5, -11.9] // faces north
    arcade(stone, A, Bp, { s0: 0, s1: 14.0, n: 4, w: 2.95, z0: 0, zs: PATIO, crown: PATIO + 3.7, z1: 8.9, kind: 'pointed', f: 0.62, t: 0.6, L: 2.1, back: win, ends: true, top: roof })
  }
  // the central block's patio face and the wing's upper windows
  {
    const [a, b] = [[8.1, -7.6], [8.1, 12.0]] as [XY, XY]
    for (const s of [2.2, 6.0, 9.8, 13.6]) {
      W(a, b, s - 1.2, s + 1.2, PATIO + 0.8, PATIO + 3.6, 0.05)
      W(a, b, s - 0.9, s + 0.9, PATIO + 4.6, PATIO + 7.6, 0.05)
    }
    const [c, d] = faces(8.2, -25.3, 27.6, -14.0).N
    for (const s of [3.0, 6.5, 10.0]) W(c, d, s - 1.0, s + 1.0, 9.0, 10.8, 0.05)
  }

  // ---------- plain sides: south, west, east ----------
  {
    // central block south face (x -10.2 … -0.9)
    const a: XY = [-10.2, -24.9], b: XY = [-0.9, -24.9]
    for (const s of [2.3, 6.9]) for (const [z0, z1] of [[1.0, 4.4], [5.4, 8.6], [9.6, 12.4]]) Wp(a, b, s - 1.0, s + 1.0, z0, z1, 0.05)
    // south pavilion: a canted bay and windows
    const [pa, pb] = faces(-0.9, -26.3, 8.0, -19.6).S
    bayWindow(stone, win, pa, pb, 2.2, 6.9, 0.4, 14.0, 2.0, { zw: [[1.2, 4.6], [5.4, 8.8], [9.6, 13.0]] })
    for (const k of [0, 1, 2, 3]) {
      const x = -0.9 + (k === 0 ? 0.25 : k === 1 ? 8.65 : k === 2 ? 0.25 : 8.65), y = k < 2 ? -26.05 : -19.85
      cylinder(stone, x, y, 0.45, 17.5, 19.0, 4, { r1: 0.05 })
    }
    for (const [z0, z1] of [[15.0, 16.8]]) Wp(pa, pb, 3.0, 5.9, z0, z1, 0.05)
    // south-east wing
    const [sa, sb] = faces(8.2, -25.3, 27.6, -14.0).S
    for (const s of [3.0, 7.4, 11.8, 16.2]) for (const [z0, z1] of [[1.2, 4.8], [6.0, 9.8]]) Wp(sa, sb, s - 1.1, s + 1.1, z0, z1, 0.05)
    const [ea, eb] = faces(8.2, -25.3, 27.6, -14.0).E
    bayWindow(stone, win, ea, eb, 3.0, 7.2, PATIO, 10.4, 1.1, { zw: [[PATIO + 0.8, 9.6]] })
    // west wing: three canted bays, two rows of windows, a gablet on its north end
    const [wa, wb] = faces(-20.5, -3.5, -10.25, 29.1).W
    for (const y of [2.35, 10.55, 18.9]) {
      const s = 29.1 - y
      bayWindow(stone, win, wa, wb, s - 1.35, s + 1.35, 0.4, 7.4, 0.7, { zw: [[1.0, 3.6], [4.4, 6.8]] })
    }
    for (const y of [-1.0, 6.4, 14.7, 23.2, 27.0]) {
      const s = 29.1 - y
      Wp(wa, wb, s - 0.8, s + 0.8, 1.0, 3.6, 0.05)
      Wp(wa, wb, s - 0.8, s + 0.8, 4.6, 7.2, 0.05)
    }
    const [na, nb] = faces(-20.5, -3.5, -10.25, 29.1).N
    for (const s of [2.6, 7.65]) {
      Wp(na, nb, s - 1.1, s + 1.1, 1.0, 3.6, 0.05)
      Wp(na, nb, s - 1.1, s + 1.1, 4.6, 7.4, 0.05)
    }
    gablet(stone, na, nb, 2.4, 7.85, 8.6, 2.2)
    const [la, lb] = faces(-22.7, -24.5, -10.25, -3.5).W
    for (const s of [3.5, 10.5, 17.5]) Wp(la, lb, s - 1.4, s + 1.4, 0.9, 3.6, 0.05)
    const [lsa, lsb] = faces(-22.7, -24.5, -10.25, -3.5).S
    for (const s of [3.0, 9.4]) Wp(lsa, lsb, s - 1.4, s + 1.4, 0.9, 3.6, 0.05)
    // central block's upper west face over the wing
    const cw: [XY, XY] = [[-10.2, 12.0], [-10.2, -24.9]]
    for (const s of [6.0, 13.0, 20.0, 27.0, 32.0]) Wp(cw[0], cw[1], s - 0.9, s + 0.9, 9.6, 12.4, 0.05)
  }

  // ---------- night: the tower is floodlit from below; the range's stone base catches it ----------
  const lit = (p: V3, n: V3) => {
    if (n[2] > 0.6) return 0
    const tower = p[0] > TX0 - 1.2 && p[0] < TX1 + 1.2 && p[1] > TY0 + 1 && p[1] < TY1 + 1.5
    if (tower && n[1] > 0.3) return Math.max(0.35, 0.9 - p[2] / 60)
    if (tower && n[0] > 0.3) return 0.45
    if (p[1] > 24.5 && n[1] > 0.3 && p[2] < 10.5) return 0.4
    return 0
  }

  // Typed apart: `save` takes a Swatch, and the floodlight field rides along to writeGlb.
  const brickLit: MaterialSpec = { ...finish('kerckhoff-brick', 0xbb897b), floodlight: lit }
  const stoneLit: MaterialSpec = { ...finish('kerckhoff-stone', 0xe2d8c5), floodlight: lit }
  save('la-kerckhoff-hall', 'Kerckhoff Hall', [
    { part: brick, material: brickLit },
    { part: stone, material: stoneLit },
    { part: roof, material: finish('kerckhoff-roof', 0xaeaca5) },
    { part: win, material: { ...PALETTE.window, color: 0x5f6870 } },
    { part: door, material: PALETTE.entrance },
  ], { bearing: 0, elevation: 0, height: 30.5, replaces: ['way/422876581'] }, 6500)
  void O; void walls; void archPanel
}

if (import.meta.main) buildKerckhoff()
