/**
 * African Renaissance Monument (Monument de la Renaissance africaine),
 * Collines des Mamelles, Dakar (Mansudae Overseas Projects for Pierre
 * Goudiaby Atepa, unveiled 2010): procedural, CC0-1.0.
 * bun generators/dakar-african-renaissance.ts
 *
 * Writes two levels of detail in the same frame and materials:
 * - models/dakar-african-renaissance.glb (low, under 6,500 triangles);
 * - models/dakar-african-renaissance.detail.glb (under 40,000): the same
 *   figures with finer sections, fingers of the child's pointing hand,
 *   the man's headband, more facets in the rock.
 *
 * The figures are sculpted, not boxed (second pass after review): each
 * body is lofted from many elliptic sections along a spine that leans
 * forward (the man about 24 degrees, the woman about 22); the man has a
 * broad, deep chest with pectorals, deltoids and shoulder blades, a thick
 * neck and his head turned up; his limbs are muscled lofts swelling at the
 * biceps, forearms, thighs and calves; the folded cloth at his hips flares
 * to a hem with a hanging fold; the child sits on his raised forearm at his
 * head's height. The woman is slimmer, her dress folded and its hem and
 * tail streaming back, her hair three flattened locks blowing back, her
 * right arm stretched behind. The pedestal is one jagged crag: a
 * faceted surface over the outline (rings shrinking to the centre, jittered,
 * triangulated so the planes break irregularly), low at the back and
 * rising steeply behind and beside the man's forward leg to about his
 * waist, on a plinth wall with the museum's round windows.

 * Frame: origin at the centroid of the OSM outline (way/1417550130,
 * tourism=artwork, no building tag), bearing 286: the outline's long axis
 * (43 x 16 m), which is the way the group faces and the child points
 * (published: the child points west, toward the Atlantic). +y is forward,
 * +x is the man's right. The man stands at the front, emerging from the
 * rock with his left knee forward; the woman is on his right and behind
 * him, leaning back with her right arm stretched behind; the low rock
 * ramp at the back (-y) carries her trailing foot (rh, sh, ad1).
 *
 * Heights. Published: 49 m (OSM's brief; en.wikipedia gives 50 m and
 * other sources 52 m) for the bronze above its rock; OSM height=60 for the
 * whole. Used: the child's head 52 m above the plinth's foot. Scaled from
 * "The African Renaissance Monument.jpg" (rh, side view, 0.107 m/px at
 * the statue): the man's head top 47.5 m, chin 41.7, shoulders 37,
 * waist 25, his forward knee 12 m; the woman's head top 40.5, hips 23;
 * the tall rock behind the man's left side 24 m; the low ramp at the back
 * 4-6 m. Widths from human proportion (the man's head 6 m tall).
 * Estimated: every pose angle (from rh, sh, ad1, tf), the rock's facets.
 *
 * Ground: the hilltop. The map's terrain (Mapterhorn z12; z13-15 return
 * 404) is a coarse dome falling about 2-4 m across the footprint; the plinth
 * and every rock mass run to y = 0 and sink into the uphill side; the
 * terrain check prints ok twice. The esplanade and the
 * stairs are terrain and not modelled. Elevation 0.
 *
 * Colours from the daylight photos: the bronze reads dark olive-bronze
 * (#5e5440 to #6b5f48, sampled #63654f in rh), used #675c46, a little
 * glossy so the highlights lift; the rock is a reddish brown (#594244
 * in sh, sunlit), pulled lighter.
 *
 * Night: the statue is floodlit from below; bronze and rock carry
 * `_FLOODLIGHT`; the museum's small round windows in the plinth glow.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - rh "The African Renaissance Monument.jpg", Richard N Horne, CC BY 4.0
 *   https://commons.wikimedia.org/wiki/File:The_African_Renaissance_Monument.jpg
 * - sh "African Renaissance Monument.jpg", Shutterframestheworld, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:African_Renaissance_Monument.jpg
 * - ad1 "Spomenik afričke renesanse 2026.jpg", August Dominus, CC0
 *   https://commons.wikimedia.org/wiki/File:Spomenik_afri%C4%8Dke_renesanse_2026.jpg
 * - ad2 "Spomenik afričke renesanse u Senegalu 28. veljače 2026.jpg", August Dominus, CC0
 *   https://commons.wikimedia.org/wiki/File:Spomenik_afri%C4%8Dke_renesanse_u_Senegalu_28._velja%C4%8De_2026.jpg
 * - tf "Monument renaissance.jpg", Tafsir207, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Monument_renaissance.jpg
 * - gr "African Renaissance Monument Dakar 2025.jpg", Gromane, CC0
 *   https://commons.wikimedia.org/wiki/File:African_Renaissance_Monument_Dakar_2025.jpg
 * Look-only: none.
 *
 * Doubts: the compass orientation rests on the published "the child
 * points west" and the outline's long axis; no photo has a known camera
 * position. The far side of the group (the man's back) has no photo; the
 * man's right leg is taken as hidden in the rock. The figures are a
 * simplified sculpture: proportions and pose, not anatomy.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { TAU, face, norm, quad, save, tri, type Mat, type XY } from './cairo-cairo-tower'

// ───────────────────────────── figure kit ─────────────────────────────────

const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add3 = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** Two unit vectors perpendicular to d (and to each other). */
function basis(d: V3): [V3, V3] {
  const t: V3 = Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const u = norm(crs(d, t)), v = norm(crs(d, u))
  return [u, v]
}

