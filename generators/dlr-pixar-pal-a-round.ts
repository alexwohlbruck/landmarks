/**
 * Pixar Pal-A-Round (the Sun Wheel of 2001, Mickey's Fun Wheel 2009–18),
 * Pixar Pier, Disney California Adventure — procedural, CC0-1.0, no textures.
 * bun generators/dlr-pixar-pal-a-round.ts
 *
 * Map frame: x along the wheel's plane (+x towards 130°, the south-east end),
 * y through it (+y towards 40°, Paradise Bay), z up, metres; origin on the
 * ground under the axle. Placed at bearing 40°, so the Mickey face on +y looks
 * out over the bay, as the real one does.
 *
 * An eccentric wheel modelled on Coney Island's Wonder Wheel, and built the
 * same way as generators/wonder-wheel.ts: two parallel faces, each a
 * rim band, an inner ring and spokes, about 3 m apart; 8 fixed gondolas on the
 * rim and 16 that slide on serpentine tracks between the faces; A-frame legs
 * either side. In front of the hub on the bay side stands the Mickey head on a
 * gold sunburst; on the park side, a plain sunburst round the hub.
 *
 * Evidence
 * - OSM (measured): way/123138989 (attraction=eccentric_wheel, height=49),
 *   drawn as a thin 45.2 m × 3.2 m strip: the wheel's plane runs 130°/310°
 *   and it is about 3 m thick. The anchor is that strip's centre. Paradise
 *   Bay (relation/4308879) lies to the north-east, which fixes the Mickey side.
 *   OSM maps the wheel as an attraction, not a building, so it replaces
 *   nothing; the small World of Color towers round its foot (way/107897107,
 *   way/107897088, way/107897121) and way/174425337 stay drawn.
 * - Published (Wikipedia, "Pixar Pal-A-Round"): 24 gondolas, 16 sliding and 8
 *   fixed; Mickey's face on the side facing Paradise Bay; light blue colour
 *   scheme since 2018. Height 150 ft (46 m) there, 49 m (160 ft) in OSM; the
 *   model stands 48.3 m to the top gondola's roof.
 * - Photos (Wikimedia Commons), for the proportions of face, rays and legs,
 *   scaled off the 44.6 m rim:
 *     "View of Incredicoaster and Pixar Pal-A-Round (Disney California Adventure Park) July 2023.JPG",
 *       Benoît Prieur, CC0 — bay side, nearly square on
 *     "Incredicoaster & Pixar Pal-A-Round (Disney) July 2023.JPG", Benoît Prieur, CC0 — bay side, oblique
 *     "Pixar Pal-A-Round 2019.jpg", Jeremy Thompson, CC BY 2.0 — park side: sunburst, legs, rim, tracks
 *     "Pixar Pal-A-Round 1 2023-06-03.jpeg", FASTILY, CC BY-SA 4.0 — legs and bracing from the queue
 *     "Pixar Pal-A-Round 2 2023-06-03.jpeg", FASTILY, CC BY-SA 4.0 — gondola between the two faces
 *     "Mickey's Fun Wheel (28726693631).jpg", Theme Park Tourist, CC BY 2.0 — bay side, 2016 colours
 *     "Mickey's Fun Wheel (7842244604).jpg", daryl_mitchell, CC BY-SA 2.0 — bay side, legs under the face
 *
 * Estimated: the axle height (25.7 m, set so the bottom fixed gondola clears
 * the platform), the face's stand-off from the wheel (about 3 m; the oblique
 * photo shows it well proud), the leg feet (±11 m along the plane, ±7 m out
 * of it). Simplified: each spoke truss is one beam, the rim truss one band,
 * the gondolas' Pixar artwork a gold band. Mickey's face is drawn with flat
 * shapes (head, ears, face mask, eyes, nose, mouth, tongue), as STYLE.md
 * allows for a famous sign: it is what people recognise the wheel by.
 *
 * It turns (experimental; see "Animation" in STYLE.md), like the Wonder
 * Wheel: the wheel is a node at the axle and each gondola a child node that
 * turns back to hang plumb; sliding gondolas also move along their tracks.
 * Mickey's head, the sunbursts, legs and axle are fixed, as on the real ride,
 * where the face stays upright while the wheel turns behind it. At t = 0 the
 * model is the static one.
 */
import { Part, axisAngle, cross, sub, writeGlb, type ChannelSpec, type MaterialSpec, type NodeSpec, type Quat, type V3 } from './mesh'
import { finish } from './palette'

