/**
 * "Connie": Lockheed L-1649A Starliner N8083H "Star of America" (1958), in
 * 1950s TWA livery, parked on the apron behind the TWA Flight Center as the
 * TWA Hotel's cocktail lounge since 2019 — original procedural geometry,
 * CC0-1.0.
 * bun generators/nyc-twa-hotel-connie.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * apron. The model's nose points +y. Placed at bearing -3.5, parallel to
 * the Flight Center's axis: the photos show the aircraft broadside to the
 * Flight Center's airside face, nose to the north (jagc, 2019), and the
 * Dec 2025 photos taken head-on from the north show the south flight tube
 * running across the frame behind it (fc59, fc64). Anchor: OSM node
 * 6898319071 (amenity=bar, "The Connie"), -73.7771134, 40.6456295, taken as
 * the aircraft's centre (estimated: the node marks the bar, not the
 * airframe). There is no OSM outline for the aircraft, so it replaces
 * nothing.
 *
 * A small, famous object (STYLE.md): bold simple masses at real size.
 *  1. The long, curved "dolphin" fuselage, its nose drooping and its tail
 *     rising, white above and bare aluminium below, with a red cheatline.
 *  2. The triple tail: three oval fins on the tailplane, white with two red
 *     bands near the top.
 *  3. The long, slender wing with four engines and propellers.
 *  4. The black radome nose and the tall landing gear.
 *
 * Published (L-1649A Starliner, Wikipedia "Lockheed L-1649 Starliner"):
 * length 35.42 m, span 45.72 m, height 7.09 m to the fin tops, three-blade
 * propellers 4.6 m across (Wright R-3350 turbo-compounds).
 * Estimated from the photos against those: fuselage 3.7 m across, its belly
 * 1.6 m off the ground; the axis drooping 0.5 m at the nose and rising
 * 1.3 m at the tail; wing chord 5.8 m at the root and 1.8 m at the tip,
 * 3 degrees of dihedral; engines at 6.6 and 12.8 m out; tailplane 13 m
 * across; fins 3.4 m in chord and 4.2 m tall, centred 15.6 m aft.
 * Left out: the "TRANS WORLD AIR LINES" and "TWA" titles (1.5 m letters on
 * a 35 m aircraft are a few pixels at 200 px), the flag, the boarding
 * stairs and the ground equipment. The cabin windows are a row of slate
 * panels just above the cheatline, slightly oversized so they read, and
 * the cockpit has a windscreen band; window count and pitch are estimated
 * from jagc and cfwd.
 *
 * Photos (evidence, Wikimedia Commons):
 *  jagc  "Constellation Starliner Airplane at TWA Hotel JFK Airport, New York
 *        City 20190521-jag9889.jpg", Jag9889, CC BY-SA 4.0 — broadside,
 *        livery and tail bands.
 *  fc59, fc63, fc64 "TWA Flight Center Dec 2025 59/63/64.jpg", Epicgenius,
 *        CC BY-SA 4.0 — head-on, parked heading.
 *  cfwd, caft, cport "TWA Connie @ TSQ (4)/(6)/(5) ... jeh.jpg",
 *        Jim.henderson, CC BY-SA 4.0 — the fuselage and cheatline close up.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save } from './atl-flatiron-building'

const white = new Part(), metal = new Part(), red = new Part(), dark = new Part()

const deg = Math.PI / 180

// ── Fuselage: rings along y (nose +y), each [y, radius, centre height] ──
const ST: [number, number, number][] = [
  [17.71, 0.15, 3.0], [17.2, 0.75, 3.05], [16.4, 1.2, 3.15], [15.0, 1.6, 3.3], [12.5, 1.82, 3.42], [8.0, 1.86, 3.5],
  [0, 1.86, 3.55], [-5, 1.74, 3.65], [-9, 1.45, 3.85], [-12.5, 1.05, 4.15], [-15.5, 0.65, 4.45], [-17.71, 0.18, 4.75],
]
// Angles round the ring, degrees from the right side, counter-clockwise
// looking forward. The cheatline is the band from -12 to 4 degrees on
// either side, white above it and bare metal below.
const ANG = [-90, -55, -25, -12, 4, 25, 55, 90, 125, 155, 176, 192, 205, 235]
const ringPt = ([y, r, zc]: [number, number, number], a: number): V3 => [r * Math.cos(a * deg), y, zc + r * Math.sin(a * deg)]
const bandOf = (a0: number, a1: number) => {
  const s = Math.sin(((a0 + a1) / 2) * deg)
  return s > 0.08 ? white : s > -0.2 ? red : metal
}
for (let k = 0; k < ST.length - 1; k++) {
  // The two foremost rings are the black radome.
  for (let i = 0; i < ANG.length; i++) {
    const a0 = ANG[i], a1 = ANG[(i + 1) % ANG.length] + (i + 1 === ANG.length ? 360 : 0)
    const p = k < 1 ? dark : bandOf(a0, a1)
    // Rings run nose to tail (y falling), so this winding faces out.
    p.quad(ringPt(ST[k], a1), ringPt(ST[k + 1], a1), ringPt(ST[k + 1], a0), ringPt(ST[k], a0))
  }
}

/** A flat slab with outline `pts` (in the x–y plane at heights from `z`) and thickness `t`. */
function slab(p: Part, pts: [number, number, number][], t: number) {
  const top = pts.map(([x, y, z]) => [x, y, z + t / 2] as V3), bot = pts.map(([x, y, z]) => [x, y, z - t / 2] as V3)
  const n = pts.length
  for (let i = 1; i < n - 1; i++) { p.tri(top[0], top[i], top[i + 1]); p.tri(bot[0], bot[i + 1], bot[i]) }
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; p.quad(bot[i], bot[j], top[j], top[i]) }
}

