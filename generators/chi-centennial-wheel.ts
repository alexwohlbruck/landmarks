/**
 * Centennial Wheel, Navy Pier, Chicago (2016, Dutch Wheels DW60) — original
 * procedural geometry, CC0-1.0.
 * bun generators/chi-centennial-wheel.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the pier deck under the
 * axle. The wheel turns in the y–z plane, so its axle runs east–west. Placed
 * at bearing 358.8°: OSM's outline of the wheel (way/686996484) is a strip
 * 58 m long and 3–4 m wide whose long sides run 358.8°/178.8°, and NAIP
 * shows the same: the wheel's plane runs north–south across the pier, so it
 * is seen face-on from the lake and from the city end, nearly edge-on from
 * the pier's sides.
 *
 * Identity: a 60 m white wheel with a bold silver rim, a ring of 42 dark
 * navy gondolas that read as beads around it, white truss spokes, a big
 * round hub with a logo disc on each face, and four white tube legs: a
 * near-vertical A-frame on the west side and two long back-stays splayed
 * out to the east (the X that NAIP shows east of the wheel).
 *
 * Abstraction (STYLE.md: no thin ribs): each face's rim truss is one solid
 * band; the many lattice spokes are twenty-one members per face; each
 * gondola is a rounded box. The gondolas hang between the two faces of the
 * rim, as on the real wheel, so nothing passes through anything else.
 *
 * It turns (experimental; see "Animation" in STYLE.md). The wheel is a glTF
 * node at the axle; each gondola is a child node at its pivot on the rim,
 * turned back by as much as the wheel turns so it hangs plumb. The real
 * wheel makes three turns in a 12-minute ride (4 minutes a turn); that is
 * too slow to see on a map, so this loop is 90 s a turn, like the Wonder
 * Wheel's. Frame 0 is the static model.
 *
 * Evidence:
 *  - plan and placement: OSM way/686996484 (attraction=big_wheel,
 *    height=59.74). Anchor = its centroid. Replaces that way only.
 *  - published: 196 ft (60 m) tall, 42 gondolas, DW60 by Dutch Wheels,
 *    opened May 2016 (Wikipedia, "Navy Pier"; navypier.org).
 *  - measured: outline length 58.3 m → rim ≈ 55.6 m across its outer edge
 *    (centre line radius 27 m); axle at 32 m so the rim top meets OSM's
 *    59.7 m and the lowest gondola clears the boarding deck by ~2 m.
 *  - estimated from photos: wheel depth (faces 4 m apart, from the 3–4 m
 *    outline and the photos), gondola size (≈3 m along the rim and 2.8 m
 *    tall, from their width against the 4.1 m spacing in face-on photos), hub and disc size, leg thickness. Leg
 *    feet: the east back-stays land ≈ 9 m east and ±19 m north/south of
 *    the axle (NAIP, allowing for the wheel's lean in the image); the west
 *    A-frame feet ±12 m, 4 m west (photos; hidden under the wheel in NAIP).
 *  - colour: white structure and spokes, pale silver rim, dark navy
 *    gondolas (pulled up to about charcoal per STYLE.md).
 *
 * Photos (Wikimedia Commons): Centennial_Wheel_en_Navy_Pier_en_Chicago.jpg
 * (Javierleiva, CC BY-SA 4.0); Ferris_Wheel_at_Navy_Pier,_Chicago_
 * (49687527151).jpg (Matt Kieffer, CC BY-SA 2.0); Ferris_Wheel_
 * (30507624327).jpg (Marlin Keesler, CC BY 2.0); Chicago_(24247249958).jpg
 * (Olivier Bruchez, CC BY-SA 2.0); Navy_Pier_from_360_Chicago_Observation_
 * Deck_(49687064233).jpg (Matt Kieffer, CC BY-SA 2.0); Navy_Pier_Drone_
 * shot.jpg (Moses8910, CC BY-SA 4.0). USGS NAIP for the plan. No commercial
 * imagery.
 */
import { Part, axisAngle, cross, sub, writeGlb, type ChannelSpec, type MaterialSpec, type NodeSpec, type Quat, type V3 } from './mesh'
import { finish } from './palette'

const TAU = Math.PI * 2
const H = 32              // axle height
const R = 27              // rim band centre line
const FACE = 2.0          // each face of the rim from the mid-plane
const N_CARS = 42
const N_SPOKES = 21       // per face
const SEG = 36            // rim segments

