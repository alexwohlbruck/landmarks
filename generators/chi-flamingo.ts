/**
 * Flamingo (Alexander Calder, 1974), Federal Plaza, Chicago — original
 * procedural geometry, CC0-1.0.
 *
 *   bun generators/chi-flamingo.ts
 *
 * Map frame: x east, y north, z up, metres; origin at OSM node/1299823016
 * (tourism=artwork, source=survey, 41.8788065, -87.6296809) on the plaza.
 * OSM has no way or building for it, so the placement replaces nothing.
 * The model is built square to north (bearing 0).
 *
 * Identity: a 16 m stabile in vermilion "Calder red", all curved and
 * tapered steel plate. One tall pointed arch whose crest is the highest
 * point; a second, lower arch springing from near the crest and falling
 * west into the "body", a knot of triangular fins at about two thirds of
 * the height; and from the body, tapered triangular legs splayed to the
 * ground, so the whole stands on five feet and reads as a bird stepping.
 *
 * Orientation: the tall arch stands roughly east-west. From the south
 * (Christine Zenino's and Leon Petrosyan's photos, the post office pavilion
 * at the left and the Marquette Building behind) and from the north
 * (JeremyA's, the Kluczynski tower behind) it is seen broadside with the
 * body to the west; from the east (DS1953's, the post office behind) it is
 * nearly edge-on with the fins spread south. NAIP shows the red knot of the
 * body about 4 m west of the OSM node.
 *
 * Form:
 *  - arches: rectangular box sections swept along the curve, tapering from
 *    1.1 x 0.8 m at the crest to 0.55 m at the feet (the girders are
 *    flanged plates; a box is the plain version), smooth enough at 12
 *    segments per leg;
 *  - body and legs: flat triangular plates 0.3 m thick, each in the
 *    vertical plane through the body and its foot, so it is broad from the
 *    side and a blade end-on, as in the photos.
 *
 * Evidence:
 *  - Published (Wikidata Q3073296; Wikipedia "Flamingo (sculpture)"):
 *    53 ft (16.2 m) tall, painted steel, 1974.
 *  - OSM node/1299823016 (survey) for the anchor; USGS NAIP for the body's
 *    position and the arch's east-west run (its shadow).
 *  - Photos (Wikimedia Commons): Calder_Flamingo.jpg (JeremyA, public
 *    domain, from the north); Calder-flamingo.jpg (DS1953, public domain,
 *    from the east); Flamingo_Chicago.jpg (Leon Petrosyan, CC BY-SA 3.0,
 *    from the south); Calders_Flamingo;_1973_(8248157815).jpg (Christine
 *    Zenino, CC BY 2.0); Flamingo_Calder.jpg (John Picken, public domain);
 *    Lascar_Flamingo_sculpture_(4608071498).jpg (Jorge Láscar, CC BY 2.0);
 *    vincent desjardins' series (CC BY 2.0, from the south-east, Willis
 *    Tower behind); CalderFlamingo3.jpg (2candle, CC BY-SA 3.0, from a tower
 *    above: the plan).
 *  - Colour: vermilion, kept clearly red but a little lighter and softer
 *    than the paint so it sits with the palette.
 *
 * Measured off the north and south photos, scaled to 16.2 m (±1 m): the
 * crest 4.3 m east of the middle, the feet 8.5 m east, 0.5 m east, 2 m and
 * 9 m west, the body at 8.5-9.5 m. Estimated: the north-south spread of
 * the legs (perspective in the east view), the section sizes, the exact
 * fin shapes. The real fins are folded and flanged; these are flat.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { plate, type UV } from './chi-picasso'

const red = new Part()

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/**
 * A box girder along a polyline: `w` across the arch's plane (its broad,
 * side-facing width) and `d` in the plane, both per point. `side` is the
 * normal of the arch's plane.
 */
function girder(path: V3[], w: (t: number) => number, d: (t: number) => number, side: V3) {
  const n = path.length
  const sections: V3[][] = path.map((p, i) => {
    const tan = unit(sub(path[Math.min(n - 1, i + 1)], path[Math.max(0, i - 1)]))
    const s = unit(sub(side, mul(tan, tan[0] * side[0] + tan[1] * side[1] + tan[2] * side[2])))
    const q = unit(cross(tan, s))
    const t = i / (n - 1), hw = w(t) / 2, hd = d(t) / 2
    return [add(add(p, mul(s, hw)), mul(q, hd)), add(add(p, mul(s, -hw)), mul(q, hd)), add(add(p, mul(s, -hw)), mul(q, -hd)), add(add(p, mul(s, hw)), mul(q, -hd))]
  })
  red.sweep(sections)
  // End caps (both windings, like the sweep).
  for (const sec of [sections[0], sections[n - 1]]) {
    red.quad(sec[0], sec[1], sec[2], sec[3]); red.quad(sec[3], sec[2], sec[1], sec[0])
  }
}

