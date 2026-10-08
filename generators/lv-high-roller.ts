/**
 * High Roller, Las Vegas — procedural, CC0-1.0.
 * bun generators/lv-high-roller.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The wheel turns in
 * the north–south plane (OSM way/402543930 runs at 0.1° from north), so
 * its axle, the spindle, runs east–west. The origin is on the ground under
 * the hub: 17 m north of the outline's centroid, where the spindle crosses
 * the wheel in the outline and in a USGS NAIP orthophoto (public domain;
 * the spindle and the backstay's foot both lie 15–20 m north of it).
 *
 * Published (Wikipedia, "High Roller (Ferris wheel)"; OSM height tag):
 * 550 ft (167.6 m) tall, 520 ft (158.5 m) across, 28 spherical cabins 22 ft
 * (6.7 m) across on the outboard rim, one turn in 30 minutes.
 *
 * Measured and inferred:
 * - 158.5 m is the span across the cabins, not the rim. In the face-on
 *   photo "High Roller Observation Wheel.jpg" (CRJO-CRJO, CC BY-SA 4.0,
 *   from the west) the rim is 0.89 of the cabin span: rim radius ~70.5 m,
 *   cabin centres ~75.5 m. Then the hub stands at 167.6 − 79.3 = 88.3 m
 *   and the lowest cabin's floor about 9.5 m up, at the raised boarding
 *   deck seen in "Las Vegas - The High Roller-03.JPG" (Priwo, public domain);
 * - the support, from "Las Vegas - The High Roller-02.JPG" and "-03.JPG"
 *   (Priwo, public domain, edge-on from the south), "Las Vegas High Roller
 *   Wheel Mar 2013.jpg" (Fubaz, CC BY-SA 3.0, the hub being lifted), "The
 *   High Roller under construction in January 2014.jpg" (Neon068, CC BY-SA
 *   3.0, from the north-east, low) and "Las Vegas High Roller
 *   (20216869960).jpg" (Tony Webster, CC BY 2.0, from below): the hub is a horizontal drum ~30 m long, the full width
 *   between two A-frames, each of two white tubes splayed north and south
 *   and leaning in toward the wheel; the cable spokes fan from flanges at
 *   the hub's ends to the rim, so edge-on the wheel is a tall lens. One long
 *   backstay runs from the east bearing down to the east. Spans scaled from
 *   the edge-on photo at ~0.15 m per pixel (hub height known): bearings
 *   ±16 m from the wheel, tubes ~3 m across, the hub ~3.5 m;
 * - the backstay's foot, ~90 m east of the wheel, from the NAIP image,
 *   where the white tube itself shows; it agrees with the ~40° slope in the
 *   edge-on photos;
 * - the A-frame feet, ±23 m north and south and ~8 m either side of the
 *   wheel, scaled from the photos (about ±15° off vertical). Estimated.
 *
 * Simplified: the cable spokes are drawn as 28 members a side, from the
 * hub flanges to the rim, so the wheel still reads as a wheel
 * rather than a hoop; the rim's box truss is one chamfered band; each
 * cabin is a white sphere with a glass band, on a short bracket.
 *
 * It turns (experimental; see "Animation" in STYLE.md). The rim, spokes
 * and hub are a node at the hub; each cabin is a child node turned back by
 * as much as the wheel turns, so it stays plumb, as the real cabins are
 * motor-driven to keep level. One turn every 150 s, against the real 30
 * minutes, which would not show on a map. The real direction of turn isn't
 * evidenced in the photos; this one turns clockwise seen from the Strip
 * (west). Everything else is the static root. At t = 0 it is the static
 * model.
 *
 * Replaces the attraction outline (way/402543930, not a building, but it is
 * the wheel). The boarding station and the LINQ buildings around the foot
 * stay drawn by the map.
 */
