/**
 * Golden Zephyr, Paradise Gardens Park, Disney California Adventure —
 * procedural, CC0-1.0, no textures.
 * bun generators/dlr-golden-zephyr.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * centre of the ride. Round, so bearing 0.
 *
 * A circle swing after Harry Traver's: a red lattice mast on a round
 * platform at the edge of Paradise Bay, a striped umbrella part-way up, and
 * at the top a hexagonal frame from which six silver Buck Rogers rocket
 * ships hang on cables. They swing out over the bay as the frame turns.
 *
 * Evidence
 * - OSM (measured): way/342771469, the ride's round platform, building:part,
 *   height 4, 20 m across. The anchor is its centre.
 * - Published (Wikipedia, "Golden Zephyr"): six rocket ships, D. H. Morgan
 *   Manufacturing, a Traver Circle-Swing design. No height is published.
 * - Photos (Wikimedia Commons), heights scaled off the 20 m platform:
 *     "Disney California Adventure Golden Zephyr - panoramio.jpg", Steve D, CC BY-SA 3.0 — from the beach, side on
 *     "Golden Zephyr.jpg", Freddo, CC BY-SA 4.0 — mast, umbrella, frame
 *     "Disney California Adventure (52337041970).jpg", Jeremy Thompson, CC BY 2.0 — from across the bay
 *     "Golden Zephyr from Jellyfish.jpg", LordBleen, public domain — from above, ships at rest
 *
 * Estimated: the mast (about 21 m to the frame, 23.5 m to the tip), the
 * frame's span (14 m), the drum under the platform (12 m across), the ships
 * (4.6 m long). The lattice mast is drawn solid and the cables as slim bars,
 * one per ship, so the ships don't float. The rotor (frame, cables, ships) is
 * its own node about the mast, ready to turn, but ships static, at rest.
 */