// ── Wing: low, slightly tapered, 3 degrees of dihedral ──
const SPAN = 45.72 / 2, WZ = 2.3, DIH = Math.tan(3 * deg)
const wz = (x: number) => WZ + Math.abs(x) * DIH
for (const s of [-1, 1]) {
  // Outline counter-clockwise from above for s = 1; mirrored for s = -1.
  const pts: [number, number, number][] = [[1.6, 3.0, wz(1.6)], [SPAN, 0.3, wz(SPAN)], [SPAN, -1.5, wz(SPAN)], [1.6, -2.8, wz(1.6)]]
  const m = pts.map(([x, y, z]) => [s * x, y, z] as [number, number, number])
  slab(metal, s > 0 ? m : m.reverse(), 0.45)
}

// ── Tailplane and the three fins ──
const TY = -15.6
for (const s of [-1, 1]) {
  const pts: [number, number, number][] = [[0.3, TY + 1.9, 4.45], [6.5, TY + 0.9, 4.45], [6.5, TY - 1.3, 4.45], [0.3, TY - 1.6, 4.45]]
  const m = pts.map(([x, y, z]) => [s * x, y, z] as [number, number, number])
  slab(metal, s > 0 ? m : m.reverse(), 0.3)
}
// A fin is an ellipse in the y–z plane, sliced into horizontal bands so the
// two red bands near the top are their own colour.
const FC = 5.0, FH = 2.1, FA = 1.7 // fin centre height, semi-height, semi-chord
const half = (z: number) => FA * Math.sqrt(Math.max(0, 1 - ((z - FC) / FH) ** 2))
const LEVELS = [2.95, 3.4, 4.0, 4.6, 5.2, 5.75, 6.05, 6.4, 6.6, 6.92, 7.09]
for (const x of [-6.5, 0, 6.5]) {
  for (let k = 0; k < LEVELS.length - 1; k++) {
    const z0 = LEVELS[k], z1 = LEVELS[k + 1], h0 = Math.max(half(z0), 0.25), h1 = Math.max(half(z1), 0.25)
    const p = (z0 >= 6.05 && z1 <= 6.4) || (z0 >= 6.6 && z1 <= 6.92) ? red : white
    const t = 0.14, a: V3 = [x, TY - h0, z0], b: V3 = [x, TY + h0, z0], c: V3 = [x, TY + h1, z1], d: V3 = [x, TY - h1, z1]
    const off = (v: V3, dx: number): V3 => [v[0] + dx, v[1], v[2]]
    p.quad(off(a, t), off(b, t), off(c, t), off(d, t)) // faces +x
    p.quad(off(b, -t), off(a, -t), off(d, -t), off(c, -t)) // faces -x
    p.quad(off(b, -t), off(b, t), off(c, t), off(c, -t)) // leading edge
    p.quad(off(a, t), off(a, -t), off(d, -t), off(d, t)) // trailing edge
    if (k === LEVELS.length - 2) p.quad(off(d, t), off(c, t), off(c, -t), off(d, -t)) // top
    if (k === 0) p.quad(off(a, -t), off(b, -t), off(b, t), off(a, t)) // bottom
  }
}