/** A ring: centre, two semi-axis vectors. */
export type Ring = { c: V3; a: V3; b: V3 }
const ringPt = (r: Ring, t: number): V3 => add3(add3(r.c, r.a, Math.cos(t)), r.b, Math.sin(t))

/**
 * Loft closed elliptic rings (all wound the same way) with smooth
 * normals; `capStart`/`capEnd` close the ends with a fan to a point
 * pushed `bulge` beyond the ring along the loft.
 */
export function loftRings(p: Part, rings: Ring[], seg: number, capStart = 0, capEnd = 0) {
  const pts = rings.map((r) => Array.from({ length: seg }, (_, i) => ringPt(r, (TAU * i) / seg)))
  const nrm = rings.map((r, k) => Array.from({ length: seg }, (_, i) => {
    const t = (TAU * i) / seg
    // the ellipse's outward normal in its plane, tilted by the loft's taper
    const n = add3(add3([0, 0, 0], r.a, Math.cos(t) / (dot(r.a, r.a) || 1)), r.b, Math.sin(t) / (dot(r.b, r.b) || 1))
    const prev = rings[Math.max(0, k - 1)], next = rings[Math.min(rings.length - 1, k + 1)]
    const along = norm(sub3(next.c, prev.c))
    const dr = sub3(ringPt(next, t), ringPt(prev, t))
    const radial = norm(n)
    const l = Math.hypot(dr[0], dr[1], dr[2]) || 1
    const slope = dot(dr, radial) / l
    return norm(add3(radial, along, -slope))
  }))
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < seg; i++) {
      const j = (i + 1) % seg
      quad(p, pts[k][i], pts[k][j], pts[k + 1][j], pts[k + 1][i], [nrm[k][i], nrm[k][j], nrm[k + 1][j], nrm[k + 1][i]])
    }
  const capAt = (k: number, sgn: number, bulge: number) => {
    const r = rings[k], o = rings[k - sgn] ?? r
    const along = norm(sub3(r.c, o.c))
    const tip = add3(r.c, along, bulge)
    for (let i = 0; i < seg; i++) {
      const j = (i + 1) % seg
      tri(p, pts[k][i], pts[k][j], tip, [nrm[k][i], nrm[k][j], along])
    }
  }
  if (capStart) capAt(0, -1, capStart)
  if (capEnd) capAt(rings.length - 1, 1, capEnd)
}

/** An ellipsoid at c with semi-axes along the unit vectors X, Y, Z (radii rx, ry, rz). */
export function ellipsoid(p: Part, c: V3, rx: number, ry: number, rz: number, seg: number, X: V3 = [1, 0, 0], Y: V3 = [0, 1, 0], Z: V3 = [0, 0, 1]) {
  const rows = Math.max(3, Math.round(seg / 2))
  const P = (u: number, v: number): [V3, V3] => {
    const cu = Math.cos(u), su = Math.sin(u), cv = Math.cos(v), sv = Math.sin(v)
    const pt = add3(add3(add3(c, X, rx * cv * cu), Y, ry * cv * su), Z, rz * sv)
    const n = norm(add3(add3(add3([0, 0, 0], X, (cv * cu) / rx), Y, (cv * su) / ry), Z, sv / rz))
    return [pt, n]
  }
  for (let r = 0; r < rows; r++) {
    const v0 = -Math.PI / 2 + (Math.PI * r) / rows, v1 = -Math.PI / 2 + (Math.PI * (r + 1)) / rows
    for (let i = 0; i < seg; i++) {
      const u0 = (TAU * i) / seg, u1 = (TAU * (i + 1)) / seg
      const [a, na] = P(u0, v0), [b, nb] = P(u1, v0), [c2, nc] = P(u1, v1), [d, nd] = P(u0, v1)
      if (r > 0) tri(p, a, b, c2, [na, nb, nc])
      if (r < rows - 1) tri(p, a, c2, d, [na, nc, nd])
    }
  }
}

