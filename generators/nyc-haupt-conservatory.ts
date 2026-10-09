/**
 * Enid A. Haupt Conservatory, New York Botanical Garden, the Bronx — procedural, CC0-1.0, no textures.
 * bun generators/nyc-haupt-conservatory.ts
 *
 * Map frame: x = model east (the lawn side; the courtyard is to −x), y =
 * model north (along the main galleries), z up, metres. Placed at bearing
 * −31.5°, the line of the Palm House and its two long galleries. Anchor:
 * area centroid of the OSM outline way/284835739.
 *
 * Identifying features (from the photos): the Palm House, a tall glass dome
 * on a white arcaded base with an entrance frontispiece, a clerestory drum, an
 * upper dome and a lantern; the long curvilinear glass galleries (glass walls
 * on a stone base under curved glass roofs with a raised ridge); the stepped,
 * cross-shaped corner and end pavilions; the C plan round the courtyard with
 * its apse-ended returning wings; everything white-framed glass.
 *
 * Evidence
 * - OSM way/284835739 (outline) and its parts: 333933247 (Palm House, a
 *   28.6 m circle), 335587477 (its lantern), 334963115/334963049 (main
 *   galleries), 334959164/334960333 (corner pavilions), 334963825/334963826
 *   (connecting galleries), 334961621/334959161 (end pavilions),
 *   334961620/334961377 + 334962878/334962999 (the returning wings and
 *   their apses). OSM's heights (8–13 m) are too low for the dome.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), resampled into the model frame
 *   (/tmp/city/nyc/work/nyc-haupt-conservatory/rot.png), heights above the
 *   lowest ground (31.6 m NAVD88, the lawn side): Palm House 13 m at r 13.6,
 *   16 m at r 10.6, 20 m at r 7.6, 24 m at r 4.6, 27 m at the top; galleries
 *   and returning wings 8 m; corner pavilions 14 m; end pavilions 12 m;
 *   connecting galleries 7–8 m; the annex north of the north connector 3–4 m.
 * - Published: 1902, Lord & Burnham; eleven pavilions in a 512 ft (156 m)
 *   C round the Palm House, whose dome is 90 ft (27 m) high; steel and
 *   glass on a masonry base (Wikipedia; NRHP 1973).
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-haupt-conservatory/photos/credits.txt: the Palm
 *   House's front from the lawn (Krzysztof Ziarnek CC BY-SA 4.0; Antigng CC
 *   BY-SA 4.0; Jim.henderson CC0), the dome and a corner pavilion from the lawn
 *   (Dmadeo CC BY-SA 3.0), the courtyard and galleries (Acroterion CC BY-SA
 *   4.0, two), a corner pavilion and the dome with a gallery (King of Hearts
 *   CC BY-SA 3.0), from across the lawn (Pablo Costa Tirado CC BY-SA 3.0).
 * - USGS NAIP orthophoto (public domain) for the plan and roof colours: the
 *   glass roofs read white from above; the service range has a flat white roof.
 *
 * Estimated: the gallery and pavilion roof profiles (fitted to the lidar
 * heights and the photos), the Palm House's sixteen sides and the split of its
 * height between base, lower dome, drum, upper dome and lantern (photos,
 * matched to the lidar profile), the rib spacing (drawn bold, every ~4 m, not
 * the real pane bars), the frontispiece's size, the stone base's height
 * (1.4 m), the service range as a plain flat-roofed box (NAIP).
 */
import { Part, type V3 } from './mesh'
import { PALETTE } from './palette'
import { type XY, prism, finishModel, circle } from './nyc-570-lexington'
import { archPanel, rectPanel, band } from './nyc-city-hall'

const stone = new Part(), trim = new Part(), glass = new Part(), gold = new Part()

const BASE = 1.4 // stone base under all the glasshouses
const RIB = 0.9 // bold white rib width
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]

