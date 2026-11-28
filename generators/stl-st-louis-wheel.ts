/**
 * The St. Louis Wheel, St. Louis Union Station (opened October 2019) —
 * original procedural geometry, CC0-1.0.
 * bun generators/stl-st-louis-wheel.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground under the
 * axle. The wheel turns in the y–z plane, so its axle runs along x. Placed
 * at bearing 14.85, the same as the train shed beside it: NAIP shows the
 * wheel's plane running 15.7°/195.7°, parallel to the shed's west wall, so
 * it is seen face-on from the west (20th Street) and from the shed, and
 * nearly edge-on from Market Street.
 *
 * Identity: a 200 ft white wheel west of the Union Station train shed: two
 * slim white rims (an outer tube and an inner ring on each face), sixteen
 * white lattice spokes per face fanning from a long hub, 42 white
 * capsule gondolas with dark window bands hanging between the faces, and
 * four straight white tube legs splayed both along the axle and in the
 * wheel's plane. At night its LEDs light the rim.
 *
 * It turns (experimental; see "Animation" in STYLE.md): the wheel is a
 * glTF node at the axle; each gondola is a child node at its pivot, turned
 * back by as much as the wheel turns so it hangs plumb. One turn takes 90 s
 * here (the real ride is about 15 minutes), like the other wheels.
 * Frame 0 is the static model.
 *
 * Evidence:
 *  - OSM node/7863293647 (name=The St. Louis Wheel): the anchor; it agrees
 *    within 1 m with the centre of the leg feet in NAIP. The wheel has no
 *    building outline, and its park (way/1462606683) is leisure, so
 *    `replaces` is empty.
 *  - Published: 200 ft (61 m) tall, 42 climate-controlled gondolas, opened
 *    October 2019 (stlouisunionstation.com; St. Louis Post-Dispatch, 2019).
 *  - Lidar: none usable (USGS 3DEP here is the 2017 flight, before the
 *    wheel); the height is the published one.
 *  - USGS NAIP (after 2019): the wheel's plane (15.7°), the hub's position,
 *    and the four leg feet at about (±9, ±11.6) m in the model frame
 *    (measured on the 0.15 m image).
 *  - Mapterhorn terrain: flat within 0.7 m under the footprint; elevation 0.
 *  - Estimated from the face-on photo (highsmith, scaled to the published
 *    height): outer rim radius 28.5 m with its top at 61 m (axle 32.5 m),
 *    inner ring 26 m, gondola pivots 26.4 m, gondolas ≈2.4 m along the rim
 *    and 2.3 m across, 2.9 m tall; sixteen lattice spokes per face; hub Ø3 m,
 *    the faces 3.4 m apart (edge-on photo); the boarding deck 12 × 6 m,
 *    2.4 m tall under the lowest gondola.
 *  - Colours: white structure, white gondolas with dark window bands
 *    (highsmith, lemay).
 *
 * Photos (all EVIDENCE):
 *  highsmith "Ferris wheel called, simply, 'The St. Louis Wheel'", Carol M.
 *            Highsmith, 2020, CC0 (face-on from the west)
 *            https://www.loc.gov/item/2020742812/
 *  lemay073  "St. Louis Wheel, St. Louis Union Station, Market Street, St.
 *            Louis, MO", w_lemay, CC BY-SA 2.0 (from the north-west)
 *            https://www.flickr.com/photos/59081381@N03/53051062073
 *  lemay961  same series, w_lemay, CC BY-SA 2.0 (from the north, nearly
 *            edge-on) https://www.flickr.com/photos/59081381@N03/53050574961
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the depth between the faces and the exact leg geometry at the hub
 * are read from oblique photos; the thin tension cables between the lattice
 * spokes are left out; the boarding deck is drawn plain.
 */
import { Part, axisAngle, cross, sub, writeGlb, type ChannelSpec, type MaterialSpec, type NodeSpec, type Quat, type V3 } from './mesh'
import { finish } from './palette'

