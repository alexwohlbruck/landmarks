/**
 * Western Auto Building (Western Auto Lofts), Kansas City, Missouri —
 * original procedural geometry, CC0-1.0.
 * bun generators/kc-western-auto-building.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 3.1° (the
 * straight west face on the Main Street viaduct runs 3.1° in OSM). Origin:
 * the outline's centroid, on the ground at the building's south tip (the
 * lowest ground under it).
 *
 * Identity, from the photos:
 *  1. the rooftop sign: "WESTERN" over "AUTO" in bold red letters across a
 *     white ring that is open at the lower left, both ends finished as
 *     arrowheads, on a steel lattice frame; red and white neon at night;
 *  2. the wedge plan: a straight west face, a short square north face, and
 *     the long east face curving round to a sharp south tip (Grand Blvd);
 *  3. the dark red-brown brick shaft between a two-storey cream terra cotta
 *     base (storefronts at the viaduct level) and a cream two-storey top
 *     with rectangular windows under a heavy cornice;
 *  4. the water tank and penthouse beside the sign.
 *
 * The sign is a famous sign and the landmark's identity, so it carries its
 * lettering (STYLE.md, "Famous signs"): letters drawn as centre-line
 * strokes with generators/lettering.ts, traced from Caleb Zahnd's and Paul
 * Sableman's photos (a bold square-shouldered sans: pointed W, round-bowled
 * R, oval O, flat-topped T), the stroke a little bolder than the real one so
 * it holds at phone size.
 *
 * Evidence:
 *  - OSM: way/288033189 (building=apartments, 12 levels, no height, name
 *    Western Auto Building, wikidata Q7987597); no building:parts.
 *  - Lidar, measured: USGS 3DEP MO_FEMANRCS_1_2020 (2020 flight), 0.5 m grid
 *    read in this frame; model z = height above ground_min − 0.3. The real
 *    ground runs from 0 at the south tip to ≈ 2 at the north face; the west
 *    side's 8 m "ground" is the viaduct deck (no ground returns under it).
 *    Roof 53.4, cornice top ≈ 55.6, sign top 76.4; the sign's high points lie
 *    on a line (−12, −4)…(0, −22), so its face runs 146° and looks WSW;
 *    penthouse ≈ 59.8, water tank ≈ 64.6 at (4.5, 5).
 *  - Measured from the photos (scaled by the lidar heights and the OSM face
 *    widths): two-storey base 9.9 m above the viaduct; eight brick storeys
 *    (3–10) ≈ 3.35 m; cream top two storeys, 7.4 m; cornice ≈ 2.6 m, projecting ≈ 1.3 m; ten bays
 *    on the west face, six on the north, twelve round the curve; the ring
 *    19.6 m across (WESTERN is 1.1 ring diameters wide and ≈ 21.6 m, the
 *    length of the lidar's line), letters 3.4 m tall, WESTERN's top 0.21 D
 *    and AUTO's 0.47 D below the ring's top; arrowheads at ≈ 205° and 272°.
 *  - Estimated: storefront and lower-storey window sizes; the lattice
 *    frame (four posts, four rails, raking back legs, a simplification of
 *    the real grid); the penthouse's plan; the lower storeys under the
 *    viaduct (drawn brick, with windows on the north and east faces only).
 *  - Windows in the brick shaft are grouped two storeys to a narrow panel
 *    per bay, in a white frame, with brick piers and spandrels between, so
 *    the brick dominates as in the photos; the real building has paired
 *    sash windows on every floor. The cream sill course over the third
 *    storey is left out so the pairs stay even. The cream top's two storeys
 *    keep one row of rectangular windows each, as in Sableman's photo.
 *  - Brick colour: deep red-brown from Zahnd's and Sableman's photos,
 *    lightened only a little (#76453a), darker than the stone so it reads
 *    as the dark-brick building it is.
 *
 * Night: the letters glow red and the ring warm white (KellyK's night photo;
 * elisfkc2's shows them all red), so the letters are `neon-western-auto-red`
 * and the ring `neon-western-auto-white`; the lofts' windows are `window`.
 *
 * Photos (Wikimedia Commons, evidence): Western Auto.jpg (Caleb Zahnd, CC BY
 * 2.0, from the Liberty Memorial, SSW); Western Auto Building seen from the
 * west.jpg (Paul Sableman, CC BY 2.0); Western Auto - Flickr - KellyK.jpg
 * (Kelly from Parsons, Kansas, CC BY-SA 2.0, night); Western Auto
 * Building.jpg (elisfkc2, CC BY-SA 4.0, night). No look-only sources; no
 * commercial imagery.
 *
 * Doubts: no photo of the north face or of the sign's back; whether the
 * sign is lettered on its back is not known (the strokes are closed both
 * sides, so it reads mirrored from behind); the south tip, sharp in OSM and
 * the lidar, is eased by a 1.5 m round, as Zahnd's photo shows it; its
 * real radius is a guess.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { Pen, strokes, type Pt } from './lettering'

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
function tf(p: Part, a: V3, b: V3, c: V3, want: V3) {
  if (dot(crs(sub3(b, a), sub3(c, a)), want) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
function qf(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) { tf(p, a, b, c, want); tf(p, a, c, d, want) }

/** A box between two plan points, `t` thick, from z0 to z1 (a frame member or post). */
function beam(p: Part, a: V3, b: V3, t: number) {
  const d = sub3(b, a), L = Math.hypot(d[0], d[1], d[2])
  const ax: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const ref: V3 = Math.abs(ax[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  let s1 = crs(ax, ref); const l1 = Math.hypot(...s1); s1 = [s1[0] / l1, s1[1] / l1, s1[2] / l1]
  const s2 = crs(ax, s1), h = t / 2
  const c = (o: V3, i: number, j: number): V3 => [o[0] + (s1[0] * i + s2[0] * j) * h, o[1] + (s1[1] * i + s2[1] * j) * h, o[2] + (s1[2] * i + s2[2] * j) * h]
  const k: [number, number][] = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
  for (let i = 0; i < 4; i++) {
    const [p0, p1] = [k[i], k[(i + 1) % 4]]
    const out: V3 = [(s1[0] * (p0[0] + p1[0]) + s2[0] * (p0[1] + p1[1])), (s1[1] * (p0[0] + p1[0]) + s2[1] * (p0[1] + p1[1])), (s1[2] * (p0[0] + p1[0]) + s2[2] * (p0[1] + p1[1]))]
    qf(p, c(a, ...p0), c(a, ...p1), c(b, ...p1), c(b, ...p0), out)
  }
  qf(p, c(b, 1, 1), c(b, -1, 1), c(b, -1, -1), c(b, 1, -1), ax)
}

/** A smooth-shaded cylinder standing on `c`. */
function cyl(p: Part, c: V3, r: number, h: number, seg = 12, cone = 0) {
  for (let i = 0; i < seg; i++) {
    const a0 = (i / seg) * Math.PI * 2, a1 = ((i + 1) / seg) * Math.PI * 2
    const n0: V3 = [Math.cos(a0), Math.sin(a0), 0], n1: V3 = [Math.cos(a1), Math.sin(a1), 0]
    const b0: V3 = [c[0] + n0[0] * r, c[1] + n0[1] * r, c[2]], b1: V3 = [c[0] + n1[0] * r, c[1] + n1[1] * r, c[2]]
    const t0: V3 = [b0[0], b0[1], c[2] + h], t1: V3 = [b1[0], b1[1], c[2] + h]
    p.tri(b0, b1, t1, undefined, undefined, undefined, [n0, n1, n1])
    p.tri(b0, t1, t0, undefined, undefined, undefined, [n0, n1, n0])
    tf(p, t0, t1, [c[0], c[1], c[2] + h + cone], [0, 0, 1])
  }
}

// ---------------------------------------------------------------------------
// Plan: the OSM outline (way/288033189) in this frame (bearing 3.1°), x east,
// y north. The west face on the Main Street viaduct is straight, the north
// face short and square, and the long east face curves round to the
// building's sharp south tip, following Grand Boulevard.

type P2 = [number, number]
const OUTLINE: P2[] = [
  [-12.4, 19.75], [18.11, 20.08], [17.85, 13.85], [16.58, 7.13], [13.74, -0.86],
  [7.84, -12.87], [-0.71, -22.8], [-7.72, -28.06], [-12.46, -31.27],
]
/** Resample the curved east face (from the NE corner to the south tip) into `n` even chords. */
function resample(pts: P2[], n: number): P2[] {
  const seg: number[] = []
  let total = 0
  for (let i = 0; i < pts.length - 1; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); seg.push(l); total += l }
  const out: P2[] = []
  for (let k = 0; k <= n; k++) {
    let s = (total * k) / n, i = 0
    while (i < seg.length - 1 && s > seg[i]) { s -= seg[i]; i++ }
    const t = Math.min(1, s / seg[i])
    out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t])
  }
  return out
}
const EAST_BAYS = 12
const curve = resample(OUTLINE.slice(1), EAST_BAYS)
// The ring runs clockwise from the NW corner (east along the north face, down the curve, back up the west face).
// The south tip, sharp in OSM, is eased with a small round (1.5 m) as the photos show it.
const tipFillet = (() => {
  const T = curve[curve.length - 1], P = curve[curve.length - 2], N = OUTLINE[0], r = 1.5
  const toward = (q: P2): P2 => { const d = norm([q[0] - T[0], q[1] - T[1]]); return [T[0] + d[0] * r, T[1] + d[1] * r] }
  const A = toward(P), B = toward(N)
  return [A, [0.25 * A[0] + 0.5 * T[0] + 0.25 * B[0], 0.25 * A[1] + 0.5 * T[1] + 0.25 * B[1]] as P2, B]
})()
const RING: P2[] = [OUTLINE[0], ...curve.slice(0, -1), ...tipFillet]