import { Part, axisAngle, writeGlb, type ChannelSpec, type MaterialSpec, type NodeSpec, type Quat, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const H = 88.3                // hub height
const R_RIM = 70.5            // rim centre line
const R_CAB = 75.5            // cabin centres
const CAB = 3.35              // cabin radius, 22 ft across
const SPINDLE = 16            // spindle ends, either side of the wheel
const HUB_X = 13.4            // hub flanges, where the cable spokes start

const white = new Part()      // rim, spokes, hub
const legs = new Part()       // spindle, A-frames, backstay (static)
const grey = new Part()       // hub flanges (turning)
const housings = new Part()   // bearing housings at the spindle ends (static)
const cabWhite = new Part()   // one cabin, shared by all 28
const cabGlass = new Part()

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A point on the wheel, relative to the hub: radius r, angle t (0 = north, π/2 = up), x across the disc. */
const wheel = (r: number, t: number, x = 0): V3 => [x, r * Math.cos(t), r * Math.sin(t)]

/** A triangle whose winding follows its normals. */
function tri(p: Part, v: V3[], n: V3[]) {
  if (dot(cross(sub(v[1], v[0]), sub(v[2], v[0])), add(add(n[0], n[1]), n[2])) >= 0)
    p.tri(v[0], v[1], v[2], undefined, undefined, undefined, n)
  else p.tri(v[0], v[2], v[1], undefined, undefined, undefined, [n[0], n[2], n[1]])
}
function fan(p: Part, ring: V3[], n: V3) {
  for (let i = 1; i < ring.length - 1; i++) tri(p, [ring[0], ring[i], ring[i + 1]], [n, n, n])
}

/**
 * A round tube from a to b, radius r0 to r1, smooth-shaded round its
 * circumference: the white steel tubes of the legs and the spindle.
 */
function tube(p: Part, a: V3, b: V3, r0: number, r1: number, n = 12, caps = true) {
  const T = unit(sub(b, a))
  let N = cross(T, [0, 0, 1])
  if (Math.hypot(...N) < 1e-6) N = cross(T, [1, 0, 0])
  N = unit(N)
  const B = cross(T, N)
  const dir = (i: number): V3 => add(mul(N, Math.cos(i / n * TAU)), mul(B, Math.sin(i / n * TAU)))
  for (let i = 0; i < n; i++) {
    const d0 = dir(i), d1 = dir(i + 1)
    const a0 = add(a, mul(d0, r0)), a1 = add(a, mul(d1, r0)), b0 = add(b, mul(d0, r1)), b1 = add(b, mul(d1, r1))
    tri(p, [a0, a1, b1], [d0, d1, d1])
    tri(p, [a0, b1, b0], [d0, d1, d0])
  }
  if (caps) {
    fan(p, Array.from({ length: n }, (_, i) => add(a, mul(dir(i), r0))), mul(T, -1))
    fan(p, Array.from({ length: n }, (_, i) => add(b, mul(dir(i), r1))), T)
  }
}

type Profile = [number, number][]
/** A chamfered rectangle: half-widths a (radial), b (across the disc). */
const rect = (a: number, b: number, c: number): Profile =>
  [[-a + c, -b], [a - c, -b], [a, -b + c], [a, b - c], [a - c, b], [-a + c, b], [-a, b - c], [-a, -b + c]]

// --- The rim: one chamfered band, flat across, smooth along -----------------
{
  const SEG = 56
  const prof = rect(1.2, 1.4, 0.4)
  const m = prof.length
  const at = (i: number, k: number) => {
    const t = i / SEG * TAU, [u, v] = prof[k]
    return wheel(R_RIM + u, t, v)
  }
  const nrm = (i: number, k: number): V3 => {
    const t = i / SEG * TAU
    const [a, b] = prof[k], [c, d] = prof[(k + 1) % m]
    const nu = d - b, nv = -(c - a), l = Math.hypot(nu, nv)
    return add(mul(wheel(1, t), nu / l), [nv / l, 0, 0])
  }
  for (let i = 0; i < SEG; i++) for (let k = 0; k < m; k++) {
    const l = (k + 1) % m
    tri(white, [at(i, k), at(i, l), at(i + 1, l)], [nrm(i, k), nrm(i, k), nrm(i + 1, k)])
    tri(white, [at(i, k), at(i + 1, l), at(i + 1, k)], [nrm(i, k), nrm(i + 1, k), nrm(i + 1, k)])
  }
}

// --- Hub and spokes ------------------------------------------------------------
// The hub is the long horizontal drum between the A-frames (the construction
// photo shows it lifted in whole); the cables fan from flanges at its ends
// to the rim, so seen edge-on the spokes make a tall lens, as in the photos.
tube(white, [-HUB_X - 0.9, 0, 0], [HUB_X + 0.9, 0, 0], 1.75, 1.75, 14, true)
for (const s of [-1, 1]) {
  tube(grey, [s * HUB_X, 0, 0], [s * (HUB_X + 0.9), 0, 0], 2.7, 2.7, 14, true)
  for (let k = 0; k < 28; k++) {
    // The two sides' spokes are staggered half a pitch, as the cable fans are.
    const t = (k + (s > 0 ? 0.5 : 0)) / 28 * TAU
    tube(white, wheel(2.4, t, s * (HUB_X + 0.45)), wheel(R_RIM - 1.1, t, s * 1.0), 0.32, 0.32, 4, false)
  }
}

// --- Cabin brackets, on the rim -------------------------------------------------
const brackets = new Part()
for (let k = 0; k < 28; k++) {
  const t = k / 28 * TAU
  tube(brackets, wheel(R_RIM + 0.6, t), wheel(R_CAB - CAB + 0.3, t), 0.9, 0.7, 6, false)
}

// --- One cabin: a sphere, white above and below a glass band ---------------------
{
  const SEGS = 12
  const ring = (phi: number) => ({
    p: Array.from({ length: SEGS }, (_, i) => {
      const a = i / SEGS * TAU
      return [CAB * Math.cos(phi) * Math.cos(a), CAB * Math.cos(phi) * Math.sin(a), CAB * Math.sin(phi)] as V3
    }),
    n: Array.from({ length: SEGS }, (_, i) => {
      const a = i / SEGS * TAU
      return [Math.cos(phi) * Math.cos(a), Math.cos(phi) * Math.sin(a), Math.sin(phi)] as V3
    }),
  })
  const deg = Math.PI / 180
  const lats = [-60, -38, -18, 8, 32, 60].map((d) => d * deg)
  for (let k = 0; k < lats.length - 1; k++) {
    const a = ring(lats[k]), b = ring(lats[k + 1])
    // The glass runs from just below the middle to above it, as on the real cabins.
    const part = k === 2 || k === 3 ? cabGlass : cabWhite
    for (let i = 0; i < SEGS; i++) {
      const j = (i + 1) % SEGS
      tri(part, [a.p[i], a.p[j], b.p[j]], [a.n[i], a.n[j], b.n[j]])
      tri(part, [a.p[i], b.p[j], b.p[i]], [a.n[i], b.n[j], b.n[i]])
    }
  }
  for (const [phi, pole] of [[lats[0], -1], [lats[lats.length - 1], 1]] as [number, number][]) {
    const r = ring(phi), top: V3 = [0, 0, pole * CAB], up: V3 = [0, 0, pole]
    for (let i = 0; i < SEGS; i++) tri(cabWhite, [r.p[i], r.p[(i + 1) % SEGS], top], [r.n[i], r.n[(i + 1) % SEGS], up])
  }
}

// --- Static support: spindle, two A-frames, the backstay -------------------------
for (const s of [-1, 1]) {
  // Bearing housings at the spindle ends, where the legs meet.
  tube(housings, [s * (HUB_X + 1.0), 0, H], [s * (SPINDLE + 1.4), 0, H], 2.6, 2.6, 14)
  for (const n of [-1, 1]) {
    const foot: V3 = [s * 7.5, n * 23, 0]
    tube(legs, [s * SPINDLE, n * 1.2, H - 1.5], foot, 1.35, 1.9, 12, false)
    // A footing collar, so the slanted tube's end never shows above ground.
    tube(legs, [foot[0], foot[1], -0.5], [foot[0], foot[1], 2.6], 2.5, 2.3, 12)
  }
}
{
  const top: V3 = [SPINDLE + 0.5, 0, H - 1], foot: V3 = [90, 0, 0]
  tube(legs, top, foot, 1.35, 1.9, 12, false)
  tube(legs, [90, 0, -0.5], [90, 0, 3], 2.5, 2.3, 12)
}

// --- Materials ---------------------------------------------------------------------
// Painted white steel and white cabins, as in every daylight photo; the
// cabin glass reads dark blue-grey; the bearing housings a mid grey.
const STEEL: MaterialSpec = finish('white-steel', 0xe8e6e1, 0.6)
const GLASS: MaterialSpec = PALETTE.window
const GREY: MaterialSpec = PALETTE.roof

// --- Motion --------------------------------------------------------------------------
const LOOP = 150
const KEYS = 56
const times = Array.from({ length: KEYS + 1 }, (_, i) => (i / KEYS) * LOOP)
const turned = times.map((_, i) => (i / KEYS) * TAU)
const AXLE: V3 = [1, 0, 0]
const wheelTurn: Quat[] = turned.map((a) => axisAngle(AXLE, -a))
const plumb: Quat[] = turned.map((a) => axisAngle(AXLE, a))

const nodes: NodeSpec[] = [{
  name: 'wheel',
  translation: [0, 0, H],
  parts: [{ part: white, material: STEEL }, { part: brackets, material: STEEL }, { part: grey, material: GREY }],
}]
const channels: ChannelSpec[] = [{ node: 0, path: 'rotation', values: wheelTurn }]
for (let k = 0; k < 28; k++) {
  nodes.push({
    name: `cabin-${k + 1}`, parent: 0, translation: wheel(R_CAB, k / 28 * TAU),
    parts: [{ part: cabWhite, material: STEEL }, { part: cabGlass, material: GLASS }],
  })
  channels.push({ node: nodes.length - 1, path: 'rotation', values: plumb })
}

const parts = [{ part: legs, material: STEEL }, { part: housings, material: GREY }]

const drawn = new Map<string, number>()
for (const { part, material } of [...parts, ...nodes.flatMap((n) => n.parts)])
  drawn.set(material.name, (drawn.get(material.name) ?? 0) + part.triangles)
const triangles = [...drawn.values()].reduce((a, b) => a + b, 0)
console.log([...drawn].map(([name, n]) => `${name}: ${n}`).join('\n'))
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('High Roller', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: 167.6, bearing: 0,
}, { nodes, animation: { name: 'turn', times, channels } })
await Bun.write(new URL('../models/lv-high-roller.glb', import.meta.url), glb)
console.log(`lv-high-roller.glb: ${triangles} triangles, ${glb.length} bytes, ${LOOP} s a turn`)