/** A tapered limb from a (radius ra) to b (radius rb) through optional mid joints, with ball joints. */
export function limb(p: Part, joints: V3[], radii: number[], seg: number, balls = true) {
  for (let k = 0; k < joints.length - 1; k++) {
    const a = joints[k], b = joints[k + 1], d = norm(sub3(b, a))
    const [u, v] = basis(d)
    loftRings(p, [{ c: a, a: add3([0, 0, 0], u, radii[k]), b: add3([0, 0, 0], v, radii[k]) }, { c: b, a: add3([0, 0, 0], u, radii[k + 1]), b: add3([0, 0, 0], v, radii[k + 1]) }], seg)
  }
  if (balls) joints.forEach((j, k) => ellipsoid(p, j, radii[k], radii[k], radii[k], Math.max(6, seg - 2)))
}

/**
 * A body lofted along a spine: each section [x, y, z, rx, ry, turn] is an
 * ellipse in the horizontal plane, rx across and ry fore and aft, turned
 * by `turn` radians about the vertical.
 */
export function trunk(p: Part, secs: number[][], seg: number, capStart = 0, capEnd = 0) {
  loftRings(p, secs.map(([x, y, z, rx, ry, turn = 0]) => ({ c: [x, y, z] as V3, a: [rx * Math.cos(turn), rx * Math.sin(turn), 0] as V3, b: [-ry * Math.sin(turn), ry * Math.cos(turn), 0] as V3 })), seg, capStart, capEnd)
}

/** A swept sheet (hair, a cloth's tail): a centre-line, widths, a thickness, its width across `side`. */
export function sheet(p: Part, line: V3[], widths: number[], side: V3, thick: number) {
  const L = line.map((q, i) => {
    const w = widths[i] / 2
    const d = norm(sub3(line[Math.min(line.length - 1, i + 1)], line[Math.max(0, i - 1)]))
    const s = norm(sub3(side, add3([0, 0, 0], d, dot(side, d))))
    const n = norm(crs(d, s))
    return { l: add3(q, s, w), r: add3(q, s, -w), n, s }
  })
  for (let i = 0; i < L.length - 1; i++) {
    const A = L[i], B = L[i + 1]
    for (const sg of [1, -1]) {
      const o = (q: V3, n: V3) => add3(q, n, (sg * thick) / 2)
      const n: V3 = [A.n[0] * sg, A.n[1] * sg, A.n[2] * sg], m: V3 = [B.n[0] * sg, B.n[1] * sg, B.n[2] * sg]
      quad(p, o(A.l, A.n), o(A.r, A.n), o(B.r, B.n), o(B.l, B.n), [n, n, m, m])
    }
    for (const [ea, eb, s] of [[A.l, B.l, 1], [A.r, B.r, -1]] as [V3, V3, number][]) {
      const n = norm(add3([0, 0, 0], A.s, s))
      quad(p, add3(ea, A.n, -thick / 2), add3(eb, B.n, -thick / 2), add3(eb, B.n, thick / 2), add3(ea, A.n, thick / 2), n)
    }
  }
}

/**
 * A faceted rock block: a convex plan ring (counter-clockwise), from z0 up
 * to a sloped top z = h + gx x + gy y, optionally with a ridge raised `peak`
 * at the plan's centre (a pyramid cap).
 */
export function rock(p: Part, ring: XY[], z0: number, h: number, gx = 0, gy = 0, peak = 0) {
  const zt = ([x, y]: XY) => h + gx * x + gy * y
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const n = norm([b[1] - a[1], -(b[0] - a[0]), 0])
    quad(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], zt(b)], [a[0], a[1], zt(a)], n)
  }
  const c: XY = [ring.reduce((s, q) => s + q[0], 0) / ring.length, ring.reduce((s, q) => s + q[1], 0) / ring.length]
  const apex: V3 = [c[0], c[1], zt(c) + peak]
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const A: V3 = [a[0], a[1], zt(a)], B: V3 = [b[0], b[1], zt(b)]
    const n = norm(crs(sub3(B, A), sub3(apex, A)))
    tri(p, A, B, apex, n[2] < 0 ? [-n[0], -n[1], -n[2]] : n)
  }
}