/** Offset a convex clockwise ring outward by d (mitred). */
function offset(ring: P2[], d: number): P2[] {
  const n = ring.length
  return ring.map((p, i) => {
    const a = ring[(i + n - 1) % n], b = ring[(i + 1) % n]
    const e0 = norm([p[0] - a[0], p[1] - a[1]]), e1 = norm([b[0] - p[0], b[1] - p[1]])
    // clockwise ring: outward normal of an edge (dx, dy) is (-dy, dx)
    const n0: P2 = [-e0[1], e0[0]], n1: P2 = [-e1[1], e1[0]]
    const m = norm([n0[0] + n1[0], n0[1] + n1[1]]), k = d / Math.max(0.3, m[0] * n0[0] + m[1] * n0[1])
    return [p[0] + m[0] * k, p[1] + m[1] * k] as P2
  })
}
function norm(v: P2): P2 { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
const ringCentre: P2 = [RING.reduce((s, p) => s + p[0], 0) / RING.length, RING.reduce((s, p) => s + p[1], 0) / RING.length]

/** Walls of a ring between z0 at offset d0 and z1 at offset d1, normals rolled by `up` (0 = vertical). */
function band(p: Part, z0: number, z1: number, d0 = 0, d1 = d0) {
  const a = offset(RING, d0), b = offset(RING, d1), n = RING.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const e = norm([RING[j][0] - RING[i][0], RING[j][1] - RING[i][1]])
    const out: V3 = [-e[1] * (z1 - z0), e[0] * (z1 - z0), d0 - d1]
    qf(p, [a[i][0], a[i][1], z0], [a[j][0], a[j][1], z0], [b[j][0], b[j][1], z1], [b[i][0], b[i][1], z1], out)
  }
}
function lid(p: Part, d: number, z: number, up = true) {
  const r = offset(RING, d)
  const c: V3 = [ringCentre[0], ringCentre[1], z]
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    tf(p, c, [r[i][0], r[i][1], z], [r[j][0], r[j][1], z], [0, 0, up ? 1 : -1])
  }
}

