/**
 * Torch of Friendship (La Antorcha de la Amistad), San Antonio: procedural, CC0-1.0.
 * bun generators/sat-torch-of-friendship.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation. The origin is OSM's node/924795222 (the sculpture's point,
 * on the traffic island where Alamo, Losoya and Commerce streets meet);
 * y = 0 is the island's ground. OSM maps no building there, so the
 * placement replaces nothing.
 *
 * Sebastián (Enrique Carbajal), 2002, a gift from Mexico to the city:
 * painted red steel, published 65 ft (19.8 m) tall (Wikipedia, "La
 * Antorcha de la Amistad"; City of San Antonio public-art listing).
 * Two broad flat legs stand apart on the island and lean together. The
 * left one (seen from the west) twists and hooks over at about 11 m; the
 * right one climbs on, twists its face up into a band and winds into an
 * open spiral, the "flame": a big upright-banded loop whose top is the
 * 19.8 m and a smaller loop wound inside and below it (the views from below).
 *
 * The sculpture is drawn as two ribbons: box sections swept along smooth
 * centrelines, each with its band width, face direction and thickness.
 *
 * Measured from photos (scaled from the published 19.8 m; revised after
 * review against the west and night photos):
 * - the legs near-uniform slabs, 1.9 m wide at the ground and 1.6 m at
 *   12 m, nearly parallel with a narrow slot (about 0.8 m) between them,
 *   rising to about two thirds of the height (12.5-13.5 m);
 * - the left leg folds over at its top toward the right one;
 * - the flame an open spiral clearly wider than the legs' span: the outer
 *   loop about 7 m across (the legs span 4.5 m), band 1.45 m deep, from
 *   about 15 m to the top, with a smaller loop wound inside it.
 * Estimated: the plate thickness (0.55 m on the legs, 0.45 m in the loops;
 *   photos show it as a thin edge), the loop's depth front to back (from
 *   the views from below), the legs' faces turned about 14 degrees each
 *   way and set 0.6 m apart east-west, the orientation (the photos with a
 *   known background are both from the west, looking east toward the
 *   Marriott Rivercenter and the Tower of the Americas, so the legs stand
 *   side by side north-south; the east side is the same loop seen from below).
 * Left out: the planting and curb of the island (the map's).
 *
 * Night: floodlit from the island (Leopold's night photo, the legs
 * brightest near the ground), so the red carries a `floodlight` wash.
 *
 * Photos (all EVIDENCE):
 * - "Torch Of Friendship, San Antonio, Texas", Nicolas Henderson
 *   (TexasExplorer98), CC BY 2.0, https://www.flickr.com/photos/76792851@N07/50194277967
 *   (from the west, daylight; the main silhouette)
 * - "Torch of Friendship", Corey Leopold, CC BY 2.0,
 *   https://www.flickr.com/photos/97708873@N00/3136385209 (from the west-northwest, night)
 * - "La Antorcha de la Amistad", JD Hancock, CC BY 2.0,
 *   https://www.flickr.com/photos/83346641@N00/4215995084 (from below)
 * - "The Torch" and "Torch of Friendship", cogdogblog (Alan Levine), CC0,
 *   https://www.flickr.com/photos/37996646802@N01/291586733 and /291586686 (the loops from below)
 * Look-only (seen, not used): Flickr photos by Robert Hensley, teachandlearn,
 *   tonyfernandezz (NC/ND licences).
 *
 * Doubts: the sculpture's real orientation on the island is read from two
 * photos' backgrounds only; the twist of the left leg's hook and the
 * spiral's exact path in depth are estimated from views from below.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/**
 * The sculpture is laid out as seen from the west (the photos' side):
 * u to the viewer's right (south), d away from the viewer (east), z up.
 */
const W = (u: number, d: number, z: number): V3 => [d, -u, z]

/** A ribbon control point: centre, the band's width direction, width, thickness. */
type Ctl = { p: V3; w: V3; width: number; t?: number }

function face(p: Part, P: V3[], N: V3[]) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const avg = N.reduce(add, [0, 0, 0] as V3)
  const [a, b, c, d] = dot(f, avg) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(P[a], P[b], P[c], undefined, undefined, undefined, [N[a], N[b], N[c]])
  p.tri(P[a], P[c], P[d], undefined, undefined, undefined, [N[a], N[c], N[d]])
}

