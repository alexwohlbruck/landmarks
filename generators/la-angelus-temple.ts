/**
 * Angelus Temple (1923, Brook Hawkins), Echo Park, Los Angeles —
 * procedural, CC0-1.0.
 * bun generators/la-angelus-temple.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The anchor is the
 * area centroid of the two OSM ways the model replaces (way/60586413, the
 * auditorium, and way/560486417, the block behind it), on the lowest ground
 * under them: Glendale Boulevard in front, 118.5 m (USGS 3DEP; the ground
 * rises 4-5 m to the east, where the rear walls run down into it).
 *
 * What makes it Angelus Temple: the great curved front facing west over
 * Glendale Boulevard to Echo Park Lake, a giant order of columns with tall
 * round-headed windows between them, a set-back upper storey ringed with
 * small windows, and over it all the wide, shallow white dome with a cross;
 * the plain block behind with its small square tower; all of it white.
 *
 * Sources:
 * - Plan: OSM way/60586413 and way/560486417 (one LARIAC 2020 footprint,
 *   482723850187), OSM way/886564591 (the dome, about 32 m across, centred
 *   2 m east and 5 m north of the OSM node the grids were taken about),
 *   USGS NAIP orthophoto.
 * - Heights: LA County 2020 lidar surface model on a 1.5 m grid: the
 *   colonnade storey 12 m, set back about 3.5 m to the upper storey's
 *   parapet at 18.5 m; the dome springing at 18.5-19 m about 15 m in radius,
 *   its crown 25.5 m and the cross to 28 m; the block behind 25.5 m on its
 *   west half and 22 m on its east; the small tower 29 m. OSM tags 28 m.
 * - Photos (Wikimedia Commons): "AngelusTemple" (Bruce Boehner, CC BY-SA
 *   3.0; the front from the south-west), "Angelus Temple" (CC BY-SA 3.0; the
 *   front square on, with the tower behind), the Tichnor Brothers postcard
 *   "Angelus Temple, Los Angeles, Calif" (public domain; the whole curve,
 *   the dome).
 * - Estimated: the bay count (sixteen across the curve, about 5.5 m), the
 *   window and column sizes, the colonnade's cornice at 9 m with a plain
 *   band over it to the terrace (photo proportions on the lidar heights),
 *   the tower's openings, the canopy.
 * - Left out: the capitals, lettering and the marquee's sign, flags,
 *   lamps, the rooftop plant.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const wall = new Part(), trim = new Part(), dome = new Part(), win = new Part(), roof = new Part(), door = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const TAU = Math.PI * 2
function quad(p: Part, P: V3[], hint: V3, ns?: V3[]) {
  const f = add(cross(sub(P[1], P[0]), sub(P[2], P[0])), cross(sub(P[2], P[0]), sub(P[3], P[0])))
  const ord = dot(f, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const n = ns?.map(unit)
  const t = (a: number, b: number, c: number) => {
    const A = P[ord[a]], B = P[ord[b]], C = P[ord[c]]
    if (Math.hypot(...cross(sub(B, A), sub(C, A))) < 1e-9) return
    p.tri(A, B, C, undefined, undefined, undefined, n && [n[ord[a]], n[ord[b]], n[ord[c]]])
  }
  t(0, 1, 2)
  t(0, 2, 3)
}
function tri(p: Part, A: V3, B: V3, C: V3, hint: V3) {
  if (dot(cross(sub(B, A), sub(C, A)), hint) >= 0) p.tri(A, B, C)
  else p.tri(A, C, B)
}
type XY = [number, number]
// OSM-node frame to the anchor's
const OX = 11.38, OY = -3.02
const L = ([x, y]: XY): XY => [x - OX, y - OY]

/** A prism over a simple polygon (any winding), ear-clipped top, optional lip. */
function prism(poly: XY[], z0: number, z1: number, side: Part, top: Part | null, lip = 0) {
  const area = poly.reduce((s, p, i) => s + p[0] * poly[(i + 1) % poly.length][1] - poly[(i + 1) % poly.length][0] * p[1], 0) / 2
  const P = area > 0 ? poly : [...poly].reverse() // counter-clockwise
  const n = P.length
  for (let i = 0; i < n; i++) {
    const a = P[i], b = P[(i + 1) % n]
    const o: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
    quad(side, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1 - lip], [a[0], a[1], z1 - lip]], o)
    if (lip > 0) {
      // a bevelled lip leaning inward
      const ou = unit(o)
      const ai: V3 = [a[0] - ou[0] * lip, a[1] - ou[1] * lip, z1], bi: V3 = [b[0] - ou[0] * lip, b[1] - ou[1] * lip, z1]
      quad(trim, [[a[0], a[1], z1 - lip], [b[0], b[1], z1 - lip], bi, ai], add(ou, [0, 0, 1]))
    }
  }
  if (!top) return
  // ear clipping
  const idx = P.map((_, i) => i)
  const cr = (o: XY, a: XY, b: XY) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) >= 0 && cr(b, c, p) >= 0 && cr(c, a, p) >= 0
  let guard = 0
  while (idx.length > 3 && guard++ < 5000) {
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = P[i0], b = P[i1], c = P[i2]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(P[j], a, b, c))) continue
      top.tri([a[0], a[1], z1], [b[0], b[1], z1], [c[0], c[1], z1])
      idx.splice(k, 1)
      break
    }
  }
  if (idx.length === 3) top.tri([P[idx[0]][0], P[idx[0]][1], z1], [P[idx[1]][0], P[idx[1]][1], z1], [P[idx[2]][0], P[idx[2]][1], z1])
}