const white = new Part()    // spokes, hub, legs
const rim = new Part()      // silver rim bands
const navy = new Part()     // one gondola, shared by all 42
const disc = new Part()     // logo discs on the hub

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A point on the wheel at radius r, angle θ (0 = north, π/2 = up), face x, about the axle. */
const wheel = (r: number, t: number, x: number): V3 => [x, r * Math.cos(t), r * Math.sin(t)]

/** A triangle whose winding follows its normals. */
function tri(p: Part, v: V3[], n: V3[]) {
  const face = cross(sub(v[1], v[0]), sub(v[2], v[0]))
  if (dot(face, add(add(n[0], n[1]), n[2])) >= 0) p.tri(v[0], v[1], v[2], undefined, undefined, undefined, n)
  else p.tri(v[0], v[2], v[1], undefined, undefined, undefined, [n[0], n[2], n[1]])
}
function fan(p: Part, ring: V3[], n: V3) {
  for (let i = 1; i < ring.length - 1; i++) tri(p, [ring[0], ring[i], ring[i + 1]], [n, n, n])
}

type Profile = [number, number][]
const rect = (a: number, b: number, c = 0): Profile => c
  ? [[-a + c, -b], [a - c, -b], [a, -b + c], [a, b - c], [a - c, b], [-a + c, b], [-a, b - c], [-a, -b + c]]
  : [[-a, -b], [a, -b], [a, b], [-a, b]]
const circle = (r: number, n: number): Profile => Array.from({ length: n }, (_, i) => [r * Math.cos(i / n * TAU), r * Math.sin(i / n * TAU)])

/** Sweep a profile along a path; flat across the section, smooth along it. */
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

/** A straight member from a to b, tapering from section s0 to s1. */
function beam(p: Part, a: V3, b: V3, s0: Profile, s1: Profile, side: V3 = [0, 0, 1], caps = true) {
  const T = unit(sub(b, a))
  let N = cross(side, T)
  if (Math.hypot(...N) < 1e-6) N = cross([0, 1, 0], T)
  N = unit(N)
  const B = unit(cross(T, N))
  sweep(p, [a, b], [{ N, B }, { N, B }], [s0, s1], false, caps)
}

// --- Rim: one bold band per face ---------------------------------------------
// Radial depth 1.6 m, 0.6 m across, chamfered so it catches a highlight.
for (const x of [-FACE, FACE]) {
  const path = Array.from({ length: SEG }, (_, i) => wheel(R, (i + 0.5) / SEG * TAU, x))
  const frames = path.map((q) => {
    const N = unit([0, q[1], q[2]] as V3) // outward, in the plane
    return { N, B: [1, 0, 0] as V3 }
  })
  sweep(rim, path, frames, path.map(() => rect(0.8, 0.3, 0.2)), true)
}

// --- Spokes and hub -------------------------------------------------------------
// The real spokes are lattice trusses fanning from a hub as wide as the
// wheel; twenty-one members per face, splayed in from the rim faces to
// the hub ends, keep that shape at map scale.
const HUB_R = 2.2, HUB_X = 2.8
for (const s of [-1, 1]) {
  for (let k = 0; k < N_SPOKES; k++) {
    const t = (k + 0.5) / N_SPOKES * TAU
    beam(white, wheel(HUB_R - 0.3, t, s * HUB_X * 0.85), wheel(R - 0.7, t, s * FACE), rect(0.42, 0.28, 0.1), rect(0.34, 0.24, 0.08), [1, 0, 0], false)
  }
}
// Hub drum along the axle, and a logo disc on each end (the dark "Navy Pier"
// roundel with a white rim, as in the photos).
beam(white, [-HUB_X, 0, 0], [HUB_X, 0, 0], circle(HUB_R, 16), circle(HUB_R, 16), [0, 0, 1])
for (const s of [-1, 1]) {
  beam(white, [s * HUB_X, 0, 0], [s * (HUB_X + 1.3), 0, 0], circle(2.6, 16), circle(2.6, 16), [0, 0, 1])
  beam(white, [s * (HUB_X + 1.3), 0, 0], [s * (HUB_X + 1.8), 0, 0], circle(4.0, 16), circle(4.0, 16), [0, 0, 1])
  // The roundel face sits 2 cm proud of its white rim, outermost on the hub,
  // so the legs meet the axle behind it as in the photos.
  const ring = circle(3.3, 16).map(([a, b]): V3 => [s * (HUB_X + 1.82), a, b])
  fan(disc, ring, [s, 0, 0])
}

