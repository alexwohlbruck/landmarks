/**
 * Volunteer Park Conservatory (1912, after Lord & Burnham's catalogue
 * designs), Seattle: procedural, CC0-1.0.
 * bun generators/sea-volunteer-park-conservatory.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the long axis runs
 * within a degree of east-west). The origin is the area centroid of OSM
 * way/40790435; y = 0 is the lowest ground the building touches, on its
 * north side (133.3 m NAVD88); the entrance side to the south stands
 * 1.4 m higher.
 *
 * Form: a Victorian glasshouse in a line: the central Palm House, a
 * curvilinear hipped glass roof over low glass walls with a glazed lantern
 * on top and an entrance porch under a semicircular fanlight gable on the
 * south; a lower glass wing to each side with curved eaves and a ridge,
 * and at each end a gabled pavilion turned north-south with a small
 * gabled porch. Glass with bold white ribs, white eave bands and a pale
 * concrete plinth.
 *
 * Measured (USGS 3DEP WA_KingCo_1_2021, 0.5 m surface model, heights
 * above y = 0): the Palm House's eaves 5.4 m, lantern sides 7.5 m, top
 * 10.5 m; the wings' ridges 6.3 m and eaves about 4.4 m at 3.5 m either
 * side of the ridge; the end pavilions' ridges 6.1-6.4 m; the porch's
 * fanlight 6.7 m; the north annexes 5.0 and 2.6 m. Plan from OSM, which
 * matches the lidar's edges to half a metre.
 * Published: built 1912 (Wikipedia, "Volunteer Park Conservatory").
 * From photos: the curvilinear profiles, the lantern, the fanlight gable,
 * the rib spacing (drawn bolder and wider apart, about one rib per 2.6 m),
 * the white lattice band at the eaves (drawn as a plain band), the plinth.
 * Estimated: the curve radii; the north annexes' form (no photos).
 * Left out: glazing bars, the lattice work, vents, signage, the Seward
 * statue and the gardens.
 *
 * Photos: /tmp/city/sea/work/sea-volunteer-park-conservatory/credits.txt.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE } from './palette'

type XY = [number, number]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const glass = new Part(), white = new Part(), plinth = new Part(), flat = new Part(), door = new Part()

function poly(p: Part, P: V3[], n: V3) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const Q = dot(f, n) >= 0 ? P : [...P].reverse()
  for (let i = 1; i < Q.length - 1; i++) p.tri(Q[0], Q[i], Q[i + 1])
}
function boxP(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  p.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1])
}

/**
 * The half-section of a curvilinear glasshouse roof: from the wall foot up
 * the wall, round a quarter curve, then straight to the ridge. Points are
 * (inset from the wall, z).
 */
function section(wall: number, R: number, ridgeInset: number, ridge: number): XY[] {
  const s: XY[] = [[0, 0], [0, wall]]
  for (let k = 1; k <= 5; k++) {
    const a = (k / 5) * (Math.PI / 2) * 0.82
    s.push([R * (1 - Math.cos(a)), wall + R * Math.sin(a)])
  }
  s.push([ridgeInset, ridge])
  return s
}

/**
 * A glasshouse block along an axis: `along` is the long direction (unit),
 * `c` the centre, `L` the half length, `H` the half width. Glass surfaces,
 * white ribs every `pitch` m across the roof and walls, a white eave band,
 * a plinth, and gabled glass ends with white edges.
 */