/** A flat plate in the vertical plane through a and b, outline in (u along a→b horizontally, z). */
function fin(a: V3, b: V3, outline: UV[], t = 0.3) {
  const dir = unit([b[0] - a[0], b[1] - a[1], 0]), nrm: V3 = [-dir[1], dir[0], 0]
  plate(red, outline, (u, z, w) => [a[0] + dir[0] * u + nrm[0] * w, a[1] + dir[1] * u + nrm[1] * w, z + nrm[2] * w], t)
}

// ── The tall arch: east foot → crest → middle foot ───────────────────────
const H = 15.75 // centre line; the crest girder's top reaches the published 16.2 m
const E: V3 = [8.5, 1.4, 0], M: V3 = [0.5, -1.0, 0]
const N = 24
const arch: V3[] = []
for (let i = 0; i <= N; i++) {
  const th = (i / N) * Math.PI
  // Splayed, nearly straight legs and a rounded, slightly pointed crest.
  const z = H * Math.pow(Math.sin(th), 0.75)
  const f = (1 - Math.cos(th)) / 2
  arch.push([E[0] + (M[0] - E[0]) * f, E[1] + (M[1] - E[1]) * f, z])
}
const archSide = unit(cross(sub(M, E), [0, 0, 1]))
girder(arch, (t) => 0.45 + 0.85 * Math.sin(t * Math.PI), (t) => 0.4 + 0.5 * Math.sin(t * Math.PI), archSide)

// ── The body: a knot of fins west of the arch ────────────────────────────
const BODY: V3 = [-3.0, -1.2, 8.8]

// The second arch: from the tall arch's west shoulder, down into the body.
{
  // It leaves the crest, arches west at nearly the crest's height and
  // falls steeply into the body (JeremyA's photo from the north).
  const a = arch[Math.round(N * 0.52)]
  const c1: V3 = [a[0] - 3.4, a[1] - 0.2, a[2] + 0.4]
  const c2: V3 = [BODY[0] + 1.0, BODY[1], BODY[2] + 5.0]
  const pts: V3[] = []
  for (let i = 0; i <= 10; i++) {
    const t = i / 10, u = 1 - t
    pts.push(add(add(mul(a, u * u * u), mul(c1, 3 * u * u * t)), add(mul(c2, 3 * u * t * t), mul(BODY, t * t * t))))
  }
  girder(pts, (t) => 1.1 - 0.2 * t, (t) => 0.8 - 0.1 * t, unit(cross(sub(BODY, a), [0, 0, 1])))
}

// Legs: tapered triangles from the body to the ground. Each outline is
// (u, z) with u measured from the body horizontally towards the foot.
function leg(foot: V3, top: number, spread: number) {
  const L = Math.hypot(foot[0] - BODY[0], foot[1] - BODY[1])
  // Broad under the body, narrowing to a point at the foot.
  fin(BODY, foot, [[-spread, BODY[2] - 0.2], [0.4, top], [L * 0.35 + spread * 0.5, BODY[2] * 0.62], [L + 0.25, 0], [L - 0.25, 0], [0, BODY[2] - 3.4]])
}
leg([-1.4, -4.8, 0], BODY[2] + 0.8, 2.2)  // south leg
leg([-8.8, -2.6, 0], BODY[2] + 1.6, 1.8)  // west leg, the long "tail" blade
leg([-4.6, 3.2, 0], BODY[2] + 0.6, 1.8)   // north leg

// The body's points: fins standing up and out from the knot.
fin(BODY, [BODY[0] + 1, BODY[1] + 0.4, 0], [[-3.0, BODY[2] - 0.8], [-0.6, BODY[2] + 3.4], [3.6, BODY[2] + 1.4], [1.8, BODY[2] - 1.2]])
fin(BODY, [BODY[0], BODY[1] + 1, 0], [[-3.2, BODY[2] + 0.4], [-0.2, BODY[2] + 2.8], [3.0, BODY[2] + 1.2], [0.4, BODY[2] - 1.4]])

const parts = [{ part: red, material: finish('calder-red', 0xd2523c) }]
const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('Flamingo', parts, {
  frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [41.8788065, -87.6296809], bearing: 0,
})
if (triangles > 5000 || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out = process.argv[2] ?? new URL('../models/chi-flamingo.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
