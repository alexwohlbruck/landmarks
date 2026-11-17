/**
 * The Cape Wheel, V&A Waterfront, Cape Town — procedural, CC0-1.0.
 * bun generators/cpt-cape-wheel.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground under the
 * axle. The wheel turns in the x–z plane, so its axle runs along y. Placed at
 * bearing 320.8°, so the wheel's plane runs along 50.8°/230.8°: the long
 * side of OSM's plot for it (way/422170709, 22.3 × 16.8 m).
 *
 * A 40 m transportable observation wheel (opened 2010 as the Wheel of
 * Excellence, moved to the Breakwater end of Victoria Wharf in 2023 per the
 * OSM history). Identity: a white wheel with a bold white rim, a ring of 30
 * white capsule gondolas with dark window bands hanging inside/below the
 * rim, a white starburst of tapered plates round the hub, thin truss spokes
 * out to the rim, a blue "Cape Wheel" roundel on the hub, and four thick
 * white tube legs splayed down from the axle.
 *
 * Abstraction (STYLE.md, no thin ribs): each face's rim truss is one solid
 * band; the many lattice and cable spokes are sixteen bold members per face;
 * the starburst is sixteen tapered plates per face; each gondola is a
 * rounded box with a window band. The gondolas hang between the rim faces
 * as on the real wheel.
 *
 * Built as moving parts (STYLE.md "Moving rides", see Animation): the wheel
 * is a node at the axle and every gondola a child node at its pivot, turned
 * back as the wheel turns so it hangs plumb. One turn every 90 s (the real
 * ride is about 15 minutes for several turns; too slow to see on a map).
 * Frame 0 is the static model.
 *
 * Evidence
 *  - OSM way/422170709 (tourism=attraction, attraction=big_wheel,
 *    height=40): anchor = the centre of its four corners; its long side
 *    gives the plane. It is not a building, so `replaces` is empty; OSM has
 *    no building under the wheel. The node history shows the outline moved
 *    from -33.9052, 18.4200 (by the Victoria & Alfred Hotel) to here in
 *    2023-10, so the 2018 photos below show the same wheel on its old site.
 *  - Published/OSM: 40 m tall. 30 gondolas (operator's figure, also counted
 *    in Jim Henderson's photo).
 *  - Estimated from the face-on photos (Henderson 2018, Schuetze 2018):
 *    rim 34.8 m across; gondolas 2.8 × 2.9 m (about 1:12 of the rim's
 *    diameter in the face-on view),
 *    axle at 22.1 m so the top of the rim is at 40 m and the lowest gondola
 *    clears a 1.4 m boarding deck; leg feet about ±8 m along the plane and
 *    ±5 m across it; the starburst plates reach about a third of the radius.
 *  - Colours: white structure and gondolas, near-black gondola glazing
 *    (pulled to the palette's window slate), blue logo roundel.
 *  - No terrain (tools/terrain.ts 404s here: no Mapterhorn z15 tiles); the
 *    quay is flat, elevation 0. No lidar or NAIP in South Africa.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Cape Wheel jeh.jpg, Jim.henderson, CC BY-SA 4.0 (2018),
 *    https://commons.wikimedia.org/wiki/File:Cape_Wheel_jeh.jpg
 *  - Cape Town Waterfront 2018 024.jpg, Einsamer Schütze, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Cape_Town_Waterfront_2018_024.jpg
 *  - At Cape Town (MP) 2018 229.jpg, Mike Peel, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:At_Cape_Town_(MP)_2018_229.jpg
 *  - Cape Wheel loading stairs jeh.jpg, Jim.henderson, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Cape_Wheel_loading_stairs_jeh.jpg
 *  - Cape Town Wheel 2022.jpg, TapticInfo, CC BY-SA 4.0 (the wheel being
 *    dismantled for the move: legs and hub seen edge-on),
 *    https://commons.wikimedia.org/wiki/File:Cape_Town_Wheel_2022.jpg
 * Look-only references: none. No commercial imagery.
 *
 * Doubts: no licensed photo of the wheel on its new site was found, so the
 * plane's direction rests on OSM's plot alone (if the plot is the boarding
 * deck rather than the wheel, the plane could be turned 90°). The boarding
 * deck is a plain block; its real canopy and stairs are left out. The logo
 * roundel is put on both hub faces.
 */