/** A strip of width w along a polyline of points pts, lifted by `lift` along each segment's outward normal. */
function strip(p: Part, pts: V3[], side: V3, w: number, out: (a: V3, b: V3) => V3, lift = 0.08) {
  for (let k = 0; k < pts.length - 1; k++) {
    const a = pts[k], b = pts[k + 1], n = out(a, b)
    const a0 = add(add(a, side, -w / 2), n, lift), a1 = add(add(a, side, w / 2), n, lift)
    const b0 = add(add(b, side, -w / 2), n, lift), b1 = add(add(b, side, w / 2), n, lift)
    // wind so the face looks along n
    const fn = [(a1[1] - a0[1]) * (b0[2] - a0[2]) - (a1[2] - a0[2]) * (b0[1] - a0[1]), (a1[2] - a0[2]) * (b0[0] - a0[0]) - (a1[0] - a0[0]) * (b0[2] - a0[2]), (a1[0] - a0[0]) * (b0[1] - a0[1]) - (a1[1] - a0[1]) * (b0[0] - a0[0])]
    if (fn[0] * n[0] + fn[1] * n[1] + fn[2] * n[2] > 0) p.quad(a0, a1, b1, b0); else p.quad(a0, b0, b1, a1)
  }
}

/** A quad wound so it faces along `o`. */
function oq(p: Part, A: V3, B: V3, C: V3, D: V3, o: V3) {
  const n = [(B[1] - A[1]) * (C[2] - A[2]) - (B[2] - A[2]) * (C[1] - A[1]), (B[2] - A[2]) * (C[0] - A[0]) - (B[0] - A[0]) * (C[2] - A[2]), (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0])]
  if (n[0] * o[0] + n[1] * o[1] + n[2] * o[2] >= 0) p.quad(A, B, C, D); else p.quad(A, D, C, B)
}
/** Outward direction at q for a surface around the vertical axis through c (or the line a→b). */
const awayFrom = (c: XY, q: V3, up = 0.3): V3 => unit([q[0] - c[0], q[1] - c[1], up])

type Profile = [number, number][] // [inset from the wall line, height above the base]
const GALLERY: Profile = [[0, 0], [0, 2.4], [0.5, 3.8], [1.6, 5.1], [3.0, 5.85], [3.0, 6.5]]

/**
 * A straight curvilinear glasshouse from a to b, half-width hw, on the stone base:
 * glass walls and curved glass roof to a raised flat ridge, white ribs every ~4 m,
 * white eave and ridge. Ends: 'flat' (a glass end wall) or 'apse' (the profile
 * turned through a half circle about the end point).
 */