const TAU = Math.PI * 2
const H = 25.7                // axle height
const R_RIM = 21.95           // rim band centre line: 44.6 m across its outer edge
const R_INNER = 9.4           // inner ring
const FACE = 1.3              // each face's distance from the mid-plane
const FOOT_X = 9.5            // leg feet along the plane
const FOOT_Y = 7              // leg feet out of the plane
const APEX_Y = 3.3            // where each side's legs meet, in front of the sunburst
const BURST_Y = 2.3           // sunburst plates
const HEAD_Y = 4.4            // Mickey's head plate (back face)

// Colours from the 2023 daylight photos, muted per STYLE.md: the light blue
// (teal) rim and tracks of the 2018 scheme, the dark navy-charcoal spokes and
// legs, the gold sunburst, Mickey's pale face and red mouth.
const TEAL = finish('pal-teal', 0x5fa9b5)
const DARK = finish('pal-charcoal', 0x4a4f57)
const GOLD = finish('pal-gold', 0xe2b85e)
const FACE_C = finish('pal-face', 0xf4e2cf)
const RED = finish('pal-red', 0xc4473f)
const M = (s: { name: string; color: number; roughness?: number }, doubleSided = false): MaterialSpec => ({ ...s, doubleSided })
const MT = M(TEAL), MD = M(DARK), MG = M(GOLD), MF = M(FACE_C), MR = M(RED)

const rimPart = new Part()      // teal: rims, inner rings, tracks (turning)
const spokePart = new Part()    // charcoal spokes (turning)
const dark = new Part()         // charcoal: legs, axle, head, eyes, nose, mouth
const gold = new Part()         // sunbursts
const face = new Part()         // Mickey's face mask
const red = new Part()          // tongue
const brace = new Part()        // teal leg braces (fixed)

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A point on the wheel at radius r, angle t (0 = +x, π/2 = up), face y — relative to the axle. */
const wheel = (r: number, t: number, y: number): V3 => [r * Math.cos(t), y, r * Math.sin(t)]

/** A triangle whose winding follows its normals, whatever order it came in. */
function tri(p: Part, v: V3[], n: V3[]) {
  const f = cross(sub(v[1], v[0]), sub(v[2], v[0]))
  if (dot(f, add(add(n[0], n[1]), n[2])) >= 0) p.tri(v[0], v[1], v[2], undefined, undefined, undefined, n)
  else p.tri(v[0], v[2], v[1], undefined, undefined, undefined, [n[0], n[2], n[1]])
}
function fan(p: Part, ring: V3[], n: V3) {
  for (let i = 1; i < ring.length - 1; i++) tri(p, [ring[0], ring[i], ring[i + 1]], [n, n, n])
}

type Profile = [number, number][]
/** A chamfered rectangle, counter-clockwise: half-widths a (along N), b (along B). */
const rect = (a: number, b: number, c = 0): Profile => c
  ? [[-a + c, -b], [a - c, -b], [a, -b + c], [a, b - c], [a - c, b], [-a + c, b], [-a, b - c], [-a, -b + c]]
  : [[-a, -b], [a, -b], [a, b], [-a, b]]
const circle = (r: number, n: number): Profile => Array.from({ length: n }, (_, i) => [r * Math.cos(i / n * TAU), r * Math.sin(i / n * TAU)])

/** Sweep a cross-section along a path; flat across the section, smooth along it. */
function sweep(p: Part, path: V3[], frames: { N: V3; B: V3 }[], profiles: Profile[], closed = false, caps = false) {
  const m = profiles[0].length
  const at = (i: number, k: number) => {
    const [a, b] = profiles[i][k]
    return add(path[i], add(mul(frames[i].N, a), mul(frames[i].B, b)))
  }
  const normal = (i: number, k: number) => {
    const [a, b] = profiles[i][k], [c, d] = profiles[i][(k + 1) % m]
    return unit(add(mul(frames[i].N, d - b), mul(frames[i].B, -(c - a))))
  }
  const last = closed ? path.length : path.length - 1
  for (let i = 0; i < last; i++) {
    const j = (i + 1) % path.length
    for (let k = 0; k < m; k++) {
      const l = (k + 1) % m
      const ni = normal(i, k), nj = normal(j, k)
      tri(p, [at(i, k), at(i, l), at(j, l)], [ni, ni, nj])
      tri(p, [at(i, k), at(j, l), at(j, k)], [ni, nj, nj])
    }
  }
  if (caps && !closed) {
    const n = path.length - 1
    fan(p, profiles[0].map((_, k) => at(0, k)), unit(sub(path[0], path[1])))
    fan(p, profiles[n].map((_, k) => at(n, k)), unit(sub(path[n], path[n - 1])))
  }
}
/** Frames for a path lying in a face of the wheel: B across the disc (y). */
function inPlane(path: V3[], closed: boolean) {
  return path.map((_, i) => {
    const prev = path[closed ? (i + path.length - 1) % path.length : Math.max(0, i - 1)]
    const next = path[closed ? (i + 1) % path.length : Math.min(path.length - 1, i + 1)]
    const T = unit(sub(next, prev)), B: V3 = [0, 1, 0]
    return { N: unit(cross(T, B)), B }
  })
}
/** A straight member from a to b, tapering from section s0 to s1. */
function beam(p: Part, a: V3, b: V3, s0: Profile, s1: Profile, side: V3 = [0, 0, 1], caps = true) {
  const T = unit(sub(b, a))
  let N = cross(side, T)
  if (Math.hypot(...N) < 1e-6) N = cross([1, 0, 0], T)
  N = unit(N)
  const B = unit(cross(T, N))
  sweep(p, [a, b], [{ N, B }, { N, B }], [s0, s1], false, caps)
}

