/**
 * SkyView Atlanta (2013) — original procedural geometry, CC0-1.0.
 * bun generators/atl-skyview.ts
 *
 * Map frame: x east, y north, z up, metres, turned to the placement's
 * bearing (313°), so the wheel turns in the local x–z plane and its axle
 * runs along local y. Local +x points 43°, along the wheel's plane: OSM's
 * outline (way/1292668916, a 50.3 × 2.3 m strip) runs 42°/222°, and the
 * 2018 lidar's points over 32 m are narrowest across a plane at 43–44°.
 * Anchor = the outline's centroid, 33.758831, -84.391852. The lidar puts
 * the hub about 1 m along the plane to the north-east of it (x = +1).
 *
 * A 42-gondola observation wheel beside the Tabernacle on Luckie Street.
 * White throughout by day: two thin rims, a starburst of radial spokes
 * from a big hub with a round screen, white capsules with wide dark
 * windows mounted outside the rim, and two A-frames of thick white tubes
 * splayed both along and across the wheel. At night LED strips on the
 * spokes light it up in changing colours, most often magenta and violet
 * (the night photos below).
 *
 * Evidence:
 *  - USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 0.5 m grid on the
 *    anchor. Along the wheel's plane the surface is a circle: 55.8 m over
 *    the lidar's ground_min (315.81 m) at the middle, 47.2 at ±20 m, 41.0
 *    at ±24 m, which fits an outer envelope (capsules included) of radius
 *    27 m round an axle 28.8 m over ground_min. Mapterhorn's lowest ground
 *    under the wheel is 317.1 m (1.3 m over ground_min, the north-east
 *    end), so here the axle is at 27.6 m and the top at 54.5 m.
 *    Published: "200 feet" (61 m; OSM height=61): the lidar's 54.5 m to
 *    the top capsule is used.
 *  - 42 gondolas (published, SkyView Atlanta; Wikipedia).
 *  - Capsule size, rim, spoke count, hub and legs: estimated from the
 *    photos, scaled to the lidar diameter. About 22 truss spokes a face
 *    (JJonahJackalope's face-on view); modelled 21 a face so they divide
 *    the 42 capsules evenly.
 *  - Leg feet: estimated from the face-on view (feet about ±0.4 of the
 *    radius along the plane) and the side view (Thomson200), ±6 m across.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - SkyView ATL.jpg, JJonahJackalope, CC BY-SA 4.0 (face on, from the
 *    south-east) https://commons.wikimedia.org/wiki/File:SkyView_ATL.jpg
 *  - SkyView Atlanta, July 2018.jpg, Thomson200, CC0 (from under the
 *    wheel: rims, capsules, legs)
 *    https://commons.wikimedia.org/wiki/File:SkyView_Atlanta,_July_2018.jpg
 *  - SkyView Atlanta, Atlanta, GA (40508040873).jpg, Warren LeMay, CC0
 *    https://commons.wikimedia.org/wiki/File:SkyView_Atlanta,_Atlanta,_GA_(40508040873).jpg
 *  - Skyview - Luckie St NW, Atlanta GA (51047875213).jpg, FaceMePLS,
 *    CC BY 2.0 https://commons.wikimedia.org/wiki/File:Skyview_-_Luckie_St_NW,_Atlanta_GA_(51047875213).jpg
 *  - Skyview Atlanta.jpg, Mcooney1, CC BY-SA 4.0 (the hub and spokes)
 *    https://commons.wikimedia.org/wiki/File:Skyview_Atlanta.jpg
 *  - The Wheel (259777543).jpeg, Kailash U, CC0 (night: magenta and
 *    violet spokes) https://commons.wikimedia.org/wiki/File:The_Wheel_(259777543).jpeg
 *  - SkyView Atlanta IMG 7479.jpg, Don McCulley, CC0 (night, magenta)
 *    https://commons.wikimedia.org/wiki/File:SkyView_Atlanta_IMG_7479.jpg
 *  - NAIP orthophoto (USGS, public domain): the plane's direction.
 * No look-only sources. No commercial imagery.
 *
 * Night: the spokes are `neon-skyview-led`, so the wheel reads as a lit
 * starburst after dark. Neon glows in its day colour, and the spokes are
 * white by day, so the glow is white-violet rather than the LED show's
 * changing colours (magenta-violet is the commonest in the photos); a
 * coloured neon would tint the white spokes by day.
 * The capsules' windows are dark glass and stay dark.
 *
 * It turns (experimental; see "Animation" in STYLE.md), as
 * generators/wonder-wheel.ts does: the wheel is a node at the axle, each
 * capsule a child node at its mount turned back by as much as the wheel, so
 * it stays level. A turn takes 120 s; the real wheel takes about 4 minutes.
 * Clockwise as seen from the south-east (Centennial Olympic Park side).
 *
 * It replaces the OSM outline way/1292668916. The ticket canopy and
 * boarding deck under the wheel are left to the map. Elevation 0.
 *
 * Doubts: the trussed spokes, the cable spokes between them and the
 * cross-bracing between the rims are reduced to one solid spoke per truss;
 * the one black VIP capsule is drawn white like the rest.
 */