/** Window panels: on each ring edge, `bays` panels of width w between z0 and z1, arched if asked. */
function windows(p: Part, edge: number, bays: number, w: number, z0: number, z1: number, arch = false, d = 0.05) {
  const n = RING.length, a = RING[edge], b = RING[(edge + 1) % n]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = norm([b[0] - a[0], b[1] - a[1]]), out: V3 = [-u[1], u[0], 0]
  const at = (s: number, z: number): V3 => [a[0] + u[0] * s + out[0] * d, a[1] + u[1] * s + out[1] * d, z]
  for (let k = 0; k < bays; k++) {
    const c = (L / bays) * (k + 0.5), s0 = c - w / 2, s1 = c + w / 2
    const pts: V3[] = [at(s0, z0), at(s1, z0)]
    if (!arch) pts.push(at(s1, z1), at(s0, z1))
    else {
      const r = w / 2, sp = z1 - r
      for (let i = 0; i <= 6; i++) { const t = (i * Math.PI) / 6; pts.push(at(c + r * Math.cos(t), sp + r * Math.sin(t))) }
    }
    for (let i = 1; i < pts.length - 1; i++) tf(p, pts[0], pts[i], pts[i + 1], out)
  }
}

// ---------------------------------------------------------------------------
// Parts

const cream = new Part()   // cream terra cotta: the base, the top two storeys, the cornice
const brick = new Part()   // the dark red-brown brick shaft
const win = new Part()     // windows: glow at night
const steel = new Part()   // the roof, the water tank and penthouse, the sign's lattice frame
const neonRed = new Part() // the red letters
const neonRing = new Part() // the white ring and its two arrowheads