// ── Engines: nacelles, spinners and three-blade propellers ──
const nacelle = (x: number) => {
  const zc = wz(x) - 0.1
  const R: [number, number][] = [[5.9, 0.35], [5.4, 0.8], [4.6, 0.9], [0.5, 0.85], [-2.6, 0.55], [-4.2, 0.12]]
  const N = 8
  const P = (k: number, i: number): V3 => { const a = (i / N) * 2 * Math.PI; return [x + R[k][1] * Math.cos(a), R[k][0], zc + R[k][1] * Math.sin(a)] }
  for (let k = 0; k < R.length - 1; k++) for (let i = 0; i < N; i++) metal.quad(P(k, i + 1), P(k + 1, i + 1), P(k + 1, i), P(k, i))
  // Spinner cap and the three blades, one pointing down-left as parked.
  for (let i = 0; i < N; i++) metal.tri(P(0, i + 1), P(0, i), [x, 6.25, zc])
  for (let b = 0; b < 3; b++) {
    const a = (b * 120 + 30) * deg, r0 = 0.35, r1 = 2.3, w = 0.17
    const ux = Math.cos(a), uz = Math.sin(a), vx = -uz, vz = ux
    const q = (r: number, s: number, y: number): V3 => [x + ux * r + vx * s, y, zc + uz * r + vz * s]
    dark.quad(q(r0, -w, 6.0), q(r1, -w, 6.0), q(r1, w, 6.0), q(r0, w, 6.0))
    dark.quad(q(r0, w, 5.88), q(r1, w, 5.88), q(r1, -w, 5.88), q(r0, -w, 5.88))
  }
}
for (const x of [-12.8, -6.6, 6.6, 12.8]) nacelle(x)

// ── Landing gear: struts and paired wheels ──
const block = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) =>
  slab(p, [[x0, y0, (z0 + z1) / 2], [x1, y0, (z0 + z1) / 2], [x1, y1, (z0 + z1) / 2], [x0, y1, (z0 + z1) / 2]], z1 - z0)
for (const x of [-6.6, 6.6]) {
  block(metal, x - 0.15, x + 0.15, -0.15, 0.15, 0.5, wz(x) - 0.4)
  for (const dx of [-0.45, 0.45]) block(dark, x + dx - 0.2, x + dx + 0.2, -0.55, 0.55, 0, 1.1)
}
block(metal, -0.12, 0.12, 12.85, 13.15, 0.4, 1.9)
for (const dx of [-0.25, 0.25]) block(dark, dx - 0.15, dx + 0.15, 12.6, 13.4, 0, 0.8)