/** A surface of revolution, smooth-shaded. */
function revolve(p: Part, cx: number, cy: number, prof: [number, number][], segs: number) {
  const pt = (a: number, r: number, z: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
  for (let j = 0; j < prof.length - 1; j++) {
    const [r0, z0] = prof[j], [r1, z1] = prof[j + 1]
    for (let i = 0; i < segs; i++) {
      const a0 = (i / segs) * TAU, a1 = ((i + 1) / segs) * TAU
      const nn = (a: number): V3 => unit([Math.cos(a) * (z1 - z0), Math.sin(a) * (z1 - z0), -(r1 - r0)])
      quad(p, [pt(a0, r0, z0), pt(a1, r0, z0), pt(a1, r1, z1), pt(a0, r1, z1)], add(nn(a0), nn(a1)), [nn(a0), nn(a1), nn(a1), nn(a0)])
    }
  }
}

// ---------------------------------------------------------------------------
// The curved front: the OSM arc from the south tip round to the north end,
// resampled to sixteen equal bays.
const ARC: XY[] = ([
  [1.9, -37.4], [-1.7, -34.0], [-4.8, -30.3], [-7.8, -26.1], [-10.3, -22.1], [-12.3, -18.2], [-14.2, -13.9], [-15.7, -9.7],
  [-17.4, -6.4], [-19.4, -2.0], [-19.6, 2.0], [-19.0, 5.4], [-18.7, 9.8], [-18.5, 14.9], [-17.8, 20.3], [-16.6, 25.9], [-15.2, 30.8], [-14.2, 33.2],
] as XY[]).map(L)
function resample(pts: XY[], n: number): XY[] {
  const d = [0]
  for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const out: XY[] = []
  for (let k = 0; k <= n; k++) {
    const s = (d[d.length - 1] * k) / n
    let i = 1
    while (i < d.length - 1 && d[i] < s) i++
    const t = (s - d[i - 1]) / (d[i] - d[i - 1] || 1)
    out.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t])
  }
  return out
}
const NB = 16
const FRONT = resample(ARC, NB)
// outward normals at each vertex (away from the building, west-ish)
const normalAt = (pts: XY[], i: number): XY => {
  const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]
  const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty)
  return [-ty / l, tx / l] // left of the south-to-north direction: west
}
const SET = 3.5
const UPPER: XY[] = FRONT.map((p, i) => { const n = normalAt(FRONT, i); return [p[0] - n[0] * SET, p[1] - n[1] * SET] })
const NE: XY = L([24.7, 12.7]), SE: XY = L([11.3, -18.2])