function gallery(a: XY, b: XY, hw: number, prof: Profile, ends: ["flat" | "apse", "flat" | "apse"], ribEvery = 3.2) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const nx = uy, ny = -ux // right-hand side normal
  const sec = (s: number): V3[] => {
    const cx = a[0] + ux * s, cy = a[1] + uy * s, pts: V3[] = []
    for (const [d, z] of prof) pts.push([cx + nx * (hw - d), cy + ny * (hw - d), BASE + z])
    for (const [d, z] of [...prof].reverse()) pts.push([cx - nx * (hw - d), cy - ny * (hw - d), BASE + z])
    return pts
  }
  const s0 = sec(0), s1 = sec(L), m = prof.length
  // sides (glass) and the flat ridge (trim), as quads between the two end sections
  for (let k = 0; k < 2 * m - 1; k++) {
    const part = k === m - 1 ? trim : glass
    const mid: V3 = [(s0[k][0] + s0[k + 1][0]) / 2, (s0[k][1] + s0[k + 1][1]) / 2, 0]
    const side = (mid[0] - a[0]) * nx + (mid[1] - a[1]) * ny
    const o: V3 = k === m - 1 ? [0, 0, 1] : unit([nx * Math.sign(side), ny * Math.sign(side), 0.4])
    oq(part, s0[k], s0[k + 1], s1[k + 1], s1[k], o)
  }
  // ribs: transverse, across the whole section
  const n = Math.max(1, Math.round(L / ribEvery))
  for (let r = 0; r <= n; r++) {
    const s = Math.min(Math.max((L * r) / n, RIB / 2), L - RIB / 2)
    const pts = sec(s)
    const mx = a[0] + ux * s, my = a[1] + uy * s
    const half = pts.length / 2
    for (const seg of [pts.slice(0, half), pts.slice(half)]) strip(trim, seg, [ux, uy, 0], RIB, (p, q) => {
      const t: V3 = [q[0] - p[0], q[1] - p[1], q[2] - p[2]]
      const across = unit([(p[0] + q[0]) / 2 - mx, (p[1] + q[1]) / 2 - my, 0])
      const h = t[0] * across[0] + t[1] * across[1]
      const c1 = unit([across[0] * t[2], across[1] * t[2], -h])
      return c1[0] * across[0] + c1[1] * across[1] + c1[2] * 0.3 >= 0 ? c1 : [-c1[0], -c1[1], -c1[2]]
    })
  }
  // two white purlin bands along each side of the curved roof
  for (const k of [2, 3]) {
    const A0 = s0[k], A1 = s0[k + 1 < m ? k : k], B0 = s1[k]
    for (const [P0, P1] of [[s0[k], s1[k]], [s0[2 * m - 1 - k], s1[2 * m - 1 - k]]] as [V3, V3][]) {
      const across = unit([P0[0] - a[0] - ux * ((P0[0] - a[0]) * ux + (P0[1] - a[1]) * uy), P0[1] - a[1] - uy * ((P0[0] - a[0]) * ux + (P0[1] - a[1]) * uy), 0])
      const o: V3 = unit([across[0], across[1], 0.8])
      const w = 0.35
      const q0 = add(add(P0, [0, 0, -w]), o, 0.09), q1 = add(add(P1, [0, 0, -w]), o, 0.09), q2 = add(add(P1, [0, 0, w]), o, 0.09), q3 = add(add(P0, [0, 0, w]), o, 0.09)
      oq(trim, q0, q1, q2, q3, o)
    }
    void A0; void A1; void B0
  }
  // eave bands (trim) along both sides at the wall head
  const eave = prof[1][1]
  for (const sgn of [1, -1]) {
    const p0: V3 = [a[0] + nx * hw * sgn, a[1] + ny * hw * sgn, BASE + eave - 0.6], p1: V3 = [b[0] + nx * hw * sgn, b[1] + ny * hw * sgn, BASE + eave - 0.6]
    const o: V3 = [nx * sgn * 0.09, ny * sgn * 0.09, 0]
    const q0 = add(p0, o), q1 = add(p1, o)
    const q2 = add(q1, [0, 0, 0.7]), q3 = add(q0, [0, 0, 0.7])
    oq(trim, q0, q1, q2, q3, [nx * sgn, ny * sgn, 0])
  }
  // ends
  for (const [which, end] of [[0, ends[0]], [1, ends[1]]] as [number, 'flat' | 'apse'][]) {
    const S = which === 0 ? s0 : s1
    const c: XY = which === 0 ? a : b
    if (end === 'flat') {
      // convex section polygon, facing out along ∓u
      const o: V3 = which === 0 ? [-ux, -uy, 0] : [ux, uy, 0]
      for (let k = 1; k < S.length - 1; k++) oq(glass, S[0], S[k], S[k + 1], S[k + 1], o)
      continue
    }
    // apse: turn the profile through 180° about c, away from the gallery
    const dir = which === 0 ? -1 : 1
    const N = 8
    const ringAt = (d: number, z: number): V3[] => Array.from({ length: N + 1 }, (_, j) => {
      const th = (j / N) * Math.PI
      // from +n side round through the end direction to −n side
      const vx = nx * Math.cos(th) + ux * dir * Math.sin(th), vy = ny * Math.cos(th) + uy * dir * Math.sin(th)
      return [c[0] + vx * (hw - d), c[1] + vy * (hw - d), BASE + z] as V3
    })
    const rings = prof.map(([d, z]) => ringAt(d, z))
    for (let k = 0; k < rings.length - 1; k++) for (let j = 0; j < N; j++) {
      const p = k === rings.length - 2 ? trim : glass
      const A = rings[k][j], B = rings[k][j + 1], C = rings[k + 1][j + 1], D = rings[k + 1][j]
      oq(p, A, B, C, D, k === rings.length - 2 ? [0, 0, 1] : awayFrom(c, A, 0.4))
    }
    // top half-disc of the ridge
    const top = rings[rings.length - 1]
    const fan = [[c[0], c[1], top[0][2]] as V3, ...top]
    for (let j = 0; j < N; j++) oq(trim, fan[0], fan[j + 1], fan[j + 2], fan[j + 2], [0, 0, 1])
    // radial ribs
    for (const j of [2, 4, 6]) {
      const pts = rings.map((r) => r[j])
      const th = (j / N) * Math.PI
      const v: V3 = [nx * Math.cos(th) + ux * dir * Math.sin(th), ny * Math.cos(th) + uy * dir * Math.sin(th), 0]
      const side: V3 = [-v[1], v[0], 0]
      strip(trim, pts, side, RIB, (p, q) => {
        const t: V3 = [q[0] - p[0], q[1] - p[1], q[2] - p[2]]
        const c1 = unit([-t[2] * v[0], -t[2] * v[1], t[0] * v[0] + t[1] * v[1]])
        return c1[0] * v[0] + c1[1] * v[1] >= -0.01 ? c1 : [-c1[0], -c1[1], -c1[2]]
      })
    }
  }
  // stone base under it
  const r0: XY = [a[0] + nx * hw, a[1] + ny * hw], r1: XY = [b[0] + nx * hw, b[1] + ny * hw], l1: XY = [b[0] - nx * hw, b[1] - ny * hw], l0: XY = [a[0] - nx * hw, a[1] - ny * hw]
  prism({ wall: stone, win: null, roof: null, ring: [r0, r1, l1, l0], z0: 0, z1: BASE, facade: null, bevel: 0.2 })
  if (ends[0] === 'apse' || ends[1] === 'apse') {
    const c = ends[0] === 'apse' ? a : b
    stone.loft([circle(c[0], c[1], hw, 16).map(([x, y]) => [x, y, 0] as V3), circle(c[0], c[1], hw, 16).map(([x, y]) => [x, y, BASE] as V3)])
  }
}

