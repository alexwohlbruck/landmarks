/**
 * T-Mobile Center (opened 2007 as the Sprint Center; Downtown Arena Design
 * Team: HOK Sport, 360 Architecture, Rafael Architects, Ellerbe Becket),
 * 1407 Grand Boulevard, Kansas City, Missouri — original procedural
 * geometry, CC0-1.0.
 * bun generators/kc-t-mobile-center.ts
 *
 * Map frame: x east, y north, z up, metres, in the oval's own axes: the
 * long axis is y, placed at bearing 328.8° (OSM outline's long axis,
 * 148.8°/328.8°). Origin: the OSM outline's centroid, which is also the
 * centre of the fitted ellipse within 0.2 m; z = 0 at the lowest ground
 * at the foot of the drum (the west side, lidar 262.1 m).
 *
 * Identity, from the photos:
 *  1. a smooth oval drum, all glass, that bulges like a barrel: widest
 *     about a third of the way up, curving in hard under the roof edge
 *     and a little toward the base (Barera 2022; Charvex 2008);
 *  2. the glass reads light and silvery by day, in horizontal tiers of
 *     panels; it glows at night (lit LED behind the glass);
 *  3. a dark stone plinth, set back under the glass, about 5 m high on
 *     the low side (Barera; Charvex);
 *  4. a pale, shallow domed roof (NAIP; Baylor98). The assignment's "dark
 *     band roof" isn't borne out: the roof membrane is near-white in NAIP
 *     and in Baylor98's elevated view; the only dark band is the plinth.
 *
 * Evidence:
 *  - OSM way/38501411 (building=yes, roof:shape=dome, height 34, "T-Mobile
 *    Center"): a near-perfect ellipse, semi-axes 67.4 × 84.3 m (fitted;
 *    every vertex within 2% of it).
 *  - Lidar, measured: USGS 3DEP MO_FEMANRCS_1_2020 (2020 flight), 1 m grid,
 *    read in this frame (lidar_frame.py, bearing 328.8). Above the lowest
 *    ground (ground_min + 4.1): roof edge 31.4 all round, at ≥0.97 of the
 *    OSM ellipse; the roof is flat out there and domes up inside 0.8 of
 *    the ellipse to 37.4 at the centre. Ground around the drum: 0 (west)
 *    to 6.7 (north-east).
 *  - Terrain: Mapterhorn z15 (terrain.ts grid): the ground rises about
 *    7 m from the south-west to the north-east of the footprint.
 *  - Estimated from the photos (scaled by the lidar roof edge): plinth
 *    5.5 m, set back 2.5 m under the glass; the bulge (widest, at the OSM
 *    outline, 15 m up); the turn-in under the roof; the tier lines.
 *
 * Night: the glass is `window` and glows (the cladding is lit from behind
 * after dark); the roof and plinth are unlit.
 *
 * Photos (evidence):
 *  - Kansas City June 2022 14 (T-Mobile Center).jpg, Michael Barera,
 *    CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Kansas_City_June_2022_14_(T-Mobile_Center).jpg
 *  - Sprint Center Kansas City Missouri.jpg, Charvex, public domain,
 *    https://commons.wikimedia.org/wiki/File:Sprint_Center_Kansas_City_Missouri.jpg
 *  - Sprint Center and Power & Light District.JPG, Baylor98, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Sprint_Center_and_Power_%26_Light_District.JPG
 *  - USGS NAIP orthophoto (public domain) for the roof. No commercial
 *    imagery.
 *
 * Doubts: the entrance canopy at the south-west (OSM way/118650980,
 * building=roof) and the College Basketball Experience annex on the north
 * (way/118650974) are left to the map. The tier lines are fewer than the
 * real panel courses.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish, windowVariant } from './palette'

const A = 67.4, B = 84.3 // OSM ellipse semi-axes (x, y)
const RIM = 31.4 // roof edge (lidar)
const CROWN = 37.4 // roof centre (lidar)
const PLINTH = 5.5

// The ground at the foot of the drum, every 1/56 turn from +x
// counter-clockwise: lidar bare earth just outside the outline (median of
// r 1.03–1.11), above z = 0; gaps (buildings, ramps) interpolated; the
// loading-dock ramp on the west-south-west (−3.9) taken as the street (0).
const GROUND = [5.7, 5.7, 5.8, 5.7, 5.7, 5.5, 5.3, 5.4, 5.5, 6.0, 6.7, 5.4, 4.1, 2.9, 1.6, 1.5, 1.2, 1.1, 0.9, 0.7, 0.6,
  0.5, 0.3, 0.2, 0.1, 0, 0, 0, 0.1, 0, 0, 0, 0, 0.3, 0.7, 1.0, 1.3, 1.6, 1.6, 1.6, 2.0, 2.7, 3.3, 3.9, 4.4, 4.8,
  4.9, 5.3, 5.4, 5.5, 5.7, 5.7, 5.9, 6.0, 5.9, 5.7]
const N = GROUND.length // around the oval
/** Foot of the glass: the plinth stands 5.5 m over the street all round. */
const foot = (i: number) => GROUND[i % N] + PLINTH

