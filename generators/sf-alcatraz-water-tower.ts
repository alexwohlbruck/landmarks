/**
 * Alcatraz water tower, San Francisco — original procedural geometry, CC0-1.0.
 * bun generators/sf-alcatraz-water-tower.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin = centroid of
 * the OSM outline way/660870452 (the tank's circle).
 *
 * Evidence
 * - OSM way/660870452: a circle of r ~6.7 m, no height. OSM on Alcatraz sits
 *   10-14 m west of the 2023 lidar (and agrees with NAIP), consistently for
 *   every feature; the model keeps OSM's position so it lines up with the
 *   map's paths, and takes every dimension from the lidar.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.25 m: the tank roof's
 *   eave at r 6.5-7.0 m sits 28.5 m above the pad (30.0 m NAVD88, y = 0),
 *   the roof cone rises to 31.0 m, a vent cap to 31.6 m. Six legs show past the
 *   tank's shadow at r ~7.5 m, bearings -15, 45, 105, 165, 225 and 285°.
 * - Published (Wikipedia "Alcatraz water tower"): built 1940-41, 94 ft
 *   (29 m), 250,000 US gal, six cross-braced steel legs on concrete footings;
 *   restored and repainted 2012.
 * - Commons daylight photos: "San Francisco (CA, USA), Alcatraz, Water Tower
 *   -- 2022 -- 3106.jpg" and "... -- 3136.jpg" (Dietmar Rabich, CC BY-SA
 *   4.0: legs, two tiers of X bracing, the catwalk, the round-bottomed bowl,
 *   the overhanging roof lip), "Water tower at Alcatraz prison, with Native
 *   American graffiti.jpg" (Pnw4077, CC BY-SA 4.0), "Alcatraz Island viewed
 *   from the north.jpg" (RL0919, CC BY-SA 4.0), "Alcatraz Island, helicopter
 *   view.jpg" (Kitchen, CC BY 2.0).
 *
 * Estimated: the cylinder (r 6.2 m, 5.4 m tall) and bowl (4.3 m deep), from
 * the photos' proportions and the published volume (~950 m3 checks out); the
 * legs' batter (r 8.0 m at the ground to 6.1 m under the catwalk at 23 m); the strut
 * ring at 12 m, all scaled off a level view from the north; member sizes,
 * thickened so they read at phone size. The roof cone is rust-brown, as the
 * aerials show it, pulled to the palette's lightness; the legs and bracing are
 * a shade darker than the tank so the frame reads. The
 * red graffiti is lettering and is left out; the railings are too thin to draw.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const ANCHOR = { lng: -122.4239316, lat: 37.8275728 }
const paint = new Part(), steel = new Part(), roof = new Part()

const SEG = 24
const ring = (r: number, z: number, n = SEG): V3[] =>
  Array.from({ length: n }, (_, i) => [r * Math.cos((2 * Math.PI * i) / n), r * Math.sin((2 * Math.PI * i) / n), z] as V3)

/** Smooth-shaded surface of revolution through (r, z) profile points, bottom to top. */
function lathe(p: Part, prof: [number, number][], n = SEG) {
  // normals from the profile's slope
  const nrm = prof.map((_, k) => {
    const a = prof[Math.max(0, k - 1)], b = prof[Math.min(prof.length - 1, k + 1)]
    const dr = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dr, dz) || 1
    return [dz / l, -dr / l] as [number, number] // outward radial, up
  })
  for (let k = 0; k < prof.length - 1; k++) {
    for (let i = 0; i < n; i++) {
      const t0 = (2 * Math.PI * i) / n, t1 = (2 * Math.PI * (i + 1)) / n
      const P = (r: number, z: number, t: number): V3 => [r * Math.cos(t), r * Math.sin(t), z]
      const N = (kk: number, t: number): V3 => [nrm[kk][0] * Math.cos(t), nrm[kk][0] * Math.sin(t), nrm[kk][1]]
      const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
      const a = P(r0, z0, t0), b = P(r0, z0, t1), c = P(r1, z1, t1), d = P(r1, z1, t0)
      if (r0 > 1e-6) p.tri(a, b, c, undefined, undefined, undefined, [N(k, t0), N(k, t1), N(k + 1, t1)])
      if (r1 > 1e-6) p.tri(a, c, d, undefined, undefined, undefined, [N(k, t0), N(k + 1, t1), N(k + 1, t0)])
    }
  }
}

