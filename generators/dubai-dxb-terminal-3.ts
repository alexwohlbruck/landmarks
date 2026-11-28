/**
 * Dubai International Airport (DXB), Concourse B and Terminal 3:
 * procedural, CC0-1.0, no textures.
 *
 *   bun generators/dubai-dxb-terminal-3.ts
 *
 * Writes two models, one per freestanding building (Terminal 3's halls are
 * under the apron, so the landside front and Concourse B stand 290 m apart
 * above ground):
 * - models/dubai-dxb-concourse-b.glb (low) and .detail.glb (detail: a
 *   smoother vault with its scallops drawn finer, and the jet bridges OSM
 *   maps): Concourse B with the lounge and link blocks beside it.
 * - models/dubai-dxb-terminal-3.glb (low) and .detail.glb (detail: rounder
 *   canopy arches and ribs): the landside front and its arrivals canopy.
 *
 * Also the small kit the other DXB models import (dubai-dxb-concourse-a,
 * dubai-dxb-terminal-1, dubai-dxb-terminal-2, dubai-dxb-concourse-d,
 * dubai-dxb-control-tower): the vaulted concourse with its glass
 * scallops, gate modules, outward-wound quads, OSM rings in a model frame,
 * and the writer with the batch budgets. Importing this file builds
 * nothing; the model is only written when it is run directly.
 *
 * What is modelled
 * - Concourse B (way/87185819; Emirates, 2008): one long vault, 920 m by
 *   62-101 m on OSM's lens-shaped outline (published: 945 m long, 90.8 m
 *   wide at the midpoint). Its look is the vault: silver metal shell with
 *   tall blue-grey glass "scallops" in every bay (#7f97a8, the top rows of
 *   each in the darker slate `window`), each a fin with a near-vertical
 *   edge and a curved one meeting at a point about three quarters of the way
 *   up, mirror-symmetric about the long axis, over a
 *   pale podium with teal glass gate modules. The ends are domed.
 *   [dubai-dxb-concourse-b]
 * - The white block on B's north-east side by the north-west end
 *   (way/264966382; the remote-gate lounges), and the link block on B's
 *   south-west side (way/742271052) toward the landside. OSM leaves gaps
 *   of 3.9 m and 2.5 m between them and B (no shared nodes), too narrow to
 *   be anything but the joint; drawn with B. The link block's south end is
 *   still 191 m from the T3 front. [dubai-dxb-concourse-b]
 * - Terminal 3's landside front (way/98425182) with its arrivals canopy
 *   (way/1360329006, building=roof): a long stone-clad front, its glazed
 *   ground floor, and a barrel canopy over the kerb on big grey arch ribs
 *   (Augapfel's photo). The departure and arrival halls themselves are 10 m
 *   under the apron (Wikipedia) and are not drawn. [dubai-dxb-terminal-3]
 * Not here: the Concourse B-C connector block and the control tower
 *   (way/385965965, dubai-dxb-control-tower), the Terminal 3 metro station
 *   (way/1361455313) and the car-park shades.
 *
 * Frame: x along the concourse (to bearing 120.65 deg, south-east), y to
 * the north-east, z up, metres; both models placed at bearing 30.65. The
 * rings are in one site frame whose origin is the area centroid of
 * way/87185819; each model is then moved onto its own anchor:
 * - dubai-dxb-concourse-b: the area centroid of way/87185819, lng
 *   55.3617236, lat 25.2483769 (site frame 0, 0).
 * - dubai-dxb-terminal-3: the area centroid of ways 98425182 and
 *   1360329006 together, lng 55.3599963, lat 25.245603 (site frame
 *   6.75, -352.52).
 * z = 0 is the apron; the site is flat (Mapterhorn z12: 4.6-6.1 m over the
 * whole field).
 *
 * Numbers
 * - Footprints: OSM ways above, as fetched from the OSM API in 2026-11
 *   (ODbL), turned into this frame.
 * - Vault crest 38 m above the apron: estimated. Wikipedia gives B "49.5 m
 *   high" (B has four basement floors) and the same-shaped Concourse A
 *   "40 m high in the centre from the apron level"; photos with the 87 m
 *   control tower beside B's end put the crest at 33-40 m.
 * - Podium 10 m, glass scallops from 10 m to three quarters of the arc,
 *   ~23 m bays (about 28 a side along A's 655 m on the ISS photo, four to a
 *   stand; an A380's wingspan covers four in mikecogh's photo): estimated.
 * - Gate modules: at the paired vertices OSM's outline has at every gate
 *   (about 62 m apart), 13 x 8 m, 15 m tall: estimated from photos.
 * - T3 front: 16 m (estimated from Augapfel's photo); canopy arches 20 m
 *   at the crown over a 23 m span (OSM's roof outline), estimated.
 *
 * Sources (evidence); [B] = Concourse B, [T3] = Terminal 3, [both]
 * - OSM ways 87185819, 264966382, 742271052 and the jet bridges
 *   (aeroway=jet_bridge) touching B [B]; 98425182, 1360329006 [T3].
 *   https://www.openstreetmap.org
 * - Wikipedia, "Dubai International Airport" (Concourse A and B
 *   dimensions, Terminal 3 10 m under the apron) [both].
 * - "Dubai International Airport Terminal three.JPG", VtTN, CC BY-SA 3.0,
 *   2012: https://commons.wikimedia.org/wiki/File:Dubai_International_Airport_Terminal_three.JPG
 * - "Emirates Terminal 3.jpg", Ahmedn97, CC BY-SA 3.0, 2012:
 *   https://commons.wikimedia.org/wiki/File:Emirates_Terminal_3.jpg
 * - "EK tERMINAL 3 Trip 2009 242.jpg", "Dubai Airport Trip 2009 211.jpg",
 *   "Dubai Airport Terminal 1 Trip 2009 213.jpg", MoHasanie, CC BY 3.0:
 *   https://commons.wikimedia.org/wiki/File:EK_tERMINAL_3_Trip_2009_242.jpg
 *   https://commons.wikimedia.org/wiki/File:Dubai_Airport_Trip_2009_211.jpg
 *   https://commons.wikimedia.org/wiki/File:Dubai_Airport_Terminal_1_Trip_2009_213.jpg
 * - "1 Dubai International Airport Terminal 3.jpg", EditQ, CC0, 2023:
 *   https://commons.wikimedia.org/wiki/File:1_Dubai_International_Airport_Terminal_3.jpg
 * - "Dubai Airport overview.jpg", Umair Shaikh, CC BY-SA 2.0 (aerial, plan
 *   of the vaults and their scallops):
 *   https://commons.wikimedia.org/wiki/File:Dubai_Airport_overview.jpg
 * - "The Home of Emirates", Augapfel, CC BY 2.0 (T3 front and canopy):
 *   https://www.flickr.com/photos/47038415@N00/3250862434
 * - "Dubai Airport control tower", crucially, CC BY-SA 2.0 (B beside the
 *   tower): https://www.flickr.com/photos/47737664@N00/732252495
 * - "Dubai Airport Control Tower", Simon_sees, CC BY 2.0, 2022:
 *   https://www.flickr.com/photos/39551170@N02/52060264803
 * - "Emirates - B777-31H(ER) - A6-EBM", raihans photography, CC BY-SA 2.0:
 *   https://www.flickr.com/photos/21221287@N03/13745949835
 *
 * Look-only (not relied on): Paolo Rosa's "T3 Main Entrance" Flickr photos
 * (CC BY-NC-ND 2.0). "DXB.jpg" on Commons is a flight-simulator render and
 * was ignored.
 *
 * Doubts
 * - The crest height (38 m) is between the published figures and the
 *   photo estimates.
 * - Which way the scallops lean on each side: from the north-east B's fins
 *   have their upright edge on the left (MoHasanie 2009); a photo of A from
 *   an unknown side has it on the right. Drawn mirror-symmetric about the
 *   axis, which gives both.
 * - The T3 front and canopy rest on one photo; the canopy's real section
 *   may be more pointed than drawn.
 * - OSM maps only 11 of B's 26 jet bridges; the detail model draws those.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant, type Swatch } from './palette'
import { cap, clean, inset, panels, walls, type XY } from './clt-terminal'

// ---------------------------------------------------------------------------
// Small geometry

const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const norm3 = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/** A flat quad wound so it faces `out`. */
export function oquad(p: Part, a: V3, b: V3, c: V3, d: V3, out: V3) {
  const n = cross3(sub3(b, a), sub3(c, a))
  if (dot3(n, out) >= 0) p.quad(a, b, c, d)
  else p.quad(a, d, c, b)
}
/** A flat triangle wound so it faces `out`. */
export function otri(p: Part, a: V3, b: V3, c: V3, out: V3) {
  const n = cross3(sub3(b, a), sub3(c, a))
  if (dot3(n, out) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}

/** An axis-aligned box in a frame turned by `ang` about (cx, cy): u along, v across. */
export function obox(p: Part, cx: number, cy: number, ang: number, u0: number, u1: number, v0: number, v1: number, z0: number, z1: number, top: Part | null = p) {
  const c = Math.cos(ang), s = Math.sin(ang)
  const P = (u: number, v: number): XY => [cx + u * c - v * s, cy + u * s + v * c]
  const ring = [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)]
  walls(p, ring, z0, z1)
  if (top) cap(top, ring, z1)
  return ring
}