// Colonnade storey over the whole auditorium plan, to 12 m.
const COL = 12, UP = 18.5
prism([...FRONT, NE, SE], 0, COL, wall, roof, 0.45)
// the upper storey, set back from the curve, to the parapet
prism([...UPPER, NE, SE], COL - 0.5, UP, wall, roof, 0.4)

// Bays on the curve: a giant column at each bay line, a tall round-headed
// window and a door below it in each bay; above the setback, one panel a
// bay for the two rows of small balcony windows.
for (let i = 0; i < NB; i++) {
  const a = FRONT[i], b = FRONT[i + 1]
  const tx = b[0] - a[0], ty = b[1] - a[1], len = Math.hypot(tx, ty)
  const ux = tx / len, uy = ty / len
  const nx = -uy, ny = ux // outward (west-ish)
  const at = (s: number, z: number, off = 0.06): V3 => [a[0] + ux * s + nx * off, a[1] + uy * s + ny * off, z]
  const o: V3 = [nx, ny, 0]
  const m = len / 2
  // the tall arched window, a true semicircle on top
  const w = 2.6, z0 = 4.6, z1 = 8.5, r = w / 2, zs = z1 - r
  quad(win, [at(m - r, z0), at(m + r, z0), at(m + r, zs), at(m - r, zs)], o)
  for (let k = 0; k < 8; k++) {
    const t0 = (k / 8) * Math.PI, t1 = ((k + 1) / 8) * Math.PI
    tri(win, at(m, zs), at(m + r * Math.cos(t0), zs + r * Math.sin(t0)), at(m + r * Math.cos(t1), zs + r * Math.sin(t1)), o)
  }
  // the ground-floor doors and windows
  const isDoor = i >= 6 && i <= 9
  quad(isDoor ? door : win, [at(m - 1.3, 0.4), at(m + 1.3, 0.4), at(m + 1.3, 3.7), at(m - 1.3, 3.7)], o)
  // upper storey: one panel a bay over its two rows
  const A = UPPER[i], B = UPPER[i + 1]
  const ltx = B[0] - A[0], lty = B[1] - A[1], ll = Math.hypot(ltx, lty)
  const lux = ltx / ll, luy = lty / ll
  const up = (s: number, z: number): V3 => [A[0] + lux * s - luy * 0.06, A[1] + luy * s + lux * 0.06, z]
  quad(win, [up(ll / 2 - 1.0, 13.6), up(ll / 2 + 1.0, 13.6), up(ll / 2 + 1.0, 16.8), up(ll / 2 - 1.0, 16.8)], [-luy, lux, 0])
}
// giant columns at the bay lines, on the curve
for (let i = 0; i <= NB; i++) {
  const p = FRONT[i], n = normalAt(FRONT, i)
  const cx = p[0] + n[0] * 0.55, cy = p[1] + n[1] * 0.55
  revolve(trim, cx, cy, [[0.85, 0], [0.85, 1.2], [0.62, 1.2], [0.58, 8.6], [0.85, 9.1]], 8)
}
// cornice band over the columns, standing proud of the curve
for (let i = 0; i < NB; i++) {
  const a = FRONT[i], b = FRONT[i + 1], na = normalAt(FRONT, i), nb = normalAt(FRONT, i + 1)
  const P = (p: XY, n: XY, off: number, z: number): V3 => [p[0] + n[0] * off, p[1] + n[1] * off, z]
  const o: V3 = [(na[0] + nb[0]) / 2, (na[1] + nb[1]) / 2, 0]
  quad(trim, [P(a, na, 1.0, 9.1), P(b, nb, 1.0, 9.1), P(b, nb, 1.0, 9.9), P(a, na, 1.0, 9.9)], o)
  quad(trim, [P(a, na, 1.0, 9.9), P(b, nb, 1.0, 9.9), P(b, nb, 0, 9.9), P(a, na, 0, 9.9)], [0, 0, 1])
  quad(trim, [P(a, na, 1.0, 9.1), P(b, nb, 1.0, 9.1), P(b, nb, 0, 9.1), P(a, na, 0, 9.1)], [0, 0, -1])
}
// the entrance canopy in the middle of the curve
{
  const p = FRONT[8], n = normalAt(FRONT, 8)
  const tx = -n[1], ty = n[0]
  const c = (s: number, d: number, z: number): V3 => [p[0] + tx * s + n[0] * d, p[1] + ty * s + n[1] * d, z]
  const W = 6.5, D = 3.0, z0 = 4.0, z1 = 4.7
  quad(trim, [c(-W, D, z0), c(W, D, z0), c(W, D, z1), c(-W, D, z1)], [n[0], n[1], 0])
  quad(trim, [c(-W, 0, z1), c(W, 0, z1), c(W, D, z1), c(-W, D, z1)], [0, 0, 1])
  quad(trim, [c(-W, 0, z0), c(W, 0, z0), c(W, D, z0), c(-W, D, z0)], [0, 0, -1])
  quad(trim, [c(-W, 0, z0), c(-W, D, z0), c(-W, D, z1), c(-W, 0, z1)], [-tx, -ty, 0])
  quad(trim, [c(W, 0, z0), c(W, D, z0), c(W, D, z1), c(W, 0, z1)], [tx, ty, 0])
}