/**
 * A curvilinear hipped glasshouse on a rectangle (centre, half sizes along the
 * model axes): the profile runs round all four sides to a flat top, ribs on the
 * long faces and down the hips.
 */
function hipped(cx: number, cy: number, hx: number, hy: number, prof: Profile, z0 = BASE, ribEvery = 6, skip = 0) {
  const ring = (d: number, z: number): V3[] => [[cx - hx + d, cy - hy + d, z0 + z], [cx + hx - d, cy - hy + d, z0 + z], [cx + hx - d, cy + hy - d, z0 + z], [cx - hx + d, cy + hy - d, z0 + z]]
  const rings = prof.map(([d, z]) => ring(d, z))
  for (let k = 0; k < rings.length - 1; k++) {
    const r0 = rings[k], r1 = rings[k + 1]
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; oq(k === rings.length - 2 && prof[k][0] === prof[k + 1][0] ? glass : glass, r0[i], r0[j], r1[j], r1[i], awayFrom([cx, cy], [(r0[i][0] + r0[j][0]) / 2, (r0[i][1] + r0[j][1]) / 2, 0], 0.3)) }
  }
  trim.cap(rings[rings.length - 1], true)
  // ribs on each face, then the four hips
  const faces: { o: V3; e: V3; half: number; c: XY }[] = [
    { o: [0, -1, 0], e: [1, 0, 0], half: hx, c: [cx, cy - hy] }, { o: [1, 0, 0], e: [0, 1, 0], half: hy, c: [cx + hx, cy] },
    { o: [0, 1, 0], e: [-1, 0, 0], half: hx, c: [cx, cy + hy] }, { o: [-1, 0, 0], e: [0, -1, 0], half: hy, c: [cx - hx, cy] },
  ]
  const dmax = prof[prof.length - 1][0]
  for (const f of faces) {
    const usable = f.half - dmax - RIB
    const n = Math.max(0, Math.floor(usable / (ribEvery / 2)))
    for (let r = -n; r <= n; r += 2) {
      if (n === 0) break
      const u = (r / n) * usable
      if (f.half > Math.min(hx, hy) + 0.1 && Math.abs(u) < skip) continue // hidden inside a pavilion's core
      const pts = prof.map(([d, z]) => [f.c[0] + f.e[0] * u - f.o[0] * d, f.c[1] + f.e[1] * u - f.o[1] * d, z0 + z] as V3)
      strip(trim, pts, f.e, RIB, (p, q) => { const t: V3 = [q[0] - p[0], q[1] - p[1], q[2] - p[2]]; const h = t[0] * f.o[0] + t[1] * f.o[1]; return unit([f.o[0] * t[2], f.o[1] * t[2], -h]) })
    }
  }
  for (let i = 0; i < 4; i++) {
    const pts = rings.map((r) => r[i])
    const diag: V3 = unit([pts[0][0] - cx, pts[0][1] - cy, 0])
    strip(trim, pts, [-diag[1], diag[0], 0], RIB * 1.2, (p, q) => { const t: V3 = [q[0] - p[0], q[1] - p[1], q[2] - p[2]]; const h = t[0] * diag[0] + t[1] * diag[1]; return unit([diag[0] * t[2], diag[1] * t[2], -h]) })
  }
  // eave band
  {
    const zA = z0 + prof[1][1] - 0.6, zB = z0 + prof[1][1] + 0.1, e = 0.1
    const c4: XY[] = [[cx - hx - e, cy - hy - e], [cx + hx + e, cy - hy - e], [cx + hx + e, cy + hy + e], [cx - hx - e, cy + hy + e]]
    for (let i = 0; i < 4; i++) { const A = c4[i], B = c4[(i + 1) % 4]; oq(trim, [A[0], A[1], zA], [B[0], B[1], zA], [B[0], B[1], zB], [A[0], A[1], zB], awayFrom([cx, cy], [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, 0], 0)) }
  }
  prism({ wall: stone, win: null, roof: null, ring: [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]], z0: 0, z1: z0, facade: null, bevel: 0.2 })
}