// --- Gondolas -------------------------------------------------------------------
/**
 * One gondola hanging from a pivot at its origin: a rounded capsule, 3 m
 * along the rim, 2.8 m across the wheel (it hangs between the rim faces,
 * which are 3.4 m apart inside) and 2.8 m tall.
 */
function gondola(p: Part) {
  const a = 1.4, b = 1.5, top = -0.25, bot = top - 2.8
  const ring = (z: number, inset: number): V3[] =>
    rect(a - inset, b - inset, 0.45 - inset * 0.5).map(([u, v]) => [u, v, z] as V3)
  const rings = [ring(bot, 0.35), ring(bot + 0.45, 0), ring(top - 0.35, 0), ring(top, 0.3)]
  p.loft(rings)
  p.cap(rings[3], true)
  p.cap(rings[0], false)
}
gondola(navy)

// --- Motion -------------------------------------------------------------------
/** One turn every 90 s (the real wheel takes 4 minutes); see the header. */
const LOOP = 90
const KEYS = 42
const times = Array.from({ length: KEYS + 1 }, (_, i) => (i / KEYS) * LOOP)
const turned = times.map((_, i) => (i / KEYS) * TAU)
const AXLE: V3 = [1, 0, 0]
const wheelTurn: Quat[] = turned.map((a) => axisAngle(AXLE, a))
const plumb: Quat[] = turned.map((a) => axisAngle(AXLE, -a))

const WHITE: MaterialSpec = finish('wheel-white', 0xf1f0ec, 0.6)
const SILVER: MaterialSpec = finish('rim-silver', 0xc3c9ce, 0.5)
const NAVY: MaterialSpec = finish('gondola-navy', 0x48526a, 0.4)
const ROUNDEL: MaterialSpec = finish('roundel', 0x6b4650, 0.6)

const nodes: NodeSpec[] = [{
  name: 'wheel',
  translation: [0, 0, H],
  parts: [{ part: rim, material: SILVER }, { part: white, material: WHITE }, { part: disc, material: ROUNDEL }],
}]
const channels: ChannelSpec[] = [{ node: 0, path: 'rotation', values: wheelTurn }]
const car = [{ part: navy, material: NAVY }]
for (let k = 0; k < N_CARS; k++) {
  const t = Math.PI / 2 + (k / N_CARS) * TAU
  nodes.push({ name: `gondola-${k + 1}`, parent: 0, translation: wheel(R, t, 0), parts: car })
  channels.push({ node: nodes.length - 1, path: 'rotation', values: plumb })
}

// --- Legs (static) ----------------------------------------------------------------
const legs = new Part()
// West: a near-vertical A-frame in the wheel's plane.
// East: two long back-stays splayed out to the north and south.
const feet: Array<{ top: V3; foot: V3 }> = [
  { top: [-3.6, 0, H - 0.8], foot: [-4.5, 12.5, 0] },
  { top: [-3.6, 0, H - 0.8], foot: [-4.5, -12.5, 0] },
  { top: [3.6, 0, H - 0.8], foot: [10, 19, 0] },
  { top: [3.6, 0, H - 0.8], foot: [10, -19, 0] },
]
for (const { top, foot } of feet) {
  beam(legs, [foot[0], foot[1], 0.6], top, circle(0.95, 10), circle(0.7, 10))
  // A plinth at the foot, so the slanted tube's end stays out of sight.
  beam(legs, [foot[0], foot[1], 0], [foot[0], foot[1], 1.0], rect(1.4, 1.4, 0.3), rect(1.3, 1.3, 0.3), [1, 0, 0])
}

const parts = [{ part: legs, material: WHITE }]
const drawn = new Map<string, number>()
for (const { part, material } of [...parts, ...nodes.flatMap((n) => n.parts)])
  drawn.set(material.name, (drawn.get(material.name) ?? 0) + part.triangles)
const triangles = [...drawn.values()].reduce((a, b) => a + b, 0)
console.log([...drawn].map(([name, n]) => `${name}: ${n}`).join('\n'))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Centennial Wheel', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: 59.8, bearing: 358.8,
}, { nodes, animation: { name: 'turn', times, channels } })
await Bun.write(new URL('../models/chi-centennial-wheel.glb', import.meta.url), glb)
console.log(`chi-centennial-wheel.glb: ${triangles} triangles, ${glb.length} bytes, ${LOOP} s a turn`)