// ---------------------------------------------------------------------------
// The dome: about 30 m across, shallow (a spherical cap rising 7 m), on a
// low curb; a small lantern and the cross.
const [DX, DY] = L([2.2, 5.0])
{
  const R0 = 15.2, H = 7.0, Z0 = 19.0
  revolve(trim, DX, DY, [[R0 + 0.5, UP - 0.2], [R0 + 0.5, Z0], [R0, Z0]], 24)
  const Rs = (R0 * R0 + H * H) / (2 * H)
  const prof: [number, number][] = []
  for (let k = 0; k <= 6; k++) {
    const r = R0 * (1 - k / 6)
    prof.push([Math.max(r, 0.9), Z0 + Math.sqrt(Rs * Rs - r * r) - (Rs - H)])
  }
  revolve(dome, DX, DY, prof, 24)
  const top = prof[prof.length - 1][1]
  revolve(trim, DX, DY, [[0.9, top - 0.1], [0.9, top + 0.8], [0.6, top + 1.0], [0.05, top + 1.1]], 8)
  // the cross
  const cz = top + 1.0
  const bar = (x0: number, x1: number, z0: number, z1: number) => {
    const t = 0.2
    quad(trim, [[DX + x0, DY - t, z0], [DX + x1, DY - t, z0], [DX + x1, DY - t, z1], [DX + x0, DY - t, z1]], [0, -1, 0])
    quad(trim, [[DX + x0, DY + t, z0], [DX + x1, DY + t, z0], [DX + x1, DY + t, z1], [DX + x0, DY + t, z1]], [0, 1, 0])
    quad(trim, [[DX + x0, DY - t, z1], [DX + x1, DY - t, z1], [DX + x1, DY + t, z1], [DX + x0, DY + t, z1]], [0, 0, 1])
    quad(trim, [[DX + x0, DY - t, z0], [DX + x0, DY + t, z0], [DX + x0, DY + t, z1], [DX + x0, DY - t, z1]], [-1, 0, 0])
    quad(trim, [[DX + x1, DY - t, z0], [DX + x1, DY + t, z0], [DX + x1, DY + t, z1], [DX + x1, DY - t, z1]], [1, 0, 0])
  }
  bar(-0.2, 0.2, cz, 28.3)
  bar(-0.8, 0.8, 26.9, 27.3)
}

