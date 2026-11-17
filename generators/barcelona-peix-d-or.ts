/**
 * El Peix d'Or (Frank Gehry's golden fish), Barcelona — original procedural
 * geometry, CC0-1.0.
 * bun generators/barcelona-peix-d-or.ts
 *
 * Map frame: +x east, +y north, z up, metres. BEARING 0 (the fish's own
 * axis is turned inside the generator). Origin = area centroid of the OSM
 * outline way/1219078280 (lng 2.196951, lat 41.386074).
 *
 * Evidence
 * - OSM way/1219078280 "El Peix d'Or": building=yes, artwork, height 35,
 *   length 56, Frank Gehry, 1992; wikidata Q28027474 (checked: "El Peix",
 *   artwork in Barcelona, 41.38608 2.19693, height 35.2). The outline is a
 *   42 m blob with a narrow spike to the north-west (the tail) and a point to
 *   the south-east (the head).
 * - Mapterhorn terrain (`terrain.ts grid 2.196951 41.386074 30 10`): 0–0.6 m
 *   under the middle and south-east (the lower level by the beach), 4–4.7 m
 *   on the plaza to the west and north. y = 0 is the low ground; the frame's
 *   legs run down to it, and the fish's top is at 35 m above it.
 * - Commons photos (all EVIDENCE):
 *   "Barcelona Gehry fish.jpg" (Till Niermann, CC BY-SA 3.0, broadside from
 *   the sea: the profile, tail up at the west end, head to the east);
 *   "Barcelona Frank Gehrys Peix.jpg" (Isiwal, CC BY-SA 3.0 AT, from the
 *   plaza on the north: the white steel frame under the body, the flat
 *   lattice skirt under the head, the legs);
 *   "El Peix d Or , Barcelona (P1170710).jpg" (Matti Blume, CC BY-SA 4.0,
 *   from the promenade, with Hotel Arts);
 *   "Aerial view of Somorrostro Beach and Port Olympic in Barcelona, Spain
 *   (51227006624).jpg" (dronepicr, CC BY 2.0, from the south-west above:
 *   the plan direction, tail to the north-west).
 *
 * Shape (estimated from the photos, scaled by the 56 m length and the 35 m
 * height): the axis is bowed about 5 m to the north-east as the outline shows.
 * The body is lofted sections with full sides, measured on the
 * broadside photo (fish 460 px long = 56 m): deepest (19 m, back 31 m,
 * belly 12 m) about a third back from the head, the back arching down to
 * a rounder, lower head (6 m deep at the nose) ringed by a flared lip; to
 * the rear the body narrows to a slim tail stalk (5–6 m deep, 3–5 m wide)
 * that sweeps up into a separate tall, thin, pointed tail fin whose tip is
 * the highest point at 35 m. Gold pulled to a bronze-gold, as the photos
 * read. The plan axis runs from the
 * tail at the north-west spike of the outline to the blunt head at the east
 * (ESE, bearing about 114°): broadside from the south and the north, as
 * both broadside photos are. The gold skin is a
 * perforated steel mesh; it reads as a gold surface at map distance, so it
 * is drawn solid (`fish-gold`, floodlit at night as the real one is).
 *
 * Frame (real members, drawn about 0.9 m thick so they read at phone size):
 * eight splayed legs to the ground, an elliptical ring at the belly with
 * spokes up to the skin (the flat lattice skirt under the head is the ring
 * with radial members), and diagonal braces between the legs. The real
 * frame is denser; member count and positions are estimated.
 *
 * Doubts: the exact twist of the tail and the side-to-side curve of the body
 * are simplified; the plaza buildings under the fish are separate OSM
 * buildings and are not part of the model.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const BEARING = 0
const ANCHOR = { lng: 2.196951, lat: 41.386074 }
const skin = new Part(), frame = new Part()

// Axis: tail tip T to head H in plan, bowed to the north-east.
const T: [number, number] = [-20, 14], HD: [number, number] = [20.5, -5]
const AX = [HD[0] - T[0], HD[1] - T[1]], AL = Math.hypot(AX[0], AX[1])
const U: [number, number] = [AX[0] / AL, AX[1] / AL] // along, toward the head
const L: [number, number] = [-U[1], U[0]] // to the left of the head's travel: north-east
const BOW = 5
const axis = (s: number): [number, number] => {
  const b = BOW * Math.sin(Math.PI * s)
  return [T[0] + AX[0] * s + L[0] * b, T[1] + AX[1] * s + L[1] * b]
}
// s (0 tail tip, 1 nose): top, belly -> centre and half height; half width
const PROFILE: [number, number, number, number][] = [
  [0, 34.60, 0.40, 0.4],
  [0.04, 31.25, 2.75, 0.6],
  [0.08, 28.00, 4.50, 0.8],
  [0.12, 26.00, 4.00, 1.0],
  [0.17, 24.15, 2.65, 1.6],
  [0.21, 23.40, 3.00, 2.4],
  [0.28, 22.30, 5.30, 4.5],
  [0.38, 21.75, 7.75, 7.5],
  [0.52, 21.50, 9.10, 9.8],
  [0.66, 21.50, 9.50, 10.6],
  [0.8, 21.00, 8.60, 10],
  [0.9, 20.30, 6.90, 8.5],
  [0.97, 19.80, 4.80, 6.4],
  [1.0, 19.60, 3.00, 4.4],
]
const SEG = 16
const section = (s: number, zc: number, hz: number, w: number): V3[] => {
  const [cx, cy] = axis(s)
  const out: V3[] = []
  for (let i = 0; i < SEG; i++) {
    const a = (i / SEG) * Math.PI * 2
    // counter-clockwise seen from the tail end (looking along +U)
    // fuller sides (superellipse) and a flatter belly than back
    const c = Math.cos(a), sn = Math.sin(a)
    const l = -Math.sign(c) * Math.pow(Math.abs(c), 0.75) * w
    const z = zc + Math.sign(sn) * Math.pow(Math.abs(sn), 0.8) * hz
    out.push([cx + L[0] * l, cy + L[1] * l, z])
  }
  return out
}
/** Loft with smooth normals; rings run tail to head. */
function smooth(p: Part, rings: V3[][]) {
  const n = rings[0].length, R = rings.length
  const acc: V3[][] = rings.map((r) => r.map(() => [0, 0, 0] as V3))
  const fn = (a: V3, b: V3, c: V3): V3 => {
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  }
  const quads: [number, number, number, number][] = []
  for (let k = 0; k < R - 1; k++) for (let i = 0; i < n; i++) quads.push([k, i, k + 1, (i + 1) % n])
  for (const [k, i, k1, j] of quads) {
    const m = fn(rings[k][i], rings[k1][i], rings[k1][j])
    const l = Math.hypot(...m) || 1
    for (const [kk, ii] of [[k, i], [k, j], [k1, i], [k1, j]]) { const t = acc[kk][ii]; t[0] += m[0] / l; t[1] += m[1] / l; t[2] += m[2] / l }
  }
  const N = acc.map((r) => r.map((m) => { const l = Math.hypot(...m) || 1; return [m[0] / l, m[1] / l, m[2] / l] as V3 }))
  for (const [k, i, k1, j] of quads) {
    const a = rings[k][i], b = rings[k1][i], c = rings[k1][j], d = rings[k][j]
    p.tri(a, b, c, undefined, undefined, undefined, [N[k][i], N[k1][i], N[k1][j]])
    p.tri(a, c, d, undefined, undefined, undefined, [N[k][i], N[k1][j], N[k][j]])
  }
}
// Densify the profile for a smooth body.
const rings: V3[][] = []
for (let k = 0; k < PROFILE.length - 1; k++) {
  const [s0, z0, h0, w0] = PROFILE[k], [s1, z1, h1, w1] = PROFILE[k + 1]
  const steps = 3
  for (let t = 0; t < steps; t++) {
    const f = t / steps, g = (1 - Math.cos(Math.PI * f)) / 2
    rings.push(section(s0 + (s1 - s0) * f, z0 + (z1 - z0) * g, h0 + (h1 - h0) * g, w0 + (w1 - w0) * g))
  }
}
rings.push(section(...PROFILE[PROFILE.length - 1]))
smooth(skin, rings)
// close the two ends
{
  const a = rings[0], b = rings[rings.length - 1]
  const ca = a.reduce((m, p) => [m[0] + p[0] / SEG, m[1] + p[1] / SEG, m[2] + p[2] / SEG], [0, 0, 0]) as V3
  const cb = b.reduce((m, p) => [m[0] + p[0] / SEG, m[1] + p[1] / SEG, m[2] + p[2] / SEG], [0, 0, 0]) as V3
  for (let i = 0; i < SEG; i++) {
    const j = (i + 1) % SEG
    skin.tri(ca, a[i], a[j])
    skin.tri(cb, b[j], b[i])
  }
}

