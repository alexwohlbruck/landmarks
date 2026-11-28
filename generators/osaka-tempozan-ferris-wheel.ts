/**
 * Tempozan Ferris Wheel (天保山大観覧車), Tempozan Harbor Village, Minato,
 * Osaka: procedural, CC0-1.0.
 * bun generators/osaka-tempozan-ferris-wheel.ts
 *
 * Writes two levels of detail in the same frame, both animated:
 * - models/osaka-tempozan-ferris-wheel.glb, the low model: the rim as two
 *   truss on each face (two chords and a zigzag web), 40 crossed spokes a face, the hub, the two lattice
 *   A-frames (each leg a three-chord column with lacing), the 60 gondolas;
 * - models/osaka-tempozan-ferris-wheel.detail.glb, from zoom 16: the rim as
 *   a real truss (outer and inner chords on both faces, zigzag web, ties
 *   across), 96 crossed spokes a face, denser lacing in the legs, rounder
 *   gondolas.
 *
 * Map frame: x along the wheel's plane, y along the axle, z up, metres; the
 * origin on the ground under the axle. OSM way/382746499 (attraction=
 * big_wheel) is a strip 103 m long and 4.5 m wide whose long sides run
 * 138.5/318.5 degrees: the wheel's plane. The placement's bearing (48.5)
 * turns the model's x to 138.5 degrees. The anchor is the strip's centre.
 *
 * Published (ja/en.wikipedia "天保山大観覧車"): 112.5 m tall, 100 m across,
 * 60 gondolas, opened 1997, a 15-minute ride; the LED lighting on the wheel
 * gives the next day's weather after dark (orange fine, green cloudy, blue
 * rain; a show of patterns between).
 *
 * From photos (scaled on the 100 m diameter):
 * - the rim: two faces about 3.2 m apart, each a truss of an outer and an
 *   inner chord about 2.4 m apart with a zigzag web (663highland's "02",
 *   Jason Zhang's upward view);
 * - the spokes: thin rods from the hub to the inner chords, alternately
 *   leaning ahead and behind so they cross in a lattice near the hub
 *   ("Grand ferris wheel ... 3", face-on);
 * - the gondolas: hung outside the rim on short arms, in arcs of colour
 *   round the wheel: red-orange, yellow, green and blue (the two
 *   see-through cabins are drawn like the rest);
 * - the support: on each side of the wheel a tall A-frame of white lattice
 *   legs from feet about 44 m apart in the wheel's plane to the axle, two
 *   central posts and two horizontal girders between the legs, the two
 *   A-frames splayed apart across the axle at their feet (そらみみ's
 *   "Grand ferris wheel" 1-3, from the street on both faces);
 * - white structure, silver-white rim.
 * Axle at 62.5 m: the rim's gondola arms at 49.7 m reach the published
 * 112.5 m; the lowest gondola clears the boarding station roof at about 11 m.
 *
 * Estimated: the rim depth and spacing, member sizes (drawn heavier than
 * real so they read), the legs' lattice and their feet, the gondola size
 * (2.5 x 2.2 x 2.7 m), the colour arcs' order (from three views). Left out:
 * the boarding station under the wheel (part of the market place's
 * building, left to the map), stairs, the hub machinery.
 *
 * It turns (experimental; STYLE.md "Animation"): the wheel is a node at the
 * axle, each gondola a child node at its pivot, turned back so it hangs
 * plumb. The real wheel turns once in 15 minutes; this loop is 90 s a turn,
 * as the Wonder Wheel's. Frame 0 is the static model.
 *
 * Night: the rim is the LED weather light: a `neon` material in a silver
 * white (#e4e8ec), so by day it reads as the white rim and at night it
 * glows white ("fine" is orange on the real wheel; the colour changes
 * nightly, so the neutral one is drawn). The legs and gondolas are unlit.
 *
 * Photos (Wikimedia Commons):
 * - "Grand ferris wheel of Tempozan Harbor Village.jpg", そらみみ, CC BY-SA 4.0 (legs, gondolas, from the street)
 * - "Grand ferris wheel of Tempozan Harbor Village 2.jpg", そらみみ, CC BY-SA 4.0 (spokes, rim, legs)
 * - "Grand ferris wheel of Tempozan Harbor Village 3.jpg", そらみみ, CC BY-SA 4.0 (face-on: spokes, A-frame)
 * - "Grand ferris wheel of Tempozan Harbor Village from Tempozan Park.jpg", そらみみ, CC BY-SA 4.0 (silhouette)
 * - "Tempozan giant wheel02s2048.jpg", 663highland, CC BY 2.5 (rim, colours)
 * - "Tempozan Giant Ferris Wheel upwards view.jpg", Jason Zhang, CC BY-SA 3.0 (rim truss, gondolas)
 * - "Ajigawa River and grand ferris wheel of Tempozan Harbor Village from Tempozan Ferry.jpg", そらみみ, CC BY-SA 4.0 (from the river)
 * Look-only: none.
 */