/** A square-section bar from A to B, w wide and h tall, with end caps. */
export function bar(p: Part, A: V3, B: V3, w: number, h: number) {
  const d = norm3(sub3(B, A))
  let u = cross3(d, [0, 0, 1])
  if (Math.hypot(...u) < 1e-3) u = cross3(d, [1, 0, 0])
  u = norm3(u)
  const v = norm3(cross3(u, d))
  const R = (c: V3): V3[] => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([a, b]) => [c[0] + u[0] * a * w / 2 + v[0] * b * h / 2, c[1] + u[1] * a * w / 2 + v[1] * b * h / 2, c[2] + u[2] * a * w / 2 + v[2] * b * h / 2] as V3)
  const ra = R(A), rb = R(B)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const mid: V3 = [(ra[i][0] + ra[j][0]) / 2 - A[0], (ra[i][1] + ra[j][1]) / 2 - A[1], (ra[i][2] + ra[j][2]) / 2 - A[2]]
    oquad(p, ra[i], ra[j], rb[j], rb[i], mid)
  }
  oquad(p, ra[0], ra[1], ra[2], ra[3], [-d[0], -d[1], -d[2]])
  oquad(p, rb[0], rb[1], rb[2], rb[3], d)
}

/** Where the vertical line X = x crosses a ring: the lowest and highest y. */
export function spanAt(ring: XY[], x: number): [number, number] {
  let lo = Infinity, hi = -Infinity
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if ((a[0] - x) * (b[0] - x) > 0 || a[0] === b[0]) continue
    const t = (x - a[0]) / (b[0] - a[0]), y = a[1] + (b[1] - a[1]) * t
    lo = Math.min(lo, y); hi = Math.max(hi, y)
  }
  return [lo, hi]
}