function wing(c: XY, along: XY, L: number, H: number, sec: XY[], pitch = 2.6, ends = [true, true]) {
  const across: XY = [-along[1], along[0]]
  const P = (u: number, side: number, q: XY, out = 0): V3 => {
    const v = side * (H - q[0] + out)
    return [c[0] + along[0] * u + across[0] * v, c[1] + along[1] * u + across[1] * v, q[1] + (out ? out * 0.6 : 0) * 0]
  }
  const out = (side: number, i: number): V3 => {
    // outward normal of the section segment i..i+1 on this side
    const a = sec[i], b = sec[i + 1]
    const dy = -(b[0] - a[0]), dz = b[1] - a[1]
    const l = Math.hypot(dy, dz) || 1
    const n = [dz / l, -dy / l] // (outward across, up)
    return [across[0] * side * n[0], across[1] * side * n[0], n[1]]
  }
  for (const side of [-1, 1]) {
    for (let i = 0; i < sec.length - 1; i++) {
      const n = out(side, i)
      const mat = i === 0 ? glass : glass
      poly(mat, [P(-L, side, sec[i]), P(L, side, sec[i]), P(L, side, sec[i + 1]), P(-L, side, sec[i + 1])], n)
    }
    // plinth and eave band on the wall
    const off = 0.06
    const w = (z0: number, z1: number, part: Part) => {
      const a: XY = [-off, z0], b: XY = [-off, z1]
      poly(part, [P(-L, side, a), P(L, side, a), P(L, side, b), P(-L, side, b)], [across[0] * side, across[1] * side, 0])
    }
    w(0, 0.9, plinth)
    w(sec[1][1] - 0.6, sec[1][1], white)
    // ribs: strips following the section, slightly proud
    const n = Math.max(2, Math.round((2 * L) / pitch))
    for (let k = 0; k <= n; k++) {
      const u = -L + (2 * L * k) / n
      const half = k === 0 || k === n ? 0.35 : 0.22
      for (let i = 1; i < sec.length - 1; i++) {
        const nn = out(side, i)
        const lift = (q: XY): V3 => { const p = P(0, side, q); return [p[0] + nn[0] * 0.07, p[1] + nn[1] * 0.07, p[2] + nn[2] * 0.07] }
        const a = lift(sec[i]), b = lift(sec[i + 1])
        const A = (p: V3, du: number): V3 => [p[0] + along[0] * (u + du), p[1] + along[1] * (u + du), p[2]]
        poly(white, [A(a, -half), A(a, half), A(b, half), A(b, -half)], nn)
      }
      // the wall mullion
      const lo: XY = [-0.07, 0.9], hi: XY = [-0.07, sec[1][1] - 0.6]
      const ca = P(u, side, lo), cb = P(u, side, hi)
      const m = (p: V3, d: number): V3 => [p[0] + along[0] * d, p[1] + along[1] * d, p[2]]
      poly(white, [m(ca, -half), m(ca, half), m(cb, half), m(cb, -half)], [across[0] * side, across[1] * side, 0])
    }
    // ridge cap
    const r = sec[sec.length - 1]
    if (side > 0) poly(white, [P(-L, 1, [r[0] - 0.25, r[1] + 0.05]), P(L, 1, [r[0] - 0.25, r[1] + 0.05]), P(L, -1, [r[0] - 0.25, r[1] + 0.05]), P(-L, -1, [r[0] - 0.25, r[1] + 0.05])], [0, 0, 1])
  }
  // ridge: close the top between the two sides (flat strip at ridge height)
  const r = sec[sec.length - 1]
  poly(glass, [P(-L, 1, r), P(L, 1, r), P(L, -1, r), P(-L, -1, r)], [0, 0, 1])
  // gable ends: glass, white edge strip around the outline, plinth
  for (const [u, s, show] of [[-L, -1, ends[0]], [L, 1, ends[1]]] as [number, number, boolean][]) {
    const ring: V3[] = [...sec.map((q) => P(u, -1, q)), ...[...sec].reverse().map((q) => P(u, 1, q))]
    const nn: V3 = [along[0] * s, along[1] * s, 0]
    // fan from the ground middle
    const mid: V3 = [c[0] + along[0] * u, c[1] + along[1] * u, 0]
    for (let i = 0; i < ring.length - 1; i++) poly(glass, [mid, ring[i], ring[i + 1]], nn)
    if (!show) continue
    const o: V3 = [nn[0] * 0.07, nn[1] * 0.07, 0]
    for (let i = 1; i < ring.length - 2; i++) {
      const a = ring[i], b = ring[i + 1]
      const d = sub(b, a), l = Math.hypot(...d)
      if (l < 1e-6) continue // the two halves meet at the ridge
      // a band 0.35 m wide just inside the outline
      const t: V3 = [d[0] / l, d[1] / l, d[2] / l]
      const k = cross(nn, t) // points inward across the face
      const w = 0.35
      poly(white, [[a[0] + o[0], a[1] + o[1], a[2]], [b[0] + o[0], b[1] + o[1], b[2]],
        [b[0] + o[0] + k[0] * w, b[1] + o[1] + k[1] * w, b[2] + k[2] * w], [a[0] + o[0] + k[0] * w, a[1] + o[1] + k[1] * w, a[2] + k[2] * w]], nn)
    }
    // the gable's middle mullion and plinth
    const top = sec[sec.length - 1][1]
    poly(white, [[mid[0] + o[0] - across[0] * 0.25, mid[1] + o[1] - across[1] * 0.25, 0.9], [mid[0] + o[0] + across[0] * 0.25, mid[1] + o[1] + across[1] * 0.25, 0.9],
      [mid[0] + o[0] + across[0] * 0.25, mid[1] + o[1] + across[1] * 0.25, top], [mid[0] + o[0] - across[0] * 0.25, mid[1] + o[1] - across[1] * 0.25, top]], nn)
    poly(plinth, [[ring[0][0] + o[0], ring[0][1] + o[1], 0], [ring[ring.length - 1][0] + o[0], ring[ring.length - 1][1] + o[1], 0],
      [ring[ring.length - 1][0] + o[0], ring[ring.length - 1][1] + o[1], 0.9], [ring[0][0] + o[0], ring[0][1] + o[1], 0.9]], nn)
  }
}