import { Part, axisAngle, cross, sub, writeGlb, type ChannelSpec, type MaterialSpec, type NodeSpec, type Quat, type V3 } from './mesh'
import { finish } from './palette'

const TAU = Math.PI * 2
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const lerpV = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

const H = 62.5      // axle height
const R_OUT = 47.6  // outer chord
const R_IN = 45.2   // inner chord
const R_ARM = 49.7  // gondola pivots
const FACE = 1.6    // rim faces from the mid-plane
const N_CARS = 60

/** A point on the wheel about the axle: radius r, angle t (0 = +x, π/2 = up), across y. */
const W = (r: number, t: number, y: number): V3 => [r * Math.cos(t), y, r * Math.sin(t)]

/** A quad wound to face the way its normals do. */
function face(p: Part, Q: V3[], N: V3[]) {
  const f = cross(sub(Q[1], Q[0]), sub(Q[2], Q[0]))
  const s = add(add(N[0], N[1]), add(N[2], N[3]))
  const [a, b, c, d] = dot(f, s) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(Q[a], Q[b], Q[c], undefined, undefined, undefined, [N[a], N[b], N[c]])
  p.tri(Q[a], Q[c], Q[d], undefined, undefined, undefined, [N[a], N[c], N[d]])
}
/** A straight member a→b, `sides`-sided prism of radius r (open ends). */
function member(p: Part, a: V3, b: V3, r: number, sides = 3, r1 = r, clamp = false) {
  const t = unit(sub(b, a))
  let u = Math.abs(t[2]) < 0.9 ? cross(t, [0, 0, 1]) : cross(t, [1, 0, 0])
  u = unit(u)
  const v = unit(cross(t, u))
  const off = (k: number, rr: number): V3 => {
    const ang = (k / sides) * TAU + (sides === 4 ? Math.PI / 4 : 0)
    return add(mul(u, rr * Math.cos(ang)), mul(v, rr * Math.sin(ang)))
  }
  const g = (q: V3): V3 => (clamp ? [q[0], q[1], Math.max(0, q[2])] : q) // legs: nothing below the ground
  for (let k = 0; k < sides; k++) {
    const n0 = unit(off(k, 1)), n1 = unit(off(k + 1, 1))
    const Q = [g(add(a, off(k, r))), g(add(a, off(k + 1, r))), g(add(b, off(k + 1, r1))), g(add(b, off(k, r1)))]
    if (clamp && Q.filter((q) => q[2] === 0).length >= 3) continue // flattened into the ground
    face(p, Q, [n0, n1, n1, n0])
  }
}
/** A closed ring band round the axle at face y: radial depth d, width w, chamfered c. */
function band(p: Part, r: number, y: number, d: number, w: number, c: number, seg: number) {
  const prof: Array<[number, number]> = c === 0 ? [[-d / 2, -w / 2], [d / 2, -w / 2], [d / 2, w / 2], [-d / 2, w / 2]] : [[-d / 2 + c, -w / 2], [d / 2 - c, -w / 2], [d / 2, -w / 2 + c], [d / 2, w / 2 - c], [d / 2 - c, w / 2], [-d / 2 + c, w / 2], [-d / 2, w / 2 - c], [-d / 2, -w / 2 + c]]
  const m = prof.length
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * TAU, t1 = ((i + 1) / seg) * TAU
    for (let k = 0; k < m; k++) {
      const [a0, b0] = prof[k], [a1, b1] = prof[(k + 1) % m]
      const P = (t: number, a: number, b: number) => W(r + a, t, y + b)
      const en = (t: number): V3 => {
        // normal of the profile edge, a radial/axial mix
        const nr = b1 - b0, ny = -(a1 - a0)
        const l = Math.hypot(nr, ny) || 1
        return unit(add(mul([Math.cos(t), 0, Math.sin(t)], -nr / l), [0, -ny / l, 0]))
      }
      face(p, [P(t0, a0, b0), P(t0, a1, b1), P(t1, a1, b1), P(t1, a0, b0)], [en(t0), en(t0), en(t1), en(t1)])
    }
  }
}
/** A drum along the axle (y), radius r, from y0 to y1, capped. */
function drum(p: Part, r: number, y0: number, y1: number, k = 16) {
  for (let i = 0; i < k; i++) {
    const t0 = (i / k) * TAU, t1 = ((i + 1) / k) * TAU
    const n0: V3 = [Math.cos(t0), 0, Math.sin(t0)], n1: V3 = [Math.cos(t1), 0, Math.sin(t1)]
    face(p, [W(r, t0, y0), W(r, t1, y0), W(r, t1, y1), W(r, t0, y1)], [n0, n1, n1, n0])
    for (const [y, s] of [[y0, -1], [y1, 1]] as Array<[number, number]>) {
      const n: V3 = [0, s, 0]
      const q = [[0, y, 0] as V3, W(r, t0, y), W(r, t1, y)]
      const f = cross(sub(q[1], q[0]), sub(q[2], q[0]))
      if (dot(f, n) >= 0) p.tri(q[0], q[1], q[2], undefined, undefined, undefined, [n, n, n])
      else p.tri(q[0], q[2], q[1], undefined, undefined, undefined, [n, n, n])
    }
  }
}