// ---------------------------------------------------------------------------
// The vaulted concourse (B and A)

export type VaultParts = { metal: Part; glass: Part; podium: Part; podiumWin: Part; roof: Part; trim: Part; glassTop?: Part }
export type VaultOpts = {
  /** Podium height, where the vault springs. */
  z0: number
  /** Crest height above the apron. */
  H: number
  /** Target bay length along the concourse. */
  bay: number
  /** Rows of the arc on each side; the scallops stop at `tipRow`. */
  rows: number
  tipRow: number
  /** Length of each domed end. */
  endLen: number
  /** Superellipse exponent of the section (2 = ellipse). */
  n: number
  /** Inset of the vault foot from the outline. */
  foot: number
  /** Columns across each domed end. */
  endCols: number
  /** Rows of glass at the foot of each domed end. */
  endGlassRows: number
  /** Rows at the top of each fin drawn in `glassTop` (the glass reads darker there). */
  glassTopRows?: number
  /** Draw the glass fins (false: a plain silver shell, as on Concourse C). */
  fins?: boolean
  /** Window bands on the podium, as [z0, z1]; default one band. */
  podiumBands?: [number, number][]
  /** Window bay along the podium. */
  podiumBay?: number
  /** Ends to leave flat (cut square) instead of domed, e.g. where another building abuts. */
  flatEnds?: [boolean, boolean]
}

/**
 * One long vault over a ring whose long axis is x: a pale podium on the
 * outline up to z0, and above it a silver shell of superelliptic section
 * whose half-width follows the outline, with a teal glass fin in every bay
 * on both sides and domed ends. Returns the bay boundaries.
 */
