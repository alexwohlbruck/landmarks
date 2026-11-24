/**
 * Slingshot (Sling Shot), Luna Park's reverse-bungee ride, Scream Zone,
 * Coney Island: procedural, CC0-1.0.
 * bun generators/nyc-slingshot.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the OSM
 * node node/8816101426 (attraction=amusement_ride, name=Slingshot), taken as
 * the midpoint between the two masts, on the ground. Luna Park is level
 * here, so elevation 0.
 *
 * The ride: two tall, thin lattice masts with bungee cords from their heads
 * down to an open ball capsule held on a launch pad between them; released,
 * the ball is flung up between the masts. Luna Park's ride page
 * (lunaparknyc.com/rides/sling-shot/) gives "over 150 feet into the sky"
 * (46 m) for the riders.
 *
 * Evidence and what rests on it:
 *   masts' spacing, about 18 m, on an east-west line: Commons "Coney Island
 *     Brooklyn Sep 2019 17" (from the beach, due south: the masts stand well
 *     apart, side by side) and "Jul 2019 75" (from the boardwalk at West
 *     12th Street), scaled against the Wonder Wheel (46 m) beside them; the
 *     NAIP orthophoto shows two long mast shadows about 16 m apart. Estimated;
 *   mast height 46 m: the Sep 2019 17 photo against the Wonder Wheel at a
 *     similar distance (estimated, ±4 m), consistent with the published
 *     150 ft ride height;
 *   the masts' colour bands (teal-green foot, a long red shaft, an orange
 *     head), the small square head, the cords: "Sep 2019 02" (close crop)
 *     and "Jul 2019 75";
 *   the launch pad and the capsule's size (about 3 m): estimated from the
 *     ride type; no open photo shows the pad close up.
 * Lidar (USGS NY_NewYorkCity, 2017) would show the masts, but thin lattice
 * masts give too few returns to measure; not used.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   "Coney Island Brooklyn Sep 2019 02", "Sep 2019 17", "Jul 2019 75",
 *     Epicgenius, CC BY-SA 4.0
 * Look-only: none.
 *
 * Style: each lattice mast is a solid, slightly tapered square shaft in its
 * three paint bands (lattice would shimmer); the bungee cords are drawn
 * as two bold 0.3 m cords a side, far thicker than real, so the V reads.
 *
 * Doubts: the masts' exact height and spacing (from photos only); which way
 * the pad and the operator's booth face; whether the west mast is taller
 * (it looks so in both photos, which may be perspective; drawn equal, as
 * the ride type has equal masts); the capsule's colours.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const foot = new Part(), shaft = new Part(), head = new Part(), cord = new Part(), ball = new Part(), pad = new Part()

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A square ring centred on (cx, cy) at height z, half-width h, chamfered by c, CCW from above. */
function ring(cx: number, cy: number, z: number, h: number, c = 0): V3[] {
  if (c <= 0) return [[cx - h, cy - h, z], [cx + h, cy - h, z], [cx + h, cy + h, z], [cx - h, cy + h, z]]
  const k = h - c
  return [[cx - k, cy - h, z], [cx + k, cy - h, z], [cx + h, cy - k, z], [cx + h, cy + k, z], [cx + k, cy + h, z], [cx - k, cy + h, z], [cx - h, cy + k, z], [cx - h, cy - k, z]]
}
/** A closed prism between rings (same corner count), capped top and bottom. */
function prism(p: Part, rings: V3[][]) {
  p.loft(rings)
  p.cap(rings[rings.length - 1], true)
  p.cap(rings[0], false)
}
/** A box from (x0, y0, z0) to (x1, y1, z1). */
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
  const r = (z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  prism(p, [r(z0), r(z1)])
}
/** A round rod from a to b, smooth-shaded. */
function rod(p: Part, a: V3, b: V3, r: number, sides = 6) {
  const ax = unit(sub(b, a)), ref: V3 = Math.abs(ax[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const u = unit(cross(ax, ref)), v = cross(ax, u)
  for (let k = 0; k < sides; k++) {
    const t0 = (k / sides) * 2 * Math.PI, t1 = ((k + 1) / sides) * 2 * Math.PI
    const d0 = add(mul(u, Math.cos(t0)), mul(v, Math.sin(t0))), d1 = add(mul(u, Math.cos(t1)), mul(v, Math.sin(t1)))
    const a0 = add(a, mul(d0, r)), a1 = add(a, mul(d1, r)), b0 = add(b, mul(d0, r)), b1 = add(b, mul(d1, r))
    p.tri(a0, a1, b1, undefined, undefined, undefined, [d0, d1, d1])
    p.tri(a0, b1, b0, undefined, undefined, undefined, [d0, d1, d0])
  }
}
/** A UV sphere, smooth-shaded. */
function sphere(p: Part, c: V3, r: number, seg = 12, rings = 8) {
  const at = (i: number, j: number): V3 => {
    const th = (j / rings) * Math.PI, ph = (i / seg) * 2 * Math.PI
    return [Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th)]
  }
  for (let j = 0; j < rings; j++) for (let i = 0; i < seg; i++) {
    const n00 = at(i, j), n10 = at(i + 1, j), n01 = at(i, j + 1), n11 = at(i + 1, j + 1)
    const P = (n: V3) => add(c, mul(n, r))
    if (j > 0) p.tri(P(n00), P(n01), P(n10), undefined, undefined, undefined, [n00, n01, n10])
    if (j < rings - 1) p.tri(P(n10), P(n01), P(n11), undefined, undefined, undefined, [n10, n01, n11])
  }
}

// ------------------------------------------------------------- the masts ---
const SPAN = 18, H = 46
const FOOT_TOP = 14, SHAFT_TOP = 33 // bands at about 30% and 71% of the height, as in Sep 2019 02
const halfAt = (z: number) => 0.75 - (0.3 * z) / H // 1.5 m wide at the foot, 0.9 m at the head
for (const x of [-SPAN / 2, SPAN / 2]) {
  const r = (z: number) => ring(x, 0, z, halfAt(z), 0.18)
  // A concrete footing, then the three paint bands.
  box(pad, x - 1.6, -1.6, 0, x + 1.6, 1.6, 0.6)
  foot.loft([r(0.6), r(FOOT_TOP)])
  shaft.loft([r(FOOT_TOP), r(SHAFT_TOP)])
  head.loft([r(SHAFT_TOP), r(H - 1.4)])
  // The head: a square block the cords hang from, a little wider than the mast.
  prism(head, [ring(x, 0, H - 1.4, 0.85, 0.15), ring(x, 0, H, 0.85, 0.15)])
}

// ----------------------------------------------- the pad and the capsule ---
// The launch pad between the masts, with the ball held on it.
box(pad, -3.2, -2.4, 0, 3.2, 2.4, 0.8)
const BR = 1.5, BC: V3 = [0, 0, 0.8 + BR + 0.2]
sphere(ball, BC, BR)
// The cradle under the ball.
box(pad, -0.9, -0.9, 0.8, 0.9, 0.9, 1.15)

// --------------------------------------------------------- bungee cords ---
// Two cords a side, from the mast head down to the ball's sides: the V.
for (const s of [-1, 1]) for (const dy of [-0.55, 0.55]) {
  rod(cord, [s * (SPAN / 2 - 0.4), dy, H - 0.8], [s * BR * 0.8, dy * 0.8, BC[2] + 0.3], 0.16, 5)
}

// ---------------------------------------------------------------- output ---
const parts = [
  { part: foot, material: finish('slingshot-teal', 0x4f9a93) },
  { part: shaft, material: finish('slingshot-red', 0xc8453d) },
  { part: head, material: finish('slingshot-orange', 0xe39a3b) },
  { part: cord, material: finish('slingshot-cord', 0x4a4f57) },
  { part: ball, material: finish('slingshot-capsule', 0x4f6fa8) },
  { part: pad, material: PALETTE.roof },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Slingshot', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: H, osm: 'node/8816101426',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-slingshot.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