/**
 * A curvilinear hipped block (the Palm House and its lantern): rectangular
 * rings shrinking up the profile `sec` (inset, z), with ribs on every face.
 */
function hipped(cx: number, cy: number, hx: number, hy: number, sec: XY[], pitch: number, capZ: number) {
  const ring = (q: XY): V3[] => {
    const ax = hx - q[0], ay = hy - q[0]
    return [[cx - ax, cy - ay, q[1]], [cx + ax, cy - ay, q[1]], [cx + ax, cy + ay, q[1]], [cx - ax, cy + ay, q[1]]]
  }
  const faceN = (f: number, i: number): V3 => {
    const a = sec[i], b = sec[i + 1]
    const dz = b[1] - a[1], di = b[0] - a[0], l = Math.hypot(dz, di) || 1
    const h = dz / l, v = di / l
    return ([[0, -h, v], [h, 0, v], [0, h, v], [-h, 0, v]] as V3[])[f]
  }
  for (let i = 0; i < sec.length - 1; i++) {
    const r0 = ring(sec[i]), r1 = ring(sec[i + 1])
    for (let f = 0; f < 4; f++) {
      const g = (f + 1) % 4
      poly(glass, [r0[f], r0[g], r1[g], r1[f]], faceN(f, i))
    }
  }
  const top = ring(sec[sec.length - 1])
  poly(glass, top, [0, 0, 1])
  // ribs: on each face, strips at fractions along it, following the rings
  for (let f = 0; f < 4; f++) {
    const g = (f + 1) % 4
    const len0 = Math.hypot(ring(sec[0])[g][0] - ring(sec[0])[f][0], ring(sec[0])[g][1] - ring(sec[0])[f][1])
    const n = Math.max(2, Math.round(len0 / pitch))
    for (let k = 0; k <= n; k++) {
      const t = k / n
      const half = k === 0 || k === n ? 0.3 : 0.2
      for (let i = 0; i < sec.length - 1; i++) {
        if (i === 0 && (k === 0 || k === n)) {/* corner posts below */}
        const r0 = ring(sec[i]), r1 = ring(sec[i + 1])
        const nn = faceN(f, i)
        const at = (r: V3[], dt: number): V3 => {
          const tt = Math.min(1, Math.max(0, t + dt))
          const p: V3 = [r[f][0] + (r[g][0] - r[f][0]) * tt, r[f][1] + (r[g][1] - r[f][1]) * tt, r[f][2]]
          return [p[0] + nn[0] * 0.07, p[1] + nn[1] * 0.07, p[2] + nn[2] * 0.07]
        }
        const L0 = Math.hypot(r0[g][0] - r0[f][0], r0[g][1] - r0[f][1]) || 1
        const L1 = Math.hypot(r1[g][0] - r1[f][0], r1[g][1] - r1[f][1]) || 1
        if (L1 < 0.5) continue
        poly(white, [at(r0, -half / L0), at(r0, half / L0), at(r1, half / L1), at(r1, -half / L1)], nn)
      }
    }
  }
  void capZ
}