// ---------------------------------------------------------------------------
// The block behind (way/560486417): 25.5 m on its west half, 22 m east.
{
  const rear: XY[] = ([[24.7, 12.7], [38.2, 6.3], [38.6, 7.1], [41.8, 5.5], [41.3, 4.6], [52.4, -1.2], [48.1, -9.6], [49.5, -10.3], [42.8, -23.6], [41.8, -23.1], [37.6, -31.6], [24.4, -25.1], [24.0, -26.0], [21.0, -24.5], [21.5, -23.4], [11.3, -18.2]] as XY[]).map(L)
  prism(rear, 0, 22, wall, roof, 0.4)
  const west: XY[] = ([[24.7, 12.7], [33.5, 8.5], [33.5, -28.6], [24.4, -25.1], [24.0, -26.0], [21.0, -24.5], [21.5, -23.4], [11.3, -18.2]] as XY[]).map(L)
  prism(west, 21.5, 25.5, wall, roof, 0.4)
  // windows on its long south and north-east faces, one a bay over two storeys
  const face = (p: XY, q: XY, zs: [number, number][], pitch = 4.5) => {
    const [a, b] = [L(p), L(q)]
    const tx = b[0] - a[0], ty = b[1] - a[1], len = Math.hypot(tx, ty)
    const n = Math.max(1, Math.round(len / pitch))
    const o: V3 = [ty / len, -tx / len, 0]
    for (let i = 0; i < n; i++) {
      const s = (i + 0.5) / n
      const c = (d: number, z: number): V3 => [a[0] + tx * s + (tx / len) * d + o[0] * 0.06, a[1] + ty * s + (ty / len) * d + o[1] * 0.06, z]
      for (const [z0, z1] of zs) quad(win, [c(-1.1, z0), c(1.1, z0), c(1.1, z1), c(-1.1, z1)], o)
    }
  }
  const rows: [number, number][] = [[6.5, 12.5], [14.5, 20.5]]
  face([37.6, -31.6], [42.8, -23.6], rows)
  face([24.4, -25.1], [37.6, -31.6], rows)
  face([42.8, -23.6], [52.4, -1.2], rows)
  face([52.4, -1.2], [24.7, 12.7], rows)
}
// The small square tower at the junction, with an arched opening a face.
{
  const [tx, ty] = L([14.5, -17.5])
  const h = 2.6, zt = 29
  const sq = (r: number, z: number): V3[] => [[tx - r, ty - r, z], [tx + r, ty - r, z], [tx + r, ty + r, z], [tx - r, ty + r, z]]
  wall.loft([sq(h, 18), sq(h, zt - 0.5)])
  trim.loft([sq(h, zt - 0.5), sq(h + 0.3, zt - 0.2), sq(h + 0.3, zt)])
  trim.cap(sq(h + 0.3, zt), true)
  for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as XY[]) {
    const at = (s: number, z: number): V3 => [tx + nx * (h + 0.06) - ny * s, ty + ny * (h + 0.06) + nx * s, z]
    const r = 0.9, zs = zt - 2.2
    quad(win, [at(-r, zt - 5.5), at(r, zt - 5.5), at(r, zs), at(-r, zs)], [nx, ny, 0])
    for (let k = 0; k < 6; k++) {
      const t0 = (k / 6) * Math.PI, t1 = ((k + 1) / 6) * Math.PI
      tri(win, at(0, zs), at(r * Math.cos(t0), zs + r * Math.sin(t0)), at(r * Math.cos(t1), zs + r * Math.sin(t1)), [nx, ny, 0])
    }
  }
}

// ---------------------------------------------------------------------------
// Palette: the temple is painted white all over; walls `stone`, columns,
// cornices and the cross `trim`, the dome a pale grey-white (its sheet
// roofing reads cooler than the walls in daylight), flat roofs a light
// grey as in the orthophoto (the darker `roof` drowned the white temple
// from above), windows `window`, the front doors `entrance`.
const parts = [
  { part: wall, material: PALETTE.stone },
  { part: trim, material: PALETTE.trim },
  { part: dome, material: finish('angelus-dome', 0xe6e4df) },
  { part: win, material: PALETTE.window },
  { part: roof, material: finish('angelus-roof', 0xc6c9cb) },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Angelus Temple', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 0, osm: 'way/60586413',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const outPath = new URL('../models/la-angelus-temple.glb', import.meta.url).pathname
await Bun.write(outPath, glb)
console.log(`${outPath}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
