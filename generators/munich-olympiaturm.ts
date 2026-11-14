/**
 * Olympiaturm, Olympiapark, Munich: procedural, CC0-1.0.
 * bun generators/munich-olympiaturm.ts
 *
 * Also exports the small geometry kit (lathe, tube, box, face) that the
 * other munich-olympia / BMW generators of this builder import, so this
 * file is merged first. Its own build runs only under `import.meta.main`.
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (a round tower).
 * Origin: the centroid of OSM way/164084344 (the 32 m outline of the heads).
 *
 * Built 1965-68 (Sebastian Kranz). Concrete shaft, two heads: the lower
 * "Postkorb" (telecom floors, ringed by three antenna platforms) and the
 * upper "Aussichtskorb" (revolving restaurant and observation floors), then
 * a slender concrete stem with a top platform and the red-and-white steel
 * antenna (replaced 2005).
 *
 * Published (de.wikipedia "Olympiaturm"):
 * - total height 291.28 m; shaft 16.50 m across at the base, 8.60 m at 145 m.
 * - Postkorb 21.10 m across, four storeys from 147.25 to 167.70 m, three
 *   antenna platforms projecting 3.60 m, 7.90 m apart.
 * - Aussichtskorb 28.30 m across, levels at 178 (plant), 182 (restaurant),
 *   185 (observation), 189 (open deck), 192 m (top deck).
 * - antenna of 2005: 19.2 m new top.
 * Estimated from photos (the 2014 telephoto elevation, scaled on the
 * published Postkorb levels, 10.5 px/m vertical, 28.3 m head width):
 * - the trumpet under the Postkorb from the shaft (r 4.3) at 143.9 m;
 * - the neck between the heads (r 4.2, 167.7-171.5 m) flaring to the
 *   observation head's underside at 178.2 m;
 * - the head drum 178.2-192.4 m with two bronze window bands at
 *   183.6-186.6 and 188.4-191.0 m;
 * - the stem: r 4.0 to 201 m, the upper platform disc (r 9.8, 201-206 m),
 *   then r 3.1 to 249 m with two service rings at 221 and 228 m;
 * - the antenna: red/white lattice base 249-264 m (drawn solid), a red
 *   platform at 268-273 m, the banded mast to 291.28 m (bands as in photo).
 * OSM: way/164084344 (outline, building=tower), parts way/18894695 (shaft),
 * way/164084343 (head), way/1049578248 (a one-storey annex on the shaft's
 * east side, drawn as a 4 m box). Visitor entrance way/131601130 and its
 * parts sit outside the outline and are not drawn.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Olympiaturm Munich 2014 01.jpg", Julian Herzog, CC BY 4.0 (telephoto of
 *   the heads and antenna; the elevation everything above 140 m is scaled from)
 *   https://commons.wikimedia.org/wiki/File:Olympiaturm_Munich_2014_01.jpg
 * - "Olympiaturm Munich 2014 02.jpg", Julian Herzog, CC BY 4.0 (whole tower
 *   from the lake, south-west) https://commons.wikimedia.org/wiki/File:Olympiaturm_Munich_2014_02.jpg
 * - "München, Olympiaturm -- 2011 -- 1015.jpg", Dietmar Rabich, CC BY-SA 4.0
 *   (from the north-east car park) https://commons.wikimedia.org/wiki/File:M%C3%BCnchen,_Olympiaturm_--_2011_--_1015.jpg
 * - "München - Olympiapark (Luftbild).jpg", Maximilian Dörrbecker (Chumwa),
 *   CC BY-SA 2.5 (aerial) https://commons.wikimedia.org/wiki/File:M%C3%BCnchen_-_Olympiapark_(Luftbild).jpg
 * Left out: railings, dishes and antennas on the platforms, the lattice of
 * the antenna's base (drawn as a solid red-white tube), the visitor entrance.
 * Doubts: the stem and antenna heights above 192 m are photo-scaled and
 * stretched so the tip lands on the published 291.28 m.
 *
 * Night: the observation head's window bands are `window-2` (bronze glass,
 * lit); the shaft is not floodlit.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

export const TAU = Math.PI * 2
export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A quad wound to face the average of its corner normals. */
export function face(p: Part, P: V3[], N: V3[]) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const avg = N.reduce(add, [0, 0, 0] as V3)
  const [a, b, c, d] = dot(f, avg) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(P[a], P[b], P[c], undefined, undefined, undefined, [N[a], N[b], N[c]])
  p.tri(P[a], P[c], P[d], undefined, undefined, undefined, [N[a], N[c], N[d]])
}
/** A flat quad facing n. */
export const flat = (p: Part, P: V3[], n: V3) => face(p, P, [n, n, n, n])