// ── Windows: the cabin row just above the cheatline, and the cockpit ──
// Flat slate panels on the fuselage facets, 3 cm proud of the skin. The
// real cabin windows are about 0.4 m round at roughly 1 m pitch; these are
// a little larger (0.55 × 0.42 m) so the row reads as a dotted line at
// 200 px. They glow at night, as the lounge does.
const win = new Part()
const zcAt = (y: number) => {
  for (let k = 0; k < ST.length - 1; k++) if (y <= ST[k][0] && y >= ST[k + 1][0]) {
    const f = (ST[k][0] - y) / (ST[k][0] - ST[k + 1][0])
    return ST[k][2] + (ST[k + 1][2] - ST[k][2]) * f
  }
  return ST[0][2]
}
/** A point on the facet between rings k and k+1 and angles a0..a1: s along the rings, t round. */
const onFacet = (k: number, a0: number, a1: number, s: number, t: number, mirror: boolean): V3 => {
  const lerp3 = (p: V3, q: V3, f: number): V3 => [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f, p[2] + (q[2] - p[2]) * f]
  const p = lerp3(lerp3(ringPt(ST[k], a0), ringPt(ST[k + 1], a0), s), lerp3(ringPt(ST[k], a1), ringPt(ST[k + 1], a1), s), t)
  const zc = zcAt(p[1]), r = Math.hypot(p[0], p[2] - zc) || 1
  const q: V3 = [p[0] + (0.03 * p[0]) / r, p[1], p[2] + (0.03 * (p[2] - zc)) / r]
  return mirror ? [-q[0], q[1], q[2]] : q
}
/** A window panel wound to face away from the fuselage axis. */
const pane = (q: V3[]) => {
  const c = q.reduce((m, v) => [m[0] + v[0] / 4, m[1] + v[1] / 4, m[2] + v[2] / 4] as V3, [0, 0, 0] as V3)
  const out: V3 = [c[0], 0, c[2] - zcAt(c[1])]
  const e1: V3 = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], e2: V3 = [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]]
  const n: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0) win.quad(q[0], q[1], q[2], q[3])
  else win.quad(q[3], q[2], q[1], q[0])
}
const ringOf = (y: number) => ST.findIndex((r, k) => k < ST.length - 1 && y <= r[0] && y >= ST[k + 1][0])
// Cabin: the band from 4 to 25 degrees, windows in its lower part (about 6–13 degrees).
for (let y = 11.2; y > -8.6; y -= 1.05) {
  // A window that straddles a ring is split there, one piece on each facet.
  const k0 = ringOf(y), k1 = ringOf(y - 0.55)
  const pieces: [number, number][] = k0 === k1 ? [[y, y - 0.55]] : [[y, ST[k1][0]], [ST[k1][0], y - 0.55]]
  for (const [y0, y1] of pieces) {
    const k = ringOf((y0 + y1) / 2), L = ST[k][0] - ST[k + 1][0], s0 = (ST[k][0] - y0) / L, s1 = (ST[k][0] - y1) / L
    for (const m of [false, true]) pane([onFacet(k, 4, 25, s0, 0.1, m), onFacet(k, 4, 25, s1, 0.1, m), onFacet(k, 4, 25, s1, 0.42, m), onFacet(k, 4, 25, s0, 0.42, m)])
  }
}
// Cockpit: the windscreen across the top front, side windows either side.
for (const [a0, a1, t0, t1] of [[55, 90, 0.08, 1], [90, 125, 0, 0.92], [25, 55, 0.45, 0.95], [125, 155, 0.05, 0.55]] as const) {
  pane([onFacet(2, a0, a1, 0.25, t0, false), onFacet(2, a0, a1, 0.25, t1, false), onFacet(2, a0, a1, 0.75, t1, false), onFacet(2, a0, a1, 0.75, t0, false)])
}

await save('nyc-twa-hotel-connie', 'Connie (TWA Hotel)', [
  { part: white, material: finish('connie-white', 0xf1f0ec) },
  { part: metal, material: finish('connie-aluminium', 0xbfc4c8) },
  { part: red, material: finish('connie-red', 0xc4382f) },
  { part: dark, material: finish('connie-black', 0x4a4f57) },
  { part: win, material: PALETTE.window },
], { height: 7.09, anchor: [40.6456295, -73.7771134], bearing: -3.5 })