/** A cross-shaped pavilion: two crossing low arms and a taller hipped centre with a lantern. */
function pavilion(cx: number, cy: number, arm: number, core: number, low: Profile, high: Profile) {
  hipped(cx, cy, arm, core, low, BASE, 6, core + 0.5)
  hipped(cx, cy, core, arm, low, BASE, 6, core + 0.5)
  hipped(cx, cy, core, core, high)
  const top = BASE + high[high.length - 1][1], d = core - high[high.length - 1][0]
  // lantern: a small glazed box with a white cap
  const lr: XY[] = [[cx - d * 0.6, cy - d * 0.6], [cx + d * 0.6, cy - d * 0.6], [cx + d * 0.6, cy + d * 0.6], [cx - d * 0.6, cy + d * 0.6]]
  prism({ wall: glass, win: null, roof: trim, ring: lr, z0: top, z1: top + 0.8, facade: null, bevel: 0.15 })
}

// --- Galleries (OSM parts, centre lines in the model frame) ---
gallery([14.95, 8.6], [14.95, 45.4], 4.65, GALLERY, ['flat', 'flat']) // way/334963115
gallery([15.95, -56.4], [15.95, -19.4], 4.65, GALLERY, ['flat', 'flat']) // way/334963049
gallery([1.9, 57.5], [-21.4, 57.5], 4.3, GALLERY, ['flat', 'flat']) // way/334963825
gallery([3.6, -69.15], [-19.5, -69.15], 4.25, GALLERY, ['flat', 'flat']) // way/334963826
gallery([-28.65, 49.7], [-28.65, 24.1], 5.8, GALLERY, ['flat', 'apse']) // ways/334961620 + 334962878
gallery([-27.25, -61.8], [-27.25, -36.6], 5.75, GALLERY, ['flat', 'apse']) // ways/334961377 + 334962999
// The low service range behind the north connector (in the outline only; lidar 3–4 m;
// NAIP aerial: a flat white roof).
// The aerial shows a flat white roof, so it is drawn as a plain box.
prism({ wall: stone, win: null, roof: trim, ring: [[-19.9, 61.8], [-0.6, 61.8], [-0.6, 79.1], [-19.9, 79.1]], z0: 0, z1: 4.0, facade: null, bevel: 0.3 })