const PR = (r: number, a: number, z: number, c: V3 = [0, 0, 0]): V3 => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), c[2] + z]

/**
 * A surface of revolution about a vertical axis through c, from [r, z]
 * points; the left-hand side of the profile is the outside. Smooth where
 * neighbouring bands meet at under `smooth` degrees.
 */
export function lathe(profile: [number, number][], pick: (band: number) => Part | null, k: number, smooth = 40, c: V3 = [0, 0, 0], a0 = 0) {
  const bandN = profile.slice(0, -1).map(([r0, z0], b) => {
    const [r1, z1] = profile[b + 1]
    const er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez) || 1
    return [ez / l, -er / l] as [number, number]
  })
  const cosLim = Math.cos((smooth * Math.PI) / 180)
  const vn = (b: number, end: 0 | 1): [number, number] => {
    const own = bandN[b], other = bandN[b + (end ? 1 : -1)]
    if (!other || own[0] * other[0] + own[1] * other[1] < cosLim) return own
    const s = [own[0] + other[0], own[1] + other[1]], l = Math.hypot(s[0], s[1])
    return [s[0] / l, s[1] / l]
  }
  for (let b = 0; b < profile.length - 1; b++) {
    const part = pick(b)
    if (!part) continue
    const [r0, z0] = profile[b], [r1, z1] = profile[b + 1]
    if (r0 === 0 && r1 === 0) continue
    const n0 = vn(b, 0), n1 = vn(b, 1)
    const N = (n: [number, number], a: number): V3 => unit([n[0] * Math.cos(a), n[0] * Math.sin(a), n[1]])
    for (let s = 0; s < k; s++) {
      const aa = a0 + (s / k) * TAU, ab = a0 + ((s + 1) / k) * TAU
      const q = [PR(r0, aa, z0, c), PR(r0, ab, z0, c), PR(r1, ab, z1, c), PR(r1, aa, z1, c)]
      const nn = [N(n0, aa), N(n0, ab), N(n1, ab), N(n1, aa)]
      if (r0 === 0) part.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nn[0], nn[2], nn[3]])
      else if (r1 === 0) part.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nn[0], nn[1], nn[2]])
      else face(part, q, nn)
    }
  }
}