export function vaultConcourse(P: VaultParts, ring0: XY[], o: VaultOpts) {
  const ring = clean(ring0, 0.3)
  const xs = ring.map((p) => p[0])
  const xmin = Math.min(...xs), xmax = Math.max(...xs)
  const xa = xmin + o.endLen, xb = xmax - o.endLen
  const S = (x: number) => {
    const xx = Math.min(xmax - 0.05, Math.max(xmin + 0.05, x))
    const [lo, hi] = spanAt(ring, xx)
    return { yc: (lo + hi) / 2, w: (hi - lo) / 2 - o.foot }
  }
  // The section, s from the eave (0) to the crest (1), as (across, up) fractions.
  const sec = (s: number): XY => {
    const th = Math.min(1, Math.max(0, s)) * Math.PI / 2
    return [Math.pow(Math.cos(th), 2 / o.n), Math.pow(Math.sin(th), 2 / o.n)]
  }
  const endScale = (x: number) => {
    if (x < xa) return Math.sqrt(Math.max(0, 1 - ((xa - x) / o.endLen) ** 2))
    if (x > xb) return Math.sqrt(Math.max(0, 1 - ((x - xb) / o.endLen) ** 2))
    return 1
  }
  const pt = (x: number, side: number, s: number): V3 => {
    const { yc, w } = S(x)
    const f = endScale(x), [cu, cz] = sec(s)
    return [x, yc + side * w * f * cu, o.z0 + (o.H - o.z0) * f * cz]
  }
  const nrm = (x: number, side: number, s: number): V3 => {
    const e = 1e-3
    const ds = sub3(pt(x, side, Math.min(1, s + e)), pt(x, side, Math.max(0, s - e)))
    const dx = sub3(pt(x + 0.05, side, s), pt(x - 0.05, side, s))
    let n = norm3(cross3(dx, ds))
    const p = pt(x, side, s), { yc } = S(x)
    const ref: V3 = [x - Math.min(xb, Math.max(xa, x)), p[1] - yc, p[2] - (o.z0 - 4)]
    if (dot3(n, ref) < 0) n = [-n[0], -n[1], -n[2]]
    // At the very end of a dome the surface pinches to a point: point it along the axis.
    if (!Number.isFinite(n[0])) n = [Math.sign(ref[0]) || 1, 0, 0]
    return n
  }
  /** A surface patch over (x, s) corners, smooth-shaded from the analytic surface. */
  const patch = (p: Part, side: number, c: [number, number][]) => {
    const v = c.map(([x, s]) => pt(x, side, s)), n = c.map(([x, s]) => nrm(x, side, s))
    if (c.length === 3) { p.tri(v[0], v[1], v[2], undefined, undefined, undefined, n); return }
    p.tri(v[0], v[1], v[2], undefined, undefined, undefined, [n[0], n[1], n[2]])
    p.tri(v[0], v[2], v[3], undefined, undefined, undefined, [n[0], n[2], n[3]])
  }

  // --- bays and their fins
  const nb = Math.max(1, Math.round((xb - xa) / o.bay))
  const bays = Array.from({ length: nb + 1 }, (_, i) => xa + ((xb - xa) * i) / nb)
  const tip = o.tipRow / o.rows
  // The fin in bay coordinates: t across the bay from the viewer's left, u up the fin (0..1 at the tip).
  const tL = (u: number) => 0.09 + (0.8 - 0.09) * Math.pow(u, 2.1)
  const tR = (u: number) => 0.93 - (0.93 - 0.8) * Math.pow(u, 3)
  for (const side of [1, -1]) {
    for (let k = 0; k < nb; k++) {
      const x0 = bays[k], x1 = bays[k + 1]
      // Mirror-symmetric about the axis: from the north-east the fins' upright
      // edge is on the viewer's left (MoHasanie 2009), from the south-west on
      // the right (mikecogh's photo of A).
      const X = (t: number) => x0 + t * (x1 - x0)
      for (let r = 0; r < o.rows; r++) {
        const s0 = r / o.rows, s1 = (r + 1) / o.rows
        if (r >= o.tipRow || o.fins === false) { patch(P.metal, side, [[X(0), s0], [X(1), s0], [X(1), s1], [X(0), s1]]); continue }
        const u0 = s0 / tip, u1 = s1 / tip
        const a0 = tL(u0), a1 = tL(u1), b0 = tR(u0), b1 = tR(u1)
        patch(P.metal, side, [[X(0), s0], [X(a0), s0], [X(a1), s1], [X(0), s1]])
        const g = P.glassTop && r >= o.tipRow - (o.glassTopRows ?? 0) ? P.glassTop : P.glass
        if (r === o.tipRow - 1) patch(g, side, [[X(a0), s0], [X(b0), s0], [X(a1), s1]])
        else patch(g, side, [[X(a0), s0], [X(b0), s0], [X(b1), s1], [X(a1), s1]])
        patch(P.metal, side, [[X(b0), s0], [X(1), s0], [X(1), s1], [X(b1), s1]])
      }
    }
  }

  // --- domed ends: a glass band at the foot, silver above
  const flat = o.flatEnds ?? [false, false]
  for (const [e, xe, xin] of [[0, xmin, xa], [1, xmax, xb]] as [number, number, number][]) {
    if (flat[e]) {
      // A square end: the full section as a gable wall, silver over a glass band.
      const { yc, w } = S(xin)
      const out: V3 = [xe < xin ? -1 : 1, 0, 0]
      for (let r = 0; r < o.rows; r++) {
        const s0 = r / o.rows, s1 = (r + 1) / o.rows
        for (const side of [1, -1]) {
          const A = pt(xin, side, s0), B = pt(xin, side, s1)
          oquad(r < 2 ? P.glass : P.metal, A, B, [xin, yc, B[2]], [xin, yc, A[2]], out)
        }
      }
      void w
      continue
    }
    const cols = Array.from({ length: o.endCols + 1 }, (_, j) => {
      // denser toward the tip, where the dome turns fastest
      const t = Math.sin((j / o.endCols) * Math.PI / 2)
      return xin + (xe - xin) * t
    })
    for (const side of [1, -1]) {
      for (let j = 0; j < o.endCols; j++) {
        const xA = cols[j], xB = cols[j + 1]
        for (let r = 0; r < o.rows; r++) {
          const s0 = r / o.rows, s1 = (r + 1) / o.rows
          patch(r < o.endGlassRows ? P.glass : P.metal, side, [[xA, s0], [xB, s0], [xB, s1], [xA, s1]])
        }
      }
    }
  }

  // --- podium: walls on the outline, a roof under the vault, window bands
  walls(P.podium, ring, 0, o.z0)
  cap(P.roof, ring, o.z0)
  for (const [b0, b1] of o.podiumBands ?? [[1.6, o.z0 - 1.2]]) panels(P.podiumWin, ring, b0, b1, { bay: o.podiumBay ?? 30, gap: 1.6, minLen: 12 })
  return { bays, xmin, xmax, S, pt }
}

