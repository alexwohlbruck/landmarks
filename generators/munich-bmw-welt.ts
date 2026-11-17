/**
 * BMW Welt, Munich: procedural, CC0-1.0.
 * bun generators/munich-bmw-welt.ts
 *
 * Uses the geometry kit exported by generators/munich-olympiaturm.ts.
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin: the centroid
 * of OSM way/15804929 (the outline).
 *
 * Coop Himmelb(l)au, opened 2007. A glazed hall under a thick, wavy
 * silver roof (the "cloud"), which at the south-east corner pulls down into
 * the double cone: a glass funnel narrowing to a waist and a silver cone
 * flaring back out to the ground.
 *
 * Published (de.wikipedia "BMW Welt"): 180 m long, 130 m wide, 24 m high;
 * 8,000 m2 of photovoltaics on the roof.
 * OSM: the outline way/15804929; the glass hall way/307305449 (16 m);
 * the roof way/307330230 (tagged 16-18 m, a flat stand-in for the cloud),
 * whose outline the roof here follows; the double cone ways 307634074
 * (r 19.3 at the ground), 307345439 and 307479203 (rings r 17.3 and 14.5),
 * centred at (54.9, -61.5); the one-storey north pavilion way/307627834
 * (4 m); way/617633780 (an untagged part inside the hall).
 * From photos (heights scaled on the published 24 m): the roof's top
 * 22-24.5 m, highest over the cone and toward the north end, lowest in the
 * middle; the soffit at about 17 m; the south-west corner's nose curling
 * down to about 11 m (panorama from the south); the cone's waist at about
 * 9.5 m (r 7) and its base r 19 (Schlottmann 2016, from the south-west).
 * Estimated: the roof's surface as smooth bumps between those heights;
 * the funnel's diamond grid (12 + 12 helical members, drawn as 3D tubes).
 * Simplified: the double cone is drawn about a vertical axis; the real one
 * twists and leans.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "BMW-Welt 9425.jpg", Henning Schlottmann (User:H-stt), CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:BMW-Welt_9425.jpg
 * - "München - BMW-Welt - Panorama.jpg", Guido Radig, CC BY 4.0
 *   https://commons.wikimedia.org/wiki/File:M%C3%BCnchen_-_BMW-Welt_-_Panorama.jpg
 * - "BMW Welt, Múnich, Alemania16.jpg", Diego Delso, CC BY-SA 3.0 (from the south-east)
 *   https://commons.wikimedia.org/wiki/File:BMW_Welt,_M%C3%BAnich,_Alemania16.jpg
 * - "BMW Welt, Múnich, Alemania, 2013-04-22, DD 03.jpg", Diego Delso, CC BY-SA 3.0 (night)
 *   https://commons.wikimedia.org/wiki/File:BMW_Welt,_M%C3%BAnich,_Alemania,_2013-04-22,_DD_03.jpg
 * - "BMW Welt Side.jpg", Aepryus, public domain (night, under the roof)
 *   https://commons.wikimedia.org/wiki/File:BMW_Welt_Side.jpg
 *
 * Left out: the footbridge to the Vierzylinder, the ramps and plinth walls,
 * the photovoltaic panel pattern, the inner stairs.
 * Doubts: the roof's exact relief between the photographed edges; no
 * licensed aerial of the roof top was found.
 *
 * Night: the hall's glazing is `window`; the funnel glass is `window-2`
 * (it is lit, blue in reality, here warm like the rest).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { TAU, add, box, face, flat, lathe, mul, tube, unit } from './munich-olympiaturm'

// ---------------------------------------------------------------- data ---
const ROOF: [number, number][] = [[69.89, -45.17], [74.65, -55.26], [75.93, -61.57], [75.77, -65.78], [74.4, -70.95], [71.64, -75.92], [67.79, -79.96], [61.86, -83.43], [54.84, -84.95], [49.44, -84.59], [43.29, -83.38], [32.37, -82.3], [-15.68, -73.5], [-51.14, -66.21], [-51.2, 67.9], [-51.28, 76.33], [-44.12, 79.68], [-35.94, 83.5], [-7.94, 96.58], [0.18, 100.62], [38.87, 22.33], [60.41, -23.43], [65.06, -33.13], [65.55, -34.34]]
const HALL: [number, number][] = [[-49.0, -64.34], [-49.87, 73.84], [-34.59, 80.71], [-6.28, 93.51], [-0.73, 95.97], [37.18, 21.4], [60.8, -29.27], [39.18, -43.51], [37.9, -44.49], [34.85, -47.6], [32.41, -51.33], [30.79, -55.4], [29.98, -59.99], [31.59, -70.29], [33.54, -80.28], [-37.36, -66.63]]
const PAVILION: [number, number][] = [[-35.94, 83.5], [-34.59, 80.71], [-6.28, 93.51], [-7.94, 96.58], [-10.84, 101.63], [-11.93, 103.53], [-17.62, 113.9], [-18.54, 115.9], [-29.5, 110.98], [-45.84, 103.65], [-44.9, 101.47], [-40.82, 93.25]]
const CONE: V3 = [54.9, -61.5, 0]

const silver = new Part() // roof fascia and soffit, the lower cone
const roofTop = new Part() // the roof's upper surface (photovoltaics)
const win = new Part()    // the hall's curtain wall
const funnel = new Part() // the funnel's glass
const trim = new Part()   // mullions, the pavilion, the funnel's grid
const dark = new Part()   // hall roof seen between, plinth shadow

// ---------------------------------------------------------- the fields ---
const G = (x: number, y: number, cx: number, cy: number, s: number) => Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (2 * s * s))
const dCone = (x: number, y: number) => Math.hypot(x - CONE[0], y - CONE[1])
/** The roof's top: 22 m, rising over the cone and toward the north end, a dip between. */
const zTop = (x: number, y: number) => 22.2 + 2.0 * G(x, y, CONE[0], CONE[1], 24) + 2.0 * G(x, y, -12, 92, 30) - 4.2 * G(x, y, 36, 22, 22) - 0.6 * G(x, y, -5, 0, 35) + 0.5 * G(x, y, -51, -66, 25)
/** The funnel's profile, [r, z] from the waist to the rim. */
const FUN: [number, number][] = [[8.0, 13.0], [10.5, 15.5], [14.0, 17.8], [17.5, 19.8], [21.0, 21.5]]
const funZ0 = (r: number) => {
  for (let k = 0; k < FUN.length - 1; k++) {
    const [r0, z0] = FUN[k], [r1, z1] = FUN[k + 1]
    if (r <= r1) return z0 + ((z1 - z0) * (Math.max(r, r0) - r0)) / (r1 - r0)
  }
  return FUN[FUN.length - 1][1]
}
/**
 * The funnel's rim is high on the open south-east side (22 m) and low on
 * the hall side, where the soffit sweeps down into it (17.4 m).
 */