/** Append src to dst moved dy along +y (map frame). */
function shiftInto(dst: Part, src: Part, dy: number) {
  for (let i = 0; i < src.pos.length; i += 3) dst.pos.push(src.pos[i], src.pos[i + 1], src.pos[i + 2] - dy)
  dst.nrm.push(...src.nrm); dst.uv.push(...src.uv)
}

// ───────────────────────────── the monument ───────────────────────────────

/** OSM way/1417550130 in this frame (bearing 286, about its centroid). */
const OUTLINE: XY[] = [[6.8, -13.7], [8.2, -3.9], [8.4, 8.0], [6.7, 16.3], [4.3, 20.0], [-2.7, 21.4], [-7.3, 17.8], [-7.2, -18.9], [-5.6, -21.8], [-1.5, -22.1], [1.3, -20.4], [4.6, -18.0]]

/** Loft rings of points (each ring closed, same count) with smooth normals pointing away from each ring's centre. */
export function loftPts(p: Part, rings: V3[][], capEnd = false) {
  const n = rings[0].length, K = rings.length
  const cen = rings.map((r) => r.reduce((s, q) => add3(s, q, 1 / n), [0, 0, 0] as V3))
  const N = rings.map((r, k) => r.map((q, i) => {
    const du = sub3(r[(i + 1) % n], r[(i + n - 1) % n])
    const dv = sub3(rings[Math.min(K - 1, k + 1)][i], rings[Math.max(0, k - 1)][i])
    let m = norm(crs(du, dv))
    if (dot(m, sub3(q, cen[k])) < 0) m = [-m[0], -m[1], -m[2]]
    return m
  }))
  for (let k = 0; k < K - 1; k++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    quad(p, rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i], [N[k][i], N[k][j], N[k + 1][j], N[k + 1][i]])
  }
  if (capEnd) {
    const last = rings[K - 1], c = cen[K - 1], along = norm(sub3(c, cen[K - 2]))
    for (let i = 0; i < n; i++) tri(p, last[i], last[(i + 1) % n], c, [N[K - 1][i], N[K - 1][(i + 1) % n], along])
  }
}

/** A muscled limb from a to b: radius r0 at a, r1 at b, swelling to `bulge` at fraction `at`; flattened by `flat` across. */
export function muscle(p: Part, a: V3, b: V3, r0: number, r1: number, bulge: number, seg: number, rings = 4, at = 0.4, flat = 0.85) {
  const d = norm(sub3(b, a)), [u, v] = basis(d)
  const R: V3[][] = []
  for (let k = 0; k <= rings; k++) {
    const t = k / rings, c = add3(a, sub3(b, a), t)
    const base = r0 + (r1 - r0) * t
    const sw = Math.max(0, Math.sin(Math.PI * Math.min(1, t / (2 * at) < 0.5 ? t / (2 * at) : 0.5 + (t - at) / (2 * (1 - at)))))
    const r = base + (bulge - (r0 + (r1 - r0) * at)) * sw
    R.push(Array.from({ length: seg }, (_, i) => { const th = (TAU * i) / seg; return add3(add3(c, u, r * Math.cos(th)), v, r * flat * Math.sin(th)) }))
  }
  loftPts(p, R)
  ellipsoid(p, a, r0, r0, r0, Math.max(6, seg - 2))
  ellipsoid(p, b, r1, r1, r1, Math.max(6, seg - 2))
}

/** A horizontal ring: centre, half-widths, turned `turn`, with `folds` ripples of amplitude `amp`. */
function hring(c: V3, rx: number, ry: number, seg: number, turn = 0, folds = 0, amp = 0, phase = 0): V3[] {
  return Array.from({ length: seg }, (_, i) => {
    const th = (TAU * i) / seg, f = 1 + amp * Math.sin(folds * th + phase)
    const x = rx * Math.cos(th) * f, y = ry * Math.sin(th) * f
    return [c[0] + x * Math.cos(turn) - y * Math.sin(turn), c[1] + x * Math.sin(turn) + y * Math.cos(turn), c[2]] as V3
  })
}

/** A deterministic hash in [-1, 1]. */
const hash = (x: number, y: number) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return (s - Math.floor(s)) * 2 - 1 }