/**
 * Gate modules: where OSM's outline has two vertices close together on a
 * long side (each contact gate), a teal glass box standing out from the
 * podium with a white roof slab.
 */
export function gateModules(P: { glass: Part; trim: Part }, ring0: XY[], o: { minSep?: number; maxSep?: number; endClear: number; along: number; out: number; h: number; minAbsY?: number }) {
  const ring = ring0.slice(0, ring0.at(-1)![0] === ring0[0][0] && ring0.at(-1)![1] === ring0[0][1] ? -1 : undefined)
  const xs = ring.map((p) => p[0]), xmin = Math.min(...xs), xmax = Math.max(...xs)
  const cx = (xmin + xmax) / 2
  const sumy = ring.reduce((s, p) => s + p[1], 0) / ring.length
  const at: { x: number; y: number; ang: number; side: number }[] = []
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const d = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (d < (o.minSep ?? 0.8) || d > (o.maxSep ?? 3.5)) continue
    const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    if (m[0] < xmin + o.endClear || m[0] > xmax - o.endClear) continue
    if (Math.abs(m[1] - sumy) < (o.minAbsY ?? 20)) continue
    if (at.some((g) => Math.hypot(g.x - m[0], g.y - m[1]) < o.along * 1.5)) continue
    const side = m[1] > sumy ? 1 : -1
    // the local edge direction from the neighbours, for the box's turn
    const p0 = ring[(i - 2 + ring.length) % ring.length], p1 = ring[(i + 3) % ring.length]
    let ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0])
    if (Math.cos(ang) < 0) ang += Math.PI
    at.push({ x: m[0], y: m[1], ang, side })
  }
  void cx
  for (const g of at) {
    const v0 = g.side > 0 ? -0.5 : -o.out, v1 = g.side > 0 ? o.out : 0.5
    obox(P.glass, g.x, g.y, g.ang, -o.along / 2, o.along / 2, v0, v1, 0, o.h - 1.4, null)
    obox(P.trim, g.x, g.y, g.ang, -o.along / 2 - 0.4, o.along / 2 + 0.4, v0 - (g.side < 0 ? 0.4 : 0), v1 + (g.side > 0 ? 0.4 : 0), o.h - 1.4, o.h, P.trim)
  }
  return at
}

/** Jet bridges along OSM's lines: a tunnel box on a few legs. */
export function jetBridges(P: { body: Part; glass: Part }, lines: XY[][], z = 5.2, w = 3.6, h = 3.2) {
  for (const l of lines) {
    for (let i = 0; i < l.length - 1; i++) {
      const A: V3 = [l[i][0], l[i][1], z], B: V3 = [l[i + 1][0], l[i + 1][1], z]
      bar(P.body, A, B, w, h)
    }
    // the cab at the aircraft end and a leg under it
    const e = l.at(-1)!, f = l.at(-2)!
    const ang = Math.atan2(e[1] - f[1], e[0] - f[0])
    obox(P.glass, e[0], e[1], ang, -1, 2.4, -2.4, 2.4, z - h / 2, z + h / 2 + 0.3)
    obox(P.body, e[0], e[1], ang, -0.4, 0.4, -0.4, 0.4, 0, z - h / 2, null)
  }
}

