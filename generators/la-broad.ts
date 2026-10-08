/**
 * The Broad (2015, Diller Scofidio + Renfro), Los Angeles — original
 * procedural geometry, CC0-1.0.
 * bun generators/la-broad.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the outline's centroid
 * on the lowest ground under it (the 2nd St / Hope St corner). Placed at
 * bearing 37.2°, so the street grid is square to this frame: +x faces Grand
 * Avenue, +y faces 2nd Street, −x Hope Street.
 *
 * What makes it the Broad: a near-cubic white box wrapped in the "veil", a
 * honeycomb of white panels with slanted lozenge openings; the veil lifted
 * at the 2nd & Grand corner like a raised curtain over the glass lobby (and a
 * little at the south Grand corner); and the "oculus", a dimple pushed into
 * the Grand Avenue face with a small glazed eye at its bottom.
 *
 * Sources:
 * - Plan: OSM way/427532197, a 60.0 × 58.0 m rectangle whose sides run at
 *   bearings 37.2° / 127.3°.
 * - Height: LA County LARIAC 2020 lidar footprint 2014092961390000, roof
 *   elevation 144.2 m. USGS 3DEP bare earth: 117.4 m along Grand Avenue and
 *   the south side, falling to ≈ 115.4 m at the 2nd St / Hope St corner, the
 *   lowest point. So the roof stands 28.8 m over y = 0 (26.8 m over Grand).
 * - Veil pattern, lifts and oculus: photos (Wikimedia Commons) — "Nighttime
 *   view of the Broad in LA, corner" (Dllu, CC BY-SA 4.0, from the 2nd &
 *   Grand corner: Grand face with the oculus on the left, 2nd St face on the
 *   right); "Los Angeles, California (September 8, 2022) - 076" (Another
 *   Believer, CC BY-SA 4.0, Grand face from the north-east); "Broad Museum
 *   LA" (Bahooka, CC BY-SA 4.0, 2nd St face from Disney Hall's corner); "The
 *   Broad (Los Angeles) July 2022" and "The Broad, Los Angeles in July 2023"
 *   (Benoît Prieur, CC0, a plain face and the stepped roof edge); "The Broad
 *   Museum" (Eric Garcetti, CC BY-SA 4.0, oculus close-up); "The Broad - Grand
 *   Avenue" (Dale Cruse, CC BY 4.0, the lifted corner's soffit and glass
 *   lobby). USGS NAIP orthophoto for the roof's diagonal skylight pattern.
 * - Estimated from those photos: the lifted corner's height (≈ 0.3 of the
 *   wall, 8.5 m) and ramps (36 m along Grand, 26 m along 2nd St); the small
 *   south-corner lift (4 m over 12 m, seen on the Grand face only; mirrored
 *   onto the south face, which no photo shows); the oculus (centre 30 % along
 *   the Grand face from the south, 11 m up, 7.5 m dimple, 6.8 × 3.8 m glass).
 * - The veil has about 22 × 13 openings per face in reality; here 11 × 7,
 *   each a slanted lozenge, so the pattern reads at map scale without
 *   turning into a fine grid. The slant direction (rising to the right as
 *   seen from outside) follows the Grand face in the corner photo; the other
 *   faces follow the same rule.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const veil = new Part(), slot = new Part(), lobby = new Part()
const roofSlot = new Part() // the roof's louvres: pale, they are lit from above

const BEARING = 37.2
const HU = 30.0, HV = 29.0 // half sizes along x (Grand ↔ Hope) and y (2nd ↔ south)
const TOP = 28.8, LIP = 0.5
const PROUD = 0.05

// ---------- the lifted corners ----------
// Bottom of the veil at a point of the perimeter, as the lift above ground.
// The big lift is at the 2nd & Grand corner (+x, +y); a small one at the
// south Grand corner (+x, −y).
const CORNER_NE: XY = [HU, HV], CORNER_SE: XY = [HU, -HV]
function liftAt(p: XY): number {
  const ramp = (c: XY, h: number, along: (p: XY) => number, len: number) => {
    const d = along(p)
    return d < len ? h * (1 - d / len) : 0
  }
  let z = 0
  // along the Grand face (x = HU) and the 2nd St face (y = HV)
  if (Math.abs(p[0] - HU) < 1e-6) z = Math.max(z, ramp(CORNER_NE, 8.5, (q) => HV - q[1], 36))
  if (Math.abs(p[1] - HV) < 1e-6) z = Math.max(z, ramp(CORNER_NE, 8.5, (q) => HU - q[0], 26))
  if (Math.abs(p[0] - HU) < 1e-6) z = Math.max(z, ramp(CORNER_SE, 4, (q) => q[1] + HV, 12))
  if (Math.abs(p[1] + HV) < 1e-6) z = Math.max(z, ramp(CORNER_SE, 4, (q) => HU - q[0], 10))
  return z
}

/** Ground over y = 0 (3DEP): flat at 2 m except a fall to the 2nd/Hope corner. */
function groundAt(p: XY) {
  const t = Math.min(1, Math.max(0, (p[1] + 5) / 34)) * Math.min(1, Math.max(0, (15 - p[0]) / 44))
  return 2.0 * (1 - t)
}