export function build(detail: boolean): Mat[] {
  const bronze = new Part(), stone = new Part(), win = new Part()
  const S = detail ? 30 : 16 // sections round a body
  const s = detail ? 18 : 8 // round a limb
  const LR = detail ? 6 : 2 // rings along a limb

  // ── The crag: one jagged mass of fractured planes over the outline,
  // a low ramp at the back rising steeply beside the man's leg to his waist
  const NP = detail ? 56 : 24, NK = detail ? 9 : 4
  const per: XY[] = [] // the outline resampled evenly
  {
    const L = OUTLINE.map((a, i) => Math.hypot(OUTLINE[(i + 1) % OUTLINE.length][0] - a[0], OUTLINE[(i + 1) % OUTLINE.length][1] - a[1]))
    const tot = L.reduce((x, y) => x + y, 0)
    for (let k = 0; k < NP; k++) {
      let d = (tot * k) / NP, i = 0
      while (d > L[i]) { d -= L[i]; i++ }
      const a = OUTLINE[i], b = OUTLINE[(i + 1) % OUTLINE.length]
      per.push([a[0] + ((b[0] - a[0]) * d) / L[i], a[1] + ((b[1] - a[1]) * d) / L[i]])
    }
  }
  const C: XY = [0.4, -0.4]
  const ramp = (y: number) => 3.2 + 9.5 * Math.min(1, Math.max(0, (y + 22) / 25)) ** 1.2
  const crag = (x: number, y: number) => 22.5 * Math.exp(-((x + 3.4) ** 2) / 22 - ((y - 10.5) ** 2) / 40)
  const back = (x: number, y: number) => 17.5 * Math.exp(-((x - 1.0) ** 2) / 40 - ((y - 1) ** 2) / 45)
  const hAt = (x: number, y: number, edge: number) => {
    const h = Math.max(ramp(y), crag(x, y), back(x, y)) + hash(x, y) * (1.1 + 0.05 * crag(x, y))
    return Math.max(2.6, Math.min(h, 3.4 + edge * 5.5))
  }
  const grid: V3[][] = []
  for (let k = 0; k <= NK; k++) {
    const f = 1 - k / (NK + 0.6) // shrink toward the centre
    grid.push(per.map(([x, y], i) => {
      const px = C[0] + (x - C[0]) * f, py = C[1] + (y - C[1]) * f
      const edge = (1 - f) * 8 // metres in from the rim, roughly
      const jx = k > 0 ? hash(i, k) * 0.5 : 0, jy = k > 0 ? hash(k, i) * 0.5 : 0
      return [px + jx, py + jy, k === 0 ? 3.0 + hash(x, y) * 0.3 : hAt(px, py, edge)] as V3
    }))
  }
  // the rings run counter-clockwise from the rim inward, so (a, b, c) taken
  // in that order always faces out of the rock
  const faceUp = (a: V3, b: V3, c: V3) => tri(stone, a, b, c, norm(crs(sub3(b, a), sub3(c, a))))
  for (let k = 0; k < NK; k++) for (let i = 0; i < NP; i++) {
    const j = (i + 1) % NP, A = grid[k][i], B = grid[k][j], Cc = grid[k + 1][j], Dd = grid[k + 1][i]
    // split along the shorter diagonal's alternate, so the planes break irregularly
    if ((i + k) % 2) { faceUp(A, B, Cc); faceUp(A, Cc, Dd) } else { faceUp(A, B, Dd); faceUp(B, Cc, Dd) }
  }
  const top = grid[NK], tc = top.reduce((s2, q) => add3(s2, q, 1 / NP), [0, 0, 0] as V3)
  for (let i = 0; i < NP; i++) faceUp(top[i], top[(i + 1) % NP], [tc[0], tc[1], tc[2] + 1.5])
  // the plinth wall round the rim, with the museum's round windows
  for (let i = 0; i < NP; i++) {
    const a = grid[0][i], b = grid[0][(i + 1) % NP], n = norm([b[1] - a[1], -(b[0] - a[0]), 0])
    quad(stone, [a[0], a[1], 0], [b[0], b[1], 0], b, a, n)
    if (i % (detail ? 2 : 3) === 0 && Math.abs(n[0]) > 0.7) {
      const m: V3 = [(a[0] + b[0]) / 2 + n[0] * 0.06, (a[1] + b[1]) / 2 + n[1] * 0.06, 1.6]
      const u = norm(sub3(b, a)), pts: V3[] = []
      for (let q = 0; q < 8; q++) { const t = (TAU * q) / 8; pts.push(add3(add3(m, u, Math.cos(t) * 0.5), [0, 0, 1], Math.sin(t) * 0.5)) }
      face(win, pts, n)
    }
  }

  // ── The man: heroic, leaning forward, head turned up ──
  const my = (z: number) => 3.5 + (z - 21) * 0.45
  const T = (z: number, rx: number, ry: number, folds = 0, amp = 0) => hring([0, my(z), z], rx, ry, S, 0.12, folds, amp)
  loftPts(bronze, [T(15, 5.2, 4.0), T(18, 5.2, 4.0), T(21, 4.9, 3.7), T(23.5, 4.4, 3.4), T(26, 4.9, 3.8), T(28.5, 5.8, 4.3), T(31, 6.8, 4.6),
    T(33.5, 7.6, 4.4), T(35.4, 8.0, 3.9), T(36.8, 6.6, 3.2), T(37.8, 4.4, 2.9), T(38.6, 2.8, 2.6)])
  // pectorals, deltoids and the shoulder blades
  for (const sx of [-1, 1]) {
    ellipsoid(bronze, [sx * 3.0, my(31.2) + 3.1, 31.2], 3.0, 1.35, 2.0, s, [1, 0, 0], [0, 1, 0], [0, 0, 1])
    ellipsoid(bronze, [sx * 7.5, my(35.2), 35.2], 2.7, 2.7, 2.9, s)
    ellipsoid(bronze, [sx * 3.6, my(33) - 3.3, 33], 2.8, 1.4, 2.6, s)
  }
  // the neck, thick, and the head turned up
  muscle(bronze, [0, my(38), 38], [0, my(41) + 0.9, 41.4], 2.7, 2.2, 2.6, s, LR)
  const tilt = 0.38, Y3: V3 = [0, Math.cos(tilt), Math.sin(tilt)], Z3: V3 = [0, -Math.sin(tilt), Math.cos(tilt)]
  const hc: V3 = [0, my(42) + 1.3, 44.0]
  ellipsoid(bronze, hc, 2.2, 2.5, 3.0, S, [1, 0, 0], Y3, Z3)
  ellipsoid(bronze, add3(add3(hc, Y3, 1.2), Z3, -1.6), 1.65, 1.5, 1.4, s, [1, 0, 0], Y3, Z3) // jaw
  ellipsoid(bronze, add3(add3(hc, Y3, 2.4), Z3, 0.1), 0.45, 0.6, 0.9, 6, [1, 0, 0], Y3, Z3) // nose
  if (detail) loftPts(bronze, [0, 1].map((k) => hring(add3(add3(hc, Y3, -0.2), Z3, 1.2 + k * 0.7), 2.25, 2.5, 20, 0)).map((r) => r.map((q) => q)))
  // the right arm round the woman's waist; the left raised, carrying the child
  const shR: V3 = [7.8, my(35), 35], shL: V3 = [-7.8, my(35), 35]
  const elR: V3 = add3(shR, [1.6, -6.8, -5.8]), wrR: V3 = add3(elR, [-1.6, -5.6, -3.0])
  muscle(bronze, shR, elR, 2.4, 1.9, 2.75, s, LR)
  muscle(bronze, elR, wrR, 1.9, 1.2, 2.15, s, LR, 0.3)
  ellipsoid(bronze, add3(wrR, [-0.5, -0.9, -0.2]), 1.0, 1.5, 0.9, s)
  const elL: V3 = add3(shL, [-2.8, 4.2, 4.6]), wrL: V3 = add3(elL, [3.2, -0.9, 3.2])
  muscle(bronze, shL, elL, 2.5, 2.0, 3.0, s, LR)
  muscle(bronze, elL, wrL, 2.0, 1.3, 2.3, s, LR, 0.3)
  ellipsoid(bronze, add3(wrL, [0.8, 0.5, 0.4]), 1.1, 1.0, 1.4, s)
  // the cloth wrapped at his hips: a folded, flaring wrap and its hanging fold
  const W = (z: number, rx: number, ry: number, amp: number, dy = 0) => hring([0, my(z) + dy, z], rx, ry, S, 0.12, 7, amp, 0.6)
  loftPts(bronze, [W(13.6, 6.4, 5.2, 0.07, -0.6), W(16, 6.1, 4.9, 0.06, -0.3), W(19, 5.7, 4.5, 0.05), W(22, 5.25, 4.1, 0.04), W(24.2, 4.7, 3.6, 0.02)])
  sheet(bronze, [[1.6, my(22) + 4.0, 22], [2.2, my(18) + 5.0, 18.5], [2.6, my(15) + 5.6, 14.6]], [3.0, 3.6, 3.0], [1, 0.2, 0], 0.6)
  // the legs, massive, emerging from the rock: the left forward, knee bent
  const knL: V3 = [-4.0, 12.6, 13.4], anL: V3 = [-3.6, 10.6, 4.0]
  muscle(bronze, [-2.9, my(19), 19], knL, 3.5, 2.7, 3.9, s, LR)
  muscle(bronze, knL, anL, 2.6, 1.7, 2.8, s, LR, 0.35)
  const knR: V3 = [3.6, -3.4, 11.4]
  muscle(bronze, [2.9, my(19) - 0.5, 19], knR, 3.5, 2.7, 3.8, s, LR)
  muscle(bronze, knR, [3.7, -1.0, 3.5], 2.6, 1.7, 2.8, s, LR, 0.35)

  // ── The child, seated on the man's forearm, pointing forward ──
  const cp: V3 = add3(wrL, [-1.4, 0.8, 0.9])
  loftPts(bronze, [hring(cp, 1.3, 1.05, s), hring(add3(cp, [0, 0.2, 1.6]), 1.35, 1.0, s), hring(add3(cp, [0, 0.35, 3.0]), 1.5, 0.95, s), hring(add3(cp, [0, 0.4, 3.7]), 0.65, 0.6, s)], true)
  ellipsoid(bronze, add3(cp, [0, 0.6, 5.25]), 1.35, 1.45, 1.6, S, [1, 0, 0], Y3, Z3)
  for (const sx of [-0.55, 0.55]) {
    const hip = add3(cp, [sx, 0.3, 0.1]), kn = add3(cp, [sx * 1.1, 2.1, -0.3])
    muscle(bronze, hip, kn, 0.65, 0.5, 0.7, s, LR)
    muscle(bronze, kn, add3(kn, [0, 0.4, -2.4]), 0.5, 0.38, 0.55, s, LR)
  }
  const chS = add3(cp, [-0.9, 0.4, 3.0]), chE = add3(cp, [-1.9, 3.6, 4.6]), chH = add3(cp, [-2.7, 7.0, 6.1])
  muscle(bronze, chS, chE, 0.55, 0.45, 0.6, s, LR); muscle(bronze, chE, chH, 0.45, 0.32, 0.48, s, LR)
  if (detail) muscle(bronze, chH, add3(chH, [-0.25, 1.1, 0.5]), 0.28, 0.14, 0.28, 8, 2)
  muscle(bronze, add3(cp, [0.9, 0.4, 3.0]), add3(cp, [2.2, -0.4, 2.0]), 0.5, 0.38, 0.55, s, LR)

  // ── The woman: slimmer, leaning forward into the wind ──
  const wx = (z: number) => 5.0 + (z - 20.5) * 0.04, wy = (z: number) => -8.0 + (z - 20.5) * 0.4
  const WT = (z: number, rx: number, ry: number) => hring([wx(z), wy(z), z], rx, ry, S, -0.08)
  loftPts(bronze, [WT(17, 3.3, 2.5), WT(20.5, 3.6, 2.6), WT(23.5, 2.9, 2.05), WT(26.5, 3.3, 2.25), WT(29, 3.8, 2.45), WT(31.4, 4.3, 2.2), WT(32.5, 3.2, 1.8), WT(33.3, 1.55, 1.4)])
  for (const sx of [-1.6, 1.6]) ellipsoid(bronze, [wx(28.4) + sx, wy(28.4) + 2.2, 28.4], 1.35, 1.2, 1.3, s)
  muscle(bronze, [wx(33), wy(33), 33], [wx(34.6), wy(34.6) + 0.3, 34.6], 1.4, 1.25, 1.4, s, LR)
  const wh: V3 = [wx(36.3), wy(36.3) + 0.2, 36.3]
  ellipsoid(bronze, wh, 1.8, 2.1, 2.5, S, [1, 0, 0], [0, Math.cos(0.2), Math.sin(0.2)], [0, -Math.sin(0.2), Math.cos(0.2)])
  // her hair: sheets streaming back from the head, rising a little
  const hairs: [number, number, number][] = [[-0.6, 0.3, 1.0], [0.6, 0.6, 0.9], [0, 1.4, 1.1]]
  for (const [dx, dz, k] of hairs) {
    const o = add3(wh, [dx, -1.2, 0.6 + dz * 0.4])
    const line: V3[] = [o, add3(o, [dx * 0.4, -2.4 * k, 0.5 + dz * 0.5]), add3(o, [dx * 0.7, -4.6 * k, 0.8 + dz]), add3(o, [dx, -6.4 * k, 1.0 + dz * 1.4]), add3(o, [dx, -7.8 * k, 1.4 + dz * 1.6])]
    const wd = [2.0, 1.9, 1.5, 0.95, 0.2], th = [1.2, 1.05, 0.8, 0.5, 0.1]
    loftPts(bronze, line.map((c, q) => Array.from({ length: s }, (_, i) => { const a = (TAU * i) / s; return add3(c, [Math.cos(a) * wd[q], 0, Math.sin(a) * th[q]]) })), false)
  }
  // her arms: the right stretched back and down, the left round the man's back
  const wsR: V3 = [wx(31.3) + 4.2, wy(31.3), 31.3]
  muscle(bronze, wsR, [12.2, -11.6, 27.4], 1.25, 0.95, 1.3, s, LR)
  muscle(bronze, [12.2, -11.6, 27.4], [14.6, -18.4, 23.8], 0.95, 0.6, 1.0, s, LR)
  sheet(bronze, [[14.6, -18.4, 23.8], [14.9, -19.8, 23.3], [15.1, -20.8, 23.0]], [1.1, 1.0, 0.6], [0.2, 0, 1], 0.4)
  const wsL: V3 = [wx(31.3) - 4.0, wy(31.3), 31.3]
  muscle(bronze, wsL, [1.6, -0.6, 28.6], 1.2, 0.9, 1.25, s, LR)
  muscle(bronze, [1.6, -0.6, 28.6], [-1.2, 3.6, 28.6], 0.9, 0.6, 0.95, s, LR)
  // her dress: from the breast to the knees, the hem streaming back
  const D = (z: number, rx: number, ry: number, dy: number, amp: number) => hring([wx(z), wy(z) + dy, z], rx, ry, S, -0.08, 6, amp, 1.1)
  loftPts(bronze, [D(29.4, 3.95, 2.6, 0, 0.0), D(26.5, 3.45, 2.45, 0, 0.02), D(23.5, 3.15, 2.3, -0.2, 0.03), D(20.5, 3.95, 2.95, -0.6, 0.05),
    D(18, 4.6, 3.6, -1.4, 0.07), D(16, 5.1, 4.2, -2.6, 0.08), D(14.6, 5.4, 4.5, -3.8, 0.09)])
  sheet(bronze, [[wx(18) + 1.6, wy(18) - 3.4, 18.4], [7.0, -14.0, 18.6], [7.6, -16.4, 17.8], [8.0, -18.2, 16.4]], [4.4, 3.6, 2.4, 0.6], [0.15, 0, 1], 0.6)
  // her legs: the left forward and bent, the right stretched back to the ramp
  const kL: V3 = [wx(19) - 1.5, -1.8, 12.4]
  muscle(bronze, [wx(19) - 1.4, wy(19), 19], kL, 2.0, 1.4, 2.15, s, LR)
  muscle(bronze, kL, [wx(19) - 1.6, -3.6, 5.6], 1.4, 0.95, 1.5, s, LR, 0.35)
  const kR: V3 = [wx(19) + 1.5, -14.6, 12.6]
  muscle(bronze, [wx(19) + 1.4, wy(19) - 0.4, 19], kR, 2.0, 1.4, 2.15, s, LR)
  muscle(bronze, kR, [wx(19) + 1.7, -20.6, 7.6], 1.4, 0.95, 1.5, s, LR, 0.35)
  ellipsoid(bronze, [wx(19) + 1.7, -21.6, 7.0], 0.8, 1.6, 0.6, s)

  const lit = (q: V3, n: V3) => Math.max(0, Math.min(1, 0.9 - (q[2] / 60) * 0.3 - Math.max(0, n[2]) * 0.4))
  return [
    { part: bronze, material: { ...finish('renaissance-bronze', 0x675c46, 0.4), floodlight: lit } },
    { part: stone, material: { ...finish('renaissance-rock', 0x8d6155), floodlight: lit } },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main) {
  const extras = { bearing: 286, osm: 'way/1417550130', height: 52 }
  await save('dakar-african-renaissance.glb', 'African Renaissance Monument', build(false), 6500, 250_000, extras)
  await save('dakar-african-renaissance.detail.glb', 'African Renaissance Monument', build(true), 40_000, 1536 * 1024, extras)
}