// --- The two turning faces: rim band, inner ring, 24 spokes -----------------
for (const y of [-FACE, FACE]) {
  const rim = Array.from({ length: 32 }, (_, i) => wheel(R_RIM, i / 32 * TAU, y))
  sweep(rimPart, rim, inPlane(rim, true), rim.map(() => rect(0.65, 0.3)), true)
  const ring = Array.from({ length: 16 }, (_, i) => wheel(R_INNER, (i + 0.5) / 16 * TAU, y))
  sweep(rimPart, ring, inPlane(ring, true), ring.map(() => rect(0.35, 0.22)), true)
  for (let k = 0; k < 24; k++) {
    const t = (k + 0.5) / 24 * TAU
    beam(spokePart, wheel(2.2, t, y), wheel(R_RIM - 0.5, t, y), rect(0.3, 0.2), rect(0.26, 0.2), [0, 1, 0], false)
  }
}
// The hub drum the spokes run into; it turns with them.
beam(spokePart, [0, -FACE - 0.4, 0], [0, FACE + 0.4, 0], circle(2.4, 14), circle(2.4, 14), [1, 0, 0])

// --- Gondolas -------------------------------------------------------------------
/**
 * A gondola hanging from a pivot at the origin: a chamfered box 2.8 m across
 * the wheel's face, 1.9 m deep and 2.5 m tall, between the faces, with a gold
 * band where the Pixar artwork is. One mesh per colour, shared by every node.
 */
function gondola(body: Part, band: Part) {
  const w = 1.4, d = 0.95
  const ring = (zz: number, inset: number): V3[] => rect(w - inset, d - inset).map(([a, b]) => [a, b, zz] as V3)
  const top = 0.1, bot = top - 2.6
  const b0 = bot + 0.55, b1 = bot + 1.2
  body.loft([ring(bot, 0.25), ring(bot + 0.3, 0), ring(b0, 0)])
  band.loft([ring(b0, 0), ring(b1, 0)])
  body.loft([ring(b1, 0), ring(top - 0.4, 0), ring(top, 0.35)])
  body.cap(ring(top, 0.35), true)
  body.cap(ring(bot, 0.25), false)
}

// --- Motion -----------------------------------------------------------------------
/**
 * One turn every 90 s, against the real ride's 9-minute cycle: livelier, so
 * the motion shows on a map. Clockwise as seen from the bay.
 */
const LOOP = 90
const KEYS = 48
const times = Array.from({ length: KEYS + 1 }, (_, i) => (i / KEYS) * LOOP)
const turned = times.map((_, i) => (i / KEYS) * TAU)
const AXLE: V3 = [0, 1, 0]
// Seen from +y (the bay), a right-handed turn about +y runs clockwise.
const wheelTurn: Quat[] = turned.map((a) => axisAngle(AXLE, a))
const plumb: Quat[] = turned.map((a) => axisAngle(AXLE, -a))

const nodes: NodeSpec[] = [{
  name: 'wheel',
  translation: [0, 0, H],
  parts: [{ part: rimPart, material: MT }, { part: spokePart, material: MD }],
}]
const channels: ChannelSpec[] = [{ node: 0, path: 'rotation', values: wheelTurn }]

const redCar = new Part(), redBand = new Part(), tealCar = new Part(), tealBand = new Part()
gondola(redCar, redBand)
gondola(tealCar, tealBand)
const fixedKind = [{ part: tealCar, material: MT }, { part: tealBand, material: MG }]
const slideKind = [{ part: redCar, material: MR }, { part: redBand, material: MG }]