// The flared lip round the head: a short band standing 1.1 m proud of the skin.
{
  const at = (t: number, grow: number) => {
    let k = 0
    while (k < PROFILE.length - 2 && PROFILE[k + 1][0] < t) k++
    const [s0, z0, h0, w0] = PROFILE[k], [s1, z1, h1, w1] = PROFILE[k + 1]
    const f = (t - s0) / (s1 - s0)
    return section(t, z0 + (z1 - z0) * f, h0 + (h1 - h0) * f + grow, w0 + (w1 - w0) * f + grow)
  }
  smooth(skin, [at(0.93, 0.1), at(0.95, 1.1), at(0.975, 1.1), at(0.985, 0.2)])
}

// --- The steel frame. ---
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const nrm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
function member(a: V3, b: V3, w = 0.9) {
  const t = nrm([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
  const ref: V3 = Math.abs(t[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const s = nrm(crs(t, ref)), n = nrm(crs(s, t))
  const ring = (o: V3) => [add(add(o, mul(s, -w / 2)), mul(n, -w / 2)), add(add(o, mul(s, w / 2)), mul(n, -w / 2)), add(add(o, mul(s, w / 2)), mul(n, w / 2)), add(add(o, mul(s, -w / 2)), mul(n, w / 2))]
  const A = ring(a), B = ring(b)
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    const m = sideNormal(k, s, n)
    for (const [p, q, r] of [[A[k], A[l], B[l]], [A[k], B[l], B[k]]] as V3[][]) frame.tri(p, q, r, undefined, undefined, undefined, [m, m, m])
  }
  frame.tri(A[0], A[2], A[1], undefined, undefined, undefined, [mul(t, -1), mul(t, -1), mul(t, -1)])
  frame.tri(A[0], A[3], A[2], undefined, undefined, undefined, [mul(t, -1), mul(t, -1), mul(t, -1)])
  frame.tri(B[0], B[1], B[2], undefined, undefined, undefined, [t, t, t])
  frame.tri(B[0], B[2], B[3], undefined, undefined, undefined, [t, t, t])
}
function sideNormal(k: number, s: V3, n: V3): V3 {
  // corners: 0 (-s,-n), 1 (+s,-n), 2 (+s,+n), 3 (-s,+n)
  return [mul(n, -1), s, n, mul(s, -1)][k]
}

// Belly ring: an ellipse under the front half of the body, at z 13.5.
const RING_Z = 12
const ringC = axis(0.68)
const ringPts: V3[] = []
const RN = 12
for (let i = 0; i < RN; i++) {
  const a = (i / RN) * Math.PI * 2
  const u = Math.cos(a) * 15, l = Math.sin(a) * 11
  ringPts.push([ringC[0] + U[0] * u + L[0] * l, ringC[1] + U[1] * u + L[1] * l, RING_Z])
}
for (let i = 0; i < RN; i++) member(ringPts[i], ringPts[(i + 1) % RN], 1.0)
// spokes from the ring up to the belly
const bellyAt = (s: number, l: number): V3 => {
  // the skin's lower surface near lateral offset l, at axis position s
  let k = 0
  while (k < PROFILE.length - 2 && PROFILE[k + 1][0] < s) k++
  const [s0, z0, h0, w0] = PROFILE[k], [s1, z1, h1, w1] = PROFILE[k + 1]
  const f = (s - s0) / (s1 - s0)
  const zc = z0 + (z1 - z0) * f, hz = h0 + (h1 - h0) * f, w = w0 + (w1 - w0) * f
  const ll = Math.max(-0.85, Math.min(0.85, l / w))
  const [cx, cy] = axis(s)
  return [cx + L[0] * l * 0.9, cy + L[1] * l * 0.9, zc - hz * Math.sqrt(1 - ll * ll) + 0.6]
}
for (let i = 0; i < RN; i += 2) {
  const a = (i / RN) * Math.PI * 2
  const s = 0.68 + (Math.cos(a) * 7) / AL, l = Math.sin(a) * 5
  member(ringPts[i], bellyAt(s, l), 0.8)
}
// the flat lattice skirt: radial members across the ring under the head half
for (let i = 0; i < RN; i++) {
  const a = (i / RN) * Math.PI * 2
  if (Math.cos(a) < -0.2) continue
  member([ringC[0] + U[0] * 4, ringC[1] + U[1] * 4, RING_Z], ringPts[i], 0.7)
}
// a keel member along the belly from the ring to the tail
member(bellyAt(0.5, 0), bellyAt(0.3, 0), 0.8)
member([ringC[0] - U[0] * 15, ringC[1] - U[1] * 15, RING_Z], bellyAt(0.4, 0), 0.8)
// legs: eight, splayed, from the ground to the ring
const legs = [0, 2, 3, 5, 6, 8, 9, 11]
const feet: V3[] = []
for (const i of legs) {
  const p = ringPts[i]
  const f: V3 = [ringC[0] + (p[0] - ringC[0]) * 0.38, ringC[1] + (p[1] - ringC[1]) * 0.38, 0]
  feet.push(f)
  member(f, p, 1.1)
}
// diagonal braces between neighbouring legs
for (let k = 0; k < legs.length; k++) {
  const f = feet[k], p = ringPts[legs[(k + 1) % legs.length]]
  member(f, p, 0.7)
}
// tail support: a raked strut from the plaza to the peduncle
{
  const [tx, ty] = axis(0.3)
  member([tx - U[0] * 4, ty - U[1] * 4, 0], bellyAt(0.3, 0), 1.0)
  member([ringPts[6][0], ringPts[6][1], RING_Z], bellyAt(0.3, 0), 0.8)
}

const parts = [
  { part: skin, material: { ...finish('fish-gold', 0xa8865a, 0.55), floodlight: (_p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : 0.85) } },
  { part: frame, material: finish('fish-steel', 0xe6e4de) },
]
// Member ends at the ground reach half a section below it: flatten them onto y = 0.
for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) part.pos[i] = Math.max(0, part.pos[i])
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('El Peix d\'Or', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 35,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/1219078280'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/barcelona-peix-d-or.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