// ---------- faces ----------
// Each face runs counter-clockwise (seen from above) from corner a to b, so
// its outward normal is (dy, −dx). Local coordinates: s along the face from
// a, z up.
type Face = { a: XY; b: XY; name: string }
const FACES: Face[] = [
  { a: [-HU, -HV], b: [HU, -HV], name: 'south' },
  { a: [HU, -HV], b: [HU, HV], name: 'grand' },
  { a: [HU, HV], b: [-HU, HV], name: 'second' },
  { a: [-HU, HV], b: [-HU, -HV], name: 'hope' },
]

const INSET = 2.6 // the glass lobby stands this far behind the veil

const OCULUS = { s: 0.3 * 2 * HV, z: 11, r: 7.5, eyeA: 3.4, eyeB: 1.9, depth: 2.4 }

function faceFrame(f: Face) {
  const L = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1])
  const t: XY = [(f.b[0] - f.a[0]) / L, (f.b[1] - f.a[1]) / L]
  const n: XY = [t[1], -t[0]]
  const P = (s: number, z: number, out = 0): V3 => [f.a[0] + t[0] * s + n[0] * out, f.a[1] + t[1] * s + n[1] * out, z]
  const lift = (s: number) => liftAt([f.a[0] + t[0] * s, f.a[1] + t[1] * s])
  return { L, t, n, P, lift }
}

/** Breakpoints where a face's bottom edge changes slope. */
function breaks(f: Face, L: number): number[] {
  const out = new Set<number>([0, L])
  const s = (d: number) => Math.max(0, Math.min(L, d))
  if (f.name === 'grand') [2 * HV - 36, 12].forEach((d) => out.add(s(d)))
  if (f.name === 'second') out.add(s(26))
  if (f.name === 'south') out.add(s(L - 10))
  return [...out].sort((x, y) => x - y)
}

const facePlan = FACES.map((f) => {
  const fr = faceFrame(f)
  const xs = breaks(f, fr.L)
  if (f.name === 'grand') {
    // the oculus' square hole
    const h = OCULUS.r + 1
    xs.push(OCULUS.s - h, OCULUS.s + h)
    xs.sort((x, y) => x - y)
  }
  return { f, fr, xs }
})