import { Part, axisAngle, cross, sub, writeGlb, type ChannelSpec, type MaterialSpec, type NodeSpec, type Quat, type V3 } from './mesh'

const structure = new Part() // rims, hub, rim ties
const spokes = new Part()    // LED-lit spokes
const legs = new Part()      // the A-frames, in the root node
const screen = new Part()    // the hub's round screen (dark)

const TAU = Math.PI * 2
const HX = 1.0          // the hub's offset along the plane (lidar)
const H = 27.6          // axle height over the lowest ground (lidar)
const R_RIM = 23.0      // rim centre line
const R_CAB = 25.2      // capsule centre; its top reaches 26.9 = the lidar envelope
const FACE = 1.35       // each rim's distance from the mid-plane
const N_CAB = 42
const N_SPOKE = 21

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A point on the wheel at radius r, angle t (0 = local east, π/2 = up), face offset y; relative to the axle. */
const wheel = (r: number, t: number, y: number): V3 => [r * Math.cos(t), y, r * Math.sin(t)]

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
const circ = (r: number, n: number): Profile => Array.from({ length: n }, (_, i) => [r * Math.cos(i / n * TAU), r * Math.sin(i / n * TAU)])

/** Sweep a profile along a path; flat across the section, smooth along the path. */
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
function inPlane(path: V3[], closed: boolean) {
  return path.map((_, i) => {
    const prev = path[closed ? (i + path.length - 1) % path.length : Math.max(0, i - 1)]
    const next = path[closed ? (i + 1) % path.length : Math.min(path.length - 1, i + 1)]
    const T = unit(sub(next, prev)), B: V3 = [0, 1, 0]
    return { N: unit(cross(T, B)), B }
  })
}
function beam(p: Part, a: V3, b: V3, s0: Profile, s1: Profile, side: V3 = [0, 0, 1], caps = true) {
  const T = unit(sub(b, a))
  let N = cross(side, T)
  if (Math.hypot(...N) < 1e-6) N = cross([1, 0, 0], T)
  N = unit(N)
  const B = unit(cross(T, N))
  sweep(p, [a, b], [{ N, B }, { N, B }], [s0, s1], false, caps)
}

// --- The wheel: two rims, spokes, hub ----------------------------------------
// Rims bolder than the real tubes (1.2 m deep, 0.8 m across) so the ring
// holds at phone size.
for (const y of [-FACE, FACE]) {
  const rim = Array.from({ length: N_CAB }, (_, i) => wheel(R_RIM, (i / N_CAB) * TAU, y))
  sweep(structure, rim, inPlane(rim, true), rim.map(() => rect(0.6, 0.4)), true)
  // Spokes, tapering from 1.6 m wide at the hub (the starburst round the
  // hub in the face-on photo) to 0.4 m at the rim; from the hub's rim to the wheel's rim, leaning in to the hub's
  // narrower face as the real ones do (the starburst at the hub).
  for (let k = 0; k < N_SPOKE; k++) {
    const t = ((k + 0.5) / N_SPOKE) * TAU
    beam(spokes, wheel(2.6, t, y * 1.6), wheel(R_RIM - 0.4, t, y), rect(0.8, 0.3), rect(0.2, 0.2), [0, 1, 0], false)
  }
}
// A tie between the rims at each capsule mount, which also carries it.
for (let i = 0; i < N_CAB; i++) {
  const t = (i / N_CAB) * TAU
  beam(structure, wheel(R_RIM + 0.2, t, -FACE), wheel(R_RIM + 0.2, t, FACE), rect(0.28, 0.28), rect(0.28, 0.28), [Math.cos(t), 0, Math.sin(t)], false)
}
// The hub drum, and the round screen on each face.
beam(structure, [0, -2.6, 0], [0, 2.6, 0], circ(3.0, 16), circ(3.0, 16), [1, 0, 0])
for (const s of [-1, 1]) {
  const ring = circ(2.75, 16).map(([a, b]) => [a, s * 2.63, b] as V3)
  fan(screen, ring, [0, s, 0])
}

// --- Capsules -----------------------------------------------------------------
/**
 * A capsule hanging level from its mount at the origin: 2.4 m along the rim,
 * 2.2 m across the wheel, 3.4 m tall with chamfered corners, the lower two
 * thirds wrapped in dark glass as on the real ones.
 */