/** Catmull-Rom through the control points, `k` samples per span. */
function ribbon(part: Part, ctl: Ctl[], k = 10) {
  const n = ctl.length
  const cr = (a: number, b: number, c: number, d: number, s: number) =>
    0.5 * (2 * b + (-a + c) * s + (2 * a - 5 * b + 4 * c - d) * s * s + (-a + 3 * b - 3 * c + d) * s * s * s)
  const at = (i: number) => ctl[Math.max(0, Math.min(n - 1, i))]
  const samples: { p: V3; w: V3; width: number; t: number }[] = []
  for (let i = 0; i < n - 1; i++) {
    const A = at(i - 1), B = at(i), C = at(i + 1), D = at(i + 2)
    for (let s = 0; s < k || (i === n - 2 && s === k); s++) {
      const f = s / k
      const p = [0, 1, 2].map((j) => cr(A.p[j], B.p[j], C.p[j], D.p[j], f)) as V3
      const w = unit(add(mul(B.w, 1 - f), mul(C.w, f)))
      samples.push({ p, w, width: B.width + (C.width - B.width) * f, t: (B.t ?? 0.55) + ((C.t ?? 0.55) - (B.t ?? 0.55)) * f })
    }
  }
  const secs = samples.map((s, i) => {
    const T = unit(sub(samples[Math.min(i + 1, samples.length - 1)].p, samples[Math.max(i - 1, 0)].p))
    const Wd = unit(sub(s.w, mul(T, dot(s.w, T))))
    const N = unit(cross(T, Wd))
    const hw = s.width / 2, ht = s.t / 2
    const c = (a: number, b: number) => add(add(s.p, mul(Wd, a * hw)), mul(N, b * ht))
    return { P: [c(-1, -1), c(1, -1), c(1, 1), c(-1, 1)], W: Wd, N, T }
  })
  for (let i = 0; i < secs.length - 1; i++) {
    const a = secs[i], b = secs[i + 1]
    // sides: 0-1 (-N face), 1-2 (+W edge), 2-3 (+N face), 3-0 (-W edge)
    const nrm = (s: typeof a, j: number): V3 => [mul(s.N, -1), s.W, s.N, mul(s.W, -1)][j]
    for (let j = 0; j < 4; j++) {
      const j2 = (j + 1) % 4
      face(part, [a.P[j], a.P[j2], b.P[j2], b.P[j]], [nrm(a, j), nrm(a, j), nrm(b, j), nrm(b, j)])
    }
  }
  const s0 = secs[0], s1 = secs[secs.length - 1]
  const n0 = mul(s0.T, -1)
  face(part, s0.P, [n0, n0, n0, n0])
  face(part, s1.P, [s1.T, s1.T, s1.T, s1.T])
}

const red = new Part()
const U: V3 = W(1, 0, 0), D: V3 = W(0, 1, 0), Z: V3 = [0, 0, 1]
const mix = (a: V3, b: V3, f: number) => unit(add(mul(a, 1 - f), mul(b, f)))
// The legs' faces are not square to each other: each is turned about 14
// degrees, so they read as broad plates from the north-west and south-west
// too (Leopold's night view).
const UL = mix(U, D, -0.25), UR = mix(U, D, 0.25)

// The left leg: broad face to the west, leaning in, twisting its face
// round to north-south as it rises, then hooking over toward the right leg.
ribbon(red, [
  { p: W(-1.3, 0.3, 0), w: UL, width: 1.9 },
  { p: W(-1.29, 0.3, 0.6), w: UL, width: 1.9 },
  { p: W(-1.22, 0.25, 6.5), w: UL, width: 1.75 },
  { p: W(-1.15, 0.2, 11.6), w: UL, width: 1.6 },
  { p: W(-1.05, 0.2, 12.6), w: mix(UL, D, 0.7), width: 1.5 },
  { p: W(-0.6, 0.2, 13.4), w: D, width: 1.4 },
  { p: W(0.05, 0.2, 13.2), w: D, width: 1.4 },
  { p: W(0.2, 0.2, 12.4), w: D, width: 1.35 },
])

// The right leg and the flame: straight up beside the left one with a
// narrow slot between them, then a climb to the left into a big open
// loop with its band standing upright, and a smaller loop wound inside it.
ribbon(red, [
  { p: W(1.3, -0.3, 0), w: UR, width: 1.9 },
  { p: W(1.29, -0.3, 0.6), w: UR, width: 1.9 },
  { p: W(1.22, -0.25, 6.5), w: UR, width: 1.75 },
  { p: W(1.15, -0.2, 12.0), w: UR, width: 1.6 },
  { p: W(0.9, -0.3, 13.6), w: mix(UR, Z, 0.4), width: 1.5, t: 0.45 },
  { p: W(-0.6, -0.9, 15.0), w: mix(U, Z, 0.8), width: 1.45, t: 0.45 },
  { p: W(-3.3, -0.4, 16.8), w: Z, width: 1.45, t: 0.45 },
  { p: W(-2.6, 2.6, 18.6), w: Z, width: 1.45, t: 0.45 },
  { p: W(0.6, 3.6, 19.1), w: Z, width: 1.45, t: 0.45 },
  { p: W(3.4, 1.9, 18.9), w: Z, width: 1.45, t: 0.45 },
  { p: W(3.5, -1.4, 18.2), w: Z, width: 1.45, t: 0.45 },
  { p: W(0.8, -2.6, 17.4), w: Z, width: 1.4, t: 0.45 },
  { p: W(-1.6, -1.2, 16.6), w: Z, width: 1.35, t: 0.45 },
  { p: W(-1.5, 1.2, 16.0), w: Z, width: 1.3, t: 0.45 },
  { p: W(0.6, 1.7, 15.7), w: Z, width: 1.25, t: 0.45 },
  { p: W(1.7, 0.1, 15.8), w: Z, width: 1.2, t: 0.45 },
  { p: W(1.0, -1.0, 16.1), w: mix(Z, D, 0.3), width: 1.1, t: 0.45 },
], 9)

// The feet start at the ground; their end sections tilt with the legs' lean, so
// any corner a few centimetres under it is lifted to 0 (glTF order: index 1
// of each position is the height).
for (let i = 1; i < red.pos.length; i += 3) if (red.pos[i] < 0) red.pos[i] = 0

// Floodlit from the island: the legs brightest low, the loops less.
const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.2 : Math.max(0.45, 1 - p[2] / 30))
const parts = [{ part: red, material: { ...finish('torch-red', 0xc23e36), floodlight: lit } }]
const triangles = red.triangles
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Torch of Friendship', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 19.8, anchor: [29.423504, -98.487454], replaces: [],
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/sat-torch-of-friendship.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