// ------------------------------------------------------------ the plan ---
const SOUTH = 1.4 // the south side's ground above y = 0
// Palm House: walls to 3.6 m, a quarter-round roof to 7.4 m, the lantern.
const PH = { cx: 0.3, cy: 0.3, hx: 7.9, hy: 4.9 }
{
  const sec: XY[] = [[0, 0], [0, 3.6]]
  for (let k = 1; k <= 6; k++) { const a = (k / 6) * (Math.PI / 2); sec.push([2.7 * (1 - Math.cos(a)), 3.6 + 3.8 * Math.sin(a)]) }
  hipped(PH.cx, PH.cy, PH.hx, PH.hy, sec, 2.6, 7.4)
  // its plinth and the white eave band, on all four sides
  const r = (o: number, z0: number, z1: number, p: Part) => {
    const x0 = PH.cx - PH.hx - o, x1 = PH.cx + PH.hx + o, y0 = PH.cy - PH.hy - o, y1 = PH.cy + PH.hy + o
    const R: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    for (let i = 0; i < 4; i++) { const a = R[i], b = R[(i + 1) % 4]; p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]) }
  }
  r(0.06, 0, SOUTH + 0.9, plinth)
  r(0.08, 2.9, 3.7, white)
  // the lantern: vertical glazed sides from the roof's top, a rounded cap
  const lsec: XY[] = [[0, 7.2], [0, 8.8]]
  for (let k = 1; k <= 4; k++) { const a = (k / 4) * (Math.PI / 2); lsec.push([1.6 * (1 - Math.cos(a)), 8.8 + 1.7 * Math.sin(a)]) }
  hipped(PH.cx, PH.cy, 4.4, 2.3, lsec, 2.2, 10.5)
  const lb = (z0: number, z1: number) => {
    const x0 = PH.cx - 4.48, x1 = PH.cx + 4.48, y0 = PH.cy - 2.38, y1 = PH.cy + 2.38
    const R: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    for (let i = 0; i < 4; i++) { const a = R[i], b = R[(i + 1) % 4]; white.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]) }
  }
  lb(7.2, 7.6); lb(8.5, 8.9)
}
// The entrance porch on the south, under a semicircular fanlight gable.
{
  const x0 = -2.4, x1 = 2.9, y0 = -6.2, y1 = PH.cy - PH.hy + 0.5, xc = (x0 + x1) / 2, R = (x1 - x0) / 2, zs = 4.5
  boxP(white, x0, y0, x1, y1, 0, zs)
  // the barrel roof back into the Palm House roof
  const N = 10
  for (let k = 0; k < N; k++) {
    const a0 = (k / N) * Math.PI, a1 = ((k + 1) / N) * Math.PI
    const p = (a: number, y: number): V3 => [xc + R * Math.cos(a), y, zs + R * Math.sin(a)]
    poly(glass, [p(a0, y0), p(a1, y0), p(a1, y1 + 1.5), p(a0, y1 + 1.5)], [Math.cos((a0 + a1) / 2), 0, Math.sin((a0 + a1) / 2)])
  }
  // the fanlight: a white half-disc with a glass half-disc inside
  const yf = y0 - 0.05
  for (let k = 0; k < N; k++) {
    const a0 = (k / N) * Math.PI, a1 = ((k + 1) / N) * Math.PI
    const p = (a: number, r: number, y: number): V3 => [xc + r * Math.cos(a), y, zs + r * Math.sin(a)]
    poly(white, [p(a0, R, yf), p(a1, R, yf), p(a1, R - 0.45, yf), p(a0, R - 0.45, yf)], [0, -1, 0])
    poly(glass, [[xc, yf, zs], p(a0, R - 0.45, yf), p(a1, R - 0.45, yf)], [0, -1, 0])
  }
  poly(white, [[x0, yf, zs - 0.4], [x1, yf, zs - 0.4], [x1, yf, zs], [x0, yf, zs]], [0, -1, 0])
  // glazed front and the doors
  poly(glass, [[x0 + 0.4, y0 - 0.06, SOUTH + 0.9], [x1 - 0.4, y0 - 0.06, SOUTH + 0.9], [x1 - 0.4, y0 - 0.06, zs - 0.6], [x0 + 0.4, y0 - 0.06, zs - 0.6]], [0, -1, 0])
  poly(door, [[xc - 0.9, y0 - 0.1, SOUTH], [xc + 0.9, y0 - 0.1, SOUTH], [xc + 0.9, y0 - 0.1, SOUTH + 2.5], [xc - 0.9, y0 - 0.1, SOUTH + 2.5]], [0, -1, 0])
  poly(plinth, [[x0 - 0.06, y0 - 0.07, 0], [x1 + 0.06, y0 - 0.07, 0], [x1 + 0.06, y0 - 0.07, SOUTH], [x0 - 0.06, y0 - 0.07, SOUTH]], [0, -1, 0])
}
// The wings: walls 3 m, curved eaves, ridges at 6.3 m.
const WSEC = section(3.0, 2.0, 3.6, 6.3)
wing([-15.25, -0.2], [1, 0], 7.65 + 0.1, 3.6, WSEC, 2.6, [false, false])
wing([15.8, 0.45], [1, 0], 7.6 + 0.1, 3.75, WSEC, 2.6, [false, false])
// The end pavilions, gabled north-south, with their porches.
const PSEC = section(3.0, 2.0, 3.8, 6.3)
wing([-26.65, -3.1], [0, 1], 6.3, 3.8, PSEC, 2.6)
wing([27.05, -2.05], [0, 1], 6.45, 3.65, PSEC, 2.6)
const QSEC = section(2.4, 0.9, 1.8, 4.2)
wing([-26.9, -10.15], [0, 1], 0.8, 1.8, QSEC, 1.6, [true, false])
wing([26.3, -9.3], [0, 1], 0.8, 1.0, section(2.4, 0.5, 1.0, 3.8), 1.6, [true, false])
// North annexes: low glass blocks with flat roofs.
{
  const ann = (x0: number, y0: number, x1: number, y1: number, z: number) => {
    const R: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    for (let i = 0; i < 4; i++) { const a = R[i], b = R[(i + 1) % 4]; glass.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], z], [a[0], a[1], z]) }
    flat.quad([x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z])
    for (let i = 0; i < 4; i++) { const a = R[i], b = R[(i + 1) % 4]; plinth.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], 0.8], [a[0], a[1], 0.8]) }
  }
  ann(-4.3, PH.cy + PH.hy - 0.5, 5.4, 9.4, 5.0)
  ann(-10.15, 3.4, -4.35, 10.6, 2.6)
}

// ---------------------------------------------------------------- output ---
const parts = [
  { part: glass, material: PALETTE.glass },
  { part: white, material: PALETTE.trim },
  { part: plinth, material: PALETTE.stone },
  { part: flat, material: PALETTE.roof },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Volunteer Park Conservatory', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 10.5,
})
await Bun.write(new URL('../models/sea-volunteer-park-conservatory.glb', import.meta.url), glb)
console.log(`sea-volunteer-park-conservatory.glb: ${triangles} triangles, ${glb.length} bytes`)