import { Part, axisAngle, cross, sub, writeGlb, type ChannelSpec, type MaterialSpec, type NodeSpec, type Quat, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const H = 22.1            // axle height
const R = 17.4            // rim band centre line
const FACE = 1.5          // each rim face from the mid-plane
const N_CARS = 30
const N_SPOKES = 14       // per face
const SEG = 28            // rim segments

const white = new Part()  // spokes, starburst, hub, legs
const rim = new Part()    // rim bands (lit at night)
const logo = new Part()   // roundels
const shell = new Part()  // one gondola, shared
const glazing = new Part()
const deck = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A point on the wheel at radius r, angle t (0 = +x, π/2 = up), face y, about the axle. */
const wheel = (r: number, t: number, y: number): V3 => [r * Math.cos(t), y, r * Math.sin(t)]

function tri(p: Part, v: V3[], n: V3[]) {
  const f = cross(sub(v[1], v[0]), sub(v[2], v[0]))
  if (dot(f, add(add(n[0], n[1]), n[2])) >= 0) p.tri(v[0], v[1], v[2], undefined, undefined, undefined, n)
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
  if (Math.hypot(...N) < 1e-6) N = cross([1, 0, 0], T)
  N = unit(N)
  const B = unit(cross(T, N))
  sweep(p, [a, b], [{ N, B }, { N, B }], [s0, s1], false, caps)
}

// --- Rim: one bold band per face ----------------------------------------------
for (const y of [-FACE, FACE]) {
  const path = Array.from({ length: SEG }, (_, i) => wheel(R, (i + 0.5) / SEG * TAU, y))
  const frames = path.map((q) => ({ N: unit([q[0], 0, q[2]] as V3), B: [0, 1, 0] as V3 }))
  sweep(rim, path, frames, path.map(() => rect(0.55, 0.28, 0.15)), true)
}

// --- Spokes, starburst, hub ------------------------------------------------------
const HUB_R = 1.5, HUB_Y = 2.3
for (const s of [-1, 1]) {
  for (let k = 0; k < N_SPOKES; k++) {
    const t = (k + 0.25) / N_SPOKES * TAU
    beam(white, wheel(HUB_R, t, s * HUB_Y * 0.8), wheel(R - 0.5, t, s * FACE), rect(0.22, 0.2), rect(0.18, 0.16), [0, 1, 0], false)
  }
  // The starburst: broad white plates, tapering to a point a third of the
  // way out, on the outer face of each side.
  for (let k = 0; k < 24; k++) {
    const t = (k + 0.5) / 24 * TAU
    beam(white, wheel(HUB_R - 0.2, t, s * HUB_Y * 0.9), wheel(k % 2 ? 6.2 : 7.8, t, s * (HUB_Y * 0.9 - 0.3)), rect(0.62, 0.14), rect(0.05, 0.06), [0, 1, 0], true)
  }
}
beam(white, [0, -HUB_Y, 0], [0, HUB_Y, 0], circle(HUB_R, 14), circle(HUB_R, 14), [0, 0, 1])
for (const s of [-1, 1]) {
  // A white collar and the blue roundel on each end of the hub.
  beam(white, [0, s * HUB_Y, 0], [0, s * (HUB_Y + 0.5), 0], circle(2.1, 16), circle(2.1, 16), [0, 0, 1])
  fan(logo, circle(1.8, 16).map(([a, b]): V3 => [a, s * (HUB_Y + 0.52), b]), [0, s, 0])
}

// --- Gondolas ----------------------------------------------------------------------
/**
 * One gondola hanging from its pivot at the origin: a rounded white capsule
 * 2.8 m along the rim, 1.9 m across the wheel (it hangs between the rim
 * faces, 2.4 m apart inside) and 2.9 m tall, with a broad dark window
 * band. It hangs below its pivot on the rim line, as in the photos:
 * inside the rim at the top, straddling it at the sides, below it at the
 * bottom.
 */
{
  const a = 1.4, b = 0.95, top = -0.2, bot = top - 2.9
  const ring = (z: number, inset: number, grow = 0): V3[] =>
    rect(a - inset + grow, b - inset + grow, 0.4 - inset * 0.5).map(([u, v]) => [u, v, z] as V3)
  const rings = [ring(bot, 0.3), ring(bot + 0.35, 0), ring(top - 0.35, 0), ring(top, 0.3)]
  shell.loft(rings)
  shell.cap(rings[3], true)
  shell.cap(rings[0], false)
  glazing.loft([ring(bot + 0.6, 0, 0.03), ring(top - 0.55, 0, 0.03)])
}

// --- Motion ----------------------------------------------------------------------
const LOOP = 90
const KEYS = 30
const times = Array.from({ length: KEYS + 1 }, (_, i) => (i / KEYS) * LOOP)
const turned = times.map((_, i) => (i / KEYS) * TAU)
const AXLE: V3 = [0, 1, 0]
const wheelTurn: Quat[] = turned.map((a) => axisAngle(AXLE, a))
const plumb: Quat[] = turned.map((a) => axisAngle(AXLE, -a))

const WHITE: MaterialSpec = finish('wheel-white', 0xf2f1ed, 0.6)
// The rim carries the wheel's LED lights, so it glows after dark.
const RIM: MaterialSpec = finish('neon-cape-wheel-rim', 0xeceae4, 0.5)
const BLUE: MaterialSpec = finish('cape-wheel-blue', 0x3f7fb6, 0.5)
const SHELL: MaterialSpec = finish('gondola-white', 0xe9e8e3, 0.4)

// The hanger brackets belong to each gondola node, so they hang plumb too.
const hanger = new Part()
beam(hanger, [0, 0, -0.2], [0, 0, 0.3], rect(0.3, 0.3), rect(0.3, 0.3), [1, 0, 0])

const nodes: NodeSpec[] = [{
  name: 'wheel',
  translation: [0, 0, H],
  parts: [{ part: rim, material: RIM }, { part: white, material: WHITE }, { part: logo, material: BLUE }],
}]
const channels: ChannelSpec[] = [{ node: 0, path: 'rotation', values: wheelTurn }]
const car = [{ part: shell, material: SHELL }, { part: hanger, material: SHELL }, { part: glazing, material: PALETTE.window }]
for (let k = 0; k < N_CARS; k++) {
  const t = -Math.PI / 2 + (k / N_CARS) * TAU
  nodes.push({ name: `gondola-${k + 1}`, parent: 0, translation: wheel(R, t, 0), parts: car })
  channels.push({ node: nodes.length - 1, path: 'rotation', values: plumb })
}

// --- Legs and boarding deck (static) ------------------------------------------------
const legs = new Part()
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const top: V3 = [0, sy * (HUB_Y + 0.9), H - 0.6]
  const foot: V3 = [sx * 8.2, sy * 5.0, 0]
  beam(legs, [foot[0], foot[1], 0.8], top, circle(0.62, 10), circle(0.5, 10))
  beam(legs, [foot[0], foot[1], 0], [foot[0], foot[1], 1.0], rect(1.1, 1.1, 0.25), rect(1.0, 1.0, 0.25), [1, 0, 0])
}
// Axle stubs from the leg heads into the hub.
for (const s of [-1, 1]) beam(legs, [0, s * (HUB_Y + 0.5), H], [0, s * (HUB_Y + 1.3), H - 0.3], circle(0.7, 10), circle(0.7, 10), [1, 0, 0])
// The boarding deck the lowest gondola stops at, 1.4 m up (stairs in the photos).
{
  const x = 6.5, y = 3.2, z = 1.4, b = 0.2
  const lo: V3[] = [[-x, -y, 0], [x, -y, 0], [x, y, 0], [-x, y, 0]]
  const hi = lo.map(([u, v]): V3 => [u, v, z - b])
  const top = lo.map(([u, v]): V3 => [u - Math.sign(u) * b, v - Math.sign(v) * b, z])
  deck.loft([lo, hi, top])
  deck.cap(top, true)
}

const parts = [{ part: legs, material: WHITE }, { part: deck, material: PALETTE.roof }]
const drawn = new Map<string, number>()
for (const { part, material } of [...parts, ...nodes.flatMap((n) => n.parts)])
  drawn.set(material.name, (drawn.get(material.name) ?? 0) + part.triangles)
const triangles = [...drawn.values()].reduce((a, b) => a + b, 0)
console.log([...drawn].map(([name, n]) => `${name}: ${n}`).join('\n'))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('The Cape Wheel', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: 40, bearing: 320.8,
}, { nodes, animation: { name: 'turn', times, channels } })
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length}`)
await Bun.write(new URL('../models/cpt-cape-wheel.glb', import.meta.url), glb)
console.log(`cpt-cape-wheel.glb: ${triangles} triangles, ${glb.length} bytes, ${LOOP} s a turn`)