const TAU = Math.PI * 2
const H = 32.5            // axle height
const R_OUT = 28.5        // outer rim tube (top at 61 m)
const R_IN = 26.0         // inner ring
const R_PIV = 26.4        // gondola pivots
const FACE = 1.7          // each face from the mid-plane
const N_CARS = 42
const N_SPOKES = 16
const SEG = 36

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
/** A point on the wheel at radius r, angle t (0 = north, π/2 = up), axle offset x. */
const wheel = (r: number, t: number, x: number): V3 => [x, r * Math.cos(t), r * Math.sin(t)]

function tri(p: Part, v: V3[], n: V3[]) {
  const f = cross(sub(v[1], v[0]), sub(v[2], v[0]))
  if (dot(f, add(add(n[0], n[1]), n[2])) >= 0) p.tri(v[0], v[1], v[2], undefined, undefined, undefined, n)
  else p.tri(v[0], v[2], v[1], undefined, undefined, undefined, [n[0], n[2], n[1]])
}
function fan(p: Part, ring: V3[], n: V3) {
  for (let i = 1; i < ring.length - 1; i++) tri(p, [ring[0], ring[i], ring[i + 1]], [n, n, n])
}
type Profile = [number, number][]
const rect = (a: number, b: number): Profile => [[-a, -b], [a, -b], [a, b], [-a, b]]
const circle = (r: number, n: number): Profile => Array.from({ length: n }, (_, i) => [r * Math.cos((i / n) * TAU), r * Math.sin((i / n) * TAU)])

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
function beam(p: Part, a: V3, b: V3, s0: Profile, s1: Profile, side: V3 = [0, 0, 1], caps = true) {
  const T = unit(sub(b, a))
  let N = cross(side, T)
  if (Math.hypot(...N) < 1e-6) N = cross([0, 1, 0], T)
  N = unit(N)
  const B = unit(cross(T, N))
  sweep(p, [a, b], [{ N, B }, { N, B }], [s0, s1], false, caps)
}
function ring(p: Part, r: number, x: number, prof: Profile) {
  const path = Array.from({ length: SEG }, (_, i) => wheel(r, ((i + 0.5) / SEG) * TAU, x))
  const frames = path.map((q) => ({ N: unit([0, q[1], q[2]] as V3), B: [1, 0, 0] as V3 }))
  sweep(p, path, frames, path.map(() => prof), true)
}

// --- the turning wheel (authored about the axle) ---------------------------------
const led = new Part()     // outer rim tubes: the LED lines
const white = new Part()   // inner rings, spokes, hub
for (const x of [-FACE, FACE]) {
  ring(led, R_OUT, x, rect(0.42, 0.42))
  ring(white, R_IN, x, rect(0.3, 0.3))
}
// Lattice spokes: one solid bar per truss, from the hub ends out to the inner ring.
const HUB_X = 2.6, HUB_R = 1.5
for (const s of [-1, 1]) {
  for (let k = 0; k < N_SPOKES; k++) {
    const t = ((k + 0.25) / N_SPOKES) * TAU
    beam(white, wheel(HUB_R, t, s * HUB_X), wheel(R_IN, t, s * FACE), rect(0.42, 0.22), rect(0.32, 0.18), [1, 0, 0], false)
  }
}
// short ties between the inner ring and the outer rim, one per gondola gap
for (const s of [-1, 1]) for (let k = 0; k < N_CARS; k += 3) {
  const t = ((k + 0.5) / N_CARS) * TAU
  beam(white, wheel(R_IN, t, s * FACE), wheel(R_OUT, t, s * FACE), rect(0.18, 0.18), rect(0.18, 0.18), [1, 0, 0], false)
}
beam(white, [-HUB_X - 0.4, 0, 0], [HUB_X + 0.4, 0, 0], circle(HUB_R, 14), circle(HUB_R, 14), [0, 0, 1])

// --- gondolas -------------------------------------------------------------------
const body = new Part(), pane = new Part()
/** One capsule hanging from its pivot at the origin: white shell, dark window band. */
function gondola() {
  const a = 1.2, b = 1.15, top = -0.05, bot = top - 2.9
  const sect = (z: number, inset: number): V3[] => {
    const r: Profile = [[-a + 0.35, -b], [a - 0.35, -b], [a, -b + 0.35], [a, b - 0.35], [a - 0.35, b], [-a + 0.35, b], [-a, b - 0.35], [-a, -b + 0.35]]
    return r.map(([u, v]) => [u * (1 - inset), v * (1 - inset), z] as V3)
  }
  const s1 = sect(bot + 0.3, 0), s2 = sect(bot + 0.75, 0), s3 = sect(top - 0.45, 0), s4 = sect(top, 0.3)
  body.loft([s1, s2]); pane.loft([s2, s3]); body.loft([s3, s4])
  body.cap(s4, true); body.cap(s1, false)
}
gondola()