import { Part, cross, sub, writeGlb, type NodeSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const red = new Part(), deck = new Part(), stripe = new Part(), sun = new Part()
const rotorRed = new Part(), silver = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

function tri(p: Part, v: V3[], n: V3[]) {
  const f = cross(sub(v[1], v[0]), sub(v[2], v[0]))
  if (dot(f, add(add(n[0], n[1]), n[2])) >= 0) p.tri(v[0], v[1], v[2], undefined, undefined, undefined, n)
  else p.tri(v[0], v[2], v[1], undefined, undefined, undefined, [n[0], n[2], n[1]])
}
type Profile = [number, number][]
const rect = (a: number, b: number): Profile => [[-a, -b], [a, -b], [a, b], [-a, b]]
const circle = (r: number, n: number): Profile => Array.from({ length: n }, (_, i) => [r * Math.cos(i / n * TAU), r * Math.sin(i / n * TAU)])
/** A straight member from a to b, section s0 tapering to s1, smooth round the section if `smooth`. */
function beam(p: Part, a: V3, b: V3, s0: Profile, s1: Profile, caps = true, smooth = false) {
  const T = unit(sub(b, a))
  let N = cross([0, 0, 1], T)
  if (Math.hypot(...N) < 1e-6) N = [1, 0, 0]
  N = unit(N)
  const B = unit(cross(T, N))
  const at = (c: V3, q: [number, number]) => add(c, add(mul(N, q[0]), mul(B, q[1])))
  const m = s0.length
  const nrm = (q: [number, number], r: [number, number]): V3 => unit(add(mul(N, r[1] - q[1]), mul(B, -(r[0] - q[0]))))
  const rad = (q: [number, number]): V3 => unit(add(mul(N, q[0]), mul(B, q[1])))
  for (let k = 0; k < m; k++) {
    const l = (k + 1) % m
    const n0 = smooth ? rad(s0[k]) : nrm(s0[k], s0[l]), n1 = smooth ? rad(s0[l]) : n0
    tri(p, [at(a, s0[k]), at(a, s0[l]), at(b, s1[l])], [n0, n1, n1])
    tri(p, [at(a, s0[k]), at(b, s1[l]), at(b, s1[k])], [n0, n1, n0])
  }
  if (caps) {
    for (let k = 1; k < m - 1; k++) tri(p, [at(a, s0[0]), at(a, s0[k]), at(a, s0[k + 1])], [mul(T, -1), mul(T, -1), mul(T, -1)])
    for (let k = 1; k < m - 1; k++) tri(p, [at(b, s1[0]), at(b, s1[k]), at(b, s1[k + 1])], [T, T, T])
  }
}
/** A flat disc or cone ring between radii at heights; smooth-ish facets. */
function cone(p: Part, r0: number, z0: number, r1: number, z1: number, seg = 16) {
  for (let k = 0; k < seg; k++) {
    const a = k / seg * TAU, b = (k + 1) / seg * TAU
    const P = (r: number, t: number, z: number): V3 => [r * Math.cos(t), r * Math.sin(t), z]
    const n = (t: number): V3 => unit([(z1 - z0) * Math.cos(t), (z1 - z0) * Math.sin(t), r0 - r1])
    tri(p, [P(r0, a, z0), P(r0, b, z0), P(r1, b, z1)], [n(a), n(b), n(b)])
    tri(p, [P(r0, a, z0), P(r1, b, z1), P(r1, a, z1)], [n(a), n(b), n(a)])
  }
}

// --- Platform: a drum carrying the round deck --------------------------------
const DECK = 4
cone(deck, 6, 0, 6, DECK - 0.6)
cone(deck, 6, DECK - 0.6, 10, DECK - 0.6)       // underside of the deck
cone(deck, 10, DECK - 0.6, 10, DECK)            // deck edge
cone(deck, 10, DECK, 1.5, DECK + 0.25)          // deck top

// --- Mast -----------------------------------------------------------------------
const TOP = 21, TIP = 23.5
beam(red, [0, 0, DECK], [0, 0, TOP + 0.6], rect(1.0, 1.0), rect(0.6, 0.6))
beam(red, [0, 0, TOP + 0.6], [0, 0, TIP], circle(0.25, 6), circle(0.08, 6), false)
// The striped umbrella part-way up.
cone(stripe, 4.8, 7.0, 1.2, 8.1)
cone(stripe, 1.0, 6.7, 4.8, 7.0)
// Gold sunburst medallions down the mast, on all four sides.
for (const z of [9.5, 12.5, 15.5, 18.5]) for (let s = 0; s < 4; s++) {
  const t = s * Math.PI / 2, w = 0.8 * (1 - (z - DECK) / 40)
  const n: V3 = [Math.cos(t), Math.sin(t), 0], u: V3 = [-Math.sin(t), Math.cos(t), 0]
  const c = add(mul(n, 1.0 - (z - DECK) * 0.4 / (TOP + 0.6 - DECK) + 0.06), [0, 0, z])
  const pts: V3[] = Array.from({ length: 12 }, (_, i) => {
    const r = i % 2 ? w * 0.6 : w
    return add(c, add(mul(u, r * Math.cos(i / 12 * TAU)), [0, 0, r * Math.sin(i / 12 * TAU)]))
  })
  for (let i = 0; i < 12; i++) tri(sun, [c, pts[i], pts[(i + 1) % 12]], [n, n, n])
}

// --- Rotor: hexagonal frame, cables and ships, authored about the mast axis ----
const R_FRAME = 7, ZF = TOP - 0.4 // relative to the node at z = 0 on the axis
const hex = (i: number, z: number): V3 => [R_FRAME * Math.cos(i / 6 * TAU), R_FRAME * Math.sin(i / 6 * TAU), z]
for (let i = 0; i < 6; i++) {
  beam(rotorRed, [0, 0, ZF + 0.4], hex(i, ZF - 0.6), rect(0.22, 0.22), rect(0.18, 0.18))          // arm
  beam(rotorRed, hex(i, ZF - 0.6), hex(i + 1, ZF - 0.6), rect(0.18, 0.18), rect(0.18, 0.18))    // hexagon
  beam(rotorRed, hex(i, ZF - 0.6), [0, 0, TIP - 0.8], rect(0.12, 0.12), rect(0.12, 0.12), false) // stay to the masthead
  beam(rotorRed, hex(i, ZF - 0.6), [0, 0, ZF - 4.5], rect(0.12, 0.12), rect(0.12, 0.12), false)  // lower brace
}
// Six ships, hanging at rest just above the deck, nose along the turn.
const SHIP_R = 8.2, SHIP_Z = DECK + 2.2
for (let i = 0; i < 6; i++) {
  const t = (i + 0.5) / 6 * TAU
  const c: V3 = [SHIP_R * Math.cos(t), SHIP_R * Math.sin(t), SHIP_Z]
  const fwd: V3 = [-Math.sin(t), Math.cos(t), 0]
  const nose = add(c, mul(fwd, 2.4)), tail = add(c, mul(fwd, -2.2))
  beam(silver, add(c, mul(fwd, -0.4)), add(c, mul(fwd, 1.5)), circle(0.85, 10), circle(0.75, 10), false, true)
  beam(silver, add(c, mul(fwd, 1.5)), nose, circle(0.75, 10), circle(0.08, 10), false, true)
  beam(silver, tail, add(c, mul(fwd, -0.4)), circle(0.5, 10), circle(0.85, 10), true, true)
  // Red tail fins: one up, two splayed.
  for (const d of [[0, 0, 1], [Math.cos(t) * 0.8, Math.sin(t) * 0.8, -0.6], [-Math.cos(t) * 0.8, -Math.sin(t) * 0.8, -0.6]] as V3[])
    beam(rotorRed, add(tail, mul(fwd, 0.5)), add(add(tail, mul(fwd, -0.2)), mul(unit(d), 1.3)), rect(0.4, 0.06), rect(0.2, 0.05))
  // Its cable, from the frame's corner above it.
  const top = [R_FRAME * 0.97 * Math.cos(t), R_FRAME * 0.97 * Math.sin(t), ZF - 0.6] as V3
  const k = 0.866 // the hexagon's edge midpoint sits at 0.866 R
  top[0] *= k / 0.97; top[1] *= k / 0.97
  beam(silver, top, add(c, [0, 0, 0.8]), rect(0.1, 0.1), rect(0.1, 0.1), false)
}

// ----------------------------------------------------------------------------------
// Colours from the photos: the red mast and frame, the silver ships, the
// orange striped umbrella and deck, gold medallions, a grey drum.
const RED = finish('zephyr-red', 0xc0473f)
const nodes: NodeSpec[] = [{
  name: 'rotor',
  translation: [0, 0, 0],
  parts: [{ part: rotorRed, material: RED }, { part: silver, material: finish('zephyr-silver', 0xd5d8dc, 0.4) }],
}]
const parts = [
  { part: red, material: RED },
  { part: deck, material: PALETTE.roof },
  { part: stripe, material: finish('zephyr-orange', 0xe39a55) },
  { part: sun, material: finish('zephyr-gold', 0xe2be66) },
]
const triangles = [...parts, ...nodes[0].parts].reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Golden Zephyr', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: TIP, bearing: 0,
}, { nodes })
await Bun.write(new URL('../models/dlr-golden-zephyr.glb', import.meta.url), glb)
console.log(`dlr-golden-zephyr.glb: ${triangles} triangles, ${glb.length} bytes`)