// Every third gondola is fixed to the rim; the rest slide on serpentine tracks.
const TRACK = (t: number, base: number) => {
  const r = R_INNER + 0.4 + (R_RIM - 1.4 - R_INNER) * t
  return { r, a: base + 0.1 * Math.sin(TAU * t) * (1 - 0.35 * t) }
}
for (let k = 0; k < 24; k++) {
  const base = -Math.PI / 2 + k / 24 * TAU
  if (k % 3 === 0) {
    // Pivoted just outside the rim's centre line, astride the rim.
    nodes.push({ name: `gondola-${k + 1}`, parent: 0, translation: wheel(R_RIM + 0.9, base, 0), parts: fixedKind })
    channels.push({ node: nodes.length - 1, path: 'rotation', values: plumb })
    continue
  }
  for (const y of [-FACE + 0.3, FACE - 0.3]) {
    const path = Array.from({ length: 7 }, (_, i) => { const { r, a } = TRACK(i / 6, base); return wheel(r, a, y) })
    sweep(rimPart, path, inPlane(path, false), path.map(() => rect(0.38, 0.16)), false)
  }
  const slide = turned.map((a) => {
    const { r, a: at } = TRACK((1 - Math.sin(base - a)) / 2, base)
    return wheel(r, at, 0)
  })
  nodes.push({ name: `gondola-${k + 1}`, parent: 0, translation: slide[0], parts: slideKind })
  channels.push({ node: nodes.length - 1, path: 'rotation', values: plumb })
  channels.push({ node: nodes.length - 1, path: 'translation', values: slide })
}

// --- Fixed structure: axle, legs ------------------------------------------------------
beam(dark, [0, -APEX_Y - 0.6, H], [0, APEX_Y + 0.6, H], circle(1.0, 12), circle(1.0, 12), [1, 0, 0])
for (const s of [-1, 1]) {
  // Two broad box legs per side, splayed along the plane and out of it,
  // meeting at a bearing block in front of the sunburst.
  const apex = (x: number): V3 => [x, s * APEX_Y, H - 0.8]
  const foot = (x: number): V3 => [x, s * FOOT_Y, 0.6]
  for (const x of [-FOOT_X, FOOT_X]) {
    beam(dark, foot(x), apex(Math.sign(x) * 0.9), rect(0.75, 0.9, 0.22), rect(0.5, 0.6, 0.15))
    beam(dark, [x, s * FOOT_Y, 0], [x, s * FOOT_Y, 0.9], rect(1.3, 1.2, 0.3), rect(1.2, 1.1, 0.3), [1, 0, 0])
  }
  // Teal cross-braces between each side's legs, as in the queue photo.
  const at = (x: number, z: number): V3 => {
    const t = (z - 0.6) / (H - 1.4)
    return [x * (1 - t) + Math.sign(x) * 0.9 * t, s * (FOOT_Y - (FOOT_Y - APEX_Y) * t), z]
  }
  for (const z of [7, 14]) beam(brace, at(-FOOT_X, z), at(FOOT_X, z), rect(0.35, 0.4, 0.1), rect(0.35, 0.4, 0.1))
  beam(dark, [0, s * (APEX_Y - 0.9), H], [0, s * (APEX_Y + 0.5), H], rect(1.6, 1.4, 0.3), rect(1.6, 1.4, 0.3), [0, 0, 1])
}

// --- Sunbursts, Mickey's head -----------------------------------------------------------
/** A flat shape (x across, z up) at depth y, facing out along s·y; with depth, an extruded slab. */
function plate(p: Part, pts: [number, number][], y: number, s: number, depth = 0, cx = 0, cz = H) {
  const P = (q: [number, number], yy: number): V3 => [cx + q[0], yy, cz + q[1]]
  const n: V3 = [0, s, 0]
  // Front: a fan from the centroid, which is inside every shape used here.
  const c: [number, number] = [pts.reduce((a, q) => a + q[0], 0) / pts.length, pts.reduce((a, q) => a + q[1], 0) / pts.length]
  for (let i = 0; i < pts.length; i++) tri(p, [P(c, y), P(pts[i], y), P(pts[(i + 1) % pts.length], y)], [n, n, n])
  if (!depth) return
  const yb = y - s * depth
  const nb: V3 = [0, -s, 0]
  for (let i = 0; i < pts.length; i++) tri(p, [P(c, yb), P(pts[i], yb), P(pts[(i + 1) % pts.length], yb)], [nb, nb, nb])
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    const e = unit([b[1] - a[1], 0, -(b[0] - a[0])])
    // Outward from the shape's centre.
    const m: [number, number] = [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1]]
    const out: V3 = m[0] * e[0] + m[1] * e[2] >= 0 ? e : mul(e, -1)
    tri(p, [P(a, y), P(b, y), P(b, yb)], [out, out, out])
    tri(p, [P(a, y), P(b, yb), P(a, yb)], [out, out, out])
  }
}
const ellipse = (x: number, z: number, rx: number, rz: number, n = 16, a0 = 0, a1 = TAU): [number, number][] =>
  Array.from({ length: n }, (_, i) => {
    const t = a0 + (a1 - a0) * (a1 - a0 >= TAU - 1e-9 ? i / n : i / (n - 1))
    return [x + rx * Math.cos(t), z + rz * Math.sin(t)]
  })