// Heights (model z = lidar − 0.3; z 0 is the ground at the south tip).
const VIADUCT = 8.0        // the Main Street viaduct deck along the west face
const BASE_TOP = 17.9      // top of the two-storey cream storefront base (viaduct level + ≈ 9.9)
const BRICK_TOP = 45.6     // brick shaft: storeys 3–10 (3.35 m each) over the base
const TOP_FH = (53.0 - BRICK_TOP) / 2  // the cream top's two storeys
const TOP = 53.0           // top of the cream twelfth storey
const ROOF = 53.4          // roof (lidar 53.7)
const CORNICE = 55.6       // cornice top (lidar 55–56)

const WEST = RING.length - 1, NORTH = 0
const allEdges = Array.from({ length: RING.length }, (_, i) => i)
const edgeLen = (e: number) => { const a = RING[e], b = RING[(e + 1) % RING.length]; return Math.hypot(b[0] - a[0], b[1] - a[1]) }
const baysOf = (e: number) => (e === WEST ? 10 : e === NORTH ? 6 : edgeLen(e) < 3.5 ? 0 : 1)

// Walls in three bands, then the cornice.
// A low course split every 2 m, so the base stands on the ground all along its edges.
{
  const n = RING.length
  for (let i = 0; i < n; i++) {
    const a = RING[i], b = RING[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.ceil(L / 2)
    const e = norm([b[0] - a[0], b[1] - a[1]]), out: V3 = [-e[1], e[0], 0]
    for (let j = 0; j < k; j++) {
      const p0: P2 = [a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k], p1: P2 = [a[0] + (b[0] - a[0]) * (j + 1) / k, a[1] + (b[1] - a[1]) * (j + 1) / k]
      qf(cream, [p0[0], p0[1], 0], [p1[0], p1[1], 0], [p1[0], p1[1], 0.6], [p0[0], p0[1], 0.6], out)
    }
  }
}
// Below the viaduct deck the lower storeys are brick (estimated; only the
// storefront storeys at the viaduct level are cream in the photos).
band(brick, 0.6, VIADUCT)
band(cream, VIADUCT, BASE_TOP)
band(cream, BASE_TOP, BASE_TOP + 0.35, 0, 0.3)
band(cream, BASE_TOP + 0.35, BASE_TOP + 0.7, 0.3, 0.3)
band(cream, BASE_TOP + 0.7, BASE_TOP + 0.9, 0.3, 0)
band(brick, BASE_TOP + 0.9, BRICK_TOP)
band(cream, BRICK_TOP, TOP)
band(cream, TOP, TOP + 0.9, 0, 1.3)             // the cornice's bed moulding and brackets, rolled out
band(cream, TOP + 0.9, CORNICE - 0.4, 1.3, 1.3)
band(cream, CORNICE - 0.4, CORNICE, 1.3, 0.9)
band(cream, CORNICE, CORNICE, 0.9, -0.5)        // the cornice top, a flat ring
band(cream, CORNICE, ROOF + 0.8, -0.5, -0.5)    // parapet inner face
lid(steel, -0.5, ROOF + 0.8)

// Windows. Storefronts two storeys tall at the viaduct level; the lower
// storeys show only on the north and the curved east faces, below the viaduct.
for (const e of allEdges) {
  const n = baysOf(e)
  windows(win, e, n, 3.4, VIADUCT + 1.0, BASE_TOP - 0.6)
  if (e !== WEST) windows(win, e, n, 3.0, 1.2, VIADUCT - 0.8)
  // Brick shaft: one panel per bay per pair of storeys (3–4, 5–6, 7–8,
  // 9–10), narrow, in a white frame, with brick piers and spandrels between.
  const sh0 = BASE_TOP + 0.9, fh = (BRICK_TOP - sh0) / 8
  for (let k = 0; k < 4; k++) {
    const lo = sh0 + fh * 2 * k + 1.2, hi = sh0 + fh * 2 * (k + 1) - 1.2
    windows(cream, e, n, 2.3, lo - 0.2, hi + 0.2, false, 0.03)          // white frame
    windows(win, e, n, 1.9, lo, hi)
  }
  // The cream top: two storeys of rectangular windows under the cornice.
  for (let k = 0; k < 2; k++) {
    const lo = BRICK_TOP + TOP_FH * k + 0.9, hi = BRICK_TOP + TOP_FH * (k + 1) - 0.8
    windows(win, e, n, 2.2, lo, hi)
  }
}

// Roof: the penthouse and the water tank north-east of the sign.
{
  const z = ROOF + 0.8
  const box = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) => {
    qf(steel, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
    qf(steel, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
    qf(steel, [x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [0, 1, 0])
    qf(steel, [x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [-1, 0, 0])
    qf(steel, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
  }
  box(1.5, 11.5, -7.0, 2.0, z, 59.8)
  box(2.0, 7.0, 2.0, 8.0, z, 57.6)
  cyl(steel, [4.5, 5.0, 57.6], 2.6, 6.3, 12, 1.0)
}

// ---------------------------------------------------------------------------
// The sign. Its plane runs along the lidar's line of high points (≈ 75–76
// over (−12, −4)…(0, −22)), facing west-south-west toward the viaduct, Union
// Station and the Liberty Memorial. u to the reader's right, v up, w toward
// the reader.

const SC: P2 = [-6.0, -13.0]
const U: P2 = [0.555, -0.832], WD: P2 = [-0.832, -0.555]
const RO = 9.8                        // ring outer radius (D 19.6 m: WESTERN is 1.1 D wide)
const VC = 76.4 - RO                  // ring centre height: the ring's top is the lidar's 76.4
const signAt = (u: number, v: number, w: number): V3 => [SC[0] + U[0] * u + WD[0] * w, SC[1] + U[1] * u + WD[1] * w, v]

// Letterforms traced from the photos (Zahnd, Sableman): a bold, square-
// shouldered sans, the W with pointed feet, round-bowled R, oval O. Cap height 1.
const G: Record<string, { w: number; draw: (p: Pen) => void }> = {
  W: { w: 0.86, draw: (p) => p.moveTo([0, 1]).lineTo([0.2, 0]).lineTo([0.43, 0.72]).lineTo([0.66, 0]).lineTo([0.86, 1]) },
  E: { w: 0.56, draw: (p) => { p.moveTo([0.56, 1]).lineTo([0, 1]).lineTo([0, 0]).lineTo([0.56, 0]); p.moveTo([0, 0.52]).lineTo([0.46, 0.52]) } },
  S: { w: 0.6, draw: (p) => p.moveTo([0.58, 0.84]).cubicTo([0.52, 1.03], [0.04, 1.05], [0.04, 0.75]).cubicTo([0.04, 0.5], [0.6, 0.54], [0.6, 0.25]).cubicTo([0.6, -0.05], [0.06, -0.04], [0.01, 0.17]) },
  T: { w: 0.66, draw: (p) => { p.moveTo([0, 1]).lineTo([0.66, 1]); p.moveTo([0.33, 1]).lineTo([0.33, 0]) } },
  R: { w: 0.62, draw: (p) => { p.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.34, 1]).cubicTo([0.64, 1], [0.64, 0.5], [0.34, 0.5]).lineTo([0, 0.5]); p.moveTo([0.3, 0.5]).lineTo([0.62, 0]) } },
  N: { w: 0.62, draw: (p) => p.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.62, 0]).lineTo([0.62, 1]) },
  A: { w: 0.72, draw: (p) => { p.moveTo([0, 0]).lineTo([0.36, 1]).lineTo([0.72, 0]); p.moveTo([0.14, 0.36]).lineTo([0.58, 0.36]) } },
  U: { w: 0.62, draw: (p) => p.moveTo([0, 1]).lineTo([0, 0.34]).cubicTo([0, -0.1], [0.62, -0.1], [0.62, 0.34]).lineTo([0.62, 1]) },
  O: { w: 0.7, draw: (p) => p.circle([0.35, 0.5], 0.35, 0.5, 16) },
}
function word(text: string, gap: number) {
  const pen = new Pen()
  let x = 0
  for (const ch of text) {
    const g = new Pen(); G[ch].draw(g)
    pen.add(g, x)
    x += G[ch].w + gap
  }
  return { pen, width: x - gap }
}
const CAP = 3.4, STROKE = 0.24
for (const [text, top] of [['WESTERN', 76.4 - 0.21 * 2 * RO], ['AUTO', 76.4 - 0.47 * 2 * RO]] as [string, number][]) {
  const { pen, width } = word(text, 0.24)
  const u0 = -(width * CAP) / 2, v0 = top - CAP
  strokes(neonRed, pen.paths, { width: STROKE, depth: 0.5, back: true, place: (u, v, w) => signAt(u0 + u * CAP, v0 + v * CAP, w) })
}

// The ring: one bold band, open at the lower left, each end an arrowhead.
{
  const RC = RO - 0.6, BW = 1.2
  const ring = new Pen()
  const pt = (deg: number, r = RC): Pt => [r * Math.cos((deg * Math.PI) / 180), r * Math.sin((deg * Math.PI) / 180)]
  ring.moveTo(pt(90)).arc([0, 0], (115 * Math.PI) / 180, 10)       // left arc, anticlockwise to 205°
  ring.moveTo(pt(90)).arc([0, 0], (-178 * Math.PI) / 180, 16)      // right arc, clockwise to 272°
  strokes(neonRing, ring.paths, { width: BW, depth: 0.5, back: true, place: (u, v, w) => signAt(u, VC + v, w - 0.55) })
  // Arrowheads: flat triangles, their bases across the band's end, pointing on round.
  const head = (deg: number, dir: P2) => {
    const base = pt(deg), d = norm(dir), nrm: P2 = [-d[1], d[0]], hw = 1.5, len = 2.6
    const tri: Pt[] = [[base[0] + nrm[0] * hw, base[1] + nrm[1] * hw], [base[0] + d[0] * len, base[1] + d[1] * len], [base[0] - nrm[0] * hw, base[1] - nrm[1] * hw]]
    const P = (q: Pt, w: number) => signAt(q[0], VC + q[1], w - 0.55)
    const fw: V3 = [WD[0], WD[1], 0], bw: V3 = [-WD[0], -WD[1], 0]
    tf(neonRing, P(tri[0], 0.5), P(tri[1], 0.5), P(tri[2], 0.5), fw)
    tf(neonRing, P(tri[0], 0), P(tri[1], 0), P(tri[2], 0), bw)
    for (let i = 0; i < 3; i++) {
      const a = tri[i], b = tri[(i + 1) % 3], mid: P2 = [(a[0] + b[0]) / 2 - base[0], (a[1] + b[1]) / 2 - base[1]]
      const o = signAt(mid[0], VC + mid[1], 0), c0 = signAt(0, VC, 0)
      qf(neonRing, P(a, 0), P(b, 0), P(b, 0.5), P(a, 0.5), [o[0] - c0[0], o[1] - c0[1], o[2] - c0[2]])
    }
  }
  head(205, [0.8, -0.35])
  head(272, [-0.95, -0.3])
}

// The lattice frame behind: four posts on the roof, four rails, raking back legs.
{
  const z0 = ROOF + 0.8, top = VC + 8.2, wb = -1.0
  for (const u of [-7.5, -2.5, 2.5, 7.5]) {
    beam(steel, signAt(u, z0, wb), signAt(u, top, wb), 0.4)
    beam(steel, signAt(u, z0, -5.5), signAt(u, top - 0.4, wb - 0.3), 0.35)
  }
  for (const v of [VC - 9.0, VC - 3.2, VC + 2.6, top - 0.2]) beam(steel, signAt(-8.0, v, wb), signAt(8.0, v, wb), 0.3)
}

// ---------------------------------------------------------------------------
// Materials: colours from the daylight photos (Sableman, Zahnd), pulled to
// the palette's lightness. At night the sign's letters glow red and the ring
// warm white (KellyK; elisfkc2), and the lofts' windows are lit.

const parts = [
  { part: cream, material: { name: 'terracotta-cream', color: 0xece2cf, roughness: 0.85 } },
  { part: brick, material: { name: 'brick', color: 0x76453a, roughness: 0.9 } },
  { part: win, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
  { part: steel, material: { name: 'metal', color: 0x8e8b86, roughness: 0.7 } },
  { part: neonRed, material: { name: 'neon-western-auto-red', color: 0xc8302c, roughness: 0.5 } },
  { part: neonRing, material: { name: 'neon-western-auto-white', color: 0xf3ebdc, roughness: 0.5 } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Western Auto Building', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 3.1, osm: 'way/288033189', footprint: [30.5, 51.4], height: 76.4,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/kc-western-auto-building.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