/** A square-section member from a to b, w wide, flat-shaded and capped. */
function beam(p: Part, a: V3, b: V3, w: number) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const L = Math.hypot(...d), u: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const ref: V3 = Math.abs(u[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const cr = (x: V3, y: V3): V3 => [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]]
  const nz = (v: V3): V3 => { const l = Math.hypot(...v); return [v[0] / l, v[1] / l, v[2] / l] }
  const s = nz(cr(u, ref)), t = cr(s, u), h = w / 2
  const corner = (o: V3, i: number): V3 => {
    const [cs, ct] = [[-1, -1], [1, -1], [1, 1], [-1, 1]][i]
    return [o[0] + s[0] * h * cs + t[0] * h * ct, o[1] + s[1] * h * cs + t[1] * h * ct, o[2] + s[2] * h * cs + t[2] * h * ct]
  }
  const A = [0, 1, 2, 3].map((i) => corner(a, i)), B = [0, 1, 2, 3].map((i) => corner(b, i))
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    p.quad(A[i], A[j], B[j], B[i])
  }
  p.quad(B[0], B[1], B[2], B[3])
  p.quad(A[3], A[2], A[1], A[0])
}

// --- Heights (y = 0 on the pad) ---
const Z_BOWL = 18.7, Z_DECK = 23.0, Z_EAVE = 28.4, Z_APEX = 31.0
const R_TANK = 6.2, R_LIP = 6.75, R_DECK = 7.1

// Tank: round bottom, cylinder, overhanging roof lip, shallow cone.
{
  const bowl: [number, number][] = []
  for (let k = 0; k <= 6; k++) {
    const a = (Math.PI / 2) * (k / 6)
    bowl.push([R_TANK * Math.sin(a), Z_DECK - (Z_DECK - Z_BOWL) * Math.cos(a)])
  }
  lathe(paint, bowl)
  lathe(paint, [[R_TANK, Z_DECK], [R_TANK, Z_EAVE - 0.15]])
  // the lip: a short flared skirt under the roof edge
  lathe(paint, [[R_TANK, Z_EAVE - 0.6], [R_LIP, Z_EAVE - 0.15], [R_LIP, Z_EAVE]])
  lathe(roof, [[R_LIP, Z_EAVE], [R_LIP * 0.5, Z_EAVE + (Z_APEX - Z_EAVE) * 0.55], [0.6, Z_APEX - 0.05], [0, Z_APEX]])
  // vent cap on the apex
  lathe(roof, [[0, Z_APEX - 0.2], [0.45, Z_APEX - 0.1], [0.45, Z_APEX + 0.45], [0, Z_APEX + 0.6]], 8)
}

// Catwalk: a flat ring round the base of the cylinder, with its fascia.
{
  const top = ring(R_DECK, Z_DECK), bot = ring(R_DECK, Z_DECK - 0.35), inT = ring(R_TANK - 0.05, Z_DECK), inB = ring(R_TANK - 0.05, Z_DECK - 0.35)
  for (let i = 0; i < SEG; i++) {
    const j = (i + 1) % SEG
    steel.quad(inT[i], top[i], top[j], inT[j]) // deck, facing up
    steel.quad(inB[j], bot[j], bot[i], inB[i]) // soffit
    steel.quad(bot[i], bot[j], top[j], top[i]) // fascia
  }
}

// Legs, struts and bracing.
const LEG_W = 0.55, BRACE_W = 0.32
const legAng = [-15, 45, 105, 165, 225, 285].map((b) => (b * Math.PI) / 180) // bearings, clockwise from north
const legAt = (k: number, z: number): V3 => {
  const r = 8.0 + (6.1 - 8.0) * (z / Z_DECK), b = legAng[k]
  return [r * Math.sin(b), r * Math.cos(b), z]
}
const TIERS = [0.4, 12.0, Z_DECK - 0.4]
for (let k = 0; k < 6; k++) {
  const l = (k + 1) % 6
  beam(steel, legAt(k, 0), legAt(k, Z_DECK), LEG_W)
  beam(steel, legAt(k, TIERS[1]), legAt(l, TIERS[1]), BRACE_W) // strut ring
  for (let t = 0; t < 2; t++) {
    const z0 = TIERS[t], z1 = TIERS[t + 1]
    beam(steel, legAt(k, z0), legAt(l, z1), BRACE_W)
    beam(steel, legAt(l, z0), legAt(k, z1), BRACE_W)
  }
}
// Central riser under the bowl.
beam(steel, [0, 0, 0], [0, 0, Z_BOWL + 0.2], 0.45)

const parts = [
  { part: paint, material: finish('tank-paint', 0xdfe3e3) },
  { part: steel, material: finish('pale-steel', 0xb3babe) },
  { part: roof, material: finish('rust-roof', 0xae8b79) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Alcatraz water tower', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: Z_APEX + 0.6,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/660870452'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-alcatraz-water-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