/** A star: `n` points alternating long and short, round an inner radius. */
function star(n: number, long: number, short: number, inner: number, rot = Math.PI / 2): [number, number][] {
  const pts: [number, number][] = []
  for (let i = 0; i < n; i++) {
    const t = rot + (i / n) * TAU, r = i % 2 ? short : long
    const h = (0.5 / n) * TAU
    pts.push([inner * Math.cos(t - h), inner * Math.sin(t - h)])
    pts.push([r * Math.cos(t), r * Math.sin(t)])
  }
  return pts
}
// The sunbursts: sixteen gold rays, long and short, on both sides. Fanned
// from the hub, so the star needs no concave triangulation.
plate(gold, star(16, 14.5, 10, 6.2), BURST_Y, 1, 0.35)
plate(gold, star(24, 16.5, 11.5, 6.4), -BURST_Y, -1, 0.35)
// The park side: a dark hub disc inside the rays, behind the leg apex.
plate(dark, ellipse(0, 0, 3.6, 3.6, 16), -(BURST_Y + 0.08), -1, 0)

// Mickey, from the bay-side photos: head 11 m across, ears 5.4 m, face mask
// 9.4 m wide. All centred on the hub; the head rides 0.6 m higher.
const HZ = H + 0.6
plate(dark, ellipse(0, 0, 5.5, 5.5, 20), HEAD_Y + 0.5, 1, 0.5, 0, HZ)
for (const sx of [-1, 1]) plate(dark, ellipse(sx * 4.9, 5.3, 2.75, 2.75, 16), HEAD_Y + 0.5, 1, 0.5, 0, HZ)
// The face mask: a broad jaw and two brow lobes, with the widow's peak
// between them left dark.
const FY = HEAD_Y + 0.56
plate(face, ellipse(0, -1.2, 5.05, 3.85, 20), FY, 1, 0, 0, HZ)
for (const sx of [-1, 1]) plate(face, ellipse(sx * 1.55, 1.5, 2.15, 2.75, 16), FY, 1, 0, 0, HZ)
// Eyes, nose, the open smile and tongue.
const DY = FY + 0.06
for (const sx of [-1, 1]) plate(dark, ellipse(sx * 1.05, 1.7, 0.6, 1.25, 12), DY, 1, 0, 0, HZ)
plate(dark, ellipse(0, 0.05, 1.15, 0.72, 12), DY, 1, 0, 0, HZ)
plate(dark, ellipse(0, -1.25, 3.0, 2.7, 16, Math.PI, TAU), DY, 1, 0, 0, HZ)
plate(red, ellipse(0, -3.15, 1.5, 0.7, 12), DY + 0.06, 1, 0, 0, HZ)

// --- Write ---------------------------------------------------------------------------------
const parts = [
  { part: dark, material: MD }, { part: brace, material: MT }, { part: gold, material: MG }, { part: face, material: MF }, { part: red, material: MR },
]
const drawn = new Map<string, number>()
for (const { part, material } of [...parts, ...nodes.flatMap((n) => n.parts)])
  drawn.set(material.name, (drawn.get(material.name) ?? 0) + part.triangles)
const triangles = [...drawn.values()].reduce((a, b) => a + b, 0)
console.log([...drawn].map(([name, n]) => `${name}: ${n}`).join('\n'))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Pixar Pal-A-Round', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: 48.3, bearing: 40,
}, { nodes, animation: { name: 'turn', times, channels } })
await Bun.write(new URL('../models/dlr-pixar-pal-a-round.glb', import.meta.url), glb)
console.log(`dlr-pixar-pal-a-round.glb: ${triangles} triangles, ${glb.length} bytes, ${LOOP} s a turn`)