const A_SE = -Math.PI / 4
const rimZ = (a: number) => 20.4 + 2.8 * Math.cos(a - A_SE)
const funZ = (r: number, a: number) => 13.0 + ((funZ0(r) - 13.0) * (rimZ(a) - 13.0)) / (21.5 - 13.0)
const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))
/**
 * The soffit: 17 m, the south-west nose curling down; round the cone it is
 * the funnel itself, rising to the rim at 22 m and easing back to 17 m
 * over the next 13 m.
 */
function zBot(x: number, y: number) {
  const z = 17.0 - 5.6 * G(x, y, -51, -66, 16) - 3.2 * G(x, y, 36, 22, 20)
  const d = dCone(x, y), a = Math.atan2(y - CONE[1], x - CONE[0])
  if (d <= 21) return funZ(d, a)
  return z + (rimZ(a) - z) * (1 - smooth((d - 21) / 13))
}

// ------------------------------------------------------------- the roof ---
/** Resample a closed polygon to points no further apart than `step`. */
function resample(poly: [number, number][], step: number) {
  const out: [number, number][] = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step))
    for (let k = 0; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n])
  }
  return out
}
const area = (p: [number, number][]) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
{
  let rim = resample(ROOF, 6.5)
  if (area(rim) < 0) rim = rim.reverse() // counter-clockwise from above
  const C: [number, number] = [12, -12] // the roof is star-shaped about here
  const S = [0, 0.3, 0.55, 0.75, 0.88, 0.96, 1]
  const at = (p: [number, number], s: number): [number, number] => [C[0] + (p[0] - C[0]) * s, C[1] + (p[1] - C[1]) * s]
  const n = rim.length
  // Smooth normals for a height field from finite differences.
  const nTop = (x: number, y: number): V3 => { const e = 0.5; return unit([-(zTop(x + e, y) - zTop(x - e, y)) / (2 * e), -(zTop(x, y + e) - zTop(x, y - e)) / (2 * e), 1]) }
  const nBot = (x: number, y: number): V3 => { const e = 0.5; return unit([(zBot(x + e, y) - zBot(x - e, y)) / (2 * e), (zBot(x, y + e) - zBot(x, y - e)) / (2 * e), -1]) }
  for (let k = 0; k < S.length - 1; k++) {
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const q = [at(rim[i], S[k]), at(rim[j], S[k]), at(rim[j], S[k + 1]), at(rim[i], S[k + 1])]
      const T = q.map(([x, y]) => [x, y, zTop(x, y)] as V3), B = q.map(([x, y]) => [x, y, zBot(x, y)] as V3)
      if (k === 0) {
        roofTop.tri(T[0], T[2], T[3], undefined, undefined, undefined, [nTop(...q[0]), nTop(...q[2]), nTop(...q[3])])
        silver.tri(B[0], B[3], B[2], undefined, undefined, undefined, [nBot(...q[0]), nBot(...q[3]), nBot(...q[2])])
      } else {
        face(roofTop, T, q.map((p) => nTop(...p)))
        face(silver, B, q.map((p) => nBot(...p)))
      }
    }
  }
  // The fascia: from the top edge out over a rounded lip and back in to the
  // soffit, so the edge reads thick and soft.
  const out = (p: [number, number]): [number, number] => {
    const d = [p[0] - C[0], p[1] - C[1]], l = Math.hypot(d[0], d[1])
    return [d[0] / l, d[1] / l]
  }
  const prof = (p: [number, number]): V3[] => {
    const [x, y] = p, o = out(p), zt = zTop(x, y), zb = zBot(x, y), h = zt - zb
    const P = (dx: number, z: number): V3 => [x + o[0] * dx, y + o[1] * dx, z]
    return [P(0, zt), P(0.9, zt - 0.25 * h), P(1.1, zt - 0.55 * h), P(0.6, zb + 0.12 * h), P(0, zb)]
  }
  const profs = rim.map(prof)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    for (let k = 0; k < 4; k++) {
      const a = profs[i][k], b = profs[j][k], c = profs[j][k + 1], d = profs[i][k + 1]
      const nrm = (pp: V3[], q: number, base: [number, number]): V3 => {
        const o = out(base), lip = [0.95, 0.75, 0.2, -0.75, -0.95][q]
        return unit([o[0] * Math.sqrt(1 - lip * lip), o[1] * Math.sqrt(1 - lip * lip), lip])
      }
      face(silver, [a, b, c, d], [nrm(profs[i], k, rim[i]), nrm(profs[j], k, rim[j]), nrm(profs[j], k + 1, rim[j]), nrm(profs[i], k + 1, rim[i])])
    }
  }
}