for (const { f, fr, xs } of facePlan) {
  const { P, lift } = fr
  const top = TOP - LIP
  const hole = f.name === 'grand' ? { s0: OCULUS.s - OCULUS.r - 1, s1: OCULUS.s + OCULUS.r + 1, z0: OCULUS.z - OCULUS.r - 1, z1: OCULUS.z + OCULUS.r + 1 } : null
  for (let i = 0; i < xs.length - 1; i++) {
    const s0 = xs[i], s1 = xs[i + 1]
    if (s1 - s0 < 1e-6) continue
    const b0 = lift(s0), b1 = lift(s1)
    if (hole && s0 >= hole.s0 - 1e-6 && s1 <= hole.s1 + 1e-6) {
      veil.quad(P(s0, b0), P(s1, b1), P(s1, hole.z0), P(s0, hole.z0))
      veil.quad(P(s0, hole.z1), P(s1, hole.z1), P(s1, top), P(s0, top))
    } else veil.quad(P(s0, b0), P(s1, b1), P(s1, top), P(s0, top))
    // under a lifted stretch: the soffit back to the glass lobby, and the glass
    if (b0 > 0.01 || b1 > 0.01) {
      veil.quad(P(s1, b1), P(s0, b0), P(s0, b0, -INSET), P(s1, b1, -INSET))
      // the glass stops where it meets the next face's glass behind a corner
      const lo = lift(0) > 0 ? INSET : 0, hi = lift(fr.L) > 0 ? fr.L - INSET : fr.L
      const g0 = Math.max(s0, lo), g1 = Math.min(s1, hi)
      if (g1 > g0) lobby.quad(P(g0, 0, -INSET), P(g1, 0, -INSET), P(g1, lift(g1), -INSET), P(g0, lift(g0), -INSET))
    }
  }
  // the top lip: a 45° bevel round the roof
  const L = fr.L
  veil.quad(P(0, top), P(L, top), P(L - LIP, TOP, -LIP), P(LIP, TOP, -LIP))

  // ---------- the veil's openings ----------
  // Slanted lozenges on a staggered lattice: 11 across, 7 rows. A lozenge
  // is a hexagon with pointed ends, its long axis rising 24° to the right.
  const COLS = 11, ROWS = 7, z0 = 1.6, z1 = top - 1.1
  const ds = L / COLS, dz = (z1 - z0) / ROWS
  const LEN = ds * 1.22, THK = dz * 0.42, ANG = (26 * Math.PI) / 180
  const ax: XY = [Math.cos(ANG), Math.sin(ANG)], ay: XY = [-Math.sin(ANG), Math.cos(ANG)]
  for (let r = 0; r < ROWS; r++) {
    for (let c = -1; c <= COLS; c++) {
      const sc = (c + 0.5 + (r % 2 ? 0.5 : 0)) * ds, zc = z0 + (r + 0.5) * dz
      // the lozenge's outline in (s, z)
      const hl = LEN / 2, ht = THK / 2, tip = hl * 0.45
      const loc: XY[] = [[-hl, 0], [-tip, -ht], [tip, -ht], [hl, 0], [tip, ht], [-tip, ht]]
      const pts = loc.map(([a, b]): XY => [sc + a * ax[0] + b * ay[0], zc + a * ax[1] + b * ay[1]])
      // keep only whole lozenges, clear of the edges, the lifted bottom, the oculus
      const ok = pts.every(([s, z]) => s > 0.9 && s < L - 0.9 && z < top - 0.6 && z > lift(s) + 0.9 && z > groundAt([f.a[0] + fr.t[0] * s, f.a[1] + fr.t[1] * s]) + 0.4)
      if (!ok) continue
      if (hole && pts.some(([s, z]) => s > hole.s0 - 0.4 && s < hole.s1 + 0.4 && z > hole.z0 - 0.4 && z < hole.z1 + 0.4)) continue
      const v = pts.map(([s, z]) => P(s, z, PROUD))
      for (let k = 1; k < v.length - 1; k++) slot.tri(v[0], v[k], v[k + 1])
    }
  }

  // ---------- the oculus ----------
  if (hole) {
    const N = 16
    const sq: XY[] = [], circ: XY[] = [], eye: XY[] = []
    // the square hole's boundary, sampled at the same angles as the circle
    for (let k = 0; k < N; k++) {
      const a = (k / N) * 2 * Math.PI + Math.PI / N
      const c = Math.cos(a), sn = Math.sin(a), m = Math.max(Math.abs(c), Math.abs(sn))
      sq.push([OCULUS.s + (c / m) * (OCULUS.r + 1), OCULUS.z + (sn / m) * (OCULUS.r + 1)])
      circ.push([OCULUS.s + c * OCULUS.r, OCULUS.z + sn * OCULUS.r])
      eye.push([OCULUS.s + c * OCULUS.eyeA, OCULUS.z + sn * OCULUS.eyeB])
    }
    // The square's corners are not on the sampled ring, so fill them in.
    for (let k = 0; k < N; k++) {
      const j = (k + 1) % N
      veil.quad(P(sq[k][0], sq[k][1]), P(sq[j][0], sq[j][1]), P(circ[j][0], circ[j][1]), P(circ[k][0], circ[k][1]))
    }
    const corners: XY[] = [[hole.s1, hole.z1], [hole.s0, hole.z1], [hole.s0, hole.z0], [hole.s1, hole.z0]]
    for (let q = 0; q < 4; q++) {
      const k = q * 4 + 1, j = q * 4 + 2 // the two samples either side of corner q
      const c = corners[q]
      veil.tri(P(sq[k][0], sq[k][1]), P(c[0], c[1]), P(sq[j][0], sq[j][1]))
    }
    // the dimple: a smooth funnel from the rim down to the eye
    const rimN = (k: number): V3 => [fr.n[0], fr.n[1], 0]
    for (let k = 0; k < N; k++) {
      const j = (k + 1) % N
      const a = P(circ[k][0], circ[k][1]), b = P(circ[j][0], circ[j][1])
      const c = P(eye[j][0], eye[j][1], -OCULUS.depth), d = P(eye[k][0], eye[k][1], -OCULUS.depth)
      // normals tilt toward the eye, so the bowl shades round
      const tilt = (pt: XY, w: number): V3 => {
        const dx = OCULUS.s - pt[0], dz = OCULUS.z - pt[1], l = Math.hypot(dx, dz) || 1
        return [fr.n[0] + fr.t[0] * (dx / l) * w, fr.n[1] + fr.t[1] * (dx / l) * w, (dz / l) * w]
      }
      void rimN
      const na = tilt(circ[k], 0.35), nb = tilt(circ[j], 0.35), nc = tilt(eye[j], 0.9), nd = tilt(eye[k], 0.9)
      veil.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
      veil.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
    }
    const e = eye.map(([s, z]) => P(s, z, -OCULUS.depth))
    for (let k = 1; k < N - 1; k++) lobby.tri(e[0], e[k], e[k + 1])
  }
}