/** Two unit vectors perpendicular to d. */
export function basis(d: V3): [V3, V3] {
  const u = unit(d)
  const ref: V3 = Math.abs(u[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const e1 = unit(cross(ref, u)), e2 = cross(u, e1)
  return [e1, e2]
}

/** A round tube from a to b, radii ra and rb, k sides, smooth-shaded; capped ends optional. */
export function tube(p: Part, a: V3, b: V3, ra: number, rb: number, k = 8, caps = true) {
  const d = sub(b, a)
  const [e1, e2] = basis(d)
  const ring = (c: V3, r: number) => Array.from({ length: k }, (_, i) => {
    const t = (i / k) * TAU
    return add(c, add(mul(e1, r * Math.cos(t)), mul(e2, r * Math.sin(t))))
  })
  const A = ring(a, ra), B = ring(b, rb)
  for (let i = 0; i < k; i++) {
    const j = (i + 1) % k
    const ni = unit(sub(A[i], a)), nj = unit(sub(A[j], a))
    face(p, [A[i], A[j], B[j], B[i]], [ni, nj, nj, ni])
  }
  if (caps) {
    const u = unit(d)
    for (let i = 1; i < k - 1; i++) {
      const tA = [A[0], A[i], A[i + 1]], tB = [B[0], B[i], B[i + 1]]
      const wind = (t: V3[], n: V3) => {
        const g = cross(sub(t[1], t[0]), sub(t[2], t[0]))
        if (dot(g, n) >= 0) p.tri(t[0], t[1], t[2])
        else p.tri(t[0], t[2], t[1])
      }
      wind(tA, mul(u, -1))
      wind(tB, u)
    }
  }
}

/** A path of round tube through points (a cable), shared rings at joints. */
export function cable(p: Part, pts: V3[], r: number, k = 4) {
  for (let i = 0; i < pts.length - 1; i++) tube(p, pts[i], pts[i + 1], r, r, k, false)
}

/** A box from a centre, two horizontal unit axes and half sizes, z0..z1. */
export function box(p: Part, c: V3, d: V3, e: V3, hd: number, he: number, z0: number, z1: number) {
  const at = (u: number, v: number, z: number): V3 => add(add(add(c, mul(d, u)), mul(e, v)), [0, 0, z])
  const corners: [number, number][] = [[-hd, -he], [hd, -he], [hd, he], [-hd, he]]
  let ring = (z: number) => corners.map(([u, v]) => at(u, v, z))
  // counter-clockwise from above
  const r0 = ring(0)
  const s = r0.reduce((acc, a, i) => { const b = r0[(i + 1) % 4]; return acc + a[0] * b[1] - b[0] * a[1] }, 0)
  if (s < 0) { const base = ring; ring = (z: number) => base(z).reverse() }
  p.loft([ring(z0), ring(z1)])
  p.cap(ring(z1), true)
  p.cap(ring(z0), false)
}

// ------------------------------------------------------------------ build ---
function build() {
  const concrete = new Part() // shaft and stem
  const white = new Part()    // heads, platforms
  const glassBand = new Part() // observation windows (bronze)
  const red = new Part()      // antenna red
  const dark = new Part()     // Postkorb's recessed storeys, deck glazing

  const K = 32
  // Shaft: 16.5 m at the base to 8.6 m at 145 m (published), straight taper.
  lathe([[8.25, 0], [4.3, 143.9]], () => concrete, K, 60)
  // Annex on the east side (OSM way/1049578248), one storey.
  box(white, [9.2, 1.1, 0], [1, 0, 0], [0, 1, 0], 4.6, 2.2, 0, 4.2)

  // Postkorb: trumpet from the shaft to the bottom platform, three platforms
  // (r 14.15) with the 21.1 m drum (r 10.55) between them.
  const PLAT = 14.15, DRUM = 10.55
  lathe([[4.3, 143.9], [6.5, 144.6], [10.5, 145.8], [13.6, 146.6], [PLAT, 147.0], [PLAT, 147.8], [DRUM, 147.8]],
    (b) => (b < 4 ? white : white), K, 35)
  // The drum storeys between the platforms (grey, the rows of small windows
  // and railings read as one mid tone), and three platform rims at full
  // width with sloped undersides: two between the storeys and one on top.
  lathe([[DRUM, 147.8], [DRUM, 166.4]], () => dark, K)
  for (const z of [154.6, 162.5]) {
    lathe([[DRUM, z - 0.5], [PLAT - 0.4, z], [PLAT, z + 0.3], [PLAT, z + 1.3], [PLAT - 0.3, z + 1.45], [DRUM, z + 1.45]], () => white, K, 30)
  }
  lathe([[DRUM, 166.0], [PLAT - 0.4, 166.4], [PLAT, 166.7], [PLAT, 167.6], [PLAT - 0.3, 167.75], [4.2, 167.75]], () => white, K, 30)
  // Neck and the trumpet under the observation head.
  lathe([[4.2, 167.75], [4.2, 171.5], [5.0, 173.6], [7.5, 175.8], [11.0, 177.3], [13.7, 178.0], [14.15, 178.6]], () => white, K, 35)
  // Observation head drum: white with two bronze window bands.
  const H = 14.15
  lathe([[H, 178.6], [H, 183.6]], () => white, K)
  lathe([[H + 0.05, 183.6], [H + 0.05, 186.6]], () => glassBand, K)
  lathe([[H, 186.6], [H, 188.4]], () => white, K)
  lathe([[H + 0.05, 188.4], [H + 0.05, 191.0]], () => glassBand, K)
  lathe([[H, 191.0], [H, 192.1], [H - 0.3, 192.4], [4.0, 192.4]], () => white, K, 30)
  // The open deck's glass parapet, a thin dark band at the rim.
  lathe([[H - 0.4, 192.4], [H - 0.4, 193.5], [H - 0.6, 193.5], [H - 0.6, 192.4]], () => dark, K)

  // Stem above the head (scaled so the tip lands on 291.28 m).
  const s = (h: number) => 192.4 + (h - 192.4) * 1.0082
  lathe([[4.0, 192.4], [4.0, s(201.4)]], () => white, K)
  // The upper platform disc, bowl underneath.
  lathe([[4.0, s(201.4)], [7.0, s(202.4)], [9.6, s(203.2)], [9.8, s(203.7)], [9.8, s(204.4)], [9.5, s(204.6)], [3.1, s(204.6)]], () => white, K, 35)
  // The concrete stem with its two service rings.
  lathe([[3.1, s(204.6)], [3.1, s(248.6)]], () => white, 24)
  for (const [h, r] of [[220.8, 4.4], [228.0, 4.0]] as [number, number][]) {
    lathe([[3.1, s(h) - 0.6], [r, s(h) - 0.3], [r, s(h) + 0.6], [3.1, s(h) + 0.6]], () => dark, 24, 20)
  }
  // Antenna: red platform on the stem, red/white lattice base (solid),
  // red bulb platform, the banded mast and a small top.
  lathe([[3.1, s(248.6)], [3.7, s(248.8)], [3.7, s(249.8)], [1.7, s(249.8)]], () => red, 16, 20)
  const bands: [number, number, Part][] = [
    [249.8, 252.0, red], [252.0, 257.0, white], [257.0, 258.6, red], [258.6, 263.0, white], [263.0, 264.6, red],
  ]
  for (const [a, b, part] of bands) lathe([[1.6, s(a)], [1.45, s(b)]], () => part, 12)
  lathe([[1.45, s(264.6)], [1.1, s(267.6)], [2.3, s(268.6)], [2.3, s(270.0)], [1.4, s(270.6)], [1.4, s(272.6)], [0.85, s(273.4)]], () => red, 12, 30)
  const mast: [number, number, Part][] = [
    [273.4, 278.0, white], [278.0, 282.6, red], [282.6, 287.0, white], [287.0, 290.0, red],
  ]
  for (const [a, b, part] of mast) lathe([[0.85, s(a)], [0.8, s(b)]], () => part, 10)
  lathe([[0.8, s(290.0)], [0.35, 291.28], [0, 291.28]], () => red, 10)

  const parts = [
    { part: concrete, material: finish('olympiaturm-concrete', 0xcfc8bd) },
    { part: white, material: PALETTE.trim },
    { part: glassBand, material: windowVariant(2, 0xc49470) },
    { part: red, material: finish('antenna-red', 0xc8453a) },
    { part: dark, material: finish('olympiaturm-grey', 0xb0b4b5) },
  ]
  const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Olympiaturm', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 0, elevation: 0, height: 291.28, osm: 'way/164084344',
  })
  if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
  const out = new URL('../models/munich-olympiaturm.glb', import.meta.url).pathname
  Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

if (import.meta.main) build()