type Lod = { detail: boolean; spokes: number; seg: number; lace: number }
const LOW: Lod = { detail: false, spokes: 40, seg: 40, lace: 8 }
const DETAIL: Lod = { detail: true, spokes: 96, seg: 96, lace: 4 }

function build(s: Lod) {
  const white = new Part() // spokes, hub, legs (white steel)
  const rim = new Part()   // the rim: the LED-lit structure (neon)
  const legs = new Part()  // static legs
  const lm = (a: V3, b: V3, r: number, sides = 3) => member(legs, a, b, r, sides, r, true)

  // --- Rim
  for (const y of [-FACE, FACE]) {
    // a truss on each face: outer and inner chords, a zigzag web
    for (const r of [R_OUT, R_IN]) band(rim, r, y, s.detail ? 0.55 : 0.75, s.detail ? 0.5 : 0.6, s.detail ? 0.12 : 0, s.seg)
    for (let i = 0; i < s.seg; i++) {
      const t0 = (i / s.seg) * TAU, t1 = ((i + 1) / s.seg) * TAU
      if (s.detail) {
        member(rim, W(R_IN + 0.2, t0, y), W(R_OUT - 0.2, i % 2 ? t1 : t0, y), 0.13, 3)
        if (i % 2 === 0) member(rim, W(R_OUT - 0.2, t0, y), W(R_IN + 0.2, t1, y), 0.13, 3)
      } else member(rim, W(i % 2 ? R_OUT - 0.3 : R_IN + 0.3, t0, y), W(i % 2 ? R_IN + 0.3 : R_OUT - 0.3, t1, y), 0.2, 3)
    }
  }
  if (s.detail) {
    // ties across between the faces at the inner chord
    for (let i = 0; i < s.seg; i += 2) {
      const t = (i / s.seg) * TAU
      member(rim, W(R_IN, t, -FACE), W(R_IN, t, FACE), 0.12, 3)
      member(rim, W(R_IN, t, -FACE), W(R_IN, t + TAU / s.seg, FACE), 0.09, 3)
    }
  }
  // gondola arms: short brackets from the outer chord out to each pivot
  for (let k = 0; k < N_CARS; k++) {
    const t = Math.PI / 2 + (k / N_CARS) * TAU
    for (const y of [-FACE, FACE]) member(rim, W(R_OUT, t, y * 0.9), W(R_ARM, t, y * 0.75), s.detail ? 0.12 : 0.18, 3)
  }

  // --- Hub and spokes: rods crossing ahead and behind, to the inner chords
  drum(white, 2.6, -4.6, 4.6)
  drum(white, 3.4, -1.2, 1.2)
  for (const y of [-1, 1]) {
    for (let k = 0; k < s.spokes; k++) {
      const t = (k / s.spokes) * TAU
      const lean = (k % 2 ? 1 : -1) * 0.32
      const hub = W(2.4, t + lean, y * 4.2)
      member(white, hub, W(R_IN - 0.3, t, y * FACE), s.detail ? 0.12 : 0.2, 3)
    }
  }

  // --- The two A-frames, one each side of the wheel (static)
  const topY = 5.6, footY = 9.5, footX = 22, topX = 1.6, topZ = H - 1.2
  const legLine = (sx: number, sy: number, t: number): V3 => lerpV([sx * footX, sy * footY, 0], [sx * topX, sy * topY, topZ], t)
  /** A three-chord lattice column along a leg line. */
  const column = (a: (t: number) => V3, w0: number, w1: number, levels: number) => {
    const chord = (c: number, t: number): V3 => {
      const p = a(t), q = a(Math.min(1, t + 0.01))
      const ax = unit(sub(q, p))
      const u = unit(cross(ax, [0, 0, 1])), v = unit(cross(u, ax))
      const ang = (c / 3) * TAU + Math.PI / 2, w = w0 + (w1 - w0) * t
      return add(p, add(mul(u, w * Math.cos(ang)), mul(v, w * Math.sin(ang))))
    }
    for (let i = 0; i < levels; i++) {
      const t0 = i / levels, t1 = (i + 1) / levels
      for (let c = 0; c < 3; c++) {
        lm(chord(c, t0), chord(c, t1), s.detail ? 0.4 : 0.55, s.detail ? 4 : 3)
        lm(chord(c, t0), chord((c + 1) % 3, t1), s.detail ? 0.16 : 0.24, 3)
        if (s.detail) lm(chord(c, t1), chord((c + 1) % 3, t1), 0.14, 3)
      }
    }
  }
  for (const sy of [-1, 1]) {
    for (const sx of [-1, 1]) column((t) => legLine(sx, sy, t), 2.2, 1.1, Math.round(64 / s.lace))
    // two central posts from the ground to the girders under the hub
    for (const sx of [-1, 1]) {
      const post = (t: number): V3 => lerpV([sx * 3.2, sy * footY * 0.92, 0], [sx * 2.0, sy * topY * 1.05, H - 8], t)
      lm(post(0), post(1), s.detail ? 0.35 : 0.45, s.detail ? 6 : 4)
    }
    // horizontal girders between the legs, and X bracing between legs and posts
    for (const z of [20, 40, 52]) {
      const t = z / topZ
      const A = legLine(-1, sy, t), B = legLine(1, sy, t)
      lm(A, B, s.detail ? 0.3 : 0.4, 4)
      if (s.detail) lm(add(A, [0, 0, -1.4]), add(B, [0, 0, -1.4]), 0.2, 4)
    }
    for (const [z0, z1] of [[0, 20], [20, 40], [40, 52]]) {
      for (const sx of [-1, 1]) {
        const L0 = legLine(sx, sy, z0 / topZ), L1 = legLine(sx, sy, z1 / topZ)
        const P0 = lerpV([sx * 3.2, sy * footY * 0.92, 0], [sx * 2.0, sy * topY * 1.05, H - 8], z0 / (H - 8))
        const P1 = lerpV([sx * 3.2, sy * footY * 0.92, 0], [sx * 2.0, sy * topY * 1.05, H - 8], z1 / (H - 8))
        lm(L0, P1, s.detail ? 0.18 : 0.25, 3)
        if (s.detail) lm(P0, L1, 0.18, 3)
      }
    }
    // the bearing block at the top of each A-frame
    const yb = sy * 5.4
    for (const [a, b] of [[[-2.2, yb - 0.9, H - 2.8], [2.2, yb + 0.9, H + 1.6]]] as Array<[V3, V3]>) {
      const c = lerpV(a, b, 0.5), h = mul(sub(b, a), 0.5)
      // a box
      const P = (i: number, j: number, k: number): V3 => [c[0] + i * h[0], c[1] + j * h[1], c[2] + k * h[2]]
      const box: Array<[V3[], V3]> = [
        [[P(1, -1, -1), P(1, 1, -1), P(1, 1, 1), P(1, -1, 1)], [1, 0, 0]], [[P(-1, -1, -1), P(-1, -1, 1), P(-1, 1, 1), P(-1, 1, -1)], [-1, 0, 0]],
        [[P(-1, 1, -1), P(-1, 1, 1), P(1, 1, 1), P(1, 1, -1)], [0, 1, 0]], [[P(-1, -1, -1), P(1, -1, -1), P(1, -1, 1), P(-1, -1, 1)], [0, -1, 0]],
        [[P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1)], [0, 0, 1]], [[P(-1, -1, -1), P(-1, 1, -1), P(1, 1, -1), P(1, -1, -1)], [0, 0, -1]],
      ]
      for (const [q, n] of box) face(legs, q, [n, n, n, n])
    }
  }
  // ties between the two A-frames below the rim, at the feet
  for (const sx of [-1, 1]) {
    lm(legLine(sx, -1, 0.12), legLine(sx, 1, 0.12), s.detail ? 0.3 : 0.4, 4)
    lm(legLine(sx, -1, 0.02), legLine(sx, 1, 0.12), s.detail ? 0.2 : 0.28, 3)
  }

  // --- Gondolas: one mesh per colour, shared by its arc
  const gondola = (p: Part) => {
    const a = s.detail ? 1.25 : 1.25, b = 1.1, top = -0.35, bot = top - 2.7
    const c = s.detail ? 0.35 : 0
    const ring = (z: number, inset: number): V3[] => {
      const A = a - inset, B = b - inset, C = Math.max(0, c - inset * 0.5)
      const pts: Array<[number, number]> = C > 0
        ? [[-A + C, -B], [A - C, -B], [A, -B + C], [A, B - C], [A - C, B], [-A + C, B], [-A, B - C], [-A, -B + C]]
        : [[-A, -B], [A, -B], [A, B], [-A, B]]
      return pts.map(([x, y]) => [x, y, z] as V3)
    }
    const rings = s.detail ? [ring(bot, 0.45), ring(bot + 0.5, 0), ring(top - 0.4, 0), ring(top, 0.35)] : [ring(bot, 0.4), ring(bot + 0.55, 0), ring(top, 0.15)]
    p.loft(rings)
    p.cap(rings[rings.length - 1], true)
    p.cap(rings[0], false)
    if (s.detail) member(p, [0, 0, top], [0, 0, 0.1], 0.12, 4) // the hanger
  }
  const colours: Array<[string, number]> = [['gondola-red', 0xd9683f], ['gondola-yellow', 0xe2c14b], ['gondola-green', 0x67a65b], ['gondola-blue', 0x5a8bc4]]
  const carParts = colours.map(([name, col]) => {
    const p = new Part()
    gondola(p)
    return [{ part: p, material: finish(name, col, 0.5) }]
  })

  // --- Motion
  const LOOP = 90, KEYS = 60
  const times = Array.from({ length: KEYS + 1 }, (_, i) => (i / KEYS) * LOOP)
  const AXLE: V3 = [0, 1, 0]
  const turned = times.map((_, i) => (i / KEYS) * TAU)
  const wheelTurn: Quat[] = turned.map((a) => axisAngle(AXLE, a))
  const plumb: Quat[] = turned.map((a) => axisAngle(AXLE, -a))

  const WHITE: MaterialSpec = finish('wheel-white', 0xdde1e5, 0.6)
  const RIM: MaterialSpec = finish('neon-tempozan-rim', 0xe4e8ec, 0.5)
  const nodes: NodeSpec[] = [{ name: 'wheel', translation: [0, 0, H], parts: [{ part: rim, material: RIM }, { part: white, material: WHITE }] }]
  const channels: ChannelSpec[] = [{ node: 0, path: 'rotation', values: wheelTurn }]
  for (let k = 0; k < N_CARS; k++) {
    const t = Math.PI / 2 + (k / N_CARS) * TAU
    // colour arcs of 15, as photographed: red-orange, yellow, green, blue
    nodes.push({ name: `gondola-${k + 1}`, parent: 0, translation: W(R_ARM, t, 0), parts: carParts[Math.floor(k / 15) % 4] })
    channels.push({ node: nodes.length - 1, path: 'rotation', values: plumb })
  }
  return { parts: [{ part: legs, material: WHITE }], nodes, animation: { name: 'turn', times, channels } }
}

async function write(file: string, lod: Lod, maxTris: number, maxBytes: number) {
  const { parts, nodes, animation } = build(lod)
  const triangles = [...parts, ...nodes.flatMap((n) => n.parts)].reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Tempozan Ferris Wheel', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 48.5, height: 112.5,
  }, { nodes, animation })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length}`)
  await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
  console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
}

if (import.meta.main) {
  await write('osaka-tempozan-ferris-wheel.glb', LOW, 6500, 250_000)
  await write('osaka-tempozan-ferris-wheel.detail.glb', DETAIL, 40_000, 1536 * 1024)
}