// ---------------------------------------------------------------------------
// Output

export type Mat = { part: Part; material: Swatch }
export const triCount = (parts: Mat[]) => parts.reduce((s, { part }) => s + part.triangles, 0)

/** Move built parts so the frame point `c` becomes the origin, for a model drawn in a shared site frame. */
export function recentre(parts: Mat[], c: XY): Mat[] {
  // Part stores glTF coordinates: (x, z, -y) of the frame.
  for (const { part } of parts) for (let i = 0; i < part.pos.length; i += 3) { part.pos[i] -= c[0]; part.pos[i + 2] += c[1] }
  return parts
}

export async function writeModel(file: string, name: string, parts: Mat[], extras: Record<string, unknown>, maxTri: number, maxBytes: number) {
  const used = parts.filter((p) => p.part.triangles > 0)
  if (used.length > 6) throw new Error(`${file}: ${used.length} materials`)
  const tris = triCount(used)
  if (tris > maxTri) throw new Error(`${file}: triangle budget exceeded: ${tris} > ${maxTri}`)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', ...extras })
  if (glb.length > maxBytes) throw new Error(`${file}: file budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}

/** The DXB colours, from daylight photos, pulled to the palette's lightness. */
export const DXB = {
  // the vaults' silver metal shell
  silver: finish('dxb-silver', 0xd4d8db, 0.5),
  // the vaults' teal glass, lit at night
  teal: windowVariant(2, 0x6ea7bc),
  stone: PALETTE.stone,
  trim: PALETTE.trim,
  roof: PALETTE.roof,
  window: PALETTE.window,
  glass: PALETTE.glass,
}

// ---------------------------------------------------------------------------
// Concourse B and Terminal 3

/**
 * The rings below are in one site frame (origin: the area centroid of
 * way/87185819). Each model is moved so its own anchor is its origin.
 */
export const CONCOURSE_B = {
  id: 'dubai-dxb-concourse-b',
  name: 'Dubai International Airport Concourse B',
  bearing: 30.65,
  anchor: [55.3617236, 25.2483769] as XY,
  /** The anchor in the site frame. */
  origin: [0, 0] as XY,
}
export const T3 = {
  id: 'dubai-dxb-terminal-3',
  name: 'Dubai International Airport Terminal 3',
  bearing: 30.65,
  anchor: [55.3599963, 25.245603] as XY,
  /** The anchor in the site frame: the area centroid of ways 98425182 and 1360329006 together. */
  origin: [6.75, -352.52] as XY,
}

const B: XY[] = [[-457.96, -30.89], [-444.02, -31.76], [-433.46, -32.18], [-431.9, -32.3], [-371.11, -34.66], [-369.27, -34.78], [-305.81, -37.34], [-304.7, -37.42], [-246.36, -39.74], [-244.31, -39.84], [-186.19, -42.2], [-183.14, -42.3], [-57.87, -47.99], [-48.55, -48.38], [-14.52, -49.81], [-0.29, -50.41], [8.93, -50.79], [45.49, -50.18], [47.53, -50.01], [110.09, -48.74], [112.42, -48.71], [221.52, -46.54], [223.85, -46.47], [272.74, -45.48], [283.06, -45.7], [286.9, -45.86], [346.38, -44.65], [347.84, -44.8], [407.44, -43.97], [408.81, -43.98], [424.53, -43.8], [450.24, -42.27], [451.87, -42.22], [459.71, -41.71], [460.57, -13.85], [460.79, -11.16], [461.14, 2.8], [461.13, 4.38], [461.88, 28.4], [454.27, 28.8], [452.43, 28.84], [426.77, 30.22], [410.88, 31.08], [409.43, 31.17], [347.88, 34.28], [346.03, 34.47], [283.77, 37.61], [282.27, 37.81], [220.55, 41.02], [218.55, 41.15], [117.56, 46.2], [115.09, 46.57], [44.02, 50.3], [42.56, 50.32], [34.41, 50.8], [-25.54, 50.04], [-28.27, 49.82], [-168.0, 47.52], [-172.48, 47.58], [-239.88, 46.49], [-241.72, 46.52], [-303.92, 45.5], [-305.25, 45.57], [-444.04, 43.51], [-457.56, 43.31], [-456.99, 30.84], [-457.87, -23.7]]
const LOUNGES: XY[] = [[-491.52, 31.11], [-490.73, 40.63], [-478.36, 49.01], [-477.98, 150.04], [-396.44, 150.21], [-396.79, 58.52], [-426.98, 58.45], [-427.02, 47.67], [-468.21, 47.58], [-479.6, 38.59], [-479.96, 30.99]]
const LINK: XY[] = [[-51.18, -143.52], [8.89, -144.16], [10.4, -53.3], [-2.09, -53.16], [-2.34, -67.29], [-39.44, -66.9], [-39.18, -51.82], [-46.78, -51.74], [-47.04, -67.65], [-60.4, -67.51], [-60.6, -79.33], [-50.12, -79.45]]
const FRONT: XY[] = [[49.39, -347.58], [97.84, -347.63], [128.13, -347.66], [137.63, -347.67], [137.55, -358.5], [137.54, -360.69], [158.59, -360.7], [158.76, -335.55], [-140.36, -335.23], [-140.44, -347.37], [-130.29, -347.38], [-102.43, -347.41], [-69.14, -347.44], [-45.53, -347.47]]
const CANOPY: XY[] = [[128.13, -347.66], [97.84, -347.63], [49.39, -347.58], [-45.53, -347.47], [-69.14, -347.44], [-102.43, -347.41], [-130.29, -347.38], [-130.45, -370.61], [-27.26, -370.73], [-23.01, -370.74], [-18.34, -370.73], [15.39, -370.77], [19.43, -370.78], [24.11, -370.78], [127.96, -370.9]]
/** OSM's jet bridges on Concourse B (aeroway=jet_bridge), building end first. */
const BRIDGES: XY[][] = [[[-431.9, -32.3], [-442.4, -57.6], [-441.4, -68.5], [-420.6, -70.0]], [[-369.3, -34.8], [-369.7, -71.1], [-348.7, -71.1]], [[-183.1, -42.3], [-151.5, -67.6], [-125.7, -73.6]], [[45.5, -50.2], [16.5, -65.5], [16.1, -75.5]], [[112.4, -48.7], [97.6, -66.0], [97.5, -78.0], [118.6, -70.2]], [[223.9, -46.5], [190.7, -66.8], [189.3, -72.4]], [[-25.5, 50.0], [-42.9, 61.6], [-42.8, 67.0]], [[44.0, 50.3], [42.4, 58.0], [42.7, 65.3]], [[117.6, 46.2], [129.3, 57.5], [130.0, 63.0]], [[220.6, 41.0], [219.5, 61.2]], [[283.8, 37.6], [293.8, 57.1], [294.2, 67.1]]]

/** The T3 front's arrivals canopy: a barrel over the kerb on arch ribs. */
function t3Canopy(P: { shell: Part; rib: Part; soffit: Part }, detail: boolean) {
  const r = clean(CANOPY, 0.3)
  const xs = r.map((p) => p[0]), x0 = Math.min(...xs) + 0.3, x1 = Math.max(...xs) - 0.3
  const yB = -347.5, yK = -370.7 // building side, kerb side
  const yc = (yB + yK) / 2, half = (yB - yK) / 2
  const RISE = 20, SEG = detail ? 16 : 10
  // a pointed-ish arch: ellipse quarter on each side, z(0) = 0 at the feet
  const arc = (a: number): [number, number] => [yc + half * Math.cos(a), RISE * Math.sin(a)]
  // the shell spans the upper part of the arch
  const A0 = 0.55, A1 = Math.PI - 0.55
  for (let i = 0; i < SEG; i++) {
    const a = A0 + ((A1 - A0) * i) / SEG, b = A0 + ((A1 - A0) * (i + 1)) / SEG
    const [ya, za] = arc(a), [yb, zb] = arc(b)
    const out: V3 = [0, Math.cos((a + b) / 2), Math.sin((a + b) / 2)]
    oquad(P.shell, [x0, ya, za + 0.6], [x1, ya, za + 0.6], [x1, yb, zb + 0.6], [x0, yb, zb + 0.6], out)
    oquad(P.soffit, [x0, ya, za], [x1, ya, za], [x1, yb, zb], [x0, yb, zb], [0, -out[1], -out[2]])
  }
  // shell edges
  for (const x of [x0, x1]) {
    for (let i = 0; i < SEG; i++) {
      const a = A0 + ((A1 - A0) * i) / SEG, b = A0 + ((A1 - A0) * (i + 1)) / SEG
      const [ya, za] = arc(a), [yb, zb] = arc(b)
      oquad(P.shell, [x, ya, za], [x, yb, zb], [x, yb, zb + 0.6], [x, ya, za + 0.6], [x < 0 ? -1 : 1, 0, 0])
    }
  }
  for (const a of [A0, A1]) {
    const [y, z] = arc(a)
    oquad(P.shell, [x0, y, z], [x1, y, z], [x1, y, z + 0.6], [x0, y, z + 0.6], [0, a < 1 ? 1 : -1, 0.3])
  }
  // arch ribs, every ~16 m, from the ground up to the shell
  const n = Math.round((x1 - x0) / 16)
  const RS = detail ? 14 : 8
  for (let k = 0; k <= n; k++) {
    const x = x0 + 0.8 + ((x1 - x0 - 1.6) * k) / n
    for (let i = 0; i < RS; i++) {
      const a = (Math.PI * i) / RS, b = (Math.PI * (i + 1)) / RS
      const [ya, za] = arc(a), [yb, zb] = arc(b)
      bar(P.rib, [x, ya, Math.max(0.75, za - 0.1)], [x, yb, Math.max(0.75, zb - 0.1)], 1.4, 1.2)
    }
  }
}

/** Concourse B's glass: blue-grey in the photos (VtTN, MoHasanie), darker toward the fins' tips. */
const B_GLASS = windowVariant(2, 0x7f97a8)

/** Concourse B with the lounge block and the link block beside it, in the old site frame. */
function buildB(detail: boolean) {
  const metal = new Part(), teal = new Part(), stone = new Part(), win = new Part(), roof = new Part(), trim = new Part()
  vaultConcourse({ metal, glass: teal, podium: stone, podiumWin: win, roof, trim, glassTop: win }, B, {
    z0: 10, H: 38, bay: 23, rows: detail ? 14 : 8, tipRow: detail ? 11 : 6, endLen: 34, n: 3, foot: 0.4, endCols: detail ? 6 : 4, endGlassRows: detail ? 5 : 3,
    glassTopRows: detail ? 3 : 2,
  })
  gateModules({ glass: teal, trim }, B, { endClear: 30, along: 13, out: 8, h: 15 })

  // The remote-gate lounges by the north-west end: a white two-storey block.
  {
    const r = clean(LOUNGES)
    walls(trim, r, 0, 14)
    cap(roof, inset(r, 0.01), 14)
    panels(win, r, 5.5, 11.5, { bay: 12, gap: 2, minLen: 14 })
  }
  // The link toward the landside on B's south-west side.
  {
    const r = clean(LINK)
    walls(stone, r, 0, 12)
    cap(roof, r, 12)
    panels(win, r, 4, 10, { bay: 10, gap: 2, minLen: 12 })
  }
  if (detail) {
    jetBridges({ body: trim, glass: win }, BRIDGES)
  }
  return recentre([
    { part: metal, material: DXB.silver },
    { part: teal, material: B_GLASS },
    { part: stone, material: DXB.stone },
    { part: win, material: DXB.window },
    { part: roof, material: DXB.roof },
    { part: trim, material: DXB.trim },
  ], CONCOURSE_B.origin)
}

/** Terminal 3's landside front: stone over a glazed ground floor, and the canopy. */
function buildT3(detail: boolean) {
  const metal = new Part(), stone = new Part(), win = new Part(), roof = new Part(), trim = new Part()
  const r = clean(FRONT)
  walls(stone, r, 0, 16)
  cap(roof, r, 16)
  panels(win, r, 0.4, 5.6, { bay: 14, gap: 1.2, minLen: 12, keep: (a, b) => a[1] < -346 && b[1] < -346 })
  panels(win, r, 8.5, 13.5, { bay: 6, gap: 3, minLen: 12, keep: (a, b) => a[1] < -346 && b[1] < -346 })
  t3Canopy({ shell: metal, rib: roof, soffit: trim }, detail)
  return recentre([
    { part: metal, material: DXB.silver },
    { part: stone, material: DXB.stone },
    { part: win, material: DXB.window },
    { part: roof, material: DXB.roof },
    { part: trim, material: DXB.trim },
  ], T3.origin)
}

if (import.meta.main) {
  const tB = { bearing: CONCOURSE_B.bearing, elevation: 0 }
  await writeModel(`${CONCOURSE_B.id}.glb`, CONCOURSE_B.name, buildB(false), tB, 8000, 250_000)
  await writeModel(`${CONCOURSE_B.id}.detail.glb`, CONCOURSE_B.name, buildB(true), tB, 40_000, 1_500_000)
  const t3 = { bearing: T3.bearing, elevation: 0 }
  await writeModel(`${T3.id}.glb`, T3.name, buildT3(false), t3, 8000, 250_000)
  await writeModel(`${T3.id}.detail.glb`, T3.name, buildT3(true), t3, 40_000, 1_500_000)
}