const capsule = new Part(), capsuleGlass = new Part()
{
  const w = 1.2, d = 1.1, c = 0.4, top = 1.7, bot = -1.7
  const ring = (z: number, inset: number): V3[] => rect(w - inset, d - inset, c - inset * 0.6).map(([a, b]) => [a, b, z] as V3)
  const rings = [ring(bot, 0.3), ring(bot + 0.35, 0), ring(top - 0.35, 0), ring(top, 0.3)]
  capsule.loft(rings)
  capsule.cap(rings[3], true)
  capsule.cap(rings[0], false)
  // Window band on all four faces, set 0.04 m proud.
  const z0 = bot + 0.75, z1 = top - 0.95
  for (const s of [-1, 1]) {
    const yy = s * (d + 0.04), xx = s * (w + 0.04)
    const n1: V3 = [0, s, 0], n2: V3 = [s, 0, 0]
    const a = w - c - 0.05, b = d - c - 0.05
    tri(capsuleGlass, [[-a, yy, z0], [a, yy, z0], [a, yy, z1]], [n1, n1, n1])
    tri(capsuleGlass, [[-a, yy, z0], [a, yy, z1], [-a, yy, z1]], [n1, n1, n1])
    tri(capsuleGlass, [[xx, -b, z0], [xx, b, z0], [xx, b, z1]], [n2, n2, n2])
    tri(capsuleGlass, [[xx, -b, z0], [xx, b, z1], [xx, -b, z1]], [n2, n2, n2])
  }
}

// --- Legs: an A-frame each side of the wheel, splayed both ways --------------
for (const s of [-1, 1]) {
  for (const sx of [-1, 1]) {
    const foot: V3 = [HX + sx * 10.5, s * 6.2, 0]
    const top: V3 = [HX + sx * 0.9, s * 3.4, H - 0.6]
    beam(legs, [foot[0] * 0.97 + top[0] * 0.03, foot[1] * 0.97 + top[1] * 0.03, 0.8], top, circ(0.75, 10), circ(0.6, 10), [1, 0, 0], true)
    // Footing pad so the slanted end never shows a gap at the ground.
    beam(legs, [foot[0], foot[1], 0], [foot[0], foot[1], 1.0], rect(1.1, 1.1, 0.25), rect(1.0, 1.0, 0.25), [1, 0, 0], true)
  }
  // Bearing block where the legs meet the axle.
  beam(legs, [HX, s * 2.6, H], [HX, s * 4.0, H], rect(1.5, 1.5, 0.35), rect(1.5, 1.5, 0.35), [0, 0, 1])
}

// --- Materials ----------------------------------------------------------------
// Colours from the daylight photos: white steel and capsules, dark tinted
// capsule glass and screen.
const WHITE: MaterialSpec = { name: 'skyview-white', color: 0xf1f0ec, roughness: 0.6 }
const LED: MaterialSpec = { name: 'neon-skyview-led', color: 0xf3eef4, roughness: 0.6 }
const DARK: MaterialSpec = { name: 'glass', color: 0x4a4f57, roughness: 0.3 }

// --- Motion -------------------------------------------------------------------
const LOOP = 120
const KEYS = 48
const times = Array.from({ length: KEYS + 1 }, (_, i) => (i / KEYS) * LOOP)
const turned = times.map((_, i) => (i / KEYS) * TAU)
const AXLE: V3 = [0, 1, 0]
const wheelTurn: Quat[] = turned.map((a) => axisAngle(AXLE, a))
const level: Quat[] = turned.map((a) => axisAngle(AXLE, -a))

const nodes: NodeSpec[] = [{
  name: 'wheel',
  translation: [HX, 0, H],
  parts: [{ part: structure, material: WHITE }, { part: spokes, material: LED }, { part: screen, material: DARK }],
}]
const channels: ChannelSpec[] = [{ node: 0, path: 'rotation', values: wheelTurn }]
const capsuleParts = [{ part: capsule, material: WHITE }, { part: capsuleGlass, material: DARK }]
for (let i = 0; i < N_CAB; i++) {
  const t = (i / N_CAB) * TAU
  nodes.push({ name: `capsule-${i + 1}`, parent: 0, translation: wheel(R_CAB, t, 0), parts: capsuleParts })
  channels.push({ node: nodes.length - 1, path: 'rotation', values: level })
}

const parts = [{ part: legs, material: WHITE }]
const drawn = new Map<string, number>()
for (const { part, material } of [...parts, ...nodes.flatMap((n) => n.parts)])
  drawn.set(material.name, (drawn.get(material.name) ?? 0) + part.triangles)
const triangles = [...drawn.values()].reduce((a, b) => a + b, 0)
console.log([...drawn].map(([name, n]) => `${name}: ${n}`).join(', '))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('SkyView Atlanta', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: 54.5, bearing: 313,
}, { nodes, animation: { name: 'turn', times, channels } })
if (glb.length > 250000) throw new Error(`too big: ${glb.length}`)
await Bun.write(new URL('../models/atl-skyview.glb', import.meta.url), glb)
console.log(`atl-skyview.glb: ${triangles} triangles, ${glb.length} bytes, ${LOOP} s a turn`)