// ------------------------------------------------------------- the hall ---
{
  let hall = HALL.slice()
  if (area(hall) < 0) hall = hall.reverse()
  const Z1 = 17.2
  for (let i = 0; i < hall.length; i++) {
    const a = hall[i], b = hall[(i + 1) % hall.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0], nrm: V3 = [t[1], -t[0], 0]
    flat(silver, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], 4.6], [a[0], a[1], 4.6]], nrm)
    flat(win, [[a[0], a[1], 4.6], [b[0], b[1], 4.6], [b[0], b[1], Z1], [a[0], a[1], Z1]], nrm)
    // fine dark mullions every 4.5 m and two transoms, just proud of the glass
    const nm = Math.max(1, Math.round(L / 4.5))
    for (let k = 0; k <= nm; k++) {
      if (k === 0) continue
      const p: V3 = [a[0] + t[0] * (L * k) / nm, a[1] + t[1] * (L * k) / nm, 0]
      const q0 = add(add(p, mul(nrm, 0.08)), mul(t, -0.09)), q1 = add(add(p, mul(nrm, 0.08)), mul(t, 0.09))
      flat(dark, [[q0[0], q0[1], 4.6], [q1[0], q1[1], 4.6], [q1[0], q1[1], Z1], [q0[0], q0[1], Z1]], nrm)
    }
    for (const z of [4.8, 11.0]) {
      const p0 = add([a[0], a[1], 0], mul(nrm, 0.07)), p1 = add([b[0], b[1], 0], mul(nrm, 0.07))
      flat(dark, [[p0[0], p0[1], z - 0.1], [p1[0], p1[1], z - 0.1], [p1[0], p1[1], z + 0.1], [p0[0], p0[1], z + 0.1]], nrm)
    }
  }
}
// The north pavilion (4 m).
{
  let pv = PAVILION.slice()
  if (area(pv) < 0) pv = pv.reverse()
  const ring = (z: number) => pv.map(([x, y]) => [x, y, z] as V3)
  trim.loft([ring(0), ring(4)])
  const c: V3 = [pv.reduce((s, p) => s + p[0], 0) / pv.length, pv.reduce((s, p) => s + p[1], 0) / pv.length, 4]
  for (let i = 0; i < pv.length; i++) dark.tri(c, ring(4)[i], ring(4)[(i + 1) % pv.length])
}