// --- Pavilions: corner (14 m) and end (12 m) ---
const LOW: Profile = [[0, 0], [0, 3.0], [0.7, 4.8], [2.0, 6.3], [3.8, 7.1], [3.8, 7.5]]
const HIGH: Profile = [[0, 0], [0, 8.4], [0.8, 10.0], [2.4, 11.4], [4.3, 12.0], [4.3, 12.3]]
pavilion(14.45, 58.05, 12.6, 6.6, LOW, HIGH) // way/334959164
pavilion(16.25, -69.05, 12.75, 6.6, LOW, HIGH) // way/334960333
const LOW_E: Profile = [[0, 0], [0, 2.8], [0.6, 4.4], [1.8, 5.7], [3.4, 6.4], [3.4, 6.8]]
const HIGH_E: Profile = [[0, 0], [0, 7.4], [0.7, 8.6], [2.0, 9.7], [3.6, 10.2], [3.6, 10.5]]
pavilion(-28.9, 57.25, 7.5, 5.4, LOW_E, HIGH_E) // way/334961621
pavilion(-26.95, -69.4, 7.6, 5.4, LOW_E, HIGH_E) // way/334959161

// --- The Palm House ---
{
  const cx = 15.6, cy = -5.65, NS = 16, R0 = 14.3
  const ph = Math.PI / NS
  const poly = (r: number): XY[] => circle(cx, cy, r, NS, ph)
  const ringZ = (r: number, z: number, n = NS): V3[] => circle(cx, cy, r, n, ph).map(([x, y]) => [x, y, z] as V3)
  // stone base and the white arcaded wall with tall arched windows
  prism({ wall: stone, win: null, roof: null, ring: poly(R0), z0: 0, z1: BASE, facade: null, bevel: 0.25 })
  const WALL = 8.6
  prism({ wall: trim, win: null, roof: null, ring: poly(R0 - 0.2), z0: BASE, z1: WALL, facade: null, bevel: 0.25 })
  const P = poly(R0 - 0.2)
  for (let i = 0; i < NS; i++) {
    const a = P[i], b = P[(i + 1) % NS], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    archPanel(glass, a, b, L / 2, L * 0.62, BASE + 0.8, WALL - 0.9, 0.06, 8)
  }
  band(trim, P, WALL - 0.2, WALL + 0.5, 0.35) // entablature
  // lower glass dome: from the cornice to the drum, with sixteen ribs
  const lower: [number, number][] = [[13.6, WALL + 0.5], [13.0, 11.6], [11.8, 14.2], [10.0, 16.4], [8.2, 17.8], [7.2, 18.3]]
  const lr = lower.map(([r, z]) => ringZ(r, z))
  glass.loft(lr)
  // drum (clerestory) with a balustrade, upper dome, lantern
  trim.loft([ringZ(7.2, 18.3), ringZ(7.4, 18.6), ringZ(7.4, 19.1), ringZ(6.9, 19.2)])
  glass.loft([ringZ(6.9, 19.2), ringZ(6.9, 21.0)])
  trim.loft([ringZ(6.9, 21.0), ringZ(7.1, 21.2), ringZ(7.1, 21.6), ringZ(6.6, 21.7)])
  const upper: [number, number][] = [[6.6, 21.7], [6.2, 22.9], [5.2, 24.1], [3.8, 24.9], [2.0, 25.4]]
  const ur = upper.map(([r, z]) => ringZ(r, z))
  glass.loft(ur)
  trim.cap(ur[ur.length - 1], true)
  const lan = (r: number, z: number) => ringZ(r, z, 8)
  glass.loft([lan(1.4, 25.4), lan(1.4, 26.3)])
  trim.loft([lan(1.4, 26.3), lan(1.6, 26.5), lan(0.6, 27.0)])
  gold.loft([lan(0.15, 27.0), lan(0.15, 27.6), lan(0.02, 28.0)])
  // meridian ribs on both domes and the drum
  for (let i = 0; i < NS; i++) {
    const t = ph + (i * 2 * Math.PI) / NS
    const v: V3 = [Math.cos(t), Math.sin(t), 0], side: V3 = [-v[1], v[0], 0]
    const out = (p: V3, q: V3): V3 => { const d: V3 = [q[0] - p[0], q[1] - p[1], q[2] - p[2]]; const h = d[0] * v[0] + d[1] * v[1]; return unit([v[0] * d[2], v[1] * d[2], -h]) }
    strip(trim, lower.map(([r, z]) => [cx + v[0] * r, cy + v[1] * r, z] as V3), side, RIB * 1.1, out)
    strip(trim, upper.map(([r, z]) => [cx + v[0] * r, cy + v[1] * r, z] as V3), side, RIB, out)
    strip(trim, [[cx + v[0] * 6.9, cy + v[1] * 6.9, 19.2], [cx + v[0] * 6.9, cy + v[1] * 6.9, 21.0]], side, RIB, () => v)
  }
  // the entrance frontispiece on the lawn side (+x): a white projecting bay
  const fx = cx + R0 - 0.6
  const front: XY[] = [[fx - 1.0, cy - 5.2], [fx + 1.6, cy - 5.2], [fx + 1.6, cy + 5.2], [fx - 1.0, cy + 5.2]]
  prism({ wall: trim, win: null, roof: trim, ring: front, z0: 0, z1: 10.4, facade: null, bevel: 0.3 })
  const fa: XY = [fx + 1.6, cy - 5.2], fb: XY = [fx + 1.6, cy + 5.2]
  archPanel(glass, fa, fb, 5.2, 3.6, BASE + 0.4, 8.0, 0.06, 8)
  for (const s of [1.5, 8.9]) rectPanel(glass, fa, fb, s, 1.4, BASE + 1.0, 6.8, 0.06)
  band(trim, front, 9.2, 9.8, 0.25)
  // steps down to the lawn
  prism({ wall: stone, win: null, roof: stone, ring: [[fx + 1.6, cy - 4.5], [fx + 4.6, cy - 4.5], [fx + 4.6, cy + 4.5], [fx + 1.6, cy + 4.5]], z0: 0, z1: 0.7, facade: null, bevel: 0.1 })
}

finishModel('Enid A. Haupt Conservatory', 'nyc-haupt-conservatory', [
  { part: stone, material: PALETTE.stone },
  { part: trim, material: PALETTE.trim },
  { part: glass, material: PALETTE.glass },
  { part: gold, material: PALETTE.metal },
], { bearing: -31.5, osm: 'way/284835739', height: 28 }, 6500)