// The drum's section: (scale of the OSM ellipse, t), t = 0 at the foot of
// the glass and 1 at the roof edge; the bulge is drawn for the low (west)
// side, where it was measured, and stretched or squeezed with the foot.
const GLASS: [number, number][] = [
  [0.988, 0], [0.996, 0.15], [1.0, 0.38], [0.999, 0.6], [0.995, 0.76], [0.988, 0.88], [0.978, 0.955], [0.97, 1],
]
const zAt = (t: number, i: number) => foot(i) + (RIM - foot(i)) * t
const ang = (i: number) => (i / N) * Math.PI * 2
const at = (s: number, i: number, z: number): V3 => [A * s * Math.cos(ang(i)), B * s * Math.sin(ang(i)), z]
/** The ellipse's outward normal at i, tilted by the section's slope (dr/dz). */
function nrm(i: number, drdz: number): V3 {
  const nx = Math.cos(ang(i)) / A, ny = Math.sin(ang(i)) / B, l = Math.hypot(nx, ny)
  const h = 1 / Math.hypot(1, drdz)
  return [(nx / l) * h, (ny / l) * h, -drdz * h]
}

const glass = new Part(), plinth = new Part(), roof = new Part(), trim = new Part()

// Glass drum, smooth.
for (let k = 0; k < GLASS.length - 1; k++) {
  const [s0, z0] = GLASS[k], [s1, z1] = GLASS[k + 1]
  const slope = (k: number) => {
    const a = GLASS[Math.max(0, k - 1)], b = GLASS[Math.min(GLASS.length - 1, k + 1)]
    return ((b[0] - a[0]) * 75) / ((b[1] - a[1]) * (RIM - PLINTH))
  }
  const d0 = slope(k), d1 = slope(k + 1)
  for (let i = 0; i < N; i++) {
    const j = i + 1
    const P = [at(s0, i, zAt(z0, i)), at(s0, j, zAt(z0, j)), at(s1, j, zAt(z1, j)), at(s1, i, zAt(z1, i))]
    const Q = [nrm(i, d0), nrm(j, d0), nrm(j, d1), nrm(i, d1)]
    glass.tri(P[0], P[1], P[2], undefined, undefined, undefined, [Q[0], Q[1], Q[2]])
    glass.tri(P[0], P[2], P[3], undefined, undefined, undefined, [Q[0], Q[2], Q[3]])
  }
}
// The glass's underside, from the plinth out to the foot of the glass.
const SP = 0.955 // plinth's ellipse scale (set back ≈2.5 m)
for (let i = 0; i < N; i++) {
  const j = i + 1
  plinth.quad(at(SP, i, foot(i)), at(SP, j, foot(j)), at(GLASS[0][0], j, foot(j)), at(GLASS[0][0], i, foot(i)))
  // the plinth wall, down into the ground on the high side
  plinth.quad(at(SP, i, 0), at(SP, j, 0), at(SP, j, foot(j)), at(SP, i, foot(i)))
}
// Roof: flat ring out to 0.8, then a shallow dome to the crown.
const ROOF_RINGS: [number, number][] = [[0.97, RIM], [0.8, RIM + 0.15]]
for (let k = 1; k <= 5; k++) {
  const r = 0.8 * (1 - k / 5)
  ROOF_RINGS.push([r, RIM + 0.15 + (CROWN - RIM - 0.15) * (1 - (r / 0.8) ** 2)])
}
for (let k = 0; k < ROOF_RINGS.length - 1; k++) {
  const [s0, z0] = ROOF_RINGS[k], [s1, z1] = ROOF_RINGS[k + 1]
  for (let i = 0; i < N; i++) {
    const j = i + 1
    if (s1 < 1e-6) roof.tri(at(s0, i, z0), at(s0, j, z0), [0, 0, z1])
    else roof.quad(at(s0, i, z0), at(s0, j, z0), at(s1, j, z1), at(s1, i, z1))
  }
}
// A few pale tier lines on the glass, standing 0.12 m proud.
const scaleAt = (t: number) => {
  for (let k = 0; k < GLASS.length - 1; k++) {
    const [s0, t0] = GLASS[k], [s1, t1] = GLASS[k + 1]
    if (t >= t0 && t <= t1) return s0 + ((s1 - s0) * (t - t0)) / (t1 - t0)
  }
  return GLASS[GLASS.length - 1][0]
}
// Pale vertical fins at every panel joint (every 1/56 turn), each running over two
// of three height bands, staggered fin to fin: the broken vertical rhythm
// of the cladding (Charvex; Barera).
const BANDS: [number, number][] = [[0.04, 0.36], [0.36, 0.68], [0.68, 0.96]]
for (let i = 0; i < N; i++) {
  const skip = (i * 2) % 3
  BANDS.forEach(([ta, tb], k) => {
    if (k === skip) return
    const steps = 3, d = 0.18 / 75, hw = 0.35 / 75 // proud and half-width, as ellipse scale
    for (let q = 0; q < steps; q++) {
      const t0 = ta + ((tb - ta) * q) / steps, t1 = ta + ((tb - ta) * (q + 1)) / steps
      const fi = i - hw * N / (2 * Math.PI) * 1.0, fj = i + hw * N / (2 * Math.PI) * 1.0 // a narrow angular width
      const P = (f: number, t: number, out: number): V3 => at(scaleAt(t) + out, f, zAt(t, i))
      // front face and its two sides
      trim.quad(P(fi, t0, d), P(fj, t0, d), P(fj, t1, d), P(fi, t1, d))
      trim.quad(P(fi, t0, 0), P(fi, t0, d), P(fi, t1, d), P(fi, t1, 0))
      trim.quad(P(fj, t0, d), P(fj, t0, 0), P(fj, t1, 0), P(fj, t1, d))
    }
  })
}

// --- write ------------------------------------------------------------------
const parts: Array<{ part: Part; material: MaterialSpec }> = [
  // mid grey-blue reflective glass (Barera; Charvex), lit from behind at night
  { part: glass, material: windowVariant(2, 0x8ea2b2) },
  { part: plinth, material: finish('plinth', 0x6b6f73) },
  { part: roof, material: finish('roof-membrane', 0xe1e2de) },
  { part: trim, material: finish('mullion', 0xd9e0e5, 0.5) },
]
const triangles = parts.reduce((a, { part }) => a + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name}: ${part.triangles}`).join(', '))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('T-Mobile Center', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: CROWN, bearing: 328.8,
})
await Bun.write(new URL('../models/kc-t-mobile-center.glb', import.meta.url), glb)
console.log(`kc-t-mobile-center.glb: ${triangles} triangles, ${glb.length} bytes`)