// -------------------------------------------------------- the double cone ---
// Lower cone, silver and faceted, from the ground to the waist.
lathe([[18.6, 0], [18.6, 1.2], [15.0, 3.4], [11.5, 6.4], [9.2, 9.5], [8.2, 12.0], [8.0, 13.0]], () => silver, 24, 25, CONE)
// Upper funnel, glass, from the waist out to the roof's rim.
{
  const M = 32, RS = [8.0, 9.2, 10.5, 12.2, 14.0, 15.8, 17.5, 19.3, 21.0]
  const P = (r: number, a: number): V3 => [CONE[0] + r * Math.cos(a), CONE[1] + r * Math.sin(a), funZ(r, a)]
  const N = (r: number, a: number): V3 => {
    const e = 0.3, dz = (funZ(r + e, a) - funZ(r - e, a)) / (2 * e)
    return unit([Math.cos(a), Math.sin(a), -dz])
  }
  for (let k = 0; k < RS.length - 1; k++) {
    for (let s = 0; s < M; s++) {
      const a0 = (s / M) * TAU, a1 = ((s + 1) / M) * TAU
      face(funnel, [P(RS[k], a0), P(RS[k], a1), P(RS[k + 1], a1), P(RS[k + 1], a0)], [N(RS[k], a0), N(RS[k], a1), N(RS[k + 1], a1), N(RS[k + 1], a0)])
    }
  }
}
// Its diamond grid: two families of helical members, real tubes.
{
  const NH = 12, SEG = 6
  for (const dir of [1, -1]) {
    for (let j = 0; j < NH; j++) {
      const pts: V3[] = []
      for (let q = 0; q <= SEG; q++) {
        const r = 8.1 + ((20.8 - 8.1) * q) / SEG
        const a = (j / NH) * TAU + dir * (q / SEG) * (TAU / NH) * 2
        const e = 0.3, dz = (funZ(r + e, a) - funZ(r - e, a)) / (2 * e)
        const n = unit([Math.cos(a), Math.sin(a), -dz])
        pts.push(add([CONE[0] + r * Math.cos(a), CONE[1] + r * Math.sin(a), funZ(r, a)], mul(n, 0.15)))
      }
      for (let q = 0; q < SEG; q++) tube(trim, pts[q], pts[q + 1], 0.2, 0.2, 4, false)
    }
  }
  // the waist ring
  lathe([[8.05, 12.6], [8.45, 12.8], [8.45, 13.4], [8.05, 13.6]], () => trim, 20, 30, CONE)
}

// -------------------------------------------------------------- output ---
const parts = [
  { part: silver, material: finish('bmw-welt-silver', 0xd0d4d7, 0.4) },
  { part: roofTop, material: { ...PALETTE.roof, color: 0xcdd2d6, roughness: 0.35 } },
  { part: win, material: { ...PALETTE.window, color: 0x4e6568 } },
  { part: funnel, material: windowVariant(2, 0x587073) },
  { part: trim, material: PALETTE.trim },
  { part: dark, material: finish('bmw-welt-dark', 0x3d4549) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('BMW Welt', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 24.5, osm: 'way/15804929',
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const outPath = new URL('../models/munich-bmw-welt.glb', import.meta.url).pathname
await Bun.write(outPath, glb)
console.log(`${outPath}: ${triangles} triangles, ${glb.length} bytes`)