// --- motion -----------------------------------------------------------------------
const LOOP = 90, KEYS = 42
const times = Array.from({ length: KEYS + 1 }, (_, i) => (i / KEYS) * LOOP)
const turned = times.map((_, i) => (i / KEYS) * TAU)
const AXLE: V3 = [1, 0, 0]
const wheelTurn: Quat[] = turned.map((a) => axisAngle(AXLE, a))
const plumb: Quat[] = turned.map((a) => axisAngle(AXLE, -a))

const WHITE: MaterialSpec = finish('wheel-white', 0xf1f0ec, 0.6)
// The rim carries the wheel's LED lighting, so it glows after dark.
const LED: MaterialSpec = finish('neon-wheel-led', 0xe9ecef, 0.5)
const SHELL: MaterialSpec = finish('gondola-white', 0xe8e9e8, 0.5)
const PANE: MaterialSpec = finish('gondola-glass', 0x4e5b6b, 0.3)

const nodes: NodeSpec[] = [{ name: 'wheel', translation: [0, 0, H], parts: [{ part: led, material: LED }, { part: white, material: WHITE }] }]
const channels: ChannelSpec[] = [{ node: 0, path: 'rotation', values: wheelTurn }]
const car = [{ part: body, material: SHELL }, { part: pane, material: PANE }]
for (let k = 0; k < N_CARS; k++) {
  const t = -Math.PI / 2 + (k / N_CARS) * TAU
  nodes.push({ name: `gondola-${k + 1}`, parent: 0, translation: wheel(R_PIV, t, 0), parts: car })
  channels.push({ node: nodes.length - 1, path: 'rotation', values: plumb })
}

// --- legs and boarding deck (static) ------------------------------------------------
const legs = new Part()
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const top: V3 = [sx * (HUB_X + 0.1), 0, H - 0.6], foot: V3 = [sx * 9, sy * 11.6, 0]
  beam(legs, [foot[0], foot[1], 0.5], top, circle(0.75, 10), circle(0.55, 10))
  beam(legs, [foot[0], foot[1], 0], [foot[0], foot[1], 0.9], rect(1.1, 1.1), rect(1.0, 1.0), [1, 0, 0])
}
// the axle cross-beam between the leg heads
beam(legs, [-HUB_X - 0.4, 0, H], [-HUB_X - 1.2, 0, H], circle(1.0, 12), circle(1.0, 12), [0, 0, 1])
beam(legs, [HUB_X + 0.4, 0, H], [HUB_X + 1.2, 0, H], circle(1.0, 12), circle(1.0, 12), [0, 0, 1])
// boarding deck under the lowest gondola
{
  const deck = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) => {
    const c: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
    const d: V3[] = c.map(([x, y]) => [x, y, z1] as V3)
    legs.loft([c, d]); legs.cap(d, true)
  }
  deck(-3, 3, -6, 6, 0, 2.2)
}

const parts = [{ part: legs, material: WHITE }]
const drawn = new Map<string, number>()
for (const { part, material } of [...parts, ...nodes.flatMap((n) => n.parts)])
  drawn.set(material.name, (drawn.get(material.name) ?? 0) + part.triangles)
const triangles = [...drawn.values()].reduce((a, b) => a + b, 0)
console.log([...drawn].map(([name, n]) => `${name}: ${n}`).join('\n'))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('The St. Louis Wheel', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: 61, bearing: 14.85,
}, { nodes, animation: { name: 'turn', times, channels } })
await Bun.write(new URL('../models/stl-st-louis-wheel.glb', import.meta.url), glb)
console.log(`stl-st-louis-wheel.glb: ${triangles} triangles, ${glb.length} bytes, ${LOOP} s a turn`)