// ---------- the roof ----------
// The veil folds over the roof edge; the roof itself is covered in diagonal
// skylight louvres (NAIP), drawn as pale grey bands.
{
  const r = [[-HU + LIP, -HV + LIP], [HU - LIP, -HV + LIP], [HU - LIP, HV - LIP], [-HU + LIP, HV - LIP]] as XY[]
  veil.quad([r[0][0], r[0][1], TOP], [r[1][0], r[1][1], TOP], [r[2][0], r[2][1], TOP], [r[3][0], r[3][1], TOP])
  const COLS = 6, ROWS = 9, ANG = (-40 * Math.PI) / 180
  const du = (2 * HU - 6) / COLS, dv = (2 * HV - 6) / ROWS
  const ax: XY = [Math.cos(ANG), Math.sin(ANG)], ay: XY = [-Math.sin(ANG), Math.cos(ANG)]
  for (let c = 0; c < COLS; c++) for (let rr = 0; rr < ROWS; rr++) {
    const cx = -HU + 3 + (c + 0.5) * du, cy = -HV + 3 + (rr + 0.5) * dv
    const hl = du * 0.42, ht = dv * 0.16
    const loc: XY[] = [[-hl, -ht], [hl, -ht], [hl, ht], [-hl, ht]]
    const v = loc.map(([a, b]): V3 => [cx + a * ax[0] + b * ay[0], cy + a * ax[1] + b * ay[1], TOP + PROUD])
    roofSlot.quad(v[0], v[1], v[2], v[3])
  }
}

// ---------- write ----------
const parts = [
  { part: veil, material: finish('broad-veil', 0xf2efe9) },
  { part: slot, material: finish('broad-opening', 0x878e95) },
  { part: lobby, material: PALETTE.window },
  { part: roofSlot, material: finish('broad-louvre', 0xc9cdd0) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('The Broad', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, height: TOP,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/427532197'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/la-broad.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
